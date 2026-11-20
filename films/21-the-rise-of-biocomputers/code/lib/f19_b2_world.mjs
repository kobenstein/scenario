// Film 19 · builder B2 (c06–c08) · shared set and carriers for sc06.mjs, sc07.mjs, sc08.mjs (owned by B2; nobody else imports it).
// The three chunks are one continuous take, so everything that crosses a chunk boundary lives here and is a pure function of (t, T):
//   · the aisle (hall + extra rows of racks that can light up, the alive rack, you), drawn the same in every chunk;
//   · the top-down camera ↔ dish-field mapping (topCam / fieldOf) and the tilt between the aisle and the field (tiltCam);
//   · THE SCOREBOARD of the match (c07–c08): its rise, lamps, round label, the score rolls, the point tokens and their CATCH tags,
//     computed from phrase anchors (matchAnchors) so c07's last frame and c08's first frame are the same board.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, halo, prng } = E;
const { cam, proj, bill, quad, COOL, bump, RACK } = F;
const TAU = Math.PI * 2;

// ===================================================================================================================== the set
export const DISH = { X: 0, Y: F.drawerY(F.OPEN) + 12, R: RACK.dishR };
export const dishZ = (slide) => RACK.tray * (.5 - slide);           // the dish centre Z for a drawer slide (f19_kit drawerOpen)
// you: right of the alive rack, in front of the cold servers, facing it (left). Outside RACK_PLATE_CAM's frame (the plate has no you).
export const YOU = { X: 2300, Z: -1500, h: 1700 };
export const night = (ctx) => { ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H); };
// the dish field's night: the dish medium seen from inside (indigo, a soft warm-blue light in the middle), a little lighter than the aisle's
export function fieldNight(ctx) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night1, P.ind1, .3)], [.6, mixHex(P.night1, P.ind1, .55)], [1, mixHex(P.night1, P.ind1, .35)]]); ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = E.rad(ctx, W / 2, H * .62, W * .62, [[0, rgba(mixHex(P.blue0, P.halo1, .3), .2)], [.55, rgba(P.blue0, .08)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(0, 0, W, H);
}

// the top-down camera whose dish is exactly fieldMap(cx, cy, r), and back
export const topCam = (cx, cy, r, slide = 1) => cam({ tx: DISH.X, ty: DISH.Y, tz: dishZ(slide), d: 1500 * DISH.R / r, p: -Math.PI / 2, f: 1500, ox: cx - W / 2, oy: cy - H / 2 });
export function fieldOf(c, slide = 1) { const s = c.f / c.d; return F.fieldMap(W / 2 + c.ox + (DISH.X - c.tx) * s, H / 2 + c.oy - (dishZ(slide) - c.tz) * s, DISH.R * s); }
// the swing between an aisle camera A and a top-down camera B (u 0..1): the target travels first (sine over 70 %), pitch and
// distance follow (sine over the last 80 %) — the same move as the lead's descent in c01. Reverse = tiltCam(1 − u).
export function tiltCam(u, A, B) {
  const eT = sineIO(clamp(u / .7)), eP = sineIO(clamp((u - .2) / .8)), o = {};
  for (const k of ['tx', 'ty', 'tz', 'f']) o[k] = lerp(A[k], B[k], eT);
  for (const k of ['ox', 'oy']) o[k] = lerp(A[k], B[k], eP);              // the framing offset follows the pitch (no sideways sweep)
  o.p = lerp(A.p, B.p, eP); o.d = Math.exp(lerp(Math.log(A.d), Math.log(B.d), eP));
  return o;
}
// a field camera move between two maps (screen centre and radius), the radius in log (a zoom feels even)
export function mapLerp(a, b, u) { return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), u))]; }

