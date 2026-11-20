// Film 15 · group B2 (c07–c11, 198.46 – 380.30) · ONE take over five chunks: every scene file draws this same function, so the
// chunk seams inside the group are invisible by construction (as the hook does with hook(T)). The sets inside hand over on
// identical frames (shared drawing at the hand-over time) or through a small plate:
//   setQ  c07  198.46 →  ~240.9  plateDivide → quote card, five sheets, calendar, the cell clock (lib/f15_b2_c07.mjs)
//   setP  c07/c08 → 271.60       the plain of lights, the life line, your card, the first morning → STROKE plate (lib/f15_b2_c08.mjs)
//   setW  c09  271.60 → 306.24   tally wall, ten, the village, the notebook, the empty bed → the box, INFECTIONS glows (lib/f15_b2_c09.mjs)
//   setH  c10/c11 → 380.30       hepatitis C pack, 1 in 5, the road of reach, budget, bridge, Zambia, Africa → plateShot (lib/f15_b2_c10.mjs, c11)
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import { setQ, clockTimes } from './f15_b2_c07.mjs';
import { setP } from './f15_b2_c08.mjs';
import { setW } from './f15_b2_c09.mjs';
import { setH } from './f15_b2_c10.mjs';
import { setR } from './f15_b2_c11.mjs';

export const PRINT = F.PRINT15;
let CACHE = null;
export function b2(T) {
  if (CACHE) return CACHE;
  const PL = setP(T, clockTimes(T)), Q = setQ(T, PL), WS = setW(T), HS = setH(T, WS), RS = setR(T, WS, HS);
  const sets = [[Q, Q.tEnd], [PL, T.seg('s09').start], [WS, HS.t0], [HS, RS.t0], [RS, Infinity]];
  CACHE = (ctx, t) => { for (const [s, end] of sets) if (t < end) { s.draw(ctx, t); return; } };
  return CACHE;
}
export const entry = (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b2(T), print: PRINT }]; };
