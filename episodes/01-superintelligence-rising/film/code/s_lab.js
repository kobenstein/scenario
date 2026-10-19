// "At Anthropic, one of the biggest AI labs,"
// A big glass office building at night, every floor glowing cyan, people working and walking inside.
// A small amber passer-by on the pavement slows down and looks up at it.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, out, clamp, label } = L;

const T0 = 2.3, T1 = 5.05;


// same look as lib grainFill, but the speckle only covers the path's bounding box (far cheaper per frame)
const BB = { b: null, p(x, y) { const b = this.b; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; },
  moveTo(x, y) { this.p(x, y); }, lineTo(x, y) { this.p(x, y); }, quadraticCurveTo(a, b, x, y) { this.p(a, b); this.p(x, y); },
  bezierCurveTo(a, b, c, d, x, y) { this.p(a, b); this.p(c, d); this.p(x, y); }, rect(x, y, w, h) { this.p(x, y); this.p(x + w, y + h); },
  arc(x, y, r) { this.p(x - r, y - r); this.p(x + r, y + r); }, ellipse(x, y, rx, ry) { const r = Math.max(rx, ry); this.p(x - r, y - r); this.p(x + r, y + r); },
  arcTo(a, b, x, y) { this.p(a, b); this.p(x, y); }, closePath() {}, beginPath() {} };
const PAT = new WeakMap();
function pat(ctx) { let p = PAT.get(ctx); if (!p) { p = ctx.createPattern(L.tex().dark, 'repeat'); PAT.set(ctx, p); } return p; }
function grainFill(ctx, pathFn, fill, grain = 0.5) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    BB.b = [1e9, 1e9, -1e9, -1e9]; pathFn(BB); const b = BB.b;
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = pat(ctx);
    const m = ctx.getTransform().invertSelf(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [px, py] of [[0, 0], [W, 0], [0, H], [W, H]]) { const x = m.a * px + m.c * py + m.e, y = m.b * px + m.d * py + m.f; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    x0 = Math.max(x0, b[0] - 2); y0 = Math.max(y0, b[1] - 2); x1 = Math.min(x1, b[2] + 2); y1 = Math.min(y1, b[3] + 2);
    if (x1 > x0 && y1 > y0) ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  ctx.restore();
}

