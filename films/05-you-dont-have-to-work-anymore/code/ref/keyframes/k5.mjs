// K5 · §7 the top (wow of the film): "What is this life for?" The apex of the Hill lifts off and opens into the night sky.
// The sky behind is the field of ~4,000 weeks (80 years x 52), the lived ones glowing amber, dissolving upward into stars.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, figure, handPos, save, prng, mix, clamp, sm } from './lib.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas();
  vgrad(ctx, [[0, '#04050f'], [.55, '#0b0f2a'], [1, '#1d1a4a']]);
  stars(ctx, t, { n: 420, y1: 700, a: .9, seed: 17 });
  // the weeks: 80 columns (years) x 52 rows (weeks), lived years left of "now" glow amber
  const cols = 80, rows = 52, gx0 = W / 2 - 520, gx1 = W / 2 + 520, gy0 = 50, gy1 = 520, now = 34;
  const r = prng(77);
  for (let c = 0; c < cols; c++) for (let w = 0; w < rows; w++) {
    const x = mix(gx0, gx1, c / (cols - 1)), y = mix(gy0, gy1, w / (rows - 1));
    // distance from the apex: the field is densest/most ordered near the summit and dissolves outward into stars
    const d = Math.hypot((x - W / 2) / 560, (y - 520) / 520), dis = sm(clamp((d - .62) / .5));
    const jx = (r() - .5) * 60 * dis, jy = (r() - .5) * 60 * dis;
    if (r() < dis * .7) continue;
    const lived = c < now || (c === now && w < 20);
    const a = (1 - dis * .8) * (lived ? .85 : .42) * (.85 + .15 * Math.sin(t * 1.3 + c * .7 + w));
    ctx.fillStyle = rgba(lived ? C.amber : '#c9c3ee', lived ? a : a * .8);
    const sz = lived ? 3.2 : 2.2; ctx.fillRect(x + jx - sz / 2, y + jy - sz / 2, sz, sz);
  }
  // the "now" week: one brighter point
  glow(ctx, mix(gx0, gx1, now / (cols - 1)), mix(gy0, gy1, 20 / 51), 30, .9, C.amber, C.cream);
  // light rising from the summit
  glow(ctx, W / 2, 640, 520, .4, C.amber, C.amberHot);
  // the Hill's top: flanks rising from the bottom of frame, the summit is flat now: the apex has lifted off
  const sumY = 700, sumW = 120, baseY = 1180, halfW = 900;
  const xAt = (y, s) => W / 2 + s * mix(sumW, halfW, (y - sumY) / (baseY - sumY));
  ctx.fillStyle = '#15153f'; ctx.beginPath(); ctx.moveTo(xAt(baseY, -1), baseY); ctx.lineTo(xAt(sumY, -1), sumY); ctx.lineTo(xAt(sumY, 1), sumY); ctx.lineTo(xAt(baseY, 1), baseY); ctx.fill();
  // lit rim on the summit edge
  ctx.fillStyle = rgba(C.amberHot, .8); ctx.fillRect(xAt(sumY, -1), sumY - 1, sumW * 2, 2.5);
  // tiers below, all alight now: rows of warm windows and a zigzag path of lanterns up to the summit
  for (let b = 0; b < 3; b++) {
    const y = 790 + b * 110, xl = xAt(y, -1) + 20, xr = xAt(y, 1) - 20;
    ctx.fillStyle = rgba('#05061a', .55); ctx.fillRect(xl - 20, y + 30, xr - xl + 40, 5);
    for (let x = xl; x < xr; x += 30 + (b * 7) % 11) {
      const hh = 24 + ((x * 13) % 20); ctx.fillStyle = '#1d1e55'; ctx.fillRect(x, y + 30 - hh, 24, hh);
      ctx.fillStyle = rgba(C.amberHot, .9); ctx.fillRect(x + 9, y + 30 - hh + 8, 6, 8);
      glow(ctx, x + 12, y + 30 - hh + 12, 20, .25, C.amber, C.amberHot);
    }
  }
  // path of small lanterns zigzagging up
  { const pts = [[W / 2 - 300, 1080], [W / 2 + 160, 1000], [W / 2 - 180, 900], [W / 2 + 90, 800], [W / 2 - 30, sumY]];
    ctx.strokeStyle = rgba(C.amberHot, .5); ctx.lineWidth = 2; ctx.setLineDash([3, 9]); ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of pts.slice(1)) ctx.lineTo(...p); ctx.stroke(); ctx.setLineDash([]); }
  // the lifted apex: a small triangle of light, rising and coming apart into points (it IS opening into the sky)
  const ay = 540 + Math.sin(t * .5) * 4, aw = sumW, ah = 150;
  { const g = ctx.createLinearGradient(0, ay - ah, 0, ay); g.addColorStop(0, rgba(C.cream, .0)); g.addColorStop(1, rgba(C.amberHot, .35));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W / 2 - aw, ay); ctx.lineTo(W / 2, ay - ah); ctx.lineTo(W / 2 + aw, ay); ctx.fill();
    const rr = prng(5);
    for (let i = 0; i < 260; i++) { // points along the edges and inside, scattering upward
      const u = rr(), v = rr(), up = Math.pow(rr(), 2);
      let x = W / 2 + (u - .5) * 2 * aw * (1 - v), y = ay - v * ah;
      x += (rr() - .5) * 120 * up; y -= up * 260;
      ctx.fillStyle = rgba(rr() < .5 ? C.amberHot : C.cream, .9 - up * .6); ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
    }
    ctx.strokeStyle = rgba(C.amberHot, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - aw, ay); ctx.lineTo(W / 2 + aw, ay); ctx.stroke();
    glow(ctx, W / 2, ay, 200, .45, C.amber, C.cream, { sy: .4 }); }
  // two figures on the summit: an old one and a young one, hand in hand, looking up
  const oldP = { lean: -.04, head: -.35, sh: [.42, -.1], el: [.05, .2], hip: [.05, -.08], kn: [0, .05], hair: 'grey', coat: true };
  const kidP = { lean: -.05, head: -.6, sh: [.75, .1], el: [-.1, .2], hip: [.06, -.06], kn: [0, 0], hair: 'bun' };
  const ox = W / 2 - 26, oy = sumY - 88 * .55, os = .55, ks = .36;
  const [hx, hy] = handPos(ox, oy, os, oldP, 0);
  // place the child so its front hand lands in the old hand
  const [kx0, ky0] = handPos(0, 0, ks, kidP, 0, true);
  const kx = hx - kx0, ky = sumY - 88 * ks;
  figure(ctx, kx, ky, ks, kidP, { rim: C.amberHot, rimSide: -1, col: '#0a0920', rimW: 1.2, flip: true });
  figure(ctx, ox, oy, os, oldP, { rim: C.amberHot, rimSide: 1, col: '#0a0920', rimW: 1.5 });
  finish(ctx, t, { grain: .05, vig: .6 });
  save(cv, out);
}
frame(0, process.argv[2] || 'k5.png');
