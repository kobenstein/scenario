// "A kid starting first grade this fall will still be in elementary school when it comes due."
// An autumn morning. A small child with a big backpack walks along the sidewalk to school; the years are chalked on the
// pavement, 2026 to 2030, and with every year the child passes, they grow a little taller. On "comes due" they reach 2030,
// right in front of the school, and the year glows.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, rng, lin, rad, rgba, light, clamp } = L;
const { grainFill, roundRect, cap } = require('./s_k3_clock');

const T0 = 174.8, T1 = 181.3;
const V = 300, X0 = 600, GROUND = 776;
const kidX = t => X0 + V * (t - T0);
const MARK_T = [175.9, 176.95, 177.95, 178.95, 179.96];
const MARKS = MARK_T.map((tt, i) => ({ x: kidX(tt), y: 2026 + i, t: tt }));
const camX = t => kidX(t) - lerp(720, 860, ramp(t, 179.4, T1));
const SCHOOL = { x0: 2720, x1: 3720, top: 270, door: 3060 };

// ---------- static art (cached) ----------
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil(x1 - x0), Math.ceil(y1 - y0)), c = cv.getContext('2d'); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0);
}
function hillsArt(c) {
  const r = rng(5);
  // far rooftops in the haze
  let x = -200;
  while (x < 3200) { const w = 120 + r() * 160, h = 60 + r() * 90, b = 720;
    grainFill(c, cc => { cc.moveTo(x, b); cc.lineTo(x, b - h); cc.lineTo(x + w / 2, b - h - 50 - r() * 20); cc.lineTo(x + w, b - h); cc.lineTo(x + w, b); cc.closePath(); }, lin(c, 0, b - h - 60, 0, b, [[0, '#8a5f8e'], [1, '#6a4a7e']]), 0.35);
    if (r() < 0.5) { c.fillStyle = rgba('#ffd29a', 0.5); c.fillRect(x + w * 0.3, b - h + 20, 14, 16); }
    x += w + r() * 40; }
  c.fillStyle = lin(c, 0, 600, 0, 760, [[0, 'rgba(255,190,140,0)'], [1, 'rgba(255,190,140,0.35)']]); c.fillRect(-200, 600, 3400, 160);
}
function treeArt(c, x, s, seed) {
  const r = rng(seed);
  grainFill(c, cc => { cc.moveTo(x - 9 * s, GROUND - 40); cc.lineTo(x - 5 * s, GROUND - 230 * s); cc.lineTo(x + 5 * s, GROUND - 230 * s); cc.lineTo(x + 10 * s, GROUND - 40); cc.closePath(); }, '#3b1f2a', 0.4);
  const cols = [['#ffb35c', '#c9702e'], ['#e0663a', '#8a2f1c'], ['#f0a25a', '#a2521f']];
  for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2, rr = 70 * s, px = x + Math.cos(a) * rr * 0.8 + (r() - 0.5) * 20, py = GROUND - 290 * s + Math.sin(a) * rr * 0.6;
    const cc = cols[Math.floor(r() * 3)];
    grainFill(c, q => q.arc(px, py, (60 + r() * 30) * s, 0, 7), lin(c, px - 60, py - 60, px + 60, py + 60, [[0, cc[0]], [1, cc[1]]]), 0.5); }
}
function streetArt(c) {
  // trees and front gardens
  for (const [x, s, sd] of [[350, 1.0, 1], [1250, 1.1, 2], [2150, 0.95, 3]]) treeArt(c, x, s, sd);
  // low fence along the gardens
  c.fillStyle = '#5a3a5e'; c.fillRect(-300, GROUND - 74, 2900, 8);
  for (let x = -300; x < 2600; x += 34) { grainFill(c, cc => { cc.moveTo(x, GROUND - 40); cc.lineTo(x, GROUND - 92); cc.lineTo(x + 7, GROUND - 100); cc.lineTo(x + 14, GROUND - 92); cc.lineTo(x + 14, GROUND - 40); cc.closePath(); }, '#6e4a6e', 0.3); }
  // grass strip
  grainFill(c, cc => cc.rect(-300, GROUND - 44, 4400, 46), lin(c, 0, GROUND - 44, 0, GROUND, [[0, '#7a6a3a'], [1, '#4e4428']]), 0.5);
}
function schoolArt(c) {
  const { x0, x1, top, door } = SCHOOL, base = GROUND - 40;
  // tower with a clock
  const tx = door - 70;
  grainFill(c, cc => { cc.rect(tx, top - 190, 140, 200); }, lin(c, tx, 0, tx + 140, 0, [[0, '#b8604a'], [1, '#7a3b30']]), 0.5);
  grainFill(c, cc => { cc.moveTo(tx - 14, top - 186); cc.lineTo(tx + 70, top - 270); cc.lineTo(tx + 154, top - 186); cc.closePath(); }, '#4a2a3a', 0.5);
  c.fillStyle = '#f3efe2'; c.beginPath(); c.arc(tx + 70, top - 110, 38, 0, 7); c.fill();
  c.strokeStyle = '#4a2a3a'; c.lineWidth = 4; c.beginPath(); c.arc(tx + 70, top - 110, 38, 0, 7); c.stroke();
  // main building: warm brick, big windows
  grainFill(c, cc => cc.rect(x0, top, x1 - x0, base - top), lin(c, x0, top, x1, base, [[0, '#c46a4e'], [0.5, '#a65340'], [1, '#6e3430']]), 0.55);
  grainFill(c, cc => cc.rect(x0 - 20, top - 26, x1 - x0 + 40, 30), '#4a2a3a', 0.4);
  c.fillStyle = 'rgba(60,24,24,0.25)'; for (let y = top + 14; y < base; y += 18) c.fillRect(x0, y, x1 - x0, 2);
  for (let row = 0; row < 2; row++) for (let x = x0 + 50; x < x1 - 80; x += 150) {
    if (Math.abs(x + 45 - door) < 120 && row === 1) continue;
    const y = top + 50 + row * 190;
    grainFill(c, cc => cc.rect(x, y, 90, 130), lin(c, 0, y, 0, y + 130, [[0, '#ffe2a8'], [1, '#ffb35c']]), 0.25);
    c.fillStyle = '#5a2f2a'; c.fillRect(x + 43, y, 4, 130); c.fillRect(x, y + 62, 90, 4); c.fillRect(x - 6, y + 130, 102, 8);
  }
  // entrance: steps, doors, canopy
  grainFill(c, cc => cc.rect(door - 110, base - 250, 220, 250), '#5a2f2a', 0.4);
  grainFill(c, cc => { cc.rect(door - 86, base - 210, 80, 210); cc.rect(door + 6, base - 210, 80, 210); }, lin(c, 0, base - 210, 0, base, [[0, '#ffd29a'], [1, '#e08a42']]), 0.3);
  grainFill(c, cc => cc.rect(door - 140, base - 270, 280, 24), '#3a1f2a', 0.4);
  for (let k = 0; k < 3; k++) grainFill(c, cc => cc.rect(door - 150 - k * 20, base + k * 12, 300 + k * 40, 13), '#8a6a6e', 0.4);
}

