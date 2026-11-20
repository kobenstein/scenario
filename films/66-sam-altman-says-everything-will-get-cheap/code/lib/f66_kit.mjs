// Film 66 · "Sam Altman Says Everything Will Get Cheap" (thumbnail A: AI MAKES EVERYTHING CHEAP) · shared kit (owned by the lead;
// builders import, never edit — wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, the
// 2.5D card stage cam3/card/aim/camAt/camDrift, finish) + lib/f16_kit.mjs (rise, maskLine, measure, stamp) + lib/f54_kit.mjs (bracket,
// source). Generic blocks (text in gold, title, cards, quote card, paper tag, veil, float, camPath, clip plate) come from film 59.
// World: docs/MOTION.md §2 · shots: docs/shots.md · the land, the stations, the seam plates, END_CAM: lib/f66_world.mjs.
//
//   THE TAG (the hero light of the whole film): a price tag of gold light hanging on a gold thread from the sky. Seven of them hang over
//   the land, one over each station; they FALL (crumble to gold dust from the lower-left edge, thumbnail A), SPLIT, STAY UP, or turn into
//   a HOUSE (thumbnail B). tag().
//   THE PROMISE (the big tag of the hook, Altman's "everything"): tag() drawn big at Z 6000 by the world (S.Z_PROMISE).
//   THE RECEIPT (thumbnail C): a glowing paper ribbon unrolling from the sky into your hand; rows light on the words. receipt().
//   THE PAY SLIP (your wage, the seventh price): a small cream slip in your hand; it becomes the seventh tag. paySlip().
//   THE SEVEN TAGS (the clock of the film, screen space top left): seven small tags on a gold rail; each falls / splits / stays / climbs when
//   its station decides; the 7th hangs face down until "It's your wage". board(ctx, t, T) drives itself from BOARD phrases.
//   EXPLAINERS (60–70 %): paper cards (quotes), night cards with gold edge (numbers), the dollar bar (what a price is made of), gold numbers.
//   One statement per card, ≤ 6 words + 1 number (verbatim quotes may be longer).
//
// API (design px = screen px at the home camera; t in seconds; u = 0..1 growth):
//   colours: GOLD (prices, the hero light) · PAPER (documents, receipts) · COOL (machines / AI / power) · EARTH (the ground: warm, heavy,
//            never glowing) · LAMP (people's windows) · INK · PRINT66 (finish) · bump(t, t0, d)
//   goldText(ctx, segs [[text, gold 0..1]…], x, y, size, u, o { serif, weight, align, spacing, col, glow }) · goldSpan(ctx, pts, u0, u1, o)
//   goldLabel(ctx, x, y, l1, l2, u, o { dx, dy, size }) · title(ctx, t, u, o { lines, out, sub, x, y, maxW, cond })  (thumbnail A title)
//   tag(ctx, t, x, y, w, o) → { x, y, w, h, rot, face }   THE TAG. (x, y) = the eyelet. o: { a, rot, swing (extra rad), thread (px up from
//        the eyelet, default 2400 = off frame; 0 = none), glow 0..1 (lit gold; 0 = a dim, unlit tag), lines [[text, size, gold 0..1, serif]]
//        (ink on the face, centred), price (big serif at the bottom), priceU 0..1, dust 0..1 (crumbles from the lower-left; the dust keeps
//        streaming), split 0..1 (a vertical tear: the left half drops), back 0..1 (turns over: .5 = edge-on, 1 = the dark back), house 0..1
//        (the outline becomes a house with a chimney, thumbnail B), heavy 0..1 (warm earth weight at the bottom: "stays hard"), seed, h }
//   receipt(ctx, t, o) → end point   THE RECEIPT: o { from [x, y] (the roll), to [x, y] (the hand), u 0..1 (unrolled), w, rows [[label, u]]
//        (rows near the end, each with a gold ↑ that lifts on u), bend, roll 0..1 (the roll at the top is drawn) }
//   paySlip(ctx, t, x, y, s, o { a, rot, glow, lines, label })   your pay slip (cream; label default 'YOUR PAY')
//   dollarBar(ctx, t, x, y, w, o { u, h, title, segs [{ label, share 0..1, col, u, big }], unit '¢' })  one dollar = 100 %, split into parts
//   verdict(ctx, t, x, y, text, u, o { size, align })  the station's verdict under its tag: gold caps + a gold underline that draws (no stamp)
//   paperCard · dataCard · quoteCard(ctx, t, T, { text, x, y, w, size, head, credit, spoken [from, to], after, mode 'hi' })
//   priceTag(ctx, t, x, y, text, u, o) (a small paper tag on a gold thread) · veil(ctx, a) · float(ctx, t, k)
//   board(ctx, t, T, o { a, big 0..1, lit (index to light) }) · BOARD · boardState(T, t)   THE SEVEN TAGS (top left)
//   camPath(t, K) · bracket · source(ctx, t, t0, t1, text) (y 890) · SOURCES
//   CLIP_RECT, CLIPS, clipWin, prepareClipFrames, clipPlate(ctx, t, T, id, o { from, morph, dark, label })
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D, loadImage, GlobalFonts } from '@napi-rs/canvas';
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

