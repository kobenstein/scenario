// Film 10 · B1 world module for c03 (Editorial-Nacht): the valley of c01 seen as a map from the air, with the home on the
// right branch of the fork (its window is where c03 starts and ends), factories on the left branch, a signpost with a lantern
// at the fork, and the explainer canvas in the sky above the ridges (card Z 6000).
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as D from './f10_c01_draw.mjs';
import * as V from './f10_c01_world.mjs';
const { W, H, P, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, halo, prng, cam3, cardM, card, F0 } = E;

export const VZ = 3600, EZ = 6000, HOR = 452;
const gp = V.VALLEY.gp;
export const MAP = {
  fork: [1010, 560], home: [1258, 506], facs: [[600, 532], [716, 516], [842, 546]],
  win: { x: 1270, y: 482, w: 18, h: 24 },   // the home's window (design px of the valley card)
};
// paths (design px on the valley card)
export const PATHS = {
  road: E.catmull([[1100, 1000, 0], [985, 862, 0], [1036, 742, 0], [962, 642, 0], [1010, 560, 0]], 10),
  home: E.catmull([[1010, 560, 0], [1110, 534, 0], [1200, 520, 0], [1252, 508, 0]], 8),
  fac: MAP.facs.map((f) => E.catmull([[1010, 560, 0], [930, 548, 0], [f[0] + 40, f[1] + 6, 0], [f[0], f[1] + 4, 0]], 8)),
  streams: [
    E.catmull([[160, 470, 0], [420, 500, 0], [700, 560, 0], [900, 566, 0], [1004, 561, 0]], 10),   // PRICE (far left)
    E.catmull([[300, 1060, 0], [560, 840, 0], [820, 690, 0], [960, 600, 0], [1006, 563, 0]], 10),  // MONEY (near left)
    E.catmull([[1800, 468, 0], [1560, 500, 0], [1300, 540, 0], [1110, 556, 0], [1016, 561, 0]], 10), // COUNTRIES (far right)
    E.catmull([[1720, 1060, 0], [1500, 860, 0], [1220, 700, 0], [1060, 610, 0], [1014, 564, 0]], 10), // WORKERS (near right)
  ],
};
export const plen = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
export function along(pts, f) { const L = plen(pts), d = clamp(f) * L[L.length - 1]; let i = 1; while (i < L.length - 1 && L[i] < d) i++; const k = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; }
export function sub(pts, f0, f1) { const n = pts.length - 1, out = []; for (let i = 0; i <= 24; i++) out.push(along(pts, lerp(f0, f1, i / 24))); return out; }

