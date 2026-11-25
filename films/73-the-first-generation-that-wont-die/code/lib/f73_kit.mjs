// Film 73 · "The First Generation That Won't Die" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base (ported 1:1 from film 69's kit, which stands on lib/f10_editorial.mjs + f16_kit + f54_kit): text in gold (goldText, goldSpan, goldLabel),
// edge-safe text, paper / data / quote cards, clip plates (ORIGINAL FOOTAGE), the source line, camPath, float, veil.
// NEW for film 73 (below the base): the title, the colour code, THE ANSWER (the motor: NO ·—●—· YES), the objects of the film
// (body drawing = REPAIR, head → computer = COPY, the fly + its brain map, the virtual fly, cell, gene row, mice, dot fields for surveys,
// rings, houses, the cube of brain), and SOURCES (every on-screen string; never retype a figure).
// Stage (THE LIFELINE): lib/f73_stage.mjs · Leitbild (THE STONE) + seam plates + end screen: lib/f73_world.mjs · rules: docs/MOTION.md.
//
// Colour code (never violate): GOLD = life, health, what holds; the ONE hero light per frame (the crack, the lifeline, a lit joint) ·
// CREAM = text, paper, open questions, drawings · COOL = machines, A.I., computers, the copy · AGE = grey-violet, decline, old age (the
// fading end of a lifeline) · LAMP = people's windows · the yellow coat = only you. Never red, never a clock, an hourglass, a needle or a
// button (film 20), never a skull. Death is shown only as an END TICK on a lifeline or as the stone.
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
// at depth ref). Film 66 flies past the rooftop card (F0) down into the land (Z 3600), so the reference is the promise tag's depth (6000), not F0.
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

export const PRINT73 = { grain: 14, floor: 4, vig: .5 };
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

// ======================================================================================================================== THE VERDICT
// under a station's tag: gold caps rise behind a mask, then a gold underline draws from the left (not a rubber stamp: earlier films had those)
export function verdict(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 30, tw = measure(text, size, false, 700) + size * text.length * .08, x0 = o.align === 'left' ? x : x - tw / 2;
  goldText(ctx, [[text, 1]], x0, y, size, rise(u), { serif: false, weight: 700, spacing: .08 });
  goldSpan(ctx, [[x0, y + size * .32], [x0 + tw, y + size * .32]], 0, smooth(span(u, .35, 1)), { w: 1.4, spark: false });
  return { x: x0, y, w: tw };
}

export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(0, 0, W, H); ctx.restore(); }
export const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .02 * k * Math.sin(t * .6 + 1), dx = E.drift(t * 2, 16 * k, 11), dy = E.drift(t * 2, 10 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The plate grows out of a thing in the world (o.from = { x, y, w, h } screen rect, or [cx, cy, r]) and goes back into it.
// Lower third ABOVE the plate (≥ 22 px): NAME (serif) · ROLE · YEAR … ORIGINAL FOOTAGE (+ credit) at the right. Roles: clips.md.
// <ROOT>clips-geprueft.json (when it lands) overrides name/role/year (fields name, rolle|role, jahr|year, credit, crop, cropDy).
// Frames: <F73CLIPS or /tmp/claude-0/f73/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, frame 1 = the slot start; extract with ffmpeg from <ROOT>clips/Cn.mp4 once clips-geprueft.json exists).
// Until the frames exist a marked placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
// ONE frame design for all clips (25.11.): the plate shows the TOP 5/6 of the source picture, centred horizontally (crop 0.833, top-aligned),
// so the bottom 180 px of a 1080p source never show: C4 (Gratton) has burned-in captions at y 905–1017 for the whole clip; the same
// crop on C1 / C3 keeps the three clips identical in scale. Our own lower third sits ABOVE the plate. (C3: the small '50Y' bug top right
// falls outside the centred 1600 px width.)
export const CLIP_CROP = 900 / 1080;
export const CLIPS = {
  C1: { name: 'Ray Kurzweil', role: 'Inventor and futurist', year: '2025', credit: 'MIT SHASS' },                       // MIT lecture "Reimagining Intelligence", 14 Oct 2025
  C3: { name: 'Michael Andregg', role: 'CEO, Eon Systems', year: '2026', credit: 'Progress by Fifty Years' },                     // "Progress by Fifty Years", 17 Nov 2026
  C4: { name: 'Lynda Gratton', role: 'Professor, London Business School', year: '2026', credit: 'London Business School' },      // "Think Ahead", 15 Jan 2026
};
try {   // clips-geprueft.json (25.11.): a list [{ id, video_id, channel, upload_date, duration_s, wording, speaker: 'Name (context)', note, … }] (older films: { clips: [...] })
  const j = JSON.parse(fs.readFileSync(ROOT + 'clips-geprueft.json', 'utf8'));
  for (const c of (Array.isArray(j) ? j : j.clips || [])) { const k = CLIPS[c.id]; if (!k) continue;
    if (c.speaker) k.name = c.speaker.split(' (')[0].trim();
    if (c.lower_third) { const q = c.lower_third.split('·').map((x) => x.trim()); if (q.length >= 3) { k.role = q[1]; k.year = q[2]; } const cq = q.find((x) => x.startsWith('©')); if (cq) k.credit = cq; }
    const cc = /©[^)]*/.exec(c.channel || ''); if (cc) k.credit = cc[0].trim();
    for (const [a, b] of [['rolle', 'role'], ['role', 'role'], ['jahr', 'year'], ['year', 'year'], ['credit', 'credit'], ['crop', 'crop'], ['cropDx', 'cropDx'], ['cropDy', 'cropDy']]) if (c[a] != null) k[b] = c[a]; }
} catch { /* not there yet */ }
const CLIPDIR = (process.env.F73CLIPS || '/tmp/claude-0/f73/clips/').replace(/\/?$/, '/');
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

