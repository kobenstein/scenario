// Film 6 · "AI Isn't Conscious. That's the Problem." · the shared drawing kit (K0). Every export is a pure function of t (seconds) and its
// options: no state between frames, deterministic prng only. Screen space is 1920×1080 unless you set your own transform first.
// The four objects of the film (MOTION.md): the PANE (dark glass that reflects, transmits or glows), the COOL LINE (intelligence: one
// straight silver-blue filament that writes), the EMBER (consciousness: a warm light with a body, breathing at ~60 bpm) and the WITNESS
// point (a steady white-gold point above a head). Paper and ink come from lib/paper.mjs (paperSheet, scribble, pen), clouds are here.
// API reference with defaults: lib/F6_KIT.md. Usage examples: tools/k0_stills.mjs (the six K0 stills).
//
// Caching: layer(key, w, h, paint) draws a static layer once and keeps it as a canvas (measured: a canvas source draws 3× faster than a
// decoded Image under the camera's float/zoom transform, 7 ms vs 20 ms for a full frame). Warm up once in prepare and await ready()
// (it resolves any explicit toImg() conversions; a plain warm-up needs nothing more):
//   export default async (T, R) => { … ; nightRoom(ctx0, R.a, {}) /* warm up once */; await ready(); return entries; }
// Dynamic offscreen canvases are fine when every frame is flushed (render.mjs reads the frame): @napi-rs/canvas keeps a copy of a
// changed source canvas only until the next flush. Never use `new Image(); img.src = buf` (draws nothing): toImg() uses loadImage.
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eout, eio, prng, drift, canvas, text, addGlow, hatch } from '../engine.mjs';
import { stipple, vnoise } from './art.mjs';
import { fibreFill } from './print.mjs';
import { figure, POSES } from './figure.mjs';
import { clipFrame, clipInfo } from './kit.mjs';

const TAU = Math.PI * 2;
export const F6 = {
  glassTop: '#0a0f24', glassBot: '#05060f', cool: '#bfe3ff', coolCore: '#eef8ff', coolCold: '#9fb8d6',
  amber: '#ffb35c', amberCore: '#fff1d6', amberDeep: '#c4512e', witness: '#fffaf0',
  night: '#0c1226', slate: '#141a2e', silver: '#dfe7f2', cream: '#f3ecda', ink: '#2a2420', praise: '#ffd27a',
};
const hex2 = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mixHex = (a, b, u) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(mix(v, B[i], u)).toString(16).padStart(2, '0')).join(''); };

// ---------------------------------------------------------------- caches: once(), layer() → Image, ready()
const ONCE = new Map();
export const once = (k, f) => { if (!ONCE.has(k)) ONCE.set(k, f()); return ONCE.get(k); };
const LAYERS = new Map(); let PENDING = [];
// an async Image from a canvas (the only way that works in @napi-rs/canvas); awaited by ready() when pushed through pending()
export const toImg = (c) => loadImage(c.toBuffer('image/png'));
export const pending = (p) => { PENDING.push(p); return p; };
// a static layer: painted once with paint(g, c) and kept as a canvas (faster to draw under a transform than an Image, see the header)
export function layer(key, w, h, paint) {
  let c = LAYERS.get(key); if (c) return c;
  let g; [c, g] = canvas(w, h); paint(g, c); LAYERS.set(key, c); return c;
}
export const ready = () => { const p = PENDING; PENDING = []; return Promise.all(p); };
const SCRATCH = new Map();
const scratch = (k, w, h) => { const key = `${k}:${w}x${h}`; if (!SCRATCH.has(key)) SCRATCH.set(key, canvas(w, h)); const [c, g] = SCRATCH.get(key); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, w, h); return [c, g]; };

// ---------------------------------------------------------------- small helpers
// the ember's breath: ±3 % at bpm (default 60), never a strobe; kind 'heart' = a soft lub-dub instead of a sine
export function breathe(t, bpm = 60, ph = 0, kind = 'sine', amp = .03) {
  const u = ((t * bpm / 60 + ph) % 1 + 1) % 1;
  if (kind === 'heart') { const e = Math.exp(-Math.pow(u / .16, 2)) + .55 * Math.exp(-Math.pow((u - .26) / .12, 2)); return 1 + amp * (e * 1.6 - .8); }
  return 1 + amp * Math.sin(u * TAU);
}
// camera over a 1920×1080 world: cam = { x, y, z } (focus point, zoom). view() applies it for a layer with parallax p (far < 1 < near)
// on top of the current transform; camMap() gives the same mapping as functions (for screen coordinates of world points).
export function camMap(cam = {}, p = 1) {
  const z = 1 + ((cam.z ?? 1) - 1) * p, cx = W / 2 + ((cam.x ?? W / 2) - W / 2) * p, cy = H / 2 + ((cam.y ?? H / 2) - H / 2) * p;
  const tx = W / 2 - cx * z, ty = H / 2 - cy * z; return { k: z, tx, ty, X: (x) => tx + x * z, Y: (y) => ty + y * z };
}
export function view(ctx, cam, p, fn) { const m = camMap(cam, p); ctx.save(); ctx.transform(m.k, 0, 0, m.k, m.tx, m.ty); fn(ctx, m); ctx.restore(); }
// a mask reveal (text that is written, never faded): draw() inside a rect that opens from the left (dir 1), right (-1) or top (2)
export function reveal(ctx, x, y, w, h, u, draw, dir = 1) {
  u = clamp(u); if (u <= 0) return; ctx.save(); ctx.beginPath();
  if (dir === 1) ctx.rect(x, y, w * u, h); else if (dir === -1) ctx.rect(x + w * (1 - u), y, w * u, h); else ctx.rect(x, y, w, h * u);
  ctx.clip(); draw(ctx); ctx.restore();
}
// an object rises out of the dark as ONE solid picture (no ghost alpha): draw() goes to an offscreen, is darkened with source-atop,
// then put on the frame opaque. u 0 = fully dark (invisible on a night ground), 1 = the object itself. col = the darkness colour.
export function riseFromDark(ctx, u, draw, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const [c, g] = scratch('rise', W, H); draw(g);
  if (u < 1) { g.globalCompositeOperation = 'source-atop'; g.fillStyle = rgba(o.col || F6.glassBot, 1 - eout(u)); g.fillRect(0, 0, W, H); }
  ctx.drawImage(c, 0, 0);
}

// ---------------------------------------------------------------- light sprites (stippled blooms, cached as Images)
function bloomImg(key, R, c0, c1, c2, stops = [0, .18, .5]) {
  return layer('bloom:' + key, R * 2, R * 2, (g, c) => {
    const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, rgba(c0, 1)); rg.addColorStop(stops[1], rgba(c1, .62)); rg.addColorStop(stops[2], rgba(c2, .18)); rg.addColorStop(1, rgba(c2, 0));
    g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .4, g: 1.2, seed: 7 + R });
  });
}
const emberBloom = () => bloomImg('ember', 300, F6.amberCore, F6.amber, F6.amberDeep);
const glowBloom = () => bloomImg('glowbig', 640, F6.amberCore, F6.amber, F6.amberDeep, [0, .14, .45]);
const coolBloom = () => bloomImg('cool', 240, F6.coolCore, F6.cool, '#3a6a99', [0, .12, .4]);
const witnessBloom = () => bloomImg('witness', 160, '#ffffff', F6.witness, '#c9b48a', [0, .1, .35]);
function bloomAt(ctx, img, x, y, r, a, op = 'lighter') { if (a <= .003 || r <= 1) return; ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.drawImage(img, x - r, y - r, r * 2, r * 2); ctx.restore(); }
// a soft stippled cone of light (cached per key), drawn from its apex (x, y) along angle dir (rad, 0 = down)
function coneImg(key, len, spread, col) {
  const w = Math.ceil(len * Math.sin(spread) * 2 + 40), h = Math.ceil(len + 20);
  return layer('cone:' + key, w, h, (g, c) => {
    const ax = w / 2, ay = 10, rg = g.createRadialGradient(ax, ay, 0, ax, ay, len); rg.addColorStop(0, rgba(col, .55)); rg.addColorStop(.3, rgba(col, .2)); rg.addColorStop(1, rgba(col, 0));
    g.fillStyle = rg; g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax - Math.sin(spread) * len * 1.05, ay + Math.cos(spread) * len * 1.05); g.lineTo(ax + Math.sin(spread) * len * 1.05, ay + Math.cos(spread) * len * 1.05); g.closePath(); g.fill();
    const soft = g.createLinearGradient(ax - Math.sin(spread) * len, 0, ax + Math.sin(spread) * len, 0); soft.addColorStop(0, 'rgba(0,0,0,1)'); soft.addColorStop(.4, 'rgba(0,0,0,0)'); soft.addColorStop(.6, 'rgba(0,0,0,0)'); soft.addColorStop(1, 'rgba(0,0,0,1)');
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = soft; g.fillRect(0, 0, w, h); g.globalCompositeOperation = 'source-over'; stipple(c, { k: .45, g: 1.1, seed: 31 });
  });
}

