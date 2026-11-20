// "This summer, we found out what a real lab does. OpenAI was running some of its models through a hacking test,
//  with some safeguards turned down."
// A dark test hall. A light switches on over a sealed glass box. Inside, three small cyan rings (the models) work
// through a little maze of locked doors, probing and opening them. Behind a console, an engineer turns four
// safeguard dials down one by one; their lamps go out and the glow along the box's seams weakens.
// Exports box helpers for s_k5_escape.js.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, stamp, label, out, ease } = L;
const { grainFill, roundRect, cap, glowStroke, cached, cam } = require('./s_k5_race');
const { figure } = require('./s_timeline');

const T0 = 288.3, T1 = 297.7;

// oblique box: x across, y up, z depth (all 0..1)
const BOX = { x: 330, y: 780, w: 720, h: 450, dx: 240, dy: -140 };
const P = (x, y, z, b = BOX) => [b.x + x * b.w + z * b.dx, b.y - y * b.h + z * b.dy];
const poly = (c, pts) => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); };

// the maze on the box floor: wall segments [x0,z0,x1,z1] and doors with locks [x,z]
const WALLS = [[0.33, 0, 0.33, 0.62], [0.66, 0.38, 0.66, 1], [0.0, 0.62, 0.22, 0.62], [0.44, 0.62, 0.66, 0.62], [0.66, 0.38, 0.86, 0.38]];
const LOCKS = [[0.33, 0.78, 294.9], [0.66, 0.2, 295.3], [0.11, 0.62, 295.65], [0.55, 0.62, 296.0], [0.93, 0.38, 296.3]];
const MODELS = [[0.16, 0.3, 0], [0.5, 0.25, 1], [0.82, 0.7, 2]];

function boxBack(ctx, t, seal) {
  // floor, back and left walls: faint glass with a grid
  grainFill(ctx, c => poly(c, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)]), lin(ctx, 0, BOX.y + BOX.dy, 0, BOX.y, [[0, 'rgba(20,60,100,0.65)'], [1, 'rgba(14,40,80,0.8)']]), 0.4);
  ctx.strokeStyle = rgba(C.cyan, 0.10); ctx.lineWidth = 1.2;
  for (let k = 1; k < 8; k++) { let a = P(k / 8, 0, 0), b = P(k / 8, 0, 1); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); a = P(0, 0, k / 8); b = P(1, 0, k / 8); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (const pts of [[P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], [P(0, 0, 0), P(0, 0, 1), P(0, 1, 1), P(0, 1, 0)]]) {
    ctx.fillStyle = 'rgba(30,80,130,0.16)'; ctx.beginPath(); poly(ctx, pts); ctx.fill(); }
  edges(ctx, [[P(0, 0, 1), P(1, 0, 1)], [P(0, 0, 1), P(0, 1, 1)], [P(0, 1, 1), P(1, 1, 1)], [P(1, 0, 1), P(1, 1, 1)], [P(0, 0, 0), P(0, 0, 1)], [P(0, 1, 0), P(0, 1, 1)]], seal * 0.5);
}
function edges(ctx, segs, a) { glowStroke(ctx, c => { for (const [p, q] of segs) { c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); } }, C.cyan, 2, a); }
function boxFront(ctx, t, seal) {
  for (const pts of [[P(0, 0, 0), P(1, 0, 0), P(1, 1, 0), P(0, 1, 0)], [P(1, 0, 0), P(1, 0, 1), P(1, 1, 1), P(1, 1, 0)], [P(0, 1, 0), P(1, 1, 0), P(1, 1, 1), P(0, 1, 1)]]) {
    ctx.fillStyle = 'rgba(143,230,255,0.05)'; ctx.beginPath(); poly(ctx, pts); ctx.fill(); }
  // reflection sweep on the front glass
  ctx.save(); ctx.beginPath(); poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 1, 0), P(0, 1, 0)]); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
  const sx = BOX.x + ((t * 60) % 1400) - 300; ctx.fillStyle = lin(ctx, sx, 0, sx + 260, 0, [[0, 'rgba(216,247,255,0)'], [0.5, 'rgba(216,247,255,0.07)'], [1, 'rgba(216,247,255,0)']]); ctx.fillRect(BOX.x - 100, BOX.y - BOX.h - 200, BOX.w + 400, BOX.h + 400); ctx.restore();
  edges(ctx, [[P(0, 0, 0), P(1, 0, 0)], [P(0, 1, 0), P(1, 1, 0)], [P(0, 0, 0), P(0, 1, 0)], [P(1, 0, 0), P(1, 1, 0)], [P(1, 0, 0), P(1, 0, 1)], [P(1, 1, 0), P(1, 1, 1)], [P(1, 0, 1), P(1, 1, 1)], [P(0, 1, 0), P(0, 1, 1)], [P(0, 1, 1), P(1, 1, 1)]], 0.25 + 0.75 * seal);
  // corner clamps
  for (const [x, y, z] of [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1], [0, 1, 1]]) { const p = P(x, y, z); ctx.fillStyle = '#1c2050'; ctx.fillRect(p[0] - 9, p[1] - 9, 18, 18); ctx.fillStyle = rgba(C.cyan, 0.3 + 0.6 * seal); ctx.fillRect(p[0] - 3, p[1] - 3, 6, 6); }
}

