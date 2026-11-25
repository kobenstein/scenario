// Film 75 · check that every phrase anchor of the plan exists in the timing (after a new VO / timing.json):
// chunk starts (film.mjs CHUNKS), THE CLOCKS (F.CLOCK phrases), the seam plates, the clip slots, and every built scene file (its default export runs).
//   node tools/anchors75.mjs [timing.json]
import { timing } from '../lib/kit.mjs';
import { CHUNKS, TIMING, chunkRanges } from '../film.mjs';
import * as F from '../lib/f75_kit.mjs';
import fs from 'node:fs';
const file = process.argv[2] || TIMING, T = timing(file); let bad = 0;
console.log('timing', file, T.duration);
const ok = (what, f) => { try { const v = f(); console.log('ok  ', what, typeof v === 'number' ? v.toFixed(2) : ''); } catch (e) { bad++; console.log('MISS', what, '·', e.message.split('\n')[0]); } };
for (const c of CHUNKS.slice(1)) ok(`${c.id} '${c.from}'`, () => T.G(c.from, c.nth ?? 0));
const ct = () => F.clockTimes(T);
ok('clock hud', () => ct().hud); ok('clock rulesSet', () => ct().rulesSet); ok('clock youSet', () => ct().youSet); ok('clock youFaster', () => ct().youFaster);
F.CLOCK.breaths.forEach((p, i) => ok(`clock breath ${i} '${p}'`, () => ct().breaths[i]));
F.CLOCK.ruleTicks.forEach((p, i) => ok(`clock ruleTick ${i} '${p}'`, () => ct().ruleTicks[i]));
ok('clock gap', () => ct().gap[1]);
for (const p of ['To see what it is', 'This channel exists', 'Then you notice more']) ok(`seam '${p}'`, () => T.G(p));
for (const id of F.CLOCK.clips) ok(`clip ${id}`, () => { const c = T.clip(id); if (!c) throw new Error('no slot'); return c.start; });
const R = chunkRanges(T);
for (const c of CHUNKS) {
  const f = new URL(`../scenes/sc${c.id.slice(1)}.mjs`, import.meta.url); if (!fs.existsSync(f)) continue;
  try { const m = await import(f.href); const e = await m.default(T, R[c.id]); console.log('ok  ', `scene ${c.id}`, `${e.length} entries`); } catch (e) { bad++; console.log('MISS', `scene ${c.id}`, '·', e.message.split('\n')[0]); }
}
console.log(bad ? `${bad} missing anchors` : 'all anchors found'); process.exit(bad ? 1 : 0);
