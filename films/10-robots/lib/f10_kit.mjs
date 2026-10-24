// Film 10 "Superintelligence Is Getting a Body" · THE shared kit (MOTION.md §9). Builders import from here only.
//   f10_core.mjs   PAL, SKINS, easing (expoOut, expoIn, qio, sineS, span), tod(t) + light(h) (the ONLY light), view3 (safeView clipping),
//                  sprite, camEase, withDrift, trace / trace3 (die Spur), traceWrite (text by the trace), footage + clipSlot + lowerThird,
//                  HAND (chunk handoffs)
//   f10_valley.mjs VAL (the map in metres), hgt, valley() (sky, sun, ridges, far hill/mine, slope, fields, river, roads, start line,
//                  barriers, bunting, signpost, trees, house + garden + shed, workshops, vineyard + farms + CUMA shed, datacenter, tower,
//                  mist, ridge shadow), building(), tree(), signpost(), mist()
//   f10_figs.mjs   robot() (+ RPOSE), robotHead, robotHand, humanHand, guide (die Führung), person10 (WHO: you, grandma, trainer, grower,
//                  worker, villager; faces, blink, breath), cup, crowdField (die Milliarde)
//   f10_hall.mjs   hall() inside/outside, STATIONS, WINDOWS, clock()
// Call `await prepareKit()` once in your chunk's default export (caches become Images: the napi canvas leaks on drawImage(Canvas)).
export * from './f10_core.mjs';
export * from './f10_valley.mjs';
export * from './f10_figs.mjs';
export * from './f10_hall.mjs';
import { prepareValley } from './f10_valley.mjs';
import { prepareFigs } from './f10_figs.mjs';
export async function prepareKit() { await prepareValley(); await prepareFigs(); }
// the whole world from any camera: inside the hall only the hall, otherwise the valley with the hall in it.
//   o: valley options + hallOpts (passed to hall(): station(i, S) → { lift, robotLift, robotCup, halo, headset, rec }, sign)
import { valley } from './f10_valley.mjs';
import { hall, hallView, hallInside } from './f10_hall.mjs';
export function world(ctx, t, V, L, o = {}) {
  const ho = o.hallOpts || {};
  if (hallInside(hallView(V).cam)) { hall(ctx, t, V, L, ho); return; }
  valley(ctx, t, V, L, { ...o, hallFn: (c, tt, V2, L2) => hall(c, tt, V2, L2, ho) });
}
