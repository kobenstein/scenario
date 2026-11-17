// c06 · B1 · Not only safety: the door from the side, a glimpse through the gap into the room: the MYTHOS core gets a price tag
// 5× OPUS 4.6 (launch price) · C1 quote card (Altman, Berman; no footage) · in the room two stacks rise: calendar sheets (the head
// start) and machine racks lit only inward (the compute it keeps) · THE LINE FROM ABOVE: who else gets to use that time? marks
// 2, 3, 4 · the camera comes down onto mark 4 → plateFour.
// 'But safety is not all' → 'Fourth in line stand'. Part of ONE take c02–c06 (lib/f55_b1_take.mjs). Plan: docs/shots.md 2.06–2.09.
//
// | ID    | anchor (phrase)              | picture (one idea)                                                            | camera                 |
// |-------|------------------------------|-------------------------------------------------------------------------------|------------------------|
// | 2.06  | But safety is not all        | the door from the side; the glimpse: the core in the room, tag 5× OPUS 4.6     | travel · MIX           |
// | 2.07  | slot C1                      | QUOTE CARD C1 over the dimmed glimpse                                          | creep · CARD           |
// | 2.08  | A head start is worth money  | in the room: a pad of calendar sheets and a rack column rise beside the core   | creep · EXPL           |
// | 2.09  | So a closed door buys a lab  | the glimpse folds into the gap; up: THE LINE FROM ABOVE, marks 2–4 named;      | rise · descend · EXPL  |
// |       |                              | down onto mark 4 → plateFour                                                   |                        |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f55_kit.mjs';
import * as S from '../lib/f55_seams.mjs';
import { entry } from '../lib/f55_b1_take.mjs';
const { H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo, lin } = E;
const { rise, GOLD, CHECK } = F;

export default entry;

const PANEL = { x: 130, y: 120, w: 1120, h: 630 };
function room(cx, t, a, w, h) {
  const ru = rise(span(t, a.headStart - .3, a.headStart + .7)), cu = rise(span(t, a.computing - .3, a.computing + .8));
  S.room(cx, t, w, h, { core: 1, extra: (c2, w2, h2) => {
    // the price tag on the core: 5× OPUS 4.6 (launch price)
    const pu = rise(span(t, a.costly - .1, a.costly + .8)) * (1 - span(t, a.headStart - .4, a.headStart + .3));
    if (pu > 0) F.priceTag(c2, t, w2 * .5 + h2 * .11, h2 * .4 - h2 * .13, '5× OPUS 4.6', pu, { size: 34, len: 46 });
    const fy = h2 * .7 + h2 * .1;
    // the head start: a pad of calendar sheets rising beside the core (left)
    if (ru > 0) { const n = 26 * ru, s = h2 * .26, th = s * .012 * 2.2, y = fy - (s * 1.12 + (n - 1) * th) + (1 - sineIO(clamp(ru * 4))) * s * 1.2; /* the first sheet rises out of the floor */ c2.save(); c2.beginPath(); c2.rect(0, 0, w2, fy); c2.clip(); F.calStack(c2, t, w2 * .26, y, s, n, '', '', { thick: 2.2 }); c2.restore(); }
    // the compute it keeps: a column of racks (right), their lights face inward (toward the core)
    if (cu > 0) {
      c2.save(); c2.beginPath(); c2.rect(0, 0, w2, fy); c2.clip();
      const rw = h2 * .26, rh = h2 * .065, n = 7, x0 = w2 * .74 - rw / 2, lift = (1 - expoOut(cu)) * n * rh * 1.08;
      for (let k = 0; k < n; k++) {
        const y = fy - (k + 1) * rh * 1.08 + lift;
        c2.fillStyle = mixHex(P.night0, P.ind1, .5 + .1 * (k % 2)); c2.fillRect(x0, y, rw, rh);
        c2.fillStyle = rgba(P.blue1, .35); c2.fillRect(x0, y, rw, 2);
        for (let j = 0; j < 4; j++) { const on = .55 + .45 * Math.sin(t * (2 + j * .7) + k * 1.3 + j); c2.fillStyle = rgba(GOLD.core, .85 * on); c2.fillRect(x0 + rw * .04 + j * rw * .06, y + rh * .4, rw * .03, rh * .2); }
      }
      c2.save(); c2.globalCompositeOperation = 'lighter'; c2.fillStyle = lin(c2, x0 - rw * .5, 0, x0 + rw * .3, 0, [[0, rgba(GOLD.halo, 0)], [1, rgba(GOLD.halo, .12 * cu)]]); c2.fillRect(x0 - rw * .5, fy - n * rh * 1.08 + lift, rw * .8, n * rh * 1.08); c2.restore();
      c2.restore();
    }
  } });
}

