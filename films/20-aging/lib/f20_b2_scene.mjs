// Film 20 · builder B2 · c05 + c06 + c07 as ONE plan sequence (one camera, one world state per frame).
// 'Yes. Earlier this year' (plateEye) → "The optimists' estimates" (plateTrack). scenes/sc05.mjs … sc07.mjs each return ONE entry that
// draws this same function, so the chunk boundaries c05|c06 and c06|c07 are invisible by construction (same frame on both sides).
// Plan: docs/shots.md 5.01–7.13 · world/rules: docs/MOTION.md · kit: lib/f20_kit.mjs (read only) · seams: lib/f20_seams.mjs.
//
// | ID    | anchor (word)                          | picture (one idea)                                                | moves                 | camera              |
// |-------|----------------------------------------|-------------------------------------------------------------------|-----------------------|---------------------|
// | 5.01  | Yes. Earlier this year · in an eye     | plateEye: the eye under the lamp, the family looking              | breathing push        | EYE_CAM (plate)     |
// | 5.02  | three of the four · one injection      | the button rises beside the eye, 3 of 4 proteins seat, a drop     | button · drop         | pull back right     |
// |       |                                        | leaves it and falls into the pupil (ripple, the iris warms)       |                       |                     |
// | 5.03  | three people · glaucoma                | the button sinks, the eye slides left, two more eyes rise         | eyes                  | pull back (bench)   |
// | 5.04  | eight weeks · no serious side effects  | a time line along the tabletop runs to DAY 56; the company's line | the time line         | breathing push      |
// | 5.05  | two of the three · visual field        | a visual-field chart over each eye; in two, cells brighten        | two charts            | –                   |
// | 5.06  | [Q1]                                   | the eyes close and settle; the card rises from the tabletop       | the card              | –                   |
// | 5.07  | Three people · No control group        | the eyes open one by one; a fourth place: a dashed eye outline    | dashed outline        | –                   |
// | 5.08  | needle · odds                          | the lamp goes up, the camera rises to the lit clock; the needle   | crane · wedge         | crane up (D1)       |
// |       |                                        | shivers but stays at 1.7; on "odds" the PUSH wedge grows a step   |                       |                     |
// | 5.09  | higher dose                            | a two-step dose stair beside the clock; the light climbs 1 → 2    | the step              | slow push           |
// | 5.10★ | fate · target                          | a bent shadow rises on the face, pulls together into a target ring| shadow → ring         | slow push           |
// | 6.01  | easy start · small and sealed off      | crane down: the ring sinks into the head of a giant body of light | ring · body draws     | crane down (BODY)   |
// |       |                                        | (you) behind the table; it seals into a small sphere: the eye     |                       |                     |
// | 6.02  | the liver · first human trial · 2027   | the liver lights; FIRST HUMAN TRIAL PLANNED · 2027; the liver's   | liver · frame         | slow push           |
// |       |                                        | light unfolds into the footage frame                              |                       |                     |
// | 6.03  | [C2]                                   | Blake Byers, NewLimit (footage laid over later)                   | –                     | still               |
// | 6.04  | goes wrong with age                    | the frame folds back into the liver; the body dims, four flickers | flickers              | –                   |
// | 6.05  | Cancer · Heart · Dementia · Diabetes   | one ward lamp per word lowers from the dark; its flicker goes out | one lamp per word     | slow rise           |
// | 6.06  | risk factor · how old you are          | the four threads meet in one knot: AGE                            | threads join          | –                   |
// | 6.07★ | same thread · the bet goes · at once   | the cord is pulled: all four lamps rise together · THE BET        | the pull              | –                   |
// | 7.01  | shapes of proteins                     | cool protein shapes fold in front of each lamp                    | shapes fold           | slow push           |
// | 7.02  | [Q2]                                   | the quote card rises in front of the lamps                        | the card              | –                   |
// | 7.03  | nine in ten · still fail               | ten small designs in a row; nine go dark (SUN ET AL. 2022)         | nine go dark          | –                   |
// | 7.04  | wouldn't be enough                     | (dashed: if they all worked) the four lamps go out; AGE glows     | lamps out             | –                   |
// | 7.05  | did the math · eighty-five             | a bar of life expectancy rises and stops under the line at 85     | the bar               | –                   |
// | 7.06  | The thread would still be there        | lamps lift into the dark, the body sinks: only the thread AGE     | the thread            | –                   |
// | 7.07  | reach twelve                           | crane up to the clock: needle 1.7, the dashed 12 far away         | crane                 | crane up (D1)       |
// | 7.08  | doesn't see the needle turning         | a frame draws beside the clock and opens into the footage frame   | the frame             | –                   |
// | 7.09  | [C3]                                   | S. Jay Olshansky (footage laid over later)                        | –                     | still               |
// | 7.10  | three decades · more slowly            | the frame folds into a chart: life expectancy lines flatten       | lines                 | slow push           |
// | 7.11  | implausible · Unless                   | IMPLAUSIBLE THIS CENTURY; UNLESS lights gold                       | verdict · unless      | –                   |
// | 7.12  | button · search · eye                  | three small icons rise on their words and slide into UNLESS       | three icons           | –                   |
// | 7.13★ | glass ceiling · brick wall · more      | a pane of glass draws over the needle path, a glint; the wedge    | pane · pull back      | push in, pull back  |
// |       |                                        | grows to touch it; pull back down the sky to the track            |                       | → TRACK_CAM (plate) |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f20_kit.mjs';
import * as S from './f20_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, cam3, camAt, camDrift, halo, prng } = E;
const { LAMP, TABLE, CLOCK, GY, camFor, stand, wp, bump, rise, maskLine, srcLine, trailSpan, measure, COOL, INK } = F;

// ===================================================================================================================== cameras
const EYE = S.EYE_CAM;
const BENCH = (X, s, sy = 540, Y = -300) => camFor(X, Y, LAMP.Z, s, 960, sy);
const D1 = (s, sy = 870) => camFor(0, 0, CLOCK.Z, s, 960, sy);                     // the gauge as a diagram (as c01 1.08)
const BODY = (s, sy = 800) => camFor(0, -250, F.SEAT.Z, s, 960, sy);      // the family at the bottom, the body of light behind them
const PANE = camFor(-4000, -3000, CLOCK.Z, .072, 760, 600, E.F0 * .072 / .0622);   // 7.13: a longer lens toward the needle path (camera stays near D1)
const C_BODY = BODY(.74, 830), C_BODY2 = BODY(.79, 860);

// the body of light: a giant you standing on the plain behind the table (local units: height 1000, origin at the feet)
const ZB = 9000, BODY_H = 3000, BS = BODY_H / 1000;
// the ward lamps hang in the night between the table and the body (anchor = the knot area; local px at the BODY camera)
const ZW = 6500;

// ===================================================================================================================== the body path
// front view, hood up (your raincoat), arms slightly away from the coat, legs below the hem. Right half from the top of the hood,
// mirrored. Units: local (feet at 0, top -1000).
const HALF = [[0, -1000], [46, -992], [82, -960], [100, -905], [98, -846], [84, -808], [118, -792], [166, -772], [192, -742], [204, -682],
  [210, -596], [218, -506], [226, -432], [222, -396], [204, -386], [190, -404], [184, -470], [178, -560], [168, -640], [170, -560], [182, -440],
  [196, -320], [204, -262], [150, -250], [96, -246], [86, -170], [84, -60], [92, -14], [100, 0], [30, 0], [22, -16], [20, -120], [14, -232], [0, -238]];
const OUTLINE = (() => {
  const right = E.catmull(HALF, 5), left = right.slice(0, -1).reverse().map(([x, y]) => [-x, y]);
  return [...right, ...left.slice(1)];
})();
const ORG = {                                      // organ positions (local), viewer's left = the body's right
  eye: [-30, -905], liver: [-58, -620], cancer: [-40, -500], heart: [30, -688], dementia: [6, -930], diabetes: [36, -585],
};
const FLICK = [ORG.cancer, ORG.heart, ORG.dementia, ORG.diabetes];

// a deterministic table of small things
const DARK_ORDER = [3, 7, 0, 5, 9, 2, 8, 1, 4];                             // which of the ten designs go dark, in this order (6 stays)
const LE = (() => { const r = prng(2024); return Array.from({ length: 9 }, (_, i) => ({ y0: .08 + r() * .14, g: .55 + r() * .25, k: 1.6 + r() * 1.2 })); })();
const VF = (() => { const r = prng(56); const cells = []; for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (i * i + j * j <= 10) cells.push([i, j, r()]); return cells; })();

