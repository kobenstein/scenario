// c10 · First, to people (04a from "First, to people" to the end) — work in progress
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c10_kit.mjs';
import { townAnchors, hillTake, townTake } from '../lib/v2_c10_town.mjs';
export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c10', T);
  const K = townAnchors(T);
  await ready();
  const world1 = (ctx, t) => (t < K.cover ? hillTake(ctx, t, K) : townTake(ctx, t, K));
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: world1 },
    { t: K.cover, tr: 'cut', d: .1, draw: world1 },
  ];
};
