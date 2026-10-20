// Chunk c07 · The world of have-to (03b "For most of our lives" → "not less") · shots 7.01–7.10 · in: plate c06>c07 (line), out: c07>c08 (paper)
// (work in progress: plan table below is filled in as the takes are built)
import { handsOf } from '../lib/handoff4.mjs';
import { canvas } from '../engine.mjs';
import { ready } from '../lib/v2_c07_kit.mjs';
import { hallTake, hallInit } from '../lib/v2_c07_hall.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c07', T);
  const S = (p, n) => T.S('03b', p, n), E = (p, n) => T.E('03b', p, n);
  const K = { hb: HI.b, ha: HO.a, haveTo: S('have-to'), follow: S('And after twenty') - .05, top: S('tired', 1) - .15, stop: S('ends'), ends: S('ends'), slumpAt: S('slump') };
  K.wideAt = K.haveTo + .2; K.lightUp = K.hb + 2.6; K.arrive = K.top + 1.15;
  hallInit(K);
  { const [, g] = canvas(); for (const t of [K.hb + .5, K.hb + 1.5, K.wideAt, K.follow + 1.5]) { g.save(); hallTake(g, t, K); g.restore(); } await ready(); }
  const print = HI.print;
  return [
    { t: HI.b, tr: 'cut', d: .1, print, draw: (ctx, t) => hallTake(ctx, t, K) },
  ];
};
