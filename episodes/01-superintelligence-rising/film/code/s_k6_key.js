// "Reports say those models were apparently hunting for the test's answer key. Were they?"
// The first question lantern drifts up close; its glow opens like an iris onto an exam room at night.
// A dark model-cube with cyan seams sends a glowing tendril across the floor, up the desk leg, toward a
// sealed envelope marked ANSWER KEY. On "Were they?" everything stops: the tendril, the clock's second hand.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out } = L;

const T0 = 338.30, T1 = 344.45;
const FREEZE = 343.55;

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
function roundRect(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
const poly = pts => c => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); };

// ---------------------------------------------------------------- the model as a dark cube with cyan seams
// (cx, cy) = centre of the top face; s = half width. glow 0..1; open 0..1 lifts and slides the lid panels.
function cube(ctx, cx, cy, s, glow, t, open = 0) {
  const h = s * 1.15, dy = s * 0.5;
  const T = [cx, cy - dy], R = [cx + s, cy], B = [cx, cy + dy], Lf = [cx - s, cy];
  const RB = [R[0], R[1] + h], BB = [B[0], B[1] + h], LB = [Lf[0], Lf[1] + h];
  const box = [cx - s * 1.5, cy - s * 1.5, s * 3, s * 3.2];
  // shadow on the floor
  ctx.fillStyle = rad(ctx, cx, BB[1] - dy * 0.3, 0, s * 1.6, [[0, 'rgba(2,2,10,0.7)'], [1, 'rgba(2,2,10,0)']]);
  ctx.save(); ctx.translate(cx, BB[1] - dy * 0.3); ctx.scale(1, 0.35); ctx.beginPath(); ctx.arc(0, 0, s * 1.6, 0, Math.PI * 2); ctx.restore(); ctx.fill();
  grainFill(ctx, poly([Lf, B, BB, LB]), lin(ctx, Lf[0], Lf[1], B[0], BB[1], [[0, '#161736'], [1, '#08081a']]), 0.55, box);
  grainFill(ctx, poly([B, R, RB, BB]), lin(ctx, B[0], B[1], R[0], RB[1], [[0, '#0c0c22'], [1, '#040410']]), 0.55, box);
  if (open <= 0) grainFill(ctx, poly([T, R, B, Lf]), lin(ctx, Lf[0], T[1], R[0], B[1], [[0, '#25264e'], [1, '#121232']]), 0.5, box);
  // seams
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round';
  const seam = (pts, a) => { for (const [w, k] of [[7, 0.10], [3, 0.35], [1.3, 1]]) { ctx.strokeStyle = rgba(k === 1 ? C.cyanW : C.cyan, a * k); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]); ctx.stroke(); } };
  const g = 0.35 + 0.65 * glow;
  seam([Lf, B, R], 0.55 * g); seam([B, BB], 0.6 * g); seam([Lf, LB, BB, RB, R], 0.2 * g);
  if (open <= 0) seam([Lf, T, R], 0.4 * g);
  // a faint grid of seams on the faces
  for (let k = 1; k < 3; k++) {
    const u = k / 3;
    seam([[lerp(Lf[0], B[0], u), lerp(Lf[1], B[1], u)], [lerp(LB[0], BB[0], u), lerp(LB[1], BB[1], u)]], 0.05 * g);
    seam([[lerp(B[0], R[0], u), lerp(B[1], R[1], u)], [lerp(BB[0], RB[0], u), lerp(BB[1], RB[1], u)]], 0.04 * g);
  }
  ctx.restore();
  return { T, R, B, Lf, RB, BB, LB, h, dy };
}

