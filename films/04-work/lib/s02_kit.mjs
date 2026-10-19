// s02_kit.mjs · helpers for chapter 02 "The first weeks" (owned by the s02 builder).
// - size-aware copies of art.mjs fog/cone/pool/bloom (art's versions always work on a 1920x1080 temp layer;
//   chapter 02 plates are larger than the frame so the camera can tilt/pan with parallax)
// - plate camera: layers with parallax p, drawn with one transform each; mapper to draw live elements in layer space
// - cache with a small LRU so built plates do not pile up in memory over the whole film
// - smear(): horizontal motion-blur echo for the (c) handoffs
// - pose sprites: person() rendered once per pose key (person() allocates a canvas per call)
import { createCanvas } from '@napi-rs/canvas';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, stipple, vnoise, fbm, person, roughPath, roughPoly } from './art.mjs';

export const PAL = {
  gold: '#ffc477', goldHot: '#ffe2a8', cream: '#fff1cf', rose: '#e8a3a0', roseDeep: '#b8606a', peach: '#f7b98a',
  coral: '#ef8a64', plum: '#3a2440', plumDeep: '#22162e', violet: '#4a3768', ink: '#140d1c', amber: '#ffb35c', sea: '#3d6f86',
};
export const lin = (a, b, t) => clamp((t - a) / (b - a));
export const sm = (x) => x * x * (3 - 2 * x);
export const eout = (x) => 1 - Math.pow(1 - x, 3);
export const ein = (x) => x * x * x;
export const eio = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const eoutq = (x) => 1 - Math.pow(1 - x, 4);
export const drift = (t, a = 1, ph = 0) => a * (Math.sin(t * 0.37 + ph) * 0.6 + Math.sin(t * 0.91 + ph * 1.7) * 0.3 + Math.sin(t * 1.73 + ph * 2.3) * 0.1);
export const back = (x, c = 1.4) => 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);

export function L(w = W, h = H) { const c = createCanvas(Math.ceil(w), Math.ceil(h)); return [c, c.getContext('2d')]; }
export function put(ctx, c, op = 'source-over', a = 1) { ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.drawImage(c, 0, 0); ctx.restore(); }

// ---------- cache (LRU by key) ----------
const CACHE = new Map(), MAXC = 3;
export function cached(key, build) {
  if (CACHE.has(key)) { const v = CACHE.get(key); CACHE.delete(key); CACHE.set(key, v); return v; }
  const v = build(); CACHE.set(key, v);
  while (CACHE.size > MAXC) CACHE.delete(CACHE.keys().next().value);
  return v;
}
// small sprite cache (figures, props) – unbounded but tiny
const SPR = new Map();
export function sprite(key, build) { if (!SPR.has(key)) SPR.set(key, build()); return SPR.get(key); }

