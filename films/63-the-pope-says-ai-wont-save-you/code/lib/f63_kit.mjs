// Film 63 · "The Pope Says AI Won't Save You" (thumbnail A: THE POPE: AI WON'T SAVE YOU) · shared kit (owned by the lead; builders import,
// never edit — wishes go to lib/bN_extra.mjs or the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, figureRaw, halo,
// glowText, finish) + lib/f16_kit.mjs (rise, maskLine, measure) + lib/f54_kit.mjs (source, essay). Plan: docs/MOTION.md · docs/shots.md.
// NOT ONE WORLD (REGELN §13): every sentence gets its own composed motif; motifs are joined by CARRIERS (F.portal, F.iris, F.flyTo, a shape
// that becomes the next shape). The leitbild objects (the machine block, the scale, Babel's tower, Nehemiah's wall) are anchors only.
//
//   TYPE        titleWords() (thumbnail type, word by word on the voice) · goldText/maskLine/verdict · question() (the question chain) ·
//               quoteCard() (paper, words light as spoken; ALWAYS the exact wording + § or source) · strike() (a struck word)
//   OBJECTS     block() THE MACHINE BLOCK (gold monolith, chip + circuit traces, thumbnail A) · pope() (white cassock, faceless) · du() you ·
//               person() everyone else (never yellow) · city() skyline · crowd() unit chart of figures · kitchen() · tile() (a lit window
//               onto a small scene: 'ill' | 'bills' | 'work') · warhead() outline · slot() (an empty word slot) · stopHand() (the Pope's palm)
//   LEITBILD    scale() THE SCALE (big = anchor; o.mini = the explainer icon) · tower() BABEL · wall() NEHEMIAH'S WALL
//   GROUND      night() (explainer ground: night gradient, faint stars, no grain on text) · ground()
//   CARRIERS    iris(ctx, shape, drawB) (B opens inside a shape that belongs to A, rim drawn) · portal() (A pushes into a window, B lives in it)
//   CLIPS       clipPlate(ctx, t, T, 'C1', { from: slotRect, morph }) grows out of an object and returns into it (ORIGINAL FOOTAGE + name)
// Colour code (STIL-editorial-nacht.md): night blue/indigo + GOLD (the one hero light) · CREAM = text, open questions · the yellow coat
// = only you · other people are indigo/blue silhouettes, the Pope white. Never red. Seeded randomness only; nothing created per frame.
import { Path2D, PathOp, loadImage, GlobalFonts, createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import * as F54 from './f54_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, maskLine, measure } = K16;
export const { du, person, figureRaw, handPath, glowText, stars, nightSky } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
export const { essay } = F54;
export const source = (ctx, t, t0, t1, s, o = {}) => F54.source(ctx, t, t0, t1, s, { size: 22, y: 880, ...o });   // ≥ 22 px, above the subtitles
export { ROOT };
export const { cam3, card, camAt, camDrift, aim, project, F0 } = E;
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

export const PRINT63 = { grain: 14, floor: 4, vig: .5 };
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

// ======================================================================================================================== THE TITLE (frame 0)
// THE POPE: / AI WON'T SAVE YOU like thumbnail A: heavy condensed caps, cream with a warm glow, left; the small line under it. u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 72, y = o.y ?? 470, lines = o.lines ?? ['THE POPE:', "AI WON'T SAVE YOU"], cond = o.cond ?? .7;
  ctx.save();
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

export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore(); }
export const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .02 * k * Math.sin(t * .6 + 1), dx = E.drift(t * 2, 16 * k, 11), dy = E.drift(t * 2, 10 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };
// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The plate grows out of a thing in the world (o.from = { x, y, w, h } screen rect, e.g. the promise tag's face; or [cx, cy, r]) and goes back.
// Lower third (≥ 22 px): NAME (serif) · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE). Wording from <ROOT>clips-geprueft.json once it exists.
// Frames: <F63CLIPS or /tmp/claude-0/f63/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, from <ROOT>clips/Cn.mp4 trimmed to in/out of
// <ROOT>clips-geprueft.json; written by tools/f63_clips.py clips). Until the frames exist a placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIPS = {   // film-papst/clip-auftrag-imac.md (24.11.): the four real clips arrive as <ROOT>clips/Cn.mp4 (C2 dropped). Check wording when they land.
  // C1, C4: the official Vatican News video exists only in 480p -> a framed INSET (62 % of the frame width, editorial mat, light grain),
  // never full screen; crop .8 hides the VATICAN NEWS bug (bottom left). C3, C5: DRM News 1080p, lower-third banner from 82 % of the height -> crop to the upper 78 % (crop .78, cropDy -.11) so the banner
  // never shows. Checked 25.11. on the delivered frames. Frames: tools/f63_clips.py-style cut from <ROOT>audio/slots.json file_in_s for dur s (C1 0.8+4.1, C3 0.8+7.9, C4 0.8+7.1, C5 0.8+11.0).
  // C4 wording (text-v3): "We need informed critics who will tell the labs when we are failing. We need moral voices that the incentives cannot bend."
  C1: { name: 'Pope Leo XIV', role: 'Presenting Magnifica humanitas', year: 'Vatican, 25 May 2026', src: 'Vatican News', inset: .6, crop: .8, cropDy: -.1 },
  C3: { name: 'Pope Leo XIV', role: 'Presenting Magnifica humanitas', year: 'Vatican, 25 May 2026', src: 'DRM News', crop: .78, cropDy: -.11 },
  C4: { name: 'Chris Olah', role: 'Co-founder, Anthropic', year: 'Vatican, 25 May 2026', src: 'Vatican News', inset: .6, crop: .8, cropDy: -.1 },
  C5: { name: 'Pope Leo XIV', role: 'Presenting Magnifica humanitas', year: 'Vatican, 25 May 2026', src: 'DRM News', crop: .78, cropDy: -.11 },
};
// the plate rect of a clip: full plate, or the framed inset (centred, a little above the middle so the lower third sits above it)
export function clipRect(id) {
  const k = CLIPS[id]?.inset; if (!k) return CLIP_RECT;
  const w = Math.round(W * k), h = Math.round(w * 9 / 16); return { x: (W - w) / 2, y: 868 - h, w, h, inset: true };   // bottom edge at 868 (frame safety), two label rows above
}
let GRAIN = null;   // a small seeded noise tile for the inset footage (slight grain, hides the 480p softness)
function grainTile() { if (GRAIN) return GRAIN; const c = createCanvas(192, 192), x = c.getContext('2d'), d = x.createImageData(192, 192), r = prng(63); for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r() - .5) * 120; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); return (GRAIN = c); }
const CLIPDIR = (process.env.F63CLIPS || '/tmp/claude-0/f63/clips/').replace(/\/?$/, '/');
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
  const R = clipRect(id), win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], dark = clamp(o.dark ?? 0);
  const { m, cx, cy, w, h, rr } = plateBox(o, R);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (R.inset && m > 0) {   // the editorial mat behind the inset: a dark passe-partout with a soft drop into the night
    const pad = 16 * m; ctx.save(); ctx.shadowColor = rgba(P.night0, .75 * m); ctx.shadowBlur = 40 * m; ctx.shadowOffsetY = 14 * m;
    ctx.fillStyle = mixHex(P.night0, P.ind0, .25); ctx.beginPath(); ctx.roundRect(cx - w / 2 - pad, cy - h / 2 - pad, w + pad * 2, h + pad * 2, Math.min(rr + 6, (w + pad * 2) / 2)); ctx.fill(); ctx.restore(); }
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const k = frameAt(id, t, win), fr = k ? frameCache.get(framePath(id, k)) : null;
  if (fr) {   // the centre crop (info.crop) hides corner logos; then cover the plate
    const cr = info.crop ?? 1, sw = fr.width * cr, sh = fr.height * cr, sx = (fr.width - sw) / 2, sy = Math.min(fr.height - sh, (fr.height - sh) / 2 + (info.cropDy ?? 0) * fr.height);
    const s = Math.max(R.w / sw, R.h / sh) * (w / R.w), dw = sw * s, dh = sh * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, sx, Math.max(0, sy), sw, sh, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1;
    if (R.inset) { ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .07; const pt = ctx.createPattern(grainTile(), 'repeat'), gx = Math.floor(t * 30) * 53 % 192, gy = Math.floor(t * 30) * 97 % 192; ctx.translate(gx, gy); ctx.fillStyle = pt; ctx.fillRect(cx - w / 2 - gx, cy - h / 2 - gy, w, h); ctx.restore(); } }
  else {
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx, cy - h * .05, w * .7, [[0, rgba(P.blue0, .5 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  if (R.inset && m > .5) {   // gold corner brackets on the mat (the editorial frame)
    const k = span(m, .5, 1), c = 34 * k, x0 = cx - w / 2 - 16, y0 = cy - h / 2 - 16, x1 = cx + w / 2 + 16, y1 = cy + h / 2 + 16;
    ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4; for (const [qx, qy, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) { ctx.beginPath(); ctx.moveTo(qx + sx * c, qy); ctx.lineTo(qx, qy); ctx.lineTo(qx, qy + sy * c); ctx.stroke(); } }
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {   // the lower third ABOVE the plate (≥ 22 px): NAME · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE)
    if (R.inset) {   // inset: NAME (serif) + ORIGINAL FOOTAGE (SOURCE) on one row, ROLE · PLACE, DATE under it, all above the mat
      const by = R.y - 72;
      maskLine(ctx, [[info.name, 0]], R.x - 4, by, 44, rise(lu), { glow: true });
      goldText(ctx, [[`ORIGINAL FOOTAGE (${info.src.toUpperCase()})`, .45]], R.x + R.w + 4, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
      maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x - 2, by + 36, 22, rise(span(lu, .1, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
    } else {
      const by = R.y - 40, nw = maskLine(ctx, [[info.name, 0]], R.x, by, 44, rise(lu), { glow: true });
      maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x + Math.max(nw?.w ?? 0, measure(info.name, 44, true)) + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
      goldText(ctx, [[`ORIGINAL FOOTAGE (${info.src.toUpperCase()})`, .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
    }
  }
  ctx.restore();
  return { cx, cy, w, h };
}


// ======================================================================================================================== FILM 63 OBJECTS
const nz2 = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const fract = (x) => x - Math.floor(x);
export const NIGHT = { top: '#070a22', mid: P.night1, low: P.ind0, ink: P.night0 };
export const WHITE = { base: '#e8e3d3', lit: '#fffaf0', shade: '#9fa0b8', deep: '#4a5080' };   // the Pope's cassock (never yellow)
export function poly(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
// screen-space camera for one motif: the design point (cx, cy) sits at the frame centre, zoom z (z = 1, cx = W/2, cy = H/2: identity)
export function look(ctx, cx, cy, z, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
// map a design point through look(cx, cy, z)
export const lookPt = (cx, cy, z, x, y) => [W / 2 + (x - cx) * z, H / 2 + (y - cy) * z];

// ---------------------------------------------------------------- GROUNDS
// the explainer ground: night gradient, a soft hero glow (o.glow = [x, y, r, a]), faint slow stars. Draw it in the motif's own space.
export function night(ctx, t, o = {}) {
  ctx.fillStyle = lin(ctx, 0, -H * .2, 0, H * 1.2, [[0, NIGHT.top], [.55, NIGHT.mid], [1, NIGHT.low]]); ctx.fillRect(-W, -H, W * 3, H * 3);
  if (o.glow) { const [x, y, r, a = .5] = o.glow; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, y, r, [[0, rgba(P.halo1, .22 * a)], [.45, rgba(P.blue0, .14 * a)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
  if (o.stars !== 0) E.stars(ctx, o.seed ?? 63, o.n ?? 160, t, [-80, -60, W + 160, H * .75], (o.stars ?? 1) * .55);
}
// the ground of a scene: a flat land with a lit rim on its horizon line y0, darker toward the bottom
export function land(ctx, y0, o = {}) {
  ctx.fillStyle = lin(ctx, 0, y0, 0, H + 200, [[0, o.top ?? mixHex(P.ind1, P.blue1, .35)], [.25, P.ind0], [1, P.night0]]); ctx.fillRect(-W, y0, W * 3, H * 2);
  ctx.fillStyle = rgba(P.blue1, .55); ctx.fillRect(-W, y0 - 1, W * 3, 2);
}

// ---------------------------------------------------------------- TYPE
// thumbnail type, word by word: lines = [[{ w, u }, …], …] (u 0..1 = the word rising behind its line's mask). Inter Black, condensed, cream
// with a warm glow, left aligned at (x, y) (baseline of line 1). o.size, o.cond, o.lead (line step), o.out 0..1 (the lines sink).
export function titleWords(ctx, lines, x, y, o = {}) {
  const size = o.size ?? 150, cond = o.cond ?? .74, lead = o.lead ?? size * .9;
  ctx.save();
  lines.forEach((ln, i) => {
    const yy0 = y + i * lead; let xx = x;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 60, yy0 - size * .84, W * 2, size * .98); ctx.clip();
    for (const wd of ln) {
      ctx.font = `${size}px "Inter Black"`; ctx.letterSpacing = '-0.01em';
      const ww = ctx.measureText(wd.w + ' ').width * cond, u = clamp(wd.u ?? 1), k = expoOut(u), out = clamp(o.out ?? 0);
      if (u > 0 && out < 1) {
        ctx.save(); ctx.translate(xx, yy0 + (1 - k) * size * .78 + sineIO(out) * size * .95); ctx.scale(cond, 1);
        ctx.shadowColor = rgba(P.halo0, .7); ctx.shadowBlur = size * .15; ctx.fillStyle = wd.col ?? '#fff3d0'; ctx.fillText(wd.w, 0, 0);
        ctx.shadowBlur = 0; ctx.fillStyle = wd.col ?? '#fffbea'; ctx.fillText(wd.w, 0, 0); ctx.restore();
      }
      xx += ww;
    }
    ctx.restore();
  });
  ctx.restore();
}
export function titleWidth(s, size, cond = .74) { const c = createCanvas(8, 8).getContext('2d'); c.font = `${size}px "Inter Black"`; c.letterSpacing = '-0.01em'; return c.measureText(s).width * cond; }
// a struck word: a cream line drawn left → right over (x0..x1, y), u 0..1, slight lift at the end (hand-drawn)
export function strike(ctx, x0, y, x1, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const e = expoOut(u), w = o.w ?? 7;
  ctx.save(); ctx.strokeStyle = o.col ?? CREAM; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.shadowColor = rgba(P.night0, .6); ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.moveTo(x0 - 10, y + 4); ctx.quadraticCurveTo(lerp(x0, x1, .5), y + 2, lerp(x0 - 10, x1 + 14, e), y - 6 * e); ctx.stroke(); ctx.restore();
}
// the question chain: words rise one by one (o.ts = start time per word, or u), cream serif, the ? in gold. Returns { w, x0 }.
export function question(ctx, t, text, x, y, size, o = {}) {
  const words = text.split(/\s+/), ts = o.ts, u = o.u ?? 1, out = clamp(o.out ?? 0);
  const tot = measure(text, size, true); let xx = (o.align ?? 'center') === 'center' ? x - tot / 2 : x; const x0 = xx;
  words.forEach((wd, i) => {
    const ui = ts ? span(t, ts[i] - .08, ts[i] + .42) : span(u, i / words.length * .7, i / words.length * .7 + .3);
    const q = wd.endsWith('?'), base = q ? wd.slice(0, -1) : wd;
    if (ui > 0) {
      maskLine(ctx, [[base, 0]], xx, y + sineIO(out) * size * 1.2, size, rise(ui), { glow: false, col: o.col ?? CREAM });
      if (q) maskLine(ctx, [['?', 1]], xx + measure(base, size, true), y + sineIO(out) * size * 1.2, size, rise(ui), { glow: true, col: GOLD.body });
    }
    xx += measure(wd + ' ', size, true);
  });
  return { w: tot, x0 };
}
// times of each word of a phrase in the VO (for question(), kinetic words): T.GW(from, to, after) → [s, …]
export function wordTimes(T, from, to, after = -1) { try { return T.GW(from, to, after).map((w) => w.s); } catch { return null; } }

// ---------------------------------------------------------------- THE MACHINE BLOCK (thumbnail A)
// x = centre of the front face's foot, y = ground line, w = face width, h = height. o: { lit 0..1, outline 0..1 (only the drawn outline,
// gold trail, no fill), fill 0..1 (default 1), words [{ text, u, v, size }] (engraved on the face at height v 0..1), pulse 1, rays 0..1,
// trace (index of one trace that leaves the chip: o.pull 0..1 = how far it is pulled out, returns its end point), seed }.
// Returns { face: [pts], X(u, v), Y(v), chip: [x, y, s], trace(i) }.
const TRACES = new Map();
function traces(seed) {
  if (TRACES.has(seed)) return TRACES.get(seed);
  const r = prng(seed), out = [];
  for (let side = 0; side < 4; side++) for (let k = 0; k < 7; k++) {
    const f = (k + .5) / 7 * .8 + .1, pts = [];
    // start on the chip edge (chip spans u .3–.7, v .56–.78), go out with one or two right-angle bends
    let u, v, du = 0, dv = 0;
    if (side === 0) { u = lerp(.3, .7, f); v = .78; dv = 1; } else if (side === 1) { u = lerp(.3, .7, f); v = .56; dv = -1; }
    else if (side === 2) { u = .3; v = lerp(.56, .78, f); du = -1; } else { u = .7; v = lerp(.56, .78, f); du = 1; }
    pts.push([u, v]);
    const l1 = .04 + r() * .08; u += du * l1; v += dv * l1 * .9; pts.push([u, v]);
    const bend = (r() - .5) * .16;
    if (du) { v += bend; pts.push([u, v]); u += du * (.06 + r() * .14); } else { u += bend; pts.push([u, v]); v += dv * (.05 + r() * .16); }
    u = clamp(u, .06, .94); v = clamp(v, .08, .95); pts.push([u, v]);
    out.push({ pts, ph: r(), sp: .25 + r() * .35 });
  }
  TRACES.set(seed, out); return out;
}
export function block(ctx, t, x, y, w, h, o = {}) {
  const lit = o.lit ?? 1, fill = o.fill ?? 1, sd = o.side ?? .26;
  const L = (v) => x - w / 2 + w * .03 * v, R = (v) => x + w / 2 - w * .05 * v;
  const X = (u, v) => lerp(L(v), R(v), u), Y = (v) => y - v * h;
  const face = [[L(0), Y(0)], [R(0), Y(0)], [R(1), Y(1)], [L(1), Y(1)]];
  const sideP = [[R(0), Y(0)], [R(0) + w * sd, Y(0) - h * .035], [R(1) + w * sd * .92, Y(1) - h * .02], [R(1), Y(1)]];
  const cx = X(.5, .67), cy = Y(.67), cs = w * .4;
  if (fill > 0) {
    ctx.save(); ctx.globalAlpha *= fill;
    if (lit > 0) {   // the light behind and around the block: a soft halo and slow beams (the hero light)
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rad(ctx, cx, cy, h * 1.05, [[0, rgba(P.halo0, .34 * lit)], [.35, rgba(P.halo1, .14 * lit)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(cx - h * 1.1, cy - h * 1.1, h * 2.2, h * 2.2);
      const rb = o.rays ?? .8;
      if (rb > 0) for (let i = 0; i < 7; i++) {
        const a0 = -2.5 + i * .5 + .03 * Math.sin(t * .2 + i), len = h * (1.3 + .25 * Math.sin(i * 1.7));
        ctx.fillStyle = lin(ctx, cx, cy, cx + Math.cos(a0) * len, cy + Math.sin(a0) * len, [[0, rgba(P.halo2, .1 * rb * lit)], [1, rgba(P.halo2, 0)]]);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a0 - .05) * len, cy + Math.sin(a0 - .05) * len); ctx.lineTo(cx + Math.cos(a0 + .05) * len, cy + Math.sin(a0 + .05) * len); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    // side face: dark, with a faint warm edge
    poly(ctx, sideP); ctx.fillStyle = lin(ctx, R(0), 0, R(0) + w * sd, 0, [[0, mixHex(P.ind1, P.shade0, .25 * lit)], [1, P.night1]]); ctx.fill();
    ctx.strokeStyle = rgba(P.halo1, .35 * lit); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R(0), Y(0)); ctx.lineTo(R(1), Y(1)); ctx.stroke();
    // front face: gold light, brightest round the chip, darker to the top and the edges (grain does the falloff)
    poly(ctx, face);
    ctx.fillStyle = lin(ctx, 0, Y(1), 0, Y(0), [[0, mixHex(P.shade0, '#6e4a22', .4)], [.35, mixHex(P.halo1, P.shade0, .25)], [1, mixHex(P.halo0, P.shade0, .15)]]); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = rad(ctx, cx, cy, h * .75, [[0, rgba(P.core1, .95 * lit)], [.25, rgba(P.halo0, .7 * lit)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(L(0) - 50, Y(1) - 50, w + 100, h + 100);
    // circuit traces with node ends + travelling pulses
    const TR = traces(o.seed ?? 3), lw = Math.max(1.5, w * .009);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    TR.forEach((tr, i) => {
      if (o.trace === i && (o.pull ?? 0) > 0) return;   // the pulled trace is drawn by the caller (heartbeat line)
      const pts = tr.pts.map(([u, v]) => [X(u, v), Y(v)]);
      ctx.strokeStyle = rgba(P.core0, .75 * lit + .2); ctx.lineWidth = lw; ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      const e = pts[pts.length - 1]; ctx.fillStyle = rgba(P.core0, .9); ctx.beginPath(); ctx.arc(e[0], e[1], lw * 2.2, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(P.shade0, .7); ctx.lineWidth = lw * .7; ctx.stroke();
      if ((o.pulse ?? 1) > 0 && lit > .2) {   // a pulse runs out along the trace
        const q = fract(t * tr.sp + tr.ph); const p = along(pts, q);
        halo(ctx, p[0], p[1], lw * 7, .55 * lit * Math.sin(Math.PI * q), P.halo0, P.core0);
      }
    });
    // the chip
    ctx.fillStyle = mixHex(P.halo0, P.core0, .55 * lit); ctx.strokeStyle = rgba(P.core0, .95); ctx.lineWidth = lw * 2.2;
    ctx.beginPath(); ctx.roundRect(cx - cs / 2, cy - cs * .55 / 2 * 1.0, cs, cs * .55, cs * .06); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = lw; ctx.beginPath(); ctx.roundRect(cx - cs * .36, cy - cs * .17, cs * .72, cs * .34, cs * .04); ctx.stroke();
    // engraved words (dark ink in the gold) rise behind a mask
    for (const wd of o.words ?? []) if ((wd.u ?? 1) > 0) maskLine(ctx, [[wd.text, 0]], X(wd.x ?? .5, wd.v), Y(wd.v), wd.size ?? w * .09, rise(wd.u), { serif: true, col: wd.col ?? '#3b2410', glow: false, align: wd.align ?? 'center' });
    ctx.restore();
    // a warm rim on the face's left edge
    ctx.strokeStyle = rgba(P.core1, .55 * lit); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(L(0), Y(0)); ctx.lineTo(L(1), Y(1)); ctx.lineTo(R(1), Y(1)); ctx.stroke();
    ctx.restore();
  }
  if ((o.outline ?? 0) > 0) {   // only the outline: the face drawn as a gold trail (H.16), then the chip
    const u = clamp(o.outline), pts = [...face, face[0]].map((p) => [p[0], p[1]]);
    goldSpan(ctx, pts, 0, smooth(span(u, 0, .75)), { w: o.ow ?? 3 });
    const cp = [[cx - cs / 2, cy - cs * .275], [cx + cs / 2, cy - cs * .275], [cx + cs / 2, cy + cs * .275], [cx - cs / 2, cy + cs * .275], [cx - cs / 2, cy - cs * .275]];
    goldSpan(ctx, cp, 0, smooth(span(u, .55, 1)), { w: (o.ow ?? 3) * .8 });
  }
  const trace = (i) => traces(o.seed ?? 3)[i].pts.map(([u, v]) => [X(u, v), Y(v)]);
  return { face, X, Y, chip: [cx, cy, cs], trace };
}
// a point at fraction q along a polyline
export function along(pts, q) {
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = clamp(q) * len[len.length - 1]; let i = 1; while (i < pts.length - 1 && len[i] < d) i++;
  const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)];
}
// scaffolding round the block (u 0..1 grows bottom → top) with tiny builders (people, not yellow) and a crane. b = block() result.
export function scaffold(ctx, t, b, x, y, w, h, u, o = {}) {
  if (u <= 0) return;
  const lv = 7, poles = [-.1, .22, .5, .78, 1.1], col = mixHex(P.night1, P.ind1, .5), rim = rgba(P.blue0, .9);
  const PX = (pu, v) => lerp(x - w / 2, x + w / 2, pu) + (pu > 1 ? w * .04 : 0), PY = (v) => y - v * h * 1.04;
  const top = u * 1.0;
  ctx.save(); ctx.lineCap = 'round';
  for (const pu of poles) {   // standards
    const v1 = Math.min(top, 1); ctx.strokeStyle = col; ctx.lineWidth = Math.max(3, w * .018); ctx.beginPath(); ctx.moveTo(PX(pu), PY(0)); ctx.lineTo(PX(pu), PY(v1)); ctx.stroke();
    ctx.strokeStyle = rim; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(PX(pu) + 2, PY(0)); ctx.lineTo(PX(pu) + 2, PY(v1)); ctx.stroke();
  }
  const r = prng(o.seed ?? 21);
  for (let k = 1; k <= lv; k++) {
    const v = k / lv, a = span(top, v - .14, v); if (a <= 0) continue;
    const xa = PX(poles[0]), xb = lerp(xa, PX(poles[poles.length - 1]), expoOut(a));
    ctx.fillStyle = col; ctx.fillRect(xa, PY(v) - 5, xb - xa, 10); ctx.fillStyle = rim; ctx.fillRect(xa, PY(v) - 5, xb - xa, 1.5);
    if (k < lv) for (let j = 0; j < poles.length - 1; j++) {   // diagonal braces
      ctx.strokeStyle = rgba(P.ind1, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(PX(poles[j]), PY(v)); ctx.lineTo(lerp(PX(poles[j]), PX(poles[j + 1]), a), lerp(PY(v), PY(v + 1 / lv), a)); ctx.stroke();
    }
    // builders on this level: they climb up onto it (from below the ledger) once it exists
    const n = 2 + (k % 2);
    for (let q = 0; q < n; q++) {
      const pu = .05 + r() * .9, ph = r() * 6, up = expoOut(span(top, v - .05, v + .08));
      if (up <= 0) continue;
      const fx = PX(pu), fy = PY(v) - 5 + (1 - up) * h / lv * .6, fh = h / lv * .62;
      const pose = q % 3 === 0 ? { armR: [2.3 + .3 * Math.sin(t * 1.3 + ph), 2.5 + .3 * Math.sin(t * 1.3 + ph)], lean: .05 } : q % 3 === 1 ? { lean: .22 + .08 * Math.sin(t * 1.1 + ph), armR: [1.2, 1.5 + .4 * Math.sin(t * 1.1 + ph)], armL: [.9, 1.3] } : { pose: 'point', look: .3 };
      ctx.save(); ctx.beginPath(); ctx.rect(fx - fh, PY(v) - fh * 1.6, fh * 2, fh * 1.6 - 4); ctx.clip();
      person(ctx, fx, fy, fh, { ...pose, dir: r() < .5 ? -1 : 1, light: 1, rim: mixHex(P.halo2, P.blue0, .4) });
      ctx.restore();
    }
  }
  // the crane: a lattice mast to the right of the block, a jib that swings slowly, a beam on its hook
  const ca = span(top, .3, .9);
  if (ca > 0) {
    const mx = x + w * (o.craneX ?? 1.0), my = y, mh = h * 1.32 * expoOut(ca), jl = w * 1.05, ang = Math.PI + .06 * Math.sin(t * .35) - .04;
    ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, my - mh); ctx.stroke();
    ctx.strokeStyle = rim; ctx.lineWidth = 1.2; ctx.beginPath(); for (let k = 0; k < 14; k++) { const yy = my - mh * k / 14; ctx.moveTo(mx - 9, yy); ctx.lineTo(mx + 9, yy - mh / 14); } ctx.stroke();
    if (ca > .6) {
      const a2 = expoOut(span(ca, .6, 1)), jx = mx + Math.cos(ang) * jl * a2, jy = my - mh + Math.sin(ang) * jl * a2 * .05;
      ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(mx + w * .25, my - mh); ctx.lineTo(jx, jy); ctx.stroke();
      const hx = lerp(mx, jx, .78), hy = jy + h * (.3 + .05 * Math.sin(t * .5));
      ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hx, jy); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(.08 * Math.sin(t * .5 + 1)); ctx.fillStyle = col; ctx.fillRect(-w * .22, 0, w * .44, 10); ctx.fillStyle = rim; ctx.fillRect(-w * .22, 0, w * .44, 1.5); ctx.restore();
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- PEOPLE
// the Pope: white cassock, white zucchetto, small gold cross; faceless (the head is a dark silhouette). o as du/person (look, lean,
// armR, armL, light, back, dir) + o.raise 0..1 (the right hand rises to a stop: palm out, the thumbnail gesture). Returns the hands.
export function pope(ctx, x, y, h, o = {}) {
  const r = clamp(o.raise ?? 0), e = sineIO(r);
  const armR = o.armR ?? [lerp(.12, 1.95, e), lerp(.08, 2.95, sineIO(span(r, .15, 1)))];
  const hands = E.figureRaw(ctx, x, y, h, { ...o, armR, rim: o.rim ?? mixHex(P.core1, P.halo0, .3) }, { ...WHITE, hem: .035 }, false);
  const dir = o.dir ?? 1, look = o.look ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h);
  const hx = -.012 * look, hy = -.885 - .008 * look;
  ctx.fillStyle = WHITE.lit; ctx.beginPath(); ctx.ellipse(hx - .006, hy - .052, .052, .026, look * -.35, Math.PI, 0); ctx.fill();   // zucchetto
  ctx.fillStyle = GOLD.body; ctx.fillRect(.004, -.71, .012, .07); ctx.fillRect(-.012, -.69, .044, .012);                              // pectoral cross
  ctx.strokeStyle = rgba(GOLD.shade, .9); ctx.lineWidth = .006; ctx.beginPath(); ctx.moveTo(-.05, -.79); ctx.lineTo(.01, -.71); ctx.lineTo(.06, -.79); ctx.stroke();
  ctx.restore();
  return hands;
}
// the Pope's raised palm, big (a carrier into the strike): a white sleeve + open hand. (x, y) = wrist, s = palm length, ang (0 = fingers right)
export function stopHand(ctx, x, y, s, ang, o = {}) {
  const p = E.handPath({ pose: 'open', spread: .35 });
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = lin(ctx, -3, 0, 1.5, 0, [[0, WHITE.shade], [.6, WHITE.base], [1, WHITE.lit]]); ctx.fill(p);
  ctx.fillStyle = WHITE.lit; ctx.beginPath(); ctx.roundRect(-3.6, -.82, 1.2, 1.7, .2); ctx.fill();   // the cuff
  ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = .05; ctx.stroke(p);
  ctx.restore();
}
// a skyline (left part of thumbnail A): seeded blocks, a few lit windows that breathe slowly
const CITY = new Map();
export function city(ctx, t, x0, x1, y, o = {}) {
  const key = `${x0}|${x1}|${o.seed ?? 4}`;
  if (!CITY.has(key)) {
    const r = prng(o.seed ?? 4), bl = []; let x = x0;
    while (x < x1) { const w = 60 + r() * 110, h = 90 + r() * 260 * (o.tall ?? 1); const win = []; for (let k = 0; k < 6; k++) if (r() < .55) win.push([.15 + r() * .7, .1 + r() * .75, r() * 6]); bl.push({ x, w, h, win, d: r() }); x += w + r() * 14; }
    CITY.set(key, bl);
  }
  const far = o.far ?? 0;
  for (const b of CITY.get(key)) {
    const by = y - b.h * (o.sink != null ? 1 - o.sink : 1);
    ctx.fillStyle = lin(ctx, 0, by, 0, y, [[0, mixHex(P.ind1, P.blue1, .25 + far * .3)], [1, mixHex(P.night1, P.ind0, .4)]]); ctx.fillRect(b.x, by, b.w, y - by);
    ctx.fillStyle = rgba(P.blue0, .5); ctx.fillRect(b.x, by, 2, y - by);
    for (const [u, v, ph] of b.win) { const a = .65 + .35 * Math.sin(t * .4 + ph); ctx.fillStyle = rgba(mixHex(P.coat, P.core1, .4), a); ctx.fillRect(b.x + u * b.w, by + v * b.h, 9, 15); }
  }
}
// the unit chart of THE FAITHFUL: 142 figures (1 = 10 million), rows receding to the horizon. o: { x (centre), y0 (front row feet), y1
// (horizon), u 0..1 (rows roll out from the origin outward), sink 0..1 (all sink back under their ground), seed }
const CROWD = new Map();
export function crowd(ctx, t, o = {}) {
  const rows = [18, 17, 16, 15, 14, 14, 13, 12, 12, 11];
  const key = rows.join(',');
  if (!CROWD.has(key)) { const r = prng(11), pts = []; rows.forEach((n, ri) => { for (let k = 0; k < n; k++) pts.push({ ri, k, n, j: (r() - .5) * .5, ph: r() * 6, hh: .9 + r() * .2 }); }); CROWD.set(key, pts); }
  const x = o.x ?? W / 2, y0 = o.y0 ?? H * .8, y1 = o.y1 ?? H * .5, sw = o.w ?? W * 1.1, u = clamp(o.u ?? 1), sink = clamp(o.sink ?? 0);
  const pts = CROWD.get(key).slice().sort((a, b) => b.ri - a.ri);   // far rows first
  for (const p of pts) {
    const d = p.ri / (rows.length - 1), z = 1 - .72 * Math.pow(d, .8), yy = lerp(y0, y1, Math.pow(d, .75)), hw = sw * z * .5;
    const xx = x + (((p.k + .5) / p.n) * 2 - 1 + p.j / p.n) * hw, s = 62 * z * p.hh;
    const dist = Math.hypot((xx - (o.ox ?? x)) / W, (yy - (o.oy ?? y0)) / H), a = expoOut(span(u, dist * .55, dist * .55 + .35)) * (1 - sineIO(span(sink, d * .3, d * .3 + .7)));
    if (a <= 0) continue;
    ctx.save(); ctx.beginPath(); ctx.rect(xx - s, yy - s * 2.2, s * 2, s * 2.2); ctx.clip();
    ctx.translate(xx, yy + (1 - a) * s * 1.15 + .015 * s * Math.sin(t * 1.3 + p.ph));
    ctx.fillStyle = lin(ctx, 0, -s, 0, 0, [[0, mixHex(P.blue0, P.halo2, .25)], [1, mixHex(P.ind1, P.night1, .3)]]);
    ctx.beginPath(); ctx.moveTo(-s * .3, 0); ctx.bezierCurveTo(-s * .32, -s * .5, -s * .28, -s * .74, 0, -s * .76); ctx.bezierCurveTo(s * .28, -s * .74, s * .32, -s * .5, s * .3, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s * .93, s * .15, 0, 6.29); ctx.fill();
    ctx.fillStyle = rgba(P.halo2, .55); ctx.fillRect(-s * .3, -s * .76, s * .6, s * .03);
    ctx.restore();
  }
}

// ---------------------------------------------------------------- THE KITCHEN (H.04, harvest 8.17 / 9.18)
// the room at night: back wall, a window right (o.outside(ctx, rect) draws what is outside, clipped), a pendant lamp, the table.
// Returns { win: {x,y,w,h}, lamp: [x, y], table: y }. o.lamp 0..1 (the lamp's light), o.you (callback drawing you behind the table)
// the window's frame and mullions (drawn again on top by F.portal, so they fly past the camera)
export function kitchenFrame(ctx, open = 0) {   // open 0..1: the mullions slide to the frame edges (the window opens for a push through it)
  const w = KITCHEN.win, op = clamp(open); ctx.fillStyle = mixHex(P.night1, P.ind1, .6);
  ctx.fillRect(w.x - 16, w.y - 16, w.w + 32, 16); ctx.fillRect(w.x - 16, w.y + w.h, w.w + 32, 22); ctx.fillRect(w.x - 16, w.y, 16, w.h); ctx.fillRect(w.x + w.w, w.y, 16, w.h);
  ctx.fillRect(w.x + w.w * lerp(.5, 1, op) - 5, w.y, 10, w.h); ctx.fillRect(w.x, w.y + w.h * lerp(.45, 1, op) - 5, w.w, 10);
  ctx.fillStyle = rgba(P.halo2, .35); ctx.fillRect(w.x - 16, w.y + w.h, w.w + 32, 2);
}
export const KITCHEN = { win: { x: 1170, y: 190, w: 520, h: 470 }, lamp: [700, 300], tableY: 742, tableX: [330, 1110] };
export function kitchen(ctx, t, o = {}) {
  const K = KITCHEN, lamp = clamp(o.lamp ?? 1);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night1, P.ind0, .3)], [.7, mixHex(P.ind0, P.night1, .2)], [1, P.night0]]); ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.fillStyle = rad(ctx, K.lamp[0], K.lamp[1] + 260, 900, [[0, rgba(P.halo1, .22 * lamp)], [.6, rgba(P.shade0, .07 * lamp)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(-W, 868, W * 3, H);   // floor
  ctx.fillStyle = rgba(P.blue1, .4); ctx.fillRect(-W, 866, W * 3, 2);
  // window: the outside, mullions, sill, a cool spill on the wall
  const w = K.win;
  ctx.save(); ctx.beginPath(); ctx.rect(w.x, w.y, w.w, w.h); ctx.clip(); if (o.outside) o.outside(ctx, w); else night(ctx, t); ctx.restore();
  kitchenFrame(ctx);
  // the you callback (behind the table)
  if (o.you) o.you(ctx);
  // the table: top as a lit slab, a dark front, two legs
  const [tx0, tx1] = K.tableX, ty = K.tableY;
  ctx.fillStyle = lin(ctx, 0, ty - 26, 0, ty, [[0, mixHex(P.shade0, P.ind1, .35)], [1, mixHex(P.shade0, P.night1, .55)]]); ctx.beginPath(); ctx.moveTo(tx0 + 30, ty - 26); ctx.lineTo(tx1 - 30, ty - 26); ctx.lineTo(tx1, ty); ctx.lineTo(tx0, ty); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rad(ctx, K.lamp[0], ty - 14, 360, [[0, rgba(P.core1, .55 * lamp)], [1, rgba(P.halo0, 0)]]); ctx.beginPath(); ctx.moveTo(tx0 + 30, ty - 26); ctx.lineTo(tx1 - 30, ty - 26); ctx.lineTo(tx1, ty); ctx.lineTo(tx0, ty); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .35); ctx.fillRect(tx0, ty, tx1 - tx0, 22);
  ctx.fillStyle = P.night1; ctx.fillRect(tx0 + 40, ty + 22, 18, 868 - ty - 22); ctx.fillRect(tx1 - 58, ty + 22, 18, 868 - ty - 22);
  // a cup and a folded paper on the table (life)
  ctx.fillStyle = mixHex(P.cream, P.shade0, .35); ctx.beginPath(); ctx.roundRect(tx0 + 120, ty - 70, 46, 54, [4, 4, 10, 10]); ctx.fill();
  ctx.strokeStyle = mixHex(P.cream, P.shade0, .35); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(tx0 + 170, ty - 46, 13, -1.3, 1.3); ctx.stroke();
  // the pendant lamp: cord, shade, bulb, light cone
  if (o.lampShade !== false) {
    const [lx, ly] = K.lamp, sw = Math.sin(t * .5) * .012;
    ctx.save(); ctx.translate(lx, -40); ctx.rotate(sw); const L = ly + 40;
    ctx.strokeStyle = P.night0; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, L - 40); ctx.stroke();
    ctx.fillStyle = lin(ctx, -70, 0, 70, 0, [[0, P.night1], [.6, mixHex(P.ind1, P.shade0, .3)], [1, P.night1]]); ctx.beginPath(); ctx.moveTo(-26, L - 44); ctx.lineTo(26, L - 44); ctx.lineTo(80, L + 6); ctx.lineTo(-80, L + 6); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (lamp > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, ly, 0, ty, [[0, rgba(P.core1, .2 * lamp)], [1, rgba(P.halo0, .03 * lamp)]]);
      ctx.beginPath(); ctx.moveTo(lx - 78, ly + 8); ctx.lineTo(lx + 78, ly + 8); ctx.lineTo(lx + 380, ty - 20); ctx.lineTo(lx - 380, ty - 20); ctx.closePath(); ctx.fill();
      ctx.restore();
      halo(ctx, lx, ly + 10, 70, .9 * lamp, P.halo0, P.core0);
    }
  }
  return { win: w, lamp: K.lamp, table: ty };
}

// ---------------------------------------------------------------- TILES: a lit window onto a small scene (the three things you would hand over)
// kind 'ill' | 'bills' | 'work'; (x, y) = centre, w × h; o: { u 0..1 (grows out of o.from [x, y] = its origin), lt (local time for the scene),
// rot, outline (only the dashed outline, the harvest 'still a promise'), heal 0..1 ('ill': sits up), shrink 0..1 ('bills') }
export function tile(ctx, t, kind, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), fx = o.from ? lerp(o.from[0], x, k) : x, fy = o.from ? lerp(o.from[1], y, k) : y, s = o.from ? lerp(.06, 1, k) : lerp(.85, 1, k);
  const lt = o.lt ?? t;
  ctx.save(); ctx.translate(fx, fy); ctx.rotate((o.rot ?? 0) * k); ctx.scale(s, s);
  const x0 = -w / 2, y0 = -h / 2, rr = Math.min(w, h) * .06;
  // outer glow + frame
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 0, 0, Math.max(w, h) * .8, [[0, rgba(P.halo1, .16)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(-w, -h, w * 2, h * 2); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, rr); ctx.clip();
  if (!o.outline) TILE_SCENES[kind](ctx, lt, x0, y0, w, h, o);
  else { ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.fillRect(x0, y0, w, h); }
  ctx.restore();
  ctx.strokeStyle = o.outline ? rgba(CREAM, .9) : mixHex(P.cream, P.halo0, .3); ctx.lineWidth = Math.max(2, w * .012);
  if (o.outline) ctx.setLineDash([w * .04, w * .03]);
  ctx.beginPath(); ctx.roundRect(x0, y0, w, h, rr); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  return { x: fx - w * s / 2, y: fy - h * s / 2, w: w * s, h: h * s };
}
const TILE_SCENES = {
  ill(ctx, t, x0, y0, w, h, o) {   // a bedroom: someone ill under a blanket, a lamp, a relative beside the bed
    const X = (u) => x0 + u * w, Y = (v) => y0 + v * h, heal = clamp(o.heal ?? 0);
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + h, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night1]]); ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = rad(ctx, X(.2), Y(.5), w * .6, [[0, rgba(P.halo1, .5 + .25 * heal)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = mixHex(P.night1, P.ind0, .4); ctx.fillRect(x0, Y(.82), w, h * .2);   // floor
    halo(ctx, X(.16), Y(.5), w * .1, .8 + .1 * Math.sin(t * 2), P.halo0, P.core0);     // bedside lamp
    ctx.fillStyle = P.night1; ctx.fillRect(X(.12), Y(.52), w * .08, h * .3); ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.beginPath(); ctx.moveTo(X(.12), Y(.5)); ctx.lineTo(X(.2), Y(.5)); ctx.lineTo(X(.18), Y(.42)); ctx.lineTo(X(.14), Y(.42)); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.ind1, P.shade0, .25); ctx.fillRect(X(.24), Y(.42), w * .05, h * .4);                  // headboard
    ctx.fillStyle = mixHex(P.cream, P.blue1, .5); ctx.fillRect(X(.26), Y(.6), w * .5, h * .08);                     // mattress
    ctx.fillStyle = P.night1; ctx.fillRect(X(.27), Y(.68), w * .02, h * .14); ctx.fillRect(X(.73), Y(.68), w * .02, h * .14);
    const sit = sineIO(heal), br = .006 * Math.sin(t * 1.4);
    ctx.save(); ctx.translate(X(.33), Y(.6)); ctx.rotate(-sit * 1.15);   // head + shoulders: lying → sitting up
    ctx.fillStyle = mixHex(P.cream, P.halo2, .35); ctx.beginPath(); ctx.ellipse(-w * .01, -h * .03, w * .06, h * .035, 0, 0, 6.29); ctx.fill();   // pillow
    ctx.fillStyle = P.ind2; ctx.beginPath(); ctx.arc(0, -h * .06 * (1 + br), h * .05, 0, 6.29); ctx.fill(); ctx.restore();
    ctx.fillStyle = lin(ctx, 0, Y(.52), 0, Y(.64), [[0, mixHex(P.blue1, P.halo2, .35)], [1, mixHex(P.blue1, P.night1, .3)]]);   // blanket mound, breathing
    ctx.beginPath(); ctx.moveTo(X(.34), Y(.6)); ctx.bezierCurveTo(X(.42), Y(.52 - .01 * Math.sin(t * 1.4)), X(.62), Y(.53), X(.76), Y(.6)); ctx.lineTo(X(.76), Y(.66)); ctx.lineTo(X(.33), Y(.66)); ctx.closePath(); ctx.fill();
    person(ctx, X(.86), Y(.84), h * .6, { dir: -1, lean: .2 - .15 * heal, armR: [lerp(1.2, .3, heal), lerp(1.6, .4, heal)], look: lerp(-.3, .2, heal), light: -1 });
  },
  bills(ctx, t, x0, y0, w, h, o) {   // a table seen from above: envelopes and bills slide in and pile up (shrink: the pile goes down to one sheet)
    const X = (u) => x0 + u * w, Y = (v) => y0 + v * h, sh = clamp(o.shrink ?? 0);
    ctx.fillStyle = lin(ctx, x0, y0, x0 + w, y0 + h, [[0, mixHex(P.shade0, P.night1, .55)], [1, mixHex(P.shade0, P.night1, .75)]]); ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = rad(ctx, X(.5), Y(.45), w * .6, [[0, rgba(P.core1, .35)], [1, rgba(P.core1, 0)]]); ctx.fillRect(x0, y0, w, h);
    const r = prng(7), n = 9, show = Math.round(lerp(n, 1, sineIO(sh)));
    for (let i = 0; i < n; i++) {
      const ti = i * .12, a = expoOut(clamp((t - ti) * 2.2)), dx = (r() - .5) * .3, dy = (r() - .5) * .22, rot = (r() - .5) * .5, kind = r() < .4;
      if (i >= show || a <= 0) continue;
      ctx.save(); ctx.translate(X(.5 + dx) + (1 - a) * w * .8, Y(.5 + dy) - i * 3); ctx.rotate(rot + (1 - a) * .4);
      const pw = w * .36, ph = pw * (kind ? .55 : 1.25);
      ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-pw / 2 + 5, -ph / 2 + 7, pw, ph);
      ctx.fillStyle = mixHex(PAPER.lit, PAPER.shade, .3 + .3 * r()); ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
      if (kind) { ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-pw / 2, -ph / 2); ctx.lineTo(0, 0); ctx.lineTo(pw / 2, -ph / 2); ctx.stroke(); ctx.fillStyle = rgba(PAPER.ink, .35); ctx.fillRect(-pw * .1, ph * .05, pw * .35, ph * .12); }
      else { ctx.fillStyle = rgba(PAPER.ink, .55); for (let l = 0; l < 6; l++) ctx.fillRect(-pw * .38, -ph * .38 + l * ph * .1, pw * (l === 0 ? .4 : .7), ph * .025); ctx.fillStyle = rgba(PAPER.ink, .8); ctx.fillRect(pw * .1, ph * .3, pw * .28, ph * .05); }
      ctx.restore();
    }
  },
  work(ctx, t, x0, y0, w, h, o) {   // a workbench under a bare bulb before dawn, a tired figure bent over it, a dark window
    const X = (u) => x0 + u * w, Y = (v) => y0 + v * h;
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + h, [[0, mixHex(P.night1, P.ind1, .35)], [1, P.night0]]); ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = lin(ctx, 0, Y(.12), 0, Y(.5), [[0, mixHex(P.blue0, P.ind1, .3)], [1, mixHex(P.blue1, P.halo2, .25)]]); ctx.fillRect(X(.62), Y(.12), w * .26, h * .38);   // pre-dawn window
    ctx.fillStyle = P.night1; ctx.fillRect(X(.745), Y(.12), w * .012, h * .38); ctx.fillRect(X(.62), Y(.3), w * .26, h * .012);
    const sw = .05 * Math.sin(t * .9), bx = X(.4) + Math.sin(sw) * h * .3, by = Y(.36);
    ctx.strokeStyle = P.night0; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(.4), y0); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = rad(ctx, bx, by + h * .3, w * .45, [[0, rgba(P.halo1, .45)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x0, y0, w, h);
    halo(ctx, bx, by, w * .06, 1, P.halo0, P.core0);
    ctx.fillStyle = mixHex(P.shade0, P.night1, .45); ctx.fillRect(X(.12), Y(.66), w * .62, h * .05);   // bench top
    ctx.fillStyle = P.night1; ctx.fillRect(X(.15), Y(.71), w * .03, h * .25); ctx.fillRect(X(.68), Y(.71), w * .03, h * .25);
    ctx.fillStyle = mixHex(P.cream, P.shade0, .4); ctx.fillRect(X(.4), Y(.62), w * .1, h * .04);   // the piece
    const bob = Math.sin(t * 2.2) * .06;
    person(ctx, X(.3), Y(.96), h * .62, { dir: 1, lean: .32 + .03 * Math.sin(t * .7), armR: [1.35 + bob, 1.9 + bob], armL: [1.1, 1.6], look: -.25, light: 1 });
  },
};

// ---------------------------------------------------------------- EXPLAINER SHAPES
// the warhead outline (nose cone, body, fins) drawn as a cream trail; (x, y) = nose tip, s = length; ang = direction of the nose (0 = up)
export function warheadPts(x, y, s, ang = 0) {
  const pts = [], c = Math.cos(ang), sn = Math.sin(ang), P2 = (u, v) => [x + (u * c - v * sn) * s, y + (u * sn + v * c) * s];
  // local: u across (−.13 … .13), v down from the tip (0 … 1)
  const half = [[0, 0], [.05, .06], [.09, .15], [.115, .27], [.12, .36], [.12, .74], [.11, .78], [.2, .92], [.2, 1], [.08, .94], [.08, .98]];
  for (const [u, v] of half) pts.push(P2(u, v));
  for (const [u, v] of half.slice().reverse()) pts.push(P2(-u, v));
  return pts;
}
export function warhead(ctx, x, y, s, u, o = {}) { if (u <= 0) return; trailCream(ctx, warheadPts(x, y, s, o.ang ?? 0), 0, smooth(clamp(u)), { w: o.w ?? 3 }); }
// a cream line drawn along pts (u0..u1) with a soft glow, the cool partner of goldSpan (open questions, outlines)
export function trailCream(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], sub = [along(pts, u0)]; for (let i = 1; i < pts.length - 1; i++) if (len[i] > u0 * L && len[i] < u1 * L) sub.push(pts[i]); sub.push(along(pts, u1));
  const w = o.w ?? 3;
  for (const [k, al, c] of [[4, .18, P.blue0], [1, 1, o.col ?? CREAM]]) { ctx.save(); ctx.strokeStyle = c; ctx.globalAlpha *= al * (o.a ?? 1); ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
  return sub[sub.length - 1];
}
// an empty word slot (dashed, corner brackets): returns the rect. o.fill 0..1 = it fills with a dark plate (ready for a word or a clip)
export function slot(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), ww = w * lerp(.3, 1, k), x0 = x - ww / 2, y0 = y - h / 2;
  ctx.save();
  ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .92 * k); ctx.beginPath(); ctx.roundRect(x0, y0, ww, h, 10); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.5; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 18; ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4; const c = 26;
  for (const [cx, cy, sx, sy] of [[x0, y0, 1, 1], [x0 + ww, y0, -1, 1], [x0, y0 + h, 1, -1], [x0 + ww, y0 + h, -1, -1]]) { ctx.beginPath(); ctx.moveTo(cx + sx * c, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * c); ctx.stroke(); }
  ctx.restore();
  return { x: x0, y: y0, w: ww, h };
}
// a gold arrow from a to b (drawn with u), slight arc
export function arrow(ctx, a, b, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - (o.arc ?? 40), pts = [];
  for (let i = 0; i <= 24; i++) { const q = i / 24; pts.push([(1 - q) ** 2 * a[0] + 2 * (1 - q) * q * mx + q * q * b[0], (1 - q) ** 2 * a[1] + 2 * (1 - q) * q * my + q * q * b[1]]); }
  const e = goldSpan(ctx, pts, 0, smooth(u), { w: o.w ?? 2.4, spark: false });
  if (u > .85 && e) { const p = pts[pts.length - 2], ang = Math.atan2(b[1] - p[1], b[0] - p[0]), s = 16; ctx.save(); ctx.fillStyle = GOLD.line; ctx.globalAlpha *= span(u, .85, 1); ctx.translate(b[0], b[1]); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-s, -s * .55); ctx.lineTo(-s, s * .55); ctx.closePath(); ctx.fill(); ctx.restore(); }
}
// a small caps label in gold-cream rising behind a mask (≥ 22 px)
export function capsLabel(ctx, s, x, y, u, o = {}) { if (u <= 0) return; maskLine(ctx, [[s, 0]], x, y, o.size ?? 24, rise(u), { serif: false, weight: 600, col: o.col ?? P.halo2, glow: false, align: o.align ?? 'center' }); }

// ---------------------------------------------------------------- LEITBILD (anchors only: hook, the turn, the point, the close)
// THE SCALE: a pillar with a gold beam and two hanging pans. (x, y) = the pivot, s = half beam length. o: { u 0..1 (rises out of the
// ground: pillar grows, beam unfolds), tilt −1..1 (+ = left pan down), left/right(ctx, px, py, s) draw into the pans, labels [l, r]
// (caps under the pans), mini (the explainer icon: thinner, no pillar glow) }. Returns { L: [x, y], R: [x, y] } (pan centres).
export function scale(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), tilt = (o.tilt ?? 0) * .16 + .006 * Math.sin(t * .8), base = y + s * 1.05, mini = !!o.mini;
  const ph = base - lerp(base, y, k);
  // pillar + foot
  ctx.save();
  ctx.fillStyle = lin(ctx, x - s * .06, 0, x + s * .06, 0, [[0, GOLD.shade], [.5, GOLD.body], [1, GOLD.deep]]);
  ctx.beginPath(); ctx.moveTo(x - s * .03, base); ctx.lineTo(x + s * .03, base); ctx.lineTo(x + s * .018, base - ph); ctx.lineTo(x - s * .018, base - ph); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, base, s * .26 * k, s * .045, 0, Math.PI, 0); ctx.fill();
  if (!mini) halo(ctx, x, y, s * .5 * k, .5, GOLD.halo, GOLD.core);
  if (k < .5) { ctx.restore(); return null; }
  const bu = expoOut(span(u, .5, 1)), hw = s * bu, c = Math.cos(tilt), sn = Math.sin(tilt);
  const L = [x - hw * c, y + hw * sn], R = [x + hw * c, y - hw * sn];
  ctx.strokeStyle = GOLD.body; ctx.lineWidth = mini ? s * .03 : s * .04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(L[0], L[1]); ctx.lineTo(R[0], R[1]); ctx.stroke();
  ctx.strokeStyle = GOLD.core; ctx.lineWidth = mini ? s * .008 : s * .01; ctx.beginPath(); ctx.moveTo(L[0], L[1] - s * .01); ctx.lineTo(R[0], R[1] - s * .01); ctx.stroke();
  ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y, s * .05, 0, 6.29); ctx.fill();
  const pans = {};
  for (const [side, P0] of [['L', L], ['R', R]]) {
    const drop = s * .62 * bu, pc = [P0[0], P0[1] + drop], pw = s * .36;
    ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 1.6;
    for (const dx of [-1, 0, 1]) { ctx.beginPath(); ctx.moveTo(P0[0], P0[1]); ctx.lineTo(pc[0] + dx * pw * .92, pc[1]); ctx.stroke(); }
    const content = side === 'L' ? o.left : o.right; if (content) content(ctx, pc[0], pc[1], s);
    ctx.fillStyle = lin(ctx, 0, pc[1], 0, pc[1] + s * .1, [[0, GOLD.body], [1, GOLD.deep]]);
    ctx.beginPath(); ctx.moveTo(pc[0] - pw, pc[1]); ctx.quadraticCurveTo(pc[0], pc[1] + s * .2, pc[0] + pw, pc[1]); ctx.closePath(); ctx.fill();
    ctx.fillStyle = GOLD.core; ctx.fillRect(pc[0] - pw, pc[1] - 1.5, pw * 2, 3);
    pans[side] = pc;
    const lab = o.labels?.[side === 'L' ? 0 : 1]; if (lab) capsLabel(ctx, lab, pc[0], pc[1] + s * .2 + 30, span(u, .7, 1) * (o.labelU ?? 1), { size: mini ? 22 : 24 });
  }
  ctx.restore();
  return pans;
}
// a weight for the pans: a gold block with a caps label (BODY, MONEY, TIME, PURPOSE …), u drops it in from above
export function weight(ctx, x, y, s, label, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const fall = 1 - expoOut(u), yy = y - fall * s * 3, w = s * .9, h = s * .5;
  ctx.save(); ctx.translate(x, yy);
  ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.lineTo(w * .38, -h); ctx.lineTo(-w * .38, -h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = GOLD.deep; ctx.fillRect(-w * .1, -h - s * .12, w * .2, s * .12);
  ctx.restore();
  if (label) E.glowText(ctx, label, x, yy - h * .3, { size: o.size ?? Math.max(22, s * .2), weight: 700, col: '#3b2410', align: 'center', glow: false, spacing: .06 });
}
// BABEL: one tower, one colour, one rhythm (stacked tiers with arches, a spiral ramp); u grows it tier by tier; (x, base) = foot centre
export function tower(ctx, t, x, base, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const n = 9, col = o.col ?? mixHex(P.blue1, P.cream, .25), shade = mixHex(col, P.night1, .55);
  let topY = base;
  for (let i = 0; i < n; i++) {
    const a = expoOut(span(u, i / n, (i + 1.3) / n)); if (a <= 0) break;
    const tw = w * (1 - i * .085), th = h / n, y1 = base - i * th, y0 = y1 - th * a;
    ctx.fillStyle = lin(ctx, x - tw / 2, 0, x + tw / 2, 0, [[0, shade], [.6, col], [1, mixHex(col, P.night1, .3)]]); ctx.fillRect(x - tw / 2, y0, tw, y1 - y0);
    ctx.fillStyle = rgba(P.night0, .55); const na = Math.max(3, Math.round(tw / 40));
    for (let k = 0; k < na; k++) { const ax = x - tw / 2 + (k + .5) * tw / na; if (a > .6) { ctx.beginPath(); ctx.roundRect(ax - tw / na * .22, y1 - th * .78, tw / na * .44, th * .62, [tw / na * .22, tw / na * .22, 0, 0]); ctx.fill(); } }
    ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(x - tw / 2, y0, tw, 2);
    topY = y0;
  }
  if (o.lit) halo(ctx, x, topY, w * .4, o.lit, GOLD.halo, GOLD.core);
  return { top: [x, topY] };
}
// NEHEMIAH'S WALL: rebuilt by many hands, every stone different. (x0..x1, base) wall foot, h height; u builds stone by stone (left → right,
// bottom → top), o.hands (number of hands placing the newest stones)
const WALL = new Map();
export function wall(ctx, t, x0, x1, base, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const key = `${x0}|${x1}|${h}`, rows = 6;
  if (!WALL.has(key)) {
    const r = prng(29), st = [];
    for (let j = 0; j < rows; j++) { let x = x0 - (j % 2) * 30; while (x < x1) { const sw = 50 + r() * 70; st.push({ x, w: Math.min(sw, x1 - x), j, hue: r(), o: r() }); x += sw + 3; } }
    st.sort((a, b) => a.j - b.j || a.o - b.o); WALL.set(key, st);
  }
  const st = WALL.get(key), rh = h / rows, n = st.length;
  st.forEach((s, i) => {
    const a = expoOut(span(u, i / n * .9, i / n * .9 + .1)); if (a <= 0) return;
    const y = base - (s.j + 1) * rh + (1 - a) * -rh * 1.4, x = Math.max(x0, s.x);
    ctx.fillStyle = mixHex(mixHex(P.shade0, P.blue1, s.hue), P.cream, .12 + .1 * s.o); ctx.beginPath(); ctx.roundRect(x + 2, y + 2, s.w - 4, rh - 4, 4); ctx.fill();
    ctx.fillStyle = rgba(P.core1, .25); ctx.fillRect(x + 2, y + 2, s.w - 4, 2);
  });
  return { top: base - h };
}

// ---------------------------------------------------------------- CARRIERS (no fades: B opens inside a shape that belongs to A)
// iris: draw B clipped to shape (a function that builds the path), then the shape's rim (the object's edge) on top.
export function iris(ctx, shape, drawB, o = {}) {
  ctx.save(); ctx.beginPath(); shape(ctx); ctx.clip(); drawB(ctx); ctx.restore();
  if (o.rim !== false) { ctx.save(); ctx.beginPath(); shape(ctx); ctx.strokeStyle = o.rim ?? rgba(P.core1, .85); ctx.lineWidth = o.rimW ?? 3; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 14; ctx.stroke(); ctx.restore(); }
}
// portal: the camera pushes into a window rect of A (u 0..1, quartIO), B lives inside the window at the window's scale, so at u = 1 the
// window covers the frame and only B is left. drawA(ctx) and drawB(ctx) draw full frames in design space. win = {x, y, w, h} in A.
export function portal(ctx, u, win, drawA, drawB, o = {}) {
  const e = (o.ease ?? quartIO)(clamp(u)), cx = win.x + win.w / 2, cy = win.y + win.h / 2;
  const zEnd = Math.max(W / win.w, H / win.h) * 1.02, z = Math.pow(zEnd, e);
  // A pushed in about the window centre, the window centre travels to the frame centre
  const ox = lerp(cx, W / 2, e), oy = lerp(cy, H / 2, e);
  ctx.save(); ctx.translate(ox, oy); ctx.scale(z, z); ctx.translate(-cx, -cy);
  drawA(ctx);
  ctx.beginPath(); ctx.rect(win.x, win.y, win.w, win.h); ctx.clip();
  // B: full frame mapped into the window (cover at u = 0), its scale eases to 1/z so that at u = 1 B is exactly the identity frame
  // (no jump when the caller switches to drawing B alone). B should overscan its own background (night() and land() do).
  const kb0 = Math.max(win.w / W, win.h / H), kb = Math.exp(lerp(Math.log(kb0), Math.log(1 / zEnd), e)); ctx.translate(cx, cy); ctx.scale(kb, kb); ctx.translate(-W / 2, -H / 2);
  drawB(ctx);
  ctx.restore();
  if (o.over) { ctx.save(); ctx.translate(ox, oy); ctx.scale(z, z); ctx.translate(-cx, -cy); o.over(ctx); ctx.restore(); }
}
