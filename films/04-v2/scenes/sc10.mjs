// c10 · First, to people (04a from "First, to people" to the end of 04a). One continuous camera through two worlds: the old town by the
// sea at golden hour → dusk (World 1: lib/v2_c10_town.mjs, garden, lane, harbour) and the city of small flats at night (World 2: city,
// stairs, street). Every frame is a pure function of t; the plates c09>c10 (hill H2) and c10>c11 (night sky) are met exactly.
//
// | shot  | VO words                                   | image                                                                                   | hero light              | camera                                         | flows on by                              | sound                 |
// |-------|--------------------------------------------|-----------------------------------------------------------------------------------------|-------------------------|------------------------------------------------|------------------------------------------|-----------------------|
// | 10.01 | First, to **people**.                      | H2: BELONGING grows (focusU), its 'family' window lights amber                         | the window (amber)      | log push into the window (×330), centring it  | through the room into the garden         | whoosh_airy           |
// | 10.02 | Time for the ones you **love**, … still here.| the garden at golden hour: father in a chair with a blanket, mother at the roses, you  | low sun, long shadows   | drift in, settle                               | continuous                               | amb_dawn_birds        |
// |       |                                            | beside them; on "love" the mother's hand on your shoulder                              |                         |                                                |                                          |                       |
// | 10.03 | Your parents' **years**, … every weekend.  | the same garden through the seasons (one smooth pass): apples, a page turns           | the sun, slowly lower   | slow rise toward the gate                      | the gate opens                           | door (gate, pause)    |
// | 10.04 | Long dinners that go past **nine** …       | the lane: one long table of joined tables, neighbours, glasses; the chapel clock      | dusk rose, candles      | through the gate, turn down the lane           | look up                                  | amb_city_street,      |
// |       | tomorrow's a workday.                      | passes nine on "nine"; nobody gets up; a new bottle is opened                          |                         |                                                |                                          | paper_pop (cork)      |
// | 10.05 | Neighbours who know your **name**.         | a neighbour leans out of a window and waves; a guest waves back                        | warm window             | look up, then glide down the lane              | down to the harbour                      | whoosh_airy (pause)   |
// | 10.06 | A whole afternoon with a **friend**, …     | two friends on the harbour wall, legs dangling, a bag of cherries; the sun sets        | the setting sun (rim)   | rest by the wall, the sun's one arc            | tilt down to the water                   | amb_dawn (soft)       |
// | 10.07 | For decades … drifted **apart**.           | their reflections become two small boats that drift apart; one goes under the bridge  | last light, cold water  | tilt down, follow the boat into the vault      | through the vault                        | whoosh_airy (pause)   |
// | 10.08 | Small **flats**.                           | beyond the bridge one huge block, windows tiny; one lit window clicks on               | ONE warm window         | out of the vault, slow crane up                | the block grows                          | lamp (pause)          |
// | 10.09 | Long **commutes**.                         | a long crawl of headlights along the block's foot (streaks); the cold stair column     | headlights (cold)       | crane up, then the log push into the stair core| into the block                           | amb_city_night_hill,  |
// |       |                                            |                                                                                         |                         | window of floor 10                             |                                          | whoosh (pause)        |
// | 10.10 | Strangers on the same **staircase**.       | the spiral well from above (engraved): one unlocks a door, one waits with bags, apart  | cold landing lamps      | in through the window, look down the well      | the doors                                | amb_hall, key (pause) |
// | 10.11★| Now we get to build the **tribe** again.   | every landing's doors open in a cascade, warm light, neighbours step out to the railing| warm doorways           | rise up the well, out over the roof            | the street below: one long table, the    | door, bloom (pause),  |
// |       |                                            | and talk up and down; from the roof the road is one long table, lanterns light along it|                         |                                                | lanterns light along it like a fuse      | amb_bazaar            |
// | 10.12 | Streets full of people who aren't in a **hurry**. | over the street: people on the steps, an accordion player, a child on shoulders,| lanterns (amber)        | glide down along the street, tilt up           | the night sky = plate c10>c11            | whoosh_up (pause)     |
// |       |                                            | groups talking; the camera tilts up into the night sky                                  |                         |                                                |                                          |                       |
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c10_kit.mjs';
import { townAnchors, hillTake, townTake } from '../lib/v2_c10_town.mjs';
export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c10', T);
  const K = townAnchors(T);
  await ready();
  const draw = (ctx, t) => (t < K.cover ? hillTake(ctx, t, K) : townTake(ctx, t, K));
  const snd = (f, t, v, d) => (d ? { f, t, v, d, loop: true } : { f, t, v });
  const P = { riso: .3 };
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw, sound: [snd('whoosh_airy', K.first - .12, .28)] },
    { t: K.cover, tr: 'cut', d: .04, print: P, draw, sound: [snd('amb_dawn_birds', K.cover, .2, K.gateT - K.cover)] },
    { t: K.weekend, tr: 'cut', d: .04, print: P, draw, sound: [snd('door', K.weekendE + .02, .32), snd('amb_city_street', K.weekendE + .3, .18, K.whole - K.weekendE - .3)] },
    { t: K.workdayE - .5, tr: 'cut', d: .04, print: P, draw, sound: [snd('paper_pop', K.workdayE + .02, .3), snd('whoosh_airy', K.nameE + .02, .2)] },
    { t: K.whole, tr: 'cut', d: .04, print: P, draw, sound: [snd('amb_dawn', K.whole, .12, K.apartE + .3 - K.whole), snd('whoosh_airy', K.apartE + .02, .22)] },
    { t: K.small, tr: 'cut', d: .04, print: P, draw, sound: [snd('lamp', K.flats + .7, .3), snd('amb_city_night_hill', K.flats + .6, .18, K.pushEnd - K.flats - .6), snd('whoosh', K.commE - .05, .3)] },
    { t: K.strangers, tr: 'cut', d: .04, print: P, draw, sound: [snd('amb_hall', K.pushEnd, .2, K.tribe - K.pushEnd), snd('key', K.stairE + .06, .35), snd('door', K.now + .06, .28)] },
    { t: K.build, tr: 'cut', d: .04, print: P, draw, sound: [snd('bloom', K.againE + .04, .4), snd('amb_bazaar', K.tribe + .2, .22, HO.a - K.tribe - .2)] },
    { t: K.hurryE - .3, tr: 'cut', d: .04, print: HO.print, draw, sound: [snd('whoosh_up', K.hurryE + .05, .38)] },
  ];
};
