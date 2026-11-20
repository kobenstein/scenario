// c08 · builder B2. c07–c10 are ONE continuous take (lib/f19_b2.mjs makeB2), so the c07|c08|c09|c10 boundaries are identical by construction.
// Starts/ends on the seam plates: plateLine at T.G('And if the fall keeps going') (B1 → B2), plateNet at T.G('On Black Monday') (B2 → B3).
import { makeB2 } from '../lib/f19_b2.mjs';
import { PRINT19 } from '../lib/f19_kit.mjs';
export default async (T, R) => [{ t: R.a, draw: makeB2(T), print: PRINT19 }];
