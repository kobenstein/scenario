// Film 70 · "Harari's Biggest Fear About AI Isn't Robots" (thumbnail A: WORSE THAN KILLER ROBOTS) · shared kit (owned by the lead;
// builders import, never edit — wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText,
// the 2.5D stage, finish) + lib/f16_kit.mjs (rise, maskLine, measure) + lib/f54_kit.mjs (bracket, source).
// Plan: docs/MOTION.md · shots: docs/shots.md · stage: lib/f70_explain.mjs (THE TRUST BOARD) · Leitbild + seams: lib/f70_world.mjs.
//
//   THE CHAIN (the spine of the film): four links between you and the systems that decide about your life: MONEY · CONTRACT · LAW ·
//     TRUTH. Big over the night as the Leitbild (lib/f70_world.mjs chainWorld, 4 anchors only), small top right as THE CHAIN HUD from
//     2.23 on. It changes by itself on the CHAIN phrases: the link being looked at lights; its crack runs on its crack sentence; at
//     'And trust can be tested' every crack fills with gold (mended, the crack stays visible). Never red, never broken apart.
//     chainLink() one link · chain() links along a path · catenary() the hanging path · chainState(T, t) · chainHud(ctx, t, T, o).
//   OBJECTS: payCard() (your card) · terminal() (the card reader: beep ring + gold check) · bread() · coin() · cow() (side view, grazes,
//     ear tag) · sleeve() (your yellow sleeve + hand, the only yellow besides you) · quoteCard() (Q1–Q3, words light as spoken) ·
//     dataCard() / paperCard() / verdict() · numberRoll() (a number that rolls to its value) · clipPlate() (C1–C3).
//
// Colour code: GOLD = what holds / the ONE hero light (the chain, a check, a mended crack, a verdict) · CREAM = open, paper, questions,
// quotes · COOL = machines, screens, AI · LAMP = people's lights and windows (warm, never gold) · the yellow coat = only you.
// Away = screen right; coming back = right → left. Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only.
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

