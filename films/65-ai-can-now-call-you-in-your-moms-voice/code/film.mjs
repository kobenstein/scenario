// Film 65 "AI Can Now Call You in Your Mom's Voice" (~10:24 narration + 15 s end screen), built on the Film 10/13/16/29
// editorial-night machinery. ONE world: THE LINE (lib/f65_seams.mjs): a sleeping valley town at night; her house on the far hill (one warm
// kitchen window), one telephone line on five numbered poles down to the bank on the square, you (the yellow coat) on the near hill.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots65.py) · kit: lib/f65_kit.mjs · world + seams: lib/f65_seams.mjs · builders: docs/BRIEF-builders.md.
// Sixteen chunk files scenes/sc01.mjs … sc16.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT65)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else code/audio/timing.json (the real VO, the sound agent's commit; do not touch code/audio/), else <ROOT>audio/timing.json, else data/provisional_timing.json
// (tools/provisional_timing.py, from the newest vo-vN.txt; a warning is printed). ROOT = $F65ROOT or /mnt/project-files/scenario/film-ki-betrug/.
// Footage frames (S1, C1, S2) are loaded per frame by film.prepare (lib/f65_kit.mjs prepareClipFrames); C10 is a quote card.
// ANCHORS ARE PHRASES ONLY (a fact-checked vo-v3 changes words, not these openers). If one goes missing, T.G throws with the phrase.
// NO QR overlay (rule 16.11.2026).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import * as F65 from './lib/f65_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook · the gold arc her window → your phone (thumbnail) turns blue · ≈ $0 · NEARLY $8 BILLION from the town windows · the kitchen: the phone rings, a trembling blue wave · REAL / AI swap · the empty note slot · along the wire: 5 steps, 4 ghost poles, 1 calm bank window → plateLine(1)', from: 'A.I. can now call you' },
  { id: 'c02', name: 'Step 1 · the voice: pole 1, the Del Mastro call · S1 footage from her phone · 5½ hours', from: 'The first step is the voice' },
  { id: 'c03', name: 'Where a machine gets a voice: the silent hello is a dialer · the voice comes from what is posted', from: 'So where does a machine get a voice' },
  { id: 'c04', name: 'The code word: note 1 on the fridge (covered) · ask, hang up, call back', from: 'That family in California now uses' },
  { id: 'c05', name: 'Step 2 · the story: posts become facts · the chat machine · 3 of 4 profiles · it tracked who suspected', from: 'That is the second step' },
  { id: 'c06', name: 'The question: note 2 (?) · → plateLine(3)', from: 'So agree on a second thing' },
  { id: 'c07', name: 'Step 3 · a face: the forged prime minister on a screen · CA$900k · investment fraud ≈ half', from: 'The third step is a face' },
  { id: 'c08', name: 'The house rule: note 3 (FAMOUS FACE + PROFIT = FAKE) · she might call you · subscribe 1', from: 'So the most expensive lie' },
  { id: 'c09', name: 'Step 4 · the clock: the call timer, the line kept busy · the fake FBI video call · C10 quote card', from: 'So the scam must not give her the time' },
  { id: 'c10', name: 'The long hours · too trusting? no: 6 % of cases, 70 % of the money · the plan on a calm day: note 4 (STOP)', from: 'And think of those long hours' },
  { id: 'c11', name: 'The FTC action plan · C1 footage from her phone · she is on her way to the bank', from: 'The Federal Trade Commission' },
  { id: 'c12', name: 'Step 5 · the money: plateLine(5) · the bank window, the real teller · note 5: the trusted contact', from: 'Then one step is left' },
  { id: 'c13', name: 'The law is moving: two counter windows (MD, NC) · S2 footage from the counter window · test it', from: 'And the law is moving' },
  { id: 'c14', name: 'Because a copy needs an original: the five notes complete', from: 'Because a copy needs an original' },
  { id: 'c15', name: "It won't stop at scams: trust moves from the senses to agreements", from: "And it won't stop at scams" },
  { id: 'c16', name: 'One evening at her kitchen table · subscribe 2 · the calm end picture (15 s end screen, free tiles)', from: 'And one evening' },
];
const ALL = CHUNKS.map((c) => c.id);

export function chunkRanges(T) {
  const a = CHUNKS.map((c, i) => (i ? T.G(c.from, c.nth ?? 0) : 0));
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: i ? a[i] : 0, b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: i ? a[i] : T.G(c.from, c.nth ?? 0) }]));
}

const PROVISIONAL = new URL('./data/provisional_timing.json', import.meta.url).pathname;
const REPO_TIMING = new URL('./audio/timing.json', import.meta.url).pathname;   // the sound agent's timing in the repo (code/audio/, theirs: read only)
export const TIMING = process.env.TIMING || [REPO_TIMING, ROOT + 'audio/timing.json'].find((f) => fs.existsSync(f)) || PROVISIONAL;
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
  film.ranges = RANGES;
  film.list = list;
  film.prepare = (t) => F65.prepareClipFrames(T, t);   // footage frames for the clip frames (S1, C1, S2), loaded before each frame
  return film;
}
