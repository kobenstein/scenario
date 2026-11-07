// c07 · B2 · 305.88 – 360.88 · 19:00 dinner: black holes with a pea · the homework question · it almost went another way · K1 Schneier.
// ONE plan sequence in the kitchen (docs/shots.md 7.01–7.07), continuing the descent of c06 (lib/f23_b2.mjs homeWorld/homeKeys):
//   7.01 the camera lands at the table under the lamp: the kid kneeling on her stool, you opposite; 'pea' she holds up a gold dot,
//        'spoon' a dark hollow; 'waving' her arms sweep arcs and the pea flies up onto the light wall (carrier).
//   7.02 the pea draws its own orbit: the black hole from 3.03, now complete; 'never told her a thing' the ladder of '?' under it.
//   7.03 'Then she pulls' the diagram sinks; one '?' drops into the notebook she pulls out; 'One question' its line glows; the tutor's
//        pilot light beside her stays dim ('wouldn't answer it'); 'ask you' she pushes the notebook across to you.
//   7.04 close on the page: 'Why did it go well?'; 'looks up' she lifts her head; 'never known anything else' ease back: the lit city.
//   7.05 ★ back into the wall: the day as one gold road through its stations, the cool road forks off ('another way'), the disc over
//        both ('plenty smart'), threads to many people / to one tower ('who they'd work for').
//   7.06 'Look' your hand lifts; 'old recording' a gold line runs from your hand up the wall and opens the old screen; push in.
//   7.07 K1 on the old screen (HUD oldScreen, CAM_SCREEN still); it collapses to a line, a point, the point drops onto the cool road.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f23_kit.mjs';
import { notebookItem, NOTEBOOK_WORLD, NOTEBOOK_PLATE } from '../lib/f23_seams.mjs';
import { oldScreen } from '../lib/f23_hud.mjs';
import * as B from '../lib/f23_b2.mjs';
import { dinnerPeople, dinnerHands, armAt, valAt, toWall, KID_REST, YOU_REST, KID_AT } from '../lib/f23_b2_dinner.mjs';
import { wallAnchors, wallArt, QSTEPS, point } from '../lib/f23_b2_wall.mjs';
const { W, H, P, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, rgba, mixHex, halo, camAt, camDrift } = E;
const { ZS, ZB, LIGHTWALL: LW, SCREEN, KITCHEN, look } = K;
const KY = KITCHEN.floor, TB = KITCHEN.table, NW = NOTEBOOK_WORLD, ZREF = ZB - 150;

export default (T, R) => {
  const H0 = B.homeAnchors(T), A = wallAnchors(T), cam = c07Cam(H0, A);
  const tLine = A.rec + .25;
  const draw = (ctx, t) => {
    const c = cam(t);
    // on the way down too: the same world as c06's last seconds (+ the pilot light, far too small to see at the seam)
    const po = { kid: kidPose(t, A), you: youPose(t, A) }, hands = dinnerHands(t, c, po);
    const wallFn = (cx) => {
      wallArt(cx, t, A);
      if (t > tLine - .1) oldScreen(cx, t, { x: SCREEN.x, y: SCREEN.y, w: SCREEN.w, clip: A.clip, line: toWall(c, hands.you.R), tLine });
    };
    B.homeWorld(ctx, c, t, H0, { kitchen: { people: [...dinnerPeople(t, c, po), ...tableItems(t, c, A, hands)], wallFn } });
    overlay(ctx, c, t, hands);
  };
  // screen-space carriers: the pea's flight onto the wall (7.01 → 7.02), the '?' that drops into the notebook (7.02 → 7.03)
  const overlay = (ctx, c, t, hands) => {
    const tFly0 = A.waving + .38, tFly1 = A.every - .55;
    if (t >= tFly0 && t < tFly1 && hands.kidW.R) {
      const h = hands.kidW.R, a = K.wp(c, h[0], h[1] - 3, h[2]), b = K.wp(c, LW.x + ORB0[0], LW.y + ORB0[1], ZB), u = span(t, tFly0, tFly1), k = sineIO(u);
      if (a && b) { const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k) - Math.sin(Math.PI * k) * 120, r = lerp(3.2 * a[2], 6 * b[2], k); halo(ctx, x, y, r * 4, .8); point(ctx, x, y, r, 1); }
    }
    const q0 = A.then - .1, q1 = A.then + 1.25;
    if (t >= q0 && t < q1) {
      const [u, v] = QSTEPS[3], a = K.wp(c, LW.x + u, LW.y + v - 14, ZB), nb = nbPos(t, A), b = K.wp(c, nb[0] + 4, nb[1] - 2, NOTEBOOK_WORLD.Z), k = expoIn(span(t, q0 + .15, q1));
      if (a && b) { const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k), sz = lerp(34 * a[2], 6 * b[2], k); E.glowText(ctx, '?', x, y + sz * .35, { size: sz, serif: true, align: 'center', col: P.core1 }); }
    }
  };
  return [{ t: R.a, draw }];
};
// the orbit's first point (wall units), where the flying pea lands and starts drawing
const ORB0 = [210 + Math.cos(Math.PI * .85) * 150, 160 + Math.sin(Math.PI * .85) * 58];
function nbPos(t, A) { const N = NOTEBOOK_WORLD; return [lerp(N.X - 115, N.X, sineIO(span(t, A.ask - .05, A.ask + .8))), N.Y]; }

