// Film 29 · B3 (c12–c16) · the shared take of the last group: anchors, ONE camera path, the world state that crosses the inner chunk
// boundaries, and B3's own drawings (the freezer door in the ice, the wall of frost doors, their strands, the forest edge, the ferret
// family, the elephant family, the virus and the vaccine drop, the gate in the fence).
// Every scene file sc12 … sc16 calls world(ctx, t, a, hook) for the picture and adds only its own screen-space words on top, so the
// inner boundaries are the same frame by construction (one continuous take from plateIce to the end screen).
//   c12 the ice frosts into a freezer door · Willa · the door opens · the clone, her kits, their kits walk out: a family tree on the snow
//   c13 the door multiplies into a wall of frost doors to the hut · strands rise · the forest edge · the comb reads, one door vanishes
//   c14 the elephant mother and two calves come out from behind the hut · the virus, the vaccine drop from the window · the snow lights
//   c15 the traits light on the mother · the gold flies to the poster · the camera turns to the freezer and the mast
//   c16 back over the fence (like frame 0) · the gate · the child grown · THE POSTER · THE ARK · subscribe · the walk · END_CAM
// Facts: faktenzettel.md (Willa 19, vaccine 20, biobank ~2,300 21, Red List 49,505 ≈ 50,000 23, the vote 26).
import * as E from './f10_editorial.mjs';
import * as F from './f29_kit.mjs';
import * as S from './f29_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo, lin, prng } = E;
const { GOLD, MACH, LAMP, FROST, SNOW, F0, rise, bump } = F;
const TAU = Math.PI * 2;
const ss = (t, a, b) => sineIO(span(t, a, b));

// ================================================================================================================= ANCHORS (phrases only)
export function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // c12
  a.T0 = G('Now take an American animal'); a.lucky = G('got luckier', a.T0);
  a.eighties = G('In the nineteen-eighties', a.T0); a.froze = G('froze living cells', a.eighties); a.ferretW = G('black-footed ferret', a.froze); a.willa = G('named Willa', a.froze);
  a.decades = G('Decades later'); a.cells = G('those cells became', a.decades); a.clones = G('living clones', a.decades);
  a.officials = G('wildlife officials', a.decades); a.babies = G('had babies two years', a.decades); a.lastYear = G('and last year', a.babies); a.babies2 = G('babies had babies', a.lastYear); a.own = GE('of their own', a.lastYear);
  a.ferret80 = G('A ferret from the nineteen-eighties'); a.grand = G('has grandchildren', a.ferret80);
  a.noList = G('No short list'); a.guess = G('No guesswork', a.noList); a.just = G('Just a freezer', a.noList); a.opened = G('opened in time', a.just);
  // c13
  a.scale = G('Now scale that up'); a.govt = G('government and Colossal', a.scale); a.freeze = G('plan to freeze', a.scale); a.every = G('every species on', a.scale);
  a.endList = G('endangered list', a.scale); a.everyOne = G('Every one', a.scale);
  a.genomes = G('And the genomes are meant'); a.online = G('go online', a.genomes); a.free = G('free', a.online);
  a.forest = G('A freezer is not a forest'); a.habitat = G('It protects no habitat', a.forest);
  a.think = G('But think about what the machine'); a.learns = G('machine learns from', a.think); a.living = G('The living', a.learns);
  a.saved = G('Every genome saved', a.think); a.matter = G('differences matter', a.saved);
  a.vanish = G('Every species that vanishes', a.saved); a.unread = G('unread', a.vanish); a.gone = G('lesson gone for good', a.vanish); a.goneE = GE('lesson gone for good', a.vanish);
  // c14
  a.depends = G('Even the mammoth depends'); a.mother = G('Its mother would be', a.depends); a.asian = G('an Asian elephant', a.mother); a.endangered = G('is endangered too', a.mother);
  a.zoos = G('In North American zoos', a.depends); a.killer = G('leading killer', a.zoos); a.calves = G('her calves', a.zoos); a.virus = G('is a virus', a.zoos);
  a.summer = G('This summer', a.virus); a.vaccine = G('on a vaccine', a.summer); a.pay = G('helped pay for', a.summer);
  a.two = G('Two young elephants', a.summer); a.caught = G('caught the virus', a.two); a.through = G('came through', a.two);
  a.sign = G('Two calves are a first sign'); a.firstSign = G('a first sign', a.sign); a.proof = G('not proof', a.sign);
  a.road = G('But the road to a mammoth', a.sign); a.alive = G('keeping elephants alive', a.road);
  a.alone = G('And the elephant is not alone'); a.redList = G('Red List counts', a.alone); a.fifty = G('about fifty thousand', a.alone); a.threat = GE('as threatened', a.alone);
  // c15
  a.evidence = G('So here is what the evidence'); a.ai = G('Artificial intelligence is helping', a.evidence); a.traits = G("the mammoth's traits", a.ai);
  a.inEl = G('in an elephant', a.traits); a.notM = G('Not the mammoth itself', a.inEl);
  a.cameras = G('The mammoth draws the cameras'); a.money = G('and the money', a.cameras); a.rescue = G('The rescue itself', a.cameras); a.quieter = G('somewhere quieter', a.rescue);
  a.inFreezer = G('In a freezer', a.rescue); a.machine = G('and in a machine that', a.inFreezer); a.read = G('learning to read', a.machine); a.inside = GE("what's inside", a.machine);
  // c16
  a.once = G('So stand at that fence once more'); a.maybe = G('Maybe, in the early', a.once); a.hand = G('a small hand in yours', a.once); a.yours = GE('in yours', a.hand);
  a.coat = G("in a mammoth's coat", a.once); a.lifts = G('lifts its head', a.coat);
  a.should = G('Should it ever walk free'); a.lastYear2 = G('Last year, the union', a.should); a.pause = G('voted on a pause', a.should);
  a.failed = G('The pause failed', a.should); a.single = G('by a single vote', a.failed); a.who = G('So who decides', a.failed);
  a.whatever = G('Whatever the answer'); a.prize = G('the prize was never', a.whatever); a.childW = G('It is that child', a.whatever); a.grown = G('grown up', a.childW);
  a.elephants = G('where elephants', a.childW); a.ferrets = G('ferrets, and thousands', a.childW); a.thousands = G('thousands of others', a.childW); a.still = G('still alive', a.childW);
  a.onPoster = G('not just on a poster', a.childW);
  a.isPoster = G('The mammoth is the poster'); a.ark = G('The freezer is the ark', a.isPoster); a.arkE = GE('The freezer is the ark', a.isPoster);
  a.films = G('These films exist', a.ark); a.want = G('Want that too', a.films); a.sub = G('Then subscribe', a.films); a.vend = GE('Then subscribe', a.films);
  a.end = T.duration; a.endScreen = a.end - 15; a.TT = T;
  return a;
}

