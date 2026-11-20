// K3 · §3 the slump: "One more episode. Then another… A glass of wine at four in the afternoon." Then the hint of the turn:
// a thin amber seam of morning at the curtain edge (the hangover, not a destiny).
import { W, H, C, rgba, canvas, vgrad, glow, finish, figure, handPos, save, prng, mix, speckle, beam } from './lib.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas();
  vgrad(ctx, [[0, '#080a22'], [1, '#0c0e2c']]);
  // TV light from off-frame left: cyan wash across wall and floor, flickering
  const fl = .85 + .15 * Math.sin(t * 7) * Math.sin(t * 2.3);
  beam(ctx, [[0, 180], [0, 980], [1500, 1080], [1500, 120]], C.cyan, .16 * fl, { from: [0, 500], to: [1400, 600] });
  glow(ctx, -60, 560, 900, .5 * fl, C.cyanDeep, C.cyan);
  // floor
  vgrad(ctx, [[0, '#0a0c26'], [1, '#05061a']], 0, 830, W, 250);
  beam(ctx, [[0, 830], [1300, 830], [1600, H], [0, H]], C.cyan, .08 * fl, { from: [0, 900], to: [1300, 900] });
  // curtains on the right, closed; a thin seam of amber morning between them
  const cx0 = 1500;
  ctx.fillStyle = '#121440'; ctx.fillRect(cx0, 0, W - cx0, 860);
  for (let i = 0; i < 9; i++) { const x = cx0 + i * 48 + Math.sin(t * .4 + i) * 3; const g = ctx.createLinearGradient(x, 0, x + 48, 0); g.addColorStop(0, 'rgba(5,6,26,.45)'); g.addColorStop(.5, 'rgba(60,70,140,.10)'); g.addColorStop(1, 'rgba(5,6,26,.35)'); ctx.fillStyle = g; ctx.fillRect(x, 0, 48, 860); }
  const seam = 1712 + Math.sin(t * .6) * 2;
  ctx.fillStyle = rgba(C.amberHot, .95); ctx.fillRect(seam, 40, 5, 790);
  glow(ctx, seam + 2, 420, 260, .35, C.amber, C.amberHot, { sy: 2.2 });
  // the seam throws a thin line of light across the floor toward the sofa (anticipation of the turn)
  beam(ctx, [[seam - 2, 860], [seam + 8, 860], [900, H], [760, H]], C.amber, .32, { from: [seam, 860], to: [800, H] });
  // sofa (side-on), deep and low
  const sx = 360, sy = 820;
  ctx.fillStyle = '#14163f'; ctx.beginPath(); ctx.roundRect(sx, sy - 150, 760, 150, 24); ctx.fill(); ctx.fillStyle = rgba(C.cyan, .14); ctx.fillRect(sx + 20, sy - 150, 700, 4);          // seat + base
  ctx.fillStyle = '#171a4c'; ctx.beginPath(); ctx.roundRect(sx - 20, sy - 330, 90, 330, 30); ctx.fill();       // back (left)
  ctx.fillStyle = '#191c50'; ctx.beginPath(); ctx.roundRect(sx + 700, sy - 250, 110, 250, 40); ctx.fill();     // arm (right)
  ctx.fillStyle = rgba(C.cyan, .18 * fl); ctx.fillRect(sx - 20, sy - 330, 8, 300);
  // cushion
  ctx.fillStyle = '#1f2360'; ctx.beginPath(); ctx.ellipse(sx + 680, sy - 236, 74, 46, -.6, 0, 7); ctx.fill();
  // the figure: sunk deep, head on the armrest cushion, one hand holding the phone above, other arm slack along the body
  const pose = { lean: -1.2, head: -.15, sh: [2.75, .5], el: [-1.1, .45], hip: [2.1, 1.95], kn: [1.6, 1.3], bulk: 1.2, hair: 'long' };
  const fx = 900, fy = sy - 185, s = 2.2;
  figure(ctx, fx, fy, s, pose, { rim: '#9eeaff', rimSide: -1, col: '#0d0b26', rimW: 3, flip: true });
  const [px, py] = handPos(fx, fy, s, pose, 0, true);
  ctx.save(); ctx.translate(px, py); ctx.rotate(.4); ctx.fillStyle = '#05061a'; ctx.fillRect(-8, -16, 16, 30); ctx.fillStyle = rgba(C.cyanWhite, .85); ctx.fillRect(-6, -14, 12, 26); ctx.restore();
  glow(ctx, px, py + 10, 160, .4, C.cyan, C.cyanWhite);
  // side table + two wine glasses (one empty, one half full)
  const tx = 230, ty = 760;
  ctx.fillStyle = '#0e1036'; ctx.fillRect(tx - 70, ty, 140, 12); ctx.fillRect(tx - 6, ty + 12, 12, 60); ctx.fillRect(tx - 40, ty + 68, 80, 8);
  const glass = (x, fill) => {
    ctx.strokeStyle = rgba(C.cyanWhite, .55); ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(x - 20, ty - 92); ctx.quadraticCurveTo(x - 22, ty - 50, x, ty - 46); ctx.quadraticCurveTo(x + 22, ty - 50, x + 20, ty - 92); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, ty - 46); ctx.lineTo(x, ty - 4); ctx.moveTo(x - 14, ty - 2); ctx.lineTo(x + 14, ty - 2); ctx.stroke();
    if (fill) { ctx.fillStyle = rgba('#7a1f3a', .9); ctx.beginPath(); ctx.moveTo(x - 20.5, ty - 70); ctx.quadraticCurveTo(x - 20, ty - 50, x, ty - 47); ctx.quadraticCurveTo(x + 20, ty - 50, x + 20.5, ty - 70); ctx.fill(); ctx.fillStyle = rgba(C.cyanWhite, .5); ctx.fillRect(x - 18, ty - 71, 36, 1.5); }
  };
  glass(tx - 28, false); glass(tx + 30, true);
  // TV flicker dust in the air
  speckle(ctx, 0, 200, 900, 700, 1600, C.cyanWhite, .12, 4);
  finish(ctx, t, { grain: .05, vig: .65 });
  save(cv, out);
}
frame(0, process.argv[2] || 'k3.png');
