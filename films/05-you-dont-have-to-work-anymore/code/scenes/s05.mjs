// Chapter 05 · "Who you are" (palette: night amber → warm workshops → gold/red earth → cream on indigo → rose → amber).
// The hill builder (scenes/hill.mjs) owns T.S('05a','Something made by human')-0.5 … T.S('05a','When people in Kenya')-0.5
// and T.S('05b','It means')-0.4 … T.clip('A').start-0.6. Everything else of chapter 05 lives here.
//
// CARRIER CHAIN (shot → carrier → next, type)
//  [04 · 4.16 street, child's raised hand] → (a, up) camera rises over the roofs →
//  5.01 long table from above, crane up; YOU (amber coat) stand up and drift to the dark quay edge on "enough";
//       the neighbour turns after you → (b, zoom) into that neighbour →
//  5.02 eye level, the neighbour turns, glass comes up on "asks", glint on "do" → (b, zoom) into the glass →
//  5.03 the name tag on your amber lapel; "Senior Account Manager" lifts off as ink dust on "title"; blank tag glows →
//       (b, zoom) into the blank tag →
//  5.04 the tag pinned to a canvas in an attic studio (faint sketch of the terraced hill town); a brush hand lays an
//       amber stroke on "nobody"; the brush throws paint and whips right → (c, right) → [HILL 3 in, hill.mjs]
//  [hill.mjs 5.05–5.11: the sign painter's stroke sweeps across] → (c, right) →
//  5.12 G5 Kenya: the stroke lands and becomes the coastline, the border draws, study villages in the west light;
//       cyan payments drop on "received" and turn amber; "They didn't work less." → (b, zoom) into one village dot →
//  5.13 a roadside stall at dusk: the shutter rolls up on "started", the tailor's machine starts; the thread is pulled
//       taut and races right → (c, right) →
//  5.14 the thread whips in, slack, and snaps taut into a circle on "less" →
//  5.15 G6 the circle becomes a 24-hour ring: flow ticks pop on "alive", dense at work, sparse at leisure; pull back to
//       more rings (more people) → the ring rolls out right → (a/c, right) →
//  5.16 the ring rolls in over rose dusk, unrolls into a paper strip that tears into two ("not having to work" /
//       "not working"), flutter in sync on "alike", separate on "difference" (one warms, one cools); the warm one
//       falls → (c, down) →
//  5.17 the attic-warm pottery: the strip folds and settles into the potter's open hands at rest beside the finished
//       pot on "not working"; centred for the hill's pull-back → [HILL 3 out, hill.mjs, "It means wanting to."]
//  [hill sweep whips right] → (c, right) →
//  CLIP A Altman: the portrait frame slides in from the left with smear, ease-out landing; a dusk wheat field drifts
//       behind at ~30 %; name label beside the frame; breathing push → (b) push into the last frame, it tilts flat and
//       becomes the top of a kitchen table at night → [06 · 6.01]
import { shot01, shot02, shot03, shot04, zoom02to03 } from '../lib/s05_w1.mjs';
import { shot12, shot13, shot14, shot16, shot17, zoom12to13 } from '../lib/s05_w2.mjs';
import { shotClipA } from '../lib/s05_w3.mjs';

export default async function (T) {
  return [
    shot01(T),
    shot02(T),
    shot03(T, zoom02to03(T)),
    shot04(T, [960, 520]),
    shot12(T),
    shot13(T, zoom12to13(T)),
    shot14(T),
    shot16(T),
    shot17(T),
    shotClipA(T),
  ].filter(Boolean);
}