// ===================================================================================================================== the aisle
// The aisle of Singapore, wider than the lead's hall: the front row runs on (racks every 720 to ±6480) and three rows stand behind it.
// They are ordinary servers (cool LEDs) sinking into the night; litAt(X, Z) 0..1 lights their gold seams ("up to a thousand").
const XS = []; for (let k = -9; k <= 9; k++) XS.push(k * 720);
const ROWS = [7800, 5200, 2600];
const rackSeed = (X, Z) => Math.abs(Math.round(X * 7 + Z * 3)) + 11;
function farRack(ctx, v, t, X, Z, lit, a) {
  const { hw, h, n } = RACK;
  const near = proj(v, X, h * .5, Z); if (!near) return;
  if (near[0] + hw * near[2] < -40 || near[0] - hw * near[2] > W + 40) return;
  const sink = clamp(.36 + Z / 20000 + Math.abs(X) / 22000, 0, .85);
  ctx.save(); ctx.globalAlpha = a;
  if (v.y > h) quad(ctx, v, [[X - hw, h, Z], [X + hw, h, Z], [X + hw, h, Z + RACK.d], [X - hw, h, Z + RACK.d]], mixHex(P.night1, P.ind2, .3));
  const fr = quad(ctx, v, [[X - hw, 0, Z], [X + hw, 0, Z], [X + hw, h, Z], [X - hw, h, Z]], mixHex(P.night0, P.night1, .7));
  if (fr) { ctx.strokeStyle = rgba(P.blue1, .5); ctx.lineWidth = Math.max(.8, 5 * fr[0][2]); ctx.stroke(); }
  quad(ctx, v, [[X - hw - 2, 0, Z - 6], [X + hw + 2, 0, Z - 6], [X + hw + 2, h + 2, Z - 6], [X - hw - 2, h + 2, Z - 6]], rgba(P.night0, sink));
  const r = prng(rackSeed(X, Z)), s = near[2];
  // cool LEDs (servers blink slowly)
  if (lit < 1) for (let i = 0; i < n; i++) {
    const ph = r() * 6.3, bl = r(); if (bl > .55) continue;
    const lp = proj(v, X + hw - 70, RACK.y0 + i * RACK.pitch + RACK.dh * .5, Z - 8); if (!lp) continue;
    const on = (Math.sin(t * (1.1 + bl * 2.3) + ph * 3) > .2 ? .9 : .3) * (1 - sink * .6) * (1 - lit);
    ctx.fillStyle = rgba(COOL.mid, on); const q = Math.max(1, 12 * lp[2]); ctx.fillRect(lp[0] - q / 2, lp[1] - q / 2, q, q);
  }
  if (lit > 0) seamLines(ctx, v, t, X, Z - 8, lit * (1 - sink * .45), r);
  ctx.restore();
}
// gold seams over a rack front (living cells inside): one path, one glow
function seamLines(ctx, v, t, X, Z, a, r) {
  const { hw, n } = RACK, p = new Path2D(); let s0 = null;
  for (let i = 0; i < n; i++) {
    const y0 = RACK.y0 + i * RACK.pitch + 6, A = proj(v, X - hw + 40, y0, Z), B = proj(v, X + hw - 120, y0, Z);
    if (A && B) { p.moveTo(A[0], A[1]); p.lineTo(B[0], B[1]); s0 = s0 || A; }
  }
  if (!s0) return;
  const br = a * (.8 + .2 * Math.sin(t * .6 + (r ? r() * 6 : 0)));
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(mixHex(P.halo1, P.core1, .3), .9 * br); ctx.lineWidth = Math.max(1, 7 * s0[2]); ctx.stroke(p);
  ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo1, .18 * br); ctx.lineWidth = Math.max(2.5, 40 * s0[2]); ctx.stroke(p);
  ctx.restore();
}
// o: { pool, rows (0..1 alpha of the extra racks), litAt(X, Z), slide, glow, net, dishO, seam, pair (i) => 0..1 }
export function aisle(ctx, v, t, o = {}) {
  F.hall(ctx, v, t, { pool: o.pool ?? 0, neigh: [] });
  const ra = o.rows ?? 1, litAt = o.litAt || (() => 0);
  if (ra > 0) {
    for (const Z of ROWS) for (const X of XS) farRack(ctx, v, t, X, Z, litAt(X, Z), ra);
    for (const X of XS) if (X !== 0 && !F.NEIGH.includes(X)) farRack(ctx, v, t, X, 0, litAt(X, 0), ra);
  }
  // the lead's neighbours, exactly as hall() draws them (so the first frame equals plateRack), then their seams if they light up
  for (const x of F.NEIGH) {
    F.rack(ctx, v, t, { x, alive: 0, leds: 1, seed: Math.round(x) });
    const k = Math.abs(x) < 1000 ? .38 : Math.abs(x) < 1800 ? .62 : .8;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); quad(ctx, v, [[x - RACK.hw - 2, 0, -8], [x + RACK.hw + 2, 0, -8], [x + RACK.hw + 2, RACK.h + 2, -8], [x - RACK.hw - 2, RACK.h + 2, -8]], rgba(P.night0, k));
    const l = litAt(x, 0); if (l > 0) seamLines(ctx, v, t, x, -9, l, null);
    ctx.restore();
  }
  const out = F.rack(ctx, v, t, { alive: 1, open: F.OPEN, slide: o.slide ?? 0, glow: o.glow ?? 0, net: o.net, dishO: o.dishO, seam: o.seam ?? 1 });
  if (o.pair) pairOver(ctx, v, t, o.pair);
  return out;
}
// pairing: drawers of the alive rack turn into cool servers (every other one), so gold and cool sit side by side in one rack
function pairOver(ctx, v, t, pair) {
  const { hw, dh } = RACK, r = prng(4242);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < RACK.n; i++) {
    const ph = r() * 6.3, bl = r();
    if (i === F.OPEN || i % 2 === 1) continue;
    const u = clamp(pair(i)); if (u <= 0) continue;
    const y0 = F.drawerY(i);
    // the face flips from the bottom edge up (a shutter of cool metal), the gold seam goes under it
    const top = y0 + (dh + 8) * expoOut(u);
    quad(ctx, v, [[-hw + 24, y0 - 2, -6], [hw - 24, y0 - 2, -6], [hw - 24, top, -6], [-hw + 24, top, -6]], mixHex(P.night1, COOL.deep, .5));
    const e0 = proj(v, -hw + 40, y0 + 4, -7), e1 = proj(v, hw - 40, y0 + 4, -7);
    if (e0 && e1) { ctx.strokeStyle = rgba(COOL.edge, .55 * u); ctx.lineWidth = Math.max(1, 4 * e0[2]); ctx.beginPath(); ctx.moveTo(e0[0], e0[1]); ctx.lineTo(e1[0], e1[1]); ctx.stroke(); }
    if (u > .6) for (let k = 0; k < 3; k++) {
      const lp = proj(v, hw - 70 - k * 34, y0 + dh * .5, -8); if (!lp) continue;
      const on = Math.sin(t * (1.6 + bl * 2.5 + k * .7) + ph * 3 + k) > -.1 ? 1 : .35, q = 11 * lp[2];
      ctx.fillStyle = rgba(COOL.core, on * smooth(span(u, .6, 1))); ctx.fillRect(lp[0] - q / 2, lp[1] - q / 2, q, q);
      if (on > .5 && k === 0) halo(ctx, lp[0], lp[1], 36 * lp[2], .3, COOL.edge, COOL.core);
    }
  }
  ctx.restore();
}

