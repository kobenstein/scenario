// c06 · built by B2. The whole B2 group (c05 → c08) is ONE plan sequence drawn by lib/f18_b2_world.mjs (plan table in its header);
// this chunk returns one entry of it, so the seams between c05, c06, c07 and c08 are the same frame on both sides by construction.
import * as F from '../lib/f18_kit.mjs';
import { b2World } from '../lib/f18_b2_world.mjs';
export default async (T, R) => [{ t: R.a, draw: b2World(T).draw, print: F.PRINT18 }];
