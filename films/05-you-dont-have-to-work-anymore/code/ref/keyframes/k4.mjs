// K4 · §4 the firework (wow of chapter 4): "Now there's time to build something like a tribe again. Streets full of people…"
// Fireworks over the Hill; falling sparks ignite the second tier (festoon strings, warm windows). Below: the long table, dancing.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, figure, handPos, hillGeo, drawHill, festoons, save, prng, mix, clamp } from './lib.mjs';
function burst(ctx, x, y, R, u, { seed = 1, n = 64, cols = [C.amberHot, C.amber, C.rose], a = 1 } = {}) {
  const r = prng(seed);
  glow(ctx, x, y, R * 1.4, .35 * a * (1 - u * .5), cols[1], cols[0]);
  glow(ctx, x, y, R * .45, .55 * a, cols[0], C.cream);
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + r() * .08, len = R * (.75 + r() * .3) * u, droop = 40 * u * u;
    const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len + droop;
    const mx = x + Math.cos(ang) * len * .55, my = y + Math.sin(ang) * len * .55 + droop * .2;
    const col = cols[i % cols.length];
    const g = ctx.createLinearGradient(x, y, ex, ey); g.addColorStop(0, rgba(col, 0)); g.addColorStop(.6, rgba(col, .25 * a)); g.addColorStop(1, rgba(col, .9 * a));
    ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * len * .25, y + Math.sin(ang) * len * .25); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
    ctx.fillStyle = rgba(C.cream, a); ctx.beginPath(); ctx.arc(ex, ey, 2.4, 0, 7); ctx.fill();
    glow(ctx, ex, ey, 14, .5 * a, col, C.cream);
    // trailing grain dots
    for (let k = 1; k < 5; k++) { const q = 1 - k * .07; ctx.fillStyle = rgba(col, .5 * a * (1 - k / 5)); ctx.fillRect(x + Math.cos(ang) * len * q - 1, y + Math.sin(ang) * len * q + droop * q * q + k * 3 - 1, 2, 2); }
  }
}
export function frame(t, out) {
  const [cv, ctx] = canvas();
  vgrad(ctx, [[0, '#070918'], [.5, '#121540'], [.8, '#2a2560']]);
  stars(ctx, t, { n: 220, y1: 600, a: .7, seed: 8 });
  // the Hill, closer than before: tiers 0..2 alight, tier 3 catching
  const G = hillGeo(W / 2, 905, 980, 40);
  // firework light on the hill flank
  drawHill(ctx, t, G, { lit: [1, .95, .45, 0, 0], body: '#1d1d52', body2: '#121238', rimHex: C.rose, rimA: .25, seed: 31, scale: 1.25 });
  festoons(ctx, t, G, 1, 1, { seed: 3, n: 9, sag: 18 });
  festoons(ctx, t, G, 2, .45, { seed: 5, n: 6, sag: 14 });
  // bursts: one big over the upper tiers, smaller around, one rising trail
  burst(ctx, 760, 190, 230, 1, { seed: 3, n: 72 });
  burst(ctx, 1290, 250, 150, .9, { seed: 6, n: 54, cols: [C.cream, C.rose, C.amber], a: .9 });
  burst(ctx, 1010, 110, 90, .6, { seed: 9, n: 40, cols: [C.amberHot, C.cream], a: .8 });
  { ctx.strokeStyle = rgba(C.amberHot, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1520, 640); ctx.quadraticCurveTo(1530, 520, 1545, 410); ctx.stroke(); glow(ctx, 1545, 410, 24, .9, C.amber, C.cream); }
  // sparks raining down onto tier 2 (the ignition)
  { const r = prng(4); for (let i = 0; i < 90; i++) { const x = mix(560, 1350, r()), y = mix(280, 600, Math.pow(r(), .8)); ctx.fillStyle = rgba([C.amberHot, C.rose, C.cream][i % 3], .4 + .5 * r()); ctx.fillRect(x, y, 2, 2 + r() * 6); } }
  // warm wash rising from the street onto the hill foot
  glow(ctx, W / 2, 940, 900, .35, C.amber, C.amberHot, { sy: .35 });
  // the street in front: long table, string lights, people
  vgrad(ctx, [[0, '#14123a'], [1, '#08081e']], 0, 900, W, 180);
  const rim = C.amberHot, dark = '#0b0a22';
  // diners (seated, behind the table), lively arms
  const diners = [
    [600, 975, { lean: -.15, head: -.45, sh: [1.2, .3], el: [.8, .6], hip: [1.5, 1.5], kn: [1.5, 1.5], hair: 'grey' }, false],   // grandmother laughing, head back
    [700, 975, { lean: .08, head: .1, sh: [1.6, .2], el: [.3, .5], hip: [1.5, 1.5], kn: [1.5, 1.5], hair: 'curly' }, false],
    [820, 975, { lean: .05, head: .15, sh: [.8, .9], el: [1.2, 1.1], hip: [1.5, 1.5], kn: [1.5, 1.5] }, true],
    [1000, 975, { lean: -.05, head: -.2, sh: [2.3, .2], el: [.4, .4], hip: [1.5, 1.5], kn: [1.5, 1.5], hair: 'long' }, false],
    [1120, 975, { lean: .1, head: .2, sh: [1.0, .4], el: [.9, .6], hip: [1.5, 1.5], kn: [1.5, 1.5], hair: 'bun' }, true],
    [1240, 975, { lean: -.1, head: -.3, sh: [1.3, 1.1], el: [.6, .9], hip: [1.5, 1.5], kn: [1.5, 1.5] }, true],
    [1340, 975, { lean: .05, head: .1, sh: [.6, .3], el: [1.0, .6], hip: [1.5, 1.5], kn: [1.5, 1.5], hair: 'long' }, true],
  ];
  for (const [x, y, p, f] of diners) figure(ctx, mix(960, x, 1.12), y + 5, .86, p, { rim, rimSide: f ? -1 : 1, col: dark, flip: f, rimW: 2 });
  // the long table in front of them, cloth hanging down, lanterns on top
  ctx.fillStyle = '#0a0a22'; ctx.fillRect(480, 1000, 960, 80);
  ctx.fillStyle = rgba(C.cream, .2); ctx.fillRect(480, 998, 960, 4);
  for (let i = 0; i < 10; i++) { const x = 520 + i * 98; ctx.fillStyle = rgba(C.amberHot, .9); ctx.fillRect(x - 5, 980, 10, 18); glow(ctx, x, 984, 80, .6, C.amber, C.amberHot); }
  glow(ctx, 970, 1000, 700, .22, C.amber, C.amberHot, { sy: .3 });
  // dancers on the left and right of the table
  figure(ctx, 250, 960, 1.15, { lean: -.12, head: -.3, sh: [2.7, 2.2], el: [.35, .5], hip: [.35, -.3], kn: [.2, .6], skirt: true, hair: 'long' }, { rim, rimSide: 1, col: dark, rimW: 2.4 });
  figure(ctx, 365, 962, 1.15, { lean: .1, head: .1, sh: [1.6, 2.4], el: [.6, .3], hip: [-.25, .35], kn: [.5, .1] }, { rim, rimSide: 1, col: dark, flip: true, rimW: 2.4 });
  figure(ctx, 1620, 960, 1.15, { lean: .15, head: -.2, sh: [2.9, 1.2], el: [.2, .9], hip: [.4, -.2], kn: [.3, .5], hair: 'curly' }, { rim, rimSide: -1, col: dark, rimW: 2.4 });
  figure(ctx, 1740, 1000, .7, { lean: 0, head: -.4, sh: [2.6, 2.8], el: [.2, .2], hip: [.3, -.3], kn: [.4, .2], hair: 'bun' }, { rim, rimSide: -1, col: dark, rimW: 1.4 });   // a child jumping
  finish(ctx, t, { grain: .05, vig: .55 });
  save(cv, out);
}
frame(0, process.argv[2] || 'k4.png');
