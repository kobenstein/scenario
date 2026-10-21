// c14 (Film 4 v2) · the cottage and its kitchen (14.01 end → 14.02): the one house the camera dives into, its lit kitchen window
// (open casements), the room behind it (pendant lamp, table, two chairs, a shelf with plates, a clock) and the table top with the
// banknote, a cup of tea and a pencil. Everything in the house's local metres (x along the front, y up, z out of the front wall),
// drawn with the metric camera of v2_c14_util (P).
//   LW(x, y, z) → world · NOTEW (the note's centre, world) · noteQuad() (its 4 world corners: note px (0,0) (NW,0) (NW,NH) (0,NH))
//   drawCottage(ctx, t, P, o)   the house seen from outside (o: { n night 0..1, lit 0..1 }), the room seen through its window
//   drawRoom(ctx, t, P, o)      the room from inside (o: { reveal: true when the camera stands in the window opening })
//   drawTableTop(ctx, t, P, o)  the table top seen from above (affine): wood, the light pool, cup, pencil (the note is drawn by the caller)
//   texQuad(ctx, P, img, iw, ih, Q, nx, ny)  an image on a world quad (affine triangles; one affine when the view is top-down)
import { clamp, mix, rgba, canvas as canvasOf } from '../engine.mjs';
import { once, onceRaw, smo, hexRGB, mixRGB, css, TAU } from './v2_c14_util.mjs';
import { COTTAGE } from './v2_c14_land.mjs';
import { noteBase, inkStatic, NW, NH, NOTE_M } from './v2_c14_note.mjs';

const RC = Math.cos(COTTAGE.rot), RS = Math.sin(COTTAGE.rot);
export const LW = (x, y, z) => [COTTAGE.X + x * RC + z * RS, COTTAGE.Y + y, COTTAGE.Z - x * RS + z * RC];
export const toLocal = (X, Y, Z) => { const dx = X - COTTAGE.X, dz = Z - COTTAGE.Z; return [dx * RC - dz * RS, Y - COTTAGE.Y, dx * RS + dz * RC]; };

export const HX = 4.1, HZ2 = 3.5, WALLY = 3.0, RIDGEY = 5.5, THK = .35;
export const WIN = { x0: -1.85, x1: -.65, y0: 1.0, y1: 2.1 };
export const TAB = { x: -1.25, z: 1.55, y: .76, hx: .65, hz: .4, th: .045 };
export const NOTEL = { x: TAB.x + .03, z: TAB.z + .03, y: TAB.y + .0006, a: -.07 };
export const NOTEW = LW(NOTEL.x, NOTEL.y, NOTEL.z);
export const LAMP = { x: TAB.x, z: TAB.z, y0: 1.78, y1: 1.98, r0: .2, r1: .06, ceil: 2.55 };
const ROOM = { x0: -3.75, x1: 1.0, z0: -.5, z1: HZ2 - THK, y1: 2.55 };
const CUP = { x: NOTEL.x + .168, z: NOTEL.z - .078, r: .036, h: .078, sr: .058 };
const PEN = { x: NOTEL.x - .155, z: NOTEL.z + .088, a: -.38, len: .16, w: .0072 };
const MPX = NOTE_M / NW;                         // metres per note px

// the note's corners (world) for note px (0,0), (NW,0), (NW,NH), (0,NH)
export function noteLocal(u, v) {
  const x = (u - NW / 2) * MPX, z = (v - NH / 2) * MPX, ca = Math.cos(NOTEL.a), sa = Math.sin(NOTEL.a);
  return [NOTEL.x + x * ca - z * sa, NOTEL.y, NOTEL.z + x * sa + z * ca];
}
export const noteW = (u, v) => { const p = noteLocal(u, v); return LW(p[0], p[1], p[2]); };
export const noteQuad = () => [noteW(0, 0), noteW(NW, 0), noteW(NW, NH), noteW(0, NH)];

// ---------------------------------------------------------------- an image on a world quad
export function texQuad(ctx, P, img, iw, ih, Q, nx = 6, ny = 4) {
  const C = Q.map((p) => P.cs(p[0], p[1], p[2]));
  if (C.every((c) => c[2] < P.NEAR)) return;
  if (C.every((c) => c[2] >= P.NEAR)) {
    const s = C.map(P.sp), px = s[1][0] + s[3][0] - s[0][0], py = s[1][1] + s[3][1] - s[0][1];
    if (Math.hypot(px - s[2][0], py - s[2][1]) < .6) {
      ctx.save(); ctx.setTransform((s[1][0] - s[0][0]) / iw, (s[1][1] - s[0][1]) / iw, (s[3][0] - s[0][0]) / ih, (s[3][1] - s[0][1]) / ih, s[0][0], s[0][1]);
      ctx.drawImage(img, 0, 0, iw, ih); ctx.restore(); return;
    }
  }
  const l3 = (a, b, u) => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)], G = [];
  for (let j = 0; j <= ny; j++) {
    const L = l3(Q[0], Q[3], j / ny), R = l3(Q[1], Q[2], j / ny), row = [];
    for (let i = 0; i <= nx; i++) { const w = l3(L, R, i / nx), c = P.cs(w[0], w[1], w[2]); row.push(c[2] >= P.NEAR ? P.sp(c) : null); }
    G.push(row);
  }
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const a = G[j][i], b = G[j][i + 1], c = G[j + 1][i + 1], d = G[j + 1][i]; if (!a || !b || !c || !d) continue;
    const u0 = i / nx * iw, u1 = (i + 1) / nx * iw, v0 = j / ny * ih, v1 = (j + 1) / ny * ih;
    tri(ctx, img, a, b, d, u0, v0, u1, v0, u0, v1); tri(ctx, img, c, d, b, u1, v1, u0, v1, u1, v0);
  }
}
function tri(ctx, img, p0, p1, p2, u0, v0, u1, v1, u2, v2) {
  const du1 = u1 - u0, dv1 = v1 - v0, du2 = u2 - u0, dv2 = v2 - v0, det = du1 * dv2 - du2 * dv1; if (Math.abs(det) < 1e-9) return;
  const x1 = p1[0] - p0[0], y1 = p1[1] - p0[1], x2 = p2[0] - p0[0], y2 = p2[1] - p0[1];
  const a = (x1 * dv2 - x2 * dv1) / det, b = (y1 * dv2 - y2 * dv1) / det, c = (x2 * du1 - x1 * du2) / det, d = (y2 * du1 - y1 * du2) / det;
  const e = p0[0] - a * u0 - c * v0, f = p0[1] - b * u0 - d * v0;
  const cx = (p0[0] + p1[0] + p2[0]) / 3, cy = (p0[1] + p1[1] + p2[1]) / 3;
  const ex = (p) => { const dx = p[0] - cx, dy = p[1] - cy, L = Math.hypot(dx, dy) || 1; return [p[0] + dx / L * .7, p[1] + dy / L * .7]; };
  const q0 = ex(p0), q1 = ex(p1), q2 = ex(p2);
  ctx.save(); ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.closePath(); ctx.clip();
  ctx.setTransform(a, b, c, d, e, f); ctx.drawImage(img, 0, 0); ctx.restore();
}