// ---------- a small faceless figure built from joints (feet at 0,0; 100 units tall) ----------
function L_figure(ctx, x, y, h, o = {}) {
  const amp = o.amp ?? 0, ph = o.ph ?? 0, phone = o.phone ?? 0, look = o.look ?? 0, br = o.br ?? 0, slope = o.slope ?? 0;
  const lean = (o.lean ?? 0) + amp * 0.06, S = c => o.sil || c, G = g => o.sil ? 0 : g;
  ctx.save(); ctx.translate(x, y); ctx.scale((o.dir ?? 1) * h / 100, h / 100);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const s = Math.sin(ph);
  const hip = [0, -50 + amp * 1.6 * s * s];
  const leg = (p, col, w) => {
    const a = amp * 0.42 * Math.sin(p), k = 0.06 + amp * 0.85 * Math.max(0, Math.cos(p)) * (0.5 + 0.5 * Math.sin(p + 0.6));
    const b = a - k;
    const kn = [hip[0] + 24 * Math.sin(a), hip[1] + 24 * Math.cos(a)];
    const an = [kn[0] + 24 * Math.sin(b), kn[1] + 24 * Math.cos(b)];
    kn[1] -= slope * kn[0]; an[1] -= slope * an[0];
    ctx.strokeStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(kn[0], kn[1]); ctx.lineTo(an[0], an[1]); ctx.stroke();
    ctx.lineWidth = w * 0.75; ctx.beginPath(); ctx.moveTo(an[0] - 1.5, an[1] + 0.5); ctx.lineTo(an[0] + 6.5, an[1] + 0.5 - slope * 6); ctx.stroke();
  };
  const sh = [hip[0] + 30 * Math.sin(lean), hip[1] - 30 * Math.cos(lean) - br * 0.6];
  // the arm hangs from a rounded shoulder a little below the collar (not from the top of the back),
  // with a tapered sleeve and a small round hand
  const ash = [sh[0] - 2.6 * Math.sin(lean) + 0.6, sh[1] + 2.6 * Math.cos(lean)];
  const arm = (alpha, fore, col, w) => {
    const el = [ash[0] + 14 * Math.sin(alpha), ash[1] + 14 * Math.cos(alpha)];
    const ha = [el[0] + 13 * Math.sin(fore), el[1] + 13 * Math.cos(fore)];
    ctx.strokeStyle = col; ctx.fillStyle = col;
    ctx.lineWidth = w * 1.12; ctx.beginPath(); ctx.moveTo(ash[0], ash[1]); ctx.lineTo(el[0], el[1]); ctx.stroke();
    ctx.lineWidth = w * 0.88; ctx.beginPath(); ctx.moveTo(el[0], el[1]); ctx.lineTo(ha[0], ha[1]); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(ash[0], ash[1] - 0.4, w * 0.72, w * 0.64, 0, 0, Math.PI * 2); ctx.fill();   // shoulder cap
    ctx.beginPath(); ctx.ellipse(ha[0] + 0.8 * Math.sin(fore), ha[1] + 0.8 * Math.cos(fore), w * 0.5, w * 0.44, 0, 0, Math.PI * 2); ctx.fill(); // hand
    return ha;
  };
  const sw = amp * 0.5 * Math.sin(ph);
  // far side (darker)
  arm(o.farArm ? o.farArm[0] : sw, o.farArm ? o.farArm[1] : sw + 0.25 + amp * 0.2, S('#7d3f19'), 5.2);
  leg(ph + Math.PI, S('#2e1610'), 6.6);
  // near leg
  leg(ph, S('#6a3218'), 6.8);
  // torso: a short coat
  ctx.save(); ctx.translate(hip[0], hip[1]); ctx.rotate(lean);
  const fl = amp * 1.5 * Math.sin(ph * 2);  // hem swings with the stride
  const coat = c => { c.moveTo(-9 - fl, 15); c.bezierCurveTo(-8, 2, -9.5, -16, -8.5, -26); c.quadraticCurveTo(-7, -32 - br * 0.5, -1, -32.5);
    c.quadraticCurveTo(6, -32.5, 7.5, -27); c.bezierCurveTo(8.5, -14, 7, 0, 9 + fl, 15); c.quadraticCurveTo(0, 17, -9 - fl, 15); c.closePath(); };
  if (o.rim) { ctx.save(); ctx.translate(o.rimDx ?? 1, -0.6); grainFill(ctx, coat, o.rim, 0); ctx.restore(); }
  grainFill(ctx, coat, o.sil || lin(ctx, -7, -30, 7, 15, [[0, '#ffbe6e'], [0.5, '#e58b3c'], [1, '#8a4318']]), G(0.35));
  if (!o.sil) { ctx.strokeStyle = 'rgba(90,40,14,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-2, -31); ctx.lineTo(2, -20); ctx.lineTo(1.5, 13); ctx.stroke(); }
  ctx.restore();
  // near arm (holds the phone)
  let na = lerp(-sw, 0.22, phone), nf = lerp(-sw + 0.3 + amp * 0.2, 1.95, phone);
  if (o.nearArm) { na = lerp(na, o.nearArm[0], o.nearArm[2] ?? 1); nf = lerp(nf, o.nearArm[1], o.nearArm[2] ?? 1); }
  const hand = arm(na, nf, S('#d98a3e'), 5.4);
  if (phone > 0.05) {
    ctx.save(); ctx.translate(hand[0] + 1, hand[1] - 1); ctx.rotate(-0.5);
    ctx.fillStyle = rgba(C.cyanW, 0.95 * phone); ctx.fillRect(-1.6, -3, 3.2, 5.6); ctx.restore();
    light(ctx, hand[0] + 1, hand[1] - 2, 16, C.cyan, 0.5 * phone);
  }
  // neck and head
  ctx.save(); ctx.translate(sh[0], sh[1]); ctx.rotate(lean * 0.6 - look * 0.55);
  ctx.strokeStyle = S('#a35626'); ctx.lineWidth = 4.2; ctx.beginPath(); ctx.moveTo(0, 1); ctx.lineTo(0.6, -4); ctx.stroke();
  ctx.translate(0.8, -10.5);
  const head = c => c.ellipse(0, 0, 6.6, 7.4, 0, 0, Math.PI * 2);
  grainFill(ctx, head, o.sil || lin(ctx, 6, -6, -6, 6, [[0, '#d98a3e'], [1, '#7a3b17']]), G(0.3));
  if (!o.sil) grainFill(ctx, c => { c.ellipse(-1.2, -1.2, 6.2, 6.6, 0, Math.PI * 0.5, Math.PI * 1.72); c.closePath(); }, '#3a1a0b', 0.2); // hair, back of head
  if (o.faceLight) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(o.faceLightCol ?? C.cyan, o.faceLight); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(0, 0, 5.6, 6.4, 0, -1.2, 0.9); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

// ---------- the building ----------
const BX0 = 300, BX1 = 1380, ROOF = 200, GROUND = 850, FH = 155;
const FLOORS = [230, 385, 540, 695];
const SIDE_W = 270, EYE = 800, KS = 0.06;
const SIL = '#0a2638';

// pre-generated office layouts per floor (front: 1080 wide; side: 360 wide)
function layout(seed, w, lobby) {
  const r = rng(seed), desks = [], walkers = [], standers = [], props = [];
  if (!lobby) {
    let x = 30 + r() * 40;
    while (x < w - 90) {
      if (r() < 0.16) { props.push({ kind: r() < 0.5 ? 'board' : 'plant', x }); x += 110; continue; }
      const n = 1 + Math.floor(r() * 3);
      for (let k = 0; k < n && x < w - 90; k++) { desks.push({ x, dir: r() < 0.5 ? -1 : 1, sit: r() < 0.82, ph: r() * 6, fl: r() * 6, type: r() < 0.6 }); x += 70 + r() * 12; }
      x += 40 + r() * 70;
    }
  } else {
    props.push({ kind: 'door', x: w * 0.46 }); props.push({ kind: 'desk', x: w * 0.2 }); props.push({ kind: 'plant', x: w * 0.72 }); props.push({ kind: 'plant', x: w * 0.08 });
  }
  const nw = lobby ? 3 : 1 + Math.floor(r() * 2.6);
  for (let i = 0; i < nw; i++) walkers.push({ x0: r() * w, v: (16 + r() * 22) * (r() < 0.5 ? -1 : 1), h: 76 + r() * 8, ph: r() * 6, back: r() < 0.5 });
  const ns = 1 + Math.floor(r() * 2);
  for (let i = 0; i < ns; i++) standers.push({ x: 60 + r() * (w - 120), dir: r() < 0.5 ? -1 : 1, ph: r() * 6, gest: r() < 0.5, h: 74 + r() * 8 });
  return { desks, walkers, standers, props };
}
const FRONT = FLOORS.map((y, i) => layout(100 + i * 7, 1080, i === 3));
const SIDE = FLOORS.map((y, i) => layout(300 + i * 11, 360, false));

function sitter(ctx, x, fy, dir, t, d) {
  // seated silhouette facing its monitor: chair, torso, head, forearm to the keyboard
  const br = Math.sin(t * 1.6 + d.ph), typ = d.type ? Math.sin(t * 18 + d.ph) * 0.8 : 0, turn = 0.12 * Math.sin(t * 0.5 + d.ph);
  ctx.save(); ctx.translate(x, fy); ctx.scale(dir, 1); ctx.fillStyle = SIL; ctx.strokeStyle = SIL; ctx.lineCap = 'round';
  ctx.fillRect(14, -52, 4, 30); ctx.fillRect(-2, -24, 20, 4); ctx.fillRect(7, -20, 3, 20);               // chair
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(6, -22); ctx.lineTo(-10, -22); ctx.lineTo(-12, -2); ctx.stroke(); // thigh + shin
  ctx.save(); ctx.translate(6, -22); ctx.rotate(-0.12 + br * 0.015 + turn * 0.3);
  ctx.beginPath(); ctx.moveTo(-5, 0); ctx.bezierCurveTo(-7, -14, -6, -26, -2, -31); ctx.lineTo(6, -31); ctx.bezierCurveTo(8, -22, 8, -10, 6, 0); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(0, -27); ctx.lineTo(-8, -15); ctx.lineTo(-20, -17 + typ); ctx.stroke(); // arm
  ctx.beginPath(); ctx.ellipse(1 - turn * 10, -39, 5.6, 6.4, 0, 0, 7); ctx.fill();
  ctx.restore(); ctx.restore();
}

function interior(ctx, t, fl, lay, w, side) {
  const h = FH, fy = h - 14;
  // back wall: bright cyan, brightest in the middle of the floor
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, '#38b9de'], [0.3, '#9cefff'], [0.72, '#5fd2f0'], [1, '#1a8fb3']]); ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = lin(ctx, 0, 0, w, 0, [[0, 'rgba(10,60,90,0.35)'], [0.5, 'rgba(10,60,90,0)'], [1, 'rgba(10,60,90,0.35)']]); ctx.fillRect(0, 0, w, h);
  // pillars
  for (let x = 180; x < w; x += 360) { ctx.fillStyle = 'rgba(20,110,145,0.45)'; ctx.fillRect(x - 12, 12, 24, fy - 12); }
  // ceiling + light strips
  ctx.fillStyle = '#0d4d66'; ctx.fillRect(0, 0, w, 12);
  for (let x = 40; x < w; x += 130) { const f = 0.85 + 0.15 * Math.sin(t * 7 + x + fl * 3) * (hash(x, fl, Math.floor(t * 6)) > 0.97 ? 0 : 1);
    ctx.fillStyle = rgba(C.cyanW, f); ctx.fillRect(x, 12, 70, 3); }
  // floor
  ctx.fillStyle = lin(ctx, 0, fy, 0, h, [[0, '#14698a'], [1, '#0b4560']]); ctx.fillRect(0, fy, w, h - fy);
  // props
  for (const p of lay.props) {
    if (p.kind === 'board') { ctx.fillStyle = 'rgba(230,252,255,0.75)'; ctx.fillRect(p.x, 34, 74, 48); ctx.strokeStyle = 'rgba(10,60,90,0.55)'; ctx.lineWidth = 2;
      for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(p.x + 8, 44 + k * 10); ctx.lineTo(p.x + 20 + hash(p.x, k) * 44, 44 + k * 10); ctx.stroke(); }
      ctx.fillStyle = SIL; ctx.fillRect(p.x + 34, 82, 4, fy - 82); }
    if (p.kind === 'plant') { ctx.fillStyle = SIL; ctx.fillRect(p.x - 8, fy - 18, 16, 18);
      for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.35 + 0.05 * Math.sin(t * 1.2 + k); ctx.beginPath(); ctx.ellipse(p.x + Math.cos(a) * 16, fy - 18 + Math.sin(a) * 18, 4, 13, a + Math.PI / 2, 0, 7); ctx.fill(); } }
    if (p.kind === 'door') { ctx.fillStyle = 'rgba(216,247,255,0.55)'; ctx.fillRect(p.x, 20, 110, fy - 20); ctx.strokeStyle = 'rgba(10,50,70,0.7)'; ctx.lineWidth = 4; ctx.strokeRect(p.x, 20, 110, fy - 20); ctx.beginPath(); ctx.moveTo(p.x + 55, 20); ctx.lineTo(p.x + 55, fy); ctx.stroke(); }
    if (p.kind === 'desk') { ctx.fillStyle = SIL; ctx.fillRect(p.x, fy - 46, 160, 46); ctx.fillStyle = 'rgba(143,230,255,0.35)'; ctx.fillRect(p.x, fy - 46, 160, 3); }
  }
  // walkers at the back
  const walk = back => { for (const wk of lay.walkers) { if (wk.back !== back) continue;
    const x = ((wk.x0 + wk.v * t) % (w + 120) + (w + 120)) % (w + 120) - 60;
    L_figure(ctx, x, fy, wk.h, { sil: SIL, amp: 0.9, ph: x / (wk.h * 0.8) * Math.PI * 2 * Math.sign(wk.v), dir: Math.sign(wk.v), br: Math.sin(t * 2 + wk.ph) }); } };
  walk(true);
  // standing people, some gesturing
  for (const s of lay.standers) {
    const g = s.gest ? 0.5 + 0.5 * Math.sin(t * 2.2 + s.ph) : 0;
    L_figure(ctx, s.x + Math.sin(t * 0.4 + s.ph) * 4, fy, s.h, { sil: SIL, amp: 0, dir: s.dir, br: Math.sin(t * 1.8 + s.ph), look: 0.1 * Math.sin(t * 0.7 + s.ph), nearArm: [lerp(0.3, 1.9, g), lerp(0.5, 2.6, g), 1] });
  }
  // desks with monitors and seated people
  for (const d of lay.desks) {
    const dy = fy - 44;
    if (d.sit) sitter(ctx, d.x + 36 + (d.dir < 0 ? 22 : -22), fy, d.dir, t, d);
    ctx.fillStyle = '#0c3448'; ctx.fillRect(d.x, dy, 62, 5); ctx.fillRect(d.x + 3, dy + 5, 3, fy - dy - 5); ctx.fillRect(d.x + 56, dy + 5, 3, fy - dy - 5);
    // monitor, flickering
    const mx = d.x + 18, fl2 = 0.8 + 0.2 * Math.sin(t * 11 + d.fl) * Math.sin(t * 3.7 + d.fl * 2);
    ctx.fillStyle = '#0a2a3a'; ctx.fillRect(mx + 11, dy - 8, 3, 8); ctx.fillRect(mx - 2, dy - 30, 30, 23);
    ctx.fillStyle = rgba(C.cyanW, fl2); ctx.fillRect(mx, dy - 28, 26, 19);
    ctx.fillStyle = rgba('#0a6f8c', 0.5); for (let k = 0; k < 4; k++) ctx.fillRect(mx + 3, dy - 25 + k * 4, 6 + hash(d.x, k, Math.floor(t * 4 + d.fl)) * 16, 1.6);
  }
  walk(false);
}

