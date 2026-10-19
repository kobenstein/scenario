// hill_art.mjs · helpers for the Maslow hill builder (scenes/hill.mjs).
// Region-limited, resolution-aware copies of art.mjs effects (fog / bloom / cone / masks) so a layer can be built on an
// offset canvas at any supersampling SS (art.mjs versions always allocate a full 1920x1080 layer in screen space).
// Also: a pose-sprite cache for person() (figures that move every frame), camera/parallax mapping, mip-mapped drawing.
import { createCanvas, Image } from '@napi-rs/canvas';
import { C, rgba, clamp, mix, prng, mixHex, shade, stipple, vnoise, fbm, person } from './art.mjs';
export { C };

export function cv(w, h) { const c = createCanvas(Math.max(1, Math.ceil(w)), Math.max(1, Math.ceil(h))); const g = c.getContext('2d'); return [c, g]; }

// ---- region builder: every effect layer is allocated only over its bbox ∩ REGION, in world units, at SS px / unit
let REGION = null;               // [x0,y0,x1,y1] world rect of the canvas being built (null = unlimited)
export function setRegion(r) { REGION = r; }
function clipBox([x, y, w, h]) {
  if (!REGION) return [x, y, w, h];
  const x0 = Math.max(x, REGION[0]), y0 = Math.max(y, REGION[1]), x1 = Math.min(x + w, REGION[2]), y1 = Math.min(y + h, REGION[3]);
  return x1 > x0 && y1 > y0 ? [x0, y0, x1 - x0, y1 - y0] : null;
}
// fx: run draw(g) on a temporary layer that covers bbox (world units) at SS, optional stipple + mask(g, box), then composite.
export function fx(ctx, SS, bbox, draw, { st = null, op = 'source-over', a = 1, mask = null, blur = 0 } = {}) {
  const b = clipBox(bbox); if (!b) return;
  const [bx, by, bw, bh] = b, [c, g] = cv(bw * SS, bh * SS);
  g.setTransform(SS, 0, 0, SS, -bx * SS, -by * SS);
  g.save(); draw(g, b); g.restore(); g.setTransform(1, 0, 0, 1, 0, 0);   // NB: napi putImageData honours the transform
  let out = c;
  if (blur) { const [c2, g2] = cv(c.width, c.height); g2.filter = `blur(${blur * SS}px)`; g2.drawImage(c, 0, 0); out = c2; }
  if (st) { out.getContext('2d').setTransform(1, 0, 0, 1, 0, 0); stipple(out, st); }
  if (mask) { const g3 = out.getContext('2d'); g3.setTransform(SS, 0, 0, SS, -bx * SS, -by * SS); g3.save(); g3.globalCompositeOperation = 'destination-in'; mask(g3, b); g3.restore(); g3.setTransform(1, 0, 0, 1, 0, 0); }
  ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.drawImage(out, bx, by, bw, bh); ctx.restore();
}
// masks (call inside fx's mask: g is in world coords, composite op already destination-in)
export const mLin = (x0, y0, x1, y1, stops) => (g, [bx, by, bw, bh]) => { const gr = g.createLinearGradient(x0, y0, x1, y1); for (const [o, a] of stops) gr.addColorStop(o, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(bx, by, bw, bh); };
export const mRad = (x, y, r1, stops, sy = 1) => (g, [bx, by, bw, bh]) => { g.save(); g.translate(x, y); g.scale(1, sy); const gr = g.createRadialGradient(0, 0, 0, 0, 0, r1); for (const [o, a] of stops) gr.addColorStop(o, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(bx - x - 10, (by - y) / sy - 10, bw + 20, bh / sy + 20); g.restore(); };
export const mBoth = (m1, m2) => (g, b) => { m1(g, b); m2(g, b); };

// fbm fog band in world coords (copy of art.fog, region-limited, any SS)
export function fogW(ctx, SS, { x0 = -2000, x1 = 4000, y0, y1, col = '#6fa0c8', a = .5, seed = 1, sx = .006, sy = .02, cover = .45, soft = .25, k = .45, op = 'source-over', edgeTop = .5, edgeBot = .5, mask = null, q = 4 } = {}) {
  const b = clipBox([x0, y0, x1 - x0, y1 - y0]); if (!b) return;
  const [bx, by, bw, bh] = b, lw = Math.ceil(bw / q) + 1, lh = Math.ceil(bh / q) + 1, [lc, lx] = cv(lw, lh), d = lx.createImageData(lw, lh), p = d.data, n = vnoise(seed);
  const n2 = parseInt(col.slice(1), 16), R = n2 >> 16, G = (n2 >> 8) & 255, B = n2 & 255;
  for (let j = 0; j < lh; j++) {
    const y = by + j * q, v = (y - y0) / (y1 - y0), band = clamp(v / edgeTop) * clamp((1 - v) / edgeBot);
    if (band <= 0) continue;
    for (let i = 0; i < lw; i++) {
      const x = bx + i * q, f = fbm(n, x * sx, y * sy, 5), dens = clamp((f - (1 - cover)) / soft) * Math.pow(band, .7);
      const o = (j * lw + i) * 4; p[o] = R; p[o + 1] = G; p[o + 2] = B; p[o + 3] = 255 * a * dens;
    }
  }
  lx.putImageData(d, 0, 0);
  fx(ctx, SS, b, (g) => { g.imageSmoothingEnabled = true; g.drawImage(lc, bx, by, lw * q, lh * q); }, { st: k > 0 ? { k, g: 1.1, seed: seed + 3 } : null, op, mask });
}
export function bloomW(ctx, SS, x, y, r, { col = C.amber, core = C.amberHot, a = .6, k = .5, seed = 1, sy = 1, op = 'lighter' } = {}) {
  fx(ctx, SS, [x - r, y - r * sy, 2 * r, 2 * r * sy], (g) => { g.translate(x, y); g.scale(1, sy); const rg = g.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, rgba(core, a)); rg.addColorStop(.15, rgba(col, a * .6)); rg.addColorStop(.5, rgba(col, a * .18)); rg.addColorStop(1, rgba(col, 0)); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); }, { st: k ? { k, g: 1.2, seed } : null, op });
}
export function coneW(ctx, SS, x, y, { dir = 0, spread = .45, len = 500, col = C.amber, a = .55, k = .7, seed = 1, op = 'lighter', soft = .25 } = {}) {
  const R = len / Math.cos(spread * 1.3) + 4;
  fx(ctx, SS, [x - R, y - R, 2 * R, 2 * R], (g) => {
    const ax = Math.sin(dir), ay = Math.cos(dir), lg = g.createLinearGradient(x, y, x + ax * len, y + ay * len);
    lg.addColorStop(0, rgba(col, a)); lg.addColorStop(.35, rgba(col, a * .55)); lg.addColorStop(1, rgba(col, 0));
    for (let s = 0; s < 6; s++) { const sp = spread * (1 + soft * (s - 2.5) / 2.5); g.globalAlpha = 1 / 6 * 1.25; g.fillStyle = lg; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(dir - sp) * len / Math.cos(sp), y + Math.cos(dir - sp) * len / Math.cos(sp)); g.lineTo(x + Math.sin(dir + sp) * len / Math.cos(sp), y + Math.cos(dir + sp) * len / Math.cos(sp)); g.closePath(); g.fill(); }
  }, { st: { k, g: 1.3, seed }, op });
}
export function poolW(ctx, SS, x, y, rx, ry, { col = C.amber, a = .6, k = .7, seed = 1, op = 'lighter' } = {}) {
  fx(ctx, SS, [x - rx, y - ry, 2 * rx, 2 * ry], (g) => { g.translate(x, y); g.scale(1, ry / rx); const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, rgba(col, a)); rg.addColorStop(.4, rgba(col, a * .5)); rg.addColorStop(1, rgba(col, 0)); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, rx, 0, 7); g.fill(); }, { st: { k, g: 1.2, seed }, op });
}

