// Stills of the Film 18 seam plates (lib/f18_seams.mjs) through the editorial finish: node tools/seam_plates18.mjs <dir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { plateTag, plateHook, plateRules } from '../lib/f18_seams.mjs';
import { finish, prepareEditorial } from '../lib/f10_editorial.mjs';
import { PRINT18 } from '../lib/f18_kit.mjs';
prepareEditorial();
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
for (const [n, f] of [['tag', plateTag], ['hook', plateHook], ['rules', plateRules]]) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, 45.4); finish(ctx, 45.4, PRINT18);
  fs.writeFileSync(`${dir}/plate_${n}.jpg`, await c.encode('jpeg', 85)); console.log(`${dir}/plate_${n}.jpg`);
}
