// Film 72 · "Why AI Billionaires Are Building Bunkers" · shared kit (owned by the lead; builders import as F, never edit — wishes go in the report).
// Base (ported 1:1 from film 73's kit, which stands on lib/f10_editorial.mjs + f16_kit + f54_kit): text in gold (goldText, goldSpan, goldLabel),
// edge-safe text, paper / data / quote cards, verdict words, clip plates (ORIGINAL FOOTAGE), the source line, camPath, float, veil.
// NEW for film 72 (below the base): the title, the colour code, THE LIST (the motor: WHAT ARE THEY HIDING FROM?), the objects of the film
// (the hatch, lantern people + the lantern crowd, the AI disc + beam, the glass room, the three vignettes, the bunker in section with its
// concrete door and supply shelves, the supply clock, floor plans, evidence cards + thread, word badges, the Swiss house, the rock hall,
// the data centre, the studio lamp) and SOURCES (every on-screen string; never retype a figure).
// Stage (THE GROUND LINE): lib/f72_stage.mjs · Leitbild (A2: the hatch + the lantern crowd) + seam plates + the Earth + end screen:
// lib/f72_world.mjs · rules: docs/MOTION.md.
//
// Colour code (never violate): GOLD = people, warmth, lanterns, what holds (the ONE hero light per frame) · CREAM = drawings, text, paper,
// the ground line, strikes · COOL = machines, AI (always a DISC, never a robot) · CONCRETE = grey-blue, the bunker's walls and its door ·
// SOIL = the night earth below the line · the yellow coat = only you. NEVER RED (not even for alarms or mutiny), never a vault door seen
// from the front, never a key, a clock face, an hourglass, a rubber stamp, a blueprint grid (films 14, 55, 69, 73).
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing from nowhere.
import { Path2D, loadImage, GlobalFonts, createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import * as F54 from './f54_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, maskLine, measure, stamp } = K16;
export const { du, person, cam3, card, camAt, camDrift, aim, project, F0, glowText } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
export const { bracket } = F54;
// source line: 22 px, baseline y 880. Lines wider than 1700 px (the fact-checked lines are long) break at the ' · ' that balances best:
// two lines at y 852 / 880 (nothing below 880). Width measured in Inter 600, upper case.
const SMEAS = createCanvas(8, 8).getContext('2d');
export function sourceLines(s, size = 22) {
  SMEAS.font = `600 ${size}px Inter`; const w = (x) => SMEAS.measureText(x.toUpperCase()).width;
  if (w(s) <= 1700) return [s];
  const parts = s.split(' · '); let best = null;
  for (let i = 1; i < parts.length; i++) { const a = parts.slice(0, i).join(' · '), b = parts.slice(i).join(' · '), m = Math.max(w(a), w(b)); if (!best || m < best[0]) best = [m, a, b]; }
  return best ? [best[1], best[2]] : [s];
}
export const source = (ctx, t, t0, t1, s, o = {}) => { const L = sourceLines(s, o.size ?? 22), y = o.y ?? 880;
  L.forEach((line, i) => F54.source(ctx, t, t0 + i * .06, t1, line, { size: 22, ...o, y: y - (L.length - 1 - i) * 28 })); };   // ≥ 22 px
// camPath(t, K, ref = 6000): a camera that glides THROUGH its keys [[t, cam], …] (monotone cubic in x, y and log distance to the card
// at depth ref). (film 66)
export const REF = 6000;
export function camPath(t, K, ref = REF) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(ref - c.z)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: ref - Math.exp(out[2]) });
}
const TAU = Math.PI * 2;
try { GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'Inter Black'); } catch { /* falls back to Inter 600 */ }