// ---- mip chain: a big canvas plus halved copies; draw the level whose density is closest to 1 screen px / canvas px
// NB: @napi-rs/canvas snapshots a canvas source on EVERY drawImage (55 ms for 4000x1600), an Image source is free,
// so every cached layer is frozen into an Image once.
export function toImg(c) { const im = new Image(); im.src = c.toBuffer('image/png'); return im; }
export function mips(c, levels = 2) {
  const out = [{ c: toImg(c), s: 1 }]; let cur = c;
  for (let i = 0; i < levels; i++) { const [m, g] = cv(cur.width / 2, cur.height / 2); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(cur, 0, 0, m.width, m.height); out.push({ c: toImg(m), s: out[out.length - 1].s / 2 }); cur = m; }
  return out;
}
// layer = { m: mips, x, y, w, h } (world rect); M = { k, X, Y } world → screen (screen = X + wx*k ...)
export function pickMip(L, k) { const ss0 = L.m[0].c.width / L.w; let best = L.m[0]; for (const m of L.m) if (ss0 * m.s >= k * .9) best = m; return best; }
export function drawLayer(ctx, L, M, { a = 1, op = 'source-over', sub = null } = {}) {
  if (a <= 0) return;
  const m = pickMip(L, M.k), sc = m.c.width / L.w;
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = op; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'medium';
  // only the visible part of the source
  let x0 = (0 - M.ox) / M.k, x1 = (1920 - M.ox) / M.k, y0 = (0 - M.oy) / M.k, y1 = (1080 - M.oy) / M.k;
  if (sub) { x0 = Math.max(x0, sub[0]); y0 = Math.max(y0, sub[1]); x1 = Math.min(x1, sub[2]); y1 = Math.min(y1, sub[3]); }
  x0 = Math.max(x0, L.x); y0 = Math.max(y0, L.y); x1 = Math.min(x1, L.x + L.w); y1 = Math.min(y1, L.y + L.h);
  if (x1 > x0 && y1 > y0) {
    const sx = (x0 - L.x) * sc, sy = (y0 - L.y) * sc, sw = (x1 - x0) * sc, sh = (y1 - y0) * sc;
    ctx.drawImage(m.c, sx, sy, sw, sh, M.ox + x0 * M.k, M.oy + y0 * M.k, (x1 - x0) * M.k, (y1 - y0) * M.k);
  }
  ctx.restore();
}

