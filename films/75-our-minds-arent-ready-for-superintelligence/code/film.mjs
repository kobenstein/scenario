// Film 75 "Our Minds Aren't Ready for Superintelligence" (thumbnail A: GODLIKE AI JUST ARRIVED; 10:12.8 narration + 19 s tail with the 15 s end screen = 10:31.8, real VO), built on
// the editorial-night machinery (films 10 → 69). NOT one world (Jakob 24.11., REGELN §13): a motion-design film of explainer sequences on
// THE WALL (lib/f75_explain.mjs) + scenes, every picture shows exactly its sentence; the Leitbild (THE SUNRISE, lib/f75_world.mjs) only at
// 4 anchors. Plan: docs/MOTION.md + docs/shots.md (source: tools/shots75.py) · kit: lib/f75_kit.mjs · builders: docs/BRIEF-builders.md.
// Chunk files scenes/sc01.mjs … sc12.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a planned match).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT75
// Timing: $TIMING, else audio/timing.json (the sound step's real VO timing, commit 805c080), else <ROOT>audio/timing.json, else data/provisional_timing.json.
// ROOT = $F75ROOT or /mnt/project-files/scenario/film-75-godlike/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard } from './lib/stub.mjs';
import { stub75 } from './lib/stub75.mjs';
import { prepareClipFrames } from './lib/f75_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', by: 'Lead', name: 'Hook · ANCHOR thumbnail A (the sunrise) · the sphere floods → the disc climbs MORE CAPABLE · BRAIN UPGRADE 0% · the bar becomes your phone · headline BIG / BAD · pulse · thumb · YOU DECIDED NONE OF IT · the pulse runs back through the cave animals into the stone head · the disc runs away: WHAT CAN CATCH UP? · NOT THE MACHINE · ★ THE GAP · counter / flint · two dashed clocks · society pushes the cog · one person, the ring · the ring lands on your chest, the gauges fly into the HUD → plateSofa', from: "Our minds aren't ready" },
  { id: 'c02', by: 'B1', name: 'Reflex 1 FEAR: back to the headline · the alarm older than reading · every mammal · FEAR, BEFORE THOUGHT · bad news pulls: +2.3 % clicks per negative word · Reflex 2 GRAB: someone near you gets ahead · a colleague, a competitor · GRAB IT', from: 'To see what it is' },
  { id: 'c03', by: 'B1', name: 'Companies too: fortunes into AI, "NO CHOICE" · Bengio at the Security Council (C2) · NOT A LAW OF NATURE · A CHOICE · Reflex 3 STRAIGHT LINE: it makes us late · today + a little · it doesn\'t add, ★ IT DOUBLES (METR: roughly every 3.5 months)', from: 'Companies have it too' },
  { id: 'c04', by: 'B1', name: 'The experts missed: olympiad gold 2025 vs forecast 2030 · whose gut is ready · to be fair: we adapt (Högberg) · years vs months · Wilson (K1) · INSTITUTIONS · rules, laws · the seat belt for the brain · how fast do rules move?', from: 'Even the experts missed' },
  { id: 'c05', by: 'B1', name: 'Station 2 RULES: EU AI Act 2021 → 2028 (7+ years vs DOUBLES EVERY FEW MONTHS) · pushed back, standards not ready · too slow? · ozone 1985 → Montreal 1987 · update built in, 6× · heals in the 2070s · ★ the cog is SET → plateClocks', from: "Take Europe's AI law" },
  { id: 'c06', by: 'B2', name: 'Subscribe 1 (M.01) · Station 3: faster than a law? · not out-thinking it · ANCHOR (turn): the clock you are carrying · Harari (books to sell) · C1 · the dollar', from: 'This channel exists' },
  { id: 'c07', by: 'B2', name: 'Developing consciousness: a retreat? · notice what a machine does · try it: where the words come from · UNWATCHED · ★ noticing: FEAR / CRAVING / PULLING · competition: knows you better · noticed = harder to use', from: 'Developing our consciousness' },
  { id: 'c08', by: 'B2', name: 'Meditation: ten seconds · one breath between headline and thumb · the big version: the mind itself · $700+ billion (mostly AI) vs ~$430 million · a wish, not a calculation', from: 'So is meditation the answer' },
  { id: 'c09', by: 'B2', name: 'Not measured: the AI report card with the empty line WHAT IT DOES TO YOU · HumaneBench (an early test, 15 chatbots): ~2/3 harmful · the dollar is for: three · one calm person · faster, rules don\'t → plateRace', from: "And what we don't understand" },
  { id: 'c10', by: 'B3', name: 'Both clocks: the race runs on · the scenario evening: the app with a GRADE · tested before release, every few months · rules within the year · your reflexes by name · far away? take it apart · the grade · Hassabis quarterly tests', from: 'Then you notice more' },
  { id: 'c11', by: 'B3', name: 'UN framework within one year · 3 → 135 leaders · none of it settled (not a treaty, paid by industry, not the course) · ANCHOR (point): a product of choices, so is the gap · labs / governments / voters · one clock needs no vote', from: 'Rules that move within a year' },
  { id: 'c12', by: 'B3', name: 'Station 5: the next headline · same letters, same pulse · THIS IS FEAR · one breath · YOU DECIDE · the first clock · rules that learn · ★ the gap narrows, never zero · ANCHOR (end): WE CAN\'T UPGRADE OUR BRAINS · subscribe 2 · end screen', from: 'Tonight, or tomorrow' },
];
// stubs: until a builder ships scenes/scNN.mjs the chunk renders as stub cards + its seam plates (so the seams hold from day one)
const STUB = { c02: { start: 'plateSofa' }, c05: { end: 'plateClocks' }, c06: { start: 'plateClocks' }, c09: { end: 'plateRace' }, c10: { start: 'plateRace' }, c12: { endScreen: true } };
const ALL = CHUNKS.map((c) => c.id);

