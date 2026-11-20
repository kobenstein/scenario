// Film 20 "The First Generation That Won't Grow Old" (~10:00 incl. the 15 s end screen), built on the Film 10/13/16/18 editorial-night machinery.
// Style: stil/STIL-editorial-nacht.md · plan: docs/MOTION.md + docs/shots.md (source: tools/shots20.py) · builders: docs/BRIEF-builders.md.
// Eleven chunk files scenes/sc01.mjs … sc11.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT20)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the audio agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from vo-v4.txt or vo-v3.txt; a warning is printed). ROOT = $F20ROOT or /mnt/project-files/scenario/film-altern/.
// Clips: in every clip window (timing.json clips, kind 'clip') the camera float is off, so lib/f20_kit.mjs CLIP_RECT stays exactly in place
// for the real footage that is laid over it later.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [
  { id: 'c01', name: 'Hook: four generations at the table, the first eye, a race · the clock (3 → 1.7 months, 12 = escape velocity, the push)', from: 'You could be part' },
  { id: 'c02', name: 'Riddle 1: why bodies age · the bill · the egg made before your mother was born · ground zero · the reset button', from: 'Aging looks like' },
  { id: 'c03', name: 'Riddle 2: four proteins · held down = tumours · the window · three of four (mouse eyes) · Bonn · a long way · the switchboard', from: 'Twenty years ago' },
  { id: 'c04', name: 'Riddle 3: artificial intelligence at the button · 3,000 mixes · ×2 · CLIP C1 · redesigned proteins · company claims · clocks', from: 'That search is too big' },
  { id: 'c05', name: 'The first eye: one injection · three people · day 56 · two of three · card ER-100 · no control group · the odds · fate → target', from: 'Yes. Earlier this year' },
  { id: 'c06', name: 'The easy start · the liver · CLIP C2 · everything else · four wards on one thread: AGE', from: 'The eye was the easy start' },
  { id: 'c07', name: 'A.I. at the illnesses · card Hassabis · 9 in 10 fail · not enough (85) · the thread stays · CLIP C3 · his verdict · unless · glass ceiling', from: 'Artificial intelligence is coming at' },
  { id: 'c08', name: 'The estimates become a band · who gets there in time · a gene therapy · $4.25M · the price tag', from: "The optimists' estimates" },
  { id: 'c09', name: 'Not a cake · how fast the price falls · insulin for a dollar · card Salk', from: 'Nobody has to lose' },
  { id: 'c10', name: 'Four decisions (pool · flat fee · licence · negotiate) · two ideas still waiting', from: 'Both were decisions' },
  { id: 'c11', name: 'Never yet tried · each one is a decision · your family one more time · end screen', from: 'None of this has ever' },
];
const ALL = CHUNKS.map((c) => c.id);

export function chunkRanges(T) {
  const a = CHUNKS.map((c, i) => (i ? T.G(c.from) : 0));
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: i ? a[i] : 0, b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: i ? a[i] : T.G(c.from) }]));
}

const PROVISIONAL = new URL('./data/provisional_timing.json', import.meta.url).pathname;
export const TIMING = process.env.TIMING || (fs.existsSync(ROOT + 'audio/timing.json') ? ROOT + 'audio/timing.json' : PROVISIONAL);
// the camera never stops: a slow breath over the whole picture (1.0–1.6 % zoom, tiny drift, no roll). The chunk cameras carry the movement.
let CLIPWIN = [];   // [start, end] of the footage clips (set in build); the float eases to zero 0.8 s before each and back after it
export function cameraFloat(t) {
  let k = 1; for (const [a, b] of CLIPWIN) k = Math.min(k, 1 - Math.min(1, Math.max(0, (t - (a - .8)) / .8)) + Math.min(1, Math.max(0, (t - b) / .8)));
  k = Math.max(0, Math.min(1, k)); k = k * k * (3 - 2 * k);
  const z = 1 + k * (.013 + .003 * Math.sin(t * .19 + .7)), m = (z - 1) / 2 * .6;
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
  CLIPWIN = Object.values(T.clips || {}).filter((c) => c.kind === 'clip').map((c) => [c.start, c.end]);
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
  film.ranges = RANGES;
  film.list = list;
  return film;
}
