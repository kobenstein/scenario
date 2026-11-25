// Film 79 · builder B2 kit (c05 noon/allowance/need, c06 the search: grandson + school, c07 grown-ups + farmers + land).
// NEW functions only (the shared libs stay untouched). Same rules as lib/f79_expl.mjs: night ground, cream type in text inks,
// AMBER = you / human, COLD CARMINE = the machine, REST #6a74a8 = everything else (dataviz-validated pair on #0b1238).
// No shadowBlur on low-alpha fills (napi pitfall): glows are expanded low-alpha fills or K.carmGlow.
import { createCanvas } from '@napi-rs/canvas';
import { clipPlate } from '../scenes/clips.mjs';
import * as K from './f79_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, rad, lin, expoOut, expoIn, quartIO, sineIO, glowText, CARM, AMBER } = K;
export const REST = '#6a74a8', SUB = '#a9b2d8', FAINT = rgba('#a9b2d8', .6), PALE = '#b8c4f0', INKC = '#dfe6ff';
export const FIELD = '#7d8a6e';   // farmland (muted, never green-bright: the cold film has no living green)
// type in text inks
export const T = (c, s, x, y, o = {}) => glowText(c, s, x, y, { size: 24, weight: 600, col: P.cream, glow: false, spacing: .12, ...o });
export const SER = (c, s, x, y, o = {}) => glowText(c, s, x, y, { serif: true, size: 64, col: P.cream, glow: false, ...o });
// a curved arrow drawn up to u (quadratic, bend = lift of the midpoint); o.col, o.w, o.dash, o.head, o.a
export function arrow(c, p0, p1, bend, u, o = {}) {
  if (u <= 0) return null; const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2 - bend, N = 40, pts = [];
  for (let i = 0; i <= N; i++) { const s = i / N, a = (1 - s) * (1 - s), b = 2 * (1 - s) * s, d = s * s; pts.push([a * p0[0] + b * mx + d * p1[0], a * p0[1] + b * my + d * p1[1]]); }
  c.save(); c.globalAlpha *= o.a ?? 1; const col = o.col || AMBER.body;
  if (o.under) { c.strokeStyle = rgba(col, .16); c.lineWidth = (o.w ?? 5) * 3.2; c.lineCap = 'round'; K.strokeIn(c, pts, u); }
  c.strokeStyle = col; c.lineWidth = o.w ?? 5; c.lineCap = 'round'; if (o.dash) { c.setLineDash(o.dash); c.lineDashOffset = o.dashOff ?? 0; }
  K.strokeIn(c, pts, u); c.setLineDash([]);
  if (u > .97 && o.head !== false) { const [x, y] = pts[N], [px, py] = pts[N - 3], a = Math.atan2(y - py, x - px), hs = o.hs ?? 20; c.fillStyle = col; c.beginPath(); c.moveTo(x, y); c.lineTo(x - hs * Math.cos(a - .45), y - hs * Math.sin(a - .45)); c.lineTo(x - hs * Math.cos(a + .45), y - hs * Math.sin(a + .45)); c.fill(); }
  c.restore(); return pts;
}
// a point on the same quadratic at s (for things that travel along an arrow)
export function along(p0, p1, bend, s) { const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2 - bend, a = (1 - s) * (1 - s), b = 2 * (1 - s) * s, d = s * s; return [a * p0[0] + b * mx + d * p1[0], a * p0[1] + b * my + d * p1[1]]; }
// the carmine strike across a word or sign (drawn on the word, ≤ 4 frames), o.w
export function strike(c, x0, y0, x1, y1, u, o = {}) {
  if (u <= 0) return; c.save(); c.globalAlpha *= o.a ?? 1; c.lineCap = 'round';
  c.strokeStyle = rgba(CARM.hot, .18); c.lineWidth = (o.w ?? 7) * 3; K.strokeIn(c, [[x0, y0], [x1, y1]], expoOut(u));
  c.strokeStyle = CARM.hot; c.lineWidth = o.w ?? 7; K.strokeIn(c, [[x0, y0], [x1, y1]], expoOut(u)); c.restore();
}
// a word that rises in on u and can be struck through (k = strike 0..1); returns its width
export function struckWord(c, s, x, y, size, u, k, o = {}) {
  if (u <= 0) return 0; const serif = o.serif ?? true, wd = K.measure(s, size, serif, o.weight ?? 600), x0 = o.align === 'center' ? x - wd / 2 : x;
  c.save(); c.globalAlpha *= (o.a ?? 1); K.maskLine(c, [[s, 0]], x0, y, size, K.rise(u), { serif, weight: o.weight ?? 600, col: o.col ?? P.cream, glow: false }); c.restore();
  if (k > 0) { c.save(); c.globalAlpha *= (o.a ?? 1) * (o.dim ? 1 : 1); strike(c, x0 - 12, y - size * .32 + 6, x0 + wd + 12, y - size * .32 - 6, k, { w: Math.max(5, size * .07) }); c.restore(); }
  return wd;
}
// a rubber stamp that lands on the word (scale 1.5 → 1, a small squash); col, o.rot; u 0..1 landing; returns [w, h]
export function stamp(c, s, x, y, u, o = {}) {
  if (u <= 0) return; const size = o.size ?? 64, col = o.col ?? AMBER.body, w = K.measure(s, size, false, 800) + size * .9, h = size * 1.45;
  const e = expoOut(clamp(u * 1.6)), sc = lerp(1.6, 1, e) * (1 - .05 * Math.sin(Math.PI * clamp(u * 1.6 - .5))), rot = o.rot ?? -.06;
  c.save(); c.globalAlpha *= clamp(u * 3) * (o.a ?? 1); c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
  c.strokeStyle = col; c.lineWidth = Math.max(4, size * .08); c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 10); c.stroke();
  c.lineWidth = 2; c.beginPath(); c.roundRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 6); c.stroke();
  c.font = `800 ${size}px Inter`; c.letterSpacing = '0.08em'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col; c.fillText(s, 0, 4); c.letterSpacing = '0em';
  c.restore(); return [w, h];
}
// a little house glyph (the street drawn as signs): o.col body, o.roof, o.lit (window amber 0..1), o.door 'you' (amber), o.a
export function houseIcon(c, x, y, s, o = {}) {
  c.save(); c.globalAlpha *= o.a ?? 1; c.translate(x, y); c.scale(s, s);
  c.fillStyle = o.col || '#2a3470'; c.fillRect(-40, -60, 80, 60); c.fillStyle = o.roof || '#202a62'; c.beginPath(); c.moveTo(-50, -60); c.lineTo(0, -100); c.lineTo(50, -60); c.fill();
  c.fillStyle = mixHex('#33497a', '#ffd36a', clamp(o.lit ?? 0)); c.fillRect(-28, -48, 20, 18); c.fillRect(8, -48, 20, 18);
  c.fillStyle = o.door === 'you' ? '#f2b632' : '#1a2054'; c.fillRect(-9, -26, 18, 26);
  c.restore();
}
// the same house as a cream ink outline (the search drawing)
export function houseInk(c, x, y, w, h, o = {}) {
  c.save(); c.globalAlpha *= o.a ?? 1; K.ink(c, o.col || rgba(INKC, .7), o.lw ?? 2.4);
  c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h); c.lineTo(x + w / 2, y - h - w * .34); c.lineTo(x + w, y - h); c.lineTo(x + w, y); c.stroke();
  const ww = w * .2, wh = h * .22, wins = [];
  for (const [u, v] of [[.18, .2], [.62, .2], [.62, .58]]) { const wx = x + w * u, wy = y - h + h * v; c.strokeRect(wx, wy, ww, wh); wins.push([wx + ww / 2, wy + wh / 2]); }
  const dx = x + w * .18, dh = h * .36; if (o.door) { c.save(); c.fillStyle = o.door; c.fillRect(dx, y - dh, ww, dh); c.restore(); } else c.strokeRect(dx, y - dh, ww, dh);
  c.restore(); return wins;
}
// the cream search ring (a looking glass without a glass): a ring, four ticks, a slow turn; a 0..1
export function searchRing(c, t, x, y, r, a = 1) {
  if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y);
  c.fillStyle = rad(c, 0, 0, r * 1.6, [[0, rgba('#f3efe2', .06)], [.6, rgba('#f3efe2', .05)], [1, rgba('#f3efe2', 0)]]); c.fillRect(-r * 1.6, -r * 1.6, r * 3.2, r * 3.2);
  c.strokeStyle = rgba('#f3efe2', .22); c.lineWidth = 12; c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke();
  c.strokeStyle = '#f3efe2'; c.lineWidth = 3.5; c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke();
  c.rotate(t * .25); c.lineWidth = 3; for (let k = 0; k < 4; k++) { c.rotate(Math.PI / 2); c.beginPath(); c.moveTo(r + 6, 0); c.lineTo(r + 20, 0); c.stroke(); }
  c.restore();
}
// counter tag top right: LABEL + big serif number (n may be a string); u rise
export function counterTag(c, label, n, x, y, u, o = {}) {
  if (u <= 0) return; c.save(); c.globalAlpha *= clamp(u * 2);
  c.fillStyle = rad(c, x - 120, y - 20, 300, [[0, rgba('#060a24', .55)], [1, rgba('#060a24', 0)]]); c.fillRect(x - 420, y - 320, 600, 600);
  K.maskLine(c, [[label, 0]], x, y - 6, 24, K.rise(u), { serif: false, weight: 600, col: o.labCol ?? '#c9b8d6', glow: false, align: 'right' });
  c.restore();
  c.save(); c.globalAlpha *= clamp(u * 2); glowText(c, String(n), x, y + 84, { serif: true, size: 96, col: o.col ?? P.cream, align: 'right', glow: false }); c.restore();
}
// a check tick drawn to u
export function tick(c, x, y, s, u, col = P.cream, w = 5) { if (u <= 0) return; c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; K.strokeIn(c, [[x - s * .5, y], [x - s * .12, y + s * .4], [x + s * .6, y - s * .5]], u); c.restore(); }
// a parcel (cream box, carmine tape: the machines picked it); o.rot
export function parcel(c, x, y, s, o = {}) {
  c.save(); c.globalAlpha *= o.a ?? 1; c.translate(x, y); c.rotate(o.rot ?? 0); c.scale(s, s);
  c.fillStyle = mixHex('#d9cfb6', o.shade ?? '#1a2054', o.dim ?? .25); c.fillRect(-30, -44, 60, 44); c.fillStyle = mixHex('#efe6cf', o.shade ?? '#1a2054', o.dim ?? .2); c.beginPath(); c.moveTo(-30, -44); c.lineTo(-20, -54); c.lineTo(40, -54); c.lineTo(30, -44); c.fill();
  c.fillStyle = mixHex('#b9ad94', o.shade ?? '#1a2054', o.dim ?? .3); c.beginPath(); c.moveTo(30, -44); c.lineTo(40, -54); c.lineTo(40, -10); c.lineTo(30, 0); c.fill();
  c.fillStyle = CARM.body; c.fillRect(-4, -44, 8, 44); c.beginPath(); c.moveTo(-4, -44); c.lineTo(6, -54); c.lineTo(14, -54); c.lineTo(4, -44); c.fill();
  c.restore();
}
// carrier: B is revealed inside a rect that grows from r0 (a card, a stamp, a page) to the full frame; A outside it; a cream rim on the edge.
// rect: [x,y,w,h] or fn(t, sA) of shot A. Works like K.portal without scaling B (a mask out of an object, MOTION §7.4/§7.5).
export const maskGrow = (rect, o = {}) => (ctx, u, dA, dB, t) => {
  const r0 = typeof rect === 'function' ? rect(t) : rect, e = quartIO(clamp(u)), pad = 30;
  const x = lerp(r0[0], -pad, e), y = lerp(r0[1], -pad, e), w = lerp(r0[2], W + 2 * pad, e), h = lerp(r0[3], H + 2 * pad, e), rr = lerp(o.r ?? 10, 0, e);
  if (o.pushA) K.outer({ k: 1 + e * o.pushA, e: (r0[0] + r0[2] / 2) * -e * o.pushA, f: (r0[1] + r0[3] / 2) * -e * o.pushA }, () => dA(ctx)); else dA(ctx);
  withAlpha(ctx, clamp(u / .12), (c) => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.roundRect(x, y, w, h, rr); c.clip(); dB(c); c.restore(); });
  if (e < .98) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(o.rim || '#f3efe2', .85 * (1 - e)); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, rr); ctx.stroke(); ctx.restore(); }
};
// ---------------------------------------------------------------- the street's windows (chime points at noon)
// design windows of the far houses of S.street (card 7000; S.street draws them with K.house defaults, door in col 0)
const FAR = [[470, 1], [620, 1], [1170, -1], [1320, -1]].map(([x]) => { const w = 140, h = 120, base = 600, out = []; for (const [r, cc] of [[0, 0], [0, 1], [1, 1]]) out.push([x + w * (.18 + cc * .64) + w * .1, base - h + h * (.16 + r * .62) + h * .1]); return out; }).flat();
// every window of the street as [Z, x, y, near 0..1] (near = 1 your side up front, 0 far end): needs S.street's return value
export function streetWindows(out) {
  const L = [];
  for (const [x, y] of FAR) L.push([7000, x, y, 0]);
  for (const g of out.mid || []) for (const [x, y, w, h] of g.win) L.push([4200, x + w / 2, y + h / 2, .5]);
  for (const g of [out.yours, out.across]) if (g && g.win) for (const [x, y, w, h] of g.win) L.push([2600, x + w / 2, y + h / 2, 1]);
  return L;
}
// chime points in screen space: f(win, i) → 0..1 (point), rip(win, i) → 0..1 (a ring travelling out once)
export function chimes(ctx, t, cam, wins, f, rip) {
  K.scr(ctx, (c) => {
    wins.forEach((wn, i) => {
      const [Z, x, y] = wn, p = K.project(cam, Z, x, y); if (!p) return; const a = clamp(f(wn, i)), k = p[2];
      if (a > 0) { K.carmGlow(c, p[0], p[1], 70 * k + 20, .32 * a); c.fillStyle = rgba(CARM.core, .95 * a); c.beginPath(); c.arc(p[0], p[1], Math.max(2.5, 7 * k), 0, 7); c.fill(); }
      const q = rip ? clamp(rip(wn, i)) : 0; if (q > 0 && q < 1) { c.strokeStyle = rgba(CARM.hot, .8 * (1 - q)); c.lineWidth = Math.max(1.5, 3 * k); c.beginPath(); c.arc(p[0], p[1], (10 + 90 * expoOut(q)) * k + 4, 0, 7); c.stroke(); }
    });
  });
}
// ---------------------------------------------------------------- ink figures (inside paper cards: the past)
export const INK = { base: '#1f3c8a', lit: '#3a5aa8', shade: '#16296a', deep: '#0e1a4a', hem: .44 };
export const inkFig = (c, x, y, h, o = {}) => K.figureRaw(c, x, y, h, { look: o.look ?? 0, dir: o.dir ?? 1, ...o }, o.pal || INK, false);
// ---------------------------------------------------------------- the field map (farmers' land): a grid of parcels seen from above
// o.flip(i) 0..1 farmland → carmine, o.sold(i) 0..1 a SOLD tag, o.slip(i) 0..1 an offer slip lands, o.a; returns parcel centres
export function fieldMap(c, t, x0, y0, cols, rows, cw, ch, o = {}) {
  const cs = [], r = K.prng(o.seed ?? 7);
  c.save(); c.globalAlpha *= o.a ?? 1;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const k = j * cols + i, jx = (r() - .5) * cw * .12, jy = (r() - .5) * ch * .12, x = x0 + i * cw + jx, y = y0 + j * ch + jy, w = cw - 8, h = ch - 8, f = clamp(o.flip ? o.flip(k) : 0);
    c.fillStyle = mixHex(mixHex(FIELD, '#0b1238', .25), CARM.body, f); c.beginPath(); c.roundRect(x, y, w, h, 4); c.fill();
    if (f < .5) { c.strokeStyle = rgba('#e8eefc', .1 * (1 - f * 2)); c.lineWidth = 1.5; for (let q = 1; q < 6; q++) { c.beginPath(); c.moveTo(x + 6, y + h * q / 6); c.lineTo(x + w - 6, y + h * q / 6); c.stroke(); } }
    else { c.fillStyle = rgba('#ffe3ea', .12 * f); for (let q = 1; q < 5; q++) c.fillRect(x + 6, y + h * q / 5 - 2, w - 12, 3); }
    cs.push([x + w / 2, y + h / 2, w, h]);
  }
  c.restore(); return cs;
}
// an offer slip (cream paper, OFFER in ink) falling onto a point; u 0..1 (falls and lands), o.rot
export function slip(c, x, y, u, o = {}) {
  if (u <= 0) return; const e = expoOut(clamp(u)), yy = lerp(y - 160, y, e), rot = lerp(o.rot0 ?? -.5, o.rot ?? -.08, e) + .02 * Math.sin(u * 9) * (1 - e);
  c.save(); c.globalAlpha *= clamp(u * 4); c.translate(x, yy); c.rotate(rot);
  c.fillStyle = rgba('#0a1030', .3); c.fillRect(-46, -24, 96, 56); c.fillStyle = K.PAPER.lit; c.fillRect(-50, -30, 96, 56);
  c.fillStyle = K.PAPER.ink; c.font = '700 22px Inter'; c.textAlign = 'center'; c.fillText(o.text ?? 'OFFER', -2, 2); c.fillStyle = rgba(K.PAPER.ink2, .6); c.fillRect(-36, 10, 68, 3); c.fillRect(-36, 18, 44, 3);
  c.restore();
}
// ---------------------------------------------------------------- interview plate (own copy: the lower third of film 79 on two lines)
// The frames come from scenes/clips.mjs (film.prepare awaits their decoding every frame): clips.clipPlate draws the frame at full size into an
// offscreen canvas and the plate copies its picture area (the #74 lower third of clips.mjs is never copied).
let OFF = null;
function clipFrameInto(ctx, t, T, id, x, y, w, h) {
  if (!OFF) OFF = createCanvas(W, H); const o = OFF.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, W, H);
  clipPlate(o, t, T, id, [320, 132, 1280, 720], 1); ctx.drawImage(OFF, 323, 135, 1274, 714, x, y, w, h);
}
export const PLATE = { x: 320, y: 160, w: 1280, h: 720 };   // bottom at 880: nothing below the subtitle line; name + role above the plate
// m 0..1: the plate grows out of rect `from` (the paper card) into PLATE; info { name, role, year, src, quote }
export function plate(ctx, t, T, id, from, m, info) {
  const R = PLATE, c = T.clip(id) || { start: t, end: t + 1 }, e = sineIO(clamp(m));
  const x = lerp(from[0], R.x, e), y = lerp(from[1], R.y, e), w = lerp(from[2], R.w, e), h = lerp(from[3], R.h, e);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(m * 3);   // fades in/out at the card's size (no pop)
  ctx.fillStyle = rgba('#060a24', .5 * e); ctx.beginPath(); ctx.roundRect(x - 18 * e, y - 6 * e, w + 36 * e, h + 30 * e, 12); ctx.fill();
  ctx.fillStyle = '#0d1438'; ctx.beginPath(); ctx.roundRect(x - 12 * e, y - 12 * e, w + 24 * e, h + 24 * e, 10); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.clip();
  clipFrameInto(ctx, t, T, id, x, y, w, h);
  ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.stroke();
  const lu = span(t, c.start + .2, c.start + 1.0) * (1 - span(t, c.end - .5, c.end)) * span(e, .85, 1);
  if (lu > 0) {
    K.maskLine(ctx, [[info.name, 0]], R.x, 92, 46, K.rise(lu), { glow: false, col: P.cream });
    K.maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x, 134, 22, K.rise(span(lu, .1, 1)), { serif: false, weight: 600, col: SUB, glow: false });
    K.maskLine(ctx, [[`ORIGINAL FOOTAGE (${info.src.toUpperCase()})`, 0]], R.x + R.w, 134, 22, K.rise(span(lu, .2, 1)), { serif: false, weight: 600, align: 'right', col: '#ffe7a8', glow: false });
  }
  ctx.restore();
}
export const DUVENAUD = { name: 'David Duvenaud', role: 'Computer scientist, University of Toronto', year: '2026', src: '80,000 Hours', quote: '"Life can only get so bad when you\'re needed."' };
// ---------------------------------------------------------------- the allowance line: months as steps, never an amount
// pts: levels per month (0..1 of the frame band, lower = less); u draw; o.dashFrom (index from which the line is dotted: the future)
export function stepLine(c, x0, x1, yTop, yBot, levels, u, o = {}) {
  const n = levels.length, dx = (x1 - x0) / n, pts = [];
  levels.forEach((lv, i) => { const y = lerp(yBot, yTop, lv); pts.push([x0 + i * dx, y], [x0 + (i + 1) * dx, y]); });
  const solid = o.dashFrom != null ? pts.slice(0, o.dashFrom * 2) : pts, dash = o.dashFrom != null ? pts.slice(o.dashFrom * 2 - 1) : [];
  const tot = pts.length - 1, us = clamp(u * tot / Math.max(1, solid.length - 1));
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  c.strokeStyle = rgba(o.col ?? SUB, .16); c.lineWidth = (o.w ?? 5) * 3; K.strokeIn(c, solid, us);
  c.strokeStyle = o.col ?? SUB; c.lineWidth = o.w ?? 5; K.strokeIn(c, solid, us);
  if (dash.length > 1) { const ud = clamp((u * tot - (solid.length - 1)) / Math.max(1, dash.length - 1)); if (ud > 0) { c.setLineDash([6, 12]); c.lineDashOffset = o.dashOff ?? 0; K.strokeIn(c, dash, ud); c.setLineDash([]); } }
  c.restore(); return { pts, dx };
}
// ---------------------------------------------------------------- the search (c06/c07): the street as a cream ink drawing on the night ground
// 7 houses (yours = index 2, amber door), the fence and the tower at the right end. Returns { wins: [[x,y]…] per house (3 each), house(i): [x, base, w, h], end: [x,y] }
export const SEARCH = { x0: 170, gap: 214, base: 730, w: 176, h: 170 };
export function searchStreet(c, t, o = {}) {
  const { x0, gap, base, w, h } = SEARCH, a = o.a ?? 1, res = { wins: [], house: (i) => [x0 + i * gap, base, w, h] };
  c.save(); c.globalAlpha *= a;
  c.strokeStyle = rgba(INKC, .35); c.lineWidth = 2; c.beginPath(); c.moveTo(60, base + 2); c.lineTo(1860, base + 2); c.stroke();
  for (let i = 0; i < 7; i++) { const hu = span(o.build ?? 1, i * .08, .4 + i * .08); if (hu <= 0) { res.wins.push([]); continue; }
    c.save(); c.globalAlpha *= hu; res.wins.push(houseInk(c, x0 + i * gap, base, w, h, { door: i === 2 ? '#f2b632' : null, col: rgba(INKC, i === o.hi ? .95 : .62) })); c.restore(); }
  // the fence and the tower at the end of the street
  const fx = x0 + 7 * gap + 10; K.ink(c, rgba(INKC, .5), 2); for (let x = fx; x < fx + 120; x += 14) { c.beginPath(); c.moveTo(x, base); c.lineTo(x, base - 70); c.stroke(); }
  c.beginPath(); c.moveTo(fx - 4, base - 60); c.lineTo(fx + 124, base - 60); c.stroke();
  c.strokeStyle = rgba(INKC, .5); c.strokeRect(fx + 30, base - 330, 70, 330); K.lightBand(c, t, fx + 32, base - 300, fx + 98, base - 300, 4, .9);
  res.end = [fx + 60, base - 100];
  c.restore(); return res;
}
// ---------------------------------------------------------------- calmer portal / iris (smooth.py: no lurch at the seams)
// K.portal and K.iris zoom exponentially along quartIO(u): the zoom rate peaks at 2× the mean and lurches at high contrast. These 'fn'
// carriers feed them a trapezoid velocity profile instead (ramps r, peak 1/(1-r)): the zoom runs at a near-constant rate, like a dolly.
const invQuart = (e) => (e < .5 ? Math.pow(e / 8, .25) : 1 - Math.pow(2 * (1 - e), .25) / 2);
export function trap(u, r = .3) { u = clamp(u); const vp = 1 / (1 - r); if (u < r) return vp * u * u / (2 * r); if (u > 1 - r) return 1 - vp * (1 - u) * (1 - u) / (2 * r); return vp * (u - r / 2); }
const val = (v, t) => (typeof v === 'function' ? v(t) : v);
// win / c: a value or fn(t); o: K.portal / K.iris options + lead, dur, r (ramp share)
// B fades into the window / circle over the first 12 % (a small region: no POP when the carrier starts); the iris rim fades in with it.
let FOFF = null;
export function withAlpha(ctx, a, draw) {   // draw into an offscreen frame, composite at alpha a (draws that set globalAlpha themselves stay faded)
  if (a >= 1) return draw(ctx); if (a <= 0) return;
  if (!FOFF) FOFF = createCanvas(W, H); const oc = FOFF.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.globalAlpha = 1; oc.clearRect(0, 0, W, H);
  draw(oc); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(FOFF, 0, 0); ctx.restore();
}
const fadeIn = (ctx, u, draw) => { const f = clamp(u / .12); if (f >= 1) return draw(ctx, true); draw(ctx, false); withAlpha(ctx, f, (c) => draw(c, true)); };
const nop = () => {};
export const portalS = (win, o = {}) => ({ k: 'fn', lead: o.lead ?? .5, dur: o.dur ?? 1.8, fn: (ctx, u, dA, dB, t) => { const e = invQuart(trap(u, o.r)), w = val(win, t); fadeIn(ctx, u, (c, b) => K.portal(c, e, w, dA, b ? dB : nop, o)); } });
export const irisS = (c, o = {}) => ({ k: 'fn', lead: o.lead ?? .5, dur: o.dur ?? 1.7, fn: (ctx, u, dA, dB, t) => { const e = invQuart(trap(u, o.r)), cc = val(c, t); const oo = { ...o, pushA: Math.min(o.pushA ?? .5, .2) }; fadeIn(ctx, u, (c, b) => K.iris(c, e, cc, dA, b ? dB : nop, b ? oo : { ...oo, rim: false })); } });
// calmShots: the chunk's portal/iris carriers → portalS/irisS with at least o.lead / o.dur. A rect/centre fn(t, s) gets the helpers s
// of shot A as its last draw saw them (when A has not been drawn yet, e.g. a render that starts inside the carrier, A is drawn once into a
// scratch canvas first, so the rect is right from the first frame).
let SCR = null;
// R (row times) keeps carriers from overlapping: a carrier into a short shot B ends .1 s before B's own carrier starts.
export function calmShots(shots, R, o = {}) {
  const HS = {}, isZ = (sh) => sh.out && (sh.out.k === 'portal' || sh.out.k === 'iris');
  const len = (i) => (i + 1 < shots.length ? R[shots[i + 1].id] - R[shots[i].id] : Infinity);
  const leads = shots.map((sh, i) => (isZ(sh) ? Math.min(Math.max(sh.out.lead ?? .4, o.lead ?? .5), .4 * len(i)) : (sh.out ? sh.out.lead ?? .4 : 0)));
  return shots.map((sh, i) => {
    const d = sh.draw, out = sh.out, ns = { ...sh, draw(ctx, t, s) { HS[sh.id] = s; return d.call(this, ctx, t, s); } };
    if (isZ(sh)) {
      const v = out.k === 'portal' ? out.win : out.c, lenB = i + 1 < shots.length ? len(i + 1) : Infinity, leadB = i + 1 < shots.length ? leads[i + 1] : 0;
      const dur = Math.min(Math.max(out.dur ?? .9, o.dur ?? 1.5), lenB - leadB + leads[i] - .1);
      const opts = { ...out, lead: leads[i], dur: Math.max(dur, out.dur ?? .9) };   // o.dur default 1.4
      const f = typeof v === 'function' ? (t) => v(t, HS[sh.id]) : v;
      const c = out.k === 'portal' ? portalS(f, opts) : irisS(f, opts), fn0 = c.fn;
      c.fn = (ctx, u, dA, dB, t) => { if (!HS[sh.id]) { if (!SCR) SCR = createCanvas(W, H); dA(SCR.getContext('2d')); } return fn0(ctx, u, dA, dB, t); };
      ns.out = c;
    }
    return ns;
  });
}
