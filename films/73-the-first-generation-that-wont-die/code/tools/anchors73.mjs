// Film 73 · check that every phrase anchor of the plan still exists in the timing (after a new vo-vN / the real VO):
// chunk starts (film.mjs CHUNKS), the seam plate phrases, the clip slots, the shot-list anchors (data/anchors73.json, written by
// tools/shots73.py) and every built scene file (its default export runs, so all its T.G calls are checked).
//   node tools/anchors73.mjs [timing.json]
import { timing } from '../lib/kit.mjs';
import { CHUNKS, TIMING, chunkRanges } from '../film.mjs';
import fs from 'node:fs';
const T = timing(process.argv[2] || TIMING); let bad = 0;
const ok = (what, f) => { try { const v = f(); console.log('ok  ', what, typeof v === 'number' ? v.toFixed(2) : ''); } catch (e) { bad++; console.log('MISS', what, '·', e.message.split('\n')[0]); } };
for (const c of CHUNKS.slice(1)) ok(`${c.id} '${c.from}'`, () => T.G(c.from, c.nth ?? 0));
for (const p of ['The date comes from', 'Which brings back', 'And at the very top']) ok(`seam plate '${p}'`, () => T.G(p));
for (const id of ['C1', 'C3', 'C4']) ok(`clip ${id}`, () => { const c = T.clip(id); if (!c) throw new Error('no slot'); return c.start; });
const SH = new URL('../data/anchors73.json', import.meta.url);
if (fs.existsSync(SH)) for (const [id, ph] of JSON.parse(fs.readFileSync(SH, 'utf8'))) ok(`shot ${id} '${ph}'`, () => T.G(ph));
const R = chunkRanges(T);
for (const c of CHUNKS) {
  const f = new URL(`../scenes/sc${c.id.slice(1)}.mjs`, import.meta.url); if (!fs.existsSync(f)) continue;
  try { const m = await import(f.href); const e = await m.default(T, R[c.id]); console.log('ok  ', `scene ${c.id}`, `${e.length} entries`); } catch (e) { bad++; console.log('MISS', `scene ${c.id}`, '·', e.message.split('\n')[0]); }
}
console.log(bad ? `${bad} missing anchors` : 'all anchors found'); process.exit(bad ? 1 : 0);