// ---- you: faceless, yellow raincoat, side view facing the rack (left). The same net glows inside your hood.
// o: { look 0..1 (head up), armR/armL [shoulder, elbow], net 0..1 (the head's net), lean }
export function headPoint(v, look = 0) { return proj(v, YOU.X - (.03 - .012 * look) * YOU.h, .875 * YOU.h, YOU.Z); }
export function you(ctx, t, v, o = {}) {
  const look = (o.look ?? .2) + .04 * Math.sin(t * .7), br = .02 * Math.sin(t * 1.6);
  const p = bill(ctx, v, YOU.X, 0, YOU.Z, () => {
    ctx.scale(1, 1 + .006 * Math.sin(t * 1.6));
    E.du(ctx, 0, 0, YOU.h, { dir: -1, view: 'side', look, light: -1, lean: o.lean ?? 0, armR: o.armR || [.16 + br, .1], armL: o.armL || [-.1 - br, -.05] });
  });
  const on = o.net ?? .4, hp = headPoint(v, look);
  if (!hp || !p || on <= 0) return hp;
  const r = .07 * YOU.h * hp[2];
  halo(ctx, hp[0], hp[1], r * (2.4 + 1.6 * clamp(on - .5) * 2), .3 * on, P.halo1, P.core1);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(hp[0], hp[1], r, 0, TAU); ctx.clip();
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .75;
  F.net(ctx, t, F.fieldMap(hp[0], hp[1], r * 2.3), { lit: Math.min(1, on), ambient: 1, w: .9, nSparks: 9, fire: o.fire });
  ctx.restore();
  return hp;
}

