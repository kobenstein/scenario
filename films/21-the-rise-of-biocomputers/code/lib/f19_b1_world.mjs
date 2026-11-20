// Film 19 · B1 (c02–c05) shared module: anchors, the 2D field camera, the box (CL1) with its iris, static, the ORDER / NOISE strips,
// the aisle set of c04/c05 and the camera swings between the aisle and the dish. Owned by builder B1; uses lib/f19_kit.mjs only.
//
// THE FIELD WORLD: the dish field has fixed world coordinates (the dish at 960/540, r 470 = plateClock's dish). A 2D camera
// { x, y, z } looks at it: screen = (p − (x, y))·z + (960, 540). The canonical camera { 960, 540, 1 } IS the dish field of the
// plates and of C_TOP (the 3D camera straight down on the open drawer). Everything on the field is drawn in SCREEN space through
// the camera (mapOf, S), so line weights, the box and the dish are always the kit's own drawings at their true screen size.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, halo, glowFill, prng, drift } = E;
const { COOL, NET, bump } = F;
const TAU = Math.PI * 2;

export const FIELD = { cx: 960, cy: 540, r: 470 };
export const night = (ctx) => { ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H); };

// ============================================================================================================== anchors (phrases only)
export function anchors(T) {
  const G = (p, after = -1, n = 0) => T.G(p, n, after), GE = (p, after = -1) => T.GE(p, 0, after);
  const a = {};
  // c02
  a.lab = G('In a lab'); a.turned = G('are turned back', a.lab); a.stem = G('stem cells', a.lab); a.almost = G('almost anything', a.lab);
  a.nobel = G('Nobel Prize', a.lab); a.embryos = G('no embryos', a.lab); a.fwd = G('clock runs forward', a.lab); a.grow = G('grow into neurons', a.lab);
  a.brain = G('Brain cells', a.grow); a.spread = G('Spread them', a.lab); a.chip = G('on a chip', a.spread); a.reach = G('reach out', a.spread);
  a.wiring = G('wiring up', a.spread); a.own = GE('their own', a.spread);
  a.tiny = G('Tiny electrodes'); a.signals = G('send them signals', a.tiny); a.answers = G('their answers', a.tiny); a.code = G('Ordinary code', a.tiny);
  a.codeE = GE('the conversation', a.tiny);
  a.computer = G("That's the computer"); a.living = G('living neurons', a.computer); a.box = G('inside a box', a.computer);
  a.life = G('life support', a.computer); a.cortical = G('Cortical Labs', a.computer);
  a.ai = G('The artificial intelligence you know'); a.imitates = G('imitates neurons', a.ai); a.math = G('with math', a.ai); a.real = G('the real thing', a.ai);
  a.how = G('So how do you teach it', a.ai); a.reward = G('without a reward', a.how);
  // c03
  a.came = G('The answer came'); a.four = G('four years ago', a.came); a.game = G('old video game', a.came); a.pong = G('Pong', a.game);
  a.connected = G('They connected', a.came); a.human = G('human cells', a.connected); a.mice = G('from mice', a.connected);
  a.screen = G('never saw a screen', a.connected); a.saw = G('saw a screen', a.connected); a.patch = G('One patch', a.connected); a.where = G('where the ball was', a.patch);
  a.activity = G('Activity in another patch', a.patch); a.moved = G('moved the paddle', a.patch);
  a.trick = G('Then came the trick'); a.hit = G('Hit the ball', a.trick); a.tidy = G('tidy signal', a.trick); a.same = G('Same every time', a.trick);
  a.miss = G('Miss', a.trick); a.fourSec = G('four seconds', a.miss); a.static = G('Electrical static', a.miss); a.noRew = G('No reward', a.miss);
  a.order = G('order', G('Just order', a.noRew)); a.chaos = G('chaos', a.noRew);
  // c04
  a.five = G('After about five minutes'); a.fiveW = G('five minutes', a.five); a.rallies = G('rallies got longer', a.five); a.nofb = G('no feedback', a.five);
  a.luck = G("wasn't luck", a.five);
  a.looks = G('It looks like the cells want'); a.want = G('want the static', a.looks); a.staticW = G('static to stop', a.looks);
  a.tooBig = G('too big a word', a.looks); a.settle = G('settle into', a.looks); a.away = G('keeps the noise away', a.looks); a.awayE = GE('keeps the noise away', a.looks);
  a.behind = G('Behind the trick'); a.friston = G('Karl Friston', a.behind); a.livingT = G('Living things act', a.behind);
  a.predictable = G('more predictable', a.behind); a.youToo = G('You do it too', a.behind); a.radio = G('crackling radio', a.behind);
  a.voice = G('voice comes through', a.behind); a.voiceE = GE('voice comes through', a.behind);
  a.heres = G("Here's Brett Kagan"); a.c2 = F.clipWin(T, 'C2');
  a.soCells = G('So cells can learn'); a.orderNoise = G('order and noise', a.soCells); a.labTrick = G('lab trick', a.soCells);
  // c05
  a.stay = G("It didn't stay in the lab"); a.product = G('became a product', a.stay); a.thirty = G('thirty-five thousand', a.stay);
  a.rent = G('rent one', a.stay); a.few = G('a few hundred', a.stay); a.fewE = GE('a week', a.few);
  a.gameQ = G('And that game from the start'); a.doom = G('Doom', a.gameQ); a.week = G('about a week', a.gameQ);
  a.setting = G('Setting up Pong', a.gameQ); a.pongW = G('Pong', a.setting); a.yearHalf = G('a year and a half', a.gameQ);
  a.turn = G('The cells turn', a.gameQ); a.find = G('find enemies', a.turn); a.shoot = G('and shoot', a.turn); a.die = G('die a lot', a.turn);
  a.oneOf = G("One of the company's own scientists"); a.scientists = G('scientists puts it', a.oneOf); a.quote = G('The system', a.oneOf);
  a.still = G('Still', a.quote); a.pong2 = G('Pong to Doom', a.still); a.fourY = G('four years', a.still);
  a.why = G('So why put these boxes'); a.rack = G('server rack', a.why);
  a.number = G('It comes down to a number');
  return a;
}

