#!/usr/bin/env node
// Film 67 · kit sheet: stills of the world and every kit piece (home = thumbnail A, the stations, the headline, the file, the ribbon, the
// referee + gold card, the paper tower, the balance, the checklist in all states, Jakob's assets (X post header, quote crops with the
// highlighter, the portrait print), the clip plate, the three seam plates, the end screen) so builders see the vocabulary first.
//   node tools/kit_sheet67.mjs <dir> [--scale .5] [--only name,…]   (then tile to <ROOT>bild/kit67_kontakt.jpg, < 1 MB)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const { W, H, P } = E;
const dir = process.argv[2] || 'kit'; fs.mkdirSync(dir, { recursive: true });
const sc = Number(process.argv[process.argv.indexOf('--scale') + 1] || .5) || .5;
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
const T = timing(TIMING);
E.prepareEditorial?.(); await F.prepareAssets();
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), out = createCanvas(Math.round(W * sc), Math.round(H * sc)), ox = out.getContext('2d');
async function shot(name, fn, t = 3) {
  if (only && !only.some((o) => name.startsWith(o))) return;
  await F.prepareClipFrames(T, t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  fn(ctx, t); E.finish(ctx, t, F.PRINT67);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const night = (ctx) => { S.landWorld(ctx, E.cam3(), 3, { head: { dim: .6 }, you: false }); F.veil(ctx, .8); };
const at = (p, d = 0) => T.G(p) + d;
await shot('01_home_thumbA', (ctx, t) => S.landWorld(ctx, S.HOME(), t, {}));
await shot('02_land_wide', (ctx, t) => S.landWorld(ctx, S.landCam(2600, 640, .62), t, { ribbon: { u: 1 }, tower: { u: 1 }, chair: { card: 1 }, labs: 1, hall: 1, windows: 1 }));
await shot('03_town_bridge_hall', (ctx, t) => S.landWorld(ctx, S.landCam(-900, 700, 1.4), t, { hall: 1, windows: .6, you: false }));
await shot('04_board_spot_file', (ctx, t) => S.landWorld(ctx, S.BOARD_CAM(), t, { board: { spot: 1, robot: 1 }, land: (cx) => F.file(cx, t, S.BOARD.spot.x, S.BOARD.spot.y, 90, { scan: .6 }) }));
await shot('05_tower_author', (ctx, t) => S.landWorld(ctx, S.landCam(2000, 600, 1.2), t, { tower: { u: 1, pour: 1, from: [S.BOARD.spot.x, S.BOARD.spot.y] }, author: { x: 1820 }, you: { x: 1720 }, board: { chalk: 1 } }));
await shot('06_referee_ribbon_card', (ctx, t) => S.landWorld(ctx, S.REFEREE_CAM(), t, { ribbon: { u: 1 }, chair: { card: 1 }, you: false }));
await shot('07_labs_billboard', (ctx, t) => S.landWorld(ctx, S.LABS_CAM(), t, { labs: 1, billboard: 1, otherLab: 1, you: false }));
await shot('08_objects', (ctx, t) => { night(ctx); F.file(ctx, t, 200, 300, 160, { scan: .5 }); F.goldCard(ctx, t, 420, 420, 120, {}); F.referee(ctx, t, 640, 520, 260, { card: 1 });
  F.paperTower(ctx, t, 900, 820, 200, 600, {}); F.balance(ctx, t, 1400, 330, 260, { tilt: .8, left: (c, x, y) => F.notebook(c, t, x, y, 150), right: (c, x, y) => F.file(c, t, x, y - 50, 70) });
  F.ribbon(ctx, t, [[1100, 760], [1500, 720], [1900, 700]], { u: .8, w0: 60, w1: 10 }); });
await shot('09_checklist_states', (ctx, t) => { night(ctx); F.checklist(ctx, t, T); F.checklist(ctx, t, T, { big: 1 }); }, at('So, is he right', 1));
await shot('10_checklist_check2', (ctx, t) => { S.landWorld(ctx, S.REFEREE_CAM(), t, { ribbon: { u: 1 }, chair: { card: 1 }, you: false }); F.checklist(ctx, t, T); }, at('Check two', 2));
await shot('11_xpost_quotes', (ctx, t) => { night(ctx); F.xPost(ctx, t, 120, 110, 760, { u: 1 }); F.xQuote(ctx, t, 'alien', 120, 360, 820, { hiU: 1 }); F.xQuote(ctx, t, 'homework', 1000, 140, 800, { hiU: .6 }); F.xQuote(ctx, t, 'handover', 1000, 520, 800, { hiU: 1 }); });
await shot('12_portrait_name', (ctx, t) => { S.landWorld(ctx, S.WANG_CAM(), t, { post: 1, head: { dim: .4 } }); F.veil(ctx, .45); F.portrait(ctx, t, 1260, 860, 640, {}); F.nameplate(ctx, t, 170, 760, 1); });
await shot('13_clip_plate_C1', (ctx, t) => { night(ctx); F.clipPlate(ctx, t, T, 'C1'); }, T.clip('C1').start + 4);
await shot('14_seam_plateWang', (ctx, t) => S.plateWang(ctx, t, T), at('The man is Alexandr Wang'));
await shot('15_seam_plateReferee', (ctx, t) => S.plateReferee(ctx, t, T), at("That leaves Wang's boldest"));
await shot('16_seam_plateHandover', (ctx, t) => S.plateHandover(ctx, t, T), at('Not like a coup'));
await shot('17_end_screen', (ctx, t) => { S.endScreen(ctx, t, T); const R = S.END_TILES; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; for (const r of [R.left, R.right]) ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.beginPath(); ctx.arc(R.sub.x, R.sub.y, R.sub.r, 0, 7); ctx.stroke(); }, T.duration - 5);
