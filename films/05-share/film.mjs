// Film 05 "The Fortune That Doesn't Exist Yet": one shot per beat, anchored to VO phrases (never to seconds).
// Ten chunk files scenes/sc01.mjs … sc10.mjs (one builder each) return their shots; this file stitches them into one timeline.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs), R = { a, b, id, name } chunk time range
//   entry = { t, draw(ctx, t, s), tr, d, x, y, r, depth, print }
//   t = shot start (film seconds, from T.S(...)), tr/d/x/y describe the transition INTO this shot
//   tr: 'cut'|'dissolve'|'match'|'iris'|'zoom'|'out'|'push'|'left'|'right'|'up'|'down'|'fog'|'flash'|'black'|'page'|'whipL'|'whipR'|'whipU'|'whipD'
// SECS=c03,c04 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// If a chunk throws (e.g. a phrase vanished in a script revision) the film still builds: that chunk becomes a red error card.
import fs from 'node:fs';
import { Film } from './engine.mjs';
import { timing, prepareClips, ROOT } from './lib/kit.mjs';
import { printFinish } from './lib/print.mjs';
import { errorCard } from './lib/stub.mjs';

export { ROOT };
// Chunk table (shots-v0 §4). from = [section, first phrase of the chunk's first shot]; a missing phrase falls back to the section start.
export const CHUNKS = [
  { id: 'c01', name: 'Hook', shots: 'H.01–H.10', from: ['H'] },
  { id: 'c02', name: '§0 Two promises', shots: '0.01–1.01', from: ['0'] },
  { id: 'c03', name: '§1 The fortune', shots: '1.02–1.16', from: ['1', 'Because the largest'] },
  { id: 'c04', name: '§2 Take, print', shots: '2.01–2.16b', from: ['2'] },
  { id: 'c05', name: '§2 end, §3 Alaska', shots: '2.17–3.07c', from: ['2', 'Printing takes nothing'] },
  { id: 'c06', name: '§3 Norway, plan, §4 sow', shots: '3.08–4.05', from: ['3', 'Norway set'] },
  { id: 'c07', name: '§4 Fund, seeds', shots: '4.06–4.18', from: ['4', 'But a share only'] },
  { id: 'c08', name: '§5 Grow', shots: '5.01–5.16b', from: ['5'] },
  { id: 'c09', name: '§6 Harvest', shots: '6.01–6.19', from: ['6'] },
  { id: 'c10', name: '§6 Manila/Ohio, §7', shots: '6.20–7.12', from: ['6', 'A care worker'] },
];
const ALL = CHUNKS.map((c) => c.id);

// absolute chunk ranges for a timing: R.a = first word of the chunk (section start or phrase), R.b = next chunk's R.a (or film end)
export function chunkRanges(T) {
  const at = ([sec, phrase]) => {
    if (phrase && T.has(sec, phrase)) return T.S(sec, phrase);
    if (phrase) console.warn(`[film] chunk anchor "${phrase}" not found in §${sec}; using the section start`);
    return T.seg(sec).start;
  };
  const a = CHUNKS.map((c) => at(c.from));
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: i ? a[i] : 0, b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: a[i] }]));
}

export async function build({ timingFile = ROOT + 'audio/timing.json' } = {}) {
  const T = timing(timingFile);
  const RANGES = chunkRanges(T);
  const want = process.env.SECS ? process.env.SECS.split(',').map((s) => (/^\d+$/.test(s) ? 'c' + s.padStart(2, '0') : s)) : ALL;
  const list = [];
  for (const id of want) {
    const R = RANGES[id]; if (!R) { console.warn('[film] unknown chunk', id); continue; }
    const f = new URL(`./scenes/sc${id.slice(1)}.mjs`, import.meta.url);
    if (!fs.existsSync(f)) continue;
    let shots;
    try { const mod = await import(f.href); shots = await mod.default(T, R); }
    catch (err) { console.error(`[film] chunk ${id} failed: ${err.message}`); shots = [{ t: R.first - .3, draw: errorCard(id, R, err), tr: 'cut', d: .1 }]; }
    for (const e of shots) list.push({ ...e, sec: id });
  }
  list.sort((p, q) => p.t - q.t);
  const end = T.duration;
  const shots = list.map((e, i) => {
    const nx = list[i + 1], d = e.d ?? .9, dn = nx ? (nx.d ?? .9) : 0;
    const a = i ? e.t - d / 2 : (e.t > 0 ? e.t : 0), b = nx ? nx.t + dn / 2 : end;
    return { a: i ? a : 0, b, draw: e.draw, sec: e.sec, sound: e.sound, print: e.print, out: nx ? { kind: nx.tr || 'dissolve', x: nx.x, y: nx.y, r: nx.r, depth: nx.depth } : { kind: 'black' }, _start: e.t };
  });
  for (let i = 1; i < shots.length; i++) shots[i].a = Math.min(shots[i].a, shots[i - 1].b - .01);
  const film = new Film(shots, { grainAmt: .045, finish: printFinish });
  film.T = T;
  film.ranges = RANGES;
  film.prepare = (t) => prepareClips(T, t);
  film.list = list;
  return film;
}
