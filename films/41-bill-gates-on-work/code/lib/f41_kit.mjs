// Film 41 · "Bill Gates Changed His Mind About AI and Jobs" (thumbnail A: GATES CHANGED HIS MIND ON AI) · shared kit (owned by the lead;
// builders import, never edit — wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText,
// the 2.5D card stage cam3/card/aim/project/camDrift, finish) + lib/f16_kit.mjs (rise, maskLine, measure) + lib/f54_kit.mjs (bracket, source).
// Plan: docs/MOTION.md (a locked-frame MOTION-DESIGN film, REGELN §13: one graphic per sentence, 60–70 % explainers) · shots: docs/shots.md
// · the recurring scenes, seam plates and end screen: lib/f41_world.mjs · the graphic vocabulary: the last section of this file.
//
//   THE HAND (thumbnail A): Gates' verdict as a giant hand of warm light in the sky; turn 0 = thumb up (2023: "manageable"), 1 = thumb
//     down (2026: "far fewer jobs"). hand(). Its gold is the film's hero light in the hook; later it stays dim in the sky (his view).
//   THE LIST: HUMAN RESERVED, a tall sheet of light standing in the square; empty lines (never rungs, never a ladder). list().
//   THE TIMELINE (the clock): NOW · 2–8 YEARS · 20 YEARS top right; changes by itself from TIMELINE phrases. timeline(ctx, t, T, o).
//   THE GOLD THREAD = goldSpan(): what is set aside (a line drawn around windows); the list's lines are made of it.
//   SUBSCRIBE: a calm cream pill with a gold ring (subscribe()); no QR, no logo.
//   CLIPS: clipPlate() (C1 FT Live, C2/C3 Decoder; ORIGINAL FOOTAGE; C4 is a quote card since vo-v4) grows out of a window of the wall and goes back into it.
//   PORTRAIT: portrait() (a free Wikimedia Commons photo of Gates as a paper-cut duotone print, ONCE, with its credit line; placeholder
//     silhouette until films/41-assets/gates/portrait-cutout.png + credit.txt exist). Never an AI image, never a drawn likeness.
//
// Colour code: GOLD = Gates' hand, what is set aside / reserved, the list (ONE hero light per frame) · LAMP / amber = people's work, a lit
// window = a job · MACH (cyan) = the machine's light (it takes a window: cold, empty chair) · CREAM = open questions, text · night blue =
// the world. The yellow coat = only you. Never red.
// Rules as everywhere: no canvas, pattern or gradient cache per frame (assets are prepared ONCE); seeded randomness only; nothing from nowhere.
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
export const source = (ctx, t, t0, t1, s, o = {}) => F54.source(ctx, t, t0, t1, s, { size: 22, y: 880, ...o });   // film 66: ≥ 22 px
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

export const PRINT41 = { grain: 14, floor: 4, vig: .5 };
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
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = c; ctx.globalAlpha *= al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
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

