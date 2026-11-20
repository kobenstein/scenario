// K2 · §2 "Nobody on your street… You don't have to. Not anymore." The base of the Hill lights for every house at once.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, figure, hillGeo, drawHill, reflect, sea, save, prng, speckle, text } from './lib.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas();
  // dusk sky: violet top -> rose -> amber band at the horizon (honeymoon warmth)
  vgrad(ctx, [[0, '#1a1850'], [.38, '#4a3a7e'], [.62, '#c97f86'], [.73, '#f0a77a']], 0, 0, W, 760);
  stars(ctx, t, { n: 70, y1: 260, a: .35, seed: 4 });
  // low sun glow behind the hill (hero light sits behind the summit)
  glow(ctx, W / 2, 720, 620, .55, C.dusk, C.amberHot);
  // far hills left/right (other towns, unlit), atmospheric
  const far = (pts, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 760); for (const p of pts) ctx.lineTo(...p); ctx.lineTo(W, 760); ctx.closePath(); ctx.fill(); };
  far([[0, 650], [180, 600], [340, 640], [520, 610], [700, 680], [1220, 690], [1400, 620], [1560, 655], [1760, 590], [1920, 640]], '#8a6488');
  far([[0, 700], [240, 670], [420, 700], [1500, 705], [1700, 672], [1920, 690]], '#5e4677');
  // the Hill
  const G = hillGeo(W / 2, 760, 640, 150);
  const [hc, hx] = canvas();
  drawHill(hx, t, G, { lit: [1, 0, 0, 0, 0], body: '#2a2560', body2: '#16173f', rimHex: C.rose, rimA: .6, seed: 12 });
  // summit marker: a single small tree, dark
  hx.fillStyle = '#16173f'; hx.beginPath(); hx.moveTo(W / 2, 150); hx.lineTo(W / 2 + 2, 128); hx.lineTo(W / 2 + 4, 150); hx.fill();
  ctx.drawImage(hc, 0, 0);
  // base street: warm wash spilling from the doors onto the quay
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const sg = ctx.createLinearGradient(0, 640, 0, 780); sg.addColorStop(0, rgba(C.amber, 0)); sg.addColorStop(.7, rgba(C.amber, .2)); sg.addColorStop(1, rgba(C.amber, .05));
  ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(G.xAt(640, -1), 640); ctx.lineTo(G.xAt(640, 1), 640); ctx.lineTo(G.xAt(760, 1) + 40, 780); ctx.lineTo(G.xAt(760, -1) - 40, 780); ctx.fill(); ctx.restore();
  // quay
  ctx.fillStyle = '#0d0e2c'; ctx.fillRect(0, 760, W, 26);
  ctx.fillStyle = rgba(C.amber, .35); ctx.fillRect(G.xAt(760, -1) - 30, 760, (G.xAt(760, 1) - G.xAt(760, -1)) + 60, 2);
  // sea + reflection of the hill
  sea(ctx, t, 786, { top: '#2a2a62', bottom: '#0b0c2a', glint: C.amberHot, glintA: .35, gw: 620 });
  reflect(ctx, cv, 786, { a: .3, t, h: 240 });
  // lamp posts along the quay, warm pools
  for (let i = 0; i < 9; i++) { const x = 520 + i * 110; ctx.fillStyle = '#0d0e2c'; ctx.fillRect(x - 1.5, 700, 3, 60); glow(ctx, x, 700, 70, .5, C.amber, C.amberHot); glow(ctx, x, 770, 90, .25, C.amber, C.amberHot, { sy: .25 }); }
  // people on the quay: parent + child walking (no hurry), someone sitting with feet over the edge, a couple
  const rim = C.amberHot;
  figure(ctx, 640, 728, .36, { lean: .02, head: .05, sh: [.25, -.25], el: [.2, .2], hip: [.25, -.25], kn: [.1, .3], coat: true }, { rim, rimSide: 1 });
  figure(ctx, 668, 742, .22, { lean: .02, head: -.2, sh: [-.6, -.2], el: [-.3, .1], hip: [-.25, .3], kn: [.3, .05], hair: 'bun' }, { rim, rimSide: 1 });
  // sitting figure, legs over quay edge
  figure(ctx, 1290, 752, .34, { lean: -.05, head: .25, sh: [.5, .4], el: [.6, .6], hip: [1.45, 1.35], kn: [1.5, 1.35], hair: 'long' }, { rim, rimSide: -1 });
  // two friends standing, one arm raised pointing at the lights
  figure(ctx, 1060, 728, .35, { lean: 0, head: -.25, sh: [2.4, -.1], el: [.25, .2], hip: [.06, -.06], kn: [0, 0] }, { rim, rimSide: -1 });
  figure(ctx, 1092, 730, .34, { lean: -.03, head: -.2, sh: [.2, .1], el: [.3, .25], hip: [.08, -.04], kn: [0, .05], hair: 'curly', skirt: true }, { rim, rimSide: -1, flip: true });
  finish(ctx, t, { grain: .05, vig: .55 });
  save(cv, out);
}
frame(0, process.argv[2] || 'k2.png');
