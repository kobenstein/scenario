#!/usr/bin/env node
// Render one motion-test version (vN.mjs exports frame(ctx, t) and optional print) to mp4, or write review stills.
//   node render.mjs v1 --out v1.mp4 [--from 0 --to 10]
//   node render.mjs v1 --snap 1,3.4,5 --dir snaps [--scale .5]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { W, H, canvas } from '../05-share/engine.mjs';
import { filmFinish } from '../05-share/lib/print.mjs';
import { DUR } from './worlds.mjs';

const ver = process.argv[2];
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const V = await import(`./${ver}.mjs`);
const [c, ctx] = canvas(W, H);
const frame = (t) => {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#070918'; ctx.fillRect(0, 0, W, H);
  V.frame(ctx, t); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  filmFinish(ctx, t, (V.print && V.print(t)) || {});
  return c;
};
const fps = Number(arg('fps', 30));
if (arg('snap')) {
  const dir = arg('dir', 'snaps'); fs.mkdirSync(dir, { recursive: true });
  const scale = Number(arg('scale', .5)), [o, ox] = canvas(Math.round(W * scale), Math.round(H * scale));
  for (const s of arg('snap').split(',').map(Number)) {
    const t0 = Date.now(); frame(s); ox.drawImage(c, 0, 0, o.width, o.height);
    const f = path.join(dir, `${ver}_t${s.toFixed(2).padStart(5, '0')}.jpg`); fs.writeFileSync(f, await o.encode('jpeg', 82)); console.log(f, Date.now() - t0, 'ms');
  }
  process.exit(0);
}
const from = Number(arg('from', 0)), to = Math.min(Number(arg('to', DUR)), DUR), f0 = Math.round(from * fps), f1 = Math.round(to * fps);
const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(fps), '-i', '-',
  '-c:v', 'libx264', '-crf', arg('crf', '19'), '-preset', 'medium', '-pix_fmt', 'yuv420p', '-tune', 'grain', path.resolve(arg('out', ver + '.mp4'))], { stdio: ['pipe', 'inherit', 'inherit'] });
const T0 = Date.now();
for (let f = f0; f < f1; f++) {
  const b = frame(f / fps).data();
  if (!ff.stdin.write(Buffer.from(b))) await new Promise((r) => ff.stdin.once('drain', r));
  if ((f - f0) % 60 === 59) console.log(`${ver} frame ${f + 1 - f0}/${f1 - f0} ${((Date.now() - T0) / (f - f0 + 1)).toFixed(0)} ms/frame`);
}
ff.stdin.end(); await new Promise((r) => ff.on('close', r));
console.log(`${ver} done in ${((Date.now() - T0) / 1000).toFixed(0)} s`);
