// "And we still have the wheel."
// The driver's view: two hands on the steering wheel, the long beams now reaching down the road through thinning fog.
// On "wheel" the hands tighten and make one small, deliberate correction; a warm glint runs round the rim.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { gf, curve, rr, glowE, camera, mix } = require('./s_k11_poll');
const { roadView, beams, VP } = require('./s_k11_road');

const T0 = 706.85, T1 = 709.75;
const T_WHEEL = 708.38;
const WC = [960, 1000], WR = 360;

function fist(ctx, ang, t, grip, skin, sleeve, side) {
  // hand on the rim at angle `ang` (0 = top, clockwise), seen from behind: knuckles over the rim, thumb inside
  const x = WC[0] + Math.sin(ang) * WR, y = WC[1] - Math.cos(ang) * WR;
  // forearm from the bottom corner to the wrist
  const fx = WC[0] + side * 560, fy = 1240, wx = x + side * 40, wy = y + 70;
  const nx = -(wy - fy), ny = wx - fx, n = Math.hypot(nx, ny), ux = nx / n, uy = ny / n;
  gf(ctx, c => { c.moveTo(fx + ux * 120, fy + uy * 120); c.lineTo(wx + ux * 52, wy + uy * 52); c.lineTo(wx - ux * 52, wy - uy * 52); c.lineTo(fx - ux * 120, fy - uy * 120); c.closePath(); },
    lin(ctx, wx, wy, fx, fy, [[0, sleeve[0]], [1, sleeve[1]]]), 0.45);
  // sleeve folds
  ctx.strokeStyle = rgba(sleeve[1], 0.8); ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (const k of [0.25, 0.45]) { const px = lerp(wx, fx, k), py = lerp(wy, fy, k); ctx.beginPath(); ctx.moveTo(px + ux * 50, py + uy * 50); ctx.quadraticCurveTo(px + (fx - wx) * 0.03, py + (fy - wy) * 0.03, px - ux * 30, py - uy * 30); ctx.stroke(); }
  // cuff
  gf(ctx, c => { c.moveTo(wx + ux * 56, wy + uy * 56); c.lineTo(wx - ux * 56, wy - uy * 56); c.lineTo(wx - ux * 56 + (fx - wx) * 0.06, wy - uy * 56 + (fy - wy) * 0.06); c.lineTo(wx + ux * 56 + (fx - wx) * 0.06, wy + uy * 56 + (fy - wy) * 0.06); c.closePath(); }, sleeve[1], 0.4);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  const g = 1 - 0.05 * grip;
  // back of the hand, from the wrist up over the rim
  gf(ctx, c => { c.moveTo(-50 * g, 70); c.bezierCurveTo(-62 * g, 30, -58 * g, -8, -46 * g, -26); c.quadraticCurveTo(0, -44, 46 * g, -26); c.bezierCurveTo(58 * g, -8, 62 * g, 30, 50 * g, 70); c.closePath(); },
    lin(ctx, -40, -40, 40, 70, [[0, mix(skin, '#ffd29a', 0.4)], [0.6, skin], [1, mix(skin, '#3a1608', 0.5)]]), 0.35);
  // four fingers curled over the rim
  for (let i = 0; i < 4; i++) { const fx2 = (-34 + i * 22.5) * g;
    gf(ctx, c => rr(c, fx2 - 11, -36 - (i === 1 || i === 2 ? 3 : 0), 22, 30, 10), lin(ctx, 0, -38, 0, -8, [[0, mix(skin, '#3a1608', 0.35)], [0.45, mix(skin, '#ffd29a', 0.3)], [1, skin]]), 0.3); }
  // knuckle creases
  ctx.strokeStyle = rgba('#3a1608', 0.4); ctx.lineWidth = 2.5; for (let i = 0; i < 4; i++) { const fx2 = (-34 + i * 22.5) * g; ctx.beginPath(); ctx.moveTo(fx2 - 6, -20); ctx.lineTo(fx2 + 6, -20); ctx.stroke(); }
  // thumb along the inside of the rim
  gf(ctx, c => { c.moveTo(side * 30, 52); c.quadraticCurveTo(-side * 10, 34, -side * 62, 26); c.quadraticCurveTo(-side * 80, 24, -side * 78, 36); c.quadraticCurveTo(-side * 60, 50, side * 10, 68); c.closePath(); }, lin(ctx, 0, 24, 0, 68, [[0, mix(skin, '#ffd29a', 0.25)], [1, mix(skin, '#3a1608', 0.35)]]), 0.3);
  ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.05, sm((t - T0) / (T1 - T0)));
  const layer = camera(ctx, t, 960, 700, z, 71);
  const grip = ramp(t, T_WHEEL - 0.1, T_WHEEL + 0.15) * (1 - 0.6 * ramp(t, T_WHEEL + 0.8, T1));
  const steer = 0.02 * Math.sin(t * 0.8) + 0.09 * Math.sin(Math.PI * clamp((t - T_WHEEL) / 1.0)) * (t > T_WHEEL ? 1 : 0);
  const br = Math.sin(t * 1.5);
  // the road through the windscreen
  layer(0.4, () => {
    ctx.save(); ctx.translate(960 - VP[0], 330 - VP[1]); ctx.translate(VP[0], VP[1]); ctx.rotate(-steer * 0.3); ctx.translate(-VP[0], -VP[1]);
    roadView(ctx, t, 1, 0.3, 0.75, 0.6);
    beams(ctx, VP[0], 820, 120, 1, 1.3, 0.3);
    ctx.restore();
  });
  // cabin: roof edge, A-pillars, dashboard
  layer(0.8, () => {
    gf(ctx, c => { c.moveTo(-300, -300); c.lineTo(W + 300, -300); c.lineTo(W + 300, 70); c.quadraticCurveTo(960, 20, -300, 70); c.closePath(); }, lin(ctx, 0, -300, 0, 70, [[0, '#06061a'], [1, '#141236']]), 0.5);
    for (const sg of [-1, 1]) gf(ctx, c => { c.moveTo(960 + sg * 1300, 0); c.lineTo(960 + sg * 860, 0); c.lineTo(960 + sg * 1060, 640); c.lineTo(960 + sg * 1400, 640); c.closePath(); }, '#0c0a24', 0.5);
    gf(ctx, c => { c.moveTo(-300, 640); c.quadraticCurveTo(960, 560, W + 300, 640); c.lineTo(W + 300, H + 300); c.lineTo(-300, H + 300); c.closePath(); }, lin(ctx, 0, 580, 0, H, [[0, '#1e1a40'], [1, '#08081a']]), 0.55);
    // gauges behind the wheel, warm
    for (const [gx, gr] of [[830, 62], [1090, 62]]) { ctx.strokeStyle = rgba(C.amber, 0.45); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(gx, 730, gr, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke();
      const a = Math.PI * (1.2 + 0.4 * Math.sin(t * 0.6 + gx)); ctx.strokeStyle = '#ffd08a'; ctx.beginPath(); ctx.moveTo(gx, 730); ctx.lineTo(gx + Math.cos(a) * gr * 0.85, 730 + Math.sin(a) * gr * 0.85); ctx.stroke(); light(ctx, gx, 730, 120, C.amber, 0.18); }
  });
  // the wheel and the hands
  layer(1.1, () => {
    ctx.save(); ctx.translate(WC[0], WC[1] + br); ctx.rotate(steer); ctx.translate(-WC[0], -WC[1]);
    // spokes and hub
    gf(ctx, c => { c.moveTo(WC[0] - WR + 20, WC[1] - 20); c.quadraticCurveTo(WC[0], WC[1] - 110, WC[0] + WR - 20, WC[1] - 20); c.lineTo(WC[0] + WR - 20, WC[1] + 40); c.quadraticCurveTo(WC[0], WC[1] - 30, WC[0] - WR + 20, WC[1] + 40); c.closePath(); c.moveTo(WC[0] + 110, WC[1]); c.arc(WC[0], WC[1], 110, 0, Math.PI * 2); },
      lin(ctx, 0, WC[1] - 120, 0, WC[1] + 60, [[0, '#2a2650'], [1, '#0c0a22']]), 0.5);
    // rim
    gf(ctx, c => { c.arc(WC[0], WC[1], WR + 22, 0, Math.PI * 2); c.moveTo(WC[0] + WR - 22, WC[1]); c.arc(WC[0], WC[1], WR - 22, 0, Math.PI * 2, true); }, lin(ctx, 0, WC[1] - WR, 0, WC[1], [[0, '#3a3468'], [1, '#121030']]), 0.5);
    ctx.strokeStyle = rgba('#ffd59a', 0.18); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(WC[0], WC[1], WR + 16, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    // a warm glint runs round the rim on "wheel"
    const gl = clamp((t - T_WHEEL) / 0.9);
    if (gl > 0 && gl < 1) { const a = Math.PI * (1.05 + 0.9 * ease(gl)), px = WC[0] + Math.cos(a) * WR, py = WC[1] + Math.sin(a) * WR; light(ctx, px, py, 90, '#ffe0a8', 0.7 * Math.sin(Math.PI * gl)); }
    fist(ctx, -0.92, t, grip, '#d07a38', ['#5a4a8a', '#1a1438'], -1);
    fist(ctx, 0.92, t, grip, '#d07a38', ['#5a4a8a', '#1a1438'], 1);
    ctx.restore();
  });
}

module.exports = { T0, T1, draw };