// ---------------------------------------------------------------- the wood of the table (procedural, the lamp's pool baked in)
const vh = (i, j) => { let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function vn(x, y) {
  const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return mix(mix(vh(i, j), vh(i + 1, j), u), mix(vh(i, j + 1), vh(i + 1, j + 1), u), v);
}
const lampL = (x, z) => { const r = Math.hypot(x - LAMP.x, z - LAMP.z); return .17 + .83 / Math.pow(1 + (r / .46) ** 2, 1.5); };
function wood(x, z, out) {
  const zz = z - (TAB.z - TAB.hz), p = Math.floor(zz / .2), v = zz / .2 - p, ph = vh(p, 7), xx = x + ph * 3.1;
  // growth rings: uneven spacing, gently meandering, thin dark late-wood lines; fibres stretched along the plank
  const warp = .006 * vn(xx * 3, p * 3.3) + .003 * vn(xx * 11, p * 5.1 + 2) + .0015 * Math.sin(xx * 1.7 + ph * 6);
  const freq = 62 + 46 * vn(xx * .7 + p * 4, 1.3), ring = (z + warp) * freq + ph * 13 + 3 * vn(xx * 2.1, p * 2.7), f = ring - Math.floor(ring);
  const line = Math.exp(-((f - .5) ** 2) / .0035) * (.55 + .45 * vn(xx * 9, ring * .3));
  const fib = vn(xx * 14, z * 2600 + p * 50) * .6 + vn(xx * 40, z * 5200) * .4;
  let k = 1 - .13 * line - .1 * (fib - .5) + .07 * (ph - .5) - .06 * vn(xx * 5 + p * 11, z * 40);
  const seam = Math.min(v, 1 - v) * .2; if (seam < .0018) k *= .38 + .62 * (seam / .0018);
  const L = lampL(x, z);
  out[0] = 150 * k * L + 14; out[1] = 102 * k * L * (.9 + .1 * L) + 10; out[2] = 66 * k * L * (.8 + .2 * L) + 12;
}
function woodImg(x0, z0, w, h, ppm, feather) {
  const iw = Math.round(w * ppm), ih = Math.round(h * ppm), [c, g] = canvasOf(iw, ih), im = g.createImageData(iw, ih), D = im.data, o = [0, 0, 0];
  for (let j = 0; j < ih; j++) {
    const z = z0 + (j + .5) / ppm;
    for (let i = 0; i < iw; i++) {
      const x = x0 + (i + .5) / ppm; wood(x, z, o); const q = (j * iw + i) * 4;
      D[q] = o[0]; D[q + 1] = o[1]; D[q + 2] = o[2];
      let a = 255; if (feather) { const e = Math.min(i, iw - 1 - i, j, ih - 1 - j) / (feather * ppm); if (e < 1) a = Math.round(255 * e * e * (3 - 2 * e)); }
      D[q + 3] = a;
    }
  }
  g.putImageData(im, 0, 0); return c;
}
const TOPC = { x0: TAB.x - TAB.hx, z0: TAB.z - TAB.hz, w: TAB.hx * 2, h: TAB.hz * 2, ppm: 1000 };
const TOPF = { x0: NOTEL.x - .25, z0: NOTEL.z - .15, w: .5, h: .3, ppm: 4000 };
const topCoarse = () => once('c14-table-c', () => woodImg(TOPC.x0, TOPC.z0, TOPC.w, TOPC.h, TOPC.ppm, 0));
const topFine = () => once('c14-table-f', () => woodImg(TOPF.x0, TOPF.z0, TOPF.w, TOPF.h, TOPF.ppm, .03));
const quadL = (x0, z0, w, h, y) => [LW(x0, y, z0), LW(x0 + w, y, z0), LW(x0 + w, y, z0 + h), LW(x0, y, z0 + h)];
// the note as one small image (for the oblique views of the dive)
export const noteSmall = () => once('c14-note-small', () => { const [c, g] = canvasOf(NW / 4, NH / 4); g.imageSmoothingQuality = 'high'; g.drawImage(noteBase(), 0, 0, NW / 4, NH / 4); g.drawImage(inkStatic(), 0, 0, NW / 4, NH / 4); return c; });
export function warmKitchen() { topCoarse(); topFine(); noteSmall(); }

// ---------------------------------------------------------------- small helpers
const proj = (P, pts) => P.clip(pts);
function fillPoly(ctx, S, style) { if (!S) return false; ctx.beginPath(); ctx.moveTo(S[0][0], S[0][1]); for (let i = 1; i < S.length; i++) ctx.lineTo(S[i][0], S[i][1]); ctx.closePath(); ctx.fillStyle = style; ctx.fill(); return true; }
function lines3(ctx, P, segs, style, w) {
  ctx.strokeStyle = style; ctx.lineWidth = w; ctx.beginPath(); let any = false;
  for (const [a, b] of segs) {
    let A = P.cs(a[0], a[1], a[2]), B = P.cs(b[0], b[1], b[2]);
    if (A[2] < P.NEAR && B[2] < P.NEAR) continue;
    if (A[2] < P.NEAR) { const u = (P.NEAR - A[2]) / (B[2] - A[2]); A = [mix(A[0], B[0], u), mix(A[1], B[1], u), P.NEAR]; }
    else if (B[2] < P.NEAR) { const u = (P.NEAR - B[2]) / (A[2] - B[2]); B = [mix(B[0], A[0], u), mix(B[1], A[1], u), P.NEAR]; }
    const p = P.sp(A), q = P.sp(B); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); any = true;
  }
  if (any) ctx.stroke();
}
// a radial light gradient centred on the projection of a world point (radius in metres)
function lightGrad(ctx, P, w, rM, stops) {
  const c = P.cs(w[0], w[1], w[2]), z = Math.max(P.NEAR, c[2]), s = P.sp([c[0], c[1], z]), r = Math.max(2, P.F * rM / z);
  const g = ctx.createRadialGradient(s[0], s[1], 0, s[0], s[1], r); for (const [u, col] of stops) g.addColorStop(u, col); return g;
}
function hull(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = []; for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up);
}
const circ = (cx, y, cz, r, n = 28) => { const o = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; o.push(LW(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r)); } return o; };
const projAll = (P, pts) => { const o = []; for (const p of pts) { const c = P.cs(p[0], p[1], p[2]); if (c[2] < P.NEAR) return null; o.push(P.sp(c)); } return o; };