// ============================================================================================================== the 2D field camera
export const cam2 = (x = 960, y = 540, z = 1) => ({ x, y, z });
export const CANON = cam2();
// the dish on the field between the explainers (c02 end … c04): a little more chip than the plate, the electrodes awake
export const FIELD_DISH = { glow: .6, chip: .7, electrodes: .45, rim: .8 };
export function cam2At(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const A = K[i][1], B = K[i + 1][1], u = sineIO((t - K[i][0]) / (K[i + 1][0] - K[i][0]));
  return { x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u), z: Math.exp(lerp(Math.log(A.z), Math.log(B.z), u)) };
}
// the breathing drift on top (amt 0 = none): a few world px and a hair of zoom, slow crooked sines
export const cam2Drift = (c, t, amt = 1) => ({ x: c.x + drift(t, 5 * amt, 3), y: c.y + drift(t, 4 * amt, 5), z: c.z * (1 + .006 * amt * drift(t, 1, 7)) });
export const S = (c, x, y) => [(x - c.x) * c.z + 960, (y - c.y) * c.z + 540];
export const mapOf = (c) => { const [x, y] = S(c, FIELD.cx, FIELD.cy); return F.fieldMap(x, y, FIELD.r * c.z); };

// ============================================================================================================== THE BOX (CL1) with an iris
// The box's front in screen space, built AROUND its dish window: boxFromWindow(map) gives the box whose window holds exactly that
// dish (the window radius = dish r / .92, the kit's cl1 proportions). The body is revealed by an IRIS: a ring of light that runs out
// of the window rim over the body (o.iris in window radii; 1 = only the window, ≥ cover = the whole box). The dish itself is drawn by
// the caller (it is the same dish as on the field), boxFront() adds the window ring and its halo on top.
export function boxGeo(x, y, w) { const h = w * .62; return { x, y, w, h, wx: x - w * .12, wy: y - h * .56, wr: h * .3 }; }
export function boxFromWindow(m) { const wr = m.r / .92, h = wr / .3, w = h / .62; return boxGeo(m.c[0] + .12 * w, m.c[1] + .56 * h, w); }
export const boxCover = (g) => Math.max(...[[g.x - g.w / 2, g.y - g.h], [g.x + g.w / 2, g.y - g.h], [g.x - g.w / 2, g.y], [g.x + g.w / 2, g.y]].map(([x, y]) => Math.hypot(x - g.wx, y - g.wy))) / g.wr + .02;
const bodyPath = (g) => { const p = new Path2D(); p.roundRect(g.x - g.w / 2, g.y - g.h, g.w, g.h, g.w * .06); return p; };
export function box(ctx, t, g, o = {}) {
  const { x, y, w, h, wx, wy, wr } = g, cover = boxCover(g), ir = clamp(o.iris ?? 99, 1, cover) * wr;
  if (ir <= wr * 1.002) return;
  const body = bodyPath(g), k = clamp((ir / wr - 1) / .6);           // k: how far the reveal is past the window (for the glow)
  ctx.save(); ctx.beginPath(); ctx.arc(wx, wy, ir, 0, TAU); ctx.clip();
  glowFill(ctx, body, w * .12, .3 * k, P.blue0);
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.night1, P.ind2, .6)], [.55, mixHex(P.ind1, P.blue1, .35)], [1, P.night1]]); ctx.fill(body);
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = Math.max(1, w * .008); ctx.stroke(body);
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - w / 2 + w * .05, y - h * .22, w * .9, h * .02);
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(wx, wy, wr, 0, TAU); ctx.fill();
  // life support: two tubes (a pump bead runs along them) + the reservoir; o.pump 0..1, o.tube (extra light on the tubes)
  const pump = o.pump ?? .6, rx = x + w * .3, tb = o.tube ?? 0;
  ctx.strokeStyle = rgba(mixHex(COOL.edge, COOL.mid, tb), .75 + .2 * tb); ctx.lineWidth = w * .022; ctx.lineCap = 'round';
  for (const kk of [0, 1]) { ctx.beginPath(); ctx.moveTo(wx + wr * .9, wy - wr * .2 + kk * wr * .4); ctx.bezierCurveTo(wx + wr * 1.6, wy - wr * .4 + kk * wr * .8, rx - w * .08, y - h * .78 + kk * h * .3, rx, y - h * .7 + kk * h * .3); ctx.stroke(); }
  ctx.fillStyle = mixHex(P.night1, COOL.deep, .5); ctx.beginPath(); ctx.roundRect(rx - w * .06, y - h * .84, w * .14, h * .62, w * .03); ctx.fill(); ctx.stroke();
  const lvl = .55 + .05 * Math.sin(t * 1.2); ctx.fillStyle = rgba(COOL.edge, .5); ctx.fillRect(rx - w * .05, y - h * .24 - h * .56 * lvl, w * .12, h * .56 * lvl);
  if (pump > 0) for (const ph of [0, .5]) { const u = (t * .8 + ph) % 1; const px = lerp(wx + wr, rx, u), py = lerp(wy, y - h * .7, u) - Math.sin(Math.PI * u) * h * .08; halo(ctx, px, py, w * .035, .6 * pump, COOL.edge, COOL.core); }
  const sl = .7 + .3 * Math.sin(t * 2.1) + .6 * (o.status ?? 0); ctx.fillStyle = rgba(COOL.core, clamp(sl)); ctx.beginPath(); ctx.arc(x + w * .41, y - h * .12, w * .012, 0, TAU); ctx.fill();
  if ((o.status ?? 0) > 0) halo(ctx, x + w * .41, y - h * .12, w * .05, .5 * o.status, COOL.edge, COOL.core);
  ctx.restore();
  // the iris edge: a thin cool ring of light running over the body (only while it runs)
  if (ir < cover * wr * .995) {
    ctx.save(); ctx.clip(body);
    const e = 1 - clamp((ir / wr - 1) / (cover - 1));
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(COOL.mid, .5 * Math.min(1, e * 3)); ctx.lineWidth = Math.max(1.5, wr * .02);
    ctx.beginPath(); ctx.arc(wx, wy, ir, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(COOL.edge, .16 * Math.min(1, e * 3)); ctx.lineWidth = Math.max(4, wr * .12); ctx.stroke();
    ctx.restore();
  }
}
// on top of the dish: the window ring and the window's halo (both grow with the reveal)
export function boxFront(ctx, t, g, o = {}) {
  const cover = boxCover(g), k = clamp(((o.iris ?? 99) - 1) / .6);
  if (k <= 0) return;
  halo(ctx, g.wx, g.wy, g.wr * 2.2, .3 * k * (o.lit ?? 1), P.halo1, P.core1);
  ctx.strokeStyle = rgba(COOL.mid, .7 * k); ctx.lineWidth = Math.max(1, g.w * .01); ctx.beginPath(); ctx.arc(g.wx, g.wy, g.wr, 0, TAU); ctx.stroke();
  return cover;
}

