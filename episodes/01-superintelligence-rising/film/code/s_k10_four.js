// "None of that needs a miracle. Just those four answers, done together."
// The four question lanterns from earlier float up into the dawn. On "four answers" each one hardens into a solid
// warm stone with its answer on it (look inside, outside checks, law, cooperation). On "done together" the four
// stones swing into place as one arch over the rising sun and lock with a soft flash; a person walks toward it.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const K = require('./s_k10_kit');
const { gf, rr, camera, glowStroke, ring, dawnSky, lantern, check, caption, figure } = K;

const T0 = 636.0, T1 = 641.3;
const AC = [960, 790], RI = 250, RO = 350, RM = (RI + RO) / 2;
const T_SOLID = [638.25, 638.55, 638.85, 639.15];
const T_LOCK0 = 639.38, T_LOCK = 639.85;
const LBL = ['LOOK INSIDE', 'OUTSIDE CHECKS', 'LAW', 'COOPERATION'];
const FREE = [[380, 470], [760, 400], [1160, 400], [1540, 470]];

function blockPath(c) {
  const a0 = -Math.PI / 2 - Math.PI / 8, a1 = -Math.PI / 2 + Math.PI / 8, oy = RM;
  c.moveTo(Math.cos(a0) * RO, Math.sin(a0) * RO + oy); c.arc(0, oy, RO, a0, a1); c.lineTo(Math.cos(a1) * RI, Math.sin(a1) * RI + oy); c.arc(0, oy, RI, a1, a0, true); c.closePath();
}
function icon(ctx, i, s, a) {
  ctx.save(); ctx.globalAlpha *= a; ctx.scale(s, s);
  const col = 'rgba(90,40,14,0.85)';
  if (i === 0) { ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-6, -6, 24, 0, 7); ctx.stroke(); ctx.lineCap = 'round'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(12, 12); ctx.lineTo(30, 30); ctx.stroke();
    ctx.strokeStyle = '#0a6f8c'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(-6, -6, 9, 13, 0.3, 0, 7); ctx.stroke(); }
  if (i === 1) check(ctx, 0, 2, 56, 1, col, 9);
  if (i === 2) { ctx.fillStyle = col; ctx.font = '78px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('§', 0, 4); }
  if (i === 3) { ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-13, 0, 20, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(13, 0, 20, 0, 7); ctx.stroke(); }
  ctx.restore();
}
function stone(ctx, t, i, x, y, rot, s, glow) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.save(); ctx.translate(8, 10); gf(ctx, blockPath, 'rgba(40,18,30,0.3)', 0); ctx.restore();
  gf(ctx, blockPath, lin(ctx, -60, -RO + RM, 60, -RI + RM, [[0, '#ffd59a'], [0.5, '#e8a058'], [1, '#a2521f']]), 0.45);
  ctx.strokeStyle = 'rgba(255,236,200,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, RM, RO - 2, -Math.PI / 2 - Math.PI / 8 + 0.02, -Math.PI / 2 + Math.PI / 8 - 0.02); ctx.stroke();
  ctx.restore();
  // the icon stays upright
  ctx.save(); ctx.translate(x, y); icon(ctx, i, s * 1.05, 1); ctx.restore();
  if (glow > 0) light(ctx, x, y, 160 * s + 40, C.amber, 0.6 * glow);
}

