// Film 10 "Superintelligence Is Getting a Body" (10:55 incl. the ~21 s end image) in the Film 5/6/7/11 machinery.
// ONE world for the whole film: the valley on one day (lib/f10_kit.mjs, bild/MOTION.md). Twelve chunk files scenes/sc01.mjs … sc12.mjs
// return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take, a clip slot,
// or the planned match cut). Any other tr is turned into 'cut' with a warning.
// Chunk boundaries are plan sequences (MOTION.md §10): both chunks draw the same frame at R.b, using the shared camera in kit HAND.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs), R = { a, b, id, name, first } chunk range
//   entry = { t, draw(ctx, t, s), tr, d, print, sound, clip }   clip: true marks footage (calm.py reports its cuts apart)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { filmFinish } from './lib/print.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareFootage, gradeAt, gradeLUT, takeHeroes } from './lib/f10_core.mjs';

export { ROOT };
// chunk table (/mnt/project-files/scenario/film-roboter/bild/shots.md §2); from = [segment, first phrase of the chunk]
export const CHUNKS = [
  { id: 'c01', name: 'Hook (race), a billion, road map, the hall opens', from: [['00a']] },
  { id: 'c02', name: '40 halls, joint arcs, Neo, quote, living room as hall, not yet, textbook', from: [['01a', 'China has announced']] },
  { id: 'c03', name: 'Show or real? price, companies, countries, workers, forecast, we still get a say', from: [['01b']] },
  { id: 'c04', name: 'Good news?, grandmother, housework, things/people, time, first bill, hall', from: [['02a']] },
  { id: 'c05', name: 'Your job, robot comes home, data, nine in ten, power, the hands question', from: [['02b', 'Now imagine']] },
  { id: 'c06', name: 'Second bill: the earth (magnets, recycling, battery, mine, scrap, bank)', from: [['02c']] },
  { id: 'c07', name: 'Robots for whom?, vineyard, CUMA, Freeman', from: [['03a']] },
  { id: 'c08', name: 'Hall as co-op, the trace flows back, dream?, Karya', from: [['03b', 'So picture the training']] },
  { id: 'c09', name: 'Mondragon, Fagor, untested, vote on time, fewer robots', from: [['03c', 'Keeping people']] },
  { id: 'c10', name: 'Repair, magnets back, Niron, not free, how many, house rules, Neo', from: [['03d', 'Built to be repaired']] },
  { id: 'c11', name: 'Open hands (SO-101), three questions, who decides, you are a teacher', from: [['03e', 'And the hands themselves']] },
  { id: 'c12', name: 'The right ones, waking up, grandmother, letting go, field of hands and trees, end screen', from: [['04a', 'So do we want']] },
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
    return { a: i ? e.t : 0, b: nx ? nx.t : end, draw: e.draw, sec: e.sec, sound: e.sound, print: e.print, clip: !!e.clip, out: { kind: 'cut' }, _start: e.t };
  });
  // Film 10 finish: the indigo grade (one night, MOTION.md §4) + the print look of Films 5–11 + a deeper vignette (Stauffer)
  // print: { editorial: true } → the Editorial-Nacht finish (lib/f10_editorial.mjs: vignette + precomputed grain, no indigo LUT)
  const finish = (ctx, t, o = {}) => { if (o.editorial) { edFinish(ctx, t, o); return; } const heroes = takeHeroes(); filmFinish(ctx, t, { vig: .3, grade: o.off || o.grade === false ? null : gradeLUT(gradeAt(t).dawn), heroes, ...o }); };
  const film = new Film(shots, { grainAmt: .045, finish, float: cameraFloat });
  film.T = T;
  film.ranges = RANGES;
  film.prepare = (t) => prepareFootage(t);
  film.list = list;
  return film;
}
