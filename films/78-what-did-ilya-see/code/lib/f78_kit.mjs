// Film 78 · "What Did Ilya See?" (thumbnail C: a man walking away from a tower of light) · shared kit (owned by the lead; builders
// import, never edit: wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, finish)
// + lib/f16_kit.mjs (rise, maskLine, measure). Stage, 2D camera, Leitbild scene, seam plates, end screen: lib/f78_world.mjs.
// Plan: docs/MOTION.md · shots (binding): docs/shots.md · contact sheet of every piece: <ROOT>bild/kit78_kontakt.jpg (tools/kit_sheet78.mjs).
//
// Every piece takes u-style parameters 0..1 so the voice drives it (phrase anchors in the scene code), returns its geometry (carriers
// start from it), draws in the caller's space (put it under S.view for the camera) and never creates canvases or patterns per frame.
//
//   THE TOWER (Leitbild, 4 anchors only) tower() · ILYA (plain silhouette, gold rim, long coat) ilya() · THE CALL GRID callGrid() ·
//   post cards postCard() · THE MACHINE RING ring() · the cinema screen + marquee marquee() · the court transcript transcript() ·
//   THE 52 PAGES pages() · THE LINE (BEFORE | AFTER) divider() · the jobs grid jobsGrid() · the lectern + spotlight lectern() ·
//   HIS LIFE LINE with the 4 markers lifeLine() · THE RECIPE CARD recipeCard() · the chat window chatWin() · cards (paperCard,
//   dataCard, quoteCard), verdict(), dateTag(), source(), title(), goldText/goldSpan/goldLabel · clips: clipPlate() + CLIPS.
//
// Colour code: GOLD = what holds / the hero light · CREAM = open, questions, text · PAPER = documents · COOL = machines, screens, the
// internet's guess · the yellow raincoat (E.du) = only you · never red.
import { Path2D, loadImage, GlobalFonts, createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, maskLine, measure } = K16;
export const { du, person, glowText } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
const TAU = Math.PI * 2;
try { GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'Inter Black'); } catch { /* falls back to Inter 600 */ }

export const PRINT78 = { grain: 14, floor: 4, vig: .5 };
export const CREAM = '#f3efe2', CREAM2 = '#a49fc4';
export const GOLD = { core: '#fff8dc', hot: '#ffe9a6', body: '#f6c95c', mid: '#e3a63f', shade: '#b8792a', deep: '#6e4416', halo: '#f2b632', line: '#ffd982', text: '#ffe7a8' };
export const PAPER = { body: '#ece4c8', lit: '#f7f0d8', shade: '#cfc4a2', edge: '#a99d7c', ink: '#141a3c', faint: '#8a8166' };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
export const INK = { far: mixHex(P.ind0, P.blue0, .3), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, panel: mixHex(P.night1, P.ind2, .55) };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
// a value that goes 0 → 1 over [a, a + d] with sineIO (the film's move curve) / expoOut (the film's landing curve)
export const mv = (t, a, d = 1.8) => sineIO(span(t, a, a + d));
export const land = (t, a, d = .6) => expoOut(span(t, a, a + d));

