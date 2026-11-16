// Film 05 "The Fortune That Doesn't Exist Yet": one shot per beat, anchored to VO phrases (never to seconds).
// Ten chunk files scenes/sc01.mjs … sc10.mjs (one builder each) return their shots; this file stitches them into one timeline.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs), R = { a, b, id, name } chunk time range
//   entry = { t, draw(ctx, t, s), tr, d, x, y, r, depth, print }
//   t = shot start (film seconds, from T.S(...)), tr/d/x/y describe the transition INTO this shot
//   tr: 'cut'|'dissolve'|'match'|'iris'|'zoom'|'out'|'push'|'left'|'right'|'up'|'down'|'fog'|'flash'|'black'|'page'|'whipL'|'whipR'|'whipU'|'whipD'
// SECS=c03,c04 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// If a chunk throws (e.g. a phrase vanished in a script revision) the film still builds: that chunk becomes a red error card.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, prepareClips, ROOT } from './lib/kit.mjs';
import { filmFinish } from './lib/print.mjs';
import { errorCard } from './lib/stub.mjs';

export { ROOT };
// Chunk table (bild/shots.md v2 §4). from = candidate anchors [segment or section, first phrase of the chunk's first shot].
export const CHUNKS = [
  { id: 'c01', name: 'Hook, §0 to the Musk quote', shots: 'H.01–0.04', from: [['H0a']] },
  { id: 'c02', name: '§0 caveats, §1 inheritance to Paine', shots: '0.05–1.13', from: [['00a', 'Both are promises']] },
  { id: 'c03', name: '§1 the fortune to come, §2 OWN', shots: '1.02–2.08', from: [['01a', 'And the largest fortune']] },
  { id: 'c04', name: '§2 PRINT and AGREE', shots: '2.09–2.23', from: [['02b', 'The second is to print']] },
  { id: 'c05', name: '§2 objection, §3 Alaska, Norway, humanity', shots: '2.24–3.13', from: [['03a', 'But it has one']] },
  { id: 'c06', name: 'The plan, §4 plant to Korea', shots: '3.14–4.11', from: [['04a', 'So here']] },
  { id: 'c07', name: '§4 babies and seeds, §5 grow to the cheering', shots: '4.12–5.15', from: [['04b', 'American babies']] },
  { id: 'c08', name: '§5 what exists, §6 Switzerland to the selection', shots: '5.07–6.06', from: [['05b', 'Pieces of this']] },
  { id: 'c09', name: '§6 selection, borders, the gap, "So picture the day we do."', shots: '6.07–6.19', from: [['06a', 'But someone would']] },
  { id: 'c10', name: 'Manila, Ohio, §7 close', shots: '6.20–7.10', from: [['07a', 'A care worker']] },
];
const ALL = CHUNKS.map((c) => c.id);

// absolute chunk ranges for a timing: R.a = first word of the chunk (section start or phrase), R.b = next chunk's R.a (or film end)
export function chunkRanges(T) {
  const at = (cands) => {
    for (const [sec, phrase] of cands) { if (!phrase) return T.seg(sec).start; if (T.has(sec, phrase)) return T.S(sec, phrase); }
    console.warn(`[film] chunk anchor ${JSON.stringify(cands)} not found; using the section start`);
    return T.seg(cands[0][0]).start;
  };
  const a = CHUNKS.map((c) => at(c.from));
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: i ? a[i] : 0, b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: a[i] }]));
}

// the real timing (audio/build_vo.py) wins; the provisional one (tools/provisional_timing.py) only fills in while it is missing
const realTiming = () => { try { return !JSON.parse(fs.readFileSync(ROOT + 'audio/timing.json', 'utf8')).provisional; } catch { return false; } };
export const TIMING = process.env.TIMING || (realTiming() || !fs.existsSync(ROOT + 'audio/timing.provisional.json') ? ROOT + 'audio/timing.json' : ROOT + 'audio/timing.provisional.json');
// the camera never stops (Jakob 20.10.: "even in the calmest moments something moves a little"): a slow float over the whole
// picture, 1.6–3.6 % zoom breathing, a drift that stays inside the zoom margin, a hint of roll. Absolute time, so cuts stay aligned.
export function cameraFloat(t) {
  const z = 1.026 + .01 * Math.sin(t * .23 + .7), m = (z - 1) / 2 * .8;
  return { z, x: Math.max(-1, Math.min(1, drift(t, 1, 11))) * W * m, y: Math.max(-1, Math.min(1, drift(t, 1, 23))) * H * m, r: .0011 * Math.sin(t * .17 + 2) };
}
export async function build({ timingFile = TIMING } = {}) {
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
  const film = new Film(shots, { grainAmt: .045, finish: filmFinish, float: cameraFloat });
  film.T = T;
  film.ranges = RANGES;
  film.prepare = (t) => prepareClips(T, t);
  film.list = list;
  return film;
}