// ======================================================================================================================== THE TITLE (frame 0)
// GATES CHANGED / HIS MIND ON AI like thumbnail A: heavy condensed caps, cream with a warm glow, left; the small line under it. u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 72, y = o.y ?? 470, lines = o.lines ?? ['GATES CHANGED', 'HIS MIND ON AI'], cond = o.cond ?? .7;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `100px "Inter Black"`; const wide = Math.max(...lines.map((l) => ctx.measureText(l).width)) * cond / 100;
  const size = Math.min(o.size ?? 420, (o.maxW ?? 940) / wide);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)), ex = o.out != null ? sineIO(clamp(o.out * 1.15 - i * .12)) : 0; if (ui <= 0 || ex >= 1) return;
    const k = expoOut(ui), yy = y + i * size * .86 + (1 - k) * size * .5 + ex * size * .95;   // exit: an even sink behind the line's mask
    ctx.save(); ctx.beginPath(); ctx.rect(x - 40, y + i * size * .86 - size * .82, W, size * .9); ctx.clip();
    ctx.translate(x, yy); ctx.scale(cond, 1);
    ctx.font = `${size}px "Inter Black"`; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '-0.01em';
    ctx.shadowColor = rgba(GOLD.halo, .75); ctx.shadowBlur = size * .16; ctx.fillStyle = '#fff6d8'; ctx.fillText(ln, 0, 0);
    ctx.shadowBlur = 0; ctx.fillStyle = '#fffbea'; ctx.fillText(ln, 0, 0);
    ctx.restore();
  });
  if (o.sub) {
    const su = (o.subU ?? rise(span(u, .5, 1))) * (o.out != null ? 1 - expoIn(clamp(o.out * 1.3 - .25)) : 1);
    if (su > 0) goldText(ctx, [[o.sub, .55]], x + 8, o.subY ?? Math.min(872, y + size * .86 * (lines.length - 1) + size * .3), o.subSize ?? 26, su, { serif: false, weight: 600, spacing: .1 });
  }
  ctx.restore();
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
  if (o.head) { const hs = o.headSize ?? 20; maskLine(ctx, [[o.head, 0]], 34, 50, hs, rise(span(u, .2, .8)), { serif: false, weight: 600, col: night ? GOLD.text : PAPER.faint, glow: false }); yy = 50 + hs * .6; }
  else yy = 20;
  for (const [i, ln] of (o.lines ?? []).entries()) {
    const [txt, size, g = 0, serif = true] = ln; yy += size * 1.18;
    const col = night ? mixHex(P.cream, GOLD.body, g) : mixHex(PAPER.ink, GOLD.deep, g);
    maskLine(ctx, [[txt, 0]], 34, yy, size, rise(span(u, .3 + i * .08, .9 + i * .08)), { serif, weight: 600, col, glow: false });
  }
  if (o.src) maskLine(ctx, [[o.src.toUpperCase(), 0]], 34, h - 24, 15, rise(span(u, .5, 1)), { serif: false, weight: 600, col: night ? P.halo2 : PAPER.faint, glow: false });
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
    const kc = o.kind === 'KNOWN' ? GOLD.body : o.kind === 'FORECAST' ? COOL.body : PAPER.shade, tw = measure(o.kind, 17, false, 600) + 17 * o.kind.length * .14 + 30;
    ctx.fillStyle = rgba(kc, .16); ctx.strokeStyle = rgba(kc, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(30, 26, tw, 34, 17); ctx.fill(); ctx.stroke();
    E.glowText(ctx, o.kind, 30 + 15, 49, { size: 17, weight: 600, spacing: .14, col: kc, glow: false });
  }
  if (o.title) maskLine(ctx, [[o.title, 0]], 34, 102, 22, rise(span(u, .25, .8)), { serif: false, weight: 600, col: P.halo2, glow: false });
  if (o.big) goldText(ctx, [[o.big, 1]], 32, o.title ? 186 : 160, o.bigSize ?? 76, rise(span(u, .35, 1)), { serif: true });
  if (o.small) maskLine(ctx, [[o.small, 0]], 34, o.title ? 236 : 210, 21, rise(span(u, .5, 1)), { serif: false, weight: 600, col: P.cream, glow: false });
  if (o.src) maskLine(ctx, [[o.src.toUpperCase(), 0]], 34, h - 22, 15, rise(span(u, .55, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
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
  if (o.credit) maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 34, 18, rise(span(u, .55, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
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
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The plate grows out of a thing in the world (o.from = { x, y, w, h } screen rect, e.g. the promise tag's face; or [cx, cy, r]) and goes back.
// Lower third (≥ 22 px): NAME (serif) · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE). Wording from <ROOT>clips-geprueft.json once it exists.
// Frames: <F41CLIPS or /tmp/claude-0/f41/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, from <ROOT>clips/Cn.mp4 trimmed to in/out of
// <ROOT>clips-geprueft.json; written by tools/f41_clips.py clips). Until the frames exist a placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIPS = {   // film 41: the real cuts (films/41-assets/clips/, wording films/41-assets/clips-geprueft.json, 24.11.)
  // C1 carries the FT LIVE logo top left and its own FT lower third bottom right: crop .82 anchored bottom right hides the logo and keeps
  // their lower third; our label sits ABOVE the plate (no own lower third over theirs: info.lower = false)
  C1: { name: 'Bill Gates', role: 'Gates Foundation', year: 'Nov 4, 2026', src: 'FT Live', crop: .82, anchor: 'br', lower: false,
    // its first 65 frames are FT's split screen (moderator + Gates, logos, circuit art): show only Gates's own window from it
    // (inside the white frame, 2.1× up, still lip-synced), then the cut to the close-up (frame 66) is a plain camera cut
    split: { until: 65, rect: [1034, 320, 786, 442] } },
  C2: { name: 'Bill Gates', role: 'Co-founder, Microsoft', year: 'Oct 22, 2026', src: 'Decoder with Nilay Patel' },
  C3: { name: 'Bill Gates', role: 'Co-founder, Microsoft', year: 'Oct 22, 2026', src: 'Decoder with Nilay Patel' },
};   // C4 is no longer a clip: a quote card (F.SOURCES.k1), read by the narrator (T.clip('C4') = the card's spoken window, kind 'card')
const CLIPDIR = (process.env.F41CLIPS || '/tmp/claude-0/f41/clips/').replace(/\/?$/, '/');
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
    const cr = info.crop ?? 1, br = info.anchor === 'br', sp = info.split && k <= info.split.until ? info.split.rect : null;
    let sw = fr.width * cr, sh = fr.height * cr, sx = br ? fr.width - sw : (fr.width - sw) / 2, sy = br ? fr.height - sh : Math.min(fr.height - sh, (fr.height - sh) / 2 + (info.cropDy ?? 0) * fr.height);
    if (sp) [sx, sy, sw, sh] = sp;
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
  if (lu > 0) {   // the lower third ABOVE the plate (≥ 22 px): NAME · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE)
    const by = R.y - 40, nw = info.lower === false ? null : maskLine(ctx, [[info.name, 0]], R.x, by, 44, rise(lu), { glow: true });
    if (info.lower !== false) maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x + Math.max(nw?.w ?? 0, measure(info.name, 44, true)) + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
    goldText(ctx, [[info.lower === false ? `${info.src.toUpperCase()} · ${info.year.toUpperCase()} · ORIGINAL FOOTAGE` : `ORIGINAL FOOTAGE (${info.src.toUpperCase()})`, .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
  }
  ctx.restore();
  return { cx, cy, w, h };
}
// ======================================================================================================================== THE BALANCE
// a gold beam on a post at (x, y = the pivot), half width hw; tilt -1..1 (+ = right side down); o.left(ctx, px, py) / o.right(...) draw
// what lies in each pan (pan centre given); u 0..1 draws the beam from the pivot outward and lowers the pans
export function balance(ctx, t, x, y, hw, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const ang = (o.tilt ?? 0) * .32 + .01 * Math.sin(t * 1.3), k = smooth(u);
  goldSpan(ctx, [[x, y + hw * 1.1], [x, y]], 0, smooth(clamp(u * 2)), { w: 2.2, spark: false });
  const ex = Math.cos(ang) * hw * k, ey = Math.sin(ang) * hw * k;
  goldSpan(ctx, [[x - ex, y - ey], [x + ex, y + ey]], 0, 1, { w: 2.6, spark: false, a: clamp(u * 3) });
  halo(ctx, x, y, 30, .6, GOLD.halo, GOLD.core);
  const pan = (px, py, fn) => {
    const d = hw * .55 * span(u, .4, 1); if (d <= 0) return;
    goldSpan(ctx, [[px, py], [px - hw * .16, py + d]], 0, 1, { w: 1.2, spark: false }); goldSpan(ctx, [[px, py], [px + hw * .16, py + d]], 0, 1, { w: 1.2, spark: false });
    goldSpan(ctx, [[px - hw * .2, py + d], [px + hw * .2, py + d]], 0, 1, { w: 2.2, spark: false });
    if (fn) fn(ctx, px, py + d);
  };
  pan(x - ex, y - ey, o.left); pan(x + ex, y + ey, o.right);
  return { L: [x - ex, y - ey], R: [x + ex, y + ey] };
}
// ======================================================================================================================== FILM 41 COLOURS
export const MACH = { core: '#effcff', hot: '#d8f7ff', body: '#8fe6ff', mid: '#55b9d6', deep: '#0a6f8c', halo: '#5fc8e8' };   // the machine's light
export const AMBER = { core: '#ffe9c4', hot: '#ffd08a', body: '#ffb35c', shade: '#7a3b17' };                                  // people at work

// ======================================================================================================================== THE HAND (thumbnail A)
// Gates' verdict: a giant hand of warm light (f10 warm-hand rendering), a fist with the thumb out. Local units: wrist at (0,0), the fist
// along +x, palm length 1, thumb up = -y. turn 0 = thumb up (2023), 1 = thumb down (now): the thumb swings over the front of the fist (the
// thumbnail's arrow), the fist squashes a little mid-turn (it rotates), with a small anticipation and a soft overshoot (never linear).
// hand(ctx, t, x, y, L, o): x, y = wrist, L = palm length (px of the caller space), o: { turn 0..1, ang (forearm → fist direction, default
// 2.55 = the fist down-left of the elbow, the arm leaves the frame top right), lum 0..1 (1 = the hero light; .3 = dim, it stays gold),
// a, ghost 0..1 (the thumb-up pose as a faint after-image), arrow 0..1 (the gold U-turn arc around the fist, thumbnail A), dust }
// Returns { tip, fist, top, m } in caller space (tip = the thumb tip: the gold thread starts there).
import { PathOp } from '@napi-rs/canvas';
const HANDP = new Map();
function cap(p, a, b, w) { const q = new Path2D(); q.moveTo(a[0], a[1]); q.lineTo(b[0], b[1]); return p.op(q.stroke({ width: w, cap: 1, join: 1 }), PathOp.Union); }
const thumbBase = (e, sq) => [.42, lerp(-.27, .27, e) * sq];
function fistPath(th, e, sq, A = 3.8) {
  const key = th.toFixed(3) + ':' + sq.toFixed(3) + ':' + A.toFixed(3); if (HANDP.has(key)) return HANDP.get(key);
  let p = new Path2D();   // the forearm (a soft sleeve of light, tapering into the wrist); A < 3.8 = a short rounded cuff (the small icon)
  { // one formula for every arm length (no pose switch): k 0 = the icon's short rounded cuff (A 1.1), 1 = the long sleeve (A 3.8)
    const k = clamp((A - 1.1) / 2.7), y0 = lerp(-.5, -.62, k), y1 = lerp(.56, .78, k), c2 = lerp(.25, .21, k);
    p.moveTo(-A, y0); p.bezierCurveTo(-A * .6, lerp(-.47, -.55, k), -A * c2, lerp(-.44, -.47, k), -.04, -.4); p.lineTo(-.04, .42);
    p.bezierCurveTo(-A * c2, lerp(.46, .5, k), -A * .6, lerp(.52, .62, k), -A, y1); p.quadraticCurveTo(-A - .55 * (1 - k), (y0 + y1) / 2, -A, y0); p.closePath(); }
  p = cap(p, [.12, 0], [.62, 0], .9 * sq);                                    // the fist block
  const fy = [-.3, -.09, .12, .32];
  fy.forEach((y, i) => { p = cap(p, [.55, y * sq], [i === 3 ? 1.02 : 1.12 - i * .02, y * sq + .02], (i === 3 ? .2 : .235) * sq); });   // the curled fingers
  const b = thumbBase(e, sq), L = .8 * (1 - .22 * Math.sin(Math.PI * clamp(e))), mid = [b[0] + Math.cos(th) * L * .5, b[1] + Math.sin(th) * L * .5], tip = [b[0] + Math.cos(th) * L, b[1] + Math.sin(th) * L];
  p = cap(p, [.16, b[1] * .55], b, .32);                                      // the ball of the thumb
  p = cap(p, b, mid, .3); p = cap(p, mid, tip, .25);                         // the thumb
  if (HANDP.size > 600) HANDP.clear();
  const r = { path: p, tip, fingers: fy.map((y) => [1.08, y * sq]) }; HANDP.set(key, r); return r;
}
function turnEase(u) { u = clamp(u); return sineIO(span(u, .1, .9)) - .07 * Math.sin(Math.PI * span(u, 0, .1)) + .06 * Math.sin(Math.PI * span(u, .8, 1)); }
function warmLight(ctx, path, m, t, o, cx, cy, L) {   // = f10 warmHand (opaque warm light form; lum dims toward gold shadow, never see-through)
  const a = o.a ?? 1, lum = clamp(o.lum ?? .85);
  const k = (c) => mixHex(mixHex(c, P.shade0, .75 * (1 - lum)), P.ind1, .3 * (1 - lum));
  const gold = mixHex(P.halo0, P.coat, .3);
  E.glowFill(ctx, path, L * 1.3, .22 * a * lum, P.blue0);
  E.glowFill(ctx, path, L * .7, .3 * a * lum, P.halo1);
  E.glowFill(ctx, path, L * .18, .42 * a * lum, gold);
  ctx.save(); ctx.globalAlpha = a; ctx.filter = `blur(${L * .022}px)`;
  ctx.fillStyle = rad(ctx, cx, cy, L * 2.6, [[0, k(mixHex(P.core1, gold, .45))], [.18, k(gold)], [.48, k(mixHex(gold, P.halo1, .5))], [.78, k(mixHex(P.halo1, P.shade0, .5))], [1, k(P.shade0)]]);
  ctx.fill(path); ctx.restore();
  ctx.save(); ctx.clip(path); ctx.globalAlpha = .5 * a; ctx.filter = `blur(${L * .05}px)`;
  ctx.strokeStyle = rgba(k(P.shade0), .6); ctx.lineWidth = L * .1; ctx.stroke(path); ctx.filter = 'none';
  const [sx, sy] = E.applyM(m, .5, .6), [ex, ey] = E.applyM(m, .6, -.3);
  ctx.globalAlpha = .3 * a; ctx.fillStyle = lin(ctx, sx, sy, ex, ey, [[0, rgba(k(P.shade0), .9)], [.7, rgba(P.halo1, 0)]]); ctx.fill(path); ctx.restore();
  if ((o.dust ?? 1) > 0) E.dust(ctx, 41, Math.round(6000 * (o.dust ?? 1)), cx, cy, L * 1.3, L * .9, t, a * (.4 + .6 * lum), P.halo0, Math.atan2(m.b, m.a));
}
export function hand(ctx, t, x, y, L, o = {}) {
  const e = turnEase(o.turn ?? 1), ang = (o.ang ?? 2.55) + .015 * Math.sin(t * .4) + .05 * Math.sin(Math.PI * clamp(e)), sq = 1 - .2 * Math.sin(Math.PI * clamp(e));
  const th = -Math.PI / 2 + Math.PI * e + .025 * Math.sin(t * .55);
  const m = E.handMatrix(x, y, ang, L, -1), r = fistPath(th, e, sq, o.arm ?? 3.8);
  const g = clamp(o.ghost ?? 0);
  if (g > 0) {   // the thumb-up after-image (thumbnail A): a faint gold silhouette, no dust
    const gp = new Path2D(); gp.addPath(fistPath(-Math.PI / 2, 0, 1, o.arm ?? 3.8).path, E.handMatrix(x, y, o.ang ?? 2.55, L, -1));
    ctx.save(); ctx.globalAlpha = .22 * g * (o.a ?? 1); E.glowFill(ctx, gp, L * .25, .5, P.halo1); ctx.fillStyle = rgba(mixHex(P.halo1, P.ind2, .35), .8); ctx.fill(gp); ctx.restore();
  }
  const path = new Path2D(); path.addPath(r.path, m);
  const [cx, cy] = E.applyM(m, .5, 0);
  warmLight(ctx, path, m, t, o, cx, cy, L);
  const au = clamp(o.arrow ?? 0);
  if (au > 0) {   // the U-turn arc: from above the fist, round its front, to below it; arrowhead at the head of the drawn part
    const C = [.5, 0], R = 1.32, pts = []; for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + Math.PI * i / 40 * .94; pts.push(E.applyM(m, C[0] + Math.cos(a) * R * .9, C[1] + Math.sin(a) * R)); }
    const head = goldSpan(ctx, pts, 0, au, { w: L * .045, spark: false, a: o.a ?? 1 });
    if (head && au > .2) {
      const k = Math.min(pts.length - 2, Math.floor(au * (pts.length - 1))), d = [pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]], n = Math.hypot(...d) || 1, ux = d[0] / n, uy = d[1] / n, s = L * .2;
      ctx.save(); ctx.globalAlpha = (o.a ?? 1) * span(au, .2, .4); ctx.fillStyle = GOLD.line; ctx.beginPath(); ctx.moveTo(head[0] + ux * s, head[1] + uy * s);
      ctx.lineTo(head[0] - uy * s * .7, head[1] + ux * s * .7); ctx.lineTo(head[0] + uy * s * .7, head[1] - ux * s * .7); ctx.closePath(); ctx.fill(); ctx.restore();
    }
  }
  return { tip: E.applyM(m, r.tip[0], r.tip[1]), fist: [cx, cy], top: E.applyM(m, .5, -.5), m };
}

// ======================================================================================================================== THE LIST
// HUMAN RESERVED: a tall sheet of light (x, y = top left, w, h in caller space). Rules, never rungs: thin gold lines on a luminous sheet,
// no side rails. o: { u 0..1 (the sheet rises from its bottom edge), head 0..1 (HUMAN RESERVED writes itself), n lines (9), lines: [{ text,
// u, faint, gold, cold }] by index (0 = top line), lit (index of an empty line that glows and waits), fill 0..1 (cold lines fill from the
// bottom: "filled in by price"), glow 0..1, a }. Returns { x, y, w, h, line(i) → { x0, x1, y } }.
export function list(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1, n = o.n ?? 9, glow = clamp(o.glow ?? 1);
  const y0 = y + h * (1 - sineIO(u)), hh = y + h - y0;
  const ly = (i) => y + h * .25 + (h * .7) * (i + .5) / n, line = (i) => ({ x0: x + w * .11, x1: x + w * .89, y: ly(i) });
  if (u <= 0) return { x, y, w, h, line };
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x + w / 2, y0 + hh * .45, Math.max(w, hh) * .75, .2 * glow, GOLD.halo, GOLD.core);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 4, y0, w + 8, hh + 2); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, rgba(mixHex(GOLD.hot, P.cream, .3), .3 + .06 * glow)], [.35, rgba(GOLD.body, .17)], [1, rgba(GOLD.mid, .08)]]); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, rgba(GOLD.core, .1)], [.5, rgba(GOLD.core, 0)], [1, rgba(GOLD.core, .07)]]); ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = rgba(GOLD.line, .75); ctx.lineWidth = Math.max(1.5, w * .006); ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = rgba(GOLD.core, .85); ctx.fillRect(x, y0, w, Math.max(2, w * .008));   // the bright rising edge
  // the heading
  const hu = clamp(o.head ?? 1), hs = Math.round(w * .085);
  if (hu > 0) {
    goldText(ctx, [['HUMAN RESERVED', 1]], x + w / 2, y + h * .12, hs, rise(hu), { serif: false, weight: 700, spacing: .08, align: 'center', glow: false });
    goldSpan(ctx, [[x + w * .14, y + h * .155], [x + w * .86, y + h * .155]], 0, smooth(span(hu, .3, 1)), { w: Math.max(1.2, w * .005), spark: false });
  }
  // the lines (empty unless given), the cold fill from the bottom
  const fill = clamp(o.fill ?? 0) * n;
  for (let i = 0; i < n; i++) {
    const L = line(i), it = o.lines?.[i] ?? {}, cold = clamp(it.cold ?? clamp(fill - (n - 1 - i)));
    const lit = o.lit === i ? clamp(o.litA ?? 1) * (.5 - .5 * Math.cos(t * 2.4)) : 0;   // o.litA: ease the waiting line in/out
    if (cold > 0) { ctx.fillStyle = rgba(MACH.body, .32 * cold); ctx.fillRect(L.x0, L.y - h * .045, (L.x1 - L.x0) * sineIO(cold), h * .04); }
    ctx.globalAlpha = a * (it.faint ? .45 : 1);
    goldSpan(ctx, [[L.x0, L.y], [L.x1, L.y]], 0, sineIO(span(u, .3 + i * .05, .7 + i * .05)), { w: Math.max(1, w * (.0035 + .004 * lit)), spark: false, a: .55 + .45 * lit });
    if (lit > 0) halo(ctx, (L.x0 + L.x1) / 2, L.y, w * .35, .18 * lit, GOLD.halo, GOLD.core);
    if (it.text && (it.u ?? 1) > 0) goldText(ctx, [[it.text, it.gold ?? .6]], L.x0 + 4, L.y - h * .012, Math.max(22, Math.min(Math.round(w * .055), Math.floor(Math.round(w * .055) * (L.x1 - L.x0 - 8) / (measure(it.text, Math.round(w * .055), false, 600) * 1.05 + 1)))), rise(it.u ?? 1), { serif: false, weight: 600, spacing: .05, col: it.faint ? CREAM2 : CREAM });
    ctx.globalAlpha = a;
  }
  ctx.restore();
  ctx.restore();
  return { x, y, w, h, line };
}

