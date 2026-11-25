// c05 · B1 · 'Now imagine the machine Jack Good' → 'Because energy is only as good'. Rows 2.11–2.21 (docs/shots.md).
// The scene lives in sc04.mjs: c04 and c05 are ONE draw function of t, so the inner seam c04 → c05 is the same frame on both sides.
import { scene, anchors, PRINT } from './sc04.mjs';
export default async (T, R) => [{ t: R.a, draw: scene(anchors(T), T), print: PRINT }];
