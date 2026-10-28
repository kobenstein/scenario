// c01 · Hook (00a + 01a) · 0 → c02 ("In a Yorkshire parsonage") · the QUALITY REFERENCE for the builders (Lead).
// Plan: docs/shots.md 1.01–1.12 (source tools/shots_bubble.py) · rules docs/MOTION.md · kit lib/bubble_kit.mjs (+ f10_editorial, base_kit)
// Three worlds, carried, no blend, no detected cut:
//   W1 (0 → "A whole country")      the golden bubble of banknotes over the data center; the gate; Altman's quote; money vs capability;
//                                    the bubble trembles. A note leaves, flies at the camera and FLIPS: its back is an 1845 railway share.
//   W2 (→ "But what they paid for")  the share fills the frame (the same object, the same matrix on both sides: a paper match) and we pull
//                                    back onto a table under a gas lamp: savings, the stamp glows, the burst, the printed locomotive comes
//                                    alive and runs; the Glasgow Argus (no quote: Mackay is paraphrased), the underline, the crash, the
//                                    empty purses. The ink line runs right; the camera flies into the paper.
//   W3 (→ c02)                       RAIL ANCHOR A1. Ink floods the page from top and bottom (sky / ground), the paper band becomes the mist
//                                    on the horizon, the ink line becomes the iron rail. A train glides in and stops ("still running
//                                    today"). A note falls into your hand and flips into your phone. The door opens ("who gets to ride?"),
//                                    closes to a slit, the camera arrives on the seam plate (lib/bubble_seams.mjs plateSlit) for c02.
// Every time below is a PHRASE anchor (T.F / T.seq), never a second.
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/base_kit.mjs';
import * as B from '../lib/bubble_kit.mjs';
import * as S from '../lib/bubble_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, project, F0, prng } = E;
const { COL } = B;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;
const ease5 = (x) => 1 - (1 - clamp(x)) ** 5;

export const PRINT = K.PRINT13;

export default async (T, R) => {
  E.prepareEditorial();
  const at = T.seq(0), F = (ph, after) => T.F(ph, after);
  const a = {};
  a.pop = at('bubble could pop'); a.popW = F('pop', a.pop);
  a.people = at('And the people'); a.saying = at('saying so');
  a.altman = at('Sam Altman'); a.asked = at('asked it out loud'); a.are = at('Are investors'); a.answer = at('His own answer');
  a.myop = at('My opinion'); a.yes = F('yes', a.myop);
  a.butM = at('But the machines'); a.notEven = at('Not even a little'); a.speeding = at('speeding up');
  a.soWhat = at('So what happens'); a.superI = at('superintelligence'); a.money = at('money runs out'); a.out = T.FE('out', a.money);
  a.before = at("It's happened before"); a.beforeW = F('before', a.before);
  a.country = at('A whole country'); a.savings = at('savings'); a.machine = at('new machine'); a.machineW = F('machine', a.machine);
  a.burstP = at('The bubble burst'); a.burst = F('burst', a.burstP); a.won = at('And the machine won'); a.wonW = F('won', a.won);
  a.best = at('One of the best-known'); a.delusion = at('mass delusion');
  a.paperP = at('His own newspaper'); a.news = F('newspaper', a.paperP); a.fear = at('fear a crash');
  a.crashP = at('Then the crash came'); a.crash = F('crash', a.crashP); a.savers = at('Ordinary savers lost'); a.lost = F('lost', a.savers);
  a.paid = at('But what they paid for'); a.running = at('still running today'); a.today = F('today', a.running);
  a.pops = at('So when this bubble pops'); a.holding = at('holding the paper'); a.ride = at('who gets to ride'); a.rideW = F('ride', a.ride);
  a.T0 = R.b;                                                     // c02 starts here (seam plate ±0.5 s)
  return [{ t: 0, draw: hook(a), print: PRINT }];
};

// ===================================================================================================================== layout
// W1 (design coords of the focus card at home camera = screen)
const BUB = { x: 1340, y: 350, r: 285 };
const DC = { x: 820, y: 885, w: 1100, h: 165, gate: 1180 };
const DU1 = { x: 330, y: 905, h: 140 };
const WORKERS = [[1134, 946, 70, 1, 1], [1196, 948, 67, -1, 2], [1242, 944, 71, 1, 3]];
const Q = { x: 110, rule: 176, l1: 262, l2: 330, yes: 470, src: 528, s: 52, sYes: 92 };
const Q1 = 'Are we in a phase where investors as a whole', Q2 = 'are overexcited about AI?', QY = 'My opinion is yes.', QS = '— Sam Altman, August 2025';
const AX = { x0: 110, x1: 1010, y: Q.yes };
// W2 (the table, top view)
const CERT = { x: 720, y: 470, w: 560, rot: -.04 };
const CERT_S = 2600 / CERT.w;                                     // the share fills the frame at the paper match
const PURSE = { x: 330, y: 700, s: 150, rot: .35 };
const CUP = { x: 290, y: 320, r: 60 };
const NEWS = { x: 1150, y: 60, w: 900, h: 1100 };
const UL = { x0: 1205, x1: 1440, y: 494 };                        // the underline under a line of the leader column
const LAND = [1490, 990];
const PURSES = [[1222, 1002, 84, .2], [1312, 1014, 80, -.3], [1402, 998, 86, .5]];
const PUSH = { x: 1775, y: LAND[1], s: 3.6, sy: 700 };            // the fly-in: the run at y 990 lands on screen y 700
const CRASH = [[UL.x1, UL.y], [1446, 522], [1452, 507], [1461, 600], [1467, 586], [1476, 760], [1484, 902], [LAND[0], LAND[1]]];
// W3 (screen = design at home camera)
const HOR = 700, LW = 3 * PUSH.s;                                 // the rail sits where the ink line was; its height = the line width
const DU3 = { x: 1290, y: 862, h: 150 };
const TR = S.TRAIN;

