// c04 · The tour I · Kenya (B1) · T.G('Further than you might') → T.G('Now north, to Spain')
// Plan: docs/shots.md 4.01–4.10 · world: lib/f24_b1_c04.mjs (ONE plan sequence, one entry) · seam in: ✂ from c03 (field closes into the ESP pin) · seam out: plateNorth (lib/f24_seams.mjs)
// | ID   | anchor                         | picture                                                                         | move / carrier            |
// | 4.01 | Further than you might         | the c03 field closes into the gold ESP pin, pull back to the world; pins of the other teams grow; the tablet rises lower left | iris out · pins stagger |
// | 4.02 | Start in Kenya                 | flight to Kenya; the cream Kenya pin, OTHER TEAM · KENYA                          | flight                    |
// | 4.03 | Play an elephant a call        | iris into the savanna: a cow, a speaker on a jeep; it calls, she answers and walks towards it | iris · walk     |
// | 4.04 | They caught it on camera       | the Kenya medallion grows into the clip plate                                    | clip plate                |
// | 4.05 | [C2]                           | elephant playback · ORIGINAL FOOTAGE                                             | clip                      |
// | 4.06 | If elephants have names        | back into the medallion; tablet slot NAMES engraves (cream)                      | slot engraves             |
// | 4.07 | Also in Kenya, the Earth       | short pan inside Kenya to the gold Amboseli pin                                  | pan                       |
// | 4.08 | Elephant families often rumble | iris into dusk at Amboseli: a family, overlapping rumbles                        | iris                      |
// | 4.09 | Their A.I. listened to         | the rumbles slide into the listener; GREETING · CALF COMFORTED                   | waves → tags              |
// | 4.10 | A first step from patterns     | the chorus closes into the Amboseli pin; pull back onto Africa/Europe = plateNorth | iris closes → SEAM     |
import * as F from '../lib/f24_kit.mjs';
import { anchors04, scene } from '../lib/f24_b1_c04.mjs';

export default async (T, R) => {
  const a = anchors04(T);
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT24 }];
};
