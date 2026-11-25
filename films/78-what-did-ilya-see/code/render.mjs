#!/usr/bin/env node
// Render the film (or a range) straight from Canvas pixels into ffmpeg; or write review stills.
//   node render.mjs --out part.mp4 [--from 0] [--to 30] [--fps 30] [--scale .5]   (times in seconds; --scale = review render size)
//   node render.mjs --snap 1,5.5,12 --dir snaps [--scale 0.5]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const { build } = await import(process.env.FILM || './film.mjs');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const film = await build();
const fps = Number(arg('fps', 30));

if (arg('snap')) {
  const dir = arg('dir', 'snaps'); fs.mkdirSync(dir, { recursive: true });
  const scale = Number(arg('scale', 0.5));
  const { createCanvas } = await import('@napi-rs/canvas');
  const out = createCanvas(Math.round(1920 * scale), Math.round(1080 * scale)), ox = out.getContext('2d');
  for (const s of arg('snap').split(',').map(Number)) {
    if (film.prepare) await film.prepare(s);
    const c = film.frame(s); ox.drawImage(c, 0, 0, out.width, out.height);
    const f = path.join(dir, `t${s.toFixed(2).padStart(7, '0')}.jpg`);
    fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
  }
  process.exit(0);
}

const vscale = Number(arg('scale', 1)), VW = Math.round(1920 * vscale / 2) * 2, VH = Math.round(1080 * vscale / 2) * 2;
let small = null;
if (vscale !== 1) { const { createCanvas } = await import('@napi-rs/canvas'); small = createCanvas(VW, VH); }
const from = Number(arg('from', 0)), to = Math.min(Number(arg('to', film.duration)), film.duration);
const f0 = Math.round(from * fps), f1 = Math.round(to * fps);
const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${VW}x${VH}`, '-r', String(fps), '-i', '-',
  '-c:v', 'libx264', '-crf', arg('crf', '18'), '-preset', arg('preset', 'medium'), '-pix_fmt', 'yuv420p', '-tune', 'grain', path.resolve(arg('out', 'out.mp4'))], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = f0; f < f1; f++) {
  if (film.prepare) await film.prepare(f / fps);
  let c = film.frame(f / fps);
  if (small) { const sx = small.getContext('2d'); sx.drawImage(c, 0, 0, VW, VH); c = small; }
  const buf = c.data();
  if (global.gc && f % 90 === 0) global.gc();   // node --expose-gc: keeps the napi canvas leak in check between pieces
  if (!ff.stdin.write(Buffer.from(buf))) await new Promise((r) => ff.stdin.once('drain', r));
  if ((f - f0) % 150 === 149) console.log(`frame ${f + 1 - f0}/${f1 - f0}  ${((Date.now() - t0) / (f - f0 + 1)).toFixed(0)} ms/frame`);
}
ff.stdin.end(); await new Promise((r) => ff.on('close', r));
console.log(`done ${f1 - f0} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
