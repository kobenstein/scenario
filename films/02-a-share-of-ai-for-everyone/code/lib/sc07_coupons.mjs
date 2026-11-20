// C7 helper: dividend coupons (5.04, 5.05) and the form card that carries c06 → c07 (4.11 → 4.12).
//   coupon(ctx, x, y, w, t, o)          one engraved dividend coupon, x,y = centre, h = w * .62
//        o: { n (Nº), rot, a, lift (px, shadow grows), glow (0..1 amber edge light), turn (0..1: turns over, back = plain print side),
//             ghost (0..1 dotted = not yet), shade (0..1 darkening for depth) }
//   couponSheet(ctx, x, y, s, t, o) → { cell(r, c) → { x, y, w, rot }, w, h }   the coupon sheet at the fund's plinth
//        x,y = centre, s = 1 → 6 × 2 coupons of 120 px; o: { rows 2, cols 6, gone: [0..1 per row] (row torn off: lift → gone),
//             big (0..1, the coupons double in size), a, light ([x, y]) }
//   flight(p0, p1, u, o) → { x, y, rot, s }   a coupon's arc from the sheet to a palm (flutter, ease out landing)
//   ideaForm(ctx, x, y, s, r, t, o)     the application form (= c06's idea card when it lands): x,y = centre, s = 1 → 360 × 250
//        o: { ghost (0..1 dotted outline/fields: not real yet), check (0..1 the tick being drawn), name (0..1 scribble), a, light }
import { canvas, rgba, clamp, mix, prng, lin, eout, addGlow } from '../engine.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2, INK = '#1f2a3a', PAPER = '#efe6cf', AMB = '#ffb35c';

