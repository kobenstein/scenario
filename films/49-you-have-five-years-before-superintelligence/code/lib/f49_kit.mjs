// Film 49 · "You Have Five Years Before Superintelligence" (thumbnail B: 5 YEARS TO GET READY FOR AI) · shared kit (owned by the lead;
// builders import, never edit — wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, the
// 2.5D card stage cam3/card/aim/camAt/camDrift, finish) + lib/f16_kit.mjs (rise, maskLine, measure) + lib/f54_kit.mjs (bracket, source).
// Generic blocks (gold text, title, paper/data/quote cards, veil, camPath, clip plate) come from film 66, re-cut for this film.
// World: docs/MOTION.md · shots: docs/shots.md · the stairs, the old stair, the stages, the seam plates, END_CAM: lib/f49_world.mjs.
//
//   THE DOOR (the hero light of the whole film): the tall light door on the landing above the fifth step (thumbnail B / C). World-owned.
//   THE PLACE CARD (the through-line): the folded card at the wedding: a name you cannot read, and the answer to "what do you do?". It loses
//     its answer (c02), gets a first gold stroke (c04), lies face down at the choir (c04), stands blank at the top (c12). placeCard().
//   THE COUNTDOWN (the clock of the film, screen space top left): five small steps that light when a year begins (5 YEARS TO GO …).
//     counter(ctx, t, T) drives itself from COUNTER phrases. Hidden in the clip windows.
//   DATE CARDS: small tent cards standing on the edges of the steps (2027?, 1–2 YEARS, BY END OF 2028). tentCard().
//   EXPLAINERS (60–70 % of the film): night data cards (gold edge), paper quote cards, bars, the year rail. One statement per card,
//     ≤ 6 words + 1 number (verbatim quotes may be longer). Every number card uses the wording of SOURCES (fact check v7, binding).
//
// API (design px = screen px at the home camera; t in seconds; u = 0..1 growth):
//   colours: GOLD (the stairs, the door, hope, the hero light) · PAPER (cards, documents) · COOL (machines / AI: screens, tablets, the laptop)
//            · LAMP (people's windows, string lights) · INK · PRINT49 (finish) · bump(t, t0, d)
//   goldText(ctx, segs [[text, gold 0..1]…], x, y, size, u, o { serif, weight, align, spacing, col, glow }) · goldSpan(ctx, pts, u0, u1, o)
//   goldLabel(ctx, x, y, l1, l2, u, o { dx, dy, size }) · title(ctx, t, u, o { lines, out, x, y, maxW, cond, lead })  (thumbnail B title)
//   caption(ctx, t, x, y, lines, u, o { size, align, gold, out })   screen-space words in the sky (IT FALLS TO YOU …): Inter Black condensed
//   paperCard · dataCard(ctx, t, x, y, w, o { kind KNOWN | FORECAST | ESTIMATE | SURVEY, title, big, small, src, u }) · quoteCard(ctx, t, T, o)
//   tentCard(ctx, t, x, y, s, o { big, small [lines], u, glow, a, lean })   a folded card standing on a step edge; (x, y) = its foot (centre)
//   placeCard(ctx, t, x, y, s, o { u, answer 0..1, gold 0..1, write 0..1, face 'up' | 'down', rot, glow })   THE PLACE CARD
//   bars(ctx, t, x, y, o { items [{ label, v, gold, sub }], max, h, bw, gap, u, unit, size })   vertical bars, values above, labels under
//   yearRail(ctx, t, x, y, w, o { from, to, u, marks [{ year, label, sub, u, gold }], brk { from, to, label, u }, now })
//   verdict(ctx, t, x, y, text, u, o { size, align })   gold caps + a gold underline that draws (no stamps)
//   counter(ctx, t, T, o { a }) · COUNTER · counterState(T, t)   THE COUNTDOWN (top left) · stepHit(T, i) · stepLight(T, t, i) (the step sound)
//   camPath(t, K) · bracket · source(ctx, t, t0, t1, text) (y 880) · SOURCES · veil(ctx, a) · float(ctx, t, k)
//   CLIP_RECT, CLIP_PORTRAIT, CLIPS, clipWin, prepareClipFrames, clipPlate(ctx, t, T, id, o { from, morph, dark, label })
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import * as F54 from './f54_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, maskLine, measure, stamp } = K16;
export const { du, person, cam3, card, camAt, camDrift, aim, project, F0, glowText } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
export const { bracket } = F54;
export const source = (ctx, t, t0, t1, s, o = {}) => F54.source(ctx, t, t0, t1, s, { size: 22, y: 880, ...o });   // ≥ 22 px (TV, 45+)
// camPath(t, K, ref = 6000): a camera that glides THROUGH its keys [[t, cam], …] (monotone cubic in x, y and log distance to the card at
// depth ref; no stop at the inner keys). Use it for every travelling move; camAt (ease per segment) only for single moves.
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

