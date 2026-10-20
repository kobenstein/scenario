// c15 · kit: image cache, easings, noise, the layered camera, the deep sky (the c15>c16 plate, tiltable) and the far ridges.
// Everything here is c15's own (copied where noted); the hill itself is drawn only by lib/maslow4.mjs.
//
// CAMERA  C = { x, y, s, ty }: x, y = crane / truck in hill-plane units (the Maslow hill's world, k = 1), s = dolly (= 1 − 1/z of the hill
//   plane; s → 1 flies into the hill plane), ty = tilt (screen px, + = the camera looks up, the world moves down).
//   A layer k times as far as the hill plane (k < 1: in front of it) is seen through LC(C, k) — the same parallax as maslow4's parCam:
//   centre 960 + (x − 960)/k, 520 + (y − 520)/k, zoom k / (k − s). Things on a layer are drawn in that layer's own units.
import { Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng } from '../engine.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- image cache (copied from lib/sc01_m1_open.mjs)
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map(); export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };

// ---------------------------------------------------------------- easing (MOTION.md)
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));            // expo-out (landings)
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));            // expo-in (exits)
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out (moves)
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const sio = (x) => { x = clamp(x); return -(Math.cos(Math.PI * x) - 1) / 2; };
export const smt = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const span = (t, a, b) => clamp((t - a) / (b - a));

// ---------------------------------------------------------------- noise (copied from lib/maslow4.mjs: the far ridges must match exactly)
export const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
export const noise = (x) => { const i = Math.floor(x), f = x - i; return mix(hash(i), hash(i + 1), f * f * (3 - 2 * f)) * 2 - 1; };
export const fbm = (x) => noise(x) * .6 + noise(x * 2.13 + 7.1) * .28 + noise(x * 4.37 + 3.3) * .12;
export const h2 = (a, b) => hash(a * 12.9898 + b * 78.233);

// ---------------------------------------------------------------- the layered camera
export const HZ = 792;
export function LC(C, k) { return { x: 960 + (C.x - 960) / k, y: 520 + (C.y - 520) / k, z: k / (k - C.s), ty: C.ty || 0, k }; }
export const hillCam = (C) => ({ x: C.x, y: C.y - (C.ty || 0) * (1 - C.s), z: 1 / (1 - C.s) });   // the cam to pass to drawHill (tilt folded in)
export const toS = (L, x, y) => [(x - L.x) * L.z + 960, (y - L.y) * L.z + 540 + L.ty];
export const toW = (L, X, Y) => [(X - 960) / L.z + L.x, (Y - 540 - L.ty) / L.z + L.y];
export const setL = (ctx, L) => ctx.setTransform(L.z, 0, 0, L.z, 960 - L.x * L.z, 540 + L.ty - L.y * L.z);
// visible world box of a layer (with a margin in screen px)
export const viewB = (L, m = 40) => { const [x0, y0] = toW(L, -m, -m), [x1, y1] = toW(L, W + m, H + m); return [x0, y0, x1, y1]; };
export const lerpC = (a, b, u) => ({ x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), s: mix(a.s, b.s, u), ty: mix(a.ty || 0, b.ty || 0, u) });

// ---------------------------------------------------------------- colour helpers
const RGB = new Map();
export const hexRGB = (h) => { let v = RGB.get(h); if (!v) { v = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; RGB.set(h, v); } return v; };
const cl8 = (v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));
export const toHex = (r, g, b) => '#' + ((1 << 24) | (cl8(r) << 16) | (cl8(g) << 8) | cl8(b)).toString(16).slice(1);
export const mixH = (a, b, u) => { const A = hexRGB(a), B = hexRGB(b); return toHex(mix(A[0], B[0], u), mix(A[1], B[1], u), mix(A[2], B[2], u)); };
export const shadeH = (h, k) => { const [r, g, b] = hexRGB(h); return k >= 0 ? toHex(r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k) : toHex(r * (1 + k), g * (1 + k), b * (1 + k)); };
export { rgba };

