// "In 2024 he quit OpenAI, saying he'd lost trust it would handle this responsibly."
// Night. A young man carries a box of his things out of a bright cyan glass lobby; the door swings shut behind him
// and he walks on toward a warm streetlight. The camera tracks him to the right.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, grainFill, lin, rad, rgba, light, cone, stamp, out, clamp, ease } = L;

const T0 = 32.0, T1 = 38.65;

// ---------- helpers ----------
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1.25) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
function roundRect(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// a limb as a tapered capsule from (x0,y0) radius r0 to (x1,y1) radius r1
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}

// ---------- world layout ----------
const GLASS_T = 270, GLASS_B = 820, DOOR_L = 960, DOOR_R = 1220, CORNER = 1340;
const MULL = [-560, -260, 60, 380, 690, DOOR_L, DOOR_R, CORNER];
const LAMP_X = 2470;
const SPEED = 210, X0 = 760, XEND = X0 + SPEED * (T1 - T0);
const manX = t => X0 + SPEED * (t - T0);
const camX = t => 1000 * sm((t - T0) / (T1 - T0)) * 0.85 + 150 * ((t - T0) / (T1 - T0));
// steps out of the lobby (inside floor at 800, scale .86) onto the sidewalk (900, scale 1)
const depthK = x => sm((x - 990) / 250);

