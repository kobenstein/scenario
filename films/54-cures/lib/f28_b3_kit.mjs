// Film 28 · B3 module (c11–c14: No. 3 snake proteins · No. 2 the conspiracy chatbot · No. 1 flash floods · the ending + end screen).
// Owned by builder B3. Imports the shared kit (lib/f28_kit.mjs) and seams (lib/f28_seams.mjs); never edits them.
//   anchors(T)            every phrase anchor of c11–c14 in one table (shared by the four scene files, so chunk boundaries agree)
//   grassVillage(ctx, c, t, st)   the night grass of plateGrass (a copy of S.grassWorld) + a village behind it (clinic, stable) + the snake
//   snake · horse · sheep · vial · ribbon/protein · toxin · mouse   small film things for No. 3
//   labWorld · personKnot · chatWin                                  the mind space of No. 3 → No. 2
//   river map (rivers, town, gauges, report dots, forecast band) · screens (SEARCH · MAPS · ALERT) · phone · envelope   No. 1
//   galleryTool(n) geometry under the tree lanterns · OUT(m) helper for nested worlds (E.withOuter)
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
import * as S from './f28_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const TAU = Math.PI * 2;
export const WARM = F.WARM, COOL = F.COOL, INK = F.INK;

// ================================================================================================================= ANCHORS
const CACHE = new WeakMap();
export function anchors(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // c11 · No. 3
  a.snake = G('The snake'); a.bite = G('Its bite'); a.medicine = G('medicine made'); a.horses = G('horses and sheep'); a.sheepE = GE('and sheep', a.bite);
  a.whatif = G('What if you could skip'); a.horse = G('the horse', a.whatif); a.design = G('design a molecule'); a.never = G('no living thing');
  a.lab = G('A lab asked'); a.designed = G('It designed brand'); a.proteins = G('proteins', a.designed); a.grab = G('grab a', a.designed); a.toxin = G('toxin', a.grab); a.off = G('switch it off');
  a.mice = G('In mice, they'); a.survived = G('Most survived'); a.killed = G('should have killed'); a.sofar = G('So far only'); a.single = G('single toxins'); a.venom = G('whole venom');
  a.protein = G('A designed protein'); a.blood = G('in the blood', a.protein); a.butcan = G('But can a machine'); a.mind = G('change a mind');
  // c12 · No. 2
  a.everyone = G('Everyone knows'); a.conspiracy = G('conspiracy theory'); a.tried = G('Researchers tried'); a.believers = G('let believers'); a.argueAI = G('with an A.I.', a.tried);
  a.ordinary = G('Just an ordinary chatbot'); a.writes = G('writes emails'); a.answered = G('It answered each'); a.reasons = G('own reasons'); a.evidence = G('with evidence');
  a.rand = G('David Rand'); a.why = G('on why it worked'); a.C5 = T.clip('C5b');
  a.after = G('After one short'); a.dropped = G('belief dropped'); a.fifth = G('a fifth'); a.months = G('Months later'); a.stilldown = G('still down');
  a.authors = G('The authors later'); a.errors = G('errors in their'); a.corrected = G('Corrected,'); a.held = G('effect still held');
  a.newer = G('In a newer study'); a.notyet = G('not yet peer'); a.flipped = G('flipped it'); a.argued = G('argued for the conspiracy'); a.wentup = G('Belief went up'); a.strongly = G('as strongly');
  a.same = G('Same tool.'); a.opposite = G('Opposite aim'); a.whatall = G('What do all', a.same); a.common = G('in common', a.whatall);
  // c13 · No. 1
  a.flash = G('Flash floods are'); a.deadliest = G('the deadliest floods'); a.often = G('They often hit'); a.measures = G('no one measures'); a.nothing = G('almost nothing to learn');
  a.except = G('Except the news'); a.team = G('A team at Google'); a.millions = G('millions of past'); a.reports = G('old news reports', a.millions); a.teach = G('to teach an'); a.strike = G('flash floods strike');
  a.big = G('For big rivers'); a.forecasts = G("Google's flood forecasts"); a.week = G('a week ahead'); a.warnings = G('The warnings show'); a.search = G('in Search');
  a.maps = G('in Maps'); a.alerts = G('as alerts on'); a.phones = G('ordinary phones'); a.maybe = G('Maybe on yours'); a.yours = G('yours', a.maybe);
  a.forecast = G("But a forecast isn't"); a.rescue = G('a rescue', a.forecast); a.like = G('Like those methane'); a.works = G('only works if'); a.acts = G('acts in time'); a.timeE = GE('in time', a.acts);
  // c14 · the ending
  a.sat = G('Satellites built to watch', a.acts); a.radio = G('A radio built', a.sat); a.collide = G("don't collide", a.sat); a.gps = G('GPS, built', a.sat); a.findway = G('find your way', a.gps);
  a.chatbot = G('An everyday chatbot'); a.oldnews = G('Old news, written'); a.readers = G('for readers'); a.none = G('None of it was built'); a.thats = G("That's what these tools");
  a.diff = G('The difference between'); a.writing = G('writing your emails'); a.saving = G('saving a life'); a.nevertool = G('never the tool'); a.itwas = G('It was the aim'); a.aimE = GE('the aim', a.itwas);
  a.already = G('The tool is already here'); a.question = G('The question is what'); a.point = G('point it at'); a.channel = G("That's why this channel"); a.superi = G('superintelligence goes', a.channel);
  a.want = G('Want that too', a.channel); a.subscribe = G('Then subscribe', a.want); a.endS = GE('Then subscribe', a.want);
  a.T = T; CACHE.set(T, a); return a;
}

