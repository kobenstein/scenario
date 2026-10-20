// Film 4 v2 · c10 kit: leak-free caches, easing, a pinhole 3D camera with near-plane clipping, engraved line work in 3D,
// light sprites and particles. Everything a pure function of its inputs (prng only).
//   toImg / best / ready / once      cached layers become Images once (@napi-rs/canvas keeps a copy of a Canvas per drawImage)
//   eoX eiX qio sm2 ease keys(t, K)  expo-out landings, expo-in exits, quart in-out moves; keys = eased piecewise numbers
//   cam(o)                           o: { x, y, z, yaw, pitch, roll, f, ox, oy } world: X right, Y up, Z forward (into the scene)
//     .c(X,Y,Z) → camera space [x, y, z]   .s([x,y,z]) → screen [sx, sy]   .p(X,Y,Z) → [sx, sy, depth] (null behind the near plane)
//   poly3(ctx, C, pts) → screen polygon (near-clipped) traced as the current path, or null
//   seg3(ctx, C, a, b)  adds a clipped 3D segment to the current path
//   glowImg(r, col, o) cached radial stipple glow (Image), glowAt(ctx, img, x, y, r, a, op)
import { Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { mixHex, shade } from './artbase.mjs';
export { mixHex, shade };

export const TAU = Math.PI * 2;
// ---------------------------------------------------------------- cached layers (copied from lib/sc01_m1_open.mjs: toImg/best/ready/once)
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };

// ---------------------------------------------------------------- easing
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const sm2 = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const smr = (a, b, t) => sm2((t - a) / (b - a));
export const fract = (v) => v - Math.floor(v);
export const hash = (i, j = 0) => fract(Math.sin(i * 127.1 + j * 311.7) * 43758.5453);
// piecewise keys [[t, v], …] (v number or array), eased between keys with e (default quart in-out)
export function keys(t, K, e = qio) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) {
    const [t0, a] = K[i - 1], [t1, b, ee] = K[i], u = (ee || e)((t - t0) / (t1 - t0));
    return Array.isArray(a) ? a.map((v, j) => mix(v, b[j], u)) : mix(a, b, u);
  }
  return K[K.length - 1][1];
}
// smooth monotone path through keys with C1 continuity (Catmull-Rom in time, values clamped between neighbours): for camera paths
export function spline(t, K) {
  const n = K.length; if (t <= K[0][0]) return K[0][1]; if (t >= K[n - 1][0]) return K[n - 1][1];
  let i = 0; while (i < n - 2 && t > K[i + 1][0]) i++;
  const P = (j) => K[Math.max(0, Math.min(n - 1, j))], [t1, p1] = P(i), [t2, p2] = P(i + 1), [t0, p0] = P(i - 1), [t3, p3] = P(i + 2), h = t2 - t1, u = (t - t1) / h;
  const tan = (pa, pb, ta, tb, ea, eb) => (ea === eb ? 0 : (pb - pa) / (tb - ta)), sc = (a, b, c, d) => a;
  const one = (a0, a1, a2, a3) => {
    let m1 = i === 0 ? 0 : (a2 - a0) / (t2 - t0), m2 = i + 2 >= n ? 0 : (a3 - a1) / (t3 - t1);
    if ((a1 - a0) * (a2 - a1) <= 0) m1 = 0; if ((a2 - a1) * (a3 - a2) <= 0) m2 = 0;   // extrema stay put (no overshoot)
    const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * a1 + (u3 - 2 * u2 + u) * h * m1 + (-2 * u3 + 3 * u2) * a2 + (u3 - u2) * h * m2;
  };
  if (Array.isArray(p1)) return p1.map((_, j) => one(p0[j], p1[j], p2[j], p3[j]));
  return one(p0, p1, p2, p3);
}

// ---------------------------------------------------------------- colour
export const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const mixA = (a, b, u) => mixHex(a, b, clamp(u));
export const lum = (h) => { const [r, g, b] = hx(h); return .299 * r + .587 * g + .114 * b; };

