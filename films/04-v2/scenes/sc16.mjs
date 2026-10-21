// c16 · Four thousand weeks (VO 07b + 07c, 457.70–499.44) · Film 4 v2 · shots.md §4 16.01–16.12
// One take in two worlds joined through one ring: the grid of weeks (lib/v2_c16_grid.mjs) and the room inside one of the last weeks
// (lib/v2_c16_room.mjs); lib/v2_c16_take.mjs anchors every time to the words and switches world only where the ring's hole fills the frame.
//
// | shot  | words (accent)                         | image                                                               | hero light        | camera                                   | flows on                          | sound            |
// |-------|----------------------------------------|---------------------------------------------------------------------|-------------------|------------------------------------------|-----------------------------------|------------------|
// | in    | (plate c15>c16, sky deep)              | at H.b the frame IS the deep sky plate (pixel-identical replica)    | starlight         | still (global float only)                | the stars are objects of the world| —                |
// | 16.01 | let time **stop** for a moment         | the twinkle and drift slow to a crawl (time warp, never zero)       | starlight         | still                                    | the stars start to move           | —                |
// | 16.02 | four thousand **weeks**                | the camera rises, the stars fly into 80 × 52 engraved rings;        | the grid          | pull-back + drift right (cio, 3.4 s)     | continuous                        | whoosh_airy 460.1|
// |       |                                        | 4,000 weeks (Instrument Serif, mask rise) + BURKEMAN source        |                   |                                          |                                   | shimmer 464.8    |
// | 16.03 | eighty **years**                       | a burin draws the year axis 0 … 80; 80 years                       | the grid          | slow push (5 s)                          | continuous                        | —                |
// | 16.04 | already **behind** you                 | rows 0–33 fill amber in reading order, ending in a breathing "now" | the "now" ring    | slow push                                | the title sinks, the camera dives | foil_glint 468.7 |
// | 16.05 | Bronnie Ware … final **weeks**         | dive (turning to look along the rows) into ring 79/26: a warm room  | lamp in the ring  | dive, log-distance (cio, 3.2 s)          | the ring's hole fills the frame:  | —                |
// |       |                                        | is seen through its hole (parallax); label BRONNIE WARE · …        |                   |                                          | the room IS the frame (472.24)    |                  |
// | 16.06 | she **listened** … regretted most      | night room: carer leans in, her hand to the patient's, the patient  | the lamp          | slow push; then fly into the lamp shade  | the shade's paper fills the frame | card 476.4       |
// |       |                                        | opens her eyes, breathes; the lamp swells on "regretted"           |                   | (zoom about the lamp, qio 1.3 s)         |                                   |                  |
// | 16.07 | the **courage** …                      | card 1 printed on the glowing shade: THE MOST COMMON REGRET, words | the shade         | slow push 2 %                            | crane down the same paper         | —                |
// |       |                                        | light with the voice; As recorded by Bronnie Ware · … · 2011       |                   |                                          |                                   |                  |
// | 16.08 | worked so **hard**                     | card 2 below on the same shade: REGRET NUMBER TWO                  | the shade         | crane (qio .7 s), slow push              | out the same way                  | whoosh_airy 485.0|
// | 16.09 | the weeks you have **left**            | one eased pull-back: the shade → the room → the ring → the grid;    | the dotted weeks  | pull-back (cio 2.25 s over both worlds), | continuous                        | —                |
// |       |                                        | tilt up to look along the last row of dotted ghost weeks, glide    |                   | tilt, glide (trapezoid speed)            |                                   |                  |
// | 16.10 | look **back** and say it               | the last week; the camera rises and turns round over the grid      | the grid          | turn (qio 1.75 s)                        | continuous                        | swell 494.5      |
// | 16.11 | a wonderful **life**                   | every week lights warm in a wave, first week to last               | the wave          | slow drift                               | continuous                        | shimmer 495.0    |
// | 16.12★| I brought **good** into this world     | the light runs out of the weeks into a river from the first week   | the river         | dive into the river (ease-in 1.8 s)      | the river's surface is the fire   | bloom 499.5      |
// |       |                                        | past the last week into the dark; it fills the frame               |                   |                                          | plate: at H.a − 1/30 it IS c16>c17|                  |
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c16_kit.mjs';
import { anchors, setup, take } from '../lib/v2_c16_take.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c16', T);
  const A = anchors(T, HI, HO);
  setup(T, A); await ready();
  const draw = (ctx, t) => take(ctx, t, A, HO);
  const tPrint = A.riv1 + .7;      // the finish switches to the fire plate's during the fast dive into the river
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw,
      sound: [{ f: 'whoosh_airy', t: A.fly0 - .03, v: .22 }, { f: 'shimmer_rings', t: T.E('07b', 'thousand weeks') + .02, v: .28 }, { f: 'foil_glint', t: T.E('07b', 'behind you') + .04, v: .3 },
        { f: 'card', t: A.most + .2, v: .22 }, { f: 'whoosh_airy', t: A.q2e + .02, v: .28 }, { f: 'swell', t: A.sayIt + .02, v: .3 }, { f: 'shimmer_rings', t: A.life - .04, v: .26 }] },
    { t: tPrint, tr: 'cut', d: .1, print: HO.print, draw, sound: [{ f: 'bloom', t: A.world + .06, v: .42 }] },
  ];
};
