// "It's happened before. In 1985, scientists found a hole in the ozone layer."
// Antarctic twilight. A small research hut with a warm window, an anemometer spinning on its mast. Two scientists in
// parkas by an instrument on a tripod; one lets a weather balloon go. On "scientists" they look up, and the camera
// tilts up with the balloon into a sky where a thin violet veil hangs, with a dark gap opening above them.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, stamp, out, ease } = L;

const T0 = 514.70, T1 = 517.60;

let PAT = null;
function gf(ctx, pathFn, fill, grain = 0.45, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) { if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat'); ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-300, -1200, W + 600, H + 1500); }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}

const HZ = 690;
function skyArt(c) {
  gf(c, cc => cc.rect(-100, -1300, W + 200, HZ + 1320), lin(c, 0, -1300, 0, HZ, [[0, '#05061a'], [0.45, '#0e0f34'], [0.75, '#2a2260'], [0.92, '#5a4a8a'], [1, '#9a86c0']]), 0.5);
  const r = rng(12);
  for (let i = 0; i < 300; i++) { const x = r() * W, y = -1300 + r() * 1700, s = r(); c.fillStyle = rgba('#e6e2f8', 0.15 + 0.5 * s * (1 - clamp((y - 100) / 500))); c.fillRect(x, y, 1 + s * 1.5, 1 + s * 1.5); }
  // far ice shelf and low mountains
  gf(c, cc => { cc.moveTo(-100, HZ); for (let x = -100; x <= W + 100; x += 60) cc.lineTo(x, HZ - 18 - 30 * Math.abs(Math.sin(x * 0.004)) - 22 * Math.abs(Math.sin(x * 0.013 + 1))); cc.lineTo(W + 100, HZ); cc.closePath(); }, lin(c, 0, HZ - 70, 0, HZ, [[0, '#8a7cb8'], [1, '#5e5290']]), 0.4);
}
function iceArt(c) {
  gf(c, cc => cc.rect(-100, HZ, W + 200, H - HZ + 200), lin(c, 0, HZ, 0, H + 100, [[0, '#b9b0dc'], [0.35, '#8a80bc'], [1, '#3a3270']]), 0.45);
  // sastrugi: wind-carved ridges
  const r = rng(71);
  for (let i = 0; i < 60; i++) { const y = HZ + 10 + Math.pow(r(), 1.6) * 420, x = r() * W, w = 60 + r() * 260 * (y - HZ) / 300;
    c.strokeStyle = rgba(r() < 0.5 ? '#ffffff' : '#3a3270', 0.12 + r() * 0.12); c.lineWidth = 1 + (y - HZ) / 160; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + w / 2, y - 3 - r() * 4, x + w, y + 1); c.stroke(); }
}
// the hut: a raised box on stilts, warm window, door, mast
const HUT = { x: 1260, y: HZ + 40, w: 300, h: 130 };
function hutArt(c) {
  const { x, y, w, h } = HUT;
  c.fillStyle = 'rgba(40,30,80,0.35)'; c.beginPath(); c.ellipse(x + w / 2 + 30, y + 6, w * 0.75, 16, 0, 0, 7); c.fill();
  for (const sx of [x + 20, x + w - 34, x + w / 2 - 8]) gf(c, cc => cc.rect(sx, y - 28, 14, 30), '#2a1a28', 0.3);
  gf(c, cc => { cc.moveTo(x, y - 28); cc.lineTo(x, y - 28 - h); cc.lineTo(x + w, y - 28 - h - 10); cc.lineTo(x + w, y - 28); cc.closePath(); }, lin(c, x, 0, x + w, 0, [[0, '#ffb35c'], [0.6, '#c9702e'], [1, '#7a3b17']]), 0.45);
  // roof with snow
  gf(c, cc => { cc.moveTo(x - 14, y - 28 - h); cc.lineTo(x + w + 14, y - 28 - h - 12); cc.lineTo(x + w + 14, y - 28 - h - 26); cc.quadraticCurveTo(x + w / 2, y - h - 66, x - 14, y - 28 - h - 14); cc.closePath(); }, lin(c, 0, y - h - 60, 0, y - h - 20, [[0, '#f3efff'], [1, '#b9b0dc']]), 0.3);
  // panel seams
  c.strokeStyle = 'rgba(90,40,18,0.5)'; c.lineWidth = 2; for (let k = 1; k < 5; k++) { const px = x + k * w / 5; c.beginPath(); c.moveTo(px, y - 28); c.lineTo(px, y - 28 - h - 2 * k); c.stroke(); }
  // door
  gf(c, cc => cc.rect(x + 34, y - 28 - 100, 50, 100), '#5a2a12', 0.4);
  // steps
  gf(c, cc => { cc.rect(x + 28, y - 28, 62, 8); cc.rect(x + 20, y - 14, 76, 8); }, '#3a2034', 0.3);
  // mast
  gf(c, cc => cc.rect(x + w - 60, y - 28 - h - 190, 6, 190), '#2a2050', 0.3);
}
function hutWindow(ctx, t) {
  const { x, y, h } = HUT, fl = 0.92 + 0.08 * Math.sin(t * 2.3) * Math.sin(t * 0.9);
  const wx = x + 150, wy = y - 28 - h + 34;
  ctx.fillStyle = '#fff1cf'; ctx.fillRect(wx, wy, 90, 56);
  ctx.fillStyle = 'rgba(122,59,23,0.85)'; ctx.fillRect(wx + 43, wy, 4, 56); ctx.fillRect(wx, wy + 26, 90, 4);
  // a figure moving inside
  const px = wx + 20 + 40 * (0.5 + 0.5 * Math.sin(t * 0.7));
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, 90, 56); ctx.clip(); ctx.fillStyle = 'rgba(122,59,23,0.55)'; ctx.beginPath(); ctx.ellipse(px, wy + 24, 9, 11, 0, 0, 7); ctx.fill(); ctx.fillRect(px - 15, wy + 34, 30, 30); ctx.restore();
  light(ctx, wx + 45, wy + 28, 260, '#ffb35c', 0.45 * fl);
  light(ctx, wx + 45, wy + 28, 60, '#ffe2a8', 0.5 * fl);
  // light on the snow under the window
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(wx + 45, y + 30); ctx.scale(1, 0.18);
  ctx.fillStyle = rad(ctx, 0, 0, 0, 240, [[0, rgba('#ffb35c', 0.28 * fl)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(-240, -240, 480, 480); ctx.restore();
  // anemometer spinning on the mast
  const mx = x + HUT.w - 57, my = y - 28 - h - 190;
  for (let k = 0; k < 3; k++) { const a = t * 9 + k * 2.094, ex = mx + Math.cos(a) * 26, ey = my + Math.sin(a) * 6;
    ctx.strokeStyle = '#2a2050'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.fillStyle = Math.sin(a) > 0 ? '#3a3270' : '#2a2050'; ctx.beginPath(); ctx.arc(ex, ey, 7, 0, 7); ctx.fill(); }
  // red beacon blinking on top
  if ((t * 0.8) % 1 < 0.15) light(ctx, mx, my - 8, 40, '#ff8a5c', 0.8);
  // chimney vapour
  for (let k = 0; k < 5; k++) { const ph = (t * 0.25 + k / 5) % 1, vx = x + 60 + ph * 120 + Math.sin(ph * 6 + k) * 10, vy = y - 28 - h - 30 - ph * 160;
    ctx.fillStyle = rad(ctx, vx, vy, 0, 20 + ph * 40, [[0, rgba('#e6e2f8', 0.18 * Math.sin(ph * Math.PI))], [1, rgba('#e6e2f8', 0)]]); ctx.fillRect(vx - 70, vy - 70, 140, 140); }
}

// a scientist in a parka; facing: -1 left, 1 right. look: 0 ahead, 1 up. arm: raised hand target (or null)
function parka(ctx, x, y, s, t, o) {
  const br = Math.sin(t * 1.6 + o.ph) * 1.5, look = o.look || 0, f = o.face;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
  const box = [-120, -300, 240, 320];
  ctx.fillStyle = 'rgba(30,24,70,0.35)'; ctx.beginPath(); ctx.ellipse(10, 2, 70, 9, 0, 0, 7); ctx.fill();
  // boots and legs
  gf(ctx, c => { c.rect(-30, -60, 24, 56); c.rect(6, -60, 24, 56); }, '#2a1a28', 0.4, box);
  gf(ctx, c => { c.ellipse(-16, -4, 22, 9, 0, 0, 7); c.ellipse(22, -4, 22, 9, 0, 0, 7); }, '#140c18', 0, box);
  // far arm
  const sh = [-6, -170 + br];
  const fa = o.armFar || [30, -100];
  gf(ctx, c => { cap(c, sh[0] - 10, sh[1] + 6, fa[0] - 10, (sh[1] + fa[1]) / 2 + 20, 18, 16); cap(c, fa[0] - 10, (sh[1] + fa[1]) / 2 + 20, fa[0], fa[1], 16, 13); }, '#9a4c1c', 0.45, box);
  // parka body: bulky, to the knees, with a hem
  gf(ctx, c => { c.moveTo(-52, -54); c.bezierCurveTo(-60, -120, -58, -170 + br, -34, -190 + br); c.quadraticCurveTo(0, -204 + br, 34, -190 + br); c.bezierCurveTo(56, -170 + br, 62, -110, 54, -54); c.quadraticCurveTo(0, -44, -52, -54); c.closePath(); },
    lin(ctx, -50, -200, 50, -50, [[0, '#ffc27c'], [0.45, '#e08a42'], [1, '#8a451c']]), 0.45, box);
  ctx.strokeStyle = 'rgba(90,40,18,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(4, -186 + br); ctx.lineTo(6, -52); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-50, -120); ctx.quadraticCurveTo(0, -112, 52, -120); ctx.stroke();
  // hood with fur ruff; faceless dark opening, tilts back as they look up
  ctx.save(); ctx.translate(6, -206 + br); ctx.rotate(-0.55 * look);
  gf(ctx, c => c.ellipse(0, -26, 40, 44, 0, 0, 7), lin(ctx, -40, -70, 40, 20, [[0, '#ffb35c'], [1, '#9a4c1c']]), 0.45, box);
  for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; gf(ctx, c => c.arc(14 + Math.cos(a) * 22, -24 + Math.sin(a) * 27, 8, 0, 7), k % 2 ? '#e9dcc0' : '#cbbca0', 0, box); }
  gf(ctx, c => c.ellipse(16, -24, 17, 21, 0, 0, 7), '#2a1410', 0, box);
  ctx.restore();
  // near arm
  const na = o.armNear || [44, -90];
  gf(ctx, c => { cap(c, 16, -168 + br, (16 + na[0]) / 2 + 14, (-168 + na[1]) / 2 + 10, 19, 17); cap(c, (16 + na[0]) / 2 + 14, (-168 + na[1]) / 2 + 10, na[0], na[1], 17, 14); }, lin(ctx, 0, -170, 0, -60, [[0, '#ffb35c'], [1, '#b0602a']]), 0.45, box);
  gf(ctx, c => c.ellipse(na[0], na[1], 14, 12, 0, 0, 7), '#3a1a0c', 0, box);
  if (o.clip) { gf(ctx, c => { c.save(); c.translate(na[0] + 8, na[1] - 26); c.rotate(-0.4); c.rect(-20, -26, 40, 52); c.restore(); }, '#e9e2cc', 0.2, box); }
  ctx.restore();
}

// the instrument: a box on a tripod with a small glowing readout
function instrument(ctx, t) {
  const x = 700, y = 820;
  ctx.strokeStyle = '#2a2050'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (const dx of [-40, 0, 40]) { ctx.beginPath(); ctx.moveTo(x, y - 100); ctx.lineTo(x + dx, y); ctx.stroke(); }
  ctx.save(); ctx.translate(x, y - 120); ctx.rotate(-0.18);
  gf(ctx, c => { c.rect(-60, -40, 120, 60); }, lin(ctx, 0, -40, 0, 20, [[0, '#5a4a8a'], [1, '#2a2050']]), 0.4, [-70, -50, 140, 80]);
  gf(ctx, c => c.rect(50, -30, 50, 26), '#3b2f6e', 0.4, [40, -40, 70, 40]);
  // readout: a line that drops on "found"
  ctx.fillStyle = '#0a0a20'; ctx.fillRect(-44, -30, 64, 34);
  const d = ramp(t, 516.9, 517.4);
  ctx.strokeStyle = rgba('#c9a8ff', 0.9); ctx.lineWidth = 2; ctx.beginPath();
  for (let i = 0; i <= 20; i++) { const u = i / 20, yy = -20 + Math.sin(u * 9 + t * 3) * 2 + (u > 0.55 ? (u - 0.55) * 30 * d : 0); i ? ctx.lineTo(-40 + u * 56, yy) : ctx.moveTo(-40, yy); }
  ctx.stroke(); ctx.restore();
  light(ctx, x - 10, y - 135, 50, '#c9a8ff', 0.3);
}

const SNOW = (() => { const r = rng(9), a = []; for (let i = 0; i < 70; i++) a.push([r(), r(), r()]); return a; })();

function draw(ctx, t) {
  const tilt = ease(ramp(t, 516.55, 517.6)) * 820;
  const z = lerp(1.0, 1.05, sm((t - T0) / (T1 - T0))), dx = drift(t, 1, 3) * 5, dy = drift(t, 1, 4) * 3;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H / 2 + dy + tilt);
  cached(ctx, 'sky', -100, -1300, W + 100, HZ + 20, skyArt);
  // the violet veil high in the sky, with a dark gap opening as the camera reaches it
  const g = ramp(t, 516.8, 517.6);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 4; k++) { const yy = -560 + k * 40 + Math.sin(t * 0.5 + k) * 10;
    ctx.fillStyle = lin(ctx, 0, yy - 60, 0, yy + 60, [[0, 'rgba(138,90,216,0)'], [0.5, rgba('#8a5ad8', 0.10)], [1, 'rgba(138,90,216,0)']]); ctx.fillRect(-100, yy - 60, W + 200, 120); }
  ctx.restore();
  if (g > 0) { ctx.save(); ctx.translate(900, -500); ctx.scale(1, 0.32); ctx.fillStyle = rad(ctx, 0, 0, 0, 520 * g, [[0, 'rgba(4,4,16,0.75)'], [0.7, 'rgba(4,4,16,0.5)'], [1, 'rgba(4,4,16,0)']]); ctx.fillRect(-600, -600, 1200, 1200); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#c9a8ff', 0.35 * g); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(900, -500, 420 * g, 130 * g, 0, 0, 7); ctx.stroke(); ctx.restore(); }
  cached(ctx, 'ice', -100, HZ, W + 100, H + 200, iceArt);
  cached(ctx, 'hut', HUT.x - 80, HUT.y - 420, HUT.x + HUT.w + 80, HUT.y + 40, hutArt);
  hutWindow(ctx, t);
  instrument(ctx, t);
  // balloon: let go at 515.5, rises and drifts, tilting the camera with it
  const rel = 515.5, bt = Math.max(0, t - rel);
  const handN = [980 + 40, 860 - 230];
  const by = handN[1] - 120 + Math.sin(t * 2) * 6 - 90 * bt * ramp(t, rel, rel + 0.6) - tilt * 1.05, bx = handN[0] + 14 * Math.sin(t * 1.3) + bt * 30;
  ctx.strokeStyle = 'rgba(233,226,204,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx, by + 60);
  const sy = t < rel ? handN[1] : by + 150; ctx.quadraticCurveTo(bx - 10 + Math.sin(t * 3) * 8, (by + sy) / 2 + 40, t < rel ? handN[0] : bx + 4, sy); ctx.stroke();
  if (t >= rel) gf(ctx, c => c.rect(bx - 6, sy, 12, 14), '#e08a42', 0, null);
  gf(ctx, c => { c.ellipse(bx, by, 50, 58, 0.05 * Math.sin(t), 0, 7); }, rad(ctx, bx - 16, by - 20, 4, 70, [[0, '#ffffff'], [0.6, '#d8d0ec'], [1, '#8a80bc']]), 0.25, [bx - 60, by - 70, 120, 140]);
  light(ctx, bx - 14, by - 18, 90, '#ffffff', 0.15);
  // the scientists: one at the instrument, one releasing the balloon; on "scientists" both look up
  const up = ramp(t, 516.35, 516.9);
  const relA = ramp(t, rel - 0.2, rel + 0.5);
  parka(ctx, 790, 868, 1.0, t, { face: -1, ph: 0.5, look: up * 0.9 + 0.1 * Math.sin(t * 0.8) * (1 - up), armNear: [lerp(70, 40, up), lerp(-150, -100, up)], armFar: [60, -140], clip: false });
  parka(ctx, 1000, 880, 1.06, t, { face: 1, ph: 2.0, look: Math.max(relA * 0.7, up), armNear: [lerp(34, 50, relA), lerp(-230, -300, relA) + 40 * ramp(t, rel + 0.6, rel + 1.4)], armFar: [40, -90], clip: false });
  // fine blowing snow
  for (const [a, b, c] of SNOW) { const ph = (b + t * (0.12 + c * 0.2)) % 1, x = ((a * W + t * (60 + c * 90)) % (W + 100)) - 50, y = HZ - 40 + ph * 420 + Math.sin(t + a * 7) * 10;
    ctx.fillStyle = rgba('#ffffff', 0.35 * Math.sin(ph * Math.PI)); ctx.fillRect(x, y, 1.5 + c * 2, 1.5 + c * 2); }
  ctx.restore();
  stamp(ctx, t, 515.15, 519.6, '1985', 'a hole in the ozone layer');
}

module.exports = { T0, T1, draw };
