// c07 · Battle Creek 1930: Kellogg 8 → 6, Hunnicutt, what the town did (s10 + s11) · 236.70–294.02 · Editorial-Nacht · builder B2
// The chunk is drawn by lib/f13_b2_bc.mjs (separate pictures joined by carriers; plan table in its header). sc08 uses the same
// draw function, so the c07|c08 seam (the gathered sand → the low sun) is one continuous picture.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import { build } from '../lib/f13_b2_bc.mjs';
export default async (T, R) => {
  E.prepareEditorial();
  return [{ t: R.a, draw: build(T), print: K.PRINT13 }];
};