// ======================================================================================================================== FILM 73
export const AGE = { line: '#8f86b8', deep: '#4b4470', text: '#b3abd6' };   // grey-violet: decline, old age (never red)
// a partial polyline (local helper; the stage exports the same as X.drawPath)
function path(ctx, pts, u, o = {}) {
  if (u <= 0 || pts.length < 2) return null;
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let rem = tot * clamp(u), hx = pts[0][0], hy = pts[0][1];
  ctx.save(); ctx.strokeStyle = o.col ?? CREAM; ctx.globalAlpha *= o.a ?? 1; ctx.lineWidth = o.w ?? 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  if (o.glow > .5) { ctx.shadowColor = rgba(o.glowCol ?? GOLD.halo, .7); ctx.shadowBlur = o.glow; }
  ctx.beginPath(); ctx.moveTo(hx, hy);
  for (let i = 1; i < pts.length && rem > 1e-6; i++) { const f = Math.min(1, rem / Math.max(1e-6, L[i - 1])); hx = lerp(pts[i - 1][0], pts[i][0], f); hy = lerp(pts[i - 1][1], pts[i][1], f); ctx.lineTo(hx, hy); rem -= L[i - 1]; }
  ctx.stroke(); ctx.restore(); return [hx, hy];
}
const arc = (cx, cy, r, a0 = 0, a1 = TAU, n = 28) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });

// ------------------------------------------------------------------------------------------------ THE TITLE (frame 0, thumbnail A wording)
// heavy condensed caps, cream with a warm glow, left (like thumbnail A); u rises, o.out sinks behind the mask
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 84, y = o.y ?? 360, lines = o.lines ?? SOURCES.title, cond = o.cond ?? .72;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `100px "Inter Black"`; const wide = Math.max(...lines.map((l) => ctx.measureText(l).width)) * cond / 100;
  const size = Math.min(o.size ?? 150, (o.maxW ?? 900) / wide);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)), ex = o.out != null ? sineIO(clamp(o.out * 1.15 - i * .12)) : 0; if (ui <= 0 || ex >= 1) return;
    const k = expoOut(ui), yy = y + i * size * .9 + (1 - k) * size * .5 + ex * size * .95;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 40, y + i * size * .9 - size * .84, W, size * .94); ctx.clip();
    ctx.translate(x, yy); ctx.scale(cond, 1);
    ctx.font = `${size}px "Inter Black"`; ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = rgba(GOLD.halo, .7); ctx.shadowBlur = size * .16; ctx.fillStyle = '#fff6d8'; ctx.fillText(ln, 0, 0);
    ctx.shadowBlur = 0; ctx.fillStyle = '#fffbea'; ctx.fillText(ln, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ THE ANSWER (the motor of the film)
// A short piece of the lifeline lifted out: NO at the left end, YES at the right end, a gold bead between them. It is not a switch or
// a button (film 20): nobody presses it, the bead drifts where the film's arguments push it. It appears only when the question returns
// (hook, after the copy, the fair way, "Still yes?", the powerful, "Would you?", the end) — never as a corner HUD (film 69).
//   answer(ctx, t, x, y, w, p, o)  p = bead position, -1 = NO … 0 = the middle … 1 = YES.
//   o: u 0..1 (draws out from the centre, words rise, bead lands) · size (word px, default 30) · cool (the copy: cool colours, dashed)
//      tremble (px, deterministic) · tags [..] small Inter caps under the bar, o.tagU = [u, …] · top (a word above the bar, e.g. HEALTHY,
//      o.topU) · plain (no words: the unlabelled answer of the end) · a
export function answer(ctx, t, x, y, w, p, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const cool = !!o.cool, body = cool ? COOL.body : GOLD.body, hl = cool ? COOL.halo : GOLD.halo, core = cool ? COOL.core : GOLD.core;
  const tr = o.tremble ? E.drift(t * 9, o.tremble, cool ? 3 : 0) : 0, bp = clamp(p, -1, 1) * w / 2 + tr, k = expoOut(span(u, 0, .7));
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  // the bar: draws out from the centre
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(hl, .25); ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - w / 2 * k, y); ctx.lineTo(x + w / 2 * k, y); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = body; ctx.lineWidth = 4; ctx.lineCap = 'round'; if (cool) ctx.setLineDash([14, 9]);
  ctx.beginPath(); ctx.moveTo(x - w / 2 * k, y); ctx.lineTo(x + w / 2 * k, y); ctx.stroke(); ctx.setLineDash([]);
  for (const s of [-1, 1]) { ctx.fillStyle = body; ctx.fillRect(x + s * w / 2 * k - 1.5, y - 12 * k, 3, 24 * k); }
  // the words
  if (!o.plain) {
    const size = o.size ?? 30, wu = span(u, .25, .9), near = (s) => clamp(1 - Math.abs(clamp(p, -1, 1) - s) * 1.2);
    goldText(ctx, [['NO', near(-1) * (cool ? 0 : 1)]], x - w / 2 - 26, y + size * .36, size, rise(wu), { serif: false, weight: 700, spacing: .12, align: 'right', col: cool ? COOL.text : CREAM });
    goldText(ctx, [['YES', near(1) * (cool ? 0 : 1)]], x + w / 2 + 26, y + size * .36, size, rise(wu), { serif: false, weight: 700, spacing: .12, align: 'left', col: cool ? COOL.text : CREAM });
  }
  if (o.top) goldText(ctx, [[o.top, .6]], x, y - 44, 24, rise(o.topU ?? 1), { serif: false, weight: 700, spacing: .14, align: 'center' });
  (o.tags || []).forEach((tg, i) => goldText(ctx, [[tg, .3]], x + (i - (o.tags.length - 1) / 2) * (w * .62), y + 62, 22, rise((o.tagU || [])[i] ?? 1), { serif: false, weight: 700, spacing: .12, align: 'center' }));
  // the bead
  const bu = expoOut(span(u, .45, 1)); if (bu > 0) {
    halo(ctx, x + bp, y, 60, .55 * bu, hl, core);
    ctx.fillStyle = rad(ctx, x + bp - 4, y - 4, 16, [[0, core], [.5, body], [1, cool ? COOL.deep : GOLD.shade]]);
    ctx.beginPath(); ctx.arc(x + bp, y, 13 * bu, 0, TAU); ctx.fill();
  }
  ctx.restore();
  return { bead: [x + bp, y] };
}

