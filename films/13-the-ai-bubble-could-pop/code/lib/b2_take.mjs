// Film 13 · B2 · c06 + c07 + c08 (257.90 → 439.20) as ONE take. sc06 / sc07 / sc08 each return one entry that draws this take, so the
// internal seams c06|c07 and c07|c08 are continuous by construction (same function, same t). Group seams: S.plateBrick at the start
// (c05|c06, B1 → B2) and S.plateDoor at the end (c08|c09, B2 → B3), both continued / reached at the plate's own push (5 %/s).
//
// PLAN (motion-director gate 2; shots.md c06–c08 translated, deviations listed in the B2 report)
//   Motion DNA: calm editorial night (MOTION.md §1): sine camera, holds 1.5–3 s after each accent, one or two movers, labels rise from
//   their baseline (K.maskLine), the flip as the signature. Through-line of the package: ONE night plane ("Space A") around a frozen
//   lake: the wall becomes the ice, the capability line becomes the moon, the shore becomes the S&P line, a crack leads to YOUR house on
//   the shore; your window, the parsonage and the neighbours' windows are the same night; the windows become bidder cards when the night
//   swallows the shore; the auction hall and the 1844 parchment live in that dark; a dial match brings us back into your kitchen; your
//   window becomes one of fifty; the fifty fall into a fence; one becomes the closed door (plateDoor).
//   Wow moments: c06 = the METR line goes THROUGH the wall (a brick tumbles, light leaks through the joints) · c07 = pull back from your
//   hand with the tiny note to the far bubble · c08 = the 1844 act: roof · seat · penny assemble into the 1d ticket.
//   Transition map (carrier · position · direction):
//     plateBrick → the chip bar falls (centre, down) and lands as the first brick on "wall"
//     wall → ice: the rows flatten into the lake's floes (centre, down); the METR line retracts into its head = the moon (upper right)
//     ice → S&P: the far shore rim lights up as the index line (left → right); the steep falls peel off at the right edge
//     S&P → meter: the Oracle line runs on as a crack to your house's meter (right, the camera follows)
//     meter → kitchen → sky map → bars → phone → ring → note → bubble: one plane, the camera travels (no cut)
//     your window → parsonage → "anyone": the camera trucks along the shore; the neighbours' windows light up
//     windows → bidder cards: the night swallows the shore, the window rects stay and become raised cards (8.01 hall grows round them)
//     LOT tag → paper bars → flow → parchment (the flow line unrolls it) → seal → ticket → many tickets → penny flips → chip seal on a form
//     chip seal → plug → gauge (AEP Ohio) → DIAL MATCH (paper face fills the frame on both sides) → your meter → kitchen → your window
//     is one of 50 → 23 light → they fall into a fence, your window becomes the door → push through the gate → plateDoor.
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import * as B from './bubble_kit.mjs';
import * as S from './bubble_seams.mjs';
import * as G from './b2_kit.mjs';
import * as Hs from './b2_house.mjs';
import * as C7 from './b2_c07.mjs';
import * as C8 from './b2_c08.mjs';
import { createCanvas, Path2D } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, aim, project, F0, drift, prng, halo } = E;
const { COL } = B;
const { rise, ease5, bell } = G;
const quartIOs = (u) => quartIO(u);
const sineL = (u) => sineIO(1 - (1 - u) * (1 - u));   // soft start, long soft landing

let CACHE = null;
export function take(T) {
  if (CACHE && CACHE.T === T) return CACHE;
  E.prepareEditorial();
  const a = anchors(T);
  CACHE = { T, a, draw: makeDraw(a) };
  return CACHE;
}

// ======================================================================================================== anchors (phrases only)
function anchors(T) {
  const a = {}, F = (ph, after) => T.F(ph, after), FE = (ph, after) => T.FE(ph, after);
  a.T0 = F("You'll hear that"); a.T1 = F('Public money can come', a.T0);
  const at = T.seq(a.T0);
  // c06
  a.wallP = at('hitting a wall'); a.wall = F('wall', a.wallP);
  a.something = at("There's something"); a.bigger = at('Bigger models'); a.text = at('Good text data'); a.companies = at('Companies are adopting');
  a.adopting = F('adopting', a.companies); a.slowly = at('more slowly'); a.promised = at('promised');
  a.butA = at('But the abilities'); a.climbing = at('climbing'); a.indep = at('An independent'); a.hours = at('hours of human work');
  a.rightNow = at('Right now'); a.doubles = at('doubles'); a.soWall = at('So the wall'); a.isnt = at("isn't intelligence");
  a.money = at('money, power'); a.power = F('power', a.money + .1); a.debt = F('debt', a.power); a.moneySide = at('And the money side');
  a.cracking = at('cracking'); a.onlyEdges = at('But only at the edges'); a.edges = F('edges', a.onlyEdges);
  a.america = at("America's broad"); a.record = at('near its record'); a.steep = at('The steep falls'); a.coreweave = at('CoreWeave'); a.oracle = at('Oracle');
  a.soIf = at('So if some rails'); a.whoPaid = at('who paid');
  // c07
  a.follow = at('Follow the money'); a.close = at('somewhere close'); a.toYou = at('To you'); a.startBill = at('Start with your power bill');
  a.largest = at("America's largest"); a.pays = at('pays power plants'); a.standBy = at('stand by'); a.inTwo = at('In two years');
  a.tenfold = at('tenfold'); a.watchdog = at('Its watchdog'); a.billions = at('billions'); a.everyone7 = at('everyone else'); a.dcs = at('data centers');
  a.pensionP = at('Then your pension'); a.most = at('Most American'); a.byDefault = at('by default');
  a.five = at('And just five'); a.quarter = at('more than a quarter'); a.global = at('Global funds');
  a.ifYou = at('If you have a savings'); a.piece = at('piece of this bubble'); a.choosing = at('choosing');
  a.backThen = at('Back then'); a.sisters = at('three sisters'); a.railPaper = at('railway paper'); a.today = at('Today'); a.pension2 = at('pension');
  a.whenPops = at('And when it pops'); a.pops = F('pops', a.whenPops); a.whoGets = at('who gets');
  // c08
  a.after = at('After a crash'); a.cheap = at('go cheap'); a.whoever = at('whoever has cash'); a.cash = F('cash', a.whoever);
  a.remember = at('Remember Global Crossing'); a.gc = F('Global', a.remember); a.taken = at('Taken over'); a.sliver = at('sliver');
  a.consp = at("That isn't a conspiracy"); a.fire = at('fire sales'); a.leftAlone = at('Left alone'); a.everyone8 = at('everyone');
  a.but1844 = at('But in eighteen'); a.e1844 = F('eighteen', a.but1844); a.parliament = at('Parliament'); a.law = at('law');
  a.everyLine = at('Every new line'); a.weekday = at('every weekday'); a.roof = at('roof'); a.seat = at('seat'); a.penny = at('penny a mile');
  a.people = at('People called them'); a.parl = at('parliamentary trains'); a.ride = at('A ride on'); a.forEveryone = at('for everyone');
  a.soWhat = at('So what would'); a.pennyTrain = at('penny train of superintelligence');
  a.backThen2 = at('Back then'); a.condition = at('condition of running'); a.todays = at("Today's data centers"); a.conditions = at('conditions too');
  a.ohio = at('In parts of Ohio'); a.mostPower = at('most of the power'); a.forYears = at('For years'); a.never = at('never use it');
  a.soIfB = at('So if the bubble pops'); a.dc8 = at('data center'); a.kitchen = at('kitchen'); a.many = at('Many other states');
  a.similar = at('similar rules'); a.eachWay = F('each way', a.weekday); a.ohioW = F('Ohio', a.ohio); a.protects = at('protects your bill'); a.butPublic = at('But what about'); a.publicBuilds = at('public money builds');
  return a;
}

// ======================================================================================================== camera (Space A, focus form)
// keys [[t, {u, v, s, sx, sy}, ease]] → focus; z (scale) interpolated in log; then a calm drift on top (never two identical frames)
function focusPath(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  // optional 4th entry k (0..1]: the move takes only k of its segment (starts later, lands a little earlier) -> longer holds, fewer moving
  // frames (calm.py mafd), same path and keys (round 3)
  const A = K[i][1], Bk = K[i + 1][1], e = K[i + 1][2] || sineIO, k = K[i + 1][3] || 1, t0 = K[i][0], t1 = K[i + 1][0], D = t1 - t0;
  const u = e(span(t, t0 + (1 - k) * D * .6, t1 - (1 - k) * D * .4));
  return { u: lerp(A.u, Bk.u, u), v: lerp(A.v, Bk.v, u), s: Math.exp(lerp(Math.log(A.s), Math.log(Bk.s), u)), sx: lerp(A.sx ?? W / 2, Bk.sx ?? W / 2, u), sy: lerp(A.sy ?? H / 2, Bk.sy ?? H / 2, u) };
}
const fk = (u, v, s, sx = W / 2, sy = H / 2) => ({ u, v, s, sx, sy });
// two keys rewritten about their common fixed point p (screen sx + (p - u)·s equal in both), so the move between them is a pure zoom
function pivotKeys([tA_, A, eA, kA], [tB_, B, eB, kB], m = 1) {   // m: the push factor the key scales get later (exact screen offsets)
  const px = (A.u * A.s - B.u * B.s) / (A.s - B.s), py = (A.v * A.s - B.v * B.s) / (A.s - B.s);
  const sx = A.sx + (px - A.u) * A.s * m, sy = A.sy + (py - A.v) * A.s * m;
  return [[tA_, fk(px, py, A.s, sx, sy), eA, kA], [tB_, fk(px, py, B.s, sx, sy), eB, kB]];
}
const toCam = (f) => aim(F0, f.u, f.v, f.s, f.sx, f.sy);