// ---------------------------------------------------------------- pinhole camera
export function cam(o) {
  const yaw = o.yaw || 0, pit = o.pitch || 0, rol = o.roll || 0, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit), cr = Math.cos(rol), sr = Math.sin(rol);
  const f = o.f || 1400, ox = o.ox ?? W / 2, oy = o.oy ?? H / 2, near = o.near ?? .05, X0 = o.x, Y0 = o.y, Z0 = o.z;
  const c = (X, Y, Z) => {
    const dx = X - X0, dy = Y - Y0, dz = Z - Z0, x1 = dx * cy - dz * sy, z1 = dx * sy + dz * cy, y2 = dy * cp - z1 * sp, z2 = dy * sp + z1 * cp;
    return [x1 * cr + y2 * sr, -x1 * sr + y2 * cr, z2];
  };
  const s = (q) => [ox + f * q[0] / q[2], oy - f * q[1] / q[2]];
  const p = (X, Y, Z) => { const q = c(X, Y, Z); if (q[2] < near) return null; const r = s(q); r.push(q[2]); return r; };
  // screen point → world ray direction (for picking a world point under a screen point at a given plane)
  const ray = (sx, sy) => { const xc = (sx - ox) / f, yc = -(sy - oy) / f, zc = 1; const x1 = xc * cr - yc * sr, y2 = xc * sr + yc * cr;
    const dy = y2 * cp + zc * sp, z1 = -y2 * sp + zc * cp; return [x1 * cy + z1 * sy, dy, -x1 * sy + z1 * cy]; };
  return { c, s, p, f, ox, oy, near, x: X0, y: Y0, z: Z0, yaw, pitch: pit, roll: rol, k: (d) => f / d, ray };
}
// clip a camera-space polygon against z >= near (Sutherland–Hodgman), project to screen
export function clipProj(C, Q) {
  const n = C.near, out = [];
  for (let i = 0; i < Q.length; i++) {
    const a = Q[i], b = Q[(i + 1) % Q.length], ia = a[2] >= n, ib = b[2] >= n;
    if (ia) out.push(a);
    if (ia !== ib) { const u = (n - a[2]) / (b[2] - a[2]); out.push([mix(a[0], b[0], u), mix(a[1], b[1], u), n]); }
  }
  return out.length >= 3 ? out.map((q) => C.s(q)) : null;
}
export function proj3(C, pts) { return clipProj(C, pts.map(([X, Y, Z]) => C.c(X, Y, Z))); }
export function trace(ctx, S) { ctx.moveTo(S[0][0], S[0][1]); for (let i = 1; i < S.length; i++) ctx.lineTo(S[i][0], S[i][1]); ctx.closePath(); }
export function poly3(ctx, C, pts, begin = true) { const S = proj3(C, pts); if (!S) return null; if (begin) ctx.beginPath(); trace(ctx, S); return S; }
export function fill3(ctx, C, pts, col) { const S = poly3(ctx, C, pts); if (S) { ctx.fillStyle = col; ctx.fill(); } return S; }
// a clipped segment added to the current path
export function seg3(ctx, C, a, b) {
  let A = C.c(a[0], a[1], a[2]), B = C.c(b[0], b[1], b[2]); const n = C.near;
  if (A[2] < n && B[2] < n) return false;
  if (A[2] < n) { const u = (n - A[2]) / (B[2] - A[2]); A = [mix(A[0], B[0], u), mix(A[1], B[1], u), n]; }
  else if (B[2] < n) { const u = (n - B[2]) / (A[2] - B[2]); B = [mix(B[0], A[0], u), mix(B[1], A[1], u), n]; }
  const p = C.s(A), q = C.s(B); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); return true;
}
// a polyline in 3D (adds to the current path)
export function line3(ctx, C, pts) { for (let i = 0; i < pts.length - 1; i++) seg3(ctx, C, pts[i], pts[i + 1]); }
// bilinear point on a 3D quad [A, B, C, D] (A→B = u, A→D = v)
export const quadAt = (Q, u, v) => { const [A, B, Cc, D] = Q; return [0, 1, 2].map((i) => mix(mix(A[i], B[i], u), mix(D[i], Cc[i], u), v)); };
// engraved hatch across a 3D quad: n lines from v=0 to v=1 slanted by k (u shift), clipped to the quad, added to the current path
export function hatchQuad(ctx, C, Q, n, k = .3, r = null, u0 = 0, u1 = 1) {
  for (let i = 0; i <= n; i++) {
    const u = mix(u0 - Math.max(0, k), u1 - Math.min(0, k), i / n) + (r ? (r() - .5) * .6 / n : 0);
    // the line (u + k s, s), s in [0, 1], clipped to u0 <= u + k s <= u1
    let s0 = 0, s1 = 1;
    if (Math.abs(k) < 1e-9) { if (u < u0 || u > u1) continue; }
    else { const a = (u0 - u) / k, b = (u1 - u) / k; s0 = Math.max(0, Math.min(a, b)); s1 = Math.min(1, Math.max(a, b)); }
    if (s1 - s0 < .02) continue;
    seg3(ctx, C, quadAt(Q, u + k * s0, s0), quadAt(Q, u + k * s1, s1));
  }
}
// screen-space helpers
export function poly(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }
export const inFrame = (S, m = 0) => S && S.some(([x, y]) => x > -m && x < W + m && y > -m && y < H + m);
export const bboxS = (S) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of S) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return [x0, y0, x1, y1]; };
export const visible = (S) => { if (!S) return false; const [x0, y0, x1, y1] = bboxS(S); return x1 > 0 && x0 < W && y1 > 0 && y0 < H; };

