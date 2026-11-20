// "Our headlights don't reach far enough yet. We know how to build better ones."
// Behind a small car on a fogbound road before dawn. Its headlights die in the fog a few metres ahead.
// On "build better ones" the beams reach out brighter and longer, the fog thins, and the road ahead appears.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { gf, curve, rr, glowE, camera, mix } = require('./s_k11_poll');

const T0 = 702.15, T1 = 707.15;
const T_SHORT = 703.54, T_BETTER = 705.86;

const VP = [960, 430];
// road edges at depth: screen y from horizon to bottom; x half-width grows linearly with (y - VP.y)
const halfW = y => 6 + (y - VP[1]) * 0.95;
const POSTS = (() => { const r = rng(703); return Array.from({ length: 10 }, (_, i) => ({ ph: i / 10, side: i % 2 ? 1 : -1, k: r() })); })();
const FOGB = (() => { const r = rng(704); return Array.from({ length: 12 }, () => ({ x: r() * 2400 - 240, y: 400 + r() * 260, rx: 300 + r() * 500, ry: 30 + r() * 60, sp: 10 + r() * 25, a: 0.5 + r() * 0.5 })); })();

// the landscape as seen down the road; reach: 0 short beams .. 1 long beams; fog: 1 dense .. 0 clear
function roadView(ctx, t, reach, fog, speed, warm) {
  // sky: pre-dawn, warming at the horizon
  ctx.fillStyle = lin(ctx, 0, -200, 0, VP[1] + 20, [[0, '#0a0b26'], [0.6, mix('#262650', '#4a3a66', warm)], [1, mix('#4a4470', '#c08a7a', warm)]]);
  ctx.fillRect(-300, -300, W + 600, VP[1] + 320);
  glowE(ctx, 1200, VP[1], 900, 160, [[0, rgba('#ffb38a', 0.10 + 0.35 * warm)], [1, 'rgba(255,179,138,0)']]);
  // far hills
  gf(ctx, c => { curve(c, [[-300, VP[1] + 6], [200, VP[1] - 30], [600, VP[1] - 8], [960, VP[1] - 22], [1400, VP[1] - 4], [1800, VP[1] - 34], [2200, VP[1]]]); c.lineTo(2200, VP[1] + 60); c.lineTo(-300, VP[1] + 60); c.closePath(); },
    mix('#2a2a58', '#5a4a6a', warm), 0.4);
  // fields either side
  gf(ctx, c => c.rect(-300, VP[1], W + 600, H - VP[1] + 300), lin(ctx, 0, VP[1], 0, H, [[0, '#2a2a56'], [1, '#0e0e28']]), 0.5);
  // road
  gf(ctx, c => { c.moveTo(VP[0] - 6, VP[1]); c.lineTo(VP[0] + 6, VP[1]); c.lineTo(VP[0] + halfW(H + 200), H + 200); c.lineTo(VP[0] - halfW(H + 200), H + 200); c.closePath(); },
    lin(ctx, 0, VP[1], 0, H, [[0, '#3a3a66'], [1, '#1a1a3a']]), 0.45);
  // centre dashes streaming toward us
  const z0 = (t * speed) % 1;
  for (let k = 0; k < 14; k++) {
    const zf = (k + z0) / 14, y1 = VP[1] + Math.pow(zf, 2.2) * (H + 120 - VP[1]), y2 = VP[1] + Math.pow(Math.min(1, zf + 0.035), 2.2) * (H + 120 - VP[1]);
    const w1 = 2 + 10 * zf, w2 = 2 + 10 * Math.min(1, zf + 0.035);
    ctx.fillStyle = rgba('#e8dcc0', 0.55); ctx.beginPath(); ctx.moveTo(VP[0] - w1 / 2, y1); ctx.lineTo(VP[0] + w1 / 2, y1); ctx.lineTo(VP[0] + w2 / 2, y2); ctx.lineTo(VP[0] - w2 / 2, y2); ctx.closePath(); ctx.fill();
  }
  // roadside posts with little reflectors
  for (const p of POSTS) {
    const zf = (p.ph + t * speed * 0.6) % 1, y = VP[1] + Math.pow(zf, 2.2) * (H + 200 - VP[1]), x = VP[0] + p.side * (halfW(y) * 1.12 + 10), h = 6 + 90 * Math.pow(zf, 2.2);
    ctx.fillStyle = '#0c0c22'; ctx.fillRect(x - h * 0.06, y - h, h * 0.12, h);
    light(ctx, x, y - h * 0.85, 6 + h * 0.2, C.amber, 0.5 * Math.min(1, zf * 2));
  }
  // fog: a wall that hides the distance; thinner as it clears
  const fogTop = VP[1] - 120, fogBot = lerp(820, 600, 1 - fog);
  ctx.fillStyle = lin(ctx, 0, fogTop, 0, fogBot, [[0, rgba('#8a86b8', 0)], [0.25, rgba('#8a86b8', 0.55 * fog + 0.05)], [0.6, rgba('#6a68a0', 0.45 * fog)], [1, rgba('#6a68a0', 0)]]);
  ctx.fillRect(-300, fogTop, W + 600, fogBot - fogTop);
  for (const b of FOGB) { const x = ((b.x + t * b.sp) % 2600) - 340; glowE(ctx, x, b.y, b.rx, b.ry, [[0, rgba('#a8a4d0', 0.16 * b.a * (0.3 + fog))], [1, 'rgba(168,164,208,0)']]); }
}
// the headlight beams in the fog: from the car's lamps at (x,y) toward the vanishing point, reaching `reach`
function beams(ctx, cx, cy, sep, reach, power, fog) {
  const ey = lerp(cy - 110, VP[1] + 10, reach);            // where the light gives out
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const hw = halfW(ey);
  for (const [wk, ak] of [[1.0, 1], [1.3, 0.45], [1.7, 0.2]]) {
    ctx.fillStyle = lin(ctx, 0, cy, 0, ey, [[0, rgba('#fff0d0', 0.30 * power * ak)], [0.6, rgba('#ffd59a', 0.14 * power * ak)], [1, rgba('#ffd59a', 0)]]);
    ctx.beginPath(); ctx.moveTo(cx - sep - 20 * wk, cy); ctx.lineTo(VP[0] - hw * wk, ey); ctx.quadraticCurveTo(VP[0], ey - 16, VP[0] + hw * wk, ey); ctx.lineTo(cx + sep + 20 * wk, cy); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  // where the light gives out, the fog itself glows
  glowE(ctx, VP[0], ey + 10, halfW(ey) * 1.6 + 120, 50 + 30 * (1 - reach), [[0, rgba('#ffe6c0', 0.22 * power * (0.4 + fog))], [1, 'rgba(255,230,192,0)']], true);
}
function carRear(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 9) * 0.8); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(4,4,16,0.55)'; ctx.beginPath(); ctx.ellipse(0, 6, 250, 26, 0, 0, Math.PI * 2); ctx.fill();
  // wheels
  ctx.fillStyle = '#06061a'; ctx.beginPath(); rr(ctx, -210, -40, 56, 52, 12); rr(ctx, 154, -40, 56, 52, 12); ctx.fill();
  // body and cabin
  gf(ctx, c => { c.moveTo(-230, -20); c.lineTo(-236, -120); c.quadraticCurveTo(-232, -150, -200, -156); c.lineTo(200, -156); c.quadraticCurveTo(232, -150, 236, -120); c.lineTo(230, -20); c.quadraticCurveTo(0, -6, -230, -20); c.closePath(); },
    lin(ctx, 0, -156, 0, -10, [[0, '#4a4278'], [1, '#1a1838']]), 0.45);
  gf(ctx, c => { c.moveTo(-170, -156); c.lineTo(-136, -260); c.quadraticCurveTo(-128, -272, -110, -272); c.lineTo(110, -272); c.quadraticCurveTo(128, -272, 136, -260); c.lineTo(170, -156); c.closePath(); },
    lin(ctx, 0, -272, 0, -156, [[0, '#3a3466'], [1, '#2a2650']]), 0.45);
  // rear window shows the glow ahead through the cabin
  gf(ctx, c => { c.moveTo(-148, -164); c.lineTo(-122, -250); c.lineTo(122, -250); c.lineTo(148, -164); c.closePath(); }, lin(ctx, 0, -250, 0, -164, [[0, '#d8c0a8'], [1, '#6a5a7a']]), 0.3);
  // two silhouetted heads inside
  ctx.fillStyle = '#141230'; for (const hx of [-62, 64]) { ctx.beginPath(); ctx.ellipse(hx, -200, 21, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); rr(ctx, hx - 44, -184, 88, 24, 10); ctx.fill(); }
  // tail lights and bumper
  for (const sg of [-1, 1]) { ctx.fillStyle = '#ff6a5a'; ctx.beginPath(); rr(ctx, sg * 200 - 26, -120, 52, 22, 6); ctx.fill(); light(ctx, sg * 200, -109, 60, '#ff5a4a', 0.55); }
  ctx.fillStyle = '#121030'; ctx.fillRect(-232, -52, 464, 18);
  ctx.fillStyle = '#e8dcc0'; ctx.fillRect(-40, -88, 80, 22);
  ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.07, sm((t - T0) / (T1 - T0)));
  const layer = camera(ctx, t, VP[0], 640, z, 61);
  const better = ease(clamp((t - T_BETTER) / 1.0));
  const flick = 0.96 + 0.04 * Math.sin(t * 13);
  const reach = 0.1 * (1 - ramp(t, T_SHORT - 0.2, T_SHORT + 0.4) * 0.6) + 0.9 * better;     // the beams pull in a little on "reach far enough"
  const fog = 1 - 0.75 * better, warm = 0.15 + 0.4 * better;
  layer(0.4, () => roadView(ctx, t, reach, fog, 0.55, warm));
  layer(1.0, () => {
    beams(ctx, VP[0], 800, 110, reach, (0.9 + 0.5 * better) * flick, fog);
    carRear(ctx, VP[0], 925, 0.62, t);
  });
}

module.exports = { T0, T1, draw, roadView, beams, VP, halfW };
