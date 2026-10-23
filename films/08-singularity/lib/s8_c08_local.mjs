// Film 8 · c08 local pieces (owner B2): the North Star and the wheeling sky (c08.03), the 1948 hall in Paris (c08.04–08), the horizon
// light's beam and the amber buoys (c08.09–11), the lighthouse (c08.12), the coast with the lock and the lagoons (c08.13–15), the harbour
// post with its rule sheets, candle, frost and pen (c08.16–19), your note (c08.20–21). World pieces in metres (s8 camera, +Y up).
//
//   starTrails(ctx, t, C, o)          silver star trails round the pole. o: { pole: [az, el], n 320, arc (rad of trail), a, seed }
//   poleStar(ctx, C, pole, a)         Hōkūpaʻa: one still, bright star
//   eiffel(ctx, C, az, s, a)          the tower far off (sky directions, at infinity): s = height in rad
//   roofs(ctx, t, C, o)               Paris rooftops with chimneys, a band of silhouettes at z0..z1 (o: { x0, x1, z, seed, lit })
//   facade(ctx, t, C, o)              the hall's back wall at Z = o.z (windows lit from inside: o.inside(ctx) is drawn clipped to the panes)
//   hallRoom(ctx, t, C, o)            inside: floor, walls, the front wall with tall windows and the dais
//   longTable(ctx, t, C, o)           one long table (x0..x1 at z, top .76), its baize skirt facing you, lamps; → lamp screen points
//   chairBack(ctx, C, x, z, s)        a chair's back (seen from behind) in front of a seated delegate
//   heavyBook(ctx, t, C, o)           a heavy law book lying open; o.close 0..1 shuts it (the left half turns over the spine), o.dx slides it
//   beamFan(ctx, t, C, o)             a cool beam over the water from O = [x, z] toward ang (0 = +Z), half width, length; o.y beam height
//   buoyLine(ctx, t, C, pts, o)       amber buoys on a rope (world [x, z] list), o: { a, flare }
//   lighthouse(ctx, t, C, o)          a lighthouse on a rock: o: { x, z, h, ang (beam), a (beam), len }
//   land(ctx, t, C, poly, o)          a dark land mass at y = o.y (quay height) with its quay edge catching the light
//   sleek(ctx, t, C, o)               the new vessel: low, sleek, a cool strip light. o: { x, z, head, L, glow }
//   candle(ctx, t, C, p, o)           a candle on the post's bracket: o: { h 0..1 (how much is left), on, gust, outT }
//   frost(g, W, H, u, seed)           frost on a sheet (plate space), u 0..1 grows it from the edges; ice(g, W, H, u, crack) the sheen and cracks
//   ruleText(g, t, W, H, o)           the rule sheet: heading, handwriting lines, the date stamp; o: { title, stamp, amend 0..1, seed }
//   hand note: noteText(g, t, W, H, u)   "When will this rule be reviewed?" in your hand (u = how much is written) → pen point
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projPoly, projRuns, fillPoly, mixHex, hash, nz, eoX } from './s8_kit.mjs';
import { skyDir } from './s8_sky.mjs';
import { scribble } from './paper.mjs';

const runs = (ctx, C, pts, col, lw, near = .3) => { for (const run of projRuns(C, pts, near)) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } };

