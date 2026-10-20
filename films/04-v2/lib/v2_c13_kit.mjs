// c13 (Film 4 v2) · shared helpers for the three takes of "The catch" (road, kitchen, valley). Owner: c13.
// Copied patterns (no imports from the minute files, which are being repaired in parallel):
//   toImg / best / ready / once  from lib/sc01_m1_open.mjs (cached Canvas → decoded Image: @napi-rs/canvas copies a Canvas source on
//                                every drawImage and keeps the copy; an Image it does not)
//   quadSprite                   from lib/sc01_m1_open.mjs (an image on a projected quad, vertical strips)
//   lineGround / lineStroke      from lib/handoff4.mjs linePlate (the 'line' plate split into its ground and its line, so the line can
//                                become the boom while the ground lifts off the world around it)
//   skyPlateAt                   from lib/handoff4.mjs skyPlate (tone 'dusk'), identical output at dy = 0
import { Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas, drift } from '../engine.mjs';

const TAU = Math.PI * 2;
// ---------------------------------------------------------------- image cache (see header)
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
// raw cache (objects that hold canvases: callers pass the canvas through best())
const RAW = new Map();
export const onceRaw = (k, f) => { if (!RAW.has(k)) RAW.set(k, f()); return RAW.get(k); };

// ---------------------------------------------------------------- easing (MOTION.md)
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));            // expo-out (landings)
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));            // expo-in (exits)
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out (moves)
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x ** 3 : 1 - Math.pow(-2 * x + 2, 3) / 2; };    // cubic in-out
export const smo = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const smr = (a, b, t) => smo((t - a) / (b - a));                                     // smoothstep over [a, b]
export const bump = (t, a, b) => (t <= a || t >= b ? 0 : Math.sin(Math.PI * (t - a) / (b - a)));
// a settle with ≤ 5 % overshoot (MOTION.md: no bouncy springs)
export const settle = (x) => { x = clamp(x); const e = 1 - Math.pow(1 - x, 3); return e + .045 * Math.sin(Math.PI * x) * x * (1 - x) * 4; };

// ---------------------------------------------------------------- colour
export function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
export function mixHex(a, b, u) { const A = hex2rgb(a), B = hex2rgb(b), k = clamp(u); return '#' + A.map((v, i) => Math.round(mix(v, B[i], k)).toString(16).padStart(2, '0')).join(''); }
// several stops: pal(u, [[0, '#..'], [.5, '#..'], [1, '#..']])
export function pal(u, stops) {
  if (u <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) if (u <= stops[i][0]) return mixHex(stops[i - 1][1], stops[i][1], (u - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
  return stops[stops.length - 1][1];
}
export const shadeHex = (h, d) => mixHex(h, d < 0 ? '#000000' : '#ffffff', Math.abs(d));

// ---------------------------------------------------------------- pinhole camera (+Z forward, +Y up, yaw + = look right, pitch + = look up)
//   pin({ x, y, z, yaw, pitch, f, ox, oy }) → P(X, Y, Z) → [sx, sy, depth, k (px per metre at that depth)]
export function pin(o) {
  const cy = Math.cos(o.yaw || 0), sy = Math.sin(o.yaw || 0), cp = Math.cos(o.pitch || 0), sp = Math.sin(o.pitch || 0), F = o.f, ox = o.ox ?? W / 2, oy = o.oy ?? H / 2;
  const P = (X, Y, Z) => {
    const dx = X - o.x, dy = Y - o.y, dz = Z - o.z;
    const xc = dx * cy - dz * sy, zc0 = dx * sy + dz * cy;
    const yc = dy * cp - zc0 * sp, zc = dy * sp + zc0 * cp, q = F / Math.max(.05, zc);
    return [ox + xc * q, oy - yc * q, zc, q];
  };
  P.o = o; P.F = F; return P;
}

// ---------------------------------------------------------------- an image on a projected quad (TL, TR, BR, BL), n vertical strips
const STRIPS = new WeakMap();
function strips(img, n) {
  let m = STRIPS.get(img); if (!m) STRIPS.set(img, m = new Map());
  if (!m.has(n)) { const iw = img.width, ih = img.height, a = []; for (let i = 0; i < n; i++) { const sx = Math.floor(iw * i / n), w = Math.min(iw - sx, Math.ceil(iw / n) + 2), [c, g] = canvas(w, ih); g.drawImage(img, -sx, 0); a.push({ c: toImg(c), sx }); } m.set(n, a); }
  return m.get(n);
}
export function quadSprite(ctx, img, q, n = 1, a = 1) {
  const [A, B, , D] = q, C = q[2], iw = img.width, ih = img.height;
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < n; i++) {
    const u0 = i / n, u1 = (i + 1) / n;
    const t0 = [mix(A[0], B[0], u0), mix(A[1], B[1], u0)], t1 = [mix(A[0], B[0], u1), mix(A[1], B[1], u1)];
    const b0 = [mix(D[0], C[0], u0), mix(D[1], C[1], u0)];
    const sw = iw * (u1 - u0), aa = (t1[0] - t0[0]) / sw, bb = (t1[1] - t0[1]) / sw, cc = (b0[0] - t0[0]) / ih, dd = (b0[1] - t0[1]) / ih;
    ctx.setTransform(aa, bb, cc, dd, t0[0] - aa * iw * u0, t0[1] - bb * iw * u0);
    if (n === 1) ctx.drawImage(img, 0, 0);
    else { const S = strips(img, n)[i]; ctx.drawImage(best(S.c), S.sx, 0); }
  }
  ctx.restore();
}
export const polyPath = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };

// ---------------------------------------------------------------- the 'line' plate, split (handoff4.mjs linePlate, o = { y, ang, tone })
// ground only (dark indigo, violet bloom round the line, the faint moving diagonal hatching)
export function lineGround(ctx, t, y = 600) {
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, y, 0, W / 2, y, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(160,150,220,.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke();
}
// the line itself; o.k (0..1) = how much of the plate's own life it keeps (1 = exactly the plate: its 2 px breathing and glow),
// o.x0/x1 = the line's ends in screen px (default: across the frame), o.y = its screen y, o.glow (multiplier on the wide glows)
export function lineStroke(ctx, t, o = {}) {
  const k = o.k ?? 1, y = o.y ?? 600, col = ['#ffb35c', '#fff1d6'], L = 1400;
  const x0 = o.x0 ?? -L + W / 2, x1 = o.x1 ?? L + W / 2, gl = o.glow ?? 1;
  ctx.save(); ctx.translate(W / 2, y + 2 * Math.sin(t * .9) * k); ctx.rotate(o.ang || 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = o.cap || 'round';
  const br = .9 + .1 * Math.sin(t * 2.1), a = o.a ?? 1, X0 = x0 - W / 2, X1 = x1 - W / 2;
  for (const [w, al, c, isGlow] of [[26, .05, col[0], 1], [10, .14, col[0], 1], [3.2, .55 * br, col[0], 0], [1.4, .95, col[1], 0]]) {
    ctx.strokeStyle = rgba(c, al * a * (isGlow ? gl : 1)); ctx.lineWidth = w * (o.w ?? 1); ctx.beginPath(); ctx.moveTo(X0, 0); ctx.lineTo(X1, 0); ctx.stroke();
  }
  ctx.strokeStyle = rgba(col[1], .35 * a * (o.ticks ?? 1)); ctx.lineWidth = 1; ctx.beginPath();
  for (let x = -L; x < L; x += 9) { if (x < X0 || x > X1) continue; const h = (2 + 1.5 * Math.sin(x * .07 + t)) * (o.w ?? 1); ctx.moveTo(x, -h); ctx.lineTo(x + 3, h); }
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- the dusk sky plate (handoff4.mjs skyPlate, tone 'dusk')
// identical to plate(ctx, t, 'sky', { tone: 'dusk' }) at dy = 0; dy shifts the gradient and stars (the world's sky before it is the plate)
const SSTARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
export function skyPlateAt(ctx, t, o = {}) {
  const [s0, s1, s2] = ['#0b0f2a', '#3b2f6e', '#c77a8a'], dy = o.dy ?? 0, sa = o.stars ?? 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0, dy, 0, H + dy); g.addColorStop(0, s0); g.addColorStop(.62, s1); g.addColorStop(1, s2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (sa > 0) {
    ctx.save(); ctx.translate(W / 2, H / 2 + dy); ctx.rotate(-.42); const r = prng(55);
    for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = (.05 + .1 * r()) * sa; ctx.fillStyle = `rgba(216,230,255,${a})`; ctx.fillRect(x + t * 1.5, y, 1.3, 1.3); }
    ctx.restore();
    const dx = t * 2.2, dyy = t * .6;
    for (const [x, y, s, ph, f] of SSTARS) {
      const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx) % W + W) % W, Y = ((y + dyy) % H + H) % H + dy;
      if (Y - dy > H * .7) continue;
      ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8) * sa})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
      if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw * sa})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- a stippled light sprite (cached), for blooms that must stay cheap