// ============================================================================================================== electrodes, static
export const eUV = (i, j) => [-.44 + i * .1257, -.44 + j * .1257];
export const ePads = (() => { const o = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if (!((i === 0 || i === 7) && (j === 0 || j === 7))) o.push([i, j]); return o; })();
const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// static: a seeded flicker (15 Hz) — o.k(i, j) → 0..1 intensity per electrode; also somas fire at random
export const staticPulse = (t, i, j, k = 1) => { if (k <= 0) return 0; const n = Math.floor(t * 15); const h = hash(n * 3.1 + i * 17.3, j * 5.7 + n); return h > .62 ? k * (h - .62) / .38 : 0; };
export const staticFire = (t, i, k = 1) => { if (k <= 0) return 0; const n = Math.floor(t * 15); const h = hash(n * 1.7 + i * 9.1, i * .3 + n * .7); return h > .8 ? k * (h - .8) / .2 * .9 : 0; };
// cool static specks inside the dish (screen); keep(u, v) → false hides a speck (the calm area)
export function staticSpecks(ctx, t, m, k, keep) {
  if (k <= 0) return;
  const n = Math.floor(t * 15);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let s = 0; s < 220; s++) {
    const a = hash(n + s * .37, s) * TAU, d = Math.sqrt(hash(s * 1.3, n * .91 + s)) * .97, u = Math.cos(a) * d, v = Math.sin(a) * d;
    if (keep && !keep(u, v)) continue;
    const q = m(u, v), L = (2 + 7 * hash(s, n * 2.3)) * m.r / 470;
    ctx.fillStyle = rgba(COOL.core, k * (.3 + .5 * hash(n, s * 3.3))); ctx.fillRect(q[0] - L / 2, q[1] - .8, L, 1.6);
  }
  ctx.restore();
}

