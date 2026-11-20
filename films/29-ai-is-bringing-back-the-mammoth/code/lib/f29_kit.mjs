// Film 29 · "AI Is Bringing Back the Mammoth" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du / person, halo, glowText, finish) + lib/f16_kit.mjs (rise, maskLine, measure, stamp).
// Generic blocks (paper, accent light, portal, veil, tag, dotField, ruler, slab, bracket, label, source, camPath) are carried over
// verbatim from Film 55 (docs/ref-55/f55_kit.mjs); everything else is #29's own. World + camera + seams: lib/f29_seams.mjs.
// Plan: docs/MOTION.md · shots: docs/shots.md · builders: docs/BRIEF-builders.md.
//
//   THE FENCE (the one world): a snowy night tundra. A wooden fence in the snow; you (the yellow coat) and a small child hold hands at it,
//   seen from behind. Behind the fence the tundra runs to the horizon; far left the FIELD STATION (a hut, one amber window = the lab).
//   THE POSTER MAMMOTH (frame 0, the hero light): a giant mammoth drawn in gold rungs of light over the horizon, the promise.
//   THE SNOW OF DIFFERENCES: every glint on the snow is one difference in the DNA. 1.4 million of them cover the tundra.
//   THE MACHINE is a cyan comb of light (a scan line) that sweeps over the snow and over strands; what it keeps stays gold.
//   THE TALLY (the clock of the film): one serif number top left that only ever counts what is left:
//   1,400,000 → 1,600 → ~150 → 7 · then the dodo: 1 → 70 → 2,300 · last: 1 (a single vote).
//   THE LIST: the machine's product, a short paper card whose rows the comb writes in cyan. It never changes a gene: it writes the list.
//   THE ANIMAL: ONE parametric body, beast(): an Asian elephant (fur 0, big ears) ↔ a mammoth (fur 1, small ears, dome, hump, long tusks).
//   "Bringing back" = the traits (fur, fat, ears) moving onto the elephant: animate the parameters, never swap the drawing.
//
// API (screen px unless noted; t in seconds; u = 0..1 growth):
//   colours: GOLD (the poster / the dream / what matters: kept glints, traits) · MACH (= CHECK, cyan: the machine, its comb, its list) ·
//            LAMP (people's practical light: the hut window, the lab lamp, breath lit warm) · FUR (the mammoth's red-brown) · HIDE (elephant
//            grey-blue) · FROST (ice, freezer, the ark: cold cream-white) · INK (night forms) · the yellow coat = only you (E.du) · PRINT29
//   beast(ctx, t, x, y, h, o { dir ±1, fur 0..1, ears 0..1 (1 big elephant ear), dome 0..1, tusk 0..1, lift 0..1 (head up), flick (ear),
//         walk (phase rad) | null, trunk (swing), light 0..1 (the poster: gold rungs of light instead of a body), rim, rimA, a, shade 0..1 (darker),
//         glowTrait { fur, fat, ears } 0..1 (a trait lit gold), breath 0..1 (a steam puff at the trunk) }) → { head: [x, y], trunk: [x, y], box }
//         (x, y) = the ground under the body centre, h = shoulder height in px. MAMMOTH / ELEPHANT / COLD = presets (spread into o).
//   beastPoints(n, seed, o) → [[u, v]…] points inside the silhouette in local units (shoulder 1): for the body that breaks into points
//   mouse(ctx, t, x, y, s, o { dir, fur 0..1 (woolly), walk, a, rim }) · wolf(ctx, t, x, y, h, o { dir, pale 0..1, walk, look, a }) ·
//   ferret(ctx, t, x, y, s, o { dir, a, walk, kit }) · bird(ctx, t, x, y, s, o { dir, a, hop }) · dodo(ctx, t, x, y, s, o { dir, a, light })
//   child(ctx, x, y, h, o) (= E.person, a child's proportions) · reachArm(shoulder [x,y], target [x,y], L1, L2) → [a1, a2] for E.du/E.person arms
//   strand(ctx, t, x, y, w, o { n (rungs), seed, u (grows from the left), diff (k) → 0..1 (a difference lit), col, label, a, h }) a flat ladder,
//         NEVER a helix · strandPts(x, y, w, n) → rung centres
//   tally(ctx, t, o { v (number), from (number, rolls from it), u (roll 0..1), label, sub, a, x, y, size, plus ('+'), pre ('~') }) the clock of the film (top left)
//   list(ctx, t, x, y, w, o { rows: [[text, written 0..1, lit 0..1]], title, a, tilt }) the machine's short list (cream card, cyan writing)
//   scanBar(ctx, x0, x1, y, o { a, w }) the machine's comb in screen space (cyan line with teeth)
//   QUOTES · quoteCard(ctx, t, T, o { id 'C1'|'Q1'|'Q2'|'Q3', x, y, w, size, a, credit 0..1, hi: [[phrase, t0]] })  (no footage, ever)
//   thesis(ctx, t, x, y, u, o { lines, size, out }) · scenario(ctx, t, t0, t1, o) the SCENARIO · EARLY 2030s stamp · SOURCES · source(…)
//   generic (from #55): paper, accentSpan / accentTrail / accentText, checkMark, crossMark, portal, veil, screenFloat, spark, tag, questionMark,
//         dotField, ruler, slab, slabBars, bracket, label, camPath (2.5D card stage)
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
// NO QR overlay anywhere (rule 16.11.2026).
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, quote, rule, maskLine, measure, stamp } = K16;
export const { du, person, cam3, card, camAt, camDrift, aim, project, F0, glowText, withOuter, catmull, trail, dust, cardM } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
const TAU = Math.PI * 2;

export const PRINT29 = { grain: 14, floor: 4, vig: .5 };
// colour code (docs/MOTION.md §5)
export const GOLD = { core: '#ffe8a8', body: '#ffcf6a', halo: '#f3a93c', line: '#ffc65a', deep: '#8a5520', text: '#ffe2a2', ink: '#e8ad55' };
export const MACH = { core: '#effcff', body: '#8fe6ff', line: '#bdf2ff', deep: '#1d6a86', halo: '#5cc9e8', text: '#c9f4ff', ink: '#8fe0f4' };
export const CHECK = MACH;   // the generic blocks (from #55) call the accent CHECK
export const INK = { far: mixHex(P.ind0, P.blue0, .35), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, rim: mixHex(P.blue1, P.halo2, .25) };
export const LAMP = { core: '#fff1d2', body: '#f7c77e', halo: '#e89a45', deep: '#7a4a24' };
export const FUR = { lit: '#c47a48', body: '#8a4426', shade: '#4e2216', deep: '#2a1210', tip: '#d99a62' };
export const HIDE = { lit: '#5a6a92', body: '#38446c', shade: '#222a4c', deep: '#141a36' };
export const FROST = { core: '#f4f8f6', body: '#d9e6ea', shade: '#8fa2bd', deep: '#3b4b74' };
export const SNOW = { lit: '#c9d6f0', body: '#8d9ccc', shade: '#4a5890', deep: '#1c2550' };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== GENERIC (verbatim from #55)
// THE PAPER: a fine print grain that lies on the world's surfaces and slides slowly (~0.5 px/frame) with a little of the camera's pan.
// It keeps the flat night surfaces alive between the 10 Hz grain refreshes ("nothing stands still"; calm.py static share) without a
// visible effect: 2-px cells, alpha <= .045. Drawn by S.lineWorld (after the wall and floor, BEFORE the people), S.kitchen, S.room.
// Built once (module level), never per frame. paper(ctx, t, o { x, y (px pan), a })
const PAPER = (() => { const n = 192, cv = createCanvas(n, n), g = cv.getContext('2d'), r = prng(5590);
  for (let y = 0; y < n; y += 2) for (let x = 0; x < n; x += 2) { const v = r(); if (v < .32) { g.fillStyle = `rgba(0,0,0,${(.25 + r() * .5).toFixed(3)})`; g.fillRect(x, y, 2, 2); } else if (v > .7) { g.fillStyle = `rgba(255,236,200,${(.2 + r() * .45).toFixed(3)})`; g.fillRect(x, y, 2, 2); } }
  return { cv, n, pats: new WeakMap() }; })();
export function paper(ctx, t, o = {}) {
  let pat = PAPER.pats.get(ctx); if (!pat) { pat = ctx.createPattern(PAPER.cv, 'repeat'); PAPER.pats.set(ctx, pat); }
  const n = PAPER.n, ox = (((o.x ?? 0) + t * 15.1) % n + n) % n, oy = (((o.y ?? 0) + t * 5.3) % n + n) % n;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, -ox, -oy); ctx.globalAlpha = .09 * (o.a ?? 1); ctx.fillStyle = pat; ctx.fillRect(0, 0, W + n, H + n); ctx.restore();
}