// ===================================================================================================================== the match
// phrase anchors of the whole match (c07 + c08), the same object in both chunks
const MA = new WeakMap();
export function matchAnchors(T) {
  if (MA.has(T)) return MA.get(T);
  const G = (p, after = 0) => T.G(p, 0, after);
  const a = {};
  a.match = G('Picture it as a match'); a.against = G('cells against artificial', a.match); a.three = G('Three rounds', a.match);
  a.r1 = G('Round one', a.match); a.speed = G('Learning speed', a.r1); a.study = G('In a study published', a.r1); a.pong = G('the Pong team', a.r1);
  a.threeStd = G('three standard', a.r1); a.fair = G('To keep it fair', a.r1); a.tiny = G('same tiny amount', a.r1);
  a.learned = G('The cells learned faster', a.r1); a.rallies = G('longer rallies', a.r1);
  a.pt1 = G('Point, cells', a.r1); a.catch1 = G('with a catch', a.pt1); a.older = G('The programs were older', a.pt1); a.short = G('the practice was short', a.pt1);
  a.farMore = G('With far more practice', a.pt1); a.beats = G('beats human players', a.pt1);
  a.r2 = G('Round two', a.pt1); a.team = G('Teamwork', a.r2); a.lastMonth = G('Last month', a.r2); a.presented = G('presented fifteen', a.r2);
  a.fifteen = G('fifteen boxes', a.r2); a.linked = G('linked into a team', a.r2); a.test = G('The test', a.r2); a.steer = G('Steer a little figure', a.r2); a.goal = G('to a goal', a.steer);
  a.older2 = G('An older program', a.r2); a.n32 = G('thirty-two', a.r2); a.best = G('The best single box', a.r2); a.n40 = G('about forty', a.best);
  a.linkedB = G('Linked boxes', a.r2); a.n70 = G('About seventy', a.r2);
  a.pt2 = G('Point, cells', a.n70); a.another = G('Another catch', a.pt2); a.oneCo = G('One company', a.pt2); a.oneTalk = G('One talk', a.pt2); a.paper = G('No published paper', a.pt2);
  a.again = G('And again, the opponent', a.pt2); a.todays = G("today's best", a.pt2);
  a.r3 = G('Round three', a.pt2); a.every = G('Everything else', a.r3); a.last = G('The cells usually last', a.r3); a.six = G('six months', a.r3);
  a.good = G('good days', a.r3); a.bad = G('bad days', a.r3); a.teams = G('teams help', a.r3); a.even = G('And even the company', a.r3);
  a.chips = G('chips win at', a.r3); a.fast = G('fast, precise math', a.r3); a.chatbots = G('chatbots you use', a.r3);
  a.ptAI = G('Point, artificial intelligence', a.r3); a.big = G('A big one', a.ptAI); a.final = G('Final score', a.ptAI);
  a.two = G('Two small points', a.final); a.giant = G('A giant one', a.final); a.goalNot = G("So the goal isn't", a.final);
  a.pairing = G("It's pairing them", a.final); a.each = G('each doing what', a.final); a.cellsThat = G('Cells that learn', a.final); a.anyone = G('is anyone in there', a.final);
  // the three point tokens: where they leave from (explainer points, screen), when, how long they fly
  a.tok = [
    { t0: a.pt1 - .05, from: [1150, 566], dur: .95 },          // round 1: the tip of the gold rally curve (sc07)
    { t0: a.pt2 - .05, from: [1600, 524], dur: 1.0 },          // round 2: the top of the 70 bar (sc07)
  ];
  a.tokAI = { t0: a.ptAI - .1, from: [1450, 740], dur: 1.0 };   // round 3: the cool math block (sc08)
  MA.set(T, a); return a;
}
export const BOARD = { x: 960, labelY: 92, lampY: 134, nameY: 202, numY: 318, tokY: 374, cellsX: 760, aiX: 1160, num: 104, name: 30 };
export const cellSlot = (i) => [BOARD.cellsX + (i - .5) * 76, BOARD.tokY];
export const aiSlot = () => [BOARD.aiX, BOARD.tokY];
// a token's flight: anticipation at the source, an arc up to its slot, a small settle. Returns { x, y, k (0 before, 1 landed), s (scale) }
export function tokenAt(t, tk, slot) {
  const u = span(t, tk.t0 + .25, tk.t0 + .25 + tk.dur);
  const [sx, sy] = tk.from, [qx, qy] = slot, mx = lerp(sx, qx, .55), my = Math.min(sy, qy) - 110;
  const e = sineIO(u), x = lerp(lerp(sx, mx, e), lerp(mx, qx, e), e), y = lerp(lerp(sy, my, e), lerp(my, qy, e), e);
  const born = expoOut(span(t, tk.t0 - .15, tk.t0 + .25));          // the token swells out of its source first
  const settle = u >= 1 ? Math.exp(-(t - tk.t0 - .25 - tk.dur) * 6) * Math.sin((t - tk.t0 - .25 - tk.dur) * 18) * 4 : 0;
  return { x, y: y + settle, born, landed: u >= 1, land: tk.t0 + .25 + tk.dur, u };
}
function token(ctx, x, y, r, a, cool = 0, glow = 1) {
  if (r <= .3 || a <= 0) return;
  halo(ctx, x, y, r * 3.2, .45 * a * glow, mixHex(P.halo0, COOL.edge, cool), mixHex(P.core1, COOL.core, cool));
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = cool ? E.rad(ctx, x - r * .3, y - r * .3, r * 1.3, [[0, COOL.core], [.6, COOL.mid], [1, COOL.edge]]) : E.rad(ctx, x - r * .3, y - r * .3, r * 1.3, [[0, P.core0], [.6, P.core1], [1, P.halo0]]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}
// the number in a column: the old one sinks into its baseline as the new one rises (a roll), u = the board's rise
function rollNum(ctx, x, y, from, to, roll, u, col) {
  if (roll <= 0) F.maskLine(ctx, [[`${from}`, 0]], x, y, BOARD.num, u, { align: 'center', col });
  else if (roll >= 1) F.maskLine(ctx, [[`${to}`, 0]], x, y, BOARD.num, u, { align: 'center', col });
  else { F.maskLine(ctx, [[`${from}`, 0]], x, y, BOARD.num, (1 - expoOut(roll)) * u, { align: 'center', col }); F.maskLine(ctx, [[`${to}`, 0]], x, y, BOARD.num, F.rise(roll) * u, { align: 'center', col }); }
}
const ROUND_LABELS = [['ROUND 1', 'LEARNING SPEED'], ['ROUND 2', 'TEAMWORK'], ['ROUND 3', 'EVERYTHING ELSE']];
// THE SCOREBOARD at time t (screen space). Everything (rise, lamps, label, rolls, tokens, catches, the big A.I. token, the final
// pulses and the sink when the camera leaves for the aisle) follows from the anchors. Returns the token positions.
export function board(ctx, t, a) {
  const B = BOARD;
  const up = F.rise(span(t, a.against - .25, a.against + .75)), upN = F.rise(span(t, a.against + .05, a.against + 1.0));
  const sink = expoIn(span(t, a.goalNot - .1, a.goalNot + .6));      // the names and numbers sink into their baselines
  const u = up * (1 - sink), uN = upN * (1 - sink);
  if (u <= 0 && uN <= 0 && t < a.goalNot) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // round lamps: three small lights grow on "Three rounds", each lights on its round
  const rounds = [a.r1, a.r2, a.r3];
  for (let i = 0; i < 3; i++) {
    const g = expoOut(span(t, a.three - .1 + i * .12, a.three + .5 + i * .12)) * (1 - expoIn(span(t, a.goalNot + i * .05, a.goalNot + .5 + i * .05)));
    if (g <= 0) continue;
    const lit = smooth(span(t, rounds[i] - .1, rounds[i] + .35)), x = B.x + (i - 1) * 40;
    const br = 1 + .07 * lit * Math.sin(t * 1.3 + i * 2.1);                // a lit lamp breathes
    if (lit > 0) halo(ctx, x, B.lampY, 34 * br, .45 * lit * g * br, P.halo0, P.core1);
    ctx.fillStyle = rgba(mixHex(P.blue1, P.core1, lit), .55 + .45 * lit); ctx.beginPath(); ctx.arc(x, B.lampY, 9 * g * br, 0, TAU); ctx.fill();
  }
  // the round label above the lamps: ROUND n rises on its round, the name of the round on its word
  const names = [a.speed, a.team, a.every], ends = [a.r2 - .8, a.r3 - .8, a.goalNot - .1];
  for (let i = 0; i < 3; i++) {
    const k1 = F.rise(span(t, rounds[i] - .15, rounds[i] + .6)), k2 = F.rise(span(t, names[i] - .15, names[i] + .6)), out = 1 - sineIO(span(t, ends[i] - .2, ends[i] + .5));
    if (k1 * out <= 0) continue;
    const [r, nm] = ROUND_LABELS[i], s = 21, w1 = F.measure(r + '  ·  ', s, false, 600), w2 = F.measure(nm, s, false, 600), x0 = B.x - (w1 + w2) / 2;
    F.maskLine(ctx, [[r + '  ·  ', 0]], x0, B.labelY, s, k1 * out, { serif: false, weight: 600, col: P.halo2, glow: false });
    F.maskLine(ctx, [[nm, 0]], x0 + w1, B.labelY, s, k2 * out, { serif: false, weight: 600, col: P.cream, glow: false });
  }
  // names, colon
  F.maskLine(ctx, [['CELLS', 0]], B.cellsX, B.nameY, B.name, u, { serif: false, align: 'center', col: P.halo0, weight: 600 });
  F.maskLine(ctx, [['A.I.', 0]], B.aiX, B.nameY, B.name, u, { serif: false, align: 'center', col: COOL.mid, weight: 600 });
  F.maskLine(ctx, [[':', 0]], B.x, B.numY - 8, B.num * .8, uN, { align: 'center', col: P.halo2 });
  // tokens and their landings → the scores
  const T1 = tokenAt(t, a.tok[0], cellSlot(0)), T2 = tokenAt(t, a.tok[1], cellSlot(1)), TA = tokenAt(t, a.tokAI, aiSlot());
  const roll = (tk) => span(t, tk.land - .05, tk.land + .55);
  const cells = T2.landed || t > T2.land - .05 ? [1, 2, roll(T2)] : [0, 1, roll(T1)];
  rollNum(ctx, B.cellsX, B.numY, cells[0], cells[1], cells[2], uN, P.cream);
  rollNum(ctx, B.aiX, B.numY, 0, 1, roll(TA), uN, COOL.core);
  // the fall at the end: every token drops (expo-in) as the camera swings up out of the field
  const fall = (k) => expoIn(span(t, a.goalNot + .05 + k * .08, a.goalNot + 1.05 + k * .08)) * 900;
  // cells tokens + their CATCH tags (a thin line, then the word rising from its baseline)
  const pulseC = 1 + .28 * bump(t, a.two, .9);
  [[T1, a.catch1, 0], [T2, a.another, 1]].forEach(([tk, tc, k]) => {
    if (tk.born <= 0) return;
    const y = tk.y + fall(k), r = 15 * tk.born * (tk.landed ? pulseC : 1);
    token(ctx, tk.x, y, r, 1, 0, tk.landed ? .85 + .2 * Math.sin(t * 1.1 + k * 2.4) : 1.3);
    if (tk.landed && t > a.pt1) halo(ctx, tk.x, y, 70, .5 * Math.exp(-(t - tk.land) * 2.5), P.halo0, P.core0);   // the landing flash
    const cu = span(t, tc - .1, tc + .5);
    if (cu > 0 && tk.landed) {
      ctx.strokeStyle = rgba(P.halo2, .65); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tk.x, y + 17); ctx.lineTo(tk.x, y + 17 + 26 * expoOut(cu)); ctx.stroke();
      F.maskLine(ctx, [['CATCH', 0]], tk.x, y + 68, 20, F.rise(span(t, tc + .05, tc + .6)), { serif: false, align: 'center', col: P.halo2, glow: false, weight: 600 });
    }
  });
  // the A.I. token: lands, then grows giant ("A big one") downward from its slot; pulses on "A giant one"
  if (TA.born > 0) {
    const big = expoOut(span(t, a.big - .05, a.big + .9)), R = 15 * TA.born * (1 + 8 * big) * (1 + .1 * bump(t, a.giant, 1));
    const y = (TA.landed ? B.tokY + (R - 15) : TA.y) + fall(2);
    token(ctx, TA.x, y, R, 1, 1, .85 + .2 * Math.sin(t * .9 + 1.3));
    if (TA.landed) halo(ctx, TA.x, y, 80 + R, .5 * Math.exp(-(t - TA.land) * 2.5), COOL.edge, COOL.core);
  }
  ctx.restore();
  return { T1, T2, TA };
}

