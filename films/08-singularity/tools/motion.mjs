// Film 8 · motion metric ("never still", MOTION.md): decodes a video to 240×135 grey frames and measures the mean absolute
// difference between consecutive frames (0..255 scale). A frame pair under the threshold counts as near-static.
//   node tools/motion.mjs video.mp4 [--thr 0.35] [--json out.json]
// Prints: frames, near-static share, longest static stretch (s), and the five longest stretches with their times.
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const args = process.argv.slice(2), file = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const thr = Number(opt('thr', .35)), W = 240, H = 135, N = W * H;
if (!file) { console.error('usage: node tools/motion.mjs video.mp4 [--thr 0.35] [--json out.json]'); process.exit(1); }
const fps = await new Promise((res) => { const p = spawn('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', file]); let s = ''; p.stdout.on('data', (d) => (s += d)); p.on('close', () => { const [a, b] = s.trim().split('/').map(Number); res(a / (b || 1)); }); });
const ff = spawn('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=${W}:${H}:flags=area,format=gray`, '-f', 'rawvideo', '-']);
let buf = Buffer.alloc(0), prev = null; const diffs = [];
ff.stdout.on('data', (d) => {
  buf = Buffer.concat([buf, d]);
  while (buf.length >= N) {
    const fr = buf.subarray(0, N); buf = buf.subarray(N);
    if (prev) { let s = 0; for (let i = 0; i < N; i++) s += Math.abs(fr[i] - prev[i]); diffs.push(s / N); }
    prev = Buffer.from(fr);
  }
});
await new Promise((r) => ff.on('close', r));
const still = diffs.map((d) => d < thr), runs = [];
for (let i = 0; i < still.length; ) { if (!still[i]) { i++; continue; } let j = i; while (j < still.length && still[j]) j++; runs.push([i, j]); i = j; }
runs.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
const share = still.filter(Boolean).length / Math.max(1, still.length), longest = runs.length ? (runs[0][1] - runs[0][0]) / fps : 0;
const mean = diffs.reduce((a, b) => a + b, 0) / Math.max(1, diffs.length), sorted = diffs.slice().sort((a, b) => a - b);
const out = { file, fps, frames: diffs.length + 1, threshold: thr, nearStaticShare: share, longestStaticStretchSec: longest, meanDiff: mean, minDiff: sorted[0], p05Diff: sorted[Math.floor(sorted.length * .05)],
  longestRuns: runs.slice(0, 5).map(([a, b]) => ({ from: +((a + 1) / fps).toFixed(2), to: +((b + 1) / fps).toFixed(2), sec: +((b - a) / fps).toFixed(2) })) };
console.log(`frames ${out.frames} @ ${fps} fps · threshold mean|Δ| < ${thr}`);
console.log(`near-static frames: ${(share * 100).toFixed(2)} %  ·  longest static stretch: ${longest.toFixed(2)} s  ·  mean |Δ| ${mean.toFixed(2)}  ·  min ${out.minDiff.toFixed(3)}  ·  5th pct ${out.p05Diff.toFixed(3)}`);
for (const r of out.longestRuns) console.log(`  static ${r.from.toFixed(2)}–${r.to.toFixed(2)} s (${r.sec.toFixed(2)} s)`);
if (opt('json')) fs.writeFileSync(opt('json'), JSON.stringify(out, null, 2));
