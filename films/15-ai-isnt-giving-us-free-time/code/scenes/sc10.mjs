// c10 · Firms: four-day week, time dividend, hospital (s16 + s17) · 399.24–448.88 · Editorial-Nacht · builder B2
// Drawn by lib/f13_b2_rules.mjs (c09 and c10 share one draw function, so the c09|c10 seam — the pen on the sheet — is one picture;
// the plan table is in that file's header). The chunk ends on the shared seam plate plateSheet (lib/f13_seams.mjs) at 448.88.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import { build } from '../lib/f13_b2_rules.mjs';
export default async (T, R) => {
  E.prepareEditorial();
  return [{ t: R.a, draw: build(T), print: K.PRINT13 }];
};
