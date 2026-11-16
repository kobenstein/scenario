// H2 · §4 push-in (transition type b): camera is 2.4x into the labelled hill on the Belonging terrace; one lit window
// grows toward the lens and becomes the kitchen: you visiting your grandmother on a Tuesday afternoon. Mid-transition frame.
import { W, H, C, rgba, canvas, glow, finish, save, mix, text } from './lib.mjs';
import { world } from './hworld.mjs';
import { LEVELS } from './hlabels.mjs';
import { kitchen } from './kitchen.mjs';
export function frame(t, out, u = .62) {
  const [cv, ctx] = canvas();
  const z = mix(1, 2.4, Math.min(1, u * 1.4)), fx = 880, fy = 505, ox = 700, oy = 560;
  const toS = (x, y) => [ox + (x - fx) * z, oy + (y - fy) * z];
  ctx.save(); ctx.translate(ox, oy); ctx.scale(z, z); ctx.translate(-fx, -fy);
  const lit = [1, 1, 0, 0, 0];
  const G = world(ctx, cv, t, lit);
  ctx.restore();
  // dim the hill a touch so the opening window leads
  ctx.fillStyle = 'rgba(6,7,24,.25)'; ctx.fillRect(0, 0, W, H);
  // labels in screen space: Belonging large, neighbours small and quiet
  const LX = 1440;
  for (const b of [0, 1, 2]) {
    const ymW = (G.bands[b] + G.bands[b + 1]) / 2; const [xr, ym] = toS(G.edge(ymW, 1) + 6, ymW);
    if (ym < 40 || ym > H - 40) continue;
    const big = b === 1, a = big ? 1 : .6;
    ctx.strokeStyle = rgba(big ? C.amber : '#d6d1ea', .55 * a); ctx.lineWidth = big ? 1.6 : 1.2; ctx.setLineDash([2, 6]);
    ctx.beginPath(); ctx.moveTo(xr, ym); ctx.lineTo(LX - 18, ym); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = rgba(big ? C.amber : '#d6d1ea', a); ctx.beginPath(); ctx.arc(xr, ym, big ? 4 : 3, 0, 7); ctx.fill();
    text(ctx, LEVELS[b], LX, ym + (big ? 18 : 11), { size: big ? 58 : 32, font: 'Instrument Serif', color: big ? C.cream : '#d6d1ea', alpha: a });
  }
  ctx.fillStyle = C.amber; ctx.fillRect(LX, 62, 28, 2);
  text(ctx, 'MASLOW’S HIERARCHY OF NEEDS', LX, 92, { size: 16, weight: 600, color: C.muted, spacing: 6 });
  // the chosen window: origin on the terrace (small) -> current rect (large); smear ghosts along the path
  const [wx, wy] = toS(1046, 553);
  const c0 = { x: wx - 6 * z, y: wy - 8 * z, w: 12 * z, h: 10 * z }, c1 = { x: 150, y: 150, w: 800, h: 534 };
  const e = u * u * (3 - 2 * u), cur = (k) => ({ x: mix(c0.x, c1.x, k), y: mix(c0.y, c1.y, k), w: mix(c0.w, c1.w, k), h: mix(c0.h, c1.h, k) });
  glow(ctx, c1.x + c1.w / 2, c1.y + c1.h / 2, 820, .22, C.amber, C.amberHot);
  for (let k = 1; k <= 5; k++) { const r = cur(Math.pow(k / 6, 2.2)); ctx.strokeStyle = rgba(C.amberHot, .06 + .05 * k); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 3 + k * 2); ctx.stroke(); }
  ctx.fillStyle = rgba(C.amberHot, .95); ctx.fillRect(c0.x, c0.y, c0.w, c0.h); glow(ctx, c0.x + c0.w / 2, c0.y + c0.h / 2, 90, .5, C.amber, C.amberHot);
  { const g = ctx.createLinearGradient(c0.x, c0.y, c1.x + c1.w, c1.y + c1.h); g.addColorStop(0, rgba(C.amberHot, .5)); g.addColorStop(1, rgba(C.amberHot, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(c0.x, c0.y); ctx.lineTo(c0.x + c0.w, c0.y + c0.h); ctx.lineTo(c1.x + c1.w, c1.y + c1.h - 40); ctx.lineTo(c1.x + c1.w - 40, c1.y + c1.h); ctx.closePath(); ctx.fill(); }  // the source window stays lit on the house
  ctx.fillStyle = '#05061a'; ctx.beginPath(); ctx.roundRect(c1.x - 7, c1.y - 7, c1.w + 14, c1.h + 14, 14); ctx.fill();
  kitchen(ctx, c1.x, c1.y, c1.w, c1.h, t);
  // window mullions dissolving as we pass through the glass
  ctx.strokeStyle = rgba('#3a2440', .3); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(c1.x + c1.w / 2, c1.y); ctx.lineTo(c1.x + c1.w / 2, c1.y + c1.h); ctx.moveTo(c1.x, c1.y + c1.h * .42); ctx.lineTo(c1.x + c1.w, c1.y + c1.h * .42); ctx.stroke();
  ctx.strokeStyle = rgba('#fff1d6', .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(c1.x, c1.y, c1.w, c1.h, 10); ctx.stroke();
  finish(ctx, t, { grain: .05, vig: .6 });
  save(cv, out);
}
if (process.argv[1].endsWith('h2.mjs')) frame(0, process.argv[2] || 'h2.png');
