// s01_land · shot 1.04 "He thinks they will." Aerial night country in perspective; a cyan wave floods
// fields, roads and rail lines from the left foreground to the horizon. The "if" hangs small in the sky.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, roughPath, roughPoly, hatch, fog, bloom, vnoise, fbm, printFinish } from './art.mjs';
import { lin, sm, eio, eout, drift } from '../engine.mjs';
import { memo, spot, drawIf } from './s01_kit.mjs';

const HZ = 300, F = 820, CH = 1.0, LW = 2400;     // horizon, focal length, camera height; layer width (pan room)
const P = (gx, gz) => [LW / 2 + gx * F / gz, HZ + CH * F / gz];
const HOT = '#ffd9a0', AMB = '#ffb35c', CY = '#8fe6ff', CYW = '#d8f7ff';

function build() {
  const [c, g] = layer(LW, H + 200), r = prng(14), n = vnoise(15);
  { const gr = g.createLinearGradient(0, 0, 0, HZ + 10); gr.addColorStop(0, '#04061a'); gr.addColorStop(.7, '#121648'); gr.addColorStop(1, '#2c2a6e'); g.fillStyle = gr; g.fillRect(0, 0, LW, HZ + 10);
    for (let i = 0; i < 500; i++) { const m = r(); g.fillStyle = rgba('#e4ecff', .1 + .5 * m * m); g.fillRect(r() * LW, Math.pow(r(), 1.3) * (HZ - 20), m > .95 ? 2 : 1, m > .95 ? 2 : 1); } }
  // far mountains on the horizon
  { const pts = [[0, HZ + 4]]; for (let x = 0; x <= LW; x += 8) pts.push([x, HZ - 40 * fbm(n, x * .003, 2, 4) - 10]); pts.push([LW, HZ + 4]); roughPoly(g, pts, '#191a4e', { amp: 1, seed: 3 }); }
  // ground base
  { const gr = g.createLinearGradient(0, HZ, 0, H); gr.addColorStop(0, '#1d1d52'); gr.addColorStop(.3, '#121238'); gr.addColorStop(1, '#090a22'); g.fillStyle = gr; g.fillRect(0, HZ, LW, H + 200 - HZ); }
  // field parcels: a grid in ground space with jittered edges, each with its own tone and furrow hatching
  const gzs = []; for (let z = 1.15; z < 70; z *= 1.07 + r() * .05) gzs.push(z);
  const rows = [];
  for (let j = 0; j < gzs.length - 1; j++) {
    const z0 = gzs[j], z1 = gzs[j + 1], lim = (LW / 2 + 60) * z1 / F, xs = []; for (let x = -lim - r(); x <= lim + 1; x += (.35 + r() * .55) * Math.max(1, z1 / 6)) xs.push(x);
    rows.push({ z0, z1, xs });
    for (let i = 0; i < xs.length - 1; i++) {
      const q = [P(xs[i], z1), P(xs[i + 1], z1), P(xs[i + 1], z0), P(xs[i], z0)], far = clamp(j / gzs.length), tone = r();
      const col = mixHex(mixHex('#0f1034', '#33306c', tone), '#2a2c6a', far * .8);
      g.fillStyle = col; g.beginPath(); roughPath(g, q, { amp: .5, seed: i * 31 + j }); g.fill();
      const wpx = q[2][0] - q[3][0];
      if (wpx > 14 && r() < .85) { g.save(); g.clip(); const bb = [q[3][0] - 4, q[0][1] - 4, wpx + 8, q[3][1] - q[0][1] + 8]; const vx = LW / 2 - (q[3][0] + q[2][0]) / 2, vy = HZ - (q[3][1] + q[2][1]) / 2;
        hatch(g, bb, { angle: r() < .6 ? Math.atan2(vy, vx) : .01, gap: Math.max(2.5, 7 * (1 - far)), w: 1.1, col: r() < .5 ? '#5a5ab0' : '#05061a', a: .6, seed: i + j * 7, broken: .3, wobble: .6 }); g.restore(); }
    }
  }
  // a river winding to the horizon (sky reflection)
  { const L = [], R = []; for (let z = 1.0; z < 80; z *= 1.05) { const gx = -6 + 5 * Math.sin(z * .25) + z * .12; L.push(P(gx - .9, z)); R.push(P(gx + .9, z)); }
    roughPoly(g, [...L, ...R.reverse()], '#2a3070', { amp: 1, seed: 5 }); }
  // roads: straight lines to the vanishing point + cross roads
  g.strokeStyle = rgba('#05061a', .8); for (const gx of [-14, -3.5, 7, 19]) { const a = P(gx, 1), b = P(gx, 90); g.lineWidth = 3; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  for (const gz of [3, 7, 15, 30]) { const a = P(-60, gz), b = P(60, gz); g.lineWidth = Math.max(1, 8 / gz); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  // towns: clusters of warm windows at crossings (people still live here)
  for (const [gx, gz] of [[-3.5, 7], [7, 15], [-14, 30], [19, 7], [-3.5, 30], [7, 45]]) { const [x, y] = P(gx, gz), s = F / gz / 60; for (let k = 0; k < 26; k++) { const dx = (r() - .5) * 140 * s, dy = (r() - .5) * 30 * s; g.fillStyle = '#0a0a24'; g.fillRect(x + dx - 6 * s, y + dy - 10 * s, 12 * s, 12 * s); if (r() < .6) { g.fillStyle = rgba(HOT, .85); g.fillRect(x + dx - 2 * s, y + dy - 6 * s, Math.max(1, 3 * s), Math.max(1, 3 * s)); } } bloom(g, x, y, 90 * s + 20, { col: AMB, core: HOT, a: .3, k: .5, seed: gx * 10 | 0, sy: .4 }); }
  fog(g, { y0: HZ - 30, y1: HZ + 110, col: '#4a4a98', a: .45, seed: 16, cover: .6, soft: .5, k: .35, sx: .002, sy: .04, x1: LW });
  // ground-plane points for the wave: along furrow rows and roads
  const pts = [];
  for (const { z0, z1, xs } of rows) for (let i = 0; i < xs.length - 1; i++) { const k = 3 + Math.floor(r() * 4); for (let m = 0; m < k; m++) { const gx = mix(xs[i], xs[i + 1], r()), gz = mix(z0, z1, r()); const [x, y] = P(gx, gz); if (x < -20 || x > LW + 20 || y > H + 150) continue; pts.push({ x, y, s: Math.max(.8, 2.6 * F / gz / 300), o: 0, b: r() }); } }
  for (const gx of [-14, -3.5, 7, 19]) for (let z = 1.1; z < 70; z *= 1.04) { const [x, y] = P(gx, z); pts.push({ x, y, s: Math.max(1, 3.2 * F / z / 300), o: 0, b: r(), road: 1 }); }
  // wave order: from the left foreground toward the right horizon
  for (const p of pts) p.o = clamp((p.x / LW) * .55 + (1 - (p.y - HZ) / (H - HZ)) * .45 + (p.b - .5) * .04);
  return { c, pts };
}
export function drawLand(T) {
  const t0 = T.S('01a', 'thinks') - .25, tWill = T.S('01a', 'will');
  return (ctx, t) => {
    const L = memo('land', build), z = 1.04 + .03 * lin(t0, t0 + 2, t), pan = mix(0, 140, lin(t0 - .3, t0 + 2, t)) + drift(t, 6, 1);
    ctx.save(); ctx.translate(W / 2, H / 2 + 40); ctx.scale(z, z); ctx.translate(-LW / 2 + 0 - pan + 180, -H / 2 - 40 + drift(t, 3, 2));
    ctx.drawImage(L.c, 0, 0);
    const front = mix(-.1, 1.08, sm(lin(t0 - .2, tWill + .4, t)));
    // cyan wash over the flooded ground behind the front
    { const fx = mix(-200, LW + 400, front); const g = ctx.createLinearGradient(fx - 900, 0, fx, 0); g.addColorStop(0, rgba(CY, .1)); g.addColorStop(.85, rgba(CY, .16)); g.addColorStop(1, rgba(CY, 0)); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(-200, HZ + 4, Math.max(0, fx + 200), H); ctx.restore(); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const p of L.pts) {
      const a = clamp((front - p.o) / .05); if (a <= 0) continue;
      const flash = Math.exp(-((front - p.o) / .05 - 1) * .6) * (p.road ? 1 : .7);
      ctx.fillStyle = rgba(flash > .6 ? CYW : CY, Math.min(1, a * (.6 + .5 * flash)));
      ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
    }
    ctx.restore();
    // the wave front glows as it rolls
    for (const p of L.pts) { const d = (front - p.o) / .05; if (p.road && d > 0 && d < 2 && p.b < .5) spot(ctx, p.x, p.y, 10 + p.s * 6, .45 * (1 - d / 2), CY, CYW); }
    ctx.restore();
    drawIf(ctx, 960 + drift(t, 4, 3), 150 + drift(t, 3, 4), 170, 1, .8, { t, glowK: .7 });
    printFinish(ctx, { grain: .07, vig: .45 });
  };
}
