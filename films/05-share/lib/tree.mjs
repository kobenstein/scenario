// The tree that grows, doubles on a signal and carries fruit that splits, owner C7 (4.18, 5.04, 5.05); also used by C8 (6.02). PLACEHOLDER.
// tree(ctx, x, y, s, t, { grow = 0..1, doubleAt = null (film time when it doubles), fruit = 0..1, split = 0..1 (fruits split into equal parts), seed = 5,
//   light = '#ffb35c' })   x, y = root point on the ground, s = 1 → about 600 px tall when grown   → { fruits: [{ x, y, r }] }
import { phBox } from './shared_ph.mjs';
export function tree(ctx, x, y, s, t, { grow = 1, doubleAt = null, fruit = 0 } = {}) {
  const k = (doubleAt != null && t > doubleAt ? 2 : 1), hh = 600 * s * grow * (k === 2 ? 1.3 : 1);
  phBox(ctx, x - 20 * s, y - hh, 40 * s, hh, 'tree trunk', '#4a3426'); phBox(ctx, x - 260 * s * k * grow, y - hh - 120 * s, 520 * s * k * grow, 260 * s, 'tree crown', '#8fd27a', .7);
  const fruits = []; for (let i = 0; i < Math.round(6 * fruit * k); i++) fruits.push({ x: x + (i - 3) * 70 * s, y: y - hh, r: 18 * s });
  return { fruits };
}
