// c06 · Not so far: Berkeley, the juggler, Hassabis (s08 + s09) · 178.00–236.70 · Editorial-Nacht · builder B1
// lib/f13_b1_night.mjs (plan table there) on top of lib/f13_b1_board.mjs + lib/f13_b1_vessel.mjs (same global t as c05, so the seam
// at 178.00 is the same picture on both sides). Ends inside the glass: lib/f13_seams.mjs plateGlass, opaque for [T0 − .5, T0).
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import { makeBoard } from '../lib/f13_b1_board.mjs';
import { makeVessel } from '../lib/f13_b1_vessel.mjs';
import { makeNight } from '../lib/f13_b1_night.mjs';
export default async (T, R) => {
  E.prepareEditorial();
  const board = makeBoard(T), vessel = makeVessel(T, board), night = makeNight(T, board, vessel);
  return [{ t: R.a, draw: night.draw, print: K.PRINT13 }];
};
