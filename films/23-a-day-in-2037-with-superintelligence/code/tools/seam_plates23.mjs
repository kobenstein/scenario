// Stills of the Film 23 seam plates (lib/f23_seams.mjs) through the editorial finish: node tools/seam_plates23.mjs <dir> [scale]
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { PLATES } from '../lib/f23_seams.mjs';
import { finish, prepareEditorial } from '../lib/f10_editorial.mjs';
import { PRINT23 } from '../lib/f23_kit.mjs';
prepareEditorial();
const dir = process.argv[2] || '.', sc = Number(process.argv[3] || 1); fs.mkdirSync(dir, { recursive: true });
const out = createCanvas(Math.round(1920 * sc), Math.round(1080 * sc)), ox = out.getContext('2d');
for (const [n, f] of Object.entries(PLATES)) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, 100); finish(ctx, 100, PRINT23);
  ox.drawImage(c, 0, 0, out.width, out.height); fs.writeFileSync(`${dir}/t${n}.jpg`, await out.encode('jpeg', 85)); console.log(`${dir}/t${n}.jpg`);
}