// ================================================================ the EMBER: a warm light with a body, breathing at ~60 bpm
//   ember(ctx, t, { x, y, s 1, kind 'glow'|'lamp'|'candle'|'heart'|'window'|'bulb', a 1, bpm 60, phase, r (glow radius), body true,
//                   dir (lamp: angle of the shade, rad, 0 = down), w, h (window), flicker (candle .06), col, core, deep })
//   → { x, y, br (the breath 0.97..1.03), light: {x, y, col, a} (pass to figure() as o.light), flame: [x, y] (candle), tip: [x, y] (lamp bulb) }
export function ember(ctx, t, o = {}) {
  const x = o.x ?? W / 2, y = o.y ?? H / 2, s = o.s ?? 1, kind = o.kind || 'glow', a = o.a ?? 1, bpm = o.bpm ?? 60, ph = o.phase ?? 0;
  const col = o.col || F6.amber, core = o.core || F6.amberCore, deep = o.deep || F6.amberDeep, B = emberBloom();
  const br = breathe(t, bpm, ph, kind === 'heart' ? 'heart' : 'sine');
  const n = once('embernoise', () => vnoise(17));
  let lx = x, ly = y, out = {};
  if (kind === 'lamp') {
    // a desk lamp: a heavy round base, two arms, a shade that opens down toward dir; the bulb inside is the ember
    const dir = o.dir ?? -.55, S = s;
    ctx.save(); ctx.translate(x, y); ctx.scale(S, S);
    ctx.fillStyle = 'rgba(3,3,10,.5)'; ctx.beginPath(); ctx.ellipse(6, 6, 52, 14, 0, 0, TAU); ctx.fill();
    const bg = ctx.createLinearGradient(-40, -14, 40, 8); bg.addColorStop(0, '#2a2f44'); bg.addColorStop(1, '#0d1020'); ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, 0, 44, 12, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#1b2033'; ctx.beginPath(); ctx.ellipse(0, -6, 30, 8, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#1e2436'; ctx.lineCap = 'round'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(-14, -120); ctx.stroke();
    ctx.strokeStyle = '#252b40'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-14, -120); ctx.lineTo(Math.sin(-dir) * 70 - 14, -120 - Math.cos(dir) * 60); ctx.stroke();
    const ex = Math.sin(-dir) * 70 - 14, ey = -120 - Math.cos(dir) * 60;   // the shade hangs here
    ctx.translate(ex, ey); ctx.rotate(dir);
    // the shade: a truncated cone, dark outside, the inner edge lit by the bulb
    const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, '#0f1222'); sg.addColorStop(.45, '#262b42'); sg.addColorStop(1, '#0b0e1c');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-22, -10); ctx.lineTo(22, -10); ctx.lineTo(64, 46); ctx.quadraticCurveTo(0, 60, -64, 46); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1b2033'; ctx.beginPath(); ctx.ellipse(0, -10, 22, 6, 0, 0, TAU); ctx.fill();
    const ig = ctx.createLinearGradient(0, 46, 0, 60); ig.addColorStop(0, rgba(core, .95 * a)); ig.addColorStop(1, rgba(col, .55 * a));
    ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(0, 50, 62, 11, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(core, a); ctx.beginPath(); ctx.ellipse(0, 46, 18 * br, 7 * br, 0, 0, TAU); ctx.fill();
    ctx.restore();
    // the light: the cone onto the desk and the bloom at the opening
    const ox = x + S * (ex - Math.sin(dir) * 50), oy = y + S * (ey + Math.cos(dir) * 50);   // the shade's opening
    const C = coneImg('lamp', 460, .52, col); ctx.save(); ctx.translate(ox, oy); ctx.rotate(dir); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = (.6 + .3 * (br - .97) / .06) * a * (o.cone ?? 1); ctx.drawImage(C, -C.width / 2 * S, -10 * S, C.width * S, C.height * S); ctx.restore();
    bloomAt(ctx, B, ox, oy, (o.r ?? 230) * S * br, .95 * a);
    lx = ox; ly = oy; out.tip = [ox, oy];
  } else if (kind === 'candle') {
    const S = s, sway = n(t * 1.7, 3) - .5, fl = (o.flicker ?? .06) * (n(t * 6.3, 9) - .5) * 2;
    ctx.save(); ctx.translate(x, y); ctx.scale(S, S);
    ctx.fillStyle = 'rgba(3,3,10,.45)'; ctx.beginPath(); ctx.ellipse(4, 4, 34, 9, 0, 0, TAU); ctx.fill();
    const hg = ctx.createLinearGradient(-26, 0, 26, 0); hg.addColorStop(0, '#4a3a2a'); hg.addColorStop(.5, '#8a6a3c'); hg.addColorStop(1, '#2e241a'); ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(0, 0, 30, 8, 0, 0, TAU); ctx.fill();
    const wg = ctx.createLinearGradient(-14, 0, 14, 0); wg.addColorStop(0, '#b9a98a'); wg.addColorStop(.35, '#f1e6cc'); wg.addColorStop(1, '#8f7f62');
    ctx.fillStyle = wg; ctx.beginPath(); ctx.roundRect(-14, -96, 28, 96, [3, 3, 2, 2]); ctx.fill();
    ctx.fillStyle = '#fbf3df'; ctx.beginPath(); ctx.ellipse(0, -96, 14, 4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e6d9bd'; ctx.beginPath(); ctx.moveTo(9, -94); ctx.quadraticCurveTo(14, -70, 10, -52); ctx.quadraticCurveTo(6, -62, 6, -90); ctx.closePath(); ctx.fill();   // a drip
    ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(0, -97); ctx.lineTo(sway * 2, -108); ctx.stroke();
    // the flame: outer amber teardrop, inner cream core, swaying slowly
    const fh = 46 * br * (1 + fl), fx = sway * 5;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const fg = ctx.createRadialGradient(fx * .5, -112, 0, fx * .5, -112, fh); fg.addColorStop(0, rgba(core, .95)); fg.addColorStop(.35, rgba(col, .8)); fg.addColorStop(1, rgba(deep, 0));
    ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(0, -102); ctx.bezierCurveTo(-13, -112, -12, -130, fx, -102 - fh); ctx.bezierCurveTo(12, -130, 13, -112, 0, -102); ctx.fill();
    ctx.fillStyle = rgba('#ffffff', .85); ctx.beginPath(); ctx.ellipse(fx * .3, -113, 3.5, 9 * br, 0, 0, TAU); ctx.fill();
    ctx.restore(); ctx.restore();
    lx = x + fx * S * .5; ly = y - 118 * S; out.flame = [lx, ly];
    bloomAt(ctx, B, lx, ly, (o.r ?? 210) * S * br * (1 + fl * .5), .9 * a);
  } else if (kind === 'window') {
    const w = o.w ?? 120 * s, h = o.h ?? 150 * s;
    ctx.save(); ctx.translate(x, y);
    const wg = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h) * .8); wg.addColorStop(0, rgba(core, a)); wg.addColorStop(.5, rgba(col, a)); wg.addColorStop(1, rgba(deep, a));
    ctx.fillStyle = wg; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = 'rgba(8,8,18,.85)'; ctx.fillRect(-w / 2, -2, w, 4); ctx.fillRect(-2, -h / 2, 4, h);
    ctx.strokeStyle = 'rgba(6,6,14,.9)'; ctx.lineWidth = Math.max(2, 4 * s); ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.restore();
    bloomAt(ctx, B, x, y, (o.r ?? Math.max(w, h) * 1.3) * br, .6 * a);
  } else if (kind === 'bulb') {
    const S = s; ctx.save(); ctx.translate(x, y); ctx.scale(S, S);
    ctx.fillStyle = '#1b2033'; ctx.fillRect(-7, -40, 14, 14); ctx.fillStyle = '#2a3048'; ctx.fillRect(-9, -44, 18, 6);
    const gg = ctx.createRadialGradient(0, -8, 0, 0, -8, 22); gg.addColorStop(0, rgba(core, .98)); gg.addColorStop(.55, rgba(col, .85)); gg.addColorStop(1, rgba(deep, .5));
    ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(-7, -27); ctx.bezierCurveTo(-26, -20, -22, 14, 0, 14); ctx.bezierCurveTo(22, 14, 26, -20, 7, -27); ctx.closePath(); ctx.fill();
    ctx.restore(); ly = y - 6 * S; bloomAt(ctx, B, x, ly, (o.r ?? 140) * S * br, .85 * a);
  } else if (kind === 'heart') {
    const r = (o.r ?? 110) * s; bloomAt(ctx, B, x, y, r * br, .9 * a);
    const cg = ctx.createRadialGradient(x, y, 0, x, y, r * .22 * br); cg.addColorStop(0, rgba(core, .9 * a)); cg.addColorStop(1, rgba(col, 0));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(x, y, r * .22 * br, 0, TAU); ctx.fill(); ctx.restore();
  } else { // glow / backlight
    const r = (o.r ?? 320) * s; bloomAt(ctx, r > 330 ? glowBloom() : B, x, y, r * br, .85 * a);
    if (o.rays) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); const rr = prng(5); for (let i = 0; i < 9; i++) { const an = rr() * TAU, sp = .05 + rr() * .06, L = r * 1.6; const lg = ctx.createRadialGradient(0, 0, r * .3, 0, 0, L); lg.addColorStop(0, rgba(core, .05 * a * o.rays)); lg.addColorStop(1, rgba(col, 0)); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(an - sp) * L, Math.sin(an - sp) * L); ctx.lineTo(Math.cos(an + sp) * L, Math.sin(an + sp) * L); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  }
  return { x: lx, y: ly, br, light: { x: lx, y: ly, col: core, a: .6 * a }, ...out };
}

// ================================================================ the WITNESS point: steady, white-gold, never moves, never breathes
//   witness(ctx, t, { x, y, r 5, a 1 (0..1 = appearing: the light grows, nothing fades), halo 110, ring true })
export function witness(ctx, t, o = {}) {
  const x = o.x ?? W / 2, y = o.y ?? H * .3, a = eout(clamp(o.a ?? 1)); if (a <= 0) return;
  const r = (o.r ?? 5) * (.4 + .6 * a), halo = (o.halo ?? 110) * a, B = witnessBloom();
  bloomAt(ctx, B, x, y, halo, .85 * a);
  if (o.ring !== false) { ctx.save(); ctx.strokeStyle = rgba(F6.witness, .22 * a); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r * 4.2, 0, TAU); ctx.stroke(); ctx.restore(); }
  const cg = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2); cg.addColorStop(0, '#ffffff'); cg.addColorStop(.45, F6.witness); cg.addColorStop(1, rgba(F6.witness, 0));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, TAU); ctx.fill(); ctx.restore();
}

