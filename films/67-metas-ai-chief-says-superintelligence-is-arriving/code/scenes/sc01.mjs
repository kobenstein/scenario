// c01 · Hook · THE PROMISE · thumbnail A (you on the rooftop, the big gold tag crumbling, AI MAKES EVERYTHING CHEAP) · his list: four
// tags split off the promise (HOUSING · EDUCATION · FOOD · CLOTHING) · the quote on the promise's face · the city's windows turn cool (the
// machines do the work) · thumbnail C: the promise prints the receipt into your hand, RENT ↑ GROCERIES ↑ THE POWER BILL ↑ · your small pay
// slip · the receipt rolls back · the four tags dip one after another · the camera follows the dust down to the office window: the
// programmer's tag falls and crumbles (★ "Almost to nothing"), < $1 · back out: one tag on his list turns away and rises · half right: the
// promise crumbles to half → platePromise (lib/f66_world.mjs) at 'This January'.
// 0 → T.G('This January') · built by the lead (quality reference). Plan: docs/shots.md H.01–H.10 · world: docs/MOTION.md
// ONE entry, one world, one continuous camera. Everything in the world (no cards, no veil): the hook is a scene, the explainers start in c02.
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                                  | camera            |
// |-------|---------------------------------|-------------------------------------------------------------------------------------|-------------------|
// | H.01★ | Sam Altman says                 | THUMBNAIL A: you, the promise crumbling from its lower-left edge, the title         | slow push · SCENE |
// | H.02  | Housing. Education. Food. …     | four tags split off the promise face, one per word, and hang in the sky (left)      | drift up-left · MIX |
// | H.03  | Everything necessary            | the quote writes on the promise's face; credit line                                  | creep · MIX       |
// | H.04  | His reason                      | the city's windows turn cool left → right (AI and robots do the work)               | tilt down · SCENE |
// | H.05  | Your receipts say the opposite  | THUMBNAIL C: the promise prints a receipt into your hand; RENT ↑ GROCERIES ↑ BILL ↑ | glide · MIX       |
// | H.06  | And your paycheck               | a small pay slip in your other hand (long receipt vs small slip)                    | creep · SCENE     |
// | H.07  | Yet he could still be right     | the receipt rolls back; the four tags dip one after another                          | glide left · MIX  |
// | H.08  | So what gets cheap first        | follow the dust down: the station-1 tag comes down in front of the office window    | push in · SCENE   |
// | H.09★ | The first price has already     | it drops, crumbles to dust ("Almost to nothing"); < $1 grows where it hung           | push · MIX        |
// | H.10  | But one thing on his list       | pull back: one list tag turns its back and rises out of the sky; half right: the list folds back, the promise crumbles to half; your pay slip glows → platePromise | pull back · SCENE |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, mixHex } = E;
const { rise, GOLD, F0 } = F;

export const PRINT = F.PRINT66;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.say = G('Sam Altman says'); a.housing = G('Housing'); a.edu = G('Education', a.housing); a.food = G('Food', a.edu); a.cloth = G('Clothing', a.food);
  a.nec = G('Everything necessary', a.cloth); a.reason = G('His reason', a.nec); a.robots = G('robots will do', a.reason); a.work = GE('do the work', a.reason);
  a.receipts = G('Your receipts'); a.rent = G('Rent, up', a.receipts); a.groc = G('Groceries, up', a.rent); a.bill = G('The power bill', a.groc);
  a.pay = G('And your paycheck has', a.bill); a.yet = G('Yet he could', a.pay); a.once = G("Prices don't fall", a.yet); a.after = G('They fall one after', a.once);
  a.what = G('So what gets cheap first', a.after); a.never = G('which of your bills', a.what);
  a.fallen = G('The first price has already', a.never); a.nothing = G('Almost to nothing', a.fallen); a.week = G('Up to a week', a.nothing); a.dollar = G('less than a dollar', a.week);
  a.list = G('But one thing on his list', a.dollar); a.neverc = G('may never get cheap', a.list); a.rise = G('It may even rise', a.list);
  a.half = G('So he may be half right', a.rise); a.which = G('And your paycheck depends', a.half); a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

