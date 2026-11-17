// Film 31 · "Superhuman AI Is Coming Next Year" (AI builds the next AI) · shared kit (owned by the lead; builders import, never edit —
// wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, the 2.5D card stage cam3/card/
// aim/camAt/camDrift, finish) + lib/f16_kit.mjs (rise, maskLine, measure, stamp) + lib/f54_kit.mjs (bracket, source) + the generic blocks
// of film 59's kit (docs/ref-59/f59_kit.mjs: camPath, goldText, cards, quote card, tags, veil, float, clip plates).
// World: docs/MOTION.md §2 (THE NIGHT FOUNDRY, lib/f31_world.mjs). Shots: docs/shots.md (phase 2).
//
//   THE MACHINE (the next AI = the ONE hero light): a circle, never a robot or a brain: plated outer ring, turning middle ring, the forge
//   iris. It is being ASSEMBLED (build 0..1); a blueprint shows the missing plates. machine(). The machine you use today = tone 'cool'.
//   THE BUILDERS (machine work): small circle-machines with one forge eye and an arm; they weld the next plate. builders().
//   THE LADDER (the anchor): five rungs CODE · EXPERIMENTS · LEADING RESEARCH · THE GOAL · THE BRAKE; forge = taken by the machine,
//   cream = held by people, half = shared, dashed cool = forecast. A small machine climbs it (marker). ladder() · ladderHUD() (top left,
//   drives itself from LADDER phrases) · ladderState().
//   THE NUMBERS: codeShare() (9 of 10 changes) · shareRing() (<1 % → 26 % led by the model) · swarm() (≈ 30,000 agents as a night town
//   + the monitor eye + flagged cases to a person) · eye() · gauge() (≈ 1.9×, range 1.5–2.8) · forecast() (AI 2027: the median band,
//   Kokotajlo's marker end 2028 → May 2027, Tao Lin's pin end 2027) · genChain() (machine builds machine, explainer).
//   EXPLAINERS (60–70 %): paper cards (quotes, fine print), night cards with forge edge (data), tags on forge threads, big serif numbers.
//   One statement per card, ≤ 6 words + 1 number.
//
// API (design px = screen px at the home camera; t in seconds; u = 0..1 growth):
//   colours: FORGE (THE accent: the machine's light, machine work, machine share; GOLD is an alias so the film-59 blocks work) ·
//            HUMAN (cream: held by people) · COOL (checking + forecast: the monitor, the evaluators, forecasts) · PAPER · INK · LAMP
//            · PRINT31 (finish) · bump(t, t0, d). The yellow coat (P.coat) = only you.
//   goldText(ctx, segs [[text, forge 0..1]…], x, y, size, u, o) · goldSpan(ctx, pts, u0, u1, o) (a forge thread) · goldLabel(ctx, x, y, l1, l2, u, o)
//   title(ctx, t, u, o { lines, out, sub, subU })  heavy condensed caps (thumbnail title)
//   machine(ctx, t, x, y, r, o { a, build, tone 'forge'|'cool', glow, think, spin }) → { next, r, rot }
//   builders(ctx, t, x, y, r, o { n, a, build, work, seed, r0 })
//   ladder(ctx, t, x, y, h, o { u, w, state[5], lit[5], marker, labels, tags[5], names, side, size, brake }) → { rungs, top }
//   ladderHUD(ctx, t, T, o) · LADDER · ladderState(T, t) · RUNGS
//   codeShare(ctx, t, x, y, w, o { u, p, n, v, big, sub }) · shareRing(ctx, t, x, y, r, o { u, v, v0, p, label, sub, note0 })
//   swarm(ctx, t, x, y, w, h, o { u, count, sub, eye, sweep, flag }) → { eye } · eye(ctx, t, x, y, r, o { open, look, a })
//   gauge(ctx, t, x, y, r, o { u, p, v, range, lo, hi, label, sub }) · forecast(ctx, t, x, y, w, o { u, y0, y1, now, band, bandU, bandLabel, title, marks, pins })
//   genChain(ctx, t, x, y, w, o { u, p, n, radii, labels })
//   paperCard · dataCard · quoteCard(ctx, t, T, o { text, spoken, after, mode 'hi', credit, head }) · priceTag (a tag on a forge thread)
//   veil(ctx, a) · float(ctx, t, k) · camPath(t, K) · bracket · source(ctx, t, t0, t1, text) · SOURCES
//   CLIP_RECT, CLIPS, clipWin, prepareClipFrames, clipPlate(ctx, t, T, id, o { from, morph, dark })   (ORIGINAL FOOTAGE)
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
export const { bracket, source } = F54;
// camPath(t, K, ref = 6000): a camera that glides THROUGH its keys [[t, cam], …] (monotone cubic in x, y and log distance to the card
// at depth ref). Film 31 flies past the workshop card (F0) into the foundry (Z 3800), so the reference is the machine's depth, not F0.
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