// ---------------------------------------------------------------- the camera: c06's descent, then the kitchen (keys on words)
const scaleAt = (c) => c.f / Math.max(1, ZB - 170 - c.z);
function c07Cam(H0, A) {
  const tK = B.homeKeys(H0)[1][0], cl = A.clip;
  const TELE = 3.4 * 1700, NB = look(NW.X, NW.Y, NW.Z, 22, 960, 560, TELE);   // a long lens: the camera stays in front of the table
  const KEYS = [
    [tK, B.DINNER],
    [A.waving + .2, look(-1330, KY - 120, ZB - 170, 3.05, 960, 590)],          // 7.01 a slow push while she explains
    [A.every + .7, look(LW.cx, LW.y, ZB, 1.86, 960, 80), 's'],                 // tilt up with the pea onto the wall (7.02)
    [A.then - .15, look(LW.cx, LW.y, ZB, 1.93, 960, 76)],
    [A.then + 1.7, look(-1330, KY - 88, ZB - 170, 3.3, 960, 610), 's'],        // down with the '?' to the table and the notebook (7.03)
    [A.ask + .35, look(-1322, KY - 88, ZB - 170, 3.42, 960, 610)],
    [A.why + .3, NB, 's'],                                                     // 7.04 close on the page
    [A.looks - .8, look(NW.X + .5, NW.Y, NW.Z, 23, 960, 556, TELE)],
    [A.looks + .5, look(-1392, KY - 92, ZB - 165, 6.2, 960, 560, TELE), 's'],        // her face lifts: the two of them and the page
    [A.known - .45, look(-1388, KY - 92, ZB - 165, 6.45, 960, 560, TELE)],   // long lens: the pull-back never crosses the section plane
    [A.no + .35, look(-1300, -1350, ZS, .45, 960, 600, TELE), 's'],                   // ease back: the lit city round the kitchen
    [A.another + .5, look(LW.cx, LW.y, ZB, 1.95, 960, 64), 's'],             // 7.05 ★ into the wall: the fork
    [A.saw - .1, look(LW.cx, LW.y, ZB, 2.03, 960, 62)],
    [A.rec + .85, look(LW.cx + 4, LW.y, ZB, 2.07, 960, 60)],
    [cl.start, K.CAM_SCREEN, 's'],                                             // 7.06 push onto the old screen; 7.07 still
  ];
  return (t) => {
    if (t < tK) return camDrift(B.homeCam(t, H0), t, .45, 23);
    const c = camAt(t, KEYS, ZREF);
    return camDrift(c, t, .45 * Math.min(1, 2.7 / scaleAt(c)) * (1 - sineIO(span(t, cl.start - 1.2, cl.start))), 23);
  };
}
// ---------------------------------------------------------------- the two at the table (pose keys on words; rest at both ends)
function kidPose(t, A) {
  const R0 = KID_REST.armR, L0 = KID_REST.armL, cs = A.clip.start, w = A.waving, th = A.then;
  return {
    armR: armAt(t, [[A.pea - .45, R0], [A.pea + .2, [1.7, 2.75]], [w - .05, [1.85, 2.8]], [w + .2, [2.5, 3.05]], [w + .38, [2.85, 3.15]], [w + .75, [1.5, 2.2]],
      [A.every + .3, [.75, 1.65]], [th - .05, [.7, 1.6]], [th + .35, [.15, .45]], [th + 1.0, [.6, 1.45]], [th + 1.4, [.5, 1.45]], [A.ask - .1, [.5, 1.45]],
      [A.ask + .45, [1.15, 1.65]], [A.ask + 1.1, [.55, 1.5]], [A.always + .1, [.55, 1.5]], [A.always + .5, [1.0, 2.1]], [A.always + 1.3, [.5, 1.5]], [cs, R0]]),
    armL: armAt(t, [[A.spoon - .4, L0], [A.spoon + .2, [1.5, 2.5]], [w, [1.55, 2.55]], [w + .2, [1.0, 1.6]], [w + .45, [2.2, 2.85]], [w + .8, [1.2, 1.9]],
      [A.every + .3, [.4, 1.45]], [th - .05, [.35, 1.4]], [th + .35, [.1, .4]], [th + 1.0, [.45, 1.4]], [cs, L0]]),
    look: valAt(t, [[A.pea - 1.5, .15], [A.pea - .8, .55], [A.pea + .2, .4], [w + .3, .8], [A.every - .2, 1.0], [th - .05, 1.0], [th + .4, 0], [th + 1.1, .1],
      [A.wouldnt - .1, .1], [A.wouldnt + .3, 0], [A.ask - .1, .05], [A.ask + .4, .3], [A.ask + 1.2, .12], [A.looks - .15, .12], [A.looks + .45, .62],
      [A.known - .1, .62], [A.known + .8, .8], [A.no + .6, .95], [A.saw - .1, .95], [A.saw + .4, .5], [A.look + .1, .5], [A.look + .6, .95], [cs + 1, .15]]),
    lean: valAt(t, [[A.pea - .4, .12], [A.pea + .2, 0], [A.every + .3, .02], [th - .05, .05], [th + .4, .38], [th + 1.1, .15], [A.ask - .1, .15], [A.ask + .45, .32],
      [A.ask + 1.2, .15], [A.looks, .15], [A.looks + .4, .06], [cs + 1, .12]]),
    rise: valAt(t, [[A.pea - .45, 0], [A.pea + .25, .75], [A.every + .5, .6], [th - .05, .35], [th + .35, 0]]),
  };
}
function youPose(t, A) {
  const R0 = YOU_REST.armR, cs = A.clip.start;
  return {
    armR: armAt(t, [[A.look - .1, R0], [A.look + .55, [2.05, 2.5]], [cs - .3, [2.1, 2.55]], [cs + 1.0, R0]]),
    look: valAt(t, [[A.pea - 1.6, .1], [A.pea - .9, .25], [A.every - .5, .25], [A.every + .2, .75], [A.then - .05, .75], [A.then + .5, .12], [A.ask, .12], [A.ask + .5, 0],
      [A.looks + .1, 0], [A.looks + .6, .22], [A.known + .3, .22], [A.no + .4, .8], [A.saw - .1, .8], [A.saw + .4, .25], [A.look, .25], [A.look + .5, .85], [cs + .5, .85], [cs + 1.5, .1]]),
    lean: valAt(t, [[A.ask, .1], [A.ask + .6, .3], [A.looks + .1, .3], [A.looks + .7, .12], [A.look, .12], [A.look + .5, .04], [cs + 1.5, .1]]),
  };
}
// ---------------------------------------------------------------- things on the table: the pea, the spoon, the notebook, the tutor's pilot light
const PILOT = [-1436, TB.top - 4.4, ZB - 215];
function tableItems(t, c, A, hands) {
  const items = [], cs = A.clip.start, kz = KID_AT[1], hR = hands.kidW?.R, hL = hands.kidW?.L;
  if (t > cs + .6) return items;   // the camera is on the old screen: the table is off frame (nothing of this reaches c08 / plateWall)
  // the tutor's pilot light: a small dim voice-light beside her; 'wouldn't answer it': it flickers once and stays dim
  items.push([TB.z0 - .7, (cx) => K.atZ(cx, c, PILOT[2], () => {
    const a = .55 + .2 * K.bump(t, A.wouldnt - .1, .45) - .18 * span(t, A.wouldnt + .2, A.wouldnt + .9);
    K.voiceLight(cx, PILOT[0], PILOT[1], 3.2, t, { a });
  })]);
  // the pea (picked up on 'pea', flies on 'waving'), the spoon (a dark hollow, 'spoon' … put down)
  const tFly0 = A.waving + .38;
  if (hR && t > A.pea - .25 && t < tFly0) items.push([TB.z0 - 1.4, (cx) => K.atZ(cx, c, kz, () => point(cx, hR[0], hR[1] - 3, 3.2 * expoOut(span(t, A.pea - .25, A.pea + .05)), 1))]);
  const sp = expoOut(span(t, A.spoon - .25, A.spoon + .05)) * (1 - expoIn(span(t, A.every + .1, A.every + .45)));
  if (hL && sp > 0) items.push([TB.z0 - 1.4, (cx) => K.atZ(cx, c, kz, () => {
    cx.save(); cx.translate(hL[0], hL[1] - 2); cx.scale(sp, sp);
    cx.strokeStyle = mixHex(P.blue1, P.ind2, .3); cx.lineWidth = 1.4; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(0, 8); cx.stroke();
    cx.fillStyle = P.night0; cx.beginPath(); cx.ellipse(0, -3.5, 3.4, 4.2, 0, 0, 6.29); cx.fill(); cx.strokeStyle = rgba(P.halo0, .7); cx.lineWidth = .7; cx.stroke();
    cx.restore();
  })]);
  // the notebook: pulled up closed from her lap ('Then she pulls'), set on the table, opened; 'ask you' pushed across to you
  const th = A.then, tOpen = th + 1.0;
  if (hR && t > th + .3 && t < tOpen) items.push([TB.z0 - 1.4, (cx) => K.atZ(cx, c, kz, () => {
    const spot = [nbPos(t, A)[0] - 12, TB.top - 11], k = smooth(span(t, th + .6, tOpen)), x = lerp(hR[0] + 3, spot[0], k), y = lerp(hR[1] - 6, spot[1], k);
    const g = expoOut(span(t, th + .3, th + .5));
    cx.save(); cx.translate(x, y); cx.rotate(lerp(-.5, 0, k)); cx.scale(g, g);
    cx.fillStyle = mixHex(P.ind1, P.blue1, .35); cx.fillRect(-8, -11, 16, 22); cx.fillStyle = P.cream; cx.fillRect(7, -10, 1.6, 20); cx.fillStyle = rgba(P.halo0, .8); cx.fillRect(-8, -11, 16, 1.4);
    cx.restore();
  })]);
  if (t >= tOpen) {
    const [, fn] = notebookItem(t, { moon: false, line1: 1, line2: 0 }), op = expoOut(span(t, tOpen, tOpen + .45)), [x] = nbPos(t, A);
    const g = expoOut(span(t, A.oneQ - .1, A.oneQ + .4)) * (1 - sineIO(span(t, A.ask + .2, A.ask + 1.2)));
    const k = NW.w / NOTEBOOK_PLATE.w;
    items.push([TB.z0 - .6, (cx) => K.atZ(cx, c, NW.Z, () => {
      cx.save(); cx.translate(x - 12 * (1 - op), 0); cx.scale(lerp(.27, 1, op), 1); cx.translate(-NW.X, 0);
      fn(cx);
      if (g > 0) { cx.globalAlpha = g; K.handwrite(cx, NOTEBOOK_PLATE.line1, NW.X + 90 * k, NW.Y - 150 * k, 64 * k, 1, { col: P.halo0 }); cx.globalAlpha = 1; }
      cx.restore();
    })]);
  }
  return items;
}