// ---------- static art ----------
function skylineArt(c) {
  const r = rng(21);
  // far towers
  let x = 700;
  while (x < 3300) {
    const w = 60 + r() * 140, h = 120 + r() * 280, top = 780 - h;
    grainFill(c, cc => cc.rect(x, top, w, h + 60), lin(c, 0, top, 0, 800, [[0, '#211c4a'], [1, '#141236']]), 0.5);
    c.fillStyle = 'rgba(164,159,196,0.10)'; c.fillRect(x, top, 3, h);
    for (let wy = top + 16; wy < 740; wy += 22) for (let wx = x + 10; wx < x + w - 12; wx += 18) {
      const q = r(); if (q < 0.07) { c.fillStyle = rgba(q < 0.018 ? C.cyan : '#ffb35c', 0.25 + r() * 0.35); c.fillRect(wx, wy, 6, 9); }
    }
    x += w + r() * 30;
  }
  // haze over the lower city
  c.fillStyle = lin(c, 0, 520, 0, 840, [[0, 'rgba(59,47,110,0)'], [1, 'rgba(59,47,110,0.75)']]); c.fillRect(650, 520, 2700, 380);
}
function polesArt(c) {
  const r = rng(33);
  // houses on the right
  for (let i = 0; i < 6; i++) {
    const x = 1950 + i * 300 + r() * 60, w = 190 + r() * 60, h = 110 + r() * 60, base = 880;
    grainFill(c, cc => { cc.moveTo(x, base); cc.lineTo(x, base - h); cc.lineTo(x + w / 2, base - h - 70); cc.lineTo(x + w, base - h); cc.lineTo(x + w, base); cc.closePath(); },
      lin(c, 0, base - h - 70, 0, base, [[0, '#14112f'], [1, '#0a0920']]), 0.55);
    c.strokeStyle = 'rgba(164,159,196,0.22)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, base - h); c.lineTo(x + w / 2, base - h - 70); c.lineTo(x + w, base - h); c.stroke();
    grainFill(c, cc => cc.rect(x + w * 0.7, base - h - 60, 18, 40), '#0f0d28', 0.4);
    for (let k = 0; k < 3; k++) if (r() < 0.6) { const wx = x + 22 + k * (w - 60) / 2, wy = base - h + 24 + r() * 20; c.fillStyle = rgba('#ffb35c', 0.45 + r() * 0.3); c.fillRect(wx, wy, 22, 28); c.fillStyle = 'rgba(16,14,40,0.8)'; c.fillRect(wx + 10, wy, 2, 28); }
  }
  // utility poles and sagging wires
  const P = [1700, 2600, 3500];
  for (const px of P) {
    grainFill(c, cc => cc.rect(px - 7, 260, 14, 620), '#0c0b22', 0.3);
    grainFill(c, cc => cc.rect(px - 60, 290, 120, 9), '#0c0b22', 0.3);
    grainFill(c, cc => cc.rect(px - 46, 330, 92, 7), '#0c0b22', 0.3);
  }
  c.strokeStyle = 'rgba(8,8,24,0.9)'; c.lineWidth = 2;
  for (let i = 0; i < P.length - 1; i++) for (const [o, y] of [[-54, 292], [54, 292], [-40, 332], [40, 332]]) {
    c.beginPath(); c.moveTo(P[i] + o, y); c.quadraticCurveTo((P[i] + P[i + 1]) / 2 + o, y + 70, P[i + 1] + o, y); c.stroke();
  }
}
function interiorArt(c) {
  // a deep, bright cyan lobby
  grainFill(c, cc => cc.rect(-700, GLASS_T, CORNER + 700, GLASS_B - GLASS_T), lin(c, 0, GLASS_T, 0, GLASS_B, [[0, '#bff2ff'], [0.45, '#7fd6ee'], [1, '#2a9cbc']]), 0.3);
  // back wall windows showing a pale city
  const r = rng(5);
  grainFill(c, cc => cc.rect(-700, 360, CORNER + 700, 300), lin(c, 0, 360, 0, 660, [[0, '#d8f7ff'], [1, '#9fe3f5']]), 0.25);
  let x = -700; while (x < CORNER) { const w = 50 + r() * 110, h = 60 + r() * 190; c.fillStyle = rgba('#5fb9d4', 0.55 + r() * 0.25); c.fillRect(x, 660 - h, w, h); x += w + 6 + r() * 20; }
  // back wall mullions
  c.fillStyle = 'rgba(40,130,160,0.55)'; for (let k = -700; k < CORNER; k += 170) c.fillRect(k, 360, 6, 300);
  // floor
  grainFill(c, cc => cc.rect(-700, 660, CORNER + 700, GLASS_B - 660), lin(c, 0, 660, 0, GLASS_B, [[0, '#8adff2'], [1, '#3aa6c4']]), 0.3);
  c.strokeStyle = 'rgba(30,110,140,0.35)'; c.lineWidth = 2;
  for (let k = -700; k < CORNER + 200; k += 120) { c.beginPath(); c.moveTo(k, 660); c.lineTo(k + (k - 500) * 0.5, GLASS_B); c.stroke(); }
  // ceiling with light strips
  grainFill(c, cc => cc.rect(-700, GLASS_T, CORNER + 700, 90), lin(c, 0, GLASS_T, 0, GLASS_T + 90, [[0, '#4fb8d4'], [1, '#9fe6f6']]), 0.3);
  c.fillStyle = '#f2fdff'; for (let k = -640; k < CORNER; k += 240) { c.fillRect(k, GLASS_T + 22, 150, 8); c.fillRect(k + 20, GLASS_T + 58, 110, 6); }
  // reception desk and a plant
  grainFill(c, cc => { roundRect(cc, 150, 610, 360, 120, 10); }, lin(c, 0, 610, 0, 730, [[0, '#2f9ebd'], [1, '#13607e']]), 0.4);
  c.fillStyle = 'rgba(216,247,255,0.7)'; c.fillRect(150, 610, 360, 6);
  grainFill(c, cc => cc.rect(-300, 680, 46, 60), '#16698a', 0.4);
  for (let k = 0; k < 7; k++) { const a = -2.6 + k * 0.33; grainFill(c, cc => cc.ellipse(-277 + Math.cos(a) * 44, 650 + Math.sin(a) * 50, 34, 11, a, 0, 7), '#1d7d9e', 0.3); }
  // a couple of distant colleagues still inside, small dark-cyan figures
  for (const [fx, s] of [[560, 0.55], [-120, 0.5]]) {
    c.save(); c.translate(fx, 700); c.scale(s, s);
    grainFill(c, cc => { roundRect(cc, -26, -200, 52, 130, 20); cc.rect(-22, -80, 18, 80); cc.rect(4, -80, 18, 80); cc.ellipse(0, -232, 22, 26, 0, 0, 7); }, 'rgba(20,90,120,0.75)', 0.3);
    c.restore();
  }
}
function facadeArt(c) {
  // upper floors: dark slab with a thin cyan ledge
  grainFill(c, cc => cc.rect(-760, -200, CORNER + 760, GLASS_T + 200), lin(c, 0, -200, 0, GLASS_T, [[0, '#0c0b22'], [1, '#1b1840']]), 0.6);
  c.fillStyle = 'rgba(143,230,255,0.35)'; c.fillRect(-760, GLASS_T - 16, CORNER + 760, 4);
  // dim windows upstairs
  const r = rng(77);
  for (let y = -150; y < GLASS_T - 60; y += 90) for (let x = -720; x < CORNER - 60; x += 110) { c.fillStyle = r() < 0.18 ? rgba(C.cyan, 0.18 + r() * 0.2) : 'rgba(30,28,70,0.6)'; c.fillRect(x, y, 80, 54); }
  // side wall at the corner
  grainFill(c, cc => { cc.moveTo(CORNER, -200); cc.lineTo(CORNER + 70, -160); cc.lineTo(CORNER + 70, GLASS_B + 20); cc.lineTo(CORNER, GLASS_B); cc.closePath(); }, lin(c, CORNER, 0, CORNER + 70, 0, [[0, '#1b1840'], [1, '#0b0a20']]), 0.6);
  // mullions and sill
  for (const m of MULL) grainFill(c, cc => cc.rect(m - 7, GLASS_T - 12, 14, GLASS_B - GLASS_T + 12), lin(c, m - 7, 0, m + 7, 0, [[0, '#0e1a33'], [0.5, '#24425e'], [1, '#0a1226']]), 0.3);
  grainFill(c, cc => cc.rect(-760, GLASS_T - 12, CORNER + 760, 16), '#0d1530', 0.3);
  grainFill(c, cc => cc.rect(-760, GLASS_B - 6, CORNER + 760, 14), '#0d1530', 0.3);
  // transom above the door
  grainFill(c, cc => cc.rect(DOOR_L, GLASS_T + 120, DOOR_R - DOOR_L, 12), '#0e1a33', 0.3);
}
function groundArt(c) {
  // sidewalk and street
  grainFill(c, cc => cc.rect(-800, GLASS_B, 4400, 160), lin(c, 0, GLASS_B, 0, 980, [[0, '#2c2758'], [1, '#1d1942']]), 0.6);
  c.fillStyle = 'rgba(164,159,196,0.25)'; c.fillRect(-800, 975, 4400, 4);
  grainFill(c, cc => cc.rect(-800, 980, 4400, 300), lin(c, 0, 980, 0, 1200, [[0, '#14112f'], [1, '#08071a']]), 0.6);
  c.strokeStyle = 'rgba(10,8,30,0.45)'; c.lineWidth = 2;
  for (let x = -800; x < 3600; x += 230) { c.beginPath(); c.moveTo(x, GLASS_B + 4); c.lineTo(x - 60, 976); c.stroke(); }
  // street light pole
  grainFill(c, cc => { cc.rect(LAMP_X - 9, 300, 18, 600); }, lin(c, LAMP_X - 9, 0, LAMP_X + 9, 0, [[0, '#2a2252'], [1, '#0a0920']]), 0.4);
  c.strokeStyle = '#120f2c'; c.lineWidth = 12; c.lineCap = 'round';
  c.beginPath(); c.moveTo(LAMP_X, 310); c.quadraticCurveTo(LAMP_X, 262, LAMP_X - 60, 268); c.stroke();
  grainFill(c, cc => { cc.moveTo(LAMP_X - 110, 284); cc.quadraticCurveTo(LAMP_X - 80, 250, LAMP_X - 40, 262); cc.lineTo(LAMP_X - 30, 286); cc.closePath(); }, '#16123a', 0.4);
  grainFill(c, cc => cc.rect(LAMP_X - 20, 880, 40, 20), '#0a0920', 0.3);
  c.fillStyle = '#fff1cf'; c.beginPath(); c.ellipse(LAMP_X - 72, 284, 34, 5, 0.05, 0, 7); c.fill();
}