export const PRINT72 = { grain: 14, floor: 4, vig: .5 };
export const CREAM = '#f3efe2', CREAM2 = '#a49fc4';
export const GOLD = { core: '#fff8dc', hot: '#ffe9a6', body: '#f6c95c', mid: '#e3a63f', shade: '#b8792a', deep: '#6e4416', halo: '#f2b632', line: '#ffd982', text: '#ffe7a8' };
export const PAPER = { body: '#ece4c8', lit: '#f7f0d8', shade: '#cfc4a2', edge: '#a99d7c', ink: '#141a3c', faint: '#8a8166' };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
export const EARTH = { top: '#6b4a2c', body: '#4a2f1e', deep: '#2a1a14', warm: '#8a5a32', line: '#a77443', rim: '#c48a52' };
export const INK = { far: mixHex(P.ind0, P.blue0, .3), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, rim: mixHex(GOLD.line, P.blue1, .55) };
export const LAMP = { core: P.cream, body: mixHex(P.cream, P.halo2, .35), deep: mixHex(P.halo2, P.night1, .55) };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== TEXT IN GOLD
export function goldText(ctx, segs, x, y, size, u, o = {}) {
  const serif = o.serif ?? true, k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15;
  const mw = (txt) => measure(txt, size, serif, o.weight) + (o.spacing ? txt.length * size * o.spacing : 0);
  const total = segs.reduce((s, [txt]) => s + mw(txt), 0);
  let xx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x; const xs = [];
  ctx.save(); ctx.beginPath(); ctx.rect(xx - size, y - size * 1.25, total + size * 2, size * 1.25 + size * .32); ctx.clip();
  for (const [txt, m] of segs) {
    xs.push(xx);
    E.glowText(ctx, txt, xx, y + dy, { size, serif, col: mixHex(o.col ?? P.cream, GOLD.body, clamp(m)), weight: o.weight, glow: o.glow ?? false, spacing: o.spacing });
    xx += mw(txt);
  }
  ctx.restore();
  return { w: total, xs, x0: xs[0] };
}
export function goldSpan(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(u0 * L), [ex, ey, i1] = at(u1 * L), sub = [[sx, sy]];
  for (let i = i0; i < i1; i++) sub.push([pts[i][0], pts[i][1]]);
  sub.push([ex, ey]);
  const w = o.w ?? 3, a = o.a ?? 1;
  for (const [k, al, c, op] of [[4.5, .2, GOLD.halo, 'lighter'], [2.1, .8, GOLD.body, 'source-over'], [.9, 1, GOLD.core, 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = c; ctx.globalAlpha = al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  }
  if (o.spark !== false && u1 < 1) halo(ctx, ex, ey, w * 10, .6 * a, GOLD.halo, GOLD.core);
  return [ex, ey];
}
export function goldLabel(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 50, dy = o.dy ?? -50, x1 = x + dx, y1 = y + dy, sz = o.size ?? 26;
  goldSpan(ctx, [[x, y], [x1, y1]], 0, smooth(clamp(u * 1.6)), { w: 1.4, spark: false });
  const left = dx < 0;
  maskLine(ctx, [[l1, 0]], x1 + (left ? -measure(l1, sz, false) - 8 : 8), y1 - 10, sz, u, { serif: false, weight: 600, col: P.cream, glow: false });
  if (l2) maskLine(ctx, [[l2, 0]], x1 + (left ? -measure(l2, sz * .72, false) - 8 : 8), y1 + sz * .95, sz * .72, rise(span(u, .2, 1)), { serif: false, weight: 600, col: GOLD.text, glow: false });
}

// ======================================================================================================================== EDGE-SAFE TEXT (Jakob 23.11.: no cut-off titles)
// Big words that the camera carries past the frame edge must never read as "cut off": a line is drawn through an offscreen pass whose
// alpha falls to 0 over the last EDGE px at the frame edges, and the whole line fades out as less of it is on screen (gone at <= 62 %).
// bbox = { x, y, w, h } in the CURRENT (world) transform. Continuous in t (the mask is fixed to the screen, the fade follows the bbox).
let ES = null;
export function edgeSafe(ctx, bbox, draw) {
  const m = ctx.getTransform(), cw = ctx.canvas.width, ch = ctx.canvas.height, k = cw / W, EDGE = 80 * k;
  const pts = [[bbox.x, bbox.y], [bbox.x + bbox.w, bbox.y], [bbox.x, bbox.y + bbox.h], [bbox.x + bbox.w, bbox.y + bbox.h]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
  const x0 = Math.min(...pts.map((p) => p[0])), x1 = Math.max(...pts.map((p) => p[0])), y0 = Math.min(...pts.map((p) => p[1])), y1 = Math.max(...pts.map((p) => p[1]));
  if (x0 >= EDGE && y0 >= EDGE * .5 && x1 <= cw - EDGE && y1 <= ch - EDGE * .5) { draw(ctx); return; }
  const area = Math.max(1, (x1 - x0) * (y1 - y0)), vis = Math.max(0, Math.min(x1, cw) - Math.max(x0, 0)) * Math.max(0, Math.min(y1, ch) - Math.max(y0, 0)) / area;
  const a = smooth(clamp((vis - .9) / .1)); if (a <= 0) return;
  if (!ES || ES.width !== cw || ES.height !== ch) ES = createCanvas(cw, ch);
  const g = ES.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, cw, ch);
  g.setTransform(m); draw(g);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-in';
  const gx = g.createLinearGradient(0, 0, cw, 0); gx.addColorStop(0, 'rgba(0,0,0,0)'); gx.addColorStop(EDGE / cw, 'rgba(0,0,0,1)'); gx.addColorStop(1 - EDGE / cw, 'rgba(0,0,0,1)'); gx.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gx; g.fillRect(0, 0, cw, ch);
  const E2 = EDGE * .5, gy = g.createLinearGradient(0, 0, 0, ch); gy.addColorStop(0, 'rgba(0,0,0,0)'); gy.addColorStop(E2 / ch, 'rgba(0,0,0,1)'); gy.addColorStop(1 - E2 / ch, 'rgba(0,0,0,1)'); gy.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gy; g.fillRect(0, 0, cw, ch); g.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a; ctx.drawImage(ES, 0, 0); ctx.restore();
}

// ======================================================================================================================== PAPER
// a card: 'paper' (cream, dark ink: warnings, letters, quotes) or 'night' (dark indigo, gold edge: data). lines [[text, size, gold, serif]]
export function paperCard(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const night = o.style === 'night', k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3);
  ctx.translate(x + w / 2, y + h / 2 + (1 - k) * 40); ctx.rotate((o.rot ?? 0) + (1 - k) * .04); ctx.translate(-w / 2, -h / 2);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(6, 10, w, h, 10); ctx.fill();
  ctx.fillStyle = night ? mixHex(P.night1, P.ind2, .55) : lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, night ? 12 : 6); ctx.fill();
  ctx.strokeStyle = night ? rgba(GOLD.line, .55) : rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  let yy = 0;
  if (o.head) { const hs = o.headSize ?? 22; maskLine(ctx, [[o.head, 0]], 34, 50, hs, rise(span(u, .2, .8)), { serif: false, weight: 600, col: night ? GOLD.text : PAPER.faint, glow: false }); yy = 50 + hs * .6; }
  else yy = 20;
  for (const [i, ln] of (o.lines ?? []).entries()) {
    const [txt, size, g = 0, serif = true] = ln; yy += size * 1.18;
    const col = night ? mixHex(P.cream, GOLD.body, g) : mixHex(PAPER.ink, GOLD.deep, g);
    maskLine(ctx, [[txt, 0]], 34, yy, size, rise(span(u, .3 + i * .08, .9 + i * .08)), { serif, weight: 600, col, glow: false });
  }
  if (o.src) maskLine(ctx, [[o.src.toUpperCase(), 0]], 34, h - 24, 22, rise(span(u, .5, 1)), { serif: false, weight: 600, col: night ? P.halo2 : PAPER.faint, glow: false });
  ctx.restore();
  return { x, y, w, h };
}
// a data card (night style, gold edge) with a kind tag (KNOWN / FORECAST / ESTIMATE), a big gold number and one small line
export function dataCard(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const h = o.h ?? (o.small ? 300 : 250);
  const box = paperCard(ctx, t, x, y, w, h, { u, style: 'night', a: o.a, rot: o.rot });
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  if (o.kind) {
    const kc = o.kind === 'KNOWN' ? GOLD.body : o.kind === 'FORECAST' ? COOL.body : PAPER.shade, tw = measure(o.kind, 22, false, 600) + 22 * o.kind.length * .14 + 30;
    ctx.fillStyle = rgba(kc, .16); ctx.strokeStyle = rgba(kc, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(30, 24, tw, 38, 19); ctx.fill(); ctx.stroke();
    E.glowText(ctx, o.kind, 30 + 15, 51, { size: 22, weight: 600, spacing: .14, col: kc, glow: false });
  }
  if (o.title) maskLine(ctx, [[o.title, 0]], 34, 102, 22, rise(span(u, .25, .8)), { serif: false, weight: 600, col: P.halo2, glow: false });
  if (o.big) goldText(ctx, [[o.big, 1]], 32, o.title ? 186 : 160, o.bigSize ?? 76, rise(span(u, .35, 1)), { serif: true });
  if (o.small) maskLine(ctx, [[o.small, 0]], 34, o.title ? 236 : 210, 21, rise(span(u, .5, 1)), { serif: false, weight: 600, col: P.cream, glow: false });
  if (o.src) maskLine(ctx, [[o.src.toUpperCase(), 0]], 34, h - 22, 22, rise(span(u, .55, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
  return box;
}
// a quote card (paper): head (e.g. RISK FACTORS), the quote in serif (wrapped to w), words light gold-ink as they are spoken (o.spoken =
// [fromPhrase, toPhrase] in the VO), else they stand dark ink; credit line at the bottom. Returns the box.
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export function quoteCard(ctx, t, T, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const size = o.size ?? 54, w = o.w ?? 1100, pad = 54, words = o.text.split(/\s+/), lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.join(' '), size, true) > w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const head = o.head ? 64 : 24, h = head + lines.length * size * 1.22 + (o.credit ? 92 : 40);
  // spoken timing: map card words to VO words in order
  let times = null;
  if (o.spoken && T) { try { const ws = T.GW(o.spoken[0], o.spoken[1], o.after ?? -1); times = []; let j = 0; for (const wd of lines.flat()) { const n = nz(wd); let hit = null; for (let q = j; q < ws.length; q++) if (nz(ws[q].w) === n && n) { hit = ws[q].s; j = q + 1; break; } times.push(hit); } } catch { times = null; } }
  const x = o.x ?? (W - w) / 2, y = o.y ?? 200;
  const box = paperCard(ctx, t, x, y, w, h, { u, rot: o.rot ?? -.006, head: o.head, a: o.a });
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  let k = 0;
  lines.forEach((ln, li) => {
    let xx = pad; const yy = head + (li + 1) * size * 1.22;
    for (const wd of ln) {
      const tt = times ? times[k] : null, hiMode = o.mode === 'hi', lit = tt == null ? (times && !hiMode ? .25 : 1) : clamp((t - tt + .05) / .25), g = (o.gold ?? 1) * (times && tt != null ? lit : 0);
      const col = mixHex(mixHex(PAPER.faint, PAPER.ink, times && !hiMode ? lit : (hiMode && tt != null ? 1 : times ? lit : 1)), GOLD.deep, g * .85);
      maskLine(ctx, [[wd + ' ', 0]], xx, yy, size, rise(span(u, .3 + li * .08, .9 + li * .08)), { serif: true, col, glow: false });
      xx += measure(wd, size, true) + size * .26; k++;   // explicit word gap (measure() drops a trailing space)
    }
  });
  if (o.credit) maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 34, 22, rise(span(u, .55, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  ctx.restore();
  return { ...box, h };
}

export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(0, 0, W, H); ctx.restore(); }
export const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .02 * k * Math.sin(t * .6 + 1), dx = E.drift(t * 2, 16 * k, 11), dy = E.drift(t * 2, 10 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The plate grows out of a thing in the world (o.from = { x, y, w, h } screen rect, or [cx, cy, r]) and goes back into it.
// Lower third ABOVE the plate (≥ 22 px): NAME (serif) · ROLE · YEAR … ORIGINAL FOOTAGE (+ credit) at the right. Roles: clips.md.
// <ROOT>clips-geprueft.json (when it lands) overrides name/role/year (fields name, rolle|role, jahr|year, credit, crop, cropDy).
// Frames: <F72CLIPS or /tmp/claude-0/f72/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, frame 1 = the slot start; extract with ffmpeg from <ROOT>clips/Cn.mp4 once clips-geprueft.json exists).
// Until the frames exist a marked placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
// ONE frame design for all clips (25.11.): the plate shows the TOP 5/6 of the source picture, centred horizontally (crop 0.833, top-aligned),
// so the bottom 180 px of a 1080p source never show: (film 73's rule, kept for film 72: one crop for all clips keeps them identical in scale; burned-in captions or bugs at the bottom never show).
// Our own lower third sits ABOVE the plate.
export const CLIP_CROP = 900 / 1080;
export const CLIPS = {   // checked 25.11. (ROOT clips-geprueft.json); credit = the show the footage comes from
  C1: { name: 'Sam Altman', role: 'CEO, OpenAI', year: '2025', credit: 'This Past Weekend w/ Theo Von' },                               // 7.6 s, #599, 23 Jul 2025
  C2: { name: 'Tristan Harris', role: 'Co-founder, Center for Humane Technology', year: '2026', credit: 'Modern Wisdom', crop: 1 },   // 5.6 s (crop 1: the full frame, so the MODERN | WISDOM bug bottom left stays visible), 2 Apr 2026 · bug bottom left stays
  C3: { name: 'Douglas Rushkoff', role: 'Media theorist, author of “Survival of the Richest”', year: '2026', credit: 'The Smart Cookies Podcast' },   // 10.3 s, Cx-nW3PcsrA, 9 Nov 2026
  C2b: { name: 'Tristan Harris', role: 'Co-founder, Center for Humane Technology', year: '2026', credit: 'Modern Wisdom', crop: 1 },  // 5.8 s, same episode as C2
};
try {   // clips-geprueft.json (25.11.): a list [{ id, video_id, channel, upload_date, duration_s, wording, speaker: 'Name, shot note', note }]
  const j = JSON.parse(fs.readFileSync(ROOT + 'clips-geprueft.json', 'utf8'));
  for (const c of (Array.isArray(j) ? j : j.clips || [])) { const k = CLIPS[c.id]; if (!k) continue;
    if (c.speaker) k.name = c.speaker.split(/[,(;]/)[0].trim();
    if (c.upload_date) k.year = String(c.upload_date).slice(0, 4);
    if (c.lower_third) { const q = c.lower_third.split('·').map((x) => x.trim()); if (q.length >= 3) { k.role = q[1]; k.year = q[2]; } }
    for (const [a, b] of [['rolle', 'role'], ['role', 'role'], ['jahr', 'year'], ['year', 'year'], ['credit', 'credit'], ['crop', 'crop'], ['cropDx', 'cropDx'], ['cropDy', 'cropDy']]) if (c[a] != null) k[b] = c[a]; }
} catch { /* not there yet */ }
const CLIPDIR = (process.env.F72CLIPS || '/tmp/claude-0/f72/clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; return Math.max(1, Math.min(n, Math.floor((t - win.start) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    const win = clipWin(T, id); if (!win || t < win.start - 7 || t > win.end + .8) continue;
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
function plateBox(o, R) {
  const m = sineIO(clamp(o.morph ?? 1)), f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(8, f.w / 2) };
  return { m, cx: lerp(fr0.cx, R.x + R.w / 2, m), cy: lerp(fr0.cy, R.y + R.h / 2, m), w: lerp(fr0.w, R.w, m), h: lerp(fr0.h, R.h, m), rr: lerp(fr0.r, 14, m) };
}
// o: { from, morph 0..1 (0 = the source shape, 1 = CLIP_RECT), dark 0..1, credits (false = none), label 0..1 }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], dark = clamp(o.dark ?? 0);
  const { m, cx, cy, w, h, rr } = plateBox(o, R);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const k = frameAt(id, t, win), fr = k ? frameCache.get(framePath(id, k)) : null;
  if (fr) {   // the centre crop (info.crop) hides corner logos; then cover the plate
    const cr = info.crop ?? CLIP_CROP, sw = fr.width * cr, sh = fr.height * cr, sx = Math.max(0, Math.min(fr.width - sw, (fr.width - sw) / 2 + (info.cropDx ?? 0) * fr.width)), sy = Math.max(0, Math.min(fr.height - sh, info.cropDy != null ? (fr.height - sh) / 2 + info.cropDy * fr.height : 0));
    const s = Math.max(R.w / sw, R.h / sh) * (w / R.w), dw = sw * s, dh = sh * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, sx, sy, sw, sh, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1; }
  else {
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx, cy - h * .05, w * .7, [[0, rgba(P.blue0, .5 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {   // the lower third ABOVE the plate (≥ 22 px): NAME · ROLE · YEAR … ORIGINAL FOOTAGE (· credit)
    const by = R.y - 40, nw = measure(info.name, 44, true);
    maskLine(ctx, [[info.name, 0]], R.x, by, 44, rise(lu), { glow: true });
    maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x + nw + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
    goldText(ctx, [[info.credit ? `ORIGINAL FOOTAGE · ${info.credit.toUpperCase()}` : 'ORIGINAL FOOTAGE', .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
  }
  ctx.restore();
  return { cx, cy, w, h };
}


// ======================================================================================================================== FILM 72
export const CONCRETE = { lit: '#8f9bb5', body: '#68748f', shade: '#48536e', deep: '#2c354f', stip: '#b9c2d4', edge: '#a3aec5' };   // grey-blue
export const SOIL = { top: mixHex(P.night1, P.ind2, .7), body: '#121530', deep: '#0a0c22', face: '#1d2042', strata: '#2f3358', speck: '#4a4f78' };
// a partial polyline (local helper; the stage exports the same as X.drawPath)
function path(ctx, pts, u, o = {}) {
  if (u <= 0 || pts.length < 2) return null;
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let rem = tot * clamp(u), hx = pts[0][0], hy = pts[0][1];
  ctx.save(); ctx.strokeStyle = o.col ?? CREAM; ctx.globalAlpha *= o.a ?? 1; ctx.lineWidth = o.w ?? 2; ctx.lineCap = o.cap ?? 'round'; ctx.lineJoin = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  if (o.glow > .5) { ctx.shadowColor = rgba(o.glowCol ?? GOLD.halo, .7); ctx.shadowBlur = o.glow; }
  ctx.beginPath(); ctx.moveTo(hx, hy);
  for (let i = 1; i < pts.length && rem > 1e-6; i++) { const f = Math.min(1, rem / Math.max(1e-6, L[i - 1])); hx = lerp(pts[i - 1][0], pts[i][0], f); hy = lerp(pts[i - 1][1], pts[i][1], f); ctx.lineTo(hx, hy); rem -= L[i - 1]; }
  ctx.stroke(); ctx.restore(); ctx.beginPath(); return [hx, hy];
}
export const arcPts = (cx, cy, rx, ry = rx, a0 = 0, a1 = TAU, n = 40, rot = 0) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n), x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]; });
const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };

// ------------------------------------------------------------------------------------------------ light sprites (made ONCE, drawn many times)
// glowDot(ctx, x, y, r, a, kind): a soft dot of light ('gold' lantern, 'cool' AI, 'cream' window) — a pre-rendered sprite, cheap for crowds
const SPRITE = {};
for (const [k, core, mid] of [['gold', GOLD.core, GOLD.halo], ['cool', COOL.core, COOL.halo], ['cream', P.cream, P.halo2]]) {
  const c = createCanvas(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, rgba(core, 1)); gr.addColorStop(.12, rgba(mid, .55)); gr.addColorStop(.4, rgba(mid, .14)); gr.addColorStop(1, rgba(mid, 0));
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); SPRITE[k] = c;
}
export function glowDot(ctx, x, y, r, a = 1, kind = 'gold') {
  if (a <= 0 || r <= 0) return; const op = ctx.globalCompositeOperation, ga = ctx.globalAlpha;
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = ga * clamp(a); ctx.drawImage(SPRITE[kind], x - r, y - r, r * 2, r * 2);
  ctx.globalCompositeOperation = op; ctx.globalAlpha = ga;
}

// ------------------------------------------------------------------------------------------------ THE TITLE (frame 0, thumbnail A2 wording)
// heavy caps like the thumbnail: line 1 cream, line 2 gold and bigger; u rises, o.out sinks behind the mask (line by line)
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 96, y = o.y ?? 178, lines = o.lines ?? SOURCES.title, sizes = o.sizes ?? [132, 236], cond = o.cond ?? .86, cols = o.cols ?? [['#fff6d8', '#fffbea'], [GOLD.body, '#ffd36b']];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  let yy0 = y;
  lines.forEach((ln, i) => {
    const size = sizes[i] ?? sizes[0], base = yy0; yy0 += (sizes[i + 1] ?? size) * .86 + size * .06;
    const ui = rise(span(u, i * .14, .78 + i * .14)), ex = o.out != null ? sineIO(clamp(o.out * 1.15 - i * .12)) : 0; if (ui <= 0 || ex >= 1) return;
    const k = expoOut(ui), dy = (1 - k) * size * .5 + ex * size * .95, [c0, c1] = cols[i] ?? cols[0];
    ctx.save(); ctx.beginPath(); ctx.rect(x - 40, base - size * .8, W, size * .9); ctx.clip();
    ctx.translate(x, base + dy); ctx.scale(cond, 1);
    ctx.font = `${size}px "Inter Black"`; ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = rgba(GOLD.halo, i ? .75 : .6); ctx.shadowBlur = size * .14; ctx.fillStyle = c0; ctx.fillText(ln, 0, 0);
    ctx.shadowBlur = 0; ctx.fillStyle = c1; ctx.fillText(ln, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ THE LIST (the motor of the film)
// A suspect card on cream paper: WHAT ARE THEY HIDING FROM? and four numbered rows 1 THE BOMB · 2 THE MACHINE · 3 THE CHAOS · 4 (redacted → US).
// It is its own graphic (never pinned to a door, never a HUD) and appears only when the question returns. Each station marks ONE row:
// row 1 a THIN strike, greyed: REAL, BUT OLD · row 2 a BOLD strike: CROSSED OFF · row 3 a HALF strike that stops in the middle:
// STAYS · FOR A WHILE · row 4 the redaction bar peels away, US, circled in gold. Verdicts are WORDS that rise (never rubber stamps).
//   list(ctx, t, x, y, o) · (x, y) = centre of the card in the current transform · o.u (card rises) · o.s (size factor, default 1)
//   o.title 0..1 · o.fold 0..1 (folds flat towards its bottom edge: the hand-over into a board) · o.a · o.rot
//   o.rows[i] = { num, write, q, lit, strike, kind: 'thin'|'bold'|'half', verdict, vu, redact, peel, ghost, circle, big }  (all 0..1; text
//     defaults to SOURCES.list[i]; row 4 writes US once peel > 0). Returns { x0, y0, w, h, rows: [{ x, y, tx, tw }] } (card units → caller's).
export const LIST = { w: 860, head: 132, row: 104, pad: 46 };
export function list(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const sc = o.s ?? 1, { w, head, row, pad } = LIST, h = head + row * 4 + 36, k = expoOut(u), fold = sineIO(clamp(o.fold ?? 0));
  const R = o.rows ?? [];
  ctx.save(); ctx.translate(x, y + (1 - k) * 50); ctx.scale(sc, sc); ctx.rotate((o.rot ?? -.012) + (1 - k) * .03);
  if (fold > 0) { ctx.translate(0, h / 2); ctx.scale(1 - .04 * fold, Math.max(.001, 1 - fold)); ctx.translate(0, -h / 2); }
  ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3);
  ctx.translate(-w / 2, -h / 2);
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(8, 12, w, h, 8); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, 6); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  // the title + a hairline under it
  const tu = clamp(o.title ?? 1);
  maskLine(ctx, [[SOURCES.listTitle, 0]], pad, 78, 40, rise(span(u, .15, .8) * tu), { serif: false, weight: 700, col: PAPER.ink, glow: false });
  path(ctx, [[pad, 104], [w - pad, 104]], span(u, .3, 1) * tu, { col: rgba(PAPER.ink, .35), w: 1.5 });
  const out = [];
  for (let i = 0; i < 4; i++) {
    const r = R[i] || {}, ry = head + row * i + row * .66, big = sineIO(clamp(r.big ?? 0));
    const txt = r.text ?? (i === 3 ? SOURCES.list[3] : SOURCES.list[i]), size = 50;
    const tx = pad + 86, tw = measure(txt, size, false, 700) + txt.length * size * .03;
    ctx.save();
    if (big > 0) { ctx.translate(tx, ry - 18); ctx.scale(1 + .14 * big, 1 + .14 * big); ctx.translate(-tx, -(ry - 18)); }
    const lit = clamp(r.lit ?? 0), struck = clamp(r.strike ?? 0), kind = r.kind ?? 'bold';
    const grey = kind === 'half' ? .25 * struck : (kind === 'thin' ? .55 : .5) * struck;
    if (lit > 0) { ctx.fillStyle = rgba(GOLD.body, .22 * lit); ctx.beginPath(); ctx.roundRect(pad - 14, ry - 62, w - pad * 2 + 28, row - 18, 10); ctx.fill(); }
    // the number (serif) lights from faint to ink
    const nu = clamp(r.num ?? 1);
    E.glowText(ctx, String(i + 1), pad + 8, ry, { size: 58, serif: true, col: mixHex(PAPER.shade, mixHex(PAPER.ink, GOLD.deep, lit), nu), glow: false });
    // the name writes in behind a mask
    const wu = clamp(r.write ?? 1), showTxt = i === 3 ? clamp(r.peel ?? 0) > 0 || r.text != null : true;
    if (showTxt && wu > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(tx - 4, ry - 60, (tw + 12) * sineIO(wu), 80); ctx.clip();
      E.glowText(ctx, txt, tx, ry, { size, weight: 700, spacing: .03, col: mixHex(mixHex(PAPER.ink, GOLD.deep, lit * .8), PAPER.shade, grey), glow: false });
      ctx.restore();
    }
    // a question mark after it
    if ((r.q ?? 0) > 0) goldText(ctx, [['?', .0]], tx + tw + 16, ry, 60, rise(r.q), { serif: true, col: mixHex(PAPER.ink, GOLD.deep, .5) });
    // the strike
    if (struck > 0) {
      const y0 = ry - size * .34;
      if (kind === 'thin') path(ctx, [[tx - 8, y0], [tx + tw + 8, y0 - 2]], struck, { col: rgba(PAPER.ink, .8), w: 2.4 });
      else if (kind === 'half') { const xe = tx + tw * .52, hd = path(ctx, [[tx - 8, y0 + 1], [xe, y0 - 1]], struck, { col: rgba(PAPER.ink, .9), w: 5 });
        path(ctx, [[xe, y0 - 22], [xe, y0 + 20]], span(struck, .85, 1), { col: rgba(PAPER.ink, .9), w: 4.5 }); }
      else { path(ctx, [[tx - 14, y0 + 3], [tx + tw * .5, y0 - 2], [tx + tw + 14, y0 + 1]], struck, { col: PAPER.ink, w: 10 });
        path(ctx, [[tx - 6, y0 + 8], [tx + tw + 10, y0 + 5]], span(struck, .4, 1), { col: rgba(PAPER.ink, .7), w: 4 }); }
    }
    // the redaction bar (row 4): a dark bar over the name; ghost lets a floor-plan drawing show through it; peel lifts it away to the right
    const red = clamp(r.redact ?? (i === 3 ? 1 : 0)), peel = sineIO(clamp(r.peel ?? 0));
    if (red > 0 && peel < 1) {
      const bw = 360 * sineIO(red), bx = tx - 6 + bw * peel, bww = bw * (1 - peel);
      ctx.save(); ctx.translate(0, -peel * 10); ctx.rotate(-peel * .03);
      ctx.fillStyle = mixHex(P.night0, PAPER.ink, .4); ctx.beginPath(); ctx.roundRect(bx, ry - 46, bww, 56, 3); ctx.fill();
      const gh = clamp(r.ghost ?? 0);
      if (gh > 0) { ctx.save(); ctx.beginPath(); ctx.rect(bx, ry - 46, bww, 56); ctx.clip(); ctx.globalAlpha *= gh * .8;
        ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 1.4; ctx.beginPath();
        for (const [a, b, c, d] of [[12, 8, 110, 40], [122, 8, 70, 40], [192, 8, 150, 40], [40, 8, 0, 40], [250, 22, 0, 26]]) { ctx.rect(tx + a, ry - 46 + b, c, d); }
        ctx.stroke(); ctx.restore(); }
      ctx.restore();
    }
    ctx.restore();
    // the verdict (a word, right of the name)
    if (r.verdict && (r.vu ?? 0) > 0) verdict(ctx, t, Math.max(tx + tw + 40, w - pad - 10), ry - 6, r.verdict, r.vu, { size: 24, align: 'right2', ink: true });
    // the gold circle round the row (drawn by hand: a slightly open ellipse that overlaps itself)
    const cu = clamp(r.circle ?? 0);
    if (cu > 0) { const cx = tx + tw / 2 + 8, cy = ry - 18, pts = arcPts(cx, cy, tw / 2 + 46, 48, -2.6, -2.6 + TAU * 1.08, 60, -.04);
      goldSpan(ctx, pts, 0, sineIO(cu), { w: 4.5, spark: cu < 1 }); }
    out.push({ x: x + (tx + tw / 2 - w / 2) * sc, y: y + (ry - 18 - h / 2) * sc, tx, tw, ry });
  }
  ctx.restore();
  return { w: w * sc, h: h * sc, rows: out };
}

// ------------------------------------------------------------------------------------------------ the verdict word, the word badge
// under a station's tag: caps rise behind a mask, then an underline draws from the left (not a rubber stamp: earlier films had those)
export function verdict(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 30, tw = measure(text, size, false, 700) + size * text.length * .08;
  const x0 = o.align === 'left' ? x : o.align === 'right2' ? x - tw : x - tw / 2;
  if (o.ink) { maskLine(ctx, [[text, 0]], x0, y, size, rise(u), { serif: false, weight: 700, col: mixHex(PAPER.ink, GOLD.deep, o.gold ?? .55), glow: false, spacing: .08 });
    path(ctx, [[x0, y + size * .34], [x0 + tw, y + size * .34]], smooth(span(u, .35, 1)), { col: mixHex(PAPER.ink, GOLD.deep, o.gold ?? .55), w: 2 }); }
  else { goldText(ctx, [[text, 1]], x0, y, size, rise(u), { serif: false, weight: 700, spacing: .08 });
    goldSpan(ctx, [[x0, y + size * .32], [x0 + tw, y + size * .32]], 0, smooth(span(u, .35, 1)), { w: 1.4, spark: false }); }
  return { x: x0, y, w: tw };
}
// a word badge: a pill with a hairline edge (cream or gold), the word in caps; u rises it, the edge draws round (NOT a stamp)
export function badge(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 26, tw = measure(text, size, false, 700) + text.length * size * .1, w = tw + size * 1.6, h = size * 1.8, col = o.gold ? GOLD.line : CREAM;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 16);
  ctx.fillStyle = rgba(P.night0, .72); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
  const r = h / 2, pts = [[-w / 2 + r, -h / 2], [w / 2 - r, -h / 2], ...arcPts(w / 2 - r, 0, r, r, -Math.PI / 2, Math.PI / 2, 12).slice(1), [-w / 2 + r, h / 2], ...arcPts(-w / 2 + r, 0, r, r, Math.PI / 2, Math.PI * 1.5, 12).slice(1)];
  path(ctx, pts, sineIO(span(u, 0, .8)), { col: rgba(col, .9), w: 2 });
  E.glowText(ctx, text, 0, size * .36, { size, weight: 700, align: 'center', col: o.gold ? GOLD.text : CREAM, glow: false, spacing: .1 });
  ctx.restore(); return { w, h };
}

// ------------------------------------------------------------------------------------------------ THE HATCH (the Leitbild's door: round, in the ground)
// hatch(ctx, t, x, y, w, o): (x, y) = the centre of the rim at ground level, w = rim width. Seen from above at an angle: o.tilt = ry/rx of the
// rim ellipse (thumbnail .24; on the stage, seen from the side, ~.07). o.open 0..1 (the lid swings up round a hinge at the back; 1 ≈ 100°,
// leaning back, we see its underside), o.glow 0..1 (gold light from the shaft), o.ladder (default 1), o.s (line widths), o.collar (height).
// NEVER a vault door from the front, never a wheel or a key. Returns { lip: [x, y] (front lip), mouth: [x, y] (centre of the opening) }.
export function hatch(ctx, t, x, y, w, o = {}) {
  const rx = w / 2, tilt = o.tilt ?? .24, ry = rx * tilt, cphi = Math.sqrt(1 - tilt * tilt), hc = o.collar ?? w * .075, s = o.s ?? 1;
  const yt = y - hc * cphi, ri = rx * .8, glow = clamp(o.glow ?? 1), open = clamp(o.open ?? 1), a = open * 1.9;
  const P3 = (px, ph, pd) => [x + px, yt - ph * cphi + pd * tilt];   // 3D (right, up, towards you) → screen, origin = rim centre on top
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  // light spilling out over the ground
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, y + ry * .3, rx * 2.4, [[0, rgba(GOLD.halo, .3 * glow * open)], [1, rgba(GOLD.halo, 0)]]);
    ctx.beginPath(); ctx.ellipse(x, y + ry * .2, rx * 2.4, rx * 2.4 * Math.max(tilt, .12) * 1.6, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  // the lid when it stands behind the opening (drawn first)
  // the lid swings up round a hinge at the back, which is turned by o.yaw (default .95 rad) towards the right: seen from here it is a narrow,
  // leaning ellipse (like the thumbnail), never a disc facing us
  const yaw = o.yaw ?? .95, cy_ = Math.cos(yaw), sy_ = Math.sin(yaw), RL = ri * 1.04;
  const lidP = (px, ph, pd) => P3(px * cy_ - pd * sy_, ph, px * sy_ + pd * cy_);
  const lidPts = (ang) => Array.from({ length: 41 }, (_, i) => { const th = i / 40 * TAU, vd = RL * Math.sin(th) + RL; return lidP(RL * Math.cos(th), vd * Math.sin(ang), -RL + vd * Math.cos(ang)); });
  const drawLid = () => {
    const thick = hc * .55, A = lidPts(a), B = A.map(([px, py]) => [px, py + thick * (a > Math.PI / 2 ? -.2 : 1)]);
    ctx.fillStyle = CONCRETE.deep; poly(ctx, B); ctx.fill();
    const under = a > Math.PI / 2 + .05;   // past vertical: we see the underside, lit by the shaft
    ctx.fillStyle = lin(ctx, x, yt - ri * 2, x, yt, under ? [[0, mixHex(CONCRETE.shade, GOLD.shade, .35 * glow)], [1, mixHex(CONCRETE.body, GOLD.mid, .55 * glow)]] : [[0, CONCRETE.lit], [1, CONCRETE.body]]);
    poly(ctx, A); ctx.fill(); ctx.strokeStyle = rgba(CONCRETE.edge, .7); ctx.lineWidth = 2 / s; ctx.stroke();
    // a calm boss in the middle of the lid (no wheel, no spokes)
    // a soft inner seal ring (no boss, no wheel, no spokes)
    const ring = Array.from({ length: 41 }, (_, i) => { const th = i / 40 * TAU, vd = RL * .8 * Math.sin(th) + RL; return lidP(RL * .8 * Math.cos(th), vd * Math.sin(a), -RL + vd * Math.cos(a)); });
    ctx.strokeStyle = rgba(under ? GOLD.line : CONCRETE.deep, under ? .25 * glow : .35); ctx.lineWidth = Math.max(1.5, RL * .03); poly(ctx, ring); ctx.stroke();
  };
  if (a > .9) drawLid();
  // the collar: front band + top ring
  ctx.fillStyle = lin(ctx, x - rx, 0, x + rx, 0, [[0, CONCRETE.shade], [.45, CONCRETE.body], [1, CONCRETE.deep]]);
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI); ctx.lineTo(x - rx, yt); ctx.ellipse(x, yt, rx, ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, yt - ry, 0, yt + ry, [[0, CONCRETE.body], [1, CONCRETE.lit]]);
  ctx.beginPath(); ctx.ellipse(x, yt, rx, ry, 0, 0, TAU); ctx.fill();
  if (glow > 0) { ctx.fillStyle = rgba(GOLD.line, .25 * glow * open); ctx.beginPath(); ctx.ellipse(x, yt, rx, ry, 0, Math.PI, TAU); ctx.ellipse(x, yt, ri, ri * tilt, 0, TAU, Math.PI, true); ctx.fill(); }
  // the opening: the shaft's far wall lit gold, the ladder on it
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, yt, ri, ri * tilt, 0, 0, TAU); ctx.clip();
  const gl = glow * (.25 + .75 * open);
  // the far wall (lit, top half of the opening) falling into the dark near wall (bottom half): reads as a hole, not a plate
  ctx.fillStyle = lin(ctx, 0, yt - ri * tilt, 0, yt + ri * tilt, [[0, mixHex(P.night1, GOLD.body, .95 * gl)], [.45, mixHex(P.night1, GOLD.mid, .9 * gl)], [.75, mixHex(P.night0, GOLD.shade, .75 * gl)], [1, mixHex(P.night0, GOLD.deep, .7 * gl)]]);
  ctx.fillRect(x - ri, yt - ri * tilt, ri * 2, ri * tilt * 2 + 2);
  ctx.fillStyle = lin(ctx, x - ri, 0, x + ri, 0, [[0, rgba(P.night0, .45)], [.3, rgba(P.night0, 0)], [.75, rgba(P.night0, 0)], [1, rgba(P.night0, .5)]]); ctx.fillRect(x - ri, yt - ri * tilt, ri * 2, ri * tilt * 2 + 2);
  halo(ctx, x, yt - ri * tilt * .2, ri * .9, .35 * gl, GOLD.halo, GOLD.core);
  if ((o.ladder ?? 1) > 0 && tilt > .1) {
    const lw = ri * .26, top = yt - ri * tilt * .95, bot = yt + ri * tilt * 1.2;
    ctx.strokeStyle = rgba(mixHex(GOLD.shade, P.night1, .4), .9 * (o.ladder ?? 1)); ctx.lineWidth = Math.max(1.5, ri * .028); ctx.beginPath();
    for (const sx of [-lw / 2, lw / 2]) { ctx.moveTo(x + sx + ri * .08, top); ctx.lineTo(x + sx + ri * .08, bot); }
    for (let k = 0; k < 6; k++) { const yy = lerp(top + 8, bot, k / 6); ctx.moveTo(x - lw / 2 + ri * .08, yy); ctx.lineTo(x + lw / 2 + ri * .08, yy); }
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = rgba(CONCRETE.stip, .35); ctx.lineWidth = 1.5 / s; ctx.beginPath(); ctx.ellipse(x, yt, ri, ri * tilt, 0, 0, TAU); ctx.stroke();
  // the lid when it lies on / over the opening (drawn last)
  if (a <= .9) drawLid();
  // the crack of light while the lid lifts a little
  if (open > 0 && open < .5 && glow > 0) halo(ctx, x, yt - ri * tilt, rx * .9, .45 * glow * Math.sin(Math.PI * open * 2), GOLD.halo, GOLD.core);
  ctx.restore();
  return { lip: [x, yt + ry], mouth: [x, yt], top: yt };
}

// ------------------------------------------------------------------------------------------------ people with lanterns, the crowd
// lanternPerson(ctx, t, x, y, h, o): a calm silhouette holding a small lantern at chest height (gold). o.dir, o.lamp 0..1, o.ph (phase), o.a,
// o.rim (rim light strength). Cheap (no Path2D ops): use it for rows and crowds; use F.person for heroes.
export function lanternPerson(ctx, t, x, y, h, o = {}) {
  const d = o.dir ?? 1, lamp = clamp(o.lamp ?? 1), ph = o.ph ?? 0, sw = Math.sin(t * .8 + ph) * .012;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.scale(h * d, h);
  const col = o.col ?? mixHex(P.ind2, P.blue2, .35);
  ctx.save(); ctx.translate(0, -.012); ctx.fillStyle = rgba(mixHex(P.blue1, CREAM, .25), .45); ctx.beginPath(); ctx.moveTo(-.15, 0); ctx.bezierCurveTo(-.16, -.3, -.17, -.62, -.12, -.76); ctx.quadraticCurveTo(0, -.83, .12, -.76); ctx.bezierCurveTo(.17, -.62, .16, -.3, .15, 0); ctx.closePath(); ctx.ellipse(0, -.9, .075, .085, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-.15, 0); ctx.bezierCurveTo(-.16, -.3, -.17, -.62, -.12 + sw, -.76); ctx.quadraticCurveTo(0 + sw, -.83, .12 + sw, -.76);
  ctx.bezierCurveTo(.17, -.62, .16, -.3, .15, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(sw * 1.2, -.9, .075, .085, 0, 0, TAU); ctx.fill();
  if (lamp > 0) {   // warm rim on the side of the lantern, the lantern itself
    ctx.fillStyle = rgba(GOLD.mid, .3 * lamp * (o.rim ?? 1)); ctx.beginPath(); ctx.moveTo(.06, -.74); ctx.quadraticCurveTo(.15, -.62, .15, -.3); ctx.lineTo(.1, -.3); ctx.quadraticCurveTo(.1, -.6, .03, -.72); ctx.fill();
    ctx.fillStyle = mixHex(GOLD.shade, P.night1, .3); ctx.fillRect(.1, -.56, .012, .06);
    ctx.fillStyle = mixHex(GOLD.body, GOLD.core, .5 * lamp); ctx.beginPath(); ctx.roundRect(.075, -.5, .06, .075, .012); ctx.fill();
  }
  ctx.restore();
  if (lamp > 0) glowDot(ctx, x + h * d * .105, y - h * .465, h * .32, .75 * lamp * (.85 + .15 * Math.sin(t * 7.3 + ph * 3)), 'gold');
  return [x + h * d * .105, y - h * .465];
}
// lanternRow(ctx, t, x0, x1, y, n, o): n lantern people standing on a line (seeded spacing/heights). o.h (height), o.u (rise from the line, by
// distance from o.from), o.seed, o.dir. Returns their lantern points.
export function lanternRow(ctx, t, x0, x1, y, n, o = {}) {
  const r = prng(o.seed ?? 7201), h0 = o.h ?? 96, pts = [], u = o.u ?? 1;
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + .5 + (r() - .5) * .5) / n), h = h0 * (.82 + r() * .3), ph = r() * 6.3, dir = o.dir ?? (r() < .5 ? -1 : 1);
    const k = typeof u === 'number' ? u : u(x); if (k <= 0) { r(); continue; }
    ctx.save(); ctx.beginPath(); ctx.rect(x - h, y - h * 1.3, h * 2, h * 1.3); ctx.clip();
    pts.push(lanternPerson(ctx, t, x, y + (1 - expoOut(k)) * h * 1.05, h, { ph, dir, lamp: span(k, .4, 1), a: o.a }));
    ctx.restore();
  }
  return pts;
}

// ------------------------------------------------------------------------------------------------ AI: the disc and its beam (never a robot)
export function aiDisc(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1), sc = o.s ?? 1; if (u <= 0) return;
  const k = expoOut(u), warm = clamp(o.warm ?? 0);
  halo(ctx, x, y, r * 1.8 * k * (o.reach ?? 1), .24 * u * (o.bright ?? 1), mixHex(COOL.halo, GOLD.halo, warm), COOL.core);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rad(ctx, x, y, r * k, [[0, rgba(COOL.core, .92)], [.35, rgba(COOL.body, .6)], [.85, rgba(COOL.deep, .3)], [1, rgba(mixHex(COOL.line, GOLD.line, warm), .6 * (.4 + warm))]]); ctx.beginPath(); ctx.arc(x, y, r * k, 0, TAU); ctx.fill();
  for (let i = 0; i < 4; i++) { const ph = ((t * .35 * (o.think ?? .5) + i / 4) % 1), rr = r * k * (1.5 - ph * .6); ctx.strokeStyle = rgba(COOL.line, .5 * (1 - Math.abs(ph - .5) * 2) * u); ctx.lineWidth = 2 / sc; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.stroke(); }
  if (warm > 0) { ctx.strokeStyle = rgba(GOLD.line, .8 * warm); ctx.lineWidth = 3 / sc; ctx.beginPath(); ctx.arc(x, y, r * k, 0, TAU); ctx.stroke(); }
  ctx.restore();
}
export function beam(ctx, x0, y0, x1, y1, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const sc = o.s ?? 1, wd = (o.w ?? 70) / sc, ang = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2, ex = Math.cos(ang) * wd, ey = Math.sin(ang) * wd;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, x0, y0, x1, y1, [[0, rgba(COOL.body, .2 * u)], [1, rgba(COOL.body, .05 * u)]]);
  ctx.beginPath(); ctx.moveTo(x0 - ex * .1, y0 - ey * .1); ctx.lineTo(x1 - ex, y1 - ey); ctx.lineTo(x1 + ex, y1 + ey); ctx.lineTo(x0 + ex * .1, y0 + ey * .1); ctx.fill(); ctx.restore();
  halo(ctx, x1, y1, wd * 1.3, .35 * u, COOL.halo, COOL.core);
}

// ------------------------------------------------------------------------------------------------ the glass room (the people building AI)
// glassRoom(ctx, t, x, y, w, h, o): a lit glass box standing on the line at (x = left, y = floor); four calm silhouettes at screens (cool
// light on them). o.u rises it out of the line (clipped at the floor), o.n people, o.leave 0..1 (the 2nd person is gone: walked out), o.s
export function glassRoom(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null; const s = o.s ?? 1, k = expoOut(u), n = o.n ?? 4;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 40, y - h - 200, w + 80, h + 200); ctx.clip(); ctx.translate(0, (1 - k) * (h + 20));
  halo(ctx, x + w / 2, y - h * .5, w * .9, .18 * u, COOL.halo, COOL.core);
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, rgba(mixHex(P.ind1, COOL.deep, .5), .75)], [1, rgba(mixHex(P.night1, COOL.deep, .4), .85)]]); ctx.fillRect(x, y - h, w, h);
  for (let i = 0; i < n; i++) {
    const px = x + w * (i + .6) / (n + .2), gone = i === 1 ? clamp(o.leave ?? 0) : 0;
    ctx.fillStyle = rgba(COOL.core, .8); ctx.fillRect(px + 8, y - h * .5, h * .2, h * .13);   // the screen
    glowDot(ctx, px + 8 + h * .1, y - h * .44, h * .32, .55, 'cool');
    if (gone < 1) { ctx.save(); ctx.globalAlpha *= 1 - gone; person(ctx, px - 6, y - 2, h * .62, { pose: 'stand', dir: 1, rim: COOL.line, light: -1 }); ctx.restore(); }
  }
  // glass: cream mullions + a sheen
  ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2.2 / s; ctx.strokeRect(x, y - h, w, h);
  ctx.strokeStyle = rgba(CREAM, .3); ctx.lineWidth = 1.2 / s; ctx.beginPath(); for (let i = 1; i < 4; i++) { ctx.moveTo(x + w * i / 4, y - h); ctx.lineTo(x + w * i / 4, y); } ctx.stroke();
  ctx.fillStyle = rgba(CREAM, .05); ctx.beginPath(); ctx.moveTo(x + w * .1, y - h); ctx.lineTo(x + w * .3, y - h); ctx.lineTo(x + w * .12, y); ctx.lineTo(x - w * .08, y); ctx.fill();
  ctx.restore();
  return { x, y, w, h, door: [x, y] };
}

