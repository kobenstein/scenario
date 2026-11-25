// Film 73 · B1 helpers (c02–c05): small drawing helpers + the three INNER seam plates of the B1 group (c02|c03, c03|c04, c04|c05).
// Owned by builder B1. The lead's seams (plate2032 in, plateTwoAnswers out) stay in lib/f73_world.mjs.
// Seam rule (as the lead's plates): both chunks call the same plate function round the boundary phrase; every state inside a plate is a
// function of t computed HERE, so the last frame of the left chunk and the first frame of the right chunk are the same picture.
import { createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f73_kit.mjs';
import * as S from './f73_world.mjs';
import * as X from './f73_stage.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, AGE, LAMP, SOURCES: SRC } = F;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------------- the B1 line (sheet units)
export const LY = S.P2032.line;                                    // 846: the lifeline of plate2032
export const YPX = (S.P2032.year - S.P2032.x0) / (2032 - 1985);    // sheet px per year (1985 at x 150, 2032 at x 1040)
export const yx = (yr) => S.P2032.x0 + (yr - 1985) * YPX;
export const X0 = S.P2032.x0, XEND = S.P2032.x1, XAGE = S.P2032.age, X32 = S.P2032.year, XNOW = yx(2026), X59 = yx(2459);
export const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));   // a label: rises at a, sinks before b
export const mixV = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), k)) });
export const withBreath = (t, v, k = 1) => { const b = S.breathe(t); return { x: v.x + b.dx * k, y: v.y + b.dy * k, s: v.s }; };

