// "In September, at Washington's request, Britain's AI Security Institute lost access to new models for seventeen days."
// A team of auditors stands at a glass wall; behind it, new models glow on their plinths. A letter arrives from the
// left, a signal lamp blinks, and a steel shutter rolls across the glass in front of them. Seventeen days are struck
// off on the closed shutter, one by one. At the very end it lifts a hand's breadth and light comes back under it.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, out, clamp, ease } = L;
const { gf, cached, rr, figure } = K;

const T0 = 445.50, T1 = 454.75;
const GX0 = 180, GX1 = 1740, GY0 = 170, GY1 = 830, FLOOR = 940;
const LETTER = [447.0, 448.5], SHUT = [449.85, 450.85], DAYS = [451.6, 453.5];
const ORBS = [[520, 520, 90], [960, 500, 120], [1400, 520, 90]];

function roomArt(c) {
  gf(c, cc => cc.rect(-200, -200, 2320, 1500), lin(c, 0, 0, 0, 1100, [[0, '#0b0a24'], [0.75, '#1a1640'], [1, '#100e2a']]), 0.55);
  // behind the glass: the model room
  gf(c, cc => cc.rect(GX0, GY0, GX1 - GX0, GY1 - GY0), lin(c, 0, GY0, 0, GY1, [[0, '#082a40'], [1, '#0c4560']]), 0.4);
  for (const [x, y, r] of ORBS) {
    gf(c, cc => { cc.moveTo(x - r * 0.8, y + r + 10); cc.lineTo(x + r * 0.8, y + r + 10); cc.lineTo(x + r, GY1); cc.lineTo(x - r, GY1); cc.closePath(); }, lin(c, 0, y + r, 0, GY1, [[0, '#14506a'], [1, '#08283c']]), 0.4);
  }
  // floor in front
  gf(c, cc => cc.rect(-200, GY1, 2320, 600), lin(c, 0, GY1, 0, 1180, [[0, '#2a2458'], [1, '#0a0a1c']]), 0.5);
  // frame and mullions
  c.strokeStyle = '#08081a'; c.lineWidth = 22; c.strokeRect(GX0, GY0, GX1 - GX0, GY1 - GY0);
  c.lineWidth = 10; for (const x of [700, 1220]) { c.beginPath(); c.moveTo(x, GY0); c.lineTo(x, GY1); c.stroke(); }
  // shutter housing at the top right
  gf(c, cc => rr(cc, GX1 - 10, GY0 - 40, 140, GY1 - GY0 + 60, 8), lin(c, GX1, 0, GX1 + 140, 0, [[0, '#2c2660'], [1, '#141030']]), 0.5);
}

