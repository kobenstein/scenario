// c15 · B3 · 'So here is what the evidence' → 'So stand at that fence once more'
// 3.14 the camera comes down to the mother on her walk: the mammoth's traits light gold on HER body (fur grows, fat, the ears shrink:
//      F.COLD, the same drawing): THE TRAITS, IN AN ELEPHANT · NOT THE MAMMOTH · 3.15 the gold of the snow flies up and builds the poster
//      mammoth on the horizon (all the light on it: the cameras, the money), then the camera turns back left to the quiet things: the
//      frost doors glow (a freezer), the mast blinks and the comb reads along the wall (a machine learning to read what's inside).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f29_kit.mjs';
import * as B from '../lib/f29_b3_core.mjs';

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T), K = B.keys(a);
  return [{ t: R.a, draw: scene(a, K), print: F.PRINT29 }];
};

function scene(a, K) {
  return (ctx, t) => {
    const { c } = B.world(ctx, t, a, K);
    if (!c) return;
    B.line(ctx, t, 'THE TRAITS, IN AN ELEPHANT', 110, 214, a.inEl - .15, a.cameras - .1, { size: 62 });
    B.line(ctx, t, 'NOT THE MAMMOTH', 110, 296, a.notM, a.cameras - .1, { size: 62, col: F.GOLD.text });
  };
}
