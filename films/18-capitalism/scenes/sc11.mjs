// c11 · built by B3. c09, c10 and c11 are ONE plan sequence on the board, drawn by lib/f18_b3_film.mjs (shared camera keys and state,
// so the seams c09|c10 ('Housing') and c10|c11 ("Capitalism won't end") are identical frames by construction). Shots: docs/shots.md.
import { makeB3, PRINT } from '../lib/f18_b3_film.mjs';
let B3 = null;
export default async (T, R) => { B3 = B3 || makeB3(T); return [{ t: R.a, draw: B3.draw, print: PRINT }]; };
