// Film 26 "Why Elon Says Saving Money Is Pointless" (~10:45 narration + 15 s end screen), built on the Film 10/13/16/24/25 editorial-night machinery.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots26.py) · kit: lib/f26_kit.mjs · seams: lib/f26_seams.mjs · builders: docs/BRIEF-builders.md.
// Eleven chunk files scenes/sc01.mjs … sc11.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT26)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the audio agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from vo-v4/vo-v3/vo-v2.txt; a warning is printed). ROOT = $F26ROOT or /mnt/project-files/scenario/film-sparen/.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f26_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film, for repeated sentences)
  { id: 'c01', name: 'Hook · the hill (thumbnail A) · your window: a coin a month · older you · the dust drifts to the shop · the balance · WHAT WOULD HAVE TO BE TRUE · three quotes → the test card · ON AIR → C1', from: 'Elon Musk says saving' },
  { id: 'c02', name: 'His argument in the sky field: thinking + labor free → materials + electricity · goods pile up, prices fall · universal high income · the test card written (4 forecast + 1 advice)', from: 'And behind that picture' },
  { id: 'c03', name: 'Line 1 · machines make almost everything: the warehouse street, 1,000,000 robots, offices · +20–30 % · into space · ✓ on its way', from: 'The first line is where' },
  { id: 'c04', name: 'Line 2 · everything gets cheap: TV 1 $ → 2 ¢, hospital 1 $ → 4 $ · what a machine can copy · the care window (a person’s hands) · nursing home = 5 years of checks · ½ · subscribe 1', from: 'Everything gets cheap', nth: 1 },
  { id: 'c05', name: 'Line 3 · someone pays you an income: the mailbox · checks from Washington · C2 Diamandis · who pays → retirement advice · no law, no amount, no budget · bills in Congress', from: 'Someone pays you an income', nth: 1 },
  { id: 'c06', name: 'Printing the money: homes, beds, a nurse’s hours don’t multiply · tax the profits · C4 Acemoglu · ✗ only a promise', from: 'And if the government just prints' },
  { id: 'c07', name: 'Line 4 · it arrives in time: the avenue of years · 10–20 years → 2036 · Congress slow · robotaxi 2019 · C3 Tesla · years late · ✗', from: 'It arrives in time', nth: 1 },
  { id: 'c08', name: 'Line 5 · if he’s wrong, you’re still fine: the hill again · two bets on the balance · 2 in 3 fear running out · optimist and wrong · who carries the risk · ✗', from: "If he's wrong, you're still fine", nth: 1 },
  { id: 'c09', name: 'There is a way: radical change, unrest, prosperity · the old street · 1889 Germany · 1935 America · C5 FDR · a law, not a promise', from: "There is It's been done" },
  { id: 'c10', name: 'Ida May Fuller · check No. 1 · by law until 100 · even this law needs repairs · shrink, not stop · a right, written down · the check in your mailbox', from: 'Then one winter' },
  { id: 'c11', name: 'The five lines: ✓ ½ ✗ ✗ ✗ · advice fails its own test · the bridge is built by the dust · saving is the bridge · subscribe 2 · 15 s end screen', from: 'The five lines, then' },
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
