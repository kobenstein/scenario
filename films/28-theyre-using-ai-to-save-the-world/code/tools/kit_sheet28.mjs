#!/usr/bin/env node
// Film 28 · kit sheet: stills of every kit piece (the tree of lanterns, the hook windows, the station, the bead and its aim, the lamp
// rail + tools + tags, REAL stamps, explainer blocks, clip plate, the three seam plates) so builders see the vocabulary before they build.
//   node tools/kit_sheet28.mjs <dir> [--scale .5]
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as S from '../lib/f28_seams.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const { W, H, P } = E;
const dir = process.argv[2] || 'kit'; fs.mkdirSync(dir, { recursive: true });
const sc = Number(process.argv[process.argv.indexOf('--scale') + 1] || .5) || .5;
const T = timing(TIMING);
E.prepareEditorial?.();
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), out = createCanvas(Math.round(W * sc), Math.round(H * sc)), ox = out.getContext('2d');
async function shot(name, fn, t = 3) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  fn(ctx, t); E.finish(ctx, t, F.PRINT28);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const c0 = E.cam3(), LATE = T.duration - 20;
const lit = (set) => (n) => ({ lit: set.includes(n) ? 1 : 0, num: n });
// 1 the guiding image (thumbnail A): the tree, the lanterns dark, you at the foot, the line
await shot('01_tree_title', (ctx, t) => {
  S.treeWorld(ctx, c0, t, { glow: .62 });
  F.thesis(ctx, t, 110, 300, 1, { lines: ['AI IS SAVING', 'THE WORLD'], size: 110 });
});
// 2 the hook teasers: lanterns 4, 7, 9 lit as windows
await shot('02_tree_teasers', (ctx, t) => S.treeWorld(ctx, c0, t, { glow: .45, lantern: (n) => (n === 4 ? { lit: 1, inside: (cx, w, h) => S.vignetteTrain(cx, t, w, h, { heat: 1 }) }
  : n === 7 ? { lit: 1, inside: (cx, w, h) => S.vignetteKitchen(cx, t, w, h, { words: .8 }) } : n === 9 ? { lit: 1, inside: (cx, w, h) => S.vignetteDesert(cx, t, w, h, { fig1: 1, fig2: 1 }) } : { lit: 0 }) }));
