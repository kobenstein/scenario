// c02 · "How they learn" (01a from "China has announced" to "textbook") · 74.94–125.12 · Editorial-Nacht (B1, 2026-10-24)
// Kit: lib/f10_editorial.mjs + lib/f10_c01_draw.mjs + lib/f10_c01_world.mjs (the hall) + lib/f10_c02_room.mjs (map, graph, globe, room).
// Explainers (light on night) ≈ 70 % of the drawn time; the scenes (the room, the cup, the crown) are the anchors.
//
// | ID    | time          | anchor                  | picture (one idea)                                                              | camera                         | → carrier                                   |
// |-------|---------------|-------------------------|---------------------------------------------------------------------------------|--------------------------------|---------------------------------------------|
// | 2.01E | 74.94–79.18   | forty @76.38            | the pull back from c01 goes on: the hall becomes one lit window on a dark map;  | pull back (continues c01) →    | our window → push back in to you            |
// |       |               | that one @78.38         | 42 more halls ignite (cascade); >40 · STATE-BACKED TRAINING HALLS · ANNOUNCED   | hold → dive back in            |                                             |
// | 2.02E | 79.18–82.46   | joint @80.62            | angle arcs at your shoulder, elbow, wrist; the wrist arc becomes the graph       | close (1.7×), hold             | the robot's cool curve leaves to the right  |
// |       |               |                         | ANGLE over TIME: you (warm), the robot's copy (cool) on top                      |                                |                                             |
// | 2.03E | 82.46–84.06   | United @82.86           | the cool trace runs out of the hall, over the globe, to a house: USA             | truck right + pull back        | clip cut on "Neo" at the house window       |
// | 2.04  | 84.06–89.02   | Neo @84.06              | ORIGINAL FOOTAGE K4 · 1X NEO · USA · MAKER'S FILM, 2025                         | –                              | clip cut on "For now"                       |
// | 2.05  | 89.02–94.30   | hard @91.10 · far @92.38| your living room, the lamp is the hero; the robot takes the cup, it wobbles; far | slow push                      | push to the robot's head                    |
// |       |               |                         | away a person in a headset raises a hand: 100 ms later the robot's hand is calm  |                                |                                             |
// | 2.06E | 94.30–98.30   | cameras @95.66 · allow  | the robot's cameras light; a dashed line to the far person; on "allow" your      | hold on head + wall            | the line grows on to the right              |
// |       |               | @97.18                  | phone glows and the line turns solid                                             |                                |                                             |
// | 2.07E | 98.30–105.18  | data @102.14 · better   | the flow grows: PERSON → DATA → MODEL; the quote writes itself word by word;     | hold, then pull back (104.2)   | the flow retracts into the cameras          |
// |       |               | @104.06                 | source line                                                                       |                                |                                             |
// | 2.08E | 105.18–109.74 | living @107.02 · mind   | the room becomes the hall: its window turns into the hall window; angle arcs on  | wide, slow push                | the cup                                     |
// |       |               | @108.70                 | sofa, table, cup, door; on "mind" they sink                                      |                                |                                             |
// | 2.09  | 109.74–112.94 | yet @112.14             | close: the robot's hand lifts the cup 2 cm, it tips, it sets it back             | push to the cup (5.5×)         | –                                           |
// | 2.10★ | 112.94–116.70 | cup @115.90             | the tries repeat (0.8 s), each leaves a fine arc: a crown of light round the cup | hold, slow pull                | the crown                                   |
// | 2.11E | 116.70–122.02 | eyes @120.42 · hands    | the crown rises and becomes a disc of light (the machine); on "eyes" an eye of   | rise (2.2×)                    | the disc sinks into the notebook            |
// |       |               | @120.94                 | light, on "hands" two hands of light; the robot opens its hands                  |                                |                                             |
// | 2.12E | 122.02–125.12 | textbook @123.58        | in the notebook: YOUR MOVE → DATA → MODEL → ROBOT; the notebook closes, a line   | dive into the page (13.5×)     | the gap of light → c03 (window gap)         |
// |       |               |                         | of light is left (the gap) → c03                                                 |                                |                                             |
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as D from '../lib/f10_c01_draw.mjs';
import * as V from '../lib/f10_c01_world.mjs';
import * as Rm from '../lib/f10_c02_room.mjs';
import { footage, clipSlot } from '../lib/f10_core.mjs';
const { W, H, P, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, card, cam3, aim, camAt, camDrift, cardM, F0 } = E;

