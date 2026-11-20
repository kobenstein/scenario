#!/usr/bin/env node
// Film 26 · kit sheet: stills of the places and the kit pieces (the hill = thumbnail A, your street, your room, the studio, the shop,
// the sky field pieces, the test card, the clip plate, the three seam plates) so builders see the vocabulary before they build.
//   node tools/kit_sheet26.mjs <dir> [--scale .5] [--only name,name]
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f26_kit.mjs';
import * as S from '../lib/f26_seams.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const { W, H, P } = E, F0 = E.F0;
const dir = process.argv[2] || 'kit'; fs.mkdirSync(dir, { recursive: true });
const ai = process.argv.indexOf('--scale'), sc = ai > 0 ? Number(process.argv[ai + 1]) : .5;
const oi = process.argv.indexOf('--only'), only = oi > 0 ? process.argv[oi + 1].split(',') : null;
const T = timing(TIMING), TT = F.testTimes(T);
E.prepareEditorial?.();
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), out = createCanvas(Math.round(W * sc), Math.round(H * sc)), ox = out.getContext('2d');
async function shot(name, fn, t = 3) {
  if (only && !only.some((o) => name.includes(o))) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  fn(ctx, t); E.finish(ctx, t, F.PRINT26);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
// 01 the guiding image (thumbnail A): the hill, the giant cracked piggy, the coins, you, the title
await shot('01_hill_title', (ctx, t) => { S.hillWorld(ctx, S.HILL_CAM, t, {}); F.title(ctx, t, 100, 330, 1, { size: 200 }); F.source(ctx, t, 0, 99, F.SOURCES.x); }, 1.2);
// 02 the hill wide (camera back + up a little: the river, the unfinished bridge)
await shot('02_hill_wide', (ctx, t) => S.hillWorld(ctx, E.aim(F0, 900, 480, .62), t, { window: 1 }), 4);
// 03 the sky door: what the camera sees up there (stars + far city tops only)
await shot('03_sky', (ctx, t) => S.hillWorld(ctx, S.SKY_CAM, t, {}), 4);
// 04 your street (home)
await shot('04_street', (ctx, t) => S.streetWorld(ctx, S.STREET_CAM, t, { room: { page: 0, label: S.CAL_LABEL } }), 4);
// 05 your room through your window (du drops a coin; the calendar)
await shot('05_room', (ctx, t) => S.streetWorld(ctx, E.aim(F0, 570, 525, 3.4), t, { room: { page: 1.3, label: S.CAL_LABEL, fig: { armR: [1.2, .6] } } }), 4);
// 06 the older you at the same window, the piggy full in her hands
await shot('06_room_older', (ctx, t) => S.streetWorld(ctx, E.aim(F0, 570, 525, 3.4), t, { room: { page: 35, label: S.CAL_LABEL, gold: S.CAL_GOLD, who: 'older', fig: S.HOLD, hold: 1, piggy: { fill: 1 } } }), 4);
// 07 the shop window, filled, tags at $0
await shot('07_shop', (ctx, t) => S.streetWorld(ctx, E.aim(F0, 1470, 790, 2.2), t, { shop: { fill: 1, zero: 1 } }), 4);
// 08 the studio behind the ON AIR window
await shot('08_studio', (ctx, t) => S.streetWorld(ctx, E.aim(F0, 1440, 380, 3.6), t, {}), 4);
// 09 sky field pieces: balance, coin stack, price tags, check, quote card, calendar, goods
await shot('09_pieces', (ctx, t) => {
  S.hillWorld(ctx, S.SKY_CAM, t, { du: false, fountain: false });
  F.balance(ctx, t, 420, 260, 520, .18, { u: 1, labels: ['YOUR SAVINGS', 'HIS FUTURE'], left: (c, x, y) => F.piggy(c, t, x, y, 70, { crack: 0, warm: 0 }), right: (c, x, y) => E.halo(c, x, y - 34, 70, .9) });
  F.coinStack(ctx, t, 900, 520, 14, 40, { value: '$1', label: 'A TV · 2000' }); F.coinStack(ctx, t, 1040, 520, 1, 40, { value: '2¢', label: '2025' });
  F.priceTag(ctx, t, 1250, 120, 120, '$0', { col: 'gold', serif: true }); F.priceTag(ctx, t, 1430, 120, 120, '$400', { torn: .6 });
  F.check(ctx, t, 1180, 380, 560, { from: 'U.S. TREASURY', pay: 'Everyone', no: 'No. 00-000-001', dashed: false, amount: '', date: '', blink: { amount: 1 } });
  F.qcard(ctx, t, 120, 600, 480, 220, F.QUOTES.wontmatter, 1);
  F.check(ctx, t, 640, 690, 420, { pay: 'You', dashed: true });
  F.calendar(ctx, t, 1250, 680, 110, 2.3, { label: S.CAL_LABEL });
  ['bread', 'shoe', 'books', 'lamp', 'cup', 'tv', 'flat', 'chair', 'box'].forEach((k, i) => F.goods(ctx, k, 1420 + (i % 3) * 140, 760 + Math.floor(i / 3) * 110, 70));
  F.rover(ctx, t, 1150, 1000, 90, {});
}, 4);
// 10 marks + the test card big (written), and in the corner with a headline
await shot('10_test_big', (ctx, t) => { S.hillWorld(ctx, S.HILL_CAM, t, {}); F.testCard(ctx, t, T, { at: [620, 470, .95] }); }, TT.corner - 1);
await shot('11_test_corner', (ctx, t) => { S.streetWorld(ctx, S.STREET_CAM, t, {}); F.testCard(ctx, t, T); }, (TT.mark[2] ?? 330) + 1.4);
await shot('12_test_final', (ctx, t) => { S.hillWorld(ctx, S.HILL_CAM, t, { deck: .6 }); F.testCard(ctx, t, T); }, (TT.adviceMark ?? 613) + 2);
// 13 the clip plate (placeholder) grown out of the monitor
await shot('13_clip', (ctx, t) => { S.streetWorld(ctx, E.aim(F0, 1440, 380, 3.6), t, {}); F.clipPlate(ctx, t, T, 'C1', {}); }, T.clip('C1').start + 3);
await shot('13b_clip_card', (ctx, t) => { process.env.F26_C1 = 'card'; S.streetWorld(ctx, E.aim(F0, 1440, 380, 3.6), t, {}); F.clipPlate(ctx, t, T, 'C1', {}); delete process.env.F26_C1; }, T.clip('C1').start + 5);
// 14–16 the seam plates
await shot('14_plateCondition', (ctx, t) => S.plateCondition(ctx, t, T), T.G('And behind that picture'));
await shot('15_plateMailbox', (ctx, t) => S.plateMailbox(ctx, t, T), T.G('Someone pays you an income', 1));
await shot('16_platePiggy', (ctx, t) => S.platePiggy(ctx, t, T), T.G("If he's wrong, you're still fine", 1));
// 17 the ending: the bridge built by the dust
await shot('17_bridge', (ctx, t) => S.hillWorld(ctx, E.aim(F0, 820, 330, .75), t, { deck: 1 }), 5);
