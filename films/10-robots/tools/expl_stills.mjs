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
const shots = {
  // the cup on the left, its card unfolded: the rim has become the share circle; a counter and a tag on the hall in the valley
  cupPie: () => {
    const V = K.view3(valleyCam); K.valley(x, T, V, L, { hallFn: K.hall });
    K.cup(x, 330, 900, 2.2, { L });
    const b = K.card(x, 10, { rect: [760, 110, 1060, 640], from: [280, 760, 110, 60], t0: 0, dur: .9, hinge: 'top', accent: E.warm });
    b.inside(() => {
      K.pie(x, 10, { x: 1040, y: 430, r: 190, flat: 1, u: 1, parts: [{ v: 5, col: E.warm, label: 'Trainers', sub: '1 vote' }, { v: 3, col: E.warmLight, label: 'You' }, { v: 4, col: E.green, label: 'Growers' }] });
      K.counter(x, 10, { x: 1420, y: 330, v0: 0, v1: 6000, t0: 8, prefix: '~$', size: E.size.num, label: 'Unitree R1', src: 'test value' });
    });
    const h = K.view3(valleyCam).P(K.VAL.ground(0, 214));
    K.tag(x, 10, { ax: h.x, ay: h.y, x: h.x - 160, y: h.y + 150, title: 'Training hall', t0: 0, align: 'right' });
  },
  // a full plate: joint motor cross-section with callouts, bars, a tally of 100 and the data chain
  plate: () => {
    const V = K.view3(valleyCam); K.valley(x, T, V, L, { hallFn: K.hall });
    const b = K.card(x, 10, { rect: [70, 60, 1780, 960], from: [900, 500, 120, 80], t0: 0, hinge: 'top', accent: E.magnet });
    b.inside(() => {
      K.section(x, 10, { x: 300, y: 330, r: 190, u: 1, rings: [{ f0: .82, f1: 1, col: '#d9d6cf', label: 'Housing' }, { f0: .56, f1: .82, col: '#b8875a', hatch: 7, label: 'Copper coils' }, { f0: .36, f1: .56, col: E.magnet, hatch: 5, label: 'Magnets', sub: '2–4 kg' }, { f0: 0, f1: .36, col: '#9aa3ab' }] });
      K.bars(x, 10, { x: 1020, y: 470, w: 700, h: 300, t0: 8, max: 4, items: [{ label: 'Robot', v: 3, valueText: '2–4 kg', col: E.magnet }, { label: 'Electric car', v: 1.4, valueText: '1.4 kg', col: E.inkSoft }] });
      K.tally(x, 10, { x: 120, y: 700, w: 900, h: 70, n: 100, lit: 59, t0: 8, col: E.cold });
      K.text(x, '59 %', 1060, 772, { size: E.size.num, font: 'Instrument Serif', color: E.ink });
      K.flow(x, 10, { t0: 7, step: .4, nodes: [{ x: 250, y: 900, label: 'Human shows' }, { x: 700, y: 900, label: 'Data', col: .3 }, { x: 1150, y: 900, label: 'Model', col: .7 }, { x: 1600, y: 900, label: 'Robot', col: 1 }] });
    });
  },
  // the trace becomes a curve on a card that unfolds from the right
  curve: () => {
    const V = K.view3(valleyCam); K.valley(x, T, V, L, { hallFn: K.hall });
    const b = K.card(x, 10, { rect: [900, 140, 900, 700], from: [1700, 700, 80, 40], t0: 0, hinge: 'right', accent: E.cold });
    const spur = [[200, 800], [500, 700], [700, 760], [900, 600]];
    b.inside(() => K.curve(x, 10, { rect: [1040, 220, 680, 480], data: [[2025, .013], [2030, .2], [2035, 1.5], [2040, 8], [2050, 1000]].map(([a, v]) => [a, Math.log10(v * 1000)]), xr: [2025, 2050], yr: [1, 6], xTicks: [[2025, '2025'], [2050, '2050']], yTicks: [[Math.log10(13), '13 k'], [6, '1 bn']], k: .85, from: spur, dashFrom: 2026, col: .2 }));
  },
  // the valley from straight above becomes the printed map
  map: () => {
    const V = K.view3({ x: 80, y: 700, z: 190, yaw: 0, pitch: -1.5, f: 1500 }); K.valley(x, T, V, L, { hallFn: K.hall });
    K.mapSheet(x, 10, V, { u: 1, title: 'The valley · one day', scale: 100, pins: [{ p: [0, 214], title: 'Hall' }, { p: [150, 345], title: 'Your house' }, { p: [K.VAL.signpost[0], K.VAL.signpost[1]], title: 'Fork', left: true }], routes: [K.VAL.branchHall] });
  },
};
for (const [name, fn] of Object.entries(shots)) {
  if (process.argv[3] && !process.argv[3].split(',').includes(name)) continue;
  const t0 = Date.now(); x.save(); fn(); x.restore(); const t1 = Date.now();
  filmFinish(x, 20, { vig: .16 });
  const buf = await c.encode('jpeg', 85); fs.writeFileSync(`${dir}/${name}.jpg`, buf);
  const ph = createCanvas(390, 219), px = ph.getContext('2d'); px.drawImage(await loadImage(buf), 0, 0, 390, 219);
  fs.writeFileSync(`${dir}/${name}_phone.jpg`, await ph.encode('jpeg', 90));
  console.log(name, t1 - t0, 'ms');
}
// contrast gate for the print palette
for (const [a, b, min] of [[E.ink, E.paper, 7], [E.inkSoft, E.paper, 4.5], [E.paper, E.magnet, 4.5], [E.ink, E.warmLight, 4.5]]) console.log('wcag', a, b, K.wcag(a, b).toFixed(1), K.wcag(a, b) >= min ? 'ok' : 'LOW');