export const PRINT = { editorial: true };
const CL = { editorial: true, grain: 12, floor: 3, vig: .28 };
const ECHO_T0 = 72.94;   // c01's "Thousands" (the echo crown started there; its camera keeps moving into c02)

export default async (T, R) => {
  E.prepareEditorial();
  const B = (w, n) => T.S('01a', w, n);
  const a = {
    china: B('China has'), forty: B('forty'), thatOne: B('that one'), every: B('Every angle'), joint: B('joint'), recorded: B('recorded'),
    andIn: B('And in the'), united: B('United'), neo: B('Neo'), forNow: B('For now'), hard: B('hard'), far: B('far away'), takes: B('takes over'),
    they: B('They look'), cameras: B('cameras'), only: B('Only if'), allow: B('allow'), its: B('Its maker'), simply: B('simply'), quote: B('If we dont'),
    data: B('data'), better: B('better'), so: B('So the next'), training: B('training hall'), living: B('living'), keep: B('Keep that'), mind: B('mind'),
    is: B('Is that'), yet: B('yet'), still: B('It still'), thousands: B('thousands'), cup: B('cup'), but: B('But artificial'), eyes: B('eyes'), hands: B('hands', 0),
    and2: B('And our'), textbook: B('textbook'), end: R.b,
  };
  // "hands" occurs once in 01a ("eyes and hands"); guard against an earlier match
  if (a.hands < a.eyes) a.hands = B('hands', 1);
  const k4 = footage('K4', a.neo, a.forNow);
  return [
    { t: R.a, draw: hallsTake(a), print: PRINT },
    { t: a.neo, draw: (ctx, t) => { clipSlot(ctx, t, k4, {}); D.tagFoot(ctx, t, { place: "1X NEO · USA · MAKER'S FILM, 2025", t0: a.neo }); }, clip: true, print: CL },
    { t: a.forNow, draw: roomTake(a), print: PRINT },
  ];
};

