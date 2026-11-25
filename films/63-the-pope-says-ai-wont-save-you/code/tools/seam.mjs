#!/usr/bin/env node
// Seam checker: renders EVERY frame (30 fps) in a window around given times and flags what Jakob hates:
//   BLACK  (mean luminance < 10 for ≥ 0.3 s), FROZEN (two consecutive frames almost identical), POP (one frame changes much more than
//   its neighbours: a jump, an element appearing from nowhere, a hard cut that does not match). Double images you must SEE: open the sheet.
//   cd /home/user/scenario/films/04-v2
//   SECS=c05,c06 node tools/seam.mjs --at 107.98,120.5 [--half .5] [--dir /tmp/claude-0/me/seam] [--from A --to B]
//     --at   centre times (comma list): renders at-half … at+half;   --from/--to: one window instead
//     writes <dir>/seam_<t>.jpg (contact sheet: every frame, label = time · luminance · diff to previous) and prints a table + flags.
// Diff = mean absolute RGB difference to the previous frame on a 240×135 thumbnail (0–255). Typical living hold 0.3–2, camera move 2–8.
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
const { build } = await import(process.env.FILM || '../film.mjs');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const fps = 30, half = Number(arg('half', .5)), dir = arg('dir', '/tmp/claude-0/seam');
fs.mkdirSync(dir, { recursive: true });
const film = await build();
const wins = arg('from') ? [[Number(arg('from')), Number(arg('to'))]] : String(arg('at', '')).split(',').filter(Boolean).map(Number).map((c) => [c - half, c + half]);
if (!wins.length) { console.error('give --at t1,t2 or --from A --to B'); process.exit(1); }

const TW = 240, TH = 135, th = createCanvas(TW, TH), tx = th.getContext('2d');
const report = [];
for (const [a, b] of wins) {
  const f0 = Math.round(a * fps), f1 = Math.round(b * fps), n = f1 - f0 + 1;
  const cols = 6, cw = 320, ch = 180, rows = Math.ceil(n / cols);
  const sheet = createCanvas(cols * cw, rows * (ch + 22)), sx = sheet.getContext('2d');
  sx.fillStyle = '#111'; sx.fillRect(0, 0, sheet.width, sheet.height);
  let prev = null; const rowsOut = [];
  for (let f = f0, k = 0; f <= f1; f++, k++) {
    const t = f / fps;
    if (film.prepare) await film.prepare(t);
    const c = film.frame(t);
    tx.drawImage(c, 0, 0, TW, TH);
    const d = tx.getImageData(0, 0, TW, TH).data;
    let lum = 0, diff = 0;
    for (let i = 0; i < d.length; i += 4) {
      lum += .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2];
      if (prev) diff += (Math.abs(d[i] - prev[i]) + Math.abs(d[i + 1] - prev[i + 1]) + Math.abs(d[i + 2] - prev[i + 2])) / 3;
    }
    lum /= TW * TH; diff = prev ? diff / (TW * TH) : NaN; prev = Uint8ClampedArray.from(d);
    rowsOut.push({ t, lum, diff });
    const x = (k % cols) * cw, y = Math.floor(k / cols) * (ch + 22);
    sx.drawImage(c, x, y, cw, ch);
    sx.fillStyle = '#ddd'; sx.font = '14px sans-serif';
    sx.fillText(`${t.toFixed(3)}  L${lum.toFixed(0)}  Δ${isNaN(diff) ? '–' : diff.toFixed(2)}`, x + 6, y + ch + 16);
  }
  const ds = rowsOut.map((r) => r.diff).filter((v) => !isNaN(v)).sort((p, q) => p - q), med = ds[Math.floor(ds.length / 2)] || 0;
  const flags = [];
  let dark = 0;
  // POP = an isolated spike (a cut that does not match, something appearing at once); FAST = sustained very fast change (fine for a
  // short whoosh-move, but over ~0.3 s it smears in the encode and reads as a jump)
  let fast = 0;
  rowsOut.forEach((r, i) => {
    dark = r.lum < 10 ? dark + 1 : 0;
    if (dark === 9) flags.push(`BLACK from ${(r.t - 8 / fps).toFixed(3)} (≥0.3 s below luminance 10)`);
    if (isNaN(r.diff)) return;
    if (r.diff < .12) flags.push(`FROZEN at ${r.t.toFixed(3)} (Δ ${r.diff.toFixed(3)})`);
    const nb = Math.max(rowsOut[i - 1] && !isNaN(rowsOut[i - 1].diff) ? rowsOut[i - 1].diff : 0, rowsOut[i + 1] ? rowsOut[i + 1].diff : 0);
    if (r.diff > 25 || (r.diff > 6 && r.diff > 2.2 * nb)) flags.push(`POP at ${r.t.toFixed(3)} (Δ ${r.diff.toFixed(2)}, neighbours ${nb.toFixed(2)}, median ${med.toFixed(2)})`);
    fast = r.diff > 10 ? fast + 1 : 0;
    if (fast === 9) flags.push(`FAST from ${(r.t - 8 / fps).toFixed(3)} (Δ > 10 for ≥ 0.3 s: check that it reads as one move, not a jump)`);
  });
  const f = path.join(dir, `seam_${a.toFixed(2)}-${b.toFixed(2)}.jpg`);
  fs.writeFileSync(f, await sheet.encode('jpeg', 82));
  report.push(`window ${a.toFixed(3)}–${b.toFixed(3)}  sheet ${f}\n  median Δ ${med.toFixed(2)}  min L ${Math.min(...rowsOut.map((r) => r.lum)).toFixed(0)}  max Δ ${Math.max(...ds).toFixed(2)}\n  ` +
    (flags.length ? flags.join('\n  ') : 'no flags') + '\n  ' + rowsOut.map((r) => `${r.t.toFixed(2)}:${r.lum.toFixed(0)}/${isNaN(r.diff) ? '-' : r.diff.toFixed(1)}`).join(' '));
}
const out = report.join('\n');
fs.writeFileSync(path.join(dir, 'seam.txt'), out + '\n');
console.log(out);
process.exit(0);