export function makeB2(T) {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // c05
  a.start = G('Yes. Earlier this year'); a.inEye = G('in an eye', a.start); a.treat = G("It's the treatment", a.start);
  a.same = G('the same three', a.start); a.inj = G('one injection', a.start); a.first = G('The first results', a.start);
  a.people = G('three people', a.first); a.glauc = G('glaucoma', a.first); a.oct = G('In October', a.start); a.weeks = G('eight weeks', a.oct);
  a.noSer = G('no serious', a.oct); a.two = G('And in two', a.oct); a.visual = G('visual field', a.two); a.improved = G('improved', a.two);
  const q1 = T.clips.Q1, c2 = T.clips.C2, q2 = T.clips.Q2, c3 = T.clips.C3;
  a.threeP = G('Three people', q1.start); a.oneEye = G('One eye each', q1.start); a.noCtrl = G('No control group', q1.start);
  a.dont = G("don't move the needle", a.noCtrl); a.needle = G('needle', a.dont); a.odds = G('odds', a.dont);
  a.trial = G('And the trial goes on', a.noCtrl); a.board = G('safety board', a.trial); a.higher = G('higher dose', a.trial);
  a.aging = G('Aging is turning', a.trial); a.fate = G('fate', a.aging); a.target = G('target', a.aging);
  // c06
  a.c06 = G('The eye was the easy start'); a.small = G('small and sealed', a.c06); a.sealed = G('sealed off', a.c06);
  a.liver = G('the liver', a.c06); a.company = G('The company behind', a.c06); a.human = G('first human trial', a.company); a.y2027 = G('twenty twenty-seven', a.company);
  a.but = G('But what about everything', a.c06); a.wrong = G('goes wrong with age', a.but);
  a.cancer = G('Cancer', a.but); a.heart = G('Heart disease', a.but); a.dementia = G('Dementia', a.but); a.diab = G('Diabetes', a.but);
  a.wards = G('four different wards', a.but); a.share = G('They share', a.but); a.risk = G('risk factor', a.share); a.howOld = G('how old you are', a.share);
  a.hang = G('all four hang', a.share); a.thread = G('same thread', a.hang); a.pull = G('Pull that thread', a.hang); a.bet = G('the bet goes', a.pull);
  a.once = G('all of them at once', a.pull);
  // c07
  a.c07 = G('Artificial intelligence is coming at'); a.designing = G('designing medicines', a.c07); a.shapes = G('shapes of proteins', a.c07);
  a.nine = G('nine in ten', q2.start); a.fail = G('still fail', a.nine); a.even = G('And even if', a.nine); a.worked = G('all worked', a.even);
  a.enough = G("wouldn't be enough", a.even); a.decades = G('Decades ago', a.even); a.math = G('did the math', a.decades);
  a.cure = G('Cure every major', a.decades); a.e85 = G('eighty-five', a.cure); a.still = G('The thread would still', a.cure);
  a.reach = G('ever reach twelve', a.still); a.skeptic = G('That skeptic has run', a.reach); a.turning = G('needle turning', a.skeptic);
  a.studied = G('He studied the longest-lived', c3.start); a.decades3 = G('three decades', a.studied); a.slowly = G('more slowly', a.studied);
  a.verdict = G('His verdict', a.studied); a.implaus = G('implausible', a.verdict); a.unless = G('Unless aging itself', a.verdict);
  a.slowed = G('markedly slowed', a.unless);
  a.isWhat = G('is what the button', a.unless); a.btn = G('button', a.isWhat - .1); a.search = G('search', a.isWhat); a.eyeW = G('eye are', a.isWhat);
  a.words = G('In his own words', a.isWhat); a.glass = G('glass ceiling', a.words); a.brick = G('brick wall', a.words); a.more = G('more of this research', a.words);
  a.end = G("The optimists' estimates");
  const CL = { q1, c2, q2, c3 };
  return { a, CL, draw: scene(a, CL) };
}