// confetti pieces of the share (seeded, built once)
const CONF = (() => {
  const r = prng(1331), out = [], nx = 10, ny = 7, h = CERT.w * .66;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const u = (i + .5) / nx - .5, v = (j + .5) / ny - .5;
    if (Math.abs(u) < .2 && Math.abs(v + .03) < .3) continue;          // the stamp oval stays
    const ang = Math.atan2(v * h, u * CERT.w) + (r() - .5) * .7;
    out.push({ u, v, pw: CERT.w / nx * (.8 + r() * .4), ph: h / ny * (.8 + r() * .4), ang, d: 140 + r() * 260, spin: (r() - .5) * 9, lum: .75 + r() * .25, dt: r() * .12 });
  }
  return out;
})();
const COINS = [[640, 522], [700, 566], [772, 540], [824, 586], [598, 586]];
const GRAIN = (() => { const r = prng(77), g = []; for (let i = 0; i < 26; i++) g.push([r() * 3200 - 300, r() * 1300 - 100, 300 + r() * 900, r() * 6.3]); return g; })();

// ===================================================================================================================== the take
function hook(a) {
  // ---------- W1 camera (focus card) ----------
  const K1 = [
    [0, cam3({ z: -150, x: 44, y: 14 })],
    [a.people - .1, cam3({ z: 26, x: 70, y: -6 })],
    [a.saying + 1.0, aim(F0, 1190, 880, 2.3, 990, 620)],
    [a.asked + .35, aim(F0, 820, 470, 1.03, 960, 520)],
    [a.butM + .2, aim(F0, 790, 452, 1.07, 960, 520)],
    [a.speeding + .6, aim(F0, 770, 436, 1.1, 960, 540)],
    [a.soWhat + .15, aim(F0, 820, 440, 1.1, 960, 540)],
    [a.money + .45, aim(F0, 1280, 500, 1.3, 1010, 520)],
    [a.before + 1.6, aim(F0, 1290, 496, 1.38, 1010, 520)],
  ];
  // ---------- the leaving note and the flight (1.05 → 1.06) ----------
  const tDet = a.before - 1.35, tCut = a.country + .6, tFlip0 = tDet + .25, tFlip1 = tDet + 1.35;   // one long, calm fly-in (smooth.py: no lurch)
  const cam1 = (t) => camDrift(camAt(t, K1), t, .7);
  const poses = B.bubblePoses(BUB.x, BUB.y, BUB.r, tDet, { tremble: .8 });
  const leaver = poses[poses.length - 1];                              // the front-most note at that moment
  const DET = new Set([leaver.id]);
  const p0 = project(cam1(tDet), F0, leaver.x, leaver.y), s0 = p0[2] * leaver.w / CERT.w;
  const camCut = aim(F0, CERT.x, CERT.y, CERT_S);
  const KF = [[tDet, aim(F0, CERT.x, CERT.y, s0, p0[0], p0[1])], [tCut, camCut, (u) => sineIO(1 - (1 - u) ** 1.35)]];
  // ---------- W2 camera (the table) ----------
  const tPush0 = a.crash + .2, tPush1 = a.paid + 1.4;   // one long push from the crash into the page (calm: no lurch)
  const camPush = aim(F0, PUSH.x, PUSH.y, PUSH.s, W / 2, PUSH.sy);
  const K2 = [
    [tCut, camCut],
    [a.burstP + .1, aim(F0, 690, 520, 1.0, 900, 545)],   // one long pull-back out of the share (purse at the left edge on "savings")
    [a.wonW + .2, aim(F0, 720, 512, 1.06, 900, 540)],
    [a.best + 2.7, aim(F0, 1590, 540, 1.0, 960, 540)],
    [a.news + .3, aim(F0, 1430, 520, 1.42, 960, 520)],
    [a.crash, aim(F0, 1430, 650, 1.3, 960, 540)],   // crash and purses both in frame; then one long push into the page
    [tPush1, camPush],
  ];
  const cam2 = (t) => {
    const c = camAt(t, K2), dz = 1 - smooth(span(t, tPush0 - .4, tPush0)) - (t < tCut + .8 ? 1 - smooth(span(t, tCut, tCut + .8)) : 0);
    return dz > 0 ? camDrift(c, t, .6 * dz, 5) : c;
  };
  // ---------- W3 (A1) timing and camera ----------
  const tFl0 = tPush1 - .3, tFl1 = tFl0 + 1.1, tBand = tFl1 + .5;          // ink flood, then the paper band closes into mist
  const tTr0 = a.running - .05, tTr1 = a.today + 2.0;                 // the train glides in and stops
  const tFall0 = a.pops - .1, tCatch = a.holding + .05, tFlip2 = tCatch + .15;
  const tZ0 = a.holding + .45, tPlate = a.T0 - S.SEAM_HALF;
  const tDoor0 = a.ride - .1, tDoor1 = a.rideW + .05, tShut0 = a.rideW + .2, tShut1 = tPlate;   // the door shuts on "ride?" and lands on the plate's slit
  const camPlate = aim(F0, TR.doorX, TR.doorY, S.PLATE_S, S.SLIT.x, S.SLIT.y);
  const K3 = [[a.pops, cam3()], [a.holding + .3, aim(F0, 1200, 700, 1.7, 980, 560)], [tZ0, aim(F0, 1196, 698, 1.74, 980, 560)], [tPlate, camPlate]];
  const cam3t = (t) => { const c = camAt(t, K3), d = 1 - smooth(span(t, tZ0 - .3, tZ0 + .3)); return d > 0 && t > tBand ? camDrift(c, t, .5 * d * smooth(span(t, tBand, tBand + 1)), 9) : c; };

  return (ctx, t) => {
    if (t >= tPlate) { S.plateSlit(ctx, t, a.T0); return; }
    if (t < tCut) return w1(ctx, t);
    if (t < tBand) w2(ctx, t);
    if (t >= tFl0) w3(ctx, t);
  };

  // ================================================================================================================= W1
  function w1(ctx, t) {
    const c = cam1(t);
    const twitch = Math.exp(-((t - a.popW - .12) ** 2) / .03);
    const shake = smooth(span(t, a.soWhat + .3, a.money + .3)), thin = smooth(span(t, a.money, a.out + .3)) * (1 - smooth(span(t, a.before - .7, a.before - .1)));
    const dcLum = .72 + .5 * smooth(span(t, a.soWhat, a.superI + .8)) + .06 * Math.sin(t * 1.3);
    // sky
    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.5, P.night1], [1, P.ind0]], -900, H + 200);
      ctx.fillStyle = E.rad(ctx, 1380, 340, 1300, [[0, rgba(P.ind1, .9)], [.5, rgba(P.ind1, .4)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-W, -2 * H, 3 * W, 4 * H);
      E.stars(ctx, 13, 210, t, [-400, -900, W + 800, H + 500], .8);
    });
    // far hills (left, like the thumbnail) and the plain
    card(ctx, c, 9000, () => {
      E.ground(ctx, [[-900, 840], [-200, 800], [300, 770], [760, 820], [1300, 850], [2900, 846]], { stops: [[0, P.ind1], [1, P.night1]], rim: rgba(P.blue0, .5), rimW: 2 });
    });
    card(ctx, c, F0, () => {
      // the ground
      ctx.fillStyle = E.lin(ctx, 0, DC.y - 4, 0, DC.y + 600, [[0, mixHex(P.ind1, P.night1, .4)], [.4, P.night1], [1, P.night0]]); ctx.fillRect(-1500, DC.y - 4, 5000, 1400);
      ctx.fillStyle = rgba(P.blue0, .35); ctx.fillRect(-1500, DC.y - 4, 5000, 2);
      // the bubble (THE light)
      B.bubble(ctx, BUB.x, BUB.y, BUB.r, t, { tremble: clamp(.5 * twitch + .8 * shake), thin, detach: t >= tDet ? DET : null });
      // the data center, the gate, the people who build it
      B.dataCenter(ctx, DC.x, DC.y, DC.w, DC.h, t, { lum: dcLum, gate: DC.gate });
      const lookUp = smooth(span(t, a.saying - .15, a.saying + .7));
      WORKERS.forEach(([x, y, h, dir, sd], i) => B.worker(ctx, x, y, h, t, { dir, seed: sd, look: i === 1 ? .9 * lookUp : .12 + .1 * Math.sin(t * .4 + i) }));
      // you, small, looking up (at the bubble, then at the sky where the quote and the chart are)
      const br = .5 + .5 * Math.sin(t * 1.5), lk = .65 + .2 * smooth(span(t, a.asked, a.asked + 1.5));
      E.castShadow(ctx, DU1.x, DU1.y + 1, 22, 90, Math.PI * .1, .45);
      E.du(ctx, DU1.x, DU1.y, DU1.h, { dir: 1, look: lk + .03 * Math.sin(t * .6), light: 1, armR: [.14 + .03 * br, .08], armL: [-.15 - .02 * br, -.07] });
      quote(ctx, t);
      chart(ctx, t);
    });
    // the leaving note: loosens, flies at the camera, turns over (the flip): its back is the share of 1845
    if (t >= tDet) flight(ctx, t);
  }

  function quote(ctx, t) {
    if (t < a.altman - .2 || t > a.butM + 3) return;
    // the gold strand leaves the bubble's rim and draws the rule over the quote (then retracts when the chart comes)
    const rim = [BUB.x + BUB.r * Math.cos(Math.PI * 1.14), BUB.y + BUB.r * Math.sin(Math.PI * 1.14)];
    const path = E.catmull([[rim[0], rim[1], 3], [rim[0] - 60, Q.rule - 34, 3], [1000, Q.rule, 3], [600, Q.rule, 3], [Q.x, Q.rule, 3]], 12);
    const head = smooth(span(t, a.altman + .1, a.asked + .2)), tail = .42 * smooth(span(t, a.asked - .2, a.asked + 1)) + .58 * expoIn(span(t, a.butM - .2, a.butM + .5));
    if (head > tail) K.trailSpan(ctx, path, tail, head, { w: 2.2, spark: head < 1 });
    const sink = (k) => 1 - expoIn(span(t, a.butM - .15 + k * .07, a.butM + .35 + k * .07));
    const sinkYes = 1 - expoIn(span(t, a.butM + .75, a.butM + 1.25));
    const u1 = rise(span(t, a.asked - .1, a.asked + .9)) * sink(0), u2 = rise(span(t, a.asked + .35, a.asked + 1.35)) * sink(1);
    if (u1 > 0) K.maskLine(ctx, [['“' + Q1, 0]], Q.x - 18, Q.l1, Q.s, u1);
    if (u2 > 0) K.maskLine(ctx, [[Q2, 0]], Q.x, Q.l2, Q.s, u2);
    const uy = rise(span(t, a.myop - .1, a.myop + .9)) * sinkYes, warm = smooth(span(t, a.yes - .05, a.yes + .45));
    if (uy > 0) K.maskLine(ctx, [['My opinion is ', 0], ['yes.”', warm]], Q.x, Q.yes, Q.sYes, uy);
    const us = rise(span(t, a.answer - .05, a.answer + .9)) * sink(2);
    if (us > 0) K.maskLine(ctx, [[QS, 0]], Q.x + 2, Q.src, 26, us, { serif: false, col: P.halo2, glow: false });
  }

  function chart(ctx, t) {
    if (t < a.butM || t > a.before + 1.2) return;
    // the axis grows from the baseline of "My opinion is yes." (the answer line sinks into it)
    const ax = smooth(span(t, a.butM + .25, a.butM + 1.4));
    B.inkLine(ctx, [[AX.x0, AX.y], [AX.x1, AX.y]], ax, { col: COL.paper1, w: 2, a: .55 });
    // MONEY (paper): wobbles, then dips on "Not even a little"; later it runs on into the bubble's skin
    const dip = smooth(span(t, a.notEven - .1, a.notEven + .7));
    const mpts = []; for (let i = 0; i <= 50; i++) { const k = i / 50, x = lerp(AX.x0, AX.x1 - 20, k); mpts.push([x, 372 - 40 * k + 14 * Math.sin(k * 23) + 9 * Math.sin(k * 41 + 1) + dip * 74 * smooth(span(k, .55, 1))]); }
    const mx = smooth(span(t, a.butM + .5, a.notEven + .5));
    const mHead = B.inkLine(ctx, mpts, mx, { col: COL.paper0, w: 4, glow: .5, head: 1, headCol: P.halo1 });
    // CAPABILITY (machine cool): climbs, passes money, and on "speeding up" bends up out of the frame
    const cpts = []; for (let i = 0; i <= 60; i++) { const k = i / 60, x = lerp(AX.x0, 930, k); cpts.push([x, 440 - 170 * k - 700 * Math.pow(k, 7)]); }
    const cu = .78 * smooth(span(t, a.butM + 1.1, a.notEven + 1.0)) + .22 * expoIn(span(t, a.speeding - .25, a.speeding + .55));
    B.inkLine(ctx, cpts, cu, { col: COL.cool, w: 4.5, glow: 1, head: 1, headCol: COL.cool2, headCore: COL.cool });
    // labels rise from their baselines once the lines are there; the source sits under the axis
    const lm = rise(span(t, a.butM + 1.6, a.butM + 2.5)), lc = rise(span(t, a.notEven + .2, a.notEven + 1.1)), ls = rise(span(t, a.speeding + .2, a.speeding + 1.1));
    if (lm > 0) K.maskLine(ctx, [['MONEY', 0]], 470, 302, 28, lm, { serif: false, col: COL.paper0, glow: false });
    if (lc > 0) K.maskLine(ctx, [['CAPABILITY', 0]], 560, 236, 28, lc, { serif: false, col: COL.cool, glow: false });
    if (ls > 0) {
      K.maskLine(ctx, [['TASK LENGTH IT HANDLES ALONE · DOUBLES EVERY FEW MONTHS', 0]], AX.x0, AX.y + 46, 22, ls, { serif: false, col: P.halo2, glow: false });
      K.maskLine(ctx, [['SOURCE: METR', 0]], AX.x0, AX.y + 78, 20, ls, { serif: false, col: rgba(P.halo2, .7), glow: false });
    }
    // "So what happens…": the money line runs on, up into the bubble's skin (money = the bubble)
    const ext = smooth(span(t, a.soWhat - .1, a.superI + .6));
    if (ext > 0 && mHead) {
      const end = mpts[mpts.length - 1], rim = [BUB.x - BUB.r * .985, BUB.y + 40];
      B.inkLine(ctx, E.catmull([[end[0], end[1], 4], [end[0] + 40, end[1] - 30, 4], [rim[0] - 10, rim[1] + 30, 4], [rim[0] + 2, rim[1], 4]], 10), ext, { col: COL.paper0, w: 4, glow: .5, head: 1, headCol: P.halo1 });
    }
  }

  function flight(ctx, t) {
    const cf = camAt(t, KF);
    const u = sineIO(span(t, tFlip0, tFlip1)), rot = lerp(leaver.rot, CERT.rot, smooth(span(t, tDet, tFlip1))) + .35 * Math.sin(Math.PI * smooth(span(t, tDet, tFlip1)));
    const sx0 = lerp(leaver.sx, 1, smooth(span(t, tDet, tFlip0)));
    card(ctx, cf, F0, (k) => {
      // the note's own light on the night as it comes close
      const near = smooth(span(t, tDet + .3, tCut)); if (near > 0) E.halo(ctx, CERT.x, CERT.y, CERT.w * 1.1, .25 * near * (1 - near), P.halo1, P.core1);
      B.flip(ctx, u, CERT.x, CERT.y, CERT.w, CERT.w * .5,
        (x, sx) => B.banknote(x, CERT.x, CERT.y, CERT.w, rot, { sx: sx * sx0, glow: 1 - near, lum: lerp(.78 + .22 * leaver.z, 1, near), a: lerp(.86 + .14 * leaver.z, 1, smooth(span(t, tDet, tDet + .4))) }),
        (x, sx) => B.certificate(x, CERT.x, CERT.y, CERT.w, rot, { sx }));
    });
  }

  // ================================================================================================================= W2
  function w2(ctx, t) {
    const c = cam2(t);
    card(ctx, c, F0, () => {
      table(ctx, t);
      B.newspaper(ctx, NEWS.x, NEWS.y, NEWS.w, NEWS.h, { mast: 'THE GLASGOW ARGUS', date: 'OCTOBER 1845', open: [0, .78, 1, 1], lx: NEWS.x + NEWS.w * .3, ly: NEWS.y + NEWS.h * .3 });
      // the teacup (the rumble of the new machine)
      B.teacup(ctx, CUP.x, CUP.y, CUP.r, t, { ripple: smooth(span(t, a.machineW - .1, a.machineW + .3)) * (1 - smooth(span(t, a.burst + 1, a.burst + 2.5))) });
      // the purse gives its coins to the share ("savings")
      const pf = 1 - .55 * smooth(span(t, a.savings - .1, a.savings + 1.2));
      B.purse(ctx, PURSE.x, PURSE.y, PURSE.s, { full: pf, open: smooth(span(t, a.savings - .3, a.savings + .2)), rot: PURSE.rot });
      share(ctx, t);
      paper(ctx, t);
      locomotive(ctx, t);
    });
  }

  function table(ctx, t) {
    // dark table, the gas lamp's pool (the hero light) on the share, a second softer pool on the newspaper
    ctx.fillStyle = E.lin(ctx, -600, 0, 3200, 0, [[0, P.night0], [.5, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]); ctx.fillRect(-1200, -800, 4600, 2800);
    ctx.save(); ctx.strokeStyle = rgba(P.ind1, .35); ctx.lineWidth = 3;
    for (const [x, y, l, ph] of GRAIN) { ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + l * .3, y + 6 * Math.sin(ph), x + l * .7, y - 5 * Math.cos(ph), x + l, y + 3); ctx.stroke(); }
    ctx.restore();
    const fl = 1 + .025 * Math.sin(t * 7.3) * Math.sin(t * 2.1);       // gas light breathes
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, 640, 380, 1150 * fl, [[0, rgba(P.halo1, .5)], [.3, rgba(P.shade0, .28)], [.7, rgba(P.shade1, .08)], [1, rgba(P.shade1, 0)]]); ctx.fillRect(-1200, -800, 4600, 2800);
    ctx.fillStyle = E.rad(ctx, 1560, 420, 1000, [[0, rgba(P.halo1, .16)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(-1200, -800, 4600, 2800);
    ctx.restore();
  }

  function share(ctx, t) {
    const burst = t >= a.burst - .05 ? span(t, a.burst - .05, a.burst + 1.4) : 0;
    const glow = smooth(span(t, a.machineW - .15, a.machineW + .4)) * (1 - .4 * smooth(span(t, a.burst + .5, a.wonW)));
    if (burst <= 0) B.certificate(ctx, CERT.x, CERT.y, CERT.w, CERT.rot, { glow });
    // coins slide from the purse onto the share, one after another
    COINS.forEach(([x, y], i) => {
      const u = expoOut(span(t, a.savings + i * .16, a.savings + .7 + i * .16)); if (u <= 0) return;
      const mouth = [PURSE.x + Math.cos(PURSE.rot) * PURSE.s * .55, PURSE.y + Math.sin(PURSE.rot) * PURSE.s * .55];
      let cx = lerp(mouth[0], x, u), cy = lerp(mouth[1], y, u) - 30 * Math.sin(u * Math.PI);
      if (burst > 0) { const d = expoOut(clamp(burst * 2)); cx += (x - CERT.x) * .5 * d; cy += (y - CERT.y) * .6 * d + 40 * d; }
      B.coin(ctx, cx, cy, 15, { lit: .4 * glow });
    });
    if (burst > 0) {
      // the burst: the share tears into confetti from the stamp outward; the stamp (the machine) stays
      const h = CERT.w * .66, cr = Math.cos(CERT.rot), sr = Math.sin(CERT.rot);
      for (const p of CONF) {
        const d = expoOut(clamp((burst - p.dt) * 1.6)), lx = p.u * CERT.w + Math.cos(p.ang) * p.d * d, ly = p.v * h + Math.sin(p.ang) * p.d * d * .8;
        const x = CERT.x + lx * cr - ly * sr, y = CERT.y + lx * sr + ly * cr, sp = p.spin * d + .02 * Math.sin(t * 2 + p.spin);
        ctx.save(); ctx.translate(x, y); ctx.rotate(CERT.rot + sp * .6); ctx.scale(Math.cos(sp) || .05, 1);
        ctx.fillStyle = mixHex(COL.paper0, COL.paper2, 1 - p.lum); ctx.fillRect(-p.pw / 2, -p.ph / 2, p.pw, p.ph);
        ctx.fillStyle = rgba(COL.ink2, .18); ctx.fillRect(-p.pw / 2, -p.ph * .1, p.pw * .7, 1.5);
        ctx.restore();
      }
      // the stamp oval alone (it is the locomotive's frame; it lets go of the loco on "won")
      const sp = [CERT.x + .02 * h * sr, CERT.y - .02 * h * cr], keep = 1 - smooth(span(t, a.wonW, a.wonW + .8));
      ctx.save(); ctx.translate(sp[0], sp[1] - h * .02); ctx.rotate(CERT.rot);
      const ow = CERT.w * .19, oh = h * .19;
      B.paperFill(ctx, ((p) => (p.ellipse(0, 0, ow, oh, 0, 0, Math.PI * 2), p))(new Path2D()), { lum: 1, a: keep });
      ctx.strokeStyle = rgba(COL.ink2, .6 * keep); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(0, 0, CERT.w * .17, h * .17, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  }

  function locomotive(ctx, t) {
    // the stamp's printed locomotive comes alive on "won" (ink → indigo, the lamp lights, steam) and charges right across the table
    if (t < a.burst - .05) return;
    const h = CERT.w * .66, sp = [CERT.x + .02 * h * Math.sin(CERT.rot), CERT.y - .02 * h * Math.cos(CERT.rot)];
    const live = smooth(span(t, a.wonW - .1, a.wonW + .6)), grow = expoOut(span(t, a.wonW - .1, a.wonW + .7));
    const run = span(t, a.wonW + .5, a.best + 3.6), x = sp[0] + 1900 * (run * run * .55 + .45 * smooth(run) * run);
    const lh = lerp(CERT.w * .1, 128, grow);
    B.loco(ctx, x, sp[1] + h * .1 + 30 * grow, lh, t, { ink: 1 - live, steam: live, spin: (x - sp[0]) * 2, beam: live * .8, lamp: live });
  }

  function paper(ctx, t) {
    // 1.09: the writer's hand underlines a line of the leader column (no quote: Mackay is paraphrased)
    const tq0 = a.paperP - .35, tu0 = a.news, tu1 = a.news + 1.5, tq1 = tu1 + 1.2;
    const ul = sineIO(span(t, tu0, tu1));
    if (ul > 0) B.inkLine(ctx, [[UL.x0, UL.y], [UL.x1, UL.y]], ul, { col: COL.ink, w: 3 });
    if (t > tq0 && t < tq1) {
      const inn = expoOut(span(t, tq0, tu0)), outq = expoIn(span(t, tu1 + .1, tq1));
      const nib = [lerp(UL.x0, UL.x1, ul), UL.y - 2], off = [700 * (1 - inn) + 600 * outq, -520 * (1 - inn) - 420 * outq];
      B.quill(ctx, nib[0] + off[0], nib[1] + off[1], t, { s: 95, lift: outq });
    }
    // 1.10: the crash: the underline plunges over the column edge (jagged, like a falling index) and lands among the purses
    const cu = expoIn(span(t, a.crash - .05, a.crash + .5));
    if (cu > 0) B.inkLine(ctx, CRASH, cu, { col: COL.ink, w: 3 });
    const land = cu >= 1 ? Math.exp(-(((t - a.crash - .55) * 3.2) ** 2)) : 0;
    if (land > .02) E.dust(ctx, 1347, 120, LAND[0], LAND[1] - 4, 26, 8, t, .8 * land, COL.ink);
    // the purses on the page: full, they jolt when the line lands, they empty on "lost"
    PURSES.forEach(([x, y, s, r], i) => {
      const empty = smooth(span(t, a.lost - .1 + i * .18, a.lost + .7 + i * .18)), jolt = land * 4 * Math.sin(t * 40 + i);
      B.purse(ctx, x + jolt, y, s, { full: 1 - .92 * empty, rot: r });
    });
    // 1.11: the line runs right through the empty margin (the camera flies after it, into the paper)
    const run = sineIO(span(t, a.paid, tPush1 - .1));
    if (run > 0) B.inkLine(ctx, [[LAND[0], LAND[1]], [NEWS.x + NEWS.w + 40, LAND[1]]], run, { col: COL.ink, w: 3 });
  }

  // ================================================================================================================= W3 (A1)
  function w3(ctx, t) {
    const c = cam3t(t);
    // the ink flood: from the top (sky) and from the bottom (ground); the paper band between them closes into the mist
    const fl = sineIO(span(t, tFl0, tFl1)), bc = sineIO(span(t, tFl1, tBand));
    const yTop = lerp(lerp(-40, HOR - 70, fl), HOR, bc), yBot = lerp(lerp(H + 40, HOR + 64, fl), HOR, bc);
    const edge = (y0, dir) => { const p = new Path2D(); p.moveTo(-50, dir < 0 ? -50 : H + 50); for (let x = -50; x <= W + 50; x += 30) p.lineTo(x, y0 + dir * (7 * Math.sin(x * .011 + t * .8) + 4 * Math.sin(x * .037 + 1))); p.lineTo(W + 50, dir < 0 ? -50 : H + 50); p.closePath(); return p; };
    const open = t < tBand;
    const topClip = edge(yTop, -1), botClip = edge(yBot, 1);
    const layer = (clip, fn) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (open) ctx.clip(clip); fn(); ctx.restore(); };
    // sky (far) + horizon light + mist: in the top clip; ground + rail bed + you: in the bottom clip; the train spans both
    const sky = () => {
      card(ctx, c, 40000, () => {
        E.nightSky(ctx, [[0, P.night0], [.55, P.night1], [.85, P.ind1], [1, mixHex(P.ind1, P.shade1, .3)]], -600, HOR + 40);
        E.stars(ctx, 41, 140, t, [-300, -600, W + 600, HOR + 200], .55 * smooth(span(t, tFl1, tBand + 1.2)));
        ctx.fillStyle = E.rad(ctx, 420, HOR + 30, 1500, [[0, rgba(P.shade0, .55)], [.25, rgba(P.shade1, .3)], [.6, rgba(P.ind1, .12)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);   // the last light of dusk, low on the left
      });
      card(ctx, c, 9000, () => { E.ground(ctx, [[-900, HOR - 8], [100, HOR - 26], [600, HOR - 12], [1300, HOR - 30], [2900, HOR - 6]], { stops: [[0, mixHex(P.ind1, P.night1, .4)], [1, P.night1]], rim: rgba(P.blue0, .35), rimW: 2, bottom: HOR + 60 }); });
    };
    const ground = () => {
      card(ctx, c, F0, () => {
        ctx.fillStyle = E.lin(ctx, 0, HOR, 0, H + 300, [[0, mixHex(P.ind1, P.night1, .5)], [.35, P.night1], [1, P.night0]]); ctx.fillRect(-1500, HOR, 5000, 1200);
      });
    };
    if (open) { layer(topClip, sky); layer(botClip, ground); }
    else { sky(); ground(); }
    // the paper band → mist on the horizon (paper-coloured light: the light of "today")
    const mistA = smooth(span(t, tFl1 - .2, tBand + .3));
    card(ctx, c, 9000, () => { B.mist(ctx, HOR - 6, 46, mistA); B.mist(ctx, HOR - 10, 120, .45 * mistA); });
    // the edges of the wet ink while it spreads
    if (open) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(COL.ink, .7); ctx.lineWidth = 5; ctx.stroke(edgeLine(yTop, -1, t)); ctx.stroke(edgeLine(yBot, 1, t)); ctx.restore(); }
    // the rail: exactly the ink line first (ink 1, same width, same y), then iron with a lit edge, sleepers and bed grow
    const iron = smooth(span(t, tFl1 - .1, tBand + .4)), sl = smooth(span(t, tFl1 + .1, tBand + .9)), bl = smooth(span(t, tFl1, tBand + .5));
    const trainX = lerp(-140, TR.nose, ease5(span(t, tTr0, tTr1)));
    card(ctx, c, F0, () => {
      if (t >= tTr0 - .1) {
        const door = t < tShut0 ? sineIO(span(t, tDoor0, tDoor1)) : lerp(1, TR.slit, sineIO(span(t, tShut0, tShut1)));
        ctx.save();
        if (open) { const m = ctx.getTransform(), cl = new Path2D(); cl.addPath(topClip); cl.addPath(botClip); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clip(cl); ctx.setTransform(m); }
        B.train(ctx, trainX, TR.y, TR.len, TR.h, t, { dir: 1, door, doorX: TR.doorFromNose, speed: (1 - smooth(span(t, tTr0, tTr1))) * .9 });
        ctx.restore();
      }
      if (t >= tPush1) B.rail(ctx, -1400, 3400, HOR - LW / 2, t, { ink: 1 - iron, w: LW, sleepers: sl, ballast: bl, rim: iron });   // takes over the ink line once the push has landed (same y, same width)
      // you: revealed by the ground ink (bottom clip) and the closing band; you catch the falling paper, it turns into your phone
      you(ctx, t, open ? botClip : null);
    });
    // the slit's own life (breathing light, motes) ramps in on the closing door, so the camera lands on plateSlit without a pop
    const kL = smooth(span(t, tPlate - 1.2, tPlate));
    if (kL > 0) { const p = project(c, F0, TR.doorX, TR.doorY); S.slitLife(ctx, p[0], p[1], p[2] / S.PLATE_S, t, kL); }
  }

  function edgeLine(y0, dir, t) {
    const p = new Path2D(); for (let x = -50; x <= W + 50; x += 30) { const y = y0 + dir * (7 * Math.sin(x * .011 + t * .8) + 4 * Math.sin(x * .037 + 1)); x === -50 ? p.moveTo(x, y) : p.lineTo(x, y); } return p;
  }

  function you(ctx, t, clip) {
    const br = .5 + .5 * Math.sin(t * 1.5);
    const catchU = smooth(span(t, tCatch - .9, tCatch)), turn = smooth(span(t, tDoor0 - .2, tDoor1));
    const armR = [lerp(.14 + .03 * br, .95, catchU), lerp(.08, 1.85, catchU)];
    const doorLight = smooth(span(t, tDoor0, tDoor1)) * (1 - smooth(span(t, tShut0, tShut1)));
    ctx.save();
    if (clip) { const m = ctx.getTransform(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clip(clip); ctx.setTransform(m); }
    E.castShadow(ctx, DU3.x, DU3.y + 1, 30, 120 + 120 * doorLight, Math.PI * .08, .45);
    const hands = E.du(ctx, DU3.x, DU3.y, DU3.h, { dir: -1, look: lerp(.35, .05, catchU) + .25 * turn * (1 - catchU * .5), light: -1, back: .4 * doorLight, armR, armL: [-.14 - .02 * br, -.07] });
    ctx.restore();
    // the falling note (from the bubble, high above, out of frame) sways down into your hand; then it flips: your phone
    const hand = hands && hands.R ? hands.R : [DU3.x - 30, DU3.y - DU3.h * .5];
    if (t >= tFall0) {
      const u = span(t, tFall0, tCatch), e = sineIO(u);
      const x = lerp(1520, hand[0], e) + 90 * Math.sin(u * 9) * (1 - e), y = lerp(-80, hand[1] - 6, e * e * .3 + e * .7);
      const rot = .6 * Math.sin(u * 9 + .5) * (1 - e) - .15;
      const fu = sineIO(span(t, tFlip2, tFlip2 + .8)), sx0 = u < 1 ? Math.cos(u * 11) * .6 + .4 * Math.sign(Math.cos(u * 11) || 1) : 1;
      B.flip(ctx, fu, x, y, 46, 30,
        (x2, sx) => B.banknote(x2, x, y, 58, rot, { sx: sx * sx0, glow: .5 }),
        (x2, sx) => { x2.save(); x2.translate(x, y); x2.scale(sx, 1); x2.translate(-x, -y); B.phone(x2, x, y - 8, 48, .12, t, { screen: B.fundScreen(smooth(span(t, tFlip2 + .5, tFlip2 + 1.6)), { label: 'PENSION FUND', value: '' }) }); x2.restore(); });
    }
  }
}