// ================================================================================================================= SMALL HELPERS
export const zsOf = (c, Z) => Z / Math.max(1, Z - c.z);
// a camera drift that shrinks with the magnification of card Z (dives stay steady), as c01's drifted()
export const drifted = (c, Z, t, amt = 2.6, seed = 3) => E.camDrift(c, t, amt / Math.max(1, zsOf(c, Z)), seed);
// a nested world drawn into a screen rect: OUTER transform that maps a 1920×1080 inner screen onto rect r (cover)
export function outerFor(r) { const k = Math.max(r.w / W, r.h / H); return { k, e: r.x + r.w / 2 - W / 2 * k, f: r.y + r.h / 2 - H / 2 * k }; }
// log-lerp between two OUTER transforms (zoom feels constant)
export function outerLerp(a, b, u) {
  const k = Math.exp(lerp(Math.log(a.k), Math.log(b.k), u)), w = (k - a.k) / ((b.k - a.k) || 1);
  return { k, e: lerp(a.e, b.e, Math.abs(b.k - a.k) > 1e-6 ? w : u), f: lerp(a.f, b.f, Math.abs(b.k - a.k) > 1e-6 ? w : u) };
}
// point along a polyline at fraction u (by length) → [x, y, angle]
export function along(pts, u) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = clamp(u) * L[L.length - 1]; let i = 1; while (i < pts.length - 1 && L[i] < d) i++;
  const f = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]), p = pts[i - 1], q = pts[i];
  return [lerp(p[0], q[0], clamp(f)), lerp(p[1], q[1], clamp(f)), Math.atan2(q[1] - p[1], q[0] - p[0])];
}
export function polyLen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
// a dashed small tag line (caveats): Inter 600 caps, a thin dashed frame. Screen space. u rises (mask), out sinks.
export function caveat(ctx, x, y, lines, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const size = o.size ?? 24, w = Math.max(...lines.map((l) => F.measure(l, size, false, 600) + size * l.length * .1)) + size * 1.4, h = lines.length * size * 1.45 + size * .7;
  const x0 = o.align === 'center' ? x - w / 2 : x;
  ctx.save(); if (o.screen !== false) ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= F.rise(u);
  ctx.strokeStyle = rgba(o.col === 'warm' ? WARM.line : P.halo2, .8); ctx.lineWidth = 2; ctx.setLineDash([7, 6]); ctx.lineDashOffset = -(o.t ?? 0) * 6;
  ctx.beginPath(); ctx.roundRect(x0, y - size * 1.15, w * expoOut(u), h, 8); ctx.stroke(); ctx.setLineDash([]);
  lines.forEach((l, i) => F.maskLine(ctx, [[l, 0]], x0 + size * .7, y + i * size * 1.45, size, F.rise(span(u, .25 + i * .15, 1)), { serif: false, weight: 600, col: i ? P.halo2 : P.cream, glow: false }));
  ctx.restore();
}

