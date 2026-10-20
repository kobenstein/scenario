// c11 (Film 4 v2) · small shared helpers for the chunk "Who you are" (owner c11).
//   once / toImg / best / ready   cached layers handed to the renderer as decoded Images (the @napi-rs/canvas drawImage(<Canvas>) leak;
//                                 pattern copied from lib/sc01_m1_open.mjs)
//   eoX eiX qio qo                 expo-out (landings), expo-in (exits), quart in-out (moves), quart-out
//   cam3(o)                        pinhole camera (copied from lib/sc01_m1_open.mjs): P(X, Y, Z) → [sx, sy, depth]
//   glowSprite(col, R) / putGlow   additive light sprites (cached)
//   mixHex, shadeHex, poly, rr     colour and path helpers
//   hillLabels(ctx, t, cam, st)    the Maslow labels exactly as lib/maslow4.mjs draws them (copy of its labels()), so the chunk can
//                                  draw them ABOVE its cut-away street overlay (drawHill is called with labels 0)
import { Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, lin, sm, prng, canvas, text } from '../engine.mjs';
import { HILL, hwAt, toScreen } from './maslow4.mjs';

export const TAU = Math.PI * 2;
// ---------------------------------------------------------------- cached layers → Images
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
export const onceRaw = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };   // data (not canvases)

// ---------------------------------------------------------------- easing (MOTION.md)
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const qo = (x) => { x = clamp(x); return 1 - Math.pow(1 - x, 4); };
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const u01 = (t, a, b) => clamp((t - a) / (b - a));

