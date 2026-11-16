// Film 26 · B1 · c02 content: his argument as a blueprint in the sky over the street (cream lines on indigo), built on the gold condition
// line of plateCondition; the falling tag into the shop (universal high income); the dashed, unfinished corner; the test card returns out
// of that corner and is written (the card itself: F.testCard). Times: lib/f26_b1_core.mjs anchors (phrases only).
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
import * as S from './f26_seams.mjs';
import { F0, TAU, bump, qb, cap, serif, qcardUp } from './f26_b1_core.mjs';
const { P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, lin } = E;

// K5 (faktencheck): the sentence that is certainly Musk's. K4: no "deflation" card (speaker only probable).
export const Q_ANSWERS = { lines: ['it’s not like I know the answers here'], src: 'MUSK · MOONSHOTS', quoted: true };
export const BP = { x0: 330, x1: 1590, top: -330, bot: 6 };
export const BOX = [0, 1, 2, 3, 4].map((i) => ({ x: 342 + i * 316, y: -298, w: 268, h: 276 }));   // box 4 = the dashed, unfinished one
const SC = { top: 34, bot: 194, notches: 5 };   // the price scale in boxes 1 and 2 (box-local y)

// ---------------------------------------------------------------- the tags on the blueprint
function tagLevel(a, t, i) {   // 0 = top of the scale … 1 = $0; "almost free" lands one notch above $0, "They fall" takes the last notch
  const t0 = i === 0 ? a.thinking - .1 : a.labor - .1, t1 = i === 0 ? a.free1 + .25 : a.free2 + .25, n = 1 / SC.notches;
  return lerp(0, 1 - n, sineIO(span(t, t0, t1))) + n * expoOut(span(t, a.fall + i * .12, a.fall + .5 + i * .12));
}
function scale(ctx, b, u) {
  const x = b.x + b.w - 44, y0 = b.y + SC.top, y1 = b.y + SC.bot, k = expoOut(u); if (k <= 0) return;
  ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, lerp(y0, y1, k)); ctx.stroke();
  for (let j = 0; j <= SC.notches; j++) { const y = lerp(y0, y1, j / SC.notches); if (y > lerp(y0, y1, k) + .5) continue; ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x + 9, y); ctx.stroke(); }
  serif(ctx, '$0', x, y1 + 40, 30, span(u, .6, 1), { warm: .6 });
}
function chairPieces(ctx, t, cx, by, s, u) {   // the chair (F.goods 'chair' geometry) comes apart into a heap of planks at the left
  const R = [[-.3, -.5, .6, .07], [-.3, -1.05, .07, .6], [-.3, -.45, .06, .45], [.24, -.45, .06, .45], [-.3, -1.05, .5, .07]];
  const heap = [[-.62, -.07, 0], [-.55, -.14, .1], [-.7, -.14, -.08], [-.6, -.21, .05], [-.66, -.28, -.04]];
  ctx.fillStyle = mixHex(P.halo0, P.shade0, .25);
  R.forEach(([x, y, w, h], i) => {
    const k = sineIO(span(u, i * .08, .6 + i * .08)), vert = h > w;
    const x0 = cx + (x + w / 2) * s, y0 = by + (y + h / 2) * s, [hx, hy, hr] = heap[i], x1 = cx + hx * s, y1 = by + hy * s;
    const [px, py] = qb([x0, y0], [lerp(x0, x1, .5), Math.min(y0, y1) - 60], [x1, y1], k), rot = lerp(0, (vert ? Math.PI / 2 : 0) + hr, k);
    const L = Math.max(w, h) * s, T = Math.min(w, h) * s;
    ctx.save(); ctx.translate(px, py); ctx.rotate(rot + (vert ? -Math.PI / 2 : 0)); ctx.fillRect(-L / 2, -T / 2, L, T); ctx.restore();
  });
}
function spark(ctx, t, x, y, s, u) {   // one spark of electricity: a small bolt of gold light
  const k = expoOut(u); if (k <= 0) return;
  halo(ctx, x, y, 90 * s * k, .55 * k * (1 + .08 * Math.sin(t * 9)), P.halo1, P.core0);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * k, s * k); ctx.fillStyle = P.core1;
  ctx.beginPath(); ctx.moveTo(6, -34); ctx.lineTo(-12, 4); ctx.lineTo(0, 4); ctx.lineTo(-6, 34); ctx.lineTo(14, -6); ctx.lineTo(2, -6); ctx.closePath(); ctx.fill(); ctx.restore();
}
const PILE = [['box', -70, 0, 46], ['bread', -20, 0, 44], ['books', 30, 0, 44], ['shoe', -48, -30, 40], ['cup', 4, -30, 34], ['lamp', -18, -58, 40], ['box', 34, -26, 34]];
function pile(ctx, t, a, b) {
  const x = b.x + 96, y = b.y + b.h - 34;
  PILE.forEach(([k, dx, dy, s], i) => {
    const t0 = a.pile + .1 + i * .32, u = expoOut(span(t, t0, t0 + .55)); if (u <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(u * 3); F.goods(ctx, k, x + dx, y + dy - (1 - u) * 50, s); ctx.restore();
  });
  // the coin stack beside it stays the same (the money)
  F.coinStack(ctx, t, b.x + b.w - 62, y + 2, 7, 26, { u: expoOut(span(t, a.pile - .2, a.pile + .6)) });
}
// box 4's tags: three small tags on the goods (the one at the right end falls into the street in 2.06)
const T4 = [[-58, -64], [6, -94], [70, -50]];
function t4Pos(a, t, b, j) {
  const [dx, dy] = T4[j], u = expoOut(span(t, a.pile + .9 + j * .3, a.pile + 1.4 + j * .3)), drop = 16 * expoOut(span(t, a.fall + .24 + j * .12, a.fall + .7 + j * .12));
  return [b.x + 96 + dx, b.y + b.h - 34 + dy - 40 + drop, u];
}
export const fallTag = (a, t) => {   // the tag that falls into the shop: from box 4 (right tag) down onto the middle shelf
  const [x0, y0] = t4Pos(a, a.afford - .15, BOX[3], 2), x1 = S.SHOP.x + S.SHOP.w * .62, y1 = S.SHELF_Y[1] - 40;
  const u = span(t, a.afford - .15, a.afford + 1.55), k = sineIO(u);
  const [x, y] = qb([x0, y0], [x0 + 120, y0 + 200], [x1, y1], k);
  return { x, y, u, ang: .5 * Math.sin(t * 3) * (1 - k) + .06 * Math.sin(t * 1.3) };
};

// ---------------------------------------------------------------- the blueprint (F0 card)
export function blueprint(ctx, t, a) {
  const unf = E.smooth(span(t, a.b0 + .5, a.b0 + 2.0));   // starts at rest on the plate switch (b0 + .5): no pop if (unf <= 0) return;
  const { x0, x1, top, bot } = BP, h = (bot - top) * unf;
  // the paper: indigo with a faint grid, unfolding down out of the gold line
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 4, top, x1 - x0 + 8, h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, top, 0, bot, [[0, rgba(mixHex(P.ind1, P.blue1, .5), .55)], [1, rgba(P.ind1, .35)]]); ctx.fillRect(x0, top, x1 - x0, bot - top);
  ctx.strokeStyle = rgba(P.cream, .07); ctx.lineWidth = 1;
  for (let x = x0 + 40; x < x1; x += 40) { ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bot); ctx.stroke(); }
  for (let y = top + 40; y < bot; y += 40) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
  ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 1.5; ctx.strokeRect(x0 + 6, top + 6, x1 - x0 - 12, bot - top - 12);
  ctx.restore();
  // the four boxes in a chain (stroke drawn on, staggered), the arrows between them
  for (let i = 0; i < 4; i++) {
    const b = BOX[i], u = span(t, a.b0 + 1.0 + i * .28, a.b0 + 2.1 + i * .28); if (u <= 0) continue;
    strokeOn(ctx, b, u, rgba(P.cream, .75), 2);
    if (i < 3) { const k = expoOut(span(u, .6, 1)), ax = b.x + b.w + 8, ay = b.y + b.h / 2; if (k > 0) { ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + 32 * k, ay); ctx.moveTo(ax + 32 * k - 8, ay - 7); ctx.lineTo(ax + 32 * k, ay); ctx.lineTo(ax + 32 * k - 8, ay + 7); ctx.stroke(); } }
  }
  // box 1 THINKING · box 2 LABOR: the tag slides down the scale toward $0
  for (let i = 0; i < 2; i++) {
    const b = BOX[i]; scale(ctx, b, span(t, (i ? a.robots : a.ai) - .6, (i ? a.robots : a.ai) + .4));
    const appear = expoOut(span(t, (i ? a.robots : a.ai) - .35, (i ? a.robots : a.ai) + .3)); if (appear <= 0) continue;
    const d = tagLevel(a, t, i), sx = b.x + b.w * .4, sy = b.y + 6, hole = lerp(b.y + SC.top, b.y + SC.bot, d), s = 132;
    const len = hole - sy - s * .5 * .2, zero = t > a.fall + .3 + i * .12;
    ctx.save(); ctx.translate(sx, sy); ctx.scale(1, appear); ctx.translate(-sx, -sy);
    F.priceTag(ctx, t, sx, sy, s, i ? 'LABOR' : 'THINKING', { len, size: 20, col: zero ? 'gold' : 'cream', ang: .03 * Math.sin(t * 1.3 + i) });
    ctx.restore();
    // a pointer from the tag to the scale
    ctx.strokeStyle = rgba(P.halo0, .6 * appear); ctx.lineWidth = 1.5; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(sx + s / 2 + 4, hole); ctx.lineTo(b.x + b.w - 56, hole); ctx.stroke(); ctx.setLineDash([]);
    if (zero) halo(ctx, sx, hole + 30, 90, .5 * (1 - span(t, a.fall + .3 + i * .12, a.fall + 1.4)));
  }
  // box 3: a chair comes apart into a heap of wood and one spark: MATERIALS · ELECTRICITY
  { const b = BOX[2], cx = b.x + b.w / 2, by = b.y + b.h - 70, ap = expoOut(span(t, a.then - .3, a.then + .4)), brk = span(t, a.materials - .35, a.materials + .75);
    if (ap > 0) { if (brk <= 0) { ctx.save(); ctx.globalAlpha *= clamp(ap * 2); F.goods(ctx, 'chair', cx, by - (1 - ap) * 30, 120); ctx.restore(); } else chairPieces(ctx, t, cx + 30, by, 120, brk); }
    spark(ctx, t, b.x + b.w - 66, by - 60, 1.15, span(t, a.electricity - .1, a.electricity + .5));
    cap(ctx, 'MATERIALS', b.x + 72, b.y + b.h - 22, 18, span(t, a.materials + .2, a.materials + .9));
    cap(ctx, 'ELECTRICITY', b.x + b.w - 66, b.y + b.h - 22, 18, span(t, a.electricity + .2, a.electricity + .9)); }
  // box 4: goods pile up beside a coin stack that stays the same; on "They fall." every tag drops a notch
  { const b = BOX[3]; pile(ctx, t, a, b);
    for (let j = 0; j < 3; j++) { if (j === 2 && t > a.afford - .15) continue; const [x, y, u] = t4Pos(a, t, b, j); if (u <= 0) continue;
      ctx.save(); ctx.translate(x, b.y + 4); ctx.scale(1, u); ctx.translate(-x, -b.y - 4); F.priceTag(ctx, t, x, b.y + 4, 62, '', { len: y - b.y - 4, ang: .05 * Math.sin(t * 1.5 + j) }); ctx.restore(); } }
  // the unfinished part: the gold line goes on as dashes, one more box only dashed (2.07); the test card comes out of it (2.08)
  const du = span(t, a.figured - .2, a.figured + 1.2);
  if (du > 0) {
    const b = BOX[4], k = expoOut(du);
    ctx.save(); ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = 2; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 12;
    ctx.beginPath(); ctx.moveTo(x1, top); ctx.lineTo(x1 + (b.x + b.w + 20 - x1) * k, top); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(BOX[3].x + BOX[3].w + 8, b.y + b.h / 2); ctx.lineTo(lerp(BOX[3].x + BOX[3].w + 8, b.x, k), b.y + b.h / 2); ctx.stroke();
    if (k > .3) { const kk = span(k, .3, 1); ctx.beginPath(); ctx.rect(b.x, b.y, b.w * kk, b.h); ctx.stroke(); }
    ctx.restore();
    // where the card left: an empty dashed box (the gold glow of the lamp light that landed there fades into it)
    halo(ctx, b.x + b.w / 2, b.y + b.h / 2, 160, .35 * bump(t, a.figured + 1.3, 2.4));
  }
}
function strokeOn(ctx, b, u, col, w) {   // a rectangle drawn on along its perimeter (u 0..1)
  const P4 = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h], [b.x, b.y]], L = 2 * (b.w + b.h), d = L * expoOut(u);
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(...P4[0]); let acc = 0;
  for (let i = 1; i < 5; i++) { const seg = Math.hypot(P4[i][0] - P4[i - 1][0], P4[i][1] - P4[i - 1][1]); if (acc + seg <= d) { ctx.lineTo(...P4[i]); acc += seg; } else { const f = (d - acc) / seg; ctx.lineTo(lerp(P4[i - 1][0], P4[i][0], f), lerp(P4[i - 1][1], P4[i][1], f)); break; } }
  ctx.stroke();
}