// ================================================================================================================= No. 3 · GRASS + VILLAGE
// A copy of S.grassWorld (identical pixels with st.village = 0 and no snake) with two hooks: the village on a card between the far hills
// and the grass (clinic with a lit window and its shelf, the stable with its lamp, the horse and the sheep), and the snake on the middle
// grass layer (between its blades and the near blades). st: { shadowX, shadow, village 0..1, stable 0..1 (lamp), snake(ctx) (card 2200) }
const BLADES = (() => { const r = prng(3303), b = []; for (let L = 0; L < 3; L++) for (let k = 0; k < 120; k++) b.push([L, -100 + r() * 2120, 260 + r() * 340 + L * 120, r() * 6.3, .6 + r() * .8]); return b; })();
export const Z_VIL = 4200;
export const CLINIC = { x: 2330, y: 650, w: 230, h: 150, win: [2392, 588, 74, 58] };   // card Z_VIL, design px (before VSC); win = [x, y, w, h] of the lit window
export const VIAL = { x: 2440, y: 627, h: 30 };                                         // the antivenom vial on the shelf (bottom centre, height)
export const VSC = { x: 2600, y: 650, k: 1.7 };                                         // the village is drawn scaled by k round (x, y)
export const vsc = (x, y) => [VSC.x + (x - VSC.x) * VSC.k, VSC.y + (y - VSC.y) * VSC.k];
export const STABLE = { x: 2700, y: 650, w: 250, h: 170, door: [2722, 556, 112, 94], lamp: [2778, 545] };
export function grassVillage(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: [960, 300, 900], hor: 520 });
  E.card(ctx, c, 6000, () => { F.hills(ctx, [[-2000, 520], [0, 500], [960, 512], [2000, 498], [4000, 520]], { top: mixHex(P.night1, P.ind1, .5), bottom: P.night0, rimA: .3, depth: 400 });
    ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .4), .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-3000, 560); ctx.lineTo(5000, 548); ctx.stroke(); });
  if ((st.village ?? 0) > 0) E.card(ctx, c, Z_VIL, () => village(ctx, t, st));
  const shadowX = st.shadowX ?? (600 + 140 * Math.sin(t * .4)), shadowA = clamp(st.shadow ?? 1);
  for (let L = 0; L < 3; L++) E.card(ctx, c, [3200, 2200, 1500][L], () => {
    if (st.sink) ctx.translate(0, st.sink * [.25, .7, 1][L]);   // the camera rises over the grass (near layers slip down faster)
    const base = [760, 900, 1080][L], col = [mixHex(P.ind0, P.blue0, .2), mixHex(P.night1, P.ind1, .5), P.night0][L];
    ctx.fillStyle = col; ctx.fillRect(-2000, base, st.village > 0 ? 12000 : 6000, 800);
    for (const [l, x, hh, ph, f] of BLADES) { if (l !== L) continue; const near = Math.exp(-((x - shadowX) ** 2) / 9000) * (st.part ?? shadowA) * (L === 1 ? 1 : .3), bend = 18 * Math.sin(t * f + ph) + 60 * near * Math.sign(x - shadowX) + 40 * Math.sin(ph * 3.1);
      const h2 = hh * (.45 + .3 * Math.sin(ph * 5.3) ** 2) * (L && x > 1300 ? 1 - (st.bow ?? 0) * clamp((x - 1300) / 500) * .55 : 1), bw = (16 - L * 4) * (.7 + .3 * f);
      ctx.fillStyle = mixHex(col, mixHex(P.blue0, P.blue1, .3), .3 + .22 * (2 - L) / 2 + .1 * Math.sin(ph * 7));
      ctx.beginPath(); ctx.moveTo(x - bw / 2, base + 4); ctx.quadraticCurveTo(x + bend * .2 - bw * .3, base - h2 * .55, x + bend, base - h2); ctx.quadraticCurveTo(x + bend * .2 + bw * .3, base - h2 * .5, x + bw / 2, base + 4); ctx.fill(); }
    if (L === 1 && shadowA > 0) { ctx.fillStyle = rgba(P.night0, .55 * shadowA); ctx.beginPath(); ctx.ellipse(shadowX, base - 60, 160, 30, 0, 0, TAU); ctx.fill(); }
    if (L === 1 && st.snake) st.snake(ctx);
    // the grass continues to the right of the plate's blades (the camera trucks toward the village): a second seeded band, same look
    if (st.village > 0) for (const [l, x, hh, ph, f] of BLADES) { if (l !== L) continue; const xx = x + 2020, bend = 18 * Math.sin(t * f + ph) + 40 * Math.sin(ph * 3.1), h2 = hh * (.45 + .3 * Math.sin(ph * 5.3) ** 2) * [.5, .32, .22][L] * (xx < 2400 ? lerp(2.2, 1, clamp((xx - 2020) / 380)) : 1), bw = (16 - L * 4) * (.7 + .3 * f);
      ctx.fillStyle = mixHex(col, mixHex(P.blue0, P.blue1, .3), .3 + .22 * (2 - L) / 2 + .1 * Math.sin(ph * 7));
      ctx.beginPath(); ctx.moveTo(xx - bw / 2, base + 4); ctx.quadraticCurveTo(xx + bend * .2 - bw * .3, base - h2 * .55, xx + bend, base - h2); ctx.quadraticCurveTo(xx + bend * .2 + bw * .3, base - h2 * .5, xx + bw / 2, base + 4); ctx.fill(); }
  });
}
function village(ctx, t, st) {
  const va = clamp(st.village), sl = clamp(st.stable ?? 1), wl = clamp(st.window ?? 1);
  ctx.save(); ctx.globalAlpha *= va; ctx.translate(VSC.x, VSC.y); ctx.scale(VSC.k, VSC.k); ctx.translate(-VSC.x, -VSC.y);
  // the ground of the village (a low bank behind the rail line)
  F.hills(ctx, [[2020, 680], [2200, 648], [2500, 650], [2900, 646], [3300, 660], [3800, 655], [4600, 660]], { top: mixHex(P.night1, P.ind1, .55), bottom: P.night0, rimA: .3, depth: 160 });
  // a tree and a far house for scale
  ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.beginPath(); ctx.arc(2200, 560, 56, 0, TAU); ctx.arc(2240, 590, 44, 0, TAU); ctx.fill(); ctx.fillRect(2210, 590, 12, 60);
  // the clinic: a small white-washed house (indigo at night) with a lit window; the shelf inside with bottles and the vial
  const C = CLINIC, [wx, wy, ww, wh] = C.win;
  F.pool(ctx, wx + ww / 2, C.y + 4, 150, 16, .55 * wl);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .55); ctx.fillRect(C.x, C.y - C.h + 40, C.w, C.h - 40);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .35); ctx.beginPath(); ctx.moveTo(C.x - 14, C.y - C.h + 44); ctx.lineTo(C.x + C.w + 14, C.y - C.h + 44); ctx.lineTo(C.x + C.w - 10, C.y - C.h + 14); ctx.lineTo(C.x + 10, C.y - C.h + 14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(C.x + 22, C.y - 74, 16, 5); ctx.fillRect(C.x + 27, C.y - 79, 6, 15);   // a small cross: the clinic
  ctx.fillStyle = P.night0; ctx.fillRect(C.x + 150, C.y - 62, 34, 62);
  halo(ctx, wx + ww / 2, wy + wh / 2, 120, .55 * wl, P.halo0, P.core1);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip(); clinicWindow(ctx, t, wx, wy, ww, wh, wl, st); ctx.restore();
  ctx.strokeStyle = P.night0; ctx.lineWidth = 4; ctx.strokeRect(wx, wy, ww, wh); ctx.beginPath(); ctx.moveTo(wx, wy + wh * .5); ctx.lineTo(wx + ww * .32, wy + wh * .5); ctx.stroke();
  // the stable: a barn with an open lit door; the horse inside; two sheep in a little pen
  const B = STABLE, [dx, dy, dw, dh] = B.door;
  F.pool(ctx, dx + dw / 2, B.y + 4, 170, 18, .5 * sl);
  ctx.fillStyle = mixHex(P.night1, P.ind0, .6); ctx.fillRect(B.x, B.y - B.h + 50, B.w, B.h - 50);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.beginPath(); ctx.moveTo(B.x - 16, B.y - B.h + 54); ctx.lineTo(B.x + B.w / 2, B.y - B.h - 10); ctx.lineTo(B.x + B.w + 16, B.y - B.h + 54); ctx.closePath(); ctx.fill();
  for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba(P.blue1, .18); ctx.fillRect(B.x + 6 + k * 41, B.y - B.h + 56, 3, B.h - 56); }
  ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, dh); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, dy, 0, dy + dh, [[0, mixHex(P.night1, P.halo1, .55 * sl)], [1, mixHex(P.night0, P.shade0, .6 * sl)]]); ctx.fillRect(dx, dy, dw, dh);
  horse(ctx, t, dx + dw * .44, dy + dh - 3, 40, { lit: sl, dir: -1 });
  ctx.restore();
  halo(ctx, B.lamp[0], B.lamp[1], 70 * (.9 + .1 * Math.sin(t * 2.3)), .7 * sl, P.halo0, P.core1); ctx.fillStyle = mixHex(P.night1, P.core1, sl); ctx.beginPath(); ctx.arc(B.lamp[0], B.lamp[1], 5, 0, TAU); ctx.fill();
  // the pen and the sheep (lit by the stable lamp)
  ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .3 + .3 * sl), .7); ctx.lineWidth = 3; for (const yy of [628, 642]) { ctx.beginPath(); ctx.moveTo(2830, yy); ctx.lineTo(2990, yy + 4); ctx.stroke(); }
  for (let k = 0; k < 5; k++) { ctx.fillRect(2832 + k * 39, 618, 3, 34); }
  sheep(ctx, t, 2880, 650, 26, { lit: sl, dir: -1, ph: 0 }); sheep(ctx, t, 2948, 652, 22, { lit: sl * .8, dir: 1, ph: 2 });
  ctx.restore();
}
// the clinic window from inside: a back wall in warm lamp light, a shelf, three bottles, the antivenom vial (warm liquid)
function clinicWindow(ctx, t, x, y, w, h, wl, st) {
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(P.night1, P.halo1, .62 * wl)], [1, mixHex(P.night1, P.shade0, .7 * wl)]]); ctx.fillRect(x, y, w, h);
  const sy = VIAL.y + 1; ctx.fillStyle = mixHex(P.night0, P.shade0, .45); ctx.fillRect(x, sy, w, 4);
  for (const [bx, bh, k] of [[x + 10, 18, 0], [x + 22, 24, 1], [x + 33, 14, 2]]) { ctx.fillStyle = mixHex(P.ind0, P.blue1, .3 + .1 * k); ctx.fillRect(bx, sy - bh, 8, bh); ctx.fillRect(bx + 2, sy - bh - 4, 4, 4); }
  vial(ctx, t, VIAL.x, sy, VIAL.h, { glow: st.vialGlow ?? 1, inside: st.vialInside });
}
// the antivenom vial: glass, a warm liquid, a metal cap, a small label. (x, y) bottom centre, h height. o { glow, inside(ctx, rect) }
export const VIAL_LIQ = (x, y, h) => ({ x: x - h * .22, y: y - h * .62, w: h * .44, h: h * .58 });   // the liquid rect (for the dive)
export function vial(ctx, t, x, y, h, o = {}) {
  const w = h * .5, g = o.glow ?? 1;
  halo(ctx, x, y - h * .35, h * 1.4, .35 * g, P.halo0, P.core1);
  ctx.fillStyle = rgba(P.cream, .22); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h * .72, w, h * .72, h * .08); ctx.fill();
  const L = VIAL_LIQ(x, y, h);
  ctx.save(); ctx.beginPath(); ctx.roundRect(L.x, L.y, L.w, L.h, h * .05); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, L.y, 0, L.y + L.h, [[0, mixHex(P.halo0, P.core1, .5)], [1, P.shade0]]); ctx.fillRect(L.x, L.y, L.w, L.h);
  if (o.inside) { o.inside(ctx, L); const m = ctx.getTransform(), sw = m.a * L.w, ta = 1 - smooth(span(sw, 120, 1950));   // deep in the warm liquid the inside shows
    if (ta > 0) { ctx.fillStyle = lin(ctx, 0, L.y, 0, L.y + L.h, [[0, rgba(mixHex(P.halo0, P.core1, .5), ta)], [1, rgba(P.shade0, ta)]]); ctx.fillRect(L.x, L.y, L.w, L.h); } }
  ctx.restore();
  ctx.fillStyle = mixHex(P.blue1, P.halo2, .35); ctx.fillRect(x - w * .32, y - h, w * .64, h * .2);
  const sz = ctx.getTransform().a * h, ga = 1 - smooth(span(sz, 160, 700));   // label and glint pass by as the camera dives in
  if (ga > 0) { ctx.fillStyle = rgba(P.night0, .5 * ga); ctx.fillRect(x - w * .38, y - h * .44, w * .76, h * .16);
    ctx.fillStyle = rgba(P.cream, .55 * ga); ctx.fillRect(x - w * .38, y - h * .7, w * .1, h * .6); }   // the glint (cool glass edge)
}
// the horse: a flat side silhouette with a warm rim from its lamp. (x, y) between the hooves, h = withers height, o { lit, dir, ph }
export function horse(ctx, t, x, y, h, o = {}) {
  const d = o.dir ?? 1, lit = clamp(o.lit ?? 1), k = h / 100, br = Math.sin(t * 1.4) * .6;
  ctx.save(); ctx.translate(x, y); ctx.scale(d * k, k);
  const body = mixHex(P.night0, P.ind1, .45), rim = mixHex(P.shade0, P.halo0, .6);
  const p = new Path2D();
  p.moveTo(-58, -64); p.bezierCurveTo(-60, -98, -30, -104, 10, -100); p.bezierCurveTo(30, -100, 44, -108, 52, -126);   // back → withers → neck
  p.bezierCurveTo(58, -146, 66, -160, 78, -164 + br); p.lineTo(104, -150 + br); p.bezierCurveTo(110, -146, 108, -138, 100, -138 + br); p.lineTo(84, -138 + br);
  p.bezierCurveTo(78, -118, 70, -96, 60, -80); p.bezierCurveTo(52, -66, 40, -60, 20, -60); p.lineTo(-40, -58); p.bezierCurveTo(-52, -58, -58, -60, -58, -64); p.closePath();
  ctx.fillStyle = body; ctx.fill(p);
  for (const [lx, sw] of [[-46, .05], [-36, -.04], [34, .04], [44, -.03]]) { ctx.save(); ctx.translate(lx, -62); ctx.rotate(sw * Math.sin(t * .7)); ctx.fillRect(-5, 0, 10, 62); ctx.fillRect(-6, 56, 12, 6); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(-56, -90); ctx.quadraticCurveTo(-82, -70 + 4 * Math.sin(t * 1.1), -74, -36); ctx.lineWidth = 9; ctx.strokeStyle = body; ctx.lineCap = 'round'; ctx.stroke();   // tail
  ctx.beginPath(); ctx.moveTo(76, -160); ctx.lineTo(80, -174); ctx.lineTo(86, -160); ctx.fill();   // ear
  if (lit > 0) { ctx.save(); ctx.clip(p); ctx.strokeStyle = rgba(rim, .75 * lit); ctx.lineWidth = 6; ctx.translate(4, 3); ctx.stroke(p); ctx.restore(); }
  ctx.restore();
}
// a sheep: a woolly cloud body, dark head and legs. (x, y) between the feet, s = body width
const SHEEP = (() => { const r = prng(77), p = new Path2D(); let q = new Path2D(); q.ellipse(0, -.5, .5, .32, 0, 0, TAU); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, c = new Path2D(); c.arc(Math.cos(a) * .42, -.5 + Math.sin(a) * .26, .16 + r() * .05, 0, TAU); q = q.op(c, PathOp.Union); } return q; })();
export function sheep(ctx, t, x, y, s, o = {}) {
  const lit = clamp(o.lit ?? 1), d = o.dir ?? 1, gr = Math.sin(t * .9 + (o.ph ?? 0));
  ctx.save(); ctx.translate(x, y); ctx.scale(d * s, s);
  ctx.fillStyle = P.night0; for (const lx of [-.28, -.1, .14, .3]) ctx.fillRect(lx - .03, -.3, .06, .3);
  ctx.fillStyle = mixHex(mixHex(P.ind1, P.blue1, .5), P.halo2, .55 * lit); ctx.fill(SHEEP);
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(.58, -.56 + .06 * gr, .14, .1, .4 + .15 * gr, 0, TAU); ctx.fill();
  ctx.restore();
}

