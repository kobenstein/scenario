// Film 20 · "The First Generation That Won't Grow Old" · shared kit (owned by the lead; builders import, never edit — wishes go in
// the report). Base: lib/f10_editorial.mjs (stage, palette, du/person, light, type, finish) + lib/f16_kit.mjs (quote, rule, stamp,
// rise, blink, maskLine, trailSpan, measure, along, roundRectPts). This file adds the ONE world of Film 20 and its objects:
//
//   THE TRACK UNDER THE CLOCK (docs/MOTION.md §2). A night plain. Near: the family's kitchen table under one pendant lamp, four
//   generations sitting at it (grandparent · parent · you · kid). Right behind their chairs a start line; from it a running track of
//   four lanes (one per generation) runs to the horizon = the CALENDAR (distance = years). Far away a finish line = "that day"
//   (longevity escape velocity). Above the finish line, huge like a rising moon, THE CLOCK = the gauge MONTHS OF LIFE GAINED PER YEAR
//   (0 … 12; 12 = the threshold, never reached). In the hook it reads as a wall clock behind the family; at "It's a race" the camera
//   moves and parallax reveals it is a giant over the end of the track. The night above the track is the explainer space; the
//   tabletop (seen close, from above) is the bench where things are laid out (the drop, the eye, the button, the cells).
//
//   wp(c, X, Y, Z) / gp(c, X, Z)      world point → screen [x, y, s] (s = px per world unit; null behind the camera); gp: on the ground
//   stand(ctx, c, X, Z, fn, Y)        draw fn() in WORLD units, origin on the ground at (X, Z) (a flat card standing there; y up = −)
//   flat(ctx, c, pts, Y)              path of a polygon lying on the plane Y (default ground), near-clipped; returns screen pts or null
//   camFor(X, Y, Z, s, sx, sy, f)     the camera that shows world point (X, ground-relative Y, Z) at screen (sx, sy), s px per unit
//   sky(ctx, c, t, o)                 the night (card 40000) + stars; o: { warm 0..1, glowX (clock light on the sky) }
//   plain(ctx, c, t, o)               the dark ground plane to the horizon; o: { warm, clock 0..1 (the clock's light on the far ground) }
//   track(ctx, c, t, o)               the four lanes from START.Z to the dial; o: { lit 0..1, reach 0..1 (lanes running out), fin (Z of the finish line),
//                                     finA 0..1, start 0..1, marks: [{ Z, text, a }] (calendar marks at the left edge),
//                                     band: { z0, z1, a } (the finish smeared into a band; B3) }
//   clockAt(ctx, c, t, o)             the clock in the world (a half dial, pivot on the ground at CLOCK.Z): o = the clock options below
//   clock(ctx, t, x, y, R, o)         THE GAUGE (screen / card space; (x, y) = pivot, half dial above it, 0 left · 6 top · 12 right).
//                                     o: { lit 0..1 (face light), ticks 0..1, num 0..1, title 0..1,
//                                     foot 0..1, needle (value, solid = measured), ghost (value | null, hatched = imagined),
//                                     push: { v0, v1, u, cool 0..1, label 0..1 } (hatched wedge = hope, NOT a measurement),
//                                     marks: [{ v, text, sub, src, u }] (MEASURED marks on the rim: text = the period, sub = the value, src = the source), thr 0..1 (the dashed 12 +
//                                     dashed 12), thrLabel 0..1 (LONGEVITY / ESCAPE VELOCITY), thrSub 0..1 (THRESHOLD · NEVER REACHED; default = thrLabel), thrSrc + thrSrcU (a source line under it), tick (t) (a
//                                     mechanical tick of the needle 0..1), symbols: [[kind, u]] }
//                                     returns { cx, cy, R, at(v, r) → [x, y] }
//   table(ctx, c, t, o) / lamp(ctx, c, t, o)   the kitchen table (top + cloth to the floor, plates, place cards) and the pendant lamp
//   gen(ctx, t, who, x, y, h, o)      one of the family: who = 'grand' | 'parent' | 'you' | 'kid'. o: { seat 0..1 (sitting behind the
//                                     table), glow 0..1 (rim light when named), gray 0..1 (grand: gray hair), glasses 0..1, plus all
//                                     du()/person() options (dir, view, walk, look, lean, armR, armL, light, back) }
//   FAMILY / SEAT / gens(ctx, c, t, st)   the four as a set (positions on their seats or lanes), drawn far → near
//   eye(ctx, t, x, y, w, o)           THE EYE (the first human; c01 hook, c05): o: { open 0..1, blink (0..1 lid), young 0..1 (iris
//                                     fibres warm up), drop 0..1 (the drop falls into the pupil), ripple 0..1, look [dx, dy] }
//   tableEye(ctx, c, t, o)            the eye standing on the tabletop under the lamp (rise, lie, + eye options); EYE_Y = its pupil height
//   drop(ctx, x, y, r, o)             a drop of light (the treatment)
//   symbol(ctx, t, kind, x, y, s, o)  the three marks of the push: 'grid' (experiments) · 'molecule' (designs) · 'gauge' (dial gauge on
//                                     a DNA twist: reading a cell's age). o: { u 0..1, cool 0..1, a }
//   button(ctx, t, x, y, r, o)        THE RESET BUTTON (B1 …): o: { u 0..1 (grows), press 0..1, lit 0..1, slots 0..4 proteins seated }
//   protein(ctx, t, x, y, r, i, o)    one of the four proteins (i 0..3, distinct folds); o: { lit, cool, a, redraw 0..1 }
//   wards(ctx, t, x, y, o)            THE THREAD: four ward lamps (CANCER · HEART · DEMENTIA · DIABETES) hanging from threads that join in
//                                     one knot AGE. o: { u, join 0..1, pull 0..1, label 0..1, lit 0..1, w }
//   qcard(ctx, t, steps, o)           the question card pinned at the top-left edge; steps [[t0, 'WHY DO BODIES AGE?'], [t1, …], [t2, null]]
//   quoteCard(ctx, t, o)              THE QUOTE CARD of this film (cream index card of light, ink type): o: { text, who, src, x, y, w,
//                                     t0, t1, size, gold: [[phrase, t]] }
//   clipScreen(ctx, t, o) / CLIP_RECT  the ORIGINAL FOOTAGE frame (the real clip is laid over CLIP_RECT later): o: { id, rect, u (0..1:
//                                     how far the frame has opened), name, role, date, on 0..1 }
//   srcLine(ctx, t, s, x, y, u, o)    a small source / label line (Inter caps, halo2), rising from its baseline
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, glowFill, halo, rad, lin, prng, drift, F0, card, cam3 } = E;
export const { rise, blink, quote, rule, stamp, along, roundRectPts, trailSpan, maskLine, measure } = K16;

export const PRINT20 = { grain: 14, floor: 4, vig: .5 };
// the machine's light (cool blue-cream); gold = human light and life, yellow = only you
export const COOL = { core: '#eef3ff', mid: '#b4c8ee', edge: '#6a8cd2', deep: '#2b4a96' };
export const INK = mixHex(P.night1, P.shade0, .18);           // ink on the lit clock face / quote card
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
export const quintOut = (x) => 1 - (1 - clamp(x)) ** 5;

// ======================================================================================================================== world
// World units = design px at the focus depth F0 (1700). Camera looks along +Z, no pitch (horizon always at y 540).
export const GY = 430;                                          // ground plane Y
export const HUM = 420;                                         // an adult's height in world units (1.75 m ≈ 420)
export const TABLE = { z0: 2500, z1: 2900, x: 1000, h: 150 };   // the kitchen table (front edge z0, back edge z1, half width, top height)
export const LAMP = { X: 0, Z: 2700, h: 600 };                  // the pendant lamp (bottom of the shade, height above the ground)
export const START = { Z: 4400 };                               // the start line, a few steps behind the chairs
export const LANE = { w: 460, n: 4 };                           // four lanes, one per generation; lane i centre X = (i − 1.5)·w
export const laneX = (i) => (i - 1.5) * LANE.w;
export const FIN = { Z: 14000 };                                // the finish line ("that day") by default; it moves (c01: close, then away)
export const CLOCK = { Z: 30000, R: 9000 };                     // the half dial on the horizon at the end of the track (pivot on the ground)
export const FAMILY = [                                          // seats (X) at the table, lanes on the track; order = lane order
  { who: 'grand', X: laneX(0), year: '1948' }, { who: 'parent', X: laneX(1), year: '1975' },
  { who: 'you', X: laneX(2), year: 'YOU' }, { who: 'kid', X: laneX(3), year: '2019' }];
export const SEAT = { Z: 3000 };

