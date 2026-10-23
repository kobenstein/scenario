// Film 8 · c05 · YOUR compass: South and West (VO 03c, clip C4, 03d, 03e) · builder B2 · shots.md §8 c05.01–c05.13.
// Five places, each one world with one moving camera, joined by carriers: the sheet on your table (the line plate → its edge), the fire
// circle on the beach (in and out through the fire: light), the Harvard archive (out of its lamp: light; into a card's frame: the clip),
// the night harbour (the clip closes onto its lit breakwater), the coast and the dark ring (→ the ring on the sheet: shape), the moonlit sea,
// Taleb's beach and Sarasvathy's boat shed (the tack line on the sheet → the boat's tack legs: shape), and back onto the sheet.
//
// shot  | VO (accent)                                         | image                                                    | carrier / camera
// 05.01 | And whoever you become, don't do it ALONE.          | the line = the sheet's edge; crane up, the pen draws S;  | line plate → sheet edge; push
//       |                                                     | push into its fire: a fire circle, a newcomer, room made | light (fire) both ways
// 05.02 | Since NINETEEN THIRTY-EIGHT … SAME LIVES … CHILDREN'S | the archive table: profile cards 1938 → older → a child | out of the lamp (light); track
// 05.03 | So what did all those DECADES reveal?               | crane up: rows into the dark; the card under the far lamp | push into its frame
// 05.04 | clip C4                                             | Robert Waldinger, out of the card frame                   | frame carrier; closes to a line
// 05.05 | When the world SPEEDS UP, your people are your HARBOUR. | the line = the lit breakwater; swell outside, still    | crane over it, follow the boat
//       |                                                     | inside; a boat glides in, lanterns rise on the quay       |
// 05.06 | That's true for whole COUNTRIES, too.               | crane up: harbour after harbour along the coast           | crane up
// 05.07 | We'll GET THERE.                                    | far out at sea a great dark ring waits                     | tilt to the horizon
// 05.08 | And your PLANS?                                     | the ring on the sheet; the pen moves to West              | shape match (ring)
// 05.09 | Make them SMALL, and make them REVERSIBLE.          | a long dotted course snaps; the pen draws the tack line; | push in; shape match (zigzag)
//       |                                                     | the tack legs are a small boat's wake on a moonlit sea    | descend to the boat
// 05.10 | Nassim TALEB … SHOCKS: ANTIFRAGILE.                 | candle in a jar + driftwood fire; a gust: the candle dies, | push along the beach
//       |                                                     | the fire flares                                           |
// 05.11 | When SARAS SARASVATHY … don't PREDICT the future.   | the boat shed, one lamp; a hand pushes the blueprint aside| through the door
// 05.12 | They start with WHAT THEY HAVE, … AFFORD TO LOSE, … SURPRISES | hands gather driftwood, rope, the old sail; a small raft; | pan; turn to the door
//       |                                                     | most planks stay stacked; the sail tears, re-rigged, launch|
// 05.13 | (end)                                               | back on the sheet: all four points glow; push into paper  | paper plate (lamp)
import { clamp } from '../engine.mjs';
import { ready, camera, track, eoX, eiX, sio, u01, pulse, TAU, hash, projRuns, projPoly, fillPoly } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { boat } from '../lib/s8_boats.mjs';
import { makeTown, drawTown, breakwater, calmBasin, coastline } from '../lib/s8_harbour.mjs';
import { seaRose } from '../lib/s8_fleet.mjs';
import { room, sheetCorners, penHand, DESK } from '../lib/s8_desk.mjs';
import { inkRose } from '../lib/s8_rose.mjs';
import { crowd, circle, heads } from '../lib/s8_crowd.mjs';
import { walkerBack } from '../lib/s8_people.mjs';
import { clip, label } from '../lib/s8_card.mjs';
import { hand } from '../lib/hand.mjs';
import { hand as handoff, lineGround, lineStroke } from '../lib/handoff4.mjs';
import { wind } from '../lib/s8_cloud.mjs';
import { growPlate, keys, vign, paperPatch } from '../lib/s8_b2kit.mjs';
import { archive, sand, moon, candleJar, driftFire, SHED, shed, roll, log, coil, sailHeap, planks, raft } from '../lib/s8_c05_local.mjs';

