// c12 kit (Film 4 v2, chunk c12 "Wanting to"). Owner: c12 builder. Shared helpers for lib/v2_c12_*.mjs and scenes/sc12.mjs.
//   once(key, f) / toImg / best / ready   cached static layers as decoded Images (the @napi-rs/canvas drawImage(Canvas) leak fix,
//                                          copied from lib/sc01_m1_open.mjs: the default export awaits ready())
//   glowSpr(col, r)                       a soft radial glow sprite (Image), drawn with 'lighter'
//   paperPlateWorld(ctx, t, o)            handoff4's warm paper plate, re-drawn as a WORLD surface (copied from lib/handoff4.mjs
//                                          paperPlate): with the identity camera it is pixel-identical to the plate; o.k/o.x/o.y move it
//   linePlateIn(ctx, t, o)                handoff4's line plate (amber, y 600) re-drawn with a free line height (o.y) and an optional
//                                          clip rect: with o.y = 600 and a full-frame clip it is pixel-identical to the plate
//   label(ctx, s, x, y, a, o)             a text label with a soft dark halo (lower thirds, map labels)
//   sourceLine(ctx, s, x, y, a)           the small Inter caps source line (above the 170 px subtitle zone)
import { Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, drift, canvas, text } from '../engine.mjs';

export const TAU = Math.PI * 2;
// ---------------------------------------------------------------- cached layers → Images (from lib/sc01_m1_open.mjs)
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
// a cached thing that is not an image (geometry, lists)
const DATA = new Map();
export const memo = (k, f) => { if (!DATA.has(k)) DATA.set(k, f()); return DATA.get(k); };

// ---------------------------------------------------------------- easing
export const eoq = (x) => 1 - Math.pow(1 - clamp(x), 4);
export const eiq = (x) => Math.pow(clamp(x), 4);
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const smoo = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const smoother = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
// hex colour mix
export function mixC(a, b, u) {
  const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)], A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(mix(v, B[i], clamp(u))).toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------- glow sprite
export function glowSpr(col, r, core = .95) {
  return once('glow' + col + r + core, () => {
    const R = Math.ceil(r), [c, g] = canvas(R * 2, R * 2), gr = g.createRadialGradient(R, R, 0, R, R, R);
    gr.addColorStop(0, rgba(col, core)); gr.addColorStop(.3, rgba(col, core * .37)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2); return c;
  });
}
export function glowAt(ctx, x, y, r, a, col = '#ffb35c') {
  if (a <= 0 || r <= 0) return; const s = glowSpr(col, 64);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(a); ctx.drawImage(s, x - r, y - r, r * 2, r * 2); ctx.restore();
}

