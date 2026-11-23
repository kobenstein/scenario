// Film 49 · c08 · WORLD STUB (lead). Group B2. Bridge + step 2 · THE MACHINE. Exits INTO plateMachine at 'That is what the experts know'.
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, { to: 'plateMachine',
  keys: [[null, S.stageCam(2, 2.2, 150)], ['Two years to go', S.stageCam(3, 2.3), 1.5], ['And even most of their', A(1100, 600, .9, 960, 540)]],
  state: (t, T, h) => ({ lit: h.lit, nums: 1, stage: [0, 0, 0, 1, 0], you: you(3, 400, { look: .2, dir: -1 }) }) });