function miniRing(ctx, t, x, y, r, k, i) {
  const p = 0.5 + 0.5 * Math.sin(t * 4 + i);
  light(ctx, x, y, r * 3, C.cyan, 0.25 * k);
  glowStroke(ctx, c => c.ellipse(x, y, r, r * 0.42, 0, 0, 7), C.cyan, 3 + p, 0.9 * k);
  glowStroke(ctx, c => c.ellipse(x, y, r - 2, r * 0.42 - 1, 0, 0, 7), C.cyanW, 1, 0.8 * k);
}

function inside(ctx, t) {
  const mz = ramp(t, 294.4, 294.9);
  // maze walls rise out of the floor on "hacking test"
  for (const [x0, z0, x1, z1] of WALLS) {
    const hh = 0.16 * mz;
    grainFill(ctx, c => poly(c, [P(x0, 0, z0), P(x1, 0, z1), P(x1, hh, z1), P(x0, hh, z0)]), rgba('#2a5a8a', 0.75), 0.3);
    const a = P(x0, hh, z0), b = P(x1, hh, z1); ctx.strokeStyle = rgba(C.cyan, 0.5 * mz); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  // locks on the doors: amber, then they spring open as the models probe them
  LOCKS.forEach(([x, z, to], i) => {
    if (mz <= 0) return;
    const p = P(x, 0.1, z), open = ramp(t, to, to + 0.2), s = 1;
    ctx.save(); ctx.translate(p[0], p[1]); ctx.globalAlpha = mz;
    ctx.strokeStyle = open > 0.5 ? C.cyanW : '#ffcf98'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(0, -10 - open * 8, 9, Math.PI, Math.PI * 2 - open * 1.2); ctx.lineTo(9 - open * 3, -6 - open * 8); ctx.stroke();
    grainFill(ctx, c => roundRect(c, -13, -10, 26, 22, 4), open > 0.5 ? lin(ctx, 0, -10, 0, 12, [[0, C.cyanW], [1, C.cyanD]]) : lin(ctx, 0, -10, 0, 12, [[0, '#ffc488'], [1, '#a2521f']]), 0.3);
    ctx.restore();
    if (open > 0 && open < 1) light(ctx, p[0], p[1], 80, C.cyanW, 0.8 * Math.sin(open * Math.PI));
  });
  // the models: small rings that drift and send probes at the next lock
  const on = ramp(t, 293.5, 294.0);
  MODELS.forEach(([x, z, i]) => {
    const wob = [Math.sin(t * 0.9 + i * 2) * 0.04, Math.cos(t * 0.7 + i) * 0.04];
    const p = P(x + wob[0], 0.42 + 0.03 * Math.sin(t * 1.3 + i), z + wob[1]);
    miniRing(ctx, t, p[0], p[1], 42, 0.25 + 0.75 * on, i);
    // probes toward locks that are about to open
    LOCKS.forEach(([lx, lz, to], j) => {
      if (j % 3 !== i) return; const u = (t - (to - 0.5)) / 0.55; if (u < 0 || u > 1.2) return;
      const q = P(lx, 0.1, lz), k = clamp(u);
      glowStroke(ctx, c => { c.moveTo(p[0], p[1]); c.quadraticCurveTo((p[0] + q[0]) / 2, Math.min(p[1], q[1]) - 60, lerp(p[0], q[0], k), lerp(p[1], q[1], k)); }, C.cyanW, 1.4, 0.8 * (1 - clamp((u - 1) * 5)));
    });
  });
}

function dialPanel(ctx, t) {
  // console in front-right; four safeguard dials turned down one by one on "safeguards turned down"
  const X = 1580, Y = 660;
  grainFill(ctx, c => { c.moveTo(X - 230, Y); c.lineTo(X + 230, Y); c.lineTo(X + 260, Y + 70); c.lineTo(X + 260, H + 100); c.lineTo(X - 260, H + 100); c.lineTo(X - 260, Y + 70); c.closePath(); },
    lin(ctx, 0, Y, 0, Y + 300, [[0, '#2a2658'], [0.25, '#1a1840'], [1, '#0a0a1e']]), 0.5);
  ctx.fillStyle = rgba(C.cyan, 0.15); ctx.fillRect(X - 230, Y, 460, 2);
  const TT = [296.0, 296.3, 296.62, 296.94];
  TT.forEach((td, i) => {
    const cx = X - 168 + i * 112, cy = Y + 92, down = ease((t - td) / 0.35);
    grainFill(ctx, c => c.arc(cx, cy, 42, 0, 7), lin(ctx, cx, cy - 42, cx, cy + 42, [[0, '#3a3470'], [1, '#100e28']]), 0.4);
    grainFill(ctx, c => c.arc(cx, cy, 33, 0, 7), lin(ctx, cx - 30, cy - 30, cx + 30, cy + 30, [[0, '#f3efe2'], [1, '#a49fc4']]), 0.3);
    ctx.strokeStyle = 'rgba(20,16,40,0.6)'; ctx.lineWidth = 2;
    for (let k = 0; k <= 6; k++) { const a = Math.PI * (0.75 + k * 0.25); ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 25, cy + Math.sin(a) * 25); ctx.lineTo(cx + Math.cos(a) * 31, cy + Math.sin(a) * 31); ctx.stroke(); }
    const ang = lerp(Math.PI * 2.15, Math.PI * 0.85, down) + 0.03 * Math.sin(t * 6 + i) * (1 - down);
    ctx.strokeStyle = '#7a3b17'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * 27, cy + Math.sin(ang) * 27); ctx.stroke();
    ctx.fillStyle = '#2a1408'; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill();
    // its lamp
    const lit = 1 - ramp(t, td + 0.1, td + 0.3);
    ctx.fillStyle = lit > 0.5 ? '#ffcf8a' : '#3a2a3a'; ctx.beginPath(); ctx.arc(cx, cy - 66, 7, 0, 7); ctx.fill();
    light(ctx, cx, cy - 66, 40, C.amber, 0.7 * lit);
  });
  return TT;
}

