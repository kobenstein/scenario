// "The future isn't something that happens to us. It's something we decide."
// The same fork in the road as in the opening, now at dawn, seen from above. A small car with its long beams on
// comes up the road and slows at the fork: left, the road sinks into cold fog; right, it climbs toward the sunrise.
// On "decide" it turns right, and the sun clears the hill.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { gf, curve, rr, glowE, camera, mix } = require('./s_k11_poll');

const T0 = 709.45, T1 = 714.95;
const T_DECIDE = 713.50;

function edges(pts) {
  const Lf = [], Rt = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
    Lf.push([p[0] + nx * p[2] / 2, p[1] + ny * p[2] / 2]); Rt.push([p[0] - nx * p[2] / 2, p[1] - ny * p[2] / 2]);
  });
  return [Lf, Rt];
}
function ribbon(c, pts) { const [Lf, Rt] = edges(pts); curve(c, Lf); curve(c, Rt.slice().reverse(), false); c.closePath(); }
function along(pts, u) {
  const seg = []; let tot = 0;
  for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(d); tot += d; }
  let d = clamp(u) * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const k = d / seg[i]; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), lerp(pts[i][2], pts[i + 1][2], k), Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])]; } d -= seg[i]; }
  const e = pts[pts.length - 1], p = pts[pts.length - 2]; return [e[0], e[1], e[2], Math.atan2(e[1] - p[1], e[0] - p[0])];
}

// same place as s_fork.js
const FORK = [930, 726];
const MAIN = [[1040, 1140, 330], [1000, 990, 200], [960, 850, 110], [936, 760, 58], [930, 726, 46]];
const RIGHT = [[930, 726, 46], [1040, 700, 38], [1150, 660, 30], [1230, 628, 24], [1300, 612, 20], [1390, 572, 15], [1470, 532, 11], [1540, 500, 8], [1590, 482, 5]];
const LEFT = [[930, 726, 46], [830, 748, 40], [720, 736, 34], [620, 758, 30], [560, 800, 27], [460, 812, 24], [360, 790, 20], [270, 812, 17], [170, 850, 14], [60, 870, 11]];
const RIDGE = [[760, 820], [900, 760], [1060, 690], [1200, 620], [1330, 560], [1450, 508], [1560, 476], [1680, 462], [1800, 470], [1920, 488], [2100, 500]];
const HOUSES = [[1395, 520, 1.0], [1470, 497, 0.85], [1600, 470, 0.8], [1690, 466, 0.9], [1790, 472, 0.75]];
const R = rng(712);
const TREES = Array.from({ length: 16 }, () => ({ x: 0, y: 0, h: 50 + R() * 90 }));
TREES.forEach((tr, i) => { tr.x = i < 9 ? 20 + R() * 640 : 1250 + R() * 640; tr.y = tr.x < 700 ? 960 + R() * 120 : 900 + R() * 170; tr.h *= tr.y / 900; });
const BIRDS = Array.from({ length: 6 }, () => ({ x: 1200 + R() * 400, y: 260 + R() * 120, ph: R() * 6, sp: 18 + R() * 10 }));