// ---------------------------------------------------------------- the shop in 2.06: many hands take, nobody pays
function shopper(ctx, t, a, i) {
  const y = S.GROUND + 28, br = .02 * Math.sin(t * 1.2 + i);
  if (i === 0) {   // reaches up into the window for a shoe
    const r = sineIO(span(t, a.afford + .7, a.afford + 1.6)) * (1 - sineIO(span(t, a.uhi + .3, a.uhi + 1.2)));
    E.person(ctx, 1235, y, 222, { dir: 1, view: 'side', armR: [lerp(.2, 2.3, r), lerp(.1, 2.45, r)], look: .3 * r + br, light: 1, back: .4 });
  } else if (i === 1) {   // walks off to the right with a loaf (no till, nobody stops her)
    const w = span(t, a.afford + .9, a.figured + 1.5), x = 1430 + 330 * w;
    const hands = E.person(ctx, x, y, 210, { dir: 1, walk: t * 5.2, armR: [.9, 1.5], light: 1, back: .4, long: true });
    F.goods(ctx, 'bread', hands.R[0] + 8, hands.R[1] + 4, 40);
  } else {   // lifts a lamp up: its light rises (the carrier back up to the blueprint)
    const l = sineIO(span(t, a.uhi - .2, a.uhi + .9));
    const hands = E.person(ctx, 1720, y, 216, { dir: -1, armR: [lerp(.5, 2.85, l), lerp(1.4, 3.0, l)], armL: [lerp(-.3, -2.85, l), lerp(-1.2, -3.0, l)], look: .2 + .5 * l + br, light: -1, back: .4 });
    const hx = (hands.R[0] + hands.L[0]) / 2, hy = (hands.R[1] + hands.L[1]) / 2;
    F.goods(ctx, 'lamp', hx, hy + 4, 50);
    return [hx, hy - 40];
  }
  return null;
}

