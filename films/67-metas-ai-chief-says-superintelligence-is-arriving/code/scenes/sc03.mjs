// c03 · Check 1 · builder B1 · 'First check' → 'But a referee only rules'. Part of B1's ONE take (lib/b1_extra.mjs); the seams to c02 and
// c04 are the same take function (identical frames).
//
// | ID    | anchor (phrase)               | picture (one idea)                                                                         | camera              |
// |-------|-------------------------------|--------------------------------------------------------------------------------------------|---------------------|
// | 2.01  | First check                   | the checklist big in the centre: CHECK 1 OF 5 · IS HIS EVIDENCE REAL?; you small below      | creep · EXPL        |
// | 2.02  | What was published            | four pages flutter out of the file; the file unrolls into THE RIBBON (≈ 17 MILLION LINES); you and the author walk to it | pull back right · MIX |
// | 2.03  | No human reads that           | you leaf through the ribbon and give up; the author next to you too                         | close · SCENE       |
// | 2.04  | It was written for a referee  | a light runs along the ribbon to THE REFEREE (LEAN · PROOF CHECKER); bubbles and a medal bounce off him | glide right · MIX |
// | 2.05  | The referee's ruling          | he raises the gold card CORRECT                                                             | push in · MIX       |
// | 2.06  | Within a day                  | veil; card: the community at laptops, lights go gold one by one; card: MIT re-check, 12 lamps, most gold, a few cream | creep · EXPL |
// | 2.07★ | First box: gold               | the checklist big: box 1 fills gold; CLAY PRIZE · NOT AWARDED                              | creep · EXPL        |
// | 2.08  | And if it keeps holding       | the camera flies to the ribbon; the C2 plate grows out of it                               | push in · SCENE     |
// | 2.09  | slot C2                       | C2 James Maynard (New Scientist); the plate goes back into the ribbon                      | hold · CLIP         |
// carriers: the checklist · the file (→ pages, → ribbon) · the scan light · the gold card · the cards rise from the veil · the ribbon (→ plate → ribbon).
import * as F from '../lib/f67_kit.mjs';
import { b1Take } from '../lib/b1_extra.mjs';
export default async (T, R) => { const take = await b1Take(T); return [{ t: R.a, draw: take.draw, print: F.PRINT67 }]; };