function stand(ctx, t, x, k, look, slump) {
  const b = Math.sin(t * 1.5 + k * 1.3), s = [1.1, 1.18, 1.04, 1.14][k], y = FLOOR - 168 * s, yy = y + b * 1.2;
  const pal = [['#f0a25a', '#b8622a', '#4a1e0c'], ['#e8964e', '#a85424', '#401a0a'], ['#ffc27c', '#cf7a36', '#5a2a12'], ['#d9843e', '#8a451c', '#3a160a']][k];
  // everyone holds themselves differently: hands behind the back, a hand in a pocket, a laptop under the arm, arms loose
  const arms = [
    [{ tx: x + 8 * s, ty: yy - 6 * s, bend: -1 }, { tx: x - 4 * s, ty: yy - 2 * s, bend: 1 }],
    [{ a1: Math.PI / 2 + 0.16, a2: Math.PI / 2 + 0.05 }, { tx: x + 36 * s, ty: yy + 2 * s, bend: -1 }],
    [{ tx: x - 30 * s, ty: yy - 40 * s, bend: 1 }, { a1: Math.PI / 2 - 0.14 + slump * 0.1, a2: Math.PI / 2 - 0.04 }],
    [{ a1: Math.PI / 2 + 0.2 - slump * 0.1, a2: Math.PI / 2 + 0.08 }, { a1: Math.PI / 2 - 0.2 + slump * 0.1, a2: Math.PI / 2 - 0.08 }],
  ][k];
  if (k === 0) arms.forEach(a => a.behind = false);
  const o = { x, y: yy, s, w: [1.0, 1.12, 0.92, 1.0][k], facing: 'back', br: b, lean: 0.02 * Math.sin(t * 0.5 + k) + slump * 0.05, turn: look, tilt: 0.05 + slump * 0.3, lx: x < 960 ? 1 : -1, grain: 0.32, pal,
    legs: [{ a1: Math.PI / 2 + 0.07, a2: Math.PI / 2 + 0.02, behind: true }, { a1: Math.PI / 2 - 0.07 + (k === 1 ? -0.05 : 0), a2: Math.PI / 2 - 0.02, behind: true }],
    arms, rim: C.cyan, rimA: 0.35, rimDx: 0, rimDy: -3, hair0: ['#4a2210', '#2a120a', '#6a3418', '#3a1a0c'][k] };
  const r = figure(ctx, o);
  // coat skirt over the thighs
  const hw = 31 * s * o.w;
  gf(ctx, c => { c.moveTo(x - hw * 1.02, yy - 6 * s); c.lineTo(x + hw * 1.02, yy - 6 * s); c.lineTo(x + hw * 1.25, yy + 58 * s); c.quadraticCurveTo(x, yy + 64 * s, x - hw * 1.25, yy + 58 * s); c.closePath(); },
    lin(ctx, x - hw, 0, x + hw, 0, [[0, pal[1]], [1, pal[2]]]), 0.35, [x - 60 * s, yy - 20 * s, 120 * s, 90 * s]);
  ctx.strokeStyle = rgba('#2a1006', 0.5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, yy - 4 * s); ctx.lineTo(x, yy + 60 * s); ctx.stroke();
  if (k === 3) gf(ctx, c => { const [hx, hy] = r.head; c.moveTo(hx - 22 * s, hy - 6 * s); c.quadraticCurveTo(hx - 28 * s, hy + 40 * s, hx - 18 * s, hy + 52 * s); c.lineTo(hx + 18 * s, hy + 52 * s); c.quadraticCurveTo(hx + 28 * s, hy + 40 * s, hx + 22 * s, hy - 6 * s); c.closePath(); }, '#3a1a0c', 0.4, [x - 50 * s, yy - 260 * s, 100 * s, 120 * s]);
  if (k === 2) { const hd = r.hands[0]; gf(ctx, c => { c.save(); c.translate(hd[0] + 6 * s, hd[1] - 4 * s); c.rotate(-0.15); c.rect(-30 * s, -8 * s, 54 * s, 9 * s); c.restore(); }, '#1a1438', 0, null); }
  if (k === 1) { gf(ctx, c => { c.moveTo(x - 46 * s, yy - 150 * s); c.lineTo(x - 30 * s, yy - 150 * s); c.lineTo(x + 34 * s, yy - 20 * s); c.lineTo(x + 20 * s, yy - 14 * s); c.closePath(); }, '#3a1608', 0, null);
    gf(ctx, c => rr(c, x + 14 * s, yy - 40 * s, 40 * s, 52 * s, 6 * s), lin(ctx, 0, yy - 40 * s, 0, yy + 12 * s, [[0, '#7a3b17'], [1, '#3a1608']]), 0.4, [x, yy - 50 * s, 70 * s, 70 * s]); }
}

