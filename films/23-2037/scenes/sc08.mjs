// c08 · B2 · 360.88 – 411.13 · Dinner II: the other way · people got stubborn · one in five didn't hold up · test before you trust.
// ONE plan sequence in the kitchen (docs/shots.md 8.01–8.05), continuing c07's frame (CAM_SCREEN, the K1 point just landed on the cool
// road; the wall picture is the shared lib/f23_b2_wall.mjs wallArt, one function of t on both sides of the seam):
//   8.01 pull back to the table and the wall: three pictures stand on the cool road, each on its phrase (paid check-ups, the cube that
//        spits answers, the agent tied to the shop).
//   8.02 two-shot: 'making it up' she crosses her arms and leans back; 'So why didn't it' she leans in; 'stubborn' your hands go flat on
//        the table, and a gold line runs from them up to the wall's lower edge: the carrier into 8.03.
//   8.03 the road from the tower to the city with the testers' house between (card E5 top-left): the capsule rides to the house and
//        stops; 'for months' the month ticks; 'so slow' she groans (arms up, flop); 'On purpose' the testers' lamp glows warmer.
//   8.04 ★ five findings leave the tower; the fifth cracks and goes grey ('one in five', card E6); the pill through a one-way door.
//   8.05 every finding passes the testers' gate; the gap glows ('Outside the companies'); the house opens ('in the open'); a whole new
//        cool disc rolls in too ('Every new machine', card E7); 'before it reached anyone' everything sinks into the wall's lower edge.
// SEAM plateWall (B2 → B3, 'And today you say'): the camera lands exactly on K.CAM_WALL (no drift) by T0 − .5 with both at rest; for
// [T0 − .5, T0) this chunk draws the plate itself: K.world(CAM_WALL, WALL_STATE + dinnerPeople(t, CAM_WALL)).
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f23_kit.mjs';
import { seamT, WALL_STATE } from '../lib/f23_seams.mjs';
import * as B from '../lib/f23_b2.mjs';
import { dinnerPeople, dinnerHands, armAt, valAt, toWall, KID_REST, YOU_REST } from '../lib/f23_b2_dinner.mjs';
import { wallAnchors, wallArt, lightPath, TOWER } from '../lib/f23_b2_wall.mjs';
const { P, clamp, lerp, span, sineIO, expoOut, expoIn, camAt, camDrift } = E;
const { ZB, LIGHTWALL: LW, KITCHEN, look } = K;
const KY = KITCHEN.floor, ZREF = ZB - 150;
const scaleAt = (c) => c.f / Math.max(1, ZB - 170 - c.z);

export default (T, R) => {
  const H0 = B.homeAnchors(T), A = wallAnchors(T), T0 = seamT(T, 'wall'), TP = T0 - .5;
  const KEYS = [
    [R.a, K.CAM_SCREEN],
    [A.baby + 2.4, look(LW.cx, LW.y + 40, ZB, 1.72, 960, 60), 's'],                 // 8.01 pull back: the table and the wall
    [A.looksAt - .6, look(LW.cx, LW.y + 40, ZB, 1.78, 960, 60)],
    [A.making + .4, look(-1280, KY - 110, ZB - 170, 2.95, 960, 600), 's'],         // 8.02 the two at the table
    [A.stubborn + .35, look(-1276, KY - 110, ZB - 170, 3.05, 960, 600)],
    [A.stubborn + 2.4, look(LW.cx, LW.y, ZB, 1.9, 960, 64), 's'],                 // up the gold line onto the wall (8.03)
    [A.backThen, look(LW.cx + 6, LW.y, ZB, 1.98, 960, 62)],
    [A.test, look(LW.cx + 3, LW.y, ZB, 2.0, 960, 61)],
    [TP, K.CAM_WALL, 's'],                                                          // the seam frame, landed with zero speed
  ];
  const cam = (t) => {
    if (t >= TP) return K.CAM_WALL;
    const c = camAt(t, KEYS, ZREF);
    return camDrift(c, t, .45 * Math.min(1, 2.7 / scaleAt(c)) * sineIO(span(t, R.a, R.a + 1.6)) * (1 - sineIO(span(t, TP - 2.4, TP))), 23);
  };
  const draw = (ctx, t) => {
    if (t >= TP) {   // = plateWall + the two at rest (lead's ruling; identical to B3's side)
      K.world(ctx, K.CAM_WALL, t, { ...WALL_STATE, you: { ...WALL_STATE.you, kitchen: { ...WALL_STATE.you.kitchen, people: dinnerPeople(t, K.CAM_WALL) } } });
      return;
    }
    const c = cam(t), po = { kid: kidPose(t, A, TP), you: youPose(t, A, TP) }, hands = dinnerHands(t, c, po);
    const wallFn = (cx) => {
      wallArt(cx, t, A);
      // 8.02 → 8.03: from your hands a gold line runs up to the wall's lower edge, where the new road starts; then it is drawn in
      const t0 = A.stubborn + .3, t1 = A.stubborn + 1.6;
      if (t > t0 && t < t1 + .7 && hands.you.R && hands.you.L) {
        const m = [(hands.you.R[0] + hands.you.L[0]) / 2, (hands.you.R[1] + hands.you.L[1]) / 2], a = toWall(c, m), b = [LW.x + TOWER[0] - 30, LW.y + 340];
        lightPath(cx, [a, b], expoOut(span(t, t0, t1)), { w: 2.4, from: expoIn(span(t, t1, t1 + .7)) });
      }
    };
    B.homeWorld(ctx, c, t, H0, { kitchen: { people: dinnerPeople(t, c, po), wallFn } });
  };
  return [{ t: R.a, draw }];
};