// ------------------------------------------------------------------------------------------------ the three vignettes (H.04): your job, your daily life, your children's world
// vignette(ctx, t, kind, x, y, h, o): kind 'desk' | 'table' | 'child'; stands on the line at (x, y); o.u rises it out of the line; o.beam
// 0..1 the cool light of AI passing over it; o.label 0..1 + o.text (the label under the line, ≥ 22 px)
export function vignette(ctx, t, kind, x, y, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return; const k = expoOut(u), bm = clamp(o.beam ?? 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x - h * 1.6, y - h * 2, h * 3.2, h * 2); ctx.clip(); ctx.translate(0, (1 - k) * h * 1.2);
  halo(ctx, x, y - h * .55, h * 1.2, .16 * u, LAMP.body, LAMP.core);
  const ink = mixHex(P.night1, P.ind2, .7);
  if (kind === 'desk') {
    ctx.fillStyle = ink; ctx.fillRect(x - h * .05, y - h * .44, h * .8, h * .05); ctx.fillRect(x + h * .62, y - h * .4, h * .05, h * .4); ctx.fillRect(x + h * .02, y - h * .4, h * .05, h * .4);
    ctx.fillStyle = mixHex(LAMP.body, COOL.body, bm); ctx.fillRect(x + h * .3, y - h * .74, h * .3, h * .22); ctx.fillStyle = ink; ctx.fillRect(x + h * .43, y - h * .52, h * .04, h * .08);
    glowDot(ctx, x + h * .45, y - h * .63, h * .5, .5, bm > .5 ? 'cool' : 'cream');
    person(ctx, x - h * .12, y - 1, h * .92, { pose: 'hold', dir: 1 });
  } else if (kind === 'table') {
    ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y - h * 1.5); ctx.lineTo(x, y - h * 1.08); ctx.stroke();
    ctx.fillStyle = mixHex(LAMP.body, P.night1, .3); ctx.beginPath(); ctx.moveTo(x - h * .14, y - h * 1.0); ctx.lineTo(x + h * .14, y - h * 1.0); ctx.lineTo(x + h * .06, y - h * 1.1); ctx.lineTo(x - h * .06, y - h * 1.1); ctx.fill();
    glowDot(ctx, x, y - h * .98, h * .9, .55, 'cream');
    ctx.fillStyle = ink; ctx.fillRect(x - h * .55, y - h * .46, h * 1.1, h * .05); ctx.fillRect(x - h * .48, y - h * .42, h * .05, h * .42); ctx.fillRect(x + h * .43, y - h * .42, h * .05, h * .42);
    ctx.fillStyle = P.cream; ctx.fillRect(x - h * .1, y - h * .5, h * .08, h * .04); ctx.fillRect(x + h * .1, y - h * .5, h * .06, h * .04);
    person(ctx, x - h * .72, y - 1, h * .9, { pose: 'hold', dir: 1 }); person(ctx, x + h * .72, y - 1, h * .86, { pose: 'stand', dir: -1, long: true });
  } else {
    person(ctx, x, y - 1, h * .62, { pose: 'look', dir: 1 });
    ctx.fillStyle = mixHex(GOLD.shade, P.night1, .35); ctx.beginPath(); ctx.roundRect(x - h * .16, y - h * .5, h * .13, h * .2, h * .03); ctx.fill();   // the school bag
    person(ctx, x + h * .4, y - 1, h * 1.0, { pose: 'hold', dir: -1, long: true });
  }
  if (bm > 0) halo(ctx, x, y - h * .6, h * 1.1, .22 * bm, COOL.halo, COOL.core);
  ctx.restore();
  if ((o.label ?? 0) > 0 && o.text) maskLine(ctx, [[o.text, 0]], x - measure(o.text, o.size ?? 24, false, 600) / 2 - (o.size ?? 24) * o.text.length * .05, y + (o.size ?? 24) * 1.7, o.size ?? 24, rise(o.label), { serif: false, weight: 600, col: CREAM, glow: false, spacing: .1 });
}