// ============================================================================================================== ORDER / NOISE strips
// Field-world geometry (right of the dish): the ORDER strip (gold ticks) and the NOISE strip (cool static), each with a thin feed line
// from the dish rim. They are filled by what came out of the dish (c03); in c04 the ORDER ticks rise into the rally staircase.
export const STRIP = { x0: 1600, x1: 2150, yO: 400, yN: 690, h: 84, step: 25, feedO: [1432, 470], feedN: [1428, 620] };
export const NTICK = Math.floor((STRIP.x1 - STRIP.x0 - 12) / STRIP.step) + 1;   // ticks in the ORDER strip
// o: { feedO 0..1, feedN 0..1 (the feed lines drawn), ticks: (k) => 0..1 (tick k stamped), tickH: (k) → height factor, glowO, glowN,
//      noise 0..1 (how far the static fills the NOISE strip, left → right), noiseK (static strength), flatN 0..1 (the NOISE strip
//      replaced by a flat cool line: 'no feedback'), sinkO, sinkN 0..1 }
export function strips(ctx, t, c, o = {}) {
  const z = c.z, s = (x, y) => S(c, x, y);
  ctx.save(); ctx.lineCap = 'round';
  // feed lines (drawn by their spark from the dish rim)
  for (const [u, p0, y] of [[o.feedO ?? 0, STRIP.feedO, STRIP.yO], [o.feedN ?? 0, STRIP.feedN, STRIP.yN]]) {
    if (u <= 0) continue;
    const A = s(p0[0], p0[1]), B = s(STRIP.x0 - 14, y), cool = y === STRIP.yN;
    ctx.strokeStyle = rgba(cool ? COOL.edge : P.halo1, .55); ctx.lineWidth = Math.max(1, 2 * z);
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(lerp(A[0], B[0], u), lerp(A[1], B[1], u)); ctx.stroke();
    if (u < 1) halo(ctx, lerp(A[0], B[0], u), lerp(A[1], B[1], u), 26 * z, .7, cool ? COOL.edge : P.halo0, cool ? COOL.core : P.core0);
  }
  // ORDER: a row of regular gold ticks (each stamped when its pulse arrives); in c04 they rise (rallies)
  const sinkO = expoIn(clamp(o.sinkO ?? 0));
  if (o.ticks && sinkO < 1) {
    for (let k = 0; k < NTICK; k++) {
      const u = clamp(o.ticks(k)); if (u <= 0) continue;
      const x = lerp(STRIP.x0 + 6 + k * STRIP.step, STRIP.x0 - 10, sineIO(span(sinkO, .35, 1))), hh = STRIP.h * (o.tickH ? o.tickH(k) : 1) * expoOut(u) * (1 - sinkO);
      const [bx, by] = s(x, STRIP.yO + STRIP.h / 2), top = by - hh * z;
      const lit = .75 + .25 * Math.sin(t * 2 + k * .9) * .3 + (o.glowO ?? 0) * .3;
      ctx.strokeStyle = rgba(mixHex(P.halo0, P.core0, .35 + .4 * (o.glowO ?? 0)), clamp(lit)); ctx.lineWidth = Math.max(2, 7 * z);
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, top); ctx.stroke();
      if (u < 1) halo(ctx, bx, top, 30 * z, .6 * (1 - u), P.halo0, P.core0);
    }
    if ((o.glowO ?? 0) > 0) { const [cx, cy] = s((STRIP.x0 + STRIP.x1) / 2, STRIP.yO); halo(ctx, cx, cy, 330 * z, .14 * o.glowO, P.halo1, P.core1); }
  }
  // NOISE: cool static filling the strip from the left (o.noise = how far), then flickering; o.flatN turns it into a flat cool line
  const nz = clamp(o.noise ?? 0), sinkN = expoIn(clamp(o.sinkN ?? 0)), flat = clamp(o.flatN ?? 0);
  if (nz > 0 && sinkN < 1) {
    const n = Math.floor(t * 15), xEnd = lerp(STRIP.x0, STRIP.x1, nz * (1 - flat));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let x = STRIP.x0 + 4, q = 0; x < xEnd; x += 7, q++) {
      const hh = STRIP.h * (.15 + .85 * hash(n + q * .13, q)) * (o.noiseK ?? 1) * (1 - sinkN), [bx, by] = s(x, STRIP.yN + STRIP.h / 2);
      ctx.strokeStyle = rgba(COOL.mid, .35 + .45 * hash(q, n * 1.7)); ctx.lineWidth = Math.max(1.2, 3 * z);
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - hh * z); ctx.stroke();
    }
    if ((o.glowN ?? 0) > 0) { const [cx, cy] = s((STRIP.x0 + STRIP.x1) / 2, STRIP.yN); halo(ctx, cx, cy, 300 * z, .12 * o.glowN, COOL.edge, COOL.core); }
    ctx.restore();
  }
  if (flat > 0 && (o.flatU ?? 0) > 0) {   // the flat cool line ('no feedback'): low regular ticks drawn from the strip's start
    const xEnd = lerp(STRIP.x0, STRIP.x1, clamp(o.flatU)), sinkF = expoIn(clamp(o.sinkF ?? 0));
    for (let k = 0; k < NTICK; k++) {
      const x0 = STRIP.x0 + 6 + k * STRIP.step; if (x0 > xEnd) break; const x = lerp(x0, STRIP.x0 - 10, sineIO(span(sinkF, .35, 1)));
      const [bx, by] = s(x, STRIP.yN + STRIP.h / 2), hh = STRIP.h * .22 * (1 + .06 * Math.sin(t * 1.3 + k)) * (1 - sinkF);
      ctx.strokeStyle = rgba(COOL.mid, .7); ctx.lineWidth = Math.max(1.5, 5 * z); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - hh * z); ctx.stroke();
    }
  }
  ctx.restore();
}

