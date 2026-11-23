// Film 67 · "Meta's AI Chief Says Superintelligence Is Arriving" (thumbnail A: SUPERINTELLIGENCE IS ARRIVING) · shared kit (owned by the
// lead; builders import, never edit — wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText,
// the 2.5D card stage cam3/card/aim/project/camDrift, finish) + lib/f16_kit.mjs (rise, maskLine, measure) + lib/f54_kit.mjs (bracket, source).
// World: docs/MOTION.md §2 · shots: docs/shots.md · THE NIGHT OF THE HEADLINE (town, chalkboard, referee, labs, the ribbon): lib/f67_world.mjs.
//
//   THE HEADLINE (thumbnail A): Wang's sentence as giant gold letters in the night sky. headline().
//   THE FILE (planted 0:10, harvested 5:20): a small gold document, small enough for one hand. file().
//   THE RIBBON: the file unrolled = ~17 million lines of code, a gold band of unreadable lines running to the horizon. ribbon().
//   THE REFEREE (Lean): a human figure in a striped shirt on a tall umpire chair (an image for the program, never a robot). referee().
//   THE GOLD CARD: the referee's ruling CORRECT (replaces stamps: stamps are #59's). goldCard().
//   THE PAPER TOWER: > 250,000 pages written out. paperTower(). THE BALANCE (homework vs the file). balance().
//   THE CHECKLIST (the clock): IS HE RIGHT? and five boxes, top right; fills from CHECKS phrases by itself. checklist(ctx, t, T, o).
//   JAKOB'S ASSETS: xPost() (Wang's X post header PNG, unrolls into the night) · xQuote() (a quote crop PNG + a gold highlighter sweep on
//   the key words) · portrait() (Wang's cutout as a paper-cut duotone print, used ONCE at "The man is Alexandr Wang") · clipPlate() (C0–C4).
//   Every asset has a marked placeholder of the same size until its file lands in films/67-assets/ (swapping = a file drop, no code change).
//
// Colour code: GOLD = what holds / the hero light (the headline, the file, the ribbon, a gold box, the gold card) · CREAM = what is open
// (an open box, questions, quotes) · COOL = machines / labs / screens · LAMP = people's windows · the yellow coat = only you. Never red.
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

export const PRINT67 = { grain: 14, floor: 4, vig: .5 };
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
// AI MAKES / EVERYTHING CHEAP like thumbnail A: heavy condensed caps, cream with a warm glow, left; the small line under it. u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 72, y = o.y ?? 470, lines = o.lines ?? ['SUPERINTELLIGENCE', 'IS ARRIVING'], cond = o.cond ?? .7;
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
// The plate grows out of a thing in the world (o.from = { x, y, w, h } screen rect, e.g. the promise tag's face; or [cx, cy, r]) and goes back.
// Lower third (≥ 22 px): NAME (serif) · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE). Wording from <ROOT>clips-geprueft.json once it exists.
// Frames: <F67CLIPS or /tmp/claude-0/f67/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, from <ROOT>clips/Cn.mp4 trimmed to in/out of
// <ROOT>clips-geprueft.json; written by tools/f67_clips.py clips). Until the frames exist a placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIPS = {   // from audio/clips_meta.json + films/67-assets/clips/clips.md (checked 23.11.)
  C0: { name: 'Levent Alpöge', role: 'Mathematician', year: '2023', src: 'Number Theory Web Seminar' },   // picture only
  C1: { name: 'Alexandr Wang', role: 'Chief AI Officer, Meta', year: '2026', src: 'Core Memory Podcast' },
  C2: { name: 'James Maynard', role: 'Mathematician · Fields Medal 2022', year: '2026', src: 'New Scientist' },
  C3: { name: 'Terence Tao', role: 'Mathematician · Fields Medal 2006', year: '2026', src: 'ICM 2026 Public Lecture, Simons Foundation' },
  C4: { name: 'Yann LeCun', role: 'AI scientist', year: '2025', src: 'Big Technology Podcast' },
};
const CLIPDIR = (process.env.F67CLIPS || '/tmp/claude-0/f67/clips/').replace(/\/?$/, '/');
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

// ======================================================================================================================== THE HEADLINE
// Wang's sentence as giant letters of gold light (Inter Black, condensed). Drawn in the caller's space (the world draws it on the sky card
// at Z_HEAD). o: { x, y (baseline of line 1), w (width of line 1), lines, u 0..1 (rises line by line behind a mask), glow 0..1,
//   cream [per line 0..1] (a line turns cream = "only half": the end verdict), dim 0..1, wordU {SUPERINTELLIGENCE: 0..1} unused, gap }
// Returns the line boxes [{ x, y, w, h }] (caller space) so carriers (the file, the post header) can start from a letter.
const HLM = new Map();
function hlMeasure(ctx, s) { if (!HLM.has(s)) { ctx.save(); ctx.font = '100px "Inter Black"'; HLM.set(s, ctx.measureText(s).width / 100); ctx.restore(); } return HLM.get(s); }
export function headline(ctx, t, o = {}) {
  const lines = o.lines ?? ['SUPERINTELLIGENCE', 'IS ARRIVING'], cond = o.cond ?? .74, x = o.x ?? 150, y = o.y ?? 330, w = o.w ?? 1620;
  const size = w / (hlMeasure(ctx, lines[0]) * cond), lh = size * .9, glow = clamp(o.glow ?? 1), u = o.u ?? 1, boxes = [];
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .18, .7 + i * .18)); const lw = hlMeasure(ctx, ln) * cond * size, lx = o.align === 'left' ? x : x + (w - lw) / 2, ly = y + i * lh;
    boxes.push({ x: lx, y: ly - size * .74, w: lw, h: size * .74 });
    if (ui <= 0) return;
    const cr = clamp(o.cream?.[i] ?? 0), dim = clamp(o.dim ?? 0);
    ctx.save(); ctx.beginPath(); ctx.rect(lx - 60, ly - size * .86, lw + 120, size * .98); ctx.clip();
    ctx.translate(lx, ly + (1 - expoOut(ui)) * size * .6); ctx.scale(cond, 1); ctx.font = `${size}px "Inter Black"`; ctx.textBaseline = 'alphabetic';
    const top = mixHex(mixHex(GOLD.hot, CREAM, cr), P.blue2, dim * .7), bot = mixHex(mixHex(GOLD.mid, mixHex(CREAM, P.halo2, .5), cr), P.night1, dim * .7);
    ctx.shadowColor = rgba(cr > .5 ? P.halo2 : GOLD.halo, .55 * glow * (1 - dim)); ctx.shadowBlur = size * .22;
    ctx.fillStyle = lin(ctx, 0, -size * .74, 0, 0, [[0, top], [1, bot]]); ctx.fillText(ln, 0, 0);
    ctx.shadowBlur = 0; ctx.fillText(ln, 0, 0);
    ctx.globalAlpha *= .22 * glow * (1 - dim); ctx.fillStyle = GOLD.core; ctx.fillText(ln, 0, -size * .012);   // inner light
    ctx.restore();
  });
  return boxes;
}

