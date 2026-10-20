// C08 core: caches (canvas → Image, no per-frame canvas copies), easing, one pinhole camera for the whole chunk, polygon
// clipping/projection, textured quads, the exact paper-plate replica under a transform, small text helpers.
//   cam3({ x, y, z, yaw, pitch, roll, f })  world: X right, Y up, Z forward (into the picture at yaw 0); yaw + turns right, pitch + looks up
//     → { P(x,y,z) → [sx, sy, zc], C(x,y,z) → [xc, yc, zc] (camera space), S(xc,yc,zc) → [sx, sy], poly(pts3) → screen pts (near-clipped) }
//   paperPlateM(ctx, t, M, o)   handoff4's paper plate (cream) drawn under the plate→screen affine M = [a,b,c,d,e,f]: identical to
//                               plate(ctx, t, 'paper', {tone:'cream'}) when M = identity and o = {} (without the screen vignette)
import { Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, drift, canvas, text } from '../engine.mjs';

export const TAU = Math.PI * 2;

// ---------------------------------------------------------------- caches: a Canvas is handed to the renderer as a decoded Image
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
const RAW = new Map();
export const memo = (k, f) => { if (!RAW.has(k)) RAW.set(k, f()); return RAW.get(k); };   // plain values (paths, point lists)

// ---------------------------------------------------------------- easing (MOTION.md: expo-out landings, expo-in exits, quart in-out moves)
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const sio = (x) => { x = clamp(x); return -(Math.cos(Math.PI * x) - 1) / 2; };
export const eo3 = (x) => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
export const ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const fract = (v) => v - Math.floor(v);
export const hash = (i, j = 0) => fract(Math.sin(i * 127.1 + j * 311.7) * 43758.5453);
export const lerpA = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
export const hexMix = (a, b, k) => {
  const p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16), f = (s) => Math.round(((p >> s) & 255) + (((q >> s) & 255) - ((p >> s) & 255)) * clamp(k));
  return '#' + [16, 8, 0].map((s) => f(s).toString(16).padStart(2, '0')).join('');
};
// smooth 1D value noise (deterministic)
export function noise1(x, seed = 0) { const i = Math.floor(x), u = x - i, s = u * u * (3 - 2 * u); return mix(hash(i, seed) * 2 - 1, hash(i + 1, seed) * 2 - 1, s); }

// monotone-ish cubic through time keys: keys = [[t, v], …] (v number) — Catmull-Rom on non-uniform times, clamped at the ends
export function track(keys) {
  const n = keys.length;
  const slope = (i) => {
    if (i <= 0 || i >= n - 1) return 0;
    const [t0, v0] = keys[i - 1], [, v1] = keys[i], [t2, v2] = keys[i + 1];
    const d0 = v1 - v0, d1 = v2 - v1; if (d0 * d1 <= 0) return 0;      // a local extreme stays put (no overshoot)
    return (v2 - v0) / (t2 - t0);
  };
  const m = keys.map((_, i) => (keys[i][2] != null ? keys[i][2] : slope(i)));
  return (t) => {
    if (t <= keys[0][0]) return keys[0][1];
    if (t >= keys[n - 1][0]) return keys[n - 1][1];
    let i = 0; while (i < n - 2 && t > keys[i + 1][0]) i++;
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1], h = t1 - t0, u = (t - t0) / h, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * v0 + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * v1 + (u3 - u2) * h * m[i + 1];
  };
}