// ---------------------------------------------------------------------------------------------------- drawing helpers
// sink: draw fn as if it stood on the line y and sank into it by k (0 up … 1 gone); h = how far it travels (sheet units)
export function sink(ctx, y, k, h, fn) {
  if (k >= 1) return; if (k <= 0) { fn(); return; }
  ctx.save(); ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 1e5 + y); ctx.clip(); ctx.translate(0, h * sineIO(k)); fn(); ctx.restore(); ctx.beginPath();
}
// a pill tag in screen px (Inter caps): o.gold, o.hollow 0..1 (fill drains, dashed edge), o.dim 0..1, o.size, o.rot, o.a
export function pill(ctx, txt, x, y, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const size = o.size ?? 24, sp = .1, hol = clamp(o.hollow ?? 0), dim = clamp(o.dim ?? 0);
  ctx.save(); ctx.font = `600 ${size}px Inter`;
  const tw = ctx.measureText(txt).width + txt.length * size * sp, w = tw + size * 1.6, h = size * 1.75, k = expoOut(u);
  ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1) * (1 - .6 * dim); ctx.translate(x, y + (1 - k) * 16); ctx.rotate(o.rot ?? 0);
  const edge = o.gold ? GOLD.line : o.cool ? COOL.line : CREAM;
  ctx.fillStyle = rgba(P.night0, .78 * (1 - hol)); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = rgba(edge, .9); ctx.lineWidth = 1.8; if (hol > 0) ctx.setLineDash([7 * hol + .01, 6 * hol]); ctx.stroke(); ctx.setLineDash([]);
  if (o.gold && !hol) halo(ctx, 0, 0, w * .7, .18 * (1 - dim), GOLD.halo, GOLD.core);
  E.glowText(ctx, txt, 0, size * .36, { size, weight: 600, align: 'center', col: o.gold ? mixHex(GOLD.text, CREAM, hol * .6) : o.cool ? COOL.text : CREAM, glow: false, spacing: sp });
  ctx.restore();
}
// a thin gold weight on a thread (the money behind a claim); x, y = where the thread hangs from (any space), len = thread length
export function weight(ctx, x, y, len, u, sc = 1) {
  u = clamp(u); if (u <= 0) return null;
  const ex = x, ey = y + len * expoOut(u);
  X.drawPath(ctx, [[x, y], [ex, ey]], 1, { col: rgba(CREAM, .7), w: 1.4 / sc });
  halo(ctx, ex, ey + 9 / sc, 40 / sc, .55 * u, GOLD.halo, GOLD.core);
  ctx.fillStyle = E.rad(ctx, ex - 3 / sc, ey + 6 / sc, 14 / sc, [[0, GOLD.core], [.5, GOLD.body], [1, GOLD.shade]]);
  ctx.beginPath(); ctx.moveTo(ex, ey); ctx.bezierCurveTo(ex + 12 / sc, ey + 8 / sc, ex + 10 / sc, ey + 22 / sc, ex, ey + 22 / sc); ctx.bezierCurveTo(ex - 10 / sc, ey + 22 / sc, ex - 12 / sc, ey + 8 / sc, ex, ey); ctx.fill();
  return [ex, ey + 12 / sc];
}
// a short stack of books (cream drawing, dim paper fills) standing on y; u grows them up one by one
export function books(ctx, x, y, u, sc = 1) {
  const B = [[-30, 30, 15], [-26, 34, 13], [-33, 27, 17]]; let yy = y;
  B.forEach(([a, b, h], i) => { const k = expoOut(span(u, i * .22, i * .22 + .5)); if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.fillStyle = mixHex(P.night1, F.PAPER.shade, .22 + .08 * i); ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 1.4 / sc;
    ctx.beginPath(); ctx.roundRect(x + a, yy - h * k, b - a, h * k, 2 / sc); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = rgba(GOLD.line, .5); ctx.beginPath(); ctx.moveTo(x + a + 6, yy - h * k / 2); ctx.lineTo(x + b - 8, yy - h * k / 2); ctx.stroke(); ctx.restore(); yy -= h * k; });
  return yy;
}
// the cool copy of you: the same figure (yellow coat) re-lit in cool light, drawn through one reusable offscreen (screen px)
let OFF = null;
export function coolYou(ctx, sx, sy, h, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0 || h < 2) return;
  const need = Math.ceil(h * 2.2);
  if (!OFF || OFF.width < need) OFF = createCanvas(Math.max(need, 512), Math.max(need, 512));
  const g = OFF.getContext('2d'), ow = OFF.width, ox = ow / 2, oy = ow - 20;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, ow, ow);
  F.du(g, ox, oy, h, o.walk != null ? { dir: o.dir ?? -1, walk: o.walk } : { pose: o.pose ?? 'stand', dir: o.dir ?? -1, look: o.look });
  g.globalCompositeOperation = 'source-atop';
  g.fillStyle = E.lin(g, 0, oy - h, 0, oy, [[0, rgba(COOL.core, .9)], [.5, rgba(COOL.body, .86)], [1, rgba(COOL.deep, .9)]]); g.fillRect(0, 0, ow, ow);
  g.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  halo(ctx, sx, sy - h * .55, h * 1.1, .3 * a * (o.glow ?? 1), COOL.halo, COOL.core);
  ctx.globalAlpha *= a; ctx.drawImage(OFF, sx - ox, sy - oy); ctx.restore();
}
// a head in profile (the same outline as F.headProfile), in any colour; x, y = base of the neck, s = height
const HEAD = [[-.18, 0], [-.2, .18], [-.34, .34], [-.4, .55], [-.36, .78], [-.2, .94], [.02, 1], [.22, .93], [.33, .76], [.36, .62], [.44, .52], [.37, .47], [.38, .4], [.34, .36], [.36, .3], [.3, .24], [.2, .22], [.15, .12], [.14, 0]];
export const headPts = (x, y, s) => HEAD.map(([a, b]) => [x + a * s, y - b * s]);
export function headCool(ctx, x, y, s, u, sc = 1, a = 1) {
  return X.drawPath(ctx, headPts(x, y, s), u, { col: rgba(COOL.line, .95), w: 2.6 / sc, glow: 10 / sc, glowCol: COOL.halo, a });
}
// a desk lamp (cream line drawing) whose LAMP cone falls on the bench; x, y = foot on the bench top
export function lamp(ctx, t, x, y, u, sc = 1) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), j1 = [x + 26 * k, y - 120 * k], hd = [x + 86 * k, y - 140 * k];
  X.drawPath(ctx, [[x - 22, y], [x + 22, y]], u, { col: rgba(CREAM, .7), w: 3 / sc });
  X.drawPath(ctx, [[x, y], j1, hd], u, { col: rgba(CREAM, .7), w: 2.2 / sc });
  const on = span(u, .5, 1) * (.92 + .08 * Math.sin(t * 1.7));
  if (on > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.lin(ctx, hd[0], hd[1], hd[0] + 60, y, [[0, rgba(LAMP.body, .2 * on)], [1, rgba(LAMP.body, 0)]]);
    ctx.beginPath(); ctx.moveTo(hd[0] - 14, hd[1] + 6); ctx.lineTo(hd[0] - 70, y); ctx.lineTo(hd[0] + 120, y); ctx.lineTo(hd[0] + 22, hd[1] + 6); ctx.fill(); ctx.restore();
    halo(ctx, hd[0] + 4, hd[1] + 8, 60, .55 * on, LAMP.body, LAMP.core);
  }
  ctx.fillStyle = mixHex(P.night1, CREAM, .35); ctx.beginPath(); ctx.moveTo(hd[0] - 18, hd[1] + 8); ctx.lineTo(hd[0] - 4, hd[1] - 14); ctx.lineTo(hd[0] + 26, hd[1] - 4); ctx.lineTo(hd[0] + 26, hd[1] + 8); ctx.closePath(); ctx.fill();
}
// a bench (lab table): a cream top edge on the line, dark slab, two legs down; u grows it up out of the line
export function bench(ctx, x0, x1, y, u, sc = 1) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), top = y - 64 * k;
  ctx.fillStyle = mixHex(P.night0, P.ind2, .45); ctx.fillRect(x0, top, x1 - x0, 14);
  X.drawPath(ctx, [[x0, top], [x1, top]], 1, { col: rgba(CREAM, .6), w: 2 / sc });
  for (const lx of [x0 + 30, x1 - 30]) { ctx.fillStyle = mixHex(P.night0, P.ind2, .35); ctx.fillRect(lx - 4, top + 14, 8, y - top - 14); }
  return top;
}
// the pharmacy shelf (cream line drawing): one board, boxes standing on it, ONE empty slot (dashed) at slot index e
export function shelf(ctx, t, x0, x1, y, u, e, sc = 1, empty = 1) {
  u = clamp(u); if (u <= 0) return null;
  const n = 9, step = (x1 - x0) / n; let slot = null;
  X.drawPath(ctx, [[x0 - 20, y], [x1 + 20, y]], u, { col: rgba(CREAM, .8), w: 2.6 / sc, glow: 6 / sc, glowCol: CREAM });
  for (let i = 0; i < n; i++) {
    const bx = x0 + i * step + step * .12, bw = step * .76, bh = 70 + 26 * Math.sin(i * 2.1) ** 2, k = expoOut(span(u, .2 + i * .05, .55 + i * .05));
    if (k <= 0) continue;
    if (i === e) { slot = [bx + bw / 2, y - bh / 2]; ctx.save(); ctx.globalAlpha *= k; ctx.setLineDash([8 / sc, 7 / sc]); ctx.strokeStyle = rgba(CREAM, .85 * empty); ctx.lineWidth = 2 / sc;
      ctx.beginPath(); ctx.rect(bx, y - bh, bw, bh); ctx.stroke(); ctx.restore(); ctx.setLineDash([]); continue; }
    ctx.save(); ctx.fillStyle = mixHex(P.night1, F.PAPER.shade, .16); ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 1.4 / sc;
    ctx.beginPath(); ctx.rect(bx, y - bh * k, bw, bh * k); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = rgba(CREAM, .3); ctx.beginPath(); ctx.moveTo(bx + bw * .2, y - bh * k * .6); ctx.lineTo(bx + bw * .8, y - bh * k * .6); ctx.stroke(); ctx.restore();
  }
  return slot;
}

