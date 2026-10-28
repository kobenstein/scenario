// c09 · No villain, mission line, the time we kept (s14 + s15) · 351.48–399.24 · Editorial-Nacht · builder B2
// Drawn by lib/f13_b2_rules.mjs (c09 and c10 share one draw function, so the c09|c10 seam — the pen on the sheet — is one picture;
// the plan table is in that file's header). It starts from the end state of c08 (lib/f13_b2_bc.mjs): the axis line and the last window.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import { build } from '../lib/f13_b2_rules.mjs';
export default async (T, R) => {
  E.prepareEditorial();
  return [{ t: R.a, draw: build(T), print: K.PRINT13 }];
};
