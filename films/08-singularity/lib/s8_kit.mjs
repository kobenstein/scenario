// Film 8 · shared helpers for the minute (own copies of Film 4 c17's kit, plus a camera that can tilt and turn).
//   toImg / best / ready / once      cached layers handed to the renderer as decoded Images; await ready() before the first frame
//   track(keys)                      smooth monotone cubic (PCHIP) through [t, v] keys, zero speed at both ends (no overshoot)
//   eoX eiX qio sio smooth01 u01     easings
//   camera({ x, y, z, yaw, pitch, F })   pinhole camera, metres, +Y up, +Z ahead at yaw 0; yaw > 0 turns right, pitch > 0 looks down
//     C.P(X, Y, Z) → [sx, sy, k] (k = px per metre at that depth) or null behind the near plane;  C.D(dx, dy, dz) a direction (stars)
//     C.hy = screen y of the horizon;  C.plane(o, u, v) → affine [a, b, c, d, e, f] of a small planar patch (draw in its local metres)
//   mixHex / shadeHex / hexRGB / hash / spline (Catmull-Rom path)
import { Image, GlobalFonts } from '@napi-rs/canvas';
import { clamp } from '../engine.mjs';

GlobalFonts.registerFromPath(new URL('../fonts/Anton.woff2', import.meta.url).pathname, 'Anton');

const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
export const onceRaw = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };

export const TAU = Math.PI * 2;
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const sio = (x) => { x = clamp(x); return -(Math.cos(Math.PI * x) - 1) / 2; };
export const u01 = (t, a, b) => clamp((t - a) / (b - a));
export const smooth01 = (a, b, t) => { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); };
export const pulse = (t, a, b) => (t <= a || t >= b ? 0 : Math.sin(Math.PI * (t - a) / (b - a)));
// a needle / card that settles: expo-out with one ≤ 5 % overshoot
export const settle = (u) => { u = clamp(u); return 1 - Math.pow(2, -9 * u) * Math.cos(u * 7.2); };

export function track(keys) {
  const n = keys.length, T = keys.map((k) => k[0]), V = keys.map((k) => k[1]), h = [], d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) { h.push(T[i + 1] - T[i]); d.push((V[i + 1] - V[i]) / (T[i + 1] - T[i])); }
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] === 0 || d[i] === 0 || Math.sign(d[i - 1]) !== Math.sign(d[i])) { m[i] = 0; continue; }
    const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  }
  for (let i = 0; i < n; i++) if (keys[i].length > 2) m[i] = keys[i][2];
  const f = (t) => {
    if (t <= T[0]) return V[0] + (n > 1 && keys[0].length > 2 ? m[0] * (t - T[0]) : 0);
    if (t >= T[n - 1]) return V[n - 1] + (keys[n - 1].length > 2 ? m[n - 1] * (t - T[n - 1]) : 0);
    let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
    const hh = h[i], s = (t - T[i]) / hh, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * V[i] + (s3 - 2 * s2 + s) * hh * m[i] + (-2 * s3 + 3 * s2) * V[i + 1] + (s3 - s2) * hh * m[i + 1];
  };
  f.keys = keys; return f;
}
// log-space track (dolly distances, focal lengths): keys in natural units, interpolated in log
export function trackLog(keys) { const f = track(keys.map((k) => [k[0], Math.log(k[1]), ...(k.length > 2 ? [k[2]] : [])])); return (t) => Math.exp(f(t)); }

