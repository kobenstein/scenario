// s06_kit.mjs · helpers for chapter 06 "Creating, and giving" (own copies, so engine/art stay untouched).
// - LRU caches for big plates (evicted as the film moves on) and figure sprites (pose frames)
// - local-size light helpers (bloom / pool / cone / fog band) that only allocate their own bbox
// - a 2.5D stage: layers with parallax around a camera focus + zoom, and the matching mapper
import { createCanvas } from '@napi-rs/canvas';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, stipple, roughPath, roughPoly, person, vnoise, fbm } from './art.mjs';
export { W, H, C, rgba, clamp, mix, prng, mixHex, shade };
export const lin = (a, b, t) => clamp((t - a) / (b - a));
export const sm = (x) => x * x * (3 - 2 * x);
export const eio = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const eout = (x) => 1 - Math.pow(1 - x, 3);
export const eout4 = (x) => 1 - Math.pow(1 - x, 4);
export const ein = (x) => x * x * x;
export const sine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
export const drift = (t, a = 1, ph = 0) => a * (Math.sin(t * 0.37 + ph) * 0.6 + Math.sin(t * 0.91 + ph * 1.7) * 0.3 + Math.sin(t * 1.73 + ph * 2.3) * 0.1);
// cubic-bezier(.16,1,.3,1)-ish entrance and (.7,0,.84,0) exit
export const enter = (x) => 1 - Math.pow(1 - clamp(x), 4.2);
export const exitE = (x) => Math.pow(clamp(x), 3.4);

export function lay(w = W, h = H) { const c = createCanvas(Math.max(1, Math.ceil(w)), Math.max(1, Math.ceil(h))); return [c, c.getContext('2d')]; }

// ---------------------------------------------------------------- caches
function lru(cap) {
  const m = new Map();
  return (key, build) => {
    if (m.has(key)) { const v = m.get(key); m.delete(key); m.set(key, v); return v; }
    const v = build(); m.set(key, v);
    while (m.size > cap) m.delete(m.keys().next().value);
    return v;
  };
}
export const big = lru(30);      // full-frame plates (≈8 MB each)
export const spr = lru(260);     // sprites (figures, props, pose frames)

