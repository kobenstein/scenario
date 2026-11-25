// Film 77 · B1's own helpers (c04–c06). Kit wishes go to the report, never into the kit.
//   miniBoard   THE FOUR LINES as the corner icon, exactly as c03 leaves it (rows WAITING, row 4 dashed under the band's hatched cover);
//               B2's convention (x 1585, y 64, s .42, w 600, rowH 78, head 112); st.e flips ENERGY WAITING → BEGUN gold (2.18)
//   billCard    your power bill (paper): POWER BILL, twelve monthly bars (EVERY MONTH), a dashed "smaller" line (2.14)
//   labLine     one A.I.-run lab line: belt, three stations (DESIGN · MAKE · TEST), sample plates moving through; o.dashed = a forecast clone
//   ringS       F.ring with think 0 (the kit's think pulse is a sawtooth: a radius jump every 1/.55 s reads as a POP)
import * as F from './f77_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER, COOL } = F;

// ---------------------------------------------------------------- THE FOUR LINES (corner icon)
export const MINI = { x: 1585, y: 64, s: .42 };
export const BRD = { w: 600, rowH: 78, head: 112, cells: 14, title: 'THE FOUR LINES' };
export const rowRect = (i, b = MINI) => ({ x: b.x + 20 * b.s, y: b.y + (BRD.head + i * BRD.rowH) * b.s, w: (BRD.w - 40) * b.s, h: BRD.rowH * b.s });
// st: { x, y, s (pose), e 0..1 (ENERGY: WAITING → BEGUN, gold), ePulse, mPulse, a, cover (1) }
export function miniBoard(ctx, t, st = {}) {
  const x = st.x ?? MINI.x, y = st.y ?? MINI.y, s = st.s ?? MINI.s, e = clamp(st.e ?? 0);
  const rows = [
    { text: 'ENERGY', from: '', flip: 1, status: e > .5 ? 'BEGUN' : 'WAITING', statusFrom: e > .5 ? 'WAITING' : '', statusFlip: e > .5 ? span(e, .5, 1) : 1, gold: smooth(span(e, .55, 1)), lit: st.ePulse ?? 0 },
    { text: 'MATERIALS', from: '', flip: 1, status: 'WAITING', statusFrom: '', statusFlip: 1, lit: st.mPulse ?? 0 },
    { text: 'DISCOVERY', from: '', flip: 1, status: 'WAITING', statusFrom: '', statusFlip: 1, lit: 0 },
    { dashed: true, lit: 0, a: 1 },
  ];
  ctx.save(); ctx.globalAlpha *= st.a ?? 1;
  const mini = s <= MINI.s + 1e-6;
  const b = F.board(ctx, t, x, y, { w: BRD.w, rowH: BRD.rowH, head: BRD.head, title: BRD.title, cells: BRD.cells, rows, u: 1, s, glow: mini ? 0 : clamp((s - MINI.s) / .4), mini });
  if ((st.cover ?? 1) > 0) cover(ctx, t, x, y, s);
  ctx.restore();
  return b;
}
// the band's dashed cover over row 4 (as c03 slid it in)
function cover(ctx, t, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const rx = 20, ry = BRD.head + 3 * BRD.rowH + 3, rw = BRD.w - 40, rh = BRD.rowH - 6;
  ctx.translate(rx + rw / 2, ry + rh / 2);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .45); ctx.beginPath(); ctx.roundRect(-rw / 2, -rh / 2, rw, rh, 6); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(CREAM, .09); ctx.lineWidth = 2; for (let q = -rw; q < rw; q += 22) { ctx.beginPath(); ctx.moveTo(q, -rh / 2); ctx.lineTo(q + rh, rh / 2); ctx.stroke(); } ctx.restore();
  ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.2; ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 12; ctx.beginPath(); ctx.roundRect(-rw / 2, -rh / 2, rw, rh, 6); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}

