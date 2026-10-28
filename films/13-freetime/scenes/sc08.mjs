// c08 · The summer evening (heart), then how it slipped (s12 + s13) · 294.02–351.48 · Editorial-Nacht · builder B2
// Drawn by lib/f13_b2_bc.mjs (the same draw function as sc07, so the c07|c08 seam — the gathered sand that is the low sun — is one
// continuous picture). Plan table: the c08 section of that file.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import { build } from '../lib/f13_b2_bc.mjs';
export default async (T, R) => {
  E.prepareEditorial();
  return [{ t: R.a, draw: build(T), print: K.PRINT13 }];
};
