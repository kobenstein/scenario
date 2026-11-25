// Film 75 · "Our Minds Aren't Ready for Superintelligence" (thumbnail A: GODLIKE AI JUST ARRIVED) · shared kit (owned by the lead;
// builders import, never edit — wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText,
// the 2.5D card stage cam3/card/aim/project/camDrift, finish) + lib/f16_kit.mjs (rise, maskLine, measure) + lib/f54_kit.mjs (bracket, source).
// Stage: THE WALL (lib/f75_explain.mjs) · Leitbild: THE SUNRISE (lib/f75_world.mjs, anchors only) · plan: docs/MOTION.md + docs/shots.md.
//
//   THE CLOCKS (the spine of the film; the script's "clocks" are NEVER drawn as clock faces, hourglasses or calendars: REGELN §9.4 /
//   MOTION.md §6). Four small TEMPO GAUGES, big only where a sentence is about them, otherwise the HUD top left (clocksHud):
//     BRAIN  = flintClock: a flint tablet with Stone Age tally scratches; a new scratch takes forever (ochre).
//     RULES  = cogClock: a cog that clicks ONE notch at a time (cream); dashed until "the slower clock can be set".
//     YOU    = ringClock: a breath ring in the coat yellow; dashed (empty, "you are carrying it") until "It's the clock you are carrying".
//     AI     = counterClock: a racing digital counter (gold, the machine's light).
//     THE GAP = gapBracket between the human clocks and the counter. Wide all film; at "The gap won't close completely" it shrinks to
//     ~45 %, never to zero. The HUD changes by itself on the CLOCK phrases (never by hand).
//   THE SPHERE (godlike AI, thumbnail A): sphere(). THE HAND AXE (Stone Age, in your raised hand in thumbnail A): handAxe().
//   THE EVENING (you, the phone, the headline, the pulse): phone(), headline(), pulseLine(); the sofa is X.sofa (lib/f75_explain.mjs).
//   THE THREE REFLEXES (FEAR · GRAB · STRAIGHT LINE): reflexes() = three niches cut into the wall. stoneHead() (a head in profile, flint;
//   never a brain), mammal() (cave-wall silhouettes: mouse, wolf, hunter), crowd() (a row of small people = "a whole society").
//
// Colour code (meaning, never violate): GOLD = the machine's light (the sphere, its counter) = the ONE hero light when it is on screen ·
// OCHRE = the old reflexes / the Stone Age (alarm node, pulse spike, flint, cave marks; never red) · CREAM = rules, laws, paper, statements ·
// COOL (pale blue) = screens, phones, apps, headlines, chatbots · COAT yellow = only you (the figure, your breath ring).
// Past = screen LEFT, the machine runs off to the RIGHT. Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded
// randomness only; nothing from nowhere.
import { Path2D, PathOp, loadImage, GlobalFonts, createCanvas } from '@napi-rs/canvas';
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

export const PRINT75 = { grain: 14, floor: 4, vig: .5 };
export const CREAM = '#f3efe2', CREAM2 = '#a49fc4';
export const GOLD = { core: '#fff8dc', hot: '#ffe9a6', body: '#f6c95c', mid: '#e3a63f', shade: '#b8792a', deep: '#6e4416', halo: '#f2b632', line: '#ffd982', text: '#ffe7a8' };
export const PAPER = { body: '#ece4c8', lit: '#f7f0d8', shade: '#cfc4a2', edge: '#a99d7c', ink: '#141a3c', faint: '#8a8166' };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
export const EARTH = { top: '#6b4a2c', body: '#4a2f1e', deep: '#2a1a14', warm: '#8a5a32', line: '#a77443', rim: '#c48a52' };
export const INK = { far: mixHex(P.ind0, P.blue0, .3), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, rim: mixHex(GOLD.line, P.blue1, .55) };
export const LAMP = { core: P.cream, body: mixHex(P.cream, P.halo2, .35), deep: mixHex(P.halo2, P.night1, .55) };
// film 75: the old reflexes / the Stone Age (alarm node, pulse spike, flint, cave marks) = OCHRE, never red
export const OCHRE = { core: '#ffe2b8', hot: '#f6b56e', body: '#d98a4a', mid: '#b86e36', deep: '#5e3318', line: '#efa463', text: '#f7c99a' };
export const FLINT = { lit: mixHex('#b7a58c', P.blue1, .25), body: mixHex('#7d6d5c', P.night1, .35), shade: mixHex('#4c4036', P.night0, .45), edge: '#d9c7a6' };
export const COAT = { base: P.coat, lit: mixHex(P.coat, P.core1, .45), shade: mixHex(P.coat, P.shade0, .62), ring: '#f7c24a' };
export const WALLC = { base: P.night1, hi: mixHex(P.night1, P.ind1, .7), lo: mixHex(P.night0, P.night1, .4), seam: mixHex(P.night1, P.blue1, .35) };
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
// Film 75 clips: C2 Bengio (UN Security Council) · K1 E. O. Wilson (Big Think 2017) · C1 Harari. The real cuts come later (another step):
// until then the slots are placeholders (tools/provisional_timing.py) and the plate shows a marked placeholder.
// The plate grows out of a thing in the world (o.from = { x, y, w, h } screen rect, or [cx, cy, r]) and goes back into it.
// Lower third ABOVE the plate (≥ 22 px): NAME (serif) · ROLE · YEAR … ORIGINAL FOOTAGE (+ credit) at the right. Roles: text-v2.md.
// <ROOT>clips-geprueft.json (when it lands) overrides name/role/year (fields name, rolle|role, jahr|year, credit, crop, cropDy).
// Frames: <F75CLIPS or /tmp/claude-0/f75/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, frame 1 = the slot start; tools/f75_clips.py clips).
// Until the frames exist a marked placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIPS = {   // text-v2.md §Clips + vo-v3 (25.11.): Bauchbinde wording; clips-geprueft.json (when it lands) overrides
  C2: { name: 'Yoshua Bengio', role: 'Co-chair, UN Scientific Panel on AI', year: '2026' },          // UN Security Council, 23 Sep 2026 (UN channel)
  K1: { name: 'E. O. Wilson', role: 'Biologist', year: '2017' },                                     // Big Think 2017
  C1: { name: 'Yuval Noah Harari', role: 'Author', year: '2026' },                                   // 'Historian' only once faktenzettel #70 line is in
};
try {   // clips-geprueft.json (24.11.): { clips: [{ id, file, speaker, lower_third: 'NAME · Role · Year · ORIGINAL FOOTAGE', channel, duration_s, … }] }
  const j = JSON.parse(fs.readFileSync(ROOT + 'clips-geprueft.json', 'utf8'));
  for (const c of j.clips || []) { const k = CLIPS[c.id]; if (!k) continue;
    if (c.speaker) k.name = c.speaker;
    if (c.lower_third) { const q = c.lower_third.split('·').map((x) => x.trim()); if (q.length >= 3) { k.role = q[1]; k.year = q[2]; } const cq = q.find((x) => x.startsWith('©')); if (cq) k.credit = cq; }
    const cc = /©[^)]*/.exec(c.channel || ''); if (cc) k.credit = cc[0].trim();
    for (const [a, b] of [['rolle', 'role'], ['role', 'role'], ['jahr', 'year'], ['year', 'year'], ['credit', 'credit'], ['crop', 'crop'], ['cropDx', 'cropDx'], ['cropDy', 'cropDy']]) if (c[a] != null) k[b] = c[a]; }
} catch { /* not there yet */ }
const CLIPDIR = (process.env.F75CLIPS || '/tmp/claude-0/f75/clips/').replace(/\/?$/, '/');
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
    const cr = info.crop ?? 1, sw = fr.width * cr, sh = fr.height * cr, sx = Math.max(0, Math.min(fr.width - sw, (fr.width - sw) / 2 + (info.cropDx ?? 0) * fr.width)), sy = Math.min(fr.height - sh, (fr.height - sh) / 2 + (info.cropDy ?? 0) * fr.height);
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


