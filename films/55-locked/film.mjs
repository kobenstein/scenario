// Film 55 "The Best AI Is Locked Away" (~10:18 narration + ~8 s quiet walk + 15 s end screen), built on the Film 10/13/16/24/25/28/54
// editorial-night machinery. ONE world: THE LINE (lib/f55_seams.mjs): a colossal closed door in an endless night wall, gold light in its
// gap, a line of people on five floor marks (the lab · government · big companies · defenders · you), everyone else to the horizon.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots55.py) · kit: lib/f55_kit.mjs · world + seams: lib/f55_seams.mjs · builders: docs/BRIEF-builders.md.
// Sixteen chunk files scenes/sc01.mjs … sc16.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT55)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the sound agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from the newest vo-vN.txt; a warning is printed). ROOT = $F55ROOT or /mnt/project-files/scenario/film-geheim-ki/.
// ANCHORS ARE PHRASES ONLY (the fact-checked vo-v3 changes words, not these openers). If one goes missing, T.G throws with the phrase.
// NO QR overlay (rule 16.11.2026).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film, for repeated sentences) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook · thumbnail A (the door, the line, you far back) · your phone → the kitchen, the answer in seconds · back out: the phone is a point at the end of the line · the 27-year flaw in the code wall · HOW MUCH STRONGER? · the proof tape out of the gap: NOT SUMS. PROOFS. · the marks light 1…5: YOU\'RE FIFTH', from: 'The best' },
  { id: 'c02', name: 'Mark 1: the people who built it · Fermat as the proof tape, every line checked · YEARS → 11 DAYS → 30 HOURS (calendar sheets) · the numbers are its own; the first proof is public · the machine: an internal research model', from: 'At the very front stand' },
  { id: 'c03', name: 'A second door: ASTRA public but paid (a price tag on its core), a bigger shadow behind · A1 quote card (Altman, Dreamforce) · the inspector\'s clipboard: WHO CHECKED IT? SOME, IN PART · the machine stays locked · price tags rise with the light', from: 'A second lab' },
  { id: 'c04', name: 'Two ticks: REAL MATHEMATICS · ONE HELD BACK (source line OPENAI CFO · CNBC, NOV 6, 2026; no card since vo-v4) · ANNOUNCED. NOT AVAILABLE. · the shelf with the empty place BEST', from: 'Still, two things' },
  { id: 'c05', name: 'SAFETY on both doors · the glowing code line again, APR 7 · crash from across the world · MYTHOS over the door, the list at the desk · mark 2: government (30 DAYS · VOLUNTARY) · mark 3: the giants, NOT YOU. NOT YET.', from: 'Ask either lab' },
  { id: 'c06', name: 'Not only safety: the cost (5× launch price) · C1 quote card (Altman, Berman) · a head start and compute behind the door · the line from above → plateFour', from: 'But safety is not all' },
  { id: 'c07', name: 'Mark 4: the defenders through the side door (PROJECT GLASSWING) · one line of code, 5,000,000 test runs, a gold beam stops · 129,000+ VERIFIED · marketing and real: JULY RECORD · found is not yet fixed', from: 'Fourth in line stand' },
  { id: 'c08', name: 'Subscribe 1: the whole line in gold light · mark 5: JUNE 9, the door opens a crack, light on you · Fable = the same machine, in your hand; HACKING · BIOLOGY go to an older core', from: 'This channel exists' },
  { id: 'c09', name: 'The black hole: an old half-written page fills (preprints, not peer-reviewed) · three phones, three days, a short checked tape · the limit built in: the same setting in both cores', from: "And by its maker's account" },
  { id: 'c10', name: 'Behind you: everyone, to the horizon, some hooded · a rival that came close in the lab\'s own hacking test, free to download, about $4,400 · a locked door buys time (a stack of calendar sheets)', from: "But the line doesn't end" },
  { id: 'c11', name: 'The tips at the kitchen table: AUTO-UPDATE on phone, laptop, router, restart · the old router unplugged · that part is in your hands · back to the door: the parcel ASTRA 6.1 rolls up and stops, HELD BACK → plateHeld', from: 'Switch on automatic' },
  { id: 'c12', name: 'The windowless room · C4 quote card (Hobbhahn, Senate) · WHO GETS TO LOOK IN? · three testers through the side door, the lab holds it · the clipboard: WHO CHECKED IT? · WHAT\'S NOT SHOWN?', from: 'That call was made inside' },
  { id: 'c13', name: 'The big answer: the tape returns (11 DAYS → 30 HOURS) · the hall of a thousand seats, the same core in each · roughly comparable · dozens of seats, eleven sheets, two months', from: 'So keep asking' },
  { id: 'c14', name: 'The hook\'s question returns · 1 · NEWER: doors behind doors, each a sheet further · 2 · BIGGER: about 10,000 dots (OpenAI says, not confirmed) vs one core in your phone vs a thousand', from: 'So if the machines are already' },
  { id: 'c15', name: 'PERMISSION and POWER · both moving your way: APR → JUNE, the price tag shrinks to a third · a preview of your tools: A FEW MONTHS · ESTIMATE', from: 'So between you and the best' },
  { id: 'c16', name: 'The kitchen again, another season, the core in your phone · the line like frame 0, you one place further forward · the core sentence · subscribe 2 · quiet walk · 15 s end screen', from: 'One evening, a few months' },
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
  film.ranges = RANGES;
  film.list = list;
  return film;
}