function tree(ctx, x, y, h, col, sway) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway);
  gf(ctx, c => { c.moveTo(0, -h); for (let k = 0; k < 4; k++) { const yy = -h + (k + 1) * h * 0.24, w = h * (0.12 + k * 0.07); c.lineTo(w, yy); c.lineTo(w * 0.45, yy - h * 0.04); } c.lineTo(h * 0.04, 0); c.lineTo(-h * 0.04, 0);
    for (let k = 3; k >= 0; k--) { const yy = -h + (k + 1) * h * 0.24, w = h * (0.12 + k * 0.07); c.lineTo(-w * 0.45, yy - h * 0.04); c.lineTo(-w, yy); } c.closePath(); }, col, 0.5);
  ctx.restore();
}
// the car seen from above and behind, small: body, roof, beams along its heading
function car(ctx, x, y, ang, s, power) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const cl = Math.cos(ang), sl = Math.sin(ang), len = 230 * s;
  ctx.fillStyle = lin(ctx, x, y, x + cl * len, y + sl * len, [[0, rgba('#fff0d0', 0.45 * power)], [1, rgba('#ffd59a', 0)]]);
  ctx.beginPath(); ctx.moveTo(x - sl * 8 * s, y + cl * 8 * s); ctx.lineTo(x + cl * len - sl * 60 * s, y + sl * len + cl * 60 * s); ctx.lineTo(x + cl * len + sl * 60 * s, y + sl * len - cl * 60 * s); ctx.lineTo(x + sl * 8 * s, y - cl * 8 * s); ctx.closePath(); ctx.fill();
  ctx.restore();
  light(ctx, x + cl * len * 0.35, y + sl * len * 0.35, 90 * s, '#ffd59a', 0.35 * power);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(4,4,16,0.5)'; ctx.beginPath(); ctx.ellipse(-2, 3, 22, 12, 0, 0, Math.PI * 2); ctx.fill();
  gf(ctx, c => rr(c, -22, -10, 42, 20, 6), lin(ctx, 0, -10, 0, 10, [[0, '#6a5a9a'], [1, '#2a2450']]), 0.3);
  gf(ctx, c => rr(c, -12, -8, 20, 16, 4), lin(ctx, 0, -8, 0, 8, [[0, '#2a2650'], [1, '#141236']]), 0.3);
  ctx.fillStyle = '#ff6a5a'; ctx.fillRect(-23, -9, 3, 4); ctx.fillRect(-23, 5, 3, 4);
  ctx.fillStyle = '#fff4dc'; ctx.fillRect(18, -9, 3, 4); ctx.fillRect(18, 5, 3, 4);
  ctx.restore();
}

// static landscape layers are drawn once per sun state into offscreen canvases and cross-faded (keeps a frame cheap)
const CACHE = {};
function buildLayer(key, sun) {
  const cv = L.createCanvas(W + 400, H + 400), ctx = cv.getContext('2d'); ctx.translate(200, 200); ctx.offscreen = true;
  if (key === 'far') {
    const range = (pts, y1) => c => { curve(c, pts); c.lineTo(2200, y1); c.lineTo(-300, y1); c.closePath(); };
    gf(ctx, range([[-300, 500], [60, 462], [300, 486], [560, 452], [820, 492], [1080, 458], [1320, 478], [1520, 446], [1780, 470], [2200, 452]], 700), lin(ctx, 0, 0, W, 0, [[0, '#1d2655'], [0.55, '#3a2e62'], [1, mix('#55385e', '#8a4a5e', sun)]]), 0.4);
    gf(ctx, range([[-300, 545], [140, 520], [420, 548], [700, 530], [960, 556], [1200, 530], [1500, 540], [2200, 520]], 760), lin(ctx, 0, 0, W, 0, [[0, '#162048'], [0.6, '#2a2450'], [1, '#4a2e56']]), 0.45);
  } else if (key === 'valley') {
    gf(ctx, c => { curve(c, [[-300, 600], [100, 580], [380, 610], [640, 596], [900, 620], [1300, 610], [2200, 600]]); c.lineTo(2200, 1300); c.lineTo(-300, 1300); c.closePath(); },
      lin(ctx, 0, 580, 0, 1000, [[0, '#18234e'], [0.35, '#122a4e'], [1, '#081428']]), 0.5);
    gf(ctx, c => ribbon(c, LEFT), lin(ctx, 0, 760, 930, 740, [[0, '#1d4a66'], [0.7, '#33507a'], [1, '#4a4a7c']]), 0.45);
  } else {
    const hill = c => { curve(c, RIDGE); c.lineTo(2200, 1300); c.lineTo(760, 1300); c.closePath(); };
    gf(ctx, hill, lin(ctx, 1000, 460, 1300, 1000, [[0, mix('#4a3068', '#8a5068', sun)], [0.45, '#2c2552'], [1, '#121232']]), 0.55);
    ctx.save(); ctx.beginPath(); curve(ctx, RIDGE.slice(4)); ctx.strokeStyle = rgba('#ffc27c', 0.4 + 0.5 * sun); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.beginPath(); hill(ctx); ctx.clip(); light(ctx, 1650, 470, 700, C.amber, 0.18 + 0.3 * sun); ctx.restore();
    gf(ctx, c => { curve(c, [[-300, 1010], [200, 960], [560, 900], [780, 820], [900, 760], [960, 745], [1040, 760]]); c.lineTo(1220, 1300); c.lineTo(-300, 1300); c.closePath(); }, lin(ctx, 0, 750, 0, H, [[0, '#2a2858'], [1, '#0c0c26']]), 0.55);
    HOUSES.forEach(([x, y, s]) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      gf(ctx, c => { c.moveTo(-22, 2); c.lineTo(-22, -24); c.lineTo(0, -40); c.lineTo(22, -24); c.lineTo(22, 2); c.closePath(); }, '#1a1030', 0.4); ctx.restore(); });
    gf(ctx, c => ribbon(c, RIGHT), lin(ctx, 930, 726, 1590, 480, [[0, '#4a4a7c'], [0.6, mix('#8a6a84', '#c08070', sun)], [1, '#e8b080']]), 0.45);
    gf(ctx, c => ribbon(c, MAIN), lin(ctx, 0, 726, 0, 1100, [[0, '#4a4a7c'], [1, '#24244e']]), 0.45);
  }
  return cv;
}
function drawCached(ctx, key, sun) {
  const c0 = CACHE[key + 0] || (CACHE[key + 0] = buildLayer(key, 0));
  ctx.drawImage(c0, -200, -200);
  if (sun > 0.004 && key !== 'valley') { const c1 = CACHE[key + 1] || (CACHE[key + 1] = buildLayer(key, 1)); ctx.save(); ctx.globalAlpha = sun; ctx.drawImage(c1, -200, -200); ctx.restore(); }
}

