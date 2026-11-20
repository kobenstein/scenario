// "One goes badly. One goes a lot better."
// High view of a road splitting at a fork: left it winds down into cold cyan fog, right it climbs over a hill
// toward a warm dawn with a few lit houses. A small figure with a lantern stands at the fork, then steps right.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, out } = L;
const { figure } = require('./s_timeline');

const T0 = 51.0, T1 = 54.55;

let PAT = null;
function grainFill(ctx, pathFn, fill, grain = 0.5, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat');
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-300, -300, W + 600, H + 600);
  }
  ctx.restore();
}
// smooth closed/open curve through points (midpoint quadratic)
function curve(c, pts, move = true) {
  if (move) c.moveTo(pts[0][0], pts[0][1]); else c.lineTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) { const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]; c.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]); }
  const e = pts[pts.length - 1]; c.lineTo(e[0], e[1]);
}
// a road as a ribbon along a centreline of [x, y, width]
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
// point at fraction u along a polyline centreline
function along(pts, u) {
  const seg = []; let tot = 0;
  for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(d); tot += d; }
  let d = clamp(u) * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const k = d / seg[i]; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), lerp(pts[i][2], pts[i + 1][2], k)]; } d -= seg[i]; }
  return pts[pts.length - 1];
}

const FORK = [930, 726];
const MAIN = [[1040, 1140, 330], [1000, 990, 200], [960, 850, 110], [936, 760, 58], [930, 726, 46]];
const RIGHT = [[930, 726, 46], [1040, 700, 38], [1150, 660, 30], [1230, 628, 24], [1300, 612, 20], [1390, 572, 15], [1470, 532, 11], [1540, 500, 8], [1590, 482, 5]];
const LEFT = [[930, 726, 46], [830, 748, 40], [720, 736, 34], [620, 758, 30], [560, 800, 27], [460, 812, 24], [360, 790, 20], [270, 812, 17], [170, 850, 14], [60, 870, 11]];
const RIDGE = [[760, 820], [900, 760], [1060, 690], [1200, 620], [1330, 560], [1450, 508], [1560, 476], [1680, 462], [1800, 470], [1920, 488], [2100, 500]];
const HOUSES = [[1395, 520, 1.0], [1470, 497, 0.85], [1600, 470, 0.8], [1690, 466, 0.9], [1790, 472, 0.75]];
const R = rng(51);
const TREES = Array.from({ length: 16 }, (_, i) => ({ x: i < 9 ? 20 + R() * 640 : 1250 + R() * 640, y: 0, h: 50 + R() * 90, k: R() }));
TREES.forEach(tr => { tr.y = tr.x < 700 ? 960 + R() * 120 : 900 + R() * 170; tr.h *= tr.y / 900; });
const STARS = Array.from({ length: 80 }, () => [R() * W, R() * 360, R()]);