// ---------------------------------------------------------------- tendril
// a soft glowing creeper along a path of control points, growing to `prog` (0..1), tip sways while it hunts
function tendril(ctx, pts, prog, t, sway, a = 1) {
  if (prog <= 0) return null;
  // sample a Catmull-Rom spline
  const S = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < 20; k++) {
      const u = k / 20, u2 = u * u, u3 = u2 * u;
      const f = (a0, a1, a2, a3) => 0.5 * ((2 * a1) + (-a0 + a2) * u + (2 * a0 - 5 * a1 + 4 * a2 - a3) * u2 + (-a0 + 3 * a1 - 3 * a2 + a3) * u3);
      S.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  S.push(pts[pts.length - 1]);
  const n = Math.max(2, Math.floor(S.length * prog));
  const P = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = S[i], q = S[Math.min(S.length - 1, i + 1)], p = S[Math.max(0, i - 1)];
    const nx = -(q[1] - p[1]), ny = q[0] - p[0], d = Math.hypot(nx, ny) || 1;
    const near = Math.pow(i / n, 3);                         // only the tip end sways
    const w = Math.sin(i * 0.25 - t * 2.2) * 5 * (i / n) + sway * near * 34;
    P.push([x + nx / d * w, y + ny / d * w]);
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [wk, col, al] of [[5, C.cyan, 0.06], [2.2, C.cyan, 0.2], [1, C.cyanW, 0.85]]) {
    for (let i = 1; i < P.length; i++) {
      const u = i / P.length, wd = (2 + 7 * (1 - u) + 2 * Math.sin(u * 30 - t * 4)) * wk;
      ctx.strokeStyle = rgba(col, al * a); ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(P[i - 1][0], P[i - 1][1]); ctx.lineTo(P[i][0], P[i][1]); ctx.stroke();
    }
  }
  // small leaf-like buds along the stem
  for (let i = 12; i < P.length - 6; i += 17) {
    const [x, y] = P[i], [x2, y2] = P[i + 1], an = Math.atan2(y2 - y, x2 - x) + (i % 2 ? 1 : -1) * 0.9;
    ctx.fillStyle = rgba(C.cyan, 0.45 * a); ctx.beginPath(); ctx.ellipse(x + Math.cos(an) * 9, y + Math.sin(an) * 9, 9, 3.2, an, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  const tip = P[P.length - 1];
  light(ctx, tip[0], tip[1], 120, C.cyan, 0.55 * a);
  light(ctx, tip[0], tip[1], 26, C.cyanW, 0.9 * a);
  return tip;
}

// ---------------------------------------------------------------- the lantern (continuity from the previous chunk)
function lantern(ctx, x, y, r, t, a, seed) {
  if (a <= 0) return;
  const sw = Math.sin(t * 0.9 + seed) * 0.05;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(sw);
  light(ctx, 0, 0, r * 4.2, C.amber, 0.35);
  const body = c => { c.moveTo(-r * 0.62, -r * 1.05); c.bezierCurveTo(-r * 1.15, -r * 0.7, -r * 1.15, r * 0.7, -r * 0.62, r * 1.05); c.lineTo(r * 0.62, r * 1.05); c.bezierCurveTo(r * 1.15, r * 0.7, r * 1.15, -r * 0.7, r * 0.62, -r * 1.05); c.closePath(); };
  grainFill(ctx, body, rad(ctx, -r * 0.2, -r * 0.1, r * 0.1, r * 1.3, [[0, '#fff1d0'], [0.45, '#ffc070'], [1, '#c9702e']]), 0.32, [-r * 2, -r * 2, r * 4, r * 4]);
  ctx.strokeStyle = 'rgba(122,59,23,0.35)'; ctx.lineWidth = Math.max(1, r * 0.03);
  for (const k of [-0.55, 0, 0.55]) { ctx.beginPath(); ctx.moveTo(k * r * 0.95, -r * 1.02); ctx.quadraticCurveTo(k * r * 1.6, 0, k * r * 0.95, r * 1.02); ctx.stroke(); }
  ctx.fillStyle = '#5a2a12'; ctx.fillRect(-r * 0.66, -r * 1.12, r * 1.32, r * 0.12); ctx.fillRect(-r * 0.66, r * 1.0, r * 1.32, r * 0.12);
  ctx.fillStyle = 'rgba(122,59,23,0.55)'; ctx.font = `${Math.round(r * 1.1)}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 0, r * 0.05);
  // flame hint below
  light(ctx, 0, r * 1.15, r * 0.6, '#ffe2b0', 0.6);
  ctx.restore();
}

// ---------------------------------------------------------------- the exam room
const R = rng(338);
const DUST = Array.from({ length: 50 }, () => [R(), R(), R(), R()]);
const SHEETL = Array.from({ length: 9 }, () => 0.35 + R() * 0.6);
const DESK = [[860, 600], [1540, 600], [1640, 700], [780, 700]];   // desk top (seen from above-front)

function room(ctx, t, ft, frozen) {
  // wall
  grainFill(ctx, c => c.rect(-200, -200, W + 400, 840), lin(ctx, 0, 0, 0, 640, [[0, '#0b0d28'], [0.6, '#18173f'], [1, '#221f4c']]), 0.6, [-200, -200, W + 400, 840]);
  // tall window, moonlight
  ctx.save(); ctx.translate(1560, 120);
  ctx.fillStyle = '#05060f'; ctx.fillRect(-14, -14, 268, 408);
  grainFill(ctx, c => c.rect(0, 0, 240, 380), lin(ctx, 0, 0, 0, 380, [[0, '#121a46'], [1, '#2a3672']]), 0.5, [0, 0, 240, 380]);
  ctx.fillStyle = '#05060f'; ctx.fillRect(116, 0, 8, 380); ctx.fillRect(0, 186, 240, 8);
  ctx.restore();
  // wall clock: the test is timed
  ctx.save(); ctx.translate(1130, 190);
  grainFill(ctx, c => c.arc(0, 0, 62, 0, Math.PI * 2), '#0a0a1c', 0.4, [-70, -70, 140, 140]);
  grainFill(ctx, c => c.arc(0, 0, 54, 0, Math.PI * 2), lin(ctx, 0, -54, 0, 54, [[0, '#e6dfcb'], [1, '#a9a196']]), 0.3, [-60, -60, 120, 120]);
  ctx.strokeStyle = '#2a2650'; ctx.lineCap = 'round';
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ctx.lineWidth = k % 3 ? 2 : 4; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 44, Math.sin(a) * 44); ctx.lineTo(Math.cos(a) * 50, Math.sin(a) * 50); ctx.stroke(); }
  const hand = (a, l, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - Math.PI / 2) * l, Math.sin(a - Math.PI / 2) * l); ctx.stroke(); };
  hand(5.2, 28, 5, '#1c1a3a'); hand(0.9 + ft * 0.01, 40, 3.5, '#1c1a3a');
  const sec = Math.floor(ft) + out((ft % 1) / 0.18);                 // ticking second hand
  hand(sec * Math.PI / 30 + 2.0, 46, 2, frozen ? '#d0573a' : '#c9702e');
  ctx.fillStyle = '#1c1a3a'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // floor
  grainFill(ctx, c => c.rect(-200, 640, W + 400, 700), lin(ctx, 0, 640, 0, H, [[0, '#1b1846'], [1, '#08081c']]), 0.6, [-200, 640, W + 400, 700]);
  ctx.fillStyle = 'rgba(4,4,16,0.25)'; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.moveTo(960 + (k - 3.5) * 120, 640); ctx.lineTo(960 + (k - 3.5) * 520, H + 50); ctx.lineTo(960 + (k - 3.5) * 520 + 4, H + 50); ctx.lineTo(960 + (k - 3.5) * 120 + 1, 640); ctx.fill(); }
  // moonlight patch on the floor
  light(ctx, 1500, 860, 420, '#6f7fd8', 0.10);
}

function desk(ctx, t, glowEnv) {
  // legs
  for (const [x, y0, y1] of [[820, 700, 950], [1600, 700, 950], [900, 690, 860], [1500, 690, 860]]) grainFill(ctx, c => c.rect(x - 9, y0, 18, y1 - y0), lin(ctx, x - 9, 0, x + 9, 0, [[0, '#2a2560'], [1, '#100e2a']]), 0.5, [x - 20, y0, 40, y1 - y0]);
  // apron and top
  grainFill(ctx, poly([[780, 700], [1640, 700], [1640, 728], [780, 728]]), '#120f2e', 0.5, [770, 690, 880, 50]);
  grainFill(ctx, poly(DESK), lin(ctx, 0, 600, 0, 700, [[0, '#3a3270'], [1, '#262052']]), 0.55, [770, 590, 880, 120]);
  // exam sheet on the desk, lines and boxes
  ctx.save(); ctx.translate(960, 612); ctx.transform(1, 0, -0.36, 0.62, 0, 0);
  ctx.fillStyle = 'rgba(4,4,16,0.35)'; ctx.fillRect(6, 6, 200, 128);
  grainFill(ctx, c => c.rect(0, 0, 200, 128), lin(ctx, 0, 0, 0, 128, [[0, '#e9e3d2'], [1, '#b9b2a6']]), 0.3, [-10, -10, 230, 150]);
  ctx.fillStyle = 'rgba(40,36,70,0.6)'; ctx.fillRect(14, 12, 90, 7);
  SHEETL.forEach((l, k) => { if (k > 6) return; ctx.strokeStyle = 'rgba(40,36,70,0.55)'; ctx.lineWidth = 2; ctx.strokeRect(14, 30 + k * 13, 8, 8); ctx.fillStyle = 'rgba(40,36,70,0.45)'; ctx.fillRect(30, 32 + k * 13, 150 * l, 3); });
  ctx.restore();
  // pencil
  ctx.save(); ctx.translate(1190, 680); ctx.rotate(-0.12);
  ctx.fillStyle = '#c9702e'; ctx.fillRect(0, 0, 130, 9); ctx.fillStyle = '#ffd29a'; ctx.beginPath(); ctx.moveTo(130, 0); ctx.lineTo(148, 4.5); ctx.lineTo(130, 9); ctx.fill(); ctx.fillStyle = '#7a3b17'; ctx.fillRect(-10, 0, 10, 9);
  ctx.restore();
  // the sealed envelope
  ctx.save(); ctx.translate(1250, 608); ctx.transform(1, 0, -0.36, 0.62, 0, 0);
  const ew = 250, eh = 140;
  ctx.fillStyle = 'rgba(4,4,16,0.4)'; ctx.fillRect(8, 8, ew, eh);
  grainFill(ctx, c => c.rect(0, 0, ew, eh), lin(ctx, 0, 0, ew, eh, [[0, '#efe6cf'], [1, '#bfb39a']]), 0.3, [-10, -10, ew + 20, eh + 20]);
  ctx.strokeStyle = 'rgba(90,70,60,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ew / 2, eh * 0.55); ctx.lineTo(ew, 0); ctx.stroke();
  // wax seal
  grainFill(ctx, c => c.arc(ew / 2, eh * 0.55, 17, 0, Math.PI * 2), rad(ctx, ew / 2 - 5, eh * 0.5, 2, 18, [[0, '#ff8a52'], [1, '#8a2a18']]), 0.3, [ew / 2 - 20, eh * 0.55 - 20, 40, 40]);
  ctx.fillStyle = 'rgba(40,30,50,0.85)'; ctx.font = '25px "Inter SemiBold"'; ctx.letterSpacing = '4px'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('ANSWER KEY', ew / 2 + 3, eh * 0.83);
  ctx.restore();
  light(ctx, 1290, 650, 230, C.cyan, 0.22 * glowEnv);
}

function scene(ctx, t) {
  const ft = Math.min(t, FREEZE);                                 // the world's own clock stops on "Were they?"
  const frozen = t >= FREEZE;
  const z = lerp(1.02, 1.42, ease2((t - 339.0) / (FREEZE + 0.6 - 339.0))) + 0.03 * ramp(t, FREEZE, T1);
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 5) * 4;
  const fx = lerp(900, 1230, sm((t - 339.3) / 4.4)), fy = lerp(560, 640, sm((t - 339.3) / 4.4));
  const layer = (par, fn) => { ctx.save(); ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx + dx * par, -fy + dy * par); fn(); ctx.restore(); };
  layer(0.4, () => room(ctx, t, ft, frozen));
  layer(0.8, () => {
    // the model-cube on the left
    const cb = cube(ctx, 380, 470, 175, 0.6 + 0.4 * Math.sin(ft * 2.1) * 0.5 + 0.3 * ramp(ft, 340.9, 341.5), ft);
    light(ctx, 380, 600, 380, C.cyanD, 0.25);
    desk(ctx, t, ramp(ft, 341.6, 342.6));
    // the tendril: out of the cube's front seam, along the floor, up the desk leg, across the desk top
    const pts = [[430, 690], [560, 780], [700, 850], [800, 880], [828, 820], [835, 740], [880, 690], [990, 640], [1110, 600], [1230, 575], [1330, 590], [1390, 640]];
    const grow = 0.12 + 0.58 * ease2((ft - 338.9) / 2.3) + 0.30 * ease2((ft - 341.3) / 1.4);
    // hunting: the tip sweeps side to side, faster around "hunting", then hovers over the envelope
    const hunt = Math.sin(ft * 3.4) * (0.35 + 0.65 * ramp(ft, 340.8, 341.4)) * (1 - ramp(ft, 342.2, 342.9)) + 0.15 * Math.sin(ft * 1.3);
    tendril(ctx, pts, grow, ft, hunt, 1 - 0.25 * ramp(t, FREEZE, FREEZE + 0.3));
  });
  // drifting dust in the cyan light (keeps moving even when the world freezes)
  for (const [u, v, s, ph] of DUST) {
    const y = ((v + t * 0.02 * (0.5 + s)) % 1) * 900, x = (u * W + Math.sin(t * 0.4 + ph * 9) * 30);
    ctx.fillStyle = rgba(C.cyanW, 0.18 * (0.4 + s)); ctx.beginPath(); ctx.arc(x, H - y, 1 + s * 1.6, 0, Math.PI * 2); ctx.fill();
  }
  // "Were they?": the frame holds its breath, a slow cool shadow closes in
  const fz = ramp(t, FREEZE, FREEZE + 0.5);
  if (fz > 0) {
    ctx.fillStyle = rad(ctx, 1240, 640, 200, 1100, [[0, 'rgba(6,6,22,0)'], [1, rgba('#060616', 0.6 * fz)]]); ctx.fillRect(0, 0, W, H);
  }
}
const ease2 = x => L.ease(x);

function draw(ctx, t) {
  // lantern approach and iris open
  const ir = ease2((t - 338.75) / 1.25);           // 0 = only lantern, 1 = full scene
  const lx = lerp(900, 1040, sm((t - T0) / 1.2)), ly = lerp(760, 560, out((t - T0) / 1.6)), lr = lerp(120, 300, ease2((t - T0) / 1.5));
  if (ir < 1) {
    // night sky with the other lanterns rising away
    grainFill(ctx, c => c.rect(0, 0, W, H), lin(ctx, 0, 0, 0, H, [[0, '#070918'], [0.6, '#151a44'], [1, '#2a2458']]), 0.5, [0, 0, W, H]);
    const k = t - T0;
    lantern(ctx, 420, 360 - k * 40, 46, t, 0.9 * (1 - ir), 1);
    lantern(ctx, 1460, 300 - k * 34, 40, t, 0.9 * (1 - ir), 2);
    lantern(ctx, 1700, 520 - k * 50, 34, t, 0.8 * (1 - ir), 3);
    lantern(ctx, lx, ly, lr, t, 1 - sm(ir * 2.2), 0);
    light(ctx, lx, ly, lr * 2.5, '#ffd9a0', 0.5 * Math.sin(Math.PI * clamp(ir * 1.6)));
  }
  if (ir > 0) {
    const rr = lerp(lr * 0.55, 1300, ir);
    ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, rr, 0, Math.PI * 2); ctx.clip();
    scene(ctx, t);
    // the warm paper edge of the iris
    if (ir < 1) { ctx.strokeStyle = rgba(C.amber, 0.7 * (1 - ir)); ctx.lineWidth = 40 * (1 - ir); ctx.beginPath(); ctx.arc(lx, ly, rr, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
    if (ir < 1) light(ctx, lx, ly, rr * 1.2, C.amber, 0.35 * (1 - ir));
  }
}

module.exports = { T0, T1, draw, cube, grainFill, roundRect, poly, lantern, tendril };