// ---------- the kid ----------
function legPose(p, th, sh) {
  const a = 0.5 * Math.sin(p), knee = 0.1 + 1.0 * Math.pow(Math.max(0, Math.cos(p + 0.45)), 2);
  const kx = Math.sin(a) * th, ky = Math.cos(a) * th, ph = a - knee;
  return { kx, ky, ax: kx + Math.sin(ph) * sh, ay: ky + Math.cos(ph) * sh, fa: clamp(-ph * 0.6 - 0.05, -0.5, 0.7) };
}
function kid(ctx, t, p, grow) {
  const TH = 44, SH = 42, A = legPose(p, TH, SH), B = legPose(p + Math.PI, TH, SH);
  const hipY = -Math.max(A.ay, B.ay) - 8, lean = 0.06, tl = 74 + 10 * grow;
  const sx = Math.sin(lean) * tl, sy = hipY - Math.cos(lean) * tl;
  const legC = (L0, near) => {
    const kx = L0.kx, ky = hipY + L0.ky, ax = L0.ax, ay = hipY + L0.ay;
    grainFill(ctx, c => { cap(c, 0, hipY, kx, ky, 13, 10); cap(c, kx, ky, ax, ay, 10, 8); }, near ? lin(ctx, 0, hipY, 0, 0, [[0, '#4a3c7e'], [1, '#2a2252']]) : '#1e1840', 0.35);
    // sneaker
    ctx.save(); ctx.translate(ax, ay); ctx.rotate(L0.fa);
    grainFill(ctx, c => { c.moveTo(-10, -7); c.lineTo(16, -6); c.quadraticCurveTo(28, -2, 25, 8); c.lineTo(-11, 8); c.closePath(); }, near ? '#f3efe2' : '#b8b0c8', 0.2);
    ctx.fillStyle = near ? '#e0663a' : '#8a3f2a'; ctx.fillRect(-11, 5, 37, 3);
    ctx.restore();
  };
  const armSw = Math.sin(p) * 0.55;
  const arm = (near) => {
    const a1 = (near ? -armSw : armSw) + 0.1, sx0 = sx + 4, sy0 = sy + 12;
    const ex = sx0 + Math.sin(a1) * 34, ey = sy0 + Math.cos(a1) * 34, a2 = a1 + 0.35 + (near ? 0.25 : 0.1), hx = ex + Math.sin(a2) * 30, hy = ey + Math.cos(a2) * 30;
    grainFill(ctx, c => { cap(c, sx0, sy0, ex, ey, 10, 8.5); cap(c, ex, ey, hx, hy, 8.5, 7); }, near ? lin(ctx, 0, sy0, 0, hy, [[0, '#ffb35c'], [1, '#d27a34']]) : '#a2521f', 0.4);
    grainFill(ctx, c => c.arc(hx + Math.sin(a2) * 3, hy + Math.cos(a2) * 3, 6.5, 0, 7), near ? '#e0904a' : '#9a4c1c', 0.2);
  };
  // shadow
  ctx.fillStyle = 'rgba(40,20,40,0.35)'; ctx.beginPath(); ctx.ellipse(6, 2, 52, 7, 0, 0, 7); ctx.fill();
  legC(B, false); arm(false);
  // hoodie
  grainFill(ctx, c => {
    c.moveTo(-18, hipY + 12); c.bezierCurveTo(-24, hipY - 30, -26 + sx * 0.5, sy + 40, -20 + sx, sy + 8);
    c.bezierCurveTo(-14 + sx, sy - 6, 6 + sx, sy - 8, 14 + sx, sy + 2); c.bezierCurveTo(24 + sx, sy + 20, 24 + sx * 0.5, hipY - 20, 20, hipY + 12); c.closePath();
  }, lin(ctx, -20, sy, 24, hipY, [[0, '#ffc488'], [0.5, '#ffb35c'], [1, '#c9702e']]), 0.42);
  ctx.strokeStyle = 'rgba(122,59,23,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-18, hipY + 4); ctx.quadraticCurveTo(0, hipY + 8, 20, hipY + 4); ctx.stroke();
  legC(A, true);
  // head: big for a child, hair with a bobbing ponytail, faceless
  const bob = Math.sin(2 * p) * 1.5;
  ctx.save(); ctx.translate(sx + 6, sy - 6 + bob * 0.3);
  grainFill(ctx, c => cap(c, 0, 4, 2, -14, 7, 7), '#c36a2b', 0);
  const hr = 27;
  grainFill(ctx, c => c.ellipse(4, -38, hr * 0.92, hr, 0.1, 0, 7), lin(ctx, -20, -60, 30, -10, [[0, '#ffd29a'], [1, '#c36a2b']]), 0.35);
  grainFill(ctx, c => { c.moveTo(-22, -26); c.bezierCurveTo(-30, -60, -6, -72, 10, -68); c.bezierCurveTo(26, -66, 34, -52, 30, -44); c.bezierCurveTo(16, -52, 0, -50, -6, -38); c.bezierCurveTo(-10, -30, -14, -24, -22, -26); c.closePath(); }, '#3a1a10', 0.4);
  // ponytail swings behind
  const pt = Math.sin(p * 2 + 0.8) * 0.25 + 0.25;
  ctx.save(); ctx.translate(-20, -50); ctx.rotate(0.9 + pt);
  grainFill(ctx, c => { c.moveTo(0, -6); c.quadraticCurveTo(26, -10, 34, 6); c.quadraticCurveTo(24, 4, 0, 6); c.closePath(); }, '#3a1a10', 0.4);
  ctx.restore();
  grainFill(ctx, c => c.arc(-19, -50, 5, 0, 7), '#e0663a', 0);
  grainFill(ctx, c => c.ellipse(-4, -36, 4, 6.5, 0.1, 0, 7), '#b0602a', 0.3);
  ctx.restore();
  // backpack: big, on the back, bounces with the step
  const pb = Math.abs(Math.sin(p)) * 2;
  ctx.save(); ctx.translate(sx - 22, sy + 6 - pb); ctx.rotate(lean);
  const BW = 54, BH = 74;
  grainFill(ctx, c => roundRect(c, -BW + 8, 0, BW, BH, 16), lin(ctx, -BW, 0, 8, BH, [[0, '#ef7a48'], [1, '#8a2f1c']]), 0.45);
  grainFill(ctx, c => roundRect(c, -BW + 12, -4, BW - 8, 28, 12), '#c0482a', 0.4);
  grainFill(ctx, c => roundRect(c, -BW + 2, 38, 22, 30, 7), '#a83c22', 0.4);
  ctx.fillStyle = 'rgba(255,226,170,0.6)'; ctx.fillRect(-BW + 18, 20, 18, 3);
  ctx.restore();
  // strap over the shoulder and the near hand gripping it
  ctx.strokeStyle = '#8a2f1c'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx - 6, sy + 4); ctx.quadraticCurveTo(sx + 14, sy + 20, sx + 4, sy + 52); ctx.stroke();
  arm(true);
}