export const PRINT66 = { grain: 14, floor: 4, vig: .5 };
// colour code (docs/MOTION.md §4): GOLD = PRICES (the tags; the one hero light, never on two things at once at full strength) · PAPER = documents,
// receipts, the pay slip · COOL = machines and AI (screens, robot arms, data centres, power lines) · EARTH = the ground (land, soil: warm, heavy,
// never glowing, never falls) · LAMP = people's light in windows · the yellow coat = only you
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
// AI MAKES / EVERYTHING CHEAP like thumbnail A: heavy condensed caps, cream with a warm glow, left; the small line under it. u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 72, y = o.y ?? 470, lines = o.lines ?? ['AI MAKES', 'EVERYTHING CHEAP'], cond = o.cond ?? .7;
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

// ======================================================================================================================== THE TAG
// Local frame: the eyelet at (0, 0); the body hangs below it. Outline: 6 points (cut top corners, like thumbnail A); the house outline has
// the same 6 points (a roof apex instead of the flat top) so the two morph (thumbnail B), plus a chimney that grows with o.house.
const TAG_K = 1.42;   // h / w
function tagPts(w, h, house) {
  const tp = [[-w * .27, -h * .1], [w * .27, -h * .1], [w / 2, h * .08], [w / 2, h * .9], [-w / 2, h * .9], [-w / 2, h * .08]];
  const hp = [[-w * .02, -h * .3], [w * .02, -h * .3], [w / 2, h * .16], [w / 2, h * .9], [-w / 2, h * .9], [-w / 2, h * .16]];
  return tp.map((p, i) => [lerp(p[0], hp[i][0], house), lerp(p[1], hp[i][1], house)]);
}
const pathOf = (pts) => { const p = new Path2D(); pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); p.closePath(); return p; };
// the dust front: s(x, y) grows toward the lower-left corner; a point is gone when s > 1 − dust
const dustS = (x, y, w, h) => clamp((y / h) * .62 + (-x / w + .5) * .5 - .08);
const DUST = new Map();
function dustPts(seed, n) { if (!DUST.has(seed)) { const r = prng(seed * 31 + 7), a = []; for (let i = 0; i < n; i++) a.push([r() - .5, r() * 1.0 - .1, r(), r(), r()]); DUST.set(seed, a); } return DUST.get(seed); }
function tagBody(ctx, t, w, h, o, side) {
  const house = clamp(o.house ?? 0), glow = clamp(o.glow ?? 1), pts = tagPts(w, h, house), shape = pathOf(pts);
  const dust = clamp(o.dust ?? 0), seed = o.seed ?? 1;
  ctx.save();
  // the clip: the outline minus the crumbled corner (a ragged front)
  ctx.clip(shape);
  if (dust > 0) {
    const r = prng(seed * 13 + 3), cut = new Path2D(), N = 26;
    cut.moveTo(w, -h); cut.lineTo(w, h * 1.2);
    for (let i = 0; i <= N; i++) {   // the ragged front, from the bottom edge up to the left edge
      const f = i / N, s0 = 1 - dust, jag = (r() - .5) * .05;
      // solve s(x, y) = s0 + jag along a line parameterised by f: x from right to left of the front
      const x = lerp(w * .6, -w * .6, f), y = ((s0 + jag + .08) - (-x / w + .5) * .5) / .62 * h;
      cut.lineTo(x, y);
    }
    cut.lineTo(-w, -h); cut.closePath(); ctx.clip(cut);
  }
  // body: gold light (lit) or a dim, unlit gold (glow 0); the back is a darker umber-gold, no text
  const back = side < 0;
  const c0 = back ? mixHex(GOLD.deep, GOLD.shade, .5) : mixHex(mixHex(GOLD.shade, P.blue2, .25), GOLD.hot, glow);
  const c1 = back ? mixHex(GOLD.deep, P.night1, .35) : mixHex(mixHex(GOLD.deep, P.ind2, .3), GOLD.mid, glow);
  ctx.fillStyle = lin(ctx, w * .5, -h * .1, -w * .5, h * .9, [[0, c0], [.55, mixHex(c0, c1, .5)], [1, c1]]); ctx.fillRect(-w, -h, w * 2, h * 2.2);
  // a soft inner light toward the top right (paper volume) + fine stipple (grain ≤ 2 px)
  ctx.fillStyle = rad(ctx, w * .25, h * .1, w * .9, [[0, rgba(GOLD.core, back ? .05 : .32 * glow)], [1, rgba(GOLD.core, 0)]]); ctx.fillRect(-w, -h, w * 2, h * 2.2);
  const rs = prng(seed * 7 + 1); ctx.fillStyle = rgba(back ? P.night0 : GOLD.deep, .1);
  for (let i = 0; i < 140; i++) { const x = (rs() - .5) * w, y = rs() * h - h * .1; ctx.fillRect(x, y, 1.6, 1.6); }
  // heavy: warm earth weight at the bottom ("stays hard")
  const hv = clamp(o.heavy ?? 0);
  if (hv > 0) { ctx.fillStyle = lin(ctx, 0, h * .9 - h * .32 * hv, 0, h * .9, [[0, rgba(EARTH.warm, 0)], [1, rgba(EARTH.top, .85 * hv)]]); ctx.fillRect(-w, h * .5, w * 2, h * .45); }
  ctx.restore();
  // edge light
  ctx.save(); ctx.strokeStyle = rgba(back ? GOLD.shade : GOLD.core, back ? .5 : .35 + .4 * glow); ctx.lineWidth = Math.max(1, w * .008);
  if (dust <= 0) ctx.stroke(shape);
  ctx.restore();
  // the eyelet (a hole: the night shows through) + its ring
  ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.arc(0, 0, w * .055, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.deep, .7); ctx.lineWidth = Math.max(1, w * .012); ctx.stroke();
  // the chimney of the house
  if (house > .05) { ctx.fillStyle = mixHex(c0, c1, .3); ctx.fillRect(w * .26, -h * .2 + (1 - house) * h * .2, w * .1, h * .22 * house); }
  return pts;
}
export function tag(ctx, t, x, y, w, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0 || w <= 0) return null;
  const h = o.h ?? w * TAG_K, rot = (o.rot ?? 0) + (o.swing ?? 0) + .012 * Math.sin(t * .7 + x * .013), glow = clamp(o.glow ?? 1);
  const split = clamp(o.split ?? 0), backU = clamp(o.back ?? 0), dust = clamp(o.dust ?? 0), seed = o.seed ?? Math.round(x * 7 + y);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  // the thread (up from the eyelet)
  const th = o.thread ?? 2400;
  if (th > 0) goldSpan(ctx, [[0, -w * .055], [0, -th]], 0, 1, { w: Math.max(1.2, w * .008), spark: false, a: .55 + .45 * glow });
  // the glow behind (the hero light): only when lit
  if (glow > 0 && backU < .5) halo(ctx, 0, h * .4, w * 1.25, .32 * glow * (1 - dust * .5), GOLD.halo, GOLD.core);
  const flip = Math.cos(Math.PI * backU), side = flip >= 0 ? 1 : -1;
  const drawFace = (cx) => {
    const pts = tagBody(cx, t, w, h, { ...o, glow, dust, seed }, side);
    if (side > 0) {   // the face: ink lines + price (centred), only on the front
      let yy = h * .26;
      for (const [i, ln] of (o.lines ?? []).entries()) {
        const [txt, size, g = 0, serif = false] = ln; yy += size * 1.12;
        E.glowText(cx, txt, 0, yy, { size, serif, weight: serif ? 400 : 700, align: 'center', spacing: serif ? 0 : .06, col: mixHex(PAPER.ink, GOLD.deep, g), glow: false, a: clamp((o.textU ?? 1) * 3 - i * .4) });
      }
      if (o.price) goldText(cx, [[o.price, 0]], 0, h * .8, o.priceSize ?? w * .2, o.priceU ?? 1, { serif: true, align: 'center', col: PAPER.ink });
    }
    return pts;
  };
  ctx.save(); ctx.scale(Math.max(.02, Math.abs(flip)) * side * side, 1);
  if (split <= 0) drawFace(ctx);
  else {   // the tear: a ragged vertical line; the right half stays, the left half drops and tilts
    const r = prng(seed + 5), tear = new Path2D(); tear.moveTo(0, -h); for (let i = 0; i <= 14; i++) tear.lineTo((r() - .5) * w * .06, -h * .1 + h * i / 14); tear.lineTo(0, h * 1.5);
    const R = new Path2D(tear); R.lineTo(w * 2, h * 1.5); R.lineTo(w * 2, -h); R.closePath();
    const Lp = new Path2D(tear); Lp.lineTo(-w * 2, h * 1.5); Lp.lineTo(-w * 2, -h); Lp.closePath();
    ctx.save(); ctx.clip(R); drawFace(ctx); ctx.restore();
    const k = expoOut(split); ctx.save(); ctx.translate(-w * .06 * k, h * .38 * k); ctx.rotate(-.12 * k); ctx.clip(Lp); drawFace(ctx); ctx.restore();
  }
  ctx.restore();
  // the dust: grains on the ragged front (the edge erodes), released grains stream down-left and keep streaming (never frozen)
  if (dust > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const n = Math.round(clamp(w * 3, 160, 1500)), sc = Math.max(.7, w / 240), front = 1 - dust;
    for (const [px, py, q, sp, sz] of dustPts(seed, n)) {
      const lx = px * w, ly = py * h, s = dustS(lx, ly, w, h); if (s <= front - .07) continue;
      let dx = 0, dy = 0, al;
      if (s <= front) al = .55 * (1 - (front - s) / .07);   // the eroding edge: grains still in place
      else {
        const rel = clamp((s - front) / .3), ph = (t * (.05 + .05 * sp) + q) % 1;
        dx = -(ph * .55 + rel * .25) * w - w * .08 * sp; dy = (ph * ph * .9 + ph * .25 + rel * .12) * h * .75;
        al = (1 - ph) * (.5 + .5 * q) * Math.min(1, .25 + rel * 2.5);
      }
      al *= Math.max(.45, glow); if (al <= .02) continue;
      ctx.fillStyle = rgba(q > .7 ? GOLD.core : q < .25 ? GOLD.mid : GOLD.body, al); const r = (1 + 2.6 * sz * sz) * sc;
      ctx.fillRect(lx + dx, ly + dy, r, r);
    }
    ctx.restore();
  }
  ctx.restore();
  return { x, y, w, h, rot, face: { x: x - w / 2, y: y - h * .1, w, h: h } };
}

