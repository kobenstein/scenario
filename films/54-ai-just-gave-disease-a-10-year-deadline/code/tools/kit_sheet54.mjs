#!/usr/bin/env node
// Film 54 · kit sheet: stills of every kit piece (the hall of relics wide, the vitrines, the doctor's office diorama, the two dates, the
// deadline board, the wall text, the explainer blocks, the pipeline, the clip plates, the three seam plates) so builders see the vocabulary
// before they build.   node tools/kit_sheet54.mjs <dir> [--scale .5]   (then a contact sheet of <dir>/*.jpg, < 1 MB, to <ROOT>bild/)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f54_kit.mjs';
import * as S from '../lib/f54_seams.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const { W, H, P, F0 } = E;
const dir = process.argv[2] || 'kit'; fs.mkdirSync(dir, { recursive: true });
const sc = Number(process.argv[process.argv.indexOf('--scale') + 1] || .5) || .5;
const T = timing(TIMING);
E.prepareEditorial?.();
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), out = createCanvas(Math.round(W * sc), Math.round(H * sc)), ox = out.getContext('2d');
async function shot(name, fn, t = 3) {
  await F.prepareClipFrames(T, t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  fn(ctx, t); E.finish(ctx, t, F.PRINT54);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const flat = (ctx) => { ctx.fillStyle = P.night1; ctx.fillRect(0, 0, W, H); };
const LATE = T.duration - 20;
// 1 the hall wide: plague vitrine, the diorama, the four vitrines, the doorway (subscribe 1), the panel, lectern, kiosk, post
await shot('01_hall_wide', (ctx, t) => S.hallWorld(ctx, E.aim(F0, 2600, 470, .52), t, { door: .6 }));
await shot('02_hall_east', (ctx, t) => S.hallWorld(ctx, E.aim(F0, 6600, 520, .6), t, { frame: { u: 1, cap: 1 }, lectern: { lamp: 1, open: 0 }, kiosk: { glow: .5 }, post: { lit: .6 }, du: false }));
// 3 thumbnail A: vitrine 1, the cell, DEADLINE: 2036 on the glass, the thesis line
await shot('03_thumb_cell', (ctx, t) => {
  S.hallWorld(ctx, E.aim(F0, 1440, 560, 1.35, 1180, 560), t, {});
  F.thesis(ctx, t, 110, 300, 1, { lines: ['AI GAVE DISEASE', 'A DEADLINE'], size: 104 });
});
// 4 the four specimens close (cell, heart, mind, brain) + a relic (cream-grey)
await shot('04_specimens', (ctx, t) => {
  flat(ctx);
  [['cell', 300], ['heart', 720], ['mind', 1140], ['brain', 1560]].forEach(([k, x], i) => {
    F.vitrine(ctx, t, x, 760, 340, 400, { glow: 1, inside: (cx, w, h) => F.specimen(cx, t, k, w / 2, h * .47, k === 'cell' ? w * .27 : w * .28, { seed: 54 + i }) });
    F.plaque(ctx, t, x, 830, 230, { name: ['CANCER', 'HEART DISEASE', 'MENTAL ILLNESS', "ALZHEIMER'S"][i], q: i === 3 ? 1 : 0 });
  });
  F.plagueMask(ctx, t, 180, 1000, 110, {});
});
// 5 the doctor's office diorama (four word cards on the desk) + the relic version
await shot('05_diorama', (ctx, t) => {
  flat(ctx);
  F.diorama(ctx, t, 520, 640, 760, 470, { lit: 1, inside: (cx, w, h) => S.officeRoom(cx, t, w, h, { lit: 1, you: { a: 1, hand: 1 }, cards: [['CANCER', 1, 0, 0], ["ALZHEIMER'S", 1, 0, 1], ['HEART DISEASE', 1, 0, 2], ['DEPRESSION', 1, 0, 3]] }) });
  F.plaque(ctx, t, 520, 700, 250, { name: "A DOCTOR'S OFFICE", sub: '2026' });
  F.diorama(ctx, t, 1400, 640, 760, 470, { lit: .5, inside: (cx, w, h) => S.officeRoom(cx, t, w, h, { lit: .5, relic: 1 }) });
  F.plaque(ctx, t, 1400, 700, 250, { name: "A DOCTOR'S OFFICE", sub: 'A RELIC' });
});
// 6 THE TWO DATES (the recurring explainer): empty, found, found + wait, both
await shot('06_two_dates', (ctx, t) => {
  flat(ctx);
  F.twoDates(ctx, t, 120, 120, 1.15, { name: 'EVERY CURE', found: 0, proven: 0, blink: .5 });
  F.twoDates(ctx, t, 1000, 120, 1.15, { name: 'CANCER', found: 1, wait: .7, waitTag: 'WEEKS' });
  F.twoDates(ctx, t, 120, 560, 1.15, { name: "ALZHEIMER'S", found: 1, wait: .12, waitTag: 'DECADES' });
  F.twoDates(ctx, t, 1000, 560, 1.15, { name: 'HEART DISEASE', found: 1, proven: 1, wait: 1 });
});
// 7 the deadline board, every row answered (late in the film), big
await shot('07_board', (ctx, t) => { S.hallWorld(ctx, S.MIND_CAM, t, { moon: .5, du: false }); F.board(ctx, t, T, { a: 1 }); }, LATE - 60);
// 8 the wall text C1 (read by the narrator) + the roadshow frame
await shot('08_wall_C1', (ctx, t) => { S.hallWorld(ctx, E.aim(F0, 5600, 500, 1), t, { du: false, panel: (cx) => F.wallText(cx, t, T, { id: 'C1', x: 4990, y: 360, w: 1260, size: 76, credit: 1 }) }); }, T.clip('C1').end - .5);
await shot('09_roadshow_frame', (ctx, t) => S.plateRoadshow(ctx, t, T), T.G("He didn't invent it"));
// 10 the essay on the lectern, the magnifier
await shot('10_essay', (ctx, t) => {
  flat(ctx);
  F.lectern(ctx, t, 520, 980, 760, { lamp: 1 });
  F.essay(ctx, t, 1300, 520, 820, { open: 1, lens: { x: .1, y: .05, r: .16, u: 1, text: 'NOT INSTANT', hi: ['NOT', 'INSTANT'] } });
});
// 11 explainer blocks: molecules, spark, blood tube, scan, dots, ruler, slabs, bracket, label, source, tag, ?
await shot('11_explainers', (ctx, t) => {
  flat(ctx);
  for (let i = 0; i < 6; i++) F.molecule(ctx, t, 140 + i * 110, 170, 80, i + 1, {});
  F.spark(ctx, t, 860, 170, 10, { dir: [1, 0] });
  F.bloodTube(ctx, t, 1000, 300, 220, { fill: .8, glow: 1 });
  F.scan(ctx, t, 1450, 220, 420, { tumor: .4, label: 'WEEK 6' });
  F.dotField(ctx, t, { x: 120, y: 330, w: 760, h: 240, n: 55, layout: 'grid', cols: 11, r: 11, u: 1, on: (k) => (k % 3 === 0 ? 1 : 0) });
  F.ruler(ctx, t, { x: 120, y: 660, w: 760, u: 1, fill: .35, ticks: [[0, 'IDEA'], [1, '15 YEARS']], minor: 15, label: 'DNA FOR LIFE' });
  F.slabBars(ctx, t, { x: 1220, y: 520, w: 520, rows: [{ v: 1, col: 'stone', label: 'SUGAR PILL', value: '' }, { v: .55, col: 'mint', label: 'DIGITAL TWIN', value: '' }] });
  F.bracket(ctx, 1080, 1780, 700, 1, 'ALL STILL IN THE LAB');
  F.label(ctx, 1100, 860, 'LDL HALVED', 'ONE INFUSION', 1);
  F.tag(ctx, t, 560, 760, 'MANY KINDS', 1);
  F.questionMark(ctx, t, 820, 880, 160, 1);
  F.source(ctx, t, 0, null, 'Source: Generate Biomedicines / Anthropic, Oct 2026');
});
// 12 the glass pipeline (discovery speeds up, proof jams)
await shot('12_pipeline', (ctx, t) => { flat(ctx); F.pipeline(ctx, t, { x: 160, y: 520, w: 1600, h: 220, neck: .62, flow: 1, jam: .8, labels: 1, u: 1 }); });
// 13–15 the clip plates (C3 Dwarkesh, C2, C5 audio only)
for (const id of ['C3', 'C2', 'C5']) {
  const k = T.clip(id);
  await shot(`13_clip_${id}`, (ctx, t) => { S.hallWorld(ctx, S.KIOSK_CAM, t, { kiosk: { glow: .5 }, du: false }); F.clipPlate(ctx, t, T, id, { morph: 1 }); }, k.start + 3);
}
// 16–18 the three seam plates (the frames the builders meet on)
await shot('16_plate_roadshow', (ctx, t) => S.plateRoadshow(ctx, t, T), T.G("He didn't invent it") - .3);
await shot('17_plate_mind', (ctx, t) => S.plateMind(ctx, t, T), T.G('The third disease answers fast'));
await shot('18_plate_kiosk', (ctx, t) => S.plateKiosk(ctx, t, T), T.G('He even warned of a jam'));
// 19 the end screen hall (four plinths, the free tiles for the YouTube end screen)
await shot('19_endscreen', (ctx, t) => {
  S.hallWorld(ctx, S.END_CAM, t, { moon: .55, door: .5, du: false, fg: false });
  const { left: L, right: R, subscribe: B } = S.END_TILES;   // dashed: where YouTube puts its elements (not in the film)
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.setLineDash([10, 8]); ctx.lineWidth = 2; ctx.strokeRect(L.x, L.y, L.w, L.h); ctx.strokeRect(R.x, R.y, R.w, R.h);
  ctx.beginPath(); ctx.arc(B.x, B.y, B.r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}, T.duration - 7);
