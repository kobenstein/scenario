// H6 · scenic people shot (§6): a Tuesday afternoon on a lake. An adult child rows; the old father sits in the stern and
// points at a heron lifting off the reeds. Oars dip, rings spread, light sits low and warm. Nothing to do but this.
import { W, H, C, rgba, canvas, vgrad, glow, finish, figure, handPos, save, prng, mix, speckle } from './lib.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas();
  const hz = 560;
  vgrad(ctx, [[0, '#4a3f86'], [.45, '#9a7fb0'], [.8, '#eab38c'], [1, '#f6cf9c']], 0, 0, W, hz);
  glow(ctx, 470, hz - 120, 520, .55, C.amber, '#fff1d6');
  glow(ctx, 470, hz - 120, 60, .9, C.amberHot, '#fff8ea');
  // far shore: soft tree line, two depths
  const r = prng(8);
  const shore = (y, amp, col, seed) => { const q = prng(seed); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, hz + 2); ctx.lineTo(0, y); for (let x = 0; x <= W + 40; ) { const w = 18 + q() * 34, h = amp * (.35 + q() * .65) * (.6 + .4 * Math.sin(x * .004 + seed)); ctx.quadraticCurveTo(x + w / 2, y - h * 2, x + w, y - q() * 6); x += w; } ctx.lineTo(W, hz + 2); ctx.fill(); };
  shore(hz - 26, 22, '#b08aa6', 3); shore(hz - 6, 16, '#7a5e93', 7);
  // water
  vgrad(ctx, [[0, '#d8a693'], [.25, '#8e74a8'], [1, '#26245a']], 0, hz, W, H - hz);
  for (let i = 0; i < 520; i++) { const y = hz + Math.pow(r(), 1.5) * (H - hz), d = (y - hz) / (H - hz), x = r() * W + Math.sin(t + i) * 3; const near = Math.max(0, 1 - Math.abs(x - 470) / (260 + d * 500)); ctx.fillStyle = rgba(near > .1 ? '#fff0d4' : '#c9b6e0', (.12 + .55 * near) * (.4 + r() * .6)); ctx.fillRect(x, y, 6 + d * 40 * r(), 1.4 + d * 1.5); }
  // reeds on the right
  for (let i = 0; i < 70; i++) { const x = 1560 + r() * 380, h = 60 + r() * 140, sw = Math.sin(t * .9 + i) * 6; ctx.strokeStyle = rgba('#2a2048', .9); ctx.lineWidth = 2 + r() * 2; ctx.beginPath(); ctx.moveTo(x, 760 + r() * 30); ctx.quadraticCurveTo(x + sw * .3, 760 - h * .5, x + sw, 760 - h); ctx.stroke(); }
  // heron lifting off, upper right
  { ctx.save(); ctx.translate(1440, 330); ctx.rotate(-.12); ctx.fillStyle = '#2a2048';
    ctx.beginPath(); ctx.ellipse(0, 0, 34, 9, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(30, -3); ctx.quadraticCurveTo(46, -16, 56, -10); ctx.lineTo(74, -8); ctx.lineTo(56, -6); ctx.quadraticCurveTo(44, -6, 32, 4); ctx.fill();
    const fl = Math.sin(t * 3) * .4; ctx.beginPath(); ctx.moveTo(-14, -2); ctx.quadraticCurveTo(-30, -60 - fl * 30, 10, -78 - fl * 40); ctx.quadraticCurveTo(0, -36, 14, -2); ctx.fill();
    ctx.strokeStyle = '#2a2048'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-30, 2); ctx.lineTo(-70, 10); ctx.stroke(); ctx.restore(); }
  // the boat
  ctx.save(); ctx.translate(820, 800); ctx.scale(1.5, 1.5); ctx.translate(-820, -800);
  const bx = 820, wy = 800, rim = '#ffdcae', col = '#1b1438';
  const rP = { lean: -.2, head: .1, sh: [.55, .4], el: [1.25, 1.3], hip: [1.5, 1.5], kn: [1.4, 1.4], hair: 'long' };
  const fP = { lean: .02, head: -.3, sh: [2.2, .75], el: [.05, .95], hip: [1.5, 1.5], kn: [1.4, 1.4], hair: 'grey', bulk: 1.12, coat: true };
  const rx = bx + 70, ry = wy - 44, fx = bx - 200, fy = wy - 42;
  // far oar (behind the boat)
  const [h2x, h2y] = handPos(rx, ry, 1.05, rP, 1, true);
  ctx.strokeStyle = '#3a2a40'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(h2x, h2y); ctx.lineTo(rx + 250, wy + 6); ctx.stroke();
  figure(ctx, fx, fy, 1.0, fP, { rim, rimSide: -1, col, rimW: 2.4 });
  figure(ctx, rx, ry, 1.05, rP, { rim, rimSide: -1, col, rimW: 2.4, flip: true });
  // hull in front
  ctx.fillStyle = '#2b2048'; ctx.beginPath(); ctx.moveTo(bx - 330, wy - 46); ctx.lineTo(bx + 300, wy - 44); ctx.quadraticCurveTo(bx + 370, wy - 52, bx + 395, wy - 68);
  ctx.quadraticCurveTo(bx + 340, wy + 8, bx + 230, wy + 12); ctx.lineTo(bx - 280, wy + 12); ctx.quadraticCurveTo(bx - 330, wy + 4, bx - 330, wy - 46); ctx.fill();
  ctx.fillStyle = rgba(rim, .8); ctx.fillRect(bx - 330, wy - 48, 630, 2.5);
  ctx.fillStyle = 'rgba(255,220,180,.08)'; ctx.fillRect(bx - 320, wy - 24, 600, 6);
  // near oar: from the hands through the oarlock to the blade in the water, rings around it
  const [h1x, h1y] = handPos(rx, ry, 1.05, rP, 0, true);
  const ex = rx + 250, ey = wy + 22;
  ctx.strokeStyle = '#3d2c48'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(h1x, h1y); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.fillStyle = '#3d2c48'; ctx.save(); ctx.translate(ex, ey); ctx.rotate(Math.atan2(ey - h1y, ex - h1x)); ctx.beginPath(); ctx.ellipse(18, 0, 30, 9, 0, 0, 7); ctx.fill(); ctx.restore();
  for (let k = 0; k < 3; k++) { const u = (t * .4 + k / 3) % 1; ctx.strokeStyle = rgba('#fff0d4', .45 * (1 - u)); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(ex + 10, wy + 22, 20 + u * 120, 4 + u * 14, 0, 0, 7); ctx.stroke(); }
  // reflection of the boat + wake
  ctx.save(); ctx.globalAlpha = .35; for (let y = 0; y < 90; y += 3) { ctx.fillStyle = rgba('#1b1438', .9 * (1 - y / 90)); ctx.fillRect(bx - 310 + Math.sin(y * .3 + t) * 8, wy + 14 + y, 680 - y * 2, 2); } ctx.restore();
  for (let k = 0; k < 6; k++) { ctx.strokeStyle = rgba('#fff0d4', .25 - k * .035); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx - 340 - k * 40, wy + 14 + k * 4); ctx.lineTo(bx - 420 - k * 60, wy + 10 + k * 9); ctx.stroke(); }
  ctx.restore();
  speckle(ctx, 0, hz - 300, W, 500, 2500, C.amberHot, .12, 6);
  finish(ctx, t, { grain: .05, vig: .5 });
  save(cv, out);
}
if (process.argv[1].endsWith('h6.mjs')) frame(0, process.argv[2] || 'h6.png');
