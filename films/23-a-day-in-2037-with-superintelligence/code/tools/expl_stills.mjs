// Reference stills of the explainer layer (MOTION.md §13) + the phone legibility check (390 px wide copies).
//   node tools/expl_stills.mjs <dir> [name,name]
// Gate: every label must read on the *_phone.jpg copy (cap height ≥ ~9 px there), every number at a glance.
import fs from 'node:fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import * as K from '../lib/f10_kit.mjs';
import { filmFinish } from '../lib/print.mjs';
const dir = process.argv[2] || 'expl'; fs.mkdirSync(dir, { recursive: true });
await K.prepareKit();
const c = createCanvas(1920, 1080), x = c.getContext('2d'), E = K.EXP;
const T = 150, L = K.light(K.tod(T));   // noon (c03)
const valleyCam = { x: 20, y: 60, z: -40, yaw: .1, pitch: -.16, f: 1700 };
const hallCam = (() => { const lc = [-6.45, 1.12, 223.55], p = K.VAL.hallWorld(lc), S = K.STATIONS[0];
  const yaw = Math.atan2(S.cupP[0] - lc[0], S.cupP[2] - lc[2]), pitch = Math.atan2(S.cupP[1] - lc[1], Math.hypot(S.cupP[0] - lc[0], S.cupP[2] - lc[2]));
  return { x: p[0], y: p[1], z: p[2], yaw: K.VAL.hall.rot + yaw - .12, pitch: pitch + .06, f: 1500 }; })();
const shares = Array.from({ length: 12 }, (_, i) => ({ v: 1, col: i % 2 ? '#f0a040' : '#ffc46a' }));
// Becher → Tortendiagramm (c08 "one member, one vote"): the cup in the hall, the camera looks into it, the rim becomes the circle of 12 shares
const cupSeq = (u) => () => {
  const V = K.view3(hallCam); K.world(x, T, V, L, { hallOpts: { station: (i) => (i === 0 ? { headset: 'up', cupScale: 1e-4 } : { headset: 'up' }) } });
  const S = K.STATIONS[0], p = K.hallView(V).P(S.cupP), s = p.k * .00095;
  K.cupPie(x, 10, { u, cup: { x: p.x, y: p.y, s, L }, x: 1180, y: 470, r: 250, parts: shares, labels: false });
  if (u > .9) K.tag(x, 10, { x: 1180, y: 840, sub: '1 member · 1 vote', title: 'Robot co-op', k: (u - .9) * 10, align: 'center' });
};
// Lichtspur → Kurve (c03 "a billion is a forecast"): the trace on the road lifts off and becomes the forecast line
const roadPts = () => { const V = K.view3(valleyCam), P = []; for (let xx = -120; xx <= 40; xx += 8) { const s = V.P([xx, .2, K.VAL.roadZ(xx)]); if (s.z > .2) P.push([s.x, s.y]); } return P; };
const curveSeq = (u) => () => {
  const V = K.view3(valleyCam); K.valley(x, T, V, L, { hallFn: K.hall });
  const box = K.card(x, 10, { rect: [760, 170, 1000, 640], from: [700, 900, 10, 10], t0: 10 - .9 * K.lin(.2, 1, u) + 1e-4, dur: .9 });
  const draw = () => K.curve(x, 10, { rect: [900, 240, 760, 440], data: [[2025, .013], [2030, .2], [2035, 1.5], [2040, 8], [2050, 1000]].map(([a, v]) => [a, Math.log10(v * 1000)]), xr: [2025, 2050], yr: [1, 6], xTicks: [[2025, '2025'], [2050, '2050']], yTicks: [[Math.log10(13), '>13,000'], [6, '~1 billion']], k: u, axis: K.lin(.4, 1, u), from: roadPts(), dashFrom: u > .6 ? 2025.6 : null, col: 0, w: 5 });
  if (box && u > .2) box.inside(draw); else draw();
  if (u > .9) K.tag(x, 10, { x: 1660, y: 300, sub: '~1 billion', title: 'Forecast · Morgan Stanley', k: (u - .9) * 10, align: 'right' });
};
const shots = {
  becher_1: cupSeq(0), becher_2: cupSeq(.5), becher_3: cupSeq(1),
  kurve_1: curveSeq(0), kurve_2: curveSeq(.5), kurve_3: curveSeq(1),
  map: () => {
    const V = K.view3({ x: 80, y: 700, z: 190, yaw: 0, pitch: -1.5, f: 1500 }); K.valley(x, T, V, L, { hallFn: K.hall });
    K.mapSheet(x, 10, V, { u: 1, title: 'The valley · one night', scale: 100, pins: [{ p: [0, 214], title: 'Hall' }, { p: [150, 345], title: 'Your house' }, { p: [K.VAL.signpost[0], K.VAL.signpost[1]], title: 'Fork', left: true }], routes: [K.VAL.branchHall] });
  },
};
for (const [name, fn] of Object.entries(shots)) {
  if (process.argv[3] && !process.argv[3].split(',').includes(name)) continue;
  const t0 = Date.now(); x.save(); fn(); x.restore(); const t1 = Date.now();
  filmFinish(x, T, { vig: .3, grade: K.gradeLUT(K.gradeAt(T).dawn), heroes: K.takeHeroes() });
  const buf = await c.encode('jpeg', 85); fs.writeFileSync(`${dir}/${name}.jpg`, buf);
  const ph = createCanvas(390, 219), px = ph.getContext('2d'); px.drawImage(await loadImage(buf), 0, 0, 390, 219);
  fs.writeFileSync(`${dir}/${name}_phone.jpg`, await ph.encode('jpeg', 90));
  console.log(name, t1 - t0, 'ms');
}
// contrast gate for the print palette
for (const [a, b, min] of [[E.ink, E.paper, 7], [E.inkSoft, E.paper, 4.5], [E.warm, E.paper, 4.5], [E.cold, E.paper, 4.5], [E.magnet, E.paper, 3]]) console.log('wcag', a, b, K.wcag(a, b).toFixed(1), K.wcag(a, b) >= min ? 'ok' : 'LOW');
