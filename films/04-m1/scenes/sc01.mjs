// Chunk c01 · Film 4 minute 1 in the Film 5 machinery · shots 1.01–1.09 · R.a (0) → R.b ("It sounds", 00c)
// Builder C01. Every accent is anchored to a VO phrase (T.S / T.E); the chunk range comes from R.
//
// PLAN (MOTION.md gate 1) — hero onset · carrier into the next shot · transition type · accent
// | shot | words                                         | hero onset (word)                                   | carrier → next                          | type     | acc |
// |------|-----------------------------------------------|-----------------------------------------------------|-----------------------------------------|----------|-----|
// | 1.01 | (pre-roll) One day soon, you might never …    | amber light sweeps the time-card rack, the camera   | your card rises out of its pocket       | take     |     |
// |      |                                               | glides to your card; "never": its future rows turn  | and turns over                          |          |     |
// |      |                                               | to dotted ghost lines; "again": it lifts out         |                                         |          |     |
// | 1.02 | Your income, taken care of.                   | the back is the engraved income slip; "care": seal  | the slip multiplies                     | take     | ▲   |
// | 1.03 | For the rest of your life.                    | "rest": the slips fan out into a row to the horizon,| the light at the far end                | (b) zoom | ★   |
// |      |                                               | one per month, years 2031 … 2071; the camera trucks |                                         |          |     |
// | 1.04 | So what do you do?                            | the far light is the sun; you on the roof at dawn   | the sun climbs, the camera tilts up     | (a) up   |     |
// | 1.05 | Sleep in.                                     | "Sleep": the blind lowers; the sun climbs past      | the sun arcs right                      | (c) whipR|     |
// | 1.06 | Travel.                                       | the dotted route burins across the map, a plane     | the route lands on a coast              | (b) push |     |
// | 1.07 | Finally rest.                                 | the lake at dusk, you in the hammock                | same place                              | take     |     |
// | 1.08 | But a few months in, you might hit a wall.    | days and nights flicker; "months": you sit up;      | the wall's surface (the slip pinned on) | (b) push | ▲   |
// |      |                                               | "wall": the paper wall rises out of the lake (boom) |                                         |          |     |
// | 1.09 | And the reason isn't the one you'd guess.     | the slip pinned to the wall, still glowing; a       | the wall fills the frame; c02 pulls out | (c02 out)|     |
// |      |                                               | guilloche "?" engraves itself; its dot on "guess"   |                                         |          |     |
// Ends on a composition with the wall filling the frame (c02 opens with a pull-out to a small vignette of it).
import { openTake, rowLight } from '../lib/sc01_m1_open.mjs';
import { roofShot, facadeShot, mapShot, mapCoast, lakeTake, wallShot } from '../lib/sc01_m1_world.mjs';

export default (T, R) => {
  const S = (p, n) => T.S('00a', p, n), E = (p, n) => T.E('00a', p, n), Sb = (p, n) => T.S('00b', p, n), Eb = (p, n) => T.E('00b', p, n);
  const K = { one: S('One day'), never: S('never'), work: S('work'), again: S('again'), againE: E('again'), your: S('Your income'), care: S('care'), ofE: E('care of'),
    rest: S('rest'), life: S('life'), lifeE: E('life'), so: Sb('So what'), doE: Eb('do you do'), sleep: Sb('Sleep'), sleepE: Eb('Sleep in'), travel: Sb('Travel'),
    finally: Sb('Finally'), restE: Eb('Finally rest'), but: Sb('But a few'), months: Sb('months'), wall: Sb('wall'), wallE: Eb('wall'),
    and: Sb('And the reason'), reason: Sb('reason'), guess: Sb('guess'), guessE: Eb('guess') };
  K.flip0 = K.againE + .3; K.flipEnd = K.flip0 + 1.05;
  const t04 = K.so - .25, t05 = K.sleep - .25, t06 = K.travel - .1, t07 = K.finally - .1, t09 = K.and - .3;
  const K4 = { t0: t04, out: t05 + .3 }, K5 = { t0: t05, sleep: K.sleep, out: t06 + .15 }, K6 = { t0: t06, arrive: K.finally - .35, out: t07 + .25 };
  const K7 = { t0: t07, but: K.but, months: K.months, wall: K.wall, out: t09 }, K9 = { t0: t09, reason: K.reason, guess: K.guess, end: R.b + 1 };
  const [lx, ly] = rowLight(t04, K), [cx, cy] = mapCoast(K6, t07);
  return [
    // 1.01 the rack, your card, the ghost rows, the lift (pre-roll from R.a: the rack in darkness, one amber light sweeping)
    { t: R.a, draw: (ctx, t) => openTake(ctx, t, K), print: { riso: .35 },
      sound: [{ f: 'tick', t: .15, v: .12 }, { f: 'lamp', t: .35, v: .12 }, { f: 'card', t: K.againE + .05, v: .2 }] },
    // 1.02 the turn: the card's back is the income slip; the seal lands on "care"
    { t: K.flip0, tr: 'cut', d: .08, draw: (ctx, t) => openTake(ctx, t, K), print: { riso: .3 },
      sound: [{ f: 'whoosh_airy', t: K.flip0 + .05, v: .16 }, { f: 'foil_glint', t: K.flipEnd - .1, v: .22 }, { f: 'stamp', t: K.care + .01, v: .22 }] },
    // 1.03 ★ the row of slips to the horizon, the years engraved beside it
    { t: K.rest - .3, tr: 'cut', d: .08, draw: (ctx, t) => openTake(ctx, t, K), print: { riso: .3 },
      sound: [{ f: 'multiply', t: K.rest - .25, v: .14 }, { f: 'swell', t: K.lifeE + .05, v: .2 }] },
    // 1.04 the far light becomes the sun over the city; you on the roof
    { t: t04, tr: 'zoom', x: lx, y: ly, depth: 3.2, d: 1.0, draw: (ctx, t) => roofShot(ctx, t, K4), print: { riso: .25 } },
    // 1.05 sleep in: the blind lowers
    { t: t05, tr: 'up', d: .6, draw: (ctx, t) => facadeShot(ctx, t, K5), print: { riso: .3 }, sound: [{ f: 'curtain', t: K.sleep - .02, v: .16 }] },
    // 1.06 travel: the route on the paper map
    { t: t06, tr: 'whipR', d: .3, draw: (ctx, t) => mapShot(ctx, t, K6), print: { riso: .3 }, sound: [{ f: 'pencil', t: t06 + .15, v: .12 }] },
    // 1.07 + 1.08 the lake, the hammock, the flicker of days, the wall
    { t: t07, tr: 'push', x: cx, y: cy, d: .5, draw: (ctx, t) => lakeTake(ctx, t, K7), print: { riso: .3 }, sound: [{ f: 'gust', t: t07 + .3, v: .1 }, { f: 'tick', t: K.but - .2, v: .1 }, { f: 'boom', t: K.wall + .02, v: .35 }] },
    { t: K.but - .1, tr: 'cut', d: .08, draw: (ctx, t) => lakeTake(ctx, t, K7), print: { riso: .3 } },
    // 1.09 the wall up close: the slip pinned, still glowing; the guilloche "?" (its dot on "guess")
    { t: t09, tr: 'push', d: .6, draw: (ctx, t) => wallShot(ctx, t, K9), print: { riso: .3 }, sound: [{ f: 'pencil', t: K.reason - .05, v: .12 }, { f: 'tick', t: K.guess + .04, v: .16 }] },
  ];
};
