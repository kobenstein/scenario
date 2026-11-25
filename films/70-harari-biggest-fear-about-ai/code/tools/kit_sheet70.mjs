#!/usr/bin/env node
// Film 70 · kit sheet: stills of the vocabulary so builders see it first: the Leitbild (THE CHAIN OVER THE NIGHT: home, the turn with the
// four named links, the point with four cracks, the end), the link states, the CHAIN HUD over time, the objects (card, reader, bread,
// coins, your sleeve, the cow), THE TRUST BOARD objects (knot, somebody at a desk → the machine, quote card, data card, number), the clip
// plate with real footage, the three seam plates and the end screen.
//   node tools/kit_sheet70.mjs <dir> [--scale .5]   then: python3 tools/contact70.py <dir> <ROOT>bild/kit70_kontakt.jpg (< 1 MB)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f70_kit.mjs';
import * as S from '../lib/f70_world.mjs';
import * as X from '../lib/f70_explain.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const { W, H, P } = E;
const dir = process.argv[2] || 'kit'; fs.mkdirSync(dir, { recursive: true });
const sc = Number(process.argv[process.argv.indexOf('--scale') + 1] || .5) || .5;
const T = timing(TIMING);
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), out = createCanvas(Math.round(W * sc), Math.round(H * sc)), ox = out.getContext('2d');
async function shot(name, fn, t = 3) {
  await F.prepareClipFrames(T, t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  fn(ctx, t); E.finish(ctx, t, F.PRINT70);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const V = X.V0, board = (ctx, t) => X.board(ctx, t, V);
const ct = F.chainTimes(T);
await shot('01_leitbild_hook', (ctx, t) => { S.chainWorld(ctx, t, S.homeCam(), {}); F.title(ctx, t, 1, { sub: F.SOURCES.titleSub }); });
await shot('02_leitbild_turn_named', (ctx, t) => S.chainWorld(ctx, t, S.homeCam(), { four: 1, names: [1, 1, 1, 1], links: [{ lit: 1 }, {}, {}, {}], taut: .3 }));
await shot('03_leitbild_point_cracks', (ctx, t) => S.chainWorld(ctx, t, E.cam(1.08, 960, 600), { four: 1, names: [1, 1, 1, 1], links: F.chainState(T, ct.point[0] + 2).links.map((l) => ({ ...l, lit: .5 })), taut: 1 }), ct.point[0] + 2);
await shot('04_link_states', (ctx, t) => { board(ctx, t); const st = [{}, { lit: 1 }, { crack: 1 }, { crack: 1, mend: 1 }, { hair: 1 }, { mould: 1 }, { col: 'cool' }, { edge: true }];
  st.forEach((o, i) => { F.chainLink(ctx, t, 200 + i * 220, 460, 170, 0, o); X.label(ctx, ['PLAIN', 'LIT', 'CRACK', 'MENDED', 'STRAIN', 'MOULD', 'COOL', 'EDGE'][i], 200 + i * 220, 600, 1, { size: 22 }); });
  F.chain(ctx, t, F.catenary([120, 780], [1800, 760], 90, { sway: 6 }), { L: 60 }); });
await shot('05_hud_money_crack', (ctx, t) => { board(ctx, t); F.chainHud(ctx, t, T); X.label(ctx, 'HUD AT “SO THE FIRST LINK HOLDS”', W / 2, 540, 1, { size: 28 }); }, ct.crack[0] + 1.5);
await shot('06_hud_law', (ctx, t) => { board(ctx, t); F.chainHud(ctx, t, T); X.label(ctx, 'HUD AT “LAW”: TWO CRACKED, LAW LIT', W / 2, 540, 1, { size: 28 }); }, ct.at[2] + 1.2);
await shot('07_hud_mended', (ctx, t) => { board(ctx, t); F.chainHud(ctx, t, T); X.label(ctx, 'HUD AFTER “AND TRUST CAN BE TESTED”', W / 2, 540, 1, { size: 28 }); }, ct.mend + 3);
await shot('08_bakery', (ctx, t) => { board(ctx, t); X.counterTop(ctx, t, -100, 2100, 720, { lamp: 1, lampX: 1000 }); F.terminal(ctx, t, 1180, 706, 190, { wake: 1, check: 1, ring: .35 }); F.sleeve(ctx, t, 700, 520, { ang: -.1 }); F.payCard(ctx, t, 790, 500, 260, { rot: -.12 }); F.bread(ctx, t, 1500, 706, 300); F.coin(ctx, t, 1750, 400, 30); F.payCard(ctx, t, 300, 300, 200, { morph: .45 }); X.label(ctx, F.SOURCES.today, 960, 820, 1, { size: 34, spacing: .3 }); });
await shot('09_cow', (ctx, t) => { board(ctx, t); X.lightLine(ctx, [[0, 760], [W, 760]], 1, { a: .5, w: 2.5 }); F.cow(ctx, t, 560, 760, 300, { graze: 1 }); const c = F.cow(ctx, t, 1350, 760, 300, { look: 1, tag: 1 }); E.halo(ctx, c.tag[0], c.tag[1], 30, .5); });
await shot('10_knot_desk', (ctx, t) => { board(ctx, t); const k = X.knot(ctx, t, 760, 480, { q: 1, pulse: 1 }); X.lightLine(ctx, [[0, k.entry[1]], k.entry], 1); X.lightLine(ctx, [k.exit, [1380, 560]], 1); X.deskPerson(ctx, t, 1500, 760, 260, { lamp: 1 }); X.label(ctx, F.SOURCES.understood, 1500, 860, 1, { size: 26 }); });
await shot('11_desk_machine', (ctx, t) => { board(ctx, t); X.knot(ctx, t, 760, 480, { q: 1 }); X.deskPerson(ctx, t, 1500, 760, 260, { lamp: 1, machine: 1 }); X.big(ctx, F.SOURCES.whoTrust, 960, 200, 80, 1, { gold: .3 }); });
await shot('12_quote_q2', (ctx, t) => { board(ctx, t); F.quoteCard(ctx, t, T, { text: F.SOURCES.q2.text, credit: F.SOURCES.q2.credit, spoken: F.SOURCES.q2.spoken, size: 76, w: 1200, y: 330 }); }, T.clip('Q2').end + .3);
await shot('13_data_number', (ctx, t) => { board(ctx, t); F.dataCard(ctx, t, 200, 300, 620, { kind: 'KNOWN', title: 'MOBLEY v. WORKDAY', big: F.SOURCES.billion, small: F.SOURCES.billionWord }); F.numberRoll(ctx, 81, 1350, 520, 200, 1, { fmt: (v) => Math.round(v) + '%' }); X.label(ctx, F.SOURCES.boe81, 1350, 600, 1, { size: 26 }); F.source(ctx, t, 0, 99, F.SOURCES.boe81Src); }, 5);
await shot('14_clip_plate_C1', (ctx, t) => { board(ctx, t); F.clipPlate(ctx, t, T, 'C1'); }, T.clip('C1').start + 3);
await shot('15_plateDementia', (ctx, t) => S.plateDementia(ctx, t, T), T.G('His word for it') + .2);
await shot('16_plateLaw', (ctx, t) => S.plateLaw(ctx, t, T), T.G('Law. Rules written'));
await shot('17_plateAnvil', (ctx, t) => S.plateAnvil(ctx, t, T), T.G('Three tests'));
await shot('18_endScreen', (ctx, t) => S.endScreen(ctx, t, T), T.duration - 8);