export function wp(c, X, Y, Z) {
  const dz = Z - c.z; if (dz < 30) return null;
  const s = c.f / dz; let x = W / 2 + (X - c.x) * s, y = H / 2 + (Y - c.y) * s;
  if (c.roll) { const cr = Math.cos(c.roll), sr = Math.sin(c.roll), dx = x - W / 2, dy = y - H / 2; x = W / 2 + dx * cr - dy * sr; y = H / 2 + dx * sr + dy * cr; }
  return [x, y, s];
}
export const gp = (c, X, Z) => wp(c, X, GY, Z);
export function stand(ctx, c, X, Z, fn, Y = GY) {
  return card(ctx, c, Z, () => { const k = F0 / Z; ctx.translate(X * k + W / 2, Y * k + H / 2); ctx.scale(k, k); fn(); });
}
// camera that shows world point (X, Y from the ground (up −), Z) at screen (sx, sy) with s px per world unit
export const camFor = (X, Y, Z, s, sx = W / 2, sy = H / 2, f = F0) => { const dz = f / s; return cam3({ x: X - (sx - W / 2) / s, y: Y + GY - (sy - H / 2) / s, z: Z - dz, f }); };
// a polygon lying on the plane Y (XZ points), clipped to Z >= camera z + 60, projected; null if nothing is left
export function flat(c, pts, Y = GY) {
  const zMin = c.z + 60, out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[1] >= zMin, ib = b[1] >= zMin;
    if (ia) out.push(a);
    if (ia !== ib) { const f = (zMin - a[1]) / (b[1] - a[1]); out.push([lerp(a[0], b[0], f), zMin]); }
  }
  const s = out.map((p) => wp(c, p[0], Y, p[1])).filter(Boolean);
  return s.length >= 3 ? s : null;
}
const polyPath = (pts) => { const p = new Path2D(); pts.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1]))); p.closePath(); return p; };