// ---------- size-aware atmosphere (copies of art.mjs functions, canvas-size aware) ----------
export function fogL(ctx, { y0, y1, col = '#6fa0c8', a = .5, seed = 1, sx = .006, sy = .02, cover = .45, soft = .25, k = .45, op = 'source-over', x0 = 0, x1 = null, edgeTop = .5, edgeBot = .5 } = {}) {
  const CW = ctx.canvas.width, CH = ctx.canvas.height; x1 = x1 ?? CW;
  const q = 4, lw = Math.ceil(CW / q), lh = Math.ceil(CH / q), [lc, lx] = L(lw, lh), d = lx.createImageData(lw, lh), p = d.data, n = vnoise(seed);
  const n2 = parseInt(col.slice(1), 16), R = n2 >> 16, G = (n2 >> 8) & 255, B = n2 & 255;
  for (let j = Math.max(0, Math.floor(y0 / q)); j < Math.min(lh, Math.ceil(y1 / q)); j++) {
    const y = j * q, v = (y - y0) / (y1 - y0), band = clamp(v / edgeTop) * clamp((1 - v) / edgeBot);
    for (let i = Math.max(0, Math.floor(x0 / q)); i < Math.min(lw, Math.ceil(x1 / q)); i++) {
      const x = i * q, f = fbm(n, x * sx, y * sy, 5), dens = clamp((f - (1 - cover)) / soft) * Math.pow(band, .7);
      const o = (j * lw + i) * 4; p[o] = R; p[o + 1] = G; p[o + 2] = B; p[o + 3] = 255 * a * dens;
    }
  }
  lx.putImageData(d, 0, 0);
  const [fc, fx] = L(CW, CH); fx.imageSmoothingEnabled = true; fx.drawImage(lc, 0, 0, lw * q, lh * q);
  const ya = Math.max(0, Math.floor(y0)), yb = Math.min(CH, Math.ceil(y1));
  if (k > 0 && yb > ya) stipple(fc, { k, g: 1.1, seed: seed + 3, y: ya, h: yb - ya });
  put(ctx, fc, op); return fc;
}
export function coneL(ctx, x, y, { dir = 0, spread = .45, len = 500, col = C.amber, a = .55, k = .7, seed = 1, op = 'lighter', soft = .25, clipFn = null } = {}) {
  const [c, g] = L(ctx.canvas.width, ctx.canvas.height);
  if (clipFn) { g.save(); clipFn(g); g.clip(); }
  const ax = Math.sin(dir), ay = Math.cos(dir), lg = g.createLinearGradient(x, y, x + ax * len, y + ay * len);
  lg.addColorStop(0, rgba(col, a)); lg.addColorStop(.35, rgba(col, a * .55)); lg.addColorStop(1, rgba(col, 0));
  for (let s = 0; s < 6; s++) {
    const sp = spread * (1 + soft * (s - 2.5) / 2.5); g.globalAlpha = 1 / 6 * 1.25; g.fillStyle = lg; g.beginPath(); g.moveTo(x, y);
    g.lineTo(x + Math.sin(dir - sp) * len / Math.cos(sp), y + Math.cos(dir - sp) * len / Math.cos(sp));
    g.lineTo(x + Math.sin(dir + sp) * len / Math.cos(sp), y + Math.cos(dir + sp) * len / Math.cos(sp)); g.closePath(); g.fill();
  }
  g.globalAlpha = 1; if (clipFn) g.restore();
  stipple(c, { k, g: 1.3, seed }); put(ctx, c, op); return c;
}
export function poolL(ctx, x, y, rx, ry, { col = C.amber, a = .6, k = .7, seed = 1, op = 'lighter', rot = 0 } = {}) {
  const [c, g] = L(ctx.canvas.width, ctx.canvas.height); g.translate(x, y); g.rotate(rot); g.scale(1, ry / rx);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, rgba(col, a)); rg.addColorStop(.4, rgba(col, a * .5)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.beginPath(); g.arc(0, 0, rx, 0, 7); g.fill(); stipple(c, { k, g: 1.2, seed }); put(ctx, c, op); return c;
}
export function bloomL(ctx, x, y, r, { col = C.amber, core = '#ffd59a', a = .6, k = .5, seed = 1, sy = 1, op = 'lighter' } = {}) {
  const [c, g] = L(ctx.canvas.width, ctx.canvas.height); g.setTransform(1, 0, 0, sy, 0, y * (1 - sy));
  const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, rgba(core, a)); rg.addColorStop(.15, rgba(col, a * .6)); rg.addColorStop(.5, rgba(col, a * .18)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k, g: 1.2, seed }); put(ctx, c, op); return c;
}
// cheap live glow (no stipple) for animated lights
export function glowLive(ctx, x, y, r, a, col = PAL.gold, core = PAL.cream, op = 'lighter') {
  if (r <= 0 || a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = op; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(core, a)); g.addColorStop(.25, rgba(col, a * .45)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
}
export function vgrad(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); for (const [o, c] of stops) g.addColorStop(o, c); return g; }