// ---------- leaves ----------
const LEAVES = (() => { const r = rng(61), a = []; for (let i = 0; i < 34; i++) a.push({ x: r() * 2400, y: r() * 900, v: 30 + r() * 40, sw: 20 + r() * 40, ph: r() * 7, s: 0.6 + r() * 0.9, c: ['#ffb35c', '#e0663a', '#f0a25a', '#c9702e'][Math.floor(r() * 4)] }); return a; })();

function draw(ctx, t) {
  const cam = camX(t), dy = drift(t, 1, 3) * 4, dx = drift(t, 1, 8) * 5;
  const z = lerp(1.0, 1.05, sm((t - T0) / (T1 - T0)));
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par - cam * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  // morning sky, warm low sun behind the school
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, '#2a2a66'], [0.38, '#6a4a86'], [0.68, '#d9846a'], [0.85, '#ffc488'], [1, '#e8a070']]); ctx.fillRect(0, 0, W, H);
  const sunX = 1500 - (cam - 1000) * 0.08;
  light(ctx, sunX, 640, 900, '#ffb35c', 0.45);
  light(ctx, sunX, 640, 160, '#fff1cf', 0.7);
  // soft clouds
  for (let k = 0; k < 4; k++) { const x = ((k * 620 - cam * 0.1 + t * 6) % 2600) - 300, y = 160 + k * 60;
    ctx.fillStyle = rad(ctx, x, y, 0, 260, [[0, 'rgba(255,214,190,0.22)'], [1, 'rgba(255,214,190,0)']]); ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.22); ctx.translate(-x, -y); ctx.fillRect(x - 260, y - 260, 520, 520); ctx.restore(); }
  layer(0.3, () => cached(ctx, 'hills', -200, 520, 3200, 760, hillsArt));
  layer(0.75, () => cached(ctx, 'street', -300, 300, 2700, GROUND + 4, streetArt));
  layer(1.0, () => {
    cached(ctx, 'school', SCHOOL.x0 - 200, SCHOOL.top - 280, SCHOOL.x1 + 40, GROUND + 40, schoolArt);
    // clock hands on the tower turn
    const tx = SCHOOL.door, ty = SCHOOL.top - 110;
    ctx.strokeStyle = '#3a1f2a'; ctx.lineCap = 'round'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(t * 0.6 - 1.5) * 24, ty + Math.sin(t * 0.6 - 1.5) * 24); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(t * 0.05 + 0.4) * 16, ty + Math.sin(t * 0.05 + 0.4) * 16); ctx.stroke();
    light(ctx, SCHOOL.door, GROUND - 160, 260, '#ffd29a', 0.25);
    // sidewalk
    grainFill(ctx, c => c.rect(cam - 400, GROUND - 4, W + 800, 120), lin(ctx, 0, GROUND, 0, GROUND + 120, [[0, '#b89a9e'], [1, '#7a6070']]), 0.5);
    ctx.fillStyle = 'rgba(80,50,70,0.35)'; for (let x = Math.floor((cam - 400) / 180) * 180; x < cam + W + 400; x += 180) ctx.fillRect(x, GROUND - 4, 3, 118);
    grainFill(ctx, c => c.rect(cam - 400, GROUND + 112, W + 800, 400), lin(ctx, 0, GROUND + 112, 0, GROUND + 300, [[0, '#4a3550'], [1, '#2a1f3a']]), 0.5);
    ctx.fillStyle = 'rgba(255,226,190,0.35)'; ctx.fillRect(cam - 400, GROUND + 110, W + 800, 3);
    // years chalked on the pavement
    for (const m of MARKS) {
      const lit = Math.exp(-Math.max(0, t - m.t) * 1.6) * (t >= m.t - 0.1 ? 1 : 0), last = m.y === 2030 ? ramp(t, 179.8, 180.3) : 0;
      ctx.save(); ctx.translate(m.x + 40, GROUND + 62); ctx.transform(1, 0, -0.35, 0.5, 0, 0);
      ctx.font = '96px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = rgba(last > 0 ? '#fff1cf' : '#f3efe2', 0.55 + 0.35 * Math.max(lit, last)); ctx.fillText(String(m.y), 0, 0);
      ctx.restore();
      light(ctx, m.x + 40, GROUND + 60, 160, C.amber, 0.25 * lit + 0.45 * last);
    }
    // the kid grows a little with every year passed
    const x = kidX(t), p = (x - X0) / 112 * Math.PI;
    let grow = 0; MARK_T.forEach((tt, i) => { if (i > 0) grow += sm((t - tt + 0.35) / 0.7); });
    const s = 0.92 + 0.085 * grow;
    ctx.save(); ctx.translate(x, GROUND + 28); ctx.scale(s * 1.6, s * 1.6); kid(ctx, t, p, grow / 4); ctx.restore();
    light(ctx, x + 20, GROUND - 120, 220, '#ffb35c', 0.12);
  });
  // falling leaves in front
  ctx.save();
  for (const lf of LEAVES) {
    const y = (lf.y + t * lf.v) % 1000 - 40, x = ((lf.x - cam * 0.9 + Math.sin(t * 0.9 + lf.ph) * lf.sw) % 2400 + 2400) % 2400 - 200;
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 1.3 + lf.ph); ctx.scale(lf.s, lf.s * (0.5 + 0.5 * Math.sin(t * 2.4 + lf.ph)));
    ctx.fillStyle = lf.c; ctx.beginPath(); ctx.ellipse(0, 0, 9, 5, 0, 0, 7); ctx.fill(); ctx.restore();
  }
  ctx.restore();
}

module.exports = { T0, T1, draw };