// ======================================================================================================================== THE FILE
// x, y = centre; s = width (h = 1.3 s). o: { a, rot, glow 0..1, open 0..1 (the cover swings up, pages spill: the caller draws the tower),
//   scan 0..1 (a gold light point runs line by line, tiny checks appear behind it), lines 0..1 (how many gold lines are written), seed }
export function file(ctx, t, x, y, s, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0 || s <= 0) return null;
  const w = s, h = s * 1.3, g = clamp(o.glow ?? 1), dog = w * .22, scan = o.scan ?? 0, op = clamp(o.open ?? 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate((o.rot ?? 0) + .015 * Math.sin(t * .8 + x * .01));
  halo(ctx, 0, 0, w * 1.6, .38 * g, GOLD.halo, GOLD.core);
  const body = new Path2D(); body.moveTo(-w / 2, -h / 2); body.lineTo(w / 2 - dog, -h / 2); body.lineTo(w / 2, -h / 2 + dog); body.lineTo(w / 2, h / 2); body.lineTo(-w / 2, h / 2); body.closePath();
  ctx.fillStyle = lin(ctx, w / 2, -h / 2, -w / 2, h / 2, [[0, mixHex(GOLD.shade, GOLD.hot, g)], [.6, mixHex(GOLD.deep, GOLD.body, g)], [1, mixHex(GOLD.deep, GOLD.mid, g)]]); ctx.fill(body);
  ctx.strokeStyle = rgba(GOLD.core, .35 + .4 * g); ctx.lineWidth = Math.max(1, w * .012); ctx.stroke(body);
  ctx.fillStyle = mixHex(GOLD.mid, GOLD.core, .4 * g); ctx.beginPath(); ctx.moveTo(w / 2 - dog, -h / 2); ctx.lineTo(w / 2 - dog, -h / 2 + dog); ctx.lineTo(w / 2, -h / 2 + dog); ctx.closePath(); ctx.fill();
  // the lines: short dark-gold dashes (unreadable); the scan light runs along them, checks appear behind it
  const N = 9, r = prng((o.seed ?? 5) * 17 + 1), nl = Math.round(N * clamp(o.lines ?? 1));
  for (let i = 0; i < nl; i++) {
    const ly = -h / 2 + h * .2 + i * h * .072; let lx = -w * .38; const end = w * (.2 + .18 * r());
    while (lx < end) { const dw = w * (.04 + .1 * r()); ctx.fillStyle = rgba(GOLD.deep, .55); ctx.fillRect(lx, ly, Math.min(dw, end - lx), Math.max(1, h * .018)); lx += dw + w * .03; }
    const done = clamp(scan * N - i);
    if (done > 0 && scan < 1.0001 && o.scan != null) {
      if (done < 1) halo(ctx, lerp(-w * .38, end, done), ly, w * .14, .9, GOLD.halo, GOLD.core);
      if (done >= 1) { ctx.strokeStyle = rgba(P.night1, .8); ctx.lineWidth = Math.max(1, w * .016); ctx.beginPath(); ctx.moveTo(w * .3, ly); ctx.lineTo(w * .33, ly + h * .02); ctx.lineTo(w * .39, ly - h * .025); ctx.stroke(); }
    }
  }
  if (op > 0) {   // the cover swings open (top edge hinge): a lighter sheet folding up, light pours out
    ctx.save(); ctx.scale(1, 1 - 1.9 * sineIO(op)); ctx.fillStyle = rgba(mixHex(CREAM, GOLD.hot, .5), .9); ctx.fillRect(-w / 2, -h / 2, w, h * .06); ctx.restore();
    halo(ctx, 0, -h * .45, w * 2.2 * op, .5 * op, GOLD.halo, GOLD.core);
  }
  ctx.restore();
  return { x, y, w, h };
}

