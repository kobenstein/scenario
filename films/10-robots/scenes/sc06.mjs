// Film 10 · c06 · "Die zweite Rechnung: die Erde" (02c) · 292.42–360.82 s · deep night · ★ 6.15 (sales above, mines below)
// One small planet (lib/f10_c06_planet.mjs). Serious, not horror: calm pictures, no red, light on night.
//
// PLAN (word → picture · hero light · ≤2 moves · carrier)                                                       [EXPL] = explainer
// 292.42 second bill · planet       the rings of the clay cup (top view, from c05) tilt into the latitudes of a small planet; a house
//                                   and a robot rise over its rim. [EXPL] BILL 2 · TO: THE PLANET written by the trace.
// 296.34 looks clean · electric …   down to the planet's top: the porch lamp is the hero, the robot under it; three marks of light:
//                                   ELECTRIC (bolt) · QUIET (wave) · NO EXHAUST (cloud, struck through).
// 301.62 joints · motor             [EXPL] the joints glow; the camera dives into the knee: the cap opens into a motor in section.
// 305.46 magnets · rare earths      [EXPL] the magnet segments glow: RARE-EARTH MAGNETS; a line runs down into the ground.
// 309.22 2–4 kg · about twice       [EXPL] the segments fly out and stack into a bar (2–4 KG, range dotted); the car's bar ~1.4 KG.
// 314.74 thrown away · never back   [EXPL] the bars sink into a bin; an old robot tumbles in; one magnet tries to rise and sinks back.
// 319.38 < 1 % recycled             [EXPL] looking down into the bin: its rim becomes a ring; a hair-thin warm sliver: < 1 %.
// 322.98 battery · few hours        [EXPL] the ring becomes a day (24 ticks), a battery in it; A FEW HOURS (warm arc) drains.
// 326.02 power, every day           [EXPL] a cable; three pulses of light refill it (one per day); then the pulses run to a cold
//        data centres · thinking    data centre that "thinks" (cold breath rising).
// 332.02 a billion of them · mines  [EXPL] pull all the way back: a billion cool lights spread over the planet (~1 BILLION · FORECAST);
//                                   warm pits open on its face.
// 336.58 a hole in the ground       [EXPL] down into one pit: its terraces have the shape of a robot; the bottom lights on "hole".
// 339.54 replaced like phones       the planet turns: on its rim a mountain of old parts rises; you walk in at its foot (scale).
// 345.70 drawer · size of a person  [EXPL] a drawer of phones at your feet; a robot your size beside you (a dotted line, head to head).
// 350.10 remember … a bank          the planet turns on: a cold tower on the horizon. FORECAST · MORGAN STANLEY
// 353.62 ★ sales · mines            [EXPL] above the horizon a dotted line rises to the tower, each tick a robot (SALES); the camera
//                                   sinks through the horizon: the same line mirrored into the ground, each tick a glowing hole (MINES).
// 358.42 silence                    dust; the section closes upward, the sales line is drawn back; the horizon stays. → c07
import * as E from '../lib/f10_editorial.mjs';
import { run } from '../lib/f10_c04_b2.mjs';
import { initPot } from '../lib/f10_c05_pot.mjs';
import { initPlanet, planetWorld } from '../lib/f10_c06_planet.mjs';

export default async function (T, R) {
  E.prepareEditorial();
  initPot(T); initPlanet(T);
  const draw = run([[R.a, (ctx, t) => { planetWorld(ctx, t); }]]);
  return [{ t: R.a, draw, print: { editorial: true } }];
}
