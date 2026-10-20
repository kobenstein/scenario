// C8 helpers (owner: c08). Everything here is private to scenes/sc08.mjs; nothing is shared with other chunks.
// Worlds of the chunk:  A  the engraved certificate fragments on banknote green (5.07 · 5.08 · 5.10)
//                       B  the night city from above and the engraved night map (5.16a · 5.16b)
//                       C  plan sheet, fund and tree, the Swiss map, the refund letters, the statement, the quote card (6.01–6.06)
// Expensive static layers are built once (once()) and composited per frame with transforms.
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { stipple, vnoise, fbm, fog as artFog, roughPath } from './art.mjs';
import { rosette, gBorder, microRing, microtext, ring, foilGlint, certificate, FOIL } from './certificate.mjs';
import { ll, country } from './map.mjs';
import { fibreFill } from './print.mjs';

const TAU = Math.PI * 2;
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
// MOTION.md easings: expo-out landings, expo-in exits, quart in-out moves
export const xout = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const xin = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const env = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));       // fade in a..b, out c..d
const poly = (g, P) => { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };

// ---------- typography helpers ----------
// text revealed by a mask sweeping left → right (never moves while it has to be read)
export function revealText(ctx, s, x, y, u, o = {}) {
  if (u <= 0) return; const size = o.size ?? 40, font = o.font || 'Inter';
  ctx.save(); ctx.font = `${font.startsWith('Instrument') ? '' : (o.weight ?? 500) + ' '}${size}px "${font}"`; try { ctx.letterSpacing = (o.spacing ?? 0) + 'px'; } catch { }
  const w = ctx.measureText(s).width + (o.spacing ?? 0) * s.length, x0 = o.align === 'right' ? x - w : o.align === 'center' ? x - w / 2 : x;
  ctx.beginPath(); ctx.rect(x0 - 4, y - size * 1.1, (w + 8) * clamp(u * 1.08), size * 1.6); ctx.clip();
  text(ctx, s, x, y + (1 - xout(u)) * size * .18, { ...o, size, font });
  ctx.restore();
}
export function sourceLine(ctx, s, a = 1, o = {}) {
  if (a <= 0) return;
  text(ctx, s, o.x ?? 96, o.y ?? 900, { size: 17, weight: 500, color: rgba(o.col || '#d9d2bd', .74 * a), spacing: .5 });
}
// foil text: the film's amber foil as a gradient fill + a light band
export function foilText(ctx, s, x, y, t, o = {}) {
  const size = o.size ?? 100, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = `${size}px "Instrument Serif"`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(s).width, x0 = o.align === 'right' ? x - w : o.align === 'center' ? x - w / 2 : x;
  ctx.fillStyle = 'rgba(30,12,4,.55)'; ctx.fillText(s, x + 2, y + 3);
  const g = ctx.createLinearGradient(x0, y - size, x0 + w, y); FOIL.forEach((c, i) => g.addColorStop(i / (FOIL.length - 1), c)); ctx.fillStyle = g; ctx.fillText(s, x, y);
  const ph = ((t * .25 + (o.phase ?? 0)) % 1.4) - .2, bx = x0 + ph * (w + 200) - 100, gl = ctx.createLinearGradient(bx - 60, y - size, bx + 60, y);
  gl.addColorStop(0, 'rgba(255,240,210,0)'); gl.addColorStop(.5, 'rgba(255,248,230,.85)'); gl.addColorStop(1, 'rgba(255,240,210,0)');
  ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = gl; ctx.fillText(s, x, y);
  ctx.restore();
}

