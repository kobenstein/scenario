// Film 69 "Europe Can Still Win the AI Race" (thumbnail A: EUROPE CAN STILL WIN AI; ~10:25 narration + 15 s end screen), built on the
// editorial-night machinery (films 10 → 67). NOT one world (Jakob 24.11., REGELN §13): a motion-design film of explainer sequences on THE
// PLAN SHEET (lib/f69_explain.mjs) + scenes, every picture shows exactly its sentence; the Leitbild (the puzzle moon over the night sea,
// lib/f69_world.mjs) only at 4 anchors. Plan: docs/MOTION.md + docs/shots.md (source: tools/shots69.py) · kit: lib/f69_kit.mjs ·
// builders: docs/BRIEF-builders.md. Chunk files scenes/sc01.mjs … sc12.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a planned match).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT69
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json (tools/provisional_timing.py from the newest vo-vN.txt).
// ROOT = $F69ROOT or /mnt/project-files/scenario/film-europa-ki/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f69_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook (lead) · ANCHOR thumbnail A · TOO SLOW/SMALL/MANY RULES tiles · the AI screen gets a say · contract / interview / loan at the desk · windows wherever you live · the empty disc · HOW COULD EUROPE STILL WIN? · 100 cells → ABOUT 5% · the machine shipped away · the person hired away · EU vs US crowds · ★ the disc breaks into 27 crates · 27 rule booklets · the plan on the table + dates → plateMachine', from: 'Europe can still win' },
  { id: 'c02', name: 'Station 1: the machine (hall, Veldhoven, bus, 3 jets, 0% Europe) · strengths not connected · Draghi report · C1 · 1 in 6 · ANCHOR (turn): the five parts, the test question', from: 'Those chip machines' },
  { id: 'c03', name: 'Part 1 THE MONEY: €10 trillion at the kitchen tables · the string to the vault · two paths · not law yet · critics · +62% · the fund · Mistral · ★ the machine piece clicks into the money piece · HALFWAY', from: 'Money first' },
  { id: 'c04', name: 'Why it matters: Mensch (C2) · A CLIENT STATE: defence, public services · a client gets no say', from: 'But why does it matter' },
  { id: 'c05', name: 'Part 2 ONE SET OF RULES: 27 company laws · ★ 27 stacks become one sheet (EU INC) · held up, unions at the table · not before 2028 · ON PAPER → plateEnergy', from: 'Because a company that wants' },
  { id: 'c06', name: 'Part 3 THE ENERGY: the data centre and its cables · 2× US prices · the north and the reactors · 7 gigafactories · 3 Dec · the budget · 5% → 5.6% · HALFWAY · ★ NEEDED, the machine lights in the plan', from: 'None of it runs' },
  { id: 'c07', name: 'Subscribe 1 · Part 4 ONE LAB: enough for what · ★ the CERN ring, the web · CERN FOR AI · pilot €107M · C3 · €500 BILLION (estimate) · ON PAPER', from: 'This channel exists' },
  { id: 'c08', name: 'Part 5 THE MINDS: the empty slot · two offer letters, +70% · stock options inside the paper company · ★ −45%, half the figures leave · OPEN → plateFour', from: 'And a lab is an empty' },
  { id: 'c09', name: 'The second race: not the biggest chatbot · the second track (workshops) · weeks → hours · ★ 100-year-old works, data behind the wall · Koerte (C4) · together enough data', from: 'So suppose all five' },
  { id: 'c10', name: 'A say in the rules: the machine on the negotiating table · one voice (NL decides, Washington, China) · two boards: shared money / fewer rules · who decides: four hands, the ballot', from: 'The other prize' },
  { id: 'c11', name: 'ANCHOR (verdict): the plan big · dates on every part · computers NO / putting AI to work YES · the interview again, someone at the table · Draghi (C1b) · the budget clock', from: "So that's where the plan" },
  { id: 'c12', name: 'ANCHOR (end): machines, savings, minds · NEVER TOO SMALL · you reach for the fifth piece · subscribe 2 · end screen', from: 'This channel exists', nth: 1 },
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