// ---------------------------------------------------------------- the room
const WARM = '#ffcf8a';
function roomShell(ctx, P, cl) {
  const { x0, x1, z0, z1, y1 } = ROOM, lampW = LW(LAMP.x, LAMP.y0, LAMP.z), c = cl;
  // back wall: plaster, lit from the lamp
  const back = proj(P, [LW(x0, 0, z0), LW(x1, 0, z0), LW(x1, y1, z0), LW(x0, y1, z0)]);
  if (back) fillPoly(ctx, back, lightGrad(ctx, P, LW(LAMP.x, 1.25, z0), 2.6, [[0, '#a07a58'], [.45, '#6a4c3a'], [1, '#2a1e22']]));
  const lw = proj(P, [LW(x0, 0, z1), LW(x0, 0, z0), LW(x0, y1, z0), LW(x0, y1, z1)]);
  if (lw && P.o && c.x > x0) fillPoly(ctx, lw, lightGrad(ctx, P, LW(x0, 1.2, LAMP.z), 2.4, [[0, '#6c4e3c'], [1, '#22191c']]));
  const rw = proj(P, [LW(x1, 0, z0), LW(x1, 0, z1), LW(x1, y1, z1), LW(x1, y1, z0)]);
  if (rw && c.x < x1) fillPoly(ctx, rw, lightGrad(ctx, P, LW(x1, 1.2, LAMP.z), 2.2, [[0, '#7a5a44'], [1, '#261b1e']]));
  if (c.y < y1) { const ce = proj(P, [LW(x0, y1, z0), LW(x1, y1, z0), LW(x1, y1, z1), LW(x0, y1, z1)]); if (ce) fillPoly(ctx, ce, lightGrad(ctx, P, LW(LAMP.x, y1, LAMP.z), 1.4, [[0, '#4a3830'], [1, '#1a1418']])); }
  const fl = proj(P, [LW(x0, 0, z0), LW(x1, 0, z0), LW(x1, 0, z1), LW(x0, 0, z1)]);
  if (fl) {
    fillPoly(ctx, fl, lightGrad(ctx, P, LW(LAMP.x, 0, LAMP.z), 2.3, [[0, '#7a5236'], [.5, '#4a3226'], [1, '#1c1418']]));
    // floor boards
    const segs = []; for (let x = x0 + .16; x < x1; x += .16) segs.push([LW(x, .001, z0), LW(x, .001, z1)]);
    lines3(ctx, P, segs, 'rgba(20,12,10,.35)', 1);
  }
  // skirting and a dado rail on the back wall (engraved lines)
  lines3(ctx, P, [[LW(x0, .12, z0 + .002), LW(x1, .12, z0 + .002)], [LW(x0, .95, z0 + .002), LW(x1, .95, z0 + .002)]], 'rgba(40,26,20,.5)', 1.2);
  // the shelf with plates and jars, a clock
  const sy = 1.48, sd = .22, sx0 = -3.2, sx1 = -.45;
  const top = proj(P, [LW(sx0, sy, z0), LW(sx1, sy, z0), LW(sx1, sy, z0 + sd), LW(sx0, sy, z0 + sd)]);
  if (top) fillPoly(ctx, top, '#8a6446');
  const front = proj(P, [LW(sx0, sy, z0 + sd), LW(sx1, sy, z0 + sd), LW(sx1, sy - .04, z0 + sd), LW(sx0, sy - .04, z0 + sd)]);
  if (front) fillPoly(ctx, front, '#4e3428');
  for (let i = 0; i < 5; i++) {                       // plates standing on the shelf, leaning on the wall
    const px = sx0 + .3 + i * .27, r = .105, pts = [];
    for (let k = 0; k < 24; k++) { const a = k / 24 * TAU; pts.push(LW(px + Math.cos(a) * r, sy + r + .005 + Math.sin(a) * r, z0 + .05 - Math.sin(a) * .015)); }
    const S = projAll(P, pts); if (!S) continue;
    const lit = clamp(1 - Math.abs(px - LAMP.x) / 2.6);
    fillPoly(ctx, S, mixHexA('#5a4c48', '#efe2c8', .35 + .6 * lit));
    const ring = []; for (let k = 0; k < 24; k++) { const a = k / 24 * TAU; ring.push(LW(px + Math.cos(a) * r * .66, sy + r + .005 + Math.sin(a) * r * .66, z0 + .052 - Math.sin(a) * .01)); }
    const R = projAll(P, ring); if (R) { ctx.beginPath(); ctx.moveTo(R[0][0], R[0][1]); for (const q of R) ctx.lineTo(q[0], q[1]); ctx.closePath(); ctx.strokeStyle = rgba('#3e5a74', .55); ctx.lineWidth = Math.max(.6, P.F * .006 / Math.max(.3, P.cs(...LW(px, sy, z0))[2])); ctx.stroke(); }
  }
  for (let i = 0; i < 3; i++) {                       // jars
    const jx = sx1 - .5 + i * .14, jh = .14 + .03 * i, jw = .05;
    const S = proj(P, [LW(jx - jw, sy, z0 + .12), LW(jx + jw, sy, z0 + .12), LW(jx + jw, sy + jh, z0 + .12), LW(jx - jw, sy + jh, z0 + .12)]);
    if (S) fillPoly(ctx, S, ['#5b6a4a', '#7a5a3a', '#a8946a'][i]);
    const L = proj(P, [LW(jx - jw - .006, sy + jh, z0 + .12), LW(jx + jw + .006, sy + jh, z0 + .12), LW(jx + jw + .006, sy + jh + .025, z0 + .12), LW(jx - jw - .006, sy + jh + .025, z0 + .12)]);
    if (L) fillPoly(ctx, L, '#3a2c26');
  }
  { // the clock
    const cx = .35, cy = 1.92, r = .16, pts = []; for (let k = 0; k < 28; k++) { const a = k / 28 * TAU; pts.push(LW(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z0 + .03)); }
    const S = projAll(P, pts); if (S) { fillPoly(ctx, S, '#3a2a24'); }
    const pts2 = []; for (let k = 0; k < 28; k++) { const a = k / 28 * TAU; pts2.push(LW(cx + Math.cos(a) * r * .84, cy + Math.sin(a) * r * .84, z0 + .035)); }
    const S2 = projAll(P, pts2); if (S2) fillPoly(ctx, S2, '#c8b898');
    lines3(ctx, P, [[LW(cx, cy, z0 + .04), LW(cx - .07, cy - .06, z0 + .04)], [LW(cx, cy, z0 + .04), LW(cx + .02, cy + .1, z0 + .04)]], '#2a201c', 1.4);
  }
}
const mixHexA = (a, b, u) => css(mixRGB(hexRGB(a), hexRGB(b), clamp(u)));