// ------------------------------------------------------------------------------------------------ concrete, the bunker in section
const STIP = new Map();
// concrete stipple in a rect (seeded specks, cached by size) — the cut face of concrete in every section drawing
export function stipple(ctx, x, y, w, h, o = {}) {
  const key = `${Math.round(w)}x${Math.round(h)}:${o.seed ?? 1}`;
  if (!STIP.has(key)) { const r = prng(o.seed ?? 7290), n = Math.min(900, Math.round(w * h / (o.density ?? 170))), a = []; for (let i = 0; i < n; i++) a.push([r() * w, r() * h, .8 + r() * 1.6, r()]); STIP.set(key, a); }
  ctx.save(); ctx.fillStyle = o.col ?? CONCRETE.stip; ctx.globalAlpha *= o.a ?? .5;
  ctx.beginPath(); for (const [px, py, s, q] of STIP.get(key)) { if (q < .82) { ctx.moveTo(x + px + s, y + py); ctx.arc(x + px, y + py, s, 0, TAU); } else { ctx.moveTo(x + px, y + py); ctx.lineTo(x + px + s * 2, y + py - s * 1.6); ctx.lineTo(x + px + s * 3, y + py + s); ctx.closePath(); } }
  ctx.fill(); ctx.restore();
}
// a concrete slab in section (fill + stipple + cream outline): the walls, the floors, THE DOOR FILLED WITH CONCRETE
export function slab(ctx, x, y, w, h, o = {}) {
  if (w <= 0 || h <= 0) return; const s = o.s ?? 1;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, CONCRETE.body], [1, CONCRETE.shade]]); ctx.fillRect(x, y, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); stipple(ctx, x, y, w, h, { seed: o.seed, a: o.stip ?? .55 }); ctx.restore();
  ctx.strokeStyle = rgba(CREAM, o.line ?? .7); ctx.lineWidth = 1.6 / s; ctx.strokeRect(x, y, w, h);
  ctx.restore();
}
// bunker(ctx, t, x, y, o): a bunker in section under the ground line y; x = the shaft's centre. Parts (all optional):
//   o.draw 0..1 (the cream outline draws, then the concrete fills: o.fill 0..1) · o.depth (shaft, default 200) · o.room { x0, x1, h } (default a
//   room right of the shaft) · o.wall (thickness 28) · o.light 0..1 (gold inside) · o.door 0..1 (the slab slides across the top of the shaft:
//   0 open, 1 shut) · o.ladder · o.shelves 0..1 (supply level on the shelves, left wall to right) · o.people [{ x, h, pose, dir, gold }]
//   o.rooms extra rooms [{ x0, x1, h, light }] · o.s. Returns { shaft: [x, yTop, yBot], room: { x0, x1, y0, y1 }, door: { x, y, w, h } }.
export function bunker(ctx, t, x, y, o = {}) {
  const s = o.s ?? 1, dw = clamp(o.draw ?? 1), fill = clamp(o.fill ?? 1), wall = o.wall ?? 28, sw = o.shaftW ?? 64, depth = o.depth ?? 200;
  const room = { x0: x - sw / 2 - 40, x1: x + 420, h: 150, ...(o.room || {}) }, ry0 = y + depth, ry1 = ry0 + room.h, light = clamp(o.light ?? 1);
  const rooms = [room, ...(o.rooms || [])];
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  // concrete body (behind everything): an outer box round shaft and rooms
  if (fill > 0) {
    ctx.save(); ctx.globalAlpha *= fill;
    slab(ctx, x - sw / 2 - wall, y, wall, depth + wall * .2, { s, seed: 11 }); slab(ctx, x + sw / 2, y, wall, depth - wall + 2, { s, seed: 12 });
    for (const [i, R] of rooms.entries()) { const y0 = ry0, y1 = ry0 + R.h;
      slab(ctx, R.x0 - wall, y0 - wall, R.x1 - R.x0 + wall * 2, wall, { s, seed: 20 + i }); slab(ctx, R.x0 - wall, y1, R.x1 - R.x0 + wall * 2, wall, { s, seed: 30 + i });
      slab(ctx, R.x0 - wall, y0, wall, R.h, { s, seed: 40 + i }); slab(ctx, R.x1, y0, wall, R.h, { s, seed: 50 + i }); }
    // the shaft opens into the room: cut the ceiling slab there
    ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(x - sw / 2, ry0 - wall - 1, sw, wall + 2);
    ctx.restore();
  }
  // interiors: dark, warm when lit
  for (const R of rooms) { const l = clamp(R.light ?? light);
    ctx.fillStyle = lin(ctx, 0, ry0, 0, ry0 + R.h, [[0, mixHex(P.night0, GOLD.shade, .55 * l)], [1, mixHex(P.night0, GOLD.deep, .45 * l)]]); ctx.fillRect(R.x0, ry0, R.x1 - R.x0, R.h);
    if (l > 0) { ctx.save(); ctx.beginPath(); ctx.rect(R.x0, ry0, R.x1 - R.x0, R.h); ctx.clip(); halo(ctx, (R.x0 + R.x1) / 2, ry0 + 20, (R.x1 - R.x0) * .55, .35 * l, GOLD.halo, GOLD.core); ctx.restore(); } }
  ctx.fillStyle = lin(ctx, 0, y, 0, ry0, [[0, mixHex(P.night0, GOLD.mid, .5 * light)], [1, mixHex(P.night0, GOLD.shade, .4 * light)]]); ctx.fillRect(x - sw / 2, y, sw, depth);
  // shelves with supplies (the clock): boxes along the room's back wall, the level drains from the right
  const sh = clamp(o.shelves ?? 0);
  if (o.shelves != null) {
    const x0 = room.x0 + sw + 30, x1 = room.x1 - 20;
    ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 1.4 / s; ctx.beginPath();
    for (const yy of [ry0 + room.h * .38, ry0 + room.h * .7]) { ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); } ctx.stroke();
    const n = Math.floor((x1 - x0) / 26), filled = Math.round(n * sh);
    for (const [j, yy] of [ry0 + room.h * .38, ry0 + room.h * .7].entries()) for (let i = 0; i < filled; i++) {
      const bh = 18 + ((i * 7 + j * 3) % 5) * 3; ctx.fillStyle = mixHex(PAPER.shade, GOLD.mid, ((i + j) % 3) * .2); ctx.fillRect(x0 + 3 + i * 26, yy - bh, 20, bh); }
  }
  // the ladder down the shaft
  if ((o.ladder ?? 1) > 0) { ctx.strokeStyle = rgba(mixHex(CREAM, GOLD.line, .4), .75); ctx.lineWidth = 2 / s; ctx.beginPath(); const lx0 = x - sw * .22, lx1 = x + sw * .22;
    ctx.moveTo(lx0, y - 10); ctx.lineTo(lx0, ry0 + room.h); ctx.moveTo(lx1, y - 10); ctx.lineTo(lx1, ry0 + room.h);
    for (let yy = y + 6; yy < ry0 + room.h - 4; yy += 22) { ctx.moveTo(lx0, yy); ctx.lineTo(lx1, yy); } ctx.stroke(); }
  // people inside
  for (const p of o.people || []) { if ((p.a ?? 1) <= 0) continue; ctx.save(); ctx.globalAlpha *= p.a ?? 1;
    if (p.gold) halo(ctx, p.x, ry0 + room.h - p.h * .5, p.h * .9, .25 * p.gold, GOLD.halo, GOLD.core);
    person(ctx, p.x, ry0 + room.h - 2, p.h, { pose: p.pose ?? 'stand', dir: p.dir ?? 1, walk: p.walk, light: -1, rim: GOLD.line }); ctx.restore(); }
  // the cream outline drawing (on top): shaft walls, room boxes
  if (dw > 0) {
    const ol = (pts) => path(ctx, pts, dw, { col: rgba(CREAM, .85), w: 2 / s });
    ol([[x - sw / 2, y], [x - sw / 2, ry0], [room.x0, ry0], [room.x0, ry0 + room.h], [room.x1, ry0 + room.h], [room.x1, ry0], [x + sw / 2, ry0], [x + sw / 2, y]]);
    ol([[x - sw / 2 - wall, y], [x - sw / 2 - wall, ry0 - wall], [room.x0 - wall, ry0 - wall], [room.x0 - wall, ry1 + wall], [room.x1 + wall, ry1 + wall], [room.x1 + wall, ry0 - wall], [x + sw / 2 + wall, ry0 - wall], [x + sw / 2 + wall, y]]);
    for (const R of o.rooms || []) ol([[R.x0, ry0], [R.x0, ry0 + R.h], [R.x1, ry0 + R.h], [R.x1, ry0], [R.x0, ry0]]);
  }
  // THE DOOR FILLED WITH CONCRETE: a thick slab that slides across the shaft just under the collar (in section: stipple, cream edge)
  const door = { x: x - sw / 2 - wall * .6, y: y + 34, w: sw + wall * 1.2, h: 46 }, dk = sineIO(clamp(o.door ?? 0));
  if (o.door != null) { const dx = lerp(x + sw / 2 + wall + 4, door.x, dk);
    ctx.save(); ctx.beginPath(); ctx.rect(x - sw / 2 - wall - 2, y, sw + wall * 2 + 400, 120); ctx.clip();
    slab(ctx, dx, door.y, door.w, door.h, { s, seed: 77, stip: .8, line: .95 }); ctx.restore();
    // its track in the wall
    path(ctx, [[x + sw / 2, door.y - 4], [x + sw / 2 + wall + door.w + 8, door.y - 4]], dw, { col: rgba(CREAM, .35), w: 1.2 / s, dash: [6, 5] }); }
  ctx.restore();
  return { shaft: [x, y, ry0], room: { x0: room.x0, x1: room.x1, y0: ry0, y1: ry1 }, door: { ...door, x: lerp(x + sw / 2 + wall + 4, door.x, dk) } };
}