// ======================================================================================================================== THE RIBBON
// the file unrolled: a gold band along pts (caller space), width w0 at the start → w1 at the end (perspective), u = how far it has run
// (0..1 of its length), scroll = the code dashes stream along it (never still). o: { u, w0, w1, a, glow, seed, reader: [0..1 positions] }
export function ribbon(ctx, t, pts, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0 || pts.length < 2) return null;
  const N = 90, cm = E.catmull(pts, 12), len = [0]; for (let i = 1; i < cm.length; i++) len.push(len[i - 1] + Math.hypot(cm[i][0] - cm[i - 1][0], cm[i][1] - cm[i - 1][1]));
  const L = len[len.length - 1], at = (d) => { let i = 1; while (i < cm.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(cm[i - 1][0], cm[i][0], f), lerp(cm[i - 1][1], cm[i][1], f)]; };
  const P2 = []; for (let i = 0; i <= N; i++) P2.push(at(L * u * i / N));
  const w0 = o.w0 ?? 60, w1 = o.w1 ?? 6, g = clamp(o.glow ?? 1), a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < N; i++) {
    const [ax, ay] = P2[i], [bx, by] = P2[i + 1], dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    const fa = i / N * u, fb = (i + 1) / N * u, wa = lerp(w0, w1, fa) / 2, wb = lerp(w0, w1, fb) / 2;
    ctx.fillStyle = mixHex(mixHex(GOLD.deep, GOLD.mid, g), mixHex(GOLD.shade, GOLD.hot, g), .5 + .5 * Math.sin(i * .5 - t * 1.3));
    ctx.beginPath(); ctx.moveTo(ax + nx * wa, ay + ny * wa); ctx.lineTo(bx + nx * wb, by + ny * wb); ctx.lineTo(bx - nx * wb, by - ny * wb); ctx.lineTo(ax - nx * wa, ay - ny * wa); ctx.closePath(); ctx.fill();
    // code dashes across the band, streaming outward (scroll)
    const r = prng(i * 13 + (o.seed ?? 1)), sh = (t * .9 + r()) % 1;
    if (wa > 3) for (let k = 0; k < 3; k++) { const q = lerp(-.7, .7, (k + .5) / 3), px = lerp(ax, bx, sh), py = lerp(ay, by, sh); ctx.fillStyle = rgba(GOLD.deep, .5); ctx.fillRect(px + nx * wa * q - 1, py + ny * wa * q - 1, Math.max(1.2, wa * .25 * r()), Math.max(1, wa * .07)); }
  }
  // a soft glow along the band (lighter), and the running tip
  ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(GOLD.halo, .12 * g); ctx.lineWidth = w0 * .8; ctx.lineCap = 'round';
  ctx.beginPath(); P2.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.globalCompositeOperation = 'source-over';
  if (u < 1) halo(ctx, P2[N][0], P2[N][1], lerp(w0, w1, u) * 2.5, .7 * g, GOLD.halo, GOLD.core);
  ctx.restore();
  return { end: P2[N], at: (f) => at(L * u * clamp(f)) };
}

// ======================================================================================================================== THE GOLD CARD
// the referee's ruling (CORRECT): a gold card that rises (it grows out of x, y upwards; u 0..1), slight tilt; text in dark ink (Inter 700)
export function goldCard(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const w = s, h = s * 1.36, k = expoOut(u), txt = o.text ?? 'CORRECT';
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 4); ctx.translate(x, y); ctx.rotate((o.rot ?? -.08) + (1 - k) * .3 + .02 * Math.sin(t * 1.1));
  ctx.scale(lerp(.3, 1, k), k);
  halo(ctx, 0, -h / 2, w * 1.5, .45 * (o.glow ?? 1), GOLD.halo, GOLD.core);
  ctx.fillStyle = lin(ctx, w / 2, -h, -w / 2, 0, [[0, GOLD.hot], [.55, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h, w, h, w * .07); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.core, .7); ctx.lineWidth = Math.max(1, w * .015); ctx.stroke();
  if (s >= 40) { const fs = Math.min(w * .2, w * 1.6 / Math.max(4, txt.length)); E.glowText(ctx, txt, 0, -h / 2 + fs * .35, { size: fs, weight: 700, align: 'center', spacing: .06, col: GOLD.deep, glow: false, a: clamp(u * 2 - .6) }); }
  ctx.restore();
  return { x, y, w, h };
}

// ======================================================================================================================== THE REFEREE
// a human figure (E.person) in a striped shirt, a whistle; o: { card 0..1 (raises the gold card in the right hand), text, look, dir, seated }
// Returns { hands, card } in caller space.
export function referee(ctx, t, x, y, h, o = {}) {
  const cu = clamp(o.card ?? 0), raise = sineIO(span(cu, 0, .5));
  const armR = [lerp(.35, 2.95, raise), lerp(.2, 3.05, raise)];
  const hands = E.person(ctx, x, y, h, { dir: o.dir ?? 1, light: .8, look: o.look ?? .2, armR, armL: o.armL ?? [-.25, -.1], rim: GOLD.line });
  ctx.save(); ctx.translate(x, y); ctx.scale(h * (o.dir ?? 1), h);   // the stripes (cream) over the shirt, clipped to the torso
  ctx.beginPath(); ctx.roundRect(-.118, -.79, .236, .33, .05); ctx.clip();
  ctx.fillStyle = rgba(CREAM, .78); for (let i = -3; i <= 3; i++) ctx.fillRect(i * .036 - .009, -.8, .018, .36);
  ctx.restore();
  ctx.fillStyle = rgba(CREAM, .9); ctx.beginPath(); ctx.arc(x + h * .03 * (o.dir ?? 1), y - h * .74, Math.max(1.2, h * .014), 0, TAU); ctx.fill();   // the whistle
  let card = null;
  if (cu > 0 && hands?.R) card = goldCard(ctx, t, hands.R[0], hands.R[1] + h * .02, h * .26, { u: span(cu, .25, 1), text: o.text ?? 'CORRECT', rot: .1 });
  return { hands, card };
}