// ---------------------------------------------------------------- the warm paper plate as a world surface (from lib/handoff4.mjs)
// FIB / the gradient / the watermark rosette / the vignette are exactly handoff4's paperPlate for tone 'warm'.
const FIB = (() => { const r = prng(77), f = []; for (let i = 0; i < 420; i++) f.push([r() * W, r() * H, (r() - .5) * 2.4, 6 + r() * 26, r()]); return f; })();
export const PAPERW = ['#f6e7c9', '#e8cfa2', '#d2ad74'];
// the extra fibres for the rest of the sheet (outside the plate's frame), same density
const FIB2 = (() => { const r = prng(7701), f = []; const X0 = -4200, X1 = 3600, Y0 = -3000, Y1 = 2600, n = Math.round(420 * (X1 - X0) * (Y1 - Y0) / (W * H)); for (let i = 0; i < n; i++) { const x = X0 + r() * (X1 - X0), y = Y0 + r() * (Y1 - Y0); if (x > -30 && x < W + 30 && y > -30 && y < H + 30) continue; f.push([x, y, (r() - .5) * 2.4, 6 + r() * 26, r()]); } return f; })();
export const plateLight = (t) => [W * .32 + 30 * drift(t, 1, 2), H * .25];
// o: { cam: (sx, sy) world→screen is handled by the caller's transform; vig (0..1 strength of the screen vignette), fibres2 (draw the rest of the sheet) }
// The caller sets the world transform (identity at the plate). The light (gradient centre) drifts in world units like the plate's.
export function paperPlateWorld(ctx, t, o = {}) {
  const [p0, p1, p2] = PAPERW, [lx, ly] = plateLight(o.lightT ?? t);
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1700); g.addColorStop(0, p0); g.addColorStop(.6, p1); g.addColorStop(1, p2);
  ctx.fillStyle = g; const R = o.rect || [0, 0, W, H]; ctx.fillRect(R[0], R[1], R[2], R[3]);
  ctx.lineCap = 'round';
  const fib = (arr, cull) => { for (const [x, y, a, L, k] of arr) { if (cull && (x < cull[0] - 40 || x > cull[2] + 40 || y < cull[1] - 40 || y > cull[3] + 40)) continue; ctx.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .07 + .06 * k); ctx.lineWidth = .7 + k * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke(); } };
  fib(FIB, null);
  if (o.fibres2) fib(FIB2, o.cull || null);
  // watermark (the guilloche rosette, turning slowly): in the c12 world it is the compass rose of the map's ocean
  ctx.strokeStyle = rgba('#9c8458', .1); ctx.lineWidth = .8; const R0 = 300, rot = t * .02;
  for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let i = 0; i <= 360; i++) { const q = i / 360 * TAU, rr = R0 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); const x = W * .72 + rr * Math.cos(q + rot), y = H * .56 + rr * Math.sin(q + rot) * .92; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
}
// the paper of the map phase: the plate's light stays in SCREEN space (a lamp over the desk, fixed to the camera), the sheet's fibres
// and its watermark rosette are WORLD things (the caller's transform). With the identity transform this IS handoff4's paperPlate
// (gradient, FIB, rosette; the caller adds paperVignette). o.view = [x0, y0, x1, y1] the visible sheet rect (the extra fibres).
const FIB2B = (() => { const b = [[], [], [], [], [], []]; for (const f of FIB2) b[(f[4] < .5 ? 0 : 3) + Math.min(2, Math.floor((f[4] % .5) * 6))].push(f); return b; })();
export function paperSheet(ctx, t, o = {}) {
  const [p0, p1, p2] = PAPERW, [lx, ly] = plateLight(t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1700); g.addColorStop(0, p0); g.addColorStop(.6, p1); g.addColorStop(1, p2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.lineCap = 'round';
  for (const [x, y, a, L, k] of FIB) { ctx.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .07 + .06 * k); ctx.lineWidth = .7 + k * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke(); }
  if (o.view) {
    const [vx0, vy0, vx1, vy1] = o.view;
    FIB2B.forEach((arr, bi) => {
      const k = bi < 3 ? .08 + bi * .16 : .58 + (bi - 3) * .16; ctx.strokeStyle = rgba(bi < 3 ? '#8a7350' : '#fffaf0', .07 + .06 * k); ctx.lineWidth = .7 + k * .6; ctx.beginPath();
      for (const [x, y, a, L] of arr) { if (x < vx0 - 40 || x > vx1 + 40 || y < vy0 - 40 || y > vy1 + 40) continue; ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); }
      ctx.stroke();
    });
  }
  ctx.strokeStyle = rgba('#9c8458', .1); ctx.lineWidth = .8; const R0 = 300, rot = t * .02;
  for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let i = 0; i <= 360; i++) { const q = i / 360 * TAU, rr = R0 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); const x = W * .72 + rr * Math.cos(q + rot), y = H * .56 + rr * Math.sin(q + rot) * .92; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
}
// the plate's screen vignette (screen space), strength a (1 = the plate's)
export function paperVignette(ctx, a = 1) {
  if (a <= 0) return;
  const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .75); v.addColorStop(0, 'rgba(60,40,20,0)'); v.addColorStop(1, `rgba(60,40,20,${.22 * a})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}

// ---------------------------------------------------------------- the amber line plate with a free line height (from lib/handoff4.mjs linePlate)
// o: { y (screen y of the line, the plate's is 600), clip: [x, y, w, h] screen rect (the surface the line lives on), lineA (0..1 the
//      line's own strength: 1 = the plate), ground (true: draw the dark ground with its glow + hatch inside the clip) }
export function linePlateIn(ctx, t, o = {}) {
  const y0 = o.y ?? 600, la = o.lineA ?? 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (o.clip) { const [x, y, w, h] = o.clip; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); }
  if (o.ground !== false) {
    ctx.fillStyle = '#0a0c22'; ctx.fillRect(0, 0, W, H);
    const v = ctx.createRadialGradient(W / 2, y0, 0, W / 2, y0, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(160,150,220,.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke();
  }
  if (la > 0) {
    const col = ['#ffb35c', '#fff1d6'], L = 1400;
    ctx.translate(W / 2, y0 + 2 * Math.sin(t * .9)); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    const br = .9 + .1 * Math.sin(t * 2.1);
    for (const [w, al, c] of [[26, .05, col[0]], [10, .14, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) { ctx.strokeStyle = rgba(c, al * la); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(L, 0); ctx.stroke(); }
    ctx.strokeStyle = rgba(col[1], .35 * la); ctx.lineWidth = 1; ctx.beginPath(); for (let x = -L; x < L; x += 9) { const h = 2 + 1.5 * Math.sin(x * .07 + t); ctx.moveTo(x, -h); ctx.lineTo(x + 3, h); } ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- text
export function label(ctx, s, x, y, a, o = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.shadowColor = o.shadow || 'rgba(2,3,12,.85)'; ctx.shadowBlur = o.blur ?? 12;
  text(ctx, s, x, y, { size: o.size ?? 18, weight: o.weight ?? 600, color: o.col || '#f3efe2', alpha: clamp(a) * (o.alpha ?? .92), spacing: o.spacing ?? 5, align: o.align || 'left', font: o.font || 'Inter' });
  ctx.restore();
}
export function sourceLine(ctx, s, x, y, a, o = {}) {
  if (a <= 0) return;
  label(ctx, s.toUpperCase(), x, y, a, { size: o.size ?? 16, spacing: o.spacing ?? 3.5, col: o.col || '#e8e2d0', alpha: o.alpha ?? .8, shadow: o.shadow, blur: o.blur ?? 10 });
}
