// Placeholder painter for the shared Film 5 helpers whose owner chunk has not delivered yet (lead, 2026-10-20).
// The owner replaces the helper's body; the signature and the returned anchors stay. Do not import this file in final code.
import { W, H, rgba, text } from '../engine.mjs';
export function phFrame(ctx, top = '#10142e', low = '#2a2440') {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, low); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
export function phBox(ctx, x, y, w, h, label, col = '#efe4cc', a = .85) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(col, .18); ctx.strokeStyle = rgba(col, .8); ctx.lineWidth = 2; ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  text(ctx, 'placeholder · ' + label, x + 14, y + 30, { size: 22, color: col, weight: 600 }); ctx.restore();
}