export const PRINT70 = { grain: 14, floor: 4, vig: .5 };
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
  if (!(u > 0)) { for (const [txt] of segs) { xs.push(xx); xx += mw(txt); } return { w: total, xs, x0: xs[0] }; }   // u = 0: invisible, and the glow must not bleed above the clip
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
// WORSE THAN / KILLER ROBOTS like thumbnail A: heavy condensed caps, cream with a warm glow, left; the small line under it. u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 72, y = o.y ?? 470, lines = o.lines ?? ['WORSE THAN', 'KILLER ROBOTS'], cond = o.cond ?? .7;
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
// The plate grows out of a thing on the board (o.from = { x, y, w, h } screen rect, or [cx, cy, r]) and goes back into it.
// Lower third ABOVE the plate (≥ 22 px): row 1 NAME (serif) · ROLE · YEAR … ORIGINAL FOOTAGE at the right; row 2 the context (who with,
// published). C3: the first ~2 s show Suleyman listening, so its lower third waits (labelDelay) until Harari is in the picture.
// Frames: <F70CLIPS or /tmp/claude-0/f70/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, frame 1 = the first word: the ~1 s pre-roll of the
// files is skipped by `python3 tools/f70_clips.py clips`). Until the frames exist a marked placeholder shows (never ship it).
export const CLIP_RECT = { x: 160, y: 150, w: 1600, h: 900 };
const WITH_SULEYMAN = 'IN CONVERSATION WITH MUSTAFA SULEYMAN, CEO MICROSOFT AI · PUBLISHED 18 NOV 2026';
export const CLIPS = {   // clips-geprueft.json + clips-zeiten.txt (25.11.)
  C1: { name: 'Yuval Noah Harari', role: 'Historian', year: '2026', sub: WITH_SULEYMAN },
  C2: { name: 'Yuval Noah Harari', role: 'Historian', year: '2026', sub: 'THE ECONOMIST · PUBLISHED 22 AUG 2026',
        crop: { x: 200, y: 40, w: 1720, h: 967.5 } },   // source rect: cuts the Economist "E" bug (top left, x 60-160 / y 56-160) and keeps the head
  C3: { name: 'Yuval Noah Harari', role: 'Historian', year: '2026', sub: WITH_SULEYMAN, labelDelay: 2.2 },
};
const CLIPDIR = (process.env.F70CLIPS || '/tmp/claude-0/f70/clips/').replace(/\/?$/, '/');
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
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(8, f.w / 2, f.h / 2) };
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
  if (fr) {   // cover the plate (16:9 into 16:9)
    const c = info.crop ? { x: info.crop.x * fr.width / 1920, y: info.crop.y * fr.height / 1080, w: info.crop.w * fr.width / 1920, h: info.crop.h * fr.height / 1080 } : { x: 0, y: 0, w: fr.width, h: fr.height };
    const sw = c.w, sh = c.h, s = Math.max(R.w / sw, R.h / sh) * (w / R.w), dw = sw * s, dh = sh * s;
    ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, c.x, c.y, sw, sh, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1; }
  else {
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx, cy - h * .05, w * .7, [[0, rgba(P.blue0, .5 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const d0 = win.start + (info.labelDelay ?? 0);
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, d0 + .2, d0 + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {
    const by = R.y - 58, nw = measure(info.name, 44, true);
    maskLine(ctx, [[info.name, 0]], R.x, by, 44, rise(lu), { glow: true });
    maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x + nw + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
    goldText(ctx, [[info.credit ? `ORIGINAL FOOTAGE · ${info.credit.toUpperCase()}` : 'ORIGINAL FOOTAGE', .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
    if (info.sub) maskLine(ctx, [[info.sub, 0]], R.x, by + 34, 22, rise(span(lu, .2, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  }
  ctx.restore();
  return { cx, cy, w, h };
}

// ======================================================================================================================== THE CHAIN
// One link, centred at (x, y), long axis L along angle ang. Face-on = an oval gold ring; o.edge = seen edge-on (every second link of a
// chain): a rounded bar. o: { lit 0..1 (brighter, warm halo), crack 0..1 (a dark jagged crack runs across the upper side of the ring),
// mend 0..1 (the crack fills with hot gold, kintsugi: it stays visible), hair 0..1 (fine strain lines, 2.22), col 'gold' | 'cream'
// (paper, unforged) | 'cool' (a machine's), mould 0..1 (an empty mould: a dashed cream outline instead of metal), a }
const LINKCOL = { gold: ['#5a3812', GOLD.shade, GOLD.body, GOLD.hot], cream: [PAPER.edge, PAPER.shade, PAPER.body, PAPER.lit], cool: [COOL.deep, mixHex(COOL.deep, COOL.body, .5), COOL.body, COOL.core] };
const CRACK = [[0, -.5], [.06, -.18], [-.05, .12], [.04, .42], [-.02, .72], [.03, 1.0]];   // along the ring's width, normalised
export function chainLink(ctx, t, x, y, L, ang, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || L < .5) return;
  const wd = L * .58, th = Math.max(1, L * .14), [c0, c1, c2, c3] = LINKCOL[o.col ?? 'gold'], lit = clamp(o.lit ?? 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang);
  if (lit > 0) halo(ctx, 0, 0, L * 1.25, .32 * lit, GOLD.halo, GOLD.core);
  const mould = clamp(o.mould ?? 0);
  if (mould > 0) {
    ctx.save(); ctx.globalAlpha *= mould; ctx.setLineDash([th * .9, th * .7]); ctx.lineWidth = Math.max(1, th * .3); ctx.strokeStyle = rgba(CREAM, .85);
    ctx.beginPath(); ctx.roundRect(-L / 2, -wd / 2, L, wd, wd / 2); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-L / 2 + th, -wd / 2 + th, L - 2 * th, wd - 2 * th, (wd - 2 * th) / 2); ctx.stroke();
    ctx.restore();
    if (mould >= 1) { ctx.restore(); return; }
    ctx.globalAlpha *= 1 - mould;
  }
  const top = mixHex(c2, c3, .25 + .55 * lit);
  if (o.edge) {
    ctx.fillStyle = c0; ctx.beginPath(); ctx.roundRect(-L / 2, -th * .8, L, th * 1.6, th * .8); ctx.fill();
    ctx.fillStyle = c1; ctx.beginPath(); ctx.roundRect(-L / 2 + th * .1, -th * .78, L - th * .2, th * 1.2, th * .6); ctx.fill();
    ctx.fillStyle = top; ctx.beginPath(); ctx.roundRect(-L / 2 + th * .45, -th * .62, L - th * .9, th * .42, th * .21); ctx.fill();
  } else {
    const ring = () => { ctx.beginPath(); ctx.roundRect(-L / 2 + th / 2, -wd / 2 + th / 2, L - th, wd - th, (wd - th) / 2); };
    ctx.lineWidth = th; ctx.strokeStyle = c0; ctx.save(); ctx.translate(th * .06, th * .1); ring(); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = c1; ring(); ctx.stroke();
    ctx.lineWidth = th * .5; ctx.strokeStyle = top; ctx.save(); ctx.translate(-th * .05, -th * .12); ring(); ctx.stroke(); ctx.restore();
    ctx.lineWidth = Math.max(.8, th * .16); ctx.strokeStyle = rgba(c3, .9); ctx.beginPath();
    ctx.arc(-L / 2 + wd / 2, 0, (wd - th) / 2 - th * .08, Math.PI * 1.05, Math.PI * 1.45); ctx.stroke();
  }
  const hair = clamp(o.hair ?? 0);
  if (hair > 0) {   // strain: three fine hairlines across the metal
    ctx.strokeStyle = rgba(P.night0, .55 * hair); ctx.lineWidth = Math.max(.6, th * .07);
    for (const fx of [-.28, .05, .3]) { ctx.beginPath(); ctx.moveTo(L * fx, -wd / 2 - th * .1); ctx.lineTo(L * (fx + .03), -wd / 2 + th * .9 * hair); ctx.stroke(); }
  }
  const cr = clamp(o.crack ?? 0), md = clamp(o.mend ?? 0);
  if (cr > 0) {   // the crack: jagged, across the upper side of the ring (x ≈ +.14 L), drawn from the outer edge inward
    const cx0 = L * .14, y0 = -wd / 2 - th * .2, len = th * 1.55, n = Math.max(2, Math.ceil(CRACK.length * cr));
    const pts = CRACK.slice(0, n).map(([dx, dy]) => [cx0 + dx * th * 1.4, y0 + (dy + .5) / 1.5 * len]);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = P.night0; ctx.lineWidth = Math.max(1.4, th * .3); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    if (!o.edge) { const pb = pts.map(([px, py]) => [px - th * .1, -py]); ctx.globalAlpha *= cr; ctx.beginPath(); pb.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.globalAlpha /= Math.max(.01, cr); }
    if (md > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(GOLD.core, md); ctx.lineWidth = Math.max(1.4, th * .3) * 1.3;
      ctx.shadowColor = rgba(GOLD.halo, .9 * md); ctx.shadowBlur = th * 1.2;
      const m = Math.max(2, Math.ceil(pts.length * md)); ctx.beginPath(); pts.slice(0, m).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
}
// path helpers: a polyline as [[x, y], …]; at(d) = [x, y, ang] at arc length d
export function pathLen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
export function pathAt(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const sx = pts[i][0] - pts[i - 1][0], sy = pts[i][1] - pts[i - 1][1], l = Math.hypot(sx, sy);
    if (d <= l || i === pts.length - 1) { const f = l > 0 ? clamp(d / l) : 0; return [pts[i - 1][0] + sx * f, pts[i - 1][1] + sy * f, Math.atan2(sy, sx)]; }
    d -= l;
  }
  return [pts[0][0], pts[0][1], 0];
}
// a hanging path from a to b (parabola, sag px at the middle; o.sway px sideways wave, o.n points)
export function catenary(a, b, sag, o = {}) {
  const n = o.n ?? 48, out = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n, w = 4 * f * (1 - f), sw = (o.sway ?? 0) * Math.sin(Math.PI * f) * Math.sin((o.ph ?? 0) + f * 2.2);
    out.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f) + sag * w + sw]);
  }
  return out;
}
// links along a path: o.L (link length, or o.Lat(f) for a size that changes along the path: perspective), o.u 0..1 (drawn on from the
// start), o.link(i, n, f) → per-link options (lit, crack, mend, k = size factor, col, …). Returns [{ x, y, ang, L, i, f }].
export function chain(ctx, t, pts, o = {}) {
  const total = pathLen(pts), u = clamp(o.u ?? 1), out = [];
  const Lat = o.Lat ?? (() => o.L ?? 60);
  let d = Lat(0) * .4, i = 0;
  while (d < total - 1) {
    const f = d / total, L0 = Lat(f), st = o.link ? o.link(i, f) : {}, L = L0 * (st.k ?? 1);
    if (f <= u) { const [x, y, ang] = pathAt(pts, d); out.push({ x, y, ang, L, i, f }); }
    d += L0 * .74 * (st.k ?? 1) * .5 + L0 * .74 * .5; i++;
  }
  // draw edge-on links first (behind), then the face-on ones
  for (const pass of [1, 0]) for (const c of out) if (c.i % 2 === pass) { const st = o.link ? o.link(c.i, c.f) : {}; chainLink(ctx, t, c.x, c.y, c.L, c.ang, { edge: c.i % 2 === 1, a: o.a, ...st }); }
  return out;
}
// THE CHAIN phrases (vo-v3). Never animate a link's state by hand: chainState gives it.
export const CHAIN = {
  names: ['MONEY', 'CONTRACT', 'LAW', 'TRUTH'],
  on: 'the one you would swear is safe',                  // 2.23: the chain shrinks into the HUD
  at: ['Money. Your adviser', 'Contract. A job', 'Law. Rules written', 'Truth. The last link'],
  crack: ['So the first link holds', 'this is how a link cracks', 'Rules may soon be written faster', 'Then we follow the machine'],
  point: ['Four links. Four cracks', "Harari's own answer"],  // anchor 3: the HUD is the big chain, so it hides
  mend: 'And trust can be tested',
  clips: ['C1', 'C2', 'C3'],
};
const CT = new WeakMap();
export function chainTimes(T) {
  if (CT.has(T)) return CT.get(T);
  const on = T.G(CHAIN.on), at = [], crack = []; let prev = on;
  for (let i = 0; i < 4; i++) { const a = T.G(CHAIN.at[i], 0, prev); at.push(a); crack.push(T.G(CHAIN.crack[i], 0, a)); prev = a; }
  const r = { on, at, crack, point: [T.G(CHAIN.point[0], 0, crack[3]), T.G(CHAIN.point[1], 0, crack[3])], mend: T.G(CHAIN.mend, 0, crack[3]),
    clips: CHAIN.clips.map((id) => T.clip(id)).filter(Boolean) };
  CT.set(T, r); return r;
}
// the state at t: { on (HUD visibility: hidden in clip windows and in anchor 3), cur (link being looked at, -1), links: [{ lit, crack, mend }] }
export function chainState(T, t) {
  const b = chainTimes(T); let cur = -1;
  for (let i = 0; i < 4; i++) if (t >= b.at[i] - .3 && t < (i < 3 ? b.at[i + 1] - .3 : b.point[0] - .3)) cur = i;
  const clipHide = b.clips.reduce((m, c) => Math.max(m, span(t, c.start - 1.2, c.start - .4) * (1 - span(t, c.end + .2, c.end + 1))), 0);
  const pointHide = span(t, b.point[0] - .6, b.point[0]) * (1 - span(t, b.point[1] + .4, b.point[1] + 1.2));
  const links = CHAIN.names.map((_, i) => ({ lit: i === cur ? 1 : 0, crack: span(t, b.crack[i] - .05, b.crack[i] + 1.1), mend: span(t, b.mend + .15 + i * .25, b.mend + 1.3 + i * .25) }));
  return { b, cur, links, on: smooth(span(t, b.on + .6, b.on + 1.8)) * (1 - clipHide) * (1 - pointHide), name: cur };
}
// THE CHAIN HUD: four links in a short row top right (+ three small edge links between them), the current one lit, its name under the
// row ("LINK 2 · CONTRACT", 22 px). o: { a (multiply: hide where a link is big on screen), x, y, L, links (override the state) }
export const HUD = { x: W - 330, y: 100, L: 68 };
export function chainHud(ctx, t, T, o = {}) {
  const s = chainState(T, t), a = s.on * (o.a ?? 1); if (a <= 0) return s;
  const x0 = o.x ?? HUD.x, y0 = o.y ?? HUD.y, L = o.L ?? HUD.L, gap = L * 1.02, links = o.links ?? s.links;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  const sw = Math.sin(t * .9) * .03;
  for (let i = 0; i < 3; i++) chainLink(ctx, t, x0 + (i + .5) * gap, y0, L * .62, sw, { edge: true });
  links.forEach((l, i) => chainLink(ctx, t, x0 + i * gap, y0, L, sw + (i % 2 ? .04 : -.04), { lit: l.lit * (.75 + .25 * Math.sin(t * 3)), crack: l.crack, mend: l.mend }));
  const cur = s.cur; if (cur >= 0) {
    const nu = span(t, s.b.at[cur] - .2, s.b.at[cur] + .5) * (1 - span(t, s.b.at[cur] + 4.5, s.b.at[cur] + 5.1));
    if (nu > 0) maskLine(ctx, [[`LINK ${cur + 1} · ${CHAIN.names[cur]}`, 0]], x0 - L / 2, y0 + L * .95, 22, rise(nu), { serif: false, weight: 600, col: GOLD.text, glow: false });
  }
  ctx.restore();
  return s;
}

// ======================================================================================================================== OBJECTS
// your payment card: centre (x, y), width w; o.rot, o.a, o.morph 0..1 (0 = still the gold ring it came from: an oval ring that flattens
// into the card; 1 = the card). A chip, a contactless mark, four groups of dots. No logo, no bank name.
export function payCard(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const m = sineIO(clamp(o.morph ?? 1)), h = w * .63;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  if (m < 1) {   // the ring flattening: an oval ring whose hole closes as it becomes a card
    const L = lerp(w * .9, w, m), wd = lerp(w * .52, h, m), th = lerp(w * .13, wd / 2, m), r = lerp(wd / 2, w * .06, m);
    ctx.fillStyle = lin(ctx, -L / 2, -wd / 2, L / 2, wd / 2, [[0, GOLD.hot], [.5, GOLD.body], [1, GOLD.shade]]);
    ctx.beginPath(); ctx.roundRect(-L / 2, -wd / 2, L, wd, r);
    if (th < wd / 2 - .5) ctx.roundRect(-L / 2 + th, -wd / 2 + th, L - 2 * th, wd - 2 * th, Math.max(0, r - th));
    ctx.fill('evenodd');
    halo(ctx, 0, 0, w * .9, .25 * (1 - m), GOLD.halo, GOLD.core);
    ctx.restore(); return;
  }
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-w / 2 + w * .02, -h / 2 + w * .03, w, h, w * .06); ctx.fill();
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, GOLD.hot], [.45, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .06); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.core, .7); ctx.lineWidth = Math.max(1, w * .008); ctx.stroke();
  ctx.fillStyle = mixHex(GOLD.core, GOLD.body, .3); ctx.strokeStyle = GOLD.shade; ctx.lineWidth = Math.max(1, w * .006);
  ctx.beginPath(); ctx.roundRect(-w * .36, -h * .14, w * .15, h * .2, w * .02); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-w * .36, -h * .04); ctx.lineTo(-w * .21, -h * .04); ctx.moveTo(-w * .285, -h * .14); ctx.lineTo(-w * .285, h * .06); ctx.stroke();
  ctx.strokeStyle = rgba(GOLD.deep, .7); ctx.lineWidth = Math.max(1, w * .012); ctx.lineCap = 'round';
  for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(w * .3, -h * .05, w * (.03 + k * .035), -.7, .7); ctx.stroke(); }
  ctx.fillStyle = rgba(GOLD.deep, .55);
  for (let g = 0; g < 4; g++) for (let d = 0; d < 4; d++) { ctx.beginPath(); ctx.arc(-w * .36 + g * w * .19 + d * w * .036, h * .26, w * .011, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// the card reader on the counter: x = centre, y = the counter top it stands on, w = width. o: { wake 0..1 (screen lights), ring 0..1
// (one gold light ring pulses out of the screen: the beep), check 0..1 (a gold check draws on the screen), a, cable (true: a cable runs
// down out of its back; returns its end) }. Returns { screen: [cx, cy, w, h], cable: [x, y] }.
export function terminal(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1, h = w * 1.45, wake = clamp(o.wake ?? 1);
  const sx = x - w * .36, sy = y - h + w * .14, sw = w * .72, sh = w * .5;
  if (a > 0) {
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.beginPath(); ctx.moveTo(x - w * .3, y); ctx.lineTo(x - w * .18, y - h * .12); ctx.lineTo(x + w * .18, y - h * .12); ctx.lineTo(x + w * .3, y); ctx.fill();
    ctx.fillStyle = lin(ctx, x - w / 2, y - h, x + w / 2, y, [[0, mixHex(P.ind2, P.blue1, .5)], [1, mixHex(P.night1, P.ind1, .4)]]);
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - h, w, h * .9, w * .12); ctx.fill();
    ctx.strokeStyle = rgba(mixHex(GOLD.line, P.blue1, .5), .5); ctx.lineWidth = Math.max(1, w * .015); ctx.stroke();
    ctx.fillStyle = mixHex(P.night0, COOL.deep, .35 + .65 * wake); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, w * .05); ctx.fill();
    if (wake > 0) { ctx.fillStyle = rgba(COOL.body, .35 * wake); ctx.fillRect(sx + sw * .12, sy + sh * .2, sw * .5, Math.max(1, sh * .07)); ctx.fillRect(sx + sw * .12, sy + sh * .36, sw * .32, Math.max(1, sh * .07)); halo(ctx, x, sy + sh / 2, w * .9, .22 * wake, COOL.halo, COOL.core); }
    ctx.fillStyle = rgba(CREAM, .28);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { ctx.beginPath(); ctx.roundRect(x - w * .27 + c * w * .2, y - h * .42 + r * h * .075, w * .14, h * .05, w * .02); ctx.fill(); }
    const ck = clamp(o.check ?? 0);
    if (ck > 0) {
      const p0 = [sx + sw * .34, sy + sh * .55], p1 = [sx + sw * .47, sy + sh * .72], p2 = [sx + sw * .72, sy + sh * .3];
      ctx.fillStyle = rgba(GOLD.deep, .55 * ck); ctx.fillRect(sx, sy, sw, sh);
      goldSpan(ctx, [p0, p1, p2], 0, expoOut(ck), { w: Math.max(2, w * .035), spark: ck < 1 });
    }
    ctx.restore();
  }
  const rg = clamp(o.ring ?? 0);
  if (rg > 0 && rg < 1) {   // the beep: one ring of light, out and gone
    const r = lerp(w * .25, w * 1.6, expoOut(rg));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(GOLD.hot, (1 - rg) * .9); ctx.lineWidth = Math.max(1.5, w * .03 * (1 - rg * .6));
    ctx.beginPath(); ctx.arc(x, sy + sh / 2, r, 0, TAU); ctx.stroke(); ctx.restore();
  }
  return { screen: [sx + sw / 2, sy + sh / 2, sw, sh], cable: [x + w * .2, y - h * .1] };
}
// a loaf of bread (side view): centre-bottom (x, y), length w. Warm crust (LAMP family, not gold), three scores.
export function bread(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const h = w * .42;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(0, 0, w * .5, h * .08, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, '#e2a865'], [.55, '#b8763c'], [1, '#6e3f1e']]);
  ctx.beginPath(); ctx.moveTo(-w * .5, -h * .08); ctx.bezierCurveTo(-w * .52, -h * .9, w * .52, -h * .9, w * .5, -h * .08); ctx.quadraticCurveTo(0, h * .04, -w * .5, -h * .08); ctx.fill();
  ctx.strokeStyle = rgba('#f3d29a', .75); ctx.lineWidth = Math.max(1, w * .02); ctx.lineCap = 'round';
  for (const k of [-.24, 0, .24]) { ctx.beginPath(); ctx.moveTo(w * (k - .07), -h * .5); ctx.quadraticCurveTo(w * k, -h * .78, w * (k + .08), -h * .62); ctx.stroke(); }
  ctx.restore();
}
// a gold coin, (x, y) centre, r; o.flip 0..1 turns it edge-on and back (scale x = |cos|)
export function coin(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const k = Math.max(.08, Math.abs(Math.cos(Math.PI * (o.flip ?? 0))));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(k, 1);
  ctx.fillStyle = GOLD.shade; ctx.beginPath(); ctx.arc(0, r * .08, r, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, -r, -r, r, r, [[0, GOLD.hot], [1, GOLD.body]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.deep, .6); ctx.lineWidth = Math.max(.8, r * .1); ctx.beginPath(); ctx.arc(0, 0, r * .7, 0, TAU); ctx.stroke();
  ctx.restore();
}
// your sleeve (the yellow coat) + hand reaching in from the left edge: the hand at (x, y); o.ang (arm direction, 0 = pointing right),
// o.len (sleeve length), o.open 0..1 (palm up, to receive). Returns the palm point.
export function sleeve(ctx, t, x, y, o = {}) {
  const ang = o.ang ?? -.05, len = o.len ?? 700, s = o.s ?? 1, c = Math.cos(ang), sn = Math.sin(ang);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const C = E.COAT;
  ctx.fillStyle = lin(ctx, 0, -50, 0, 50, [[0, C.lit], [.5, C.base], [1, C.shade]]);
  ctx.beginPath(); ctx.moveTo(-len, -60); ctx.quadraticCurveTo(-len * .5, -58, -78, -44); ctx.quadraticCurveTo(-58, 0, -78, 44); ctx.quadraticCurveTo(-len * .5, 62, -len, 70); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(C.deep, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-len * .55, -48); ctx.quadraticCurveTo(-len * .35, -10, -len * .5, 40); ctx.stroke();
  ctx.fillStyle = C.deep; ctx.beginPath(); ctx.moveTo(-104, -48); ctx.quadraticCurveTo(-80, 0, -104, 50); ctx.lineTo(-78, 44); ctx.quadraticCurveTo(-58, 0, -78, -44); ctx.closePath(); ctx.fill();
  const SK = mixHex(P.shade0, P.night1, .35), op = clamp(o.open ?? 0);
  ctx.fillStyle = SK; ctx.beginPath(); ctx.ellipse(-30, 0, 44, 28 + 6 * op, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-46, -22, 16, 10, -.6, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(SK, P.cream, .12); ctx.beginPath(); ctx.ellipse(8, -6 + 12 * op, 30, 10, -.15 + .3 * op, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(4, 10 + 6 * op, 26, 9, .1, 0, TAU); ctx.fill();   // fingers
  ctx.restore();
  return [x + c * 10 * s, y + sn * 10 * s];
}
// THE COW (side view, flat editorial): (x, y) = the ground between her legs, h = height at the withers (back). o: { dir (1 = head right),
// graze 0..1 (head down to the grass), chew, look 0..1 (head up, looking along), tag 0..1 (the cream ear tag glows), a }.
// Cream body with night patches, a warm rim on top. Returns { tag: [x, y] (the ear tag, screen), head: [x, y] }.
export function cow(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1, dir = o.dir ?? 1, g = sineIO(clamp(o.graze ?? 0)), look = clamp(o.look ?? 0);
  const body = mixHex(PAPER.body, CREAM2, .18), shade = mixHex(PAPER.shade, P.ind1, .35), patch = mixHex(P.night1, P.ind1, .4);
  const breathe = 1 + .012 * Math.sin(t * 1.7), tail = Math.sin(t * 1.3) * .08 + Math.sin(t * 2.9) * .03;
  const hx = lerp(.86, .98, g), hy = lerp(-1.02 - .06 * look, -.2, g) + .012 * Math.sin(t * 3.1) * g, hang = lerp(-.15 - .2 * look, .95, g);
  const loc = (u, v) => [x + dir * u * h, y + v * h];
  if (a > 0) {
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(dir * h, h);
    ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.ellipse(0, 0, .95, .05, 0, 0, TAU); ctx.fill();
    const leg = (lx, ph, col) => { const sw = .015 * Math.sin(t * .8 + ph); ctx.fillStyle = lin(ctx, 0, -.55, 0, 0, [[0, col], [.55, col], [1, mixHex(col, P.night1, .55)]]); ctx.beginPath(); ctx.moveTo(lx - .075, -.6); ctx.lineTo(lx + .07, -.6); ctx.quadraticCurveTo(lx + .045, -.3, lx + .042 + sw, -.05); ctx.lineTo(lx - .045 + sw, -.05); ctx.quadraticCurveTo(lx - .06, -.3, lx - .075, -.6); ctx.fill(); ctx.fillStyle = P.night0; ctx.fillRect(lx - .05 + sw, -.065, .095, .065); };
    leg(-.5, 0, shade); leg(.42, 1, shade);
    // tail
    ctx.strokeStyle = shade; ctx.lineWidth = .028; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-.74, -.92); ctx.quadraticCurveTo(-.86, -.7 + tail * .2, -.8 + tail, -.36); ctx.stroke();
    ctx.fillStyle = patch; ctx.beginPath(); ctx.ellipse(-.8 + tail, -.33, .035, .07, tail, 0, TAU); ctx.fill();
    // body
    const bp = new Path2D(); bp.moveTo(-.76, -.96 * breathe); bp.bezierCurveTo(-.4, -1.04 * breathe, .3, -1.02 * breathe, .58, -.98 * breathe);
    bp.bezierCurveTo(.72, -.9, .72, -.62, .6, -.5); bp.bezierCurveTo(.3, -.42, -.3, -.42, -.62, -.48); bp.bezierCurveTo(-.84, -.56, -.86, -.86, -.76, -.96 * breathe); bp.closePath();
    ctx.fillStyle = lin(ctx, 0, -1.05, 0, -.42, [[0, mixHex(body, P.cream, .4)], [.6, body], [1, shade]]); ctx.fill(bp);
    ctx.save(); ctx.clip(bp); ctx.fillStyle = patch;
    for (const [px, py, rx, ry, rr] of [[-.48, -.82, .17, .12, .3], [.12, -.66, .2, .13, -.2], [.4, -.95, .12, .08, .1], [-.2, -1.0, .1, .06, 0]]) { ctx.beginPath(); ctx.ellipse(px, py, rx, ry, rr, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = rgba(LAMP.body, .55); ctx.lineWidth = .014; ctx.beginPath(); ctx.moveTo(-.7, -.975 * breathe); ctx.bezierCurveTo(-.4, -1.04 * breathe, .3, -1.02 * breathe, .56, -.985 * breathe); ctx.stroke();
    leg(-.36, 2, body); leg(.3, 3, body);
    ctx.fillStyle = mixHex(PAPER.lit, '#e8b8a0', .35); ctx.beginPath(); ctx.ellipse(-.1, -.46, .08, .04, 0, 0, TAU); ctx.fill();
    // neck + head
    ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(.5, -.98); ctx.quadraticCurveTo(hx - .05, (hy - .98) / 2 - .08, hx - .02, hy - .06); ctx.lineTo(hx + .08, hy + .1); ctx.quadraticCurveTo(.74 + .1 * g, (hy - .6) / 2 + .05, .62, -.52); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(hang);
    ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(-.08, -.1); ctx.quadraticCurveTo(.08, -.13, .26, -.05); ctx.quadraticCurveTo(.31, .02, .27, .08); ctx.quadraticCurveTo(.1, .12, -.07, .09); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(PAPER.lit, '#e8b8a0', .45); ctx.beginPath(); ctx.ellipse(.25, .03, .06, .055, .3, 0, TAU); ctx.fill();
    ctx.fillStyle = patch; ctx.beginPath(); ctx.ellipse(.0, -.02, .07, .08, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(.09, -.04, .014, 0, TAU); ctx.fill();
    ctx.fillStyle = shade; ctx.beginPath(); ctx.ellipse(-.07, -.1, .07, .028, -.5, 0, TAU); ctx.fill();   // ear
    ctx.restore();
    ctx.restore();
  }
  // the ear tag (cream, a warm light when o.tag): world position from the head pose
  const ea = hang, ex = hx + (-.1 * Math.cos(ea) - (-.075) * Math.sin(ea)), ey = hy + (-.1 * Math.sin(ea) + (-.075) * Math.cos(ea));
  const tg = loc(ex, ey), tu = clamp(o.tag ?? 0);
  if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = mixHex(PAPER.lit, GOLD.hot, .3 * tu); ctx.beginPath(); ctx.roundRect(tg[0] - h * .022, tg[1] - h * .005, h * .044, h * .05, h * .008); ctx.fill(); if (tu > 0) halo(ctx, tg[0], tg[1] + h * .02, h * .25, .4 * tu, LAMP.body, LAMP.core); ctx.restore(); }
  return { tag: [tg[0], tg[1] + h * .02], head: loc(hx, hy) };
}
// a number that rolls to its value on the word: txt 'ROLLS 1.1 BILLION' style → numberRoll(ctx, 1.1, u, { fmt: (v) => v.toFixed(1) + ' BILLION' })
export function numberRoll(ctx, value, x, y, size, u, o = {}) {
  const v = lerp(o.from ?? 0, value, expoOut(clamp(u))), s = o.fmt ? o.fmt(v) : Math.round(v).toLocaleString('en-US');
  goldText(ctx, [[s, o.gold ?? 1]], x, y, size, rise(clamp(u * 3)), { serif: true, align: o.align ?? 'center', glow: true });
}

// ======================================================================================================================== STRINGS
// text-v2.md EINBLENDUNG lines with <ROOT>faktencheck.md §5 (25.11.) applied. Builders use the keys, never retype a figure.
// Statement ≤ 6 words + one number on screen; the long rest is the source line (F.source, 22 px at y 880).
export const ASOF = '25 NOV 2026';
export const SOURCES = {
  title: ['WORSE THAN', 'KILLER ROBOTS'], titleSub: "YUVAL NOAH HARARI'S BIGGEST FEAR",
  today: 'TODAY', understood: 'SOMEBODY UNDERSTOOD IT', whoTrust: 'WHO DO YOU TRUST?',
  q2: { text: 'We are the cows of the future.', credit: 'Yuval Noah Harari · ČT / Věda 24 · 17 Oct 2026', spoken: ['we are the cows', 'of the future'] },
  q1: { text: 'The basis for civilization is not intelligence. The basis for civilization is trust.', credit: 'Yuval Noah Harari · ČT / Věda 24 · 17 Oct 2026', spoken: ['The basis for civilization is not', 'civilization is trust'] },
  q3: { text: 'Slow down and give politics time.', credit: 'Yuval Noah Harari · ČT / Věda 24 · 17 Oct 2026 (paraphrase of his advice)', spoken: ['slow down, and give', 'politics time'] },
  dementia: 'COLLECTIVE DEMENTIA', dementiaSrc: 'HARARI, ČT / VĚDA 24, 17 OCT 2026 · “SOMETHING LIKE COLLECTIVE DEMENTIA”',
  harari: 'YUVAL NOAH HARARI', harariRole: 'HISTORIAN, HEBREW UNIVERSITY OF JERUSALEM', copies: '50M+ COPIES', copiesSrc: 'PUBLISHER FIGURE',
  boe: 'BANK OF ENGLAND & FCA · AI IN UK FINANCIAL SERVICES · 26 OCT 2026', boe24: '24% DEEP TECHNICAL UNDERSTANDING', boe81: '81% RELY ON VENDOR ASSURANCES',
  boe81Src: 'THIRD-PARTY AI · HIGH-MATERIALITY SYSTEMS · BANK OF ENGLAND & FCA, 26 OCT 2026',
  agents: '80% USE AI AGENTS', agentsSub: '“AGENTS RECOMMEND, HUMANS DECIDE”', agentsSrc: 'BANK OF ENGLAND & FCA 2026 · 105 FIRMS ANSWERED · 2% BROAD AUTONOMY',
  esma: 'EXPLAINABILITY AMONG KEY RISKS', esmaSrc: 'ESMA (EU MARKETS WATCHDOG), FEB 2026',
  workday: 'MOBLEY v. WORKDAY · COURT ORDER, MAY 2025 · COMPANY’S OWN FIGURE', billion: '1.1 BILLION', billionWord: 'APPLICATIONS REJECTED',
  over40: 'CLASS OF APPLICANTS OVER 40', noRuling: 'NO RULING ON LIABILITY', workdaySays: 'WORKDAY: CLAIMS ARE FALSE',
  eightfold: 'KISTLER v. EIGHTFOLD AI · FILED 20 JAN 2026 · PENDING', score: 'MATCH SCORE 0–5',
  natives: 'BUREAUCRATIC NATIVES', nativesSrc: 'HARARI, ČT / VĚDA 24, 17 OCT 2026',
  dot: 'U.S. DEPARTMENT OF TRANSPORTATION · REPORTED BY PROPUBLICA, JAN 2026', twenty: '20 MINUTES',
  southAfrica: 'SOUTH AFRICA · DRAFT AI POLICY WITHDRAWN, 26 APR 2026', minister: 'THE MINISTER: LIKELY AI, NEVER PROPERLY CHECKED',
  ipsos: 'IPSOS / NPR · U.S. AI USERS · AUG 2026', trust75: '75% TRUST PEOPLE THEY KNOW MORE',
  anthropic: 'ANTHROPIC RESEARCH, 27 OCT 2026 · 50 PROFESSIONAL ANALYSTS', limits: 'LIMITS · COMPANY STUDY · AGENT’S LEAN DELIBERATELY AMPLIFIED',
  cip: 'COLLECTIVE INTELLIGENCE PROJECT · GLOBAL DIALOGUES INDEX 2025', cip58: '58%',
  musk: 'ELON MUSK · THE ECONOMIST, JULY 2026', muskQuote: '“LET’S ENJOY THE RIDE, IS I THINK MY PHILOSOPHY AT THIS POINT.”',
  estonia: 'ESTONIA · ERR NEWS, JAN 2026', estoniaPeople: 'ERROR FIRST SPOTTED BY PEOPLE · CHATBOTS FLAGGED IT AT ONCE',
  lawFixed: 'LAW CORRECTED, FEB 2026', lawFixedSrc: 'PM MICHAL: CHECK BILLS WITH AI (14 JAN 2026)',
  speaker: ['HISTORIAN', 'AUTHOR', 'PAID SPEAKER'], seznam: 'SEZNAM ZPRÁVY, 2026 (TRANSLATED, PARAPHRASED)',
  cjeu: 'EU COURT OF JUSTICE · C-203/22 · 27 FEB 2025', aiAct: 'EU AI ACT · REG. (EU) 2026/1744 · HIGH-RISK DUTIES FROM 2 DEC 2027',
  art50: 'EU AI ACT, ARTICLE 50 · IN FORCE SINCE 2 AUG 2026', aisi: 'UK AI SECURITY INSTITUTE', aisiRuns: 'ONE MODEL: 9 OF 43 RUNS',
  aisiSrc: 'AISI REPORT, 4 AUG 2026 · NO ATTEMPT SUCCEEDED', mitTR: 'MIT TECHNOLOGY REVIEW · BREAKTHROUGH TECHNOLOGIES 2026 · MECHANISTIC INTERPRETABILITY',
  answer: 'EU: RIGHT TO AN EXPLANATION (CJEU 2025) · AI MUST IDENTIFY ITSELF (SINCE AUG 2026)',
};
