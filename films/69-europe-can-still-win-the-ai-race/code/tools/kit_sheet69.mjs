#!/usr/bin/env node
// Film 69 · kit sheet: stills of the vocabulary so builders see it first: the Leitbild (thumbnail A, the night sea, the 4 anchors only),
// THE PLAN SHEET explainer objects (cells, desk + AI screen, doc, yes/no, crates + rule books, crowds, the plan, date tag, light line),
// the KIT disc in its states + the HUD (small, test, big verdict), the objects (chip machine, jet, barge, letter, head tile), the clip plate,
// the three seam plates and the end screen.
//   node tools/kit_sheet69.mjs <dir> [--scale .5]   (then tile to <ROOT>bild/kit69_kontakt.jpg, < 1 MB)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as S from '../lib/f69_world.mjs';
import * as X from '../lib/f69_explain.mjs';
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
  fn(ctx, t); E.finish(ctx, t, F.PRINT69);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const V = X.V0, sheet = (ctx, t) => X.sheet(ctx, t, V);
const kt = F.kitTimes(T);
await shot('01_leitbild_thumbA', (ctx, t) => { S.seaWorld(ctx, S.HOME(), t, { moon: { parts: F.VISION }, you: { piece: { u: 1, kind: 'gold', r: 132 } } }); F.title(ctx, t, 1); });
await shot('02_leitbild_wide_links', (ctx, t) => S.seaWorld(ctx, S.WIDE_CAM(), t, { moon: { parts: F.END_PARTS ?? S.END_PARTS }, links: { u: 1 }, mark: (i) => (i % 3 ? 0 : .6) }));
await shot('03_cells_5pct', (ctx, t) => { sheet(ctx, t); X.label(ctx, F.SOURCES.computeTitle, W / 2, 140, 1, { size: 28 }); X.cells(ctx, t, 716, 190, 40, 10, 10, { keep: [63, 64, 65, 66, 67], dim: 1 }); X.big(ctx, F.SOURCES.five, W / 2, 790, 104, 1); F.source(ctx, 4, 0, 99, F.SOURCES.fiveSrc); }, 4);
await shot('04_desk_ai_screen', (ctx, t) => { sheet(ctx, t); X.inView(ctx, { x: 960, y: 580, s: 1.2 }, () => { X.deskScene(ctx, t, 960, {}); X.doc(ctx, t, 785, 608, 118, { kind: 'cv' }); }); X.label(ctx, F.SOURCES.scenes[1], W / 2, 236, 1, { size: 34 }); X.yesNo(ctx, t, 960, 330, 1, 1); });
await shot('05_crates_books_plan', (ctx, t) => { sheet(ctx, t); X.crates27(ctx, t, 650, 420, 72, { books: 1 }); X.planSheet(ctx, t, 1500, 560, 560, { machine: 1 }); X.dateTag(ctx, F.SOURCES.dates[0], 1480, 205, 1); X.dateTag(ctx, F.SOURCES.dates[1], 1480, 257, 1); });
await shot('06_crowds', (ctx, t) => { sheet(ctx, t); X.crowdRise(ctx, t, 600, 700, 45, 9, 104, { seed: 5 }); X.crowdRise(ctx, t, 1290, 700, 34, 9, 104, { seed: 9 }); X.lightLine(ctx, [[0, 700], [W, 700]], 1, { a: .5, w: 2.5 }); F.source(ctx, 4, 0, 99, F.SOURCES.peopleSrc); }, 4);
await shot('07_machine_jet_barge', (ctx, t) => { sheet(ctx, t); F.chipMachine(ctx, t, 700, 640, 760, { beam: 1 }); F.jet(ctx, t, 1500, 320, 520); F.barge(ctx, t, 1450, 760, 600); F.letter(ctx, t, 1600, 600, 170, { head: 'AMERICA' }); F.headTile(ctx, t, 520, 200, 600, 'TOO SMALL'); });
await shot('08_kit_states', (ctx, t) => { sheet(ctx, t); const st = [F.VISION, F.BLANK, F.kitParts(T, kt.v[1] + 2).parts, S.END_PARTS]; st.forEach((p, i) => F.kitDisc(ctx, t, 260 + i * 470, 470, 170, p, { stars: i === 0 ? 1 : 0 })); });
await shot('09_hud_test', (ctx, t) => { sheet(ctx, t); F.kitHud(ctx, t, T); }, kt.test + 1.5);
await shot('10_hud_part2', (ctx, t) => { sheet(ctx, t); F.kitHud(ctx, t, T); }, kt.v[1] + 1.4);
await shot('11_hud_big_verdict', (ctx, t) => { sheet(ctx, t); F.kitHud(ctx, t, T, { big: 1 }); }, kt.sum + 2);
await shot('12_clip_plate_C3', (ctx, t) => { sheet(ctx, t); F.clipPlate(ctx, t, T, 'C3'); }, T.clip('C3').start + 3);
await shot('13_plateMachine', (ctx, t) => S.plateMachine(ctx, t, T), T.G('Those chip machines'));
await shot('14_plateEnergy', (ctx, t) => S.plateEnergy(ctx, t, T), T.G('None of it runs'));
await shot('15_plateFour', (ctx, t) => S.plateFour(ctx, t, T), T.G('So suppose all five'));
await shot('16_endScreen', (ctx, t) => S.endScreen(ctx, t, T), T.duration - 8);
