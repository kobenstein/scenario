// Film 70 "Harari's Biggest Fear About AI Isn't Robots" (thumbnail A: WORSE THAN KILLER ROBOTS; ~9:40 narration + 15 s end screen), built
// on the editorial-night machinery (films 10 → 69). NOT one world (Jakob 24.11., REGELN §13): a motion-design film of explainer sequences
// on THE TRUST BOARD (lib/f70_explain.mjs) + scenes, every picture shows exactly its sentence; the Leitbild (THE CHAIN OVER THE NIGHT,
// lib/f70_world.mjs) only at 4 anchors. Plan: docs/MOTION.md + docs/shots.md (source: tools/shots70.py) · kit: lib/f70_kit.mjs ·
// builders: docs/BRIEF-builders.md. Chunk files scenes/sc01.mjs … sc10.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a planned match).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT70
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json (tools/provisional_timing.py from the newest vo-vN.txt).
// ROOT = $F70ROOT or /mnt/project-files/scenario/film-harari/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f70_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (unique in the film: T.G matches the LAST word as a prefix, so 'Law.' alone would hit 'lawsuit')
  { id: 'c01', name: 'Hook (lead) · ANCHOR 1/4 the chain over the night (thumbnail A title) · push into your hand: the link becomes your card · the bakery: reader, beep, bread · the light line into the knot · somebody at a desk · the cow, coins over her · Q2 from her ear tag · WHO DO YOU TRUST? the machine at the desk · the screen grows into C1 → plateDementia', from: "Yuval Noah Harari's" },
  { id: 'c02', name: 'Station 1: collective dementia (type) · no hate · the city that stops explaining · the armchair · FED HOUSED RUNNING · the historian, 50M+ · the reader again, the knot closes around you', from: 'His word for it' },
  { id: 'c03', name: 'Station 2: bond market / grid / phone · hardly anyone · never ran on understanding · Q1 · TRUST becomes the chain of people · the cow beside you · ANCHOR 2/4 the four links named · under strain · the chain shrinks into the HUD', from: 'Be honest' },
  { id: 'c04', name: 'Link 1 MONEY: the adviser · BoE 24% / 81% · agents 80% · ESMA · C2 · ★ the link holds with a crack', from: 'Money. Your adviser' },
  { id: 'c05', name: 'Link 2 CONTRACT: job / loan / policy · YES · software answers first · ★ 1.1 BILLION · over 40 · claims false · Eightfold · how a link cracks · no villain · subscribe 1 → plateLaw', from: 'Contract. A job' },
  { id: 'c06', name: 'Link 3 LAW: rules for people · bureaucratic natives · DoT 20 minutes · ★ the draft unrolls · South Africa · writing outruns checking', from: 'Law. Rules written' },
  { id: 'c07', name: 'Link 4 TRUTH: your judgment · Ipsos 75% · the analysts and the coin · ★ 86% · limits · CIP 58% · we follow the machine · ANCHOR 3/4 four links, four cracks', from: 'Truth. The last link' },
  { id: 'c08', name: 'The turn: NO · Q3 · Musk enjoys the ride · the optimists · Estonia (people first, then chatbots) · ★ the cow gets an interpreter · the hard look at Harari · which one deserves your trust → plateAnvil', from: "Harari's own answer" },
  { id: 'c09', name: 'Three tests: a human answers (CJEU, DEC 2027) · it says it is a machine (Art. 50, the ban) · someone outside can check (★ AISI) · who forges them · three questions · C3', from: 'Three tests' },
  { id: 'c10', name: 'The big answer: back to the cow · ★ the cracks fill with gold · the reader again · WHO → WHAT · ANCHOR 4/4 the chain answers · subscribe 2 · end screen', from: 'Go back to the cow' },
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
