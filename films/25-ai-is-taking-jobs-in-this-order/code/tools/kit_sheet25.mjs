#!/usr/bin/env node
// Film 25 · kit sheet: stills of every kit piece (the row, the cascade, the studio, glyphs, rank rail, explainer blocks, clip plate,
// seam plates) so builders see the vocabulary before they build.   node tools/kit_sheet25.mjs <dir> [--scale .5]
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f25_kit.mjs';
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
  fn(ctx, t); E.finish(ctx, t, F.PRINT25);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const GL = ['topic', 'email', 'report', 'translate', 'voice', 'form', 'invoice', 'calendar', 'image', 'code', 'chat', 'draft', 'scan', 'analysis'];
const ROW = F.row({ n: 14, glyphs: GL });
const c0 = E.cam3();
// 1 the guiding image (thumbnail A): the row, the gold stone, you, the title
await shot('01_row_title', (ctx, t) => {
  F.sky(ctx, c0, t, { glow: [1300, 520, 900] }); F.plain(ctx, c0, t);
  F.drawRow(ctx, c0, t, ROW, null, { each: (i) => (i === 0 ? { gold: 1, glyph: null } : { glyphA: .8 }) });
  E.card(ctx, c0, F0(), () => E.du(ctx, 700, 878, 150, { look: .3, light: 1 }));
  F.title(ctx, t, 110, 300, 1, { size: 140 });
});
function F0() { return E.F0; }
// 2 the cascade halfway (far → near, stopAt 0)
await shot('02_cascade', (ctx, t) => {
  F.sky(ctx, c0, t, { glow: [1300, 520, 900] }); F.plain(ctx, c0, t);
  const cs = F.cascade(t, ROW, 0, { stopAt: 0 }); const tm = cs.hit[5];
  const a = F.cascade(tm, ROW, 0, { stopAt: 0 }).a;
  F.drawRow(ctx, c0, t, ROW, a, { each: (i) => (i === 0 ? { gold: 1, glyph: null } : {}) });
});
// 3 all fallen but the gold one
await shot('03_fallen', (ctx, t) => {
  F.sky(ctx, c0, t, { glow: [1300, 520, 900] }); F.plain(ctx, c0, t);
  const a = F.cascade(60, ROW, 0, { stopAt: 0 }).a;
  F.drawRow(ctx, c0, t, ROW, a, { each: (i) => (i === 0 ? { gold: 1, glyph: null } : {}) });
  E.card(ctx, c0, E.F0, () => E.du(ctx, 700, 878, 150, { look: .3, light: 1 }));
});
// 4 the studio at the start (J1: lanes lit, all by hand)
await shot('04_studio_J1', (ctx, t) => F.studio(ctx, c0, t, { lit: [1, 1, 1, 1, .5, 0, 0, 0, 0], work: 1, ruler: { u: 1, hot: 0 } }));
await shot('05_studio_climb', (ctx, t) => F.studio(ctx, c0, t, { taken: [1, 1, 1, .6, 1, 0, 0, 0, 0], level: .7, ruler: { u: 1, hot: 1 }, beads: 1 }));
await shot('06_studio_top', (ctx, t) => F.studio(ctx, c0, t, { taken: [1, 1, 1, 1, 1, 1, 1, .8, 0], level: 3, conduct: 1, beads: 1, ruler: { u: 1, hot: 1 } }));
// 7 glyphs + agent + rank rail + lower third
await shot('07_glyphs_rail', (ctx, t) => {
  ctx.fillStyle = P.night1; ctx.fillRect(0, 0, W, H);
  F.GLYPHS.forEach((g, i) => { const x = 160 + (i % 11) * 160, y = 330 + Math.floor(i / 11) * 190; F.glyph(ctx, g, x, y, 96, { lit: i % 3 === 0 ? 1 : 0 }); E.glowText(ctx, g, x, y + 86, { size: 18, align: 'center', glow: false, col: P.halo2 }); });
  F.agent(ctx, t, 1700, 960, 16, { think: 1 });
  const tr = F.rankAt(T, 6) + 2; F.rankRail(ctx, tr, T);
  F.lowerThird(ctx, T.clip('J1').start + 3, T, 'J1', { y: 990 });
}, 3);
// 8 explainer blocks: chart lines, slabs, stone grid, day tiles, bracket, label
await shot('08_explainers', (ctx, t) => {
  ctx.fillStyle = P.night1; ctx.fillRect(0, 0, W, H);
  F.chartLines(ctx, t, { x: 140, y: 140, w: 700, h: 380, xr: [0, 10], yr: [-15, 15], base: 0, xTicks: [[0, '2022'], [10, '2026']],
    series: [{ data: [[0, 0], [3, 3], [6, 6], [10, 10]], col: 'warm', label: 'LEAST EXPOSED +10 %' }, { data: [[0, 0], [3, -2], [6, -7], [10, -11]], col: 'cool', u: .8, label: 'MOST EXPOSED' }] });
  F.slabBars?.(ctx, t, { x: 1240, y: 220, w: 560, pitch: 80, rows: [{ label: 'INTERPRETERS', v: 1 }, { label: 'WRITERS', v: .8 }, { label: 'ROOFERS', v: .1, col: 'warm' }] });
  F.stoneGrid(ctx, t, { x: 160, y: 760, n: 10, cols: 10, could: [0, 1, 2, 3, 4, 5, 6, 7, 8], fall: [0, 1] });
  F.dayTiles?.(ctx, t, { x: 1040, y: 640, n: 14, u: 1 });
  F.bracket(ctx, 1040, 1700, 980, 1, 'ONE JOB');
  F.label(ctx, 900, 900, 'AGE 22–25', 'STANFORD', 1);
}, 3);
// 9 clip plate placeholder
await shot('09_clip', (ctx, t) => { F.sky(ctx, c0, t, {}); const k = T.clip('K1'); F.clipPlate(ctx, k.start + 3, T, 'K1', {}); }, 3);
// 10–12 the seam plates (lib/f25_seams.mjs) at their seam times
const S = await import('../lib/f25_seams.mjs');
await shot('10_plate_jakobrow', (ctx, t) => S.plateJakobRow(ctx, t, T), T.G('Ten kinds of work'));
await shot('11_plate_studio', (ctx, t) => S.plateStudio(ctx, t, T), T.G("So here's the puzzle"));
await shot('12_plate_rankrow', (ctx, t) => S.plateRankRow(ctx, t, T), T.G('Number two'));