// ======================================================================================================================== THE TITLE (frame 0)
// OUR MINDS AREN'T / READY like thumbnail A (heavy condensed caps, centred at the top; line 1 gold, line 2 cream). u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const lines = o.lines ?? SOURCES.title, cols = o.cols ?? ['#ffd982', '#fff6e0'], cond = o.cond ?? .74, cx = o.x ?? W / 2, y = o.y ?? 250;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `100px "Inter Black"`; const wide = Math.max(...lines.map((l) => ctx.measureText(l).width)) * cond / 100;
  const size = Math.min(o.size ?? 200, (o.maxW ?? 1180) / wide), lh = size * .9;
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)), ex = o.out != null ? sineIO(clamp(o.out * 1.15 - i * .12)) : 0; if (ui <= 0 || ex >= 1) return;
    ctx.font = `${size}px "Inter Black"`; const lw = ctx.measureText(ln).width * cond;
    const k = expoOut(ui), yy = y + i * lh + (1 - k) * size * .5 + ex * size * .95;   // exit: an even sink behind the line's mask
    ctx.save(); ctx.beginPath(); ctx.rect(0, y + i * lh - size * .82, W, size * .9); ctx.clip();
    ctx.translate(cx - lw / 2, yy); ctx.scale(cond, 1); ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = rgba(GOLD.halo, .8); ctx.shadowBlur = size * .18; ctx.fillStyle = cols[i % cols.length]; ctx.fillText(ln, 0, 0);
    ctx.shadowBlur = 0; ctx.fillStyle = mixHex(cols[i % cols.length], '#ffffff', .25); ctx.fillText(ln, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

// ======================================================================================================================== THE SPHERE (godlike AI)
// The giant light of thumbnail A: a gold sphere with a hot core, a mottled surface, stipple dust, a halo, and (o.rays 0..1) the broad
// alternating beams of the thumbnail. o.a, o.rays, o.rot (beam rotation), o.steps (0..n: capability rings that pulse outward), o.hill
// (screen y below which the sphere is hidden: it rises behind a hill), o.dust (count, default scales with r), o.seed.
export function sphere(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (o.hill != null) { ctx.beginPath(); ctx.rect(x - r * 9, y - r * 9, r * 18, o.hill - (y - r * 9)); ctx.clip(); }
  const rays = o.rays ?? 0;
  if (rays > 0) {   // broad beams (thumbnail A): 18 wedges, every other one wide, a long gold fall-off; lighter composite
    ctx.save();   // source-over gold (not 'lighter': gold + night blue would turn white)
    const n = 18, rot = (o.rot ?? 0) + t * .006, L = r * (o.rayLen ?? 5.5);
    for (let i = 0; i < n; i++) {
      const q = rot + (i / n) * Math.PI * 2, w = (i % 2 ? .055 : .1) * (1 + .15 * Math.sin(t * .4 + i)), al = i % 2 ? .62 : 1;
      ctx.fillStyle = rad(ctx, x, y, L, [[0, rgba(GOLD.hot, .9 * rays * al)], [r / L, rgba(GOLD.body, .72 * rays * al)], [.42, rgba(GOLD.halo, .34 * rays * al)], [1, rgba(GOLD.halo, 0)]], r * .9);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, L, q - w, q + w); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  halo(ctx, x, y, r * 2.6, .55, GOLD.halo, GOLD.hot);
  ctx.fillStyle = rad(ctx, x - r * .12, y - r * .18, r * 1.08, [[0, GOLD.core], [.35, GOLD.hot], [.75, GOLD.body], [.93, GOLD.mid], [1, mixHex(GOLD.mid, GOLD.shade, .5)]]);
  ctx.beginPath(); ctx.arc(x, y, r * (1 + .006 * Math.sin(t * 1.1)), 0, Math.PI * 2); ctx.fill();
  // mottled surface (large soft spots, seeded, slowly turning), clipped to the disc
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  const rr = prng(o.seed ?? 75);
  for (let i = 0; i < 14; i++) {
    const ang = rr() * 6.283 + t * .01, d = Math.sqrt(rr()) * r * .85, sx = x + Math.cos(ang) * d, sy = y + Math.sin(ang) * d, sr = r * (.12 + rr() * .22);
    ctx.fillStyle = rad(ctx, sx, sy, sr, [[0, rgba(GOLD.mid, .22)], [1, rgba(GOLD.mid, 0)]]); ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
  }
  ctx.restore();
  E.dust(ctx, o.seed ?? 75, o.dust ?? Math.round(clamp(r / 300, .15, 1) * 2400), x, y, r * .7, r * .7, t, .55, GOLD.core);
  const st = o.steps ?? 0;   // capability rings: each step a ring leaves the rim and fades out wide (pulse outward)
  for (let i = 0; i < 4; i++) { const p = st - i; if (p <= 0 || p >= 1.6) continue; const k = clamp(p / 1.6);
    ctx.strokeStyle = rgba(GOLD.line, .7 * (1 - k)); ctx.lineWidth = r * .03 * (1 - k * .6); ctx.beginPath(); ctx.arc(x, y, r * (1 + .7 * expoOut(k)), 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
}

// ======================================================================================================================== THE HAND AXE
// An Acheulean hand axe (teardrop flint), point along -y, length s (point to butt), rotated rot. Facets in flint tones, a warm lit edge
// on the side of the light (o.light ±1), o.glow (ochre rim glow, the Stone Age "light"), o.a.
export function handAxe(ctx, x, y, s, rot = 0, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const out = new Path2D(); out.moveTo(0, -.5); out.bezierCurveTo(.16, -.3, .33, .05, .3, .28); out.bezierCurveTo(.27, .46, .12, .5, 0, .5);
  out.bezierCurveTo(-.12, .5, -.27, .46, -.3, .28); out.bezierCurveTo(-.33, .05, -.16, -.3, 0, -.5); out.closePath();
  if (o.glow) { ctx.save(); ctx.shadowColor = rgba(OCHRE.hot, .8 * o.glow); ctx.shadowBlur = 40 * o.glow / Math.max(.2, s / 100); ctx.fillStyle = FLINT.body; ctx.fill(out); ctx.restore(); }
  ctx.fillStyle = FLINT.body; ctx.fill(out);
  ctx.save(); ctx.clip(out); const L = o.light ?? 1;
  const facets = [[[-.4, -.6], [0, -.5], [.06, -.05], [-.4, .1]], [[0, -.5], [.4, -.6], [.4, .15], [.06, -.05]], [[-.4, .1], [.06, -.05], [.1, .6], [-.4, .6]], [[.06, -.05], [.4, .15], [.4, .6], [.1, .6]]];
  facets.forEach((f, i) => { ctx.fillStyle = [mixHex(FLINT.body, FLINT.lit, L > 0 ? .2 : .6), mixHex(FLINT.body, FLINT.lit, L > 0 ? .7 : .15), mixHex(FLINT.body, FLINT.shade, .55), mixHex(FLINT.body, FLINT.lit, L > 0 ? .35 : .05)][i];
    ctx.beginPath(); f.forEach(([u, v], j) => (j ? ctx.lineTo(u, v) : ctx.moveTo(u, v))); ctx.closePath(); ctx.fill(); });
  ctx.restore();
  ctx.strokeStyle = rgba(FLINT.edge, .85); ctx.lineWidth = .022; ctx.beginPath(); ctx.moveTo(0, -.5); ctx.bezierCurveTo(.16 * L, -.3, .33 * L, .05, .3 * L, .28); ctx.stroke();
  ctx.restore();
}

// ======================================================================================================================== THE EVENING: PHONE · HEADLINE · PULSE
// phone: a dark slab (w = .5 h), the screen glows cool when o.on (0..1); returns the screen rect (in the caller's space) so a headline,
// a grade badge or a bar can sit on it. o.rot, o.glow (light spill), o.draw(ctx, rect) = what is on the screen (clipped).
export function phone(ctx, t, x, y, h, o = {}) {
  const w = h * .5, on = clamp(o.on ?? 1), rot = o.rot ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (on > 0 && o.glow !== false) halo(ctx, 0, 0, h * 2.2, .3 * on * (o.glow ?? 1), COOL.halo, COOL.core);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .16); ctx.fill();
  const sr = { x: -w / 2 + w * .07, y: -h / 2 + h * .05, w: w * .86, h: h * .9 };
  ctx.fillStyle = mixHex(P.night1, mixHex(COOL.deep, COOL.body, .55), on); ctx.beginPath(); ctx.roundRect(sr.x, sr.y, sr.w, sr.h, w * .1); ctx.fill();
  if (o.draw && on > 0) { ctx.save(); ctx.beginPath(); ctx.roundRect(sr.x, sr.y, sr.w, sr.h, w * .1); ctx.clip(); ctx.globalAlpha *= on; o.draw(ctx, sr); ctx.restore(); }
  ctx.strokeStyle = rgba(COOL.line, .35 + .3 * on); ctx.lineWidth = Math.max(1, h * .012); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .16); ctx.stroke();
  ctx.restore();
  return { x: x + sr.x, y: y + sr.y, w: sr.w, h: sr.h, cx: x, cy: y };
}
// headline: a news headline as bars (no real headline, no logo): line 1 = "AI" in heavy caps + bars, two more lines of bars.
// x, y = top left of the block, w = width. o.u (lands: drops in from above), o.big 0..1 (Big letters: the bars grow thick),
// o.bad 0..1 (Bad news: two bars turn ochre with an underline), o.seed (another headline: 5.01), o.col (bar colour), o.a.
export function headline(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const big = smooth(clamp(o.big ?? 0)), bad = smooth(clamp(o.bad ?? 0)), r = prng(o.seed ?? 7), k = expoOut(u);
  const lh = w * lerp(.12, .16, big), bh = lh * lerp(.5, .72, big), col = o.col ?? COOL.core;
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y - (1 - k) * lh * 1.6);
  ctx.font = `${Math.round(bh * 1.25)}px "Inter Black"`; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = col;
  const aiW = ctx.measureText('AI').width; ctx.fillText('AI', 0, bh * 1.02);
  const rows = [[aiW + bh * .4, w], [0, w * (.78 + r() * .2)], [0, w * (.42 + r() * .25)]], badIx = [[0, 1], [1, 0]];
  rows.forEach(([x0, x1], i) => {
    let xx = x0; const yy = i * lh + (i ? lh * .22 : 0); let j = 0;
    while (xx < x1 - bh) { const ww = Math.min(x1 - xx, bh * (1.4 + r() * 2.6)); const isBad = badIx.some(([a1, b1]) => a1 === i && b1 === j);
      ctx.fillStyle = isBad ? mixHex(col, OCHRE.body, bad) : col; ctx.globalAlpha *= 1; ctx.fillRect(xx, yy + (lh - bh) * .1, ww, bh * (i ? .8 : 1));
      if (isBad && bad > 0) { ctx.fillStyle = rgba(OCHRE.hot, bad); ctx.fillRect(xx, yy + bh * (i ? .8 : 1) + bh * .12, ww * bad, Math.max(2, bh * .12)); }
      xx += ww + bh * .38; j++; }
  });
  ctx.restore();
  return { x, y, w, h: lh * 3 };
}
// pulseLine: an ochre heartbeat line from x0 to x1 at baseline y. spikes [[x, amp 0..1 (of o.h), u 0..1 (how far the beat has risen)]],
// o.u 0..1 = how much of the line is drawn (from x0), o.h spike height, o.w width, o.a. The beat shape: small dip, tall peak, deep dip.
export function pulseLine(ctx, t, x0, x1, y, spikes = [], o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const h = o.h ?? 160, n = Math.max(24, Math.round(Math.abs(x1 - x0) / 4)), xe = lerp(x0, x1, u), pts = [];
  const beat = (d) => (d < -.6 || d > 1 ? 0 : d < -.3 ? .12 * Math.sin((d + .6) / .3 * Math.PI) : d < .2 ? -Math.sin((d + .3) / .5 * Math.PI) : .35 * Math.sin((d - .2) / .8 * Math.PI));
  for (let i = 0; i <= n; i++) { const xx = lerp(x0, xe, i / n); let yy = y; for (const [sx, amp, su = 1] of spikes) yy += beat((xx - sx) / (h * .45)) * h * amp * clamp(su); yy += Math.sin(xx * .02 + t * 3) * 1.2; pts.push([xx, yy]); }
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const [k, al, c] of [[4, .18, OCHRE.hot], [1.8, .9, OCHRE.body], [.8, 1, OCHRE.core]]) { ctx.strokeStyle = rgba(c, al * (o.a ?? 1)); ctx.lineWidth = (o.w ?? 4) * k; ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke(); }
  ctx.restore();
  if (u < 1) halo(ctx, xe, pts[pts.length - 1][1], (o.w ?? 4) * 10, .6 * (o.a ?? 1), OCHRE.hot, OCHRE.core);
  return pts;
}

