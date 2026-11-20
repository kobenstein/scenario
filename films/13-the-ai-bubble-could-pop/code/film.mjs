// Film 13 "The AI Bubble Could Pop. Superintelligence Won't Stop." (~10:15 VO + ≤15 s end image), built on the Film 10/13
// editorial-night machinery. Style: stil/STIL-editorial-nacht.md · plan: docs/MOTION.md + docs/shots.md (source: tools/shots_bubble.py).
// Twelve chunk files scenes/sc01.mjs … sc12.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs), R = { a, b, id, name, first } chunk range
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: lib/kit.mjs timingFile() = $TIMING · <ROOT>audio/timing.json (real VO, once built) · audio/timing-provisional.json (repo).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT, timingFile } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';

export { ROOT };
// chunk table (docs/shots.md §2). from = candidate start phrases, searched in the WHOLE film after the previous chunk's start
// (robust to a re-split of the VO segments); the last candidate may be a bare segment id as a fallback.
export const CHUNKS = [
  { id: 'c01', name: 'Hook: the bubble over the data center, Altman, the machines speed up, it happened before, A1 rail, who gets to ride', from: [] },
  { id: 'c02', name: 'The mania: the Brontë sisters, Charlotte\'s letter, the index drops two thirds, Mackay', from: ['In a Yorkshire parsonage', 'three sisters'] },
  { id: 'c03', name: 'A2 the track stays, 6,000 miles, Greenwich time · rails of glass, 5 % lit', from: ["But one thing didn't vanish", 'The track'] },
  { id: 'c04', name: 'Global Crossing, demand kept climbing, the cheap internet reaches you, subscribe, Bezos', from: ['Then the crash', 'Global Crossing went bankrupt'] },
  { id: 'c05', name: 'The honest test: chips vs rails, almost full, what lasts, the verdict', from: ['Maybe', 'But rails last for generations'] },
  { id: 'c06', name: 'The wall: three bricks, METR climbs through, money power debt, cracking at the edges, who paid', from: ["You'll hear that", 'hitting a wall'] },
  { id: 'c07', name: 'Who pays: your power bill, your pension, the sisters then and you now', from: ['Follow the money', 'To you'] },
  { id: 'c08', name: 'The leftovers: fire sale, 1844 the penny train, Ohio conditions', from: ['After a crash', 'the leftovers go cheap'] },
  { id: 'c09', name: 'Open doors (2009, Stockholm), own a piece (Intel), public rails (Apertus, India, Europe)', from: ['Public money can come', 'open doors'] },
  { id: 'c10', name: 'People build rails (co-ops, B4RN), no seat yet, A3 the penny train of artificial intelligence', from: ['And sometimes, people build', 'build the rails themselves'] },
  { id: 'c11', name: 'Nobody gives up, the honest limit, the open questions, Nadella, Perez', from: ['Nobody gives up', 'condition on public help'] },
  { id: 'c12', name: 'The bubble may pop, who gets to ride, A4 the price of a seat, end image', from: ['The bubble may pop', "Superintelligence won't stop"] },
];
const ALL = CHUNKS.map((c) => c.id);

export function chunkRanges(T) {
  const a = [0];
  CHUNKS.forEach((c, i) => {
    if (!i) return;
    const prev = a[i - 1] + .5, hit = c.from.find((ph) => T.hasF(ph, prev));
    if (hit) a.push(T.F(hit, prev));
    else { console.warn(`[film] ${c.id}: none of ${JSON.stringify(c.from)} found after ${prev.toFixed(1)} s; placing it ${'60'} s after ${CHUNKS[i - 1].id}`); a.push(a[i - 1] + 60); }
  });
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: a[i], b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: a[i] }]));
}

export const TIMING = timingFile();
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
  if (T.provisional && !build.warned) { build.warned = true; console.warn(`[film] PROVISIONAL timing (${timingFile}); the real VO timing replaces it automatically`); }
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
