// Film 66 "Sam Altman Says Everything Will Get Cheap" (thumbnail A: AI MAKES EVERYTHING CHEAP; ~10:20 narration + ~5 s quiet + 15 s end
// screen), built on the Film 10/13/16/24/25/28/54/59 editorial-night machinery. ONE world: THE LONG LAND, FROM PURE THOUGHT TO SOLID GROUND
// (lib/f66_world.mjs). Plan: docs/MOTION.md + docs/shots.md (source: tools/shots66.py) · kit: lib/f66_kit.mjs · world + seams:
// lib/f66_world.mjs · builders: docs/BRIEF-builders.md.
// Twelve chunk files scenes/sc01.mjs … sc12.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT66)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the sound step), else data/provisional_timing.json
// (tools/provisional_timing.py, from the newest vo-vN.txt; a warning is printed). ROOT = $F66ROOT or /mnt/project-files/scenario/film-geld-nach-si/.
// ANCHORS ARE PHRASES ONLY. If one goes missing, T.G throws with the phrase.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f66_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook (lead) · thumbnail A: you on the rooftop, THE PROMISE crumbling · his list (4 tags) · the quote on the tag · the machines take the office work · thumbnail C: the receipt, RENT ↑ GROCERIES ↑ POWER BILL ↑ · your pay slip · one after another · the programmer\'s tag falls to < $1 ★ · one tag turns away and rises · half right → platePromise', from: 'Sam Altman says' },
  { id: 'c02', name: 'C1 out of the promise · prices heading down · every price is mostly time · the food dollar 54¢ / 12¢ · robots → the price sinks · the robot house · he sells cheap intelligence · the land wide: six tags + a seventh → the clock ★ · the test question', from: 'This January' },
  { id: 'c03', name: 'Station 1 KNOWLEDGE & ADVICE: the programmer\'s window again · his example, 10× a year · translators 30 % · cost ≠ price · ≈ 90 % billed by the hour · FALLS FIRST ★ · nearly free but climbing', from: 'Start where a price' },
  { id: 'c04', name: 'Station 2 EDUCATION: the college · the AI tutor, 2× gains · tuition $12,290 +2.9 % · the certificate only the university prints · the tag splits ★ · subscribe 1 (the land\'s windows warm) → plateFactory', from: "Education. It's on his list" },
  { id: 'c05', name: 'Station 3 THINGS: information vs things · C2 Musk out of a phone · any goods · 5,079,078 robots · phones −51 % · +14 % / +6.9 % (memory chips) · FALLS SLOWLY ★ · materials, chips, power: the cable under every tag', from: 'So far, every price' },
  { id: 'c06', name: 'Station 4 ENERGY: the power station · the Gentle Singularity quote · energy is the floor ★ · +33 % · Hassabis, clean energy · C3 · radical abundance (a forecast) · STAYS UP · FOR NOW', from: 'Energy' },
  { id: 'c07', name: 'Station 5 FOOD: energy + machines + the ground · the food dollar again · cropland $6,020 ★ · WORK OUT · GROUND STAYS', from: 'One tag needs energy' },
  { id: 'c08', name: 'Station 6 HOUSING & LAND: the turned tag turns: HOUSING · the robot house "on land you already own" · land ≈ 40 % · walls vs ground · "limited resources like land" · STAYS HARD · half right: the stairs (thumbnail B) ★ → plateStairs', from: 'Housing. The first word' },
  { id: 'c09', name: 'The seventh tag: not advice · how much is work? all of it · YOUR WAGE ★ · the programmer\'s week was a paycheck · work is what we sell', from: 'So what does that do' },
  { id: 'c10', name: 'Output +3.7 % / hours +0.1 % · labor share 53.0 % ★ · no proof · C4 Acemoglu · the second half of the promise · worse off · cheap was never enough', from: 'This summer, American businesses' },
  { id: 'c11', name: 'Three answers: MARKET · FUND · CHECK (idea, proof, weakness) · Alaska $1,200 ★ · politics sets it · the check, $1,000 a month · the bill · his answers changed', from: 'So how does everyone' },
  { id: 'c12', name: 'The order (the clock fills the frame) · half right · the seventh is open · prices follow machines, incomes follow rules (the town hall) · YOUR WAGE IS A PRICE TOO ★ · subscribe 2 · END_CAM end screen', from: "So that's the order" },
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
  film.prepare = (t) => prepareClipFrames(T, t);   // loads the clip footage frames round t (render.mjs awaits it)
  film.ranges = RANGES;
  film.list = list;
  return film;
}