// ================================================================================================================= THE SNAKE
// spine from head (0) to tail (1). mode: wave (slithering, travelling S) ↔ coil (curled, head raised). Returns the spine points.
export function snakeSpine(t, x, y, s, o = {}) {
  const n = 40, coil = clamp(o.coil ?? 0), L = 300 * s, rise = clamp(o.rise ?? 0), dir = o.dir ?? 1, ph = o.ph ?? t * 3.2;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    // wave: the body trails behind the head (to −dir), an S that travels from head to tail
    const wx = x - dir * u * L * .92, wy = y + Math.sin(u * TAU * 1.6 - ph) * 22 * s * Math.min(1, u * 4);
    // coil: a flat spiral round (x − 40s, y), the head raised above it
    const ang = -Math.PI * .5 + u * TAU * 1.55, R = (70 - 38 * u) * s, cx = x - dir * 40 * s, cy = y + 10 * s;
    let cxp = cx + Math.cos(ang) * R * dir, cyp = cy + Math.sin(ang) * R * .42;
    if (u < .18) { const k = 1 - u / .18; cxp = lerp(cxp, x + dir * 6 * s, k * .9); cyp = lerp(cyp, y - 70 * s * rise, k * k); }
    pts.push([lerp(wx, cxp, coil), lerp(wy, cyp, coil)]);
  }
  return pts;
}
export function snake(ctx, t, pts, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const n = pts.length, Lp = [], Rp = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[Math.min(n - 1, i + 1)], r = pts[Math.max(0, i - 1)], dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy) || 1, u = i / (n - 1);
    const w = (u < .06 ? lerp(9, 13, u / .06) : lerp(13, 2, Math.pow((u - .06) / .94, 1.4))) * s;
    Lp.push([p[0] - dy / l * w, p[1] + dx / l * w]); Rp.push([p[0] + dy / l * w, p[1] - dx / l * w]);
  }
  const body = new Path2D(); Lp.forEach((v, i) => (i ? body.lineTo(v[0], v[1]) : body.moveTo(v[0], v[1]))); Rp.reverse().forEach((v) => body.lineTo(v[0], v[1])); body.closePath();
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night0, P.ind0, .35); ctx.fill(body);
  ctx.strokeStyle = rgba(mixHex(P.blue0, P.halo2, .35), .55); ctx.lineWidth = 1.6 * s; ctx.stroke(body);
  // the head: a flat wedge pointing along the first segment, a tongue flick
  const [hx, hy] = pts[0], ang = Math.atan2(pts[0][1] - pts[2][1], pts[0][0] - pts[2][0]);
  ctx.translate(hx, hy); ctx.rotate(ang);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .35); ctx.beginPath(); ctx.ellipse(4 * s, 0, 17 * s, 11 * s, 0, 0, TAU); ctx.fill(); ctx.stroke();
  const fl = Math.max(0, Math.sin(t * 7.3)) * (o.tongue ?? 1);
  if (fl > .2) { ctx.strokeStyle = rgba(P.halo2, .7); ctx.lineWidth = 1.4 * s; ctx.beginPath(); ctx.moveTo(20 * s, 0); ctx.lineTo((20 + 10 * fl) * s, 0); ctx.lineTo((26 + 10 * fl) * s, -3 * s); ctx.moveTo((20 + 10 * fl) * s, 0); ctx.lineTo((26 + 10 * fl) * s, 3 * s); ctx.stroke(); }
  ctx.fillStyle = rgba(P.halo2, .8); ctx.beginPath(); ctx.arc(10 * s, -5 * s, 1.6 * s, 0, TAU); ctx.fill();
  ctx.restore();
}

