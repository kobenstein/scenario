// c10 · Act 4 · how do you stay on the right side of the row: five skills (judgment, directing, trust, hands + head, steps) · K3 Gates
// 'So how do you stay' → second 'Every time the machine took a step' · built by B3 (draw: lib/f25_b3_main.mjs). Plan: docs/shots.md 10.01–10.08
// K3: F25_K3=clip|card (default: clip if the timing has a K3 slot, else card). Card = F.QUOTES.gates in the same plate, same motion.
//
// | ID     | anchor (phrase)                   | picture (one idea)                                                         | camera / layer        |
// |--------|-----------------------------------|----------------------------------------------------------------------------|-----------------------|
// | 10.01  | So how do you stay …              | you walk on past No. 1 (the rail sinks); five warm mini stones fly out of   | tilt up · ROW         |
// |        |                                   | No. 1 into the sky and stand as an index row 1–5                            |                       |
// | 10.02  | First, judgment                   | 1 JUDGMENT: finished (cool) vs good (warm) stand up; the senior points at   | onto stone 1 · EXPL   |
// |        |                                   | the good one; a cool button glides in and stops short                       |                       |
// | 10.03  | Second, directing                 | 2 DIRECTING: a goal splits into four steps, handed to four beads, checked   | truck · MIX           |
// |        |                                   | back; Jakob walks in and conducts                                           |                       |
// | 10.04  | Third, trust                      | 3 TRUST: three people, warm threads on buy · hire · follow; a bead outside  | truck · EXPL          |
// | 10.05  | Fourth, hands plus a head         | 4 HANDS + HEAD: wrench, a bead in the pocket, the basement pipe in his torch | truck · EXPL         |
// |        |                                   | circle; the bead that arrives, he runs it                                   |                       |
// | 10.06  | And fifth, learning in steps      | 5 STEPS: a bead takes the old step (it falls), you step onto the next       | truck · EXPL          |
// | 10.07  | Even Bill Gates calls this …      | the plate grows from stone 5's face; each explainer folded back into its stone | MIX                |
// | 10.08  | [K3]                              | K3 (or the Gates card); under the plate the camera rises into the stars and  | CLIP                  |
// |        |                                   | comes down on the ending row (world switch while only sky is in frame)      |                       |
import * as F from '../lib/f25_kit.mjs';
import { makeB3 } from '../lib/f25_b3_main.mjs';

export default async (T, R) => [{ t: R.a, draw: makeB3(T), print: F.PRINT25 }];
