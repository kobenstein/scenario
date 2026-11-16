// Film 23 "Your 2037 Has Already Started" (619.9 s incl. the 15.4 s end screen), built on the Film 10/13/16/18 editorial-night machinery.
// Style: stil/STIL-editorial-nacht.md · plan: docs/MOTION.md + docs/shots.md (source: tools/shots23.py) · builders: docs/BRIEF-builders.md.
// Twelve chunk files scenes/sc01.mjs … sc12.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier / seam plate). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (K.PRINT23)
// The HUD (lib/f23_hud.mjs: day-clock + evidence cards) is drawn HERE over every frame (after the chunk, before the finish):
// builders never draw it. film.prepare loads clip frames (ROOT/clips/<K>/f#####.jpg) when they exist.
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the audio agent), else data/provisional_timing.json.
// ROOT = $F23ROOT or /mnt/project-files/scenario/film-erster-tag/2037/.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareHud, hud, prepareClips } from './lib/f23_hud.mjs';
import { PRINT23 } from './lib/f23_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [
  { id: 'c01', name: 'Hook · 2037, a possible Tuesday · 06:15 the message from the clinic · only to payers?', from: 'Your twenty thirty-seven' },
  { id: 'c02', name: '06:15 · the spot against every scan · no bill · the kettle · the argument next door', from: 'You open the scan' },
  { id: 'c03', name: '07:30 · the kid and her tutor: the genius that asks', from: 'Seven-thirty' },
  { id: 'c04', name: '09:00 · breakthroughs like weather · the night shift · outside testers', from: "Nine o'clock" },
  { id: 'c05', name: '12:00 · the agent that belongs to you', from: 'Noon' },
  { id: 'c06', name: '16:00 · Dad on the balcony · the same earbuds for everyone · subscribe line 1', from: "Four o'clock" },
  { id: 'c07', name: '19:00 · dinner: the pea, the homework question, the fork · K1', from: "Seven o'clock" },
  { id: 'c08', name: 'Dinner II · the other way · one in five · test before you trust', from: 'When you were a baby' },
  { id: 'c09', name: "Dinner III · the agent's loyalty · K3 · the keys", from: 'And today you say' },
  { id: 'c10', name: 'Dinner IV · luxury or library · the tutor that asks · K4', from: "And Grandpa's earbuds" },
  { id: 'c11', name: 'Dinner V · the grown-ups practiced · millions · the notebook', from: 'And the grown-ups practiced' },
  { id: 'c12', name: '22:30 · the call with Dad · the city sleeps · the year rolls back · subscribe line 2 · end screen', from: 'Ten-thirty' },
];
const ALL = CHUNKS.map((c) => c.id);

export function chunkRanges(T) {
  const a = []; CHUNKS.forEach((c, i) => a.push(i ? T.G(c.from, 0, a[i - 1] + .01) : 0));   // each chunk phrase after the previous one
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
  // the HUD over every frame (day-clock, evidence cards, channel mark), then the Editorial-Nacht finish (vignette + grain); stubs get both
  prepareHud(T);
  const finish = (ctx, t, o = {}) => { hud(ctx, t); edFinish(ctx, t, { ...PRINT23, ...o }); };
  const film = new Film(shots, { finish, float: cameraFloat });
  film.prepare = prepareClips;
  film.T = T;
  film.ranges = RANGES;
  film.list = list;
  return film;
}
