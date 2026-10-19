// Compose a 9:16 Short from a clean 16:9 code render: keyframed reframe (pan/zoom), blurred extension,
// headline claim on top, large burned-in captions, audio cut from the finished long-form mix.
//   node compose.mjs <id> [--snap t1,t2]   (reads shorts.json + ranges.json next to this file)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(process.env.CANVAS_FROM + '/package.json');
const { createCanvas, GlobalFonts, ImageData } = require('@napi-rs/canvas');

const HERE = path.dirname(new URL(import.meta.url).pathname);
const FONTS = '/home/user/scenario/style-tests/shared/fonts/';
GlobalFonts.registerFromPath(FONTS + 'InstrumentSerif.woff2', 'Instrument Serif');
GlobalFonts.registerFromPath(FONTS + 'Inter-600-normal.woff2', 'Inter');

const id = process.argv[2];
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const R = JSON.parse(fs.readFileSync(path.join(HERE, 'ranges.json'))).find((r) => r.id === id);
const SH = JSON.parse(fs.readFileSync(path.join(HERE, 'shorts.json')))[id];
const FINAL = {
  f1: '/mnt/project-files/scenario/folge-01-flagship/code-v1/episode01-code-1080p.mp4',
  f2: '/mnt/project-files/scenario/film-02-exponential/v2/render/AI Progress Is Going Vertical.mp4',
  f3: '/mnt/project-files/scenario/film-03-geniuses/render/final/1000000_geniuses_in_a_data_center.mp4',
}[R.film];
const DUR = R.end - R.start, FPS = 30, SW = 1920, SH_ = 1080, TW = 1080, TH = 1920;
const TY = 870;                      // where the framed point sits vertically
const CAP_Y = 1470;                  // caption centre (above the Shorts UI at the bottom)

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// ---------- framing keyframes [t, s, cx, cy]; s=1.78 fills the frame, s=1 shows a square band ----------
const KF = SH.frames;
function framing(t) {
  if (t <= KF[0][0]) return KF[0].slice(1);
  for (let i = 0; i < KF.length - 1; i++) {
    const [a, ...A] = KF[i], [b, ...B] = KF[i + 1];
    if (t < b) { const x = eio(clamp((t - a) / Math.max(1e-3, b - a))); return A.map((v, k) => v + (B[k] - v) * x); }
  }
  return KF[KF.length - 1].slice(1);
}

// ---------- captions: cues split into short chunks, timed by character share ----------
const CHUNKS = [];
for (let [a, b, text] of R.cues) {
  for (const [x, y] of SH.fix || []) text = text.split(x).join(y);
  const words = text.split(/\s+/), groups = [];
  let cur = [];
  for (const w of words) {
    const next = [...cur, w].join(' ');
    if (cur.length && (next.length > 18 || cur.length >= 3)) { groups.push(cur.join(' ')); cur = [w]; } else cur.push(w);
  }
  if (cur.length) groups.push(cur.join(' '));
  const tot = groups.reduce((n, g) => n + g.length + 2, 0);
  let t = a;
  for (const g of groups) { const d = (b - a) * (g.length + 2) / tot; CHUNKS.push([t, t + d, g]); t += d; }
}
for (let i = 0; i < CHUNKS.length - 1; i++) if (CHUNKS[i + 1][0] - CHUNKS[i][1] < 0.35) CHUNKS[i][1] = CHUNKS[i + 1][0];

// ---------- canvases ----------
const src = createCanvas(SW, SH_), sx = src.getContext('2d');
const out = createCanvas(TW, TH), ox = out.getContext('2d');
const small = createCanvas(135, 240), smx = small.getContext('2d');
const band = createCanvas(TW, TH), bx = band.getContext('2d');

function wrap(ctx, text, maxW) {
  const words = text.split(' '), lines = [];
  let cur = '';
  for (const w of words) { const n = cur ? cur + ' ' + w : w; if (ctx.measureText(n).width > maxW && cur) { lines.push(cur); cur = w; } else cur = n; }
  if (cur) lines.push(cur);
  return lines;
}