// ---------------------------------------------------------------- the wheeling sky
const STARS = (() => { const r = prng(808), a = []; for (let i = 0; i < 420; i++) a.push({ d: Math.acos(1 - r() * (1 - Math.cos(1.45))), th: r() * TAU, b: Math.pow(r(), 2.2), tw: r() * 6 }); return a; })();
function poleBasis(pole) {
  const p = skyDir(pole[0], pole[1]);
  let e1 = [p[2], 0, -p[0]]; const n1 = Math.hypot(...e1) || 1; e1 = e1.map((v) => v / n1);
  const e2 = [p[1] * e1[2] - p[2] * e1[1], p[2] * e1[0] - p[0] * e1[2], p[0] * e1[1] - p[1] * e1[0]];
  return { p, e1, e2 };
}
export function starTrails(ctx, t, C, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const { p, e1, e2 } = poleBasis(o.pole), arc = o.arc ?? .4, n = Math.min(STARS.length, o.n ?? 320), rot = o.rot ?? 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const s = STARS[i], cd = Math.cos(s.d), sd = Math.sin(s.d), seg = Math.max(2, Math.ceil(arc * sd * 18)), pts = [];
    for (let k = 0; k <= seg; k++) {
      const th = s.th + rot - arc * (1 - k / seg), c = Math.cos(th), sn = Math.sin(th);
      const d = [0, 1, 2].map((j) => cd * p[j] + sd * (c * e1[j] + sn * e2[j]));
      if (d[1] < .01) { pts.length = 0; continue; }
      const q = C.D(...d); if (q) pts.push(q);
    }
    if (pts.length < 2) continue;
    const head = pts[pts.length - 1]; if (head[0] < -200 || head[0] > 2120 || head[1] < -200 || head[1] > 1280) continue;
    const al = (.1 + .5 * s.b) * a * (.55 + .45 / (1 + arc * sd * 1.2));
    ctx.strokeStyle = rgba('#dfe6ff', al * .8); ctx.lineWidth = .8 + 1.2 * s.b;
    ctx.beginPath(); pts.forEach((q, k) => (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
    ctx.fillStyle = rgba('#f4f6ff', Math.min(1, al * 1.6)); ctx.beginPath(); ctx.arc(head[0], head[1], .9 + 1.3 * s.b, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
export function poleStar(ctx, C, pole, a = 1) {
  const q = C.D(...skyDir(pole[0], pole[1])); if (!q || a <= 0) return null;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 70); g.addColorStop(0, rgba('#ffffff', .9 * a)); g.addColorStop(.12, rgba('#dfe9ff', .35 * a)); g.addColorStop(1, rgba('#9fb4ff', 0));
  ctx.fillStyle = g; ctx.fillRect(q[0] - 70, q[1] - 70, 140, 140);
  ctx.strokeStyle = rgba('#eef3ff', .55 * a); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(q[0] - 34, q[1]); ctx.lineTo(q[0] + 34, q[1]); ctx.moveTo(q[0], q[1] - 34); ctx.lineTo(q[0], q[1] + 34); ctx.stroke();
  ctx.fillStyle = rgba('#ffffff', a); ctx.beginPath(); ctx.arc(q[0], q[1], 3.2, 0, TAU); ctx.fill();
  ctx.restore(); return q;
}

// ---------------------------------------------------------------- Paris 1948: the tower, the roofs, the hall
export function eiffel(ctx, C, az, s, a = 1) {
  // a lattice silhouette in sky directions (u across in rad, v up in rad)
  const P = (u, v) => C.D(...skyDir(az + u, v));
  const prof = [[.5, 0], [.36, .12], [.22, .3], [.15, .45], [.09, .68], [.05, .9], [.02, 1]];
  const L = prof.map(([w, h]) => P(-w * s * .42, h * s)), R = prof.map(([w, h]) => P(w * s * .42, h * s)).reverse();
  const poly = [...L, ...R]; if (poly.some((q) => !q)) return;
  ctx.save(); ctx.fillStyle = rgba('#0b0b16', a); ctx.beginPath(); poly.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill();
  // the arch under the first platform (cut in the sky colour), a faint lattice
  const A0 = P(-.25 * s * .42, 0), A1 = P(0, .09 * s), A2 = P(.25 * s * .42, 0);
  if (A0 && A1 && A2) { ctx.fillStyle = rgba('#14162a', a); ctx.beginPath(); ctx.moveTo(A0[0], A0[1]); ctx.quadraticCurveTo(A1[0], A1[1] - (A0[1] - A1[1]) * .4, A2[0], A2[1]); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = rgba('#3a3c5a', .5 * a); ctx.lineWidth = 1; ctx.beginPath(); for (let k = 1; k < 9; k++) { const v = k / 10, w = .5 - .48 * Math.sqrt(v), q0 = P(-w * s * .42, v * s), q1 = P(w * s * .42, v * s); if (q0 && q1) { ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); } } ctx.stroke();
  const top = P(0, s); if (top) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(top[0], top[1], 0, top[0], top[1], 16); g.addColorStop(0, rgba('#ffd9a0', .9 * a)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(top[0] - 16, top[1] - 16, 32, 32); }
  ctx.restore();
}
export function roofs(ctx, t, C, o = {}) {
  const r = prng(o.seed ?? 21), x0 = o.x0 ?? -200, x1 = o.x1 ?? 200, Z = o.z ?? 120, pts = [[x0, -1, Z]];
  const chims = [], wins = [];
  for (let x = x0; x <= x1;) { const w = 6 + r() * 12, h = 14 + r() * 9, m = 2 + r() * 2.5; pts.push([x, h, Z], [x + m, h + 3.5, Z], [x + w - m, h + 3.5, Z], [x + w, h, Z]); if (r() < .7) chims.push([x + w * (.2 + .6 * r()), h + 3.5, Z, 1 + r()]); for (let k = 0; k < 3; k++) if (r() < .35) wins.push([x + w * (.2 + .6 * r()), h * (.3 + .55 * r()), Z - .1]); x += w; }
  pts.push([x1, -1, Z]);
  ctx.save(); fillPoly(ctx, projPoly(C, pts), '#0d0c18');
  for (const [x, y, z, w] of chims) fillPoly(ctx, projPoly(C, [[x, y - .5, z], [x + w, y - .5, z], [x + w, y + 2.2, z], [x, y + 2.2, z]]), '#0d0c18');
  const lit = o.lit ?? 1; for (const [x, y, z] of wins) { const p = C.P(x, y, z); if (p) { ctx.fillStyle = rgba('#ffcf8a', .7 * lit); ctx.fillRect(p[0], p[1], Math.max(1.5, p[2] * 1), Math.max(2, p[2] * 1.4)); } }
  ctx.restore();
}
// the hall's back wall (you come in through one of its tall windows)
export const HALL = { x0: -24, x1: 24, h: 20, win: [-15, -9, -3, 3, 9, 15], ww: 3.6, wy0: 2.6, wy1: 13.5, front: 38, tables: [6.5, 10.5, 14.5, 18.5, 22.5, 26.5] };
export function winQuad(cx, Z = 0) { const w = HALL.ww / 2; return [[cx - w, HALL.wy1, Z], [cx + w, HALL.wy1, Z], [cx + w, HALL.wy0, Z], [cx - w, HALL.wy0, Z]]; }
export function facade(ctx, t, C, o = {}) {
  const Z = o.z ?? 0, { x0, x1, h } = HALL;
  // the esplanade in front
  fillPoly(ctx, projPoly(C, [[x0 - 60, 0, Z - 120], [x1 + 60, 0, Z - 120], [x1 + 60, 0, Z], [x0 - 60, 0, Z]]), '#0a0a14');
  for (let k = 0; k < 14; k++) runs(ctx, C, [[x0 - 60, .01, Z - 4 - k * 6], [x1 + 60, .01, Z - 4 - k * 6]], rgba('#2a2a44', .35), 1);
  // the stone wall with its cornice and pilasters (engraved)
  const W = projPoly(C, [[x0, 0, Z], [x1, 0, Z], [x1, h, Z], [x0, h, Z]]);
  if (W.length > 2) { fillPoly(ctx, W); const ys = W.map((p) => p[1]), g = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys)); g.addColorStop(0, '#1b1a28'); g.addColorStop(1, '#2a2634'); ctx.fillStyle = g; ctx.fill(); }
  for (const y of [1.2, 15.2, 18.6, 19.4]) runs(ctx, C, [[x0, y, Z - .05], [x1, y, Z - .05]], rgba('#4a465e', .7), 1.4);
  for (let x = x0 + 3; x < x1; x += 6) runs(ctx, C, [[x, 1.2, Z - .05], [x, 15.2, Z - .05]], rgba('#0c0c16', .55), 2);
  for (let y = 2; y < 15; y += 1.1) runs(ctx, C, [[x0, y, Z - .03], [x1, y, Z - .03]], rgba('#0c0c16', .25), 1);
  // the windows: the hall inside, warm, through old glass (drawn by the caller), then mullions and the warm spill on the stone
  for (const cx of HALL.win) {
    const Q = projPoly(C, winQuad(cx, Z - .02)); if (Q.length < 3) continue;
    ctx.save(); fillPoly(ctx, Q, '#2a1c14'); ctx.clip(); if (o.inside) o.inside(ctx); ctx.restore();
    const g = projPoly(C, winQuad(cx, Z - .03)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; fillPoly(ctx, g); ctx.fillStyle = rgba('#ffb35c', .06); ctx.fill(); ctx.restore();
    const w = HALL.ww / 2, { wy0, wy1 } = HALL;
    for (const xx of [cx - w / 3, cx + w / 3]) runs(ctx, C, [[xx, wy0, Z - .04], [xx, wy1, Z - .04]], '#100c10', 3);
    for (let y = wy0 + 1.6; y < wy1; y += 1.6) runs(ctx, C, [[cx - w, y, Z - .04], [cx + w, y, Z - .04]], '#100c10', 2.4);
    runs(ctx, C, [[cx - w, wy1, Z - .04], [cx + w, wy1, Z - .04], [cx + w, wy0, Z - .04], [cx - w, wy0, Z - .04], [cx - w, wy1, Z - .04]], '#0c0a10', 5);
    runs(ctx, C, [[cx - w - .3, wy0 - .15, Z - .06], [cx + w + .3, wy0 - .15, Z - .06]], rgba('#ffcf8a', .35), 2);
  }
  // two street lamps on the esplanade
  for (const lx of [-20, 20]) { const a = C.P(lx, 0, Z - 9), b = C.P(lx, 4.2, Z - 9); if (!a || !b) continue; ctx.strokeStyle = '#06060c'; ctx.lineWidth = Math.max(1, b[2] * .14); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = Math.max(10, b[2] * 3), g = ctx.createRadialGradient(b[0], b[1], 0, b[0], b[1], R); g.addColorStop(0, rgba('#fff1d6', .9)); g.addColorStop(.15, rgba('#ffb35c', .35)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.fillRect(b[0] - R, b[1] - R, 2 * R, 2 * R); ctx.restore(); }
}
export function hallRoom(ctx, t, C, o = {}) {
  const { x0, x1, front } = HALL, H = 16, lv = o.lv ?? 1;
  ctx.fillStyle = '#0b0910'; ctx.fillRect(0, 0, 1920, 1080);
  // the front wall: tall dark windows with night blue, the dais and a long table of the chair
  const FW = projPoly(C, [[x0, 0, front], [x1, 0, front], [x1, H, front], [x0, H, front]]); if (FW.length > 2) { fillPoly(ctx, FW); const ys = FW.map((p) => p[1]); const g = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys)); g.addColorStop(0, '#0e0c16'); g.addColorStop(1, '#2a1e1c'); ctx.fillStyle = g; ctx.fill(); }
  for (const cx of [-14, -7, 0, 7, 14]) { fillPoly(ctx, projPoly(C, [[cx - 1.6, 13, front - .05], [cx + 1.6, 13, front - .05], [cx + 1.6, 3.5, front - .05], [cx - 1.6, 3.5, front - .05]]), '#141a34'); runs(ctx, C, [[cx, 3.5, front - .06], [cx, 13, front - .06]], '#0a0a12', 2); for (let y = 5; y < 13; y += 1.6) runs(ctx, C, [[cx - 1.6, y, front - .06], [cx + 1.6, y, front - .06]], '#0a0a12', 1.5); }
  fillPoly(ctx, projPoly(C, [[-12, 0, front - 4], [12, 0, front - 4], [12, 1.1, front - 4], [-12, 1.1, front - 4]]), '#1a1216');
  fillPoly(ctx, projPoly(C, [[-12, 1.1, front - 4], [12, 1.1, front - 4], [12, 1.1, front], [-12, 1.1, front]]), '#2a1e1a');
  // side walls with pilasters, the floor (parquet lines toward the dais)
  for (const sx of [x0, x1]) { const S = projPoly(C, [[sx, 0, 0], [sx, 0, front], [sx, H, front], [sx, H, 0]]); if (S.length > 2) fillPoly(ctx, S, '#120e14'); for (let z = 3; z < front; z += 5) runs(ctx, C, [[sx, 0, z], [sx, H, z]], rgba('#2a2228', .8), 2); }
  const FL = projPoly(C, [[x0, 0, 0], [x1, 0, 0], [x1, 0, front], [x0, 0, front]]); if (FL.length > 2) fillPoly(ctx, FL, '#16100e');
  for (let x = x0; x <= x1; x += 1.2) runs(ctx, C, [[x, .005, .5], [x, .005, front]], rgba('#2e221c', .55), 1);
  // the warm haze of many lamps (a pool of light over the tables)
  const A = C.plane([0, .8, 16], [1, 0, 0], [0, 0, 1]);
  if (A) { ctx.save(); ctx.transform(...A); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 22); g.addColorStop(0, rgba('#ffb35c', .1 * lv)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(-22, -22, 44, 44); ctx.restore(); }
}
// one long table: top .76, depth .8 (z ± .4), baize skirt toward you, brass lamps with green shades
export function longTable(ctx, t, C, o) {
  const { x0, x1, z } = o, y = .76, d = .4, out = [];
  const top = projPoly(C, [[x0, y, z + d], [x1, y, z + d], [x1, y, z - d], [x0, y, z - d]]); if (top.length > 2) fillPoly(ctx, top, '#3a2618');
  const sk = projPoly(C, [[x0, y, z - d], [x1, y, z - d], [x1, .05, z - d], [x0, .05, z - d]]); if (sk.length > 2) fillPoly(ctx, sk, '#14241c');
  runs(ctx, C, [[x0, y, z - d], [x1, y, z - d]], rgba('#ffcf8a', .45), 1.4);
  const lamps = o.lamps || [];
  for (const lx of lamps) {
    const pool = C.plane([lx, y + .002, z + .05], [1, 0, 0], [0, 0, 1]);
    if (pool) { ctx.save(); ctx.transform(...pool); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, .9); g.addColorStop(0, rgba('#ffd9a0', .5)); g.addColorStop(.5, rgba('#ffb35c', .14)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(-.9, -.9, 1.8, 1.8); ctx.restore(); }
    const b = C.P(lx, y, z + .2), s = C.P(lx, y + .36, z + .2); if (!b || !s) continue; const k = s[2];
    ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = Math.max(1, .02 * k); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(s[0], s[1]); ctx.stroke();
    ctx.fillStyle = '#1e4a32'; ctx.beginPath(); ctx.moveTo(s[0] - .13 * k, s[1] + .05 * k); ctx.lineTo(s[0] + .13 * k, s[1] + .05 * k); ctx.lineTo(s[0] + .08 * k, s[1] - .04 * k); ctx.lineTo(s[0] - .08 * k, s[1] - .04 * k); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba('#7ad0a0', .5); ctx.lineWidth = 1; ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = Math.max(6, .5 * k), g = ctx.createRadialGradient(s[0], s[1] + .06 * k, 0, s[0], s[1] + .06 * k, R); g.addColorStop(0, rgba('#fff1d6', .8)); g.addColorStop(.2, rgba('#ffb35c', .25)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(s[0] - R, s[1] - R, 2 * R, 2 * R); ctx.restore();
    out.push([s[0], s[1] + .06 * k]);
  }
  return out;
}
export function chairBack(ctx, C, x, z, lit) {
  const a = C.P(x - .22, .45, z), b = C.P(x + .22, 1.02, z); if (!a || !b) return;
  const Q = projPoly(C, [[x - .22, .42, z], [x + .22, .42, z], [x + .2, 1.0, z], [x - .2, 1.0, z]]); fillPoly(ctx, Q, '#1c120c');
  runs(ctx, C, [[x - .2, 1.0, z - .01], [x + .2, 1.0, z - .01]], rgba('#ffcf8a', .3 * (lit ?? 1)), 1.2);
  runs(ctx, C, [[x - .16, .5, z - .01], [x - .16, .95, z - .01]], rgba('#3a2618', .8), 1);
  runs(ctx, C, [[x + .16, .5, z - .01], [x + .16, .95, z - .01]], rgba('#3a2618', .8), 1);
}
// a heavy law book lying open on the table; close turns the left half over the spine; dx slides the closed book away
export function heavyBook(ctx, t, C, o) {
  const w = o.w ?? .22, d = o.d ?? .3, th = o.th ?? .045, y = o.y ?? .76, cx = (o.x ?? 0) + (o.dx ?? 0), cz = o.z ?? 0, cl = clamp(o.close ?? 0), phi = Math.PI * cl;
  const spine = cx, P = (x, yy, z) => [x, yy, z];
  // the right half: page block + its cover
  fillPoly(ctx, projPoly(C, [P(spine, y, cz - d / 2), P(spine + w, y, cz - d / 2), P(spine + w, y + th * .5, cz - d / 2), P(spine, y + th * .5, cz - d / 2)]), '#d8c8a4');
  const RT = projPoly(C, [P(spine, y + th * .5, cz + d / 2), P(spine + w, y + th * .5, cz + d / 2), P(spine + w, y + th * .5, cz - d / 2), P(spine, y + th * .5, cz - d / 2)]);
  if (RT.length > 2) { fillPoly(ctx, RT, '#ece0c4'); for (let k = 0; k < 14; k++) { const zz = cz + d / 2 - .03 - k * (d - .06) / 13; runs(ctx, C, [[spine + .02, y + th * .5 + .001, zz], [spine + w - .03, y + th * .5 + .001, zz]], rgba('#2a2420', .35), 1); } }
  // the left half: hinged on the spine, angle phi (0 open flat to the left, π closed on top)
  const L = (u, v, z) => [spine - Math.cos(phi) * u, y + th * .5 + Math.sin(phi) * u + v, z];
  const faceUp = phi < Math.PI / 2;
  const Q = projPoly(C, [L(0, 0, cz + d / 2), L(w, 0, cz + d / 2), L(w, 0, cz - d / 2), L(0, 0, cz - d / 2)]);
  if (Q.length > 2) {
    fillPoly(ctx, Q, faceUp ? '#e6dabc' : '#3a1a14');
    if (!faceUp) { ctx.save(); fillPoly(ctx, Q); ctx.clip(); const c = Q.reduce((s, p) => [s[0] + p[0] / Q.length, s[1] + p[1] / Q.length], [0, 0]); const k = Q[0][2]; ctx.strokeStyle = rgba('#d8a84a', .8); ctx.lineWidth = Math.max(1, k * .006); ctx.strokeRect(c[0] - w * k * .32, c[1] - d * k * .2, w * k * .64, d * k * .4); ctx.fillStyle = rgba('#d8a84a', .85); ctx.fillRect(c[0] - w * k * .2, c[1] - d * k * .05, w * k * .4, Math.max(1, k * .008)); ctx.fillRect(c[0] - w * k * .14, c[1] + d * k * .03, w * k * .28, Math.max(1, k * .006)); ctx.restore(); }
    else for (let k = 0; k < 14; k++) { const zz = cz + d / 2 - .03 - k * (d - .06) / 13; runs(ctx, C, [L(.03, .001, zz), L(w - .02, .001, zz)], rgba('#2a2420', .3), 1); }
  }
  // the spine's rim of light
  runs(ctx, C, [[spine, y + th * .5, cz - d / 2], [spine, y + th * .5, cz + d / 2]], rgba('#ffcf8a', .4), 1.2);
}

// ---------------------------------------------------------------- the beam, the buoys, the lighthouse
export function beamFan(ctx, t, C, o) {
  const a = o.a ?? 1; if (a <= 0) return;
  const [X, Z] = o.O, ang = o.ang, hw = o.half ?? .03, L = o.len ?? 3000, y = o.y ?? .1, col = o.col || '#8fe6ff';
  const P = (da, r, yy = y) => [X + Math.sin(ang + da) * r, yy, Z + Math.cos(ang + da) * r];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const rr = [o.r0 ?? 20, L * .25, L * .55, L];
  for (let i = 0; i < 3; i++) {
    const r0 = rr[i], r1 = rr[i + 1];
    for (const [f, al, c] of [[1, .22, col], [.7, .25, col], [.45, .3, col], [.25, .45, '#e6fbff'], [.1, .7, '#ffffff']]) {
      const Q = projPoly(C, [P(-hw * f, r0), P(hw * f, r0), P(hw * f, r1), P(-hw * f, r1)], .5);
      if (Q.length > 2) { fillPoly(ctx, Q); ctx.fillStyle = rgba(c, (o.k ?? .14) * al * a * (1 - i * .2)); ctx.fill(); }
    }
  }
  // the beam in the air above the water (a thin bright band seen edge-on)
  if (o.air) runs(ctx, C, [P(0, rr[0], o.air), P(0, L * .4, o.air * .4), P(0, L, .2)], rgba('#e6fbff', .35 * a), 2, .5);
  ctx.restore();
}
export function buoyLine(ctx, t, C, pts, o = {}) {
  const a = o.a ?? 1, fl = o.flare || 0; if (a <= 0) return [];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  runs(ctx, C, pts.map(([x, z]) => [x, .25, z]), rgba('#ff9a4a', .25 * a), 4); runs(ctx, C, pts.map(([x, z]) => [x, .25, z]), rgba('#ffd9a0', .7 * a), 1.2);
  ctx.restore();
  const L = []; pts.forEach(([x, z], i) => { const p = C.P(x, .5 + .1 * Math.sin(t * 1.7 + i), z); if (p) L.push([p[0], p[1], Math.max(1.4, p[2] * .5) * (1 + 1.2 * fl), hash(i * 3.1)]); });
  return L;
}
export function lighthouse(ctx, t, C, o) {
  const X = o.x, Z = o.z, h = o.h ?? 24, r = o.r ?? 2.4;
  // the rock
  const rock = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU; rock.push([X + Math.sin(a) * r * 3.2 * (1 + .2 * Math.sin(a * 3)), .1, Z + Math.cos(a) * r * 3.2]); }
  fillPoly(ctx, projPoly(C, rock), '#0c0c16');
  // the tower: a tapered shaft, banded, the lantern room on top
  const b = C.P(X, 0, Z), tp = C.P(X, h, Z); if (!b || !tp) return null;
  const kb = b[2], kt = tp[2];
  ctx.save();
  ctx.fillStyle = '#1e1c2a'; ctx.beginPath(); ctx.moveTo(b[0] - r * kb, b[1]); ctx.lineTo(tp[0] - r * .62 * kt, tp[1]); ctx.lineTo(tp[0] + r * .62 * kt, tp[1]); ctx.lineTo(b[0] + r * kb, b[1]); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); for (let k = 1; k < 4; k++) { const p = C.P(X, h * k / 4, Z); if (p) { ctx.fillStyle = rgba('#5a2a2a', .7); ctx.fillRect(p[0] - r * p[2], p[1] - h * .05 * p[2], 2 * r * p[2], h * .1 * p[2]); } } const g = ctx.createLinearGradient(b[0] - r * kb, 0, b[0] + r * kb, 0); g.addColorStop(0, 'rgba(255,207,138,.18)'); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.4)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
  const lr = C.P(X, h + 1.6, Z); ctx.fillStyle = '#0a0a12'; ctx.fillRect(tp[0] - r * .8 * kt, tp[1] - 3.4 * kt, r * 1.6 * kt, .6 * kt);
  ctx.restore();
  const L = lr || tp;
  // the lamp
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = Math.max(14, 4 * L[2]), g2 = ctx.createRadialGradient(L[0], L[1], 0, L[0], L[1], R); g2.addColorStop(0, rgba('#fff6e2', 1)); g2.addColorStop(.15, rgba('#ffd9a0', .6)); g2.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g2; ctx.fillRect(L[0] - R, L[1] - R, 2 * R, 2 * R); ctx.restore();
  if ((o.a ?? 1) > 0) beamFan(ctx, t, C, { O: [X, Z], ang: o.ang ?? 0, half: o.half ?? .05, len: o.len ?? 1400, y: h + 1.6, r0: 2, col: '#ffe6b8', k: .1, a: o.a ?? 1, air: 0 });
  return L;
}

