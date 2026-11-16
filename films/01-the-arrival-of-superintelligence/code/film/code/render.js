// Render code-drawn scenes: node render.js --from 5 --to 11.35 --out x.mp4 | --snap 6,8,10
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const L = require('./lib');
const { createCanvas, W, H, FPS, sm } = L;

const SCENES = fs.readdirSync(__dirname).filter(f => /^s_.*\.js$/.test(f)).map(f => require('./' + f)).filter(s => typeof s.draw === 'function' && typeof s.T0 === 'number').sort((a, b) => a.T0 - b.T0);
const XF = 0.3;

const cv = createCanvas(W, H), ctx = cv.getContext('2d');
const tmp = createCanvas(W, H), tctx = tmp.getContext('2d');

function frame(t, fi) {
  const act = SCENES.filter(s => t >= s.T0 - 1e-6 && t < s.T1);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#070918'; ctx.fillRect(0, 0, W, H);
  act.forEach((s, i) => {
    if (i === 0) { ctx.save(); s.draw(ctx, t); ctx.restore(); return; }
    tctx.save(); tctx.fillStyle = '#070918'; tctx.fillRect(0, 0, W, H); s.draw(tctx, t); tctx.restore();
    ctx.save(); ctx.globalAlpha = sm((t - s.T0) / XF); ctx.drawImage(tmp, 0, 0); ctx.restore();
  });
  // bloom: bright light bleeds softly into the dark, like the illustrations
  // (no 'copy' composite: in @napi-rs/canvas it leaks ~9 MB of native memory per frame)
  tctx.save(); tctx.clearRect(0, 0, W, H); tctx.filter = 'blur(28px)'; tctx.drawImage(cv, 0, 0); tctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.22; ctx.drawImage(tmp, 0, 0); ctx.restore();
  L.finish(ctx, fi);
}

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') && a.push([v.slice(2), arr[i + 1]]), a), []));
if (args.snap) {
  fs.mkdirSync(path.join(__dirname, 'snaps'), { recursive: true });
  for (const s of args.snap.split(',')) { const t = +s; frame(t, Math.round(t * FPS)); fs.writeFileSync(path.join(__dirname, 'snaps', `${t.toFixed(2)}.png`), cv.toBuffer('image/png')); }
} else {
  const f0 = Math.round(+args.from * FPS), f1 = Math.round(+args.to * FPS);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', `${FPS}`, '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', args.out], { stdio: ['pipe', 'inherit', 'inherit'] });
  (async () => {
    const t0 = Date.now();
    for (let fi = f0; fi < f1; fi++) {
      frame(fi / FPS, fi);
      if (!ff.stdin.write(Buffer.from(cv.data()))) await new Promise(r => ff.stdin.once('drain', r));
      if (global.gc && fi % 20 === 0) global.gc(); // frame buffers live outside the JS heap, so GC would not run on its own
      if ((fi - f0) % 150 === 0) console.log(args.out, fi - f0, '/', f1 - f0, ((Date.now() - t0) / Math.max(1, fi - f0) / 1000).toFixed(3) + 's/f');
    }
    ff.stdin.end();
  })();
}