// pulsePath: the same ochre heartbeat along a polyline (the pulse that travels: from your chest back through the animals into the head).
// pts [[x, y], …], drawn from arc length o.s0 (default 0: a tail that drains forward) to s1; spikes [[s (arc length), amp 0..1, u 0..1]]
// lift the line UP (−y) round arc s. o.h spike height, o.w width, o.a. Returns { head: [x, y], len (total arc length) }.
export function pulsePath(ctx, t, pts, s1, spikes = [], o = {}) {
  const seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push([L, d, i]); L += d; }
  const at = (s) => { s = clamp(s, 0, L); for (const [a, d, i] of seg) if (s <= a + d + 1e-6) { const f = d ? (s - a) / d : 0; return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; } return pts[pts.length - 1]; };
  const s0 = clamp(o.s0 ?? 0, 0, L); s1 = clamp(s1, 0, L); if (s1 <= s0 + 1) return { head: at(s1), len: L };
  const h = o.h ?? 120, beat = (d) => (d < -.6 || d > 1 ? 0 : d < -.3 ? .12 * Math.sin((d + .6) / .3 * Math.PI) : d < .2 ? -Math.sin((d + .3) / .5 * Math.PI) : .35 * Math.sin((d - .2) / .8 * Math.PI));
  const out = []; const n = Math.max(12, Math.round((s1 - s0) / 5));
  for (let k = 0; k <= n; k++) { const s = lerp(s0, s1, k / n), [x, y] = at(s); let yy = y; for (const [ss, amp, su = 1] of spikes) yy += beat((s - ss) / (h * .45)) * h * amp * clamp(su); out.push([x, yy + Math.sin(s * .02 + t * 3) * 1.2]); }
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const [k, al, c] of [[4, .18, OCHRE.hot], [1.8, .9, OCHRE.body], [.8, 1, OCHRE.core]]) { ctx.strokeStyle = rgba(c, al * (o.a ?? 1)); ctx.lineWidth = (o.w ?? 4) * k; ctx.beginPath(); out.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke(); }
  ctx.restore();
  const hd = out[out.length - 1]; if (s1 < L - 1) halo(ctx, hd[0], hd[1], (o.w ?? 4) * 10, .6 * (o.a ?? 1), OCHRE.hot, OCHRE.core);
  return { head: hd, len: L, at };
}