export const PRINT49 = { grain: 14, floor: 4, vig: .5 };
// colour code (docs/MOTION.md §4): GOLD = the stairs, the door, hope (the one hero light) · PAPER = cards and documents · COOL = machines
// and AI (screens, the laptop, the tablet, the chat window, data centres) · LAMP = people's light (windows, string lights, the wedding)
// · INK = the night world · the yellow coat = only you. Gold and cool never at full strength in the same spot.
export const GOLD = { core: '#fff8dc', hot: '#ffe9a6', body: '#f6c95c', mid: '#e3a63f', shade: '#b8792a', deep: '#6e4416', halo: '#f2b632', line: '#ffd982', text: '#ffe7a8' };
export const PAPER = { body: '#ece4c8', lit: '#f7f0d8', shade: '#cfc4a2', edge: '#a99d7c', ink: '#141a3c', faint: '#8a8166' };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
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
// 5 YEARS TO GET / READY FOR AI like thumbnail B: heavy condensed caps, cream with a warm glow, top left (cap height ≈ 215 px). u rises
// (u = 1 at frame 0: the first frame IS the thumbnail), o.out sinks each line behind its own mask.
function blackLines(ctx, lines, x, y, size, cond, lead, u, out, glow = 1) {
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)), ex = out != null ? sineIO(clamp(out * 1.15 - i * .12)) : 0; if (ui <= 0 || ex >= 1) return;
    const k = expoOut(ui), yy = y + i * size * lead + (1 - k) * size * .5 + ex * size * .95;
    ctx.save(); if (ui < 1 || ex > 0) { ctx.beginPath(); ctx.rect(x - 60, y + i * size * lead - size * .86, W * 2, size * .94); ctx.clip(); }   // the mask only while moving (no clipped glow edges at rest)
    ctx.translate(x, yy); ctx.scale(cond, 1);
    ctx.font = `${size}px "Inter Black"`; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '-0.01em';
    ctx.shadowColor = rgba(GOLD.halo, .75 * glow); ctx.shadowBlur = size * .16; ctx.fillStyle = '#fff6d8'; ctx.fillText(ln, 0, 0);
    ctx.shadowBlur = 0; ctx.fillStyle = '#fffbea'; ctx.fillText(ln, 0, 0);
    ctx.restore();
  });
}
function blackSize(ctx, lines, cond, maxW, max) { ctx.font = `100px "Inter Black"`; const wide = Math.max(...lines.map((l) => ctx.measureText(l).width)) * cond / 100; return Math.min(max, maxW / wide); }
export const TITLE = { lines: ['5 YEARS TO GET', 'READY FOR AI'], x: 70, y: 292, maxW: 1120, cond: .47, lead: .8 };
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const q = { ...TITLE, ...o };
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const size = blackSize(ctx, q.lines, q.cond, q.maxW, q.size ?? 420);
  blackLines(ctx, q.lines, q.x, q.y, size, q.cond, q.lead, u, o.out);
  ctx.restore();
}
// caption: the few words the hook writes into the night sky (IT FALLS TO YOU · A WARNING · NOT YOUR COMPUTER). Same type as the title,
// smaller (size = cap ≈ .73 size). Screen space. o.out sinks it. Keep it in the sky, never over you or the door.
export function caption(ctx, t, x, y, lines, u, o = {}) {
  if (u <= 0) return;
  lines = Array.isArray(lines) ? lines : [lines];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const cond = o.cond ?? .56, size = o.size ?? 150, lead = o.lead ?? .84;
  let xx = x;
  if (o.align === 'center' || o.align === 'right') { ctx.font = `${size}px "Inter Black"`; const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) * cond; xx = o.align === 'center' ? x - w / 2 : x - w; }
  blackLines(ctx, lines, xx, y, size, cond, lead, u, o.out, o.glow ?? .7);
  ctx.restore();
}

