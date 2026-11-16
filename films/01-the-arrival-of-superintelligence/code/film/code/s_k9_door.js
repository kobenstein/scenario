// "That part, we can start on now. Whoever turns out to be right about the speed."
// The same place as s_k9_venn.js: the camera moves in on the little lab in the overlap. Its door swings open warm on
// "start", the four observers from both camps walk in, and their silhouettes appear inside among the machines.
// A warm light rises over everything: a calm, hopeful handover to the dawn of the next chunk.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, lin, rad, rgba, light, out, clamp, ease } = L;
const { world, LAB } = require('./s_k9_venn');

const T0 = 602.45, T1 = 609.3;

function draw(ctx, t) {
  const walkIn = ease((t - 604.35) / 2.6);
  const k = ease((t - T0) / 4.2), z = lerp(1.58, 2.35, k) + 0.05 * sm((t - 606.5) / 2.8);
  const fx = lerp(960, 1000, k), fy = lerp(700, 650, k);
  const dx = drift(t, 1, 61) * 5, dy = drift(t, 1, 62) * 3;
  ctx.save(); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-fx + dx, -fy + dy);
  world(ctx, t, walkIn);
  // inside: the observers appear among the machines, the window warms
  const wx = LAB.x - LAB.w / 2 + 24, wy = LAB.y - LAB.h + 40, ww = 170, wh = 120;
  const inside = ramp(walkIn, 0.45, 1);
  if (inside > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(wx + 3, wy + 3, ww - 6, wh - 6); ctx.clip();
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(C.amber, 0.22 * inside); ctx.fillRect(wx, wy, ww, wh); ctx.globalCompositeOperation = 'source-over';
    [[wx + 30, 0.0, '#3b2f6e'], [wx + 72, 0.15, '#5a2a12'], [wx + 112, 0.3, '#3b2f6e'], [wx + 146, 0.45, '#5a2a12']].forEach(([x, d, col], i) => {
      const a = ramp(inside, d, d + 0.4); if (a <= 0) return;
      const b = Math.sin(t * 1.6 + i) * 0.8, y = wy + wh + 4;
      ctx.globalAlpha = 0.8 * a; ctx.fillStyle = col; ctx.save(); ctx.translate(x, y); ctx.scale(0.72, 0.72); ctx.translate(-x, -y);
      ctx.beginPath(); ctx.moveTo(x - 15, y); ctx.quadraticCurveTo(x - 16, y - 40 + b, x - 4, y - 44 + b); ctx.lineTo(x + 4, y - 44 + b); ctx.quadraticCurveTo(x + 16, y - 40 + b, x + 15, y); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + Math.sin(t * 0.7 + i) * 1.5, y - 54 + b, 8, 9.5, 0, 0, 7); ctx.fill(); ctx.restore();
    });
    ctx.restore();
  }
  ctx.restore();
  // a warm light rises over the whole frame: calm, hopeful
  const warm = ramp(t, 605.2, 609.2);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, rgba('#ffb35c', 0.10 * warm)], [0.5, rgba('#ff9a5c', 0.04 * warm)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  light(ctx, 1040, 420, 900, '#ffd9a0', 0.18 * warm);
}

module.exports = { T0, T1, draw };
