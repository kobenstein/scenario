// Film 8 · 2.01 the Altman clip, full frame, in and out of the horizon light's line.
//   drawClip(ctx, t, T, o)   o: { open: [t0, t1] (the line opens), close: [t0, t1] (it closes), yOpen, yClose, cut (s into the clip: the jump cut) }
// The footage (1920×960) covers the frame; a slow push 1.00 → 1.03, and on the jump-cut frame a punch-in to 1.10 that keeps pushing,
// centred on the speaker's face, so the jump reads as an edit, not a glitch. Lower third + ORIGINAL FOOTAGE tag: f6_kit lowerThird.
import { rgba, clamp } from '../engine.mjs';
import { clipFrame } from './kit.mjs';
import { lowerThird } from './f6_kit.mjs';
import { eoX, sio } from './s8_kit.mjs';

const FACE = [820, 330];   // the speaker's face in the close-up (frame px)
export function drawClip(ctx, t, T, o) {
  const c = T.clip('C1'), k = Math.floor(clamp(t - c.start, 0, c.end - c.start - 1e-3) * 30) + 1, fr = clipFrame('C1', k);
  const cutT = c.start + (o.cutFrame - 1) / 30, after = t >= cutT;
  const u = clamp((t - c.start) / (cutT - c.start)), v = clamp((t - cutT) / (c.end - cutT));
  const zoom = after ? 1.14 + .11 * v : 1 + .055 * (.8 * u + .2 * sio(u));   // a steady push (never a held frame)
  // the band that is open (the old-TV line opening / closing)
  let top = 0, bot = 1080, lineA = 0;
  if (t < o.open[1]) { const e = eoX((t - o.open[0]) / (o.open[1] - o.open[0])); top = o.yOpen * (1 - e); bot = o.yOpen + (1080 - o.yOpen) * e; lineA = 1 - e; }
  if (t > o.close[0]) { const e = clamp((t - o.close[0]) / (o.close[1] - o.close[0])), q = e * e * (3 - 2 * e); top = q * o.yClose; bot = 1080 - q * (1080 - o.yClose); lineA = Math.max(lineA, q); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#020208'; ctx.fillRect(0, 0, 1920, 1080);
  const hv = Math.max(0, bot - top);
  if (hv > .5) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, top, 1920, hv); ctx.clip();
    if (fr) {
      // (the frame sits 119 px right of centre: the podcast's corner logo stays outside the picture)
      // zoom about the face (it stays where it was on the unzoomed frame); before the cut about the frame centre
      const b = 1080 / fr.height, s = b * zoom, fx = after ? FACE[0] : fr.width / 2, fy = after ? FACE[1] : fr.height / 2;
      const px = 960 + 119 - fr.width * b / 2 + fx * b, py = fy * b, bx = px - fx * s, by = py - fy * s;
      ctx.drawImage(fr, bx, by, fr.width * s, fr.height * s);
    }
    // a whisper of the screen: scanlines and a vignette, so the footage sits in the film's print
    ctx.globalAlpha = .045; ctx.fillStyle = '#000'; for (let y = top - (top % 4); y < bot; y += 4) ctx.fillRect(0, y, 1920, 1.5); ctx.globalAlpha = 1;
    const vg = ctx.createRadialGradient(960, 540, 420, 960, 540, 1150); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, 'rgba(5,6,15,.45)'); ctx.fillStyle = vg; ctx.fillRect(0, top, 1920, hv);
    ctx.restore();
  }
  // the line at the band's edges while it opens or closes
  if (lineA > .01) {
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const y of hv < 2 ? [(top + bot) / 2] : [top, bot]) for (const [lw, a] of [[22, .07], [7, .22], [1.8, .95]]) { ctx.strokeStyle = rgba(lw < 3 ? '#eefcff' : '#8fe6ff', a * lineA); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-20, y); ctx.lineTo(1940, y); ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
  // lower third (above the subtitle zone), in once the band is open
  if (t > o.open[1] - .05 && t < o.close[0] + .05) lowerThird(ctx, t, T, 'C1', { x: 110, y: 850, info: { name: 'Sam Altman', role: 'CEO, OpenAI', source: '', date: '' } });
}