// ---------------------------------------------------------------- pinhole camera (world y up; the camera looks along -Z rotated by yaw/pitch)
export function cam3(o) {
  const cy = Math.cos(o.yaw || 0), sy = Math.sin(o.yaw || 0), cp = Math.cos(o.pitch || 0), sp = Math.sin(o.pitch || 0), F = o.f || 1400, ox = o.ox ?? W / 2, oy = o.oy ?? H / 2;
  const P = (X, Y, Z) => {
    const dx = X - o.x, dy = Y - o.y, dz = Z - o.z;
    const xc = dx * cy + dz * sy, zc0 = dx * sy - dz * cy;
    const yc = dy * cp - zc0 * sp, zc = dy * sp + zc0 * cp, q = F / Math.max(.05, zc);
    return [ox + xc * q, oy - yc * q, zc];
  };
  P.F = F; P.o = o; return P;
}
// a fuller camera on the same convention: camera space (xc right, yc up, zc forward), near-plane clipping for polygons and segments
//   C = camera({ x, y, z, yaw, pitch, f, near }) → C.cam(X,Y,Z) → [xc,yc,zc]; C.sc([xc,yc,zc]) → [sx,sy]; C.P(X,Y,Z) → [sx,sy,zc]
//   C.poly(ctx, pts3) traces a clipped polygon (returns false if nothing is in front); C.seg(ctx, a, b) moves/lines a clipped segment
//   C.k(zc) = pixels per metre at depth zc; C.fwd = unit view vector in world space
export function camera(o) {
  const cy = Math.cos(o.yaw || 0), sy = Math.sin(o.yaw || 0), cp = Math.cos(o.pitch || 0), sp = Math.sin(o.pitch || 0), F = o.f || 1400, ox = o.ox ?? W / 2, oy = o.oy ?? H / 2, near = o.near ?? .02;
  const cam = (X, Y, Z) => { const dx = X - o.x, dy = Y - o.y, dz = Z - o.z, xc = dx * cy + dz * sy, zc0 = dx * sy - dz * cy; return [xc, dy * cp - zc0 * sp, dy * sp + zc0 * cp]; };
  const sc = (c) => { const q = F / c[2]; return [ox + c[0] * q, oy - c[1] * q]; };
  const P = (X, Y, Z) => { const c = cam(X, Y, Z), q = F / Math.max(near, c[2]); return [ox + c[0] * q, oy - c[1] * q, c[2]]; };
  const clip = (cs) => {
    const out = []; for (let i = 0; i < cs.length; i++) {
      const a = cs[i], b = cs[(i + 1) % cs.length], ia = a[2] >= near, ib = b[2] >= near;
      if (ia) out.push(a);
      if (ia !== ib) { const u = (near - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, near]); }
    } return out;
  };
  const C = {
    o, F, near, cam, sc, P, k: (zc) => F / Math.max(near, zc),
    fwd: [sy * cp, sp, -cy * cp].map((v, i) => (i === 0 ? cp * sy : i === 1 ? sp : -cp * cy)),
    // screen polygon of a 3D polygon (clipped to the near plane); null if fully behind
    S(pts) { const cs = clip(pts.map((p) => cam(p[0], p[1], p[2]))); return cs.length >= 3 ? cs.map(sc) : null; },
    poly(ctx, pts, begin = true) { const S = C.S(pts); if (!S) return false; if (begin) ctx.beginPath(); ctx.moveTo(S[0][0], S[0][1]); for (let i = 1; i < S.length; i++) ctx.lineTo(S[i][0], S[i][1]); ctx.closePath(); return S; },
    seg(ctx, a, b) { let A = cam(a[0], a[1], a[2]), B = cam(b[0], b[1], b[2]); if (A[2] < near && B[2] < near) return false;
      if (A[2] < near) { const u = (near - A[2]) / (B[2] - A[2]); A = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, near]; }
      if (B[2] < near) { const u = (near - B[2]) / (A[2] - B[2]); B = [B[0] + (A[0] - B[0]) * u, B[1] + (A[1] - B[1]) * u, near]; }
      const p = sc(A), q = sc(B); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); return true; },
  };
  return C;
}
export const onScreen = (S, m = 0) => { if (!S) return false; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of S) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return x1 > -m && x0 < W + m && y1 > -m && y0 < H + m; };
// keyframed value: K = [[t, v], …] (v number or array); e = easing between keys (per segment); hold before the first and after the last
export function keys(t, K, e = qio) {
  if (t <= K[0][0]) return K[0][1]; const n = K.length; if (t >= K[n - 1][0]) return K[n - 1][1];
  let i = 0; while (i < n - 2 && t >= K[i + 1][0]) i++;
  const [ta, va] = K[i], [tb, vb] = K[i + 1], ee = K[i + 1][2] || e, u = ee((t - ta) / (tb - ta));
  return Array.isArray(va) ? va.map((v, j) => v + (vb[j] - v) * u) : va + (vb - va) * u;
}
// Catmull-Rom through points P[i] = [t, [values…]] with per-knot times; C1-smooth position path (no stops at the inner knots)
export function spline(t, K) {
  const n = K.length; if (t <= K[0][0]) return K[0][1]; if (t >= K[n - 1][0]) return K[n - 1][1];
  let i = 0; while (i < n - 2 && t >= K[i + 1][0]) i++;
  const p0 = K[Math.max(0, i - 1)], p1 = K[i], p2 = K[i + 1], p3 = K[Math.min(n - 1, i + 2)], u = (t - p1[0]) / (p2[0] - p1[0]);
  // centripetal-free uniform CR on values with time-scaled tangents
  const m1 = p1[1].map((v, j) => (p2[1][j] - p0[1][j]) / ((p2[0] - p0[0]) || 1) * (p2[0] - p1[0]));
  const m2 = p2[1].map((v, j) => (p3[1][j] - p1[1][j]) / ((p3[0] - p1[0]) || 1) * (p2[0] - p1[0]));
  const h00 = 2 * u ** 3 - 3 * u * u + 1, h10 = u ** 3 - 2 * u * u + u, h01 = -2 * u ** 3 + 3 * u * u, h11 = u ** 3 - u * u;
  return p1[1].map((v, j) => h00 * v + h10 * m1[j] + h01 * p2[1][j] + h11 * m2[j]);
}

// ---------------------------------------------------------------- light sprites
export function glowSprite(col, R = 128, core = null) {
  return once(`glow${col}${R}${core}`, () => {
    const [c, g] = canvas(R * 2, R * 2), gr = g.createRadialGradient(R, R, 0, R, R, R);
    if (core) { gr.addColorStop(0, rgba(core, 1)); gr.addColorStop(.12, rgba(col, .75)); }
    else gr.addColorStop(0, rgba(col, 1));
    gr.addColorStop(.35, rgba(col, .28)); gr.addColorStop(.7, rgba(col, .06)); gr.addColorStop(1, rgba(col, 0));
    g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2); return c;
  });
}
export function putGlow(ctx, x, y, r, a, col = '#ffb35c', core = null) {
  if (a <= 0 || r <= .5) return; const B = glowSprite(col, 128, core);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(B, x - r, y - r, r * 2, r * 2); ctx.restore();
}