// ---------------------------------------------------------------- hooks into the frame
// st: the street state (mutated); L: layer lists { field, mid, front, screen }; c is passed to every layer function
export function c02(a, t, st, L, cam, world) {
  if (t >= a.c03 + 2 || world !== 'street') return;
  // the gold condition line: its words sink, the line stays as the blueprint's top rule
  L.field.push((ctx, c) => E.card(ctx, c, F0, () => {
    S.condLine(ctx, t, 1, { text: 1 - E.smooth(span(t, a.b0 + .5, a.b0 + 1.4)) });
    blueprint(ctx, t, a);
    // the wattage card (MB1) unfolds up out of the line over box 3; the K5 card over the dashed corner
    const wu = span(t, a.then + 1.3, a.then + 2.6) * (1 - span(t, a.afford - .4, a.afford + .4));
    if (wu > 0) qcardUp(ctx, t, BOX[2].x + BOX[2].w / 2 + 40, BP.top - 18, 600, 132, F.QUOTES.wattage, wu, { size: 30 });
    const ku = span(t, a.figured + .5, a.figured + 1.7) * (1 - span(t, a.advice - .4, a.advice + .3));
    if (ku > 0) qcardUp(ctx, t, 1420, BP.top - 18, 640, 110, Q_ANSWERS, ku, { size: 32 });
  }));
  // 2.06: the tag falls into the shop; the shelves fill, the tags roll to $0 (as in the hook); people take, no one pays
  if (t > a.afford - 1.5 && t < a.c03) {
    st.shop = { fill: smooth(span(t, a.afford + 1.0, a.afford + 2.6)), zero: span(t, a.afford + 2.0, a.uhi + .6), light: .45 + .4 * smooth(span(t, a.afford + .9, a.afford + 1.9)) };
  }
  L.front.push((ctx, c) => E.card(ctx, c, F0, () => {
    if (t > a.afford - .15 && t < a.afford + 3) { const g = fallTag(a, t);
      if (g.u < 1) F.priceTag(ctx, t, g.x, g.y, 62, '', { len: 14, ang: g.ang }); else halo(ctx, g.x, g.y + 40, 120, .6 * (1 - span(t, a.afford + 1.55, a.afford + 2.6)));
      if (g.u < 1) F.goldDust(ctx, t, [[g.x, g.y - 120], [g.x, g.y]], { n: 24, seed: 211, spread: 8, a: .7, size: 2, speed: .7 }); }
    if (t > a.afford - 1 && t < a.figured + 3) {
      shopper(ctx, t, a, 0); shopper(ctx, t, a, 1); const lamp = shopper(ctx, t, a, 2);
      // the lamp's light leaves it and rises into the dashed corner of the blueprint
      if (lamp && t > a.lift - .2) { const u = sineIO(span(t, a.lift, a.figured + 1.4)), b = BOX[4], p = qb(lamp, [lamp[0] - 80, lamp[1] - 500], [b.x + b.w / 2, b.y + b.h / 2], u);
        if (u < 1) { halo(ctx, p[0], p[1], 110, .8, P.halo1, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, TAU); ctx.fill();
          F.goldDust(ctx, t, [qb(lamp, [lamp[0] - 80, lamp[1] - 500], [b.x + b.w / 2, b.y + b.h / 2], Math.max(0, u - .12)), p], { n: 40, seed: 212, spread: 10, a: .8, size: 2.2, speed: .6 }); } }
      else if (lamp) halo(ctx, lamp[0], lamp[1] + 20, 120, .5 * span(t, a.uhi + .2, a.uhi + .9));
    }
    serif(ctx, 'Universal high income', SHOPC_X, 574, 46, span(t, a.uhi - .1, a.uhi + .7) * (1 - expoIn(span(t, a.figured + .2, a.figured + .9))), { warm: .3 });
  }));
  // 2.08: the card comes out of the dashed box; NOT FINANCIAL ADVICE small under it
  L.screen.push((ctx, c) => {
    const nu = span(t, a.advice + .5, a.advice + 1.3) * (1 - span(t, a.forecast + 2.2, a.forecast + 2.9));
    if (nu > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); cap(ctx, 'NOT FINANCIAL ADVICE', 960, 206, 22, nu, { col: P.halo2 }); ctx.restore(); }
  });
  if (t >= a.advice - .1 && t < a.advice + 1.3) {
    const b = BOX[4], p0 = E.project(cam, F0, b.x + b.w / 2, b.y + b.h / 2), k0 = p0 ? b.w * p0[2] / F.TEST.w : .3, k = sineIO(span(t, a.advice, a.advice + 1.3));
    if (p0) st.tc = { at: [lerp(p0[0], 960, k), lerp(p0[1], 470, k), lerp(k0, 1, k)] };
  }
}
const SHOPC_X = S.SHOP.x + S.SHOP.w / 2;
