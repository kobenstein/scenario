// Stills of the Film 19 seam plates (lib/f19_seams.mjs) through the editorial finish: node tools/seam_plates19.mjs <dir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { plateBubble, plateLine, plateNet } from '../lib/f19_seams.mjs';
import { finish, prepareEditorial } from '../lib/f10_editorial.mjs';
import { PRINT19 } from '../lib/f19_kit.mjs';
prepareEditorial();
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
for (const [n, f] of [['bubble', plateBubble], ['line', plateLine], ['net', plateNet]]) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, 63.5); finish(ctx, 63.5, PRINT19);
  fs.writeFileSync(`${dir}/plate_${n}.jpg`, await c.encode('jpeg', 85)); console.log(`${dir}/plate_${n}.jpg`);
}
