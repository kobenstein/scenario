// c02 · Who he is · builder B1 · 'The man is Alexandr Wang' → 'First check'. Part of B1's ONE take (c02 → c04, lib/b1_extra.mjs): the
// three chunk files draw the same take function, so the inner seams are identical frames. In: plateWang (±.5 s, WANG_CAM creep continued).
//
// | ID    | anchor (phrase)               | picture (one idea)                                                                         | camera              |
// |-------|-------------------------------|--------------------------------------------------------------------------------------------|---------------------|
// | 1.01  | The man is Alexandr Wang      | the PORTRAIT PRINT (ONCE) rises out of the post header's avatar + nameplate                 | creep · EXPL        |
// | 1.02  | He runs a lab                 | the print sinks back, the post rolls up; glide right to the lab door: SUPERINTELLIGENCE gold| glide right · MIX   |
// | 1.03  | That bomb comparison          | veil; the homework crop + the balance (small); a footnote line SOURCE: — stays empty       | creep · EXPL        |
// | 1.04  | And still, his essay          | the crop rolls back, the "lazy thinking" crop unrolls in its slot, gold highlighter         | creep · EXPL        |
// | 1.05  | But look at who is speaking   | pull back: the headline fills the billboard over his own lab                                | pull back · MIX     |
// | 1.06  | Here he is, months earlier    | push into the lab door; the C1 plate grows out of the door                                  | push in · SCENE     |
// | 1.07  | slot C1                       | C1 Alexandr Wang (Core Memory Podcast); the plate goes back into the door                   | hold · CLIP         |
// | 1.08★ | And yet this proof came       | wide: the gold file glows in the OTHER lab's window; Wang applauds by the fence; CONVICTION · INTEREST in chalk under the billboard | pull back · MIX |
// | 1.09  | So his word is not enough     | the checklist slides to the centre (box 1 pulses); glide left back to the chalkboard        | glide left · EXPL   |
// carriers: the post header (→ portrait → back) · the sign · the crop slot · the billboard · the door (→ plate → door) · the file in the window · the checklist.
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import { b1Take } from '../lib/b1_extra.mjs';
export default async (T, R) => {
  const take = await b1Take(T);
  return [{ t: R.a, draw: (ctx, t) => S.plateWang(ctx, t, T), print: F.PRINT67 }, { t: R.a + S.SEAM_HALF, draw: take.draw, print: F.PRINT67 }];
};
