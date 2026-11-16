// c10 · No. 4 the elephants and the train → plateGrass
// T.G("You're driving a train") → T.G('The snake') · builder B2 · plan: docs/shots.md 4.01–4.09
// All of c07–c10 is ONE master draw (lib/f28_b2.mjs): the chunk boundaries sit inside continuous takes. This file only hands it over.
// Takes (lib/f28_b2_train.mjs: the grass world of the seam with the train story right of the plate's view): out of the headlight, you at
// the controls → ahead along the cone into the dark: cow and calf on the track → a tower's eye, heat (REAL) → wide: 12 TOWERS · ≈ 7 KM,
// the bead's letters to DRIVER and RANGERS → the unopened pile for one beat, the letter opens warm, the brake, the train stops short
// (lamp 4) → 0 · ELEPHANTS KILLED ON THIS STRETCH → they cross; up over the trees and down into the grass while the slabs (≈ 600 ·
// ≈ 58,000) sink into it → plateGrass at T.G('The snake') − 0.5.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import { b2 } from '../lib/f28_b2.mjs';

export default async (T, R) => {
  E.prepareEditorial();
  return [{ t: R.a, draw: b2(T).draw, print: F.PRINT28 }];
};
