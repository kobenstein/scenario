// c05 kit (Film 4 v2, "The honeymoon"): small helpers shared by lib/v2_c05_*.mjs and scenes/sc05.mjs.
//   toImg / best / ready / once      cached layers handed to the renderer as decoded Images (copied from lib/sc01_m1_open.mjs: the
//                                    @napi-rs/canvas drawImage(<Canvas>) leak)
//   eo / ei / qio / smo / ramp       easings (expo-out landings, expo-in exits, quart in-out moves)
//   path(t, keys)                    keyframed camera / state path: keys [[t, {..numbers}, ease?]], per-segment easing, log-space f / z
//   camOf(c)                         translation-only pinhole camera with a shift lens: c = { x, y, z, f, lx, ly } (metres, y DOWN,
//                                    z forward = east); lx, ly = the direction (as tangents) seen at the frame centre. → { P(X,Y,Z), dir(dx,dy), … }
//   poly3 / quad3 / line3 / clipNear  3D polygons projected (clipped at the near plane)
//   plateGlow(ctx, t, x, y, k, o)    the c04>c05 plate light (lib/handoff4.mjs lightPlate, copied): k = 1 → pixel-identical to the plate;
//                                    k < 1 → the same light shrunk to the morning sun's aureole in your window (the sky shows beyond it)
//   mixHex / shade / hexA            colour helpers
//   stippleTex(key, n, seed)         a cached full-frame dot texture (print light), for 'lighter' shafts and patches
//   rise(ctx, draw, u)               an object that rises out of the dark as ONE solid picture (offscreen, darkened with source-atop)
import { Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, drift, canvas } from '../engine.mjs';
import { plate } from './handoff4.mjs';

// ---------------------------------------------------------------- cached layers as Images (copied from lib/sc01_m1_open.mjs)
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
// plain (non-image) memo for geometry and data
const MEMO = new Map();
export const memo = (k, f) => { if (!MEMO.has(k)) MEMO.set(k, f()); return MEMO.get(k); };

// ---------------------------------------------------------------- easing
export const eo = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));                  // expo-out (landings)
export const ei = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));                  // expo-in (exits)
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out (moves)
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }; // cubic in-out (gentle)
export const sio = (x) => { x = clamp(x); return .5 - .5 * Math.cos(Math.PI * x); };                // sine in-out (drifts)
export const smo = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const ramp = (t, a, b, e = smo) => e(clamp((t - a) / (b - a)));
export const pulse = (t, a, b, c, d, e = smo) => e(clamp((t - a) / (b - a))) * (1 - e(clamp((t - c) / (d - c))));
const EASE = { qio, cio, sio, smo, eo, ei, lin: (x) => clamp(x) };

// ---------------------------------------------------------------- keyframed paths
// keys: [[t, {a: 1, b: 2, …}, ease = 'qio'], …] (the ease of a key shapes the segment that ENDS at that key).
// Keys named in LOG (f, z, zh) are interpolated in log space so zooms feel even.
const LOG = new Set(['f', 'zh', 'k']);
export function path(t, keys) {
  if (t <= keys[0][0]) return { ...keys[0][1] };
  const n = keys.length; if (t >= keys[n - 1][0]) return { ...keys[n - 1][1] };
  let i = 0; while (i < n - 2 && t >= keys[i + 1][0]) i++;
  const [t0, A] = keys[i], [t1, B, e = 'qio'] = keys[i + 1], u = (typeof e === 'function' ? e : EASE[e])((t - t0) / (t1 - t0)), out = {};
  for (const k of Object.keys(A)) { const a = A[k], b = B[k] ?? a; out[k] = LOG.has(k) && a > 0 && b > 0 ? Math.exp(mix(Math.log(a), Math.log(b), u)) : mix(a, b, u); }
  for (const k of Object.keys(B)) if (!(k in out)) out[k] = B[k];
  return out;
}
// Catmull-Rom through points (smooth flight paths): pts [[t, x, y, z], …] → [x, y, z] at time t (uniform in the given times)
export function spline(t, pts) {
  const n = pts.length; if (t <= pts[0][0]) return pts[0].slice(1); if (t >= pts[n - 1][0]) return pts[n - 1].slice(1);
  let i = 0; while (i < n - 2 && t >= pts[i + 1][0]) i++;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)], u = (t - p1[0]) / (p2[0] - p1[0]);
  // centripetal-ish tangents scaled by the segment durations (keeps the speed continuous across keys)
  const out = [];
  for (let d = 1; d < 4; d++) {
    const m1 = (p2[d] - p0[d]) / ((p2[0] - p0[0]) || 1) * (p2[0] - p1[0]), m2 = (p3[d] - p1[d]) / ((p3[0] - p1[0]) || 1) * (p2[0] - p1[0]);
    const u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p1[d] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[d] + (u3 - u2) * m2);
  }
  return out;
}

