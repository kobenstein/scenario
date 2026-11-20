#!/usr/bin/env node
// Film 20 · renders the three seam plates (lib/f20_seams.mjs) as stills, so both neighbours of a seam can compare against them.
//   node tools/seam_plates20.mjs [outDir] [--t 3]     → plateYou.jpg, plateEye.jpg, plateTrack.jpg (1920×1080, editorial finish)
// Use it with tools/seam.mjs (a frame either side of the cut) to check that a chunk really starts / ends on its plate.
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import '../engine.mjs';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f20_kit.mjs';
import { PLATES } from '../lib/f20_seams.mjs';
const out = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'plates';
const t = process.argv.includes('--t') ? Number(process.argv[process.argv.indexOf('--t') + 1]) : 3;
E.prepareEditorial(); fs.mkdirSync(out, { recursive: true });
const cv = createCanvas(1920, 1080), ctx = cv.getContext('2d');
for (const [k, fn] of Object.entries(PLATES)) {
  ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1920, 1080); fn(ctx, t); ctx.restore(); E.finish(ctx, t, F.PRINT20);
  const f = path.join(out, `plate${k[0].toUpperCase()}${k.slice(1)}.jpg`); fs.writeFileSync(f, await cv.encode('jpeg', 88)); console.log(f);
}
