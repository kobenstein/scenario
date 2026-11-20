// Film 65 · "AI Can Now Call You in Your Mom's Voice" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du / person, halo, glowText, finish) + lib/f16_kit.mjs (rise, maskLine, measure).
// Generic blocks (paper, accent light, portal, veil, tag, dotField, ruler, slab, bracket, label, source) are carried over verbatim from
// Film 29 / 55; everything else is #65's own. World + camera + kitchen + seams: lib/f65_seams.mjs.
// Plan: docs/MOTION.md · shots: docs/shots.md · builders: docs/BRIEF-builders.md.
//
//   THE LINE (the one world, lib/f65_seams.mjs): a sleeping valley town at night. On the far hill left HER HOUSE with one warm kitchen window;
//   one telephone line on five wooden poles runs from her house down the hill to THE BANK on the town square; on the near hill right YOU
//   (the yellow coat) with your phone. The five poles carry small numbered tags 1–5: the five steps the scam has to pass to reach her savings.
//   THE VOICE is a ribbon of light (voiceWave): GOLD = a real voice (people) · COPY = electric blue = the machine's copy (same shape, cold).
//   THE AGREEMENTS are small gold paper notes (note) on her fridge: the word (covered), the question, the house rule, the stop rule, the name.
//   THE PHONE (phone) is the film's object: it rings with your picture (the yellow hood), it shows the call timer, the fake video call;
//   every interview clip grows out of a screen in the world (clipFrame) and shrinks back into it.
//
// API (screen px unless noted; t in seconds; u = 0..1 growth):
//   colours: GOLD (a real voice, the agreements, savings, what matters) · COPY (electric blue: the machine's copy, never a person) ·
//            LAMP (people's practical light: windows, the kitchen lamp, the bank counter) · INK (night forms) · WOOD (poles, table) ·
//            the yellow coat = only you (E.du) · PRINT65 (the editorial finish)
//   voiceWave(ctx, t, pts, o { amp, col GOLD|COPY|NEUTRAL, u0, u1, seed, speed, a, flicker, tremble, flat, cut [a, b], bands, core })
//            a voice as a ribbon of light along a screen polyline pts [[x, y]…] (≥ 2 points; resampled). Returns { at(u) → [x, y, nx, ny] }.
//   arcPts(x0, y0, x1, y1, lift, n) → a screen arc (quadratic) for waves between two points
//   note(ctx, t, x, y, s, o { lines, cover 0..1, lit 0..1, tilt, a, empty 0..1 (dashed slot), magnet }) one gold agreement note (centre x, y)
//   phone(ctx, t, x, y, h, o { screen: 'call'|'timer'|'video'|'contacts'|'wave'|'dark', ring 0..1, glow, rot, timer (s), seal (0..1 crooked),
//            rows, hi, a, light }) → { screen: {x, y, w, h} } (centre x, y; h = body height px; rot rad turns it, e.g. to landscape)
//   avatar(ctx, x, y, r, o) your contact picture: the yellow hood on blue · mom(ctx, x, y, h, o) the mother (E.person, long, a bun) → hands
//   coin(ctx, t, x, y, r, o { ph (flip angle), a }) · tally(ctx, t, o { v, from, u, label, pre, post, dec, size, x, y, rise })
//   stepLabel(ctx, t, k, name, u, o) STEP k OF 5 · THE NAME (top left) · thesis(ctx, t, x, y, u, o { lines, size, out, gold })
//   scenario(ctx, t, t0, t1, o) the small SCENARIO line · SOURCES · source(ctx, t, t0, t1, s, o)
//   clips: CLIP_RECT · CLIPS (name / role / date per id) · clipFrame(ctx, t, T, id, o { from rect, morph 0..1, label 0..1, dark }) ·
//          prepareClipFrames(T, t) (film.prepare) · clipWin(T, id)
//   generic: paper, accentSpan / accentTrail / accentText, checkMark, crossMark, portal, veil, screenFloat, spark, tag, priceTag,
//            questionMark, dotField, ruler, slab, slabBars, bracket, label, source
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
// NO QR overlay anywhere (rule 16.11.2026). No red anywhere (✗ and warnings are cream).
import fs from 'node:fs';
import { Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, quote, rule, maskLine, measure, stamp } = K16;
export const { du, person, cam3, card, camAt, camDrift, aim, project, F0, glowText, withOuter, catmull, trail, dust, cardM } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift, ROOT };
const TAU = Math.PI * 2;

