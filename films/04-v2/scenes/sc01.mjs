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
// v2 minute repair (c01, 2026-10-20): every transition inside the chunk is now one continuous take; the scene only hard-cuts at the
// junctions, where both sides draw the same picture: 0 → 11.50 openTake (the flip goes through darkness, the hero slip becomes row
// slip k = 0 before 8.72) · 11.50 the dawn light (the row's far light covers the frame, shrinks into the roof's sun) · 11.50 → 15.65
// morningTake (roof → the window → the map blind → the landing) · 15.65 the gold light · 15.65 → lakeTake (the hammock, one day as one
// sun arc, the wall, the push onto wallShot's frame) · bridge c01>c02 from its window start (b12, c02 draws it on from 25.47).
import { openTake, ready } from '../lib/sc01_m1_open.mjs';
import { canvas } from '../engine.mjs';
import { morningTake, rowToRoof } from '../lib/m1x_c01_morning.mjs';
import { lakeTake } from '../lib/m1x_c01_lake.mjs';
import { leafSprite } from '../lib/m1x_c01_kit.mjs';
import { b12, b12K, bridgeWin, warm } from '../lib/m1x_bridge.mjs';

export default async (T, R) => {
  const S = (p, n) => T.S('00a', p, n), E = (p, n) => T.E('00a', p, n), Sb = (p, n) => T.S('00b', p, n), Eb = (p, n) => T.E('00b', p, n);
  const K = { one: S('One day'), never: S('never'), work: S('work'), again: S('again'), againE: E('again'), your: S('Your income'), care: S('care'), ofE: E('care of'),
    rest: S('rest'), life: S('life'), lifeE: E('life'), so: Sb('So what'), doE: Eb('do you do'), sleep: Sb('Sleep'), sleepE: Eb('Sleep in'), travel: Sb('Travel'),
    finally: Sb('Finally'), restE: Eb('Finally rest'), but: Sb('But a few'), months: Sb('months'), wall: Sb('wall'), wallE: Eb('wall'),
    and: Sb('And the reason'), reason: Sb('reason'), guess: Sb('guess'), guessE: Eb('guess') };
  K.flip0 = K.againE + .3; K.flipEnd = K.flip0 + 1.05;
  const J1 = K.so - .25, J2 = K.finally - .1, K9 = b12K(T), B = bridgeWin('c01>c02', T);
  K.J1 = J1;
  const KM = { J1, doE: K.doE, sleep: K.sleep, sleepE: K.sleepE, J2, map: { t0: K.travel - .09, arrive: K.finally - .5 } };
  const KL = { t0: J2, months: K.months, wall: K.wall, tl0: K.but - .27, tl1: K.but + 2.43, push0: K.wall + .53, push1: K.wall + 1.98, K9 };
  const open = (ctx, t) => { const o = openTake(ctx, t, K); rowToRoof(ctx, t, KM, o.light); };
  // warm-up: build every cached texture once and wait for their Images to decode (see lib/sc01_m1_open.mjs, toImg)
  { const [, g] = canvas(); const at = (f, ts) => ts.forEach((t) => { g.save(); f(g, t); g.restore(); });
    at(open, [.5, K.never + .5, K.again + .3, K.flip0 + .5, K.care + .3, K.rest + .4, K.lifeE, J1 - .2]);
    at((g, t) => morningTake(g, t, KM), [J1 + .5, K.sleep + .3, K.travel + .3, J2 - .1]);
    at((g, t) => lakeTake(g, t, KL), [J2 + .5, K.months, K.wall + .6, KL.push1 + .2, K9.guess + .5]);
    for (let tone = 0; tone < 6; tone++) for (let v = 0; v < 3; v++) leafSprite(tone, v);   // every leaf tone the season passes through
    await warm(T); await ready(); }
  const P = { riso: .3 };
  return [
    // 1.01 the rack, your card, the ghost rows, the lift (pre-roll from R.a: the rack in darkness, one amber light sweeping)
    { t: R.a, draw: open, print: P, sound: [{ f: 'tick', t: .15, v: .12 }, { f: 'lamp', t: .35, v: .12 }, { f: 'card', t: K.againE + .05, v: .2 }] },
    // 1.02 the turn: the card's back is the income slip; the seal lands on "care" (same take: the cut is invisible)
    { t: K.flip0, tr: 'cut', draw: open, print: P,
      sound: [{ f: 'whoosh_airy', t: K.flip0 + .05, v: .16 }, { f: 'foil_glint', t: K.flipEnd - .1, v: .22 }, { f: 'stamp', t: K.care + .01, v: .22 }] },
    // 1.03 ★ the row of slips to the horizon, the years engraved beside it; the far light grows over the frame (J1)
    { t: K.rest - .3, tr: 'cut', draw: open, print: P, sound: [{ f: 'multiply', t: K.rest - .25, v: .14 }, { f: 'swell', t: K.lifeE + .05, v: .2 }] },
    // 1.04–1.06 the dawn light shrinks into the sun; you on the roof; the window; the blind lowers ("Sleep"); the map on it ("Travel.")
    { t: J1, tr: 'cut', draw: (ctx, t) => morningTake(ctx, t, KM), print: P,
      sound: [{ f: 'curtain', t: K.sleep - .02, v: .16 }, { f: 'pencil', t: K.travel + .05, v: .12 }] },
    // 1.07–1.09 the gold light shrinks into the low sun over the lake; the hammock; one day; the wall; the push onto the slip on the wall
    { t: J2, tr: 'cut', draw: (ctx, t) => lakeTake(ctx, t, KL), print: P,
      sound: [{ f: 'gust', t: J2 + .3, v: .1 }, { f: 'tick', t: K.but - .2, v: .1 }, { f: 'boom', t: K.wall + .02, v: .35 }, { f: 'pencil', t: K.reason - .05, v: .12 }, { f: 'tick', t: K.guess + .04, v: .16 }] },
    // the bridge c01>c02: the same picture c02 draws on from 25.47 (b12 = wallShot(K9) inside the sheet's vignette at B.a)
    { t: B.a, tr: 'cut', draw: (ctx, t) => b12(ctx, t, T), print: P },
  ];
};
