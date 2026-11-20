// c11 · B3 · one entry; the whole B3 range (c10–c13) is ONE take drawn by lib/f54_b3_take.mjs (shot table there; plan docs/shots.md).
// The inner boundaries c10|c11|c12|c13 are the same draw function, so their frames match by construction.
import * as F from '../lib/f54_kit.mjs';
import { take } from '../lib/f54_b3_take.mjs';

export default async (T, R) => {
  const draw = take(T);
  return [{ t: R.a, draw: (ctx, t) => draw(ctx, t), print: F.PRINT54 }];
};
