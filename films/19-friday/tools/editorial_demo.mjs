// Example for the builders (bild/EDITORIAL-KIT.md): one 2.5D shot on the stage + one explainer plate, as stills.
//   node tools/editorial_demo.mjs <outdir> [t…]
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
const { W, H, P, card, cam3, aim, camAt, camDrift, lightFlood, finish } = E;

// the shot: a rising sun of light over a dark ridge, you on the ridge, a small robot beside you. Camera: slow push, then INTO the sun.
const SUN = { Z: 9000, u: 1180, v: 470 };
const KEYS = [[0, cam3()], [4, cam3({ z: 260, x: 20 })], [6, aim(SUN.Z, SUN.u, SUN.v, 60), 'i']];
export function shot(ctx, t) {
  const c = camDrift(camAt(t, KEYS, SUN.Z), t);
  card(ctx, c, 40000, () => { E.nightSky(ctx); E.stars(ctx, 9, 160, t); });
  card(ctx, c, SUN.Z, () => { E.lightForm(ctx, 'disc', SUN.u - 260, SUN.v - 260, 520, 520, t); E.rays(ctx, SUN.u, SUN.v, 290, 420, 14, .25, t * .02); });
  card(ctx, c, 4000, () => E.ground(ctx, [[-200, 760], [500, 700], [1100, 740], [2100, 690]], { stops: [[0, P.ind1], [1, P.night1]] }));
  card(ctx, c, E.F0, () => {
    E.ground(ctx, [[-200, 900], [700, 860], [1300, 880], [2100, 840]]);
    E.castShadow(ctx, 760, 862, 30, 260, 2.2, .55);
    E.du(ctx, 760, 862, 190, { dir: 1, look: E.smooth(E.span(t, 1, 2.5)), light: 1 });
    E.robot(ctx, 900, 866, 200, { dir: -1, light: -1, rim: P.halo0, armR: [.3, .2] });
  });
  lightFlood(ctx, E.smooth(E.span(c.f / Math.max(1, SUN.Z - c.z), 4, 40)));
}
export function explainer(ctx, t) {
  E.nightSky(ctx, [[0, P.night0], [1, P.ind0]]);
  E.counter(ctx, t, { x: 420, y: 330, to: 1000000000, label: 'robots by 2050', size: 110 });
  E.bars(ctx, t, { x: 140, y: 900, w: 560, h: 380, values: [1, 3, 6, 13], lit: [1, 1, 1, 0], labels: ['2021', '2022', '2023', '2024'] });
  E.curve(ctx, t, { rect: [860, 160, 480, 330], data: [[0, 0], [1, .1], [2, .3], [3, .8], [4, 2], [5, 4.4]], xr: [0, 5], yr: [0, 5], dashFrom: 3, xTicks: [[0, '2020'], [5, '2050']] });
  E.pie(ctx, t, { x: 1100, y: 800, r: 150, parts: [{ v: 9, lit: 1, label: '9 in 10' }, { v: 1, lit: 0 }] });
  E.section(ctx, t, { x: 1500, y: 600, w: 160, layers: [{ h: 70, label: 'skin', lit: 1 }, { h: 110, label: 'motors' }, { h: 90, label: 'magnets', lit: 1 }] });
  E.lightMap(ctx, t, { pts: [[1480, 220, 1], [1560, 300, 0], [1640, 240, 1], [1720, 330, 0], [1800, 260, 1]], route: [[1480, 220], [1640, 240], [1800, 260]] });
}
if (process.argv[1].endsWith('editorial_demo.mjs')) {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const c = createCanvas(W, H), x = c.getContext('2d');
  for (const t of (process.argv[3] || '0,4,5.6').split(',').map(Number)) { x.setTransform(1, 0, 0, 1, 0, 0); shot(x, t); finish(x, t); fs.writeFileSync(`${out}/shot_${t}.jpg`, await c.encode('jpeg', 85)); }
  x.setTransform(1, 0, 0, 1, 0, 0); explainer(x, 3); finish(x, 3); fs.writeFileSync(`${out}/explainer.jpg`, await c.encode('jpeg', 85));
}