// ------------------------------------------------------------------------------------------------ the supply clock (a bunker is a clock)
// supplyClock(ctx, t, x, y, w, o): a time axis (log: DAYS · WEEKS · MONTHS · YEARS) under a bunker, a gold supply band above it that
// drains from the right as the time head moves (o.head 0..1 along the axis, o.full = where the stock runs out, 0..1). o.marks [[pos, text]]
// small labelled ticks (makers' claims), o.u draws the axis. NOT a clock face, NOT an hourglass.
export function supplyClock(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return; const s = o.s ?? 1;
  path(ctx, [[x, y], [x + w, y]], sineIO(u), { col: rgba(CREAM, .8), w: 2 / s });
  (o.scale ?? SOURCES.clockScale).forEach((lb, i, A) => { const xx = x + w * i / (A.length - 1), k = span(u, i / A.length * .6, i / A.length * .6 + .4);
    path(ctx, [[xx, y - 8], [xx, y + 8]], k, { col: rgba(CREAM, .7), w: 1.6 / s });
    maskLine(ctx, [[lb, 0]], xx - measure(lb, 22, false, 600) / 2 - lb.length * 1.1, y + 40, 22, rise(k), { serif: false, weight: 600, col: P.halo2, glow: false, spacing: .1 }); });
  const full = clamp(o.full ?? 0), head = clamp(o.head ?? 0), bw = 22;
  if (full > 0) { const xe = x + w * full, xh = x + w * Math.min(head, full);
    ctx.fillStyle = rgba(GOLD.body, .85); ctx.beginPath(); ctx.roundRect(xh, y - 18 - bw, Math.max(0, xe - xh), bw, [0, 4, 4, 0]); ctx.fill();
    ctx.fillStyle = rgba(GOLD.shade, .35); ctx.fillRect(x, y - 18 - bw, Math.max(0, xh - x), bw); }
  if (o.head != null) { const xh = x + w * head; ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(xh, y - 6); ctx.lineTo(xh - 8, y - 18); ctx.lineTo(xh + 8, y - 18); ctx.fill(); halo(ctx, xh, y - 12, 30, .4, GOLD.halo, GOLD.core); }
  for (const [p, txt, a = 1] of o.marks || []) { const xx = x + w * p; path(ctx, [[xx, y - 70], [xx, y]], a, { col: rgba(CREAM, .45), w: 1.2 / s, dash: [4, 4] });
    maskLine(ctx, [[txt, 0]], xx + 8, y - 72, 22, rise(a), { serif: false, weight: 600, col: CREAM, glow: false }); }
}