// ======================================================================================================================== PAPER
// a card: 'paper' (cream, dark ink: quotes, letters, the bill) or 'night' (dark indigo, gold edge: data). lines [[text, size, gold, serif]]
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
  if (o.src) maskLine(ctx, [[o.src.toUpperCase(), 0]], 34, h - 24, 18, rise(span(u, .5, 1)), { serif: false, weight: 600, col: night ? P.halo2 : PAPER.faint, glow: false });
  ctx.restore();
  return { x, y, w, h };
}
// a data card (night style, gold edge) with a kind pill (KNOWN / FORECAST / ESTIMATE / SURVEY), a big gold number and one small line.
// FORECASTS ARE NEVER FACTS: every expert date in this film is a FORECAST pill (cool); a survey is SURVEY; a measured number is KNOWN.
export function dataCard(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const h = o.h ?? (o.small ? 300 : 250);
  const box = paperCard(ctx, t, x, y, w, h, { u, style: 'night', a: o.a, rot: o.rot });
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  if (o.kind) {
    const kc = o.kind === 'KNOWN' ? GOLD.body : o.kind === 'FORECAST' ? COOL.body : PAPER.shade, tw = measure(o.kind, 18, false, 600) + 18 * o.kind.length * .14 + 30;
    ctx.fillStyle = rgba(kc, .16); ctx.strokeStyle = rgba(kc, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(30, 26, tw, 34, 17); ctx.fill(); ctx.stroke();
    E.glowText(ctx, o.kind, 30 + 15, 49, { size: 18, weight: 600, spacing: .14, col: kc, glow: false });
  }
  if (o.title) maskLine(ctx, [[o.title, 0]], 34, 102, 22, rise(span(u, .25, .8)), { serif: false, weight: 600, col: P.halo2, glow: false });
  if (o.big) goldText(ctx, [[o.big, 1]], 32, o.title ? 186 : 160, o.bigSize ?? 76, rise(span(u, .35, 1)), { serif: true });
  if (o.small) maskLine(ctx, [[o.small, 0]], 34, o.title ? 236 : 210, 22, rise(span(u, .5, 1)), { serif: false, weight: 600, col: P.cream, glow: false });
  if (o.src) maskLine(ctx, [[o.src.toUpperCase(), 0]], 34, h - 22, 18, rise(span(u, .55, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
  return box;
}
// a quote card (paper): head, the quote in serif (wrapped to w); words light gold-ink as they are spoken (o.spoken = [fromPhrase, toPhrase]
// in the VO); credit line at the bottom. Returns the box.
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export function quoteCard(ctx, t, T, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const size = o.size ?? 54, w = o.w ?? 1100, pad = 54, words = o.text.split(/\s+/), lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.join(' '), size, true) > w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const head = o.head ? 64 : 24, h = head + lines.length * size * 1.22 + (o.credit ? 92 : 40);
  let times = null;
  if (o.spoken && T) { try { const ws = T.GW(o.spoken[0], o.spoken[1], o.after ?? -1); times = []; let j = 0; for (const wd of lines.flat()) { const n = nz(wd); let hit = null; for (let q = j; q < ws.length; q++) if (nz(ws[q].w) === n && n) { hit = ws[q].s; j = q + 1; break; } times.push(hit); } } catch { times = null; } }
  const x = o.x ?? (W - w) / 2, y = o.y ?? 200;
  const box = paperCard(ctx, t, x, y, w, h, { u, rot: o.rot ?? -.006, head: o.head, a: o.a });
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  let k = 0;
  lines.forEach((ln, li) => {
    let xx = pad; const yy = head + (li + 1) * size * 1.22;
    for (const wd of ln) {
      const tt = times ? times[k] : null, lit = tt == null ? (times ? .25 : 1) : clamp((t - tt + .05) / .25), g = (o.gold ?? 1) * (times && tt != null ? lit : 0);
      const col = mixHex(mixHex(PAPER.faint, PAPER.ink, times ? lit : 1), GOLD.deep, g * .85);
      maskLine(ctx, [[wd + ' ', 0]], xx, yy, size, rise(span(u, .3 + li * .08, .9 + li * .08)), { serif: true, col, glow: false });
      xx += measure(wd, size, true) + size * .26; k++;
    }
  });
  if (o.credit) maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 34, 20, rise(span(u, .55, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  ctx.restore();
  return { ...box, h };
}

// ======================================================================================================================== TENT CARD (date cards)
// A folded card standing on a step edge (x, y = its foot, centre). It UNFOLDS up out of the tread on u (a hinge at the foot: never pops).
// s = width. o.big (serif, ink) · o.small [lines] (Inter 600, ink) · o.glow (gold rim light from the stairs) · o.lean (rad) · o.a
export function tentCard(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1), a = clamp(o.a ?? 1); if (u <= 0 || a <= 0) return null;
  const small = o.small ?? [], h = o.h ?? s * (.5 + .13 * small.length), k = expoOut(u), hh = h * k;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate((o.lean ?? -.02) + .006 * Math.sin(t * .7 + x * .01));
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.ellipse(s * .08, 2, s * .58, s * .05, 0, 0, TAU); ctx.fill();   // contact shadow
  // the back leaf (seen as a sliver above the front: a tent)
  ctx.fillStyle = mixHex(PAPER.shade, P.ind1, .35); ctx.beginPath(); ctx.moveTo(-s / 2 + s * .05, -hh * 1.0); ctx.lineTo(s / 2 + s * .05, -hh * 1.0); ctx.lineTo(s / 2 + s * .09, -hh * .02); ctx.lineTo(-s / 2 + s * .09, -hh * .02); ctx.closePath(); ctx.fill();
  // the front leaf
  ctx.fillStyle = lin(ctx, 0, -hh, 0, 0, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.moveTo(-s / 2, -hh); ctx.lineTo(s / 2, -hh); ctx.lineTo(s / 2 + s * .02, 0); ctx.lineTo(-s / 2 - s * .02, 0); ctx.closePath(); ctx.fill();
  if ((o.glow ?? .6) > 0) { ctx.strokeStyle = rgba(GOLD.hot, .55 * (o.glow ?? .6)); ctx.lineWidth = Math.max(1, s * .01); ctx.stroke(); }
  ctx.fillStyle = rgba(GOLD.core, .5 * (o.glow ?? .6)); ctx.fillRect(-s / 2, -hh, s, Math.max(1, s * .012));   // the fold catches the light
  if (k > .55) {
    const ta = clamp((k - .55) / .3);
    ctx.save(); ctx.beginPath(); ctx.rect(-s / 2, -hh, s, hh); ctx.clip(); ctx.globalAlpha *= ta;
    const bs = o.bigSize ?? s * .3; let yy = -hh + s * .08 + bs * .92;
    if (o.big) E.glowText(ctx, o.big, 0, yy, { size: bs, serif: true, align: 'center', col: o.bigGold ? GOLD.deep : PAPER.ink, glow: false });
    const ss = o.smallSize ?? s * .062;
    for (const l of small) { yy += ss * 1.45; E.glowText(ctx, l.toUpperCase(), 0, yy + ss * .3, { size: ss, weight: 600, align: 'center', spacing: .06, col: mixHex(PAPER.ink, PAPER.faint, .35), glow: false }); }
    ctx.restore();
  }
  ctx.restore();
  return { x: x - s / 2, y: y - hh, w: s, h: hh };
}

// ======================================================================================================================== THE PLACE CARD
// The through-line. A folded place card (s = width): the top line is a NAME you cannot read (a soft ink scribble, never letters); the bottom
// line is THE ANSWER to "what do you do?" (a written ink line). o.answer 1 → 0: it fades and leaves a blank line (c02); o.gold 0..1: a first
// thin gold stroke draws into the blank (c04); o.write 0..1: the gold stroke grows into a full written line (only if a builder needs it; the
// film ends on the BLANK card, c12). o.face 'down': lies face down (the choir, c04). (x, y) = its foot centre on the table.
const SCRIB = new Map();
function scribble(seed, n) {
  if (SCRIB.has(seed + ':' + n)) return SCRIB.get(seed + ':' + n);
  const r = prng(seed), pts = []; let x = 0;
  for (let i = 0; i < n; i++) { x += .6 + r() * .9; pts.push([x, (r() - .5) * (i % 3 === 0 ? 1.7 : 1)]); }
  const mx = x; const out = pts.map(([px, py]) => [px / mx, py]); SCRIB.set(seed + ':' + n, out); return out;
}
function inkLine(ctx, x0, y0, w, amp, u, seed, col, lw) {
  const pts = scribble(seed, 26), n = Math.max(2, Math.ceil(pts.length * clamp(u)));
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let i = 0; i < n; i++) { const [px, py] = pts[i], X = x0 + px * w, Y = y0 + py * amp; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
  ctx.stroke();
}
export function placeCard(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1), a = clamp(o.a ?? 1); if (u <= 0 || a <= 0) return null;
  const h = s * .62, k = expoOut(u), hh = h * k, down = o.face === 'down';
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.ellipse(s * .05, 2, s * .6, s * .06, 0, 0, TAU); ctx.fill();
  if (down) {   // lying flat, face down: a thin cream slab
    ctx.fillStyle = PAPER.shade; ctx.beginPath(); ctx.roundRect(-s / 2, -s * .07, s, s * .07, 2); ctx.fill();
    ctx.fillStyle = PAPER.body; ctx.fillRect(-s / 2, -s * .07, s, s * .022);
    ctx.restore(); return { x: x - s / 2, y: y - s * .07, w: s, h: s * .07 };
  }
  ctx.fillStyle = mixHex(PAPER.shade, P.ind1, .3); ctx.beginPath(); ctx.moveTo(-s / 2 + s * .04, -hh); ctx.lineTo(s / 2 + s * .04, -hh); ctx.lineTo(s / 2 + s * .07, 0); ctx.lineTo(-s / 2 + s * .07, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -hh, 0, 0, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.moveTo(-s / 2, -hh); ctx.lineTo(s / 2, -hh); ctx.lineTo(s / 2 + s * .015, 0); ctx.lineTo(-s / 2 - s * .015, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .8); ctx.lineWidth = Math.max(1, s * .008); ctx.stroke();
  const gl = clamp(o.glow ?? 0); if (gl > 0) { ctx.fillStyle = rgba(GOLD.core, .5 * gl); ctx.fillRect(-s / 2, -hh, s, Math.max(1, s * .012)); }
  if (k > .6) {
    const ta = clamp((k - .6) / .3), lw = Math.max(1, s * .016);
    ctx.save(); ctx.globalAlpha *= ta;
    inkLine(ctx, -s * .32, -hh + h * .34, s * .64, s * .035, 1, 49, rgba(PAPER.ink, .75), lw * 1.25);   // the name: unreadable
    ctx.fillStyle = rgba(PAPER.faint, .45); ctx.fillRect(-s * .36, -hh + h * .74, s * .72, Math.max(1, s * .006));   // the answer's base line
    const ans = clamp(o.answer ?? 1);
    if (ans > 0) inkLine(ctx, -s * .3, -hh + h * .66, s * .58, s * .028, 1, 7, rgba(PAPER.ink, .7 * ans), lw);
    const g = clamp(o.gold ?? 0), wr = clamp(o.write ?? 0);
    if (g > 0) {   // the first gold stroke (and, with write, the new line)
      const gw = lerp(s * .12, s * .58, wr), pts = [[-s * .3, -hh + h * .67], [-s * .3 + gw * smooth(g), -hh + h * .655]];
      if (wr > 0) inkLine(ctx, -s * .3, -hh + h * .66, s * .58, s * .028, wr, 91, rgba(GOLD.deep, .95), lw);
      else goldSpan(ctx, pts, 0, 1, { w: lw * .55, spark: g < 1 });
    }
    ctx.restore();
  }
  ctx.restore();
  return { x: x - s / 2, y: y - hh, w: s, h: hh };
}

// ======================================================================================================================== BARS
// vertical bars on a gold base line (screen space or card space). items [{ label, v, gold (0..1: gold vs cool body), sub }], o.max,
// o.h (bar area height), o.bw (bar width), o.gap, o.u (grow; staggered 80 ms), o.unit ('%' or ''), o.fmt(v) (value text), o.size (labels)
export function bars(ctx, t, x, y, o = {}) {
  const items = o.items ?? [], u = clamp(o.u ?? 1); if (u <= 0) return null;
  const max = o.max ?? Math.max(...items.map((i) => i.v)), hgt = o.h ?? 320, bw = o.bw ?? 120, gap = o.gap ?? 90, sz = o.size ?? 24;
  const wTot = items.length * bw + (items.length - 1) * gap;
  goldSpan(ctx, [[x - 30, y], [x + wTot + 30, y]], 0, smooth(span(u, 0, .4)), { w: 1.4, spark: false });
  items.forEach((it, i) => {
    const ui = expoOut(span(u, .15 + i * .12, .8 + i * .12)), bx = x + i * (bw + gap), bh = hgt * it.v / max * ui; if (ui <= 0) return;
    const g = clamp(it.gold ?? 1), top = mixHex(COOL.body, GOLD.hot, g), bot = mixHex(COOL.deep, GOLD.shade, g);
    ctx.fillStyle = lin(ctx, 0, y - bh, 0, y, [[0, top], [1, bot]]); ctx.fillRect(bx, y - bh, bw, bh);
    ctx.fillStyle = rgba(g > .5 ? GOLD.core : COOL.core, .6); ctx.fillRect(bx, y - bh, bw, 3);
    if (g > .5) halo(ctx, bx + bw / 2, y - bh, bw * .9, .18 * ui, GOLD.halo, GOLD.core);
    const vt = o.fmt ? o.fmt(it.v) : `${it.v}${o.unit ?? '%'}`;
    goldText(ctx, [[vt, g]], bx + bw / 2, y - bh - 18, o.vsize ?? 54, rise(span(u, .45 + i * .12, 1)), { serif: true, align: 'center', col: g > .5 ? P.cream : COOL.text });
    const words = it.label.toUpperCase().split(' '), lines = []; let cur = '';   // wrap the label to the bar's slot (bw + gap)
    for (const wd of words) { const nx = cur ? cur + ' ' + wd : wd; if (cur && measure(nx, sz, false, 600) > (bw + gap) * .92) { lines.push(cur); cur = wd; } else cur = nx; }
    if (cur) lines.push(cur);
    lines.forEach((ln, j) => maskLine(ctx, [[ln, 0]], bx + bw / 2, y + sz * (1.5 + j * 1.2), sz, rise(span(u, .35 + i * .12 + j * .05, .9 + i * .12 + j * .05)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false }));
    if (it.sub) maskLine(ctx, [[it.sub.toUpperCase(), 0]], bx + bw / 2, y + sz * (2.8 + (lines.length - 1) * 1.2), sz * .8, rise(span(u, .45 + i * .12, 1)), { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
  });
  return { x, y, w: wTot, h: hgt };
}

// ======================================================================================================================== THE YEAR RAIL
// a gold rail from o.from to o.to (years) across w px; ticks every year (every 5th taller, labelled); marks [{ year, label, sub, u, gold }]
// hang above it; o.brk { from, to, label, u } a bracket below; o.now (year) a small cream tick 'TODAY'. u draws the rail from the left.
export function yearRail(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const y0 = o.from ?? 2026, y1 = o.to ?? 2050, X = (yr) => x + (yr - y0) / (y1 - y0) * w, sz = o.size ?? 22;
  goldSpan(ctx, [[x, y], [x + w, y]], 0, smooth(u), { w: 1.6 });
  for (let yr = y0; yr <= y1; yr++) {
    const f = (X(yr) - x) / w; if (f > smooth(u) + 1e-6) break;
    const big = yr % 5 === 0 || yr === y0; ctx.fillStyle = rgba(GOLD.line, big ? .9 : .5); ctx.fillRect(X(yr) - 1, y - (big ? 14 : 7), 2, big ? 28 : 14);
    if (big && (o.labels ?? true)) maskLine(ctx, [[String(yr), 0]], X(yr), y + sz * 1.7, sz, rise(span(u, f, f + .2)), { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
  }
  if (o.now != null) { const nx = X(o.now); ctx.fillStyle = P.cream; ctx.fillRect(nx - 1.5, y - 22, 3, 44); maskLine(ctx, [['TODAY', 0]], nx, y - 32, sz * .85, rise(u), { serif: false, weight: 700, align: 'center', col: P.cream, glow: false }); }
  for (const m of o.marks ?? []) {
    const mu = clamp(m.u ?? 1); if (mu <= 0) continue; const mx = X(m.year), lift = m.lift ?? 90;
    goldSpan(ctx, [[mx, y - 6], [mx, y - lift * expoOut(mu)]], 0, 1, { w: 1.3, spark: false, a: clamp(mu * 3) });
    ctx.fillStyle = m.gold === 0 ? COOL.body : GOLD.hot; ctx.beginPath(); ctx.arc(mx, y, 5, 0, TAU); ctx.fill();
    if (m.label) goldText(ctx, [[m.label, m.gold ?? 1]], mx, y - lift - 12, m.size ?? 30, rise(span(mu, .3, 1)), { serif: true, align: 'center', col: m.gold === 0 ? COOL.text : P.cream });
    if (m.sub) maskLine(ctx, [[m.sub.toUpperCase(), 0]], mx, y - lift + 22, sz * .82, rise(span(mu, .45, 1)), { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
  }
  if (o.brk && (o.brk.u ?? 1) > 0) bracket(ctx, X(o.brk.from), X(o.brk.to), y + sz * 3.2, o.brk.u ?? 1, null);
  if (o.brk && o.brk.label && (o.brk.u ?? 1) > 0) goldText(ctx, [[o.brk.label, .6]], (X(o.brk.from) + X(o.brk.to)) / 2, y + sz * 3.2 + 46, sz * 1.15, rise(span(o.brk.u ?? 1, .4, 1)), { serif: false, weight: 700, spacing: .08, align: 'center' });
  return { x, y, w, X };
}

// ======================================================================================================================== THE VERDICT
export function verdict(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 30, tw = measure(text, size, false, 700) + size * text.length * .08, x0 = o.align === 'left' ? x : x - tw / 2;
  goldText(ctx, [[text, 1]], x0, y, size, rise(u), { serif: false, weight: 700, spacing: .08 });
  goldSpan(ctx, [[x0, y + size * .32], [x0 + tw, y + size * .32]], 0, smooth(span(u, .35, 1)), { w: 1.4, spark: false });
  return { x: x0, y, w: tw };
}

// ======================================================================================================================== THE COUNTDOWN (the clock)
// Screen space, top left (x 64–230, y 44–150): five small blocks rising left → right like the stairs (block 0 = the bottom step = 5 years).
// It builds block by block on 'So start the countdown' (the blocks rise out of the base line, 80 ms apart); a block LIGHTS when its year begins
// (phrases below; never animate by hand): current = full gold, passed = warm (.55), future = a dim outline. The label under it: 5 YEARS TO GO …
// At the top ('So suppose all of it works') all five glow and a thin door of light stands right of them; it goes away with the last scene
// ('Five years from now'). Hidden in the clip windows.
export const COUNTER = {
  on: 'So start the countdown',
  years: ['Five years to go', 'Four years to go', 'Three years to go', 'Two years to go', 'One year to go'],
  labels: ['5 YEARS TO GO', '4 YEARS TO GO', '3 YEARS TO GO', '2 YEARS TO GO', '1 YEAR TO GO'],
  top: 'So suppose all of it works', off: 'Five years from now',
};
// THE STEP HIT: the sound step puts a step sound on the END of each "N years to go" + .12 s (audio/sound_plan.json step5…step1). The counter
// block AND the step in the world light on that frame: stepHit(T, i) (i 0 = five years … 4 = one year). Never time a step by hand.
export const STEP_HIT = .12;
const CT = new WeakMap();
export const stepHit = (T, i) => counterTimes(T).at[i];
// the light of step i in the world around its hit: a 0.3 s rise with a small overshoot, then it settles (0 before, 1 after)
export const stepLight = (T, t, i) => { const h = stepHit(T, i), u = span(t, h - .05, h + .3); return u <= 0 ? 0 : u >= 1 ? 1 + .12 * Math.exp(-(t - h - .3) * 3) * Math.cos((t - h - .3) * 6) : expoOut(u) * 1.12; };
export function counterTimes(T) {
  if (CT.has(T)) return CT.get(T);
  const on = T.G(COUNTER.on), at = []; let prev = on;
  for (const p of COUNTER.years) { const a = T.G(p, 0, prev); at.push(T.GE(p, 0, prev) + STEP_HIT); prev = a; }
  const top = T.G(COUNTER.top, 0, prev), off = T.G(COUNTER.off, 0, top);
  const r = { on, at, top, off, clips: ['C13', 'C5', 'C16', 'C2'].map((id) => T.clip(id)).filter(Boolean) }; CT.set(T, r); return r;
}
export function counterState(T, t) {
  const c = counterTimes(T); let cur = -1; for (let i = 0; i < 5; i++) if (t >= c.at[i] - .05) cur = i;
  const lit = [0, 1, 2, 3, 4].map((i) => (i === cur ? lerp(.55, 1, expoOut(span(t, c.at[i] - .05, c.at[i] + .3))) : i < cur ? .55 : 0));
  const topU = span(t, c.top, c.top + 1.2);
  const clipHide = c.clips.reduce((m, k) => Math.max(m, span(t, k.start - 1.2, k.start - .4) * (1 - span(t, k.end + .2, k.end + 1))), 0);
  const on = smooth(span(t, c.on - .2, c.on + .9)) * (1 - clipHide) * (1 - smooth(span(t, c.off + .5, c.off + 1.7)));
  return { cur, lit: lit.map((v) => Math.max(v, topU)), build: span(t, c.on - .2, c.on + .9), topU, on, c,
    label: cur >= 0 ? span(t, c.at[cur] - .05, c.at[cur] + .6) : 0 };
}
export function counter(ctx, t, T, o = {}) {
  const S = counterState(T, t), a = (o.a ?? 1) * S.on; if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(o.x ?? 64, o.y ?? 44); ctx.globalAlpha *= a;
  const bw = 30, step = 15, base = 96;
  goldSpan(ctx, [[0, base], [bw * 5 + 10, base]], 0, smooth(S.build), { w: 1.1, spark: false, a: .8 });
  for (let i = 0; i < 5; i++) {
    const bu = expoOut(span(S.build, .1 + i * .08, .55 + i * .08)); if (bu <= 0) continue;
    const bh = (i + 1) * step * bu, x = i * bw, y = base - bh, L = S.lit[i];
    ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .5), GOLD.body, L * .9); ctx.fillRect(x + 2, y, bw - 4, bh);
    ctx.fillStyle = rgba(GOLD.core, .25 + .75 * L); ctx.fillRect(x + 2, y, bw - 4, 3);   // the tread edge
    if (L <= 0) { ctx.strokeStyle = rgba(GOLD.line, .45); ctx.lineWidth = 1.2; ctx.strokeRect(x + 2.5, y + .5, bw - 5, bh - 1); }
    if (i === S.cur && L > .9) halo(ctx, x + bw / 2, y, 34, .3, GOLD.halo, GOLD.core);
  }
  if (S.topU > 0) { const dh = 64 * expoOut(S.topU); ctx.fillStyle = rgba(GOLD.core, .95); ctx.fillRect(bw * 5 + 4, base - 5 * step - dh, 9, dh); halo(ctx, bw * 5 + 8, base - 5 * step - dh / 2, 50, .35 * S.topU, GOLD.halo, GOLD.core); }
  if (S.cur >= 0 && S.topU < 1) goldText(ctx, [[COUNTER.labels[S.cur], .9]], 0, base + 36, 22, rise(S.label) * (1 - S.topU), { serif: false, weight: 700, spacing: .08 });
  ctx.restore();
}

// ======================================================================================================================== SOURCES (on screen, y ≤ 880)
// Binding wording: <ROOT>faktencheck-v7.md "Bild und Einblendungen" applied to <ROOT>text-v7.md. Use F.source(ctx, t, t0, t1, F.SOURCES.x).
// If a newer fact check changes a line, the lead updates it here; builders never type their own source strings.
export const SOURCES = {
  // hook (c01)
  generations: 'PORZIO, ROSSI & SANTANGELO 2022 · HOBIJN & SCHOELLMAN',
  insiders: '2027? · AI FUTURES PROJECT, NOV 2026',
  amodei: '1–2 YEARS · DARIO AMODEI, ESSAY, JAN 2026',
  altman: 'BY END OF 2028 · SAM ALTMAN, FEB 2026',
  // (the "by 2030, survey of Anthropic staff" card is CUT: that survey asks about a Nobel-level discovery, not superintelligence)
  // c02 wedding / Harari
  harariRole: 'HISTORIAN · AUTHOR OF “SAPIENS” · 25 MILLION COPIES SOLD',
  careers: '“THE END OF LIFETIME CAREERS” · YUVAL NOAH HARARI, 1 AUG 2026',
  // c03 step 5: you
  founders: 'AVERAGE FOUNDER AGE 45 · FASTEST-GROWING 0.1 % OF NEW U.S. FIRMS (AZOULAY ET AL., 2020)',
  foundersBig: '45', foundersLabel: 'AVERAGE FOUNDER AGE AT THE START',
  laidOff: 'OECD EMPLOYMENT OUTLOOK 2025 · LAID OFF AT 46–50: −28 % PAY', laidOffBig: '−28 %',
  // c04
  resilience: 'RESILIENCE TRAINING · SMALL EFFECTS (NATURE REVIEWS PSYCHOLOGY, 2026)',
  oneMin: '1 MIN',
  // c05 step 4: work
  experts: 'ONE CODING TOOL (CLAUDE CODE) · ANTHROPIC, 16 JUNE 2026 · ABOUT 400,000 SESSIONS',   // the study's maker as a SOURCE only
  expertsBars: [{ label: 'expert-rated', v: 2.1 }, { label: 'novice', v: 1 }],   // "more than twice as often": show the ratio, no invented %
  measured: 'MEASURED IN ONE CODING TOOL',
  weeks: '34 WEEKS', weeksSrc: 'OUT OF WORK, AGES 55–64 · AARP / BLS, 2026',   // month: check at the iMac (faktencheck v7)
  // c06
  statement: '“WE MUST ACT NOW” · 13 JULY 2026 · 200+ SIGNATORIES, 16 NOBEL LAUREATES',
  // c07 step 3: family
  teens: '77 %', teensSrc: 'TEENS USING A.I. IN FREE TIME · COMMON SENSE CENSUS 2026', companion: 'TRIED AN A.I. COMPANION: 72 % (2025)',
  sb243: 'CALIFORNIA SB 243 · IN FORCE SINCE 1 JAN 2026 · APPLIES TO KNOWN MINORS', notHuman: 'I am not a human.',
  experiment: '“a psychological experiment on a global scale”', experimentSrc: 'YUVAL NOAH HARARI',
  // c08 step 2: the machine
  platforms: 'FORECASTING PLATFORMS (METACULUS) ≈ 2032', survey2047: 'RESEARCHER SURVEY ≈ 2047 (AI IMPACTS, 2023)',
  fri: 'EXPECTED FOR 2030 · DONE IN APRIL 2025 (FORECASTING RESEARCH INSTITUTE, SEPT 2026)',
  launched: 'LAUNCHED 30 NOV 2022', billion: 'OVER 1 BILLION WEEKLY ACCOUNTS (OPENAI, 2026)',   // accounts, not people
  generation: 'LESS THAN ONE GENERATION',   // the bracket runs to 2047 (not 2050)
  signs: ['LONGER → EARLY', 'FIVE → READY'],
  // c09
  pew: 'PEW RESEARCH CENTER, 17 JUNE 2026 · U.S. ADULTS 65+',
  pewBars: [{ label: 'expect a negative effect on society', v: 35 }, { label: 'ever used a chatbot', v: 23 }],
  soon: 'SOON!', notLifetime: 'NOT IN OUR LIFETIME',
  // c10 step 1: your say
  ballots: '41 LOCAL MEASURES · 10 STATES · LIMITS WON 40 (BALLOTPEDIA)',   // 41 slips, 40 tip
  ballotsDate: '3 NOV 2026',
  machinesEarn: 'WHO GETS WHAT THE MACHINES EARN?',
  fundAct: 'AMERICAN A.I. SOVEREIGN WEALTH FUND ACT · 18 JUNE 2026', fundChances: 'CHANCES: SLIM',
  trump: '“the American public essentially becomes a partner with the companies.”', trumpSrc: 'DONALD TRUMP, 5 JUNE 2026',
  share: 'WHO GETS A SHARE?',
  // c11
  nobel: '91 % OF STAFF · U.S. ADULTS: 39 %', nobelSrc: 'ANTHROPIC SURVEY, 16 OCT 2026 · “A NOBEL-LEVEL DISCOVERY BY 2030”',   // a source, not the maker
  // c12
  wantToBe: 'WHAT DO YOU WANT TO BE?', three: ['WARNING', 'WORK', 'WONDER'], nextGen: 'THE NEXT GENERATION IS YOU',
};

// ======================================================================================================================== VEIL, FLOAT
export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(0, 0, W, H); ctx.restore(); }
export const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .02 * k * Math.sin(t * .6 + 1), dx = E.drift(t * 2, 16 * k, 11), dy = E.drift(t * 2, 10 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// Four clips arrive tonight as <ROOT>clips/Cn.mp4 (already cut). tools/f49_clips.py extracts their frames (aspect kept) to
// <F49CLIPS or /tmp/claude-0/f49/clips/>/<id>/f00001.jpg … — `render` does that by itself when an mp4 is newer than its frames. Until then
// the plate shows a clean placeholder: ORIGINAL FOOTAGE · NAME on a dark ground (fine for review; never ship it).
// PORTRAIT shorts (C13, C5, C16): centred on the night-blue ground (CLIP_PORTRAIT), the lower third LEFT of the plate.
// LANDSCAPE (C2): CLIP_RECT, the lower third ABOVE the plate. The orientation comes from the real frames once they exist (CLIPS.orient is
// the guess until then). The plate grows out of a thing in the world (o.from = { x, y, w, h } screen rect or [cx, cy, r]) and goes back.
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIP_PORTRAIT = { x: 960 - 439 / 2 + 160, y: 100, w: 439, h: 780 };   // 9:16, a little right of centre: the lower third sits left
export const CLIPS = {
  C13: { name: 'Yuval Noah Harari', role: 'Historian', date: '1 Aug 2026', src: 'his own channel', orient: 'portrait' },
  C5: { name: 'Erik Brynjolfsson', role: 'Stanford Digital Economy Lab', date: '14 July 2026', src: 'Stanford Digital Economy Lab', orient: 'portrait' },
  C16: { name: 'Yuval Noah Harari', role: 'Historian', date: '28 Sept 2026', src: 'his own channel', orient: 'portrait' },
  C2: { name: 'Senator Bernie Sanders', role: 'U.S. Senate', date: '1 June 2026', src: 'Senate office channel', orient: 'landscape' },
};
const CLIPDIR = (process.env.F49CLIPS || '/tmp/claude-0/f49/clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; return Math.max(1, Math.min(n, Math.floor((t - win.start) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map(), orientSeen = new Map();
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    const win = clipWin(T, id); if (!win || t < win.start - 7 || t > win.end + .8) continue;
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    const img = await loadImage(fs.readFileSync(f)); frameCache.set(f, img); orientSeen.set(id, img.height > img.width ? 'portrait' : 'landscape');
  }
}
export const clipOrient = (id) => orientSeen.get(id) ?? CLIPS[id]?.orient ?? 'landscape';
export const clipRect = (id) => (clipOrient(id) === 'portrait' ? CLIP_PORTRAIT : CLIP_RECT);
function plateBox(o, R) {
  const m = sineIO(clamp(o.morph ?? 1)), f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(8, f.w / 2) };
  return { m, cx: lerp(fr0.cx, R.x + R.w / 2, m), cy: lerp(fr0.cy, R.y + R.h / 2, m), w: lerp(fr0.w, R.w, m), h: lerp(fr0.h, R.h, m), rr: lerp(fr0.r, 14, m) };
}
// o: { from, morph 0..1 (0 = the source shape, 1 = the plate rect), dark 0..1, credits (false = none), label 0..1, ground 0..1 (the
// night-blue ground behind a portrait plate; default = morph) }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = clipRect(id), portrait = R === CLIP_PORTRAIT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], dark = clamp(o.dark ?? 0);
  const { m, cx, cy, w, h, rr } = plateBox(o, R);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (portrait) { const g = clamp(o.ground ?? m); if (g > 0) { ctx.fillStyle = rgba(mixHex(P.night1, P.ind0, .5), .92 * g); ctx.fillRect(0, 0, W, H); ctx.fillStyle = rad(ctx, cx, cy, 900, [[0, rgba(P.blue0, .22 * g)], [1, rgba(P.night0, 0)]]); ctx.fillRect(0, 0, W, H); } }
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const k = frameAt(id, t, win), fr = k ? frameCache.get(framePath(id, k)) : null;
  if (fr) { const s = Math.max(w / fr.width, h / fr.height), dw = fr.width * s, dh = fr.height * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1; }
  else {   // the placeholder: ORIGINAL FOOTAGE · NAME on a dark ground (a slow light so it never stands still)
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx + w * .2 * Math.sin(t * .4), cy - h * .1, Math.max(w, h) * .7, [[0, rgba(P.blue0, .32 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (m > .6) {
      ctx.globalAlpha = (1 - dark) * .85 * span(m, .6, 1);
      const sz = portrait ? 22 : 28;
      E.glowText(ctx, 'ORIGINAL FOOTAGE', cx, cy - sz * .4, { size: sz, weight: 600, align: 'center', col: P.halo2, glow: false, spacing: .18 });
      E.glowText(ctx, info.name.toUpperCase(), cx, cy + sz * 1.3, { size: sz, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .12 });
      ctx.fillStyle = rgba(P.halo2, .5); ctx.fillRect(cx - w * .35, cy + h * .18, w * .7 * u, 3); ctx.globalAlpha = 1;
    }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {
    const meta = `${info.role} · ${info.date}`.toUpperCase(), foot = `ORIGINAL FOOTAGE (${info.src.toUpperCase()})`;
    if (portrait) {   // left of the plate, right-aligned, low (≥ 22 px)
      const rx = R.x - 48, by = R.y + R.h - 150;
      maskLine(ctx, [[info.name, 0]], rx, by, 52, rise(lu), { glow: true, align: 'right' });
      maskLine(ctx, [[meta, 0]], rx, by + 44, 22, rise(span(lu, .1, 1)), { serif: false, weight: 600, col: P.halo2, glow: false, align: 'right' });
      goldText(ctx, [[foot, .45]], rx, by + 80, 22, rise(span(lu, .2, 1)), { serif: false, weight: 600, align: 'right' });
    } else {          // above the plate
      const by = R.y - 40, nw = measure(info.name, 44, true);
      maskLine(ctx, [[info.name, 0]], R.x, by, 44, rise(lu), { glow: true });
      maskLine(ctx, [[meta, 0]], R.x + nw + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
      goldText(ctx, [[foot, .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
    }
  }
  ctx.restore();
  return { cx, cy, w, h };
}