// ---------------------------------------------------------------- the land (k = card scale; line widths stay thin when the camera flies in)
const TERR = (() => {
  const r = prng(77), lines = [];
  for (let j = 0; j < 16; j++) { const Z = 640 * Math.pow(1.27, j), pts = [], ph = r() * 6.3, amp = 26 + r() * 30; for (let x = -900; x <= W + 3000; x += 30) { const X = (x - W / 2) * Z / 1000, Zw = Z + amp * Z / 900 * Math.sin(X / (380 + 60 * j) + ph) + .3 * amp * Z / 900 * Math.sin(X / 140 + ph * 2); pts.push(gp(X, Math.max(560, Zw))); } lines.push({ pts, a: .1 + .14 * (1 - j / 16) }); }
  return lines;
})();
export function land(ctx, t, k, o = {}) {
  const lw = (w) => w / Math.pow(k, .85);
  ctx.fillStyle = lin(ctx, 0, HOR, 0, 1150, [[0, P.ind2], [.14, P.ind0], [.55, P.night1], [1, P.night0]]); ctx.fillRect(-1600, HOR, W + 4800, 1600);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, HOR - 2, 0, HOR + 70, [[0, rgba(P.blue0, .55)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-1600, HOR - 2, W + 4800, 72); ctx.restore();
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const L of TERR) { ctx.strokeStyle = rgba(P.blue1, L.a); ctx.lineWidth = lw(1.4); ctx.beginPath(); L.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  // roads: the main road up to the fork, the branch to the factories, the branch to the home
  ctx.strokeStyle = rgba(P.blue1, .75);
  const R = PATHS.road; for (let i = 1; i < R.length; i++) { ctx.lineWidth = lw(lerp(7, 2.4, i / R.length)); ctx.beginPath(); ctx.moveTo(R[i - 1][0], R[i - 1][1]); ctx.lineTo(R[i][0], R[i][1]); ctx.stroke(); }
  ctx.lineWidth = lw(1.8);
  for (const p of [PATHS.home, ...PATHS.fac]) { ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); }
  ctx.restore();
  // the factories (left branch) and their gates; o.gate[i] 0..1 warm
  MAP.facs.forEach(([x, y], i) => {
    const g = o.gate?.[i] ?? 0, w = 64, h = 34;
    const p = new Path2D(); p.moveTo(x - w / 2, y); p.lineTo(x - w / 2, y - h * .6); p.lineTo(x - w / 6, y - h); p.lineTo(x - w / 6, y - h * .6); p.lineTo(x + w / 6, y - h); p.lineTo(x + w / 6, y - h * .6); p.lineTo(x + w / 2, y - h); p.lineTo(x + w / 2, y); p.closePath();
    ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fill(p); ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = lw(1.4); ctx.stroke(p);
    ctx.fillStyle = g > .02 ? lin(ctx, 0, y - 14, 0, y, [[0, rgba(P.core0, g)], [1, rgba(P.halo0, g)]]) : rgba(P.night0, .9); ctx.fillRect(x + 6, y - 14, 12, 14);
    if (g > .02) { halo(ctx, x + 12, y - 7, 60, .55 * g); E.lightPool(ctx, x + 6, x + 18, y, 10, 14, g * .8); }
  });
  house(ctx, t, k, o);
}
// the home: a small house on the right branch; its window: two curtains with a gap of light (o.open 0..1 opens them), o.lamp glow
export function house(ctx, t, k, o = {}) {
  const [x, y] = MAP.home, w = 78, h = 44, wn = MAP.win;
  ctx.fillStyle = mixHex(P.ind2, P.night1, .15);
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - h); ctx.lineTo(x, y - h - 26); ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 1.4 / Math.pow(k, .85); ctx.stroke();
  // the window light
  const gl = o.glow ?? .7;
  halo(ctx, wn.x + wn.w / 2, wn.y + wn.h / 2, 46, .5 * gl, P.halo1, P.halo0);
  ctx.fillStyle = lin(ctx, 0, wn.y, 0, wn.y + wn.h, [[0, P.core0], [.6, P.core1], [1, P.halo0]]); ctx.fillRect(wn.x, wn.y, wn.w, wn.h);
  // the curtains (match c02's notebook covers at the start of c03: dark, lit toward the gap)
  const op = clamp(o.open ?? 0), gap = lerp(o.gap0 ?? .07, wn.w * .46, smooth(op));
  const cw = wn.w / 2 - gap;
  if (cw > 0) {
    ctx.fillStyle = lin(ctx, wn.x, 0, wn.x + cw, 0, [[0, P.night0], [1, mixHex(P.ind2, P.blue1, .25)]]); ctx.fillRect(wn.x - .5, wn.y - .5, cw + .5, wn.h + 1);
    ctx.fillStyle = lin(ctx, wn.x + wn.w - cw, 0, wn.x + wn.w, 0, [[0, mixHex(P.ind2, P.blue1, .25)], [1, P.night0]]); ctx.fillRect(wn.x + wn.w - cw, wn.y - .5, cw + .5, wn.h + 1);
  }
  ctx.strokeStyle = mixHex(P.ind2, P.blue1, .4); ctx.lineWidth = Math.max(.12, 1.4 / Math.pow(k, .85)); ctx.strokeRect(wn.x, wn.y, wn.w, wn.h);
}
// the signpost at the fork with its lantern (the hero light of 3.13); turn 0..1: the empty board swings to point up to the home
export function signpost(ctx, t, o = {}) {
  const [fx, fy] = MAP.fork, x = fx + 16, y = fy + 2, hh = 40;
  ctx.fillStyle = mixHex(P.ind2, P.night0, .3); ctx.fillRect(x - .9, y - hh, 1.8, hh);
  // the board: an arrow shape, seen edge-on while it turns (scaleX = cos)
  const turn = clamp(o.turn ?? 0), ang = lerp(Math.PI, -.12, sineIO(turn)), sx = Math.cos(ang);
  ctx.save(); ctx.translate(x, y - hh + 6); ctx.rotate(lerp(.05, -.1, turn)); ctx.scale(sx, 1);
  const b = new Path2D(); b.moveTo(0, -3.4); b.lineTo(20, -3.4); b.lineTo(25, 0); b.lineTo(20, 3.4); b.lineTo(0, 3.4); b.closePath();
  ctx.fillStyle = mixHex(P.ind2, P.halo1, .25 + .35 * (o.lamp ?? 1)); ctx.fill(b); ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = .3; ctx.stroke(b);
  ctx.restore();
  // the lantern hanging from a small arm
  const la = o.lamp ?? 1, lx = x - 6, ly = y - hh + 13;
  ctx.fillStyle = mixHex(P.ind2, P.night0, .3); ctx.fillRect(lx, y - hh + 9, 6, .8);
  halo(ctx, lx, ly, 70 * la, .6 * la, P.halo1, P.halo0);
  const lp = new Path2D(); lp.roundRect(lx - 1.8, ly - 2.6, 3.6, 5.2, .8); E.lightShape(ctx, lp, t, { lit: 1, dust: 0, glow: .5, a: la });
  E.lightPool(ctx, x - 22, x + 10, y, 8, 6, .8 * la);
  return [x, y - hh + 6];
}

