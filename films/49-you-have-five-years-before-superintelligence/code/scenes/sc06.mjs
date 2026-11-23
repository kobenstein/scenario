// Film 49 · c06 · WORLD STUB (lead). Group B2. Enters FROM plateWork at 'But you can only do so much'. Subscribe 1: the crowd.
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, { from: 'plateWork',
  keys: [[null, S.stageCam(1, 2.0, 100), 3], ['This channel exists', A(900, 620, .8, 960, 520), 1], ['You met this machine', S.stageCam(1, 2.3)], [null, S.stageCam(2, 2.0), -1]],
  state: (t, T, h) => ({ lit: h.lit, nums: 1, stage: [0, 1, 0, 0, 0], crowd: E.clamp((t - T.G('This channel exists')) / 2) * E.clamp((T.G('You met this machine') - t) / 1.5),
    you: { x: S.WORK_DESK.x - 52, y: S.STAGES[1].y, o: { look: .2 } }, land: (cx) => S.workDesk(cx, t) }) });
