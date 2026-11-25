// c11 · B3 · 'Rules that move within a year' → 'Tonight, or tomorrow' (the UN framework, 3 → 135, none of it settled, ANCHOR 3/4, the hands).
// Takes in lib/b3_take.mjs.
// | ID   | anchor                        | zeigt wörtlich                                              | layer  | carrier → next                       |
// |------|-------------------------------|-------------------------------------------------------------|--------|--------------------------------------|
// | 4.16 | Rules that move within a year | the cog; its rule sheet rises behind it                     | EXPL   | the lectern                          |
// | 4.17 | Last month, the head          | a lectern rises, a framework sheet flies off it, 12 months fill: GLOBAL FRAMEWORK · WITHIN ONE YEAR + source | EXPL | the lectern |
// | 4.18 | And the pressure is there     | the lectern multiplies: copies peel off                     | EXPL   | the hall                             |
// | 4.19 | According to the UN …         | a hall of 135 lecterns rises; three light: 2017: 3 + source | EXPL   | the hall                             |
// | 4.20★| This year, a hundred …        | the light spreads through all 135, the rules cog turns: 2026: 135 | EXPL | the parts                        |
// | 4.21 | None of it is settled         | wide: the parts apart (links that never close), the counter racing far right, THE GAP | EXPL | the sheet   |
// | 4.22 | The framework is not a treaty | the framework sheet goes dashed: “IT’S NOT A TREATY, IT’S NOT REGULATION” + source | EXPL | the stand     |
// | 4.23 | The testing body would be paid| coins roll from the model's side into the stand: PAID MOSTLY BY THE INDUSTRY + source | EXPL | the gauges |
// | 4.24 | And it is not the course      | wide: the counter races faster, the gap holds: NOT THE COURSE WE’RE ON · Y. N. HARARI | EXPL | THE GAP |
// | 4.25 | But the race is a product (W) | MATCH CUT on THE GAP → ANCHOR 3/4 THE SUNRISE, the gap wide between you and the sphere: A PRODUCT OF CHOICES | ANCHOR | the picture |
// | 4.26 | Labs can test                 | the sunrise shrinks into a picture on the wall; the cog splits off the HUD; a hand: LABS | EXPL | hands |
// | 4.27 | Governments can write         | a second hand with a rule sheet + update cog: GOVERNMENTS   | EXPL   | hands                                |
// | 4.28 | Voters can demand both        | a third hand with a ballot: VOTERS                          | EXPL   | the ring                             |
// | 4.29 | And one clock needs no vote   | the ring splits off the HUD: NEEDS NO VOTE; it flies down onto your chest on the sofa | EXPL | the evening |
import * as F from '../lib/f75_kit.mjs';
import { b3 } from '../lib/b3_take.mjs';
export default async (T, R) => {
  const B = b3(T), PR = F.PRINT75;
  return [{ t: R.a, draw: B.wallTake, print: PR }, { t: B.cuts.c2, draw: B.sun3Take, print: PR }];
};