// ======================================================================================================================= SEAM c02 | c03
// 'Is that bet paying off': THE BET. Your gold life (1985 → its end tick, the old-age end grey); the dashed cream run of the analysis,
// pulled back by the AI ring to x 1600; the ring hovers over its head, its beam lands on you; the small title top left; A BET ON AI.
export const BET = { view: { x: 1250, y: 700, s: .62 }, run: 1600, you: X32 + 140, ring: [1600, LY - 200 / .62, 50 / .62], beam: X32 + 140 };
export function betPlate(ctx, t, v, q = {}) {
  const Q = { title: 1, titleU: 1, bet: 1, run: BET.run, runA: 1, ringU: 1, ring: BET.ring, beam: 1, line: 1, you: 1, think: 1.2, pool: [1300, 600, .9], ...q };
  X.ground(ctx, t, v, { lx: Q.pool[0], ly: Q.pool[1], pool: Q.pool[2] });
  X.inView(ctx, v, (s) => {
    if (q.under) q.under(ctx, s);
    sink(ctx, LY, 1 - Q.line, 40, () => {
      X.lifeline(ctx, t, X0, XEND, LY, s, { age: XAGE, ageU: 1, end: 1, lift: Q.lift ?? 0, glow: 1 });
      X.yearTag(ctx, '1985', X0, LY, Q.line, s, { below: true, size: 34 });
    });
    if (Q.runA > 0 && Q.run > XNOW + 2) X.drawPath(ctx, [[XNOW, LY - 16 / s], [Q.run, LY - 16 / s]], 1, { col: rgba(CREAM, .8), w: 2.2 / s, dash: [12 / s, 9 / s], a: Q.runA });
    if (Q.youU !== 0) sink(ctx, LY, 1 - (Q.youU ?? 1), 120, () => F.du(ctx, Q.youX ?? BET.you, LY - 2, 92, { pose: 'look', dir: Q.youDir ?? 1 }));
    const [rx, ry, rr] = Q.ring;
    if (Q.beam > 0) F.beam(ctx, rx, ry, Q.beamX ?? BET.beam, LY - 40, Q.beam, { s, w: 60 });
    if (Q.ringU > 0) F.aiRing(ctx, t, rx, ry, rr, { u: Q.ringU, think: Q.think, s });
    if (q.mid) q.mid(ctx, s);
  });
  if (Q.title > 0) F.title(ctx, t, Q.titleU, { x: 84, y: 128, size: 54, maxW: 560, out: 1 - Q.title });
  const [bx, by] = X.toScreen(v, Q.ring[0], Q.ring[1] + Q.ring[2]);
  X.label(ctx, SRC.bet, bx, by + 62, Q.bet, { size: 34, col: COOL.text });
  if (q.top) q.top(ctx);
}

