// The sealed glass fund with a label and the embossed seal "fixed rule", owner C6 (4.07, 4.08); also used by C7 (5.04, 5.05) and C9 (6.17, 6.19). PLACEHOLDER.
// glassFund(ctx, x, y, s, t, { fill = 0..1 (shares inside), seal = 0..1 (the seal pressed), label = 'fund', ghost = 0..1 (dotted: does not exist yet),
//   burin = 0..1 (an engraving tip turns the ghost solid), glow = 0..1, pipes = 0..1 (outlet lines for 6.19) })   x, y = base centre, s = 1 → about 420 × 520 px
//   → { top: { x, y }, out: { x, y } (where the pipes leave) }
import { phBox } from './shared_ph.mjs';
export function glassFund(ctx, x, y, s, t, { fill = .5, seal = 1, label = 'fund', ghost = 0 } = {}) {
  const w = 420 * s, h = 520 * s; phBox(ctx, x - w / 2, y - h, w, h, `glassFund ${label}${ghost > .5 ? ' (ghost)' : ''}`, '#bfe3ea', 1 - ghost * .5);
  phBox(ctx, x - w / 2 + 10, y - h * fill, w - 20, h * fill - 10, 'shares', '#ffb35c', .6);
  return { top: { x, y: y - h }, out: { x: x + w / 2, y: y - h * .2 } };
}
