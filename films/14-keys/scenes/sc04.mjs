// c04 · Station 1, part 2 (s06, s07) · shots 4.01–4.08: the secure area and its throttle, size becomes security, the 1950s launch
// room (🔑 4.05–4.07: two officers, two keys), the keys sink, the file on the console screen → plateScreen (B2).
// Same plan sequence as c02/c03 (lib/f14_b1_station1.mjs). Plan: docs/shots.md · rules: docs/MOTION.md.
import * as E from '../lib/f10_editorial.mjs';
import { PRINT } from '../lib/f14_hook.mjs';
import { station1 } from '../lib/f14_b1_station1.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: station1(T), print: PRINT }]; };
