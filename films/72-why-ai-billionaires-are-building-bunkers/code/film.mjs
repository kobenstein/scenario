// Film 72 "Why AI Billionaires Are Building Bunkers" (thumbnail A2: the valley full of lanterns, the round hatch half open, "AI BILLIONAIRES /
// FEAR YOU"; ~10:00 narration + 4 clips + 15 s end screen), built on the editorial-night machinery (films 10 → 73). NOT one world (REGELN
// §13): a motion-design film of explainer sequences on THE GROUND LINE (lib/f72_stage.mjs) + scenes; every picture shows exactly its
// sentence. The Leitbild (THE VALLEY, lib/f72_world.mjs) only at 3 anchors. Plan: docs/MOTION.md + docs/shots.md (source: tools/shots72.py)
// · kit: lib/f72_kit.mjs · builders: docs/BRIEF-builders.md. Chunk files scenes/sc01.mjs … sc13.mjs return their entries; this file
// stitches them into one timeline.
// NO BLENDS: every entry boundary is a hard 'cut' between two frames the builders make identical (one continuous take or a planned match).
//   export default (T, R) => [ entry, … ]       T = timing helpers (lib/kit.mjs: T.G / T.GE global phrase anchors, T.clip(id)), R = { a, b, id, name, first }
//   entry = { t, draw(ctx, t, s), print }  print: F.PRINT72
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json (tools/provisional_timing.py from the newest vo-vN.txt).
// ROOT = $F72ROOT or /mnt/project-files/scenario/film-bunker/. ANCHORS ARE PHRASES ONLY (T.G throws with the phrase if one goes missing).
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import { errorCard, stubChunk } from './lib/stub.mjs';
import { prepareClipFrames } from './lib/f72_kit.mjs';

export { ROOT };
// chunk table (docs/shots.md §2); from = the first phrase of the chunk, looked up GLOBALLY in the film (T.G), so any VO segmentation works
export const CHUNKS = [   // from = first phrase of the chunk (nth = which occurrence in the film) · builder groups: docs/BRIEF-builders.md
  { id: 'c01', grp: 'Lead', name: 'Hook · ANCHOR 1 the valley (hatch + lantern crowd) + title · the slope flattens into THE GROUND LINE · the glass room, the AI disc UP CLOSE / THE REST OF US · your job, daily life, children · the hatch, UNDERGROUND, the concrete door, ONLY FOR A FEW · back to the valley · THE LIST rises · the room of researchers · ★ Sutskever quote · AGI · the disc writes row 2 · NO DOOR STOPS IT → plateList', from: 'The people building artificial' },
  { id: 'c02', grp: 'B1', name: 'Three suspects: rows 1–3 write, row 4 redacted (IN THE FLOOR PLANS) · THE BOMB: the concrete door is real · Hawaii, Koolau Ranch (W) · bigger than most houses · for storms · Zuckerberg quote · fair enough', from: 'There are three obvious suspects' },
  { id: 'c03', grp: 'B1', name: 'Theo Von asks Altman: the studio lamp → C1 → BOMBS. NOT AI · the sellers: war, pandemics · row 1 REAL, BUT OLD · ★ something new: … AND EVEN ARTIFICIAL INTELLIGENCE · is it the machine? (row 2 big)', from: 'Last year, the comedian' },
  { id: 'c04', grp: 'B1', name: 'THE MACHINE: AI in real cyberattacks (safety report) · the one they race to build · thought experiment: a storm / fallout / a war pass · ★ the machine does not pass · the door has to open · if it turns out well, nobody needs one · Altman 2023 quote', from: 'It would make sense' },
  { id: 'c05', grp: 'B1', name: 'Sutskever: ★ OPTIONAL · Wendy Hall: near or far · build it right: OUT HERE, NOT DOWN THERE · row 2 CROSSED OFF · still building · Harris C2 → RIGHT NOW · good for what? → plateBunker', from: 'And that bunker from the beginning' },
  { id: 'c06', grp: 'B2', name: 'THE CHAOS: the sellers · ★ the supply clock (weeks, months, years; makers\' claims) · every bunker is a clock · a major AI incident: banks, internet, power · ★ the FAA ground stop (a faulty router) · row 3 STAYS · FOR A WHILE · fuel, filters, people · who do they answer to?', from: 'Ask the people who sell them' },
  { id: 'c07', grp: 'B2', name: 'Rushkoff 2017: the resort, five investors at a table lamp · C3 → ONCE MONEY IS WORTHLESS · "THE EVENT" · the angry mobs · why would the guards obey? · the three ideas (locks, collars, robots as guards: words only) · eye-roll · his account, investors not builders', from: 'Some years ago' },
  { id: 'c08', grp: 'B2', name: 'Today: ★ floor plans: ANTI-MUTINY · DETENTION AREAS · the "day after" drills · public and politicians · Gallup 71 % vs 53 % · to be fair: insurance, a hobby · the owners say storms and bombs · practice, not a prediction → plateBoard', from: 'But look at what gets planned' },
  { id: 'c09', grp: 'B3', name: '★ follow the trail: GUARDS · LOCKS · MUTINY PLANS, none stops a storm / a bomb / a machine → BUILT AGAINST PEOPLE · ANCHOR 2 (turn): row 4 US, circled · the gains → a few · you, not a threat · the view from inside the hatch · what would make it unnecessary?', from: 'But follow the trail' },
  { id: 'c10', grp: 'B3', name: 'Subscribe 1 (a tag on the line, both sides of the door) · the answer they rolled their eyes at: like friends · invest in people (Rushkoff quote) · a world nobody wants to storm', from: 'This channel exists' },
  { id: 'c11', grp: 'B3', name: 'Switzerland: a place for every resident (since 1963) · ★ more places than people · wine cellars, party rooms · Helsinki: playgrounds, pools · a hiding place vs a society · built against people: someone stays outside', from: 'One country has built' },
  { id: 'c12', grp: 'B3', name: 'An open argument · Harris C2b (don\'t build bunkers, write laws) · ★ S. 5518: at least 75 % · 26 weeks · Microsoft\'s promise · NOT PASSED / VOLUNTARY · not built yet: lawmakers, companies, voters', from: 'So a world nobody wants' },
  { id: 'c13', grp: 'B3', name: 'ANCHOR 3 (end): back to the hatch · the reason: not the machine, the fear of everyone outside · a few win everything isn\'t safe · ★ the lanterns become the lights of the Earth at night · subscribe 2 · end screen', from: 'So go back to that door' },
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
