// c14 (Film 4 v2) · small shared helpers: a metric pinhole camera with near-plane clipping, cached layers as Images (the
// @napi-rs/canvas copy-on-drawImage leak), easings, colour mixing. Everything deterministic.
//   cam(o) → P(X, Y, Z) → [sx, sy, zc]        o: { x, y, z, yaw (+ right), pitch (+ up), F, ox, oy }  world y up, looks along -Z
//   P.cs(X, Y, Z) → camera space [xc, yc, zc];  P.sp([xc, yc, zc]) → screen;  P.poly(ctx, pts) clipped polygon path (false if empty)
//   lookAt(from, to) → { yaw, pitch }
//   once(key, f) cached canvas → Image (after ready());  toImg / best / ready (pattern of lib/sc01_m1_open.mjs, copied)
import { Image } from '@napi-rs/canvas';
import { W, H, clamp, mix } from '../engine.mjs';

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
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const sio = (x) => { x = clamp(x); return -(Math.cos(Math.PI * x) - 1) / 2; };
export const smo = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const smoother = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// colours
const HEX = new Map();
export const hexRGB = (h) => { let v = HEX.get(h); if (!v) { v = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; HEX.set(h, v); } return v; };
export const mixRGB = (a, b, u) => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
export const css = (c, a = 1) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
export const mixHex = (a, b, u, al = 1) => css(mixRGB(hexRGB(a), hexRGB(b), clamp(u)), al);

// ---------------------------------------------------------------- the camera (metres)
export function cam(o) {
  const cy = Math.cos(o.yaw || 0), sy = Math.sin(o.yaw || 0), cp = Math.cos(o.pitch || 0), sp = Math.sin(o.pitch || 0);
  const F = o.F || 1400, ox = o.ox ?? W / 2, oy = o.oy ?? H / 2, NEAR = o.near ?? .01;
  const cs = (X, Y, Z) => {
    const dx = X - o.x, dy = Y - o.y, dz = Z - o.z;
    const xc = dx * cy + dz * sy, zc0 = dx * sy - dz * cy;
    return [xc, dy * cp - zc0 * sp, dy * sp + zc0 * cp];
  };
  const spt = (c) => { const q = F / Math.max(1e-6, c[2]); return [ox + c[0] * q, oy - c[1] * q, c[2]]; };
  const P = (X, Y, Z) => spt(cs(X, Y, Z));
  P.F = F; P.o = o; P.cs = cs; P.sp = spt; P.NEAR = NEAR;
  // clipped polygon (Sutherland–Hodgman against zc >= NEAR) → screen points or null
  P.clip = (pts) => {
    const C = pts.map((p) => cs(p[0], p[1], p[2])), out = [];
    for (let i = 0; i < C.length; i++) {
      const a = C[i], b = C[(i + 1) % C.length], ia = a[2] >= NEAR, ib = b[2] >= NEAR;
      if (ia) out.push(a);
      if (ia !== ib) { const u = (NEAR - a[2]) / (b[2] - a[2]); out.push([mix(a[0], b[0], u), mix(a[1], b[1], u), NEAR]); }
    }
    return out.length >= 3 ? out.map(spt) : null;
  };
  P.poly = (ctx, pts) => { const S = P.clip(pts); if (!S) return false; ctx.beginPath(); ctx.moveTo(S[0][0], S[0][1]); for (let i = 1; i < S.length; i++) ctx.lineTo(S[i][0], S[i][1]); ctx.closePath(); return S; };
  // forward unit vector and the horizon height on screen (y of a point at elevation 0)
  P.fwd = [sy * cp, sp, -cy * cp];
  P.horizon = oy + F * Math.tan(o.pitch || 0);
  return P;
}
export function lookAt(from, to) {
  const dx = to[0] - from[0], dy = to[1] - from[1], dz = to[2] - from[2], h = Math.hypot(dx, dz);
  return { yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, h) };
}
// unwrap an angle b to be within π of a
export const near = (a, b) => { while (b - a > Math.PI) b -= TAU; while (a - b > Math.PI) b += TAU; return b; };
