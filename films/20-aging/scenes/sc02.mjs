// c02 · built by B1. c02 + c03 + c04 are ONE plan sequence (lib/f20_b1_seq.mjs): this chunk returns one entry that draws the
// shared sequence, so the boundaries inside B1's range are seamless by construction. Plan: docs/shots.md · world: docs/MOTION.md.
import * as F from '../lib/f20_kit.mjs';
import { b1Draw } from '../lib/f20_b1_seq.mjs';
export default async (T, R) => [{ t: R.a, draw: b1Draw(T), print: F.PRINT20 }];