export function chunkRanges(T) {
  const a = CHUNKS.map((c, i) => (i ? T.G(c.from, c.nth ?? 0) : 0));
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: i ? a[i] : 0, b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: i ? a[i] : T.G(c.from, c.nth ?? 0) }]));
}

const PROVISIONAL = new URL('./data/provisional_timing.json', import.meta.url).pathname;
const LOCAL = new URL('./audio/timing.json', import.meta.url).pathname;   // the sound step's delivery (commit 805c080): the real VO timing
export const TIMING = process.env.TIMING || [LOCAL, ROOT + 'audio/timing.json'].find((f) => fs.existsSync(f)) || PROVISIONAL;
// the camera never stops: a slow breath over the whole picture (1.0–1.6 % zoom, tiny drift, no roll). The chunk cameras carry the movement.
export function cameraFloat(t) {
  const z = 1.013 + .003 * Math.sin(t * .19 + .7), m = (z - 1) / 2 * .6;
  return { z, x: Math.max(-1, Math.min(1, drift(t * .6, 1, 11))) * W * m, y: Math.max(-1, Math.min(1, drift(t * .6, 1, 23))) * H * m, r: 0 };
}
const WARNED = new Set();
const cutOnly = (e) => {
  if (!e.tr || e.tr === 'cut') return { ...e, tr: 'cut', d: Math.min(e.d ?? .02, .1) };
  const k = `${e.sec}:${e.tr}`; if (!WARNED.has(k)) { WARNED.add(k); console.warn(`[film] ${e.sec}: tr '${e.tr}' is not allowed (no blends, no slides); using 'cut'`); }
  return { ...e, tr: 'cut', d: .02 };
};
export async function build({ timingFile = TIMING } = {}) {
  const T = timing(timingFile);
  if (T.provisional) console.warn(`[film] PROVISIONAL timing (${timingFile}); the real VO timing is <ROOT>audio/timing.json`);
  const RANGES = chunkRanges(T);
  const want = process.env.SECS ? process.env.SECS.split(',').map((s) => (/^\d+$/.test(s) ? 'c' + s.padStart(2, '0') : s)) : ALL;
  let list = [];
  for (const id of want) {
    const R = RANGES[id]; if (!R) { console.warn('[film] unknown chunk', id); continue; }
    const f = new URL(`./scenes/sc${id.slice(1)}.mjs`, import.meta.url);
    let shots;
    if (!fs.existsSync(f)) shots = stub75(T, R, STUB[id]);
    else {
      try { const mod = await import(f.href); shots = await mod.default(T, R); }
      catch (err) { console.error(`[film] chunk ${id} failed: ${err.stack}`); shots = [{ t: R.first - .3, draw: errorCard(id, R, err), tr: 'cut', d: .1 }]; }
    }
    // a chunk owns [R.a, R.b): entries outside are dropped, so neighbours never overlap
    for (const e of shots) if (e.t < R.b - 1e-6) list.push(cutOnly({ ...e, t: Math.max(e.t, R.a), sec: id }));
  }
  list.sort((p, q) => p.t - q.t);
  list = list.filter((e, k) => !(list[k + 1] && Math.abs(list[k + 1].t - e.t) < 1e-6));
  const end = T.duration;
  // a cut lands exactly on the entry time (d is tiny), so a frame at t belongs to the entry that started at or before t
  const shots = list.map((e, i) => {
    const nx = list[i + 1];
    return { a: i ? e.t : 0, b: nx ? nx.t : end, draw: e.draw, sec: e.sec, sound: e.sound, print: e.print, out: { kind: 'cut' }, _start: e.t };
  });
  // Editorial-Nacht finish for every frame: vignette + precomputed grain (lib/f10_editorial.mjs finish); stubs get it too
  const finish = (ctx, t, o = {}) => edFinish(ctx, t, o);
  const film = new Film(shots, { finish, float: cameraFloat });
  film.T = T;
  film.prepare = async (t) => prepareClipFrames(T, t);   // loads the clip footage frames round t (render.mjs awaits it)
  film.ranges = RANGES;
  film.list = list;
  return film;
}