// ======================================================================================================================== TEXT
export function goldText(ctx, segs, x, y, size, u, o = {}) {
  const serif = o.serif ?? true, k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15;
  const mw = (txt) => measure(txt, size, serif, o.weight) + (o.spacing ? txt.length * size * o.spacing : 0);
  const total = segs.reduce((s, [txt]) => s + mw(txt), 0);
  let xx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x; const xs = [];
  if (u <= 0) return { w: total, xs, x0: xx };
  ctx.save(); ctx.beginPath(); ctx.rect(xx - size, y - size * 1.25, total + size * 2, size * 1.25 + size * .32); ctx.clip();
  for (const [txt, m] of segs) {
    xs.push(xx);
    E.glowText(ctx, txt, xx, y + dy, { size, serif, col: mixHex(o.col ?? P.cream, GOLD.body, clamp(m)), weight: o.weight, glow: o.glow ?? false, spacing: o.spacing });
    xx += mw(txt);
  }
  ctx.restore();
  return { w: total, xs, x0: xs[0] };
}
// a gold light line along pts, from fraction u0 to u1 of its length (a spark at the running tip)
export function goldSpan(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(u0 * L), [ex, ey, i1] = at(u1 * L), sub = [[sx, sy]];
  for (let i = i0; i < i1; i++) sub.push([pts[i][0], pts[i][1]]);
  sub.push([ex, ey]);
  const w = o.w ?? 3, a = o.a ?? 1, cc = o.col ?? GOLD;
  for (const [k, al, c, op] of [[4.5, .2, cc.halo, 'lighter'], [2.1, .8, cc.body, 'source-over'], [.9, 1, cc.core, 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = c; ctx.globalAlpha *= al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  }
  if (o.spark !== false && u1 < 1) halo(ctx, ex, ey, w * 10, .6 * a, cc.halo, cc.core);
  return [ex, ey];
}
// a label pinned to a point: a thin gold line out of (x, y), then NAME (≥ 26 px) and a smaller second line
export function goldLabel(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 50, dy = o.dy ?? -50, x1 = x + dx, y1 = y + dy, sz = o.size ?? 28;
  goldSpan(ctx, [[x, y], [x1, y1]], 0, smooth(clamp(u * 1.6)), { w: 1.4, spark: false });
  const left = dx < 0;
  maskLine(ctx, [[l1, 0]], x1 + (left ? -measure(l1, sz, false) - 10 : 10), y1 - 10, sz, u, { serif: false, weight: 600, col: P.cream, glow: false });
  if (l2) { const s2 = Math.max(22, sz * .8); maskLine(ctx, [[l2, 0]], x1 + (left ? -measure(l2, s2, false) - 10 : 10), y1 + sz * 1.05, s2, rise(span(u, .2, 1)), { serif: false, weight: 600, col: GOLD.text, glow: false }); }
}
// the title (thumbnail C): heavy condensed caps (Inter Black), cream with a warm glow; u rises line by line, o.out sinks them again
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return null;
  const x = o.x ?? 110, y = o.y ?? 330, lines = o.lines ?? ['WHAT DID', 'ILYA SEE?'], cond = o.cond ?? .78;
  ctx.save();
  ctx.font = `100px "Inter Black"`; const wide = Math.max(...lines.map((l) => ctx.measureText(l).width)) * cond / 100;
  const size = Math.min(o.size ?? 230, (o.maxW ?? 820) / wide);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .16, .74 + i * .16)), ex = o.out != null ? sineIO(clamp(o.out * 1.15 - i * .12)) : 0; if (ui <= 0 || ex >= 1) return;
    const k = expoOut(ui), yy = y + i * size * .88 + (1 - k) * size * .5 + ex * size * .95;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 40, y + i * size * .88 - size * .84, W, size * .92); ctx.clip();
    ctx.translate(x, yy); ctx.scale(cond, 1);
    ctx.font = `${size}px "Inter Black"`; ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = rgba(GOLD.halo, .7); ctx.shadowBlur = size * .16; ctx.fillStyle = '#fff6d8'; ctx.fillText(ln, 0, 0);
    ctx.shadowBlur = 0; ctx.fillStyle = '#fffbea'; ctx.fillText(ln, 0, 0);
    ctx.restore();
  });
  ctx.restore();
  return { x, y, size, h: size * .88 * lines.length };
}
// a small date / source tag: a gold tick, then caps (≥ 22 px). Used for every date the VO leaves out (F.SOURCES).
export function dateTag(ctx, x, y, txt, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const sz = o.size ?? 24, al = o.align ?? 'left', tw = measure(txt, sz, false, 700) + txt.length * sz * .1;
  const x0 = al === 'center' ? x - tw / 2 : al === 'right' ? x - tw : x;
  goldSpan(ctx, [[x0, y + sz * .5], [x0 + tw, y + sz * .5]], 0, smooth(span(u, .2, 1)), { w: 1.2, spark: false, a: .8 });
  goldText(ctx, [[txt, o.gold ?? .55]], x0, y, sz, rise(u), { serif: false, weight: 700, spacing: .1 });
  return { x: x0, y, w: tw };
}
// the source line at the bottom of the safe area (y 880, 22 px), screen space; t0 → t1 its life
export function source(ctx, t, t0, t1, s, o = {}) {
  const u = rise(span(t, t0, t0 + .7)) * (1 - expoIn(span(t, t1 - .5, t1))); if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [[s.toUpperCase(), 0]], o.x ?? 110, o.y ?? 880, o.size ?? 22, u, { serif: false, weight: 600, col: P.halo2, glow: false }); ctx.restore();
}
// a verdict under a thing: gold caps rise behind a mask, then a gold underline draws (NOT a rubber stamp: #59)
export function verdict(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 30, tw = measure(text, size, false, 700) + size * text.length * .08, x0 = o.align === 'left' ? x : o.align === 'right' ? x - tw : x - tw / 2;
  goldText(ctx, [[text, o.gold ?? 1]], x0, y, size, rise(u), { serif: false, weight: 700, spacing: .08, col: o.col });
  goldSpan(ctx, [[x0, y + size * .32], [x0 + tw, y + size * .32]], 0, smooth(span(u, .35, 1)), { w: 1.4, spark: false, col: o.lineCol });
  return { x: x0, y, w: tw };
}
export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(0, 0, W, H); ctx.restore(); }
// a floating card space: tiny breathing zoom + drift (screen centre); call inside save/restore
export const float = (ctx, t, k = 1) => { const z = 1 + .012 * k * Math.sin(t * .6 + 1), dx = E.drift(t * 2, 10 * k, 11), dy = E.drift(t * 2, 6 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };

// ======================================================================================================================== CARDS
// a card: 'paper' (cream, dark ink: documents, quotes) or 'night' (dark indigo, gold edge: data). lines [[text, size, gold, serif]]
export function paperCard(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const night = o.style === 'night', k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3);
  ctx.translate(x + w / 2, y + h / 2 + (1 - k) * 40); ctx.rotate((o.rot ?? 0) + (1 - k) * .04); ctx.translate(-w / 2, -h / 2);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(6, 10, w, h, 10); ctx.fill();
  ctx.fillStyle = night ? INK.panel : lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, night ? 12 : 6); ctx.fill();
  ctx.strokeStyle = night ? rgba(GOLD.line, .55) : rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  let yy;
  if (o.head) { const hs = o.headSize ?? 22; maskLine(ctx, [[o.head, 0]], 34, 54, hs, rise(span(u, .2, .8)), { serif: false, weight: 700, col: night ? GOLD.text : PAPER.faint, glow: false }); yy = 54 + hs * .6; }
  else yy = 20;
  for (const [i, ln] of (o.lines ?? []).entries()) {
    const [txt, size, g = 0, serif = true] = ln; yy += size * 1.2;
    const col = night ? mixHex(P.cream, GOLD.body, g) : mixHex(PAPER.ink, GOLD.deep, g);
    maskLine(ctx, [[txt, 0]], 34, yy, size, rise(span(u, .3 + i * .08, .9 + i * .08)), { serif, weight: 600, col, glow: false });
  }
  if (o.src) maskLine(ctx, [[o.src.toUpperCase(), 0]], 34, h - 26, 22, rise(span(u, .5, 1)), { serif: false, weight: 600, col: night ? P.halo2 : PAPER.faint, glow: false });
  ctx.restore();
  return { x, y, w, h };
}
// a data card (night style): a kind tag (KNOWN / FORECAST / ESTIMATE / HELD / OPEN), a big gold number and one small line
export function dataCard(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const h = o.h ?? 280;
  const box = paperCard(ctx, t, x, y, w, h, { u, style: 'night', a: o.a, rot: o.rot });
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  if (o.kind) {
    const kc = o.kind === 'KNOWN' || o.kind === 'HELD' ? GOLD.body : o.kind === 'FORECAST' ? COOL.body : CREAM, tw = measure(o.kind, 22, false, 600) + 22 * o.kind.length * .14 + 34;
    ctx.fillStyle = rgba(kc, .16); ctx.strokeStyle = rgba(kc, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(30, 24, tw, 40, 20); ctx.fill(); ctx.stroke();
    E.glowText(ctx, o.kind, 30 + 17, 52, { size: 22, weight: 600, spacing: .14, col: kc, glow: false });
  }
  if (o.title) maskLine(ctx, [[o.title, 0]], 34, 108, 24, rise(span(u, .25, .8)), { serif: false, weight: 600, col: P.halo2, glow: false });
  if (o.big) goldText(ctx, [[o.big, 1]], 32, o.title ? 196 : 170, o.bigSize ?? 80, rise(span(u, .35, 1)), { serif: true });
  if (o.small) maskLine(ctx, [[o.small, 0]], 34, o.title ? 246 : 220, 22, rise(span(u, .5, 1)), { serif: false, weight: 600, col: P.cream, glow: false });
  ctx.restore();
  return box;
}
// a quote card (paper): head, the quote in serif (wrapped to w); words turn gold-ink as they are spoken (o.spoken = [fromPhrase,
// toPhrase] in the VO, o.after = a fence time), else they stand dark ink; credit line at the bottom (≥ 22 px). Returns the box.
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export function quoteCard(ctx, t, T, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const size = o.size ?? 54, w = o.w ?? 1100, pad = 54, words = o.text.split(/\s+/), lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.join(' '), size, true) > w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const head = o.head ? 70 : 24, h = head + lines.length * size * 1.22 + (o.credit ? 100 : 40);
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
  if (o.credit) maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 38, 22, rise(span(u, .55, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  ctx.restore();
  return { ...box, h };
}

// ======================================================================================================================== THE TOWER (Leitbild)
// A slender tower of gold light (thumbnail C): x = centre, base = ground y, w = width, h = height. Body: a dark-gold slab with a grid of lit
// window cells (COLS × rows); a crown of light at the top with a soft beam into the sky. o: { glow 0..1, cells 0..1 (lit share, bottom →
// top), dim 0..1, name 0..1 (OPENAI label on a gold line, left), tag 0..1 (THE COMPANY BEHIND CHATGPT rises under it), block: [c0, r0, c1, r1] cells to
// brighten (the call grid hides there), cols, rows }. Returns { x, base, w, h, top, cell(c, r) → {x, y, w, h}, block → rect }.
export function tower(ctx, t, x, base, w, h, o = {}) {
  const g = clamp(o.glow ?? 1), dim = clamp(o.dim ?? 0), cols = o.cols ?? 5, rows = o.rows ?? Math.max(6, Math.round(h / (w / cols) / 1.25)), top = base - h;
  const taper = w * .06, x0 = x - w / 2, gw = (w - taper * 2) / cols, gh = (h * .9) / rows;
  const cell = (c, r) => ({ x: x0 + taper + c * gw + gw * .14, y: top + h * .07 + r * gh + gh * .14, w: gw * .72, h: gh * .7 });
  const k = g * (1 - dim * .7);
  ctx.save();
  // the light around it (big, soft) and the beam
  halo(ctx, x, top + h * .25, w * 4.2, .32 * k, GOLD.halo, GOLD.hot);
  const bh = top + 40;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, top, 0, top - bh, [[0, rgba(GOLD.hot, .42 * k)], [.5, rgba(GOLD.halo, .12 * k)], [1, rgba(GOLD.halo, 0)]]);
  ctx.beginPath(); ctx.moveTo(x - w * .16, top); ctx.lineTo(x - w * .5, top - bh); ctx.lineTo(x + w * .5, top - bh); ctx.lineTo(x + w * .16, top); ctx.closePath(); ctx.fill();
  ctx.restore();
  // body
  const body = new Path2D(); body.moveTo(x0, base); body.lineTo(x0 + taper, top + w * .1); body.lineTo(x, top); body.lineTo(x0 + w - taper, top + w * .1); body.lineTo(x0 + w, base); body.closePath();
  ctx.fillStyle = lin(ctx, x0, 0, x0 + w, 0, [[0, mixHex(GOLD.deep, P.night1, .35 + .4 * dim)], [.45, mixHex(GOLD.shade, P.night1, .2 + .5 * dim)], [1, mixHex(GOLD.deep, P.night0, .5 + .3 * dim)]]);
  ctx.fill(body);
  ctx.strokeStyle = rgba(GOLD.line, .55 * k); ctx.lineWidth = Math.max(1, w * .012); ctx.stroke(body);
  // windows: lit bottom → top by o.cells, each breathing a little
  const lit = clamp(o.cells ?? 1), r0 = prng(o.seed ?? 78), B = o.block;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const q = r0(), f = clamp((lit * (rows + 2) - (rows - 1 - r)) - q * .8); if (f <= 0) continue;
    const inB = B && c >= B[0] && c <= B[2] && r >= B[1] && r <= B[3], cl = cell(c, r);
    const br = (.55 + .45 * Math.sin(t * (.4 + q * .5) + q * 20)) * f * k;
    ctx.fillStyle = mixHex(GOLD.mid, inB ? GOLD.core : GOLD.hot, .3 + .7 * br * (inB ? 1 : .8));
    ctx.globalAlpha = .35 + .65 * f; ctx.fillRect(cl.x, cl.y, cl.w, cl.h); ctx.globalAlpha = 1;
  }
  // the crown
  halo(ctx, x, top + w * .06, w * 1.1, .8 * k, GOLD.halo, GOLD.core);
  ctx.fillStyle = mixHex(GOLD.hot, GOLD.core, .5 * k); ctx.beginPath(); ctx.moveTo(x, top - w * .04); ctx.lineTo(x + w * .1, top + w * .1); ctx.lineTo(x - w * .1, top + w * .1); ctx.closePath(); ctx.fill();
  ctx.restore();
  const nu = clamp(o.name ?? 0);
  if (nu > 0) {   // OPENAI on a gold line to the left of the tower; the tag line under it rises on its own (o.tag 0..1)
    goldLabel(ctx, x - w * .5, top + h * .3, 'OPENAI', null, nu, { dx: -70, dy: -40, size: 30 });
    const tg = clamp(o.tag ?? 0); if (tg > 0) goldText(ctx, [['THE COMPANY BEHIND CHATGPT', .3]], x - w * .5 - 80, top + h * .3 - 40 + 34, 22, rise(tg), { serif: false, weight: 600, spacing: .06, align: 'right' });
  }
  const bl = B ? (() => { const a = cell(B[0], B[1]), b = cell(B[2], B[3]); return { x: a.x, y: a.y, w: b.x + b.w - a.x, h: b.y + b.h - a.y }; })() : null;
  return { x, base, w, h, top, cell, block: bl, rows, cols };
}

