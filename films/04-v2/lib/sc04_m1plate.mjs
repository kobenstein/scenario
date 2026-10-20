// C04 (Film 4 minute 1) · the two letterpress plates of 4.01–4.03 and the crowd of 4.03. Owner: c04 (minute repair).
// Modelled on Film 5's "PROMISE" cards (sc02 0.05): cream cotton sheet, guilloche border, pressed ink, light through pinholes.
//   PW, PH                          plate size in plate units (origin = plate centre)
//   plate(ctx, t, o)                draws one plate in plate units (caller sets the transform); o: { kind 1|2, ink: [the,end,of,work] 0..1,
//                                   band 0..1 (ornament rule), cut 0..1 (the band is cut away left→right, HAVING TO punched behind the front),
//                                   glow 0..1 (light through the holes), cold 0..1, warm 0..1, holesOff, num2 0..1 (the second I of
//                                   PLATE II is pressed: plate II is lifted off plate I as an identical print, then numbered) }
//   plateShadow(ctx, lift, a)       soft cast shadow under a plate (plate units)
//   holePts()                       pinhole centres of HAVING TO in plate units (for the gather into the sun)
//   crowd(ctx, t, o)                busts seen from behind (no faces), cold rim light; o: { x, y, w, n, hunch 0..1, light 0..1, rim }
//   warmPlates()                    builds every cached layer (the scene awaits ready() after it)
// Cached layers are Images (lib/m1x_c04_img.mjs once): no Canvas is drawn per frame. The sheet is cached at 2× because c04 opens with
// the camera very close to plate I (pulled back out of the cream light of c03's window).
import { rgba, clamp, mix, prng, canvas, eout } from '../engine.mjs';
import { gBorder, rosette, microtext, INK } from './certificate.mjs';
import { fibreFill } from './print.mjs';
import { once } from './m1x_c04_img.mjs';

export const PW = 1000, PH = 560;
const TAU = Math.PI * 2, PAPER = '#efe4cc', RES = 2;
const MEMO = new Map(); const memo = (k, f) => { if (!MEMO.has(k)) MEMO.set(k, f()); return MEMO.get(k); };

