// Film 15 · B3 · c12 + c13 + c14 + end screen (380.30 – 524.94) as ONE take: one draw function for all three chunks
// (scenes/sc12.mjs, sc13.mjs, sc14.mjs return the same function), so the chunk seams at 433.36 and 477.56 are invisible by
// construction. Worlds: the deal (lib/f15_b3_deal.mjs) → the street (lib/f15_b3_street.mjs) → the box and the ledge
// (lib/f15_b3_end.mjs). Entry from B2 through plateShot (lib/f15_seams.mjs) at T0 = 380.30.
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import { plateShot, SEAM_HALF } from './f15_seams.mjs';
import { anchors, frameAt, look, card } from './f15_b3_base.mjs';
import { makeDeal } from './f15_b3_deal.mjs';
import { makeStreet } from './f15_b3_street.mjs';
import { makeEnd } from './f15_b3_end.mjs';

export const PRINT = F.PRINT15;
let CACHE = null;
export function b3(T) {
  if (CACHE) return CACHE;
  const a = anchors(T);
  const deal = makeDeal(a), street = makeStreet(a);
  const K = [...deal.K.filter((k) => k[0] < street.K[0][0]), ...street.K];
  const cam = (t) => { const [u, v, s] = frameAt(t, K); { const k = E.smooth(E.span(t, a.T0 + .5, a.T0 + 2.5)); return E.camDrift(look(u, v, s * (1 + .008 * k * Math.sin((t - a.T0) * .45))), t, 2.4 * k); }; };
  // c14: the street keeps living inside compartment 6 of the box (drawn through BASE, see f15_b3_base.mjs)
  const streetFrame = (ctx, t) => { const c = cam(t); deal.background(ctx, c, t); deal.lifts(ctx, c, t); street.far(ctx, c, t); card(ctx, c, E.F0, () => street.focus(ctx, t)); };
  const end = makeEnd(a, streetFrame);
  CACHE = (ctx, t) => {
    if (t < a.T0 + SEAM_HALF) { plateShot(ctx, t); return; }
    const c = cam(t);
    if (t >= end.tS) { end.draw(ctx, t, end.cam(t)); return; }
    if (t < street.tIn) { deal.draw(ctx, t, c); return; }
    // the street (c13): the deal's night stays as the sky; the deal world scrolls up out of frame while the camera descends
    deal.background(ctx, c, t); deal.lifts(ctx, c, t); street.far(ctx, c, t);
    card(ctx, c, E.F0, () => { if (t < street.tSet + 2) deal.focus(ctx, t, false); street.focus(ctx, t); });
  };
  CACHE.a = a;
  return CACHE;
}