// ======================================================================================================================== ILYA
// Ilya as a plain silhouette (never a face, never a likeness): E.person in a long coat with a gold rim from the tower side.
// x, y = feet; h = height. o: everything E.person takes (dir, look, armR, armL, walk (phase), view) + shadow: length (px) of a long
// shadow away from the light (lightX = the light's x), glow (rim strength). Returns the hands.
export function ilya(ctx, t, x, y, h, o = {}) {
  const sh = o.shadow ?? 0;
  if (sh > 0) {   // the long shadow on the ground, away from the light
    const dir = Math.sign(x - (o.lightX ?? x + 1)) || -1;
    ctx.save(); ctx.fillStyle = rgba(P.night0, .55 * (o.a ?? 1));
    ctx.beginPath(); ctx.moveTo(x - h * .08, y); ctx.lineTo(x + dir * sh, y + h * .05); ctx.lineTo(x + dir * sh, y + h * .09); ctx.lineTo(x + h * .08, y + h * .02); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const hands = E.person(ctx, x, y, h, { long: true, light: o.light ?? .9, rim: GOLD.line, look: .2, breath: true, ...o, shadow: undefined, a: undefined });
  ctx.restore();
  return hands;
}

// ======================================================================================================================== THE CALL GRID
// The video call of FRI · NOV 17, 2023: a window with 3 × 2 tiles. R = { x, y, w, h } (the whole grid, caller space). o: { a, chrome 0..1
// (the window bar with the date), date, tiles: [6 × { kind 'ilya'|'boss'|'person'|'off', label, sub, speak 0..1, dark 0..1, drop 0..1
// (falls out of the grid and away), back 0..1 (slides back in from the right), fired 0..1 (FIRED in its slot) }] }. Tiles fill row-major.
// Returns { tiles: [rects], slot(i) }.
export const CALL_TILES = () => [
  { kind: 'person' }, { kind: 'ilya', label: 'ILYA SUTSKEVER', sub: 'CHIEF SCIENTIST' }, { kind: 'person' },
  { kind: 'boss', label: 'THE BOSS', sub: 'HEAD OF OPENAI' }, { kind: 'person' }, { kind: 'off' },
];
export function callGrid(ctx, t, R, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0) return null;
  const gap = R.w * .014, ch = R.h * .085 * clamp(o.chrome ?? 1), tw = (R.w - gap * 4) / 3, th = (R.h - ch - gap * 3) / 2, tiles = [];
  ctx.save(); ctx.globalAlpha *= a;
  // the window
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(R.x + 10, R.y + 14, R.w, R.h, R.w * .012); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, R.w * .012); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .55); ctx.lineWidth = Math.max(1, R.w * .0016); ctx.stroke();
  if (ch > 2) {
    for (let i = 0; i < 3; i++) { ctx.fillStyle = rgba(CREAM2, .55); ctx.beginPath(); ctx.arc(R.x + ch * .55 + i * ch * .45, R.y + ch * .5, ch * .12, 0, TAU); ctx.fill(); }
    if (o.date && R.w > 400) { ctx.save(); ctx.globalAlpha *= clamp((R.w - 400) / 300); goldText(ctx, [[o.date, .6]], R.x + R.w / 2, R.y + ch * .68, ch * .42, rise(clamp(o.dateU ?? 1)), { serif: false, weight: 700, spacing: .1, align: 'center' }); ctx.restore(); }
  }
  const list = o.tiles ?? CALL_TILES();
  for (let i = 0; i < 6; i++) {
    const c = i % 3, r = Math.floor(i / 3), bx = R.x + gap + c * (tw + gap), by = R.y + ch + gap + r * (th + gap), T0 = list[i] || { kind: 'off' };
    tiles.push({ x: bx, y: by, w: tw, h: th });
    const drop = clamp(T0.drop ?? 0), back = clamp(T0.back ?? 1), dark = clamp(T0.dark ?? 0);
    // the empty slot (visible when the tile has dropped out)
    ctx.strokeStyle = rgba(CREAM2, .35); ctx.lineWidth = Math.max(1, tw * .004); ctx.setLineDash([tw * .02, tw * .02]); ctx.strokeRect(bx, by, tw, th); ctx.setLineDash([]);
    if ((T0.fired ?? 0) > 0) verdict(ctx, t, bx + tw / 2, by + th * .58, 'FIRED', T0.fired, { size: th * .2, gold: 0, col: CREAM, lineCol: { halo: CREAM2, body: CREAM, core: CREAM } });
    if (drop >= 1 || back <= 0) continue;
    const dy = expoIn(drop) * R.h * 1.1, rot = expoIn(drop) * .18, dx = (1 - sineIO(back)) * R.w * .9;
    ctx.save(); ctx.translate(bx + tw / 2 + dx, by + th / 2 + dy); ctx.rotate(rot); ctx.translate(-tw / 2, -th / 2);
    ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, tw, th, tw * .02); ctx.clip();
    const off = T0.kind === 'off';
    ctx.fillStyle = off ? mixHex(P.night0, P.ind0, .3) : lin(ctx, 0, 0, 0, th, [[0, mixHex(P.ind1, P.blue1, .35)], [1, mixHex(P.night1, P.ind1, .4)]]); ctx.fillRect(0, 0, tw, th);
    if (!off) {   // a bust silhouette (no face)
      const s = th / 300, cx = tw / 2, hy = th * .42;
      const body = T0.kind === 'ilya' ? mixHex(P.night1, GOLD.deep, .55) : mixHex(P.night1, P.blue1, .35), rim = T0.kind === 'ilya' ? GOLD.line : mixHex(P.blue0, P.cream, .35);
      ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(cx, hy, 46 * s, 56 * s, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - 130 * s, th); ctx.bezierCurveTo(cx - 126 * s, th * .68, cx - 60 * s, hy + 62 * s, cx, hy + 62 * s); ctx.bezierCurveTo(cx + 60 * s, hy + 62 * s, cx + 126 * s, th * .68, cx + 130 * s, th); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(rim, .75); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.ellipse(cx, hy, 46 * s, 56 * s, 0, -1.2, .6); ctx.stroke();
      halo(ctx, cx + 40 * s, hy - 30 * s, 160 * s, T0.kind === 'ilya' ? .18 : .08, T0.kind === 'ilya' ? GOLD.halo : COOL.halo, T0.kind === 'ilya' ? GOLD.hot : COOL.core);
    } else { E.glowText(ctx, 'CAMERA OFF', tw / 2, th / 2 + 8, { size: Math.max(10, th * .07), weight: 600, align: 'center', col: rgba(CREAM2, .6), glow: false, spacing: .1 }); }
    if (dark > 0) { ctx.fillStyle = rgba(P.night0, .92 * dark); ctx.fillRect(0, 0, tw, th); }
    ctx.restore();
    const sp = clamp(T0.speak ?? 0) * (1 - dark);   // the speaking ring
    ctx.strokeStyle = sp > 0 ? rgba(GOLD.line, (.6 + .4 * Math.sin(t * 7)) * sp) : rgba(CREAM2, .3); ctx.lineWidth = sp > 0 ? Math.max(2, tw * .008) : Math.max(1, tw * .003);
    ctx.beginPath(); ctx.roundRect(0, 0, tw, th, tw * .02); ctx.stroke();
    if (T0.label && tw > 120) {   // name plate in the tile (≥ 22 px when the grid fills the frame; scales with the tile)
      const ls = th * .075; ctx.globalAlpha *= clamp((tw - 120) / 120);
      ctx.fillStyle = rgba(P.night0, .55 * (1 - dark)); ctx.fillRect(tw * .04, th - ls * 2.9, measure(T0.label, ls, false, 700) + ls * T0.label.length * .08 + ls * 1.2, ls * 2.5);
      E.glowText(ctx, T0.label, tw * .04 + ls * .5, th - ls * 1.75, { size: ls, weight: 700, spacing: .08, col: T0.kind === 'ilya' ? GOLD.text : CREAM, glow: false, a: 1 - dark });
      if (T0.sub) E.glowText(ctx, T0.sub, tw * .04 + ls * .5, th - ls * .72, { size: ls * .82, weight: 600, spacing: .08, col: CREAM2, glow: false, a: 1 - dark });
    }
    ctx.restore();
  }
  ctx.restore();
  return { tiles, R };
}

