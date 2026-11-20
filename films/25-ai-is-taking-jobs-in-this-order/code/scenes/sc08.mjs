// c08 · No. 2 care · the night rooms · Microsoft: nursing assistants near the very bottom · a person is the point · back to Jakob (J5)
// 'Number two' → "Number one isn't" · built by B3. Plan: docs/shots.md 8.01–8.09 · world/rules: docs/MOTION.md
// B3 draws c08–c11 as ONE take: the draw function lives in lib/f25_b3_main.mjs (helpers lib/f25_b3_art.mjs), so the inner chunk
// boundaries are identical frames by construction. Seam B2 → B3: S.plateRankRow for [T0, T0 + .5), then the plate's creep carries on.
//
// | ID    | anchor (phrase)                    | picture (one idea)                                                          | camera / layer        |
// |-------|------------------------------------|-----------------------------------------------------------------------------|-----------------------|
// | 8.01  | Number two · Care                  | out of plateRankRow: No. 2 tips a little (.12), No. 2 · CARE; care glyph warm | creep · ROW           |
// | 8.02  | The nurse who turns a patient      | the care glyph opens as a lit window in No. 2; fly in (3.3 s): the nurse     | window fly-in · SCENE |
// |       | The person who looks after … kids  | turns the patient under the bedside lamp; truck through the door: child + carer | truck · SCENE      |
// | 8.03  | In Microsoft's study               | back out of the window, up into the sky: slabs, INTERPRETERS top … NURSING   | pull back · EXPL      |
// |       |                                    | ASSISTANTS (warm) near the very bottom; source MICROSOFT                     |                       |
// | 8.04  | Here, the human isn't just …       | the warm slab rounds into a light; two people on a light line, one gives it, | glide · SCENE         |
// |       | … part of what's being given       | the other receives; it warms them both                                      |                       |
// | 8.05  | So the work that lasts             | the light drops into No. 1; No. 3 tips to its rail angle: only 2 and 1 stand | tilt down · ROW       |
// | 8.06W | Which brings us back to Jakob      | light door: into No. 1 → out of the TOPIC header (studio); IDEA taken, he climbs | dive · door · STUDIO |
// | 8.07  | [J5]                               | Jakob conducts on the top ledge, lower third JAKOB (top left)                | push · STUDIO         |
// | 8.08  | By hand, one film … two weeks      | 14 warm day tiles fly out of the desk lamp · 14 DAYS                         | glide down · EXPL     |
// | 8.09  | Now agents do the production       | a bead from the IDEA lane lays one cool tile · 1 DAY; he gives the direction | glide up · STUDIO     |
// |       | So what's left when … gone?        | push to the TOPIC header (the one warm lane) → light door W2 (c09)           | dive · door           |
import * as F from '../lib/f25_kit.mjs';
import { makeB3 } from '../lib/f25_b3_main.mjs';

export default async (T, R) => [{ t: R.a, draw: makeB3(T), print: F.PRINT25 }];
