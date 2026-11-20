// c05 · B1 (Film 19) · one entry: the shared B1 plan sequence c02–c05 (lib/f19_b1_world.mjs), so the inner seams are invisible by construction.
// Plan: docs/shots.md (chunk c05) · world: docs/MOTION.md · kit: lib/f19_kit.mjs · seams: lib/f19_seams.mjs (plateLines at c02, plateSlip at c06).
import * as F from '../lib/f19_kit.mjs';
import { world } from '../lib/f19_b1_world.mjs';
export default async (T, R) => [{ t: R.a, draw: world(T), print: F.PRINT19 }];