// ---------------------------------------------------------------- light sprites (cached Images)
// a soft stippled radial glow: dense dots in the core thinning outward (the print look of light)
export function glowImg(col, o = {}) {
  const R = o.R || 128, k = `glow:${col}:${R}:${o.dots ?? 1}:${o.core ?? .25}`;
  return once(k, () => {
    const [c, g] = canvas(R * 2, R * 2), [r, gg, b] = hx(col), gr = g.createRadialGradient(R, R, 0, R, R, R);
    gr.addColorStop(0, `rgba(${r},${gg},${b},${o.core ?? .25})`); gr.addColorStop(.35, `rgba(${r},${gg},${b},${(o.core ?? .25) * .35})`); gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2);
    if (o.dots !== 0) { const rn = prng(31 + R); g.fillStyle = `rgba(${r},${gg},${b},.55)`; for (let i = 0; i < R * R * .5 * (o.dots ?? 1); i++) { const a = rn() * TAU, d = Math.pow(rn(), .7) * R; if (rn() > Math.pow(1 - d / R, 1.6)) continue; const s = .6 + rn() * .9; g.fillRect(R + Math.cos(a) * d, R + Math.sin(a) * d, s, s); } }
    return c;
  });
}
export function glowAt(ctx, img, x, y, r, a = 1, op = 'lighter', sy = 1) {
  if (a <= 0.003 || r < 1) return; ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(img, x - r, y - r * sy, r * 2, r * 2 * sy); ctx.restore();
}
// flat radial gradient glow (no sprite)
export function radial(ctx, x, y, r, col, a, op = 'source-over', sy = 1) {
  if (a <= .003 || r < 1) return; const [cr, cg, cb] = hx(col);
  ctx.save(); ctx.globalCompositeOperation = op; ctx.translate(x, y); ctx.scale(1, sy);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`); g.addColorStop(.4, `rgba(${cr},${cg},${cb},${a * .38})`); g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore();
}
// linear vertical gradient fill of the frame region
export function vgrad(ctx, stops, y0 = 0, y1 = H, x0 = 0, x1 = W) {
  const g = ctx.createLinearGradient(0, y0, 0, y1); for (const [u, c] of stops) g.addColorStop(u, c); ctx.fillStyle = g; ctx.fillRect(x0, Math.min(y0, y1), x1 - x0, Math.abs(y1 - y0));
}
export { rgba, clamp, mix, prng, canvas, W, H };

// ---------------------------------------------------------------- 3D solids and billboards
// an axis-aligned box: visible faces only (convex, so no sorting among them). col(face) → fill (face: 'x0' 'x1' 'y0' 'y1' 'z0' 'z1')
export function box3(ctx, C, x0, y0, z0, x1, y1, z1, col, line = null) {
  const F = [];
  if (C.x < x0) F.push(['x0', [[x0, y0, z1], [x0, y0, z0], [x0, y1, z0], [x0, y1, z1]]]);
  if (C.x > x1) F.push(['x1', [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]]]);
  if (C.y > y1) F.push(['y1', [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]]);
  if (C.y < y0) F.push(['y0', [[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0]]]);
  if (C.z < z0) F.push(['z0', [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]]);
  if (C.z > z1) F.push(['z1', [[x1, y0, z1], [x0, y0, z1], [x0, y1, z1], [x1, y1, z1]]]);
  for (const [k, q] of F) { const c = col(k); if (!c) continue; const S = poly3(ctx, C, q); if (!S) continue; ctx.fillStyle = c; ctx.fill(); if (line) { ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke(); } }
}
// project a world point and return { x, y, d, k } (k = px per metre at that depth) or null
export function at3(C, X, Y, Z) { const p = C.p(X, Y, Z); return p ? { x: p[0], y: p[1], d: p[2], k: C.f / p[2] } : null; }
// a painter's list: add(depth, fn), run() far → near
export function painter() { const L = []; return { add: (d, f) => L.push([d, f]), run: () => { L.sort((a, b) => b[0] - a[0]); for (const [, f] of L) f(); } }; }