// ======================================================================================================================== THE TIMELINE (the clock)
// Screen space, top right: a line of light with three stops NOW · 2–8 YEARS · 20 YEARS (text-v3 "Uhr"). Changes on its phrases by itself
// (never by hand): draws itself on TIMELINE.on; stop n lights on its phrase; the third stop pulses once on 'The last is the one' and
// stretches into a band (20 YEARS) on "It's a stretch of time"; a small amber dot (you) sits at the lit stop you stand at. Hidden in clip
// windows. o: { a, big 0..1 (centred, 2×), dx, dy, lit (index to pulse) }. Draw it in EVERY frame from TIMELINE.on (sc02 onward).
export const TIMELINE = {
  on: 'His warning comes with a timeline',
  pulse: 'The last is the one',
  stops: [
    { label: 'NOW', at: 'The first is now', sub: 'SCREEN WORK', subAt: 'So the first stop is the screen' },
    { label: '2–8 YEARS', at: "That's the second stop", sub: 'HAND WORK', subAt: "That's the second stop" },
    { label: '20 YEARS', at: "It's a stretch of time", band: true },
  ],
};
const TLC = new WeakMap();
export function timelineTimes(T) {
  if (TLC.has(T)) return TLC.get(T);
  const on = T.G(TIMELINE.on), pulse = T.G(TIMELINE.pulse, 0, on), at = [], sub = [];
  let prev = on; for (const s of TIMELINE.stops) { const a = T.G(s.at, 0, prev); at.push(a); sub.push(s.subAt ? T.G(s.subAt, 0, prev) : null); prev = a; }
  const r = { on, pulse, at, sub, clips: ['C1', 'C2', 'C3'].map((id) => T.clip(id)).filter(Boolean) }; TLC.set(T, r); return r;
}
export function timelineState(T, t) {
  const b = timelineTimes(T), lit = b.at.map((a) => span(t, a - .1, a + .9));
  const clipHide = b.clips.reduce((m, c) => Math.max(m, span(t, c.start - 1.2, c.start - .4) * (1 - span(t, c.end + .2, c.end + 1))), 0);
  let cur = -1; for (let i = 0; i < 3; i++) if (lit[i] > 0) cur = i;
  return { b, lit, cur, on: smooth(span(t, b.on - .1, b.on + 1.2)) * (1 - clipHide), draw: sineIO(span(t, b.on, b.on + 1.6)),
    pulse: bump(t, b.pulse + .2, 1.4), band: sineIO(span(t, b.at[2] + .1, b.at[2] + 1.9)), sub: b.sub.map((s) => (s == null ? 0 : span(t, s, s + 1))) };
}
const TL_XS = [0, 270, 470], TL_END = 640;
export function timelinePt(i, o = {}) { const x0 = W - 720 + (o.dx ?? 0), y = 92 + (o.dy ?? 0); return [x0 + TL_XS[i], y]; }   // screen point of stop i
export function timeline(ctx, t, T, o = {}) {
  const S = timelineState(T, t), a = (o.a ?? 1) * S.on; if (a <= 0) return;
  const big = sineIO(clamp(o.big ?? 0)), sc = lerp(1, 1.9, big), x0 = lerp(W - 720, W / 2 - TL_END / 2 * 1.9, big) + (o.dx ?? 0), y = lerp(92, 150, big) + (o.dy ?? 0);
  const xs = TL_XS, xEnd = TL_END;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a; ctx.translate(x0, y); ctx.scale(sc, sc);
  goldSpan(ctx, [[-10, 0], [xEnd, 0]], 0, S.draw, { w: 1.4, spark: S.draw < 1, a: .7 });
  for (let i = 0; i < 3; i++) {
    const st = TIMELINE.stops[i], l = S.lit[i], u = span(S.draw, xs[i] / xEnd - .05, xs[i] / xEnd + .05); if (u <= 0) continue;
    const pul = i === 2 ? S.pulse : 0, lit2 = o.lit === i ? clamp(o.litA ?? 1) * (.5 - .5 * Math.cos(t * 2.4)) : 0;   // o.litA: ease the pulse in/out (the caller's span)
    if (st.band && S.band > 0) {   // the third stop stretches into a band (a stretch of time, not a date)
      const bw = (xEnd - xs[i]) * S.band; ctx.fillStyle = lin(ctx, xs[i], 0, xs[i] + bw, 0, [[0, rgba(GOLD.body, .9)], [1, rgba(GOLD.mid, .35)]]);
      ctx.beginPath(); ctx.roundRect(xs[i] - 7, -7, bw + 14, 14, 7); ctx.fill(); halo(ctx, xs[i] + bw / 2, 0, 40 + bw * .4, .25 * S.band, GOLD.halo, GOLD.core);
    }
    const r = 7 + 3 * pul + 2 * lit2;
    ctx.fillStyle = l > 0 ? mixHex(P.night1, GOLD.hot, sineIO(l)) : rgba(P.night0, .7); ctx.beginPath(); ctx.arc(xs[i], 0, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = l > 0 ? rgba(GOLD.core, .9) : rgba(CREAM, .55 + .4 * pul); ctx.lineWidth = 2; ctx.stroke();
    if (l > 0 || pul > 0) halo(ctx, xs[i], 0, 30, .35 * Math.max(l, pul), GOLD.halo, GOLD.core);
    goldText(ctx, [[st.label, l]], xs[i], 40, 22, rise(u), { serif: false, weight: 700, spacing: .06, align: i === 0 ? 'left' : 'center', col: l > 0 ? CREAM : CREAM2 });
    if (st.sub && S.sub[i] > 0) goldText(ctx, [[st.sub, 0]], xs[i], 68, 18, rise(S.sub[i]), { serif: false, weight: 600, spacing: .08, align: i === 0 ? 'left' : 'center', col: CREAM2 });
  }
  if (S.cur >= 0) {   // you: a small amber dot riding the line to the stop you stand at
    const px = lerp(xs[Math.max(0, S.cur - 1)], xs[S.cur], sineIO(S.lit[S.cur])) + (S.cur === 2 ? (xEnd - xs[2]) * .5 * S.band : 0);
    ctx.fillStyle = AMBER.body; ctx.beginPath(); ctx.arc(px, -20, 5, 0, TAU); ctx.fill(); halo(ctx, px, -20, 18, .5, AMBER.body, AMBER.core);
  }
  ctx.restore();
}

// ======================================================================================================================== SUBSCRIBE (calm)
// A cream pill SUBSCRIBE with a small gold ring that closes (no logo, no red, no QR). x, y = centre; u rises it behind a mask; o.ring 0..1.
export function subscribe(ctx, t, x, y, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const s = o.size ?? 1, w = 300 * s, h = 62 * s, k = expoOut(u);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= (o.a ?? 1);
  ctx.beginPath(); ctx.rect(x - w, y - h * .5 - 4, w * 2, h + 8); ctx.clip();
  ctx.translate(x, y + (1 - k) * h * 1.1);
  halo(ctx, 0, 0, w * .7, .2 * u, GOLD.halo, GOLD.core);
  ctx.fillStyle = mixHex(P.cream, GOLD.hot, .12); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
  const rx = -w / 2 + h * .55, ru = clamp(o.ring ?? span(u, .5, 1));
  ctx.strokeStyle = rgba(GOLD.shade, .35); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.arc(rx, 0, h * .22, 0, TAU); ctx.stroke();
  ctx.strokeStyle = GOLD.mid; ctx.beginPath(); ctx.arc(rx, 0, h * .22, -Math.PI / 2, -Math.PI / 2 + TAU * sineIO(ru)); ctx.stroke();
  if (ru >= 1) { ctx.fillStyle = GOLD.mid; ctx.beginPath(); ctx.arc(rx, 0, h * .1, 0, TAU); ctx.fill(); }
  E.glowText(ctx, 'SUBSCRIBE', rx + h * .42, h * .14, { size: 26 * s, weight: 700, spacing: .12, col: P.night1, glow: false });
  ctx.restore();
  return { x: x - w / 2, y: y - h / 2, w, h };
}

// ======================================================================================================================== ASSETS (Gates' portrait)
// films/41-assets/ (pushed by the iMac session): gates/portrait-cutout.png (a FREE Wikimedia Commons photo, cut out) + gates/credit.txt
// (one line, e.g. "PHOTO: <author> · CC BY-SA 4.0 · WIKIMEDIA COMMONS") · clips/clips.md. Until a file exists the kit draws a marked
// placeholder (swapping = a file drop). No AI image of Gates, no drawn likeness, ever.
export const ASSET_DIR = (process.env.F41ASSETS || new URL('../../../41-assets/', import.meta.url).pathname).replace(/\/?$/, '/');
export const ASSETS = { portrait: { files: ['gates/portrait-cutout.png', 'gates/portrait.png'], aspect: .8 } };
const IMG = new Map(); let CREDIT = null; let assetsP = null;
export function prepareAssets() {
  if (assetsP) return assetsP;
  assetsP = (async () => {
    try { CREDIT = fs.readFileSync(ASSET_DIR + 'gates/credit.txt', 'utf8').trim().split('\n')[0]; } catch { CREDIT = null; }
    for (const [id, A] of Object.entries(ASSETS)) {
      const f = A.files.map((n) => ASSET_DIR + n).find((p) => fs.existsSync(p)); if (!f) continue;
      try { const img = await loadImage(fs.readFileSync(f)); IMG.set(id, id === 'portrait' ? duotone(img) : img); console.log(`[f41] asset ${id}: ${f}`); } catch (e) { console.warn(`[f41] asset ${id} failed: ${e.message}`); }
    }
  })();
  return assetsP;
}
export const hasAsset = (id) => IMG.has(id);
export const photoCredit = () => CREDIT || 'PHOTO CREDIT MISSING (films/41-assets/gates/credit.txt)';
function duotone(img) {   // ONCE at load: night indigo → gold → cream by luminance + a cream paper-cut border
  const pad = 18, cw = img.width + pad * 2, ch = img.height + pad * 2, cv = createCanvas(cw, ch), c = cv.getContext('2d');
  for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; c.drawImage(img, pad + Math.cos(a) * 9, pad + Math.sin(a) * 9); }
  c.globalCompositeOperation = 'source-in'; c.fillStyle = PAPER.lit; c.fillRect(0, 0, cw, ch); c.globalCompositeOperation = 'source-over';
  const tmp = createCanvas(img.width, img.height), tc = tmp.getContext('2d'); tc.drawImage(img, 0, 0);
  const id = tc.getImageData(0, 0, img.width, img.height), d = id.data, lo = [0x15, 0x1f, 0x4b], mid = [0xb8, 0x79, 0x2a], hi = [0xfe, 0xf4, 0xbf];
  for (let i = 0; i < d.length; i += 4) {
    const l = (.3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]) / 255, q = l < .5 ? l * 2 : (l - .5) * 2, A = l < .5 ? lo : mid, B = l < .5 ? mid : hi;
    d[i] = A[0] + (B[0] - A[0]) * q; d[i + 1] = A[1] + (B[1] - A[1]) * q; d[i + 2] = A[2] + (B[2] - A[2]) * q;
  }
  tc.putImageData(id, 0, 0); c.drawImage(tmp, pad, pad); return cv;
}
// the portrait print (x, y = bottom centre, h = height; u rises it from behind a mask line at y). Credit: draw F.source(…, F.photoCredit())
export function portrait(ctx, t, x, y, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const img = IMG.get('portrait'), w = img ? h * img.width / img.height : h * ASSETS.portrait.aspect, k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - h * 1.2, w * 2, h * 1.2); ctx.clip();
  ctx.translate(x, y + (1 - k) * h); ctx.rotate((o.rot ?? -.02) + .006 * Math.sin(t * .5));
  halo(ctx, 0, -h * .55, h * .8, .22, P.halo2, CREAM);
  if (img) ctx.drawImage(img, -w / 2, -h, w, h);
  else {
    const s = h / 600; ctx.fillStyle = PAPER.lit;
    ctx.beginPath(); ctx.ellipse(0, -h * .7, 92 * s, 112 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-250 * s, 0); ctx.bezierCurveTo(-240 * s, -h * .38, -100 * s, -h * .44, 0, -h * .44); ctx.bezierCurveTo(100 * s, -h * .44, 240 * s, -h * .38, 250 * s, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.ind2, GOLD.shade, .25);
    ctx.beginPath(); ctx.ellipse(0, -h * .7, 84 * s, 104 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-240 * s, 0); ctx.bezierCurveTo(-230 * s, -h * .37, -96 * s, -h * .43, 0, -h * .43); ctx.bezierCurveTo(96 * s, -h * .43, 230 * s, -h * .37, 240 * s, 0); ctx.closePath(); ctx.fill();
    E.glowText(ctx, 'PORTRAIT PLACEHOLDER (COMMONS)', 0, -h * .2, { size: Math.max(12, 18 * s * 1.6), weight: 700, align: 'center', col: 'rgba(200,40,140,.95)', glow: false });
  }
  ctx.restore();
  return { x, y, w, h };
}
export function nameplate(ctx, t, x, y, u, name = 'BILL GATES', role = 'CO-FOUNDER, MICROSOFT') {
  u = clamp(u); if (u <= 0) return;
  goldSpan(ctx, [[x - 18, y - 40], [x - 18, y + 26]], 0, smooth(clamp(u * 1.6)), { w: 1.6, spark: false });
  maskLine(ctx, [[name, 0]], x, y, 44, rise(u), { glow: true });
  maskLine(ctx, [[role, 0]], x, y + 34, 22, rise(span(u, .2, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
}

// ======================================================================================================================== SOURCES / ON-SCREEN STRINGS
// From skript/text-v3.md PICTURE lines (23.11.). The fact check (iMac) may change wording or dates: the fact-checked text WINS (say so
// in your report; the lead updates this table). ≤ 6 words per statement + one number (verbatim quotes may be longer).
export const SOURCES = {
  title: ['GATES CHANGED', 'HIS MIND ON AI'],
  manageable: '“The risks of AI are real but manageable”', manageableSrc: 'BILL GATES · GATESNOTES · JULY 2023',
  fewer: 'FAR FEWER JOBS', fewerFoot: '“…without the right policies” · GATESNOTES, AUG 26, 2026',
  whatSee: 'WHAT DID HE SEE?',
  crazy: ['“This is crazy.', 'This is insane.”'], crazySrc: 'BILL GATES TO SEMAFOR · AUG 26, 2026',
  silence: '“I’m just deafened by the silence.”', dates: [['AUG 26', 'SEMAFOR'], ['OCT 22', 'DECODER'], ['NOV 4', 'FT LIVE'], ['NOV 12', 'CBS NEWS']],
  off: 'OFF', humanReserved: 'HUMAN RESERVED',
  // later chunks (builders): wording from text-v3 PICTURE lines
  cbs: 'CBS EVENING NEWS · NOV 12, 2026', machineFollows: 'THIS TIME, THE MACHINE CAN FOLLOW',
  convinced: '“I’d love to be convinced that I’m wrong about the job market, but I’m not.”', convincedSrc: 'BILL GATES · AXIOS · AUG 26, 2026',
  screenJobs: ['PHONE SALES', 'PHONE SUPPORT', 'ACCOUNTING'], faster: ['CHEAPER', 'FASTER', 'MORE ACCURATE'], decoderSrc: 'DECODER · OCT 22, 2026',
  gap: '−19%', gapSub: 'AGES 22–25 · MOST AI-EXPOSED JOBS', gapSrc: 'STANFORD DIGITAL ECONOMY LAB · AUG 2026 · PAYROLL DATA', gap2025: '2025: −13%',
  alongside: 'ALONGSIDE PEOPLE: STABLE OR GROWING', screenWork: 'SCREEN WORK',
  ifWeDont: 'IF WE DON’T CHOOSE', levers: ['BUILD', 'BUY', 'SWITCH ON'], dials: ['HOW FAST', 'WHERE'], isHeRight: 'IS HE RIGHT?',
  cofounder: 'CO-FOUNDER, MICROSOFT', shareholder: 'ONE OF THE BIGGEST SHAREHOLDERS', writtenOff: 'WRITTEN OFF RIGHT AWAY', byUse: 'TAX BY USAGE',
  ftTag: 'FT LIVE · NOV 4, 2026', yale: '“AI Is Probably Not (Yet) the Reason for Labor Market Weakening”', yaleSrc: 'YALE BUDGET LAB · SPRING 2026',
  forecast: ['FORECAST', 'FINDING'], verdicts: ['DIRECTION: PLAUSIBLE', 'ENTRY LEVEL: MEASURABLE', 'SPEED AND SIZE: OPEN'],
  twenty: '20 YEARS', plans: ['PLAN 1', 'PLAN 2'], policies: 'WITHOUT THE RIGHT POLICIES', tax: 'TAX', taxUses: ['RETRAINING', 'STRONGER SAFETY NET'],
  etzioni: '“I think he has the diagnosis right, but the prescription wrong, at least in some places.”', etzioniSrc: 'OREN ETZIONI · FOUNDING CEO, ALLEN INSTITUTE FOR AI · ABC NEWS · AUG 2026',
  keystrokes: '“taxing tokens is like taxing keystrokes on a typewriter”',
  hrQuote: '“…as AI and robots improve, we’ll set aside certain things for only people to do. I’ve started calling this domain Human Reserved.”', hrSrc: 'BILL GATES · GATESNOTES · AUG 26, 2026',
  candidates: ['CHILD CARE', 'JURY', 'ART', 'TEACHING · A PERSON IN CHARGE'],
  guesses: ['10%?', '50%?', '90%?'], forty: '“In a very extreme form of it,” 40 % of jobs could at first be reserved for humans. “But that’s as high as I can get.”', fortySrc: 'BILL GATES · AXIOS · AUG 26, 2026',
  k1: ['“Who gets to decide what we reserve', 'for humans? What criteria should we use?”'], k1Src: 'BILL GATES · GATESNOTES · AUG 26, 2026',
  open3: ['WHO DECIDES?', 'WHICH CRITERIA?', 'HOW IS IT ENFORCED?'], weak3: ['UNWRITTEN', 'HARD TO DRAW', 'TOO SHORT'], whyMatter: 'WHY DOES IT MATTER?',
  whoNow: 'WHO DECIDES RIGHT NOW?', leftOver: 'WHATEVER IS LEFT OVER', soFar: 'SO FAR', cost: 'WHAT DOES IT COST?', why: 'WHY SHOULD A PERSON DO THIS?',
  yourLine: 'WHAT WOULD YOU PUT ON IT? AND WHY?', abundance: 'CHEAPER HOMES · CHEAPER FOOD',
  core: ['THE QUESTION IS NO LONGER WHAT AI CAN DO.', 'IT’S WHAT GOES ON THE LIST.', 'AND WHO GETS TO WRITE IT.'],
};

// ======================================================================================================================== THE GRAPHIC VOCABULARY
// REGELN §13 (Jakob 24.11.): one designed motion-graphic per sentence, explainer share 60–70 %, no single world with zooms. The film is
// a LOCKED-FRAME motion-design piece (world-class gate 3, alternative "graphic 2D": continuity comes from morphs, masks, match cuts and
// carried objects, not from a camera flying over one picture). Every graphic is drawn on THE STAGE (night indigo, a few stars, grain)
// with the same few marks: THE TILE (one job), THE GOLD THREAD (goldSpan), kinetic type (say / heavy), the hand, the list, the timeline.
// Motion language: entrances expoOut (0.4–0.8 s), exits expoIn (0.3–0.5 s), moves quartIO; base unit 0.4 s; stagger 40 ms (grids 20 ms,
// ordered from the point of impulse); text never pops: it rises behind its baseline mask and sinks out the same way.

// THE STAGE: night gradient + sparse slow stars (a = star alpha). Fills beyond the frame (the film's float zooms ≤ 1.6 %).
export function stage(ctx, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.night1, P.ind0, .7)]]); ctx.fillRect(0, 0, W, H);
  if (o.glow) halo(ctx, o.glow[0], o.glow[1], o.glow[2], o.glow[3] ?? .12, P.blue0, P.ind1);
  const sx = -((t * 6) % W);   // the stars drift slowly left (nothing ever stands still)
  E.stars(ctx, o.seed ?? 41, o.n ?? 70, t, [sx, 0, W, H * .8], (o.a ?? .5)); E.stars(ctx, o.seed ?? 41, o.n ?? 70, t, [sx + W, 0, W, H * .8], (o.a ?? .5));
  ctx.restore();
}

