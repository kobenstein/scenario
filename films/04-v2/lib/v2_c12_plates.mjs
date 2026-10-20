// c12 · 12.05–12.07 the two letterpress plates of the minute (THE END OF WORK / THE END OF HAVING TO WORK) return.
// Their drawing is COPIED from lib/sc04_m1plate.mjs (the minute's file, owner c04; never imported, it is being repaired in parallel):
// the cotton sheet with halftone screen, fibres, guilloche border, corner rosettes, microtext, plate number; the pressed type; the
// ornament rule; the punched HAVING TO with light through the pinholes; the cold / warm light. Cached layers are handed to the
// renderer as decoded Images (kit once/ready). Owner: c12.
//   PW, PH                  plate size in plate units (origin = plate centre)
//   plate(ctx, t, o)        o: { kind 1|2, ink [4], band, cut (1 = HAVING TO punched), glow, cold, warm, holesOff }
//   plateShadow(ctx, lift, a)
//   holePts()               pinhole centres of HAVING TO (plate units); HOLE.r the pinhole radius
//   targetHole()            the pinhole the camera flies through (the dot of the I in HAVING: well inside the word)
import { rgba, clamp, mix, canvas, eout } from '../engine.mjs';
import { gBorder, rosette, microtext, INK } from './certificate.mjs';
import { fibreFill } from './print.mjs';
import { once, memo, TAU } from './v2_c12_kit.mjs';

export const PW = 1000, PH = 560;
const PAPER = '#efe4cc';

