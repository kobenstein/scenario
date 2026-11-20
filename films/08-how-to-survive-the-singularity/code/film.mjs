// Film 08 "How to Survive the Singularity", the first minute (70.84 s) in the Film 5/6 machinery: one image moment per sentence, anchored to VO
// phrases (never to seconds). One chunk (scenes/sc01.mjs) draws the whole minute as one continuous take; this file stitches its entries.
// NO BLENDS (Jakob 2026-10-20: "keine Blende … durchgehende Animation"): every entry is a hard 'cut' between two frames that the
// builders make identical (a continuous take, or an in-world move through an object). Any other tr is turned into 'cut' with a warning.
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
import { errorCard, stubChunk } from './lib/stub.mjs';
import { HAND, hand } from './lib/handoff4.mjs';

export { ROOT };
// Chunk table (m1/bild/shots.md §5; anchors = the first VO segment of each chunk). from = candidate anchors [segment or section, first phrase of the
// chunk's first shot]; ['clip', 'C9'] anchors a chunk to the moment a clip's screen turns on (0.7 s before its audio).
export const CHUNKS = [
  { id: 'c01', name: 'The first minute: the horizon light, the lab, Altman (C1), the map dissolves, the title, drift or navigate, the preview, the canoe, the star compass', shots: '1.01–7.04', from: [['00a']] },
  { id: 'c02', name: 'What the singularity really is: the word, the cinema, Vinge, the black heart, the pier, the stair and the backdrop, Future Shock, your table', shots: 'c02.01–c02.21', from: [['01a']] },
  { id: 'c03', name: 'Map vs compass: ink lifts off the chart, Q1 Kierkegaard, Hōkūleʻa leaves Maui, Mau, five signs, C2 Nainoa, the clouds, "he was the compass", your hand', shots: 'c03.01–c03.20', from: [['02a']] },
  { id: 'c04', name: 'Your compass, North and East: the lit window, Frankl\'s plane (C3), the kite, Vallor\'s mirror, Q2 Gerjuoy', shots: 'c04.01–c04.19', from: [['03a']] },
  { id: 'c05', name: 'Your compass, South and West: the fire circle, Harvard (C4 Waldinger), the harbour, tacking, Taleb\'s fire, Sarasvathy\'s shed', shots: 'c05.01–c05.13', from: [['03c']] },
  { id: 'c06', name: 'Draw your compass; the needle; the clouds again; arrival in Tahiti; 17,000 in the harbour', shots: 'c06.01–c06.15', from: [['03f']] },
  { id: 'c07', name: 'The storms: power (C5 Acemoglu), trust (the call), speed (months / years); navigators exist for storms', shots: 'c07.01–c07.21', from: [['04a']] },
  { id: 'c08', name: 'Our compass: the society rose, North = 1948, East + West = speed (testing, sandboxes, expiry, review)', shots: 'c08.01–c08.21', from: [['05a']] },
  { id: 'c09', name: 'Our compass: South = each other (Taiwan online, C6 Tang), many hands, Ostrom, the assembly; the needle: calm, Solnit', shots: 'c09.01–c09.25', from: [['05c']] },
  { id: 'c10', name: 'The fork: the same fast world, twice', shots: 'c10.01–c10.14', from: [['06a']] },
  { id: 'c11', name: 'Legacy: Mau → Nainoa → many navigators, C7 Krznaric, the ending at your window, the end screen', shots: 'c11.01–c11.17', from: [['07a']] },
];
const ALL = CHUNKS.map((c) => c.id);

// absolute chunk ranges for a timing: R.a = first word of the chunk (section start or phrase), R.b = next chunk's R.a (or film end)
export function chunkRanges(T) {
  const at = (cands) => {
    for (const [sec, phrase] of cands) {
      if (sec === 'clip') { const c = T.clip(phrase); if (c) return Math.max(0, c.start - .7); continue; }
      if (!phrase) { try { return T.seg(sec).start; } catch { continue; } }
      if (T.has(sec, phrase)) return T.S(sec, phrase);
    }
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
// no blends: everything that is not a hard cut becomes one (the builders make the frames on both sides of a cut identical)
const WARNED = new Set();
const cutOnly = (e) => {
  if (!e.tr || e.tr === 'cut') return { ...e, tr: 'cut', d: Math.min(e.d ?? .1, .1) };
  const k = `${e.sec}:${e.tr}`; if (!WARNED.has(k)) { WARNED.add(k); console.warn(`[film] ${e.sec}: tr '${e.tr}' is not allowed (no blends, no slides); using 'cut'`); }
  return { ...e, tr: 'cut', d: .1 };
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
    if (!fs.existsSync(f)) shots = stubChunk(T, R);   // not built yet: one card per sentence (stub.mjs)
    else {
      try { const mod = await import(f.href); shots = await mod.default(T, R); }
      catch (err) { console.error(`[film] chunk ${id} failed: ${err.message}`); shots = [{ t: R.first - .3, draw: errorCard(id, R, err), tr: 'cut', d: .1 }]; }
    }
    for (const e of shots) list.push(cutOnly({ ...e, sec: id }));
  }
  // the handoff plates (lib/handoff4.mjs): film.mjs draws each boundary's plate from H.a to H.b and drops chunk entries inside that window,
  // so the cut between two chunk files sits inside one identical full-frame image (outgoing ends on it, incoming starts on it)
  const plates = [];
  for (const key of Object.keys(HAND)) {
    const [o, i] = key.split('>'); if (!RANGES[o] || !RANGES[i] || !(want.includes(o) || want.includes(i))) continue;
    const Hd = hand(key, T, RANGES); plates.push(Hd);
    list.push({ t: Hd.a, draw: (ctx, t) => Hd.plate(ctx, t), tr: 'cut', d: .1, print: Hd.print, sec: 'plate ' + key });
  }
  list = list.filter((e) => e.sec.startsWith('plate') || !plates.some((p) => e.t > p.a + 1e-6 && e.t < p.b - 1e-6));
  // entries that collapsed onto the same start (moved to H.b): keep the last one the chunk listed
  list.sort((p, q) => p.t - q.t);
  list = list.filter((e, k) => !(list[k + 1] && Math.abs(list[k + 1].t - e.t) < 1e-6 && list[k + 1].sec === e.sec));
  const end = T.duration;
  const shots = list.map((e, i) => {
    const nx = list[i + 1], d = e.d ?? .1, dn = nx ? (nx.d ?? .1) : 0;
    const a = i ? e.t - d / 2 : (e.t > 0 ? e.t : 0), b = nx ? nx.t + dn / 2 : end;
    return { a: i ? a : 0, b, draw: e.draw, sec: e.sec, sound: e.sound, print: e.print, out: nx ? { kind: 'cut' } : { kind: 'black' }, _start: e.t };
  });
  for (let i = 1; i < shots.length; i++) shots[i].a = Math.min(shots[i].a, shots[i - 1].b - .01);
  const film = new Film(shots, { grainAmt: .045, finish: filmFinish, float: cameraFloat });
  film.T = T;
  film.ranges = RANGES;
  film.prepare = (t) => prepareClips(T, t);
  film.list = list;
  return film;
}
