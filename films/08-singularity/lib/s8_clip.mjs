// Film 8 · 2.01 the Altman clip (C1), full frame, in and out of the horizon light's line. Since Part 2 a thin wrapper over the general
// s8_card.clip (any clip id, line or frame carrier); the C1 numbers below keep the approved minute pixel-identical.
//   drawClip(ctx, t, T, o)   o: { open: [t0, t1] (the line opens), close: [t0, t1] (it closes), yOpen, yClose, cutFrame (frame of the jump cut) }
// The footage (1920×960) covers the frame; a slow push 1.00 → 1.06, and on the jump-cut frame a punch-in to 1.14 that keeps pushing,
// centred on the speaker's face, so the jump reads as an edit, not a glitch. Lower third + ORIGINAL FOOTAGE tag: f6_kit lowerThird.
import { sio } from './s8_kit.mjs';
import { clip } from './s8_card.mjs';

const FACE = [820, 330];   // the speaker's face in the close-up (frame px)
export function drawClip(ctx, t, T, o) {
  return clip(ctx, t, T, 'C1', {
    carrier: 'line', open: o.open, close: o.close, yOpen: o.yOpen, yClose: o.yClose, cuts: [(o.cutFrame - 1) / 30], face: FACE, dx: 119,   // (the podcast's corner logo stays outside the picture)
    zoom: (i, u) => (i ? 1.14 + .11 * u : 1 + .055 * (.8 * u + .2 * sio(u))),
    info: { name: 'Sam Altman', role: 'CEO, OpenAI', source: '', date: '' },
  });
}
