// "And we've done hard things before. A hole opened in the sky, and two years later the world signed a treaty to close it."
// The Earth seen from below the South Pole, turning slowly at dawn under its pale shell of ozone.
// On "hole" a purple hole tears open over Antarctica. "two years later": 1987. On "signed" lights come on in
// countries all round the globe, threads run from them to the hole's edge, and on "close it" they draw it shut.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease, stamp, label } = L;
const { gf, curve, glowE, camera, mix } = require('./s_k11_poll');

const T0 = 688.65, T1 = 696.95;
const T_HOLE = 691.66, T_1987 = 693.50, T_SIGN = 695.08, T_CLOSE = 696.02;
const E = { x: 960, y: 540, R: 380 };
const D2R = Math.PI / 180;

// rough coastlines (lon, lat) seen from the south: radius = R cos(lat) (orthographic, pole-on), angle = lon
const LANDS = {
  ant: [[-180, -78], [-160, -77], [-140, -74], [-120, -73], [-100, -73], [-80, -72], [-68, -70], [-62, -67.5], [-57, -68.5], [-52, -73], [-45, -77], [-30, -76], [-15, -71], [0, -70], [20, -69.5], [40, -68], [60, -67], [80, -66.5], [100, -66], [120, -66.5], [140, -67], [155, -69], [165, -72], [172, -76]],
  sam: [[-68, -55], [-74, -50], [-74, -40], [-72, -30], [-71, -18], [-80, -5], [-79, 2], [-60, 2], [-50, 0], [-35, -7], [-40, -22], [-48, -28], [-58, -38], [-64, -42], [-66, -50]],
  afr: [[18, -34], [25, -34], [32, -28], [36, -20], [40, -12], [41, 0], [10, 0], [9, -2], [12, -6], [13, -12], [12, -18], [15, -27]],
  mad: [[44, -25], [47, -25], [50, -16], [49, -12], [44, -17]],
  aus: [[115, -34], [118, -35], [130, -32], [135, -35], [140, -38], [146, -39], [150, -37], [153, -28], [146, -19], [142, -11], [136, -12], [130, -12], [125, -15], [114, -22]],
  nz: [[167, -46], [172, -42], [175, -37], [178, -38], [174, -41], [170, -46]],
};
// signatory lights scattered over the visible lands and islands (lon, lat)
const SIGN = (() => { const r = rng(1987), a = [];
  const spots = [[-58, -34], [-70, -33], [-47, -15], [-77, -12], [-66, -17], [28, -26], [18, -33], [36, -6], [32, -15], [13, -8], [47, -19], [151, -34], [145, -38], [116, -32], [138, -35], [175, -41], [-57, -25], [-52, -10], [26, -18], [40, -3], [100, -4], [120, -8], [-175, -18], [-150, -17], [160, -9], [70, -20], [-20, -10], [-80, 0], [57, -20], [5, -2]];
  spots.forEach((s, i) => a.push({ lon: s[0], lat: s[1], t: T_SIGN + 0.04 + r() * 0.7, ph: r() * 6 }));
  return a; })();
const STARS = (() => { const r = rng(17); return Array.from({ length: 160 }, () => [r() * W, r() * H, r()]); })();

function proj(lon, lat, rot) { const r = E.R * Math.cos(Math.min(lat, 0) * D2R), a = (lon + rot) * D2R; return [E.x + Math.cos(a) * r, E.y + Math.sin(a) * r]; }
function landPath(c, pts, rot) { const p = pts.map(([lo, la]) => proj(lo, la, rot)); curve(c, [...p, p[0]]); c.closePath(); }

function holeR(t) {
  const open = ease(clamp((t - T_HOLE) / 1.1)), close = ease(clamp((t - T_CLOSE + 0.15) / 0.95));
  return open * lerp(1, 0.08, close);
}