// ---------------------------------------------------------------- the camera (translation only + shift lens)
export const NEAR = .06;
export function camOf(c) {
  const f = c.f, px = W / 2 - f * (c.lx || 0), py = H / 2 - f * (c.ly || 0);
  const P = (X, Y, Z) => { const d = Z - c.z; if (d < NEAR) return null; const k = f / d; return [px + (X - c.x) * k, py + (Y - c.y) * k, k]; };
  const Pu = (X, Y, Z) => { const d = Math.max(NEAR, Z - c.z), k = f / d; return [px + (X - c.x) * k, py + (Y - c.y) * k, k]; };
  return { x: c.x, y: c.y, z: c.z, f, px, py, lx: c.lx || 0, ly: c.ly || 0, P, Pu, dir: (dx, dy) => [px + f * dx, py + f * dy], k: (Z) => f / Math.max(NEAR, Z - c.z) };
}
// Sutherland–Hodgman against the near plane z > cam.z + NEAR
export function clipNear(pts, cz, near = NEAR) {
  const out = [], zc = cz + near;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[2] >= zc, ib = b[2] >= zc;
    if (ia) out.push(a);
    if (ia !== ib) { const u = (zc - a[2]) / (b[2] - a[2]); out.push([mix(a[0], b[0], u), mix(a[1], b[1], u), zc]); }
  }
  return out;
}
// project a 3D polygon into a path (returns the screen points or null)
export function proj(cam, pts) {
  const c = clipNear(pts, cam.z); if (c.length < 3) return null;
  return c.map(([X, Y, Z]) => { const p = cam.P(X, Y, Z + 1e-9); return p ? [p[0], p[1]] : cam.Pu(X, Y, Z); });
}
export function poly3(ctx, cam, pts, fill) {
  const s = proj(cam, pts); if (!s) return null;
  ctx.beginPath(); s.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  return s;
}
export function path3(ctx, cam, pts) { const s = proj(cam, pts); if (!s) return null; s.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); return s; }
// a line segment (clipped)
export function seg3(cam, a, b) {
  const zc = cam.z + NEAR; if (a[2] < zc && b[2] < zc) return null;
  let A = a, B = b;
  if (A[2] < zc) { const u = (zc - A[2]) / (B[2] - A[2]); A = [mix(A[0], B[0], u), mix(A[1], B[1], u), zc]; }
  if (B[2] < zc) { const u = (zc - B[2]) / (A[2] - B[2]); B = [mix(B[0], A[0], u), mix(B[1], A[1], u), zc]; }
  return [cam.Pu(...A), cam.Pu(...B)];
}
// screen rectangle of a world-axis-aligned rect facing the camera (constant Z): [x, y, w, h, k]
export function rect3(cam, X, Y, Z, w, h) { const a = cam.P(X, Y, Z); if (!a) return null; return [a[0], a[1], w * a[2], h * a[2], a[2]]; }
// draw an image as a billboard (a picture standing at depth Z): world rect X..X+w, Y..Y+h
export function bb(ctx, cam, img, X, Y, Z, w, h) {
  const r = rect3(cam, X, Y, Z, w, h); if (!r) return null;
  if (r[0] > W || r[1] > H || r[0] + r[2] < 0 || r[1] + r[3] < 0) return r;
  ctx.drawImage(img, r[0], r[1], r[2], r[3]); return r;
}

