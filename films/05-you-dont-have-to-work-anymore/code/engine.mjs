// Film 02 engine: Canvas 2D (via @napi-rs/canvas) renderer for illustrated plates with real depth layers,
// procedural figures and motion-design symbol scenes. Everything is a pure function of time t (seconds).
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'node:fs';
import path from 'node:path';

export const W = 1920, H = 1080;
const FONTS = '/home/user/scenario/style-tests/shared/fonts/';
GlobalFonts.registerFromPath(FONTS + 'InstrumentSerif.woff2', 'Instrument Serif');
GlobalFonts.registerFromPath(FONTS + 'InstrumentSerif-400-italic.woff2', 'Instrument Serif Italic');
for (const w of [400, 500, 600]) GlobalFonts.registerFromPath(FONTS + `Inter-${w}-normal.woff2`, 'Inter');

// ---------- palette (scenario-motion colour code) ----------
export const C = {
  amber: '#ffb35c', amberDeep: '#7a3b17', cyan: '#8fe6ff', cyanWhite: '#d8f7ff', cyanDeep: '#0a6f8c',
  indigo: '#0b0f2a', violet: '#3b2f6e', ink: '#070918', cream: '#f3efe2', muted: '#a49fc4', rose: '#e8a3a0',
};
export const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// ---------- math ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lin = (a, b, t) => clamp((t - a) / (b - a));
export const mix = (a, b, x) => a + (b - a) * x;
export const sm = (x) => x * x * (3 - 2 * x);
export const eio = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const eout = (x) => 1 - Math.pow(1 - x, 3);
export const ein = (x) => x * x * x;
export const sine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
export const back = (x) => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export function prng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
// perpetual drift: several sines with crooked frequencies, never zero velocity
export const drift = (t, a = 1, ph = 0) => a * (Math.sin(t * 0.37 + ph) * 0.6 + Math.sin(t * 0.91 + ph * 1.7) * 0.3 + Math.sin(t * 1.73 + ph * 2.3) * 0.1);

// ---------- images ----------
const IMG = new Map();
export async function img(file) {
  if (!IMG.has(file)) IMG.set(file, await loadImage(fs.readFileSync(file)));
  return IMG.get(file);
}
export const imgSync = (file) => { const i = IMG.get(file); if (!i) throw new Error('image not preloaded: ' + file); return i; };

export function canvas(w = W, h = H) { const c = createCanvas(w, h); return [c, c.getContext('2d')]; }

