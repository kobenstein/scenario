// c04 · The hour moved: washing machine, Cowan, email, infinite workday (s05 + s06) · 95.68–144.20 · Editorial-Nacht · builder B1
// 95.68 → board.tI1: the kitchen and the small hourglass (lib/f13_b1_water.mjs, same function as c03, which also runs the porthole
// iris); then lib/f13_b1_board.mjs (plan table there). Both are called with the same global t, so the switch is invisible.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import { makeWater } from '../lib/f13_b1_water.mjs';
export default async (T, R) => {
  E.prepareEditorial();
  const water = makeWater(T), board = water.board;
  return [{ t: R.a, draw: (ctx, t) => (t < board.tI1 + .05 ? water.draw(ctx, t) : board.draw(ctx, t)), print: K.PRINT13 }];
};
