// V2-1 · Maslow, the bottom lit (§2 "Nobody on your street is one bad month from losing their home.")
// The labelled pyramid as a clean explainer graphic; only "Physiological · Safety" is lit, every window cell on.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, save } from './lib.mjs';
import { pyrGeo, drawPyramid } from './pyr.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas();
  vgrad(ctx, [[0, '#070918'], [.7, '#11143c'], [1, '#191a4a']]);
  stars(ctx, t, { n: 120, y1: 500, a: .25, seed: 7 });
  // floor line + reflection space
  const P = pyrGeo(800, 880, 1040, 690);
  glow(ctx, P.cx, 860, 760, .28, C.amber, C.amberHot, { sy: .35 });
  drawPyramid(ctx, t, P, { lit: [1, 0, 0, 0, 0], labelX: 1430, title: true });
  ctx.fillStyle = rgba(C.amberHot, .35); ctx.fillRect(P.cx - 620, 881, 1240, 1.5);
  // reflection of the lit level on a glossy floor
  ctx.save(); ctx.globalAlpha = .14; ctx.translate(0, 2 * 881); ctx.scale(1, -1); ctx.beginPath(); ctx.rect(0, 881 - 120, W, 120); ctx.clip(); drawPyramid(ctx, t, P, { lit: [1, 0, 0, 0, 0], labels: false }); ctx.restore();
  { const g = ctx.createLinearGradient(0, 882, 0, 1000); g.addColorStop(0, 'rgba(17,20,60,0)'); g.addColorStop(1, 'rgba(22,24,70,1)'); ctx.fillStyle = g; ctx.fillRect(0, 882, W, 200); }
  finish(ctx, t, { grain: .05, vig: .55 });
  save(cv, out);
}
frame(0, process.argv[2] || 'v1.png');