// ================================================================ glass and the PANE
// the dark glass surface itself in the current transform (x, y top-left): deep blue-black, one faint diagonal reflection sliding slowly,
// a few dust specks. Matches lib/handoff4.mjs glassPlate so a push into a pane lands in the plate.
export function glassRect(ctx, t, x, y, w, h, o = {}) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, o.top || F6.glassTop); g.addColorStop(1, o.bot || F6.glassBot); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const sx = x + w * (.3 + .04 * Math.sin(t * .4)), bw = Math.max(80, w * .27); ctx.translate(sx, y + h / 2); ctx.rotate(.5);
  const s = ctx.createLinearGradient(-bw, 0, bw, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, `rgba(216,247,255,${.06 * (o.sheen ?? 1)})`); s.addColorStop(1, 'rgba(216,247,255,0)');
  ctx.fillStyle = s; ctx.fillRect(-bw, -h * 2, bw * 2, h * 4); ctx.restore();
  const r = prng(o.seed ?? 12), n = Math.round(w * h / 30000); ctx.fillStyle = 'rgba(216,247,255,.09)';
  for (let i = 0; i < n; i++) { const px = x + r() * w, py = y + ((r() * h + t * 8 * (r() + .3)) % h); ctx.fillRect(px, py, 1.5, 1.5); }
}
//   pane(ctx, t, { x, y (centre), w, h, rot 0, yaw 0 (rad: the pane turn, x compressed by cos), radius 4,
//                  reflect: (g) => … (draws the world as seen in the glass; called mirrored, in pane-local coords, origin = centre), reflectA 1,
//                  reflectDim .55 (how dark a reflection stays; a true mirror ≈ .12), through: (g) => … (the view through), throughA 1,
//                  screen: (g, w, h) => … (what glows on it, origin = top-left), screenA 1, spill true (its cool light into the scene),
//                  edge .7 (the cool line on the edge), frame 'none'|'thin'|'laptop'|'window'|'mirror', fog {x, y, r, a} (a breath on the glass),
//                  sheen 1, seed, dark true (draw the glass ground; false = only the frame and callbacks) })
//   → { local(px, py) → screen point of a pane-local point, path() → traces the pane in screen space (for ctx.clip of a plate), x, y, w, h, yaw }
export function pane(ctx, t, o = {}) {
  const x = o.x ?? W / 2, y = o.y ?? H / 2, w = o.w ?? 600, h = o.h ?? 400, rot = o.rot ?? 0, yaw = o.yaw ?? 0, cy = Math.max(.08, Math.cos(yaw));
  const rA = clamp(o.reflectA ?? (o.reflect ? 1 : 0)), tA = clamp(o.throughA ?? (o.through ? 1 : 0)), sA = clamp(o.screenA ?? (o.screen ? 1 : 0)), edge = o.edge ?? .7, rad = o.radius ?? 4;
  const M = (px, py) => { const c = Math.cos(rot), s = Math.sin(rot), qx = px * cy; return [x + qx * c - py * s, y + qx * s + py * c]; };
  const path = () => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(cy, 1); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, rad); ctx.restore(); };
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(cy, 1);
  // thickness: the near edge of the turned pane shows as a thin lit side
  if (Math.abs(yaw) > .02) { const side = Math.sign(yaw), th = Math.min(14, Math.abs(Math.sin(yaw)) * 40) / cy; ctx.fillStyle = '#2a3550'; ctx.fillRect(side > 0 ? w / 2 : -w / 2 - th, -h / 2, th, h); }
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, rad); ctx.clip();
  if (o.dark !== false) glassRect(ctx, t, -w / 2, -h / 2, w, h, { sheen: 0, seed: o.seed });
  if (o.through && tA > 0) { ctx.save(); o.through(ctx); ctx.restore(); if (tA < 1) { ctx.fillStyle = rgba(F6.glassBot, 1 - tA); ctx.fillRect(-w / 2, -h / 2, w, h); } ctx.fillStyle = 'rgba(10,15,36,.14)'; ctx.fillRect(-w / 2, -h / 2, w, h); }
  if (o.reflect && rA > 0) {
    // the world mirrored and darkened: a reflection is light the glass gives back, so its strength is light, not alpha
    const [rc, rg] = scratch('pane-reflect', Math.ceil(w) + 2, Math.ceil(h) + 2); rg.translate(w / 2 + 1, h / 2 + 1); rg.scale(-1, 1); rg.save(); rg.beginPath(); rg.rect(-w / 2, -h / 2, w, h); rg.clip(); o.reflect(rg); rg.restore();
    rg.setTransform(1, 0, 0, 1, 0, 0); rg.globalCompositeOperation = 'source-atop'; rg.fillStyle = rgba(F6.glassBot, 1 - (1 - (o.reflectDim ?? .55)) * rA); rg.fillRect(0, 0, w + 2, h + 2);
    ctx.save(); ctx.globalCompositeOperation = o.through && tA > 0 ? 'lighter' : 'source-over'; if (o.through && tA > 0) ctx.globalAlpha = rA; ctx.drawImage(rc, -w / 2 - 1, -h / 2 - 1); ctx.restore();
  }
  if (o.screen && sA > 0) {
    // the screen's own light: a cool haze that brightens toward the centre, then the content, then the glass vignette
    const hz = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h) * .7); hz.addColorStop(0, rgba('#17264a', .95 * sA)); hz.addColorStop(1, rgba('#0a0f24', .6 * sA)); ctx.fillStyle = hz; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.save(); ctx.translate(-w / 2, -h / 2); ctx.globalAlpha = 1; o.screen(ctx, w, h, sA); ctx.restore();
    if (sA < 1) { ctx.fillStyle = rgba(F6.glassBot, 1 - sA); ctx.fillRect(-w / 2, -h / 2, w, h); }
    const vg = ctx.createRadialGradient(0, 0, Math.min(w, h) * .3, 0, 0, Math.max(w, h) * .75); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, 'rgba(5,6,15,.45)'); ctx.fillStyle = vg; ctx.fillRect(-w / 2, -h / 2, w, h);
  }
  // the glass in front of everything: the sliding sheen, a breath of fog
  { const sx = w * (.3 + .04 * Math.sin(t * .4)) - w / 2, bw = Math.max(80, w * .27); ctx.save(); ctx.translate(sx, 0); ctx.rotate(.5); const s = ctx.createLinearGradient(-bw, 0, bw, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, `rgba(216,247,255,${.06 * (o.sheen ?? 1)})`); s.addColorStop(1, 'rgba(216,247,255,0)'); ctx.fillStyle = s; ctx.fillRect(-bw, -h * 2, bw * 2, h * 4); ctx.restore(); }
  if (o.fog && o.fog.a > 0) { const F = o.fog, fr = F.r ?? 120; const fg = ctx.createRadialGradient(F.x, F.y, 0, F.x, F.y, fr); fg.addColorStop(0, rgba('#9fb0c8', .5 * F.a)); fg.addColorStop(.6, rgba('#9fb0c8', .22 * F.a)); fg.addColorStop(1, rgba('#9fb0c8', 0)); ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(F.x, F.y, fr, fr * .8, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
  // the cool line on the edge (top and lit side brighter), the frame, the spill
  if (edge > 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(cy, 1); ctx.lineWidth = 1.2 / cy; ctx.strokeStyle = rgba(F6.cool, .45 * edge); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, rad); ctx.stroke();
    ctx.strokeStyle = rgba(F6.coolCore, .8 * edge); ctx.lineWidth = 1 / cy; ctx.beginPath(); ctx.moveTo(-w / 2 + rad, -h / 2); ctx.lineTo(w / 2 - rad, -h / 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + rad); ctx.lineTo(-w / 2, h / 2 - rad); ctx.stroke(); ctx.restore(); }
  if (o.frame && o.frame !== 'none') paneFrame(ctx, o.frame, x, y, w, h, rot, cy);
  if (o.spill !== false && sA > 0) addGlow(ctx, x, y, Math.max(w, h) * .95, .16 * sA, F6.cool, F6.coolCore);
  return { local: M, path, x, y, w, h, yaw, rot };
}
function paneFrame(ctx, kind, x, y, w, h, rot, cy) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(cy, 1); ctx.lineJoin = 'round';
  if (kind === 'thin') { ctx.strokeStyle = '#1a1f33'; ctx.lineWidth = 3 / cy; ctx.strokeRect(-w / 2 - 1.5, -h / 2 - 1.5, w + 3, h + 3); }
  else if (kind === 'laptop') { const b = 14; ctx.fillStyle = '#0c0f1c'; ctx.beginPath(); ctx.roundRect(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b, 10); ctx.roundRect(-w / 2, -h / 2, w, h, 3); ctx.fill('evenodd'); ctx.strokeStyle = 'rgba(160,180,220,.25)'; ctx.lineWidth = 1 / cy; ctx.beginPath(); ctx.roundRect(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b, 10); ctx.stroke(); }
  else if (kind === 'window') { const b = 22; const fg = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); fg.addColorStop(0, '#1c1a2a'); fg.addColorStop(1, '#0d0c18'); ctx.fillStyle = fg; ctx.beginPath(); ctx.rect(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b); ctx.rect(-w / 2, -h / 2, w, h); ctx.fill('evenodd');
    ctx.strokeStyle = 'rgba(200,210,240,.14)'; ctx.lineWidth = 1 / cy; ctx.strokeRect(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-w / 2, -h / 2, w, 6); ctx.fillRect(-w / 2, -h / 2, 6, h);
    ctx.fillStyle = '#15131f'; ctx.fillRect(-w / 2 - b, h / 2 + b - 8, w + 2 * b, 16); }
  else if (kind === 'mirror') { const b = 7; ctx.strokeStyle = '#8a7a5a'; ctx.lineWidth = b / cy; ctx.strokeRect(-w / 2 - b / 2, -h / 2 - b / 2, w + b, h + b); ctx.strokeStyle = 'rgba(255,230,190,.35)'; ctx.lineWidth = 1 / cy; ctx.strokeRect(-w / 2 - b + 1, -h / 2 - b + 1, w + 2 * b - 2, h + 2 * b - 2);
    ctx.fillStyle = '#4a4030'; ctx.fillRect(-w * .36, h / 2 + b, w * .72, 10); ctx.fillStyle = '#2a2418'; ctx.beginPath(); ctx.ellipse(0, h / 2 + b + 12, w * .42, 9, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ================================================================ the COOL LINE: one straight engraved filament that travels and writes
//   coolLine(ctx, t, { pts: [[x, y], …] (or from, to), u 1 (how far along, 0..1), w 1.6, a 1, head true (bright tip), glow 1, col, core,
//                      ticks true (engraving texture), write: { text, x, y, size 64, font 'Instrument Serif', align 'left', lead 220,
//                      fill .9, outline 1, lag 60 } })
//   With write: the line runs along the baseline (from x − lead to the end + lead) and the letters are left behind it: the outline first, the
//   fill lagging `lag` px. u drives the tip. → { tip: [x, y], done, textW }
export function coolLine(ctx, t, o = {}) {
  const col = o.col || F6.cool, core = o.core || F6.coolCore, a = o.a ?? 1, u = clamp(o.u ?? 1), lw = o.w ?? 1.6;
  let pts = o.pts || (o.from ? [o.from, o.to] : null), textW = 0, Wr = o.write;
  if (Wr) {
    const size = Wr.size ?? 64, font = Wr.font || 'Instrument Serif'; ctx.save(); ctx.font = `${font.startsWith('Instrument') ? '' : (Wr.weight || 500) + ' '}${size}px "${font}"`; if (Wr.spacing) { try { ctx.letterSpacing = Wr.spacing + 'px'; } catch { } }
    textW = ctx.measureText(Wr.text).width; ctx.restore();
    const x0 = Wr.align === 'center' ? Wr.x - textW / 2 : Wr.align === 'right' ? Wr.x - textW : Wr.x, lead = Wr.lead ?? 220, by = Wr.y + size * .16;
    pts = pts || [[x0 - lead, by], [x0 + textW + lead, by]]; Wr = { ...Wr, x0, size, font, by };
  }
  if (!pts || pts.length < 2) return { tip: null, done: false, textW };
  // arc-length position of the tip
  const d = [0]; for (let i = 1; i < pts.length; i++) d[i] = d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const L = d[d.length - 1], s = L * u; let k = 1; while (k < pts.length - 1 && d[k] < s) k++;
  const q = (s - d[k - 1]) / ((d[k] - d[k - 1]) || 1), tip = [mix(pts[k - 1][0], pts[k][0], q), mix(pts[k - 1][1], pts[k][1], q)];
  const trace = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < k; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineTo(tip[0], tip[1]); };
  if (Wr && u > 0) {
    // the letters the line has passed: outline up to the tip, fill lagging behind
    const { x0, size, font, by, text: str } = Wr, lag = Wr.lag ?? 60, xt = tip[0];
    ctx.save(); ctx.font = `${font.startsWith('Instrument') ? '' : (Wr.weight || 500) + ' '}${size}px "${font}"`; if (Wr.spacing) { try { ctx.letterSpacing = Wr.spacing + 'px'; } catch { } } ctx.textBaseline = 'alphabetic';
    const box = (xe) => { ctx.beginPath(); ctx.rect(x0 - 10, by - size * 1.3, Math.max(0, xe - x0 + 10), size * 1.7); ctx.clip(); };
    ctx.save(); box(xt); ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(col, .9 * a * (Wr.outline ?? 1)); ctx.lineWidth = Math.max(1, size * .018); ctx.strokeText(str, x0, by - size * .16); ctx.restore();
    ctx.save(); box(xt - lag); ctx.fillStyle = rgba(core, (Wr.fill ?? .9) * a); ctx.fillText(str, x0, by - size * .16); ctx.restore();
    // the fill front: a soft light where the letters are filling in
    if (xt - lag > x0 && xt - lag < x0 + textW + 4) { ctx.save(); box(xt); ctx.globalCompositeOperation = 'lighter'; const fg = ctx.createLinearGradient(xt - lag - 30, 0, xt - lag + 24, 0); fg.addColorStop(0, rgba(col, 0)); fg.addColorStop(.6, rgba(col, .1 * a)); fg.addColorStop(1, rgba(col, 0)); ctx.fillStyle = fg; ctx.fillRect(xt - lag - 30, by - size * .9, 54, size * 1.1); ctx.restore(); }
    ctx.restore();
  }
  if (u > 0) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'lighter';
    const gl = o.glow ?? 1; if (gl > 0) { for (const [w2, al] of [[lw * 16, .05], [lw * 6, .14]]) { ctx.strokeStyle = rgba(col, al * a * gl); ctx.lineWidth = w2; trace(); ctx.stroke(); } }
    ctx.strokeStyle = rgba(col, .6 * a); ctx.lineWidth = lw * 2; trace(); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba(core, .95 * a); ctx.lineWidth = lw * .9; trace(); ctx.stroke();
    if (o.ticks !== false && L > 40) { ctx.strokeStyle = rgba(core, .3 * a); ctx.lineWidth = .8; ctx.beginPath(); for (let sx = 0; sx < s; sx += 9) { let j = 1; while (j < pts.length - 1 && d[j] < sx) j++; const qq = (sx - d[j - 1]) / ((d[j] - d[j - 1]) || 1), px = mix(pts[j - 1][0], pts[j][0], qq), py = mix(pts[j - 1][1], pts[j][1], qq), nx = -(pts[j][1] - pts[j - 1][1]), ny = pts[j][0] - pts[j - 1][0], nl = Math.hypot(nx, ny) || 1, hh = 1.6 + 1.2 * Math.sin(sx * .07 + t); ctx.moveTo(px - nx / nl * hh, py - ny / nl * hh); ctx.lineTo(px + nx / nl * hh + 2, py + ny / nl * hh); } ctx.stroke(); }
    ctx.restore();
    if (o.head !== false && u < 1) { bloomAt(ctx, coolBloom(), tip[0], tip[1], 26 * lw, .9 * a); ctx.save(); ctx.fillStyle = rgba('#ffffff', .95 * a); ctx.beginPath(); ctx.arc(tip[0], tip[1], lw * 1.1, 0, TAU); ctx.fill(); ctx.restore(); }
  }
  return { tip, done: u >= 1, textW, len: L };
}