function draw(ctx, t) {
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.08, cx: 960, cy: 520, seed: 61 });
  const shut = ease(clamp((t - SHUT[0]) / (SHUT[1] - SHUT[0]))), bump = t > SHUT[1] ? Math.sin((t - SHUT[1]) * 30) * Math.exp(-(t - SHUT[1]) * 8) * 8 : 0;
  const lift = ease(clamp((t - 453.95) / 0.7));
  const pulse = 0.9 + 0.1 * Math.sin(t * 2.3);
  layer(1, () => {
    cached(ctx, 'k7aroom', -200, -200, 2120, 1300, roomArt);
    // the new models behind the glass
    for (const [x, y, r] of ORBS) {
      gf(ctx, c => c.arc(x, y, r, 0, 7), rad(ctx, x - r * 0.3, y - r * 0.4, 6, r * 1.2, [[0, '#d8f7ff'], [0.4, '#5cc8e8'], [1, '#063a52']]), 0.3, [x - r - 10, y - r - 10, 2 * r + 20, 2 * r + 20]);
      ctx.strokeStyle = rgba(C.cyanW, 0.25); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, r * 0.8, r * 0.16, t * 0.3 + x, 0, 7); ctx.stroke();
      light(ctx, x, y, r * 2.4, C.cyan, 0.22 * pulse * (1 - 0.8 * shut));
    }
    ctx.fillStyle = 'rgba(216,247,255,0.05)'; for (const sx of [400, 980, 1450]) { ctx.beginPath(); ctx.moveTo(sx, GY0); ctx.lineTo(sx + 80, GY0); ctx.lineTo(sx - 60, GY1); ctx.lineTo(sx - 140, GY1); ctx.closePath(); ctx.fill(); }
    // the shutter rolls in from the right
    const sx = lerp(GX1, GX0, shut) + bump;
    if (shut > 0) {
      const sy1 = GY1 - lift * 34;
      gf(ctx, c => c.rect(sx, GY0, GX1 - sx, sy1 - GY0), lin(ctx, 0, GY0, 0, GY1, [[0, '#3a3270'], [1, '#221c4c']]), 0.45, [GX0 - 20, GY0, GX1 - GX0 + 40, GY1 - GY0]);
      ctx.strokeStyle = 'rgba(8,8,26,0.45)'; ctx.lineWidth = 3;
      for (let x = sx + 40; x < GX1; x += 46) { ctx.beginPath(); ctx.moveTo(x, GY0); ctx.lineTo(x, sy1); ctx.stroke(); }
      ctx.fillStyle = '#4a4090'; ctx.fillRect(sx - 8, GY0, 16, sy1 - GY0);
      if (lift > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, sy1, 0, sy1 + 120, [[0, rgba(C.cyan, 0.5 * lift)], [1, rgba(C.cyan, 0)]]); ctx.fillRect(GX0, sy1, GX1 - GX0, 120); ctx.restore(); }
      // seventeen days, struck off one by one
      const da = ramp(t, DAYS[0] - 0.5, DAYS[0]);
      if (da > 0) {
        ctx.save(); ctx.globalAlpha = da;
        for (let i = 0; i < 17; i++) {
          const row = i < 9 ? 0 : 1, col = row ? i - 9 : i, cx = 960 - (row ? 8 : 9) * 39 + col * 78 + 39, cy = 380 + row * 96;
          ctx.fillStyle = 'rgba(243,239,226,0.10)'; ctx.fillRect(cx - 32, cy - 36, 64, 72);
          ctx.strokeStyle = rgba(C.cream, 0.45); ctx.lineWidth = 2; ctx.strokeRect(cx - 32, cy - 36, 64, 72);
          ctx.fillStyle = rgba(C.cream, 0.55); ctx.font = '22px "Inter Medium"'; ctx.textAlign = 'center'; ctx.fillText(String(i + 1), cx, cy - 8);
          const k = clamp((t - (DAYS[0] + i * (DAYS[1] - DAYS[0]) / 17)) / 0.12);
          if (k > 0) { ctx.strokeStyle = '#ffb35c'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - 22, cy - 26); ctx.lineTo(cx - 22 + 44 * k, cy - 26 + 52 * k); ctx.stroke(); }
        }
        ctx.restore();
      }
    }
    // signal lamp on the housing: blinks when the letter lands
    const sig = t > LETTER[1] ? (Math.sin((t - LETTER[1]) * 12) > 0 ? 1 : 0.3) * (1 - ramp(t, SHUT[1], SHUT[1] + 0.5)) : 0.15;
    ctx.fillStyle = sig > 0.5 ? '#ffd28c' : '#6a3a1a'; ctx.beginPath(); ctx.arc(GX1 + 60, GY0 - 6, 12, 0, 7); ctx.fill();
    light(ctx, GX1 + 60, GY0 - 6, 90, '#ffb35c', 0.6 * sig);
    // the letter from Washington flies in on an arc
    const lk = clamp((t - LETTER[0]) / (LETTER[1] - LETTER[0]));
    if (lk > 0 && lk < 1) {
      const u = ease(lk), x = lerp(-80, GX1 + 60, u), y = lerp(470, GY0 - 6, u) - Math.sin(u * Math.PI) * 220;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 5) * 0.2 + (1 - u) * 0.3); ctx.scale(1.5 - 0.8 * u, 1.5 - 0.8 * u);
      gf(ctx, c => c.rect(-40, -26, 80, 52), '#f3efe2', 0.2, [-45, -30, 90, 60]);
      ctx.strokeStyle = 'rgba(74,58,112,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-40, -26); ctx.lineTo(0, 4); ctx.lineTo(40, -26); ctx.stroke();
      ctx.fillStyle = '#c9702e'; ctx.beginPath(); ctx.arc(0, 4, 7, 0, 7); ctx.fill();
      ctx.restore();
      light(ctx, x, y, 70, '#fff1cf', 0.25);
    }
    // the team in front of the glass
    const look = ramp(t, SHUT[0] + 0.2, SHUT[1]), slump = ramp(t, SHUT[1] + 0.3, SHUT[1] + 1.2) * (1 - lift);
    const xs = [640, 850, 1070, 1270];
    xs.forEach((x, k) => stand(ctx, t, x, k, lerp(0.15 * Math.sin(t * 0.4 + k), (k < 2 ? 0.6 : -0.6), look * (1 - ramp(t, SHUT[1] + 0.6, SHUT[1] + 1.4))), slump * (k % 2 ? 1 : 0.6)));
    light(ctx, 960, 760, 700, C.cyan, 0.08 * (1 - shut));
  });
  K.caption(ctx, t, 447.0, 449.2, 'from Washington', 80, 540, { font: '28px "Inter SemiBold"', color: C.cream });
  L.label(ctx, t, 448.5, 452.4, 'UK AI Security Institute', 'September 2026', 96, 70);
  L.stamp(ctx, t, 452.65, T1, '17 days', 'locked out', { size: 110, x: 130, y: 200 });
}

module.exports = { T0, T1, draw };