// ---------------------------------------------------------------- the pinhole camera
export function cam3(o) {
  const yaw = o.yaw || 0, pitch = o.pitch || 0, roll = o.roll || 0, f = o.f || 1400, cx = o.cx ?? W / 2, cy = o.cy ?? H / 2;
  const cp = Math.cos(pitch), sp = Math.sin(pitch), cyw = Math.cos(yaw), syw = Math.sin(yaw);
  const F = [syw * cp, sp, cyw * cp], R0 = [cyw, 0, -syw];
  const U0 = [F[1] * R0[2] - F[2] * R0[1], F[2] * R0[0] - F[0] * R0[2], F[0] * R0[1] - F[1] * R0[0]];   // F × R
  const cr = Math.cos(roll), sr = Math.sin(roll);
  const R = [R0[0] * cr + U0[0] * sr, R0[1] * cr + U0[1] * sr, R0[2] * cr + U0[2] * sr];
  const U = [U0[0] * cr - R0[0] * sr, U0[1] * cr - R0[1] * sr, U0[2] * cr - R0[2] * sr];
  const px = o.x, py = o.y, pz = o.z, near = o.near ?? .02;
  const C = (x, y, z) => { const dx = x - px, dy = y - py, dz = z - pz; return [dx * R[0] + dy * R[1] + dz * R[2], dx * U[0] + dy * U[1] + dz * U[2], dx * F[0] + dy * F[1] + dz * F[2]]; };
  const S = (xc, yc, zc) => [cx + f * xc / zc, cy - f * yc / zc];
  const P = (x, y, z) => { const c = C(x, y, z); return c[2] > near ? [cx + f * c[0] / c[2], cy - f * c[1] / c[2], c[2]] : [NaN, NaN, c[2]]; };
  // polygon: camera-space clip against z > near, then project; returns [] when nothing is in front
  const poly = (pts) => {
    const cs = pts.map((p) => C(p[0], p[1], p[2])), out = [];
    for (let i = 0; i < cs.length; i++) {
      const a = cs[i], b = cs[(i + 1) % cs.length], ia = a[2] > near, ib = b[2] > near;
      if (ia) out.push(a);
      if (ia !== ib) { const u = (near - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, near]); }
    }
    return out.map((c) => S(c[0], c[1], c[2]));
  };
  // a segment, clipped
  const seg3 = (a, b) => {
    let A = C(a[0], a[1], a[2]), B = C(b[0], b[1], b[2]);
    if (A[2] <= near && B[2] <= near) return null;
    if (A[2] <= near) { const u = (near - A[2]) / (B[2] - A[2]); A = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, near]; }
    if (B[2] <= near) { const u = (near - B[2]) / (A[2] - B[2]); B = [B[0] + (A[0] - B[0]) * u, B[1] + (A[1] - B[1]) * u, near]; }
    return [S(A[0], A[1], A[2]), S(B[0], B[1], B[2])];
  };
  return { o, f, cx, cy, F, R, U, pos: [px, py, pz], near, C, S, P, poly, seg3, depth: (x, y, z) => C(x, y, z)[2] };
}
// interpolate two camera states (log focal, linear rest)
export const camMix = (a, b, k) => ({ x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), z: mix(a.z, b.z, k), yaw: mix(a.yaw || 0, b.yaw || 0, k), pitch: mix(a.pitch || 0, b.pitch || 0, k), roll: mix(a.roll || 0, b.roll || 0, k), f: Math.exp(mix(Math.log(a.f || 1400), Math.log(b.f || 1400), k)) });

// ---------------------------------------------------------------- drawing helpers
export function pathPts(ctx, pts, close = true) { if (!pts.length) return false; ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); if (close) ctx.closePath(); return true; }
export function fillPts(ctx, pts, style) { if (pts.length < 3) return; ctx.beginPath(); pathPts(ctx, pts); ctx.fillStyle = style; ctx.fill(); }
export function strokePts(ctx, pts, style, w, close = false) { if (pts.length < 2) return; ctx.beginPath(); pathPts(ctx, pts, close); ctx.strokeStyle = style; ctx.lineWidth = w; ctx.stroke(); }
// affine map that sends image corners (0,0),(iw,0),(0,ih) to screen points a, b, d
export function affine3(ctx, a, b, d, iw, ih) { ctx.transform((b[0] - a[0]) / iw, (b[1] - a[1]) / iw, (d[0] - a[0]) / ih, (d[1] - a[1]) / ih, a[0], a[1]); }
// a textured planar quad in 3D: corners q = [p00, p10, p11, p01] (image TL, TR, BR, BL), split into n bands along v (rows) and m along u;
// each cell is drawn affine (good for small cells). Cells behind the camera are skipped.
export function quadTex(ctx, cam, img, q, n = 1, m = 1, o = {}) {
  const iw = img.width, ih = img.height, lerp3 = (p, r, k) => [p[0] + (r[0] - p[0]) * k, p[1] + (r[1] - p[1]) * k, p[2] + (r[2] - p[2]) * k];
  const at = (u, v) => lerp3(lerp3(q[0], q[1], u), lerp3(q[3], q[2], u), v);
  for (let j = 0; j < n; j++) for (let i = 0; i < m; i++) {
    const u0 = i / m, u1 = (i + 1) / m, v0 = j / n, v1 = (j + 1) / n;
    const A = cam.P(...at(u0, v0)), B = cam.P(...at(u1, v0)), Cc = cam.P(...at(u1, v1)), D = cam.P(...at(u0, v1));
    if (!(A[2] > cam.near && B[2] > cam.near && Cc[2] > cam.near && D[2] > cam.near)) continue;
    const sx = iw * u0, sy = ih * v0, sw = iw * (u1 - u0), sh = ih * (v1 - v0), pad = o.pad ?? .6;
    ctx.save(); ctx.beginPath();
    // a cell polygon grown by a fraction of a pixel so neighbouring cells do not leave hairline seams
    const cxm = (A[0] + B[0] + Cc[0] + D[0]) / 4, cym = (A[1] + B[1] + Cc[1] + D[1]) / 4, grow = (p) => { const dx = p[0] - cxm, dy = p[1] - cym, l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * pad, p[1] + dy / l * pad]; };
    pathPts(ctx, [grow(A), grow(B), grow(Cc), grow(D)]); ctx.clip();
    // affine from the cell's TL, TR, BL (the BR corner follows approximately)
    ctx.transform((B[0] - A[0]) / sw, (B[1] - A[1]) / sw, (D[0] - A[0]) / sh, (D[1] - A[1]) / sh, A[0], A[1]);
    ctx.globalAlpha = o.a ?? 1; ctx.drawImage(img, -sx, -sy);
    ctx.restore();
  }
}

