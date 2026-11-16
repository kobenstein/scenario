#!/usr/bin/env node
// The three group seam plates of lib/bubble_seams.mjs side by side (with the print finish), for review:
//   node tools/seam_plates.mjs <out.jpg> [t]
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as S from '../lib/bubble_seams.mjs';
const out = process.argv[2] || 'seam_plates.jpg', t = Number(process.argv[3] || 3);
E.prepareEditorial();
const c = createCanvas(1920, 1080 / 3 + 0), x = c.getContext('2d'), one = createCanvas(1920, 1080), o = one.getContext('2d');
[S.plateSlit, S.plateBrick, S.plateDoor].forEach((f, i) => { o.setTransform(1, 0, 0, 1, 0, 0); f(o, t); E.finish(o, t, { grain: 14, floor: 4, vig: .5 }); x.drawImage(one, i * 640, 0, 640, 360); });
fs.writeFileSync(out, await c.encode('jpeg', 88)); console.log(out);
