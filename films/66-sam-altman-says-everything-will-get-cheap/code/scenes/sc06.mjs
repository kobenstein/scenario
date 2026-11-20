// c06 · B2 · part of the one continuous take of c05–c08: the group (anchors, camera, world, explainers) lives in scenes/sc05.mjs.
// One entry; its frames are the same function of t as the neighbouring chunks, so the inner boundaries are seamless.
import { group, preload, PRINT } from './sc05.mjs';
export default async (T, R) => { await preload(T); return [{ t: R.a, draw: group(T).draw, print: PRINT }]; };