// ======================================================================================================================== THE RECEIPT
// a glowing paper ribbon from the roll (o.from) to the hand (o.to), bent like thumbnail C; o.u unrolls it (the free end travels from the roll
// to the hand along the curve). Gray print bars along it; o.rows [[label, u]] are written near the end (dark ink) with a gold ↑ each.
export function receipt(ctx, t, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const [x0, y0] = o.from, [x1, y1] = o.to, w = o.w ?? 240, bend = o.bend ?? 1;
  const c1 = [x0 - 60 * bend, y0 + (y1 - y0) * .45], c2 = [x1 + (x0 - x1) * .6 + 180 * bend, y1 - (y1 - y0) * .25];
  const at = (s) => { const m = 1 - s; return [m * m * m * x0 + 3 * m * m * s * c1[0] + 3 * m * s * s * c2[0] + s * s * s * x1, m * m * m * y0 + 3 * m * m * s * c1[1] + 3 * m * s * s * c2[1] + s * s * s * y1]; };
  const N = 60, pts = []; for (let i = 0; i <= N; i++) pts.push(at(u * i / N));
  const nrm = (i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
  ctx.save();
  halo(ctx, lerp(x0, x1, .55), lerp(y0, y1, .5), Math.hypot(x1 - x0, y1 - y0) * .55 * u, .22, PAPER.lit, P.cream);
  // the ribbon (quads, a slight twist: width breathes along the curve)
  for (let i = 0; i < N; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], na = nrm(i), nb = nrm(i + 1);
    const wa = w * (.82 + .18 * Math.cos(i * .11 + t * .4)) / 2, wb = w * (.82 + .18 * Math.cos((i + 1) * .11 + t * .4)) / 2;
    const lit = .75 + .25 * Math.cos(i * .11 + t * .4);
    ctx.fillStyle = mixHex(PAPER.shade, '#fffbe8', lit);
    ctx.beginPath(); ctx.moveTo(ax + na[0] * wa, ay + na[1] * wa); ctx.lineTo(bx + nb[0] * wb, by + nb[1] * wb); ctx.lineTo(bx - nb[0] * wb, by - nb[1] * wb); ctx.lineTo(ax - na[0] * wa, ay - na[1] * wa); ctx.closePath(); ctx.fill();
    // print bars (every 3rd quad), dim gray-gold
    if (i % 3 === 1 && i < N - 8) { const mx = (ax + bx) / 2, my = (ay + by) / 2, L = (wa + wb) * .55 * (.5 + .5 * ((i * 37) % 7) / 7); ctx.strokeStyle = rgba(PAPER.faint, .55); ctx.lineWidth = Math.max(2, w * .045); ctx.beginPath(); ctx.moveTo(mx - na[0] * L * .9, my - na[1] * L * .9); ctx.lineTo(mx + na[0] * L * .2, my + na[1] * L * .2); ctx.stroke(); }
  }
  // the roll at the top
  if ((o.roll ?? 1) > 0) { ctx.fillStyle = mixHex(PAPER.body, '#fffbe8', .6); ctx.beginPath(); ctx.ellipse(x0, y0, w * .55, w * .62, -.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = mixHex(PAPER.edge, P.night1, .4); ctx.beginPath(); ctx.ellipse(x0 + w * .12, y0, w * .14, w * .2, -.2, 0, Math.PI * 2); ctx.fill(); }
  // rows near the end: [label, u] (the label sits across the ribbon, an arrow lifts)
  const rows = o.rows ?? [];
  rows.forEach(([label, ru], k) => {
    ru = clamp(ru); if (ru <= 0) return;
    const i = Math.max(2, N - 7 - k * 8), [px, py] = pts[i], [nx, ny] = nrm(i), ang = Math.atan2(-ny, -nx);
    ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
    const tw = measure(label, 22, false, 700) + 22 * label.length * .06;
    E.glowText(ctx, label, -tw / 2 - 14, 9, { size: 22, weight: 700, spacing: .06, col: PAPER.ink, glow: false, a: clamp(ru * 3) });
    const lift = expoOut(ru) * 12; ctx.fillStyle = GOLD.deep;   // the ↑ (a drawn arrow, gold-ink)
    ctx.beginPath(); ctx.moveTo(tw / 2 + 4, 6 - lift); ctx.lineTo(tw / 2 + 18, -12 - lift); ctx.lineTo(tw / 2 + 32, 6 - lift); ctx.lineTo(tw / 2 + 22, 6 - lift); ctx.lineTo(tw / 2 + 22, 16 - lift); ctx.lineTo(tw / 2 + 14, 16 - lift); ctx.lineTo(tw / 2 + 14, 6 - lift); ctx.closePath(); ctx.globalAlpha *= clamp(ru * 2); ctx.fill();
    ctx.restore();
  });
  ctx.restore();
  return pts[N];
}

// ======================================================================================================================== THE PAY SLIP
export function paySlip(ctx, t, x, y, s, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0) return null;
  const w = s, h = s * .62, g = clamp(o.glow ?? 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? -.08);
  if (g > 0) halo(ctx, 0, 0, s * 1.1, .35 * g, GOLD.halo, GOLD.core);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-w / 2 + s * .03, -h / 2 + s * .04, w, h);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(PAPER.lit, GOLD.hot, .25 * g)], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = Math.max(1, s * .012); ctx.strokeRect(-w / 2, -h / 2, w, h);
  if (s >= 60) E.glowText(ctx, o.label ?? 'YOUR PAY', -w / 2 + w * .1, -h / 2 + h * .3, { size: Math.max(9, s * .13), weight: 700, spacing: .1, col: PAPER.ink, glow: false });
  ctx.fillStyle = rgba(PAPER.faint, .7); for (let i = 0; i < 3; i++) ctx.fillRect(-w / 2 + w * .1, -h / 2 + h * (.48 + i * .14), w * (.5 - i * .08), Math.max(1.5, h * .05));
  ctx.fillStyle = rgba(GOLD.deep, .9); ctx.fillRect(w / 2 - w * .32, -h / 2 + h * .74, w * .22, Math.max(2, h * .07));
  ctx.restore();
  return { x, y, w, h };
}

