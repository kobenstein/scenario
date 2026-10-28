// c09 (B3) · thin wrapper: the take lives in lib/b3_c09.mjs (one entry = one continuous take; seams: lib/b3_common.mjs)
import * as K from '../lib/base_kit.mjs';
import { make } from '../lib/b3_c09.mjs';
export default async (T, R) => [{ t: R.a, draw: make(T, R), print: K.PRINT13 }];
