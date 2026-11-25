// Film 63 "The Pope Says AI Won't Save You" (thumbnail A: THE POPE: AI WON'T SAVE YOU; ~10:03 narration + ~5 s quiet + 15 s end screen),
// on the editorial-night machinery (films 10 → 67). NOT one world (REGELN §13): one composed motif per sentence, joined by carriers.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots63.py) · kit: lib/f63_kit.mjs · seam plates: lib/f63_seams.mjs · builders: docs/BRIEF-builders.md.
// Chunk files scenes/sc01.mjs … sc12.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS between entries: every entry boundary is a hard 'cut' between two frames the builders make identical (a carrier hand-off or a seam plate).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE / T.GW phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT63
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json (tools/provisional_timing.py from vo-v3.txt).
// ROOT = $F63ROOT or /mnt/project-files/scenario/film-papst/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f63_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (looked up GLOBALLY, nth = occurrence) · builders: docs/BRIEF-builders.md · shots: docs/shots.md
  { id: 'c01', name: 'Hook (lead): thumbnail A, the block, the Pope\'s hand · 1.4 BILLION unit chart · the kitchen, your open hands · three tiles (ill, bills, work) · through the window to the block: CURE DISEASE · END POVERTY · TAKE THE WORK · scaffolding + builders · a trace becomes a heartbeat (§9) · SAVE struck · WHAT DOES HE MEAN? · the same word as for warheads · C1 out of the slot · DISARMED · NOT BANNED · NOT BLESSED · → plateDisarmed', from: 'Artificial intelligence will not save you' },
  { id: 'c02', name: 'The encyclical: DISARMED sinks into the letter · his first · LEO + cardinals card · VS · §9 four symbols · one idea · §117 salvation · our short version · full-text search 0 · 0 · 0 · WHAT IS HE ARGUING WITH? → A PROMISE', from: 'In May, in Rome' },
  { id: 'c03', name: 'The promise: banner off · $250B+ stacked bar · the essay · upside/risks quote · country of geniuses · day and night · AT ITS STRONGEST · harvest of the three tiles · BEST NEWS · STILL A PROMISE · ★ ANCHOR the scale: BODY · MONEY · TIME · WHERE IS THE CATCH?', from: 'That promise is not a slogan' },
  { id: 'c04', name: 'The catch: the scan · the blueprint (§112) · the workshop, you without a helper · the measure moves · THE TRAP diagram · §117 card · less useful/desirable/worthy · WHO DECIDES?', from: 'For the Pope, the catch' },
  { id: 'c05', name: '★ ANCHOR Babel (§7) · ONE LANGUAGE/TECHNOLOGY/DIRECTION · the wall (§9) · DISARM in the gap · out of the race (§110) · out of the hands of a few (§110)', from: 'His picture for that power' },
  { id: 'c06', name: 'Tower or wall gauges · $122B round · domes shrink (§5) · THE NEW MONOPOLIES (§109) · dials VALUES (§107) · your question, their tag · the vault (§67) · @jack "yes" → plateYes', from: 'Tower or wall' },
  { id: 'c07', name: 'Subscribe 1 (the town\'s windows, your switch) · AND YOUR WORK? · Rerum novarum 1891 → 2026 · C3 · ×10 (Hassabis) · the workbench switch · §149 · thinner pay · 3 of 33 desks (§154) · richer and smaller', from: 'This channel exists for one reason' },
  { id: 'c08', name: 'Labor share 53.0 % · lowest since 1947 · other causes · capital vs wages (§160) · Scholl post · jobs come and go · the plough · the band of old jobs · UNPROVEN · DO THE BUILDERS SEE IT?', from: 'The share of American output' },
  { id: 'c09', name: 'The synod hall, the odd name card · the essay · CHRIS OLAH · ? · C4 · small speaker, big hall · pressures · AND YOUR WORK? · displaced · no mechanism · POPE = OLAH · not engineered / ★ grown · Series H · Nasdaq · pressures again · mini scale WHAT STAYS YOURS? → plateStays', from: 'The day the Pope presented' },
  { id: 'c10', name: 'The answer: one question (30.10.) · PURPOSE · tools, not persons · the loan counter · faceless entity · three switches LIFE · FREEDOM · FORCE · Geneva · hard to hear · the plant in the crack (§118) · ★ love goes out with it (§120) · the fridge photo', from: 'In October the Pope' },
  { id: 'c11', name: 'WHAT CAN NO MACHINE REACH? · C5 · FREEDOM · AN INNER LIFE · LOVE · WORSHIP · IS HE RIGHT? · Lazzarin · half true · five chapters · two passages · Levin headline · YouGov 5 bars · a poll proves nothing · two pairs · not Rome vs Silicon Valley · the kitchen · the hopeful reading (§156)', from: 'The night the letter came out' },
  { id: 'c12', name: 'Three levers (30.10.) LABS · GOVERNMENTS · VOTERS · ★ ANCHOR the scale level · the three tiles carried off · two chairs · a promise · Tuesday · §128 · OUR WORDS · the core sentence · the hands · the wall + subscribe 2 · end screen', from: 'None of this arrives' },
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