// ======================================================================================================================== THE DOLLAR BAR
// one dollar = 100 %: a long bar split into parts that fill from the left one by one (each seg has its own u). Labels under each part.
export function dollarBar(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const h = o.h ?? 70, frame = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  if (o.title) maskLine(ctx, [[o.title, 0]], x, y - 30, 24, rise(u), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w * frame, h, 10); ctx.stroke();
  let xx = x;
  for (const s of o.segs ?? []) {
    const su = clamp(s.u ?? 1), sw = w * s.share;
    if (su > 0) {
      const fw = sw * expoOut(su);
      ctx.fillStyle = lin(ctx, xx, y, xx + sw, y, [[0, mixHex(s.col, P.night1, .25)], [1, s.col]]); ctx.beginPath(); ctx.roundRect(xx + 3, y + 3, Math.max(0, fw - 6), h - 6, 8); ctx.fill();
      if (s.big) goldText(ctx, [[s.big, s.gold ?? 0]], xx + 14, y + h + 66, 54, rise(span(su, .2, 1)), { serif: true, col: s.textCol ?? P.cream });
      maskLine(ctx, [[s.label, 0]], xx + 16, y + h + (s.big ? 102 : 40), 22, rise(span(su, .3, 1)), { serif: false, weight: 600, col: s.textCol ?? P.cream, glow: false });
    }
    xx += sw;
  }
  ctx.restore();
  return { x, y, w, h };
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

// ======================================================================================================================== THE SEVEN TAGS (the clock)
// Screen space, top left (x 64–520, y 40–~225): a gold rail, seven small tags 1…7 hanging from it. Each changes when its station decides
// (phrases below; never animate by hand): fall (drops + crumbles), split (tears), slow (drops, bumps back up a little), up (rises a little),
// part (drops part of the way), hard (rises, earth weight), open (the 7th: face down until "It's your wage", then it swings, no verdict).
// The current station's name (and after the verdict its verdict) is written under the rail (22 px). Hidden during clips.
export const BOARD = {
  on: 'Six price tags', seventh: 'Then a seventh',
  tags: [
    { name: 'KNOWLEDGE & ADVICE', at: 'Knowledge and advice', verdict: 'FALLS FIRST', v: "So that's what gets cheap first", kind: 'fall' },
    { name: 'EDUCATION', at: "Education. It's on his list", verdict: 'KNOWLEDGE YES · DIPLOMA NO', v: 'So the second tag splits', kind: 'split' },
    { name: 'THINGS FROM FACTORIES', at: 'What about things you can drop', verdict: 'FALLS SLOWLY', v: 'So the third tag does fall', kind: 'slow' },
    { name: 'ENERGY', at: 'Energy', verdict: 'STAYS UP · FOR NOW', v: 'For now, the fourth tag', kind: 'up' },
    { name: 'FOOD', at: 'Food. Remember', verdict: 'WORK OUT · GROUND STAYS', v: 'So the fifth tag can fall', kind: 'part' },
    { name: 'HOUSING & LAND', at: 'Housing. The first word', verdict: 'STAYS HARD', v: 'So the sixth tag stays hard', kind: 'hard' },
    { name: 'YOUR WAGE', at: "It's your wage", verdict: 'OPEN', v: "What's still open", kind: 'open' },
  ],
};
const BT = new WeakMap();
export function boardTimes(T) {
  if (BT.has(T)) return BT.get(T);
  const on = T.G(BOARD.on), seventh = T.G(BOARD.seventh, 0, on);
  const at = [], v = []; let prev = on;
  for (const s of BOARD.tags) { const a = T.G(s.at, 0, prev); at.push(a); v.push(T.G(s.v, 0, a)); prev = a; }
  const r = { on, seventh, at, v, clips: ['C2', 'C3', 'C4'].map((id) => T.clip(id)).filter(Boolean) }; BT.set(T, r); return r;
}
// per tag: { dy (px, + = down), dust, split, back, glow, heavy, swing } and the label state
export function boardState(T, t) {
  const b = boardTimes(T), tags = [];
  let cur = -1; for (let i = 0; i < 7; i++) if (t >= b.at[i] - .3) cur = i;
  for (let i = 0; i < 7; i++) {
    const k = BOARD.tags[i].kind, d = span(t, b.v[i] - .1, b.v[i] + 1.6), e = sineIO(d), active = i === cur;
    const s = { dy: 0, dust: 0, split: 0, back: 0, glow: .35, heavy: 0, swing: 0, drop: span(t, b.on + .25 + i * .16, b.on + 1.3 + i * .16) };
    if (i === 6) { s.drop = span(t, b.seventh - .1, b.seventh + 1.1); s.back = 1 - sineIO(span(t, b.at[6] - .2, b.at[6] + 1.2)); }
    if (k === 'fall') { s.dy = 30 * e; s.dust = .55 * e; }
    if (k === 'split') s.split = .85 * e;
    if (k === 'slow') s.dy = 26 * sineIO(span(d, 0, .7)) - 8 * sineIO(span(d, .7, 1));
    if (k === 'up') s.dy = -10 * e;
    if (k === 'part') s.dy = 15 * e;
    if (k === 'hard') { s.dy = -14 * e; s.heavy = e; }
    if (k === 'open') s.swing = .18 * span(t, b.at[6], b.at[6] + 1) * Math.sin(t * 1.7);
    s.glow = active ? lerp(.35, 1, span(t, b.at[i] - .3, b.at[i] + .6)) : (i < cur ? .5 : .3);
    tags.push(s);
  }
  const clipHide = b.clips.reduce((m, c) => Math.max(m, span(t, c.start - 1.2, c.start - .4) * (1 - span(t, c.end + .2, c.end + 1))), 0);
  return { tags, cur, on: smooth(span(t, b.on - .3, b.on + .9)) * (1 - clipHide), name: cur >= 0 ? span(t, b.at[cur] - .3, b.at[cur] + .6) : 0,
    verdict: cur >= 0 && cur < 6 ? span(t, b.v[cur], b.v[cur] + .9) : 0, b };
}
export function board(ctx, t, T, o = {}) {
  const S = boardState(T, t), a = (o.a ?? 1) * S.on; if (a <= 0) return;
  const big = sineIO(clamp(o.big ?? 0)), sc = lerp(1, 2.7, big), x0 = lerp(64, W / 2 - 230 * 2.7, big), y0 = lerp(40, 150, big);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x0, y0); ctx.scale(sc, sc); ctx.globalAlpha *= a;
  const gap = 66, rail = 12, tw = 40;
  goldSpan(ctx, [[0, rail], [gap * 6 + 52, rail]], 0, smooth(span(t, S.b.on - .3, S.b.on + .9)), { w: 1.2, spark: false });
  for (let i = 0; i < 7; i++) {
    const s = S.tags[i]; if (s.drop <= 0) continue;
    const ex = 26 + gap * i, ey = rail + 22 + s.dy - (1 - expoOut(s.drop)) * 40;
    ctx.save(); ctx.beginPath(); ctx.rect(ex - 60, rail, 120, 400); ctx.clip();   // the tags come down out of the rail (never from nowhere)
    const hi = o.lit === i ? 1 : 0;
    tag(ctx, t, ex, ey, tw, { thread: ey - rail, glow: Math.max(s.glow, hi), dust: s.dust, split: s.split, back: s.back, heavy: s.heavy, swing: s.swing, seed: 70 + i,
      lines: [[String(i + 1), 24, 0, true]], textU: 1 });
    ctx.restore();
  }
  if (S.cur >= 0 && big < .5) {
    const s = BOARD.tags[S.cur];
    goldText(ctx, [[s.name, .9]], 0, 162, 22, rise(S.name), { serif: false, weight: 700, spacing: .06 });
    if (S.verdict > 0) goldText(ctx, [[s.verdict, 1]], 0, 194, 22, rise(S.verdict), { serif: false, weight: 700, spacing: .06, col: GOLD.text });
  }
  ctx.restore();
}