// ---------------------------------------------------------------- colour
const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
export function mixHex(a, b, u) { const A = hx(a), B = hx(b); return toHex(mix(A[0], B[0], u), mix(A[1], B[1], u), mix(A[2], B[2], u)); }
export function shade(h, d) { const A = hx(h); return toHex(A[0] + d * 255, A[1] + d * 255, A[2] + d * 255); }
export function mul(h, k) { const A = hx(h); return toHex(A[0] * k, A[1] * k, A[2] * k); }
export const hexA = rgba;
// a colour ramp: stops [[u, '#hex'], …] → hex at u
export function ramp3(stops, u) {
  if (u <= stops[0][0]) return stops[0][1]; for (let i = 1; i < stops.length; i++) if (u <= stops[i][0]) return mixHex(stops[i - 1][1], stops[i][1], (u - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
  return stops[stops.length - 1][1];
}

// ---------------------------------------------------------------- the plate light (lib/handoff4.mjs lightPlate, tone dawn, copied)
export const DAWN = ['#fff6e2', '#ffd9a0', '#f4a77a'];
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();
export const plateBreath = (t) => 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
export const plateCentre = (t) => [W / 2 + 18 * drift(t, 1, 3), H / 2 + 12 * drift(t, 1, 7)];
// k = 1: identical to plate(ctx, t, 'light', { tone: 'dawn' }) at (cx, cy) = plateCentre(t). k < 1: the same light, smaller, with an
// opaque margin (160·k px) and then a soft edge (1.4·R) into whatever was drawn before (the sky); the stipple thins out with it.
export function plateGlow(ctx, t, cx, cy, k = 1, o = {}) {
  if (k >= .9999 && !o.cols) { const [px, py] = plateCentre(t); if (Math.abs(px - cx) < .01 && Math.abs(py - cy) < .01) { plate(ctx, t, 'light', { tone: 'dawn' }); return; } }
  const [c0, c1, c2] = o.cols || DAWN, br = plateBreath(t), R = 1150 * br * k, rO = R + 160 * k, rF = rO + 1.4 * R;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rF);
  g.addColorStop(0, c0); g.addColorStop(.42 * R / rF, c1); g.addColorStop(R / rF, c2); g.addColorStop(rO / rF, c2); g.addColorStop(1, rgba(c2, 0));
  ctx.fillStyle = g;
  if (k >= .999) ctx.fillRect(0, 0, W, H); else { const x0 = Math.max(0, cx - rF), y0 = Math.max(0, cy - rF); ctx.fillRect(x0, y0, Math.min(W, cx + rF) - x0, Math.min(H, cy + rF) - y0); }
  const r = prng(31 + Math.floor(t * 12)), kk = 1100 * k; ctx.fillStyle = rgba(c2, .32 * (o.dotA ?? 1));
  for (const [u, v, q] of DOTS) {
    const x = u * W, y = v * H, dd = Math.hypot(x - cx, y - cy), d = dd / kk; if (d < .35) continue;
    if (q > (d - .35) * 1.4) continue;
    if (dd > rO && q < (dd - rO) / (rF - rO) * 1.6) { r(); r(); r(); continue; }
    const s = .8 + r() * 1.1; ctx.fillRect(x + (r() - .5) * 2, y + (r() - .5) * 2, s, s);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- textures
// a full-frame dot texture (white dots, alpha varies): light shafts and patches are this texture through a clip, added with 'lighter'
export function stippleTex(key = 'st', n = 26000, seed = 5, size = [.7, 1.9]) {
  return once('stip:' + key, () => {
    const [c, g] = canvas(), r = prng(seed); g.fillStyle = '#fff';
    for (let i = 0; i < n; i++) { const s = mix(size[0], size[1], r() * r()); g.globalAlpha = .25 + r() * .75; g.fillRect(r() * W, r() * H, s, s); }
    return c;
  });
}
// soft radial sprite (a glow) as an Image: draw it scaled at any size
export function glowSprite(col = '#ffb35c', core = '#fff1d6', R = 256, k1 = .15, a = 1) {
  return once(`glow:${col}:${core}:${R}:${k1}:${a}`, () => {
    const [c, g] = canvas(R * 2, R * 2), gr = g.createRadialGradient(R, R, 0, R, R, R);
    gr.addColorStop(0, rgba(core, a)); gr.addColorStop(k1, rgba(col, a * .6)); gr.addColorStop(.45, rgba(col, a * .18)); gr.addColorStop(1, rgba(col, 0));
    g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2); return c;
  });
}
export function putGlow(ctx, x, y, r, a = 1, col = '#ffb35c', core = '#fff1d6', op = 'lighter') {
  if (r < 1 || a <= .003) return; const im = glowSprite(col, core);
  ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = clamp(a); ctx.drawImage(im, x - r, y - r, r * 2, r * 2); ctx.restore();
}

// ---------------------------------------------------------------- rise out of the dark (never a half-transparent fade of an object)
// draw(g) paints the object into a scratch canvas (full frame); u 0..1: 0 = black silhouette of the object (as dark as the room),
// 1 = fully lit. The object is ALWAYS fully opaque: only its light changes (source-atop darkening).
// box = [x, y, w, h] (screen) limits the scratch layer (a full-frame canvas drawn every frame costs ~8 MB of transient memory)
const RSC = new Map();
export function rise(ctx, draw, u, dark = '#05060f', box = [0, 0, W, H]) {
  if (u >= 1) { draw(ctx); return; }
  const bx = Math.max(0, Math.floor(box[0])), by = Math.max(0, Math.floor(box[1])), bw = Math.min(W, Math.ceil(box[0] + box[2])) - bx, bh = Math.min(H, Math.ceil(box[1] + box[3])) - by;
  if (bw < 1 || bh < 1) return;
  const key = Math.ceil(bw / 64) + 'x' + Math.ceil(bh / 64); if (!RSC.has(key)) RSC.set(key, canvas(Math.ceil(bw / 64) * 64, Math.ceil(bh / 64) * 64));
  const [c, g] = RSC.get(key); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, c.width, c.height);
  g.setTransform(1, 0, 0, 1, -bx, -by); draw(g); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = dark; g.globalAlpha = 1 - clamp(u); g.fillRect(0, 0, bw, bh);
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; ctx.drawImage(c, 0, 0, bw, bh, bx, by, bw, bh);
}

// ---------------------------------------------------------------- small drawing helpers
export function pathPts(ctx, pts, close = true) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); if (close) ctx.closePath(); }
export const TAU = Math.PI * 2;
// ---------------------------------------------------------------- sunlight through a window (light travels (-az, +el, -1) per metre of -Z)
// L = { az, el } tangents of the sun direction (az + = toward +x, el + = up). A point p lit from outside continues along the ray.
export const alongY = (p, y0, L) => { const s = (y0 - p[1]) / L.el; return [p[0] - L.az * s, y0, p[2] - s, s]; };   // onto the plane Y = y0
export const alongZ = (p, z0, L) => { const s = p[2] - z0; return [p[0] - L.az * s, p[1] + L.el * s, z0, s]; };     // onto the plane Z = z0
export const alongX = (p, x0, L) => { const s = (p[0] - x0) / L.az; return [x0, p[1] + L.el * s, p[2] - s, s]; };   // onto the plane X = x0
// clip the current path region to (frame minus a list of screen polygons)
export function clipOut(ctx, polys) {
  ctx.beginPath(); ctx.rect(-10, -10, W + 20, H + 20);
  for (const q of polys) { if (!q || q.length < 3) continue; q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
  ctx.clip('evenodd');
}
export { W, H, rgba, clamp, lin, mix, sm, prng, drift, canvas };
