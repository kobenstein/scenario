// Film 74 "Your Life in 2050 If We Get AI Right" · one master timeline of SHOTS (scenes/c01.mjs … c10.mjs), each anchored on a row of
// docs/shots.md (row id → sentence → its time in the VO). Plan: docs/MOTION.md + docs/shots.md (tools/shots74.py) · kit: lib/f74_kit.mjs.
// A shot = { id (its first row), draw(ctx, t, s), out: carrier into the next shot { k: 'portal'|'iris'|'sweep'|'cut', … }, lead, dur }.
// The carrier runs from (next.a - lead) for dur seconds; both shots are drawn live (no frozen frames, no crossfades).
// Timing: $TIMING, else <ROOT>audio/timing.json (real VO), else data/provisional_timing.json. Anchors are row ids and phrases, never seconds.
import fs from 'node:fs';
import { Film, W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish } from './lib/f10_editorial.mjs';
import * as K from './lib/f74_kit.mjs';
import { hudState } from './scenes/hud.mjs';
import { prepareClipFrames } from './scenes/clips.mjs';
export { ROOT };
const HERE = new URL('.', import.meta.url).pathname;
const PROVISIONAL = HERE + 'data/provisional_timing.json';
export const TIMING = process.env.TIMING || (fs.existsSync(ROOT + 'audio/timing.json') ? ROOT + 'audio/timing.json' : PROVISIONAL);
export const CHUNKS = ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10'];
const ROWS = JSON.parse(fs.readFileSync(HERE + 'data/rows.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
// row id → start time (sequential search like tools/shots74.py, so repeated phrases resolve in film order)
export function rowTimes(T) {
  const ws = T.words, out = {}; let after = -1;
  for (const r of ROWS) {
    const c = T.clip(r.id);
    if (c) { out[r.id] = c.start; after = c.end; continue; }
    if (r.id === 'END') { out[r.id] = T.duration - 15; continue; }
    const q = r.phrase.split(/\s+/).map(norm); let hit = null;
    for (let i = 0; i + q.length <= ws.length && hit == null; i++) {
      if (ws[i].s < after - 1e-3) continue;
      if (q.every((p, j) => (j < q.length - 1 ? norm(ws[i + j].w) === p : norm(ws[i + j].w).startsWith(p)))) hit = ws[i].s;
    }
    if (hit == null) throw new Error(`row ${r.id}: phrase not found "${r.phrase}" after ${after.toFixed(2)}`);
    out[r.id] = hit; after = hit;
  }
  return out;
}
export function cameraFloat(t) {   // the camera never stops: a slow breath over the whole picture
  const z = 1.012 + .003 * Math.sin(t * .19 + .7), m = (z - 1) / 2 * .6;
  return { z, x: Math.max(-1, Math.min(1, drift(t * .6, 1, 11))) * W * m, y: Math.max(-1, Math.min(1, drift(t * .6, 1, 23))) * H * m, r: 0 };
}
export async function build({ timingFile = TIMING } = {}) {
  const T = timing(timingFile);
  if (T.provisional) console.warn(`[film] PROVISIONAL timing (${timingFile})`);
  const R = rowTimes(T);
  const want = process.env.SECS ? process.env.SECS.split(',').map((s) => (/^\d+$/.test(s) ? 'c' + s.padStart(2, '0') : s)) : CHUNKS;
  let shots = [];
  for (const id of CHUNKS) {
    const f = new URL(`./scenes/${id}.mjs`, import.meta.url);
    if (!fs.existsSync(f)) continue;
    const mod = await import(f.href);
    for (const s of await mod.default(T, R)) shots.push({ ...s, chunk: id });
  }
  for (const s of shots) { if (R[s.id] == null) throw new Error('unknown row ' + s.id); s.a = s.id === 'H.01' ? 0 : R[s.id]; }
  shots.sort((p, q) => p.a - q.a);
  shots.forEach((s, i) => { s.b = shots[i + 1] ? shots[i + 1].a : T.duration; s.next = shots[i + 1] || null; s.i = i; });
  const helpers = (s) => ({ a: s.a, b: s.b, r: (id) => R[id], w: (ph, nth = 0) => T.G(ph, nth, s.a - 1.5), we: (ph, nth = 0) => T.GE(ph, nth, s.a - 1.5), T, R });
  for (const s of shots) s.h = helpers(s);
  const draw1 = (ctx, s, t) => s.draw(ctx, t, s.h);
  // which chunks to render (SECS): limit the time range (render.mjs --from/--to stay the authority)
  const live = new Set(want);
  function master(ctx, t) {
    let i = shots.findIndex((s) => t >= s.a && t < s.b); if (i < 0) i = t < 0 ? 0 : shots.length - 1;
    let s = shots[i];
    // inside the carrier window of the previous shot? (the carrier starts before the next row, so check the shot after too)
    const n = s.next;
    const tr = (A, B, t) => { const o = A.out || { k: 'cut' }, lead = o.lead ?? .4, dur = o.dur ?? .9, t0 = B.a - lead; return t >= t0 && t < t0 + dur && o.k !== 'cut' ? { o, u: (t - t0) / dur } : null; };
    let X = n && tr(s, n, t), A = s, B = n;
    if (!X && i > 0) { const p = shots[i - 1]; const Y = tr(p, s, t); if (Y) { X = Y; A = p; B = s; } }
    if (!X) { draw1(ctx, s, t); return s; }
    const dA = (c) => draw1(c, A, t), dB = (c) => draw1(c, B, t), o = X.o;
    const val = (v) => (typeof v === 'function' ? v(t, A.h) : v);   // rects/centres may be computed from shot A at this frame
    if (o.k === 'portal') K.portal(ctx, X.u, val(o.win), dA, dB, o);
    else if (o.k === 'iris') K.iris(ctx, X.u, val(o.c), dA, dB, o);
    else if (o.k === 'sweep') K.sweep(ctx, X.u, dA, dB, o);
    else if (o.k === 'fn') o.fn(ctx, X.u, dA, dB, t);
    else draw1(ctx, X.u < .5 ? A : B, t);
    return B;
  }
  const film = new Film([{ a: 0, b: T.duration, draw: (ctx, t) => {
    master(ctx, t);
    K.hud(ctx, t, hudState(T, R, t));
  }, print: K.PRINT74 }], { finish: (ctx, t, o) => edFinish(ctx, t, K.PRINT74), float: cameraFloat });
  film.T = T; film.R = R; film.list = shots; film.live = live;
  film.prepare = async (t) => prepareClipFrames(T, t);
  return film;
}
