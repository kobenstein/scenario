// Film 73 · B3 helpers (c10–c13, builder B3; owned by B3, imported only by scenes/sc10–sc13.mjs).
// Inner seams of the B3 group (both sides draw the same plate ±S.SEAM_HALF with the same creep + breathe, like lib/f73_world.mjs):
//   c10 | c11 at "It doesn't have to go"   plateHouses: the ground line, your house (window lit), the neighbour's house (dark), you between
//   c11 | c12 at 'Part of that comes down' plateFork:   the two price curves forking from one point (down: cheap, gold · up: costs, cream)
//   c12 | c13 at 'So is yours the first'    a planned hard cut (W E.01): the bead of THE ANSWER sits where the stone's blank sits after the cut
// Local strings (not in F.SOURCES; listed in the B3 report): LOCAL below.
import * as E from './f10_editorial.mjs';
import * as F from './f73_kit.mjs';
import * as S from './f73_world.mjs';
import * as X from './f73_stage.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, rad, lin } = E;
const { GOLD, COOL, CREAM, LAMP, AGE, PAPER } = F;
const TAU = Math.PI * 2;

export const LOCAL = {
  notForever: 'NOT FOREVER', today: 'TODAY', y2001: '2001', costs: 'US HEALTH COSTS', powerful: 'THE POWERFUL',
  phases: ['PHASE 1', 'PHASE 2', 'PHASE 3'], sweden: 'SWEDEN', feared: 'FEARED', projected: 'PROJECTED', subscribe: 'SUBSCRIBE',
};
// 2% read out of the fact-checked Montana line (never retyped)
export const pct = (s) => (String(s).match(/\d+\s?%/) || ['2%'])[0].replace(/\s/, '');

export const lab = (t, a, b, inD = .7, outD = .45) => span(t, a, a + inD) * (1 - span(t, b - outD, b + .1));
export const ease = (t, a, b, f = sineIO) => f(span(t, a, b));
export function viewOf(t, K, damp = true) { const v = X.viewPath(t, K), b = S.breathe(t), k = damp ? 1 - span(v.s, 1.6, 4) * .7 : 1; return { x: v.x + b.dx * k, y: v.y + b.dy * k, s: v.s }; }
export const shift = (v, ox, oy = 0) => ({ x: v.x - ox, y: v.y - oy, s: v.s });
export const quad = (a, c, b, u) => [(1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]];