// ---------- plate camera ----------
// A layer = { c: canvas, p: parallax, cx, cy } (cx,cy = layer point that sits at screen centre when cam = 0).
// cam = { x, y, z }: pan in px (scaled by p), z = zoom (applied as 1 + (z-1)*p*zf, zf per layer, default 1).
export function layerXf(Lr, cam) {
  const p = Lr.p ?? 1, k = (Lr.base ?? 1) * (1 + (cam.z - 1) * p * (Lr.zf ?? 1)), cx = (Lr.cx ?? Lr.c.width / 2) + cam.x * p, cy = (Lr.cy ?? Lr.c.height / 2) + cam.y * p;
  return { k, e: W / 2 - cx * k, f: H / 2 - cy * k, X: (x) => W / 2 + (x - cx) * k, Y: (y) => H / 2 + (y - cy) * k };
}
export function drawLayer(ctx, Lr, cam, live = null) {
  const m = layerXf(Lr, cam);
  ctx.save(); ctx.setTransform(m.k, 0, 0, m.k, m.e, m.f);
  if (Lr.c) { if (Lr.a !== undefined) ctx.globalAlpha = Lr.a; ctx.drawImage(Lr.c, 0, 0); ctx.globalAlpha = 1; }
  if (live) live(ctx, m);
  ctx.restore(); return m;
}
// ---------- smear for (c) handoffs: horizontal echo of the finished frame ----------
let SM = null;
export function smear(ctx, dx, n = 4) {
  if (Math.abs(dx) < 2) return;
  if (!SM) SM = L(W, H);
  const [c, g] = SM; g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.drawImage(ctx.canvas, 0, 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 1; i <= n; i++) { ctx.globalAlpha = .5 / (i + 1) ** .5; ctx.drawImage(c, -dx * i / n, 0); }
  ctx.restore();
}
// velocity profile of the engine's left/right composite (eio) as fraction of W per unit u -> for smear amount
export function whipAmt(t, a, b) { if (t <= a || t >= b) return 0; const u = (t - a) / (b - a); const d = u < .5 ? 12 * u * u : 12 * (1 - u) * (1 - u); return d; }

// ---------- figures as cached sprites ----------
// pose keys are quantised, so a breathing figure reuses a few sprites
export function figSprite(key, s, pose, o) {
  return sprite('fig:' + key, () => {
    const pad = 220 * s, [c, g] = L(pad * 2 + 8, pad * 2 + 8);
    const r = person(g, pad + 4, pad + 4, s, pose, o);
    return { c, pad: pad + 4, hand: r.hand };
  });
}
export function drawFig(ctx, f, x, y) { ctx.drawImage(f.c, x - f.pad, y - f.pad); }

// rough ellipse path points
export function ell(cx, cy, rx, ry, n = 36, rot = 0) { const out = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry; out.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return out; }
export { W, H, C, rgba, clamp, mix, prng, mixHex, shade, vnoise, fbm, stipple, roughPath, roughPoly };

// ---------- cached person(): pose values rounded, sprite cropped around the figure, small LRU ----------
const FIG = new Map(), FIGMAX = 14;
const q2 = (v) => Array.isArray(v) ? v.map(q2) : (typeof v === 'number' ? Math.round(v * 60) / 60 : v);
export function figure(ctx, x, y, s, pose, o = {}) {
  const P = {}; for (const k in pose) P[k] = q2(pose[k]);
  const key = s + '|' + JSON.stringify(P) + '|' + JSON.stringify(o, (k, v) => (k === 'prop' ? undefined : v));
  let f = FIG.get(key);
  if (f) { FIG.delete(key); FIG.set(key, f); }
  else {
    // big figures are rendered at <= 2.6 and scaled up (person() cost grows with s^2)
    const k = Math.min(1, 2.6 / s), rs = s * k;
    const w = Math.ceil(320 * rs), h = Math.ceil(350 * rs), ox = w / 2, oy = 215 * rs;
    const [c, g] = L(w, h);
    const o2 = { ...o }; if (o.light) o2.light = { ...o.light, x: (o.light.x - x) * k + ox, y: (o.light.y - y) * k + oy };
    if (o.rimW) o2.rimW = o.rimW * k;
    const r = person(g, ox, oy, rs, P, o2);
    f = { c, ox, oy, k, hand: (i) => { const [hx, hy] = r.hand(i); return [(hx - ox) / k, (hy - oy) / k]; } };
    FIG.set(key, f); while (FIG.size > FIGMAX) FIG.delete(FIG.keys().next().value);
  }
  if (f.k === 1) ctx.drawImage(f.c, x - f.ox, y - f.oy); else ctx.drawImage(f.c, x - f.ox / f.k, y - f.oy / f.k, f.c.width / f.k, f.c.height / f.k);
  return { hand: (i) => { const [hx, hy] = f.hand(i); return [x + hx, y + hy]; } };
}