// ---------------------------------------------------------------- the coast: land, the vessel
export function land(ctx, t, C, poly, o = {}) {
  const y = o.y ?? 2.4, Q = projPoly(C, poly.map(([x, z]) => [x, y, z]));
  if (Q.length > 2) fillPoly(ctx, Q, o.col || '#100f1c');
  // the quay walls (front faces down to the water) where they face the camera
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], W = projPoly(C, [[a[0], y, a[1]], [b[0], y, b[1]], [b[0], -.5, b[1]], [a[0], -.5, a[1]]]);
    if (W.length > 2) { fillPoly(ctx, W, '#0a0a14'); runs(ctx, C, [[a[0], y, a[1]], [b[0], y, b[1]]], rgba('#a4b0dc', .35), 1.2); for (let k = 1; k < 4; k++) runs(ctx, C, [[a[0], y - k * .7, a[1]], [b[0], y - k * .7, b[1]]], rgba('#05050c', .5), 1); }
  }
  // paving lines on top
  if (o.lines !== false) { const xs = poly.map((p) => p[0]), zs = poly.map((p) => p[1]); for (let x = Math.min(...xs) + 4; x < Math.max(...xs); x += 8) runs(ctx, C, [[x, y + .01, Math.min(...zs)], [x, y + .01, Math.max(...zs)]], rgba('#1c1c2c', .5), 1); }
}
export function sleek(ctx, t, C, o) {
  const L = o.L ?? 26, B = L * .16, h = o.head ?? 0, fx = Math.sin(h), fz = Math.cos(h), rx = Math.cos(h), rz = -Math.sin(h), y0 = .1 * Math.sin(t * .7);
  const F = (u, v, w) => [o.x + rx * u * B + fx * w * L, y0 + v, o.z + rz * u * B + fz * w * L];
  const HULL = [[0, .5], [.35, .38], [.5, .1], [.5, -.3], [.42, -.5]];
  const deck = [...HULL.map(([u, w]) => F(u, 1.3, w)), ...HULL.slice().reverse().map(([u, w]) => F(-u, 1.3, w))];
  const side = (sd) => [...HULL.map(([u, w]) => F(sd * u, 1.3, w)), ...HULL.slice().reverse().map(([u, w]) => F(sd * u * .8, -.2, w))];
  const sds = [-1, 1].sort((a, b) => C.depth(...F(b * .5, .5, 0)) - C.depth(...F(a * .5, .5, 0)));
  for (const sd of sds) fillPoly(ctx, projPoly(C, side(sd)), '#0c0e18');
  fillPoly(ctx, projPoly(C, deck), '#1a1e2c');
  // the low cabin, the cool strip light along the hull
  fillPoly(ctx, projPoly(C, [F(-.3, 1.3, .1), F(.3, 1.3, .1), F(.26, 2.4, -.02), F(-.26, 2.4, -.02)]), '#151826');
  fillPoly(ctx, projPoly(C, [F(-.26, 2.4, -.02), F(.26, 2.4, -.02), F(.3, 2.4, -.28), F(-.3, 2.4, -.28)]), '#202436');
  const gl = o.glow ?? 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const sd of [-1, 1]) runs(ctx, C, HULL.map(([u, w]) => F(sd * u * .97, .8, w)), rgba('#8fe6ff', .65 * gl), 2);
  runs(ctx, C, [F(-.28, 1.9, .06), F(.28, 1.9, .06)], rgba('#d8f7ff', .8 * gl), 2.4);
  const tp = C.P(...F(0, 2.4, -.15)); if (tp) { const R = Math.max(8, tp[2] * 2.5), g = ctx.createRadialGradient(tp[0], tp[1], 0, tp[0], tp[1], R); g.addColorStop(0, rgba('#e6fbff', .8 * gl)); g.addColorStop(.2, rgba('#8fe6ff', .25 * gl)); g.addColorStop(1, rgba('#0a6f8c', 0)); ctx.fillStyle = g; ctx.fillRect(tp[0] - R, tp[1] - R, 2 * R, 2 * R); }
  ctx.restore();
  return { deck: (u, w) => F(u, 1.3, w) };
}

