// Film 26 · B3 · c08–c11 as ONE continuous take (7:01 → end). scenes/sc08.mjs … sc11.mjs each return one entry that draws this same
// function, so the inner chunk boundaries (c08|c09 inside the light door, c09|c10 on the flying check, c10|c11 under the big test card)
// are identical frames by construction. Plan: docs/shots.md 8.01–11.10 · world/rules: docs/MOTION.md · pieces: lib/f26_b3_world.mjs.
//
// | stretch | anchor (phrase)                 | place / camera                                                                                  |
// |---------|---------------------------------|-------------------------------------------------------------------------------------------------|
// | 8.01    | If he's wrong, you're still fine| platePiggy (B2 seam) → creep on; line 5 lifts (testCard)                                        |
// | 8.02    | This is the line his advice     | the card glides big, resting on line 5 (a gold base under it)                                   |
// | 8.03–05 | Think of it as two bets …       | the balance grows in the sky over the hill: KEEP SAVING (you, coins → dust) · STOP SAVING (older)|
// | 8.06 ★  | One mistake costs you a little  | a small dip left (anticipation) — then the beam slams right; pull back wide, dust jumps          |
// | 8.07    | Nearly two in three             | down to three figures on the hill, two lit gold; 64 % · ALLIANZ LIFE, 2025                       |
// | 8.08–14 | And the bet isn't the same …    | the pans: a stack of machine chips · a savings book; the optimist card (a coin flips into it),   |
// |         |                                 | "for quality of life" underlined, dawn behind; one chip falls; RISK sinks onto the book's side   |
// | 8.15–16 | So the fifth line · Is there    | ✗ (testCard); the card dims; the archive window on the far shore glows; dive into its box (W)    |
// | 9.01–04 | There is …                      | out of a gas lamp: the old street, 1889; the quote ribbon; under it to the factory gate (shift)  |
// | 9.05    | Germany answered first          | up: a law page rises behind the roof; three hands drop coins into one chest                      |
// | 9.06–07 | America followed · [C5]         | truck right to the cinema of 1935: its newsreel screen grows into the C5 plate                   |
// | 9.08–09 | His answer … With amounts       | the plate shrinks into a page, a pen signs it; the chest fills 1937–39, the 1940 check rises     |
// | 10.01 ★ | Then one winter                 | the check flies to snowy Vermont: Ida May Fuller opens her mailbox, holds check No. 1            |
// | 10.02–05| She kept getting them …         | seasons turn, checks stack up (PAID IN · RECEIVED); BY LAW; 2033 → ≈ 78 %, a wrench; promise vs law|
// | 10.06   | If machines really do           | dive into the law page (W) → out of it over your street: the shop full, the empty page           |
// | 10.07–09| A right … That law doesn't exist| RIGHT · WRITTEN DOWN · FUNDED; the older you, a sketched check; hands with pens, the dome far off  |
// | 11.01–04| The five lines, then            | the test card big (testCard final); the camera rises into the stars (sky door)                   |
// | 11.05–08| Maybe one day … the bridge ★    | down over the hill's bluff: the far shore glows; the dust lays planks; you step onto your bridge |
// | 11.09–10| This channel exists · END       | wide: the broad bridge, people walking across; 15 s end screen, right two thirds quiet           |
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
import * as S from './f26_seams.mjs';
import * as B from './f26_b3_world.mjs';
const TAU = Math.PI * 2;
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo } = E;
const F0 = E.F0;
export const PRINT = F.PRINT26;

const CACHE = new WeakMap();
export function b3(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const a = anchors(T), draw = build(T, a);
  const out = { a, draw };
  CACHE.set(T, out); return out;
}

// ======================================================================================================================== ANCHORS (phrases only)
function anchors(T) {
  const G = (p, after = -1, n = 0) => T.G(p, n, after), GE = (p, after = -1, n = 0) => T.GE(p, n, after);
  const g = (p, after, fb) => (T.gHas(p, 0, after) ? T.G(p, 0, after) : fb);
  const a = {};
  a.T0 = G("If he's wrong, you're still fine", -1, 1);
  a.rests = G('This is the line his advice', a.T0); a.bets = G('Think of it as two bets', a.T0);
  a.keep = G('You keep saving', a.T0); a.never = G('never needed', a.keep);
  a.stop = G('You stop saving', a.T0); a.isnt = G("isn't there", a.stop);
  a.costs = G('One mistake costs', a.T0); a.other = G('The other costs', a.costs); a.oldage = G('old age', a.other);
  a.nearly = G('Nearly two in three', a.T0); a.dying = G('dying', a.nearly);
  a.notsame = G("And the bet isn't the same", a.T0); a.musk = G('Musk has said', a.T0);
  a.quality = G('He was talking about quality', a.T0); a.qol = G('quality of life', a.quality); a.point = G('may have a point', a.quality);
  a.depends = G('With money, it depends', a.T0); a.owns = G('For someone who owns', a.T0); a.nothing = G('almost nothing', a.owns);
  a.only = G('For someone with only', a.T0); a.everything = G('cost everything', a.only);
  a.charge = G("That's not a charge", a.T0); a.lands = GE('the risk lands', a.charge);
  a.fifth = G('So the fifth line', a.T0); a.yours = GE('the risk is yours', a.fifth);
  a.way = G('Is there a way', a.T0);
  a.c09 = G("There is It's been", a.T0);
  a.expects = G('Musk himself expects', a.c09); a.lived = G('People have lived through', a.c09);
  a.when = G('When machines turned work', a.c09); a.old = G("when we're old", a.when);
  a.germany = G('Germany answered first', a.c09); a.workers = G('paid for by workers', a.germany); a.state = G('the state', a.workers);
  a.america = G('America followed', a.c09); a.signing = G('At the signing', a.america);
  a.C5 = T.clip('C5');
  a.answer = G("His answer wasn't a promise", a.C5.end - 1); a.law = G('It was a law', a.answer);
  a.amounts = G('With amounts', a.law); a.monthly = g('first monthly check', a.amounts, a.amounts + 3.6);
  a.c10 = G('Then one winter', a.amounts); a.mailbox = G('opened her mailbox', a.c10); a.ida = G('Ida May Fuller', a.c10); a.checkone = G('Check number one', a.c10);
  a.kept = G('She kept getting them', a.c10); a.hundred = G('a hundred', a.kept);
  a.generous = G('Not because someone was generous', a.c10); a.saidso = G('Because the law said so', a.c10);
  a.repairs = G('Even this law needs repairs', a.c10); a.unless = G('Unless Congress acts', a.repairs); a.shrink = G('will shrink', a.unless); a.notstop = G('Shrink, not stop', a.repairs);
  a.diff = G("That's the difference", a.c10); a.canbe = G('A promise can be kept', a.diff); a.hasto = G('A law has to be', a.diff); a.hastoE = GE('A law has to be', a.diff);
  a.ifm = G('If machines really do', a.c10); a.counts = G('only counts', a.ifm);
  a.right = G('A right, written down', a.ifm); a.written = G('written down', a.right); a.paid = G('paid for before', a.right);
  a.daystop = G('The day you stop working', a.right); a.checkin = G('a check in your mailbox', a.daystop); a.forecast = G('Not because a forecast', a.daystop); a.lawsays = G('Because a law says so', a.daystop);
  a.exist = G("That law doesn't exist yet", a.daystop); a.voters = G('voters and lawmakers', a.exist);
  a.c11 = G('The five lines, then', a.exist);
  a.advice = G('As advice', a.c11); a.maybe = G('Maybe one day', a.c11); a.worth = G('worth having', a.maybe);
  a.someone = G('But someone has to pay', a.c11); a.until = G('Until a law does', a.c11); a.isyou = G('that someone is you', a.until);
  a.saving = G('Saving was never', a.c11); a.bridge = G('the bridge to it', a.saving); a.bridgeE = GE('the bridge to it', a.saving);
  a.channel = G('This channel exists', a.c11); a.across = G('makes it across', a.channel); a.subscribe = GE('Then subscribe', a.channel);
  a.end = T.duration;
  return a;
}

