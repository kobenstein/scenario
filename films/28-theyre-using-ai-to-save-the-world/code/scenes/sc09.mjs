// c09 · No. 5 tsunami / GPS · W 5.11
// T.G('In the open ocean') → T.G("You're driving a train") · builder B2 · plan: docs/shots.md 5.01–5.11
// All of c07–c10 is ONE master draw (lib/f28_b2.mjs): the chunk boundaries sit inside continuous takes. This file only hands it over.
// Takes (the same sea world): the ring runs to Hawaii → Look up ★ (the twin ring climbs to the layer, ≈ 300 KM) → GPS beams tremble →
// down a beam to the night street (the arrow) → the bead reads the fingerprint (lamp 5) → two date tiles → C4 (NASA, mute) as a small
// plate in the sky over Hawaii, 32 MIN → RESEARCH OUTPUT tag → the coast lights warm → into the lighthouse: the light door (E.lightFlood,
// 1.4 s ramps) → out of the train's headlight (c10, lib/f28_b2_train.mjs).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import { b2 } from '../lib/f28_b2.mjs';

export default async (T, R) => {
  E.prepareEditorial();
  return [{ t: R.a, draw: b2(T).draw, print: F.PRINT28 }];
};
