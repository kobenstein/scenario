// Film 49 · c10 · WORLD STUB (lead). Group B3. Step 1 · YOUR SAY (C2 lands here).
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, {
  keys: [[null, S.stageCam(4, 2.0)], ['One year to go', S.stageCam(4, 2.4), 1.5], ['Neither version is law', S.stageCam(4, 2.6, 60)], [null, A(1250, 600, .8, 960, 520), -1]],
  state: (t, T, h) => ({ lit: h.lit, nums: 1, stage: [0, 0, 0, 0, 1], you: you(4, 80, { look: .4 }) }) });
