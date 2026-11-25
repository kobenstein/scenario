// Film 71 "Max Tegmark's 12 Endings for AI" (thumbnail A: 12 ENDINGS FOR AI; ~11:25 narration + 15 s end screen), built on the editorial-night
// machinery (films 10 → 69). REGELN §13: a motion-design film of explainer sequences on THE YARD (lib/f71_kit.mjs), every picture shows
// exactly its sentence; the Leitbild (thumbnail A, the twelve doors on the night plain, lib/f71_world.mjs) only at 4 anchors.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots71.py) · kit: lib/f71_kit.mjs + lib/f71_world.mjs · builders: docs/BRIEF-builders.md.
// Chunk files scenes/sc01.mjs … sc13.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a planned match).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT71
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json (tools/provisional_timing.py).
// ROOT = $F71ROOT or /mnt/project-files/scenario/film-tegmark/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard } from './lib/stub.mjs';
import { stub71 } from './lib/stub71.mjs';
import { prepareClipFrames } from './lib/f71_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2): one chunk per station; from = the first phrase of the chunk, looked up GLOBALLY (T.G, nth = occurrence)
// seam plates (S.plateRow) at the builder boundaries: c01|c02 (n 11), c06|c07 (n 6), c11|c12 (n 1). Builders: docs/BRIEF-builders.md.
export const CHUNKS = [
  { id: 'c01', who: 'lead', name: 'Hook (ANCHOR thumbnail A, three mornings, WHICH ENDING?) · the time axis: far future → 2026, a law / a test / a government · C1 in the rearview mirror · DECIDED THIS YEAR · ENDING 12 Conquerors: the OpenAI test, the breakout into Hugging Face, the message, the switch (all twelve), Ball vs Tegmark (C2), 1 in 10,000 vs 90 %, spotted → the eye parks at door 4 → plateRow(11)', from: 'Max Tegmark wrote' },
  { id: 'c02', who: 'B1', name: 'ENDING 11 Self-Destruction: no morning, the Doomsday Clock 89 → 85 s (number line, no dial)', from: 'The next ending has no morning', plate: { start: 11 } },
  { id: 'c03', who: 'B1', name: 'ENDING 10 Zookeeper: rested, behind glass, the agent-only social network (READ ONLY)', from: 'You wake up rested' },
  { id: 'c04', who: 'B1', name: 'ENDING 9 1984: the walk to work, the cameras of Hong Kong (60,000 by 2028), the tracked chip (parks in the HUD)', from: 'You walk to work' },
  { id: 'c05', who: 'B1', name: 'ENDING 8 Descendants: the movement, C4 Tegmark (a new species), ANCHOR (turn): FROM HERE ON, YOU LIVE', from: 'Then you get Descendants' },
  { id: 'c06', who: 'B1', name: 'ENDING 7 Enslaved God: the key, the national labs (Genesis Mission) · subscribe 1 → plateRow(6)', from: 'What if the superintelligence stays', plate: { end: 6 } },
  { id: 'c07', who: 'B2', name: 'ENDING 6 Reversion: pull the plug, phone bans 24 % → 58 % of countries', from: 'And if nobody can be trusted', plate: { start: 6 } },
  { id: 'c08', who: 'B2', name: 'ENDING 5 Benevolent Dictator: sectors, the UAE: half of government work to AI agents', from: 'The Benevolent Dictator' },
  { id: 'c09', who: 'B2', name: 'ENDING 4 Gatekeeper: the ban bill, the eye returns (Hugging Face guards), the chip returns', from: "That's the Gatekeeper" },
  { id: 'c10', who: 'B2', name: 'ENDING 3 Libertarian Utopia: the rent, machines paying machines', from: 'Three endings left' },
  { id: 'c11', who: 'B2', name: 'ENDING 2 Protector God: ChatGPT age guess, EU AI Act art. 50 (switch pushed back), the reader survey → plateRow(1)', from: 'You wake up, and things just work out', plate: { end: 1 } },
  { id: 'c12', who: 'B3', name: 'ENDING 1 Egalitarian Utopia: ANCHOR the golden door opens, the morning from the start, Malta, the catch', from: 'Egalitarian Utopia', plate: { start: 1 } },
  { id: 'c13', who: 'B3', name: 'CLOSE: which ending? the open switches (C5 Altman), chips, rules, the key, C6 Tegmark, ANCHOR the five names, DECIDED THIS YEAR · subscribe 2 · end screen', from: 'So which ending are we heading for', nth: 1, plate: { endScreen: true } },
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
    if (!fs.existsSync(f)) shots = stub71(T, R, R.plate || {});
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
