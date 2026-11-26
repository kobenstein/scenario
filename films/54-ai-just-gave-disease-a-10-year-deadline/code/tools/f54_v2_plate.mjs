// Film 54 fassung-2 (16.11.): the still layers of the roadshow clip plate (C1 / C1b = Dario's real clip from the Anthropic IPO roadshow video
// instead of the read quote cards), drawn with the same kit calls as lib/f54_kit.mjs clipPlate / plateCredits:
//   <out>/frame.png   the cream plate border (CLIP_RECT, radius 14, 3 px), transparent elsewhere
//   <out>/credits.png name · role · year (left) and ORIGINAL FOOTAGE · <source> (right), fully revealed, transparent elsewhere
//   <out>/mask.png    the rounded CLIP_RECT as a white-on-black mask (1680x945) for the footage
// usage: node tools/f54_v2_plate.mjs <outdir>     (tools/f54_v2.py composes them with ffmpeg)
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import * as F from '../lib/f54_kit.mjs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const R = F.CLIP_RECT, INFO = { name: 'Dario Amodei', role: 'CEO, Anthropic', year: 'Nov 2026', src: 'Anthropic IPO roadshow video, Nov 10, 2026' };
const save = async (cv, f) => fs.writeFileSync(`${out}/${f}`, await cv.encode('png'));
let cv = createCanvas(1920, 1080), ctx = cv.getContext('2d');
ctx.strokeStyle = F.P.cream; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 14); ctx.stroke(); await save(cv, 'frame.png');
cv = createCanvas(1920, 1080); ctx = cv.getContext('2d');
const by = R.y - 26, nw = F.maskLine(ctx, [[INFO.name, 0]], R.x, by, 40, 1, { glow: true });
F.maskLine(ctx, [[[INFO.role, INFO.year].join(' · ').toUpperCase(), 0]], R.x + nw.w + 22, by - 2, 20, 1, { serif: false, col: F.P.halo2, glow: false });
F.mintText(ctx, [[`${F.CLIP_LABEL.video} · ${INFO.src.toUpperCase()}`, .35]], R.x + R.w, by - 2, 20, 1, { serif: false, weight: 600, align: 'right' });
await save(cv, 'credits.png');
cv = createCanvas(R.w, R.h); ctx = cv.getContext('2d'); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, R.w, R.h);
ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(0, 0, R.w, R.h, 14); ctx.fill(); await save(cv, 'mask.png');
console.log('plate layers ->', out);