export const PRINT65 = { grain: 14, floor: 4, vig: .5 };   // grain at the house cadence (10 Hz)
// colour code (docs/MOTION.md §5)
export const GOLD = { core: '#fff1c4', body: '#ffd27a', halo: '#f0b04a', line: '#ffcf6a', deep: '#8a5a22', text: '#ffe6aa', ink: '#e8b25c' };
export const COPY = { core: '#eef7ff', body: '#6fb8ff', line: '#a6d4ff', halo: '#3d86f2', deep: '#173f9c', text: '#cfe6ff', ink: '#86c2ff' };
export const NEUTRAL = { core: '#fffbe9', body: '#e9dfc0', line: '#f3ead0', halo: '#b9b08f', deep: '#5d5844', text: '#fefcde', ink: '#e7dcb8' };
export const CHECK = GOLD;   // the generic blocks call the accent CHECK: in #65 the accent is the agreement (gold)
export const LAMP = { core: '#fff1d2', body: '#f7c77e', halo: '#e89a45', deep: '#7a4a24' };
export const INK = { far: mixHex(P.ind0, P.blue0, .32), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, rim: mixHex(P.blue1, P.halo2, .25) };
export const WOOD = { lit: mixHex(P.blue2, P.shade0, .35), body: mixHex(P.night1, P.shade1, .22), shade: P.night0 };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== GENERIC (verbatim from #55)
// THE PAPER: a fine print grain that lies on the world's surfaces and slides slowly (~0.5 px/frame) with a little of the camera's pan.
// It keeps the flat night surfaces alive between the 10 Hz grain refreshes ("nothing stands still"; calm.py static share) without a
// visible effect: 2-px cells, alpha <= .045. Drawn by S.lineWorld and S.kitchen over the night surfaces, BEFORE the people.
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

// ======================================================================================================================== THE VOICE (a ribbon of light)
// A voice is a ribbon of light along a path: a row of soft syllable swells that travel along it (speed), with three thin inner bands like
// the thumbnail's waves. GOLD = a real voice, COPY = the machine's copy (same shape, cold electric blue), NEUTRAL = "you can't tell".
// o.flicker 0..1 = the copy shimmers (a smooth ghost offset, never a strobe) · o.tremble 0..1 = in tears · o.flat 0..1 = the line goes quiet ·
// o.cut [a, b] = a short snippet lit (the recording) · u0 / u1 = the visible span (it grows / retracts along the path).
const SYL = new Map();
function sylOf(seed) {
  if (!SYL.has(seed)) { const r = prng(seed * 7 + 3), out = []; for (let k = 0; k < 12; k++) out.push({ c: r(), w: .022 + r() * .045, h: .35 + r() * .65 }); SYL.set(seed, out); }
  return SYL.get(seed);
}
function resample(pts, n) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1] || 1, out = []; let i = 1;
  for (let k = 0; k <= n; k++) {
    const d = k / n * tot; while (i < pts.length - 1 && L[i] < d) i++;
    const f = clamp((d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1])), x = lerp(pts[i - 1][0], pts[i][0], f), y = lerp(pts[i - 1][1], pts[i][1], f);
    const tx = pts[i][0] - pts[i - 1][0], ty = pts[i][1] - pts[i - 1][1], tl = Math.hypot(tx, ty) || 1;
    out.push([x, y, ty / tl, -tx / tl]);
  }
  // smooth the normals (corners of a coarse polyline)
  for (let k = 1; k < out.length - 1; k++) { const nx = out[k - 1][2] + 2 * out[k][2] + out[k + 1][2], ny = out[k - 1][3] + 2 * out[k][3] + out[k + 1][3], l = Math.hypot(nx, ny) || 1; out[k][2] = nx / l; out[k][3] = ny / l; }
  return { pts: out, len: tot };
}
export function arcPts(x0, y0, x1, y1, lift, n = 40) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 - lift, out = [];
  for (let k = 0; k <= n; k++) { const u = k / n, v = 1 - u; out.push([v * v * x0 + 2 * v * u * cx + u * u * x1, v * v * y0 + 2 * v * u * cy + u * u * y1]); }
  return out;
}
export function voiceWave(ctx, t, pts, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || !pts || pts.length < 2) return null;
  const n = o.n ?? 140, col = o.col ?? GOLD, R = resample(pts, n), P0 = R.pts, syl = sylOf(o.seed ?? 1);
  const u0 = clamp(o.u0 ?? 0), u1 = clamp(o.u1 ?? 1); if (u1 - u0 < .004) return null;
  const amp = o.amp ?? 40, sp = (o.speed ?? 60) / Math.max(1, R.len), flat = clamp(o.flat ?? 0), trem = clamp(o.tremble ?? 0), fl = clamp(o.flicker ?? 0);
  const taper = o.taper ?? .18;
  const prof = (u) => {
    const x = u - sp * t; let m = 0;
    for (const s of syl) { const d = ((x - s.c) % 1 + 1.5) % 1 - .5, g = s.h * Math.exp(-((d / s.w) ** 2)); m = 1 - (1 - m) * (1 - g); }
    const e0 = smooth(clamp((u - u0) / taper)), e1 = smooth(clamp((u1 - u) / taper));
    return (.16 + .84 * m) * e0 * e1 * (1 - .93 * flat) * (1 + trem * .22 * Math.sin(t * 21 + u * 47));
  };
  const k0 = Math.ceil(u0 * n), k1 = Math.floor(u1 * n); if (k1 - k0 < 1) return null;
  const A = [], top = [], bot = [];
  for (let k = k0; k <= k1; k++) { const [x, y, nx, ny] = P0[k], m = prof(k / n) * amp; A.push(m); top.push([x + nx * m, y + ny * m]); bot.push([x - nx * m * .62, y - ny * m * .62]); }
  const line = (arr) => { ctx.beginPath(); arr.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); };
  const band = (f) => { const out = []; for (let k = k0, j = 0; k <= k1; k++, j++) { const [x, y, nx, ny] = P0[k]; out.push([x + nx * A[j] * f, y + ny * A[j] * f]); } return out; };
  const ctr = P0.slice(k0, k1 + 1);
  ctx.save(); ctx.globalAlpha *= a; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // light around it
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba(col.halo, .07); ctx.lineWidth = amp * 2.6; line(ctr); ctx.stroke();
  ctx.strokeStyle = rgba(col.halo, .12); ctx.lineWidth = amp * 1.2; line(ctr); ctx.stroke();
  ctx.restore();
  // the copy's ghost (behind): the same outline, a little off, breathing in and out of register
  if (fl > 0) {
    const gx = fl * (amp * .16 * Math.sin(t * 5.3) + amp * .06 * Math.sin(t * 13.1 + 1)), gy = fl * (amp * .1 * Math.sin(t * 4.1 + 2));
    ctx.save(); ctx.translate(gx, gy); ctx.globalAlpha *= .3 * fl;
    ctx.fillStyle = col.body; ctx.beginPath(); top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // the body
  ctx.fillStyle = rgba(mixHex(col.body, col.halo, .25), .72); ctx.beginPath(); top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath(); ctx.fill();
  // inner bands (the thumbnail's arcs) and the bright core line
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [f, al] of [[.74, .3], [.48, .38], [.24, .46]]) { ctx.strokeStyle = rgba(col.core, al); ctx.lineWidth = Math.max(1, amp * .03); line(band(f)); ctx.stroke(); }
  ctx.strokeStyle = rgba(col.line, .5); ctx.lineWidth = Math.max(1, amp * .045); line(top); ctx.stroke();
  ctx.strokeStyle = rgba(col.core, .9); ctx.lineWidth = Math.max(1.2, amp * .05); line(ctr); ctx.stroke();
  if (o.cut) {   // a short snippet lit bright (the recording)
    const [ca, cb] = o.cut, sub = []; for (let k = k0, j = 0; k <= k1; k++, j++) if (k / n >= ca && k / n <= cb) sub.push(j);
    if (sub.length > 1) { const cu = o.cutA ?? 1; ctx.strokeStyle = rgba(col.core, .8 * cu); ctx.lineWidth = Math.max(2, amp * .1); line(sub.map((j) => ctr[j])); ctx.stroke(); ctx.strokeStyle = rgba(col.halo, .25 * cu); ctx.lineWidth = amp * 1.4; line(sub.map((j) => ctr[j])); ctx.stroke(); }
  }
  ctx.restore();
  ctx.restore();
  return { at: (u) => { const k = clamp(Math.round(u * n), 0, n); return P0[k]; }, len: R.len };
}