function compose(t) {
  // blurred, darkened cover of the same frame as background
  smx.filter = 'blur(5px)';
  smx.drawImage(src, (SW - SH_ * 9 / 16) / 2 - 60, 0, SH_ * 9 / 16 + 120, SH_, -8, -8, 151, 256);
  smx.filter = 'none';
  ox.drawImage(small, 0, 0, TW, TH);
  ox.fillStyle = 'rgba(5,6,18,0.5)'; ox.fillRect(0, 0, TW, TH);

  // framed picture
  const [s, cx, cy] = framing(t);
  const w = SW * s, h = SH_ * s;
  let dx = TW / 2 - cx * s, dy = TY - cy * s;
  if (w >= TW) dx = clamp(dx, TW - w, 0); else dx = (TW - w) / 2;
  if (h >= TH) dy = clamp(dy, TH - h, 0);
  if (h >= TH - 2) {
    ox.drawImage(src, dx, dy, w, h);
  } else {
    bx.clearRect(0, 0, TW, TH);
    bx.globalCompositeOperation = 'source-over';
    bx.drawImage(src, dx, dy, w, h);
    const f = 70, g = bx.createLinearGradient(0, dy, 0, dy + h);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(f / h, 'rgba(0,0,0,1)');
    g.addColorStop(1 - f / h, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    bx.globalCompositeOperation = 'destination-in'; bx.fillStyle = g; bx.fillRect(0, 0, TW, TH);
    bx.globalCompositeOperation = 'source-over';
    ox.drawImage(band, 0, 0);
  }

  // top shade + headline claim
  const sh = ox.createLinearGradient(0, 0, 0, 520);
  sh.addColorStop(0, 'rgba(5,6,18,0.7)'); sh.addColorStop(1, 'rgba(5,6,18,0)');
  ox.fillStyle = sh; ox.fillRect(0, 0, TW, 520);
  ox.font = '78px "Instrument Serif"'; ox.textAlign = 'center'; ox.textBaseline = 'alphabetic';
  const hl = wrap(ox, SH.headline, 940);
  const ha = clamp(t / 0.25);
  hl.forEach((line, i) => {
    const y = 200 + i * 84;
    ox.shadowColor = 'rgba(0,0,0,0.75)'; ox.shadowBlur = 18;
    ox.fillStyle = `rgba(243,239,226,${ha})`; ox.fillText(line, TW / 2, y);
    ox.shadowBlur = 0;
  });
  ox.fillStyle = `rgba(255,179,92,${0.9 * ha})`; ox.fillRect(TW / 2 - 40, 200 + (hl.length - 1) * 84 + 34, 80, 4);

  // bottom shade + caption chunk
  const bs = ox.createLinearGradient(0, 1250, 0, 1920);
  bs.addColorStop(0, 'rgba(5,6,18,0)'); bs.addColorStop(0.5, 'rgba(5,6,18,0.45)'); bs.addColorStop(1, 'rgba(5,6,18,0.6)');
  ox.fillStyle = bs; ox.fillRect(0, 1250, TW, 670);
  const c = CHUNKS.find(([a, b]) => t >= a && t < b);
  if (c) {
    const k = clamp((t - c[0]) / 0.12), sc = 1.12 - 0.12 * (1 - Math.pow(1 - k, 3));
    ox.save(); ox.translate(TW / 2, CAP_Y); ox.scale(sc, sc);
    ox.font = '600 80px Inter'; ox.textAlign = 'center'; ox.textBaseline = 'middle';
    const lines = wrap(ox, c[2], 900);
    lines.forEach((line, i) => {
      const y = (i - (lines.length - 1) / 2) * 96;
      ox.lineJoin = 'round'; ox.lineWidth = 12; ox.strokeStyle = 'rgba(5,6,18,0.85)'; ox.strokeText(line, 0, y);
      ox.fillStyle = '#ffffff'; ox.fillText(line, 0, y);
    });
    ox.restore();
  }

  // call to action: the long-form film is linked as "related video" right below the Short
  const ca = clamp((t - (DUR - 2.8)) / 0.3);
  if (ca > 0) {
    const y = 1290 - 14 * (1 - eio(ca));
    ox.save(); ox.globalAlpha = ca;
    ox.font = '600 46px Inter'; ox.textAlign = 'center'; ox.textBaseline = 'middle';
    const label = 'Watch the full film', tw = ox.measureText(label).width, pw = tw + 150, ph = 92;
    ox.fillStyle = 'rgba(255,179,92,0.95)';
    ox.beginPath(); ox.roundRect(TW / 2 - pw / 2, y - ph / 2, pw, ph, ph / 2); ox.fill();
    ox.fillStyle = '#0b0f2a'; ox.fillText(label, TW / 2 - 30, y + 2);
    // arrow pointing down to the related-video link (drawn, the font has no arrow glyphs)
    const ax = TW / 2 + tw / 2 + 22, bob = 5 * Math.sin(t * 7);
    ox.strokeStyle = '#0b0f2a'; ox.lineWidth = 6; ox.lineCap = 'round'; ox.lineJoin = 'round';
    ox.beginPath(); ox.moveTo(ax, y - 20 + bob); ox.lineTo(ax, y + 18 + bob);
    ox.moveTo(ax - 13, y + 5 + bob); ox.lineTo(ax, y + 18 + bob); ox.lineTo(ax + 13, y + 5 + bob); ox.stroke();
    ox.restore();
  }
}

// ---------- decode -> compose -> encode ----------
const clean = path.join(HERE, 'clean', id + '.mp4');
const FRAME = SW * SH_ * 4;
async function* frames() {
  const dec = spawn('ffmpeg', ['-v', 'error', '-i', clean, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-']);
  let buf = Buffer.alloc(0);
  for await (const chunk of dec.stdout) {
    buf = Buffer.concat([buf, chunk]);
    while (buf.length >= FRAME) { yield buf.subarray(0, FRAME); buf = buf.subarray(FRAME); }
  }
}
const put = (b) => sx.putImageData(new ImageData(new Uint8ClampedArray(b.buffer, b.byteOffset, FRAME), SW, SH_), 0, 0);

if (arg('snap')) {
  const want = arg('snap').split(',').map(Number), dir = path.join(HERE, 'snaps', id);
  fs.mkdirSync(dir, { recursive: true });
  let i = 0;
  for await (const b of frames()) {
    const t = i / FPS;
    const hit = want.find((w) => Math.abs(w - t) < 0.5 / FPS);
    if (hit !== undefined) { put(b); compose(t); fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.jpg`), await out.encode('jpeg', 80)); }
    if (++i / FPS > Math.max(...want) + 0.1) break;
  }
  process.exit(0);
}

const dst = path.join(HERE, 'out', id + '.mp4');
fs.mkdirSync(path.dirname(dst), { recursive: true });
const enc = spawn('ffmpeg', ['-v', 'error', '-y',
  '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${TW}x${TH}`, '-r', String(FPS), '-i', '-',
  '-ss', String(R.start), '-t', String(DUR), '-i', FINAL,
  '-map', '0:v', '-map', '1:a', '-af', `afade=t=in:d=0.12,afade=t=out:st=${(DUR - 0.7).toFixed(2)}:d=0.7`,
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-tune', 'grain', '-maxrate', '14M', '-bufsize', '28M', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', dst], { stdio: ['pipe', 'inherit', 'inherit'] });
let i = 0;
const t0 = Date.now();
for await (const b of frames()) {
  put(b); compose(i / FPS);
  if (!enc.stdin.write(Buffer.from(out.data()))) await new Promise((r) => enc.stdin.once('drain', r));
  i++;
  if (global.gc && i % 30 === 0) global.gc();
}
enc.stdin.end(); await new Promise((r) => enc.on('close', r));
console.log(`${id}: ${i} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s -> ${dst}`);
