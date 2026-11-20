// labels for the Maslow hill: right-side column, dotted leader lines from the flank, title once
import { C, rgba, text, mix } from './lib.mjs';
export const LEVELS = ['Physiological · Safety', 'Belonging', 'Esteem', 'Self-actualization', 'Self-transcendence'];
export function hillLabels(ctx, G, lit, { x = 1450, title = true, alpha = 1, size = 34, only = null, titleY = null, backing = .55 } = {}) {
  if (backing > 0) { const g = ctx.createLinearGradient(x - 260, 0, x + 120, 0); g.addColorStop(0, 'rgba(8,9,30,0)'); g.addColorStop(1, `rgba(8,9,30,${backing})`); ctx.fillStyle = g; ctx.fillRect(x - 260, 0, 2000, 1080); }
  for (let b = 0; b < 5; b++) {
    if (only && !only.includes(b)) continue;
    const ym = b === 4 ? mix(G.bands[4], G.bands[5], .35) : (G.bands[b] + G.bands[b + 1]) / 2, xr = G.edge(ym, 1) + 14;
    const on = lit[b] > .2, a = alpha * (on ? 1 : .78);
    ctx.strokeStyle = rgba(on ? C.amber : '#d6d1ea', .5 * a); ctx.lineWidth = 1.2; ctx.setLineDash([2, 5]);
    ctx.beginPath(); ctx.moveTo(xr, ym); ctx.lineTo(x - 16, ym); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = rgba(on ? C.amber : '#d6d1ea', a); ctx.beginPath(); ctx.arc(xr, ym, 3, 0, 7); ctx.fill();
    text(ctx, LEVELS[b], x, ym + 11, { size, font: 'Instrument Serif', color: on ? C.cream : '#d6d1ea', alpha: a });
  }
  if (title) { const ty = titleY ?? G.apexY - 10; ctx.fillStyle = rgba(C.amber, alpha); ctx.fillRect(x, ty - 30, 28, 2); text(ctx, 'MASLOW’S HIERARCHY OF NEEDS', x, ty, { size: 16, weight: 600, color: C.muted, spacing: 6, alpha }); }
}
