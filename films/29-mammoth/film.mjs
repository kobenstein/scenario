// Film 29 "AI Is Bringing Back the Mammoth" (~10:09 narration + quiet walk + 15 s end screen), built on the Film 10/13/16/55
// editorial-night machinery. ONE world: THE FENCE (lib/f29_seams.mjs): a snowy night tundra, a wooden fence, you (the yellow coat) and a
// child holding hands at it; behind it the field station (one amber window = the lab) and, at the anchors, the animal behind the fence.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots29.py) · kit: lib/f29_kit.mjs · world + seams: lib/f29_seams.mjs · builders: docs/BRIEF-builders.md.
// Sixteen chunk files scenes/sc01.mjs … sc16.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT29)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the sound agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from the newest vo-vN.txt; a warning is printed). ROOT = $F29ROOT or /mnt/project-files/scenario/film-mammut/.
// ANCHORS ARE PHRASES ONLY (the fact-checked vo-v3 changes words, not these openers). If one goes missing, T.G throws with the phrase.
// NO QR overlay (rule 16.11.2026).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook · the poster mammoth over the tundra (thumbnail) · down to the fence, the child\'s hand in yours · the mammoth behind the fence lifts its head · it breaks into points: 1,400,000 differences · the snow glitters: WHICH ONES? · the comb from the hut · the woolly mouse in the window · the elephant · today\'s animals → plateFence', from: 'Artificial intelligence is bringing' },
  { id: 'c02', name: 'The mice belong: the woolly mouse, seven genes, the machine read and picked', from: 'The mice belong' },
  { id: 'c03', name: 'Plenty to read: ~100 mammoth genomes, the comb runs the strands', from: 'And it has plenty to read' },
  { id: 'c04', name: 'Still far too many: 1,600 → 150+, the tally shrinks', from: 'Still far too many' },
  { id: 'c05', name: 'From seven genes: the mouse list, the C1 quote card (Lamm), the critics', from: 'From seven genes' },
  { id: 'c06', name: 'The dodo is the harder case: no living close relative · → plateDodo', from: 'And the dodo is the harder' },
  { id: 'c07', name: 'The machine turned to the dodo: 70+ skulls, 541 points each, candidates not proof', from: 'Then it turned to the dodo' },
  { id: 'c08', name: 'Subscribe 1 · the machine writes the list, people make the animal · the chicks', from: 'Today, the machine writes' },
  { id: 'c09', name: 'A way to check: the wolves · Q1 IUCN card · Q2 Shapiro card', from: 'There is a way to check' },
  { id: 'c10', name: 'What would stand behind the fence: the cold elephant, the dates · Q3 Lamm card · no embryo yet', from: 'That is what' },
  { id: 'c11', name: "It isn't: Wrangel, the last mammoths · → plateIce", from: "It isn't" },
  { id: 'c12', name: 'An American animal: Willa the ferret, the freezer', from: 'Now take an American animal' },
  { id: 'c13', name: 'Scale that up: the biobank, ~2,300 species', from: 'Now scale that up' },
  { id: 'c14', name: 'Even the mammoth depends: the elephant vaccine, the Red List, the vote (1)', from: 'Even the mammoth depends' },
  { id: 'c15', name: 'What the evidence says: the list, the animal, the vote', from: 'So here is what the evidence' },
  { id: 'c16', name: 'The fence once more · the core sentence · subscribe 2 · quiet walk · 15 s end screen', from: 'So stand at that fence once more' },
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
