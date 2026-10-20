// Thousands of paper fragments (handwriting, print, music notes, squared paper), owner C2 (1.06, 1.07a, 1.10a); also used by C10 (6.24). PLACEHOLDER.
// paperSwarm(ctx, t, { x, y, R = 300, u = 0..1 (0 loose whirl → 1 closed outline of a building), kinds = ['hand', 'print', 'notes', 'grid'],
//   n = 1500, seed = 1, light = '#ffb35c', a = 1 })   draws only the swarm (no background).
import { prng, rgba } from '../engine.mjs';
export function paperSwarm(ctx, t, { x = 960, y = 540, R = 300, u = 0, n = 400, seed = 1, a = 1 } = {}) {
  const r = prng(seed); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba('#efe4cc', .8);
  for (let i = 0; i < Math.min(n, 400); i++) { const ang = r() * 6.283 + t * (.4 + r() * .3) * (1 - u), rr = R * (.3 + r() * .7);
    ctx.fillRect(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * .6, 10, 7); }
  ctx.restore();
}