// ---------------------------------------------------------------- the sheet (cached at 2×; the plate number is pressed live)
function sheet() {
  return once('c04sheet', () => {
    const [c, g] = canvas(PW * RES, PH * RES); g.scale(RES, RES);
    const gr = g.createLinearGradient(0, 0, PW * .3, PH); gr.addColorStop(0, '#f4ead4'); gr.addColorStop(1, '#e6d8bb');
    g.fillStyle = gr; g.beginPath(); g.rect(0, 0, PW, PH); g.fill();
    // halftone dot screen like Film 5's cards
    g.save(); g.fillStyle = 'rgba(150,120,90,.13)';
    for (let y = 4, row = 0; y < PH; y += 7, row++) for (let x = (row & 1) ? 3.5 : 0; x < PW; x += 7) { g.beginPath(); g.arc(x, y, .9, 0, TAU); g.fill(); }
    g.restore();
    g.beginPath(); g.rect(0, 0, PW, PH); fibreFill(g, .35);
    // engraved border + hairline + corner rosettes + microtext
    gBorder(g, 18, 18, PW - 36, PH - 36, { band: 24, lines: 7, waves: 96, col: INK, a: .5, w: .8, radius: 10 });
    g.strokeStyle = rgba(INK, .45); g.lineWidth = 1; g.strokeRect(52, 52, PW - 104, PH - 104);
    for (const [x, y] of [[52, 52], [PW - 52, 52], [52, PH - 52], [PW - 52, PH - 52]]) rosette(g, x, y, { R: 15, A: 5, B: 2, n: 10, m: 4, lines: 12, col: INK, w: .6, a: .6 });
    microtext(g, 80, 70, PW - 160, 'SET IN TYPE · PRESSED BY HAND · ONE IMPRESSION ', { size: 6.5, col: INK, a: .45 });
    microtext(g, 80, PH - 70, PW - 160, 'TIME · WORK · LIFE · ', { size: 6.5, col: INK, a: .45 });
    // slight edge darkening (cotton sheet)
    const v = g.createRadialGradient(PW / 2, PH / 2, PH * .3, PW / 2, PH / 2, PW * .62); v.addColorStop(0, 'rgba(90,60,30,0)'); v.addColorStop(1, 'rgba(90,60,30,.18)');
    g.fillStyle = v; g.fillRect(0, 0, PW, PH);
    return c;
  });
}
// the plate number, letterpress small caps: both plates use the layout of 'PLATE  II' (plate I simply lacks the last I), so plate II
// can lift off plate I as an identical print and get its second I pressed afterwards
const NUMF = '600 15px "Inter"', NUMY = 100 - PH / 2;
const numLayout = () => memo('num', () => {
  const [, g] = canvas(10, 10); g.font = NUMF; try { g.letterSpacing = '6px'; } catch { }
  const full = g.measureText('PLATE  II').width, pre = g.measureText('PLATE  I').width, lastI = g.measureText('I').width;
  return { x0: -full / 2, split: -full / 2 + Math.min(pre, full - lastI * .5) };
});
function plateNumber(ctx, kind, num2) {
  const L = numLayout();
  ctx.save(); ctx.font = NUMF; try { ctx.letterSpacing = '6px'; } catch { } ctx.textAlign = 'left'; ctx.fillStyle = rgba(INK, .55);
  ctx.save(); ctx.beginPath(); ctx.rect(-PW / 2, NUMY - 30, L.split + PW / 2, 50); ctx.clip(); ctx.fillText('PLATE  II', L.x0, NUMY); ctx.restore();
  const a = kind === 2 ? clamp(num2 ?? 1) : 0;
  if (a > 0) {   // the second I is pressed like the type: a quick dent that darkens, settling from 5 % larger
    const k = mix(1.05, 1, eout(clamp(a * 1.4))), cx = L.split + 6;
    ctx.beginPath(); ctx.rect(L.split, NUMY - 30, PW / 2 - L.split, 50); ctx.clip();
    ctx.translate(cx, NUMY - 5); ctx.scale(k, k); ctx.translate(-cx, -(NUMY - 5));
    ctx.globalAlpha = clamp(a * 1.6); ctx.fillText('PLATE  II', L.x0, NUMY);
  }
  ctx.restore();
}
// the ornament rule of row 2 (a guilloche band with a lozenge), cached
function band() {
  return once('c04band', () => {
    const w = 560, h = 70, [c, g] = canvas(w * RES, h * RES); g.scale(RES, RES);
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
const BANDW = 560, BANDH = 70;
const shadowSprite = () => once('c04shadow', () => {
  const pad = 80, [c, g] = canvas(PW + pad * 2, PH + pad * 2); g.filter = 'blur(28px)'; g.fillStyle = 'rgba(3,3,12,.75)'; g.fillRect(pad, pad, PW, PH); return c;
});
export function plateShadow(ctx, lift = 1, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a * mix(.55, .8, clamp(lift)); const d = 10 + 26 * lift; ctx.drawImage(shadowSprite(), -PW / 2 - 80 + d * .5, -PH / 2 - 80 + d, PW + 160, PH + 160); ctx.restore();
}

// ---------------------------------------------------------------- pinholes (HAVING TO)
const HOLE = { size: 74, pitch: 6.4, r: 1.7, y: -6 };
export function holePts() {
  return memo('holes', () => {
    const fs = HOLE.size / .72, [, mx] = canvas(10, 10); mx.font = `600 ${fs}px "Inter"`; try { mx.letterSpacing = '12px'; } catch { }
    const tw = Math.ceil(mx.measureText('HAVING TO').width) + 24, th = Math.ceil(fs * 1.2), [, g] = canvas(tw, th);
    g.font = `600 ${fs}px "Inter"`; try { g.letterSpacing = '12px'; } catch { } g.fillStyle = '#fff'; g.fillText('HAVING TO', 12, th * .8);
    const D = g.getImageData(0, 0, tw, th).data, pts = [], p = HOLE.pitch;
    for (let row = 0, y = p * .5; y < th; y += p * .866, row++) for (let x = (row & 1) ? p * .5 : 0; x < tw; x += p) {
      const xi = Math.round(x), yi = Math.round(y); if (xi >= tw || yi >= th) continue;
      if (D[(yi * tw + xi) * 4 + 3] > 140) pts.push([x - tw / 2 + 6, y - th * .8 + HOLE.size / 2 + HOLE.y]);
    }
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]); return pts;
  });
}
function glowSprite(col, r) {
  return once('c04glow' + col + r, () => { const R = Math.ceil(r), [c, g] = canvas(R * 2, R * 2), gr = g.createRadialGradient(R, R, 0, R, R, R); gr.addColorStop(0, rgba(col, .95)); gr.addColorStop(.3, rgba(col, .35)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2); return c; });
}
// the punched letters as two cached layers: paper rims (shade) and the light (cores + halo)
const HL = { w: 760, h: 160 };
function holeLayers() {
  const P = holePts(), { w, h } = HL, ox = w / 2, oy = h / 2;
  const s = once('c04holeS', () => {
    const [cs, gs] = canvas(w, h);
    for (const [x, y] of P) { gs.fillStyle = 'rgba(60,35,15,.05)'; gs.beginPath(); gs.arc(ox + x, oy + y, 7, 0, TAU); gs.fill(); }
    for (const [x, y] of P) { gs.fillStyle = 'rgba(40,22,8,.85)'; gs.beginPath(); gs.arc(ox + x + .5, oy + y + .6, HOLE.r + .7, 0, TAU); gs.fill(); }
    return cs;
  });
  const l = once('c04holeL', () => {
    const [cl, gl] = canvas(w, h), R = 9, [sc, sg] = canvas(R * 2, R * 2), gr = sg.createRadialGradient(R, R, 0, R, R, R);
    gr.addColorStop(0, rgba('#ffb35c', .95)); gr.addColorStop(.3, rgba('#ffb35c', .35)); gr.addColorStop(1, rgba('#ffb35c', 0)); sg.fillStyle = gr; sg.fillRect(0, 0, R * 2, R * 2);
    gl.globalCompositeOperation = 'lighter';
    for (const [x, y] of P) gl.drawImage(sc, ox + x - 9, oy + y - 9);
    for (const [x, y] of P) { gl.fillStyle = '#fff1d6'; gl.beginPath(); gl.arc(ox + x, oy + y, HOLE.r, 0, TAU); gl.fill(); }
    return cl;
  });
  return { s, l, ox, oy, w, h };
}
// x1: the visible slice (the punch front), in plate units
function drawHoles(ctx, x1, glow, t) {
  const L = holeLayers(); if (x1 <= -L.ox) return;
  ctx.save(); ctx.beginPath(); ctx.rect(-L.ox, -L.oy, Math.max(0, x1 + L.ox), L.h); ctx.clip();
  ctx.drawImage(L.s, -L.ox, -L.oy);
  if (glow > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(glow * (.88 + .12 * Math.sin(t * 1.7))); ctx.drawImage(L.l, -L.ox, -L.oy); }
  ctx.restore();
}

// ---------------------------------------------------------------- pressed type
function pressed(ctx, s, x, y, size, a, align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.font = `${size}px "Instrument Serif"`; ctx.textAlign = align; try { ctx.letterSpacing = (size * .06) + 'px'; } catch { }
  const k = mix(1.05, 1, eout(clamp(a * 1.4))); ctx.translate(x, y); ctx.scale(k, k);
  ctx.globalAlpha = clamp(a * 1.6) * .55; ctx.fillStyle = 'rgba(255,250,236,1)'; ctx.fillText(s, 1.2, 2.2);   // the dent's lit lower edge
  ctx.globalAlpha = clamp(a * 1.6) * .35; ctx.fillStyle = 'rgba(70,45,20,1)'; ctx.fillText(s, -1, -1.6);       // the dent's shadowed upper edge
  ctx.globalAlpha = a * .93; ctx.fillStyle = '#1f1a26'; ctx.fillText(s, 0, 0);
  ctx.restore();
}
// x positions of THE / END / OF on line 1 (measured once)
function line1() {
  return memo('line1', () => {
    const [, g] = canvas(10, 10); g.font = '104px "Instrument Serif"'; try { g.letterSpacing = (104 * .06) + 'px'; } catch { }
    const ws = ['THE', 'END', 'OF'].map((s) => g.measureText(s).width), sp = 34, tot = ws.reduce((a, b) => a + b) + sp * 2; let x = -tot / 2; const out = [];
    for (const w of ws) { out.push(x + w / 2); x += w + sp; } return out;
  });
}

export function plate(ctx, t, o = {}) {
  const kind = o.kind || 1, ink = o.ink || [1, 1, 1, 1], fade = clamp(o.fade ?? 0), ia = 1 - fade;
  ctx.drawImage(sheet(), -PW / 2, -PH / 2, PW, PH);
  plateNumber(ctx, kind, o.num2);
  const X = line1();
  pressed(ctx, 'THE', X[0], -112 + 40, 104, ink[0] * ia);
  pressed(ctx, 'END', X[1], -112 + 40, 104, ink[1] * ia);
  pressed(ctx, 'OF', X[2], -112 + 40, 104, ink[2] * ia);
  pressed(ctx, 'WORK', 0, 190, 168, ink[3] * ia);
  // row 2: the ornament rule; on plate II it is cut away behind a burin front and HAVING TO is punched in its place
  const B = band(), bw = BANDW, bh = BANDH, cut = clamp(o.cut ?? 0), front = mix(-bw / 2 - 40, bw / 2 + 60, cut), ba = (o.band ?? 1) * ia;
  if (ba > 0 && front < bw / 2) { ctx.save(); ctx.beginPath(); ctx.rect(front, -6 - bh / 2, bw / 2 - front + 2, bh); ctx.clip(); ctx.globalAlpha = ba; ctx.drawImage(B, -bw / 2, -6 - bh / 2, bw, bh); ctx.restore(); }
  if (kind === 2 && cut > 0 && !o.holesOff) {
    drawHoles(ctx, front, o.glow ?? 1, t);
    if (cut < 1) { // the burin spark at the front
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const s = glowSprite('#ffb35c', 34); ctx.drawImage(s, front - 34, -6 - 34); ctx.restore();
    }
  }
  // light: cold shadow (plate I in 4.03) or warm (plate II)
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
export function burinSpark(ctx, x, y, r = 34) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(glowSprite('#ffb35c', r), x - r, y - r); ctx.restore(); }
export { glowSprite };
export function warmPlates() { sheet(); band(); shadowSprite(); holeLayers(); glowSprite('#ffb35c', 34); glowSprite('#ffb35c', 9); numLayout(); line1(); }

// ---------------------------------------------------------------- the crowd (4.03): busts from behind, cold rim
const BUSTS = (() => {
  const r = prng(404), out = [];
  for (let row = 0; row < 3; row++) {
    const n = [11, 9, 6][row];
    for (let i = 0; i < n; i++) out.push({ row, u: (i + .5 + (r() - .5) * .8) / n, s: [.62, .82, 1.08][row] * (.82 + r() * .32), dy: (r() - .5) * 40, hair: Math.floor(r() * 5), ph: r() * TAU, lean: (r() - .5) * .12 });
  }
  return out;
})();
function bust(ctx, s, hair, col, g = 0) {
  // shoulders (round, natural), neck, head from behind: no face, only hair shapes
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-80 * s - g, 760 * s); ctx.lineTo(-79 * s - g, 30 * s);
  ctx.bezierCurveTo(-80 * s - g, -10 * s, -62 * s - g, -40 * s - g, -26 * s, -46 * s - g);
  ctx.lineTo(26 * s, -46 * s - g);
  ctx.bezierCurveTo(62 * s + g, -40 * s - g, 80 * s + g, -10 * s, 79 * s + g, 30 * s); ctx.lineTo(80 * s + g, 760 * s);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -54 * s, 16 * s + g, 16 * s + g, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -90 * s, 31 * s + g, 35 * s + g, 0, 0, TAU); ctx.fill();
  if (hair === 1) { ctx.beginPath(); ctx.arc(0, -126 * s, 13 * s + g, 0, TAU); ctx.fill(); }                          // bun
  if (hair === 2) { ctx.beginPath(); ctx.moveTo(-26 * s - g, -86 * s); ctx.quadraticCurveTo(-34 * s - g, -40 * s, -18 * s, -38 * s); ctx.lineTo(18 * s, -38 * s); ctx.quadraticCurveTo(34 * s + g, -40 * s, 26 * s + g, -86 * s); ctx.closePath(); ctx.fill(); } // long hair
  if (hair === 3) { ctx.beginPath(); ctx.ellipse(0, -104 * s, 36 * s + g, 22 * s + g, 0, Math.PI, TAU); ctx.fill(); }   // hood/cap
}
export function crowd(ctx, t, o = {}) {
  const x0 = o.x ?? 0, y0 = o.y ?? 0, w = o.w ?? 1400, hunch = clamp(o.hunch ?? 0), L = o.light ?? 1, rim = o.rim || '#8fb0e0';
  const rows = [{ y: 0, c: '#141a33' }, { y: 120, c: '#0d1226' }, { y: 250, c: '#070a17' }];
  for (const b of BUSTS) {
    const R = rows[b.row], x = x0 + (b.u - .5) * w * (1 + b.row * .18), br = Math.sin(t * 1.4 + b.ph) * 1.6, y = y0 + R.y + b.dy + br + hunch * 10 * b.s;
    ctx.save(); ctx.translate(x, y); ctx.rotate(b.lean + .02 * Math.sin(t * .5 + b.ph)); ctx.scale(1, 1 - hunch * .04);
    // cold rim from the plate above
    ctx.save(); ctx.translate(0, -2.4); bust(ctx, b.s, b.hair, rgba(rim, (.35 + .4 * L) * (b.row === 2 ? .55 : 1)), 1.2); ctx.restore();
    bust(ctx, b.s, b.hair, R.c);
    ctx.restore();
  }
}
