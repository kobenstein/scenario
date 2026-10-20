// c15 · The top (VO 07a) · Film 4 v2 · shots.md §4 15.01–15.13 (work in progress)
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c15_kit.mjs';
import { anchors, take } from '../lib/v2_c15_take.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c15', T);
  const A = anchors(T, HI, HO);
  await ready();
  const draw = (ctx, t) => take(ctx, t, A, HO);
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw },
  ];
};