function chair(ctx, P, cx, cz, side) {
  const sy = .45, s = .21, col = '#5a3a28', colL = '#8a5c3a';
  const seat = proj(P, [LW(cx - s, sy, cz - s), LW(cx + s, sy, cz - s), LW(cx + s, sy, cz + s), LW(cx - s, sy, cz + s)]);
  const legs = []; for (const dx of [-s + .03, s - .03]) for (const dz of [-s + .03, s - .03]) legs.push([LW(cx + dx, 0, cz + dz), LW(cx + dx, sy, cz + dz)]);
  lines3(ctx, P, legs, '#2e1e18', Math.max(1, P.F * .035 / Math.max(.3, P.cs(...LW(cx, sy, cz))[2])));
  if (seat) fillPoly(ctx, seat, lightGrad(ctx, P, LW(LAMP.x, sy, LAMP.z), 1.6, [[0, colL], [1, col]]));
  const bx = cx + side * (s - .02), posts = [[LW(bx, sy, cz - s + .03), LW(bx, .98, cz - s + .03)], [LW(bx, sy, cz + s - .03), LW(bx, .98, cz + s - .03)]];
  const k = P.F / Math.max(.3, P.cs(...LW(bx, .7, cz))[2]);
  lines3(ctx, P, posts, '#3a2620', Math.max(1, .032 * k));
  lines3(ctx, P, [[LW(bx, .94, cz - s + .03), LW(bx, .94, cz + s - .03)], [LW(bx, .78, cz - s + .03), LW(bx, .78, cz + s - .03)]], '#4a3024', Math.max(1, .04 * k));
}