// ------------------------------------------------------------------------------------------------ plans, evidence, small objects
// floorPlan(ctx, t, x, y, w, h, o): a plan drawn in cream lines on the night (NOT a blueprint grid): outer wall (double line), rooms
// o.rooms [{ x, y, w, h (0..1 of the plan), label, bars 0..1 (hatched bars = detention), gold 0..1 }], door swings, o.u draws it.
export function floorPlan(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return; const s = o.s ?? 1;
  const rect = (a, b, c, d) => [[a, b], [a + c, b], [a + c, b + d], [a, b + d], [a, b]];
  path(ctx, rect(x, y, w, h), u, { col: rgba(CREAM, .9), w: 3 / s }); path(ctx, rect(x + 10, y + 10, w - 20, h - 20), span(u, .1, 1), { col: rgba(CREAM, .55), w: 1.4 / s });
  for (const [i, R] of (o.rooms || []).entries()) {
    const k = span(u, .2 + i * .08, .7 + i * .08), rx = x + 10 + R.x * (w - 20), ry = y + 10 + R.y * (h - 20), rw = R.w * (w - 20), rh = R.h * (h - 20);
    if ((R.gold ?? 0) > 0) { ctx.fillStyle = rgba(GOLD.body, .14 * R.gold); ctx.fillRect(rx, ry, rw, rh); }
    path(ctx, rect(rx, ry, rw, rh), k, { col: rgba(mixHex(CREAM, GOLD.line, R.gold ?? 0), .8), w: 1.6 / s });
    const b = clamp(R.bars ?? 0); if (b > 0) { const n = Math.max(3, Math.floor(rw / 18)); for (let j = 1; j < n; j++) path(ctx, [[rx + rw * j / n, ry], [rx + rw * j / n, ry + rh]], span(b, j / n * .6, j / n * .6 + .4), { col: rgba(CREAM, .75), w: 2 / s }); }
    if (R.door) { const [dx, dy] = [rx + rw * .5, ry + rh]; path(ctx, arcPts(dx, dy, 24, 24, Math.PI, Math.PI * 1.5, 10), k, { col: rgba(CREAM, .45), w: 1 / s }); }
    if (R.label) maskLine(ctx, [[R.label, 0]], rx + 10, ry + 30, 22, rise(span(k, .5, 1)), { serif: false, weight: 600, col: mixHex(CREAM, GOLD.text, R.gold ?? 0), glow: false, spacing: .08 });
  }
}
// evidenceCard(ctx, t, x, y, text, o): a small paper card pinned to the night (a cream pin, never red), o.u, o.lit (gold edge), o.rot, o.w
export function evidenceCard(ctx, t, x, y, text, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null; const w = o.w ?? 300, h = o.h ?? 150, k = expoOut(u), lit = clamp(o.lit ?? 0);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y + (1 - k) * 30); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = lit > 0 ? rgba(GOLD.mid, .4 + .6 * lit) : rgba(PAPER.edge, .9); ctx.lineWidth = 2 + 2 * lit; ctx.strokeRect(-w / 2, -h / 2, w, h);
  const size = o.size ?? 32, tw = measure(text, size, false, 700) + text.length * size * .06;
  maskLine(ctx, [[text, 0]], -tw / 2, 12, size, rise(span(u, .3, 1)), { serif: false, weight: 700, col: mixHex(PAPER.ink, GOLD.deep, lit), glow: false, spacing: .06 });
  if (o.sub) maskLine(ctx, [[o.sub, 0]], -w / 2 + 18, h / 2 - 18, 22, rise(span(u, .5, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  ctx.fillStyle = mixHex(CREAM, CONCRETE.lit, .3); ctx.beginPath(); ctx.arc(0, -h / 2 + 4, 9, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.arc(2, -h / 2 + 6, 3, 0, TAU); ctx.fill();
  ctx.restore();
  return { pin: [x, y - h / 2 + 4], x, y, w, h };
}
// thread(ctx, a, b, u, o): a gold thread from pin a to pin b with a soft sag; returns the head point
export function thread(ctx, a, b, u, o = {}) {
  const sag = o.sag ?? 40, pts = Array.from({ length: 21 }, (_, i) => { const f = i / 20; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f) + Math.sin(Math.PI * f) * sag]; });
  return goldSpan(ctx, pts, 0, clamp(u), { w: o.w ?? 2.4, spark: o.spark });
}
// lamp(ctx, t, x, y, o): a hanging studio / table lamp, its cone of light down to o.floor; the circle of light on the floor is where clip
// plates grow from (o.pool → returns the pool rect for F.clipPlate's from). o.swing (rad), o.u
export function lamp(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null; const floor = o.floor ?? y + 380, sw = (o.swing ?? 0) * Math.sin(t * 1.6), L = o.len ?? 120;
  const hx = x + Math.sin(sw) * L, hy = y + Math.cos(sw) * L, r = o.r ?? 34, px = x + Math.sin(sw) * (floor - y), pr = (o.poolR ?? 220);
  ctx.save(); ctx.globalAlpha *= u;
  ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, hy, 0, floor, [[0, rgba(LAMP.body, .22)], [1, rgba(LAMP.body, .04)]]);
  ctx.beginPath(); ctx.moveTo(hx - r * .6, hy + r * .4); ctx.lineTo(px - pr, floor); ctx.lineTo(px + pr, floor); ctx.lineTo(hx + r * .6, hy + r * .4); ctx.fill(); ctx.restore();
  ctx.fillStyle = mixHex(P.night1, CONCRETE.shade, .5); ctx.beginPath(); ctx.moveTo(hx - r, hy + r * .45); ctx.lineTo(hx + r, hy + r * .45); ctx.lineTo(hx + r * .35, hy - r * .15); ctx.lineTo(hx - r * .35, hy - r * .15); ctx.fill();
  glowDot(ctx, hx, hy + r * .4, r * 2.2, .9, 'cream');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(LAMP.body, .2); ctx.beginPath(); ctx.ellipse(px, floor, pr, pr * .14, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.restore();
  return { x: px - pr, y: floor - pr * .14, w: pr * 2, h: pr * .28 };
}
// house(ctx, t, x, y, w, o): a house on the line (LAMP windows); o.shelter 0..1 draws its basement shelter in section below the line
// (concrete box with a thick door), o.use 'wine' | 'party' | null (what the shelter is used for meanwhile), o.lit
export function house(ctx, t, x, y, w, o = {}) {
  const h = w * .62, lit = clamp(o.lit ?? 1);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = mixHex(P.night1, P.ind2, .6);
  ctx.beginPath(); ctx.rect(x - w / 2, y - h, w, h); ctx.moveTo(x - w / 2 - w * .06, y - h); ctx.lineTo(x, y - h - w * .38); ctx.lineTo(x + w / 2 + w * .06, y - h); ctx.fill();
  if (lit > 0) halo(ctx, x, y - h * .5, w * .7, .25 * lit, LAMP.body, LAMP.core);
  for (const dx of [-.22, .22]) { ctx.fillStyle = mixHex(mixHex(P.night0, P.ind1, .5), LAMP.body, lit * (dx < 0 ? 1 : .8)); ctx.fillRect(x + dx * w - w * .1, y - h * .7, w * .2, h * .3); }
  const sh = clamp(o.shelter ?? 0);
  if (sh > 0) {
    const bw = w * .8, bh = w * .42, bx = x - bw / 2, by = y + 16;
    ctx.save(); ctx.globalAlpha *= sh;
    slab(ctx, bx - 14, by - 14, bw + 28, bh + 28, { seed: 91, stip: .5 });
    const use = o.use, l = use ? 1 : .45;
    ctx.fillStyle = lin(ctx, 0, by, 0, by + bh, [[0, mixHex(P.night0, GOLD.shade, .55 * l)], [1, mixHex(P.night0, GOLD.deep, .4 * l)]]); ctx.fillRect(bx, by, bw, bh);
    slab(ctx, bx + bw - 26, by + 8, 18, bh - 8, { seed: 92, stip: .9, line: .95 });   // the thick door
    if (use === 'wine') { ctx.strokeStyle = rgba(GOLD.line, .6); ctx.lineWidth = 1.4; ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(bx + 10, by + 14 + i * bh * .2); ctx.lineTo(bx + bw * .55, by + 14 + i * bh * .2); } ctx.stroke();
      ctx.fillStyle = mixHex(GOLD.deep, P.night0, .2); for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) { ctx.beginPath(); ctx.arc(bx + 18 + j * bw * .08, by + 8 + i * bh * .2, 4, 0, TAU); ctx.fill(); } }
    if (use === 'party') { const r = prng(93); for (let i = 0; i < 9; i++) glowDot(c2(ctx), bx + 12 + i * (bw - 40) / 8, by + 10 + Math.sin(i * 1.3) * 5, 14, .7 * (.6 + .4 * Math.sin(t * 2 + r() * 6)), 'gold'); }
    halo(ctx, x - w * .1, by + bh * .5, bw * .4, .25 * l, GOLD.halo, GOLD.core);
    ctx.restore();
  }
  ctx.restore();
}
const c2 = (c) => c;
// rockHall(ctx, t, x, y, w, h, o): a vaulted hall cut into the rock under the city (Helsinki), in section; x = centre, y = its floor.
// o.use 'play' (a slide, a climbing frame) | 'pool' (water) | 'sport' · o.people n figures · o.full 0..1 (fills with people) · o.u draws
export function rockHall(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return; const s = o.s ?? 1;
  const vault = [[x - w / 2, y], ...arcPts(x, y - h + w * .18, w / 2, w * .18, Math.PI, TAU, 30).map(([px, py], i) => [px, Math.min(py, y - h * .2)]), [x + w / 2, y]];
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, mixHex(P.night0, GOLD.shade, .45 * u)], [1, mixHex(P.night0, GOLD.deep, .5 * u)]]); poly(ctx, vault); ctx.fill();
  ctx.save(); poly(ctx, vault); ctx.clip(); halo(ctx, x, y - h * .65, w * .55, .3 * u, GOLD.halo, GOLD.core);
  if (o.use === 'pool') { ctx.fillStyle = lin(ctx, 0, y - 40, 0, y, [[0, mixHex(COOL.body, GOLD.line, .3)], [1, mixHex(COOL.deep, P.night0, .3)]]); ctx.fillRect(x - w * .35, y - 38, w * .7, 38);
    ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 1.4; ctx.beginPath(); for (let i = 0; i < 6; i++) { const xx = x - w * .32 + i * w * .12; ctx.moveTo(xx, y - 38 + Math.sin(t * 2 + i) * 2); ctx.lineTo(xx + w * .06, y - 38 + Math.sin(t * 2 + i + 1) * 2); } ctx.stroke(); }
  if (o.use === 'play') { ctx.strokeStyle = rgba(GOLD.line, .85); ctx.lineWidth = 4 / s; ctx.beginPath(); ctx.moveTo(x - w * .28, y); ctx.lineTo(x - w * .28, y - h * .45); ctx.lineTo(x - w * .2, y - h * .45); ctx.quadraticCurveTo(x - w * .05, y - h * .4, x - w * .02, y); ctx.stroke();
    ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(x + w * .12, y - i * h * .12); ctx.lineTo(x + w * .3, y - i * h * .12); } ctx.moveTo(x + w * .12, y); ctx.lineTo(x + w * .12, y - h * .36); ctx.moveTo(x + w * .3, y); ctx.lineTo(x + w * .3, y - h * .36); ctx.stroke(); }
  const n = Math.round((o.people ?? 4) + clamp(o.full ?? 0) * 26), r = prng(7295);
  for (let i = 0; i < n; i++) { const px = x - w * .42 + r() * w * .84, ph = r() * 6, hh = h * (.16 + r() * .08) * (i % 5 === 0 ? .7 : 1);
    lanternPerson(ctx, t, px, y - 2, hh, { lamp: 0, dir: r() < .5 ? -1 : 1, ph, col: mixHex(P.night1, GOLD.deep, .25), a: i < (o.people ?? 4) ? 1 : clamp((o.full ?? 0) * 26 - (i - (o.people ?? 4))) }); }
  ctx.restore();
  path(ctx, vault, u, { col: rgba(CREAM, .85), w: 2.2 / s });
  ctx.restore();
}
// dataCentre(ctx, t, x, y, w, o): a long, low building on the line with rows of cool vents; o.bill 0..1 (a small paper bill slides from
// a neighbour's house to the data centre: Microsoft's promise), o.u
export function dataCentre(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return; const h = w * .22;
  ctx.save(); ctx.globalAlpha *= u; ctx.fillStyle = mixHex(P.night1, CONCRETE.deep, .6); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 1.6; ctx.strokeRect(x - w / 2, y - h, w, h);
  for (let i = 0; i < 12; i++) { const vx = x - w / 2 + w * (i + .5) / 12; ctx.fillStyle = rgba(COOL.body, .45 + .25 * Math.sin(t * 3 + i * 1.7)); ctx.fillRect(vx - 10, y - h * .7, 20, h * .45); }
  glowDot(ctx, x, y - h * .5, w * .4, .25, 'cool');
  ctx.restore();
}
// a small night card for numbers (re-export of dataCard with the film-72 kinds: CLAIM = makers' advertising, KNOWN, ESTIMATE)

