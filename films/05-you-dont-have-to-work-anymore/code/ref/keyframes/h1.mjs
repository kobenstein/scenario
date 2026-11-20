// H1 · §2 the labelled Maslow hill, base lit ("Nobody on your street is one bad month from losing their home.")
import { canvas, finish, save } from './lib.mjs';
import { world } from './hworld.mjs';
import { hillLabels } from './hlabels.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas(); const lit = [1, 0, 0, 0, 0];
  const G = world(ctx, cv, t, lit);
  hillLabels(ctx, G, lit, { x: 1440, titleY: 92 });
  finish(ctx, t, { grain: .05, vig: .55 });
  save(cv, out);
}
if (process.argv[1].endsWith('h1.mjs')) frame(0, process.argv[2] || 'h1.png');