// ---------------------------------------------------------------- the post: candle, frost, the rule text
export function candle(ctx, t, C, p, o = {}) {
  const b = C.P(...p); if (!b) return null; const k = b[2], left = clamp(o.h ?? 1), on = clamp(o.on ?? 1), gust = o.gust || 0;
  const w = .028 * k, hh = (.03 + .13 * left) * k;
  ctx.save();
  // the bracket and the drip tray
  ctx.fillStyle = '#2a2018'; ctx.fillRect(b[0] - w * 1.6, b[1], w * 3.2, Math.max(2, .015 * k));
  // wax with drips (longer as it burns down)
  ctx.fillStyle = '#e4d6b8'; ctx.fillRect(b[0] - w * .5, b[1] - hh, w, hh);
  ctx.fillStyle = 'rgba(255,240,210,.7)'; for (let i = 0; i < 3; i++) { const dx = (i - 1) * w * .35, L = (1 - left) * .06 * k * (.5 + hash(i)); ctx.fillRect(b[0] + dx - w * .08, b[1] - hh, w * .16, hh * .2 + L); }
  { const g = ctx.createLinearGradient(b[0] - w * .5, 0, b[0] + w * .5, 0); g.addColorStop(0, 'rgba(255,220,170,.0)'); g.addColorStop(1, 'rgba(40,24,16,.55)'); ctx.fillStyle = g; ctx.fillRect(b[0] - w * .5, b[1] - hh, w, hh); }
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffd9a0', .3 * on); ctx.fillRect(b[0] - w * .5, b[1] - hh, w * .25, hh * .4);
  const fx = b[0] + gust * w * 1.2, fy = b[1] - hh - .01 * k;
  if (on > 0) {
    const fl = on * (1 + .08 * Math.sin(t * 17) + .06 * nz(t * 9, 2));
    const R = .55 * k * fl, g = ctx.createRadialGradient(fx, fy, 0, fx, fy, R); g.addColorStop(0, rgba('#ffd9a0', .5 * on)); g.addColorStop(.25, rgba('#ffb35c', .16 * on)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(fx - R, fy - R, 2 * R, 2 * R);
    const fh = .06 * k * fl * (1 - .5 * gust), fw = .012 * k;
    ctx.fillStyle = rgba('#ffb35c', .95); ctx.beginPath(); ctx.moveTo(fx + gust * fh, fy - fh); ctx.quadraticCurveTo(fx + fw * 1.6, fy - fh * .25, fx, fy + fh * .15); ctx.quadraticCurveTo(fx - fw * 1.6, fy - fh * .25, fx + gust * fh, fy - fh); ctx.fill();
    ctx.fillStyle = rgba('#fff6e2', on); ctx.beginPath(); ctx.ellipse(fx, fy - fh * .15, fw * .45, fh * .3, 0, 0, TAU); ctx.fill();
  } else if (o.outT != null) {
    ctx.globalCompositeOperation = 'source-over';
    const a = clamp(1 - (t - o.outT) / 2.2); ctx.strokeStyle = rgba('#c8c8d8', .55 * a); ctx.lineWidth = Math.max(1, .004 * k); ctx.beginPath(); ctx.moveTo(fx, fy);
    for (let i = 1; i <= 16; i++) { const v = i / 16; ctx.lineTo(fx + Math.sin(v * 8 + t * 2.4) * .02 * k * v, fy - v * .35 * k * Math.min(1, (t - o.outT) * 1.4 + .15)); } ctx.stroke();
    const e = clamp(1 - (t - o.outT) / .8); if (e > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ff7a3a', .9 * e); ctx.beginPath(); ctx.arc(fx, fy + .004 * k, Math.max(1, .005 * k), 0, TAU); ctx.fill(); }
  }
  ctx.restore();
  return [fx, fy, k];
}
const FROST = (() => { const r = prng(77), a = []; for (let i = 0; i < 70; i++) { const side = Math.floor(r() * 4), s = r(); const x = side === 0 ? s : side === 1 ? 1 : side === 2 ? s : 0, y = side === 0 ? 0 : side === 1 ? s : side === 2 ? 1 : s; const ang = Math.atan2(.5 - y, .5 - x) + (r() - .5) * 1.2; a.push({ x, y, ang, L: .12 + .3 * r(), br: [] }); for (let k = 0; k < 5; k++) a[a.length - 1].br.push({ at: .2 + .7 * r(), da: (r() < .5 ? -1 : 1) * (.5 + .5 * r()), L: .2 + .4 * r() }); } return a; })();
export function frost(g, W, H, u) {
  if (u <= 0) return;
  g.save(); g.lineCap = 'round';
  // the white rime creeping in from the edges
  const e = Math.min(W, H) * .55 * u, gr = (x0, y0, x1, y1) => { const q = g.createLinearGradient(x0, y0, x1, y1); q.addColorStop(0, `rgba(232,244,255,${.85 * u})`); q.addColorStop(1, 'rgba(232,244,255,0)'); return q; };
  g.fillStyle = gr(0, 0, 0, e); g.fillRect(0, 0, W, e); g.fillStyle = gr(0, H, 0, H - e); g.fillRect(0, H - e, W, e); g.fillStyle = gr(0, 0, e, 0); g.fillRect(0, 0, e, H); g.fillStyle = gr(W, 0, W - e, 0); g.fillRect(W - e, 0, e, H);
  // feathered crystals
  g.strokeStyle = `rgba(248,252,255,${.8 * Math.min(1, u * 1.5)})`;
  for (const f of FROST) {
    const L = f.L * Math.min(W, H) * u * 1.4, x0 = f.x * W, y0 = f.y * H, x1 = x0 + Math.cos(f.ang) * L, y1 = y0 + Math.sin(f.ang) * L;
    g.lineWidth = 2.2; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1);
    for (const b of f.br) { const bx = x0 + (x1 - x0) * b.at, by = y0 + (y1 - y0) * b.at, a = f.ang + b.da; g.moveTo(bx, by); g.lineTo(bx + Math.cos(a) * L * b.L * .5, by + Math.sin(a) * L * b.L * .5); }
    g.stroke();
  }
  g.restore();
}
export function ice(g, W, H, u, crack = 0) {
  if (u <= 0) return;
  g.save();
  const q = g.createLinearGradient(0, 0, W, H); q.addColorStop(0, `rgba(190,220,255,${.35 * u})`); q.addColorStop(.45, `rgba(240,250,255,${.55 * u})`); q.addColorStop(.55, `rgba(170,200,240,${.3 * u})`); q.addColorStop(1, `rgba(200,225,255,${.4 * u})`);
  g.fillStyle = q; g.fillRect(0, 0, W, H);
  g.strokeStyle = `rgba(255,255,255,${.6 * u})`; g.lineWidth = 3; g.beginPath(); g.moveTo(W * .1, H * .12); g.lineTo(W * .35, H * .05); g.moveTo(W * .7, H * .9); g.lineTo(W * .92, H * .78); g.stroke();
  if (crack > 0) {
    const r = prng(5); g.strokeStyle = `rgba(30,50,80,${.8 * Math.min(1, crack * 2)})`; g.lineWidth = 3;
    for (let k = 0; k < 7; k++) { let x = W * (.3 + .4 * r()), y = H * (.3 + .4 * r()); g.beginPath(); g.moveTo(x, y); const n = Math.ceil(6 * Math.min(1, crack * 2)); for (let i = 0; i < n; i++) { x += (r() - .5) * W * .3; y += (r() - .5) * H * .3; g.lineTo(x, y); } g.stroke(); }
  }
  g.restore();
}
export function ruleText(g, t, W, H, o = {}) {
  const ink = '#2a2420';
  g.save();
  g.fillStyle = ink; g.font = `600 ${Math.round(W * .085)}px Inter`; g.textAlign = 'center'; g.fillText(o.title || 'RULE', W / 2, H * .13);
  g.fillRect(W * .2, H * .155, W * .6, 3);
  for (let i = 0; i < 8; i++) scribble(g, W * .12, H * (.22 + i * .075), W * (i % 3 === 2 ? .55 : .76), H * .04, { seed: (o.seed || 1) * 20 + i, u: 1, ink, lw: 3 });
  // the amendment: line 3 struck through, a new line written above it
  const am = clamp(o.amend ?? 0);
  if (am > 0) {
    const y = H * (.22 + 3 * .075) + H * .02, a1 = clamp(am * 2.2);
    g.strokeStyle = '#1a2a6a'; g.lineWidth = 4; g.beginPath(); g.moveTo(W * .12, y); g.lineTo(W * .12 + W * .7 * a1, y - 4); g.stroke();
    if (am > .45) scribble(g, W * .14, y - H * .055, W * .6, H * .035, { seed: 991, u: clamp((am - .45) / .55), ink: '#1a2a6a', lw: 3 });
  }
  // the date stamp: a red box, small caps
  if (o.stamp) { g.save(); g.translate(W * .68, H * .86); g.rotate(-.08); g.strokeStyle = 'rgba(168,50,42,.85)'; g.lineWidth = 4; g.strokeRect(-W * .26, -H * .045, W * .52, H * .09); g.fillStyle = 'rgba(168,50,42,.9)'; g.font = `600 ${Math.round(W * .042)}px Inter`; g.textAlign = 'center'; g.fillText(o.stamp, 0, H * .016); g.restore(); }
  g.restore();
}
// your note: "When will this rule be reviewed?" written by hand (Instrument Serif Italic, a little unsteady); u = how much is written
const NOTE = 'When will this rule be reviewed?';
export function noteText(g, t, W, H, u) {
  const n = Math.floor(NOTE.length * clamp(u) + 1e-6), fs = Math.round(W * .085);
  g.save(); g.fillStyle = '#1e1a28'; g.font = `${fs}px "Instrument Serif Italic"`; g.textBaseline = 'alphabetic';
  const lines = ['When will this rule', 'be reviewed?'], x0 = W * .13, y0 = H * .42;
  let k = 0, pen = null;
  lines.forEach((line, li) => {
    let x = x0 + li * W * .04; const y = y0 + li * fs * 1.25;
    for (const ch of line) {
      if (k >= n) break;
      const r = hash(k * 7.7), w = g.measureText(ch).width;
      g.save(); g.translate(x, y + (r - .5) * fs * .05); g.rotate((r - .5) * .06); g.fillText(ch, 0, 0); g.restore();
      x += w * (1 + (r - .5) * .04); k++; pen = [x, y - fs * .25];
    }
    if (k < n) k++;   // the line break counts as one step (the space)
  });
  // the underline under "reviewed?"
  if (u >= 1) { g.strokeStyle = 'rgba(30,26,40,.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0 + W * .04, y0 + fs * 1.25 + fs * .18); g.quadraticCurveTo(x0 + W * .25, y0 + fs * 1.25 + fs * .26, x0 + W * .45, y0 + fs * 1.25 + fs * .16); g.stroke(); }
  g.restore();
  return pen;
}
