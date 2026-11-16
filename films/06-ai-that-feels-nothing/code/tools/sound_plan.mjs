// Sound plan for film 05 -> <audio>/sound_plan.json (read by audio/mix.py).
// Ambience per section (looped, under everything), a soft whoosh per motion transition, accents from the scenes
// (entries may carry sound: [{ f, t, v, d?, loop? }] with absolute times) and the hand-placed accents below.
// Accents sit in speech pauses where possible (Jakob: present, but not under a running sentence).
// usage: node tools/sound_plan.mjs
import fs from 'node:fs';
import { build, ROOT } from '../film.mjs';

const film = await build(), T = film.T, S = T.S, E = T.E;
const AMB = { H: ['amb_city_night_hill', .22], 7: ['amb_dawn_birds', .2] };
const TR = { whipL: ['whoosh', .4], whipR: ['whoosh', .4], whipU: ['whoosh_up', .4], whipD: ['whoosh', .35], zoom: ['whoosh_airy', .25], push: ['whoosh_airy', .25],
  left: ['whoosh_airy', .25], right: ['whoosh_airy', .25], up: ['whoosh_up', .3], down: ['whoosh_airy', .25], iris: ['bloom', .35], fog: ['gust', .35], flash: ['flash', .5], page: ['pages', .45] };
const out = [];
for (const [id, a] of Object.entries(AMB)) {
  const sh = film.shots.filter((s) => film.T.canon(s.sec) === id || s.sec === id); const seg = (() => { try { return T.seg(id); } catch { return null; } })();
  if (!a || !seg) continue;
  const t0 = Math.max(0, seg.start - 1.5), t1 = Math.min(T.duration, seg.end + 2);
  out.push({ f: a[0], t: t0, d: t1 - t0, v: a[1], loop: 1, fade: 1.5 });
}
const sh = film.shots;
for (let i = 1; i < sh.length; i++) { const tr = TR[sh[i - 1].out?.kind]; if (tr) out.push({ f: tr[0], t: sh[i].a - .25, v: tr[1] }); }
for (const e of film.list) for (const s of e.sound || []) out.push(s);
const mEnd = () => Math.min(E('7', 'same moment'), S('7', 'same moment') + .85); // E() of "moment." includes the breath pause
const safe = (f) => { try { return f(); } catch (err) { console.warn('[sound]', err.message.slice(0, 90)); return null; } };
const acc = [
  ['phone_buzz', () => E('H', 'buzzes') + .05, .8],                  // the buzz lands in the breath after "buzzes."
  ['foil_glint', () => E('H', 'A share') - .05, .5],                 // the share card locks in
  ['shimmer_rings', () => S('H', 'largest') - .15, .4],              // the rosette of light rises
  ['gavel', () => E('2', 'years in court') + .03, .45],
  ['press_notes', () => E('2', 'at the US border') + .05, .45, 1.4],  // the press starts in the pause before "The second is to print"
  ['phone_buzz', () => mEnd() + .08, .75],                            // two phones, one moment (= A.buzz in sc10)
  ['phone_buzz', () => mEnd() + .16, .55],
  ['shimmer_rings', () => S('7', 'That buzz') - .9, .3],
  ['bloom', () => E('7', "what's coming") + .5, .45],
];
for (const [f, tf, v, d, loop] of acc) { const t = safe(tf); if (t != null) out.push({ f, t, v, ...(d ? { d } : {}), ...(loop ? { loop: 1, fade: 1 } : {}) }); }
out.sort((p, q) => p.t - q.t);
fs.writeFileSync(ROOT + 'audio/sound_plan.json', JSON.stringify(out, null, 1));
console.log(out.length, 'sound events');
