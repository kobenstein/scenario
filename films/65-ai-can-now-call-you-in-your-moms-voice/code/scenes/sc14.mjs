// c14 · B3 · A copy needs an original: three tiles over the town, ribbons to the glow · the copy stops at her kitchen window · the five notes · ★ a gold voice = proof, it turns neutral, its gold slides onto the notes
// The whole B3 group (c12–c16) is ONE continuous take drawn by lib/f65_b3_scene.mjs: every chunk returns the same draw function, so the
// inner boundaries match frame for frame. Plan: docs/shots.md · world: docs/MOTION.md · seam B2 → B3: plateLine(5) at 'Then one step is left'.
import * as F from '../lib/f65_kit.mjs';
import { b3Scene } from '../lib/f65_b3_scene.mjs';

export default async (T, R) => [{ t: R.a, draw: b3Scene(T), print: F.PRINT65 }];