// ---------- the walker ----------
const LEG = { th: 86, sh: 84 };
function legPose(p) {
  const th = 0.46 * Math.sin(p);
  const knee = 0.08 + 1.05 * Math.pow(Math.max(0, Math.cos(p + 0.45)), 2);
  const kx = Math.sin(th) * LEG.th, ky = Math.cos(th) * LEG.th;
  const ph = th - knee, ax = kx + Math.sin(ph) * LEG.sh, ay = ky + Math.cos(ph) * LEG.sh;
  const fa = clamp(-ph * 0.6 - 0.05, -0.5, 0.7);   // toes up at heel strike, down at toe-off
  return { kx, ky, ax, ay, fa };
}
function figure(ctx, t, p, look, rim) {
  const A = legPose(p), B = legPose(p + Math.PI);
  const hipY = -Math.max(A.ay, B.ay) - 10;                      // keep the lower foot on the ground: gives natural bob
  const lean = 0.08, sx = Math.sin(lean) * 128, sy = hipY - Math.cos(lean) * 128;
  const sway = Math.sin(2 * p + 0.6) * 2.2;                       // the box lags the body a little
  const G = rim ? 0 : 1;
  const col = (a, b) => rim || lin(ctx, 0, sy - 60, 0, 0, [[0, a], [1, b]]);
  const legFill = (L0, near) => {
    const kx = L0.kx, ky = hipY + L0.ky, ax = L0.ax, ay = hipY + L0.ay;
    grainFill(ctx, c => { cap(c, 0, hipY, kx, ky, 19, 14); cap(c, kx, ky, ax, ay, 14, 10); }, near ? col('#d9843e', '#8a451c') : col('#7a3b17', '#3e1c0c'), 0.4 * G);
    grainFill(ctx, c => { c.save(); c.translate(ax, ay); c.rotate(L0.fa); c.moveTo(-13, -9); c.lineTo(22, -7); c.quadraticCurveTo(38, -2, 34, 10); c.lineTo(-15, 10); c.closePath(); c.restore(); }, rim || (near ? '#3a1d10' : '#24120a'), 0);
  };
  // box geometry (held against the belly)
  const bx = sx + 26, by = sy + 62 + sway, BW = 86, BH = 62;
  legFill(B, false);
  // far arm, mostly hidden behind the box
  grainFill(ctx, c => { cap(c, sx - 2, sy + 14, sx + 2, sy + 76, 13, 11); cap(c, sx + 2, sy + 76, bx + BW - 8, by + 30, 11, 9); }, col('#8a451c', '#5a2a12'), 0.4 * G);
  // backpack
  grainFill(ctx, c => { c.save(); c.translate(sx, sy); c.rotate(lean); roundRect(c, -60, 4, 40, 100, 15); c.restore(); }, rim || lin(ctx, 0, sy, 0, sy + 110, [[0, '#a2521f'], [1, '#4a2210']]), 0.5 * G);
  if (!rim) { ctx.fillStyle = 'rgba(74,34,16,0.6)'; ctx.save(); ctx.translate(sx, sy); ctx.rotate(lean); ctx.fillRect(-58, 54, 36, 5); ctx.restore(); }
  // torso: jacket with a raised collar, chest forward, back rounded
  grainFill(ctx, c => {
    c.moveTo(-24, hipY + 10);
    c.bezierCurveTo(-30, hipY - 50, -36 + sx * 0.5, sy + 60, -26 + sx, sy + 12);           // back
    c.bezierCurveTo(-20 + sx, sy - 6, -6 + sx, sy - 12, 6 + sx, sy - 12);                  // shoulder line
    c.bezierCurveTo(22 + sx, sy - 8, 30 + sx, sy + 20, 30 + sx, sy + 50);                  // chest
    c.bezierCurveTo(30 + sx * 0.5, sy + 90, 26, hipY - 30, 26, hipY + 10); c.closePath();
  }, col('#ffb35c', '#b0602a'), 0.42 * G);
  legFill(A, true);
  // jacket hem over the near hip
  grainFill(ctx, c => { c.moveTo(-26, hipY - 22); c.quadraticCurveTo(0, hipY - 28, 28, hipY - 22); c.lineTo(27, hipY + 14); c.quadraticCurveTo(0, hipY + 18, -25, hipY + 14); c.closePath(); }, col('#d27a34', '#a2521f'), 0.42 * G);
  if (!rim) {
    ctx.strokeStyle = 'rgba(74,34,16,0.75)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sx - 12, sy - 4); ctx.quadraticCurveTo(sx - 2, sy + 50, sx - 14, sy + 100); ctx.stroke();   // strap
    ctx.strokeStyle = 'rgba(122,59,23,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx + 14, sy + 4); ctx.quadraticCurveTo(sx + 22, sy + 60, 18, hipY - 24); ctx.stroke();   // zip
  }
  // head: faceless, slightly forward; hair on top and back; turns to glance back
  ctx.save(); ctx.translate(sx + 6, sy - 8); ctx.rotate(0.06 - look * 0.22);
  grainFill(ctx, c => cap(c, 0, 4, 2, -22, 10, 9), rim || '#b0602a', 0);
  const head = c => { c.moveTo(-18, -26); c.bezierCurveTo(-22, -52, -10, -70, 6, -70); c.bezierCurveTo(24, -70, 32, -56, 30, -40);
    c.bezierCurveTo(30, -32, 34, -30, 32, -24); c.bezierCurveTo(28, -14, 18, -10, 8, -12); c.bezierCurveTo(-4, -12, -14, -16, -18, -26); c.closePath(); };
  ctx.save(); if (look > 0) { ctx.translate(6, 0); ctx.scale(1 - 2 * look, 1); ctx.translate(-6, 0); }
  grainFill(ctx, head, col('#ffc488', '#c36a2b'), 0.35 * G);
  if (!rim) grainFill(ctx, c => { c.moveTo(-20, -28); c.bezierCurveTo(-26, -56, -10, -76, 8, -74); c.bezierCurveTo(26, -74, 34, -60, 30, -50); c.bezierCurveTo(18, -58, 4, -54, -2, -44); c.bezierCurveTo(-6, -36, -10, -30, -20, -28); c.closePath(); }, '#4a2210', 0.4);
  if (!rim) grainFill(ctx, c => c.ellipse(-1, -36, 5, 8, 0.1, 0, 7), '#b0602a', 0.3);   // ear
  ctx.restore();
  ctx.restore();
  // collar
  grainFill(ctx, c => { c.moveTo(sx - 16, sy - 2); c.quadraticCurveTo(sx + 2, sy - 22, sx + 20, sy - 6); c.lineTo(sx + 16, sy + 6); c.quadraticCurveTo(sx + 2, sy - 6, sx - 12, sy + 8); c.closePath(); }, col('#c9702e', '#9a4c1c'), 0.4 * G);
  // box of his things
  ctx.save(); ctx.translate(bx, by);
  if (!rim) {
    for (let k = 0; k < 5; k++) { const a = -2.3 + k * 0.32 + Math.sin(t * 3 + k) * 0.05; grainFill(ctx, c => c.ellipse(22 + Math.cos(a) * 18, -4 + Math.sin(a) * 24, 12, 5, a, 0, 7), '#3f8a5a', 0.3); }
    grainFill(ctx, c => { c.save(); c.translate(60, -12); c.rotate(0.3); c.rect(-5, -30, 11, 36); c.restore(); }, '#e7dcc2', 0.3);
    ctx.strokeStyle = '#5a2a12'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(44, 2); ctx.lineTo(36, -24); ctx.lineTo(50, -34); ctx.stroke();
    grainFill(ctx, c => c.ellipse(54, -36, 9, 6, 0.6, 0, 7), '#ffb35c', 0);
  }
  grainFill(ctx, c => { c.moveTo(0, 0); c.lineTo(BW, -2); c.lineTo(BW + 2, BH); c.lineTo(2, BH + 2); c.closePath(); }, rim || lin(ctx, 0, 0, 0, BH, [[0, '#e8b06e'], [1, '#9a5a28']]), 0.45 * G);
  if (!rim) { ctx.fillStyle = 'rgba(122,59,23,0.5)'; ctx.fillRect(38, -1, 10, BH + 2); ctx.fillStyle = 'rgba(255,226,170,0.4)'; ctx.fillRect(0, 0, BW, 4); ctx.fillStyle = 'rgba(74,34,16,0.6)'; ctx.fillRect(58, 16, 18, 7); }
  ctx.restore();
  // near arm: upper arm hangs, forearm under the box, hand gripping its front edge
  const ex = sx - 2, ey = sy + 82 + sway * 0.5;
  // the upper arm starts in a rounded shoulder cap right under the shoulder line; a soft shadow along its back edge
  // separates the sleeve from the jacket so the arm reads as a volume hanging from the shoulder
  const nearArm = c => { cap(c, sx + 3, sy + 9, ex, ey, 17.5, 13); cap(c, ex, ey, bx + BW - 2, by + BH - 8, 13, 10); };
  if (!rim) { ctx.save(); ctx.translate(-4, 2); grainFill(ctx, nearArm, 'rgba(110,50,18,0.55)', 0); ctx.restore(); }
  grainFill(ctx, nearArm, col('#ffb35c', '#c36a2b'), 0.42 * G);
  grainFill(ctx, c => { c.ellipse(bx + BW + 2, by + BH - 14, 9, 15, 0.1, 0, 7); }, rim || '#e08a42', 0.3 * G);
}

