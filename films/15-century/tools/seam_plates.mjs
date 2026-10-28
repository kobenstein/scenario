// Stills of the Film 15 seam plates (lib/f15_seams.mjs) through the editorial finish: node tools/seam_plates.mjs <dir>
// Group seams: plateCell (lead → B1, 44.40) · plateDivide (B1 → B2, 198.46) · plateShot (B2 → B3, 380.30).
// Optional inside a group: platePill (B1, 157.32) · plateReach (B2, 331.00).
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { plateCell, platePill, plateReach, plateDivide, plateShot, CELL, PILL, ROAD, DIVIDE, SHOT } from '../lib/f15_seams.mjs';
import { finish } from '../lib/f10_editorial.mjs';
import { PRINT15 } from '../lib/f15_kit.mjs';
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
for (const [n, f, T0] of [['cell', plateCell, CELL.T0], ['divide', plateDivide, DIVIDE.T0], ['shot', plateShot, SHOT.T0], ['pill', platePill, PILL.T0], ['reach', plateReach, ROAD.T0]]) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, T0); finish(ctx, T0, PRINT15);
  fs.writeFileSync(`${dir}/plate_${n}.jpg`, await c.encode('jpeg', 85)); console.log(`${dir}/plate_${n}.jpg`);
}
