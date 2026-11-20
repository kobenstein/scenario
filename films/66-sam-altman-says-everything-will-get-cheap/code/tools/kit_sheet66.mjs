#!/usr/bin/env node
// Film 66 · kit sheet: stills of the world and every kit piece (the long land, the stations, the promise, the tags in all states, the
// receipt, the pay slip, the three seam plates, the end camera, the explainer blocks, the clock, the clip plate) so builders see the
// vocabulary before they build.
//   node tools/kit_sheet66.mjs <dir> [--scale .5]   (then: ffmpeg tile of <dir>/*.jpg, < 1 MB, to <ROOT>bild/kit66_kontakt.jpg)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const { W, H, P } = E;
const dir = process.argv[2] || 'kit'; fs.mkdirSync(dir, { recursive: true });
const sc = Number(process.argv[process.argv.indexOf('--scale') + 1] || .5) || .5;
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
const T = timing(TIMING);
E.prepareEditorial?.();
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), out = createCanvas(Math.round(W * sc), Math.round(H * sc)), ox = out.getContext('2d');
async function shot(name, fn, t = 3) {
  if (only && !only.some((o) => name.startsWith(o))) return;
  await F.prepareClipFrames(T, t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  fn(ctx, t); E.finish(ctx, t, F.PRINT66);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const ALL = S.STATIONS.slice(0, 6).map((s, i) => ({ glow: .6 }));
const night = (ctx) => { S.landWorld(ctx, E.cam3(), 3, { promise: { glow: .4 }, you: false }); F.veil(ctx, .8); };
const at = (p, d = 0) => T.G(p) + d;
await shot('01_home_thumbA', (ctx, t) => { S.landWorld(ctx, E.cam3(), t, { promise: { dust: .3 } }); F.title(ctx, t, 1, { x: 80, y: 380, maxW: 1080 }); });
await shot('02_land_wide_left', (ctx, t) => S.landWorld(ctx, E.aim(S.Z_LAND, 1900, 600, 1.0), t, { tags: ALL, you: false }));
await shot('03_land_wide_right', (ctx, t) => S.landWorld(ctx, E.aim(S.Z_LAND, 4900, 600, 1.0), t, { tags: ALL, you: false, power: 1 }));
for (let i = 0; i < 7; i++) await shot(`${String(4 + i).padStart(2, "0")}_station${i + 1}`, (ctx, t) => S.landWorld(ctx, S.stationCam(i, 2.4, -60), t, { tags: S.STATIONS.map((s, j) => (j === i ? { glow: 1, lines: [[s.name.split(' ')[0], 15]] } : { glow: .4 })), you: false, power: i === 3 ? 1 : 0, cool: i === 0 ? .6 : 0, youLand: i === 6 ? { x: S.STATIONS[6].x - 120 } : null }));
await shot('11_tag_states', (ctx, t) => { night(ctx); const st = [{}, { dust: .5 }, { split: .9 }, { back: .5 }, { back: 1 }, { house: 1 }, { heavy: 1 }];
  st.forEach((o, i) => F.tag(ctx, t, 170 + i * 260, 230, 170, { thread: 200, glow: 1, lines: [['TAG', 26]], price: '$9', seed: i + 3, ...o })); });
await shot('12_receipt_thumbC', (ctx, t) => { const c = E.aim(F.F0, 700, 700, 1.0, 1400, 640); const r = S.landWorld(ctx, c, t, { promise: { glow: .7 }, you: { o: { armR: [1.6, 2.2], look: .9 } }, roof: (cx, h) => { if (!h?.R) return; } });
  const p = S.promiseRect(c), hp = E.project(c, F.F0, S.YOU.x + 50, S.YOU.y - 110); F.receipt(ctx, t, { from: [p.x + 40, p.y + 40], to: [hp[0], hp[1]], u: 1, rows: [['RENT', 1], ['GROCERIES', 1], ['THE POWER BILL', 1]] }); });
await shot('13_payslip_dollarbar', (ctx, t) => { night(ctx); F.paySlip(ctx, t, 300, 300, 260, { glow: .6 });
  F.dollarBar(ctx, t, 620, 300, 1100, { title: F.SOURCES.foodDollar, segs: [{ label: 'LABOR', share: .54, col: F.LAMP.body, big: '54¢' }, { label: 'OTHER', share: .34, col: F.PAPER.shade }, { label: 'FARM', share: .12, col: F.EARTH.warm, big: '12¢' }] });
  F.verdict(ctx, t, 960, 700, 'FALLS FIRST', 1); F.source(ctx, t, 0, 99, F.SOURCES.foodSrc); });
await shot('14_seam_platePromise', (ctx, t) => S.platePromise(ctx, t, T), at('This January'));
await shot('15_seam_plateFactory', (ctx, t) => S.plateFactory(ctx, t, T), at('So far, every price'));
await shot('16_seam_plateStairs_thumbB', (ctx, t) => S.plateStairs(ctx, t, T), at('So what does that do'));
await shot('17_end_cam', (ctx, t) => { S.landWorld(ctx, S.END_CAM, t, { you: false, city: 1, power: .4, youLand: { x: 5950, h: 64, o: { armR: [1.2, 2.2] } },
  land: (cx) => { for (let i = 0; i < 6; i++) { const p = S.END_ROW(i); F.tag(cx, t, p.x, p.y + (S.VERDICT_TAGS[i].dy ?? 0) * .5, 80, { ...S.VERDICT_TAGS[i], seed: 40 + i }); } F.tag(cx, t, 5980, S.GY - 92, 34, { thread: 0, glow: 1, rot: -.2 }); } });
  const R = S.END_TILES; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; for (const r of [R.left, R.right]) ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.beginPath(); ctx.arc(R.sub.x, R.sub.y, R.sub.r, 0, 7); ctx.stroke(); }, T.duration - 5);
await shot('18_quote_data_cards', (ctx, t) => { night(ctx); F.quoteCard(ctx, t, T, { text: F.SOURCES.gentle, x: 160, y: 140, w: 1000, size: 44, head: 'THE GENTLE SINGULARITY', credit: F.SOURCES.gentleSrc });
  F.dataCard(ctx, t, 1220, 160, 560, { title: F.SOURCES.cropland.split(':')[0], big: '$6,020', small: 'AN ACRE · FIRST TIME ABOVE $6,000', h: 260 }); });
await shot('19_board_big', (ctx, t) => { night(ctx); F.board(ctx, t, T, { big: 1 }); }, at("So that's the order", 1));
await shot('20_board_corner', (ctx, t) => { S.landWorld(ctx, S.stationCam(4, 2.2), t, { you: false, tags: [null, null, null, null, { glow: 1 }] }); F.board(ctx, t, T); }, at('So the fifth tag', 1.6));
await shot('21_clip_plate_C3', (ctx, t) => { night(ctx); F.clipPlate(ctx, t, T, 'C3'); }, T.clip('C3').start + 4);
