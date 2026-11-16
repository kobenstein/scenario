// Film 24 "AI Can Now Hear What Animals Feel" (~10 min narration + 15 s end screen), built on the Film 10/13/16/18/19 editorial-night machinery.
// Style: stil/STIL-editorial-nacht.md · plan: docs/MOTION.md + docs/shots.md (source: tools/shots24.py) · builders: docs/BRIEF-builders.md.
// Eleven chunk files scenes/sc01.mjs … sc11.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT24)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the audio agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from vo-v5.txt or vo-v4.txt; a warning is printed). ROOT = $F24ROOT or /mnt/project-files/scenario/film-tiersprache/.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f24_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [
  { id: 'c01', name: 'Hook: two pigs, guess which, the two calls, A.I. 9/10, feelings yes words not yet → the map: California, ESP, 2030', from: 'Scientists are trying' },
  { id: 'c02', name: 'Who: never-heard call → species card · the scroll founder · not your dog · C1 Raskin · $10M · no dictionary', from: 'Their A.I. can already' },
  { id: 'c03', name: 'How: the baby listens · patterns · the mountain of calls · hide and guess · the recorder · patterns first → 2030 strip', from: 'Every baby on Earth' },
  { id: 'c04', name: 'Tour I · Kenya: elephants have names (C2) · ESP hears the chorus', from: 'Further than you might' },
  { id: 'c05', name: 'Tour II · Spain: crows with recorders · Europe: the pigs from the start (feelings)', from: 'Now north, to Spain' },
  { id: 'c06', name: 'Tour III · Caribbean sperm whales (parts) · Bahamas dolphins (C3) · California finches · the empty middle', from: 'In the Caribbean' },
  { id: 'c07', name: 'The wall: toddlers · the unclaimed prize · Alaska humpback (C4) · ESP admits · no translator · subscribe 1', from: 'Why is meaning so hard' },
  { id: 'c08', name: 'What would change? 1970 the whale record → 1982 whaling paused', from: 'But suppose they make it' },
  { id: 'c09', name: 'The pigs again · Germany 9 in 100 · a feeling · imagine · Iceland · the meat paradox · in words?', from: 'Now think back to those pigs' },
  { id: 'c10', name: 'Scenario · Day 1 Kenya (time to go) · do we answer? C5 · Year 1 New Zealand court', from: 'Twenty thirty. Day one' },
  { id: 'c11', name: 'Scenario · Year 10 Iowa barn, your dog · other minds · back to today · A.I. can hear them now · subscribe 2 · end screen', from: 'Year ten' },
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
  film.prepare = (t) => prepareClipFrames(T, t);   // loads the clip footage frames round t (render.mjs awaits it)
  film.ranges = RANGES;
  film.list = list;
  return film;
}