// ---------------------------------------------------------------- local light helpers
// bloom: smooth radial core + stippled falloff, only an r-sized canvas
export function bloomL(ctx, x, y, r, { col = C.amber, core = C.amberHot, a = .6, k = .5, seed = 1, sy = 1, op = 'lighter' } = {}) {
  const ry = r * sy, [c, g] = lay(2 * r + 4, 2 * ry + 4);
  g.translate(r + 2, ry + 2); g.scale(1, sy);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, rgba(core, a)); rg.addColorStop(.15, rgba(col, a * .6)); rg.addColorStop(.5, rgba(col, a * .18)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0);
  if (k > 0) stipple(c, { k, g: 1.2, seed });
  ctx.save(); ctx.globalCompositeOperation = op; ctx.drawImage(c, x - r - 2, y - ry - 2); ctx.restore(); return c;
}
export function poolL(ctx, x, y, rx, ry, { col = C.amber, a = .6, k = .7, seed = 1, op = 'lighter', rot = 0 } = {}) {
  const R = Math.max(rx, ry) + 4, [c, g] = lay(2 * R, 2 * R); g.translate(R, R); g.rotate(rot); g.scale(1, ry / rx);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, rgba(col, a)); rg.addColorStop(.4, rgba(col, a * .5)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.beginPath(); g.arc(0, 0, rx, 0, 7); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0); if (k > 0) stipple(c, { k, g: 1.2, seed });
  ctx.save(); ctx.globalCompositeOperation = op; ctx.drawImage(c, x - R, y - R); ctx.restore(); return c;
}
// volumetric cone from (x,y); dir 0 = down
export function coneL(ctx, x, y, { dir = 0, spread = .45, len = 500, col = C.amber, a = .55, k = .7, seed = 1, op = 'lighter', soft = .25 } = {}) {
  const R = len / Math.cos(Math.min(1.3, spread * (1 + soft))) + 4, [c, g] = lay(2 * R, 2 * R);
  const ox = R, oy = R, ax = Math.sin(dir), ay = Math.cos(dir);
  const lg = g.createLinearGradient(ox, oy, ox + ax * len, oy + ay * len);
  lg.addColorStop(0, rgba(col, a)); lg.addColorStop(.35, rgba(col, a * .55)); lg.addColorStop(1, rgba(col, 0));
  for (let s = 0; s < 6; s++) {
    const sp = spread * (1 + soft * (s - 2.5) / 2.5); g.globalAlpha = 1 / 6 * 1.25; g.fillStyle = lg; g.beginPath(); g.moveTo(ox, oy);
    g.lineTo(ox + Math.sin(dir - sp) * len / Math.cos(sp), oy + Math.cos(dir - sp) * len / Math.cos(sp));
    g.lineTo(ox + Math.sin(dir + sp) * len / Math.cos(sp), oy + Math.cos(dir + sp) * len / Math.cos(sp)); g.closePath(); g.fill();
  }
  g.globalAlpha = 1; if (k > 0) stipple(c, { k, g: 1.3, seed });
  ctx.save(); ctx.globalCompositeOperation = op; ctx.drawImage(c, x - R, y - R); ctx.restore(); return c;
}
// fbm fog band inside a bbox (x0..x1, y0..y1), quarter-res, stippled edge
export function fogL(ctx, { x0 = 0, x1 = W, y0, y1, col = '#6fa0c8', a = .5, seed = 1, sx = .006, sy = .02, cover = .45, soft = .25, k = .45, op = 'source-over', edgeTop = .5, edgeBot = .5, edgeX = 0 } = {}) {
  const q = 4, w = x1 - x0, h = y1 - y0, lw = Math.ceil(w / q), lh = Math.ceil(h / q), [lc, lx] = lay(lw, lh), d = lx.createImageData(lw, lh), p = d.data, n = vnoise(seed);
  const n2 = parseInt(col.slice(1), 16), R = n2 >> 16, G = (n2 >> 8) & 255, B = n2 & 255;
  for (let j = 0; j < lh; j++) {
    const v = j / lh, band = clamp(v / edgeTop) * clamp((1 - v) / edgeBot);
    for (let i = 0; i < lw; i++) {
      const u = i / lw, ex = edgeX ? clamp(u / edgeX) * clamp((1 - u) / edgeX) : 1;
      const f = fbm(n, (x0 + i * q) * sx, (y0 + j * q) * sy, 5), dens = clamp((f - (1 - cover)) / soft) * Math.pow(band * ex, .7);
      const o = (j * lw + i) * 4; p[o] = R; p[o + 1] = G; p[o + 2] = B; p[o + 3] = 255 * a * dens;
    }
  }
  lx.putImageData(d, 0, 0);
  const [fc, fx] = lay(w, h); fx.imageSmoothingEnabled = true; fx.drawImage(lc, 0, 0, lw * q, lh * q);
  if (k > 0) stipple(fc, { k, g: 1.1, seed: seed + 3 });
  ctx.save(); ctx.globalCompositeOperation = op; ctx.drawImage(fc, x0, y0); ctx.restore();
  return fc;
}
// linear light/dark wash clipped to nothing (full rect)
export function vgrad(ctx, x, y, w, h, stops) { const g = ctx.createLinearGradient(0, y, 0, y + h); for (const [o, c] of stops) g.addColorStop(o, c); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); }
export function radial(ctx, x, y, r, stops, { op = 'source-over', sy = 1 } = {}) {
  ctx.save(); ctx.globalCompositeOperation = op; ctx.translate(x, y); ctx.scale(1, sy);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r); for (const [o, c] of stops) g.addColorStop(o, c); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore();
}

// a soft additive glow sprite (cached by colour), drawn scaled — cheap per frame
export function glowSprite(col = C.amber, core = '#fff1d0') {
  return spr('glow' + col + core, () => {
    const [c, g] = lay(128, 128), rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(.12, rgba(col, .75)); rg.addColorStop(.4, rgba(col, .2)); rg.addColorStop(1, rgba(col, 0));
    g.fillStyle = rg; g.fillRect(0, 0, 128, 128); return c;
  });
}
export function glowAt(ctx, x, y, r, a, col = C.amber, core = '#fff1d0') {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(glowSprite(col, core), x - r, y - r, 2 * r, 2 * r); ctx.restore();
}

