#!/usr/bin/env node
// Film 75 · kit sheet: stills of the vocabulary so builders see it before they build: the Leitbild THE SUNRISE (thumbnail A, 4 anchors
// only), THE WALL with its explainer objects (stone head, flint, animals, reflex niches, sofa evening, doc / treaty, report card, chat row,
// coin, crowd, data card, time axis), THE CLOCKS (single gauges, the HUD, the gauges big), the clip plate, the three seam plates and the
// end screen.
//   node tools/kit_sheet75.mjs <dir> [--scale .5]   then tile (e.g. /tmp/claude-0/f75/sheet.sh) to /tmp/claude-0/f75/kit75_kontakt.jpg (< 1 MB)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f75_kit.mjs';
import * as S from '../lib/f75_world.mjs';
import * as X from '../lib/f75_explain.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const { W, H, P } = E;
const dir = process.argv[2] || '/tmp/claude-0/f75/kit'; fs.mkdirSync(dir, { recursive: true });
const sc = Number(process.argv[process.argv.indexOf('--scale') + 1] || .5) || .5;
const T = timing(TIMING);
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), out = createCanvas(Math.round(W * sc), Math.round(H * sc)), ox = out.getContext('2d');
async function shot(name, fn, t = 3) {
  await F.prepareClipFrames(T, t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  fn(ctx, t); E.finish(ctx, t, F.PRINT75);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const V = X.V0, wall = (ctx, t, v = V) => X.wall(ctx, t, v, { lx: v.x, ly: v.y });
const SRC = F.SOURCES, ct = F.clockTimes(T);
await shot('01_leitbild_thumbA', (ctx, t) => { S.sunrise(ctx, S.HOME(), t, { rise: 1 }); F.title(ctx, t, 1); });
await shot('02_leitbild_gap', (ctx, t) => S.sunrise(ctx, S.PUSH(.3), t, { rise: 1, gap: { u: 1, label: 'THE GAP' }, you: { ring: { dashed: 0, fill: .4 } } }));
await shot('03_wall_head_flint_disc', (ctx, t) => { wall(ctx, t); F.stoneHead(ctx, t, 420, 820, 360, { node: 1 }); F.flintClock(ctx, t, 900, 600, 300, { glow: .3 });
  F.sphere(ctx, t, 1450, 520, 150, { dust: 420 }); X.label(ctx, SRC.notMachine, 1450, 780, 1, { size: 30 }); });
await shot('04_animals_pulse', (ctx, t) => { wall(ctx, t); [['hunter', 420], ['wolf', 900], ['mouse', 1320]].forEach(([k, x]) => F.mammal(ctx, t, k, x, 760, k === 'mouse' ? 80 : 220, { dir: 1, node: 1 }));
  F.pulsePath(ctx, t, [[1700, 520], [200, 520]], 1400, [[300, 1, 1], [800, 1, 1]], { h: 90 }); X.label(ctx, SRC.older, 960, 880, 1, { size: 30 }); });
await shot('05_reflexes', (ctx, t) => { wall(ctx, t); F.reflexes(ctx, t, 960, 760, 300, { on: [1, 1, 1], lit: [1, .4, .4], grab: .6, line: 1 }); });
await shot('06_sofa_evening', (ctx, t) => { wall(ctx, t, S.SOFA_VIEW); X.inView(ctx, S.SOFA_VIEW, () => S.sofaScene(ctx, t)); });
await shot('07_doc_report_coin', (ctx, t) => { wall(ctx, t); X.doc(ctx, t, 420, 540, 420, { title: 'AI ACT', cog: 1, notch: 1 }); X.doc(ctx, t, 860, 560, 300, { title: 'TREATY', dashed: 1, rot: .05 });
  X.reportCard(ctx, t, 1380, 520, 440, { rows: [['SAFETY', .7, 1], ['HONESTY', .5, 1]], empty: 'WHAT IT DOES TO YOU', emptyFill: 0 }); X.coin(ctx, t, 1700, 820, 90, { label: '$1' }); });
await shot('08_chats_crowd', (ctx, t) => { wall(ctx, t); X.chatRow(ctx, t, 260, 380, 5, 260, { u: 1, tip: [1, 3], tipU: 1, q: 1 }); F.crowd(ctx, t, 400, 1520, 900, 15, 190, { u: 1, push: .6, seed: 75 }); });
await shot('09_datacard_axis', (ctx, t) => { wall(ctx, t); F.dataCard(ctx, t, 330, 300, 900, { kind: 'KNOWN', title: 'AI TASK LENGTH', big: SRC.metr, bigSize: 58 });
  X.timeAxis(ctx, t, 260, 1660, 800, 1, [[460, '2019'], [960, '2023'], [1460, '2026']]); X.dateTag(ctx, F.ASOF, 1500, 300, 1); F.source(ctx, 4, 0, 99, SRC.metrSrc ?? ''); });
await shot('10_gauges_single', (ctx, t) => { wall(ctx, t); F.flintClock(ctx, t, 300, 540, 300); F.cogClock(ctx, t, 760, 540, 150, { dashed: 1, notch: 0, glow: .2 }); F.cogClock(ctx, t, 1120, 540, 150, { dashed: 0, notch: 1, glow: .5 });
  F.ringClock(ctx, t, 1480, 540, 120, { dashed: 1, glow: .3 }); F.ringClock(ctx, t, 1740, 540, 90, { dashed: 0, fill: .6, spin: 3, glow: .5 }); F.gapBracket(ctx, t, 300, 1600, 860, 1, { size: 60, tick: 30, w: 4 }); });
await shot('11_hud', (ctx, t) => { wall(ctx, t, S.SOFA_VIEW); F.clocksHud(ctx, t, T); }, ct.hud + 3);
await shot('12_gauges_big_late', (ctx, t) => { wall(ctx, t); S.clocksBig(ctx, t, T, 960, 560, 2.4, { labels: 1 }); }, ct.gap[1] + 1);
await shot('13_clip_plate_C1', (ctx, t) => { wall(ctx, t); F.clipPlate(ctx, t, T, 'C1', { morph: 1, label: 1 }); }, T.clip('C1').start + 4);
await shot('14_plateSofa', (ctx, t) => S.plateSofa(ctx, t, T), T.G('To see what it is'));
await shot('15_plateClocks', (ctx, t) => S.plateClocks(ctx, t, T), T.G('This channel exists'));
await shot('16_plateRace', (ctx, t) => S.plateRace(ctx, t, T), T.G('Then you notice more'));
await shot('17_endScreen', (ctx, t) => S.endScreen(ctx, t, T), T.duration - 8);