function guillocheBand(g, x, y, w, h, col, n = 4, seed = 1) {
  g.save(); g.strokeStyle = col; g.lineWidth = .9;
  for (let k = 0; k < n; k++) {
    g.beginPath();
    for (let i = 0; i <= 160; i++) { const q = i / 160, xx = x + q * w, yy = y + h / 2 + Math.sin(q * TAU * (w / 26) + k * TAU / n + seed) * h * .42 * Math.cos(q * TAU * 1.5 + k) ; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
    g.stroke();
  }
  g.restore();
}
function rosetteLocal(g, x, y, R, col, lines = 9, lobes = 7) {
  g.save(); g.strokeStyle = col; g.lineWidth = .8;
  for (let k = 0; k < lines; k++) {
    g.beginPath(); const ph = k / lines * TAU / lobes;
    for (let i = 0; i <= 240; i++) { const a = i / 240 * TAU, r = R * (.62 + .3 * Math.sin(lobes * a + ph) * Math.cos(2 * a - ph)); i ? g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : g.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
    g.closePath(); g.stroke();
  }
  g.beginPath(); g.arc(x, y, R * 1.02, 0, TAU); g.stroke(); g.restore();
}
// the sprout emblem: two leaves on a stem in an oval, engraved
function sproutEmblem(g, x, y, s, col) {
  g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 1.1;
  g.beginPath(); g.ellipse(0, 0, 26, 30, 0, 0, TAU); g.stroke(); g.beginPath(); g.ellipse(0, 0, 22, 26, 0, 0, TAU); g.lineWidth = .5; g.stroke();
  g.lineWidth = 1.6; g.beginPath(); g.moveTo(0, 20); g.quadraticCurveTo(2, 4, 0, -8); g.stroke();
  for (const sd of [-1, 1]) { g.save(); g.translate(0, -6); g.rotate(sd * .8); g.beginPath(); g.ellipse(sd * 9, 0, 10, 4.4, 0, 0, TAU); g.lineWidth = 1; g.stroke();
    g.beginPath(); for (let i = -6; i <= 6; i += 2.2) { g.moveTo(sd * 9 + i, -3); g.lineTo(sd * 9 + i + 1.4, 3); } g.lineWidth = .5; g.stroke(); g.restore(); }
  // soil line
  g.lineWidth = .7; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-16 + i * 2, 21 + i * 1.6); g.lineTo(16 - i * 2, 21 + i * 1.6); g.stroke(); }
  g.restore();
}
const SPR = 2; // sprite supersampling
function couponFace(n) {
  return once('cf' + n, () => {
    const w = 240, h = 150, [c, g] = canvas(w * SPR, h * SPR); g.scale(SPR, SPR); const r = prng(30 + n);
    const pg = g.createLinearGradient(0, 0, w, h); pg.addColorStop(0, '#f6eedb'); pg.addColorStop(1, '#e4d7b8'); g.fillStyle = pg; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { g.fillStyle = r() < .5 ? 'rgba(120,96,60,.07)' : 'rgba(255,255,255,.12)'; g.fillRect(r() * w, r() * h, .8 + r() * 1.6, .5); }
    g.strokeStyle = rgba(INK, .85); g.lineWidth = 1.2; g.strokeRect(7, 7, w - 14, h - 14); g.lineWidth = .5; g.strokeRect(10, 10, w - 20, h - 20);
    guillocheBand(g, 12, 12, w - 24, 12, rgba(INK, .5), 4, n); guillocheBand(g, 12, h - 24, w - 24, 12, rgba(INK, .5), 4, n + 2);
    rosetteLocal(g, 52, h / 2, 30, rgba(INK, .55));
    g.fillStyle = rgba('#7a3b17', .9); g.font = '600 9px "Inter"'; try { g.letterSpacing = '2.2px'; } catch { }
    g.textAlign = 'center'; g.fillText('DIVIDEND', 52, h / 2 + 3.5);
    sproutEmblem(g, 170, h / 2 + 2, .95, rgba(INK, .8));
    g.font = '28px "Instrument Serif"'; try { g.letterSpacing = '0px'; } catch { } g.fillStyle = rgba(INK, .9); g.textAlign = 'left'; g.fillText('Nº ' + n, 92, h / 2 + 10);
    g.font = '500 6px "Inter"'; g.fillStyle = rgba(INK, .55); let mx = 14; const str = 'THE SAME SLICE FOR EVERY PERSON · EVERY YEAR · '; while (mx < w - 14) { g.fillText(str, mx, h - 27.5); mx += g.measureText(str).width; }
    return c;
  });
}
function couponBack() {
  return once('cb', () => {
    const w = 240, h = 150, [c, g] = canvas(w * SPR, h * SPR); g.scale(SPR, SPR); const r = prng(77);
    g.fillStyle = '#ece3cc'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 700; i++) { g.fillStyle = 'rgba(120,96,60,.08)'; g.fillRect(r() * w, r() * h, 1 + r() * 1.5, .5); }
    // the print of a newspaper seen through the back: headline bar and grey columns
    g.fillStyle = 'rgba(30,30,40,.75)'; g.fillRect(16, 16, w - 32, 3); g.fillRect(16, 22, w - 32, 1);
    g.fillStyle = 'rgba(30,30,40,.82)'; g.fillRect(16, 32, 150, 13); g.fillRect(16, 50, 110, 13);
    g.fillStyle = 'rgba(30,30,40,.32)'; for (let col = 0; col < 3; col++) for (let ln = 0; ln < 9; ln++) g.fillRect(16 + col * 72, 74 + ln * 7, 60 - (ln % 4 === 3 ? 22 : r() * 6), 2.2);
    return c;
  });
}
export function coupon(ctx, x, y, w, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || w < 1) return; const h = w * .625, turn = clamp(o.turn ?? 0), sx = Math.cos(turn * Math.PI), back = sx < 0, lift = o.lift ?? 0;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  // shadow
  ctx.fillStyle = `rgba(8,5,4,${.28 / (1 + lift / 30)})`; ctx.beginPath(); ctx.ellipse(lift * .35 + 3, lift * .6 + h * .08, Math.abs(sx) * w * .52 + lift * .2, h * .5 + lift * .15, 0, 0, TAU); ctx.fill();
  ctx.scale(Math.max(.02, Math.abs(sx)), 1);
  if (o.glow) addGlow(ctx, 0, 0, w * .9, .35 * o.glow, AMB, '#fff1d6');
  ctx.drawImage(back ? couponBack() : couponFace(o.n ?? 1), -w / 2, -h / 2, w, h);
  if (o.ghost) { ctx.fillStyle = rgba('#efe6cf', .85 * o.ghost); ctx.fillRect(-w / 2, -h / 2, w, h); ctx.setLineDash([3, 4]); ctx.strokeStyle = rgba(INK, .6 * o.ghost); ctx.lineWidth = 1.2; ctx.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6); ctx.setLineDash([]); }
  if (o.shade) { ctx.fillStyle = rgba('#0a0d16', o.shade); ctx.fillRect(-w / 2, -h / 2, w, h); }
  // light along the top edge (turning paper catches the light)
  const lit = (o.glow ?? 0) * .6 + Math.max(0, Math.sin(turn * Math.PI)) * .5;
  if (lit > .02) { ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(0, -h / 2, 0, h / 2); lg.addColorStop(0, rgba('#ffd9a0', .35 * lit)); lg.addColorStop(1, rgba('#ffd9a0', 0)); ctx.fillStyle = lg; ctx.fillRect(-w / 2, -h / 2, w, h); }
  ctx.restore();
}
export function couponSheet(ctx, x, y, s, t, o = {}) {
  const rows = o.rows ?? 2, cols = o.cols ?? 6, big = clamp(o.big ?? 0), k = 1 + big, cw = 120 * s * k, ch = cw * .625, gone = o.gone || [];
  const W0 = cols * cw, H0 = rows * ch, x0 = x - W0 / 2, y0 = y - H0 / 2;
  const cell = (r, c) => ({ x: x0 + (c + .5) * cw, y: y0 + (r + .5) * ch, w: cw * .96, rot: 0 });
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  // sheet backing (the paper the coupons are printed on): visible margins
  ctx.fillStyle = 'rgba(8,5,4,.35)'; ctx.fillRect(x0 + 6, y0 + 10, W0, H0);
  for (let r = 0; r < rows; r++) {
    const gr = clamp(gone[r] ?? 0); if (gr >= .3) continue;
    const lift = eout(lin(0, .3, gr));
    for (let c = 0; c < cols; c++) { const p = cell(r, c); coupon(ctx, p.x, p.y - lift * 10 * s, p.w, t, { n: r * cols + c + 1, lift: lift * 12, rot: lift * .03 * (c % 2 ? 1 : -1), glow: o.glow || 0, shade: o.shade || 0 }); }
  }
  // perforation rows between coupons
  ctx.fillStyle = 'rgba(12,8,6,.55)';
  for (let r = 0; r <= rows; r++) { if (gone[r] >= .3 && gone[r - 1] >= .3) continue; const yy = y0 + r * ch; for (let xx = x0 + 4; xx < x0 + W0; xx += 7 * s * k) { ctx.beginPath(); ctx.arc(xx, yy, 1.3 * s * k, 0, TAU); ctx.fill(); } }
  for (let c = 1; c < cols; c++) { const xx = x0 + c * cw; for (let r = 0; r < rows; r++) { if ((gone[r] ?? 0) >= .3) continue; for (let yy = y0 + r * ch + 4; yy < y0 + (r + 1) * ch; yy += 7 * s * k) { ctx.beginPath(); ctx.arc(xx, yy, 1.2 * s * k, 0, TAU); ctx.fill(); } } }
  ctx.restore();
  return { cell, w: W0, h: H0 };
}
export function flight(p0, p1, u, o = {}) {
  const e = u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 2.2), arc = o.arc ?? 160, seed = o.seed ?? 1;
  const cx = mix(p0.x, p1.x, .5), cy = Math.min(p0.y, p1.y) - arc;
  const x = (1 - e) * (1 - e) * p0.x + 2 * (1 - e) * e * cx + e * e * p1.x, y = (1 - e) * (1 - e) * p0.y + 2 * (1 - e) * e * cy + e * e * p1.y;
  const fl = Math.sin(u * 9 + seed) * (1 - e) * .5;
  return { x, y, rot: mix(p0.rot ?? 0, p1.rot ?? 0, e) + fl, s: mix(p0.s ?? 1, p1.s ?? 1, e), turn: Math.max(0, Math.sin(e * Math.PI)) * .18 };
}

