// c01 · Hook I (s00, Q1 card, s01, s02) · shots 1.01–1.06 · one plan sequence, drawn by lib/f14_hook.mjs (shared with sc02 so the
// c01|c02 seam is the same picture). Plan: docs/shots.md (source tools/shots14.py) · rules: docs/MOTION.md.
import * as E from '../lib/f10_editorial.mjs';
import { hook, hookAnchors, PRINT } from '../lib/f14_hook.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: 0, draw: hook(hookAnchors(T)), print: PRINT }]; };