// ======================================================================================================================== POST CARDS
// a small social post (no logo, no real account): avatar circle, a name bar, the line in serif. x, y = centre, w = width, o: { a, rot, text, cool }
export function postCard(ctx, x, y, w, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0 || w < 4) return;
  const h = w * .42;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .55); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .04); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .7); ctx.lineWidth = Math.max(.8, w * .006); ctx.stroke();
  ctx.fillStyle = rgba(COOL.body, .8); ctx.beginPath(); ctx.arc(-w * .38, -h * .22, h * .13, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(CREAM2, .55); ctx.fillRect(-w * .3, -h * .28, w * .3, h * .07); ctx.fillRect(-w * .3, -h * .14, w * .18, h * .05);
  if (w > 60) E.glowText(ctx, o.text ?? 'what did Ilya see?', -w * .44, h * .24, { size: w * .1, serif: true, col: CREAM, glow: false });
  else { ctx.fillStyle = rgba(CREAM, .7); ctx.fillRect(-w * .44, h * .12, w * .8, h * .1); }
  ctx.restore();
}

// ======================================================================================================================== THE MACHINE RING
// The machine as a ring of cool light (never a robot or a brain): an outer ring, iris rings turning, a core; o: { a, think 0..1 (rings
// pulse inward), gap 0..1 (one segment missing: what it can't do), gapAt (angle), crumble 0..1 (it falls to dust, blown to +x), flat 0..1
// (squashes to a lens: a screen grows out of it), lit }. Returns { x, y, r }.
export function ring(ctx, t, x, y, r, o = {}) {
  const a = clamp(o.a ?? 1), cr = clamp(o.crumble ?? 0); if (a <= 0 || r <= 1) return null;
  const sq = 1 - .92 * sineIO(clamp(o.flat ?? 0)), gapU = clamp(o.gap ?? 0), gAt = o.gapAt ?? -.6, gW = .55 * gapU;
  ctx.save(); ctx.globalAlpha *= a * (1 - cr * .9); ctx.translate(x, y); ctx.scale(1, sq);
  halo(ctx, 0, 0, r * 1.9, .26 * (o.lit ?? 1), COOL.halo, COOL.core);
  const arc = (rr, w, col, a0 = 0, a1 = TAU) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(0, 0, rr, a0, a1); ctx.stroke(); };
  const think = clamp(o.think ?? .5);
  // outer ring (with the gap)
  if (gapU > 0) arc(r, r * .07, rgba(COOL.body, .9), gAt + gW, gAt - gW + TAU); else arc(r, r * .07, rgba(COOL.body, .9));
  arc(r * 1.04, r * .012, rgba(COOL.core, .7));
  // iris rings: dashed, turning both ways; a pulse travels inward
  for (let i = 0; i < 4; i++) {
    const rr = r * (.82 - i * .15), ph = ((t * .45 * think + i * .25) % 1), pulse = Math.exp(-((ph - .5) ** 2) * 30);
    ctx.save(); ctx.rotate(t * (i % 2 ? -.22 : .16) * (1 + i * .3) + i);
    ctx.setLineDash([r * (.18 - i * .02), r * (.06 + i * .02)]);
    arc(rr, r * (.035 - i * .005), rgba(mixHex(COOL.deep, COOL.core, .45 + .4 * pulse), .85));
    ctx.restore();
  }
  ctx.setLineDash([]);
  ctx.fillStyle = rad(ctx, 0, 0, r * .3, [[0, COOL.core], [.5, rgba(COOL.body, .9)], [1, rgba(COOL.deep, 0)]]); ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, TAU); ctx.fill();
  ctx.restore();
  if (cr > 0) {   // dust: the ring's points blow away to the right and down
    const rnd = prng(311); ctx.save();
    for (let i = 0; i < 160; i++) {
      const an = rnd() * TAU, rr = r * (.3 + .75 * rnd()), d = clamp(cr * 1.5 - rnd() * .5), px = x + Math.cos(an) * rr + d * d * r * (1.4 + rnd()), py = y + Math.sin(an) * rr * sq + d * d * r * (.5 + .6 * rnd()) - Math.sin(d * 3) * r * .2;
      ctx.fillStyle = rgba(COOL.body, a * .8 * (1 - d)); ctx.fillRect(px, py, Math.max(1.5, r * .02), Math.max(1.5, r * .02));
    }
    ctx.restore();
  }
  return { x, y, r, sq };
}

// ======================================================================================================================== THE CINEMA SCREEN
// The Hollywood movie as a screen + a marquee of bulbs: R = the screen rect; the marquee board hangs under it (text only: no stills, no
// trailer). o: { screen 0..1 (cool light on the screen), board 0..1 (the marquee unfolds), off 0..1 (bulbs go out left → right), title,
// sub }. Returns { screen: R, board: {x, y, w, h} }.
export function marquee(ctx, t, R, o = {}) {
  const sc = clamp(o.screen ?? 1), bu = clamp(o.board ?? 1), off = clamp(o.off ?? 0);
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(R.x + 10, R.y + 14, R.w, R.h);
  ctx.fillStyle = lin(ctx, R.x, R.y, R.x, R.y + R.h, [[0, mixHex(P.ind0, COOL.body, .55 * sc)], [1, mixHex(P.night1, COOL.deep, .6 * sc)]]); ctx.fillRect(R.x, R.y, R.w, R.h);
  if (sc > 0) halo(ctx, R.x + R.w / 2, R.y + R.h / 2, R.w * .6, .16 * sc * (1 - off * .8), COOL.halo, COOL.core);
  ctx.strokeStyle = rgba(CREAM2, .5); ctx.lineWidth = 2; ctx.strokeRect(R.x, R.y, R.w, R.h);
  const bw = R.w * .62, bh = R.w * .17, bx = R.x + (R.w - bw) / 2, by = R.y + R.h + R.w * .03;
  if (bu > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(bx - 20, by - 10, bw + 40, (bh + 30) * sineIO(bu)); ctx.clip();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = rgba(GOLD.line, .5); ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    const n = 22, per = 2 * (bw + bh) / n;   // the bulbs around the board, going out left → right
    for (let i = 0; i < n * 1.0; i++) {
      const d = i * per; let px, py;
      if (d < bw) { px = bx + d; py = by; } else if (d < bw + bh) { px = bx + bw; py = by + d - bw; } else if (d < 2 * bw + bh) { px = bx + bw - (d - bw - bh); py = by + bh; } else { px = bx; py = by + bh - (d - 2 * bw - bh); }
      const on = clamp((px - bx) / bw - off * 1.2 + .1 > 0 ? 1 : 0) * (.75 + .25 * Math.sin(t * 6 + i * 1.7));
      ctx.fillStyle = on > 0 ? GOLD.hot : mixHex(P.night1, GOLD.deep, .4); ctx.beginPath(); ctx.arc(px, py, bh * .045, 0, TAU); ctx.fill();
      if (on > 0) halo(ctx, px, py, bh * .16, .35 * on, GOLD.halo, GOLD.core);
    }
    const lit = 1 - off * .7;
    E.glowText(ctx, o.title ?? 'ARTIFICIAL', bx + bw / 2, by + bh * .52, { size: bh * .34, weight: 700, spacing: .18, align: 'center', col: mixHex(P.halo2, GOLD.hot, lit), glow: false });
    E.glowText(ctx, o.sub ?? 'US RELEASE DEC 25, 2026', bx + bw / 2, by + bh * .82, { size: Math.max(22, bh * .15), weight: 600, spacing: .12, align: 'center', col: rgba(CREAM, .6 + .4 * lit), glow: false });
    ctx.restore();
  }
  ctx.restore();
  return { screen: R, board: { x: bx, y: by, w: bw, h: bh } };
}

