#!/usr/bin/env node
// Film 41 · kit sheet: stills of the recurring scenes and every kit piece (the sky = thumbnail A, the job field, your window, the switch,
// the list, the timeline, subscribe, the portrait slot, the clip plate, the three seam plates, the end screen).
//   node tools/kit_sheet41.mjs <dir> [--scale .5] [--only name,…]   (then tile to <ROOT>bild/kit41_kontakt.jpg, < 1 MB)

import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
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
  fn(ctx, t); E.finish(ctx, t, F.PRINT41);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const at = (p, d = 0) => T.G(p) + d;
await shot('01_sky_thumbA', (ctx, t) => S.sky(ctx, t, { turn: 1, ghost: 1, arrow: 1 }));
await shot('02_job_field', (ctx, t) => { F.stage(ctx, t); const fl = F.field(16, 6, 64, 14, 960, 480); const r = E.prng(3);
  for (let i = 0; i < fl.n; i++) { const [x, y] = fl.pos(i), c = fl.col(i); F.tile(ctx, t, x, y, fl.s, { v: .55 + .45 * r(), glyph: c < 6 ? 'screen' : c < 11 ? 'hand' : 'person', cold: c > 13 ? 1 : 0, gold: c > 10 && c <= 13 ? 1 : 0 }); } });
await shot('03_your_window', (ctx, t) => { F.stage(ctx, t); F.yourWindow(ctx, t, { x: 600, y: 220, w: 600, h: 450 }, { look: 1 }); F.say(ctx, t + 9, [['YOURS', t], ['TOO', t]], 900, 790, { size: 64, align: 'center' }); });
await shot('04_switch_desk', (ctx, t) => { F.stage(ctx, t); F.lever(ctx, t, 600, 400, 380, 1); F.desk(ctx, t, 1300, 800, 160, {}); F.tile(ctx, t, 600, 700, 64, { glyph: 'you', lift: 1 }); });
await shot('05_list', (ctx, t) => { F.stage(ctx, t); S.juryList(ctx, t); });
await shot('06_timeline', (ctx, t) => { F.stage(ctx, t); F.timeline(ctx, t, T); F.timeline(ctx, t, T, { big: 1 }); }, at("It's a stretch of time", 2.5));
await shot('07_subscribe_portrait', (ctx, t) => { F.stage(ctx, t); F.portrait(ctx, t, 600, 900, 600, {}); F.nameplate(ctx, t, 1000, 600, 1); F.subscribe(ctx, t, 1400, 800, 1); });
await shot('08_clip_plate', (ctx, t) => { F.stage(ctx, t); F.clipPlate(ctx, t, T, 'C1', {}); }, T.clip('C1').start + 5);
await shot('09_plateMachine', (ctx, t) => S.plateMachine(ctx, t, T), at('What changed is his picture'));
await shot('10_plateNumbers', (ctx, t) => S.plateNumbers(ctx, t, T), at('Then the numbers'));
await shot('11_plateJury', (ctx, t) => S.plateJury(ctx, t, T), at('Take the jury'));
await shot('12_endScreen', (ctx, t) => S.endScreen(ctx, t, T), T.duration - 5);
