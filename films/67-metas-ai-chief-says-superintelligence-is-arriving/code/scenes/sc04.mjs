// c04 · Checks 2 and 3 · builder B1 · 'But a referee only rules' → "That leaves Wang's boldest". Part of B1's ONE take (lib/b1_extra.mjs).
// Out: plateReferee (the take converges into REFEREE_CAM's creep from 2.4 s before the plate; the plate draws the last .5 s).
//
// | ID    | anchor (phrase)               | picture (one idea)                                                                         | camera              |
// |-------|-------------------------------|--------------------------------------------------------------------------------------------|---------------------|
// | 3.01  | But a referee only rules      | the referee by the ribbon; pull back left to the chalkboard (his field)                     | pull back · LAND    |
// | 3.02  | Check two                     | a twin board slides out from behind it, same heading RIEMANN HYPOTHESIS                     | wide · EXPL         |
// | 3.03  | One critic's worry            | the twin's face falls back: cardboard, only A = A; OBJECTION: "TAUTOLOGY" · AMY NIELSEN     | creep · EXPL        |
// | 3.04  | But the author didn't write   | the twin slides back; veil: THE REFEREE'S RULE BOOK, the dusty volume RIEMANN HYPOTHESIS (gold line from the board's label) slides out; MATHLIB source | push · MIX |
// | 3.05  | The people who build ... reject | glide to the author's corner; box 2 fills gold with ? (by itself)                         | glide right · EXPL  |
// | 3.06  | But whose work is it          | close on the gold file on his desk: two shadows fall on it, a person's and a shapeless one  | push in · MIX       |
// | 3.07  | The proof comes from          | the author by the AI's lit window (lines run fast); LEVENT ALPÖGE · ANTHROPIC · CLAUDE; the old bulb goes on; the calendar leafs OCT 6 → NOV 16 | pull back · MIX |
// | 3.08  | That company gains            | the window flares; C0 (picture only, muted) grows out of the window                         | push in · SCENE     |
// | 3.09  | He doesn't fully understand   | he holds the file away from himself; quote card "frankly completely outrageous" (NYT)      | creep · EXPL        |
// | 3.10★ | You don't say that            | the file flies out of his hand into box 3: it fills gold (three of five)                   | pull back · EXPL    |
// | 3.11  | Compare that with a second proof | split: right a card (the lectern, a handwritten manuscript, a person, the referee's seat EMPTY: A RIVAL PROOF CLAIM / BY A HUMAN / STILL A CLAIM); left the referee before the ribbon | glide right · MIX |
// | 3.12  | The machine's proof has been checked | the card sinks; the referee raises CORRECT, nobody reads the ribbon → plateReferee     | creep · LAND        |
// carriers: the referee · the board (→ twin → back) · the RIEMANN label (→ the volume) · the author (walks to his corner) · the file (desk → hand → box 3) · the window (→ C0 → window) · the gold card.
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import { b1Take } from '../lib/b1_extra.mjs';
export default async (T, R) => {
  const take = await b1Take(T);
  return [{ t: R.a, draw: take.draw, print: F.PRINT67 }, { t: R.b - S.SEAM_HALF, draw: (ctx, t) => S.plateReferee(ctx, t, T), print: F.PRINT67 }];
};