// ================================================================================================================= THE THINGS (world units)
export const BLOCK = { x: S.ICE.x, z: S.ICE.z, s: S.ICE.s, h: S.ICE.s * .82 };
// the door cut into the frosted ice (local units of the block: x right, y up negative)
export const DOOR = { x0: -128, x1: 128, y0: -300, y1: -14 };
// the wall of frost doors: from the ice block back and left to the hut (the ark reaches the field station)
export const WALL = (() => { const out = [], n = 40, r = prng(2912), dx = -4100 / n, dz = 7500 / n;
  for (let k = 1; k <= n; k++) out.push({ k, x: BLOCK.x + dx * k + (r() - .5) * 20, z: BLOCK.z + dz * k, w: 230 + r() * 16, h: 290 + r() * 30, sd: r() });
  return out; })();
export const VANISH = 3;                        // the door whose species vanishes unread (near, so the comb has not reached it yet)
// the forest edge on the far horizon (left, behind the field station)
const FOREST = (() => { const r = prng(2931), out = []; for (let x = -17000; x < 2500; x += 200 + r() * 240) out.push({ x, z: 20000 + r() * 2600, h: 560 + r() * 700, w: .34 + r() * .1, sn: r() }); return out; })();
// the ferret family: Willa (1980s, behind the block's left side), the clone out of the door, two kits, three grandkits (a tree on the snow)
export const FAM = {
  willa: { x0: 200, x1: -170, x2: -1450, z: 4540, s: 135 },
  clone: { x: 430, z: 4080, s: 135, from: [300, 4290] },
  kits: [{ x: 170, z: 3910, s: 100, p: 'clone' }, { x: 700, z: 3930, s: 100, p: 'clone' }],
  grand: [{ x: 40, z: 3730, s: 76, p: 0 }, { x: 330, z: 3710, s: 76, p: 0 }, { x: 840, z: 3740, s: 76, p: 1 }],
};
// the elephant family: hidden behind the hut until c14, out into the window light, then away to the right; c16 back in from the right
const HUT = S.WORLD.hut;
export const ELE = { A: [-5300, 12150], B: [-4700, 10350], C: [-1700, 8300], END: [450, 3900], h: 300, calves: [{ h: 138, off: [470, 170] }, { h: 122, off: [-440, 230] }] };