export const PRINT31 = { grain: 14, floor: 4, vig: .5 };
// colour code (docs/MOTION.md §4): FORGE = the machine (the next machine's core = the ONE hero light; machine work; the machine's share in
// every number) · HUMAN/cream = what people hold · COOL = checking and forecasting (the monitor eye, evaluators, forecasts) · the coat = you
export const FORGE = { core: '#fff6e2', hot: '#ffdca2', body: '#ffb24e', mid: '#f0902f', shade: '#b8611f', deep: '#6a2c10', halo: '#ff9838', line: '#ffc576', text: '#ffd9a8' };
export const GOLD = FORGE;   // alias: the film-59 blocks (goldText, goldSpan, cards, clip plate) draw their accent in FORGE
export const HUMAN = { core: P.cream, body: mixHex(P.cream, P.halo2, .4), line: mixHex(P.cream, P.halo2, .25), deep: mixHex(P.halo2, P.night1, .55) };
export const PAPER = { body: '#ece4c8', lit: '#f7f0d8', shade: '#cfc4a2', edge: '#a99d7c', ink: '#141a3c', faint: '#8a8166' };
export const COOL = { core: '#eef7ff', body: mixHex(P.cream, '#8fc8f0', .6), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#8fc8f0', .45), halo: '#6fa8e8', text: mixHex(P.cream, '#8fc8f0', .4) };
export const INK = { far: mixHex(P.ind0, P.blue0, .3), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, rim: mixHex(FORGE.line, P.blue1, .6) };
export const LAMP = { core: P.cream, body: mixHex(P.cream, P.halo2, .35), deep: mixHex(P.halo2, P.night1, .55) };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== TEXT IN FORGE LIGHT
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
// the thumbnail title: heavy condensed caps, cream with a warm glow, left; the small line under it. u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 72, y = o.y ?? 470, lines = o.lines ?? ['SUPERHUMAN AI', 'NEXT YEAR'], cond = o.cond ?? .7;
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
      xx += measure(wd + ' ', size, true); k++;
    }
  });
  if (o.credit) maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 34, 18, rise(span(u, .55, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  ctx.restore();
  return { ...box, h };
}

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

// ======================================================================================================================== THE MACHINE (the next AI)
// A machine is a CIRCLE (channel rule: never a robot or a brain): an outer ring of N plated segments, a turning middle ring with notches,
// and the iris core (the forge light). build 0..1 = how many outer segments are in place; the arriving segment slides in along a short arc.
// Missing segments show as a faint blueprint outline (the plan). tone 'forge' (the next machine: the ONE hero light) | 'cool' (the
// machine you use today: finished, calmer, paler light). Returns { next: [x, y] (where the next segment lands), r, rot }.
const SEG_N = 18;
export function machine(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= 0) return null;
  const build = clamp(o.build ?? 1), tone = o.tone ?? 'forge', cool = tone === 'cool', glow = (o.glow ?? 1) * (cool ? .55 : 1);
  const L = cool ? { core: mixHex(P.cream, P.blue2, .2), hot: mixHex(P.halo2, P.blue2, .3), body: mixHex(P.halo1, P.blue2, .45), mid: mixHex(P.shade1, P.blue1, .5), halo: mixHex(P.halo1, P.blue1, .5) } : FORGE;
  const rot = (o.rot ?? 0) + t * .02, br = 1 + .01 * Math.sin(t * .8);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  // the light around it: grows with the build (an unfinished machine already glows at its heart)
  halo(ctx, 0, 0, r * 2.2, .2 * glow * (.45 + .55 * build), L.halo, L.hot);
  // the frame plate behind the rings (a dark disc that separates the machine from the night)
  ctx.fillStyle = mixHex(P.night0, P.ind0, .55); ctx.beginPath(); ctx.arc(0, 0, r * 1.0, 0, TAU); ctx.fill();
  // blueprint of the outer ring (the plan): thin dashed cream circles
  ctx.save(); ctx.setLineDash([r * .03, r * .025]); ctx.lineDashOffset = -t * r * .02; ctx.strokeStyle = rgba(P.cream, .16 * (1 - build * .6)); ctx.lineWidth = Math.max(1, r * .006);
  for (const rr of [r * .86, r * 1.0]) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.stroke(); }
  ctx.restore();
  // the outer segments
  const nb = build * SEG_N, gapA = .022;
  let next = null;
  for (let i = 0; i < SEG_N; i++) {
    const f = clamp(nb - i); const a0 = rot - Math.PI / 2 + i / SEG_N * TAU + gapA, a1 = a0 + TAU / SEG_N - gapA * 2;
    if (f <= 0) { if (!next) { const am = (a0 + a1) / 2; next = [x + Math.cos(am) * r * .93, y + Math.sin(am) * r * .93]; } continue; }
    const k = expoOut(f), off = (1 - k) * r * .38, sw = (1 - k) * .25;   // slides in from outside along a short arc
    const b0 = a0 - sw, b1 = a1 - sw, r0 = r * .86 + off, r1 = r * 1.0 + off;
    ctx.save(); ctx.globalAlpha *= clamp(f * 4);
    ctx.fillStyle = lin(ctx, Math.cos(b0) * r0, Math.sin(b0) * r0, Math.cos(b1) * r1, Math.sin(b1) * r1, [[0, mixHex(P.night1, P.ind2, .9)], [1, mixHex(P.ind2, P.blue2, .5)]]);
    ctx.beginPath(); ctx.arc(0, 0, r1, b0, b1); ctx.arc(0, 0, r0, b1, b0, true); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(L.body, .75); ctx.lineWidth = Math.max(1, r * .008); ctx.beginPath(); ctx.arc(0, 0, r0 + r * .004, b0, b1); ctx.stroke();   // lit inner edge
    if (f < 1) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(L.core, .9 * (1 - f)); ctx.lineWidth = r * .02; ctx.stroke(); }
    ctx.restore();
  }
  // the middle ring (turns the other way; notches)
  const mr = r * .7, mrot = -t * .05 + (o.spin ?? 0);
  ctx.strokeStyle = mixHex(P.ind2, P.blue2, .45); ctx.lineWidth = r * .07; ctx.beginPath(); ctx.arc(0, 0, mr, 0, TAU); ctx.stroke();
  ctx.strokeStyle = rgba(L.body, .55); ctx.lineWidth = r * .012;
  for (let k = 0; k < 24; k++) { const an = mrot + k / 24 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(an) * (mr - r * .03), Math.sin(an) * (mr - r * .03)); ctx.lineTo(Math.cos(an) * (mr + r * .03), Math.sin(an) * (mr + r * .03)); ctx.stroke(); }
  // the iris core: the forge light (pulses inward when it "thinks")
  const cr = r * .5 * br, th = o.think ?? .5 + .5 * Math.sin(t * .7);
  ctx.fillStyle = rad(ctx, 0, 0, cr, [[0, L.core], [.35, L.hot], [.78, L.body], [1, L.mid]]); ctx.beginPath(); ctx.arc(0, 0, cr, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(L.core, .35); ctx.lineWidth = Math.max(1, r * .006);
  for (let k = 0; k < 3; k++) { const q = (th + k / 3) % 1, rr = cr * (1 - q * .8); ctx.globalAlpha = a * .5 * Math.sin(Math.PI * q); ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.stroke(); }
  ctx.globalAlpha = a;
  ctx.strokeStyle = rgba(L.mid, .45); ctx.lineWidth = Math.max(1, r * .005);
  for (let k = 0; k < 36; k++) { const an = rot * 2 + k / 36 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(an) * cr * .3, Math.sin(an) * cr * .3); ctx.lineTo(Math.cos(an + .08) * cr * .62, Math.sin(an + .08) * cr * .62); ctx.stroke(); }
  ctx.fillStyle = rgba(mixHex(P.night0, L.mid, .25), .9); ctx.beginPath(); ctx.arc(0, 0, cr * .2, 0, TAU); ctx.fill();   // the pupil
  ctx.restore();
  return { next: next ?? [x, y - r * .93], r, rot };
}
// the builders: small machines (a dark body, one forge eye, a short arm) that circle the ring and weld the next segment. Each one is a
// tiny circle too. o: { n, a, build (they gather where the next segment lands), work 0..1 (sparks), seed, r0 (orbit radius, × r) }
export function builders(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1, n = o.n ?? 7; if (a <= 0 || n <= 0) return;
  const rnd = prng(o.seed ?? 31), rot = t * .02, nb = clamp(o.build ?? 1) * SEG_N, iNext = Math.min(SEG_N - 1, Math.floor(nb));
  const target = rot - Math.PI / 2 + (iNext + .5) / SEG_N * TAU, work = o.work ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < n; k++) {
    const ph = rnd() * TAU, sp = .08 + rnd() * .1, rr = r * ((o.r0 ?? 1.16) + rnd() * .2), bob = Math.sin(t * (1.1 + rnd()) + ph) * r * .015, s0 = r * .058;
    // half of them gather round the next segment, the rest roam
    const gather = k % 2 === 0 && nb < SEG_N ? 1 : 0, an = gather ? target + (k / n - .5) * .5 + .05 * Math.sin(t * .9 + ph) : ph + t * sp;
    const bx = x + Math.cos(an) * rr, by = y + Math.sin(an) * rr + bob, s = s0;
    // the arm (to the ring)
    const tx = x + Math.cos(an) * r * 1.0, ty = y + Math.sin(an) * r * 1.0;
    ctx.strokeStyle = mixHex(P.ind2, P.blue2, .6); ctx.lineWidth = s * .35; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(lerp(bx, tx, .8), lerp(by, ty, .8)); ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.arc(bx, by, s, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(FORGE.line, .35); ctx.lineWidth = Math.max(1, s * .12); ctx.stroke();
    halo(ctx, bx, by, s * 2.2, .35, FORGE.halo, FORGE.hot); ctx.fillStyle = FORGE.hot; ctx.beginPath(); ctx.arc(bx, by, s * .32, 0, TAU); ctx.fill();
    // sparks at the arm's tip while it welds (deterministic flicker)
    const fl = work * clamp(Math.sin(t * 7.3 + ph * 3) * 1.4 + .2);
    if (fl > 0 && gather) {
      const sx = lerp(bx, tx, .8), sy = lerp(by, ty, .8); halo(ctx, sx, sy, s * 2.4, .7 * fl, FORGE.halo, FORGE.core);
      for (let q = 0; q < 5; q++) { const qa = ph * 7 + q * 1.3 + t * 3, qd = ((t * 2.3 + q * .21 + k * .13) % 1) * s * 3;
        ctx.fillStyle = rgba(FORGE.hot, fl * (1 - qd / (s * 3))); ctx.fillRect(sx + Math.cos(qa) * qd, sy + Math.sin(qa) * qd + qd * qd / (s * 6), Math.max(1.2, s * .14), Math.max(1.2, s * .14)); }
    }
  }
  ctx.restore();
}

