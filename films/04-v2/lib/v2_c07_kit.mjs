// c07 · small shared helpers for the world of have-to (lib/v2_c07_hall.mjs, v2_c07_paper.mjs, v2_c07_shop.mjs).
//   toImg / best / ready / once   cached textures handed to the renderer as Images (copied from lib/sc01_m1_open.mjs: @napi-rs/canvas
//                                 copies a Canvas source on every drawImage and keeps the copy; an Image it does not)
//   eoX eiX qio sstep             easings (expo-out landings, expo-in exits, quart in-out moves)
//   proj(C)                       pinhole camera (world y up, looking along -Z, yaw/pitch/roll, principal point ox/oy) → P(X, Y, Z) → [sx, sy, depth, q]
//   planeT(C, z)                  the affine screen transform of the plane Z = z (yaw = pitch = 0) → [a, b, c, d, e, f, q]
//   linePlateBG / linePlateLine   exact copies of handoff4's line plate (c06>c07), split so the line can become the handrail
import { Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng } from '../engine.mjs';

const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
export const memo = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };   // plain data (no image)

export const TAU = Math.PI * 2;
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
export const mixHex = (a, b, u) => {
  const p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16), f = (s) => Math.round(mix((p >> s) & 255, (q >> s) & 255, clamp(u)));
  return '#' + [f(16), f(8), f(0)].map((v) => v.toString(16).padStart(2, '0')).join('');
};

// ---------------------------------------------------------------- the camera
// C = { x, y, z, f, yaw, pitch, roll, ox, oy }. roll turns the image about the frame centre (+ = clockwise on screen).
export function proj(C) {
  const cy = Math.cos(C.yaw || 0), sy = Math.sin(C.yaw || 0), cp = Math.cos(C.pitch || 0), sp = Math.sin(C.pitch || 0);
  const cr = Math.cos(C.roll || 0), sr = Math.sin(C.roll || 0), F = C.f, ox = (C.ox ?? W / 2) - W / 2, oy = (C.oy ?? H / 2) - H / 2;
  const P = (X, Y, Z) => {
    const dx = X - C.x, dy = Y - C.y, dz = Z - C.z;
    const xc = dx * cy + dz * sy, zc0 = dx * sy - dz * cy, yc = dy * cp - zc0 * sp, zc = dy * sp + zc0 * cp;
    const q = F / Math.max(.05, zc), u = ox + xc * q, v = oy - yc * q;
    return [W / 2 + u * cr - v * sr, H / 2 + u * sr + v * cr, zc, q];
  };
  P.C = C; return P;
}
export function planeT(C, z) {
  const q = C.f / (C.z - z), cr = Math.cos(C.roll || 0), sr = Math.sin(C.roll || 0);
  const u0 = (C.ox ?? W / 2) - W / 2 - C.x * q, v0 = (C.oy ?? H / 2) - H / 2 + C.y * q;
  return [q * cr, q * sr, q * sr, -q * cr, W / 2 + u0 * cr - v0 * sr, H / 2 + u0 * sr + v0 * cr, q];
}
export const setT = (ctx, T) => ctx.setTransform(T[0], T[1], T[2], T[3], T[4], T[5]);
export const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
export const pline = (ctx, pts) => { pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };

