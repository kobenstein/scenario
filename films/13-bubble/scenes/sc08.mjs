// Film 13 · c08 · builder B2. c06–c08 are ONE continuous take (lib/b2_take.mjs); this chunk draws the same take in its own window.
import * as K from '../lib/base_kit.mjs';
import { take } from '../lib/b2_take.mjs';
export default async (T, R) => [{ t: R.a, draw: take(T).draw, print: K.PRINT13 }];
