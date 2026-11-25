// Film 73 · kit contact sheet: every piece of lib/f73_kit.mjs + lib/f73_stage.mjs + lib/f73_world.mjs on one page (ROOT bild/kit73_kontakt.jpg).
//   node tools/kit_sheet73.mjs [out.jpg]     (each tile is drawn at 1920×1080 and scaled to 480×270; label = the API call)
import { createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as X from '../lib/f73_stage.mjs';
import * as S from '../lib/f73_world.mjs';
import { ROOT, timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const T = timing(TIMING), out = process.argv[2] || ROOT + 'bild/kit73_kontakt.jpg';
const { GOLD, COOL, CREAM, SOURCES: SRC } = F, V = X.V0, t = 3.3;
const g = (ctx) => X.ground(ctx, t, V, { lx: 960, ly: 520 });
const TILES = [
  ['S.stoneWorld (Leitbild, HOME)', (c) => { S.stoneWorld(c, t, S.HOME, { crack: .35 }); F.title(c, t, 1); }],
  ['stoneWorld { crack: 1 }', (c) => S.stoneWorld(c, t, { x: 1250, y: 560, s: 1.15 }, { crack: 1 })],
  ['stoneWorld { drawing: 1 } (H.03)', (c) => S.stoneWorld(c, t, { x: 1250, y: 560, s: 1.1 }, { crack: .5, drawing: 1 })],
  ['stoneWorld { town: 1 } (turn) / endScreen', (c) => S.endScreen(c, T.duration - 8, T)],
  ['X.lifeline { age, ageU, end } (a life)', (c) => { g(c); X.inView(c, V, (s) => { X.lifeline(c, t, 200, 1700, 600, s, { age: 1250, ageU: 1, end: 1 }); X.yearTag(c, '1985', 200, 600, 1, s, { below: true, size: 34 }); X.yearTag(c, '2032', 860, 600, 1, s, { gold: 1 }); }); }],
  ['lifeline { open: 1 } (no end date) · cool (the copy)', (c) => { g(c); X.inView(c, V, (s) => { X.lifeline(c, t, 200, 1300, 460, s, { end: 1, lift: 1, open: 1, openTo: 2100 }); X.lifeline(c, t, 200, 1500, 700, s, { col: 'cool', w: 4 }); }); }],
  ['F.answer (the motor) · cool · tags', (c) => { g(c); F.answer(c, t, 960, 360, 640, -.6, { top: SRC.healthy }); F.answer(c, t, 960, 640, 640, .1, { cool: true, tags: ['REPAIR', 'COPY'] }); }],
  ['F.paperCard (THE OFFER) · X.big · X.label · dateTag', (c) => { g(c); F.paperCard(c, t, 300, 300, 520, 214, { head: SRC.offerHead, lines: [[SRC.offer[0], 40, 0, false], [SRC.offer[1], 40, .6, false]] }); X.big(c, '2459', 1380, 470, 200, 1); X.label(c, SRC.centuries, 1380, 560, 1, { size: 30 }); X.dateTag(c, 'AROUND 2030', 1380, 680, 1, { gold: true }); }],
  ['F.bodyDrawing (worn → fix) · F.headProfile', (c) => { g(c); X.inView(c, V, (s) => { F.bodyDrawing(c, t, 520, 820, 520, { worn: 1, fix: 0, dims: 1 }); F.bodyDrawing(c, t, 960, 820, 520, { fix: 1 }); F.headProfile(c, t, 1440, 820, 420); }); }],
  ['F.computer · F.aiRing + F.beam (AI = a disc)', (c) => { g(c); X.inView(c, V, (s) => { F.computer(c, t, 560, 800, 560, { on: 1 }); F.aiRing(c, t, 1400, 300, 70, { think: 1 }); F.beam(c, 1400, 300, 1500, 820, 1, { w: 60 }); X.lifeline(c, t, 1100, 1800, 820, s, { end: 1, age: 1500 }); }); }],
  ['F.fly real / virtual (walk, groom, feed) · drop', (c) => { g(c); F.fly(c, t, 420, 540, 300, { style: 'real', rot: -.3 }); F.fly(c, t, 1000, 540, 300, { style: 'virtual', walk: t * 5, rot: Math.PI / 2 }); F.fly(c, t, 1520, 540, 300, { style: 'virtual', groom: 1, feed: 1 }); F.drop(c, 1520, 400, 14); }],
  ['F.flyBrain (wire by wire) gold / cool + fire', (c) => { g(c); F.flyBrain(c, t, 520, 520, 360, { u: .75 }); F.flyBrain(c, t, 1420, 520, 360, { col: 'cool', fire: 1 }); }],
  ['F.cell { predict, drug } · F.geneRow { scan, pick }', (c) => { g(c); F.cell(c, t, 520, 500, 190, { predict: 1, drug: .6, react: .3 }); F.geneRow(c, t, 1000, 520, 760, 24, { scan: .7, pick: 11 }); }],
  ['F.mouse old / boosted · X.bar', (c) => { g(c); F.mouse(c, t, 520, 700, 420, { old: 1 }); F.mouse(c, t, 1100, 700, 420, { old: .6, glow: 1 }); X.bar(c, 1520, 820, 70, 420, 1, { col: 'age' }); X.bar(c, 1640, 820, 70, 480, 1); }],
  ['F.dots (100 = 1 % each) · F.rings · F.house', (c) => { g(c); F.dots(c, t, 200, 260, { on: 56 }); F.rings(c, t, 1100, 420, 90); F.house(c, t, 1500, 820, 300, { lit: 1 }); F.house(c, t, 1180, 820, 260, { lit: 0 }); }],
  ['F.brainSide { cube } (1 mm³) · F.dataCard', (c) => { g(c); F.brainSide(c, t, 560, 540, 360, { cube: 1, cubeSize: 10 }); F.dataCard(c, t, 1120, 330, 560, { kind: 'KNOWN', title: 'MICE, OLD FEMALES', big: SRC.mice14, small: '778 → 886 DAYS', src: 'NATURE AGING, 2026' }); }],
  ['F.quoteCard (spoken words light) · F.source', (c) => { g(c); F.quoteCard(c, t, T, { text: SRC.z3.text, credit: SRC.z3.credit, w: 1100, y: 260 }); F.source(c, t, 0, 99, SRC.z3.src); }],
  ['S.plate2032 (Lead → B1)', (c) => S.plate2032(c, T.G('The date comes from'), T)],
  ['S.plateTwoAnswers (B1 → B2)', (c) => S.plateTwoAnswers(c, T.G('Which brings back'), T)],
  ['S.plateTop (B2 → B3)', (c) => S.plateTop(c, T.G('And at the very top'), T)],
];
const TW = 480, TH = 270, COLS = 4, ROWS = Math.ceil(TILES.length / COLS);
const sheet = createCanvas(TW * COLS, TH * ROWS), sx = sheet.getContext('2d');
sx.fillStyle = '#080b27'; sx.fillRect(0, 0, sheet.width, sheet.height);
for (const [i, [name, fn]] of TILES.entries()) {
  const big = createCanvas(1920, 1080), bx = big.getContext('2d'); fn(bx);   // a fresh canvas per tile (napi draws lazily) E.finish(bx, t, F.PRINT73);
  const x = (i % COLS) * TW, y = Math.floor(i / COLS) * TH; sx.drawImage(big, x, y, TW, TH);
  sx.fillStyle = 'rgba(8,11,39,.7)'; sx.fillRect(x, y + TH - 24, TW, 24); sx.fillStyle = '#f3efe2'; sx.font = '600 13px Inter'; sx.fillText(name, x + 8, y + TH - 8);
}
fs.writeFileSync(out, await sheet.encode('jpeg', 84)); console.log(out, fs.statSync(out).size >> 10, 'KB');