// ================================================================================================================= PROTEIN · TOXIN · MOUSE
// the designed protein as a ribbon of light. Control points of the FOLDED shape (a clamp: two arms round a pocket at the origin, opening
// right), the loose shape is a long gentle wave. fold 0..1 folds from the first point on (staggered); open 0..1 opens the clamp's jaw.
const RIB_N = 64;
export function ribbonPts(t, o = {}) {
  const fold = clamp(o.fold ?? 1), open = clamp(o.open ?? 0), loose = clamp(o.loose ?? 0), s = o.s ?? 1, x = o.x ?? 0, y = o.y ?? 0, len = o.len ?? 760;
  const pts = [], th0 = .62 + .5 * open, th1 = TAU - th0;
  for (let i = 0; i < RIB_N; i++) {
    const u = i / (RIB_N - 1), fu = sineIO(clamp(fold * 1.6 - u * .6)), ph = u * TAU * 7.5 + t * .35;
    // loose coil (a wandering chain with small loops) → the folded protein: a coiled ribbon bent into a clamp round a pocket at the origin
    const wx = (u - .5) * 380 + 9 * Math.cos(ph) * .7 + 6 * Math.sin(t * .9 + i * .3), wy = 30 * Math.sin(u * TAU * 1.2 + t * .7) + 9 * Math.sin(ph) * .7;
    const th = lerp(th0, th1, u), R = 92 + 6 * Math.sin(u * 9 + t);
    const fx = Math.cos(th) * R + 19 * Math.cos(ph) + 2 * Math.sin(t * 1.3 + i), fy = Math.sin(th) * R * .96 + 19 * Math.sin(ph) + 2 * Math.cos(t * 1.1 + i);
    const lx = (u - .5) * len + 10 * Math.sin(t * .8 + i * .15), ly = 22 * Math.sin(u * TAU * 1.4 + t * .9);
    const bx = lerp(wx, fx, fu), by = lerp(wy, fy, fu), lu = sineIO(clamp(loose * 1.5 - (1 - u) * .5));
    pts.push([x + lerp(bx, lx, lu) * s, y + lerp(by, ly, lu) * s, 1 - .6 * lu]);
  }
  return pts;
}
// draw the ribbon: a twisted band (width oscillates along the length = the twist), warm light. o { a, w, col 'warm'|'cool'|'dim', grow 0..1 }
export function ribbon(ctx, t, pts, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const P2 = E.catmull(pts.map((p) => [p[0], p[1], p[2] ?? 1]), 3), n = Math.max(2, Math.floor(P2.length * clamp(o.grow ?? 1)));
  const w = o.w ?? 14, col = o.col ?? 'warm';
  const body = col === 'cool' ? COOL.body : col === 'dim' ? mixHex(P.blue1, P.halo2, .35) : P.halo0, core = col === 'cool' ? COOL.core : col === 'dim' ? P.halo2 : P.core1;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(col === 'cool' ? COOL.halo : P.halo1, .18); ctx.lineWidth = w * 2.6; ctx.beginPath(); for (let i = 0; i < n; i++) (i ? ctx.lineTo(P2[i][0], P2[i][1]) : ctx.moveTo(P2[i][0], P2[i][1])); ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 1; i < n; i++) {
    const tw = .35 + .65 * Math.abs(Math.cos(i / P2.length * 46 + t * .6)), ww = w * tw * P2[i][2];
    ctx.strokeStyle = mixHex(mixHex(body, P.shade0, .45), core, tw * .8); ctx.lineWidth = ww; ctx.beginPath(); ctx.moveTo(P2[i - 1][0], P2[i - 1][1]); ctx.lineTo(P2[i][0], P2[i][1]); ctx.stroke();
  }
  ctx.restore();
  return P2[n - 1];
}
// the toxin: a dark spiky blob with a dull violet rim; off 0..1 = switched off (spikes retract, it goes dim and still)
export function toxin(ctx, t, x, y, r, o = {}) {
  const off = clamp(o.off ?? 0), a = o.a ?? 1; if (a <= 0) return;
  const n = 11, sp = (1 - off) * .45, p = new Path2D();
  for (let i = 0; i <= n * 2; i++) { const ang = i / (n * 2) * TAU + t * .25 * (1 - off), rr = r * (i % 2 ? 1 : 1 + sp * (1 + .15 * Math.sin(t * 3 + i))); i ? p.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr) : p.moveTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); }
  p.closePath();
  ctx.save(); ctx.globalAlpha *= a;
  if (off < 1) { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = rad(ctx, x, y, r * 2.4, [[0, rgba(P.night0, .5 * (1 - off))], [1, rgba(P.night0, 0)]]); ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, TAU); ctx.fill(); }
  ctx.fillStyle = mixHex(mixHex(P.night0, '#2a1838', .6), mixHex(P.blue1, P.halo2, .3), off * .55); ctx.fill(p);
  ctx.strokeStyle = rgba(mixHex('#6b4a8a', P.blue1, off), .7 * (1 - .5 * off)); ctx.lineWidth = Math.max(1, r * .08); ctx.stroke(p);
  ctx.restore();
}
// a mouse in side view (flat), lit warm = survived. (x, y) feet, s = body length
const MOUSE = (() => { let p = new Path2D(); p.ellipse(0, -.24, .4, .22, 0, 0, TAU); const h = new Path2D(); h.ellipse(.42, -.3, .2, .14, -.25, 0, TAU); p = p.op(h, PathOp.Union); const e = new Path2D(); e.arc(.32, -.46, .1, 0, TAU); p = p.op(e, PathOp.Union); return p; })();
export function mouse(ctx, t, x, y, s, o = {}) {
  const lit = clamp(o.lit ?? 0), a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (lit > 0) halo(ctx, .05, -.25, 1.1, .35 * lit, P.halo0, P.core1);
  const col = mixHex(mixHex(P.ind1, P.blue1, .6), P.halo0, lit);
  ctx.fillStyle = col; ctx.fill(MOUSE);
  ctx.strokeStyle = col; ctx.lineWidth = .045; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-.38, -.2); ctx.quadraticCurveTo(-.7, -.05 + .05 * Math.sin(t * 2 + x), -.82, -.3); ctx.stroke();
  ctx.fillStyle = mixHex(P.night0, P.shade0, .4 * lit); ctx.beginPath(); ctx.arc(.5, -.33, .028, 0, TAU); ctx.fill();
  if (o.dashed) { ctx.setLineDash([.06, .05]); ctx.strokeStyle = rgba(P.halo2, .7); ctx.lineWidth = .03; ctx.stroke(MOUSE); ctx.setLineDash([]); }
  ctx.restore();
}

