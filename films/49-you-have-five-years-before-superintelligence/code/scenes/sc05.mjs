// Film 49 · c05 · WORLD STUB (lead). Group B1. Step 4 · WORK. Exits INTO plateWork at 'But you can only do so much'.
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, { to: 'plateWork',
  keys: [[null, S.stageCam(1, 2.0)], ['Four years to go', S.stageCam(1, 2.3), 1.5]],
  state: (t, T, h) => ({ lit: h.lit, nums: 1, stage: [0, 1, 0, 0, 0], you: you(1, 120, { look: .3 }), land: (cx) => S.workDesk(cx, t) }) });
