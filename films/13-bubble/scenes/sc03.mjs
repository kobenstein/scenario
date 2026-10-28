// c03 · B1 · one entry: the B1 take (lib/b1_take.mjs) owns 56.86 → 257.90 as one continuous function, so the seams inside the
// package are invisible by construction; this chunk owns [R.a, R.b) of it (film.mjs drops everything outside).
// Plan: docs/shots.md (c03 rows) · rules docs/MOTION.md · world lib/b1_c03.mjs (+ lib/b1_kit.mjs).
import { take, PRINT } from '../lib/b1_take.mjs';

export default async (T, R) => [{ t: R.a, draw: take(T).draw, print: PRINT }];
