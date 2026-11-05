// Stills of the Film 16 seam plates (lib/f16_seams.mjs) through the editorial finish: node tools/seam_plates16.mjs <dir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { plateChat, plateButton, plateNib } from '../lib/f16_seams.mjs';
import { finish } from '../lib/f10_editorial.mjs';
import { PRINT16 } from '../lib/f16_kit.mjs';
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
for (const [n, f] of [['chat', plateChat], ['button', plateButton], ['nib', plateNib]]) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, 55.4); finish(ctx, 55.4, PRINT16);
  fs.writeFileSync(`${dir}/plate_${n}.jpg`, await c.encode('jpeg', 85)); console.log(`${dir}/plate_${n}.jpg`);
}
