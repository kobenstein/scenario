// Film 69 · "Europe Can Still Win the AI Race" (thumbnail A: EUROPE CAN STILL WIN AI) · shared kit (owned by the lead; builders import,
// never edit — wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, the 2.5D card stage
// cam3/card/aim/project/camDrift, finish) + lib/f16_kit.mjs (rise, maskLine, measure) + lib/f54_kit.mjs (bracket, source).
// World: docs/MOTION.md §2 · shots: docs/shots.md · THE NIGHT SEA OF 27 LIGHTS (the islands, the puzzle moon): lib/f69_world.mjs.
//
//   THE KIT (the spine of the film, "the plan"): a jigsaw disc of FIVE pieces = the five parts of the plan (THE MONEY · ONE SET OF RULES ·
//     THE ENERGY · ONE LAB · THE MINDS). Big in the sky as THE PUZZLE MOON (thumbnail A, ring of 12 stars; the world draws it), small top
//     right as the HUD (the "Bauplan in der Bildecke"). It changes by itself on the KIT phrases: a piece being checked pulses; a verdict
//     lands as HALFWAY (gold, the piece sits only half in: pushed out of its slot) · ON PAPER (cream paper, dashed edge, no light) ·
//     OPEN (the slot stays empty and pulses; the piece lies next to the disc or in YOUR hand). Never red, never a cross, never a stamp.
//     kitDisc() draws it anywhere · kitParts(T, t) = the state at t · kitHud(ctx, t, T, o) = the HUD (o.big = the verdict picture).
//   THE CHIP MACHINE (EUV, bus-sized, "built in Europe, then shipped away"): chipMachine(). jet() (cargo jet), barge() (flat ship).
//   crowd() (tiny people, 1 figure = 10 million), ruleBook() (a small cream booklet), lightColumn() (a column of machine light = compute),
//   headTile() (a paper headline strip, no logos), letter() (an offer letter). Savings are LIGHT in windows (the world, st.savings).
//
// Colour code: GOLD = what holds / the ONE hero light (the moon, a seated piece, a verdict) · CREAM = what is open or on paper (paper,
// questions, quotes) · COOL = machines / compute / screens / foreign AI · LAMP = people's windows (warm, never gold) · the yellow coat =
// only you. Away = screen right (machines shipped, people hired, founders flying); coming back = right → left.
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

export const PRINT69 = { grain: 14, floor: 4, vig: .5 };
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
// EUROPE CAN / STILL WIN AI like thumbnail A: heavy condensed caps, cream with a warm glow, left; the small line under it. u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 72, y = o.y ?? 470, lines = o.lines ?? ['EUROPE CAN', 'STILL WIN AI'], cond = o.cond ?? .7;
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
// Lower third ABOVE the plate (≥ 22 px): NAME (serif) · ROLE · YEAR … ORIGINAL FOOTAGE (+ credit) at the right. Roles: text-v2.md.
// <ROOT>clips-geprueft.json (when it lands) overrides name/role/year (fields name, rolle|role, jahr|year, credit, crop, cropDy).
// Frames: <F69CLIPS or /tmp/claude-0/f69/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, frame 1 = the slot start; tools/f69_clips.py clips).
// Until the frames exist a marked placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIPS = {   // text-v2.md §Clips (23.11.): Bauchbinde wording
  C1: { name: 'Mario Draghi', role: 'Former President, European Central Bank', year: '2025' },
  C2: { name: 'Arthur Mensch', role: 'CEO, Mistral AI', year: '2026' },
  C3: { name: 'Ursula von der Leyen', role: 'President, European Commission', year: '2026', credit: '© European Union, 2026' },   // CC BY
  C4: { name: 'Peter Koerte', role: 'Chief Technology Officer, Siemens', year: '2026' },   // title at the time of recording
  C1b: { name: 'Mario Draghi', role: 'Former President, European Central Bank', year: '2026' },
};
// C1b (KU Leuven): a sign-language interpreter bottom right + a logo top right → centre crop (crop .76 of the frame, centred).
CLIPS.C1b.crop = .76;
try {   // clips-geprueft.json (24.11.): { clips: [{ id, file, speaker, lower_third: 'NAME · Role · Year · ORIGINAL FOOTAGE', channel, duration_s, … }] }
  const j = JSON.parse(fs.readFileSync(ROOT + 'clips-geprueft.json', 'utf8'));
  for (const c of j.clips || []) { const k = CLIPS[c.id]; if (!k) continue;
    if (c.speaker) k.name = c.speaker;
    if (c.lower_third) { const q = c.lower_third.split('·').map((x) => x.trim()); if (q.length >= 3) { k.role = q[1]; k.year = q[2]; } }
    const cc = /©[^)]*/.exec(c.channel || ''); if (cc) k.credit = cc[0].trim();
    for (const [a, b] of [['rolle', 'role'], ['role', 'role'], ['jahr', 'year'], ['year', 'year'], ['credit', 'credit'], ['crop', 'crop'], ['cropDy', 'cropDy']]) if (c[a] != null) k[b] = c[a]; }
} catch { /* not there yet */ }
const CLIPDIR = (process.env.F69CLIPS || '/tmp/claude-0/f69/clips/').replace(/\/?$/, '/');
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
    const cr = info.crop ?? 1, sw = fr.width * cr, sh = fr.height * cr, sx = (fr.width - sw) / 2, sy = Math.min(fr.height - sh, (fr.height - sh) / 2 + (info.cropDy ?? 0) * fr.height);
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