function sheet(kind) {
  return once('c12sheet' + kind, () => {
    const [c, g] = canvas(PW, PH);
    const gr = g.createLinearGradient(0, 0, PW * .3, PH); gr.addColorStop(0, '#f4ead4'); gr.addColorStop(1, '#e6d8bb');
    g.fillStyle = gr; g.beginPath(); g.rect(0, 0, PW, PH); g.fill();
    g.save(); g.fillStyle = 'rgba(150,120,90,.13)';
    for (let y = 4, row = 0; y < PH; y += 7, row++) for (let x = (row & 1) ? 3.5 : 0; x < PW; x += 7) { g.beginPath(); g.arc(x, y, .9, 0, TAU); g.fill(); }
    g.restore();
    g.beginPath(); g.rect(0, 0, PW, PH); fibreFill(g, .35);
    gBorder(g, 18, 18, PW - 36, PH - 36, { band: 24, lines: 7, waves: 96, col: INK, a: .5, w: .8, radius: 10 });
    g.strokeStyle = rgba(INK, .45); g.lineWidth = 1; g.strokeRect(52, 52, PW - 104, PH - 104);
    for (const [x, y] of [[52, 52], [PW - 52, 52], [52, PH - 52], [PW - 52, PH - 52]]) rosette(g, x, y, { R: 15, A: 5, B: 2, n: 10, m: 4, lines: 12, col: INK, w: .6, a: .6 });
    microtext(g, 80, 70, PW - 160, 'SET IN TYPE · PRESSED BY HAND · ONE IMPRESSION ', { size: 6.5, col: INK, a: .45 });
    microtext(g, 80, PH - 70, PW - 160, 'TIME · WORK · LIFE · ', { size: 6.5, col: INK, a: .45 });
    g.font = '600 15px "Inter"'; try { g.letterSpacing = '6px'; } catch { } g.fillStyle = rgba(INK, .55); g.textAlign = 'center';
    g.fillText(kind === 1 ? 'PLATE  I' : 'PLATE  II', PW / 2, 100);
    const v = g.createRadialGradient(PW / 2, PH / 2, PH * .3, PW / 2, PH / 2, PW * .62); v.addColorStop(0, 'rgba(90,60,30,0)'); v.addColorStop(1, 'rgba(90,60,30,.18)');
    g.fillStyle = v; g.fillRect(0, 0, PW, PH);
    return c;
  });
}
// the same sheet re-drawn at 8 px per plate unit around the target pinhole (the fly-through needs it sharp): identical drawing code
const HR = 8, HSPAN = 70;
function sheetHi(kind) {
  return once('c12sheetHi' + kind, () => {
    const [hx, hy] = targetHole(), x0 = PW / 2 + hx - HSPAN, y0 = PH / 2 + hy - HSPAN, [c, g] = canvas(HSPAN * 2 * HR, HSPAN * 2 * HR);
    g.scale(HR, HR); g.translate(-x0, -y0);
    const gr = g.createLinearGradient(0, 0, PW * .3, PH); gr.addColorStop(0, '#f4ead4'); gr.addColorStop(1, '#e6d8bb');
    g.fillStyle = gr; g.fillRect(x0, y0, HSPAN * 2, HSPAN * 2);
    g.save(); g.fillStyle = 'rgba(150,120,90,.13)';
    for (let y = 4, row = 0; y < PH; y += 7, row++) { if (y < y0 - 2 || y > y0 + HSPAN * 2 + 2) continue; for (let x = (row & 1) ? 3.5 : 0; x < PW; x += 7) { if (x < x0 - 2 || x > x0 + HSPAN * 2 + 2) continue; g.beginPath(); g.arc(x, y, .9, 0, TAU); g.fill(); } }
    g.restore();
    g.beginPath(); g.rect(0, 0, PW, PH); fibreFill(g, .35);
    const v = g.createRadialGradient(PW / 2, PH / 2, PH * .3, PW / 2, PH / 2, PW * .62); v.addColorStop(0, 'rgba(90,60,30,0)'); v.addColorStop(1, 'rgba(90,60,30,.18)');
    g.fillStyle = v; g.fillRect(x0, y0, HSPAN * 2, HSPAN * 2);
    // a soft round edge, so the sharp patch sits in the 1x sheet without a seam
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-in'; const R = HSPAN * HR, m = g.createRadialGradient(R, R, 0, R, R, R);
    m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(.62, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = m; g.fillRect(0, 0, R * 2, R * 2);
    return c;
  });
}
function band() {
  return once('c12band', () => {
    const w = 560, h = 70, [c, g] = canvas(w, h);
    g.strokeStyle = rgba(INK, .7); g.lineWidth = .9;
    for (let k = 0; k < 6; k++) {
      const ph = k / 6 * TAU; g.beginPath();
      for (let x = 0; x <= w; x += 2) { const q = x / w, env = Math.sin(Math.PI * q) ** .6, y = h / 2 + env * 14 * (Math.sin(q * 46 + ph) * .75 + Math.sin(q * 93 - ph * 1.5) * .25); x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
    }
    g.fillStyle = rgba(INK, .85); g.beginPath(); g.moveTo(w / 2, h / 2 - 12); g.lineTo(w / 2 + 12, h / 2); g.lineTo(w / 2, h / 2 + 12); g.lineTo(w / 2 - 12, h / 2); g.closePath(); g.fill();
    g.fillStyle = PAPER; g.beginPath(); g.arc(w / 2, h / 2, 4, 0, TAU); g.fill();
    return c;
  });
}
const shadowSprite = () => once('c12pshadow', () => {
  const pad = 80, [c, g] = canvas(PW + pad * 2, PH + pad * 2); g.filter = 'blur(28px)'; g.fillStyle = 'rgba(3,3,12,.75)'; g.fillRect(pad, pad, PW, PH); return c;
});
export function plateShadow(ctx, lift = 1, a = 1) {
  ctx.save(); ctx.globalAlpha = a * mix(.55, .8, clamp(lift)); const d = 10 + 26 * lift; ctx.drawImage(shadowSprite(), -PW / 2 - 80 + d * .5, -PH / 2 - 80 + d, PW + 160, PH + 160); ctx.restore();
}

// ---------------------------------------------------------------- pinholes (HAVING TO)
export const HOLE = { size: 74, pitch: 6.4, r: 1.7, y: -6 };
export function holePts() {
  return memo('c12holes', () => {
    const fs = HOLE.size / .72, [m, mx] = canvas(10, 10); mx.font = `600 ${fs}px "Inter"`; try { mx.letterSpacing = '12px'; } catch { }
    const tw = Math.ceil(mx.measureText('HAVING TO').width) + 24, th = Math.ceil(fs * 1.2), [c, g] = canvas(tw, th);
    g.font = `600 ${fs}px "Inter"`; try { g.letterSpacing = '12px'; } catch { } g.fillStyle = '#fff'; g.fillText('HAVING TO', 12, th * .8);
    const D = g.getImageData(0, 0, tw, th).data, pts = [], p = HOLE.pitch;
    for (let row = 0, y = p * .5; y < th; y += p * .866, row++) for (let x = (row & 1) ? p * .5 : 0; x < tw; x += p) {
      const xi = Math.round(x), yi = Math.round(y); if (xi >= tw || yi >= th) continue;
      if (D[(yi * tw + xi) * 4 + 3] > 140) pts.push([x - tw / 2 + 6, y - th * .8 + HOLE.size / 2 + HOLE.y]);
    }
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]); return pts;
  });
}
// the hole nearest the centre of the word (a hole in the I of HAVING: light on every side of it)
export function targetHole() {
  return memo('c12target', () => { const P = holePts(); let best = P[0], bd = 1e9; for (const p of P) { const d = Math.hypot(p[0] + 67, p[1] + 7); if (d < bd) { bd = d; best = p; } } return best; });
}
const SPR = new Map();
function glowSprite(col, r) { const k = col + r; if (!SPR.has(k)) SPR.set(k, once('c12pg' + k, () => { const R = Math.ceil(r), [c, g] = canvas(R * 2, R * 2), gr = g.createRadialGradient(R, R, 0, R, R, R); gr.addColorStop(0, rgba(col, .95)); gr.addColorStop(.3, rgba(col, .35)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2); return c; })); return SPR.get(k); }
function holeLayers() {
  return memo('c12holeL', () => {
    const P = holePts(), w = 760, h = 160, ox = w / 2, oy = h / 2;
    const s = once('c12holeS', () => { const [cs, gs] = canvas(w, h);
      for (const [x, y] of P) { gs.fillStyle = 'rgba(60,35,15,.05)'; gs.beginPath(); gs.arc(ox + x, oy + y, 7, 0, TAU); gs.fill(); }
      for (const [x, y] of P) { gs.fillStyle = 'rgba(40,22,8,.85)'; gs.beginPath(); gs.arc(ox + x + .5, oy + y + .6, HOLE.r + .7, 0, TAU); gs.fill(); }
      return cs; });
    const l = once('c12holeLL', () => { const [cl, gl] = canvas(w, h), spr = (() => { const R = 9, [c, g] = canvas(R * 2, R * 2), gr = g.createRadialGradient(R, R, 0, R, R, R); gr.addColorStop(0, rgba('#ffb35c', .95)); gr.addColorStop(.3, rgba('#ffb35c', .35)); gr.addColorStop(1, rgba('#ffb35c', 0)); g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2); return c; })();
      gl.globalCompositeOperation = 'lighter';
      for (const [x, y] of P) gl.drawImage(spr, ox + x - 9, oy + y - 9);
      for (const [x, y] of P) { gl.fillStyle = '#fff1d6'; gl.beginPath(); gl.arc(ox + x, oy + y, HOLE.r, 0, TAU); gl.fill(); }
      return cl; });
    return { s, l, ox, oy, w, h };
  });
}
function drawHoles(ctx, x1, glow, t) {
  const L = holeLayers(); if (x1 <= -L.ox) return;
  ctx.save(); ctx.beginPath(); ctx.rect(-L.ox, -L.oy, Math.max(0, x1 + L.ox), L.h); ctx.clip();
  ctx.drawImage(L.s, -L.ox, -L.oy, L.w, L.h);
  if (glow > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(glow * (.88 + .12 * Math.sin(t * 1.7))); ctx.drawImage(L.l, -L.ox, -L.oy, L.w, L.h); }
  ctx.restore();
}

