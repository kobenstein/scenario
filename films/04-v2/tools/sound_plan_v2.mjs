// Sound plan for Film 4 v2 -> <out> (read by audio/mix.py).
// 1) every accent the scenes carry (entries: sound: [{ f, t, v, d?, loop? }], absolute times),
// 2) a soft airy whoosh into every handoff plate (the camera flies into a surface), unless a scene already put a sound there,
// 3) one ambience bed per world (AMB below, looped, faded), under everything.
// usage: node tools/sound_plan_v2.mjs <out.json>
import fs from 'node:fs';
import { build } from '../film.mjs';
import { HAND, hand } from '../lib/handoff4.mjs';

const film = await build(), T = film.T, R = film.ranges;
const out = [];
for (const e of film.list) for (const s of e.sound || []) out.push(s);
const near = (t, w) => out.some((s) => !s.loop && Math.abs(s.t - t) < w);
for (const key of Object.keys(HAND)) {
  const Hd = hand(key, T, R);
  if (!near(Hd.a, .45)) out.push({ f: Hd.kind === 'light' ? 'bloom' : 'whoosh_airy', t: Hd.a - .3, v: Hd.kind === 'light' ? .3 : .2 });
}
// ambience per world: [chunk, file, gain, from, to] in seconds after the chunk's start R.a; to = null: until the chunk's end R.b
// (provisional; tuned to the worlds the builders report)
const AMB = [
  ['c01', 'hall', .5, 0, 11.5], ['c01', 'dawn_birds', .45, 11.5, null], ['c04', 'dawn_birds', .5, 9.9, null],
  ['c05', 'city_street', .35, 0, 20], ['c05', 'harbour', .4, 20, null],
  ['c06', 'city_night_hill', .4, 0, null],
  ['c07', 'hall', .45, 0, 13.5], ['c07', 'dawn', .35, 13.5, 25.4], ['c07', 'snow', .3, 25.4, 27.6], ['c07', 'dawn', .25, 27.6, null],
  ['c08', 'hall', .35, 0, 28], ['c08', 'city_night_hill', .3, 28, null],
  ['c09', 'nightsky', .4, 0, null],
  ['c10', 'harbour', .4, 0, 20], ['c10', 'city_street', .35, 20, null],
  ['c11', 'city_night_hill', .35, 0, null],
  ['c12', 'bazaar', .3, 4.4, 6.7], ['c12', 'nightsky', .35, 6.7, 20.4], ['c12', 'city_night_hill', .3, 20.4, null],
  ['c13', 'river', .45, 0, null],
  ['c14', 'nightsky', .4, 0, 6], ['c14', 'hill', .35, 6, null],
  ['c15', 'mountain', .35, 0, 9], ['c15', 'nightsky', .35, 9, null],
  ['c16', 'nightsky', .35, 0, 14.5], ['c16', 'ward', .25, 14.5, 28.4], ['c16', 'nightsky', .35, 28.4, null],
  ['c17', 'nightsky', .45, 0, null],
  ['c18', 'dawn_birds', .45, 0, null],
];
for (const [id, f, v, a, b] of AMB) {
  const r = R[id]; if (!r) continue;
  const t0 = Math.max(0, r.a + a - .5), t1 = Math.min(T.duration, b == null ? r.b + .8 : r.a + b + .8);
  if (t1 - t0 > 1) out.push({ f, t: t0, d: t1 - t0, v, loop: 1, fade: 1.5 });
}
out.sort((p, q) => p.t - q.t);
const dst = process.argv[2] || '/tmp/claude-0/mix/audio/sound_plan.json';
// every named sound must exist next to the plan (audio/sfx/<f>.mp3, read by mix.py): fetch it from the libraries, else drop it loudly
const SFX = dst.replace(/[^/]*$/, 'sfx/'), LIBS = ['/mnt/project-files/scenario/sfx-bibliothek/akzent/', '/mnt/project-files/scenario/sfx-bibliothek/atmo/', '/mnt/project-files/scenario/film-04-work/audio/sfx/'];
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
