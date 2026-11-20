// c08 · B2 · the house rule in her kitchen (FACE + PROFIT = FAKE, no link from an ad) · tags 1–3 · she might call you: the gold arc · M.01 subscribe (calm, no text)
// The whole B2 group (c07–c11) is ONE continuous take drawn by lib/f65_b2_scene.mjs (helpers: lib/f65_b2_draw.mjs): every chunk returns the
// same draw function, so the inner boundaries match frame for frame. Seams: plateLine(3) at 'The third step is a face', plateLine(5) at 'Then one step is left'.
import * as F from '../lib/f65_kit.mjs';
import { b2 } from '../lib/f65_b2_scene.mjs';
export const PRINT = F.PRINT65;
export default async (T, R) => [{ t: R.a, draw: b2(T), print: PRINT }];
