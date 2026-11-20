// c08 · B2 · part of the one continuous take of c05–c08: the group (anchors, camera, world, explainers) lives in scenes/sc05.mjs.
// One entry; its frames are the same function of t as the neighbouring chunks, so the inner boundaries are seamless (S.plateStairs for the last .5 s is drawn by the group).
import { group, preload, PRINT } from './sc05.mjs';
export default async (T, R) => { await preload(T); return [{ t: R.a, draw: group(T).draw, print: PRINT }]; };
