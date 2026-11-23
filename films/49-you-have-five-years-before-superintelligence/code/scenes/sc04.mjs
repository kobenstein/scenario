// Film 49 · c04 · WORLD STUB (lead). Group B1. Fresh start on step 5, then the second step lights (B1 owns c03/c04 and c04/c05).
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, {
  keys: [[null, S.stageCam(0, 2.2, 200)], ['What the next generation always had', A(-2600, 1000, .5, 960, 640), 1], ['So choose your own', S.stageCam(0, 2.2, 260)], [null, S.stageCam(1, 2.0), -1]],
  state: (t, T, h) => ({ lit: h.lit, nums: 1, old: .6, stage: [1, 0, 0, 0, 0], you: you(0, 260, { look: .4 }) }) });
