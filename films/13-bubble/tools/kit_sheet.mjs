#!/usr/bin/env node
// Kit sheet: every motif of lib/bubble_kit.mjs on one 1920×1080 night page, for review (and as a visual API reference for builders).
//   node tools/kit_sheet.mjs <out.jpg> [t]
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as B from '../lib/bubble_kit.mjs';
const out = process.argv[2] || 'kit_sheet.jpg', t = Number(process.argv[3] || 3);
const c = createCanvas(1920, 1080), ctx = c.getContext('2d');
E.prepareEditorial();
E.nightSky(ctx, [[0, E.P.night0], [.5, E.P.night1], [1, E.P.ind0]]);
E.stars(ctx, 3, 120, t, [0, 0, 1920, 700], .7);
const lab = (s, x, y) => E.glowText(ctx, s, x, y, { size: 18, glow: false, col: E.P.halo2 });
// bubble over a data center (the hook)
B.dataCenter(ctx, 40, 470, 560, 110, t, { lum: .8, gate: 320 });
B.bubble(ctx, 320, 230, 150, t, { thin: 0, tremble: 0 });
B.worker(ctx, 300, 520, 46, t, { look: .8 }); B.worker(ctx, 345, 522, 44, t, { dir: -1, seed: 2 });
lab('bubble() · dataCenter() · worker()', 40, 600);
// bubble thin + popping
B.bubble(ctx, 780, 200, 100, t, { thin: 1, tremble: 1 }); B.bubble(ctx, 1010, 200, 100, t, { pop: .45 });
lab('bubble thin+tremble · pop .45', 690, 330);
// banknotes and flip
B.banknote(ctx, 1260, 110, 220, -.1, {}); B.banknote(ctx, 1260, 250, 160, .15, { glow: .8 });
B.flip(ctx, .42, 1520, 150, 220, 145, (x, sx) => B.banknote(x, 1520, 150, 220, 0, { sx }), (x, sx) => B.certificate(x, 1520, 150, 220, 0, { sx }));
B.flip(ctx, .7, 1760, 150, 220, 145, (x, sx) => B.banknote(x, 1760, 150, 220, 0, { sx }), (x, sx) => B.certificate(x, 1760, 150, 220, 0, { sx }));
lab('banknote() · flip(banknote → certificate)', 1150, 330);
// the savers' table
ctx.fillStyle = E.lin(ctx, 0, 380, 0, 700, [[0, E.P.ind2], [1, E.P.night1]]); ctx.fillRect(620, 370, 1280, 330);
E.halo(ctx, 700, 420, 260, .5, E.P.halo1, E.P.core1);
B.certificate(ctx, 820, 520, 260, -.05, { glow: .6 }); B.purse(ctx, 1010, 600, 90, { full: 1 }); B.purse(ctx, 1110, 610, 90, { full: 0 });
B.coin(ctx, 960, 470, 14, { lit: .5 }); B.coin(ctx, 990, 488, 14);
B.teacup(ctx, 1190, 470, 38, t, { ripple: 1 });
B.newspaper(ctx, 1290, 390, 300, 290, { date: 'OCTOBER 1845', mast: 'THE ARGUS' });
B.inkLine(ctx, [[1320, 560], [1560, 560], [1600, 650]], .9, { w: 3 });
B.quill(ctx, 1700, 600, t, { s: 90 });
lab('certificate · purse full/empty · coin · teacup · newspaper · inkLine · quill', 640, 690);
// locomotive print → real
B.loco(ctx, 160, 840, 90, t, { ink: 1 }); B.loco(ctx, 430, 840, 110, t, { ink: 0, steam: 1, spin: t * 3, beam: 1 });
lab('loco ink=1 → ink=0 (lamp, steam, beam)', 40, 880);
// rail, train, phone, ticket
B.mist(ctx, 840, 60, .8);
B.rail(ctx, 640, 1400, 900, t, { ink: 0 }); B.rail(ctx, 640, 1400, 960, t, { ink: 1, sleepers: .6, ballast: 0 });
B.train(ctx, 1380, 900, 600, 110, t, { door: .7, doorX: 260 });
lab('mist · rail (iron / ink) · train door .7', 640, 1000);
B.phone(ctx, 1520, 880, 150, -.1, t, { screen: B.fundScreen(1) });
B.ticket(ctx, 1760, 880, 240, .08, { glow: .6 }); B.ticket(ctx, 1760, 990, 200, -.05, { lines: ['BASIC', 'GOOD AI · SMALL FIXED PRICE'] });
lab('phone(fundScreen) · ticket', 1450, 1050);
E.finish(ctx, t, { grain: 14, floor: 4, vig: .3 });
fs.writeFileSync(out, await c.encode('jpeg', 88)); console.log(out);