// ================================================================================================================= DRAWINGS
const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
// the door in the frosted ice block (local block units, ground at y 0): o { d 0..1 (the seam draws in), open 0..1, glow 0..1, vial 0..1 }
export function blockDoor(ctx, t, o = {}) {
  const d = clamp(o.d ?? 1), op = clamp(o.open ?? 0), gl = clamp(o.glow ?? 0); if (d <= 0) return;
  const { x0, x1, y0, y1 } = DOOR, w = x1 - x0, h = y1 - y0;
  // the inside (cold light, two racks, the vial of living cells)
  if (op > 0) {
    ctx.fillStyle = mixHex(P.night0, FROST.deep, .55); ctx.fillRect(x0, y0, w, h);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
    halo(ctx, 0, y0 + h * .42, w * .9, .55 * op, FROST.shade, FROST.core);
    ctx.fillStyle = rgba(FROST.body, .5 * op); for (const fy of [.3, .62]) ctx.fillRect(x0 + 16, y0 + h * fy, w - 32, 5);
    const va = clamp(o.vial ?? op);
    if (va > 0) {   // the vial: a small glass tube, a gold spark inside (living cells)
      const vx = 0, vy = y0 + h * .62 - 4;
      ctx.fillStyle = rgba(FROST.core, .55 * va); ctx.beginPath(); ctx.roundRect(vx - 9, vy - 62, 18, 62, 8); ctx.fill();
      ctx.fillStyle = rgba(FROST.deep, .6 * va); ctx.fillRect(vx - 10, vy - 70, 20, 10);
      const pulse = .75 + .25 * Math.sin(t * 2.2);
      halo(ctx, vx, vy - 22, 60, .6 * va * pulse, GOLD.halo, GOLD.core);
      ctx.fillStyle = rgba(GOLD.core, va); ctx.beginPath(); ctx.arc(vx, vy - 22, 5.5, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  // the door panel swings out on its left hinge (it narrows toward the hinge, its free edge leans in perspective)
  const pw = w * (1 - .86 * sineIO(op)), sk = h * .07 * sineIO(op);
  const panel = [[x0, y0], [x0 + pw, y0 - sk], [x0 + pw, y1 + sk], [x0, y1]];
  if (op > 0) { ctx.fillStyle = lin(ctx, x0, 0, x0 + pw, 0, [[0, mixHex(FROST.shade, P.night1, .35)], [1, mixHex(FROST.body, FROST.shade, .4 + .3 * op)]]); poly(ctx, panel); ctx.fill(); }
  // the seam of the door (draws itself round the rect), the handle, the cold light along the top
  const L = 2 * (w + h), u = d * L;
  ctx.strokeStyle = rgba(mixHex(FROST.deep, P.night0, .3), .85); ctx.lineWidth = 6; ctx.lineCap = 'round';
  const path = [[x0, y1], [x0, y0], [x1, y0], [x1, y1], [x0, y1]]; let acc = 0;
  ctx.beginPath(); ctx.moveTo(...path[0]);
  for (let i = 1; i < path.length; i++) { const sl = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); if (acc + sl <= u) ctx.lineTo(...path[i]); else { const f = (u - acc) / sl; ctx.lineTo(lerp(path[i - 1][0], path[i][0], f), lerp(path[i - 1][1], path[i][1], f)); break; } acc += sl; }
  ctx.stroke();
  const ha = rise(span(d, .75, 1));
  if (ha > 0) {
    const hx = op > 0 ? x0 + pw - 26 * (1 - op) : x1 - 26;
    ctx.fillStyle = rgba(mixHex(FROST.deep, P.night0, .2), ha); ctx.beginPath(); ctx.roundRect(hx - 6, y0 + h * .38, 12, h * .26, 6); ctx.fill();
    ctx.fillStyle = rgba(FROST.core, .5 * ha); ctx.fillRect(hx - 2, y0 + h * .4, 3, h * .2);
  }
  if (gl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(FROST.core, .5 * gl); ctx.fillRect(x0 - 4, y0 - 8, w + 8, 5); ctx.restore(); halo(ctx, 0, y0 + h * .5, w * 1.1, .22 * gl, FROST.shade, FROST.core); }
}
// one frost door of the wall (local units, ground at y 0): o { rise 0..1 (out of the snow), glow 0..1, dark 0..1 (its species vanished), a }
export function frostDoor(ctx, t, w, h, o = {}) {
  const ri = clamp(o.rise ?? 1), a = o.a ?? 1; if (ri <= 0 || a <= 0) return;
  const dk = clamp(o.dark ?? 0), gl = clamp(o.glow ?? 0) * (1 - dk);
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(-w, -h * 1.6, w * 2, h * 1.6 + 1); ctx.clip();
  ctx.translate(0, (1 - sineIO(ri)) * h * 1.04);
  const lit = mixHex(mixHex(FROST.body, FROST.shade, .35), P.night1, .2 + .55 * dk), sh = mixHex(mixHex(FROST.shade, FROST.deep, .5), P.night0, .25 + .5 * dk);
  ctx.fillStyle = lin(ctx, -w / 2, -h, w / 2, 0, [[0, lit], [.55, mixHex(lit, sh, .55)], [1, sh]]); ctx.fillRect(-w / 2, -h, w, h);
  ctx.fillStyle = rgba(P.night0, .22); ctx.fillRect(w * .3, -h, w * .2, h);   // the shaded side
  ctx.strokeStyle = rgba(mixHex(FROST.deep, P.night0, .3), .7); ctx.lineWidth = 5; ctx.strokeRect(-w * .36, -h * .9, w * .72, h * .84);   // the door seam
  ctx.fillStyle = rgba(mixHex(FROST.deep, P.night0, .2), .9); ctx.beginPath(); ctx.roundRect(w * .22, -h * .58, 10, h * .2, 5); ctx.fill();   // the handle
  ctx.fillStyle = rgba(mixHex(SNOW.lit, P.cream, .3), .9 - .4 * dk); ctx.beginPath(); ctx.ellipse(0, -h, w * .56, 12, 0, Math.PI, TAU); ctx.fill();   // snow on top
  ctx.fillStyle = rgba(SNOW.lit, .5); ctx.fillRect(-w / 2 - 6, -8, w + 12, 8);   // snow drifted at the foot
  if (gl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(FROST.core, .55 * gl); ctx.fillRect(-w * .36, -h * .94, w * .72, 5); ctx.restore(); }
  ctx.restore();
}
// a strand rising from a door into the sky (screen px: (x, y) = foot, len px up). u 0..1 (it rises), gold(k) → 0..1 a rung read gold, fade 0..1 (it goes out from the top)
export function riseStrand(ctx, t, x, y, len, s, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1, fd = clamp(o.fade ?? 0); if (u <= 0 || a <= 0 || len <= 2) return;
  const top = y - len * expoOut(u), cut = lerp(top, y, sineIO(fd)), hw = Math.max(2.4, 9 * s), pitch = Math.max(6, 26 * s);
  ctx.save(); ctx.globalAlpha *= a;
  const rail = lin(ctx, 0, top, 0, y, [[0, rgba(FROST.core, 0)], [.25, rgba(FROST.core, .45)], [1, rgba(FROST.body, .6)]]);
  ctx.fillStyle = rail; ctx.fillRect(x - hw, top, 1.4, y - top); ctx.fillRect(x + hw - 1.4, top, 1.4, y - top);
  let k = 0;
  for (let yy = y - pitch * .6; yy > top; yy -= pitch, k++) {
    const g = o.gold ? clamp(o.gold(k)) : 0, fadeTop = clamp((yy - top) / (len * .3));
    if (yy < cut) { ctx.fillStyle = rgba(mixHex(FROST.body, GOLD.core, g), (.32 + .5 * g) * fadeTop); ctx.fillRect(x - hw, yy, hw * 2, Math.max(1.2, 2.2 * s)); if (g > .1) halo(ctx, x, yy, hw * 3, .25 * g * fadeTop, GOLD.halo, GOLD.core); }
  }
  ctx.restore();
}
// the virus (cream, never red): a ring with short knobbed spikes, drawn in by u
export function virus(ctx, t, x, y, r, u, o = {}) {
  u = clamp(u); if (u <= 0) return; const a = o.a ?? 1, rot = t * .25;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = rgba(P.cream, .85 * a); ctx.fillStyle = rgba(P.cream, .85 * a); ctx.lineWidth = Math.max(1.4, r * .16); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU * sineIO(u)); ctx.stroke();
  for (let k = 0; k < 9; k++) { const e = rise(span(u, .3 + k * .05, .6 + k * .05)); if (e <= 0) continue; const an = k / 9 * TAU, r1 = r * (1 + .45 * e); ctx.beginPath(); ctx.moveTo(Math.cos(an) * r, Math.sin(an) * r); ctx.lineTo(Math.cos(an) * r1, Math.sin(an) * r1); ctx.stroke(); ctx.beginPath(); ctx.arc(Math.cos(an) * r1, Math.sin(an) * r1, r * .12 * e, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// the gate in the fence (between two posts; world units). Drawn over the fence: two stiles, three rails, a brace, a latch
const GATE_P = (() => { let i = 0; S.POSTS.forEach((q, k) => { if (Math.abs(q.x - 180) < Math.abs(S.POSTS[i].x - 180)) i = k; }); return [S.POSTS[i], S.POSTS[i + 1]]; })();
export const GATE = { x0: GATE_P[0].x + 14, x1: GATE_P[1].x - 14 };
export function gate(ctx, c, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const [p0, p1] = GATE_P, Q = (x, y, z) => S.proj(c, x, y, z);
  const wood = mixHex(P.night1, '#5a4236', .62), lit = mixHex(wood, mixHex(P.blue1, '#9a7a62', .4), .5), snow = rgba(mixHex(SNOW.lit, P.cream, .3), .9);
  const z0 = p0.z - 14, z1 = p1.z - 14, x0 = GATE.x0, x1 = GATE.x1, zAt = (x) => lerp(z0, z1, (x - p0.x) / (p1.x - p0.x));
  const bar = (xa, ya, xb, yb, th, col) => { const A = Q(xa, ya + th / 2, zAt(xa)), B = Q(xb, yb + th / 2, zAt(xb)), C = Q(xb, yb - th / 2, zAt(xb)), D = Q(xa, ya - th / 2, zAt(xa)); if (!A || !B || !C || !D) return; ctx.fillStyle = col; poly(ctx, [A, B, C, D]); ctx.fill(); };
  ctx.save(); ctx.globalAlpha *= a;
  for (const [y, th] of [[30, 16], [80, 14], [128, 16]]) bar(x0, y, x1, y, th, lit);
  bar(x0 + 10, 30, x1 - 10, 128, 13, wood);   // the brace
  for (const xx of [x0 + 8, x1 - 8]) { const A = Q(xx - 8, 140, zAt(xx)), B = Q(xx + 8, 140, zAt(xx)), C = Q(xx + 8, 6, zAt(xx)), D = Q(xx - 8, 6, zAt(xx)); if (A && B && C && D) { ctx.fillStyle = lin(ctx, A[0], 0, B[0], 0, [[0, wood], [1, lit]]); poly(ctx, [A, B, C, D]); ctx.fill(); } }
  const s0 = Q(x0, 137, zAt(x0)), s1 = Q(x1, 137, zAt(x1)), s2 = Q(x1, 133, zAt(x1)), s3 = Q(x0, 133, zAt(x0)); if (s0 && s1 && s2 && s3) { ctx.fillStyle = snow; poly(ctx, [s0, s1, s2, s3]); ctx.fill(); }
  const l = Q(x1 - 4, 92, zAt(x1)); if (l) { ctx.fillStyle = rgba(P.cream, .55); ctx.fillRect(l[0] - 3 * l[2], l[1] - 8 * l[2], 10 * l[2], 16 * l[2]); }
  ctx.restore();
}
// conifers on the far horizon, rising out of the snow line (u 0..1 per tree, staggered)
function forest(ctx, c, t, u) {
  if (u <= 0) return;
  // behind the field station: the forest is drawn after the hut, so cut the hut's silhouette (walls, roof, mast) out of it
  const hu = HUT, ph = S.proj(c, hu.x, 0, hu.z);
  ctx.save(); ctx.beginPath();
  if (ph) {
    const s = ph[2], w = hu.w, h = hu.h, rf = hu.roof, mx = hu.mast.x, roofAt = -h - (rf + 14) * (1 - Math.abs(mx) / (w / 2 + 60));
    const X = (x) => ph[0] + x * s, Y = (y) => ph[1] + y * s;   // (napi: path points are not transformed when added, so map them by hand)
    const ccw = (x, y, ww, hh) => { ctx.moveTo(X(x), Y(y)); ctx.lineTo(X(x), Y(y + hh)); ctx.lineTo(X(x + ww), Y(y + hh)); ctx.lineTo(X(x + ww), Y(y)); ctx.closePath(); };   // against the screen rect: a hole (nonzero)
    ccw(-w / 2, -h, w, h + 2);
    ctx.moveTo(X(w / 2 + 60), Y(-h)); ctx.lineTo(X(0), Y(-h - rf - 16)); ctx.lineTo(X(-w / 2 - 60), Y(-h)); ctx.closePath();
    ccw(mx - 30, -hu.mast.h - 40, 60, hu.mast.h + 40 + roofAt);
  }
  ctx.rect(-50, -50, W + 100, H + 100);
  ctx.clip();
  const col = mixHex(P.night0, P.ind1, .28), rimC = rgba(mixHex(SNOW.lit, P.blue1, .5), .35);
  for (const tr of FOREST) {
    const e = sineIO(span(u, (tr.x + 17000) / 19500 * .5, (tr.x + 17000) / 19500 * .5 + .5)); if (e <= 0) continue;
    const p = S.proj(c, tr.x, 0, tr.z); if (!p || p[0] < -200 || p[0] > W + 200) continue;
    const s = p[2], hh = tr.h * s, ww = hh * tr.w, base = p[1] + 2;
    ctx.save(); ctx.beginPath(); ctx.rect(p[0] - ww, base - hh * 1.2, ww * 2, hh * 1.2); ctx.clip(); ctx.translate(p[0], base + (1 - e) * hh * 1.02);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -hh);
    for (const [fy, fw] of [[.32, .55], [.58, .78], [.86, 1]]) { ctx.lineTo(ww * fw, -hh * (1 - fy)); ctx.lineTo(ww * fw * .45, -hh * (1 - fy) - hh * .02); }
    ctx.lineTo(ww * .12, 0); ctx.lineTo(-ww * .12, 0);
    for (const [fy, fw] of [[.86, 1], [.58, .78], [.32, .55]].reverse().reverse()) { ctx.lineTo(-ww * fw * .45, -hh * (1 - fy) - hh * .02); ctx.lineTo(-ww * fw, -hh * (1 - fy)); }
    ctx.closePath(); ctx.fill();
    if (tr.sn > .4) { ctx.fillStyle = rimC; ctx.fillRect(-ww * .3, -hh * .72, ww * .5, Math.max(1, hh * .015)); }
    ctx.restore();
  }
  ctx.restore();
}

// ================================================================================================================= WHERE THE ANIMALS ARE
const along = (pts, d) => { for (let i = 1; i < pts.length; i++) { const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (d <= L || i === pts.length - 1) { const f = clamp(d / L); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; } d -= L; } return pts[pts.length - 1]; };
const len = (pts) => { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; };
// the walk: accelerate over e s, glide, settle (distance 0..1)
const glide = (t, t0, t1, e = 2.5) => { if (t <= t0) return 0; if (t >= t1) return 1; const D = t1 - t0, v = 1 / (D - e); const x = t - t0;
  if (x < e) return v * x * x / (2 * e); if (x > D - e) { const y = D - x; return 1 - v * y * y / (2 * e); } return v * (x - e / 2); };
// the elephant family: out from behind the hut into the window light (c14), then one long calm walk to the place behind the gate (c16)
export const ELE_PATH = [ELE.A, ELE.B, [-2900, 8600], [-1300, 6000], ELE.END];
export function elephants(t, a) {
  const out = []; if (t < a.depends) return out;
  const L1 = len(ELE_PATH.slice(0, 2)), LR = len(ELE_PATH.slice(1)), P1 = ELE_PATH.slice(0, 2), PR = ELE_PATH.slice(1);
  const d2 = LR * glide(t, a.road - .2, a.lifts - 2.4, 3), moving2 = t > a.road - .2 && t < a.lifts - 2.4;
  const dir = Math.cos(Math.PI * ss(t, a.lifts - 2.2, a.lifts - .8));   // at the fence she turns (a paper cut-out turning) to face you
  [{ h: ELE.h, off: [0, 0] }, ...ELE.calves].forEach((q, k) => {
    // leg 1: out from behind the hut (each a little later), the calves spreading to their places beside her; leg 2: the family walks as one
    const f = glide(t, a.depends + .8 + .45 * k, a.asian + 1.6 + .5 * k, 1.4), moving1 = f > 0 && f < 1;
    const [x1, z1] = along(P1, L1 * f), [x2, z2] = along(PR, d2);
    const x = d2 > 0 ? x2 + q.off[0] : x1 + q.off[0] * f, z = d2 > 0 ? z2 + q.off[1] : z1 + q.off[1] * f;
    out.push({ x, z, h: q.h, k, dir: k ? 1 : (Math.abs(dir) < .02 ? .02 * Math.sign(dir || 1) : dir), moving: moving1 || moving2, dist: L1 * f + d2 + k * 37 });
  });
  return out;
}

// ================================================================================================================= THE CAMERA (one path for the whole group)
const C = (x, y, z, hz) => E.cam3({ x, y, z, f: F0, hz });
const L = (X, Y, Z, mag, sx, sy, hz) => S.look(X, Y, Z, mag, sx, sy, hz);
const ICE_K = (k) => S.look(S.ICE_P[0] + S.TRUCK * (k - 1) / S.CREEP * S.ICE_P[2] / F0, S.ICE_P[1], S.ICE_P[2], S.ICE_P[3] * k, S.ICE_P[4], S.ICE_P[5], S.ICE_P[6]);
export function keys(a) {
  const k = (t) => 1 + S.CREEP * Math.max(0, t - (a.T0 - S.SEAM_HALF));
  return [
    [a.T0 - .5, ICE_K(1)], [a.T0 + .5, ICE_K(k(a.T0 + .5))],
    [a.eighties, L(200, 170, 4350, 1.5, 960, 660, 470)],                     // the door frosts; a slow push, room for Willa on the left
    [a.decades, L(260, 160, 4260, 1.9, 980, 640, 420)],
    [a.babies2 + 1.2, L(420, 100, 3990, 2.45, 960, 700, 360)],               // the family tree on the snow
    [a.noList, L(430, 110, 4000, 2.5, 960, 710, 360)],
    [a.opened + .4, L(360, 150, 4150, 2.55, 960, 720, 380)],                  // to the open door: opened in time
    [a.govt, L(120, 200, 4700, 1.6, 900, 600, 470)],                           // pull back: the doors rise toward the hut
    [a.everyOne + .4, L(-1500, 0, 7000, 1.24, 700, 650, 300)],              // high over the wall: the doors back to the hut
    [a.forest + .6, L(-1580, 0, 7100, 1.25, 700, 650, 300)],                  // the forest edge rises on the horizon
    [a.think + .6, L(-1550, 0, 7150, 1.27, 700, 650, 300)],
    [a.goneE + .3, L(-1600, 0, 7200, 1.3, 700, 650, 305)],
    [a.mother + .6, L(-4700, 150, 10350, 3.0, 900, 720, 430)],                  // to the hut: the elephant family out of its shadow
    [a.virus + .5, L(-4650, 150, 10200, 3.7, 900, 740, 420)],
    [a.through + 1.2, L(-4620, 150, 10180, 3.8, 910, 740, 420)],
    [a.alive + .5, L(-4350, 150, 10000, 3.3, 900, 740, 430)],                   // they walk on; the camera follows
    [a.fifty + 1.4, C(-3000, -700, 4300, 300)],                                 // high and wide: the snow lights to the horizon
    [a.inEl, L(-2150, 150, 8030, 2.0, 940, 660, 480)],                          // the traits on the mother
    [a.notM + .8, L(-1900, 150, 7750, 2.0, 960, 660, 490)],
    [a.money + .6, C(-1200, -330, 3600, 480)],                                 // the gold flies to the poster: all the light on it
    [a.inFreezer + .2, C(-1500, -420, 3650, 360)],                            // back left: the freezer wall, the hut, the mast
    [a.inside + .1, C(-1560, -420, 3640, 365)],
    [a.once + 2.2, C(-1200, -350, 3450, 420)],                                 // back over the fence, above the posts
    [a.coat, C(-80, 0, 2130, 640)],                                             // like frame 0
    [a.lifts + 1.5, C(-70, 4, 2180, 640)],
    [a.who + .8, C(-20, -6, 2300, 630)],                                        // a breath toward the gate
    [a.grown + 1, C(-60, 0, 2260, 630)],
    [a.arkE + 1, C(-60, 0, 2200, 640)],
    [a.vend + .6, C(-80, 6, 2120, 645)],
    [a.endScreen, S.END_CAM], [a.end, S.END_CAM],
  ];
}
export function camera(t, a, K) {
  if (t < a.T0 + .5) return null;                                               // the plate draws itself
  let c = S.camPath(t, K);
  const dB = span(t, a.T0 + .5, a.T0 + 3.5) * (1 - .5 * span(t, a.endScreen - 2, a.endScreen));
  return S.drift(c, t, 2600, .9 * dB, 312);   // calm (was 1.2)
}

// ================================================================================================================= THE WORLD (state + draw)
// world(ctx, t, a, K, hook) → { c, out }. hook { pre(st) (change the world state), back(ctx, c) (world-space extras, after B3's things), extra(ctx, c, out) (screen space, last) }
export function world(ctx, t, a, K, hook = {}) {
  if (t < a.T0 + .5) { S.plateIce(ctx, t, a.TT); return { c: null, out: {} }; }
  const c = camera(t, a, K);
  // ---- the freezer door in the ice
  const frost = .52 * ss(t, a.T0 + .6, a.eighties - .2), doorD = span(t, a.lucky - .2, a.eighties + .6), open = ss(t, a.cells - .1, a.clones + .3);
  const doorGlow = .55 * bump(t, a.froze + 1.1, 1.6) + .7 * ss(t, a.just, a.opened + .4) * (1 - ss(t, a.scale + 1, a.govt + 1)) + .8 * bump(t, a.inFreezer, 3) + .9 * bump(t, a.ark + .1, 3.6);
  // ---- the wall rises (near → far), the strands rise, the comb reads, one vanishes
  const wallU = (w) => span(t, a.freeze - .2 + (w.k / 40) * 4.2, a.freeze + .9 + (w.k / 40) * 4.2);
  const strandU = (w) => span(t, a.genomes + .4 + (w.k / 40) * 1.6, a.genomes + 1.6 + (w.k / 40) * 1.6);
  const strandDown = ss(t, a.goneE + .2, a.depends + 1.6);                     // read, stored: they sink back into the doors
  const combX = lerp(HUT.x + 300, BLOCK.x + 900, ss(t, a.learns + .3, a.goneE - .2)), combA = rise(span(t, a.think + .2, a.learns + .4)) * (1 - expoIn(span(t, a.goneE - .4, a.goneE + .4)));
  const vanish = ss(t, a.unread - .3, a.gone + .6);
  const comb2X = lerp(HUT.x + 300, BLOCK.x + 900, ss(t, a.read - .4, a.inside + 1.6)), comb2A = rise(span(t, a.machine, a.read)) * (1 - expoIn(span(t, a.inside + .6, a.inside + 1.8)));
  const forestU = span(t, a.forest - .2, a.habitat + .4);
  // ---- the snow lights (c14 3.13 the Red List · c16 thousands of others), the gold flies to the poster (c15)
  const redWave = (g) => ss(t, a.redList + (g.z - 3500) / 22500 * 2.2, a.redList + .9 + (g.z - 3500) / 22500 * 2.2);
  const posterBuilt = span(t, a.cameras + .1, a.money + .9), posterOn = rise(posterBuilt) * (1 - ss(t, a.vend + 1, a.endScreen - 1.5));
  const ppts = F.beastPoints(520, 29, { ...F.MAMMOTH, lift: 0 });
  const flyU = (k) => span(t, a.cameras + .1 + (k / 2600) * 1.4, a.cameras + 1.5 + (k / 2600) * 1.4);
  const lateWave = (g) => ss(t, a.thousands - .2 + (g.z - 3500) / 22500 * 1.6, a.thousands + .7 + (g.z - 3500) / 22500 * 1.6) * (1 - .55 * ss(t, a.vend + 1, a.endScreen));
  const PSEL = 5;   // every 5th glint is a threatened species lit in 3.13 (520 of them: they become the poster)
  const glint = {
    a: lerp(.3, .45, span(t, a.T0 + .5, a.eighties)),
    comb: null,
    pos: (k, g, sx, sy) => {
      let gold = 0, x = sx, y = sy, al = 1;
      if (k % PSEL === 0) {
        gold = t < a.cameras + 3 ? redWave(g) * .8 : 0;
        if (t > a.cameras && t < a.cameras + 3.2) {
          const u = flyU(k); if (u >= 1) return null;
          if (u > 0) {
            const pp = S.proj(c, S.WORLD.poster.x, 0, S.WORLD.poster.z); if (!pp) return null;
            const ph = S.WORLD.poster.h * pp[2], [px, py] = ppts[(k / PSEL) % ppts.length], e = sineIO(u);
            x = lerp(sx, pp[0] - px * ph, e) + 40 * Math.sin(Math.PI * u) * Math.sin(k); y = lerp(sy, pp[1] + py * ph, e) - 180 * Math.sin(Math.PI * u) * (1 - u); gold = 1; al = 1 - .5 * u;
          }
        } else if (t >= a.cameras + 3.2) return null;
      } else gold = lateWave(g) * (k % 3 === 0 ? 1 : .55);
      return [x, y, al, gold];
    },
  };
  // ---- people (behind the camera until c16), the fence (switched on while it is behind the camera), the elephants
  const inFence = t > a.depends + 4;
  const hold = ss(t, a.hand, a.yours + .3);
  const walkU = ss(t, a.vend + .6, a.endScreen - .4), walkX = -330 * walkU, walking = t > a.vend + .6 && t < a.endScreen - .4;
  const grow = ss(t, a.grown - .2, a.grown + 2.2);
  const lookC = .4 + .3 * ss(t, a.lifts, a.lifts + 1) - .25 * ss(t, a.whatever, a.grown);
  const st = {
    sky: 1, poster: posterOn > 0 ? { a: posterOn, lift: .1 + .05 * bump(t, a.isPoster, 3) } : 0, glow: posterOn * (.7 + .3 * bump(t, a.onPoster, 3)),
    glint, comb: combA > .02 ? { x: combX, a: combA } : comb2A > .02 ? { x: comb2X, a: comb2A } : null,
    hut: { win: 1 + .8 * bump(t, a.vaccine - .3, 1.6) + .4 * bump(t, a.inFreezer + 1.5, 3), mast: 1 + 1.5 * bump(t, a.think, 1.8) + 1.5 * bump(t, a.machine, 1.8) },
    elephant: false, beast: false, wolf: false, ferret: false, bird: inFence ? { lit: rise(span(t, a.thousands, a.thousands + 1)), hop: span(t, a.thousands + .6, a.thousands + 1.1) } : false,
    fence: inFence ? 1 : 0,
    you: inFence ? { hold, look: .3 + .1 * ss(t, a.lifts, a.lifts + 1), x: S.WORLD.you.x + walkX, o: walking ? { walk: (t - a.vend) * 5.2 } : {} } : false,
    child: inFence ? { look: lookC, x: S.WORLD.child.x + walkX + 10 * grow, h: lerp(S.WORLD.child.h, 158, grow), o: walking ? { walk: (t - a.vend) * 5.2 + 1.3 } : {} } : false,
    snow: 1,
  };
  if (hook.pre) hook.pre(st, c);
  // ---- B3's things in the world, far → near (the forest, the wall, the strands, the block with its door, the family, the elephants)
  const items = [];
  items.push({ z: 19000, draw: (cx) => forest(cx, c, t, forestU) });
  for (const w of WALL) {
    const ri = wallU(w); if (ri <= 0) continue;
    const dk = w.k === VANISH ? vanish : 0;
    items.push({ z: w.z, draw: (cx) => {
      S.at(cx, c, w.x, w.z, () => frostDoor(cx, t, w.w, w.h, { rise: ri * (1 - .9 * (w.k === VANISH ? vanish : 0)), glow: .5 * bump(t, a.inFreezer + w.k * .03, 3) + .35 * bump(t, a.ark + .3 + w.k * .02, 3.2), dark: dk }));
      const su = strandU(w); if (su <= 0 || strandDown >= 1 || (w.k % 2 && w.k > 4)) return;
      const p = S.proj(c, w.x, w.h, w.z); if (!p) return;
      const readBy = combX > w.x ? clamp((combX - w.x) / 600) : 0;
      riseStrand(cx, t, p[0], p[1] - 10 * p[2], 1700 * p[2] * (1 - strandDown), p[2], { u: su, fade: w.k === VANISH ? vanish : 0, gold: (r) => ((r * 7 + w.k * 3) % 5 === 2 ? readBy : 0) * (w.k === VANISH ? 0 : 1) });
    } });
  }
  items.push({ z: BLOCK.z, draw: (cx) => S.at(cx, c, BLOCK.x, BLOCK.z, () => { S.iceBlock(cx, t, 0, 0, BLOCK.s, { shards: 1 - frost / .52, frost }); blockDoor(cx, t, { d: doorD, open, glow: doorGlow, vial: open }); }) });
  // Willa (1980s): walks in behind the block's left side, gives her cells, walks on behind the block and is gone
  const wU = ss(t, a.eighties - .3, a.froze + .3), wU2 = ss(t, a.decades - .4, a.cells + .6), wx = lerp(lerp(FAM.willa.x0, FAM.willa.x1, wU), FAM.willa.x2, wU2);
  if (t > a.eighties - .4 && t < a.clones + 1) items.push({ z: FAM.willa.z, draw: (cx) => { const p = S.proj(c, wx, 0, FAM.willa.z); if (p) F.ferret(cx, t, p[0], p[1], FAM.willa.s * p[2], { dir: -1, walk: (wU > 0 && wU < 1) || (wU2 > 0 && wU2 < 1) ? wx * .05 : undefined, rim: mixHex(FROST.core, LAMP.body, .3) }); } });
  // the clone and the generations: each walks out of its parent along a gold line on the snow (the line stays: the family tree)
  const gen = [
    { q: FAM.clone, from: FAM.clone.from, t0: a.clones - .1, t1: a.clones + 2.2 },
    ...FAM.kits.map((q, i) => ({ q, from: [FAM.clone.x, FAM.clone.z], t0: a.babies + .1 + i * .35, t1: a.babies + 2.0 + i * .35 })),
    ...FAM.grand.map((q, i) => ({ q, from: [FAM.kits[q.p].x, FAM.kits[q.p].z], t0: a.babies2 + .1 + i * .3, t1: a.babies2 + 1.8 + i * .3 })),
  ];
  const famLit = Math.max(rise(span(t, a.living - .1, a.living + .8)) * (1 - ss(t, a.saved + 1, a.vanish)), .9 * rise(span(t, a.ferrets - .1, a.ferrets + .7)));
  for (const g of gen) {
    if (t < g.t0) continue;
    const u = ss(t, g.t0, g.t1), x = lerp(g.from[0], g.q.x, u), z = lerp(g.from[1], g.q.z, u), moving = t < g.t1;
    items.push({ z: Math.min(z, g.from[1]) - 1, draw: (cx) => {
      // the gold line of the tree (from the parent to here), drawn on the snow
      const p0 = S.proj(c, g.from[0], 0, g.from[1]), p1 = S.proj(c, x, 0, z);
      if (p0 && p1) { cx.save(); cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = rgba(GOLD.line, .34 * (1 - .4 * span(t, a.scale, a.govt))); cx.lineWidth = Math.max(1, 2.2 * p1[2]); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(p0[0], p0[1]); cx.lineTo(p1[0], p1[1]); cx.stroke(); cx.restore(); }
      if (!p1) return;
      const fl = Math.max(famLit, .3 * ss(t, g.t0 + .3, g.t1)); if (fl > 0) halo(cx, p1[0], p1[1] - g.q.s * .15 * p1[2], Math.max(26, g.q.s * 2.2 * p1[2]), .45 * fl, GOLD.halo, GOLD.body);
      const emerge = g.q === FAM.clone ? ss(t, g.t0, g.t0 + .6) : 1;
      F.ferret(cx, t + g.q.x * .01, p1[0], p1[1], g.q.s * p1[2], { dir: g.q.x >= g.from[0] ? 1 : -1, walk: moving ? (x + z) * .06 : undefined, a: emerge, rim: mixHex(LAMP.body, GOLD.core, .4 + .6 * famLit) });
    } });
  }
  // the elephants (the mother; two calves), side view, warm rim from the window
  const eles = elephants(t, a), traits = ss(t, a.traits - .3, a.inEl + .2), lit16 = rise(span(t, a.elephants - .1, a.elephants + .8));
  const calvesLit = rise(span(t, a.through + .1, a.through + 1.2)) * (1 - ss(t, a.alone, a.alone + 2));
  for (const e of eles) items.push({ z: e.z, draw: (cx) => {
    const p = S.proj(c, e.x, 0, e.z); if (!p || p[0] < -e.h * p[2] * 3 || p[0] > W + e.h * p[2] * 3) return;
    const mom = e.k === 0, tr = mom ? (t < a.once ? traits : 1) : 0;
    const li = mom ? lit16 * .8 : Math.max(calvesLit, lit16 * .8);
    if (li > 0) halo(cx, p[0], p[1] - e.h * p[2] * .6, e.h * p[2] * 2.2, .35 * li, GOLD.halo, GOLD.body);
    const pre = { fur: lerp(0, F.COLD.fur, tr), ears: lerp(1, F.COLD.ears, tr), dome: lerp(0, F.COLD.dome, tr), tusk: lerp(0, F.COLD.tusk, tr) };
    const gt = mom && t < a.once ? rise(span(t, a.traits, a.traits + .7)) * (1 - ss(t, a.notM + 1.2, a.cameras + .5)) : 0;
    const out2 = F.beast(cx, t + e.k * 1.7, p[0], p[1], e.h * p[2], { ...pre, dir: e.dir, walk: e.moving ? e.dist * .012 * 300 / e.h : undefined, rim: mixHex(LAMP.halo, GOLD.body, li), rimA: .8, rimDir: [e.dir > 0 ? -.4 : .4, 1],
      shade: .15, lift: mom ? .55 * ss(t, a.lifts - .1, a.lifts + 1.4) * (1 - ss(t, a.should + 2, a.who)) + .04 * Math.sin(t * .4) : .05 * Math.sin(t * .6 + e.k),
      flick: bump(t, a.asian + .3 + e.k * .5, .9) + (mom ? bump(t, a.lifts + 1.5, .9) : 0), glowTrait: gt > 0 ? { fur: gt, fat: rise(span(t, a.traits + .4, a.traits + 1.1)) * gt, ears: rise(span(t, a.traits + .8, a.traits + 1.5)) * gt } : undefined,
      breath: mom ? span(t, a.lifts + 1, a.lifts + 3.4) : 0 });
    if (hook.ele) hook.ele(cx, e, p, out2);
  } });
  items.sort((p, q) => q.z - p.z);
  st.back = (cx) => { for (const it of items) it.draw(cx); if (hook.back) hook.back(cx, c); };
  st.extra = (cx, out) => { if (inFence) gate(cx, c, t); if (hook.extra) hook.extra(cx, c, out); };
  const out = S.fenceWorld(ctx, c, t, st);
  return { c, out };
}
// screen position of a world point (null when behind the camera)
export const at2 = (c, X, Y, Z) => (c ? S.proj(c, X, Y, Z) : null);
// screen-space words: a line that rises (Inter 600 caps) and sinks; t0 in, t1 out
export function line(ctx, t, text, x, y, t0, t1, o = {}) {
  const u = rise(span(t, t0, t0 + .7)) * (1 - sineIO(span(t, t1 - .6, t1))); if (u <= 0) return;   // soft exit (expoIn popped the last frames)
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.maskLine(ctx, [[text, 0]], x, y, o.size ?? 64, u, { serif: o.serif ?? false, weight: 600, col: o.col ?? P.core0, glow: o.glow ?? true, align: o.align }); ctx.restore();
}