// ======================================================================================================================== THE KIT (the puzzle disc)
// The plan's five parts as one jigsaw disc. Pieces clockwise from the lower left: 0 THE MONEY · 1 ONE SET OF RULES · 2 THE ENERGY (top) ·
// 3 ONE LAB · 4 THE MINDS (lower right: the gap of thumbnail A). Each piece changes on its phrases (never animate it by hand):
//   at  = the part's chapter starts (the piece pulses, PART n OF 5 + its name under the HUD)
//   v   = the spoken verdict (the piece lands: half → gold, pushed half out · paper → cream paper, dashed · open → the slot stays empty)
export const KIT = {
  on: 'For AI, five parts', test: 'One test for all five', sum: "So that's where the plan stands", started: 'None is finished',
  parts: [
    { id: 'money', name: 'THE MONEY', word: 'Money', at: 'Money first', v: 'the money: halfway', kind: 'half', verdict: 'HALFWAY' },
    { id: 'rules', name: 'ONE SET OF RULES', word: 'One set of rules', at: 'Because a company that wants', v: 'So that one set of rules', kind: 'paper', verdict: 'ON PAPER' },
    { id: 'energy', name: 'THE ENERGY', word: 'Energy', at: 'None of it runs', v: 'So this part is halfway', kind: 'half', verdict: 'HALFWAY' },
    { id: 'lab', name: 'ONE LAB', word: 'A lab', at: 'Europe does need enough', v: 'The lab, too, is still', kind: 'paper', verdict: 'ON PAPER' },
    { id: 'minds', name: 'THE MINDS', word: 'And minds', at: 'And a lab is an empty', v: 'So the fifth part stays open', kind: 'open', verdict: 'OPEN' },
  ],
  clips: ['C1', 'C2', 'C3', 'C4', 'C1b'],
};
const KT = new WeakMap();
export function kitTimes(T) {
  if (KT.has(T)) return KT.get(T);
  const on = T.G(KIT.on), word = [], at = [], v = []; let prev = on;
  for (const p of KIT.parts) word.push(T.G(p.word, 0, on));
  for (const p of KIT.parts) { const a = T.G(p.at, 0, prev); at.push(a); v.push(T.G(p.v, 0, a)); prev = a; }
  const r = { on, test: T.G(KIT.test, 0, on), word, at, v, sum: T.G(KIT.sum), clips: KIT.clips.map((id) => T.clip(id)).filter(Boolean) };
  KT.set(T, r); return r;
}
// the state at t: { on (HUD visibility, hidden in clip windows), cur (part being checked or -1), parts: [{ kind, u (verdict 0..1), lit }], name }
export function kitParts(T, t) {
  const b = kitTimes(T); let cur = -1; for (let i = 0; i < 5; i++) if (t >= b.at[i] - .3 && t < b.v[i] + 2.5) cur = i;
  const clipHide = b.clips.reduce((m, c) => Math.max(m, span(t, c.start - 1.2, c.start - .4) * (1 - span(t, c.end + .2, c.end + 1))), 0);
  const parts = KIT.parts.map((p, i) => {
    const u = span(t, b.v[i] - .05, b.v[i] + 1.2), named = span(t, b.word[i] - .1, b.word[i] + .5) * (1 - span(t, b.word[i] + .9, b.word[i] + 1.6));
    const lit = Math.max(i === cur && u <= 0 ? 1 : 0, named);
    return { kind: u > 0 ? p.kind : 'blank', u, lit };
  });
  return { b, cur, parts, on: smooth(span(t, b.on - .2, b.on + 1.2)) * (1 - clipHide), slide: expoOut(span(t, b.on - .2, b.on + 1.4)),
    name: cur >= 0 ? span(t, b.at[cur] - .3, b.at[cur] + .6) * (1 - span(t, b.v[cur] + 3, b.v[cur] + 3.8)) : 0,
    test: span(t, b.test, b.test + .8) * (1 - span(t, b.at[0] + 1.5, b.at[0] + 2.5)) };
}
// the VISION (frame 0 = thumbnail A): four pieces gold and seated, the minds slot open
export const VISION = [0, 1, 2, 3].map(() => ({ kind: 'gold', u: 1, lit: 0 })).concat([{ kind: 'open', u: 1, lit: 0 }]);
export const BLANK = [0, 1, 2, 3, 4].map(() => ({ kind: 'blank', u: 0, lit: 0 }));
// blend two part lists (u 0..1): used for the hook (vision → blank → the plan)
export function mixParts(A, B, u) { return u <= 0 ? A : u >= 1 ? B : A.map((a, i) => (u < .5 ? { ...a, fade: 1 - u * 2 } : { ...B[i], fade: (u - .5) * 2 })); }