// local affine so that (0,0)-(w,0)-(0,h) land on three screen points
function quadXf(ctx, p0, p1, p2, w, h) { ctx.transform((p1[0] - p0[0]) / w, (p1[1] - p0[1]) / w, (p2[0] - p0[0]) / h, (p2[1] - p0[1]) / h, p0[0], p0[1]); }
const sideY = (y, k) => y + (EYE - y) * KS * k;   // k = 0 at the corner, 1 at the far edge

function building(ctx, t) {
  // glow around the whole building: the hero light
  light(ctx, (BX0 + BX1) / 2, 520, 1100, C.cyan, 0.16);
  light(ctx, (BX0 + BX1) / 2, 860, 700, C.cyan, 0.12);
  // roof structure
  grainFill(ctx, c => { c.rect(BX0 + 120, ROOF - 46, 160, 50); c.rect(BX0 + 700, ROOF - 30, 120, 34); }, '#0d1030', 0.4);
  // side face (receding to the right)
  const nb = 3, bw = 120;
  for (let i = 0; i < 4; i++) {
    const y0 = FLOORS[i];
    for (let b = 0; b < nb; b++) {
      const k0 = b / nb, k1 = (b + 1) / nb, xA = BX1 + SIDE_W * k0, xB = BX1 + SIDE_W * k1;
      ctx.save(); quadXf(ctx, [xA, sideY(y0, k0)], [xB, sideY(y0, k1)], [xA, sideY(y0 + FH, k0)], bw, FH);
      ctx.beginPath(); ctx.rect(0, 0, bw + 0.6, FH); ctx.clip(); ctx.translate(-b * bw, 0);
      interior(ctx, t, i + 10, SIDE[i], 360, true);
      ctx.restore();
    }
  }
  // side face shading, mullions, slabs
  const sideQuad = (yTop, yBot) => c => { c.moveTo(BX1, yTop); c.lineTo(BX1 + SIDE_W, sideY(yTop, 1)); c.lineTo(BX1 + SIDE_W, sideY(yBot, 1)); c.lineTo(BX1, yBot); c.closePath(); };
  ctx.save(); ctx.beginPath(); sideQuad(ROOF, GROUND)(ctx); ctx.fillStyle = 'rgba(6,20,50,0.38)'; ctx.fill(); ctx.restore();
  ctx.fillStyle = '#07141f';
  for (let k = 0; k <= 6; k++) { const x = BX1 + SIDE_W * k / 6; ctx.fillRect(x - 2, sideY(ROOF, k / 6), 4, sideY(GROUND, k / 6) - sideY(ROOF, k / 6)); }
  for (const y of [...FLOORS, GROUND]) grainFill(ctx, sideQuad(y - 6, y + 7), '#0a1424', 0);
  grainFill(ctx, sideQuad(ROOF, FLOORS[0]), lin(ctx, 0, ROOF, 0, FLOORS[0], [[0, '#151a3a'], [1, '#0a0f24']]), 0.4);
  // front face
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(BX0, FLOORS[i]); ctx.beginPath(); ctx.rect(0, 0, BX1 - BX0, FH); ctx.clip(); interior(ctx, t, i, FRONT[i], 1080, false); ctx.restore(); }
  // glass: tint and slowly sliding reflections
  ctx.save(); ctx.beginPath(); ctx.rect(BX0, FLOORS[0], BX1 - BX0, GROUND - FLOORS[0]); ctx.clip();
  ctx.fillStyle = 'rgba(10,70,100,0.10)'; ctx.fillRect(BX0, FLOORS[0], BX1 - BX0, GROUND - FLOORS[0]);
  ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 3; k++) { const x = BX0 - 300 + ((k * 520 + t * 18) % 1600); ctx.fillStyle = 'rgba(216,247,255,0.05)';
    ctx.beginPath(); ctx.moveTo(x, FLOORS[0]); ctx.lineTo(x + 90 + k * 40, FLOORS[0]); ctx.lineTo(x - 260 + k * 40, GROUND); ctx.lineTo(x - 350, GROUND); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  // mullions
  ctx.fillStyle = '#07141f';
  for (let x = BX0; x <= BX1 + 1; x += 108) ctx.fillRect(x - 2.5, FLOORS[0], 5, GROUND - FLOORS[0]);
  // slabs + roof band
  grainFill(ctx, c => c.rect(BX0 - 6, ROOF, BX1 - BX0 + 6, FLOORS[0] - ROOF), lin(ctx, 0, ROOF, 0, FLOORS[0], [[0, '#1b2048'], [1, '#0b1028']]), 0.45);
  ctx.fillStyle = 'rgba(143,230,255,0.25)'; ctx.fillRect(BX0 - 6, ROOF, BX1 - BX0 + 6, 2);
  for (const y of [...FLOORS.slice(1), GROUND]) { ctx.fillStyle = '#0a1424'; ctx.fillRect(BX0 - 6, y - 6, BX1 - BX0 + 6, 13); ctx.fillStyle = 'rgba(143,230,255,0.35)'; ctx.fillRect(BX0 - 6, y + 6, BX1 - BX0 + 6, 1.5); }
  // corner column
  ctx.fillStyle = '#0a1424'; ctx.fillRect(BX1 - 5, ROOF, 10, GROUND - ROOF); ctx.fillRect(BX0 - 8, ROOF, 10, GROUND - ROOF);
  // the light spilling out onto the pavement
  cone(ctx, (BX0 + BX1) / 2, GROUND, BX1 - BX0, BX1 - BX0 + 500, 230, C.cyan, 0.16);
}

