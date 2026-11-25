// Film 77 "AGI: The Final Human Invention" (The Good Takeoff; ~10:00 narration + a quiet walk + 15 s end screen, 614.1 s),
// on the editorial-night machinery (films 10 → 63). NOT one world (REGELN §13): one composed motif per sentence, joined by carriers.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots77.py) · kit: lib/f77_kit.mjs · seam plates: lib/f77_seams.mjs · builders: docs/BRIEF-builders.md.
// Chunk files scenes/sc01.mjs … sc12.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS between entries: every entry boundary is a hard 'cut' between two frames the builders make identical (a carrier hand-off or a seam plate).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE / T.GW phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT77
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, 25.11.), else data/provisional_timing.json (tools/provisional_timing.py from vo-v4.txt).
// ROOT = $F77ROOT or /mnt/project-files/scenario/film-77-turing/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing);
// clips ONLY via T.clip(id) (the slots shrink ~1.2–1.5 s after the clip trim).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f77_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (looked up GLOBALLY, nth = occurrence) · builders: docs/BRIEF-builders.md · shots: docs/shots.md
  { id: 'c01', name: 'Hook (lead): thumbnail THE BOARD (HUMAN INVENTIONS, the last row glowing) · your room: bulb, phone, screen · three inventors · the list column races · A.G.I. in the last row · head → ring · the stylus · the second column ★ · SO WHAT WILL IT INVENT FOR YOU? · ALREADY BEGUN · the dot page · 80 YEARS · Gowers card · the band: half promise, half condition · you under the cover → plateBand', from: 'A.G.I. may be the final' },
  { id: 'c02', name: 'B1 · Good\'s sentence and who wrote it: the band big · Good card (p. 33) · 60 years · Jack Good · Hut 8, Turing · the ring chain · THE END? · survival card (p. 31) · twentieth century (p. 78) · the 2000 leaf · WHY TAKE HIM SERIOUSLY?', from: 'Here is the promise' },
  { id: 'c03', name: 'B1 · today: the lecture hall · A.G.I. = ultraintelligent machine · Hassabis + stake · C1 · STEP 1 / STEP 2 · your list · ★ ANCHOR THE BOARD set to STILL WAITING (four rows) · the test stamp · row 4 empty · the second half → the mini board', from: 'Because today, people are trying' },
  { id: 'c04', name: 'B1 · line 1 ENERGY: your bill · IMAGINE (dashed) · the test · water + electricity → hydrogen · the catalyst plate · Lila line 2,942 · palladium · company report + preprint, not yet confirmed', from: 'Start with the one you pay' },
  { id: 'c05', name: 'B1 · thousands of labs (forecast) · the bill does not move · NOT YET · three stations at human speed · mini board ENERGY BEGUN · the plate: not a power plant, a material', from: 'Now imagine the machine Jack Good' },
  { id: 'c06', name: 'B1 · line 2 MATERIALS: the materials · a week of battery · a house without AC (dashed) · DOESN\'T EXIST YET · superconductor, no loss · 2.4 million lattices · ElementsClaw sample · R = 0 → plateSample', from: 'Because energy is only as good' },
  { id: 'c07', name: 'B2 · the catch: the sample by your power line · 2.5–6.5 K · no replication · designed vs made · Periodic Labs robot + furnace · C2 · only what gets built · MATERIALS BEGUN · a grain', from: "So why isn't it in the power lines" },
  { id: 'c08', name: 'B2 · subscribe 1 (many figures, the gold reaches them, your hand on the button) · why still small · matter slow, ideas fast · the dot page returns · OpenAI #90 · nine checkers · Gowers card · AlphaProof Nexus · 9 of 353 · claims vs checkers', from: 'This channel exists for one reason' },
  { id: 'c09', name: 'B2 · Tao and the stacks · C3 · too many · proof indigestion · 25 Fields medalists · severely misaligned · DISCOVERY BEGUN · who decides · your list vs theirs · ★ ANCHOR the cover falls (Good p. 33) · docile · Turing card → plateTuring', from: 'Terence Tao is one' },
  { id: 'c10', name: 'B3 · line 4 CONTROL: control flaps into row 4 · the machine tells us how · DOCILE? gate · our job (the stylus) · many lights · the package on the road · CAISI gate (voluntary) · EU gate (fines, recall)', from: "That's the fourth line" },
  { id: 'c11', name: 'B3 · rules from outside · into the package · Christiano + five tools · C4 · plausible, none probably works · lamps inside · who writes row 4: labs · governments · voters · you', from: 'Rules work from the outside' },
  { id: 'c12', name: 'B3 · what stays with us: #1196 · Liam Price at his laptop · checked by Lichtman + Tao · co-author · three signs · the compass · ★ ANCHOR THE BOARD: three lines BEGUN · row 4 ours · the long list · HOW TO STEER IT written · many hands · subscribe 2 · end screen', from: 'And if the machine does the inventing' },
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
  // Editorial-Nacht finish for every frame (print: F.PRINT77): vignette + precomputed grain (lib/f10_editorial.mjs finish); stubs get it too
  const finish = (ctx, t, o = {}) => edFinish(ctx, t, o);
  const film = new Film(shots, { finish, float: cameraFloat });
  film.T = T;
  film.prepare = async (t) => prepareClipFrames(T, t);   // loads the clip footage frames round t (render.mjs awaits it)
  film.ranges = RANGES;
  film.list = list;
  return film;
}