// ===================================================================================================================== the aisle hold
// The shot c06 ends on and c07 begins with (and c08's pairing returns to): the alive rack with drawer 11 open, its dish glowing, you
// on the right looking at it; the scoreboard has room above the rack. Same camera, same drift, same pose on both sides of the seam.
export const AISLE_CAM = cam({ tx: 700, ty: 1650, tz: 0, d: 5400, p: -.1 });           // where c06's swing up lands
export const AISLE_CAM1 = cam({ tx: 720, ty: 1630, tz: 0, d: 4950, p: -.1 });          // where c07's dive starts (a slow push between)
export const FIELD_DRIFT = 1.6;                                   // the dish field's breath (c07/c08 share it across their seam)
export const AISLE_HOLD = { drift: .9, glow: .9, pool: .9, look: .22, net: .55 };
export function holdCam(t, T) { const a0 = T.G('So can a dish of cells') + 3.45, a1 = matchAnchors(T).three + .4; return camLerp(AISLE_CAM, AISLE_CAM1, sineIO(span(t, a0, a1))); }
export function camLerp(A, B, u) { const o = {}; for (const k of ['tx', 'ty', 'tz', 'p', 'f', 'ox', 'oy']) o[k] = lerp(A[k], B[k], u); o.d = Math.exp(lerp(Math.log(A.d), Math.log(B.d), u)); return o; }
export const AISLE_DISH = { glow: .9, chip: 1, electrodes: .6, rim: 1 };
export const AISLE_NET = { lit: 1, ambient: 1, w: 1.25 };
export function aisleHold(ctx, t, v, o = {}) {
  const out = aisle(ctx, v, t, { pool: AISLE_HOLD.pool, rows: 1, slide: 1, glow: AISLE_HOLD.glow, net: AISLE_NET, dishO: AISLE_DISH, seam: 1, pair: o.pair });
  you(ctx, t, v, { look: o.look ?? AISLE_HOLD.look, net: o.net ?? AISLE_HOLD.net, armR: o.armR, armL: o.armL });
  return out;
}

