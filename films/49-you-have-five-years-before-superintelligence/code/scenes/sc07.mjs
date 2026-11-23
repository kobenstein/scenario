// Film 49 · c07 · WORLD STUB (lead). Group B2. Step 3 · FAMILY (B2 owns c06/c07 and c07/c08).
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, {
  keys: [[null, S.stageCam(2, 2.0)], ['Three years to go', S.stageCam(2, 2.4), 1.5], ['Somebody had to write', S.stageCam(2, 2.6, 80)], [null, S.stageCam(2, 2.2, 150), -1]],
  state: (t, T, h) => ({ lit: h.lit, nums: 1, stage: [0, 0, 1, 0, 0], you: you(2, 120, { look: .3 }) }) });