// ================================================================ COOL TEXT: the machine's answer writing itself on a pane
// Unreadable glyph runs (silver-blue, engraved) that build line by line like light on water; or readable words (the two quoted answers).
//   coolText(ctx, t, { x, y (top-left of the block), w 520, size 15 (glyph height), lines 5, t0 0 (writing starts), cps 38 (glyphs/s),
//                      gap .25 (s between lines), seed 1, a 1, col, core, cursor true, ripple true, harsh 0 (jagged cold text, 1.07),
//                      glint 0 (foil sparkles = praise), accent: [{ i, at, d .3 }] (line i brightens at time at), lengths: [0..1 per line],
//                      script 'latin'|'deva'|'cjk'|'arab'|'mix' (the brilliant mirror), align 'left',
//                      words: [{ w, s, e }] (readable, lit with the voice: T.W(…)), text: 'readable, static', font, fontSize })
//   → { u (0..1 written), done, cursor: [x, y], bottom (y under the last line), lineY: [baselines] }
export function coolText(ctx, t, o = {}) {
  const x = o.x ?? 0, y = o.y ?? 0, w = o.w ?? 520, size = o.size ?? 15, a = o.a ?? 1, col = o.col || (o.harsh ? F6.coolCold : F6.cool), core = o.core || F6.coolCore, t0 = o.t0 ?? 0, seed = o.seed ?? 1;
  if (o.words || o.text) return readableText(ctx, t, { ...o, x, y, w, a, col, core, t0 });
  const n = o.lines ?? 5, cps = o.cps ?? 38, gap = o.gap ?? .25, lh = o.lineH ?? size * 1.9, r = prng(seed * 31 + 7), harsh = clamp(o.harsh ?? 0), script = o.script || 'latin';
  // the plan of the block (deterministic): per line a list of words [glyph count], ragged lengths
  const plan = once(`ct:${seed}:${n}:${w}:${size}:${script}:${(o.lengths || []).join(',')}`, () => {
    const rr = prng(seed * 31 + 7), lines = [];
    for (let i = 0; i < n; i++) {
      const frac = o.lengths ? o.lengths[i] : (i === n - 1 ? .35 + rr() * .4 : .82 + rr() * .18), words = []; let cw = 0;
      while (true) { const gl = 2 + Math.floor(rr() * 7), ww = gl * size * .58 + size * .5; if (cw + ww > w * frac && words.length) break; words.push({ n: gl, gl: Array.from({ length: gl }, () => rr()), sc: script === 'mix' ? ['latin', 'deva', 'cjk', 'arab'][Math.floor(rr() * 4)] : script }); cw += ww; }
      lines.push({ words, chars: words.reduce((s, q) => s + q.n, 0) });
    }
    return lines;
  });
  const lineY = [], GW = size * .58; let el = t - t0, u = 0, cursor = null, done = true;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 0; i < n; i++) {
    const P = plan[i], by = y + size + i * lh, dur = P.chars / cps; lineY.push(by);
    const shown = el <= 0 ? 0 : Math.min(P.chars, el * cps), frac = shown / P.chars; u += frac / n; if (frac < 1) done = false;
    // light on water: a soft band under the line while it is being written and just after
    if (o.ripple !== false && shown > 0 && el < dur + .9) { const k = el < dur ? 1 : 1 - (el - dur) / .9, spread = 6 + 18 * (1 - k); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const rg = ctx.createLinearGradient(0, by - spread, 0, by + spread); rg.addColorStop(0, rgba(col, 0)); rg.addColorStop(.5, rgba(col, .14 * k * a)); rg.addColorStop(1, rgba(col, 0)); ctx.fillStyle = rg; ctx.fillRect(x - 6, by - spread, w * .98 * clamp(frac + .08), spread * 2); ctx.restore(); }
    // accent: the line brightens on its word
    let acc = 0; for (const A of o.accent || []) if (A.i === i) { const dd = A.d ?? .3; acc = Math.max(acc, sm(lin(A.at - .06, A.at + .05, t)) * (1 - sm(lin(A.at + dd, A.at + dd + .35, t)))); }
    let gx = x, c = 0;
    for (const wd of P.words) {
      if (c >= shown) break;
      const show = Math.min(wd.n, shown - c), style = wd.sc;
      if (style === 'deva') { ctx.strokeStyle = rgba(col, .8 * a); ctx.lineWidth = size * .09; ctx.beginPath(); ctx.moveTo(gx, by - size * .72); ctx.lineTo(gx + GW * show, by - size * .72); ctx.stroke(); }
      if (style === 'arab') { ctx.strokeStyle = rgba(col, .8 * a); ctx.lineWidth = size * .1; ctx.beginPath(); for (let j = 0; j < show; j++) { const px = gx + GW * j; ctx.lineTo(px, by - size * .12 - size * .22 * Math.abs(Math.sin(j * 1.7 + wd.gl[j] * 3))); ctx.lineTo(px + GW * .5, by - size * .02); } ctx.stroke(); }
      for (let j = 0; j < show; j++) {
        const g0 = wd.gl[j], px = gx + GW * j, recent = clamp((shown - (c + j)) / 6), bright = Math.max(1 - recent, acc), cc = bright > 0 ? mixHex(col, core, bright) : col, al = (.72 + .28 * bright) * a;
        ctx.strokeStyle = rgba(cc, al); ctx.lineWidth = size * (harsh ? .11 : .085);
        glyph(ctx, px, by, size, g0, style, harsh, GW);
      }
      c += wd.n; gx += GW * wd.n + size * .5;
      if (c >= shown) { cursor = [gx - size * .5 + (shown < P.chars ? 0 : 0), by]; }
    }
    if (shown <= 0 && i === 0) cursor = [x, by];
    el -= dur + gap;
  }
  ctx.restore();
  if (o.glint > 0 && u > 0) { // praise: foil sparkles on the written lines
    const rr = prng(seed * 7 + Math.floor(t * 3)); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4 * o.glint; i++) { const li = Math.floor(rr() * n * u), px = x + rr() * w * .8, py = lineY[Math.min(li, n - 1)] - size * .4, ph = (t * 3 + rr()) % 1, k = Math.sin(ph * Math.PI); ctx.fillStyle = rgba(F6.praise, .9 * k); ctx.beginPath(); for (let q = 0; q < 4; q++) { const an = q * Math.PI / 2, rr2 = 5 + 4 * k; ctx.lineTo(px + Math.cos(an) * rr2, py + Math.sin(an) * rr2); ctx.lineTo(px + Math.cos(an + Math.PI / 4) * 1.2, py + Math.sin(an + Math.PI / 4) * 1.2); } ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  if (o.cursor !== false && cursor && (!done || Math.sin(t * TAU) > 0)) { ctx.save(); ctx.fillStyle = rgba(core, .95 * a); ctx.fillRect(cursor[0] + 2, cursor[1] - size * .95, Math.max(1.5, size * .12), size * 1.1); ctx.restore(); }
  return { u: clamp(u), done, cursor, bottom: y + n * lh, lineY };
}
function glyph(ctx, px, by, size, g0, style, harsh, GW) {
  const h = size * (.55 + .45 * g0), k = Math.floor(g0 * 1000) % 5;
  ctx.beginPath();
  if (style === 'cjk') { const s2 = size * .78, yy = by - s2; ctx.rect(px, yy, GW * .8, s2); ctx.moveTo(px, yy + s2 * (.3 + .4 * g0)); ctx.lineTo(px + GW * .8, yy + s2 * (.3 + .4 * g0)); if (k > 2) { ctx.moveTo(px + GW * .4, yy); ctx.lineTo(px + GW * .4, yy + s2); } ctx.stroke(); return; }
  if (style === 'deva') { ctx.moveTo(px + GW * .35, by - size * .72); ctx.lineTo(px + GW * .35, by - size * .1); if (k < 2) { ctx.moveTo(px + GW * .35, by - size * .45); ctx.quadraticCurveTo(px + GW * .8, by - size * .5, px + GW * .7, by - size * .15); } else if (k === 2) { ctx.moveTo(px, by - size * .4); ctx.lineTo(px + GW * .35, by - size * .4); } ctx.stroke(); return; }
  if (style === 'arab') { if (k === 0) { ctx.moveTo(px + GW * .3, by - size * .55); ctx.arc(px + GW * .3, by - size * .55, size * .06, 0, TAU); } else if (k === 1) { ctx.moveTo(px + GW * .2, by + size * .1); ctx.arc(px + GW * .2, by + size * .16, size * .06, 0, TAU); } ctx.stroke(); return; }
  if (harsh) { const j = harsh * size * .18; ctx.moveTo(px, by); ctx.lineTo(px + GW * .3 + j * (k - 2) * .3, by - h * .55); ctx.lineTo(px + GW * .6, by - h); if (k > 2) ctx.lineTo(px + GW * .75, by - h * .3); ctx.stroke(); return; }
  if (k === 0) { ctx.moveTo(px + GW * .25, by); ctx.lineTo(px + GW * .25, by - h); }                                    // a stem
  else if (k === 1) { ctx.moveTo(px + GW * .2, by); ctx.lineTo(px + GW * .2, by - h * .62); ctx.moveTo(px + GW * .2, by - h * .42); ctx.quadraticCurveTo(px + GW * .75, by - h * .75, px + GW * .7, by - h * .2); }   // a bowl
  else if (k === 2) { ctx.moveTo(px + GW * .1, by - h * .32); ctx.lineTo(px + GW * .7, by - h * .32); ctx.moveTo(px + GW * .4, by); ctx.lineTo(px + GW * .4, by - h * .62); }   // a bar
  else if (k === 3) { ctx.moveTo(px + GW * .15, by); ctx.quadraticCurveTo(px + GW * .55, by - h * .9, px + GW * .7, by - h * .1); }   // an arch
  else { ctx.moveTo(px + GW * .3, by - h * .5); ctx.arc(px + GW * .35, by - h * .3, h * .22, 0, TAU); }                 // a round
  ctx.stroke();
}
// readable words on a pane (Instrument Serif), lit with the voice; the only running text of the film (10.10, 12.10, the title)
function readableText(ctx, t, o) {
  const words = o.words || o.text.split(/\s+/).map((w, i) => ({ w, s: o.t0 + i * (o.per ?? .22), e: o.t0 + i * (o.per ?? .22) + .2 }));
  const size = o.fontSize ?? o.size ?? 34, font = o.font || 'Instrument Serif', lh = size * 1.3, x = o.x, y = o.y, w = o.w;
  ctx.save(); ctx.font = `${size}px "${font}"`; const sp = ctx.measureText(' ').width, lines = [[]]; let lx = 0;
  for (const wd of words) { const ww = ctx.measureText(wd.w).width; if (lx > 0 && lx + ww > w) { lines.push([]); lx = 0; } lines[lines.length - 1].push({ ...wd, x: lx, ww }); lx += ww + sp; }
  ctx.textBaseline = 'alphabetic'; let u = 0, cursor = [x, y + size]; const lineY = [];
  lines.forEach((L, li) => {
    const by = y + size + li * lh; lineY.push(by); const first = L[0], lit0 = sm(lin(first.s - .05, first.s + .25, t));
    if (o.ripple !== false && lit0 > 0 && t < first.s + 1.1) { const k = 1 - clamp((t - first.s) / 1.1), spread = 8 + 20 * (1 - k); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const rg = ctx.createLinearGradient(0, by - spread, 0, by + spread); rg.addColorStop(0, rgba(o.col, 0)); rg.addColorStop(.5, rgba(o.col, .16 * k * o.a)); rg.addColorStop(1, rgba(o.col, 0)); ctx.fillStyle = rg; ctx.fillRect(x - 6, by - spread, w, spread * 2); ctx.restore(); }
    for (const wd of L) {
      const lit = sm(lin(wd.s - .05, wd.s + .25, t)); u += lit / words.length; if (lit <= 0) continue;
      const fresh = 1 - clamp((t - wd.s - .2) / .6);
      ctx.save(); ctx.beginPath(); ctx.rect(x + wd.x - 2, by - size * 1.1, (wd.ww + 4) * lit, size * 1.45); ctx.clip();
      ctx.fillStyle = rgba(mixHex(o.col, o.core, .35 + .65 * fresh), o.a); ctx.fillText(wd.w, x + wd.x, by); ctx.restore();
      if (lit >= 1) cursor = [x + wd.x + wd.ww, by];
    }
  });
  ctx.restore();
  const done = u >= .999;
  if (o.cursor !== false && (!done || Math.sin(t * TAU) > 0)) { ctx.save(); ctx.fillStyle = rgba(o.core, .9 * o.a); ctx.fillRect(cursor[0] + 4, cursor[1] - size * .8, 2, size * .95); ctx.restore(); }
  return { u: clamp(u), done, cursor, bottom: y + lines.length * lh, lineY };
}

