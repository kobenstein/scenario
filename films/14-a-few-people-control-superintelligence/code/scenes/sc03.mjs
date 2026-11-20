// c03 · Station 1, part 1 (s05) · shots 3.01–3.07: billions of numbers, the compute block, the vault, two-party authorization, the
// desk with the second signature. One plan sequence from 2.04 to 4.08, drawn by lib/f14_b1_station1.mjs (shared with c02 and c04,
// so every seam inside B1 is the same picture). Plan: docs/shots.md · rules: docs/MOTION.md.
import * as E from '../lib/f10_editorial.mjs';
import { PRINT } from '../lib/f14_hook.mjs';
import { station1 } from '../lib/f14_b1_station1.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: station1(T), print: PRINT }]; };
