// "This pause left four things nobody could answer."
// Night on a quiet hilltop. Four people each let go of a paper sky lantern; on "four" they rise one after another
// and settle in a row overhead, each with a question mark glowing on it. The people stay below, looking up.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, out, ease } = L;
const { grainFill, roundRect, curve, cached, cam } = require('./s_k5_race');
const { figure } = require('./s_timeline');

const T0 = 333.7, T1 = 338.6;
const XS = [470, 800, 1130, 1460], LAUNCH = [334.95, 335.25, 335.55, 335.85];
const R = rng(333);
const STARS = Array.from({ length: 150 }, () => [R() * W, R() * 650, R()]);

function landArt(c) {
  c.fillStyle = lin(c, 0, -100, 0, 900, [[0, '#06071c'], [0.55, '#141640'], [0.85, '#2c2552'], [1, '#3a2c58']]); c.fillRect(-200, -200, W + 400, 1200);
  grainFill(c, cc => { curve(cc, [[-200, 760], [300, 720], [700, 745], [1100, 715], [1500, 740], [2100, 720]]); cc.lineTo(2100, 1300); cc.lineTo(-200, 1300); cc.closePath(); }, lin(c, 0, 700, 0, 800, [[0, '#1f1c4a'], [1, '#161438']]), 0.5);
  grainFill(c, cc => { curve(cc, [[-200, 900], [400, 870], [960, 880], [1500, 865], [2100, 900]]); cc.lineTo(2100, 1300); cc.lineTo(-200, 1300); cc.closePath(); }, lin(c, 0, 860, 0, H, [[0, '#14122e'], [1, '#07071a']]), 0.55);
}

function lantern(ctx, t, x, y, k, i) {
  const sw = Math.sin(t * 1.3 + i * 1.7) * 0.05;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw);
  const body = c => { c.moveTo(-38, -60); c.lineTo(38, -60); c.quadraticCurveTo(52, 0, 44, 56); c.lineTo(-44, 56); c.quadraticCurveTo(-52, 0, -38, -60); c.closePath(); };
  grainFill(ctx, body, rad(ctx, 0, 30, 6, 110, [[0, '#fff0c8'], [0.45, '#ffb35c'], [1, '#a2521f']]), 0.35);
  ctx.strokeStyle = 'rgba(122,59,23,0.45)'; ctx.lineWidth = 2; for (const xx of [-18, 18]) { ctx.beginPath(); ctx.moveTo(xx, -60); ctx.quadraticCurveTo(xx * 1.25, 0, xx * 1.15, 56); ctx.stroke(); }
  ctx.fillStyle = '#5a2a12'; ctx.fillRect(-44, 54, 88, 5);
  // the question on it
  ctx.font = '74px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba('#5a2a12', 0.85); ctx.fillText('?', 0, 2);
  ctx.restore();
  // the flame under it
  const f = 0.85 + 0.15 * Math.sin(t * 13 + i * 3);
  light(ctx, x, y + 50, 70, '#fff0c8', 0.6 * f * k);
  light(ctx, x, y, 210, C.amber, 0.38 * f * k);
}

function draw(ctx, t) {
  const layer = cam(ctx, t, T0, T1, 1.0, 1.06, 960, 560, 91);
  layer(0.3, () => {
    cached(ctx, 'k5four_land', -200, -200, W + 200, H + 200, landArt, 1);
    for (const [x, y, k] of STARS) { const a = 0.2 + 0.3 * Math.sin(t * (0.8 + k * 2) + k * 30); if (a > 0) { ctx.fillStyle = rgba(C.cream, a * (1 - y / 760)); ctx.fillRect(x, y, 2, 2); } }
    light(ctx, 960, 860, 900, '#c86a5a', 0.10);
  });
  layer(0.8, () => {
    XS.forEach((x0, i) => {
      const lt = LAUNCH[i], up = ease((t - lt) / 1.9), held = t < lt;
      const fx = x0 + (i - 1.5) * 8, hipY = 890 - 150 * 0.5;
      // lantern: held at arm's height, then rises to its place in the row
      const tx = x0 + Math.sin(t * 0.4 + i) * 10 * up, ty = lerp(hipY - 168, 300 + (i % 2) * 26, up) + Math.sin(t * 0.9 + i * 2) * 6 * up;
      const arms = held || t < lt + 0.4;
      const br = Math.sin(t * 1.6 + i);
      figure(ctx, { x: fx, y: hipY, s: 0.5, facing: 'back', br, turn: (i - 1.5) * 0.12, tilt: -0.1 - 0.2 * ramp(t, lt, lt + 1.2), lx: 1, grain: 0.3, rim: '#ffcf98', rimA: 0.5, rimDx: 0, rimDy: -2,
        pal: [['#ffb35c', '#c9702e', '#5a2a12'], ['#ffc27c', '#cf7a36', '#4a1e0c'], ['#f0a25a', '#b8622a', '#4a1e0c'], ['#ffb35c', '#d27a34', '#5a2a12']][i],
        legs: [{ a1: Math.PI / 2 + 0.06, a2: Math.PI / 2 + 0.04 }, { a1: Math.PI / 2 - 0.06, a2: Math.PI / 2 - 0.04 }],
        arms: arms ? [{ tx: x0 - 30, ty: (held ? hipY - 104 : lerp(hipY - 104, hipY - 116, ramp(t, lt, lt + 0.4))), bend: 1 }, { tx: x0 + 30, ty: (held ? hipY - 104 : lerp(hipY - 104, hipY - 116, ramp(t, lt, lt + 0.4))), bend: -1 }]
          : [{ a1: Math.PI / 2 + 0.12, a2: Math.PI / 2 + 0.05 }, { a1: Math.PI / 2 - 0.12, a2: Math.PI / 2 - 0.05 }] });
      lantern(ctx, t, tx, ty, 0.6 + 0.4 * ramp(t, lt - 0.3, lt + 0.3), i);
    });
  });
}

module.exports = { T0, T1, draw };
