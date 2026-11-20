// Chapter 06 · "Creating, and giving" (VO 06a + 06b), 376.4 s … 433.78 s.
//
// CARRIER CHAIN (shot → carrier → next shot, type)
//  in   CLIP A (Altman) → its last frame tilts flat and becomes the kitchen table top        (b, drawn inside K1)
//  K1   table from above, the pencil rolls on "catch", nothing stops it, over the edge     → the falling pencil (c, down)
//  K2   the floor: it lands on an open, empty wallet; the wallet flaps shut on "money"     → the flap's sweep right (c, left-pan)
//  K3   a hand holds a stamp over an empty field … and sets it down unused ("permission")  → the hand: pull back into your hand (b, out)
//  K4   you, alone at the kitchen table, lamp on ("Only you")                              → the lamp pool on the table: push in (b, zoom)
//  K5   the map: your finger (one person), a pencil circle (one idea), a small cyan point   → the traced river line: push in, match (b, match)
//       wakes on "help" and traces the river
//  V    the traced line IS the river: a real valley, a child jumps in ("swam"); summers flip → the half-sunk sign in the reeds: push in (b, zoom)
//       on "every summer": clear → reeds → grey
//  SG   "No swimming" sign, grey reeds; it tilts on "paid" and falls in                    → the ripple ring opens the next shot (a, iris)
//  BK   the ripple spreads; people arrive along the bank and start clearing ("nobody")     → camera keeps moving down the road (c, left-pan)
//  ST   the street: she pins her council poster on "council"; a neighbour stops; the camera
//       glides on down the road to the shelter gate, which swings open on "shelter"; a
//       three-legged dog limps in and is scooped up                                        → the dog's leap up (c, up)
//  RV   your river at dawn: you wade in, splash on "start"; "the time": the sun crosses     → push in on your hands (b, zoom)
//  HP   your hands lift the tyre; the small cyan point beside them turns amber as you act   → the amber point rises and becomes the sun (a, iris)
//  SU   years later: the same river clear, children jump, splash on "reason"               → the droplets fly up (a/c, up)
//  MP ★ the droplets become lights; one kitchen window; huge pull-back on "multiply":
//       amber dots ignite in waves along endless coastlines (no globe)                     → push into one dot (b, zoom)
//  SQ   a town square at night: people set lanterns on the empty plinth ("respect")        → push into the dark shop window (b, zoom)
//  CR   grey shop: the cash drawer slides shut, unnoticed ("earn")                          → the drawer's slide right (c, left-pan)
//  LK   you row your old father across the lake; oars dip on "give"; he points, the heron
//       lifts off; it climbs, the camera follows it up into the darkening sky toward the
//       high meadow ridge at night ("answer")                                              → out: the ridge path (chapter 07)
import { K1, K2, K3, K4draw, K4hand, K4pool, K4cam, K5, setRiver } from '../lib/s06_home.mjs';
import * as V from '../lib/s06_river.mjs';
import * as TW from '../lib/s06_town.mjs';
import * as MP from '../lib/s06_map.mjs';
import * as LK from '../lib/s06_lake.mjs';

