// K6 · §8 "So how do we get from here to there?" Real dawn, the warmest frame of the film.
// Hill-towns across the whole horizon (every pyramid a place, a life): some lit, many still dark.
// From our feet a pier begins: a few planks laid, then only the posts, marching across the water to the sun. Unbuilt.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, figure, hillGeo, drawHill, save, prng, mix, clamp } from './lib.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas();
  const hz = 560, sx = W / 2;
  vgrad(ctx, [[0, '#2a2766'], [.4, '#6b4f8e'], [.72, '#e48e84'], [.86, '#ffbf86']], 0, 0, W, hz);
  stars(ctx, t, { n: 50, y1: 170, a: .3, seed: 2 });
  glow(ctx, sx, hz, 760, .5, C.dusk, C.amberHot);
  glow(ctx, sx, hz + 6, 150, .95, C.amber, '#fff3dc');
  // the hill-towns on the horizon: irregular, two depths; lit ones carry warm windows and a glow
  const r = prng(29);
  const towns = [[150, 70, 1, 0], [330, 40, 0, 1], [470, 95, .9, 1], [640, 52, 0, 0], [760, 34, 0, 1], [1190, 44, .8, 0], [1320, 88, 0, 1], [1500, 58, 0, 0], [1620, 36, .7, 1], [1790, 78, 0, 1]];
  for (const [x, h, lit, far] of towns) {
    const hw = h * (.95 + r() * .3), G = hillGeo(x, hz + 2, hw, hz + 2 - h);
    ctx.fillStyle = far ? '#a7739a' : '#7f5c91'; ctx.beginPath(); ctx.moveTo(G.edge(hz + 2, -1), hz + 2);
    for (let y = hz + 2; y >= hz + 2 - h; y -= 2) ctx.lineTo(G.edge(y, -1), y);
    for (let y = hz + 2 - h; y <= hz + 2; y += 2) ctx.lineTo(G.edge(y, 1), y); ctx.fill();
    // terraces as faint lines
    for (const yb of G.bands.slice(1, 5)) { ctx.fillStyle = rgba('#3b2f6e', .25); ctx.fillRect(G.xAt(yb, -1), yb, G.xAt(yb, 1) - G.xAt(yb, -1), 1.2); }
    if (lit) { const rr = prng(x); for (let i = 0; i < h * 1.6; i++) { const v = Math.pow(rr(), 1.6), y = hz - 3 - v * h * .75, xx = mix(G.xAt(y, -1) + 4, G.xAt(y, 1) - 4, rr()); ctx.fillStyle = rgba(rr() < .5 ? C.amber : '#ffe2b0', (.75 + .25 * rr()) * lit); ctx.fillRect(xx, y, 3, 3); }
      glow(ctx, x, hz - h * .25, h * 1.5, .28 * lit, C.amber, C.amberHot, { sy: .55 }); }
  }
  // water
  vgrad(ctx, [[0, '#d18f92'], [.35, '#7a5a92'], [1, '#1d1a4a']], 0, hz, W, H - hz);
  { const rr = prng(4); for (let i = 0; i < 420; i++) { const y = hz + Math.pow(rr(), 1.7) * (H - hz), sp = 40 + (y - hz) * .9, x = sx + (rr() - .5) * 2 * sp + Math.sin(t * .8 + i) * 4; const w = (4 + rr() * 26) * (.4 + (y - hz) / 300); ctx.fillStyle = rgba(rr() < .5 ? C.amberHot : '#fff1d8', (.25 + .6 * rr()) * (1 - Math.abs(x - sx) / sp)); ctx.fillRect(x - w / 2, y, w, 1.6); } }
  // reflections of the lit towns as warm vertical streaks
  for (const [x, h, lit] of towns) if (lit) for (let k = 0; k < 7; k++) { ctx.fillStyle = rgba(C.amberHot, .25 * lit * (1 - k / 7)); ctx.fillRect(x - h * .4 + k * h * .12, hz + 4 + k * 5, h * .07, 2); }
  // our Hill, near-left, fully lit
  const G = hillGeo(260, 700, 380, 240);
  drawHill(ctx, t, G, { lit: [1, .95, .9, .8, .6], body: '#3b2f6e', body2: '#231f55', rimHex: C.dusk, rimA: .6, seed: 51, scale: .6 });
  // its reflection, broken by the ripples
  { const rr = prng(6); for (let y = 702; y < 900; y += 3) { const u = (y - 702) / 200, w = (380 + 70) * (1 - u * .9); ctx.fillStyle = rgba('#231f55', .5 * (1 - u)); ctx.fillRect(260 - w + Math.sin(y * .2) * 6, y, w * 2, 2); if (rr() < .5) { ctx.fillStyle = rgba(C.amberHot, .35 * (1 - u)); ctx.fillRect(260 + (rr() - .5) * w * 1.6, y, 3 + rr() * 8, 1.5); } } }
  // the pier: planks laid at our feet, then posts only, converging on the sun
  const P = (u, side) => [sx + side * mix(150, 3, Math.pow(u, .5)), mix(H + 10, hz + 3, Math.pow(u, .45))];
  const built = .1;
  ctx.fillStyle = '#2b2053'; ctx.beginPath(); ctx.moveTo(...P(0, -1)); ctx.lineTo(...P(built, -1)); ctx.lineTo(...P(built, 1)); ctx.lineTo(...P(0, 1)); ctx.fill();
  for (let k = 0; k <= 10; k++) { const u = built * k / 10, a = P(u, -1), b = P(u, 1); ctx.strokeStyle = rgba('#0f0b2a', .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); }
  ctx.fillStyle = rgba(C.amberHot, .55); { const a = P(built, -1), b = P(built, 1); ctx.fillRect(a[0], a[1] - 1, b[0] - a[0], 2.5); }
  for (let k = 0; k < 26; k++) {
    const u = built + .02 + k * k * .0014 + k * .012; if (u > .96) break;
    for (const s of [-1, 1]) { const [x, y] = P(u, s), h = mix(46, 3, Math.pow(u, .5)), w = mix(9, 1, Math.pow(u, .5));
      ctx.fillStyle = '#1c1540'; ctx.fillRect(x - w / 2, y - h, w, h + 2); ctx.fillStyle = rgba(C.amberHot, .7); ctx.fillRect(x - w / 2, y - h, w, Math.max(1, w * .4));
      ctx.fillStyle = rgba('#1c1540', .35); ctx.fillRect(x - w / 2, y + 2, w, h * .6); }
  }
  // you, at the end of the laid planks, looking out along the posts
  const [fx, fy] = [sx - 10, P(built, 0)[1] - 2];
  figure(ctx, fx, fy - 88 * .62, .62, { lean: .01, head: -.1, sh: [.12, -.08], el: [.25, .2], hip: [.06, -.06], kn: [0, .04], coat: true, hair: 'curly' }, { rim: '#ffd8aa', rimSide: 1, col: '#0d0a26', rimW: 1.6 });
  finish(ctx, t, { grain: .05, vig: .5 });
  save(cv, out);
}
frame(0, process.argv[2] || 'k6.png');
