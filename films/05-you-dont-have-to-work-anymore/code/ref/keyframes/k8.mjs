// K8 · quote-card fallback (used for Bronnie Ware, and as fallback for any clip that cannot be licensed or downloaded).
// Same frame language as the clip window: amber hairline + corner ticks, cream Instrument Serif, name label. Behind: the weeks field, dimmed.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, save, prng, mix, text } from './lib.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas();
  vgrad(ctx, [[0, '#05060f'], [1, '#121540']]);
  stars(ctx, t, { n: 300, y1: H, a: .5, seed: 23 });
  // weeks field, out of focus behind the card (bigger soft dots)
  for (let c = 0; c < 80; c++) for (let w = 0; w < 52; w++) { const x = mix(260, W - 260, c / 79), y = mix(110, 970, w / 51), lived = c < 34; ctx.fillStyle = rgba(lived ? C.amber : '#c9c3ee', lived ? .16 : .08); ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 7); ctx.fill(); }
  glow(ctx, W / 2, H / 2, 900, .18, '#3b2f6e', '#6b5fa8', { add: false });
  // the card: a pane of night with a fine grain, slightly lifted
  const cx = 360, cy = 220, cw = 1200, ch = 600;
  ctx.fillStyle = rgba('#070918', .82); ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 6); ctx.fill();
  ctx.strokeStyle = rgba(C.amber, .85); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(cx - 10, cy - 10, cw + 20, ch + 20, 8); ctx.stroke();
  ctx.fillStyle = C.amber; for (const [x, y] of [[cx - 10, cy - 10], [cx + cw + 10, cy - 10], [cx - 10, cy + ch + 10], [cx + cw + 10, cy + ch + 10]]) { ctx.fillRect(x - 6, y - 1, 12, 2); ctx.fillRect(x - 1, y - 6, 2, 12); }
  text(ctx, '“', cx + 110, cy + 200, { size: 200, font: 'Instrument Serif', color: C.amber, alpha: .9 });
  const lines = ['I wish I’d had the courage', 'to live a life true to myself,', 'not the life others expected of me.'];
  lines.forEach((l, i) => text(ctx, l, cx + 190, cy + 210 + i * 86, { size: 72, font: 'Instrument Serif', color: i === 1 ? C.amberHot : C.cream }));
  ctx.fillStyle = C.amber; ctx.fillRect(cx + 192, cy + ch - 118, 4, 70);
  text(ctx, 'Bronnie Ware', cx + 214, cy + ch - 80, { size: 40, font: 'Instrument Serif' });
  text(ctx, 'PALLIATIVE NURSE  ·  THE TOP FIVE REGRETS OF THE DYING', cx + 216, cy + ch - 50, { size: 16, weight: 600, color: C.muted, spacing: 4 });
  finish(ctx, t, { grain: .05, vig: .55 });
  save(cv, out);
}
frame(0, process.argv[2] || 'k8.png');