// ---------------------------------------------------------------- the paper plate (handoff4.mjs, tone cream), replicated exactly
const PAPER = ['#f3ecda', '#e3d6b8', '#cdbb94'];
export const PLATE_FIB = (() => { const r = prng(77), f = []; for (let i = 0; i < 420; i++) f.push([r() * W, r() * H, (r() - .5) * 2.4, 6 + r() * 26, r()]); return f; })();
// more fibres around the plate region (plate px), same statistics, for the paper that comes into view when the camera pulls back
const MORE_FIB = (() => { const r = prng(7701), f = []; for (let i = 0; i < 3400; i++) { const x = (r() * 5 - 2) * W, y = (r() * 5 - 2) * H; if (x > -40 && x < W + 40 && y > -40 && y < H + 40) continue; f.push([x, y, (r() - .5) * 2.4, 6 + r() * 26, r()]); } return f; })();
export const PLATE_ROS = { x: W * .72, y: H * .56, R0: 300 };
export function rosRing(k, t, n = 360) {   // ring k of the plate watermark (plate px), at time t
  const rot = t * .02, out = [];
  for (let i = 0; i <= n; i++) { const q = i / n * TAU, rr = PLATE_ROS.R0 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); out.push([PLATE_ROS.x + rr * Math.cos(q + rot), PLATE_ROS.y + rr * Math.sin(q + rot) * .92]); }
  return out;
}
// o: { light: [lx, ly, R] override (plate px), fibA (alpha factor for fibres, 1), more (0..1 the extra fibres), rosA (1), area: [x0,y0,x1,y1] plate px to fill }
export function paperPlateM(ctx, t, M, o = {}) {
  ctx.save(); ctx.setTransform(M[0], M[1], M[2], M[3], M[4], M[5]); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const [p0, p1, p2] = PAPER, L = o.light || [W * .32 + 30 * drift(t, 1, 2), H * .25, 1700];
  const g = ctx.createRadialGradient(L[0], L[1], 0, L[0], L[1], L[2]); g.addColorStop(0, p0); g.addColorStop(.6, p1); g.addColorStop(1, p2);
  ctx.fillStyle = g; const A = o.area || [0, 0, W, H]; ctx.fillRect(A[0], A[1], A[2] - A[0], A[3] - A[1]);
  ctx.lineCap = 'round';
  const fa = o.fibA ?? 1;
  if (fa > 0) {
    for (const [x, y, a, Ln, k] of PLATE_FIB) { ctx.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', (.07 + .06 * k) * fa); ctx.lineWidth = .7 + k * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * Ln, y + Math.sin(a) * Ln); ctx.stroke(); }
    const mo = (o.more ?? 0) * fa;
    if (mo > 0) for (const [x, y, a, Ln, k] of MORE_FIB) { if (o.cull && !o.cull(x, y)) continue; ctx.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', (.07 + .06 * k) * mo); ctx.lineWidth = .7 + k * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * Ln, y + Math.sin(a) * Ln); ctx.stroke(); }
  }
  const ra = o.rosA ?? 1;
  if (ra > 0) {
    ctx.strokeStyle = rgba('#9c8458', .1 * ra); ctx.lineWidth = .8; const R0 = 300, rot = t * .02;
    for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let i = 0; i <= 360; i++) { const q = i / 360 * TAU, rr = R0 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); const x = W * .72 + rr * Math.cos(q + rot), y = H * .56 + rr * Math.sin(q + rot) * .92; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  }
  ctx.restore();
}
// the plate's own screen-space vignette (drawn last), a = 1 at the plate
export function paperVignette(ctx, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .75); v.addColorStop(0, 'rgba(60,40,20,0)'); v.addColorStop(1, `rgba(60,40,20,${.22 * a})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ---------------------------------------------------------------- text
// a label that rises out of a mask (no alpha fade): u 0..1 (0 hidden below its baseline, 1 in place)
export function riseText(ctx, s, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 18, font = o.font || 'Inter', weight = o.weight ?? 600;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 400, y - size * 1.3, 2000, size * 1.3 + size * .35); ctx.clip();
  if (o.shadow !== false) { ctx.shadowColor = o.shadowCol || 'rgba(2,3,12,.75)'; ctx.shadowBlur = o.blur ?? 10; }
  text(ctx, s, x, y + (1 - u) * size * 1.25, { size, font, weight, color: o.col || '#f3efe2', alpha: o.alpha ?? 1, spacing: o.spacing ?? 0, align: o.align || 'left' });
  ctx.restore();
}
export { W, H, rgba, clamp, mix, prng, drift, canvas, text };
