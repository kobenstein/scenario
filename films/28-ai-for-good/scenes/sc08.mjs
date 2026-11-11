// c08 · No. 6 dark ships
// T.G('Big ships are supposed') → T.G('In the open ocean') · builder B2 · plan: docs/shots.md 6.01–6.08
// All of c07–c10 is ONE master draw (lib/f28_b2.mjs): the chunk boundaries sit inside continuous takes. This file only hands it over.
// Takes (the sea world of lib/f28_b2_sea.mjs, no cut): ships as strings of light with radio rings → HOW MANY ARE DARK? → a satellite's
// radar picture grows out of the sky (hulls, the broadcasts, ≈ 75 %, lamp 6, the track that never returns, the zigzag, RISK tag) and
// shrinks back → a ship switches its radio off → a flat ring on the water.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import { b2 } from '../lib/f28_b2.mjs';

export default async (T, R) => {
  E.prepareEditorial();
  return [{ t: R.a, draw: b2(T).draw, print: F.PRINT28 }];
};