// ================================================================================================================= THE MIND SPACE (inside the vial → No. 2)
// A dark space lit from inside: a warm glow where the work happens (the protein, later the person), far motes drifting on a back card.
// Design px on F0 (1920×1080 at the home camera); it is wide (−1700 … 2600) so the camera can truck from the protein to the person.
// st: { glow: [x, y, r, a] (the warm light), cool: [x, y, r, a] (a cool glow, the machine side), front(ctx) (drawn on F0) }
export const LAB_BG = { x0: -3400, x1: 5200, y0: -2600, y1: 3800 };
export function labWorld(ctx, c, t, st = {}) {
  E.card(ctx, c, 9000, () => {
    ctx.fillStyle = lin(ctx, 0, -1400, 0, 2400, [[0, P.night0], [.45, mixHex(P.night1, P.ind0, .4)], [1, P.night0]]); ctx.fillRect(LAB_BG.x0 * 4, LAB_BG.y0 * 3, (LAB_BG.x1 - LAB_BG.x0) * 4, (LAB_BG.y1 - LAB_BG.y0) * 3);
    E.stars(ctx, 2811, 160, t, [-3000, -1800, 8000, 4400], .35);
  });
  E.card(ctx, c, 4200, () => {
    const g = st.glow; if (g) { halo(ctx, g[0], g[1], g[2] * 1.6, .32 * g[3], P.halo1, P.halo0); halo(ctx, g[0], g[1], g[2] * .7, .3 * g[3], P.halo0, P.core1); }
    const k = st.cool; if (k && k[3] > 0) halo(ctx, k[0], k[1], k[2], .28 * k[3], COOL.halo, COOL.body);
    E.dust(ctx, 4207, 260, 400, 480, 2200, 900, t, .55, P.halo2);
  });
  E.card(ctx, c, 2600, () => { const r = prng(2606); ctx.fillStyle = rgba(P.halo2, .3); for (let i = 0; i < 340; i++) { const x = -1700 + r() * 4800, y0 = r() * 3400, s = 2 + r() * 3.5, v = 55 + 60 * r(), y = -1100 + ((y0 - t * v) % 3400 + 3400) % 3400; ctx.beginPath(); ctx.arc(x + 14 * Math.sin(t * .2 + i), y + 10 * Math.cos(t * .17 + i), s, 0, TAU); ctx.fill(); } });   // motes rising slowly (the space breathes)
  E.card(ctx, c, E.F0, () => { if (st.front) st.front(ctx); });
}

// the knot of belief: a tangle of thread (a closed curve that loops over itself). Returns n points round (x, y), radius r.
export function knotPts(t, x, y, r, n = 113, o = {}) {
  const pts = [], loose = clamp(o.loose ?? 0);
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1), th = u * TAU * 3, wob = .08 * Math.sin(t * .9 + i * .21);
    const rr = r * (.62 + .38 * Math.sin(th * 1.67 + .6) + wob);
    pts.push([x + Math.cos(th) * rr + r * .25 * Math.sin(th * .5), y + Math.sin(th) * rr * .82 + r * .12 * Math.cos(th * 2.3 + t * .4)]);
  }
  return pts;
}
// resample a polyline to n points (by length)
export function resample(pts, n) { const out = []; for (let i = 0; i < n; i++) { const p = along(pts, i / (n - 1)); out.push([p[0], p[1]]); } return out; }
// draw a thread (thin band of light) along pts from u0 to u1. o { w, col 'warm'|'dim'|'cool', a }
export function thread(ctx, pts, o = {}) {
  const a = o.a ?? 1, w = o.w ?? 4; if (a <= 0 || pts.length < 2) return;
  const body = o.col === 'cool' ? COOL.body : o.col === 'dim' ? mixHex(P.blue1, P.halo2, .45) : P.halo0, core = o.col === 'cool' ? COOL.core : o.col === 'dim' ? mixHex(P.halo2, P.cream, .3) : P.core1;
  const mix = clamp(o.mix ?? 0), b2 = o.col2 ? (o.col2 === 'dim' ? mixHex(P.blue1, P.halo2, .45) : P.halo0) : body;
  const bb = mixHex(body, b2, mix), cc = mixHex(core, o.col2 === 'dim' ? mixHex(P.halo2, P.cream, .3) : core, mix);
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(bb, .16); ctx.lineWidth = w * 3; ctx.stroke();
  ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = bb; ctx.lineWidth = w; ctx.stroke(); ctx.strokeStyle = rgba(cc, .8); ctx.lineWidth = w * .4; ctx.stroke();
  ctx.restore();
}