function draw(ctx, t) {
  const z = lerp(0.94, 1.06, sm((t - T0) / (T1 - T0)));
  const layer = camera(ctx, t, E.x, E.y, z, 41);
  const rot = (t - T0) * 4 - 20;
  const hr = holeR(t), sign = ramp(t, T_SIGN, T_SIGN + 0.8);
  layer(0.15, () => {
    ctx.fillStyle = rad(ctx, E.x, E.y, 200, 1300, [[0, '#141640'], [1, '#05061a']]); ctx.fillRect(-300, -300, W + 600, H + 600);
    for (const [x, y, k] of STARS) { const a = 0.15 + 0.3 * (0.5 + 0.5 * Math.sin(t * (0.7 + k * 2) + k * 20)); ctx.fillStyle = rgba(C.cream, a * k); ctx.fillRect(x, y, 2, 2); }
    // the sun is coming up behind the right limb
    light(ctx, E.x + E.R * 1.05, E.y - E.R * 0.4, 700, '#ff9a5a', 0.22);
  });
  layer(0.3, () => {
    // atmosphere halo
    glowE(ctx, E.x, E.y, E.R + 70, E.R + 70, [[0.82, rgba('#9ab8ff', 0)], [0.86, rgba('#b8c8ff', 0.25)], [0.9, rgba('#ffb38a', 0.12)], [1, 'rgba(255,179,138,0)']]);
    // ocean
    const disc = c => c.arc(E.x, E.y, E.R, 0, Math.PI * 2);
    gf(ctx, disc, rad(ctx, E.x + 140, E.y - 160, 40, E.R * 1.25, [[0, '#2f6a9e'], [0.55, '#1a3a70'], [1, '#0b1336']]), 0.45);
    ctx.save(); ctx.beginPath(); disc(ctx); ctx.clip();
    // latitude rings, faint
    ctx.strokeStyle = rgba('#b8c8ff', 0.08); ctx.lineWidth = 1.5;
    for (const la of [-30, -60]) { ctx.beginPath(); ctx.arc(E.x, E.y, E.R * Math.cos(la * D2R), 0, Math.PI * 2); ctx.stroke(); }
    // lands
    for (const k of ['sam', 'afr', 'mad', 'aus', 'nz']) gf(ctx, c => landPath(c, LANDS[k], rot), lin(ctx, E.x + 300, E.y - 300, E.x - 300, E.y + 300, [[0, '#d8a070'], [0.5, '#8a5a4a'], [1, '#3a2a40']]), 0.5);
    gf(ctx, c => landPath(c, LANDS.ant, rot), lin(ctx, E.x + 120, E.y - 120, E.x - 120, E.y + 120, [[0, '#f3efe2'], [0.6, '#c8c0dc'], [1, '#7a7498']]), 0.4);
    // the ozone shell: a pale luminous film over everything, with the hole cut out of it
    const holePts = []; const N = 40;
    for (let i = 0; i <= N; i++) { const a = i / N * Math.PI * 2, wob = 1 + 0.16 * Math.sin(a * 3 + t * 0.9) + 0.08 * Math.sin(a * 5 - t * 1.3);
      holePts.push([E.x + 25 + Math.cos(a) * 200 * hr * wob, E.y - 10 + Math.sin(a) * 175 * hr * wob]); }
    ctx.save();
    ctx.beginPath(); ctx.arc(E.x, E.y, E.R + 2, 0, Math.PI * 2); if (hr > 0.01) { curve(ctx, holePts); ctx.closePath(); }
    ctx.fillStyle = rad(ctx, E.x, E.y, E.R * 0.2, E.R, [[0, rgba('#c8d4ff', 0.22)], [1, rgba('#c8d4ff', 0.08)]]); ctx.fill('evenodd');
    ctx.restore();
    if (hr > 0.01) {
      // inside the hole: harsh, cold, purple; its edge glows
      ctx.save(); ctx.beginPath(); curve(ctx, holePts); ctx.closePath(); ctx.clip();
      ctx.fillStyle = rad(ctx, E.x + 25, E.y - 10, 0, 220 * hr, [[0, rgba('#3a1a6a', 0.75)], [1, rgba('#8a4ab8', 0.45)]]); ctx.fillRect(E.x - 300, E.y - 300, 600, 600);
      ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#c890ff', 0.55 * Math.min(1, hr * 3)); ctx.lineWidth = 3; ctx.beginPath(); curve(ctx, holePts); ctx.closePath(); ctx.stroke(); ctx.restore();
    }
    // night side: the terminator falls across the lower left
    ctx.fillStyle = lin(ctx, E.x - E.R, E.y + E.R, E.x + E.R * 0.3, E.y - E.R * 0.3, [[0, 'rgba(5,6,26,0.85)'], [0.45, 'rgba(5,6,26,0.35)'], [0.6, 'rgba(5,6,26,0)']]);
    ctx.fillRect(E.x - E.R, E.y - E.R, 2 * E.R, 2 * E.R);
    // dawn warmth on the right limb
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, E.x + E.R, E.y - E.R * 0.4, 0, E.R * 1.1, [[0, rgba('#ff9a5a', 0.28)], [1, 'rgba(255,154,90,0)']]); ctx.fillRect(E.x - E.R, E.y - E.R, 2 * E.R, 2 * E.R); ctx.restore();
    ctx.restore();
    // the signatories: lights all over the world, then threads to the hole's edge that pull it closed
    for (const s of SIGN) {
      const on = out((t - s.t) / 0.25); if (on <= 0) continue;
      const p = proj(s.lon, s.lat, rot); if (Math.hypot(p[0] - E.x, p[1] - E.y) > E.R - 4) continue;
      const th = ramp(t, T_CLOSE - 0.6, T_CLOSE) * (1 - ramp(t, T1 - 0.4, T1));
      if (th > 0) {
        const a = Math.atan2(p[1] - (E.y - 10), p[0] - (E.x + 25)), q = [E.x + 25 + Math.cos(a) * 200 * hr, E.y - 10 + Math.sin(a) * 175 * hr];
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.amber, 0.35 * th * on); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo((p[0] + q[0]) / 2 + (q[1] - p[1]) * 0.15, (p[1] + q[1]) / 2 - (q[0] - p[0]) * 0.15, q[0], q[1]); ctx.stroke(); ctx.restore();
      }
      ctx.fillStyle = rgba('#ffe0a8', 0.9 * on); ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2); ctx.fill();
      light(ctx, p[0], p[1], 34, C.amber, (0.5 + 0.6 * Math.exp(-Math.max(0, t - s.t) * 4)) * on * (0.9 + 0.1 * Math.sin(t * 3 + s.ph)));
    }
    // when it closes, a soft healing ring
    const heal = ramp(t, T_CLOSE + 0.3, T_CLOSE + 0.9);
    if (heal > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffd59a', 0.5 * heal * (1 - ramp(t, T1 - 0.3, T1))); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(E.x + 25, E.y - 10, 200 * heal * 1.2, 175 * heal * 1.2, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  });
  label(ctx, t, T_HOLE + 0.35, T_1987 - 0.1, '1985', 'a hole over Antarctica', 1420, 300, { color: '#c890ff' });
  stamp(ctx, t, T_1987, T1 - 0.05, '1987', 'Montreal Protocol', { size: 150 });
}

module.exports = { T0, T1, draw };
