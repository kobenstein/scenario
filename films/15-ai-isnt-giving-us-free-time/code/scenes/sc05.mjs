// c05 · Linder, the sand slips past you, this machine is different (s07) · 144.20–178.00 · Editorial-Nacht · builder B1
// lib/f13_b1_board.mjs (the stage, the small hourglass, the ∞) with lib/f13_b1_vessel.mjs (plan table there) on top; same global t
// as c04, so the seam at 144.20 is the same picture on both sides.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import { makeBoard } from '../lib/f13_b1_board.mjs';
import { makeVessel } from '../lib/f13_b1_vessel.mjs';
export default async (T, R) => {
  E.prepareEditorial();
  const board = makeBoard(T), vessel = makeVessel(T, board);
  return [{ t: R.a, draw: vessel.draw, print: K.PRINT13 }];
};
