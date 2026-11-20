// Chapter 00 · "The Morning" (cold open), 0:00 → CLIP M exit (~40.2 s).
// Carrier chain (shot → carrier → next, transition type):
//   0.01 floor stripe climbs onto a sleeping hand ("wake": fingers stir) → the stripe climbs on up → (a, up) 0.02
//   0.02 bedside: empty watch dish, phone face down; the stripe reaches the phone ("No"); the phone flips → its cyan light → (b, zoom) 0.03
//   0.03 K1 bedroom at blue hour, you on the bed edge; phone flares on "one"; head lifts → the window pane → (b) ★ push through the glass
//   0.04 the harbour front fills the frame; windows ignite in a wave from the centre on "taken care" → one lit window → (b, zoom) 0.05
//   0.05 inside, a hand turns a single page; it flips on "month" and folds into a paper boat → (a, exit right) 0.06
//   0.06 the paper boat drifts through four seasons ("year") → it sails out right → (c, right) 0.07
//   0.07 the horizon becomes a thread of light that outruns the camera ("rest") → the line bends up → (a, up) 0.08
//   0.08 you on the bed, the dark coat of the years slides off on "don't" → it falls as a shadow on the floor → 0.09
//   0.09 "Ever." 3-frame accent + punch-in: the stripe swallows the shadow, the room floods amber → the curtain swings at the lens → (c, left) 0.10
//   0.10 you at the open window, small over the bay; head turns on "do" → the camera drops with your gaze → (a, down) 0.11
//   0.11 sleep in: sunlight slides across the pillow as hours pass → a wave runs through the duvet to the right → (c, right) 0.12
//   0.12 travel: ferry on the swell (same rightward motion), you at the rail, gulls → a gull peels off → (a) lands on the rock in 0.13
//   0.13 finally rest: sun-warmed rock, arm over the eyes → the sun sets fast to the horizon → (b, match) horizon = wall top 0.14
//   0.14 a garden wall at dusk, your hand slides along, stops on "wall" → the wall → (b, pull back 'out') into the harbour roofline 0.15
//   0.15 the harbour at nightfall, slow pull-back; one window flickers on "guess" → its spark → (a, up) 0.16
//   0.16 the spark becomes a soap bubble with the bedroom inside ("daydream" squash) → it falls and lands as a spot of light → (b, match) 0.17
//   0.17 dark stage, round spotlight, mic; cyan phones in the hall; spotlight tightens on "stage" → the spotlight circle → (b) CLIP M
//   CLIP M: the circle squares off into the portrait footage frame + name label → frame shrinks to a small lit rect, exits right at mid-height
//           (y = 540, ~150×94, warm #fff0cc→amber, x 960 → 2150 between M.end+.05 and M.end+.42) → chapter 01's night-train front window.
import { W, H, toScreen, harbour, harbourWindow, HARBOUR_P } from '../lib/s00_world.mjs';
import { floorStripe, bedside, bedroomBlue, harbourWave, hcam04, pageTurn, boatSeasons, horizonThread, bedroomCoat, openWindow, pillow, ferry, rock, gardenWall, harbourNight, bubble, stage, clipM } from '../lib/s00_open.mjs';
import { ein, lin, mix } from '../engine.mjs';

export default async function build(T) {
  const S = (p, n) => T.S('00a', p, n), Sb = (p, n) => T.S('00b', p, n), Sc = (p, n) => T.S('00c', p, n), M = T.clip('M');
  // anchors (all from the VO word timings)
  const wake = S('wake'), No = S('No'), phone = S('phone'), one = S('one'), taken = S('taken'), month = S('month'), year = S('year'), rest = S('rest'), life = S('life');
  const dont = Sb("don't"), ever = Sb('Ever'), whatDo = Sb('do', 2), sleep = Sb('Sleep'), travel = Sb('Travel'), fin_ = Sb('Finally'), but = Sb('But'), wall = Sb('wall'), andR = Sb('And the reason'), guess = Sb('guess');
  const sounds = Sc('It sounds'), daydream = Sc('daydream'), stageW = Sc('stage');
  const t02 = No - .25, t03 = phone + .45, t04 = taken - .3, t05 = month - .55, t06 = year - .55, t07 = rest - .45, t08 = life + .9, t09 = ever - .02, t10 = whatDo - .85, t11 = sleep - .1, t12 = travel - .1, t13 = fin_ - .05, t14 = but - .02, t15 = andR - .1, t16 = sounds - .5, t17 = daydream + 1.05, tM = M.start - 1.0;
  const h0 = t04 + .05;
  const winW = harbourWindow('blue', 1010, 560);
  const win = { x: winW.x, y: winW.y + winW.h / 2 };
  // where the lit window sits on screen when the zoom into it starts (same camera as harbourWave)
  const tmW = { h0, wave: taken - .08, in0: t05 - .55, win, b: t05 + .35 };
  const camAt = (t) => { const hc = hcam04(t, h0), k = ein(lin(tmW.in0, tmW.b, t)); return { ...hc, x: mix(hc.x, win.x, k * .8), y: mix(hc.y, win.y, k * .8), z: hc.z * (1 + 1.4 * k) }; };
  const [wx, wy] = toScreen(camAt(t05), HARBOUR_P.town, win.x, win.y);
  const winN = harbourWindow('night', 700, 560);

  return [
    { t: 0, tr: 'black', draw: floorStripe({ reach: wake - .3, wake, exit: t02 }) },
    { t: t02, tr: 'up', d: .6, draw: bedside({ reach: No + .25, flip: phone - .25 }) },
    { t: t03, tr: 'zoom', d: .6, x: 1170, y: 640, depth: 5, draw: bedroomBlue({ one, push0: one + .62, push1: h0, h0 }) },
    { t: t04, tr: 'cut', d: .06, draw: harbourWave(tmW) },
    { t: t05, tr: 'zoom', d: .7, x: wx, y: wy, depth: 6, draw: pageTurn({ t0: t05, month, exit: t06 }) },
    { t: t06, tr: 'right', d: .45, draw: boatSeasons({ t0: t06, exit: t07 }) },
    { t: t07, tr: 'right', d: .45, draw: horizonThread({ rest, bend: life - .1, exit: t08 }) },
    { t: t08, tr: 'up', d: .7, draw: bedroomCoat({ t0: t08, dont, ever, swing: ever + .35, exit: t10 }) },
    { t: t09, tr: 'cut', d: .04, draw: bedroomCoat({ t0: t08, dont, ever, swing: ever + .35, exit: t10 }) },
    { t: t10, tr: 'left', d: .5, draw: openWindow({ dox: whatDo, exit: t11 }) },
    { t: t11, tr: 'down', d: .55, draw: pillow({ exit: t12 }) },
    { t: t12, tr: 'right', d: .45, draw: ferry({ peel: t13 - .55, exit: t13 }) },
    { t: t13, tr: 'match', d: .3, draw: rock({ set0: t14 - .75, exit: t14 }) },
    { t: t14, tr: 'match', d: .6, draw: gardenWall({ wall }) },
    { t: t15, tr: 'out', d: .9, x: 960, y: 560, depth: 4, draw: harbourNight({ guess, rise: guess + .5, exit: t16, win: { x: winN.x, y: winN.y } }) },
    { t: t16, tr: 'up', d: .6, draw: bubble({ dd: daydream, fall: t17 - .65, exit: t17 }) },
    { t: t17, tr: 'match', d: .4, draw: stage({ stage: stageW }) },
    { t: tM, tr: 'cut', d: .04, draw: clipM({ stage: stageW, morph0: tM + .15, morph1: M.start + .02 }, T) },
  ];
}