// ======================================================================================================================== SOURCES
// Every on-screen string of the film, from text-v2.md [ON SCREEN] / faktenzettel.md (figures ONLY from here; the MB points of faktencheck.md
// WIN: when it lands the lead updates this table — builders say so in the report, never retype a figure in a scene).
// Source lines go through F.source (22 px, y 880). On screen "AI" (never "A.I.", that is only the VO spelling).
export const SOURCES = {
  title: ['AI BILLIONAIRES', 'FEAR YOU'],
  listTitle: 'WHAT ARE THEY HIDING FROM?', list: ['THE BOMB', 'THE MACHINE', 'THE CHAOS', 'US'],
  verdicts: ['REAL, BUT OLD', 'CROSSED OFF', 'STAYS · FOR A WHILE', 'US'],
  peopleAI: 'THE PEOPLE BUILDING AI', upClose: 'UP CLOSE', restOfUs: 'THE REST OF US', ai: 'AI',
  vignettes: ['YOUR JOB', 'YOUR DAILY LIFE', 'YOUR CHILDREN’S WORLD'],
  underground: 'UNDERGROUND', concreteDoor: 'A DOOR FILLED WITH CONCRETE', onlyFew: 'ONLY FOR A FEW',
  sutskeverTags: ['OPENAI’S CHIEF SCIENTIST (THEN)', 'A ROOM OF NEW RESEARCHERS', 'SUMMER 2023'],
  sutskever: { text: 'We’re definitely going to build a bunker before we release AGI.', credit: 'Ilya Sutskever · co-founder and then chief scientist, OpenAI · summer 2023',
    src: 'AS RECALLED BY RESEARCHERS PRESENT · REPORTED BY KAREN HAO, EMPIRE OF AI (2025)' },
  agi: 'AGI', agiLong: 'ARTIFICIAL GENERAL INTELLIGENCE', asSmart: 'A MACHINE AS SMART AS US', noDoor: 'NO DOOR STOPS IT',
  // B1 · the bomb
  koolau: 'KOOLAU RANCH · KAUAI, HAWAII', biggerHouses: 'BIGGER THAN MOST HOUSES',
  koolauSrc: 'UNDERGROUND SHELTER, ABOUT 4,500–5,000 SQ FT · WIRED, DEC 2023 · COUNTY PLANNING DOCUMENTS, VIA HAWAII NEWS NOW, DEC 2024', forStorms: 'FOR STORMS',
  zuckerberg: { text: '… just like a little shelter. It’s like a basement.', credit: 'Mark Zuckerberg · CEO, Meta · Bloomberg, The Circuit, 19 Dec 2024', src: 'COUNTY BUILDING RECORDS: “STORM SHELTER”' },
  altman25: { text: '… Not because of AI, but just because … people are dropping bombs in the world again.', credit: 'Sam Altman · CEO, OpenAI · 2025' },   // KB1: with “just” (the clip's own words)
  bombsNotAI: ['BOMBS', 'NOT AI'],
  sellersSrc: 'NEWSWEEK, 4 OCT 2026 · WASHINGTON POST, 9 OCT 2026', oldReasons: ['WAR', 'PANDEMICS'],
  newReason: '“… AND EVEN ARTIFICIAL INTELLIGENCE”', newReasonSrc: 'WASHINGTON POST, 9 OCT 2026 · ATLAS FOUNDER: AI CAN NOW BE “ADDED TO THE LIST” · NEWSWEEK, 4 OCT 2026',
  // B1 · the machine
  safetyReport: 'INTERNATIONAL AI SAFETY REPORT 2026 · CHAIR: YOSHUA BENGIO · 100+ EXPERTS, 30+ COUNTRIES · FEB 2026', cyber: 'AI IN REAL CYBERATTACKS',
  thought: 'THOUGHT EXPERIMENT', passes: ['A STORM', 'FALLOUT', 'A WAR'], doesntPass: 'IT DOESN’T PASS', nobodyNeeds: 'NOBODY NEEDS ONE',
  altman23: { text: 'None of this is gonna help if AGI goes wrong.', credit: 'Sam Altman · CEO, OpenAI · WSJ Tech Live, Oct 2023' },
  optional: { text: 'Of course, it’s going to be optional whether you want to get into the bunker.', credit: 'Ilya Sutskever · 2023', src: 'REPORTED BY KAREN HAO, EMPIRE OF AI (2025)' },
  hall: { text: '… AI technology is amazing, but it’s nowhere near human intelligence.', credit: 'Dame Wendy Hall · Professor of Computer Science, University of Southampton · BBC, Oct 2025' },
  outHere: 'OUT HERE', downThere: 'DOWN THERE', stillBuilding: 'STILL BUILDING',
  // B2 · the chaos
  rightNow: 'RIGHT NOW', goodFor: 'GOOD FOR WHAT?', clockScale: ['DAYS', 'WEEKS', 'MONTHS', 'YEARS'],
  makersHead: 'MAKERS’ OWN CLAIMS (ADVERTISING)', makers: [['ATLAS', '30 DAYS MINIMUM'], ['VIVOS', '1 YEAR MINIMUM'], ['SURVIVAL CONDO, KANSAS', 'UP TO 5 YEARS'], ['OPPIDUM, CZECH REPUBLIC', '“UP TO 10 YEARS” (DEVELOPER, 2015)']],
  salesPromises: 'SALES PROMISES', everyClock: 'EVERY BUNKER IS A CLOCK', axios: 'AXIOS, 9 OCT 2026', down3: ['BANKS', 'INTERNET', 'POWER'],
  faa: '13 NOV 2026 · FAA GROUND STOP, MORE THAN 4 HOURS · CAUSE: A FAULTY ROUTER (FAA)', faaHours: 'MORE THAN 4 HOURS',   // KB2 groundStop: 'GROUND STOP', noAI: 'NO AI INVOLVED',
  faa2: 'FAA: NO CYBERATTACK · GROUND STOP LIFTED AFTER MORE THAN FOUR HOURS', needs: ['FUEL', 'FILTERS', 'PEOPLE'], answerTo: 'WHO DO THEY ANSWER TO?',
  // B2 · us
  y2017: '2017', worthless: 'ONCE MONEY IS WORTHLESS', theEvent: '“THE EVENT”', eventSrc: '“THE EVENT”: ENVIRONMENTAL COLLAPSE, SOCIAL UNREST, NUCLEAR EXPLOSION, VIRUS, OR HACK · RUSHKOFF, SURVIVAL OF THE RICHEST',
  mobs: '“THE ANGRY MOBS”', ideas: ['“SPECIAL COMBINATION LOCKS ON THE FOOD SUPPLY”', '“DISCIPLINARY COLLARS”', '“ROBOTS TO SERVE AS GUARDS AND WORKERS”'],
  fiveMen: 'FIVE MEN FROM TECH INVESTING AND HEDGE FUNDS · NEVER NAMED · RUSHKOFF’S OWN ACCOUNT', hisAccount: 'HIS ACCOUNT', investors: 'INVESTORS', builders: 'AI BUILDERS',
  antiMutiny: '“ANTI-MUTINY” PROCEDURES', antiMutinySrc: 'HARDENED STRUCTURES PROJECTS · WASHINGTON POST, 9 OCT 2026',
  detention: '“DETENTION AREAS”', detentionSrc: 'BUNKER DESIGNS BY SAFE · WASHINGTON POST, 9 OCT 2026',
  dayAfter: '“DAY AFTER” SCENARIOS AT LEADING AI COMPANIES', dayAfterSrc: 'AXIOS, 9 OCT 2026', publicPol: ['THE PUBLIC', 'POLITICIANS'],
  gallup: ['AI DATA CENTER 71%', 'NUCLEAR PLANT 53%'], gallupHead: 'OPPOSE NEARBY', gallupSrc: 'GALLUP, MARCH 2026',
  insurance: 'INSURANCE', hobby: ['SPAS', 'ROCK WALLS', 'GO-KART TRACKS'], hobbySrc: 'WASHINGTON POST, 9 OCT 2026', ownersSay: ['STORMS', 'BOMBS'],
  practice: 'PRACTICE, NOT A PREDICTION', drills: '“PREPAREDNESS EXERCISES”',
  // B3 · the turn, the answer
  trail: ['GUARDS', 'LOCKS', 'MUTINY PLANS'], stopsNot: ['A STORM', 'A BOMB', 'A MACHINE'], againstPeople: 'BUILT AGAINST PEOPLE',
  gains: 'THE GAINS → A FEW', unnecessary: 'WHAT WOULD MAKE THE BUNKER UNNECESSARY?', mission: 'SO THAT SUPERINTELLIGENCE GOES WELL FOR EVERYBODY', subscribe: 'SUBSCRIBE',
  friends: 'LIKE FRIENDS', rushkoff: { text: 'Don’t just invest in ammo and electric fences, invest in people and relationships.', credit: 'Douglas Rushkoff · Survival of the Richest, 2018' },
  thickerDoor: 'A THICKER DOOR', nobodyStorm: 'A WORLD NOBODY WANTS TO STORM',
  swiss: 'SWITZERLAND · PRINCIPLE SINCE 1963: A PROTECTED PLACE FOR EVERY RESIDENT', swissNums: 'ABOUT 9 MILLION PLACES IN ABOUT 370,000 SHELTERS · MORE THAN 100% COVERAGE',
  swissSrc: 'FEDERAL OFFICE FOR CIVIL PROTECTION', placesPeople: ['PLACES', 'PEOPLE'], meanwhile: ['WINE CELLARS', 'PARTY ROOMS'],
  helsinki: 'HELSINKI, FINLAND', helsinkiSrc: 'HELSINKI, FINLAND · SHELTERS IN EVERYDAY USE: PLAYGROUNDS, SWIMMING POOLS, SPORTS HALLS · FINLAND.FI',
  hiding: 'A HIDING PLACE', society: 'A SOCIETY', staysOutside: 'SOMEONE STAYS OUTSIDE', openArgument: 'AN OPEN ARGUMENT',
  // (Harris “Don’t build bunkers. Write laws.” is now the clip C2b — no quote card)
  bill: 'S. 5518 · MAKE AI WORK FOR AMERICANS ACT', billSrc: 'S. 5518 · MAKE AI WORK FOR AMERICANS ACT · INTRODUCED 24 SEPT 2026 · AT LEAST 75% OF LOST WAGES FOR 26 WEEKS, ONCE A LABOR-MARKET DISRUPTION IS DECLARED',   // KB3
  bill75: 'AT LEAST 75% · 26 WEEKS', billCard: ['AT LEAST 75%', '26 WEEKS', 'NOT PASSED'], microsoft: 'MICROSOFT, JAN 2026: OWN POWER COSTS, FULL LOCAL TAXES, MORE WATER RETURNED THAN USED',
  openaiFdn: 'OPENAI FOUNDATION, MAY 2026: $250 MILLION FOR WORKERS AND COMMUNITIES', notPassed: 'NOT PASSED', voluntary: 'VOLUNTARY',
  notPassedSrc: 'S. 5518: NOT PASSED · IN THE SENATE FINANCE COMMITTEE, NO CO-SPONSORS (NOV 2026)',   // KB4 deciders: ['LAWMAKERS', 'COMPANIES', 'VOTERS'],
  // faktencheck KB5–KB8 (optional, Jakob's choice; default = the left string): use SOURCES.kb.* only when the lead says so
  kb: { gallupSrc: 'GALLUP, SURVEY MARCH 2026', condo: ['SURVIVAL CONDO, KANSAS', 'UP TO 5 YEARS (DEVELOPER)'], sutskeverSrc: 'AS RECALLED BY A RESEARCHER PRESENT · REPORTED BY KAREN HAO, EMPIRE OF AI (2025)', helsinkiSrc: 'HELSINKI, FINLAND · SHELTERS IN EVERYDAY USE: PLAYGROUNDS, SWIMMING POOLS, GYMS · FINLAND.FI' },
  // the end
  fear: 'THE FEAR OF EVERYONE LEFT OUTSIDE', eight: 'MORE THAN 8 BILLION PEOPLE', eightSrc: 'UN, 2024',
};