// a plain chat window (the chatbot): a cool frame, rows of short lines; the person's rows (right, indigo with a cream line) and the bot's
// rows (left, cool). (x, y, w) top left + width; o { a, rows: [[side 'p'|'b', u 0..1, len 0..1]], flip -1..1 (scaleX for the mirror),
//   glow, open 0..1 (the frame unfolds from its centre: grows from the bead) } → rect { x, y, w, h }
export const CHAT_H = .64;
export function chatWin(ctx, t, x, y, w, o = {}) {
  const h = w * CHAT_H, a = o.a ?? 1, op = clamp(o.open ?? 1), fl = o.flip ?? 1; if (a <= 0 || op <= 0) return { x, y, w, h };
  const cx = x + w / 2, cy = y + h / 2, ow = w * expoOut(op), oh = h * expoOut(clamp(op * 1.3 - .2));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(fl, 1);
  if ((o.glow ?? 1) > 0) halo(ctx, 0, 0, w * .9, .22 * (o.glow ?? 1) * op, COOL.halo, COOL.body);
  const fr = new Path2D(); fr.roundRect(-ow / 2, -oh / 2, ow, Math.max(2, oh), Math.min(18, oh / 2));
  ctx.fillStyle = lin(ctx, 0, -oh / 2, 0, oh / 2, [[0, mixHex(P.ind1, P.night1, .3)], [1, P.night1]]); ctx.fill(fr);
  ctx.strokeStyle = rgba(COOL.line, .9); ctx.lineWidth = 3; ctx.stroke(fr);
  if (oh > 30) {
    ctx.save(); ctx.clip(fr);
    ctx.fillStyle = rgba(COOL.line, .35); ctx.fillRect(-ow / 2, -oh / 2, ow, 30); ctx.fillStyle = rgba(P.night0, .6); for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(-ow / 2 + 22 + k * 18, -oh / 2 + 15, 5, 0, TAU); ctx.fill(); }
    let ry = -oh / 2 + 52;
    for (const [side, u, len] of o.rows || []) {
      const e = expoOut(clamp(u)); if (e <= 0) continue;
      const bw = (w * .5) * (len ?? .8), bh = 34, bx = side === 'p' ? w / 2 - 22 - bw : -w / 2 + 22;
      ctx.save(); ctx.globalAlpha *= F.rise(clamp(u)); ctx.translate(0, (1 - e) * 16);
      ctx.fillStyle = side === 'p' ? rgba(mixHex(P.ind2, P.blue1, .4), .95) : rgba(mixHex(COOL.deep, P.night1, .35), .95);
      ctx.beginPath(); ctx.roundRect(bx, ry, bw, bh, 12); ctx.fill();
      ctx.fillStyle = side === 'p' ? rgba(P.cream, .55) : COOL.body; ctx.fillRect(bx + 14, ry + 14, (bw - 28) * clamp(u * 1.4), 5);
      ctx.restore();
      ry += (bh + 12) * e;
    }
    ctx.restore();
  }
  ctx.restore();
  return { x: cx - ow / 2, y: cy - oh / 2, w: ow, h: oh };
}

// ================================================================================================================= THE MIND SPACE · shared layout + camera (c11 → c12)
export const MIND = { person: [-470, 890, 400], knot: [-250, 420, 78], bead: [330, 450, 9], glow: [-330, 560, 560] };
export const PAIR0 = [960, 470], PAIR1 = [650, 330];
export const LAB_W = 3180;                                                       // the lab is seen 3180 px wide through the vial's liquid (matches the dive's end speed)
export const LAB_IN = { k: W * 1.04 / LAB_W, e: W / 2 * (1 - W * 1.04 / LAB_W), f: H / 2 * (1 - W * 1.04 / LAB_W) };
const CL = (u, v, s) => E.aim(E.F0, u, v, s);
// the camera of the mind space (c11 from the vial on, c12 up to the light door). ts = the moment the vial's liquid fills the frame.
export const mindTz0 = (a) => a.horse + .3;
export function mindTs(a) { return mindTz0(a) + 3.4; }
export function camMind(t, a) {
  const ts = mindTs(a);
  const K = [
    [ts, CL(960, 540, 1)], [ts + 1.8, CL(962, 532, 1.02)], [a.lab + .6, CL(1000, 480, 1.1)], [a.grab - .2, CL(990, 478, 1.26)], [a.off + 1, CL(980, 484, 1.32)],
    [a.mice + 1.3, CL(1060, 540, .98)], [a.sofar + 1.6, CL(1100, 548, 1.0)], [a.protein + .9, CL(720, 400, 1.22)], [a.butcan + .2, CL(690, 410, 1.24)],
    [a.mind + .9, CL(160, 470, 1.04)], [a.everyone + .2, CL(-110, 520, 1.0)],
    // c12
    [a.conspiracy + .5, CL(-300, 480, 1.3)], [a.argueAI, CL(-210, 488, 1.2)], [a.ordinary + .8, CL(-40, 500, 1.0)], [a.evidence + .6, CL(-10, 494, 1.04)],
    [a.rand + 1.0, CL(80, 470, 1.08)], [a.C5.end + .6, CL(50, 500, 1.02)], [a.months + 1, CL(40, 528, 1.0)], [a.held + 1, CL(30, 530, 1.03)],
    [a.flipped + 1.3, CL(330, 500, .78)], [a.strongly + .6, CL(330, 494, .8)], [a.opposite + .6, CL(320, 480, .84)],
  ];
  return F.camPath(t, K);
}

