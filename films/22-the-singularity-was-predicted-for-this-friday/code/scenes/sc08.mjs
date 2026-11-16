// c08 · built by B2 as part of ONE plan sequence c06–c08 (lib/f19_b2_world.mjs: the shared state function; the chunk seams c06|c07 and
// c07|c08 are the same function at the same t). Plan: docs/shots.md (chunk c08) · world: docs/MOTION.md · kit: lib/f19_kit.mjs.
import * as F from '../lib/f19_kit.mjs';
import { world } from '../lib/f19_b2_world.mjs';
export const PRINT = F.PRINT19;
export default async (T, R) => [{ t: R.a, draw: world(T), print: PRINT }];
