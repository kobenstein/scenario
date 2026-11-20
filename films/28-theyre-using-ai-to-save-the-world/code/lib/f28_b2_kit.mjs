// Film 28 · builder B2 (c07–c10, 'Casey Harrell knows' → 'The snake') · shared helpers of the B2 group.
// Owned by B2. Built on lib/f28_kit.mjs + lib/f28_seams.mjs (never edited from here).
//   anchors(T)            every phrase time of c07–c10 in one table (phrases only, never seconds)
//   aimPath(t, K)         camera keys [t, u, v, s, ease?] on ONE reference card → { u, v, s } (monotone cubic in u, v, log s; ease 'i'/'o'
//                         on a key makes the segment INTO that key an expo dive like E.camAt) · camOf(Z, p, sx, sy)
//   dashTag               the calm caveat tag (dashed cool outline, cream caps, on a string; swings in)
//   railPulse             subscribe 1: a warm pulse handed along the rail lamps 12 → 7
//   oSky                  a night sky gradient that also honours an OUTER screen transform (seen through a window)
//   ship · boatTop · tower · loco · hut   small flat props of the B2 stations
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const TAU = Math.PI * 2;

// ================================================================================================= ANCHORS
export function anchors(T) {
  const G = (p, after = -1) => T.G(p, 0, after), GE = (p, after = -1) => T.GE(p, 0, after);
  const a = {};
  // c07 · No. 7 Casey
  a.casey = G('Casey Harrell knows'); a.brain = G('His brain still', a.casey); a.lips = G('But his lips', a.casey); a.follow = GE('no longer follow', a.casey);
  a.als = G('He has A.L.S', a.casey); a.said = G('He said it felt', a.casey); a.trapped = G('trapped', a.said);
  a.how = G('How do you hear', a.casey); a.body = GE('leaves the body', a.how);
  a.surgeons = G('Surgeons placed', a.casey); a.tongue = GE('lips and tongue', a.surgeons);
  a.learned = G('An A.I. learned which', a.casey); a.sounds = GE('mean which sounds', a.learned);
  a.thoughts = G("It doesn't read his", a.casey); a.only = G('Only the words', a.casey); a.say = GE("he's trying to say", a.only);
  a.then = G('Then it speaks them', a.casey); a.own = G('in his own voice', a.then); a.rebuilt = G('rebuilt from', a.then); a.ill = GE('he fell ill', a.then);
  a.thisis = G('This is that voice', a.casey); a.C3 = T.clip('C3');
  a.oneman = G("It's one man", a.casey); a.notyet = G('not yet a treatment', a.oneman); a.athome = G('But at home', a.oneman);
  a.million = G('two million words', a.athome); a.withit = GE('with it', a.million);
  a.channel = G('This channel exists'); a.arrival = G('so that the arrival', a.channel); a.want = G('Want that too', a.channel); a.subscribe = G('Then subscribe', a.channel);
  a.heard = G('Casey wants to be heard'); a.outsea = G('Out at sea', a.heard); a.seen = G('not be seen', a.outsea);
  // c08 · No. 6 dark ships
  a.big = G('Big ships are supposed'); a.radio = G('on a radio built', a.big); a.collide = GE("don't collide", a.big);
  a.guess = G('Take a guess', a.big); a.howmany = G('how many industrial', a.guess); a.map = GE('the public map', a.guess);
  a.compared = G('An A.I. compared', a.big); a.radar = G('radar pictures', a.compared); a.broadcasts = GE('those broadcasts', a.compared);
  a.answer = G('The answer', a.compared); a.three = G('three in four', a.answer);
  a.darkn = G("Dark doesn't mean", a.answer); a.worst = G("But it's where", a.darkn); a.hide1 = GE('things can hide', a.darkn);
  a.another = G('Another A.I. reads', a.darkn); a.flags = G('and flags those', a.another); a.home = GE('free to go home', a.another);
  a.risk = G("That's a risk", a.another); a.verdict = GE('not a verdict', a.risk);
  a.shiphide = G('A ship can hide', a.risk); a.radiooff = G('its radio off', a.shiphide); a.tsunami = G('A tsunami hides', a.shiphide); a.sight = GE('in plain sight', a.tsunami);
  // c09 · No. 5 tsunami / GPS
  a.open = G('In the open ocean'); a.ripple = G('barely a ripple', a.open); a.howsee = G('How do you see it', a.open); a.land = GE('reaches land', a.howsee);
  a.lookup = G('Look up', a.open); a.rising = G('The rising water', a.lookup); a.shoves = G('shoves the air', a.rising);
  a.push = G('That push climbs', a.rising); a.space = G('to space', a.push); a.gps = G('GPS signals arrive', a.push); a.late = G('tiny bit late', a.push);
  a.same = G('The same signals your phone uses'); a.findway = G('to find your way', a.same); a.clue = G('Another clue', a.same);
  a.read = G('An A.I. learned to read', a.same); a.finger = G('fingerprint', a.read);
  a.nasa = G('NASA switched it on', a.read); a.daybefore = G('the day before', a.nasa); a.russia = GE('off Russia', a.nasa); a.C4 = T.clip('C4');
  a.replay = G("NASA's replay", a.nasa); a.hawaii = G('over Hawaii', a.replay); a.halfhour = G('half an hour before', a.replay); a.gauge = GE('tide gauge there', a.replay);
  a.research = G("It's still a research tool", a.replay); a.half = G('Half an hour can warn', a.research); a.coast = GE('a whole coast', a.half);
  a.elephant = G("But you can't warn", a.half); a.elephantE = GE('warn an elephant', a.half);
  // c10 · No. 4 the elephants and the train
  a.driving = G("You're driving a train"); a.corridor = G('elephant corridor', a.driving); a.india = GE('southern India', a.driving);
  a.bytime = G('By the time your lights', a.driving); a.find = G('find an elephant', a.bytime); a.toolate = G("it's too late", a.bytime);
  a.unless = G('Unless the track', a.bytime); a.cameras = G('Cameras on towers', a.unless); a.heat = G('see heat', a.cameras);
  a.spots = G('An A.I. spots', a.cameras); a.driver = G('warns the driver', a.spots); a.rangers = G('the rangers', a.spots);
  a.thistime = G('This time, the warning', a.spots); a.brakes = G('the train brakes', a.thistime);
  a.stretch = G('On the stretch it watches', a.thistime); a.killed = G('has killed an elephant', a.stretch); a.live = GE('it went live', a.stretch);
  a.giants = G('Elephants are the giants'); a.across = G('But across India', a.giants); a.smaller = G('far smaller animal', a.across); a.hundred = G('a hundred times', a.across);
  a.hides = G('It hides in the grass', a.across); a.snake = G('The snake', a.hides);
  return a;
}

