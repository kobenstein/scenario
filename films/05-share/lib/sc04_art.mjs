// C4 helpers (§2 PRINT and AGREE): the engraved banknote and the uncut sheet, the government check, the loaf on the shelf,
// the minting die and the coin of light, plates, chips and labels. Everything cached where static; per frame only transforms and glints.
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, lin, sm, eout, prng, canvas, drift, text, addGlow } from '../engine.mjs';
import { stipple, vnoise, fbm, hatch as artHatch } from './art.mjs';
import { rosette, gBorder, microtext, guilloche, ring, seal } from './certificate.mjs';
import { scribble } from './paper.mjs';

const CACHE = new Map(); export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
export const TAU = Math.PI * 2;
export const VERD = '#3fae9a', VERD_D = '#1d5f53', VERD_L = '#bfe8dc', INDIGO = '#0b0f2a', CREAM = '#f3efe2', AMBER = '#ffb35c', RUST = '#c4512e', INK = '#1f2a3a';
export const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 4);          // expo-ish out for landings
export const easeIn = (x) => Math.pow(clamp(x), 3.2);
export const easeIO = (x) => { x = clamp(x); return x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out

// ---------- plates (backgrounds) ----------
// a dark engraved plate: indigo, a verdigris (or other) hero light, faint rosette field, stipple
export function plate(key, { light = [1300, 300], col = VERD, base = '#0e1434', deep = '#04050f', ros = true, w = W + 300, h = H + 200 } = {}) {
  return once('plate' + key, () => {
    const [c, g] = canvas(w, h);
    const bg = g.createRadialGradient(light[0], light[1], 0, light[0], light[1], 1600); bg.addColorStop(0, base); bg.addColorStop(.55, mixHex(base, deep, .6)); bg.addColorStop(1, deep);
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    const lg = g.createRadialGradient(light[0], light[1], 0, light[0], light[1], 900); lg.addColorStop(0, rgba(col, .2)); lg.addColorStop(.4, rgba(col, .06)); lg.addColorStop(1, rgba(col, 0));
    g.fillStyle = lg; g.fillRect(0, 0, w, h);
    if (ros) { const [p, pg] = canvas(w, h); rosette(pg, w * .7, h * .45, { R: 640, A: 56, B: 24, n: 44, m: 13, lines: 60, col: '#b9c8e6', w: .6, a: .05 }); rosette(pg, w * .12, h * .9, { R: 330, A: 36, B: 16, n: 28, m: 9, lines: 36, col: '#b9c8e6', w: .5, a: .045 }); g.filter = 'blur(1.6px)'; g.drawImage(p, 0, 0); g.filter = 'none'; }
    stipple(c, { k: .45, g: 1, seed: 19, mid: false, boost: 1 });
    return c;
  });
}
// soft verdigris/amber light bloom sprite (stippled)
export function bloomSprite(key, col, R = 400, a = .5) {
  return once('bl' + key + R, () => { const [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, rgba('#fff1d6', a)); rg.addColorStop(.12, rgba(col, a * .55)); rg.addColorStop(.45, rgba(col, a * .14)); rg.addColorStop(1, rgba(col, 0)); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .85, g: 1.2, seed: R, boost: 2 }); return c; });
}
export function putBloom(ctx, B, x, y, s = 1, a = 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(B, x - B.width * s / 2, y - B.height * s / 2, B.width * s, B.height * s); ctx.restore(); }
// floating motes in a light
export function motes(ctx, t, cx, cy, R, a = 1, seed = 3, col = '255,226,190') {
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 70; i++) { const ang = r() * TAU, d = R * (.15 + r() * .85), sp = .2 + r() * .5, x = cx + Math.cos(ang) * d + Math.sin(t * sp + i) * 20, y = cy + Math.sin(ang) * d * .7 + Math.cos(t * sp * .8 + i * 1.7) * 14 - (t * 8 % 40); const f = Math.max(0, 1 - d / R); ctx.fillStyle = `rgba(${col},${(.1 + .4 * r()) * f * a})`; const z = r() < .8 ? 1.3 : 2.3; ctx.fillRect(x, y, z, z); }
  ctx.restore();
}

