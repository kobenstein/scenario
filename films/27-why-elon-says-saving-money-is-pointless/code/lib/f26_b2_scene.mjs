// Film 26 · B2 · c05–c07 as ONE continuous take (line 3 + line 4), owned by builder B2. The three chunk files return one entry each
// that draws this same function, so the inner boundaries c05→c06 and c06→c07 are identical frames by construction.
// From plateMailbox (T.G('Someone pays you an income', 1)) to platePiggy (T.G("If he's wrong, you're still fine", 1)).
//
// WORLD (F0 design px). Your street (lib/f26_seams.mjs) runs on to the right past house D: at the town's edge the WORLD BANK hall
// (2985–3580), then THE AVENUE OF YEARS along the river: an avenue lamp every 210 px with a year plaque 2026 (x 3800) … 2046 (x 8000),
// further lamps without plaques into the night. Behind it (deeper cards): the capitol (≈ 2030), offices and warehouses (≈ 2039–2045).
// Further out: a crossing (8500), the event hall with the 2019 stage (8780–9620), a finish line (10000), and a lone mailbox (11700) where
// the older you waits, her gold day (LAST DAY AT WORK, 11200 ≈ 2060, the calendar of the hook) behind her. The sky field above the
// roofs carries the explainers (the check, the cards, the press, the chest). Time runs left → right on the avenue.
//
// | ID   | anchor                              | picture                                                                        | camera              |
// |------|-------------------------------------|--------------------------------------------------------------------------------|---------------------|
// | 5.01 | Someone pays you an income (2nd)    | plateMailbox → line 3 lifts (testCard)                                          | plate creep         |
// | 5.02 | His answer is                       | a check rises out of the mailbox: PAY TO EVERYONE · U.S. TREASURY; UHI quote   | tilt up             |
// | 5.03 | Remember his advice                 | the check flips and parks; the ON AIR window; a time code rewinds 1:14:29 → 1:13:54 | down · fly-in   |
// | 5.04 | [C2]                                | the monitor grows into the clip plate                                           | creep               |
// | 5.05 | Asked who would pay                 | the plate shrinks into WHO PAYS? → a gold line → DON'T SAVE FOR RETIREMENT      | hold                |
// | 5.06 | To be fair                          | two smaller cards: PRICES FALL · GOVERNMENT ISSUES MONEY                         | hold → pull out     |
// | 5.07 | But today                           | the cards fold into the check; AMOUNT / DATE / SIGNATURE blink on law/amount/budget | sky field        |
// | 5.08 | In Congress                         | glide out of town: the capitol; bill pages flutter to it, none signed; NONE PASSED | truck right wide  |
// | 6.01 | And if the government just prints   | the signpost PRINT IT / TAX & SHARE; PRINT IT lights, a press spits bills       | push                |
// | 6.02 | Homes, hospital beds                | bills swarm a house, a bed, two hands (one each); their tags climb               | drift               |
// | 6.03 | The other way                       | TAX & SHARE lights: coins rise from the warehouses into a chest, on to many hands | truck right        |
// | 6.04 | This June                           | the chest flies to the WORLD BANK hall window (fly-in), lands by the lectern     | truck left · fly-in |
// | 6.05 | [C4]                                | the hall screen grows into the clip plate                                       | creep               |
// | 6.06 | So the third line                   | back out of the hall; ✗ ONLY A PROMISE SO FAR (testCard)                        | pull out            |
// | 6.07 | And even if it comes                | wide: from your mailbox calendar pages blow along the street into the avenue    | wide                |
// | 7.01 | It arrives in time                  | the avenue of years (testCard headline 4)                                       | truck right         |
// | 7.02 | For a retirement                    | a gold mark on your sidewalk: LAST DAY AT WORK                                 | hold                |
// | 7.03 | Last winter, he said                | 2036–2046 lights up: 10–20 YEARS                                                | wide                |
// | 7.04 | This summer                         | the 2036 plaque turns gold; quote card (The Economist, Jul 2026)                 | push                |
// | 7.05 | Credit where it's due               | an empty CHECK box at 2036; on "won't wait" your gold mark slides past           | wide                |
// | 7.06 | By his own account                  | two lanes: a gold streak ARTIFICIAL INTELLIGENCE races, the mail van crawls     | low                 |
// | 7.07 | That's why he wants                 | the check (parked over the capitol since 5.08) drops into the van               | drift               |
// | 7.08 | But checks for everyone             | the van waits at the capitol; CHECKS FOR EVERYONE …; office lights go out       | wide                |
// | 7.09 | So how good are his dates           | calendar pages riffle off the year plaques and blow on                           | truck right         |
// | 7.10 | One of his best-known               | a car with no driver at a crossing                                              | push                |
// | 7.11 | In April twenty nineteen            | the event hall window (fly-in): a stage, APR 22, 2019; its screen grows          | fly-in              |
// | 7.12 | [C3]                                | clip plate                                                                     | creep               |
// | 7.13 | They came                           | out: a few robotaxis pass; a huge dashed 1,000,000 almost empty                  | pull out            |
// | 7.14 | Earlier, on that same stage         | back at the stage window, one spotlight; quote card (MB2 wording)               | push                |
// | 7.15 | That's fair                         | a car rolls late over a line on the avenue, paper confetti                       | truck right         |
// | 7.16 | For your retirement, late           | the older you at her empty mailbox; her gold day long behind her                 | truck right         |
// | 7.17 | So the fourth line                  | ✗ LIKELY YEARS LATE (testCard)                                                  | creep               |
// | 7.18★| What if he's not just late          | a coin lifts off her gold day, rises into the stars (sky door) and falls into the giant piggy = platePiggy | up · S · down |
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
import * as S from './f26_seams.mjs';
import * as B from './f26_b2_props.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, lin, prng } = E;
const F0 = E.F0, GROUND = S.GROUND, TAU = Math.PI * 2;
export const PRINT = F.PRINT26;

// ---------------------------------------------------------------------------------------------------------------- geometry
const V = (u, v, s) => E.aim(F0, u, v, s);
export const AX0 = 3800, AS = 210, Y0 = 2026;                      // the avenue lamps: year y at x = AX0 + (y − 2026)·AS
export const yearX = (y) => AX0 + (y - Y0) * AS;
const LAMP_H = 340, N_LAMPS = 46;
const HALL = { x0: 2985, x1: 3580, roof: 330 }, HALLWIN = { x: 3040, y: 440, w: 480, h: 330 };
const HSCREEN = { x: 3215, y: 488, w: 170, h: 96 };                 // the hall's screen (inside the window, F0)
const STAGE = { x0: 8780, x1: 9620, roof: 470 }, STAGEWIN = { x: 8860, y: 560, w: 680, h: 300 };
const SSCREEN = { x: 9105, y: 588, w: 196, h: 110 };                // the stage screen (inside the window, F0)
const SIGN = { x: 3660, y: GROUND + 4, h: 520 };                    // the signpost at the town's edge
const CROSS_X = 8500, FINISH_X = 10000, MARK_X0 = 3590, MARK_X1 = 11200, LONE = { x: 11700 };
const Z_CAP = F0 * 1.5, Z_OFF = F0 * 1.35;
const deepU = (Z, x) => 960 + (x - 960) * F0 / Z;                   // design u on card Z that lines up with F0 x when the camera is centred there
const CAP = { x: deepU(Z_CAP, yearX(2030) + 60), y: 958, s: 1.05 };
const OFFICES = [   // [F0-eq x, kind, w, h] on Z_OFF: offices (warm windows = people's jobs) and warehouses (cool: the machines)
  [yearX(2038) + 40, 'office', 230, 330], [yearX(2040), 'ware', 420, 170], [yearX(2042) + 30, 'office', 200, 400], [yearX(2044) + 60, 'ware', 380, 150],
];
const CHECK_HOME = { x: 930, y: -40, w: 620 };                       // the check in the sky field over your street (centre, width)
const CHECK_PARK = { x: 40, y: 60, w: 200 };                         // where it waits during the podcast (off left in the sky)
const CHECK_CAP = { x: yearX(2030) + 160, y: 230, w: 230 };          // where it waits over the capitol (5.08 → 7.07)
const CARD_A = { x: 300, y: 300, w: 600, h: 280 }, CARD_B = { x: 1020, y: 300, w: 600, h: 280 };   // screen px
const CARD_C = { x: 360, y: 650, w: 480, h: 150 }, CARD_D = { x: 1080, y: 650, w: 480, h: 150 };
const ICONS = [[3920, 170, 'house'], [4320, 185, 'bed'], [4720, 170, 'hands']];   // 6.02 (F0 sky field)
const PRESS = { x: 3520, y: 230, s: .9 };
const CHEST = { x: 6350, y: 170 }, HANDROW = [...Array(7)].map((_, i) => [5700 + i * 215, 400 + 30 * Math.cos((i - 3) * .45)]);