export function over(ctx, t, X) {
  const { a, c, T } = X;
  // ---- 2.06 / 2.08 the glimpse into the room (it opens on "costly", folds back on "So a closed door")
  const gm = sineIO(span(t, a.leaked + .2, a.costly + .3)) * (1 - sineIO(span(t, a.buys - .35, a.buys + .55)));
  if (gm > 0) {
    F.veil(ctx, .35 * gm);
    F.portal(ctx, S.gapRect(c), PANEL, gm, (cx, w, h) => room(cx, t, a, w, h), { rim: GOLD });
  }
  F.source(ctx, t, a.costly + .5, a.C1 - .4, F.SOURCES.price5x);
  // ---- 2.07 the C1 card
  const vu = sineIO(span(t, a.C1 - 1.1, a.C1 - .1)) * (1 - sineIO(span(t, a.C1e + .05, a.C1e + 1.5)));
  if (vu > 0) F.veil(ctx, .82 * vu);
  const cu = rise(span(t, a.C1 - .5, a.C1 + .2)), cd = sineIO(span(t, a.C1e - .05, a.C1e + 1.2));   // the card slides down out of frame as the veil lifts
  if (cu > 0 && cd < 1) { ctx.save(); F.screenFloat(ctx, t, .8); ctx.globalAlpha *= 1 - span(cd, .25, .9); ctx.translate(0, (1 - cu) * 40 + cd * 420); F.quoteCard(ctx, t, T, { id: 'C1', x: 300, y: 420, w: 1300, size: 72, credit: span(t, a.C1 + .3, a.C1 + 1.3) }); ctx.restore(); }
  // ---- 2.09 THE LINE FROM ABOVE: a diagram on the floor (five numbered plates joined by a line), who else gets to use that time?
  //      marks 2, 3, 4 named; the diagram and names are gone before the camera lands on mark 4 (the plate carries no words)
  const du = rise(span(t, a.buys + 1.2, a.buys + 2.4)) * (1 - sineIO(span(t, a.seam1 - 2.2, a.seam1 - 1.3)));
  if (du > 0) {
    const pts = [0, 1, 2, 3, 4].map((i) => { const m = S.markPt(i); return S.proj(c, m.x + 40, 0, m.z); });
    if (pts.every(Boolean)) {
      F.accentSpan(ctx, pts.map((p) => [p[0], p[1]]).reverse(), 0, du, { col: { halo: P.halo2, body: P.halo2, core: P.cream }, w: 1.6, spark: false, a: .7 });
      pts.forEach((p, i) => {
        const k = rise(span(du, i * .12, i * .12 + .5)); if (k <= 0) return;
        const z = Math.max(26, Math.min(48, p[2] * 340)) * k, col = i === 4 ? P.coat : i === 3 ? GOLD.body : mixHex(P.cream, P.blue1, .3);
        ctx.fillStyle = rgba(P.night0, .75); ctx.fillRect(p[0] - z / 2, p[1] - z / 2, z, z);
        ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.strokeRect(p[0] - z / 2, p[1] - z / 2, z, z);
        E.glowText(ctx, String(i + 1), p[0], p[1] + z * .3, { size: z * .8, serif: true, align: 'center', col, glow: false });
      });
    }
  }
  [[1, 'GOVERNMENT'], [2, 'BIG COMPANIES'], [3, 'DEFENDERS']].forEach(([i, name], k) => {
    const u = rise(span(t, a.whoElse - .9 + k * .3, a.whoElse - .3 + k * .3)) * (1 - sineIO(span(t, a.seam1 - 2.1 + k * .15, a.seam1 - 1.5 + k * .15)));
    if (u <= 0) return; const m = S.markPt(i), p = S.proj(c, m.x + 40, 0, m.z); if (!p) return;
    F.label(ctx, p[0] + 26, p[1] - 10, name, null, u, { dx: 70, dy: -40, size: 40, col: i === 3 ? GOLD : CHECK });
  });
}