export default async function (T) {
  const S = (p, n) => T.S(p.includes('|') ? p.split('|')[0] : '06a', p.includes('|') ? p.split('|')[1] : p, n);
  const a = (ph, n) => T.S('06a', ph, n), b = (ph, n) => T.S('06b', ph, n);
  const A = {
    catch: a('catch'), nothing: a('nothing'), money: a('money'), permission: a('permission'), only: a('Only you'), onlyYou: T.S('06a', 'you', 1),
    person: a('person'), idea: a('idea'), help: a('help'), ago: a('ago'),
    river: a('river'), swam: a('swam'), dying: a('dying'), more: a('more'), summer: a('summer'),
    nobody0: a('Nobody'), paid: a('paid'), nobody: a('nobody', 1), // "Now nobody has to be."
    road: a('Down the road'), council: a('council'), finally: a('finally'), time0: a('time'),
    someone: a('Someone else'), shelter: a('shelter'), animals: a('animals'), wanted: a('wanted'),
    start: a('start'), river2: a('river', 1), haveTime: a('You have the time'), time: a('time', 1), haveHelp: a('You have the help'), help2: a('help', 1),
    best: a('best'), andBest: a('And you have the best'), reason: a('reason'), is: a('is'),
    multiply: b('multiply'), every: b('every'), kitchen: b('kitchen'), earth: b('Earth'),
    slowly: b('slowly'), respect: b('respect'), change: b('change'), earn: b('earn', 1), give: b('give'),
    giveLong: b('give', 1), question: b('question'), answer: b('answer'),
    end: T.seg('07a').start - 1.2,
  };
  void S;
  setRiver((q) => V.riverScreen(q, A));
  const t0 = T.seg('06a').start - 1.0;
  const K4c = K4cam(A.only, A.only);
  const k4hand = K4hand(K4cam(A.only - .1, A.only - .1)), k4pool = K4pool(K4cam(A.person - .3, A.only - .1)); void K4c;
  const shots = [
    { t: t0, draw: (c, t, s) => K1(c, t, s, A, T), tr: 'match', d: .5 },
    { t: A.nothing + .5, draw: (c, t, s) => K2(c, t, s, A), tr: 'down', d: .5 },
    { t: A.money + .55, draw: (c, t, s) => K3(c, t, s, A), tr: 'left', d: .42 },
    { t: A.only - .1, draw: (c, t, s) => K4draw(c, t, s, A), tr: 'out', x: k4hand[0], y: k4hand[1], depth: 5, d: .7 },
    { t: A.person - .3, draw: (c, t, s) => K5(c, t, s, A), tr: 'zoom', x: k4pool[0], y: k4pool[1], depth: 4, d: .8 },
    { t: A.ago + .55, draw: (c, t, s) => V.valley(c, t, s, A), tr: 'match', d: .9 },
    { t: A.nobody0 - .12, draw: (c, t, s) => V.sign(c, t, s, A), tr: 'zoom', x: V.signInV(A)[0], y: V.signInV(A)[1], depth: 7, d: .8 },
    { t: A.nobody - .82, draw: (c, t, s) => V.bank(c, t, s, A), tr: 'iris', x: V.RIPPLE[0], y: V.RIPPLE[1], r: 50, d: .8 },
    { t: A.road - .1, draw: (c, t, s) => TW.street(c, t, s, A), tr: 'left', d: .6 },
    { t: A.start - .5, draw: (c, t, s) => V.dawn(c, t, s, A), tr: 'up', d: .5 },
    { t: A.haveHelp - .05, draw: (c, t, s) => V.hands(c, t, s, A), tr: 'zoom', x: V.handsInDawn(A)[0], y: V.handsInDawn(A)[1], depth: 4, d: .5 },
    { t: A.andBest - .05, draw: (c, t, s) => V.summer(c, t, s, A), tr: 'iris', x: V.SUN_SU[0], y: V.SUN_SU[1], r: 30, d: .6 },
    { t: A.is + .2, draw: (c, t, s) => MP.map(c, t, s, A), tr: 'up', d: .6 },
    { t: A.slowly - .4, draw: (c, t, s) => TW.square(c, t, s, A), tr: 'zoom', x: MP.DOT_OUT[0], y: MP.DOT_OUT[1], depth: 8, d: .9 },
    { t: A.earn - .75, draw: (c, t, s) => TW.register(c, t, s, A), tr: 'zoom', x: TW.shopInSq(A)[0], y: TW.shopInSq(A)[1], depth: 5, d: .6 },
    { t: A.give - .5, draw: (c, t, s) => LK.lake(c, t, s, A), tr: 'left', d: .45 },
  ];
  return shots;
}
