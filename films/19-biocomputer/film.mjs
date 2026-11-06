// Film 19 "Computers Now Run on Human Brain Cells" (~9:40 narration + 15 s end screen), built on the Film 10/13/16/18 editorial-night machinery.
// Style: stil/STIL-editorial-nacht.md · plan: docs/MOTION.md + docs/shots.md (source: tools/shots19.py) · builders: docs/BRIEF-builders.md.
// Eleven chunk files scenes/sc01.mjs … sc11.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT19)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the audio agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from vo-v2.txt; a warning is printed). ROOT = $F19ROOT or /mnt/project-files/scenario/film-biocomputer/.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [
  { id: 'c01', name: 'Hook: the drawer, you, the rack in Singapore, Doom (C1), no hands/eyes/reward, the question, blood, the clock', from: 'Computers now run on' },
  { id: 'c02', name: 'Blood → stem cell → neuron → the chip (wiring up) · electrodes + code · the box · imitation vs original', from: 'In a lab' },
  { id: 'c03', name: 'Pong 2022: sense and move zones · the trick: order or noise', from: 'The answer came' },
  { id: 'c04', name: 'Five minutes, not luck · "want" is too big · Friston, the radio · Kagan (C2) · a lab trick?', from: 'After about five minutes' },
  { id: 'c05', name: 'For sale ($35,000 / $300 a week) · Doom in a week · "doesn\'t know" · why a rack?', from: "It didn't stay in the lab" },
  { id: 'c06', name: 'Twenty watts · data centres +50 % · Melbourne, Singapore, 1,000 · 30 W per box, untested', from: 'It comes down to a number' },
  { id: 'c07', name: 'The match: round 1 learning speed (with a catch) · round 2 teamwork (with a catch)', from: 'Picture it as a match' },
  { id: 'c08', name: 'Round 3 everything else · final score · pairing · is anyone in there?', from: 'Round three' },
  { id: 'c09', name: 'How big: fly < box < bee · ⅓ of a mouse in 120 dishes · 86 billion · no evidence', from: 'First, how big' },
  { id: 'c10', name: 'Seth · embedded ethics (Johns Hopkins) · Smirnova (C3) · what now?', from: 'Still, some researchers' },
  { id: 'c11', name: 'The answer: order and noise · leaner learning · drug tests · three rules · the drawer closes + end screen', from: 'At the start, the question' },
];
const ALL = CHUNKS.map((c) => c.id);

export function chunkRanges(T) {
  const a = CHUNKS.map((c, i) => (i ? T.G(c.from) : 0));
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: i ? a[i] : 0, b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: i ? a[i] : T.G(c.from) }]));
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
