// Chapter 02 "The first weeks" (honeymoon, the false dawn) · shots 2.01–2.11 · gold / rose
// Window: T.seg('02a').start - 1.2 (76.05) .. hill builder takes over at T.S('02a', "And it's not just you") - 0.6 (103.93).
// Carrier chain (shot -> carrier -> next, type):
//   [1.12 stripe on the water] -> zoom (b) at screen centre -> 2.01 harbour street at morning (opens on the gold stripe on the water, tilts up)
//   2.01 harbour: shutters open on "everything"; a rug is shaken -> its gold dust (b, zoom into the dust) -> 2.02
//   2.02 bedroom: dust motes in the morning beam; you sit up and stretch on "wakes" -> the raised hand leads the camera up (a, 'up') -> 2.03
//   2.03 checkout: a lemon drops in from above (the hand's lemon); ghost sum dissolves on "stop" -> runaway lemon (b, zoom) -> 2.04
//   2.04 knot on a hook (violet Sunday evening): it opens on "gone", warm light floods, rope slips and falls (a, 'down') -> 2.05
//   2.05 empty square: chin lifts on "no"; the exhale becomes wind, leaves + pigeons stream right -> camera whips right (c, 'left' + smear) -> 2.06
//   2.06 lanyard swinging on a hook, peaks right on "boss" -> whip right (c) -> 2.07
//   2.07 platform: grey crowd streams left, you walk right into the daylight on "commute" -> whip right (c) -> 2.08
//   2.08 doorstep: work boots left on the step, bare feet in the grass, you lean back on "down"; a little train crosses -> zoom into its window (b) -> 2.09
//   2.09 train window: the coast unspools, the train slows and the town arrives on "love" -> zoom into the town (b) -> 2.10
//   2.10 grandmother's kitchen: she opens the door before you knock, arms open on "Tuesday"; kettle steams -> zoom into the steam (b) -> 2.11
//   2.11 the two cups in the afternoon light, she pours, the spoon turns on "because"; steam curls out of the centred window and
//        the camera starts rising toward it (continuous, type a) -> hill builder continues the crane out onto the street.
// Art/motion code lives in lib/s02_kit.mjs (helpers), lib/s02_a.mjs (2.01–2.04), lib/s02_b.mjs (2.05–2.08), lib/s02_c.mjs (2.09–2.11).
import { harbour, bedroom, checkout, s3LemonScreen, knot } from '../lib/s02_a.mjs';
import { square, lanyard, platform, grass, s8TrainScreen } from '../lib/s02_b.mjs';
import { trainWindow, s9TownScreen, grandmaDoor, s10SteamScreen, twoCups } from '../lib/s02_c.mjs';
export default async (T) => {
  const t0 = T.seg('02a').start - 1.2;
  const S = (p) => T.S('02a', p);
  const t2 = 79.95, t3 = 82.42, t4 = 85.15, t5 = 88.85;
  const R1 = { t0, t1: t2, tOpen: S('everything'), shakes: [78.95, 79.25, 79.55, 79.85] };
  const R2 = { t0: t2, t1: t3, tWake: S('wakes') };
  const R3 = { t0: t3, t1: t4, tStop: S('stop') + .08, tRoll: 83.95 };
  const R4 = { t0: t4, t1: t5, tGone: S('gone') };
  const t6 = 91.35, t7 = 92.62, t8 = 94.1, t9 = 97.3;
  const R5 = { t0: t5, t1: t6, tNo: S('no.') };
  const R6 = { t0: t6, t1: t7, tBoss: S('boss') };
  const R7 = { t0: t7, t1: t8, tCommute: S('commute') };
  const R8 = { t0: t8, t1: t9, tDown: S('down') };
  const t10 = 100.25, t11 = 102.3;
  const R9 = { t0: t9, t1: t10, tLove: S('love') };
  const R10 = { t0: t10, t1: t11, tOpen: 100.75, tTue: S('Tuesday') };
  const R11 = { t0: t11, tBecause: S('because'), tRise: 103.6 };
  const lem = s3LemonScreen(R3, t4), trn = s8TrainScreen(R8, t9), town = s9TownScreen(R9, t10), stm = s10SteamScreen(R10, t11);
  return [
    { t: t0, draw: harbour(R1), tr: 'zoom', x: 960, y: 600, d: 1.0 },
    { t: t2, draw: bedroom(R2), tr: 'zoom', x: 560, y: 380, d: .8, depth: 5 },
    { t: t3, draw: checkout(R3), tr: 'up', d: .6 },
    { t: t4, draw: knot(R4), tr: 'zoom', x: lem.x, y: lem.y, d: .7, depth: 7 },
    { t: t5, draw: square(R5), tr: 'down', d: .7 },
    { t: t6, draw: lanyard(R6), tr: 'left', d: .45 },
    { t: t7, draw: platform(R7), tr: 'left', d: .45 },
    { t: t8, draw: grass(R8), tr: 'left', d: .45 },
    { t: t9, draw: trainWindow(R9), tr: 'zoom', x: trn.x, y: trn.y, d: .8, depth: 8 },
    { t: t10, draw: grandmaDoor(R10), tr: 'zoom', x: town.x, y: town.y, d: .8, depth: 6 },
    { t: t11, draw: twoCups(R11), tr: 'zoom', x: stm.x, y: stm.y, d: .7, depth: 4 },
  ];
};
