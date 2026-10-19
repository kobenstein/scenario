// Sound plan for film 03 -> <audio>/sound_plan.json (read by audio/mix.py).
// Ambience per section (looped, under everything), a whoosh per motion transition, plus accents:
// scene entries may carry sound: [{ f, t, v, d?, loop? }] (absolute times); hand-placed accents below.
// usage: node tools/sound_plan.mjs
import fs from 'node:fs';
import { build, ROOT } from '../film.mjs';

const film = await build(), T = film.T, S = T.S;
const AMB = { '01': null, '02': ['amb_hall', .25], '03': ['amb_class', .3], '04': ['amb_lab', .35], '05': ['amb_clinic', .3], '06': ['amb_ward', .3],
  '07': ['amb_hill', .35], '08': ['amb_dawn', .4], '09': ['amb_lab', .22], '10': ['amb_dawn', .4] };
const TR = { zoom: ['whoosh', .4], out: ['whoosh', .35], push: ['whoosh', .4], left: ['whoosh', .4], right: ['whoosh', .4], up: ['whoosh_up', .45], down: ['whoosh_up', .4],
  iris: ['bloom', .45], fog: ['gust', .45], flash: ['flash', .6], page: ['pages', .5] };
const out = [];
for (const [id, a] of Object.entries(AMB)) {
  const sh = film.shots.filter((s) => s.sec === id); if (!a || !sh.length) continue;
  const t0 = sh[0].a, t1 = sh[sh.length - 1].b;
  out.push({ f: a[0], t: t0, d: t1 - t0, v: a[1], loop: 1, fade: 1.5 });
}
const sh = film.shots;
for (let i = 1; i < sh.length; i++) { const tr = TR[sh[i - 1].out?.kind]; if (tr) out.push({ f: tr[0], t: sh[i].a - .25, v: tr[1] }); }
for (const e of film.list) for (const s of e.sound || []) out.push(s);
const safe = (f) => { try { return f(); } catch { return null; } };
const acc = [
  ['multiply', () => S('01a', 'Not once'), .6], ['multiply', () => S('01a', 'A thousand'), .7], ['multiply', () => S('01a', 'A million'), .8],
  ['bulb', () => S('01a', 'every light') + .2, .6], ['amb_dc', () => S('01a', 'Somewhere'), .35, 9, 1],
  ['steps', () => S('01a', 'And almost'), .3, 4],
  ['chime', () => T.seg('10a').end + .8, .6],
];
for (const [f, tf, v, d, loop] of acc) { const t = safe(tf); if (t != null) out.push({ f, t, v, ...(d ? { d } : {}), ...(loop ? { loop: 1, fade: 1 } : {}) }); }
out.sort((p, q) => p.t - q.t);
fs.writeFileSync(ROOT + 'audio/sound_plan.json', JSON.stringify(out, null, 1));
console.log(out.length, 'sound events');
