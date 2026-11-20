// c07 · B3 · shots 7.01–7.11 (the second key, the test tables, sycophancy, the fragile bridge) · one plan sequence for c07 + c08,
// drawn by lib/f14_b3_world.mjs (shared, so the c07|c08 seam is the same picture). Plan: docs/shots.md · rules: docs/MOTION.md.
import * as E from '../lib/f10_editorial.mjs';
import { b3, b3Anchors, PRINT } from '../lib/f14_b3_world.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b3(b3Anchors(T)), print: PRINT }]; };
