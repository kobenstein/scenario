// Stills of the seam plates (lib/f13_seams.mjs) through the editorial finish: node tools/seam_plates.mjs <dir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { plateGlass, plateSheet } from '../lib/f13_seams.mjs';
import { finish } from '../lib/f10_editorial.mjs';
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
for (const [n, f] of [['glass', plateGlass], ['sheet', plateSheet]]) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, 236.7); finish(ctx, 236.7, { grain: 14, floor: 4, vig: .5 });
  fs.writeFileSync(`${dir}/plate_${n}.jpg`, await c.encode('jpeg', 85)); console.log(`${dir}/plate_${n}.jpg`);
}