// ======================================================================================================================== THE LADDER (the anchor)
// Five rungs between today and the machine that does the research itself. (x, y) = the foot (centre between the rails), h = height.
// state[k] per rung: 0 = held by people (cream, a warm lamp glow), 1 = taken by the machine (forge), .5 = shared (forge fills from the
// left to half), 'f' = forecast (dashed cool outline, "taken next year"). o: { u (the ladder rises), w, state, lit [0..1 ×5] (each rung's
// own change animation), marker (0 = ground … 5 = top rung; the climbing machine), labels 0..1, tags [text ×5] (TAKEN / SHARED …),
// names, side 'right'|'left', size }. Rung 5 carries a small lever (the brake), rung 4 a small flag (the goal).
export const RUNGS = ['CODE', 'EXPERIMENTS', 'LEADING RESEARCH', 'THE GOAL', 'THE BRAKE'];
export function ladder(ctx, t, x, y, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const w = o.w ?? h * .2, st = o.state ?? [0, 0, 0, 0, 0], lit = o.lit ?? [1, 1, 1, 1, 1], names = o.names ?? RUNGS;
  const rail = Math.max(3, h * .012), ry = (k) => y - h * (k + 1) / 6, hk = expoOut(u);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  // the rails rise from the floor (mask), with a lit inner edge
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - h * 1.02 * hk - 10, w * 2, h * 1.02 * hk + 12); ctx.clip();
  for (const sx of [-1, 1]) {
    const x0 = x + sx * w / 2, x1 = x + sx * w * .42;
    ctx.fillStyle = mixHex(P.ind2, P.blue2, .55); ctx.beginPath(); ctx.moveTo(x0 - rail / 2, y); ctx.lineTo(x1 - rail / 2, y - h); ctx.lineTo(x1 + rail / 2, y - h); ctx.lineTo(x0 + rail / 2, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.cream, .3); ctx.beginPath(); ctx.moveTo(x0 - sx * rail / 2, y); ctx.lineTo(x1 - sx * rail / 2, y - h); ctx.lineTo(x1 - sx * rail * .1, y - h); ctx.lineTo(x0 - sx * rail * .1, y); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  const out = [];
  for (let k = 0; k < 5; k++) {
    const ru = clamp((u - .25 - k * .1) * 4); if (ru <= 0) { out.push(null); continue; }
    const yy = ry(k), half = lerp(w / 2, w * .42, (k + 1) / 6) - rail * .2, x0 = x - half, x1 = x + half, th = Math.max(4, h * .018), s = st[k], li = clamp(lit[k] ?? 1);
    const fc = s === 'f';
    // base (empty) rung
    ctx.fillStyle = mixHex(P.ind2, P.blue2, .5); ctx.fillRect(x0, yy - th / 2, (x1 - x0) * expoOut(ru), th);
    if (fc) {   // forecast: a dashed cool outline over the rung
      ctx.save(); ctx.setLineDash([th * 1.2, th * .8]); ctx.lineDashOffset = -t * 10; ctx.strokeStyle = rgba(COOL.line, .9 * li); ctx.lineWidth = 2; ctx.strokeRect(x0 - 3, yy - th / 2 - 3, (x1 - x0) + 6, th + 6); ctx.restore();
    } else if (typeof s === 'number') {
      const m = s * li, mw = (x1 - x0) * m;
      if (s < 1 || li < 1) {   // the human part: cream with a warm glow
        ctx.fillStyle = mixHex(P.halo2, P.cream, .6); ctx.fillRect(x0 + mw, yy - th / 2, (x1 - x0 - mw) * expoOut(ru), th);
      }
      if (mw > 0) {   // the machine part: forge light
        ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, FORGE.hot], [1, FORGE.body]]); ctx.fillRect(x0, yy - th / 2, mw, th);
        halo(ctx, x0 + mw / 2, yy, Math.max(mw * .6, th * 3), .22 * clamp(m * 2), FORGE.halo, FORGE.hot);
        if (li < 1) halo(ctx, x0 + mw, yy, th * 3, .7, FORGE.halo, FORGE.core);   // the leading edge glows while it fills
      }
    }
    // glyphs: rung 4 a small flag (the goal), rung 5 a lever (the brake)
    const gc = typeof s === 'number' && s >= 1 ? FORGE.body : mixHex(P.halo2, P.cream, .6);
    if (k === 3) { ctx.fillStyle = gc; ctx.fillRect(x1 + th * .4, yy - th * 4.2, th * .45, th * 4.2); ctx.beginPath(); ctx.moveTo(x1 + th * .85, yy - th * 4.2); ctx.lineTo(x1 + th * 3.2, yy - th * 3.4); ctx.lineTo(x1 + th * .85, yy - th * 2.6); ctx.closePath(); ctx.fill(); }
    if (k === 4) { const la = -.5 + .04 * Math.sin(t * .6) + (o.brake ?? 0) * 1.0; ctx.save(); ctx.translate(x1 + th * .2, yy); ctx.rotate(la); ctx.fillStyle = gc; ctx.fillRect(-th * .25, -th * 4.4, th * .5, th * 4.4); ctx.beginPath(); ctx.arc(0, -th * 4.6, th * .9, 0, TAU); ctx.fill(); ctx.restore(); }
    out.push({ y: yy, x0, x1 });
    // labels (right): number + name, a tag line under it
    const lu = clamp(o.labels ?? 0) * ru; if (lu > 0) {
      const sz = o.size ?? Math.max(22, h * .036), lx = o.side === 'left' ? x0 - sz * 1.4 : x1 + sz * (k >= 3 ? 1.9 : 1.1), al = o.side === 'left' ? 'right' : 'left';
      const nc = fc ? COOL.text : typeof s === 'number' && s * li >= .5 ? FORGE.text : P.cream;
      ctx.save(); ctx.globalAlpha *= rise(lu);
      E.glowText(ctx, `${k + 1}  ${names[k]}`, lx, yy + sz * .35, { size: sz, weight: 600, spacing: .1, col: nc, glow: false, align: al });
      if (o.tags?.[k]) E.glowText(ctx, o.tags[k], lx, yy + sz * 1.35, { size: sz * .62, weight: 600, spacing: .16, col: fc ? COOL.text : P.halo2, glow: false, align: al });
      ctx.restore();
    }
  }
  // the marker: the climbing machine (a small circle with a forge eye) between the rails
  if (o.marker != null && o.marker >= 0) {
    const m = clamp(o.marker, 0, 5), my = m <= 0 ? y - h * .03 : lerp(ry(Math.floor(m) - 1 < 0 ? 0 : Math.floor(m) - 1), ry(Math.min(4, Math.ceil(m) - 1)), m - Math.floor(m)) - h * .045;
    const ms = Math.max(8, h * .03), bob = Math.sin(t * 2.1) * ms * .12;
    halo(ctx, x, my + bob, ms * 4, .45, FORGE.halo, FORGE.hot);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.arc(x, my + bob, ms, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(FORGE.line, .7); ctx.lineWidth = Math.max(1.5, ms * .14); ctx.stroke();
    ctx.fillStyle = FORGE.core; ctx.beginPath(); ctx.arc(x, my + bob, ms * .36, 0, TAU); ctx.fill();
  }
  ctx.restore();
  return { rungs: out, top: y - h };
}
// THE LADDER HUD (screen space, top left): a small ladder with the current rung and its name. It drives itself from LADDER phrases
// (never animate by hand); it sinks during clips and the subscribe calls. Phrases are vo-v3; phase 2 checks them against vo-v4.
export const LADDER = {
  on: 'Picture a ladder', off: 'This channel exists', on2: 'How fast?', off2: 'This channel exists',
  steps: [   // { at, rung (0-based), state (0 | .5 | 1 | 'f'), tag }
    { at: 'So the first step up the ladder', rung: 0, state: 1, tag: 'TAKEN' },
    { at: 'So the second rung', rung: 1, state: 1, tag: 'TAKEN (ON THE LABS\' WORD)' },
    { at: 'So, rung three', rung: 2, state: .5, tag: 'SHARED' },
    { at: "On the ladder, that's rung three", rung: 2, state: 'f', tag: 'FORECAST: TAKEN NEXT YEAR' },
    { at: 'Rung four', rung: 3, state: 0, tag: 'HUMAN' },
    { at: 'Rung five', rung: 4, state: 0, tag: 'HUMAN' },
  ],
};
const HT = new WeakMap();
const tryG = (T, p, nth = 0, after) => { try { return after != null ? T.G(p, nth, after) : T.G(p, nth); } catch { return Infinity; } };
function hudTimes(T) {
  if (HT.has(T)) return HT.get(T);
  const on = tryG(T, LADDER.on), off = tryG(T, LADDER.off), on2 = tryG(T, LADDER.on2), off2 = tryG(T, LADDER.off2, 1);
  const r = { on, off, on2, off2, st: LADDER.steps.map((s) => tryG(T, s.at)), clips: Object.values(T.clips ?? {}).filter((c) => !c.under) }; HT.set(T, r); return r;
}
export function ladderState(T, t) {
  const b = hudTimes(T), state = [0, 0, 0, 0, 0], lit = [1, 1, 1, 1, 1], tags = ['', '', '', '', '']; let cur = -1, ch = 0;
  LADDER.steps.forEach((s, i) => { if (t >= b.st[i] - .2) { const p = span(t, b.st[i] - .2, b.st[i] + 1.2); state[s.rung] = s.state; lit[s.rung] = p; tags[s.rung] = s.tag; cur = s.rung; ch = p; } });
  const clipHide = b.clips.reduce((m, c) => Math.max(m, span(t, c.start - 1.2, c.start - .4) * (1 - span(t, c.end + .2, c.end + 1))), 0);
  const on = Math.max(smooth(span(t, b.on - .3, b.on + .9)) * (1 - smooth(span(t, b.off - .2, b.off + .8))), smooth(span(t, b.on2 - .3, b.on2 + .9)) * (1 - smooth(span(t, b.off2 - .2, b.off2 + .8))));
  return { state, lit, tags, cur, ch, on: on * (1 - clipHide) };
}
export function ladderHUD(ctx, t, T, o = {}) {
  const S = ladderState(T, t), a = (o.a ?? 1) * S.on; if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  E.glowText(ctx, 'THE LADDER', 72, 56, { size: 17, weight: 600, spacing: .16, col: P.halo2, glow: false });
  ladder(ctx, t, 108, 290, 210, { w: 58, state: S.state, lit: S.lit, marker: o.marker });
  if (S.cur >= 0) {
    const nu = rise(S.ch), yy = 290 - 210 * (S.cur + 1) / 6;
    goldText(ctx, [[`${S.cur + 1}  ${RUNGS[S.cur]}`, S.state[S.cur] === 'f' ? 0 : typeof S.state[S.cur] === 'number' && S.state[S.cur] > 0 ? .9 : 0]], 158, yy + 8, 22, nu, { serif: false, weight: 600, spacing: .06 });
    maskLine(ctx, [[S.tags[S.cur], 0]], 158, yy + 32, 15, rise(span(S.ch, .3, 1)), { serif: false, weight: 600, col: S.state[S.cur] === 'f' ? COOL.text : P.halo2, glow: false });
  }
  ctx.restore();
}

