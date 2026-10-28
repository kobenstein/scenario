// c02 · Hook II: Berkeley, a lie? → No, the working year halved (s02 + s03) · 33.44–63.48 · Editorial-Nacht · builder B1
// The whole chunk is drawn by lib/f13_b1_city.mjs (the same world as the end of c01, same global t), so the
// c01|c02 seam is invisible. Plan table: see the header of lib/f13_b1_city.mjs.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import { makeCity } from '../lib/f13_b1_city.mjs';
export default async (T, R) => {
  E.prepareEditorial();
  const city = makeCity(T);
  return [{ t: R.a, draw: city.draw, print: K.PRINT13 }];
};
