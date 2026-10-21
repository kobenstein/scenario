// c15 · The top (VO 07a) · Film 4 v2 · shots.md §4 15.01–15.13 · ONE continuous take (lib/v2_c15_take.mjs), every time anchored to a VO word
//
//  shot   words                         picture (camera)
//  15.01  Think of                      the H4 summit view (= the in plate); the level labels unwrite; the camera turns right and pulls back
//  15.02  everyone who has ever lived   the frieze: ghosts of every age (hunter, mother, reaper, porter, miner …) rise along the far ridge
//  15.03  Most of them never made it…   down to the valleys below the summit: terraces full of bent ghosts at work (hoes, sickles, baskets)
//  15.04  Not because they were shallow push in: one of them stops, straightens and looks up toward the summit (warm light on him)
//  15.05  Because survival ate their…   the sky turns to day, the sun crosses once, slowly; dusk. (The base swaps under the opaque day sky.)
//  15.06  The harvest                   down to the valley floor: the wheat field, three gleaners with sickles, the last light on their backs
//  15.07  The rent                      the landlord's lamp-lit window: the open ledger, a coin laid on the stack, then another
//  15.08  The next shift                the factory gate: a ghost worker's card leaves the rack, the punch clock stamps it (clack)
//  15.09  no room left to wonder        the low cottage, cut open: a sleeper, head on his arms by a candle; stars above the low roof
//  15.10  Asking … privilege of the few the old town; one lit tower window; push in: the scholar bent to his telescope
//  15.11  For the first time … everyone ★ pull back over the valley: every window lights in a wave from the tower, the bent ghosts
//                                       straighten and look up, the frieze lifts its head, the summit's windows come on
//  15.12  To a cook in Lagos            the cook stirs her big pot (steam), pauses, looks up · label LAGOS
//  15.13  To a farmer in Peru. To you.  the farmer leaning on his hoe, the alpaca; he looks up · label PERU → the camera follows his gaze up
//                                       into the stars, glides (sky only) to the summit and cranes down: you, from behind, looking up →
//                                       crane up into the deep sky (= the out plate at HO.a − 1/30)
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c15_kit.mjs';
import { anchors, take } from '../lib/v2_c15_take.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c15', T);
  const A = anchors(T, HI, HO);
  await ready();
  const draw = (ctx, t) => take(ctx, t, A, HO);
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw, sound: [{ f: 'whoosh_airy', t: A.think - .3, v: .12 }] },
    { t: A.harvest - .5, tr: 'cut', d: .1, print: HI.print, draw, sound: [{ f: 'coin', t: A.rentE - .02, v: .16 }, { f: 'stamp', t: A.punch, v: .18 }] },
    { t: A.fewE - .2, tr: 'cut', d: .1, print: HO.print, draw, sound: [{ f: 'swell', t: A.fewE + .02, v: .18 }, { f: 'whoosh_up', t: A.peruE - .62, v: .16 }] },
  ];
};