function tableBody(ctx, P, c) {
  const { x, z, y, hx, hz, th } = TAB, k = P.F / Math.max(.3, P.cs(...LW(x, y, z))[2]);
  const legs = []; for (const dx of [-hx + .07, hx - .07]) for (const dz of [-hz + .07, hz - .07]) legs.push([LW(x + dx, 0, z + dz), LW(x + dx, y - th, z + dz)]);
  lines3(ctx, P, legs, '#2a1a14', Math.max(1, .06 * k));
  // the apron and the edge faces that face the camera
  const y0 = y - th, y1 = y;
  if (c.z > z + hz) fillPoly(ctx, proj(P, [LW(x - hx, y0, z + hz), LW(x + hx, y0, z + hz), LW(x + hx, y1, z + hz), LW(x - hx, y1, z + hz)]), '#4a2e1e');
  if (c.x > x + hx) fillPoly(ctx, proj(P, [LW(x + hx, y0, z + hz), LW(x + hx, y0, z - hz), LW(x + hx, y1, z - hz), LW(x + hx, y1, z + hz)]), '#3a2418');
  if (c.x < x - hx) fillPoly(ctx, proj(P, [LW(x - hx, y0, z - hz), LW(x - hx, y0, z + hz), LW(x - hx, y1, z + hz), LW(x - hx, y1, z - hz)]), '#3a2418');
}
// the cup of tea on its saucer, the pencil, their soft shadows (away from the lamp)
function tableThings(ctx, P) {
  const ty = TAB.y, away = (x, z, d) => { const dx = x - LAMP.x, dz = z - LAMP.z, L = Math.hypot(dx, dz) || 1; return [x + dx / L * d, z + dz / L * d]; };
  { // pencil
    const ca = Math.cos(PEN.a), sa = Math.sin(PEN.a), hl = PEN.len / 2, w = PEN.w / 2;
    const P0 = [PEN.x - ca * hl, PEN.z - sa * hl], P1 = [PEN.x + ca * hl * .82, PEN.z + sa * hl * .82], tip = [PEN.x + ca * hl, PEN.z + sa * hl], nx = -sa * w, nz = ca * w;
    const [sx, sz] = away(PEN.x, PEN.z, .006);
    const sh = proj(P, [LW(sx - ca * hl + nx * 1.6, ty + .0002, sz - sa * hl + nz * 1.6), LW(sx + ca * hl + nx * 1.6, ty + .0002, sz + sa * hl + nz * 1.6), LW(sx + ca * hl - nx * 1.6, ty + .0002, sz + sa * hl - nz * 1.6), LW(sx - ca * hl - nx * 1.6, ty + .0002, sz - sa * hl - nz * 1.6)]);
    if (sh) fillPoly(ctx, sh, 'rgba(30,16,8,.28)');
    const yy = ty + w;
    const body = proj(P, [LW(P0[0] + nx, yy, P0[1] + nz), LW(P1[0] + nx, yy, P1[1] + nz), LW(P1[0] - nx, yy, P1[1] - nz), LW(P0[0] - nx, yy, P0[1] - nz)]);
    if (body) { fillPoly(ctx, body, '#d9a23a'); }
    const facet = proj(P, [LW(P0[0] + nx * .25, yy + .0005, P0[1] + nz * .25), LW(P1[0] + nx * .25, yy + .0005, P1[1] + nz * .25), LW(P1[0] - nx * .25, yy + .0005, P1[1] - nz * .25), LW(P0[0] - nx * .25, yy + .0005, P0[1] - nz * .25)]);
    if (facet) fillPoly(ctx, facet, '#f0c868');
    const cone = proj(P, [LW(P1[0] + nx, yy, P1[1] + nz), LW(tip[0], yy - w * .6, tip[1]), LW(P1[0] - nx, yy, P1[1] - nz)]);
    if (cone) fillPoly(ctx, cone, '#e6c9a0');
    const lead = proj(P, [LW(mix(P1[0], tip[0], .7) + nx * .3, yy - w * .4, mix(P1[1], tip[1], .7) + nz * .3), LW(tip[0], yy - w * .6, tip[1]), LW(mix(P1[0], tip[0], .7) - nx * .3, yy - w * .4, mix(P1[1], tip[1], .7) - nz * .3)]);
    if (lead) fillPoly(ctx, lead, '#3a3a40');
    const end = proj(P, [LW(P0[0] + nx, yy, P0[1] + nz), LW(P0[0] - nx, yy, P0[1] - nz), LW(P0[0] - nx - ca * .012, yy, P0[1] - nz - sa * .012), LW(P0[0] + nx - ca * .012, yy, P0[1] + nz - sa * .012)]);
    if (end) fillPoly(ctx, end, '#b8b0a0');
  }
  { // cup and saucer
    const [sx, sz] = away(CUP.x, CUP.z, .012);
    const sh = projAll(P, circ(sx, ty + .0002, sz, CUP.sr * 1.08));
    if (sh) fillPoly(ctx, sh, 'rgba(30,16,8,.32)');
    const sau = projAll(P, circ(CUP.x, ty + .004, CUP.z, CUP.sr)), sau2 = projAll(P, circ(CUP.x, ty + .012, CUP.z, CUP.sr * .93));
    if (sau && sau2) { fillPoly(ctx, hull(sau.concat(sau2)), '#cfc4b0'); fillPoly(ctx, sau2, '#efe6d4'); }
    const base = circ(CUP.x, ty + .012, CUP.z, CUP.r * .72), rim = circ(CUP.x, ty + CUP.h, CUP.z, CUP.r);
    const B = projAll(P, base), R = projAll(P, rim);
    if (B && R) {
      // handle: a loop on the side away from the note
      const hx = CUP.x + CUP.r * .95, hp = []; for (let k = 0; k <= 10; k++) { const a = -Math.PI / 2 + k / 10 * Math.PI; hp.push(LW(hx + Math.cos(a) * .026, ty + .048 + Math.sin(a) * .022, CUP.z)); }
      const Hs = projAll(P, hp); if (Hs) { ctx.strokeStyle = '#d8ccb8'; ctx.lineWidth = Math.max(1, P.F * .008 / Math.max(.2, P.cs(...LW(hx, ty, CUP.z))[2])); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(Hs[0][0], Hs[0][1]); for (const q of Hs) ctx.lineTo(q[0], q[1]); ctx.stroke(); }
      const body = hull(B.concat(R)); const xs = body.map((q) => q[0]), bx0 = Math.min(...xs), bx1 = Math.max(...xs);
      const g = ctx.createLinearGradient(bx0, 0, bx1, 0); g.addColorStop(0, '#fbf3e4'); g.addColorStop(.55, '#d6cab4'); g.addColorStop(1, '#9a8e7c');
      fillPoly(ctx, body, g); fillPoly(ctx, R, '#f6eee0');
      const tea = projAll(P, circ(CUP.x, ty + CUP.h - .012, CUP.z, CUP.r * .86));
      if (tea) {
        const ts = tea, tx = ts.reduce((s, q) => s + q[0], 0) / ts.length, tyy = ts.reduce((s, q) => s + q[1], 0) / ts.length, rr = Math.max(...ts.map((q) => Math.hypot(q[0] - tx, q[1] - tyy)));
        const tg = ctx.createRadialGradient(tx - rr * .25, tyy - rr * .2, 0, tx, tyy, rr); tg.addColorStop(0, '#b0622a'); tg.addColorStop(.6, '#7a3a16'); tg.addColorStop(1, '#4a200c');
        fillPoly(ctx, ts, tg);
        ctx.fillStyle = 'rgba(255,236,200,.75)'; ctx.beginPath(); ctx.ellipse(tx - rr * .3, tyy - rr * .25, rr * .16, rr * .1, -.5, 0, TAU); ctx.fill();
      }
    }
  }
}
function lamp(ctx, P, t) {
  const { x, z, y0, y1, r0, r1, ceil } = LAMP;
  lines3(ctx, P, [[LW(x, y1, z), LW(x, ceil, z)]], '#1a1210', 1.2);
  const B = projAll(P, circ(x, y0, z, r0, 32)), T = projAll(P, circ(x, y1, z, r1, 20));
  if (!B || !T) return;
  const body = hull(B.concat(T)), xs = body.map((q) => q[0]), bx0 = Math.min(...xs), bx1 = Math.max(...xs);
  const g = ctx.createLinearGradient(bx0, 0, bx1, 0); g.addColorStop(0, '#2c4a3c'); g.addColorStop(.35, '#4e7462'); g.addColorStop(1, '#16261e');
  fillPoly(ctx, body, g);
  // the warm light under the shade's rim
  const c = P.cs(...LW(x, y0, z)); if (c[2] < P.NEAR) return; const s = P.sp(c), r = P.F * r0 * 1.6 / c[2];
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(s[0], s[1], 0, s[0], s[1], r);
  lg.addColorStop(0, rgba('#fff2d8', .55)); lg.addColorStop(.4, rgba(WARM, .22)); lg.addColorStop(1, rgba(WARM, 0)); ctx.fillStyle = lg; ctx.fillRect(s[0] - r, s[1] - r, r * 2, r * 2); ctx.restore();
}
// the whole room (camera inside it, or outside looking through the window: the caller clips)
export function drawRoom(ctx, t, P, o = {}) {
  const cw = [P.o.x, P.o.y, P.o.z], [cx, cy, cz] = toLocal(cw[0], cw[1], cw[2]), c = { x: cx, y: cy, z: cz };
  roomShell(ctx, P, c);
  chair(ctx, P, TAB.x - TAB.hx - .24, TAB.z + .02, -1);
  chair(ctx, P, TAB.x + TAB.hx + .24, TAB.z - .03, 1);
  tableBody(ctx, P, c);
  texQuad(ctx, P, topCoarse(), Math.round(TOPC.w * TOPC.ppm), Math.round(TOPC.h * TOPC.ppm), quadL(TOPC.x0, TOPC.z0, TOPC.w, TOPC.h, TAB.y), 10, 6);
  texQuad(ctx, P, noteSmall(), NW / 4, NH / 4, noteQuad(), 4, 2);
  tableThings(ctx, P);
  lamp(ctx, P, t);
  if (o.reveal) reveal(ctx, P, c, 1);
}