// ---------------------------------------------------------------- figures
// Cached person() sprite. pose/o as art.person; o.light = {dx, dy, col, a} relative to the hip.
// Returns {c, pad, hand(i) -> [dx,dy] relative to hip}. Draw with drawFig at the hip point.
export function fig(key, s, pose, o = {}) {
  return spr('fig:' + key, () => {
    const pad = Math.ceil(236 * s), [c, g] = lay(2 * pad, 2 * pad), oo = { ...o };
    if (o.light) oo.light = { ...o.light, x: pad + o.light.dx, y: pad + o.light.dy };
    const r = person(g, pad, pad, s, pose, oo), hs = [r.hand(0), r.hand(1)].map(([x, y]) => [x - pad, y - pad]);
    return { c, pad, s, hand: (i) => hs[i] };
  });
}
// breathing + weight shift around the feet (s = figure scale), x,y = hip
export function drawFig(ctx, F, x, y, t = 0, { breath = 1, sway = 1, alpha = 1, ph = 0, feet = true } = {}) {
  const fy = y + 88 * F.s;
  ctx.save(); if (alpha < 1) ctx.globalAlpha = alpha;
  ctx.translate(x, feet ? fy : y);
  ctx.rotate(sway * (0.008 * Math.sin(t * 0.7 + ph) + 0.004 * Math.sin(t * 1.9 + 1 + ph)));
  ctx.scale(1, 1 + breath * 0.008 * Math.sin(t * 2.1 + ph));
  ctx.drawImage(F.c, -F.pad, -F.pad - (feet ? 88 * F.s : 0));
  ctx.restore();
}
// quantised pose animation: f(u) -> pose for u in 0..1, n frames cached
export function figAnim(key, n, u, s, poseFn, o) { const i = Math.round(clamp(u) * (n - 1)); return fig(`${key}#${i}`, s, poseFn(i / (n - 1)), o); }
export const lerpPose = (A, B, u) => {
  const o = { ...A };
  for (const k of ['lean', 'head']) if (typeof A[k] === 'number' && typeof B[k] === 'number') o[k] = mix(A[k], B[k], u);
  for (const k of ['sh', 'el', 'hip', 'kn']) if (A[k] && B[k]) o[k] = [mix(A[k][0], B[k][0], u), mix(A[k][1], B[k][1], u)];
  return o;
};

// ---------------------------------------------------------------- stage (2.5D)
// cam = {x, y, z}: focus point in design px (1920x1080 space) and zoom. Layer p = parallax (far .3 … near 1.3).
export function camAt(cam, p = 1, dolly = .25) {
  const k = cam.z * (1 + dolly * (p - 1) * (cam.z - 1));
  const fx = W / 2 + (cam.x - W / 2) * p, fy = H / 2 + (cam.y - H / 2) * p;
  return { k, X: (x) => W / 2 + (x - fx) * k, Y: (y) => H / 2 + (y - fy) * k, set: (ctx) => ctx.setTransform(k, 0, 0, k, W / 2 - fx * k, H / 2 - fy * k) };
}
export function stage(ctx, layers, cam) {
  for (const L of layers) {
    if (!L) continue;
    const m = camAt(cam, L.p ?? 1, L.dolly ?? .25);
    ctx.save(); m.set(ctx);
    if (L.alpha !== undefined) ctx.globalAlpha = L.alpha;
    if (L.op) ctx.globalCompositeOperation = L.op;
    if (L.c) ctx.drawImage(L.c, L.ox ?? 0, L.oy ?? 0);
    if (L.fn) L.fn(ctx, m);
    ctx.restore();
  }
}
// paper tooth + fine grain (same recipe as art.printFinish, but a cached tile so it is cheap per frame)
const PAPER = (() => {
  const S = 512, [c, g] = lay(S, S), n = vnoise(91), d = g.createImageData(S, S), p = d.data, r = prng(31);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const i = (y * S + x) * 4, v = 128 + (fbm(n, x * .9, y * .9, 2) - .5) * 70 + (r() - .5) * 90; p[i] = p[i + 1] = p[i + 2] = v; p[i + 3] = 255; }
  g.putImageData(d, 0, 0); return c;
})();
export function paper(ctx, a = .07, t = 0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay';
  const ox = (Math.floor(t * 12) * 37) % 64, oy = (Math.floor(t * 12) * 53) % 64;
  for (let x = -ox; x < W; x += 512) for (let y = -oy; y < H; y += 512) ctx.drawImage(PAPER, x, y);
  ctx.restore();
}
export function vignetteL(ctx, a = .4, col = '#05060f') {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(W * .5, H * .5, H * .35, W * .5, H * .5, H * 1.08); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
export function tintAll(ctx, col, a, op = 'source-over') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = op; ctx.fillStyle = rgba(col, a); ctx.fillRect(0, 0, W, H); ctx.restore(); }

// smooth path through points with a rough edge (filled ribbon between two polylines)
export function ribbon(ctx, A, B, fill, o = {}) { roughPoly(ctx, [...A, ...[...B].reverse()], fill, o); }
export { roughPath, roughPoly };
