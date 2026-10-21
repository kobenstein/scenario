// Chunk c13 · Film 4 v2 · "The catch" · shots 13.01–13.15 (bild/shots.md §4) · VO 06a · three continuous takes, every beat on VO words (anchors()).
// PLAN (times = current VO; all anchored via T.S/T.E)
// shot  | VO words                         | image                                                        | hero light              | camera                       | flow in → out                     | ★ | sound
// 13.01 | (plate) But wanting to           | the c12 amber line is the boom's reflector; the dawn road     | pre-dawn blue, one lit  | pull back 5.5x out of the    | plate line → boom (H.b exact)     |   |
//       |                                  | grows round it: barrier, toll gate, permit booth beyond      | window amber            | line                         |                                   |   |
// 13.02 | has a catch                      | the latch drops on the boom                                  |                         | hold, settle                 |                                   |   | key
// 13.03 | Now nothing stops you            | the boom rises by itself                                     |                         | glide down the road          | one dolly through all gates       |   | lever_switch
// 13.04 | Not money                        | toll arm lifts itself, coin basket empty                     |                         | (same dolly)                 |                                   |   |
// 13.05 | Not permission                   | permit shutter rolls up: nobody, the form blank              | sun rises behind you    | (same dolly)                 |                                   |   | curtain
// 13.06 | Only you                         | your long shadow alone on the road, then the lit window      | low sun, window glow    | fly into the window          | the window light fills the frame  |   | whoosh_airy
// 13.07 | One person, one idea             | the light is your lamp's bulb: you at the table at night,    | lamp pool, cyan help    | pull out of the bulb glare   | glow = bulb (drawn light)         |   |
//       | and help no scientist had        | pencil rings the river; the cyan help draws flow + samples   |                         | slow orbit                   |                                   |   | tone
// 13.08 | ten years ago                    | drawings lift as cards, multiply; your touch warms them amber| cyan → amber            | push in                      |                                   |   |
// 13.09 | Maybe it's the river             | dive into the river's ink until it is the frame              |                         | dive (quart), turns top-down | ink = the valley water (pivot)    |   |
// 13.10 | where you swam ... every summer  | the river, the rope swing hangs EMPTY; three slow summers dull| summer → dusk           | rise out of the water, drift | one valley take from here on      |   |
//       | Nobody was ever paid to save it  | the water, reeds choke it; the old swim sign sinks on "paid" |                         |                              |                                   |   |
// 13.11 | Now nobody has to be             | night passes into morning over the valley                    | dusk→night→dawn (cont.) | crane up, pan down the road  |                                   |   |
// 13.12 | runs for the town council ...    | she speaks from the town hall steps, small crowd from behind | morning                 | push to the hall             |                                   |   | chime (bell on "time")
// 13.13 | opens a shelter ... nobody wanted| he hangs the paw sign on its hook, kneels to the dog; donkey,| morning                 | truck right to the barn      |                                   |   |
//       |                                  | three-legged cat                                             |                         |                              |                                   |   |
// 13.14 | And you start on the river.      | you row, lift the net with rubbish, row; sensors turn cyan → | one slow sun arc        | crane down to the water      | years pass in one slow change     |   |
//       | You have the time / the help     | amber, the water clears (years)                              |                         |                              |                                   |   |
// 13.15 | And you have the best reason     | the S1 swing framing years later: a kid lets go, tucks,      | evening, clear water    | pan to the swing, tilt up    | droplets up → dusk sky = c13>c14  | ★ | splash, whoosh_up
//       | there is.                        | drops into clear water; a second kid cheers on the bank      |                         | with the droplets            | plate exact from H.a - .13        |   |
// Self-scores: poster 4 · sentence=image 4 · seamless 4 · alive 4 · people/props 4 · text 5.
import { canvas } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c13_kit.mjs';
import { roadTake, warmRoad } from '../lib/v2_c13_road.mjs';
import { kitchenTake, warmKitchen, samplePivot } from '../lib/v2_c13_kitchen.mjs';
import { valleyTake, warmValley } from '../lib/v2_c13_valley.mjs';