// ===================================================================================================================== helpers
// the aisle while the camera swings down into (or up out of) the open dish: desc 0 = aisle hold … 1 = straight above the dish.
// The aisle sinks into night round the dish; the dish (o.net / o.dish override the aisle look) stays on top.
export function aisleDive(ctx, t, v, desc, o = {}) {
  const dishO = { glow: lerp(.9, .55, desc), chip: lerp(1, .5, desc), electrodes: lerp(.6, .25, desc), rim: lerp(1, .7, desc), ...(o.dish || {}) };
  const netO = o.net || AISLE_NET;
  const out = aisle(ctx, v, t, { pool: AISLE_HOLD.pool * (1 - desc), rows: 1, slide: 1, glow: AISLE_HOLD.glow * (1 - desc), net: netO, dishO: { ...dishO, a: desc > 0 ? 0 : 1 }, seam: 1, pair: o.pair });
  you(ctx, t, v, { look: o.look ?? AISLE_HOLD.look, net: o.youNet ?? AISLE_HOLD.net, armR: o.armR, armL: o.armL });
  if (desc > 0) {
    const dark = smooth(span(desc, .02, .38));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (dark > 0) { ctx.globalAlpha = dark; fieldNight(ctx); ctx.globalAlpha = 1; }
    const m = out.dish && out.dish.map; if (m) F.dish(ctx, t, m, { ...dishO, net: netO });
    ctx.restore();
  }
  return out;
}
export const FIELD_DISH = { glow: .55, chip: .5, electrodes: .25, rim: .7 };
export const FIELD_NET = { lit: 1, ambient: 1, w: 1.25 };
// a polyline drawn up to u (0..1 of its length)
export function polyTo(ctx, pts, u) {
  if (u <= 0) return;
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const end = L[L.length - 1] * clamp(u);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) { if (L[i] <= end) ctx.lineTo(pts[i][0], pts[i][1]); else { const f = (end - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); break; } }
  ctx.stroke();
}
// an A.I. program (silicon, cool): a rounded chip whose outline draws itself (u 0..1), then a small node graph inside lights up.
// (x, y) centre, s size. o: { dim 0..1 (older: greyer), lit 0..1 (graph), scale }
const RRP = (() => { const pts = [], r = 14, n = 5, arc = (cx, cy, a0) => { for (let k = 0; k <= n; k++) { const q = a0 + k / n * Math.PI / 2; pts.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]); } };
  arc(-50 + r, -50 + r, Math.PI); arc(50 - r, -50 + r, -Math.PI / 2); arc(50 - r, 50 - r, 0); arc(-50 + r, 50 - r, Math.PI / 2); pts.push([-50, -50 + r]); return pts; })();
