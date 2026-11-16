import { createCanvas, loadImage } from '@napi-rs/canvas'; import fs from 'node:fs';
import './lib.mjs';
const [,, oldP, newP, out] = process.argv;
const c = createCanvas(1920, 540), g = c.getContext('2d');
g.drawImage(await loadImage(oldP), 0, 0, 960, 540); g.drawImage(await loadImage(newP), 960, 0, 960, 540);
g.fillStyle = '#000'; g.fillRect(958, 0, 4, 540);
for (const [x, t] of [[16, 'OLD'], [976, 'NEW']]) { g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x - 6, 12, 56, 26); g.font = '600 14px "Inter"'; g.fillStyle = '#f3efe2'; g.fillText(t, x + 2, 30); }
fs.writeFileSync(out, c.toBuffer('image/png'));