// geometry: unit pieces (radius 1), centre angle c_i, edges with jigsaw knobs (catmull through a knob profile)
const DEG = Math.PI / 180;
export const PIECE_ANG = [0, 1, 2, 3, 4].map((i) => (54 - (4 - i) * 72) * DEG);   // centre angle of piece i (screen: y down)
const KNOB = [[0, 0], [.4, 0], [.47, .045], [.41, .13], [.53, .2], [.66, .13], [.6, .045], [.67, 0], [1, 0]];
const EDGE_S = [1, -1, 1, -1, 1];                     // edge k = the start edge of piece k (between k-1 and k): knob side
function edgePts(a, s) {
  const ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca;
  return E.catmull(KNOB.map(([al, pe]) => [al * ca + pe * s * nx, al * sa + pe * s * ny]), 6);
}
const PIECES = [0, 1, 2, 3, 4].map((i) => {
  const a0 = PIECE_ANG[i] - 36 * DEG, a1 = PIECE_ANG[i] + 36 * DEG, e0 = edgePts(a0, EDGE_S[i]), e1 = edgePts(a1, EDGE_S[(i + 1) % 5]);
  const arc = []; for (let k = 1; k < 24; k++) { const a = lerp(a0, a1, k / 24); arc.push([Math.cos(a), Math.sin(a)]); }
  return [...e0, ...arc, ...e1.slice().reverse()];
});
function piecePath(i, cx, cy, r, dx = 0, dy = 0, k = 1) {
  const p = new Path2D(), pts = PIECES[i], c = [Math.cos(PIECE_ANG[i]) * .5, Math.sin(PIECE_ANG[i]) * .5];   // shrink toward the piece centre: the seam
  pts.forEach(([x, y], j) => { const X = cx + dx + r * (c[0] + (x - c[0]) * k), Y = cy + dy + r * (c[1] + (y - c[1]) * k); j ? p.lineTo(X, Y) : p.moveTo(X, Y); });
  p.closePath(); return p;
}
export function pieceCentre(i, cx, cy, r) { return [cx + Math.cos(PIECE_ANG[i]) * r * .56, cy + Math.sin(PIECE_ANG[i]) * r * .56]; }
// one loose piece anywhere (e.g. THE MINDS in your hands): x, y = its centre, r = the disc radius it belongs to, rot (rad)
export function loosePiece(ctx, t, i, x, y, r, o = {}) {
  const c = [Math.cos(PIECE_ANG[i]) * .56, Math.sin(PIECE_ANG[i]) * .56];
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.translate(-c[0] * r, -c[1] * r);
  drawPiece(ctx, t, i, 0, 0, r, { kind: o.kind ?? 'gold', u: 1, lit: o.lit ?? 0 }, { glow: o.glow ?? 1, a: o.a ?? 1, loose: true });
  ctx.restore();
}
function drawPiece(ctx, t, i, cx, cy, r, st, o = {}) {
  const pulse = .5 + .5 * Math.sin(t * 2.4 + i), a = (o.a ?? 1) * (st.fade ?? 1); if (a <= 0) return;
  const kind = st.kind, u = clamp(st.u ?? 1), ca = Math.cos(PIECE_ANG[i]), sa = Math.sin(PIECE_ANG[i]);
  let out = 0; if (kind === 'half') out = .2 * expoOut(u); if (st.lit > 0 && kind === 'blank') out = .03 * st.lit;
  const dx = ca * r * out, dy = sa * r * out, path = piecePath(i, cx, cy, r, dx, dy, .985);
  ctx.save(); ctx.globalAlpha *= a;
  if (kind === 'open' && !o.loose) {   // the empty slot: dark, a cream dashed edge that breathes
    ctx.fillStyle = rgba(P.night0, .55 * u); ctx.fill(path);
    ctx.setLineDash([r * .05, r * .04]); ctx.lineDashOffset = -t * r * .02; ctx.strokeStyle = rgba(CREAM, (.45 + .4 * pulse) * u); ctx.lineWidth = Math.max(1.5, r * .012); ctx.stroke(path); ctx.setLineDash([]);
    ctx.restore(); return;
  }
  if (kind === 'gold' || kind === 'half') {
    const g = kind === 'half' ? sineIO(u) : 1, hx = cx + dx, hy = cy + dy;
    ctx.fillStyle = rad(ctx, hx - r * .15, hy - r * .2, r * 1.15, [[0, GOLD.core], [.35, GOLD.hot], [.75, GOLD.body], [1, GOLD.mid]]);
    if (g < 1) { ctx.fillStyle = rgba(P.night1, .7); ctx.fill(path); ctx.save(); ctx.globalAlpha *= g; ctx.fillStyle = rad(ctx, hx - r * .15, hy - r * .2, r * 1.15, [[0, GOLD.core], [.35, GOLD.hot], [.75, GOLD.body], [1, GOLD.mid]]); ctx.fill(path); ctx.restore(); }
    else ctx.fill(path);
    ctx.strokeStyle = rgba(GOLD.shade, .55 * g); ctx.lineWidth = Math.max(1, r * .008); ctx.stroke(path);
  } else if (kind === 'paper') {
    const g = sineIO(u);
    ctx.fillStyle = rgba(P.night1, .7 * (1 - g)); ctx.fill(path);
    ctx.save(); ctx.globalAlpha *= g; ctx.fillStyle = lin(ctx, cx - r, cy - r, cx + r, cy + r, [[0, PAPER.lit], [1, PAPER.shade]]); ctx.fill(path);
    ctx.clip(path); ctx.strokeStyle = rgba(PAPER.faint, .35); ctx.lineWidth = Math.max(1, r * .006);   // faint ruled lines: a plan on paper
    for (let k = -10; k <= 10; k++) { const yy = cy + k * r * .1; ctx.beginPath(); ctx.moveTo(cx - r, yy); ctx.lineTo(cx + r, yy); ctx.stroke(); }
    ctx.restore();
    ctx.setLineDash([r * .04, r * .03]); ctx.strokeStyle = rgba(g > .5 ? PAPER.edge : CREAM, .9); ctx.lineWidth = Math.max(1.2, r * .012); ctx.stroke(path); ctx.setLineDash([]);
  } else {   // blank: the blueprint (night fill, a thin cream edge); lit = being checked (brighter edge, pulse)
    ctx.fillStyle = rgba(P.night1, .62); ctx.fill(path);
    ctx.strokeStyle = rgba(CREAM, .42 + .5 * (st.lit ?? 0) * (.6 + .4 * pulse)); ctx.lineWidth = Math.max(1.2, r * (.008 + .006 * (st.lit ?? 0))); ctx.stroke(path);
  }
  ctx.restore();
}
// the whole disc: parts = kitParts(T, t).parts | VISION | BLANK | mixParts(…); o: { a, glow 0..1 (the moon light), stars 0..1 (the ring of
// 12 stars), loose: { x, y, rot } (where THE MINDS piece lies while open; false = hidden, e.g. you hold it), write 0..1 (the outlines draw
// on: the plan appears), seams 0..1 }
export function kitDisc(ctx, t, cx, cy, r, parts, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const gold = parts.reduce((s, p) => s + ((p.kind === 'gold' ? 1 : p.kind === 'half' ? .6 * clamp(p.u) : 0) * (p.fade ?? 1)), 0) / 4;
  const gl = (o.glow ?? 1) * a;
  if (gl > 0) {   // the moon light: a wide blue bloom, a warm halo that grows with the gold in the disc
    halo(ctx, cx, cy, r * 2.6, .22 * gl, P.blue0, P.blue1);
    halo(ctx, cx, cy, r * (1.5 + .5 * gold), (.12 + .4 * gold) * gl, GOLD.halo, GOLD.core);
  }
  if ((o.stars ?? 0) > 0) starRing(ctx, t, cx, cy, r * 1.34, r * .06, o.stars * a);
  const wr = o.write ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .35 * (1 - gold)); ctx.beginPath(); ctx.arc(cx, cy, r * 1.01, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 5; i++) {
    const st = parts[i]; if (!st) continue;
    if (wr < 1) { const w = clamp(wr * 5 - i * .8); if (w <= 0) continue; ctx.save(); ctx.globalAlpha *= w; drawPiece(ctx, t, i, cx, cy, r, { ...st, lit: Math.max(st.lit ?? 0, 1 - w) }, o); ctx.restore(); }
    else drawPiece(ctx, t, i, cx, cy, r, st, o);
  }
  ctx.restore();
  const m = parts[4];
  if (m && m.kind === 'open' && o.loose !== false) {   // THE MINDS piece lies next to the disc (outlined in cream: not won yet)
    const L = o.loose || { x: cx + r * 1.25, y: cy + r * 1.05, rot: .35 };
    loosePiece(ctx, t, 4, L.x, L.y, r, { kind: 'blank', lit: .6, rot: L.rot, a: a * clamp(m.u) * (m.fade ?? 1), glow: 0 });
  }
}
function starRing(ctx, t, cx, cy, R, s, a) {
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < 12; k++) {
    const q = -Math.PI / 2 + k * Math.PI / 6, x = cx + Math.cos(q) * R, y = cy + Math.sin(q) * R, tw = .82 + .18 * Math.sin(t * 1.3 + k * 2.1);
    halo(ctx, x, y, s * 3, .25 * tw, GOLD.halo, GOLD.core);
    ctx.fillStyle = mixHex(GOLD.hot, CREAM, .35); ctx.beginPath();
    for (let j = 0; j < 10; j++) { const rr = j % 2 ? s * .42 : s, qq = -Math.PI / 2 + j * Math.PI / 5; j ? ctx.lineTo(x + Math.cos(qq) * rr, y + Math.sin(qq) * rr) : ctx.moveTo(x + Math.cos(qq) * rr, y + Math.sin(qq) * rr); }
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
// THE HUD (screen space). Small, top right: the disc (r 46) + under it PART n OF 5 · its name while it is checked; the test question
// (REALLY THERE, OR ONLY ON PAPER?) for a while after 'One test for all five'; the verdict word when a piece lands.
// o: { a, big 0..1 (moves to the centre, r 230, every piece labelled with name + verdict: the verdict picture at 'So that's where the
//   plan stands'), dx, dy, loose (see kitDisc), parts (override) }
export const HUD = { x: W - 112, y: 112, r: 46 };
export function kitHud(ctx, t, T, o = {}) {
  const S = kitParts(T, t), a = (o.a ?? 1) * S.on; if (a <= 0) return;
  const big = sineIO(clamp(o.big ?? 0)), parts = o.parts ?? S.parts;
  const r = lerp(HUD.r, o.bigR ?? 230, big), cx = lerp(HUD.x + (1 - S.slide) * 300, o.bigX ?? W / 2, big) + (o.dx ?? 0), cy = lerp(HUD.y, o.bigY ?? 440, big) + (o.dy ?? 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  kitDisc(ctx, t, cx, cy, r, parts, { glow: lerp(.35, 1, big), stars: 0, loose: o.loose ?? { x: cx + r * 1.3, y: cy + r * 1.1, rot: .35 } });
  if (big > .02) {   // every piece labelled: name + verdict (the verdict picture)
    ctx.save(); ctx.globalAlpha *= big;
    KIT.parts.forEach((p, i) => {
      const q = PIECE_ANG[i], lx = cx + Math.cos(q) * r * 1.42, ly = cy + Math.sin(q) * r * 1.42, al = Math.abs(Math.cos(q)) < .3 ? 'center' : Math.cos(q) > 0 ? 'left' : 'right';
      const st = parts[i], vd = st.kind === 'blank' ? '' : p.verdict;
      goldText(ctx, [[p.name, 0]], lx, ly, 24, 1, { serif: false, weight: 700, spacing: .06, align: al, col: CREAM });
      if (vd) goldText(ctx, [[vd, st.kind === 'half' ? 1 : 0]], lx, ly + 32, 22, rise(clamp(st.u * 1.5)), { serif: false, weight: 600, spacing: .1, align: al, col: st.kind === 'half' ? GOLD.text : CREAM2 });
    });
    ctx.restore();
  }
  if (big < .5) {   // small HUD texts, right aligned under the disc (≥ 22 px)
    const xr = HUD.x + HUD.r + 10 + (o.dx ?? 0), y0 = HUD.y + HUD.r + 44 + (o.dy ?? 0), al = 1 - big * 2;
    ctx.save(); ctx.globalAlpha *= al;
    if (S.cur >= 0 && S.name > 0) {
      const p = KIT.parts[S.cur], st = parts[S.cur];
      goldText(ctx, [[`PART ${S.cur + 1} OF 5`, .9]], xr, y0, 22, rise(S.name), { serif: false, weight: 700, spacing: .06, align: 'right' });
      goldText(ctx, [[p.name, 0]], xr, y0 + 32, 22, rise(span(S.name, .2, 1)), { serif: false, weight: 600, spacing: .05, align: 'right', col: CREAM });
      if (st.kind !== 'blank') goldText(ctx, [[p.verdict, st.kind === 'half' ? 1 : 0]], xr, y0 + 64, 22, rise(clamp(st.u * 1.4)), { serif: false, weight: 700, spacing: .1, align: 'right', col: st.kind === 'half' ? GOLD.text : CREAM });
    } else if (S.test > 0) {
      goldText(ctx, [['REALLY THERE,', .3]], xr, y0, 22, rise(S.test), { serif: false, weight: 700, spacing: .06, align: 'right' });
      goldText(ctx, [['OR ONLY ON PAPER?', 0]], xr, y0 + 32, 22, rise(span(S.test, .2, 1)), { serif: false, weight: 700, spacing: .06, align: 'right', col: CREAM });
    }
    ctx.restore();
  }
  ctx.restore();
}

// ======================================================================================================================== OBJECTS
// THE CHIP MACHINE (EUV lithography; "the size of a bus"): side view, x, y = the middle of its base, L = its length in px. Flat shapes:
// a long pale body with panel seams, a raised tower at the left (the light source), a cool beam that folds down into the wafer stage
// (o.beam 0..1), small round feet or wheels (o.wheels for shipping), o.glow 0..1 (cool light in its windows), o.crate 0..1 (wrapped).
export function chipMachine(ctx, t, x, y, L, o = {}) {
  const h = L * .3, x0 = x - L / 2, a = o.a ?? 1; if (a <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x, y + 2, L * .55, L * .025, 0, 0, Math.PI * 2); ctx.fill();
  const body = new Path2D();   // stepped silhouette: tower left, long body, a lower module at the right
  body.moveTo(x0, y); body.lineTo(x0, y - h * 1.55); body.quadraticCurveTo(x0, y - h * 1.65, x0 + L * .03, y - h * 1.65); body.lineTo(x0 + L * .2, y - h * 1.65);
  body.lineTo(x0 + L * .22, y - h * 1.05); body.lineTo(x0 + L * .8, y - h * 1.05); body.quadraticCurveTo(x0 + L * .82, y - h * 1.05, x0 + L * .82, y - h * .95);
  body.lineTo(x0 + L * .82, y - h * .78); body.lineTo(x0 + L, y - h * .78); body.lineTo(x0 + L, y); body.closePath();
  const lit = mixHex('#cfd6e6', P.cream, .3), shade = mixHex('#7f8aa6', P.night1, .3);
  ctx.fillStyle = lin(ctx, x0, y - h * 1.6, x0, y, [[0, lit], [.6, mixHex(lit, shade, .45)], [1, shade]]); ctx.fill(body);
  ctx.save(); ctx.clip(body);
  ctx.strokeStyle = rgba(P.night1, .35); ctx.lineWidth = Math.max(1, L * .003);
  for (let k = 1; k < 9; k++) { const xx = x0 + L * (.22 + k * .065); ctx.beginPath(); ctx.moveTo(xx, y - h * 1.05); ctx.lineTo(xx, y); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(x0, y - h * .55); ctx.lineTo(x0 + L, y - h * .55); ctx.stroke();
  ctx.fillStyle = rgba(P.night0, .22); ctx.fillRect(x0, y - h * .18, L, h * .18);
  const g = o.glow ?? 1, wy = y - h * .86;   // small cool windows along the body
  for (let k = 0; k < 7; k++) { ctx.fillStyle = rgba(COOL.body, (.25 + .55 * g) * (.8 + .2 * Math.sin(t * 1.3 + k))); ctx.fillRect(x0 + L * (.27 + k * .075), wy, L * .035, h * .16); }
  ctx.restore();
  const bu = clamp(o.beam ?? 0);   // the light path: from the tower over to the lens column, down to the stage
  if (bu > 0) {
    const p = [[x0 + L * .1, y - h * 1.3], [x0 + L * .3, y - h * 1.3], [x0 + L * .5, y - h * .7], [x0 + L * .5, y - h * .3]];
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(COOL.body, .55 * bu); ctx.lineWidth = Math.max(2, L * .008); ctx.lineCap = 'round';
    ctx.beginPath(); p.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke(); ctx.restore();
    halo(ctx, x0 + L * .5, y - h * .3, L * .08, .6 * bu, COOL.halo, COOL.core);
  }
  if (o.wheels) { ctx.fillStyle = P.night0; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(x0 + L * (.08 + k * .17), y, L * .018, 0, Math.PI * 2); ctx.fill(); } }
  const cr = clamp(o.crate ?? 0);   // wrapped for shipping: a cream sheet slides over it from the right
  if (cr > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x0 + L * (1 - cr) - 4, y - h * 1.7, L * cr + 8, h * 1.7); ctx.clip(); ctx.fillStyle = mixHex(PAPER.shade, P.night1, .35); ctx.fill(body);
    ctx.strokeStyle = rgba(PAPER.edge, .6); ctx.lineWidth = 2; for (let k = 0; k < 6; k++) { const xx = x0 + L * (k + .5) / 6; ctx.beginPath(); ctx.moveTo(xx, y - h * 1.7); ctx.lineTo(xx, y); ctx.stroke(); } ctx.restore(); }
  ctx.restore();
  return { x0, x1: x0 + L, top: y - h * 1.65, h };
}
// a flat barge (the machine sails away on it): x, y = the waterline middle, L length
export function barge(ctx, t, x, y, L, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const bob = Math.sin(t * 1.1) * L * .004, p = new Path2D();
  p.moveTo(x - L / 2, y - L * .06 + bob); p.lineTo(x + L / 2, y - L * .06 + bob); p.lineTo(x + L * .45, y + L * .02 + bob); p.lineTo(x - L * .47, y + L * .02 + bob); p.closePath();
  ctx.fillStyle = mixHex(P.night1, P.blue1, .25); ctx.fill(p); ctx.fillStyle = rgba(LAMP.body, .5); ctx.fillRect(x + L * .38, y - L * .12 + bob, L * .05, L * .06);
  ctx.restore(); return y - L * .06 + bob;
}
// a cargo jet in flat silhouette (side view, nose to the right), x, y = its centre, L = length, o.lights
export function jet(ctx, t, x, y, L, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.rot ?? -.04); const s = L;
  ctx.fillStyle = o.col ?? mixHex(P.blue1, P.cream, .25);
  ctx.beginPath(); ctx.moveTo(-.5 * s, -.02 * s); ctx.quadraticCurveTo(-.5 * s, -.06 * s, -.42 * s, -.06 * s); ctx.lineTo(.36 * s, -.06 * s); ctx.quadraticCurveTo(.5 * s, -.05 * s, .5 * s, 0);
  ctx.quadraticCurveTo(.46 * s, .05 * s, .36 * s, .05 * s); ctx.lineTo(-.4 * s, .05 * s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-.44 * s, -.05 * s); ctx.lineTo(-.5 * s, -.2 * s); ctx.lineTo(-.4 * s, -.2 * s); ctx.lineTo(-.32 * s, -.05 * s); ctx.fill();   // tail
  ctx.fillStyle = mixHex(P.blue1, P.night1, .3); ctx.beginPath(); ctx.moveTo(-.02 * s, .01 * s); ctx.lineTo(-.16 * s, .2 * s); ctx.lineTo(-.06 * s, .2 * s); ctx.lineTo(.12 * s, .01 * s); ctx.fill();   // wing
  if (o.lights !== false) { halo(ctx, .5 * s, 0, s * .05, .5 + .3 * Math.sin(t * 6), LAMP.body, LAMP.core); halo(ctx, -.48 * s, -.2 * s, s * .04, .5 * (Math.sin(t * 4) > .6 ? 1 : .2), COOL.halo, COOL.core); }
  ctx.restore();
}
// tiny people standing in rows (1 figure = 10 million in the hook): n figures, cols per row, h = figure height, o.col (yellow = you only)
export function crowd(ctx, t, x, y, n, cols, h, o = {}) {
  const r = prng(o.seed ?? 3), gap = h * .42, shown = Math.floor(clamp(o.u ?? 1) * n);
  for (let k = 0; k < shown; k++) {
    const c = k % cols, row = Math.floor(k / cols), jx = (r() - .5) * gap * .3, hh = h * (.9 + r() * .2);
    E.person(ctx, x + c * gap + jx + (row % 2) * gap * .5, y + row * h * .34, hh, { dir: r() > .5 ? 1 : -1, light: .6, look: .2 * Math.sin(t * .7 + k), armR: [.15, .1], armL: [-.15, -.1] });
  }
}
// a rule booklet (small, cream; "twenty-seven sets of rules"), x, y = its bottom centre, s = width
export function ruleBook(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = expoOut(u), h = s * .7;
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y - (1 - k) * s * .6); ctx.rotate((o.rot ?? 0) + Math.sin(t * .8 + (o.seed ?? 0)) * .02);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-s / 2 + 3, -h + 4, s, h);
  ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.moveTo(-s / 2, -h * .96); ctx.quadraticCurveTo(-s / 4, -h * 1.02, 0, -h * .94); ctx.lineTo(0, 0); ctx.quadraticCurveTo(-s / 4, -h * .06, -s / 2, -h * .02); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAPER.body; ctx.beginPath(); ctx.moveTo(s / 2, -h * .96); ctx.quadraticCurveTo(s / 4, -h * 1.02, 0, -h * .94); ctx.lineTo(0, 0); ctx.quadraticCurveTo(s / 4, -h * .06, s / 2, -h * .02); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.faint, .7); ctx.lineWidth = Math.max(.8, s * .02);
  for (let j = 1; j < 6; j++) { const yy = -h * (.92 - j * .14); ctx.beginPath(); ctx.moveTo(-s * .42, yy); ctx.lineTo(-s * .08, yy - s * .01); ctx.moveTo(s * .08, yy - s * .01); ctx.lineTo(s * .42, yy); ctx.stroke(); }
  ctx.restore();
}
// a column of machine light (compute) standing on the horizon: x, y = its foot, h, w; o.col COOL (default) | CREAM; o.u rises
export function lightColumn(ctx, t, x, y, h, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const hh = h * expoOut(u), col = o.col ?? COOL.body, core = o.core ?? COOL.core, a = (o.a ?? 1) * (.85 + .15 * Math.sin(t * 1.7 + (o.seed ?? 0)));
  ctx.save(); ctx.globalAlpha *= a; ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, y - hh, 0, y, [[0, rgba(col, 0)], [.5, rgba(col, .28)], [1, rgba(core, .75)]]); ctx.fillRect(x - w / 2, y - hh, w, hh);
  ctx.fillStyle = lin(ctx, 0, y - hh, 0, y, [[0, rgba(core, 0)], [1, rgba(core, .8)]]); ctx.fillRect(x - w * .12, y - hh, w * .24, hh);
  ctx.restore(); halo(ctx, x, y, w * 1.6, .35 * a, o.halo ?? COOL.halo, core);
}
// a headline strip of paper (no logos, no outlet names): text in serif, x, y = its centre, w; o.u slides in, o.rot, o.fall 0..1 (tips away)
export function headTile(ctx, t, x, y, w, txt, o = {}) {
  const u = clamp(o.u ?? 1), f = clamp(o.fall ?? 0); if (u <= 0 || f >= 1) return;
  const h = w * .2, k = expoOut(u), fe = expoIn(f);
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3) * (1 - fe);
  ctx.translate(x + (1 - k) * w * .5 + fe * w * .2, y + fe * h * 3); ctx.rotate((o.rot ?? 0) + (1 - k) * .1 + fe * .5);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
  ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = rgba(PAPER.faint, .5); for (let j = 0; j < 3; j++) ctx.fillRect(-w * .42, h * (.12 + j * .1), w * (.84 - j * .2), Math.max(1, h * .035));   // body lines (unreadable)
  E.glowText(ctx, txt, -w * .42, -h * .02, { size: h * .36, serif: true, col: PAPER.ink, glow: false });
  ctx.restore();
}
// an offer letter (the researcher's two offers): x, y = its centre, w; o.head (e.g. 'EUROPE' / 'AMERICA'), o.u, o.rot
export function letter(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const h = w * 1.3, k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - k) * 30); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-w / 2 + 5, -h / 2 + 7, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = rgba(PAPER.faint, .45); for (let j = 0; j < 7; j++) ctx.fillRect(-w * .38, -h * .12 + j * h * .08, w * (j === 6 ? .4 : .76), Math.max(1, h * .012));
  if (o.head) E.glowText(ctx, o.head, -w * .38, -h * .26, { size: Math.max(22, w * .11), weight: 700, col: PAPER.ink, glow: false, spacing: .06 });
  ctx.restore();
}