// ---------------------------------------------------------------- pressed type
function pressed(ctx, s, x, y, size, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.font = `${size}px "Instrument Serif"`; ctx.textAlign = align; try { ctx.letterSpacing = (size * .06) + 'px'; } catch { }
  const k = mix(1.05, 1, eout(clamp(a * 1.4))); ctx.translate(x, y); ctx.scale(k, k);
  ctx.globalAlpha = clamp(a * 1.6) * .55; ctx.fillStyle = 'rgba(255,250,236,1)'; ctx.fillText(s, 1.2, 2.2);
  ctx.globalAlpha = clamp(a * 1.6) * .35; ctx.fillStyle = 'rgba(70,45,20,1)'; ctx.fillText(s, -1, -1.6);
  ctx.globalAlpha = a * .93; ctx.fillStyle = '#1f1a26'; ctx.fillText(s, 0, 0);
  ctx.restore();
}
function line1() {
  return memo('c12line1', () => {
    const [m, g] = canvas(10, 10); g.font = '104px "Instrument Serif"'; try { g.letterSpacing = (104 * .06) + 'px'; } catch { }
    const ws = ['THE', 'END', 'OF'].map((s) => g.measureText(s).width), sp = 34, tot = ws.reduce((a, b) => a + b) + sp * 2; let x = -tot / 2; const out = [];
    for (const w of ws) { out.push(x + w / 2); x += w + sp; } return out;
  });
}
// o.hi: the camera is close to the target pinhole (draw the sharp sheet there)
export function plate(ctx, t, o = {}) {
  const kind = o.kind || 1, ink = o.ink || [1, 1, 1, 1];
  ctx.drawImage(sheet(kind), -PW / 2, -PH / 2, PW, PH);
  if ((o.hi ?? 0) > 0) { const [hx, hy] = targetHole(); ctx.save(); ctx.globalAlpha = clamp(o.hi); ctx.drawImage(sheetHi(kind), hx - HSPAN, hy - HSPAN, HSPAN * 2, HSPAN * 2); ctx.restore(); }
  const X = line1();
  pressed(ctx, 'THE', X[0], -112 + 40, 104, ink[0]);
  pressed(ctx, 'END', X[1], -112 + 40, 104, ink[1]);
  pressed(ctx, 'OF', X[2], -112 + 40, 104, ink[2]);
  pressed(ctx, 'WORK', 0, 190, 168, ink[3]);
  const B = band(), bw = 560, bh = 70, cut = clamp(o.cut ?? 0), front = mix(-bw / 2 - 40, bw / 2 + 60, cut), ba = o.band ?? 1;
  if (ba > 0 && front < bw / 2) { ctx.save(); ctx.beginPath(); ctx.rect(front, -6 - bh / 2, bw / 2 - front + 2, bh); ctx.clip(); ctx.globalAlpha = ba; ctx.drawImage(B, -bw / 2, -6 - bh / 2, bw, bh); ctx.restore(); }
  if (kind === 2 && cut > 0 && !o.holesOff) drawHoles(ctx, front, o.glow ?? 1, t);
  const cold = clamp(o.cold ?? 0), warm = clamp(o.warm ?? 0);
  if (cold > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#4a5d8f', cold * .85); ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
    ctx.globalCompositeOperation = 'source-over'; const g = ctx.createLinearGradient(0, -PH / 2, 0, PH / 2); g.addColorStop(0, rgba('#0a0f24', .1 * cold)); g.addColorStop(1, rgba('#05070f', .55 * cold));
    ctx.fillStyle = g; ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#9fbbe8', .35 * cold); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-PW / 2, -PH / 2 + 1); ctx.lineTo(PW / 2, -PH / 2 + 1); ctx.stroke();
    ctx.restore();
  }
  if (warm > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#ffc58e', warm * .45); ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
    ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, -6, 0, 0, -6, PW * .6); g.addColorStop(0, rgba('#ffb35c', .22 * warm)); g.addColorStop(1, rgba('#ffb35c', 0));
    ctx.fillStyle = g; ctx.fillRect(-PW / 2, -PH / 2, PW, PH); ctx.restore();
  }
}
export function prewarmPlates() { sheet(1); sheet(2); sheetHi(2); band(); shadowSprite(); holeLayers(); glowSprite('#ffb35c', 34); }
export { glowSprite as plateGlow };