// ================================================================ the SPLIT: from the cool line a warm ember separates and rises (3.01, 14.09)
//   splitLight(ctx, t, { x, y (the line's centre), len 1100, u 0..1 (the separation), rise 170, labels true, labelA (0..1, default follows u),
//                        emberR 120, lineA 1, bpm 60, seed })
//   → { ember: [x, y], line: { x0, x1, y } }
export function splitLight(ctx, t, o = {}) {
  const x = o.x ?? W / 2, y = o.y ?? H * .55, len = o.len ?? 1100, u = clamp(o.u ?? 1), e = eout(u), rise = o.rise ?? 170, ey = y - rise * e;
  // where the ember tears itself off, the line's light dips for a moment (cause), then the ember has its own light (effect)
  const dip = Math.sin(Math.PI * clamp(u * 1.6)) * .5;
  ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
  for (const [w2, al] of [[26, .05], [10, .14], [3.2, .55], [1.4, .95]]) { const gg = ctx.createLinearGradient(x - len / 2, 0, x + len / 2, 0); gg.addColorStop(0, rgba(w2 < 2 ? F6.coolCore : F6.cool, al * (o.lineA ?? 1) * .2)); gg.addColorStop(.5, rgba(w2 < 2 ? F6.coolCore : F6.cool, al * (o.lineA ?? 1) * (1 - dip))); gg.addColorStop(1, rgba(w2 < 2 ? F6.coolCore : F6.cool, al * (o.lineA ?? 1) * .2)); ctx.strokeStyle = gg; ctx.lineWidth = w2; ctx.beginPath(); ctx.moveTo(x - len / 2, y + 1.5 * Math.sin(t * .9)); ctx.lineTo(x + len / 2, y + 1.5 * Math.sin(t * .9)); ctx.stroke(); }
  ctx.strokeStyle = rgba(F6.coolCore, .35); ctx.lineWidth = 1; ctx.beginPath(); for (let px = -len / 2; px < len / 2; px += 9) { const h = 2 + 1.5 * Math.sin(px * .07 + t); ctx.moveTo(x + px, y - h); ctx.lineTo(x + px + 3, y + h); } ctx.stroke();
  ctx.restore();
  if (u > 0) {
    // a thread of warmth still connects line and ember while it separates, then lets go
    if (u < .85) { const k = 1 - clamp((u - .55) / .3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const tg = ctx.createLinearGradient(0, y, 0, ey); tg.addColorStop(0, rgba(F6.cool, .5 * k)); tg.addColorStop(.5, rgba(F6.amber, .6 * k)); tg.addColorStop(1, rgba(F6.amber, .2 * k)); ctx.strokeStyle = tg; ctx.lineWidth = 2.2 * k + .4; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 12 * Math.sin(t * 2.3), (y + ey) / 2, x, ey + 18); ctx.stroke(); ctx.restore(); }
    ember(ctx, t, { x, y: ey, kind: 'heart', r: (o.emberR ?? 120) * (.35 + .65 * e), a: .55 + .45 * e, bpm: o.bpm ?? 60 });
    // the ember has a body of warmth: a small flame-like core drawn above the glow so it never reads as a flat disc
    const n = once('splitnoise', () => vnoise(23)), sw = (n(t * 1.6, 1) - .5) * 10 * e, br = breathe(t, o.bpm ?? 60, 0, 'heart');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, ey); const fh = (o.emberR ?? 120) * .45 * e * br;
    const fg = ctx.createRadialGradient(0, fh * .1, 0, 0, 0, fh * 1.1); fg.addColorStop(0, rgba('#ffffff', .95)); fg.addColorStop(.25, rgba(F6.amberCore, .9)); fg.addColorStop(.6, rgba(F6.amber, .5)); fg.addColorStop(1, rgba(F6.amberDeep, 0));
    ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(0, fh * .55); ctx.bezierCurveTo(-fh * .6, fh * .2, -fh * .45, -fh * .5, sw * .3, -fh); ctx.bezierCurveTo(fh * .45, -fh * .5, fh * .6, fh * .2, 0, fh * .55); ctx.fill(); ctx.restore();
  }
  if (o.labels !== false) {
    const la = o.labelA ?? sm(lin(.7, 1, u)); if (la > 0) {
      const lab = (s, lx, ly, c) => reveal(ctx, lx - 160, ly - 24, 320, 34, la, (g) => text(g, s, lx, ly, { size: 17, weight: 600, color: c, align: 'center', spacing: 7 }));
      lab('INTELLIGENCE', x, y + 48, rgba(F6.cool, .9)); lab('CONSCIOUSNESS', x, ey - 70 - (o.emberR ?? 120) * .18, rgba(F6.amberCore, .92));
    }
  }
  return { ember: [x, ey], line: { x0: x - len / 2, x1: x + len / 2, y } };
}

