// Stills of the Film 15 kit pieces (lib/f15_kit.mjs) through the editorial finish: node tools/f15_kit_sheet.mjs <dir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f15_kit.mjs';
const { W, H, P } = E;
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
const t = 3.2;
const save = async (n, c) => { fs.writeFileSync(`${dir}/kit_${n}.jpg`, await c.encode('jpeg', 86)); console.log(`${dir}/kit_${n}.jpg`); };

{ // 1 · band + box + du
  const c = createCanvas(W, H), x = c.getContext('2d');
  E.nightSky(x, [[0, P.night0], [.5, P.night1], [1, P.ind0]]); E.stars(x, 13, 160, t, [0, 0, W, H], .8);
  const spine = F.smoothPath([[520, 740], [600, 600], [820, 520], [1150, 470], [1450, 330], [1640, 150], [1700, -80]]);
  const marks = []; for (let k = 0; k <= 100; k++) marks.push({ m: .03 + .95 * k / 100, len: k % 10 ? (k % 5 ? .16 : .26) : .4, label: k % 10 ? null : String(2026 + k) });
  F.paperBand(x, spine, t, { w: [16, 170], twist: (s) => 2.2 * s - .2, marks, ink: [{ m0: .45, m1: .6, u: 1, off: .15 }] });
  F.box10(x, 300, 980, 360, t, { beta: .35, lid: 1, lit: [1, .5], cool: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1] });
  F.box10(x, 780, 980, 360, t, { beta: 1, lid: 1, lit: [1, .5, 0, 0, 0, .2], labels: [{ s: 'INFECTIONS' }, { s: 'CANCER' }, { s: "ALZHEIMER'S" }, { s: 'MENTAL ILLNESS' }, { s: 'LIFESPAN ×2' }, { s: 'POORER COUNTRIES' }], paper: 1 });
  E.du(x, 1300, 1000, 190, { pose: 'hold', light: 1 });
  E.finish(x, t, F.PRINT15); await save('band_box', c);
}
{ // 2 · vial, pill, reticle, genome, numberBlock
  const c = createCanvas(W, H), x = c.getContext('2d');
  E.nightSky(x, [[0, P.night0], [.5, P.night1], [1, P.ind0]]);
  F.vial(x, 220, 480, 300, t, { fill: .8, mark: 1 });
  F.reticle(x, 220, 360, 90, t, { lock: .6 });
  F.pill(x, 520, 300, 220, t, { split: .6 });
  F.genomeRows(x, 760, 260, 1100, t, { rows: 5, shift: 140, marks: [{ row: 0, col: 12, u: 1 }, { row: -1, col: 20, u: .5 }], cursor: 1100 });
  F.numberBlock(x, { x: 140, y: 760, num: '−42 %', label: 'risk of relapse or death', src: 'Moderna & Merck · ESMO 2026', u: 1 });
  F.numberBlock(x, { x: 1300, y: 760, num: '0', label: 'approved drugs found by artificial intelligence', src: 'as of Oct 2026', u: 1, align: 'center', size: 200 });
  F.paperLabel(x, 'ALGORITHM', 900, 980, { size: 30 });
  F.cell(x, 1700, 300, 110, t, { split: .8 });
  F.syringe(x, 1500, 560, 360, t, { fill: .8 });
  E.finish(x, t, F.PRINT15); await save('pieces', c);
}