// ---------------------------------------------------------------- YOUR POWER BILL (paper)
// (x, y, w, h) the card. o: { u (draws), bars 0..1 (twelve months rise one by one), wish 0..1 (a dashed lower line: smaller), twitch 0..1
// (the bars try to sink and don't), head 0..1 (POWER BILL), a, rot }. Returns the card rect and the bars' area.
export function billCard(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.translate(x + w / 2, y + h / 2); ctx.rotate(o.rot ?? 0); ctx.translate(-w / 2, -h / 2);
  const k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(-20, -20, w + 40, (h + 40) * k); ctx.clip();
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(8, 12, w, h, 10); ctx.fill();
  ctx.fillStyle = F.lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, 8); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  const hs = Math.max(22, w * .052);
  if (o.head !== false) F.maskLine(ctx, [['POWER BILL', 0]], w * .07, h * .14 + hs * .4, hs, rise(span(u, .2, .7)), { serif: false, weight: 700, col: PAPER.ink, glow: false });
  // ink lines (address, meter number: unreadable on purpose)
  ctx.fillStyle = rgba(PAPER.ink, .28);
  for (let i = 0; i < 3; i++) { const q = span(u, .3 + i * .1, .6 + i * .1); if (q > 0) ctx.fillRect(w * .07, h * .26 + i * h * .055, w * (i === 2 ? .3 : .52) * q, Math.max(3, h * .016)); }
  // twelve monthly bars (equal: the bill comes every month and stays the same)
  const bx0 = w * .07, bx1 = w * .93, by = h * .86, bh = h * .38, n = 12, gap = (bx1 - bx0) / n, bw = gap * .58;
  const bars = clamp(o.bars ?? 0), tw = clamp(o.twitch ?? 0);
  ctx.fillStyle = rgba(PAPER.ink, .25); ctx.fillRect(bx0, by, (bx1 - bx0) * smooth(span(u, .4, .9)), 2);
  for (let i = 0; i < n; i++) {
    const q = expoOut(span(bars, i / n * .7, i / n * .7 + .3)); if (q <= 0) continue;
    const hh = bh * (.92 + .05 * Math.sin(i * 2.1)) * q * (1 - .035 * tw * Math.max(0, Math.sin(t * 9 + i * .7)));
    ctx.fillStyle = mixHex(PAPER.ink, P.ind2, .35); ctx.beginPath(); ctx.roundRect(bx0 + i * gap + (gap - bw) / 2, by - hh, bw, hh, [3, 3, 0, 0]); ctx.fill();
  }
  const wi = clamp(o.wish ?? 0);
  if (wi > 0) {   // the wish: a dashed line far lower than the bars (imagined); the bars never get there
    ctx.save(); ctx.strokeStyle = rgba(PAPER.ink, .75); ctx.lineWidth = 2.5; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 14;
    ctx.beginPath(); ctx.moveTo(bx0 - 6, by - bh * .35); ctx.lineTo(lerp(bx0 - 6, bx1 + 6, smooth(wi)), by - bh * .35); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
  return { x, y, w, h, bars: { x: x + bx0, y: y + by - bh, w: bx1 - bx0, h: bh } };
}