// ======================================================================================================================== THE AGREEMENTS (gold notes)
// one note (centre x, y; s = width px): warm paper, a small dark magnet on top, a curled corner. o.lines ['TEXT', …] (Inter caps, dark ink),
// o.cover 0..1 = a gold bar hides the text (the code word stays secret), o.lit 0..1 = it glows (it holds), o.empty 0..1 = only a dashed
// outline (the place for an agreement that does not exist yet), o.tilt (rad), o.a, o.size (text size as a share of s, default .13)
export function note(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 1) return;
  const w = s, h = s * .9, c = s * .15, tilt = (o.tilt ?? 0) + .01 * Math.sin(t * .6 + x * .013), em = clamp(o.empty ?? 0), lit = clamp(o.lit ?? 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.globalAlpha *= a;
  if (em > 0) {
    ctx.save(); ctx.globalAlpha *= em; ctx.strokeStyle = rgba(mixHex(GOLD.deep, GOLD.halo, .5), .9); ctx.lineWidth = Math.max(2, s * .03); ctx.setLineDash([s * .07, s * .055]);
    ctx.lineDashOffset = -t * s * .04; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.setLineDash([]);
    if (o.glowIn) { halo(ctx, 0, 0, s * 1.3, .6 * o.glowIn, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.body, .35 * o.glowIn); ctx.fillRect(-w / 2, -h / 2, w, h); }
    ctx.restore();
  }
  if (em < 1) {
    ctx.globalAlpha *= 1 - em;
    if (lit > 0) halo(ctx, 0, 0, s * 1.15, .32 * lit, GOLD.halo, GOLD.core);
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + s * .04, -h / 2 + s * .06, w, h);
    const pp = new Path2D(); pp.moveTo(-w / 2, -h / 2); pp.lineTo(w / 2, -h / 2); pp.lineTo(w / 2, h / 2 - c); pp.quadraticCurveTo(w / 2 - c * .25, h / 2 - c * .25, w / 2 - c, h / 2); pp.lineTo(-w / 2, h / 2); pp.closePath();
    ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(GOLD.core, P.cream, .35)], [1, mixHex(GOLD.body, GOLD.halo, .3)]]); ctx.fill(pp);
    ctx.fillStyle = mixHex(GOLD.halo, GOLD.deep, .35); ctx.beginPath(); ctx.moveTo(w / 2, h / 2 - c); ctx.lineTo(w / 2 - c, h / 2); ctx.lineTo(w / 2 - c * .78, h / 2 - c * .78); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(0, -h / 2 + s * .07, s * .05, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(P.blue1, .8); ctx.beginPath(); ctx.arc(-s * .015, -h / 2 + s * .058, s * .017, 0, TAU); ctx.fill();
    const lines = o.lines ?? [], sz = s * (o.size ?? .13), ink = mixHex(P.night1, GOLD.deep, .25);
    lines.forEach((ln, i) => E.glowText(ctx, ln, 0, -((lines.length - 1) * sz * 1.25) / 2 + i * sz * 1.25 + sz * .38 + s * .04, { size: sz, weight: 600, align: 'center', col: ink, glow: false, spacing: .04 }));
    const cv = clamp(o.cover ?? 0);
    if (cv > 0) { const bw = w * .66 * expoOut(cv), bh = s * .17; ctx.fillStyle = lin(ctx, 0, s * .04 - bh / 2, 0, s * .04 + bh / 2, [[0, GOLD.body], [1, mixHex(GOLD.halo, GOLD.deep, .3)]]); ctx.beginPath(); ctx.roundRect(-bw / 2, s * .04 - bh / 2, bw, bh, bh * .3); ctx.fill(); }
  }
  ctx.restore();
}

