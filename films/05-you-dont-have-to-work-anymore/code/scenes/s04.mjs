// Chapter 04 · People (about 3:52–4:51). Built by the s04 builder; the two hill windows belong to scenes/hill.mjs.
//
// CARRIER CHAIN (shot → carrier → next shot, type)
// ── window 1 (T.seg('04a').start − 1 … "First, to people" − 0.5)
//   CLIP S (ch. 03) → the clip frame drops out downward (tr 'up'), in the same move a window across the courtyard lights
//   4.01 courtyard: one amber window in a huge dark wall; pull-back on "frightening"; the window pulses
//        → (b) camera flies into the lit window (zoom at the window)
//   4.02 the window up close: it opens on "actually", a hand sets a second plate on the sill on "invitation";
//        the camera tilts down onto the plate, it rounds into a disc on indigo → (b) match: the plate is the sundial of G4
//   4.03–4.07 G4 free-time curve: the sundial's shadow sweeps and lays down the x-axis ("time"); the walker climbs out of
//        the plate with the rising curve ("helps"), the curve dips ("hurt"), "alone, nothing in particular" + a lone
//        sitter on the dip ("alone"), a warm dotted line that does not dip ("which tells you"), the walker steps onto it
//        ("where") and off its end onto a string of lights between two houses → (a) hill builder: push-in on the hill
// ── window 2 ("Time for the ones" − 0.4 … "Now there's time" − 0.5)
//   hill push-in ends in a kitchen window → (match) 4.09 kitchen: mother pours tea on "love"; she turns the teapot,
//        the camera whips right after the gesture → (c) right
//   4.10 garden: lands from the whip; father in a garden chair, you on the grass peel an apple, hand him a slice on
//        "lived"; the camera glides until the low sun sits at (960, 470) → (b) zoom into the sun
//   4.11 the same sun at the end of a narrow street: long table, time-lapse dusk → night, the clock passes nine on
//        "nine", nobody gets up, a refill → (c) the camera tilts up the facade (tr 'up')
//   4.12 courtyard balconies from below: a neighbour calls down and waves on "name", you wave back; her pigeon takes off
//        → (a) the bird flies across the cut and lands on the harbour wall (match)
//   4.13 harbour wall, two old friends with cherries, the sun arcs on "afternoon"; a cherry stone is flicked
//        → (c) down: the stone drops into the water (tr 'down')
//   4.14a top-down water: the stone's ripple pushes two boats apart ("drifted apart") → (c) up
//   4.14b "Small flats.": a tower block of tiny boxes, one lit window, one person → (c) the camera whips right (tr 'left')
//   4.14c "Long commutes.": a crawl of head/tail lights on an elevated road; a lit lift cabin climbs a tower and the
//        camera pushes until it sits at frame centre → (b) zoom into the lift
//   4.14d "Strangers on the same staircase.": two people in a lift, apart; the doors start to open, warm light
//        → hill builder: the lift opens onto a street, the long table, pull back to the hill
// ── window 3 ("Streets full" − 0.5 … T.seg('05a').start − 1)
//   hill (pulled back) → (b) zoom into a street on the Belonging terrace
//   4.16 a strolling street at night, music from a doorway, a child on shoulders reaches for the lights
//        → (c) the camera rises with the raised hand (tr 'up')
//   the long table from above, string lights swaying close to the lens, one person turns away from the table and
//        drifts to the frame edge → ch. 05 ("But people aren't enough")
// Helpers: lib/s04_util.mjs (fig() = pooled copy of art.person, stip()/putL() work around napi putImageData honouring
// the transform), s04_court/s04_a (window 1), s04_b (kitchen, garden), s04_c (dinner, neighbours, harbour),
// s04_d (montage + lift), s04_e (window 3).
import { drawCourtyard, drawWindowPlate, drawG4, PLATE } from '../lib/s04_a.mjs';
import { drawKitchen, drawGarden, SUN_G } from '../lib/s04_b.mjs';
import { drawDinner, drawNeighbours, drawHarbour } from '../lib/s04_c.mjs';
import { drawBoats, drawFlats, drawCommute, drawLift } from '../lib/s04_d.mjs';
import { drawStroll, drawTableTop } from '../lib/s04_e.mjs';

