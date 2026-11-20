// c03 · B1 · A second door (OPENAI) on the same wall: on its counter the public machine ASTRA with a price tag (anyone can PAY), behind
// its crack a bigger shadow (the one after it) · A1 quote card (Altman, Dreamforce; no footage) · the inspector's clipboard: WHO
// CHECKED IT? SOME, IN PART; the crack closes (the machine stays locked) · both doors: price tags rise with the light, NOV 9 → NOV 10.
// 'A second lab' → 'Still, two things'. Part of ONE take c02–c06 (lib/f55_b1_take.mjs). Plan: docs/shots.md 1.06–1.09.
// The counter (also the shop shelf of 1.13 with the empty place BEST) is drawn here for the whole take.
//
// | ID    | anchor (phrase)              | picture (one idea)                                                            | camera                 |
// |-------|------------------------------|-------------------------------------------------------------------------------|------------------------|
// | 1.06  | A second lab                 | truck right along the wall: door 2 lights, OPENAI; ASTRA rises on the counter,| truck · push · MIX     |
// |       |                              | a gold tag PAID; on "the one after it" the crack opens on a bigger shadow     |                        |
// | 1.07  | slot A1                      | QUOTE CARD A1 over the dimmed door (words light evenly over the clip)         | creep · CARD           |
// | 1.08  | So ask what an inspector     | the card slides down, the clipboard rises: WHO CHECKED IT? · SOME, IN PART    | creep · EXPL           |
// |       |                              | (half tick); the crack closes; source reproduce                               |                        |
// | 1.09  | And both labs are worth more | pull back to both doors: gold tags rise as the gaps brighten; NOV 9 → NOV 10   | pull back · EXPL       |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f55_kit.mjs';
import * as S from '../lib/f55_seams.mjs';
import { entry, say, win, counter, COUNTER, D2, D } from '../lib/f55_b1_take.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex } = E;
const { rise, maskLine, GOLD, CHECK } = F;
const TAU = Math.PI * 2;

export default entry;

// the landscape clipboard (the inspector's board, readable): (x, y) = top left, w wide; rows [{ text, u (written), tick, blink, col }]
export function board(ctx, t, x, y, w, rows) {
  const rh = w * .135, h = w * .12 + rows.length * rh;
  ctx.save(); F.screenFloat(ctx, t, 1);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(x + 14, y + 16, w, h);
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill();
  ctx.fillStyle = mixHex(P.cream, '#ece4c8', .5); ctx.fillRect(x + 18, y + 26, w - 36, h - 44);
  ctx.fillStyle = mixHex(P.blue1, P.halo2, .35); ctx.beginPath(); ctx.roundRect(x + w / 2 - w * .1, y - 12, w * .2, 40, 8); ctx.fill();
  rows.forEach((r, k) => {
    const ry = y + w * .1 + (k + .62) * rh, bs = rh * .46, bx = x + w * .07;
    ctx.strokeStyle = rgba(P.night1, .8); ctx.lineWidth = 3; ctx.strokeRect(bx, ry - bs * .8, bs, bs);
    if (r.blink > 0) { ctx.fillStyle = rgba(CHECK.halo, .4 * r.blink * (.5 + .5 * Math.sin(t * 3.2))); ctx.fillRect(bx, ry - bs * .8, bs, bs); }
    if (r.u > 0) maskLine(ctx, [[r.text, 0]], bx + bs * 1.7, ry, rh * .5, r.u, { serif: false, weight: 600, col: r.col ?? P.night1, glow: false });
    if (r.tick > 0) F.checkMark(ctx, bx + bs * .55, ry - bs * .35, bs * 1.6, r.tick, { w: bs * .13 });
  });
  ctx.restore();
}