// ===================================================================================================== 2.01–2.03: halls · joints · globe
function hallsTake(a) {
  const u0 = a.china - ECHO_T0;                                    // the echo camera at the seam (no drift: drift is added below, same as c01)
  const A0 = cam3({ x: 20 - 4 * u0, y: -6 + 2 * u0, z: 20 - 60 * u0 - 35 * u0 * u0 });
  const v0 = 60 + 70 * u0;                                         // its speed in z (design px / s) at the seam
  const T1 = a.thatOne - .55, Da = F0 - A0.z, Db = F0 - Rm.FAR.z;
  const m0 = v0 / (Da * Math.log(Db / Da)) * (T1 - a.china);      // hermite start slope so the pull back does not jerk at the seam
  const Bc = aim(F0, 700, 640, 1.7, 760, 560);                      // 2.02: you and your arm, the dark wall above for the graph
  const Cc = aim(F0, Rm.GLOBE.usa[0], Rm.GLOBE.usa[1] - 120, .62, 1100, 560);                    // 2.03: the house on the globe (USA)
  const tDive = a.thatOne + .1, tB = a.every + 1.3, tTruck = a.recorded - .1, tC = a.neo - .1;
  const dj = D.duJ(V.HALL.du.x, V.HALL.du.y, V.HALL.du.h, { armR: [1.35, 2.55], armL: [-.1, -.04] });
  // the graph rectangle (design px on F0), placed on the dark wall above you in camera B
  const mB = cardM(Bc, F0), gx = (220 - mB.e) / mB.k, gy = (150 - mB.f) / mB.k, gw = 980 / mB.k, gh = 330 / mB.k;
  const cool = (t) => {                                            // the robot's copy leaves the graph as a cool trace → globe → USA
    const s = E.catmull([[gx + gw * .98, gy + gh * (1 - .5), 3], [gx + gw + 260, gy - 40, 3], [1500, 170, 3], [2200, 60, 3.4], [3000, 140, 3.6], [Rm.GLOBE.usa[0] - 60, Rm.GLOBE.usa[1] - 210, 3.6], [Rm.GLOBE.usa[0], Rm.GLOBE.usa[1] - 90, 3.6]], 14);
    return s;
  };
  return (ctx, t) => {
    let c;
    if (t < T1) c = Rm.camLerp(A0, Rm.FAR, Rm.herm(span(t, a.china, T1), m0, 0));
    else if (t < tDive) c = Rm.camLerp(Rm.FAR, cam3({ ...Rm.FAR, z: Rm.FAR.z + 600 }), sineIO(span(t, T1, tDive)));
    else if (t < tB) c = Rm.camLerp(cam3({ ...Rm.FAR, z: Rm.FAR.z + 600 }), Bc, sineIO(span(t, tDive, tB)));
    else if (t < tTruck) c = Rm.camLerp(Bc, aim(F0, 704, 638, 1.76, 760, 560), sineIO(span(t, tB, tTruck)));
    else c = Rm.camLerp(aim(F0, 704, 638, 1.76, 760, 560), Cc, sineIO(span(t, tTruck, tC)));
    c = camDrift(c, t, .5);
    // the hall (as at the end of c01: you hold the cup up, the robot holds the copy, the echo crown keeps growing)
    const u = t - ECHO_T0;
    const hands = V.hall(ctx, t, c, { lift: 1, rob: 1 - .06 * Math.sin(u * 2.2), look: .3, arc: 1, echo: V.echoCount(t, ECHO_T0), echoBorn: V.echoBorn(ECHO_T0), echoA: 1 - smooth(span(t, a.every - .4, a.every + .6)), right: 2380 });
    // 2.01: the map of the halls around ours (only while the camera is outside: the card is behind it in 2.02)
    if (t < tB) Rm.hallMap(ctx, t, c, { ign: a.forty - .15, mark: smooth(span(t, a.thatOne - .25, a.thatOne + .35)) * (1 - smooth(span(t, a.every - .3, a.every + .2))) });
    D.numBlock(ctx, t, { x: 150, y: 250, num: '>40', label: ['STATE-BACKED', 'TRAINING HALLS'], src: 'ANNOUNCED · INTERACT ANALYSIS', t0: a.forty - .3, t1: a.thatOne + .35, size: 150 });
    // 2.02–2.03 on the focus card: the joint arcs, the graph, the globe (right of the hall)
    card(ctx, c, F0, (k) => {
      const ja = 1 - smooth(span(t, tTruck + .3, tTruck + 1.2));
      if (ja > 0) {
        Rm.jointArcs(ctx, t, dj, [span(t, a.every - .05, a.every + .45), span(t, a.every + .25, a.every + .75), span(t, a.every + .5, a.every + 1.0)], { a: ja, noWrist: t > a.joint + .05 });
        // on "joint" the wrist arc lifts off and becomes the start of the warm curve
        const fly = sineIO(span(t, a.joint - .05, a.joint + .5));
        if (fly > 0 && fly < 1) { const p = [lerp(dj.R[0], gx, fly), lerp(dj.R[1], gy + gh * (1 - Rm.ANGLE[0][1]), fly) - 60 * Math.sin(Math.PI * fly)]; halo(ctx, p[0], p[1], 40, .9); }
        Rm.angleGraph(ctx, t, { rect: [gx, gy, gw, gh], axis: span(t, a.every + .1, a.every + .9), uW: sineIO(span(t, a.joint + .4, a.recorded + .2)), uC: sineIO(span(t, a.joint + .75, a.recorded + .5)), a: ja, t0: a.every + .3, tW: a.joint + 1.0, tC: a.recorded + .2, lab: 34 / k });
      }
      if (t > tB) Rm.globe(ctx, t, { usa: span(t, a.united - .5, a.united + .3), tLab: a.andIn });
      const cu = sineIO(span(t, a.recorded + .35, a.united + .55));
      if (cu > 0) Rm.coolTrail(ctx, cool(t), cu, { w: 3.2 });
    });
    // the hall's place tag stays (bottom left), it leaves with the truck
    V.placeTag(ctx, t, { s: 'China', t0: a.every - .2, out: tTruck + .2 });
  };
}

