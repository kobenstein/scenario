// Film 77 · "AGI: The Final Human Invention" (The Good Takeoff) · shared kit (owned by the lead; builders import, never edit: wishes go to
// lib/bN_extra.mjs or the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, figureRaw, halo, lightHand, glowText, finish)
// + lib/f16_kit.mjs (rise, maskLine, measure) + lib/f54_kit.mjs (source, essay). Plan: docs/MOTION.md · docs/shots.md · seams: lib/f77_seams.mjs.
// NOT ONE WORLD (REGELN §13): every sentence gets its own composed motif; motifs are joined by CARRIERS (portal, iris, a shape that becomes
// the next shape, a camera that follows the carrier: lookPath). THE BOARD (board()) is the leitbild: big ONLY at the anchors.
//
//   TYPE        titleWords() (thumbnail type) · goldText/maskLine/verdict · question() · quoteCard() (exact wording + source; o.hi = words
//               always gold) · strike() · flapText() (split-flap letters) · capsLabel() · source()
//   LEITBILD    board() THE BOARD (HUMAN INVENTIONS list / STILL WAITING: ENERGY · MATERIALS · DISCOVERY · CONTROL; o.mini = the corner icon) ·
//               boardRow() one row · ledger() a scrolling column of rows
//   OBJECTS     ring() THE MACHINE (a ring of cool light) · headProfile() · stylus() · lineIcon() (bulb, phone, screen, plug, battery, house,
//               radiator, pylon, plant, compass, drop, bolt, sun, flask) · room() YOUR ROOM (bulb, phone, wall screen, side table) · bulbGlass()
//               · dotSheet() the Erdős dot page · rollCounter() · band() GOOD'S SENTENCE (half promise, half condition, the cover) ·
//               testStamp() HAS THE INVENTING BEGUN? · slider() · catalyst() hydrogen cell · lattice() crystal dot grid · sample() the
//               superconductor in its holder · labRobot() + furnace · proofStack() · hands() many hands with lights · writingHand()
//   PEOPLE      du() you (the ONLY yellow) · person() everyone else · inventor() at a bench · crowd() · city()
//   GROUND      night(ctx, t, { glow, ox, oy }) · land() · look()/lookPt()/lookPath() (2D camera)
//   CARRIERS    iris(ctx, shape, drawB) · portal(ctx, u, win, drawA, drawB) · outline()/trailCream()/goldSpan() lines that draw themselves
//   CLIPS       clipPlate(ctx, t, T, 'C1', { from: slotRect, morph }) grows out of an object and returns into it (lower third ORIGINAL FOOTAGE)
// Colour code: night indigo + GOLD (the invention light: begun, real) · CREAM (questions, wishes, outlines, the open 4th line) · COOL (the
// machine's own light) · the yellow coat = only you · other people indigo. FILLED = real/checked, DASHED OUTLINE = imagined/forecast. Never red.
import { Path2D, PathOp, loadImage, GlobalFonts, createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import * as F54 from './f54_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, maskLine, measure } = K16;
export const { du, person, figureRaw, handPath, glowText, stars, nightSky } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
export const { essay } = F54;
export const source = (ctx, t, t0, t1, s, o = {}) => F54.source(ctx, t, t0, t1, s, { size: 22, y: 880, ...o });   // ≥ 22 px, above the subtitles
export { ROOT };
export const { cam3, card, camAt, camDrift, aim, project, F0 } = E;
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

export const PRINT77 = { grain: 14, floor: 4, vig: .5 };   // the print of every entry (grain stays texture: STIL-editorial-nacht)
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
// THE POPE: / AI WON'T SAVE YOU like thumbnail A: heavy condensed caps, cream with a warm glow, left; the small line under it. u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 72, y = o.y ?? 470, lines = o.lines ?? ['THE POPE:', "AI WON'T SAVE YOU"], cond = o.cond ?? .7;
  ctx.save();
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
    const kc = o.kind === 'KNOWN' ? GOLD.body : o.kind === 'FORECAST' ? COOL.body : PAPER.shade, tw = measure(o.kind, 17, false, 600) + 17 * o.kind.length * .14 + 30;
    ctx.fillStyle = rgba(kc, .16); ctx.strokeStyle = rgba(kc, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(30, 26, tw, 34, 17); ctx.fill(); ctx.stroke();
    E.glowText(ctx, o.kind, 30 + 15, 49, { size: 17, weight: 600, spacing: .14, col: kc, glow: false });
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
      const tt = times ? times[k] : null, hiMode = o.mode === 'hi', lit = tt == null ? (times && !hiMode ? .25 : 1) : clamp((t - tt + .05) / .25), g = Math.max((o.gold ?? 1) * (times && tt != null ? lit : 0), o.hi && o.hi.includes(nz(wd)) ? clamp(o.hiU ?? 1) : 0);
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

export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore(); }
export const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .02 * k * Math.sin(t * .6 + 1), dx = E.drift(t * 2, 16 * k, 11), dy = E.drift(t * 2, 10 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };
// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The plate grows out of a thing in the world (o.from = { x, y, w, h } screen rect: a slot, the furnace window; or [cx, cy, r]) and goes back.
// Lower third (≥ 22 px, ABOVE the plate): NAME (serif) · ROLE · SOURCE, YEAR · ORIGINAL FOOTAGE. Wording: <ROOT>clips-final.md (25.11.).
// Frames: <F77CLIPS or /tmp/claude-0/f77/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, cut by tools/f77_clips.py). Until the frames exist a
// placeholder shows the exact words (never ship it). ANCHOR ON T.clip(id) ONLY: the slots get ~1.2–1.5 s shorter after the clip trim.
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIPS = {   // clips-final.md: all 1080p H.264, full plate (no inset, no crop). C2 = Cubuk (not Fedus), C3 = Numberphile (not SAIR)
  C1: { name: 'Demis Hassabis', role: 'Co-founder, Google DeepMind', src: 'Stanford GSB', year: '2026', dur: 10.5,
    words: 'It was literally step one, solve intelligence, step two, use it to solve everything else. And people were quite confused. But we really meant it.' },
  C2: { name: 'Ekin Dogus Cubuk', role: 'Co-founder, Periodic Labs', src: 'Latent Space', year: '2026', dur: 11.1,
    words: 'But also we feel like even if, like, Fable 7 gets really good at, like, even better than what it is today, it will still have to run experiments to get results.' },
  C3: { name: 'Terence Tao', role: 'Fields Medalist', src: 'Numberphile', year: '2026', dur: 10.8,
    words: "And now we found a shortcut. We found machines that can get these proofs for us, and now we're drowning in proofs, but we're not getting all the understanding that we used to get." },
  C4: { name: 'Paul Christiano', role: 'Founder, Alignment Research Center', src: 'The Hinton Lectures', year: '2026', dur: 12.8,
    words: "So I'd say all of these approaches are plausible approaches. I don't want to say any of them are doomed, but I definitely do want to say that none of them are on a trajectory where we can say that's definitely going to work, or even that's probably going to work." },
};
// the plate rect of a clip: full plate, or a framed inset (o.inset in CLIPS; none in film 77)
export function clipRect(id) {
  const k = CLIPS[id]?.inset; if (!k) return CLIP_RECT;
  const w = Math.round(W * k), h = Math.round(w * 9 / 16); return { x: (W - w) / 2, y: 868 - h, w, h, inset: true };
}
let GRAIN = null;   // a small seeded noise tile for the inset footage (slight grain, hides the 480p softness)
function grainTile() { if (GRAIN) return GRAIN; const c = createCanvas(192, 192), x = c.getContext('2d'), d = x.createImageData(192, 192), r = prng(63); for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r() - .5) * 120; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); return (GRAIN = c); }
const CLIPDIR = (process.env.F77CLIPS || '/tmp/claude-0/f77/clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
// cutAt: the first frame of a camera cut INSIDE the footage (C3: Numberphile cuts to the interviewer for the last 0.9 s). The last 3 s before it are
// stretched (0.76x) over the rest of the slot, so the plate never shows the cut and the speaker stays on screen (lead, 25.11.)
function frameAt(id, t, win) {
  const n = frameCount(id); if (!n) return 0; let k = Math.max(1, Math.min(n, Math.floor((t - win.start) * 30) + 1));
  const c = CLIPS[id]?.cutAt; if (c && c <= n) { const last = c - 1, k0 = last - 90; if (k > k0) k = Math.min(last, k0 + Math.round((k - k0) * (last - k0) / (n - k0))); }
  return k;
}
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
  // dark: default = the footage develops out of the dark slot over the first 30 % of the morph and sinks back into it at the end (lead 25.11.:
  // the footage switching on/off inside the small slot read as a POP); o.dark overrides
  const R = clipRect(id), win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], dark = clamp(o.dark ?? 1 - smooth(clamp((o.morph ?? 1) / .3)));
  const { m, cx, cy, w, h, rr } = plateBox(o, R);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (R.inset && m > 0) {   // the editorial mat behind the inset: a dark passe-partout with a soft drop into the night
    const pad = 16 * m; ctx.save(); ctx.shadowColor = rgba(P.night0, .75 * m); ctx.shadowBlur = 40 * m; ctx.shadowOffsetY = 14 * m;
    ctx.fillStyle = mixHex(P.night0, P.ind0, .25); ctx.beginPath(); ctx.roundRect(cx - w / 2 - pad, cy - h / 2 - pad, w + pad * 2, h + pad * 2, Math.min(rr + 6, (w + pad * 2) / 2)); ctx.fill(); ctx.restore(); }
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const k = frameAt(id, t, win), fr = k ? frameCache.get(framePath(id, k)) : null;
  if (fr) {   // the centre crop (info.crop) hides corner logos; then cover the plate
    const cr = info.crop ?? 1, sw = fr.width * cr, sh = fr.height * cr, sx = (fr.width - sw) / 2, sy = Math.min(fr.height - sh, (fr.height - sh) / 2 + (info.cropDy ?? 0) * fr.height);
    const s = Math.max(R.w / sw, R.h / sh) * (w / R.w), dw = sw * s, dh = sh * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, sx, Math.max(0, sy), sw, sh, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1;
    if (R.inset) { ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .07; const pt = ctx.createPattern(grainTile(), 'repeat'), gx = Math.floor(t * 30) * 53 % 192, gy = Math.floor(t * 30) * 97 % 192; ctx.translate(gx, gy); ctx.fillStyle = pt; ctx.fillRect(cx - w / 2 - gx, cy - h / 2 - gy, w, h); ctx.restore(); } }
  else {
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx, cy - h * .05, w * .7, [[0, rgba(P.blue0, .5 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy - 40, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      if (info.words) { const ws = info.words.split(' '), ln = []; let cur = ''; for (const wd of ws) { const nx = cur ? cur + ' ' + wd : wd; if (cur && measure(nx, 30, true) > w * .7) { ln.push(cur); cur = wd; } else cur = nx; } if (cur) ln.push(cur); ln.forEach((l, i) => E.glowText(ctx, l, cx, cy + 20 + i * 40, { size: 30, serif: true, align: 'center', col: P.cream, glow: false })); }
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  if (R.inset && m > .5) {   // gold corner brackets on the mat (the editorial frame)
    const k = span(m, .5, 1), c = 34 * k, x0 = cx - w / 2 - 16, y0 = cy - h / 2 - 16, x1 = cx + w / 2 + 16, y1 = cy + h / 2 + 16;
    ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4; for (const [qx, qy, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) { ctx.beginPath(); ctx.moveTo(qx + sx * c, qy); ctx.lineTo(qx, qy); ctx.lineTo(qx, qy + sy * c); ctx.stroke(); } }
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {   // the lower third ABOVE the plate (≥ 22 px): NAME · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE)
    if (R.inset) {   // inset: NAME (serif) + ORIGINAL FOOTAGE (SOURCE) on one row, ROLE · PLACE, DATE under it, all above the mat
      const by = R.y - 72;
      maskLine(ctx, [[info.name, 0]], R.x - 4, by, 44, rise(lu), { glow: true });
      goldText(ctx, [[`ORIGINAL FOOTAGE (${info.src.toUpperCase()})`, .45]], R.x + R.w + 4, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
      maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x - 2, by + 36, 22, rise(span(lu, .1, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
    } else {
      const by = R.y - 40, nw = maskLine(ctx, [[info.name, 0]], R.x, by, 44, rise(lu), { glow: true });   // NAME · ROLE · SOURCE, YEAR · ORIGINAL FOOTAGE
      maskLine(ctx, [[[info.role, `${info.src}, ${info.year}`].join(' · ').toUpperCase(), 0]], R.x + Math.max(nw?.w ?? 0, measure(info.name, 44, true)) + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
      goldText(ctx, [['ORIGINAL FOOTAGE', .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
    }
  }
  ctx.restore();
  return { cx, cy, w, h };
}


// ======================================================================================================================== HELPERS
const nz2 = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const fract = (x) => x - Math.floor(x);
export const NIGHT = { top: '#070a22', mid: P.night1, low: P.ind0, ink: P.night0 };
export function poly(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
// screen-space camera for one motif: the design point (cx, cy) sits at the frame centre, zoom z (z = 1, cx = W/2, cy = H/2: identity)
export function look(ctx, cx, cy, z, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
// map a design point through look(cx, cy, z)
export const lookPt = (cx, cy, z, x, y) => [W / 2 + (x - cx) * z, H / 2 + (y - cy) * z];

// ---------------------------------------------------------------- GROUNDS
// night(ctx, t, o): see FILM 77 OBJECTS (the same ground with a parallax star field: o.ox / o.oy)
// the ground of a scene: a flat land with a lit rim on its horizon line y0, darker toward the bottom
export function land(ctx, y0, o = {}) {
  ctx.fillStyle = lin(ctx, 0, y0, 0, H + 200, [[0, o.top ?? mixHex(P.ind1, P.blue1, .35)], [.25, P.ind0], [1, P.night0]]); ctx.fillRect(-W, y0, W * 3, H * 2);
  ctx.fillStyle = rgba(P.blue1, .55); ctx.fillRect(-W, y0 - 1, W * 3, 2);
}

// ---------------------------------------------------------------- TYPE
// thumbnail type, word by word: lines = [[{ w, u }, …], …] (u 0..1 = the word rising behind its line's mask). Inter Black, condensed, cream
// with a warm glow, left aligned at (x, y) (baseline of line 1). o.size, o.cond, o.lead (line step), o.out 0..1 (the lines sink).
export function titleWords(ctx, lines, x, y, o = {}) {
  const size = o.size ?? 150, cond = o.cond ?? .74, lead = o.lead ?? size * .9;
  ctx.save();
  lines.forEach((ln, i) => {
    const yy0 = y + i * lead; let xx = x;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 60, yy0 - size * .84, W * 2, size * .98); ctx.clip();
    for (const wd of ln) {
      ctx.font = `${size}px "Inter Black"`; ctx.letterSpacing = '-0.01em';
      const ww = ctx.measureText(wd.w + ' ').width * cond, u = clamp(wd.u ?? 1), k = expoOut(u), out = clamp(o.out ?? 0);
      if (u > 0 && out < 1) {
        ctx.save(); ctx.translate(xx, yy0 + (1 - k) * size * .78 + sineIO(out) * size * .95); ctx.scale(cond, 1);
        ctx.shadowColor = rgba(P.halo0, .7); ctx.shadowBlur = size * .15; ctx.fillStyle = wd.col ?? '#fff3d0'; ctx.fillText(wd.w, 0, 0);
        ctx.shadowBlur = 0; ctx.fillStyle = wd.col ?? '#fffbea'; ctx.fillText(wd.w, 0, 0); ctx.restore();
      }
      xx += ww;
    }
    ctx.restore();
  });
  ctx.restore();
}
export function titleWidth(s, size, cond = .74) { const c = createCanvas(8, 8).getContext('2d'); c.font = `${size}px "Inter Black"`; c.letterSpacing = '-0.01em'; return c.measureText(s).width * cond; }
// a struck word: a cream line drawn left → right over (x0..x1, y), u 0..1, slight lift at the end (hand-drawn)
export function strike(ctx, x0, y, x1, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const e = expoOut(u), w = o.w ?? 7;
  ctx.save(); ctx.strokeStyle = o.col ?? CREAM; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.shadowColor = rgba(P.night0, .6); ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.moveTo(x0 - 10, y + 4); ctx.quadraticCurveTo(lerp(x0, x1, .5), y + 2, lerp(x0 - 10, x1 + 14, e), y - 6 * e); ctx.stroke(); ctx.restore();
}
// the question chain: words rise one by one (o.ts = start time per word, or u), cream serif, the ? in gold. Returns { w, x0 }.
export function question(ctx, t, text, x, y, size, o = {}) {
  const words = text.split(/\s+/), ts = o.ts, u = o.u ?? 1, out = clamp(o.out ?? 0);
  const tot = measure(text, size, true); let xx = (o.align ?? 'center') === 'center' ? x - tot / 2 : x; const x0 = xx;
  words.forEach((wd, i) => {
    const ui = ts ? span(t, ts[i] - .08, ts[i] + .42) : span(u, i / words.length * .7, i / words.length * .7 + .3);
    const q = wd.endsWith('?'), base = q ? wd.slice(0, -1) : wd;
    // o.out sinks each word behind its own (fixed) line mask, word by word left → right (the mask never moves with the words)
    const uo = out > 0 ? Math.min(ui, 1 - span(out, i / words.length * .5, i / words.length * .5 + .5)) : ui;
    if (uo > 0) {
      maskLine(ctx, [[base, 0]], xx, y, size, rise(uo), { glow: false, col: o.col ?? CREAM });
      if (q) maskLine(ctx, [['?', 1]], xx + measure(base, size, true), y, size, rise(uo), { glow: true, col: GOLD.body });
    }
    xx += measure(wd + ' ', size, true);
  });
  return { w: tot, x0 };
}
// times of each word of a phrase in the VO (for question(), kinetic words): T.GW(from, to, after) → [s, …]
export function wordTimes(T, from, to, after = -1) { try { return T.GW(from, to, after).map((w) => w.s); } catch { return null; } }


export function along(pts, q) {
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = clamp(q) * len[len.length - 1]; let i = 1; while (i < pts.length - 1 && len[i] < d) i++;
  const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)];
}
// scaffolding round the block (u 0..1 grows bottom → top) with tiny builders (people, not yellow) and a crane. b = block() result.

// ---------------------------------------------------------------- PEOPLE (everyone but you: never yellow)
// a skyline (left part of thumbnail A): seeded blocks, a few lit windows that breathe slowly
const CITY = new Map();
export function city(ctx, t, x0, x1, y, o = {}) {
  const key = `${x0}|${x1}|${o.seed ?? 4}`;
  if (!CITY.has(key)) {
    const r = prng(o.seed ?? 4), bl = []; let x = x0;
    while (x < x1) { const w = 60 + r() * 110, h = 90 + r() * 260 * (o.tall ?? 1); const win = []; for (let k = 0; k < 6; k++) if (r() < .55) win.push([.15 + r() * .7, .1 + r() * .75, r() * 6]); bl.push({ x, w, h, win, d: r() }); x += w + r() * 14; }
    CITY.set(key, bl);
  }
  const far = o.far ?? 0;
  for (const b of CITY.get(key)) {
    const by = y - b.h * (o.sink != null ? 1 - o.sink : 1);
    ctx.fillStyle = lin(ctx, 0, by, 0, y, [[0, mixHex(P.ind1, P.blue1, .25 + far * .3)], [1, mixHex(P.night1, P.ind0, .4)]]); ctx.fillRect(b.x, by, b.w, y - by);
    ctx.fillStyle = rgba(P.blue0, .5); ctx.fillRect(b.x, by, 2, y - by);
    for (const [u, v, ph] of b.win) { const a = .65 + .35 * Math.sin(t * .4 + ph); ctx.fillStyle = rgba(mixHex(P.coat, P.core1, .4), a); ctx.fillRect(b.x + u * b.w, by + v * b.h, 9, 15); }
  }
}
// the unit chart of THE FAITHFUL: 142 figures (1 = 10 million), rows receding to the horizon. o: { x (centre), y0 (front row feet), y1
// (horizon), u 0..1 (rows roll out from the origin outward), sink 0..1 (all sink back under their ground), seed }
const CROWD = new Map();
export function crowd(ctx, t, o = {}) {
  const rows = [18, 17, 16, 15, 14, 14, 13, 12, 12, 11];
  const key = rows.join(',');
  if (!CROWD.has(key)) { const r = prng(11), pts = []; rows.forEach((n, ri) => { for (let k = 0; k < n; k++) pts.push({ ri, k, n, j: (r() - .5) * .5, ph: r() * 6, hh: .9 + r() * .2 }); }); CROWD.set(key, pts); }
  const x = o.x ?? W / 2, y0 = o.y0 ?? H * .8, y1 = o.y1 ?? H * .5, sw = o.w ?? W * 1.1, u = clamp(o.u ?? 1), sink = clamp(o.sink ?? 0);
  const pts = CROWD.get(key).slice().sort((a, b) => b.ri - a.ri);   // far rows first
  for (const p of pts) {
    const d = p.ri / (rows.length - 1), z = 1 - .72 * Math.pow(d, .8), yy = lerp(y0, y1, Math.pow(d, .75)), hw = sw * z * .5;
    const xx = x + (((p.k + .5) / p.n) * 2 - 1 + p.j / p.n) * hw, s = 62 * z * p.hh;
    const dist = Math.hypot((xx - (o.ox ?? x)) / W, (yy - (o.oy ?? y0)) / H), a = expoOut(span(u, dist * .55, dist * .55 + .35)) * (1 - sineIO(span(sink, d * .3, d * .3 + .7)));
    if (a <= 0) continue;
    ctx.save(); ctx.beginPath(); ctx.rect(xx - s, yy - s * 2.2, s * 2, s * 2.2); ctx.clip();
    ctx.translate(xx, yy + (1 - a) * s * 1.15 + .015 * s * Math.sin(t * 1.3 + p.ph));
    ctx.fillStyle = lin(ctx, 0, -s, 0, 0, [[0, mixHex(P.blue0, P.halo2, .25)], [1, mixHex(P.ind1, P.night1, .3)]]);
    ctx.beginPath(); ctx.moveTo(-s * .3, 0); ctx.bezierCurveTo(-s * .32, -s * .5, -s * .28, -s * .74, 0, -s * .76); ctx.bezierCurveTo(s * .28, -s * .74, s * .32, -s * .5, s * .3, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s * .93, s * .15, 0, 6.29); ctx.fill();
    ctx.fillStyle = rgba(P.halo2, .55); ctx.fillRect(-s * .3, -s * .76, s * .6, s * .03);
    ctx.restore();
  }
}

// ---------------------------------------------------------------- EXPLAINER SHAPES
// a cream line drawn along pts (u0..u1) with a soft glow, the cool partner of goldSpan (open questions, outlines)
export function trailCream(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], sub = [along(pts, u0)]; for (let i = 1; i < pts.length - 1; i++) if (len[i] > u0 * L && len[i] < u1 * L) sub.push(pts[i]); sub.push(along(pts, u1));
  const w = o.w ?? 3;
  for (const [k, al, c] of [[4, .18, P.blue0], [1, 1, o.col ?? CREAM]]) { ctx.save(); ctx.strokeStyle = c; ctx.globalAlpha *= al * (o.a ?? 1); ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
  return sub[sub.length - 1];
}
// an empty word slot (dashed, corner brackets): returns the rect. o.fill 0..1 = it fills with a dark plate (ready for a word or a clip)
export function slot(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), ww = w * lerp(.3, 1, k), x0 = x - ww / 2, y0 = y - h / 2;
  ctx.save();
  ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .92 * k); ctx.beginPath(); ctx.roundRect(x0, y0, ww, h, 10); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.5; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 18; ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4; const c = 26;
  for (const [cx, cy, sx, sy] of [[x0, y0, 1, 1], [x0 + ww, y0, -1, 1], [x0, y0 + h, 1, -1], [x0 + ww, y0 + h, -1, -1]]) { ctx.beginPath(); ctx.moveTo(cx + sx * c, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * c); ctx.stroke(); }
  ctx.restore();
  return { x: x0, y: y0, w: ww, h };
}
// a gold arrow from a to b (drawn with u), slight arc
export function arrow(ctx, a, b, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - (o.arc ?? 40), pts = [];
  for (let i = 0; i <= 24; i++) { const q = i / 24; pts.push([(1 - q) ** 2 * a[0] + 2 * (1 - q) * q * mx + q * q * b[0], (1 - q) ** 2 * a[1] + 2 * (1 - q) * q * my + q * q * b[1]]); }
  const e = goldSpan(ctx, pts, 0, smooth(u), { w: o.w ?? 2.4, spark: false });
  if (u > .85 && e) { const p = pts[pts.length - 2], ang = Math.atan2(b[1] - p[1], b[0] - p[0]), s = 16; ctx.save(); ctx.fillStyle = GOLD.line; ctx.globalAlpha *= span(u, .85, 1); ctx.translate(b[0], b[1]); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-s, -s * .55); ctx.lineTo(-s, s * .55); ctx.closePath(); ctx.fill(); ctx.restore(); }
}
// a small caps label in gold-cream rising behind a mask (≥ 22 px)
export function capsLabel(ctx, s, x, y, u, o = {}) { if (u <= 0) return; maskLine(ctx, [[s, 0]], x, y, o.size ?? 24, rise(u), { serif: false, weight: 600, col: o.col ?? P.halo2, glow: false, align: o.align ?? 'center' }); }

// ---------------------------------------------------------------- CARRIERS (no fades: B opens inside a shape that belongs to A)
// iris: draw B clipped to shape (a function that builds the path), then the shape's rim (the object's edge) on top.
export function iris(ctx, shape, drawB, o = {}) {
  ctx.save(); ctx.beginPath(); shape(ctx); ctx.clip(); drawB(ctx); ctx.restore();
  if (o.rim !== false) { ctx.save(); ctx.beginPath(); shape(ctx); ctx.strokeStyle = o.rim ?? rgba(P.core1, .85); ctx.lineWidth = o.rimW ?? 3; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 14; ctx.stroke(); ctx.restore(); }
}
// portal: the camera pushes into a window rect of A (u 0..1, quartIO), B lives inside the window at the window's scale, so at u = 1 the
// window covers the frame and only B is left. drawA(ctx) and drawB(ctx) draw full frames in design space. win = {x, y, w, h} in A.
export function portal(ctx, u, win, drawA, drawB, o = {}) {
  const e = (o.ease ?? quartIO)(clamp(u)), cx = win.x + win.w / 2, cy = win.y + win.h / 2;
  const zEnd = Math.max(W / win.w, H / win.h) * 1.02, z = Math.pow(zEnd, e);
  // A pushed in about the window centre, the window centre travels to the frame centre
  const ox = lerp(cx, W / 2, e), oy = lerp(cy, H / 2, e);
  ctx.save(); ctx.translate(ox, oy); ctx.scale(z, z); ctx.translate(-cx, -cy);
  drawA(ctx);
  ctx.beginPath(); ctx.rect(win.x, win.y, win.w, win.h); ctx.clip();
  // B: full frame mapped into the window (cover at u = 0), its scale eases to 1/z so that at u = 1 B is exactly the identity frame
  // (no jump when the caller switches to drawing B alone). B should overscan its own background (night() and land() do).
  const kb0 = Math.max(win.w / W, win.h / H), kb = Math.exp(lerp(Math.log(kb0), Math.log(1 / zEnd), e)); ctx.translate(cx, cy); ctx.scale(kb, kb); ctx.translate(-W / 2, -H / 2);
  drawB(ctx);
  ctx.restore();
  if (o.over) { ctx.save(); ctx.translate(ox, oy); ctx.scale(z, z); ctx.translate(-cx, -cy); o.over(ctx); ctx.restore(); }
}

// ======================================================================================================================== FILM 77 OBJECTS
// Picture code (STIL-editorial-nacht + docs/MOTION.md §2): FILLED (gold) = real, today, checked · DASHED CREAM OUTLINE = imagined, a wish,
// a forecast, still unknown. GOLD = the invention light (begun) · CREAM = questions, wishes, the open fourth line · COOL = the machine's
// own light (the ring). The yellow coat = only you. Everything below is seeded and deterministic; nothing is created per frame.
const HPI = Math.PI / 2;
export const CELL = .74, CGAP = .08;
// ---------------------------------------------------------------- CAMERA (2D): a path through keys [[t, cx, cy, z], …]
// monotone cubic in cx, cy and log z (it glides THROUGH the keys, never overshoots, velocity continuous). Use with look(ctx, c.cx, c.cy, c.z, fn).
export function lookPath(t, K) {
  const n = K.length; if (n === 1) return { cx: K[0][1], cy: K[0][2], z: K[0][3] };
  const V = K.map((k) => [k[1], k[2], Math.log(k[3])]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return { cx: out[0], cy: out[1], z: Math.exp(out[2]) };
}
export const backOut = (x, s = 1.4) => { x = clamp(x); const c = s + 1; return 1 + c * (x - 1) ** 3 + s * (x - 1) ** 2; };
export const powOut = (x, p = 2) => 1 - (1 - clamp(x)) ** p;
// a polyline's first part (u 0..1 of its length)
export function subPoly(pts, u0, u1) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0 || pts.length < 2) return [];
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], out = [along(pts, u0)]; for (let i = 1; i < pts.length - 1; i++) if (len[i] > u0 * L && len[i] < u1 * L) out.push(pts[i]); out.push(along(pts, u1));
  return out;
}
export const circlePts = (cx, cy, r, a0 = 0, a1 = Math.PI * 2, n = 40) => { const p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
export const rectPts = (x, y, w, h, r = 0) => (r > 0 ? K16.roundRectPts(x, y, w, h, r) : [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]);
// OUTLINE: several polylines drawn together (u 0..1 each), cream (or o.col), o.dashed = imagined (the dash creeps), o.gold = filled-real line
export function outline(ctx, polys, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const w = o.w ?? 3, col = o.gold ? GOLD.line : (o.col ?? CREAM);
  for (const [k, al, c] of [[4, o.gold ? .3 : .18, o.gold ? GOLD.halo : P.blue0], [1, 1, col]]) {
    ctx.save(); ctx.strokeStyle = c; ctx.globalAlpha *= al * (o.a ?? 1); ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (o.dashed) { ctx.setLineDash([w * 4, w * 3.2]); ctx.lineDashOffset = -(o.t ?? 0) * w * 5; }
    for (const pts of polys) { const s = u >= 1 ? pts : subPoly(pts, 0, u); if (s.length < 2) continue; ctx.beginPath(); s.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    ctx.restore();
  }
}
// ---------------------------------------------------------------- GROUND: night with a parallax star field (o.ox, o.oy move the stars)
const STARS = (() => { const r = prng(77), s = []; for (let i = 0; i < 170; i++) s.push([r() * W, r() * H * .95, .6 + r() * 1.5, r() * 6.28, .25 + r() * .75]); return s; })();
export function night(ctx, t, o = {}) {
  ctx.fillStyle = lin(ctx, 0, -H * .2, 0, H * 1.2, [[0, NIGHT.top], [.55, NIGHT.mid], [1, NIGHT.low]]); ctx.fillRect(-W, -H, W * 3, H * 3);
  if (o.glow) { const [x, y, r, a = .5] = o.glow; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, y, r, [[0, rgba(P.halo1, .22 * a)], [.45, rgba(P.blue0, .14 * a)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
  const sa = (o.stars ?? 1) * .55; if (sa <= 0) return;
  const ox = o.ox ?? 0, oy = o.oy ?? 0, md = (v, m) => ((v % m) + m) % m;
  ctx.save(); ctx.fillStyle = P.cream;
  for (const [x, y, r, ph, b] of STARS) { const a = sa * b * (.55 + .45 * Math.sin(t * .7 + ph)); if (a <= .02) continue; ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(md(x + ox, W + 40) - 20, md(y + oy, H + 40) - 20, r, 0, 6.29); ctx.fill(); }
  ctx.restore();
}

// ---------------------------------------------------------------- SPLIT-FLAP TYPE (the board's letters)
// flapText(ctx, t, text, x, y, size, o): one cell per character, (x, y) = left edge and vertical centre of the cells.
//   o.u 0..1 flips from o.from to text (cells flip left → right, each through 2–4 letters, a real falling flap), o.cells (pad with
//   blanks), o.col, o.tiles (false = letters only), o.glow, o.seed, o.stagger (.55), o.dur (.45). Returns the width.
const FLAP_AB = 'ABCDEFGHIJKLMNOPRSTUVWY0123456789';
export const flapW = (cells, size) => cells * size * CELL + Math.max(0, cells - 1) * size * CGAP;
export function flapText(ctx, t, text, x, y, size, o = {}) {
  text = String(text ?? '').toUpperCase(); const from = String(o.from ?? '').toUpperCase();
  const cells = o.cells ?? Math.max(text.length, from.length), cw = size * CELL, gap = size * CGAP, ch = size * 1.22, u = o.u ?? 1, col = o.col ?? CREAM;
  const tileTop = o.tileCol ?? mixHex(P.night1, P.ind1, .55), tileLow = mixHex(tileTop, P.night0, .35), seed = o.seed ?? 3;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.font = `${o.weight ?? 600} ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const glyph = (c, cx, half, sy = 1) => {   // half: 0 = whole, -1 = top, 1 = bottom; sy = flap squash about the split line
    if (c === ' ' && o.tiles === false) return;
    ctx.save();
    if (half) { ctx.beginPath(); ctx.rect(cx - cw / 2 - 2, half < 0 ? y - ch / 2 - 2 : y, cw + 4, ch / 2 + 2); ctx.clip(); }
    if (sy !== 1) { ctx.translate(0, y); ctx.scale(1, sy); ctx.translate(0, -y); }
    if (o.tiles !== false) { ctx.fillStyle = half > 0 ? tileLow : tileTop; ctx.beginPath(); ctx.roundRect(cx - cw / 2, y - ch / 2, cw, ch, size * .09); ctx.fill(); if (half > 0 && sy !== 1) { ctx.fillStyle = rgba(P.night0, .35 * (1 - Math.abs(sy))); ctx.fill(); } }
    if (c !== ' ') {
      if (o.glow) { ctx.shadowColor = rgba(o.glowCol ?? P.halo0, .7); ctx.shadowBlur = size * .35; }
      ctx.fillStyle = col; ctx.fillText(c, cx, y + size * .04);
    }
    ctx.restore();
  };
  for (let i = 0; i < cells; i++) {
    const cx = x + i * (cw + gap) + cw / 2, tg = text[i] ?? ' ', sr = from[i] ?? ' ';
    const a0 = (o.order === 'rtl' ? cells - 1 - i : i) / Math.max(1, cells) * (o.stagger ?? .55), p = tg === sr ? 1 : span(u, a0, a0 + (o.dur ?? .45));
    const k = 2 + ((i * 7 + seed) % 3);
    if (p <= 0 || p >= 1) { glyph(p <= 0 ? sr : tg, cx, 0); }
    else {
      const q = p * k, st = Math.floor(q), f = q - st, at = (j) => (j <= 0 ? sr : j >= k ? tg : FLAP_AB[(i * 11 + j * 7 + seed * 5) % FLAP_AB.length]);
      const cur = at(st), nxt = at(st + 1);
      glyph(nxt, cx, -1); glyph(cur, cx, 1);
      if (f < .5) glyph(cur, cx, -1, Math.max(.001, Math.cos(f * Math.PI)));   // the top flap falls …
      else glyph(nxt, cx, 1, Math.max(.001, -Math.cos(f * Math.PI)));          // … and lands as the new bottom half
    }
    if (o.tiles !== false) { ctx.fillStyle = rgba(P.night0, .8); ctx.fillRect(cx - cw / 2, y - .75, cw, 1.5); }   // the split line
  }
  ctx.restore();
  return flapW(cells, size);
}

// ---------------------------------------------------------------- THE BOARD (the leitbild: a tall ledger of light, NOT a chalkboard)
// Modes: HUMAN INVENTIONS (frame 0 / the end: a long list, the last row empty and glowing gold) and STILL WAITING (4 rows ENERGY ·
// MATERIALS · DISCOVERY · CONTROL, status WAITING → BEGUN in gold; row 4 stays cream until HOW TO STEER IT is written into it).
// LEITBILD BIG only at the anchors (H.01, 1.20, 4.29, 6.16/6.22). Anywhere else use o.mini (the small corner icon, an explainer).
export const INVENTIONS = ['THE WHEEL', 'WRITING', 'PRINTING PRESS', 'STEAM ENGINE', 'LIGHT BULB', 'TELEPHONE', 'TELEVISION', 'THE INTERNET'];
export const LINES = ['ENERGY', 'MATERIALS', 'DISCOVERY', 'CONTROL'];
// one row: r = { text, from, flip 0..1, status, statusFrom, statusFlip, gold 0..1 (filled = begun/real), empty (glowing gold slot),
// dashed (imagined), lit 0..1 (a passing light) }. (x, y) top-left. Returns the cell geometry { x, y, w, h, tx (text left), size }.
export function boardRow(ctx, t, x, y, w, h, r = {}, o = {}) {
  const g = clamp(r.gold ?? 0), size = o.size ?? h * .4, pad = o.pad ?? h * .34, a = r.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(mixHex(P.ind1, GOLD.deep, g * .6), .34 + .3 * g); ctx.beginPath(); ctx.roundRect(x, y + 3, w, h - 6, 6); ctx.fill();
  if (r.empty) {   // the empty last row: a glowing gold field (it breathes), a gold rim
    const b = r.breath ?? (.82 + .18 * Math.sin(t * 1.4));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, rgba(GOLD.halo, .34 * b)], [.5, rgba(GOLD.body, .5 * b)], [1, rgba(GOLD.halo, .34 * b)]]);
    ctx.beginPath(); ctx.roundRect(x, y + 3, w, h - 6, 6); ctx.fill(); ctx.restore();
    halo(ctx, x + w / 2, y + h / 2, w * .55, .3 * b, GOLD.halo, GOLD.core);
    ctx.strokeStyle = GOLD.line; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x, y + 3, w, h - 6, 6); ctx.stroke();
  } else if (r.dashed) {
    ctx.fillStyle = rgba(CREAM, .07 + .1 * (r.lit ?? 0)); ctx.fill();
    ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 12; ctx.beginPath(); ctx.roundRect(x, y + 3, w, h - 6, 6); ctx.stroke(); ctx.setLineDash([]);
  } else {
    ctx.fillStyle = rgba(P.blue1, .55); ctx.fillRect(x + 6, y + h - 3, w - 12, 1.5);
    if (g > 0) { ctx.fillStyle = GOLD.body; ctx.globalAlpha *= g; ctx.fillRect(x, y + 6, 4, h - 12); ctx.globalAlpha /= g; }
  }
  if ((r.lit ?? 0) > 0 && !r.dashed) halo(ctx, x + w * .5, y + h / 2, w * .45, .35 * r.lit, GOLD.halo, GOLD.core);
  const tx = x + pad, col = mixHex(o.col ?? CREAM, GOLD.text, g);
  if (r.text != null || r.from != null) flapText(ctx, t, r.text ?? '', tx, y + h / 2, size, { from: r.from, u: r.flip ?? 1, cells: r.cells ?? o.cells, col, glow: g > .5, seed: o.seed ?? Math.round(y) % 7, tiles: o.tiles });
  if (r.status != null) {
    const ss = size * .72, cells = o.statusCells ?? 7, sw = flapW(cells, ss), sg = clamp(r.statusGold ?? (r.status === 'BEGUN' ? g : 0));
    flapText(ctx, t, r.status, x + w - pad - sw, y + h / 2, ss, { from: r.statusFrom, u: r.statusFlip ?? 1, cells, col: mixHex(CREAM, GOLD.text, sg), glow: sg > .5, seed: 5 });
  }
  ctx.restore();
  return { x, y, w, h, tx, size };
}
// the whole board: (x, y) top-left, o = { w (600), rowH (78), head (112), title, sub, rows [row …], cells (14), u (0..1: the frame draws
// itself and the rows flap in from the top), s (scale; o.mini = .42 and no glow), a }. Returns { x, y, w, h, rows: [rects] } (caller space).
export function board(ctx, t, x, y, o = {}) {
  const s = o.mini ? (o.s ?? .42) : (o.s ?? 1), w = o.w ?? 600, rowH = o.rowH ?? 78, head = o.head ?? 112, rows = o.rows ?? [], u = clamp(o.u ?? 1);
  const h = head + rows.length * rowH + 30;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.a ?? 1;
  if (!o.mini) halo(ctx, w / 2, h * .45, Math.max(w, h) * .75, .22 * (o.glow ?? 1), GOLD.halo, P.halo1);
  // the panel: deep indigo, a lighter face, a thin gold frame line and gold corner brackets
  const fu = expoOut(span(u, 0, .45));
  ctx.save(); ctx.beginPath(); ctx.rect(-20, -20, w + 40, (h + 40) * fu); ctx.clip();
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(10, 16, w, h, 14); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.night1, P.ind1, .55)], [1, mixHex(P.night0, P.night1, .6)]]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, 14); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .5); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = GOLD.line; ctx.lineWidth = 3.5; const c = 30;
  for (const [qx, qy, sx, sy] of [[0, 0, 1, 1], [w, 0, -1, 1], [0, h, 1, -1], [w, h, -1, -1]]) { if (qy > 0 && fu < 1) continue; ctx.beginPath(); ctx.moveTo(qx + sx * c, qy); ctx.lineTo(qx, qy); ctx.lineTo(qx, qy + sy * c); ctx.stroke(); }
  // header: the title in spaced gold caps, a gold rule, a small cream sub line
  if (o.title) {
    const tu = rise(span(u, .2, .6)), ts = o.titleSize ?? 30;
    maskLine(ctx, [[o.title, .9]], w / 2, head * .52, ts, tu, { serif: false, weight: 700, col: GOLD.text, glow: true, align: 'center' });
    goldSpan(ctx, [[w * .12, head * .74], [w * .88, head * .74]], 0, smooth(span(u, .3, .7)), { w: 1.2, spark: false });
    if (o.sub) maskLine(ctx, [[o.sub, 0]], w / 2, head * .93, 18, rise(span(u, .35, .7)), { serif: false, weight: 600, col: P.halo2, glow: false, align: 'center' });
  }
  const out = [];
  rows.forEach((r, i) => {
    const ry = head + i * rowH, ru = span(u, .3 + i * .5 / Math.max(1, rows.length), .55 + i * .5 / Math.max(1, rows.length));
    const rr = { ...r, flip: Math.min(r.flip ?? 1, ru), statusFlip: Math.min(r.statusFlip ?? 1, ru) };
    if (u < 1 && ru <= 0) { out.push({ x: x + 20 * s, y: y + ry * s, w: (w - 40) * s, h: rowH * s }); return; }
    boardRow(ctx, t, 20, ry, w - 40, rowH, rr, { cells: o.cells ?? 14, size: o.rowSize });
    out.push({ x: x + 20 * s, y: y + ry * s, w: (w - 40) * s, h: rowH * s });
  });
  ctx.restore();
  return { x, y, w: w * s, h: h * s, rows: out };
}
// a ledger column (the race in the hook, lists anywhere): rows[i] drawn at y0 + i * rowH; rows off screen are skipped; o.vel = rows/s of
// a scroll (adds a short vertical smear above it: motion blur, no strobing). Returns the row rect function.
export function ledger(ctx, t, x, y0, w, rowH, rows, o = {}) {
  const m = ctx.getTransform(), ky = Math.hypot(m.c, m.d), H2 = ctx.canvas.height, vel = o.vel ?? 0;
  const smear = Math.min(rowH * .9, Math.abs(vel) * rowH / 30) * Math.sign(vel);
  rows.forEach((r, i) => {
    if (!r) return;
    const y = y0 + i * rowH, sy = m.f + y * ky; if (sy > H2 + rowH * ky || sy + rowH * ky * 2 < 0) return;
    if (Math.abs(smear) > 2) for (const [f, a] of [[1, .22], [.5, .4]]) boardRow(ctx, t, x, y + smear * f, w, rowH, { ...r, a: (r.a ?? 1) * a }, o);
    boardRow(ctx, t, x, y, w, rowH, r, o);
  });
  return (i) => ({ x, y: y0 + i * rowH, w, h: rowH });
}

// ---------------------------------------------------------------- THE MACHINE: a ring of light (never a robot, never a brain)
// o: { u 0..1 (forms: the rings open from the centre), lit 0..1 (the disc's light), think 0..1 (the rings pulse inward), a, dashed (forecast) }
export function ring(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const e = expoOut(u), lit = clamp(o.lit ?? 1), th = clamp(o.think ?? 0), a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, r * 2.8 * e, .32 * lit, COOL.halo, COOL.core);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, x, y, r * .7 * e, [[0, rgba('#ffffff', .95 * lit)], [.3, rgba(COOL.core, .75 * lit)], [.75, rgba(COOL.body, .25 * lit)], [1, rgba(COOL.body, 0)]]);
  ctx.beginPath(); ctx.arc(x, y, r * .7 * e, 0, 6.29); ctx.fill(); ctx.restore();
  for (let k = 0; k < 3; k++) {
    const ph = .5 - .5 * Math.cos(Math.PI * 2 * (t * .55 + k / 3)), pull = th * .1 * ph,   // smooth inward breath (was a sawtooth: the ring snapped back once per cycle)
    rr = r * (.6 + .24 * k) * e * (1 - pull), rot = t * (k % 2 ? -.22 : .16) + k;
    ctx.strokeStyle = rgba(k === 0 ? COOL.core : COOL.line, (.85 - k * .18) * (o.dashed ? .7 : 1)); ctx.lineWidth = r * (.035 - k * .008);
    if (o.dashed) ctx.setLineDash([r * .12, r * .1]);
    const nArc = 3 + k, gapA = .35;
    for (let j = 0; j < nArc; j++) { const a0 = rot + j * Math.PI * 2 / nArc, a1 = a0 + Math.PI * 2 / nArc - gapA; ctx.beginPath(); ctx.arc(x, y, rr, a0, a0 + (a1 - a0) * e); ctx.stroke(); }
    ctx.setLineDash([]);
  }
  ctx.restore();
}
// a head in profile (cream line, facing right), (x, y) = head centre, s = head height. o: { u (trail), light 0..1 (a warm light inside) }
const HEAD_PTS = E.catmull([[-.16, .62], [-.2, .36], [-.36, .14], [-.42, -.14], [-.32, -.44], [-.06, -.58], [.2, -.5], [.32, -.3], [.35, -.12], [.37, -.05], [.49, .08], [.4, .14], [.42, .21], [.38, .26], [.41, .31], [.36, .42], [.2, .47], [.14, .62]], 6);
export function headProfile(ctx, t, x, y, s, o = {}) {
  const pts = HEAD_PTS.map(([u, v]) => [x + u * s, y + v * s]);
  if ((o.light ?? 0) > 0) halo(ctx, x - .02 * s, y - .18 * s, s * .42, .7 * o.light, GOLD.halo, GOLD.core);
  outline(ctx, [pts], o.u ?? 1, { w: o.w ?? 3, col: o.col });
  return { brain: [x - .02 * s, y - .18 * s] };
}
// a stylus of light (the pen the machine invents with; later the one you pick up): (x, y) = tip, ang = direction the tip points, s = length
export function stylus(ctx, t, x, y, ang, s, o = {}) {
  const dx = -Math.cos(ang) * s, dy = -Math.sin(ang) * s, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  for (const [k, al, c] of [[5, .22, o.cool ? COOL.halo : GOLD.halo], [2.2, .9, o.cool ? COOL.line : GOLD.body], [.9, 1, GOLD.core]]) { ctx.strokeStyle = c; ctx.globalAlpha = a * al; ctx.lineWidth = (o.w ?? 5) * k; ctx.beginPath(); ctx.moveTo(x + dx, y + dy); ctx.lineTo(x + dx * .12, y + dy * .12); ctx.stroke(); }
  ctx.restore();
  halo(ctx, x, y, (o.w ?? 5) * 9, .9 * a, o.cool ? COOL.halo : GOLD.halo, GOLD.core);
}

// ---------------------------------------------------------------- LINE ICONS (cream outlines; o.dashed = imagined, o.gold = real)
// kinds: bulb, phone, screen, plug, battery, house, radiator, pylon, plant (power plant), compass, drop, bolt, sun, flask
const ICON = {
  bulb: () => [[...circlePts(0, -.28, .5, Math.PI * .72, Math.PI * 2.28, 30), [.2, .42], [-.2, .42], [-.2, .2]], [[-.22, .55], [.22, .55]], [[-.18, .68], [.18, .68]], [[-.08, .8], [.08, .8]], [[-.12, -.05], [0, -.3], [.12, -.05]]],
  phone: () => [rectPts(-.42, -.82, .84, 1.64, .14), [[-.12, -.68], [.12, -.68]], circlePts(0, .64, .06, 0, 6.29, 10)],
  screen: () => [rectPts(-1, -.62, 2, 1.12, .06), [[0, .5], [0, .76]], [[-.36, .78], [.36, .78]]],
  plug: () => [rectPts(-.34, -.22, .68, .66, .12), [[-.15, -.22], [-.15, -.62]], [[.15, -.22], [.15, -.62]], [[0, .44], [0, .62], [.18, .8], [.4, .82]]],
  battery: () => [rectPts(-.72, -.36, 1.34, .72, .08), [[.62, -.15], [.74, -.15], [.74, .15], [.62, .15]]],
  house: () => [[[-.8, .72], [-.8, -.08], [0, -.8], [.8, -.08], [.8, .72], [-.8, .72]], [[-.2, .72], [-.2, .26], [.2, .26], [.2, .72]]],
  radiator: () => [...[-.6, -.3, 0, .3, .6].map((x) => rectPts(x - .11, -.55, .22, 1.1, .1)), [[-.75, .45], [.75, .45]]],
  pylon: () => [[[-.5, .9], [-.12, -.85], [.12, -.85], [.5, .9]], [[-.65, -.45], [.65, -.45]], [[-.45, -.1], [.45, -.1]], [[-.32, .3], [.32, -.45], [-.32, -.45], [.32, .3]]],
  plant: () => [[[-.9, .7], [-.9, .05], [-.4, .05], [-.4, .7]], [[-.3, .7], [-.22, -.3], [-.32, -.7], [.32, -.7], [.22, -.3], [.3, .7]], [[.4, .7], [.4, -.1], [.9, -.1], [.9, .7]], [[-1, .7], [1, .7]]],
  compass: () => [circlePts(0, 0, .8, 0, 6.29, 40), [[0, -.6], [.14, 0], [0, .6], [-.14, 0], [0, -.6]]],
  drop: () => [[[0, -.8], [.42, -.1], [.5, .25], [.3, .62], [0, .75], [-.3, .62], [-.5, .25], [-.42, -.1], [0, -.8]]],
  bolt: () => [[[.15, -.85], [-.4, .1], [0, .1], [-.15, .85], [.45, -.15], [.05, -.15], [.15, -.85]]],
  sun: () => [circlePts(0, 0, .42, 0, 6.29, 30), ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = k * Math.PI / 4; return [[Math.cos(a) * .6, Math.sin(a) * .6], [Math.cos(a) * .85, Math.sin(a) * .85]]; })],
  flask: () => [[[-.18, -.8], [-.18, -.25], [-.6, .6], [-.5, .78], [.5, .78], [.6, .6], [.18, -.25], [.18, -.8]], [[-.3, -.8], [.3, -.8]]],
};
export const ICONS77 = Object.keys(ICON);
export function iconPolys(kind, x, y, s, rot = 0) { const c = Math.cos(rot), sn = Math.sin(rot); return ICON[kind]().map((pl) => pl.map(([u, v]) => [x + (u * c - v * sn) * s, y + (u * sn + v * c) * s])); }
export function lineIcon(ctx, kind, x, y, s, o = {}) { outline(ctx, iconPolys(kind, x, y, s, o.rot ?? 0), o.u ?? 1, o); }

// ---------------------------------------------------------------- PEOPLE (77)
// an inventor at a bench (indigo, never yellow): (x, y) feet, h height. o: { lit 0..1 (the bench lamp; it lights the figure's rim),
// sink 0..1 (sinks behind its ground), dir, seed }
export function inventor(ctx, t, x, y, h, o = {}) {
  const lit = clamp(o.lit ?? 0), dir = o.dir ?? 1, sk = sineIO(clamp(o.sink ?? 0));
  ctx.save(); ctx.beginPath(); ctx.rect(x - h * 1.2, y - h * 1.4, h * 2.4, h * 1.4 + 2); ctx.clip(); ctx.translate(0, sk * h * 1.15);
  const bx = x + dir * h * .16, bw = h * .62, by = y - h * .44;
  person(ctx, x - dir * h * .12, y, h, { dir, lean: .1, look: -.25, armR: [1.55, 1.95], armL: [1.35, 1.75], rim: mixHex(P.blue0, GOLD.line, lit), light: .4 + .6 * lit });
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .3 + .3 * lit); ctx.fillRect(dir > 0 ? bx : bx - bw, by, bw, h * .045);
  ctx.fillRect((dir > 0 ? bx : bx - bw) + bw * .08, by, h * .03, h * .44); ctx.fillRect((dir > 0 ? bx + bw : bx) - bw * .08 - h * .03, by, h * .03, h * .44);
  const lx = x + dir * h * .66, ly = by - h * .28;   // the bench lamp: a bent arm and a shade
  ctx.strokeStyle = mixHex(P.blue1, P.cream, .25); ctx.lineWidth = h * .018; ctx.beginPath(); ctx.moveTo(lx, by); ctx.lineTo(lx - dir * h * .06, by - h * .17); ctx.lineTo(lx - dir * h * .17, ly); ctx.stroke();
  ctx.fillStyle = mixHex(P.blue1, P.cream, .3); ctx.beginPath(); ctx.moveTo(lx - dir * h * .12, ly - h * .05); ctx.lineTo(lx - dir * h * .26, ly + h * .06); ctx.lineTo(lx - dir * h * .1, ly + h * .08); ctx.closePath(); ctx.fill();
  if (lit > 0) { halo(ctx, lx - dir * h * .19, ly + h * .08, h * .9, .85 * lit, GOLD.halo, GOLD.core); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, lx - dir * h * .2, by, h * .5, [[0, rgba(GOLD.body, .25 * lit)], [1, rgba(GOLD.body, 0)]]); ctx.fillRect(x - h, by - h * .5, h * 2, h * .6); ctx.restore(); }
  ctx.restore();
  return { lamp: [lx - dir * h * .19, ly + h * .08] };
}
// many hands with lights (A.01, the close): o = { n, x0, x1, y (the wrist line, the bottom), s (palm length), u 0..1 (they rise, staggered
// from o.from (x)), light 0..1, seed }
export function hands(ctx, t, o = {}) {
  const n = o.n ?? 9, r = prng(o.seed ?? 17), u = clamp(o.u ?? 1), y = o.y ?? H + 40, s = o.s ?? 110;
  for (let i = 0; i < n; i++) {
    const f = (i + .5) / n, x = lerp(o.x0 ?? 120, o.x1 ?? W - 120, f) + (r() - .5) * 40, d = Math.abs(x - (o.from ?? W / 2)) / W;
    const k = expoOut(span(u, d * .6, d * .6 + .4)), ss = s * (.8 + r() * .35), ang = -HPI + (r() - .5) * .35 + .03 * Math.sin(t * .8 + i);
    if (k <= 0) { r(); continue; }
    const wy = y + (1 - k) * ss * 3.2, m = E.handMatrix(x, wy, ang, ss, r() < .5 ? 1 : -1);
    E.lightHand(ctx, m, t, { pose: 'open', a: 1 });
    const tip = E.applyM(m, 1.6, 0); if ((o.light ?? 1) > 0) halo(ctx, tip[0], tip[1] - ss * .3, ss * .9, .7 * (o.light ?? 1) * k, GOLD.halo, GOLD.core);
  }
}
// one human hand holding the stylus (the writing hand of the harvest): (x, y) = the stylus tip. o: { s (palm length 120), ang (-2.3) }
export function writingHand(ctx, t, x, y, o = {}) {
  const s = o.s ?? 120, ang = o.ang ?? -2.3, m = E.handMatrix(x - Math.cos(ang) * s * 1.55, y - Math.sin(ang) * s * 1.55, ang, s, 1);
  stylus(ctx, t, x, y, ang, s * 1.3, { w: s * .035 });
  E.lightHand(ctx, m, t, { pose: 'hold' });
}

// ---------------------------------------------------------------- YOUR ROOM (the hook; harvest 2.01 / 2.14): a room at night, NOT a kitchen
// Local design space 1920 × 1080 (draw it inside look()). A pendant bulb, you standing under it with your phone, a screen on the wall in
// front of you, a side table with a lamp-less top (the power bill lies there in line 1). Lights: o.bulb / o.phone / o.screen 0..1;
// 0.2 ≈ an ember (the carrier light). The room is only as visible as its lights make it (o.amb = ambient 0..1).
export const ROOM = { bulb: [720, 286], cord: 30, you: [720, 884], youH: 330, screen: { x: 1170, y: 286, w: 540, h: 300 }, table: { x: 260, y: 884, w: 220, h: 230 }, floor: 884 };
let DARK = null;
export function room(ctx, t, o = {}) {
  const R = ROOM, bulb = clamp(o.bulb ?? 0), ph = clamp(o.phone ?? 0), sc = clamp(o.screen ?? 0), amb = clamp(o.amb ?? .12), B = o.bulbAt ?? R.bulb;   // o.bulbAt: a swinging bulb
  const lightAll = Math.min(1, bulb * .9 + sc * .5 + ph * .2 + amb);
  // walls + floor (they reach far up and down so camera tilts never see an edge)
  ctx.fillStyle = lin(ctx, 0, -1400, 0, R.floor, [[0, NIGHT.top], [.55, mixHex(P.night1, P.ind1, .4)], [1, mixHex(P.ind1, P.blue1, .25)]]); ctx.fillRect(-900, -1400, W + 1800, R.floor + 1400);
  ctx.fillStyle = rgba(P.blue1, .2); for (let px = 120; px < W; px += 330) ctx.fillRect(px, -200, 2, R.floor + 200);   // faint wall panels
  ctx.fillStyle = lin(ctx, 0, R.floor, 0, R.floor + 400, [[0, mixHex(P.ind0, P.blue1, .3)], [1, P.night0]]); ctx.fillRect(-900, R.floor, W + 1800, 900);
  ctx.fillStyle = rgba(P.blue1, .55); ctx.fillRect(-900, R.floor - 1, W + 1800, 2);
  // the screen on the wall (dark glass; lit: cool-white light with soft shapes)
  const S = R.screen;
  ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.beginPath(); ctx.roundRect(S.x - 10, S.y - 10, S.w + 20, S.h + 20, 10); ctx.fill();
  ctx.fillStyle = lin(ctx, S.x, S.y, S.x + S.w, S.y + S.h, [[0, mixHex(P.night1, COOL.body, .75 * sc)], [1, mixHex(P.night0, COOL.deep, .8 * sc)]]); ctx.fillRect(S.x, S.y, S.w, S.h);
  if (sc > 0) { ctx.save(); ctx.globalAlpha *= sc; ctx.fillStyle = rgba(COOL.core, .35); ctx.fillRect(S.x + 40, S.y + 40, S.w * .42, S.h * .38); ctx.fillStyle = rgba(COOL.core, .18); ctx.fillRect(S.x + 40, S.y + S.h * .62, S.w * .7, 16); ctx.fillRect(S.x + 40, S.y + S.h * .74, S.w * .5, 16); ctx.restore(); }
  // the side table
  const Tb = R.table; ctx.fillStyle = mixHex(P.ind2, P.blue1, .35); ctx.fillRect(Tb.x, Tb.y - Tb.h, Tb.w, 14); ctx.fillRect(Tb.x + 18, Tb.y - Tb.h, 10, Tb.h); ctx.fillRect(Tb.x + Tb.w - 28, Tb.y - Tb.h, 10, Tb.h);
  if (o.bill) o.bill(ctx, Tb.x + Tb.w / 2, Tb.y - Tb.h);
  // you, under the bulb, the phone in your right hand
  const hands = du(ctx, R.you[0] + (o.youDx ?? 0), R.you[1], R.youH, { dir: 1, armR: [.95, 2.45], look: o.look ?? .35, light: .5 + .5 * lightAll, walk: o.walk, ...(o.you ?? {}) });
  const hp = hands?.R ?? [R.you[0] + 60, R.you[1] - R.youH * .55];
  // darkness: everything is lit only by its lights (an offscreen layer with holes where the lights are)
  const m = ctx.getTransform(), cw = ctx.canvas.width, ch = ctx.canvas.height;
  if (!DARK || DARK.width !== cw || DARK.height !== ch) DARK = createCanvas(cw, ch);
  const g = DARK.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, cw, ch);
  g.fillStyle = rgba(P.night0, .94 - .3 * amb); g.fillRect(0, 0, cw, ch); g.setTransform(m); g.globalCompositeOperation = 'destination-out';
  const hole = (x, y, r, a) => { if (a <= 0) return; g.fillStyle = rad(g, x, y, r, [[0, `rgba(0,0,0,${a})`], [.55, `rgba(0,0,0,${a * .55})`], [1, 'rgba(0,0,0,0)']]); g.fillRect(x - r, y - r, r * 2, r * 2); };
  hole(B[0], B[1] + 260, 900 * bulb + 60, Math.min(1, bulb * 1.15));
  hole(S.x + S.w / 2, S.y + S.h / 2 + 120, 720 * sc + 40, .9 * sc);
  hole(hp[0], hp[1] - 40, 260 * ph + 20, .85 * ph);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(DARK, 0, 0); ctx.restore();
  // the lights themselves, on top: the bulb (cord, glass, cone), the phone glow, the screen spill
  ctx.strokeStyle = rgba(P.halo2, .35 + .4 * bulb); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R.bulb[0], R.cord); ctx.lineTo(B[0], B[1] - 34); ctx.stroke();
  ctx.fillStyle = mixHex(P.blue1, P.cream, .2); if (o.bulbGlass !== false) ctx.fillRect(B[0] - 11, B[1] - 40, 22, 16);
  if (bulb > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, B[1], 0, R.floor + 30, [[0, rgba(GOLD.hot, .2 * bulb)], [1, rgba(GOLD.body, .02 * bulb)]]);
    ctx.beginPath(); ctx.moveTo(B[0] - 26, B[1]); ctx.lineTo(B[0] + 26, B[1]); ctx.lineTo(B[0] + 330, R.floor + 30); ctx.lineTo(B[0] - 330, R.floor + 30); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  if (o.bulbGlass !== false) bulbGlass(ctx, B[0], B[1], 26, bulb);
  if (ph > 0) { halo(ctx, hp[0] + 6, hp[1] - 16, 120 * ph, .75 * ph, COOL.halo, COOL.core); }
  ctx.save(); ctx.translate(hp[0] + 4, hp[1] - 14); ctx.rotate(-.35); ctx.fillStyle = mixHex(P.night0, COOL.core, .85 * ph); ctx.beginPath(); ctx.roundRect(-8, -15, 16, 28, 3); ctx.fill(); ctx.restore();
  if (sc > 0) halo(ctx, S.x + S.w / 2, S.y + S.h / 2, S.w * .9, .35 * sc, COOL.halo, COOL.core);
  return { hand: hp, bulb: B, screen: S };
}
// a pendant bulb's glass: (x, y) glass centre, r radius, lit 0..1 (0.2 ≈ ember)
export function bulbGlass(ctx, x, y, r, lit) {
  ctx.fillStyle = rad(ctx, x, y, r, [[0, mixHex(P.blue1, P.core0, lit)], [.7, mixHex(P.ind1, GOLD.hot, lit * .9)], [1, mixHex(P.ind1, GOLD.body, lit * .6)]]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  if (lit > 0) halo(ctx, x, y, r * (3 + 9 * lit), .95 * lit, GOLD.halo, GOLD.core);
}

// ---------------------------------------------------------------- THE DOT PUZZLE (Erdős unit distances): a page with dots
// dotSheet(ctx, t, x, y, w, h, o): (x, y, w, h) the page. o: { grow 0..1 (unfolds upward from a row of height o.h0 at its bottom; the gold of
// the row cools into the page), dots 0..1, pairs 0..1 (equal-distance pairs light as gold strokes, one after another), line 0..1 (the one
// bright line: the found answer), text (small caps line(s) at the bottom), textU, mini }. Returns { dots (page coords), rect }.
const DOTS = (() => {
  const pts = [], r = prng(1946), ang = .21;
  for (let j = -2; j <= 2; j++) for (let i = -3; i <= 3; i++) { const x = i + j / 2, y = j * Math.sqrt(3) / 2; if (Math.hypot(x, y) > 2.75) continue; if (r() < .16) continue; pts.push([x * Math.cos(ang) - y * Math.sin(ang), x * Math.sin(ang) + y * Math.cos(ang)]); }
  const pairs = []; for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) if (Math.abs(Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]) - 1) < 1e-6) pairs.push([a, b]);
  const rr = prng(90); pairs.sort(() => rr() - .5);
  let far = [0, 1], best = 0; for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) { const d = Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]); if (d > best) { best = d; far = [a, b]; } }
  return { pts, pairs, far };
})();
export function dotSheet(ctx, t, x, y, w, h, o = {}) {
  const gr = expoOut(clamp(o.grow ?? 1)), h0 = o.h0 ?? 60, hh = lerp(h0, h, gr), yy = y + h - hh, gold = 1 - smooth(span(o.grow ?? 1, .15, .8));
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(x + 8, yy + 12, w, hh, 10); ctx.fill();
  ctx.fillStyle = lin(ctx, x, yy, x + w, yy + hh, [[0, mixHex(mixHex(P.night1, P.ind1, .7), GOLD.mid, gold * .8)], [1, mixHex(mixHex(P.night0, P.ind1, .45), GOLD.shade, gold * .8)]]);
  ctx.beginPath(); ctx.roundRect(x, yy, w, hh, 10); ctx.fill();
  ctx.strokeStyle = mixHex(rgba(CREAM, .8), GOLD.line, gold); ctx.lineWidth = 2; ctx.stroke();
  // the folded corner (it is a page)
  const fc = 46 * gr; ctx.fillStyle = mixHex(P.ind1, P.blue1, .6); ctx.beginPath(); ctx.moveTo(x + w - fc, yy); ctx.lineTo(x + w, yy + fc); ctx.lineTo(x + w - fc, yy + fc); ctx.closePath(); ctx.fill();
  // fold creases while it unfolds
  if (gr < 1) { ctx.strokeStyle = rgba(CREAM, .25 * (1 - gr)); ctx.lineWidth = 1.5; for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x + 10, yy + hh * k / 3); ctx.lineTo(x + w - 10, yy + hh * k / 3); ctx.stroke(); } }
  ctx.beginPath(); ctx.roundRect(x, yy, w, hh, 10); ctx.clip();
  const txtH = o.text ? 92 : 0, cx = x + w / 2, cy = y + (h - txtH) / 2 + 6, unit = Math.min(w, h - txtH) * .17;
  const D = DOTS.pts.map(([u, v]) => [cx + u * unit, cy + v * unit]);
  const du_ = clamp(o.dots ?? 1), pu = clamp(o.pairs ?? 0), lu = clamp(o.line ?? 0);
  DOTS.pairs.forEach(([a, b], i) => { const k = span(pu, i / DOTS.pairs.length * .75, i / DOTS.pairs.length * .75 + .25); if (k > 0) goldSpan(ctx, [D[a], D[b]], 0, smooth(k), { w: 2.2, spark: k < 1 }); });
  if (lu > 0) { const [a, b] = DOTS.far; goldSpan(ctx, [D[a], D[b]], 0, smooth(lu), { w: 3.6 }); halo(ctx, D[a][0], D[a][1], 40, .6 * lu); halo(ctx, D[b][0], D[b][1], 40, .6 * lu * span(lu, .8, 1)); }
  D.forEach(([px, py], i) => { const k = expoOut(span(du_, i / D.length * .6, i / D.length * .6 + .4)); if (k <= 0) return; ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(px, py, 6.5 * k, 0, 6.29); ctx.fill(); });
  if (o.text && (o.textU ?? 1) > 0) { const ls = Array.isArray(o.text) ? o.text : [o.text]; ls.forEach((l, i) => maskLine(ctx, [[l, 0]], cx, y + h - txtH + 34 + i * 30, 22, rise(span(o.textU ?? 1, i * .2, .7 + i * .2)), { serif: false, weight: 600, col: P.halo2, glow: false, align: 'center' })); }
  ctx.restore();
  return { dots: D, rect: { x, y: yy, w, h: hh } };
}
// a roll counter (two or three drums): (x, y) = left edge and the digits' vertical centre. value (e.g. 80). o: { u 0..1 (0 = blank drums
// '–', the roll lands heavy at 1 with a small overshoot), label ('YEARS'), spins (3), size }. Returns { w, land (0..1 how settled) }.
export function rollCounter(ctx, t, x, y, size, value, o = {}) {
  const digits = String(value).split('').map(Number), n = digits.length, dw = size * .66, dh = size * 1.12, gap = size * .1, u = clamp(o.u ?? 1), spins = o.spins ?? 3;
  ctx.save();
  digits.forEach((dg, i) => {
    const dx = x + i * (dw + gap), ui = span(u, i * .12, .88 + i * .12), e = backOut(ui, 1.1), p = dg - (spins + i) * 10 * (1 - e);
    ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.beginPath(); ctx.roundRect(dx, y - dh / 2, dw, dh, 10); ctx.fill();
    ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.roundRect(dx, y - dh / 2, dw, dh, 10); ctx.clip();
    if (ui <= 0) { E.glowText(ctx, '–', dx + dw / 2, y + size * .34, { size, serif: true, align: 'center', col: rgba(CREAM, .45), glow: false }); }
    else {
      const base = Math.floor(p), f = p - base;
      for (let k = -1; k <= 1; k++) { const d = (((base + k) % 10) + 10) % 10, yy = y + (k - f) * size * .95 * -1; const near = 1 - Math.min(1, Math.abs(k - f)); E.glowText(ctx, String(d), dx + dw / 2, yy + size * .34, { size, serif: true, align: 'center', col: mixHex(CREAM, GOLD.text, near), glow: near > .8 && ui >= 1 }); }
      ctx.fillStyle = lin(ctx, 0, y - dh / 2, 0, y + dh / 2, [[0, rgba(P.night0, .8)], [.3, rgba(P.night0, 0)], [.7, rgba(P.night0, 0)], [1, rgba(P.night0, .8)]]); ctx.fillRect(dx, y - dh / 2, dw, dh);
    }
    ctx.restore();
  });
  const w = n * dw + (n - 1) * gap;
  if (o.label) maskLine(ctx, [[o.label, 0]], x + w + size * .25, y + size * .3, size * .62, rise(o.labelU ?? 1), { serif: true, col: CREAM, glow: false });
  ctx.restore();
  return { w, land: span(u, .85, 1) };
}

// ---------------------------------------------------------------- GOOD'S SENTENCE: the band (half promise, half condition)
// band(ctx, t, cx, cy, w, h, o): a long panel in two halves. Left: the promise (cream serif, types with o.type, turns gold with o.gold).
// Right: the condition: until o.reveal it is only word-shaped bars, then the dashed cream COVER slides over it (o.cover 0..1 from the right)
// and later falls (o.coverOff 0..1, falls down and away). o.u 0..1: the band stretches out of an empty row (w0 × h0, gold glow) into w × h.
export const GOOD_FRONT = 'the first ultraintelligent machine is the last invention that man need ever make,';
export const GOOD_BACK = 'provided that the machine is docile enough to tell us how to keep it under control.';
function wrapText(s, size, maxW) { const ws = s.split(' '), lines = []; let cur = ''; for (const wd of ws) { const nx = cur ? cur + ' ' + wd : wd; if (cur && measure(nx, size, true) > maxW) { lines.push(cur); cur = wd; } else cur = nx; } if (cur) lines.push(cur); return lines; }
export function band(ctx, t, cx, cy, w, h, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)), w0 = o.w0 ?? 560, h0 = o.h0 ?? 64, bw = lerp(w0, w, u), bh = lerp(h0, h, u), x = cx - bw / 2, y = cy - bh / 2;
  const g = clamp(o.gold ?? 0), emptyGlow = clamp(o.empty ?? (1 - span(o.u ?? 1, .3, 1))), size = o.size ?? 40, pad = 44;
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(x + 8, y + 12, bw, bh, 14); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + bh, [[0, mixHex(P.night1, P.ind1, .6)], [1, mixHex(P.night0, P.night1, .6)]]); ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 14); ctx.fill();
  if (emptyGlow > 0) { const b = .82 + .18 * Math.sin(t * 1.4); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= emptyGlow; ctx.fillStyle = lin(ctx, x, 0, x + bw, 0, [[0, rgba(GOLD.halo, .34 * b)], [.5, rgba(GOLD.body, .5 * b)], [1, rgba(GOLD.halo, .34 * b)]]); ctx.fill(); ctx.restore(); halo(ctx, cx, cy, bw * .55, .3 * emptyGlow, GOLD.halo, GOLD.core); }
  if (g > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); ctx.roundRect(x, y, bw / 2, bh, [14, 0, 0, 14]); ctx.fillStyle = lin(ctx, x, 0, x + bw / 2, 0, [[0, rgba(GOLD.halo, .3 * g)], [1, rgba(GOLD.body, .16 * g)]]); ctx.fill(); ctx.restore(); halo(ctx, x + bw * .25, cy, bw * .35, .28 * g, GOLD.halo, GOLD.core); }
  ctx.strokeStyle = mixHex(rgba(GOLD.line, .55), GOLD.line, Math.max(g, emptyGlow)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 14); ctx.stroke();
  const half = bw / 2, out = { x, y, w: bw, h: bh, front: { x, y, w: half, h: bh }, back: { x: x + half, y, w: half, h: bh } };
  if (u < .6) { ctx.restore(); return out; }
  const iu = span(o.u ?? 1, .6, 1);
  trailCream(ctx, [[cx, y + 18], [cx, y + bh - 18]], 0, smooth(iu), { w: 1.5, a: .6 });
  // the promise (types left → right; a gold caret at the typing point)
  const fl = wrapText(GOOD_FRONT, size, half - pad * 2), bl = wrapText(GOOD_BACK, size, half - pad * 2), lh = size * 1.25;
  const nF = GOOD_FRONT.length, nB = GOOD_BACK.length, ty = clamp(o.type ?? 1) * (nF + nB);
  let k = 0, caret = null;
  const fy0 = cy - (fl.length - 1) * lh / 2 + size * .32;
  fl.forEach((ln, i) => {
    const vis = Math.max(0, Math.min(ln.length, ty - k)), s = ln.slice(0, Math.ceil(vis));
    if (s) E.glowText(ctx, s, x + pad, fy0 + i * lh, { size, serif: true, col: mixHex(CREAM, GOLD.text, g), glow: g > .3 });
    if (vis > 0 && vis < ln.length) caret = [x + pad + measure(s, size, true) + 4, fy0 + i * lh];
    k += ln.length + 1;
  });
  // the condition: word-shaped bars until o.reveal; the real words under them light when revealed
  const rv = clamp(o.reveal ?? 0), by0 = cy - (bl.length - 1) * lh / 2 + size * .32;
  k = nF;
  bl.forEach((ln, i) => {
    let xx = x + half + pad; const yy = by0 + i * lh;
    for (const wd of ln.split(' ')) {
      const wv = clamp(ty - k), ww = measure(wd, size, true);
      if (wv > 0) {
        if (rv < 1) { ctx.fillStyle = rgba(CREAM, .3 * (1 - rv)); ctx.beginPath(); ctx.roundRect(xx, yy - size * .52, ww * wv, size * .5, size * .25); ctx.fill(); }
        if (rv > 0) E.glowText(ctx, wd, xx, yy, { size, serif: true, col: mixHex(CREAM, GOLD.text, clamp(o.hiBack ?? 0)), glow: false, a: rv });
        if (wv < 1) caret = [xx + ww * wv + 4, yy];
      }
      xx += ww + measure(' ', size, true); k += wd.length + 1;
    }
  });
  if (caret && (o.type ?? 1) < 1) { ctx.fillStyle = GOLD.body; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 12; ctx.fillRect(caret[0], caret[1] - size * .78, 3, size * .9); ctx.shadowBlur = 0; }
  // the cover (dashed cream outline = still unknown) slides in from the right and later falls
  const cv = clamp(o.cover ?? 0), off = clamp(o.coverOff ?? 0);
  if (cv > 0 && off < 1) {
    const e = quartIO(cv), dx = (1 - e) * (half + 120), fall = expoIn(off);
    ctx.save(); ctx.translate(x + half + half / 2 + dx, cy + fall * 700); ctx.rotate(fall * .35);
    const cw = half - 14, chh = bh - 14;
    ctx.fillStyle = mixHex(P.night0, P.ind0, .45); ctx.beginPath(); ctx.roundRect(-cw / 2, -chh / 2, cw, chh, 10); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(CREAM, .08); ctx.lineWidth = 2; for (let q = -cw; q < cw; q += 26) { ctx.beginPath(); ctx.moveTo(q, -chh / 2); ctx.lineTo(q + chh, chh / 2); ctx.stroke(); } ctx.restore();
    ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.5; ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 14; ctx.beginPath(); ctx.roundRect(-cw / 2, -chh / 2, cw, chh, 10); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
    out.cover = { x: x + half + 7 + dx, y: y + 7 + fall * 700, w: cw, h: chh };
  }
  ctx.restore();
  return out;
}

// ---------------------------------------------------------------- THE TEST STAMP: HAS THE INVENTING BEGUN?
// a round stamp (cream rings, the question round the rim, ? in the centre; o.tick 0..1 draws a gold tick and turns it gold). o.u 0..1
// drops it in heavy (from 1.3× with a squash on landing). (x, y) centre, r radius.
export function testStamp(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = backOut(u, .8), s = lerp(1.35, 1, k), tk = clamp(o.tick ?? 0), col = mixHex(CREAM, GOLD.line, tk), text = (o.text ?? 'HAS THE INVENTING BEGUN? · ').toUpperCase();
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 - .05 * Math.sin(Math.PI * span(u, .7, 1)))); ctx.rotate(o.rot ?? -.12);
  ctx.globalAlpha *= clamp(u * 4);
  ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.29); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = r * .045; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.29); ctx.stroke();
  ctx.lineWidth = r * .02; ctx.beginPath(); ctx.arc(0, 0, r * .7, 0, 6.29); ctx.stroke();
  const fs = r * .14; ctx.font = `700 ${fs}px Inter`; ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const n = text.length; for (let i = 0; i < n; i++) { ctx.save(); ctx.rotate(-HPI + i / n * Math.PI * 2 + t * .05); ctx.translate(0, -r * .85); ctx.fillText(text[i], 0, 0); ctx.restore(); }
  if (tk <= 0) E.glowText(ctx, '?', 0, r * .2, { size: r * .7, serif: true, align: 'center', col: CREAM, glow: false });
  else { ctx.rotate(-(o.rot ?? -.12)); goldSpan(ctx, [[-r * .32, r * .02], [-r * .08, r * .26], [r * .36, -r * .28]], 0, smooth(tk), { w: r * .06 }); }
  ctx.restore();
}
// a control slider (line 4): track, ticks, a gold knob at o.v 0..1, o.label caps under it
export function slider(ctx, t, x, y, w, o = {}) {
  const v = clamp(o.v ?? .5), u = clamp(o.u ?? 1); if (u <= 0) return;
  trailCream(ctx, [[x, y], [x + w, y]], 0, smooth(u), { w: 3 });
  for (let i = 0; i <= 10; i++) { const k = span(u, i / 12, i / 12 + .2); if (k > 0) { ctx.fillStyle = rgba(CREAM, .6 * k); ctx.fillRect(x + w * i / 10 - 1, y - (i % 5 ? 8 : 14), 2, i % 5 ? 16 : 28); } }
  if (u > .6) { const kx = x + w * v; halo(ctx, kx, y, 60, .7, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.roundRect(kx - 14, y - 26, 28, 52, 10); ctx.fill(); ctx.strokeStyle = GOLD.core; ctx.lineWidth = 2; ctx.stroke(); }
  if (o.label) capsLabel(ctx, o.label, x + w / 2, y + 62, span(u, .5, 1));
}

// ---------------------------------------------------------------- LINE 1 · ENERGY: the hydrogen cell with its catalyst plate
// catalyst(ctx, t, x, y, s, o): (x, y) = the cell's bottom centre, s = its height. o: { u 0..1 (the cell draws), plate 0..1 (the catalyst
// plate lights gold), bubbles 0..1 (H₂ bubbles rise only where the plate is), inU 0..1 (a drop and a bolt travel in from the left), dashed }
export function catalyst(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const w = s * 1.25, x0 = x - w / 2, y0 = y - s, pl = clamp(o.plate ?? 0), bu = clamp(o.bubbles ?? 0);
  ctx.save();
  const wl = y0 + s * .18;   // water line
  ctx.fillStyle = lin(ctx, 0, wl, 0, y, [[0, rgba(COOL.body, .28 * u)], [1, rgba(P.blue0, .4 * u)]]); ctx.beginPath(); ctx.roundRect(x0, wl, w, y - wl, [0, 0, 18, 18]); ctx.fill();
  outline(ctx, [[[x0, y0], [x0, y - 18], [x0 + 18, y], [x0 + w - 18, y], [x0 + w, y - 18], [x0 + w, y0]], [[x0 + 6, wl], [x0 + w - 6, wl]]], smooth(u), { w: 3, dashed: o.dashed, t });
  const pw = w * .42, ph = s * .05, px = x - pw / 2, py = y - s * .14;
  ctx.fillStyle = mixHex(mixHex(P.blue1, P.cream, .25), GOLD.body, pl); ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 4); ctx.fill();
  if (pl > 0) halo(ctx, x, py + ph / 2, pw * .8, .6 * pl, GOLD.halo, GOLD.core);
  // wires (electricity in)
  trailCream(ctx, [[px + pw * .2, py], [px + pw * .2, y0 - s * .1], [x0 - s * .3, y0 - s * .1]], 0, smooth(span(u, .3, 1)), { w: 2, a: .7 });
  if (bu > 0) {
    const r = prng(42); ctx.save(); ctx.beginPath(); ctx.rect(x0, wl - s * .3, w, y - wl + s * .3); ctx.clip();
    for (let i = 0; i < 26; i++) { const bx = px + r() * pw, sp = .35 + r() * .4, ph0 = r(), q = ((t * sp + ph0) % 1), by = py - q * (py - wl + s * .25), rr = (3 + r() * 6) * (.5 + q); if (r() > bu) continue; ctx.strokeStyle = rgba(CREAM, .7 * (1 - q * .6)); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(bx + Math.sin(q * 9 + i) * 6, by, rr, 0, 6.29); ctx.stroke(); }
    ctx.restore();
  }
  const iu = clamp(o.inU ?? 0);
  if (iu > 0 && iu < 1) { const e = sineIO(iu); lineIcon(ctx, 'drop', lerp(x0 - s * .9, x - w * .15, e), lerp(wl - s * .3, wl + s * .2, e), s * .12, { w: 2.5 }); lineIcon(ctx, 'bolt', lerp(x0 - s * .9, x0 - s * .3, e), y0 - s * .1, s * .12, { gold: true, w: 2.5 }); }
  ctx.restore();
  return { plate: { x: px, y: py, w: pw, h: ph }, water: wl };
}
// ---------------------------------------------------------------- LINE 2 · MATERIALS: a crystal lattice (a dot grid in 3D, not #59's crystal)
// lattice(ctx, t, x, y, s, o): (x, y) centre, s = half size. o: { yaw (default slow turn), pitch, lit 0..1 (gold), dashed, seed (each seed is a
// different structure: atoms dropped / added), u 0..1 (atoms appear centre-out), a }
const LAT = new Map();
export function lattice(ctx, t, x, y, s, o = {}) {
  const seed = o.seed ?? 1, u = clamp(o.u ?? 1); if (u <= 0) return;
  if (!LAT.has(seed)) {
    const r = prng(seed * 97 + 5), P3 = [];
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) if (r() > .12) P3.push([i, j, k, r() < .3 ? 1 : 0]);
    if (seed % 2) for (const q of [[.5, .5, .5], [-.5, -.5, .5], [.5, -.5, -.5], [-.5, .5, -.5]]) P3.push([...q, 2]);
    const B = []; for (let a = 0; a < P3.length; a++) for (let b = a + 1; b < P3.length; b++) { const d = Math.hypot(P3[a][0] - P3[b][0], P3[a][1] - P3[b][1], P3[a][2] - P3[b][2]); if (Math.abs(d - 1) < .01 || Math.abs(d - .866) < .01) B.push([a, b]); }
    LAT.set(seed, { P3, B });
  }
  const { P3, B } = LAT.get(seed), yaw = o.yaw ?? t * .25 + seed, pit = o.pitch ?? .45, lit = clamp(o.lit ?? 0), a = o.a ?? 1;
  const cy_ = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
  const pr = P3.map(([i, j, k, ty]) => { const X = i * cy_ - k * sy, Z = i * sy + k * cy_, Y = j * cp - Z * sp, Z2 = j * sp + Z * cp, f = 1 / (1 + Z2 * .18); return [x + X * s * .62 * f, y + Y * s * .62 * f, Z2, ty, f]; });
  const col = mixHex(CREAM, GOLD.line, lit);
  ctx.save(); ctx.globalAlpha *= a;
  if (lit > 0) halo(ctx, x, y, s * 1.6, .45 * lit, GOLD.halo, GOLD.core);
  ctx.strokeStyle = rgba(col, .45); ctx.lineWidth = 1.6; if (o.dashed) ctx.setLineDash([6, 5]);
  for (const [p, q] of B) { const k = Math.min(expoOut(span(u, Math.hypot(...P3[p].slice(0, 3)) * .3, .7)), expoOut(span(u, Math.hypot(...P3[q].slice(0, 3)) * .3, .7))); if (k <= 0) continue; ctx.globalAlpha = a * k; ctx.beginPath(); ctx.moveTo(pr[p][0], pr[p][1]); ctx.lineTo(pr[q][0], pr[q][1]); ctx.stroke(); }
  ctx.setLineDash([]);
  pr.map((p, i) => [p, i]).sort((A, Bb) => Bb[0][2] - A[0][2]).forEach(([p, i]) => { const k = expoOut(span(u, Math.hypot(...P3[i].slice(0, 3)) * .3, Math.hypot(...P3[i].slice(0, 3)) * .3 + .4)); if (k <= 0) return; ctx.globalAlpha = a; const rr = s * (p[3] === 2 ? .06 : p[3] ? .085 : .07) * p[4] * k; ctx.fillStyle = p[3] === 1 ? mixHex(col, P.blue1, .35) : col; ctx.beginPath(); if (o.dashed) { ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.arc(p[0], p[1], rr, 0, 6.29); ctx.stroke(); } else { ctx.arc(p[0], p[1], rr, 0, 6.29); ctx.fill(); } });
  ctx.restore();
}
// the grey superconductor sample in its measuring holder (the B1 → B2 seam plate): (x, y) = the sample centre, s = the pellet radius.
// o: { cold 0..1 (frost light), probes 0..1 (the four gold probe wires), a }
export function sample(ctx, t, x, y, s, o = {}) {
  const pr = clamp(o.probes ?? 1), cold = clamp(o.cold ?? 0);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  // the holder: a dark stage on a short post
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.fillRect(x - s * .16, y + s * .5, s * .32, s * 1.6);
  ctx.fillStyle = lin(ctx, 0, y + s * .2, 0, y + s * .7, [[0, mixHex(P.blue1, P.cream, .25)], [1, mixHex(P.ind1, P.night0, .3)]]); ctx.beginPath(); ctx.ellipse(x, y + s * .45, s * 1.75, s * .38, 0, 0, 6.29); ctx.fill();
  if (cold > 0) halo(ctx, x, y, s * 3, .4 * cold, COOL.halo, COOL.core);
  // the pellet: grey metal disc with a soft highlight
  ctx.fillStyle = lin(ctx, x - s, y - s * .5, x + s, y + s * .5, [[0, '#8f93a8'], [.45, '#c9ccd8'], [1, '#5d6178']]); ctx.beginPath(); ctx.ellipse(x, y + s * .1, s, s * .42, 0, 0, 6.29); ctx.fill();
  ctx.fillStyle = '#6f7389'; ctx.fillRect(x - s, y + s * .1, s * 2, s * .22); ctx.beginPath(); ctx.ellipse(x, y + s * .32, s, s * .42, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = lin(ctx, x - s, y - s * .3, x + s, y + s * .5, [[0, '#a6aabd'], [.5, '#e1e3ec'], [1, '#7a7e93']]); ctx.beginPath(); ctx.ellipse(x, y + s * .1, s, s * .42, 0, 0, 6.29); ctx.fill();
  // four probe wires bending down onto the pellet
  for (let i = 0; i < 4; i++) { const px = x + (i - 1.5) * s * .42, top = y - s * 2.4; goldSpan(ctx, [[px + (i - 1.5) * s * .5, top], [px + (i - 1.5) * s * .25, y - s * .9], [px, y - s * .02]], 0, smooth(span(pr, i * .1, .7 + i * .1)), { w: 1.6, spark: false }); if (pr > .7 + i * .1) { ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(px, y - s * .02, 3, 0, 6.29); ctx.fill(); } }
  ctx.restore();
}
// a lab robot arm setting a dish into a furnace (line 2): (x, y) = the arm's base on the floor, s = size. o: { reach 0..1 (pick → insert),
// fire 0..1 (the furnace window glows), dir }. Returns { win } (the furnace window rect: the C2 plate grows out of it).
export function labRobot(ctx, t, x, y, s, o = {}) {
  const r = sineIO(clamp(o.reach ?? 0)), fire = clamp(o.fire ?? .8), dir = o.dir ?? 1;
  const fx = x + dir * s * 1.05, fw = s * .78, fh = s * .62, fy = y - fh - s * .2, win = { x: fx - (dir < 0 ? fw : 0) + fw * .2, y: fy + fh * .25, w: fw * .6, h: fh * .45 };
  ctx.save();
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .45); ctx.beginPath(); ctx.roundRect(fx - (dir < 0 ? fw : 0), fy, fw, fh, 8); ctx.fill(); ctx.fillRect(fx - (dir < 0 ? fw : 0) + fw * .1, fy + fh, fw * .8, s * .2);
  ctx.fillStyle = lin(ctx, 0, win.y, 0, win.y + win.h, [[0, mixHex(GOLD.hot, GOLD.mid, .3)], [1, GOLD.shade]]); ctx.globalAlpha = .25 + .75 * fire; ctx.beginPath(); ctx.roundRect(win.x, win.y, win.w, win.h, 6); ctx.fill(); ctx.globalAlpha = 1;
  halo(ctx, win.x + win.w / 2, win.y + win.h / 2, win.w * 1.2, .55 * fire * (.9 + .1 * Math.sin(t * 5)), GOLD.halo, GOLD.core);
  const sh = [x, y - s * .55], a1 = lerp(-1.95, -.75, r) * dir, L1 = s * .62, el = [sh[0] + Math.cos(a1) * L1 * dir * dir, sh[1] + Math.sin(a1) * L1];
  const a2 = lerp(-.4, .15, r), L2 = s * .58, wr = [el[0] + Math.cos(a2) * L2 * dir, el[1] + Math.sin(a2) * L2];
  ctx.fillStyle = mixHex(P.blue1, P.cream, .3); ctx.beginPath(); ctx.roundRect(x - s * .2, y - s * .12, s * .4, s * .12, 4); ctx.fill(); ctx.fillRect(x - s * .06, y - s * .55, s * .12, s * .45);
  ctx.strokeStyle = mixHex(P.blue1, P.cream, .4); ctx.lineCap = 'round'; ctx.lineWidth = s * .1; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(el[0], el[1]); ctx.stroke(); ctx.lineWidth = s * .075; ctx.beginPath(); ctx.moveTo(el[0], el[1]); ctx.lineTo(wr[0], wr[1]); ctx.stroke();
  for (const q of [sh, el]) { ctx.fillStyle = mixHex(P.blue1, P.cream, .55); ctx.beginPath(); ctx.arc(q[0], q[1], s * .07, 0, 6.29); ctx.fill(); }
  ctx.fillStyle = mixHex(P.cream, P.blue1, .3); ctx.beginPath(); ctx.ellipse(wr[0] + dir * s * .1, wr[1] + s * .02, s * .13, s * .04, 0, 0, 6.29); ctx.fill();   // the dish
  ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.ellipse(wr[0] + dir * s * .1, wr[1] - s * .005, s * .06, s * .02, 0, 0, 6.29); ctx.fill();
  ctx.restore();
  return { win, hand: wr };
}
// a stack of proof sheets (line 3): (x, y) = the bottom centre, w sheet width, n sheets (float: the top one is landing). o: { stamp 'CLAIM' u,
// checked 0..1 (a gold tick on top), seed }. Returns the top y.
export function proofStack(ctx, t, x, y, w, n, o = {}) {
  const r = prng(o.seed ?? 8), th = 7, N = Math.ceil(n); let top = y;
  for (let i = 0; i < N; i++) {
    const land = i === N - 1 ? n - (N - 1) : 1, jx = (r() - .5) * w * .08, rot = (r() - .5) * .03, e = expoOut(land), yy = y - (i + 1) * th - (1 - e) * 120;
    ctx.save(); ctx.translate(x + jx, yy); ctx.rotate(rot + (1 - e) * .1); ctx.globalAlpha *= clamp(land * 3);
    ctx.fillStyle = i % 2 ? '#d9d1b4' : PAPER.body; ctx.fillRect(-w / 2, -th, w, th); ctx.fillStyle = rgba(PAPER.edge, .9); ctx.fillRect(-w / 2, -1, w, 1);
    ctx.restore(); top = yy - th;
  }
  if ((o.stamp ?? 0) > 0) { const s = clamp(o.stamp), k = backOut(s, .8); ctx.save(); ctx.translate(x, top - 22); ctx.scale(lerp(1.3, 1, k), lerp(1.3, 1, k)); ctx.rotate(-.1); ctx.globalAlpha *= clamp(s * 4); ctx.strokeStyle = CREAM; ctx.lineWidth = 2.5; ctx.strokeRect(-56, -18, 112, 36); E.glowText(ctx, o.label ?? 'CLAIM', 0, 8, { size: 22, weight: 700, align: 'center', col: CREAM, glow: false, spacing: .14 }); ctx.restore(); }
  if ((o.checked ?? 0) > 0) goldSpan(ctx, [[x - 18, top - 40], [x - 4, top - 26], [x + 22, top - 58]], 0, smooth(o.checked), { w: 3.5 });
  return top;
}
