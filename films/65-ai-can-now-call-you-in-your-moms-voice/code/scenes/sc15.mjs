// c15 · B3 · It won't stop at scams: the study on her phone (AI · HUMAN) · the glow rises · it arrives as a phone call · the kitchen table: TEN MINUTES · THIS WEEK, ONE WORD · ONE PERSON TO CALL · ONE NAME AT THE BANK
// The whole B3 group (c12–c16) is ONE continuous take drawn by lib/f65_b3_scene.mjs: every chunk returns the same draw function, so the
// inner boundaries match frame for frame. Plan: docs/shots.md · world: docs/MOTION.md · seam B2 → B3: plateLine(5) at 'Then one step is left'.
import * as F from '../lib/f65_kit.mjs';
import { b3Scene } from '../lib/f65_b3_scene.mjs';

export default async (T, R) => [{ t: R.a, draw: b3Scene(T), print: F.PRINT65 }];
