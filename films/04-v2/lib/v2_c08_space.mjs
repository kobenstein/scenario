// C08 · a small 3D toolkit for the hall, the sky over the city and the station (one world, one camera, metres, Y up).
//   Cam(o)                      cam3 + dir(az, el) for sky directions, horizon(), viewDir; o = { x, y, z, yaw, pitch, roll, f }
//   proj(cam, pts)              near-clipped screen polygon of 3D points ([] when behind)
//   fillPoly / strokePoly       screen polygon helpers (paths are built in screen space: napi applies the transform at fill time)
//   planeAff(cam, O, U, V)      the affine (Jacobian) of a plane at O with axes U, V (metres) → [a,b,c,d,e,f] for ctx.setTransform
//   poolOn(ctx, cam, spts, O, U, V, r, stops)   a radial light pool lying on a plane, clipped to the screen polygon spts
//   gridTex(ctx, cam, img, P, nu, nv, o)        a texture on a curved sheet P(u, v) → [x, y, z] (u, v 0..1), cell by cell
//   boxVis(cam, b)              the faces of an axis-aligned box b = {x0,x1,y0,y1,z0,z1} that face the camera
//   Painter                     depth-sorted drawing (far → near)
//   colours: rgb(hex) → [r,g,b], css([r,g,b], a), lerpC, mulC
import { cam3, clamp, mix, W, H, canvas, memo, toImg, best } from './v2_c08_core.mjs';

export const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const css = (c, a = 1) => a >= 1 ? `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})` : `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a.toFixed(3)})`;
export const lerpC = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
export const mulC = (a, k) => [Math.min(255, a[0] * k), Math.min(255, a[1] * k), Math.min(255, a[2] * k)];
export const addC = (a, b, k = 1) => [Math.min(255, a[0] + b[0] * k), Math.min(255, a[1] + b[1] * k), Math.min(255, a[2] + b[2] * k)];

export function Cam(o) {
  const c = cam3(o);
  // a direction (azimuth from +Z toward +X, elevation) → screen point, or null behind
  c.dir = (az, el) => {
    const d = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)];
    const xc = d[0] * c.R[0] + d[1] * c.R[1] + d[2] * c.R[2], yc = d[0] * c.U[0] + d[1] * c.U[1] + d[2] * c.U[2], zc = d[0] * c.F[0] + d[1] * c.F[1] + d[2] * c.F[2];
    return zc > 1e-3 ? [c.cx + c.f * xc / zc, c.cy - c.f * yc / zc, zc] : null;
  };
  // elevation (radians) of the view ray through screen point (x, y)
  c.elevAt = (x, y) => {
    const dx = (x - c.cx) / c.f, dy = -(y - c.cy) / c.f;
    const d = [c.F[0] + dx * c.R[0] + dy * c.U[0], c.F[1] + dx * c.R[1] + dy * c.U[1], c.F[2] + dx * c.R[2] + dy * c.U[2]];
    return Math.atan2(d[1], Math.hypot(d[0], d[2]));
  };
  // the screen ray through (x, y) as a world direction (not normalised)
  c.ray = (x, y) => { const dx = (x - c.cx) / c.f, dy = -(y - c.cy) / c.f; return [c.F[0] + dx * c.R[0] + dy * c.U[0], c.F[1] + dx * c.R[1] + dy * c.U[1], c.F[2] + dx * c.R[2] + dy * c.U[2]]; };
  return c;
}
export const proj = (cam, pts) => cam.poly(pts);
export function pathS(ctx, sp) { if (sp.length < 2) return false; ctx.moveTo(sp[0][0], sp[0][1]); for (let i = 1; i < sp.length; i++) ctx.lineTo(sp[i][0], sp[i][1]); ctx.closePath(); return true; }
export function fillS(ctx, sp, style) { if (sp.length < 3) return; ctx.beginPath(); pathS(ctx, sp); ctx.fillStyle = style; ctx.fill(); }
export function fillPoly(ctx, cam, pts, style) { const sp = cam.poly(pts); fillS(ctx, sp, style); return sp; }
export function strokePoly(ctx, cam, pts, style, w, close = true) {
  if (close) { const sp = cam.poly(pts); if (sp.length < 2) return; ctx.beginPath(); pathS(ctx, sp); ctx.strokeStyle = style; ctx.lineWidth = w; ctx.stroke(); return; }
  ctx.beginPath(); let any = false;
  for (let i = 0; i < pts.length - 1; i++) { const s = cam.seg3(pts[i], pts[i + 1]); if (!s) continue; ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); any = true; }
  if (any) { ctx.strokeStyle = style; ctx.lineWidth = w; ctx.stroke(); }
}
// a 3D polyline as one path (segments clipped), for strokes
export function line3(ctx, cam, pts) { for (let i = 0; i < pts.length - 1; i++) { const s = cam.seg3(pts[i], pts[i + 1]); if (!s) continue; ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); } }
// screen bbox of a screen polygon
export const bboxS = (sp) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of sp) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return [x0, y0, x1, y1]; };
export const onScreen = (sp, m = 0) => { if (sp.length < 2) return false; const b = bboxS(sp); return b[2] > -m && b[0] < W + m && b[3] > -m && b[1] < H + m; };