// ======================================================================================================================== THE PAPER TOWER
// > 250,000 pages: a stack of cream sheets rising from (x, base), width w, height h × u; sheets sit slightly askew (seeded); the top
// sheets flutter; o.dark 0..1 (the tower darkens behind a quote), o.pour 0..1 (sheets still streaming in from o.from [x, y])
export function paperTower(ctx, t, x, base, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const hh = h * expoOut(u) * (o.full ?? 1), dark = clamp(o.dark ?? 0), sheet = Math.max(3, w * .035), n = Math.ceil(hh / sheet), r = prng(o.seed ?? 3);
  ctx.save();
  for (let i = 0; i < n; i++) {
    const yy = base - i * sheet, off = (r() - .5) * w * .08 + Math.sin(i * .13) * w * .03, rot = (r() - .5) * .03;
    const top = i > n - 6, fl = top ? .01 * Math.sin(t * 3 + i) : 0, lit = .55 + .45 * Math.sin(i * .07 + 1);
    ctx.save(); ctx.translate(x + off, yy); ctx.rotate(rot + fl);
    ctx.fillStyle = mixHex(mixHex(PAPER.shade, PAPER.lit, lit), P.night1, .25 + .6 * dark); ctx.fillRect(-w / 2, -sheet, w, sheet * .92);
    ctx.fillStyle = rgba(PAPER.faint, .35 * (1 - dark)); ctx.fillRect(-w / 2, -sheet * .15, w, Math.max(1, sheet * .12));
    ctx.restore();
  }
  const pour = clamp(o.pour ?? 0);
  if (pour > 0 && o.from) for (let k = 0; k < 14; k++) {   // sheets falling from the file onto the tower
    const ph = (t * .7 + k / 14) % 1, [fx, fy] = o.from, px = lerp(fx, x + (k % 3 - 1) * w * .2, ph), py = lerp(fy, base - hh, ph * ph) - 60 * Math.sin(Math.PI * ph);
    ctx.save(); ctx.globalAlpha *= pour * (1 - ph * .3); ctx.translate(px, py); ctx.rotate(Math.sin(t * 2 + k) * .8); ctx.fillStyle = PAPER.lit; ctx.fillRect(-w * .18, -w * .12, w * .36, w * .24); ctx.restore();
  }
  ctx.restore();
  return { x, top: base - hh, w };
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
// a school notebook (cream, HOMEWORK on the cover) lying on a surface at (x, y = bottom centre), width s
export function notebook(ctx, t, x, y, s, o = {}) {
  const w = s, h = s * .7; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y - h / 2); ctx.rotate(o.rot ?? -.04);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER.lit], [1, PAPER.shade]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = mixHex(P.blue1, P.night1, .3); ctx.fillRect(-w / 2, -h / 2, w * .07, h);
  if (s > 60) E.glowText(ctx, o.text ?? 'HOMEWORK', w * .04, -h * .05, { size: Math.min(28, w * .13), weight: 700, align: 'center', spacing: .08, col: PAPER.ink, glow: false });
  ctx.strokeStyle = rgba(PAPER.faint, .6); ctx.lineWidth = 1; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-w * .3, h * (.12 + i * .1)); ctx.lineTo(w * .38, h * (.12 + i * .1)); ctx.stroke(); }
  ctx.restore();
}