// cyan-lit mist drifting around the building
const MIST = (() => { const r = rng(23), a = []; for (let i = 0; i < 12; i++) a.push({ x: r() * 2200 - 150, y: 140 + r() * 260, rx: 220 + r() * 300, ry: 40 + r() * 50, sp: 6 + r() * 12, a: 0.05 + r() * 0.06 }); return a; })();
function haze(ctx, t) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const m of MIST) { const x = ((m.x + t * m.sp + 300) % 2400) - 300, near = Math.max(0, 1 - Math.abs(x - 900) / 900);
    ctx.save(); ctx.translate(x, m.y); ctx.scale(m.rx, m.ry); ctx.fillStyle = rad(ctx, 0, 0, 0, 1, [[0, rgba('#5fbfdc', m.a * (0.4 + 0.6 * near))], [1, 'rgba(95,191,220,0)']]);
    ctx.beginPath(); ctx.arc(0, 0, 1, 0, 7); ctx.fill(); ctx.restore(); }
  ctx.restore();
}

// ---------- surroundings ----------
const SKY = (() => { const r = rng(5), a = []; let x = -200;
  while (x < 2200) { const w = 80 + r() * 160; a.push({ x, w, h: 160 + r() * 330, win: r() }); x += w + r() * 20; } return a; })();
