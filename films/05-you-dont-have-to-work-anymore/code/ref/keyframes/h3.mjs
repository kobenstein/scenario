// H3 · §5 apex: every terrace lit; the summit (Self-transcendence) lets go of its lights. They drift up slowly, cool from
// amber to star-white and join the sky. No burst, no column: a loose, wide drift, like seeds on warm air.
import { W, H, C, rgba, canvas, glow, finish, save, prng, mixHex, mix, figure } from './lib.mjs';
import { world } from './hworld.mjs';
import { hillLabels } from './hlabels.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas(); const lit = [1, 1, 1, 1, 1];
  const G = world(ctx, cv, t, lit, { night: true, apexY: 330, halfW: 480, hscale: .78, cx: 720 });
  const ax = G.cx, ay = G.apexY;
  glow(ctx, ax, ay + 40, 220, .22, C.amber, C.amberHot);
  const r = prng(77);
  // summit figures: a few people at the top, looking out
  for (const [dx, p, fl] of [[-22, { head: -.35, sh: [.3, -.2], el: [.2, .3], hair: 'long' }, false], [-6, { head: -.3, sh: [2.2, .1], el: [.2, .2] }, false], [18, { head: -.4, sh: [.2, .4], el: [.3, .2], hair: 'grey', skirt: true }, true]])
    figure(ctx, ax + dx, ay + 46, .13, { lean: -.05, hip: [.05, -.05], ...p }, { rim: C.amberHot, rimSide: -1, flip: fl, rimW: 1 });
  for (let i = 0; i < 300; i++) {
    const life = (r() + t * .03) % 1;                       // 0 = just left a window, 1 = among the stars
    const b = r() < .5 ? 4 : 3, y0 = mix(G.bands[b], G.bands[b + 1], .25 + r() * .6);
    const x0 = mix(G.edge(y0, -1), G.edge(y0, 1), .12 + r() * .76);
    const x = x0 + (x0 - ax) * 4.5 * life + Math.sin(life * 5 + i) * 26 * life + (r() - .5) * 700 * life * life;
    const y = y0 - life * (y0 + 30) * (.75 + r() * .25);
    if (y < -10 || y > y0 - 4) continue;
    const hex = mixHex(C.amberHot, C.cyanWhite, Math.min(1, life * 1.4));
    const a = (.3 + r() * .6) * (1 - life * .4), rad = mix(2.3, 1.1, life) * (.7 + r() * .5);
    ctx.fillStyle = rgba(hex, a); ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
  }
  hillLabels(ctx, G, lit, { x: 1440, titleY: 92 });
  finish(ctx, t, { grain: .05, vig: .55 });
  save(cv, out);
}
if (process.argv[1].endsWith('h3.mjs')) frame(0, process.argv[2] || 'h3.png');
