#!/usr/bin/env node
// Film 55 · kit sheet: stills of every kit piece (THE LINE wide and close, the door, the floor marks and groups, the kitchen, the room behind
// the door, the proof tape, calendar sheets, cores, the clipboard, the code wall, the document, the parcel, the quote cards, the explainer
// blocks, the three seam plates, the end screen) so builders see the vocabulary before they build.
//   node tools/kit_sheet55.mjs <dir> [--scale .5] [--only name,name]   (then a contact sheet of <dir>/*.jpg, < 1 MB, to <ROOT>bild/)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f55_kit.mjs';
import * as S from '../lib/f55_seams.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const { W, H, P, F0 } = E;
const dir = process.argv[2] || 'kit'; fs.mkdirSync(dir, { recursive: true });
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const sc = Number(arg('scale', .5)), only = arg('only') ? arg('only').split(',') : null;
const T = timing(TIMING);
E.prepareEditorial?.();
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), out = createCanvas(Math.round(W * sc), Math.round(H * sc)), ox = out.getContext('2d');
async function shot(name, fn, t = 3) {
  if (only && !only.some((o) => name.includes(o))) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  fn(ctx, t); E.finish(ctx, t, F.PRINT55);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const flat = (ctx) => { ctx.fillStyle = P.night1; ctx.fillRect(0, 0, W, H); };
// 1 THE LINE wide (thumbnail A without text) · 2 the line close (marks 1–5 and the groups) · 3 the door close
await shot('01_line_wide', (ctx, t) => { S.lineWorld(ctx, S.HOME, t, {}); F.thesis(ctx, t, 96, 250, 1, { size: 150 }); });
await shot('02_line_marks', (ctx, t) => S.lineWorld(ctx, S.LINE_CAM, t, { mark: (i) => ({ lit: 1, sub: S.LINE.marks[i].name }) }));
await shot('03_door_close', (ctx, t) => S.lineWorld(ctx, S.look(S.LINE.door.x, 3600, S.LINE.door.z, 1.6, 960, 520), t, { sign: 'MYTHOS' }));
await shot('04_door_open', (ctx, t) => S.lineWorld(ctx, S.look(S.LINE.door.x + 1500, 2000, S.LINE.door.z, 1.3, 960, 560), t, { open: .45, side: { open: 1 } }));
// 5 the kitchen (tonight: your phone, the letter, the car outside) · 6 the kitchen pushed in on the phone (an answer)
await shot('05_kitchen', (ctx, t) => S.kitchen(ctx, t, W, H, {}));
await shot('06_kitchen_phone', (ctx, t) => S.kitchen(ctx, t, W, H, { zoom: { x: 700, y: 560, s: 2.2 }, phone: { lit: 1, core: .8 } }));
// 7 the room behind the door · 8 a glimpse through the gap (portal from the gap)
await shot('07_room', (ctx, t) => S.room(ctx, t, W, H, {}));
await shot('08_portal', (ctx, t) => { const c = S.look(S.LINE.door.x, 3600, S.LINE.door.z, 1.5, 960, 520); S.lineWorld(ctx, c, t, {}); F.veil(ctx, .45); F.portal(ctx, S.gapRect(c), { x: 360, y: 150, w: 1200, h: 675 }, .8, (cx, w, h) => S.room(cx, t, w, h, {}), { rim: F.GOLD }); });
// 9 things: proof tape, calendar sheets, cores, the clipboard, a document, the parcel, a phone
await shot('09_things', (ctx, t) => {
  flat(ctx);
  F.proofTape(ctx, t, 140, 140, 220, 600, { rows: 18.5, ticks: 12.3 });
  F.calStack(ctx, t, 560, 160, 200, 40, 'YEARS', 'EXPECTED'); F.calSheet(ctx, t, 820, 160, 200, '11', 'DAYS'); F.calSheet(ctx, t, 1060, 160, 200, '30', 'HOURS', { rot: .05 });
  F.core(ctx, t, 600, 640, 160, { label: 'MYTHOS' }); F.core(ctx, t, 820, 640, 160, { dim: 1, label: 'OLDER' });
  F.clipboard(ctx, t, 1360, 120, 300, { title: 'INSPECTION', rows: [['WHO CHECKED IT?', 0, 1], ['WHAT’S NOT SHOWN?', 0, 0], ['REAL MATHEMATICS', 1, 0]] });
  F.docSheet(ctx, t, 1700, 160, 200, { title: 'NEW A.I. · TEST', band: 'VOLUNTARY' });
  S.parcel(ctx, t, 1080, 900, 180, { label: 'ASTRA 6.1', stamp: 'HELD BACK' });
  F.phone(ctx, t, 1380, 740, 220, { lit: 1, core: 1 });
  F.floorMark(ctx, t, 1700, 860, 180, 5, { lit: 1, sub: 'YOU' });
  F.priceTag(ctx, t, 300, 820, '5× LAUNCH PRICE', 1);
});
// 10 the code wall (the 27-year flaw) · 11 explainer blocks (dots, ruler, slabs, bracket, label, ?)
await shot('10_codewall', (ctx, t) => { flat(ctx); F.codeWall(ctx, t, 160, 120, 1600, 760, { hot: 14, hotU: 1, dust: 1 }); E.glowText(ctx, '27 YEARS', 960, 460, { size: 150, serif: true, align: 'center', col: P.core0 }); F.source(ctx, t, 0, 99, F.SOURCES.flaw27); });
await shot('11_explainers', (ctx, t) => {
  flat(ctx);
  F.dotField(ctx, t, { x: 140, y: 140, w: 700, h: 360, n: 400, layout: 'grid', on: (k) => (k < 129 ? 1 : 0) });
  F.ruler(ctx, t, { x: 1000, y: 260, w: 760, fill: .6, ticks: [[0, 'APR'], [.5, 'JUNE'], [1, 'AUG']], label: 'PERMISSION' });
  F.slabBars(ctx, t, { x: 1200, y: 420, w: 560, rows: [{ v: 1, col: 'gold', label: 'MYTHOS · APR', value: '100' }, { v: .33, col: 'check', label: 'NOV', value: '⅓' }] });
  F.bracket(ctx, 140, 840, 660, 1, 'ANTHROPIC’S OWN COUNT');
  F.label(ctx, 1200, 760, 'ASTRA', 'PUBLIC · PAID', 1);
  F.questionMark(ctx, t, 600, 880, 160, 1, { screen: false });
  F.checkMark(ctx, 900, 820, 120, 1); F.crossMark(ctx, 1060, 820, 120, 1);
});
// 12 the quote cards (A1, C4) — no footage, ever (R1 left the film with vo-v4)
await shot('12_quote_A1', (ctx, t) => { flat(ctx); F.quoteCard(ctx, t, T, { id: 'A1', x: 220, y: 330, w: 1440, size: 70, read: false }); });
await shot('13_quote_C4', (ctx, t) => { flat(ctx); F.quoteCard(ctx, t, T, { id: 'C4', x: 220, y: 330, w: 1440, size: 70, read: false }); });
// 14–16 the three seam plates (the frames the builders meet on)
await shot('14_plate_line', (ctx, t) => S.plateLine(ctx, t, T), T.G('At the very front stand') - .3);
await shot('15_plate_four', (ctx, t) => S.plateFour(ctx, t, T), T.G('Fourth in line stand'));
await shot('16_plate_held', (ctx, t) => S.plateHeld(ctx, t, T), T.G('That call was made inside'));
await shot('18_line_behind', (ctx, t) => S.lineWorld(ctx, S.look(-2600, 200, 6000, .55, 960, 640), t, {}));
// 17 the end screen (the free tiles for the YouTube end screen, dashed here only)
await shot('17_endscreen', (ctx, t) => {
  S.lineWorld(ctx, S.END_CAM, t, { you: { x: S.QUEUE[0].x, z: S.QUEUE[0].z }, person: (k) => (k === 0 ? { hidden: true } : {}), mark: () => ({ lit: .4 }) });
  const { left: L, right: R, subscribe: B } = S.END_TILES;
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.setLineDash([10, 8]); ctx.lineWidth = 2; ctx.strokeRect(L.x, L.y, L.w, L.h); ctx.strokeRect(R.x, R.y, R.w, R.h);
  ctx.beginPath(); ctx.arc(B.x, B.y, B.r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}, T.duration - 7);
