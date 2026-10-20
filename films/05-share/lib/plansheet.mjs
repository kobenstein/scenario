// The engraved plan sheet with three coupons PLANT · GROW · HARVEST, owner C6 (3.17, 4.01); also used by C7 (5.01) and C8 (6.01). PLACEHOLDER.
// planSheet(ctx, x, y, s, t, { rot = 0, u = 1 (engraving progress), coupons = [0, 0, 0] (0 attached … 1 torn off and gone), hi = null | 0 | 1 | 2
//   (the glowing coupon, the chapter anchor), from = 0..1 (napkin → sheet morph, 3.17) })   x, y = centre, s = 1 → about 900 × 520 px
//   → { coupon(i) → { x, y, w, h, r } (screen centre and size of coupon i) }
import { phBox } from './shared_ph.mjs';
export function planSheet(ctx, x, y, s, t, { rot = 0, u = 1, coupons = [0, 0, 0], hi = null } = {}) {
  const w = 900 * s, h = 520 * s; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); phBox(ctx, -w / 2, -h / 2, w, h, 'planSheet', '#efe4cc');
  ['PLANT', 'GROW', 'HARVEST'].forEach((k, i) => { if ((coupons[i] ?? 0) < 1) phBox(ctx, -w / 2 + 30 * s + i * (w - 60 * s) / 3, h * .1, (w - 80 * s) / 3, h * .3, k, hi === i ? '#ffb35c' : '#c9b48a'); });
  ctx.restore();
  const c = Math.cos(rot), sn = Math.sin(rot);
  return { coupon: (i) => { const px = -w / 2 + 30 * s + i * (w - 60 * s) / 3 + (w - 80 * s) / 6, py = h * .25; return { x: x + px * c - py * sn, y: y + px * sn + py * c, w: (w - 80 * s) / 3, h: h * .3, r: rot }; } };
}
