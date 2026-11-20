// c16 · B3 · One evening: the hook returns (H.06), she asks for the word, ★ the line goes quiet · the line, all five tags gold, the thesis · subscribe 2 (A.01) · the 15 s end picture (S.END_CAM, free tiles, no text, no QR)
// The whole B3 group (c12–c16) is ONE continuous take drawn by lib/f65_b3_scene.mjs: every chunk returns the same draw function, so the
// inner boundaries match frame for frame. Plan: docs/shots.md · world: docs/MOTION.md · seam B2 → B3: plateLine(5) at 'Then one step is left'.
import * as F from '../lib/f65_kit.mjs';
import { b3Scene } from '../lib/f65_b3_scene.mjs';

export default async (T, R) => [{ t: R.a, draw: b3Scene(T), print: F.PRINT65 }];