// ======================================================================================================================== GEOMETRY
const BAL = { x: 560, y: 130, w: 760, post: 380 };          // the balance in the sky over the hill (F0 design)
const FIGS = [250, 360, 470];                                 // the three figures on the hill (8.07)
const ZR = F0 * .74;                                          // the quote ribbon's card (in front of the old street: the camera passes under it)
const RIB = { x: 230, y: 150, w: 1460 };
const PAGE89 = { x: 1290, y: -150, w: 280, Z: F0 * 1.12 };     // the 1889 law page (behind the factory roof, it rises from there)
const CHEST89 = { x: 2010, y: 330, w: 250 };
const PAGE35 = { x: 2300, y: -330, w: 300 };                  // the Social Security Act (sky over the cinema)
const CHEST35 = { x: 2860, y: 70, w: 280 };
const LAWP = { x: 4560, y: -60, w: 280 };                     // the solid law page over Vermont (10.05) = the dive target
const PROM = { x: 3990, y: 30, w: 380 };                       // the dashed promise check (10.05)
const PAGE2 = { x: 1250, y: -330, w: 260 };                    // the empty law page over your street (10.06–10.09)
const STACK = { x: 4470, y: 560 };                             // the checks she received (10.02)
const ROW = { y: 140, x0: 3760, x1: 4980, cal: 4300 };          // 10.04: the monthly checks march past the 2033 page
const pageC = (p) => [p.x + p.w / 2, p.y + p.w * .65];