// ======================================================================================================================== SOURCES (on screen, y ≤ 880)
// From <ROOT>text-v3.md EINBLENDUNG lines (fact-checked, 20.11.; faktencheck.md MB1–MB3 applied: MB3 the data-centre cost split is OUT). The fact check writes text-v3.md: its EINBLENDUNG lines WIN — update here (lead) or say
// in your report which string you took from text-v3. Use F.source(ctx, t, t0, t1, F.SOURCES.x) for source lines (y 890).
export const SOURCES = {
  promise: '“Everything necessary will be cheap …”',
  promiseCredit: 'SAM ALTMAN, “MOORE’S LAW FOR EVERYTHING”',
  promiseFull: '“… everything necessary will be cheap, and everyone will have enough money to be able to afford it.”',
  promiseFullCredit: 'SAM ALTMAN, “MOORE’S LAW FOR EVERYTHING”, MARCH 16, 2021',
  programmerTag: ['A TOP', 'PROGRAMMER’S WEEK'], programmerPrice: '< $1',
  fed: '“a very high-end programmer 20 hours, 40 hours” → “less than a dollar’s worth of compute tokens”',
  fedSrc: 'SAM ALTMAN AT THE FEDERAL RESERVE, JULY 22, 2025 · HIS ESTIMATE',
  tenX: '“The cost to use a given level of AI falls about 10x every 12 months”',
  tenXSrc: 'SAM ALTMAN, FEB 2025 · EPOCH AI, SEPT 2026: ≈ 13× PER YEAR SINCE 2023',
  foodDollar: 'OF EVERY FOOD DOLLAR', foodLabor: '54¢ LABOR', foodFarm: '12¢ FARM',
  foodSrc: 'USDA ERS, FOOD DOLLAR (2024 DATA, UPDATED MARCH 2026)',
  robotHouse: '“… the cost of building that house is close to the cost to rent the robots.”', robotHouseSrc: 'SAM ALTMAN, “MOORE’S LAW FOR EVERYTHING”',
  testQ: 'HOW MUCH OF THIS PRICE IS WORK?',
  translators: '30 % REPORT FEWER ASSIGNMENTS OR CLIENTS BECAUSE OF AI', translatorsSrc: 'CEATL SURVEY 2026 · 1,785 LITERARY TRANSLATORS',
  legal: '≈ 90 % OF LEGAL SPEND STILL BILLED BY THE HOUR', legalSrc: 'THOMSON REUTERS INSTITUTE, 2026 STATE OF THE US LEGAL MARKET',
  tutor: 'MORE THAN DOUBLE THE LEARNING GAINS', tutorSrc: 'HARVARD PHYSICS COURSE · SCIENTIFIC REPORTS, 2025 · 19 UNIVERSITIES, 7,200 STUDENTS (PREPRINT, NOV 2026)',
  tuition: 'PUBLIC FOUR-YEAR, IN-STATE TUITION', tuitionBig: '$12,290 · +2.9 %', tuitionSrc: 'COLLEGE BOARD, NOV 5, 2026 (PUBLISHED PRICE)',
  robots: '5,079,078', robotsLabel: 'INDUSTRIAL ROBOTS IN OPERATION', robotsSrc: 'INTERNATIONAL FEDERATION OF ROBOTICS, SEPT 2026',
  phones: 'SMARTPHONES −51 % IN FIVE YEARS', phonesSrc: 'U.S. BLS, NOV 19, 2026 · CONSUMER PRICE INDEX, QUALITY-ADJUSTED',
  phones26: 'FORECAST 2026, AVERAGE SMARTPHONE PRICE WORLDWIDE', phones26Big: '+27.6 % TO $581', phones26Src: 'IDC, AUG 2026',   // faktencheck MB2 (text-v3)
  gentle: '“As datacenter production gets automated, the cost of intelligence should eventually converge to near the cost of electricity.”',
  gentleSrc: 'SAM ALTMAN, “THE GENTLE SINGULARITY”, JUNE 2025',
  energy: 'ENERGY +33 % IN FIVE YEARS', energySrc: 'U.S. BLS, NOV 19, 2026',
  cropland: 'U.S. CROPLAND: $6,020 AN ACRE', croplandSub: 'FIRST TIME ABOVE $6,000', croplandSrc: 'USDA, JULY 31, 2026',
  landQuote: '“If robots can build a house on land you already own …”', landQuoteSrc: 'SAM ALTMAN, “MOORE’S LAW FOR EVERYTHING”',
  land40: 'LAND ≈ 40 % OF U.S. HOME VALUE', land40Src: 'FHFA ESTIMATE (2022)',
  scarce: '“… the price of luxury goods and a few inherently limited resources like land may rise even more dramatically.”',
  scarceSrc: 'SAM ALTMAN, “THREE OBSERVATIONS”, FEB 2025',
  notAdvice: 'NOT FINANCIAL ADVICE',
  labor: 'Q3 2026: OUTPUT +3.7 % · HOURS +0.1 %', laborBig: 'LABOR SHARE 53.0 %', laborSub: 'LOWEST SINCE 1947', laborSrc: 'U.S. BLS, NOV 5, 2026 (PRELIMINARY)',
  worse: '“If public policy doesn’t adapt accordingly, most people will end up worse off than they are today.”', worseSrc: 'SAM ALTMAN, “MOORE’S LAW FOR EVERYTHING”',
  fund: 'AMERICAN EQUITY FUND (2021): 2.5 % OF LARGE COMPANIES’ VALUE, PAID IN SHARES · 2.5 % OF LAND VALUE', fundSrc: 'MOORE’S LAW FOR EVERYTHING · OPENAI, APRIL 2026: “PUBLIC WEALTH FUND”',
  alaska: 'ALASKA 2026: $1,200 PER RESIDENT', alaskaSub: '$1,000 DIVIDEND + $200 ENERGY RELIEF', alaskaSrc: 'PFD.ALASKA.GOV · ALTMAN’S ESTIMATE (2021): ≈ $13,500 A YEAR PER ADULT',
  alaskaPol: '2022: $3,284 · 2026: $1,200', alaskaPolSub: 'AMOUNT SET BY THE LEGISLATURE EACH YEAR',
  check: 'OPENRESEARCH STUDY · 1,000 PEOPLE · $1,000 A MONTH · 2020–2023', checkSub: '1.3 FEWER WORKING HOURS A WEEK',
  answers: ['CASH STUDY', '2021 FUND OF SHARES AND LAND', '2024 “UNIVERSAL BASIC COMPUTE”', '2026 PUBLIC WEALTH FUND'],
  core1: 'YOUR WAGE IS A PRICE TOO.',
};