// every anchor from the VO (never seconds); last(ph) = the last word of a phrase
export function anchors(T) {
  const S = (p) => T.S('06a', p), E = (p) => T.E('06a', p);
  const last = (ph) => { const s0 = S(ph), n = ph.split(' ').length; return T.W('06a').filter((w) => w.s >= s0 - 1e-3)[n - 1]; };
  const H = handsOf('c13', T);
  const K = {
    HI: H.in, HO: H.out, b0: H.in.b, a1: H.out.a,
    but: S('But wanting'), catch: last('has a catch').s, catchE: E('has a catch'),
    now: S('Now nothing'), nothing: S('nothing stops'), stops: S('stops you'), you1: last('stops you').s, nowE: E('stops you'),
    money: S('money'), moneyE: E('money'), permission: S('permission'), permE: E('permission'),
    only: S('Only you'), you2: last('Only you').s, onlyE: E('Only you'),
    one: S('One person'), person: S('person'), idea: last('one idea').s, help: S('help no'), scientist: S('scientist'), had: S('had ten'), ten: S('ten years'), ago: last('years ago').s, agoE: E('years ago'),
    maybe: S('Maybe'), river1: S('river where'), swam: S('swam'), kid: S('kid'), dying: S('dying'), summer: S('summer'), summerE: E('every summer'),
    nobody1: S('Nobody was'), paid: S('paid'), saveE: E('save it'),
    now2: S('Now nobody'), nobody2: S('nobody has'), beE: E('has to be'),
    down: S('Down the road'), road: last('Down the road').s, someone: S('someone runs'), runs: S('runs'), council: S('council'), finally: S('finally'),
    has: last('she has').s, time1: last('she has the time').s, time1E: E('she has the time'),
    else: S('Someone else'), opens: S('opens'), shelter: S('shelter'), animals: S('animals'), wanted: S('wanted'), wantedE: E('nobody wanted'),
    and1: S('And you start'), start: S('start on'), river2: last('start on the river').s, river2E: E('start on the river'),
    you3: S('You have the time'), time2: last('You have the time').s, time2E: E('You have the time'),
    you4: S('You have the help'), help2: last('You have the help').s, help2E: E('You have the help'),
    and3: S('And you have the best'), best: S('best'), reason: S('reason'), there: last('reason there').s, isE: E('there is'),
  };
  // road take
  K.sun0 = K.permE - .1; K.push0 = K.you2 + .12; K.cut = K.one + .16;
  // kitchen take
  K.piv = K.maybe + .11;
  K.k = { c1: K.cut + .75, c1b: K.cut + 1.0, c2: K.idea + .66, c2b: K.had - .21, c3: K.ten + .21, dive: K.ago + .24,
    ring0: K.idea - .02, ring1: K.idea + .5, plume0: K.help + 1.25, lift0: K.had, touch: 0, touch0: K.ago - .2, touch1: K.ago + .3 };
  return K;
}

export default async (T, R) => {
  const K = anchors(T);
  warmRoad(); warmKitchen();
  { const [, g] = canvas(); for (const t of [K.b0 + .3, K.catch, K.money, K.permission + .4, K.you2 + .1, K.cut - .05]) { g.save(); roadTake(g, t, K); g.restore(); }
    for (const t of [K.cut + .5, K.help + .5, K.ten]) { g.save(); kitchenTake(g, t, K); g.restore(); } samplePivot(K); warmValley(K); await ready(); }
  const road = (ctx, t) => roadTake(ctx, t, K), kitchen = (ctx, t) => kitchenTake(ctx, t, K), valley = (ctx, t) => valleyTake(ctx, t, K);
  return [
    { t: K.b0, tr: 'cut', d: .1, draw: road, print: K.HI.print,
      sound: [{ f: 'key', t: K.catch + .02, v: .14 }, { f: 'lever_switch', t: K.nothing + .04, v: .16 }] },
    { t: K.now - .1, tr: 'cut', d: .06, draw: road, print: K.HI.print, sound: [{ f: 'curtain', t: K.permission + .03, v: .14 }] },
    { t: K.only - .2, tr: 'cut', d: .06, draw: road, print: K.HI.print, sound: [{ f: 'whoosh_airy', t: K.push0 + .05, v: .16 }] },
    { t: K.cut, tr: 'cut', d: .06, draw: kitchen, print: K.HI.print, sound: [{ f: 'tone', t: K.help + .02, v: .12 }] },
    { t: K.piv, tr: 'cut', d: .06, draw: valley, print: K.HI.print, sound: [{ f: 'chime', t: K.time1E + .02, v: .12 }, { f: 'splash', t: K.reason, v: .16 }] },
    { t: K.reason + .2, tr: 'cut', d: .06, draw: valley, print: K.HO.print, sound: [{ f: 'whoosh_up', t: K.reason + .14, v: .12 }] },   // same take: only the print eases to the out-plate's, inside the fast tilt
  ];
};