// ======================================================================================================================== THE NUMBERS
// nine of ten changes: a row of n small change cards (a few code lines each); v of them light forge (written by the machine) one by one,
// the rest stay cream (people). A tiny glyph on each: a forge dot (machine) or a head (person). o: { u, p (fill progress 0..1), n 10, v 9,
// big ('9 OF 10'), sub } → box
export function codeShare(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const n = o.n ?? 10, v = o.v ?? 9, gap = w * .018, cw = (w - gap * (n - 1)) / n, ch = cw * 1.35, p = clamp(o.p ?? 1);
  const rnd = prng(o.seed ?? 9);
  for (let i = 0; i < n; i++) {
    const ui = rise(clamp(u * 1.8 - i * .07)); if (ui <= 0) continue;
    const cx = x + i * (cw + gap), cy = y + (1 - expoOut(ui)) * 30, mach = i < v, f = mach ? clamp(p * v * 1.15 - i) : 0;
    ctx.save(); ctx.globalAlpha *= clamp(ui * 3);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .6 + .3 * f); ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 8); ctx.fill();
    ctx.strokeStyle = mach ? rgba(mixHex(P.halo2, FORGE.body, f), .45 + .55 * f) : rgba(P.cream, .85); ctx.lineWidth = 2 + f; ctx.stroke();
    if (f > 0) halo(ctx, cx + cw / 2, cy + ch / 2, cw * .9, .12 * f, FORGE.halo, FORGE.hot);
    for (let l = 0; l < 6; l++) { const lw = (cw - 28) * (.35 + rnd() * .6), ind = (l % 3 === 1 ? 14 : 0);
      ctx.fillStyle = mach ? rgba(mixHex(P.halo2, FORGE.hot, f), .3 + .55 * f) : rgba(P.cream, .55); ctx.fillRect(cx + 14 + ind, cy + 22 + l * ch * .12, Math.min(lw, cw - 28 - ind), Math.max(3, ch * .035)); }
    // the glyph
    const gx = cx + cw / 2, gy = cy + ch * .86, gs = cw * .12;
    if (mach) { if (f > 0) halo(ctx, gx, gy, gs * 3, .5 * f, FORGE.halo, FORGE.hot); ctx.fillStyle = mixHex(P.halo2, FORGE.core, f); ctx.beginPath(); ctx.arc(gx, gy, gs * .7, 0, TAU); ctx.fill(); }
    else { ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(gx, gy - gs * .55, gs * .45, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(gx, gy + gs * .45, gs * .75, gs * .5, 0, Math.PI, 0); ctx.fill(); }
    ctx.restore();
  }
  if (o.big) goldText(ctx, [[o.big, 1]], x, y - 40, o.bigSize ?? 96, rise(span(u, .2, .8)), { serif: true });
  if (o.sub) maskLine(ctx, [[o.sub, 0]], x, y + ch + 52, 22, rise(span(u, .4, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  return { x, y, w, h: ch };
}
// a share ring (26 % of the research led by the model): the track, the forge arc from 12 o'clock, the number in the middle.
// o: { u, v (target share), v0 (start share), p (0..1 from v0 to v), label (under), sub, note0 ('FEB <1 %') }
export function shareRing(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const p = sineIO(clamp(o.p ?? 1)), v = lerp(o.v0 ?? 0, o.v ?? .26, p), k = expoOut(u), th = r * .16;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  ctx.strokeStyle = rgba(P.cream, .14); ctx.lineWidth = th; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * k); ctx.stroke();
  for (let q = 0; q < 4; q++) { const an = -Math.PI / 2 + q / 4 * TAU; ctx.strokeStyle = rgba(P.cream, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * (r + th * .7), y + Math.sin(an) * (r + th * .7)); ctx.lineTo(x + Math.cos(an) * (r + th * 1.1), y + Math.sin(an) * (r + th * 1.1)); ctx.stroke(); }
  if (v > 0) {
    const a1 = -Math.PI / 2 + TAU * Math.max(v, .004);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(FORGE.halo, .25); ctx.lineWidth = th * 1.9; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, a1); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = lin(ctx, x, y - r, x + r, y, [[0, FORGE.hot], [1, FORGE.body]]); ctx.lineWidth = th; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, a1); ctx.stroke();
    halo(ctx, x + Math.cos(a1) * r, y + Math.sin(a1) * r, th * 1.6, p < 1 ? .8 : .35, FORGE.halo, FORGE.core);
  }
  const txt = v < .01 ? '<1 %' : `${Math.round(v * 100)} %`;
  goldText(ctx, [[txt, 1]], x, y + r * .2, r * .62, rise(span(u, .2, .8)), { serif: true, align: 'center' });
  if (o.label) E.glowText(ctx, o.label, x, y + r + th + 52, { size: 24, weight: 600, spacing: .12, col: P.cream, glow: false, align: 'center', a: rise(span(u, .4, 1)) });
  if (o.sub) E.glowText(ctx, o.sub, x, y + r + th + 84, { size: 17, weight: 600, spacing: .14, col: P.halo2, glow: false, align: 'center', a: rise(span(u, .5, 1)) });
  if (o.note0) E.glowText(ctx, o.note0, x + 14, y - r - th - 18, { size: 17, weight: 600, spacing: .14, col: P.halo2, glow: false, a: rise(span(u, .5, 1)) });
  ctx.restore();
}
// THE MONITOR EYE (a machine watching the machines): an almond lid, cool iris rings, a pupil that looks round. COOL = checking.
export function eye(ctx, t, x, y, r, o = {}) {
  const op = clamp(o.open ?? 1), a = o.a ?? 1; if (a <= 0 || op <= 0) return;
  const lx = o.look?.[0] ?? .25 * Math.sin(t * .4), ly = o.look?.[1] ?? .1 * Math.sin(t * .27 + 1);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  halo(ctx, 0, 0, r * 2.2, .2 * op, COOL.halo, COOL.core);
  const lid = new Path2D(); lid.moveTo(-r * 1.6, 0); lid.quadraticCurveTo(0, -r * 1.25 * op, r * 1.6, 0); lid.quadraticCurveTo(0, r * 1.25 * op, -r * 1.6, 0); lid.closePath();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.fill(lid); ctx.strokeStyle = rgba(COOL.line, .85); ctx.lineWidth = Math.max(2, r * .05); ctx.stroke(lid);
  ctx.save(); ctx.clip(lid); const ix = lx * r * .5, iy = ly * r * .3;
  ctx.fillStyle = rad(ctx, ix, iy, r * .8, [[0, COOL.core], [.45, COOL.body], [1, COOL.deep]]); ctx.beginPath(); ctx.arc(ix, iy, r * .78, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(COOL.core, .4); ctx.lineWidth = Math.max(1, r * .02);
  for (let k = 0; k < 3; k++) { const q = (t * .25 + k / 3) % 1; ctx.globalAlpha = a * .6 * Math.sin(Math.PI * q); ctx.beginPath(); ctx.arc(ix, iy, r * .78 * (1 - q * .7), 0, TAU); ctx.stroke(); }
  ctx.globalAlpha = a; ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(ix, iy, r * .26, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(COOL.core, .8); ctx.beginPath(); ctx.arc(ix - r * .1, iy - r * .1, r * .07, 0, TAU); ctx.fill();
  ctx.restore(); ctx.restore();
}
// THE SWARM: ~30,000 agents at work as a small town at night (a grid of blocks, each window a working agent, a forge dot that blinks);
// the monitor eye above sweeps a cool cone over it; flagged cases (cream) leave the town and travel to a person (o.flag).
// o: { u, count 0..1 (the counter runs to 30,000), eye 0..1, sweep (cone angle offset), flag 0..1, big (counter text fn), seed } → { eye: [x, y] }
export function swarm(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const rnd = prng(o.seed ?? 3000), cols = 18, rows = 7, bw = w / cols, bh = h / rows;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  // the blocks (rise row by row from the back)
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const q = rnd(), q2 = rnd(); if (q < .08) continue;
    const ru = rise(clamp(u * 2.2 - (rows - j) * .07 - q2 * .2)); if (ru <= 0) continue;
    const persp = .62 + .38 * (j / (rows - 1)), bx = x + w / 2 + (i * bw - w / 2 + bw * .1) * persp, by = y + j * bh * (.75 + .25 * j / rows), ww = bw * .8 * persp, hh = bh * .55 * persp * (1 - (1 - expoOut(ru)) * .8);
    ctx.fillStyle = mixHex(P.ind2, P.blue2, .25 + .45 * j / rows); ctx.fillRect(bx, by + bh * .55 * persp - hh, ww, hh);
    ctx.fillStyle = rgba(P.cream, .12); ctx.fillRect(bx, by + bh * .55 * persp - hh, ww, 2);
    // 2 × 2 windows = agents
    for (let a2 = 0; a2 < 4; a2++) {
      const on = .55 + .45 * Math.sin(t * (1.3 + q * 2) + a2 * 1.7 + q2 * 20), wx = bx + ww * (.18 + (a2 % 2) * .42), wy = by + bh * .55 * persp - hh + hh * (.2 + (a2 >> 1) * .4);
      ctx.fillStyle = rgba(FORGE.hot, (.35 + .6 * on) * ru); ctx.fillRect(wx, wy, ww * .24, Math.max(3, hh * .22));
    }
  }
  // the counter
  if (o.count != null) {
    const c = Math.round(sineIO(clamp(o.count)) * 30000 / 10) * 10;
    goldText(ctx, [[`≈ ${c.toLocaleString('en-US')}`, 1]], x, y - 150, o.bigSize ?? 92, rise(span(u, .2, .8)), { serif: true });
    if (o.sub) maskLine(ctx, [[o.sub, 0]], x + 6, y - 112, 20, rise(span(u, .4, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  }
  // the monitor eye and its cone
  const ex = x + w * .62, ey = y - h * .42, eu = clamp(o.eye ?? 0);
  if (eu > 0) {
    const sw = o.sweep ?? Math.sin(t * .5) * .45, cl = h * 1.5, ca = .22;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, ex, ey, ex + Math.sin(sw) * cl, ey + Math.cos(sw) * cl, [[0, rgba(COOL.halo, .22 * eu)], [1, rgba(COOL.halo, 0)]]);
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.sin(sw - ca) * cl, ey + Math.cos(sw - ca) * cl); ctx.lineTo(ex + Math.sin(sw + ca) * cl, ey + Math.cos(sw + ca) * cl); ctx.closePath(); ctx.fill(); ctx.restore();
    eye(ctx, t, ex, ey, h * .2 * expoOut(eu), { open: eu });
  }
  // flagged cases travel to a person at the right (≈ 50 a week)
  const fu = clamp(o.flag ?? 0);
  if (fu > 0) {
    const px = x + w + 70, py = y + h * .55;
    E.person(ctx, px, py + h * .2, h * .32, { light: .6, dir: -1 });
    for (let k = 0; k < 5; k++) { const q = clamp(fu * 1.6 - k * .15), sx = x + w * (.2 + k * .15), sy = y + h * (.3 + (k % 2) * .25);
      if (q <= 0) continue; const e = sineIO(q), cx = lerp(sx, px, e), cy = lerp(sy, py - h * .1, e) - Math.sin(Math.PI * e) * h * .25;
      halo(ctx, cx, cy, 16, .6, COOL.halo, P.cream); ctx.fillStyle = P.cream; ctx.fillRect(cx - 4, cy - 4, 8, 8); }
  }
  ctx.restore();
  return { eye: [ex, ey] };
}
// THE SPEED GAUGE (≈ 1.9× faster than a year ago): a half dial 1× … 3×, the 95 % range as a band, the needle swings in (overshoot,
// settles). o: { u, p (needle progress), v 1.9, range [1.5, 2.8], lo 1, hi 3, label, sub }
export function gauge(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const lo = o.lo ?? 1, hi = o.hi ?? 3, ang = (v) => Math.PI + clamp((v - lo) / (hi - lo)) * Math.PI, k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  ctx.strokeStyle = rgba(P.cream, .16); ctx.lineWidth = r * .1; ctx.beginPath(); ctx.arc(x, y, r, Math.PI, Math.PI + Math.PI * k); ctx.stroke();
  if (o.range) { ctx.strokeStyle = rgba(FORGE.body, .28 * span(u, .4, 1)); ctx.lineWidth = r * .1; ctx.beginPath(); ctx.arc(x, y, r, ang(o.range[0]), ang(o.range[1])); ctx.stroke(); }
  for (let v = lo; v <= hi + 1e-6; v += .5) {
    const a = ang(v), big = Math.abs(v - Math.round(v)) < 1e-6;
    ctx.strokeStyle = rgba(P.cream, big ? .7 : .4); ctx.lineWidth = big ? 3 : 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8); ctx.lineTo(x + Math.cos(a) * r * (big ? .7 : .74), y + Math.sin(a) * r * (big ? .7 : .74)); ctx.stroke();
    if (big) E.glowText(ctx, `${v}×`, x + Math.cos(a) * r * .56, y + Math.sin(a) * r * .56 + 8, { size: r * .1, weight: 600, align: 'center', col: P.halo2, glow: false, a: span(u, .3, 1) });
  }
  // the needle: a damped swing to v
  const p = clamp(o.p ?? 1), sw = p >= 1 ? 0 : Math.sin(p * 9) * (1 - p) * .25, nv = lerp(lo, o.v ?? 1.9, clamp(sineIO(p) + sw * (p > .3 ? 1 : 0))) + .006 * Math.sin(t * 1.7);
  const na = ang(nv);
  ctx.strokeStyle = FORGE.hot; ctx.lineWidth = r * .03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(na) * r * .92, y + Math.sin(na) * r * .92); ctx.stroke();
  halo(ctx, x + Math.cos(na) * r * .92, y + Math.sin(na) * r * .92, r * .12, .7, FORGE.halo, FORGE.core);
  ctx.fillStyle = FORGE.body; ctx.beginPath(); ctx.arc(x, y, r * .06, 0, TAU); ctx.fill();
  goldText(ctx, [[`≈ ${(o.v ?? 1.9).toFixed(1)}×`, 1]], x, y + r * .38, r * .34, rise(span(u, .3, .9) * span(p, .5, 1)), { serif: true, align: 'center' });
  if (o.label) E.glowText(ctx, o.label, x, y + r * .56, { size: 22, weight: 600, spacing: .12, col: P.cream, glow: false, align: 'center', a: rise(span(u, .4, 1)) });
  if (o.sub) E.glowText(ctx, o.sub, x, y + r * .56 + 30, { size: 16, weight: 600, spacing: .14, col: P.halo2, glow: false, align: 'center', a: rise(span(u, .5, 1)) });
  ctx.restore();
}
// THE FORECAST TIMELINE (AI 2027): years y0 … y1 on a rail, a NOW tick, the median band (all six forecasters, cool = forecast), markers
// that slide (Kokotajlo: end 2028 → May 2027) and pins (Tao Lin: end 2027). o: { u, y0 2025, y1 2031, now, band [a, b], bandU 0..1, title,
// marks [{ from, to, p, label, sub, above }], pins [{ at, label, sub, u }] }
export function forecast(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const y0 = o.y0 ?? 2025, y1 = o.y1 ?? 2031, X = (v) => x + (v - y0) / (y1 - y0) * w, k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  if (o.title) goldText(ctx, [[o.title, 0]], x, y - 250, 28, rise(span(u, .1, .7)), { serif: false, weight: 600, spacing: .12 });
  // the median band
  const bu = clamp(o.bandU ?? 1) * span(u, .3, 1);
  if (o.band && bu > 0) {
    const a = X(o.band[0]), b = X(lerp(o.band[0], o.band[1], expoOut(bu)));
    ctx.fillStyle = rgba(COOL.halo, .2); ctx.fillRect(a, y - 70, b - a, 100); ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = 2; ctx.strokeRect(a, y - 70, b - a, 100);
    if (o.bandLabel) E.glowText(ctx, o.bandLabel, (a + X(o.band[1])) / 2, y - 82, { size: 16, weight: 600, spacing: .14, col: COOL.text, glow: false, align: 'center', a: rise(span(bu, .4, 1)) });
  }
  // the rail and the years
  ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * k, y); ctx.stroke();
  for (let v = Math.ceil(y0); v <= y1; v++) { const xx = X(v); if (xx > x + w * k + 1) break;
    ctx.fillStyle = rgba(P.cream, .7); ctx.fillRect(xx - 1, y - 10, 2, 20);
    E.glowText(ctx, String(v), xx, y + 46, { size: 26, serif: true, col: P.cream, glow: false, align: 'center', a: span(u, .2, .8) }); }
  if (o.now != null) { const xx = X(o.now); ctx.fillStyle = P.coat; ctx.beginPath(); ctx.moveTo(xx, y - 6); ctx.lineTo(xx - 9, y - 22); ctx.lineTo(xx + 9, y - 22); ctx.closePath(); ctx.fill();
    E.glowText(ctx, 'NOW', xx, y - 32, { size: 15, weight: 600, spacing: .16, col: P.coat, glow: false, align: 'center', a: span(u, .3, 1) }); }
  // sliding markers (a trail shows where it was)
  for (const m of o.marks ?? []) {
    const p = sineIO(clamp(m.p ?? 1)), v = lerp(m.from, m.to ?? m.from, p), xx = X(v), up = m.above !== false ? -1 : 1, my = y + up * 125;
    if (m.to != null && p > 0) { ctx.save(); ctx.setLineDash([6, 6]); ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(m.from), my); ctx.lineTo(xx, my); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(m.from), my, 8, 0, TAU); ctx.stroke(); }
    halo(ctx, xx, my, 30, .5, COOL.halo, COOL.core); ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(xx, my, 9, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(COOL.line, .7); ctx.fillRect(xx - 1, Math.min(my, y), 2, Math.abs(my - y));
    if (m.label) E.glowText(ctx, m.label, xx, my + up * 26 + (up < 0 ? 0 : 14), { size: 20, weight: 600, spacing: .1, col: P.cream, glow: false, align: 'center', a: rise(span(u, .4, 1)) });
    if (m.sub) E.glowText(ctx, m.sub, xx, my + up * 50 + (up < 0 ? 0 : 14), { size: 15, weight: 600, spacing: .14, col: P.halo2, glow: false, align: 'center', a: rise(span(u, .5, 1)) });
  }
  for (const pn of o.pins ?? []) {
    const pu = clamp(pn.u ?? 1); if (pu <= 0) continue; const xx = X(pn.at), py = y + 130 - (1 - expoOut(pu)) * 30;
    ctx.save(); ctx.globalAlpha *= clamp(pu * 3);
    ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(xx - 1, y + 12, 2, py - y - 30);
    ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(xx, y, 7, 0, TAU); ctx.fill();
    E.glowText(ctx, pn.label, xx, py, { size: 20, weight: 600, spacing: .1, col: P.cream, glow: false, align: 'center' });
    if (pn.sub) E.glowText(ctx, pn.sub, xx, py + 24, { size: 15, weight: 600, spacing: .14, col: P.halo2, glow: false, align: 'center' });
    ctx.restore();
  }
  ctx.restore();
}
// MACHINE BUILDS MACHINE (explainer): n machines left → right, each bigger; a forge thread from each one's core to the next, which is
// assembling. o: { u, p (how far the chain has built: 0..n-1), labels [..] } → centres
export function genChain(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const n = o.n ?? 3, p = o.p ?? n - 1, rs = o.radii ?? [70, 110, 165], out = [];
  let xx = x;
  for (let i = 0; i < n; i++) { const r = rs[i] ?? rs[rs.length - 1]; out.push([xx + r, y, r]); xx += r * 2 + (w - rs.slice(0, n).reduce((s, v) => s + v * 2, 0)) / Math.max(1, n - 1); }
  out.forEach(([cx, cy, r], i) => {
    const ui = rise(clamp(u * 2 - i * .25)); if (ui <= 0) return;
    const build = i < Math.floor(p) + 1 ? clamp(p - i + 1) : 0;
    machine(ctx, t, cx, cy, r * expoOut(ui), { build: i === 0 ? 1 : build, tone: i < n - 1 ? 'cool' : 'forge', glow: i === n - 1 ? 1 : .7, a: clamp(ui * 3) });
    if (i > 0 && build > 0) { const [px, py, pr] = out[i - 1]; goldSpan(ctx, [[px + pr * .5, py], [(px + cx) / 2, py - 40], [cx - r * 1.05, cy]], 0, clamp(build * 1.5), { w: 2.2 }); }
    if (o.labels?.[i]) E.glowText(ctx, o.labels[i], cx, cy + r + 56, { size: 20, weight: 600, spacing: .12, col: i === n - 1 ? FORGE.text : P.cream, glow: false, align: 'center', a: rise(span(ui, .3, 1)) });
  });
  return out;
}