// ================================================================ CLOUDS: thoughts, half-transparent, drifting (§2, the mirror)
//   clouds(ctx, t, { x, y, w, h (the region), n 5, seed 1, speed 16 (px/s, drift to the right), a .55, col '#dfe7f2', s 1 (size), bob 8,
//                    carry: (g, i, cx, cy, k) => … (draw an object riding cloud i: a list, a knot, notes) })
//   → [{ x, y, r, k }] (centre, radius, depth 0..1; bigger = nearer = faster)
function cloudImg(v) {
  const R = 150; return layer('cloud' + v, R * 2, R * 2, (g, c) => {
    const r = prng(100 + v), puff = (px, py, pr, a) => { const rg = g.createRadialGradient(px, py - pr * .1, 0, px, py, pr); rg.addColorStop(0, `rgba(255,255,255,${a})`); rg.addColorStop(.62, `rgba(255,255,255,${a * .85})`); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.beginPath(); g.arc(px, py, pr, 0, TAU); g.fill(); };
    // a cloud: a flat-ish base row of big puffs, a crown of smaller ones on top, a soft body between
    const base = R * 1.12, n = 4 + Math.floor(r() * 2);
    for (let i = 0; i < n; i++) { const px = R + (i / (n - 1) - .5) * R * 1.3, pr = R * (.3 + r() * .14); puff(px, base - pr * .55, pr, .92); }
    const m = 3 + Math.floor(r() * 3);
    for (let i = 0; i < m; i++) { const px = R + (r() - .5) * R * 1.0, pr = R * (.2 + r() * .18); puff(px, base - R * .45 - r() * R * .3, pr, .9); }
    puff(R, base - R * .25, R * .55, .8);
    // the base is flat: cut everything below the base line softly
    const fl = g.createLinearGradient(0, base - 6, 0, base + 10); fl.addColorStop(0, 'rgba(0,0,0,0)'); fl.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = fl; g.fillRect(0, base - 6, R * 2, R); g.globalCompositeOperation = 'source-over';
    stipple(c, { k: .45, g: 1.4, seed: 9 + v, boost: 2 });
  });
}
export function clouds(ctx, t, o = {}) {
  const x = o.x ?? 0, y = o.y ?? 0, w = o.w ?? W, h = o.h ?? 400, n = o.n ?? 5, seed = o.seed ?? 1, speed = o.speed ?? 16, a = o.a ?? .55, col = o.col || '#dfe7f2', S = o.s ?? 1;
  const P = once(`clouds:${seed}:${n}`, () => { const r = prng(seed * 13 + 1); return Array.from({ length: n }, (_, i) => ({ x0: r(), y0: r(), k: r(), v: Math.floor(r() * 3), ph: r() * TAU })); });
  const out = []; ctx.save();
  for (let i = 0; i < n; i++) {
    const c = P[i], k = c.k, r = (90 + 110 * k) * S, cx = x + ((c.x0 * (w + 2 * r) + t * speed * (.5 + k)) % (w + 2 * r)) - r, cy = y + c.y0 * h + Math.sin(t * .35 + c.ph) * (o.bob ?? 8);
    const img = cloudImg(c.v), [cr, cg, cb] = hex2(col);
    const [sc, sg] = scratch('cloud', 300, 300); sg.drawImage(img, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = `rgb(${cr},${cg},${cb})`; sg.fillRect(0, 0, 300, 300);
    ctx.globalAlpha = a * (.6 + .4 * k); ctx.drawImage(sc, cx - r, cy - r * .7, r * 2, r * 1.4); ctx.globalAlpha = 1;
    if (o.carry) o.carry(ctx, i, cx, cy, k);
    out.push({ x: cx, y: cy, r, k });
  }
  ctx.restore(); return out;
}

// ================================================================ the NIGHT ROOM of the hook (shared by c01, c02 and c14)
// A desk with a laptop (its screen is a pane with the cool answer), the desk lamp (the ember), you from behind in the chair, typing; to the
// right a tall window: dark glass that reflects the lamp, you and, across the desk, the empty chair. Camera: o.cam = { x, y, z } over a 1920×1080
// world (default the whole room); layers carry parallax (wall .85 · desk 1 · you 1.08 · motes 1.25).
//   nightRoom(ctx, t, { cam, screen: 'answer'|'dark'|(g, w, h) => …, answer: { t0, lines, … } (coolText options), typing true, lampA 1,
//                       window: { reflectA 1, throughA 0, through: (g) => …, fog {x, y, r, a}, title: { lines: [..], u } (writes in the glass) },
//                       chairTaken false (14.08: in the reflection the chair opposite is taken, you face us), witnessA 0 (above that head),
//                       figure true, seed 3 })
//   → { window: {x, y, w, h, path}, screen: {x, y, w, h}, lamp: [x, y], chair: [x, y], head: [x, y] } (screen coords)
export const ROOM = { wallTop: '#0e1430', window: { x: 1565, y: 400, w: 400, h: 620 }, desk: { x0: 300, x1: 1310, yFar: 622, yNear: 790 }, lamp: [1165, 626], screen: { x: 905, y: 465, w: 330, h: 212 }, figure: [660, 868], chair: [455, 600] };
export function nightRoom(ctx, t, o = {}) {
  const cam = o.cam || {}, R = ROOM, seed = o.seed ?? 3, lampA = o.lampA ?? 1, Wn = o.window || {};
  const br = breathe(t, 60, 0);
  const out = {};
  // ---- wall + window (far)
  view(ctx, cam, .85, (g, m) => {
    g.drawImage(roomWall(), 0, 0);
    // the lamp's warm light on the wall, breathing with it
    g.save(); g.globalCompositeOperation = 'lighter'; const wg = g.createRadialGradient(R.lamp[0] - 60, R.lamp[1] - 150, 0, R.lamp[0] - 60, R.lamp[1] - 150, 700 * br); wg.addColorStop(0, rgba(F6.amber, .2 * lampA)); wg.addColorStop(.5, rgba(F6.amberDeep, .07 * lampA)); wg.addColorStop(1, rgba(F6.amberDeep, 0)); g.fillStyle = wg; g.fillRect(0, 0, W, H); g.restore();
    const P = pane(g, t, { x: R.window.x, y: R.window.y, w: R.window.w, h: R.window.h, frame: 'window', edge: .35, radius: 0, reflectA: Wn.reflectA ?? 1, reflectDim: .5, through: Wn.through, throughA: Wn.throughA ?? 0, fog: Wn.fog,
      reflect: (q) => roomReflection(q, t, { lampA, chairTaken: o.chairTaken, witnessA: o.witnessA ?? 0, seed, screenOn: o.screen !== 'dark' }) });
    if (Wn.title && Wn.title.u > 0) { // the title writes itself in the glass as light (1.11), inside the pane's dark
      const L = Wn.title.lines || ["AI Isn't Conscious.", "That's the Problem."], u = Wn.title.u;
      g.save(); P.path(); g.clip(); L.forEach((s, i) => coolLine(g, t, { write: { text: s, x: R.window.x, y: R.window.y - 40 + i * 78, size: 58, align: 'center', lead: 140, lag: 50 }, u: clamp(u * (L.length + .3) - i), glow: .6, w: 1.2 })); g.restore();
    }
    out.window = { x: m.X(R.window.x - R.window.w / 2), y: m.Y(R.window.y - R.window.h / 2), w: R.window.w * m.k, h: R.window.h * m.k };
  });
  // ---- desk, far chair, laptop, lamp (main plane)
  view(ctx, cam, 1, (g, m) => {
    chairFront(g, t, R.chair[0], R.chair[1], 1.9, lampA);
    g.drawImage(deskTop(), DESK_BOX[0], DESK_BOX[1]);
    // the lamp's pool on the desk and the screen's cool spill
    g.save(); g.globalCompositeOperation = 'lighter'; g.translate(R.lamp[0] - 120, R.desk.yNear - 70); g.scale(1, .36); const pg = g.createRadialGradient(0, 0, 0, 0, 0, 520 * br); pg.addColorStop(0, rgba(F6.amber, .4 * lampA)); pg.addColorStop(.5, rgba(F6.amber, .12 * lampA)); pg.addColorStop(1, rgba(F6.amber, 0)); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, 520, 0, TAU); g.fill(); g.restore();
    // papers on the desk (cream, lamp-lit)
    g.save(); g.translate(1060, 740); g.rotate(-.12); g.fillStyle = '#d9cfb4'; g.fillRect(-70, -48, 140, 96); g.fillStyle = 'rgba(40,30,20,.25)'; for (let i = 0; i < 6; i++) g.fillRect(-52, -30 + i * 12, 100 - (i % 3) * 20, 2); g.restore();
    g.save(); g.translate(1010, 756); g.rotate(.06); g.fillStyle = '#cfc4a9'; g.fillRect(-64, -42, 128, 84); g.restore();
    // the laptop: base in perspective, then its screen (the pane)
    const S = R.screen; g.fillStyle = '#0f1322'; g.beginPath(); g.moveTo(S.x - S.w / 2 - 28, S.y + S.h / 2 + 10); g.lineTo(S.x + S.w / 2 + 28, S.y + S.h / 2 + 10); g.lineTo(S.x + S.w / 2 + 60, S.y + S.h / 2 + 62); g.lineTo(S.x - S.w / 2 - 60, S.y + S.h / 2 + 62); g.closePath(); g.fill();
    g.fillStyle = '#171c30'; g.beginPath(); g.moveTo(S.x - S.w / 2 - 20, S.y + S.h / 2 + 18); g.lineTo(S.x + S.w / 2 + 20, S.y + S.h / 2 + 18); g.lineTo(S.x + S.w / 2 + 48, S.y + S.h / 2 + 54); g.lineTo(S.x - S.w / 2 - 48, S.y + S.h / 2 + 54); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(160,190,230,.1)'; g.lineWidth = 1; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(S.x - S.w / 2 - 10 - i * 6, S.y + S.h / 2 + 24 + i * 8); g.lineTo(S.x + S.w / 2 + 10 + i * 6, S.y + S.h / 2 + 24 + i * 8); g.stroke(); }
    const scr = o.screen === 'dark' ? null : typeof o.screen === 'function' ? o.screen : (q, w, h) => coolText(q, t, { x: 26, y: 22, w: w - 52, size: 11, lines: 7, t0: 0, cps: 44, gap: .2, seed: 5, ...(o.answer || {}) });
    pane(g, t, { x: S.x, y: S.y, w: S.w, h: S.h, yaw: -.1, rot: -.01, frame: 'laptop', edge: .9, screen: scr, screenA: scr ? (o.screenA ?? 1) : 0 });
    out.screen = { x: m.X(S.x - S.w / 2), y: m.Y(S.y - S.h / 2), w: S.w * m.k, h: S.h * m.k };
    const E = ember(g, t, { x: R.lamp[0], y: R.lamp[1], kind: 'lamp', s: 1.05, dir: .42, a: lampA, cone: .8 });
    out.lamp = [m.X(E.x), m.Y(E.y)];
    out.chair = [m.X(R.chair[0]), m.Y(R.chair[1])];
  });
  // ---- you, from behind, in the chair (near)
  if (o.figure !== false) view(ctx, cam, 1.08, (g, m) => {
    const F = figureDesk(g, t, R.figure[0], R.figure[1], 2.45, { seed, typing: o.typing !== false, lamp: { x: R.lamp[0] - 40, y: R.lamp[1] - 200 }, screen: { x: R.screen.x, y: R.screen.y }, lampA, screenA: o.screen === 'dark' ? 0 : 1 });
    out.head = [m.X(F.head[0]), m.Y(F.head[1])];
  });
  // ---- motes in the lamp light, a dark foreground edge
  view(ctx, cam, 1.25, (g) => {
    const r = prng(seed * 7); g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 60; i++) { const x0 = 760 + r() * 620, y0 = 330 + r() * 420, sp = .3 + r(), x = x0 + Math.sin(t * .5 * sp + i) * 14, y = y0 + Math.cos(t * .33 * sp + i * 1.7) * 10 - (t * 4 * sp) % 60; const d = Math.hypot(x - R.lamp[0] + 80, y - R.lamp[1] + 180) / 520, al = (1 - clamp(d)) * (.15 + .4 * r()) * lampA; if (al <= .01) continue; g.fillStyle = rgba('#ffd9a8', al); g.fillRect(x, y, 1.4, 1.4); }
    g.restore();
    const fg = g.createLinearGradient(0, H - 140, 0, H); fg.addColorStop(0, 'rgba(4,5,14,0)'); fg.addColorStop(1, 'rgba(4,5,14,.75)'); g.fillStyle = fg; g.fillRect(0, H - 140, W, 140);
  });
  return out;
}
function roomWall() {
  return layer('room-wall', W, H, (g, c) => {
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#080c1e'); bg.addColorStop(.55, F6.night); bg.addColorStop(1, '#070a18'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // the wall's plaster: fine fibre and a faint engraved hatch in the dark corners
    g.beginPath(); g.rect(0, 0, W, H); fibreFill(g, .05);
    hatch(g, null, -.85, 7, .035, { box: [0, 0, W, H], col: '#000000', w: .8, wobble: .6 });
    // a skirting line and the floor
    g.fillStyle = '#05060f'; g.fillRect(0, 870, W, H - 870); g.fillStyle = 'rgba(120,130,170,.1)'; g.fillRect(0, 868, W, 2);
    stipple(c, { k: .2, g: 1, seed: 2, mid: false, boost: 1 });
  });
}
const DESK_BOX = [200, 600, 1200, 330];   // the desk layer is cropped to the desk (a smaller drawImage each frame)
function deskTop() {
  return layer('room-desk', DESK_BOX[2], DESK_BOX[3], (g, c) => {
    g.translate(-DESK_BOX[0], -DESK_BOX[1]);
    const D = ROOM.desk, n = vnoise(5), r = prng(8);
    g.save(); g.beginPath(); g.moveTo(D.x0 + 60, D.yFar); g.lineTo(D.x1 - 40, D.yFar); g.lineTo(D.x1 + 40, D.yNear); g.lineTo(D.x0 - 60, D.yNear); g.closePath(); g.clip();
    const tg = g.createLinearGradient(0, D.yFar, 0, D.yNear); tg.addColorStop(0, '#2a2030'); tg.addColorStop(1, '#1a1420'); g.fillStyle = tg; g.fillRect(0, D.yFar, W, D.yNear - D.yFar);
    g.lineCap = 'round'; for (let k = 0; k < 160; k++) { const yy = D.yFar + r() * (D.yNear - D.yFar), light = r() < .4; g.strokeStyle = light ? `rgba(150,110,90,${.05 + r() * .1})` : `rgba(10,6,10,${.12 + r() * .2})`; g.lineWidth = .6 + r() * 1.4; g.beginPath(); for (let x = D.x0 - 80; x <= D.x1 + 60; x += 30) { const yv = yy + (n(x * .004, yy * .02) - .5) * 14; x === D.x0 - 80 ? g.moveTo(x, yv) : g.lineTo(x, yv); } g.stroke(); }
    g.restore();
    // the front edge of the desk (its thickness) and the legs' shadow
    g.fillStyle = '#120d16'; g.beginPath(); g.moveTo(D.x0 - 60, D.yNear); g.lineTo(D.x1 + 40, D.yNear); g.lineTo(D.x1 + 40, D.yNear + 26); g.lineTo(D.x0 - 60, D.yNear + 26); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,200,150,.08)'; g.fillRect(D.x0 - 60, D.yNear, D.x1 - D.x0 + 100, 2);
    const sg = g.createLinearGradient(0, D.yNear + 26, 0, D.yNear + 120); sg.addColorStop(0, 'rgba(3,3,10,.7)'); sg.addColorStop(1, 'rgba(3,3,10,0)'); g.fillStyle = sg; g.fillRect(D.x0 - 60, D.yNear + 26, D.x1 - D.x0 + 100, 100);
    stipple(c, { k: .25, g: 1, seed: 4, mid: false, boost: 1 });
  });
}
// the empty chair across the desk, seen from the front (x, y = the seat's front centre on the floor line), lamp-lit from the right
function chairFront(g, t, x, y, s, lampA = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const back = g.createLinearGradient(-30, -100, 30, -100); back.addColorStop(0, '#0d1020'); back.addColorStop(.75, '#1b2034'); back.addColorStop(1, '#2d3652'); g.fillStyle = back;
  g.beginPath(); g.roundRect(-34, -118, 68, 70, [14, 14, 4, 4]); g.fill();                                            // backrest
  g.fillStyle = '#141a2c'; g.beginPath(); g.roundRect(-40, -50, 80, 16, 5); g.fill();                                    // seat
  g.strokeStyle = '#0d1020'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(-32, -34); g.lineTo(-30, 0); g.moveTo(32, -34); g.lineTo(30, 0); g.moveTo(-26, -34); g.lineTo(-22, -8); g.moveTo(26, -34); g.lineTo(22, -8); g.stroke();
  g.strokeStyle = rgba('#ffd9a8', .45 * lampA); g.lineWidth = 1.2; g.beginPath(); g.moveTo(32, -116); g.quadraticCurveTo(34, -100, 33, -50); g.stroke();   // the lamp's rim on its edge
  g.strokeStyle = rgba(F6.cool, .18); g.beginPath(); g.moveTo(-32, -116); g.quadraticCurveTo(-34, -100, -33, -50); g.stroke();             // the screen's cool rim
  g.restore();
}
// the room as the window glass sees it: drawn mirrored by pane(); pane-local coordinates, origin = the window's centre
function roomReflection(q, t, o) {
  const br = breathe(t, 60, 0);
  // the room's depth in the glass: a dark field with the lamp's warm light
  const bg = q.createLinearGradient(0, -400, 0, 400); bg.addColorStop(0, '#0a0e22'); bg.addColorStop(1, '#070812'); q.fillStyle = bg; q.fillRect(-400, -400, 800, 800);
  // the lamp: the brightest thing in the reflection, far right of the pane in room terms (mirrored by pane())
  const LX = -80, LY = 40;
  ember(q, t, { x: LX, y: LY, kind: 'lamp', s: .55, dir: -.5, a: .9 * o.lampA, r: 200 });
  // the desk edge and the laptop's cool glow
  q.fillStyle = '#17121c'; q.fillRect(-300, LY + 44, 420, 10); q.fillStyle = '#0d0912'; q.fillRect(-300, LY + 54, 420, 60);
  if (o.screenOn) { q.fillStyle = '#0d1a36'; q.fillRect(-10, LY - 60, 96, 62); addGlow(q, 38, LY - 30, 120, .25, F6.cool, F6.coolCore); }
  // you, dark, seen from the side-back in the glass
  figureDesk(q, t, 60, LY + 70, 1.15, { seed: o.seed, typing: true, lamp: { x: LX, y: LY - 100 }, screen: { x: 40, y: LY - 30 }, lampA: o.lampA, screenA: o.screenOn ? 1 : 0, shade: .25, chair: true });
  // across the desk: the chair opposite. Empty (1.06, 14.04), or taken (14.08: you, facing us, the witness above)
  const CX = -210, CY = LY + 36;
  if (!o.chairTaken) chairFront(q, t, CX, CY + 60, .95, o.lampA);
  else {
    chairFront(q, t, CX, CY + 60, .95, o.lampA);
    figure(q, CX + 4, CY - 2, .95, POSES.sit, { t, seed: o.seed + 2, accent: '#4a5a86', light: { x: LX, y: LY - 100, col: F6.amberCore, a: .55 }, rim: rgba(F6.amberCore, .8), rimSide: 1, shadow: false });
    if (o.witnessA > 0) witness(q, t, { x: CX + 6, y: CY - 112, r: 4, halo: 70, a: o.witnessA });
  }
}
// a person seated at a desk, seen from behind (the hook room; the researchers' desks): round shoulders, head bowed a little,
// upper arms angled forward to the keyboard, the chair's backrest in front of the lower body. Back-lit by the lamp (warm rim on that
// side) and by the screen (a cool rim on the near contour of head and shoulders). Breath + typing from t.
//   figureDesk(ctx, t, x, y, s, { seed, typing true, lamp {x, y}, screen {x, y}, lampA 1, screenA 1, dress {coat, hair, skin}, chair true, shade 0 })
//   x, y = the seat (hip point), s = scale (1 → ~95 px from seat to crown)  → { head: [x, y], shoulders: [x, y] }
const DESKC = new Map();
export function figureDesk(ctx, t, x, y, s, o = {}) {
  const seed = o.seed ?? 1, r0 = seed * 1.37, b = Math.sin(t * TAU / 4.3 + r0) * .8, ty = o.typing !== false ? 1 : 0;
  const D = Object.assign({ coat: '#26304a', hair: '#16111a', skin: '#8d5f40', chair: '#121728' }, o.dress || {});
  const U = { w: 110, h: 130, ox: 55, oy: 112 }, cw = Math.ceil(U.w * s) + 4, ch = Math.ceil(U.h * s) + 4, key = cw + 'x' + ch;
  if (!DESKC.has(key)) DESKC.set(key, [canvas(cw, ch), canvas(cw, ch), canvas(cw, ch)]);
  const [[c, g], [mc, mg], [rc, rg]] = DESKC.get(key);
  for (const q of [g, mg, rg]) { q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-over'; q.globalAlpha = 1; q.clearRect(0, 0, cw, ch); }
  const paint = (q, mono) => {
    q.setTransform(s, 0, 0, s, U.ox * s, U.oy * s); const col = (k) => mono || D[k];
    const k1 = Math.sin(t * 7.3 + r0) * 1.4 * ty, k2 = Math.sin(t * 7.3 + r0 + 2.4) * 1.4 * ty, sy = -b * .6;
    // upper arms: from the round shoulders forward-down to the elbows just outside the body (foreshortened), the forearms go on to the keyboard
    q.fillStyle = mono || shade(D.coat, -.05); cap(q, -19, -60 + sy, 7.4, -31 + k1 * .3, -30 + k1, 5.8); cap(q, 19, -60 + sy, 7.4, 31 + k2 * .3, -30 + k2, 5.8);
    // the torso: wide round shoulders, a slight forward lean, a little waist, widening to the hips
    q.fillStyle = col('coat');
    q.beginPath(); q.moveTo(-21, 2); q.bezierCurveTo(-22, -18, -17, -36, -19, -50 + sy); q.bezierCurveTo(-21, -62 + sy, -16, -69 + sy, -6, -70 + sy); q.lineTo(6, -70 + sy); q.bezierCurveTo(16, -69 + sy, 21, -62 + sy, 19, -50 + sy); q.bezierCurveTo(17, -36, 22, -18, 21, 2); q.closePath(); q.fill();
    if (!mono) { q.fillStyle = shade(D.coat, .07); q.beginPath(); q.moveTo(-8, -70 + sy); q.quadraticCurveTo(0, -66 + sy, 8, -70 + sy); q.lineTo(7, -74 + sy); q.quadraticCurveTo(0, -71 + sy, -7, -74 + sy); q.closePath(); q.fill(); }   // collar
    // a short neck and the back of the head, bowed a little toward the screen
    q.fillStyle = mono || shade(D.skin, -.18); cap(q, 0, -70 + sy, 4.8, 0, -76 + sy, 4.4);
    q.fillStyle = col('hair'); q.beginPath(); q.ellipse(0, -87 + sy, 11.2, 12.6, 0, 0, TAU); q.fill(); q.beginPath(); q.moveTo(-10, -82 + sy); q.quadraticCurveTo(0, -72 + sy, 10, -82 + sy); q.lineTo(9, -78 + sy); q.quadraticCurveTo(0, -73.5 + sy, -9, -78 + sy); q.closePath(); q.fill();
    // the chair's low backrest in front of the lower back (the shoulders and arms stay visible above it)
    if (o.chair !== false) { q.fillStyle = col('chair'); q.beginPath(); q.roundRect(-25, -34, 50, 42, [10, 10, 3, 3]); q.fill(); if (!mono) { q.fillStyle = 'rgba(0,0,0,.25)'; q.fillRect(-23, -31, 46, 5); q.fillStyle = 'rgba(160,180,220,.1)'; q.fillRect(-24, -34, 48, 1.5); } }
  };
  paint(g, null);
  g.setTransform(s, 0, 0, s, U.ox * s, U.oy * s); g.globalCompositeOperation = 'source-atop';
  const fg = g.createLinearGradient(0, -100, 0, 10); fg.addColorStop(0, 'rgba(90,120,180,.14)'); fg.addColorStop(.4, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(3,4,10,.5)'); g.fillStyle = fg; g.fillRect(-60, -115, 120, 130);
  if (o.shade) { g.fillStyle = `rgba(8,10,24,${o.shade})`; g.fillRect(-60, -115, 120, 130); }
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = .6; g.beginPath(); g.moveTo(0, -66); g.lineTo(.4, -46); g.stroke();
  g.setTransform(1, 0, 0, 1, 0, 0); hatch(g, null, -1.1, 3.2 * Math.max(1, s * .9), .2, { box: [0, 0, cw, ch], col: '#05060c', w: Math.max(.6, s * .35), wobble: .5 });
  g.globalCompositeOperation = 'source-over';
  paint(mg, '#fff'); mg.setTransform(1, 0, 0, 1, 0, 0);
  const rim = (lx, ly, colr, al, rw, top) => { const dx = lx - x, dy = ly - (y - 80 * s), m = Math.hypot(dx, dy) || 1; rg.setTransform(1, 0, 0, 1, 0, 0); rg.globalCompositeOperation = 'source-over'; rg.clearRect(0, 0, cw, ch); rg.drawImage(mc, 0, 0); rg.globalCompositeOperation = 'destination-out'; rg.drawImage(mc, -dx / m * rw, -dy / m * rw);
    if (top) { rg.globalCompositeOperation = 'destination-in'; const lg = rg.createLinearGradient(0, 0, 0, (U.oy - 20) * s); lg.addColorStop(0, '#fff'); lg.addColorStop(1, 'rgba(255,255,255,0)'); rg.fillStyle = lg; rg.fillRect(0, 0, cw, ch); }
    rg.globalCompositeOperation = 'source-in'; rg.fillStyle = colr; rg.fillRect(0, 0, cw, ch); g.globalAlpha = al; g.drawImage(rc, 0, 0); g.globalAlpha = 1; };
  const L = o.lamp || { x: x + 500, y: y - 300 }, S = o.screen || { x: x + 200, y: y - 250 };
  rim(L.x, L.y, '#ffe2b8', .9 * (o.lampA ?? 1), Math.max(1.2, s * 1.1), false);
  rim(S.x, S.y - 400, F6.cool, .55 * (o.screenA ?? 1), Math.max(1, s * .8), true);
  ctx.drawImage(c, x - U.ox * s, y - U.oy * s);
  return { head: [x, y - 89 * s], shoulders: [x, y - 62 * s] };
}
function cap(ctx, x1, y1, r1, x2, y2, r2) { const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1)))); ctx.beginPath(); ctx.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); ctx.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); ctx.closePath(); ctx.fill(); }
function shade(hexc, d) { const [r, g, b] = hex2(hexc); const f = (v) => Math.round(clamp(v + d * 255, 0, 255)).toString(16).padStart(2, '0'); return '#' + f(r) + f(g) + f(b); }