const NODES = [[-26, -24], [0, -28], [26, -20], [-24, 2], [2, 0], [24, 4], [-20, 26], [4, 24], [26, 26]];
const NLINKS = [[0, 4], [1, 4], [2, 4], [3, 4], [4, 5], [3, 6], [4, 7], [5, 8], [0, 1], [6, 7]];
export function program(ctx, t, x, y, s, u, o = {}) {
  if (u <= 0 || (o.scale ?? 1) <= 0) return;
  const dim = o.dim ?? 0, col = mixHex(COOL.mid, P.blue1, dim * .7), lit = (o.lit ?? smooth(span(u, .55, 1))) * (1 - dim * .55);
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 100 * (o.scale ?? 1), s / 100 * (o.scale ?? 1));
  const fill = smooth(span(u, .5, 1));
  if (fill > 0) { halo(ctx, 0, 0, 120, .22 * fill * (1 - dim * .5), COOL.edge, COOL.mid); ctx.fillStyle = rgba(mixHex(COOL.deep, P.night1, .3), .75 * fill); ctx.beginPath(); ctx.roundRect(-50, -50, 100, 100, 14); ctx.fill(); }
  ctx.strokeStyle = rgba(col, .9); ctx.lineWidth = 3.2; ctx.lineJoin = 'round'; polyTo(ctx, RRP, clamp(u * 1.4));
  if (lit > 0) {
    ctx.strokeStyle = rgba(col, .55 * lit); ctx.lineWidth = 2;
    for (const [i, j] of NLINKS) { ctx.beginPath(); ctx.moveTo(...NODES[i]); ctx.lineTo(...NODES[j]); ctx.stroke(); }
    NODES.forEach(([nx, ny], i) => { const f = .5 + .5 * Math.sin(t * (2.2 + i * .37) + i); ctx.fillStyle = rgba(mixHex(col, COOL.core, f * (1 - dim)), lit); ctx.beginPath(); ctx.arc(nx, ny, 5, 0, TAU); ctx.fill(); });
  }
  ctx.restore();
}
