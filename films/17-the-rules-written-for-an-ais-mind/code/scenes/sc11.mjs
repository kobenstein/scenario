// c11 · built by B3. c09, c10 and c11 are one continuous take drawn by lib/f16_b3.mjs (see its header); this chunk is one entry of it,
// so the chunk seams are identical frames. Plan: docs/shots.md (B3 notes and deviations in the B3 report).
import * as K from '../lib/f16_kit.mjs';
import { b3 } from '../lib/f16_b3.mjs';
export default async (T, R) => [{ t: R.a, draw: b3(T), print: K.PRINT16 }];