// ---- camera: cam = {x, y, z} = world point at screen centre, zoom. Parallax p: 1 = hill plane, <1 far, >1 near.
export function proj(cam, p = 1, ref = [960, 540]) {
  const k = Math.pow(cam.z, p), fx0 = ref[0] + (cam.x - ref[0]) * p, fy0 = ref[1] + (cam.y - ref[1]) * p;
  const ox = 960 - fx0 * k, oy = 540 - fy0 * k;
  return { k, ox, oy, X: (x) => ox + x * k, Y: (y) => oy + y * k };
}
// interpolate camera keys [{t, x, y, z, e}] (log-space zoom, eased)
export function camKeys(t, keys) {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const u = (b.e || sineE)(clamp((t - a.t) / (b.t - a.t))); return { x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), z: Math.exp(mix(Math.log(a.z), Math.log(b.z), u)) }; }
  }
  return { ...keys[keys.length - 1] };
}
export const sineE = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
export const quartIO = (x) => x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2;
export const expoOut = (x) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
export const cubicOut = (x) => 1 - Math.pow(1 - x, 3);
export const cubicIn = (x) => x * x * x;
// perpetual drift (never zero velocity)
export const drift = (t, a = 1, ph = 0) => a * (Math.sin(t * 0.37 + ph) * 0.6 + Math.sin(t * 0.91 + ph * 1.7) * 0.3 + Math.sin(t * 1.73 + ph * 2.3) * 0.1);