// ======================================================================================================== the take
function makeDraw(a) {
  const T0 = a.T0, tA = T0 + S.SEAM_HALF, T1 = a.T1, tPlate = T1 - S.SEAM_HALF;
  // ---- the plate push, continued: the log-zoom rate is 5 %/s at tA and decays (τ) — no stop at the seam
  const TAU = 2.6, Z0 = S.plateZoom(tA, T0), PINF = Z0 * Math.exp(S.PLATE_PUSH * TAU);
  const push = (t) => Z0 * Math.exp(S.PLATE_PUSH * TAU * (1 - Math.exp(-Math.max(0, t - tA) / TAU)));
  const P1 = (s) => s / PINF;   // key scale → total scale s once the push has settled

  // ---- c06 times
  const tFall0 = a.wall - .5, tLand0 = a.wall + .02;                 // the chip bar drops and lands on "wall"
  const tL1 = a.bigger + .14, tL2 = a.text + .12, tL3 = a.adopting + .05;   // the three limit bricks land
  const tLine0 = a.butA + .02, tIn = a.butA + .72, tOut = a.climbing + .06, tLineEnd = a.indep + 2.4;
  const tFlip = [a.money, a.power, a.debt];
  const tFlat0 = a.moneySide - .55, tFlat1 = a.moneySide + 1.25;
  const tDM = a.dc8 - 1.1, tK = a.kitchen + 1.0, RM = 480;                                              // 8.10 the dial match frame
  const COIN_K = (() => { const cv = createCanvas(8, 8), cx = cv.getContext('2d'); const hnd = E.person(cx, 6000, 1130, 400, { armR: [2.7, 3.0], armL: [-.4, -.5], lanyard: false }); return [hnd.R[0] + 120 * .2 + 120 * .33, hnd.R[1] - 120 * .2 + 120 * .1]; })();
  const KA = [
    [tA, fk(960, 520, 1, 960, 520)],                                  // = the plate: it zooms about (960, 520) on screen
    [a.promised - .1, fk(960, 610, 1, 960, 520)],                     // tilt down with the wall as it grows (bricks fall in from the headroom)
    [a.butA + 1.1, fk(960, 470, P1(.82))],
    [a.soWall - .3, fk(960, 470, P1(.85))],
    [a.isnt + 1.3, fk(960, 650, P1(1.12))],
    [tFlat0 + .1, fk(960, 650, P1(1.14))],
    [a.moneySide + 1.9, fk(1000, 520, P1(.9))],
    [a.record + 1.0, fk(1010, 540, P1(.94))],
    [a.coreweave + 1.3, fk(1540, 680, P1(1.3))],                     // 6.06 drift right and in: the two falls at the lake's edge
    [a.soIf + .75, fk(1610, 692, P1(1.38))],
    [a.whoPaid + 1.4, fk(Hs.METER.x, Hs.METER.y + 10, P1(3.1))],
    [a.follow + 1.6, fk(Hs.METER.x + 4, Hs.METER.y + 12, P1(3.5))],   // a breathing push on the meter (seam 309.24 was FROZEN at 3.25)
    // ---- c07
    [a.toYou + 1.0, fk(2560, 640, P1(1.6)), undefined, .56],                         // 7.01 pull back: the kitchen, you, the lamp
    [a.largest + 1.7, fk(2150, 140, P1(.74)), quartIOs, .48],              // 7.02 follow the cable up-left into the sky: the grid
    [a.standBy + 1.2, fk(2130, 128, P1(.77))],
    [a.tenfold - .45, fk(1790, -290, P1(.95)), undefined, .46],                        // 7.03 the bars
    [a.watchdog + .4, fk(1800, -296, P1(.98))],
    [a.billions + .8, fk(1806, -292, P1(.985))],                      //      ($23 BN rises where the price stood: hold, no move)
    [a.everyone7 + 1.5, fk(2700, 110, P1(.62)), undefined, .56],                      //      the cost flows into the houses
    // 7.04 ONE dive through your window into your phone (round 3: was two moves with a stop at the window): a pure zoom about the
    //      point that stays put on screen, soft start, long landing
    ...pivotKeys([a.pensionP - .1, fk(2720, 120, P1(.64))], [a.byDefault - 2.4, fk(C7.PH.x + 1, C7.PH.y, P1(10.4)), sineL, .55], PINF),
    [a.five + .2, fk(C7.PH.x + 2, C7.PH.y - 1, P1(10.8))],
    [a.quarter - .2, fk(C7.PH.x - 12, C7.PH.y - 6, P1(10.4))],        // 7.05 the ring, MORE THAN ¼ to its right
    [a.global + 2.3, fk(C7.PH.x - 12, C7.PH.y - 6, P1(10.9))],
    // 7.06 the note lands in your hand → ★ pull back: your window, the far bubble. Both keys are written about the one point that
    //      stays put on screen (pivot), so the pull-back is a pure zoom out: no sideways lurch while the scale is still large.
    ...pivotKeys([a.piece + .25, fk(2546, 694, P1(6.6)), undefined, .6], [a.choosing + 1.5, fk(3300, 200, P1(.45)), undefined, .66]),
    [a.sisters + .45, fk(C7.PARS.win[0] + 160, 652, P1(1.85)), undefined, .75],       // 7.07 the parsonage window
    [a.today - .05, fk(C7.PARS.win[0] + 164, 654, P1(1.97))],
    [a.pension2 + .45, fk(4560, 330, P1(.52)), undefined, .58],                       //      anyone with a pension
    [a.whoGets + .3, fk(4660, 360, P1(.6))],                          // 7.08 the windows lift as cards
    // ---- c08
    [a.after + 1.7, fk(C8.HC.x, 560, P1(.95))],                       // 8.01 the hall
    [a.cash + .7, fk(C8.HC.x + 10, 566, P1(1.0))],
    [a.gc + .95, fk(5600, 640, P1(1.0)), undefined, .62],                             // 8.02 Global Crossing
    [a.sliver + 1.2, fk(5610, 642, P1(1.03))],
    [a.fire + .6, fk(6000, 660, P1(.95)), undefined, .62],                            // 8.03 the flow
    [a.everyone8 + .5, fk(6010, 662, P1(.97))],
    [a.e1844 + 1.4, fk(6000, 560, P1(1.0)), undefined, .75],                          // 8.04 the parchment
    [a.law + .8, fk(6000, 562, P1(1.03))],
    [a.roof - .5, fk(6000, 600, P1(1.05))],                           // 8.05 the words, the signs
    [a.penny + 1.6, fk(6000, 640, P1(1.0))],                          //      the ticket
    [a.parl + .5, fk(6000, 600, P1(.98))],                            // 8.06 the crowd
    // 8.07 into the coin → chip, and (8.08) back out: both pure zooms about their fixed point (no sideways sweep at high scale)
    ...pivotKeys([a.forEveryone + .5, fk(6000, 600, P1(1.0))], [a.pennyTrain + 1.1, fk(COIN_K[0], COIN_K[1], P1(5.0)), undefined, .62]),
    ...pivotKeys([a.backThen2 - .35, fk(COIN_K[0], COIN_K[1], P1(5.4))], [a.condition + 1.0, fk(6000, 560, P1(.9)), undefined, .9]),   // 8.08 parchment · form
    [a.conditions + .7, fk(6030, 560, P1(.92)), undefined, .65],
    [a.ohio + 1.5, fk(7560, 560, P1(.85))],                           // 8.09 Ohio
    [a.soIfB, fk(7545, 556, P1(.88))],
    // (8.10 dial match: see camA)
    [tK, fk(2560, 640, P1(2.2))],                                     // 8.10 your kitchen
    [a.similar + 1.0, fk(2550, 330, P1(.62))],                         // 8.11 fifty envelopes
    [a.butPublic, fk(2550, 338, P1(.64))],
    // (8.12 the push to the door plate: see camA)
  ];
  const fAt = (t) => { const f = focusPath(t, KA); f.s *= push(t); return f; };
  const camA = (t) => {
    let f = fAt(t);
    if (t > a.soIfB && t < tK) {   // 8.10 the DIAL MATCH: into the gauge's face until it fills the frame, then out of your meter's
      const f0 = fAt(a.soIfB), Rg = C8.GAUGE.R, Rk = Hs.METER.R;
      if (t < tDM) { const e = sineIO(span(t, a.soIfB + .3, tDM)); f = { u: lerp(f0.u, C8.GAUGE.x, e), v: lerp(f0.v, C8.GAUGE.y, e), s: Math.exp(lerp(Math.log(Rg * f0.s), Math.log(RM), e)) / Rg, sx: W / 2, sy: H / 2 }; }
      else { const f1 = fAt(tK), e = sineIO(span(t, tDM, tK - .55)), ep = sineIO(span(t, tDM + .5, tK - .3)); f = { u: lerp(Hs.METER.x, f1.u, ep), v: lerp(Hs.METER.y, f1.v, ep), s: Math.exp(lerp(Math.log(RM), Math.log(Rk * f1.s), e)) / Rk, sx: W / 2, sy: H / 2 }; }
    }
    if (t > a.butPublic) {   // 8.12 down with the falling tiles to the fence and its sign, then the push through the gate onto the door plate:
      // Hermite in log-zoom, arriving at s = 1 on the door with the plate's own push (5 %/s)
      const f0 = fAt(a.butPublic), tLow = a.publicBuilds + .25, LOW = { u: 2550, v: 640, s: .6 };
      if (t < tLow) { const e = sineIO(span(t, a.butPublic, tLow)); f = { u: lerp(f0.u, LOW.u, e), v: lerp(f0.v, LOW.v, e), s: Math.exp(lerp(Math.log(f0.s), Math.log(LOW.s), e)), sx: W / 2, sy: H / 2 }; }
      else {
        const D = tPlate - tLow, x = clamp((t - tLow) / D), L0 = Math.log(LOW.s), h01 = -2 * x ** 3 + 3 * x * x, h11 = x ** 3 - x * x, e = sineIO(x);
        f = { u: lerp(LOW.u, 960 + C8.OX, e), v: lerp(LOW.v, 540 + C8.OY, e), s: Math.exp((1 - h01) * L0 + h11 * D * S.PLATE_PUSH), sx: W / 2, sy: H / 2 };
      }
    }
    // landing shake (heavy brick): a short damped bob, small
    const sh = t > tLand0 ? 3 * Math.exp(-(t - tLand0) * 9) * Math.sin((t - tLand0) * 38) : 0;
    const d = smooth(span(t, tA, tA + 2.5)) * (1 - smooth(span(t, tPlate - 2, tPlate - .6)));
    f.u += drift(t * .5, 5 / f.s, 1) * d; f.v += drift(t * .5, 3.5 / f.s, 3) * d - sh / f.s; f.s *= 1 + drift(t * .4, .005, 5) * d;
    return f;
  };

  // the METR line: a straight rise on a log scale (= a constant doubling time), from low left, through the wall, to the moon's place
  const MOON = [1600, 60];
  const lineY = (x) => 576 - .4216 * (x - 376);
  const LINE = []; for (let x = -160; x <= MOON[0] + 1e-6; x += 20) LINE.push([x, lineY(x)]);
  const xAt = (u) => lerp(-160, MOON[0], u);
  const lineU = (t) => {   // drawn share of the line over time (head enters the wall, leaves the top on "climbing", then climbs on slowly)
    const uIn = (140 + 160) / 1760, uOut = (376 + 160) / 1760;
    if (t < tLine0) return 0;
    if (t < tIn) return uIn * sineIO(span(t, tLine0, tIn)) ** .9;
    if (t < tOut) return lerp(uIn, uOut, span(t, tIn, tOut));
    return lerp(uOut, 1, ease5(span(t, tOut, tLineEnd)));
  };


  // ==================================================================================================== Space A
  function spaceA(ctx, t) {
    const f = camA(t), c = toCam(f);
    const flat = smooth(span(t, tFlat0, tFlat1));
    // night (the plate's ground) + stars that come with the lake
    const bgK = smooth(span(t, a.butPublic, tPlate - .25));   // the night of the lake → the night of the door plate
    const lift = smooth(span(t, tA + .4, tLand0 + 2.4)) * (1 - bgK);
    card(ctx, c, F0, () => G.nightFill(ctx, bgK > 0 ? BG_MIX(bgK) : lift > 0 ? BG_LIFT(lift) : G.BG_BRICK, lerp(0, C8.OY, bgK), lerp(H, H + C8.OY, bgK)));
    const starK = smooth(span(t, tFlat0, tFlat1 + 2)) * (1 - smooth(span(t, a.butPublic - .5, tPlate - .6)));
    if (starK > 0) card(ctx, c, 40000, () => E.stars(ctx, 61, 170, t, [-700, -900, W + 1400, H * .95 + 900], .7 * starK));
    card(ctx, c, F0, () => {
      const lake = t < a.whoGets + 2;
      floor(ctx, t, flat);
      if (lake) {
        skyAndShore(ctx, t, flat);
        metr(ctx, t, flat, 'behind');
        wall(ctx, t, flat);
        metr(ctx, t, flat, 'front');
        chart(ctx, t);
      }
      bubble(ctx, t);
      street(ctx, t);
      hall(ctx, t);
      house(ctx, t);
      net(ctx, t);
      ring(ctx, t);
      note(ctx, t);
      explainer(ctx, t);
      ending(ctx, t);
    });
    const ir = smooth(span(t, tDM - .95, tDM - .25)) * (1 - smooth(span(t, tDM + .25, tDM + 1.0)));
    if (ir > 0) {
      const D = t < tDM ? C8.GAUGE : Hs.METER, pr = project(c, F0, D.x, D.y);
      if (pr) {
        const r = D.R * pr[2] * 1.06;
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = E.rad(ctx, pr[0], pr[1], r * 1.6, [[0, rgba(P.night0, 0)], [1 / 1.6, rgba(P.night0, 0)], [1.18 / 1.6, rgba(P.night0, .93 * ir)], [1, rgba(P.night0, .96 * ir)]]);
        ctx.fillRect(0, 0, W, H); ctx.restore();
      }
    }
  }

  // ---------------------------------------------------------------------------------------------- the floor and the shore land
  function floor(ctx, t, flat) {
    const k = smooth(span(t, tLand0 + .2, tLand0 + 2.6)), sw = SW(t);
    if (k <= 0 || sw >= .995) return;
    ctx.save(); ctx.globalAlpha = k;
    ctx.fillStyle = E.lin(ctx, 0, G.GROUND, 0, G.GROUND + 500, [[0, mixHex(mixHex(P.ind2, P.night1, .3), P.night1, sw)], [.3, P.night1], [1, mixHex(P.night0, P.night1, sw)]]); ctx.fillRect(-3000, G.GROUND, 12000, 3000);
    ctx.restore();
    // the axis line of the plate has become the ground line
  }

  // ---------------------------------------------------------------------------------------------- the chip bar → first brick, the wall → the ice
  function wall(ctx, t, flat) {
    // the plate's axis line, now the ground line: it sinks with the brick (follows 60 ms later), then stays as the lit ground edge
    const fallU = (tt) => { const u = span(tt, tFall0, tLand0); return u * u; };
    const lift = 6 * Math.sin(Math.PI * span(t, tFall0 - .2, tFall0)) ;   // anticipation: it rises a hair first
    const axY = lerp(G.BRICK.axisY, G.GROUND, fallU(t - .06));
    const axA = lerp(.35, .55, smooth(span(t, tLand0, tLand0 + .6))) * (1 - flat);
    ctx.strokeStyle = rgba(COL.paper1, axA); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lerp(300, -2000, smooth(span(t, tLand0, tLand0 + 2.5))), axY); ctx.lineTo(lerp(1620, 4000, smooth(span(t, tLand0, tLand0 + 2.5))), axY); ctx.stroke();
    // the plate's cool glow round the bar fades into the night as the bar falls (a light dimming, no shape)
    G.chipGlow(ctx, 960, lerp(G.BRICK.y0, G.ROWY[0], fallU(t)), t, 1 - smooth(span(t, tFall0, tLand0 + 1.2)));
    G.chipLabel(ctx, smooth(span(t, tFall0 - .35, tFall0 + .2)));
    // the bricks: the plain ones grow up from their baseline row by row, outward from the brick that started the row
    const rowStart = [tLand0 + .12, tL2 + .18, tL3 + .18];
    const rowOrigin = [0, -.5, 0];
    for (const b of G.WALL_BRICKS) {
      if (b.r === 0 && b.c === 0) continue;                                       // the chip brick
      if ((b.r === 1 && (b.c === -1 || b.c === 0)) || (b.r === 2 && b.c === 0)) continue;   // the limit bricks
      const g = smooth(span(t, rowStart[b.r] + .11 * Math.abs(b.c - rowOrigin[b.r]), rowStart[b.r] + .11 * Math.abs(b.c - rowOrigin[b.r]) + .42));
      if (g <= 0) continue;
      if (knocked(b) && t > tOut) { knockedBrick(ctx, t, b, flat); continue; }
      brickAt(ctx, t, b, flat, g, (x, y, w, h) => G.plainBrick(ctx, x, y, w, h));
    }
    // the chip brick (falls from the plate's place)
    const cb = { r: 0, c: 0, x: G.BRICK.x0, y: G.ROWY[0] };
    if (t < tLand0) {
      const y = lerp(G.BRICK.y0, G.ROWY[0], fallU(t)) - lift;
      G.chipBar(ctx, G.BRICK.x0, y, G.BW, G.BH, t);
    } else {
      const sq = 1 - .04 * Math.exp(-(((t - tLand0) / .06) ** 2));
      brickAt(ctx, t, cb, flat, 1, (x, y, w, h) => G.chipBar(ctx, x, y + h * (1 - sq), w, h * sq, t), G.BRICK_COLS.chip);
      landDust(ctx, t, tLand0, 960, G.GROUND);
    }
    // the three limit bricks fall in from above, land in the beat of their words, then (6.04) flip: MONEY · POWER · DEBT
    LIMITS.forEach((L, i) => {
      const tl = [tL1, tL2, tL3][i]; if (t < tl - .55) return;
      const b = { r: L.r, c: L.c, x: G.brickX(L.r, L.c), y: G.ROWY[L.r] };
      const u = span(t, tl - .55, tl), y = t < tl ? lerp(-420, b.y, u * u) : b.y - 2.4 * Math.exp(-(t - tl) * 11) * Math.abs(Math.sin((t - tl) * 26));
      const fu = sineIO(span(t, tFlip[i] - .3, tFlip[i] + .42));
      const draw = (x, yy, w, h, sx = 1) => B.flip(ctx, fu, x + w / 2, yy + h / 2, w, h,
        (cx2, sx2) => G.limitBrick(ctx, x + w / 2, yy + h / 2, sx2, L.l1, L.l2),
        (cx2, sx2) => G.wordBrick(ctx, x + w / 2, yy + h / 2, sx2, L.word, { glow: bell(t, tFlip[i] + .5, .5) * .8, sink: span(t, tFlat0 - .45, tFlat0) }));
      if (t < tl) draw(b.x, y, G.BW, G.BH);
      else { brickAt(ctx, t, b, flat, 1, (x, yy, w, h) => draw(x, yy + (y - b.y), w, h), fu > .5 ? G.BRICK_COLS.paper : G.BRICK_COLS.plain); landDust(ctx, t, tl, b.x + G.BW / 2, b.y + G.BH + 6, .6); }
    });
  }
  const LIMITS = [
    { r: 1, c: -1, l1: 'BIGGER MODELS', word: 'MONEY' },
    { r: 1, c: 0, l1: 'GOOD TEXT DATA', word: 'POWER' },
    { r: 2, c: 0, l1: 'SLOW ADOPTION', word: 'DEBT' },
  ];
  const knocked = (b) => b.r === 2 && b.c === -1;
  // a brick in the wall, or (flat → 1) the floe it becomes; the floes at the lake's ends crack and tilt on "cracking"
  function brickAt(ctx, t, b, flat, g, drawBrick, cols = G.BRICK_COLS.plain) {
    const [y, h] = G.iceY(b.r, flat);
    if (flat <= 0) {
      // a brick that is still growing rises from its baseline (clip from below + slide up)
      ctx.save(); ctx.beginPath(); ctx.rect(b.x - 4, y + h * (1 - g) - 1, G.BW + 8, h * g + 2); ctx.clip();
      drawBrick(b.x, y + h * (1 - g) * .6, G.BW, h);
      ctx.restore(); return;
    }
    // flattening: the brick's own body squashes down into its floe row, its colour cools into ice (one shape, no swap)
    const edge = Math.min(b.x + G.BW / 2 - G.WALL.x0, G.WALL.x1 + 84 - (b.x + G.BW / 2));   // distance to the nearer shore
    const cr = edge < 330 ? smooth(span(t, a.cracking + (edge / 330) * .5 - .1, a.cracking + (edge / 330) * .5 + .9)) : 0;
    const side = (b.x + G.BW / 2) < 960 ? -1 : 1;
    G.iceFloe(ctx, b.x + side * 10 * cr, y + 1 * flat, G.BW, h, { tilt: side * .05 * cr * (1 - edge / 330), sink: 4 * cr, dark: .55 * cr, from: cols, k: 1 - smooth(flat) });
    // the brick's own face dissolves into the floe over the first third of the flattening (no swap frame)
    const keep = 1 - smooth(span(flat, 0, .35));
    if (keep > .002) {
      // (kit draw calls set globalAlpha absolutely, so the face squashes into its floe instead of fading: no pop when it ends)
      ctx.save(); ctx.translate(0, y + flat + h * (1 - keep) / 2); ctx.scale(1, h * keep / G.BH);
      drawBrick(b.x, 0, G.BW, G.BH); ctx.restore();
    }
  }
  function knockedBrick(ctx, t, b, flat) {
    // the line pushes up under its left end: it tips over its right foot, then drops in front of the wall and lands on the ground
    const u = span(t, tOut, tOut + .85), tip = expoOut(clamp(u * 3)) * .5 - smooth(span(u, .35, 1)) * .5;
    const fall = span(u, .3, 1), py = lerp(0, G.GROUND - G.BH - b.y + 4, fall * fall), px = lerp(0, -70, smooth(fall));
    const land = t - (tOut + .85);
    const bob = land > 0 ? 3 * Math.exp(-land * 10) * Math.abs(Math.sin(land * 24)) : 0;
    const sq = 1 - smooth(span(flat, .05, .45));   // it squashes into the dark ground with the wall (as the floes do), no vanishing frame
    if (sq <= .01) return;
    ctx.save(); ctx.translate(b.x + G.BW + px, b.y + G.BH + py - bob); ctx.rotate(tip); ctx.scale(1, sq);
    G.plainBrick(ctx, -G.BW, -G.BH, G.BW, G.BH); ctx.restore();
    if (land > 0) landDust(ctx, t, tOut + .85, b.x + G.BW / 2 - 70, G.GROUND, .7);
  }
  function landDust(ctx, t, tl, x, y, k = 1) {
    const d = t - tl; if (d < 0 || d > 1.2) return;
    const a = (1 - smooth(span(d, .15, 1.2))) * k;
    E.dust(ctx, 1500 + Math.round(x), 70, x, y - 6 - d * 18, 120 + d * 160, 10 + d * 22, t, .55 * a, COL.paper1);
  }

  // ---------------------------------------------------------------------------------------------- the METR line (and the moon it becomes)
  function metr(ctx, t, flat, pass) {
    const u = lineU(t); if (u <= 0) return;
    const ret = smooth(span(t, tFlat0 - .1, tFlat0 + 1.5));   // the tail runs up into the head
    if (pass === 'behind') {
      if (ret < 1) {
        B.inkLine(ctx, LINE, u, { u0: ret * .995, col: COL.cool, w: 4.5, glow: 1, head: u < 1 ? 1 : 0, headCol: COL.cool2, headCore: COL.cool });
        // measured points along it (each lights when the head passes)
        for (const [k, j] of G.DOTS) {
          if (k > u || k < ret) continue; const x = xAt(k), y = lineY(x) + j * 16;
          if (x > 120 && x < 400 && y > 560) continue;   // inside the wall
          const on = smooth(span(u, k, k + .03));
          ctx.fillStyle = rgba(COL.cool, .85 * on); ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.29); ctx.fill();
        }
      }
      // the head at the end: a cool star that becomes the moon
      const mk = smooth(span(t, tLineEnd - 1.4, tLineEnd)), mr = lerp(9, 54, smooth(span(t, tFlat0 + .6, tFlat1 + .8)));
      const set = sineIO(span(t, a.whoPaid + .6, a.follow + 3));
      if (mk > 0 && set < 1) { ctx.save(); ctx.beginPath(); ctx.rect(-2000, -3000, 6000, 3000 + 760); ctx.clip(); G.moon(ctx, MOON[0], MOON[1] + 900 * set, mr, t, mk); ctx.restore(); }
      return;
    }
    // front: the light that leaks through the joints where the line runs inside the wall, and the burst where it breaks out
    if (flat > .3 || t < tIn) return;
    const leak = smooth(span(t, tIn, tOut)) * (.8 + .2 * Math.sin(t * 2.1));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let x = 150; x <= 376; x += 18) {
      const y = lineY(x), inJoint = G.ROWY.some((ry) => Math.abs(y - (ry - 6)) < 10) || G.WALL_BRICKS.some((b) => b.y <= y && y <= b.y + G.BH && Math.abs(x - (b.x + G.BW + 6)) < 9);
      if (!inJoint || x > xAt(lineU(t))) continue;
      E.halo(ctx, x, y, 34, .5 * leak * (1 - smooth(span(flat, 0, .3))), COL.cool2, COL.cool);
    }
    ctx.restore();
    const burst = t > tOut ? Math.exp(-(((t - tOut - .05) / .35) ** 2)) : 0;
    if (burst > .02) E.halo(ctx, 376, 576, 160, .5 * burst, COL.cool2, P.cream);
  }

  // ---------------------------------------------------------------------------------------------- labels of the line, S&P, falls
  function chart(ctx, t) {
    // METR labels (rise on their words, sink when the camera goes back to the wall)
    const sinkL = 1 - smooth(span(t, a.soWall - .2, a.soWall + .4));
    const u1 = rise(span(t, a.hours - .1, a.hours + .7)) * sinkL, u2 = rise(span(t, a.doubles - .1, a.doubles + .7)) * sinkL;
    if (u1 > 0) G.label(ctx, 'TASK LENGTH · HOURS OF HUMAN WORK', 1090, 396, 44, u1, { col: COL.cool });
    if (u2 > 0) G.label(ctx, 'METR · DOUBLES EVERY ~3.5 MONTHS', 1090, 456, 44, u2);
    // S&P 500: the far shore's rim lights up as the index line, left → right, near its record at the right end
    const sp = sineIO(span(t, a.america - .05, a.record + .3)), spOut = smooth(span(t, a.soIf + .3, a.soIf + 2.2));
    if (sp > 0) {
      const pts = G.shoreLine(-60, 1940);
      K.trailSpan(ctx, pts, spOut, sp, { w: 2.6, a: .95, spark: sp < 1 });
      const spL = 1 - smooth(span(t, a.coreweave - .75, a.coreweave - .25));
      const lu = rise(span(t, a.america + .3, a.america + 1.1)) * spL, lr = rise(span(t, a.record - .05, a.record + .7)) * spL;
      if (lu > 0) G.label(ctx, 'S&P 500', 1180, 700, 76, lu, { serif: true, col: P.cream, glow: true });
      if (lr > 0) G.label(ctx, 'NEAR ITS RECORD', 1184, 748, 40, lr);
      const rec = smooth(span(t, a.record - .1, a.record + .5)) * (1 - spOut);
      if (rec > 0) E.halo(ctx, 1940, G.shoreY(1940) - 8, 50, .5 * rec, P.halo1, P.core0);
    }
    // the steep falls: two thin lines peel off the right end and fall into the cracked edge
    const F1 = E.catmull([[1935, 770, 2], [1952, 820, 2], [1962, 900, 2], [1968, 1010, 2]], 8), F2 = E.catmull([[1930, 772, 2], [1975, 800, 2], [2005, 880, 2], [2016, 990, 2]], 8);
    const f1 = expoIn(span(t, a.coreweave - .25, a.coreweave + .35)) * 0 + sineIO(span(t, a.coreweave - .2, a.coreweave + .55));
    const f2 = sineIO(span(t, a.oracle - .2, a.oracle + .6));
    const gone = smooth(span(t, a.whoPaid + 2.2, a.whoPaid + 3.2));
    if (f1 > 0 && gone < 1) { B.inkLine(ctx, F1, f1, { u0: 0, col: COL.cool2, w: 3, glow: .6, head: 1, headCol: COL.cool2, headCore: COL.cool }); }
    if (f2 > 0 && gone < 1) { B.inkLine(ctx, F2, f2, { col: COL.cool2, w: 3, glow: .6, head: 1, headCol: COL.cool2, headCore: COL.cool }); }
    const lOut = 1 - smooth(span(t, a.soIf + .55, a.soIf + 1.0));
    const l1 = rise(span(t, a.coreweave - .05, a.coreweave + .6)) * lOut, l2 = rise(span(t, a.oracle - .05, a.oracle + .6)) * lOut;
    if (l1 > 0) G.labelR(ctx, 'COREWEAVE', 1905, 664, 40, l1, { col: COL.cool });
    if (l2 > 0) G.labelR(ctx, 'ORACLE · ≈ −55 % FROM 52-WEEK HIGH', 1905, 714, 40, l2, { col: COL.cool });
    // 6.07: the Oracle line runs on as a crack across the shore, up the house, into the meter
    const cr = sineIO(span(t, a.soIf + .1, a.whoPaid + .05));
    if (cr > 0 && t < a.close + .1) B.inkLine(ctx, CRACK_TO_METER, cr, { u0: sineIO(span(t, a.follow - .1, a.close)), col: COL.cool2, w: 2.6, glow: .7, head: cr < 1 ? 1 : 0, headCol: COL.cool2, headCore: COL.cool });
  }
  const CRACK_TO_METER = E.catmull([[2016, 990], [2090, 985], [2160, 960], [2215, 905], [2236, 830], [2268, 760], [Hs.METER.x - 6, Hs.METER.y + Hs.METER.bh * .62]], 8);

  // ---------------------------------------------------------------------------------------------- the far shore, the ice, the moon's path
  function skyAndShore(ctx, t, flat) {
    const hk = smooth(span(t, tFlat0 + .7, tFlat1 + .6));
    const sw = SW(t);
    G.farShore(ctx, hk, { rim: 1, sw });
    // the land beside the lake (rises with the far shore)
    if (hk > 0 && sw < .995) {
      ctx.save(); ctx.fillStyle = E.lin(ctx, 0, 790, 0, 860, [[0, P.night1], [1, mixHex(mixHex(P.ind2, P.night1, .3), P.night1, sw)]]);
      const lift = (1 - expoOut(hk)) * 60; ctx.beginPath(); ctx.rect(-3000, 790 + lift, 3140, 120); ctx.rect(1984, 790 + lift, 6000, 120); ctx.clip();
      ctx.fillRect(-3000, 790, 12000, 120); ctx.restore();
    }
    // water in the cracks (dark), the moon's glimmer on the ice
    if (flat > .9) G.moonGlimmer(ctx, MOON[0] - 30, 794, 846, t, 1.7 * smooth(span(t, tFlat1 - .2, tFlat1 + 1.2)) * (1 - smooth(span(t, a.whoPaid, a.follow))));
    // the edge cracks (on "cracking", only at the ends; the middle holds)
    for (const [i, x0, x1] of [[0, 150, 430], [1, 1975, 1680]]) {
      const u = sineIO(span(t, a.cracking - .05 + i * .25, a.cracking + .8 + i * .25));
      if (u > 0) G.crack(ctx, G.crackPts(700 + i, x0, 800 + i * 8, x1, 838 - i * 10, 10, 12), u, { w: 3.6 });
    }
  }

  // ---------------------------------------------------------------------------------------------- your house on the right shore
  // ================================================================================================ c07 · the house, the grid, the street
  const SW = (t) => smooth(span(t, a.pops + .3, a.whoGets + 1.6));          // 7.08: the night swallows the shore
  const lampK = (t) => {                                                      // the kitchen lamp: low → on "To you" (a dip first)
    if (t < a.toYou - .14) return .22 + .03 * Math.sin(t * .7);
    if (t < a.toYou - .02) return lerp(.22, .12, span(t, a.toYou - .14, a.toYou - .06));
    return lerp(.12, 1, expoOut(span(t, a.toYou - .02, a.toYou + .5)));
  };
  const liftR = (t) => sineIO(span(t, a.pensionP + .35, a.pensionP + 1.6)) * (1 - .85 * sineIO(span(t, a.five + .25, a.five + 1.05)));
  const liftL = (t) => .5 * sineIO(span(t, a.piece - .9, a.piece - .1));
  const NOTE_AT = [2551, 691];
  function house(ctx, t) {
    const lamp = lampK(t), sw = SW(t);
    Hs.facade(ctx, t, { swallow: sw });
    const lift = liftR(t);
    // the meter's needle: after the dial match it is the gauge's needle, then it sinks back ("not with your kitchen")
    const needle = t < tDM ? .3 + .04 * Math.sin(t * .6) : lerp(needle8(t), .26 + .03 * Math.sin(t * .6), sineIO(span(t, tDM + .4, tDM + 2.2)));
    const rs = { lamp, spin: t * (1.5 + 4 * smooth(span(t, a.whoPaid - .1, a.whoPaid + .8))), needle, env: 1,
      envGlow: bell(t, a.toYou + .4, .45) * .9 + bell(t, a.kitchen + .2, .5) * .5, lift, liftL: liftL(t), look: .1 + .25 * lift,
      band: t >= tDM ? Math.max(.001, needle) : 0, bandCol: P.halo0, faceLum: t >= tDM ? .95 : undefined };
    if (t > a.butPublic - .05) {   // 8.12 your window becomes the closed door of the plate
      const leaf = sineIO(span(t, a.butPublic, a.publicBuilds - .1)), m = sineIO(span(t, a.publicBuilds - .15, a.publicBuilds + .95));
      const W0 = [Hs.WIN.x0, Hs.WIN.y0, Hs.WIN.x1, Hs.WIN.y1], D = [C8.DOORD.x0, C8.DOORD.y0, C8.DOORD.x1, C8.DOORD.y1];
      const r = W0.map((v, i) => lerp(v, D[i], m));
      C8.doorLamp(ctx, t, smooth(span(t, a.butPublic + .3, tPlate - .35)));
      C8.doorParts(ctx, t, r, { frame: m, leaf, lock: span(t, a.publicBuilds + .9, tPlate - .12),
        room: leaf < 1 ? (x0, y0, x1, y1) => { const lw = (x1 - x0) * leaf; Hs.room(ctx, t, { ...rs, clip: [x0 + lw, y0, x1, y1] }); } : null });
      C8.doorDust(ctx, t, smooth(span(t, a.publicBuilds, tPlate - .3)));
      return;
    }
    Hs.room(ctx, t, rs);
    // the phone comes up out of the table's shadow in your right hand
    if (lift > .01 && t < a.ifYou + 1) {
      const x = lerp(2499, C7.PH.x, lift), y = lerp(752, C7.PH.y, lift);
      ctx.save(); ctx.beginPath(); ctx.rect(Hs.WIN.x0, Hs.WIN.y0, Hs.WIN.x1 - Hs.WIN.x0, Hs.TABLE.yf - Hs.WIN.y0); ctx.clip();
      B.phone(ctx, x, y, C7.PH.h, lerp(.25, 0, lift), t, { lum: .85, screen: C7.phoneScreen({ ring: 1 - smooth(span(t, a.five - .15, a.five + .1)), check: smooth(span(t, a.byDefault - .05, a.byDefault + .4)) }) });
      ctx.restore();
    }
    // the meter's cable that becomes the grid line (7.02) is drawn by net()
  }

  // ---- 7.02 · 7.03 the grid in the sky
  const tP = a.largest - .1 + .705 * 1.05;
  const netRet = (t) => sineIO(span(t, a.pensionP + .5, a.pensionP + 1.9));
  function net(ctx, t) {
    if (t < a.startBill || t > a.pensionP + 2.2) return;
    const ret = netRet(t);
    const cableU = sineIO(span(t, a.startBill + .1, a.largest - .05)) * (1 - sineIO(span(t, a.pensionP + 1.0, a.pensionP + 1.9)));
    const trunkU = sineIO(span(t, a.largest - .1, a.largest + .95)) * (1 - ret);
    const dU = sineIO(span(t, a.largest + .35, a.largest + 1.55)) * (1 - ret);
    const glow = smooth(span(t, a.standBy - .15, a.standBy + .5)) * (.8 + .2 * Math.sin(t * 2.4));
    const plantK = rise(span(t, tP - .05, tP + .6)) * (1 - smooth(span(t, a.pensionP + .55, a.pensionP + 1.0)));
    const dcK = rise(span(t, a.largest + 1.15, a.largest + 1.8)) * (1 - smooth(span(t, a.pensionP + .5, a.pensionP + .95)));
    const dcLum = .5 + .6 * smooth(span(t, a.dcs - .1, a.dcs + .5));
    C7.plant(ctx, t, plantK, glow);
    C7.dcGlyph(ctx, t, dcK, dcLum);
    const line = { col: COL.paper1, w: 3, glow: .5, headCol: P.halo1, headCore: P.core0 };
    if (trunkU > 0) B.inkLine(ctx, C7.TRUNK, trunkU, { ...line, head: trunkU < .999 ? 1 : 0 });
    if (dU > 0) B.inkLine(ctx, C7.DBRANCH, dU, { ...line, col: COL.cool2, headCol: COL.cool2, headCore: COL.cool, head: dU < .999 ? 1 : 0 });
    if (cableU > 0) B.inkLine(ctx, C7.CABLE, cableU, { ...line, col: P.halo1, head: cableU < .999 ? 1 : 0 });
    // bus to the neighbours ("everyone else")
    const busU = sineIO(span(t, a.everyone7 - .3, a.everyone7 + .7)) * (1 - ret);
    if (busU > 0) {
      B.inkLine(ctx, C7.BUS, busU, { ...line, col: P.halo1, head: busU < .999 ? 1 : 0 });
      C7.DROPS.forEach(([x, y0, x1, y1], i) => { const u = sineIO(span(t, a.everyone7 + .25 + .15 * i, a.everyone7 + .75 + .15 * i)) * (1 - ret); if (u > 0) B.inkLine(ctx, [[x, y0], [x1, y1]], u, { ...line, col: P.halo1, head: 0 }); });
    }
    // the cost: points of light run from the data center through the junction into the houses
    flowDots(ctx, t);
    // labels
    const pjm = rise(span(t, a.largest + .5, a.largest + 1.2)) * (1 - smooth(span(t, a.inTwo - .35, a.inTwo + .15)));
    if (pjm > 0) { G.label(ctx, 'PJM', 1250, -4, 46, pjm); G.label(ctx, "AMERICA'S LARGEST POWER MARKET", 1250, 54, 46, pjm); }
    // bars
    const out = 1 - sineIO(span(t, a.watchdog + .15, a.watchdog + .85));
    const k1 = expoOut(span(t, a.inTwo + .15, a.inTwo + .9)) * out, k2 = sineIO(span(t, a.tenfold - 1.0, a.tenfold + .08)) * out;
    C7.bars(ctx, t, k1, k2, bell(t, a.tenfold + .3, .5));
    const lo = 1 - smooth(span(t, a.watchdog + .05, a.watchdog + .55));
    const B1 = C7.BAR.x1 + C7.BAR.w / 2, B2 = C7.BAR.x2 + C7.BAR.w / 2;
    G.label(ctx, '$29', B1, C7.BAR.y - C7.BAR.h1 - 22, 72, rise(span(t, a.inTwo + .6, a.inTwo + 1.3)) * lo, { serif: true, col: P.cream, align: 'center' });
    G.label(ctx, '2024/25', B1, 2, 44, rise(span(t, a.inTwo + .35, a.inTwo + 1.0)) * lo, { align: 'center' });
    G.label(ctx, '2026/27', B2, 2, 44, rise(span(t, a.tenfold - .9, a.tenfold - .3)) * lo, { align: 'center' });
    G.label(ctx, '$329', B2, C7.BAR.y - C7.BAR.h2 - 30, 165, rise(span(t, a.tenfold - .05, a.tenfold + .55)) * lo, { serif: true, col: P.cream, align: 'center', glow: true });
    G.label(ctx, 'PER MW-DAY · CAPACITY PRICE', B2 + 110, C7.BAR.y - C7.BAR.h2 + 100, 44, rise(span(t, a.tenfold + .6, a.tenfold + 1.3)) * lo);
    // the watchdog's number rolls up where the price stood
    const nk = rise(span(t, a.billions - .15, a.billions + .5)) * (1 - smooth(span(t, a.pensionP - .45, a.pensionP + .05)));
    if (nk > 0) {
      const v = Math.round(lerp(1, 23, expoOut(span(t, a.billions - .1, a.billions + .95))));
      G.label(ctx, `$${v} BN`, 1840, -250, 200, nk, { serif: true, col: P.cream, align: 'center', glow: true });
      G.label(ctx, 'PJM MARKET MONITOR', 1840, -168, 50, rise(span(t, a.billions + .5, a.billions + 1.2)) * (1 - smooth(span(t, a.pensionP - .5, a.pensionP))), { align: 'center' });
    }
  }
  // the flow of cost: dots spawn at the data center and run DC → J → down the cable into your meter; at Q some turn onto the bus
  const PATH_A = C7.DBRANCH.slice().reverse().concat(C7.CABLE.slice().reverse());
  const PATH_B = (() => { const out = C7.DBRANCH.slice().reverse(); const cr = C7.CABLE.slice().reverse(); for (const p of cr) { out.push(p); if (p[1] >= C7.NET.Q[1] - 1) break; } return out; })();
  const polyAt = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return (d) => { if (d <= 0) return pts[0]; let i = 1; while (i < pts.length - 1 && L[i] < d) i++; const f = clamp((d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), L[L.length - 1]]; }; };
  const atA = polyAt(PATH_A), atB = polyAt(PATH_B.concat([[3180, 150], [3180, 322]])), atC = polyAt(PATH_B.concat([[3550, 150], [3550, 330]]));
  function flowDots(ctx, t) {
    const t0 = a.everyone7 - .5, t1 = a.pensionP + .2, v = 760;
    for (const [at, dt, off] of [[atA, .2, 0], [atB, .34, .1], [atC, .34, .23]]) {
      const L = at(1e9)[2];
      for (let ts = t0 + off; ts < t1; ts += dt) {
        const d = (t - ts) * v; if (d < 0 || d > L) continue;
        const [x, y] = at(d), arr = smooth(span(d, L - 120, L));
        const col = mixHex(COL.cool, P.halo0, smooth(span(d, L * .35, L * .7)));
        halo(ctx, x, y, 22, .35 * (1 - arr), col, col);
        ctx.fillStyle = rgba(col, .95 * (1 - arr)); ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 6.29); ctx.fill();
      }
    }
  }

  // ---- 7.05 · 7.06 the index ring, the note
  const DOTS7 = (() => { const r = prng(707), out = []; for (let i = 0; i < 7; i++) out.push({ q: -Math.PI / 2 + (.02 + r() * .23) * Math.PI * 2, t: i * .17 + r() * .06, end: .2 + r() * .3 }); return out; })();
  function ring(ctx, t) {
    if (t < a.five - .15 || t > a.ifYou + 1.6) return;
    const k = span(t, a.five - .15, a.five + 1.2), ret = sineIO(span(t, a.ifYou + .1, a.ifYou + 1.25));
    const seg = C7.SEGS.map((_, i) => smooth(span(t, a.five + .55 + .17 * i, a.five + .95 + .17 * i)));
    const R = C7.indexRing(ctx, t, { k, seg, retract: ret, skip: t > a.ifYou + .5 ? 0 : -1 });
    // global funds: small dots come in from outside and pass through the five
    for (const d of DOTS7) {
      const u = span(t, a.global - .1 + d.t, a.global + 1.2 + d.t); if (u <= 0) continue;
      const rr = R.r * lerp(2.6, d.end, sineIO(u)) * (1 - ret), x = R.x + Math.cos(d.q) * rr, y = R.y + Math.sin(d.q) * rr, warm = smooth(span(rr, R.r * 1.05, R.r * .9));
      const col = mixHex(COL.cool, P.halo0, warm);
      halo(ctx, x, y, 2.6, .5, col, col); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, .75 * (1 - ret * .7), 0, 6.29); ctx.fill();
    }
    // the words (right of the ring)
    const out = 1 - smooth(span(t, a.ifYou - .1, a.ifYou + .4));
    G.label(ctx, 'S&P 500', C7.RING.x + 34, C7.RING.y - 11, 4.2, rise(span(t, a.five + 1.15, a.five + 1.8)) * out);
    const mq = rise(span(t, a.quarter - .1, a.quarter + .6)) * out, mx = C7.RING.x + 33.4;
    G.label(ctx, 'MORE THAN', mx, C7.RING.y + 6, 12.4, mq, { serif: true, col: P.cream, glow: true });
    G.label(ctx, '¼', mx + K.measure('MORE THAN ', 12.4, true), C7.RING.y + 6, 11.6, mq, { serif: false, weight: 500, col: P.cream, glow: true });
  }
  function note(ctx, t) {
    if (t < a.ifYou + .5 || t > (a.butPublic + a.publicBuilds - .1) / 2) return;   // gone behind the closing door leaf
    const [s0, s1] = C7.SEGS[0], qm = (s0 + s1) / 2, from = [C7.RING.x + Math.cos(qm) * C7.RING.r, C7.RING.y + Math.sin(qm) * C7.RING.r];
    const u = span(t, a.ifYou + .5, a.piece + .02), br = Math.sin(t * 1.4) * .3;
    C7.flyingNote(ctx, t, u, from, [NOTE_AT[0], NOTE_AT[1] + br], sineIO(span(t, a.piece - .6, a.piece + .08)), { w0: 9, w1: 13 });
  }
  // the far bubble over the street (it trembles on "pops")
  function bubble(ctx, t) {
    if (t < a.pensionP + 4) return;
    const tr = .25 + .75 * bell(t, a.pops + .35, .7);
    B.bubble(ctx, C7.BUB.x, C7.BUB.y + 8 * Math.sin(t * .35), C7.BUB.r, t, { tremble: tr, lum: .9 });
  }
  // ---- 7.07 · 7.08 the street: the parsonage (candle) and the neighbours' windows; then the windows lift as bidder cards
  const litT = C7.STREET.map((hs, i) => a.today + .25 + .13 * Math.abs(i - 2));
  const liftT = C7.STREET.map((hs, i) => (i === 4 ? a.pops - .05 : a.whoGets + .05 + .1 * Math.abs(i - 4)));
  function street(ctx, t) {
    if (t < a.soIf) return;   // the neighbours stand there already (off-frame until the pull-back reveals them: no pop-in)
    const sw = SW(t);
    C7.STREET.forEach((hs, i) => C7.houseBody(ctx, hs, sw));
    // the parsonage room (candle), the neighbours' windows
    const cand = t < a.backThen - .15 ? 0 : t < a.backThen ? .25 * (.5 + .5 * Math.sin(t * 40)) : rise(span(t, a.backThen, a.backThen + .6));
    C7.STREET.forEach((hs, i) => {
      const lifted = t >= liftT[i];
      if (hs.par) { if (!lifted) C7.parsonageRoom(ctx, t, cand, 1, sw); else C7.windowLight(ctx, hs.win, 0, t, 0, sw); return; }
      C7.windowLight(ctx, hs.win, lifted ? 0 : rise(span(t, litT[i], litT[i] + .35)), t, i, sw);
    });
    // the cards
    C7.STREET.forEach((hs, i) => {
      if (t < liftT[i]) return;
      const p = cardPos(i, t); if (!p) return;
      const u = t - liftT[i], stay = STAY.includes(i);
      C7.bidCard(ctx, t, p, smooth(span(u, .3, 1.0)), sineIO(span(u, .1, .8)), i === 4 ? bell(t, liftT[i] + .3, .4) : stay ? smooth(span(t, a.cash - .05, a.cash + .3)) * .9 : 0);
      // the sisters' room dissolves into its card as the card leaves the window (no swap frame)
      if (C7.STREET[i].par && u < .45) { ctx.save(); ctx.globalAlpha *= 1 - smooth(span(u, 0, .45)); C7.parsonageRoom(ctx, t, rise(span(t, a.backThen, a.backThen + .6)), 1, sw); ctx.restore(); }
    });
  }

  // ================================================================================================ c08
  const BG_LIFT = (k) => [[0, mixHex(P.night0, P.ind2, .3 * k)], [.6, mixHex(P.night1, P.ind1, .3 * k)], [1, mixHex(P.ind0, P.ind1, .4 * k)]];
  const BG_MIX = (k) => [[0, mixHex(mixHex(P.night0, P.ind2, .3), P.night0, k)], [lerp(.6, .7, k), mixHex(mixHex(P.night1, P.ind1, .3), P.night1, k)], [1, mixHex(mixHex(P.ind0, P.ind1, .4), P.night0, k)]];
  // ---- 8.01 the cards come down into the hall; most drop on "cash", two stay
  const STAY = [1, 6];
  const CARD_X = [3990, 4140, 4290, 4440, 4960, 5110, 5260, 5410];
  function cardPos(i, t) {
    const hs = C7.STREET[i], [x0, y0, x1, y1] = hs.win, u = t - liftT[i];
    const snap = i === 4 ? expoOut(clamp(u / .28)) : sineIO(clamp(u / .7));
    let p = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 - 170 * snap, w: (x1 - x0) * lerp(1, .8, snap), h: (y1 - y0) * lerp(1, .75, snap) };
    const rg = sineIO(span(t, a.after - .25 + .05 * i, a.after + .95 + .05 * i));
    if (rg > 0) p = { x: lerp(p.x, CARD_X[i], rg), y: lerp(p.y, 960, rg) - Math.sin(Math.PI * rg) * 60, w: lerp(p.w, 128, rg), h: lerp(p.h, 84, rg) };
    if (!STAY.includes(i)) { const d = t - (a.cash + .03 + .045 * Math.abs(i - 3.5)); if (d > 0) p.y += 2200 * d * d - 30 * Math.sin(Math.min(d * 9, Math.PI)); if (p.y > 1700) return null; }
    else { const d = sineIO(span(t, a.gc + .1, a.gc + .9)); p.y += 520 * d; if (d >= 1) return null; }
    return p;
  }
  const hallOut = (t, j = 0) => 1 - sineIO(span(t, a.gc + .15 + .08 * j, a.gc + .85 + .08 * j));
  const TAG3 = (() => { const L = C8.LOTS[3]; return [L.x + 6, G.GROUND - L.h + 66]; })();
  function hall(ctx, t) {
    if (t < a.after - 1 || t > a.consp + 1) return;
    const lit = t < a.after - .12 ? 0 : t < a.after + .05 ? .3 * (.5 + .5 * Math.sin(t * 50)) : rise(span(t, a.after + .05, a.after + .6));
    const drop = sineIO(span(t, a.after - .9, a.after + .2));
    const out = hallOut(t);
    C8.hallLamp(ctx, t, lit * out, drop * (1 - sineIO(span(t, a.gc + .1, a.gc + 1.4))));
    const pk = rise(span(t, a.after + .2, a.after + .9)) * hallOut(t, 2);
    C8.podium(ctx, t, pk, lit);
    if (pk > .6) {
      const up = .95 * sineIO(span(t, a.whoever - .1, a.cash - .25)), strike = expoIn(span(t, a.cash - .25, a.cash - .02));
      C8.hammer(ctx, lerp(up, -.06, strike) + (t > a.cash ? .04 * Math.exp(-(t - a.cash) * 12) * Math.sin((t - a.cash) * 40) : 0), lit);
      if (t > a.cash - .02 && t < a.cash + 1) E.dust(ctx, 1471, 40, C8.HC.x - 50, 676 - (t - a.cash) * 30, 60 + (t - a.cash) * 90, 14 + (t - a.cash) * 20, t, .5 * (1 - span(t, a.cash, a.cash + 1)), P.halo1);
    }
    C8.LOTS.forEach((L, j) => {
      const k = rise(span(t, a.after + .45 + .15 * j, a.after + 1.15 + .15 * j)) * (j === 3 ? hallOut(t, 0) : hallOut(t, j));
      C8.lot(ctx, t, L, k, lit);
      if (k > .3) {
        const sway = .07 * Math.sin(t * 1.3 + j * 1.7) + .12 * bell(t, a.cheap + .3 + .08 * j, .5) * Math.sin(t * 6 + j);
        const top = L.kind === 'drum' ? G.GROUND - 2 * L.r : G.GROUND - L.h, tag = [L.x + 6, top + 66 + 260 * (1 - k)];
        if (j === 3 && t > a.gc - .15) return;   // this tag becomes the Global Crossing bar
        C8.lotTag(ctx, tag[0], tag[1], sway, { lum: .5 + .4 * lit });
      }
    });
  }
  // ---- 8.02 – 8.09 the explainer line: Global Crossing → the flow → 1844 → the ticket → the people → the chip → the form → Ohio
  const GC = { x: 5130, y1: 640, h: 60, w1: 900, y2: 730 };
  const W2 = GC.w1 * 250 / 12400;
  const FLOW = { y: 670, x0: GC.x, x1: 6900, nodes: [[5300, 'CRASH'], [6000, 'CHEAP ASSETS'], [6700, 'WHOEVER HAS CASH']] };
  const PEOPLE = (() => { const r = prng(881), out = []; for (let i = 0; i < 34; i++) { const row = i % 2; out.push({ x: 5260 + (i / 33) * 1660 + (r() - .5) * 30, y: 772 + row * 66 + (r() - .5) * 18, ph: r() * 6 }); } return out; })();
  const LUCKY = [PEOPLE.reduce((b, p, i) => (Math.hypot(p.x - 6620, p.y - 772) < Math.hypot(PEOPLE[b].x - 6620, PEOPLE[b].y - 772) ? i : b), 0), PEOPLE.reduce((b, p, i) => (Math.hypot(p.x - 6800, p.y - 838) < Math.hypot(PEOPLE[b].x - 6800, PEOPLE[b].y - 838) ? i : b), 0)];
  const SEAL0 = [6330, 790];                     // the wax seal on the parchment (at scale 1, parchment top at 230)
  const PTOP = 230;
  const CROWD = (() => { const out = []; for (let j = 0; j < 9; j++) out.push({ x: 6000 + (j - 4) * 176, j, d: Math.abs(j - 4) }); return out; })();
  const PERSON_H = 400, PERSON_Y = 1130;
  const armUp = (t) => smooth(span(t, a.forEveryone - .1, a.forEveryone + .6));
  const armOf = (t, d) => { const r = sineIO(span(t, a.people + .5 + .06 * d, a.people + 1.3 + .06 * d)), up = armUp(t); return [lerp(.4, 2.45 + .25 * up, r), lerp(.5, 2.7 + .3 * up, r)]; };
  const crowdIn = (t, d) => sineIO(span(t, a.people + .05 * d, a.people + .9 + .05 * d)) * (1 - sineIO(span(t, a.backThen2 + 2.6 + .03 * d, a.backThen2 + 3.6 + .03 * d)));
  // where the centre person's ticket coin is when the arm is fully up (the camera aims there in 8.07)
  const TKW = 120;
  const COIN = COIN_K;
  const chipPos = (t) => {   // the chip after the flip: it stays where the coin was, grows, then flies to the form, then to the gauge
    const c0 = COIN, grow = sineIO(span(t, a.backThen2 + .8, a.backThen2 + 2.4));
    let x = c0[0] + (6250 - c0[0]) * grow, y = c0[1] + (540 - c0[1]) * grow, r = lerp(TKW * .09, 40, grow);
    const f1 = sineIO(span(t, a.conditions - .55, a.conditions + .05));
    const fs = formSeal(t);
    x = lerp(x, fs[0], f1); y = lerp(y, fs[1], f1) - Math.sin(Math.PI * f1) * 90; r = lerp(r, 30, f1);
    return [x, y, r];
  };
  const formIn = (t) => sineIO(span(t, a.todays - .1, a.todays + 1.0));
  const formC = (t) => [lerp(7600, 6480, formIn(t)), 560];
  const formSeal = (t) => { const [fx, fy] = formC(t); return [fx + C8.FORM.w / 2 - 110, fy + C8.FORM.h / 2 - 110]; };
  const parchState = (t) => {   // centre x, top y, scale, unrolled
    const up = sineIO(span(t, a.people - .25, a.people + 1.25)), back = sineIO(span(t, a.backThen2 + .4, a.backThen2 + 2.8));
    let cx = 6000, top = PTOP - 1150 * up, sc = 1;
    if (back > 0) { cx = lerp(6000, 5520, back); top = lerp(PTOP - 1150, 470 - C8.PCH.h * .7 / 2, back); sc = lerp(1, .7, back); }   // high and small: clear of the tickets still raised below
    return { cx, top, sc, u: sineIO(span(t, a.e1844 + .1, a.e1844 + 1.2)) };
  };
  const needle8 = (t) => { const u = span(t, a.mostPower - .6, a.mostPower + .15); return .85 * sineIO(u) + .025 * Math.sin(Math.PI * clamp((t - a.mostPower - .15) / .5)) * (t > a.mostPower + .15 && t < a.mostPower + .65 ? 1 : 0) + .004 * Math.sin(t * 3.1); };
  function explainer(ctx, t) {
    if (t < a.gc - .3 || t > a.soIfB + 4.5) return;
    // --- 8.02 Global Crossing: the LOT tag stretches into the debt bar; the sliver below
    const st = sineIO(span(t, a.gc - .15, a.gc + .75)), col = smooth(span(t, a.consp + .05, a.consp + .8));
    const b1 = { x: lerp(TAG3[0] - 46, GC.x, st), y: lerp(TAG3[1] - 25, GC.y1, st), w: lerp(92, GC.w1, st), h: lerp(50, GC.h, st) };
    const flowRise = sineIO(span(t, a.but1844 - .05, a.but1844 + .8));
    if (t < a.but1844 + .9) {
      if (col < 1) C8.paperBar(ctx, b1.x, b1.y + (b1.h - lerp(b1.h, 4, col)) / 2, b1.w, lerp(b1.h, 4, col), { lum: .9 });
      const w2 = W2 * sineIO(span(t, a.taken + .3, a.taken + 1.0)) * (1 - col);
      if (w2 > .5) C8.paperBar(ctx, GC.x, GC.y2, w2, GC.h * (1 - col), { glow: bell(t, a.sliver + .2, .5), lum: .95 });
      const lo = 1 - smooth(span(t, a.consp - .15, a.consp + .35));
      G.label(ctx, 'GLOBAL CROSSING', GC.x, 446, 46, rise(span(t, a.gc - .05, a.gc + .6)) * lo);
      const nk = rise(span(t, a.gc + .45, a.gc + 1.1)) * lo;
      G.label(ctx, '$12.4 BN', GC.x, 612, 150, nk, { serif: true, col: P.cream, glow: true });
      G.label(ctx, 'DEBT', GC.x + K.measure('$12.4 BN', 150, true) + 26, 612, 46, rise(span(t, a.gc + .8, a.gc + 1.4)) * lo);
      G.label(ctx, '$250 M', GC.x + 50, 788, 120, rise(span(t, a.sliver - .15, a.sliver + .5)) * lo, { serif: true, col: P.cream, glow: true });
      // --- 8.03 the flow: the collapsed bar runs on as a line of light
      if (col > 0) {
        const fu = lerp(GC.w1 / (FLOW.x1 - FLOW.x0), 1, sineIO(span(t, a.consp + .3, a.fire + .9)));
        const y = lerp(FLOW.y, PTOP, flowRise), xa = lerp(FLOW.x0, 6000 - 550 - 14, flowRise), xb = lerp(FLOW.x1, 6000 + 550 + 14, flowRise);
        B.inkLine(ctx, [[xa, y], [xb, y]], fu, { col: P.halo1, w: lerp(3, 6, flowRise), glow: .8, head: fu < .999 ? 1 : 0, headCol: P.halo1, headCore: P.core0 });
        // light pulses on "fire sales"
        if (t > a.fire - .2 && flowRise < .5) for (let k = 0; k < 3; k++) { const q = ((t - a.fire) * .55 + k / 3) % 1; if (q < 0) continue; const x = lerp(xa, xb, q); halo(ctx, x, y, 40, .35 * (1 - flowRise * 2), P.halo1, P.core0); }
        const nl = 1 - smooth(span(t, a.but1844 - .25, a.but1844 + .2));
        FLOW.nodes.forEach(([x, s], i) => {
          const pass = (x - FLOW.x0) / (FLOW.x1 - FLOW.x0) <= fu + 1e-3; if (!pass) return;
          const tp = i === 0 ? a.consp + .5 : i === 1 ? a.fire - .1 : a.fire + .55;
          const k = rise(span(t, tp, tp + .6)) * nl;
          if (k > 0) { ctx.fillStyle = rgba(P.cream, k); ctx.beginPath(); ctx.arc(x, FLOW.y, 9 * k, 0, 6.29); ctx.fill(); G.label(ctx, s, x, FLOW.y - 34, 44, k, { align: 'center' }); }
        });
      }
    }
    // the people around (dots): left alone, only two get a line; then they gather into the wax seal
    const gather = sineIO(span(t, a.parliament - .2, a.law - .15));
    if (t > a.leftAlone - .1 && gather < 1) {
      const ps = parchState(t);
      PEOPLE.forEach((p, i) => {
        const g = rise(span(t, a.leftAlone + .025 * Math.abs(i - 17), a.leftAlone + .5 + .025 * Math.abs(i - 17)));
        if (g <= 0) return;
        const lucky = LUCKY.includes(i), warm = lucky ? smooth(span(t, a.everyone8 + .15, a.everyone8 + .6)) : 0;
        const gi = clamp(gather * 1.4 - .4 * (i / 33));
        const x = lerp(p.x, SEAL0[0], sineIO(gi)), y = lerp(p.y + 2 * Math.sin(t * 1.1 + p.ph), SEAL0[1], sineIO(gi));
        if (lucky && warm > 0 && gather <= 0) B.inkLine(ctx, E.catmull([[6700, FLOW.y], [lerp(6700, x, .5), lerp(FLOW.y, y, .3) - 10], [x, y]], 6), sineIO(span(t, a.everyone8 - .05, a.everyone8 + .45)), { col: P.halo1, w: 2.5, glow: .6 });
        const col2 = mixHex(mixHex(COL.cool2, P.night1, .35), P.halo0, warm);
        if (warm > 0) halo(ctx, x, y, 34, .4 * warm, P.halo1, P.core0);
        ctx.fillStyle = col2; ctx.beginPath(); ctx.arc(x, y, 8 * g * (1 - .5 * gi), 0, 6.29); ctx.fill();
      });
    }
    // --- 8.04 the parchment (unrolls from the line), the seal; 8.05 the words, the signs, the ticket; 8.08 it comes back smaller
    const ps = parchState(t);
    if (t > a.but1844 + .5 && ps.top + C8.PCH.h * ps.sc > -400) {
      C8.parchment(ctx, ps.cx, ps.top, ps.sc, ps.u, { lum: .8 });
      const L = (s, lx, ly, size, u, o = {}) => G.label(ctx, s, ps.cx + lx * ps.sc, ps.top + ly * ps.sc, size * ps.sc, u, { col: COL.ink, ...o });
      const titleK = rise(span(t, a.e1844 + .8, a.e1844 + 1.5));
      L('RAILWAY REGULATION ACT · 1844', 0, 102, 56, titleK, { serif: true, align: 'center' });
      // the act's words (rise at their phrases; gone when the parchment leaves)
      const wk = 1 - smooth(span(t, a.people - .3, a.people + .1));
      const segs = [['EVERY NEW LINE · ', a.everyLine], ['EVERY WEEKDAY · ', a.weekday], ['EACH WAY', a.eachWay]];
      const tot = segs.reduce((s2, [s]) => s2 + K.measure(s, 38, false), 0); let xx = -tot / 2;
      for (const [s, tt] of segs) { L(s, xx, 196, 38, rise(span(t, tt - .05, tt + .55)) * wk, { serif: false, weight: 600 }); xx += K.measure(s, 38, false); }
      // the seal: wax from the gathered dots, pressed on "law"
      const sx = ps.cx + (SEAL0[0] - 6000) * ps.sc, sy = ps.top + (SEAL0[1] - PTOP) * ps.sc;
      if (gather > .45) { const pr = expoOut(span(t, a.law - .08, a.law + .12)); C8.seal(ctx, sx, sy, 46 * ps.sc * lerp(.6, 1, smooth(span(gather, .45, 1))), pr, { squash: bell(t, a.law + .02, .1) }); }
      G.labelR(ctx, 'CONDITION', sx - 66 * ps.sc, sy + 15 * ps.sc, 44 * ps.sc, rise(span(t, a.condition - .05, a.condition + .6)) * (1 - smooth(span(t, a.ohio + 1.2, a.ohio + 1.8))), { col: COL.ink });
    }
    // 8.05 the signs (ink on the parchment), then they assemble into the ticket
    const asm = sineIO(span(t, a.penny + .45, a.penny + 1.35)), tg = expoOut(span(t, a.penny + .55, a.penny + 1.35));
    const TK = { x: 6000, y: 662, w: 840 }, stubX = TK.x + TK.w * .345;
    const cpos = CROWD.map((p) => ({ ...p }));
    if (t > a.roof - .1 && t < a.backThen2 + 4.4) {
      // the big ticket (it shrinks into the centre person's hand in 8.06; its clones fly to the others)
      const inK = (d) => crowdIn(t, d);
      const hands = CROWD.map((p) => { const k = inK(p.d); if (k <= 0) return null; return E.person(ctx, p.x, PERSON_Y + 520 * (1 - k), PERSON_H, { armR: armOf(t, p.d), armL: [-.4, -.5], lanyard: false, look: .1 * Math.sin(t * .5 + p.j) }); });
      const shrink = sineIO(span(t, a.people + .2, a.people + 1.0));
      if (tg > 0) {
        CROWD.forEach((p, j) => {
          const h = hands[j]; if (!h && shrink > 0) return;
          let x = TK.x, y = TK.y, w = TK.w * lerp(.12, 1, tg);
          if (shrink > 0) {
            const fly = p.d === 0 ? shrink : sineIO(span(t, a.people + .6 + .06 * p.d, a.people + 1.3 + .06 * p.d));
            if (p.d > 0 && fly <= 0) return;
            const hx = h[ 'R' ][0] + TKW * .2, hy = h.R[1] - TKW * .2;
            x = lerp(TK.x, hx, fly); y = lerp(TK.y, hy, fly) - Math.sin(Math.PI * fly) * 60 * (p.d > 0 ? 1 : 0); w = lerp(p.d === 0 ? TK.w : TKW, TKW, fly);
          } else if (j !== 4) return;
          const glow = smooth(span(t, a.forEveryone - .05, a.forEveryone + .5)) * .9;
          B.ticket(ctx, x, y, w, 0, { lines: ['1d', 'PER MILE · 1844'], glow });
          // the coin on its stub (8.07: the centre one flips into a chip)
          const cx2 = x + w * .33, cy2 = y + w * .1, r2 = w * .07;
          if (p.d === 0 && t > a.pennyTrain - .2) {
            const fu = sineIO(span(t, a.pennyTrain - .15, a.pennyTrain + .55));
            if (fu < 1) B.flip(ctx, fu, cx2, cy2, r2 * 2, r2 * 2, (c, sx) => C8.penny(ctx, cx2, cy2, r2, sx), (c, sx) => C8.chip(ctx, cx2, cy2, r2, sx));
          } else if (shrink > 0 || asm >= 1) C8.penny(ctx, cx2, cy2, r2);
        });
      }
      // the three signs on the parchment, before the ticket takes them
      if (asm < 1 && t < a.people) {
        const pt = (x0, y0, x1, y1) => [lerp(x0, x1, asm), lerp(y0, y1, asm)];
        const s0 = lerp(1, .5, asm);
        const [rx, ry] = pt(5720, 600, stubX, 540), [qx, qy] = pt(6000, 600, stubX, 612);
        B.inkLine(ctx, C8.roofPts(rx, ry, 74 * s0), sineIO(span(t, a.roof - .1, a.roof + .4)), { col: COL.ink, w: 7 * s0 });
        if (t > a.seat - .1) B.inkLine(ctx, C8.seatPts(qx, qy, 64 * s0), sineIO(span(t, a.seat - .1, a.seat + .4)), { col: COL.ink, w: 7 * s0 });
        if (t > a.penny - .55) { const rr = span(t, a.penny - .55, a.penny + .02), [cx3, cy3] = pt(lerp(6560, 6280, sineIO(rr)), 600 - 30 * Math.abs(Math.sin(rr * Math.PI * 2)) * (1 - rr), TK.x + TK.w * .33, TK.y + TK.w * .1); C8.penny(ctx, cx3, cy3, lerp(46, TK.w * .07, asm)); }
      }
      if (asm >= 1 && shrink <= 0 && tg >= 1) {
        // the signs printed on the ticket's stub
        B.inkLine(ctx, C8.roofPts(stubX, 540, 37), 1, { col: COL.ink, w: 3.5 }); B.inkLine(ctx, C8.seatPts(stubX, 612, 32), 1, { col: COL.ink, w: 3.5 });
      }
      G.label(ctx, 'PARLIAMENTARY TRAINS', 6000, 410, 54, rise(span(t, a.parl - .05, a.parl + .6)) * (1 - smooth(span(t, a.soWhat - .2, a.soWhat + .3))), { align: 'center' });
    }
    // --- 8.07 → 8.09 the chip: grows, lands as the seal on the form, then becomes the plug of the gauge
    if (t > a.pennyTrain + .5 && t < a.soIfB + 4.5) {
      const fi = formIn(t);
      if (fi > 0) { const [fx, fy] = formC(t); C8.form(ctx, fx, fy, 1); }
      const landed = t > a.conditions + .05;
      const toPlug = sineIO(span(t, a.ohio + .1, a.ohio + 1.05));
      if (landed) { const [fx, fy] = formSeal(t); C8.seal(ctx, fx, fy, 46, expoOut(span(t, a.conditions + .05, a.conditions + .25)), { chip: true, squash: bell(t, a.conditions + .1, .1) }); G.labelR(ctx, 'CONDITION', fx - 60, fy + 15, 40, rise(span(t, a.conditions + .1, a.conditions + .7)) * (1 - smooth(span(t, a.ohio + 1.2, a.ohio + 1.8))), { col: COL.ink }); }
      let [x, y, r] = chipPos(t);
      if (toPlug > 0) { const fs = formSeal(t), plug = [C8.GAUGE.x, C8.GAUGE.y + C8.GAUGE.R * 1.3 + 23]; x = lerp(fs[0], plug[0], toPlug); y = lerp(fs[1], plug[1], toPlug) - Math.sin(Math.PI * toPlug) * 140; r = lerp(30, 26, toPlug); }
      if (t > a.pennyTrain + .5) C8.chip(ctx, x, y, r, 1, { glow: .8 });
    }
    // --- 8.09 Ohio: the gauge grows out of the plug's socket, the data center rises, the cable, 85 %, 12 years, lights out
    if (t > a.ohio - .3) {
      const gk = expoOut(span(t, a.ohio - .2, a.ohio + .7)), { x, y, R } = C8.GAUGE;
      const dk = rise(span(t, a.ohio + .2, a.ohio + .95)), lum = lerp(.95, .03, smooth(span(t, a.never - .05, a.never + .45)));
      if (dk > 0) { ctx.save(); ctx.beginPath(); ctx.rect(C8.DC8.x - 100, 300, C8.DC8.w + 200, C8.DC8.y - 300 + 2); ctx.clip(); B.dataCenter(ctx, C8.DC8.x, C8.DC8.y + (C8.DC8.h + 60) * (1 - dk), C8.DC8.w, C8.DC8.h, t, { lum, seed: 23 }); ctx.restore(); }
      const cu = sineIO(span(t, a.ohio + .95, a.ohio + 1.7));
      if (cu > 0) B.inkLine(ctx, E.catmull([[C8.DC8.x + 20, C8.DC8.y - 40], [C8.DC8.x - 120, C8.DC8.y + 10], [x + 60, C8.DC8.y + 70], [x, y + R * 1.3 + 40]], 8), cu, { col: mixHex(P.ind2, COL.cool2, .5), w: 7 });
      if (gk > 0) {
        ctx.save(); ctx.translate(x, y + R * 1.3 + 23); ctx.scale(gk, gk); ctx.translate(-x, -(y + R * 1.3 + 23));
        const n = needle8(t); C8.gaugeBody(ctx, t, n, Math.max(.001, n));
        ctx.restore();
      }
      G.label(ctx, 'AEP OHIO', x, y - R * 1.3 - 40, 52, rise(span(t, a.ohioW - .05, a.ohioW + .6)), { align: 'center' });
      G.label(ctx, '85 %', 7650, 400, 150, rise(span(t, a.mostPower - .05, a.mostPower + .6)), { serif: true, col: P.cream, glow: true });
      C8.calendar(ctx, 7654, 446, 12, span(t, a.forYears - .1, a.forYears + .75), t);
      G.label(ctx, 'UP TO 12 YEARS', 7654, 556, 44, rise(span(t, a.forYears + .1, a.forYears + .8)));
    }
  }

  // ---- 8.11 · 8.12 the envelope → 50 tiles (23 lit) → the fence; your window → the door of the plate
  const GRID = (() => { const out = [], cw = 60, ch = 26, gx = 18, gy = 18, x0 = 2550 - (10 * cw + 9 * gx) / 2, y0 = 120 - (5 * ch + 4 * gy) / 2; for (let r = 0; r < 5; r++) for (let c = 0; c < 10; c++) out.push({ x: x0 + c * (cw + gx) + cw / 2, y: y0 + r * (ch + gy) + ch / 2, r, c }); return out; })();
  const LIT = (() => { const r = prng(2323), idx = GRID.map((_, i) => i); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } const set = new Map(); idx.slice(0, 23).forEach((g, k) => set.set(g, k)); return set; })();
  // each tile falls onto a picket: left half of the grid → left fence, right half → right fence
  const PICKET = GRID.map((g, i) => { const left = g.c < 5, k = g.r * 5 + (left ? g.c : g.c - 5); return left ? 24 - k : 25 + k; });
  function ending(ctx, t) {
    if (t < a.many - .2) return;
    // the tiles
    const lo = 1 - smooth(span(t, a.butPublic - .1, a.butPublic + .3));
    GRID.forEach((g, i) => {
      const t0 = a.many + .05 + .014 * i, u = sineIO(span(t, t0, t0 + .8));
      if (u <= 0) return;
      const lit = LIT.has(i) ? smooth(span(t, a.similar + .05 * LIT.get(i), a.similar + .3 + .05 * LIT.get(i))) : 0;
      const pulse = LIT.has(i) ? bell(t, a.protects + .3 + .01 * LIT.get(i), .4) : 0;
      let x = lerp(Hs.ENV.x, g.x, u), y = lerp(Hs.ENV.y, g.y, u) - Math.sin(Math.PI * u) * 80, w = lerp(Hs.ENV.w, 60, u), h = lerp(Hs.ENV.h, 26, u);
      const tf = a.butPublic + .02 * i, f = span(t, tf, tf + .85);
      if (f > 0) {
        const pk = PICKET[i], px = C8.picketX(pk);
        const e = f * f;
        x = lerp(g.x, px, sineIO(f)); y = lerp(g.y, C8.FENCE.top + C8.FENCE.h / 2, e); w = lerp(60, C8.FENCE.pw, smooth(f)); h = lerp(26, C8.FENCE.h, smooth(f));
        if (f >= 1) { const b = t - (tf + .85); y -= 8 * Math.exp(-b * 9) * Math.abs(Math.sin(b * 20)); }
        const p = new Path2D(); p.roundRect(x - w / 2, y - h / 2, w, h, 3);
        B.paperFill(ctx, p, { lum: .45 + .45 * lit, seed: 871, fibre: 0 });
        ctx.fillStyle = rgba(P.halo1, .3 + .3 * lit); ctx.fillRect(x - w / 2, y - h / 2, w, 2);
        return;
      }
      Hs.envelope(ctx, x, y, w, h, { lum: .45 + .55 * lit, glow: lit * .6 + pulse * .6, skew: w * .1 });
    });
    G.label(ctx, '23 STATES · LARGE-LOAD TARIFFS · EEI 2026', 2550, -42, 64, rise(span(t, a.similar + .2, a.similar + .9)) * lo, { align: 'center' });
    // the fence posts, crossbar, rails; the sign
    C8.fenceFrame(ctx, sineIO(span(t, a.butPublic + .2, a.butPublic + 1.1)));
    C8.gateSign(ctx, t, span(t, a.publicBuilds - .55, a.publicBuilds - .1), .05 * Math.exp(-Math.max(0, t - a.publicBuilds + .1) * 2.2) * Math.sin(Math.max(0, t - a.publicBuilds + .1) * 6));
  }

  return (ctx, t) => {
    if (t < tA) { S.plateBrick(ctx, t, T0); return; }
    if (t >= tPlate) { S.plateDoor(ctx, t, T1); return; }
    spaceA(ctx, t);
  };
}
