// K7 · clip treatment. "Who am I, if I'm not my job?" -> push-in on one lit window in the dark upper tiers of the Hill;
// the window frame becomes the clip frame (grain frame, duotone grade, amber hairline, name label).
// The footage itself is a PLACEHOLDER here (silhouette in a studio); the real clip gets the same grade.
import { W, H, C, rgba, canvas, vgrad, glow, finish, save, prng, mix, text, speckle } from './lib.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas();
  // surrounding: the house wall of the upper tier, very close, dark, with two neighbouring small windows still dark
  vgrad(ctx, [[0, '#0d0f30'], [1, '#090a22']]);
  for (let i = 0; i < 26; i++) { ctx.fillStyle = rgba('#05061a', .25); ctx.fillRect(0, i * 44, W, 2); } // plaster courses
  ctx.fillStyle = '#05061a'; ctx.fillRect(40, 300, 120, 170); ctx.fillRect(1780, 520, 110, 170);
  ctx.fillStyle = rgba(C.rose, .08); ctx.fillRect(1780, 520, 110, 4);
  // the window opening = the clip frame
  const fx = 360, fy = 150, fw = 1200, fh = 675;
  // deep reveal (window depth) around the frame
  ctx.fillStyle = '#05061a'; ctx.fillRect(fx - 26, fy - 26, fw + 52, fh + 52);
  ctx.fillStyle = '#14164a'; ctx.beginPath(); ctx.moveTo(fx - 26, fy + fh + 26); ctx.lineTo(fx + fw + 26, fy + fh + 26); ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(fx, fy + fh); ctx.fill(); // sill
  // spill of the clip light onto the wall and sill
  glow(ctx, fx + fw / 2, fy + fh / 2, 1100, .22, '#c9b8ff', C.cream);
  // --- placeholder footage, graded duotone (indigo shadows -> cream highlights) ---
  const [fc, f] = canvas(fw, fh);
  { const g = f.createRadialGradient(fw * .62, fh * .35, 0, fw * .62, fh * .35, fw * .8); g.addColorStop(0, '#6b5fa8'); g.addColorStop(.6, '#241f5a'); g.addColorStop(1, '#0c0d2e'); f.fillStyle = g; f.fillRect(0, 0, fw, fh);
    // bokeh of a studio behind
    const r = prng(3); for (let i = 0; i < 26; i++) { const x = r() * fw, y = r() * fh * .7, rr = 20 + r() * 50; f.fillStyle = rgba(r() < .5 ? C.cream : C.amber, .06 + .08 * r()); f.beginPath(); f.arc(x, y, rr, 0, 7); f.fill(); }
    // head-and-shoulders silhouette, three-quarter, key light from the right (faceless placeholder)
    const cx = fw * .44, cy = fh * .62;
    f.fillStyle = '#16133e';
    f.beginPath(); f.moveTo(cx - 330, fh); f.bezierCurveTo(cx - 320, cy + 40, cx - 170, cy - 10, cx - 30, cy - 18); f.bezierCurveTo(cx + 120, cy - 20, cx + 300, cy + 20, cx + 330, fh); f.fill();
    f.beginPath(); f.ellipse(cx + 10, cy - 150, 92, 118, .05, 0, 7); f.fill();
    f.fillRect(cx - 40, cy - 70, 90, 70);
    // key light from the right: a soft lit edge on head and shoulder (clipped to the silhouette)
    f.save(); f.beginPath(); f.ellipse(cx + 10, cy - 150, 92, 118, .05, 0, 7); f.moveTo(cx - 330, fh); f.bezierCurveTo(cx - 320, cy + 40, cx - 170, cy - 10, cx - 30, cy - 18); f.bezierCurveTo(cx + 120, cy - 20, cx + 300, cy + 20, cx + 330, fh); f.clip();
    const lg = f.createLinearGradient(cx + 20, 0, cx + 330, 0); lg.addColorStop(0, 'rgba(243,239,226,0)'); lg.addColorStop(1, 'rgba(243,239,226,.35)'); f.fillStyle = lg; f.fillRect(cx - 100, 0, 500, fh);
    const lh = f.createLinearGradient(cx + 30, 0, cx + 102, 0); lh.addColorStop(0, 'rgba(243,239,226,0)'); lh.addColorStop(1, 'rgba(243,239,226,.45)'); f.fillStyle = lh; f.fillRect(cx + 30, cy - 270, 80, 240);
    f.restore();
    // grade: grain inside the footage (stronger than the world, it is "found footage")
    speckle(f, 0, 0, fw, fh, 26000, C.cream, .10, 5); speckle(f, 0, 0, fw, fh, 16000, '#05061a', .18, 6);
    // scanline whisper
    for (let y = 0; y < fh; y += 4) { f.fillStyle = 'rgba(0,0,0,.05)'; f.fillRect(0, y, fw, 1.5); }
  }
  ctx.save(); ctx.beginPath(); ctx.roundRect(fx, fy, fw, fh, 6); ctx.clip(); ctx.drawImage(fc, fx, fy); ctx.restore();
  // window glazing bars as a ghost over the clip (so it still reads as THE window), very faint
  ctx.fillStyle = rgba('#05061a', .16); ctx.fillRect(fx + fw / 2 - 4, fy, 8, fh); ctx.fillRect(fx, fy + fh * .42, fw, 7);
  // amber hairline frame
  ctx.strokeStyle = rgba(C.amber, .85); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(fx - 10, fy - 10, fw + 20, fh + 20, 8); ctx.stroke();
  // small corner ticks (editorial)
  ctx.fillStyle = C.amber; for (const [x, y] of [[fx - 10, fy - 10], [fx + fw + 10, fy - 10], [fx - 10, fy + fh + 10], [fx + fw + 10, fy + fh + 10]]) { ctx.fillRect(x - 6, y - 1, 12, 2); ctx.fillRect(x - 1, y - 6, 2, 12); }
  text(ctx, 'CLIP PLACEHOLDER', fx + fw - 16, fy + 34, { size: 14, weight: 600, color: C.muted, align: 'right', spacing: 4, alpha: .7 });
  // subtitle (burned in, two lines max, cream on the footage)
  text(ctx, '“If you didn’t have to work today,', fx + fw / 2, fy + fh - 92, { size: 46, font: 'Instrument Serif', align: 'center' });
  text(ctx, 'what would you do with your life?”', fx + fw / 2, fy + fh - 40, { size: 46, font: 'Instrument Serif', align: 'center' });
  // name label (lower left, outside the frame, wipes up)
  ctx.fillStyle = C.amber; ctx.fillRect(fx - 10, fy + fh + 44, 4, 78);
  text(ctx, 'Mustafa Suleyman', fx + 14, fy + fh + 84, { size: 44, font: 'Instrument Serif' });
  text(ctx, 'CEO, MICROSOFT AI  ·  INTERVIEW', fx + 16, fy + fh + 116, { size: 17, weight: 600, color: C.muted, spacing: 5 });
  finish(ctx, t, { grain: .05, vig: .6 });
  save(cv, out);
}
frame(0, process.argv[2] || 'k7.png');