// ---------- light, motes ----------
export function motes(ctx, t, o = {}) {
  const r = prng(o.seed ?? 23), n = o.n ?? 70, a = o.a ?? 1, col = o.col || '255,226,180'; if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x0 = r() * (W + 200) - 100, y0 = r() * (H + 100) - 50, sp = 4 + r() * 12, ph = r() * 6.28, m = r();
    const x = ((x0 + (o.vx ?? -1) * t * sp + Math.sin(t * .3 + ph) * 20) % (W + 200) + W + 200) % (W + 200) - 100, y = y0 + Math.sin(t * .4 + ph) * 16 + (o.vy ?? -.3) * t * sp;
    const yy = ((y % (H + 100)) + H + 100) % (H + 100) - 50;
    ctx.fillStyle = `rgba(${col},${(.08 + .3 * m) * a})`; const z = m > .88 ? 2.2 : 1.2; ctx.fillRect(x, yy, z, z);
  }
  ctx.restore();
}
export function glowSprite(col, R = 256) {
  return once('gs' + col + R, () => { const [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, rgba(col, .9)); rg.addColorStop(.18, rgba(col, .35)); rg.addColorStop(.5, rgba(col, .08)); rg.addColorStop(1, rgba(col, 0)); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .7, g: 1.2, seed: 5 }); return c; });
}
export function bloomAt(ctx, x, y, r, a, col = '#ffb35c') { if (a <= 0 || r <= 0) return; const B = glowSprite(col); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(B, x - r, y - r, r * 2, r * 2); ctx.restore(); }
export function vignette(ctx, a = .55, cx = W * .52, cy = H * .5, col = '4,6,8') {
  const vg = ctx.createRadialGradient(cx, cy, 380, cx, cy, 1250); vg.addColorStop(0, `rgba(${col},0)`); vg.addColorStop(1, `rgba(${col},${a})`); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// =====================================================================================================
// WORLD A · banknote green: the certificate as a dotted ghost, two real fragments (5.07), the rosette (5.08), the rings (5.10)
// =====================================================================================================
export const GREEN_INK = '#1d4436', CREAM = '#f1ead2';
export function groundA() {
  return once('groundA', () => {
    const [c, g] = canvas(W + 900, H + 300);
    const rg = g.createRadialGradient(760, 420, 0, 980, 600, 1700); rg.addColorStop(0, '#1d4537'); rg.addColorStop(.45, '#0f251d'); rg.addColorStop(1, '#050c0a');
    g.fillStyle = rg; g.fillRect(0, 0, c.width, c.height);
    const [p, pg] = canvas(W + 900, H + 300);
    rosette(pg, 1260, 640, { R: 760, A: 64, B: 30, n: 40, m: 13, lines: 70, col: '#d8e8c8', w: .8, a: .07 });
    rosette(pg, 260, 1100, { R: 420, A: 40, B: 18, n: 28, m: 11, lines: 46, col: '#d8e8c8', w: .7, a: .05 });
    pg.strokeStyle = 'rgba(205,228,195,.045)'; pg.lineWidth = 1;
    for (let y = 0; y < c.height; y += 8) { pg.beginPath(); for (let x = 0; x <= c.width; x += 40) { const yy = y + 5 * Math.sin(x * .004 + y * .021); x ? pg.lineTo(x, yy) : pg.moveTo(x, yy); } pg.stroke(); }
    rosette(pg, 2420, 300, { R: 520, A: 50, B: 24, n: 32, m: 11, lines: 52, col: '#d8e8c8', w: .7, a: .055 });
    g.filter = 'blur(2.2px)'; g.drawImage(p, 0, 0); g.filter = 'none';
    const [l, lg] = canvas(W + 900, H + 300), gg = lg.createRadialGradient(420, 140, 0, 420, 140, 1400);
    gg.addColorStop(0, 'rgba(255,206,140,.30)'); gg.addColorStop(.4, 'rgba(255,186,120,.09)'); gg.addColorStop(1, 'rgba(255,186,120,0)'); lg.fillStyle = gg; lg.fillRect(0, 0, l.width, l.height);
    stipple(l, { k: .8, g: 1.2, seed: 12 }); g.globalCompositeOperation = 'lighter'; g.drawImage(l, 0, 0); g.globalCompositeOperation = 'source-over';
    return c;
  });
}
export function fogA() { return once('fogA', () => { const [c, g] = canvas(W + 1700, H); artFog(g, { y0: 60, y1: 1060, col: '#5f8a6c', a: .2, seed: 31, sx: .0019, sy: .005, cover: .5, soft: .4, k: .6, x1: W + 1700 }); return c; }); }
// out-of-focus guilloche arcs in front (fastest plane)
export function dofArcsA() {
  return once('dofA', () => { const [c, g] = canvas(W + 400, H + 200); g.filter = 'blur(8px)'; ring(g, -200, 1240, 760, 760, { lines: 6, band: 50, wave: 64, col: '#efe6c8', glow: '#ffb35c', glowA: .08, a: .38, lw: 2.4, op: 'source-over' }); ring(g, 2250, -180, 560, 560, { lines: 5, band: 40, wave: 58, col: '#efe6c8', glow: null, a: .22, lw: 2.2, op: 'source-over' }); g.filter = 'none'; return c; });
}
export function drawGroundA(ctx, t, px = 0, py = 0, o = {}) {
  const dx = drift(t, 10, 1) - (t - 379) * 3, dy = drift(t, 6, 2);
  ctx.drawImage(groundA(), -200 + (dx + px) * .3, -150 + (dy + py) * .3);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = o.fog ?? .85; ctx.drawImage(fogA(), -200 + (dx + px) * .55 - (t - 379) * 7, (dy + py) * .5); ctx.restore();
}
export function drawFrontA(ctx, t, px = 0, py = 0, a = 1) {
  const dx = drift(t, 10, 1) - (t - 379) * 3, dy = drift(t, 6, 2);
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(dofArcsA(), -200 + (dx + px) * 1.7, -100 + (dy + py) * 1.7); ctx.restore();
  motes(ctx, t, { a: .8 * a, n: 60, seed: 41 });
}

// the certificate's frame in world space (screen px at camera zoom 1): cert units (1500 × 980) → world
export const CW = 1500, CH = 980;
export const CERT = { x: 960, y: 560, s: .8, rot: -.035 };
export function certToWorld(u, v, C = CERT) { const c = Math.cos(C.rot), s = Math.sin(C.rot), x = (u - CW / 2) * C.s, y = (v - CH / 2) * C.s; return [C.x + x * c - y * s, C.y + x * s + y * c]; }
// the dotted ghost of the whole certificate (does not exist yet), cached at 1.5× for push-ins
export function ghostCert() {
  return once('ghostCert', () => {
    const k = 1.5, [c, g] = canvas(Math.round(W * k), Math.round(H * k)); g.scale(k, k);
    certificate(g, 0, { ghost: 1, x: CERT.x, y: CERT.y, s: CERT.s, rot: CERT.rot, ghostCol: '#e8e4c8', ghostW: 1.15, dot: 5.4, title: 'YOUR SHARE' });
    return c;
  });
}
// fragments: torn pieces of a real certificate, in cert units
function torn(x0, y0, x1, y1, seed, amp = 20) { const n = vnoise(seed), r = prng(seed), out = []; for (let i = 0; i <= 56; i++) { const q = i / 56; out.push([mix(x0, x1, q) + (n(q * 7, 3) - .5) * 2 * amp + (n(q * 31, 9) - .5) * 9 + (r() - .5) * 3, mix(y0, y1, q)]); } return out; }
export const FRAG = [
  { poly: [[0, 0], [516, 0], ...torn(516, 0, 472, 980, 11).slice(1, -1), [472, 980], [0, 980]], box: [-12, -12, 560, 1004], motif: [285, 492], seed: 3 },
  { poly: [[1062, 0], [1500, 0], [1500, 980], [1026, 980], ...torn(1026, 980, 1062, 0, 23).slice(1, -1)], box: [990, -12, 522, 1004], motif: [1262, 492], seed: 7 },
];
const FS = 1.7;  // fragment canvas px per cert unit
export const F2RINGS = [70, 128, 186];
export function fragCanvas(i) {
  return once('frag' + i, () => {
    const F = FRAG[i], [bx, by, bw, bh] = F.box, [c, g] = canvas(Math.ceil(bw * FS), Math.ceil(bh * FS)), r = prng(F.seed);
    g.scale(FS, FS); g.translate(-bx, -by);
    g.save(); g.beginPath(); roughPath(g, F.poly, { amp: 1.4, step: 8, seed: F.seed }); g.clip();
    const pg = g.createRadialGradient(F.motif[0] - 80, F.motif[1] - 160, 0, F.motif[0], F.motif[1], 900); pg.addColorStop(0, '#faf3e2'); pg.addColorStop(.6, '#efe6cf'); pg.addColorStop(1, '#d6c6a2');
    g.fillStyle = pg; g.fillRect(bx, by, bw, bh);
    g.lineCap = 'round'; for (let k = 0; k < 1300; k++) { const px = bx + r() * bw, py = by + r() * bh, L = 4 + r() * 20, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(255,252,240,${.2 + r() * .3})` : `rgba(120,95,60,${.07 + r() * .12})`; g.lineWidth = .6; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a0) * L, py + Math.sin(a0) * L); g.stroke(); }
    rosette(g, CW * .5, CH * .5, { R: 330, A: 46, B: 22, n: 34, m: 11, lines: 70, col: '#7a8a5a', w: .4, a: .14 });
    gBorder(g, 22, 22, CW - 44, CH - 44, { band: 46, lines: 11, waves: 150, col: GREEN_INK, w: .8, a: .78, radius: 26 });
    gBorder(g, 82, 82, CW - 164, CH - 164, { band: 16, lines: 5, waves: 260, col: '#8a5a24', w: .6, a: .7, radius: 14 });
    const corners = i === 0 ? [[150, 150], [150, CH - 150]] : [[CW - 150, 150], [CW - 150, CH - 150]];
    for (const [cx, cy] of corners) rosette(g, cx, cy, { R: 46, A: 13, B: 6, n: 14, m: 5, lines: 22, col: GREEN_INK, w: .6, a: .85 });
    const [mx, my] = F.motif;
    if (i === 0) {
      rosette(g, mx, my, { R: 150, A: 24, B: 11, n: 16, m: 7, lines: 44, col: GREEN_INK, w: .62, a: .9 });
      microRing(g, mx, my, 205, 'OPENAI FOUNDATION · 2025', { size: 7, col: GREEN_INK, a: .75 });
      g.strokeStyle = rgba(GREEN_INK, .6); g.lineWidth = 1; g.beginPath(); g.arc(mx, my, 196, 0, TAU); g.stroke(); g.beginPath(); g.arc(mx, my, 214, 0, TAU); g.stroke();
      text(g, 'Nº', 150, 330, { size: 30, font: 'Instrument Serif', color: '#8a3a2a' }); g.strokeStyle = rgba('#8a3a2a', .7); g.beginPath(); g.moveTo(190, 332); g.lineTo(330, 332); g.stroke();
      microtext(g, 120, 760, 360, 'PIECES OF A RULE THAT ALREADY EXIST', { size: 6, col: GREEN_INK, a: .8 });
    } else {
      for (const [k, R] of F2RINGS.entries()) ring(g, mx, my, R, R, { lines: 5, band: 10 + k * 2, wave: 16, col: GREEN_INK, glow: null, op: 'source-over', lineA: 1, a: .32, lw: .7 });
      g.fillStyle = rgba(GREEN_INK, .7); g.beginPath(); g.arc(mx, my, 4, 0, TAU); g.fill();
      microRing(g, mx, my, 214, 'WINDFALL CLAUSE · OXFORD · 2020', { size: 7, col: GREEN_INK, a: .75 });
      microtext(g, 1110, 760, 330, 'THE BIGGER THE PROFIT THE BIGGER THE SHARE', { size: 6, col: GREEN_INK, a: .8 });
    }
    g.restore();
    // the torn edge: a whiter paper core and loose fibres
    const tornPts = i === 0 ? FRAG[0].poly.slice(1, -1) : FRAG[1].poly.slice(3);
    g.strokeStyle = 'rgba(255,253,245,.9)'; g.lineWidth = 2.4; g.lineJoin = 'round'; g.beginPath(); tornPts.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    for (let k = 1; k < tornPts.length; k++) { const [x, y] = tornPts[k]; for (let f = 0; f < 3; f++) { const a0 = (i === 0 ? 0 : Math.PI) + (r() - .5) * 1.4, L = 3 + r() * 9; g.strokeStyle = `rgba(250,244,228,${.5 + r() * .4})`; g.lineWidth = .5; g.beginPath(); g.moveTo(x, y + (r() - .5) * 14); g.lineTo(x + Math.cos(a0) * L, y + Math.sin(a0) * L); g.stroke(); } }
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .22, g: 1, seed: 3 + i, mid: false, boost: 1 });
    return c;
  });
}
export function fragShadow(i) {
  return once('fragsh' + i, () => { const F = FRAG[i], [bx, by, bw, bh] = F.box, k = .5, pad = 60, [c, g] = canvas(Math.ceil((bw + pad * 2) * k), Math.ceil((bh + pad * 2) * k)); g.scale(k, k); g.translate(pad - bx, pad - by); g.filter = 'blur(14px)'; poly(g, F.poly); g.fillStyle = 'rgba(0,0,0,.85)'; g.fill(); g.filter = 'none'; return { c, k, pad }; });
}
// draw fragment i: the certificate frame C (world), then extra lift/offset/rotation about the motif, in the current transform
export function drawFrag(ctx, i, o = {}) {
  const F = FRAG[i], [bx, by, bw, bh] = F.box, C = o.cert || CERT, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.translate(C.x, C.y); ctx.rotate(C.rot); ctx.scale(C.s, C.s); ctx.translate(-CW / 2, -CH / 2);
  const [mx, my] = F.motif; ctx.translate(mx + (o.dx ?? 0), my + (o.dy ?? 0)); ctx.rotate(o.rot ?? 0); ctx.scale(o.k ?? 1, o.k ?? 1); ctx.translate(-mx, -my);
  ctx.globalAlpha = a;
  const S = fragShadow(i), lift = o.lift ?? 1; ctx.save(); ctx.globalAlpha = a * .75; ctx.drawImage(S.c, bx - S.pad + 18 * lift, by - S.pad + 26 * lift, (bw + S.pad * 2), (bh + S.pad * 2)); ctx.restore();
  ctx.drawImage(fragCanvas(i), bx, by, bw, bh);
  if (o.glint) { const p = new Path2D(); F.poly.forEach(([x, y], k) => (k ? p.lineTo(x, y) : p.moveTo(x, y))); p.closePath(); foilGlint(ctx, p, o.glint, { x: bx - 300, y: by + bh * .4, span: bw + 600, width: 160, speed: .5, a: .5, angle: -1.1 }); }
  ctx.restore();
}

// the value rosette as light (cream lines, additive), with a foil wedge (the share) that can lift out and widen
const FOILTEX = () => once('foiltex', () => { const [c, g] = canvas(512, 512), gr = g.createLinearGradient(0, 0, 512, 512); FOIL.forEach((col, i) => gr.addColorStop(i / (FOIL.length - 1), col)); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); const [n, ng] = canvas(512, 512); ng.fillStyle = 'rgba(255,240,200,.4)'; ng.fillRect(0, 0, 512, 512); stipple(n, { k: 1, g: 1.4, seed: 9, mid: false, boost: 1.4 }); g.globalCompositeOperation = 'overlay'; g.drawImage(n, 0, 0); return c; });
export function wedgePath(cx, cy, r0, r1, a0, a1) { const p = new Path2D(), n = Math.max(6, Math.ceil((a1 - a0) * 40)); if (r0 <= .5) p.moveTo(cx, cy); else p.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0); for (let i = 0; i <= n; i++) { const a = mix(a0, a1, i / n); p.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); } if (r0 > .5) for (let i = n; i >= 0; i--) { const a = mix(a0, a1, i / n); p.lineTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); } p.closePath(); return p; }
// a foil sector: foil leaf, engraved concentric lines, dark rim, light band; o.lift adds a drop shadow
export function foilSector(ctx, cx, cy, r0, r1, a0, a1, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || a1 - a0 < .002) return;
  const P = wedgePath(cx, cy, r0, r1, a0, a1);
  ctx.save(); ctx.globalAlpha = a;
  if (o.lift) { ctx.save(); ctx.translate(o.lift * .5, o.lift * .9); ctx.filter = `blur(${Math.max(1, o.lift * .6)}px)`; ctx.fillStyle = `rgba(10,6,2,${o.dark ? .55 : .35})`; ctx.fill(P); ctx.filter = 'none'; ctx.restore(); }
  ctx.save(); ctx.clip(P); const T = FOILTEX(), s = Math.max(r1 * 2.2, 60); ctx.drawImage(T, cx - s / 2, cy - s / 2, s, s);
  ctx.strokeStyle = 'rgba(110,50,12,.55)'; ctx.lineWidth = Math.max(.6, r1 * .004 + .4);
  for (let rr = Math.max(4, r0 + 3); rr < r1; rr += Math.max(3.2, r1 * .022)) { ctx.beginPath(); ctx.arc(cx, cy, rr, a0, a1); ctx.stroke(); }
  if (o.lines) o.lines(ctx);
  ctx.restore();
  foilGlint(ctx, P, t, { x: cx - r1 * 1.6, y: cy, span: r1 * 3.2, width: Math.max(30, r1 * .5), speed: o.glintSpeed ?? .32, phase: o.phase ?? 0, a: .9 });
  ctx.strokeStyle = 'rgba(90,40,8,.9)'; ctx.lineWidth = 1.3; ctx.stroke(P);
  ctx.strokeStyle = 'rgba(255,236,190,.55)'; ctx.lineWidth = .8; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const an = mix(a0, a1, i / 30); const X = cx + Math.cos(an) * (r1 - 1.5), Y = cy + Math.sin(an) * (r1 - 1.5); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke();
  ctx.restore();
}
// a dotted (ghost) sector outline: the part that does not exist yet
export function ghostSector(ctx, cx, cy, r0, r1, a0, a1, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const P = wedgePath(cx, cy, r0, r1, a0, a1);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(o.fill || '#ffb35c', .1); ctx.fill(P);
  ctx.setLineDash([.1, o.dot ?? 6]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(o.col || '#ffd9a0', .95); ctx.lineWidth = o.w ?? 2.2; ctx.stroke(P); ctx.restore();
}

// =====================================================================================================
// WORLD B · the night city from above and the engraved night map
// =====================================================================================================
const CTW = 2400, CTH = 1500;
export function cityTop() {
  return once('cityTop', () => {
    const [c, g] = canvas(CTW, CTH), r = prng(77), n = vnoise(5);
    g.fillStyle = '#04060c'; g.fillRect(0, 0, CTW, CTH);
    const ROT = .16, bs = 118, sw = 20, P = bs + sw;
    const river = (x) => 980 + 0.32 * (x - 1200) + 60 * Math.sin(x * .0026);
    const inRiver = (x, y) => Math.abs(y - river(x)) < 78;
    const T = (gg) => { gg.translate(CTW / 2, CTH / 2); gg.rotate(ROT); gg.translate(-CTW / 2, -CTH / 2); };
    // dark roofs: blocks of buildings in near-black blue, a few lit skylights and roof lamps
    g.save(); T(g);
    for (let gx = -700; gx < CTW + 700; gx += P) for (let gy = -700; gy < CTH + 700; gy += P) {
      if (inRiver(gx + bs / 2, gy + bs / 2)) continue;
      if (r() < .05) { g.fillStyle = '#07110e'; g.fillRect(gx, gy, bs, bs); for (let k = 0; k < 18; k++) { g.fillStyle = `rgba(22,44,36,${.5 + r() * .4})`; g.beginPath(); g.arc(gx + r() * bs, gy + r() * bs, 4 + r() * 8, 0, TAU); g.fill(); } continue; }
      let x = gx; while (x < gx + bs - 8) { const w = 20 + r() * 44; let y = gy; while (y < gy + bs - 8) {
        const h = 20 + r() * 46, ww = Math.min(w, gx + bs - x), hh = Math.min(h, gy + bs - y), tone = 5 + r() * 9 + 5 * n(gx * .002, gy * .002);
        g.fillStyle = `rgb(${tone * .85 | 0},${tone | 0},${tone * 1.5 | 0})`; g.fillRect(x + 1, y + 1, ww - 2, hh - 2);
        g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x + ww - 4, y + 3, 3, hh - 4);
        if (r() < .16) { g.fillStyle = `rgba(255,${200 + r() * 40 | 0},${130 + r() * 60 | 0},${.45 + r() * .45})`; g.fillRect(x + 3 + r() * (ww - 9), y + 3 + r() * (hh - 9), 2.5, 2.5); }
        y += h; } x += w; }
    }
    g.restore();
    // the river: dark water, faint ripples
    g.fillStyle = '#020309'; g.beginPath(); for (let x = -600; x <= CTW + 600; x += 30) g.lineTo(x, river(x) - 62); for (let x = CTW + 600; x >= -600; x -= 30) g.lineTo(x, river(x) + 62); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(150,170,220,.06)'; g.lineWidth = 1; for (let k = 0; k < 9; k++) { g.beginPath(); for (let x = -600; x <= CTW + 600; x += 30) g.lineTo(x, river(x) - 48 + k * 12 + 4 * Math.sin(x * .02 + k)); g.stroke(); }
    // the streets as lines of sodium light (every 4th an avenue, brighter), cars as white and red streaks; blurred glow + sharp core
    const [lc, lg] = canvas(CTW, CTH); T(lg); lg.lineCap = 'round';
    const street = (x0, y0, x1, y1, av) => { const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
      lg.strokeStyle = `rgba(255,160,80,${av ? .34 : .16})`; lg.lineWidth = av ? 7 : 4; lg.beginPath(); let on = false;
      for (let d = 0; d <= L; d += 20) { const x = x0 + ux * d, y = y0 + uy * d; if (inRiver(x, y)) { on = false; continue; } on ? lg.lineTo(x, y) : lg.moveTo(x, y); on = true; } lg.stroke();
      for (let d = 0; d < L; d += 34) { const x = x0 + ux * d, y = y0 + uy * d; if (inRiver(x, y)) continue; const e = 2.6 + (av ? 1.2 : 0);
        lg.fillStyle = `rgba(255,${150 + r() * 50 | 0},70,${(av ? .9 : .6) * (.6 + r() * .4)})`; lg.fillRect(x - uy * sw * .35 - e / 2, y + ux * sw * .35 - e / 2, e, e); lg.fillRect(x + uy * sw * .35 - e / 2, y - ux * sw * .35 - e / 2, e, e); }
      if (av) for (let k = 0; k < L / 60; k++) { const d = r() * L, x = x0 + ux * d, y = y0 + uy * d; if (inRiver(x, y)) continue; const side = r() < .5 ? 1 : -1; lg.strokeStyle = side > 0 ? 'rgba(255,245,225,.85)' : 'rgba(255,70,50,.75)'; lg.lineWidth = 1.6; lg.beginPath(); lg.moveTo(x + uy * side * 3, y - ux * side * 3); lg.lineTo(x + uy * side * 3 + ux * 9, y - ux * side * 3 + uy * 9); lg.stroke(); } };
    let i = 0; for (let gx = -700; gx < CTW + 700; gx += P, i++) street(gx - sw / 2, -700, gx - sw / 2, CTH + 700, i % 4 === 0);
    i = 0; for (let gy = -700; gy < CTH + 700; gy += P, i++) street(-700, gy - sw / 2, CTW + 700, gy - sw / 2, i % 4 === 1);
    const [hc, hg] = canvas(CTW, CTH); hg.filter = 'blur(6px)'; hg.drawImage(lc, 0, 0); hg.drawImage(lc, 0, 0); hg.filter = 'blur(22px)'; hg.drawImage(lc, 0, 0); hg.drawImage(lc, 0, 0); hg.drawImage(lc, 0, 0); hg.filter = 'none';
    g.globalCompositeOperation = 'lighter'; g.drawImage(hc, 0, 0); g.drawImage(lc, 0, 0); g.globalCompositeOperation = 'source-over';
    // cool haze patches for depth
    const [fc, fg] = canvas(CTW, CTH); for (let k = 0; k < 30; k++) { const x = r() * CTW, y = r() * CTH, R = 160 + r() * 280, gr = fg.createRadialGradient(x, y, 0, x, y, R); gr.addColorStop(0, 'rgba(70,90,140,.08)'); gr.addColorStop(1, 'rgba(70,90,140,0)'); fg.fillStyle = gr; fg.fillRect(x - R, y - R, R * 2, R * 2); }
    g.globalCompositeOperation = 'lighter'; g.drawImage(fc, 0, 0); g.globalCompositeOperation = 'source-over';
    // soft edge so the city melts into the map when it shrinks
    stipple(c, { k: .18, g: 1, seed: 9, mid: false, boost: 1 });
    // elliptical mask: zero alpha on all four edges (a round mask left the top and bottom edges at half alpha: a visible box)
    const eg = g.createRadialGradient(0, 0, CTW * .5 * .42, 0, 0, CTW * .5 * .99); eg.addColorStop(0, 'rgba(0,0,0,1)'); eg.addColorStop(1, 'rgba(0,0,0,0)');
    g.save(); g.globalCompositeOperation = 'destination-in'; g.translate(CTW / 2, CTH / 2); g.scale(1, CTH / CTW); g.fillStyle = eg; g.fillRect(-CTW / 2, -CTW / 2, CTW, CTW); g.restore();
    return c;
  });
}
export const CITY = { w: CTW, h: CTH };
// little phone screens lighting up in the streets as the cheer passes (city px; per frame, cheap)
const PHONES = (() => { const r = prng(91), out = []; for (let i = 0; i < 420; i++) out.push([r() * CTW, r() * CTH, r()]); return out; })();
export function cityCheer(ctx, t, t0, cx, cy, k, a = 1) {   // k = city px → screen; cx,cy screen of the city centre
  if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, m] of PHONES) { const d = Math.hypot(x - CTW / 2, y - CTH / 2), arrive = t0 + d / 520; const on = clamp((t - arrive) / .25) * (1 - clamp((t - arrive - 1.6 - m) / .8)); if (on <= 0) continue; const sx = cx + (x - CTW / 2) * k, sy = cy + (y - CTH / 2) * k; if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue; ctx.fillStyle = `rgba(255,${214 + m * 30 | 0},170,${.85 * on * a})`; const z = Math.max(1.2, 3.2 * k); ctx.fillRect(sx - z / 2, sy - z / 2, z, z); }
  ctx.restore();
}

// the engraved night map (Equal Earth): land as fine engraved lines on deep night blue, the one country in amber
export const MAPV = { K: 640, cx: -.62, cy: .64, sy: .94 };       // view: Equal Earth units at screen centre, px per unit
const MPAD = 900, MW = W + MPAD * 2, MH = H + MPAD * 2;
export function mapXY(lon, lat) { const [ex, ey] = ll(lon, lat); return [W / 2 + (ex - MAPV.cx) * MAPV.K, H / 2 - (ey - MAPV.cy) * MAPV.K * MAPV.sy]; }
function usaRings(all = false) { const c = country('USA', '110m'); return c.polys.filter((p) => all ? (p[0][0][0] < 0 && !(p[0][0][1] < 25 && p[0][0][0] < -150)) : (p[0][0][0] > -130 && p[0][0][1] < 50)).map((p) => p[0]); }   // all: with Alaska (the amber layer)
export function usaBorder() { return once('usaBorder', () => { const R = usaRings().sort((a, b) => b.length - a.length)[0]; const pts = R.map(([lon, lat]) => mapXY(lon, lat)); pts.push(pts[0]); return pts; }); }
export function nightMap() {
  return once('nightMap', () => {
    const [c, g] = canvas(MW, MH), r = prng(5); g.translate(MPAD, MPAD);
    const bg = g.createRadialGradient(W * .4, H * .45, 0, W * .5, H * .5, 1900); bg.addColorStop(0, '#0e1a2e'); bg.addColorStop(.6, '#09111f'); bg.addColorStop(1, '#04070d');
    g.fillStyle = bg; g.fillRect(-MPAD, -MPAD, MW, MH);
    // sea: faint ruled waterlines
    g.strokeStyle = 'rgba(120,150,190,.07)'; g.lineWidth = 1; for (let y = -MPAD; y < H + MPAD; y += 7) { g.beginPath(); g.moveTo(-MPAD, y); g.lineTo(W + MPAD, y); g.stroke(); }
    // graticule, dotted
    g.save(); g.setLineDash([1.5, 6]); g.strokeStyle = 'rgba(160,185,220,.16)'; g.lineWidth = 1;
    for (let lon = -180; lon <= 180; lon += 15) { g.beginPath(); for (let lat = -80; lat <= 85; lat += 5) { const [x, y] = mapXY(lon, lat); lat === -80 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    for (let lat = -60; lat <= 75; lat += 15) { g.beginPath(); for (let lon = -180; lon <= 180; lon += 5) { const [x, y] = mapXY(lon, lat); lon === -180 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    g.restore();
    // land path (all countries)
    const land = new Path2D(), all = countryAll(); for (const cn of all) for (const p of cn.polys) for (const ring0 of p.slice(0, 1)) { let prev = null; ring0.forEach(([lon, lat], k) => { if (prev !== null && Math.abs(lon - prev) > 180) { land.closePath(); } const [x, y] = mapXY(lon, lat); (k === 0 || (prev !== null && Math.abs(lon - prev) > 180)) ? land.moveTo(x, y) : land.lineTo(x, y); prev = lon; }); land.closePath(); }
    // engraved land: horizontal lines, slightly wavy, steel blue
    g.save(); g.clip(land); g.fillStyle = 'rgba(40,58,86,.55)'; g.fillRect(-MPAD, -MPAD, MW, MH);
    g.strokeStyle = 'rgba(150,175,210,.30)'; g.lineWidth = .9;
    for (let y = -MPAD; y < H + MPAD; y += 3.4) { g.beginPath(); for (let x = -MPAD; x <= W + MPAD; x += 30) { const yy = y + .8 * Math.sin(x * .03 + y * .1); x === -MPAD ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
    g.restore();
    g.strokeStyle = 'rgba(170,195,230,.55)'; g.lineWidth = 1.1; g.lineJoin = 'round'; g.stroke(land);
    // borders, dotted
    g.save(); g.setLineDash([2, 3]); g.strokeStyle = 'rgba(170,195,230,.22)'; g.lineWidth = .8; g.stroke(bordersPath()); g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .2, g: 1, seed: 8, mid: false, boost: 1 });
    return c;
  });
}
function countryAll() { return once('countriesAll', () => { const out = []; for (let id = 0; id < 1000; id++) { const cc = country(String(id).padStart(3, '0')); if (cc) out.push(cc); } for (const nm of ['Kosovo', 'N. Cyprus', 'Somaliland']) { const cc = country(nm); if (cc && !out.includes(cc)) out.push(cc); } return out; }); }
function bordersPath() {
  const p = new Path2D(); for (const cn of countryAll()) for (const poly0 of cn.polys) { const ring0 = poly0[0]; let prev = null; ring0.forEach(([lon, lat], k) => { const [x, y] = mapXY(lon, lat); (k === 0 || (prev !== null && Math.abs(lon - prev) > 180)) ? p.moveTo(x, y) : p.lineTo(x, y); prev = lon; }); }
  return p;
}
// the one country: amber engraved lines + a glow (cached, drawn with an alpha per frame)
export function usaLayer() {
  return once('usaLayer', () => {
    const [c, g] = canvas(MW, MH); g.translate(MPAD, MPAD);
    const P = new Path2D(); for (const R of usaRings(true)) { R.forEach(([lon, lat], k) => { const [x, y] = mapXY(lon, lat); k ? P.lineTo(x, y) : P.moveTo(x, y); }); P.closePath(); }
    g.save(); g.clip(P); g.fillStyle = 'rgba(255,150,60,.2)'; g.fillRect(-MPAD, -MPAD, MW, MH);
    g.strokeStyle = 'rgba(255,190,110,.62)'; g.lineWidth = 1.1;
    for (let y = 0; y < H; y += 4.2) { g.beginPath(); for (let x = 0; x <= W; x += 30) { const yy = y + .6 * Math.sin(x * .02 + y * .05); x === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
    g.restore();
    const [gc, gg] = canvas(MW, MH); gg.translate(MPAD, MPAD); gg.filter = 'blur(26px)'; gg.fillStyle = 'rgba(255,150,60,.5)'; gg.fill(P); gg.filter = 'none'; gg.setTransform(1, 0, 0, 1, 0, 0); stipple(gc, { k: .3, g: 1.2, seed: 4 });
    const [out, og] = canvas(MW, MH); og.globalCompositeOperation = 'lighter'; og.drawImage(gc, 0, 0); og.drawImage(c, 0, 0);
    return out;
  });
}
export function drawMapLayer(ctx, L, sx, sy, k, a = 1) {   // map px (screen at view) → scaled by k about screen point (sx, sy) which shows map point (sx0, sy0)
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.drawImage(L, sx - (MPAD) * k, sy - (MPAD) * k, MW * k, MH * k); ctx.restore();
}
export const MAP = { pad: MPAD, w: MW, h: MH };

// =====================================================================================================
// WORLD C · the harvest: table, fund, Swiss map, letters, statement, quote card
// =====================================================================================================
export function tableWarm(key = 'tableWarm', base = ['#2a1d16', '#1a120e', '#0b0807'], lamp = [1500, 60]) {
  return once(key, () => {
    const [c, g] = canvas(W + 400, H + 300), r = prng(17), n = vnoise(3);
    const bg = g.createRadialGradient(lamp[0], lamp[1] + 200, 0, lamp[0], lamp[1] + 200, 1900); bg.addColorStop(0, base[0]); bg.addColorStop(.55, base[1]); bg.addColorStop(1, base[2]); g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
    g.lineCap = 'round';
    for (let i = 0; i < 360; i++) { const y = r() * c.height, a = .04 + r() * .08; g.strokeStyle = r() < .5 ? `rgba(140,96,64,${a})` : `rgba(0,0,0,${a * 1.4})`; g.lineWidth = .6 + r() * 2; g.beginPath(); for (let x = -20; x <= c.width + 20; x += 40) { const yy = y + 7 * Math.sin(x * .004 + i) + 6 * (n(x * .006, i * .3) - .5); x < 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
    const [l, lg] = canvas(W + 400, H + 300), lgr = lg.createRadialGradient(lamp[0], lamp[1] + 160, 0, lamp[0], lamp[1] + 160, 1500); lgr.addColorStop(0, 'rgba(255,190,120,.32)'); lgr.addColorStop(.45, 'rgba(255,160,90,.1)'); lgr.addColorStop(1, 'rgba(255,160,90,0)'); lg.fillStyle = lgr; lg.fillRect(0, 0, l.width, l.height);
    stipple(l, { k: .8, g: 1.2, seed: 21 }); g.globalCompositeOperation = 'lighter'; g.drawImage(l, 0, 0);
    return c;
  });
}
// Swiss morning: pale sky, a soft range of snowy mountains far away (out of focus), haze
export function swissMorning() {
  return once('swissMorning', () => {
    const [c, g] = canvas(W + 300, H + 200), r = prng(33), n = vnoise(12);
    const sk = g.createLinearGradient(0, 0, 0, c.height); sk.addColorStop(0, '#9cb6d6'); sk.addColorStop(.45, '#d6e1ee'); sk.addColorStop(.62, '#eef1f4'); sk.addColorStop(1, '#c4d0de'); g.fillStyle = sk; g.fillRect(0, 0, c.width, c.height);
    const sun = g.createRadialGradient(1700, 260, 0, 1700, 260, 900); sun.addColorStop(0, 'rgba(255,236,200,.75)'); sun.addColorStop(.3, 'rgba(255,226,180,.25)'); sun.addColorStop(1, 'rgba(255,226,180,0)'); g.fillStyle = sun; g.fillRect(0, 0, c.width, c.height);
    const [m, mg] = canvas(W + 300, H + 200);
    const ridge = (y0, amp, f, col, snow, seed) => { const nn = vnoise(seed); mg.beginPath(); mg.moveTo(0, c.height); for (let x = 0; x <= c.width; x += 8) { const y = y0 - amp * Math.pow(fbm(nn, x * f, 1.3, 4), 1.6) * 2.2; mg.lineTo(x, y); } mg.lineTo(c.width, c.height); mg.closePath(); mg.fillStyle = col; mg.fill();
      if (snow) { mg.save(); mg.clip(); const sg = mg.createLinearGradient(0, y0 - amp * 1.5, 0, y0 - amp * .2); sg.addColorStop(0, 'rgba(246,249,253,.9)'); sg.addColorStop(.55, 'rgba(236,242,250,.35)'); sg.addColorStop(1, 'rgba(236,242,250,0)'); mg.fillStyle = sg; mg.fillRect(0, 0, c.width, c.height); mg.restore(); } };
    ridge(700, 330, .0016, '#8ea6c4', true, 4); ridge(780, 220, .0026, '#7d97b8', true, 9); ridge(880, 120, .004, '#6f87a6', false, 15);
    g.filter = 'blur(9px)'; g.drawImage(m, 0, 0); g.filter = 'none';
    const hz = g.createLinearGradient(0, 600, 0, 1000); hz.addColorStop(0, 'rgba(238,242,246,0)'); hz.addColorStop(.5, 'rgba(238,242,246,.55)'); hz.addColorStop(1, 'rgba(220,228,238,.8)'); g.fillStyle = hz; g.fillRect(0, 600, c.width, 500);
    for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(255,255,255,${r() * .08})`; g.fillRect(r() * c.width, r() * c.height, 1.4, 1.4); }
    void n; return c;
  });
}
export function swissFog() { return once('swissFog', () => { const [c, g] = canvas(W + 400, H); artFog(g, { y0: 520, y1: 1000, col: '#f4f6fa', a: .5, seed: 13, sx: .0018, sy: .008, cover: .55, soft: .4, k: .5, x1: W + 400 }); return c; }); }

// a refund letter (sheet units: 380 × 500), the same layout for everyone; mark 0..1 = the amber line sweeps over the refund
export function refundLetter(g, w, h, o = {}) {
  const ink = '#26354f', t = o.t ?? 0;
  g.fillStyle = rgba(ink, .9); g.beginPath(); g.arc(46, 52, 15, 0, TAU); g.fill(); g.strokeStyle = '#f5f2ea'; g.lineWidth = 3; g.beginPath(); g.moveTo(46, 43); g.lineTo(46, 61); g.moveTo(37, 52); g.lineTo(55, 52); g.stroke();
  text(g, 'HEALTH INSURANCE', 72, 50, { size: 13, weight: 600, color: ink, spacing: 2.6 });
  text(g, 'PREMIUM STATEMENT 2026', 72, 68, { size: 9.5, weight: 500, color: rgba(ink, .7), spacing: 1.6 });
  g.strokeStyle = rgba(ink, .25); g.lineWidth = 1; g.beginPath(); g.moveTo(30, 92); g.lineTo(w - 30, 92); g.stroke();
  for (let k = 0; k < 3; k++) { g.strokeStyle = rgba(ink, .35); g.lineWidth = 1.2; const y = 122 + k * 22; g.beginPath(); for (let x = 32; x < 32 + 120 + (k * 37 % 50); x += 6) g.lineTo(x, y + Math.sin(x * .7 + k) * 1.5); g.stroke(); }
  const rows = [['Basic premium', 140], ['Deductible', 60]];
  rows.forEach(([lab], k) => { const y = 228 + k * 34; text(g, lab, 32, y, { size: 13, weight: 500, color: rgba(ink, .75) }); g.strokeStyle = rgba(ink, .45); g.lineWidth = 1.2; g.beginPath(); for (let x = w - 120; x < w - 40; x += 5) g.lineTo(x, y - 4 + Math.sin(x * .9 + k) * 2); g.stroke(); });
  const ry = 318, mk = clamp(o.mark ?? 0);
  if (mk > 0) { g.save(); g.globalAlpha = .85; const mg = g.createLinearGradient(24, 0, w - 24, 0); mg.addColorStop(0, 'rgba(255,190,100,.75)'); mg.addColorStop(1, 'rgba(255,170,80,.6)'); g.fillStyle = mg; g.beginPath(); g.roundRect(22, ry - 24, (w - 44) * mk, 34, 6); g.fill(); g.restore(); }
  text(g, 'CO2 levy refund', 32, ry, { size: 15, weight: 600, color: ink });
  text(g, '− CHF 61.80', w - 32, ry + 1, { size: 24, font: 'Instrument Serif', color: ink, align: 'right' });
  g.strokeStyle = rgba(ink, .3); g.lineWidth = 1; g.beginPath(); g.moveTo(30, ry + 30); g.lineTo(w - 30, ry + 30); g.stroke();
  text(g, 'Total', 32, ry + 66, { size: 13, weight: 600, color: rgba(ink, .8) });
  g.strokeStyle = rgba(ink, .5); g.lineWidth = 1.4; g.beginPath(); for (let x = w - 110; x < w - 40; x += 5) g.lineTo(x, ry + 62 + Math.sin(x * .8) * 2); g.stroke();
  g.strokeStyle = rgba(ink, .22); g.lineWidth = 1; for (let k = 0; k < 3; k++) { const y = 430 + k * 16; g.beginPath(); for (let x = 32; x < w - 60 - k * 40; x += 7) g.lineTo(x, y + Math.sin(x * .5 + k) * 1.2); g.stroke(); }
  void t;
  return { lineY: ry - 7 };
}

// ---------- the Swiss paper map (6.03): Switzerland and its neighbours, engraved, lying on a table ----------
export const SWISS = { lon0: 8.25, lat0: 46.75, K: 118 };   // px per degree (latitude), map px
export function swissXY(lon, lat) { return [(lon - SWISS.lon0) * Math.cos(SWISS.lat0 * Math.PI / 180) * SWISS.K, -(lat - SWISS.lat0) * SWISS.K]; }
const SWN = [['756', 'CHE'], ['250', 'FRANCE'], ['276', 'GERMANY'], ['380', 'ITALY'], ['040', 'AUSTRIA'], ['438', ''], ['705', 'SLOVENIA'], ['203', 'CZECHIA'], ['056', ''], ['442', ''], ['528', ''], ['191', '']];
function swissPath(id) { const c = country(id, '50m'); const p = new Path2D(); if (!c) return p; for (const poly0 of c.polys) { const r = poly0[0]; r.forEach(([lon, lat], k) => { const [x, y] = swissXY(lon, lat); k ? p.lineTo(x, y) : p.moveTo(x, y); }); p.closePath(); } return p; }
export const SWM = { w: 2600, h: 1900 };   // map sheet canvas, centred on Switzerland (map px 0,0 at its centre)
export function swissSheet() {
  return once('swissSheet', () => {
    const [c, g] = canvas(SWM.w, SWM.h), r = prng(19); g.translate(SWM.w / 2, SWM.h / 2);
    const pg = g.createRadialGradient(300, -500, 0, 0, 0, 1700); pg.addColorStop(0, '#f7f8fa'); pg.addColorStop(.6, '#e7ecf2'); pg.addColorStop(1, '#bfcad8'); g.fillStyle = pg; g.fillRect(-SWM.w / 2, -SWM.h / 2, SWM.w, SWM.h);
    // ruled sea/plain lines (engraved), very light
    g.strokeStyle = 'rgba(70,100,140,.10)'; g.lineWidth = 1; for (let y = -SWM.h / 2; y < SWM.h / 2; y += 5) { g.beginPath(); g.moveTo(-SWM.w / 2, y); g.lineTo(SWM.w / 2, y); g.stroke(); }
    const ink = '#3b5577';
    for (const [id, name] of SWN) {
      const P = swissPath(id); const isC = id === '756';
      g.fillStyle = isC ? '#f4f6f9' : '#dfe6ee'; g.fill(P);
      g.save(); g.clip(P); g.strokeStyle = rgba(ink, isC ? .10 : .16); g.lineWidth = .9; for (let y = -SWM.h / 2; y < SWM.h / 2; y += 4.2) { g.beginPath(); g.moveTo(-SWM.w / 2, y + 2); g.lineTo(SWM.w / 2, y - 6); g.stroke(); } g.restore();
      void name;
    }
    // the Alps: relief hatching in a band across the south (short strokes falling away from ridgelines)
    { const n = vnoise(4);
      g.strokeStyle = rgba(ink, .22); g.lineWidth = .8;
      for (let k = 0; k < 2400; k++) { const lon = 5.6 + r() * 9.4, lat = 45.6 + r() * 1.9, ridge = 46.35 + .45 * Math.sin(lon * 1.3) + .15 * n(lon, 2); if (Math.abs(lat - ridge) > .55 * (.6 + .8 * n(lon * 2, lat * 2))) continue; const [x, y] = swissXY(lon, lat), L = 3 + r() * 7, side = lat > ridge ? -1 : 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + L * .35, y + side * L); g.stroke(); } }
    // borders: dashed; Switzerland's border solid ink
    for (const [id] of SWN) { const P = swissPath(id); g.save(); if (id !== '756') { g.setLineDash([5, 4]); g.strokeStyle = rgba(ink, .45); g.lineWidth = 1.1; } else { g.strokeStyle = rgba(ink, .9); g.lineWidth = 1.8; } g.stroke(P); g.restore(); }
    // country names in small caps
    for (const [id, name, lon, lat] of [['250', 'FRANCE', 5.4, 47.6], ['276', 'GERMANY', 9.6, 48.35], ['380', 'ITALY', 9.6, 45.55], ['040', 'AUSTRIA', 11.6, 47.25]]) { const [x, y] = swissXY(lon, lat); text(g, name, x, y, { size: 22, weight: 600, color: rgba(ink, .55), spacing: 7, align: 'center' }); void id; }
    // graticule
    g.save(); g.setLineDash([2, 6]); g.strokeStyle = rgba(ink, .25); g.lineWidth = 1; for (let lon = 4; lon <= 13; lon += 1) { const [x0, y0] = swissXY(lon, 44.5), [x1, y1] = swissXY(lon, 49.5); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); } for (let lat = 45; lat <= 49; lat += 1) { const [x0, y0] = swissXY(3, lat), [x1, y1] = swissXY(14, lat); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); } g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(0, 0, SWM.w, SWM.h); fibreFill(g, .45);
    stipple(c, { k: .15, g: 1, seed: 6, mid: false, boost: 1 });
    return c;
  });
}
export function swissCH() { return once('swissCH', () => swissPath('756')); }
export function swissCentroid() { return swissXY(8.23, 46.8); }