// ======================================================================================================================== THE TRANSCRIPT
// a court transcript page (paper): head SWORN TESTIMONY · OCT 2025, numbered lines, Q. / A. prefixes, grey text bars writing in (o.write
// 0..1), a raised right hand in the margin (o.hand 0..1). R = { x, y, w, h }. o: { a, paper 0..1 (0 = a blank cool screen, 1 = paper),
// head 0..1 }. Returns R.
export function transcript(ctx, t, R, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0) return null;
  const pp = clamp(o.paper ?? 1), wr = clamp(o.write ?? 0), s = R.w / 900;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(R.x + 10, R.y + 14, R.w, R.h);
  ctx.fillStyle = lin(ctx, R.x, R.y, R.x, R.y + R.h, [[0, mixHex(P.ind0, PAPER.lit, pp)], [1, mixHex(P.night1, PAPER.body, pp)]]); ctx.fillRect(R.x, R.y, R.w, R.h);
  if (pp < 1) { ctx.strokeStyle = rgba(CREAM2, .5 * (1 - pp)); ctx.lineWidth = 2; ctx.strokeRect(R.x, R.y, R.w, R.h); }
  if (pp > .5) {
    const hu = clamp(o.head ?? 1), ink = (c) => rgba(c, (pp - .5) * 2);
    ctx.save(); ctx.globalAlpha *= (pp - .5) * 2;
    if (hu > 0) maskLine(ctx, [['SWORN TESTIMONY · OCT 2025', 0]], R.x + 70 * s, R.y + 80 * s, Math.max(22, 30 * s), rise(hu), { serif: false, weight: 700, col: PAPER.ink, glow: false });
    ctx.fillStyle = ink(PAPER.edge); ctx.fillRect(R.x + 60 * s, R.y + 108 * s, R.w - 120 * s, 2 * s);
    ctx.fillRect(R.x + 110 * s, R.y + 120 * s, 1.5 * s, R.h - 160 * s);   // the margin rule
    const N = Math.floor((R.h - 170 * s) / (44 * s)), rnd = prng(23);
    for (let i = 0; i < N; i++) {
      const yy = R.y + 160 * s + i * 44 * s, f = clamp(wr * N - i); if (f <= 0) break;
      E.glowText(ctx, String(i + 1), R.x + 96 * s, yy, { size: 16 * s, weight: 600, align: 'right', col: PAPER.faint, glow: false });
      if (i % 3 !== 2) E.glowText(ctx, i % 3 === 0 ? 'Q.' : 'A.', R.x + 130 * s, yy, { size: 22 * s, weight: 700, col: PAPER.ink, glow: false });
      const L = (R.w - 260 * s) * (.55 + .45 * rnd()); ctx.fillStyle = rgba(PAPER.ink, .32); ctx.fillRect(R.x + 180 * s, yy - 12 * s, L * f, 10 * s);
    }
    const hd = clamp(o.hand ?? 0);
    if (hd > 0) {   // the raised right hand (an oath), drawn as a simple flat palm in the margin, rising
      const hx = R.x + R.w - 120 * s, hy = R.y + 220 * s + (1 - expoOut(hd)) * 40 * s, k = 70 * s;
      ctx.fillStyle = rgba(GOLD.deep, .85 * hd);
      ctx.beginPath(); ctx.roundRect(hx - k * .32, hy - k * .2, k * .64, k * .62, k * .14); ctx.fill();
      for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.roundRect(hx - k * .3 + f * k * .155, hy - k * (.62 - Math.abs(f - 1.5) * .05), k * .13, k * .5, k * .06); ctx.fill(); }
      ctx.beginPath(); ctx.roundRect(hx - k * .5, hy - k * .02, k * .26, k * .14, k * .06); ctx.fill();
      ctx.fillRect(hx - k * .14, hy + k * .4, k * .28, k * .5);
      E.glowText(ctx, 'UNDER OATH', hx, hy + k * 1.2, { size: Math.max(22, 18 * s), weight: 700, spacing: .1, align: 'center', col: PAPER.ink, glow: false, a: hd });
    }
    ctx.restore();
  }
  ctx.restore();
  return R;
}

// ======================================================================================================================== THE 52 PAGES
// A pile of pages seen from the front-top: the top page faces you upright (rect R = { x, y, w, h }), the pile's edges under it.
// o: { n 0..52 (how many sheets are on the pile; the pile grows down from the top page), by 0..1 (BY ILYA SUTSKEVER written by a gold pen
// line), profile 0..1 (a man's profile prints itself on the page, ink, no face), count 0..1 (the 52 PAGES label), dark 0..1, tilt,
// open 0..1 (the top page lifts and turns over to the left: B1 c02), lines 0..1 (grey text lines on the top page) }.
// Returns { R, pile: { x, y, w, h }, pen: [x, y] (the pen tip while writing) }.
export function pages(ctx, t, R, o = {}) {
  const n = clamp(o.n ?? 52, 0, 52), dark = clamp(o.dark ?? 0), sheet = R.h * .004, ph = n * sheet;
  ctx.save(); ctx.translate(R.x + R.w / 2, R.y + R.h / 2); ctx.rotate(o.tilt ?? -.015); ctx.translate(-R.w / 2, -R.h / 2);
  // the pile under the top page (each sheet a sliver, seeded offsets)
  const rnd = prng(52);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(10, 16, R.w, R.h + ph);
  for (let i = Math.ceil(n) - 1; i >= 0; i--) {
    const off = (rnd() - .5) * R.w * .02, y = R.h + i * sheet;
    ctx.fillStyle = mixHex(mixHex(PAPER.shade, PAPER.body, .3 + .5 * (i % 3) / 2), P.night1, .2 + .6 * dark); ctx.fillRect(off, y - 1, R.w, sheet + .5);
    ctx.fillStyle = rgba(PAPER.edge, .5); ctx.fillRect(off, y + sheet - .6, R.w, .6);
  }
  // the top page
  ctx.fillStyle = mixHex(mixHex(PAPER.lit, PAPER.body, .3), P.night1, .6 * dark); ctx.fillRect(0, 0, R.w, R.h);
  ctx.strokeStyle = rgba(PAPER.edge, .8); ctx.lineWidth = 1.5; ctx.strokeRect(0, 0, R.w, R.h);
  const s = R.w / 600, ln = o.face ? 0 : clamp(o.lines ?? 1);
  if (o.face) o.face(ctx, { x: 0, y: 0, w: R.w, h: R.h });   // a custom top page (e.g. the transcript that just landed)
  if (ln > 0) { const r2 = prng(7); for (let i = 0; i < 14; i++) { const y = R.h * .42 + i * R.h * .038; if (y > R.h * .93) break; ctx.fillStyle = rgba(PAPER.ink, .14 * (1 - dark)); ctx.fillRect(R.w * .1, y, R.w * (.5 + .3 * r2()) * clamp(ln * 14 - i), R.h * .011); } }
  let pen = null;
  const by = clamp(o.by ?? 0);
  if (by > 0) {   // BY ILYA SUTSKEVER: the letters appear behind a gold pen tip moving left → right
    const txt = 'BY ILYA SUTSKEVER', sz = Math.max(22, 34 * s), tw = measure(txt, sz, false, 700) + txt.length * sz * .08, x0 = (R.w - tw) / 2, y0 = R.h * .16;
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 4, y0 - sz, tw * sineIO(by) + 4, sz * 1.4); ctx.clip();
    E.glowText(ctx, txt, x0, y0, { size: sz, weight: 700, spacing: .08, col: GOLD.deep, glow: false });
    ctx.restore();
    goldSpan(ctx, [[x0, y0 + sz * .3], [x0 + tw, y0 + sz * .3]], 0, sineIO(span(by, .1, 1)), { w: 1.3, spark: by < 1 });
    pen = [x0 + tw * sineIO(by), y0];
  }
  const pr = clamp(o.profile ?? 0);
  if (pr > 0) {   // a man's head-and-shoulders profile printing itself (ink, bottom → top), ABOUT ONE MAN under it
    const cx = R.w * .5, cy = R.h * .5, k = R.w * .2;
    ctx.save(); ctx.beginPath(); ctx.rect(0, cy + k * 1.1 - k * 2.4 * sineIO(pr), R.w, k * 2.4); ctx.clip();
    ctx.fillStyle = rgba(PAPER.ink, .82 * (1 - dark * .6));
    ctx.beginPath(); ctx.moveTo(cx - k * .2, cy - k * .9); ctx.bezierCurveTo(cx + k * .35, cy - k * 1.0, cx + k * .52, cy - k * .55, cx + k * .48, cy - k * .25);
    ctx.lineTo(cx + k * .6, cy - k * .05); ctx.lineTo(cx + k * .46, cy + .02 * k); ctx.bezierCurveTo(cx + k * .46, cy + k * .2, cx + k * .3, cy + k * .3, cx + k * .14, cy + k * .3);
    ctx.lineTo(cx + k * .12, cy + k * .5); ctx.bezierCurveTo(cx + k * .7, cy + k * .6, cx + k * .9, cy + k * .9, cx + k * .95, cy + k * 1.1); ctx.lineTo(cx - k * .95, cy + k * 1.1);
    ctx.bezierCurveTo(cx - k * .9, cy + k * .75, cx - k * .6, cy + k * .55, cx - k * .3, cy + k * .5); ctx.bezierCurveTo(cx - k * .55, cy + k * .1, cx - k * .62, cy - k * .7, cx - k * .2, cy - k * .9); ctx.closePath(); ctx.fill();
    ctx.restore();
    const lu = clamp(o.about ?? span(pr, .5, 1));
    if (lu > 0) { const sz = Math.max(22, 30 * s); goldText(ctx, [['ABOUT ONE MAN', .0]], R.w / 2, cy + k * 1.45, sz, rise(lu), { serif: false, weight: 700, spacing: .1, align: 'center', col: PAPER.ink }); }
  }
  ctx.restore();
  const cu = clamp(o.count ?? 0);
  if (cu > 0) goldText(ctx, [[o.countText ?? '52 PAGES', 1]], R.x + R.w / 2, R.y + R.h + ph + 64, Math.max(30, R.w * .09), rise(cu), { serif: false, weight: 700, spacing: .08, align: 'center' });
  return { R, pile: { x: R.x, y: R.y, w: R.w, h: R.h + ph }, pen: pen ? [R.x + pen[0], R.y + pen[1]] : null };
}