function tree(ctx, x, y, h, col, sway) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway);
  grainFill(ctx, c => { c.moveTo(0, -h); for (let k = 0; k < 4; k++) { const yy = -h + (k + 1) * h * 0.24, w = h * (0.12 + k * 0.07); c.lineTo(w, yy); c.lineTo(w * 0.45, yy - h * 0.04); } c.lineTo(h * 0.04, 0); c.lineTo(-h * 0.04, 0);
    for (let k = 3; k >= 0; k--) { const yy = -h + (k + 1) * h * 0.24, w = h * (0.12 + k * 0.07); c.lineTo(-w * 0.45, yy - h * 0.04); c.lineTo(-w, yy); } c.closePath(); }, col, 0.5, [-h, -h * 1.1, 2 * h, h * 1.2]);
  ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.09, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 7) * 6, dy = drift(t, 1, 8) * 4;
  // the camera leans gently toward the fork
  const layer = (par, fn) => { ctx.save(); ctx.translate(FORK[0], FORK[1] - 120); ctx.scale(z, z); ctx.translate(-FORK[0] + dx * par, -FORK[1] + 120 + dy * par); fn(); ctx.restore(); };
  const bad = ramp(t, 51.4, 51.9), badDecay = 1 - 0.45 * ramp(t, 52.1, 53.2);
  const fogAmt = 0.65 + 0.55 * bad * badDecay;
  const dawn = ramp(t, 52.7, 53.6), dawn0 = 0.18 + 0.82 * dawn;
  const flick = 0.9 + 0.1 * Math.sin(t * 9) * Math.sin(t * 3.3);

  // sky
  layer(0.15, () => {
    ctx.fillStyle = lin(ctx, 0, -100, 0, 620, [[0, '#070920'], [0.55, '#14153c'], [1, '#2b2558']]); ctx.fillRect(-300, -300, W + 600, 1000);
    const glow = (x, y, rx, ry, stops) => { ctx.save(); ctx.translate(x, y); ctx.scale(rx / ry, 1); ctx.fillStyle = rad(ctx, 0, 0, 0, ry, stops); ctx.fillRect(-ry, -ry, 2 * ry, 2 * ry); ctx.restore(); };
    glow(250, 560, 1100, 420, [[0, rgba('#0a6f8c', 0.32)], [1, 'rgba(10,111,140,0)']]);
    for (const [x, y, k] of STARS) { const a = (0.25 + 0.35 * Math.sin(t * (1 + k * 2) + k * 9)) * (1 - (x / W) * (0.3 + dawn * 0.7)); if (a <= 0) continue; ctx.fillStyle = rgba(C.cream, a * (1 - y / 420)); ctx.fillRect(x, y, 2, 2); }
    // dawn: a wide warm glow behind the right hills that rises on "better"
    glow(1720, 520, 1300, 460, [[0, rgba('#ff9a4a', 0.22 + 0.5 * dawn)], [0.5, rgba('#c0604a', 0.10 + 0.22 * dawn)], [1, 'rgba(120,60,90,0)']]);
    // long thin clouds: lit warm underneath on the right, cold on the left
    const CL = [[300, 250, 520, 0], [820, 180, 640, 1], [1380, 300, 700, 2], [1650, 210, 520, 3], [560, 370, 420, 4]];
    for (const [x0, y, w, k] of CL) {
      const x = x0 + ((t - T0) * (8 + k * 3)), warm = clamp((x - 700) / 900);
      const top = lerp(0.06, 0.05, warm), col = warm > 0.4 ? rgba('#ff9a6a', (0.10 + 0.32 * dawn) * warm) : rgba('#4a9ab8', 0.10 * (1 - warm));
      ctx.save(); ctx.translate(x, y);
      const cloud = c => { c.moveTo(-w / 2, 0); c.bezierCurveTo(-w * 0.42, -22, -w * 0.3, -30, -w * 0.18, -22); c.bezierCurveTo(-w * 0.08, -46, w * 0.12, -48, w * 0.18, -26); c.bezierCurveTo(w * 0.28, -36, w * 0.42, -26, w / 2, 0); c.closePath(); };
      grainFill(ctx, cloud, lin(ctx, 0, -46, 0, 0, [[0, 'rgba(26,26,68,0.55)'], [1, warm > 0.4 ? rgba('#c86a5a', (0.15 + 0.45 * dawn) * warm) : rgba('#2a5a7a', 0.35 * (1 - warm))]]), 0.35, [-w / 2, -50, w, 54]);
      ctx.restore();
    }
    const sy = lerp(540, 490, dawn);
    light(ctx, 1720, sy, 360, '#ffd9a0', 0.12 + 0.5 * dawn);
    ctx.fillStyle = rgba('#ffe6b8', 0.5 + 0.5 * dawn); ctx.beginPath(); ctx.arc(1720, sy + 20, 40, 0, Math.PI * 2); ctx.fill();
  });

  // far hills, two ranges
  layer(0.25, () => {
    const range = (pts, y1) => c => { curve(c, pts); c.lineTo(2200, y1); c.lineTo(-300, y1); c.closePath(); };
    const A = range([[-300, 500], [60, 462], [300, 486], [560, 452], [820, 492], [1080, 458], [1320, 478], [1520, 446], [1780, 470], [2200, 452]], 700);
    grainFill(ctx, A, lin(ctx, 0, 0, W, 0, [[0, '#1d2655'], [0.55, '#2c2a5e'], [1, '#55385e']]), 0.4);
    ctx.save(); ctx.beginPath(); A(ctx); ctx.clip(); light(ctx, 1720, 470, 500, C.amber, 0.08 + 0.28 * dawn); ctx.restore();
    const B = range([[-300, 545], [140, 520], [420, 548], [700, 530], [960, 556], [1200, 530], [1500, 540], [2200, 520]], 760);
    grainFill(ctx, B, lin(ctx, 0, 0, W, 0, [[0, '#162048'], [0.6, '#211f4c'], [1, '#3a2a52']]), 0.45);
    // mist sitting in the far valley, left
    for (let k = 0; k < 4; k++) { const x = 200 + k * 220 + Math.sin(t * 0.3 + k) * 30; ctx.save(); ctx.translate(x, 545); ctx.scale(2.2, 1); ctx.fillStyle = rad(ctx, 0, 0, 0, 120, [[0, rgba(C.cyan, 0.12 * fogAmt)], [1, rgba(C.cyan, 0)]]); ctx.fillRect(-120, -120, 240, 240); ctx.restore(); }
  });

  // the land: valley floor, right hill, near bank, roads
  layer(0.5, () => {
    // valley floor to the left, sinking into the cold
    grainFill(ctx, c => { curve(c, [[-300, 600], [100, 580], [380, 610], [640, 596], [900, 620], [1300, 610], [2200, 600]]); c.lineTo(2200, 1300); c.lineTo(-300, 1300); c.closePath(); },
      lin(ctx, 0, 580, 0, 1000, [[0, '#18234e'], [0.35, '#122a4e'], [1, '#081428']]), 0.5);
    // soft mist where the valley meets the far range
    ctx.save(); ctx.translate(500, 600); ctx.scale(4, 1); ctx.fillStyle = rad(ctx, 0, 0, 0, 160, [[0, rgba('#4aa6c4', 0.16 * fogAmt)], [1, 'rgba(74,166,196,0)']]); ctx.fillRect(-160, -160, 320, 320); ctx.restore();
    // the left road winds down into the valley
    grainFill(ctx, c => ribbon(c, LEFT), lin(ctx, 0, 760, 930, 740, [[0, '#1d4a66'], [0.7, '#33507a'], [1, '#4a4a7c']]), 0.45);
    // a cold pulse runs down the left road on "badly"
    const pu = (t - 51.45) / 0.9;
    if (pu > 0 && pu < 1.3) for (let k = 0; k < 7; k++) { const p = along(LEFT, pu - k * 0.025); light(ctx, p[0], p[1], 30 + p[2] * 1.4, C.cyan, 0.55 * (1 - k / 7) * (1 - clamp((pu - 0.8) / 0.5))); }
  });

  // fog in the left valley: drifting banks that swell on "badly"
  layer(0.6, () => {
    const rf = rng(8);
    for (let k = 0; k < 10; k++) {
      const bx = rf() * 950 - 150, by = 640 + rf() * 260, r = (220 + rf() * 200) * (0.9 + 0.4 * bad * badDecay), sp = 10 + rf() * 18;
      const x = bx + ((t * sp + rf() * 200) % 300) - 150 + Math.sin(t * 0.4 + k) * 30;
      ctx.save(); ctx.translate(x, by); ctx.scale(1, 0.36);
      ctx.fillStyle = rad(ctx, 0, 0, 0, r, [[0, rgba('#6cc4de', 0.17 * fogAmt)], [0.6, rgba('#3a8aa8', 0.07 * fogAmt)], [1, 'rgba(58,138,168,0)']]);
      ctx.fillRect(-r, -r, 2 * r, 2 * r); ctx.restore();
    }
    light(ctx, 380, 790, 560, C.cyanD, 0.28 * fogAmt * flick);
    light(ctx, 330, 800, 300 + 160 * bad, C.cyan, 0.06 + 0.18 * bad * badDecay);
  });

  layer(0.5, () => {
    // right hill climbing to the ridge
    const hill = c => { curve(c, RIDGE); c.lineTo(2200, 1300); c.lineTo(760, 1300); c.closePath(); };
    grainFill(ctx, hill, lin(ctx, 1000, 460, 1300, 1000, [[0, '#3c3068'], [0.45, '#272352'], [1, '#121232']]), 0.55);
    ctx.save(); ctx.beginPath(); curve(ctx, RIDGE.slice(5)); ctx.strokeStyle = rgba('#ffc27c', 0.12 + 0.6 * dawn); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.beginPath(); hill(ctx); ctx.clip(); light(ctx, 1650, 470, 650, C.amber, 0.06 + 0.26 * dawn);
    // hedgerows across the hill
    ctx.restore();
    // near bank under the main road, its edge dropping off into the valley
    const bank = c => { curve(c, [[-300, 1010], [200, 960], [560, 900], [780, 820], [900, 760], [960, 745], [1040, 760]]); c.lineTo(1220, 1300); c.lineTo(-300, 1300); c.closePath(); };
    grainFill(ctx, bank, lin(ctx, 0, 750, 0, H, [[0, '#2a2858'], [1, '#0c0c26']]), 0.55);
    ctx.save(); ctx.beginPath(); curve(ctx, [[-300, 1010], [200, 960], [560, 900], [780, 820], [900, 760], [960, 745]]); ctx.strokeStyle = rgba(C.cyan, 0.18); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    // houses on the ridge: windows light one by one on "better"
    HOUSES.forEach(([x, y, s], i) => {
      const lit = ramp(t, 52.8 + i * 0.17, 52.95 + i * 0.17);
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      grainFill(ctx, c => { c.moveTo(-22, 2); c.lineTo(-22, -24); c.lineTo(0, -40); c.lineTo(22, -24); c.lineTo(22, 2); c.closePath(); }, '#0e0c26', 0.4, [-30, -45, 60, 50]);
      ctx.fillStyle = rgba('#ffcf8a', 0.05 + 0.95 * lit * (0.94 + 0.06 * Math.sin(t * 7 + i))); ctx.fillRect(-13, -18, 9, 9); ctx.fillRect(4, -18, 9, 9);
      ctx.restore();
      light(ctx, x, y - 12 * s, 70, C.amber, 0.55 * lit);
    });
    // small round trees along the right road, catching the dawn on their right side
    for (const [x, y, sc] of [[1050, 760, 1.0], [1190, 712, 0.85], [1265, 680, 0.75], [1420, 600, 0.6], [1500, 560, 0.5], [1250, 790, 1.1], [1660, 520, 0.45]]) {
      ctx.save(); ctx.translate(x, y + Math.sin(t + x) * 0.5); ctx.scale(sc, sc);
      ctx.fillStyle = '#0a0920'; ctx.fillRect(-2, -14, 4, 16);
      const crown = c => { c.arc(0, -30, 20, 0, Math.PI * 2); c.moveTo(20, -22); c.arc(10, -22, 13, 0, Math.PI * 2); };
      grainFill(ctx, crown, '#0e0c28', 0.4, [-30, -55, 60, 60]);
      ctx.save(); ctx.beginPath(); crown(ctx); ctx.clip(); ctx.fillStyle = rgba('#ffb35c', 0.08 + 0.32 * dawn); ctx.beginPath(); ctx.arc(0, -30, 21, 0, Math.PI * 2); ctx.arc(-7, -27, 21, 0, Math.PI * 2, true); ctx.fill(); ctx.restore();
      ctx.fillStyle = 'rgba(5,5,20,0.35)'; ctx.beginPath(); ctx.ellipse(-16, 2, 20, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // telephone poles up the right road, wires sagging between them
    const poles = [[1120, 645, 1.0], [1310, 580, 0.75], [1480, 512, 0.55], [1610, 472, 0.42]];
    ctx.strokeStyle = '#0a0a1e'; ctx.lineCap = 'round';
    poles.forEach(([x, y, s]) => { ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 120 * s); ctx.stroke(); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(x - 22 * s, y - 110 * s); ctx.lineTo(x + 22 * s, y - 110 * s); ctx.stroke(); });
    ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(10,10,30,0.8)';
    for (let k = 0; k < poles.length - 1; k++) for (const o of [-1, 1]) { const [x0, y0, s0] = poles[k], [x1, y1, s1] = poles[k + 1]; ctx.beginPath(); ctx.moveTo(x0 + o * 20 * s0, y0 - 110 * s0); ctx.quadraticCurveTo((x0 + x1) / 2, (y0 - 110 * s0 + y1 - 110 * s1) / 2 + 14, x1 + o * 20 * s1, y1 - 110 * s1); ctx.stroke(); }
    // roads
    grainFill(ctx, c => ribbon(c, RIGHT), lin(ctx, 930, 726, 1590, 480, [[0, '#4a4a7c'], [0.6, '#8a6a84'], [1, '#d8a070']]), 0.45);
    grainFill(ctx, c => ribbon(c, MAIN), lin(ctx, 0, 726, 0, 1100, [[0, '#4a4a7c'], [1, '#24244e']]), 0.45);
    ctx.save(); ctx.beginPath(); ribbon(ctx, RIGHT); ctx.clip(); light(ctx, 1500, 520, 460, C.amber, 0.10 + 0.4 * dawn); ctx.restore();
  });

  // the figure with the lantern at the fork, stepping toward the right road on "better"
  layer(0.6, () => {
    const w = ramp(t, 52.75, 53.75), walking = w > 0 && w < 1;
    const p = along(RIGHT, 0.02 + 0.075 * w);
    const ph = (t - 52.75) * 2 * Math.PI * 1.6, swing = walking ? Math.sin(ph) : 0, bob = walking ? Math.abs(Math.cos(ph)) * 1.5 : 0;
    const s = 0.24, x = lerp(FORK[0] - 6, p[0], 1) , y = lerp(FORK[1] - 2, p[1] - 2, 1) - 52 * 0.75 * s * 4.4 + 0;
    // hip height above the feet: thigh + shin ~ 154*s
    const hipY = (walking ? p[1] : lerp(FORK[1] - 2, p[1], w)) - 150 * s - bob;
    const hipX = walking ? p[0] : lerp(FORK[0] - 6, p[0], w);
    // long shadow away from the dawn, cold fog light on the left side
    ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#05061a'; ctx.beginPath(); ctx.ellipse(hipX - 18, hipY + 150 * s + 3, 22, 4, -0.1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    const br = Math.sin(t * 1.8);
    const leg = (sgn) => ({ a1: Math.PI / 2 + sgn * swing * 0.32, a2: Math.PI / 2 + sgn * swing * 0.32 + Math.max(0, -sgn * swing) * 0.5 });
    const look = ramp(t, 52.6, 53.0);
    const res = figure(ctx, { x: hipX, y: hipY, s, facing: 'back', br, lean: 0.02 + walking * 0.04, turn: lerp(-0.35 + 0.15 * Math.sin(t * 0.8), 0.5, look), tilt: 0, lx: 1, grain: 0.3,
      rim: C.cyan, rimA: 0.6, rimDx: -1.5, rimDy: -0.5, pal: ['#ffb35c', '#c9702e', '#5a2a12'],
      legs: [leg(1), leg(-1)], arms: [{ a1: Math.PI / 2 + 0.15 - swing * 0.25, a2: Math.PI / 2 + 0.05 - swing * 0.2 }, { a1: Math.PI / 2 - 0.35, a2: Math.PI / 2 - 0.7 }] });
    // lantern on a short handle, swinging from the hand
    const hd = res.hands[1], sw = Math.sin(t * 2.6) * 0.28 + swing * 0.25, len = 12;
    const lx = hd[0] + Math.sin(sw) * len, ly = hd[1] + Math.cos(sw) * len;
    ctx.strokeStyle = '#2a1408'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hd[0], hd[1]); ctx.lineTo(lx, ly); ctx.stroke();
    ctx.save(); ctx.translate(lx, ly); ctx.rotate(-sw * 0.5);
    ctx.fillStyle = '#1a0d06'; ctx.fillRect(-5, 0, 10, 3); ctx.fillRect(-5, 13, 10, 3);
    ctx.fillStyle = '#ffd38a'; ctx.fillRect(-4, 3, 8, 10);
    ctx.restore();
    light(ctx, lx, ly + 8, 90, C.amber, 0.75 * flick);
    light(ctx, lx, ly + 8, 26, '#ffe6b8', 0.6 * flick);
    // the lantern lights a patch of road around the feet
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, lx, hipY + 150 * s, 0, 70, [[0, rgba(C.amber, 0.22)], [1, rgba(C.amber, 0)]]);
    ctx.scale(1, 1); ctx.fillRect(lx - 70, hipY + 150 * s - 70, 140, 140); ctx.restore();
  });

  // foreground: banks, trees, grass, framing the view
  layer(1.0, () => {
    grainFill(ctx, c => { c.moveTo(-200, 860); curve(c, [[-200, 860], [200, 900], [520, 980], [760, 1060], [800, 1200]], false); c.lineTo(-200, 1200); c.closePath(); }, lin(ctx, 0, 860, 0, H, [[0, '#101634'], [1, '#05061a']]), 0.6);
    grainFill(ctx, c => { c.moveTo(2120, 820); curve(c, [[2120, 820], [1700, 900], [1400, 990], [1220, 1100], [1200, 1200]], false); c.lineTo(2120, 1200); c.closePath(); }, lin(ctx, 0, 820, 0, H, [[0, '#18143a'], [1, '#06061a']]), 0.6);
    TREES.forEach((tr, i) => tree(ctx, tr.x, tr.y, tr.h, tr.x < 700 ? '#0a1028' : '#0d0a22', drift(t, 1.4, i) * 0.02));
    // grass tufts on the banks
    ctx.strokeStyle = '#0b0c22'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    const rg = rng(4);
    for (let k = 0; k < 70; k++) { const left = k < 35, x = left ? rg() * 700 : 1250 + rg() * 700, y = left ? 920 + (x / 700) * 60 + rg() * 100 : 1000 - (x - 1250) * 0.15 + rg() * 90, h = 10 + rg() * 22, s = drift(t, 2, k) * 3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s, y - h * 0.6, x + s * 2 + (rg() - 0.5) * 8, y - h); ctx.stroke(); }
  });
}

module.exports = { T0, T1, draw };
