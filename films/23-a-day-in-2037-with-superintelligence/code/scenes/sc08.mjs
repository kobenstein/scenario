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
import { wallAnchors, wallArt, lightPath, TOWER, HOUSE } from '../lib/f23_b2_wall.mjs';
import { cityWindow, evening, camKeys, walker, winCam, winScreen, winFull } from '../lib/f23_b3_city.mjs';
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
  const WINS = c08Windows(A);
  const cam = (t) => {
    if (t >= TP) return K.CAM_WALL;
    const c = camAt(t, KEYS, ZREF);
    return winCam(WINS, camDrift(c, t, .45 * Math.min(1, 2.7 / scaleAt(c)) * sineIO(span(t, R.a, R.a + 1.6)) * (1 - sineIO(span(t, TP - 2.4, TP))), 23), t);
  };
  const draw = (ctx, t) => {
    if (t >= TP) {   // = plateWall + the two at rest (lead's ruling; identical to B3's side)
      K.world(ctx, K.CAM_WALL, t, { ...WALL_STATE, you: { ...WALL_STATE.you, kitchen: { ...WALL_STATE.you.kitchen, people: dinnerPeople(t, K.CAM_WALL) } } });
      return;
    }
    const fw = winFull(WINS, t); if (fw) { fw.drawFull(ctx, t); return; }   // inside a city window (lib/f23_b3_city.mjs)
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
    winScreen(WINS, ctx, c, t);
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

// ---------------------------------------------------------------- CITY WINDOWS (B3 rework 9.11.): the wall opens onto the real place
//   W1 'So why didn't it?' … 'stubborn': the clinic at the end of the street, its door open, everyone queues in the same warm light;
//      on 'stubborn' a gold ring runs from the clinic over the street and the windows it reaches glow (care for everyone)
//   W2 'test it before you trust it' … 'in the open': the testers' house between the tower and the city, its front folds down,
//      the testers check a capsule and a machine disc; people stand outside and watch
function c08Windows(A) {
  const { ZS } = K, CL = K.STREET.clinic, ringR = (t) => 9000 * expoOut(span(t, A.stubborn - .1, A.stubborn + 2.2));
  const CL_A = look(-5150, 0, ZS, .74, 980, 880), CL_B = look(-5060, 0, ZS, .84, 980, 872);
  const W1 = cityWindow({
    t0: A.making + .1, tFull: A.soWhy + 1.4, tBack: A.stubborn + 1.6, t1: A.antib + 1.0,
    from: [LW.x + 120, LW.y + 280], to: [LW.x + HOUSE[0], LW.y + 330],
    view: (t) => ({ cam: camKeys(t, [[A.making + .1, CL_A], [A.antib + 1, CL_B, 'l']], ZS, .35, 81),
      state: evening(18.85, { winFn: (wn) => { const d = Math.abs(wn.X - CL.win[0]), g = clamp((ringR(t) - d) / 900) * clamp(1 - (d - 1500) / 9000); return { lit: wn.r < .5 ? 1 : clamp((g - .15) * 3), gold: .8 * g, cool: 0 }; } }) }),
    life: (ctx, c, t) => {
      const q = [[-5250, 90, 1, 101, false], [-5140, 140, -1, 102, false], [-5020, 146, -1, 103, true], [-4900, 136, -1, 104, false]];
      q.forEach(([x, h, d, seed, long], i) => {
        const step = expoOut(span(t, A.making + 3 + i * .15, A.making + 4.2 + i * .15)) * 40;   // the queue moves up one small step
        if (i === 0) walker(ctx, c, t, { x0: x - step, v: 0, z: 2860, h, seed, kid: true, look: .4 });
        else walker(ctx, c, t, { x0: x - step, v: 0, z: 2860 + i * 12, h, seed, dir: d, long, look: .15, armR: i === 2 ? [.35, .9] : undefined });
      });
      walker(ctx, c, t, { x0: -3950, v: -42, z: 2780, h: 140, seed: 105, ts: A.soWhy });
      walker(ctx, c, t, { x0: -5560, v: -36, z: 2700, h: 128, seed: 106, ts: A.soWhy - 2, long: true });
      const r = ringR(t), p = K.wp(c, CL.win[0], CL.win[1], ZS);   // the ring of care spreading from the clinic window
      if (p && r > 0 && r < 9000) { const rr = r * p[2], a = 1 - r / 9000; ctx.save(); ctx.strokeStyle = E.rgba(P.core1, .8 * a); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(p[0], p[1], rr, rr * .55, 0, 0, 6.29); ctx.stroke(); ctx.strokeStyle = E.rgba(P.halo0, .25 * a); ctx.lineWidth = 14; ctx.stroke(); ctx.restore(); }
    },
  });
  const TS_A = look(980, 0, 9000, .56, 900, 700), TS_B = look(1000, 0, 9000, .6, 900, 696);
  const W2 = cityWindow({
    t0: A.insisted - .2, tFull: A.test + 1.0, tBack: A.open + .7, t1: A.machine + .7,
    from: [LW.x + HOUSE[0], LW.y + 330], to: [LW.x + HOUSE[0], LW.y + 330],
    view: (t) => ({ cam: camKeys(t, [[A.insisted - .2, TS_A], [A.machine + .7, TS_B, 'l']], 9000, .35, 82),
      state: evening(19.05, { testers: { open: expoOut(span(t, A.open - .25, A.open + 1.4)) } }) }),
    life: (ctx, c, t) => {
      const T = K.STREET.testers, op = expoOut(span(t, A.open - .25, A.open + 1.4));
      // the road from the tower to the house on the ground; a capsule rides it to the door ('test it before you trust it')
      const a = K.wp(c, K.STREET.tower.x - 500, 0, K.STREET.tower.z - 3000), b = K.wp(c, T.x + T.w / 2 + 40, 0, T.z);
      if (a && b) {
        ctx.save(); ctx.strokeStyle = E.rgba(P.halo0, .35); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.strokeStyle = E.rgba(P.core1, .85); ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
        const k = sineIO(span(t, A.test - .2, A.test + 2.4)), x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k) - 9;
        if (k < 1) K.capsule(ctx, x, y, 26, t, { cool: .7 });
        const gap = expoOut(span(t, A.outside - .1, A.outside + .7));   // 'Outside the companies': the gap between house and tower glows
        if (gap > 0) E.halo(ctx, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 60, 160, .45 * gap);
      }
      // inside: on the testers' table the capsule and a machine disc under a slow gold check ring
      K.atZ(ctx, c, T.z, () => {
        if (op <= .05) return;
        K.capsule(ctx, T.x - 70, -174, 48, t, { cool: lerp(.7, .1, span(t, A.open + .6, A.open + 2)), a: op });
        ctx.save(); ctx.globalAlpha *= op; E.halo(ctx, T.x + 80, -180, 70, .5, K.COOL.mid, K.COOL.core); ctx.fillStyle = K.COOL.core; ctx.beginPath(); ctx.ellipse(T.x + 80, -178, 26, 26, 0, 0, 6.29); ctx.fill();
        const sw = (t * .55) % 1; ctx.strokeStyle = E.rgba(P.core1, .9 * Math.sin(Math.PI * sw)); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(T.x + 80, -178, 30 + 60 * sw, 10 + 20 * sw, 0, 0, 6.29); ctx.stroke(); ctx.restore();
      });
      // in the open: a few people stand outside and watch
      [[T.x - 330, 140, 111], [T.x - 230, 104, 112], [T.x + 300, 146, 113], [T.x + 400, 132, 114]].forEach(([x, h, seed], i) => walker(ctx, c, t, { x0: x, v: 0, z: T.z - 380, h, seed, kid: h < 110, dir: x < T.x ? 1 : -1, look: .5 }));
    },
  });
  return [W1, W2];
}
