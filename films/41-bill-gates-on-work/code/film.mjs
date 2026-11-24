// Film 41 "Bill Gates Changed His Mind About AI and Jobs" (thumbnail A: GATES CHANGED HIS MIND ON AI; ~10:28 narration + 15 s end screen),
// built on the editorial-night machinery (films 10 → 67), as a MOTION-DESIGN film (REGELN §13): one designed graphic per sentence on the
// stage, a few recurring scenes as anchors (lib/f41_world.mjs), explainer share 60–70 %.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots41.py) · kit: lib/f41_kit.mjs · scenes + seams: lib/f41_world.mjs · builders: docs/BRIEF-builders.md.
// Chunk files scenes/sc01.mjs … sc10.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a planned match).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT41
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json (tools/provisional_timing.py from vo-v4.txt).
// ROOT = $F41ROOT or /mnt/project-files/scenario/film-bill-gates/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames, prepareAssets } from './lib/f41_kit.mjs';
import { stub41 } from './lib/stub41.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md · shots: docs/shots.md
  { id: 'c01', name: 'Hook (lead): the hand turns its thumb (thumbnail A) · 2023 manageable → FAR FEWER JOBS · the job field, the cold ripple · screen / hand · your window · crazy / insane on the glass · the silence lanes · the switch stays ON · ★ the gold thread sets work aside · the list HUMAN RESERVED · your tile on / off · unwritten · C1 (FT Live) → plateMachine', from: 'Bill Gates changed his mind' },
  { id: 'c02', name: 'His picture of the machine: disc vs person · exceeds human intelligence · the stepping stones · ★ the machine can follow · the sky again · convinced (quote) · the portrait print (ONCE) · the timeline is born (three stops, NOW)', from: 'What changed is his picture' },
  { id: 'c03', name: 'Stop 1, the screen: night office, PHONE SALES · PHONE SUPPORT · ACCOUNTING · cheaper/faster/more accurate · the bus stop NOW · ★ −19 % chart · you at the stop · alongside · how it is used · good news for hands', from: 'For Gates, the first work' },
  { id: 'c04', name: 'Stop 2, the hands: the usual comfort · phone vs bricks/harvest · 2–8 years · ★ the site and the field · C2 (Decoder) · houses/food/hands · IF WE DON\'T CHOOSE · a decision · build/buy/switch on · how fast / where · IS HE RIGHT? · who is talking (Microsoft, profits, rules) → plateNumbers', from: "That's the usual comfort" },
  { id: 'c05', name: 'The numbers: the chart corner · Yale (whole market) · forecast vs finding · the verdict card (plausible · measurable · open) · the hand behind · no date · SUBSCRIBE 1 (your window)', from: 'Then the numbers' },
  { id: 'c06', name: 'Stop 3: ★ the dot stretches into 20 YEARS · C3 (Decoder) · winners and losers · your working life · the plan · FAR FEWER JOBS* without the right policies · the tax scale (wage taxed, robot written off)', from: 'That leaves the last stop' },
  { id: 'c07', name: 'His fix: tax by usage · retraining + stronger safety net · Etzioni · the typewriter · the counter and the empty chair · ★ being needed (your desk) · the list: Human Reserved quote, CHILD CARE · JURY · ART · TEACHING → plateJury', from: 'His fix' },
  { id: 'c08', name: 'The jury: ★ you before twelve chairs · the cyan scale · the chairs fill · a rule · the tower of 100 windows · 40 % ceiling · maybe yours · quote card K1 (GatesNotes) · three open questions · hard to draw / lobbying · not well paid · unwritten, hard, short', from: 'Take the jury' },
  { id: 'c09', name: 'Who decides now: ★ the price line over the tower · left over · your window · the best deal, so far · cost vs why · try a line yourself · the missing reason', from: 'Ask who decides' },
  { id: 'c10', name: 'The far end: ★ abundance (dawn land) · cheaper homes/food · one task stays · organize, purpose · the list in the ring · filled by price · silence · every line open · the core line (the sky again) · SUBSCRIBE 2 · end screen', from: 'Now look past those twenty' },
];
// the seam plates of the chunks a builder has not built yet (so the stub film already holds its seams): lib/f41_world.mjs
const STUB_SEAMS = { c02: { start: 'plateMachine' }, c04: { end: 'plateNumbers' }, c05: { start: 'plateNumbers' }, c07: { end: 'plateJury' }, c08: { start: 'plateJury' }, c10: { endScreen: true } };
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
    if (!fs.existsSync(f)) shots = stub41(T, R, STUB_SEAMS[id]);
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
  film.prepare = async (t) => { await prepareAssets(); return prepareClipFrames(T, t); };   // loads the clip footage frames round t (render.mjs awaits it)
  film.ranges = RANGES;
  film.list = list;
  return film;
}
