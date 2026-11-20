// c07 · No. 7 Casey Harrell · subscribe 1 · the path down to the sea
// T.G('Casey Harrell knows') → T.G('Big ships are supposed') · builder B2 · plan: docs/shots.md 7.01–7.13
// All of c07–c10 is ONE master draw (lib/f28_b2.mjs): the chunk boundaries sit inside continuous takes. This file only hands it over.
// Takes: plateTree → window fly-in through lantern 7 (the tree camera is derived from the kitchen camera) → the kitchen (quote, the sentence
// trapped inside, the head: sensors, stalled signals, the bead, the dark thought cloud, the tape → his own voice; lamp 7) → the speaker
// light grows into C3 and the plate shrinks into the kitchen window → RESEARCH STUDY tag → ≈ 2,000,000 words → push through the left
// pane (subscribe 1: the hills, the path of lamps, you set one down lit; the warm pulse runs along the rail) → down to the sea, a ship
// light goes out. Code: lib/f28_b2_kitchen.mjs, lib/f28_b2_sea.mjs.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import { b2 } from '../lib/f28_b2.mjs';

export default async (T, R) => {
  E.prepareEditorial();
  return [{ t: R.a, draw: b2(T).draw, print: F.PRINT28 }];
};