// ---- figure sprites: person() renders into a cached canvas per (key, quantised pose phase). Draw with transforms.
const FIG = new Map();
export function figSprite(key, s, pose, o = {}) {
  let e = FIG.get(key);
  if (!e) {
    const pad = 230 * s, [c, g] = cv(pad * 2, pad * 2);
    const r = person(g, pad, pad, s, pose, o);
    e = { c, pad, hand: r.hand, feet: r.feetY };
    if (c.width * c.height > 200000) { const im = toImg(c); im.decode().then(() => { e.c = im; }); }
    if (FIG.size > 1500) FIG.delete(FIG.keys().next().value);
    FIG.set(key, e);
  }
  return e;
}
// draw a figure at hip (x,y) with scale s; breathing (scaleY), sway (rotation about the feet); returns hand helper in screen space
export function fig(ctx, key, x, y, s, pose, o = {}, { t = 0, breathe = 1, sway = 1, alpha = 1, ph = 0, sc = 1 } = {}) {
  const e = figSprite(key, s, pose, o), feetY = 88 * s;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y + feetY * sc);
  ctx.rotate(sway * (0.010 * Math.sin(t * 0.7 + ph) + 0.005 * Math.sin(t * 1.9 + 1 + ph)));
  ctx.scale(sc, sc * (1 + breathe * 0.008 * Math.sin(t * 2.1 + ph)));
  ctx.drawImage(e.c, -e.pad, -e.pad - feetY);
  ctx.restore();
  return e;
}
// pose lerp helper: mix two pose objects (numbers and [a,b] arrays)
export function lerpPose(A, B, u) {
  const o = { ...A };
  for (const k of Object.keys(B)) { const a = A[k], b = B[k]; if (typeof a === 'number' && typeof b === 'number') o[k] = mix(a, b, u); else if (Array.isArray(a) && Array.isArray(b)) o[k] = a.map((v, i) => mix(v, b[i], u)); else o[k] = u < .5 ? a : b; }
  return o;
}
// quantise a phase so the sprite cache stays small
export const q = (u, n = 16) => Math.round(clamp(u) * n) / n;

// ---- screen-space smear for (c) hand-overs: draw the current frame onto itself offset (cheap motion blur)
const [smC, smX] = cv(1920, 1080);
export function smear(ctx, canvas, dx, dy = 0, n = 4) {
  if (Math.abs(dx) + Math.abs(dy) < 1.5) return;
  smX.clearRect(0, 0, 1920, 1080); smX.drawImage(canvas, 0, 0);
  ctx.save();
  for (let i = 1; i <= n; i++) { ctx.globalAlpha = .5 / (i * .8 + .4) * .6; ctx.drawImage(smC, -dx * i / n, -dy * i / n); }
  ctx.restore();
}

// ---- cheap print finish per frame (paper tooth overlay, cached), the engine adds grain + vignette on top
let PAPER = null;
export function paper(ctx, a = .06, t = 0) {
  if (!PAPER) { const [c, g] = cv(1024, 1024), n = vnoise(91), d = g.createImageData(1024, 1024), p = d.data, r = prng(31);
    for (let y = 0; y < 1024; y++) for (let x = 0; x < 1024; x++) { const i = (y * 1024 + x) * 4, v = 128 + (fbm(n, x * .9, y * .9, 2) - .5) * 70 + (r() - .5) * 90; p[i] = p[i + 1] = p[i + 2] = v; p[i + 3] = 255; }
    g.putImageData(d, 0, 0); PAPER = c; }
  const f = Math.floor(t * 12), ox = (f * 397) % 1024, oy = (f * 211) % 1024;
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay';
  for (let x = -ox; x < 1920; x += 1024) for (let y = -oy; y < 1080; y += 1024) ctx.drawImage(PAPER, x, y);
  ctx.restore();
}
export function vig(ctx, a = .4, col = '#05060f') { const g = ctx.createRadialGradient(960, 540, 1080 * .35, 960, 540, 1080 * 1.08); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
export { rgba, clamp, mix, prng, mixHex, shade };
