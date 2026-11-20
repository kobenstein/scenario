// c03 · built by B1 as part of ONE plan sequence c02–c04 (lib/f18_b1_board.mjs): every B1 chunk returns the same draw function, so the
// seams c02|c03 and c03|c04 are identical frames by construction. Plan: docs/shots.md · kit: lib/f18_kit.mjs.
import * as F from '../lib/f18_kit.mjs';
import { b1Take } from '../lib/f18_b1_board.mjs';
export default async (T, R) => [{ t: R.a, draw: b1Take(T), print: F.PRINT18 }];
