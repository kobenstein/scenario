// Film 49 "You Have Five Years Before Superintelligence" (thumbnail B: 5 YEARS TO GET READY FOR AI; 573 s narration + a quiet walk + 15 s end
// screen = 592.3 s), built on the Film 10/13/16/54/59/66 editorial-night machinery. ONE world: THE STAIRS OF FIVE YEARS (lib/f49_world.mjs).
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots49.py) · kit: lib/f49_kit.mjs · world + seams: lib/f49_world.mjs ·
// builders: docs/BRIEF-builders.md.
// Twelve chunk files scenes/sc01.mjs … sc12.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT49)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the sound step), else data/provisional_timing.json
// (tools/provisional_timing.py, from the newest vo-vN.txt; a warning is printed). ROOT = $F49ROOT or /mnt/project-files/scenario/film-vorbereiten/.
// ANCHORS ARE PHRASES ONLY. If one goes missing, T.G throws with the phrase.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f49_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook (lead) · thumbnail B · the door pulses · pull back: the old stair (HANDS · MUSCLES · MEMORY) · the thinking window, "Until now" ★ the sweep · generations · you alone at the foot · how do you get ready · 2027? · A WARNING · date cards · not your computer → plateFoot', from: 'You have five years' },
  { id: 'c02', name: 'The wedding (the string lights light) · the place card loses its answer · Harari · C13 · the end of lifetime careers · DECADES ★ · start the countdown: 5 4 3 2 1 on the risers, the counter builds', from: 'Picture a wedding' },
  { id: 'c03', name: 'Step 5 · YOU: the near-empty stage · reinvent at fifty · founders 45 ★ · chosen or forced: two doors · −28 % pay', from: 'Five years to go' },
  { id: 'c04', name: 'Fresh start: the child on the old stair, you step through the door ★ (first gold stroke on the place card) · beginner, new role, the choir · resilience · 1 MIN → the second step lights', from: 'What the next generation always had' },
  { id: 'c05', name: 'Step 4 · WORK: the office stage · expert-rated vs novice bars ★ · one coding tool · 34 weeks · learn on the job → plateWork', from: 'Four years to go' },
  { id: 'c06', name: 'The statement (signatures roll) · C5 Brynjolfsson · subscribe 1: the crowd climbs ★ · you turn: a half-open door, a blue glow', from: 'But you can only do so much' },
  { id: 'c07', name: 'Step 3 · FAMILY: the home stage, the screen under the blanket · 77 % · SB 243 "I am not a human." ★ · C16 Harari · the child from the old stair · the plug · ask instead', from: 'Three years to go' },
  { id: 'c08', name: 'Bridge: the light at the top looks closer · Step 2 · THE MACHINE: the living room · the year rail 2032 / 2047, LESS THAN ONE GENERATION ★ · signposts → plateMachine', from: 'But if a machine can already act' },
  { id: 'c09', name: 'Pew bars 35 % / 23 % · the fear before the experience · one afternoon with the tablet ★ · SOON! / NOT IN OUR LIFETIME · the blank law → the top step lights', from: 'That is what the experts know' },
  { id: 'c10', name: 'Step 1 · YOUR SAY: the town square · 41 ballots, 40 tip ★ · who gets what the machines earn · two papers on a table · the bill · C2 Sanders · Trump card · the voting booth: WHO GETS A SHARE?', from: 'One year to go' },
  { id: 'c11', name: 'Dawn (thumbnail A, once) ★ · 91 % / 39 % · discoveries along the stairs · suppose it all works · you step onto the landing', from: 'And there may be a great deal' },
  { id: 'c12', name: 'The wedding again on the landing · the blank place card ★ · the child slides a pen · both stairs · WARNING · WORK · WONDER · subscribe 2 · END_CAM end screen', from: 'Five years from now' },
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