const CF = (u, v, s = 1) => E.aim(F0, u, v, s);                         // looks at the rooftop (you stay in frame, the promise moves less)
const CL = (u, v, s = 1) => E.aim(S.Z_LAND, u, v, s);                    // looks at the land card
const PR = S.PROMISE, PH = PR.w * 1.42;
const onPromise = (lx, ly) => [PR.x + lx * Math.cos(PR.rot) - ly * Math.sin(PR.rot), PR.y + lx * Math.sin(PR.rot) + ly * Math.cos(PR.rot)];
const FACE = onPromise(0, PH * .45);                                       // the promise's face centre (promise card px)
// his list: four tags split off the promise and hang in the sky, top left (promise card px; the title has sunk by then)
const LIST = [['HOUSING', 330], ['EDUCATION', 560], ['FOOD', 790], ['CLOTHING', 1020]].map(([label, x], i) => ({ label, x, y: 236 + (i % 2) * 22, w: 150 }));
// the station-1 tag (land card px): it hangs left of the office tower, in front of the dark sky (not over the promise)
const PT = { x: 880, y: 545, w: 130 };

function scene(a, T) {
  const tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.6;
  const listT = [a.housing, a.edu, a.food, a.cloth];
  // ---------------------------------------------------------------- the camera (one take)
  const K = [
    [0, CF(960, 540, 1.0)], [a.housing - .3, CF(944, 538, 1.01)], [a.cloth + .8, CF(900, 536, 1.02)], [a.nec + 1.6, CF(940, 536, 1.025)],
    [a.work + .4, CL(880, 600, 1.06)], [a.receipts + 1.4, CF(1000, 548, 1.0)], [a.pay + 2.4, CF(990, 552, 1.03)],
    [a.once + .6, CF(900, 540, 1.03)], [a.after + 2.2, CF(880, 538, 1.05)],
    [a.never + .6, CL(1030, 690, 1.6)], [a.fallen + .6, CL(1050, 705, 2.3)], [a.dollar + .4, CL(1045, 700, 2.5)],
    [a.list + 1.8, CF(900, 540, 1.0)], [a.rise + 1.4, CF(920, 540, 1.02)],
  ];
  const creepCam = (t) => { const k = 1 + S.CREEP * (t - tPlate); return S.PROMISE_CAM(k, S.trk(k)); };
  const KALL = [...K, [tCreep, creepCam(tCreep)]];
  const camRaw = (t) => (t < tCreep ? F.camPath(t, KALL) : creepCam(t));
  const cam = (t) => E.camDrift(camRaw(t), t, 6 * (1 - smooth(span(t, tPlate - 2.2, tPlate))), 4);

  // ---------------------------------------------------------------- the promise
  const dustP = (t) => lerp(.13, .24, span(t, 0, a.what)) + .26 * sineIO(span(t, a.half - .1, a.half + 1.7));
  const quoteU = (t) => span(t, a.nec - .1, a.nec + 1.2) * (1 - span(t, a.receipts - .3, a.receipts + .5));
  const promise = (t) => ({ dust: dustP(t), glow: 1 - .45 * span(t, a.what, a.what + 1.6) * (1 - span(t, a.list, a.list + 1.6)), textU: quoteU(t), lines: quoteU(t) > 0 ? [['“Everything', 50, .15, true], ['necessary', 50, .15, true], ['will be cheap …”', 50, .3, true]] : [] });

  // ---------------------------------------------------------------- his list (four tags off the promise, in the sky top left)
  const listOut = (i, t) => sineIO(span(t, listT[i] - .25, listT[i] + .75));
  const listBack = (i, t) => sineIO(span(t, a.half + .05 + (3 - i) * .16, a.half + 1.05 + (3 - i) * .16));
  function listTag(ctx, t, i) {
    const L = LIST[i], o = listOut(i, t), b = i === 0 ? 0 : listBack(i, t), f = o * (1 - b); if (f <= 0) return;
    // the flight: out of the promise's face on an arc up to the slot (the dip "one after another" and the turned tag rise come on top)
    const x = lerp(FACE[0], L.x, f), y = lerp(FACE[1], L.y, f) - 160 * Math.sin(Math.PI * f), w = lerp(36, L.w, sineIO(f));
    const dip = F.bump(t, a.after + .1 + i * .32, .9) * 46 + 18 * span(t, a.after + .1 + i * .32, a.after + .7 + i * .32) * (1 - span(t, a.what, a.what + 1.4));
    const shiver = .05 * F.bump(t, a.once + .2, 1.2) * Math.sin(t * 9 + i);
    // while the camera is down at the office the list lifts out of the sky (it comes back down on "his list")
    let dy = dip - 440 * sineIO(span(t, a.what + .2, a.what + 2.0)) * (1 - sineIO(span(t, a.list - .4, a.list + 1.4))), back = 0;
    if (i === 0) { back = sineIO(span(t, a.neverc - .05, a.neverc + 1.0)); dy -= 620 * expoIn(span(t, a.rise + .1, a.rise + 2.4)) ** .8; }
    const dimR = (1 - .45 * span(t, a.receipts, a.receipts + .6) * (1 - span(t, a.yet, a.yet + .8))) * (1 - .5 * span(t, a.what, a.what + 1.6) * (1 - span(t, a.list, a.list + 1.6)));
    F.tag(ctx, t, x, y + dy, w, { thread: f > .98 ? 2400 : 2400 * f, glow: (.55 + .45 * (1 - back)) * dimR, back, swing: (1 - f) * .5 + shiver - .04 * F.bump(t, a.after + .1 + i * .32, .9), seed: 40 + i,
      lines: [[L.label, 22, 0, false]], textU: span(f, .6, 1) });
  }

  // ---------------------------------------------------------------- the receipt (thumbnail C) and your pay slip
  const recU = (t) => sineIO(span(t, a.receipts - .1, a.receipts + 1.7)) * (1 - expoIn(span(t, a.yet + .05, a.yet + 1.5)));
  const pose = (t) => {
    const rc = smooth(span(t, a.receipts + .7, a.receipts + 1.6)) * (1 - smooth(span(t, a.yet + .4, a.yet + 1.4)));
    const sl = smooth(span(t, a.pay - .2, a.pay + .7)) * (1 - smooth(span(t, a.once + .2, a.once + 1.4)));   // left hand: the slip, shown
    const hold = smooth(span(t, a.once + .4, a.once + 1.6));                                                  // right hand takes it (plate pose)
    const armR = [lerp(lerp(.12, 2.3, rc), 2.2, hold), lerp(lerp(.05, 2.65, rc), 2.6, hold)];
    return { armR, armL: [lerp(-.12, -1.35, sl), lerp(-.06, -1.9, sl)], look: lerp(.8, .55, rc) + .15 * span(t, a.what, a.what + 1) - .1 * span(t, a.half, a.half + 1) };
  };
  const slipA = (t) => smooth(span(t, a.pay - .05, a.pay + .6));
  const slipHand = (t) => smooth(span(t, a.once + .5, a.once + 1.5));   // 0 = left hand, 1 = right hand
  const slipGlow = (t) => lerp(.15, .7, smooth(span(t, a.which - .1, a.which + 1.2)));

  // ---------------------------------------------------------------- the programmer's tag (station 1) and < $1
  const down = (t) => span(t, a.what + .9, a.what + 2.9);   // after the list has lifted away (no crossing)
  const fallDy = (t) => 70 * expoOut(span(t, a.fallen + .05, a.fallen + .7)) - 12 * F.bump(t, a.fallen + .55, .6);
  const ptDust = (t) => .1 * span(t, a.fallen, a.fallen + .6) + .8 * sineIO(span(t, a.nothing - .1, a.nothing + 1.8)) + .1 * span(t, a.half, a.half + 1.4);
  const ptA = (t) => (down(t) > 0 ? 1 : 0) * (1 - span(t, a.half + .4, a.half + 2.0));
  const priceU = (t) => span(t, a.dollar - .1, a.dollar + .8);
  const priceOut = (t) => span(t, a.list + .2, a.list + 1.2);
  function progTag(ctx, t) {
    const A = ptA(t); if (A <= 0) return;
    const d = down(t), land = d >= 1 ? 0 : -460 * (1 - (1 - (1 - d) ** 3) - .06 * Math.sin(Math.PI * d) * (d > .7 ? 1 : 0));
    F.tag(ctx, t, PT.x, PT.y + land + fallDy(t), PT.w, { a: A, glow: 1 - .3 * span(t, a.nothing, a.nothing + 1.6), dust: ptDust(t), seed: 7, swing: .05 * F.bump(t, a.fallen, 1.2) * Math.sin(t * 6),
      lines: [['A TOP', 14, 0, false], ['PROGRAMMER’S', 14, 0, false], ['WEEK', 14, 0, false]] });
    const pu = priceU(t), po = priceOut(t);
    if (pu > 0 && po < 1) F.goldText(ctx, [[F.SOURCES.programmerPrice, 1]], PT.x, PT.y + 205 + po * 40, 60, rise(pu) * (1 - expoIn(po)), { serif: true, align: 'center', glow: true });
  }

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t >= tPlate) { S.platePromise(ctx, t, T); return; }
    const c = cam(t), ps = pose(t);
    let HANDS = null;
    S.landWorld(ctx, c, t, {
      promise: promise(t),
      promiseExtra: (cx) => { for (let i = 3; i >= 0; i--) listTag(cx, t, i); },
      cool: smooth(span(t, a.robots - .4, a.work + .8)),
      land: (cx) => progTag(cx, t),
      you: { o: ps },
      roof: (cx, h) => {
        HANDS = h;
        const sa = slipA(t); if (sa <= 0 || !h) return;
        const hr = slipHand(t), L = h.L ?? h.R, Rh = h.R ?? h.L;
        const x = lerp(L[0] - 8, Rh[0] + 8, hr), y = lerp(L[1] - 14, Rh[1] - 16, hr) - 40 * Math.sin(Math.PI * hr);
        F.paySlip(cx, t, x, y, lerp(20, 62, expoOut(sa)), { glow: slipGlow(t), rot: lerp(.2, -.25, hr), a: clamp(sa * 3) });
      },
    });
    // the receipt: printed out of the promise's face (screen space between the two cards), into your right hand
    const ru = recU(t);
    if (ru > 0 && HANDS?.R) {
      const f0 = E.project(c, S.Z_PROMISE, FACE[0], FACE[1]), h1 = E.project(c, F0, HANDS.R[0] + 6, HANDS.R[1] - 8);
      if (f0 && h1) F.receipt(ctx, t, { from: [f0[0], f0[1]], to: [lerp(f0[0], h1[0], 1), h1[1]], u: ru, w: 210 * Math.min(1.1, f0[2]), bend: .9,
        rows: [['RENT', span(t, a.rent - .1, a.rent + .7)], ['GROCERIES', span(t, a.groc - .1, a.groc + .7)], ['THE POWER BILL', span(t, a.bill - .1, a.bill + .7)]], roll: 1 });
    }
    // the credit of the quote (0:06–0:12; the hook's only source line, before 0:30)
    F.source(ctx, t, a.nec + .3, a.receipts - .2, F.SOURCES.promiseCredit);
    // H.01: the title (frame 0 = thumbnail A), it sinks before the list comes
    F.title(ctx, t, 1, { x: 80, y: 380, maxW: 1080, out: span(t, a.say + 2.0, a.housing + .3) });
  };
}