function backdrop(ctx, t) {
  grainFill(ctx, c => c.rect(-300, -300, W + 600, H + 600), lin(ctx, 0, -100, 0, 900, [[0, '#060717'], [0.5, '#111539'], [1, '#2a2460']]), 0.55);
  // far skyline
  for (const b of SKY) {
    grainFill(ctx, c => c.rect(b.x, GROUND - b.h, b.w, b.h + 20), lin(ctx, 0, GROUND - b.h, 0, GROUND, [[0, '#191a45'], [1, '#231f55']]), 0.5);
    const r = rng(Math.floor(b.x * 7) >>> 0);
    for (let y = GROUND - b.h + 16; y < GROUND - 20; y += 22) for (let x = b.x + 10; x < b.x + b.w - 14; x += 18) if (r() < 0.06 * b.win) {
      ctx.fillStyle = rgba(r() < 0.5 ? C.amber : C.lav, 0.25 + 0.1 * Math.sin(t + x)); ctx.fillRect(x, y, 6, 8); }
  }
  // haze in front of the skyline
  ctx.fillStyle = lin(ctx, 0, 450, 0, GROUND, [[0, 'rgba(60,50,120,0)'], [1, 'rgba(60,50,120,0.45)']]); ctx.fillRect(-300, 450, W + 600, GROUND - 450);
}