// ======================================================================================================================== TAGS, VEIL, FLOAT
// a paper tag on a gold thread: (x, y) = where the thread is tied (top); o.len thread length; swing in on u
export function priceTag(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 30, len = (o.len ?? 120) * expoOut(u), lines = Array.isArray(text) ? text : [text];
  const tw = Math.max(...lines.map((l) => measure(l, size, false, 600) + size * l.length * .1)), w = tw + size * 2.1, h = size * (1.25 + lines.length * 1.25);
  const sw = (o.swing ?? 0) + (1 - expoOut(u)) * .6 * Math.cos(u * 9) + .03 * Math.sin(t * 1.1 + x * .01);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw);
  goldSpan(ctx, [[0, 0], [0, len]], 0, 1, { w: 1.4, spark: false });
  ctx.translate(0, len); ctx.globalAlpha *= clamp(u * 4);
  const p = new Path2D(); p.moveTo(-w / 2, size * .55); p.lineTo(-size * .45, 0); p.lineTo(size * .45, 0); p.lineTo(w / 2, size * .55); p.lineTo(w / 2, h); p.lineTo(-w / 2, h); p.closePath();
  ctx.fillStyle = o.gold ? mixHex(GOLD.hot, PAPER.lit, .3) : lin(ctx, 0, 0, 0, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fill(p);
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.5; ctx.stroke(p);
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(0, size * .42, size * .13, 0, TAU); ctx.fill();
  lines.forEach((l, i) => E.glowText(ctx, l, 0, size * (1.55 + i * 1.25) + size * .3, { size, weight: 600, align: 'center', spacing: .1, col: PAPER.ink, glow: false, a: rise(span(u, .3 + i * .2, 1)) }));
  ctx.restore();
  return { x, y: y + len, w, h };
}
export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(0, 0, W, H); ctx.restore(); }
export const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .02 * k * Math.sin(t * .6 + 1), dx = E.drift(t * 2, 16 * k, 11), dy = E.drift(t * 2, 10 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };
// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The plate grows out of a thing in the world (o.from = { x, y, w, h } screen rect, e.g. the promise tag's face; or [cx, cy, r]) and goes back.
// Lower third (≥ 22 px): NAME (serif) · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE). Wording from <ROOT>clips-geprueft.json once it exists.
// Frames: <F66CLIPS or /tmp/claude-0/f66/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, from <ROOT>clips/Cn.mp4 trimmed to in/out of
// <ROOT>clips-geprueft.json; written by tools/f66_clips.py clips). Until the frames exist a placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIPS = {   // <ROOT>clips-geprueft.json (20.11.) · crop: the share of the frame kept around its centre (C2/C4 carry channel logos in the corners)
  C1: { name: 'Sam Altman', role: 'CEO, OpenAI', year: '2026', src: 'OpenAI Town Hall' },
  C2: { name: 'Elon Musk', role: 'CEO, Tesla & SpaceX', year: '2026', src: 'The Builders with Walter Isaacson', crop: .78 },
  C3: { name: 'Demis Hassabis', role: 'CEO, Google DeepMind', year: '2025', src: 'Lex Fridman Podcast' },
  C4: { name: 'Daron Acemoglu', role: 'Economist, MIT · Nobel Prize 2024', year: '2026', src: 'Radio Davos, World Economic Forum', crop: .68, cropDy: .07 },
};
const CLIPDIR = (process.env.F66CLIPS || '/tmp/claude-0/f66/clips/').replace(/\/?$/, '/');
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
  if (lu > 0) {   // the lower third ABOVE the plate (≥ 22 px): NAME · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE)
    const by = R.y - 40, nw = maskLine(ctx, [[info.name, 0]], R.x, by, 44, rise(lu), { glow: true });
    maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x + Math.max(nw?.w ?? 0, measure(info.name, 44, true)) + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
    goldText(ctx, [[`ORIGINAL FOOTAGE (${info.src.toUpperCase()})`, .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
  }
  ctx.restore();
  return { cx, cy, w, h };
}
