// Film 04 (full film, 570 s) in the Film 5 machinery: one image moment per sentence, anchored to VO phrases (never to seconds).
// Eighteen chunk files scenes/sc01.mjs … sc18.mjs (one builder each) return their shots; this file stitches them into one timeline.
// NO BLENDS (Jakob 2026-10-20: "keine Blende … durchgehende Animation"): every entry is a hard 'cut' between two frames that the
// builders make identical (a continuous take, or an in-world move through an object). Any other tr is turned into 'cut' with a warning.
// Chunk boundaries: lib/handoff4.mjs. Around each boundary this file itself draws the shared full-frame plate from H.a to H.b;
// the outgoing chunk must arrive in exactly that plate at H.a, the incoming chunk must leave it from H.b.
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
// Chunk table (bild/shots.md v2 §4). from = candidate anchors [segment or section, first phrase of the chunk's first shot].
export const CHUNKS = [
  { id: 'c01', name: 'Hook: work ends, income, sleep in, travel, rest, the wall', shots: '1.01–1.09', from: [['00a']] },
  { id: 'c02', name: 'Daydream, on stage, Musk clip, ten or twenty years, the condition', shots: '2.01–2.07', from: [['00c', 'It sounds']] },
  { id: 'c03', name: 'The hard part: does what it earns reach you, the biggest if', shots: '3.01–3.04', from: [['01a', "But that's not"]] },
  { id: 'c04', name: 'End work vs end having to work', shots: '4.01–4.04', from: [['01b']] },
  { id: 'c05', name: 'The honeymoon: sleep, checkout, the knot, say no, the town you love, grandmother, your street (Maslow 1)', shots: '5.01–5.15', from: [['02a']] },
  { id: 'c06', name: 'The slump and the turn: episodes, wine at four, the fear, why we numb ourselves, exhausted', shots: '6.01–6.19', from: [['03a']] },
  { id: 'c07', name: 'The world of have-to, the habit, the hangover, the Swedish lottery winners', shots: '7.01–7.10', from: [['03b', 'For most of our lives']] },
  { id: 'c08', name: 'It was the word: unemployed to retired, the word is gone, who am I, clip S', shots: '8.01–8.13', from: [['03b', 'Part of what hurts']] },
  { id: 'c09', name: 'The invitation and the free-time curve', shots: '9.01–9.07', from: [['04a']] },
  { id: 'c10', name: 'First, to people (Maslow 2): parents, long dinners, neighbours, friends, drifting apart, a tribe', shots: '10.01–10.13', from: [['04a', 'First, to people']] },
  { id: 'c11', name: 'Who you are (Maslow 3): what you do, made by hands, mastery, the violin, the craft, meaning', shots: '11.01–11.11', from: [['05a']] },
  { id: 'c12', name: 'Kenya, businesses, absorbed at work, the difference, wanting to, clip A', shots: '12.01–12.09', from: [['05a', 'When people in Kenya']] },
  { id: 'c13', name: 'The catch: only you; one person, one idea; the river; the council, the shelter; you start', shots: '13.01–13.14', from: [['06a']] },
  { id: 'c14', name: 'Every kitchen table on Earth; respect: not what you earn, what you give; the question (Maslow 4)', shots: '14.01–14.05', from: [['06b']] },
  { id: 'c15', name: 'The top: everyone who ever lived, survival ate their days, a privilege of the few, Lagos, Peru, you', shots: '15.01–15.13', from: [['07a']] },
  { id: 'c16', name: 'Four thousand weeks, Bronnie Ware, the weeks you have left, a wonderful life', shots: '16.01–16.10', from: [['07b']] },
  { id: 'c17', name: 'The older question: silence, prayer, the night sky, who am I, the noise stops', shots: '17.01–17.08', from: [['07d']] },
  { id: 'c18', name: 'The if is still there: possible is not shared, a few or everyone, wide open, you want to, from here to there', shots: '18.01–18.10', from: [['08a']] },
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
  // the handoff plates (lib/handoff4.mjs): from H.a to H.b this file draws the shared plate; chunk entries that start inside the
  // window are moved to H.b (incoming) or dropped (outgoing), so the plate is exactly what is on screen in [H.a, H.b)
  for (const key of Object.keys(HAND)) {
    const [o, i] = key.split('>'); if (!want.includes(o) && !want.includes(i)) continue;
    const Hd = hand(key, T, RANGES);
    list = list.filter((e) => !(e.sec === o && e.t >= Hd.a - 1e-6)).map((e) => (e.sec === i && e.t < Hd.b ? { ...e, t: Hd.b } : e));
    list.push({ t: Hd.a, tr: 'cut', d: .02, draw: Hd.plate, print: Hd.print, sec: 'plate:' + key });
  }
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
