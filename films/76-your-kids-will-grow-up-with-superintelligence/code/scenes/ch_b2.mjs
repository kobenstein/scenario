// Film 76 · package B2 (builder). Draws keyed by shot id (scenes/plan.mjs, pk 'B2'); see docs/BRIEF-builders.md. Skills first: scenario-motion,
// world-class-motion-design, fluid-motion-design, motion-director-gates, dataviz. Quality reference: scenes/ch_hook.mjs.
// Every shot: draw(ctx, t, S, T) with S = { id, a, b, in, out, tr, seed, pk }; anchor on phrases only (K.phr(T, S, t) → G/U/IN).
import * as K from '../lib/f76_kit.mjs';

export default {
  C2: K.clipShot('C2'),   // ORIGINAL FOOTAGE plate grows out of S.in and back (lower third from K.CLIPS)
};