// ================================================================================================= CAMERA
// aimPath(t, K): K = [[t, u, v, s, ease?], …] on one reference card: (u, v) the design point at the screen centre, s its magnification.
// Monotone cubic through the keys in (u, v, log s) (like F.camPath, the ends are arrivals); a key with ease 'i' (expo in, into a light)
// or 'o' (expo out, out of one) makes the segment that ENDS at it a single eased dive instead.
export function aimPath(t, K) {
  const n = K.length; if (n === 1) return { u: K[0][1], v: K[0][2], s: K[0][3] };
  const V = K.map((k) => [k[1], k[2], Math.log(k[3])]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, ez = K[i + 1][4];
  if (ez === 'i' || ez === 'o' || ez === 's') {
    const e = ez === 'i' ? expoIn(u) : ez === 'o' ? expoOut(u) : sineIO(u);
    return { u: lerp(V[i][0], V[i + 1][0], e), v: lerp(V[i][1], V[i + 1][1], e), s: Math.exp(lerp(V[i][2], V[i + 1][2], e)) };
  }
  const out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const hard = (j) => K[j][4] === 'i' || K[j][4] === 'o' || K[j][4] === 's' || (K[j + 1] && (K[j + 1][4] === 'i' || K[j + 1][4] === 'o' || K[j + 1][4] === 's'));
    const tan = (j) => { if (j === 0 || j === n - 1 || hard(j)) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return { u: out[0], v: out[1], s: Math.exp(out[2]) };
}
export const camOf = (Z, p, sx = W / 2, sy = H / 2) => E.aim(Z, p.u, p.v, p.s, sx, sy);
// a quiet drift in SCREEN px (≈ amp) for an aimPath view: shifts (u, v) by drift / s and breathes s by ±0.4 % · amp/2
export const driftView = (p, t, amp = 1, seed = 0) => ({ u: p.u + E.drift(t, 4 * amp, seed) / p.s, v: p.v + E.drift(t, 2.6 * amp, seed + 2) / p.s, s: p.s * (1 + E.drift(t, .004 * amp, seed + 4)) });

// ================================================================================================= SMALL THINGS
// the calm caveat: a paper tag with a DASHED cool outline (not a stamp, not a warning) on a string from (x, y); lines of cream caps
export function dashTag(ctx, t, x, y, lines, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 26, len = o.len ?? 40, k = expoOut(u);
  const tw = Math.max(...lines.map((s, i) => F.measure(s, i ? size * .8 : size, false, 600) + s.length * size * (i ? .08 : .1)));
  const w = tw + size * 1.6, h = size * (1.0 + .95 * lines.length) + size * .4;
  const sw = (o.swing ?? 0) + (1 - k) * .35 + .015 * Math.sin(t * 1.05 + x * .013);
  ctx.save(); if (o.screen !== false) ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(x, y); ctx.rotate(sw); ctx.globalAlpha *= F.rise(u) * (o.a ?? 1);
  ctx.strokeStyle = rgba(P.halo2, .6); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len * k); ctx.stroke();
  const y0 = len * k;
  ctx.fillStyle = rgba(mixHex(P.night1, P.ind0, .5), .92); ctx.beginPath(); ctx.roundRect(-w / 2, y0, w, h, 8); ctx.fill();
  ctx.setLineDash([9, 7]); ctx.lineDashOffset = -t * 6; ctx.strokeStyle = rgba(F.COOL.line, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-w / 2, y0, w, h, 8); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(0, y0 + size * .32, size * .12, 0, TAU); ctx.fill();
  lines.forEach((s, i) => E.glowText(ctx, s, 0, y0 + size * (1.32 + .95 * i), { size: i ? size * .8 : size, weight: 600, spacing: i ? .08 : .1, align: 'center', glow: false, col: i ? F.COOL.text : P.cream }));
  ctx.restore();
  return { w, h };
}
// subscribe 1: a warm pulse handed along the rail lamps 12 → 7 (screen space, top left): each lamp brightens as the pulse passes
export function railPulse(ctx, t, t0, dur = 2.6, from = 12, to = 7) {
  const n = from - to + 1;
  for (let i = 0; i < n; i++) {
    const L = from - i, [x, y, s] = F.railPos(L), tc = t0 + dur * i / (n - 1), b = Math.exp(-(((t - tc) / .32) ** 2));
    if (b < .02) continue;
    const gy = y + F.RAIL.len + s * .2 + s / 2;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); halo(ctx, x, gy, s * 2.4, .65 * b, P.halo0, P.core0); ctx.restore();
  }
  // the light travelling along the wire between lamps
  const u = span(t, t0, t0 + dur); if (u <= 0 || u >= 1) return;
  const xA = F.railPos(from)[0], xB = F.railPos(to)[0], x = lerp(xA, xB, sineIO(u)), y = F.RAIL.y + 4 + 3 * Math.sin(Math.PI * (x - F.RAIL.x + 24) / (11 * F.RAIL.gap + 48));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); halo(ctx, x, y, 18, .8 * Math.sin(Math.PI * u), P.halo0, P.core0); ctx.restore();
}
// a night sky gradient on the screen whose horizon follows card Z_HOR's design line hor, honouring an outer screen transform O { k, e, f }
export function oSky(ctx, c, t, o = {}) {
  const O = o.outer, p = E.project(c, o.Z ?? F.Z_HOR, 0, o.hor ?? 640) || [0, H * .7];
  const hy = O ? O.k * p[1] + O.f : p[1], kk = O ? O.k : 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, hy - 1100 * kk, 0, hy + 40 * kk, [[0, P.night0], [.6, P.night1], [.93, mixHex(P.ind0, P.blue0, .35)], [1, mixHex(P.ind0, P.blue0, .5)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, c, 40000, () => E.stars(ctx, o.seed ?? 51, 900, t, [-9000, -7000, 26000, 7600], o.stars ?? 1));
}
// a ship seen from the side, bow to the right: (x, y) = the waterline centre, s = length. o { a, lit 0..1 (deck lights), mast 0..1
//   (the masthead light), ring 0..1 (radio rings from the mast top, cool), seed, kind 'cargo'|'fish' }
export function ship(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const lit = clamp(o.lit ?? 1), kind = o.kind ?? 'cargo', r = prng(o.seed ?? 3);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  const L = s, hh = kind === 'cargo' ? s * .11 : s * .16;
  const hull = new Path2D(); hull.moveTo(-L / 2, -hh); hull.lineTo(L / 2 + L * .05, -hh * 1.15); hull.lineTo(L / 2 - L * .04, 0); hull.lineTo(-L / 2 + L * .03, 0); hull.closePath();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .35); ctx.fill(hull);
  ctx.strokeStyle = rgba(P.blue0, .6); ctx.lineWidth = Math.max(1, s * .008); ctx.beginPath(); ctx.moveTo(-L / 2, -hh); ctx.lineTo(L / 2 + L * .05, -hh * 1.15); ctx.stroke();
  let mx, my;
  if (kind === 'cargo') {
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3);
    for (let k = 0; k < 6; k++) { const bx = -L * .38 + k * L * .1, bh = hh * (.6 + .5 * ((k * 7) % 3) / 2); ctx.fillRect(bx, -hh - bh, L * .085, bh); }
    ctx.fillRect(-L * .46, -hh * 2.6, L * .08, hh * 1.6);   // the bridge, aft
    mx = -L * .42; my = -hh * 4.2; ctx.strokeStyle = mixHex(P.night0, P.ind1, .5); ctx.lineWidth = Math.max(1, s * .01); ctx.beginPath(); ctx.moveTo(mx, -hh * 2.6); ctx.lineTo(mx, my); ctx.stroke();
  } else {
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(-L * .1, -hh * 2.1, L * .26, hh * 1.1);
    mx = L * .2; my = -hh * 3.6; ctx.strokeStyle = mixHex(P.night0, P.ind1, .5); ctx.lineWidth = Math.max(1, s * .012); ctx.beginPath(); ctx.moveTo(mx, -hh); ctx.lineTo(mx, my); ctx.lineTo(-L * .42, -hh * 1.05); ctx.stroke();
  }
  // deck lights: a string of small warm points along the hull
  if (lit > 0) { const n = kind === 'cargo' ? 9 : 4; for (let k = 0; k < n; k++) { const px = -L * .44 + k * L * .88 / (n - 1), fl = .85 + .15 * Math.sin(t * 2.1 + k * 1.7 + r() * 6); ctx.fillStyle = rgba(P.core1, lit * fl); ctx.beginPath(); ctx.arc(px, -hh * .55, Math.max(.8, s * .009), 0, TAU); ctx.fill(); }
    halo(ctx, 0, -hh * .6, L * .5, .18 * lit, P.halo0, P.core1); }
  const ml = clamp(o.mast ?? lit);
  if (ml > 0) { halo(ctx, mx, my, Math.max(6, s * .06), .7 * ml, P.halo0, P.core0); ctx.fillStyle = rgba(P.core0, ml); ctx.beginPath(); ctx.arc(mx, my, Math.max(1, s * .012), 0, TAU); ctx.fill(); }
  ctx.restore();
  if ((o.ring ?? 0) > 0) F.radioRings(ctx, t + (o.seed ?? 0) * .37, x + mx, y + my, Math.max(14, s * .32), { a: o.ring * a, col: F.COOL.line, n: 3, speed: .5 });
  return { mast: [x + mx, y + my] };
}
// a boat seen from above (radar picture): (x, y) centre, ang heading, s length. o { a, lit (AIS on: a warm dot + small ring), radar 0..1 (the cool radar return), crew 0..1 }
export function boatTop(ctx, t, x, y, ang, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang);
  const p = new Path2D(); p.moveTo(s * .5, 0); p.quadraticCurveTo(s * .3, -s * .16, -s * .46, -s * .14); p.lineTo(-s * .46, s * .14); p.quadraticCurveTo(s * .3, s * .16, s * .5, 0); p.closePath();
  const rr = clamp(o.radar ?? 1);
  ctx.fillStyle = mixHex(P.night1, mixHex(F.COOL.body, P.cream, .2), .75 * rr); ctx.fill(p);
  if (rr > 0) { ctx.strokeStyle = rgba(F.COOL.core, .7 * rr); ctx.lineWidth = Math.max(1, s * .035); ctx.stroke(p); }
  if ((o.crew ?? 0) > 0) { ctx.fillStyle = rgba(P.halo0, o.crew); for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(-s * .3 + k * s * .14, (k % 2 ? 1 : -1) * s * .045, s * .032, 0, TAU); ctx.fill(); } }
  ctx.restore();
  const lit = clamp(o.lit ?? 0);
  if (lit > 0) { halo(ctx, x, y, s * .9, .55 * lit * a, P.halo0, P.core0); ctx.fillStyle = rgba(P.core0, lit * a); ctx.beginPath(); ctx.arc(x, y, Math.max(1.5, s * .07), 0, TAU); ctx.fill();
    const u = ((t * .6 + x * .003) % 1); ctx.strokeStyle = rgba(P.halo0, .6 * lit * a * (1 - u)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, s * (.3 + .6 * u), 0, TAU); ctx.stroke(); }
}
// a camera tower by the track: (x, y) = foot, h = height. o { a, eye 0..1 (the camera head glows cool), heat 0..1 (the view cone down to the track; cool: true = the machine's cool cone), coneLen, dir }
export function tower(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const heat = clamp(o.heat ?? 0), d = o.dir ?? 1;
  if (heat > 0) { const L = o.coneLen ?? h * 1.4, cc = o.cool ? F.COOL.halo : P.halo0; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, x, y - h, x + d * L * .7, y, [[0, rgba(cc, .26 * heat)], [1, rgba(cc, .02)]]);
    ctx.beginPath(); ctx.moveTo(x + d * h * .05, y - h * .94); ctx.lineTo(x + d * L * .25, y + 2); ctx.lineTo(x + d * L, y + 2); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.strokeStyle = mixHex(P.night0, P.ind1, .55); ctx.lineWidth = Math.max(1, h * .035); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.stroke();
  ctx.lineWidth = Math.max(.6, h * .015); for (let k = 1; k < 5; k++) { const yy = y - h * k / 5; ctx.beginPath(); ctx.moveTo(x - h * .04, yy); ctx.lineTo(x + h * .04, yy - h * .08); ctx.stroke(); }
  ctx.fillStyle = mixHex(P.night0, P.ind1, .6); ctx.beginPath(); ctx.roundRect(x - h * .02, y - h - h * .05, h * .14 * d, h * .09, h * .02); ctx.fill();
  const eye = clamp(o.eye ?? 0);
  if (eye > 0) { const ex = x + d * h * .12, ey = y - h - h * .005; halo(ctx, ex, ey, h * .16, .55 * eye, F.COOL.halo, F.COOL.core); ctx.fillStyle = rgba(F.COOL.core, eye); ctx.beginPath(); ctx.arc(ex, ey, Math.max(.8, h * .022), 0, TAU); ctx.fill(); }
  ctx.restore();
}
// a small ranger hut with one warm window: (x, y) = foot centre, s = width
export function hut(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x - s / 2, y - s * .55, s, s * .55);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.beginPath(); ctx.moveTo(x - s * .62, y - s * .5); ctx.lineTo(x, y - s * .92); ctx.lineTo(x + s * .62, y - s * .5); ctx.fill();
  const w = clamp(o.win ?? 1); halo(ctx, x + s * .18, y - s * .3, s * .7, .5 * w, P.halo0, P.core1); ctx.fillStyle = mixHex(P.night1, P.core1, w); ctx.fillRect(x + s * .08, y - s * .4, s * .2, s * .17);
  ctx.restore();
}
// the locomotive, side view, nose to the right: (x, y) = the nose on the rail, s = length. o { lamp 0..1, cabWin(ctx, x0, y0, w, h) (draw inside the
//   cab window), cars (count), brake 0..1 (sparks under the wheels), wheel (phase) } → { lamp: [x, y], cab: {x, y, w, h} }
export function loco(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a;
  const L = s, hb = s * .3, body = mixHex(P.night0, P.ind1, .45), dark = mixHex(P.night0, P.ind0, .3);
  // cars behind
  for (let k = 0; k < (o.cars ?? 3); k++) { const cx1 = x - L * 1.04 - k * L * .98, cx0 = cx1 - L * .92;
    ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(cx0, y - hb * .95, cx1 - cx0, hb * .82, L * .02); ctx.fill();
    ctx.fillStyle = rgba(P.halo0, .22); for (let w = 0; w < 6; w++) ctx.fillRect(cx0 + L * (.08 + w * .14), y - hb * .78, L * .08, hb * .2);
    for (const wx of [cx0 + L * .12, cx1 - L * .12]) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(wx, y - hb * .06, L * .045, 0, TAU); ctx.fill(); } }
  // the locomotive body: a long hood, the cab behind the nose
  const bx0 = x - L, p = new Path2D(); p.moveTo(bx0, y - hb * .12); p.lineTo(bx0, y - hb); p.lineTo(x - L * .26, y - hb); p.lineTo(x - L * .2, y - hb * 1.0); p.lineTo(x - L * .04, y - hb * .62); p.lineTo(x, y - hb * .5); p.lineTo(x, y - hb * .12); p.closePath();
  ctx.fillStyle = lin(ctx, 0, y - hb, 0, y, [[0, mixHex(body, P.blue1, .35)], [1, P.night0]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = Math.max(1, L * .006); ctx.beginPath(); ctx.moveTo(bx0, y - hb); ctx.lineTo(x - L * .2, y - hb); ctx.stroke();
  // cab window (you at the controls)
  const cw = { x: x - L * .21, y: y - hb * .93, w: L * .14, h: hb * .36 };
  ctx.save(); ctx.beginPath(); ctx.roundRect(cw.x, cw.y, cw.w, cw.h, L * .01); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, cw.y, 0, cw.y + cw.h, [[0, mixHex(P.night1, P.halo1, .3)], [1, mixHex(P.night1, P.shade0, .45)]]); ctx.fillRect(cw.x, cw.y, cw.w, cw.h);
  if (o.cabWin) o.cabWin(ctx, cw.x, cw.y, cw.w, cw.h);
  ctx.restore();
  ctx.strokeStyle = P.night0; ctx.lineWidth = Math.max(1, L * .01); ctx.beginPath(); ctx.roundRect(cw.x, cw.y, cw.w, cw.h, L * .01); ctx.stroke();
  // wheels + bogies
  ctx.fillStyle = P.night0; for (const wx of [x - L * .85, x - L * .72, x - L * .3, x - L * .17]) { ctx.beginPath(); ctx.arc(wx, y - hb * .06, L * .045, 0, TAU); ctx.fill(); }
  const br = clamp(o.brake ?? 0);
  if (br > 0) for (const wx of [x - L * .3, x - L * .17]) { halo(ctx, wx, y, L * .07, .7 * br, P.halo0, P.core0); const r = prng(Math.floor(t * 30)); ctx.strokeStyle = rgba(P.core1, .8 * br); ctx.lineWidth = Math.max(.6, L * .004);
    for (let k = 0; k < 5; k++) { const ang = Math.PI * (1.05 + r() * .35), l = L * (.03 + r() * .05); ctx.beginPath(); ctx.moveTo(wx, y); ctx.lineTo(wx + Math.cos(ang) * l, y + Math.sin(ang) * l * .4); ctx.stroke(); } }
  // the headlight
  const lp = [x - L * .012, y - hb * .44], la = clamp(o.lamp ?? 1);
  ctx.fillStyle = mixHex(P.night1, P.core0, la); ctx.beginPath(); ctx.arc(lp[0], lp[1], L * .022, 0, TAU); ctx.fill();
  ctx.restore();
  if (la > 0) halo(ctx, lp[0], lp[1], L * .16, .9 * la * a, P.halo0, P.core0);
  return { lamp: lp, cab: cw };
}
// maskLine with align 'right' as well (the f13 maskLine knows left and center only)
export function mline(ctx, segs, x, y, size, u, o = {}) {
  if (o.align === 'right') { const w = segs.reduce((s, [txt]) => s + F.measure(txt, size, o.serif ?? true, o.weight), 0); return F.maskLine(ctx, segs, x - w, y, size, u, { ...o, align: 'left' }); }
  return F.maskLine(ctx, segs, x, y, size, u, o);
}
// a number with '≈' in front: Instrument Serif has no ≈ glyph, so the sign is set in Inter (light), the number in the serif
export function approx(ctx, num, x, y, size, u, o = {}) {
  const serif = o.serif ?? true, as = size * .62, aw = F.measure('≈', as, false, 400) + size * .14, sw = F.measure(num, size, serif, o.weight), tw = aw + sw;
  const x0 = o.align === 'right' ? x - tw : o.align === 'center' ? x - tw / 2 : x;
  F.maskLine(ctx, [['≈', 0]], x0, y - size * .14, as, u, { serif: false, weight: 400, glow: o.glow, col: o.col });
  F.maskLine(ctx, [[num, o.warm ?? 0]], x0 + aw, y, size, u, { ...o, align: 'left' });
  return { w: tw, x0 };
}
