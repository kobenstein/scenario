// c10 · B3 · 'Then you notice more' → 'Rules that move within a year' (station 4: both clocks, the scenario evening, take it apart).
// Takes in lib/b3_take.mjs (one file for the whole group, so the inner seams c10|c11|c12 are the same function on both sides).
// | ID   | anchor                        | zeigt wörtlich                                              | layer | carrier → next                        |
// |------|-------------------------------|-------------------------------------------------------------|-------|---------------------------------------|
// | 4.01 | Then you notice more          | out of plateRace the counter runs away, THE GAP stretches: THE RACE RUNS ON | EXPL | two hands            |
// | 4.02 | So set both clocks  (W)       | a cream hand on the cog, your hand on the ring; MATCH CUT on the ring → the ring on your chest: the scenario evening, warm lamp: SCENARIO · A FEW YEARS FROM NOW | MIX | the evening |
// | 4.03 | The headline still arrives    | the headline drops on the app, the pulse jumps out of your chest | SCENE | the phone                      |
// | 4.04 | But in this version           | push into the phone: a GRADE seal lands on the app          | MIX   | the seal                              |
// | 4.05 | Not for how clever            | the report card grows out of the seal; the smart rows dim   | EXPL  | the card                              |
// | 4.06 | For what it does              | the empty row WHAT IT DOES TO YOU fills (your yellow)       | EXPL  | the axis                              |
// | 4.07 | It was tested before release  | a time axis: a test mark at RELEASE, then every few months: TESTED BEFORE RELEASE | MIX | the bad mark          |
// | 4.08 | When something goes wrong     | one mark turns ochre, a line runs to the rule sheet, its cog turns: WITHIN THE YEAR | EXPL | the niches          |
// | 4.09 | And you know your reflexes    | the three niches cut in above you and light: FEAR GRAB STRAIGHT LINE · YOUR REFLEXES BY NAME | MIX | the evening |
// | 4.10 | Far away?                     | pull back: the evening becomes a picture in a frame of light | SCENE | the parts                            |
// | 4.11 | Take that evening apart       | seal, test mark, cog fly out of the picture, side by side   | EXPL  | the seal                              |
// | 4.12 | The grade?                    | the seal turns over: 15 chat windows (10 tip ochre): AN EARLY TEST + HumaneBench | EXPL | the test mark          |
// | 4.13 | Testing before release?       | the test mark grows into a test stand                       | EXPL  | the stand                             |
// | 4.14 | Demis Hassabis …              | a model rolls in, a body of three rises, the scan tests it, the bar lifts: launch · name + source | EXPL | the year |
// | 4.15 | The tests would be renewed    | a year line, four test marks light: PERHAPS EVERY QUARTER    | EXPL  | the cog                               |
import * as F from '../lib/f75_kit.mjs';
import { b3 } from '../lib/b3_take.mjs';
export default async (T, R) => {
  const B = b3(T), PR = F.PRINT75;
  return [{ t: R.a, draw: B.race, print: PR }, { t: B.cuts.c1, draw: B.wallTake, print: PR }];
};