// ---------- the application form (carrier c06 → c07) ----------
function formSprite() {
  return once('form', () => {
    const w = 360, h = 250, [c, g] = canvas(w * SPR, h * SPR); g.scale(SPR, SPR); const r = prng(11);
    const pg = g.createLinearGradient(0, 0, w, h); pg.addColorStop(0, '#f7f0de'); pg.addColorStop(1, '#e6dabd'); g.fillStyle = pg; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) { g.fillStyle = r() < .5 ? 'rgba(120,96,60,.06)' : 'rgba(255,255,255,.12)'; g.fillRect(r() * w, r() * h, .8 + r() * 1.6, .5); }
    g.fillStyle = rgba(INK, .85); g.fillRect(18, 18, w - 36, 2.2); g.fillRect(18, 23, w - 36, .7);
    g.font = '600 10px "Inter"'; try { g.letterSpacing = '2.6px'; } catch { } g.fillStyle = rgba(INK, .8); g.fillText('ACCOUNT FOR A CHILD', 18, 42);
    g.font = '600 7px "Inter"'; g.fillStyle = rgba(INK, .55);
    const field = (y, lab, wl) => { g.fillText(lab, 18, y - 14); g.fillStyle = rgba(INK, .4); g.fillRect(18, y, wl, .9); g.fillStyle = rgba(INK, .55); };
    field(80, 'NAME OF CHILD', 210); field(118, 'DATE OF BIRTH', 120); field(156, 'PARENT', 210);
    // the tick box with the amount
    g.strokeStyle = rgba(INK, .8); g.lineWidth = 1.3; g.strokeRect(250, 92, 22, 22);
    g.font = '24px "Instrument Serif"'; try { g.letterSpacing = '0px'; } catch { } g.fillStyle = rgba(INK, .9); g.fillText('$1,000', 280, 111);
    g.font = '600 6px "Inter"'; g.fillStyle = rgba(INK, .5); g.fillText('INVESTED IN THE STOCK MARKET', 250, 128);
    // signature line + small guilloche corner
    g.fillStyle = rgba(INK, .45); g.fillRect(18, 214, 180, .9); g.font = '600 6px "Inter"'; g.fillText('SIGNATURE', 18, 226);
    guillocheBand(g, 220, 200, 120, 18, rgba('#7a3b17', .45), 3, 2);
    return c;
  });
}
export function ideaForm(ctx, x, y, s, r, t, o = {}) {
  const a = o.a ?? 1, ghost = clamp(o.ghost ?? 0), w = 360, h = 250; if (a <= 0) return null;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s);
  ctx.fillStyle = `rgba(6,4,3,${.35 * (1 - ghost * .7)})`; ctx.beginPath(); ctx.roundRect(-w / 2 + 8, -h / 2 + 12, w, h, 4); ctx.fill();
  ctx.globalAlpha = a * (1 - ghost * .82); ctx.drawImage(formSprite(), -w / 2, -h / 2, w, h); ctx.globalAlpha = a;
  if (ghost > 0) { // the dotted card of c06: outline and fields as dots of light
    ctx.save(); ctx.globalAlpha = a * ghost; ctx.fillStyle = '#ffe2b0'; const dot = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(L / 9)); for (let i = 0; i <= n; i++) { ctx.beginPath(); ctx.arc(mix(x0, x1, i / n), mix(y0, y1, i / n), 1.7, 0, TAU); ctx.fill(); } };
    dot(-w / 2, -h / 2, w / 2, -h / 2); dot(w / 2, -h / 2, w / 2, h / 2); dot(w / 2, h / 2, -w / 2, h / 2); dot(-w / 2, h / 2, -w / 2, -h / 2);
    dot(-w / 2 + 18, -h / 2 + 80, -w / 2 + 228, -h / 2 + 80); dot(-w / 2 + 18, -h / 2 + 118, -w / 2 + 138, -h / 2 + 118); dot(-w / 2 + 18, -h / 2 + 214, -w / 2 + 198, -h / 2 + 214);
    ctx.restore();
  }
  // the child's name, the date: unreadable scribble (written by the parent)
  const nm = clamp(o.name ?? 1);
  if (nm > 0) { ctx.save(); ctx.translate(-w / 2, -h / 2); ctx.strokeStyle = 'rgba(26,32,58,.85)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const rr = prng(5); const line = (x0, y0, len, u) => { ctx.beginPath(); let px = x0; ctx.moveTo(px, y0); const n = Math.round(len / 6); for (let i = 0; i < n * u; i++) { px += 6; ctx.quadraticCurveTo(px - 3, y0 - 4 - rr() * 9, px, y0 - (rr() < .3 ? 7 : 1)); } ctx.stroke(); };
    line(22, 74, 150, nm); line(22, 112, 80, clamp(nm * 1.4 - .4)); ctx.restore(); }
  const ck = clamp(o.check ?? 0);
  if (ck > 0) { ctx.save(); ctx.translate(-w / 2 + 250, -h / 2 + 92); ctx.strokeStyle = '#1a2440'; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(3, 11); const u1 = clamp(ck / .35), u2 = clamp((ck - .35) / .65); ctx.lineTo(3 + 6 * u1, 11 + 8 * u1); if (u2 > 0) ctx.lineTo(9 + 20 * u2, 19 - 26 * u2); ctx.stroke(); ctx.restore(); }
  if (o.light) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(-w * .3, -h * .5, 0, -w * .3, -h * .5, w); g.addColorStop(0, rgba('#ffcf8a', .22 * o.light)); g.addColorStop(1, rgba('#ffcf8a', 0)); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h); }
  ctx.restore();
  return { w: w * s, h: h * s };
}
