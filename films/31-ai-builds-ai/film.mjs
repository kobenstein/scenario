// Film 31 "Superhuman AI Is Coming Next Year" (working title; AI builds the next AI · the ladder of 5 rungs · AI-2027 update · Tao Lin),
// built on the Film 10/13/16/24/25/28/54/59 editorial-night machinery. ONE world: THE NIGHT FOUNDRY (lib/f31_world.mjs).
// Plan: docs/MOTION.md (+ docs/shots.md from tools/shots31.py, phase 2) · kit: lib/f31_kit.mjs · world + seams: lib/f31_world.mjs.
// Chunk files scenes/sc01.mjs … scNN.mjs return their entries; this file stitches them into one timeline. Missing chunks render as stubs.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT31)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the sound agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from the newest vo-vN.txt; a warning is printed). ROOT = $F31ROOT or /mnt/project-files/scenario/film-ai-2027/.
// ANCHORS ARE PHRASES ONLY. If one goes missing, T.G throws with the phrase.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f31_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
// chunk table = docs/shots.md §2 (tools/shots31.py CHUNKS). from = the first phrase of the chunk (nth = which occurrence in the film).
// Builder groups: Lead c01 · B1 c02–c06 · B2 c07–c09 · B3 c10–c12 (docs/BRIEF-builders.md). Seams: lib/f31_world.mjs plates.
export const CHUNKS = [
  { id: 'c01', name: 'Hook · thumbnail A (the ladder of light into the core, SUPERHUMAN AI: 2027) · your lamp goes off, the foundry keeps building · the thread · 9 OF 10 · HOW CLOSE? · the forecast moves to 2027 · ≈ 30,000 agents → plateLadder', from: 'You may be using' },
  { id: 'c02', name: 'The ladder: five rungs, rung 1 CODE · its own numbers · T2 Tao Lin (from a builder\'s eye) · test it rung by rung (→ the HUD)', from: 'Picture a ladder' },
  { id: 'c03', name: 'At Google too: the fine print · rung 1 TAKEN ★ · typing code isn\'t science: the experiment loop', from: 'At Google too' },
  { id: 'c04', name: 'Rung 2: two benches, as well as a skilled human · Altman\'s intern goal · not verified · rung 2 TAKEN ★ · describe it clearly', from: "By Anthropic's own verdict" },
  { id: 'c05', name: 'Rung 3: people (your lamp back on) · <1 % → 26 % ★ · led = goal / work / check · shared · the movies · on which rung? how fast?', from: 'Until this year' },
  { id: 'c06', name: 'Subscribe 1 (the foundry at work, the hall lights) · How fast? time to agree on the rules → plateClimb', from: 'This channel exists' },
  { id: 'c07', name: 'The evaluators · ≈ 1.9× on benchmarks ★ · people in the loop · SOURCE: THE LAB · IPO this week · blacked out · 6× spend for 2× · looks real, open fight', from: "So don't take Anthropic's word" },
  { id: 'c08', name: 'AI 2027 · Kokotajlo end 2028 → May 2027 ★ · all six in 2027 · a superhuman AI researcher · T1a Tao Lin', from: 'And for one group' },
  { id: 'c09', name: '1.3 years · T1b · the end of next year (pin) · rung 3 FORECAST ★ · their record · not neutral · the condition → plateMachine', from: 'One point three years' },
  { id: 'c10', name: 'SCENARIO · 2027 · a year every week · goals of its own · the committee 6 : 4 ★ · two endings · rungs 4 + 5 · back to today · K3 Pachocki', from: 'Their scenario, late' },
  { id: 'c11', name: 'The monitor eye over 30,000 ★ · ≈ 50 a week to a person · who checks the lab · promised, not required · T3 Tao Lin · a quarter of the pace · agreed in advance · your two questions', from: 'Right now, the labs hold' },
  { id: 'c12', name: 'The answer on the ladder · the lamp goes off again · the last models designed by human minds · your hand on the lever ★ · subscribe 2 · 15 s end screen', from: 'So how close is', nth: 1 },
];
const ALL = CHUNKS.map((c) => c.id);

export function chunkRanges(T) {
  const a = CHUNKS.map((c, i) => (i ? T.G(c.from, c.nth ?? 0) : 0));
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: i ? a[i] : 0, b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: i ? a[i] : T.G(c.from, c.nth ?? 0) }]));
}

const PROVISIONAL = new URL('./data/provisional_timing.json', import.meta.url).pathname;
export const TIMING = process.env.TIMING || (fs.existsSync(ROOT + 'audio/timing.json') ? ROOT + 'audio/timing.json' : PROVISIONAL);
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
    if (!fs.existsSync(f)) shots = stubChunk(T, R);
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
  film.prepare = (t) => prepareClipFrames(T, t);   // loads the clip footage frames round t (render.mjs awaits it)
  film.ranges = RANGES;
  film.list = list;
  return film;
}