// ---------------------------------------------------------------- the c06>c07 line plate, copied exactly from lib/handoff4.mjs
// (y 590, angle -.32, tone cream). The background and the line are separate so the line can be drawn along the handrail.
export const PLATE_Y = 590, PLATE_ANG = -.32;
export function linePlateBG(ctx, t) {
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, PLATE_Y, 0, W / 2, PLATE_Y, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(160,150,220,.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke();
}
// the line itself: through (cx, cy) at angle ang, k = width scale (1 = the plate), tick = tick alpha scale, shift = tick slide (px)
export function linePlateLine(ctx, t, o = {}) {
  const col = ['#e9dcc0', '#fffaf0'], L = o.L ?? 1400, k = o.k ?? 1, ang = o.ang ?? PLATE_ANG;
  const cx = o.cx ?? W / 2, cy = o.cy ?? PLATE_Y + 2 * Math.sin(t * .9);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const br = .9 + .1 * Math.sin(t * 2.1), gA = o.glow ?? 1, x0 = o.x0 ?? -L, x1 = o.x1 ?? L;
  for (const [w, al, c] of [[26, .05 * gA, col[0]], [10, .14 * gA, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) {
    if (al <= 0) continue; ctx.strokeStyle = rgba(c, al); ctx.lineWidth = Math.max(w * k, w < 3 ? .9 : 1.4); ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x1, 0); ctx.stroke();
  }
  const ta = o.tick ?? 1;
  if (ta > .01) {
    ctx.strokeStyle = rgba(col[1], .35 * ta); ctx.lineWidth = 1; ctx.beginPath();
    const sh = o.shift ?? 0, sp = 9 * (o.ks ?? 1);
    for (let x = -L + ((sh % sp) + sp) % sp - sp; x < L; x += sp) { if (x < x0 || x > x1) continue; const xx = (x - sh) / (o.ks ?? 1), h = (2 + 1.5 * Math.sin(xx * .07 + t)) * Math.min(1, k * 1.2); ctx.moveTo(x, -h); ctx.lineTo(x + 3 * (o.ks ?? 1), h); }
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- small drawing helpers
// a soft radial glow (additive), no offscreen
export function glowAt(ctx, x, y, r, col, a, core = null) {
  if (a <= 0 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(core || col, a)); g.addColorStop(.18, rgba(col, a * .55)); g.addColorStop(.5, rgba(col, a * .16)); g.addColorStop(1, rgba(col, 0));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}
// fast dotted / smoking polyline set (screen space): g 0 = solid line, 1 = dotted; smoke 0..1 dots lift and drift away
export function dotLines(ctx, lines, o = {}) {
  const g = clamp(o.g ?? 1), smoke = clamp(o.smoke ?? 0), col = o.col || '#e9dcc0', a = o.a ?? 1, pitch = o.pitch ?? 7, w = o.w ?? 1.2, t = o.t ?? 0;
  if (a <= 0) return;
  if (g < 1e-3 && smoke <= 0) { ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w; ctx.beginPath(); for (const L of lines) pline(ctx, L); ctx.stroke(); return; }
  // dash length shrinks from the pitch (solid) to a dot
  const dash = mix(pitch, w * .9, sstep(0, .85, g));
  if (smoke <= 0) {
    ctx.save(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w * mix(1, 1.25, g); ctx.lineCap = 'round'; ctx.setLineDash([Math.max(.01, dash - w * .8 * g), pitch - dash + w * .8 * g]);
    ctx.beginPath(); for (const L of lines) pline(ctx, L); ctx.stroke(); ctx.restore(); return;
  }
  // smoke: sample dots, each lifts off at its own time, drifts up and sideways and thins out
  const r = prng(o.seed ?? 7); ctx.fillStyle = rgba(col, a);
  const cell = [];
  for (const L of lines) {
    for (let i = 1; i < L.length; i++) {
      const [x0, y0] = L[i - 1], [x1, y1] = L[i], d = Math.hypot(x1 - x0, y1 - y0), n = Math.floor(d / pitch);
      for (let k = 0; k < n; k++) {
        const u = (k + .5) / n, x = mix(x0, x1, u), y = mix(y0, y1, u), h = r(), on = clamp((smoke - h * .55) / .45);
        if (on >= 1) continue;
        const e = on * on, dx = (Math.sin(h * 40 + t * .7) * 40 + (o.wind ?? 30)) * e, dy = -(60 + 110 * r()) * e;
        const al = (1 - on) * (1 - on * .3), s = w * (1.1 + on * .8);
        if (al < .03) continue;
        cell.push([x + dx + Math.sin(t * 1.3 + h * 9) * 3 * on, y + dy, s, al]);
      }
    }
  }
  for (const [x, y, s, al] of cell) { ctx.globalAlpha = al * a; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
  ctx.globalAlpha = 1;
}