// ======================================================================================================================== SOURCES (on screen, y ≤ 880)
// PROVISIONAL: text-v2 Einblendungen as far as vo-v3 keeps them. Phase 2 checks every line against vo-v4 [EINBLENDUNG] lines / the fact
// sheet (faktenzettel.md is the only fact source) before any builder uses them. Use F.source(ctx, t, t0, t1, F.SOURCES.x).
export const SOURCES = {
  code: '>90 % OF CODE CHANGES · "WITH HUMAN GUIDANCE" · ANTHROPIC, NOV 9, 2026',
  forecast6: 'ALL SIX FORECASTERS: SUPERHUMAN AI RESEARCHER IN 2027 · AI FUTURES PROJECT, NOV 10, 2026',
  agents: '≈30,000 AI AGENTS AT ONCE · RESEARCH & ENGINEERING · ANTHROPIC, SEPT 17, 2026',
  labReports: "SOURCE: ANTHROPIC'S OWN REPORTS (SEPT 17 AND NOV 9, 2026)",
  deepmind: 'GOOGLE DEEPMIND, OCT 2026',
  experiment: '"…MATCH OR OUTPERFORM SKILLED HUMANS AT EXECUTING A WELL-SPECIFIED EXPERIMENT." · ANTHROPIC, SEPT 2026',
  intern: 'OPENAI, SEPT 6, 2026 · NOT EXTERNALLY VERIFIED',
  led: 'RESEARCH "LED BY" THE MODEL: <1 % (FEB) → 26 % · ANTHROPIC\'S OWN ESTIMATE, SEPT 17, 2026',
  metr: '≈1.9× FASTER THAN BEFORE OCT 2025 (95 % RANGE: 1.5–2.8) · METR, NOV 5, 2026',
  metrShare: '≈80 % OF THE SPEED-UP ATTRIBUTED TO AI USE (THEIR GUESS) · HUMANS IN THE LOOP',
  redacted: 'METR, NOV 5, 2026',
  spend: 'IMAS & GARICANO: 1.91× THE PACE FOR 6.19× THE SPENDING',
  sixMedians: 'ALL SIX MEDIANS: MAY–NOV 2027 · AI FUTURES PROJECT, NOV 10, 2026',
  slowdown: '"…ASSUMING NO SUBSTANTIAL DELIBERATE SLOWDOWN" · AI FUTURES PROJECT, NOV 10, 2026',
  scenario: 'SCENARIO · 2027 (AI 2027, PUBLISHED APRIL 2025)',
  pachocki: 'JAKUB PACHOCKI · CHIEF SCIENTIST, OPENAI · "AN ALIEN MIND", SEPT 6, 2026',
  pachockiText: '“no lab has solved alignment and monitoring to a sufficient degree to continue responsibly scaling at maximum speed for much longer.”',
  monitor: 'MONITOR CHECKS 100 % OF AGENT ACTIONS BEFORE THEY RUN · ≈50 CASES A WEEK GO TO HUMANS · ANTHROPIC, SEPT 17, 2026',
  accord: 'WHITE HOUSE ACCORD, SEPT 29, 2026 · INDEPENDENT EXTERNAL AUDITS · VOLUNTARY',
};

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The plate grows out of a thing in the scene (o.from = { x, y, w, h } screen rect, e.g. the machine's core or a builder's eye; or [cx, cy, r]) and shrinks back.
// Frames: <F31CLIPS or /tmp/claude-0/f31/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, from <ROOT>clips/Cn.mp4 trimmed to in/out of
// clips/schnitt.json; written by tools/f31_clips.py clips). Until the frames exist a placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
// vo-v3 slots (aenderung-v3.md); vo-v4 adds [CLIP Tn: …] lines: phase 2 adds them here (one entry per slot id of the timing).
export const CLIPS = {
  K1: { name: 'Sergey Brin', role: 'Co-founder, Google', year: 'Oct 2026', src: 'Google for Developers' },
  K2: { name: 'Sam Altman', role: 'CEO, OpenAI', year: 'Oct 2025', src: 'OpenAI livestream' },
  T1a: { name: 'Tao Lin', role: 'Researcher at Anthropic, speaking for himself', year: 'Nov 15, 2026', src: 'Palisade Research' },
  T1b: { name: 'Tao Lin', role: 'Researcher at Anthropic, speaking for himself', year: 'Nov 15, 2026', src: 'Palisade Research' },
};
const CLIPDIR = (process.env.F31CLIPS || '/tmp/claude-0/f31/clips/').replace(/\/?$/, '/');
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
  if (fr) { const s = Math.max(R.w / fr.width, R.h / fr.height) * (w / R.w), dw = fr.width * s, dh = fr.height * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1; }
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
  if (lu > 0) {
    const by = R.y - 26, nw = maskLine(ctx, [[info.name, 0]], R.x, by, 38, rise(lu), { glow: true });
    maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x + nw.w + 20, by - 2, 17, rise(lu), { serif: false, col: P.halo2, glow: false });
    goldText(ctx, [[`${info.tag ? info.tag + ' · ' : ''}ORIGINAL FOOTAGE (${info.src.toUpperCase()})`, .45]], R.x + R.w, R.y + R.h + 34 > 1060 ? by - 32 : by - 32, 17, rise(lu), { serif: false, weight: 600, align: 'right' });
  }
  ctx.restore();
  return { cx, cy, w, h };
}
