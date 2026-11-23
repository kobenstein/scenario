// Film 49 · c12 · WORLD STUB (lead). Group B3. The wedding again on the landing; ends in S.endScreen (last 15 s).
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, { to: 'end',
  keys: [[null, A(1900, 420, 1.3, 960, 560)], ['For most of history', A(-1500, 900, .4, 960, 560)], ['There is no next generation', A(1900, 420, 1.2, 960, 560)]],
  state: (t, T, h) => ({ lit: [1, 1, 1, 1, 1], stage: [1, 1, 1, 1, 1], old: .6, topTable: { a: 1, lights: 1 }, you: { x: 1980, y: S.LANDING.top - S.TD * .45, o: { look: .4 } } }) });
