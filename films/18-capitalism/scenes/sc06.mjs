// c06 · built by B2 (c05–c08 are one plan sequence: lib/f16_b2.mjs, stages lib/f16_b2_s1.mjs + lib/f16_b2_s2.mjs).
// One entry; the chunk boundaries inside the group draw the same function on both sides (identical frames).
import * as K from '../lib/f16_kit.mjs';
import { b2 } from '../lib/f16_b2.mjs';
export default async (T, R) => [{ t: R.a, draw: b2(T).draw, print: K.PRINT16 }];