// ---------------------------------------------------------------- the deep sky (handoff4 skyPlate, tone 'deep', copied) with a tilt
// skyDeep(ctx, t, off): the plate shifted down by off px (off = 0 → identical to HO.plate); above it the zenith colour continues with the
// same (periodic) star field, below it the sky brightens toward the horizon at yh (stars thin out there).
const SKYD = ['#04050f', '#0a0d26', '#141436'];
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
export function skyDeep(ctx, t, off = 0, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const [s0, s1, s2] = SKYD, yh = o.yh ?? (H + off + 140), hor = o.hor || '#262450';
  if (off > 0) { ctx.fillStyle = s0; ctx.fillRect(0, 0, W, Math.ceil(off) + 1); }
  if (off < 0) { const y0 = Math.floor(H + off) - 1, g = ctx.createLinearGradient(0, H + off, 0, Math.max(H + off + 1, yh)); g.addColorStop(0, s2); g.addColorStop(1, hor); ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0); }
  ctx.translate(0, off);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, s0); g.addColorStop(.62, s1); g.addColorStop(1, s2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // the band
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.42); const r = prng(55);
  for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); ctx.fillStyle = `rgba(216,230,255,${a})`; ctx.fillRect(x + t * 1.5, y, 1.3, 1.3); }
  ctx.restore();
  const dx = t * 2.2, dy = t * .6;
  for (const [x, y, s, ph, f] of STARS) {
    const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx) % W + W) % W, Y = ((y + dy) % H + H) % H;
    for (const k of off === 0 ? [0] : [-1, 0, 1]) {
      const Ys = Y + k * H, sy = Ys + off; if (sy < -8 || sy > H + 8) continue;
      let a = (.35 + .65 * tw) * (s > 1.2 ? 1 : .8);
      if (k === 1) a *= clamp((yh - sy) / 260);
      if (a <= .01) continue;
      ctx.fillStyle = `rgba(243,239,226,${a})`; ctx.beginPath(); ctx.arc(X, Ys, s, 0, TAU); ctx.fill();
      if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw * (k === 1 ? clamp((yh - sy) / 260) : 1)})`; ctx.beginPath(); ctx.arc(X, Ys, s * 5, 0, TAU); ctx.fill(); }
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the far ridges (maslow4 sky(): RIDGES, copied; extended to any x)
// ridgeTop(k, x): the crest (world y on that layer) — the frieze of ghosts stands on the nearer one (k 4.5)
export const RIDGES = [[9, '#8a7aa8', '#1c1c46', 1, 46], [4.5, '#6a5c8a', '#14143a', 2, 30]];
export function ridgeTop(i, x) {
  const [, , , sd, amp] = RIDGES[i], e = Math.abs(x - 960) / 960;
  const hgt = amp * (.35 + .65 * clamp(e * 1.2)) * (.55 + .45 * fbm(x * .0042 + sd * 9)) + 10 * fbm(x * .021 + sd * 4);
  return HZ - Math.max(4, hgt);
}
const INK = '#130f24';
// drawRidges(ctx, C, n, i0, i1): draw ridges i0..i1 exactly as maslow4 does at night n (only for Phase B, where maslow4's sky is not drawn)
export function drawRidges(ctx, C, n = 1, i0 = 0, i1 = 1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = i0; i <= i1; i++) {
    const [k, cd, cn] = RIDGES[i], L = LC(C, k), col = mixH(cd, cn, n);
    const [bx0, , bx1] = viewB(L, 30), x0 = Math.floor((bx0 + 700) / 14) * 14 - 700 - 14, x1 = bx1 + 14;
    ctx.beginPath(); let first = true;
    for (let x = x0; x <= x1; x += 14) { const [X, Y] = toS(L, x, ridgeTop(i, x)); if (first) { ctx.moveTo(X, Y); first = false; } else ctx.lineTo(X, Y); }
    const [Xe, Ye] = toS(L, x1, HZ + 300), [Xs] = toS(L, x0, HZ + 300); ctx.lineTo(Xe, Ye); ctx.lineTo(Xs, Ye); ctx.closePath();
    ctx.fillStyle = col; ctx.fill();
    ctx.save(); ctx.clip();
    const amp = RIDGES[i][4], [, ry0] = toS(L, 0, HZ - amp - 14), [, ry1] = toS(L, 0, HZ + 2), dy = Math.max(2.2, 3 * L.z);
    ctx.strokeStyle = rgba(INK, .22); ctx.lineWidth = .8; ctx.beginPath(); for (let y = ry0; y < ry1; y += dy) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke();
    const [, fy0] = toS(L, 0, HZ - 50), [, fy1] = toS(L, 0, HZ + 4), fc = mixH('#d8aec0', '#2a2c5c', n);
    const fg = ctx.createLinearGradient(0, fy0, 0, fy1); fg.addColorStop(0, rgba(fc, 0)); fg.addColorStop(1, rgba(fc, k > 5 ? .6 : .45)); ctx.fillStyle = fg; ctx.fillRect(0, fy0, W, fy1 - fy0);
    ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- engraving helpers (layer units; the caller sets the layer transform)
// parallel broken lines over a box, stable in layer space; z = current zoom (keeps the line pitch ≥ ~2.4 px on screen)
export function hatchL(ctx, b, z, { ang = .9, gap = 3, col = INK, a = .3, w = .8, seed = 1, broken = .3 } = {}) {
  let d = gap; while (d * z < 2.4) d *= 2;
  const c = Math.cos(ang), s = Math.sin(ang), nx = -s, ny = c;
  const pr = [b[0] * nx + b[1] * ny, b[2] * nx + b[1] * ny, b[0] * nx + b[3] * ny, b[2] * nx + b[3] * ny];
  const k0 = Math.ceil(Math.min(...pr) / d), k1 = Math.floor(Math.max(...pr) / d);
  const ta = [b[0] * c + b[1] * s, b[2] * c + b[1] * s, b[0] * c + b[3] * s, b[2] * c + b[3] * s], t0 = Math.min(...ta), t1 = Math.max(...ta);
  ctx.lineWidth = w / z; ctx.strokeStyle = rgba(col, a); ctx.beginPath();
  for (let k = k0; k <= k1; k++) {
    const off = k * d, fx = nx * off, fy = ny * off; let tt = t0 - hash(k * 1.7 + seed) * 12 * d, j = 0;
    while (tt < t1) { const L = d * (3 + 8 * hash(k * 3.1 + j * 7.7 + seed)), gp = hash(k * 5.3 + j * 1.9 + seed) < broken ? d * (.4 + .8 * hash(k + j * 3 + seed)) : 0; const a1 = Math.max(tt, t0), a2 = Math.min(tt + L, t1); if (a2 > a1) { ctx.moveTo(fx + c * a1, fy + s * a1); ctx.lineTo(fx + c * a2, fy + s * a2); } tt += L + gp; j++; }
  }
  ctx.stroke();
}
export const poly = (ctx, P) => { ctx.beginPath(); for (let i = 0; i < P.length; i++) i ? ctx.lineTo(P[i][0], P[i][1]) : ctx.moveTo(P[i][0], P[i][1]); ctx.closePath(); };
export const line = (ctx, P) => { ctx.beginPath(); for (let i = 0; i < P.length; i++) i ? ctx.lineTo(P[i][0], P[i][1]) : ctx.moveTo(P[i][0], P[i][1]); };
export function vg(ctx, y0, y1, stops) { const g = ctx.createLinearGradient(0, y0, 0, y1); for (const [u, c, a] of stops) g.addColorStop(u, a == null ? c : rgba(c, a)); return g; }
export function hg(ctx, x0, x1, stops) { const g = ctx.createLinearGradient(x0, 0, x1, 0); for (const [u, c, a] of stops) g.addColorStop(u, a == null ? c : rgba(c, a)); return g; }
export function rg(ctx, x, y, r, stops) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); for (const [u, c, a] of stops) g.addColorStop(u, a == null ? c : rgba(c, a)); return g; }
// a soft light (additive), screen or layer space
export function glowAt(ctx, x, y, r, col, a) { if (a <= .003 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rg(ctx, x, y, r, [[0, col, a], [.35, col, a * .35], [1, col, 0]]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }

// ---------------------------------------------------------------- smooth key interpolation (monotone cubic, copied from maslow4)
export function monotone(xs, ys) {
  const n = xs.length, d = [], m = new Array(n);
  if (n === 1) return () => ys[0];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = 0; m[n - 1] = 0;
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}
// a camera path through keys [{ t, x, y, s, ty }]: each component interpolated monotone in time (holds where values repeat)
export function camPath(keys) {
  const ts = keys.map((k) => k.t), f = {};
  for (const c of ['x', 'y', 's', 'ty']) f[c] = monotone(ts, keys.map((k) => k[c] ?? 0));
  return (t) => ({ x: f.x(t), y: f.y(t), s: f.s(t), ty: f.ty(t) });
}