function draw(ctx, t) {
  const z = lerp(1.06, 1.0, sm((t - T0) / (T1 - T0)));         // a slow pull out to the wide shot
  const dx = drift(t, 1, 81) * 6, dy = drift(t, 1, 82) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(FORK[0], FORK[1] - 120); ctx.scale(z, z); ctx.translate(-FORK[0] + dx * par, -FORK[1] + 120 + dy * par); fn(); ctx.restore(); };
  const sun = ease(clamp((t - T_DECIDE + 0.1) / 1.4)), dawn = 0.45 + 0.55 * sun;
  const fogAmt = 0.75 - 0.2 * sun;
  // sky: dawn already warming; on "decide" the sun clears the hill
  layer(0.15, () => {
    ctx.fillStyle = lin(ctx, 0, -100, 0, 620, [[0, mix('#0e1030', '#2a2a5a', sun)], [0.55, mix('#2a2458', '#6a4a7a', dawn)], [1, mix('#5a3a6a', '#e8946a', dawn)]]); ctx.fillRect(-300, -300, W + 600, 1000);
    glowE(ctx, 250, 560, 1100, 420, [[0, rgba('#0a6f8c', 0.28)], [1, 'rgba(10,111,140,0)']]);
    glowE(ctx, 1720, 520, 1400, 520, [[0, rgba('#ffb36a', 0.3 + 0.45 * sun)], [0.5, rgba('#d0705a', 0.14 + 0.2 * sun)], [1, 'rgba(160,80,90,0)']]);
    const CL = [[300, 250, 520, 0], [820, 180, 640, 1], [1380, 300, 700, 2], [1650, 210, 520, 3], [560, 370, 420, 4]];
    for (const [x0, y, w, k] of CL) {
      const x = x0 + (t - T0) * (8 + k * 3), warm = clamp((x - 600) / 900);
      ctx.save(); ctx.translate(x, y);
      gf(ctx, c => { c.moveTo(-w / 2, 0); c.bezierCurveTo(-w * 0.42, -22, -w * 0.3, -30, -w * 0.18, -22); c.bezierCurveTo(-w * 0.08, -46, w * 0.12, -48, w * 0.18, -26); c.bezierCurveTo(w * 0.28, -36, w * 0.42, -26, w / 2, 0); c.closePath(); },
        lin(ctx, 0, -46, 0, 0, [[0, 'rgba(40,34,80,0.6)'], [1, rgba(mix('#2a5a7a', '#ff9a6a', warm), 0.25 + 0.5 * dawn * warm)]]), 0.35);
      ctx.restore();
    }
    // the sun rises behind the hill: a disc, rays, and a warm bloom
    const sy = lerp(560, 452, sun);
    light(ctx, 1720, sy, 520, '#ffd9a0', 0.25 + 0.5 * sun);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 14; k++) { const a = -Math.PI + (k + 0.5) / 14 * Math.PI + 0.03 * Math.sin(t * 0.5 + k), r0 = 70, r1 = 380 + 120 * Math.sin(k * 2.3); ctx.strokeStyle = rgba('#ffe0b0', 0.06 * sun); ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(1720 + Math.cos(a) * r0, sy + Math.sin(a) * r0); ctx.lineTo(1720 + Math.cos(a) * r1, sy + Math.sin(a) * r1); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = '#fff0cc'; ctx.beginPath(); ctx.arc(1720, sy + 10, 46, 0, Math.PI * 2); ctx.fill();
    // birds crossing the light
    ctx.strokeStyle = '#2a1a30'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (const b of BIRDS) { const x = b.x + (t - T0) * b.sp, y = b.y + Math.sin(t + b.ph) * 6, f = Math.sin(t * 7 + b.ph) * 5; ctx.beginPath(); ctx.moveTo(x - 9, y - f); ctx.quadraticCurveTo(x - 4, y - 3, x, y); ctx.quadraticCurveTo(x + 4, y - 3, x + 9, y - f); ctx.stroke(); }
  });
  // ranges + valley (cached at sun 0 and sun 1, cross-faded)
  layer(0.25, () => drawCached(ctx, 'far', sun));
  layer(0.5, () => drawCached(ctx, 'valley', 0));
  // cold fog in the left valley, drifting
  layer(0.6, () => {
    const rf = rng(8);
    for (let k = 0; k < 9; k++) { const bx = rf() * 950 - 150, by = 640 + rf() * 260, r = 220 + rf() * 200, sp = 10 + rf() * 18;
      const x = bx + ((t * sp + rf() * 200) % 300) - 150 + Math.sin(t * 0.4 + k) * 30;
      glowE(ctx, x, by, r, r * 0.36, [[0, rgba('#6cc4de', 0.16 * fogAmt)], [0.6, rgba('#3a8aa8', 0.06 * fogAmt)], [1, 'rgba(58,138,168,0)']]); }
    light(ctx, 380, 790, 520, C.cyanD, 0.24 * fogAmt);
  });
  layer(0.5, () => {
    drawCached(ctx, 'land', sun);
    HOUSES.forEach(([x, y, s], i) => {
      ctx.fillStyle = rgba('#ffcf8a', 0.9 * (0.94 + 0.06 * Math.sin(t * 7 + i))); ctx.fillRect(x - 13 * s, y - 18 * s, 9 * s, 9 * s); ctx.fillRect(x + 4 * s, y - 18 * s, 9 * s, 9 * s);
      light(ctx, x, y - 12 * s, 60, C.amber, 0.4);
    });
    ctx.save(); ctx.beginPath(); ribbon(ctx, RIGHT); ctx.clip(); light(ctx, 1500, 520, 460, C.amber, 0.25 + 0.35 * sun); ctx.restore();
  });
  // the car: up the main road, slowing at the fork, then right on "decide"
  layer(0.6, () => {
    let p;
    if (t < T_DECIDE) { const u = lerp(0.18, 0.985, out(clamp((t - T0) / (T_DECIDE - 0.3 - T0)))); p = along(MAIN, u); }
    else { const u = 0.02 + 0.26 * ease(clamp((t - T_DECIDE) / (T1 - T_DECIDE + 0.6))); p = along(RIGHT, u); }
    // turning: blend the heading through the fork
    let ang = p[3];
    if (t >= T_DECIDE - 0.3 && t < T_DECIDE + 0.5) { const k = sm((t - T_DECIDE + 0.3) / 0.8); ang = lerp(along(MAIN, 0.99)[3], along(RIGHT, 0.06)[3], k); }
    const s = lerp(0.62, 1.5, clamp((p[1] - 700) / 380));
    car(ctx, p[0], p[1], ang, s, 1);
  });
  layer(1.0, () => {
    gf(ctx, c => { c.moveTo(-200, 860); curve(c, [[-200, 860], [200, 900], [520, 980], [760, 1060], [800, 1200]], false); c.lineTo(-200, 1200); c.closePath(); }, lin(ctx, 0, 860, 0, H, [[0, '#101634'], [1, '#05061a']]), 0.6);
    gf(ctx, c => { c.moveTo(2120, 820); curve(c, [[2120, 820], [1700, 900], [1400, 990], [1220, 1100], [1200, 1200]], false); c.lineTo(2120, 1200); c.closePath(); }, lin(ctx, 0, 820, 0, H, [[0, '#1e163c'], [1, '#06061a']]), 0.6);
    TREES.forEach((tr, i) => tree(ctx, tr.x, tr.y, tr.h, tr.x < 700 ? '#0a1028' : '#140c26', drift(t, 1.4, i) * 0.02));
  });
}

module.exports = { T0, T1, draw };