// ===================================================================================================================== the scene
function scene(a, CL) {
  const tP0 = a.start + S.SEAM_HALF, tP1 = a.end - S.SEAM_HALF;
  const K = [
    [a.start, EYE],
    [tP0, EYE],
    [a.treat + .2, camFor(0, -390, LAMP.Z, 1.84, 960, 500)],                 // 5.01 breathing push on the eye
    [a.inj - .2, BENCH(300, 1.12, 520, -330), 'q'],                           // 5.02 pull back right: eye + button
    [a.inj + 1.1, BENCH(270, 1.10, 520, -330)],
    [a.glauc + 1.2, BENCH(0, 1.03, 560)],                                      // 5.03 the bench: the row of eyes
    [CL.q1.start, BENCH(0, 1.06, 560)],                                       // 5.04–5.05 breathing push
    [a.noCtrl + .7, BENCH(250, 1.06, 560)],                                     // 5.06–5.07
    [a.needle + .2, D1(.0622), 'q'],                                          // 5.08 crane up to the lit clock
    [a.target + .5, D1(.0648)],                                               // 5.09–5.10 slow push
    [a.small - .25, C_BODY, 'q'],                                             // 6.01 crane down: the ring into the body's head
    [a.y2027 + .2, BODY(.7625, 829)],                                         // 6.02 slow push
    // the clip window keeps the bottom fifth free for the subtitles: crane up as the screen unfolds (table + family drop out
    // below the frame, clear of the lower third), crane back down after it
    [CL.c2.start - .05, BODY(.765, 1170), 'q'],
    [CL.c2.end, BODY(.77, 1176)],
    [a.cancer - .2, BODY(.775, 840), 'q'],
    [a.howOld + .3, C_BODY2],                                                 // 6.05–6.06 slow rise with the lamps
    [CL.q2.start - 1.7, BODY(.809, 867)],
    [CL.q2.start - .1, BODY(.81, 1145), 'q'],                                 // 7.02 the card window keeps the bottom fifth free (subtitles)
    [CL.q2.end, BODY(.812, 1150)],
    [CL.q2.end + 2.6, BODY(.815, 869), 'q'],
    [a.still + .5, BODY(.83, 875)],                                           // 7.03–7.06
    [a.reach + .2, D1(.0622), 'q'],                                           // 7.07 crane up to the clock
    [CL.c3.start - .3, D1(.0636, 800)],                                        // the C3 window: the hub stand lifts out of the bottom fifth
    [CL.c3.end + .3, D1(.0641, 798)],
    [a.unless, D1(.0648)],
    [a.words + .2, D1(.0655)],
    [a.more - .2, PANE, 'q'],                                                 // 7.13 push toward the needle path, the pane
    [tP1, S.TRACK_CAM, 'q'],                                                  // pull back down the sky to the track → plateTrack
  ];
  for (let i = 1; i < K.length; i++) K[i][0] = Math.max(K[i][0], K[i - 1][0] + .4);
  const camOf = (t) => {
    const amt = smooth(span(t, tP0, tP0 + 1.4)) * (1 - smooth(span(t, tP1 - 1.4, tP1)));
    return camDrift(camAt(t, K, CLOCK.Z), t, amt);
  };
  const lampUp = (t) => expoIn(span(t, a.first - .1, a.first + 1.4));      // the lamp goes up as the bench opens (5.03)
  const atD1a = a.needle + .2, atD1b = a.reach + .2;                          // the moments the camera is up at the clock (world changes hide here)

  // ---------------------------------------------------------------------------------------------------------------- world state
  const famAt = (t) => {
    if (t >= atD1b) return S.famOnTrack();
    const up = smooth(span(t, a.c06 - .5, a.small + .5)) * (1 - smooth(span(t, a.still - .5, a.still + 1)));
    return S.famSeated(Object.fromEntries(F.FAMILY.map((f, i) => {
      const word = [a.cancer, a.heart, a.dementia, a.diab][i];
      return [f.who, { look: .35 + .25 * up + .15 * bump(t, word - .1, 1.2) + .1 * bump(t, a.target - .2, 1.5) }];
    })));
  };
  const dialAt = (t) => {
    // the lit face is the brightest frame type (luma budget): the diagram reads at .84; full light only on the plate
    const lit = t < a.c06 - 1 ? lerp(.12, .78, smooth(span(t, a.noCtrl + .9, a.needle - .2)))
      : t < a.still ? lerp(.78, .26, smooth(span(t, a.target + .7, a.small - .4)))
        : lerp(.26, .84, smooth(span(t, a.still + 1.4, a.reach - .2))) + .16 * smooth(span(t, a.more + 1.0, tP1 - .2));
    const thr = t < a.c06 ? expoOut(span(t, a.needle - .6, a.needle + .8)) : 1;
    const title = smooth(span(t, a.needle - .4, a.needle + .4)) * (1 - smooth(span(t, a.target + .5, a.target + 1.2)))
      + smooth(span(t, a.reach - .5, a.reach + .3)) * (1 - smooth(span(t, a.more + .3, a.more + 1.1)));
    // the push wedge: one step on "odds" (1.7 → 2.6); on "more of this research" it grows to the pane, then sinks for the plate
    const wu = t < a.still ? expoOut(span(t, a.odds - .1, a.odds + 1.3)) * (1 - expoIn(span(t, a.target + .9, a.c06 + .6))) : sineIO(span(t, a.more - .2, a.more + 1.2));
    const gone = expoIn(span(t, a.more + 1.4, tP1 - .1));
    const push = wu > 0 && gone < 1 ? { v0: 1.7, v1: t < a.still ? 2.6 : PANE_V - .04, u: wu * (1 - gone), cool: 0,
      label: 0 } : null;
    const tick = (tt) => .5 * bump(tt, a.needle - .05, .5) * Math.sin(span(tt, a.needle - .05, a.needle + .45) * Math.PI * 3);
    return { lit, ticks: 1, num: 1, needle: 1.7, thr, title, push, tick };
  };
  const trackAt = (t) => {
    if (t < a.still + 1.2) return null;
    // under the C3 clip the lit track (the only thing in the bottom fifth there) dims, so the subtitles sit on dark ground
    const dim = .6 * smooth(span(t, CL.c3.start - 1.2, CL.c3.start - .1)) * (1 - smooth(span(t, CL.c3.end + .1, CL.c3.end + 1.3)));
    return { lit: 1 - dim, reach: span(t, a.still + 1.4, a.reach + .4), fin: S.FIN_FAR, finA: .7 * smooth(span(t, a.reach - .4, a.reach + .6)) };
  };

  return (ctx, t) => {
    if (t < tP0) { S.plateEye(ctx, t); return; }
    if (t >= tP1) { S.plateTrack(ctx, t); return; }
    const c = camOf(t), up = lampUp(t);
    const dial = dialAt(t), tr = trackAt(t);
    const nearTable = t < atD1b && c.z < TABLE.z0 - 100;
    F.scene20(ctx, c, t, {
      dial, track: tr, fam: famAt(t),
      table: nearTable ? { years: 1, light: 1 - .55 * up } : null,
      lamp: up < 1 && nearTable ? { on: 1, up } : null,
      onTable: (cx, cc, tt) => bench(cx, cc, tt),
      extra: (cx, cc, tt, layer, d) => {
        if (layer === 'far' && d) { faceMarks(cx, tt, d); }
        if (layer === 'track') body(cx, cc, tt);
        if (layer === 'near') { wardsLayer(cx, cc, tt); }
      },
    });
    overlays(ctx, t, c);
  };

  // ================================================================================================================ c05 · the bench
  // eye k: X, width, rise, lie, open, young, ripple
  function eyesAt(t) {
    const slide = sineIO(span(t, a.first + .5, a.people + .5));
    const sink = sineIO(span(t, CL.q1.start - .9, CL.q1.start - .1));         // the eyes close and settle under the card
    const open = (k) => smooth(span(t, a.threeP - .15 + k * .3, a.threeP + .45 + k * .3));
    const lie = (k) => .55 * sink * (1 - open(k));
    const gone = expoIn(span(t, a.noCtrl + .7, a.noCtrl + 2.0));              // they sink into the table as the camera rises
    const young0 = lerp(S.EYE_STATE.young, .82, smooth(span(t, a.inj + .7, a.inj + 2.4)));
    const out = [{ X: lerp(0, -450, slide), w: lerp(560, 340, slide), rise: 1 - gone, lie: lie(0), young: young0,
      ripple: span(t, a.inj + .75, a.inj + 2.1), look: [0, -.12 * bump(t, a.inj - .3, 1.3)] }];
    for (const k of [1, 2]) {
      const r = sineIO(span(t, a.people - .25 + (k - 1) * .3, a.people + .9 + (k - 1) * .3));
      out.push({ X: k === 1 ? 0 : 450, w: 340, rise: r * (1 - gone), lie: lie(k), young: .3 + .08 * k, ripple: 0, look: [0, 0] });
    }
    return out;
  }
  function eyeAt(ctx, c, t, e) {
    if (e.rise <= 0) return null; let out = null;
    stand(ctx, c, e.X, LAMP.Z, () => {
      const w = e.w, lie = clamp(e.lie), y = -TABLE.h + lerp(w * .56, -240 * w / 560, sineIO(e.rise) * (1 - lie));
      ctx.save(); ctx.beginPath(); ctx.rect(-2000, -6000, 4000, 6000 - TABLE.h); ctx.clip();
      out = F.eye(ctx, t, 0, y, w * (1 - .25 * lie), { open: 1 - lie, young: e.young, ripple: e.ripple, look: e.look });
      ctx.restore();
    });
    return out;
  }
  function bench(ctx, c, t) {
    if (t >= a.c06) return;
    const eyes = eyesAt(t);
    eyes.forEach((e) => eyeAt(ctx, c, t, e));
    // the button beside the eye (5.02): rises out of the tabletop, three of four proteins seat, then sinks again
    const bu = sineIO(span(t, a.treat - .2, a.treat + 1.1)) * (1 - sineIO(span(t, a.inj + .8, a.first + .2)));
    if (bu > 0) stand(ctx, c, 620, LAMP.Z, () => {
      ctx.save(); ctx.beginPath(); ctx.rect(-600, -4000, 1200, 4000 - TABLE.h); ctx.clip();
      ctx.translate(0, (1 - bu) * 260);
      const slots = 3 * span(t, a.same - .1, a.inj - .25);
      F.button(ctx, t, 0, -TABLE.h - 40, 105, { u: 1, slots, lit: .55 + .45 * smooth(span(t, a.same, a.inj)) });
      ctx.restore();
    });
    // the drop: leaves the button cap on "one injection", arcs over and falls into the pupil
    const dq = span(t, a.inj - .05, a.inj + .8);
    if (dq > 0 && dq < 1) stand(ctx, c, 0, LAMP.Z, () => {
      const e = sineIO(dq), sx = 620, sy = -TABLE.h - 150, ex = eyes[0].X, ey = -390, mx = 330, my = -820;
      const x = (1 - e) ** 2 * sx + 2 * (1 - e) * e * mx + e * e * ex, y = (1 - e) ** 2 * sy + 2 * (1 - e) * e * my + e * e * ey;
      F.drop(ctx, x, y, 13, { stretch: .5 * Math.abs(2 * e - 1) });
    });
    // 5.07 the fourth place: a dashed eye outline (NO CONTROL GROUP)
    const du = span(t, a.noCtrl - .15, a.noCtrl + .9), dOut = expoIn(span(t, a.noCtrl + .7, a.noCtrl + 1.8));
    if (du > 0 && dOut < 1) stand(ctx, c, 900, LAMP.Z, () => {
      const w = 340, y = -TABLE.h - 240 * w / 560 + dOut * 260, hw = w / 2, hh = w * .3;
      const pts = []; for (let k = 0; k <= 48; k++) { const q = k / 48, s = Math.sin(q * Math.PI * 2), cc = Math.cos(q * Math.PI * 2); pts.push([-hw * cc, y - hh * 1.0 * s * (1 + .0 * cc)]); }
      ctx.save(); ctx.beginPath(); ctx.rect(-2000, -6000, 4000, 6000 - TABLE.h); ctx.clip();
      ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 8;
      const n = Math.max(2, Math.round(pts.length * expoOut(du)));
      ctx.strokeStyle = rgba(P.halo0, .85); ctx.lineWidth = 5; ctx.beginPath(); pts.slice(0, n).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      ctx.setLineDash([]); ctx.strokeStyle = rgba(P.halo1, .5 * expoOut(du)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, y, w * .2 * expoOut(du), 0, 6.29); ctx.stroke();
      ctx.restore();
    });
    // 5.05 visual-field charts over each eye
    const gu = rise(span(t, a.two + .2, a.two + 1.0)), gOut = expoIn(span(t, CL.q1.start - .9, CL.q1.start - .2));
    if (gu > 0 && gOut < 1) eyes.forEach((e, k) => {
      stand(ctx, c, e.X, LAMP.Z, () => {
        const cy = -TABLE.h - 240 * e.w / 560 - 215 + (1 - gu) * 40 + gOut * 60, r = 74, cell = r / 3.4;
        ctx.save(); ctx.globalAlpha *= clamp(gu * 2) * (1 - gOut);
        ctx.fillStyle = rgba(P.night1, .75); ctx.beginPath(); ctx.arc(0, cy, r + 14, 0, 6.29); ctx.fill();
        ctx.strokeStyle = rgba(P.halo2, .55); ctx.lineWidth = 2.5; ctx.stroke();
        ctx.strokeStyle = rgba(P.halo2, .3); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-r - 6, cy); ctx.lineTo(r + 6, cy); ctx.moveTo(0, cy - r - 6); ctx.lineTo(0, cy + r + 6); ctx.stroke();
        const better = k !== 1;
        for (const [i, j, rr] of VF) {
          const lit = better ? smooth(span(t, a.improved - .3 + rr * .7, a.improved + .1 + rr * .7)) * (rr < .45 ? 1 : 0) : 0;
          ctx.fillStyle = lit > 0 ? mixHex(P.blue1, P.core1, lit) : rgba(P.blue2, .9);
          if (lit > 0) halo(ctx, i * cell, cy + j * cell, cell * 1.4, .5 * lit, P.halo0, P.core0);
          ctx.fillStyle = mixHex(mixHex(P.ind2, P.blue2, .6 + .4 * rr), P.core1, lit);
          ctx.fillRect(i * cell - cell * .3, cy + j * cell - cell * .3, cell * .6, cell * .6);
        }
        ctx.restore();
      });
    });
  }

  // ================================================================================================================ c05 · on the clock face
  function faceMarks(ctx, t, d) {
    const { cx, cy, R } = d;
    // 5.08 the wedge's label, outside the rim (the kit puts it inside the wedge, which is too narrow here)
    const pl = rise(span(t, a.odds + .3, a.odds + 1.0)) * (1 - expoIn(span(t, a.board - .4, a.board + .2)));
    if (pl > 0) { const [lx, ly] = d.at(2.15, R * 1.1);
      maskLine(ctx, [['PUSH', 0]], lx - 10, ly - 18, Math.max(30, R * .06), pl, { serif: false, align: 'right', col: P.halo0, glow: true, weight: 600 });
      srcLine(ctx, t, 'not a measurement', lx - 10, ly + 16, pl, { size: Math.max(20, R * .036), align: 'right', weight: 500 }); }
    // 5.10 the bent shadow rises on the face ("fate"), pulls together into a target ring ("target")
    const u = sineIO(span(t, a.fate - .5, a.fate + .9)), pull = span(t, a.target - .15, a.target + .55);
    const ring = RING(d);
    if (u > 0 && pull < 1) {
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.arc(cx, cy, R * .985, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.clip();
      const k = 1 - expoIn(pull), h = R * .62;
      ctx.translate(ring[0], ring[1]); ctx.scale(k, k); ctx.translate(-ring[0], -ring[1]);
      ctx.translate(0, (1 - u) * h * 1.05);
      ctx.globalAlpha *= .8;
      E.person(ctx, cx - R * .02, cy, h, { dir: 1, lean: .42, long: true, look: -.6, armR: [.35, .55], armL: [.12, .3], light: 0, rim: mixHex(P.night1, P.ind1, .5) });
      ctx.restore();
    }
  }
  // the target ring: on the face (c05) → carried down into the body's head (c06) → the sealed eye
  function ringState(t, c, dial) {
    const u = expoOut(span(t, a.target - .05, a.target + .7));
    if (u <= 0 || t > a.liver + 2) return null;
    const d = F.wp(c, 0, GY, CLOCK.Z); if (!d) return null;
    const [fx, fy, fr] = RING({ cx: d[0], cy: d[1], R: CLOCK.R * d[2] });
    const head = bodyPt(c, ORG.eye), mv = sineIO(span(t, a.c06 - .9, a.small - .1));
    if (!head) return [fx, fy, fr, u, 0];
    return [lerp(fx, head[0], mv), lerp(fy, head[1], mv), lerp(fr, Math.max(9, 15 * head[2] * BS), mv), u, mv];
  }

  // ================================================================================================================ c06 · the body of light
  function bodyPt(c, [lx, ly]) { const p = wp(c, lx * BS, GY + ly * BS, ZB); return p ? [p[0], p[1], p[2]] : null; }
  function bodyState(t) {
    const draw = span(t, a.small - .35, a.sealed + .9);                    // the outline draws (two lines from the head, down both sides)
    const sink = sineIO(span(t, a.still - .1, a.still + 1.5));               // 7.06: it sinks back into the plain
    const dim = .4 * smooth(span(t, a.but, a.wrong + .6)) + .4 * smooth(span(t, a.cancer, a.diab + .8));
    return { draw, sink, dim };
  }
  function body(ctx, c, t) {
    if (t < a.c06 - 1 || t > a.still + 1.6) return;
    const b = bodyState(t); if (b.draw <= 0) return;
    stand(ctx, c, 0, ZB, () => {
      ctx.save(); ctx.beginPath(); ctx.rect(-5000, -9000, 10000, 9000); ctx.clip();          // it sinks into the plain (below the horizon)
      ctx.translate(0, b.sink * BODY_H * 1.02); ctx.scale(BS, BS);
      const path = new Path2D(); OUTLINE.forEach((p, i) => (i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1]))); path.closePath();
      const fillU = smooth(span(t, a.small + .2, a.sealed + 1.2)), lv = 1 - b.dim;
      if (fillU > 0) {                                                       // the inside: a faint body of light (glow, not a fill)
        ctx.save(); ctx.clip(path);
        ctx.fillStyle = E.rad(ctx, 0, -620, 640, [[0, rgba(mixHex(P.halo1, P.coat, .18), .26 * fillU * lv)], [.6, rgba(P.blue0, .2 * fillU * lv)], [1, rgba(P.ind1, .12 * fillU * lv)]]);
        ctx.fillRect(-400, -1050, 800, 1100); ctx.restore();
      }
      // the outline: two lines of light from the top of the hood, down both sides (half each)
      const half = OUTLINE.length >> 1, right = OUTLINE.slice(0, half + 1), left = OUTLINE.slice(half).reverse();
      left.unshift(OUTLINE[0]); left.pop();
      const lw = 3.4, al = .9 * (1 - .55 * b.dim);
      trailSpan(ctx, right, 0, expoOut(b.draw) * .999 + .001, { w: lw, a: al, spark: b.draw < 1 });
      trailSpan(ctx, [OUTLINE[0], ...OUTLINE.slice(half).reverse()], 0, expoOut(b.draw) * .999 + .001, { w: lw, a: al, spark: b.draw < 1 });
      // the eye: a small sealed sphere (the ring closes around it on "sealed off")
      const eu = smooth(span(t, a.small - .1, a.small + .5)) * (1 - .6 * smooth(span(t, a.liver - .3, a.liver + .6)));
      if (eu > 0) {
        const [ex, ey] = ORG.eye; halo(ctx, ex, ey, 46, .7 * eu, P.halo0, P.core0);
        ctx.fillStyle = rgba(P.core0, eu); ctx.beginPath(); ctx.arc(ex, ey, 8.5, 0, 6.29); ctx.fill();
        const su = expoOut(span(t, a.sealed - .1, a.sealed + .6));
        if (su > 0) { ctx.strokeStyle = rgba(P.core1, .9 * eu); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(ex, ey, 15, -Math.PI / 2, -Math.PI / 2 + su * 6.283); ctx.stroke(); }
      }
      // the liver: outline draws on "liver", then fills with light; it becomes the footage frame (and comes back after the clip)
      const lu = span(t, a.liver - .05, a.liver + .7), lf = smooth(span(t, a.liver + .3, a.liver + 1.2)), lo = .7 * smooth(span(t, a.wrong - .2, a.wrong + .8));
      if (lu > 0) {
        const lp = liverPts(), [lx, ly] = ORG.liver;
        ctx.save(); ctx.translate(lx, ly);
        if (lf > 0) { halo(ctx, 0, 0, 120, .55 * lf * (1 - lo), P.halo0, P.core0); const p2 = new Path2D(); lp.forEach((p, i) => (i ? p2.lineTo(p[0], p[1]) : p2.moveTo(p[0], p[1]))); p2.closePath();
          ctx.fillStyle = E.rad(ctx, -18, -8, 80, [[0, rgba(P.core0, lf * (1 - lo))], [.6, rgba(P.core1, .85 * lf * (1 - lo))], [1, rgba(P.halo0, .7 * lf * (1 - lo))]]); ctx.fill(p2); }
        trailSpan(ctx, lp, 0, expoOut(lu), { w: 2.4, a: .95 * (1 - lo), spark: lu < 1 });
        ctx.restore();
      }
      // 6.04 four places flicker (the rest of the body: everything else that goes wrong); each goes out when its ward lamp arrives
      const fu = smooth(span(t, a.wrong - .3, a.wrong + .5));
      if (fu > 0) FLICK.forEach(([x, y], i) => {
        const gone = smooth(span(t, WORD(i) - .1, WORD(i) + .4));
        const fl = fu * (1 - gone) * (.55 + .45 * Math.abs(Math.sin(t * (7.3 + i * 2.1) + i) * Math.sin(t * (3.1 + i) + 2 * i)));
        if (fl <= 0) return;
        halo(ctx, x, y, 34, .75 * fl, mixHex(P.halo1, P.shade0, .4), P.core1);
        ctx.fillStyle = rgba(P.core1, fl); ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.29); ctx.fill();
      });
      ctx.restore();
    });
  }
  function WORD(i) { return [a.cancer, a.heart, a.dementia, a.diab][i]; }
  function liverPts() {
    const ctrl = [[-62, 6], [-64, -18], [-48, -36], [-14, -40], [24, -30], [52, -20], [70, -12], [52, 2], [20, 14], [-12, 26], [-40, 30], [-62, 6]];
    return E.catmull(ctrl, 4);
  }

  // ================================================================================================================ c06–c07 · the wards
  // drawn as a card at ZW: local px (1:1 at the BODY camera); anchor = the knot height line
  function wardFrame(c) {
    const p = wp(c, 0, WARD_Y, ZW); if (!p) return null;
    return { x: p[0], y: p[1], k: p[2] / WARD_S };
  }
  function wardsState(t) {
    const q = WARD_X.map((_, i) => expoOut(span(t, WORD(i) - .15, WORD(i) + 1.0)));
    const join = sineIO(span(t, a.risk - .3, a.howOld + .6));
    const pull = span(t, a.bet - .25, a.bet + 1.5), lift = 90 * (pull < .25 ? -.2 * Math.sin(pull / .25 * Math.PI) : 0) + 90 * expoOut(span(t, a.bet - .05, a.bet + 1.3));
    const sway = .07 * Math.sin((t - a.bet) * 4.2) * Math.exp(-1.6 * Math.max(0, t - a.bet)) * (t > a.bet ? 1 : 0);
    const out = (i) => smooth(span(t, a.enough - .2 + i * .12, a.enough + .5 + i * .12));        // 7.04 the lamps go out
    const gone = (i) => expoIn(span(t, a.still - .1 + i * .08, a.still + 1.3 + i * .08));         // 7.06 they lift into the dark
    const cool = smooth(span(t, a.c07 - .3, a.designing));
    return { q, join, lift, sway, out, gone, cool };
  }
  function wardsLayer(ctx, c, t) {
    if (t < a.cancer - .4 || t > a.reach + .5) return;
    const fr = wardFrame(c); if (!fr) return;
    const s = wardsState(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(fr.x, fr.y); ctx.scale(fr.k, fr.k);
    ctx.translate(0, -s.lift);
    const knot = [0, -120], lampY = 230;
    // the knot and the one cord up into the dark (joined)
    const lamps = [];
    WARD_X.forEach((x0, i) => {
      if (s.q[i] <= 0 || s.gone(i) >= .999) return;
      const g = s.gone(i), ph = .03 * Math.sin(t * .9 + i * 1.7) + s.sway * (i % 2 ? -1 : 1);
      const lx = lerp(x0, x0 * .92, s.join) + Math.sin(ph) * 260, ly = lerp(-900, lampY, s.q[i]) - g * 1500;
      lamps.push([lx, ly, i]);
      // its thread: own (from the dark straight above) → from the knot
      ctx.lineWidth = 3;
      if (s.join < 1) { ctx.strokeStyle = rgba(P.halo1, .7 * (1 - s.join)); ctx.beginPath(); ctx.moveTo(x0, -1400); ctx.lineTo(lx, ly - 102); ctx.stroke(); }
      if (s.join > 0) {
        const jx = lerp(lx, knot[0], s.join), jy = lerp(ly - 102 - 400, knot[1], s.join);
        ctx.strokeStyle = rgba(P.halo0, .85 * s.join); ctx.beginPath(); ctx.moveTo(jx, jy); ctx.quadraticCurveTo(lerp(jx, lx, .55), lerp(jy, ly - 102, .15), lx, ly - 102); ctx.stroke();
      }
    });
    if (s.join > 0) {
      ctx.strokeStyle = E.lin(ctx, 0, knot[1], 0, knot[1] - 700, [[0, rgba(P.halo0, .9 * s.join)], [1, rgba(P.halo0, 0)]]); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(knot[0], knot[1]); ctx.lineTo(knot[0], knot[1] - 700); ctx.stroke();
      halo(ctx, knot[0], knot[1], 90, .6 * s.join, P.halo0, P.core0);
      ctx.fillStyle = rgba(P.core1, s.join); ctx.beginPath(); ctx.arc(knot[0], knot[1], 15, 0, 6.29); ctx.fill();
      maskLine(ctx, [['AGE', 0]], knot[0] + 34, knot[1] + 14, 44, s.join, { serif: false, col: P.cream, glow: true, weight: 600 });
      const bu = rise(span(t, a.bet - .1, a.bet + .6)) * (1 - expoIn(span(t, a.c07 + 1.5, a.c07 + 2.2)));
      if (bu > 0) srcLine(ctx, t, 'THE BET', knot[0] + 34, knot[1] - 70, bu, { size: 22, col: P.halo0 });
    }
    for (const [lx, ly, i] of lamps) {
      const off = s.out(i), lit = 1 - off, q = s.q[i];
      const sh = new Path2D(); sh.moveTo(lx - 88, ly); sh.bezierCurveTo(lx - 82, ly - 52, lx - 42, ly - 86, lx, ly - 102); sh.bezierCurveTo(lx + 42, ly - 86, lx + 82, ly - 52, lx + 88, ly); sh.closePath();
      if (lit > 0) { halo(ctx, lx, ly + 12, 220, .5 * lit * q, mixHex(P.halo0, COOL.mid, .35 * s.cool), P.core0);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, 0, ly, 0, ly + 210, [[0, rgba(P.halo0, .16 * lit)], [1, rgba(P.halo0, 0)]]);
        ctx.beginPath(); ctx.moveTo(lx - 90, ly); ctx.lineTo(lx + 90, ly); ctx.lineTo(lx + 150, ly + 210); ctx.lineTo(lx - 150, ly + 210); ctx.closePath(); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = E.lin(ctx, lx - 88, 0, lx + 88, 0, [[0, P.night1], [.5, mixHex(P.ind2, P.blue1, .5)], [1, P.ind1]]); ctx.fill(sh);
      ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 2; ctx.stroke(sh);
      ctx.fillStyle = mixHex(mixHex(P.blue1, P.night1, .3), P.core1, .25 + .75 * lit); ctx.beginPath(); ctx.ellipse(lx, ly, 86, 10, 0, 0, 6.29); ctx.fill();
      const la = q * (1 - s.gone(i));
      maskLine(ctx, [[F.WARDS[i], 0]], lx, ly + 58, 28, la, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 });
      // 7.01 a cool protein shape folds in front of each lamp
      const pu = span(t, a.designing - .2 + i * .35, a.shapes + .3 + i * .35), pOut = expoIn(span(t, CL.q2.start - .6, CL.q2.start));
      if (pu > 0 && pOut < 1) { halo(ctx, lx, ly + 138, 80, .45 * pu * (1 - pOut), COOL.edge, COOL.core); F.protein(ctx, t, lx, ly + 138 + pOut * 40, 44, i, { cool: 1, redraw: pu, a: 1 - pOut }); }
    }
    ctx.restore();
  }

  // ================================================================================================================ screen-space explainers
  function overlays(ctx, t, c) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    c05Text(ctx, t, c);
    // the ring carrier (c05 → c06)
    const rg = ringState(t, c);
    if (rg) {
      const [x, y, r, u, mv] = rg, k = 1 - smooth(span(t, a.small + .1, a.small + .6));
      if (k > 0) {
        const col = mixHex(mixHex(INK, P.shade0, .2), P.core1, mv);
        halo(ctx, x, y, r * 3, (.25 + .5 * mv) * u * k, P.halo0, P.core0);
        ctx.strokeStyle = rgba(col, .95 * k); ctx.lineWidth = Math.max(2, r * .16);
        ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + u * 6.283); ctx.stroke();
        ctx.lineWidth = Math.max(1.5, r * .1); ctx.beginPath(); ctx.arc(x, y, r * .55 * u, 0, 6.29); ctx.stroke();
        ctx.fillStyle = rgba(col, k); ctx.beginPath(); ctx.arc(x, y, Math.max(2.5, r * .14), 0, 6.29); ctx.fill();
      }
    }
    c06Text(ctx, t, c);
    c07Text(ctx, t, c);
    ctx.restore();
  }

  function c05Text(ctx, t, c) {
    if (t > a.c06 + 1) return;
    // 5.03 3 PEOPLE · GLAUCOMA (top left)
    const pu = rise(span(t, a.people - .1, a.people + .7)), pOut = expoIn(span(t, CL.q1.start - .8, CL.q1.start - .2));
    const pu2 = rise(span(t, a.threeP - .1, a.threeP + .6)) * (1 - expoIn(span(t, a.noCtrl + .6, a.noCtrl + 1.2)));
    const pk = Math.max(pu * (1 - pOut), pu2);
    if (pk > 0) {
      maskLine(ctx, [['3', 0]], 150, 196, 88, pk, { serif: true, col: P.cream, glow: true });
      maskLine(ctx, [['PEOPLE', 0]], 214, 192, 36, pk, { serif: false, col: P.cream, glow: false, weight: 600 });
      const gk = rise(span(t, a.glauc - .1, a.glauc + .6)) * (1 - pOut);
      srcLine(ctx, t, pu2 > pu * (1 - pOut) ? 'ONE EYE EACH' : 'GLAUCOMA', 152, 236, pu2 > pu * (1 - pOut) ? rise(span(t, a.oneEye - .1, a.oneEye + .5)) * pu2 : gk, { size: 24, col: P.halo0 });
      srcLine(ctx, t, 'ER-100 · PHASE 1 · LIFE BIOSCIENCES', 152, 272, pk * (pu2 > 0 ? 1 : clamp(gk * 1.2)), { size: 20 });
    }
    // 5.04 the time line along the tabletop → DAY 56 · NO SERIOUS SIDE EFFECTS
    const lu = span(t, a.weeks - .5, a.weeks + 1.1), lOut = expoIn(span(t, CL.q1.start - .8, CL.q1.start - .2));
    if (lu > 0 && lOut < 1) {
      const L = wp(c, -720, GY - TABLE.h, TABLE.z0 + 20), Rr = wp(c, 640, GY - TABLE.h, TABLE.z0 + 20);
      if (L && Rr) {
        const y = L[1] - 2, x1 = lerp(L[0], Rr[0], sineIO(lu));
        trailSpan(ctx, [[L[0], y], [Rr[0], y]], 0, sineIO(lu) * .999 + .001, { w: 2.6, a: 1 - lOut, spark: lu < 1 });
        const ticks = 8; for (let k = 0; k <= ticks; k++) { const x = lerp(L[0], Rr[0], k / ticks); if (x > x1) break; ctx.fillStyle = rgba(P.halo1, .8 * (1 - lOut)); ctx.fillRect(x - 1.5, y - (k % 4 ? 8 : 14), 3, k % 4 ? 8 : 14); }
        srcLine(ctx, t, 'DAY 0', L[0], y + 44, rise(span(t, a.weeks - .5, a.weeks)) * (1 - lOut), { size: 20 });
        const du = rise(span(t, a.weeks + .3, a.weeks + 1.0)) * (1 - lOut);
        maskLine(ctx, [['DAY 56', 0]], Rr[0] + 24, y + 70, 64, du, { serif: true, col: P.cream, glow: true, align: 'right' });
      }
      const su = rise(span(t, a.noSer - .1, a.noSer + .8)) * (1 - lOut);
      if (su > 0) {
        maskLine(ctx, [['NO SERIOUS', 0]], 1810, 380, 36, su, { serif: false, align: 'right', col: P.cream, glow: false, weight: 600 });
        maskLine(ctx, [['SIDE EFFECTS', 0]], 1810, 426, 36, clamp(su * 1.15 - .1), { serif: false, align: 'right', col: P.cream, glow: false, weight: 600 });
        srcLine(ctx, t, 'COMPANY REPORT · 8 OCT 2026', 1810, 466, clamp(su * 1.2 - .2), { size: 20, align: 'right' });
      }
    }
    // 5.05 2 OF 3 (over the charts, right)
    const tu = rise(span(t, a.visual - .2, a.visual + .6)) * (1 - expoIn(span(t, CL.q1.start - .8, CL.q1.start - .2)));
    if (tu > 0) {
      maskLine(ctx, [['2 OF 3', 0]], 1810, 210, 64, tu, { serif: true, align: 'right', col: P.cream, glow: true });
      srcLine(ctx, t, 'PARTS OF THE VISUAL FIELD IMPROVED', 1810, 250, clamp(tu * 1.2 - .1), { size: 21, align: 'right', col: P.halo0 });
    }
    // 5.06 the quote card Q1 (rises from the tabletop, sinks back into it)
    // a paraphrase of the company's release: no quote marks, and the attribution says so
    const [qt, qw, qs] = splitQ(CL.q1.text);
    quoteLines(ctx, t, { lines: wrap(qt, 50, 1000), who: `Paraphrased from ${qw}`, src: qs.replace(/, /g, ' · '), whoAt: CL.q1.start + 1.0, t0: CL.q1.start - .2, t1: CL.q1.end - 1.0, y: 430, base: () => { const p = wp(c, 0, GY - TABLE.h, TABLE.z0); return p ? p[1] - 4 : 700; }, size: 50, gold: [['safety', CL.q1.start + 2.2]] });
    // 5.07 NO CONTROL GROUP (over the dashed place)
    const nu = rise(span(t, a.noCtrl, a.noCtrl + .6)) * (1 - expoIn(span(t, a.noCtrl + .9, a.noCtrl + 1.5)));
    if (nu > 0) {
      const p = wp(c, 900, GY - TABLE.h - 240 * 340 / 560, LAMP.Z);
      if (p) { maskLine(ctx, [['NO CONTROL', 0]], p[0], p[1] - 190, 34, nu, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 });
        maskLine(ctx, [['GROUP', 0]], p[0], p[1] - 148, 34, nu, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 }); }
    }
    // 5.09 the dose stair beside the clock (top right): SAFETY BOARD · NEXT DOSE
    const su = rise(span(t, a.board - .3, a.board + .6)), sOut = expoIn(span(t, a.fate - .8, a.fate - .1));
    if (su > 0 && sOut < 1) {
      const k = su * (1 - sOut), x0 = 1450, y0 = 360, sw = 120, sh = 70, dy = sOut * 30;
      ctx.save(); ctx.translate(0, dy);
      srcLine(ctx, t, 'SAFETY BOARD', x0, y0 - 220, k, { size: 22, col: P.halo0 });
      maskLine(ctx, [['NEXT DOSE', 0]], x0, y0 - 172, 36, k, { serif: false, col: P.cream, glow: false, weight: 600 });
      const pts = [[x0, y0], [x0 + sw, y0], [x0 + sw, y0 - sh], [x0 + 2 * sw, y0 - sh], [x0 + 2 * sw, y0 - 2 * sh], [x0 + 3 * sw, y0 - 2 * sh]];
      trailSpan(ctx, pts, 0, expoOut(su) * .999 + .001, { w: 3, a: 1 - sOut, spark: su < 1 });
      srcLine(ctx, t, 'DOSE 1', x0 + sw * 1.5, y0 - sh + 34, k, { size: 20, align: 'center' });
      srcLine(ctx, t, 'DOSE 2', x0 + sw * 2.5, y0 - 2 * sh + 34, clamp(k * 1.2 - .15), { size: 20, align: 'center' });
      // the light climbs from dose 1 to dose 2 on "higher dose"
      const cl = sineIO(span(t, a.higher - .2, a.higher + .7)), dx = lerp(x0 + sw * 1.5, x0 + sw * 2.5, cl), dyy = lerp(y0 - sh, y0 - 2 * sh, clamp(cl * 1.6 - .3)) - 12 - 22 * Math.sin(cl * Math.PI);
      if (k > 0) { halo(ctx, dx, dyy, 46, .85 * k, P.halo0, P.core0); ctx.fillStyle = rgba(P.core0, k); ctx.beginPath(); ctx.arc(dx, dyy, 9, 0, 6.29); ctx.fill(); }
      srcLine(ctx, t, 'RECOMMENDED · LIFE BIOSCIENCES · 8 OCT 2026', x0 + 3 * sw, y0 + 40, clamp(k * 1.2 - .2), { size: 19, align: 'right' });
      ctx.restore();
    }
  }

  function c06Text(ctx, t, c) {
    if (t < a.c06 || t > a.c07 + 2) return;
    // 6.02 FIRST HUMAN TRIAL PLANNED · 2027 · A PLAN, NOT DATA (left of the body)
    const u = rise(span(t, a.human - .1, a.human + .7)), out = expoIn(span(t, CL.c2.start - 1.3, CL.c2.start - .7));
    if (u > 0 && out < 1) {
      const k = u * (1 - out), x = 150, y = 300;
      srcLine(ctx, t, 'NEXT: THE LIVER', x, y - 74, rise(span(t, a.liver - .1, a.liver + .6)) * (1 - out), { size: 22, col: P.halo0 });
      maskLine(ctx, [['FIRST HUMAN TRIAL', 0]], x, y, 34, k, { serif: false, col: P.cream, glow: false, weight: 600 });
      maskLine(ctx, [['PLANNED', 0]], x, y + 42, 34, clamp(k * 1.15 - .1), { serif: false, col: P.cream, glow: false, weight: 600 });
      maskLine(ctx, [['2027', 0]], x, y + 132, 88, rise(span(t, a.y2027 - .1, a.y2027 + .6)) * (1 - out), { serif: true, col: P.cream, glow: true });
      srcLine(ctx, t, 'A PLAN, NOT DATA · NEWLIMIT', x, y + 176, clamp(rise(span(t, a.y2027 + .1, a.y2027 + .8)) * (1 - out)), { size: 20 });
    }
    // 6.02 → 6.03 → 6.04: the liver's light unfolds into the footage frame; after the clip it folds back into the liver
    clipFrame(ctx, t, c, CL.c2, () => { const p = bodyPt(c, ORG.liver); return p ? [p[0] - 70 * p[2] * BS, p[1] - 45 * p[2] * BS, 140 * p[2] * BS, 85 * p[2] * BS] : null; },
      { id: 'C2', name: 'Blake Byers', role: 'CO-FOUNDER · NEWLIMIT', date: 'COMPANY UPDATE · JULY 2026' }, a.y2027 + .5);
  }

  // the footage frame: unfolds from a source rect (screen [x, y, w, h], per frame) into CLIP_RECT before the clip, holds still in the
  // clip window, folds back into the source after it.
  function clipFrame(ctx, t, c, clip, srcRect, info, tOpen, backRect) {
    const op = quartIO(span(t, tOpen, clip.start - .12)), cl = quartIO(span(t, clip.end + .05, clip.end + 1.0));
    if (op <= 0 || cl >= 1) return;
    const s = srcRect(), b = backRect ? backRect() : s, R0 = F.CLIP_RECT;
    if (!s || !b) return;
    const from = t < clip.start ? s : b, u = t < clip.start ? op : 1 - cl;
    const rect = { x: lerp(from[0], R0.x, u), y: lerp(from[1], R0.y, u), w: lerp(from[2], R0.w, u), h: lerp(from[3], R0.h, u) };
    const lab = t < clip.start ? smooth(span(t, clip.start - .6, clip.start)) : 1 - smooth(span(t, clip.end, clip.end + .45));
    // the screen switches on over the first part of the unfold (and off at the end of the fold), its edge stays a line of light
    const kk = smooth(clamp(u * 4)), mx = rect.x + rect.w / 2, my = rect.y + rect.h / 2;
    ctx.save(); if (kk < 1) { ctx.beginPath(); ctx.rect(mx - rect.w * kk / 2 - 2, my - rect.h * kk / 2 - 2, rect.w * kk + 4, rect.h * kk + 4); ctx.clip(); }   // the screen grows from its centre
    F.clipScreen(ctx, t, { ...info, rect, u: clamp(u * 1.2 - .1), label: lab, on: clamp(u * 2) });
    ctx.restore();
    if (u < .5) { const ra = 1 - smooth(clamp(u * 2)); trailSpan(ctx, F.roundRectPts(rect.x, rect.y, rect.w, rect.h, 8), 0, 1, { w: 2.4, a: ra, spark: false }); }
  }

  function c07Text(ctx, t, c) {
    if (t < a.c07 - 1) return;
    // 7.02 the quote card Q2 (rises in front of the lamps)
    const [qt, qw, qs] = splitQ(CL.q2.text);
    quoteLines(ctx, t, { lines: qt, who: qw, src: qs, t0: CL.q2.start - .2, t1: CL.q2.end - 1.0, y: 440, base: () => 790, size: 50, gold: [["within reach", CL.q2.start + 2.4]] });
    // 7.03 ten small designs in a row: nine go dark (SUN ET AL. 2022); 7.04 dashed: even if they all worked
    const fr = wardFrame(c);
    const ru = span(t, a.nine - .4, a.nine + .9), rOut = expoIn(span(t, a.decades - .2, a.decades + .5));
    if (fr && ru > 0 && rOut < 1) {
      const y = fr.y + (500 - 150) * fr.k + rOut * 40;
      for (let i = 0; i < 10; i++) {
        const x = fr.x + (i - 4.5) * 82 * fr.k, gu = expoOut(clamp(ru * 2.2 - i * .12));
        if (gu <= 0) continue;
        const di = DARK_ORDER.indexOf(i), dark = di >= 0 ? smooth(span(t, a.fail + di * .05, a.fail + .35 + di * .05)) : 0;
        const relit = di >= 0 ? smooth(span(t, a.worked - .2 + di * .03, a.worked + .3 + di * .03)) : 0;
        const lit = 1 - dark;
        if (lit > 0) halo(ctx, x, y, 42, .5 * lit * gu * (1 - rOut), COOL.edge, COOL.core);
        F.protein(ctx, t, x, y + (1 - gu) * 20, 27 * fr.k, i % 4, { cool: 1, lit: .15 + .85 * lit, a: (1 - rOut) * clamp(gu * 2), redraw: gu });
        if (relit > 0) { ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = rgba(COOL.mid, .9 * relit * (1 - rOut)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 34 * fr.k, 0, 6.29); ctx.stroke(); ctx.restore(); }
      }
      const lk = rise(span(t, a.fail - .1, a.fail + .6)) * (1 - rOut);
      const xr = fr.x + 5.2 * 82 * fr.k + 30;
      maskLine(ctx, [['9 IN 10', 0]], xr, y - 4, 54, lk, { serif: true, col: P.cream, glow: true });
      srcLine(ctx, t, 'FAIL IN HUMAN TRIALS', xr, y + 30, clamp(lk * 1.2 - .1), { size: 21, col: P.halo0 });
      srcLine(ctx, t, 'SUN ET AL. 2022', xr, y + 60, clamp(lk * 1.2 - .25), { size: 19 });
      const ek = rise(span(t, a.worked - .1, a.worked + .5)) * (1 - expoIn(span(t, a.enough + .6, a.enough + 1.2)));
      if (ek > 0) srcLine(ctx, t, 'IF THEY ALL WORKED', fr.x - 4.5 * 82 * fr.k - 50, y + 8, ek, { size: 21, align: 'right', col: COOL.mid });
    }
    // 7.05 a bar of life expectancy rises and stops under the line at 85 (right)
    const bu = rise(span(t, a.math - .4, a.math + .5)), bOut = expoIn(span(t, a.still + .1, a.still + .8));
    if (bu > 0 && bOut < 1) {
      const k = bu * (1 - bOut), x = 1560, base = 800, top = 300, val = (v) => lerp(base, top, v / 100), dy = bOut * 40;
      ctx.save(); ctx.translate(0, dy);
      srcLine(ctx, t, 'LIFE EXPECTANCY AT BIRTH · U.S.', x - 70, 160, k, { size: 21, col: P.halo0 });
      srcLine(ctx, t, 'IF EVERY MAJOR DISEASE OF OLD AGE WERE CURED', x - 70, 190, clamp(rise(span(t, a.cure - .1, a.cure + .6)) * (1 - bOut)), { size: 19 });
      ctx.strokeStyle = rgba(P.blue2, .9 * k); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - 70, base); ctx.lineTo(x + 160, base); ctx.stroke();
      // the line at 85 (dashed) and its label
      const lu = expoOut(span(t, a.math, a.math + .9)) * (1 - bOut), y85 = val(85);
      ctx.save(); ctx.setLineDash([12, 9]); ctx.strokeStyle = rgba(P.halo0, .9 * lu); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 70, y85); ctx.lineTo(x - 70 + 230 * lu, y85); ctx.stroke(); ctx.restore();
      maskLine(ctx, [['85', 0]], x + 170, y85 + 22, 64, lu, { serif: true, col: P.cream, glow: true });
      // the bar: heavy, rises on "Cure every major disease", slows, stops just under 85 on "eighty-five" (a small settle)
      const r1 = span(t, a.cure + .1, a.e85 + .1), v = r1 <= 0 ? 0 : 82.4 * (1 - (1 - r1) ** 2.2) + 1.2 * bump(t, a.e85 - .05, .5);
      if (v > 0) {
        const yb = val(v), bw = 90;
        ctx.fillStyle = E.lin(ctx, 0, yb, 0, base, [[0, P.core1], [.25, P.halo0], [1, mixHex(P.halo0, P.shade0, .6)]]); ctx.fillRect(x - bw / 2 + 45, yb, bw, base - yb);
        halo(ctx, x + 45, yb, 90, .5, P.halo0, P.core0);
      }
      srcLine(ctx, t, 'OLSHANSKY, CARNES, CASSEL · SCIENCE 1990', x + 160, base + 36, clamp(k * 1.2 - .2), { size: 19, align: 'right' });
      ctx.restore();
    }
    // 7.08 → 7.09 → 7.10 the frame beside the clock opens into the footage frame; it folds back into the chart
    clipFrame(ctx, t, c, CL.c3, () => [1430, 330, 360, 202], { id: 'C3', name: 'S. Jay Olshansky', role: 'DEMOGRAPHER · UIC', date: 'DAN BUETTNER PODCAST · MAR 2026' },
      a.turning - .2, () => [CH.x0 - 20, CH.y0 - 100, CH.x1 - CH.x0 + 40, CH.y1 - CH.y0 + 150]);
    const fu = span(t, a.skeptic + 1.6, a.turning - .2);
    if (fu > 0 && t < a.turning - .2) {      // the small frame beside the clock draws as a line of light first
      const pts = F.roundRectPts(1430, 330, 360, 202, 8);
      trailSpan(ctx, pts, 0, expoOut(fu) * .999 + .001, { w: 2.4, a: 1, spark: fu < 1 });
    }
    chart(ctx, t);
    verdict(ctx, t);
    pane(ctx, t, c);
  }

  // 7.10 the longest-lived places: life expectancy rises, more slowly (top left of D1)
  function chart(ctx, t) {
    const inn = smooth(span(t, CL.c3.end + .5, CL.c3.end + 1.1)), out = expoIn(span(t, a.words - .3, a.words + .4));
    if (inn <= 0 || out >= 1) return;
    const k = inn * (1 - out), { x0, x1, y0, y1 } = CH;
    ctx.save(); ctx.translate(0, out * 40);
    maskLine(ctx, [['THE LONGEST-LIVED PLACES', 0]], x0, y0 - 70, 30, k, { serif: false, col: P.cream, glow: false, weight: 600 });
    srcLine(ctx, t, 'LIFE EXPECTANCY · THREE DECADES', x0, y0 - 34, clamp(k * 1.2 - .15), { size: 21 });
    ctx.strokeStyle = rgba(P.blue2, .85 * k); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    const du = sineIO(span(t, a.studied + .2, a.decades3 + 1.4)), sl = smooth(span(t, a.slowly - .2, a.slowly + .8));
    LE.forEach((l, i) => {
      const pts = []; for (let s = 0; s <= 24; s++) { const u = s / 24, v = l.y0 + l.g * (1 - Math.exp(-l.k * u)) / (1 - Math.exp(-l.k)); pts.push([lerp(x0 + 6, x1, u), lerp(y1 - 8, y0 + 8, v)]); }
      if (du > 0) trailSpan(ctx, pts, 0, du, { w: 2, a: .55 * k, spark: false });
      if (sl > 0) trailSpan(ctx, pts, .62, .62 + .38 * sl * du, { w: 2.6, a: .9 * k * sl, spark: false });
    });
    if (sl > 0) maskLine(ctx, [['MORE SLOWLY', 0]], x1, y1 - 22, 26, sl * k, { serif: false, align: 'right', col: P.halo0, glow: true, weight: 600 });
    srcLine(ctx, t, 'OLSHANSKY ET AL. · NATURE AGING 2024', x0, y1 + 40, clamp(k * 1.3 - .3), { size: 19 });
    ctx.restore();
  }
  // 7.11–7.12 the verdict (top right): IMPLAUSIBLE THIS CENTURY · UNLESS; the three icons slide into UNLESS
  function verdict(ctx, t) {
    const u = rise(span(t, a.verdict - .1, a.verdict + .7)), out = expoIn(span(t, a.words - .3, a.words + .4));
    if (u <= 0 || out >= 1) return;
    const k = u * (1 - out);
    ctx.save(); ctx.translate(0, out * 40);
    srcLine(ctx, t, 'HIS VERDICT', VX, VY - 60, k, { size: 22, col: P.halo0 });
    const iu = rise(span(t, a.implaus - .5, a.implaus + .3)) * (1 - out);
    maskLine(ctx, [['RADICALLY LONGER LIFE', 0]], VX, VY - 14, 28, k, { serif: false, col: P.cream, glow: false, weight: 600 });
    maskLine(ctx, [['IMPLAUSIBLE', 0]], VX, VY + 40, 44, iu, { serif: false, col: P.cream, glow: true, weight: 600 });
    srcLine(ctx, t, 'THIS CENTURY', VX, VY + 78, clamp(iu * 1.2 - .1), { size: 24, col: P.cream });
    const un = rise(span(t, a.unless - .15, a.unless + .5)) * (1 - out), warm = smooth(span(t, a.unless, a.unless + .6));
    const absorb = (t0) => smooth(span(t, t0 + .45, t0 + 1.0));
    const glow = .25 * (absorb(a.btn) + absorb(a.search) + absorb(a.eyeW));
    if (un > 0) { maskLine(ctx, [['UNLESS', warm]], VX, VY + 170, 84, un, { serif: true, col: P.cream, glow: true });
      if (glow > 0) halo(ctx, VX + 120, VY + 140, 160, glow * (1 - out), P.halo0, P.core0);
      srcLine(ctx, t, 'AGING ITSELF CAN BE MARKEDLY SLOWED', VX, VY + 212, rise(span(t, a.slowed - .4, a.slowed + .4)) * (1 - out), { size: 19, col: P.halo0 }); }
    srcLine(ctx, t, 'OLSHANSKY ET AL. · NATURE AGING 2024', VX, VY + 244, clamp(k * 1.2 - .2), { size: 19 });
    // three icons rise below the word on their word and slide into it
    [[a.btn, 'button'], [a.search, 'grid'], [a.eyeW, 'eye']].forEach(([t0, kind], i) => {
      const r = rise(span(t, t0 - .15, t0 + .35)), m = sineIO(span(t, t0 + .35, t0 + 1.0)); if (r <= 0 || m >= 1) return;
      const sx = VX + 360, sy = VY + 40 + i * 92, ex = VX + 60 + i * 80, ey = VY + 135;
      const x = lerp(sx, ex, m), y = lerp(sy, ey, m) - 30 * Math.sin(m * Math.PI) + (1 - r) * 30, sc = 1 - .85 * m;
      ctx.save(); ctx.globalAlpha *= clamp(r * 2) * (1 - out); ctx.translate(x, y); ctx.scale(sc, sc);
      if (kind === 'button') F.button(ctx, t, 0, 8, 26, { u: 1, slots: 4, lit: 1 });
      else if (kind === 'grid') F.symbol(ctx, t, 'grid', 0, 0, 58, { u: 1, cool: .6 });
      else F.eye(ctx, t, 0, 0, 74, { open: 1, young: .8 });
      ctx.restore();
    });
    ctx.restore();
  }
  // 7.13 the glass pane over the needle path (radial, at PANE_V), a glint runs along it; label top right
  function pane(ctx, t, c) {
    const u = span(t, a.glass - .3, a.glass + .7); if (u <= 0) return;
    const d = wp(c, 0, GY, CLOCK.Z); if (!d) return;
    const cx = d[0], cy = d[1], R = CLOCK.R * d[2], ang = F.angOf(PANE_V), ca = Math.cos(ang), sa = Math.sin(ang);
    const back = expoIn(span(t, a.more + 1.2, tP1 - .15));                     // it retracts into the rim as we pull back (the plate has no pane)
    const r0 = R * lerp(.24, 1.0, back), r1 = R * 1.02, ru = expoOut(u);
    const P0 = [cx + ca * r1, cy + sa * r1], P1 = [cx + ca * lerp(r1, r0, ru), cy + sa * lerp(r1, r0, ru)];
    if (back < 1) {
      // the glass: a thin translucent slab (cool, clear), two edge lines of light
      const nx = -sa, ny = ca, wv = R * .03;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba(COOL.core, .24 * (1 - back)); ctx.beginPath(); ctx.moveTo(P0[0] + nx * wv, P0[1] + ny * wv); ctx.lineTo(P1[0] + nx * wv, P1[1] + ny * wv); ctx.lineTo(P1[0] - nx * wv, P1[1] - ny * wv); ctx.lineTo(P0[0] - nx * wv, P0[1] - ny * wv); ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = rgba(mixHex(COOL.core, P.core0, .5), .8 * (1 - back)); ctx.lineWidth = Math.max(1.4, R * .004);
      for (const sg of [1, -1]) { ctx.beginPath(); ctx.moveTo(P0[0] + sg * nx * wv, P0[1] + sg * ny * wv); ctx.lineTo(P1[0] + sg * nx * wv, P1[1] + sg * ny * wv); ctx.stroke(); }
      // the glint: once on "glass ceiling", once when the wedge touches it ("more of this research")
      for (const [g0, amp] of [[a.glass + .1, 1], [a.more + .95, .8]]) {
        const g = span(t, g0, g0 + .9); if (g <= 0 || g >= 1) continue;
        const gr = lerp(r1, r0, sineIO(g)), gx = cx + ca * gr, gy = cy + sa * gr;
        halo(ctx, gx, gy, R * .07, .9 * amp * Math.sin(g * Math.PI) * (1 - back), COOL.core, P.core0);
      }
    }
    const lu = rise(span(t, a.glass - .1, a.glass + .6)) * (1 - expoIn(span(t, a.more + 1.0, a.more + 1.6)));
    if (lu > 0) {
      maskLine(ctx, [['A GLASS CEILING', 0]], 1810, 200, 44, lu, { serif: false, align: 'right', col: P.cream, glow: true, weight: 600 });
      maskLine(ctx, [['NOT A BRICK WALL', 0]], 1810, 252, 30, rise(span(t, a.brick - .1, a.brick + .5)) * (1 - expoIn(span(t, a.more + 1.0, a.more + 1.6))), { serif: false, align: 'right', col: P.halo0, glow: false, weight: 600 });
      srcLine(ctx, t, 'S. JAY OLSHANSKY · UIC 2024', 1810, 290, clamp(lu * 1.2 - .2), { size: 19, align: 'right' });
    }
  }
}
const PANE_V = 3.3;
const WARD_X = [-375, -125, 125, 375];
const VX = 1440, VY = 210;
const CH = { x0: 140, x1: 560, y0: 250, y1: 470 };
const RING = (d) => [d.cx, d.cy - d.R * .43, d.R * .085];
let WARD_Y = 0, WARD_S = 1;
{ // the ward card: anchor the knot line (local y 0) at screen y 360 under the BODY camera of 6.05, 1 local px = 1 screen px there
  const c = BODY(.775, 840), s = c.f / (ZW - c.z);
  WARD_S = s; WARD_Y = c.y + (360 - H / 2) / s;
}