// ======================================================================================================================== THE PHONE
// your contact picture: the yellow hood (you) on a blue disc. Faceless, like you everywhere.
export function avatar(ctx, x, y, r, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  ctx.fillStyle = lin(ctx, x, y - r, x, y + r, [[0, mixHex(P.blue0, P.ind1, .3)], [1, P.ind1]]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  ctx.fillStyle = lin(ctx, x - r, 0, x + r, 0, [[0, E.COAT.shade], [.5, E.COAT.base], [1, E.COAT.lit]]);
  ctx.beginPath(); ctx.ellipse(x, y + r * .95, r * .78, r * .55, 0, 0, TAU); ctx.fill();                  // shoulders
  ctx.beginPath(); ctx.ellipse(x, y - r * .05, r * .42, r * .47, 0, 0, TAU); ctx.fill();                   // the hood
  ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.beginPath(); ctx.ellipse(x + r * .04, y + r * .02, r * .25, r * .3, 0, 0, TAU); ctx.fill();   // the opening (no face)
  ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .35 * (o.a ?? 1)); ctx.lineWidth = Math.max(1, r * .05); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
}
const hms = (s) => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(ss).padStart(2, '0'); };
// phone(ctx, t, x, y, h, o): centre (x, y), body height h px. o.screen 'call' (your picture, ringing) | 'timer' (o.timer seconds, the call
// running) | 'video' (the fake agent: a man before a flag and a seal; o.seal 0..1 = the seal sits crooked) | 'contacts' (o.hi row lit:
// your name) | 'wave' (a voice on the line, o.waveCol) | 'dark'. o.ring 0..1 = it vibrates (side marks), o.rot (rad), o.light (screen),
// o.flat (lying on a table: a perspective squash 0..1). Returns { screen } in screen px (axis-aligned, for clip frames and portals).
export function phone(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const w = h * .5, r = h * .085, ring = clamp(o.ring ?? 0), li = o.light ?? 1, kind = o.screen ?? 'dark';
  const vx = ring * h * .01 * Math.sin(t * 44), rot = (o.rot ?? 0) + ring * .018 * Math.sin(t * 37 + 1), sq = 1 - .55 * clamp(o.flat ?? 0);
  const m = h * .035, sx = -w / 2 + m, sy = -h / 2 + m * 1.6, sw = w - 2 * m, sh = h - 3.2 * m;
  ctx.save(); ctx.translate(x + vx, y); ctx.rotate(rot); ctx.scale(1, sq); ctx.globalAlpha *= a;
  const glowCol = kind === 'video' || (kind === 'wave' && o.waveCol === COPY) ? COPY : kind === 'dark' ? null : LAMP;
  if (glowCol && li > 0) halo(ctx, 0, 0, h * 1.25, .2 * li, glowCol.halo, glowCol.core);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(-w / 2 + h * .03, -h / 2 + h * .04, w, h, r); ctx.fill();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .35), .8); ctx.lineWidth = Math.max(1, h * .012); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, r * .6); ctx.clip(); ctx.translate(sx, sy);
  const bg = kind === 'dark' ? [P.night0, P.night1] : kind === 'video' ? [mixHex(P.blue0, P.ind1, .5), P.night1] : [mixHex(P.ind1, P.blue0, .35), P.night1];
  ctx.fillStyle = lin(ctx, 0, 0, 0, sh, [[0, bg[0]], [1, bg[1]]]); ctx.fillRect(0, 0, sw, sh);
  ctx.globalAlpha *= clamp(li);
  if (kind === 'call' || kind === 'timer') {
    const big = kind === 'call', ar = sw * (big ? .26 : .16), ay = sh * (big ? .33 : .22);
    if (big && ring > 0) { ctx.fillStyle = rgba(LAMP.body, .1 + .1 * Math.sin(t * 6)); ctx.beginPath(); ctx.arc(sw / 2, ay, ar * (1.25 + .1 * Math.sin(t * 6)), 0, TAU); ctx.fill(); }
    avatar(ctx, sw / 2, ay, ar);
    if (kind === 'timer') E.glowText(ctx, hms(o.timer ?? 0), sw / 2, sh * .52, { size: sw * .16, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .03 });
    if (big) { ctx.fillStyle = rgba(P.cream, .85); ctx.beginPath(); ctx.arc(sw * .28, sh * .84, sw * .085, 0, TAU); ctx.fill(); ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.arc(sw * .72, sh * .84, sw * .085, 0, TAU); ctx.fill(); }
    else { ctx.fillStyle = rgba(P.cream, .8); ctx.beginPath(); ctx.arc(sw / 2, sh * .84, sw * .08, 0, TAU); ctx.fill(); }
  } else if (kind === 'video') {
    // the fake agent: a flag (blue and cream bands, never red) behind him, a seal on the wall (o.seal: crooked), a man in a suit
    const fx = sw * .06, fy = sh * .1, fw = sw * .5, fh = sh * .3;
    for (let k = 0; k < 7; k++) { ctx.fillStyle = k % 2 ? mixHex(P.cream, P.halo2, .4) : mixHex(P.blue1, P.blue0, .5); ctx.fillRect(fx, fy + k * fh / 7, fw, fh / 7 + .5); }
    ctx.fillStyle = mixHex(P.ind1, P.blue0, .3); ctx.fillRect(fx, fy, fw * .42, fh * .55);
    ctx.save(); ctx.translate(sw * .78, sh * .2); ctx.rotate(.25 * clamp(o.seal ?? 0)); ctx.fillStyle = mixHex(GOLD.body, P.cream, .3); ctx.beginPath(); ctx.arc(0, 0, sw * .13, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(GOLD.deep, .8); ctx.lineWidth = sw * .014; ctx.beginPath(); ctx.arc(0, 0, sw * .095, 0, TAU); ctx.stroke(); ctx.fillStyle = GOLD.deep; star(ctx, 0, 0, sw * .05); ctx.restore();
    E.person(ctx, sw * .5, sh * 1.02, sh * .8, { long: true, look: .05 });
  } else if (kind === 'contacts') {
    for (let k = 0; k < 6; k++) {
      const ry = sh * (.14 + k * .14), hi = k === (o.hi ?? 2);
      if (hi) { ctx.fillStyle = rgba(GOLD.body, .22 + .1 * (o.hiA ?? 1)); ctx.fillRect(0, ry - sh * .06, sw, sh * .12); avatar(ctx, sw * .16, ry, sw * .085); ctx.fillStyle = GOLD.text; ctx.fillRect(sw * .32, ry - sh * .012, sw * .4, sh * .024); }
      else { ctx.fillStyle = rgba(P.blue1, .9); ctx.beginPath(); ctx.arc(sw * .16, ry, sw * .07, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(P.halo2, .35); ctx.fillRect(sw * .32, ry - sh * .01, sw * (.3 + .25 * ((k * 37) % 7) / 7), sh * .02); }
    }
  } else if (kind === 'wave') {
    voiceWave(ctx, t, [[sw * .08, sh * .5], [sw * .92, sh * .5]], { amp: sw * .16, col: o.waveCol ?? GOLD, seed: o.seed ?? 4, speed: sw * .5, flat: o.waveFlat ?? 0, tremble: o.tremble ?? 0 });
  } else {
    ctx.fillStyle = lin(ctx, 0, 0, sw, sh, [[0, rgba(P.blue1, .12)], [.5, rgba(P.blue1, 0)]]); ctx.fillRect(0, 0, sw, sh);
  }
  ctx.restore();
  ctx.restore();
  // vibration marks (short strokes at both sides; never rings)
  if (ring > .02) {
    ctx.save(); ctx.strokeStyle = rgba(P.cream, .55 * ring * a); ctx.lineWidth = Math.max(1.2, h * .018); ctx.lineCap = 'round';
    for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) { const yy = y + (k - 1) * h * .16, xx = x + sd * (w / 2 + h * .1 + h * .02 * Math.sin(t * 9 + k)); ctx.beginPath(); ctx.moveTo(xx, yy - h * .05); ctx.lineTo(xx + sd * h * .02, yy + h * .05); ctx.stroke(); }
    ctx.restore();
  }
  const c = Math.cos(o.rot ?? 0), s = Math.abs(Math.sin(o.rot ?? 0)), ew = sw * Math.abs(c) + sh * sq * s, eh = sh * sq * Math.abs(c) + sw * s;
  return { screen: { x: x + vx - ew / 2, y: y + (sy + sh / 2) * sq * Math.abs(c) - eh / 2, w: ew, h: eh }, body: { x: x - w / 2, y: y - h / 2 * sq, w, h: h * sq } };
}
function star(ctx, x, y, r) { ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }

