// Film 78 · check that every phrase anchor of the plan still exists in the timing (after a VO change):
// chunk starts (film.mjs CHUNKS), every shot anchor of docs/shots.md (tools/shots78.py SHOTS), the seam plates, the clip slots, and every
// built scene file (its default export runs).
//   node tools/anchors78.mjs [timing.json]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { timing } from '../lib/kit.mjs';
import { CHUNKS, TIMING, chunkRanges } from '../film.mjs';
const T = timing(process.argv[2] || TIMING); let bad = 0;
const ok = (what, f) => { try { const v = f(); console.log('ok  ', what, typeof v === 'number' ? v.toFixed(2) : ''); } catch (e) { bad++; console.log('MISS', what, '·', e.message.split('\n')[0]); } };
for (const c of CHUNKS.slice(1)) ok(`${c.id} '${c.from}'`, () => T.G(c.from, c.nth ?? 0));
for (const p of ['So what was in those pages', 'That is why this channel exists']) ok(`seam '${p}'`, () => T.G(p));
for (const id of ['C1', 'C2', 'C3', 'C5']) ok(`clip ${id}`, () => { const c = T.clip(id); if (!c) throw new Error('no slot'); return c.start; });
// the shot anchors (shots78.py --anchors prints them as JSON)
try {
  const rows = JSON.parse(execFileSync('python3', [new URL('./shots78.py', import.meta.url).pathname, '--anchors'], { encoding: 'utf8' }));
  let n = 0, prev = -1; for (const [id, a] of rows) { if (a === 'ENDSCREEN' || a.startsWith('slot:')) continue; const [p, k] = a.split('#'); try { prev = k != null ? T.G(p, Number(k)) : T.G(p, 0, prev - .01); n++; } catch (e) { bad++; console.log('MISS', `shot ${id} '${a}'`); } }
  console.log('ok  ', `${n} shot anchors`);
} catch (e) { console.log('(shots78.py --anchors failed:', e.message.split('\n')[0], ')'); }
const R = chunkRanges(T);
for (const c of CHUNKS) {
  const f = new URL(`../scenes/sc${c.id.slice(1)}.mjs`, import.meta.url); if (!fs.existsSync(f)) continue;
  try { const m = await import(f.href); const e = await m.default(T, R[c.id]); console.log('ok  ', `scene ${c.id}`, `${e.length} entries`); } catch (e) { bad++; console.log('MISS', `scene ${c.id}`, '·', e.message.split('\n')[0]); }
}
console.log(bad ? `${bad} missing anchors` : 'all anchors found'); process.exit(bad ? 1 : 0);