// KINETIC TYPE. say(ctx, t, words, x, y, o): one line of words [[text, tSpoken], …]; each word rises behind the line's mask .25 s before
// it is spoken (expoOut .55 s), flashes gold on its word and settles to its colour (o.gold = indices that stay gold). o: { size, serif
// (Instrument Serif; default heavy caps = Inter Black condensed), align, col, out (t: the words sink out, 40 ms stagger), a, glow }.
// Returns { x0, x1, y, size, xs } (screen px) so a line or a carrier can start where a word ends.
const nfont = (o, size) => (o.serif ? `${size}px "Instrument Serif"` : o.weight ? `${o.weight} ${size}px Inter` : `${size}px "Inter Black"`);
export function textW(ctx, s, size, o = {}) {   // counts letterSpacing (o.spacing, em) like the drawing does
  ctx.save(); ctx.font = nfont(o, size); const w = (ctx.measureText(s).width + (o.spacing ? s.length * size * o.spacing : 0)) * (o.serif || o.weight ? 1 : (o.cond ?? .86)); ctx.restore(); return w; }
// the type's rise: soft start (no first-frame jump on 100 px+ words), long settle; opacity comes up in the first third; exits accelerate
// gently and fade in their last third (no pop when a word leaves its mask)
export const riseIn = (u) => { u = clamp(u); return 1 - (1 - u ** 1.6) ** 3; };
export const riseA = (u) => smooth(clamp(u / .35));
export const sinkOut = (u) => { u = clamp(u); return u * u * (3 - 2 * u) * .4 + u * u * .6; };
export const sinkA = (u) => 1 - smooth(clamp((u - .55) / .45));
export function say(ctx, t, words, x, y, o = {}) {
  const size = o.size ?? 64, cond = o.serif || o.weight ? 1 : (o.cond ?? .86), gap = size * (o.serif ? .26 : .24), a = o.a ?? 1;
  const ws = words.map(([w]) => textW(ctx, w, size, o)), total = ws.reduce((s, v) => s + v, 0) + gap * (words.length - 1);
  let xx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x; const xs = [];
  ctx.save(); ctx.globalAlpha *= a; ctx.font = nfont(o, size); ctx.textBaseline = 'alphabetic';
  if (o.spacing) ctx.letterSpacing = `${o.spacing}em`;
  words.forEach(([w, ts], i) => {
    xs.push(xx);
    const ru = span(t, ts - .28 - size / 1200, ts + .32 + size / 500), u = riseIn(ru), ou = o.out != null ? span(t, o.out + i * .04, o.out + i * .04 + .4 + size / 1000) : 0, out = sinkOut(ou);
    if (ru > 0 && ou < 1) {
      const dy = (1 - u) * size * 1.1 + out * size * 1.1, flash = Math.max(0, 1 - Math.abs(t - ts - .12) / .5), keep = o.gold?.includes(i) ? 1 : 0;
      const col = mixHex(o.col ?? P.cream, GOLD.body, clamp(Math.max(keep * span(t, ts, ts + .4), flash * .85)));
      ctx.save(); ctx.beginPath(); ctx.rect(xx - size * .2, y - size * 1.3, ws[i] + size * .4, size * 1.3 + size * .34); ctx.clip();
      if ((keep || flash > 0) && o.glow !== false) { ctx.shadowColor = rgba(GOLD.halo, .7); ctx.shadowBlur = size * .35 * Math.max(keep, flash); }
      ctx.globalAlpha *= riseA(ru) * sinkA(ou); ctx.fillStyle = col; ctx.translate(xx, y + dy); ctx.scale(cond, 1); ctx.fillText(w, 0, 0);
      ctx.restore();
    }
    xx += ws[i] + gap;
  });
  ctx.restore();
  return { x0: xs[0], x1: xx - gap, y, size, xs, ws };
}
// a line of heavy caps that rises as one (u) and sinks out (out 0..1); o as say (one colour, o.gold 0..1 mixes toward gold)
export function heavy(ctx, s, x, y, size, u, o = {}) {
  u = clamp(u); const out = clamp(o.out ?? 0); if (u <= 0 || out >= 1) return null;
  const cond = o.serif || o.weight ? 1 : (o.cond ?? .86), w = textW(ctx, s, size, o), x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * riseA(u) * sinkA(out); ctx.beginPath(); ctx.rect(x0 - size * .3, y - size * 1.3, w + size * .6, size * 1.3 + size * .34); ctx.clip();
  ctx.font = nfont(o, size); if (o.spacing) ctx.letterSpacing = `${o.spacing}em`;
  const g = clamp(o.gold ?? 0); if (g > 0 && o.glow !== false) { ctx.shadowColor = rgba(GOLD.halo, .6 * g); ctx.shadowBlur = size * .3; }
  ctx.fillStyle = mixHex(o.col ?? P.cream, GOLD.body, g);
  ctx.translate(x0, y + (1 - riseIn(u)) * size * 1.1 + sinkOut(out) * size * 1.1); ctx.scale(cond, 1); ctx.fillText(s, 0, 0);
  ctx.restore();
  return { x0, x1: x0 + w, y, w };
}
// a small caps label (Inter 600, spaced) that rises behind its mask: kicker lines, sources, axis labels (≥ 22 px)
export const label = (ctx, s, x, y, u, o = {}) => heavy(ctx, s, x, y, o.size ?? 24, u, { weight: 600, spacing: .12, col: o.col ?? CREAM2, ...o });

