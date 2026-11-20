// c10 · B2 · real agents (cross on the video) · the long hours · the dots: younger / older, a small share of cases · A PLAN, MADE ON A CALM DAY · HURRY + SECRET + MONEY = STOP
// The whole B2 group (c07–c11) is ONE continuous take drawn by lib/f65_b2_scene.mjs (helpers: lib/f65_b2_draw.mjs): every chunk returns the
// same draw function, so the inner boundaries match frame for frame. Seams: plateLine(3) at 'The third step is a face', plateLine(5) at 'Then one step is left'.
import * as F from '../lib/f65_kit.mjs';
import { b2 } from '../lib/f65_b2_scene.mjs';
export const PRINT = F.PRINT65;
export default async (T, R) => [{ t: R.a, draw: b2(T), print: PRINT }];
