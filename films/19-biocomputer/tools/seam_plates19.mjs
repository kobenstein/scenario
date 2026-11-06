// Stills of the Film 19 seam plates (lib/f19_seams.mjs) through the editorial finish, plus a kit sheet:
//   node tools/seam_plates19.mjs <dir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import '../engine.mjs';
import { plateClock, plateRack, plateNet } from '../lib/f19_seams.mjs';
import { finish, prepareEditorial, P } from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
prepareEditorial();
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
const save = async (c, n) => { const f = `${dir}/${n}.jpg`; fs.writeFileSync(f, await c.encode('jpeg', 85)); console.log(f); };
for (const [n, f] of [['clock', plateClock], ['rack', plateRack], ['net', plateNet]]) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, 50.2); finish(ctx, 50.2, F.PRINT19); await save(c, `plate_${n}`);
}
// kit sheet: cells, glyphs, vial, box, creatures, scoreboard
const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); ctx.fillStyle = P.night1; ctx.fillRect(0, 0, 1920, 1080);
const t = 3;
F.cell(ctx, t, 160, 180, 60, { kind: 'blood' }); F.cell(ctx, t, 340, 180, 60, { kind: 'stem' }); F.cell(ctx, t, 560, 180, 40, { kind: 'neuron', sprout: 1 });
F.cell(ctx, t, 820, 200, 50, { kind: 'blood', warm: .3, clock: 1, hand: -2 });
['hand', 'eye', 'star', 'controller', 'paddle', 'pipette'].forEach((k, i) => F.glyph(ctx, k, 1060 + i * 140, 180, 90, { strike: i < 3 ? 1 : 0 }));
F.vial(ctx, t, 160, 640, 300, { label: 'DONOR', fill: .7 });
F.cl1(ctx, t, 520, 640, 420, {});
['fly', 'bee', 'mouse', 'head', 'box'].forEach((k, i) => F.creature(ctx, k, 900 + i * 200, 620, 160, { fill: [1, .2, .33, .02, 1][i] }));
F.scoreboard(ctx, t, 1400, 820, { cells: 2, ai: 1, round: 3, cellPts: [{ u: 1, catch: 'CATCH', cu: 1 }, { u: 1, catch: 'CATCH', cu: 1 }], aiPts: [{ u: 1, big: .3 }] });
F.dish(ctx, t, F.fieldMap(260, 900, 150), {});
finish(ctx, t, F.PRINT19); await save(c, 'kit_sheet');
