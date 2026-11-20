// Film 19 · B1 (c02–c05) · props drawn on THE SHEET or lifted off it. Owned by builder B1; built on lib/f19_kit.mjs (never edited).
// Everything is drawn in sheet design coordinates (call inside onSheet / lifted). No canvas, pattern or image per frame.
//   loop(ctx, t, x, y, r, o)        THE LOOP (PEOPLE → INVENTORS → PROGRESS), gold ink or cool light; readable labels (kit wish: loopWheel o.lab)
//   mlPts(o) / ML                   the loop's own little gold line: steepens per lap, goes straight up, bends over (c02/c03)
//   tree(ctx, t, u, o) / TREE        the ink family tree under the knee (5 → 3 → 2 children, you yellow at the bottom)
//   windowCard(ctx, t, i, cx, cy, g, o)  the three lit windows of the paper-cut theatre (doctor · school · the kitchen table)
//   kid(ctx, x, y, h, o)             a child pictogram (ink fill or dotted outline)
//   tag(ctx, t, x, y, s, o)          the SINGULARITY tag (cream paper on a thread)
//   pencilWheel, pencilTree, thread  graphite marks
//   desk(ctx, t, o)                  the c04 desk diorama (researcher, warm screen, cool screen) – inside lifted()
//   bar / stairs / ghost             c04/c05 explainers
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
const { rgba, mixHex, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, rad, lin, prng } = E;
const { PAL, label, ink, lightLine, partial } = F;

const TAU = Math.PI * 2;
const stroke = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); };
const plen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
export const graphite = (a = .7) => rgba(PAL.ink1, a);
export { stroke };