// THE TILE: one job. tile(ctx, t, x, y, s, o) x, y = centre, s = side. A small lit square of a window: amber = a person does it, cyan =
// the machine does it (cold, empty), gold = reserved. o: { cold 0..1, gold 0..1, dim 0..1 (sinks into the night), a, flash 0..1 (a
// passing ripple: white-cyan rim), v 0..1 (own brightness), glyph 'screen' | 'hand' | 'person' | 'you', ga (glyph alpha), rot, lift 0..1 (a soft shadow + halo) }
export function tile(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= .5) return;
  const cold = clamp(o.cold ?? 0), gold = clamp(o.gold ?? 0), dim = clamp(o.dim ?? 0), r = s * .16;
  const v = 1 - clamp(o.v ?? 1);   // o.v 0..1: a window's own brightness (seeded by the caller), so a field reads as lit windows, not keys
  const top = mixHex(mixHex(mixHex(mixHex(AMBER.body, AMBER.hot, .45), MACH.hot, cold), GOLD.hot, gold), P.night1, clamp(dim * .8 + v * .3));
  const bot = mixHex(mixHex(mixHex(mixHex(AMBER.shade, AMBER.body, .25), MACH.deep, cold), GOLD.shade, gold), P.night0, clamp(dim * .85 + v * .3));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  const lift = clamp(o.lift ?? 0);
  if (lift > 0) { ctx.fillStyle = rgba(P.night0, .45 * lift); ctx.beginPath(); ctx.roundRect(-s / 2 + s * .06, -s / 2 + s * .12, s, s, r); ctx.fill(); halo(ctx, 0, 0, s * 1.3, .22 * lift * (1 - dim), gold > .5 ? GOLD.halo : cold > .5 ? MACH.halo : AMBER.body, AMBER.core); }
  ctx.fillStyle = lin(ctx, 0, -s / 2, 0, s / 2, [[0, top], [1, bot]]); ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, r); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(mixHex(mixHex(AMBER.core, MACH.core, cold), GOLD.core, gold), P.night1, dim), .55 * (1 - dim * .7)); ctx.lineWidth = Math.max(1, s * .025); ctx.stroke();
  const fl = clamp(o.flash ?? 0);
  if (fl > 0) { ctx.strokeStyle = rgba(MACH.core, .9 * fl); ctx.lineWidth = Math.max(1.5, s * .06); ctx.stroke(); halo(ctx, 0, 0, s * .9, .35 * fl, MACH.halo, MACH.core); }
  if (o.glyph && (o.ga ?? 1) > 0) glyph(ctx, o.glyph, 0, 0, s * .56, mixHex(mixHex(mixHex(AMBER.shade, MACH.deep, cold), GOLD.deep, gold), P.night0, dim), (o.ga ?? 1));
  ctx.restore();
}
// flat glyphs (local, centre x, y, size s): screen · hand · person · you (hooded, yellow coat)
const GLY = new Map();
function glyphPath(kind) {
  if (GLY.has(kind)) return GLY.get(kind);
  let p = new Path2D();
  if (kind === 'screen') { p.roundRect(-.48, -.4, .96, .62, .06); const q = new Path2D(); q.roundRect(-.38, -.31, .76, .44, .03); p = p.op(q, PathOp.Difference); const st = new Path2D(); st.rect(-.06, .22, .12, .14); st.roundRect(-.26, .34, .52, .08, .04); p = p.op(st, PathOp.Union); }
  else if (kind === 'hand') { const hp = new Path2D(); hp.addPath(E.handPath({ pose: 'open' }), E.handMatrix(0, .52, -Math.PI / 2, .5, 1)); const cl = new Path2D(); cl.rect(-.6, -.6, 1.2, 1.1); p = hp.op(cl, PathOp.Intersect); }
  else { p.arc(0, -.24, .17, 0, TAU); const b = new Path2D(); b.moveTo(-.16, -.04); b.bezierCurveTo(-.3, -.02, -.36, .2, -.38, .46); b.lineTo(.38, .46); b.bezierCurveTo(.36, .2, .3, -.02, .16, -.04); b.closePath(); p = p.op(b, PathOp.Union);
    if (kind === 'you') { const hd = new Path2D(); hd.arc(0, -.24, .23, Math.PI * .95, Math.PI * 2.05); hd.lineTo(.2, -.08); hd.lineTo(-.2, -.08); hd.closePath(); p = p.op(hd, PathOp.Union); } }
  GLY.set(kind, p); return p;
}
export function glyph(ctx, kind, x, y, s, col, a = 1) {
  const p = new Path2D(); p.addPath(glyphPath(kind), { a: s, b: 0, c: 0, d: s, e: x, f: y });
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = kind === 'you' ? mixHex(P.coat, AMBER.core, .2) : col; ctx.fill(p); ctx.restore();
}
// THE JOB FIELD: a grid layout (cols × rows, tile side s, gap g) centred on (cx, cy). Returns { pos(i) → [x, y], col(i), row(i), n, s }.
export function field(cols, rows, s, g, cx = W / 2, cy = 480) {
  const w = cols * s + (cols - 1) * g, h = rows * s + (rows - 1) * g, x0 = cx - w / 2 + s / 2, y0 = cy - h / 2 + s / 2;
  return { cols, rows, s, g, n: cols * rows, x0, y0, w, h, col: (i) => i % cols, row: (i) => Math.floor(i / cols), pos: (i) => [x0 + (i % cols) * (s + g), y0 + Math.floor(i / cols) * (s + g)] };
}

