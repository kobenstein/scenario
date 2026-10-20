// Paper napkin, owner C1 (H.10); also used by C6 (3.14–3.17, where it turns into the planSheet). PLACEHOLDER until C1 delivers.
// napkin(ctx, x, y, s, t, { rot = 0, fold = 0..1, lift = 0, marks = { dot, sprout, fruit } (0..1 drawn-on pen signs), words = 0..1
//   (PLANT · GROW · HARVEST under them), light = 'night' | 'dawn' })   x, y = centre, s = 1 → about 360 × 360 px
//   → { mark(i) → { x, y } (screen centre of sign i: 0 dot, 1 sprout, 2 fruit), corners: [[x, y] × 4] }
import { phBox } from './shared_ph.mjs';
export function napkin(ctx, x, y, s, t, { rot = 0, fold = 0, lift = 0, marks = {}, words = 0, light = 'night' } = {}) {
  const w = 360 * s, h = 360 * s;
  ctx.save(); ctx.translate(x, y - lift); ctx.rotate(rot); phBox(ctx, -w / 2, -h / 2, w, h, 'napkin', '#efe4cc'); ctx.restore();
  const c = Math.cos(rot), sn = Math.sin(rot), P = (px, py) => ({ x: x + px * c - py * sn, y: y - lift + px * sn + py * c });
  return { mark: (i) => P((i - 1) * w * .3, -h * .05), corners: [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => { const p = P(a * w / 2, b * h / 2); return [p.x, p.y]; }) };
}