function walker(ctx, t, rimCol, rimA, rimDir = -1) {
  const x = manX(t), k = depthK(x), s = lerp(0.86, 1.0, k), y = lerp(800, 900, k);
  const p = (x - X0) / 122 * Math.PI;
  const look = sm((t - 36.0) / 0.35) * (1 - sm((t - 36.85) / 0.45));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // contact shadow
  ctx.fillStyle = 'rgba(4,4,16,0.45)'; ctx.beginPath(); ctx.ellipse(10, 2, 70, 9, 0, 0, 7); ctx.fill();
  if (rimA > 0) { ctx.save(); ctx.globalAlpha = rimA; ctx.translate(4 * rimDir, -3); figure(ctx, t, p, look, rimCol); ctx.restore(); }
  figure(ctx, t, p, look, null);
  ctx.restore();
}

// ---------- the door ----------
function doorAngle(t) {
  // held open on its closer, then it swings shut (accelerating) and bumps against the frame
  const open = 1.45 - 0.15 * ramp(t, 33.9, 34.7);
  let a = open * (1 - Math.pow(clamp((t - 34.7) / 1.0), 2.2));
  if (t > 35.7) a = 0.07 * Math.abs(Math.sin((t - 35.7) * 14)) * Math.exp(-(t - 35.7) * 7);
  return a;
}
function door(ctx, t) {
  const a = doorAngle(t), w = DOOR_R - DOOR_L, fx = DOOR_L + w * Math.cos(a), ex = Math.sin(a);
  const top = GLASS_T + 132, bot = GLASS_B;
  const quad = c => { c.moveTo(DOOR_L, top); c.lineTo(fx, top - 34 * ex); c.lineTo(fx, bot + 40 * ex); c.lineTo(DOOR_L, bot); c.closePath(); };
  // glass of the door, reflecting the street when it's swung out
  grainFill(ctx, quad, lin(ctx, DOOR_L, top, fx + 1, bot, [[0, rgba('#d8f7ff', 0.28 + 0.2 * ex)], [1, rgba('#0a6f8c', 0.25 + 0.35 * ex)]]), 0);
  ctx.save(); ctx.beginPath(); quad(ctx); ctx.clip();
  ctx.fillStyle = rgba('#ffffff', 0.18); ctx.beginPath(); ctx.moveTo(DOOR_L + 20, top); ctx.lineTo(DOOR_L + 70, top); ctx.lineTo(DOOR_L - 30, bot); ctx.lineTo(DOOR_L - 80, bot); ctx.closePath(); ctx.fill();
  ctx.restore();
  // frame
  ctx.strokeStyle = '#0e1a33'; ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.beginPath(); quad(ctx); ctx.stroke();
  // push bar
  const hx = lerp(DOOR_L, fx, 0.82), hy0 = lerp(top, top - 34 * ex, 0.82) + 210, hy1 = hy0 + 110 + 30 * ex;
  ctx.strokeStyle = '#cfefff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx, hy0); ctx.lineTo(hx, hy1); ctx.stroke();
}

