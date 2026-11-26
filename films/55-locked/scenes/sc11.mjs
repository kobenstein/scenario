// c11 · B2 · one continuous take with c07–c11 (lib/f55_b2_world.mjs holds the anchors, the camera path, the state and every picture;
// the five chunks return the same draw function, so the inner boundaries are the same frame). Shot table: lib/f55_b2_world.mjs header.
import * as F from '../lib/f55_kit.mjs';
import { draw } from '../lib/f55_b2_world.mjs';
export const PRINT = F.PRINT55;
export default async (T, R) => [{ t: R.a, draw: draw(T), print: PRINT }];