// ---------- the banknote (own design: guilloche border, rosette, engraved oval with a sunrise over furrows, microtext) ----------
export const NW = 460, NH = 210;
export function noteSprite(ink = '#1d5f53', paper = '#ebe4cf', key = 'v') {
  return once('note' + key, () => {
    const [c, g] = canvas(NW, NH), r = prng(9);
    g.fillStyle = paper; g.fillRect(0, 0, NW, NH);
    const pg = g.createRadialGradient(NW * .6, NH * .4, 0, NW * .5, NH * .5, NW * .7); pg.addColorStop(0, 'rgba(255,252,240,.5)'); pg.addColorStop(1, 'rgba(120,100,70,.12)'); g.fillStyle = pg; g.fillRect(0, 0, NW, NH);
    for (let i = 0; i < 260; i++) { g.strokeStyle = r() < .5 ? 'rgba(255,252,240,.35)' : 'rgba(110,90,60,.12)'; g.lineWidth = .5; const x = r() * NW, y = r() * NH, a = r() * TAU, L = 3 + r() * 12; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
    rosette(g, NW * .5, NH * .5, { R: 120, A: 22, B: 10, n: 22, m: 9, lines: 40, col: ink, w: .35, a: .22 });
    gBorder(g, 6, 6, NW - 12, NH - 12, { band: 16, lines: 6, waves: 70, col: ink, w: .55, a: .85, radius: 10 });
    rosette(g, 82, NH / 2, { R: 40, A: 11, B: 5, n: 14, m: 5, lines: 22, col: ink, w: .55, a: .9 });
    rosette(g, NW - 82, NH / 2, { R: 34, A: 9, B: 4, n: 12, m: 5, lines: 18, col: ink, w: .5, a: .8 });
    // the oval vignette: sun over furrows, engraved lines
    const ox = NW / 2, oy = NH / 2 + 4, rx = 78, ry = 52;
    g.save(); g.beginPath(); g.ellipse(ox, oy, rx, ry, 0, 0, TAU); g.clip();
    g.strokeStyle = ink; for (let y = oy - ry; y < oy + ry; y += 2.6) { const hz = oy + 8, t0 = y > hz ? .5 + (y - hz) / ry * .7 : Math.min(1, Math.abs(Math.hypot(0, y - hz)) / 70) * .7; g.lineWidth = t0 * 1.4; g.globalAlpha = .9; g.beginPath(); for (let x = ox - rx; x <= ox + rx; x += 6) { const yy = y > hz ? y + Math.sin(x * .09 + y * .2) * 1.2 : y; x === ox - rx ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
    g.globalAlpha = 1; g.fillStyle = '#ebe4cf'; g.beginPath(); g.arc(ox + 14, oy + 8, 16, Math.PI, TAU); g.fill();
    g.strokeStyle = rgba(ink, .8); g.lineWidth = .7; for (let i = 0; i < 14; i++) { const a = Math.PI + i / 13 * Math.PI; g.beginPath(); g.moveTo(ox + 14 + Math.cos(a) * 20, oy + 8 + Math.sin(a) * 20); g.lineTo(ox + 14 + Math.cos(a) * 34, oy + 8 + Math.sin(a) * 34); g.stroke(); }
    g.restore();
    g.strokeStyle = ink; g.lineWidth = 1.2; g.beginPath(); g.ellipse(ox, oy, rx + 4, ry + 4, 0, 0, TAU); g.stroke(); g.lineWidth = .5; g.beginPath(); g.ellipse(ox, oy, rx + 8, ry + 8, 0, 0, TAU); g.stroke();
    microtext(g, 140, 30, NW - 280, 'NEW MONEY FOR EVERYONE', { size: 5.5, col: ink, a: .85 });
    microtext(g, 140, NH - 30, NW - 280, 'PRINTED NOT OWNED', { size: 5.5, col: ink, a: .85 });
    text(g, 'NEW MONEY', NW / 2, 52, { size: 15, weight: 600, color: ink, align: 'center', spacing: 5 });
    stipple(c, { k: .2, g: 1, seed: 4, mid: false, boost: 1 });
    return c;
  });
}
// the uncut sheet: cols × rows notes with gutters and crop marks
export function sheetSprite(cols = 3, rows = 2) {
  return once('sheet' + cols + rows, () => {
    const gx = 26, gy = 26, w = cols * NW + (cols + 1) * gx, h = rows * NH + (rows + 1) * gy, [c, g] = canvas(w, h), N = noteSprite();
    g.fillStyle = '#efe8d4'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) g.drawImage(N, gx + i * (NW + gx), gy + j * (NH + gy));
    g.strokeStyle = 'rgba(31,42,58,.5)'; g.lineWidth = 1;
    for (let i = 0; i <= cols; i++) { const x = gx / 2 + i * (NW + gx); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 10); g.moveTo(x, h - 10); g.lineTo(x, h); g.stroke(); }
    for (let j = 0; j <= rows; j++) { const y = gy / 2 + j * (NH + gy); g.beginPath(); g.moveTo(0, y); g.lineTo(10, y); g.moveTo(w - 10, y); g.lineTo(w, y); g.stroke(); }
    return c;
  });
}

// ---------- the government check (no real agency; payee and amount as unreadable scribble) ----------
export const CKW = 560, CKH = 240;
export function checkSprite(seed = 1) {
  return once('check' + seed, () => {
    const [c, g] = canvas(CKW, CKH), ink = '#21485a', r = prng(seed * 7 + 1);
    const pg = g.createLinearGradient(0, 0, CKW, CKH); pg.addColorStop(0, '#e9efe8'); pg.addColorStop(1, '#d6e0d6'); g.fillStyle = pg; g.fillRect(0, 0, CKW, CKH);
    // safety background: fine wavy lines
    g.strokeStyle = rgba('#5fa595', .28); g.lineWidth = .6; for (let y = 6; y < CKH; y += 5) { g.beginPath(); for (let x = 0; x <= CKW; x += 8) g.lineTo(x, y + Math.sin(x * .05 + y * .3) * 1.6); g.stroke(); }
    gBorder(g, 4, 4, CKW - 8, CKH - 8, { band: 12, lines: 4, waves: 90, col: ink, w: .5, a: .8, radius: 6 });
    seal(g, 72, 78, 40, 0, { foil: false, label: 'GOVERNMENT · CHECK · FOR EVERYONE', emblem: 'none' });
    text(g, 'GOVERNMENT CHECK', 128, 52, { size: 15, weight: 600, color: ink, spacing: 4 });
    microtext(g, 128, 66, 240, 'UNIVERSAL INCOME', { size: 5, col: ink, a: .8 });
    text(g, 'PAY TO THE', 30, 150, { size: 10, weight: 600, color: ink, spacing: 2 }); text(g, 'ORDER OF', 30, 163, { size: 10, weight: 600, color: ink, spacing: 2 });
    g.strokeStyle = rgba(ink, .7); g.lineWidth = 1; g.beginPath(); g.moveTo(105, 166); g.lineTo(390, 166); g.stroke();
    scribble(g, 115, 160, 200 + r() * 60, 13, { seed: seed * 3 + 2, ink: '#1b2a6b', lw: 1.6 });
    g.strokeStyle = rgba(ink, .8); g.lineWidth = 1.2; g.strokeRect(410, 128, 120, 40); scribble(g, 422, 155, 80, 12, { seed: seed + 11, ink: '#1b2a6b', lw: 1.5 });
    g.beginPath(); g.moveTo(330, 212); g.lineTo(530, 212); g.stroke(); scribble(g, 345, 206, 140, 12, { seed: seed + 5, ink: '#1b2a6b', lw: 1.4 });
    stipple(c, { k: .15, g: 1, seed: 6, mid: false, boost: 1 });
    return c;
  });
}

// ---------- chips and labels ----------
export function chip(ctx, x, y, label, { a = 1, check = 0, col = VERD, size = 22, cross = 0 } = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = `600 ${size}px Inter`; try { ctx.letterSpacing = '3px'; } catch { }
  const tw = ctx.measureText(label.toUpperCase()).width, pad = 22, icon = (check || cross) ? size * 1.5 : 0, w = tw + pad * 2 + icon, h = size * 2.1;
  ctx.fillStyle = 'rgba(8,10,26,.72)'; ctx.beginPath(); ctx.roundRect(x, y - h / 2, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = CREAM; ctx.textBaseline = 'middle'; ctx.fillText(label.toUpperCase(), x + pad + icon, y + 1);
  if (check) { const u = clamp(check), cx = x + pad + size * .45, cy = y; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); const p1 = [cx - size * .4, cy], p2 = [cx - size * .1, cy + size * .32], p3 = [cx + size * .45, cy - size * .38]; ctx.moveTo(...p1); if (u < .4) ctx.lineTo(mix(p1[0], p2[0], u / .4), mix(p1[1], p2[1], u / .4)); else { ctx.lineTo(...p2); ctx.lineTo(mix(p2[0], p3[0], (u - .4) / .6), mix(p2[1], p3[1], (u - .4) / .6)); } ctx.stroke(); }
  if (cross) { const u = clamp(cross), cx = x + pad + size * .45, cy = y, q = size * .36; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - q, cy - q); ctx.lineTo(cx - q + 2 * q * Math.min(1, u * 2), cy - q + 2 * q * Math.min(1, u * 2)); if (u > .5) { ctx.moveTo(cx + q, cy - q); ctx.lineTo(cx + q - 2 * q * (u - .5) * 2, cy - q + 2 * q * (u - .5) * 2); } ctx.stroke(); }
  ctx.restore(); return { w, h };
}
// name in Instrument Serif + small caps meta, revealed with a mask wipe (never moving while it must be read)
export function nameLabel(ctx, t, t0, x, y, name, meta, { col = VERD, a = 1, size = 54, t1 = 1e9, align = 'left' } = {}) {
  const u = eout(lin(t0, t0 + .6, t)) * (1 - sm(lin(t1, t1 + .45, t))) * a; if (u <= 0) return;
  ctx.save(); ctx.globalAlpha = u;
  const bw = 3, dir = align === 'left' ? 1 : -1;
  ctx.fillStyle = col; ctx.fillRect(align === 'left' ? x : x - bw, y - size * .85, bw, size * 1.55 + (meta ? 26 : 0));
  ctx.beginPath(); const wipe = 900 * eout(lin(t0, t0 + .8, t)); ctx.rect(align === 'left' ? x : x - wipe, y - size, wipe, size * 2 + 40); ctx.clip();
  ctx.shadowColor = 'rgba(2,3,12,.85)'; ctx.shadowBlur = 14;
  text(ctx, name, x + dir * 22, y, { size, font: 'Instrument Serif', color: CREAM, align });
  if (meta) text(ctx, meta.toUpperCase(), x + dir * 24, y + 34, { size: 17, weight: 600, color: rgba('#cfe9e1', .9), spacing: 3.5, align });
  ctx.restore();
}
// source line just above the subtitle zone (bottom 170 px stay free)
export function sourceLine(ctx, t, t0, t1, s, { x = 110, y = 892, a = 1 } = {}) {
  const u = eout(lin(t0, t0 + .5, t)) * (1 - sm(lin(t1 - .4, t1, t))) * a; if (u <= 0) return;
  ctx.save(); ctx.shadowColor = 'rgba(2,3,12,.9)'; ctx.shadowBlur = 8; text(ctx, s.toUpperCase(), x, y, { size: 16, weight: 600, color: rgba('#d9d3c4', .85 * u), spacing: 3 }); ctx.restore();
}
// big number in serif with a small caps line
export function bigNumber(ctx, t, t0, x, y, num, caps, { col = CREAM, acc = VERD, size = 120, t1 = 1e9, panel = false } = {}) {
  const u = eout(lin(t0, t0 + .7, t)) * (1 - sm(lin(t1, t1 + .45, t))); if (u <= 0) return;
  // "≈" is missing in Instrument Serif: it is set in Inter, the number in the serif
  const approx = num.startsWith('≈'), rest = approx ? num.replace(/^≈\s*/, '') : num;
  ctx.save(); ctx.font = `${size}px "Instrument Serif"`; const nw = ctx.measureText(rest).width; ctx.font = `600 18px Inter`; const cw = caps ? ctx.measureText(caps.toUpperCase()).width + caps.length * 4 : 0; ctx.restore();
  const ax = approx ? size * .62 : 0;
  if (panel) { ctx.save(); ctx.globalAlpha = u * .82; ctx.fillStyle = 'rgba(8,10,26,.88)'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(x - 34, y - size * .92, Math.max(ax + nw, cw) + 72, size * .92 + 78, 14); ctx.fill(); ctx.restore(); }
  ctx.save(); ctx.globalAlpha = u; ctx.beginPath(); ctx.rect(x - 10, y - size * 1.1, 1400, size * 1.6 + 60); ctx.clip();
  ctx.shadowColor = 'rgba(2,3,12,.9)'; ctx.shadowBlur = 18;
  const dy = (1 - eout(lin(t0, t0 + .7, t))) * size * .5;
  if (approx) text(ctx, '≈', x, y + dy - size * .06, { size: size * .62, weight: 300, color: rgba(col, .85) });
  text(ctx, rest, x + ax, y + dy, { size, font: 'Instrument Serif', color: col });
  if (caps) text(ctx, caps.toUpperCase(), x + 4, y + 44, { size: 18, weight: 600, color: rgba(acc === VERD ? '#cfe9e1' : acc, .95), spacing: 4 });
  ctx.restore();
}