function draw(ctx, t) {
  const layer = camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.08, cx: 960, cy: 600, seed: 21 });
  const lock = ramp(t, T_LOCK - 0.05, T_LOCK + 0.1), flash = Math.exp(-Math.max(0, t - T_LOCK) * 3) * (t > T_LOCK - 0.02 ? 1 : 0);
  const sunY = lerp(800, 700, sm((t - T0) / (T1 - T0)));
  layer(0.2, () => {
    dawnSky(ctx, t, -100, 800, 960, sunY, { glow: 0.42 + 0.15 * lock, sunR: 1100, seed: 41, clouds: 8 });
    ctx.fillStyle = rgba('#fff2cf', 0.95); ctx.beginPath(); ctx.arc(960, sunY, 60, 0, 7); ctx.fill();
    light(ctx, 960, sunY, 200, '#ffe0a8', 0.55 + 0.3 * lock);
  });
  layer(0.4, () => {
    gf(ctx, c => { c.moveTo(-200, 770); c.bezierCurveTo(300, 720, 600, 760, 900, 770); c.bezierCurveTo(1200, 780, 1500, 730, 2200, 760); c.lineTo(2200, 1300); c.lineTo(-200, 1300); c.closePath(); }, lin(ctx, 0, 740, 0, 900, [[0, '#8a5a86'], [1, '#5a4278']]), 0.45);
    gf(ctx, c => { c.moveTo(-200, 830); c.bezierCurveTo(400, 800, 800, 820, 960, 826); c.bezierCurveTo(1200, 832, 1600, 800, 2200, 830); c.lineTo(2200, 1300); c.lineTo(-200, 1300); c.closePath(); }, lin(ctx, 0, 800, 0, H, [[0, '#4e3a72'], [1, '#1e1a40']]), 0.5);
    // a path running to the arch
    gf(ctx, c => { c.moveTo(900, 828); c.lineTo(1020, 828); c.lineTo(1300, H + 50); c.lineTo(620, H + 50); c.closePath(); }, lin(ctx, 0, 828, 0, H, [[0, '#d89a8a'], [1, '#6a4a78']]), 0.4);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(960, 830); ctx.scale(4, 0.6); ctx.fillStyle = rad(ctx, 0, 0, 0, 200, [[0, rgba('#ffc890', 0.3 + 0.2 * lock)], [1, 'rgba(255,200,144,0)']]); ctx.fillRect(-200, -200, 400, 400); ctx.restore();
  });
  layer(0.7, () => {
    // pillar feet appear as the arch locks
    if (lock > 0) for (const sx of [-1, 1]) { ctx.save(); ctx.globalAlpha = lock;
      gf(ctx, c => c.rect(AC[0] + sx * RM - 52, AC[1] - 2, 104, 44), lin(ctx, 0, AC[1], 0, AC[1] + 44, [[0, '#c9702e'], [1, '#7a3b17']]), 0.45); ctx.restore(); }
    for (let i = 0; i < 4; i++) {
      const [fx, fy] = FREE[i], bob = Math.sin(t * 1.3 + i * 1.7) * 10;
      const rise = ease((t - 636.05 - i * 0.18) / 1.2);
      const lx = fx, ly = lerp(fy + 620, fy, rise) + bob;
      const solid = ramp(t, T_SOLID[i], T_SOLID[i] + 0.22), pop = Math.exp(-Math.max(0, t - T_SOLID[i]) * 4) * (t > T_SOLID[i] ? 1 : 0);
      const go = ease((t - (T_LOCK0 + i * 0.06)) / (T_LOCK - T_LOCK0 - i * 0.06));
      if (solid < 1) lantern(ctx, lx, ly, 62, t, 1 - solid, i);
      if (solid > 0) {
        const m = Math.PI + (i + 0.5) * Math.PI / 4;
        const px = AC[0] + Math.cos(m) * RM, py = AC[1] + Math.sin(m) * RM;
        const x = lerp(lx, px, go), y = lerp(ly, py, go) - Math.sin(go * Math.PI) * 60, rot = lerp(Math.sin(t * 0.9 + i) * 0.06, m + Math.PI / 2, go);
        const s = lerp(0.72, 1, go) * lerp(0.6, 1, out(solid));
        ctx.save(); ctx.globalAlpha = solid; stone(ctx, t, i, x, y, rot, s, pop * 0.8 + flash * 0.5); ctx.restore();
        caption(ctx, t, T_SOLID[i] + 0.05, T_LOCK0 + 0.25, LBL[i], lx, ly + 112, { align: 'center', font: '26px "Inter SemiBold"', color: '#fff0d8' });
      }
    }
    if (flash > 0.01) { light(ctx, AC[0], AC[1] - RM, 500, '#ffe0b0', 0.5 * flash); glowStroke(ctx, c => c.arc(AC[0], AC[1], RO + 20 + (1 - flash) * 160, Math.PI, 0), '#ffe0b0', 2, 0.6 * flash); }
  });
  // a person walks up the path toward the arch
  layer(1.0, () => {
    const k = clamp((t - 639.9) / 1.4), x = 960 + 40 * (1 - k), y = lerp(1060, 990, k), s = lerp(0.62, 0.5, k), ph = (t - 639.9) * 2 * Math.PI * 0.9, sw = Math.sin(ph) * (k > 0 ? 1 : 0);
    if (t > 639.6) { ctx.save(); ctx.globalAlpha = ramp(t, 639.6, 640.0);
      const leg = sg => ({ a1: Math.PI / 2 + sg * sw * 0.3, a2: Math.PI / 2 + sg * sw * 0.3 + Math.max(0, -sg * sw) * 0.5 });
      figure(ctx, { x, y: y - 150 * s, s, facing: 'back', br: Math.sin(t * 1.7), turn: 0.1 * Math.sin(t), tilt: -0.15, lx: 1, rim: '#ffe0b0', rimA: 0.7, rimDx: 0, rimDy: -2.5,
        pal: ['#ffb35c', '#c9702e', '#5a2a12'], legs: [leg(1), leg(-1)], arms: [{ a1: Math.PI / 2 + 0.15 - sw * 0.2, a2: Math.PI / 2 + 0.05 - sw * 0.2 }, { a1: Math.PI / 2 - 0.15 + sw * 0.2, a2: Math.PI / 2 - 0.05 + sw * 0.2 }] });
      ctx.restore(); }
  });
}

module.exports = { T0, T1, draw };
