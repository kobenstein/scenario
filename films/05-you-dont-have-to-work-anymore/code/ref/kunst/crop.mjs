import { createCanvas, loadImage } from '@napi-rs/canvas'; import fs from 'node:fs';
const [,, src, x, y, w, h, out, sc='2'] = process.argv; const im = await loadImage(src); const s=+sc;
const c = createCanvas(w*s, h*s), g = c.getContext('2d'); g.imageSmoothingEnabled=false; g.drawImage(im, +x, +y, +w, +h, 0, 0, w*s, h*s); fs.writeFileSync(out, c.toBuffer('image/png'));
