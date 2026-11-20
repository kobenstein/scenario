// Film 28 "They're Using AI to Save the World" (~11 min narration + 15 s end screen), built on the Film 10/13/16/24/25 editorial-night machinery.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots28.py) · kit: lib/f28_kit.mjs · seams: lib/f28_seams.mjs · builders: docs/BRIEF-builders.md.
// Fourteen chunk files scenes/sc01.mjs … sc14.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT28)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the audio agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from vo-v5.txt or vo-v4.txt; a warning is printed). ROOT = $F28ROOT or /mnt/project-files/scenario/film-gute-ki/.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f28_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film, for repeated sentences) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook · the tree of lanterns · train / Casey / Nazca teasers · C3a · all real · the laptop + the bead · the aim · thesis · twelve lanterns · No. 12 Te Hiku: the station, 300 hours, ten days', from: 'All over the world' },
  { id: 'c02', name: 'No. 12 cont. · the data-company offer · C1 Peter Lucas Jones · data sovereignty · No. 12 lamp holds', from: 'A global data company' },
  { id: 'c03', name: 'No. 11 Apate: the scam call line · A.I. victims with all the time in the world · it wins by being slow', from: 'That machine was built to listen' },
  { id: 'c04', name: 'No. 10 IdentiFlight: the wind farm, cameras on towers, eagle or not, only the turbines in its path slow down (study caveat)', from: 'Wind turbines make' },
  { id: 'c05', name: 'No. 9 Nazca: aerial photos, tens of thousands of flags, almost all nothing, nearly doubled the figures · it only had to tell people where to look', from: 'The Nazca desert' },
  { id: 'c06', name: 'No. 8 methane: satellites built for fields and forests, the U.N. alerts, Algeria stopped, nine in ten unanswered (lamp half) · seeing isn’t saving', from: 'Methane is invisible' },
  { id: 'c07', name: 'No. 7 Casey Harrell: ALS, sensors, his own voice, C3 · two million words · subscribe 1', from: 'Casey Harrell knows' },
  { id: 'c08', name: 'No. 6 Global Fishing Watch: radar vs the ship radio, three in four dark · risk, not a verdict', from: 'Big ships are supposed' },
  { id: 'c09', name: 'No. 5 tsunami: the ripple, the air push, GPS signals late · NASA switched it on · C4 NASA replay MUTE under the VO · half an hour', from: 'In the open ocean' },
  { id: 'c10', name: 'No. 4 the elephants and the train: heat cameras on towers, the driver brakes · no elephant killed · the smaller animal in the grass', from: "You're driving a train" },
  { id: 'c11', name: 'No. 3 the snake: horse-blood antivenom vs designed proteins · mice · single toxins', from: 'The snake' },
  { id: 'c12', name: 'No. 2 the conspiracy chatbot: C5b David Rand · a fifth, months later · errors corrected · flipped: same tool, opposite aim · the big question', from: 'Everyone knows' },
  { id: 'c13', name: 'No. 1 flash floods: old news reports, Flood Hub, a week ahead, the phone (Maybe on yours) · a forecast isn’t a rescue', from: 'Flash floods are the deadliest' },
  { id: 'c14', name: 'Ending · what they have in common: built for something else · the gallery · it was the aim · the tree in full light · 15 s end screen', from: 'Satellites built to watch fields and forests', nth: 1 },
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
