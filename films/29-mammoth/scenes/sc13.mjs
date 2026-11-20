// c13 · B3 · 'Now scale that up' → 'Even the mammoth depends'
// 3.05 the camera pulls back: the freezer door multiplies, frost doors rise out of the snow one after another back to the hut (a wall);
//      the tally counts ~2,300 LISTED SPECIES · 3.06 from every door a strand rises into the sky: ONLINE · FREE · 3.07 a dark forest edge
//      rises on the horizon behind the small wall: NO HABITAT · 3.08 the mast blinks, the machine's comb sweeps from the hut: every strand
//      it passes gets a gold rung (a lesson); one near door's species vanishes before the comb gets there (its strand goes out, unread).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f29_kit.mjs';
import * as B from '../lib/f29_b3_core.mjs';
const { span, rise, expoIn } = { ...E, ...F };

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T), K = B.keys(a);
  return [{ t: R.a, draw: scene(a, K), print: F.PRINT29 }];
};

function scene(a, K) {
  return (ctx, t) => {
    const { c } = B.world(ctx, t, a, K);
    if (!c) return;
    // ~2,300 LISTED SPECIES (rolls while the doors rise, lands on "Every one")
    const tU = rise(span(t, a.freeze - .3, a.freeze + .4)) * (1 - expoIn(span(t, a.forest - .6, a.forest)));
    if (tU > 0) F.tally(ctx, t, { v: 2300, from: 1, pre: '~', u: span(t, a.freeze, a.everyOne + .2), label: 'LISTED SPECIES', rise: tU });
    F.source(ctx, t, a.endList, a.free + .6, F.SOURCES.biobank, { y: 870 });
    B.line(ctx, t, 'ONLINE · FREE', 1810, 214, a.online - .1, a.forest + .2, { size: 64, align: 'right' });
    B.line(ctx, t, 'NO HABITAT', 110, 214, a.habitat - .1, a.think + .3, { size: 72 });
  };
}