// ---------------------------------------------------------------- the two at the table (from rest, back to rest by the seam)
function kidPose(t, A, TP) {
  const R0 = KID_REST.armR, L0 = KID_REST.armL, end = TP - 1.0;
  return {
    armR: armAt(t, [[A.making - .1, R0], [A.making + .45, [.25, 2.0]], [A.soWhy - .05, [.25, 2.0]], [A.soWhy + .45, [.65, 1.6]], [A.slow - .1, [.55, 1.5]],
      [A.slow + .3, [1.6, 2.6]], [A.slow + .9, [.45, 1.35]], [A.purpose + .3, R0], [end, R0]]),
    armL: armAt(t, [[A.making - .05, L0], [A.making + .5, [.3, 1.95]], [A.soWhy, [.3, 1.95]], [A.soWhy + .5, [.6, 1.55]], [A.slow - .05, [.5, 1.45]],
      [A.slow + .35, [1.5, 2.5]], [A.slow + .95, [.4, 1.3]], [A.purpose + .35, L0], [end, L0]]),
    look: valAt(t, [[A.baby, .15], [A.baby + .7, .85], [A.looksAt - .3, .85], [A.looksAt + .3, .3], [A.making + .4, .22], [A.soWhy + .4, .35], [A.stubborn + .6, .35],
      [A.stubborn + 1.6, .9], [A.slow, .9], [A.slow + .35, 1.15], [A.slow + .9, .2], [A.purpose, .85], [A.reached + .5, .85], [end, .15]]),
    lean: valAt(t, [[A.making, .12], [A.making + .45, -.06], [A.soWhy, -.06], [A.soWhy + .45, .38], [A.stubborn + .5, .3], [A.stubborn + 1.5, .12], [A.slow, .12],
      [A.slow + .35, -.08], [A.slow + .9, .3], [A.purpose + .3, .12]]),
    rise: valAt(t, [[A.soWhy, 0], [A.soWhy + .45, .4], [A.stubborn + 1.5, 0]]),
  };
}
function youPose(t, A, TP) {
  const R0 = YOU_REST.armR, L0 = YOU_REST.armL, s = A.stubborn, end = TP - 1.0;
  return {
    armR: armAt(t, [[s - .35, R0], [s + .15, [.95, 1.62]], [s + 2.6, [.95, 1.62]], [s + 3.4, R0]]),
    armL: armAt(t, [[s - .35, L0], [s + .2, [.9, 1.65]], [s + 2.6, [.9, 1.65]], [s + 3.4, L0]]),
    look: valAt(t, [[A.baby, .1], [A.baby + .8, .8], [A.looksAt - .1, .8], [A.looksAt + .5, .25], [s + .5, .2], [s + 1.3, .8], [A.reached + .5, .8], [end, .1]]),
    lean: valAt(t, [[A.looksAt, .1], [A.looksAt + .5, .16], [s - .2, .16], [s + .15, .26], [s + 1.5, .1]]),
  };
}