function trees(ctx, t) {
  for (const [x, s] of [[175, 1.1], [1905, 0.85]]) {
    const sway = Math.sin(t * 0.9 + x) * 4 * s;
    ctx.save(); ctx.translate(x, GROUND + 10); ctx.scale(s, s);
    ctx.fillStyle = '#080a1c'; ctx.fillRect(-5, -150, 10, 150);
    grainFill(ctx, c => { c.moveTo(-70 + sway * 0.5, -120); c.bezierCurveTo(-110, -180, -60, -300, 0 + sway, -310); c.bezierCurveTo(70, -300, 120, -190, 70 + sway * 0.5, -120); c.closePath(); },
      lin(ctx, -80, -300, 80, -120, [[0, '#0e1233'], [1, '#05060f']]), 0.55);
    ctx.restore();
  }
}

function street(ctx, t) {
  // pavement and road
  grainFill(ctx, c => c.rect(-300, GROUND, W + 600, 140), lin(ctx, 0, GROUND, 0, GROUND + 140, [[0, '#1d2350'], [1, '#141838']]), 0.5);
  ctx.fillStyle = 'rgba(143,230,255,0.25)'; ctx.fillRect(-300, GROUND + 140, W + 600, 2);
  grainFill(ctx, c => c.rect(-300, GROUND + 142, W + 600, 300), lin(ctx, 0, GROUND + 142, 0, H, [[0, '#0c0d26'], [1, '#05050f']]), 0.6);
  // paving joints
  ctx.strokeStyle = 'rgba(164,159,196,0.08)'; ctx.lineWidth = 2;
  for (let x = -300; x < W + 300; x += 120) { ctx.beginPath(); ctx.moveTo(x, GROUND + 4); ctx.lineTo(x - 60, GROUND + 140); ctx.stroke(); }
  // utility pole + wires on the left
  ctx.fillStyle = '#07081a'; ctx.fillRect(96, 330, 9, GROUND + 70 - 330); ctx.fillRect(60, 345, 80, 5);
  ctx.strokeStyle = '#07081a'; ctx.lineWidth = 1.6;
  for (const k of [-1, 0, 1]) { ctx.beginPath(); ctx.moveTo(100 + k * 36, 348); ctx.quadraticCurveTo(-60, 420 + k * 6, -300, 380); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(136, 348); ctx.quadraticCurveTo(220, 380 + Math.sin(t) * 2, 300, 260); ctx.stroke();
  // street lamp on the right: amber pool
  const lx = 1790, top = 470, f = 0.94 + 0.06 * Math.sin(t * 6.1) * Math.sin(t * 1.3);
  ctx.fillStyle = '#07081a'; ctx.fillRect(lx - 4, top, 8, GROUND + 70 - top); ctx.fillRect(lx - 70, top, 74, 6);
  ctx.beginPath(); ctx.moveTo(lx - 86, top + 4); ctx.lineTo(lx - 50, top + 4); ctx.lineTo(lx - 56, top + 16); ctx.lineTo(lx - 80, top + 16); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba('#ffd9a0', 0.9 * f); ctx.fillRect(lx - 79, top + 14, 22, 3);
  cone(ctx, lx - 68, top + 16, 20, 360, GROUND + 70 - top, C.amber, 0.11 * f);
  light(ctx, lx - 68, top + 18, 70, C.amber, 0.45 * f);
  light(ctx, lx - 68, GROUND + 60, 230, C.amber, 0.14 * f);
}

// passer-by: walks, slows down, looks up, drifts on slowly
const V = 120, PX0 = 330;
const pSpeed = s => lerp(1, 0.12, ramp(s, 3.15, 3.85)) * lerp(1, 2.2, ramp(s, 4.45, 5.0));
function pPos(t) { let p = 0; const dt = 1 / 120; for (let s = T0 - 0.4; s < t; s += dt) p += V * pSpeed(s) * Math.min(dt, t - s); return p; }

function draw(ctx, t) {
  const z = lerp(1.0, 1.08, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 4) * 4;
  const fx = 880, fy = 560;
  const layer = (par, fn) => { const zz = 1 + (z - 1) * (0.5 + par * 0.5);
    ctx.save(); ctx.translate(fx, fy); ctx.scale(zz, zz); ctx.translate(-fx + dx * par, -fy + dy * par); fn(); ctx.restore(); };
  layer(0.15, () => backdrop(ctx, t));
  layer(0.5, () => building(ctx, t));
  layer(0.55, () => haze(ctx, t));
  layer(0.6, () => trees(ctx, t));
  layer(0.8, () => {
    street(ctx, t);
    const pos = pPos(t), x = PX0 + pos, sp = pSpeed(t), lk = L.ease((t - 3.4) / 0.8) * (1 - 0.3 * ramp(t, 4.6, 5.05));
    ctx.fillStyle = 'rgba(4,4,16,0.4)'; ctx.beginPath(); ctx.ellipse(x + 6, GROUND + 92, 40, 6, 0, 0, 7); ctx.fill();
    L_figure(ctx, x, GROUND + 92, 140, { amp: Math.min(1, sp) * 0.95, ph: pos / 110 * Math.PI * 2, br: Math.sin(t * 2.2), look: lerp(0, 1.25, lk), lean: -0.1 * lk,
      rim: rgba(C.cyan, 0.7), rimDx: -1.1, faceLight: 0.55 * lk, nearArm: [0.1, 0.3, 0.6 * (1 - Math.min(1, sp))] });
  });
  label(ctx, t, 2.7, 5.0, 'Anthropic', 'one of the biggest AI labs', 96, 60);
}

module.exports = { T0, T1, draw };