// ============================================================================================================== a label (screen space)
// a thin line from an anchor point, then a two-line label rising from its baseline (Inter caps), like c01's SINGAPORE
export function tag(ctx, x, y, u, l1, l2, o = {}) {
  if (u <= 0) return;
  const dx = o.dx ?? 70, dy = o.dy ?? -70, x1 = x + dx, y1 = y + dy, len = o.len ?? Math.max(F.measure(l1, o.s1 ?? 30, false), l2 ? F.measure(l2, o.s2 ?? 18, false) : 0) + 16;
  F.rule(ctx, x, y, x1, y1, smooth(clamp(u * 1.6)), { w: 2 });
  ctx.strokeStyle = rgba(P.halo1, .6 * u); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + len * expoOut(u), y1); ctx.stroke();
  F.maskLine(ctx, [[l1, 0]], x1 + 4, y1 - 14, o.s1 ?? 30, u, { serif: false, weight: 600, col: P.cream, glow: false });
  if (l2) F.maskLine(ctx, [[l2, 0]], x1 + 4, y1 + 30, o.s2 ?? 18, u, { serif: false, weight: 600, col: P.halo2, glow: false });
}
// a small caps word rising from its baseline (screen space)
export const word = (ctx, s, x, y, size, u, o = {}) => { if (u > 0) F.maskLine(ctx, [[s, 0]], x, y, size, u, { serif: false, weight: 600, col: o.col ?? P.cream, glow: false, align: o.align }); };