// YOU AT YOUR DESK (the thumbnail figure): a desk with a lamp, you behind it in the yellow coat (the desk front hides the legs, so you sit).
// x = desk centre, y = floor line, h = your height. o: { look 0..1 (you look up), lamp 0..1, a, dir }
export function desk(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1, lamp = clamp(o.lamp ?? 1), dw = h * 1.5, dh = h * .44, top = y - dh;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x + dw * .3, top - h * .2, h * 1.6, .32 * lamp, AMBER.body, AMBER.core);
  ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.ellipse(x, y + 2, dw * .75, h * .05, 0, 0, TAU); ctx.fill();
  // the chair back
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.roundRect(x - dw * .12 - h * .16, top - h * .3, h * .32, h * .5, h * .05); ctx.fill();
  E.du(ctx, x - dw * .12, y - h * .2, h * .95, { pose: (o.look ?? 0) > .5 ? 'look' : 'stand', look: o.look ?? 0, back: .35, dir: o.dir ?? 1 });
  // the desk (a dark slab, lit top edge from the lamp)
  ctx.fillStyle = mixHex(P.night1, P.ind1, .35); ctx.fillRect(x - dw / 2, top, dw, dh);
  ctx.fillStyle = lin(ctx, x - dw / 2, 0, x + dw / 2, 0, [[0, rgba(AMBER.shade, .5)], [.7, rgba(AMBER.body, .9 * lamp)], [1, rgba(AMBER.shade, .6)]]); ctx.fillRect(x - dw / 2, top, dw, Math.max(2, h * .035));
  // the lamp: arm + shade, warm cone onto the desk
  const lx = x + dw * .3, ly = top;
  ctx.strokeStyle = mixHex(P.night1, P.ind2, .5); ctx.lineWidth = Math.max(2, h * .03); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx - h * .08, ly - h * .32); ctx.lineTo(lx + h * .1, ly - h * .46); ctx.stroke();
  ctx.fillStyle = lin(ctx, 0, ly - h * .5, 0, ly, [[0, rgba(AMBER.core, .35 * lamp)], [1, rgba(AMBER.body, 0)]]);
  ctx.beginPath(); ctx.moveTo(lx + h * .06, ly - h * .44); ctx.lineTo(lx - h * .26, ly); ctx.lineTo(lx + h * .34, ly); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(AMBER.body, P.night1, .25); ctx.beginPath(); ctx.moveTo(lx + h * .02, ly - h * .52); ctx.lineTo(lx + h * .2, ly - h * .5); ctx.lineTo(lx + h * .14, ly - h * .4); ctx.lineTo(lx - h * .02, ly - h * .42); ctx.closePath(); ctx.fill();
  halo(ctx, lx + h * .08, ly - h * .42, h * .25, .7 * lamp, AMBER.body, AMBER.core);
  ctx.restore();
  return { x, y, top, lamp: [lx + h * .08, ly - h * .42], head: [x - dw * .12, y - h * 1.12] };
}
// YOUR WINDOW: a lit window (the tile grown up) with you at your desk inside. box = { x, y, w, h } (screen), o: { u 0..1 (how far the
// tile has opened into a window: 0 = a plain lit tile), look 0..1, glass 0..1 (a dark glass veil, for words written on the pane), a }
export function yourWindow(ctx, t, box, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1, { x, y, w, h } = box, r = lerp(Math.min(w, h) * .16, 8, u);
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x + w / 2, y + h / 2, Math.max(w, h) * .9, .18, AMBER.body, AMBER.core);
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(AMBER.hot, AMBER.shade, .25 * u)], [1, mixHex(AMBER.shade, P.night1, .35 * u)]]); ctx.fillRect(x, y, w, h);
  if (u > 0) {
    ctx.globalAlpha *= u;
    ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(AMBER.shade, P.night1, .35)], [.6, mixHex(AMBER.shade, P.ind1, .25)], [1, mixHex(AMBER.shade, P.night0, .55)]]); ctx.fillRect(x, y, w, h);
    halo(ctx, x + w * .62, y + h * .5, w * .55, .5, AMBER.body, AMBER.core);
    desk(ctx, t, x + w * .5, y + h * .97, h * .5, { look: o.look ?? 0 });
    if ((o.glass ?? 0) > 0) { ctx.fillStyle = rgba(P.night0, .62 * clamp(o.glass)); ctx.fillRect(x, y, w, h); }
  }
  ctx.restore();
  // the frame: a cream rim + one mullion (never a door)
  ctx.strokeStyle = rgba(CREAM, .35 + .5 * u); ctx.lineWidth = lerp(1.5, 5, u); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke();
  if (u > .2) { ctx.globalAlpha *= span(u, .2, 1); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + w * .33, y); ctx.lineTo(x + w * .33, y + h); ctx.stroke(); }
  ctx.restore();
}
// THE SWITCH (not a halt): a pill track with a knob; on 1 = ON (right, amber), 0 = OFF (left). x, y = centre, w = track width.
export function lever(ctx, t, x, y, w, on, o = {}) {
  const a = o.a ?? 1, h = w * .42, kr = h * .4, kx = lerp(x - w / 2 + h / 2, x + w / 2 - h / 2, on);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.clip();
  ctx.fillStyle = rgba(AMBER.body, .35 * on); ctx.fillRect(x - w / 2, y - h / 2, kx - (x - w / 2), h); ctx.restore();
  label(ctx, 'OFF', x - w / 2 - 34, y + 10, 1, { size: 28, col: CREAM2, a: 1 - .45 * on, align: 'right' });
  label(ctx, 'ON', x + w / 2 + 34, y + 10, 1, { size: 28, col: mixHex(CREAM2, CREAM, on), gold: .5 * on, align: 'left' });
  halo(ctx, kx, y, kr * 2.4, .4 * on, AMBER.body, AMBER.core);
  ctx.fillStyle = lin(ctx, 0, y - kr, 0, y + kr, [[0, mixHex(AMBER.core, CREAM, .3)], [1, mixHex(AMBER.body, AMBER.shade, .3)]]); ctx.beginPath(); ctx.arc(kx, y, kr, 0, TAU); ctx.fill();
  ctx.restore();
  return { knob: [kx, y], r: kr, h };
}
