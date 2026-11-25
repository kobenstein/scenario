// Film 78 "What Did Ilya See?" (thumbnail C: a man walking away from a tower of light; 601.7 s narration + 15 s end screen = 616.68 s),
// built on the editorial-night machinery (films 10 → 67). NOT one world (Jakob 24.11.): one picture per sentence on a common night stage.
// Plan: docs/MOTION.md + docs/shots.md (source: tools/shots78.py) · kit: lib/f78_kit.mjs · stage, Leitbild, seams, end screen: lib/f78_world.mjs
// · builders: docs/BRIEF-builders.md. Chunk files scenes/sc01.mjs … sc10.mjs return their entries; this file stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a planned match).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t), print }  print: F.PRINT78
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else ./audio/timing.json (the same file in the repo).
// ROOT = $F78ROOT or /mnt/project-files/scenario/film-78-ilya/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub78.mjs';
import { prepareClipFrames, prepareAssets } from './lib/f78_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G); nth = which occurrence
export const CHUNKS = [   // builder groups: Lead c01 · B1 c02–c06 · B2 c07–c10 (docs/BRIEF-builders.md)
  { id: 'c01', name: 'Hook (lead) · A1 thumbnail C: the tower, the man, WHAT DID ILYA SEE? · the chat window · he walks away · the call grid (FRI · NOV 17, 2023) · the boss tile drops: FIRED · post cards clone · ★ THE GUESS: the cards swirl into the machine ring · you · the cinema screen + marquee ARTIFICIAL · bulbs out · SWORN TESTIMONY · the ring crumbles · THE 52 PAGES · BY ILYA SUTSKEVER · ABOUT ONE MAN · the LINE: only half · the jobs · yours · the lectern → plateHook', from: 'What did Ilya see' },
  { id: 'c02', name: 'B1 · what was in the pages: the stack opens · claims about the boss · A SINGLE COLLEAGUE · RUSHED · REGRET', from: 'So what was in those pages' },
  { id: 'c03', name: 'B1 · it fell apart: the grid comes apart · five days, BACK IN CHARGE · the law-firm report (both findings) · no court ruled · OAKLAND, MAY 2026', from: 'Then it fell apart' },
  { id: 'c04', name: 'B1 · something bigger: ★ MIT quote, BEFORE | AFTER · the jobs, ALL OF IT · C2 Toronto · biological computer → digital · ONE DAY', from: 'And yet, something bigger' },
  { id: 'c05', name: 'B1 · not blindly: SSI · his life line, 4 markers · ★ 2012 error rate · the 2014 slide · the recipe card → ChatGPT · C1 NeurIPS', from: 'Not blindly' },
  { id: 'c06', name: 'B1 · the recipe runs out (marker 3 OPEN) · ★ learning from few examples · the eager 15-year-old · ★ 5–20 YEARS (C3) · forecast · age 45 · one condition → plateRecord', from: 'But on that same stage' },
  { id: 'c07', name: 'B2 · subscribe 1 (you, warm) · what do you do: the C4 quote card (intelligence explosion)', from: 'That is why this channel exists' },
  { id: 'c08', name: 'B2 · A2: he walked away (MAY 14, 2024, his own decision) · SAFE SUPERINTELLIGENCE · $32B · no product · nothing to buy', from: 'Six months after that famous Friday' },
  { id: 'c09', name: 'B2 · what he builds: a machine that cares about sentient life · the objection · C5 Dwarkesh · first systems', from: 'He wants more than a machine' },
  { id: 'c10', name: 'B2 · his advice: watch · A3 the title again · ★ BEFORE | AFTER harvested · you are listening · subscribe 2 · A4 end screen', from: 'So what do you do His advice' },
];
const ALL = CHUNKS.map((c) => c.id);

export function chunkRanges(T) {
  const a = CHUNKS.map((c, i) => (i ? T.G(c.from, c.nth ?? 0) : 0));
  return Object.fromEntries(CHUNKS.map((c, i) => [c.id, { ...c, a: i ? a[i] : 0, b: i + 1 < CHUNKS.length ? a[i + 1] : T.duration, first: i ? a[i] : T.G(c.from, c.nth ?? 0) }]));
}

const LOCAL = new URL('./audio/timing.json', import.meta.url).pathname;
export const TIMING = process.env.TIMING || (fs.existsSync(ROOT + 'audio/timing.json') ? ROOT + 'audio/timing.json' : LOCAL);
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
  film.prepare = async (t) => { await prepareAssets(); return prepareClipFrames(T, t); };   // loads the clip footage frames round t (render.mjs awaits it)
  film.ranges = RANGES;
  film.list = list;
  return film;
}