// 3–5 the three windows close (camera into each glass)
for (const [n, name, fn] of [[4, '03_window_train', (cx, t, w, h) => S.vignetteTrain(cx, t, w, h, { heat: 1, cross: .4 })],
  [7, '04_window_kitchen', (cx, t, w, h) => S.vignetteKitchen(cx, t, w, h, { words: 1 })], [9, '05_window_desert', (cx, t, w, h) => S.vignetteDesert(cx, t, w, h, { fig1: 1, fig2: .6 })]]) {
  const g = S.lanternGlass(n);
  await shot(name, (ctx, t) => S.treeWorld(ctx, E.aim(E.F0, g.x, g.y, 820 / g.h), t, { glow: .4, fg: false, lantern: (k) => (k === n ? { lit: 1, inside: (cx, w, h) => fn(cx, t, w, h) } : { lit: 0 }) }));
}
// 6 the bead and its aim: cool along the line, warm where it lands (the crown blooms)
await shot('06_bead_aim', (ctx, t) => {
  S.treeWorld(ctx, c0, t, { glow: .75, extra: (cx) => { F.laptop(cx, t, 1010, 905, 120, { open: 1, glow: .6 }); F.agent(cx, t, 1010, 846, 9, { think: .6 }); F.beam(cx, t, 1010, 846, 1430, 300, 1, { hit: 1, warm: .3 }); } });
});
// 7 the twelve lanterns lit, the gold thread, the question
await shot('07_twelve_question', (ctx, t) => {
  S.treeWorld(ctx, E.aim(E.F0, 880, 640, 1.25), t, { glow: .3, lantern: (n) => ({ lit: .55, num: n }) });
  F.questionMark(ctx, t, 1500, 380, 260, 1);
});
// 8 the station world (No. 12) + the seam plate
await shot('08_station', (ctx, t) => S.stationWorld(ctx, c0, t, { window: 1, ring: .6, towers: .7, bead: [1700, 380, 10, { think: .5 }] }));
await shot('09_plate_station', (ctx, t) => S.plateStation(ctx, t, T), T.G('A global data company'));
// 10 the lamp rail with all tools and the five tags (the gallery of the ending)
await shot('10_rail_gallery', (ctx, t) => {
  F.sky(ctx, c0, t, { glow: S.SKY_GLOW, hor: S.TREE_HOR }); F.lampRail(ctx, t, T);
  F.LAMPS.forEach((L, i) => { const x = 220 + i * 130, y = 520; F.tool(ctx, L.tool, x, y, 84, { lit: i % 2 ? .6 : 1 }); E.glowText(ctx, L.tool.toUpperCase(), x, y + 80, { size: 16, align: 'center', glow: false, col: P.halo2 });
    if (L.tag) F.tag(ctx, t, x, y + 110, L.tag, 1, { size: 14 }); });
}, LATE);
// 11 tools not on the rail (email, ad, laptop) + small things
await shot('11_small_things', (ctx, t) => {
  ctx.fillStyle = P.night1; ctx.fillRect(0, 0, W, H);
  ['email', 'ad', 'laptop'].forEach((g, i) => F.tool(ctx, g, 300 + i * 220, 300, 120, { lit: 1 }));
  F.laptop(ctx, t, 1200, 420, 300, { open: 1, glow: .7 }); F.agent(ctx, t, 1200, 280, 16, { think: 1 });
  F.voiceWave(ctx, t, 400, 640, 80, {}); F.radioRings(ctx, t, 800, 660, 90, {});
  F.realStamp(ctx, t, 1, null, 'nazca', { x: 1050, y: 720, screen: false }); F.realStamp(ctx, t, 1, null, 'floodhub', { x: 1050, y: 880, screen: false });
  F.elephant(ctx, t, 380, 960, 160, { dir: 1, heat: 1 });
}, 3);
// 12 explainer blocks
await shot('12_explainers', (ctx, t) => {
  ctx.fillStyle = P.night1; ctx.fillRect(0, 0, W, H);
  F.ruler(ctx, t, { x: 140, y: 230, w: 900, u: 1, fill: .7, ticks: [[0, '0'], [1, '300 HOURS']], minor: 30, label: 'SPOKEN MĀORI' });
  F.dotField(ctx, t, { x: 140, y: 380, w: 900, h: 300, n: 240, layout: 'grid', cols: 30, r: 7, u: 1, on: (k) => (k % 37 === 0 ? 1 : 0), col: (k) => (k % 37 === 0 ? 'warm' : 'dim') });
  F.chartLines(ctx, t, { x: 1180, y: 160, w: 620, h: 360, xr: [0, 2], yr: [0, 100], base: 0, xTicks: [[0, '2023'], [2, '2025']],
    series: [{ data: [[0, 1], [1, 6], [2, 12]], col: 'warm', label: 'ANSWERED %' }] });
  F.dayTiles?.(ctx, t, { x: 1180, y: 640, n: 10, u: 1 });
  F.bracket(ctx, 140, 1040, 760, 1, 'TEN DAYS');
  F.label(ctx, 1180, 880, '2,500+ PEOPLE', 'TE HIKU MEDIA', 1);
  F.source(ctx, t, 0, null, 'Source: Te Hiku Media 2018');
}, 3);
// 13 clip plate placeholder
await shot('13_clip', (ctx, t) => { F.sky(ctx, c0, t, {}); const k = T.clip('C1'); F.clipPlate(ctx, k.start + 3, T, 'C1', {}); }, 3);
// 14–15 the other seam plates
await shot('14_plate_tree', (ctx, t) => S.plateTree(ctx, t, T), T.G('Casey Harrell knows'));
await shot('15_plate_grass', (ctx, t) => S.plateGrass(ctx, t, T), T.G('The snake'));
// 16 the end screen: the tree left third in full light, the right two thirds dark for the YouTube tiles
await shot('16_endscreen', (ctx, t) => {
  S.treeWorld(ctx, E.aim(E.F0, 1560, 560, .95, 560, 560), t, { glow: 1, lantern: (n) => ({ lit: n === 8 ? .5 : 1, num: n }), lights: () => 1 });
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.setLineDash([8, 8]); ctx.strokeRect(1010, 120, 820, 740); ctx.restore();
}, LATE);