// ---------- light ----------
export function glow(ctx, cx, cy, r, a, hex = C.cyan, core = C.cyanWhite) {
  if (r <= 0 || a <= 0) return;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, rgba(core, a)); g.addColorStop(.22, rgba(hex, .55 * a)); g.addColorStop(1, rgba(hex, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
}
export function addGlow(ctx, cx, cy, r, a, hex = C.cyan, core = C.cyanWhite) {
  const op = ctx.globalCompositeOperation; ctx.globalCompositeOperation = 'lighter'; glow(ctx, cx, cy, r, a, hex, core); ctx.globalCompositeOperation = op;
}

// ---------- grain + vignette (restrained, new offset every frame) ----------
const [grainC, grainX] = canvas(512, 512);
{ const r = prng(11), d = grainX.createImageData(512, 512); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } grainX.putImageData(d, 0, 0); }
export function grain(ctx, t, a = 0.05) {
  const f = Math.floor(t * 24), ox = (f * 197) % 512, oy = (f * 331) % 512;
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay';
  for (let x = -ox; x < W; x += 512) for (let y = -oy; y < H; y += 512) ctx.drawImage(grainC, x, y);
  ctx.restore();
}
export function vignette(ctx, a = 0.45) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, 'rgba(7,9,24,0)'); g.addColorStop(1, `rgba(7,9,24,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ---------- star sky / paper backgrounds for symbol scenes ----------
const STARS = (() => { const r = prng(5), s = []; for (let i = 0; i < 420; i++) s.push({ x: r(), y: r(), m: r(), p: r() * 7 }); return s; })();
export function sky(ctx, t, { top = C.ink, bottom = '#1a1748', offY = 0, stars = 1, warm = 0 } = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top); g.addColorStop(1, bottom); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (warm > 0) { const h = ctx.createLinearGradient(0, H * .45, 0, H); h.addColorStop(0, rgba('#e8a3a0', 0)); h.addColorStop(1, rgba('#ffb35c', .55 * warm)); ctx.fillStyle = h; ctx.fillRect(0, 0, W, H); }
  if (!stars) return;
  for (const s of STARS) {
    const y = ((s.y * H * 1.6 + offY * (0.3 + s.m * 0.7)) % (H * 1.6) + H * 1.6) % (H * 1.6) - H * 0.3;
    if (y < -5 || y > H + 5) continue;
    const a = stars * (0.25 + 0.55 * s.m) * (0.75 + 0.25 * Math.sin(t * (0.8 + s.m) + s.p));
    ctx.fillStyle = rgba(C.cyanWhite, a); ctx.fillRect(s.x * W, y, s.m > .93 ? 2.2 : 1.3, s.m > .93 ? 2.2 : 1.3);
  }
}
// drifting fog bank in screen space
const FOGS = (() => { const r = prng(9), f = []; for (let i = 0; i < 16; i++) f.push({ x: r() * 2400 - 240, y: r(), w: 500 + r() * 800, h: 70 + r() * 120, s: 6 + r() * 16, a: .04 + r() * .06 }); return f; })();
export function fog(ctx, t, { y0 = .55, y1 = 1, hex = '#78c8e1', amt = 1, from = 0, to = 16 } = {}) {
  for (let i = from; i < to; i++) {
    const f = FOGS[i], x = ((f.x + f.s * t) % 2600 + 2600) % 2600 - 340, y = mix(y0, y1, f.y) * H;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, f.h / f.w);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, f.w); g.addColorStop(0, rgba(hex, f.a * amt)); g.addColorStop(1, rgba(hex, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, f.w, 0, 7); ctx.fill(); ctx.restore();
  }
}

// ---------- plates: layered illustration + 2.5D camera ----------
// cam: { x, y } = focus point in image px (0..IW, 0..IH), z = zoom (1 = image height fills the frame).
// Each layer has parallax p (far ~0.3, near 1): translation away from the image centre is scaled by p,
// zoom grows faster on near layers (dolly feel).
export function drawPlate(ctx, layers, cam, { IW = 2752, IH = 1536, dolly = 0.0 } = {}) {
  const base = H / IH;
  for (const L of layers) {
    const im = L.im, p = L.p ?? 1, z = cam.z * (1 + dolly * (p - 0.5)) * (L.s || 1);
    const k = base * z;
    const fx = IW / 2 + (cam.x - IW / 2) * p, fy = IH / 2 + (cam.y - IH / 2) * p;
    const ox = (L.dx || 0), oy = (L.dy || 0);
    const sx = W / 2 - (fx - ox) * k, sy = H / 2 - (fy - oy) * k;
    if (L.alpha !== undefined) { ctx.save(); ctx.globalAlpha = L.alpha; }
    ctx.drawImage(im, sx - (L.pad || 0) * k, sy - (L.pad || 0) * k, (IW + 2 * (L.pad || 0)) * k, (IH + 2 * (L.pad || 0)) * k);
    if (L.alpha !== undefined) ctx.restore();
    if (L.after) L.after(ctx, { k, X: (x) => sx + x * k, Y: (y) => sy + y * k });
  }
}
// screen mapping for a given parallax (to pin effects/figures to a layer)
export function mapper(cam, p = 1, { IW = 2752, IH = 1536, dolly = 0 } = {}) {
  const z = cam.z * (1 + dolly * (p - 0.5)), k = (H / IH) * z;
  const fx = IW / 2 + (cam.x - IW / 2) * p, fy = IH / 2 + (cam.y - IH / 2) * p;
  const sx = W / 2 - fx * k, sy = H / 2 - fy * k;
  return { k, X: (x) => sx + x * k, Y: (y) => sy + y * k };
}
// camera path between keyframes with ease + perpetual drift
export function camPath(t, a, b, keys, ease = sine) {
  const u = ease(lin(a, b, t));
  const at = (k) => keys[0][k] + (keys[1][k] - keys[0][k]) * u;
  return { x: at('x') + drift(t, 6, 1), y: at('y') + drift(t, 4, 2), z: at('z') * (1 + 0.004 * Math.sin(t * .43)) };
}

// ---------- figures ----------
// standing sprite: breathing, weight shift, tiny head-level sway (pivot at feet)
export function standFigure(ctx, sprite, x, y, h, t, { sway = 1, flip = false, shadow = true } = {}) {
  const s = h / sprite.height, w = sprite.width * s;
  if (shadow) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, w * .7); g.addColorStop(0, 'rgba(6,5,20,.55)'); g.addColorStop(1, 'rgba(6,5,20,0)');
    ctx.save(); ctx.translate(x, y); ctx.scale(1, .18); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, w * .7, 0, 7); ctx.fill(); ctx.restore();
  }
  ctx.save(); ctx.translate(x, y);
  ctx.rotate(sway * (0.012 * Math.sin(t * 0.7) + 0.006 * Math.sin(t * 1.9 + 1)));
  ctx.scale(flip ? -1 : 1, 1 + 0.01 * Math.sin(t * 2.1));
  ctx.drawImage(sprite, -w / 2, -h, w, h);
  ctx.restore();
}
// walking figure: AI-drawn upper body + procedural IK legs (port of the flagship motion test)
const L1 = 400, L2 = 375, STEP = 70, HIP = [680, 1030], GROUND_S = 1793, FS = 0.161;
function legPose(p) {
  const S = 1.2 * STEP / FS;
  if (p < 0.6) return [S / 2 - (p / 0.6) * S, GROUND_S - HIP[1]];
  const q = (p - 0.6) / 0.4; return [-S / 2 + S * sm(q), GROUND_S - HIP[1] - 70 * Math.sin(Math.PI * q)];
}
function drawLeg(ctx, p, col) {
  const [fx2, fy2] = legPose(p), d = Math.min(Math.hypot(fx2, fy2), L1 + L2 - 2);
  const a = Math.atan2(fy2, fx2), b = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
  const kx = Math.cos(a - b) * L1, ky = Math.sin(a - b) * L1, ax = Math.cos(a) * d, ay = Math.sin(a) * d;
  ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.lineWidth = 118; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(kx, ky); ctx.stroke();
  ctx.lineWidth = 92; ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(ax, ay); ctx.stroke();
  const toe = p < 0.6 ? 0 : -0.35 * Math.sin(Math.PI * (p - 0.6) / 0.4);
  ctx.save(); ctx.translate(ax, ay); ctx.rotate(toe); ctx.fillStyle = '#100b2c'; ctx.beginPath(); ctx.ellipse(48, 24, 92, 36, 0, 0, 7); ctx.fill(); ctx.restore();
}
// x,y = screen position of the feet; h = figure height on screen; dist walked drives the cycle
export function walkFigure(ctx, upper, x, y, h, dist, t, { flip = false, phoneGlow = true } = {}) {
  const sc = h / GROUND_S, ph = (dist / (2 * STEP * 1.0)) % 1;
  const bob = 14 * Math.cos(4 * Math.PI * ph), lean = 0.025 + 0.012 * Math.sin(4 * Math.PI * ph + 0.6);
  const g = ctx.createRadialGradient(x, y + 2, 0, x, y + 2, h * .35); g.addColorStop(0, 'rgba(8,6,24,0.5)'); g.addColorStop(1, 'rgba(8,6,24,0)');
  ctx.save(); ctx.translate(0, y + 2); ctx.scale(1, 0.2); ctx.translate(0, -(y + 2)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y + 2, h * .35, 0, 7); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1); ctx.scale(sc, sc); ctx.translate(-HIP[0] - 60, -GROUND_S); ctx.translate(HIP[0], HIP[1] + bob);
  drawLeg(ctx, (ph + 0.5) % 1, '#150f38');
  ctx.save(); ctx.rotate(lean); ctx.scale(1, 1 + 0.006 * Math.sin(t * 2.4)); ctx.drawImage(upper, -HIP[0], -HIP[1]); ctx.restore();
  drawLeg(ctx, ph, '#1c0e3e');
  ctx.restore();
  if (phoneGlow) addGlow(ctx, x + (flip ? -1 : 1) * (990 - HIP[0] - 60) * sc, y + (560 - GROUND_S) * sc, h * 0.16, 0.2 + 0.05 * Math.sin(t * 3.1));
}

// ---------- typography ----------
export function text(ctx, s, x, y, { size = 40, font = 'Inter', weight = 500, color = C.cream, align = 'left', alpha = 1, spacing = 0, base = 'alphabetic' } = {}) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
  ctx.font = `${font.startsWith('Instrument') ? '' : weight + ' '}${size}px "${font}"`;
  if (spacing) { try { ctx.letterSpacing = spacing + 'px'; } catch { } }
  ctx.fillText(s, x, y); ctx.restore();
}
// label = small caps line + value, wipes in from below
export function label(ctx, t, t0, x, y, top, bottom, { align = 'left', color = C.cream, fade = 99 } = {}) {
  const a = eout(lin(t0, t0 + .6, t)) * (1 - lin(t0 + fade, t0 + fade + .5, t)); if (a <= 0) return;
  const dy = (1 - a) * 18;
  text(ctx, top.toUpperCase(), x, y + dy, { size: 20, weight: 600, color: C.muted, align, alpha: a, spacing: 6 });
  if (bottom) text(ctx, bottom, x, y + 46 + dy, { size: 40, font: 'Instrument Serif', color, align, alpha: a });
}
// big year/location stamp that rolls in and settles top-left
export function stamp(ctx, t, t0, year, place, { dur = 4.5 } = {}) {
  const a = eout(lin(t0, t0 + .7, t)) * (1 - lin(t0 + dur, t0 + dur + .6, t)); if (a <= 0) return;
  const y = 120 + (1 - eout(lin(t0, t0 + .8, t))) * 30;
  text(ctx, year, 96, y, { size: 84, font: 'Instrument Serif', alpha: a });
  if (place) text(ctx, place.toUpperCase(), 100, y + 44, { size: 20, weight: 600, color: C.muted, alpha: a, spacing: 7 });
}

// ---------- curves ----------
// draw a glowing polyline (array of [x,y]) up to fraction u, with optional head glow
export function glowLine(ctx, pts, u = 1, { color = C.cyan, width = 4, glowW = 18, alpha = 1, head = true, dash = null } = {}) {
  if (u <= 0 || pts.length < 2) return;
  const n = Math.max(2, Math.floor(pts.length * u));
  const path = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash);
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba(color, .18 * alpha); ctx.lineWidth = glowW; path(); ctx.stroke();
  ctx.strokeStyle = rgba(color, .35 * alpha); ctx.lineWidth = glowW * .45; path(); ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = rgba(color === C.cyan ? C.cyanWhite : color, alpha); ctx.lineWidth = width; path(); ctx.stroke();
  ctx.restore();
  if (head) { const p = pts[n - 1]; addGlow(ctx, p[0], p[1], glowW * 2.2, .9 * alpha, color, color === C.cyan ? C.cyanWhite : '#fff3dd'); }
}
export function samples(f, a, b, n = 200) { const r = []; for (let i = 0; i <= n; i++) { const u = a + (b - a) * i / n; r.push(f(u)); } return r; }

// ---------- transitions between two rendered shots ----------
export function composite(ctx, A, B, kind, u, o = {}) {
  const ox = o.x ?? W / 2, oy = o.y ?? H / 2;
  if (kind === 'match') { ctx.drawImage(A, 0, 0); ctx.globalAlpha = sm(u); ctx.drawImage(B, 0, 0); ctx.globalAlpha = 1; return; }
  if (kind === 'iris') { // B opens out of the carrier object at (ox, oy)
    ctx.drawImage(A, 0, 0); const e = eio(u), R = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy)) * 1.05 * e + (o.r || 30) * (1 - e);
    ctx.save(); ctx.beginPath(); ctx.arc(ox, oy, R, 0, 7); ctx.clip(); ctx.drawImage(B, 0, 0); ctx.restore();
    const g = ctx.createRadialGradient(ox, oy, R * .9, ox, oy, R * 1.05); g.addColorStop(0, 'rgba(216,247,255,0)'); g.addColorStop(.5, `rgba(216,247,255,${.18 * Math.sin(Math.PI * u)})`); g.addColorStop(1, 'rgba(216,247,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); return;
  }
  if (kind === 'zoom') { // camera flies into the carrier at (ox, oy); B grows out of it
    const e = eio(u), za = Math.pow(o.depth || 6, e);
    ctx.save(); ctx.translate(ox, oy); ctx.scale(za, za); ctx.translate(-ox, -oy); ctx.drawImage(A, 0, 0); ctx.restore();
    const zb = mix(1 / (o.depth || 6), 1, e), a = sm(lin(.35, .8, u));
    ctx.save(); ctx.globalAlpha = a; ctx.translate(mix(ox, W / 2, e), mix(oy, H / 2, e)); ctx.scale(zb, zb); ctx.drawImage(B, -W / 2, -H / 2); ctx.restore(); return;
  }
  if (kind === 'out') { // reverse zoom: camera pulls back, A shrinks into a spot of B
    const e = eio(u), zb = Math.pow(o.depth || 6, 1 - e);
    ctx.save(); ctx.translate(ox, oy); ctx.scale(zb, zb); ctx.translate(-ox, -oy); ctx.drawImage(B, 0, 0); ctx.restore();
    const za = mix(1, 1 / (o.depth || 6), e);
    ctx.save(); ctx.globalAlpha = 1 - sm(lin(.3, .75, u)); ctx.translate(mix(W / 2, ox, e), mix(H / 2, oy, e)); ctx.scale(za, za); ctx.drawImage(A, -W / 2, -H / 2); ctx.restore(); return;
  }
  if (kind === 'black') { // fade through black (chapter boundaries and rests only)
    if (u < .5) { ctx.drawImage(A, 0, 0); ctx.fillStyle = `rgba(7,9,24,${sm(u * 2)})`; } else { ctx.drawImage(B, 0, 0); ctx.fillStyle = `rgba(7,9,24,${1 - sm((u - .5) * 2)})`; }
    ctx.fillRect(0, 0, W, H); return;
  }
  if (kind === 'page') { // page turn between the two endings
    const e = eio(u), x = W * (1 - e);
    ctx.drawImage(A, 0, 0); ctx.save(); ctx.beginPath(); ctx.rect(x, 0, W - x, H); ctx.clip(); ctx.drawImage(B, 0, 0); ctx.restore();
    const g = ctx.createLinearGradient(x - 90, 0, x + 30, 0); g.addColorStop(0, 'rgba(7,9,24,0)'); g.addColorStop(.75, 'rgba(7,9,24,.45)'); g.addColorStop(1, 'rgba(243,239,226,.25)');
    ctx.fillStyle = g; ctx.fillRect(x - 90, 0, 120, H); return;
  }
  if (kind === 'cut') { ctx.drawImage(u < .5 ? A : B, 0, 0); return; }
  if (kind === 'dissolve') { ctx.drawImage(A, 0, 0); ctx.globalAlpha = sm(u); ctx.drawImage(B, 0, 0); ctx.globalAlpha = 1; return; }
  if (kind === 'push') { // A zooms past camera, B settles from slightly smaller
    const e = eio(u);
    ctx.save(); ctx.globalAlpha = 1; const za = 1 + e * .35; ctx.translate(W / 2, H / 2); ctx.scale(za, za); ctx.drawImage(A, -W / 2, -H / 2); ctx.restore();
    ctx.save(); ctx.globalAlpha = sm(lin(.25, .85, u)); const zb = mix(.88, 1, e); ctx.translate(W / 2, H / 2); ctx.scale(zb, zb); ctx.drawImage(B, -W / 2, -H / 2); ctx.restore(); return;
  }
  if (kind === 'up' || kind === 'down') { // vertical camera move: A slides out, B slides in (tilt)
    const e = eio(u), s = kind === 'up' ? 1 : -1;
    ctx.drawImage(A, 0, s * e * H); ctx.drawImage(B, 0, s * (e - 1) * H); return;
  }
  if (kind === 'left' || kind === 'right') {
    const e = eio(u), s = kind === 'left' ? -1 : 1;
    ctx.drawImage(A, s * e * W, 0); ctx.drawImage(B, s * (e - 1) * W, 0); return;
  }
  if (kind === 'fog') { // a bank of mist sweeps across; B is revealed behind it
    ctx.drawImage(A, 0, 0); ctx.globalAlpha = sm(lin(.35, .65, u)); ctx.drawImage(B, 0, 0); ctx.globalAlpha = 1;
    const x = mix(-W * .6, W * 1.6, eio(u)), a = Math.sin(Math.PI * u);
    for (let i = 0; i < 5; i++) { const g = ctx.createRadialGradient(x - i * 260, H * (.3 + .12 * i), 0, x - i * 260, H * (.3 + .12 * i), 900); g.addColorStop(0, `rgba(150,200,225,${.55 * a})`); g.addColorStop(1, 'rgba(150,200,225,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    return;
  }
  if (kind === 'flash') { ctx.drawImage(u < .5 ? A : B, 0, 0); const a = Math.max(0, 1 - Math.abs(u - .5) * 3); ctx.fillStyle = `rgba(216,247,255,${a * .9})`; ctx.fillRect(0, 0, W, H); return; }
  ctx.drawImage(u < .5 ? A : B, 0, 0);
}

// ---------- film runner ----------
// shots: [{ a, b, draw(ctx, t, shot), out: {kind, d} }] — consecutive shots overlap by out.d seconds
export class Film {
  constructor(shots, { grainAmt = 0.05 } = {}) {
    this.shots = shots.sort((x, y) => x.a - y.a); this.grainAmt = grainAmt;
    [this.A, this.ax] = canvas(); [this.B, this.bx] = canvas(); [this.F, this.fx] = canvas();
  }
  get duration() { return Math.max(...this.shots.map((s) => s.b)); }
  renderShot(x, s, t) { x.save(); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.fillStyle = C.indigo; x.fillRect(0, 0, W, H); s.draw(x, t, s); x.restore(); }
  frame(t) {
    const fx = this.fx, live = this.shots.filter((s) => t >= s.a && t < s.b);
    if (live.length === 0) { fx.fillStyle = C.ink; fx.fillRect(0, 0, W, H); }
    else if (live.length === 1) this.renderShot(fx, live[0], t);
    else {
      const [s1, s2] = live.slice(-2), kind = s1.out?.kind || 'dissolve';
      const u = lin(s2.a, s1.b, t);
      this.renderShot(this.ax, s1, t); this.renderShot(this.bx, s2, t);
      fx.fillStyle = C.ink; fx.fillRect(0, 0, W, H); composite(fx, this.A, this.B, kind, u, s1.out || {});
    }
    vignette(fx, .35); grain(fx, t, this.grainAmt);
    return this.F;
  }
}