// ======================================================================================================================== SOURCES / ON-SCREEN STRINGS
// From text-v2.md OVERLAY lines (23.11.), split into a STATEMENT (≤ 6 words + one number, big) and a SOURCE line (F.source, 22 px, y 880).
// "AI" on screen (not "A.I."). If the fact-checked text-v3 / vo-v3 changes one, text-v3 WINS (say so in your report).
export const SOURCES = {
  title: ['EUROPE CAN', 'STILL WIN AI'],
  tiles: ['Too slow', 'Too small', 'Too many rules'],
  scenes: ['YOUR CONTRACT', 'YOUR JOB INTERVIEW', 'YOUR LOAN'],
  question: 'HOW COULD EUROPE STILL WIN?',
  computeTitle: 'THE WORLD’S AI COMPUTING POWER', five: 'ABOUT 5%', fiveTag: 'IN THE EU',
  fiveSrc: 'EU SHARE OF INSTALLED AI COMPUTE, 2026 · BRUEGEL POLICY BRIEF 18/2026 · EPOCH AI: 5.1%',
  machines: 'THE ONLY MACHINES FOR THE MOST ADVANCED CHIPS', shipped: 'SHIPPED AWAY', hired: 'HIRED AWAY',
  people: ['EU · 452 MILLION', 'US · 342 MILLION'], peopleSrc: 'EUROSTAT, JAN 2026 · US CENSUS BUREAU, JUL 2025 · ONE FIGURE = 10 MILLION',
  pieces: '27', piecesWord: 'PIECES', rules27: '27 SETS OF RULES',
  dates: ['EU BUDGET SUMMIT · 26–27 NOV 2026', 'AI GIGAFACTORY BIDS DUE · 3 DEC 2026'],
  asml: 'ASML · VELDHOVEN, NETHERLANDS', euv: 'EUV LITHOGRAPHY', euvSrc: '~40 CONTAINERS, 20 TRUCKS, 3 CARGO JETS PER MACHINE · ASML (STANDARD MODEL)',
  zeroEurope: '0% SOLD TO EUROPE', zeroSrc: 'SHARE OF ASML SALES TO EUROPE, H1 2026: 0% (2024: 5%) · DATACENTERDYNAMICS, SEPT 2026',
  draghi: 'THE DRAGHI REPORT · SEPT 2024', draghiSum: '€750–800 BILLION A YEAR', draghiSumSrc: 'EXTRA INVESTMENT NEEDED PER YEAR · THE DRAGHI REPORT, SEPTEMBER 2024',
  oneInSix: '1 IN 6 PROPOSALS DONE', oneInSixSrc: '60 OF 383 MEASURES FULLY IMPLEMENTED = 15.7% · EPIC INDEX, JULY 2026 · AT LEAST STARTED: 41%',
  test: ['REALLY THERE,', 'OR ONLY ON PAPER?'],
  savings: '€10 TRILLION IN BANK DEPOSITS', savingsSrc: '≈ 70% OF EU HOUSEHOLD SAVINGS SIT IN DEPOSITS · EUROPEAN COMMISSION, 2025',
  aiInvest: ['US $285.9 BILLION', 'EUROPE $20.9 BILLION'], aiInvestSrc: 'PRIVATE AI INVESTMENT 2025 (EUROPE INCL. UK) · STANFORD AI INDEX 2026',
  siu: 'MOSTLY NOT LAW YET', siuSrc: 'SAVINGS AND INVESTMENTS UNION · COUNCIL POSITION 9 OCT 2026 · PARLIAMENT: NO POSITION YET',
  critics: 'CRITICS: MORE RISK FOR SAVERS', criticsSrc: 'ECB 2026: EFFECT LIKELY “MODEST” · CEPS, FEB 2026: “A BAD START” · FINANCE WATCH 2026',
  startups: '+62% FOR EUROPEAN START-UPS', startupsSrc: 'EUROPEAN START-UPS 2026: ≈ $81 BILLION RAISED · ATOMICO, NOV 2026',
  fund: 'SCALEUP EUROPE FUND · €5 BILLION TARGET', fundSrc: 'TARGET €5 BILLION · FIRST INVESTMENTS 2026',
  mistral: 'MISTRAL AI · PARIS', mistralSrc: 'VALUED AT MORE THAN €21 BILLION (SEPT 2026) · ROUND LED BY SAMSUNG, CO-LED BY THE FUND',
  asmlMistral: 'ASML LED MISTRAL’S ROUND · €1.3 BILLION', asmlMistralSrc: 'ASML LED MISTRAL’S PREVIOUS ROUND · SEPTEMBER 2025',
  clientState: 'A CLIENT STATE', clientWhat: ['DEFENCE', 'PUBLIC SERVICES'],
  laws27: '27 COMPANY LAWS', euInc: '“EU INC”', euIncFacts: ['ONLINE IN 48 HOURS', 'UNDER €100'], euIncSrc: 'EUROPEAN COMMISSION PROPOSAL, MARCH 2026 · A 28TH OPTION, NOT A REPLACEMENT · NO MINIMUM CAPITAL',
  heldUp: 'PARLIAMENT: NO POSITION YET', heldUpSrc: 'COUNCIL POSITION 23 OCT 2026 · PARLIAMENT: NO POSITION YET (11 NOV 2026)',
  y2028: 'NOT BEFORE 2028', y2028Src: 'FIRST “EU INC” COMPANIES: 2028 AT THE EARLIEST (COUNCIL POSITION)',
  power2x: 'MORE THAN 2× US PRICES', power2xSrc: 'ELECTRICITY FOR ENERGY-INTENSIVE INDUSTRY, 2025 · IEA, ELECTRICITY 2026',
  north: 'SWEDEN’S NORTH · HYDROPOWER', northSrc: 'SWEDEN SPLIT ITS POWER MARKET INTO PRICE ZONES; NEW INDUSTRY MOVED NORTH · BANQUE DE FRANCE, NOV 2026',
  france: 'FRANCE · 68% NUCLEAR', franceSrc: 'FRANCE 2025: 68% NUCLEAR, 95% LOW-CARBON · RTE',
  giga: 'UP TO 7 AI GIGAFACTORIES', gigaSrc: 'MORE THAN €30 BILLION, AT LEAST €20 BILLION PRIVATE · LOT 2 DEADLINE 3 DEC 2026 · LOT 1: 4 FEB 2027 · EUROHPC',
  gigaDate: 'BIDS DUE 3 DEC 2026',   // after 3.12. swap to: 'BIDS CLOSED 3 DEC 2026 · SELECTION EARLY 2027'
  budget: 'ONLY ≈ €2 BILLION AVAILABLE NOW', budgetSrc: 'OF UP TO €10 BILLION PUBLIC MONEY · THE REST DEPENDS ON THE EU BUDGET 2028–2034',
  five2031: '≈ 5.6% IN 2031', five2031Src: 'EU SHARE OF GLOBAL AI COMPUTE IF EVERYTHING PLANNED IS BUILT · BRUEGEL PB 18/2026',
  needed: 'NEEDED, NOT BIGGEST', neededSrc: 'BRUEGEL: “INDISPENSABILITY, NOT SELF-SUFFICIENCY”',
  cern: 'CERN · 1954', web: 'THE WORLD WIDE WEB', cernForAi: '“CERN FOR AI”', cernForAiSrc: 'URSULA VON DER LEYEN, PRESIDENT OF THE EUROPEAN COMMISSION · POLITICAL GUIDELINES 2024; AI ACTION SUMMIT, PARIS 2025',
  pilot: '€107 MILLION PILOT', pilotSrc: 'RAISE VIRTUAL INSTITUTE · HORIZON EUROPE · FRONTIER AI INITIATIVE: NEW CALL €44 MILLION',
  cairne: 'CLAIRE/CAIRNE: “HAS NOT (YET) MATERIALIZED”',
  b500: 'AT LEAST €500 BILLION', b500Tag: 'AN ESTIMATE, NOT A BUDGET', b500Src: 'ESTIMATE FOR CHIPS, COMPUTE AND FRONTIER AI · EUROPEAN COMMISSION, DUBLIN, 13 NOV 2026',
  offers: ['EUROPE', 'AMERICA'], pay70: 'UP TO +70%', pay70Src: 'EXPERIENCED AI ENGINEERS: WESTERN/NORTHERN EUROPE $90–150K · US $140–210K BASE · EURONEWS, JAN 2026',
  options: 'STOCK OPTIONS, TAXED ON SALE', optionsSrc: 'EU-WIDE EMPLOYEE STOCK OPTIONS · PART OF THE “EU INC” PROPOSAL · TAX RATES STAY NATIONAL',
  brain45: '−45% IN TWO YEARS', brain45Src: 'EU→US RESEARCHER MOVES 2023→2025 · ALL RESEARCHERS, NOT ONLY AI · EUROPEAN COMMISSION SRIP 2026',
  chooseEurope: '“CHOOSE EUROPE FOR SCIENCE”', chooseEuropeSrc: '€500 MILLION, 2025–27 · EUROPEAN COMMISSION',
  secondRace: 'PUTTING AI TO WORK', firstRace: 'THE MOST COMPUTERS',
  weeksHours: 'WEEKS → HOURS', weeksHoursSrc: 'OHB (SATELLITE MAKER) AT A SIEMENS PANEL, HANNOVER MESSE 2026: DESIGN CHANGES IN HOURS INSTEAD OF WEEKS',
  old100: 'OVER 100 YEARS OLD', old100Src: 'MORE THAN HALF OF FORTUNE 500 EUROPE COMPANIES · PETER KOERTE (SIEMENS) IN FORTUNE, OCT 2026',
  only20: 'ONLY 20% USE AI', only20Src: 'EU COMPANIES USING AI, 2025 · EUROSTAT',
  together: 'TOGETHER, ENOUGH DATA',
  oneVoice: 'ONE VOICE', exportSrc: 'EXPORT LICENCES FOR EUV MACHINES ARE DECIDED BY THE NETHERLANDS · CHINA IS TESTING AN EUV PROTOTYPE · REUTERS, DEC 2025',
  ways: ['MORE SHARED MONEY', 'FEWER RULES'], deciders: ['GOVERNMENTS', 'PARLIAMENT', 'INVESTORS', 'VOTERS'],
  started: ['FUND FOUNDED AUG 2026', '“EU INC” PROPOSED MAR 2026', 'GIGAFACTORY CALL JUL 2026', 'RAISE PILOT NOV 2025', 'TALENT POOL LAW APR 2026'],
  verdictNo: 'THE MOST COMPUTERS: NO', verdictYes: 'PUTTING AI TO WORK: YES',
  clock: ['EU BUDGET 2028–2034', 'SPECIAL SUMMIT 26–27 NOV 2026', 'AGREEMENT SOUGHT IN DECEMBER'],
  clockSrc: 'AI GIGAFACTORY BIDS: 3 DEC 2026 · FIRST “EU INC” COMPANIES: 2028 AT THE EARLIEST',
  harvest: ['THE MACHINES', 'THE SAVINGS', 'THE MINDS'],
  core: ['Europe was never too small for this race.', 'The only question is whether it puts itself together in time.'],
};