// ======================================================================================================================== ACCENT LIGHT
// the accent light line (three passes: glow, body, core, and a spark at the head). pts [[x, y]…]. o.col = CHECK (default) | GOLD
export function accentSpan(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(u0 * L), [ex, ey, i1] = at(u1 * L), sub = [[sx, sy]];
  for (let i = i0; i < i1; i++) sub.push([pts[i][0], pts[i][1]]);
  sub.push([ex, ey]);
  const w = o.w ?? 3, a = o.a ?? 1, col = o.col ?? CHECK;
  for (const [k, al, c, op] of [[4.5, .22, col.halo, 'lighter'], [2.1, .8, col.body, 'source-over'], [.9, 1, col.core, 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = c; ctx.globalAlpha = al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  }
  if (o.spark !== false && u1 < 1) halo(ctx, ex, ey, w * 11, .7 * a, col.halo, col.core);
  return [ex, ey];
}
export const accentTrail = (ctx, pts, u = 1, o = {}) => accentSpan(ctx, pts, 0, u, o);
// maskLine with accent words: segs [[text, m 0..1]…] (m 1 = the word in the accent colour; o.acc = CHECK (default) | GOLD)
export function accentText(ctx, segs, x, y, size, u, o = {}) {
  const serif = o.serif ?? true, k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15, acc = o.acc ?? CHECK;
  const mw = (txt) => measure(txt, size, serif, o.weight) + (o.spacing ? txt.length * size * o.spacing : 0);
  const total = segs.reduce((s, [txt]) => s + mw(txt), 0);
  let xx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x; const xs = [];
  ctx.save(); ctx.beginPath(); ctx.rect(xx - size, y - size * 1.25, total + size * 2, size * 1.25 + size * .32); ctx.clip();
  for (const [txt, m] of segs) {
    xs.push(xx);
    const col = mixHex(o.col ?? P.cream, acc.ink, clamp(m));
    E.glowText(ctx, txt, xx, y + dy, { size, serif, col, weight: o.weight, glow: o.glow ?? false, spacing: o.spacing });
    if (m > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glowText(ctx, txt, xx, y + dy, { size, serif, col: rgba(acc.halo, .3), a: clamp(m), weight: o.weight, glow: false, spacing: o.spacing }); ctx.restore(); }
    xx += mw(txt);
  }
  ctx.restore();
  return { w: total, xs, x0: xs[0] };
}

export function checkMark(ctx, x, y, s, u, o = {}) {
  if (u <= 0) return;
  accentSpan(ctx, [[x - s * .42, y + s * .02], [x - s * .12, y + s * .32], [x + s * .46, y - s * .36]], 0, smooth(clamp(u)), { w: o.w ?? s * .08, col: o.col ?? CHECK, spark: false, a: o.a ?? 1 });
}
export function crossMark(ctx, x, y, s, u, o = {}) {
  if (u <= 0) return; const e = smooth(clamp(u * 2)), f = smooth(clamp(u * 2 - 1)), r = s * .36;
  ctx.save(); ctx.strokeStyle = rgba(P.cream, .85 * (o.a ?? 1)); ctx.lineWidth = o.w ?? s * .08; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x - r + 2 * r * e, y - r + 2 * r * e); if (f > 0) { ctx.moveTo(x + r, y - r); ctx.lineTo(x + r - 2 * r * f, y - r + 2 * r * f); } ctx.stroke(); ctx.restore();
}
// ======================================================================================================================== PORTAL, VEIL, FLOAT
// a lit rect that grows from a thing into a panel (or back): from / to in screen px, m 0..1 (sineIO it yourself). inside(ctx, w, h, m) draws
// in to-local px (to.w × to.h), scaled to the current rect and clipped. The rim is cream (o.rim = GOLD for a glimpse behind the door).
export function portal(ctx, from, to, m, inside, o = {}) {
  m = clamp(m); if (m <= 0 || !from) return null;
  const r = { x: lerp(from.x, to.x, m), y: lerp(from.y, to.y, m), w: lerp(from.w, to.w, m), h: lerp(from.h, to.h, m) }, rr = o.r ?? lerp(o.r0 ?? 6, o.r1 ?? 16, m);
  const a = o.a ?? 1, rim = o.rim ?? LAMP;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  if (o.glow !== false) halo(ctx, r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h) * .7, .16 * (1 - m * .6), rim.body ?? rim.halo, rim.core);
  ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, rr); ctx.clip();
  ctx.translate(r.x, r.y); const sx = r.w / to.w, sy = r.h / to.h, k = Math.max(sx, sy); ctx.translate((r.w - to.w * k) / 2, (r.h - to.h * k) / 2); ctx.scale(k, k);
  inside(ctx, to.w, to.h, m);
  ctx.restore();
  ctx.strokeStyle = rgba(rim.core, .55 * (o.rimA ?? 1)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, rr); ctx.stroke();
  ctx.restore();
  return r;
}
export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, clamp(a)); ctx.fillRect(0, 0, W, H); ctx.restore(); }
// screen-space explainers float a little (never a frozen frame): a slow drift and breath about the centre, scaled by k
export function screenFloat(ctx, t, k = 1) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .014 * k * Math.sin(t * .37 + 1), dx = drift(t * 1.1, 12 * k, 11), dy = drift(t * 1.1, 7 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
}
export function spark(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1, col = o.col ?? GOLD; if (a <= 0 || r <= .2) return;
  halo(ctx, x, y, r * 7, .5 * a, col.halo, col.core);
  ctx.fillStyle = rgba(col.core, a); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}

