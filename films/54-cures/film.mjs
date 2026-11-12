// Film 54 "AI Just Gave Disease a 10-Year Deadline" (~10 min narration + 7 s quiet walk + 15 s end screen), built on the Film 10/13/16/24/25/28
// editorial-night machinery. ONE world: THE HALL OF RELICS (lib/f54_seams.mjs), a museum at night in the grandkids' future.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots54.py) · kit: lib/f54_kit.mjs · hall + seams: lib/f54_seams.mjs · builders: docs/BRIEF-builders.md.
// Thirteen chunk files scenes/sc01.mjs … sc13.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a
// planned match on a carrier). Any other tr is turned into 'cut' with a warning. Missing chunks render as stubs.
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), tr, d, print }  print: { grain, floor, vig } for the editorial finish (F.PRINT54)
// SECS=c01,c02 node render.mjs --snap ...   builds only those chunks (absolute times stay the same).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO, written by the audio agent), else data/provisional_timing.json
// (tools/provisional_timing.py, from the newest vo-vN.txt; a warning is printed). ROOT = $F54ROOT or /mnt/project-files/scenario/film-heilung/.
// ANCHORS ARE PHRASES ONLY (the fact-checked vo-v3 changes words, not these openers). If one goes missing, T.G throws with the phrase.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f54_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film, for repeated sentences) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', name: 'Hook · thumbnail A (vitrine 1, the cell, DEADLINE: 2036) · the doctor\'s office diorama, four word cards · the grandkids, the plague · four words ? · machines fast, body slow · TWO DATES · four labels, weeks … decades · C1 wall text · the roadshow frame · NOT INVESTMENT ADVICE', from: 'Artificial intelligence just gave' },
  { id: 'c02', name: 'The essay on the lectern, the magnifier (unreadable) · two trial lanes (barely works vs works) · the kiosk → C3 · NOT INSTANT stays in mint', from: "He didn't invent it" },
  { id: 'c03', name: 'The mint line becomes the DEADLINE: 2036 board · four diseases, one question · CANCER lights · into vitrine 1: the lab, the hook cells, one AI-proposed design (≈ 10× more receptors) · ALL STILL IN THE LAB', from: "Less than a decade that's" },
  { id: 'c04', name: 'The scan: weeks · 55 patients, many cancers · more than a hundred · the small print most cancer · the sales line just cancer · board ✓ MANY KINDS · but is fast the whole answer?', from: 'Then the body answers' },
  { id: 'c05', name: 'Vitrine 2: heart twice · the infusion, the liver gene, LDL halved · DNA for life: 15 years · the stadium ★ · board ½ · subscribe 1 (the lit doorway, QR corner quiet) → plateMind', from: 'Heart disease answers twice' },
  { id: 'c06', name: 'Vitrine 3: the mind answers fast but faint · sugar pill · half the trials · no blood test, a questionnaire · the essay: most mental illness · board ? · the fourth disease', from: 'The third disease answers fast' },
  { id: 'c07', name: "Vitrine 4: Alzheimer's · twenty years before the first forgotten name · traces today · following healthy people · the failed trial · small print: difficult to reverse · board ✗", from: 'The changes in the brain' },
  { id: 'c08', name: 'The race starts now: the blood test · why a date? · the sales pitch rewards a date · the audio-guide post → C5 (audio only) · THE TESTING, NOT THE FINDING · the pipeline', from: "But the race doesn't start" },
  { id: 'c09', name: 'Topol: wildly off-base · Amodei: actually curing cancer · his company\'s medicine: idea → mice < 18 months · human trials late 2028 · first date fast, second years away → plateKiosk', from: 'The cardiologist' },
  { id: 'c10', name: 'The kiosk → C2 (the pipeline jams) · DISCOVERY SPEEDS UP, PROOF JAMS · can proof come sooner? · it can: the study clinic, the blood test, the trial', from: 'He even warned of a jam' },
  { id: 'c11', name: 'Digital twins (a smaller sugar-pill group) · the FDA assistant: one or two months · rules for medicines that clearly work · but remember the heart · C1b wall text', from: 'In other trials' },
  { id: 'c12', name: 'The second date is the real deadline · people set it: clinics, scientists, lawmakers · does the deadline hold? the board big · the grandkids ★', from: 'If the machines make' },
  { id: 'c13', name: 'Investors price the first date · subscribe 2 (QR corner quiet) · the quiet walk · 15 s end screen (the hall, four plinths)', from: 'Investors are already' },
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