// ---------------------------------------------------------------- the table top from straight above (the note phase)
// draws the wood (coarse + fine), the light pool; the caller then draws the note with noteAffine(P) and calls drawTableThings
export function drawTableTop(ctx, t, P, fine = 1) {
  ctx.fillStyle = '#1e140f'; ctx.fillRect(0, 0, 1920, 1080);
  texQuad(ctx, P, topCoarse(), Math.round(TOPC.w * TOPC.ppm), Math.round(TOPC.h * TOPC.ppm), quadL(TOPC.x0, TOPC.z0, TOPC.w, TOPC.h, TAB.y), 10, 6);
  if (fine > .004) { ctx.save(); ctx.globalAlpha = fine; texQuad(ctx, P, topFine(), Math.round(TOPF.w * TOPF.ppm), Math.round(TOPF.h * TOPF.ppm), quadL(TOPF.x0, TOPF.z0, TOPF.w, TOPF.h, TAB.y), 1, 1); ctx.restore(); }
}
export const drawTableThings = (ctx, P) => tableThings(ctx, P);
// note px → screen as an affine [a, b, c, d, e, f] (valid when the camera looks straight down)
export function noteAffine(P) {
  const s0 = P(...noteW(0, 0)), s1 = P(...noteW(NW, 0)), s3 = P(...noteW(0, NH));
  return [(s1[0] - s0[0]) / NW, (s1[1] - s0[1]) / NW, (s3[0] - s0[0]) / NH, (s3[1] - s0[1]) / NH, s0[0], s0[1]];
}