// ===================================================================================================== 2.05–2.12: the living room
function roomTake(a) {
  const Rr = Rm.ROOM;
  const Wd = cam3({ x: 30, y: -14, z: -90 }), W1 = cam3({ x: 10, y: -24, z: 80 });
  const Ec = aim(F0, 1130, 470, 1.42, 860, 540), Ec2 = aim(F0, 1134, 468, 1.48, 860, 540);
  const Wb = cam3({ x: 20, y: -10, z: -40 }), Wb2 = cam3({ x: 30, y: -14, z: 40 });
  const Cc = aim(F0, Rr.cup[0] + 6, Rr.cup[1] - 30, 5.2, 960, 640), Cc2 = aim(F0, Rr.cup[0] + 6, Rr.cup[1] - 34, 4.6, 960, 620);
  const Rc = aim(F0, 900, 600, 2.1, 960, 560);
  const Nc = aim(F0, Rr.book.x, Rr.book.y, 13.5, 960, 540), Nc2 = aim(F0, Rr.book.x, Rr.book.y, 14.2, 960, 540);
  const K = [
    [a.forNow, Wd], [a.they - .4, W1], [a.cameras - .2, Ec, 'q'], [a.better + .1, Ec2],
    [a.so + .3, Wb, 'q'], [a.mind + .4, Wb2], [a.is + .9, Cc, 'q'], [a.thousands, Cc], [a.but, Cc2],
    [a.but + 2.0, Rc, 'q'], [a.and2 + .2, cam3({ ...Rc, z: Rc.z + 30 })], [a.textbook - .1, Nc, 'q'], [a.end, Nc2],
  ];
  // flow + quote on the wall card (Z 2600), placed in screen terms of camera E
  const mE = cardM(Ec, 2600), toW = (sx, sy) => [(sx - mE.e) / mE.k, (sy - mE.f) / mE.k], kW = mE.k;
  const nData = toW(1180, 250), nModel = toW(1560, 250);
  const qx = toW(1270, 0)[0], qy1 = toW(0, 440)[1], qy2 = toW(0, 516)[1];
  const QW = [['“If', 0], ['we', .24], ["don't", .40], ['have', .64], ['your', .80], ['data,', .96], ['we', 1.68], ["can't", 1.84], ['make', 2.16], ['the', 2.32], ['product', 2.40], ['better.”', 2.88]];
  const robIK = (tg) => { const J0 = D.robotJ(Rr.rob.x, Rr.rob.y, Rr.rob.h, {}); return D.armIK(J0.shR, tg, .165 * Rr.rob.h, .21 * Rr.rob.h); };
  return (ctx, t) => {
    const c0 = camAt(t, K, F0), c = camDrift(c0, t, .6);
    // ------- state from the voice
    const wob = smooth(span(t, a.hard - .5, a.hard)) * (1 - smooth(span(t, a.far + .1, a.far + .4)));   // calm 100 ms after the far hand
    const farHand = expoOut(span(t, a.far - .05, a.far + .5));
    const lift = sineIO(span(t, a.is + 1.0, a.is + 1.6)) * (1 - sineIO(span(t, a.yet + .2, a.yet + .7)));
    const tip = Math.sin(Math.PI * span(t, a.is + 1.6, a.yet + .4)) * .32;
    const tries = t > a.still - .1 ? (t - (a.still - .1)) / .8 : -1;     // 2.10: one try every 0.8 s
    const tryPh = tries > 0 ? tries % 1 : 0, tryOn = tries > 0 && t < a.but + .3;
    let cupP = { x: Rr.cup[0], y: Rr.cup[1] - 8 * lift + (tryOn ? -8 * Math.sin(Math.PI * tryPh) : 0), tilt: tip + .12 * Math.sin(t * 9) * wob + (tryOn ? .25 * Math.sin(Math.PI * tryPh) * Math.sin(tryPh * 6.28) : 0) };
    const reach = smooth(span(t, a.forNow + .3, a.hard - .4));
    const grip = [cupP.x - 16, cupP.y - 14];
    const open = expoOut(span(t, a.hands - .05, a.hands + .5));
    let armR = robIK(grip); armR = [lerp(.12, armR[0], reach) + .05 * Math.sin(t * 11) * wob, lerp(.06, armR[1], reach) + .07 * Math.sin(t * 13) * wob];
    if (open > 0) armR = [lerp(armR[0], 1.9, open), lerp(armR[1], 2.3, open)];
    const armL = [lerp(-.1, -1.9, open), lerp(-.05, -2.3, open)];
    if (open > 0) cupP = { ...cupP };
    const flowOut = sineIO(span(t, a.better, a.better + .8));
    const st = {
      farHand, lens: smooth(span(t, a.cameras - .2, a.cameras + .3)) * (1 - smooth(span(t, a.so + .4, a.so + 1.2))), phone: Math.sin(Math.PI * span(t, a.allow - .15, a.allow + 1.4)),
      winWarm: smooth(span(t, a.training - .2, a.training + .7)) * (1 - smooth(span(t, a.keep + .1, a.mind + .8))),
      lampA: 1 - .45 * smooth(span(t, a.thousands - .3, a.cup)) * (1 - smooth(span(t, a.but + .5, a.but + 2))),
      robArm: { armR, armL }, cup: cupP, book: 0, rimSoft: .55 * smooth(span(t, a.is + .2, a.is + .9)) * (1 - smooth(span(t, a.but + .4, a.but + 1.6))),
    };
    // the flow and the quote on the wall
    st.wall = (cx) => {
      const g = sineIO(span(t, a.its, a.simply + .3)) * (1 - flowOut);
      const pts = [[...nData, 3], [lerp(nData[0], nModel[0], .5), nData[1] - 30, 3], [...nModel, 3]];
      if (g > 0) {
        const kd = expoOut(span(t, a.its + .1, a.its + .7)) * (1 - flowOut), km = expoOut(span(t, a.simply - .3, a.simply + .4)) * (1 - flowOut);
        if (kd > 0) dataNode(cx, t, nData[0], nData[1], 46 / kW * kd);
        if (km > 0) modelNode(cx, t, nModel[0], nModel[1], 56 / kW * km);
        E.trail(cx, E.catmull(pts, 12), smooth(span(g, .35, 1)), { w: 3 / kW });
        D.wipeText(cx, 'DATA', nData[0], nData[1] + 96 / kW, span(t, a.its + .3, a.its + 1.0), { size: 34 / kW, spacing: .16, align: 'center', glow: false, col: P.halo2, out: flowOut });
        D.wipeText(cx, 'MODEL', nModel[0], nModel[1] + 96 / kW, span(t, a.simply - .1, a.simply + .6), { size: 34 / kW, spacing: .16, align: 'center', glow: false, col: P.halo2, out: flowOut });
      }
      // the quote, word by word with the voice (cream serif), then the source; it sinks on "living"
      const out = span(t, a.living - .2, a.living + .4);
      const sz = 60 / kW;
      const line = (ws, y) => { cx.save(); cx.font = `${sz}px "Instrument Serif"`; const sp = cx.measureText(' ').width, wid = ws.map(([w]) => cx.measureText(w).width); cx.restore(); const _ = 0, tot = wid.reduce((s, v) => s + v, 0) + sp * (ws.length - 1); let x = qx - tot / 2; ws.forEach(([w, o], i) => { D.wipeText(cx, w, x, y, span(t, a.quote + o - .06, a.quote + o + .35), { serif: true, size: sz, col: P.cream, out }); x += wid[i] + sp; }); };
      line(QW.slice(0, 6), qy1); line(QW.slice(6), qy2);
      D.wipeText(cx, 'BERNT BØRNICH, CEO OF 1X (MAKER OF NEO)', qx, qy2 + 64 / kW, span(t, a.quote + .4, a.quote + 1.1), { size: 24 / kW, spacing: .16, align: 'center', glow: false, col: rgba(P.halo2, .85), out });
      D.wipeText(cx, 'WALL STREET JOURNAL, 2025', qx, qy2 + 100 / kW, span(t, a.quote + .55, a.quote + 1.25), { size: 24 / kW, spacing: .16, align: 'center', glow: false, col: rgba(P.halo2, .85), out });
    };
    let O = null;
    st.f0 = (cx, out) => { O = out; f0Overlay(cx, t, a, out, { tries, cupP, open }); };
    const out = Rm.room(ctx, t, c, st);
    // ------- screen-space links: the far person ↔ the robot (2.05–2.07)
    const farS = E.project(c, 9000, out.farHand[0], out.farHand[1]);
    const handS = E.project(c, F0, out.rob.R[0], out.rob.R[1]);
    const lensS = out.lens ? E.project(c, F0, out.lens[0], out.lens[1]) : null;
    const takeU = sineIO(span(t, a.far + .1, a.takes + .5)) * (1 - smooth(span(t, a.they, a.they + .6)));
    if (takeU > 0 && farS && handS) Rm.coolTrail(ctx, E.catmull([[farS[0], farS[1], 2], [lerp(farS[0], handS[0], .5), Math.min(farS[1], handS[1]) - 60, 2], [handS[0], handS[1], 2]], 14), takeU, { w: 2, dash: [3, 9] });
    const lookU = sineIO(span(t, a.cameras - .1, a.cameras + .7)) * (1 - flowOut);
    if (lookU > 0 && farS && lensS) {
      const allowed = smooth(span(t, a.allow - .02, a.allow + .25));
      const pts = E.catmull([[lensS[0], lensS[1], 2.4], [lerp(lensS[0], farS[0], .5), Math.min(lensS[1], farS[1]) - 70, 2.4], [farS[0], farS[1], 2.4]], 14);
      if (allowed < 1) Rm.coolTrail(ctx, pts, lookU, { w: 2.2, dash: [3, 10], a: 1 - allowed });
      if (allowed > 0) E.trail(ctx, pts, lookU * allowed, { w: 2.6, spark: false });
      // from the far person on into the flow on the wall (2.07)
      const g = sineIO(span(t, a.its - .2, a.its + .4));
      const nd = E.project(c, 2600, nData[0], nData[1]);
      if (g > 0 && nd) E.trail(ctx, E.catmull([[farS[0], farS[1], 2.6], [lerp(farS[0], nd[0], .5), Math.min(farS[1], nd[1]) - 90, 2.6], [nd[0], nd[1], 2.6]], 14), g, { w: 2.6 });
    }
    // 2.12: the notebook closes; the last frame is dark with a vertical gap of light (→ c03: the gap between the curtains)
    const shut = span(t, a.textbook + .9, a.end - .03);
    if (shut > 0) gapFrame(ctx, t, shut);
  };
}
// the overlays on the focus card that move with the room: angle arcs on the furniture (2.08), the crown (2.10),
// the disc with eye and hands (2.11), the flow on the notebook page (2.12)
function f0Overlay(ctx, t, a, out, s) {
  const Rr = Rm.ROOM;
  // 2.08 the arcs of a recorded room: sofa corner, table corner, the cup, the door frame
  const arcU = expoOut(span(t, a.living - .1, a.living + .5)), sink = smooth(span(t, a.keep, a.mind + .5));
  if (arcU > 0 && sink < 1) {
    const marks = [[Rr.sofa.x0 + 40, Rr.sofa.y + 30, 56, Math.PI, 1.5 * Math.PI], [Rr.table.x1 - 2, Rr.table.y + 6, 44, 1.5 * Math.PI, 2 * Math.PI], [Rr.cup[0], Rr.cup[1] - 30, 40, Math.PI * 1.1, Math.PI * 1.9], [Rr.door.x + Rr.door.w - 30, Rr.door.y + 30, 60, Math.PI, 1.5 * Math.PI], [out.robJ.elR[0], out.robJ.elR[1], 40, -.6, 1.4], [out.robJ.shR[0], out.robJ.shR[1], 46, .2, 1.9]];
    marks.forEach(([x, y, r, a0, a1], i) => {
      const k = span(arcU, i * .12, i * .12 + .5); if (k <= 0) return;
      const p = new Path2D(); p.arc(x, y + 30 * sink, r, a0, lerp(a0, a1, expoOut(k)));
      E.lightShape(ctx, p.stroke({ width: 5, cap: 1 }), t, { lit: 1, dust: 0, glow: .6, a: 1 - sink });
      const d = new Path2D(); d.arc(x, y + 30 * sink, 6, 0, 6.29); E.lightShape(ctx, d, t, { lit: 1, dust: 0, a: (1 - sink) * expoOut(k) });
    });
  }
  // 2.10 the crown: every try leaves a fine arc round the cup; the tries pile up (long exposure)
  const cx0 = Rr.cup[0], cy0 = Rr.cup[1] - 16, rise = sineIO(span(t, a.but + .3, a.eyes - .4));
  if (s.tries > 0) {
    const n = Math.floor(s.tries) + 1, extra = Math.min(70, Math.floor(3 * (Math.pow(2, 1.25 * Math.max(0, s.tries - 1)) - 1)));
    const disc = smooth(span(t, a.but + .6, a.but + 1.8));
    const ccx = cx0, ccy = lerp(cy0, 600, rise);
    for (let i = 0; i < n + extra; i++) {
      const hsh = ((i * 7919) % 101) / 101, hs2 = ((i * 3571) % 89) / 89, r = (40 + 16 * hsh) * (1 - .45 * disc), a0 = Math.PI * (.55 + .5 * hs2), sweep = Math.PI * (1.1 + .5 * hsh), tl = (hs2 - .5) * .25;
      const own = i < n, g = own ? clamp((s.tries - i) / .8) : clamp((t - (a.still + .6 + Math.log2(i / 3 + 1) / 1.25 * .8)) / .5);
      if (g <= 0) continue;
      const p = []; for (let j = 0; j <= 24; j++) { const q = a0 + sweep * j / 24, ex = Math.cos(q) * r, ey = Math.sin(q) * r * .34; p.push([ccx + ex * Math.cos(tl) - ey * Math.sin(tl), ccy - 6 + ex * Math.sin(tl) + ey * Math.cos(tl), own ? 1.5 : .8]); }
      E.trail(ctx, p, expoOut(g), { a: (own ? .85 : .32) * (1 - .6 * disc), spark: false });
    }
    // 2.11 the crown becomes a disc of light (the machine) above the table; eyes and hands of light join it
    if (disc > 0) {
      const sink2 = sineIO(span(t, a.and2 - .1, a.textbook - .4)), dx = lerp(ccx, Rr.book.x + 230 / 13.5, sink2), dy = lerp(ccy, Rr.book.y - 40 / 13.5, sink2), dr = lerp(26, 1.6, sink2) * disc * (1 - smooth(span(t, a.textbook - .5, a.textbook - .3)));
      if (dr > .3) { const dp = new Path2D(); dp.arc(dx, dy, dr, 0, 6.29); E.lightShape(ctx, dp, t, { lit: 1, dust: sink2 > .5 ? 0 : 600, seed: 9 }); }
      const ke = expoOut(span(t, a.eyes - .05, a.eyes + .5)) * (1 - sink2), kh = expoOut(span(t, a.hands - .05, a.hands + .5)) * (1 - sink2);
      if (ke > 0) { D.glyph(ctx, 'eye', dx - 96, dy - 4, 64 * ke, { w: 3.4, glow: true }); D.wipeText(ctx, 'EYES', dx - 96, dy + 50, span(t, a.eyes, a.eyes + .6), { size: 34 / 2.1, spacing: .16, align: 'center', glow: false, col: P.halo2, out: sink2 }); }
      if (kh > 0) { E.icon(ctx, 'hand', dx + 96, dy - 8, 72 * kh, t, { lit: 1, dust: 0, glow: .5 }); D.wipeText(ctx, 'HANDS', dx + 96, dy + 50, span(t, a.hands, a.hands + .6), { size: 34 / 2.1, spacing: .16, align: 'center', glow: false, col: P.halo2, out: sink2 }); }
    }
  }
  // 2.12 the flow on the notebook page (drawn at 1/13.5 so the kit sizes are screen sizes in the dive)
  const fu = span(t, a.and2 + .7, a.textbook + .6);
  if (fu > 0) {
    const B = Rr.book, sc = 1 / 13.5;
    ctx.save(); ctx.translate(B.x, B.y); ctx.scale(sc, sc);
    const nodes = [{ x: -690, y: -40, icon: 'hand', label: 'YOUR MOVE' }, { x: -230, y: -40, icon: 'coin', label: 'DATA', lit: 0 }, { x: 230, y: -40, icon: 'battery', label: 'MODEL', lit: 0 }, { x: 690, y: -40, icon: 'robot', label: 'ROBOT', lit: 0 }];
    flow4(ctx, t, nodes, fu, a.and2 + .7);
    ctx.restore();
  }
}
// the four-node flow on the page: custom marks (hand · data dots · model disc · robot), arrows of light, staggered 80 ms
function flow4(ctx, t, nodes, u, t0) {
  nodes.forEach((nd, i) => {
    const k = expoOut(span(t, t0 + i * .08, t0 + i * .08 + .5)), lt = smooth(span(u, i * .22, i * .22 + .2));
    if (k <= 0) return;
    if (i === 1) dataNode(ctx, t, nd.x, nd.y, 70 * k);
    else if (i === 2) modelNode(ctx, t, nd.x, nd.y, 64 * k);
    else E.icon(ctx, nd.icon, nd.x, nd.y, 150 * k, t, { lit: 1, dust: 0, seed: 70 + i });
    D.wipeText(ctx, nd.label, nd.x, nd.y + 150, span(t, t0 + .2 + i * .08, t0 + .8 + i * .08), { size: 40, spacing: .16, align: 'center', col: P.cream });
    if (i < nodes.length - 1) {
      const b = nodes[i + 1], ka = smooth(span(u, i * .22 + .1, i * .22 + .32));
      E.trail(ctx, E.catmull([[nd.x + 110, nd.y, 3.4], [(nd.x + b.x) / 2, nd.y - 34, 3.4], [b.x - 110, b.y, 3.4]], 12), ka, { w: 3.4 });
      if (ka >= 1) { const ch = new Path2D(); ch.moveTo(b.x - 128, b.y - 14); ch.lineTo(b.x - 110, b.y); ch.lineTo(b.x - 128, b.y + 14); E.lightShape(ctx, ch.stroke({ width: 5, cap: 1, join: 1 }), t, { dust: 0 }); }
    }
    void lt;
  });
}
// DATA: a small grid of light squares · MODEL: a disc of light with rings (the machine is a circle)
function dataNode(ctx, t, x, y, s) {
  if (s <= .5) return; const p = new Path2D(), q = s / 3.2;
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) p.rect(x + i * q * 1.2 - q * .4, y + j * q * 1.2 - q * .4, q * .8, q * .8);
  E.lightShape(ctx, p, t, { lit: 1, dust: 0, glow: .6, seed: 33 });
}
function modelNode(ctx, t, x, y, s) {
  if (s <= .5) return; const d = new Path2D(); d.arc(x, y, s * .45, 0, 6.29); const r = new Path2D(); r.arc(x, y, s * .8, 0, 6.29);
  E.lightShape(ctx, d.op(r.stroke({ width: s * .09 }), PathOp.Union), t, { lit: 1, dust: 0, glow: .6, seed: 34 });
}
// the closed notebook seen from very close: dark covers, a vertical gap of light in the middle (u 0..1 → 1 at the seam)
function gapFrame(ctx, t, u) {
  const e = sineIO(u); if (e <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const gw = lerp(W / 2, 3, e);   // half the width still open
  const cov = (x0, x1, flip) => { ctx.fillStyle = lin(ctx, x0, 0, x1, 0, flip ? [[0, mixHex(P.ind2, P.blue1, .25)], [1, P.night0]] : [[0, P.night0], [1, mixHex(P.ind2, P.blue1, .25)]]); ctx.fillRect(x0, 0, x1 - x0, H); };
  cov(0, W / 2 - gw, false); cov(W / 2 + gw, W, true);
  ctx.restore();
  gapLine(ctx, t, smooth(span(e, .6, 1)));
}
export function gapLine(ctx, t, k = 1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  halo(ctx, W / 2, H / 2, 520, .35 * k, P.halo1, P.halo0);
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, W / 2 - 40, 0, W / 2 + 40, 0, [[0, rgba(P.halo0, 0)], [.5, rgba(P.halo0, .55 * k)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(W / 2 - 40, 0, 80, H);
  ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, rgba(P.core1, .6 * k)], [.5, rgba(P.core0, k)], [1, rgba(P.core1, .6 * k)]]); ctx.fillRect(W / 2 - 3, 0, 6, H);
  ctx.restore();
}
