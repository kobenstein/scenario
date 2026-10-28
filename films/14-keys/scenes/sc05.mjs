// c05 · Station 2 (s08–s10) · shots 5.01–5.11: the sleeper (test sheet → code page of light, 2023 / 2024, three waves, the lens).
// One plan sequence with c06, drawn by lib/f14_b2_world.mjs (so the c05|c06 seam is the same picture). Starts on the lead's plate
// plateScreen (B1 → B2), ends on plateWindow (B2 → B3) inside c06. Plan: docs/shots.md · rules: docs/MOTION.md.
import * as E from '../lib/f10_editorial.mjs';
import { b2, b2Anchors, PRINT } from '../lib/f14_b2_world.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b2(b2Anchors(T)), print: PRINT }]; };
