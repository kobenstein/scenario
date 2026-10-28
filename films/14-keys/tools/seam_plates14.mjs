// Film 14 · stills of the seam plates (lib/f14_seams.mjs) through the editorial finish: node tools/seam_plates14.mjs <dir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import '../lib/f10_editorial.mjs';
import { plateScreen, plateWindow, plateScale } from '../lib/f14_seams.mjs';
import { finish } from '../lib/f10_editorial.mjs';
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
for (const [n, f, t] of [['screen', plateScreen, 151.14], ['window', plateWindow, 317.34], ['scale', plateScale, 474.56]]) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, t); finish(ctx, t, { grain: 14, floor: 4, vig: .5 });
  fs.writeFileSync(`${dir}/plate_${n}.jpg`, await c.encode('jpeg', 85)); console.log(`${dir}/plate_${n}.jpg`);
}