// ======================================================================================================================== THE LINE (BEFORE | AFTER)
// a gold vertical line drawn top → bottom by u; o: { left, right (labels at the top, e.g. BEFORE / AFTER), lab 0..1, glow } · returns { x }
export function divider(ctx, t, x, y0, y1, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  goldSpan(ctx, [[x, y0], [x, y1]], 0, sineIO(u), { w: o.w ?? 2.4, spark: u < 1 });
  halo(ctx, x, lerp(y0, y1, .5), (y1 - y0) * .35, .1 * (o.glow ?? 1), GOLD.halo, GOLD.core);
  const lb = clamp(o.lab ?? 0);
  if (lb > 0 && o.left) goldText(ctx, [[o.left, .3]], x - 36, y0 + 44, o.size ?? 30, rise(lb), { serif: false, weight: 700, spacing: .12, align: 'right' });
  if (lb > 0 && o.right) goldText(ctx, [[o.right, .3]], x + 36, y0 + 44, o.size ?? 30, rise(span(lb, .15, 1)), { serif: false, weight: 700, spacing: .12, col: o.rightCol ?? CREAM });
  return { x };
}

// ======================================================================================================================== THE JOBS GRID
// small working figures in a grid (cols × rows inside R); each holds a simple prop (laptop, bag, wheel, pan, board, crate, brush, phone).
// o: { lit 0..1 (rows light up top → bottom), dim 0..1, you: index (that figure is you, in yellow), youStep 0..1 (you step forward and
// light up), only: [indices] (the lit subset, e.g. SOME), cols, rows }. Returns [{ x, y, h }] feet positions.
const PROPS = ['laptop', 'bag', 'wheel', 'pan', 'board', 'crate', 'brush', 'phone', 'laptop', 'board', 'bag', 'wheel'];
function prop(ctx, kind, x, y, s, col) {
  ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, s * .05);
  if (kind === 'laptop') { ctx.fillRect(x - s * .45, y - s * .05, s * .9, s * .08); ctx.fillRect(x - s * .38, y - s * .55, s * .76, s * .46); }
  else if (kind === 'bag') { ctx.fillRect(x - s * .4, y - s * .5, s * .8, s * .5); ctx.fillStyle = rgba(P.night0, .6); ctx.fillRect(x - s * .05, y - s * .42, s * .1, s * .34); ctx.fillRect(x - s * .17, y - s * .3, s * .34, s * .1); }
  else if (kind === 'wheel') { ctx.beginPath(); ctx.arc(x, y - s * .35, s * .34, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - s * .34, y - s * .35); ctx.lineTo(x + s * .34, y - s * .35); ctx.moveTo(x, y - s * .35); ctx.lineTo(x, y - s * .02); ctx.stroke(); }
  else if (kind === 'pan') { ctx.beginPath(); ctx.ellipse(x, y - s * .2, s * .3, s * .1, 0, 0, TAU); ctx.fill(); ctx.fillRect(x + s * .25, y - s * .24, s * .4, s * .06); }
  else if (kind === 'board') { ctx.fillRect(x - s * .5, y - s * .8, s * 1, s * .62); ctx.fillStyle = rgba(CREAM, .7); ctx.fillRect(x - s * .38, y - s * .64, s * .5, s * .05); ctx.fillRect(x - s * .38, y - s * .5, s * .7, s * .05); }
  else if (kind === 'crate') { ctx.fillRect(x - s * .4, y - s * .6, s * .8, s * .6); ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - s * .4, y - s * .32, s * .8, s * .05); }
  else if (kind === 'brush') { ctx.fillRect(x - s * .03, y - s * .9, s * .06, s * .7); ctx.fillRect(x - s * .12, y - s * .3, s * .24, s * .22); }
  else { ctx.fillRect(x - s * .16, y - s * .6, s * .32, s * .56); }
}
export function jobsGrid(ctx, t, R, o = {}) {
  const cols = o.cols ?? 4, rows = o.rows ?? 3, cw = R.w / cols, rh = R.h / rows, h = Math.min(rh * .78, cw * 1.25), out = [];
  const lit = clamp(o.lit ?? 1), dim = clamp(o.dim ?? 0), yi = o.you ?? -1, ys = clamp(o.youStep ?? 0);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c, x = R.x + cw * (c + .5), y = R.y + rh * (r + .9), on = clamp(lit * (rows + 1) - r - (c / cols) * .6) * (o.only ? (o.only.includes(i) ? 1 : .25) : 1);
    out.push({ x, y, h });
    if (on <= 0) continue;
    const isYou = i === yi && ys > 0, k = on * (1 - dim * (isYou ? 0 : .75)), sk = expoIn(clamp((o.sink ?? 0) * 1.5 - c * .08 - r * .1));
    if (sk >= 1) continue;
    halo(ctx, x, y - h * .5, h * .9, .22 * k * (1 - sk), isYou ? P.coat : GOLD.halo, isYou ? P.core1 : GOLD.core);
    ctx.save(); ctx.globalAlpha *= clamp(on * 2) * (1 - dim * (isYou ? 0 : .6));
    ctx.fillStyle = rgba(GOLD.line, .18 * k); ctx.fillRect(x - cw * .36, y + 2, cw * .72, 3);   // the floor line of the cell
    if (sk > 0) { ctx.beginPath(); ctx.rect(x - cw / 2, y - rh * 2, cw, rh * 2); ctx.clip(); ctx.translate(0, h * 1.1 * sk); }   // o.sink: they sink behind their floor line
    const ph = t * 1.3 + i * 1.7, work = [lerp(.9, 1.3, .5 + .5 * Math.sin(ph)), lerp(1.6, 2.0, .5 + .5 * Math.sin(ph + 1))];
    if (isYou) E.du(ctx, x - h * .12 * expoOut(ys), y + h * .08 * expoOut(ys), h * (1 + .12 * expoOut(ys)), { light: 1, look: .4, armR: work });
    else E.person(ctx, x - h * .12, y, h, { light: .3 + .6 * k, look: .5, armR: work, rim: mixHex(P.blue0, GOLD.line, k) });
    if (!isYou) prop(ctx, PROPS[i % PROPS.length], x + h * .28, y, h * .4, mixHex(P.blue2, GOLD.body, .25 + .65 * k));
    ctx.restore();
  }
  return out;
}

// ======================================================================================================================== THE LECTERN
// he says it openly: a lectern on a low stage, Ilya behind it (silhouette, arm out), a spotlight cone from above, sound rings travelling
// out of the lectern (o.rings 0..1 = how strongly). x, y = the stage floor under the lectern, h = Ilya's height. o: { spot 0..1, a, rise
// 0..1 (it rises out of the floor line) }. Returns { mic: [x, y] }.
export function lectern(ctx, t, x, y, h, o = {}) {
  const a = clamp(o.a ?? 1), sp = clamp(o.spot ?? 1), ru = expoOut(clamp(o.rise ?? 1)); if (a <= 0 || ru <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a;
  if (sp > 0) {   // spotlight cone
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, y - h * 3, 0, y, [[0, rgba(GOLD.hot, 0)], [.6, rgba(GOLD.halo, .1 * sp)], [1, rgba(GOLD.hot, .22 * sp)]]);
    ctx.beginPath(); ctx.moveTo(x - h * .12, y - h * 3.2); ctx.lineTo(x + h * .12, y - h * 3.2); ctx.lineTo(x + h * .8, y); ctx.lineTo(x - h * .8, y); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = rgba(GOLD.hot, .18 * sp); ctx.beginPath(); ctx.ellipse(x, y, h * .8, h * .08, 0, 0, TAU); ctx.fill();
  }
  ctx.save(); ctx.beginPath(); ctx.rect(x - h * 2, y - h * 2, h * 4, h * 2); ctx.clip(); ctx.translate(0, (1 - ru) * h * 1.1);
  ilya(ctx, t, x + h * .06, y, h, { dir: -1, look: .1, armR: [1.1, 1.5], armL: [-.3, -.2] });
  ctx.fillStyle = mixHex(P.night1, GOLD.deep, .25);
  ctx.beginPath(); ctx.moveTo(x - h * .26, y); ctx.lineTo(x - h * .2, y - h * .5); ctx.lineTo(x + h * .2, y - h * .5); ctx.lineTo(x + h * .26, y); ctx.closePath(); ctx.fill();
  ctx.fillRect(x - h * .26, y - h * .56, h * .52, h * .08);
  ctx.strokeStyle = rgba(GOLD.line, .6); ctx.lineWidth = Math.max(1, h * .008); ctx.strokeRect(x - h * .26, y - h * .56, h * .52, h * .08);
  ctx.strokeStyle = mixHex(P.blue2, P.cream, .3); ctx.lineWidth = Math.max(1, h * .01); ctx.beginPath(); ctx.moveTo(x - h * .08, y - h * .56); ctx.quadraticCurveTo(x - h * .1, y - h * .7, x - h * .02, y - h * .74); ctx.stroke();
  ctx.restore();
  const rg = clamp(o.rings ?? 0), mx = x - h * .02, my = y - h * .74;
  if (rg > 0) for (let i = 0; i < 4; i++) {   // sound rings: arcs travelling outward both ways, fading
    const ph = ((t * .55 + i / 4) % 1), r = h * (.15 + ph * 1.6);
    ctx.strokeStyle = rgba(GOLD.line, rg * .6 * (1 - ph)); ctx.lineWidth = Math.max(1, h * .012);
    ctx.beginPath(); ctx.arc(mx, my, r, -.7, .7); ctx.stroke(); ctx.beginPath(); ctx.arc(mx, my, r, Math.PI - .7, Math.PI + .7); ctx.stroke();
  }
  ctx.restore();
  return { mic: [mx, my] };
}