// ======================================================================================================================== PEOPLE
// the mother: E.person in a long coat (indigo, no yellow), a silver bun at the back of the head, a slight stoop. Faceless. → hands
export function mom(ctx, x, y, h, o = {}) {
  const lean = o.lean ?? .05, q = { long: true, lean, ...o }; const hands = E.person(ctx, x, y, h, q);
  const dir = q.dir ?? 1, look = q.look ?? 0, side = q.view === 'side' || q.walk != null;
  const hx = (side ? .012 : 0) - .012 * look, hy = -.885 - .008 * look;
  const bu = hx - .055, bv = hy - .035, du0 = bu, dv = bv + .47, cs = Math.cos(lean), sn = Math.sin(lean);
  const u = du0 * cs - dv * sn, v = du0 * sn + dv * cs - .47;
  const hairU = hx * cs - (hy + .47) * sn, hairV = hx * sn + (hy + .47) * cs - .47;
  ctx.save(); ctx.strokeStyle = rgba(mixHex(P.halo2, P.blue1, .45), .7); ctx.lineWidth = Math.max(1, h * .012);
  ctx.beginPath(); ctx.arc(x + h * dir * hairU, y + h * hairV, h * .068, Math.PI * 1.1, Math.PI * 1.75); ctx.stroke();
  ctx.fillStyle = mixHex(P.blue2, P.halo2, .3); ctx.beginPath(); ctx.ellipse(x + h * dir * u, y + h * v, h * .036, h * .032, 0, 0, TAU); ctx.fill();
  ctx.restore();
  return hands;
}
// two-segment arm IK for E.du / E.person / mom (arm angles from straight down, + = toward the facing side; L1 .17, L2 .155 of the height)
export function reachArm(sh, tg, L1 = .17, L2 = .155, bend = 1) {
  const dx = tg[0] - sh[0], dy = tg[1] - sh[1], d = Math.min(Math.hypot(dx, dy), (L1 + L2) * .999), base = Math.atan2(dx, dy);
  const k = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), a1 = base - bend * k, el = [sh[0] + Math.sin(a1) * L1, sh[1] + Math.cos(a1) * L1];
  return [a1, Math.atan2(tg[0] - el[0], tg[1] - el[1])];
}

