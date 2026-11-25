// c12 · B3 · 'Tonight, or tomorrow' → end (station 5, ANCHOR 4/4, subscribe 2, the end screen). Takes in lib/b3_take.mjs.
// | ID   | anchor                        | zeigt wörtlich                                              | layer  | carrier → next                       |
// |------|-------------------------------|-------------------------------------------------------------|--------|--------------------------------------|
// | 5.01 | Tonight, or tomorrow          | the hook evening, push into the phone: the next headline (seed 2) lands | SCENE | the headline           |
// | 5.02 | Same big letters. Same pulse. | the bars thicken, two turn ochre; the node on your chest, the pulse spikes | SCENE | the pulse            |
// | 5.03 | The reflex hasn't changed     | the pulse runs left: the same ochre node lights in the mouse and in the stone head | EXPL | the node        |
// | 5.04 | But this time, you notice it  | a small light of yours comes on above the node: THIS IS FEAR | MIX  | back to the phone                    |
// | 5.05 | You take one breath           | the thumb hangs one breath, the ring on your chest fills; the thumb moves away by itself: YOU DECIDE | MIX | the ring |
// | 5.06 | That is the first clock       | the HUD grows into the big gauges, your ring flies up into it: THE FIRST CLOCK | EXPL | the cog       |
// | 5.07 | The other one takes all of us | many hands under the cog (it ticks), a line to the counter: RULES THAT LEARN | EXPL | the gap          |
// | 5.08★| The gap won't close           | THE GAP narrows to ≈ 45 % (F.CLOCK), a gold flash: SMALL ENOUGH TO STEER | EXPL | THE GAP          |
// | 5.09 | We can't upgrade (W)          | MATCH CUT on THE GAP → ANCHOR 4/4: you with hand axe AND phone, nearer the light, the gap small, never zero; the core lines | ANCHOR | the final picture |
// | A.01 | This channel exists (2nd)     | the same final picture; your ring breathes on 'minds that notice', the HUD cog lights on 'rules'; a SUBSCRIBE tag | ANCHOR | — |
// | E.01 | (end screen)                  | the same take, calm; the lower half free for the tiles      | ANCHOR | —                                    |
import * as F from '../lib/f75_kit.mjs';
import { b3 } from '../lib/b3_take.mjs';
export default async (T, R) => {
  const B = b3(T), PR = F.PRINT75;
  return [{ t: R.a, draw: B.sun3Take, print: PR }, { t: B.cuts.c3, draw: B.endTake, print: PR }];
};