// ======================================================================================================================= SEAM c03 | c04
// 'Then the copy is': TOO LATE. Your gold line has its end tick (it landed first); you stand near it and look back at the repair light,
// still on its way; the three gold marks of the real work lie on the line; to the right, beyond your end, the computer grows out of the line.
export const LATE = { view: { x: 1560, y: 690, s: 1.0 }, you: 1630, comp: 2050, compW: 300, marks: [900, 945, 990] };
export const lightX = (t, tl) => 1280 + 34 * (t - tl);           // the repair light creeps on, too slow (both chunks, same formula)
export const compU = (t, tl) => span(t, tl - .9, tl + .9);       // the computer grows out of the line across the seam
export function latePlate(ctx, t, v, tl, q = {}) {
  const Q = { marks: 1, light: 1, you: 1, youDir: -1, comp: compU(t, tl), on: 0, pool: [1500, 640, 1], end: 1, ...q };
  X.ground(ctx, t, v, { lx: Q.pool[0], ly: Q.pool[1], pool: Q.pool[2] });
  X.inView(ctx, v, (s) => {
    if (q.under) q.under(ctx, s);
    X.lifeline(ctx, t, X0, XEND, LY, s, { age: XAGE, ageU: Q.ageU ?? 1, end: Q.end, lift: Q.lift ?? 0, glow: 1 });
    X.yearTag(ctx, '1985', X0, LY, 1, s, { below: true, size: 34 });
    if (Q.marks > 0) marks(ctx, t, LATE.marks, LY, Q.marks, s);
    if (Q.light > 0) { const lx = Q.lightX ?? lightX(t, tl); halo(ctx, lx, LY, 90, .8 * Q.light, GOLD.halo, GOLD.core); halo(ctx, lx, LY, 26, Q.light, GOLD.hot, GOLD.core); }
    const sc = F.computer(ctx, t, LATE.comp, LY - 4, LATE.compW, { s, u: Q.comp, on: Q.on });
    if (q.screen && sc) q.screen(ctx, s, sc);
    if (Q.you > 0) sink(ctx, LY, 1 - Q.you, 120, () => F.du(ctx, Q.youX ?? LATE.you, LY - 2, 92, { pose: Q.pose ?? 'look', dir: Q.youDir, walk: Q.walk }));
    if (q.mid) q.mid(ctx, s);
  });
  if (q.top) q.top(ctx);
}
// the three gold marks of the real work (a cell, a gene, a mouse), small, standing on the line at xs; u 0..1 (they drop in one by one)
export function marks(ctx, t, xs, y, u, s = 1) {
  xs.forEach((x, i) => {
    const k = expoOut(span(u, i * .2, i * .2 + .6)); if (k <= 0) return;
    const yy = y - 22 - (1 - k) * 120;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2);
    halo(ctx, x, yy, 34, .45 * k, GOLD.halo, GOLD.core);
    ctx.strokeStyle = GOLD.line; ctx.fillStyle = rgba(GOLD.body, .35); ctx.lineWidth = 2 / s;
    if (i === 0) { ctx.beginPath(); ctx.arc(x, yy, 13, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.arc(x - 2, yy - 1, 4.5, 0, TAU); ctx.fill(); }
    else if (i === 1) { ctx.fillStyle = GOLD.body; for (let j = -2; j <= 2; j++) ctx.fillRect(x + j * 6 - 2, yy - (j === 0 ? 13 : 8), 4, j === 0 ? 26 : 16); }
    else { F.mouse(ctx, t, x + 2, yy + 12, 34, { s }); ctx.strokeStyle = GOLD.line; ctx.lineWidth = 1.6 / s; ctx.beginPath(); ctx.ellipse(x + 2, yy + 5, 12, 7, 0, 0, TAU); ctx.stroke(); }
    ctx.restore();
  });
}

