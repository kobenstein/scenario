// c14 · Every kitchen table on Earth (VO 06b) · Film 4 v2 · shots.md §4 14.01–14.05 (work in progress)
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c14_util.mjs';
import { warmLand } from '../lib/v2_c14_land.mjs';
import { anchors, take } from '../lib/v2_c14_take.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c14', T);
  const A = anchors(T, HI, HO);
  warmLand(); await ready();
  const draw = (ctx, t) => take(ctx, t, A);
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw },
  ];
};
