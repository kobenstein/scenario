// Film 59 "You Can Now Buy a Piece of AI" (thumbnail AI GOES PUBLIC; ~10:20 narration + ~5 s quiet + 15 s end screen), built on the
// Film 10/13/16/24/25/28/54 editorial-night machinery. ONE world: THE CITY UNDER THE CRYSTAL (lib/f59_world.mjs).
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots59.py) · kit: lib/f59_kit.mjs · world + seams: lib/f59_world.mjs · builders: docs/BRIEF-builders.md.
// Twelve chunk files scenes/sc01.mjs … sc12.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT59)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the sound agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from the newest vo-vN.txt; a warning is printed). ROOT = $F59ROOT or /mnt/project-files/scenario/film-ai-goes-public/.
// ANCHORS ARE PHRASES ONLY. If one goes missing, T.G throws with the phrase.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f59_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook · thumbnail A (the crystal, a facet falls into your hand, AI GOES PUBLIC) · the shard becomes the banking app: ANT · chip makers, tech giants: this is different, an AI lab · price, BUY · the warning label · the quote card (prospectus) · the thick document · A PIECE ✓ | A SAY (the wheel behind glass) · the page shrinks into the tower window → plateWindow', from: 'This week' },
  { id: 'c02', name: 'Out of the window: the city, the crystal = ANTHROPIC · NASDAQ: ANT, first trade expected · $70–78, 825M shares · 2nd-largest IPO · not this film\'s subject · the jar (your savings)', from: 'The seller is Anthropic' },
  { id: 'c03', name: 'The bell far right · COUNTDOWN board STEP 1 · the prospectus, 90+ pages of warnings · two warning cards · the promise · managed by whom?', from: 'So before the opening bell' },
  { id: 'c04', name: 'Share → vote → wheel · not here · the vote bar 49.9 | 50.1 · the trust, 4 trustees · the dinner table 7 + 4 ★ · a claim on the money, not a hand on the wheel (thumbnail C)', from: 'With most companies' },
  { id: 'c05', name: 'C1 from a crystal facet · the seller · stewards card · no buyer can vote it down · three warning cards · Z1 quote card · safety before your return · the price tag "$ ?" on the crystal → plateCrystal', from: 'Why build a company' },
  { id: 'c06', name: 'STEP 2 · the letter (NYC comptroller) · a grade every day · the trustees choose directors · Bengio, the race · C2 · a race by choice', from: 'Many doubt it' },
  { id: 'c07', name: 'The essay WE MUST PACE THE FRONTIER · his word, not proof · in writing · UNPROVEN, ON THE RECORD · subscribe 1 (the city lights up)', from: 'But the company has an answer' },
  { id: 'c08', name: 'STEP 3 pricing night · up to ≈ $1.4 trillion · KNOWN | FORECAST trays · revenue ★ · loss · C3 (FORECAST) · 1–2 years vs within a few years → plateSort', from: 'If the mission is unproven' },
  { id: 'c09', name: 'Orders 6× · AI stocks fell · "most ridiculous IPO" · a price is a forecast, not a verdict', from: 'Reports say there are' },
  { id: 'c10', name: 'The jar · an index is a list · THE BELL RINGS ★ (STEP 4, +15 trading days) · fast lists vs S&P 1 year · a slice lands in the jar · the senator\'s letter · buy or don\'t', from: "And one thing doesn't depend" },
  { id: 'c11', name: 'Amazon, Google: no vote · the wheel is not for sale · eleven people, the same dinner table ★ · the board must balance three things', from: 'But look at who else' },
  { id: 'c12', name: 'Recall the warning · you are affected · a stake: threads of light to every window · a stake has a voice · a share has a price ★ · subscribe 2 · 15 s end screen', from: 'Now recall the warning' },
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
