// Film 49 · c09 · WORLD STUB (lead). Group B3. Enters FROM plateMachine at 'That is what the experts know'. Ends as the top step lights (B3 owns c09/c10).
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, { from: 'plateMachine',
  keys: [[null, S.stageCam(3, 2.3, 100), 3], ['The last step needs', A(1300, 520, 1.0, 960, 560)], [null, S.stageCam(4, 2.0), -1]],
  state: (t, T, h) => ({ lit: h.lit, nums: 1, stage: [0, 0, 0, 1, 0], you: you(3, 400, { look: .3, dir: -1 }) }) });
