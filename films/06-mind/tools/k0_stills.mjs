#!/usr/bin/env node
// Render the K0 art-test stills (ref/k0/scenes.mjs) through the film finish, and time each frame.
//   node tools/k0_stills.mjs [outDir] [names…]     default outDir: /mnt/project-files/scenario/film-06-mind/stills/k0
import fs from 'node:fs';
import path from 'node:path';
import { canvas } from '../engine.mjs';
import { filmFinish } from '../lib/print.mjs';
import * as S from '../ref/k0/scenes.mjs';
import * as R3 from '../ref/k0/r3.mjs';

const out = process.argv[2] || '/mnt/project-files/scenario/film-06-mind/stills/k0';
const only = process.argv.slice(3);
fs.mkdirSync(out, { recursive: true });
const JOBS = [
  ['k0-1a-hook-hand', (c, t) => S.hookHand(c, t), 2.62],
  ['k0-1b-hook-rooftop', (c, t) => S.hookRooftop(c, t), 3.2],
  ['k0-2a-certificate', (c, t) => S.certFrame(c, t), 2.4],
  ['k0-2b-unwind-coast', (c, t) => S.unwindFrame(c, t, { u: .6 }), 3.0],
  ['k0-3-map-night', (c, t) => S.mapNight(c, t), 1.5],
  // round 3: the Wertpapier-Sprache helpers (ref/k0/r3.mjs); [name, draw, t, finish options]
  ['ghost-1-certificate-burin', (c, t) => R3.ghostBurin(c, t), 2.0, { riso: .25 }],
  ['ghost-2-rosette-states', (c, t) => R3.ghostRosettes(c, t), 2.0, { riso: .25 }],
  ['perforate-1-promise', (c, t) => R3.perforatePromise(c, t), 2.0, { riso: .3 }],
  ['perforate-2-coupon-tear', (c, t) => R3.couponTear(c, t), 2.0, { riso: .3 }],
  ['micro-1-border', (c, t) => R3.microBorder(c, t), 2.0, { riso: .25 }],
  ['kids-1-lineup', (c, t) => R3.kidsLineup(c, t), 2.0, { riso: .25 }],
  ['kids-2-baby-beds', (c, t) => R3.babyBeds(c, t), 2.0, { riso: .25 }],
  ['feet-1-toddle', (c, t) => R3.feetSoil(c, t), 2.0, { riso: .25 }],
];
const [cv, ctx] = canvas();
for (const [name, draw, t, fin = {}] of JOBS) {
  if (only.length && !only.some((o) => name.includes(o))) continue;
  const run = (tt) => { ctx.save(); draw(ctx, tt); ctx.restore(); filmFinish(ctx, tt, fin); ctx.getImageData(0, 0, 1, 1); };
  let t0 = performance.now(); run(t - .5); const first = performance.now() - t0;
  t0 = performance.now(); for (let i = 0; i < 3; i++) run(t - .1 * (3 - i)); const ms = (performance.now() - t0) / 3;
  run(t);
  const f = path.join(out, name + '.jpg'); fs.writeFileSync(f, await cv.encode('jpeg', 90));
  console.log(`${f}  first ${first.toFixed(0)} ms, then ${ms.toFixed(0)} ms/frame`);
}
