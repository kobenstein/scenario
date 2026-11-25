// Film 73 "The First Generation That Won't Die" (thumbnail A: the headstone "1985 –" with a golden crack; ~10:20 narration + 5 s quiet +
// 15 s end screen), built on the editorial-night machinery (films 10 → 69). NOT one world (REGELN §13): a motion-design film of explainer
// sequences on THE LIFELINE (lib/f73_stage.mjs) + scenes; every picture shows exactly its sentence. The Leitbild (THE STONE, lib/f73_world.mjs)
// only at 4 anchors. Plan: docs/MOTION.md + docs/shots.md (source: tools/shots73.py) · kit: lib/f73_kit.mjs · builders: docs/BRIEF-builders.md.
// Chunk files scenes/sc01.mjs … sc13.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a planned match).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT73
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json (tools/provisional_timing.py from the newest vo-vN.txt).
// ROOT = $F73ROOT or /mnt/project-files/scenario/film-73-wont-die/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f73_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', grp: 'Lead', name: 'Hook · ANCHOR 1 the stone "1985 –" + title · the crack opens · AN ENGINEERING PROBLEM, the dash runs out as THE LIFELINE · the AI ring + its beam · the offer card (NO MORE AGING, NO END DATE) · the question + THE ANSWER · Pew 2013 · COPY A MIND: line → head → computer · ★ the fly brain map wire by wire · the virtual fly · REPAIR: the body drawing · 2032 → plate2032', from: 'Every generation before yours' },
  { id: 'c02', grp: 'B1', name: 'Kurzweil: C1 out of the 2032 · +1 YEAR FOR EVERY YEAR · old age stops being the cause · not immortality · dates 2029 / 2030 / 2032 · critics · the Strygin analysis (quote) · ★ 2459 at the far end of the line · a bet on AI', from: 'The date comes from' },
  { id: 'c03', grp: 'B1', name: 'Is the bet paying off: the virtual cell (predicted before the experiment) · ★ the gene row, SRSF1 lights gold · the mice 778 → 886 days, +14% · caveats · no drug against aging · A GUESS / REAL', from: 'Is that bet paying off' },
  { id: 'c04', grp: 'B1', name: 'The copy: Eon Systems · the brain map + the virtual body · ★ walk, groom, feed · the headline · the critics · C3 Andregg', from: 'Then the copy is' },
  { id: 'c05', grp: 'B1', name: 'And still: what is missing (memories, walking separate) · 1 mm³ of human brain · ★ 1.4 petabytes · IS THAT YOU? → plateTwoAnswers', from: 'And still' },
  { id: 'c06', grp: 'B2', name: 'The question again: Pew 56% not for me / 68% others would · ★ everyone points at the others · Nat Geo: a shorter life without decline 64% · OLD FOREVER vs HEALTHY · Williams / Fischer: boredom', from: 'Which brings back' },
  { id: 'c07', grp: 'B2', name: 'Subscribe 1 (field of lifelines, mission) · ★ ANCHOR 2 (turn): "What happens to a world that was built around dying?" pull back, the town below', from: 'This channel exists' },
  { id: 'c08', grp: 'B2', name: 'Say it works · SCENARIO: A LIFE WITH NO END DATE · the oldest alive · ★ the marriage: rings + no end date · ≈30 years · C4 Gratton · learn/work/retire → 5 careers', from: 'Say it works' },
  { id: 'c09', grp: 'B2', name: 'Still yes? · the inheritance never arrives (FEDEA) · the gain / the price · Planck · ★ outsiders after a star dies (Azoulay +8.6%) → plateTop', from: 'And an inheritance is only' },
  { id: 'c10', grp: 'B3', name: 'At the very top: Beijing 3 Sep 2025 (Xi / Putin quote) · ★ 150 · any president / judge / founder · who steps aside · only the wealthy', from: 'And at the very top' },
  { id: 'c11', grp: 'B3', name: 'The good version: ★ years in poor health fill gold · the genome $95M → a few hundred $ · costs up', from: "It doesn't have to go" },
  { id: 'c12', grp: 'B3', name: 'Rules: who steps aside (22nd amendment) · who pays (Denmark 70) · ★ who can afford it (Montana SB 535) · Gavrilov · 1 in 5 · HEALTHY / FOR EVERYONE / WITH RULES · would you?', from: 'Part of that comes down' },
  { id: 'c13', grp: 'B3', name: 'ANCHOR 3 (punchline): the stone, 2032 … 2459 · we accept / we work on · the question one last time · ★ ANCHOR 4 the Kernsatz · subscribe 2 · end screen', from: 'So is yours the first' },
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
  film.prepare = async (t) => prepareClipFrames(T, t);   // loads the clip footage frames round t (render.mjs awaits it)
  film.ranges = RANGES;
  film.list = list;
  return film;
}