// ===================================================================================================================== the loop
const ST = [-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6];   // PEOPLE top, INVENTORS lower right, PROGRESS lower left (clockwise)
const NAMES = ['PEOPLE', 'INVENTORS', 'PROGRESS'];
// o: { u (dashed guide drawn), arrows 0..3, icons [a,b,c] 0..1 (each station grows from a dot), lab (label size), bead (laps, position = frac),
//      beadV (laps/s, for the motion trail), ring 0..1 (the spinning bead becomes a gold ring), broken 0..1 (PROGRESS → PEOPLE tears),
//      dim0 0..1 (PEOPLE stops multiplying), cool (light version: stations are blocks of cool light), grow [g,g,g] (blocks build bigger), a }
export function loop(ctx, t, x, y, r, o = {}) {
  const cool = !!o.cool, gap = .37, u = o.u ?? 1;
  const arc = (a0, a1, n = 48) => { const out = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); out.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } return out; };
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (u > 0) {   // the faint guide circle, drawn round from the top
    ctx.save(); ctx.strokeStyle = rgba(cool ? PAL.cool2 : PAL.ink2, .5); ctx.lineWidth = r * .008; ctx.setLineDash([r * .03, r * .035]);
    ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + clamp(u) * TAU); ctx.stroke(); ctx.restore();
  }
  // the ring of light when the bead runs too fast to see
  if ((o.ring ?? 0) > 0) {
    const rg = o.ring; ctx.save(); ctx.lineCap = 'round';
    for (const [w, a] of [[r * .16, .06], [r * .07, .14], [r * .025, .5]]) { ctx.strokeStyle = rgba(cool ? PAL.cool1 : PAL.gold1, a * rg); ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); }
    ctx.strokeStyle = rgba(cool ? PAL.cool0 : PAL.gold0, .7 * rg); ctx.lineWidth = r * .01; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
  }
  const ar = o.arrows ?? 3, w = r * (cool ? .02 : .026);
  for (let i = 0; i < 3; i++) {
    const a0 = ST[i] + gap, a1 = ST[(i + 1) % 3] + (i === 2 ? TAU : 0) - gap, uu = clamp(ar - i); if (uu <= 0) continue;
    const brk = i === 2 ? clamp(o.broken ?? 0) : 0;
    const seg = (pts, v, head) => (cool ? lightLine(ctx, pts, v, { w, spill: v < 1 ? .6 : 0 }) : ink(ctx, pts, v, { w, head }));
    if (brk > 0) {
      const am = lerp(a0, a1, .5), g = .2 * expoOut(brk), sag = 6 * brk;
      const p1 = arc(a0, am - g), p2 = arc(am + g, a1);
      p1[p1.length - 1] = [p1[p1.length - 1][0], p1[p1.length - 1][1] + sag]; p2[0] = [p2[0][0], p2[0][1] + sag];
      seg(p1, 1, false); seg(p2, 1, false);
      // frayed ends: three short fibres each
      ctx.save(); ctx.strokeStyle = cool ? PAL.cool1 : PAL.gold2; ctx.lineWidth = w * .35; ctx.lineCap = 'round';
      for (const [p, d] of [[p1[p1.length - 1], 1], [p2[0], -1]]) for (let k = -1; k <= 1; k++) { const ang = am + Math.PI / 2 + k * .5; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + Math.cos(ang) * w * 1.6 * d * brk, p[1] + Math.sin(ang) * w * 1.6 * d * brk + k * 2); ctx.stroke(); }
      ctx.restore();
    } else seg(arc(a0, a1), uu, uu < 1);
    if (uu >= 1 && brk <= 0) {   // arrowhead
      const ang = a1 + Math.PI / 2, hx = x + Math.cos(a1) * r, hy = y + Math.sin(a1) * r, s = r * .06;
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); ctx.fillStyle = cool ? PAL.cool1 : PAL.gold2;
      ctx.beginPath(); ctx.moveTo(s * 1.1, 0); ctx.lineTo(-s * .6, -s * .75); ctx.lineTo(-s * .25, 0); ctx.lineTo(-s * .6, s * .75); ctx.closePath(); ctx.fill(); ctx.restore();
    }
  }
  // the stations
  const ic = o.icons ?? [1, 1, 1], lab = o.lab ?? 40;
  ST.forEach((a, i) => {
    const s = clamp(ic[i] ?? 0); if (s <= 0) return;
    const sx = x + Math.cos(a) * r, sy = y + Math.sin(a) * r, k = expoOut(s), R = r * .2 * k;
    ctx.save(); ctx.translate(sx, sy);
    if (cool) {
      const g = clamp((o.grow ?? [0, 0, 0])[i] ?? 0, 0, 1.5), b = R * (.36 + .08 * g);
      E.halo(ctx, 0, 0, R * 1.5, .5, PAL.cool1, PAL.cool0);
      ctx.fillStyle = rgba(PAL.cool2, .9); ctx.fillRect(-b, -b, b * 2, b * 2);
      ctx.fillStyle = PAL.cool0; ctx.fillRect(-b * .55, -b * .55, b * 1.1, b * 1.1);
      if (g > 0) { const b2 = b * .62 * expoOut(clamp(g)); ctx.fillStyle = rgba(PAL.cool1, .9); ctx.fillRect(b * 1.2, b - b2 * 2, b2 * 2, b2 * 2); ctx.fillStyle = PAL.cool0; ctx.fillRect(b * 1.2 + b2 * .5, b - b2 * 1.5, b2, b2); }   // the next, bigger block being built
    } else {
      const dim = clamp(i === 0 ? o.dim0 ?? 0 : 0);
      ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = R * .25; ctx.shadowOffsetY = R * .08;
      ctx.fillStyle = mixHex(PAL.card, PAL.cardShade, dim * .8); ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.strokeStyle = PAL.gold3; ctx.lineWidth = r * .008; ctx.stroke();
      ctx.fillStyle = mixHex(PAL.cInk0, PAL.cardLine, dim * .7);
      stationIcon(ctx, i, R / 1.6, o, t);
    }
    ctx.restore();
    const ly = i === 0 ? sy - R - lab * .45 : sy + R + lab * 1.15;
    label(ctx, NAMES[i], sx, ly, lab, s, { align: 'center', col: cool ? PAL.cool1 : PAL.ink0 });
  });
  // the bead (with a short motion trail)
  if (o.bead != null && o.bead >= 0 && (o.beadA ?? 1) > 0) {
    const f = o.bead % 1, a = -Math.PI / 2 + f * TAU, v = Math.min(1.2, Math.abs(o.beadV ?? 0) * .35);
    if (v > .02) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(cool ? PAL.cool1 : PAL.gold1, .35 * (o.beadA ?? 1)); ctx.lineWidth = r * .03; ctx.beginPath(); ctx.arc(x, y, r, a - v, a); ctx.stroke(); ctx.restore(); }
    const bx = x + Math.cos(a) * r, by = y + Math.sin(a) * r;
    ctx.globalAlpha *= o.beadA ?? 1;
    E.halo(ctx, bx, by, r * .1, .6, cool ? PAL.cool1 : PAL.gold2, cool ? PAL.cool0 : PAL.gold0);
    ctx.fillStyle = cool ? PAL.cool0 : PAL.gold1; ctx.beginPath(); ctx.arc(bx, by, r * .032, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// station icons on the cream disc (indigo ink): PEOPLE three figures · INVENTORS a figure at a drafting board · PROGRESS wheat + bottle
function stationIcon(ctx, i, s, o, t) {
  if (i === 0) { for (const dx of [-.55, 0, .55]) { const sc = dx === 0 ? 1.05 : .9; ctx.beginPath(); ctx.arc(dx * s, -s * .38 * sc, s * .2 * sc, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(dx * s, s * .28, s * .25 * sc, s * .42 * sc, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(dx * s - s * .25 * sc, s * .28, s * .5 * sc, s * .26); } }
  else if (i === 1) {
    ctx.beginPath(); ctx.arc(-s * .35, -s * .42, s * .2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-s * .35, s * .22, s * .27, s * .46, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-s * .62, s * .22, s * .54, s * .32);
    ctx.save(); ctx.translate(s * .35, s * .02); ctx.rotate(-.55); ctx.fillRect(-s * .5, -s * .05, s * .95, s * .1); ctx.restore(); ctx.fillRect(s * .3, s * .05, s * .07, s * .5);
    ctx.save(); ctx.strokeStyle = PAL.gold3; ctx.lineWidth = s * .09; ctx.beginPath(); ctx.arc(s * .5, -s * .52, s * .17, 0, TAU); ctx.stroke(); ctx.restore();   // the idea: a small ring of light
  } else {
    ctx.fillRect(-s * .55, -s * .62, s * .08, s * 1.2);
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(-s * .51 + (k % 2 ? .13 : -.13) * s, -s * .52 + k * s * .22, s * .13, s * .065, k % 2 ? .6 : -.6, 0, TAU); ctx.fill(); }
    ctx.fillRect(s * .05, -s * .2, s * .5, s * .75); ctx.fillRect(s * .18, -s * .42, s * .24, s * .24);
    const lit = clamp(o.progLit ?? 0);
    if (lit > 0) { ctx.save(); ctx.globalAlpha *= lit; ctx.fillStyle = PAL.gold2; ctx.fillRect(s * .12, -s * .1, s * .36, s * .58); ctx.restore(); }
    ctx.fillStyle = PAL.card; ctx.fillRect(s * .26, -.0 * s, s * .08, s * .32); ctx.fillRect(s * .14, s * .12, s * .32, s * .08);
  }
}

// ===================================================================================================================== the loop's line
// A little gold line beside the loop (origin ML.x0, ML.y0): k = steepness (0 gentle … 4 steep), vert 0..1 (goes straight up),
// bend 0..1 (c03: the vertical bends over, like the first line's knee). 60 points.
export const ML = { x0: 1000, y0: 1740, w: 205, top: 1160 };
export function mlPts(o = {}) {
  const k = o.k ?? 0, vert = clamp(o.vert ?? 0), bend = clamp(o.bend ?? 0), out = [];
  const a = .8 + k * 1.15, H = 70 + k * 45;
  const n = 46;
  for (let i = 0; i <= n; i++) { const u = i / n; out.push([ML.x0 + ML.w * u, ML.y0 - H * (Math.exp(a * u) - 1) / (Math.exp(a) - 1)]); }
  const end = out[out.length - 1];
  // the vertical (drawn up to fraction vert) and, once vertical, its bent version (bend)
  const m = 16, ylen = end[1] - ML.top, be = sineIO(bend);
  for (let i = 1; i <= m; i++) {
    const u = i / m; if (u > vert + 1e-6) break;
    const vx = end[0] + 4 * u * u, vy = end[1] - ylen * u;                                                         // straight up
    const q = Math.sin(u * Math.PI / 2), bx = end[0] + 250 * Math.pow(u, 1.6), by = end[1] - 230 * Math.pow(q, .7);   // bent: flattens to the right
    out.push([lerp(vx, bx, be), lerp(vy, by, be)]);
  }
  return out;
}

// ===================================================================================================================== the family tree
// Under the knee: trunk from the knee down; couple → 5 children → 3 → 2 (one of them you, yellow). u 0..1 draws it (by its head).
export const TREE = (() => {
  const trunk = [[1444, 632], [1468, 780], [1508, 940], [1520, 1120], [1520, 1300]];
  const g0 = [[1468, 1318], [1572, 1318]];
  const g1 = [1310, 1415, 1520, 1625, 1730].map((x) => [x, 1452]);
  const g2 = [1560, 1625, 1690].map((x) => [x, 1572]);
  const g3 = [1592, 1658].map((x) => [x, 1690]);
  const segs = [   // [pts, u0, u1]
    [trunk, 0, .34],
    [[[1520, 1318], [1520, 1392]], .34, .4], [[[1310, 1392], [1730, 1392]], .4, .5],
    ...g1.map((p, i) => [[[p[0], 1392], [p[0], p[1] - 14]], .5 + i * .012, .56 + i * .012]),
    [[[1625, 1466], [1625, 1520]], .62, .66], [[[1560, 1520], [1690, 1520]], .66, .71],
    ...g2.map((p, i) => [[[p[0], 1520], [p[0], p[1] - 13]], .71 + i * .012, .76 + i * .012]),
    [[[1625, 1585], [1625, 1640]], .8, .84], [[[1592, 1640], [1658, 1640]], .84, .88],
    ...g3.map((p, i) => [[[p[0], 1640], [p[0], p[1] - 13]], .88 + i * .02, .93 + i * .02]),
  ];
  const nodes = [...g0.map((p) => [p, .34, 15]), ...g1.map((p, i) => [p, .56 + i * .012, 14]), ...g2.map((p, i) => [p, .76 + i * .012, 13]), ...g3.map((p, i) => [p, .93 + i * .02, 13])];
  return { trunk, g0, g1, g2, g3, segs, nodes, you: g3[1] };
})();
// o: { a, lit (gold glow on the 5 children), youA }
export function tree(ctx, t, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  for (const [pts, u0, u1] of TREE.segs) { const v = span(u, u0, u1); if (v > 0) ink(ctx, pts, v, { w: 4.2, head: v < 1 }); }
  for (const [[x, y], u0, r] of TREE.nodes) {
    const v = expoOut(span(u, u0, u0 + .05)); if (v <= 0) continue;
    const isYou = x === TREE.you[0] && y === TREE.you[1];
    if (isYou) { E.halo(ctx, x, y, 34 * v, .5, PAL.coat, PAL.gold0); ctx.fillStyle = PAL.coat; }
    else ctx.fillStyle = PAL.gold2;
    ctx.beginPath(); ctx.arc(x, y, r * v, 0, TAU); ctx.fill();
    if (!isYou) { ctx.fillStyle = rgba(PAL.gold0, .8); ctx.beginPath(); ctx.arc(x - r * .25, y - r * .3, r * .3 * v, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

// ===================================================================================================================== small figures
// a child pictogram (head + body), standing on (x, y); o.dot → dotted outline instead of ink fill; o.up 0..1 stands up from the line
export function kid(ctx, x, y, h, o = {}) {
  const up = expoOut(clamp(o.up ?? 1)); if (up <= 0) return; h *= up;
  const p = new Path2D();
  p.arc(x, y - h * .82, h * .16, 0, TAU);
  const b = new Path2D(); b.moveTo(x - h * .2, y); b.quadraticCurveTo(x - h * .24, y - h * .58, x, y - h * .62); b.quadraticCurveTo(x + h * .24, y - h * .58, x + h * .2, y); b.closePath();
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const dot = clamp(o.dot ?? 0), col = o.col ?? PAL.gold2;
  if (dot < 1) { ctx.globalAlpha *= 1 - dot; ctx.fillStyle = col; ctx.fill(p); ctx.fill(b); ctx.globalAlpha /= Math.max(1e-3, 1 - dot); }
  if (dot > 0) { ctx.globalAlpha *= dot; ctx.strokeStyle = col; ctx.lineWidth = h * .035; ctx.setLineDash([h * .06, h * .07]); ctx.stroke(p); ctx.stroke(b); }
  ctx.restore();
}
// a small paper-cut person (lifted scenes): wraps F.other with the cut-paper palette, warm rim from the window light
export const fig = (ctx, x, y, h, o = {}) => F.other(ctx, x, y, h, { rim: o.rim ?? mixHex(PAL.gold2, PAL.cutLit, .3), ...o });

// ===================================================================================================================== the tag
// SINGULARITY on a small cream tag hanging from (x, y) by a short string; s = scale; o.u rises the type, o.swing
export function tag(ctx, t, x, y, s, o = {}) {
  const sw = (o.swing ?? 0) + .03 * Math.sin(t * 1.3);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.scale(s, s); ctx.globalAlpha *= o.a ?? 1;
  ctx.strokeStyle = graphite(.8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 36); ctx.stroke();
  const w = 300, h = 70;
  ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = 10; ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 6;
  const p = new Path2D(); p.moveTo(-w / 2 + 22, 36); p.lineTo(w / 2, 36); p.lineTo(w / 2, 36 + h); p.lineTo(-w / 2 + 22, 36 + h); p.lineTo(-w / 2, 36 + h / 2); p.closePath();
  ctx.fillStyle = PAL.card; ctx.fill(p); ctx.shadowColor = 'transparent';
  ctx.fillStyle = PAL.gold3; ctx.beginPath(); ctx.arc(-w / 2 + 26, 36 + h / 2, 7, 0, TAU); ctx.fill();
  label(ctx, 'SINGULARITY', 14, 36 + h * .68, 34, o.u ?? 1, { align: 'center', col: PAL.cAccent, weight: 700, spacing: .14 });
  ctx.restore();
}

// ===================================================================================================================== graphite marks
// a thread (pencil) drawn from a to b up to u; sag in px
export function thread(ctx, a, b, u, o = {}) {
  if (u <= 0) return; const pts = []; for (let i = 0; i <= 30; i++) { const s = i / 30; pts.push([lerp(a[0], b[0], s), lerp(a[1], b[1], s) + Math.sin(Math.PI * s) * (o.sag ?? 30)]); }
  ctx.save(); ctx.strokeStyle = graphite(o.a ?? .55); ctx.lineWidth = o.w ?? 2; ctx.lineCap = 'round'; stroke(ctx, partial(pts, u)); ctx.restore();
}
// a faint pencil steering wheel (the seed of the wheel) at (x, y), r; u draws it
export function pencilWheel(ctx, x, y, r, u, o = {}) {
  if (u <= 0) return; ctx.save(); ctx.strokeStyle = graphite(o.a ?? .5); ctx.lineWidth = o.w ?? 2.4; ctx.lineCap = 'round';
  const a0 = -2.2; ctx.beginPath(); ctx.arc(x, y, r, a0, a0 + TAU * clamp(u / .6)); ctx.stroke();
  const v = span(u, .55, 1); if (v > 0) { ctx.beginPath(); ctx.arc(x, y, r * .22, 0, TAU * v); ctx.stroke();
    for (const a of [Math.PI / 2, Math.PI * 7 / 6, -Math.PI / 6]) { const e = clamp(v * 1.4); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * .22, y + Math.sin(a) * r * .22); ctx.lineTo(x + Math.cos(a) * r * lerp(.22, .96, e), y + Math.sin(a) * r * lerp(.22, .96, e)); ctx.stroke(); } }
  ctx.restore();
}
// a pencil (graphite stick) whose tip is at (x, y), lifted by lift (0 = touching)
export function pencil(ctx, x, y, lift = 0, o = {}) {
  ctx.save(); ctx.translate(x + lift * 40, y - lift * 70); ctx.rotate(-.75); ctx.globalAlpha *= o.a ?? 1;
  ctx.shadowColor = rgba(PAL.desk0, .4); ctx.shadowBlur = 8 + lift * 10; ctx.shadowOffsetX = 6 + lift * 16; ctx.shadowOffsetY = 8 + lift * 20;
  ctx.fillStyle = PAL.cut2; ctx.fillRect(0, -9, 190, 18); ctx.shadowColor = 'transparent';
  ctx.fillStyle = PAL.cutLit; ctx.fillRect(0, -9, 190, 5);
  ctx.fillStyle = PAL.cardShade; ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(-30, 0); ctx.lineTo(0, 9); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAL.ink1; ctx.beginPath(); ctx.moveTo(-20, -3); ctx.lineTo(-30, 0); ctx.lineTo(-20, 3); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ===================================================================================================================== c04 · the desk
// The desk diorama (draw inside lifted()): a desk with a warm lamp, a researcher (indigo silhouette) at a warm screen, a cool screen on the
// right. o: { work (typing phase), warmLines 0..1, cool 0..1 (the cool screen glows), coolLines 0..1, trials 0..1, a }
export const DESK = { x0: 2000, x1: 2820, top: 1585, scr1: [2170, 1395, 230, 140], scr2: [2490, 1352, 300, 169], lamp: [2060, 1430] };
export function desk(ctx, t, o = {}) {
  const D = DESK, fold = clamp(o.fold ?? 0);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (fold > 0) { ctx.translate(0, D.top + 130); ctx.scale(1, 1 - expoIn(fold) * .98); ctx.translate(0, -(D.top + 130)); }
  // the lamp light on the back wall (warm pool) — the scene's light form
  const lw = 1 + .02 * Math.sin(t * 1.7);
  ctx.save(); ctx.shadowColor = 'transparent'; ctx.fillStyle = rad(ctx, D.lamp[0] + 60, D.top - 40, 360 * lw, [[0, rgba(PAL.gold1, .42)], [.45, rgba(PAL.gold2, .14)], [1, rgba(PAL.gold2, 0)]]); ctx.fillRect(D.lamp[0] - 320, D.top - 420, 760, 560); ctx.restore();
  // desk top + legs (cut paper)
  const dp = new Path2D(); dp.rect(D.x0, D.top, D.x1 - D.x0, 26); dp.rect(D.x0 + 30, D.top + 26, 22, 120); dp.rect(D.x1 - 52, D.top + 26, 22, 120);
  F.paperCut(ctx, dp, PAL.cut1, { edgeCol: mixHex(PAL.cutLit, PAL.gold2, .5) });
  // the lamp (arm + shade)
  const lp = new Path2D(); lp.rect(D.lamp[0] - 4, D.lamp[1] + 40, 8, D.top - D.lamp[1] - 40); lp.moveTo(D.lamp[0] - 46, D.lamp[1] + 44); lp.lineTo(D.lamp[0] + 40, D.lamp[1] + 44); lp.lineTo(D.lamp[0] + 14, D.lamp[1]); lp.lineTo(D.lamp[0] - 22, D.lamp[1]); lp.closePath(); lp.rect(D.lamp[0] - 30, D.top - 8, 60, 8);
  F.paperCut(ctx, lp, PAL.cut2);
  E.halo(ctx, D.lamp[0] - 3, D.lamp[1] + 52, 26, .9, PAL.gold1, PAL.gold0);
  // screen 1 (warm): a task card with dashed lines (code, unreadable)
  const [ax, ay, aw, ah] = D.scr1;
  scrBox(ctx, ax, ay, aw, ah, PAL.cut0);
  ctx.save(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = rgba(PAL.gold1, .16); ctx.fillRect(ax + 6, ay + 6, aw - 12, ah - 12);
  codeLines(ctx, ax + 18, ay + 22, aw - 36, 6, o.warmLines ?? 0, PAL.gold2, 77);
  ctx.restore();
  // the researcher: an indigo silhouette at the warm screen (typing: the arms move a little)
  const ty = Math.sin((o.work ?? 0) * 9) * .05;
  fig(ctx, 2105, D.top + 2, 250, { dir: 1, lean: .08, armR: [1.25 + ty, 1.9], armL: [1.1 - ty, 1.95], look: .15, rim: PAL.gold2 });
  // screen 2 (cool): the machine, alone — lines write themselves
  const [bx, by, bw, bh] = D.scr2, cg = clamp(o.cool ?? 0);
  scrBox(ctx, bx, by, bw, bh, PAL.cut0);
  ctx.save(); ctx.shadowColor = 'transparent';
  if (cg > 0) {
    ctx.fillStyle = rad(ctx, bx + bw / 2, by + bh / 2, bw * .9, [[0, rgba(PAL.cool1, .3 * cg)], [1, rgba(PAL.cool2, .08 * cg)]]); ctx.fillRect(bx + 6, by + 6, bw - 12, bh - 12);
    codeLines(ctx, bx + 22, by + 26, bw - 44, 6, o.coolLines ?? 0, PAL.cool0, 77);
  }
  ctx.restore();
  // trials: four marks above the cool screen, ✓ ✓ ✗ ✗ and 50 %
  const tr = o.trials ?? 0;
  if (tr > 0) {
    for (let i = 0; i < 4; i++) { const v = span(tr, i * .14, i * .14 + .22); if (v <= 0) continue; const x = bx + 24 + i * 52, y = by - 74;
      ctx.save(); ctx.strokeStyle = i < 2 ? PAL.cool1 : PAL.ink1; ctx.lineWidth = 6; ctx.lineCap = 'round';
      const pts = i < 2 ? [[x - 14, y], [x - 3, y + 12], [x + 16, y - 16]] : [[x - 12, y - 12], [x + 12, y + 12]];
      stroke(ctx, partial(pts, v)); if (i >= 2 && v > .5) stroke(ctx, partial([[x + 12, y - 12], [x - 12, y + 12]], (v - .5) * 2)); ctx.restore(); }
    label(ctx, '50 %', bx + 24 + 4 * 52 + 6, by - 60, 44, span(tr, .6, 1), { serif: true, col: PAL.cool1 });
  }
  ctx.restore();
  return { scr2: D.scr2 };
}
function scrBox(ctx, x, y, w, h, col) {
  const p = new Path2D(); p.rect(x - 10, y - 10, w + 20, h + 20); p.rect(x + w / 2 - 8, y + h + 10, 16, DESK.top - (y + h + 10)); p.rect(x + w / 2 - 40, DESK.top - 7, 80, 7);
  F.paperCut(ctx, p, col, { edgeCol: PAL.cutLit });
  ctx.save(); ctx.shadowColor = 'transparent'; ctx.fillStyle = PAL.desk1; ctx.fillRect(x, y, w, h); ctx.restore();
}
// dashed "code" lines (unreadable), revealed left→right, line by line (u 0..1)
function codeLines(ctx, x, y, w, n, u, col, seed) {
  if (u <= 0) return; const r = prng(seed); ctx.fillStyle = col;
  for (let i = 0; i < n; i++) {
    let cx = x + (r() < .4 ? 20 : 0); const v = clamp(u * n - i); const end = x + w * (.55 + r() * .45);
    while (cx < end) { const len = 10 + r() * 34; const vis = Math.min(cx + len, x + (end - x) * v); if (vis > cx) ctx.fillRect(cx, y + i * 16, vis - cx, 6); cx += len + 8; }
  }
}

// ===================================================================================================================== c04/c05 · the bar
// The task bar on the sheet: cool light, origin BAR.x, BAR.y, length L (px); jumps: the ×2 ticks at given lengths.
export const BAR = { x: 2050, y: 1900, hour: 125 };   // 1 h = 125 px: 8 h at x 3050, 16 h at 4050
export function bar(ctx, t, L, o = {}) {
  if (L <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  lightLine(ctx, [[BAR.x, BAR.y], [BAR.x + L, BAR.y]], 1, { w: 9, spill: o.spill ?? 0 });
  ctx.fillStyle = PAL.cool0; ctx.fillRect(BAR.x - 3, BAR.y - 16, 6, 32);   // the start mark
  for (const [x, u] of o.ticks ?? []) {
    if (u <= 0 || x > L + 1) continue;
    ctx.fillStyle = rgba(PAL.cool1, .9 * clamp(u * 2)); ctx.fillRect(BAR.x + x - 2, BAR.y + 14, 4, 22);
    label(ctx, '×2', BAR.x + x, BAR.y + 78, 36, u, { align: 'center', col: PAL.cool1, weight: 600, spacing: .02 });
  }
  ctx.restore();
}

// ===================================================================================================================== c05 · stairs
// Cool stairs on the light line's field: start (SC.x, SC.y), tread SC.tw, risers = the bar's jumps (100, 100, 200, 400, 800, 1600 …).
export const SC = { x: 1960, y: 960, tw: 120, rises: [1, 1, 2, 4, 8, 16].map((k) => k * BAR.hour) };
// the stairs as a polyline up to step n (fractional draws the next), narrow: tread width factor for step 5 (sped up once)
export function stairPts(narrow = 1) {
  const out = [[SC.x, SC.y]]; let x = SC.x, y = SC.y;
  SC.rises.forEach((r, k) => { x += SC.tw * (k === 5 ? narrow : 1); out.push([x, y]); y -= r; out.push([x, y]); });
  return out;
}
// the 1960 stairs on the formula: each doubling comes sooner (every step half as wide), risers double; ends straight up at t0
export const goldStairPts = (() => {
  const { yearX, popY, fPop, CH } = F; const out = []; let yr = 1960, d = CH.t0 - yr;
  out.push([yearX(yr), popY(fPop(yr))]);
  for (let k = 0; k < 9; k++) { const yr2 = CH.t0 - d / 2; const y0 = popY(fPop(yr)); out.push([yearX(yr2), y0]); const y1 = Math.max(CH.top - 300, popY(fPop(yr2))); out.push([yearX(yr2), y1]); yr = yr2; d /= 2; if (y1 <= CH.top - 300) break; }
  return out;
})();

// ===================================================================================================================== c05 · the ghost
// The 1960 curve traced on a sheet of tracing paper: m = 0 lies over the formula, m = 1 laid over the light line (same remaining-years
// parameter, both hyperbolas; asymptote x 1638 → 2640). Returns the points of the traced curve.
const GH = { d0: 71.87, d1: .6, n: 90 };
export function ghostPts(m) {
  const { yearX, popY, fPop, CH } = F; const out = [];
  for (let i = 0; i <= GH.n; i++) {
    const d = GH.d0 * Math.pow(GH.d1 / GH.d0, i / GH.n);
    const x0 = yearX(CH.t0 - d), y0 = Math.max(CH.top - 240, popY(fPop(CH.t0 - d)));
    const x1 = 2640 - d * 9.46, y1 = Math.max(-1720, 960 - 12950 * (1 / d - 1 / GH.d0));
    out.push([lerp(x0, x1, m), lerp(y0, y1, m)]);
  }
  return out;
}
export const ghostBox = (m) => [lerp(1080, 1860, m), lerp(-1060, -1800, m), lerp(1760, 2780, m), lerp(900, 1060, m)];
export function tracing(ctx, t, m, o = {}) {
  const [x0, y0, x1, y1] = ghostBox(m), a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(PAL.card, .085); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = rgba(PAL.card, .32); ctx.lineWidth = 3; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  ctx.fillStyle = rgba(PAL.card, .05); ctx.fillRect(x0, y0, x1 - x0, 60);   // a slightly folded top edge
  ink(ctx, ghostPts(m), o.u ?? 1, { w: 6, dash: [3.2, 2.4], head: false, col: PAL.gold1 });
  ctx.restore();
}

// ===================================================================================================================== c04 · hourglass vignette
// coffee cup (paper cut) with steam; window card (dawn → dusk), coat on a hook (lifts off)
export function cup(ctx, t, x, y, s, o = {}) {
  const p = new Path2D(); p.moveTo(x - 34 * s, y - 62 * s); p.lineTo(x + 34 * s, y - 62 * s); p.lineTo(x + 28 * s, y); p.lineTo(x - 28 * s, y); p.closePath();
  p.moveTo(x + 32 * s, y - 50 * s); p.arc(x + 36 * s, y - 34 * s, 16 * s, -Math.PI / 2, Math.PI / 2); p.lineTo(x + 30 * s, y - 24 * s); p.arc(x + 36 * s, y - 34 * s, 8 * s, Math.PI / 2, -Math.PI / 2, true); p.closePath();
  F.paperCut(ctx, p, PAL.card, { edgeCol: PAL.gold2, edgeA: .8 });
  ctx.save(); ctx.shadowColor = 'transparent'; ctx.strokeStyle = rgba(PAL.card, .55 * (o.steam ?? 1)); ctx.lineWidth = 5 * s; ctx.lineCap = 'round';
  for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const v = i / 12, yy = y - 75 * s - v * 90 * s, xx = x + (k - 1) * 18 * s + Math.sin(v * 5 + t * 2.4 + k) * 7 * s; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  ctx.restore();
}
export function windowSmall(ctx, t, x, y, w, h, dusk) {
  const p = new Path2D(); p.rect(x - w / 2 - 12, y - h / 2 - 12, w + 24, h + 24); F.paperCut(ctx, p, PAL.cut1);
  ctx.save(); ctx.shadowColor = 'transparent';
  const top = mixHex('#f7d9a0', '#3b3f86', dusk), bot = mixHex('#fff4cf', '#7d5a8a', dusk);
  ctx.fillStyle = lin(ctx, 0, y - h / 2, 0, y + h / 2, [[0, top], [1, bot]]); ctx.fillRect(x - w / 2, y - h / 2, w, h);
  const sy = lerp(y + h * .1, y + h * .62, dusk); E.halo(ctx, x + w * .12, sy, w * .22, .8, dusk > .5 ? '#ffb070' : PAL.gold1, PAL.gold0);
  ctx.fillStyle = PAL.cut1; ctx.fillRect(x - 5, y - h / 2, 10, h); ctx.fillRect(x - w / 2, y - 5, w, 10);
  ctx.restore();
}
export function coatHook(ctx, t, x, y, s, lift) {
  const hp = new Path2D(); hp.rect(x - 4 * s, y - 6 * s, 30 * s, 8 * s); F.paperCut(ctx, hp, PAL.cut2);
  const k = expoOut(lift), dy = -k * 70 * s, dx = k * 50 * s;
  ctx.save(); ctx.translate(x + 16 * s + dx, y + dy); ctx.rotate(k * .25 + .02 * Math.sin(t * 1.3));
  const c = new Path2D(); c.moveTo(-10 * s, 0); c.lineTo(10 * s, 0); c.lineTo(46 * s, 30 * s); c.lineTo(56 * s, 200 * s); c.lineTo(-56 * s, 200 * s); c.lineTo(-46 * s, 30 * s); c.closePath();
  F.paperCut(ctx, c, PAL.cutLit, { edgeCol: PAL.gold2, edgeA: .8, edgeW: 4 });
  // lapels and the opening: reads as a coat, not a blob
  const v = new Path2D(); v.moveTo(-10 * s, 0); v.lineTo(0, 70 * s); v.lineTo(10 * s, 0); v.lineTo(4 * s, 0); v.lineTo(0, 40 * s); v.lineTo(-4 * s, 0); v.closePath();
  ctx.fillStyle = PAL.cut0; ctx.fill(v);
  ctx.strokeStyle = rgba(PAL.gold2, .55); ctx.lineWidth = 2.5 * s; ctx.beginPath(); ctx.moveTo(0, 70 * s); ctx.lineTo(0, 196 * s); ctx.stroke();
  ctx.fillStyle = rgba(PAL.gold2, .7); [100, 140].forEach((yy) => { ctx.beginPath(); ctx.arc(-8 * s, yy * s, 3.5 * s, 0, 7); ctx.fill(); });
  ctx.restore();
}

// ===================================================================================================================== c03 · the three windows
// One lit window of the paper-cut theatre (draw inside lifted()). (cx, cy) = centre, g = grow 0..1 (from the tree node), lit 0..1,
// p = the scene's own progress 0..1: 0 doctor + child (the child sits up) · 1 the girl walks into the school door · 2 the couple, the page turns
export const WIN = { w: 300, h: 400 };
export function windowCard(ctx, t, i, cx, cy, g, lit, p) {
  if (g <= 0) return; const k = expoOut(g), w = WIN.w, h = WIN.h;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
  const arch = (pad) => { const q = new Path2D(); q.moveTo(-w / 2 - pad, h / 2 + pad); q.lineTo(-w / 2 - pad, -h / 2 + w / 2); q.arc(0, -h / 2 + w / 2, w / 2 + pad, Math.PI, 0); q.lineTo(w / 2 + pad, h / 2 + pad); q.closePath(); return q; };
  F.paperCut(ctx, arch(18), PAL.cut1, { edgeCol: mixHex(PAL.cutLit, PAL.gold2, .5) });
  ctx.shadowColor = 'transparent';
  const inner = arch(0); ctx.save(); ctx.clip(inner);
  const L = .55 + .45 * clamp(lit), br = 1 + .02 * Math.sin(t * 1.9 + i);
  // the warm light inside (each window has its own source)
  const src = [[-60, -60], [70, 40], [0, -40]][i];
  ctx.fillStyle = PAL.cut0; ctx.fillRect(-w, -h, w * 2, h * 2);
  ctx.fillStyle = rad(ctx, src[0], src[1], 330 * br, [[0, rgba(PAL.gold1, .9 * L)], [.35, rgba(PAL.gold2, .55 * L)], [.75, rgba(PAL.gold3, .22 * L)], [1, rgba(PAL.cut0, 0)]]); ctx.fillRect(-w, -h, w * 2, h * 2);
  ctx.translate(0, h / 2 - 22);   // floor line (local origin: floor centre)
  ctx.fillStyle = rgba(PAL.desk0, .35); ctx.fillRect(-w, 0, w * 2, 40);
  const rim = mixHex(PAL.gold1, PAL.gold2, .3);
  if (i === 0) {
    // the bed, the child sitting up straight (it survived), the doctor bending to it
    const bp = new Path2D(); bp.rect(-5, -70, 150, 34); bp.rect(0, -36, 14, 36); bp.rect(128, -36, 14, 36); bp.rect(118, -96, 26, 60);
    F.paperCut(ctx, bp, PAL.cut2, { edgeCol: rim, edgeA: .7 });
    ctx.fillStyle = PAL.card; ctx.beginPath(); ctx.ellipse(110, -74, 22, 9, 0, 0, 6.29); ctx.fill();   // pillow
    const up = expoOut(clamp(p));
    ctx.save(); ctx.translate(72, -70); ctx.rotate(lerp(1.35, 0, up));
    kid(ctx, 0, 0, 92, { col: PAL.cut2 }); ctx.restore();
    ctx.save(); ctx.translate(72, -70); ctx.rotate(lerp(1.35, 0, up)); ctx.strokeStyle = rgba(rim, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(-1, -92 * .82, 92 * .16, Math.PI * .9, Math.PI * 1.6); ctx.stroke(); ctx.restore();
    fig(ctx, -62, 0, 236, { dir: 1, lean: lerp(.34, .22, up), armR: [1.45, 1.55], armL: [.5, .35], look: lerp(-.2, .1, up), rim });
  } else if (i === 1) {
    // the school door: warm light in a doorway under a small pediment; the girl walks in with her bag
    const dx = 40, dw = 92, dh = 206;
    const sp = new Path2D(); sp.rect(dx - 26, -dh - 30, dw + 52, 30); sp.moveTo(dx - 40, -dh - 30); sp.lineTo(dx + dw / 2, -dh - 92); sp.lineTo(dx + dw + 40, -dh - 30); sp.closePath(); sp.rect(dx - 26, -dh, 18, dh); sp.rect(dx + dw + 8, -dh, 18, dh);
    F.paperCut(ctx, sp, PAL.cut2, { edgeCol: rim, edgeA: .7 });
    ctx.fillStyle = lin(ctx, 0, -dh, 0, 0, [[0, PAL.gold1], [1, PAL.gold0]]); ctx.fillRect(dx - 8, -dh, dw + 16, dh);
    E.halo(ctx, dx + dw / 2, -dh * .45, 120, .35 * L, PAL.gold1, PAL.gold0);
    const gx = lerp(-118, dx + dw * .55, sineIO(p)), into = span(gx, dx - 10, dx + dw * .5);
    ctx.save(); ctx.globalAlpha *= 1 - smooth(into) * .92;
    fig(ctx, gx, 0, 128, { dir: 1, walk: p * 13, rim });
    ctx.fillStyle = PAL.cut0; ctx.beginPath(); ctx.roundRect(gx - 128 * .2, -128 * .72, 128 * .13, 128 * .22, 3); ctx.fill();   // the school bag on her back
    ctx.restore();
    if (into > 0) { ctx.fillStyle = rgba(PAL.gold0, .5 * into); ctx.fillRect(dx - 8, -dh, dw + 16, dh); }
  } else {
    // the kitchen table under a lamp, the couple, the wall calendar: a page turns (they plan)
    ctx.strokeStyle = rgba(PAL.cutLit, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -h + 20); ctx.lineTo(0, -270); ctx.stroke();
    const shade = new Path2D(); shade.moveTo(-40, -230); shade.lineTo(40, -230); shade.lineTo(20, -272); shade.lineTo(-20, -272); shade.closePath(); F.paperCut(ctx, shade, PAL.cut2, { edgeCol: rim });
    ctx.fillStyle = rad(ctx, 0, -228, 210, [[0, rgba(PAL.gold0, .55 * L)], [1, rgba(PAL.gold1, 0)]]); ctx.beginPath(); ctx.moveTo(-40, -230); ctx.lineTo(40, -230); ctx.lineTo(150, -60); ctx.lineTo(-150, -60); ctx.closePath(); ctx.fill();
    E.halo(ctx, 0, -228, 20, .9, PAL.gold1, PAL.gold0);
    fig(ctx, -86, 0, 214, { dir: 1, lean: .06, armR: [1.2, 1.7], rim });
    fig(ctx, 86, 0, 204, { dir: -1, lean: .05, armR: [1.15, 1.6], long: true, rim });
    const tp = new Path2D(); tp.rect(-118, -104, 236, 18); tp.rect(-100, -86, 14, 86); tp.rect(86, -86, 14, 86); F.paperCut(ctx, tp, PAL.cut2, { edgeCol: rim, edgeA: .8 });
    // the calendar: a cream block; its top page turns up over the ring (scaleY flips)
    const cx2 = 104, cy2 = -300, cw = 64, chh = 76;
    ctx.fillStyle = PAL.cardShade; ctx.fillRect(cx2 - cw / 2, cy2, cw, chh);
    ctx.fillStyle = PAL.cInk1; for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 4; c2++) ctx.fillRect(cx2 - cw / 2 + 8 + c2 * 13, cy2 + 22 + r * 12, 7, 5);
    const f = sineIO(p), sy = Math.cos(f * Math.PI);
    ctx.save(); ctx.translate(cx2, cy2); ctx.scale(1, sy); ctx.fillStyle = sy > 0 ? PAL.card : PAL.cardShade; ctx.fillRect(-cw / 2, 0, cw, chh);
    if (sy > 0) { ctx.fillStyle = PAL.cInk0; ctx.fillRect(-cw / 2, 0, cw, 14); ctx.fillStyle = PAL.cInk1; for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 4; c2++) ctx.fillRect(-cw / 2 + 8 + c2 * 13, 22 + r * 12, 7, 5); }
    ctx.restore();
    ctx.fillStyle = PAL.gold3; ctx.beginPath(); ctx.arc(cx2, cy2 - 3, 4, 0, 6.29); ctx.fill();
  }
  ctx.restore();
  ctx.restore();
}