export default async function (T, R) {
  const A = (p, n) => T.S('03c', p, n), D = (p, n) => T.S('03d', p, n), E = (p, n) => T.S('03e', p, n), C4 = T.clip('C4');
  const HI = handoff('c04>c05', T), HO = handoff('c05>c06', T);
  const K = {
    in: HI.b, whoever: A('whoever'), become: A('become'), dont: A("don't"), alone: A('alone'), since: A('Since'), nineteen: A('nineteen'), harvard: A('Harvard'),
    same: A('same lives'), now: A('and now'), children: A("children's"), so: A('So what'), decades: A('decades'), reveal: A('reveal'), c0: C4.start, c1: C4.end,
    when: D('When the'), speeds: D('speeds'), people: D('people'), harbour: D('harbour'), thats: D("That's"), countries: D('countries'), well: D("We'll"), there: D('there'),
    plans: E('And your'), make: E('Make them'), small: E('small'), reversible: E('reversible'), nassim: E('Nassim'), taleb: E('Taleb'), shocks: E('shocks'), anti: E('antifragile'),
    whenS: E('When Saras'), saras: E('Saras'), founders: E('founders'), predict: E('predict'), future: E('future'), they: E('They start'), what: E('what they have'), risk: E('risk'),
    afford: E('afford'), lose: E('lose'), turn: E('turn'), surprises: E('surprises'), something: E('something'), out: HO.a,
  };
  // take boundaries (each a cut on a carrier)
  K.A1 = K.alone; K.B1 = K.harvard - .45; K.D0 = K.c1 - .4; K.E0 = K.plans - .05; K.E1 = K.reversible - .3; K.F1 = K.something + .15;

  // the dark ring far out at sea (c05.07) and the camera that ends on it: its ellipse is matched by the ring on the sheet (c05.08)
  const Y1 = Math.PI / 2 - .3, CAMR = [200, 420, 300], RD = 700, RINGR = 250, RING = [CAMR[0] + Math.sin(Y1) * RD, CAMR[2] + Math.cos(Y1) * RD];
  const CRING = camera({ x: CAMR[0], y: CAMR[1], z: CAMR[2], yaw: Y1, pitch: Math.atan2(CAMR[1], RD), F: 900 });
  const RQ = Array.from({ length: 64 }, (_, i) => CRING.P(RING[0] + Math.sin(i / 64 * TAU) * RINGR, .3, RING[1] + Math.cos(i / 64 * TAU) * RINGR)), RXS = RQ.map((p) => p[0]), RYS = RQ.map((p) => p[1]);
  const RX = (Math.max(...RXS) - Math.min(...RXS)) / 2, RY = (Math.max(...RYS) - Math.min(...RYS)) / 2;
  // ================================================================ the sheet on your table (desk coordinates, s8_desk)
  const SH = { x: .05, z: .02, w: .56, aspect: 16 / 9, rot: 0, res: .6 };
  const RC = [960, 540], RR = 250, SK = sheetCorners(SH);
  const sheetW = (px, py, dy = 0) => { const u = px / 1920, v = py / 1080; return [0, 1, 2].map((i) => (1 - v) * ((1 - u) * SK[0][i] + u * SK[1][i]) + v * ((1 - u) * SK[3][i] + u * SK[2][i]) + (i === 1 ? dy : 0)); };
  const ICS = [RC[0], RC[1] + RR * .48], ICW = [RC[0] - RR * .48, RC[1]], TIPW = [RC[0] - RR * 1.18, RC[1]];
  const WSZ = RR * .3;   // icon size (plate px)
  const FIREP = sheetW(ICS[0], ICS[1] + 6), ICWW = sheetW(...ICW);
  // the dotted course (05.09): from the West tip out across the paper and the table into the dark; it snaps
  const DOT0 = sheetW(...TIPW), DOT1 = [SK[0][0] - .62, DESK.top + .0012, DOT0[2]];
  K.d0 = K.make - .45; K.d1 = K.small + .05; K.snap = K.small + .2; K.w0 = K.small + .55; K.w1 = K.E1 - .28;
  const roseOpts = (t) => {
    const sP = u01(t, K.in + .9, K.whoever), sI = u01(t, K.whoever, K.become + .55), wP = u01(t, K.plans + .5, K.plans + .9), wI = u01(t, K.w0, K.w1);
    const fin = u01(t, K.F1 + .05, K.F1 + .35), litS = Math.max(.6 * u01(t, K.dont - .1, K.dont + .3), fin);
    return { x: RC[0], y: RC[1], R: RR, seed: 3, ring: 1, cross: 1, points: [1, 1, sP, wP], letters: [1, 1, sP, wP], icons: [1, 1, sI, wI], lit: [.45 + .55 * fin, .45 + .55 * fin, litS, fin], t };
  };
  let penNow = null;
  const sheetItem = (t, res) => ({ ...SH, res: res ?? SH.res, draw: (g, tt) => { const r = inkRose(g, tt, roseOpts(tt)); penNow = r.pen; } });
  // where the pen is when it is not drawing (plate px) and how high it is lifted
  const penRest = (t) => {
    if (t < K.whoever) return { p: [ICS[0] + 260 - 150 * u01(t, K.in + .7, K.whoever), ICS[1] + 220 - 200 * u01(t, K.in + .7, K.whoever)], lift: .8 };
    if (t < K.E0) return { p: [ICS[0] + 140 + 200 * u01(t, K.become + .55, K.dont + .2), ICS[1] + 60 + 220 * u01(t, K.become + .55, K.dont + .2)], lift: .9 };
    if (t < K.d0) { const u = sio(u01(t, K.plans + .2, K.d0)); return { p: [TIPW[0] + (ICS[0] + 200 - TIPW[0]) * (1 - u), TIPW[1] + (ICS[1] + 200 - TIPW[1]) * (1 - u)], lift: .7 * (1 - u) }; }
    if (t < K.w0) { const u = u01(t, K.snap, K.w0); return { p: [ICW[0] - 40 + 200 * (1 - u), ICW[1] + 30 - 140 * (1 - u)], lift: .7 * pulse(t, K.snap, K.w0) + .1 }; }
    return { p: [ICW[0] + 120 + 500 * u01(t, K.w1, K.w1 + .3), ICW[1] + 80 + 500 * u01(t, K.w1, K.w1 + .3)], lift: .9 };
  };
  const dotU = (t) => (t < K.snap ? u01(t, K.d0, K.d1) : 1);
  function dotted(ctx, t, C) {   // the long ruled course and its snap
    const u = dotU(t), sn = u01(t, K.snap, K.snap + .35), brk = .38, n = 64;
    if (u <= 0 || t > K.E1) return null;
    let pen = null;
    for (let i = 0; i < n; i++) {
      const v = i / n; if (v > u) break;
      let a = [DOT0[0] + (DOT1[0] - DOT0[0]) * v, DESK.top + .0012, DOT0[2]], b = [DOT0[0] + (DOT1[0] - DOT0[0]) * (v + .5 / n), DESK.top + .0012, DOT0[2]];
      if (sn > 0 && v > brk) {   // beyond the break the line recoils: it kinks down, the far dots are swallowed back to the break
        if (v > brk + (1 - brk) * (1 - eoX(sn))) continue;
        const k = (v - brk) * .35 * eoX(sn); a = [a[0], a[1], a[2] - k * (v - brk) * 2]; b = [b[0], b[1], b[2] - k * (v - brk + .5 / n) * 2];
      }
      const A = C.P(...a), B = C.P(...b); if (!A || !B) continue;
      const onPaper = a[0] > SK[0][0];
      ctx.strokeStyle = onPaper ? '#2a2420' : 'rgba(255,196,130,.55)'; ctx.lineWidth = Math.max(1.5, A[2] * .0016); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
      pen = B;
    }
    // the snap itself: a tiny burst of ink at the break
    if (sn > 0 && sn < 1) { const p = C.P(DOT0[0] + (DOT1[0] - DOT0[0]) * brk, DESK.top + .001, DOT0[2]); if (p) { ctx.fillStyle = '#2a2420'; for (let i = 0; i < 6; i++) { const a = i * 1.1 + 2, r = p[2] * .006 * eoX(sn); ctx.beginPath(); ctx.arc(p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r, 2, 0, TAU); ctx.fill(); } } }
    return t < K.d1 ? pen : null;
  }
  function deskFrame(ctx, t, Cd, o = {}) {
    penNow = null;
    const r = room(ctx, t, Cd, { items: [sheetItem(t, o.res)], person: null, outside: .9 });
    let pen = null;
    if (t > K.d0 && t < K.E1) pen = dotted(ctx, t, Cd);
    // the pen hand: on the stroke being drawn, otherwise resting / travelling
    if (o.pen !== false && t > K.in + 1.0) {
      let sp, lift = 0;
      if (pen) sp = pen;
      else if (penNow) { const w = sheetW(...penNow); sp = Cd.P(...w); }
      else { const pr = penRest(t), w = sheetW(...pr.p, .03 * pr.lift); sp = Cd.P(...w); lift = pr.lift; }
      if (sp) { const s = sp[2] * .17 / 150; if (s > .2 && s < 9) penHand(ctx, t, sp[0], sp[1], s, { lift, ang: -.95 }); }
    }
    return r;
  }
  const aimAt = (p, y, pitch, F, dx = 0) => ({ x: p[0] + dx, y, z: p[2] - (y - p[1]) / Math.tan(pitch), yaw: 0, pitch, F });
  // camera A: the line → the sheet's edge, crane up, the pen draws South, push into its fire
  const camA = keys([
    [K.in + .3, { x: .05, y: DESK.top + .012, z: -.56, yaw: 0, pitch: -.036, F: 1400 }],
    [K.in + .95, { x: .06, y: DESK.top + .1, z: -.52, pitch: .24, F: 1400 }],
    [K.become + .1, aimAt(sheetW(960, 600), 1.12, .85, 1350, .02)],
    [K.dont, aimAt(FIREP, 1.0, 1.15, 1400, .02)],
    [K.alone, aimAt(FIREP, .82, 1.45, 1500)],
  ]);
  // camera E: the ring on the sheet (matching the sea ring's ellipse), to West, the course, the tack line, push into it
  const RCW = sheetW(...RC), ringD = 1400 * (SH.w * RR / 1920) / RX, pE = Math.asin(clamp(RY / RX, .2, .95));
  const zoomH = (1400 * SH.w / 1920) * WSZ / 700;   // straight down over the tack icon: one icon unit (WSZ plate px) = 700 screen px (= 30 m seen from 60 m)
  const camE = keys([
    [K.E0, { x: RCW[0], y: DESK.top + ringD * Math.sin(pE), z: RCW[2] - ringD * Math.cos(pE), yaw: 0, pitch: pE, F: 1400 }],
    [K.plans + .7, { x: RCW[0] - .05, y: DESK.top + .42, z: RCW[2] - .5, yaw: -.04, pitch: .72, F: 1400 }],
    [K.make + .2, { x: DOT0[0] - .12, y: DESK.top + .42, z: DOT0[2] - .4, yaw: -.12, pitch: .82, F: 1350 }],
    [K.snap + .4, { x: DOT0[0] - .05, y: DESK.top + .3, z: DOT0[2] - .26, yaw: -.05, pitch: 1.0, F: 1400 }],
    [K.w1 - .1, { x: ICWW[0], y: DESK.top + .1, z: ICWW[2] - .03, yaw: 0, pitch: 1.4, F: 1400 }],
    [K.E1, { x: ICWW[0], y: DESK.top + zoomH, z: ICWW[2], yaw: 0, pitch: Math.PI / 2, F: 1400 }],
  ]);
  // camera G: from the West point up over the whole rose, then into the blank margin (the paper plate at H.a)
  const MG = sheetW(1600, 830), MGQ = [[1305, 664], [1895, 664], [1895, 996], [1305, 996]].map(([x, y]) => sheetW(x, y)), mgH = 1400 * (SH.w * 590 / 1920) / 1920;
  const camG = keys([
    [K.F1, { x: ICWW[0], y: DESK.top + .06, z: ICWW[2], yaw: 0, pitch: Math.PI / 2, F: 1400 }],
    [K.F1 + .25, { x: RCW[0] - .02, y: DESK.top + .36, z: RCW[2] - .02, pitch: Math.PI / 2 - .02, F: 1400 }],
    [K.out - .4, { x: MG[0], y: DESK.top + .001 + mgH * .88, z: MG[2], pitch: Math.PI / 2, F: 1400 }],   // overfill: the lamp pool's edges stay outside the frame
    [K.out, { x: MG[0], y: DESK.top + .001 + mgH, z: MG[2], pitch: Math.PI / 2, F: 1400 }],
  ]);

  // ================================================================ the fire circle on the beach (fire at the origin, sea toward +Z)
  const FC = circle({ n: 11, R: 2.3, x: 0, z: 0, pose: 'sit', seed: 4 }), NEWA = 2.3, RN = 2.3;
  const circlePeople = (t) => FC.map((p) => {
    const a = Math.atan2(p.x, p.z), d = a - NEWA, near = Math.abs(d) < .55 ? Math.sign(d) * .26 * sio(u01(t, K.alone + .35, K.alone + 1.2)) : 0;
    return { ...p, x: Math.sin(a + near) * RN, z: Math.cos(a + near) * RN, turn: near ? .6 : 0 };
  });
  const NEW0 = [7.5, -3.8], NEW1 = [Math.sin(NEWA) * 2.75, Math.cos(NEWA) * 2.75];
  const newcomer = (t) => { const u = sio(u01(t, K.alone + .1, K.since + .2)); return { x: NEW0[0] + (NEW1[0] - NEW0[0]) * u, z: NEW0[1] + (NEW1[1] - NEW0[1]) * u, walk: u > 0 && u < 1, d: u * Math.hypot(NEW1[0] - NEW0[0], NEW1[1] - NEW0[1]) }; };
  const camB = keys([
    [K.A1, { x: 0, y: .42, z: -.8, yaw: 0, pitch: .12, F: 1400 }],
    [K.A1 + .55, { x: .2, y: 1.2, z: -3.8, yaw: .02, pitch: .13, F: 1350 }],
    [K.since, { x: .6, y: 2.2, z: -6.9, yaw: .03, pitch: .17, F: 1300 }],
    [K.nineteen + .3, { x: .7, y: 2.4, z: -7.3, yaw: .02, pitch: .18, F: 1300 }],
    [K.B1, { x: 0, y: .45, z: -.85, yaw: 0, pitch: .14, F: 1400 }],
  ]);
  function fireCircle(ctx, t, C) {
    drawSky(ctx, t, C, {});
    drawSea(ctx, t, C, { glints: [] });
    sand(ctx, t, C, { shore: (x) => 13 + .015 * x * x });
    const ppl = circlePeople(t), f = C.P(0, .4, 0);
    // the people behind the fire, the fire, the people in front (depth-split at the fire)
    const behind = ppl.filter((p) => C.depth(p.x, 1, p.z) > C.depth(0, 1, 0)), front = ppl.filter((p) => C.depth(p.x, 1, p.z) <= C.depth(0, 1, 0));
    crowd(ctx, t, C, behind, { light: [0, .7, 0], lightCol: '#ffb066' });
    const fp = driftFire(ctx, t, C, [0, 0, 0], { flare: .25 + .1 * Math.sin(t * 1.3) });
    crowd(ctx, t, C, front, { light: [0, .7, 0], lightCol: '#ffb066' });
    const N = newcomer(t), np = C.P(N.x, 0, N.z);
    if (np && np[2] > 20) walkerBack(ctx, t, np[0], np[1], 1.76 * np[2], N.walk ? N.d / .75 * Math.PI : 0, { light: f ? { x: f[0], y: f[1], col: '#ffb066', a: .9 } : undefined });
    vign(ctx, .5);
    return fp;
  }

  // ================================================================ the archive (a long table along +Z)
  const KINDS = ['a', 'b', 'c', 'd', 'e', 'f'], CARDS = [];
  for (let r = 0; r < 28; r++) for (const [j, x] of [-.72, -.24, .24, .72].entries()) CARDS.push({ x: x + (hash(r * 4 + j) - .5) * .03, z: .3 + r * .56, kind: KINDS[(r * 4 + j * 7) % 6], rot: (hash(r * 9 + j) - .5) * .08 });
  const feat = (kind, x, z) => { let best = 0, bd = 9; CARDS.forEach((c, i) => { const d = Math.hypot(c.x - x, c.z - z); if (d < bd) { bd = d; best = i; } }); CARDS[best] = { ...CARDS[best], kind, rot: 0, boost: 1.3 }; return best; };
  const IY = feat('young', .24, .86), IO = feat('old', -.24, 3.1), ICH = feat('child', .24, 5.34);
  CARDS.push({ x: 0, z: 16.55, kind: 'young', rot: 0, boost: 1.2 }); const IEND = CARDS.length - 1;
  const LAMPS = [[.95, .98, .9, 1], [-.95, .98, 4.3, .8], [.36, .98, 16.9, 1.1]];
  const cY = CARDS[IY], cO = CARDS[IO], cC = CARDS[ICH], cE = CARDS[IEND];
  const over = (c, y, pitch, dx = 0, dz = 0) => ({ x: c.x + dx, y, z: c.z + dz - (y - .76) / Math.tan(pitch), yaw: 0, pitch, F: 1400 });
  const camC = keys([
    [K.B1, { x: .95, y: .985, z: .55, yaw: 0, pitch: .01, F: 1400 }],
    [K.B1 + .6, over(cY, 1.08, .95, .04, -.05)],
    [K.same - .55, over(cY, 1.02, 1.0, -.01, .04)],
    [K.same + .05, over(cO, 1.04, 1.0, .01, -.02)],
    [K.children - .5, over(cO, 1.0, 1.02, .0, .03)],
    [K.children + .1, over(cC, 1.02, 1.02, 0, -.01)],
    [K.so, over(cC, 1.12, .9, -.04, -.04)],
    [K.decades + .45, { x: 0, y: 2.5, z: 3.6, yaw: 0, pitch: .2, F: 1250 }],
    [K.c0 - .55, { x: 0, y: 1.7, z: 12.8, pitch: .45, F: 1300 }],
    [K.c0, { x: cE.x, y: 1.16, z: cE.z - .3, pitch: 1.05, F: 1450 }],
  ]);
  function drawers(ctx, t, C) {   // the card cabinets along both walls, lit by the nearest lamp
    for (const side of [-1, 1]) for (let i = 0; i < 52; i++) {
      const z = -1 + i * .36; if (C.depth(side * 2.1, 1, z) < .2) continue;
      for (let j = 0; j < 9; j++) {
        const y = .1 + j * .26, P = projPoly(C, [[side * 2.1, y, z], [side * 2.1, y, z + .34], [side * 2.1, y + .24, z + .34], [side * 2.1, y + .24, z]]);
        let L = 0; for (const [lx, , lz, lv] of LAMPS) L += lv / (1 + ((side * 2.1 - lx) ** 2 + (z - lz) ** 2) * .5);
        if (fillPoly(ctx, P, `rgb(${18 + 40 * L | 0},${12 + 24 * L | 0},${9 + 14 * L | 0})`)) { ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 1; ctx.stroke(); const h = C.P(side * 2.1 - side * .01, y + .12, z + .17); if (h && L > .12) { ctx.fillStyle = `rgba(220,160,90,${Math.min(.8, L)})`; ctx.fillRect(h[0] - h[2] * .02, h[1] - h[2] * .006, h[2] * .04, h[2] * .012); } }
      }
    }
  }
  function archiveFrame(ctx, t, C) {
    ctx.fillStyle = '#07050a'; ctx.fillRect(0, 0, 1920, 1080);
    drawers(ctx, t, C);
    const CC = CARDS.map((c, i) => (i === IEND ? { ...c } : c));
    const r = archive(ctx, t, C, { cards: CC, lamps: LAMPS });
    vign(ctx, .55);
    return r;
  }

  // ================================================================ the harbour, the coast, the dark ring (town at z < 0, the sea toward +Z)
  const TOWN = makeTown({ x: -5, z: 0, face: 1, w: 210, depth: 70, rise: 18, n: 120, seed: 21, gap: [8, 14] });
  const BWP = [[-72, 74], [-30, 71], [12, 71], [46, 73]], JETTY = [[64, 0], [65, 34], [63, 62]];
  const BASIN = [[-90, 3], [62, 3], [62, 66], [46, 71], [-72, 72], [-90, 60]];
  const QUAY = heads({ n: 34, x0: 12, x1: 40, z0: -6, z1: -1.2, seed: 8, hold: 'lantern' }).map((p, i) => ({ ...p, hold: i % 3 ? null : 'lantern' }));
  const BOATP = [[86, 140], [58, 84], [42, 40], [27, 5.5]];
  const boatAt = (t) => { const u = clamp(sio(u01(t, K.c1 - .2, K.harbour + .3)) * .92 + .08 * u01(t, K.harbour + .3, K.thats + .5)), sp = track(BOATP.map((p, i) => [i / 3, p[0]])), sz = track(BOATP.map((p, i) => [i / 3, p[1]])); const x = sp(u), z = sz(u), x2 = sp(Math.min(1, u + .01)), z2 = sz(Math.min(1, u + .01)); return { x, z, head: Math.atan2(x2 - x, z2 - z) || Math.PI, sail: 'slack', lantern: 1, fig: 'stand' }; };
  const camD = keys([
    [K.D0, { x: -13, y: 10.2, z: 218, yaw: Math.PI, pitch: 0, F: 1400 }],
    [K.c1 + .25, { x: -12, y: 10.4, z: 212, yaw: Math.PI, pitch: .005, F: 1400 }],
    [K.speeds + .3, { x: 6, y: 17, z: 160, yaw: Math.PI - .1, pitch: .09, F: 1300 }],
    [K.people, { x: 34, y: 10, z: 76, yaw: Math.PI - .32, pitch: .1, F: 1300 }],
    [K.harbour + .5, { x: 38, y: 6.5, z: 32, yaw: Math.PI - .22, pitch: .1, F: 1350 }],
    [K.countries + .3, { x: 110, y: 210, z: 250, yaw: Math.PI / 2 + .62, pitch: .5, F: 1050 }],
    [K.well + .1, { x: 170, y: 360, z: 290, yaw: Y1 + .18, pitch: .42, F: 950 }],
    [K.E0, { x: CAMR[0], y: CAMR[1], z: CAMR[2], yaw: Y1, pitch: Math.atan2(CAMR[1], RD), F: 900 }],
  ]);
  const bwLine = (() => { const C = camD(K.c1), a = C.P(BWP[0][0], 2.2 + 2.4, BWP[0][1]), b = C.P(BWP[3][0], 2.2 + 2.4, BWP[3][1]); if (!a || !b) return [380, 600, 1160, 8]; return [Math.min(a[0], b[0]), (a[1] + b[1]) / 2 - 4, Math.abs(b[0] - a[0]), 8]; })();
  function harbourFrame(ctx, t, C) {
    drawSky(ctx, t, C, {});
    const bl = boatAt(t), bp = C.P(bl.x, 1.4, bl.z);
    const gp = C.D(Math.sin(Y1), 0, Math.cos(Y1)), mg = u01(t, K.thats, K.well);
    drawSea(ctx, t, C, { glints: gp && mg > 0 ? [{ x: gp[0], y: C.hy, col: '#dfe6ff', a: mg, w: 170, spread: .5 }] : [], lift: .15 * mg });
    const hi = C.y > 60;
    if (hi || t > K.thats) coastline(ctx, t, C, { z0: 0, x0: -1400, x1: 2400, n: 14, lit: u01(t, K.thats - .2, K.countries + .8), seed: 9 });
    calmBasin(ctx, t, C, { poly: BASIN, a: 1 });
    drawTown(ctx, t, C, TOWN, { lit: .75, lamps: 1 });
    breakwater(ctx, t, C, { pts: BWP, lampEvery: 9 });
    breakwater(ctx, t, C, { pts: JETTY, lampEvery: 11 });
    // the lamp row as one lit line while the clip closes onto it, then it resolves into lamps
    const la = 1 - u01(t, K.c1 + .05, K.c1 + .8);
    if (la > 0) for (const run of projRuns(C, BWP.map(([x, z]) => [x, 2.2 + 2.4, z]))) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; for (const [w, a] of [[22, .06], [8, .16], [2.6, .6], [1.2, .9]]) { ctx.strokeStyle = `rgba(${w < 2 ? '255,250,240' : '233,220,192'},${a * la})`; ctx.lineWidth = w; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } ctx.restore(); }
    if (bp) boat(ctx, t, C, bl);
    // the quay: people with lanterns; as the boat comes in they raise them, two catch its lines
    const arr = u01(t, K.people - .3, K.harbour + .2);
    const q = QUAY.map((p, i) => ({ ...p, raise: p.hold ? sio(clamp(arr * 1.6 - hash(i) * .6)) : (i === 4 || i === 9 ? sio(u01(t, K.harbour - .4, K.harbour + .2)) : 0) }));
    const hs = crowd(ctx, t, C, q, { light: [26, 2, 2], lamp: 1 });
    // the lines thrown ashore: from the boat's bow and stern to two raised hands
    const ln = u01(t, K.harbour - .3, K.harbour + .3);
    if (ln > 0 && bp) for (const h of hs.filter((h) => h.i === 4 || h.i === 9)) { const b = C.P(bl.x + (h.i === 4 ? -1 : 1) * 1.2, 1.0, bl.z - 1); if (!b) continue; ctx.strokeStyle = 'rgba(210,190,150,.8)'; ctx.lineWidth = Math.max(1, b[2] * .015); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.quadraticCurveTo((b[0] + h.hand[0]) / 2, Math.max(b[1], h.hand[1]) + 20 * (1 - ln), b[0] + (h.hand[0] - b[0]) * ln, b[1] + (h.hand[1] - b[1]) * ln); ctx.stroke(); }
    // the dark ring far out at sea (planted, unlit), after "We'll get there"
    if (t > K.countries) {
      const dm = u01(t, K.countries + .3, K.well + .4), pts = []; for (let i = 0; i <= 180; i++) { const th = i / 180 * TAU; pts.push([RING[0] + Math.sin(th) * RINGR, .3, RING[1] + Math.cos(th) * RINGR]); }
      for (const run of projRuns(C, pts)) { ctx.lineJoin = 'round'; ctx.strokeStyle = `rgba(4,4,10,${dm})`; ctx.lineWidth = 9; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.strokeStyle = `rgba(170,182,230,${.7 * dm})`; ctx.lineWidth = 1.6; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] - 2.5) : ctx.moveTo(p[0], p[1] - 2.5))); ctx.stroke(); }
      seaRose(ctx, t, C, { x: RING[0], z: RING[1], R: RINGR, a: 0, dim: dm });
    }
    vign(ctx, .45);
  }

  // ================================================================ the moonlit sea, Taleb's beach, the boat shed (shore at z ≈ 0, sea toward +Z)
  const MOON = [-.35, .5];
  // the tack legs: the icon's zigzag (plate px around ICW, y down) as world legs (x, z), 30 m per icon unit, centred on (0, 45)
  const TACK = [[-.46, .4], [-.22, -.1], [0, .32], [.22, -.16], [.4, .12]], SU = 30, TC = [0, 45];
  const legsW = TACK.map(([a, b]) => [TC[0] + a * SU, TC[1] - b * SU]);
  // after the cut the boat keeps tacking toward the shore, then runs along it
  const more = [[legsW[4][0] + 8, legsW[4][1] - 10], [legsW[4][0] + 4, legsW[4][1] - 22], [legsW[4][0] + 12, legsW[4][1] - 30]];
  const PATH = [...legsW, ...more], PL = [0]; for (let i = 1; i < PATH.length; i++) PL.push(PL[i - 1] + Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]));
  const L4 = PL[4], VB = 5.5;
  const sAt = (t) => L4 + VB * (t - K.E1);
  const along = (s) => { s = clamp(s, 0, PL[PL.length - 1] - .01); let i = 1; while (i < PL.length - 1 && PL[i] < s) i++; const u = (s - PL[i - 1]) / (PL[i] - PL[i - 1]), a = PATH[i - 1], b = PATH[i]; return { x: a[0] + (b[0] - a[0]) * u, z: a[1] + (b[1] - a[1]) * u, head: Math.atan2(b[0] - a[0], b[1] - a[1]) }; };
  const tackBoat = (t) => { const p = along(sAt(t)); return { ...p, sail: 'full', sailSide: Math.sin(p.head) > 0 ? -.5 : .5, lantern: 1, fig: 'sit', roll: -.06 }; };
  const CANDLE = [-.55, 0, -2.4], FIRE = [.75, 0, -2.7];
  K.gust = K.shocks - .05; K.outC = K.shocks + .15;
  const shedLook = (t) => t > K.turn - .5;   // inside the shed: from 'turn' the camera faces the door
  const camF0 = keys([
    [K.E1, { x: TC[0], y: 60, z: TC[1], yaw: 0, pitch: Math.PI / 2, F: 1400 }],
    [K.E1 + .55, { x: 10, y: 34, z: 56, yaw: Math.PI - .5, pitch: .95, F: 1300 }],
    [K.nassim, { x: 18, y: 5, z: 62, yaw: Math.PI - .12, pitch: .06, F: 1300 }],
    [K.taleb + .5, { x: 4, y: 2.2, z: 14, yaw: Math.PI - .04, pitch: .07, F: 1350 }],
    [K.shocks - .3, { x: .15, y: .8, z: -.3, yaw: Math.PI, pitch: .14, F: 1400 }],
    [K.anti + .6, { x: .1, y: .75, z: -.75, yaw: Math.PI + .02, pitch: .16, F: 1450 }],
    [K.whenS + .1, { x: 0, y: 1.6, z: -3.3, yaw: Math.PI, pitch: .06, F: 1300 }],
    [K.saras + .5, { x: -.6, y: 1.9, z: -7.0, yaw: Math.PI - .12, pitch: .28, F: 1250 }],
    [K.founders + .3, { x: .5, y: 1.75, z: -8.6, yaw: Math.PI + .1, pitch: .36, F: 1250 }],
    [K.predict - .3, { x: .1, y: 1.6, z: -9.9, yaw: Math.PI, pitch: .5, F: 1300 }],
    [K.future + .3, { x: .05, y: 1.6, z: -10.0, yaw: Math.PI + .03, pitch: .52, F: 1300 }],
    [K.what + .2, { x: -.2, y: 2.2, z: -6.3, yaw: Math.PI + .06, pitch: .7, F: 1200 }],
    [K.risk + .2, { x: .15, y: 2.3, z: -6.25, yaw: Math.PI - .04, pitch: .72, F: 1200 }],
    [K.afford + .3, { x: -.6, y: 2.2, z: -6.3, yaw: Math.PI - .7, pitch: .5, F: 1200 }],
    [K.turn - .25, { x: .7, y: 1.7, z: -10.9, yaw: .12, pitch: .14, F: 1250 }],
    [K.surprises + .4, { x: .4, y: 1.55, z: -10.8, yaw: .04, pitch: .12, F: 1300 }],
    [K.F1, { x: 0, y: 1.9, z: -9.8, yaw: 0, pitch: .22, F: 1350 }],
  ]);
  // a hand-held breath inside the shed, so the long bench takes never settle
  const camF = (t) => {
    const tr = camF0.tr, h = u01(t, K.whenS - .3, K.whenS + .4) * (1 - u01(t, K.turn - .6, K.turn - .2));
    return camera({ x: tr.x(t) + h * .09 * Math.sin(t * .83), y: tr.y(t) + h * .05 * Math.sin(t * 1.17 + 1), z: tr.z(t) + h * .12 * Math.sin(t * .61 + 2),
      yaw: tr.yaw(t) + h * .022 * Math.sin(t * .71 + .5), pitch: tr.pitch(t) + h * .016 * Math.sin(t * .93 + 3), F: tr.F(t) });
  };
  // the raft and the items in the shed (the slipway runs down the middle to the door)
  const RAFT0 = [0, -8.6];
  const raftZ = (t) => RAFT0[1] + 14 * Math.pow(u01(t, K.something - .45, K.F1 + .4), 2);
  const PILE = [-2.2, -9.4], COIL = [1.95, -9.6], SAILP = [2.1, -8.2];
  function seaWorld(ctx, t, C, o = {}) {
    drawSky(ctx, t, C, { mw: .5 });
    const mp = moon(ctx, C, MOON[0], MOON[1], { R: 16 });
    const glints = mp ? [{ x: mp[0], y: mp[1], col: '#dfe6ff', a: .8, w: 60, spread: .35 }] : [];
    drawSea(ctx, t, C, { glints, lift: .25 });
  }
  function beachWorld(ctx, t, C) {
    seaWorld(ctx, t, C);
    sand(ctx, t, C, { shore: (x) => .4 * Math.sin(x * .05) });
    // the tacking boat and its amber legs (the lantern's wake)
    const s = sAt(t), pts = []; for (let v = Math.max(0, s - 140); v <= s; v += .8) { const p = along(v); pts.push([p.x, .05, p.z]); }
    for (const run of projRuns(C, pts)) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const [w, a] of [[9, .1], [3.5, .3], [1.4, .85]]) { ctx.strokeStyle = `rgba(255,179,92,${a})`; ctx.lineWidth = w; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } ctx.restore(); }
    shed(ctx, t, C, { sea: null });
    const gust = pulse(t, K.gust, K.gust + 1.4);
    const on = t < K.outC ? 1 - .3 * gust : 0;
    const cj = candleJar(ctx, t, C, CANDLE, { on, gust, outT: K.outC });
    const df = driftFire(ctx, t, C, FIRE, { flare: .15 + .85 * sio(u01(t, K.outC, K.anti + .2)), gust });
    boat(ctx, t, C, tackBoat(t));
    if (gust > 0) wind(ctx, t, { a: gust * .8, dir: -1 });
    return { cj, df };
  }
  function shedInside(ctx, t, C) {
    const gust = pulse(t, K.turn - .1, K.surprises + .5);
    const items = [(ctx, t, C) => {
      // the bench: the rolled blueprint (pushed aside on "predict")
      const push = sio(u01(t, K.predict - .25, K.predict + .4)), rx = .15 - 1.25 * push, B = SHED.bench;
      roll(ctx, t, C, [rx - .3, B.y + .045, B.z1 - .3], [rx + .3, B.y + .045, B.z1 - .3], .045);
      // the driftwood pile, the rope coil and the old sail on the floor; they go to the raft one after another
      const g1 = u01(t, K.what - .1, K.what + .45), g2 = u01(t, K.what + .3, K.what + .75), g3 = u01(t, K.what + .6, K.risk + .2);
      for (let i = 0; i < 4; i++) { const tg = [RAFT0[0] + (i - 1.5) * .26, RAFT0[1]], u = sio(clamp(g1 * 1.6 - i * .2)), sx = PILE[0] + (i % 2) * .3, sz = PILE[1] + i * .25 - .3; const x = sx + (tg[0] - sx) * u, z = sz + (tg[1] - sz) * u; if (u >= 1) continue; log(ctx, C, [x - .08, .1 + i * .02 + .25 * pulse(u, 0, 1), z - .9], [x + .08, .14 + i * .02 + .25 * pulse(u, 0, 1), z + .9], .09, .6); }
      if (g2 < 1) { const u = sio(g2); coil(ctx, C, [COIL[0] + (RAFT0[0] + .6 - COIL[0]) * u, .06 + .3 * pulse(g2, 0, 1), COIL[1] + (RAFT0[1] - COIL[1]) * u], .22); }
      if (g3 < 1) { const u = sio(g3); sailHeap(ctx, C, [SAILP[0] + (RAFT0[0] - .5 - SAILP[0]) * u, .02, SAILP[1] + (RAFT0[1] - SAILP[1]) * u], .8); }
      planks(ctx, t, C, { x: 2.45, z0: -10.4, z1: -7.2, n: 24 });
      const placed = Math.floor(clamp(g1 * 1.6 - .2) * 4.99), z = raftZ(t);
      raft(ctx, t, C, { x: RAFT0[0], z, head: 0, n: 4, placed: Math.max(placed, t > K.risk ? 4 : 0), lash: u01(t, K.risk + .3, K.afford), mast: u01(t, K.afford - .1, K.lose), sail: u01(t, K.lose - .2, K.lose + .3), tear: u01(t, K.turn - .05, K.turn + .25), rerig: u01(t, K.surprises + .1, K.surprises + .7), gust, y: .12 + (z > -6 ? -.12 : 0), bob: z > 0 ? .05 * Math.sin(t * 2) : 0 });
    }];
    shed(ctx, t, C, { sea: (cx, tt, Cc) => seaWorld(cx, tt, Cc), items, sway: .16 * Math.sin(t * 1.5) + .06 * Math.sin(t * 3.7) });
    if (gust > 0) wind(ctx, t, { a: gust * .7, dir: -1 });
    // the founder's hands (POV, from below): push the roll aside; reach for what lies there; lash; re-rig
    const B = SHED.bench, skin = '#a8734f', sleeve = '#26222e';
    const hp = (w, ang, pose, k = 1, flip = false) => { const p = C.P(...w); if (!p) return; const s = p[2] * .19 / 150 * k * 1.5; hand(ctx, p[0], p[1], s, { pose, ang, flip, skin, sleeve, sleeveLen: 520, rim: '#ffb066', light: [0, -1], t }); };
    const push = u01(t, K.predict - .45, K.predict + .55);
    if (push > 0 && push < 1) { const rx = .15 - 1.25 * sio(u01(t, K.predict - .25, K.predict + .4)); hp([rx + .42, B.y + .05, B.z1 - .14], -Math.PI + .25, 'open', 1, true); }
    const g = u01(t, K.what - .2, K.risk + .3);
    if (g > 0 && g < 1) { const p = [-.9 + 1.2 * Math.sin(g * Math.PI * 2.5) * .5, .55, -8.1]; hp(p, -Math.PI / 2 - .5, 'grip', 1.1, true); hp([p[0] + .7, .55, p[2] + .05], -Math.PI / 2 + .4, 'grip', 1.1); }
    const lash = u01(t, K.risk + .3, K.afford);
    if (lash > 0 && lash < 1) { const x = -.4 + .8 * lash; hp([x, .45, RAFT0[1] - .2], -Math.PI / 2 - .2, 'grip', 1.1); }
    const rr = u01(t, K.surprises, K.surprises + .8);
    if (rr > 0 && rr < 1) { const z = raftZ(t); hp([.3, 1.1 + .3 * Math.sin(rr * 6), z + .25], -Math.PI / 2 - .3, 'grip', 1.2); }
    vign(ctx, .5);
  }

  // ================================================================ the frame
  prepareSky();
  await ready();
  const deskCam = (Cfn, t) => Cfn(t);
  const frame = (ctx, t) => {
    // ---- A: the line plate → the sheet; the pen draws South; push into its fire
    if (t < K.A1) {
      const C = camA(t);
      if (t < K.in + .3) {   // the line on the card sky; the sky goes dark round it
        lineGround(ctx, t, HI.o);
        const d = eiX(u01(t, K.in + .02, K.in + .3)); ctx.fillStyle = `rgba(3,3,8,${.97 * d})`; ctx.fillRect(0, 0, 1920, 1080);
        lineStroke(ctx, t, HI.o);
        return;
      }
      deskFrame(ctx, t, C);
      const d = 1 - eoX(u01(t, K.in + .3, K.in + .95)); if (d > 0) { ctx.fillStyle = `rgba(3,3,8,${.97 * d})`; ctx.fillRect(0, 0, 1920, 1080); }
      if (t < K.in + .75) { const e = C.P(SH.x, DESK.top + .001, SK[0][2]); lineStroke(ctx, t, { ...HI.o, y: e ? e[1] : HI.o.y }); }
      const fp = C.P(...FIREP); if (fp) growPlate(ctx, t, 'light', { tone: 'fire' }, fp[0], fp[1], eiX(u01(t, K.alone - .45, K.alone - .04)));
      return;
    }
    // ---- B: the fire circle
    if (t < K.B1) {
      const C = camB(t), fp = fireCircle(ctx, t, C) || [960, 600];
      growPlate(ctx, t, 'light', { tone: 'fire' }, fp[0], fp[1] - 30, Math.max(1 - eoX(u01(t, K.A1, K.A1 + .45)), eiX(u01(t, K.B1 - .5, K.B1 - .04))));
      return;
    }
    // ---- C: the archive, the card's frame → clip C4
    if (t < K.c1) {
      if (t >= K.c0 + .4 && t < K.c1 - .4) { clip(ctx, t, T, 'C4', { carrier: 'frame', from: [760, 420, 400, 240], to: bwLine, info: { name: 'Robert Waldinger', role: 'Director, Harvard Study of Adult Development', source: '', date: '' } }); return; }
      if (t >= K.c0 && t >= K.c1 - .4) { harbourFrame(ctx, t, camD(t)); clip(ctx, t, T, 'C4', { carrier: 'frame', from: [760, 420, 400, 240], to: bwLine, info: { name: 'Robert Waldinger', role: 'Director, Harvard Study of Adult Development', source: '', date: '' } }); return; }
      const tc = Math.min(t, K.c0 + .4), C = camC(tc), r = archiveFrame(ctx, t, C);
      const lp = C.P(LAMPS[0][0], .98 + .22, LAMPS[0][2]);
      if (t < K.B1 + .6 && lp) growPlate(ctx, t, 'light', { tone: 'fire' }, lp[0], lp[1], 1 - eoX(u01(t, K.B1, K.B1 + .45)));
      // the label: on the 1938 card
      const yc = r[IY]; if (yc) label(ctx, t, yc[0][0], yc[0][1], u01(t, K.harvard - .1, K.harvard + .5) * (1 - u01(t, K.now - .1, K.now + .2)), 'HARVARD STUDY OF ADULT DEVELOPMENT', 'SINCE 1938', { len: 150, dx: 90, side: 'left' });
      if (t >= K.c0) clip(ctx, t, T, 'C4', { carrier: 'frame', from: r.rects[IEND] || [860, 480, 200, 120], to: bwLine, info: { name: 'Robert Waldinger', role: 'Director, Harvard Study of Adult Development', source: '', date: '' } });
      return;
    }
    // ---- D: the harbour, the coast, the dark ring
    if (t < K.E0) { harbourFrame(ctx, t, camD(t)); return; }
    // ---- E: the ring on the sheet, West, the course snaps, the tack line
    if (t < K.E1) { deskFrame(ctx, t, camE(t), { res: t > K.E1 - .45 ? 1.2 : .6 }); vign(ctx, .3); return; }
    // ---- F: the moonlit sea, Taleb's beach, the shed
    if (t < K.F1) {
      const C = camF(t), inside = C.z < SHED.door - .05;
      if (!inside) {
        const o = beachWorld(ctx, t, C);
        vign(ctx, .45);
        if (o.cj && o.df) { const lu = u01(t, K.taleb - .1, K.taleb + .5) * (1 - u01(t, K.whenS - .6, K.whenS - .3)); label(ctx, t, (o.cj[0] + o.df[0]) / 2, Math.min(o.cj[1], o.df[1]) - 40, lu, 'NASSIM NICHOLAS TALEB', 'ANTIFRAGILE, 2012', { len: 170, dx: 80 }); }
      } else {
        shedInside(ctx, t, C);
        const lp = C.P(...SHED.lamp); if (lp) label(ctx, t, lp[0], lp[1] + 30, u01(t, K.saras - .1, K.saras + .5) * (1 - u01(t, K.predict - .5, K.predict - .2)), 'SARAS SARASVATHY', 'UVA DARDEN', { len: 120, dx: 90 });
      }
      return;
    }
    // ---- G: back on the sheet: all four points glow; into the blank paper
    const Cg = camG(t); deskFrame(ctx, t, Cg, { res: t > K.out - .5 ? 1 : .6, pen: false });
    paperPatch(ctx, t, Cg, MGQ, u01(t, K.out - .38, K.out - .1));   // the lamp pool gathers into the margin: at H.a it IS the paper plate
    void deskCam;
  };
  const PR = { riso: .35 };
  return [
    { t: K.in, tr: 'cut', d: .1, draw: frame, print: HI.print },
    { t: K.in + .3, tr: 'cut', d: .1, draw: frame, print: PR },
    { t: K.c0, tr: 'cut', d: .1, draw: frame, print: { riso: .15, halftone: .4, hatch: .3 } },
    { t: K.c1, tr: 'cut', d: .1, draw: frame, print: PR },
    { t: K.out - .1, tr: 'cut', d: .1, draw: frame, print: HO.print },
  ];
}
