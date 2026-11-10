// c03 · A language without a dictionary · baby, guessing game, recorder (B1) · T.G('Every baby on Earth') → T.G('Further than you might')
// Plan: docs/shots.md 3.01–3.14 · world: lib/f24_b1_c03.mjs (+ the kitchen lib/f24_b1_kitchen.mjs). ONE entry: ✂ in from c02 on the
// bright rectangle (the dictionary page = the kitchen window, same screen rect WINDOW), then one continuous take.
// | ID   | anchor                        | picture                                                                  | move / carrier              |
// | 3.01 | Every baby on Earth ✂         | the page's light is the kitchen window; pull back: parent, baby in a high chair | match on the bright rect |
// | 3.02 | A baby never gets             | sounds float as bubbles (small waves) from the parent past the baby's head | drift                     |
// | 3.03 | It notices which sounds       | the bubbles sort: same sound, same colour; pairs linked                   | sort · push to the baby    |
// | 3.04 | Then it notices what happens  | the baby makes a sound, the bottle comes up into the frame                | hand-in                    |
// | 3.05 | The team's A.I. does          | PULL BACK: the kitchen is one medallion in a mountain of calls (NO LABELS), a stream into the listener | pull back (window → medallion) |
// | 3.06 | Then it plays a guessing      | a call rises from the pile, a piece greys, the listener fills it (gold)   | gap fills                  |
// | 3.07 | Like autocomplete             | a phone keyboard; suggestions: finch, click, whale                        | phone rises · suggestions  |
// | 3.08 | Guess after guess             | clusters step out of the pile, same colour, linked                        | clusters                   |
// | 3.09 | But a baby has one more       | the kitchen medallion opens: the baby points at the bottle                | medallion opens            |
// | 3.10 | The machine can't             | the listener gets a blindfold                                             | blindfold                  |
// | 3.11 | tiny recorders                | a crow lands; its recorder explodes: MICROPHONE · MOTION SENSORS · 12.5 G | parts fly apart            |
// | 3.12 | They record each call         | two tracks out of the recorder: the call; FLYING · LANDING · FEEDING      | tracks run                 |
// | 3.13 | Patterns first                | PATTERNS → MEANING                                                         | arrow                      |
// | 3.14 | Twenty thirty is only         | the 2030 strip big (TODAY · NOV 2026 ——— 2030), docks again               | strip big → dock → c04     |
import * as F from '../lib/f24_kit.mjs';
import { anchors03, makeC03 } from '../lib/f24_b1_c03.mjs';

export default async (T, R) => {
  const a = anchors03(T);
  const W3 = makeC03(a, T);
  return [{ t: R.a, draw: W3.draw, print: F.PRINT24 }];
};
