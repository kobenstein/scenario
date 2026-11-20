// c07 · B2 · Step 3 · a face: out of plateLine(3) into a lit town window (the forged leader on her tablet, ABOUT CA$900,000) · NEARLY HALF · the promised return
// The whole B2 group (c07–c11) is ONE continuous take drawn by lib/f65_b2_scene.mjs (helpers: lib/f65_b2_draw.mjs): every chunk returns the
// same draw function, so the inner boundaries match frame for frame. Seams: plateLine(3) at 'The third step is a face', plateLine(5) at 'Then one step is left'.
import * as F from '../lib/f65_kit.mjs';
import { b2 } from '../lib/f65_b2_scene.mjs';
export const PRINT = F.PRINT65;
export default async (T, R) => [{ t: R.a, draw: b2(T), print: PRINT }];