// ---------------------------------------------------------------- colour + paths
export function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
export function shadeHex(hex, d) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(clamp(d >= 0 ? v + (255 - v) * d : v * (1 + d), 0, 255)); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
export const poly = (ctx, pts, close = true) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); if (close) ctx.closePath(); };
export const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
export function hash(x) { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }
// a soft deterministic wobble for living things (never zero velocity)
export const wob = (t, a = 1, ph = 0) => a * (Math.sin(t * 0.53 + ph) * .6 + Math.sin(t * 1.21 + ph * 1.7) * .3 + Math.sin(t * 2.07 + ph * 2.3) * .1);

// ---------------------------------------------------------------- the Maslow labels (copy of lib/maslow4.mjs labels(), 2026-10-20 11:15)
// drawn by the chunk after its cut-away overlay so the overlay never covers them. st as for drawHill (labels, title, focus, focusU, lit).
export function hillLabels(ctx, t, cam, st) {
  const la = st.labels ?? 0; if (la <= 0 && !(st.title > 0)) return;
  const fade = 1 - sm(lin(2.2, 3.2, cam.z));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  HILL.levels.forEach((L, lv) => {
    const ym = (L.y0 + L.y1) / 2, [fx, fy] = toScreen(cam, HILL.cx + hwAt(lv, ym), ym), focus = st.focus === lv;
    const a = la * (focus ? 1 : fade) * (st.only ? (st.only.includes(lv) ? 1 : st.dim ?? 1) : 1); if (a <= .01 || fy < 40 || fy > H - 180) return;
    const on = (st.lit?.[lv] ?? 0) > .5, size = focus ? mix(34, 58, sm(st.focusU ?? 0)) : 34;
    ctx.strokeStyle = rgba(on ? '#ffb35c' : '#a49fc4', .55 * a); ctx.lineWidth = 1.2; ctx.setLineDash([2, 6]); ctx.beginPath(); ctx.moveTo(fx + 10, fy); ctx.lineTo(HILL.labelX - 24, fy); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, L.label, HILL.labelX, fy + size * .32, { size, font: 'Instrument Serif', color: on ? '#f3efe2' : '#a49fc4', alpha: a });
  });
  if ((st.title ?? 0) > 0) { const a = st.title * fade; text(ctx, HILL.title.toUpperCase(), HILL.labelX, 96, { size: 17, weight: 600, color: '#a49fc4', alpha: a, spacing: 5 }); ctx.fillStyle = rgba('#a49fc4', .6 * a); ctx.fillRect(HILL.labelX, 70, 30 * st.title, 2); }
  ctx.restore();
}
export { W, H, rgba, clamp, mix, lin, sm, prng, canvas, text };
// a context whose setTransform/resetTransform keep an extra offset: lets a full-frame plate that resets the transform itself
// (lib/handoff4.mjs plate()) be drawn shifted, unchanged, e.g. the c10>c11 sky moving up while the camera tilts down
export function shifted(ctx, dx, dy, k = 1) {
  return new Proxy(ctx, {
    get(o, p) {
      if (p === 'setTransform') return (a, b, c, d, e, f) => (typeof a === 'object' ? o.setTransform(a) : o.setTransform(a * k, b * k, c * k, d * k, e * k + dx, f * k + dy));
      if (p === 'resetTransform') return () => o.setTransform(k, 0, 0, k, dx, dy);
      const v = o[p]; return typeof v === 'function' ? v.bind(o) : v;
    },
    set(o, p, v) { o[p] = v; return true; },
  });
}
// cubic Hermite through K = [[t, [values…], [slopes…] | null], …]: a knot without slopes takes the Catmull-Rom tangent (time-scaled),
// the ends without slopes take the chord. Holds before the first and after the last knot.
export function hermite(t, K) {
  const n = K.length; if (t <= K[0][0]) return K[0][1]; if (t >= K[n - 1][0]) return K[n - 1][1];
  let i = 0; while (i < n - 2 && t >= K[i + 1][0]) i++;
  const tang = (j) => {
    if (K[j][2]) return K[j][2];
    const a = K[Math.max(0, j - 1)], b = K[Math.min(n - 1, j + 1)];
    return K[j][1].map((v, c) => (b[1][c] - a[1][c]) / ((b[0] - a[0]) || 1));
  };
  const [ta, va] = K[i], [tb, vb] = K[i + 1], h = tb - ta, u = (t - ta) / h, ma = tang(i), mb = tang(i + 1);
  const h00 = 2 * u ** 3 - 3 * u * u + 1, h10 = u ** 3 - 2 * u * u + u, h01 = -2 * u ** 3 + 3 * u * u, h11 = u ** 3 - u * u;
  return va.map((v, c) => h00 * v + h10 * h * ma[c] + h01 * vb[c] + h11 * h * mb[c]);
}