// ---------------------------------------------------------------------------------------------------------------------- sky, plain
export function sky(ctx, c, t, o = {}) {
  const warm = o.warm ?? 0;
  card(ctx, c, 40000, () => {
    E.nightSky(ctx, [[0, P.night0], [.55, P.night1], [1, mixHex(mixHex(P.ind0, P.blue1, .22), P.shade0, .25 * warm)]], -2600, H + 900);
    ctx.fillStyle = rad(ctx, W * .5, H * .9, 2000, [[0, rgba(mixHex(P.ind1, P.shade0, .3 * warm), .8)], [.5, rgba(P.ind1, .28)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-2 * W, -3 * H, 5 * W, 6 * H);
    E.stars(ctx, o.seed ?? 20, o.stars ?? 170, t, [-1500, -2600, W + 1500, H * .6], .7 * (1 - .5 * warm));
  });
}
export function plain(ctx, c, t, o = {}) {
  const sq = [[-60000, c.z + 61], [60000, c.z + 61], [60000, 400000], [-60000, 400000]];
  const poly = flat(c, sq); if (!poly) return;
  const far = wp(c, 0, GY, 400000), yTop = far ? far[1] : H / 2, warm = o.warm ?? 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, yTop, 0, Math.max(yTop + 80, H), [[0, mixHex(mixHex(P.ind1, P.blue1, .4), P.shade0, .3 * warm)], [.08, mixHex(P.night1, P.ind1, .55)], [.5, P.night1], [1, P.night0]]);
  ctx.fill(polyPath(poly));
  // the clock's light on the far ground (a long soft pool under it)
  const cl = o.clock ?? 0;
  if (cl > 0 && o.clockXY) {
    const [x, y, s] = o.clockXY;
    ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, yTop + 4); ctx.scale(1, .08);
    ctx.fillStyle = rad(ctx, 0, 0, Math.max(200, s * 9000), [[0, rgba(P.halo1, .28 * cl)], [.4, rgba(P.blue0, .14 * cl)], [1, rgba(P.blue0, 0)]]);
    ctx.beginPath(); ctx.arc(0, 0, Math.max(200, s * 9000), 0, 6.29); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- the track
// A line on the ground from (x, z0) to (x, z1), w world units wide, alpha fading toward the horizon.
function groundLine(ctx, c, x, z0, z1, w, col, a) {
  const poly = flat(c, [[x - w / 2, z0], [x + w / 2, z0], [x + w / 2, z1], [x - w / 2, z1]]); if (!poly) return;
  const n = wp(c, x, GY, Math.max(z0, c.z + 61)), f = wp(c, x, GY, z1); if (!n || !f) return;
  ctx.fillStyle = lin(ctx, n[0], n[1], f[0], f[1] + .01, [[0, rgba(col, a)], [.6, rgba(col, a * .75)], [1, rgba(col, a * .25)]]);
  ctx.fill(polyPath(poly));
}
function crossLine(ctx, c, z, x0, x1, w, col, a) {
  const poly = flat(c, [[x0, z - w / 2], [x1, z - w / 2], [x1, z + w / 2], [x0, z + w / 2]]); if (!poly) return null;
  ctx.fillStyle = rgba(col, a); ctx.fill(polyPath(poly)); return poly;
}
export function track(ctx, c, t, o = {}) {
  const lit = o.lit ?? 1, fin = o.fin ?? FIN.Z, finA = o.finA ?? 1, hw = LANE.w * LANE.n / 2, zEnd = lerp(START.Z + 10, CLOCK.Z - 150, expoOut(clamp(o.reach ?? 1)));
  if (lit <= 0 && finA <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the lanes' surface: a faint warm wash between the outer lines (the track is lit from the clock)
  if (lit > 0) {
    const poly = flat(c, [[-hw, START.Z], [hw, START.Z], [hw, zEnd], [-hw, zEnd]]);
    if (poly) { const n = wp(c, 0, GY, Math.max(START.Z, c.z + 61)), f = wp(c, 0, GY, zEnd);
      if (n && f) { ctx.fillStyle = lin(ctx, 0, n[1], 0, f[1] + .01, [[0, rgba(P.ind2, .55 * lit)], [.7, rgba(mixHex(P.ind1, P.blue1, .4), .5 * lit)], [1, rgba(P.blue1, .35 * lit)]]); ctx.fill(polyPath(poly)); } }
    for (let i = 0; i <= LANE.n; i++) {
      const x = -hw + i * LANE.w, outer = i === 0 || i === LANE.n;
      groundLine(ctx, c, x, START.Z, zEnd, outer ? 22 : 14, P.halo2, (outer ? .55 : .38) * lit);
    }
    // the start line
    const sa = (o.start ?? 1) * lit;
    if (sa > 0) crossLine(ctx, c, START.Z, -hw, hw, 30, P.core1, .55 * sa);
    // calendar marks along the left edge (B3 · c08: 2030 · 2040 · 2050 …)
    for (const m of o.marks || []) {
      const a = m.a ?? 1; if (a <= 0) continue;
      crossLine(ctx, c, m.Z, -hw - 220, -hw, 12, P.halo1, .6 * a * lit);
      const p = wp(c, -hw - 260, GY, m.Z); if (!p) continue;
      const size = clamp(p[2] * 150, 14, 46);
      ctx.save(); ctx.globalAlpha = a; E.glowText(ctx, m.text, p[0], p[1] - size * .2, { size, serif: true, align: 'right', col: P.cream }); ctx.restore();
    }
  }
  // the band (the finish smeared over a few decades): a soft luminous zone across the lanes
  if (o.band && (o.band.a ?? 1) > 0) {
    const b = o.band, a = b.a ?? 1, poly = flat(c, [[-hw - 120, b.z0], [hw + 120, b.z0], [hw + 120, b.z1], [-hw - 120, b.z1]]);
    if (poly) { const n = wp(c, 0, GY, Math.max(b.z0, c.z + 61)), f = wp(c, 0, GY, b.z1);
      if (n && f) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, n[1], 0, f[1] + .01, [[0, rgba(P.halo1, 0)], [.25, rgba(P.halo0, .32 * a)], [.5, rgba(P.core1, .42 * a)], [.75, rgba(P.halo0, .32 * a)], [1, rgba(P.halo1, 0)]]); ctx.fill(polyPath(poly)); ctx.globalCompositeOperation = 'source-over'; } }
  }
  // the finish line: a bright line across the lanes, two thin posts, a tape of light between them
  if (finA > 0) {
    const p = crossLine(ctx, c, fin, -hw, hw, 70, P.core0, .85 * finA);
    const L = wp(c, -hw - 60, GY, fin), R = wp(c, hw + 60, GY, fin);
    if (p && L && R) {
      const ph = 560 * L[2], tape = 380 * L[2];
      ctx.globalCompositeOperation = 'lighter'; halo(ctx, (L[0] + R[0]) / 2, L[1], (R[0] - L[0]) * .8, .35 * finA, P.halo0, P.core1); ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = rgba(P.halo2, .8 * finA); ctx.lineWidth = Math.max(1, 14 * L[2]);
      for (const q of [L, R]) { ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(q[0], q[1] - ph); ctx.stroke(); }
      const sag = 18 * L[2] * (1 + .3 * Math.sin(t * 1.3));
      ctx.strokeStyle = rgba(P.core0, .9 * finA); ctx.lineWidth = Math.max(1.2, 10 * L[2]);
      ctx.beginPath(); ctx.moveTo(L[0], L[1] - tape); ctx.quadraticCurveTo((L[0] + R[0]) / 2, L[1] - tape + sag * 2, R[0], R[1] - tape); ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- the clock
// THE GAUGE is a half dial standing on the horizon at the end of the track, like a rising sun: its pivot sits on the ground at
// CLOCK.Z, the scale runs over the top from 0 (left, on the horizon) through 6 (top) to 12 (right, on the horizon).
// value v (0 … 12) → angle (canvas, y down): π (left) … 1.5π (up) … 2π (right)
export const angOf = (v) => Math.PI + v / 12 * Math.PI;
const HATCH = (() => { const r = prng(2020); return Array.from({ length: 64 }, (_, i) => [i / 64, r()]); })();
export function clock(ctx, t, x, y, R, o = {}) {
  const lit = clamp(o.lit ?? 1), at = (v, r) => [x + Math.cos(angOf(v)) * r, y + Math.sin(angOf(v)) * r];
  const out = { cx: x, cy: y, R, at };
  const semi = (r) => { const p = new Path2D(); p.moveTo(x - r, y); p.arc(x, y, r, Math.PI, 2 * Math.PI); p.closePath(); return p; };
  // halo (a dawn over the horizon) and face
  if (lit > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(x - R * 4, y - R * 4, R * 8, R * 4 + 2); ctx.clip();
    halo(ctx, x, y, R * 2.3, .34 * lit, P.halo0, P.core1); halo(ctx, x, y, R * 1.3, .18 * lit, P.halo1, P.core0); ctx.restore();
  }
  const face = semi(R);
  // the face is lit, but darker toward the rim (luma budget: the lit dial is the biggest bright area of the film)
  const f0 = mixHex(P.ind2, P.core1, lit), f1 = mixHex(P.ind1, P.halo0, lit * .95), f2 = mixHex(P.night1, mixHex(P.halo1, P.shade0, .5), lit), f3 = mixHex(P.night1, P.shade0, lit * .85);
  ctx.fillStyle = rad(ctx, x, y, R * 1.05, [[0, f0], [.3, f1], [.72, f2], [1, f3]]); ctx.fill(face);
  // the rim: a heavy ring + a thin outer ring
  ctx.strokeStyle = mixHex(P.night1, P.shade0, .35 + .4 * lit); ctx.lineWidth = R * .04; ctx.beginPath(); ctx.arc(x, y, R, Math.PI, 2 * Math.PI); ctx.stroke();
  ctx.strokeStyle = rgba(mixHex(P.halo1, P.core0, lit), .45 + .35 * lit); ctx.lineWidth = Math.max(1, R * .006); ctx.beginPath(); ctx.arc(x, y, R * 1.035, Math.PI, 2 * Math.PI); ctx.stroke();
  const ink = mixHex(P.blue1, INK, lit), inkA = .4 + .6 * lit;
  // the scale: 24 half ticks drawn round from 0 (ticks u), numerals 0 3 6 9 12 (num u)
  const tu = clamp(o.ticks ?? 1), thr = clamp(o.thr ?? 0);
  ctx.lineCap = 'round';
  for (let k = 0; k <= 24; k++) {
    const v = k / 2, u = clamp((tu * 25 - k) / 1.5); if (u <= 0) continue;
    const major = k % 2 === 0, r0 = R * (major ? .84 : .89), r1 = R * .94, [ax, ay] = at(v, r0), [bx, by] = at(v, lerp(r0, r1, u));
    ctx.strokeStyle = rgba(ink, inkA * (v > 11.6 && thr > 0 ? .45 : 1)); ctx.lineWidth = R * (major ? .012 : .007);
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }
  const nu = clamp(o.num ?? 1);
  if (nu > 0) for (const v of [0, 3, 6, 9, 12]) {
    const k = clamp((nu * 5.5 - v / 3) / 1.2); if (k <= 0) continue;
    const [nx, ny] = at(v, R * .74), sz = R * .1;
    ctx.save(); ctx.globalAlpha *= k; ctx.font = `${sz}px "Instrument Serif"`; ctx.textAlign = 'center';
    ctx.fillStyle = rgba(ink, inkA * (v === 12 && thr > 0 ? .55 : 1)); ctx.fillText(String(v), nx, Math.min(ny + sz * .35, y - sz * .12) + (1 - expoOut(k)) * sz * .4); ctx.restore();
  }
  // the threshold: a dashed radial line just before 12 (the 12 dims behind it); its label sits outside, right, on the horizon
  if (thr > 0) {
    const [ax, ay] = at(11.45, R * .32), [bx, by] = at(11.45, lerp(R * .32, R * 1.1, expoOut(thr)));
    ctx.save(); ctx.setLineDash([R * .03, R * .022]); ctx.strokeStyle = rgba(mixHex(COOL.edge, INK, lit * .6), .95); ctx.lineWidth = Math.max(1.5, R * .009);
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore();
  }
  // the title on the face, low, above the pivot; the footnote under the horizon line
  const ti = clamp(o.title ?? 0);
  if (ti > 0) K16.maskLine(ctx, [['MONTHS OF LIFE GAINED PER YEAR', 0]], x, y - R * 1.13, Math.max(22, R * .055), ti, { serif: false, align: 'center', col: P.cream, glow: true, weight: 600 });
  const fo = clamp(o.foot ?? 0);
  if (fo > 0) K16.maskLine(ctx, [['OUR ILLUSTRATION', 0]], x + R * 1.07, y - R * .02, Math.max(18, R * .028), fo, { serif: false, align: 'left', col: P.halo2, glow: false, weight: 600 });
  const tl = clamp(o.thrLabel ?? 0);
  if (tl > 0) { const [lx0, ly] = at(9.9, R * 1.12), sz = Math.max(30, R * .055), ss = sz * .66, src = o.thrSrc ? String(o.thrSrc).split('\n') : [];
    const lx = Math.min(lx0, W - 96 - sz * .4 - Math.max(K16.measure('ESCAPE VELOCITY', sz, false, 600), K16.measure('THRESHOLD · NEVER REACHED', ss, false, 600), ...src.map((l) => K16.measure(l, sz * .52, false, 500))));
    K16.maskLine(ctx, [['LONGEVITY', 0]], lx + sz * .4, ly - sz * 1.35, sz, tl, { serif: false, align: 'left', col: P.cream, glow: true, weight: 600 });
    K16.maskLine(ctx, [['ESCAPE VELOCITY', 0]], lx + sz * .4, ly - sz * .2, sz, clamp(tl * 1.15 - .1), { serif: false, align: 'left', col: P.cream, glow: true, weight: 600 });
    K16.maskLine(ctx, [['THRESHOLD · NEVER REACHED', 0]], lx + sz * .4, ly + sz * .95, ss, clamp(o.thrSub ?? tl), { serif: false, align: 'left', col: mixHex(COOL.mid, P.cream, .4), glow: false, weight: 600 });
    src.forEach((l, i) => { if ((o.thrSrcU ?? 0) > 0) K16.maskLine(ctx, [[l, 0]], lx + sz * .4, ly + sz * (1.7 + .62 * i), sz * .52, clamp(o.thrSrcU), { serif: false, align: 'left', col: P.halo2, glow: false, weight: 500 }); }); }
  // the push wedge (hatched: hope, NOT a measurement) from v0 to v1; its outer part can turn cool (the machine's share)
  const pu = o.push ? clamp(o.push.u ?? 1) : 0;
  if (pu > 0) {
    const { v0, v1 } = o.push, a0 = angOf(v0), a1 = angOf(lerp(v0, v1, expoOut(pu))), rr = R * .8, cool = clamp(o.push.cool ?? 0);
    const wedge = new Path2D(); wedge.moveTo(x, y); wedge.arc(x, y, rr, a0, a1); wedge.closePath();
    const col = mixHex(P.shade0, P.halo0, .25), cc = mixHex(COOL.edge, COOL.deep, .55);
    ctx.save(); ctx.clip(wedge);
    ctx.fillStyle = rgba(col, .14); ctx.fill(wedge);
    if (cool > 0) { ctx.fillStyle = rgba(cc, .16 * cool); ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, rr, lerp(a1, a0, .45), a1); ctx.closePath(); ctx.fill(); }
    ctx.lineWidth = Math.max(1.2, R * .007); ctx.lineCap = 'butt';
    const ang = -.75, ca = Math.cos(ang), sa = Math.sin(ang), split = lerp(a1, a0, .45 * cool);
    for (const [u, j] of HATCH) {      // diagonal hatch lines across the wedge (the newer part, nearer v1, turns cool)
      const d = (u - .5) * R * 2.1 + j * R * .01, px = x - sa * d, py = y + ca * d;
      const ex = px + ca * R, ey = py + sa * R, mx = (px + ex) / 2, my = (py + ey) / 2;
      const am = Math.atan2(my - y, mx - x); const isCool = cool > 0 && ((am + 6.283) % 6.283) > ((split + 6.283) % 6.283);
      ctx.strokeStyle = rgba(isCool ? cc : col, .9);
      ctx.beginPath(); ctx.moveTo(px - ca * R * 1.2, py - sa * R * 1.2); ctx.lineTo(px + ca * R * 1.2, py + sa * R * 1.2); ctx.stroke();
    }
    ctx.restore();
    ctx.save(); ctx.setLineDash([R * .02, R * .016]); ctx.strokeStyle = rgba(col, .95); ctx.lineWidth = Math.max(1.2, R * .006); ctx.stroke(wedge); ctx.restore();
    const lu = clamp(o.push.label ?? 0);
    if (lu > 0) {
      const mid = lerp(v0, lerp(v0, v1, expoOut(pu)), .5), [lx, ly] = at(mid, R * .5);
      K16.maskLine(ctx, [['PUSH', 0]], lx, ly + R * .02, R * .085, lu, { serif: false, align: 'center', col: mixHex(P.shade0, P.night1, .45), glow: false, weight: 600 });
      K16.maskLine(ctx, [['not a measurement', 0]], lx, ly + R * .085, Math.max(22, R * .036), lu, { serif: false, align: 'center', col: mixHex(P.shade0, P.night1, .45), glow: false, weight: 500 });
    }
  }
  // MEASURED marks: a solid notch on the rim at v, label outside
  for (const m of o.marks || []) {
    const u = clamp(m.u ?? 1); if (u <= 0) continue;
    const a = angOf(m.v), w = .035 * expoOut(u), r0 = R * .95, r1 = R * 1.06;
    ctx.fillStyle = rgba(mixHex(P.core1, P.halo0, .3), .95); ctx.beginPath(); ctx.arc(x, y, r1, a - w, a + w); ctx.arc(x, y, r0, a + w * .4, a - w * .4, true); ctx.closePath(); ctx.fill();
    const [ox, oy] = at(m.v, R * 1.08), sz = Math.max(32, R * .058), sw = Math.max(K16.measure(m.text, sz, false, 600), m.sub ? K16.measure(m.sub, sz * .62, false, 600) : 0, m.src ? K16.measure(m.src, sz * .52, false, 500) : 0);
    const ex = Math.max(ox - sz * .5, 70 + sw);                                   // right end of the label (never off the frame's left edge)
    K16.maskLine(ctx, [[m.text, 0]], ex, oy - sz * .3, sz, u, { serif: false, align: 'right', col: P.cream, glow: false, weight: 600 });
    if (m.sub) K16.maskLine(ctx, [[m.sub, 0]], ex, oy + sz * .5, sz * .62, u, { serif: false, align: 'right', col: P.halo0, glow: false, weight: 600 });
    if (m.src) K16.maskLine(ctx, [[m.src, 0]], ex, oy + sz * 1.12, sz * .52, u, { serif: false, align: 'right', col: P.halo2, glow: false, weight: 500 });
  }
  // the ghost needle (imagined value: dashed outline) and the needle (measured: solid ink, heavy, a counterweight)
  const needle = (v, ghost) => {
    const a = angOf(v), L = R * .8, tail = R * .1, wd = R * (ghost ? .018 : .03);
    const c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c;
    const p = new Path2D(); p.moveTo(x - c * tail + nx * wd, y - s * tail + ny * wd); p.lineTo(x + c * L, y + s * L); p.lineTo(x - c * tail - nx * wd, y - s * tail - ny * wd); p.closePath();
    if (ghost) { ctx.save(); ctx.setLineDash([R * .018, R * .013]); ctx.strokeStyle = rgba(mixHex(P.shade0, INK, lit * .5), .95); ctx.lineWidth = Math.max(1.2, R * .006); ctx.stroke(p); ctx.restore(); return; }
    ctx.fillStyle = mixHex(P.night1, INK, .5); ctx.fill(p);
    ctx.fillStyle = mixHex(P.night1, P.shade0, .4); ctx.beginPath(); ctx.arc(x, y, R * .045, Math.PI, 2 * Math.PI); ctx.fill();
  };
  if (o.ghost != null) needle(o.ghost, true);
  if (o.needle != null) { const tk = o.tick ? o.tick(t) : 0; needle(o.needle + .08 * tk, false); }
  // the three marks of the push (c01 1.12): small symbols inside the wedge, seated along its middle
  if (o.symbols && pu > 0) {
    const { v0, v1 } = o.push, vv = lerp(v0, v1, expoOut(pu));
    o.symbols.forEach(([kind, u], i) => { if (u <= 0) return; const [sx, sy] = at(lerp(v0, vv, .2 + i * .3), R * (i === 1 ? .36 : .58)); symbol(ctx, t, kind, sx, sy, R * .07, { u, cool: i ? clamp(o.push.cool ?? 0) : 0, ink: lit }); });
  }
  return out;
}
// the clock in the world: the pivot on the ground at (0, CLOCK.Z); its screen size grows as you approach
export function clockAt(ctx, c, t, o = {}) {
  const p = wp(c, 0, GY, o.Z ?? CLOCK.Z); if (!p) return null;
  return clock(ctx, t, p[0], p[1], CLOCK.R * p[2], o);
}

// ---------------------------------------------------------------------------------------------------------------------- symbols
export function symbol(ctx, t, kind, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const cool = clamp(o.cool ?? 0), col = mixHex(mixHex(P.shade0, INK, (o.ink ?? 0) * .5), COOL.deep, cool * .8), k = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.scale(lerp(.6, 1, k), lerp(.6, 1, k)); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * .09; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (kind === 'grid') {                              // a rack of experiment wells: 4 × 3 squares, some filled
    const n = 4, m = 3, c = s * .44;
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
      const q = clamp(u * 12 - (i + j * n) * .7), xx = (i - (n - 1) / 2) * c, yy = (j - (m - 1) / 2) * c;
      if (q <= 0) continue; ctx.strokeRect(xx - c * .38, yy - c * .38, c * .76, c * .76);
      if ((i * 7 + j * 3) % 4 === 1) { ctx.globalAlpha *= q; ctx.fillRect(xx - c * .25, yy - c * .25, c * .5, c * .5); ctx.globalAlpha /= q || 1; }
    }
  } else if (kind === 'molecule') {                   // a small ball-and-stick molecule
    const pts = [[-.55, .2], [-.15, -.3], [.3, -.05], [.62, -.45], [.35, .48], [-.2, .55]].map(([a, b]) => [a * s, b * s]);
    const bonds = [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 0]];
    bonds.forEach(([a, b], i) => { const q = clamp(u * 8 - i); if (q <= 0) return; ctx.beginPath(); ctx.moveTo(...pts[a]); ctx.lineTo(lerp(pts[a][0], pts[b][0], q), lerp(pts[a][1], pts[b][1], q)); ctx.stroke(); });
    pts.forEach(([a, b], i) => { const q = clamp(u * 8 - i * .8); if (q <= 0) return; ctx.beginPath(); ctx.arc(a, b, s * (i === 2 ? .17 : .12) * q, 0, 6.29); ctx.fill(); });
  } else {                                            // 'gauge': a dial gauge clamped on a short DNA twist (reading a cell's age)
    ctx.lineWidth = s * .07;
    for (const sg of [1, -1]) { ctx.beginPath(); for (let k2 = 0; k2 <= 20; k2++) { const v = k2 / 20, yy = lerp(s * .1, s * .95, v), xx = sg * Math.sin(v * 6.3 + t * .6) * s * .22; k2 ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    for (let k2 = 1; k2 < 6; k2++) { const v = k2 / 6, yy = lerp(s * .1, s * .95, v), xx = Math.sin(v * 6.3 + t * .6) * s * .22; ctx.lineWidth = s * .035; ctx.beginPath(); ctx.moveTo(-xx, yy); ctx.lineTo(xx, yy); ctx.stroke(); }
    ctx.lineWidth = s * .09; ctx.beginPath(); ctx.arc(0, -s * .3, s * .42, 0, 6.29); ctx.stroke();
    const a = -2.4 + 1.6 * (o.read ?? .6); ctx.beginPath(); ctx.moveTo(0, -s * .3); ctx.lineTo(Math.cos(a) * s * .32, -s * .3 + Math.sin(a) * s * .32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, s * .12); ctx.lineTo(0, s * .3); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- the table + lamp
export function lamp(ctx, c, t, o = {}) {
  const on = o.on ?? 1, sw = .006 * Math.sin(t * .7) + (o.swing ?? 0), up = (o.up ?? 0) * 2600;
  stand(ctx, c, LAMP.X, LAMP.Z, () => {
    ctx.save(); ctx.translate(0, -LAMP.h - 260 - up); ctx.rotate(sw); ctx.translate(0, 260);
    ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -260 - 4000); ctx.lineTo(0, -60); ctx.stroke();     // the cord from the dark
    // the shade: a wide dome, dark outside, its rim lit by the bulb
    const sh = new Path2D(); sh.moveTo(-170, 0); sh.bezierCurveTo(-160, -70, -90, -118, -30, -122); sh.lineTo(30, -122); sh.bezierCurveTo(90, -118, 160, -70, 170, 0); sh.closePath();
    ctx.fillStyle = lin(ctx, -170, 0, 170, 0, [[0, P.night1], [.55, mixHex(P.ind2, P.blue1, .4)], [1, P.ind1]]); ctx.fill(sh);
    ctx.fillStyle = mixHex(P.night1, P.shade0, .25); ctx.fillRect(-26, -150, 52, 30);
    // the lit inner opening (an ellipse seen from slightly below) and the bulb
    ctx.fillStyle = rgba(mixHex(P.halo0, P.core1, .5), .35 + .65 * on); ctx.beginPath(); ctx.ellipse(0, 0, 168, 16, 0, 0, 6.29); ctx.fill();
    if (on > 0) { halo(ctx, 0, 6, 140, .9 * on, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.ellipse(0, 4, 42, 22, 0, 0, 6.29); ctx.fill(); }
    ctx.restore();
  });
  // the cone of light down onto the table (added, soft) and the pool on the tabletop
  if (on > 0 && up < 2000) stand(ctx, c, LAMP.X, LAMP.Z, () => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const k = 1 - up / 2000, ly = -LAMP.h - up;
    ctx.fillStyle = lin(ctx, 0, ly, 0, -TABLE.h, [[0, rgba(P.halo0, .16 * on * k)], [1, rgba(P.halo0, .04 * on * k)]]);
    ctx.beginPath(); ctx.moveTo(-150, ly); ctx.lineTo(150, ly); ctx.lineTo(820, -TABLE.h); ctx.lineTo(-820, -TABLE.h); ctx.closePath(); ctx.fill();
    ctx.restore();
  });
}
export function table(ctx, c, t, o = {}) {
  const { z0, z1, x: hx, h } = TABLE, Y = GY - h, on = o.light ?? 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the top (seen from above only if the camera is above it)
  const top = flat(c, [[-hx, z0], [hx, z0], [hx, z1], [-hx, z1]], Y);
  if (top && c.y < Y) {
    const pa = wp(c, 0, Y, Math.max(z0, c.z + 61)), pb = wp(c, 0, Y, z1);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .35); ctx.fill(polyPath(top));
    // the lamp's pool on the top
    const pc = wp(c, LAMP.X, Y, (z0 + z1) / 2);
    if (pc && pa && pb) { ctx.save(); ctx.clip(polyPath(top)); ctx.globalCompositeOperation = 'lighter'; ctx.translate(pc[0], pc[1]); ctx.scale(1, Math.max(.05, Math.abs(pb[1] - pa[1]) / Math.max(1, 900 * pc[2])));
      ctx.fillStyle = rad(ctx, 0, 0, 900 * pc[2], [[0, rgba(P.halo0, .55 * on)], [.4, rgba(P.halo1, .22 * on)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 900 * pc[2], 0, 6.29); ctx.fill(); ctx.restore(); }
    // the plates (one per seat) and the place cards
    for (const f of FAMILY) {
      if (o.plates === 0) continue;
      const pts = []; for (let k = 0; k < 24; k++) { const a = k / 24 * 6.283; pts.push([f.X + Math.cos(a) * 120, z1 - 140 + Math.sin(a) * 90]); }
      const pp = flat(c, pts, Y - 1); if (!pp) continue;
      ctx.fillStyle = mixHex(P.blue1, P.halo1, .35 * on); ctx.fill(polyPath(pp));
    }
  }
  // the front: a cloth hanging to the floor (it hides the sitters' legs); a lit hem line where the lamp reaches it
  ctx.restore();
  stand(ctx, c, 0, z0, () => {
    const cl = new Path2D(); cl.moveTo(-hx - 30, -h); cl.lineTo(hx + 30, -h); cl.lineTo(hx + 40, 0);
    for (let k = 12; k >= 0; k--) { const xx = lerp(-hx - 40, hx + 40, k / 12); cl.lineTo(xx, -6 * (k % 2)); }
    cl.closePath();
    ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, mixHex(P.ind1, P.blue1, .3 + .3 * on)], [.35, P.ind2], [1, P.night1]]); ctx.fill(cl);
    ctx.save(); ctx.clip(cl); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 0, -h, 900, [[0, rgba(P.halo1, .28 * on)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(-hx - 60, -h, 2 * hx + 120, h); ctx.restore();
    ctx.strokeStyle = rgba(P.halo0, .6 * on + .15); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-hx - 30, -h); ctx.lineTo(hx + 30, -h); ctx.stroke();
  });
  // place cards: small folded cards standing on the tabletop in front of each sitter, with the birth years (a = o.years)
  const ya0 = o.years ?? 0;
  if (ya0 > 0 && c.y < GY - h + 40) stand(ctx, c, 0, z0 + 150, () => {
    const ya = ya0;
    if (ya > 0) for (const f of FAMILY) {
      const cx = f.X, cy = -h, w = 104, hh = 54;
      ctx.save(); ctx.globalAlpha *= ya;
      ctx.fillStyle = mixHex(P.halo1, P.core1, .3 * on); ctx.beginPath(); ctx.moveTo(cx - w / 2, cy); ctx.lineTo(cx - w / 2 + 6, cy - hh); ctx.lineTo(cx + w / 2 - 6, cy - hh); ctx.lineTo(cx + w / 2, cy); ctx.closePath(); ctx.fill();
      const dim = o.yearDim ? o.yearDim(f) : 0;
      ctx.font = `${f.year === 'YOU' ? '600 26px Inter' : '36px "Instrument Serif"'}`; ctx.textAlign = 'center'; ctx.fillStyle = rgba(INK, 1 - .55 * dim);
      if (f.year === 'YOU') ctx.letterSpacing = '4px';
      ctx.fillText(f.year, cx, cy - 15); ctx.restore();
      if (dim > 0) { ctx.strokeStyle = rgba(P.shade0, .9); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - 40, cy - 26); ctx.lineTo(cx - 40 + 80 * smooth(dim), cy - 26); ctx.stroke(); }
    }
  });
}
// a chair back behind a sitter (stand at SEAT.Z + 60)
export function chair(ctx, x, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .6);
  ctx.fillRect(x - 120, -340, 22, 340); ctx.fillRect(x + 98, -340, 22, 340); ctx.fillRect(x - 120, -350, 240, 30); ctx.fillRect(x - 120, -250, 240, 18);
  ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 4; ctx.strokeRect(x - 120, -350, 240, 30);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- the family
// head position of a figure (caller space) for overlays (gray hair, glasses, a kid's bigger head)
function headAt(x, y, h, o) {
  const dir = o.dir ?? 1, look = o.look ?? 0, lean = o.lean ?? 0, side = o.view === 'side' || (o.walk != null && o.view !== 'back');
  const hx = (side ? .012 : 0) - .012 * look, hy = -.885 - .008 * look, du = hx, dv = hy + .47;
  const uu = du * Math.cos(lean) - dv * Math.sin(lean), vv = du * Math.sin(lean) + dv * Math.cos(lean) - .47;
  return [x + h * dir * uu, y + h * vv, look * -.35 * dir];
}
// who: 'grand' | 'parent' | 'you' | 'kid'. y = the ground (feet) when standing; seat 1 lowers the figure so its hips sit on a chair
export function gen(ctx, t, who, x, y, h, o = {}) {
  const ph = (x * .013) % 6.28, br = 1 + .009 * Math.sin(t * 1.5 + ph);          // breathing: every figure on its own phase
  const kid = who === 'kid', hh = kid ? h * .6 : h, seat = clamp(o.seat ?? 0), yy = y + hh * (kid ? .03 : .23) * seat;   // the kid kneels on its chair
  const glow = clamp(o.glow ?? 0), rim = glow > 0 ? mixHex(who === 'you' ? mixHex(P.coat, P.core1, .75) : P.blue0, P.core0, glow * .85) : undefined;
  const q = { ...o, rim: o.rim ?? rim };
  if (who === 'grand') { q.lean = (o.lean ?? 0) + .07; q.long = true; }
  ctx.save(); ctx.translate(x, yy); ctx.scale(1, br); ctx.translate(-x, -yy);
  if (glow > 0) halo(ctx, x, yy - hh * .55, hh * .9, .3 * glow, who === 'you' ? P.halo0 : P.blue0, P.core1);
  const hands = who === 'you' ? E.du(ctx, x, yy, hh, q) : E.person(ctx, x, yy, hh, q);
  const [hx, hy, ra] = headAt(x, yy, hh, q);
  if (kid) {   // a child's head is bigger relative to the body
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(hx, hy + hh * .006, hh * .083, hh * .088, ra, 0, 6.29); ctx.fill();
    ctx.fillStyle = rgba(P.blue1, .55); ctx.beginPath(); ctx.ellipse(hx + .03 * hh * (q.light ?? 1) * (q.dir ?? 1), hy - hh * .016, hh * .03, hh * .055, ra, 0, 6.29); ctx.fill();
  }
  const gray = clamp(o.gray ?? (who === 'grand' ? 1 : 0));
  if (gray > 0) {   // gray hair: a silver cap on the head
    ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy, hh * .068, hh * .076, ra, 0, 6.29); ctx.clip();
    ctx.fillStyle = rgba(mixHex(P.blue2, P.cream, .55), .95 * gray); ctx.beginPath(); ctx.ellipse(hx - .01 * hh, hy - hh * .03, hh * .08, hh * .06, ra, 0, 6.29); ctx.fill();
    ctx.restore();
  }
  const gl = clamp(o.glasses ?? 0);
  if (gl > 0) {   // reading glasses: one lit ring on the facing side + the temple
    const d = (q.dir ?? 1), gx = hx + d * hh * .048, gy = hy + hh * .012, r = hh * .022 * expoOut(gl);
    ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = Math.max(1.2, hh * .006);
    ctx.beginPath(); ctx.arc(gx, gy, r, 0, 6.29); ctx.stroke(); ctx.beginPath(); ctx.moveTo(gx - d * r, gy - r * .2); ctx.lineTo(hx - d * hh * .03, gy - hh * .01); ctx.stroke();
    halo(ctx, gx, gy, r * 5, .4 * gl, P.halo0, P.core0);
  }
  ctx.restore();
  return hands;
}

// ---------------------------------------------------------------------------------------------------------------------- eye + drop
export function drop(ctx, x, y, r, o = {}) {
  const a = o.a ?? 1, st = o.stretch ?? 0; if (a <= 0 || r <= 0) return;
  halo(ctx, x, y, r * 6, .7 * a, P.halo0, P.core0);
  const p = new Path2D(), ry = r * (1 + st);
  p.moveTo(x, y - ry * 1.6); p.bezierCurveTo(x + r * .35, y - ry * .9, x + r, y - ry * .2, x + r, y + r * .25); p.arc(x, y + r * .25, r, 0, Math.PI); p.bezierCurveTo(x - r, y - ry * .2, x - r * .35, y - ry * .9, x, y - ry * 1.6); p.closePath();
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = rad(ctx, x - r * .3, y, r * 1.6, [[0, P.core0], [.5, P.core1], [1, P.halo0]]); ctx.fill(p); ctx.restore();
}
const FIB = (() => { const r = prng(2033); return Array.from({ length: 120 }, (_, i) => [i / 120 * 6.283 + r() * .04, .55 + r() * .35, r()]); })();
export function eye(ctx, t, x, y, w, o = {}) {
  const open = clamp(o.open ?? 1) * (1 - clamp(o.blink ?? 0)), young = clamp(o.young ?? 0), [lx, ly] = o.look || [0, 0];
  const hw = w / 2, hh = w * .3 * Math.max(.02, open), ri = w * .2, rp = w * .075 * (1 - .25 * young);
  const almond = new Path2D(); almond.moveTo(x - hw, y); almond.bezierCurveTo(x - hw * .5, y - hh * 1.32, x + hw * .5, y - hh * 1.32, x + hw, y); almond.bezierCurveTo(x + hw * .5, y + hh * 1.32, x - hw * .5, y + hh * 1.32, x - hw, y); almond.closePath();
  // around the eye: a soft dark field and a warm rim (the lid edges catch the light)
  ctx.fillStyle = rad(ctx, x, y, w * .75, [[0, rgba(P.ind2, .95)], [.7, rgba(P.ind0, .6)], [1, rgba(P.night0, 0)]]); ctx.beginPath(); ctx.ellipse(x, y, w * .75, w * .5, 0, 0, 6.29); ctx.fill();
  ctx.save(); ctx.clip(almond);
  ctx.fillStyle = rad(ctx, x, y - hh * .3, hw, [[0, mixHex(P.blue2, P.halo2, .35)], [1, mixHex(P.ind1, P.blue1, .5)]]); ctx.fillRect(x - hw, y - hh * 1.4, w, hh * 2.8);
  const ix = x + lx * w * .06, iy = y + ly * w * .03;
  // the iris: fibres from gray-blue (old) to gold (young), a dark limbal ring
  ctx.fillStyle = rad(ctx, ix, iy, ri, [[0, mixHex(P.blue1, P.halo1, young * .8)], [.75, mixHex(P.blue2, P.shade0, young)], [1, P.night1]]); ctx.beginPath(); ctx.arc(ix, iy, ri, 0, 6.29); ctx.fill();
  ctx.lineWidth = Math.max(.8, w * .004); ctx.lineCap = 'round';
  for (const [a, l, s] of FIB) {
    const wave = young > 0 ? clamp(young * 1.6 - s * .6) : 0;
    ctx.strokeStyle = rgba(mixHex(P.blue2, P.core1, wave), .35 + .45 * wave);
    ctx.beginPath(); ctx.moveTo(ix + Math.cos(a) * rp * 1.15, iy + Math.sin(a) * rp * 1.15); ctx.lineTo(ix + Math.cos(a + .05) * ri * l, iy + Math.sin(a + .05) * ri * l); ctx.stroke();
  }
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(ix, iy, rp, 0, 6.29); ctx.fill();
  // the ripple where the drop went in (a ring running out through the iris)
  const rq = clamp(o.ripple ?? 0);
  if (rq > 0 && rq < 1) { ctx.strokeStyle = rgba(P.core0, .8 * (1 - rq)); ctx.lineWidth = w * .006 * (1 - rq) + 1; ctx.beginPath(); ctx.arc(ix, iy, lerp(rp, ri * 1.05, expoOut(rq)), 0, 6.29); ctx.stroke(); }
  ctx.fillStyle = rgba(P.core0, .9); ctx.beginPath(); ctx.ellipse(ix - ri * .32, iy - ri * .36, ri * .13, ri * .09, -.6, 0, 6.29); ctx.fill();   // the catch light
  // lid shadow
  ctx.fillStyle = lin(ctx, 0, y - hh * 1.1, 0, y - hh * .3, [[0, rgba(P.night0, .55)], [1, rgba(P.night0, 0)]]); ctx.fillRect(x - hw, y - hh * 1.4, w, hh * 1.2);
  ctx.restore();
  ctx.strokeStyle = rgba(P.halo1, .75); ctx.lineWidth = w * .012; ctx.stroke(almond);
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = w * .02; ctx.beginPath(); ctx.moveTo(x - hw, y); ctx.bezierCurveTo(x - hw * .5, y - hh * 1.32, x + hw * .5, y - hh * 1.32, x + hw, y); ctx.stroke();
  // the drop of light: falls from above into the pupil (o.drop 0 → 1)
  const dq = o.drop ?? -1;
  if (dq >= 0 && dq < 1) { const yy = lerp(y - w * .9, iy, expoIn(dq)); drop(ctx, ix, yy, w * .028, { stretch: .6 * expoIn(dq) }); }
  return { pupil: [ix, iy], ri, rp };
}

// the eye standing on the tabletop (c01 hook, plateEye, c05): it rises out of the table's middle (Z = LAMP.Z) under the lamp.
// o: { rise 0..1, w (560), lie 0..1 (sinks back + closes), plus all eye() options }. Returns the pupil in stand units (or null).
export const EYE_Y = -TABLE.h - 240;                            // pupil height when risen (stand units at Z = LAMP.Z; up = −)
export function tableEye(ctx, c, t, o = {}) {
  const r = clamp(o.rise ?? 1), lie = clamp(o.lie ?? 0); if (r <= 0) return null; let out = null;
  stand(ctx, c, 0, LAMP.Z, () => {
    const w = o.w ?? 560, y = -TABLE.h + lerp(w * .56, -240, sineIO(r) * (1 - lie));     // from below the tabletop (hidden) up to 240 above it
    ctx.save(); ctx.beginPath(); ctx.rect(-2000, -6000, 4000, 6000 - TABLE.h); ctx.clip();                 // it comes out of the tabletop
    const e = eye(ctx, t, 0, y, w * (1 - .25 * lie), { ...o, open: clamp(o.open ?? 1) * (1 - lie) });
    ctx.restore(); out = e;
  });
  return out;
}

// ---------------------------------------------------------------------------------------------------------------------- button + proteins
const PROT = [[[0, 0, .55], [.5, -.3, .4], [.35, .45, .38]], [[0, 0, .5], [-.45, -.25, .42], [.45, -.2, .36], [0, .5, .3]], [[0, 0, .6], [.55, .3, .35]], [[-.3, 0, .45], [.3, 0, .45], [0, -.45, .35], [0, .45, .35]]];
export function protein(ctx, t, x, y, r, i, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 1), cool = clamp(o.cool ?? 0), rd = clamp(o.redraw ?? 1); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(i * 1.3 + .1 * Math.sin(t * .8 + i));
  const parts = PROT[i % 4];
  parts.forEach(([px, py, pr], k) => {
    const q = clamp(rd * parts.length - k); if (q <= 0) return;
    const col0 = mixHex(mixHex(P.core1, COOL.core, cool), P.blue1, 1 - lit), col1 = mixHex(mixHex(P.halo0, COOL.edge, cool), P.night1, 1 - lit);
    ctx.fillStyle = rad(ctx, px * r - pr * r * .3, py * r - pr * r * .3, pr * r * 1.3, [[0, col0], [1, col1]]); ctx.beginPath(); ctx.arc(px * r, py * r, pr * r * expoOut(q), 0, 6.29); ctx.fill();
  });
  ctx.restore();
}
export function button(ctx, t, x, y, r, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)), press = clamp(o.press ?? 0), lit = clamp(o.lit ?? 1); if (u <= 0) return null;
  const R = r * u, depth = R * .28 * (1 - .8 * press);
  ctx.save();
  // the base (a flat ring seen slightly from above) and the cap
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.ellipse(x, y + R * .2, R * 1.45, R * .52, 0, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.halo1, .5 * lit); ctx.lineWidth = R * .03; ctx.stroke();
  halo(ctx, x, y - depth, R * 2.4, .45 * lit, P.halo0, P.core1);
  ctx.fillStyle = lin(ctx, x - R, 0, x + R, 0, [[0, mixHex(P.shade0, P.night1, .4)], [.5, mixHex(P.halo0, P.shade0, .3)], [1, mixHex(P.shade0, P.night1, .5)]]);
  ctx.beginPath(); ctx.ellipse(x, y, R, R * .36, 0, 0, Math.PI); ctx.lineTo(x - R, y - depth); ctx.ellipse(x, y - depth, R, R * .36, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rad(ctx, x - R * .25, y - depth - R * .1, R * 1.2, [[0, mixHex(P.core0, P.halo1, 1 - lit)], [.6, mixHex(P.core1, P.shade0, 1 - lit)], [1, mixHex(P.halo0, P.shade0, .5 + .5 * (1 - lit))]]);
  ctx.beginPath(); ctx.ellipse(x, y - depth, R, R * .36, 0, 0, 6.29); ctx.fill();
  // four sockets on the cap for the four proteins (slots 0..4 seated)
  const sl = o.slots ?? 0;
  for (let i = 0; i < 4; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 2 + .6, sx = x + Math.cos(a) * R * .55, sy = y - depth + Math.sin(a) * R * .2;
    ctx.fillStyle = rgba(P.shade0, .55); ctx.beginPath(); ctx.ellipse(sx, sy, R * .16, R * .06, 0, 0, 6.29); ctx.fill();
    const q = clamp(sl - i); if (q > 0) protein(ctx, t, sx, sy - R * .08 - (1 - expoOut(q)) * R * .8, R * .13, i, { lit, a: clamp(q * 4) });
  }
  ctx.restore();
  return { top: [x, y - depth], R };
}