function draw(ctx, t) {
  const layer = cam(ctx, t, T0, T1, 1.0, 1.1, 900, 520, 41);
  const lamp = ramp(t, 288.75, 289.05), flick = 0.95 + 0.05 * Math.sin(t * 9) * Math.sin(t * 2.7);
  const seal = 1 - 0.75 * ramp(t, 296.0, 297.2);
  layer(0.3, () => {
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, '#05061a'], [0.6, '#0e1030'], [1, '#090a20']]); ctx.fillRect(-300, -300, W + 600, H + 600);
    // back wall panels and the floor
    for (let k = 0; k < 9; k++) { const x = -200 + k * 260; grainFill(ctx, c => c.rect(x, 0, 250, 600), lin(ctx, x, 0, x + 250, 0, [[0, '#101236'], [1, '#0b0c28']]), 0.5); }
    grainFill(ctx, c => c.rect(-300, 600, W + 600, 700), lin(ctx, 0, 600, 0, H, [[0, '#1a1a46'], [1, '#08081a']]), 0.5);
    ctx.strokeStyle = 'rgba(120,130,220,0.06)'; ctx.lineWidth = 2; for (let k = 0; k < 8; k++) { const y = 610 + k * k * 8; ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); }
    // overhead lamp: switches on on "summer"
    ctx.fillStyle = '#05061a'; ctx.fillRect(BOX.x + 330, -100, 8, 150);
    grainFill(ctx, c => { c.moveTo(BOX.x + 260, 50); c.lineTo(BOX.x + 410, 50); c.lineTo(BOX.x + 380, 20); c.lineTo(BOX.x + 290, 20); c.closePath(); }, '#141638', 0.4);
    ctx.fillStyle = rgba('#fff3dc', 0.2 + 0.8 * lamp * flick); ctx.fillRect(BOX.x + 268, 48, 134, 6);
    cone(ctx, BOX.x + 335, 54, 140, 900, 720, '#e8f4ff', 0.10 * lamp * flick);
    light(ctx, BOX.x + 335, 54, 260, '#fff3dc', 0.45 * lamp * flick);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(BOX.x + 360, 760); ctx.scale(2.4, 0.35); ctx.fillStyle = rad(ctx, 0, 0, 0, 300, [[0, rgba('#cfe8ff', 0.22 * lamp)], [1, 'rgba(207,232,255,0)']]); ctx.fillRect(-300, -300, 600, 600); ctx.restore();
  });
  layer(0.6, () => {
    // plinth
    grainFill(ctx, c => poly(c, [P(-0.06, 0, -0.08), P(1.06, 0, -0.08), P(1.06, 0, 1.06), P(-0.06, 0, 1.06)]), '#1c1c48', 0.4);
    grainFill(ctx, c => poly(c, [P(-0.06, 0, -0.08), P(1.06, 0, -0.08), [P(1.06, 0, -0.08)[0], P(1.06, 0, -0.08)[1] + 46], [P(-0.06, 0, -0.08)[0], P(-0.06, 0, -0.08)[1] + 46]]), lin(ctx, 0, BOX.y, 0, BOX.y + 60, [[0, '#262458'], [1, '#0e0e28']]), 0.5);
    grainFill(ctx, c => poly(c, [P(1.06, 0, -0.08), P(1.06, 0, 1.06), [P(1.06, 0, 1.06)[0], P(1.06, 0, 1.06)[1] + 46], [P(1.06, 0, -0.08)[0], P(1.06, 0, -0.08)[1] + 46]]), '#0c0c24', 0.5);
    boxBack(ctx, t, seal);
    inside(ctx, t);
    boxFront(ctx, t, seal);
    light(ctx, BOX.x + BOX.w / 2 + 90, BOX.y - BOX.h / 2 - 60, 420, C.cyan, (0.10 + 0.08 * lamp) * (0.6 + 0.4 * seal));
  });
  layer(0.85, () => {
    // the engineer behind the console, reaching to the dials
    const X = 1580, Y = 660, TT = [296.0, 296.3, 296.62, 296.94];
    let ti = TT.findIndex(v => t < v + 0.35); if (ti < 0) ti = 3;
    const reach = ramp(t, 295.55, 295.95) * (1 - ramp(t, 297.25, 297.6));
    const tx = X - 168 + ti * 112, ty = Y + 92;
    const pr = ti > 0 ? X - 168 + (ti - 1) * 112 : tx, k = ti > 0 ? ease((t - (TT[ti - 1] + 0.35)) / 0.25) : 1;
    const hx = lerp(pr, tx, k), br = Math.sin(t * 1.7);
    const F = { x: X + 60, y: Y + 30, s: 1.25, facing: 'front', br, lean: -0.1 * reach, turn: -0.35 + 0.1 * Math.sin(t * 0.5), tilt: 0.3 + 0.1 * reach, lx: -1, grain: 0.35, rim: C.cyan, rimA: 0.55, rimDx: -3, rimDy: -2,
      pal: ['#ffb35c', '#c9702e', '#5a2a12'], legs: [{ a1: Math.PI / 2, a2: Math.PI / 2 }, { a1: Math.PI / 2, a2: Math.PI / 2 }],
      arms: [{ tx: lerp(X - 40, hx + 8, reach), ty: lerp(Y + 40, ty - 6, reach), bend: -1 }, { tx: X + 150, ty: Y + 30, bend: 1 }] };
    figure(ctx, { ...F, noArms: true });
    dialPanel(ctx, t);
    figure(ctx, { ...F, only: 'arms' });
  });
  stamp(ctx, t, 288.85, 291.8, 'Summer 2026', null, { size: 110, y: 800 });
  label(ctx, t, 292.0, T1 + 0.5, 'OpenAI', 'a hacking test, safeguards down', 96, 820);
}

module.exports = { T0, T1, draw, BOX, P, poly, edges, boxBack, boxFront, miniRing };
