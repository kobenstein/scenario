// Sound plan for Film 7 -> <out> (read by audio/mix.py). Ambience beds come from <audio>/ambience.json: [[chunk, file, gain, from, to], …] (seconds after the chunk start; to null = chunk end).
// 1) every accent the scenes carry (entries: sound: [{ f, t, v, d?, loop? }], absolute times),
// 2) a soft airy whoosh into every handoff plate (the camera flies into a surface), unless a scene already put a sound there,
// 3) one ambience bed per world (AMB below, looped, faded), under everything.
// usage: node tools/sound_plan_v2.mjs <out.json>
import fs from 'node:fs';
import { build } from '../film.mjs';
import { HAND, hand } from '../lib/handoff4.mjs';
import { ROOT } from '../lib/kit.mjs';

const film = await build(), T = film.T, R = film.ranges;
const out = [];
for (const e of film.list) for (const s of e.sound || []) out.push(s);
const near = (t, w) => out.some((s) => !s.loop && Math.abs(s.t - t) < w);
for (const key of Object.keys(HAND)) {
  let Hd; try { Hd = hand(key, T, R); } catch { continue; } if (!Hd || !isFinite(Hd.a)) continue;
  if (!near(Hd.a, .45)) out.push({ f: Hd.kind === 'light' ? 'bloom' : 'whoosh_airy', t: Hd.a - .3, v: Hd.kind === 'light' ? .3 : .2 });
}
// ambience per world: [chunk, file, gain, from, to] in seconds after the chunk's start R.a; to = null: until the chunk's end R.b
// (provisional; tuned to the worlds the builders report)
const AMB = fs.existsSync(ROOT + 'audio/ambience.json') ? JSON.parse(fs.readFileSync(ROOT + 'audio/ambience.json', 'utf8')) : [];
for (const [id, f, v, a, b] of AMB) {
  const r = R[id]; if (!r) continue;
  const t0 = Math.max(0, r.a + a - .5), t1 = Math.min(T.duration, b == null ? r.b + .8 : r.a + b + .8);
  if (t1 - t0 > 1) out.push({ f, t: t0, d: t1 - t0, v, loop: 1, fade: 1.5 });
}
out.sort((p, q) => p.t - q.t);
const dst = process.argv[2] || (ROOT + 'audio/sound_plan.json');
// every named sound must exist next to the plan (audio/sfx/<f>.mp3, read by mix.py): fetch it from the libraries, else drop it loudly
const SFX = dst.replace(/[^/]*$/, 'sfx/'), LIBS = ['/mnt/project-files/scenario/sfx-bibliothek/akzent/', '/mnt/project-files/scenario/sfx-bibliothek/atmo/', '/mnt/project-files/scenario/film-05-share/audio/sfx/', '/mnt/project-files/scenario/film-04-v2/audio/sfx/', ROOT + 'audio/sfx-new/'];
fs.mkdirSync(SFX, { recursive: true });
const missing = new Set();
for (const f of new Set(out.map((o) => o.f))) {
  if (fs.existsSync(SFX + f + '.mp3')) continue;
  const src = LIBS.map((d) => d + f + '.mp3').find((p) => fs.existsSync(p));
  if (src) fs.copyFileSync(src, SFX + f + '.mp3'); else missing.add(f);
}
if (missing.size) console.log('[sound] no file for', [...missing].join(' '), '(dropped)');
for (let i = out.length - 1; i >= 0; i--) if (missing.has(out[i].f)) out.splice(i, 1);
fs.writeFileSync(dst, JSON.stringify(out, null, 1));
console.log(out.length, 'sound events ->', dst, '|', [...new Set(out.map((o) => o.f))].join(' '));
