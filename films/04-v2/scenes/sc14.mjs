// c14 · Every kitchen table on Earth (VO 06b) · Film 4 v2 · shots.md §4 14.01–14.05 · ONE continuous take (lib/v2_c14_take.mjs)
// | shot     | words                                  | image                                                                 | hero light            | camera                                              | flows on                         | sound          |
// | 14.01 ★  | Now multiply that by every kitchen     | the dusk sky plate IS the top of the frame; tilt down onto a dark      | the amber windows      | tilt down from the plate's sky, then a slow pull     | the pull back ends looking at    | whoosh_airy,   |
// |          | table on Earth.                        | country (relief bands, river, mist, ~4000 houses); on "multiply" the   | (waves from the river) | back over the country                               | one cottage: the dive            | multiply       |
// |          |                                        | kitchen windows light in waves outward from the river valley          |                       |                                                     |                                  |                |
// | (dive)   | (Earth … And)                          | one line of sight down into the cottage's open kitchen window, through | the kitchen lamp       | log-distance dive, turning to look straight down     | continuous take                  | whoosh         |
// |          |                                        | the room (lamp, table, chairs, shelf), straight down onto the table    |                       | inside the room                                     |                                  |                |
// | 14.02    | And slowly, what earns respect starts  | the table top: banknote (guilloche, microtext, stern portrait in the   | lamp pool; on          | top-down, slow push in, turning until the note       | continuous                       | foil_glint     |
// |          | to change.                             | oval, 100s), tea cup, pencil; on "respect" the oval glows (foil ring)  | "respect" the foil ring| lies level                                          |                                  |                |
// | 14.03    | Not what you earn.                     | the portrait and the 100s break into dots and lift off as smoke       | lamp pool             | hold, slow push                                     | continuous                       | gust           |
// | 14.04    | What you give.                         | in the empty oval an engraving cuts itself (two burins, then the       | the burin glints      | push into the oval                                  | fly into the oval                | pencil         |
// |          |                                        | ruling): someone rowing an old man across a lake at sunset, the hill   |                       |                                                     |                                  |                |
// |          |                                        | town beyond the water                                                 |                       |                                                     |                                  |                |
// | 14.05    | But give long enough, and you run into | colour floods out of the sun, the boat comes alive; the camera sinks   | the sun, then the town | into the oval (σ = 1: the picture becomes the world), | ends ON plate H4 (exact by       | swell          |
// |          | a question no project can answer.      | into the picture, night falls, terraces light bottom-up, labels write, | windows (night)        | then rises along the terraces to the summit          | H.a − 1/30)                      |                |
// |          |                                        | SELF-TRANSCENDENCE grows on "answer"                                  |                       |                                                     |                                  |                |
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c14_util.mjs';
import { warmLand } from '../lib/v2_c14_land.mjs';
import { warmKitchen } from '../lib/v2_c14_kitchen.mjs';
import { warmNote } from '../lib/v2_c14_note.mjs';
import { warmLake } from '../lib/v2_c14_lake.mjs';
import { anchors, take } from '../lib/v2_c14_take.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c14', T);
  const A = anchors(T, HI, HO);
  warmLand(); warmKitchen(); await ready();
  warmNote(); await ready();
  warmLake(A); await ready();
  const draw = (ctx, t) => take(ctx, t, A);
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw,
      sound: [{ f: 'whoosh_airy', t: HI.b + .02, v: .18 }, { f: 'multiply', t: A.mul - .04, v: .14 }, { f: 'whoosh', t: A.earthE - .12, v: .2 },
        { f: 'foil_glint', t: A.respect - .04, v: .2 }, { f: 'gust', t: A.earn + .12, v: .16 }, { f: 'pencil', t: A.burin0 + .02, v: .18 }] },
    // inside the picture: same take, the plate's print from here on (identical settings)
    { t: A.s1, tr: 'cut', d: .1, print: HO.print, draw, sound: [{ f: 'swell', t: A.answer + .25, v: .18 }] },
  ];
};
