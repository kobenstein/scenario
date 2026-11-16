// c07 · No. 5 teacher (classroom window) · No. 4 doctor (bedside window) · No. 3 basement vs factory · K2 · → plateRankRow at 'Number two'
// One continuous take for c05–c07 (B2) lives in lib/f25_b2_take.mjs; each chunk returns the same cached take, so the seams
// c05|c06 and c06|c07 are frame-exact. Plan: docs/shots.md · world/rules: docs/MOTION.md
import { take } from '../lib/f25_b2_take.mjs';

export default async (T, R) => {
  const k = take(T);
  return [{ t: R.a, draw: k.draw, print: k.PRINT }];
};
