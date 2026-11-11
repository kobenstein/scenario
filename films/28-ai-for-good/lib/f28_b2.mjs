// Film 28 · builder B2 · THE MASTER of c07–c10 ('Casey Harrell knows' → 'The snake'). One draw function for all four chunks, so the inner
// chunk boundaries (c07|c08, c08|c09, c09|c10) are inside continuous takes by construction. Memoized per timing object T.
//   plateTree → Casey's kitchen (lib/f28_b2_kitchen.mjs, window fly-in out of lantern 7) → through the kitchen window into the world
//   outside (lib/f28_b2_sea.mjs: subscribe 1, No. 6, No. 5) → W 5.11 the light door (into the lighthouse, out of the train's headlight)
//   → No. 4 (lib/f28_b2_train.mjs) → plateGrass.
// Here: the rail (every frame), subscribe 1's pulse along the rail, REAL stamps, source lines, the C3 plate, the flood.
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
import * as S from './f28_seams.mjs';
import * as B from './f28_b2_kit.mjs';
import { makeKitchen } from './f28_b2_kitchen.mjs';
import { makeSea } from './f28_b2_sea.mjs';
import { makeTrain } from './f28_b2_train.mjs';
const { span } = E;

const MEMO = new WeakMap();
export function b2(T) {
  if (MEMO.has(T)) return MEMO.get(T);
  const a = B.anchors(T);
  let sea = null;
  const kitchen = makeKitchen(T, a, (ctx, t, M) => sea.world(ctx, t, M));
  sea = makeSea(T, a, { T0: a.casey });
  const tp = sea.tp;
  const train = makeTrain(T, a, tp);
  const tPlate1 = a.casey + S.SEAM_HALF, tPlate2 = a.snake - S.SEAM_HALF;
  const c3 = a.C3, c4 = a.C4;

  function draw(ctx, t) {
    // the seam plates (they draw their own rail)
    if (t < tPlate1) { S.plateTree(ctx, t, T); return; }
    if (t >= tPlate2) { S.plateGrass(ctx, t, T); return; }
    // ---------------------------------------------------------------- the picture
    let clipM = 0;
    if (t < kitchen.tW) { const c = kitchen.draw(ctx, t); clipM = kitchen.clip(ctx, t, c); }
    else if (t < tp) { const M = kitchen.outer(t); const c = M ? E.withOuter(M, () => sea.world(ctx, t, M)) : sea.world(ctx, t, null); sea.overlays(ctx, c, t); }
    else train.draw(ctx, t);
    // ---------------------------------------------------------------- REAL stamps (one per station, ≈ 3 s, when the place or system is named)
    F.realStamp(ctx, t, a.casey + .8, a.brain + .7, 'casey');
    F.realStamp(ctx, t, a.compared + .3, a.radar + 2.1, 'gfw');
    F.realStamp(ctx, t, a.gps - .5, a.late - .1, 'guardian');
    F.realStamp(ctx, t, a.unless + .3, a.cameras - .2, 'elephants');
    // ---------------------------------------------------------------- source lines (bottom left, above the subtitles)
    F.source(ctx, t, a.oneman + .3, a.athome - .1, F.SOURCES.harrell);
    F.source(ctx, t, a.broadcasts - .3, a.darkn - .2, F.SOURCES.gfw);
    F.source(ctx, t, a.another + .4, a.shiphide - .3, F.SOURCES.forcedlabour);
    F.source(ctx, t, a.same + .2, a.nasa - .2, F.SOURCES.guardian);
    F.source(ctx, t, a.stretch + .3, a.giants - .2, F.SOURCES.elephants);
    F.source(ctx, t, a.across + .3, a.hides - .1, F.SOURCES.snakes);
    // ---------------------------------------------------------------- the rail (dims under the clip plates), subscribe 1's pulse along it
    const c4m = c4 ? Math.sin(Math.PI * span(t, c4.start - 1.5, c4.end + .7)) : 0;
    F.lampRail(ctx, t, T, { a: 1 - Math.max(.85 * clipM, .6 * c4m) });
    B.railPulse(ctx, t, a.arrival - .1, 2.6, 12, 7);
    // ---------------------------------------------------------------- W 5.11 the light door
    const fl = t < tp ? E.smooth(span(t, tp - 1.4, tp)) : 1 - E.smooth(span(t, tp, tp + 1.4));
    E.lightFlood(ctx, fl);
  }
  const out = { a, kitchen, sea, train, draw, tp };
  MEMO.set(T, out);
  return out;
}