// ======================================================================================================================== GENERIC EXPLAINER BLOCKS (from Film 54)
// a small paper tag on a string: (x, y) = where the string hangs; u grows it (it swings in). o.col 'gold' = a price tag
export function tag(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const size = o.size ?? 17, tw = measure(text, size, false, 600) + size * text.length * .1, w = tw + size * 1.6, h = size * 1.9, len = o.len ?? 22;
  const sw = (o.swing ?? 0) + (1 - expoOut(u)) * .5 + .02 * Math.sin(t * 1.1 + x * .01);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.globalAlpha *= rise(u);
  ctx.strokeStyle = rgba(P.halo2, .7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len); ctx.stroke();
  const y0 = len, p = new Path2D(); p.moveTo(-w / 2 + h * .35, y0); p.lineTo(w / 2, y0); p.lineTo(w / 2, y0 + h); p.lineTo(-w / 2 + h * .35, y0 + h); p.lineTo(-w / 2, y0 + h / 2); p.closePath();
  ctx.fillStyle = o.col === 'gold' ? mixHex(GOLD.body, GOLD.halo, .35) : mixHex(P.cream, '#e3dcc0', .4); ctx.fill(p);
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(-w / 2 + h * .42, y0 + h / 2, size * .14, 0, TAU); ctx.fill();
  E.glowText(ctx, text, -w / 2 + h * .7, y0 + h * .66, { size, weight: 600, spacing: .1, col: P.night1, glow: false });
  ctx.restore();
}
export const priceTag = (ctx, t, x, y, text, u, o = {}) => tag(ctx, t, x, y, text, u, { col: 'gold', ...o });
// a big serif question mark that rises (accent by default)
export function questionMark(ctx, t, x, y, s, u, o = {}) {
  if (u <= 0) return; ctx.save(); if (o.screen !== false) ctx.setTransform(1, 0, 0, 1, 0, 0);
  accentText(ctx, [['?', o.acc ?? 1]], x, y, s, rise(u), { align: 'center', acc: o.col }); ctx.restore();
}
// a field of dots (findings, people, copies): o { x, y, w, h, n, layout 'grid'|'scatter', cols, r, seed, u (grow, staggered), on(k) → 0..1, onCol (CHECK|GOLD), a }
const FIELD = new Map();
export function dotField(ctx, t, o) {
  const n = o.n, key = `${o.seed ?? 1}:${n}:${o.layout}`, a = o.a ?? 1; if (a <= 0) return;
  if (!FIELD.has(key)) { const r = prng(o.seed ?? 1), pts = []; for (let k = 0; k < n; k++) pts.push([r(), r(), r()]); FIELD.set(key, pts); }
  const pts = FIELD.get(key), cols = o.cols ?? Math.ceil(Math.sqrt(n * o.w / o.h)), rows = Math.ceil(n / cols), rr = o.r ?? 3, oc = o.onCol ?? CHECK;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < n; k++) {
    const p = pts[k], e = rise(span(o.u ?? 1, p[2] * .7, p[2] * .7 + .3)); if (e <= 0) continue;
    const x = o.layout === 'grid' ? o.x + (k % cols + .5) * o.w / cols : o.x + p[0] * o.w, y = o.layout === 'grid' ? o.y + (Math.floor(k / cols) + .5) * o.h / rows : o.y + p[1] * o.h;
    const on = o.on ? clamp(o.on(k)) : 0;
    ctx.fillStyle = rgba(mixHex(P.blue1, oc.body, on), (.45 + .55 * on) * e); ctx.beginPath(); ctx.arc(x, y, rr * (.6 + .4 * e) * (.85 + .25 * on), 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// a ruler of light: o { x, y, w, u (the line grows), fill 0..1 (accent), ticks: [[v 0..1, label]], minor (count), label, a, col }
export function ruler(ctx, t, o) {
  const u = expoOut(clamp(o.u ?? 1)), a = o.a ?? 1, col = o.col ?? CHECK; if (u <= 0 || a <= 0) return;
  const { x, y, w } = o, f = Math.min(clamp(o.fill ?? 0), u);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * u, y); ctx.stroke();
  const mn = o.minor ?? 30; for (let k = 0; k <= mn; k++) { const v = k / mn; if (v > u) break; ctx.strokeStyle = rgba(P.blue1, .7); ctx.beginPath(); ctx.moveTo(x + w * v, y - 6); ctx.lineTo(x + w * v, y + 6); ctx.stroke(); }
  for (const [v, s] of o.ticks || []) { if (v > u + 1e-6) continue; ctx.strokeStyle = rgba(P.cream, .6); ctx.beginPath(); ctx.moveTo(x + w * v, y - 12); ctx.lineTo(x + w * v, y + 12); ctx.stroke(); E.glowText(ctx, s, x + w * v, y + 44, { size: 24, align: 'center', glow: false, col: col.text, spacing: .1 }); }
  if (f > 0) accentTrail(ctx, [[x, y], [x + w * f, y]], 1, { w: 5, spark: f < 1, col });
  if (o.label) E.glowText(ctx, o.label, x, y - 30, { size: 24, glow: false, spacing: .12, col: col.text, a: rise(span(u, .3, 1)) });
  ctx.restore();
}
// a slab of light as a bar: (x, y) = left end, centre line y. o { col 'gold'|'check'|'stone', u, a, label (left), value (right) }
export function slab(ctx, t, x, y, len, th, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)), L = Math.max(2, len * u), a = o.a ?? 1; if (a <= 0) return;
  const col = o.col ?? 'stone', C = col === 'gold' ? [GOLD.core, GOLD.body, GOLD.deep] : col === 'check' ? [CHECK.core, CHECK.body, CHECK.deep] : [mixHex(P.blue1, P.blue0, .3), INK.mid, P.night0];
  ctx.save(); ctx.globalAlpha *= a; const d = th * .5;
  if (col === 'gold') halo(ctx, x + L * .5, y, Math.max(L * .6, th * 2), .16, GOLD.halo, GOLD.body);
  ctx.fillStyle = C[0]; ctx.beginPath(); ctx.moveTo(x, y - th / 2); ctx.lineTo(x + L, y - th / 2); ctx.lineTo(x + L + d * .6, y - th / 2 - d * .5); ctx.lineTo(x + d * .6, y - th / 2 - d * .5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C[2]; ctx.beginPath(); ctx.moveTo(x + L, y - th / 2); ctx.lineTo(x + L + d * .6, y - th / 2 - d * .5); ctx.lineTo(x + L + d * .6, y + th / 2 - d * .5); ctx.lineTo(x + L, y + th / 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, y - th / 2, 0, y + th / 2, [[0, C[1]], [1, C[2]]]); ctx.fillRect(x, y - th / 2, L, th);
  ctx.restore();
  if (o.label) E.glowText(ctx, o.label, x - 22, y + 9, { size: o.size ?? 24, align: 'right', spacing: .08, glow: false, col: P.cream, a: a * rise(span(o.u ?? 1, 0, .4)) });
  if (o.value) E.glowText(ctx, o.value, x + L + d + 16, y + 10, { size: o.vsize ?? 28, serif: true, col: P.cream, glow: false, a: a * rise(span(o.u ?? 1, .6, 1)) });
}
export function slabBars(ctx, t, o) {
  o.rows.forEach((r, k) => slab(ctx, t, o.x, o.y + k * (o.pitch ?? 64), (o.w ?? 800) * r.v, o.th ?? 30, { col: r.col, label: r.label, value: r.value, u: span(o.u ?? 1, k * (o.stagger ?? .08), k * (o.stagger ?? .08) + .6), a: r.a ?? 1, size: o.size }));
}
// a thin bracket over a span with a label (the honest caveats: one calm line, never a red warning). u grows it from the middle
export function bracket(ctx, x0, x1, y, u, text, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const m = (x0 + x1) / 2, hw = (x1 - x0) / 2 * expoOut(u), col = o.col === 'check' ? CHECK.line : P.halo2;
  ctx.save(); ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(m - hw, y + 16); ctx.lineTo(m - hw, y); ctx.lineTo(m + hw, y); ctx.lineTo(m + hw, y + 16); ctx.stroke(); ctx.restore();
  if (text) maskLine(ctx, [[text, 0]], m, y - 18, o.size ?? 28, rise(span(u, .3, 1)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
}
// a pinned label: a line from the anchor up-right, then TEXT / sub (wipe in from below). u 0..1
export function label(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 50, dy = o.dy ?? -50, x1 = x + dx, y1 = y + dy;
  accentSpan(ctx, [[x, y], [x1, y1]], 0, smooth(clamp(u * 1.6)), { w: 1.6, spark: false, col: o.col ?? GOLD });
  maskLine(ctx, [[l1, 0]], x1 + (dx < 0 ? -measure(l1, o.size ?? 26, false) - 6 : 6), y1 - 10, o.size ?? 26, u, { serif: false, weight: 600, col: P.cream, glow: false });
  if (l2) maskLine(ctx, [[l2, 0]], x1 + (dx < 0 ? -measure(l2, (o.size ?? 26) * .72, false) - 6 : 6), y1 + 24, (o.size ?? 26) * .72, rise(span(u, .2, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
}
// a small source line (left, above the subtitles: y ≤ 880), rises and sinks
export function source(ctx, t, t0, t1, s, o = {}) {
  const u = rise(span(t, t0, t0 + .7)) * (1 - expoIn(span(t, t1 - .5, t1))); if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [[s.toUpperCase(), 0]], o.x ?? 110, o.y ?? 870, o.size ?? 19, u, { serif: false, weight: 600, col: P.halo2, glow: false, align: o.align }); ctx.restore();
}
// ======================================================================================================================== CAMERA PATH
// monotone cubic (Fritsch–Carlson) through camera keys [[t, cam]…] in x, y and log(F0 − z): C1-smooth, no overshoot, no stop between keys
// that keep moving the same way (a stop only where a key really reverses). Use E.camAt for dives ('i' / 'o').
export function camPath(t, K) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(F0 - c.z)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: F0 - Math.exp(out[2]) });
}

// ======================================================================================================================== THE ANIMALS
// a path builder that applies an affine m = [a, b, c, d, e, f] to every point (so rotated parts can live in ONE Path2D: never addPath)
function pb(path, m = null) {
  const T = m ? (x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]] : (x, y) => [x, y];
  const o = {
    M(x, y) { path.moveTo(...T(x, y)); return o; }, L(x, y) { path.lineTo(...T(x, y)); return o; },
    C(a, b, c, d, x, y) { path.bezierCurveTo(...T(a, b), ...T(c, d), ...T(x, y)); return o; },
    Q(a, b, x, y) { path.quadraticCurveTo(...T(a, b), ...T(x, y)); return o; }, Z() { path.closePath(); return o; },
    E(cx, cy, rx, ry, n = 16) { for (let k = 0; k <= n; k++) { const a = k / n * TAU, p = T(cx + rx * Math.cos(a), cy + ry * Math.sin(a)); k ? path.lineTo(...p) : path.moveTo(...p); } path.closePath(); return o; },
  };
  return o;
}
const rotAbout = (px, py, a) => { const c = Math.cos(a), s = Math.sin(a); return [c, s, -s, c, px - c * px + s * py, py - s * px - c * py]; };
const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const app = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
function cub(p0, p1, p2, p3, n) { const out = []; for (let k = 0; k <= n; k++) { const u = k / n, v = 1 - u; out.push([v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]); } return out; }
// hanging locks along a polyline: each a slim triangle, length L(k) down (dir = [dx, dy] of the hang), swaying a little with t
function locks(path, pts0, L, t, seed, o = {}) {
  const dn = o.dens ?? 2, pts = [];   // fine fur: dn locks per input point (interpolated), each slimmer, lengths vary more
  for (let k = 0; k < pts0.length; k++) for (let j = 0; j < (k < pts0.length - 1 ? dn : 1); j++) { const q = pts0[Math.min(pts0.length - 1, k + 1)], u = j / dn; pts.push([lerp(pts0[k][0], q[0], u), lerp(pts0[k][1], q[1], u)]); }
  const r = prng(seed), wd = (o.w ?? .028) * (dn > 1 ? .62 : 1), dx = o.dx ?? 0, dy = o.dy ?? 1, sw = o.sway ?? .012;
  for (let k = 0; k < pts.length; k++) {
    const [x, y] = pts[k], len = L * (.4 + .9 * r() * r() + .2 * r()), s = sw * Math.sin(t * 1.3 + k * .9 + r() * 3) + (r() - .5) * .02;
    const e = dy < 0 ? -wd : wd;   // always wound like the bodies (nonzero: a lock overlapping the body never cuts a hole)
    path.moveTo(x - e, y - .01); path.lineTo(x + e, y - .01); path.lineTo(x + dx * len + s + wd * .15, y + dy * len); path.closePath();
  }
}
// the presets of the one animal (spread into o)
export const ELEPHANT = { fur: 0, ears: 1, dome: 0, tusk: 0 };
export const MAMMOTH = { fur: 1, ears: 0, dome: 1, tusk: 1 };
export const COLD = { fur: .85, ears: .12, dome: .25, tusk: .2 };   // "an Asian elephant with a mammoth's fur, fat and small ears": an elephant built for the cold
// build the geometry of the animal in local units (shoulder 1, facing +x, y up negative) → { far, main, ear, tusk, all, head, trunk }
function beastGeo(o, t) {
  const fur = clamp(o.fur ?? 1), mm = clamp(o.dome ?? fur), ears = clamp(o.ears ?? 1 - fur), tusk = clamp(o.tusk ?? fur), fat = 1 + .05 * fur;
  const lift = clamp(o.lift ?? 0), ph = o.walk, sw = (o.trunk ?? 0) + .02 * Math.sin(t * .8) + (ph != null ? .03 * Math.sin(ph) : 0);
  const rumpY = lerp(-.86, -.76, mm), backY = lerp(-1.0, -.95, mm), humpY = lerp(-.99, -1.13, mm), neckY = lerp(-.94, -.99, mm), domeY = lerp(-1.07, -1.25, mm);
  const breathe = 1 + .006 * Math.sin(t * 1.1);
  const HM = mul(rotAbout(.40, -.80, -lift * .38 + .015 * Math.sin(t * .55)), [1, 0, 0, 1, 0, -.004 * Math.sin(t * .9)]);   // head group: lift turns it up about the neck
  const P = () => new Path2D();
  const far = P(), main = P(), ear = P(), tuskP = P(), all = P();
  // legs: columns from the hip / shoulder, a straight-leg walk (rotation about the top, the foot lifts as it swings forward)
  const leg = (path, lx, w, off, k) => {
    const a = ph == null ? 0 : .2 * Math.sin(ph + off), lft = ph == null ? 0 : .045 * Math.max(0, Math.cos(ph + off));
    const m = rotAbout(lx, -.62, -a), b = pb(path, mul(m, [1, 0, 0, 1, 0, -lft])), hw = w / 2;
    // (wound the same way as the body: overlapping sub-paths add up under nonzero, never cut holes)
    b.M(lx + hw * 1.15 * k, -.68).C(lx + hw * 1.0, -.4, lx + hw * .95, -.14, lx + hw * 1.06, -.03).Q(lx + hw * 1.1, .004, lx + hw * .8, .006)
      .L(lx - hw * .7, .006).Q(lx - hw * 1.05, .006, lx - hw * 1.06, -.02).C(lx - hw * .95, -.12, lx - hw * 1.05, -.35, lx - hw * 1.1, -.66).Z();
  };
  const legs = (path, near) => {
    if (near) { leg(path, .36, .17 * fat, 0, 1); leg(path, -.56, .19 * fat, 3 * Math.PI / 2, 1.1); }
    else { leg(path, .22, .16 * fat, Math.PI, 1); leg(path, -.42, .18 * fat, Math.PI / 2, 1.1); }
  };
  legs(far, false); legs(all, false);
  const body = (path) => {
    const b = pb(path, [1, 0, 0, breathe, 0, 0]);
    b.M(-.80, -.50).C(-.87, -.6, -.88, rumpY + .05, -.78, rumpY).C(-.66, rumpY - .07 * (1 + .3 * mm), -.48, backY - .02, -.3, backY)
      .C(-.12, backY + .005, .0, humpY, .12, humpY).C(.24, humpY, .30, neckY - .03, .36, neckY).C(.46, -.9, .53, -.76, .5, -.62)
      .C(.48 * fat, -.5, .44, -.44, .38, -.43).C(.1, -.37 / fat, -.3, -.37 / fat, -.55, -.43).C(-.68, -.47, -.76, -.47, -.80, -.50).Z();
  };
  body(main); body(all);
  // the head (+ trunk), drawn in the head group
  const head = (path) => {
    const b = pb(path, HM);
    b.M(.26, neckY + .02).C(.32, domeY + .03, .44, domeY, .54, domeY).C(.66, domeY, .75, lerp(-1.0, -1.06, mm), .75, lerp(-.92, -.97, mm))
      .C(.78, -.84, .80, -.77, .80, -.70).C(.82, -.5, .87 + sw * .5, -.3, .86 + sw, -.10).C(.86 + sw, -.03, .80 + sw, -.0, .78 + sw, -.05)
      .C(.79 + sw, -.24, .73, -.38, .70, -.50).C(.67, -.56, .64, -.58, .60, -.57).C(.52, -.56, .42, -.58, .34, -.64).C(.28, -.7, .25, -.8, .26, neckY + .02).Z();
  };
  head(main); head(all);
  legs(main, true); legs(all, true);
  // the ear: the big flap of the Asian elephant, scaled down to the mammoth's small round ear about its root
  const es = lerp(.34, 1, ears), em = mul(HM, mul(rotAbout(.47, -.94, (o.flick ?? 0) * .35 + .03 * Math.sin(t * .7 + 1)), [es, 0, 0, es, .47 * (1 - es), -.94 * (1 - es)]));
  for (const path of [ear, all]) pb(path, em).M(.48, -.97).C(.51, -.92, .5, -.8, .49, -.68).C(.47, -.58, .44, -.48, .38, -.49).C(.31, -.52, .27, -.62, .28, -.78).C(.29, -.94, .38, -1.0, .48, -.97).Z();
  // fur: locks along the belly, the chest, the rump and the throat (they cover the tops of the near legs: a skirt), short tufts on the back
  if (fur > .01) {
    const bel = [...cub([.50, -.62], [.48, -.5], [.44, -.44], [.38, -.43], 5), ...cub([.38, -.43], [.1, -.37], [-.3, -.37], [-.55, -.43], 12), ...cub([-.55, -.43], [-.68, -.47], [-.76, -.47], [-.80, -.50], 4)];
    locks(main, bel, .2 * fur, t, 29, { w: .034 }); locks(all, bel, .2 * fur, t, 29, { w: .034 });
    const rump = cub([-.80, -.50], [-.87, -.6], [-.88, rumpY + .05], [-.78, rumpY], 6);
    locks(main, rump, .12 * fur, t, 31, { dx: -.5, dy: .9 }); locks(all, rump, .12 * fur, t, 31, { dx: -.5, dy: .9 });
    const back = [...cub([-.78, rumpY], [-.66, rumpY - .07], [-.48, backY - .02], [-.3, backY], 6), ...cub([-.3, backY], [-.12, backY], [0, humpY], [.12, humpY], 6)];
    locks(main, back, .045 * fur, t, 37, { dx: -.6, dy: -.7, w: .03, sway: .005 }); locks(all, back, .045 * fur, t, 37, { dx: -.6, dy: -.7, w: .03, sway: .005 });
    const throat = cub([.62, -.57], [.52, -.56], [.42, -.58], [.34, -.64], 6).map(([x, y]) => app(HM, x, y));
    locks(main, throat, .16 * fur, t, 41, { w: .03 }); locks(all, throat, .16 * fur, t, 41, { w: .03 });
    const crown = cub([.30, neckY - .04], [.36, domeY + .02], [.46, domeY - .01], [.58, domeY + .01], 5).map(([x, y]) => app(HM, x, y));
    locks(main, crown, .05 * fur, t, 43, { dx: -.7, dy: -.6, w: .028, sway: .004 }); locks(all, crown, .05 * fur, t, 43, { dx: -.7, dy: -.6, w: .028, sway: .004 });
  }
  // the tail
  for (const path of [main, all]) pb(path).M(-.78, -.64).C(-.82, -.58, -.84, -.48, -.84, -.40).L(-.86, -.40).C(-.87, -.48, -.86, -.58, -.80, -.66).Z();
  // tusks: one curve; the elephant shows its first quarter, the mammoth the whole sweep
  const tk = lerp(.22, 1, tusk), tp = cub([.64, -.56], [.80, -.38], [1.02, -.34], [1.06, -.58], 14).concat(cub([1.06, -.58], [1.08, -.68], [1.02, -.76], [.96, -.76], 6).slice(1)).map(([x, y]) => app(HM, x, y));
  const nT = Math.max(2, Math.round(tp.length * tk));
  const tb = pb(tuskP); const sideA = [], sideB = [];
  for (let k = 0; k < nT; k++) { const p = tp[k], q = tp[Math.min(tp.length - 1, k + 1)], r0 = tp[Math.max(0, k - 1)], dx = q[0] - r0[0], dy = q[1] - r0[1], l = Math.hypot(dx, dy) || 1, w = lerp(.034, .006, k / Math.max(1, nT - 1)) * lerp(.7, 1, tusk); sideA.push([p[0] - dy / l * w, p[1] + dx / l * w]); sideB.push([p[0] + dy / l * w, p[1] - dx / l * w]); }
  sideA.forEach((p, k) => (k ? tb.L(...p) : tb.M(...p))); sideB.reverse().forEach((p) => tb.L(...p)); tb.Z();
  return { far, main, ear, tusk: tuskP, all, HM, sw, fur, mm, ears, tip: app(HM, .82 + sw, -.06), headPt: app(HM, .6, -.9), lift };
}
// the animal. See the header for o. Colours mix from HIDE (elephant) to FUR (mammoth) with o.fur.
export function beast(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || h <= 1) return null;
  const dir = o.dir ?? 1, G = beastGeo(o, t), f = G.fur, sh = clamp(o.shade ?? 0);
  const col = (k) => mixHex(mixHex(HIDE[k], FUR[k], f), P.night0, sh * .6);
  const rim = o.rim ?? GOLD.halo, rimA = (o.rimA ?? .9) * (1 - sh * .5), ld = o.rimDir ?? [-.25, 1];
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h); ctx.globalAlpha *= a;
  const L = clamp(o.light ?? 0);
  // the ground shadow
  ctx.fillStyle = rgba(P.night0, .45 * (1 - L)); ctx.beginPath(); ctx.ellipse(-.1, .0, .95, .05, 0, 0, TAU); ctx.fill();
  if (L < 1) {
    ctx.save(); ctx.globalAlpha *= 1 - L;
    const fillRim = (path, base) => {
      ctx.save(); ctx.clip(path);
      ctx.fillStyle = rgba(rim, rimA); ctx.fillRect(-1.4, -1.6, 2.8, 1.8);
      ctx.translate(ld[0] * .022 * dir, ld[1] * .022);
      ctx.fillStyle = base; ctx.fill(path); ctx.restore();
    };
    fillRim(G.far, lin(ctx, 0, -1.1, 0, 0, [[0, col('shade')], [1, col('deep')]]));
    fillRim(G.main, lin(ctx, 0, -1.25, 0, 0, [[0, col('lit')], [.35, col('body')], [.75, col('shade')], [1, col('deep')]]));
    fillRim(G.ear, lin(ctx, .3, -1, .5, -.5, [[0, col('body')], [1, col('shade')]]));
    // the trait glow (a part of the body lit gold: fur / fat / ears flagged by the machine)
    const gt = o.glowTrait || {};
    if ((gt.fur ?? 0) > 0) { ctx.save(); ctx.clip(G.main); ctx.fillStyle = lin(ctx, 0, -.62, 0, -.2, [[0, rgba(GOLD.body, 0)], [.5, rgba(GOLD.body, .55 * gt.fur)], [1, rgba(GOLD.halo, .2 * gt.fur)]]); ctx.fillRect(-1, -.7, 2, .7); ctx.restore(); }
    if ((gt.fat ?? 0) > 0) { ctx.save(); ctx.clip(G.main); ctx.strokeStyle = rgba(GOLD.core, .8 * gt.fat); ctx.lineWidth = .03; ctx.beginPath(); ctx.moveTo(-.78, G.mm ? -.72 : -.8); ctx.bezierCurveTo(-.5, -.94, 0, -1.0, .2, -1.0); ctx.stroke(); ctx.restore(); }
    if ((gt.ears ?? 0) > 0) { ctx.save(); ctx.clip(G.ear); ctx.fillStyle = rgba(GOLD.body, .7 * gt.ears); ctx.fillRect(0, -1.2, 1, 1); ctx.restore(); }
    // tusks: ivory
    ctx.fillStyle = lin(ctx, .6, -.7, 1.0, -.4, [[0, mixHex('#e7dcc2', P.night1, .25 + sh * .4)], [1, mixHex('#cbbd9e', P.night1, .45 + sh * .3)]]); ctx.fill(G.tusk);
    ctx.restore();
  }
  if (L > 0) {   // THE POSTER: the same silhouette as gold rungs of light (a flat ladder of base pairs, never a helix)
    G.all.simplify();   // one clean outline (no inner leg / ear lines)
    ctx.save(); ctx.globalAlpha *= L; ctx.clip(G.all);
    ctx.fillStyle = lin(ctx, 0, -1.3, 0, 0, [[0, rgba(GOLD.deep, .42)], [1, rgba(GOLD.deep, .18)]]); ctx.fillRect(-1.2, -1.4, 2.5, 1.5);
    const pitch = o.pitch ?? .028, wave = t * .9;
    for (let k = 0, yy = -1.32; yy < .02; yy += pitch, k++) {
      const br = .55 + .45 * Math.sin(wave - k * .35), r = prng(700 + k);
      ctx.fillStyle = rgba(mixHex(GOLD.body, GOLD.core, br), .55 + .4 * br);
      for (let xx = -1.0 + r() * .04; xx < 1.15; xx += .022 + r() * .03) { const w = .008 + r() * .03; ctx.fillRect(xx, yy, w, pitch * .34); }
    }
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= L; ctx.lineJoin = 'round';
    ctx.strokeStyle = rgba(GOLD.halo, .35); ctx.lineWidth = .028; ctx.stroke(G.all);
    ctx.strokeStyle = rgba(GOLD.core, .85); ctx.lineWidth = .007; ctx.stroke(G.all);
    ctx.fillStyle = rgba(GOLD.deep, .5); ctx.fill(G.tusk); ctx.strokeStyle = rgba(GOLD.core, .8); ctx.lineWidth = .007; ctx.stroke(G.tusk);   // the tusk as a line of light
    ctx.restore();
  }
  // breath: a soft warm-lit cloud from the trunk tip
  const br = clamp(o.breath ?? 0);
  ctx.restore();
  const tipX = x + G.tip[0] * h * dir, tipY = y + G.tip[1] * h;
  if (br > 0) breathCloud(ctx, t, tipX, tipY - h * .02, h * .28, br, dir);
  return { head: [x + G.headPt[0] * h * dir, y + G.headPt[1] * h], trunk: [tipX, tipY], box: { x: x - h * (dir > 0 ? .9 : 1.1), y: y - h * 1.3, w: h * 2, h: h * 1.3 } };
}
// a steam puff (breath in the cold): a few soft lobes drifting up and forward, warm-lit by o.col. u 0..1 (the puff's life)
export function breathCloud(ctx, t, x, y, s, u, dir = 1, o = {}) {
  if (u <= 0) return; const col = o.col ?? LAMP.core, life = clamp(u);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 6; k++) {
    const q = k / 5, ex = expoOut(life), cx = x + dir * s * (.2 + .9 * q) * ex, cy = y - s * (.1 + .5 * q) * ex - s * .1 * Math.sin(t * .6 + k), r = s * (.18 + .35 * q) * (.4 + .6 * ex);
    const al = .16 * (1 - q * .5) * Math.sin(Math.PI * clamp(life * 1.05 - q * .1)) * (o.a ?? 1);
    if (al <= 0) continue;
    ctx.fillStyle = rad(ctx, cx, cy, r, [[0, rgba(col, al)], [.6, rgba(col, al * .4)], [1, rgba(col, 0)]]); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// points inside the silhouette (local units, shoulder 1, facing +x), sampled once per preset from an offscreen mask
const BPTS = new Map();
export function beastPoints(n = 400, seed = 1, o = MAMMOTH) {
  const key = `${n}:${seed}:${o.fur}:${o.ears}:${o.dome}:${o.tusk}`; if (BPTS.has(key)) return BPTS.get(key);
  const S = 200, cv = createCanvas(S * 2.4, S * 1.5), g = cv.getContext('2d'), G = beastGeo(o, 0);
  g.setTransform(S, 0, 0, S, S * 1.1, S * 1.38); g.fillStyle = '#fff'; g.fill(G.all);
  const d = g.getImageData(0, 0, cv.width, cv.height).data, r = prng(seed), out = [];
  for (let tries = 0; out.length < n && tries < n * 60; tries++) { const px = Math.floor(r() * cv.width), py = Math.floor(r() * cv.height); if (d[(py * cv.width + px) * 4 + 3] > 128) out.push([(px - S * 1.1) / S, (py - S * 1.38) / S]); }
  BPTS.set(key, out); return out;
}
// the woolly mouse (side view, s = body length px, (x, y) = ground under its middle). o.fur 0..1 (long, woolly, mammoth-style), o.walk phase
export function mouse(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dir = o.dir ?? 1, fur = clamp(o.fur ?? 1), ph = o.walk, bob = ph != null ? .02 * Math.sin(ph * 2) : .008 * Math.sin(t * 5.3), sniff = .015 * Math.sin(t * 7.1) * (ph == null ? 1 : 0);
  const base = mixHex(mixHex('#5d5a78', FUR.tip, fur), P.night1, .1), dark = mixHex(base, P.night0, .45), lit = mixHex(base, LAMP.core, .35);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.ellipse(0, 0, .55, .04, 0, 0, TAU); ctx.fill();
  // tail
  ctx.strokeStyle = mixHex(dark, '#c9a08a', .3); ctx.lineWidth = .025; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-.45, -.1); ctx.bezierCurveTo(-.7, -.05 + .03 * Math.sin(t * 2), -.85, -.02, -1.02, -.08 + .02 * Math.sin(t * 2.3)); ctx.stroke();
  const b = new Path2D(), q = pb(b, [1, 0, 0, 1, 0, bob]);
  q.M(-.48, -.04).C(-.56, -.22, -.3, -.38, .0, -.36).C(.18, -.35, .3, -.3, .38, -.24 + sniff).C(.5, -.2 + sniff, .6, -.13 + sniff, .64, -.09 + sniff).C(.6, -.05, .5, -.04, .4, -.04).C(.2, -.02, -.2, -.02, -.48, -.04).Z();
  if (fur > .01) { const top = cub([-.48, -.12], [-.5, -.3], [-.2, -.42], [.3, -.32], 12); locks(b, top, .08 * fur, t * 2, 51, { dx: -.9, dy: -.28, w: .026, sway: .006 }); const bot = cub([.36, -.05], [.1, -.02], [-.2, -.02], [-.48, -.05], 10); locks(b, bot, .07 * fur, t * 2, 53, { w: .03, sway: .006 }); }
  ctx.save(); ctx.clip(b); ctx.fillStyle = rgba(o.rim ?? LAMP.body, .9); ctx.fillRect(-1, -1, 2, 1.1); ctx.translate(-.012, .02); ctx.fillStyle = lin(ctx, 0, -.45, 0, 0, [[0, lit], [.5, base], [1, dark]]); ctx.fill(b); ctx.restore();
  // ear, foot
  ctx.fillStyle = mixHex(base, '#d8a090', .35); ctx.beginPath(); ctx.ellipse(.3, -.33 + bob, .07, .08, -.3, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex('#d8a090', P.night1, .3); for (const fx of [.3, -.25]) { const lf = ph != null ? .02 * Math.max(0, Math.sin(ph + fx * 9)) : 0; ctx.beginPath(); ctx.ellipse(fx, -.012 - lf, .05, .015, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// a wolf (side view, h = shoulder height). o.pale 0..1 (the "dire wolves": white-cream coats), o.walk phase, o.look (head up 0..1)
export function wolf(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dir = o.dir ?? 1, ph = o.walk, pale = clamp(o.pale ?? 0), lk = clamp(o.look ?? 0);
  const base = mixHex(mixHex(P.night1, '#6c7494', .55), '#d9d2c0', pale), dark = mixHex(base, P.night0, .55), lit = mixHex(base, P.cream, .3);
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.ellipse(0, 0, .8, .05, 0, 0, TAU); ctx.fill();
  const b = new Path2D(), q = pb(b);
  const legW = (lx, off, k) => { const an = ph == null ? 0 : .32 * Math.sin(ph + off), m = rotAbout(lx, -.55, -an), lb = pb(b, m); lb.M(lx + .05 * k, -.64).C(lx + .035, -.4, lx + .03, -.15, lx + .03, -.01).L(lx - .035, -.01).C(lx - .03, -.12, lx - .045, -.35, lx - .05 * k, -.62).Z(); };
  legW(.36, 0, 1); legW(.24, Math.PI, 1); legW(-.42, Math.PI / 2, 1.3); legW(-.54, 3 * Math.PI / 2, 1.3);
  q.M(-.62, -.62).C(-.6, -.86, -.3, -.92, .0, -.9).C(.22, -.9, .34, -.98, .42, -1.0).C(.5, -1.0, .52, -.9, .48, -.76).C(.42, -.62, .3, -.56, .1, -.56).C(-.15, -.52, -.4, -.55, -.62, -.62).Z();
  // head (turns up with look) + ears + muzzle
  const HM = rotAbout(.42, -.92, -lk * .3 + .02 * Math.sin(t * .7)), hb = pb(b, HM);
  hb.M(.36, -.98).C(.4, -1.12, .5, -1.16, .58, -1.12).L(.6, -1.24).L(.64, -1.12).C(.7, -1.1, .76, -1.04, .86, -1.0).C(.9, -.98, .9, -.94, .86, -.92).C(.76, -.9, .66, -.88, .6, -.84).C(.52, -.8, .42, -.82, .36, -.9).Z();
  // tail (bushy)
  const tb = pb(b, rotAbout(-.62, -.72, .1 * Math.sin(t * .9)));
  tb.M(-.6, -.8).C(-.78, -.74, -.86, -.56, -.84, -.4).C(-.8, -.38, -.74, -.42, -.72, -.5).C(-.7, -.62, -.64, -.7, -.58, -.72).Z();
  ctx.save(); ctx.clip(b); ctx.fillStyle = rgba(o.rim ?? P.cream, .7); ctx.fillRect(-1.2, -1.4, 2.4, 1.5); ctx.translate(-.012, .018); ctx.fillStyle = lin(ctx, 0, -1.1, 0, 0, [[0, lit], [.45, base], [1, dark]]); ctx.fill(b); ctx.restore();
  ctx.restore();
}
// a black-footed ferret (side view, s = body length px): long, low, buff body, dark legs and a dark mask. o.kit 0..1 = a small young one
export function ferret(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dir = o.dir ?? 1, ph = o.walk, arch = ph != null ? .05 * Math.max(0, Math.sin(ph)) : .01 * Math.sin(t * 1.7);
  const buff = '#c8ae84', dark = mixHex('#3a2c26', P.night0, .2);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.ellipse(0, 0, .55, .03, 0, 0, TAU); ctx.fill();
  const leg = (lx, off) => { const an = ph == null ? 0 : .5 * Math.sin(ph + off); ctx.save(); ctx.translate(lx, -.1); ctx.rotate(-an); ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-.03, 0, .06, .1, .02); ctx.fill(); ctx.restore(); };
  leg(.28, 0); leg(-.3, Math.PI);
  const b = new Path2D(); pb(b).M(-.46, -.1).C(-.4, -.2 - arch, -.1, -.22 - arch * 2, .12, -.2 - arch).C(.26, -.19, .34, -.22, .42, -.22).C(.5, -.22, .56, -.18, .6, -.14).C(.56, -.1, .5, -.09, .42, -.09).C(.2, -.07, -.2, -.06, -.46, -.1).Z();
  ctx.save(); ctx.clip(b); ctx.fillStyle = rgba(o.rim ?? LAMP.body, .8); ctx.fillRect(-1, -.6, 2, .6); ctx.translate(-.01, .014); ctx.fillStyle = lin(ctx, 0, -.24, 0, -.06, [[0, mixHex(buff, P.cream, .25)], [1, mixHex(buff, P.night1, .5)]]); ctx.fill(b); ctx.restore();
  ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(.48, -.17, .06, .025, -.2, 0, TAU); ctx.fill();   // the mask
  ctx.strokeStyle = dark; ctx.lineWidth = .05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-.44, -.11); ctx.quadraticCurveTo(-.6, -.1, -.68, -.06 + .02 * Math.sin(t * 1.4)); ctx.stroke();   // tail, dark tip
  leg(.2, Math.PI); leg(-.38, 0);
  ctx.restore();
}
// a small songbird sitting (a snow bunting), s = height px, o.hop 0..1
export function bird(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dir = o.dir ?? 1, hp = Math.sin(Math.PI * clamp(o.hop ?? 0)) * .25, tilt = .06 * Math.sin(t * 1.9) + (Math.sin(t * 5.1) > .97 ? .15 : 0);
  ctx.save(); ctx.translate(x, y - hp * s); ctx.scale(s * dir, s); ctx.globalAlpha *= a;
  const b = new Path2D(); pb(b).M(-.45, -.35).C(-.3, -.75, .1, -.8, .22, -.62).C(.3, -.5, .32, -.36, .2, -.18).C(.05, -.05, -.25, -.08, -.38, -.22).L(-.7, -.12).L(-.65, -.2).L(-.45, -.35).Z();
  pb(b, rotAbout(.2, -.68, tilt)).E(.22, -.78, .17, .16);
  ctx.save(); ctx.clip(b); ctx.fillStyle = rgba(P.cream, .6); ctx.fillRect(-1, -1.2, 2, 1.3); ctx.translate(-.02, .03); ctx.fillStyle = lin(ctx, 0, -.95, 0, -.1, [[0, '#e8e4dc'], [.6, mixHex('#c9c4ba', P.blue1, .3)], [1, mixHex(P.blue1, P.night1, .4)]]); ctx.fill(b); ctx.restore();
  ctx.save(); ctx.translate(.22, -.78); ctx.rotate(tilt); ctx.fillStyle = '#e9b04a'; ctx.beginPath(); ctx.moveTo(.14, -.03); ctx.lineTo(.27, .01); ctx.lineTo(.14, .05); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = mixHex(P.night1, P.blue1, .3); ctx.beginPath(); ctx.moveTo(-.25, -.5); ctx.quadraticCurveTo(.05, -.55, .1, -.35); ctx.quadraticCurveTo(-.1, -.3, -.4, -.3); ctx.closePath(); ctx.fill();   // the wing
  ctx.strokeStyle = '#4a3a2a'; ctx.lineWidth = .04; ctx.beginPath(); ctx.moveTo(-.02, -.12); ctx.lineTo(-.04, 0); ctx.moveTo(.06, -.12); ctx.lineTo(.07, 0); ctx.stroke();
  ctx.restore();
}
// the dodo (side view, s = height px): plump, the big hooked beak, a tuft tail, stout legs. o.light 0..1 = drawn as gold rungs (like the poster)
export function dodo(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dir = o.dir ?? 1, L = clamp(o.light ?? 0), bob = .006 * Math.sin(t * 1.3);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .45 * (1 - L)); ctx.beginPath(); ctx.ellipse(0, 0, .42, .03, 0, 0, TAU); ctx.fill();
  const b = new Path2D(), q = pb(b, [1, 0, 0, 1, 0, bob]);
  q.M(-.42, -.42).C(-.5, -.66, -.3, -.8, -.02, -.78).C(.08, -.78, .12, -.84, .14, -.92).C(.16, -1.02, .24, -1.06, .32, -1.04).C(.42, -1.02, .52, -1.0, .62, -.96)
    .C(.7, -.93, .72, -.86, .66, -.84).C(.62, -.86, .58, -.88, .5, -.88).C(.44, -.88, .4, -.86, .36, -.84).C(.3, -.74, .34, -.6, .3, -.46).C(.24, -.3, .1, -.22, -.08, -.22).C(-.28, -.22, -.4, -.3, -.42, -.42).Z();
  pb(b).M(-.42, -.5).C(-.56, -.6, -.6, -.7, -.54, -.76).C(-.5, -.68, -.46, -.62, -.38, -.58).Z();   // the tail tuft
  for (const lx of [-.06, .08]) pb(b).M(lx + .035, -.24).L(lx + .03, -.02).L(lx + .07, 0).L(lx - .06, 0).L(lx - .03, -.02).L(lx - .035, -.24).Z();
  if (L < 1) { ctx.save(); ctx.globalAlpha *= 1 - L; ctx.clip(b); ctx.fillStyle = rgba(o.rim ?? P.cream, .7); ctx.fillRect(-1, -1.2, 2, 1.3); ctx.translate(-.012, .016); ctx.fillStyle = lin(ctx, 0, -1, 0, 0, [[0, '#8c8aa2'], [.5, '#5d5a76'], [1, '#2c2a48']]); ctx.fill(b); ctx.restore(); }
  if (L > 0) { ctx.save(); ctx.globalAlpha *= L; ctx.clip(b); ctx.fillStyle = rgba(GOLD.deep, .35); ctx.fillRect(-1, -1.2, 2, 1.3); for (let k = 0, yy = -1.1; yy < 0; yy += .03, k++) { const r = prng(900 + k), br = .55 + .45 * Math.sin(t * .9 - k * .35); ctx.fillStyle = rgba(mixHex(GOLD.body, GOLD.core, br), .6 + .35 * br); for (let xx = -.7 + r() * .04; xx < .8; xx += .03 + r() * .03) ctx.fillRect(xx, yy, .01 + r() * .03, .011); } ctx.restore(); ctx.save(); ctx.globalAlpha *= L; ctx.strokeStyle = rgba(GOLD.core, .85); ctx.lineWidth = .008; ctx.stroke(b); ctx.restore(); }
  ctx.restore();
}
// a child: E.person at a child's height (no yellow: only you wear the coat). Pass the same o as E.person (armL / armR / look / view …)
export const child = (ctx, x, y, h, o = {}) => E.person(ctx, x, y, h, { long: false, ...o });
// two-segment arm IK for E.du / E.person (arm angles from straight down, + = toward +x in the figure's frame; L1 .17, L2 .155 of the height)
export function reachArm(sh, tg, L1, L2, bend = 1) {
  const dx = tg[0] - sh[0], dy = tg[1] - sh[1], d = Math.min(Math.hypot(dx, dy), (L1 + L2) * .999), base = Math.atan2(dx, dy);
  const k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), a1 = base - bend * k, el = [sh[0] + Math.sin(a1) * L1, sh[1] + Math.cos(a1) * L1];
  return [a1, Math.atan2(tg[0] - el[0], tg[1] - el[1])];
}

