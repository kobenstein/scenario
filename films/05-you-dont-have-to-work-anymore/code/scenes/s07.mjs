// Chapter 07 · "The top" (VO 07a–07d, without the hill window 7.23–7.24, which scenes/hill.mjs owns).
//
// CARRIER CHAIN (shot → carrier → next shot, type)
//  6.18 heron climbing toward the meadow ridge → zoom into the ridge (b); the heron keeps gliding away in 7.01
//  7.01 night meadow above the cloud sea, ancestors light up along the crest on "everyone" → the path to the crest (b) zoom
//  7.02 the path: a few old footprints that fade on "never", grass closes over it → the slope continues upward (c) tilt up
//  7.03 one figure halfway up looks up, turns back on "shallow" → its long shadow runs down the slope (c) tilt down
//  7.04 millstone from above, a hand pushes the peg round, grain falls; push on "survival" → the rotation continues (c) right
//  7.05 reaper at dusk, the sickle sweeps on "harvest" → the low sun (b) zoom
//  7.06 the sun becomes the sodium street lamp: coins stack on the doorstep on "rent" → the counting hand slides (c) left
//  7.07 6 am ward corridor, the nurse pulls her laces tight on "shift" → pull back: the corridor shrinks into a tiny panel (b) out
//  7.08 three tiny lit panels (harvest, rent, shift) under a vast sky nobody looks at, pull-back on "wonder" → one star (b) zoom
//  7.09 the star becomes a lone lit study window high on a dark tower, a reader → pull back: it becomes one window of a city (b) out
//  7.10 the city: windows ignite outward from it, people in them look up on "everyone" → fast truck (c) right
//  7.11 Lagos rooftop, a cook with a steaming bowl looks up → the steam drifts across (a) fog
//  7.12 Peru, terraces at blue dawn, a farmer leans on his hoe and looks up → the terrace lines run on (c) left
//  7.13 "To you": you on the night meadow path, dandelion clocks in the foreground → push into one seed head (b) zoom
//  7.14 the seed head lets go, seeds drift; on "stop" time ramps into ultra-slow motion → the seeds themselves fly into the grid (a) match
//  G8   4,000 weeks (g3 look): seeds land as weeks, "Eighty years" ticks, amber fills to "now" on "behind" → the "now" week (b) zoom
//  7.18 the "now" light becomes the bedside lamp: Bronnie Ware at a bedside, listening → push closer (b) push
//  7.18b she leans in, listening → the lamp (b) zoom
//  W1/W2 quote cards (K8 language), line by line; card 1 lines exit up (a), card 2 writes in; it breaks into dots → (a) match
//  7.19 the dots fall back into the weeks wall; push into the unlived weeks on "left" → one unlived week (b) zoom
//  7.20 old and young, hand in hand, close; the grip tightens on "say" → pull back (b) out
//  7.21 the two small under the sky, the line on screen with the voice → the letters loosen into points (a) match
//  7.22a the points become stars over the oldest scene: a shepherd by a fire, looking up → fast truck along the horizon (c) right
//  7.22b procession through time on the horizon (shepherd, monk in silence, one kneeling in prayer, child on a roof, sailor),
//        all look up; on "night sky" the camera tilts up into the stars → hill.mjs raises the labelled hill from below (a)
//  [hill window 7.23–7.24]
//  7.25/7.26 hill → tilt up into open night sky (c) up; only the stars drift; ~3 s hold, rose light creeps in at the bottom → ch 08 dawn
import * as A from '../lib/s07_a.mjs';
import * as B from '../lib/s07_b.mjs';

export default async function (T) {
  const S = (seg, p) => T.S(seg, p);
  const shots = [];
  // ---- 07a
  const s01 = A.shot01(T, T.seg('07a').start - 1.2);
  const s02 = A.shot02(T, S('07a', 'Most of them') - .2);
  const s03 = A.shot03(T, S('07a', 'Not because') - .15);
  const s04 = A.shot04(T, S('07a', 'Because survival') - .15);
  const s05 = A.shot05(T, S('07a', 'The harvest') - .12);
  const s06 = A.shot06(T, S('07a', 'The rent') - .1);
  const s07 = A.shot07(T, S('07a', 'The next shift') - .1);
  const s08 = A.shot08(T, S('07a', 'There was simply') - .15, [A.miniOf(s05, S('07a', 'harvest') + .1), A.miniOf(s06, S('07a', 'rent') + .3), A.miniOf(s07, S('07a', 'shift') + .4)]);
  const s09 = A.shot09(T, S('07a', 'Asking what') - .15);
  const s10 = A.shot10(T, S('07a', 'For the first') - .15);
  const s11 = A.shot11(T, S('07a', 'To a cook') - .12);
  const s12 = A.shot12(T, S('07a', 'To a farmer') - .12);
  const s13 = A.shot13(T, S('07a', 'To you') - .12, S('07b', 'So let time') - .2);
  // carriers: the next shot's tr point = the carrier's screen position at the hand-over
  const at = (nx, f) => { const [x, y] = f(nx.t); nx.x = x; nx.y = y; };
  at(s02, s01.carrier);
  at(s06, () => [W2(s05.sun[0]), s05.sun[1]]);
  at(s07, () => [960, 540]);
  s08.x = s08.panel(s08.t)[0]; s08.y = s08.panel(s08.t)[1];
  s09.x = A.STAR08[0]; s09.y = A.STAR08[1] + 0;
  shots.push(s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13);
  // ---- 07b … 07d + the night sky after the hill
  shots.push(...B.shots(T, { s13, s08 }));
  return shots.map(({ t, tr, d, x, y, r, depth, draw }) => ({ t, tr, d, x, y, r, depth, draw }));
}
const W2 = (x) => x;