// one cache per timing object
const CACHE = new WeakMap();
export function b2Scene(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const fn = build(T); CACHE.set(T, fn); return fn;
}

function build(T) {
  const G = (p, after = -1) => T.G(p, 0, after), GE = (p, after = -1) => T.GE(p, 0, after);
  const a = {};
  a.T0 = T.G('Someone pays you an income', 1); a.T1 = T.G("If he's wrong, you're still fine", 1);
  const T0 = a.T0, T1 = a.T1;
  a.answer = G('His answer is', T0); a.spring = G('This spring', T0); a.checks = G('checks from the federal', T0);
  a.remember = G('Remember his advice', T0); a.question = G('It was an answer', T0); a.host = G('His host had just', T0);
  a.C2 = T.clip('C2');
  a.asked = G('Asked who would pay', T0); a.advice = G('retirement advice', a.asked);
  a.fair = G('To be fair', a.asked); a.prices = G('prices will fall', a.fair); a.issue = G('the government could', a.fair);
  a.today = G('But today', a.fair); a.law = G('No law', a.today); a.amount = G('No amount', a.today); a.budget = G('No budget', a.today);
  a.congress = G('In Congress', a.today); a.bills = G('a few bills', a.congress); a.none = G('None has passed', a.congress);
  a.prints = G('And if the government just prints', a.none); a.homes = G('Homes', a.prints); a.beds = G('hospital beds', a.prints);
  a.nurse = G("a nurse's hours", a.prints); a.multiply = G("they don't multiply", a.prints); a.push = G('push prices up', a.prints);
  a.other = G('The other way', a.prints); a.tax = G('tax the profits', a.other); a.share = G('share them out', a.other);
  a.june = G('This June', a.other); a.acem = G('Daron Acemoglu', a.june); a.hisAns = G('His answer', a.june);
  a.C4 = T.clip('C4');
  a.third = G('So the third line', a.june); a.promise = G('only a promise', a.third);
  a.even = G('And even if it comes', a.third); a.inTime = G('will it come in time', a.even);
  a.arrives = G('It arrives in time', a.even); a.forRet = G('For a retirement', a.arrives); a.timing = G('timing is everything', a.arrives);
  a.winter = G('Last winter, he said', a.arrives); a.ten = G('ten or twenty', a.winter);
  a.summer = G('This summer', a.winter); a.y36 = G('twenty thirty-six', a.summer);
  a.credit = G('Credit where', a.summer); a.canCheck = G('a date you can check', a.credit); a.forecast = G("But it's still a forecast", a.credit); a.wait = G("won't wait", a.credit);
  a.account = G('By his own account', a.credit); a.faster = G('much faster than government', a.account);
  a.simplest = G('the simplest fix', a.account); a.send = G('just send people money', a.account);
  a.needC = G('But checks for everyone', a.send); a.gone = G('And the jobs could be gone', a.needC);
  a.dates = G('So how good are his dates', a.gone); a.cars = G('One of his best-known', a.dates);
  a.april = G('In April twenty nineteen', a.cars); a.gave = G('he gave this date', a.april);
  a.C3 = T.clip('C3');
  a.came = G('They came', a.gave); a.yearsLate = G('Years late', a.came); a.fleet = G('A small fleet', a.came); a.million = G('not a million', a.came);
  a.earlier = G('Earlier, on that same stage', a.came); a.himself = G("he'd said it himself", a.earlier); a.done = G('but he gets it done', a.earlier);
  a.fairC = G("That's fair", a.done); a.carmaker = G('For a carmaker', a.fairC); a.lateFine = G('late is fine', a.fairC);
  a.yourRet = G('For your retirement, late', a.lateFine); a.whole = G('the whole problem', a.yourRet);
  a.fourth = G('So the fourth line', a.yourRet); a.record = G('if his record holds', a.fourth); a.wrong = G("What if he's not just late", a.fourth);
  return scene(a, T);
}