// ======================================================================================================================== THE CLOCKS (tempo gauges, never clock faces)
// flintClock: a flint tablet (rounded, chipped) with Stone Age tally scratches. x, y = centre, s = width. o.n tally marks (default 9),
// o.next 0..1 (a new scratch being cut, slowly), o.a, o.glow.
export function flintClock(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const h = s * .62, r = prng(17), n = o.n ?? 9;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  const pts = []; for (let i = 0; i < 14; i++) { const q = i / 14 * Math.PI * 2, rr = 1 + (r() - .5) * .14; pts.push([Math.cos(q) * s / 2 * rr, Math.sin(q) * h / 2 * rr]); }
  if (o.glow) halo(ctx, 0, 0, s * 1.1, .25 * o.glow, OCHRE.mid, OCHRE.hot);
  ctx.fillStyle = lin(ctx, -s / 2, -h / 2, s / 2, h / 2, [[0, FLINT.lit], [.5, FLINT.body], [1, FLINT.shade]]);
  ctx.beginPath(); pts.forEach(([u, v], i) => (i ? ctx.lineTo(u, v) : ctx.moveTo(u, v))); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(FLINT.edge, .5); ctx.lineWidth = Math.max(1, s * .012); ctx.stroke();
  const gap = s * .075, x0 = -((n) * gap) / 2;
  ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.5, s * .028);
  for (let i = 0; i <= n; i++) {
    const p = i < n ? 1 : clamp(o.next ?? 0); if (p <= 0) continue;
    const xx = x0 + i * gap + (i % 5 === 4 ? 0 : 0), top = -h * .26, bot = h * .26;
    ctx.strokeStyle = rgba(i < n ? OCHRE.line : OCHRE.hot, i < n ? .85 : 1);
    ctx.beginPath(); if (i % 5 === 4 && i < n) { ctx.moveTo(xx - gap * 4.2, bot * .8); ctx.lineTo(xx + gap * .2, top * .8); } else { ctx.moveTo(xx, top); ctx.lineTo(xx + s * .01, lerp(top, bot, p)); } ctx.stroke();
  }
  ctx.restore();
}
// cogClock: a cog with 12 teeth; turns ONE notch at a time. x, y = centre, r = outer radius. o.notch (real number: notches turned; the
// caller eases it), o.dashed 0..1 (1 = only a dashed outline: not yet set), o.glow 0..1 (cream light), o.a, o.col.
export function cogClock(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const d = clamp(o.dashed ?? 0), col = o.col ?? CREAM, rot = (o.notch ?? 0) * Math.PI * 2 / 12 + .0008 * Math.sin(t * .7);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  const path = new Path2D(), n = 12, ri = r * .8;
  for (let i = 0; i < n; i++) { const q0 = i / n * Math.PI * 2, q1 = q0 + Math.PI * 2 / n;
    const pt = (rr, q) => [Math.cos(q) * rr, Math.sin(q) * rr];
    const A = pt(ri, q0), B = pt(r, q0 + .08), C = pt(r, q0 + .26), D = pt(ri, q0 + .34), E2 = pt(ri, q1);
    if (!i) path.moveTo(...A); path.lineTo(...B); path.lineTo(...C); path.lineTo(...D); path.lineTo(...E2); }
  path.closePath();
  const hole = new Path2D(); hole.arc(0, 0, r * .3, 0, Math.PI * 2);
  if (o.glow) halo(ctx, 0, 0, r * 2.2, .25 * o.glow, P.halo2, P.core0);
  if (d < 1) { ctx.globalAlpha *= 1 - d; ctx.fillStyle = lin(ctx, -r, -r, r, r, [[0, mixHex(col, '#ffffff', .2)], [1, mixHex(col, P.shade1, .45)]]);
    ctx.fill(path.op(hole, PathOp.Difference)); ctx.globalAlpha /= Math.max(.001, 1 - d); }
  if (d > 0) { ctx.save(); ctx.setLineDash([r * .09, r * .07]); ctx.strokeStyle = rgba(col, .8 * d); ctx.lineWidth = Math.max(1.4, r * .035); ctx.stroke(path); ctx.stroke(hole); ctx.restore(); }
  ctx.restore();
}
// ringClock: your breath ring (coat yellow). o.ink 0..1 (dark under-stroke, for the ring on your coat), o.fill 0..1 (an arc that fills with one breath), o.dashed 0..1 (empty: not yet yours),
// o.spin (rad/s of a small bright mark running round: faster = you notice faster), o.a, o.glow.
export function ringClock(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const d = clamp(o.dashed ?? 0), fill = clamp(o.fill ?? 0), w = Math.max(1.5, r * .16);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  if (o.glow) halo(ctx, 0, 0, r * 2.4, .3 * o.glow, COAT.base, COAT.lit);
  ctx.lineCap = 'round';
  if (o.ink) { ctx.strokeStyle = rgba(P.night0, .55 * o.ink); ctx.lineWidth = w * 1.5; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); }   // a dark under-stroke: readable on the coat
  if (d > 0) { ctx.save(); ctx.setLineDash([r * .22, r * .18]); ctx.lineDashOffset = -t * r * .05; ctx.strokeStyle = rgba(COAT.ring, .75 * d); ctx.lineWidth = w * .45; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  if (d < 1) {
    ctx.strokeStyle = rgba(COAT.shade, .55 * (1 - d)); ctx.lineWidth = w; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    if (fill > 0) { ctx.strokeStyle = rgba(COAT.lit, 1 - d); ctx.lineWidth = w * 1.05; ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * fill); ctx.stroke(); }
    const q = -Math.PI / 2 + (o.spin ?? .6) * t; ctx.fillStyle = rgba(COAT.lit, 1 - d); ctx.beginPath(); ctx.arc(Math.cos(q) * r, Math.sin(q) * r, w * .75, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// counterClock: the machine's clock, a racing digital counter (gold digits on a dark plate). x, y = centre, s = plate width.
// o.speed (counts per second of the last digit, default 26), o.a, o.glow. Digits roll deterministically from t.
export function counterClock(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const h = s * .36, n = 6, sp = o.speed ?? 26, v = Math.floor((t + (o.t0 ?? 0)) * sp + 1e-6);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  halo(ctx, 0, 0, s * 1.1, .28 * (o.glow ?? 1), GOLD.halo, GOLD.hot);
  ctx.fillStyle = mixHex(P.night0, GOLD.deep, .25); ctx.beginPath(); ctx.roundRect(-s / 2, -h / 2, s, h, h * .18); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .8); ctx.lineWidth = Math.max(1.2, s * .01); ctx.stroke();
  ctx.font = `600 ${Math.round(h * .62)}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const digs = String(v % 10 ** n).padStart(n, '0'), cw = s * .86 / n;
  for (let i = 0; i < n; i++) { const xx = -s * .43 + cw * (i + .5); ctx.shadowColor = rgba(GOLD.halo, .9); ctx.shadowBlur = h * .25; ctx.fillStyle = i >= n - 2 ? GOLD.core : GOLD.text; ctx.fillText(digs[i], xx, h * .03); }
  ctx.restore();
}
// gapBracket: THE GAP between x0 and x1 at y (a cream-gold bracket with end ticks), drawn on with u; o.label (default 'THE GAP'),
// o.size (label px, ≥ 22), o.below (label under the line), o.a, o.tick (end tick length).
export function gapBracket(ctx, t, x0, x1, y, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const tk = o.tick ?? 22, a = o.a ?? 1, m = (x0 + x1) / 2, half = (x1 - x0) / 2 * smooth(u);
  ctx.save(); ctx.globalAlpha *= a;
  goldSpan(ctx, [[m - half, y + tk], [m - half, y], [m + half, y], [m + half, y + tk]], 0, 1, { w: o.w ?? 2.2, spark: false });
  ctx.restore();
  if (o.label !== false) X_label(ctx, o.label ?? 'THE GAP', m, y + (o.below ? tk + (o.size ?? 26) * 1.3 : -(o.size ?? 26) * .55), span(u, .4, 1) * a, o.size ?? 26);
}
const X_label = (ctx, txt, x, y, u, size) => goldText(ctx, [[txt, .6]], x, y, size, rise(u), { serif: false, weight: 700, spacing: .12, align: 'center' });

// ---------------------------------------------------------------------------------------------------------------- the HUD
// Top left, ≥ 22 px labels. Layout (screen px): flint · cog · ring … THE GAP … counter. HUD positions are exported so the hook can fly
// the big gauges into them. The state comes from the CLOCK phrases (clockState); never set it by hand.
export const HUD = { y: 112, flint: [132, 112, 84], cog: [236, 112, 30], ring: [318, 112, 24], gap0: 362, gapW: [250, 112], counter: [0, 112, 140], label: 160 };
HUD.counter[0] = HUD.gap0 + HUD.gapW[0] + 18 + HUD.counter[2] / 2;
export const CLOCK = {
  hud: 'And you are carrying it right now',                 // the gauges land in the HUD (end of the hook)
  rulesSet: 'So the slower clock can be set',               // the cog: dashed → solid, first notch
  youSet: "It's the clock you are carrying",                // the ring: dashed → yours
  breaths: ['The smallest version takes one breath', 'You take one breath'],   // the ring fills once (≈ one breath, 3 s)
  ruleTicks: ['So the slower clock can be set', 'a hundred and thirty-five did', 'The other one takes all of us'],
  youTicks: ['That is the first clock you can set'],
  youFaster: 'What if you get faster',                      // the ring's mark runs faster from here on
  gapShrink: ["The gap won't close completely", 'It can get small enough'],   // the gap narrows to ~45 %, never to zero
  clips: ['C2', 'K1', 'C1'],
};
const CT = new WeakMap();
export function clockTimes(T) {
  if (CT.has(T)) return CT.get(T);
  const g = (p) => T.G(p), ge = (p) => T.GE(p);
  const r = { hud: ge(CLOCK.hud), rulesSet: g(CLOCK.rulesSet), youSet: g(CLOCK.youSet), breaths: CLOCK.breaths.map(ge), ruleTicks: CLOCK.ruleTicks.map(g),
    youTicks: CLOCK.youTicks.map(g), youFaster: g(CLOCK.youFaster), gap: [g(CLOCK.gapShrink[0]), ge(CLOCK.gapShrink[1])] };
  CT.set(T, r); return r;
}
const notchEase = (t, ticks, d = .9) => ticks.reduce((s, a) => s + sineIO(span(t, a, a + d)), 0);
// the state at t: { rules: {notch, dashed}, you: {dashed, fill, spin}, gap 1 → .45, ai speed }
export function clockState(T, t) {
  const c = clockTimes(T);
  const breath = c.breaths.reduce((m, b) => Math.max(m, span(t, b - .2, b + 2.8) * (1 - span(t, b + 3.2, b + 4.2))), 0);
  return {
    rules: { notch: notchEase(t, c.ruleTicks), dashed: 1 - smooth(span(t, c.rulesSet - .3, c.rulesSet + .6)) },
    you: { dashed: 1 - smooth(span(t, c.youSet, c.youSet + 1.2)), fill: breath, spin: lerp(.6, 2.4, smooth(span(t, c.youFaster, c.youFaster + 2))), notch: notchEase(t, c.youTicks) },
    gap: lerp(1, .45, sineIO(span(t, c.gap[0], c.gap[1]))), flintNext: clamp((t - 30) / 600),
  };
}
// the HUD. o.a (multiplies), o.hide 0..1 (a builder hides it while a gauge is big on screen), o.labels 0..1 (BRAIN · RULES · YOU · AI under
// the gauges; shown by itself for 4 s after the HUD lands and after "It's the clock you are carrying"), o.state (override for plates).
// Hidden by itself in clip windows (±.6 s). Before CLOCK.hud it draws nothing (the hook flies the gauges in).
export function clocksHud(ctx, t, T, o = {}) {
  const c = clockTimes(T); if (t < c.hud - 1e-6 && !o.force) return;
  let a = (o.a ?? 1) * (1 - clamp(o.hide ?? 0));
  for (const id of CLOCK.clips) { const w = clipWin(T, id); if (w) a *= 1 - span(t, w.start - .6, w.start) * (1 - span(t, w.end, w.end + .6)); }
  if (a <= .002) return;
  const s = o.state ?? clockState(T, t), gw = lerp(HUD.gapW[1], HUD.gapW[0], (s.gap - .45) / .55), cx = HUD.gap0 + gw + 18 + HUD.counter[2] / 2;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  flintClock(ctx, t, HUD.flint[0], HUD.flint[1], HUD.flint[2], { next: s.flintNext });
  cogClock(ctx, t, HUD.cog[0], HUD.cog[1], HUD.cog[2], { notch: s.rules.notch, dashed: s.rules.dashed });
  ringClock(ctx, t, HUD.ring[0], HUD.ring[1], HUD.ring[2], { dashed: s.you.dashed, fill: s.you.fill, spin: s.you.spin, glow: s.you.fill });
  gapBracket(ctx, t, HUD.gap0, HUD.gap0 + gw, HUD.y - 6, 1, { size: 22, tick: 14, w: 1.6 });
  counterClock(ctx, t, cx, HUD.counter[1], HUD.counter[2], { glow: .7 });
  const lu = o.labels ?? Math.max(span(t, c.hud, c.hud + .6) * (1 - span(t, c.hud + 4, c.hud + 4.6)), span(t, c.youSet + .6, c.youSet + 1.2) * (1 - span(t, c.youSet + 5, c.youSet + 5.6)));
  if (lu > 0) [['BRAIN', HUD.flint[0]], ['RULES', HUD.cog[0]], ['YOU', HUD.ring[0]], ['AI', cx]].forEach(([l, x], i) =>
    goldText(ctx, [[l, i === 3 ? .8 : 0]], x, HUD.label, 22, rise(span(lu, i * .08, .7 + i * .08)), { serif: false, weight: 600, spacing: .12, align: 'center', col: i === 2 ? COAT.lit : P.cream }));
  ctx.restore();
}

// ======================================================================================================================== THE THREE REFLEXES
// Three arched niches cut into the wall, side by side (x = centre of the middle one, y = their base, w = width of ONE niche, gap .35 w).
// 0 FEAR (an ochre alarm node with rings) · 1 GRAB (a hand that closes) · 2 STRAIGHT LINE (a ruled line, one step a day).
// o.on [u0,u1,u2] (each niche cuts in: 0 = flat wall), o.lit [..] (the icon glows), o.labels [..] or false, o.labelU [..], o.grab 0..1
// (the hand closes), o.line 0..1 (the line draws), o.a. Returns the centres [[x, y], …] of the icons (screen / caller space).
export const REFLEX_LABELS = ['FEAR', 'GRAB', 'STRAIGHT LINE'];
export function reflexes(ctx, t, x, y, w, o = {}) {
  const h = w * 1.25, step = w * 1.35, out = [];
  for (let i = 0; i < 3; i++) {
    const on = clamp((o.on ?? [1, 1, 1])[i] ?? 0), lit = clamp((o.lit ?? [0, 0, 0])[i] ?? 0), cx = x + (i - 1) * step;
    out.push([cx, y - h * .45]); if (on <= 0) continue;
    const k = expoOut(on), hh = h * k;
    ctx.save();
    const nic = new Path2D(); nic.moveTo(cx - w / 2, y); nic.lineTo(cx - w / 2, y - hh + w / 2); nic.arc(cx, y - hh + w / 2, w / 2, Math.PI, 0); nic.lineTo(cx + w / 2, y); nic.closePath();
    ctx.fillStyle = lin(ctx, cx, y - hh, cx, y, [[0, mixHex(P.night0, WALLC.lo, .3)], [1, mixHex(P.night0, P.night1, .5)]]); ctx.fill(nic);
    ctx.strokeStyle = rgba(WALLC.seam, .9); ctx.lineWidth = Math.max(1.5, w * .02); ctx.stroke(nic);
    if (lit > 0) { ctx.save(); ctx.clip(nic); halo(ctx, cx, y - h * .45, w * 1.1, .55 * lit, i === 1 ? GOLD.mid : OCHRE.mid, OCHRE.hot); ctx.restore(); }
    const ia = clamp(on * 1.4 - .4), ic = mixHex(OCHRE.mid, OCHRE.core, lit);
    ctx.globalAlpha *= ia; ctx.translate(cx, y - h * .45);
    if (i === 0) {   // the alarm node
      ctx.fillStyle = ic; ctx.beginPath(); ctx.arc(0, 0, w * .1 * (1 + .08 * Math.sin(t * 3)), 0, Math.PI * 2); ctx.fill();
      for (let k2 = 0; k2 < 2; k2++) { const p = ((t * .7 + k2 * .5) % 1); ctx.strokeStyle = rgba(ic, (1 - p) * (.4 + .6 * lit)); ctx.lineWidth = w * .02; ctx.beginPath(); ctx.arc(0, 0, w * (.14 + .22 * p), 0, Math.PI * 2); ctx.stroke(); }
    } else if (i === 1) {   // the grasping hand: palm + four fingers that curl with o.grab
      const g = smooth(clamp(o.grab ?? .3)), s = w * .32; ctx.strokeStyle = ic; ctx.lineCap = 'round'; ctx.lineWidth = s * .2;
      ctx.fillStyle = ic; ctx.beginPath(); ctx.roundRect(-s * .45, -s * .05, s * .9, s * .7, s * .2); ctx.fill();
      for (let f = 0; f < 4; f++) { const fx = -s * .36 + f * s * .24, L = s * (.55 - Math.abs(f - 1.5) * .06); ctx.beginPath(); ctx.moveTo(fx, -s * .02); const q = -Math.PI / 2 + g * 2.2; ctx.lineTo(fx + Math.cos(q) * L * .5, -s * .02 + Math.sin(q) * L * .5); ctx.lineTo(fx + Math.cos(q + g * 1.2) * L * .5 + Math.cos(q) * L * .5, -s * .02 + Math.sin(q) * L * .5 + Math.sin(q + g * 1.2) * L * .5); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(-s * .45, s * .3); ctx.lineTo(-s * .72, s * .02 + g * s * .2); ctx.stroke();
    } else {   // the straight line: ruled steps, one a day
      const lu = clamp(o.line ?? 1), s = w * .36; ctx.strokeStyle = ic; ctx.lineWidth = w * .03; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-s, s * .5); ctx.lineTo(lerp(-s, s, lu), lerp(s * .5, -s * .5, lu)); ctx.stroke();
      for (let d = 0; d <= 4; d++) { const p = d / 4; if (p > lu + 1e-6) break; ctx.fillStyle = ic; ctx.beginPath(); ctx.arc(lerp(-s, s, p), lerp(s * .5, -s * .5, p), w * .028, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
    const lab = o.labels === false ? null : (o.labels ?? REFLEX_LABELS)[i];
    if (lab) goldText(ctx, [[lab, i === 1 ? .5 : .2]], cx, y + Math.max(30, w * .2), Math.max(22, w * .13), rise(clamp((o.labelU ?? [on, on, on])[i] ?? on)), { serif: false, weight: 700, spacing: .12, align: 'center', col: OCHRE.text });
  }
  return out;
}

// ======================================================================================================================== STONE HEAD · MAMMALS · CROWD
// stoneHead: a head and shoulders in profile facing right (flint dark, lit rim), NEVER a brain. x, y = base of the neck, h = height.
// o.node 0..1 (the ochre alarm node inside, behind the eye), o.watch 0..1 (a lit window inside the head grows: the watched part of
// your mind), o.dark 0..1 (the inside goes dark: 'unwatched'), o.a, o.dir ±1. Returns { node: [x, y], top: [x, y] }.
export function stoneHead(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1, dir = o.dir ?? 1; if (a <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(h * dir, h);
  const p = new Path2D();
  p.moveTo(-.42, 0); p.bezierCurveTo(-.4, -.2, -.3, -.3, -.2, -.36); p.bezierCurveTo(-.36, -.5, -.34, -.86, -.08, -.96);
  p.bezierCurveTo(.14, -1.02, .34, -.9, .36, -.7); p.lineTo(.42, -.56); p.lineTo(.36, -.53); p.bezierCurveTo(.38, -.46, .36, -.42, .32, -.4);
  p.bezierCurveTo(.3, -.34, .24, -.34, .16, -.34); p.lineTo(.14, -.26); p.bezierCurveTo(.3, -.2, .4, -.12, .42, 0); p.closePath();
  ctx.fillStyle = lin(ctx, -.4, -1, .4, 0, [[0, FLINT.shade], [.6, FLINT.body], [1, mixHex(FLINT.body, FLINT.lit, .4)]]); ctx.fill(p);
  ctx.save(); ctx.clip(p);
  const dk = clamp(o.dark ?? 0); if (dk > 0) { ctx.fillStyle = rgba(P.night0, .75 * dk); ctx.fillRect(-.5, -1.05, 1, 1.1); }
  const wa = clamp(o.watch ?? 0); if (wa > 0) { ctx.fillStyle = rad(ctx, .08, -.68, .42 * wa + .02, [[0, rgba(COAT.lit, .9)], [.6, rgba(COAT.base, .45)], [1, rgba(COAT.base, 0)]]); ctx.fillRect(-.5, -1.05, 1, 1.1); }
  ctx.restore();
  ctx.strokeStyle = rgba(FLINT.edge, .55); ctx.lineWidth = .012; ctx.stroke(p);
  const nd = clamp(o.node ?? 0); if (nd > 0) { ctx.fillStyle = rgba(OCHRE.hot, nd); ctx.beginPath(); ctx.arc(.06, -.6, .035 * (1 + .1 * Math.sin(t * 3.2)), 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  if (nd > 0) halo(ctx, x + .06 * h * dir, y - .6 * h, h * .22, .5 * nd * a, OCHRE.mid, OCHRE.hot);
  return { node: [x + .06 * h * dir, y - .6 * h], top: [x, y - h] };
}
// mammal: cave-wall silhouettes (flat, ochre-on-stone like a painted wall): 'mouse' · 'wolf' · 'hunter' (a person with a hand axe).
// x, y = feet, h = height of the animal's back / the person's head, o.col, o.a, o.dir ±1, o.node 0..1 (the alarm node lights in it).
export function mammal(ctx, t, kind, x, y, h, o = {}) {
  const a = o.a ?? 1, dir = o.dir ?? 1; if (a <= 0) return null;
  let node = null;
  if (kind === 'hunter') {
    const hands = E.person(ctx, x, y, h, { armR: [2.5, 2.7], look: .3, dir, rim: OCHRE.mid });
    handAxe(ctx, hands.R[0], hands.R[1] - h * .04, h * .16, .2 * dir, { glow: o.node ?? 0 });
    node = [x + .02 * h * dir, y - .86 * h];
  } else {
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(h * dir, h);
    const p = new Path2D();
    if (kind === 'mouse') { p.ellipse(0, -.45, .55, .42, 0, Math.PI, 0); p.lineTo(.75, -.3); p.lineTo(.55, -.08); p.lineTo(-.55, -.05); p.closePath(); p.ellipse(.42, -.78, .12, .14, 0, 0, Math.PI * 2);
      const tail = new Path2D(); tail.moveTo(-.55, -.1); tail.bezierCurveTo(-.9, -.1, -1, -.4, -1.25, -.3); p.addPath(tail.stroke({ width: .05 })); node = [x + .4 * h * dir, y - .55 * h]; }
    else { p.moveTo(-.9, -.55); p.bezierCurveTo(-.6, -.85, .3, -.9, .55, -.8); p.lineTo(.75, -1.08); p.lineTo(.82, -.86); p.lineTo(1.12, -.72); p.lineTo(1.05, -.62); p.lineTo(.7, -.55);
      p.lineTo(.62, -.3); p.lineTo(.66, 0); p.lineTo(.52, 0); p.lineTo(.46, -.32); p.lineTo(-.45, -.36); p.lineTo(-.55, 0); p.lineTo(-.7, 0); p.lineTo(-.72, -.4);
      p.bezierCurveTo(-.95, -.4, -1.25, -.5, -1.35, -.38); p.bezierCurveTo(-1.2, -.6, -1, -.6, -.9, -.55); p.closePath(); node = [x + .72 * h * dir, y - .82 * h]; }
    ctx.fillStyle = rgba(o.col ?? OCHRE.mid, .9); ctx.fill(p); ctx.restore();
  }
  const nd = clamp(o.node ?? 0); if (nd > 0 && node) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = rgba(OCHRE.hot, nd); ctx.beginPath(); ctx.arc(node[0], node[1], Math.max(3, h * .045), 0, Math.PI * 2); ctx.fill(); ctx.restore(); halo(ctx, node[0], node[1], h * .35, .5 * nd * a, OCHRE.mid, OCHRE.hot); }
  return { node };
}
// crowd: a row of n small people (indigo silhouettes, varied heights, breathing), x0 → x1 on the baseline y, height h. o.u (they rise out
// of the ground, outward from the centre), o.push 0..1 (they lean forward together: "a whole society" pushes), o.seed, o.a.
export function crowd(ctx, t, x0, x1, y, n, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const r = prng(o.seed ?? 31), pu = smooth(clamp(o.push ?? 0));
  for (let i = 0; i < n; i++) {
    const hh = h * (.82 + r() * .3), f = n > 1 ? i / (n - 1) : .5, d = Math.abs(f - .5) * 2, k = expoOut(clamp(u * 1.8 - d * .8));
    if (k <= 0) continue;
    const xx = lerp(x0, x1, f) + (r() - .5) * (x1 - x0) / n * .4;
    ctx.save(); ctx.beginPath(); ctx.rect(xx - hh, y - hh * 1.3, hh * 2, hh * 1.3); ctx.clip();
    E.person(ctx, xx, y + (1 - k) * hh * 1.1, hh, { lean: .12 * pu + .01 * Math.sin(t * 1.3 + i), armR: [1.4 * pu + .2, 1.5 * pu + .1], dir: o.dir ?? 1, long: r() < .4 });
    ctx.restore();
  }
}

// ======================================================================================================================== SOURCES / ON-SCREEN STRINGS
// From text-v2.md EINBLENDUNG lines, updated to vo-v5 + faktencheck.md (25.11.; no '4 months' on screen), split into a STATEMENT (≤ 6 words + one number, big) and a SOURCE line (F.source, 22 px,
// y 880). "AI" on screen. A fact check runs in parallel (vo-v4 + faktencheck.md): if it changes a figure or wording, the FACT CHECK WINS —
// the lead updates this table (builders: use the keys, never retype a figure; report any string you need that is not here).
export const ASOF = '25 NOV 2026';
export const SOURCES = {
  title: ["OUR MINDS AREN'T", 'READY'],
  godlike: 'GODLIKE AI', stoneAge: 'STONE AGE BRAINS',
  capable: 'MORE CAPABLE · EVERY FEW MONTHS', upgrade: 'BRAIN UPGRADE', upgradeNo: '0%',
  decided: 'YOU DECIDED NONE OF IT', older: 'OLDER THAN OUR SPECIES', whatCan: 'WHAT CAN CATCH UP?', notMachine: 'NOT THE MACHINE', gap: 'THE GAP',
  notOnly: 'NOT YOUR ONLY CLOCK', canBeSet: 'TWO CAN BE SET', society: 'A WHOLE SOCIETY', onePerson: 'ONE PERSON',
  // station 1 · three old reflexes
  mammalsSrc: 'THREAT CIRCUITS ARE SHARED ACROSS MAMMALS · LEDOUX, NEURON, 2012',
  fearFirst: 'FEAR, BEFORE THOUGHT',
  clicks: '+2.3% CLICKS PER NEGATIVE WORD', clicksSrc: '~105,000 HEADLINE VERSIONS TESTED · EACH EXTRA NEGATIVE WORD: +2.3% CLICKS · NATURE HUMAN BEHAVIOUR, 2023',
  colleague: 'A COLLEAGUE', competitor: 'A COMPETITOR', grab: 'GRAB IT', noChoice: '“NO CHOICE”',
  lawOfNature: 'NOT A LAW OF NATURE', choice: 'A CHOICE',
  late: 'IT MAKES US LATE', plusLittle: 'TODAY + A LITTLE', doubles: 'IT DOUBLES',
  metr: 'DOUBLES ROUGHLY EVERY 3.5 MONTHS', metrSrc: 'ONE LEADING MEASURE: LENGTH OF TASKS AI COMPLETES ON ITS OWN (50 % SUCCESS) · METR, 20 NOV 2026: “ROUGHLY EVERY 3.6 MONTHS”',
  olympiad: ['MATH OLYMPIAD GOLD LEVEL · JULY 2025', 'MEDIAN EXPERT FORECAST · 2030'], olympiadSrc: 'FORECASTING RESEARCH INSTITUTE, 2026', early: '5 YEARS EARLY',
  gut: 'WHOSE GUT IS READY?',
  adapt: '“OUR EXTRAORDINARY CAPACITY FOR ADAPTATION”', adaptSrc: 'HÖGBERG, FRONTIERS IN PSYCHOLOGY, JAN 2026 · PERSPECTIVE ARTICLE',
  years: 'YEARS', months: 'MONTHS',
  wilson: ['PALEOLITHIC EMOTIONS', 'MEDIEVAL INSTITUTIONS', 'GODLIKE TECHNOLOGY'], institutions: 'INSTITUTIONS', rulesLaws: ['RULES', 'LAWS'],
  seatBelt: 'A SEAT BELT FOR THE BRAIN', howFast: 'HOW FAST DO RULES MOVE?',
  // station 2 · the slower clock: rules
  aiAct: 'EU AI ACT', proposed: 'PROPOSED · APRIL 2021', chatgpt: 'CHATGPT · NOV 2022', lastRules: 'LAST RULES APPLY · AUG 2028',
  aiActSrc: 'EU AI ACT · PROPOSED APRIL 2021 · LAST HIGH-RISK RULES APPLY AUGUST 2028 · COUNCIL OF THE EU, MAY 2026',
  sevenYears: '7+ YEARS', fewMonths: 'DOUBLES EVERY FEW MONTHS',
  standards: 'PUSHED BACK · STANDARDS NOT READY', standardsSrc: 'HIGH-RISK RULES MOVED TO DEC 2027 / AUG 2028 · DELAYED UNTIL “THE NEEDED STANDARDS AND TOOLS ARE AVAILABLE” · COUNCIL OF THE EU, 7 MAY 2026',
  tooSlow: 'TOO SLOW?',
  ozone: 'OZONE HOLE REPORTED · MAY 1985', montreal: 'MONTREAL PROTOCOL SIGNED · SEPT 1987', montrealSrc: 'UNEP OZONE SECRETARIAT',
  update: 'UPDATE BUILT IN', sixTimes: 'ADJUSTED OR AMENDED 6 TIMES', sixSrc: 'ADJUSTMENTS BIND ALL PARTIES WITHOUT NEW RATIFICATION · UNEP OZONE SECRETARIAT',
  heal: 'RECOVERY EXPECTED IN THE 2070s', healSrc: 'OZONE-DEPLETING CHLORINE DOWN BY ABOUT A THIRD · NOAA/NASA, NOV 2026',
  keptLearning: 'IT KEPT LEARNING', canSet: 'CAN BE SET', notFew: 'NOT IN A FEW MONTHS',
  // station 3 · the faster clock: noticing
  fasterLaw: 'FASTER THAN A LAW?', notOutThink: 'NOT OUT-THINKING IT', notice: 'HOW FAST YOU NOTICE',
  books: 'AUTHOR · HAS BOOKS TO SELL', consciousness: 'DEVELOPING CONSCIOUSNESS', retreat: 'A RETREAT ON A MOUNTAIN?',
  noticeMachine: 'NOTICE WHAT A MACHINE DOES TO IT', tryIt: 'TRY IT', unwatched: 'UNWATCHED', notSmarter: 'NOT SMARTER', noticing: 'NOTICING',
  three: ['THIS IS FEAR', 'THIS IS CRAVING', 'THIS IS PULLING AT YOU'],
  knowsBetter: 'KNOWS YOU BETTER', sellQuote: '“IF THEY GET TO KNOW YOU BETTER THAN YOU KNOW YOURSELF, THEY CAN THEN SELL YOU ANYTHING THEY WANT – BE IT A PRODUCT OR A POLITICIAN.”', sellSrc: 'Y. N. HARARI, 2018',
  harder: 'NOTICED = HARDER TO USE',
  meditation: '“I HAVE ALMOST NO CONTROL OVER MY MIND.”', meditationSrc: 'Y. N. HARARI ON HIS FIRST MEDITATION COURSE (2000)',
  oneBreath: 'ONE BREATH', mindItself: 'UNDERSTANDING THE MIND', mindSrc: '“ADVANCES IN AI AND NEUROTECHNOLOGY ARE OUTPACING OUR UNDERSTANDING OF CONSCIOUSNESS” · FRONTIERS IN SCIENCE, OCT 2025',
  b700: '$700+ BILLION', b700Sub: 'MOSTLY ON AI', b700Src: 'AMAZON, ALPHABET, MICROSOFT, META · PLANNED CAPITAL SPENDING 2026, MOSTLY AI DATA CENTRES (COMPANY FIGURES, MICROSOFT ESTIMATED)',
  m430: '~$430 MILLION', m430Src: 'NIH BRAIN INITIATIVE (FLAGSHIP PROGRAM) · LAST BUDGET, FISCAL YEAR 2026: $429 MILLION',
  ratio: ['2024: “FOR EVERY DOLLAR AND EVERY MINUTE”', '2026: “FOR EVERY $10 … AT LEAST $1”'], ratioSrc: 'Y. N. HARARI', wish: 'A WISH, NOT A CALCULATION', attention: 'WHERE THE ATTENTION IS',
  graded: 'GRADED ON HOW SMART', emptyLine: 'WHAT IT DOES TO YOU',
  humane: 'HUMANEBENCH · 15 CHATBOTS · 800 EVERYDAY QUESTIONS · 2025', early: 'AN EARLY TEST', harmful: '~2/3 TURNED HARMFUL',
  dollarFor: ['NOTICING YOURSELF', 'STUDYING THE MIND', 'GRADING THE MACHINE'], race: 'THE RACE RUNS ON',
  // station 4 · both clocks
  scenario: 'SCENARIO · A FEW YEARS FROM NOW', grade: 'GRADE', tested: 'TESTED BEFORE RELEASE', withinYear: 'WITHIN THE YEAR', byName: 'YOUR REFLEXES BY NAME',
  hassabis: 'DEMIS HASSABIS · CO-FOUNDER, GOOGLE DEEPMIND', hassabisSrc: 'PROPOSAL, JULY 2026: TESTS “REGULARLY UPDATED, PERHAPS QUARTERLY TO START”', quarterly: 'PERHAPS EVERY QUARTER',
  un: 'GLOBAL FRAMEWORK · WITHIN ONE YEAR', unSrc: 'BRIDGETOWN CALL TO ACTION, 23 NOV 2026 · UN SECRETARY-GENERAL · UN SCIENTIFIC PANEL ON AI: FIRST REPORT 1 JULY 2026, EVERY YEAR',
  leaders: ['2017: 3', '2026: 135'], leadersSrc: 'WORLD LEADERS RAISING AI AT THE UN GENERAL ASSEMBLY · COUNT BY UN TECH ENVOY GILL · UN NEWS, 20 NOV 2026',
  notSettled: 'NONE OF IT IS SETTLED', notTreaty: '“IT’S NOT A TREATY, IT’S NOT REGULATION”', notTreatySrc: 'UN ENVOY GILL, NOV 2026',
  paidBy: 'PAID MOSTLY BY THE INDUSTRY', paidBySrc: 'CRITICS OF THE TESTING BODY: SELF-REGULATION',
  choices: 'A PRODUCT OF CHOICES', hands: ['LABS', 'GOVERNMENTS', 'VOTERS'], noVote: 'NEEDS NO VOTE',
  // station 5 · back to the headline
  thisIsFear: 'THIS IS FEAR', youDecide: 'YOU DECIDE', firstClock: 'THE FIRST CLOCK', rulesLearn: 'RULES THAT LEARN',
  steer: 'SMALL ENOUGH TO STEER', core: ["WE CAN'T UPGRADE OUR BRAINS.", 'WE CAN UPGRADE OUR MINDS, AND OUR RULES.'],
};
