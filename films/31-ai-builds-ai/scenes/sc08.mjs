// c08 · B2 · part of the one take c07–c09 (built in scenes/sc07.mjs, group()): this chunk returns the same draw function for its range,
// so the inner seams are the same picture on both sides. Shots: docs/shots.md (see the table in sc07.mjs).
import { group, PRINT } from './sc07.mjs';
export default async (T, R) => [{ t: R.a, draw: group(T), print: PRINT }];