function scene(a, T) {
  const { T0, T1, C2, C4, C3 } = a;
  const tPlateA = T0 + S.SEAM_HALF, tPlateB = T1 - S.SEAM_HALF;
  // ------------------------------------------------------------------------------------------------ times
  const tCk0 = a.answer + .15, tCk1 = a.answer + 3.0;                     // the check rises out of the mailbox → the sky field
  const tFlip0 = a.remember + .2, tFlip1 = a.remember + 1.7;              // flips over and parks top left
  const tTc0 = a.question + .2, tTc1 = a.host + .8;                       // the time code rewinds
  const tShr0 = C2.end, tShr1 = C2.end + .8;                              // the plate shrinks into WHO PAYS?
  const tCardB = a.advice - .2, tCardC = a.prices - .15, tCardD = a.issue - .1;
  const tFold0 = a.today - .75, tFold1 = a.today + .2;                    // the cards fold into the returning check
  const tBack0 = a.today - 1.0, tBack1 = a.today + .55;                   // the check comes back from its park, flipping
  const tBl = [a.law, a.amount, a.budget];                                // blink SIGNATURE / AMOUNT / DATE
  const tCap0 = a.congress + .2, tCap1 = a.none - .4;                     // the check drifts to the capitol
  const tPg0 = a.bills;                                                   // bill pages flutter
  const tPrint = a.prints + 1.0, tTax = a.other + .25;                    // the signs light
  const tIcon = [a.homes, a.beds, a.nurse];
  const tChest0 = a.june + .3, tChest1 = a.june + 4.6;                    // the chest flies to the hall
  const tPages0 = a.even + .2;                                            // calendar pages out of the mailbox
  const tMark = a.forRet + .1, tLit = a.ten, tGold = a.y36 + .05, tBox = a.canCheck + .2;
  const tSlide0 = a.wait + .1, tSlide1 = a.wait + 3.1;                    // your gold mark slides past
  const tAI = a.faster - .2, tVan0 = a.account + .3, tVanStop = a.needC + .9;
  const tDrop0 = a.send - .1, tDrop1 = a.send + 1.0;                      // the check drops into the van
  const tOut0 = a.gone + .3;                                              // office lights go out
  const tRiff = a.dates + .1;
  const tTaxis = a.came + .2, tFinish = a.carmaker - .1;
  const tUp0 = a.record + .6, tTop = a.wrong + .9;                         // the sky door: rise · switch at the top · down onto the hill

  // ------------------------------------------------------------------------------------------------ camera
  const K = [
    [tPlateA, S.plateCam(tPlateA, T0, F0, 860, 760, 1.55)],
    [a.answer + .4, V(872, 700, 1.45)],
    [tCk1 - .2, V(950, 260, 1.0)],
    [a.checks + .8, V(990, 150, .96)],
    [a.remember + .3, V(1010, 160, .98)],
    [a.question + .6, V(1330, 320, 1.6)],
    [a.host + 1.2, V(1436, 376, 2.6)],
    [C2.start - .7, V(1446, 372, 3.55)],
    [C2.end, V(1446, 370, 3.72)],
    [a.fair + .3, V(1456, 374, 3.3)],
    [a.issue + .6, V(1440, 362, 2.8)],
    [a.today + .5, V(1060, 120, 1.0)],
    [a.budget + .6, V(1020, 70, 1.14)],
    [a.congress + .25, V(1090, 130, .97)],
    [a.bills + 1.6, V(3900, 450, .62)],
    [a.none + .6, V(4380, 420, .74)],
    [a.prints + 1.6, V(3940, 420, .86)],
    [a.homes + .6, V(4150, 300, .94)],
    [a.push + 1.0, V(4260, 250, .92)],
    [a.tax + .6, V(6450, 430, .72)],
    [a.june + .2, V(6380, 420, .74)],
    [a.acem + .9, V(3320, 560, .95)],
    [a.hisAns - .3, V(3290, 590, 2.2)],
    [C4.start - .7, V(3300, 580, 3.45)],
    [C4.end, V(3300, 582, 3.6)],
    [a.promise + .3, V(3240, 600, 1.15)],
    [a.inTime + .2, V(2300, 640, .46)],
    [a.arrives + .6, V(3560, 640, .62)],
    [a.timing + .5, V(4020, 680, .8)],
    [a.ten + 1.0, V(6330, 540, .55)],
    [a.y36 + .9, V(6230, 560, .72)],
    [a.forecast, V(6160, 580, .75)],
    [a.wait + .7, V(5150, 640, .54)],
    [a.faster + .3, V(4150, 820, .7)],
    [a.send + .6, V(4450, 620, .68)],
    [a.gone + 1.0, V(5500, 560, .56)],
    [a.dates + 1.6, V(7300, 640, .58)],
    [a.cars + 1.4, V(8460, 760, .9)],
    [a.gave - .8, V(9180, 700, 1.9)],
    [C3.start - .7, V(9203, 700, 3.3)],
    [C3.end, V(9203, 702, 3.45)],
    [a.fleet + .4, V(8980, 560, .6)],
    [a.himself + .3, V(9150, 690, 1.75)],
    [a.done + .6, V(9180, 688, 2.0)],
    [a.lateFine + .2, V(9960, 790, .95)],
    [a.whole - .1, V(11480, 770, 1.06)],
    [tUp0, V(11560, 730, 1.13)],
    [tTop, V(6800, -2600, 1.0)],
    [tPlateB, S.HILL_CAM],
  ];
  const base = (t) => F.camPath(t, K, S.Z_ROOM);
  // receiving side: continue the plate's creep and blend into the path (no stop at the first key)
  const cam = (t) => {
    const p = base(t); if (t >= tPlateA + 1.4) return p;
    const q = S.plateCam(t, T0, F0, 860, 760, 1.55), k = smooth(span(t, tPlateA, tPlateA + 1.4)), ref = S.Z_ROOM;
    const lz = lerp(Math.log(ref - q.z), Math.log(ref - p.z), k);
    return E.cam3({ x: lerp(q.x, p.x, k), y: lerp(q.y, p.y, k), z: ref - Math.exp(lz) });
  };

  // ------------------------------------------------------------------------------------------------ the check (one object from 5.02 to 7.07)
  const MOUTH = [858, 903];
  const checkState = (t) => {   // → { x, y (centre), w, flip (rad), rot, a } in F0 design, or null
    if (t < tCk0) return null;
    if (t < tCk1) { const u = span(t, tCk0, tCk1), e = sineIO(clamp(u * 1.08)), h = sineIO(u);
      return { x: lerp(MOUTH[0] - 10, CHECK_HOME.x, h), y: lerp(MOUTH[1], CHECK_HOME.y, e), w: lerp(40, CHECK_HOME.w, sineIO(span(u, .05, .9))), flip: 0, rot: lerp(-.25, -.02, h) }; }
    if (t < tFlip0) return { ...CHECK_HOME, flip: 0, rot: -.02 + .01 * Math.sin(t * .8) };
    if (t < tBack0) { const u = sineIO(span(t, tFlip0, tFlip1));
      return { x: lerp(CHECK_HOME.x, CHECK_PARK.x, u), y: lerp(CHECK_HOME.y, CHECK_PARK.y, u) - 60 * Math.sin(Math.PI * u), w: lerp(CHECK_HOME.w, CHECK_PARK.w, u), flip: Math.PI * u, rot: lerp(-.02, -.12, u) + .02 * Math.sin(t * .7) }; }
    if (t < tCap0) { const u = sineIO(span(t, tBack0, tBack1)), d = Math.max(0, t - tBack1);
      return { x: lerp(CHECK_PARK.x, CHECK_HOME.x, u) + 9 * d, y: lerp(CHECK_PARK.y, CHECK_HOME.y, u) - 50 * Math.sin(Math.PI * u) + 10 * Math.sin(d * .9), w: lerp(CHECK_PARK.w, CHECK_HOME.w, u), flip: Math.PI * (1 + u), rot: lerp(-.12, -.02, u) + .01 * Math.sin(t * .8) }; }
    if (t < tDrop0) { const u = sineIO(span(t, tCap0, tCap1)), dC = tCap0 - tBack1, x0 = CHECK_HOME.x + 9 * dC, y0 = CHECK_HOME.y + 10 * Math.sin(dC * .9);
      return { x: lerp(x0, CHECK_CAP.x, u), y: lerp(y0, CHECK_CAP.y, u) - 140 * Math.sin(Math.PI * u) + 8 * Math.sin(t * .9) * u, w: lerp(CHECK_HOME.w, CHECK_CAP.w, u), flip: TAU + .25 * Math.sin(t * .6) * u, rot: -.02 + .05 * Math.sin(t * .5) * u }; }
    if (t < tDrop1) { const vx = vanX(t) - 40, vy = GROUND + VAN_DY - 150 * VAN_S; const u = span(t, tDrop0, tDrop1), e = expoIn(u);
      return { x: lerp(CHECK_CAP.x, vx, sineIO(u)), y: lerp(CHECK_CAP.y, vy, e), w: lerp(CHECK_CAP.w, 90, e), flip: TAU + Math.PI / 2 * e, rot: lerp(0, .3, u) }; }
    return null;
  };
  const drawCheck = (ctx, t, st, o = {}) => {
    if (!st || st.w < 2) return;
    const sx = Math.cos(st.flip), back = sx < 0, h = st.w * .45;
    ctx.save(); ctx.translate(st.x, st.y); ctx.rotate(st.rot); ctx.scale(Math.max(.02, Math.abs(sx)), 1);
    if (back) { ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-st.w / 2 + 6, -h / 2 + 8, st.w, h);
      ctx.fillStyle = lin(ctx, -st.w / 2, -h / 2, st.w / 2, h / 2, [[0, mixHex(P.cream, P.halo1, .45)], [1, mixHex(P.cream, P.shade0, .4)]]); ctx.fillRect(-st.w / 2, -h / 2, st.w, h); }
    else F.check(ctx, t, -st.w / 2, -h / 2, st.w, { pay: 'Everyone', from: 'U.S. TREASURY', blink: o.blink });
    ctx.restore();
  };

  // ------------------------------------------------------------------------------------------------ vehicles (F0 design, on the road)
  const LANE_A = GROUND + 92, LANE_B = GROUND + 176, VAN_S = 1.05, VAN_DY = 176;
  const vanX = (t) => { if (t < tVan0) return 2700; const k = span(t, tVan0, tVanStop); return lerp(2700, CAP.x0f - 210, 1 - (1 - k) * (1 - k)); };
  CAP.x0f = yearX(2030) + 60;

  // ------------------------------------------------------------------------------------------------ the deep backdrop along the avenue (field)
  const backdrop = (ctx, c, t) => {
    // the capitol (deep card) with its own ground
    E.card(ctx, c, Z_CAP, () => {
      ctx.fillStyle = lin(ctx, 0, CAP.y - 10, 0, CAP.y + 400, [[0, mixHex(F.NIGHT.ground, P.blue1, .25)], [.2, F.NIGHT.ground], [1, P.night0]]);
      ctx.fillRect(CAP.x - 900, CAP.y - 6, 1800, 600);
      B.capitol(ctx, t, CAP.x, CAP.y, CAP.s, { lit: 1 });
    });
    // offices (warm) and warehouses (cool) along the avenue, their own ground; lights go out one by one from tOut0
    E.card(ctx, c, Z_OFF, () => {
      const gy = 962, x0 = deepU(Z_OFF, OFFICES[0][0]) - 400, x1 = deepU(Z_OFF, OFFICES[3][0]) + 500;
      ctx.fillStyle = lin(ctx, 0, gy, 0, gy + 400, [[0, mixHex(F.NIGHT.ground, P.blue1, .2)], [.2, F.NIGHT.ground], [1, P.night0]]); ctx.fillRect(x0, gy - 4, x1 - x0, 600);
      OFFICES.forEach(([xf, kind, w, h], i) => {
        const x = deepU(Z_OFF, xf) - w / 2, y = gy - h, off = smooth(span(t, tOut0 + i * .55, tOut0 + i * .55 + .35));
        ctx.fillStyle = lin(ctx, x, y, x + w, gy, [[0, mixHex(F.NIGHT.wall, P.blue1, .2)], [1, mixHex(F.NIGHT.wall, P.night0, .3)]]); ctx.fillRect(x, y, w, h);
        if (kind === 'office') { const r = prng(90 + i);
          for (let yy = y + 24; yy < gy - 40; yy += 44) for (let xx = x + 18; xx < x + w - 30; xx += 38) { const l = r() < .7 ? (.5 + .4 * r()) * (1 - off) : 0; F.win(ctx, t, xx, yy, 24, 28, { lit: l, mull: [1, 1], sill: false, frame: 3 }); } }
        else { ctx.fillStyle = mixHex(P.night1, P.ind0, .4); ctx.beginPath(); ctx.moveTo(x - 6, y); for (let k = 0; k <= 5; k++) ctx.lineTo(x + k * w / 5, y - (k % 2 ? 26 : 0)); ctx.lineTo(x + w + 6, y); ctx.closePath(); ctx.fill();
          for (let k = 0; k < 5; k++) { ctx.fillStyle = rgba(F.COOL.body, .6 + .1 * Math.sin(t * 1.2 + k)); ctx.fillRect(x + 22 + k * (w - 44) / 5, y + 26, (w - 44) / 5 - 14, 18); }
          ctx.fillStyle = rgba(mixHex(P.core1, P.halo0, .3), .8 * (1 - off)); ctx.fillRect(x + w * .55, gy - 70, 60, 70); }
      });
    });
  };
  // a screen dims to the clip plate's ground just before the plate grows out of it, and comes back after it shrank in
  const screenDim = (t, C) => smooth(span(t, C.start - 1.5, C.start - .7)) * (1 - smooth(span(t, C.end + .75, C.end + 1.5)));
  const inside = (ctx, r, fn) => { ctx.save(); ctx.beginPath(); ctx.rect(r.x - 4, r.y - 4, r.w + 8, r.h + 8); ctx.clip(); fn(); ctx.restore(); };
  const hallInterior = (ctx, t) => {
    const { x, y, w, h } = HALLWIN;
    ctx.fillStyle = lin(ctx, x - 60, y - 60, x + w + 60, y + h, [[0, mixHex(P.shade0, P.ind1, .5)], [.5, mixHex(P.halo1, P.shade0, .55)], [1, mixHex(P.shade0, P.night1, .45)]]); ctx.fillRect(x - 160, y - 160, w + 320, h + 320);
    const m = HSCREEN; ctx.fillStyle = mixHex(P.night0, P.night1, .4); ctx.fillRect(m.x - 6, m.y - 6, m.w + 12, m.h + 12);
    ctx.fillStyle = lin(ctx, m.x, m.y, m.x + m.w, m.y + m.h, [[0, mixHex(P.blue0, P.halo2, .3)], [1, mixHex(P.blue1, P.ind1, .4)]]); ctx.fillRect(m.x, m.y, m.w, m.h);
    const dm = screenDim(t, C4); if (dm > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dm); ctx.fillRect(m.x, m.y, m.w, m.h); }
    halo(ctx, m.x + m.w / 2, m.y + m.h / 2, 150, .25 * (1 - .6 * dm), P.blue0, P.halo2);
    // the lectern + the speaker (indigo, faceless), a warm lamp on the lectern
    ctx.fillStyle = mixHex(P.shade0, P.night1, .5); ctx.fillRect(x + 70, y + 210, 60, 100); ctx.fillRect(x + 62, y + 204, 76, 10);
    E.person(ctx, x + 100, y + 214, 150, { dir: 1, look: .1 + .03 * Math.sin(t * 1.1), armR: [.9 + .15 * Math.sin(t * .9), 1.4], light: 1, back: .4 });
    halo(ctx, x + 100, y + 200, 120, .45);
    // the chest by the lectern (after it landed)
    if (t > tChest1) B.chest(ctx, t, x + 172, y + 300, .42, .3);
  };
  const stageInterior = (ctx, t) => {
    const { x, y, w, h } = STAGEWIN, spot = t > a.earlier ? smooth(span(t, a.earlier, a.earlier + 1.2)) : 0;
    const on = smooth(span(t, a.april - .4, a.april + .8));            // the stage lights come up on "In April"
    ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, mixHex(P.night1, P.ind1, .5)], [.45, mixHex(mixHex(P.ind1, P.shade0, .5), P.halo1, .12 + .18 * on)], [1, mixHex(P.ind1, P.night0, .4)]]); ctx.fillRect(x, y, w, h);
    // the stage floor (warm edge) and the dark audience in front
    ctx.fillStyle = mixHex(P.shade0, P.halo1, .2 + .25 * on); ctx.fillRect(x, y + h - 92, w, 10);
    ctx.fillStyle = mixHex(P.night1, P.ind0, .45); ctx.fillRect(x, y + h - 82, w, 82);
    const m = SSCREEN; ctx.fillStyle = P.night0; ctx.fillRect(m.x - 6, m.y - 6, m.w + 12, m.h + 12);
    ctx.fillStyle = lin(ctx, m.x, m.y, m.x + m.w, m.y + m.h, [[0, mixHex(P.blue0, P.halo2, .35)], [1, mixHex(P.blue1, P.ind1, .4)]]); ctx.fillRect(m.x, m.y, m.w, m.h);
    const dm = screenDim(t, C3); if (dm > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dm); ctx.fillRect(m.x, m.y, m.w, m.h); }
    halo(ctx, m.x + m.w / 2, m.y + m.h / 2, 160, .3 * on * (1 - .6 * dm), P.blue0, P.halo2);
    // the spotlight cone onto the speaker (stronger in 7.14)
    const sx = x + 180, sy = y + h - 88;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, y, 0, sy, [[0, rgba(P.halo1, .06 + .06 * on + .12 * spot)], [1, rgba(P.halo1, .14 + .1 * on + .22 * spot)]]);
    ctx.beginPath(); ctx.moveTo(sx - 16, y - 10); ctx.lineTo(sx + 16, y - 10); ctx.lineTo(sx + 78, sy); ctx.lineTo(sx - 78, sy); ctx.closePath(); ctx.fill(); ctx.restore();
    E.person(ctx, sx, sy, 140, { dir: 1, look: .15 + .03 * Math.sin(t * 1.3), armR: [1.2 + .2 * Math.sin(t * 1.1), 1.6], light: 1, back: .5 + .3 * spot });
    halo(ctx, sx, sy - 70, 130, .3 + .3 * on + .3 * spot);
    // the audience: a row of heads against the stage light
    for (let i = 0; i < 15; i++) { const hx = x + 24 + i * 45 + 8 * Math.sin(i * 2.1), hy = y + h - 30 + 6 * Math.sin(i * 1.7) + 1.5 * Math.sin(t * .9 + i);
      ctx.fillStyle = mixHex(P.night0, P.night1, .6); ctx.beginPath(); ctx.arc(hx, hy, 15, 0, TAU); ctx.fill(); ctx.fillRect(hx - 22, hy + 8, 44, 40); }
  };

  // ------------------------------------------------------------------------------------------------ the avenue on the street card (mid, F0)
  const markX = (t) => { if (t < tSlide0) return MARK_X0; const u = span(t, tSlide0, tSlide1); return MARK_X0 + (MARK_X1 - MARK_X0) * Math.pow(u, 2.2); };
  const avenue = (ctx, c, t) => {
    const m = E.cardM(c, F0); if (!m) return;
    const vis = (x0, x1) => m.e + x1 * m.k > -200 && m.e + x0 * m.k < W + 200;
    F.street(ctx, t, GROUND, { x0: 3990, x1: 14000 });
    // lane marks (a dashed centre line) and the painted lane labels
    ctx.fillStyle = rgba(P.cream, .35); for (let x = 3000; x < 14000; x += 120) if (vis(x, x + 60)) ctx.fillRect(x, GROUND + 133, 60, 4);
    // the lit stretch 2036–2046: a warm band on the sidewalk
    const lit = smooth(span(t, tLit, tLit + 1.4));
    if (lit > 0) { const x0 = yearX(2036), x1 = yearX(2046); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, GROUND - 120, 0, GROUND + 40, [[0, rgba(P.halo1, 0)], [1, rgba(P.halo1, .22 * lit)]]); ctx.fillRect(x0, GROUND - 120, (x1 - x0) * expoOut(lit), 160); ctx.restore(); }
    // the hall at the town's edge (window hole: the interior is drawn clipped to it, F0)
    if (vis(HALL.x0 - 50, HALL.x1 + 50)) {
      inside(ctx, HALLWIN, () => hallInterior(ctx, t));
      F.house(ctx, t, { x0: HALL.x0, x1: HALL.x1, roof: HALL.roof, ground: GROUND, seed: 41, rows: [], holes: [[HALLWIN.x, HALLWIN.y, HALLWIN.w, HALLWIN.h]], col: mixHex(F.NIGHT.wall, P.ind1, .3) });
      F.win(ctx, t, HALLWIN.x, HALLWIN.y, HALLWIN.w, HALLWIN.h, { open: true, mull: [3, 1], frame: 10 });
      const su = smooth(span(t, a.june - .2, a.june + .8));
      ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(HALLWIN.x + 40, HALLWIN.y - 80, HALLWIN.w - 80, 46);
      if (t > a.june - .2) F.maskLine(ctx, [['WORLD BANK · JUNE 2026', 0]], HALLWIN.x + HALLWIN.w / 2, HALLWIN.y - 47, 24, F.rise(span(t, a.june - .2, a.june + .7)), { serif: false, weight: 600, align: 'center', col: mixHex(P.cream, P.halo2, .5 * su), glow: false });
    }
    // the event hall with the 2019 stage
    if (vis(STAGE.x0 - 50, STAGE.x1 + 50)) {
      inside(ctx, STAGEWIN, () => stageInterior(ctx, t));
      F.house(ctx, t, { x0: STAGE.x0, x1: STAGE.x1, roof: STAGE.roof, ground: GROUND, seed: 43, rows: [], holes: [[STAGEWIN.x, STAGEWIN.y, STAGEWIN.w, STAGEWIN.h]], col: mixHex(F.NIGHT.wall, P.night1, .3) });
      F.win(ctx, t, STAGEWIN.x, STAGEWIN.y, STAGEWIN.w, STAGEWIN.h, { open: true, mull: [1, 1], frame: 10 });
      ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(STAGEWIN.x + 180, STAGEWIN.y - 76, STAGEWIN.w - 360, 44);
      if (t > a.april) F.maskLine(ctx, [['APR 22, 2019', 0]], STAGEWIN.x + STAGEWIN.w / 2, STAGEWIN.y - 44, 26, F.rise(span(t, a.april + .2, a.april + 1.0)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
    }
    // the crossing (zebra) and the finish line
    if (vis(CROSS_X - 120, CROSS_X + 120)) { ctx.fillStyle = rgba(P.cream, .5); for (let k = 0; k < 6; k++) ctx.fillRect(CROSS_X - 100, GROUND + 52 + k * 34, 200, 16); }
    if (vis(FINISH_X - 30, FINISH_X + 30)) { ctx.fillStyle = rgba(P.halo0, .85); ctx.fillRect(FINISH_X - 5, GROUND + 46, 10, 230); halo(ctx, FINISH_X, GROUND + 140, 120, .25); }
    // the avenue lamps: year plaques 2026 … 2046; the 2036 plaque turns gold; pages riffle off in 7.09
    const gold = smooth(span(t, tGold, tGold + .7));
    for (let i = 0; i < N_LAMPS; i++) {
      const x = AX0 + i * AS; if (!vis(x - 200, x + 200) || (x > STAGE.x0 - 60 && x < STAGE.x1 + 60)) continue;
      const y = Y0 + i, lab = y <= 2046, inLit = y >= 2036 && y <= 2046;
      const pc = B.avLamp(ctx, t, x, GROUND + 6, LAMP_H, { year: lab ? String(y) : null, a: .85 + (inLit ? .35 * lit : 0) - (y > 2046 ? .25 : 0), gold: y === 2036 ? gold : 0 });
      if (y === 2036 && t > tBox - .1) {   // the empty CHECK box at 2036
        const u = expoOut(span(t, tBox, tBox + .6)), bx = pc[0] + 74, by = pc[1] - 26, s = 52 * u;
        ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = 3; ctx.strokeRect(bx, by + (52 - s) / 2, 52, s);
        F.maskLine(ctx, [['CHECK', 0]], bx + 26, by + 92, 30, F.rise(span(t, tBox + .2, tBox + .9)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
      }
      // 7.09: a calendar page tears off each labelled plaque, in a wave left → right, and flutters away to the right
      if (lab && t > tRiff) { const t0 = tRiff + (i % 21) * .06, u = t - t0;
        if (u > 0 && u < 3.2) { const r = prng(300 + i); B.page(ctx, pc[0] + u * (260 + r() * 200) + Math.sin(u * 3 + i) * 30, pc[1] - u * (90 + r() * 60) + 70 * u * u * .3, 60, Math.sin(u * 4 + i) * .9, { cal: true, lines: 2, flip: Math.cos(u * 5 + i), a: clamp(3 - u) }); } }
    }
    // LAST DAY AT WORK: your gold mark on the sidewalk (draws on "For a retirement", slides past on "won't wait", rests at ≈ 2060)
    if (t > tMark) {
      const mx = markX(t), u = expoOut(span(t, tMark, tMark + .8)), mv = span(t, tSlide0, tSlide1) > 0 && span(t, tSlide0, tSlide1) < 1;
      if (vis(mx - 400, mx + 200)) {
        if (mv) F.goldDust(ctx, t, [[mx - 600, GROUND + 18], [mx, GROUND + 18]], { n: 60, seed: 61, spread: 10, a: .9, size: 2.4, speed: 1.6 });
        ctx.fillStyle = rgba(P.halo0, .95); ctx.fillRect(mx - 70 * u, GROUND + 12, 140 * u, 9); halo(ctx, mx, GROUND + 16, 140, .5 * u);
        const lu = F.rise(span(t, tMark + .3, tMark + 1.1)) * (1 - expoIn(span(t, tSlide0 - .2, tSlide0 + .2))) + (t > a.yourRet ? F.rise(span(t, a.yourRet - .4, a.yourRet + .4)) : 0);
        if (lu > 0) F.maskLine(ctx, [['LAST DAY AT WORK', 0]], mx, GROUND + 62, 26, lu, { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false });
      }
    }
    // the signpost at the town's edge (both arms point down the avenue)
    if (vis(SIGN.x - 100, SIGN.x + 400)) signpost(ctx, t);
    // vehicles: the mail van (crawls), the robotaxis, the late car
    if (t > tVan0 - .1 && t < a.dates + 3) B.van(ctx, t, vanX(t), GROUND + VAN_DY, VAN_S, { slot: true, roll: vanX(t) / 24 });
    if (t > a.cars - 1.5 && t < C3.start) { const k = expoOut(span(t, a.cars - 1.2, a.cars + .6)); B.car(ctx, t, lerp(CROSS_X - 500, CROSS_X - 190, k), GROUND + VAN_DY - 6, .9, { robo: true, roll: k * 6 }); }
    if (t > tTaxis && t < a.earlier + .5) for (let k = 0; k < 3; k++) { const x = 8000 + (t - tTaxis - k * 1.1) * 520; if (x > 7600 && x < 10600) B.car(ctx, t, x, GROUND + 92, .72, { robo: true, roll: x / 20 }); }
    if (t > a.fairC - .6 && t < a.yourRet + 1) { const x = FINISH_X - 900 + (t - (a.fairC - .6)) * 480; B.car(ctx, t, x, GROUND + VAN_DY - 6, .9, { robo: true, roll: x / 20 }); }
    // the lone mailbox + the older you (7.16); the coin that lifts off her gold day (7.18)
    if (vis(LONE.x - 400, LONE.x + 300)) {
      const mb = F.mailbox(ctx, t, LONE.x + 120, GROUND + 22, 210, { open: smooth(span(t, a.yourRet - .6, a.yourRet + .6)) });
      const br = .02 * Math.sin(t * 1.15);
      F.older(ctx, LONE.x, GROUND + 26, 210, { light: 1, dir: 1, look: lerp(-.1, -.3, smooth(span(t, a.yourRet, a.whole))) + br, armR: [lerp(.2, 1.0, smooth(span(t, a.yourRet - .4, a.yourRet + .7))), lerp(.1, .5, smooth(span(t, a.yourRet - .4, a.yourRet + .7)))], lean: .12 });
      halo(ctx, mb.slot[0], mb.slot[1], 80, .15);
    }
  };
  function signpost(ctx, t) {
    const la = smooth(span(t, tPrint - .1, tPrint + .4)) * (1 - .7 * smooth(span(t, tTax - .3, tTax + .3))), lb = smooth(span(t, tTax, tTax + .5)) * (1 - .6 * smooth(span(t, a.june + 2, a.june + 3)));
    const { x, y, h } = SIGN;
    ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(x - 6, y - h, 12, h); ctx.beginPath(); ctx.arc(x, y - h, 9, 0, TAU); ctx.fill();
    const arm = (yy, text, al, rot) => {
      const w = 290, hh = 54; ctx.save(); ctx.translate(x, yy); ctx.rotate(rot);
      ctx.beginPath(); ctx.moveTo(8, -hh / 2); ctx.lineTo(8 + w - 24, -hh / 2); ctx.lineTo(8 + w, 0); ctx.lineTo(8 + w - 24, hh / 2); ctx.lineTo(8, hh / 2); ctx.closePath();
      ctx.fillStyle = lin(ctx, 0, -hh / 2, 0, hh / 2, [[0, mixHex(P.ind1, P.blue1, .5)], [1, mixHex(P.night1, P.ind1, .6)]]); ctx.fill();
      if (al > 0) { ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = lin(ctx, 0, -hh / 2, 0, hh / 2, [[0, mixHex(P.core1, P.halo0, .3)], [1, P.halo0]]); ctx.fill(); ctx.restore(); }
      ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2; ctx.stroke();
      E.glowText(ctx, text, 8 + (w - 24) / 2, 9, { size: 25, align: 'center', col: al > .5 ? P.night1 : P.cream, glow: false, spacing: .06 });
      ctx.restore(); if (al > 0) halo(ctx, x + 150, yy, 230, .4 * al);
    };
    arm(y - h + 36, 'PRINT IT', la, -.05 + .015 * Math.sin(t * .7));
    arm(y - h + 112, 'TAX & SHARE', lb, .04 + .015 * Math.sin(t * .6 + 1));
  }
  const signTip = (k) => [SIGN.x + 300, SIGN.y - SIGN.h + (k ? 112 : 36)];

  // ------------------------------------------------------------------------------------------------ the sky field (front, F0)
  const pagesFromMailbox = (ctx, t) => {   // 6.07: calendar pages blow out of the mailbox along the street into the avenue
    if (t < tPages0 || t > a.timing + 1) return;
    for (let i = 0; i < 9; i++) {
      const t0 = tPages0 + i * .32, u = (t - t0) / 4.4; if (u < 0 || u > 1) continue;
      const r = prng(500 + i), e = sineIO(u), x = lerp(MOUTH[0], 4300 + r() * 700, e), y = lerp(MOUTH[1], 560 + r() * 260, e) - 220 * Math.sin(Math.PI * e) * (.5 + r());
      B.page(ctx, x, y, 54, Math.sin(t * 2 + i) * .8, { cal: true, lines: 2, flip: Math.cos(t * 3 + i), a: clamp((1 - u) * 6) });
    }
  };
  const press = (ctx, t) => {   // 6.01–6.02: the press, the bills, the three things and their tags
    const u = expoOut(span(t, tPrint, tPrint + .9)), out = expoIn(span(t, a.june - .6, a.june + .5)); if (u <= 0 || out >= 1) return;
    ctx.save(); ctx.translate(0, -out * 900);
    // a gold thread from the lit sign up to the press
    const tip = signTip(0); F.goldDust(ctx, t, [tip, [lerp(tip[0], PRESS.x, .6), lerp(tip[1], PRESS.y, .5) - 30], [PRESS.x, PRESS.y + 10]], { n: 70, seed: 81, spread: 12, a: u * (1 - out), size: 2.2, speed: .7 });
    ctx.save(); ctx.translate(PRESS.x, PRESS.y); ctx.scale(1, u); ctx.translate(-PRESS.x, -PRESS.y); B.press(ctx, t, PRESS.x, PRESS.y, PRESS.s, 1); ctx.restore();
    // bills: spat out to the right, then they swarm round the three things (more and more of them)
    const nB = Math.floor(clamp((t - tPrint - .4) / 6) * 42);
    for (let i = 0; i < nB; i++) {
      const r = prng(700 + i), tb = tPrint + .4 + i * (6 / 42), age = t - tb, tgt = ICONS[i % 3];
      const fly = sineIO(clamp(age / 1.4)), orbit = age * (.8 + r() * .6) + r() * TAU, rr = 110 + r() * 70;
      const ox = tgt[0] + Math.cos(orbit) * rr, oy = tgt[1] - 60 + Math.sin(orbit) * rr * .45;
      const x = t < tIcon[i % 3] ? lerp(PRESS.x + 100, PRESS.x + 400 + r() * 300, fly) : lerp(PRESS.x + 100, ox, fly), y = t < tIcon[i % 3] ? lerp(PRESS.y - 40, PRESS.y - 120 - r() * 120, fly) + Math.sin(age * 2 + i) * 14 : lerp(PRESS.y - 40, oy, fly);
      B.bill(ctx, x, y, 56, Math.sin(age * 2.3 + i) * .6, { flip: Math.cos(age * 3 + i) });
    }
    // the three things (one each), their tags climb on "push prices up"
    ICONS.forEach(([x, y, kind], i) => {
      const k = expoOut(span(t, tIcon[i] - .05, tIcon[i] + .7)); if (k <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(k * 1.3, k * 1.3); ctx.translate(-x, -y);
      if (kind === 'house') B.houseIcon(ctx, x, y, 1); else if (kind === 'bed') B.bed(ctx, x, y, 1.05); else B.hands(ctx, x, y - 40, 1.25, { hold: true });
      ctx.restore();
      const cl = expoOut(span(t, a.push + i * .15, a.push + 1.6 + i * .15)), txt = cl < .3 ? '$' : cl < .7 ? '$$' : '$$$';
      F.priceTag(ctx, t, x + 4, y + 20 - cl * 230, 84, txt, { len: 20 + 18 * (1 - cl), a: k, col: cl > .7 ? 'gold' : 'cream', ang: .06 * Math.sin(t * 1.4 + i) });
    });
    ctx.restore();
  };
  const taxShare = (ctx, t) => {   // 6.03: coins rise from the warehouses into the chest, then on to many hands; 6.04: the chest flies to the hall
    const u = span(t, tTax, tTax + 1); if (u <= 0) return;
    const fly = t > tChest0 ? sineIO(span(t, tChest0, tChest1)) : 0;
    // coins from the warehouses (their F0-equivalent x) into the chest
    if (t < tChest0 + .4) for (let i = 0; i < 12; i++) {
      const src = OFFICES[(i % 2) * 2 + 1], tb = tTax + .2 + i * .28, age = (t - tb) % 3.4; if (t < tb) continue;
      const v = clamp(age / 1.6), x0 = src[0] - 120 + (i * 53) % 240, y0 = 820;
      if (v < 1) F.coin(ctx, lerp(x0, CHEST.x, sineIO(v)), lerp(y0, CHEST.y - 30, sineIO(v)) - 160 * Math.sin(Math.PI * v), 16, { flip: t * 5 + i, glint: .4, a: clamp((1 - fly * 3)) });
    }
    // the chest: rises out of the warm light the first coins bring, opens; later flies (shrinking) into the hall window
    const hx = HALLWIN.x + 172, hy = HALLWIN.y + 300;
    const cx = lerp(CHEST.x, hx, fly), cy = lerp(CHEST.y, hy, fly) - 300 * Math.sin(Math.PI * fly), cs = lerp(1.1, .42, fly);
    if (t < tChest1) { ctx.save(); ctx.translate(cx, cy); ctx.scale(1, expoOut(u)); ctx.translate(-cx, -cy); B.chest(ctx, t, cx, cy, cs, (1 - fly) * smooth(span(t, tTax + .6, tTax + 1.4))); ctx.restore(); }
    // gold dust from the chest on to many hands
    const sh = smooth(span(t, a.share - .2, a.share + .8)) * (1 - fly);
    if (sh > 0) HANDROW.forEach(([x, y], i) => {
      const k = expoOut(span(t, a.share - .2 + i * .07, a.share + .6 + i * .07)) * (1 - expoIn(span(t, a.june, a.june + .9)));
      if (k <= 0) return;
      F.goldDust(ctx, t, [[CHEST.x, CHEST.y - 40], [lerp(CHEST.x, x, .5), Math.min(CHEST.y, y) - 90], [x, y - 40]], { n: 26, seed: 90 + i, spread: 8, a: k * .9, size: 2, speed: .6 });
      ctx.save(); ctx.translate(x, y); ctx.scale(k, k); B.hands(ctx, 0, 0, 1.0); ctx.restore();
    });
  };
  const billPages = (ctx, t) => {   // 5.08: a few bill pages flutter toward the dome, circle, drift down unsigned
    if (t < tPg0 || t > a.prints + 2) return;
    const dome = [yearX(2030) + 60, 470];
    for (let i = 0; i < 4; i++) {
      const t0 = tPg0 + i * .4, u = clamp((t - t0) / 3.3); if (t < t0) continue;
      const r = prng(40 + i), e = sineIO(clamp(u * 1.3)), ang = u * 5 + i * 1.6, rr = 220 * (1 - e) + 130;
      const x = lerp(1900 + i * 220, dome[0] + Math.cos(ang) * rr, e), y = lerp(-120 - r() * 160, dome[1] - 260 + Math.sin(ang) * rr * .4 + 260 * Math.max(0, u - .7) * 2, e);
      B.page(ctx, x, y, 62, Math.sin(t * 2.4 + i) * .7, { lines: 5, flip: Math.cos(t * 2 + i), a: clamp((1 - u) * 5) });
    }
  };

  // ------------------------------------------------------------------------------------------------ the street state
  const street = (t) => {
    const st = {}, br = .02 * Math.sin(t * 1.15);
    st.room = { page: 35, label: S.CAL_LABEL, gold: S.CAL_GOLD, who: false, piggy: false, lit: .8 };
    st.mailbox = { open: 1, flag: 0 };
    if (t < a.arrives + 3) {
      const up = smooth(span(t, tCk0 + .3, tCk0 + 1.4)) * (1 - smooth(span(t, a.remember, a.remember + 1.5)));
      st.older = { x: 790, look: lerp(-.25, .7, up) + br, armR: [lerp(1.05, .3, smooth(span(t, tCk0, tCk0 + 1))), lerp(.5, .2, smooth(span(t, tCk0, tCk0 + 1)))], pose: 'stand', lean: lerp(.1, .02, up) };
    }
    st.field = (ctx, c) => backdrop(ctx, c, t);
    st.mid = (ctx, c) => avenue(ctx, c, t);
    st.front = (ctx, c) => E.card(ctx, c, F0, () => {
      const ck = checkState(t);
      const bl = { sig: F.bump(t, tBl[0] - .1, 1.0) + .35 * smooth(span(t, tBl[0] + .5, tBl[0] + .9)), amount: F.bump(t, tBl[1] - .1, 1.0) + .35 * smooth(span(t, tBl[1] + .5, tBl[1] + .9)), date: F.bump(t, tBl[2] - .1, 1.0) + .35 * smooth(span(t, tBl[2] + .5, tBl[2] + .9)) };
      if (ck) { if (t > tCk0 && t < tCk1) halo(ctx, ck.x, ck.y, 200, .35 * (1 - span(t, tCk0, tCk1))); drawCheck(ctx, t, ck, { blink: t < tCap0 + .5 ? bl : null }); }
      billPages(ctx, t);
      if (t > a.none - .3 && t < a.prints + 1.5) F.maskLine(ctx, [['NONE PASSED', 0]], yearX(2030) + 60, 410, 58, F.rise(span(t, a.none - .2, a.none + .6)) * (1 - expoIn(span(t, a.prints + .6, a.prints + 1.3))), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
      press(ctx, t); taxShare(ctx, t);
      pagesFromMailbox(ctx, t);
      // 7.03 the bracket 10–20 YEARS + the Moonshots line; 7.04 the 2036 card
      const bu = span(t, tLit + .1, tLit + 1.1) * (1 - expoIn(span(t, a.account - .4, a.account + .3)));
      if (bu > 0) { F.bracket(ctx, yearX(2036), yearX(2046), 470, bu, '10–20 YEARS', { size: 64 });
        F.maskLine(ctx, [['“10 or 20 years” · MOONSHOTS · JAN 2026', 0]], (yearX(2036) + yearX(2046)) / 2, 520 + 60, 36, F.rise(span(t, tLit + .6, tLit + 1.4)) * (1 - expoIn(span(t, a.account - .4, a.account + .3))), { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false }); }
      const cu = span(t, tGold + .1, tGold + 1.1) * (1 - expoIn(span(t, a.wait - .2, a.wait + .5)));
      if (cu > 0) { const gs = lerp(.03, 1, expoOut(span(cu, 0, .45))); ctx.save(); ctx.translate(0, 345); ctx.scale(1, gs); ctx.translate(0, -345);
        F.qcard(ctx, t, yearX(2036) - 560, 250, 460, 190, { ...F.QUOTES.y2036, src: 'THE ECONOMIST · JUL 2026' }, cu, { size: 40 }); ctx.restore(); }
      // 7.06 the AI streak (upper lane) and its painted label
      if (t > tAI - .1) { const u = span(t, tAI, tAI + 1.6), hx = lerp(2600, 9800, expoIn(u) * .3 + u * .7), tail = Math.max(2600, hx - 1500);
        const fade = 1 - smooth(span(t, a.send - .6, a.send + .3));
        if (fade > 0 && u < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = lin(ctx, tail, 0, hx, 0, [[0, rgba(P.halo1, 0)], [1, rgba(P.core0, .95)]]); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tail, LANE_A - 30); ctx.lineTo(hx, LANE_A - 30); ctx.stroke(); ctx.restore(); halo(ctx, hx, LANE_A - 30, 160, .7); }
        const lu = F.rise(span(t, tAI + .3, tAI + 1.1)) * fade;
        if (lu > 0) F.maskLine(ctx, [['ARTIFICIAL INTELLIGENCE', 0]], 3300, LANE_A - 6, 36, lu, { serif: false, weight: 600, col: F.GOLD.text, glow: false }); }
      // 7.08 the card over the capitol
      const kc = span(t, a.needC + .3, a.needC + 1.3) * (1 - expoIn(span(t, a.dates + .2, a.dates + .9)));
      if (kc > 0) B.card(ctx, yearX(2030) - 560, 130, 1000, 170, [['CHECKS FOR EVERYONE 2020/21', { serif: false, size: 34 }], ['EACH NEEDED AN ACT OF CONGRESS', { serif: false, size: 28, col: F.GOLD.text }]], kc, { step: 1.5 });
      // 7.13 the huge dashed outline 1,000,000, almost empty, and the labels
      const ou = span(t, a.yearsLate - .2, a.yearsLate + 1.0) * (1 - expoIn(span(t, a.earlier, a.earlier + .7)));
      if (ou > 0) { const x0 = 7950, x1 = 9550, y0 = 30, y1 = 330, k = expoOut(ou);
        ctx.save(); ctx.strokeStyle = rgba(P.cream, .75); ctx.lineWidth = 4; ctx.setLineDash([22, 16]); ctx.lineDashOffset = -t * 20; ctx.strokeRect(lerp((x0 + x1) / 2, x0, k), lerp((y0 + y1) / 2, y0, k), (x1 - x0) * k, (y1 - y0) * k); ctx.restore();
        F.maskLine(ctx, [['1,000,000', 0]], x0 + 30, y0 + 90, 72, F.rise(span(ou, .4, 1)), { glow: true });
        for (let i = 0; i < 4; i++) { const cu2 = expoOut(span(t, a.fleet + i * .15, a.fleet + .6 + i * .15)); if (cu2 > 0) B.car(ctx, t, x1 - 190 - i * 130, y1 - 24, .4 * cu2, { robo: true }); }
        F.maskLine(ctx, [['PROMISED: 2020 · FIRST PAID RIDES: JUNE 2025', 0]], (x0 + x1) / 2, y1 + 70, 40, F.rise(span(t, a.fleet - .2, a.fleet + .7)) * (1 - expoIn(span(t, a.earlier, a.earlier + .7))), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false }); }
      if (t > a.fairC - .6 + (900 / 480) - .05) B.confetti(ctx, t, a.fairC - .6 + 900 / 480, FINISH_X, GROUND + 60, { n: 70, seed: 7 });
      if (t > tUp0 - .1) skyCoin(ctx, t);
    });
    return st;
  };

  // the coin that carries the eye through the sky door: it lifts off her gold day, rises with the camera, falls into the giant crack
  const coinPath = (t) => { const cr = S.crackOf(); return F.camPath(t, [[tUp0, { x: MARK_X1, y: GROUND + 10, z: 0 }], [tTop, { x: 6800, y: -2560, z: 0 }], [tPlateB - .15, { x: cr[0], y: cr[1] + 10, z: 0 }]]); };
  function skyCoin(ctx, t) {
    if (t < tUp0 || t > tPlateB - .1) return;
    const k = coinPath(t), sh = 1 - smooth(span(t, tPlateB - .7, tPlateB - .15));
    const r0 = 30 * expoOut(span(t, tUp0, tUp0 + .5)) * (.4 + .6 * sh);
    halo(ctx, k.x, k.y, r0 * 5, .45 * sh);
    F.goldDust(ctx, t, [[k.x - 14, k.y + 70], [k.x, k.y + 10]], { n: 22, seed: 77, spread: 26, a: .6 * sh, size: 2.6, speed: 1.1 });
    F.coin(ctx, k.x, k.y, r0, { flip: t * 4.2, glint: 1 });
  }

  // ------------------------------------------------------------------------------------------------ screen-space overlays
  const timeCode = (ctx, c, t) => {
    if (t < a.remember + .4 || t > C2.start - .3) return;
    const u = F.rise(span(t, a.remember + .4, a.remember + 1.2)) * (1 - expoIn(span(t, C2.start - .9, C2.start - .3)));
    const v = Math.round(lerp(4469, 4434, sineIO(span(t, tTc0, tTc1)))), hh = Math.floor(v / 3600), mm = Math.floor((v % 3600) / 60), ss = v % 60;
    const s = `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    E.card(ctx, c, S.Z_ROOM, () => F.maskLine(ctx, [[s, 0]], S.ONAIR.x + S.ONAIR.w / 2, S.ONAIR.y + S.ONAIR.h + 30, 20, u, { align: 'center', glow: true }));
  };
  const projRect = (c, Z, r) => { const p0 = E.project(c, Z, r.x, r.y), p1 = E.project(c, Z, r.x + r.w, r.y + r.h); return p0 && p1 ? { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] } : null; };
  const cards = (ctx, c, t) => {   // 5.05–5.07: WHO PAYS? · DON'T SAVE FOR RETIREMENT · PRICES FALL · GOVERNMENT ISSUES MONEY, they fold into the check
    if (t < tShr1 - .05 || t > tFold1 + .05) return;
    const ck = checkState(t); let cp = ck ? E.project(c, F0, ck.x, ck.y) : [960, 300];
    const fold = sineIO(span(t, tFold0, tFold1));
    // the whole card group creeps (3 %/s would be too much for type: 1.1 %/s push + a slow drift right), easing out as it folds
    const g = Math.max(0, t - tShr1) * (1 - fold), cr = 1 + .018 * g, gx = 960 + 13 * g, gy = 540 + 6 * Math.sin(t * .6);
    ctx.save(); ctx.translate(gx, gy); ctx.scale(cr, cr); ctx.translate(-960, -540);
    const cp0 = cp; cp = [(cp0[0] - gx) / cr + 960, (cp0[1] - gy) / cr + 540];
    const put = (R, lines, u, i) => {
      if (u <= 0 || fold >= .999) return;
      const cx = lerp(R.x + R.w / 2, cp[0], fold), cy = lerp(R.y + R.h / 2, cp[1], fold), w = R.w * (1 - fold * .7), h = lerp(R.h, 4, fold);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(w / R.w, h / R.h); B.card(ctx, -R.w / 2, -R.h / 2, R.w, R.h, lines, u); ctx.restore();
    };
    put(CARD_A, [['WHO PAYS?', { size: 66 }]], .45 + .55 * span(t, tShr1 - .05, tShr1 + .9), 0);
    // a gold line from card A to card B, then B opens out of it
    const lb = span(t, tCardB, tCardB + .5);
    if (lb > 0 && fold < .2) { const y = CARD_A.y + CARD_A.h / 2; ctx.fillStyle = rgba(P.halo0, .9 * (1 - fold * 5)); ctx.fillRect(CARD_A.x + CARD_A.w, y - 1.5, (CARD_B.x - CARD_A.x - CARD_A.w) * expoOut(lb), 3); }
    put(CARD_B, [["DON'T SAVE", { size: 50 }], ['FOR RETIREMENT', { size: 50 }]], span(t, tCardB + .35, tCardB + 1.5), 1);
    const lc = span(t, tCardC - .3, tCardC + .2), ld = span(t, tCardD - .3, tCardD + .2);
    if (fold < .2) { ctx.fillStyle = rgba(P.halo0, .9 * (1 - fold * 5)); if (lc > 0) ctx.fillRect(CARD_A.x + CARD_A.w / 2 - 1.5, CARD_A.y + CARD_A.h, 3, (CARD_C.y - CARD_A.y - CARD_A.h) * expoOut(lc)); if (ld > 0) ctx.fillRect(CARD_B.x + CARD_B.w / 2 - 1.5, CARD_B.y + CARD_B.h, 3, (CARD_D.y - CARD_B.y - CARD_B.h) * expoOut(ld)); }
    put(CARD_C, [['PRICES FALL', { serif: false, size: 34 }]], span(t, tCardC + .1, tCardC + 1.1), 2);
    put(CARD_D, [['GOVERNMENT', { serif: false, size: 30 }], ['ISSUES MONEY', { serif: false, size: 30 }]], span(t, tCardD + .1, tCardD + 1.1), 3);
    ctx.restore();
  };

  // ------------------------------------------------------------------------------------------------ draw
  return (ctx, t) => {
    if (t < tPlateA) { S.plateMailbox(ctx, t, T); return; }
    if (t >= tPlateB) { S.platePiggy(ctx, t, T); return; }
    const c = cam(t);
    if (t >= tTop) {   // after the sky door: the hill, the coin falls into the crack
      S.hillWorld(ctx, c, t, { front: (cx, cc) => E.card(cx, cc, F0, () => skyCoin(cx, t)) });
      F.testCard(ctx, t, T);
      return;
    }
    S.streetWorld(ctx, c, t, street(t));
    timeCode(ctx, c, t);
    // clip plates: C2 out of the studio monitor (shrinks into WHO PAYS?), C4 out of the hall screen, C3 out of the stage screen
    if (t > C2.start - .7 && t < tShr1) {
      const mon = projRect(c, S.Z_ROOM, S.MONITOR), grow = span(t, C2.start - .65, C2.start), shr = span(t, tShr0, tShr1);
      const from = t < C2.end ? mon : CARD_A;
      if (from) F.clipPlate(ctx, t, T, 'C2', { from, morph: t < C2.end ? grow : 1 - shr, dark: smooth(shr) });
    }
    if (t > C4.start - .7 && t < C4.end + .75) { const r = projRect(c, F0, HSCREEN); if (r) F.clipPlate(ctx, t, T, 'C4', { from: r, morph: span(t, C4.start - .65, C4.start) * (1 - span(t, C4.end, C4.end + .7)) }); }
    if (t > C3.start - .7 && t < C3.end + .75) { const r = projRect(c, F0, SSCREEN); if (r) F.clipPlate(ctx, t, T, 'C3', { from: r, morph: span(t, C3.start - .65, C3.start) * (1 - span(t, C3.end, C3.end + .7)) }); }
    cards(ctx, c, t);
    // quotes and sources (screen)
    const qu = F.rise(span(t, a.spring + .1, a.spring + .9)) * (1 - expoIn(span(t, a.remember + .9, a.remember + 1.5)));
    if (qu > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const q = F.QUOTES.uhi, cp = E.project(c, F0, CHECK_HOME.x, CHECK_HOME.y + CHECK_HOME.w * .45 / 2) || [960, 520];
      q.lines.forEach((l, i) => F.maskLine(ctx, [[(i ? '' : '“') + l + (i === q.lines.length - 1 ? '”' : ''), 0]], cp[0], cp[1] + 80 + i * 46, 36, F.rise(span(t, a.spring + .1 + i * .15, a.spring + .9 + i * .15)) * (1 - expoIn(span(t, a.remember + .9, a.remember + 1.5))), { align: 'center' }));
      F.maskLine(ctx, [[q.src, 0]], cp[0], cp[1] + 80 + q.lines.length * 46 + 6, 20, qu, { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false }); ctx.restore(); }
    F.source(ctx, t, tShr1, a.today - .3, F.SOURCES.moonshots);
    F.source(ctx, t, a.yearsLate, a.earlier + .4, 'TESLA AUTONOMY DAY · APR 22, 2019');
    const oq = span(t, a.himself - .2, a.himself + .9) * (1 - expoIn(span(t, a.fairC + .3, a.fairC + .9)));
    if (oq > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const gs = lerp(.03, 1, expoOut(span(oq, 0, .45))); ctx.translate(0, 725); ctx.scale(1, gs); ctx.translate(0, -725);   // the card opens from its centre line
      F.qcard(ctx, t, 110, 600, 900, 250, F.QUOTES.ontime, oq, { size: 38 }); ctx.restore(); }
    F.testCard(ctx, t, T);
  };
}
