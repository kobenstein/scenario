// Film 67 "Meta's AI Chief Says Superintelligence Is Arriving" (thumbnail A: SUPERINTELLIGENCE IS ARRIVING; ~10:15 narration + ~5 s quiet +
// 15 s end screen), built on the editorial-night machinery (films 10 → 66). ONE world: THE NIGHT OF THE HEADLINE (lib/f67_world.mjs).
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots67.py) · kit: lib/f67_kit.mjs · world + seams: lib/f67_world.mjs · builders: docs/BRIEF-builders.md.
// Chunk files scenes/sc01.mjs … sc11.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a planned match).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT67
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json (tools/provisional_timing.py from vo-v2.txt).
// ROOT = $F67ROOT or /mnt/project-files/scenario/film-si-arriving/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames, prepareAssets } from './lib/f67_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook (lead) · thumbnail A: the headline in the sky, you small · the X post header unrolls · ? · your street turns gold · the file leaves the headline · the chalkboard spot · scan → CORRECT · ★ the paper tower 250,000+ · alien mind / homework (X crops) · the balance · the chalk robot wiped · AN ANSWER WE CAN\'T READ · the checklist drives in → plateWang', from: 'Superintelligence is arriving' },
  { id: 'c02', name: 'Who he is: the portrait print out of the post header (ONCE) + name · the lab door sign · no source for the bomb · lazy thinking · the headline as his billboard · C1 · the file in the competitor\'s window · CONVICTION · INTEREST · check the claim itself', from: 'The man is Alexandr Wang' },
  { id: 'c03', name: 'Check 1: real? · note + 17 million lines (the ribbon) · not you · the referee (Lean) · CORRECT card · Lean community, MIT runs · ★ box 1 gold · C2', from: 'First check' },
  { id: 'c04', name: 'Check 2 (the second field, A = A, the rule book) box 2 gold ? · check 3 (Alpöge, light bulb, six weeks, outrageous) box 3 gold · the rival claim · ★ the referee with no reader → plateReferee', from: 'But a referee only rules' },
  { id: 'c05', name: 'Check 4: ALIEN MIND behind box 4 · Tao quote · Radziwiłł · C3 · CORRECT ≠ UNDERSTOOD · your table · ★ box 4 OPEN · Wang is right · a single file (harvest)', from: "That leaves Wang's boldest" },
  { id: 'c06', name: 'Subscribe 1 (windows round the world) · check 5: PROOF under SUPERINTELLIGENCE · Maynard milestone · LeCun + C4 · dead end · ★ box 5 half · the gap is here', from: 'This channel exists' },
  { id: 'c07', name: 'His worry: 1000x (X crop, measuring tape) · ★ handover (X crop, the word detaches) · what would that look like → plateHandover', from: 'And behind that headline' },
  { id: 'c08', name: 'SCENARIO: the town hall, the bridge plan marks itself CORRECT · the paper tower again · ★ the hands go up, yours too · a thousand small yeses', from: 'Not like a coup' },
  { id: 'c09', name: 'Back to today: the open rule book, anyone re-runs · ★ trust moves from the answer to the check · own referee vs built first · the empty referee chair', from: 'But look at what the mathematicians' },
  { id: 'c10', name: 'The ways: default path (X crop) · labs · governments (SHOW YOUR WORK) · open referee (Lean FRO) · results vs understanding (the bridge, ★ nobody under the new one) · four seats · next year (X crop, calendar)', from: 'The labs could' },
  { id: 'c11', name: 'Verdict: the headline again, the checklist big · half cream · ★ box 4 OPEN is about us · AI SOLVED ___ · two questions · you take the referee\'s chair · subscribe 2 · end screen', from: 'Superintelligence is arriving. So' },
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
  film.prepare = async (t) => { await prepareAssets(); return prepareClipFrames(T, t); };   // loads the clip footage frames round t (render.mjs awaits it)
  film.ranges = RANGES;
  film.list = list;
  return film;
}
