// Film 49 · c11 · WORLD STUB (lead). Group B3. Dawn (thumbnail A, the only time), suppose it all works: you step onto the landing.
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, {
  keys: [[null, A(1250, 600, .8, 960, 520)], ['So suppose all of it works', A(1500, 520, .95, 960, 560)], [null, A(1900, 420, 1.3, 960, 560), -1]],
  state: (t, T, h) => ({ lit: [1, 1, 1, 1, 1], nums: 1, stage: [1, 1, 1, 1, 1], dawn: E.clamp((t - R.a) / 6), you: you(4, 120, { look: .6 }) }) });