// ---------- fog ----------
const FOG = (() => { const r = rng(8), a = []; for (let i = 0; i < 9; i++) a.push({ x: r() * 3600 - 600, y: 600 + r() * 260, w: 300 + r() * 500, h: 40 + r() * 60, v: 8 + r() * 14, a: 0.05 + r() * 0.06 }); return a; })();

function draw(ctx, t) {
  const cam = camX(t), z = lerp(1.0, 1.05, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 4) * 6, dy = drift(t, 1, 7) * 4;
  const hum = 0.95 + 0.05 * Math.sin(t * 9.3) * Math.sin(t * 2.2);
  const flick = 0.92 + 0.06 * Math.sin(t * 17) * Math.sin(t * 5.3) + (Math.sin(t * 31) > 0.97 ? -0.08 : 0);
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par - cam * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  // sky
  ctx.save();
  grainFill(ctx, c => c.rect(0, 0, W, H), lin(ctx, 0, 0, 0, H, [[0, '#080a22'], [0.55, '#1c1946'], [0.8, '#3b2f6e'], [1, '#1a1640']]), 0.6);
  ctx.restore();
  layer(0.2, () => { light(ctx, 2000, 760, 900, '#7a4ea0', 0.18); });
  layer(0.35, () => cached(ctx, 'sky', 650, 260, 3350, 900, skylineArt, 1));
  layer(0.7, () => cached(ctx, 'poles', 1500, 200, 3700, 900, polesArt, 1));
  // fog low over the city
  layer(0.6, () => { for (const f of FOG) { const x = f.x + t * f.v; ctx.fillStyle = rad(ctx, x, f.y, 0, f.w, [[0, rgba('#a49fc4', f.a)], [1, rgba('#a49fc4', 0)]]); ctx.save(); ctx.translate(x, f.y); ctx.scale(1, f.h / f.w); ctx.translate(-x, -f.y); ctx.fillRect(x - f.w, f.y - f.w, 2 * f.w, 2 * f.w); ctx.restore(); } });
  const x = manX(t), outside = x > 1020;
  layer(1.0, () => {
    cached(ctx, 'ground', -800, 200, 3600, 1200, groundArt, 1);
    cached(ctx, 'interior', -700, GLASS_T, CORNER, GLASS_B, interiorArt, 1);
    // the lobby breathes light
    light(ctx, 300, 520, 900, C.cyanW, 0.10 * hum);
    if (!outside) walker(ctx, t, null, 0);
    // glass sheen over the panes (not over the open doorway)
    ctx.save(); ctx.beginPath(); ctx.rect(-700, GLASS_T, DOOR_L + 700, GLASS_B - GLASS_T); ctx.rect(DOOR_R, GLASS_T, CORNER - DOOR_R, GLASS_B - GLASS_T); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, GLASS_T, 0, GLASS_B, [[0, 'rgba(216,247,255,0.10)'], [1, 'rgba(10,111,140,0.18)']]); ctx.fillRect(-700, GLASS_T, CORNER + 700, GLASS_B - GLASS_T);
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    for (const sx of [-420, 160, 820, 1230]) { ctx.beginPath(); ctx.moveTo(sx, GLASS_T); ctx.lineTo(sx + 90, GLASS_T); ctx.lineTo(sx - 60, GLASS_B); ctx.lineTo(sx - 150, GLASS_B); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    cached(ctx, 'facade', -760, -200, CORNER + 80, GLASS_B + 30, facadeArt, 1);
    // cyan spill from the lobby onto the sidewalk
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, GLASS_B, 0, 1000, [[0, rgba(C.cyan, 0.30 * hum)], [1, rgba(C.cyan, 0)]]);
    ctx.beginPath(); ctx.moveTo(-700, GLASS_B); ctx.lineTo(CORNER, GLASS_B); ctx.lineTo(CORNER + 260, 1000); ctx.lineTo(-700, 1000); ctx.closePath(); ctx.fill();
    ctx.restore();
    light(ctx, 600, 560, 1100, C.cyan, 0.16 * hum);
    // streetlight: warm cone and pool
    cone(ctx, LAMP_X - 72, 282, 60, 640, 620, '#ffb35c', 0.22 * flick);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(LAMP_X - 72, 905); ctx.scale(1, 0.16);
    ctx.fillStyle = rad(ctx, 0, 0, 0, 380, [[0, rgba('#ffb35c', 0.5 * flick)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(-380, -380, 760, 760); ctx.restore();
    light(ctx, LAMP_X - 72, 286, 260, '#ffe2a8', 0.55 * flick);
    light(ctx, LAMP_X - 72, 286, 40, '#ffffff', 0.8 * flick);
    door(ctx, t);
    if (outside) {
      // he picks up the cyan rim from the lobby at his back, then the warm lamp ahead
      const warm = ramp(x, 1700, 2200);
      walker(ctx, t, warm > 0.5 ? '#ffd28c' : C.cyan, 0.8 * (warm > 0.5 ? warm : 1 - warm * 2) + 0.15, warm > 0.5 ? 1 : -1);
      light(ctx, x + 30, 700, 260, '#ffb35c', 0.10 * warm);
    }
  });
  stamp(ctx, t, 32.3, 38.4, '2024', 'he leaves OpenAI');
}

module.exports = { T0, T1, draw };