export function lightSprite(key, R, stops, k = .7, seed = 3) {
  return once('c13ls' + key, () => {
    const [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R);
    for (const [p, col] of stops) rg.addColorStop(p, col);
    g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2);
    if (k > 0) stip(c, k, seed);
    return c;
  });
}
// a light stipple (art.stipple's idea, local copy so this file stays light): dots only in the falloff
export function stip(c, k = .6, seed = 1, boost = 2.2) {
  const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height), p = d.data, r = prng(seed * 977 + 13);
  for (let i = 3; i < p.length; i += 4) { const a = p[i] / 255; if (a <= 0) continue; const on = r() < a ? Math.min(1, a * boost) : 0, kk = k * 4 * a * (1 - a); p[i] = 255 * (a * (1 - kk) + kk * on); }
  g.putImageData(d, 0, 0); return c;
}
export function drawSprite(ctx, img, x, y, r, a = 1, op = 'lighter') {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(img, x - r, y - r, r * 2, r * 2); ctx.restore();
}
export { TAU, drift };

// ---------------------------------------------------------------- a camera path through keys: monotone cubic (Fritsch–Carlson), flat at the ends
//   mono([[t, v], …]) → f(t)   (no overshoot between keys: a dolly that slows at a beat never runs backwards)
export function mono(keys) {
  const n = keys.length, ts = keys.map((k) => k[0]), vs = keys.map((k) => k[1]), d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((vs[i + 1] - vs[i]) / (ts[i + 1] - ts[i]));
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) continue;
    const h0 = ts[i] - ts[i - 1], h1 = ts[i + 1] - ts[i], w1 = 2 * h1 + h0, w2 = h1 + 2 * h0;
    m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  }
  return (t) => {
    if (t <= ts[0]) return vs[0]; if (t >= ts[n - 1]) return vs[n - 1];
    let i = 0; while (t > ts[i + 1]) i++;
    const h = ts[i + 1] - ts[i], s = (t - ts[i]) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * vs[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * vs[i + 1] + (s3 - s2) * h * m[i + 1];
  };
}
// a reusable full-frame scratch layer per key (cleared, identity transform)
const SCR = new Map();
export function scratchLayer(key, w = W, h = H) {
  let e = SCR.get(key); if (!e) SCR.set(key, e = canvas(w, h));
  const [, g] = e; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, w, h); return e;
}
// the transform that maps a plane's local metres (u right along +X, w down = -Y) at (X0, Y0, Z0) onto the screen (exact at the origin)
export function planeXY(ctx, P, X0, Y0, Z0) {
  const o = P(X0, Y0, Z0); if (o[2] < .3) return 0;
  const a = P(X0 + 1, Y0, Z0), b = P(X0, Y0 + 1, Z0);
  ctx.setTransform(a[0] - o[0], a[1] - o[1], -(b[0] - o[0]), -(b[1] - o[1]), o[0], o[1]);
  return o[3];
}
// an image on a projected plane: proj(u, v) (image pixels → screen) evaluated per vertical strip (top edge exact, the strip's
// vertical taken at its middle, so neighbouring strips meet within a pixel even under perspective)
export function projSprite(ctx, img, proj, n = 24, a = 1) {
  const iw = img.width, ih = img.height;
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < n; i++) {
    const u0 = iw * i / n, u1 = iw * (i + 1) / n, um = (u0 + u1) / 2, A = proj(u0, 0), B = proj(u1, 0), M = proj(um, ih);
    const Vx = M[0] - (A[0] + B[0]) / 2, Vy = M[1] - (A[1] + B[1]) / 2, aa = (B[0] - A[0]) / (u1 - u0), bb = (B[1] - A[1]) / (u1 - u0);
    ctx.setTransform(aa, bb, Vx / ih, Vy / ih, A[0] - aa * u0, A[1] - bb * u0);
    if (n === 1) ctx.drawImage(img, 0, 0);
    else { const S = strips(img, n)[i]; ctx.drawImage(best(S.c), S.sx, 0); }
  }
  ctx.restore();
}
// engraved hatching inside a screen polygon: parallel lines at angle ang, gap px apart
export function hatchPoly(ctx, pts, ang = -.9, gap = 5, col = 'rgba(0,0,0,.3)', lw = 1) {
  if (pts.length < 3) return;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  x0 = Math.max(x0, -10); y0 = Math.max(y0, -10); x1 = Math.min(x1, W + 10); y1 = Math.min(y1, H + 10); if (x1 <= x0 || y1 <= y0) return;
  ctx.save(); polyPath(ctx, pts); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  const c = Math.cos(ang), s = Math.sin(ang), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + 2;
  for (let d = -R; d <= R; d += gap) { const px = cx - s * d, py = cy + c * d; ctx.moveTo(px - c * R, py - s * R); ctx.lineTo(px + c * R, py + s * R); }
  ctx.stroke(); ctx.restore();
}