export const W = 1920, H = 1080, CX = 960, CY = 540;
export function camera({ x = 0, y = 1.6, z = 0, yaw = 0, pitch = 0, F = 1400 } = {}) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const C = { x, y, z, yaw, pitch, F, hy: CY - F * Math.tan(pitch) };
  const view = (dx, dy, dz) => { const x1 = dx * cy - dz * sy, z1 = dx * sy + dz * cy, y2 = dy * cp + z1 * sp, z2 = -dy * sp + z1 * cp; return [x1, y2, z2]; };
  C.view = view;
  C.P = (X, Y, Z, near = .05) => { const [a, b, c] = view(X - x, Y - y, Z - z); if (c < near) return null; const k = F / c; return [CX + a * k, CY - b * k, k]; };
  C.D = (dx, dy, dz) => { const [a, b, c] = view(dx, dy, dz); if (c < 1e-4) return null; return [CX + a * F / c, CY - b * F / c]; };
  C.depth = (X, Y, Z) => view(X - x, Y - y, Z - z)[2];
  // affine of a planar patch at o with local unit vectors u, v (metres → screen), from the projection's derivatives at o
  C.plane = (o, u, v, e = .02) => {
    const p0 = C.P(o[0], o[1], o[2]); if (!p0) return null;
    const pu = C.P(o[0] + u[0] * e, o[1] + u[1] * e, o[2] + u[2] * e), pv = C.P(o[0] + v[0] * e, o[1] + v[1] * e, o[2] + v[2] * e); if (!pu || !pv) return null;
    return [(pu[0] - p0[0]) / e, (pu[1] - p0[1]) / e, (pv[0] - p0[0]) / e, (pv[1] - p0[1]) / e, p0[0], p0[1]];
  };
  return C;
}
// project a world polyline, cutting it at the near plane (returns screen runs)
export function projRuns(C, pts, near = .1) {
  const runs = []; let cur = null, prev = null, prevD = 0;
  for (const p of pts) {
    const d = C.depth(p[0], p[1], p[2]);
    if (d >= near) {
      if (!cur) { cur = []; if (prev && prevD < near) { const u = (near - prevD) / (d - prevD), q = prev.map((v, i) => v + (p[i] - v) * u), s = C.P(q[0], q[1], q[2], near * .99); if (s) cur.push(s); } runs.push(cur); }
      cur.push(C.P(p[0], p[1], p[2], near * .99));
    } else if (cur) { const u = (near - prevD) / (d - prevD), q = prev.map((v, i) => v + (p[i] - v) * u), s = C.P(q[0], q[1], q[2], near * .99); if (s) cur.push(s); cur = null; }
    prev = p; prevD = d;
  }
  return runs;
}
// project a world polygon, clipped at the near plane (Sutherland–Hodgman in view space) → screen points (or [] if all behind)
export function projPoly(C, pts, near = .08) {
  const V = pts.map((p) => C.view(p[0] - C.x, p[1] - C.y, p[2] - C.z)), out = [];
  for (let i = 0; i < V.length; i++) {
    const a = V[i], b = V[(i + 1) % V.length], ain = a[2] >= near, bin = b[2] >= near;
    if (ain) out.push(a);
    if (ain !== bin) { const u = (near - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, near]); }
  }
  return out.map(([a, b, c]) => [CX + a * C.F / c, CY - b * C.F / c]);
}
export function fillPoly(ctx, P, fill) { if (P.length < 3) return false; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } return true; }
export const hexRGB = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const mixHex = (a, b, u) => { const A = hexRGB(a), B = hexRGB(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(u)).toString(16).padStart(2, '0')).join(''); };
export const shadeHex = (h, d) => mixHex(h, d > 0 ? '#ffffff' : '#000000', Math.abs(d));
export const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
export function spline(ctx, P, closed = true, move = true) {
  const n = P.length, g = (i) => P[closed ? (i + n) % n : clamp(i, 0, n - 1)];
  if (move) ctx.moveTo(P[0][0], P[0][1]);
  const m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]); }
  if (closed) ctx.closePath();
}
// smooth 1D noise (sum of sines with crooked frequencies), -1..1
export const nz = (x, s = 0) => Math.sin(x + s) * .5 + Math.sin(x * 2.31 + 1.3 + s * 1.7) * .3 + Math.sin(x * 5.17 + 2.1 + s * 2.9) * .2;
export const PAL = {
  deep: ['#04050f', '#0a0d26', '#141436'], horizon: '#1f1c47',
  amber: '#ffb35c', amberCore: '#fff1d6', amberDeep: '#c4512e',
  cool: '#8fe6ff', coolCore: '#d8f7ff', coolDeep: '#0a6f8c',
  paper: '#f3ecda', paperAged: '#e2cfa4', ink: '#2a2420', brass: '#b8894a', brassLight: '#f0c27a',
  cream: '#f3efe2', muted: '#a49fc4', rim: '#a4b0dc',
};
