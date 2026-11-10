// Film 25 "The Last Human Job" (~10 min narration + 15 s end screen), built on the Film 10/13/16/24 editorial-night machinery.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots25.py) · kit: lib/f25_kit.mjs · seams: lib/f25_seams.mjs · builders: docs/BRIEF-builders.md.
// Eleven chunk files scenes/sc01.mjs … sc11.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT25)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the audio agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from vo-v4.txt or vo-v3.txt; a warning is printed). ROOT = $F25ROOT or /mnt/project-files/scenario/film-last-human-job/.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f25_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film, for repeated sentences)
  { id: 'c01', name: 'Hook · the row · one job = a row of tasks · they fall · the desk, not the factory (Stanford) · Jakob: his row, the studio, J1 · he is still here', from: 'There will be a last' },
  { id: 'c02', name: 'Ten kinds of work · the rank rail · No. 10 the first job at the desk: the empty junior desk · K1 Brynjolfsson · seniors kept, juniors not hired · J2 first piece', from: 'Ten kinds of work' },
  { id: 'c03', name: 'No. 9 the voice: Microsoft ranking · the empty booth (not a person) · No. 8 office routine: 9 of 10 could, a fraction did · Challenger cuts · creative safe?', from: 'Number nine' },
  { id: 'c04', name: 'No. 7 creative handwork: the studio, agents take lanes · J3 climb · J3b the edit', from: 'Number seven' },
  { id: 'c05', name: "The puzzle · Hinton 2016 radiologists · record training places · what a radiologist does · tasks, not jobs (the row) · J4 · the core sentence", from: "So here's the puzzle" },
  { id: 'c06', name: 'Subscribe 1 (the lamp passed along the ridge) · how much is left standing · No. 6 agents run the whole workflow · Amodei card · forecast vs measured', from: 'This channel exists for one reason' },
  { id: 'c07', name: 'No. 5 teachers · No. 4 doctors · the row slows (hands) · No. 3 trades: flooded basement vs clean factory · K2 Hinton · until the robots get good', from: 'Number five' },
  { id: 'c08', name: 'No. 2 care: the nurse at night · Microsoft bottom · a person is the point · Jakob J5: one film a day vs two weeks · what is left', from: 'Number two' },
  { id: 'c09', name: 'No. 1 where we want a human (the gold stone) · chess: 30 years beaten, bigger than ever · the last job is the one we won’t hand over', from: "Number one isn't" },
  { id: 'c10', name: 'Act 4 · five things that protect you (judgment, directing, trust, hands + head, learning in steps) · K3 Gates', from: 'So how do you stay' },
  { id: 'c11', name: 'Ending · every time the machine took a step · the step you take next · J6 · subscribe 2 · 15 s end screen', from: 'Every time the machine took a step', nth: 1 },
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