// ================================================================ CLIP PANE: a pane turns into a window onto the speaker
// The screen switches on INSIDE your world: the glass brightens to one horizontal cool line that opens into the picture (old TV, .5 s),
// and closes the same way after the clip (2.12: the line is then the plate). Frames come from kit.mjs prepareClips (film.prepare).
//   clipPane(ctx, t, T, id, x, y, w, h, { on (override 0..1), ramp .5, frame 'thin'|'laptop'|'none', edge .8, radius 6, spill true,
//                                          yaw 0, rot 0, vignette .4 })   x, y = top-left   → { on, u (0..1 of the clip), line: [y0, y1] }
export function clipPane(ctx, t, T, id, x, y, w, h, o = {}) {
  const c = T && T.clip ? T.clip(id) : null, ramp = o.ramp ?? .5;
  const on = o.on ?? (c ? sm(lin(c.start - ramp, c.start, t)) * (1 - sm(lin(c.end, c.end + ramp, t))) : 1);
  const u = c ? clamp((t - c.start) / Math.max(.01, c.end - c.start)) : 0, cx = x + w / 2, cy = y + h / 2, open = eout(on), hv = Math.max(2, h * open);
  const k = c ? Math.floor(clamp(t - c.start, 0, c.end - c.start) * 30) + 1 : 1, fr = clipFrame(id, k);
  pane(ctx, t, { x: cx, y: cy, w, h, rot: o.rot ?? 0, yaw: o.yaw ?? 0, radius: o.radius ?? 6, frame: o.frame || 'thin', edge: (o.edge ?? .8) * (1 - .6 * on), spill: false,
    screenA: on > 0 ? 1 : 0, screen: (g, pw, ph) => {
      g.save(); g.beginPath(); g.rect(0, ph / 2 - hv / 2, pw, hv); g.clip();
      if (fr) { const s = Math.max(pw / fr.width, ph / fr.height), dw = fr.width * s, dh = fr.height * s; g.drawImage(fr, (pw - dw) / 2, (ph - dh) / 2, dw, dh); }
      else { const sg = g.createRadialGradient(pw * .5, ph * .35, 0, pw * .5, ph * .35, pw * .7); sg.addColorStop(0, '#2a3a6a'); sg.addColorStop(1, '#070918'); g.fillStyle = sg; g.fillRect(0, 0, pw, ph); const hx = pw * .5 + Math.sin(t * .8) * pw * .006, hy = ph * .62, ss = ph / 600; g.fillStyle = '#0b0d26'; g.beginPath(); g.ellipse(hx, hy - 150 * ss + Math.sin(t * 2.2) * 2 * ss, 78 * ss, 96 * ss, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(hx - 230 * ss, ph); g.bezierCurveTo(hx - 220 * ss, hy - 10 * ss, hx - 90 * ss, hy - 40 * ss, hx, hy - 40 * ss); g.bezierCurveTo(hx + 90 * ss, hy - 40 * ss, hx + 220 * ss, hy - 10 * ss, hx + 230 * ss, ph); g.fill(); }
      // the print of the screen: faint scanlines, the glass vignette
      g.globalAlpha = .05; g.fillStyle = '#000'; for (let yy = 0; yy < ph; yy += 4) g.fillRect(0, yy, pw, 1.5); g.globalAlpha = 1;
      const vg = g.createRadialGradient(pw / 2, ph / 2, Math.min(pw, ph) * .35, pw / 2, ph / 2, Math.max(pw, ph) * .72); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, rgba(F6.glassBot, o.vignette ?? .4)); g.fillStyle = vg; g.fillRect(0, 0, pw, ph);
      g.restore();
      // the cool line at the opening's edges while it opens or closes
      if (on > 0 && on < .999) { const k2 = 1 - on; g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; for (const yy of [ph / 2 - hv / 2, ph / 2 + hv / 2]) { for (const [lw2, al] of [[18, .08], [6, .25], [1.6, .95]]) { g.strokeStyle = rgba(lw2 < 2 ? F6.coolCore : F6.cool, al * (.4 + .6 * k2)); g.lineWidth = lw2; g.beginPath(); g.moveTo(-pw, yy); g.lineTo(pw * 2, yy); g.stroke(); } } g.restore(); }
    } });
  if (on <= 0) { // the dark pane holds one cool line at its middle only while the screen is about to switch on (the plate's line)
    const pre = c ? sm(lin(c.start - ramp - .4, c.start - ramp, t)) * (1 - sm(lin(c.end + ramp, c.end + ramp + .4, t))) : 0;
    if (pre > 0) coolLine(ctx, t, { from: [x + 8, cy], to: [x + w - 8, cy], a: pre, head: false, w: 1.4 });
  }
  if (o.spill !== false && on > 0) addGlow(ctx, cx, cy, Math.max(w, h) * .9, .14 * on, '#cfe0f0', '#eef4ff');
  return { on, u, line: [cy - hv / 2, cy + hv / 2] };
}
// ================================================================ LOWER THIRD: name · role · source · date, written by the cool line
//   lowerThird(ctx, t, T, id, { x 110, y 850 (the name's baseline; keep ≤ 860), a (override 0..1), size 40, info (override {name, role, source, date}) })
export function lowerThird(ctx, t, T, id, o = {}) {
  const c = T && T.clip ? T.clip(id) : null, info = o.info || clipInfo(id), x = o.x ?? 110, y = Math.min(o.y ?? 850, 860), size = o.size ?? 40;
  const a = o.a ?? (c ? sm(lin(c.start + .15, c.start + .75, t)) * (1 - sm(lin(c.end - .55, c.end - .05, t))) : 1); if (a <= 0) return;
  const meta = [info.role, info.source, info.date].filter(Boolean).join('  ·  ').toUpperCase();
  // every interview clip is a real recording: a small tag beside the name says so (Jakob 2026-10-21: viewers must not think it is generated)
  const tag = o.tag === undefined ? 'ORIGINAL FOOTAGE' : o.tag;
  ctx.save(); ctx.font = `${size}px "Instrument Serif"`; const nw = ctx.measureText(info.name).width; ctx.font = '600 17px "Inter"'; const mw = ctx.measureText(meta).width + meta.length * 4;
  ctx.font = '600 18px "Inter"'; const tw = tag ? ctx.measureText(tag).width + tag.length * 3.5 : 0; ctx.restore();
  const tx0 = x + nw + 26, tagW = tag ? tw + 50 : 0;
  const wmax = Math.max(nw + (tag ? 26 + tagW : 0), mw) + 20, lineU = clamp(a * 1.6), textU = clamp((a - .25) / .75);
  coolLine(ctx, t, { from: [x, y + 50], to: [x + wmax, y + 50], u: lineU, w: 1.3, glow: .5, head: a < 1 });
  reveal(ctx, x - 4, y - size, wmax + 8, size * 2.4, textU, (g) => {
    text(g, info.name, x, y, { size, font: 'Instrument Serif', color: F6.cream });
    text(g, meta, x, y + 34, { size: 17, weight: 600, color: rgba(F6.cool, .85), spacing: 4 });
    if (tag) {   // pill: a recording light + the words, centred on the name's capitals
      const cy = y - 13, ph = 36;
      g.save(); g.fillStyle = rgba(F6.glassBot, .45); g.strokeStyle = rgba(F6.cream, .5); g.lineWidth = 1.2;
      g.beginPath(); g.roundRect(tx0, cy - ph / 2, tagW, ph, ph / 2); g.fill(); g.stroke();
      const pulse = .75 + .25 * Math.sin(t * 3.2);
      addGlow(g, tx0 + 20, cy, 18, .35 * pulse, F6.amber, F6.amberCore);
      g.fillStyle = rgba(F6.amber, .95); g.beginPath(); g.arc(tx0 + 20, cy, 5.2, 0, Math.PI * 2); g.fill(); g.restore();
      text(g, tag, tx0 + 36, cy + 6.5, { size: 18, weight: 600, color: rgba(F6.cream, .95), spacing: 3.5 });
    }
  });
}

