// Film 49 · c02 · WORLD STUB (lead). Group B1. Enters FROM plateFoot at 'Picture a wedding' (the string lights light, glide left to the table).
// Replace this file with the real chunk (docs/BRIEF-builders.md, docs/shots.md). Keep: the plate entry/exit named below, phrases only.
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/f49_world.mjs';
import { worldStub } from '../lib/stub.mjs';
const A = (u, v, s, sx = 960, sy = 540) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const you = (k, dx = 60, o = {}) => ({ x: S.STAGES[k].x0 + dx, y: S.STAGES[k].y, o });
export default (T, R) => worldStub(T, R, { from: 'plateFoot',
  keys: [[null, A(-630, 880, 2.0), 4], ['And he expects the change', A(-300, 700, .7, 960, 560)], ['So start the countdown', A(980, 600, .78, 960, 520), 2]],
  state: (t, T, h) => ({ lit: h.lit, wedding: { a: 1, lights: E.clamp((t - R.a - .5) / 1.5) }, decades: E.clamp((t - T.G('And he expects the change')) / 3), nums: E.clamp((t - T.G('So start the countdown')) / 2),
    laptop: { x: S.PLATE_FOOT.laptopX, on: 0 }, you: { x: S.PLATE_FOOT.youX, y: S.STAGES[0].y, o: { look: .3, back: .2 } } }) });
