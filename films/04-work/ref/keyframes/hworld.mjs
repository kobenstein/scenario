// the hill world (K2 look): dusk sky, terraced hill town, quay, sea. Used by H1, H2, H3.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, figure, hillGeo, drawHill, reflect, sea, save } from './lib.mjs';
export function world(ctx, cv, t, lit = [1, 0, 0, 0, 0], { night = false, figs = true, apexY = 130, halfW = 560, hscale = 1, cx: CX = 760 } = {}) {
  if (night) { vgrad(ctx, [[0, '#04051a'], [.5, '#0b0f2a'], [.85, '#1f1c55'], [1, '#3b2f6e']], 0, 0, W, 780); stars(ctx, t, { n: 420, y1: 640, a: .8, seed: 4 }); }
  else { vgrad(ctx, [[0, '#1a1850'], [.38, '#4a3a7e'], [.62, '#c97f86'], [.73, '#f0a77a']], 0, 0, W, 780);
  stars(ctx, t, { n: 60, y1: 240, a: .35, seed: 4 }); }
  const cx = CX;
  glow(ctx, cx, 740, 620, night ? .28 : .5, night ? C.violet : C.dusk, C.amberHot);
  const far = (pts, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 780); for (const p of pts) ctx.lineTo(...p); ctx.lineTo(W, 780); ctx.closePath(); ctx.fill(); };
  far([[0, 680], [160, 640], [300, 670], [1200, 700], [1380, 650], [1560, 680], [1760, 630], [1920, 670]], night ? '#1c1a48' : '#8a6488');
  far([[0, 720], [220, 700], [1500, 725], [1700, 700], [1920, 715]], night ? '#141338' : '#5e4677');
  const G = hillGeo(cx, 780, halfW, apexY, 34 * hscale);
  const [hc, hx] = canvas();
  drawHill(hx, t, G, { lit, sep: 1, body: '#2a2560', body2: '#16173f', rimHex: night ? C.cyan : C.rose, rimA: night ? .35 : .55, seed: 12, scale: hscale });
  ctx.drawImage(hc, 0, 0);
  ctx.fillStyle = '#0d0e2c'; ctx.fillRect(0, 780, W, 22);
  for (let i = 0; i < 9; i++) { const x = cx - 430 + i * 108; ctx.fillStyle = '#0d0e2c'; ctx.fillRect(x - 1.5, 722, 3, 58); glow(ctx, x, 722, 60, .45, C.amber, C.amberHot); }
  sea(ctx, t, 802, { top: '#2a2a62', bottom: '#0b0c2a', glint: C.amberHot, glintA: .3, gx: cx, gw: 520 });
  reflect(ctx, cv, 802, { a: .26, t, h: 220 });
  if (!figs) return G;
  const rim = C.amberHot;
  figure(ctx, cx - 160, 750, .34, { lean: .02, head: .05, sh: [.25, -.25], el: [.2, .2], hip: [.25, -.25], kn: [.1, .3], coat: true }, { rim, rimSide: 1 });
  figure(ctx, cx - 134, 763, .21, { lean: .02, head: -.2, sh: [-.6, -.2], el: [-.3, .1], hip: [-.25, .3], kn: [.3, .05], hair: 'bun' }, { rim, rimSide: 1 });
  figure(ctx, cx + 170, 750, .33, { lean: 0, head: -.25, sh: [2.4, -.1], el: [.25, .2], hip: [.06, -.06], kn: [0, 0] }, { rim, rimSide: -1 });
  figure(ctx, cx + 200, 752, .32, { lean: -.03, head: -.2, sh: [.2, .1], el: [.3, .25], hip: [.08, -.04], kn: [0, .05], hair: 'curly', skirt: true }, { rim, rimSide: -1, flip: true });
  return G;
}