// ================================================================ the MIRROR OF MIND (§2b): a tall mirror in a dim space; thoughts cross it as
// clouds; awareness looks in; it can grow brilliant with text in many scripts; one heartbeat trembles it.
//   mirrorOfMind(ctx, t, { x, y (centre), w 520, h 760, reflect: (g) => … (the world in the glass, mirrored; default: the dim room), reflectA .9,
//                          clouds: { n 4, a .5, speed 14, seed, s } | null, text 0..1 (the brilliant scripts), ripple: { t0, amp 1 } | null,
//                          witness: { x, y, a } | null (drawn above the mirror's head height), frame 'mirror', floor true, edge 1, dim .18 })
//   → { pane: {x, y, w, h, path, local} }
export function mirrorOfMind(ctx, t, o = {}) {
  const x = o.x ?? W * .5, y = o.y ?? H * .5, w = o.w ?? 520, h = o.h ?? 760, tx = clamp(o.text ?? 0);
  // the floor: the mirror's light lies on it
  if (o.floor !== false) { ctx.save(); ctx.translate(x, y + h / 2 + 30); ctx.scale(1, .25); const fg = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 1.2); fg.addColorStop(0, rgba(F6.silver, .14 + .2 * tx)); fg.addColorStop(1, rgba(F6.silver, 0)); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(0, 0, w * 1.2, 0, TAU); ctx.fill(); ctx.restore(); }
  const P = pane(ctx, t, { x, y, w, h, frame: o.frame || 'mirror', edge: o.edge ?? 1, radius: 2, reflectA: o.reflectA ?? .9, reflectDim: o.dim ?? .18, spill: false,
    reflect: (g) => {
      if (o.reflect) o.reflect(g); else { const bg = g.createLinearGradient(0, -h / 2, 0, h / 2); bg.addColorStop(0, '#2a2f44'); bg.addColorStop(.7, '#1a1d2e'); bg.addColorStop(1, '#0d0f1a'); g.fillStyle = bg; g.fillRect(-w / 2, -h / 2, w, h); }
      if (o.clouds !== null) clouds(g, t, { x: -w / 2 - 40, y: -h * .46, w: w + 80, h: o.clouds?.h ?? h * .3, n: o.clouds?.n ?? 4, a: o.clouds?.a ?? .5, speed: o.clouds?.speed ?? 14, seed: o.clouds?.seed ?? 3, s: o.clouds?.s ?? .9, col: '#e4ecf6' });
    },
    screenA: tx > 0 ? 1 : 0, screen: tx > 0 ? (g, pw, ph) => {   // the brilliant mirror: text of every script, running
      g.save(); g.globalCompositeOperation = 'lighter'; const cols = Math.max(1, Math.round(pw / 230)), cwid = pw / cols;
      for (let ci = 0; ci < cols; ci++) { const off = (t * (9 + ci * 3)) % 60; coolText(g, t + 100, { x: 14 + ci * cwid, y: -60 + off, w: cwid - 28, size: 10, lines: Math.ceil(ph / 19) + 4, lineH: 19, cps: 1e4, gap: 0, seed: 40 + ci, script: 'mix', cursor: false, ripple: false, a: .55 + .45 * tx }); }
      g.restore();
      if (tx < 1) { g.fillStyle = rgba(F6.glassTop, (1 - tx) * .75); g.fillRect(0, 0, pw, ph); }
    } : null });
  if (o.ripple && t >= o.ripple.t0) { // one heartbeat trembles the surface: an engraved ring of light runs out from the centre
    const e = t - o.ripple.t0, life = 1.1; if (e < life) { const k = e / life, rr = 30 + eout(k) * Math.max(w, h) * .55, al = (1 - k) * (o.ripple.amp ?? 1); ctx.save(); P.path(); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; for (const [lw2, a2] of [[22, .08], [6, .22], [1.4, .8]]) { ctx.strokeStyle = rgba(lw2 < 2 ? F6.amberCore : F6.amber, a2 * al); ctx.lineWidth = lw2; ctx.beginPath(); ctx.ellipse(x, y, rr, rr * .72, 0, 0, TAU); ctx.stroke(); } ctx.restore(); }
  }
  if (tx > 0) addGlow(ctx, x, y, Math.max(w, h) * .8, .22 * tx, F6.cool, F6.coolCore);
  if (o.witness && (o.witness.a ?? 1) > 0) witness(ctx, t, { x: o.witness.x ?? x, y: o.witness.y ?? y - h / 2 - 40, a: o.witness.a ?? 1 });
  return { pane: P };
}

// ================================================================ LETTERPRESS: words set from outside, in ink on paper (3.05, 8.07, 11.12)
//   letterpress(ctx, t, { x, y (baseline), words: ['DESCRIBED', 'TRAINED', 'TESTED'] | text, t0, per .4 (s per word), size 44, font 'Inter',
//                         weight 600, ink F6.ink, spacing 6, gap 28 (px between words), align 'left', u (override 0..n words) })
//   Each word lands with a press (scale 1.05 → 1, 0.25 s) and an embossed shadow. → { done, w, ends: [x per word] }
export function letterpress(ctx, t, o = {}) {
  const words = o.words || String(o.text || '').split(/\s+/).filter(Boolean), size = o.size ?? 44, font = o.font || 'Inter', weight = o.weight ?? 600, ink = o.ink || F6.ink, sp = o.spacing ?? 6, gap = o.gap ?? 28, t0 = o.t0 ?? 0, per = o.per ?? .4;
  ctx.save(); ctx.font = `${font.startsWith('Instrument') ? '' : weight + ' '}${size}px "${font}"`; try { ctx.letterSpacing = sp + 'px'; } catch { }
  const ws = words.map((w2) => ctx.measureText(w2).width + sp), total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  let x = o.align === 'center' ? (o.x ?? W / 2) - total / 2 : o.align === 'right' ? (o.x ?? W / 2) - total : (o.x ?? 100); const y = o.y ?? H / 2, ends = []; let done = true;
  ctx.textBaseline = 'alphabetic';
  words.forEach((wd, i) => {
    const uu = o.u != null ? clamp(o.u - i) : clamp((t - t0 - i * per) / .25); if (uu < 1) done = false;
    if (uu > 0) { const sc = 1 + .06 * (1 - eout(uu)), al = .35 + .65 * uu; ctx.save(); ctx.translate(x + ws[i] / 2, y); ctx.scale(sc, sc);
      ctx.fillStyle = rgba('#ffffff', .4 * al); ctx.fillText(wd, -ws[i] / 2 - .8, -.8); ctx.fillStyle = rgba(ink, .35 * al); ctx.fillText(wd, -ws[i] / 2 + .7, .7); ctx.fillStyle = rgba(ink, al); ctx.fillText(wd, -ws[i] / 2, 0); ctx.restore(); }
    x += ws[i] + gap; ends.push(x - gap);
  });
  ctx.restore(); return { done, w: total, ends };
}
