// Film 29 · Fassung 2 · still layers for the interview inserts (real footage, framed in the film's style).
//   node tools/f29_v2_overlays.mjs <outdir> <spec.json>
// spec.json: { box: {x,y,w,h}, clips: [{ id, name, role, where }] }
// writes <outdir>/frame.png (shadow + thin rim around the video box, transparent elsewhere) and <outdir>/lt_<id>.png
// (lower third: gold rule, name in Instrument Serif, role + ORIGINAL FOOTAGE tag in Inter 600 caps, source line) on transparency.
// Same type as the quote cards (lib/f29_kit.mjs quoteCard credit block), so the footage reads as part of the film.
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { maskLine, measure, GOLD, P, rgba } from '../lib/f29_kit.mjs';

const [outdir, specf] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specf, 'utf8'));
const W = 1920, H = 1080, { x: bx, y: by, w: bw, h: bh } = spec.box;
fs.mkdirSync(outdir, { recursive: true });

{ // frame layer
  const cv = createCanvas(W, H), g = cv.getContext('2d');
  g.save(); g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 48; g.shadowOffsetY = 14; g.fillStyle = P.night0; g.fillRect(bx, by, bw, bh); g.restore();
  g.strokeStyle = rgba(P.cream, .22); g.lineWidth = 2; g.strokeRect(bx - 1, by - 1, bw + 2, bh + 2);
  fs.writeFileSync(`${outdir}/frame.png`, cv.toBuffer('image/png'));
}

for (const c of spec.clips) {
  const cv = createCanvas(W, H), g = cv.getContext('2d');
  const x = bx, top = by + bh + 30;
  g.fillStyle = rgba(GOLD.line, .7); g.fillRect(x, top, 64, 2);
  const ny = top + 44, nsize = 40;
  maskLine(g, [[c.name, 0]], x, ny, nsize, 1, { glow: false });
  let nx = x + measure(c.name, nsize) + 22;
  if (c.role) { maskLine(g, [[c.role, 0]], nx, ny - 3, 19, 1, { serif: false, weight: 600, col: P.cream, glow: false }); }
  // the tag sits right of the role (or of the name)
  const tag = 'ORIGINAL FOOTAGE', ts = 15, tw = measure(tag, ts, false, 600) + 20;
  const tx = nx + (c.role ? measure(c.role, 19, false, 600) + 18 : 0), ty = ny - 22;
  g.strokeStyle = rgba(GOLD.line, .85); g.lineWidth = 1.5; g.beginPath(); g.roundRect(tx, ty - 1, tw, 26, 4); g.stroke();
  g.fillStyle = rgba(GOLD.line, .12); g.fill();
  maskLine(g, [[tag, 0]], tx + 10, ty + 18, ts, 1, { serif: false, weight: 600, col: GOLD.text, glow: false });
  maskLine(g, [[c.where, 0]], nx, ny + 27, 19, 1, { serif: false, weight: 600, col: P.halo2, glow: false });
  fs.writeFileSync(`${outdir}/lt_${c.id}.png`, cv.toBuffer('image/png'));
}
console.log('ok', outdir);