// ======================================================================================================================== EXPLAINER PIECES
// a coin that flips (o.ph = flip angle, rad): flat gold disc, its edge as a darker rim when it turns
export function coin(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const c = Math.cos(o.ph ?? 0), ry = Math.max(r * .07, Math.abs(c) * r);
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, r * 2.2, .22, GOLD.halo, GOLD.core);
  ctx.fillStyle = GOLD.deep; ctx.beginPath(); ctx.ellipse(x, y + r * .07, r, ry, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = c >= 0 ? lin(ctx, x - r, y - ry, x + r, y + ry, [[0, GOLD.core], [1, GOLD.body]]) : lin(ctx, x - r, y - ry, x + r, y + ry, [[0, GOLD.body], [1, GOLD.halo]]);
  ctx.beginPath(); ctx.ellipse(x, y, r, ry, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.deep, .45); ctx.lineWidth = Math.max(1, r * .05); ctx.beginPath(); ctx.ellipse(x, y, r * .78, ry * .78, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}
// THE NUMBER (top left, serif): rolls on its word (log scale between from and v). o.pre / o.post ('$', ' BILLION'), o.dec (decimals), o.label
export const TALLY = { x: 110, y: 214, size: 120 };
export const fmt = (v, dec = 0) => (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US'));
export function tally(ctx, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const x = o.x ?? TALLY.x, y = o.y ?? TALLY.y, size = o.size ?? TALLY.size, u = clamp(o.u ?? 1), from = o.from ?? o.v, to = o.v;
  const lf = Math.log(Math.max(1e-3, from)), lt = Math.log(Math.max(1e-3, to)), v = u >= 1 ? to : Math.exp(lerp(lf, lt, expoOut(u)));
  const s = (o.pre ?? '') + fmt(v, o.dec ?? 0) + (o.post ?? ''), roll = u > 0 && u < 1 ? 1 - expoOut(u) : 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  const wd = maskLine(ctx, [[s, 0]], x, y + roll * size * .06, size, o.rise ?? 1, { serif: true, col: o.col ?? P.core0, glow: true, align: o.align }).w;
  if (o.label) maskLine(ctx, [[o.label, 0]], x + (o.align === 'center' ? 0 : 4), y + size * .42, Math.round(size * .19), o.lrise ?? o.rise ?? 1, { serif: false, weight: 600, col: P.halo2, glow: false, align: o.align });
  ctx.restore();
  return { x, y, w: wd, v };
}

// ======================================================================================================================== WORDS ON SCREEN
// STEP k OF 5 · THE NAME (top left): small gold caps, then the name in serif. u rises (the caller sinks it with 1 − expoIn(...))
export function stepLabel(ctx, t, k, name, u, o = {}) {
  if (u <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const x = o.x ?? 112, y = o.y ?? 150;
  maskLine(ctx, [[`STEP ${k} OF 5`, 0]], x, y, 22, u, { serif: false, weight: 600, col: GOLD.text, glow: false });
  maskLine(ctx, [[name, 0]], x - 3, y + 80, 80, rise(span(u, .12, 1)), { serif: true, col: P.core0, glow: true });
  ctx.restore();
}
// the thumbnail line: Inter 600 caps, cream with a soft glow, slightly condensed. u rises, o.out sinks (0..1)
export function thesis(ctx, t, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 120, lines = o.lines ?? ['IT’S NOT', 'YOUR MOM'];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(.9, 1.08);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)) * (o.out != null ? 1 - expoIn(clamp(o.out * (1 + .12 * (lines.length - 1)) - i * .12)) : 1);
    if (ui > 0) maskLine(ctx, [[ln, 0]], 0, i * size * .98, size, ui, { serif: false, weight: 600, col: i === (o.gold ?? -1) ? GOLD.text : P.core0, glow: true, align: o.align });
  });
  ctx.restore();
}
// the small SCENARIO line (REGELN §3.6): a scene without a factual claim. t0 in, t1 out. o.sub = a second small line
export function scenario(ctx, t, t0, t1, o = {}) {
  const u = rise(span(t, t0, t0 + .8)) * (1 - expoIn(span(t, t1 - .6, t1))); if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [['SCENARIO', 0]], o.x ?? 112, o.y ?? 150, 22, u, { serif: false, weight: 600, col: P.halo2, glow: false });
  if (o.sub) maskLine(ctx, [[o.sub, 0]], o.x ?? 112, (o.y ?? 150) + 34, 22, rise(span(t, t0 + .2, t0 + 1)) * (1 - expoIn(span(t, t1 - .6, t1))), { serif: false, weight: 600, col: P.cream, glow: false });
  ctx.restore();
}
// source lines (F.source), text-v2 Einblendungen; faktenzettel.md and the newest vo-vN override. Interested senders say so on screen.
export const SOURCES = {
  clone: 'FTC, 2023 · PLOS ONE, 2025',
  losses: 'FBI INTERNET CRIME REPORT 2025 · REPORTED LOSSES',
  ear: 'SCIENTIFIC REPORTS · JUNE 22, 2026',
  senate: 'U.S. SENATE SPECIAL COMMITTEE ON AGING · JULY 29, 2026',
  dialer: 'FTC: SELLERS MUST CONNECT A PERSON WITHIN 2 SECONDS',
  codeword: 'FBI PSA, DEC 5, 2025 · FTC, 2026',
  ftcStory: 'FTC CONSUMER ALERT, 2026',
  report: "AN AI COMPANY'S OWN THREAT REPORT · SEPT 2026",
  canada: 'CP24 · REPORTED JUNE 2026',
  invest: 'FBI INTERNET CRIME REPORT 2025 · AGE 60+',
  aiLine: 'FBI 2025: FIRST AI CATEGORY · LIKELY HIGHER',
  fbiChicago: 'FBI CHICAGO · JULY / AUG 2026',
  ftcShare: 'FTC · OCT 19, 2026',
  ftcPlan: 'FTC · "ACTION PLAN"',
  finra: 'FINRA RULE 4512',
  states: 'MARYLAND, OCT 1, 2026 · NORTH CAROLINA, JULY 2, 2026',
  aba: 'AMERICAN BANKERS ASSOCIATION · U.S. SENATE · JULY 29, 2026',
  study: 'USENIX SECURITY 2026 · VIA WIRED, JULY 30, 2026 · 22 PARTICIPANTS',
};

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// Every clip frame grows out of a screen or window IN the world (o.from: her phone's screen, the fake call's screen, the bank's counter
// window) and shrinks back into it after the clip: that is the "Einordnung" transition. Above the frame: NAME (serif) · ROLE · DATE (small caps)
// left, ORIGINAL FOOTAGE (or the clip's own label) right. The frame sits above the subtitle band (bottom ≤ 880).
// Footage (20.11.2026, checked against the sound): S1, C1, S2 are real footage; C10 is a QUOTE CARD (podcast narrator with a music bed: no
// footage, no clip sound). Frames: <$F65CLIPS or $F65SCRATCH/clips>/<id>/f00001.jpg… at 30 fps, made by `python3 tools/f65_film.py clips`
// from <ROOT>clips/*.mp4 (scratchpad only). No frames yet → a PLACEHOLDER (never ship it; tools/f65_film.py check warns).
// fit: 'cover' fills the frame (S1, S2 are 16:9 720p); 'contain' keeps the whole picture, no distortion (C1 is 1920×1012 with burned-in subtitles).
export const CLIP_RECT = { x: 270, y: 104, w: 1380, h: 776 };
const CLIPS0 = {
  S1: { name: 'Deborah Del Mastro', role: 'U.S. Senate Special Committee on Aging', date: 'July 2026', fit: 'cover', len: 3.6 },
  C1: { name: 'Mark Meador', role: 'FTC Commissioner', date: '', fit: 'contain', len: 7.04 },
  S2: { name: 'Paul Benda', role: 'American Bankers Association', date: '', fit: 'cover', len: 6.97 },   // he says "In THOSE moments" (not "these")
  C10: { name: 'Inside the FBI Podcast', role: 'Federal Bureau of Investigation', date: 'Aug 2026', card: true, label: 'QUOTE', len: 6.87,
    quote: ['“If a would-be agent tries to isolate', 'and burden you with an overwhelming', 'level of urgency, they may be a scammer.”'] },
};
const CLIPS_JSON = [process.env.F65CLIPSJSON, ROOT + 'audio/clips.json', ROOT + 'clips.json'].find((f) => f && fs.existsSync(f));
let RAWMETA = {}; try { RAWMETA = CLIPS_JSON ? JSON.parse(fs.readFileSync(CLIPS_JSON, 'utf8')) : {}; } catch { RAWMETA = {}; }
export const CLIPMETA = Array.isArray(RAWMETA.clips) ? Object.fromEntries(RAWMETA.clips.map((c) => [c.id, c])) : RAWMETA;
export const CLIPS = Object.fromEntries(Object.entries(CLIPS0).map(([id, c]) => { const m = CLIPMETA[id] || {}; return [id, { ...c, ...(m.fit ? { fit: m.fit } : {}), ...(m.label ? { label: m.label } : {}) }]; }));
export const FOOTAGE_IDS = Object.keys(CLIPS0).filter((id) => !CLIPS0[id].card);
export const SCRATCH = (process.env.F65SCRATCH || '/tmp/claude-0/-home-user/28ef6e8e-c29c-527f-9852-0aff6f62d978/scratchpad/f65').replace(/\/$/, '');
const CLIPDIR = (process.env.F65CLIPS || SCRATCH + '/clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; const off = Number((CLIPMETA[id] || {}).offset) || 0; return Math.max(1, Math.min(n, Math.floor((t - win.start - off) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
export const hasFootage = (id) => !CLIPS[id]?.card && frameCount(id) > 0;
export async function prepareClipFrames(T, t) {
  for (const id of FOOTAGE_IDS) {
    const win = clipWin(T, id); if (!win || t < win.start - 6 || t > win.end + 2) continue;
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
function clipFrameAt(id, t, win) { const k = frameAt(id, t, win); return k ? frameCache.get(framePath(id, k)) || null : null; }
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
// o: { from {x, y, w, h} (the screen it grows from), morph 0..1 (0 = the source, 1 = CLIP_RECT; sineIO it yourself or not), dark 0..1,
//      label 0..1 (default: rises after the frame is full, sinks .5 s before the slot ends) }
export function clipFrame(ctx, t, T, id, o = {}) {
  const R = CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id] || { name: id, role: '', date: '' }, m = clamp(o.morph ?? 1), dark = clamp(o.dark ?? 0);
  const f = o.from ?? { x: R.x + R.w / 2 - 20, y: R.y + R.h / 2 - 12, w: 40, h: 24 };
  const x = lerp(f.x, R.x, m), y = lerp(f.y, R.y, m), w = lerp(f.w, R.w, m), h = lerp(f.h, R.h, m), rr = lerp(Math.min(10, f.w / 4), 12, m);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (m < 1) halo(ctx, x + w / 2, y + h / 2, Math.max(w, h) * .75, .18 * (1 - m * .7), LAMP.halo, LAMP.core);
  const shape = () => { ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(x, y, w, h);
  const fr = info.card ? null : clipFrameAt(id, t, win);
  if (info.card) quoteCardBody(ctx, t, win, info, x, y, w, h, m, dark);
  else if (fr) { const s = (info.fit === 'contain' ? Math.min : Math.max)(R.w / fr.width, R.h / fr.height) * (w / R.w), dw = fr.width * s, dh = fr.height * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, x + w / 2 - dw / 2, y + h / 2 - dh / 2, dw, dh); ctx.globalAlpha = 1; }
  else {   // PLACEHOLDER (no footage yet). Never ship this.
    const u = clamp((t - win.start) / Math.max(.1, win.end - win.start)), cx = x + w / 2, cy = y + h / 2;
    ctx.fillStyle = rad(ctx, cx, cy - h * .1, w * .6, [[0, rgba(P.blue0, .55 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(x, y, w, h);
    const by = y + ((t * .16) % 1) * h; ctx.fillStyle = rgba(P.cream, .035 * (1 - dark)); ctx.fillRect(x, by - 50, w, 100);
    if (m > .6) {
      ctx.globalAlpha = (1 - dark) * .85 * span(m, .6, 1);
      E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 8, { size: 24, weight: 600, align: 'center', col: P.halo2, glow: false, spacing: .14 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .3, cy + 44, w * .6 * u, 3); ctx.globalAlpha = 1;
    }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(x, y, w, h); }
  ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = lerp(1.5, 2.5, m); shape(); ctx.stroke();
  const lu = (o.label ?? (span(t, win.start + .15, win.start + 1.0) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {
    const by = R.y - 24, nw = maskLine(ctx, [[info.name, 0]], R.x, by, 40, rise(lu), { glow: true }).w;
    maskLine(ctx, [[[info.role, info.date].filter(Boolean).join(' · ').toUpperCase(), 0]], R.x + nw + 22, by - 2, 18, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
    const lab = info.label ?? 'ORIGINAL FOOTAGE';   // C10: QUOTE (no footage)
    maskLine(ctx, [[lab, 0]], R.x + R.w - measure(lab, 18, false), by - 2, 18, rise(lu), { serif: false, weight: 600, col: GOLD.text, glow: false });
  }
  ctx.restore();
  return { x, y, w, h };
}

// C10 · the quote card inside the clip frame: night paper, the quote in three serif lines (rising one by one as the frame fills), a thin gold
// rule that runs with the slot (the "sound" of the quote, without sound), the source small below. Text stays on screen the whole slot.
function quoteCardBody(ctx, t, win, info, x, y, w, h, m, dark) {
  const cx = x + w / 2, cy = y + h / 2, s = w / CLIP_RECT.w, a = 1 - dark;
  ctx.fillStyle = rad(ctx, cx, cy - h * .15, w * .7, [[0, rgba(mixHex(P.ind1, P.blue0, .3), .9 * a)], [1, rgba(P.night0, 0)]]); ctx.fillRect(x, y, w, h);
  dotField(ctx, t, { x, y, w, h, n: 40, r: 1.6, a: .22 * a, seed: 65, onCol: GOLD });
  if (m < .5) return;
  const L = info.quote || [], size = 56 * s, lh = size * 1.32, y0 = cy - (L.length - 1) * lh / 2 - 20 * s;
  ctx.save(); ctx.globalAlpha = a;
  L.forEach((ln, i) => {
    const u = span(t, win.start - .5 + i * .22, win.start + .5 + i * .22) * span(m, .5, 1);
    maskLine(ctx, [[ln, 0]], cx - measure(ln, size, true) / 2, y0 + i * lh, size, rise(u), { glow: false, col: P.cream });
  });
  const pu = clamp((t - win.start) / Math.max(.1, win.end - win.start)), ry = y0 + (L.length - 1) * lh + 58 * s;
  ctx.fillStyle = rgba(GOLD.line, .28); ctx.fillRect(cx - 220 * s, ry, 440 * s, 2);
  ctx.fillStyle = rgba(GOLD.line, .85); ctx.fillRect(cx - 220 * s, ry, 440 * s * pu, 2);
  const src = 'INSIDE THE FBI PODCAST · FBI.GOV';
  maskLine(ctx, [[src, 0]], cx - measure(src, 17 * s, false) / 2, ry + 40 * s, 17 * s, rise(span(t, win.start + .6, win.start + 1.4)), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
}
