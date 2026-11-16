// Film 18 · "AI Will End Capitalism" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (stage, palette, du/person, light, type, finish) + lib/f16_kit.mjs (quote, rule, stamp, rise, blink,
// maskLine, trailSpan, measure, along, roundRectPts). This file adds the ONE world of Film 18, THE BOARD, and its objects:
//
//   THE BOARD (docs/MOTION.md §2): one night plain that is secretly a game board. Its far edge is the horizon = PRICE ZERO (the zero
//   line). A road of light runs round it in a loop = THE CIRCLE (wage → purchase → profit). Places stand on it as flat paper cards.
//   Price tags of light hang over the places on long threads from the sky. A price that falls slides down its thread toward the
//   zero line and evaporates upward as dust that becomes the stars (air: free). What stays scarce keeps its tag on a DOOR.
//
//   wp(c, X, Y, Z)            world point → screen [x, y, s] (s = px per world unit there; null behind the camera)
//   gp(c, X, Z)               ground point (Y = BOARD.GY) → screen [x, y, s]
//   stand(ctx, c, X, Z, fn)   draw fn() in WORLD units with the origin on the ground at (X, Z) (a flat card standing there; y up = −)
//   sky(ctx, c, t, o)         sky card (40000): night gradient + stars (+ o.air 0..1: the evaporated prices as extra fine stars)
//   board(ctx, c, t, o)       the board surface (clipped, projected), the zero line on its far edge, the loop road, field ticks
//                             o: { road 0..1 (base light), lit: [[u0, u1, a]] extra light along the loop (u = loopPt param),
//                                  ticks 0..1, zero 0..1, warm 0..1 (dawn: c11), edge 0..1 (show the board's own edge: c08) }
//   loopPt(u) / loopDir(u)    the loop road (rounded square), u 0..1 clockwise seen from above, u = 0 at the near-left end of the
//                             near edge, running left → right along the near edge first. Returns [X, Z].  loopU(X) near-edge u of X
//   tag(ctx, t, x, y, w, o)   THE PRICE TAG (hangs from its eyelet at x, y; h = 1.32 w)
//                             o: { text, u (text rises 0..1), cool 0..1 (machine light on it), melt 0..1 (eaten from the bottom up,
//                                  grains rise as dust), emit (t) => 0..1 (dust stream from the bottom edge), swing (rad), a,
//                                  thread (length up, default 3000), glow }
//   evap(ctx, t, pts, emit, o) a deterministic dust stream rising from a polyline (prices becoming air)
//   coin(ctx, t, x, y, r, o)  THE COIN (the money that runs the circle). o: { spin (rad: rolling), a, glow, pie: share 0..1 lit, hi }
//   door(ctx, t, x, y, h, o)  THE DOOR (what stays scarce). Stands on (x, y). o: { lit 0..1, open 0..1, a, rim } returns { hook, sill }
//   firstPicture(ctx, t, o)   THE TWO RECORDS (c02, called back in c07): profit per sales dollar 17.0 % · workers' share 52.8 %
//   ruleCard(ctx, t, x, y, w, o)   Lizzie Magie's two rule sets (c08, c09, c11): o: { n: 'I' | 'II', sub, u, a, glow }
//   cool(…)                   the machine's light: cool blue-cream (palette COOL); a small rising disc on the horizon (c01) etc.
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, glowFill, halo, rad, lin, prng, drift, F0, card } = E;
export const { rise, blink, quote, rule, stamp, along, roundRectPts, trailSpan, maskLine, measure } = K16;

