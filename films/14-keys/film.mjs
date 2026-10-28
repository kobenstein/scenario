// Film 14 "Who Holds the Keys to Superintelligence?" (engine copied from Film 13), built on the Film 10
// editorial-night machinery. Style: stil/STIL-editorial-nacht.md · plan: docs/MOTION.md + docs/shots.md (source: tools/shots13.py).
// Fourteen chunk files scenes/sc01.mjs … sc14.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs), R = { a, b, id, name, first } chunk range
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Data root (timing.json): lib/kit.mjs ROOT = $F13ROOT or /mnt/project-files/scenario/film-zeit/ ; TIMING=… overrides the file.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = [segment, first phrase of the chunk]; every chunk starts on a VO segment
export const CHUNKS = [   // Film 14 (docs/shots.md §2); segments from film-kontrolle/audio/segments.json (s00 … s22, quote-card slot Q1)
  { id: 'c01', name: 'Hook I: the key before the data centre, Amodei quote card, key and lock', from: [['s00']] },
  { id: 'c02', name: 'Hook II: into the keyhole, the giant file, copy it, the rhyme glimpse', from: [['s03']] },
  { id: 'c03', name: 'Station 1a: billions of numbers, the vault door, two-party authorization, second signature', from: [['s05']] },
  { id: 'c04', name: 'Station 1b: the egress throttle, the two-person rule (key anchor 2)', from: [['s06']] },
  { id: 'c05', name: 'Station 2: the sleeper (2023 safe / 2024 flaws), training it out, the limit', from: [['s08']] },
  { id: 'c06', name: 'Station 3: the rhyme plan (rabbit / habit / green), the microscope, who checks', from: [['s11']] },
  { id: 'c07', name: 'Station 4: the second key in another hand, test tables, sycophancy, fragile (key anchor 3)', from: [['s14']] },
  { id: 'c08', name: 'Station 5: the glass box (Apertus), vault vs glass', from: [['s17']] },
  { id: 'c09', name: 'Finale: the key ring, Epoch bar, the question, end screen (key anchor 4)', from: [['s19']] },
];
const ALL = CHUNKS.map((c) => c.id);

export function chunkRanges(T) {
  const at = (cands) => {
    for (const [sec, phrase] of cands) {
      if (!phrase) { try { return T.seg(sec).start; } catch { continue; } }
      if (T.has(sec, phrase)) return T.S(sec, phrase);
    }
    console.warn(`[film] chunk anchor ${JSON.stringify(cands)} not found; using the section start`);
    return T.seg(cands[0][0]).start;
  };
  const a = CHUNKS.map((c) => at(c.from));
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: i ? a[i] : 0, b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: a[i] }]));
}

export const TIMING = process.env.TIMING || ROOT + 'audio/timing.json';
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