// ---------------------------------------------------------------- explainer marks for the sky canvas
export function car(ctx, t, x, y, s, o = {}) {   // a small car of light (side view), centred at x,y, length s
  const p = new Path2D(), u = s / 2;
  p.moveTo(-u, .1 * u); p.lineTo(-u, -.18 * u); p.quadraticCurveTo(-.9 * u, -.3 * u, -.6 * u, -.32 * u); p.lineTo(-.35 * u, -.62 * u); p.lineTo(.3 * u, -.62 * u); p.lineTo(.62 * u, -.32 * u); p.quadraticCurveTo(.98 * u, -.28 * u, u, -.05 * u); p.lineTo(u, .1 * u); p.closePath();
  const wh = new Path2D(); for (const wx of [-.55, .55]) { wh.moveTo((wx + .2) * u, .12 * u); wh.arc(wx * u, .12 * u, .2 * u, 0, 6.29); }
  const all = new Path2D(); all.addPath(p.op(wh, PathOp.Union), { a: 1, b: 0, c: 0, d: 1, e: x, f: y });
  E.lightShape(ctx, all, t, { lit: o.lit ?? 1, dust: 0, a: o.a ?? 1, seed: 21 });
}
// a price tag of light (hole + string), x,y = its centre
export function tag(ctx, t, x, y, s, ang, o = {}) {
  const p = new Path2D(); p.moveTo(-.5, -.28); p.lineTo(.3, -.28); p.lineTo(.5, 0); p.lineTo(.3, .28); p.lineTo(-.5, .28); p.closePath();
  const ho = new Path2D(); ho.arc(.28, 0, .07, 0, 6.29);
  const all = new Path2D(); all.addPath(p.op(ho, PathOp.Difference), { a: s * Math.cos(ang), b: s * Math.sin(ang), c: -s * Math.sin(ang), d: s * Math.cos(ang), e: x, f: y });
  E.lightShape(ctx, all, t, { lit: 1, dust: 0, a: o.a ?? 1, seed: 22 });
}
// a bar of light from a baseline (x = centre, y = baseline), height h, width w; o.dot: forecast (dotted outline, cool fill)
export function bar(ctx, t, x, y, w, h, o = {}) {
  if (h <= .5) return;
  const p = new Path2D(); p.roundRect(x - w / 2, y - h, w, h, [Math.min(w * .25, h * .5), Math.min(w * .25, h * .5), 0, 0]);
  if (o.dot) {
    E.lightShape(ctx, p, t, { lit: 0, a: .45 * (o.a ?? 1), dust: 0, glow: .5 });
    ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = P.halo0; ctx.lineWidth = 4; ctx.stroke(p); ctx.restore();
  } else E.lightShape(ctx, p, t, { lit: o.lit ?? 1, seed: o.seed ?? 13, cy: -.4, a: o.a ?? 1 });
}

// the ridges of c01, extended to the right (the sky explainers truck right over them)
export function ridges3(ctx) {
  const L = -900, R = 4600, B = 1600;
  ctx.beginPath(); ctx.moveTo(L, 404); ctx.bezierCurveTo(-200, 340, 300, 318, 700, 362); ctx.bezierCurveTo(950, 392, 1150, 322, 1460, 330);
  ctx.bezierCurveTo(1760, 338, 2050, 384, 2500, 366); ctx.bezierCurveTo(2900, 350, 3200, 312, 3600, 340); ctx.bezierCurveTo(3950, 364, 4300, 344, R, 356); ctx.lineTo(R, B); ctx.lineTo(L, B); ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, 320, 0, 470, [[0, P.ind1], [1, P.ind0]]); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 2.2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(L, 430); ctx.bezierCurveTo(-100, 392, 420, 388, 760, 410); ctx.bezierCurveTo(1000, 428, 1320, 400, 1560, 414);
  ctx.bezierCurveTo(1860, 430, 2200, 404, 2600, 420); ctx.bezierCurveTo(3000, 436, 3400, 398, 3800, 412); ctx.bezierCurveTo(4100, 424, 4400, 406, R, 418); ctx.lineTo(R, B); ctx.lineTo(L, B); ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, 400, 0, 480, [[0, P.ind2], [1, P.ind0]]); ctx.fill(); ctx.strokeStyle = rgba(P.blue1, .85); ctx.lineWidth = 1.6; ctx.stroke();
}
// c02's last frame: the vertical gap of light (screen space), repeated over the first frames of c03 (same pixels at the seam)
export function gapLine(ctx, t, k = 1) {
  if (k <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  halo(ctx, W / 2, H / 2, 520, .35 * k, P.halo1, P.halo0);
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, W / 2 - 40, 0, W / 2 + 40, 0, [[0, rgba(P.halo0, 0)], [.5, rgba(P.halo0, .55 * k)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(W / 2 - 40, 0, 80, H);
  ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, rgba(P.core1, .6 * k)], [.5, rgba(P.core0, k)], [1, rgba(P.core1, .6 * k)]]); ctx.fillRect(W / 2 - 3, 0, 6, H);
  ctx.restore();
}