// ======================================================================================================================== THE STRAND, THE TALLY, THE LIST
// A strand of DNA as a FLAT LADDER (two rails, n rungs; never a helix, never wallpaper). (x, y) = left end of the centre line, w = length.
// o.u grows it from the left (rungs rise from the centre line), o.diff(k) → 0..1 lights rung k gold (a difference), o.dim(k) → 0..1 greys it
// (the comb passed and dropped it), o.col (rung colour), o.h (rung height px), o.label (left, small caps), o.a. Returns rung centres.
export function strandPts(x, y, w, n) { const out = []; for (let k = 0; k < n; k++) out.push([x + (k + .5) * w / n, y]); return out; }
export function strand(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1, n = o.n ?? 90, hh = o.h ?? 46, u = clamp(o.u ?? 1); if (a <= 0 || u <= 0) return [];
  const pts = strandPts(x, y, w, n), r = prng(o.seed ?? 3);
  ctx.save(); ctx.globalAlpha *= a;
  const rail = rgba(mixHex(P.blue1, P.cream, .25), .8);
  ctx.fillStyle = rail; ctx.fillRect(x, y - hh / 2 - 2, w * expoOut(u), 3); ctx.fillRect(x, y + hh / 2 - 1, w * expoOut(u), 3);
  for (let k = 0; k < n; k++) {
    const e = rise(span(u, k / n * .85, k / n * .85 + .15)); const sk = r(); if (e <= 0) continue;
    const d = clamp(o.diff ? o.diff(k) : 0), dm = clamp(o.dim ? o.dim(k) : 0), [px] = pts[k], len = hh * e * (.86 + .14 * sk);
    const base = mixHex(o.col ?? mixHex(P.blue1, P.cream, .35), mixHex(P.blue2, P.night1, .4), dm);
    ctx.fillStyle = mixHex(base, GOLD.body, d);
    ctx.fillRect(px - 2.2, y - len / 2, 4.4, len);
    if (d > .05) { halo(ctx, px, y, hh * .7, .35 * d, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.core, d); ctx.fillRect(px - 1.2, y - len / 2, 2.4, len); }
  }
  ctx.restore();
  if (o.label) maskLine(ctx, [[o.label, 0]], x, y - hh / 2 - 22, o.lsize ?? 22, rise(span(u, .1, .5)) * a, { serif: false, weight: 600, col: P.halo2, glow: false });
  return pts;
}
// THE TALLY: the clock of the film. One serif number, top left, that only ever counts what is left. It rolls (log scale) from o.from to o.v
// with o.u (0..1, ease it yourself or pass span(t, t0, t1)), the last digits blur by like a counter. o.label (small caps under it),
// o.plus ('+' after the number, e.g. 70+; the gene list is ~150: o.pre '~', never 150+), o.a, o.x / o.y (default 110 / 210), o.size (120). Draws in screen space.
export const TALLY = { x: 110, y: 214, size: 120 };
export const fmt = (v) => Math.round(v).toLocaleString('en-US');
export function tally(ctx, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const x = o.x ?? TALLY.x, y = o.y ?? TALLY.y, size = o.size ?? TALLY.size, u = clamp(o.u ?? 1), from = o.from ?? o.v, to = o.v;
  const lf = Math.log(Math.max(1, from)), lt = Math.log(Math.max(1, to)), v = u >= 1 ? to : Math.exp(lerp(lf, lt, expoOut(u)));
  const s = (o.pre ?? '') + fmt(v) + (o.plus ?? ''), roll = u > 0 && u < 1 ? 1 - expoOut(u) : 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  const w = maskLine(ctx, [[s, 0]], x, y + roll * size * .06, size, o.rise ?? 1, { serif: true, col: o.col ?? P.core0, glow: true }).w;
  if (o.label) maskLine(ctx, [[o.label, 0]], x + 4, y + size * .42, Math.round(size * .19), o.lrise ?? o.rise ?? 1, { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
  return { x, y, w, v };
}
// THE LIST: the machine's product. A cream card (x, y) = top left, w wide; rows [[text, written 0..1, lit 0..1]] are written in cyan by the
// comb (a short cyan light runs along the row as it writes), lit = the row picked (gold dot). o.title (small caps), o.a, o.tilt (rad).
export function list(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1, rows = o.rows ?? [], pitch = o.pitch ?? 58, h = (o.title ? 70 : 30) + rows.length * pitch + 20; if (a <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (o.tilt) ctx.rotate(o.tilt);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(10, 12, w, h);
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.cream, '#ece4c8', .4)], [1, mixHex(P.cream, P.halo2, .45)]]); ctx.fillRect(0, 0, w, h);
  let yy = 30;
  if (o.title) { E.glowText(ctx, o.title, 28, 46, { size: 20, weight: 600, spacing: .16, col: mixHex(P.night1, P.blue1, .4), glow: false }); ctx.fillStyle = rgba(P.night1, .25); ctx.fillRect(28, 60, w - 56, 2); yy = 74; }
  rows.forEach(([txt, wr, lit], k) => {
    const ry = yy + k * pitch + pitch * .62, e = clamp(wr ?? 1), li = clamp(lit ?? 0);
    ctx.fillStyle = rgba(mixHex(P.night1, P.blue1, .4), .35); ctx.beginPath(); ctx.arc(40, ry - 8, 6, 0, TAU); ctx.fill();
    if (li > 0) { ctx.fillStyle = rgba(mixHex(GOLD.halo, GOLD.deep, .2), li); ctx.beginPath(); ctx.arc(40, ry - 8, 6 + 2 * li, 0, TAU); ctx.fill(); }
    if (e > 0) {
      ctx.save(); const tw = (w - 90) * e; ctx.beginPath(); ctx.rect(62, ry - 40, tw, 56); ctx.clip();
      if (txt) E.glowText(ctx, txt, 64, ry, { size: o.size ?? 30, weight: 600, spacing: .06, col: MACH.deep, glow: false });
      else { ctx.fillStyle = rgba(MACH.deep, .7); ctx.fillRect(64, ry - 14, (w - 120) * (.55 + .4 * prng(k + 3)()), 8); }
      ctx.restore();
      if (e < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; halo(ctx, 62 + tw, ry - 8, 26, .7, MACH.halo, MACH.core); ctx.restore(); }
    }
  });
  ctx.restore();
  return { x, y, w, h };
}
// the machine's comb in screen space: a cyan line from x0 to x1 at y with short teeth below it (it combs through), o.a, o.w
export function scanBar(ctx, x0, x1, y, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || x1 <= x0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, y - 30, 0, y + 6, [[0, rgba(MACH.halo, 0)], [1, rgba(MACH.halo, .22)]]); ctx.fillRect(x0, y - 30, x1 - x0, 36);
  accentSpan(ctx, [[x0, y], [x1, y]], 0, 1, { w: o.w ?? 2.4, spark: false, col: MACH });
  ctx.fillStyle = rgba(MACH.line, .55); for (let x = x0 + 9; x < x1; x += 18) ctx.fillRect(x - 1, y + 2, 2, 9);
  ctx.restore();
}