// ---------- the loaf on the bakery shelf (2.10a) ----------
export function loafSprite() {
  return once('loaf', () => {
    const w = 620, h = 330, [c, g] = canvas(w, h), n = vnoise(3), r = prng(8);
    const cx = w / 2, cy = h * .58, rx = 270, ry = 125;
    // crust body
    const bg = g.createRadialGradient(cx - 90, cy - 70, 10, cx, cy, rx * 1.1); bg.addColorStop(0, '#e7a85e'); bg.addColorStop(.45, '#b8692c'); bg.addColorStop(.85, '#6a3415'); bg.addColorStop(1, '#3a1a0a');
    g.fillStyle = bg; g.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, q = 1 + .03 * (n(a * 3, 1) - .5); const y = Math.sin(a) > 0 ? cy + Math.sin(a) * ry * .55 * q : cy + Math.sin(a) * ry * q; i ? g.lineTo(cx + Math.cos(a) * rx * q, y) : g.moveTo(cx + Math.cos(a) * rx * q, y); } g.closePath(); g.fill();
    g.save(); g.clip();
    // flour dusting and crust texture
    for (let i = 0; i < 2200; i++) { const x = cx + (r() - .5) * rx * 2, y = cy + (r() - .9) * ry * 1.4, f = fbm(n, x * .02, y * .02, 3); g.fillStyle = f > .55 ? `rgba(255,236,200,${.12 + r() * .25})` : `rgba(60,25,8,${.1 + r() * .2})`; g.fillRect(x, y, 1.6, 1.6); }
    // scoring: three diagonal cuts, opened, lighter inside
    for (let k = -1; k <= 1; k++) { const x0 = cx + k * 140 - 70, y0 = cy - 40 + Math.abs(k) * 18; g.fillStyle = '#f0c588'; g.beginPath(); g.moveTo(x0, y0 + 30); g.quadraticCurveTo(x0 + 70, y0 - 30, x0 + 150, y0 - 52); g.quadraticCurveTo(x0 + 80, y0 - 6, x0, y0 + 30); g.fill();
      g.strokeStyle = 'rgba(70,30,10,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y0 + 30); g.quadraticCurveTo(x0 + 70, y0 - 30, x0 + 150, y0 - 52); g.stroke(); }
    // engraved shading on the shadow side
    artHatch(g, [cx - rx, cy - ry, rx * 2, ry * 2], { angle: -.9, gap: 4, w: .8, col: '#2a1206', a: .35, wobble: .6, seed: 5 });
    const sg = g.createLinearGradient(cx - rx, 0, cx + rx, 0); sg.addColorStop(0, 'rgba(255,220,170,.12)'); sg.addColorStop(.6, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(20,6,0,.55)'); g.fillStyle = sg; g.fillRect(0, 0, w, h);
    g.restore();
    stipple(c, { k: .3, g: 1, seed: 12, mid: false, boost: 1 });
    return c;
  });
}
// the shelf: dark wood, warm morning light raking from the left, other loaves out of focus
export function shelfLayer() {
  return once('shelf', () => {
    const [c, g] = canvas(W + 400, H), r = prng(4), n = vnoise(9);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#120d16'); bg.addColorStop(.6, '#1d1418'); bg.addColorStop(1, '#0c080a'); g.fillStyle = bg; g.fillRect(0, 0, c.width, H);
    // back wall: tiles in the dark, warm light pool
    g.strokeStyle = 'rgba(255,220,180,.05)'; g.lineWidth = 1; for (let y = 40; y < 640; y += 70) { g.beginPath(); g.moveTo(0, y); g.lineTo(c.width, y); g.stroke(); } for (let y = 40; y < 640; y += 70) for (let x = (y / 70 % 2) * 60; x < c.width; x += 120) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 70); g.stroke(); }
    const lg = g.createRadialGradient(560, 380, 0, 560, 380, 1100); lg.addColorStop(0, 'rgba(255,190,120,.32)'); lg.addColorStop(.4, 'rgba(255,170,100,.1)'); lg.addColorStop(1, 'rgba(255,170,100,0)'); g.fillStyle = lg; g.fillRect(0, 0, c.width, H);
    // out-of-focus loaves on the upper shelf
    g.filter = 'blur(9px)'; for (let i = 0; i < 7; i++) { const x = 120 + i * 300 + r() * 80, y = 190; const lg2 = g.createRadialGradient(x - 30, y - 20, 0, x, y, 130); lg2.addColorStop(0, '#9a5a26'); lg2.addColorStop(1, '#2a140a'); g.fillStyle = lg2; g.beginPath(); g.ellipse(x, y, 120, 55, 0, 0, TAU); g.fill(); } g.filter = 'none';
    g.fillStyle = '#2b1d16'; g.fillRect(0, 250, c.width, 26); g.fillStyle = 'rgba(255,200,140,.25)'; g.fillRect(0, 250, c.width, 2);
    // the main shelf board
    const sy = 760; const sg = g.createLinearGradient(0, sy, 0, sy + 70); sg.addColorStop(0, '#6a4630'); sg.addColorStop(1, '#3a2418'); g.fillStyle = sg; g.fillRect(0, sy, c.width, 70);
    g.strokeStyle = 'rgba(30,15,8,.5)'; g.lineWidth = 1; for (let k = 0; k < 18; k++) { const y = sy + 4 + r() * 60; g.beginPath(); for (let x = 0; x <= c.width; x += 30) g.lineTo(x, y + (fbm(n, x * .004, k, 2) - .5) * 10); g.stroke(); }
    g.fillStyle = 'rgba(255,214,160,.55)'; g.fillRect(0, sy, c.width, 2.5);
    const fg = g.createLinearGradient(0, sy + 70, 0, H); fg.addColorStop(0, '#120a08'); fg.addColorStop(1, '#050304'); g.fillStyle = fg; g.fillRect(0, sy + 70, c.width, H - sy - 70);
    // the shelf top surface (seen slightly from above) with flour
    const tg = g.createLinearGradient(0, sy - 120, 0, sy); tg.addColorStop(0, 'rgba(90,60,42,0)'); tg.addColorStop(1, 'rgba(120,82,56,.9)'); g.fillStyle = tg; g.fillRect(0, sy - 120, c.width, 120);
    for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(255,240,215,${.05 + r() * .2})`; g.fillRect(r() * c.width, sy - 100 + Math.pow(r(), .5) * 100, 1.4, 1.2); }
    stipple(c, { k: .35, g: 1, seed: 14, mid: false, boost: 1 });
    return c;
  });
}

// ---------- the minting die and the coin of light (2.12) ----------
export function dieSprite() {
  return once('die', () => {
    const w = 360, h = 620, [c, g] = canvas(w, h);
    const sg = g.createLinearGradient(0, 0, w, 0); sg.addColorStop(0, '#1a1e2c'); sg.addColorStop(.3, '#6b7286'); sg.addColorStop(.45, '#c9cfdc'); sg.addColorStop(.6, '#5d6476'); sg.addColorStop(1, '#141824');
    g.fillStyle = sg; g.beginPath(); g.roundRect(60, 0, w - 120, h - 90, 8); g.fill();
    g.beginPath(); g.moveTo(30, h - 140); g.lineTo(w - 30, h - 140); g.lineTo(w - 50, h - 20); g.lineTo(50, h - 20); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1; for (let x = 70; x < w - 70; x += 5) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h - 140); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(60, 120, w - 120, 6); g.fillRect(60, 260, w - 120, 4);
    // the engraved face at the bottom (a rim)
    g.fillStyle = '#2a2f3e'; g.beginPath(); g.ellipse(w / 2, h - 20, w / 2 - 50, 16, 0, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(200,220,230,.6)'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(w / 2, h - 22, w / 2 - 54, 13, 0, 0, TAU); g.stroke();
    stipple(c, { k: .25, g: 1, seed: 2, mid: false, boost: 1 });
    return c;
  });
}
// the coin: a disc of verdigris light with an engraved handprint (seen from above at a slant: sy squash)
export function coinFace(r = 150) {
  return once('coinface' + r, () => {
    const S = r * 2 + 20, [c, g] = canvas(S, S), cx = S / 2;
    const fg = g.createRadialGradient(cx - r * .3, cx - r * .35, 0, cx, cx, r); fg.addColorStop(0, '#e8fff6'); fg.addColorStop(.35, '#8fe0c8'); fg.addColorStop(.8, '#2f8c7a'); fg.addColorStop(1, '#14463d');
    g.fillStyle = fg; g.beginPath(); g.arc(cx, cx, r, 0, TAU); g.fill();
    ring(g, cx, cx, r * .86, r * .86, { lines: 6, band: r * .07, wave: r * .11, col: '#0f3a33', glow: null, op: 'source-over', lineA: 1, a: .7, lw: 1 });
    g.strokeStyle = 'rgba(15,58,51,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cx, r - 3, 0, TAU); g.stroke(); g.lineWidth = 1; g.beginPath(); g.arc(cx, cx, r * .72, 0, TAU); g.stroke();
    // handprint, engraved: palm + four fingers + thumb as outlines filled with fine lines
    const hp = new Path2D(), k = r / 150;
    hp.ellipse(cx, cx + 22 * k, 36 * k, 42 * k, 0, 0, TAU);
    const fing = [[-26, -38, 9, 34, -.18], [-9, -48, 9, 40, -.06], [9, -47, 9, 39, .05], [25, -36, 8, 32, .17]];
    for (const [dx, dy, rw, L, a] of fing) { hp.moveTo(cx + dx * k + rw * k, cx + dy * k); hp.ellipse(cx + dx * k, cx + dy * k + (dy < 0 ? -L * .2 * k : 0), rw * k, L * .62 * k, a, 0, TAU); }
    hp.moveTo(cx - 30 * k, cx + 16 * k); hp.ellipse(cx - 46 * k, cx + 8 * k, 9 * k, 26 * k, -.9, 0, TAU);
    g.save(); g.clip(hp); g.strokeStyle = 'rgba(12,50,44,.75)'; g.lineWidth = 1.1 * k; for (let y = cx - r; y < cx + r; y += 4 * k) { g.beginPath(); g.moveTo(cx - r, y); g.lineTo(cx + r, y + 6 * k); g.stroke(); } g.restore();
    g.strokeStyle = 'rgba(12,50,44,.85)'; g.lineWidth = 1.6 * k; g.stroke(hp);
    // microtext ring
    g.save(); g.font = `600 ${Math.round(9 * k)}px Inter`; g.fillStyle = 'rgba(12,50,44,.8)'; g.textAlign = 'center'; const str = 'ONE VERIFIED HUMAN · ONE SHARE OF NEW MONEY · '; const n = 64;
    for (let i = 0; i < n; i++) { const a = i / n * TAU - Math.PI / 2; g.save(); g.translate(cx + Math.cos(a) * r * .79, cx + Math.sin(a) * r * .79); g.rotate(a + Math.PI / 2); g.fillText(str[i % str.length], 0, 3 * k); g.restore(); }
    g.restore();
    return c;
  });
}

// ---------- the AGREE ribbon on the ground (field perspective) ----------
// a woven amber guilloche band along ground points (X, Z) projected with P; u = how far it exists; glint 0..1 along it
export function groundRibbon(ctx, P, pts0, { u = 1, w = .55, col = AMBER, a = 1, t = 0, glint = null, lines = 6, waves = 30 } = {}) {
  const pts = once('rib' + pts0.length + pts0[0][0] + pts0[pts0.length - 1][1], () => { const out = [], N = 260; for (let i = 0; i <= N; i++) { const f = i / N * (pts0.length - 1), j = Math.min(pts0.length - 2, Math.floor(f)), q = f - j; out.push([mix(pts0[j][0], pts0[j + 1][0], q), mix(pts0[j][1], pts0[j + 1][1], q)]); } return out; });
  const n = pts.length - 1, m = Math.max(1, Math.round(n * clamp(u))); if (u <= 0) return;
  const nrm = pts.map((p, i) => { const q0 = pts[Math.max(0, i - 1)], q1 = pts[Math.min(n, i + 1)], dx = q1[0] - q0[0], dz = q1[1] - q0[1], l = Math.hypot(dx, dz) || 1; return [-dz / l, dx / l]; });
  const at = (i, off) => P(pts[i][0] + nrm[i][0] * off * w, pts[i][1] + nrm[i][1] * off * w);
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const strip = (o0, o1) => { ctx.beginPath(); for (let i = 0; i <= m; i++) { const [x, y] = at(i, o0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } for (let i = m; i >= 0; i--) { const [x, y] = at(i, o1); ctx.lineTo(x, y); } ctx.closePath(); };
  strip(-1.3, 1.3); ctx.fillStyle = rgba('#140c08', .35 * a); ctx.fill();
  ctx.globalCompositeOperation = 'lighter'; strip(-1.05, 1.05); ctx.fillStyle = rgba(col, .1 * a); ctx.fill();
  for (let k = 0; k < lines; k++) { const ph = k / lines * TAU; ctx.strokeStyle = rgba(k % 2 ? '#fff1d6' : col, (k % 2 ? .5 : .85) * a); ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i <= m; i++) { const q = i / n * waves * TAU, d = .8 * (Math.sin(q + ph + t * .3) * .75 + Math.sin(q * 2.03 - ph * 1.5) * .25); const [x, y, kk] = at(i, d); ctx.lineWidth = Math.max(.6, Math.min(2.2, kk * .006)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  ctx.globalCompositeOperation = 'source-over';
  for (const off of [-1, 1]) { ctx.strokeStyle = rgba('#f3efe2', .6 * a); ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i <= m; i++) { const [x, y] = at(i, off); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  if (glint != null && glint > 0 && glint < 1.2) {   // a foil glint travelling along the band
    const gi = Math.round(clamp(glint) * m), i0 = Math.max(0, gi - Math.round(m * .12));
    ctx.globalCompositeOperation = 'lighter';
    for (const [lw, al] of [[18, .08], [6, .3], [2, .9]]) { ctx.strokeStyle = rgba(lw > 3 ? col : '#fff1d6', al * a); ctx.lineWidth = lw; ctx.beginPath(); for (let i = i0; i <= gi; i++) { const [x, y, kk] = at(i, 0); ctx.lineWidth = Math.max(.8, lw * kk / 160); i === i0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    const [x, y, kk] = at(gi, 0), R = Math.max(18, kk * .5), gr = ctx.createRadialGradient(x, y, 0, x, y, R); gr.addColorStop(0, rgba('#fff1d6', .8 * a)); gr.addColorStop(1, rgba(col, 0)); ctx.fillStyle = gr; ctx.fillRect(x - R, y - R, 2 * R, 2 * R);
  }
  ctx.restore();
}
export function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, u)); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }

// An arm in a sleeve that comes from the viewer's side: the forearm leaves the wrist in direction `dir` (rad, wrist → elbow) for
// `fore` hand units, then bends smoothly toward a shoulder off-screen, widening with perspective. Draw it BEFORE hand(..., sleeve: null);
// the cuff ends 6 units into the palm like hand.mjs's own sleeve.
//   arm(ctx, wx, wy, s, { ang (hand finger direction), dir, fore = 230, shoulder: [x, y], w: [27, 34, 62] half-widths in hand units,
//        col, rim, light: [dx, dy] (direction the light comes from), t })
export function arm(ctx, wx, wy, s, o) {
  const ang = o.ang ?? 0, x0 = wx + Math.cos(ang) * 6 * s, y0 = wy + Math.sin(ang) * 6 * s, dir = o.dir ?? ang + Math.PI;
  const ex = x0 + Math.cos(dir) * (o.fore ?? 230) * s, ey = y0 + Math.sin(dir) * (o.fore ?? 230) * s, [sx, sy] = o.shoulder;
  const [w0, w1, w2] = (o.w || [27, 34, 62]).map((v) => v * s), N = 40, L = [], R = [], C = [];
  // centreline: straight forearm, then a quadratic bend into the upper arm (control at the elbow)
  const mxp = [mix(ex, sx, .5), mix(ey, sy, .5)];
  for (let i = 0; i <= N; i++) { const q = i / N; let x, y;
    if (q <= .45) { const u = q / .45; x = mix(x0, ex, u * .82); y = mix(y0, ey, u * .82); }
    else { const u = (q - .45) / .55, a0 = [mix(x0, ex, .82), mix(y0, ey, .82)], a = 1 - u; x = a * a * a0[0] + 2 * a * u * ex + u * u * mxp[0]; y = a * a * a0[1] + 2 * a * u * ey + u * u * mxp[1];
      if (u >= 1) { x = mxp[0]; y = mxp[1]; } }
    C.push([x, y, q < .45 ? mix(w0, w1, q / .45) : mix(w1, w2, Math.pow((q - .45) / .55, 1.4))]); }
  C.push([sx, sy, w2 * 1.15]);
  for (let i = 0; i < C.length; i++) { const p = C[Math.max(0, i - 1)], n = C[Math.min(C.length - 1, i + 1)], dx = n[0] - p[0], dy = n[1] - p[1], m = Math.hypot(dx, dy) || 1, nx = -dy / m, ny = dx / m;
    L.push([C[i][0] + nx * C[i][2], C[i][1] + ny * C[i][2]]); R.push([C[i][0] - nx * C[i][2], C[i][1] - ny * C[i][2]]); }
  const poly = () => { ctx.beginPath(); L.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]); ctx.closePath(); };
  const lm = Math.hypot(...(o.light || [.3, -1])) || 1, lx = (o.light || [.3, -1])[0] / lm, ly = (o.light || [.3, -1])[1] / lm;
  const fnx = -Math.sin(dir), fny = Math.cos(dir), litL = fnx * lx + fny * ly > 0;   // is the L side lit (for the forearm)?
  ctx.save();
  if (o.rim) { ctx.save(); ctx.translate(lx * 2.4, ly * 2.4); ctx.fillStyle = rgba(o.rim, .9); poly(); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = o.col; poly(); ctx.fill();
  ctx.save(); poly(); ctx.clip(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // volume: the shadow side darkens in a broad soft band, the lit side lifts
  const side = (A, col, al, wk) => { for (let i = 0; i < A.length - 1; i++) { ctx.strokeStyle = rgba(col, al); ctx.lineWidth = C[i][2] * wk; ctx.beginPath(); ctx.moveTo(A[i][0], A[i][1]); ctx.lineTo(A[i + 1][0], A[i + 1][1]); ctx.stroke(); } };
  side(litL ? R : L, '#00000a', .32, 1.1); side(litL ? L : R, '#fff0dc', .12, .5);
  // cuff seam near the wrist, and soft folds in the crook of the elbow
  const at = (i, k) => [mix(L[i][0], R[i][0], k), mix(L[i][1], R[i][1], k)];
  ctx.strokeStyle = 'rgba(0,0,8,.35)'; ctx.lineWidth = 3.2 * s; ctx.beginPath(); ctx.moveTo(...at(3, 0)); ctx.lineTo(...at(3, 1)); ctx.stroke();
  ctx.strokeStyle = rgba('#fff0dc', .14); ctx.lineWidth = 1.4 * s; ctx.beginPath(); ctx.moveTo(...at(2, 0)); ctx.lineTo(...at(2, 1)); ctx.stroke();
  const inner = litL ? 1 : 0, ph = Math.sin((o.t ?? 0) * 1.1) * .03;
  for (const [i, k0, k1, al] of [[17, .15, .7, .3], [19, .2, .8, .26], [22, .1, .6, .22], [14, .35, .75, .16]]) {
    const a = at(i, Math.abs(inner - k0) + ph), b = at(i + 2, Math.abs(inner - k1)), c = at(i + 1, Math.abs(inner - (k0 + k1) / 2) - .08);
    ctx.strokeStyle = rgba('#00000a', al); ctx.lineWidth = 2.6 * s; ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(c[0], c[1], b[0], b[1]); ctx.stroke(); }
  ctx.restore(); ctx.restore();
  return Math.atan2(y0 - ey, x0 - ex);
}
