// "ORIGINAL FOOTAGE" pill beside an interview clip's name (Jakob 2026-10-21: viewers must see the clip is a real recording, as in Film 6).
//   footageTag(ctx, t, x, y, name, u)   x, y = the name's left baseline (44 px Instrument Serif), u 0..1 = wipe from the left (in and out)
// Screen space; a dark glass pill, a pulsing amber recording light, cream caps.
import { addGlow, text } from '../engine.mjs';

const TAG = 'ORIGINAL FOOTAGE', PH = 36;
export function footageTag(ctx, t, x, y, name, u) {
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = '44px "Instrument Serif"'; const nw = ctx.measureText(name).width;
  ctx.font = '600 18px "Inter"'; const tw = ctx.measureText(TAG).width + TAG.length * 3.5;
  const x0 = x + nw + 26, w = tw + 50, cy = y - 13;
  ctx.beginPath(); ctx.rect(x0 - 4, cy - PH, w * Math.min(1, u) + 8, PH * 2); ctx.clip();
  ctx.fillStyle = 'rgba(7,9,24,.55)'; ctx.strokeStyle = 'rgba(243,239,226,.5)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.roundRect(x0, cy - PH / 2, w, PH, PH / 2); ctx.fill(); ctx.stroke();
  const pulse = .75 + .25 * Math.sin(t * 3.2);
  addGlow(ctx, x0 + 20, cy, 18, .35 * pulse, '#ffb35c', '#ffe2b8');
  ctx.fillStyle = 'rgba(255,179,92,.95)'; ctx.beginPath(); ctx.arc(x0 + 20, cy, 5.2, 0, Math.PI * 2); ctx.fill();
  text(ctx, TAG, x0 + 36, cy + 6.5, { size: 18, weight: 600, color: '#f3efe2', alpha: .95, spacing: 3.5 });
  ctx.restore();
}