// ---------------------------------------------------------------- the cottage from outside
const EXT = {
  wall: ['#57506a', '#2e2b42'], wallSide: ['#433e56', '#232136'], roof: ['#5a3c44', '#2a2030'], plinth: ['#3e3848', '#22202e'],
  frame: '#e2d8c4', door: '#3e2c26', glassD: '#2c2a4a',
};
const nc = (pair, n) => mixHexA(pair[0], pair[1], n);
function reveal(ctx, P, c, lit) {
  // the four faces of the window opening (outer face z = HZ2 → inner face z = HZ2 - THK), lit warm from inside
  const { x0, x1, y0, y1 } = WIN, zo = HZ2, zi = HZ2 - THK;
  const faces = [];
  if (c.x > x0) faces.push([[LW(x0, y0, zo), LW(x0, y0, zi), LW(x0, y1, zi), LW(x0, y1, zo)], '#a07c5a']);
  if (c.x < x1) faces.push([[LW(x1, y0, zi), LW(x1, y0, zo), LW(x1, y1, zo), LW(x1, y1, zi)], '#94704f']);
  if (c.y > y0) faces.push([[LW(x0, y0, zo), LW(x1, y0, zo), LW(x1, y0, zi), LW(x0, y0, zi)], '#b08a64']);
  if (c.y < y1) faces.push([[LW(x0, y1, zi), LW(x1, y1, zi), LW(x1, y1, zo), LW(x0, y1, zo)], '#6e5442']);
  for (const [pts, col] of faces) fillPoly(ctx, proj(P, pts), mixHexA('#3a3048', col, .35 + .65 * lit));
}
function sash(ctx, P, side, lit, n) {
  // an outward-opening casement hinged at the opening's outer edge, open by 68°
  const { x0, x1, y0, y1 } = WIN, w = (x1 - x0) / 2, hx = side < 0 ? x0 : x1, ang = 68 * Math.PI / 180;
  const dx = -side * Math.cos(ang) * w, dz = Math.sin(ang) * w, z0 = HZ2;
  const at = (u, y) => LW(hx + dx * u, y, z0 + dz * u);
  const outer = proj(P, [at(0, y0), at(1, y0), at(1, y1), at(0, y1)]); if (!outer) return;
  fillPoly(ctx, outer, mixHexA('#8a8496', EXT.frame, .5 + .5 * lit * (1 - n * .3)));
  const fw = .055 / w, fh = .055;
  for (const [ya, yb] of [[y0 + fh, (y0 + y1) / 2 - fh / 2], [(y0 + y1) / 2 + fh / 2, y1 - fh]]) {
    const S = proj(P, [at(fw, ya), at(1 - fw, ya), at(1 - fw, yb), at(fw, yb)]);
    if (S) { const ys = S.map((q) => q[1]), g = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys)); g.addColorStop(0, mixHexA('#8a7aa8', '#3a3660', n)); g.addColorStop(1, mixHexA('#d8a4a0', '#5a4870', n)); fillPoly(ctx, S, g); }
  }
}
export function drawCottage(ctx, t, P, o = {}) {
  const n = o.n ?? .5, lit = o.lit ?? 1, cw = [P.o.x, P.o.y, P.o.z], [cx, cy, cz] = toLocal(cw[0], cw[1], cw[2]), c = { x: cx, y: cy, z: cz };
  const S0 = P(...LW(0, 1.5, HZ2)); if (S0[2] < 1 && c.z > HZ2 + 3) return;   // (close up, the wall is always drawn: the dive ends in the window)
  const size = P.F * 8.2 / Math.max(S0[2], .05);
  // the warm light on the ground under the window and on the path to the door
  {
    const g = proj(P, [LW(WIN.x0 - .9, .01, HZ2), LW(WIN.x1 + .9, .01, HZ2), LW(WIN.x1 + 1.6, .01, HZ2 + 2.4), LW(WIN.x0 - 1.6, .01, HZ2 + 2.4)]);
    if (g && lit > .01) fillPoly(ctx, g, lightGrad(ctx, P, LW((WIN.x0 + WIN.x1) / 2, 0, HZ2 + .2), 2.2, [[0, rgba('#e8a060', .55 * lit)], [.5, rgba('#a86a40', .25 * lit)], [1, rgba('#a86a40', 0)]]));
  }
  // gable walls
  const gable = (x, col) => fillPoly(ctx, proj(P, [LW(x, 0, -HZ2), LW(x, 0, HZ2), LW(x, WALLY, HZ2), LW(x, RIDGEY, 0), LW(x, WALLY, -HZ2)]), col);
  if (c.x > HX) gable(HX, nc(EXT.wallSide, n));
  if (c.x < -HX) gable(-HX, nc(EXT.wallSide, n));
  if (c.z <= HZ2) return;
  // the front wall
  const fw = proj(P, [LW(-HX, 0, HZ2), LW(HX, 0, HZ2), LW(HX, WALLY, HZ2), LW(-HX, WALLY, HZ2)]);
  if (fw) {
    fillPoly(ctx, fw, nc(EXT.wall, n));
    if (size > 30) {   // plaster courses (engraved), the stone plinth
      const segs = []; for (let y = .55; y < WALLY; y += .13) segs.push([LW(-HX, y, HZ2 + .001), LW(HX, y, HZ2 + .001)]);
      lines3(ctx, P, segs, rgba('#141222', .38), 1);
      fillPoly(ctx, proj(P, [LW(-HX, 0, HZ2 + .03), LW(HX, 0, HZ2 + .03), LW(HX, .42, HZ2 + .03), LW(-HX, .42, HZ2 + .03)]), nc(EXT.plinth, n));
      const bl = []; for (let x = -HX + .3; x < HX; x += .42) bl.push([LW(x, 0, HZ2 + .031), LW(x, .42, HZ2 + .031)]);
      bl.push([LW(-HX, .21, HZ2 + .031), LW(HX, .21, HZ2 + .031)]); lines3(ctx, P, bl, rgba('#141220', .4), 1);
    }
    // the warm glow on the wall around the window
    if (lit > .01) { ctx.save(); ctx.beginPath(); ctx.moveTo(fw[0][0], fw[0][1]); for (const q of fw) ctx.lineTo(q[0], q[1]); ctx.closePath(); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lightGrad(ctx, P, LW((WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2, HZ2), 2.2, [[0, rgba('#ffb060', .32 * lit)], [.4, rgba('#d07a40', .12 * lit)], [1, rgba('#d07a40', 0)]]); ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }
    // door and the dark windows
    fillPoly(ctx, proj(P, [LW(1.45, 0, HZ2 + .002), LW(2.4, 0, HZ2 + .002), LW(2.4, 2.1, HZ2 + .002), LW(1.45, 2.1, HZ2 + .002)]), mixHexA(EXT.door, '#1a1214', n * .6));
    if (size > 40) lines3(ctx, P, [[LW(1.69, .05, HZ2 + .004), LW(1.69, 2.05, HZ2 + .004)], [LW(1.93, .05, HZ2 + .004), LW(1.93, 2.05, HZ2 + .004)], [LW(2.17, .05, HZ2 + .004), LW(2.17, 2.05, HZ2 + .004)]], 'rgba(10,6,6,.5)', 1);
    for (const [a, b] of [[-3.55, -2.85], [3.0, 3.65]]) {
      fillPoly(ctx, proj(P, [LW(a - .07, 1.0 - .07, HZ2 + .003), LW(b + .07, 1.0 - .07, HZ2 + .003), LW(b + .07, 2.1 + .07, HZ2 + .003), LW(a - .07, 2.1 + .07, HZ2 + .003)]), mixHexA(EXT.frame, '#4a4660', .3 + .5 * n));
      const S = proj(P, [LW(a, 1.0, HZ2 + .004), LW(b, 1.0, HZ2 + .004), LW(b, 2.1, HZ2 + .004), LW(a, 2.1, HZ2 + .004)]);
      if (S) { const ys = S.map((q) => q[1]), g = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys)); g.addColorStop(0, mixHexA('#6a5a8a', '#20203c', n)); g.addColorStop(1, mixHexA('#b88a9a', '#3a3050', n)); fillPoly(ctx, S, g); }
      lines3(ctx, P, [[LW((a + b) / 2, 1.0, HZ2 + .005), LW((a + b) / 2, 2.1, HZ2 + .005)], [LW(a, 1.6, HZ2 + .005), LW(b, 1.6, HZ2 + .005)]], mixHexA(EXT.frame, '#4a4660', .4), Math.max(1, size * .004));
    }
    // the kitchen window: the room behind it (clipped to the opening), the opening's faces, the sill, the open casements
    const op = proj(P, [LW(WIN.x0, WIN.y0, HZ2), LW(WIN.x1, WIN.y0, HZ2), LW(WIN.x1, WIN.y1, HZ2), LW(WIN.x0, WIN.y1, HZ2)]);
    if (op) {
      const xs = op.map((q) => q[0]), sz = Math.max(...xs) - Math.min(...xs);
      if (sz > 6) { ctx.save(); ctx.beginPath(); ctx.moveTo(op[0][0], op[0][1]); for (const q of op) ctx.lineTo(q[0], q[1]); ctx.closePath(); ctx.clip(); drawRoom(ctx, t, P, {}); ctx.restore(); reveal(ctx, P, c, lit); }
      else fillPoly(ctx, op, `rgba(255,${200 + Math.round(30 * lit)},${130 + Math.round(60 * lit)},${lit})`);
      fillPoly(ctx, proj(P, [LW(WIN.x0 - .08, WIN.y0 - .07, HZ2 + .07), LW(WIN.x1 + .08, WIN.y0 - .07, HZ2 + .07), LW(WIN.x1 + .08, WIN.y0, HZ2 + .07), LW(WIN.x0 - .08, WIN.y0, HZ2 + .07)]), mixHexA('#8a8090', '#e0c8a8', .4 * lit));
      fillPoly(ctx, proj(P, [LW(WIN.x0 - .08, WIN.y0, HZ2 + .07), LW(WIN.x1 + .08, WIN.y0, HZ2 + .07), LW(WIN.x1 + .08, WIN.y0, HZ2 - .02), LW(WIN.x0 - .08, WIN.y0, HZ2 - .02)]), mixHexA('#9a90a0', '#f0d6b0', .5 * lit));
      if (sz > 6) { if (c.x < WIN.x0) { sash(ctx, P, 1, lit, n); sash(ctx, P, -1, lit, n); } else { sash(ctx, P, -1, lit, n); sash(ctx, P, 1, lit, n); } }
    }
  }
  // the roof (front plane) with its tile courses, the chimney on the ridge
  const ov = .42, eY = WALLY - .12, eZ = HZ2 + ov;
  const nr = [0, eZ - 0, RIDGEY - eY]; // plane normal ~ (0, eZ, RIDGEY - eY) up and out
  const vis = (cy - eY) * eZ + (cz - eZ) * (RIDGEY - eY) > 0;
  if (vis) {
    const rf = proj(P, [LW(-HX - .3, eY, eZ), LW(HX + .3, eY, eZ), LW(HX + .3, RIDGEY, 0), LW(-HX - .3, RIDGEY, 0)]);
    if (rf) {
      const ys = rf.map((q) => q[1]), g = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys)); g.addColorStop(0, nc(['#6b505d', EXT.roof[1]], n)); g.addColorStop(1, nc(EXT.roof, n));
      fillPoly(ctx, rf, g);
      if (size > 30) {
        const segs = []; for (let u = .06; u < 1; u += .07) segs.push([LW(-HX - .3, mix(eY, RIDGEY, u), mix(eZ, 0, u)), LW(HX + .3, mix(eY, RIDGEY, u), mix(eZ, 0, u))]);
        lines3(ctx, P, segs, rgba('#140c14', .4), 1);
      }
      lines3(ctx, P, [[LW(-HX - .3, eY, eZ), LW(HX + .3, eY, eZ)]], rgba('#0c0810', .7), Math.max(1, size * .006));
      lines3(ctx, P, [[LW(-HX - .3, RIDGEY, 0), LW(HX + .3, RIDGEY, 0)]], rgba(mixHexA('#c0a8c0', '#4a4060', n), .8), Math.max(1, size * .004));
    }
    void nr;
  }
  { // chimney
    const x0 = 2.3, x1 = 2.9, z0 = -.3, z1 = .3, yb = RIDGEY - .4, yt = RIDGEY + .9, col = nc(['#5a4c58', '#2a2232'], n);
    fillPoly(ctx, proj(P, [LW(x0, yb, z1), LW(x1, yb, z1), LW(x1, yt, z1), LW(x0, yt, z1)]), col);
    if (c.x > x1) fillPoly(ctx, proj(P, [LW(x1, yb, z1), LW(x1, yb, z0), LW(x1, yt, z0), LW(x1, yt, z1)]), mixHexA('#2a2232', '#120e18', n));
    if (c.y > yt) fillPoly(ctx, proj(P, [LW(x0, yt, z1), LW(x1, yt, z1), LW(x1, yt, z0), LW(x0, yt, z0)]), mixHexA('#3a3040', '#141018', n));
  }
  // the window light falling out (a soft glow), strongest while the house is small
  const wc = P.cs(...LW((WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2, HZ2 + .1));
  if (wc[2] > .5 && lit > .01) {
    const s = P.sp(wc), r = P.F * 2.4 / wc[2] + 8; const k = clamp(1.2 - size / 900);
    if (k > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(s[0], s[1], 0, s[0], s[1], r); g.addColorStop(0, rgba('#ffd49a', .5 * lit * k)); g.addColorStop(.3, rgba('#ffa860', .16 * lit * k)); g.addColorStop(1, rgba('#ff9850', 0)); ctx.fillStyle = g; ctx.fillRect(s[0] - r, s[1] - r, r * 2, r * 2); ctx.restore(); }
  }
}