// ================================================================================================================= No. 2 → No. 1 · THE TREE AT THE QUESTION (2.10)
// c12 comes out of its light door here (out of lantern 2), c13 goes on from it (the rain, the dive into a light of the land).
export const mindDoor = (a) => a.whatall + .4;                       // the flood peak of W 2.10
export const MIRROR = { person: [1130, 890, 400], knot: [910, 420] };
const C0 = (u, v, s) => E.aim(E.F0, u, v, s);
export const GL = (n) => S.lanternGlass(n);
export function camTreeQ(t, a) {
  const tf = mindDoor(a), g = GL(2);
  if (t < tf + 1.5) {   // out of lantern 2: expo-out, normalised so it lands exactly (E.camAt's expoOut stops 0.1 % short, then steps)
    const u = span(t, tf, tf + 1.5), e = (1 - 2 ** (-10 * u)) / (1 - 2 ** -10), A = C0(g.x, g.y, 24), Bc = C0(900, 662, 1.56), out = E.cam3();
    for (const k of ['x', 'y', 'f']) out[k] = lerp(A[k] ?? out[k], Bc[k] ?? out[k], e);
    out.z = E.F0 - Math.exp(lerp(Math.log(E.F0 - A.z), Math.log(E.F0 - Bc.z), e)); return out;
  }
  return E.camAt(t, [[tf + 1.5, C0(900, 662, 1.56)], [tf + 6, C0(884, 668, 1.62)]]);
}
const G1 = S.lanternGlass(1);
const THREADQ = (() => { const pts = []; for (let n = 12; n >= 1; n--) { const g = S.lanternGlass(n); pts.push([g.x, g.y + g.h * .62, 2.6]); } pts.push([G1.x + 70, G1.y - 6, 2.6], [G1.x + 112, G1.y - 60, 2.6]); return E.catmull(pts, 8); })();
export const THREAD_Q = THREADQ, G_1 = G1;
// the gallery: lantern n's tool object under its glass on the tree, exactly where lampRail draws it when the rail lamp lands there
export function galleryTool(n) { const L = F.treeLantern(n), q = L.s / F.RAIL.s, ty = L.y + L.len + L.s * 1.2; return { x: L.x, y0: ty, y1: ty + 10 * q, y: ty + 21 * q, s: 22 * q, q }; }
// the tree at the question: lanterns 12 … 2 lit (8 half), 1 dark; the gold thread runs again and ends in the ?; the first rain
export function treeQ(ctx, c, t, a, o = {}) {
  const T = a.T, tf = mindDoor(a);
  S.treeWorld(ctx, c, t, {
    glow: .5, du: { look: .62 }, lights: () => .3,
    lantern: (n) => (n === 1 && o.l1 ? { lit: 0, num: 1, numA: .8, ...o.l1 } : { lit: n === 1 ? 0 : F.lampOn(T, n, t) * .95, num: n, numA: .8 }),
    extra: (cx) => { const u = sineIO(span(t, tf + .7, tf + 2.5)), ta = o.threadA ?? 1; if (u > 0 && ta > 0) { cx.save(); cx.globalAlpha *= ta; E.trail(cx, THREADQ, u, { w: 2.6 }); cx.restore(); } if (o.extra) o.extra(cx); },
  });
  let p = E.project(c, E.F0, G1.x + 112, G1.y - 92); const qu = span(t, tf + 2.3, tf + 3.0), z = o.zoom;   // o.zoom: the OUTER of a dive (the ? goes with the world)
  if (p && z) p = [z.k * p[0] + z.e, z.k * p[1] + z.f, p[2] * z.k];
  if (p && qu > 0 && p[2] < 30) F.questionMark(ctx, t, p[0], p[1], 64 * p[2], qu);
}
// rain in screen space: thin slanted streaks (seeded), amt 0..1
const DROPS = (() => { const r = prng(9191), d = []; for (let i = 0; i < 220; i++) d.push([r(), r(), .6 + r() * .8, r()]); return d; })();
export function rain(ctx, t, amt, o = {}) {
  if (amt <= 0) return;
  const n = Math.floor(DROPS.length * clamp(amt)), sl = o.slant ?? .18;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const [u, v, sp, k] = DROPS[i], len = 26 + 40 * k, y = ((v * (H + 200) + t * 1300 * sp) % (H + 200)) - 100, x = ((u * (W + 300) - y * sl) % (W + 300) + W + 300) % (W + 300) - 150;
    ctx.strokeStyle = rgba(mixHex(P.blue1, P.cream, .5), (.12 + .16 * k) * Math.min(1, amt * 2)); ctx.lineWidth = 1 + 1.2 * k;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len * sl, y + len); ctx.stroke();
  }
  ctx.restore();
}

// ================================================================================================================= THE ENDING · THE TREE, WIDE
// A copy of S.treeWorld (same layers, same seeds) whose hills and lake run much further left and right: the end screen pulls back to
// mag ≈ .46, where S.treeWorld's hill and lake polygons end inside the frame. No foreground leaves (they would sit in the end-card sky).
// Kit wish: S.treeWorld with wider hills, so this copy can go.
const FARLIGHTS_W = (() => { const r = prng(4711), a = []; for (let k = 0; k < 60; k++) { const x = -300 + r() * 1500, band = r(); a.push([x, 690 + band * 140 + 20 * Math.sin(x * .01), .8 + r() * 1.4, k % 3]); } return a; })();
export function treeWorldWide(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: S.SKY_GLOW, hor: S.TREE_HOR });
  E.card(ctx, c, 9000, () => F.hills(ctx, [[-9000, 700], [-2600, 720], [-1400, 650], [-500, 690], [200, 640], [800, 700], [1500, 660], [2400, 700], [3600, 690], [9000, 680]], { top: mixHex(P.ind0, P.blue0, .3), bottom: P.night1, rimA: .35 }));
  E.card(ctx, c, 4200, () => {
    F.hills(ctx, [[-8000, 790], [-2400, 800], [-1200, 740], [-300, 770], [400, 735], [1100, 780], [1900, 760], [3200, 800], [8000, 780]], { top: mixHex(P.night1, P.ind1, .7), bottom: P.night0, rimA: .3 });
    for (const [x, y, s, g] of FARLIGHTS_W) { const a = clamp(st.lights ? st.lights(g, x) : .35); if (a <= .01) continue; halo(ctx, x, y, s * 9 * (.6 + .4 * a), .5 * a, P.halo0, P.core1); ctx.fillStyle = rgba(P.core1, .9 * a); ctx.fillRect(x - s / 2, y - s / 2, s, s); }
  });
  E.card(ctx, c, 2600, () => {
    F.water(ctx, -6000, 1300, 860, 700, t, { rx: 520, rw: 220, a: .55 * clamp((st.glow ?? .55) + .2), top: mixHex(P.ind0, P.blue0, .4) });
    F.hills(ctx, [[-7000, 880], [-1800, 880], [-900, 845], [-200, 870], [300, 862], [700, 885], [1300, 905], [2400, 900], [7000, 895]], { top: P.night1, bottom: P.night0, rimA: .25, depth: 200 });
  });
  E.card(ctx, c, E.F0, () => {
    F.hills(ctx, [[-6000, 1020], [-900, 1010], [200, 975], [800, 948], [1250, 918], [1650, 918], [2200, 945], [3200, 990], [7000, 1010]], { top: mixHex(P.night1, P.ind1, .5), bottom: P.night0, rim: mixHex(P.blue0, P.halo1, .3 * (st.glow ?? .55)), rimA: .55, depth: 260 });
    F.pool(ctx, 1460, 925, 420, 50, .55 * (st.glow ?? .55));
    F.tree(ctx, t, { glow: st.glow ?? .55, lantern: st.lantern ?? ((n) => ({ lit: 0 })), front: st.front });
    if (st.du !== false) { const d = st.du || {}; E.du(ctx, F.TREE.du.x + (d.dx ?? 0), F.TREE.du.y, F.TREE.du.h, { look: d.look ?? .55, pose: d.pose, light: 1, back: .35, a: d.a, ...d.o }); }
    if (st.extra) st.extra(ctx);
  });
}