export const PRINT18 = { grain: 14, floor: 4, vig: .5 };
// the machine's light (cool blue-cream; blue is the machine, gold is human value, yellow is only you)
export const COOL = { core: '#eef3ff', mid: '#b4c8ee', edge: '#6a8cd2', deep: '#2b4a96' };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== board
// World units = design px at the focus depth F0 (1700). Camera looks along +Z, no pitch (see f10_editorial cam3); the ground is the
// plane Y = GY. Because there is no pitch, the board is seen from at most ~17° above (f 1700) or ~30° (f 900): a tabletop view.
export const BOARD = { GY: 430, cz: 7000, half: 10000 };                // the board square: X ±10000, Z −3000 … 17000 (far edge = zero line)
export const LOOP = { cx: 0, cz: 5500, half: 2600, r: 700, w: 46 };     // the road: near edge Z 2900, far edge 8100, X ±2600
export function wp(c, X, Y, Z) {
  const dz = Z - c.z; if (dz < 30) return null;
  const s = c.f / dz; let x = W / 2 + (X - c.x) * s, y = H / 2 + (Y - c.y) * s;
  if (c.roll) { const cr = Math.cos(c.roll), sr = Math.sin(c.roll), dx = x - W / 2, dy = y - H / 2; x = W / 2 + dx * cr - dy * sr; y = H / 2 + dx * sr + dy * cr; }
  return [x, y, s];
}
export const gp = (c, X, Z) => wp(c, X, BOARD.GY, Z);
// a flat card standing on the ground at (X, Z): fn draws in world units, origin at the foot point, y up is negative
export function stand(ctx, c, X, Z, fn, Y = BOARD.GY) {
  return card(ctx, c, Z, () => { const k = F0 / Z; ctx.translate(X * k + W / 2, Y * k + H / 2); ctx.scale(k, k); fn(); });
}
// clip a polygon in the XZ plane to Z >= zMin, then project (ground)
function projPoly(c, pts, Y = BOARD.GY) {
  const zMin = c.z + 60, out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[1] >= zMin, ib = b[1] >= zMin;
    if (ia) out.push(a);
    if (ia !== ib) { const f = (zMin - a[1]) / (b[1] - a[1]); out.push([lerp(a[0], b[0], f), zMin]); }
  }
  return out.map((p) => wp(c, p[0], Y, p[1])).filter(Boolean);
}
// the loop road: rounded square, clockwise seen from above, starting at the near-left end of the near edge, running +X first
const LOOP_N = 480, LOOP_PTS = (() => {
  const { cx, cz, half: h, r } = LOOP, seg = [];
  const zN = cz - h, zF = cz + h, xL = cx - h, xR = cx + h;
  const arc = (ox, oz, a0, a1) => { for (let k = 1; k <= 12; k++) { const a = lerp(a0, a1, k / 12); seg.push([ox + Math.cos(a) * r, oz + Math.sin(a) * r]); } };
  seg.push([xL + r, zN]); seg.push([xR - r, zN]); arc(xR - r, zN + r, -Math.PI / 2, 0);
  seg.push([xR, zF - r]); arc(xR - r, zF - r, 0, Math.PI / 2);
  seg.push([xL + r, zF]); arc(xL + r, zF - r, Math.PI / 2, Math.PI);
  seg.push([xL, zN + r]); arc(xL + r, zN + r, Math.PI, Math.PI * 1.5);
  // resample evenly
  const len = [0]; for (let i = 1; i < seg.length; i++) len.push(len[i - 1] + Math.hypot(seg[i][0] - seg[i - 1][0], seg[i][1] - seg[i - 1][1]));
  const T = len[len.length - 1], out = [];
  for (let k = 0; k <= LOOP_N; k++) { const d = k / LOOP_N * T; let i = 1; while (i < seg.length - 1 && len[i] < d) i++; const f = (d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]); out.push([lerp(seg[i - 1][0], seg[i][0], f), lerp(seg[i - 1][1], seg[i][1], f)]); }
  out.total = T; return out;
})();
export const LOOP_LEN = LOOP_PTS.total;
export function loopPt(u) { u = ((u % 1) + 1) % 1; const f = u * LOOP_N, i = Math.floor(f), g = f - i, a = LOOP_PTS[i], b = LOOP_PTS[Math.min(LOOP_N, i + 1)]; return [lerp(a[0], b[0], g), lerp(a[1], b[1], g)]; }
export function loopDir(u) { const a = loopPt(u - .001), b = loopPt(u + .001), l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; }
export const loopU = (X) => clamp((X - (LOOP.cx - LOOP.half + LOOP.r)) / LOOP_LEN);   // u of a point on the straight near edge
// sky: the night (card 40000). o.air: extra fine stars = the prices that became air
export function sky(ctx, c, t, o = {}) {
  card(ctx, c, 40000, () => {
    E.nightSky(ctx, [[0, P.night0], [.55, P.night1], [1, mixHex(P.ind0, P.blue1, .25 + .5 * (o.warm ?? 0))]], -2600, H + 900);
    ctx.fillStyle = rad(ctx, W * .5, H * .95, 1900, [[0, rgba(P.ind1, .85)], [.5, rgba(P.ind1, .3)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-2 * W, -3 * H, 5 * W, 6 * H);
    E.stars(ctx, o.seed ?? 18, o.stars ?? 180, t, [-1500, -2600, W + 1500, H * .62], .75);
    if ((o.air ?? 0) > 0) E.stars(ctx, 181, Math.round(900 * o.air), t, [-1500, -2600, W + 1500, H * .6], .55 * o.air);
  });
}
// the board surface. Ground gradient in screen space (far = a little lifted blue, near = night); the far edge carries the zero line.
export function board(ctx, c, t, o = {}) {
  const { GY, cz, half } = BOARD, sq = [[-half, cz - half], [half, cz - half], [half, cz + half], [-half, cz + half]];
  const poly = projPoly(c, sq); if (poly.length < 3) return;
  const far = wp(c, 0, GY, cz + half), yTop = far ? far[1] : H / 2, warm = o.warm ?? 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath(); poly.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, yTop, 0, Math.max(yTop + 60, H), [[0, mixHex(mixHex(P.ind1, P.blue1, .35), P.shade0, .25 * warm)], [.12, mixHex(P.night1, P.ind1, .5)], [.55, P.night1], [1, P.night0]]);
  ctx.fill();
  if ((o.edge ?? 0) > 0) { ctx.strokeStyle = rgba(P.halo1, .45 * o.edge); ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
  // the zero line: a thin cream-gold line along the far edge, a soft glow above it (the horizon = price zero)
  const z = o.zero ?? 1;
  if (z > 0 && far) {
    const a = wp(c, -half, GY, cz + half), b = wp(c, half, GY, cz + half);
    if (a && b) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, far[1] - 90, 0, far[1] + 6, [[0, rgba(P.blue0, 0)], [.7, rgba(P.blue0, .22 * z)], [1, rgba(P.halo1, .2 * z)]]); ctx.fillRect(Math.min(a[0], b[0]) - 40, far[1] - 90, Math.abs(b[0] - a[0]) + 80, 96);
      ctx.strokeStyle = rgba(mixHex(P.halo2, P.cream, .5), .55 * z); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.restore();
    }
  }
  road(ctx, c, t, o);
}
// the loop road: a ribbon on the ground. base light o.road (0..1), lit segments o.lit [[u0, u1, a]] add warm light, ticks = fields
export function road(ctx, c, t, o = {}) {
  const base = o.road ?? .5, lit = o.lit || [], ticks = o.ticks ?? .5, hw = LOOP.w / 2;
  const ribbon = (w) => { const L = [], R = []; for (let k = 0; k <= LOOP_N; k++) { const [x, z] = LOOP_PTS[k], [dx, dz] = loopDir(k / LOOP_N); L.push([x - dz * w, z + dx * w]); R.push([x + dz * w, z - dx * w]); } return [L, R]; };
  const litAt = (u) => { let s = 0; for (const [u0, u1, a] of lit) { if (u1 - u0 >= 1) s = Math.max(s, a); else { const d = ((u - u0) % 1 + 1) % 1, len = ((u1 - u0) % 1 + 1) % 1; if (d <= len) s = Math.max(s, a * smooth(clamp(d / .012)) * smooth(clamp((len - d) / .012))); } } return s; };
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (const [w, mode] of [[hw * 5, 'glow'], [hw, 'core']]) {
    const [L, R] = ribbon(w);
    for (let k = 0; k < LOOP_N; k++) {
      const a = gp(c, L[k][0], L[k][1]), b = gp(c, L[k + 1][0], L[k + 1][1]), d = gp(c, R[k + 1][0], R[k + 1][1]), e = gp(c, R[k][0], R[k][1]);
      if (!a || !b || !d || !e) continue;
      if (Math.max(a[0], b[0], d[0], e[0]) < -50 || Math.min(a[0], b[0], d[0], e[0]) > W + 50 || Math.min(a[1], b[1], d[1], e[1]) > H + 50) continue;
      const L1 = clamp(base * .55 + litAt(k / LOOP_N));
      if (mode === 'glow') { if (L1 < .05) continue; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo1, .07 * L1); }
      else { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = mixHex(mixHex(P.ind2, P.shade0, .5), mixHex(P.halo0, P.core1, .5), L1); }
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(d[0], d[1]); ctx.lineTo(e[0], e[1]); ctx.closePath(); ctx.fill();
    }
  }
  // field ticks across the road (the board's squares): every 1/40 of the loop, faint
  if (ticks > 0) {
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 40; i++) {
      const u = i / 40, [x, z] = loopPt(u), [dx, dz] = loopDir(u), a = gp(c, x - dz * hw * 2.2, z + dx * hw * 2.2), b = gp(c, x + dz * hw * 2.2, z - dx * hw * 2.2);
      if (!a || !b) continue;
      ctx.strokeStyle = rgba(P.halo1, .28 * ticks * (.4 + .6 * clamp(base + litAt(u)))); ctx.lineWidth = Math.max(.8, 5 * a[2]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
  }
  ctx.restore();
}