// ---------------------------------------------------------------------------------------------------------------------- the thread (wards)
export const WARDS = ['CANCER', 'HEART', 'DEMENTIA', 'DIABETES'];
export function wards(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1), join = smooth(clamp(o.join ?? 0)), pull = clamp(o.pull ?? 0), w = o.w ?? 1300, lit = clamp(o.lit ?? 1), la = clamp(o.label ?? 1);
  if (u <= 0) return null;
  const knot = [x, y + 120 + 60 * pull], out = { knot, lamps: [] };
  for (let i = 0; i < 4; i++) {
    const q = clamp(u * 4 - i); if (q <= 0) continue;
    const sw = (.03 * Math.sin(t * .9 + i * 1.7)) + pull * .12 * Math.sin(t * 3 + i) * Math.exp(-2 * Math.max(0, (o.pullT ?? 0)));
    const ax = x + (i - 1.5) * w / 4, ay = y - 700, lx = lerp(ax, x + (i - 1.5) * w / 4 * .9, join), ly = y + 520 + 60 * pull;
    const px = lx + Math.sin(sw) * 300, py = lerp(ay, ly, expoOut(q));
    // the thread: from the top (separate) or from the common knot (joined)
    ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = 3;
    ctx.beginPath(); if (join < 1) { ctx.globalAlpha = 1 - join; ctx.moveTo(ax, -2000); ctx.lineTo(px, py - 120); ctx.stroke(); ctx.globalAlpha = 1; }
    if (join > 0) { ctx.beginPath(); ctx.moveTo(knot[0], knot[1]); ctx.quadraticCurveTo(lerp(knot[0], px, .5), lerp(knot[1], py - 120, .2), px, py - 120); ctx.strokeStyle = rgba(P.halo0, .85 * join); ctx.stroke(); }
    // the lamp shade (a ward light), its pool below
    const sh = new Path2D(); sh.moveTo(px - 110, py); sh.bezierCurveTo(px - 100, py - 60, px - 50, py - 100, px, py - 120); sh.bezierCurveTo(px + 50, py - 100, px + 100, py - 60, px + 110, py); sh.closePath();
    halo(ctx, px, py + 10, 230, .55 * lit * q, P.halo0, P.core0);
    ctx.fillStyle = lin(ctx, px - 110, 0, px + 110, 0, [[0, P.night1], [.5, mixHex(P.ind2, P.blue1, .5)], [1, P.ind1]]); ctx.fill(sh);
    ctx.fillStyle = rgba(P.core1, .5 + .5 * lit); ctx.beginPath(); ctx.ellipse(px, py, 108, 12, 0, 0, 6.29); ctx.fill();
    if (la > 0) K16.maskLine(ctx, [[WARDS[i], 0]], px, py + 70, 30, la * q, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 });
    out.lamps.push([px, py]);
  }
  if (join > 0) { // the knot AGE and the one cord running down from it
    ctx.fillStyle = rgba(P.core1, join); ctx.beginPath(); ctx.arc(knot[0], knot[1], 16, 0, 6.29); ctx.fill(); halo(ctx, knot[0], knot[1], 90, .6 * join, P.halo0, P.core0);
    ctx.strokeStyle = rgba(P.halo0, .9 * join); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(knot[0], knot[1]); ctx.lineTo(knot[0], knot[1] - 1600); ctx.stroke();
    if (la > 0) K16.maskLine(ctx, [['AGE', 0]], knot[0] + 40, knot[1] + 14, 44, la * join, { serif: false, col: P.cream, glow: true, weight: 600 });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------------- text helpers
// a small source / label line (Inter caps, halo2) rising from its baseline; u 0..1 in, out 0..1 sinks it again
export function srcLine(ctx, t, s, x, y, u, o = {}) {
  if (u <= 0) return; K16.maskLine(ctx, [[s, 0]], x, y, o.size ?? 24, u, { serif: false, align: o.align, col: o.col ?? P.halo2, glow: false, weight: o.weight ?? 600 });
}
// the question card, pinned at the top-left edge: it slides in from the frame edge (a pin of light lands on it), its line rolls to the
// next question at each step (old line sinks, new one rises). steps [[t0, text | null], …]; null takes the card out again.
export function qcard(ctx, t, steps, o = {}) {
  let i = -1; for (let k = 0; k < steps.length; k++) if (t >= steps[k][0] - .35) i = k;
  if (i < 0) return;
  const t0 = steps[0][0], tOut = steps.find((s) => s[1] == null)?.[0];
  const inn = expoOut(span(t, t0 - .35, t0 + .45)), out = tOut != null ? expoIn(span(t, tOut - .35, tOut + .2)) : 0;
  if (out >= 1) return;
  const x = o.x ?? 92, y = o.y ?? 86, size = o.size ?? 30;
  const txt = (k) => steps[k]?.[1];
  const wNow = Math.max(...steps.filter((s) => s[1]).map((s) => measure(s[1], size, false, 600))) + 64;
  const slide = (1 - inn) * -(wNow + x + 40) + out * -(wNow + x + 40);
  ctx.save(); ctx.translate(slide, 0);
  const p = new Path2D(); p.roundRect(x, y, wNow, size * 2.1, 6);
  ctx.fillStyle = rgba(P.night1, .88); ctx.fill(p); ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = 2; ctx.stroke(p);
  ctx.fillStyle = P.halo0; ctx.fillRect(x, y, 6, size * 2.1);                          // the gold edge
  halo(ctx, x + wNow - 18, y + 4, 26, .8 * inn, P.halo0, P.core0);                     // the pin
  const cur = txt(i), sw = span(t, steps[i][0] - .35, steps[i][0] + .45), prev = i > 0 ? txt(i - 1) : null;
  if (prev && sw < 1) srcLine(ctx, t, prev, x + 30, y + size * 1.42, 1 - sw, { size, col: P.cream });
  if (cur) srcLine(ctx, t, cur, x + 30, y + size * 1.42, i === 0 ? inn : expoOut(sw), { size, col: o.gold ? P.halo0 : P.cream });
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- quote card
// THE QUOTE CARD of Film 20: a cream index card of light (the clock face's material), ink type, a gold rule, a small clock-pin.
// It rises from below its baseline into place (t0), sinks out again (t1). o.from: [x, y, scale] an object it unfolds from (optional).
export function quoteCard(ctx, t, o) {
  const u = rise(span(t, o.t0, o.t0 + .9)), out = o.t1 != null ? expoIn(span(t, o.t1, o.t1 + .55)) : 0; if (u <= 0 || out >= 1) return;
  const w = o.w ?? 1240, size = o.size ?? 58, x = o.x ?? W / 2, y = o.y ?? 470;
  // measure the lines
  const words = `“${o.text}”`.split(/\s+/), lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.join(' '), size) > w - 160) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const lead = size * 1.22, hCard = lines.length * lead + 190 + (o.who ? 40 : 0);
  const k = lerp(.94, 1, u) * (1 - .04 * out), dy = (1 - u) * 60 + out * 80;
  ctx.save(); ctx.translate(x, y + dy); ctx.scale(k, k); ctx.globalAlpha *= clamp(u * 2.5) * (1 - out);
  const p = new Path2D(); p.roundRect(-w / 2, -hCard / 2, w, hCard, 10);
  halo(ctx, 0, 0, w * .75, .35, P.halo0, P.core1);
  ctx.fillStyle = rad(ctx, -w * .2, -hCard * .3, w * .9, [[0, P.core0], [.6, P.core1], [1, P.halo1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.shade0, .6); ctx.lineWidth = 3; ctx.stroke(p);
  ctx.fillStyle = rgba(P.shade0, .8); ctx.fillRect(-w / 2 + 70, -hCard / 2 + 70, 5, hCard - 140);                 // the gold rule
  ctx.fillStyle = mixHex(P.night1, P.shade0, .4); ctx.beginPath(); ctx.arc(0, -hCard / 2 + 4, 13, 0, 6.29); ctx.fill();   // the pin
  const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  lines.forEach((ln, li) => {
    const lu = rise(span(t, o.t0 + .25 + li * .14, o.t0 + 1.1 + li * .14));
    let xx = -w / 2 + 110; const yy = -hCard / 2 + 95 + size * .8 + li * lead + (1 - lu) * 18;
    ctx.save(); ctx.globalAlpha *= lu; ctx.font = `${size}px "Instrument Serif"`;
    for (const wd of ln) {
      const g = (o.gold || []).find(([ph]) => ph.split(/\s+/).some((pw) => nz(pw) === nz(wd)));
      const warm = g ? smooth(span(t, g[1] - .05, g[1] + .5)) : 0;
      ctx.fillStyle = mixHex(INK, P.shade0, warm * .9); ctx.fillText(wd, xx, yy); xx += measure(wd + ' ', size);
    }
    ctx.restore();
  });
  if (o.who) { const au = rise(span(t, o.t0 + .6 + lines.length * .14, o.t0 + 1.5 + lines.length * .14)); ctx.save(); ctx.globalAlpha *= au; ctx.font = '600 26px Inter'; ctx.letterSpacing = '4px'; ctx.fillStyle = rgba(INK, .8);
    ctx.fillText(o.who.toUpperCase(), -w / 2 + 110, hCard / 2 - 70 + (1 - au) * 10); if (o.src) { ctx.font = '500 21px Inter'; ctx.fillStyle = rgba(INK, .6); ctx.fillText(o.src.toUpperCase(), -w / 2 + 110, hCard / 2 - 38 + (1 - au) * 10); } ctx.restore(); }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- clip frame
// ORIGINAL FOOTAGE: the real clip is laid over CLIP_RECT later (ffmpeg overlay, timing.json clips[id].start/end), so during the clip
// the rect stays EXACTLY here (film.mjs switches the camera float off in clip windows). Lower third to the left of the screen, never
// in the subtitle zone. Until then a placeholder: a dark screen, a speaker silhouette breathing, the word ORIGINAL FOOTAGE.
export const CLIP_RECT = { x: 560, y: 120, w: 1280, h: 720 };
export function clipWindow(T, id) { const c = T.clip?.(id) || T.clips?.[id]; return c ? { start: c.start, end: c.end } : null; }
export function clipScreen(ctx, t, o) {
  const r = o.rect || CLIP_RECT, u = clamp(o.u ?? 1), on = clamp(o.on ?? 1);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  halo(ctx, r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h) * .85, .22 * on, P.blue0, P.halo1);
  const p = new Path2D(); p.roundRect(r.x, r.y, r.w, r.h, 8);
  ctx.save(); ctx.clip(p);
  ctx.fillStyle = rad(ctx, r.x + r.w * .5, r.y + r.h * .38, r.w * .75, [[0, mixHex('#1c2a5c', P.night1, 1 - u)], [1, '#05060f']]); ctx.fillRect(r.x, r.y, r.w, r.h);
  if (u > 0) {   // the placeholder speaker (head and shoulders, breathing)
    const cx = r.x + r.w * .5 + Math.sin(t * .8) * r.w * .004, cy = r.y + r.h * .64, s = r.h / 600 * u;
    ctx.fillStyle = rgba('#0b0d26', u); ctx.beginPath(); ctx.ellipse(cx, cy - 150 * s + Math.sin(t * 2.2) * 2 * s, 78 * s, 96 * s, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - 230 * s, r.y + r.h); ctx.bezierCurveTo(cx - 220 * s, cy - 10 * s, cx - 90 * s, cy - 40 * s, cx, cy - 40 * s); ctx.bezierCurveTo(cx + 90 * s, cy - 40 * s, cx + 220 * s, cy - 10 * s, cx + 230 * s, r.y + r.h); ctx.fill();
    ctx.font = '600 22px Inter'; ctx.letterSpacing = '6px'; ctx.textAlign = 'center'; ctx.fillStyle = rgba(P.halo2, .5 * u); ctx.fillText(`CLIP ${o.id || ''} · PLACEHOLDER`, r.x + r.w / 2, r.y + 50);
  }
  ctx.restore();
  ctx.strokeStyle = rgba(P.halo1, .55 * on); ctx.lineWidth = 3; ctx.stroke(p);
  // lower third (left of the screen): ORIGINAL FOOTAGE · name · role · date
  const lu = clamp(o.label ?? u);
  if (lu > 0) {
    const lx = Math.max(90, r.x - 470), ly = r.y + r.h - 190;
    ctx.fillStyle = rgba(P.halo0, lu); ctx.fillRect(lx, ly - 10 + (1 - lu) * 16, 5, 170);
    srcLine(ctx, t, 'ORIGINAL FOOTAGE', lx + 26, ly + 22, lu, { size: 22, col: P.halo0 });
    if (o.name) K16.maskLine(ctx, [[o.name, 0]], lx + 26, ly + 78, 46, lu, { serif: true, col: P.cream, glow: true });
    if (o.role) srcLine(ctx, t, o.role, lx + 26, ly + 118, lu, { size: 21 });
    if (o.date) srcLine(ctx, t, o.date, lx + 26, ly + 150, lu, { size: 21 });
  }
  ctx.restore();
}

// ======================================================================================================================== the world
// The standard world in one call (back → front): sky, plain, the dial on the horizon, the track, the family on the track (far → near),
// the chairs, the seated family, the table, the lamp. st (all optional):
//   { warm, dial: {…clock options} | null, track: {…track options} | null, fam: [{ who, X, Z, seat, dir, view, walk, look, glow, gray,
//     glasses, armR, armL, lean, a }], chairs 0..1, table: {…table options} | null, lamp: { on, up (0..1: pulled up out of the frame) } | null,
//     onTable(ctx, c, t) (things standing on the tabletop, drawn after the table), extra(ctx, c, t, layer) hooks: 'far' (after the
//     dial), 'track' (after the track), 'near' (after the table and lamp) }
export function scene20(ctx, c, t, st = {}) {
  sky(ctx, c, t, { warm: st.warm });
  const dl = st.dial ? clamp(st.dial.lit ?? 1) : 0, piv = wp(c, 0, GY, CLOCK.Z);
  plain(ctx, c, t, { warm: st.warm, clock: dl, clockXY: piv });
  let dial = null;
  if (st.dial) { const sc = stand(ctx, c, 0, CLOCK.Z, () => {}); dial = clockAt(ctx, c, t, st.dial); }
  st.extra?.(ctx, c, t, 'far', dial);
  if (st.track) track(ctx, c, t, st.track);
  st.extra?.(ctx, c, t, 'track', dial);
  const fam = (st.fam || []).filter((f) => (f.a ?? 1) > 0);
  const onTrack = fam.filter((f) => !(f.seat > 0)).sort((p, q) => q.Z - p.Z), seated = fam.filter((f) => f.seat > 0);
  const hands = {};
  const drawF = (f) => stand(ctx, c, 0, f.Z, () => { ctx.save(); ctx.globalAlpha *= f.a ?? 1; hands[f.who] = gen(ctx, t, f.who, f.X, 0, HUM, f); ctx.restore(); });
  for (const f of onTrack.filter((f) => f.Z > SEAT.Z + 61)) drawF(f);
  if ((st.chairs ?? 0) > 0) stand(ctx, c, 0, SEAT.Z + 60, () => { for (const f of FAMILY) chair(ctx, f.X, { a: st.chairs }); });
  for (const f of seated) drawF(f);
  for (const f of onTrack.filter((f) => f.Z <= SEAT.Z + 61)) drawF(f);
  if (st.table) { table(ctx, c, t, st.table); st.onTable?.(ctx, c, t); }
  if (st.lamp) lamp(ctx, c, t, st.lamp);
  st.extra?.(ctx, c, t, 'near', dial);
  return { dial, hands };
}