export function floor(ctx, t, X) {
  const { a, c } = X; if (!X.d2) return;
  // the counter in front of door 2: two older matte machines, ASTRA (it rises out of the counter on its name), the empty place (BEST, 1.13)
  counter(ctx, t, c, { draw: (cx, k, w, h) => {
    const top = -h - 20;
    F.core(cx, t, -540, top - 130, 230, { dim: 1, glow: .25 });
    F.core(cx, t, -200, top - 130, 230, { dim: 1, glow: .25 });
    const ru = expoOut(span(t, a.astra - .2, a.astra + .7));
    if (ru > 0) { cx.save(); cx.beginPath(); cx.rect(-400, -4000, 1600, 4000 + top + 10); cx.clip(); F.core(cx, t, 160, top - 150 + (1 - ru) * 330, 300, { glow: .9 }); cx.restore(); }
    maskLine(cx, [['ASTRA', 0]], 160, -h * .38, 70, rise(span(t, a.astra, a.astra + .6)), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
    const pu = rise(span(t, a.pay - .1, a.pay + .7));
    if (pu > 0) F.priceTag(cx, t, 330, top - 250, 'PAID', pu, { size: 64, len: 70 });
    // 1.13 the empty place: a faint outline where the best machine would stand, the sign BEST lowered on two strings
    const bu = expoOut(span(t, a.bestP - .3, a.bestP + .8));
    if (bu > 0) {
      const ex = 540, ey = top - 150, hw = 300 * .36, hh = 300 * .5;
      cx.save(); cx.setLineDash([22, 18]); cx.strokeStyle = rgba(GOLD.line, .55 * bu); cx.lineWidth = 7; cx.beginPath(); cx.moveTo(ex, ey - hh); cx.lineTo(ex + hw, ey); cx.lineTo(ex, ey + hh); cx.lineTo(ex - hw, ey); cx.closePath(); cx.stroke(); cx.restore();
      const sy = lerp(-2600, top - 480, bu) + 14 * Math.sin(t * 1.1) * bu, sw = 500, sh = 170, sx = ex + 8 * Math.sin(t * .8);
      cx.strokeStyle = rgba(P.halo2, .7); cx.lineWidth = 5; cx.beginPath(); cx.moveTo(sx - sw * .35, sy - 4000); cx.lineTo(sx - sw * .35, sy); cx.moveTo(sx + sw * .35, sy - 4000); cx.lineTo(sx + sw * .35, sy); cx.stroke();
      cx.fillStyle = mixHex(P.cream, '#e3dcc0', .4); cx.fillRect(sx - sw / 2, sy, sw, sh);
      cx.fillStyle = rgba(GOLD.line, .8); cx.fillRect(sx - sw / 2, sy + sh - 10, sw, 10);
      E.glowText(cx, 'BEST', sx, sy + sh * .72, { size: 120, weight: 600, spacing: .14, align: 'center', col: P.night1, glow: false });
    }
  } });
}

export function over(ctx, t, X) {
  const { a, c, T } = X;
  // ---- 1.07 the A1 card: the world dims, the words light evenly over the clip; the card slides down as the clipboard rises
  const vu = sineIO(span(t, a.A1 - 1.1, a.A1 - .1)) * (1 - sineIO(span(t, a.A1e + .05, a.A1e + 1.5)));
  if (vu > 0) F.veil(ctx, .8 * vu);
  const cu = rise(span(t, a.A1 - .5, a.A1 + .2)), cd = sineIO(span(t, a.A1e - .05, a.A1e + 1.2));
  if (cu > 0 && cd < 1) { ctx.save(); F.screenFloat(ctx, t, .8); ctx.globalAlpha *= 1 - span(cd, .25, .9); ctx.translate(0, (1 - cu) * 40 + cd * 420); F.quoteCard(ctx, t, T, { id: 'A1', x: 300, y: 390, w: 1240, size: 64, credit: span(t, a.A1 + .3, a.A1 + 1.3) }); ctx.restore(); }
  // ---- 1.08 the inspector's clipboard: WHO CHECKED IT? (the box stays empty) · SOME, IN PART (half a tick)
  const bu = sineIO(span(t, a.who - 1.5, a.who - .3)) * (1 - sineIO(span(t, a.worth - .2, a.worth + 1.0)));
  if (bu > 0) board(ctx, t, 120, lerp(H + 40, 230, bu), 780, [
    { text: 'WHO CHECKED IT?', u: rise(span(t, a.who - .15, a.who + .4)), blink: span(t, a.who, a.who + .4) * (1 - span(t, a.inPart + .4, a.inPart + .8)), col: CHECK.deep },
    { text: 'SOME, IN PART', u: rise(span(t, a.some - .1, a.some + .5)), tick: .5 * sineIO(span(t, a.inPart - .1, a.inPart + .5)) },
  ]);
  F.source(ctx, t, a.locked - .3, a.further + .8, F.SOURCES.reproduce);
  // ---- 1.09 gold tags at both doors rise with the light; two calendar sheets NOV 9 → NOV 10 fall in
  const tu = rise(span(t, a.worth + .3, a.worth + 1.1)), lift = sineIO(span(t, a.further - .4, a.further + 1.4));
  if (tu > 0 && t < a.why + 1.2) for (const [x, w, h] of [[D.x, D.w, D.h], [D2.x, D2.w, D2.h]]) {
    const p = S.proj(c, x + w / 2 + w * .06, h * .9, D.z); if (!p) continue;
    F.priceTag(ctx, t, p[0] + 14, p[1] - 70 * lift, '$', tu, { size: 34, len: 40 + 70 * lift });
  }
  const sheetIn = (t0) => expoOut(span(t, t0 - .1, t0 + .8)), out = sineIO(span(t, a.still - .3, a.still + 1.0));
  if (t > a.reported - .2 && out < 1) {
    ctx.save(); F.screenFloat(ctx, t, 1);
    for (const [k, t0, top, sub] of [[0, a.reported, 'NOV 9', '30-HOUR RUN'], [1, a.oneDay, 'NOV 10', 'SHARE PITCH']]) {
      const u = sheetIn(t0); if (u <= 0) continue;
      const x = 250 + k * 330, y = lerp(-420, 330, u) + out * 900, rot = (1 - u) * (k ? .3 : -.3) + (k ? .03 : -.04) + .006 * Math.sin(t * .9 + k);
      F.calSheet(ctx, t, x, y, 240, top, sub, { rot });
    }
    const au = rise(span(t, a.oneDay + .2, a.oneDay + .8)) * (1 - out);
    if (au > 0) { const y = 470 + out * 900; F.accentSpan(ctx, [[388, y], [388 + 34 * au, y]], 0, 1, { col: GOLD, w: 3, spark: false, a: au }); }
    ctx.restore();
  }
}