// ======================================================================================================================== tag
// The price tag: a pentagon of light (point up, eyelet near the point), hanging from its eyelet (x, y) on a thin gold thread that runs
// up into the dark. The number is printed on it in dark gold ink. Seen as light: gold body (hot core), blue aura, a warm rim.
const TAG_GR = (() => { const r = prng(1818); return Array.from({ length: 260 }, () => [r() - .5, r(), r(), r()]); })();
export function tagPath(w) {
  const h = w * 1.32, p = new Path2D(), hw = w / 2, rr = w * .07;
  p.moveTo(0, -h * .1); p.lineTo(hw, h * .17); p.lineTo(hw, h - rr); p.quadraticCurveTo(hw, h, hw - rr, h); p.lineTo(-hw + rr, h); p.quadraticCurveTo(-hw, h, -hw, h - rr); p.lineTo(-hw, h * .17); p.closePath();
  return p;
}
export function tag(ctx, t, x, y, w, o = {}) {
  const h = w * 1.32, a = o.a ?? 1, cool = clamp(o.cool ?? 0), melt = clamp(o.melt ?? 0), sw = o.swing ?? 0, gl = o.glow ?? 1;
  const out = { eye: [x, y], center: [x + Math.sin(-sw) * h * .55, y + Math.cos(sw) * h * .55], bottom: [x + Math.sin(-sw) * h, y + Math.cos(sw) * h], h };
  if (a <= 0) return out;
  // the thread (never ends in the frame: it hangs from the sky)
  const th = o.thread ?? 3000;
  ctx.save(); ctx.strokeStyle = rgba(mixHex(P.halo1, COOL.mid, cool), .55 * a * (o.threadA ?? 1)); ctx.lineWidth = Math.max(1.2, w * .006);
  ctx.beginPath(); ctx.moveTo(x, y - th); ctx.lineTo(x, y); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.globalAlpha *= a;
  const body = tagPath(w), cut = h * (1 - melt * 1.12);                      // melt: the body is eaten from the bottom up
  const keep = new Path2D(); keep.moveTo(-w, -h); keep.lineTo(w, -h);
  for (let k = 0; k <= 24; k++) { const u = 1 - k / 24, xx = lerp(-w * .6, w * .6, u); keep.lineTo(xx, cut + Math.sin(u * 17 + t * 1.3) * w * .018 * (melt > 0 && melt < 1 ? 1 : 0)); }
  keep.closePath();
  // cooling = the light leaves: the face goes pale blue and dimmer (never a white sheet)
  const c0 = mixHex(mixHex(P.core0, COOL.mid, cool), COOL.deep, cool * .72), c1 = mixHex(mixHex(P.core1, COOL.edge, cool * .85), COOL.deep, cool * .62), c2 = mixHex(P.halo0, COOL.deep, cool * .8), c3 = mixHex(P.halo1, COOL.deep, cool);
  // the glow stays unclipped and fades with the melt (clipping it popped the halo off the moment a melt began)
  glowFill(ctx, body, w * .55 * gl, .5 * a * (1 - melt), mixHex(P.blue0, COOL.deep, cool));
  glowFill(ctx, body, w * .12 * gl, .55 * a * (1 - melt), c2);
  ctx.save(); if (melt > 0) ctx.clip(keep);
  ctx.fillStyle = rad(ctx, 0, h * .5, h * .78, [[0, c0], [.3, c1], [.65, c2], [1, c3]]); ctx.fill(body);
  ctx.strokeStyle = rgba(mixHex(P.shade0, COOL.edge, cool), .55); ctx.lineWidth = w * .012; ctx.stroke(body);
  // the eyelet (a dark ring with a hot rim) and an inner printed border
  ctx.fillStyle = mixHex(P.night1, COOL.deep, cool * .5); ctx.beginPath(); ctx.arc(0, 0, w * .045, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(P.shade0, COOL.edge, cool), .9); ctx.lineWidth = w * .014; ctx.stroke();
  ctx.strokeStyle = rgba(mixHex(P.shade0, COOL.edge, cool), .35); ctx.lineWidth = w * .006; ctx.beginPath();
  ctx.moveTo(0, h * .02); ctx.lineTo(w * .42, h * .2); ctx.lineTo(w * .42, h * .94); ctx.lineTo(-w * .42, h * .94); ctx.lineTo(-w * .42, h * .2); ctx.closePath(); ctx.stroke();
  // the number (ink on light), rising from its baseline
  if (o.text && (o.u ?? 1) > 0) {
    const size = (o.size ?? .36) * w, by = h * .7;
    ctx.save(); ctx.beginPath(); ctx.rect(-w * .45, by - size * 1.05, w * .9, size * 1.32); ctx.clip();
    const k = expoOut(clamp(o.u ?? 1)), sink = o.sink ?? 0;
    ctx.font = `${size}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.fillStyle = mixHex(mixHex(P.shade0, P.night1, .35), COOL.deep, cool);
    ctx.fillText(o.text, 0, by + (1 - k) * size * 1.1 + sink * size * 1.2);
    ctx.restore();
  }
  ctx.restore();
  // the melt edge: hot rim + grains leaving it
  if (melt > 0 && melt < 1) { ctx.save(); ctx.clip(body); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(c1, .8 * clamp(melt * 60)); ctx.lineWidth = w * .02; ctx.filter = `blur(${w * .01}px)`; ctx.stroke(keep); ctx.restore(); }
  for (const [gx, gy, gs, gp2] of TAG_GR) {
    const v = gy * h; if (v < cut || melt <= 0) continue;
    const age = (v - cut) / h * 1.6, yy = v - age * h * (.9 + gp2) - age * age * h * .4, xx = gx * w * (1 + age * .6) + Math.sin(t * 1.1 + gs * 9) * w * .05 * age;
    const al = (1 - clamp(age / 1.5)) * a * clamp(melt * 60); if (al <= 0) continue;
    ctx.fillStyle = rgba(mixHex(P.core1, COOL.core, cool), al); ctx.fillRect(xx, yy, w * .007 + gs * w * .007, w * .007 + gs * w * .007);
  }
  ctx.restore();
  if (o.emit) evap(ctx, t, [[out.bottom[0] - w * .4, out.bottom[1]], [out.bottom[0] + w * .4, out.bottom[1]]], o.emit, { seed: o.seed ?? 3, size: w * .009, rise: h * .9, cool });
  return out;
}
// a deterministic dust stream rising from a polyline: grains are spawned at time slots i / hz; a grain lives if emit(spawn time) beats
// its own threshold; it rises `rise` px over `life` s with a slight sideways sway (stipple, never a blur). pts in caller space.
export function evap(ctx, t, pts, emit, o = {}) {
  const hz = o.hz ?? 40, life = o.life ?? 2.6, rise = o.rise ?? 200, sz = o.size ?? 2.2, seed = o.seed ?? 1, cool = o.cool ?? 0;
  const i1 = Math.floor(t * hz), i0 = Math.floor((t - life) * hz);
  const hsh = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7 + seed * 74.7) * 43758.5453; return x - Math.floor(x); };
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = L[L.length - 1] || 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = i0; i <= i1; i++) {
    const ts = i / hz, e = emit(ts); if (e <= 0 || hsh(i, 1) > e) continue;
    const age = (t - ts) / life; if (age < 0 || age > 1) continue;
    const d = hsh(i, 2) * T; let j = 1; while (j < pts.length - 1 && L[j] < d) j++;
    const f = (d - L[j - 1]) / Math.max(1e-6, L[j] - L[j - 1]), x0 = lerp(pts[j - 1][0], pts[j][0], f), y0 = lerp(pts[j - 1][1], pts[j][1], f);
    const x = x0 + Math.sin(age * 5 + hsh(i, 3) * 6) * rise * .08 * age, y = y0 - rise * (age + .3 * age * age) * (.7 + .6 * hsh(i, 4));
    const al = Math.sin(Math.PI * Math.min(1, age * 1.2)) * (.5 + .5 * hsh(i, 5));
    ctx.fillStyle = rgba(mixHex(P.core1, COOL.core, cool), al); const s = sz * (.6 + hsh(i, 6)); ctx.fillRect(x - s / 2, y - s / 2, s, s);
  }
  ctx.restore();
}

// ======================================================================================================================== coin
// The coin of light, face on (x, y = centre). spin (rad) turns it about its vertical axis (rolling along the road reads as a flip).
// pie: share 0..1 drawn as a lit wedge from 12 o'clock clockwise (the rest dim): the coin becomes a pie (firstPicture).
export function coin(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1, sc = Math.max(.14, Math.abs(Math.cos(o.spin ?? 0))), gl = o.glow ?? 1;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, 1);
  const disc = new Path2D(); disc.arc(0, 0, r, 0, 6.29);
  glowFill(ctx, disc, r * .9 * gl, .45 * a, P.blue0); glowFill(ctx, disc, r * .25 * gl, .6 * a, P.halo0);
  if (o.pie != null) {
    ctx.fillStyle = rad(ctx, 0, 0, r, [[0, mixHex(P.ind2, P.blue1, .4)], [1, P.ind1]]); ctx.fill(disc);
    const s = clamp(o.pie), w = new Path2D(); w.moveTo(0, 0); w.arc(0, 0, r * .97, -Math.PI / 2, -Math.PI / 2 + s * Math.PI * 2); w.closePath();
    ctx.fillStyle = rad(ctx, 0, 0, r, [[0, P.core0], [.45, P.core1], [.8, P.halo0], [1, P.halo1]]); ctx.fill(w);
    if ((o.hi ?? 0) > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glowFill(ctx, w, r * .2, .5 * o.hi, P.halo0); ctx.restore(); }
    ctx.strokeStyle = rgba(P.night0, .6); ctx.lineWidth = r * .02; ctx.stroke(w);
  } else {
    ctx.fillStyle = rad(ctx, -r * .25, -r * .3, r * 1.3, [[0, P.core0], [.35, P.core1], [.75, P.halo0], [1, P.halo1]]); ctx.fill(disc);
    ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = r * .07; ctx.beginPath(); ctx.arc(0, 0, r * .74, 0, 6.29); ctx.stroke();
  }
  ctx.strokeStyle = rgba(P.halo1, .9); ctx.lineWidth = r * .045; ctx.stroke(disc);
  ctx.restore();
  if (sc < .98) { ctx.save(); ctx.fillStyle = rgba(P.shade0, .8 * a); ctx.fillRect(x - r * sc - r * .05, y - r * .96, r * .1, r * 1.92); ctx.restore(); }
}

// ======================================================================================================================== door
// The door: a dark standing slab with a lit doorway (arched top). The doorway light is the scarce thing's price you pay to pass.
// (x, y) = the middle of the sill on the ground; h = doorway height. open 0..1: the dark leaf swings away (it narrows to the left).
export function door(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 1), op = clamp(o.open ?? .35), dw = h * .46, fw = dw * 1.7, fh = h * 1.22;
  ctx.save(); ctx.globalAlpha *= a;
  // the slab (wall piece)
  const slab = new Path2D(); slab.rect(x - fw / 2, y - fh, fw, fh);
  ctx.fillStyle = lin(ctx, x - fw / 2, 0, x + fw / 2, 0, [[0, P.night1], [.5, mixHex(P.night1, P.ind2, .6)], [1, P.night0]]); ctx.fill(slab);
  ctx.strokeStyle = rgba(o.rim ?? P.blue0, .7); ctx.lineWidth = h * .012; ctx.beginPath(); ctx.moveTo(x - fw / 2, y); ctx.lineTo(x - fw / 2, y - fh); ctx.lineTo(x + fw / 2, y - fh); ctx.stroke();
  // the doorway: light
  const dp = new Path2D(); dp.moveTo(x - dw / 2, y); dp.lineTo(x - dw / 2, y - h + dw / 2); dp.arc(x, y - h + dw / 2, dw / 2, Math.PI, 0); dp.lineTo(x + dw / 2, y); dp.closePath();
  glowFill(ctx, dp, h * .5, .45 * lit * a, P.blue0); glowFill(ctx, dp, h * .14, .7 * lit * a, P.halo0);
  ctx.fillStyle = rad(ctx, x, y - h * .38, h * .8, [[0, mixHex(P.night1, P.core0, lit)], [.35, mixHex(P.night1, P.core1, lit)], [.75, mixHex(P.night1, P.halo0, lit)], [1, mixHex(P.night1, P.halo1, lit)]]); ctx.fill(dp);
  // the leaf (dark, swinging open: it narrows toward the hinge on the left)
  if (op < 1) {
    ctx.save(); ctx.clip(dp); const lw = dw * (1 - op);
    ctx.fillStyle = lin(ctx, x - dw / 2, 0, x - dw / 2 + lw, 0, [[0, P.night0], [1, mixHex(P.night1, P.ind2, .5)]]); ctx.fillRect(x - dw / 2, y - h - 2, lw, h + 4);
    ctx.fillStyle = rgba(P.halo1, .8 * lit); ctx.beginPath(); ctx.arc(x - dw / 2 + lw * .85, y - h * .45, h * .012, 0, 6.29); ctx.fill();
    ctx.restore();
  }
  // the light spilling out over the sill
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(1, .16);
  ctx.fillStyle = rad(ctx, 0, 0, h * .9, [[0, rgba(P.halo1, .4 * lit * op + .1 * lit)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, h * .9, 0, 6.29); ctx.fill(); ctx.restore();
  ctx.restore();
  return { hook: [x, y - fh - h * .05], sill: [x, y], top: [x, y - h] };
}

// ======================================================================================================================== the two records
// "The first picture" (c02 2.05–2.06, called back in c07 7.01): two coins of light in the sky. Exactly this composition both times.
// Left: of every sales dollar, the profit kept (17.0 %, the slice lit) · right: of what business produced, your slice (52.8 %).
// The two are DIFFERENT measures (faktenzettel A): two coins, never one pie. o: { x, y (centre), uL, uR (0..1 grow/rise),
// hiL, hiR (slice glow), a, date 0..1 (the shared stamp "SAME THREE MONTHS · Q2 2026" rises) }
export const FIRST = { profit: .170, work: .528 };
export function firstPicture(ctx, t, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 440, a = o.a ?? 1, r = 150, dx = 400;
  const parts = [
    { u: o.uL ?? 1, hi: o.hiL ?? 0, cx: x - dx, share: FIRST.profit, num: '17.0 %', l1: 'PROFIT KEPT PER SALES DOLLAR', l2: 'HIGHEST SINCE 2009', src: 'S&P 500 · FACTSET' },
    { u: o.uR ?? 1, hi: o.hiR ?? 0, cx: x + dx, share: FIRST.work, num: '52.8 %', l1: 'WORKERS’ SHARE OF OUTPUT', l2: 'LOWEST SINCE 1947', src: 'U.S. BUSINESS SECTOR · BLS' },
  ];
  ctx.save(); ctx.globalAlpha *= a;
  for (const p of parts) {
    if (p.u <= 0) continue;
    const g = expoOut(clamp(p.u * 1.2));
    coin(ctx, t, p.cx, y, r * (.4 + .6 * g), { pie: p.share * smooth(span(p.u, .25, 1)), hi: p.hi });
    const tu = rise(span(p.u, .35, 1));
    if (tu > 0) {
      maskLine(ctx, [[p.num, p.hi]], p.cx, y - r - 46, 96, tu, { align: 'center' });
      maskLine(ctx, [[p.l1, 0]], p.cx, y + r + 64, 28, tu, { serif: false, align: 'center', glow: false });
      maskLine(ctx, [[p.l2, 0]], p.cx, y + r + 104, 28, tu, { serif: false, align: 'center', col: P.halo0, glow: false });
      maskLine(ctx, [[p.src, 0]], p.cx, y + r + 140, 21, tu, { serif: false, align: 'center', col: P.halo2, glow: false });
    }
  }
  const du = rise(clamp(o.date ?? 0));
  if (du > 0) maskLine(ctx, [['SAME THREE MONTHS · APRIL–JUNE 2026', 0]], x, y + 8, 24, du, { serif: false, align: 'center', col: P.halo2, glow: false });
  ctx.restore();
}

// ======================================================================================================================== rule card
// Lizzie Magie's two sets of rules as two cards of light (c08, c09, c11). (x, y) = centre. o: { n 'I' | 'II', sub, u (rise), a, glow }
export function ruleCard(ctx, t, x, y, w, o = {}) {
  const h = w * .62, a = o.a ?? 1, u = clamp(o.u ?? 1), k = expoOut(u), gl = o.glow ?? (o.n === 'II' ? 1 : .55);
  if (u <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + (1 - k) * h * .25);
  const p = new Path2D(); p.roundRect(-w / 2, -h / 2, w, h, w * .03);
  glowFill(ctx, p, w * .25 * gl, .5 * a, P.blue0); glowFill(ctx, p, w * .05 * gl, .5 * a, P.halo0);
  ctx.fillStyle = rad(ctx, 0, -h * .1, w * .75, o.n === 'II' ? [[0, P.core0], [.5, P.core1], [1, P.halo0]] : [[0, mixHex(P.halo1, P.ind2, .35)], [1, mixHex(P.shade0, P.night1, .45)]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.shade0, .7); ctx.lineWidth = w * .006; ctx.strokeRect(-w / 2 + w * .04, -h / 2 + w * .04, w - w * .08, h - w * .08);
  // a small loop glyph (the road) and the title
  ctx.strokeStyle = rgba(mixHex(P.shade0, P.night1, .3), .85); ctx.lineWidth = w * .012; ctx.beginPath(); ctx.roundRect(-w * .06, -h * .36, w * .12, w * .12, w * .025); ctx.stroke();
  ctx.font = `${w * .13}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.fillStyle = mixHex(P.shade0, P.night1, .35);
  ctx.fillText(`Rules ${o.n ?? 'I'}`, 0, h * .12);
  if (o.sub) { ctx.font = `600 ${w * .038}px Inter`; ctx.letterSpacing = '0.18em'; ctx.fillText(o.sub.toUpperCase(), 0, h * .3); }
  ctx.restore();
  return { rect: [x - w / 2, y - h / 2, w, h] };
}

// ======================================================================================================================== machine light
// The machine (A.I.) is never a robot or a brain: a cool blue-cream light. disc: a small cold light low on the horizon (c01).
export function coolDisc(ctx, x, y, r, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, x, y, r * 6, [[0, rgba(COOL.mid, .35 * a)], [.3, rgba(COOL.edge, .14 * a)], [1, rgba(COOL.deep, 0)]]); ctx.fillRect(x - r * 6, y - r * 6, r * 12, r * 12);
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = rad(ctx, x, y, r, [[0, COOL.core], [.6, mixHex(COOL.core, COOL.mid, .5)], [1, COOL.mid]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill(); ctx.restore();
}
export const coolLight = COOL;

// ======================================================================================================================== house
// A small flat house silhouette (the board's places: your home, the town round the loop). Origin = middle of its base (stand()).
// o: { roof 0..1 (pitch), win: number of windows 0..3, lit 0..1 (window light), door 0..1 (door light), seed, rim }
export function house(ctx, t, w, h, o = {}) {
  const lit = o.lit ?? .6, roof = h * (o.roof ?? .45), x0 = -w / 2;
  const p = new Path2D(); p.moveTo(x0, 0); p.lineTo(x0, -h); p.lineTo(0, -h - roof); p.lineTo(-x0, -h); p.lineTo(-x0, 0); p.closePath();
  ctx.fillStyle = lin(ctx, x0, 0, -x0, 0, [[0, P.night1], [.55, mixHex(P.night1, P.ind2, .55)], [1, P.ind1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(o.rim ?? P.blue0, .7); ctx.lineWidth = Math.max(2, w * .012); ctx.beginPath(); ctx.moveTo(x0, -h); ctx.lineTo(0, -h - roof); ctx.lineTo(-x0, -h); ctx.stroke();
  const n = o.win ?? 2, r = prng(o.seed ?? 7);
  for (let i = 0; i < n; i++) {
    const ww = w * .2, wh = h * .3, wx = x0 + w * (i + .5) / (n + .4) - ww / 2 + w * .05, wy = -h * .72;
    const fl = lit * (.85 + .15 * Math.sin(t * (.7 + r()) + r() * 6));
    const wp2 = new Path2D(); wp2.rect(wx, wy, ww, wh);
    if (fl > .05) glowFill(ctx, wp2, ww * .8, .4 * fl, P.halo0);
    ctx.fillStyle = mixHex(P.night0, mixHex(P.halo0, P.core1, .4), fl); ctx.fill(wp2);
  }
  ctx.fillStyle = mixHex(P.night0, P.halo1, .5 * (o.door ?? 0)); ctx.fillRect(-x0 - w * .3, -h * .5, w * .16, h * .5);
}
