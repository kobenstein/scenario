// Film 72 · kit contact sheet: every piece of lib/f72_kit.mjs + lib/f72_stage.mjs + lib/f72_world.mjs on one page (ROOT bild/kit72_kontakt.jpg).
//   node tools/kit_sheet72.mjs [out.jpg] [--big dir]   (each tile is drawn at 1920×1080 and scaled to 480×270; label = the API call;
//   --big writes every tile at full size too, for review)
import { createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f72_kit.mjs';
import * as X from '../lib/f72_stage.mjs';
import * as S from '../lib/f72_world.mjs';
import { ROOT, timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const T = timing(TIMING), args = process.argv.slice(2), bigDir = args.includes('--big') ? args[args.indexOf('--big') + 1] : null;
const out = args.find((a) => a.endsWith('.jpg')) || ROOT + 'bild/kit72_kontakt.jpg';
const { GOLD, COOL, CREAM, SOURCES: SRC } = F, V = X.V0, t = 3.3, LY = X.LINE_Y;
const g = (ctx, o = {}) => X.ground(ctx, t, V, { lx: 960, ly: 420, ...o });
const TILES = [
  ['S.valleyWorld (Leitbild A2, HOME) + F.title', (c) => { S.valleyWorld(c, t, S.HOME, {}); F.title(c, t, 1); }],
  ['valleyWorld { flat: .5 } (the slope flattens)', (c) => S.valleyWorld(c, t, { x: 1250, y: 560, s: 1 }, { flat: .5 })],
  ['valleyWorld { flat: 1 } = THE GROUND LINE stage', (c) => S.valleyWorld(c, t, { x: 1050, y: 520, s: .9 }, { flat: 1 })],
  ['F.hatch { open, tilt } · lid shut / lifting / open', (c) => { g(c); X.inView(c, V, (s) => { F.hatch(c, t, 420, 640, 420, { open: 0, glow: .2 }); F.hatch(c, t, 980, 640, 420, { open: .25 }); F.hatch(c, t, 1540, 640, 420, { open: 1 }); F.hatch(c, t, 980, 900, 240, { tilt: .075, open: .7 }); }); }],
  ['F.list (THE LIST: thin · bold · half · US circled)', (c) => { g(c); X.inView(c, V, () => F.list(c, t, 960, 520, { s: .9, rows: [{ strike: 1, kind: 'thin', verdict: SRC.verdicts[0], vu: 1 }, { strike: 1, kind: 'bold', verdict: SRC.verdicts[1], vu: 1 }, { strike: 1, kind: 'half', verdict: SRC.verdicts[2], vu: 1 }, { peel: 1, circle: 1, lit: 1 }] })); }],
  ['F.list plate state (row 2 ?, row 4 redacted + ghost) = S.plateList', (c) => S.plateList(c, T.G('There are three obvious suspects'), T)],
  ['F.lanternPerson · F.lanternRow · F.du', (c) => { g(c); X.inView(c, V, (s) => { X.groundLine(c, 0, 1920, 760, s); F.lanternRow(c, t, 160, 1100, 760, 9, { h: 150 }); F.lanternPerson(c, t, 1400, 760, 300, {}); F.du(c, 1680, 760, 260, { pose: 'look', dir: -1 }); }); }],
  ['F.glassRoom · F.aiDisc + F.beam · X.label', (c) => { g(c); X.inView(c, V, (s) => { X.groundLine(c, 0, 1920, LY, s); F.glassRoom(c, t, 1150, LY, 560, 300, {}); F.aiDisc(c, t, 700, 330, 80, { think: 1 }); F.beam(c, 700, 330, 300, LY, 1, { w: 60 }); X.label(c, SRC.peopleAI, 1430, LY + 50, 1, { size: 26 }); }); }],
  ['F.vignette desk · table · child', (c) => { g(c); X.inView(c, V, (s) => { X.groundLine(c, 0, 1920, 760, s); F.vignette(c, t, 'desk', 380, 760, 260, { label: 1, text: SRC.vignettes[0] }); F.vignette(c, t, 'table', 960, 760, 260, { label: 1, text: SRC.vignettes[1], beam: .6 }); F.vignette(c, t, 'child', 1540, 760, 260, { label: 1, text: SRC.vignettes[2] }); }); }],
  ['F.bunker (section: door, shelves, people) · X.section', (c) => { X.ground(c, t, { x: 960, y: 640, s: 1 }, { cut: { x0: 360, x1: 1600, depth: 520 } }); X.inView(c, { x: 960, y: 640, s: 1 }, (s) => { F.hatch(c, t, 520, LY, 200, { tilt: .075, open: .6, s }); F.bunker(c, t, 520, LY, { s, door: 1, shelves: .6, room: { x0: 460, x1: 1450, h: 200 }, people: [{ x: 900, h: 120, gold: 1 }, { x: 1040, h: 112 }] }); }); }],
  ['F.supplyClock (weeks · months · years) = plateBunker', (c) => S.drawBunker(c, t, S.viewBunker(t), { shelves: .7, full: .66, head: .3, scale: SRC.clockScale, marks: [[.28, 'ATLAS'], [.55, 'VIVOS']] })],
  ['F.floorPlan (detention bars) · F.badge', (c) => { g(c); X.inView(c, V, () => { F.floorPlan(c, t, 360, 220, 900, 560, { rooms: [{ x: 0, y: 0, w: .45, h: .5, label: 'LIVING' }, { x: .45, y: 0, w: .55, h: .5, label: 'STORES', door: 1 }, { x: 0, y: .5, w: .35, h: .5, label: SRC.detention, bars: 1, gold: .5 }] }); F.badge(c, t, 1560, 500, SRC.practice, 1); F.badge(c, t, 1560, 600, SRC.notPassed, 1, { gold: true }); }); }],
  ['F.evidenceCard + F.thread = S.plateBoard (+ thread)', (c) => S.drawBoard(c, t, S.viewBoard(t), { top: (cx, pins) => { F.thread(cx, pins[0], pins[1], 1); F.thread(cx, pins[1], pins[2], .6); } })],
  ['F.quoteCard (Sutskever) · F.source', (c) => { g(c); F.quoteCard(c, t, T, { text: SRC.sutskever.text, credit: SRC.sutskever.credit, w: 1200, y: 260 }); F.source(c, t, 0, 99, SRC.sutskever.src); }],
  ['F.dataCard · X.bar · F.verdict', (c) => { g(c); F.dataCard(c, t, 200, 280, 600, { kind: 'KNOWN', title: SRC.gallupHead, big: '71%', small: SRC.gallup[1], src: SRC.gallupSrc }); X.bar(c, 1200, 760, 90, 420, 1); X.bar(c, 1360, 760, 90, 310, 1, { col: 'concrete' }); F.verdict(c, t, 1280, 860, 'OPPOSE NEARBY', 1); }],
  ['F.lamp (clip source) · F.clipPlate (placeholder)', (c) => { g(c); const p = F.lamp(c, t, 1500, 120, { floor: 760 }); F.clipPlate(c, T.clip('C1').start + 3, T, 'C1', { from: p, morph: .55 }); }],
  ['F.house { shelter, use } · F.rockHall · F.dataCentre', (c) => { g(c); X.ground(c, t, { x: 960, y: 560, s: 1 }, { cut: { x0: 100, x1: 1820, depth: 420 } }); X.inView(c, { x: 960, y: 560, s: 1 }, (s) => { F.house(c, t, 300, LY, 260, { shelter: 1, use: 'wine' }); F.house(c, t, 640, LY, 220, { shelter: 1, use: 'party' }); F.rockHall(c, t, 1150, LY + 300, 500, 240, { use: 'play', people: 6 }); F.dataCentre(c, t, 1580, LY, 420, {}); }); }],
  ['S.earthNight { dawn } · S.endScreen', (c) => S.endScreen(c, T.duration - 6, T)],
];
const TW = 480, TH = 270, COLS = 4, ROWS = Math.ceil(TILES.length / COLS);
const sheet = createCanvas(TW * COLS, TH * ROWS), sx = sheet.getContext('2d');
sx.fillStyle = '#080b27'; sx.fillRect(0, 0, sheet.width, sheet.height);
if (bigDir) fs.mkdirSync(bigDir, { recursive: true });
for (const [i, [name, fn]] of TILES.entries()) {
  const big = createCanvas(1920, 1080), bx = big.getContext('2d'); fn(bx); E.finish(bx, t, F.PRINT72);
  if (bigDir) fs.writeFileSync(`${bigDir}/kit_${String(i).padStart(2, '0')}.jpg`, await big.encode('jpeg', 86));
  const x = (i % COLS) * TW, y = Math.floor(i / COLS) * TH; sx.drawImage(big, x, y, TW, TH);
  sx.fillStyle = 'rgba(8,11,39,.7)'; sx.fillRect(x, y + TH - 24, TW, 24); sx.fillStyle = '#f3efe2'; sx.font = '600 13px Inter'; sx.fillText(name, x + 8, y + TH - 8);
}
fs.writeFileSync(out, await sheet.encode('jpeg', 84)); console.log(out, fs.statSync(out).size >> 10, 'KB');