// ---------------------------------------------------------------- ONE LAB LINE (A.I.-run: design · make · test)
export const LINE = { x0: 3250, x1: 5350, belt: 800, floor: 960, st: [3650, 4300, 4950], stW: 300, stH: 210 };
const PLATE = { w: 50, h: 13, gap: 96, v: 120 };
// plates on the belt at time t: [{ x, i }] (world x); i = the plate's id (stable as it moves)
export function platesAt(t, L = LINE) {
  const len = L.x1 - L.x0, n = Math.floor(len / PLATE.gap), off = (t * PLATE.v) % PLATE.gap, base = Math.floor(t * PLATE.v / PLATE.gap), out = [];
  for (let k = 0; k < n; k++) out.push({ x: L.x0 + k * PLATE.gap + off, i: base - k });
  return out;
}
// o: { u (draws), lit [3] (stations light: designed / made / tested), gold (a set of ids → 0..1), dashed, simple (a far clone: belt + boxes only),
//      hide (an id that has left the line), a, labels 0..1 }
export function labLine(ctx, t, o = {}, L = LINE) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const dashed = !!o.dashed, col = dashed ? CREAM : mixHex(P.blue1, CREAM, .35);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const bu = smooth(span(u, 0, .6));
  // belt
  if (dashed) F.outline(ctx, [[[L.x0, L.belt], [L.x1, L.belt]], [[L.x0, L.belt + 16], [L.x1, L.belt + 16]]], bu, { dashed: true, t, w: o.w ?? 3 });
  else {
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.fillRect(L.x0, L.belt, (L.x1 - L.x0) * bu, 16);
    ctx.fillStyle = rgba(GOLD.line, .3); ctx.fillRect(L.x0, L.belt, (L.x1 - L.x0) * bu, 2);
    for (let x = L.x0 + 60; x < L.x0 + (L.x1 - L.x0) * bu; x += 240) { ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x, L.belt + 16, 10, L.floor - L.belt - 16); }
  }
  // plates
  if (!o.simple) for (const p of platesAt(t, L)) {
    if (p.x > L.x0 + (L.x1 - L.x0) * bu || p.i === o.hide) continue;
    const g = (o.gold && o.gold(p.i)) || 0;
    if (g > 0) F.halo(ctx, p.x + PLATE.w / 2, L.belt - 8, 70, .55 * g, GOLD.halo, GOLD.core);
    ctx.fillStyle = mixHex(mixHex(P.blue1, P.cream, .35), GOLD.body, g);
    if (dashed) { ctx.strokeStyle = rgba(CREAM, .8); ctx.lineWidth = 2; ctx.strokeRect(p.x, L.belt - PLATE.h, PLATE.w, PLATE.h); }
    else { ctx.beginPath(); ctx.roundRect(p.x, L.belt - PLATE.h, PLATE.w, PLATE.h, 3); ctx.fill(); }
  }
  // stations (boxes the belt runs through), each with a window that lights on its word
  L.st.forEach((sx, i) => {
    const q = expoOut(span(u, .25 + i * .15, .7 + i * .15)); if (q <= 0) return;
    const w = L.stW, h = L.stH * q, x = sx - w / 2, y = L.belt + 20 - h, lit = clamp(o.lit ? o.lit[i] : 0);
    if (dashed) { F.outline(ctx, [F.rectPts(x, y, w, h, 10)], 1, { dashed: true, t, w: o.w ?? 3 }); return; }
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
    ctx.strokeStyle = rgba(col, .6); ctx.lineWidth = 2; ctx.stroke();
    const wx = x + w * .2, wy = y + h * .18, ww = w * .6, wh = h * .4;
    ctx.fillStyle = mixHex(P.night0, GOLD.body, .75 * lit); ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 6); ctx.fill();
    if (lit > 0) F.halo(ctx, sx, wy + wh / 2, w * .7, .45 * lit, GOLD.halo, GOLD.core);
    // what each station does, as a small line sign in its window: a lattice (design), a flame (make), a flask (test)
    const ic = i === 0 ? 'screen' : i === 1 ? 'plant' : 'flask';
    if (i === 0) F.lattice(ctx, t, sx, wy + wh / 2, wh * .5, { seed: 3, u: q, a: .8, lit: lit * .6 });
    else F.lineIcon(ctx, ic === 'plant' ? 'drop' : 'flask', sx, wy + wh / 2, wh * .36, { u: q, w: 2.2, gold: lit > .5, rot: ic === 'plant' ? Math.PI : 0 });
  });
  ctx.restore();
}

// ---------------------------------------------------------------- the machine without the sawtooth pulse
export function ringS(ctx, t, x, y, r, o = {}) {
  const th = o.think ?? 0, k = th * .05 * (1 - Math.cos(t * .55 * Math.PI * 2)) / 2;
  F.ring(ctx, t, x, y, r * (1 - k), { ...o, think: 0 });
}

// ---------------------------------------------------------------- a number that counts up, with thousands commas (serif, gold)
export const commas = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// the inner seam c03 → c04 (S = c03's end = c04's t0): a slow swell of the night's light, a drift of the stars and a camera creep
// on you, so that the hold around the seam lives (both scenes call the same function, so the seam stays exact)
export const seamLift = (t, S) => { const u = Math.max(0, Math.min(1, (t - (S - 1.0)) / 3.6)); return Math.sin(Math.PI * u) ** 2; };   // fastest near S
export const seamGlow = (t, S, base) => { const L = seamLift(t, S); return { glow: [960 - 60 * L, 470 + 20 * L, 1000 + 220 * L, base * (1 + 1.7 * L)], ox: -64 * L, oy: -20 * L }; };
export const seamZ = (t, S) => 1 + .045 * seamLift(t, S);
