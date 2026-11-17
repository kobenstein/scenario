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
// PROVISIONAL chunk table (vo-v3 sections, tools/provisional_timing.py SECS). Phase 2 re-cuts it on vo-v4 together with docs/shots.md.
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film)
  { id: 'c01', name: 'Hook · the foundry at night, your lamp goes off, the machines keep building · nine of ten changes · the forecast moved · 30,000 agents', from: 'You may be using' },
  { id: 'c02', name: 'The ladder appears (5 rungs) · rung 1 CODE · K1 Brin · the fine print: no clear speed-up yet · rung 1 taken', from: 'Picture a ladder' },
  { id: 'c03', name: 'Rung 2 EXPERIMENTS · K2 Altman · the intern, unchecked · rung 2 taken (on the labs\' word)', from: "By Anthropic's own verdict" },
  { id: 'c04', name: 'Rung 3 LEADING RESEARCH · <1 % → 26 % ring · what stays human · shared · which rung? how fast?', from: 'Until this year' },
  { id: 'c05', name: 'Subscribe 1 (the mission)', from: 'This channel exists' },
  { id: 'c06', name: 'How fast? · the evaluators · speed gauge 1.9× · the numbers come from the labs · 6× spend for 2× speed', from: 'How fast?' },
  { id: 'c07', name: 'AI 2027 · Kokotajlo end 2028 → May 2027 · median band · T1a/T1b Tao Lin · the record · the condition', from: "They're the people behind" },
  { id: 'c08', name: 'The scenario: one committee, 6 to 4 · two endings · rung 4 THE GOAL · rung 5 THE BRAKE · K3 Pachocki quote card', from: 'Their scenario, late' },
  { id: 'c09', name: 'The monitor eye over 30,000 agents · 50 a week to a person · who checks the lab · the stop agreed in advance', from: 'Right now, the labs hold' },
  { id: 'c10', name: 'The answer on the ladder · the light goes off · the last models designed by human minds · the last rung is ours', from: 'So how close is', nth: 1 },
  { id: 'c11', name: 'Subscribe 2 · 15 s end screen', from: 'This channel exists', nth: 1 },
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