export default async function (T) {
  const S = (p, n) => T.S('04a', p, n), E = (p, n) => T.E('04a', p, n);
  const seg = T.seg('04a');
  const shots = [];
  // ------------------------------------------------------------------ window 1
  const t0 = seg.start - 1.0;
  const K1 = { tOn: t0 + .15, fright: S('frightening'), pulse: S('frightening') + .9, end: S("It's actually") - .1 };
  const t2 = K1.end;
  const K2 = { start: t2, open: S('actually'), land: S('invitation') + .15, down: E('invitation') - .45, end: S('Researchers looked') - .15 };
  const t3 = K2.end;
  const K3 = { start: t3, time: S('time people'), happy: S('happy'), more: S('More helps'), helps: S('helps'), point: S('point'), after: S('After that'), hurt: S('hurt'), mostly: S('But mostly'), alone: S('alone'), which: S('Which tells'), where: S('where to go') };
  shots.push({ t: t0, tr: 'up', d: 1.0, draw: (ctx, t, s) => drawCourtyard(ctx, t, s, K1) });
  shots.push({ t: t2, tr: 'zoom', x: 960, y: 540, depth: 5, d: .7, draw: (ctx, t, s) => drawWindowPlate(ctx, t, s, K2) });
  shots.push({ t: t3, tr: 'match', d: .35, draw: (ctx, t, s) => drawG4(ctx, t, s, K3) });
  void PLATE;
  // ------------------------------------------------------------------ window 2
  const k0 = S('Time for the ones') - 0.4;
  const g0 = S('Your parents') - .2, d0 = S('Long dinners') - .3;
  shots.push({ t: k0, tr: 'match', d: .5, draw: (ctx, t, s) => drawKitchen(ctx, t, s, { start: k0, love: S('love'), end: g0 }) });
  shots.push({ t: g0, tr: 'left', d: .3, draw: (ctx, t, s) => drawGarden(ctx, t, s, { start: g0, lived: S('lived'), end: d0 }) });
  const n0 = S('Neighbours') - .15;
  shots.push({ t: d0, tr: 'zoom', x: 960, y: 470, depth: 6, d: .6, draw: (ctx, t, s) => drawDinner(ctx, t, s, { start: d0, nine: S('nine'), end: n0 }) });
  const h0 = S('A whole') - .17;
  shots.push({ t: n0, tr: 'up', d: .5, draw: (ctx, t, s) => drawNeighbours(ctx, t, s, { start: n0, name: S('name'), end: h0 }) });
  const m0 = S('For decades') - .33;
  shots.push({ t: h0, tr: 'match', d: .4, draw: (ctx, t, s) => drawHarbour(ctx, t, s, { start: h0, aft: S('afternoon'), end: m0 }) });
  const ms = S('Small') - .13, mc = S('Long commutes') - .11, ml = S('Strangers') - .09, w2end = S("Now there's time") - .5;
  shots.push({ t: m0, tr: 'down', d: .5, draw: (ctx, t, s) => drawBoats(ctx, t, s, { start: m0, apart: S('drifted'), end: ms }) });
  shots.push({ t: ms, tr: 'up', d: .4, draw: (ctx, t, s) => drawFlats(ctx, t, s, { start: ms, end: mc }) });
  shots.push({ t: mc, tr: 'left', d: .35, draw: (ctx, t, s) => drawCommute(ctx, t, s, { start: mc, end: ml }) });
  shots.push({ t: ml, tr: 'zoom', x: 960, y: 540, depth: 5, d: .5, draw: (ctx, t, s) => drawLift(ctx, t, s, { start: ml, open: S('staircase') + .05, end: w2end }) });
  void SUN_G;
  // ------------------------------------------------------------------ window 3
  const w3 = S('Streets full') - .5, tt0 = S('hurry') - .05, w3end = T.seg('05a').start - 1.0;
  shots.push({ t: w3, tr: 'zoom', x: 960, y: 540, depth: 5, d: .6, draw: (ctx, t, s) => drawStroll(ctx, t, s, { start: w3, reach: tt0 - .35, end: tt0 }) });
  shots.push({ t: tt0, tr: 'up', d: .45, draw: (ctx, t, s) => drawTableTop(ctx, t, s, { start: tt0, end: w3end }) });
  return shots;
}