// ------------------------------------------------------------------------------------------------ REPAIR: the body as a technical drawing
// A standing human, front view, drawn in cream lines like an engineering drawing (no face, no anatomy detail): head circle, torso,
// arms, legs, joint circles. x, y = the feet's midpoint, h = height (sheet units). o: u 0..1 draws it on (top → bottom) · worn 0..1 joints
// and segments in AGE grey · fix 0..1 the joints light gold one by one (o.order: joint names) · dims 0..1 a dimension line at the left ·
// w (line px at scale 1) · s (view scale, keeps line widths constant on screen) · a
export const JOINTS = ['heart', 'knee_l', 'hip_r', 'spine', 'shoulder_l', 'knee_r', 'elbow_r', 'hip_l', 'shoulder_r', 'elbow_l'];
export function bodyDrawing(ctx, t, x, y, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const s = o.s ?? 1, lw = (o.w ?? 2.2) / s, k = h, P0 = (a, b) => [x + a * k, y - b * k];
  const J = { head: P0(0, .93), neck: P0(0, .85), shoulder_l: P0(-.13, .81), shoulder_r: P0(.13, .81), elbow_l: P0(-.17, .63), elbow_r: P0(.17, .63),
    hand_l: P0(-.19, .47), hand_r: P0(.19, .47), spine: P0(0, .64), hip_l: P0(-.075, .5), hip_r: P0(.075, .5), knee_l: P0(-.085, .27), knee_r: P0(.085, .27),
    foot_l: P0(-.09, 0), foot_r: P0(.09, 0), heart: P0(.035, .72) };
  const segs = [
    arc(J.head[0], J.head[1], .068 * k, -Math.PI / 2, Math.PI * 1.5, 24),
    [J.neck, P0(0, .862)], [J.shoulder_l, J.shoulder_r], [J.shoulder_l, P0(-.1, .58), J.hip_l], [J.shoulder_r, P0(.1, .58), J.hip_r], [J.hip_l, J.hip_r],
    [J.shoulder_l, J.elbow_l, J.hand_l], [J.shoulder_r, J.elbow_r, J.hand_r], [J.hip_l, J.knee_l, J.foot_l], [J.hip_r, J.knee_r, J.foot_r], [J.neck, J.spine, P0(0, .5)],
  ];
  const worn = clamp(o.worn ?? 0), lineCol = mixHex(CREAM, AGE.text, worn * .6);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  segs.forEach((sg, i) => path(ctx, sg, span(u, i / segs.length * .8, i / segs.length * .8 + .3), { col: rgba(lineCol, .85), w: lw, glow: 4 / s, glowCol: CREAM }));
  // dimension line (height) at the left
  const dm = clamp(o.dims ?? 0); if (dm > 0) {
    const dx = x - .3 * k; path(ctx, [[dx, y], [dx, y - k]], dm, { col: rgba(CREAM, .5), w: lw * .6 });
    for (const yy of [y, y - k]) path(ctx, [[dx - 10 / s, yy], [dx + 10 / s, yy]], dm, { col: rgba(CREAM, .5), w: lw * .6 });
    path(ctx, [[dx, y - k], [x - .05 * k, y - k]], dm, { col: rgba(CREAM, .25), w: lw * .5, dash: [6 / s, 6 / s] });
  }
  // joints: worn (grey) → fixed (gold), one by one
  const order = o.order ?? JOINTS, fix = clamp(o.fix ?? 0);
  order.forEach((name, i) => {
    const [jx, jy] = J[name], ju = span(u, .55, 1), f = expoOut(span(fix * order.length, i, i + .6)), r = (name === 'heart' ? 13 : 10) / s;
    if (ju <= 0) return;
    if (f > 0) halo(ctx, jx, jy, 46 / s * f, .6 * f, GOLD.halo, GOLD.core);
    ctx.fillStyle = f > 0 ? mixHex(AGE.deep, GOLD.body, f) : rgba(mixHex(CREAM, AGE.line, worn), .25 + .25 * worn); ctx.strokeStyle = mixHex(mixHex(CREAM, AGE.line, worn), GOLD.line, f); ctx.lineWidth = lw * .8;
    ctx.beginPath(); ctx.arc(jx, jy, r * ju, 0, TAU); ctx.fill(); ctx.stroke();
  });
  ctx.restore();
  return J;
}

// ------------------------------------------------------------------------------------------------ COPY: a head profile, a computer
// a head in profile (facing right), cream outline; x, y = the base of the neck, s = height. o.u draws it on; o.s view scale
export function headProfile(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const q = (a, b) => [x + a * s, y - b * s];
  const pts = [q(-.18, 0), q(-.2, .18), q(-.34, .34), q(-.4, .55), q(-.36, .78), q(-.2, .94), q(.02, 1), q(.22, .93), q(.33, .76), q(.36, .62), q(.44, .52), q(.37, .47), q(.38, .4), q(.34, .36), q(.36, .3), q(.3, .24), q(.2, .22), q(.15, .12), q(.14, 0)];
  path(ctx, pts, u, { col: rgba(CREAM, .9), w: (o.w ?? 2.4) / (o.s ?? 1), glow: 6 / (o.s ?? 1), glowCol: CREAM, a: o.a });
  return { mind: q(0, .62) };
}
// a computer: a cool rounded screen on a short stand (no logo, no keyboard). x, y = the foot of the stand on the line; w = screen width.
// o: u (grows up out of the line), on 0..1 (inner light), s (view scale). Returns the inner rect { x, y, w, h } (sheet units).
export function computer(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const s = o.s ?? 1, k = expoOut(u), h = w * .64, sy = y - w * .16 - h * k, on = clamp(o.on ?? 0);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = mixHex(P.night1, COOL.deep, .5); ctx.fillRect(x - w * .03, y - w * .16 * k, w * .06, w * .16 * k); ctx.fillRect(x - w * .14, y - 4 / s, w * .28, 4 / s);
  ctx.fillStyle = mixHex(P.night0, COOL.deep, .55); ctx.strokeStyle = rgba(COOL.line, .9); ctx.lineWidth = 2.4 / s;
  ctx.beginPath(); ctx.roundRect(x - w / 2, sy, w, h * k, 10 / s); ctx.fill(); ctx.stroke();
  const ix = x - w / 2 + w * .05, iy = sy + w * .05, iw = w * .9, ih = h * k - w * .1;
  if (on > 0 && ih > 0) { ctx.fillStyle = rad(ctx, x, sy + h * k / 2, w * .7, [[0, rgba(COOL.body, .38 * on)], [1, rgba(COOL.deep, .1 * on)]]); ctx.fillRect(ix, iy, iw, ih); halo(ctx, x, sy + h * k / 2, w * .9, .25 * on, COOL.halo, COOL.core); }
  ctx.restore();
  return { x: ix, y: iy, w: iw, h: Math.max(0, ih), cx: x, cy: sy + h * k / 2 };
}

