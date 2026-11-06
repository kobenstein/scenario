// Stills of the Film 19 seam plates (lib/f19_seams.mjs) through the film finish: node tools/seam_plates19.mjs <dir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import '../engine.mjs';
import { plateLines, plateSlip, plateWheel } from '../lib/f19_seams.mjs';
import { finish } from '../lib/f10_editorial.mjs';
import { PRINT19 } from '../lib/f19_kit.mjs';
const dir = process.argv[2] || 'plates'; fs.mkdirSync(dir, { recursive: true });
for (const [n, f] of [['lines', plateLines], ['slip', plateSlip], ['wheel', plateWheel]]) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, 45.4); finish(ctx, 45.4, PRINT19);
  fs.writeFileSync(`${dir}/plate_${n}.jpg`, await c.encode('jpeg', 88)); console.log(`${dir}/plate_${n}.jpg`);
}