// the affine of a plane at O (axes U, V in metres) → screen; null if O is behind the camera
export function planeAff(cam, O, U, V) {
  const a = cam.P(O[0], O[1], O[2]); if (!(a[2] > cam.near)) return null;
  const b = cam.P(O[0] + U[0], O[1] + U[1], O[2] + U[2]), d = cam.P(O[0] + V[0], O[1] + V[1], O[2] + V[2]);
  if (!(b[2] > cam.near && d[2] > cam.near)) return null;
  return [b[0] - a[0], b[1] - a[1], d[0] - a[0], d[1] - a[1], a[0], a[1]];
}
// a radial pool of light lying on a plane (O centre, U V unit axes of the plane), radius r (m), clipped to screen polygon sp
export function poolOn(ctx, cam, sp, O, U, V, r, stops, op = 'source-over', ext = 1) {
  if (sp && sp.length < 3) return;
  const A = planeAff(cam, O, [U[0] * r, U[1] * r, U[2] * r], [V[0] * r, V[1] * r, V[2] * r]); if (!A) return;
  ctx.save();
  if (sp) { ctx.beginPath(); pathS(ctx, sp); ctx.clip(); }
  ctx.globalCompositeOperation = op;
  ctx.setTransform(A[0], A[1], A[2], A[3], A[4], A[5]);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); for (const [k, c] of stops) g.addColorStop(k, c);
  ctx.fillStyle = g; ctx.beginPath(); ctx.rect(-ext, -ext, 2 * ext, 2 * ext); ctx.fill();
  ctx.restore();
}
// a linear gradient between two 3D points, filling a screen polygon
export function linOn(ctx, cam, sp, A3, B3, stops) {
  if (sp.length < 3) return;
  const a = cam.P(...A3), b = cam.P(...B3); if (!(a[2] > cam.near && b[2] > cam.near)) { return; }
  const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); for (const [k, c] of stops) g.addColorStop(k, c);
  ctx.beginPath(); pathS(ctx, sp); ctx.fillStyle = g; ctx.fill();
}
// texture on a (curved) sheet: P(u, v) → 3D, nu × nv cells; o: { back: css colour for the back side, pad, a, flat (one affine, no clip) }
// returns the sign of the facing (1 front, -1 back) of the middle cell, or 0 if nothing drawn
export function gridTex(ctx, cam, img, P, nu = 1, nv = 1, o = {}) {
  const iw = img.width, ih = img.height, S = [];
  for (let j = 0; j <= nv; j++) { const row = []; for (let i = 0; i <= nu; i++) { const p = P(i / nu, j / nv); row.push(cam.P(p[0], p[1], p[2])); } S.push(row); }
  let face = 0; const ok = (q) => q[2] > cam.near;
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const A = S[j][i], B = S[j][i + 1], Cc = S[j + 1][i + 1], D = S[j + 1][i];
    if (!(ok(A) && ok(B) && ok(Cc) && ok(D))) continue;
    if (o.cull) { const x0 = Math.min(A[0], B[0], Cc[0], D[0]), x1 = Math.max(A[0], B[0], Cc[0], D[0]), y0 = Math.min(A[1], B[1], Cc[1], D[1]), y1 = Math.max(A[1], B[1], Cc[1], D[1]); if (x1 < 0 || x0 > W || y1 < 0 || y0 > H) continue; }
    const cr = (B[0] - A[0]) * (D[1] - A[1]) - (B[1] - A[1]) * (D[0] - A[0]); const fr = cr > 0 ? 1 : -1;
    if (i === Math.floor(nu / 2) && j === Math.floor(nv / 2)) face = fr;
    if (fr < 0 && o.back !== undefined) {   // the back of the sheet: plain paper
      if (!o.back) continue;
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(Cc[0], Cc[1]); ctx.lineTo(D[0], D[1]); ctx.closePath(); ctx.fillStyle = o.back; ctx.fill(); continue;
    }
    const sx = iw * i / nu, sy = ih * j / nv, sw = iw / nu, sh = ih / nv;
    if (o.flat) {
      ctx.save(); ctx.transform((B[0] - A[0]) / sw, (B[1] - A[1]) / sw, (D[0] - A[0]) / sh, (D[1] - A[1]) / sh, A[0], A[1]); if (o.a != null) ctx.globalAlpha = o.a; ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh); ctx.restore(); continue;
    }
    const pad = o.pad ?? .6, mx = (A[0] + B[0] + Cc[0] + D[0]) / 4, my = (A[1] + B[1] + Cc[1] + D[1]) / 4, gr = (p) => { const dx = p[0] - mx, dy = p[1] - my, l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * pad, p[1] + dy / l * pad]; };
    const a2 = gr(A), b2 = gr(B), c2 = gr(Cc), d2 = gr(D);
    ctx.save(); ctx.beginPath(); ctx.moveTo(a2[0], a2[1]); ctx.lineTo(b2[0], b2[1]); ctx.lineTo(c2[0], c2[1]); ctx.lineTo(d2[0], d2[1]); ctx.closePath(); ctx.clip();
    ctx.transform((B[0] - A[0]) / sw, (B[1] - A[1]) / sw, (D[0] - A[0]) / sh, (D[1] - A[1]) / sh, A[0], A[1]);
    if (o.a != null) ctx.globalAlpha = o.a;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    ctx.restore();
  }
  return face;
}
// faces of an axis-aligned box that face the camera: [{ pts, n: [nx,ny,nz], side: 'top'|'bottom'|'xn'|'xp'|'zn'|'zp' }]
export function boxVis(cam, b) {
  const [px, py, pz] = cam.pos, out = [];
  const { x0, x1, y0, y1, z0, z1 } = b;
  if (py > y1) out.push({ side: 'top', n: [0, 1, 0], pts: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]] });
  if (py < y0) out.push({ side: 'bottom', n: [0, -1, 0], pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] });
  if (px < x0) out.push({ side: 'xn', n: [-1, 0, 0], pts: [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]] });
  if (px > x1) out.push({ side: 'xp', n: [1, 0, 0], pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]] });
  if (pz < z0) out.push({ side: 'zn', n: [0, 0, -1], pts: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]] });
  if (pz > z1) out.push({ side: 'zp', n: [0, 0, 1], pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] });
  return out;
}
// depth of a point along the view axis
export const depthOf = (cam, p) => { const d = [p[0] - cam.pos[0], p[1] - cam.pos[1], p[2] - cam.pos[2]]; return d[0] * cam.F[0] + d[1] * cam.F[1] + d[2] * cam.F[2]; };
export const distOf = (cam, p) => Math.hypot(p[0] - cam.pos[0], p[1] - cam.pos[1], p[2] - cam.pos[2]);
export class Painter {
  constructor() { this.a = []; }
  add(d, f) { this.a.push([d, f]); }
  draw(ctx) { this.a.sort((p, q) => q[0] - p[0]); for (const [, f] of this.a) f(ctx); this.a.length = 0; }
}
// a soft glow (additive) at a screen point
export function glowAt(ctx, x, y, r, col, a = 1, op = 'lighter') {
  if (r <= .5 || a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = op;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, css(col, a)); g.addColorStop(.25, css(col, a * .45)); g.addColorStop(1, css(col, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}
// screen-space sky gradient by elevation: stops [[elev (rad), [r,g,b]], …] ascending; drawn for the whole frame (roll ignored ~ small)
export function skyFill(ctx, cam, stops) {
  // the vertical screen line through the centre: elevation varies monotonically with y (for |roll| small)
  const yAt = (el) => { // solve elevAt(cx, y) = el by bisection on y
    let lo = -40 * H, hi = 41 * H;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (cam.elevAt(cam.cx, m) > el) lo = m; else hi = m; }
    return (lo + hi) / 2;
  };
  const ys = stops.map(([e]) => yAt(e)), y0 = ys[0], y1 = ys[ys.length - 1];
  if (!isFinite(y0) || !isFinite(y1) || Math.abs(y1 - y0) < 1) { ctx.fillStyle = css(stops[0][1]); ctx.fillRect(0, 0, W, H); return; }
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach(([, c], i) => g.addColorStop(clamp((ys[i] - y0) / (y1 - y0)), css(c)));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// mip chain of a texture canvas (each level half the size), registered as decoded images; mipPick → the level for a size in px
export function mips(key, mk, levels = 5) {
  return memo('mip:' + key, () => {
    let c = mk(); toImg(c); const out = [c];
    for (let i = 1; i < levels; i++) { const w = Math.max(4, Math.round(c.width / 2)), h = Math.max(4, Math.round(c.height / 2)), [d, g] = canvas(w, h); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(c, 0, 0, w, h); g.getImageData(0, 0, 1, 1); toImg(d); out.push(d); c = d; }
    return out;
  });
}
// px = the larger screen extent the texture will cover; the level just above that resolution
export const mipPick = (m, px, along = 'w') => { let i = 0; const dim = (c) => along === 'h' ? c.height : c.width; while (i < m.length - 1 && dim(m[i + 1]) >= px * 1.1) i++; return best(m[i]); };
export { mix, clamp };
