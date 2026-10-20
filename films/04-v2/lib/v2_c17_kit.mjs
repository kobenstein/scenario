// c17 · small shared helpers (own copies, never imported from other chunks or the minute):
//   toImg / best / ready / once   cached layers handed to the renderer as decoded Images (@napi-rs/canvas keeps a copy of every Canvas
//                                 drawn with drawImage, an Image it does not); the scene awaits ready() before the first frame
//   track(keys)                   a smooth camera track through [t, value] keys (monotone cubic, no overshoot; zero speed at both ends)
//   eoX / eiX / qio / sio         expo-out (landings), expo-in (exits), quart in-out (moves), sine in-out
//   smooth01(a, b, t)             smoothstep of t between a and b
import { Image } from '@napi-rs/canvas';
import { clamp } from '../engine.mjs';

const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
export const onceRaw = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };

export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const sio = (x) => { x = clamp(x); return -(Math.cos(Math.PI * x) - 1) / 2; };
export const smooth01 = (a, b, t) => { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); };

// monotone piecewise-cubic Hermite (PCHIP) through keys [[t, v], …]; first and last keys get zero speed unless a third entry gives one
export function track(keys) {
  const n = keys.length, T = keys.map((k) => k[0]), V = keys.map((k) => k[1]), h = [], d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) { h.push(T[i + 1] - T[i]); d.push((V[i + 1] - V[i]) / (T[i + 1] - T[i])); }
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] === 0 || d[i] === 0 || Math.sign(d[i - 1]) !== Math.sign(d[i])) { m[i] = 0; continue; }
    const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  }
  for (let i = 0; i < n; i++) if (keys[i].length > 2) m[i] = keys[i][2];
  const f = (t) => {
    if (t <= T[0]) return V[0]; if (t >= T[n - 1]) return V[n - 1];
    let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
    const hh = h[i], s = (t - T[i]) / hh, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * V[i] + (s3 - 2 * s2 + s) * hh * m[i] + (-2 * s3 + 3 * s2) * V[i + 1] + (s3 - s2) * hh * m[i + 1];
  };
  f.keys = keys; return f;
}

// ---------------------------------------------------------------- the c17 camera: no rotation, a shift lens (pan, dl) and a dolly in 3D
//   screen x = W/2 + pan + (X − x)·F/(Z − z),  y = (HZ − dl) − (Y − y)·F/(Z − z)   (metres; +Y up, +Z away from the camera)
//   the horizon (eye level at infinity) is at screen y = HZ − dl; the sky (v2_c17_sky) uses the same pan / dl.
export const F = 1400, HZ = 1300;
export function camera(x, y, z, dl, pan = 0) {
  const C = { x, y, z, dl, pan, F, hy: HZ - dl };
  C.P = (X, Y, Z) => { const d = Z - z; if (d < .03) return null; const k = F / d; return [960 + pan + (X - x) * k, HZ - dl - (Y - y) * k, k]; };
  C.k = (Z) => F / Math.max(.03, Z - z);
  return C;
}
// the ground plane Y = g near a world point (X0, Z0) as an affine screen map: ctx.setTransform(...C.groundAffine(X0, Z0)) then draw in metres (x → X, y → Z)
export function groundAffine(C, X0, Z0, g = 0) {
  const p = C.P(X0, g, Z0); if (!p) return null; const [sx, sy, k] = p, d = Z0 - C.z;
  return [k, 0, -(X0 - C.x) * k / d, (g - C.y) * k / d, sx, sy];
}
export const hexRGB = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const mixHex = (a, b, u) => { const A = hexRGB(a), B = hexRGB(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(u)).toString(16).padStart(2, '0')).join(''); };
export const shadeHex = (h, d) => mixHex(h, d > 0 ? '#ffffff' : '#000000', Math.abs(d));
export const u01 = (t, a, b) => clamp((t - a) / (b - a));
export const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
