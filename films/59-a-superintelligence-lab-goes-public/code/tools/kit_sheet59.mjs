#!/usr/bin/env node
// Film 59 · kit sheet: stills of the world and every kit piece (the city under the crystal, the three seam plates, the end camera, the
// explainer blocks, the board, the clip plate) so builders see the vocabulary before they build.
//   node tools/kit_sheet59.mjs <dir> [--scale .5]   (then: ffmpeg tile of <dir>/*.jpg, < 1 MB, to <ROOT>bild/kit59_kontakt.jpg)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
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
  fn(ctx, t); E.finish(ctx, t, F.PRINT59);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const night = (ctx) => { S.cityWorld(ctx, E.cam3(), 3, { you: false }); F.veil(ctx, .8); };
const at = (p, d = 0) => T.G(p) + d;
await shot('01_home_thumbA', (ctx, t) => S.cityWorld(ctx, E.cam3(), t, { crystal: { gap: 1 }, shard: { x: S.YOU.x + 40, y: S.YOU.y - 150, s: 40 }, beam: .6 }));
await shot('02_city_wide', (ctx, t) => S.cityWorld(ctx, E.aim(S.Z_CITY, 1200, 420, .55), t, { crystal: { gap: 1 }, city: .3, bell: { swing: .2 } }));
await shot('03_city_all_warm', (ctx, t) => S.cityWorld(ctx, E.aim(S.Z_CITY, 1200, 420, .55), t, { crystal: { gap: 1 }, city: 1 }));
await shot('04_exchange_bell', (ctx, t) => S.cityWorld(ctx, E.aim(S.Z_BELL, S.BELL.x, S.BELL.y + 260, 1.1), t, { bell: { swing: .5, ring: .6 }, you: false }));
await shot('05_seam_plateWindow', (ctx, t) => S.plateWindow(ctx, t, T), at('The seller is Anthropic'));
await shot('06_seam_plateCrystal', (ctx, t) => S.plateCrystal(ctx, t, T), at('Many doubt it'));
await shot('07_seam_plateSort', (ctx, t) => S.plateSort(ctx, t, T), at('Reports say there are'));
await shot('08_end_cam', (ctx, t) => { S.cityWorld(ctx, S.END_CAM, t, { crystal: { gap: 1 }, city: 1, shard: { x: S.YOU.x + 40, y: S.YOU.y - 150, s: 40 } }); const R = S.END_TILES; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; for (const r of [R.left, R.right]) ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.beginPath(); ctx.arc(R.sub.x, R.sub.y, R.sub.r, 0, 7); ctx.stroke(); }, T.duration - 5);
await shot('09_prospectus_open', (ctx, t) => { night(ctx); F.prospectus(ctx, t, W / 2 - 300, 200, 600, { u: 1, thick: 1, tabs: 1, open: .6, cover: 'PROSPECTUS', sub: 'FORM S-1/A' }); });
await shot('10_vote_bar_seats', (ctx, t) => { night(ctx); F.voteBar(ctx, t, 260, 330, 1400, { u: 1, pub: 1, fnd: 1, cap: 1, labels: 1 }); F.seats(ctx, t, 640, 640, 50, { f: 1, tr: 1 }); });
await shot('11_quote_card', (ctx, t) => { night(ctx); F.quoteCard(ctx, t, T, { text: F.SOURCES.s1riskText, x: 300, y: 170, w: 1320, size: 50, head: 'RISK FACTORS', credit: F.SOURCES.s1risk, mode: 'hi', spoken: ['catastrophic', 'humanity'], after: T.G('Advanced A.I.') }); }, at('humanity', 1));
await shot('12_data_paper_cards', (ctx, t) => { night(ctx); F.dataCard(ctx, t, 200, 260, 700, { title: 'EXPECTED RANGE', big: '$70–78', small: '825 MILLION SHARES', h: 250 }); F.paperCard(ctx, t, 1020, 260, 700, 250, { u: 1 }); F.priceTag(ctx, t, 1370, 640, ['NOT FOR SALE'], 1, { size: 32 }); });
await shot('13_board_big', (ctx, t) => { night(ctx); F.board(ctx, t, T, { big: 1 }); }, at('When the bell rings', 2));
await shot('14_wheel_jar_shard', (ctx, t) => { night(ctx); F.wheel(ctx, t, 560, 520, 220, { glass: 1 }); F.jar(ctx, t, 1180, 800, 420, { fill: .5, slice: 1 }); F.shard(ctx, t, 1600, 480, 70); });
await shot('15_room', (ctx, t) => { ctx.save(); ctx.translate(160, 90); F.room(ctx, t, 1600, 900, { lit: 1, seated: 1, wheel: { a: 1, glass: 1 } }); ctx.restore(); });
await shot('16_clip_plate_C2', (ctx, t) => { night(ctx); F.clipPlate(ctx, t, T, 'C2'); }, T.clip('C2').start + 4);
