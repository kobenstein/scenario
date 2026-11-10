// c06 · subscribe 1: the ridge of lamps tapers into the rank-row plain · No. 6 agents (workflow chain, two beads) · Amodei card
// One continuous take for c05–c07 (B2) lives in lib/f25_b2_take.mjs; each chunk returns the same cached take, so the seams
// c05|c06 and c06|c07 are frame-exact. Plan: docs/shots.md · world/rules: docs/MOTION.md
import { take } from '../lib/f25_b2_take.mjs';

export default async (T, R) => {
  const k = take(T);
  return [{ t: R.a, draw: k.draw, print: k.PRINT }];
};
