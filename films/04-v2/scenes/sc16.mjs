// c16 · Four thousand weeks (VO 07b + 07c) · Film 4 v2 · shots.md §4 16.01–16.12 (work in progress)
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c16_kit.mjs';
import { anchors, setup, take } from '../lib/v2_c16_take.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c16', T);
  const A = anchors(T, HI, HO);
  setup(A); await ready();
  const draw = (ctx, t) => take(ctx, t, A, HO, null);
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw },
    { t: A.riv0, tr: 'cut', d: .1, print: HO.print, draw },
  ];
};
