// Film 49 · c03 · WORLD STUB (lead). Group B1. Step 5 · YOU. Starts on the whole stairs after the countdown (B1 owns the c02/c03 seam).
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, {
  keys: [[null, A(980, 600, .78, 960, 520)], ['Five years to go', S.stageCam(0, 2.3), 1.5], ['Among America', S.stageCam(0, 2.0, 120)], [null, S.stageCam(0, 2.2, 200), -1]],
  state: (t, T, h) => ({ lit: h.lit, nums: 1, stage: [1, 0, 0, 0, 0], you: you(0, 140, { look: .3 }) }) });
