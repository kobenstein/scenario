// Film 63 · check that every phrase anchor of the plan still exists in the timing (after a new vo-vN / the real VO):
// chunk starts (film.mjs CHUNKS), the clip slots, the seam plates, and every built scene file (its default export runs).
//   node tools/anchors63.mjs [timing.json]
import { timing } from '../lib/kit.mjs';
import { CHUNKS, TIMING, chunkRanges } from '../film.mjs';
import { SEAMS } from '../lib/f63_seams.mjs';
import fs from 'node:fs';
const T = timing(process.argv[2] || TIMING); let bad = 0;
const ok = (what, f) => { try { const v = f(); console.log('ok  ', what, typeof v === 'number' ? v.toFixed(2) : ''); } catch (e) { bad++; console.log('MISS', what, '·', e.message.split('\n')[0]); } };
for (const c of CHUNKS.slice(1)) ok(`${c.id} '${c.from}'`, () => T.G(c.from, c.nth ?? 0));
for (const [k, p] of Object.entries(SEAMS)) ok(`seam ${k} '${p}'`, () => T.G(p));
for (const id of ['C1', 'C3', 'C4', 'C5']) ok(`clip ${id}`, () => { const c = T.clip(id); if (!c) throw new Error('no slot'); return c.start; });
const R = chunkRanges(T);
for (const c of CHUNKS) {
  const f = new URL(`../scenes/sc${c.id.slice(1)}.mjs`, import.meta.url); if (!fs.existsSync(f)) continue;
  try { const m = await import(f.href); await m.default(T, R[c.id]); console.log('ok  ', `scene ${c.id}`); } catch (e) { bad++; console.log('MISS', `scene ${c.id}`, '·', e.message.split('\n')[0]); }
}
console.log(bad ? `${bad} missing anchors` : 'all anchors found'); process.exit(bad ? 1 : 0);
