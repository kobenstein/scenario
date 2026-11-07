// c07 · built by B2 as part of ONE plan sequence c05–c07 (lib/f20_b2_scene.mjs): 'Yes. Earlier this year' (plateEye) →
// "The optimists' estimates" (plateTrack). All three chunks draw the same function, so c05|c06 and c06|c07 are seamless by construction.
// Plan: docs/shots.md · world/rules: docs/MOTION.md · kit: lib/f20_kit.mjs.
import * as F from '../lib/f20_kit.mjs';
import { b2 } from '../lib/f20_b2_scene.mjs';

export default async (T, R) => [{ t: R.a, draw: b2(T).draw, print: F.PRINT20 }];