// ======================================================================================================================== THE CHECKLIST (the clock)
// Screen space, top right: IS HE RIGHT? and five boxes in a row. Each box changes on its phrases (never animate by hand):
//   gold (fills from the bottom with gold light) · goldq (gold with a cream rim and a small '?') · open (cream, pulsing outline, the word
//   OPEN under it; NEVER a cross, never red) · half (fills only halfway). Under the row: CHECK n OF 5 · the question of the current check.
// o: { a, big 0..1 (moves to the top centre, 2.2×, all five short labels under the boxes: the end verdict), lit (index to highlight), dx, dy }
export const CHECKS = {
  on: 'So test his claim',
  boxes: [
    { q: 'IS HIS EVIDENCE REAL?', short: 'REAL?', at: 'First check', v: 'First box: gold', kind: 'gold' },
    { q: 'DID IT PROVE THE RIGHT THING?', short: 'RIGHT THING?', at: 'Check two', v: 'Second box: gold', kind: 'goldq' },
    { q: 'WAS IT REALLY THE AI?', short: 'THE AI?', at: 'Check three', v: 'Third box: gold', kind: 'gold' },
    { q: 'DOES ANY HUMAN UNDERSTAND IT?', short: 'UNDERSTOOD?', at: 'Check four', v: 'This box may never turn gold', kind: 'open' },
    { q: 'DOES ONE PROOF MEAN SUPERINTELLIGENCE?', short: 'SUPERINTELLIGENCE?', at: 'the last check', v: 'So the fifth box only fills', kind: 'half' },
  ],
};
const CT = new WeakMap();
export function checkTimes(T) {
  if (CT.has(T)) return CT.get(T);
  const on = T.G(CHECKS.on), at = [], v = []; let prev = on;
  for (const b of CHECKS.boxes) { const a = T.G(b.at, 0, prev); at.push(a); v.push(T.G(b.v, 0, a)); prev = a; }
  const r = { on, at, v, clips: ['C0', 'C1', 'C2', 'C3', 'C4'].map((id) => T.clip(id)).filter(Boolean) }; CT.set(T, r); return r;
}
export function checkState(T, t) {
  const b = checkTimes(T); let cur = -1; for (let i = 0; i < 5; i++) if (t >= b.at[i] - .3) cur = i;
  const fill = b.v.map((v) => span(t, v - .05, v + 1.4));
  const clipHide = b.clips.reduce((m, c) => Math.max(m, span(t, c.start - 1.2, c.start - .4) * (1 - span(t, c.end + .2, c.end + 1))), 0);
  return { cur, fill, b, on: smooth(span(t, b.on - .2, b.on + 1.2)) * (1 - clipHide), slide: expoOut(span(t, b.on - .2, b.on + 1.4)),
    name: cur >= 0 ? span(t, b.at[cur] - .3, b.at[cur] + .6) * (1 - span(t, b.v[cur] + 3, b.v[cur] + 3.8)) : 0 };
}
function box(ctx, t, x, y, s, kind, f, o = {}) {
  const pulse = .5 + .5 * Math.sin(t * 2.2);
  ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(x, y, s, s);
  if (f > 0 && kind !== 'open') {
    const lev = (kind === 'half' ? .5 : 1) * sineIO(f), fh = s * lev;
    ctx.fillStyle = lin(ctx, x, y + s - fh, x, y + s, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.fillRect(x + 3, y + s - fh + 3 * (lev < 1 ? 0 : 1), s - 6, Math.max(0, fh - 6 * (lev < 1 ? .5 : 1)));
    halo(ctx, x + s / 2, y + s - fh / 2, s * 1.1, .3 * f, GOLD.halo, GOLD.core);
    if (kind === 'goldq') { ctx.strokeStyle = rgba(CREAM, .95 * f); ctx.lineWidth = 3; ctx.strokeRect(x + 4, y + 4, s - 8, s - 8); E.glowText(ctx, '?', x + s - 12, y + 22, { size: 18, weight: 700, align: 'center', col: P.night1, glow: false, a: f }); }
  }
  if (kind === 'open' && f > 0) { ctx.fillStyle = rgba(CREAM, .16 + .1 * pulse * f); ctx.fillRect(x + 3, y + 3, s - 6, s - 6); }
  const lit = o.lit ? 1 : 0;
  ctx.strokeStyle = kind === 'open' && f > 0 ? rgba(CREAM, .65 + .35 * pulse) : f > 0 ? rgba(GOLD.core, .9) : rgba(CREAM, .7 + .3 * lit * pulse); ctx.lineWidth = kind === 'open' && f > 0 ? 2 + 1.5 * pulse : 2;
  ctx.strokeRect(x, y, s, s);
}
export function checklist(ctx, t, T, o = {}) {
  const S = checkState(T, t), a = (o.a ?? 1) * S.on; if (a <= 0) return;
  const big = sineIO(clamp(o.big ?? 0)), s = 44, gap = 16, rowW = 5 * s + 4 * gap;
  const sc = lerp(1, 2.3, big), x0 = lerp(W - 70 - rowW, W / 2 - rowW * sc / 2, big) + (1 - S.slide) * 520 + (o.dx ?? 0), y0 = lerp(54, 120, big) + (o.dy ?? 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a; ctx.translate(x0, y0); ctx.scale(sc, sc);
  goldText(ctx, [['IS HE RIGHT?', .2]], 0, 0, 22, rise(span(t, S.b.on, S.b.on + 1)), { serif: false, weight: 700, spacing: .08 });
  for (let i = 0; i < 5; i++) {
    const B = CHECKS.boxes[i], x = i * (s + gap), y = 16, f = S.fill[i];
    box(ctx, t, x, y + (1 - expoOut(span(t, S.b.on + .2 + i * .1, S.b.on + 1 + i * .1))) * 18, s, B.kind, f, { lit: o.lit === i || (i === S.cur && f <= 0) });
    if (B.kind === 'open' && f > 0) goldText(ctx, [['OPEN', 0]], x + s / 2, y + s + (big > .5 ? 26 : 22), big > .5 ? 12 : 14, rise(f), { serif: false, weight: 700, spacing: .1, align: 'center', col: CREAM });
    if (big > .02) { ctx.save(); ctx.globalAlpha *= big; goldText(ctx, [[B.short, 0]], x + s / 2, y + s + 46 + (i % 2) * 14, 9, 1, { serif: false, weight: 600, align: 'center', col: CREAM2 }); ctx.restore(); }
  }
  ctx.restore();
  if (S.cur >= 0 && big < .5 && S.name > 0) {   // CHECK n OF 5 · the question (screen space, ≥ 22 px, right aligned under the row)
    const B = CHECKS.boxes[S.cur], xr = x0 + rowW, al = a * (1 - big * 2);
    ctx.save(); ctx.globalAlpha *= al;
    goldText(ctx, [[`CHECK ${S.cur + 1} OF 5`, .9]], xr, y0 + 16 + s + 38, 22, rise(S.name), { serif: false, weight: 700, spacing: .06, align: 'right' });
    goldText(ctx, [[B.q, 0]], xr, y0 + 16 + s + 70, 22, rise(span(S.name, .2, 1)), { serif: false, weight: 600, spacing: .04, align: 'right', col: CREAM });
    ctx.restore();
  }
}
// screen rect of box i (for carriers: a box that grows big, the ALIEN MIND words behind box 4 …)
export function checkBox(i, o = {}) { const s = 44, gap = 16, rowW = 5 * s + 4 * gap; return { x: W - 70 - rowW + i * (s + gap), y: 54 + 16, w: s, h: s }; }

// ======================================================================================================================== JAKOB'S ASSETS
// films/67-assets/ (pushed by the iMac session): x/<header|quote crops>.png · wang/portrait-cutout.png · clips/clips.md.
// ASSETS maps an id to a file name (any of the candidates, first that exists) + the placeholder text + the highlight box(es) in the PNG's
// own 0..1 coordinates ([x0, y0, x1, y1]; films/67-assets/x/highlights.json overrides: { "alien": [[x0,y0,x1,y1]], … }).
// Until a file exists the kit draws a clearly marked PLACEHOLDER card of the same aspect with the exact text: swapping = a file drop.
export const ASSET_DIR = (process.env.F67ASSETS || new URL('../../../67-assets/', import.meta.url).pathname).replace(/\/?$/, '/');
export const ASSETS = {   // crop = the part of the PNG shown [x0, y0, x1, y1] (0..1 of the PNG) · box = highlight boxes (0..1 of the CROP) · dark print (X dark mode)
  header: { files: ['x/01-header.png', 'x/header.png'], aspect: 4.2, text: 'Alexandr Wang · Superintelligence is Arriving', sub: 'X · NOV 22, 2026' },
  alien: { files: ['x/02-homework-atombomb-alien-mind.png'], crop: [0, .789, 1, 1], box: [[.423, .38, .556, .82]], text: '“…completed with the help of an alien mind that we don’t understand.”', hi: 'alien mind' },
  homework: { files: ['x/02-homework-atombomb-alien-mind.png'], crop: [0, .623, 1, .796], box: [[.246, .47, .376, .99]], text: '“…many physicists would agree that the discovery of the atomic bomb is a homework problem compared to the Riemann Hypothesis.”', hi: 'homework problem' },
  lazy: { files: ['x/05-lazy-handover-defaultpath.png'], crop: [0, .055, 1, .266], box: [[.357, .02, .52, .5]], text: '“I notice a particular form of lazy thinking within the AI industry…”', hi: 'lazy thinking' },
  thousand: { files: ['x/04-control-1000x.png'], crop: [0, .352, 1, .65], box: [[.275, .335, .462, .665]], text: '“…equally hard to imagine a world where humanity maintains control with superintelligence that is 1000x smarter and more capable than humans in every field.”', hi: '1000x smarter' },
  handover: { files: ['x/05-lazy-handover-defaultpath.png'], crop: [0, .264, 1, .476], box: [[.747, .02, .862, .5]], text: '“We should not be okay with a “handover” of society to AI.”', hi: 'handover' },
  defaultPath: { files: ['x/05-lazy-handover-defaultpath.png'], crop: [0, .683, 1, 1], box: [[.685, .01, .879, .33]], text: '“…likely involves the whole industry taking meaningfully different actions from the “default path” in front of us.”', hi: 'default path' },
  nextYear: { files: ['x/06-next-year.png'], crop: [0, 0, 1, 1], box: [[.685, .17, .817, .5]], text: '“How humanity acts over the next year will have great consequence on what future world we live in.”', hi: 'next year' },
  views: { files: ['x/07-time-views.png'], crop: [0, 0, 1, 1], box: [], text: '11:50 PM · Nov 22, 2026', hi: 'Nov' },
  portrait: { files: ['wang/portrait-cutout.png'], aspect: .8 },
};
const IMG = new Map(); let HI = {};
let assetsP = null;
export function prepareAssets() {
  if (assetsP) return assetsP;
  assetsP = (async () => {
    try { HI = JSON.parse(fs.readFileSync(ASSET_DIR + 'x/highlights.json', 'utf8')); } catch { HI = {}; }
    for (const [id, A] of Object.entries(ASSETS)) {
      const f = A.files.map((n) => ASSET_DIR + n).find((p) => fs.existsSync(p))
        ?? (id !== 'portrait' && id !== 'header' ? (() => { try { const d = ASSET_DIR + 'x/'; const key = A.hi.split(' ')[0].toLowerCase(); const n = fs.readdirSync(d).find((x) => x.toLowerCase().includes(key) && x.endsWith('.png')); return n ? d + n : null; } catch { return null; } })() : null);
      if (!f) continue;
      try { const img = await loadImage(fs.readFileSync(f)); IMG.set(id, id === 'portrait' ? duotone(img) : A.crop ? cropOnce(img, A.crop) : img); console.log(`[f67] asset ${id}: ${f}`); } catch (e) { console.warn(`[f67] asset ${id} failed: ${e.message}`); }
    }
  })();
  return assetsP;
}
export const hasAsset = (id) => IMG.has(id);
// the quote crops are cut ONCE at load into their own canvas (drawImage with a source rect per frame proved unreliable in napi-canvas)
function cropOnce(img, cr) {
  const sw = Math.round((cr[2] - cr[0]) * img.width), sh = Math.round((cr[3] - cr[1]) * img.height), cv = createCanvas(sw, sh);
  cv.getContext('2d').drawImage(img, Math.round(cr[0] * img.width), Math.round(cr[1] * img.height), sw, sh, 0, 0, sw, sh); return cv;
}
// the portrait treatment, ONCE at load: duotone (night indigo → cream/gold by luminance) + a cream paper-cut border around the cutout
function duotone(img) {
  const pad = 18, cw = img.width + pad * 2, ch = img.height + pad * 2, cv = createCanvas(cw, ch), c = cv.getContext('2d');
  for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; c.drawImage(img, pad + Math.cos(a) * 9, pad + Math.sin(a) * 9); }
  c.globalCompositeOperation = 'source-in'; c.fillStyle = PAPER.lit; c.fillRect(0, 0, cw, ch); c.globalCompositeOperation = 'source-over';
  const tmp = createCanvas(img.width, img.height), tc = tmp.getContext('2d'); tc.drawImage(img, 0, 0);
  const id = tc.getImageData(0, 0, img.width, img.height), d = id.data;
  const lo = [0x15, 0x1f, 0x4b], mid = [0xb8, 0x79, 0x2a], hi = [0xfe, 0xf4, 0xbf];
  for (let i = 0; i < d.length; i += 4) {
    const l = (.3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]) / 255, q = l < .5 ? l * 2 : (l - .5) * 2, A = l < .5 ? lo : mid, B = l < .5 ? mid : hi;
    d[i] = A[0] + (B[0] - A[0]) * q; d[i + 1] = A[1] + (B[1] - A[1]) * q; d[i + 2] = A[2] + (B[2] - A[2]) * q;
  }
  tc.putImageData(id, 0, 0); c.drawImage(tmp, pad, pad);
  return cv;
}
// the post header: a screenshot print unrolling downward from its top edge (x, y = top left; w = width). u 0..1. o: { a, rot, glow }
export function xPost(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const img = IMG.get('header'), A = ASSETS.header, h = img ? w * img.height / img.width : w / A.aspect, k = sineIO(u), hh = h * k;
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1); ctx.translate(x, y); ctx.rotate((o.rot ?? -.012) + .006 * Math.sin(t * .7));
  halo(ctx, w / 2, h / 2, w * .7, .18 * (o.glow ?? 1), P.halo2, CREAM);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(8, 12, w, hh);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, hh); ctx.clip();
  if (img) ctx.drawImage(img, 0, 0, w, h);
  else placeholderCard(ctx, w, h, [[A.text, h * .26, true], [A.sub, h * .14, false]], 'X POST HEADER · PLACEHOLDER (films/67-assets/x/header.png)');
  ctx.restore();
  if (u < 1) { ctx.fillStyle = lin(ctx, 0, hh - 14, 0, hh + 6, [[0, rgba(P.night0, 0)], [1, rgba(PAPER.lit, .9)]]); ctx.fillRect(0, hh - 14, w, 20); }   // the rolling edge
  ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 1.5; ctx.strokeRect(0, 0, w, hh);
  ctx.restore();
  return { x, y, w, h: hh, full: h };
}
function placeholderCard(ctx, w, h, lines, note) {
  ctx.fillStyle = lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = mixHex(P.blue1, P.night1, .2); ctx.beginPath(); ctx.arc(h * .32, h * .4, h * .2, 0, TAU); ctx.fill();   // avatar slot
  let yy = h * .38; for (const [s, size, serif] of lines) { E.glowText(ctx, s, h * .64, yy, { size, serif, weight: 600, col: PAPER.ink, glow: false }); yy += size * 1.35; }
  ctx.strokeStyle = 'rgba(200,40,140,.9)'; ctx.setLineDash([10, 8]); ctx.lineWidth = 3; ctx.strokeRect(3, 3, w - 6, h - 6); ctx.setLineDash([]);
  E.glowText(ctx, note, w - 12, h - 10, { size: Math.max(11, h * .07), weight: 700, align: 'right', col: 'rgba(200,40,140,.95)', glow: false });
}
// a quote crop: x, y = top left, w = width; u unrolls it (like the header), hiU 0..1 sweeps the gold highlighter over the key words
// (left → right per box). Placeholder: the exact quote text set in serif on a paper card, the key words' box measured from the text.
// Returns { x, y, w, h, hi: [screen boxes] } (the highlight boxes: carriers for words that detach, e.g. HANDOVER).
export function xQuote(ctx, t, id, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const A = ASSETS[id], img = IMG.get(id); let h, his = [];
  let lay = null;
  const cr = A.crop ?? [0, 0, 1, 1];
  if (img) { h = w * img.height / img.width; his = (HI[id] ?? A.box ?? [[.05, .3, .95, .7]]).map(([a, b, c, d]) => [a * w, b * h, c * w, d * h]); }
  else {   // lay the text out (Instrument Serif), find the key words
    const size = o.size ?? Math.round(w / 22), pad = size * 1.1, words = A.text.split(/\s+/), lines = []; let cur = [];
    for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.join(' '), size, true) > w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
    if (cur.length) lines.push(cur);
    h = pad * 2 + lines.length * size * 1.25 + size * .9; lay = { size, pad, lines };
    const key = A.hi.toLowerCase().split(' '), flat = []; lines.forEach((ln, li) => { let xx = pad; for (const wd of ln) { const ww = measure(wd, size, true); flat.push({ wd, x: xx, y: pad + (li + 1) * size * 1.25, w: ww }); xx += ww + size * .26; } });
    for (let i = 0; i < flat.length; i++) { const n = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, ''); if (key.every((k, j) => flat[i + j] && n(flat[i + j].wd).startsWith(n(k)))) { const a = flat[i], b = flat[i + key.length - 1]; if (a.y === b.y) his.push([a.x - 4, a.y - size * .86, b.x + b.w + 4, a.y + size * .2]); else { his.push([a.x - 4, a.y - size * .86, w - pad, a.y + size * .2]); his.push([pad - 4, b.y - size * .86, b.x + b.w + 4, b.y + size * .2]); } break; } }
  }
  const k = sineIO(u), hh = h * k;
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1); ctx.translate(x, y); ctx.rotate((o.rot ?? .008) + .005 * Math.sin(t * .6 + 1));
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(10, 14, w, hh);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, hh); ctx.clip();
  if (img) { ctx.drawImage(img, 0, 0, w, h); ctx.fillStyle = rgba(P.ind0, .22); ctx.fillRect(0, 0, w, h); }   // the dark print sits in the night (a touch of indigo)
  else {
    ctx.fillStyle = lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(0, 0, w, h);
    lay.lines.forEach((ln, li) => E.glowText(ctx, ln.join(' '), lay.pad, lay.pad + (li + 1) * lay.size * 1.25, { size: lay.size, serif: true, col: PAPER.ink, glow: false }));
    E.glowText(ctx, 'ALEXANDR WANG · “SUPERINTELLIGENCE IS ARRIVING” · X, NOV 22, 2026', lay.pad, h - lay.size * .45, { size: Math.max(13, lay.size * .38), weight: 600, spacing: .06, col: PAPER.faint, glow: false });
    ctx.strokeStyle = 'rgba(200,40,140,.9)'; ctx.setLineDash([10, 8]); ctx.lineWidth = 3; ctx.strokeRect(3, 3, w - 6, h - 6); ctx.setLineDash([]);
    E.glowText(ctx, `PLACEHOLDER · films/67-assets/x/ (${id})`, w - 12, 22, { size: 13, weight: 700, align: 'right', col: 'rgba(200,40,140,.95)', glow: false });
  }
  // the highlighter: a gold marker stroke sweeping left → right over each box (multiply keeps the print legible)
  const hu = clamp(o.hiU ?? 0), n = his.length;
  his.forEach(([x0, y0, x1, y1], i) => {
    const f = sineIO(clamp(hu * n - i)); if (f <= 0) return;
    const mark = () => { ctx.beginPath(); ctx.moveTo(x0, y0 + 3); ctx.lineTo(x0 + (x1 - x0) * f, y0); ctx.lineTo(x0 + (x1 - x0) * f, y1); ctx.lineTo(x0, y1 - 2); ctx.closePath(); ctx.fill(); };
    ctx.save();
    if (img) {   // X dark mode: the swept words turn gold (multiply on white letters) over a soft gold marker band (screen)
      ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = rgba(GOLD.shade, .38); mark();
      ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = GOLD.body; mark();
    } else { ctx.fillStyle = rgba(GOLD.body, .55); mark(); }
    ctx.restore();
  });
  ctx.restore(); ctx.restore();
  ctx.save(); ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 1.5; ctx.translate(x, y); ctx.rotate((o.rot ?? .008) + .005 * Math.sin(t * .6 + 1)); ctx.strokeRect(0, 0, w, hh); ctx.restore();
  return { x, y, w, h: hh, full: h, hi: his.map(([a, b, c, d]) => ({ x: x + a, y: y + b, w: c - a, h: d - b })) };
}
// Wang's portrait (ONCE, at "The man is Alexandr Wang"): the duotone paper-cut print, standing in a cream frame-less cut; x, y = bottom
// centre, h = height; u rises it from behind a mask line at y (a print slid up out of the post header slot); o: { a, rot }
export function portrait(ctx, t, x, y, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const img = IMG.get('portrait'), w = img ? h * img.width / img.height : h * ASSETS.portrait.aspect, k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - h * 1.2, w * 2, h * 1.2); ctx.clip();
  ctx.translate(x, y + (1 - k) * h); ctx.rotate((o.rot ?? -.02) + .006 * Math.sin(t * .5));
  halo(ctx, 0, -h * .55, h * .8, .22, P.halo2, CREAM);
  if (img) ctx.drawImage(img, -w / 2, -h, w, h);
  else {   // placeholder: a head-and-shoulders silhouette in the duotone, cream cut edge, marked
    const s = h / 600; ctx.fillStyle = PAPER.lit;
    ctx.beginPath(); ctx.ellipse(0, -h * .7, 92 * s, 112 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-250 * s, 0); ctx.bezierCurveTo(-240 * s, -h * .38, -100 * s, -h * .44, 0, -h * .44); ctx.bezierCurveTo(100 * s, -h * .44, 240 * s, -h * .38, 250 * s, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.ind2, GOLD.shade, .25);
    ctx.beginPath(); ctx.ellipse(0, -h * .7, 84 * s, 104 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-240 * s, 0); ctx.bezierCurveTo(-230 * s, -h * .37, -96 * s, -h * .43, 0, -h * .43); ctx.bezierCurveTo(96 * s, -h * .43, 230 * s, -h * .37, 240 * s, 0); ctx.closePath(); ctx.fill();
    E.glowText(ctx, 'PORTRAIT PLACEHOLDER', 0, -h * .2, { size: Math.max(12, 18 * s * 1.6), weight: 700, align: 'center', col: 'rgba(200,40,140,.95)', glow: false });
  }
  ctx.restore();
  return { x, y, w, h };
}
// the name lower third for the portrait (screen space, ≥ 22 px, above y 880): NAME (serif) / ROLE · LAB
export function nameplate(ctx, t, x, y, u, name = 'ALEXANDR WANG', role = 'CHIEF AI OFFICER, META · LEADS META SUPERINTELLIGENCE LABS') {
  u = clamp(u); if (u <= 0) return;
  goldSpan(ctx, [[x - 18, y - 40], [x - 18, y + 26]], 0, smooth(clamp(u * 1.6)), { w: 1.6, spark: false });
  maskLine(ctx, [[name, 0]], x, y, 44, rise(u), { glow: true });
  maskLine(ctx, [[role, 0]], x, y + 34, 22, rise(span(u, .2, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
}

// ======================================================================================================================== SOURCES / ON-SCREEN STRINGS
// From skript/text-v2.md [EINBLENDUNG]/[ZITATKARTE] lines (23.11.). If a fact-checked text-v3 changes one, text-v3 WINS (say so in your report).
export const SOURCES = {
  headline: ['SUPERINTELLIGENCE', 'IS ARRIVING'], headlineCredit: 'ALEXANDR WANG, CHIEF AI OFFICER, META · ESSAY ON X · NOV 22, 2026',
  isHeRight: 'IS HE RIGHT?', proofClaimed: 'PROOF CLAIMED · NOV 20, 2026', riemann: ['RIEMANN HYPOTHESIS', 'UNSOLVED'], correct: 'CORRECT',
  pages: '250,000+ PAGES', unreadable: 'AN ANSWER WE CAN’T READ', checks5: 'IS HE RIGHT? · 5 CHECKS',
  wang: ['ALEXANDR WANG', 'CHIEF AI OFFICER, META · LEADS META SUPERINTELLIGENCE LABS'], noSource: 'SOURCE: —', labels2: ['CONVICTION', 'INTEREST'],
  lines17: '≈ 17 MILLION LINES', lines17Sub: 'PUBLISHED NOV 20, 2026', lean: 'LEAN · PROOF CHECKER',
  community: 'LEAN & MATHLIB COMMUNITY · NOV 21', mit: 'ANDREW SUTHERLAND, MIT · INDEPENDENT RE-CHECK · AS OF NOV 22',
  clay: 'CLAY MILLENNIUM PRIZE · $1 MILLION · NOT AWARDED', tautology: 'OBJECTION: “TAUTOLOGY” · AMY NIELSEN',
  mathlib: 'DEFINITION TAKEN FROM MATHLIB, THE REFEREE’S STANDARD LIBRARY · NOT WRITTEN BY THE AUTHOR',
  alpoge: 'LEVENT ALPÖGE · ANTHROPIC · CLAUDE', sixWeeks: 'OCT 6 – NOV 16, 2026 · ABOUT SIX WEEKS',
  outrageous: '“frankly completely outrageous”', outrageousSrc: 'LEVENT ALPÖGE, AS REPORTED BY THE NEW YORK TIMES',
  rival: 'SAME DAY · A RIVAL PROOF CLAIM BY A HUMAN · REPORTED BY SCIENTIFIC AMERICAN',
  tao: '“the digestion process will take some time”', taoSrc: 'TERENCE TAO, BLOG, NOV 20, 2026', radz: 'MAKSYM RADZIWIŁŁ',
  notUnderstood: 'CORRECT ≠ UNDERSTOOD', open: 'OPEN',
  maynard: '“historic milestone”', maynardSrc: 'JAMES MAYNARD, FIELDS MEDAL', lecun: 'YANN LECUN · LEFT META IN NOV 2025',
  scenario: 'SCENARIO · A FEW YEARS FROM NOW', leanOpen: 'LEAN · OPEN · RUN BY A NONPROFIT (LEAN FRO) · ANYONE CAN RE-RUN THE CHECK',
  option: 'OPTION · UNTESTED', leanFro: 'LEAN FRO · NONPROFIT', showWork: 'SHOW YOUR WORK', seats: ['LABS', 'GOVERNMENTS', 'INVESTORS', 'VOTERS'],
  aiSolved: 'AI SOLVED ___', twoQ: ['CAN A HUMAN FOLLOW IT?', 'WHO SAYS “CORRECT”?'],
  core: ['We may never read every answer.', 'But who gets to say “correct” has to stay human.'],
};