// ======================================================================================================================== QUOTE CARDS (no footage, ever)
// C1 = the clip slot (Ben Lamm's own audio, ~10 s, or silence): the words light evenly. Q1–Q3 = [ZITATKARTE] (T.clip('Q1') from the timing:
// picture-only cards Q1 IUCN, Q3 Lamm get air to read; Q2 Shapiro is spoken by the narrator and lights word by word with the voice).
// The timing entry's own text / credit (vo-v3 fact check) wins over this table. Never a photo, never a likeness, never "ORIGINAL FOOTAGE"
// (that label only if a real clip file appears in <ROOT>clips/ and replaces the card).
export const QUOTES = {
  C1: { text: 'The foundation models and AI models aren’t quite looking at the entire tree of life, and they’re not going to magically overnight give us a genome and give us an answer.', name: 'Ben Lamm', role: 'CEO, COLOSSAL', where: 'MOONSHOTS #297 · PETER H. DIAMANDIS · SEP 30, 2026' },
  Q1: { text: 'The three animals produced by Colossal are not dire wolves.', name: 'IUCN SSC', role: 'CANID SPECIALIST GROUP', where: 'APRIL 18, 2025' },
  Q2: { text: 'Our animals are grey wolves with 20 edits that are cloned.', name: 'Beth Shapiro', role: 'CHIEF SCIENCE OFFICER, COLOSSAL', where: 'TO NEW SCIENTIST · MAY 2025' },
  Q3: { text: 'Not 2036, but not 2030 either.', name: 'Ben Lamm', role: 'CEO, COLOSSAL', where: 'TIME · AUG 24, 2026' },
};
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export function quoteCard(ctx, t, T, o = {}) {
  const id = o.id ?? 'C1', q = QUOTES[id], size = o.size ?? 64, wmax = o.w ?? 1240, lead = size * 1.24, a = o.a ?? 1; if (a <= 0 || !q) return null;
  const slot = T.clip(id), text = (slot && slot.text) || q.text;
  const spoken = slot && slot.kind === 'card' && slot.spoken ? T.words.filter((w) => w.s >= slot.start - .05 && w.s <= slot.end + .05) : [];
  const words = `“${text}”`.split(/\s+/), lines = []; let cur = [];
  for (const w of words) { const nx = [...cur, w]; if (cur.length && measure(nx.join(' '), size) > wmax) { lines.push(cur); cur = [w]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const flat = lines.flat(), Ltot = flat.reduce((s, w) => s + w.length + 1, 0); let acc = 0;
  const readEnd = slot ? (slot.kind === 'card' && !slot.spoken ? slot.start + Math.min(slot.end - slot.start, 2.6) : slot.end - .4) : 0;
  const tOf = flat.map((w, k) => { const even = slot ? lerp(slot.start + .15, readEnd, acc / Ltot) : 0; acc += w.length + 1; return spoken[k] && nz(spoken[k].w) === nz(w) ? spoken[k].s : even; });
  const hiAt = flat.map(() => null);
  for (const [ph, tg] of o.hi || []) { const p = ph.split(/\s+/).map(nz); for (let i = 0; i + p.length <= flat.length; i++) if (p.every((x, j) => nz(flat[i + j]) === x)) { for (let j = 0; j < p.length; j++) hiAt[i + j] = tg; break; } }
  ctx.save(); ctx.globalAlpha *= a;
  const x = o.x ?? 300, y = o.y ?? 330, dim = o.dim ?? .38;
  let wi = 0;
  lines.forEach((ln, li) => {
    let xx = x; const yy = y + li * lead;
    ln.forEach((w, j) => {
      const k = wi++, txt = w + (j < ln.length - 1 ? ' ' : ''), lit = o.read === false ? 1 : smooth(span(t, tOf[k] - .08, tOf[k] + .3)), m = hiAt[k] != null ? smooth(span(t, hiAt[k], hiAt[k] + .5)) : 0;
      ctx.save(); ctx.globalAlpha *= dim + (1 - dim) * lit;
      accentText(ctx, [[txt, m]], xx, yy, size, 1, { glow: lit > .5 && m === 0, acc: o.acc ?? GOLD });
      ctx.restore();
      xx += measure(txt, size, true);
    });
  });
  const by = y + (lines.length - 1) * lead + size * .5 + 34, cu = rise(clamp(o.credit ?? 1)), cred = (slot && slot.credit) ? null : null;
  if (cu > 0) {
    ctx.fillStyle = rgba(GOLD.line, .7 * cu); ctx.fillRect(x, by - 6, 64 * cu, 2);
    maskLine(ctx, [[q.name, 0]], x, by + 44, 40, cu, { glow: false });
    const nx = x + measure(q.name, 40) + 22;
    maskLine(ctx, [[q.role, 0]], nx, by + 41, 19, cu, { serif: false, weight: 600, col: P.cream, glow: false });
    maskLine(ctx, [[q.where, 0]], nx, by + 70, 19, rise(span(cu, .25, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  }
  ctx.restore();
  return { x, y, bottom: by + 80, lines: lines.length, lead, cred };
}

// ======================================================================================================================== WORDS ON SCREEN
// the thumbnail line: Inter 600 caps, cream with a soft glow, slightly condensed. u rises, o.out sinks (0..1)
export function thesis(ctx, t, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 110, lines = o.lines ?? ['AI IS BRINGING', 'BACK THE MAMMOTH'];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(.9, 1.08);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)) * (o.out != null ? 1 - expoIn(clamp(o.out * (1 + .12 * (lines.length - 1)) - i * .12)) : 1);
    if (ui > 0) maskLine(ctx, [[ln, 0]], 0, i * size * .98, size, ui, { serif: false, weight: 600, col: i === (o.gold ?? -1) ? GOLD.text : P.core0, glow: true, align: o.align });
  });
  ctx.restore();
}
// the SCENARIO stamp (scenario-motion §2.3): the year rolls in big, then settles small top left with the place under it. t0 in, t1 out.
export function scenario(ctx, t, t0, t1, o = {}) {
  const u = rise(span(t, t0, t0 + .8)) * (1 - expoIn(span(t, t1 - .6, t1))); if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [[o.top ?? 'SCENARIO', 0]], o.x ?? 112, (o.y ?? 150), 20, u, { serif: false, weight: 600, col: P.halo2, glow: false });
  maskLine(ctx, [[o.year ?? 'EARLY 2030s', 0]], o.x ?? 108, (o.y ?? 150) + 64, 60, rise(span(t, t0 + .15, t0 + .95)) * (1 - expoIn(span(t, t1 - .6, t1))), { serif: true, col: P.core0, glow: true });
  ctx.restore();
}
// source lines (F.source), text-v2 Einblendungen; faktenzettel.md and vo-v3 override. Every company claim keeps its sender on screen.
export const SOURCES = {
  diff14: 'CELL REPORTS, 2015',
  mice: 'COLOSSAL · PREPRINT, MARCH 2025',
  aiRole: 'AS REPORTED · TIME, AUG 24, 2026',
  genomes100: '~100 MAMMOTH GENOMES · PER COLOSSAL',
  genes1600: 'CELL REPORTS, 2015',
  genes150: 'TIME, AUG 24, 2026 · AS REPORTED',
  seven: 'COLOSSAL PREPRINT · MARCH 2025',
  critics: 'TORI HERRIDGE · SCIENCE MEDIA CENTRE · 4.3.2025',
  dodo: 'COLOSSAL · OCT 14, 2026',
  genomorph: '70+ SPECIES · 541 POINTS PER SKULL · PER COLOSSAL · NOT PEER-REVIEWED',
  candidates: 'COLOSSAL: CANDIDATES, NOT PROOF',
  chicks: '26 CHICKS · PER COLOSSAL · MAY 2026',
  wolves: '20 EDITS · 14 GENES · PER COLOSSAL',
  wolvesAge: 'PER COLOSSAL · OCT 2026',
  calf: 'TIME · AUG 24, 2026',
  noEmbryo: 'AS OF NOV 2026',
  wrangel: '~4,000 YEARS AGO · WRANGEL ISLAND · CELL, 2024',
  willa: 'U.S. FISH & WILDLIFE SERVICE',
  biobank: '~2,300 LISTED SPECIES · FWS / NYT, JUNE 2026',
  vaccine: 'JOURNAL OF VIROLOGY · JULY 28, 2026 · CO-FUNDED BY COLOSSAL',
  redList: 'IUCN RED LIST 2026-1',
  vote: 'IUCN CONGRESS, OCT 2025 · MORATORIUM REJECTED BY ONE VOTE',
};