// ======================================================================================================================= SEAM c04 | c05
// 'And still': INSIDE THE SCREEN. The camera is in the computer of the copy; the virtual (cool wireframe) fly walks on, quietly.
export const SCR = { cx: LATE.comp, cy: 702, s: 5.6 };   // computer at x 2050 on the line (w 300): its inner rect centre is y 702
export const screenView = (t) => withBreath(t, { x: SCR.cx, y: SCR.cy, s: SCR.s }, .25);
export const flyWalk = (t) => ({ x: SCR.cx + 16 * Math.sin(t * .36), y: SCR.cy + 6 + 6 * Math.sin(t * .47 + 1), rot: Math.PI / 2 + .3 * Math.cos(t * .36), walk: t * 7 });
export function screenPlate(ctx, t, v, q = {}) {
  const Q = { on: 1, fly: 1, flySize: 44, ...q };
  const pl = q.pool ?? [SCR.cx, SCR.cy, 1];
  X.ground(ctx, t, v, { lx: pl[0], ly: pl[1], pool: pl[2] });
  X.inView(ctx, v, (s) => {
    if (q.under) q.under(ctx, s);
    const sc = Q.comp === 0 ? null : F.computer(ctx, t, LATE.comp, LY - 4, LATE.compW, { s, u: Q.comp ?? 1, on: Q.on });
    if (q.inScreen) q.inScreen(ctx, s, sc);
    if (Q.fly > 0) { const f = q.flyPos ?? flyWalk(t); F.fly(ctx, t, f.x, f.y, Q.flySize, { style: 'virtual', s, rot: f.rot, walk: f.walk, groom: f.groom, feed: f.feed, a: Q.fly }); }
    if (q.mid) q.mid(ctx, s, sc);
  });
  if (q.top) q.top(ctx);
}

// ======================================================================================================================= FACT-CHECK STRINGS
// faktencheck.md §1 (25.11.) + coordinator: these replace F.SOURCES entries until the lead updates the table (named in the B1 report):
// kurzweil (no Google), z3 (de Magalhães' own sentence; 2459 = a blogger's analysis), uploads (Andregg's verified words, 04:29.9).
export const FC = {
  kurzweil: ['RAY KURZWEIL', 'INVENTOR AND FUTURIST'],
  z3: { text: 'Interesting analysis suggesting that, at the current pace of progress, we’ll reach Longevity Escape Velocity (LEV) in 2459.',
    credit: 'João Pedro de Magalhães · University of Birmingham · on X, 3 Aug 2026', src: 'ANALYSIS: ALEXEY STRYGIN (BLOG), “ARE WE ON TRACK FOR LONGEVITY ESCAPE VELOCITY?”, 3 AUG 2026 · SHARED BY J. P. DE MAGALHÃES, PROFESSOR OF MOLECULAR BIOGERONTOLOGY' },
  uploads: { text: '“Optimistically, I think we are a few years away, not a few decades.”', credit: 'Michael Andregg · CEO, Eon Systems · Progress by Fifty Years, 17 Nov 2026' },
};

// draw fn(c) through a full-frame offscreen layer at alpha a (for plates whose own code resets globalAlpha)
let LAYER = null;
export function faded(ctx, a, fn) {
  if (a >= .999) { fn(ctx); return; } if (a <= .001) return;
  const w = ctx.canvas.width, h = ctx.canvas.height;
  if (!LAYER || LAYER.width !== w || LAYER.height !== h) LAYER = createCanvas(w, h);
  const c = LAYER.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, h);
  c.setTransform(ctx.getTransform()); fn(c); c.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(LAYER, 0, 0); ctx.restore();
}