// ======================================================================================================================== HIS LIFE LINE (the record)
// A gold horizontal line (his life, years under it) with 4 prediction MARKERS (not a ladder: #31). x0..x1 at y.
// o: { u 0..1 (draws left → right), years: [[f, '2012'], …] (ticks), markers: [{ f (0..1 along the line), n (1..4), state 'held'|'open',
//   drop 0..1 (lands on the line), fill 0..1 (held: fills gold; open: the cream ring pulses + OPEN), box: '5–20 YEARS' | '? YEARS',
//   boxU 0..1, label: 'CAN A COMPUTER LEARN?' (small, above) , labelU }], knot 0..1 (the one condition: a gold knot), knotF, you 0..1
//   (you stand at the right end), dawn 0..1 }. Returns { at(f) → [x, y], m: [[x, y] per marker] }.
export function lifeLine(ctx, t, x0, x1, y, o = {}) {
  const u = clamp(o.u ?? 1), at = (f) => [lerp(x0, x1, f), y], m = [];
  if (u <= 0) return { at, m };
  const dw = clamp(o.dawn ?? 0);
  if (dw > 0) { halo(ctx, x1 + 80, y + 40, 700 * dw, .28 * dw, GOLD.halo, GOLD.hot); }
  goldSpan(ctx, [[x0, y], [x1, y]], 0, sineIO(u), { w: o.w ?? 3, spark: u < 1 });
  for (const [f, lab] of o.years ?? []) {
    const k = clamp((sineIO(u) - f) * 8); if (k <= 0) continue;
    const [px] = at(f); ctx.fillStyle = rgba(GOLD.line, .8 * k); ctx.fillRect(px - 1, y + 78, 2, 12);
    goldText(ctx, [[lab, .2]], px, y + 112, 22, rise(k), { serif: false, weight: 600, spacing: .06, align: 'center', col: CREAM2 });
  }
  for (const M of o.markers ?? []) {
    const [px, py] = at(M.f), d = expoOut(clamp(M.drop ?? 1)); m.push([px, py]); if (d <= 0) continue;
    const yy = py - (1 - d) * 160, R = o.r ?? 26, fl = clamp(M.fill ?? 0), pulse = .5 + .5 * Math.sin(t * 2.2 + M.n);
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.arc(px, yy, R, 0, TAU); ctx.fill();
    if (M.state === 'held' && fl > 0) {
      ctx.save(); ctx.beginPath(); ctx.arc(px, yy, R - 3, 0, TAU); ctx.clip();
      ctx.fillStyle = lin(ctx, 0, yy + R - 2 * R * sineIO(fl), 0, yy + R, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.fillRect(px - R, yy + R - 2 * R * sineIO(fl), 2 * R, 2 * R * sineIO(fl)); ctx.restore();
      halo(ctx, px, yy, R * 2.6, .4 * fl, GOLD.halo, GOLD.core);
    }
    const open = M.state === 'open' && fl > 0;
    ctx.strokeStyle = open ? rgba(CREAM, .65 + .35 * pulse) : M.state === 'held' && fl > 0 ? rgba(GOLD.core, .95) : rgba(CREAM, .75); ctx.lineWidth = open ? 2.5 + 1.5 * pulse : 2.5;
    ctx.beginPath(); ctx.arc(px, yy, R, 0, TAU); ctx.stroke();
    E.glowText(ctx, String(M.n), px, yy + R * .36, { size: R * 1.0, weight: 700, align: 'center', col: M.state === 'held' && fl > .5 ? GOLD.deep : CREAM, glow: false });
    const tag = M.state === 'held' ? 'HELD' : 'OPEN';
    if (fl > 0) goldText(ctx, [[tag, M.state === 'held' ? 1 : 0]], px, yy + R + 34, 22, rise(span(fl, .3, 1)), { serif: false, weight: 700, spacing: .12, align: 'center', col: CREAM });
    if (M.label && (M.labelU ?? 1) > 0) goldText(ctx, [[M.label, 0]], px, yy - R - 22, 22, rise(M.labelU ?? 1), { serif: false, weight: 600, spacing: .06, align: 'center', col: CREAM });
    const bu = clamp(M.boxU ?? 0);
    if (M.box && bu > 0) {   // the number box above the marker
      const bw = measure(M.box, 34, true) + 40, bx = px - bw / 2, by = yy - R - 110 + (1 - expoOut(bu)) * 30;
      ctx.save(); ctx.globalAlpha *= clamp(bu * 3);
      ctx.fillStyle = INK.panel; ctx.strokeStyle = rgba(M.boxGold ? GOLD.line : CREAM, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(bx, by, bw, 60, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rgba(CREAM, .6); ctx.fillRect(px - 1, by + 60, 2, yy - R - by - 60);
      ctx.restore();
      goldText(ctx, [[M.box, M.boxGold ? 1 : 0]], px, by + 44, 34, rise(bu), { serif: true, align: 'center', col: CREAM });
    }
  }
  const kn = clamp(o.knot ?? 0);
  if (kn > 0) {   // ONE gold knot tied into the line (the one condition)
    const [kx] = at(o.knotF ?? .9), r = 16;
    ctx.save(); ctx.strokeStyle = GOLD.body; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.ellipse(kx - r * .5, y - r * .2, r * .8, r * 1.1 * sineIO(kn), -.6, 0, TAU * sineIO(kn)); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(kx + r * .5, y + r * .2, r * .8, r * 1.1 * sineIO(span(kn, .3, 1)), -.6, 0, TAU * sineIO(span(kn, .3, 1))); ctx.stroke();
    ctx.restore(); halo(ctx, kx, y, 60, .5 * kn, GOLD.halo, GOLD.core);
  }
  const yu = clamp(o.you ?? 0);
  if (yu > 0) E.du(ctx, x1 + 40, y + 4 - (1 - expoOut(yu)) * 0, 92 * expoOut(yu), { light: 1, look: .5, dir: -1 });
  return { at, m };
}

// ======================================================================================================================== THE RECIPE CARD
// BIG NETWORK + BIG DATA (night card, gold edge): left a small network (nodes + edges, growing), right a data gauge (stacked text lines)
// that drains when o.data falls. x, y = top left, w; h = w * .56. o: { u, net 0..1, data 0..1 (gauge level), head (THE RECIPE) }.
// Returns { x, y, w, h, top: [x, y] (where stems grow out) }.
export function recipeCard(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const h = w * .56, nu = clamp(o.net ?? 1), dl = clamp(o.data ?? 1);
  paperCard(ctx, t, x, y, w, h, { u, style: 'night', head: o.head ?? 'THE RECIPE', headSize: 24 });
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  const s = w / 800, cy = h * .56;
  // BIG NETWORK: nodes in 4 layers
  const L = [3, 5, 5, 3], nx = (i) => w * (.1 + i * .1), ny = (i, j) => cy + (j - (L[i] - 1) / 2) * 44 * s;
  for (let i = 0; i < 3; i++) for (let j = 0; j < L[i]; j++) for (let k = 0; k < L[i + 1]; k++) {
    const f = clamp(nu * 4 - i); if (f <= 0) continue; ctx.strokeStyle = rgba(GOLD.line, .25 * f); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(nx(i), ny(i, j)); ctx.lineTo(lerp(nx(i), nx(i + 1), f), lerp(ny(i, j), ny(i + 1, k), f)); ctx.stroke();
  }
  for (let i = 0; i < 4; i++) for (let j = 0; j < L[i]; j++) { const f = clamp(nu * 4 - i + .5); if (f <= 0) continue; ctx.fillStyle = mixHex(GOLD.mid, GOLD.hot, .5 + .5 * Math.sin(t * 2 + i + j)); ctx.beginPath(); ctx.arc(nx(i), ny(i, j), 9 * s * f, 0, TAU); ctx.fill(); }
  E.glowText(ctx, 'BIG NETWORK', w * .25, h - 34 * s, { size: Math.max(22, 26 * s), weight: 700, spacing: .08, align: 'center', col: CREAM, glow: false });
  E.glowText(ctx, '+', w * .5, cy + 18 * s, { size: 60 * s, weight: 700, align: 'center', col: GOLD.body, glow: false });
  // BIG DATA: a gauge of text lines
  const gx = w * .62, gw = w * .3, gy = h * .3, gh = h * .48;
  ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 2; ctx.strokeRect(gx, gy, gw, gh);
  const lv = gh * dl, rows = 9;
  ctx.save(); ctx.beginPath(); ctx.rect(gx, gy + gh - lv, gw, lv); ctx.clip();
  for (let r = 0; r < rows; r++) { const yy = gy + gh - (r + .7) * gh / rows; ctx.fillStyle = rgba(GOLD.body, .75); ctx.fillRect(gx + 10 * s, yy, gw * (.55 + .35 * ((r * 37) % 10) / 10) - 20 * s, gh / rows * .42); }
  ctx.restore();
  if (dl < .999) { ctx.fillStyle = rgba(GOLD.hot, .9); ctx.fillRect(gx, gy + gh - lv - 1, gw, 2); }
  E.glowText(ctx, 'BIG DATA', gx + gw / 2, h - 34 * s, { size: Math.max(22, 26 * s), weight: 700, spacing: .08, align: 'center', col: CREAM, glow: false });
  ctx.restore();
  return { x, y, w, h, top: [x + w / 2, y] };
}

// ======================================================================================================================== THE CHAT WINDOW
// "the A.I. that answers your questions": a window; your question bubble (cream text, YELLOW edge: yellow is you), the answer lines
// writing themselves (o.answer 0..1). R = { x, y, w, h }. o: { a, q 0..1 (your question rises), question, answer 0..1 }. Returns R.
export function chatWin(ctx, t, R, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0 || R.w < 8 || R.h < 8) return null;
  const s = R.w / 700;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(R.x + 8, R.y + 12, R.w, R.h, 18 * s); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 18 * s); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 18 * s); ctx.clip();
  const qu = clamp(o.q ?? 1), q = o.question ?? 'Can you explain this to me?';
  if (qu > 0 && R.w > 200) {
    const qs = Math.max(22, 30 * s), qw = measure(q, qs, true) + 50 * s, qx = R.x + R.w - qw - 30 * s, qy = R.y + 40 * s + (1 - expoOut(qu)) * 30 * s;
    ctx.save(); ctx.globalAlpha *= clamp(qu * 3);
    ctx.fillStyle = mixHex(P.ind1, P.blue1, .4); ctx.strokeStyle = P.coat; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(qx, qy, qw, qs * 1.9, qs * .6); ctx.fill(); ctx.stroke();
    E.glowText(ctx, q, qx + 25 * s, qy + qs * 1.27, { size: qs, serif: true, col: CREAM, glow: false });
    ctx.restore();
  }
  const an = clamp(o.answer ?? 0), N = 6, r = prng(9);
  for (let i = 0; i < N; i++) {
    const f = clamp(an * N - i); if (f <= 0) break;
    const L = R.w * (.5 + .3 * r()) * (i === N - 1 ? .5 : 1), yy = R.y + R.h * .42 + i * 30 * s;
    ctx.fillStyle = rgba(GOLD.text, .55); ctx.fillRect(R.x + 34 * s, yy, L * f, 11 * s);
    if (f < 1) halo(ctx, R.x + 34 * s + L * f, yy + 5 * s, 30 * s, .6, GOLD.halo, GOLD.core);
  }
  ctx.restore(); ctx.restore();
  return R;
}

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The plate grows out of a thing on screen (o.from = { x, y, w, h } screen rect or [cx, cy, r]) and goes back (o.morph 1 → 0).
// Lower third ABOVE the plate (≥ 22 px): the lower_third of audio/clips.json (NAME · PLACE, DATE) · ORIGINAL FOOTAGE. Nothing below y 880.
// Frames: <F78CLIPS or /tmp/claude-0/f78/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080; frame 1 = the slot start; tools/f78_clips.py clips).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
const CLIPJSON = (() => { try { return JSON.parse(fs.readFileSync(new URL('../audio/clips.json', import.meta.url), 'utf8')).clips; } catch { return []; } })();
const lt = (id, fb) => { const c = CLIPJSON.find((k) => k.id === id); return (c?.lower_third || fb).split(' · '); };
export const CLIPS = {   // name · place/date from audio/clips.json lower_third (checked 25.11.); C4 is a QUOTE CARD (SOURCES.c4), never footage
  C2: { name: lt('C2', 'Ilya Sutskever · University of Toronto, June 2025')[0], place: lt('C2', 'x · University of Toronto, June 2025')[1] },
  C1: { name: lt('C1', 'Ilya Sutskever · NeurIPS, Vancouver, Dec 2024')[0], place: lt('C1', 'x · NeurIPS, Vancouver, Dec 2024')[1] },
  C3: { name: lt('C3', 'Ilya Sutskever · Dwarkesh Podcast, Nov 2025')[0], place: lt('C3', 'x · Dwarkesh Podcast, Nov 2025')[1] },
  C5: { name: lt('C5', 'Ilya Sutskever · Dwarkesh Podcast, Nov 2025')[0], place: lt('C5', 'x · Dwarkesh Podcast, Nov 2025')[1] },
};
const CLIPDIR = (process.env.F78CLIPS || '/tmp/claude-0/f78/clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; return Math.max(1, Math.min(n, Math.floor((t - win.start) * 30 + 1e-6) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    const win = clipWin(T, id); if (!win || t < win.start - 3 || t > win.end + 3) continue;
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
export async function prepareAssets() { /* film 78: no image assets besides the clips */ }
function plateBox(o, R) {
  const m = sineIO(clamp(o.morph ?? 1)), f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(8, f.w / 2) };
  return { m, cx: lerp(fr0.cx, R.x + R.w / 2, m), cy: lerp(fr0.cy, R.y + R.h / 2, m), w: lerp(fr0.w, R.w, m), h: lerp(fr0.h, R.h, m), rr: lerp(fr0.r, 14, m) };
}
// o: { from, morph 0..1 (0 = the source shape, 1 = CLIP_RECT), dark 0..1, label 0..1 (default: on through the slot) }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], dark = clamp(o.dark ?? 0);
  const { m, cx, cy, w, h, rr } = plateBox(o, R);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.fillStyle = rgba(P.night0, .5 * m); ctx.beginPath(); ctx.roundRect(cx - w / 2 + 10, cy - h / 2 + 14, w, h, rr); ctx.fill();
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const k = frameAt(id, t, win), fr = k ? frameCache.get(framePath(id, k)) : null;
  if (fr) { const s = Math.max(R.w / fr.width, R.h / fr.height) * (w / R.w), dw = fr.width * s, dh = fr.height * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1; }
  else if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); E.glowText(ctx, `${id} · FOOTAGE MISSING (python3 tools/f78_clips.py clips)`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .1 }); ctx.globalAlpha = 1; }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const lu = (o.label ?? (span(t, win.start + .1, win.start + .9) * (1 - span(t, win.end - .4, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {   // the lower third ABOVE the plate (≥ 22 px): NAME (serif) · PLACE, DATE · ORIGINAL FOOTAGE
    const by = R.y - 34, nw = measure(info.name, 44, true);
    maskLine(ctx, [[info.name, 0]], R.x, by, 44, rise(lu), { glow: true });
    maskLine(ctx, [[info.place.toUpperCase(), 0]], R.x + nw + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
    goldText(ctx, [['ORIGINAL FOOTAGE', .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right', spacing: .1 });
  }
  ctx.restore();
  return { cx, cy, w, h };
}

// ======================================================================================================================== ON-SCREEN STRINGS
// From skript/kritik-v1.md + recherche/faktenzettel.md (25.11.). Dates the VO leaves out go into the picture ONLY from here.
export const SOURCES = {
  title: ['WHAT DID', 'ILYA SEE?'], ilya: ['ILYA SUTSKEVER', 'CO-FOUNDER, OPENAI'], openai: 'OPENAI', chatgpt: 'THE COMPANY BEHIND CHATGPT',
  call: 'FRI · NOV 17, 2023', boss: ['THE BOSS', 'HEAD OF OPENAI'], fired: 'FIRED', guess: 'THE GUESS',
  movie: ['ARTIFICIAL', 'US RELEASE DEC 25, 2026'], oath: 'SWORN TESTIMONY · OCT 2025', underOath: 'UNDER OATH', pages: '52 PAGES',
  by: 'BY ILYA SUTSKEVER', aboutMan: 'ABOUT ONE MAN', court: 'OAKLAND, MAY 2026', mit: 'MIT TECHNOLOGY REVIEW · OCT 26, 2023',
  toronto: 'TORONTO · JUNE 2025', neurips: 'NEURIPS · VANCOUVER · DEC 2024', podcast: 'PODCAST · NOV 2025', asOf: 'AS OF NOV 2026',
  left: 'MAY 14, 2024', ssi: 'SAFE SUPERINTELLIGENCE', fiveTwenty: '5–20 YEARS', learnsLike: 'A MACHINE THAT LEARNS LIKE A HUMAN: 5 TO 20 YEARS',
  lawFirm: ['BREAKDOWN OF TRUST', 'NOT ABOUT SAFETY', 'THE OLD BOARD ACTED WITHIN ITS DISCRETION', 'CONDUCT DID NOT MANDATE REMOVAL'],
  c4: { text: 'the idea that an AI can build the next generation of AI, the intelligence explosion, holy moly, what do you do about that?', credit: 'Ilya Sutskever · Open University of Israel, 2025' },
};
