// c11 · builder B2 · one continuous take with c07–c11: the whole group is drawn by lib/f29_b2_take.mjs (the same draw function in every
// chunk, so the inner boundaries match frame for frame). Plan: docs/shots.md (B2) · world + seams: lib/f29_seams.mjs.
import * as F from '../lib/f29_kit.mjs';
import { take } from '../lib/f29_b2_take.mjs';
export default async (T, R) => [{ t: R.a, draw: take(T), print: F.PRINT29 }];