// ============================================================================================================== the aisle (c04, c05)
export const DISH = { X: 0, Y: F.drawerY(F.OPEN) + 12, Z: -F.RACK.tray * .5, R: F.RACK.dishR };
export const C_TOP = F.cam({ tx: DISH.X, ty: DISH.Y, tz: DISH.Z, d: 1500 * DISH.R / FIELD.r, p: -Math.PI / 2, f: 1500 });
// a swing between two cameras: o.first 'target' (the target leads, pitch/distance follow: tilt DOWN into the dish, c01's camDesc) or
// 'pitch' (pitch/distance lead, the target follows: tilt UP out of the dish)
// wide = true spreads target and pitch over more of the move at a constant-speed ease (lower peak speed: the long tilt back down at the end of c04)
// ease with a constant-speed middle (cosine ramps over r at both ends): peak speed 1/(1−r) instead of sineIO's π/2
export function rampIO(u, r = .22) {
  u = clamp(u); const v = 1 / (1 - r), f = (x) => v * (x / 2 - r / (2 * Math.PI) * Math.sin(Math.PI * x / r));
  return u < r ? f(u) : u > 1 - r ? 1 - f(1 - u) : v * (r / 2 + (u - r));
}
export function swing(A, B, u, first = 'target', wide = false) {
  const lo = wide ? .85 : .7, ov = wide ? .1 : .2, e = wide ? rampIO : sineIO;
  const a = first === 'target' ? e(clamp(u / lo)) : e(clamp((u - (1 - lo)) / lo)), b = first === 'target' ? e(clamp((u - ov) / (1 - ov))) : e(clamp(u / (1 - ov)));
  const o = {};
  for (const k of ['tx', 'ty', 'tz', 'ox', 'oy', 'f']) o[k] = lerp(A[k] ?? 0, B[k] ?? 0, a);
  o.p = lerp(A.p, B.p, b); o.d = Math.exp(lerp(Math.log(A.d), Math.log(B.d), b));
  return o;
}