// quote text from timing.json: "<quote> — <who>, <src…>" (Q1) or "A: “…” — B: “…” · <src>" (Q2)
function splitQ(txt) {
  const dot = txt.lastIndexOf(' · ');
  if (dot > 0 && txt.indexOf('“') >= 0) {                                    // Q2 style: speakers inside the quote, source after ' · '
    const body = txt.slice(0, dot), src = txt.slice(dot + 3), parts = body.split(' — ');
    const [w, ...rest] = src.split(', ');
    return [parts, w, rest.join(', ')];
  }
  const [q, by = ''] = txt.split(' — '), [w, ...rest] = by.split(', ');
  return [q, w, rest.join(', ')];
}
// a quote card with explicit lines (no outer quote marks): same material as F.quoteCard (cream index card, ink type, gold rule)
function quoteLines(ctx, t, o) {
  // it rises out of a baseline (the tabletop edge / a line in the night) and sinks back behind it: never a fade
  const u = sineIO(span(t, o.t0, o.t0 + 1.1)), out = o.t1 != null ? sineIO(span(t, o.t1, o.t1 + 1.2)) : 0; if (u <= 0 || out >= 1) return;
  const size = o.size ?? 54, lines = o.lines, x = o.x ?? W / 2, y = o.y ?? 470;
  const w = Math.max(...lines.map((l) => measure(l, size))) + 230, lead = size * 1.3, hCard = lines.length * lead + 190 + (o.who ? 40 : 0);
  const base = o.base ? o.base() : y + hCard / 2 + 40, drop = base - (y - hCard / 2) + 30, dy = (1 - u) * drop + out * drop, k = 1;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, base); ctx.clip();
  ctx.translate(x, y + dy); ctx.scale(k, k);
  const p = new Path2D(); p.roundRect(-w / 2, -hCard / 2, w, hCard, 10);
  halo(ctx, 0, 0, w * .75, .35 * (1 - out) * u, P.halo0, P.core1);
  ctx.fillStyle = E.rad(ctx, -w * .2, -hCard * .3, w * .9, [[0, P.core0], [.6, P.core1], [1, P.halo1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.shade0, .6); ctx.lineWidth = 3; ctx.stroke(p);
  ctx.fillStyle = rgba(P.shade0, .8); ctx.fillRect(-w / 2 + 70, -hCard / 2 + 70, 5, hCard - 140);
  ctx.fillStyle = mixHex(P.night1, P.shade0, .4); ctx.beginPath(); ctx.arc(0, -hCard / 2 + 4, 13, 0, 6.29); ctx.fill();
  lines.forEach((ln, li) => {
    const lu = rise(span(t, o.t0 + .7 + li * .45, o.t0 + 1.5 + li * .45));
    let xx = -w / 2 + 110; const yy = -hCard / 2 + 95 + size * .8 + li * lead + (1 - lu) * 18;
    ctx.save(); ctx.globalAlpha *= lu; ctx.font = `${size}px "Instrument Serif"`;
    const gold = (o.gold || []).find(([ph]) => ln.includes(ph));
    if (gold) {
      const i0 = ln.indexOf(gold[0]), pre = ln.slice(0, i0), mid = gold[0], post = ln.slice(i0 + mid.length), warm = smooth(span(t, gold[1] - .05, gold[1] + .5));
      for (const [s, wm] of [[pre, 0], [mid, warm], [post, 0]]) { ctx.fillStyle = mixHex(INK, P.shade0, wm * .9); ctx.fillText(s, xx, yy); xx += measure(s, size); }
    } else { ctx.fillStyle = INK; ctx.fillText(ln, xx, yy); }
    ctx.restore();
  });
  if (o.who) { const w0 = o.whoAt ?? o.t0 + 1.0 + lines.length * .45, au = rise(span(t, w0, w0 + .8)); ctx.save(); ctx.globalAlpha *= au; ctx.font = '600 26px Inter'; ctx.letterSpacing = '4px'; ctx.fillStyle = rgba(INK, .8);
    ctx.fillText(o.who.toUpperCase(), -w / 2 + 110, hCard / 2 - 70 + (1 - au) * 10); if (o.src) { ctx.font = '500 21px Inter'; ctx.fillStyle = rgba(INK, .6); ctx.fillText(o.src.toUpperCase(), -w / 2 + 110, hCard / 2 - 38 + (1 - au) * 10); } ctx.restore(); }
  ctx.restore();
}

function wrap(txt, size, maxW) {
  const out = []; let cur = '';
  for (const wd of txt.split(/\s+/)) { const nx = cur ? cur + ' ' + wd : wd; if (cur && measure(nx, size) > maxW) { out.push(cur); cur = wd; } else cur = nx; }
  if (cur) out.push(cur); return out;
}
// one instance per timing object (sc05, sc06 and sc07 share it, so their boundaries are the same frame on both sides)
const CACHE = new WeakMap();
export function b2(T) { if (!CACHE.has(T)) CACHE.set(T, makeB2(T)); return CACHE.get(T); }