// the night ground + (the good version, c11 → c12) a dawn warmth rising from below (scenario-motion: reserved for the solution part)
export const DAWN = { violet: '#3b2f6e', amber: '#7a3b17', glow: '#e0a060' };
export function ground(ctx, t, v, o = {}) {
  X.ground(ctx, t, v, { lx: o.lx, ly: o.ly, pool: o.pool ?? 1, stars: (o.stars ?? 1) * (1 - .45 * (o.dawn ?? 0)) });
  const d = clamp(o.dawn ?? 0); if (d <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, rgba(DAWN.violet, .05 * d)], [.45, rgba(DAWN.violet, .2 * d)], [.78, rgba(DAWN.amber, .2 * d)], [1, rgba(DAWN.glow, .16 * d)]]);
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rad(ctx, W * .5, H * 1.08, 1100, [[0, rgba(GOLD.halo, .12 * d)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// text in screen space, at a sheet point
export const scr = (v, x, y) => X.toScreen(v, x, y);

// ------------------------------------------------------------------------------------------------ plateHouses (c10 | c11)
// internal coordinates (centred on 960); c10 draws it with its view shifted by PH.ox
export const PH = { y: 760, x0: 60, x1: 1860, you: 800, nb: 1120, w: 230, du: 962, ox: 740, view: { x: 960, y: 560 } };
export function drawHouses(ctx, t, v, q = {}) {
  ground(ctx, t, v, { lx: q.lx ?? 960, ly: q.ly ?? 640, dawn: q.dawn ?? 0 });
  X.inView(ctx, v, (s) => {
    if (q.line !== false) X.lifeline(ctx, t, PH.x0, PH.x1, PH.y, s, { u: q.lineU ?? 1, from: 'centre', spark: false });
    const hh = PH.w * 1.13;
    for (const [x, u, lit] of [[PH.you, q.h1 ?? 1, q.lit1 ?? 1], [PH.nb, q.h2 ?? 1, q.lit2 ?? 0]]) {
      if (u <= 0) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(x - PH.w, PH.y - hh - 40, PH.w * 2, hh + 40 - 3 / s); ctx.clip();
      ctx.translate(0, (1 - quartIO(u)) * (hh + 10)); F.house(ctx, t, x, PH.y - 2 / s, PH.w, { lit: lit * (.94 + .06 * Math.sin(t * 1.3 + x)) });
      const w2 = PH.w / 2, hy = PH.y - 2 / s - PH.w * .7; ctx.strokeStyle = rgba(CREAM, .22); ctx.lineWidth = 1.6 / s; ctx.beginPath(); ctx.moveTo(x - w2, PH.y - 2 / s); ctx.lineTo(x - w2, hy); ctx.lineTo(x - w2 - PH.w * .06, hy); ctx.lineTo(x, hy - PH.w * .42); ctx.lineTo(x + w2 + PH.w * .06, hy); ctx.lineTo(x + w2, hy); ctx.lineTo(x + w2, PH.y - 2 / s); ctx.stroke(); ctx.beginPath(); ctx.restore();
    }
    if ((q.du ?? 1) > 0) { ctx.save(); ctx.globalAlpha *= q.du ?? 1; F.du(ctx, q.duX ?? PH.du, PH.y - 2 / s, 92, { pose: 'stand', dir: 1, look: .1 }); ctx.restore(); }
    if (q.mid) q.mid(ctx, s);
  });
}
export const viewHouses = (t, T) => { const b = S.breathe(t); return { x: PH.view.x + b.dx, y: PH.view.y + b.dy, s: S.creep(t, T, "It doesn't have to go") }; };
export function plateHouses(ctx, t, T) { drawHouses(ctx, t, viewHouses(t, T), {}); }

// ------------------------------------------------------------------------------------------------ plateFork (c11 | c12)
// one start point (2001, $95 million) and two curves: DOWN (gold, the genome: cheap fast) and UP (cream, US health costs)
export const PF = { x0: 430, y0: 520, x1: 1430, base: 790, up: 250, open: 230, view: { x: 960, y: 540 } };
export const downY = (p) => PF.y0 + (PF.base - 12 - PF.y0) * (1 - Math.exp(-4.2 * p)) / (1 - Math.exp(-4.2));
export const upY = (p) => PF.y0 - (PF.y0 - PF.up) * Math.pow(p, 1.7);
export const curve = (f, a = 0, b = 1, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const p = lerp(a, b, i / n); return [PF.x0 + (PF.x1 - PF.x0) * p, f(p)]; });
// q: down / up 0..1 (draw), axis 0..1, open 0..1 (the dashed open continuation), flat 0..1 (both curves flatten onto the line y q.flatY)
export function drawFork(ctx, t, s, q = {}) {
  const fl = sineIO(q.flat ?? 0), fy = q.flatY ?? PF.base, F2 = (f) => (p) => lerp(f(p), fy, fl);
  if ((q.axis ?? 1) > 0) X.drawPath(ctx, [[PF.x0 - 60, PF.base], [PF.x1 + PF.open + 40, PF.base]], q.axis ?? 1, { col: rgba(CREAM, .3 * (1 - fl)), w: 1.6 / s });
  const up = q.up ?? 1, dn = q.down ?? 1, op = q.open ?? 1;
  if (up > 0) X.drawPath(ctx, curve(F2(upY)), up, { col: rgba(CREAM, .92), w: 3.2 / s, glow: 6 / s, glowCol: CREAM });
  if (dn > 0) F.goldSpan(ctx, curve(F2(downY)), 0, dn, { w: 3 / s, spark: dn < 1 });
  if (op > 0) {
    const ext = (f, d) => Array.from({ length: 13 }, (_, i) => { const p = 1 + i / 12 * PF.open / (PF.x1 - PF.x0); return [PF.x0 + (PF.x1 - PF.x0) * p, lerp(f(1) + d * (p - 1) * 300, fy, fl)]; });
    X.drawPath(ctx, ext(upY, -.8), op, { col: rgba(CREAM, .55), w: 2.4 / s, dash: [10 / s, 9 / s] });
    X.drawPath(ctx, ext(downY, .02), op, { col: rgba(GOLD.line, .6), w: 2.4 / s, dash: [10 / s, 9 / s] });
  }
  // the fork point
  if (up > 0 || dn > 0) halo(ctx, PF.x0, lerp(PF.y0, fy, fl), 44 / s, .55, GOLD.halo, GOLD.core);
}
export const viewFork = (t, T) => { const b = S.breathe(t); return { x: PF.view.x + b.dx, y: PF.view.y + b.dy, s: S.creep(t, T, 'Part of that comes down') }; };
export function plateFork(ctx, t, T) {
  const v = viewFork(t, T);
  ground(ctx, t, v, { lx: 900, ly: 560, dawn: 1 });
  X.inView(ctx, v, (s) => drawFork(ctx, t, s, {}));
}

// ------------------------------------------------------------------------------------------------ objects
// a ledge: the gold top line from x0 to x1 at y, legs down to the base line (legs 0..1), a dark slab under the top (slab px), railing posts
export function ledge(ctx, t, x0, x1, y, base, s, o = {}) {
  const legs = clamp(o.legs ?? 1), slab = o.slab ?? 0, rail = clamp(o.rail ?? 0);
  if (slab > 0) { ctx.fillStyle = lin(ctx, 0, y, 0, y + slab, [[0, mixHex(P.night1, P.ind2, .75)], [1, mixHex(P.night1, P.ind1, .35)]]); ctx.fillRect(x0, y, x1 - x0, slab); }
  if (rail > 0) {
    const n = 8, rh = (o.railH ?? 26) * rail;
    ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 1.6 / s; ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = lerp(x0 + 10, x1 - 10, i / n); ctx.moveTo(x, y); ctx.lineTo(x, y - rh); }
    ctx.moveTo(x0 + 10, y - rh); ctx.lineTo(x1 - 10, y - rh); ctx.stroke(); ctx.beginPath();
  }
  const pts = legs > 0 ? [[x0, lerp(y, base, legs)], [x0, y], [x1, y], [x1, lerp(y, base, legs)]] : [[x0, y], [x1, y]];
  F.goldSpan(ctx, pts, 0, 1, { w: 3.2 / s, spark: false, a: o.a ?? 1 });
}
// a gate on a line: two cream posts and a beam; o.sym (a symbol on the beam, e.g. '$'), o.u rise out of the line
export function gate(ctx, t, x, y, h, w, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = quartIO(u), top = y - h * k;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = rgba(CREAM, .9); ctx.lineWidth = 4 / s; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, top); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, top); ctx.stroke(); ctx.beginPath();
  const bar = clamp(o.bar ?? 1); if (bar > 0) { ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(x - w / 2, top + 6 / s); ctx.lineTo(lerp(x - w / 2, x + w / 2, bar), top + 6 / s); ctx.stroke(); ctx.beginPath(); }
  if (o.sym && (o.symU ?? 1) > 0) F.goldText(ctx, [[o.sym, 0]], x, top + (o.symY ?? h * .45), (o.symSize ?? 46) / s, F.rise(o.symU ?? 1), { serif: true, align: 'center' });
  ctx.restore();
}
// a weight: a gold drop on a thread hanging from (x, y); u 0..1 (thread draws, the drop lands with a small bounce)
export function weight(ctx, t, x, y, len, r, s, u) {
  u = clamp(u); if (u <= 0) return null;
  const th = span(u, 0, .45), du = expoOut(span(u, .25, 1)), sw = Math.sin(t * 1.7) * 2 / s, ey = y + len * th;
  X.drawPath(ctx, [[x, y], [x + sw, ey]], 1, { col: rgba(CREAM, .7), w: 1.6 / s });
  if (du > 0) {
    const cx = x + sw, cy = ey + r * 1.1;
    halo(ctx, cx, cy, r * 3, .45 * du, GOLD.halo, GOLD.core);
    ctx.fillStyle = rad(ctx, cx - r * .3, cy - r * .3, r * 1.3, [[0, GOLD.hot], [.5, GOLD.body], [1, GOLD.shade]]);
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 1.25 * du); ctx.bezierCurveTo(cx + r * .9 * du, cy - r * .4 * du, cx + r * du, cy + r * .9 * du, cx, cy + r * du); ctx.bezierCurveTo(cx - r * du, cy + r * .9 * du, cx - r * .9 * du, cy - r * .4 * du, cx, cy - r * 1.25 * du); ctx.fill();
    return [cx, cy];
  }
  return null;
}
// a rule card (paper): head = the question; lines 0..1 writes short ink strokes (a rule written), o.text (one Inter line), o.blank
export function ruleCard(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  F.paperCard(ctx, t, x - w / 2, y - h / 2, w, h, { u, head: o.head, headSize: o.headSize ?? 24, rot: o.rot ?? 0, a: o.a });
  const ln = clamp(o.lines ?? 0), k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x - w / 2, y - h / 2 + (1 - k) * 40);
  if (ln > 0) for (let i = 0; i < 3; i++) { const lu = span(ln, i * .25, i * .25 + .5); if (lu <= 0) continue; const ww = (w - 68) * [.86, .7, .5][i] * sineIO(lu);
    ctx.fillStyle = rgba(PAPER.ink, .55); ctx.fillRect(34, h - 84 + i * 22 - (o.text ? 22 : 0), ww, 4); }
  if (o.text) F.goldText(ctx, [[o.text, 0]], 34, h - 26, o.textSize ?? 22, F.rise(o.textU ?? 1), { serif: false, weight: 700, spacing: .06, col: PAPER.ink });
  ctx.restore();
}
// a balance: a post on the line, a beam tilting by tilt (rad, + = right pan down), two pans with words
export function balance(ctx, t, x, y, h, w, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = quartIO(u), top = y - h * k, tl = o.tilt ?? 0, cs = Math.cos(tl), sn = Math.sin(tl);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = rgba(CREAM, .9); ctx.lineWidth = 3.2 / s; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, top); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 40 / s, y); ctx.lineTo(x + 40 / s, y); ctx.stroke(); ctx.beginPath();
  const bw = w / 2 * span(u, .3, 1);
  ctx.beginPath(); ctx.moveTo(x - bw * cs, top - bw * sn); ctx.lineTo(x + bw * cs, top + bw * sn); ctx.stroke(); ctx.beginPath();
  halo(ctx, x, top, 26 / s, .5 * u, GOLD.halo, GOLD.core);
  for (const sd of [-1, 1]) {
    const px = x + sd * bw * cs, py = top + sd * bw * sn, pu = span(u, .55, 1); if (pu <= 0) continue;
    const ph = 90 * pu, pw = 70;
    ctx.lineWidth = 1.6 / s; ctx.strokeStyle = rgba(CREAM, .7); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - pw, py + ph); ctx.moveTo(px, py); ctx.lineTo(px + pw, py + ph); ctx.stroke(); ctx.beginPath();
    ctx.strokeStyle = sd < 0 ? GOLD.body : rgba(AGE.text, .95); ctx.lineWidth = 4 / s; ctx.beginPath(); ctx.moveTo(px - pw - 8, py + ph); ctx.quadraticCurveTo(px, py + ph + 34 * pu, px + pw + 8, py + ph); ctx.stroke(); ctx.beginPath();
    const word = sd < 0 ? o.left : o.right, wu = sd < 0 ? o.leftU : o.rightU;
    if (word && wu > 0) F.goldText(ctx, [[word, sd < 0 ? .8 : 0]], px, py + ph + 78, 30, F.rise(wu), { serif: false, weight: 700, spacing: .12, align: 'center', col: sd < 0 ? CREAM : AGE.text });
  }
  ctx.restore();
}
// a cradle (side view silhouette) in a window: x, y = window centre, w window width; lit 0..1
export function cradleWindow(ctx, t, x, y, w, h, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  halo(ctx, x, y, w * 1.1, .4 * u, LAMP.body, LAMP.core);
  ctx.fillStyle = mixHex(mixHex(P.night0, P.ind1, .5), LAMP.body, u); ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeStyle = mixHex(P.night1, P.ind2, .5); ctx.lineWidth = 6 / s; ctx.strokeRect(x - w / 2, y - h / 2, w, h);
  ctx.beginPath(); ctx.moveTo(x, y - h / 2); ctx.lineTo(x, y + h / 2); ctx.moveTo(x - w / 2, y - h * .05); ctx.lineTo(x + w / 2, y - h * .05); ctx.lineWidth = 4 / s; ctx.stroke(); ctx.beginPath();
  // the cradle: a rocking basket on two rockers, seen against the lamp light
  const c = clamp(o.cradle ?? 1); if (c > 0) {
    const cx = x + w * .02, cy = y + h * .36, cw = w * .46, rock = Math.sin(t * 1.4) * .05;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rock); ctx.globalAlpha *= c; ctx.fillStyle = mixHex(P.night0, P.ind2, .4);
    ctx.beginPath(); ctx.moveTo(-cw / 2, -cw * .28); ctx.quadraticCurveTo(-cw / 2, cw * .08, 0, cw * .1); ctx.quadraticCurveTo(cw / 2, cw * .08, cw / 2, -cw * .28); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(-cw * .34, -cw * .3, cw * .2, Math.PI, 0); ctx.fill();   // the hood
    ctx.lineWidth = 5 / s; ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); ctx.arc(0, -cw * .55, cw * .75, Math.PI * .34, Math.PI * .66); ctx.stroke(); ctx.beginPath();
    ctx.restore();
  }
  ctx.restore();
}
// the SUBSCRIBE tag: a cream paper tag on a thin stick in the grass (a tag, never a button); x, y = the foot in sheet units
export function subscribeTag(ctx, t, x, y, s, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), sh = 150 * k, sway = Math.sin(t * .9) * .025;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway); ctx.scale(o.scale ?? 1.4, o.scale ?? 1.4);
  ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.4 / s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -sh); ctx.stroke(); ctx.beginPath();
  if (k > .3) {
    const tu = span(k, .3, 1), tw = 230, th = 62, ty = -sh - 6;
    ctx.globalAlpha *= clamp(tu * 2);
    ctx.translate(0, ty); ctx.rotate(-.04);
    ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-8 + 5, -th + 6, tw, th, [4, 18, 18, 4]); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, -th, tw, 0, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-8, -th, tw * span(tu, 0, .6), th, [4, 18, 18, 4]); ctx.fill();
    ctx.fillStyle = mixHex(PAPER.edge, P.night0, .3); ctx.beginPath(); ctx.arc(8, -th / 2, 5, 0, TAU); ctx.fill();
    F.goldText(ctx, [[LOCAL.subscribe, 0]], 28, -th / 2 + 11, 28, F.rise(span(tu, .4, 1)), { serif: false, weight: 700, spacing: .14, col: PAPER.ink });
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the old stones (copied geometry of S, layer .5)
// lib/f73_world.mjs keeps them private; E.12 lights them one by one, so their positions are mirrored here (same numbers, never edited there).
export const OLD = [[430, 128, 112, '1889 – 1951'], [690, 104, 96, '1903 – 1972'], [905, 140, 118, '1921 – 1994'], [1905, 118, 104, '1932 – 2006'], [2120, 146, 122, '1947 – 2019'], [180, 112, 100, '1876 – 1940']];
export const ridgeY = (x) => 742 + Math.sin(x * .0013 + .6) * 24 + Math.sin(x * .0047) * 6;
// light(i) 0..1 per stone (order left → right is the caller's); drawn over S.stoneWorld in the ridge layer
export function lightOldStones(ctx, t, v, light) {
  X.inView(ctx, X.layerView(v, .5), () => {
    const order = [5, 0, 1, 2, 3, 4];
    order.forEach((j, i) => {
      const [x, h, w, yrs] = OLD[j], l = clamp(light(i)); if (l <= 0) return;
      const by = ridgeY(x) + 8, top = by - h;
      halo(ctx, x, top + h * .4, w * 1.4, .45 * l, GOLD.halo, GOLD.core);
      ctx.save(); ctx.globalAlpha *= l; ctx.strokeStyle = rgba(GOLD.line, .5); ctx.lineWidth = 2;
      const r = w / 2; ctx.beginPath(); ctx.moveTo(x - r, by); ctx.lineTo(x - r, top + r * .7); ctx.quadraticCurveTo(x - r, top, x, top); ctx.quadraticCurveTo(x + r, top, x + r, top + r * .7); ctx.lineTo(x + r, by); ctx.stroke(); ctx.beginPath();
      E.glowText(ctx, yrs, x, top + h * .42, { size: 24, serif: true, align: 'center', col: mixHex(CREAM, GOLD.text, .6), glow: false });
      ctx.restore();
    });
  });
}