// ============================================================================================================== c03 ↔ c04 (shared)
// the camera across the c03|c04 boundary: from the Pong/strips framing to the strips close-up (one long sine move)
export const C_STRIPS = cam2(1290, 545, .85), C_RALLY = cam2(1640, 520, 1.05);
export const k34 = (a) => [[a.noRew + .1, C_STRIPS], [a.rallies + .4, C_RALLY]];
export const hit2 = (a) => (a.hit + a.miss) / 2;                    // the second hit ("Same every time")
export const staticT = (a) => a.miss + .45;                          // the ball bursts into static (4 s)
const DIAL = [1545, 400];
// tick k of the tidy pulses: 4 regular ticks per hit leave the dish and are stamped into the ORDER strip; "Just order" fills the rest
export const tickTimes = (a) => { const h = [a.hit, hit2(a)], o = []; for (const H of h) for (let k = 0; k < 4; k++) o.push(H + .08 + k * .16); return o; };
export function stripsDraw(ctx, t, c, a) {
  const tt = tickTimes(a), s0 = staticT(a);
  const stamp = (k) => (k < 8 ? tt[k] + .35 : a.order + .05 + (k - 8) * .05);
  const sink = sineIO(span(t, a.looks - .7, a.looks + .3));
  const feedBack = 1 - sineIO(span(t, a.looks + .15, a.looks + .9));
  const rng = prng(1903), RH = Array.from({ length: NTICK }, (_, k) => 1 + 2.3 * Math.pow(k / (NTICK - 1), 1.25) * (.85 + .3 * rng()));
  const o = {
    feedO: span(t, a.hit + .05, a.hit + .45) * feedBack, feedN: span(t, s0, s0 + .4) * feedBack,
    ticks: (k) => span(t, stamp(k) - .02, stamp(k) + .12),
    tickH: (k) => lerp(1, RH[k], sineIO(span(t, a.rallies - .7 + k * .17, a.rallies - .1 + k * .17))),
    glowO: bump(t, a.order - .1, 1.6) + .8 * bump(t, a.luck - .1, 1.6),
    noise: span(t, s0 + .3, s0 + 4), noiseK: 1, glowN: bump(t, a.chaos - .1, 1.6),
    flatN: span(t, a.nofb - 1.0, a.nofb - .25), flatU: span(t, a.nofb - .15, a.nofb + 1.1),
    sinkO: sink, sinkF: sink,
  };
  strips(ctx, t, c, o);
  // the 5-minute dial at the start of the ORDER strip (c04): its hand sweeps once while the rallies grow
  const du = F.rise(span(t, a.fiveW - .4, a.fiveW + .4)) * (1 - sink);
  if (du > 0) {
    const [x, y] = S(c, DIAL[0], DIAL[1] + 4), R = 26 * c.z * expoOut(du), sw = sineIO(span(t, a.fiveW, a.luck));
    ctx.save(); ctx.strokeStyle = rgba(P.halo1, .8); ctx.lineWidth = Math.max(1.2, 2.2 * c.z);
    ctx.beginPath(); ctx.arc(x, y, R, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(du * 1.3)); ctx.stroke();
    ctx.fillStyle = rgba(P.halo1, .25); ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, R * .9, -Math.PI / 2, -Math.PI / 2 + TAU * sw); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.core0, .95); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(-Math.PI / 2 + TAU * sw) * R * .85, y + Math.sin(-Math.PI / 2 + TAU * sw) * R * .85); ctx.stroke();
    ctx.restore();
    word(ctx, '~5 MIN', x, y + R + 34 * c.z, Math.round(22 * c.z), du, { align: 'center', col: P.halo2 });
  }
  // the labels: ORDER / NOISE (c03 "Just order … or chaos"), NO FEEDBACK (c04)
  const [ox, oy] = S(c, STRIP.x0, STRIP.yO - STRIP.h / 2 - 22), [nx, ny] = S(c, STRIP.x0, STRIP.yN - STRIP.h / 2 - 22);
  const lz = Math.round(30 * c.z);
  word(ctx, 'ORDER', ox, oy, lz, F.rise(span(t, a.order - .15, a.order + .6)) * (1 - expoIn(span(t, a.looks - .5, a.looks))), { col: P.halo0 });
  word(ctx, 'NOISE', nx, ny, lz, F.rise(span(t, a.chaos - .15, a.chaos + .6)) * (1 - expoIn(span(t, a.nofb - 1.1, a.nofb - .6))), { col: COOL.mid });
  word(ctx, 'NO FEEDBACK', nx, ny, lz, F.rise(span(t, a.nofb - .05, a.nofb + .7)) * (1 - expoIn(span(t, a.looks - .5, a.looks))), { col: COOL.mid });
  const [fx, fy] = S(c, STRIP.x1 - 4, STRIP.yN - STRIP.h / 2 - 22);
  const fu = F.rise(span(t, a.fourSec - .15, a.fourSec + .6)) * (1 - expoIn(span(t, a.chaos - .6, a.chaos - .1)));
  if (fu > 0) word(ctx, '4 S', nx, ny, lz, fu, { col: COOL.mid });
}
