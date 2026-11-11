// c10 · B3 · one entry. The whole of B3 (c08–c11, 7:01 → end) is ONE continuous take drawn by lib/f26_b3_scene.mjs (shot table there,
// plan: docs/shots.md); this chunk only owns its time range [R.a, R.b), so every inner boundary is the same frame on both sides.
import { b3, PRINT } from '../lib/f26_b3_scene.mjs';
export default async (T, R) => [{ t: R.a, draw: b3(T).draw, print: PRINT }];