function build(T, a) {
  const TT = F.testTimes(T);
  // ---------------------------------------------------------------------------------------------------- door times
  const tf1 = a.c09;                     // light door 1: the archive box → the gas lamp (peak = the chunk boundary)
  const tDive1 = a.fifth + .6;   // from the fifth line on, the camera already drifts toward the warm light in the city (8.15 → 8.16)
  const tf2 = a.ifm + .35;               // light door 2: the law page over Vermont → the page over your street
  const tDive2 = Math.max(a.hastoE - .2, tf2 - 2.2);
  const tS1 = a.advice + .6;   // sky door: street → hill (camera up in the stars, under the big card)
  const tUp = tS1 - .9;
  const tDown0 = Math.max(tS1 + .8, a.maybe - 1.6), tDown1 = a.maybe + 2.8;
  const tPlate = a.T0 + S.SEAM_HALF;
  const C5 = a.C5;

  // ---------------------------------------------------------------------------------------------------- c08 camera (hill, F0)
  const plate = S.plateCam(tPlate, a.T0, F0, 960, 540, 1);
  const K8 = [
    [a.T0 - 1, S.plateCam(a.T0 - 1, a.T0, F0, 960, 540, 1)],   // keys on the plate's own creep: the glide leaves the seam at its speed
    [tPlate, plate],
    [tPlate + .8, S.plateCam(tPlate + .8, a.T0, F0, 960, 540, 1)],
    [a.rests + 1.6, E.aim(F0, 920, 500, 1.06)],
    [a.bets + 1.4, E.aim(F0, 620, 330, 1.02)],
    [a.keep + .7, E.aim(F0, 250, 285, 1.55)],
    [a.stop + .7, E.aim(F0, 880, 285, 1.55)],
    [a.costs + .5, E.aim(F0, 600, 300, 1.2)],
    [a.other + 1.4, E.aim(F0, 800, 470, .8)],
    [a.nearly + 1.0, E.aim(F0, 400, 770, 1.55)],
    [a.notsame + 1.1, E.aim(F0, 560, 300, 1.22)],
    [a.musk + .6, E.aim(F0, 540, 230, 1.0)],
    [a.quality + .4, E.aim(F0, 620, 265, 1.2)],
    [a.depends + .2, E.aim(F0, 690, 300, 1.42)],
    [a.owns + .7, E.aim(F0, 240, 285, 1.6)],
    [a.only + .7, E.aim(F0, 880, 285, 1.6)],
    [a.charge + .9, E.aim(F0, 620, 230, 1.12)],
    [a.fifth + .6, E.aim(F0, 690, 200, .92)],
  ];
  const DIVE1 = (t) => {   // a steady push that accelerates into the window (linear share + exponential: never stalls)
    const A = F.camPath(tDive1, K8), Bc = E.aim(B.ARCH.Z, B.ARCH.x - 5, B.ARCH.y + B.ARCH.h * .36 - 8, 80), x = span(t, tDive1, tf1);
    const u = .3 * (x - Math.sin(TAU * x) / TAU) + .7 * (Math.exp(6.5 * x) - 1) / (Math.exp(6.5) - 1), uxy = sineIO(span(x, 0, .55)), Z = B.ARCH.Z, out = E.cam3();
    for (const k of ['x', 'y', 'f', 'roll']) out[k] = lerp(A[k] ?? out[k], Bc[k] ?? out[k], k === 'x' || k === 'y' ? Math.max(uxy, u) : u);
    out.z = Z - Math.exp(lerp(Math.log(Z - A.z), Math.log(Z - Bc.z), u)); return out; };

  // ---------------------------------------------------------------------------------------------------- c09–c10 camera (old street, F0)
  const LAMPX = B.GASLAMPS[1], LAMPY = B.OLD_GROUND + 70 - B.LAMP_H * .93;
  const OUT1 = [[tf1, E.aim(S.Z_LAMP, LAMPX, LAMPY, 9)], [tf1 + 1.6, E.aim(F0, 640, 540, .92), 'o']];
  const CINEC = [B.CINE.x + B.CINE.w / 2, B.CINE.y + B.CINE.h / 2];
  const tFly0 = a.monthly + .9, tFly1 = a.mailbox + .1;     // the 1940 check flies to Vermont
  const K9 = [
    [tf1 + 1.6, E.aim(F0, 640, 540, .92)],
    [a.expects + 1.2, E.aim(F0, 860, 330, .95)],
    [a.lived + 1.6, E.aim(F0, 1420, 640, 1.45)],
    [a.old, E.aim(F0, 1520, 700, 1.7)],
    [a.germany + 1.6, E.aim(F0, 1690, 170, .98)],
    [a.state + .6, E.aim(F0, 1810, 140, 1.1)],
    [a.america + 1.6, E.aim(F0, 2560, 560, 1.08)],
    [C5.start - .2, E.aim(F0, CINEC[0], CINEC[1], 1.6)],
    [C5.end - 2, E.aim(F0, CINEC[0] + 20, CINEC[1] - 120, 1.4)],
    [C5.end - .3, E.aim(F0, 2560, -60, 1.12)],
    [a.law + .6, E.aim(F0, 2600, -80, 1.2)],
    [a.amounts + 1.4, E.aim(F0, 2690, -40, 1.08)],
    [tFly0, E.aim(F0, 2800, 20, 1.08)],
    [(tFly0 + tFly1) / 2 + .2, E.aim(F0, 3700, 380, .82)],
    [a.ida, E.aim(F0, 4210, 700, 1.4)],
    [a.checkone + .8, E.aim(F0, 4225, 705, 1.55)],
    [a.kept + 1.0, E.aim(F0, 4330, 650, 1.12)],
    [a.saidso, E.aim(F0, 4350, 560, 1.05)],
    [a.repairs + 1.0, E.aim(F0, 4380, 130, 1.25)],
    [a.notstop + .6, E.aim(F0, 4400, 120, 1.28)],
    [a.canbe, E.aim(F0, 4400, 120, 1.0)],
    [tDive2, E.aim(F0, 4560, 160, 1.15)],
  ];
  const pc = pageC(LAWP);
  const DIVE2 = (t) => E.camAt(t, [[tDive2, F.camPath(tDive2, K9)], [tf2, E.aim(F0, pc[0], pc[1], 9), 'i']]);
  // ---------------------------------------------------------------------------------------------------- c10 street → c11
  const p2 = pageC(PAGE2);
  const OUT2 = [[tf2, E.aim(F0, p2[0], p2[1], 9)], [tf2 + 1.6, E.aim(F0, 1330, 300, .72), 'o']];
  const K10 = [
    [tf2 + 1.6, E.aim(F0, 1330, 300, .72)],
    [a.right + .5, E.aim(F0, 1360, 20, 1.15)],
    [a.paid + .6, E.aim(F0, 1380, -20, 1.35)],
    [(a.paid + a.daystop) / 2 + .5, E.aim(F0, 1120, 360, .86)],
    [a.daystop + 1.9, E.aim(F0, 870, 730, 1.5)],
    [a.lawsays + .4, E.aim(F0, 930, 690, 1.68)],
    [a.exist + 1.6, E.aim(F0, 1130, 260, .62)],
    [a.c11 + .6, E.aim(F0, 1180, 180, .7)],
    [a.c11 + 6, E.aim(F0, 1210, 100, .76)],
    [tUp, E.aim(F0, 1250, -1250, .95)],
    [tS1, E.aim(F0, 1300, -1750, 1)],
  ];
  // ---------------------------------------------------------------------------------------------------- c11 camera (the hill's end)
  const ENDX = 3150, ENDV = 482, ENDS = .75;
  const K11 = [
    [tS1, E.aim(F0, 1300, -1750, 1)],
    [tDown0, E.aim(F0, 2300, -1700, 1)],
    [tDown1, E.aim(F0, 2900, 560, .7)],
    [a.someone + 1.4, E.aim(F0, 2280, 780, 1.08)],
    [a.until + 1.4, E.aim(F0, 2620, 740, 1.02)],
    [a.saving + .5, E.aim(F0, 2470, 810, 1.28)],
    [a.bridgeE + 1.2, E.aim(F0, 2720, 740, 1.02)],
    [a.across, E.aim(F0, ENDX - 60, ENDV + 30, ENDS + .03)],
    [a.end - 14.5, E.aim(F0, ENDX, ENDV, ENDS)],
    [a.end, E.aim(F0, ENDX + 280, ENDV - 16, ENDS * 1.07)],
  ];

  // ======================================================================================================== c08 · the balance
  const tilt = (t) => {
    let v = .008 * Math.sin(t * 1.1);
    v += -.06 * expoOut(span(t, a.costs + .3, a.costs + 1.2)) * (1 - sineIO(span(t, a.other - .2, a.other + .2)));
    const slam = expoOut(span(t, a.other + .25, a.other + 1.25));
    v += .3 * slam + .05 * Math.sin(Math.PI * 2 * span(t, a.other + .9, a.other + 3.2)) * (1 - span(t, a.other + .9, a.other + 3.2));
    v = lerp(v, -.09 + .008 * Math.sin(t * 1.1), sineIO(span(t, a.nearly + 1.0, a.notsame + .5)));   // back to the new stakes (the stack is heavier)
    v += .012 * sineIO(span(t, a.owns + 1.8, a.owns + 2.6));                                     // one chip falls: it barely moves
    v += .39 * expoOut(span(t, a.lands - .1, a.lands + 1.0)) + .03 * Math.sin(Math.PI * 2 * span(t, a.lands + .6, a.lands + 2.4)) * (1 - span(t, a.lands + .6, a.lands + 2.4));
    return v;
  };
  const pans = (t) => { const tl = tilt(t), c = Math.cos(tl), s = Math.sin(tl), L = [BAL.x - c * BAL.w / 2, BAL.y - s * BAL.w / 2], R = [BAL.x + c * BAL.w / 2, BAL.y + s * BAL.w / 2], sl = BAL.w * .26;
    return { L: [L[0], L[1] + sl - 2], R: [R[0], R[1] + sl - 2] }; };
  const tSwap = (a.dying + a.notsame) / 2;
  const balU = (t) => span(t, a.bets - .3, a.bets + 1.5) * (1 - expoIn(span(t, a.way + .4, a.way + 1.8)));
  const leftPan = (t) => (ctx, x, y) => {
    if (t < tSwap) {   // you + a small heap of coins that turns to dust
      const du = span(t, a.never - .4, a.never + 1.0), sh = Math.sin(Math.PI * span(t, a.never - .2, a.never + 1.2));
      E.du(ctx, x - 34, y, 120, { look: -.1 + .03 * Math.sin(t), armR: [lerp(.2, 1.1, sh), lerp(.1, 1.9, sh)], armL: [lerp(-.2, -1.1, sh), lerp(-.1, -1.9, sh)], lean: -.03 * sh, light: 1, back: .3 });
      const heap = [[18, 0], [36, 0], [27, -7], [54, 0], [45, -7], [36, -14]];
      for (const [hx, hy] of heap) F.coin(ctx, x + hx, y + hy - 6, 9 * (1 - du), { flip: 1.35, glint: .3 });
      if (du > 0) F.goldDust(ctx, t, [[x + 36, y - 10], [x + 70, y - 90], [x + 150, y - 190]], { n: 70, seed: 81, spread: 18, a: Math.sin(Math.PI * clamp(du * 1.2)) + .25 * clamp(du), size: 2, speed: .35 });
      const jump = expoOut(span(t, a.other + .25, a.other + .9)) * (1 - span(t, a.other + .9, a.other + 2.6));
      if (jump > 0) F.goldDust(ctx, t, [[x - 50, y], [x, y - 60 * jump], [x + 60, y]], { n: 40, seed: 82, spread: 26, a: jump, size: 2.2, speed: .5 });
    } else {   // the owner of the machines, beside his tall stack
      E.person(ctx, x - 52, y, 118, { dir: 1, look: .05 + .02 * Math.sin(t * .9), armR: [.35, .5], light: 1, back: .25 });
      const fall = span(t, a.owns + 1.6, a.owns + 2.8);
      B.chips(ctx, t, x + 22, y - 2, 15, 26, { u: span(t, tSwap, a.notsame + 1.6), fall });
    }
  };
  const rightPan = (t) => (ctx, x, y) => {
    if (t < tSwap) {   // the older you beside an empty piggy
      F.older(ctx, x + 30, y, 120, { look: -.2 + .02 * Math.sin(t * 1.2), dir: -1, armR: [.15, .1], light: -1, back: .3, lean: .12 });
      F.piggy(ctx, t, x - 22, y, 62, { crack: 0, warm: 0, lit: .5, dark: .4, fill: 0, dir: 1 });
    } else {   // someone with only a savings book
      E.person(ctx, x + 40, y, 112, { dir: -1, look: -.05 + .02 * Math.sin(t * 1.3), armR: [.55, 1.0], light: -1, back: .25, long: true });
      B.savingsBook(ctx, t, x - 8, y - 2, 46, { glint: .2 + .5 * bumpU(t, a.only + .3, 1.8) });
      if (t > a.charge - .2) {   // RISK: lowered slowly from the sky onto this pan
        const u = sineIO(span(t, a.charge, a.lands - .1)), yy = lerp(y - 640, y - 2, u), xx = x - 6;
        if (u < 1) { ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xx, yy - 160 * 0 - 99); ctx.lineTo(xx, yy - 900); ctx.stroke(); }
        B.riskWeight(ctx, t, xx, yy, 74, { text: F.rise(span(t, a.charge + .4, a.charge + 1.2)) });
        if (t > a.lands - .1 && t < a.lands + 1.2) halo(ctx, xx, y, 120, .5 * (1 - span(t, a.lands - .1, a.lands + 1.2)), F.ROSE.deep, F.ROSE.mark);
      }
    }
  };
  const bigger = (fn, k = 1.3) => (ctx, x, y) => { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(ctx, x, y); ctx.restore(); };   // pan contents read bigger
  const bumpU = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
  const balLabels = (ctx, t, P2) => {
    const lab = (txt, x, y, t0, t1) => { const u = F.rise(span(t, t0, t0 + .8)) * (1 - expoIn(span(t, t1 - .5, t1))); if (u > 0) F.maskLine(ctx, [[txt, 0]], x, y, 22, u, { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false }); };
    lab("KEEP SAVING · HE'S RIGHT", P2.L[0], P2.L[1] + 50, a.keep + .2, a.nearly + .6);
    lab("STOP SAVING · HE'S WRONG", P2.R[0], P2.R[1] + 50, a.stop + .2, a.nearly + .6);
  };
  // the three figures (8.07): standing on the hill in the dark; two of them catch the gold
  const figures = (ctx, t) => {
    if (t < a.costs || t > a.musk + 2) return;
    FIGS.forEach((x, i) => {
      const g = i ? expoOut(span(t, a.nearly + .5 + i * .35, a.nearly + 1.4 + i * .35)) * (1 - span(t, a.notsame + 1, a.notsame + 2.5)) : 0;
      if (g > 0) halo(ctx, x, S.DU_HILL.y - 80, 190, .6 * g, P.halo1, P.core1);
      E.person(ctx, x, S.DU_HILL.y, 150, { dir: i === 2 ? -1 : 1, look: .1 + .025 * Math.sin(t * .9 + i), light: i === 2 ? -1 : 1, back: .15 + .85 * g, rim: g > .05 ? mixHex(P.blue0, P.core1, g) : undefined, long: i === 1 });
    });
    const u = F.rise(span(t, a.nearly + .9, a.nearly + 1.7)) * (1 - expoIn(span(t, a.notsame - .1, a.notsame + .4)));
    if (u > 0) { F.maskLine(ctx, [['64', 0]], 340, 700, 120, u, { align: 'center' }); F.maskLine(ctx, [['%', 0]], 425, 700, 60, u, { align: 'left' }); }
  };
  // the optimist card (screen): a coin from the piggy's stream flips into it; "for quality of life" underlined; it glides away up
  const OPT = { lines: [...F.QUOTES.optimist.lines, '… for quality of life'], src: F.QUOTES.optimist.src, quoted: true };
  const CARD = { x: 470, y: 150, w: 980, h: 330 };
  const optCard = (ctx, c, t) => {
    const t0 = a.musk - .2; if (t < t0 || t > a.depends + 1.4) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const cr = S.crackOf(), p0 = E.project(c, F0, cr[0], cr[1]), tx = CARD.x + CARD.w / 2, ty = CARD.y + CARD.h / 2, fl = span(t, t0, t0 + .8);
    if (fl < 1 && p0) { const u = sineIO(fl), cx = lerp(p0[0], tx, .5), cy = Math.min(p0[1], ty) - 260;
      F.coin(ctx, (1 - u) ** 2 * p0[0] + 2 * u * (1 - u) * cx + u * u * tx, (1 - u) ** 2 * p0[1] + 2 * u * (1 - u) * cy + u * u * ty, lerp(20, 40, u), { flip: lerp(0, Math.PI * 4.5, u), glint: .5 }); ctx.restore(); return; }
    const op = expoOut(span(t, t0 + .8, t0 + 1.4)), away = expoIn(span(t, a.depends - .1, a.depends + 1.1)), w = CARD.w * op;
    const yy = CARD.y - away * (CARD.y + CARD.h + 60);
    ctx.save(); ctx.translate(tx, yy + CARD.h / 2); ctx.scale(Math.max(.001, w / CARD.w), 1);
    F.qcard(ctx, t, -CARD.w / 2, -CARD.h / 2, CARD.w, CARD.h, OPT, span(t, t0 + .9, t0 + 2.2), { size: 44 });
    // the gold underline under "for quality of life"
    const lu = expoOut(span(t, a.qol - .1, a.qol + .9));
    if (lu > 0) { const s = 44, l3 = '… for quality of life”', full = F.measure(l3, s), pre = F.measure('… ', s), part = F.measure('for quality of life', s), ly = -CARD.h / 2 + CARD.h * .42 + 2 * s * 1.12 - s * .5 * 2 + 12;
      const x0 = -full / 2 + pre; ctx.fillStyle = P.halo0; ctx.fillRect(x0, ly, part * lu, 4); halo(ctx, x0 + part * lu, ly, 40, .5 * (1 - lu)); }
    ctx.restore();
    if (op < 1) halo(ctx, tx, ty, 90, .5 * (1 - op));
    ctx.restore();
  };

  // ======================================================================================================== c09 · 1889 → 1935
  const workers = (t) => {
    const out = [];
    if (t < a.lived - 1 || t > a.germany + 4) return out;
    const r = [0, 1, 2, 3, 4, 5].map((i) => [(i * .37) % 1, i % 2 ? 1 : -1]);   // shift change: workers leave the gate both ways
    r.forEach(([off, dir], i) => { const s0 = a.lived - 1 + off * 3, d = (t - s0) * 70; if (d < 0) return; const x = B.GATE.x + B.GATE.w / 2 + dir * (40 + d); out.push({ x, walk: t * 5.4 + i, dir, h: 196 + (i % 3) * 8 }); });
    out.push({ x: B.GATE.x - 70, old: true, dir: 1, h: 200, look: lerp(-.18, .15, smooth(span(t, a.old - .4, a.old + .6))) + .02 * Math.sin(t * .8) });
    return out;
  };
  const coinsTo = (ctx, t, from, to, t0, d, r = 13) => {   // a coin arcs from a hand into the chest's mouth
    const u = span(t, t0, t0 + d); if (u <= 0 || u >= 1) return;
    const k = sineIO(u), cx = lerp(from[0], to[0], .5), cy = Math.min(from[1], to[1]) - 120;
    F.coin(ctx, (1 - k) ** 2 * from[0] + 2 * k * (1 - k) * cx + k * k * to[0], (1 - k) ** 2 * from[1] + 2 * k * (1 - k) * cy + k * k * to[1], r, { flip: t * 6, glint: .6 });
  };
  const germany = (ctx, t) => {   // the law page + the chest + three hands (F0, sky over the factory)
    const u = span(t, a.germany - .3, a.germany + 1.4) * (1 - expoIn(span(t, a.america + .2, a.america + 1.4)));
    if (u <= 0) return;
    const C = CHEST89, mouth = [C.x, C.y - C.w * .5 - 4];
    const hu = (i) => expoOut(span(t, a.workers - .2 + i * .45, a.workers + .7 + i * .45));
    const ch = B.chest(ctx, t, C.x, C.y, C.w, { open: expoOut(span(t, a.germany + .4, a.germany + 1.4)), fill: span(t, a.workers + .5, a.state + 1.6) * u, a: clamp(u * 3) });
    const HANDS = [[C.x - 330, C.y - 230, .55, 'WORKERS'], [C.x, C.y - 420, 1.57, 'EMPLOYERS'], [C.x + 330, C.y - 230, 2.6, 'STATE']];
    HANDS.forEach(([hx, hy, ang, lab], i) => {
      const k = hu(i); if (k <= 0) return;
      const back = 160 * (1 - k), wx = hx - Math.cos(ang) * back, wy = hy - Math.sin(ang) * back;
      const tip = B.hand(ctx, wx, wy, ang, 62, { pose: 'hold', curl: lerp(.2, 0, span(t, a.workers + .3 + i * .45, a.workers + .7 + i * .45)), rim: rgba(P.blue0, .8), a: u, flip: i === 2 ? -1 : 1 });
      coinsTo(ctx, t, tip, mouth, a.workers + .4 + i * .45, .7, 14);
      const lu = F.rise(span(t, a.workers + i * .45, a.workers + .8 + i * .45)) * u;
      F.maskLine(ctx, [[lab, 0]], hx - Math.cos(ang) * 120, hy - Math.sin(ang) * 120 - 26, 22, lu, { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false });
    });
    void ch;
  };
  const germanyPage = (ctx, t) => {   // behind the factory roof: the page rises from there (Z = PAGE89.Z)
    const u = span(t, a.germany - .4, a.germany + 1.6) * (1 - expoIn(span(t, a.america + .2, a.america + 1.4)));
    if (u <= 0) return;
    const rise0 = (1 - expoOut(span(t, a.germany - .4, a.germany + 1.2))) * 520;
    B.lawPage(ctx, t, PAGE89.x, PAGE89.y + rise0, PAGE89.w, { title: ['GERMANY', 'June 22, 1889'], type: span(t, a.germany + .4, a.workers + .6), seed: 6 });
    F.maskLine(ctx, [['PENSION FROM AGE 70', 0]], PAGE89.x + PAGE89.w / 2, PAGE89.y + rise0 + PAGE89.w * 1.3 + 44, 24, F.rise(span(t, a.germany + 1.2, a.germany + 2.0)) * (1 - expoIn(span(t, a.america + .2, a.america + .9))), { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false });
  };
  // the Social Security Act (1935) and the chest that fills 1937–1939, then the 1940 check rises
  const ssa = (ctx, t, c) => {
    if (t < C5.end - .4 || t > a.kept + 1) return;
    const pu = span(t, C5.end + .6, C5.end + .75) > 0 ? 1 : 0;   // the page's paper (after the plate has shrunk onto it)
    const sig = span(t, a.law - .4, a.law + 1.3);
    const P1 = B.lawPage(ctx, t, PAGE35.x, PAGE35.y, PAGE35.w, { u: pu, title: ['SOCIAL SECURITY ACT', 'Aug 14, 1935'], type: span(t, C5.end + .7, a.answer + 1.2), sig, seed: 9, a: 1 - expoIn(span(t, a.c10 + .3, a.c10 + 1.4)) });
    if (P1 && sig > 0 && sig < 1.2) { const tip = P1.sigTip || [PAGE35.x + PAGE35.w * .5, PAGE35.y + PAGE35.w * 1.1]; B.pen(ctx, tip[0], tip[1], -.55, 170, span(t, a.law - .6, a.law - .3) * (1 - span(t, a.law + 1.4, a.law + 1.8))); }
    const ca = span(t, a.amounts - .6, a.amounts + .4) * (1 - expoIn(span(t, a.c10 + 1.2, a.c10 + 2.4)));
    if (ca > 0) {
      const C = CHEST35, years = ['1937', '1938', '1939', '1940'], yi = clamp(Math.floor(span(t, a.amounts + .2, a.monthly + .2) * 3.999), 0, 3);
      const fill = span(t, a.amounts + .2, a.monthly + .2);
      B.chest(ctx, t, C.x, C.y, C.w, { open: expoOut(span(t, a.amounts - .4, a.amounts + .6)), fill, a: clamp(ca * 2) });
      for (let k = 0; k < 9; k++) { const t0 = a.amounts + .1 + k * (a.monthly - a.amounts) / 9; coinsTo(ctx, t, [C.x - 260 + (k % 3) * 40, C.y - 380], [C.x, C.y - C.w * .5], t0, .55, 11); }
      F.maskLine(ctx, [[years[yi], 0]], C.x, C.y - C.w * .5 - 150, 64, F.rise(span(t, a.amounts, a.amounts + .6)) * (1 - expoIn(span(t, tFly0 - .3, tFly0 + .3))), { align: 'center' });
      F.maskLine(ctx, [['JAN 31, 1940', 0]], C.x, C.y + 52, 22, F.rise(span(t, a.monthly, a.monthly + .8)) * (1 - expoIn(span(t, tFly0 + .2, tFly0 + .8))), { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false });
    }
  };
  // the 1940 check: rises out of the chest, flies to Vermont, into the mailbox (F0 design path)
  const CHW = 150;
  const checkPath = (t) => {
    const m0 = [CHEST35.x - CHW / 2, CHEST35.y - CHEST35.w * .5 - 10];
    const up = expoOut(span(t, a.monthly - .1, a.monthly + .8)), s0 = [m0[0], m0[1] - 110 * up];
    if (t < tFly0) return [s0[0], s0[1], 1, 0];
    const u = sineIO(span(t, tFly0, tFly1)), box = [B.OLDBOX.x - B.OLDBOX.h * .45 - 40, B.OLDBOX.y - B.OLDBOX.h * .51];
    const cx = (s0[0] + box[0]) / 2, cy = Math.min(s0[1], box[1]) - 380;
    return [(1 - u) ** 2 * s0[0] + 2 * u * (1 - u) * cx + u * u * box[0], (1 - u) ** 2 * s0[1] + 2 * u * (1 - u) * cy + u * u * box[1], lerp(1, .42, u), u];
  };
  const flyingCheck = (ctx, t) => {
    if (t < a.monthly - .1 || t > tFly1 + .05) return;
    const [x, y, s, u] = checkPath(t);
    if (u > 0) F.goldDust(ctx, t, [0, .1, .2, .3].map((d) => { const p = checkPath(Math.max(tFly0, t - d)); return [p[0] + CHW * p[2] / 2, p[1] + 30 * p[2]]; }).reverse(), { n: 40, seed: 51, spread: 10, a: .8, size: 2, speed: .7 });
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.12 * Math.sin(Math.PI * u)); F.check(ctx, t, 0, 0, CHW * s, { from: 'U.S. TREASURY', a: 1 }); ctx.restore();
    halo(ctx, x + CHW * s / 2, y + CHW * s * .22, 120 * s, .35);
  };

  // ======================================================================================================== c10 · Vermont
  const age = (t) => span(t, a.kept - .2, a.generous + .2);
  const season = (t) => 8 * sineIO(span(t, a.kept - .1, a.saidso - .4));   // two years per … (two full turns of the seasons)
  const winterW = (t) => { const s = season(t) % 4; return clamp(1 - Math.min(s, 4 - s) * 1.2); };
  const idaState = (t) => {
    const open = expoOut(span(t, a.mailbox + .1, a.mailbox + .8));
    const reach = sineIO(span(t, a.mailbox - .2, a.mailbox + .5)) * (1 - sineIO(span(t, a.ida + .2, a.ida + 1.0)));
    const hold = sineIO(span(t, a.ida + .2, a.ida + 1.1));
    const ag = age(t), br = .02 * Math.sin(t * 1.1);
    return { x: B.IDA.x, look: lerp(-.05, .35, hold) - .25 * ag + br, lean: .04 + .16 * ag, armR: [lerp(lerp(.15, 1.35, reach), .9, hold), lerp(lerp(.1, 1.45, reach), 2.0, hold)], armL: [lerp(-.15, .6, hold), lerp(-.1, 2.1, hold)], age: ag, back: .55, light: 1 };
  };
  // Ida's check, in her hands → big (screen) with its details; (★) the warm light of the open mailbox
  const idaCheck = (ctx, c, t, hands) => {
    if (t < a.ida - .1 || t > a.kept + .9 || !hands) return;
    const hx = (hands.R[0] + hands.L[0]) / 2, hy = (hands.R[1] + hands.L[1]) / 2;
    const small = (ctx2) => { ctx2.save(); ctx2.translate(hx - 30, hy - 32); ctx2.rotate(-.08); F.check(ctx2, t, 0, 0, 64, { from: 'U.S. TREASURY' }); ctx2.restore(); };
    const big = expoOut(span(t, a.ida + .9, a.ida + 1.9)) * (1 - expoIn(span(t, a.kept - .3, a.kept + .7)));
    E.card(ctx, c, F0, () => { if (big < .98) small(ctx); halo(ctx, hx, hy - 10, 140, .45); });
    if (big <= 0) return;
    const p = E.project(c, F0, hx - 30, hy - 32); if (!p) return;
    const CW = 760, X1 = 580, Y1 = 330, w = lerp(64 * p[2], CW, big), x = lerp(p[0], X1, big), y = lerp(p[1], Y1, big);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    halo(ctx, x + w / 2, y + w * .22, w * .9, .35 * big);
    ctx.translate(x, y); ctx.rotate(-.08 * (1 - big)); ctx.scale(w / CW, w / CW);
    F.check(ctx, t, 0, 0, CW, { from: 'U.S. TREASURY', pay: big > .5 ? 'Ida May Fuller' : '', amount: big > .5 ? '$22.54' : '', date: big > .5 ? 'JAN 31, 1940' : '', no: 'CHECK No. 00-000-001', sig: big > .5 ? '' : '' });
    ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    F.maskLine(ctx, [['Ida May Fuller', 0]], X1, Y1 - 36, 62, F.rise(span(t, a.ida + 1.2, a.ida + 2.0)) * (1 - expoIn(span(t, a.kept - .4, a.kept + .2))), {});
    ctx.restore();
  };
  // the seasons at the mailbox: one check per turn flies up into her stack; PAID IN · RECEIVED
  const stack = (ctx, t) => {
    const u = span(t, a.kept - .4, a.kept + .4) * (1 - expoIn(span(t, a.repairs - .2, a.repairs + .8))); if (u <= 0) return;
    const n = Math.floor(clamp(season(t) * 3.2, 0, 26));
    // her one coin (paid in) vs the checks she received
    const k = F.rise(span(t, a.kept + .4, a.kept + 1.2)) * u;
    F.coin(ctx, STACK.x - 300, STACK.y - 16, 22, { flip: .25 + .2 * Math.sin(t), glint: .5, a: clamp(k * 2) });
    F.maskLine(ctx, [['PAID IN $24.75', 0]], STACK.x - 300, STACK.y + 46, 22, k, { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false });
    for (let i = 0; i < n + 1; i++) {
      const f = i < n ? 1 : clamp(season(t) * 3.2 - n); if (f <= 0) continue;
      const src = [B.OLDBOX.x - 80, B.OLDBOX.y - 150], dst = [STACK.x - 70, STACK.y - i * 9], e = sineIO(f);
      const x = lerp(src[0], dst[0], e), y = lerp(src[1], dst[1], e) - Math.sin(Math.PI * e) * 140;
      ctx.save(); ctx.translate(x, y); ctx.rotate((i % 3 - 1) * .03); F.check(ctx, t, 0, -26, 140, { from: '' }); ctx.restore();
    }
    F.maskLine(ctx, [['RECEIVED ≈ $22,900', 0]], STACK.x, STACK.y + 46, 22, F.rise(span(t, a.hundred - .2, a.hundred + .6)) * u, { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false });
  };
  // BY LAW: the top check of the stack lifts big, BY LAW appears on it (screen)
  const byLaw = (ctx, c, t) => {
    const u = expoOut(span(t, a.generous + .4, a.generous + 1.4)) * (1 - expoIn(span(t, a.repairs + .2, a.repairs + 1.4))); if (u <= 0) return;
    const p = E.project(c, F0, STACK.x - 70, STACK.y - 26 * 9 - 26); if (!p) return;
    const CW = 640, w = lerp(140 * p[2], CW, u), x = lerp(p[0], 640, u), y = lerp(p[1], 140, u);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(w / CW, w / CW);
    F.check(ctx, t, 0, 0, CW, { from: 'U.S. TREASURY', pay: 'Ida May Fuller', amount: '$22.54', byLaw: span(t, a.saidso + .1, a.saidso + .8) });
    ctx.restore();
  };
  // 10.04: today's checks march past the 2033 calendar page and come out at ≈ 78 %, a wrench beside it (F0, sky over Vermont)
  const repairs = (ctx, t) => {
    const u = span(t, a.repairs - .3, a.repairs + .6) * (1 - expoIn(span(t, a.diff - .2, a.diff + .6))); if (u <= 0) return;
    const run = t - a.repairs, sp = 150, gap = 190, n = 9;
    F.calendar(ctx, t, ROW.cal, ROW.y - 190, 120, 0, { label: () => ['2033', ''], a: clamp(u * 2) * expoOut(span(t, a.unless - .2, a.unless + .6)) });
    B.wrench(ctx, ROW.cal + 120, ROW.y - 140, -.7 + .06 * Math.sin(t * 2), 120, expoOut(span(t, a.repairs + .2, a.repairs + 1)) * u);
    for (let i = 0; i < n; i++) {
      const x = ROW.x0 + ((run * sp + i * gap) % (n * gap)) - gap; if (x < ROW.x0 - 60 || x > ROW.x1) continue;
      const after = x > ROW.cal + 30 && t > a.shrink - .2, k = after ? lerp(1, .78, smooth(span(x, ROW.cal + 30, ROW.cal + 130))) : 1;
      const edge = smooth(span(x, ROW.x0 - 60, ROW.x0 + 60)) * smooth(span(x, ROW.x1, ROW.x1 - 120));
      const w = 150 * k; F.check(ctx, t, x - w / 2, ROW.y - w * .45, w, { from: 'U.S. TREASURY', a: edge * u });
    }
    const lu = F.rise(span(t, a.shrink, a.shrink + .8)) * u;
    F.maskLine(ctx, [['≈', 0]], ROW.cal + 300, ROW.y - 130, 46, lu, { serif: false, weight: 400, align: 'center', glow: true }); F.maskLine(ctx, [['78 %', 0]], ROW.cal + 400, ROW.y - 130, 64, lu, { align: 'center' });
    F.maskLine(ctx, [['2033', 0]], ROW.cal, ROW.y + 70, 24, 0, {});
  };
  // 10.05: a promise (a dashed check that stays empty) · a law (the solid page that stays)
  const promiseLaw = (ctx, t) => {
    const u = span(t, a.diff - .2, a.diff + .8); if (u <= 0 || t > tf2) return;
    const pu = expoOut(u) * (1 - expoIn(span(t, a.hasto - .2, a.hasto + .8)));
    if (pu > 0) F.check(ctx, t, PROM.x, PROM.y, PROM.w, { dashed: true, a: pu, blink: { amount: .5 + .5 * Math.sin(t * 4), date: .5 + .5 * Math.sin(t * 4 + 1), sig: .5 + .5 * Math.sin(t * 4 + 2) } });
    B.lawPage(ctx, t, LAWP.x, LAWP.y, LAWP.w, { u: span(t, a.diff + .1, a.diff + 1.1), title: ['BY LAW'], type: 1, seed: 12, glow: span(t, a.hasto, a.hasto + .8) });
  };

  // ======================================================================================================== c10 · your street again
  const page2 = (ctx, t) => {   // the empty page over your street (the door's carrier), its three fields, the hands with pens round it
    if (t < tf2 - .1) return;
    const fu = (i) => span(t, [a.right, a.written, a.paid][i] + .1, [a.right, a.written, a.paid][i] + .9);
    const hide = expoIn(span(t, tUp - 2.5, tUp - .5));
    if (hide >= 1) return;
    B.lawPage(ctx, t, PAGE2.x, PAGE2.y - hide * 900, PAGE2.w, { empty: true, title: ['', ''], fields: [['RIGHT', fu(0)], ['WRITTEN DOWN', fu(1)], ['FUNDED', fu(2)]], glow: .4 * (1 - span(t, tf2, tf2 + 2)) });
    // hands with pens (voters and lawmakers) gather round the page
    const hu = (i) => expoOut(span(t, a.exist + .2 + i * .18, a.exist + 1.3 + i * .18)) * (1 - expoIn(span(t, tUp - 3, tUp - 1.4)));
    const c = pageC(PAGE2), R = 300;
    [[-2.6, 1], [-1.9, 1], [-.6, -1], [.2, -1], [2.7, 1], [3.6, 1], [1.0, -1]].forEach(([ang, fl], i) => {
      const k = hu(i); if (k <= 0) return;
      const r = R + 260 * (1 - k), wx = c[0] + Math.cos(ang) * r, wy = c[1] - hide * 900 + Math.sin(ang) * r * .85, toward = ang + Math.PI;
      const tip = B.hand(ctx, wx, wy, toward, 58, { pose: 'hold', curl: .1, rim: rgba(P.blue0, .8), flip: fl, a: clamp(k * 2) });
      B.pen(ctx, tip[0] + Math.cos(toward) * 8, tip[1] + Math.sin(toward) * 8 + 4 * Math.sin(t * 6 + i), toward - Math.PI / 2 + .5, 84, clamp(k * 2));
    });
  };
  // the sketched check in your mailbox (pencil lines, not yet in colour)
  const sketchCheck = (ctx, t, x, y, w, u) => {
    if (u <= 0) return; const h = w * .45, r = E.prng(17);
    ctx.save(); ctx.strokeStyle = rgba(P.cream, .85 * u); ctx.lineCap = 'round';
    for (let p = 0; p < 2; p++) { ctx.lineWidth = p ? 1.2 : 2; const j = () => (r() - .5) * w * .02;
      ctx.beginPath(); ctx.moveTo(x + j(), y + j()); ctx.lineTo(x + w + j(), y + j()); ctx.lineTo(x + w + j(), y + h + j()); ctx.lineTo(x + j(), y + h + j()); ctx.closePath(); ctx.stroke();
      for (const [fx, fy, fw] of [[.06, .45, .45], [.64, .5, .3], [.06, .78, .3], [.6, .78, .34]]) { ctx.beginPath(); ctx.moveTo(x + w * fx + j(), y + h * fy + j()); ctx.lineTo(x + w * (fx + fw) + j(), y + h * fy + j()); ctx.stroke(); } }
    ctx.restore();
  };
  const dome = (ctx, t) => { const u = expoOut(span(t, a.exist + .3, a.exist + 2)) * (1 - sineIO(span(t, a.c11 + .4, a.c11 + 3.4))); if (u <= 0) return;
    const y = 300 + 900 * (1 - u); ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.ellipse(1460, y + 70, 700, 90, 0, Math.PI, 2 * Math.PI); ctx.fill();
    B.dome(ctx, t, 1460, y + 6, 260, { glow: u, col: mixHex(P.night1, P.ind1, .55) }); };

  // ======================================================================================================== c11 · the bridge
  const duEnd = (t) => {   // you: at the bluff, then onto your bridge, then on, slowly, across
    const w0 = a.bridge - .3, x0 = B.XE - 90;
    const walk = clamp(t - w0, 0, 1e9), d = walk <= 0 ? 0 : (walk < 2.2 ? 110 * sineIO(walk / 2.2) * 1 : 110 + (walk - 2.2) * 14);
    const x = x0 + d, y = x > B.XE - 30 ? B.deckY(x) + 6 : S.DU_HILL.y;
    const walking = walk > 0 && walk < 2.4 || walk > 3.4;
    return { x, y, h: 170, dir: 1, view: walking ? 'side' : undefined, walk: walking ? t * 4.6 : undefined, look: walking ? .1 : .3 + .03 * Math.sin(t * 1.1), light: 1, back: .55 };
  };
  const deck = (t) => clamp(sineIO(span(t, a.until + .2, a.bridge + .2)));
  const dustPath = (t, crack) => (ctx) => {
    const u = span(t, a.until - .3, a.until + .6) * (1 - span(t, a.bridgeE + 1, a.end)) ; if (u <= 0) return;
    const hx = lerp(B.XE - 24, B.XF + 24, deck(t)), head = [hx, B.deckY(hx) - 6];
    F.goldDust(ctx, t, [[crack[0], crack[1] - 30], [1880, 260], [2200, 640], [B.XE, 900], head], { n: 260, seed: 61, spread: 26, a: .9 * u + .1, size: 2.4, speed: .22 });
    if (deck(t) < 1) halo(ctx, head[0], head[1], 150, .6);
  };
  const subscribeLine = (ctx, t) => { const u = F.rise(span(t, a.across - .2, a.across + .7)) * (1 - expoIn(span(t, a.subscribe + 1.0, a.subscribe + 1.6))); if (u <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.maskLine(ctx, [['… AND EVERYBODY MAKES IT ACROSS', 0]], 112, 210, 24, u, { serif: false, weight: 600, col: P.cream, glow: false }); ctx.restore(); };

  // the living camera: a slow multi-sine wander on every glide (never zero speed), faded out at the seam plate and at the doors
  const quiet = [[tPlate - 1, tPlate + .2], [tDive1, tf1 + 1.6], [tDive2, tf2 + 1.6], [tUp, tDown0 + .4]];
  const live = (c, t) => { let w = 1; for (const [q0, q1] of quiet) w = Math.min(w, 1 - smooth(span(t, q0 - 1.4, q0)) * (1 - smooth(span(t, q1, q1 + 1.4)))); return w > 0 ? E.camDrift(c, t, 2.6 * w, 3) : c; };

  // the final big card (kit: 960,500 ×1.15 from 'The five lines' to 'Maybe one day') breathes: a slow push up and back (sin², no kinks)
  const cardOpt = (t) => { const x = span(t, a.c11 + 1.4, a.maybe); if (x <= 0 || x >= 1) return {}; const k = Math.sin(Math.PI * x) ** 2; return { at: [960, 500 - 46 * k, 1.15 + .09 * k] }; };

  // ======================================================================================================== draw
  return (ctx, t) => {
    // ---------------------------------------------------------------- the seam plate (B2 → B3)
    if (t < tPlate) { S.platePiggy(ctx, t, T); return; }
    // ---------------------------------------------------------------- c08: the hill
    if (t < tf1) {
      const c = live(t < tDive1 ? F.camPath(t, K8) : DIVE1(t), t);
      const P2 = pans(t);
      const st = { window: .9 * bumpU(t, a.quality - .6, a.depends - a.quality + 1.6),
        du: { look: .75 - .45 * smooth(span(t, a.way, a.way + 1.4)) + .02 * Math.sin(t * 1.1), light: 1, back: .35 },
        field: (ctx2, cc) => {
          const dawn = bumpU(t, a.quality - .8, a.depends - a.quality + 2.2);
          if (dawn > 0) E.card(ctx2, cc, F.Z_CITY * 1.25, () => { ctx2.save(); ctx2.globalCompositeOperation = 'lighter'; ctx2.fillStyle = E.lin(ctx2, 0, F.HOR - 600, 0, F.HOR, [[0, rgba(P.halo1, 0)], [1, rgba(P.halo1, .4 * dawn)]]); ctx2.fillRect(-3000, F.HOR - 600, 9000, 600); ctx2.restore(); });
          E.card(ctx2, cc, B.ARCH.Z, () => B.archive(ctx2, t, smooth(span(t, a.way + .2, a.way + 1.6)) + .06 * Math.sin(t * 3) * span(t, a.way + 1.6, a.way + 2)));
        },
        front: (ctx2, cc) => E.card(ctx2, cc, F0, () => {
          figures(ctx2, t);
          const u = balU(t);
          if (u > 0) { F.balance(ctx2, t, BAL.x, BAL.y, BAL.w, tilt(t), { u, post: BAL.post, left: bigger(leftPan(t)), right: bigger(rightPan(t)) }); balLabels(ctx2, t, P2); }
        }) };
      S.hillWorld(ctx, c, t, st);
      optCard(ctx, c, t);
      F.source(ctx, t, a.nearly + 1.2, a.notsame + .2, F.SOURCES.allianz, { y: 860 });
      // the test card: line 5 lifts (automatic); 8.02 the whole card glides big and rests on line 5; 8.16 it dims a little
      const big = sineIO(span(t, a.rests - .3, a.rests + 1.0)) * (1 - sineIO(span(t, a.bets - .2, a.bets + 1.1)));
      const C = F.TEST.corner, cor = [C.x - F.TEST.w * C.s / 2, C.y + F.TEST.h * C.s / 2, C.s], AT = [700, 560, .82];
      const o = { a: 1 - .35 * smooth(span(t, a.way - .2, a.way + 1)) };
      if (big > 0) { o.at = [lerp(cor[0], AT[0], big), lerp(cor[1], AT[1], big), lerp(cor[2], AT[2], big)];
        o.onLine = (i, [x, y, w, h]) => { if (i !== 4) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo1, .45 * big); ctx.fillRect(x - 40, y + h - 4, (w + 80), 7);
          ctx.fillStyle = E.lin(ctx, 0, y + h - 30, 0, y + h + 30, [[0, rgba(P.halo1, 0)], [.5, rgba(P.halo1, .25 * big)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x - 60, y + h - 30, w + 120, 60); ctx.restore(); }; }
      F.testCard(ctx, t, T, o);
      E.lightFlood(ctx, smooth(span(t, tf1 - 1.0, tf1)));
      return;
    }
    // ---------------------------------------------------------------- c09–c10: the old street (1889 → Vermont 1940)
    if (t < tf2) {
      const c = live(t < tf1 + 1.6 ? E.camAt(t, OUT1, S.Z_LAMP) : t < tDive2 ? F.camPath(t, K9) : DIVE2(t), t);
      const vt = smooth(span(t, tFly0, tFly1));
      const st = {
        workers: workers(t), steamA: 1, cineA: 1 - .7 * span(t, C5.start - .6, C5.start), sepia: 1 - .3 * vt,
        snowA: vt * (t < a.kept ? 1 : winterW(t)) * (1 - span(t, a.repairs, a.repairs + 2) * .5), winterA: t < a.kept ? 1 : winterW(t), season: t < a.kept ? 0 : season(t),
        ida: idaState(t), box: { open: expoOut(span(t, a.mailbox + .1, a.mailbox + .8)) * (1 - span(t, a.kept + 4, a.kept + 5)), check: span(t, tFly1 - .1, tFly1 + .2) * (1 - span(t, a.ida + .1, a.ida + .6)), snow: t < a.kept ? 1 : winterW(t) },
        field: (ctx2, cc) => E.card(ctx2, cc, PAGE89.Z, () => germanyPage(ctx2, t)),
        front: (ctx2, cc) => {
          E.card(ctx2, cc, ZR, () => B.ribbon(ctx2, t, RIB.x, RIB.y, RIB.w, span(t, a.expects - .2, a.expects + 1.6), F.QUOTES.unrest, { a: 1 - expoIn(span(t, a.when - .5, a.when + .4)) }));
          E.card(ctx2, cc, F0, () => { germany(ctx2, t); ssa(ctx2, t, cc); flyingCheck(ctx2, t); stack(ctx2, t); repairs(ctx2, t); promiseLaw(ctx2, t); });
        },
      };
      B.oldWorld(ctx, c, t, st);
      idaCheck(ctx, c, t, st.idaHands);
      byLaw(ctx, c, t);
      // the C5 plate: grows out of the newsreel screen during the lead-in, shrinks onto the Social Security page afterwards
      const s0 = E.project(c, F0, B.CINE.x, B.CINE.y), s1 = E.project(c, F0, B.CINE.x + B.CINE.w, B.CINE.y + B.CINE.h);
      const g0 = E.project(c, F0, PAGE35.x, PAGE35.y), g1 = E.project(c, F0, PAGE35.x + PAGE35.w, PAGE35.y + PAGE35.w * 1.3);
      const grow = sineIO(span(t, a.signing + .2, C5.start)), shrink = span(t, C5.end, C5.end + .75);
      if (grow > 0 && shrink < 1 && s0 && s1 && g0 && g1) {
        const from = shrink > 0 ? { x: g0[0], y: g0[1], w: g1[0] - g0[0], h: g1[1] - g0[1] } : { x: s0[0], y: s0[1], w: s1[0] - s0[0], h: s1[1] - s0[1] };
        F.clipPlate(ctx, t, T, 'C5', { from, morph: shrink > 0 ? 1 - shrink : grow, dark: shrink > 0 ? .3 * shrink : 0 });
        const paper = shrink > 0 ? smooth(span(shrink, .35, 1)) : 1 - smooth(span(grow, .02, .4));   // the lit screen turns into the plate; the plate into the page's paper (no pop)
        const pcol = shrink > 0 ? P.cream : mixHex(P.cream, P.blue1, .4);
        if (paper > 0) { const R = F.CLIP_RECT, m = sineIO(shrink > 0 ? 1 - shrink : grow), cx = lerp(from.x + from.w / 2, R.x + R.w / 2, m), cy = lerp(from.y + from.h / 2, R.y + R.h / 2, m), w = lerp(from.w, R.w, m), h = lerp(from.h, R.h, m);
          ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(pcol, paper); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(8 + 6 * m, w / 2)); ctx.fill(); ctx.restore(); }
      }
      F.source(ctx, t, a.ida + 1.4, a.kept - .2, F.SOURCES.ssa);
      F.source(ctx, t, a.hundred, a.generous + .2, F.SOURCES.ssa);
      F.source(ctx, t, a.shrink + .2, a.diff - .1, F.SOURCES.trustees);
      F.testCard(ctx, t, T, cardOpt(t));
      if (t < tf1 + 1.2) E.lightFlood(ctx, 1 - smooth(span(t, tf1, tf1 + 1.2)));
      E.lightFlood(ctx, smooth(span(t, tf2 - 1.0, tf2)));
      return;
    }
    // ---------------------------------------------------------------- c10 (end): your street · c11 (start): up into the stars
    if (t < tS1) {
      const c = live(t < tf2 + 1.6 ? E.camAt(t, OUT2) : F.camPath(t, K10), t);
      const st = {
        room: { page: 35, label: S.CAL_LABEL, gold: S.CAL_GOLD, who: false, piggy: false, lit: .8 },
        shop: { fill: 1, zero: 1, light: .85 },
        mailbox: { open: expoOut(span(t, a.daystop - .2, a.daystop + .6)), flag: 0 },
        older: { x: 790, look: lerp(-.1, .3, smooth(span(t, a.checkin, a.checkin + .8))) + .02 * Math.sin(t * 1.1), armR: [.4, .3], lean: .1 },
        field: (ctx2, cc) => { E.card(ctx2, cc, F.Z_CITY, () => dome(ctx2, t)); E.card(ctx2, cc, F0, () => page2(ctx2, t)); },
        front: (ctx2, cc) => E.card(ctx2, cc, F0, () => { const m = st.mail; if (m) { const u = expoOut(span(t, a.checkin - .3, a.checkin + .6)); sketchCheck(ctx2, t, m.slot[0] - 150 * u - 10, m.slot[1] - 30 - 50 * u, 140, u); } }),
      };
      S.streetWorld(ctx, c, t, st);
      F.testCard(ctx, t, T, cardOpt(t));
      if (t < tf2 + 1.2) E.lightFlood(ctx, 1 - smooth(span(t, tf2, tf2 + 1.2)));
      return;
    }
    // ---------------------------------------------------------------- c11: the hill's end, the bridge, the end screen
    {
      const c = live(F.camPath(t, K11), t);
      const fu = smooth(span(t, a.maybe - .2, a.worth + 1.2));
      const st = {
        future: fu, deck: deck(t), deckGlow: bumpU(t, a.bridge - .3, 2.6) + .35 * span(t, a.bridgeE, a.bridgeE + 2),
        walkers: smooth(span(t, a.channel - .4, a.channel + 2.4)),
        du: duEnd(t), fountain: { rate: 1.5 },
        front: (ctx2, cc) => {},
      };
      st.dustPath = (ctx2) => dustPath(t, S.crackOf())(ctx2);
      B.hillEnd(ctx, c, t, st);
      F.testCard(ctx, t, T, cardOpt(t));
      subscribeLine(ctx, t);
    }
  };
}
