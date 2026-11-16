// H5 · explainer graphic: the free-time curve (Sharif, Mogilner & Hershfield 2021, JPSP).
// Satisfaction rises to ~2 h of discretionary time a day, plateaus, then dips past ~5 h. The dip disappears when the time
// is spent with people or on something productive (dotted cyan). A small walker from the previous scene walks the curve.
import { W, H, C, rgba, canvas, vgrad, glow, finish, figure, save, text, mix, speckle } from './lib.mjs';
export function frame(t, out, u = 1) {
  const [cv, ctx] = canvas();
  vgrad(ctx, [[0, '#0b0f2a'], [1, '#141640']]);
  glow(ctx, 900, 520, 900, .18, C.violet, C.muted);
  const X0 = 300, X1 = 1640, Y0 = 820, Y1 = 280, hmax = 8;
  const px = (h) => X0 + (h / hmax) * (X1 - X0), py = (v) => Y0 - v * (Y0 - Y1);
  const f = (h) => { const rise = 1 - Math.exp(-h / .8); const dip = h > 5 ? Math.pow((h - 5) / 3, 1.6) * .24 : 0; return .12 + .7 * rise - dip; };
  const g = (h) => { const rise = 1 - Math.exp(-h / .8); return .12 + .7 * rise + (h > 5 ? (h - 5) * .006 : 0); };
  // axes
  ctx.strokeStyle = rgba(C.muted, .6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X0, Y1 - 30); ctx.lineTo(X0, Y0); ctx.lineTo(X1 + 30, Y0); ctx.stroke();
  for (let h = 0; h <= hmax; h++) { ctx.fillStyle = rgba(C.muted, .6); ctx.fillRect(px(h) - .75, Y0, 1.5, 8); text(ctx, String(h), px(h), Y0 + 38, { size: 22, color: C.muted, align: 'center' }); }
  text(ctx, 'FREE TIME PER DAY (HOURS)', (X0 + X1) / 2, Y0 + 84, { size: 15, weight: 600, color: C.muted, spacing: 5, align: 'center' });
  ctx.save(); ctx.translate(X0 - 40, (Y0 + Y1) / 2); ctx.rotate(-Math.PI / 2); text(ctx, 'LIFE SATISFACTION', 0, 0, { size: 15, weight: 600, color: C.muted, spacing: 5, align: 'center' }); ctx.restore();
  // the sweet spot band 2-5 h
  ctx.fillStyle = rgba(C.amber, .04); ctx.fillRect(px(2), Y1 - 60, px(5) - px(2), Y0 - Y1 + 60);
  ctx.strokeStyle = rgba(C.amber, .35); ctx.setLineDash([3, 6]); ctx.lineWidth = 1.2; for (const h of [2, 5]) { ctx.beginPath(); ctx.moveTo(px(h), Y1 - 60); ctx.lineTo(px(h), Y0); ctx.stroke(); } ctx.setLineDash([]);
  text(ctx, '2 h', px(2) + 10, Y1 - 36, { size: 22, font: 'Instrument Serif', color: C.amber });
  text(ctx, '5 h', px(5) + 10, Y1 - 36, { size: 22, font: 'Instrument Serif', color: C.amber });
  // dotted: with people / something that matters (grows in after the main curve)
  ctx.strokeStyle = rgba(C.cyan, .9); ctx.lineWidth = 3.5; ctx.setLineDash([2, 10]); ctx.lineCap = 'round';
  ctx.beginPath(); for (let h = 4.6; h <= mix(4.6, hmax, u); h += .05) { h === 4.6 ? ctx.moveTo(px(h), py(g(h))) : ctx.lineTo(px(h), py(g(h))); } ctx.stroke(); ctx.setLineDash([]);
  // main curve with glow
  const path = () => { ctx.beginPath(); for (let h = 0; h <= hmax; h += .04) h === 0 ? ctx.moveTo(px(h), py(f(h))) : ctx.lineTo(px(h), py(f(h))); };
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.amber, .18); ctx.lineWidth = 16; path(); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = C.cream; ctx.lineWidth = 4; path(); ctx.stroke();
  // labels on the curves
  text(ctx, 'alone, nothing in particular', px(5.25), py(f(6.6)) + 70, { size: 30, font: 'Instrument Serif', color: C.cream });
  text(ctx, 'with people, or on something that matters', px(6.4), py(g(6.4)) - 34, { size: 30, font: 'Instrument Serif', color: C.cyan, align: 'center' });
  // the walker on the plateau (element carried in from the previous scene)
  const wh = 3.6, wx = px(wh), wy = py(f(wh)) - 4, ph = t * 6;
  figure(ctx, wx, wy - 88 * .62, .62, { lean: .06, head: .05, sh: [Math.sin(ph) * .45, -Math.sin(ph) * .45], el: [.3, .3], hip: [Math.sin(ph) * .4, -Math.sin(ph) * .4], kn: [.15, .35], hair: 'curly' }, { rim: C.amberHot, rimSide: 1, col: '#0b0d26', rimW: 2 });
  glow(ctx, wx, wy, 70, .25, C.amber, C.amberHot);
  // title + source
  ctx.fillStyle = C.amber; ctx.fillRect(X0, 120, 28, 2);
  text(ctx, 'More free time helps, up to a point.', X0, 190, { size: 58, font: 'Instrument Serif', color: C.cream });
  text(ctx, 'Sharif, Mogilner & Hershfield (2021), 35,000+ Americans · Journal of Personality and Social Psychology · curve schematic', X0, 1010, { size: 16, color: C.muted, alpha: .8 });
  speckle(ctx, 0, 0, W, H, 1500, C.cyanWhite, .05, 3);
  finish(ctx, t, { grain: .045, vig: .5 });
  save(cv, out);
}
if (process.argv[1].endsWith('h5.mjs')) frame(0.4, process.argv[2] || 'h5.png');