// ------------------------------------------------------------------------------------------------ THE FLY (top view) and its brain map
// fly(ctx, t, x, y, s, o): s = body length (sheet units), heading o.rot (rad, 0 = facing up). o.style 'real' (a dark silhouette with a gold
// rim, translucent wings) | 'virtual' (cool wireframe: the model's body) · o.walk = gait phase (rad; legs swing in tripods) · o.groom 0..1
// (the front legs rub over the head) · o.feed 0..1 (the proboscis reaches down to a drop) · o.wings 0..1 · o.s view scale · o.a
export function fly(ctx, t, x, y, s, o = {}) {
  const v = o.style === 'virtual', sc = o.s ?? 1, lw = (v ? 1.6 : 1.2) / sc;
  const line = v ? COOL.line : GOLD.line, fillB = v ? rgba(COOL.deep, .35) : mixHex(P.night0, P.ind2, .4);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s);
  const ph = o.walk ?? 0, gr = clamp(o.groom ?? 0), fd = clamp(o.feed ?? 0);
  // legs: 3 pairs, tripod gait (L1 R2 L3 vs R1 L2 R3)
  const legs = [[-1, -.12, -.55], [1, -.12, -.55], [-1, .02, 0], [1, .02, 0], [-1, .12, .5], [1, .12, .5]];
  legs.forEach(([sd, ly, base], i) => {
    const tri = (i === 0 || i === 3 || i === 4) ? 0 : Math.PI, sw = Math.sin(ph + tri) * .28, lift = Math.max(0, Math.cos(ph + tri)) * .05;
    let a = base + sw * (o.walk != null ? 1 : 0);
    let k1 = [sd * .22, ly], k2 = [sd * (.42 + lift), ly + Math.sin(a) * .3 - .02], k3 = [sd * (.56 + lift), ly + Math.sin(a) * .5 + (i < 2 ? -.12 : .1)];
    if (i < 2 && gr > 0) { const rub = Math.sin(t * 14 + sd) * .05; k2 = [lerp(k2[0], sd * .16, gr), lerp(k2[1], -.42, gr)]; k3 = [lerp(k3[0], sd * .02 + rub, gr), lerp(k3[1], -.5 + rub, gr)]; }
    ctx.strokeStyle = v ? line : rgba(P.night0, .95); ctx.lineWidth = (v ? 1.6 : 2.6) / sc / s; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(...k1); ctx.lineTo(...k2); ctx.lineTo(...k3); ctx.stroke();
    if (!v) { ctx.strokeStyle = rgba(GOLD.line, .35); ctx.lineWidth = .8 / sc / s; ctx.stroke(); }
  });
  // wings
  const wg = clamp(o.wings ?? 1);
  for (const sd of [-1, 1]) {
    ctx.save(); ctx.rotate(sd * .32); ctx.beginPath(); ctx.ellipse(sd * .14, .22, .13, .36, sd * .05, 0, TAU);
    ctx.fillStyle = v ? rgba(COOL.body, .06 * wg) : rgba(P.cream, .1 * wg); ctx.fill(); ctx.strokeStyle = v ? rgba(line, .7 * wg) : rgba(GOLD.line, .3 * wg); ctx.lineWidth = lw / s; ctx.stroke(); ctx.restore();
  }
  // body: head, thorax, abdomen (stripes)
  const parts = [[0, -.3, .11, .09], [0, -.08, .14, .16], [0, .24, .12, .22]];
  for (const [cx, cy, rx, ry] of parts) { ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.fillStyle = fillB; ctx.fill(); ctx.strokeStyle = v ? line : rgba(GOLD.line, .6); ctx.lineWidth = lw / s; ctx.stroke(); }
  if (!v) { ctx.strokeStyle = rgba(GOLD.line, .25); ctx.lineWidth = .9 / sc / s; for (const yy of [.16, .26, .36]) { ctx.beginPath(); ctx.moveTo(-.1, yy); ctx.quadraticCurveTo(0, yy + .03, .1, yy); ctx.stroke(); } }
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * .075, -.33, .045, .055, 0, 0, TAU); ctx.fillStyle = v ? rgba(COOL.body, .5) : mixHex(GOLD.deep, P.night0, .3); ctx.fill(); }
  if (fd > 0) { ctx.strokeStyle = v ? line : rgba(GOLD.line, .8); ctx.lineWidth = 1.4 / sc / s; ctx.beginPath(); ctx.moveTo(0, -.39); ctx.lineTo(0, -.39 - .14 * fd); ctx.stroke(); }
  ctx.restore();
}
// the drop a virtual fly feeds on
export function drop(ctx, x, y, r, u = 1, s = 1) { if (u <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(u); halo(ctx, x, y, r * 3, .35, COOL.halo, COOL.core); ctx.fillStyle = COOL.body; ctx.beginPath(); ctx.arc(x, y, r * expoOut(u), 0, TAU); ctx.fill(); ctx.restore(); }

// THE BRAIN MAP (wire by wire): a fruit fly's brain seen from the front: two optic lobes (left, right) and the central brain, filled by
// ~900 seeded strands of light. flyBrain(ctx, t, x, y, s, o): s = half width (sheet units). o: u 0..1 (strands draw in, in seeded order,
// each over a short window: "wire by wire") · fire 0..1 (pulses run along a few strands: switched on) · col 'gold' | 'cool' · s view scale
// · a. The geometry is computed once (seeded) and cached; nothing is generated per frame.
let BRAIN = null;
function brainGeo() {
  if (BRAIN) return BRAIN;
  const r = prng(7301), inside = (x, y) => { const l = ((x + .76) / .23) ** 2 + (y / .46) ** 2 < 1, rr = ((x - .76) / .23) ** 2 + (y / .46) ** 2 < 1, c = ((Math.abs(x) - .17) / .25) ** 2 + ((y + .02 + .06 * Math.cos(x * 9)) / .34) ** 2 < 1 && Math.abs(x) < .42; return l || rr || c; };
  const pt = () => { for (;;) { const x = (r() * 2 - 1) * 1.02, y = (r() * 2 - 1) * .44; if (inside(x, y)) return [x, y]; } };
  const S = [];
  for (let i = 0; i < 900; i++) {
    const a = pt(), long = r() < .1, b = long ? pt() : [a[0] + (r() - .5) * .22, a[1] + (r() - .5) * .2];
    if (!inside(b[0], b[1])) { i--; continue; }
    const mx = (a[0] + b[0]) / 2 + (r() - .5) * .3, my = (a[1] + b[1]) / 2 + (r() - .5) * .22;
    const pts = []; for (let k = 0; k <= 10; k++) { const q = k / 10; pts.push([(1 - q) ** 2 * a[0] + 2 * (1 - q) * q * mx + q * q * b[0], (1 - q) ** 2 * a[1] + 2 * (1 - q) * q * my + q * q * b[1]]); }
    S.push({ pts, o: r(), w: long ? .9 : .6 + r() * .5, warm: r() });
  }
  S.sort((p, q) => p.o - q.o);
  // outlines of the three parts
  const out = [arc(-.76, 0, 1, 0, TAU, 40).map(([x, y]) => [-.76 + (x + .76) * .24, y * .48]), arc(.76, 0, 1, 0, TAU, 40).map(([x, y]) => [.76 + (x - .76) * .24, y * .48]), arc(-.17, -.02, 1, 0, TAU, 40).map(([x, y]) => [-.17 + (x + .17) * .26, -.02 + (y + .02) * .36]), arc(.17, -.02, 1, 0, TAU, 40).map(([x, y]) => [.17 + (x - .17) * .26, -.02 + (y + .02) * .36])];
  BRAIN = { S, out }; return BRAIN;
}
export function flyBrain(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const { S, out } = brainGeo(), sc = o.s ?? 1, cool = o.col === 'cool', n = S.length;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.scale(s, s);
  halo(ctx, 0, 0, 1.25, .28 * u, cool ? COOL.halo : GOLD.halo, cool ? COOL.core : GOLD.core);
  for (const o2 of out) path(ctx, o2, span(u, 0, .25), { col: rgba(cool ? COOL.line : GOLD.line, .45), w: 1.4 / sc / s });
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const st = S[i], su = span(u, .05 + i / n * .8, .05 + i / n * .8 + .12); if (su <= 0) break;
    const col = cool ? COOL.body : mixHex(GOLD.body, GOLD.line, st.warm);
    path(ctx, st.pts, su, { col: rgba(col, .42), w: st.w / sc / s * 1.4 });
  }
  const fire = clamp(o.fire ?? 0);
  if (fire > 0) for (let j = 0; j < 14; j++) {
    const st = S[(j * 61) % n], ph = ((t * .9 + j * .37) % 1);
    const p = st.pts[Math.min(10, Math.floor(ph * 10))]; halo(ctx, p[0], p[1], .06, .9 * fire, GOLD.halo, GOLD.core);
    path(ctx, st.pts, 1, { col: rgba(GOLD.core, .5 * fire), w: 1.6 / sc / s });
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ cell · gene row · mouse
// a living cell: wobbling membrane, nucleus; o.drug 0..1 (a cool drop approaches from the right and touches), o.predict 0..1 (a dashed cool
// outline already shows the reaction before the drop lands), o.react 0..1 (the cell takes that shape), o.s view scale
export function cell(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const sc = o.s ?? 1, react = clamp(o.react ?? 0), k = expoOut(u);
  const shape = (amp, ph, squash) => Array.from({ length: 49 }, (_, i) => { const a = i / 48 * TAU, rr = r * k * (1 + amp * Math.sin(a * 3 + ph) + .03 * Math.sin(a * 7 + t * .8)); return [x + Math.cos(a) * rr * (1 + squash), y + Math.sin(a) * rr * (1 - squash * .6)]; });
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const mem = shape(.04 + .06 * react, t * .3, .12 * react);
  ctx.fillStyle = rad(ctx, x, y, r * 1.2, [[0, rgba(GOLD.body, .22)], [1, rgba(GOLD.deep, .08)]]); ctx.beginPath(); mem.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.fill();
  path(ctx, mem, 1, { col: rgba(GOLD.line, .85), w: 2.4 / sc, glow: 8 / sc });
  ctx.fillStyle = rgba(GOLD.body, .55); ctx.beginPath(); ctx.arc(x - r * .15, y - r * .05, r * .28 * k, 0, TAU); ctx.fill();
  const pr = clamp(o.predict ?? 0); if (pr > 0) path(ctx, shape(.1, t * .3, .12), pr, { col: rgba(COOL.line, .9), w: 2 / sc, dash: [10 / sc, 8 / sc] });
  const dg = clamp(o.drug ?? 0); if (dg > 0) drop(ctx, lerp(x + r * 2.6, x + r * 1.08, sineIO(dg)), y - r * .2, r * .12, Math.min(1, dg * 3), sc);
  ctx.restore();
}
// a row of genes: n short bars on a strand; o.scan 0..1 (a cool scan line passes left → right), o.pick index (lights gold after the scan
// passes it), o.u, o.s
export function geneRow(ctx, t, x, y, w, n, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const sc = o.s ?? 1, step = w / n, scan = clamp(o.scan ?? 0), sx = x + w * scan; let pick = null;
  path(ctx, [[x, y], [x + w, y]], u, { col: rgba(CREAM, .4), w: 1.4 / sc });
  for (let i = 0; i < n; i++) {
    const gx = x + (i + .5) * step, gu = span(u, i / n * .8, i / n * .8 + .2), hgt = (14 + 10 * Math.sin(i * 2.3)) / sc;
    if (gu <= 0) continue;
    const isPick = i === o.pick, lit = isPick ? expoOut(clamp((sx - gx) / (40 / sc) + .5)) * (scan > 0 ? 1 : 0) : 0;
    ctx.fillStyle = lit > 0 ? mixHex(CREAM, GOLD.body, lit) : rgba(CREAM, .55 * gu); ctx.fillRect(gx - step * .22, y - hgt * gu, step * .44, hgt * gu * 2);
    if (lit > 0) { halo(ctx, gx, y, 50 / sc * lit, .7 * lit, GOLD.halo, GOLD.core); pick = [gx, y]; }
  }
  if (scan > 0 && scan < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, sx, y, 70 / sc, [[0, rgba(COOL.body, .6)], [1, rgba(COOL.body, 0)]]); ctx.fillRect(sx - 70 / sc, y - 70 / sc, 140 / sc, 140 / sc); ctx.fillStyle = rgba(COOL.core, .8); ctx.fillRect(sx - 1 / sc, y - 40 / sc, 2 / sc, 80 / sc); ctx.restore(); }
  return pick;
}
// a mouse in side view (x, y = the feet's midpoint, s = length), facing right; o.old 0..1 (grey, bent), o.glow 0..1 (a gold spot: the
// boosted gene), o.breath, o.s
export function mouse(ctx, t, x, y, s, o = {}) {
  const sc = o.s ?? 1, old = clamp(o.old ?? 0), b = 1 + .02 * Math.sin(t * 2.6 + x * .01);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.scale(s, s * b);
  ctx.fillStyle = mixHex(mixHex(P.ind2, P.blue1, .4), AGE.deep, old * .6);
  ctx.beginPath(); ctx.ellipse(0, -.2, .36, .2 - old * .03, -old * .08, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(.36, -.24 + old * .03, .15, .11, .3, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(.32, -.36, .07, 0, TAU); ctx.fill();
  ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = .025; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-.34, -.16); ctx.bezierCurveTo(-.6, -.05, -.62, -.32, -.86, -.22); ctx.stroke();
  ctx.strokeStyle = rgba(GOLD.line, .45); ctx.lineWidth = 1.2 / sc / s; ctx.beginPath(); ctx.ellipse(0, -.2, .36, .2 - old * .03, -old * .08, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  const g = clamp(o.glow ?? 0); if (g > 0) halo(ctx, -.02, -.24, .3, .7 * g, GOLD.halo, GOLD.core);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ survey dots · rings · house · brain cube
// a field of n dots (default 100 = 10 × 10, one dot = 1 %): o.on = how many are lit (gold, counted in reading order; may be fractional),
// o.col for the rest ('dim' | 'cool' | 'age'), o.u appear (staggered by reading order, ≤ .8 s), o.gap, o.r, o.mark(i) → 0..1 extra light
export function dots(ctx, t, x, y, o = {}) {
  const n = o.n ?? 100, cols = o.cols ?? 10, gap = o.gap ?? 34, r = o.r ?? 9, u = clamp(o.u ?? 1), on = o.on ?? 0;
  const rest = { dim: rgba(CREAM, .22), cool: rgba(COOL.body, .55), age: rgba(AGE.line, .6) }[o.col ?? 'dim'];
  for (let i = 0; i < n; i++) {
    const du = expoOut(span(u, i / n * .7, i / n * .7 + .3)); if (du <= 0) continue;
    const cx = x + (i % cols) * gap, cy = y + Math.floor(i / cols) * gap, lit = clamp(on - i), m = o.mark ? clamp(o.mark(i)) : 0;
    if (lit > 0 && i % 7 === 0) halo(ctx, cx, cy, r * 3, .25 * lit, GOLD.halo, GOLD.core);
    ctx.fillStyle = lit > 0 ? mixHex(CREAM, GOLD.body, lit) : rest; ctx.beginPath(); ctx.arc(cx, cy, r * du * (1 + .25 * m), 0, TAU); ctx.fill();
  }
}
// two joined rings (a marriage), gold; x, y = centre, r ring radius
export function rings(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const sc = o.s ?? 1;
  halo(ctx, x, y, r * 3, .35 * u, GOLD.halo, GOLD.core);
  for (const [dx, ph] of [[-r * .55, 0], [r * .55, 1.3]]) path(ctx, arc(x + dx, y, r, ph - Math.PI / 2, ph - Math.PI / 2 + TAU, 40), u, { col: GOLD.body, w: (o.w ?? 7) / sc, glow: 10 / sc });
}
// a house with one warm window (people's light = LAMP); x, y = bottom centre, w = width; o.lit 0..1, o.roof 'gable' | 'flat'
export function house(ctx, t, x, y, w, o = {}) {
  const h = w * .7, lit = clamp(o.lit ?? 1);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = mixHex(P.night1, P.ind2, .6);
  ctx.beginPath(); ctx.rect(x - w / 2, y - h, w, h);
  if ((o.roof ?? 'gable') === 'gable') { ctx.moveTo(x - w / 2 - w * .06, y - h); ctx.lineTo(x, y - h - w * .42); ctx.lineTo(x + w / 2 + w * .06, y - h); }
  ctx.fill();
  const ww = w * .26, wh = h * .34;
  if (lit > 0) halo(ctx, x, y - h * .5, w * .7, .3 * lit, LAMP.body, LAMP.core);
  ctx.fillStyle = mixHex(mixHex(P.night0, P.ind1, .5), LAMP.body, lit); ctx.fillRect(x - ww / 2, y - h * .5 - wh / 2, ww, wh);
  ctx.restore();
}
// a human brain in side view (cream outline) with ONE tiny gold cube (the mapped cubic millimetre); o.cube 0..1, o.u, o.s
export function brainSide(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1), sc = o.s ?? 1; if (u <= 0) return null;
  const q = (a, b) => [x + a * s, y + b * s];
  const pts = [q(-.95, .15), q(-1, -.2), q(-.8, -.55), q(-.4, -.75), q(.1, -.78), q(.55, -.62), q(.88, -.35), q(.98, 0), q(.85, .28), q(.55, .36), q(.38, .5), q(.12, .48), q(-.2, .42), q(-.55, .4), q(-.85, .32), q(-.95, .15)];
  path(ctx, pts, u, { col: rgba(CREAM, .85), w: 2.4 / sc, glow: 6 / sc, glowCol: CREAM });
  for (const [a, b, c, d] of [[-.6, -.3, -.2, -.5], [-.3, .05, .2, -.25], [.2, .1, .6, -.15], [-.75, .05, -.45, .15]]) path(ctx, [q(a, b), q((a + c) / 2, (b + d) / 2 - .06), q(c, d)], span(u, .5, 1), { col: rgba(CREAM, .4), w: 1.6 / sc });
  const cu = clamp(o.cube ?? 0); if (cu > 0) { const c = q(.3, -.3), cs = (o.cubeSize ?? 6) / sc * expoOut(cu); halo(ctx, c[0], c[1], 40 / sc * cu, .8 * cu, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.fillRect(c[0] - cs / 2, c[1] - cs / 2, cs, cs); return c; }
  return q(.3, -.3);
}
// a soft cool beam from (x0, y0) onto a point (x1, y1): the A.I. pointed at something (o.u, o.w spread at the target, o.s)
export function beam(ctx, x0, y0, x1, y1, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const sc = o.s ?? 1, wd = (o.w ?? 70) / sc, ang = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2, ex = Math.cos(ang) * wd, ey = Math.sin(ang) * wd;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, x0, y0, x1, y1, [[0, rgba(COOL.body, .2 * u)], [1, rgba(COOL.body, .05 * u)]]);
  ctx.beginPath(); ctx.moveTo(x0 - ex * .1, y0 - ey * .1); ctx.lineTo(x1 - ex, y1 - ey); ctx.lineTo(x1 + ex, y1 + ey); ctx.lineTo(x0 + ex * .1, y0 + ey * .1); ctx.fill(); ctx.restore();
  halo(ctx, x1, y1, wd * 1.3, .35 * u, COOL.halo, COOL.core);
}
// THE A.I. as a circle (scenario-motion: the machine is a disc / rings / an iris, never a robot or a brain): cool rings that pulse inward
// ("thinking"); x, y, r; o.u, o.think 0..1, o.s
export function aiRing(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1), sc = o.s ?? 1; if (u <= 0) return;
  const k = expoOut(u);
  halo(ctx, x, y, r * 1.8 * k, .24 * u, COOL.halo, COOL.core);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rad(ctx, x, y, r * k, [[0, rgba(COOL.core, .9)], [.35, rgba(COOL.body, .55)], [1, rgba(COOL.deep, .2)]]); ctx.beginPath(); ctx.arc(x, y, r * k, 0, TAU); ctx.fill();
  for (let i = 0; i < 4; i++) { const ph = ((t * .35 * (o.think ?? .5) + i / 4) % 1), rr = r * k * (1.5 - ph * .6); ctx.strokeStyle = rgba(COOL.line, .5 * (1 - Math.abs(ph - .5) * 2) * u); ctx.lineWidth = 2 / sc; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.stroke(); }
  ctx.restore();
}

// ======================================================================================================================== SOURCES / ON-SCREEN STRINGS
// From text-v2.md EINBLENDUNG / ZITATKARTE lines (25.11.). Statement ≤ 6 words + one number (big); the rest in the source line
// (F.source, 22 px, y 880). On screen "AI" (never "A.I."). The fact-checked vo-v3 / faktencheck (expected 25.11.) WINS: if a figure
// there differs, the lead updates this table (builders: say so in the report, never retype a figure in a scene).
export const SOURCES = {
  title: ['THE FIRST GENERATION', 'THAT WON’T DIE'],
  engineering: 'AN ENGINEERING PROBLEM', ai: 'AI', offerHead: 'THE OFFER', offer: ['NO MORE AGING', 'NO END DATE'],
  question: 'If you could stop dying, would you?', pew2013: 'PEW RESEARCH CENTER, 2013',
  copyMind: 'COPY A MIND', flyMap: 'A FLY’S BRAIN, WIRE BY WIRE', flyMapSrc: 'WIRING MAP OF A FRUIT FLY’S BRAIN · FLYWIRE, NATURE 2024',
  flyModel: 'A SIMPLE MODEL STEERS A VIRTUAL BODY', flyModelSrc: 'COMPUTER MODEL IN A VIRTUAL BODY · EON SYSTEMS, MARCH 2026',
  copy: 'COPY', repair: 'REPAIR', y2032: '2032',
  // B1
  kurzweil: ['RAY KURZWEIL', 'INVENTOR AND FUTURIST'], claim: '+1 YEAR FOR EVERY YEAR', wontDie: ['“WON’T DIE”', 'OLD AGE STOPS BEING THE CAUSE'], notImmortal: 'NOT IMMORTALITY',
  accident: 'AN ACCIDENT: STILL POSSIBLE', oldAge: 'OLD AGE: NO LONGER', kDates: ['2029', 'AROUND 2030', '2032'], kDatesTag: 'KURZWEIL’S DATE',
  critics: 'CRITICS: NO PEER-REVIEWED BASIS FOR THE DATE',
  z3: { text: 'bleak, but slightly better than I expected', credit: 'João Pedro de Magalhães · University of Birmingham · on X, 3 Aug 2026', src: 'ABOUT THE BLOG ANALYSIS “ARE WE ON TRACK FOR LONGEVITY ESCAPE VELOCITY?” · ALEXEY STRYGIN, 2026' },
  y2459: '2459', lifetime: 'IN YOUR LIFETIME', centuries: 'FOUR CENTURIES TOO LATE', unlessAI: 'NO CHANCE UNLESS AI SPEEDS IT UP', bet: 'A BET ON AI',
  cell: 'PREDICTED BEFORE THE EXPERIMENT', cellSrc: 'ARC INSTITUTE · “VIRTUAL CELL” MODEL STATE · 2025',
  gene: 'ONE GENE: SRSF1', geneSrc: 'MACHINE LEARNING PICKED THE GENE · NATURE AGING, 14 OCT 2026',
  mice: ['778 DAYS', '886 DAYS'], mice14: '+14%', miceSrc: '10 TREATED VS 9 UNTREATED OLD FEMALE MICE · NATURE AGING, 14 OCT 2026',
  caveats: ['A SMALL STUDY', 'FEMALE MICE ONLY', 'NOT YET REPEATED'], noDrug: 'APPROVED AGAINST AGING ITSELF: NONE', guess: 'A GUESS', real: 'REAL',
  eon: 'EON SYSTEMS · SAN FRANCISCO · 7 MARCH 2026', eonSrc: 'BRAIN MODEL: SHIU ET AL., NATURE 2024 · + VIRTUAL BODY · EON SYSTEMS, 7 MARCH 2026', acts: ['WALK', 'GROOM', 'FEED'],
  headline: '“WE’VE UPLOADED A FRUIT FLY”', headlineSrc: 'EON SYSTEMS, 7 MARCH 2026',
  critics2: ['“NO, A FRUIT FLY HAS NOT BEEN UPLOADED”', '“NO, WE HAVEN’T UPLOADED A FLY YET”'], critics2Src: 'CARBONCOPIES FOUNDATION · LESSWRONG, 19 MARCH 2026',
  point: ['THE REAL FLY’S MEMORIES: NONE', 'WALKING: SEPARATE SOFTWARE'],
  uploads: '“The first human uploads are a few years away, not decades”', uploadsSrc: 'MICHAEL ANDREGG, CEO EON SYSTEMS · INTERVIEW, 17 NOV 2026 · A COMPANY’S CLAIM',
  mm3: '1 MM³ MAPPED', mm3Src: '1 MM³ OF HUMAN BRAIN · 57,000 CELLS · 150 MILLION CONNECTIONS · 1.4 PETABYTES · SCIENCE, 10 MAY 2024', pb: '1,400,000 GIGABYTES',
  isYou: 'IS THAT YOU?',
  // B2
  pew: 'PEW RESEARCH CENTER · “LIVING TO 120 AND BEYOND” · 2013', pew56: '56% “NOT FOR ME”', pew68: '68%: OTHERS WOULD', natgeo: 'NATIONAL GEOGRAPHIC / FINN PARTNERS · 18 AUG 2026',
  shorter: 'A SHORTER LIFE WITHOUT DECLINE', natgeo64: '64% YES', declineTags: ['NO FAILING BODY', 'NO FADING MIND'], oldForever: 'OLD FOREVER', healthy: 'HEALTHY',
  williams: 'BERNARD WILLIAMS · “THE MAKROPULOS CASE” · 1973', fischer: 'JOHN MARTIN FISCHER · “WHY IMMORTALITY IS NOT SO BAD” · 1994', boredom: 'BOREDOM',
  scenario: 'SCENARIO · A LIFE WITH NO END DATE', oldest: 'OLDEST ALIVE TODAY', marriage: 'TILL DEATH DO US PART', y30: '≈ 30 YEARS',
  gratton: 'LYNDA GRATTON · LONDON BUSINESS SCHOOL · CO-AUTHOR, “THE 100-YEAR LIFE” (2016)', plan3: ['LEARN', 'WORK', 'RETIRE'], careers: '5 CAREERS',
  inherit: 'IT NEVER ARRIVES', fedea: 'SPAIN: A FIRST INHERITANCE NOW ARRIVES ALMOST 20 YEARS LATER IN LIFE · FEDEA, APRIL 2026', gain: 'THE GAIN', price: 'THE PRICE',
  planck: { text: 'A new scientific truth does not triumph by convincing its opponents and making them see the light, but rather because its opponents eventually die, and a new generation grows up that is familiar with it.', credit: 'Max Planck · Scientific Autobiography, 1948 (English 1949)' },
  azoulay: '+8.6% PAPERS BY OUTSIDERS', azoulaySrc: 'AFTER A STAR SCIENTIST’S EARLY DEATH · AZOULAY, FONS-ROSEN & GRAFF ZIVIN, AMERICAN ECONOMIC REVIEW, 2019',
  // B3
  beijing: 'BEIJING · 3 SEPTEMBER 2025',
  z1: { putin: 'Human organs can be transplanted again and again; people can grow younger, perhaps even become immortal.', putinCredit: 'Interpreter for Vladimir Putin (in Chinese; paraphrased, translations differ)',
    xi: 'Some predict that in this century humans may live to 150 years old.', xiCredit: 'Xi Jinping', src: 'CCTV POOL FEED, VIA AP / REUTERS · PUTIN CONFIRMED THE EXCHANGE TO REPORTERS THE SAME DAY' },
  seats: ['ANY PRESIDENT', 'ANY JUDGE', 'ANY FOUNDER'], steps: 'WHO STEPS ASIDE?', wealthy: 'ONLY THE WEALTHY', wealthySrc: 'PEW RESEARCH CENTER, 2013 · ALMOST TWO-THIRDS EXPECTED ONLY THE WEALTHY WOULD HAVE ACCESS',
  poorTitle: 'YEARS LIVED IN POOR HEALTH', poor: ['WORLD 9.6', 'USA 12.4'], poorSrc: 'JAMA NETWORK OPEN, DEC 2024 (DATA: 2019)',
  genome: ['$95 MILLION', 'A FEW HUNDRED $'], genomeSrc: 'READING ONE HUMAN GENOME · 2001 VS TODAY · NHGRI (AS OF 2022)', costsUp: 'NEW MEDICAL TECHNOLOGY: 27–48% OF US HEALTH-SPENDING GROWTH SINCE 1960 · HEALTH AFFAIRS, 2009',
  rules3: ['WHO STEPS ASIDE', 'WHO PAYS', 'WHO CAN AFFORD IT'], us22: 'USA · 22ND AMENDMENT, 1951 · TWO TERMS',
  denmark: 'DENMARK · LAW OF 22 MAY 2025 · RETIREMENT AGE 70 FROM 2040 · LINKED TO LIFE EXPECTANCY',
  montana: 'MONTANA · SENATE BILL 535, SIGNED MAY 2025 · SALE AFTER A PHASE 1 TRIAL · 2% OF ANNUAL PROFIT FOR TREATMENT ACCESS IN THE STATE', access: 'ACCESS', risk: 'RISK',
  gavrilov: 'POPULATION PROJECTION FOR SWEDEN WITHOUT AGING · GAVRILOV & GAVRILOVA, REJUVENATION RESEARCH, 2010',
  kids20: '1 IN 5', kids20Src: 'NATIONAL GEOGRAPHIC SURVEY, 2026: 20% WOULD ACCEPT STRICTER LIMITS ON HAVING CHILDREN, FOR A LIFE BEYOND 120',
  tags: ['HEALTHY', 'FOR EVERYONE', 'WITH RULES'], range: ['THE NEXT DECADE', 'FOUR CENTURIES'], notYet: 'IN A HUMAN: NOT YET', accept: 'WE ACCEPT', workOn: 'WE WORK ON',
  qs: ['DO WE WANT THIS?', 'WHAT DOES IT DO TO A LIFE?', 'WHO GETS IT?'],
};
