// "In one ending, they patch it up and keep racing. That one doesn't go well for us."
// Cold light. The glowing machine (the same milky orb) has a crack that leaks light. A person slaps a plate over it
// on "patch": the leak dims but still bleeds round the edges. Then the road: the car pulls away fast into fog that
// is thicker than its headlights can reach, and its light thins and is swallowed (sober, no crash).
// Exports machine() for the other ending.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { grainFill, roundRect, blob, pat } = require('./s_k4_gap');
const { orb } = require('./s_k4_quote');
const { road } = require('./s_k4_fog');
const { figure } = require('./s_timeline');

const T0 = 246.70, T1 = 252.70;
const T_PATCH = 248.21, T_CUT = 249.05;

const OX = 1010, OY = 430, ORR = 250;
const THEMES = {
  cold: { bg: ['#040814', '#0b1a30', '#050a16'], floor: ['#0c1a30', '#040812'], metal: ['#24324e', '#0a101e'], rim: C.cyan, lamp: null },
  warm: { bg: ['#120a1c', '#2c1a30', '#0e0814'], floor: ['#2a1a2a', '#0c0810'], metal: ['#4a3448', '#160c18'], rim: '#ffcf8a', lamp: C.amber },
};

// the machine: the orb held in a ring cradle on a pedestal, cables running off to the floor
function machine(ctx, t, th, o) {
  const T = THEMES[th], bob = Math.sin(t * 0.9) * 5, y = OY + bob;
  // cables
  ctx.save(); ctx.lineCap = 'round';
  for (const [x1, y1, w, k] of [[220, 930, 16, 0], [420, 980, 12, 1], [1660, 940, 16, 2], [1880, 900, 12, 3]]) {
    ctx.strokeStyle = '#05070f'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(OX + (x1 < OX ? -90 : 90), 820); ctx.bezierCurveTo(OX + (x1 < OX ? -200 : 200), 900 + k * 4, x1 + (x1 < OX ? 200 : -200), y1 + 10, x1, y1); ctx.stroke();
    ctx.strokeStyle = rgba(T.rim, 0.12); ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.restore();
  // pedestal
  grainFill(ctx, c => { c.moveTo(OX - 150, 840); c.lineTo(OX - 95, 690); c.lineTo(OX + 95, 690); c.lineTo(OX + 150, 840); c.closePath(); }, lin(ctx, OX - 150, 690, OX + 150, 840, [[0, T.metal[0]], [1, T.metal[1]]]), 0.5);
  grainFill(ctx, c => roundRect(c, OX - 190, 830, 380, 40, 10), lin(ctx, 0, 830, 0, 870, [[0, T.metal[0]], [1, T.metal[1]]]), 0.5);
  ctx.strokeStyle = rgba(T.rim, 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(OX - 95, 690); ctx.lineTo(OX + 95, 690); ctx.stroke();
  // ring: back half, orb, front half
  const ring = (a0, a1, col, wd) => { ctx.save(); ctx.translate(OX, y + 20); ctx.rotate(-0.12); ctx.beginPath(); ctx.ellipse(0, 0, ORR * 1.22, ORR * 0.34, 0, a0, a1); ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.stroke(); ctx.restore(); };
  ring(Math.PI, Math.PI * 2, '#0a0f1e', 26); ring(Math.PI, Math.PI * 2, rgba(T.rim, 0.25), 3);
  // posts holding the ring
  for (const sx of [-1, 1]) grainFill(ctx, c => roundRect(c, OX + sx * ORR * 1.16 - 12, y + 10 + sx * 18, 24, 690 - y - 10 - sx * 18, 6), lin(ctx, 0, y, 0, 690, [[0, T.metal[0]], [1, T.metal[1]]]), 0.4);
  orb(ctx, OX, y, ORR, t, o);
  ring(0, Math.PI, '#0c1222', 30); ring(0.15, Math.PI - 0.15, rgba(T.rim, 0.45), 3);
  // rivets on the front of the ring
  for (let k = 1; k < 9; k++) { const a = k / 9 * Math.PI, rx = Math.cos(a) * ORR * 1.22, ry = Math.sin(a) * ORR * 0.34, c = Math.cos(-0.12), s = Math.sin(-0.12);
    ctx.fillStyle = rgba(T.rim, 0.5); ctx.beginPath(); ctx.arc(OX + rx * c - ry * s, y + 20 + rx * s + ry * c, 3.5, 0, Math.PI * 2); ctx.fill(); }
  return y;
}
// a point on the orb's crack (unit coords from s_k4_quote CRACK)
const CRACKP = [[0.02, -0.62], [0.14, -0.52], [0.20, -0.56], [0.30, -0.42], [0.38, -0.45], [0.47, -0.30], [0.55, -0.32], [0.66, -0.16]];

function room(ctx, th, t) {
  const T = THEMES[th];
  grainFill(ctx, c => c.rect(-300, -300, W + 600, H + 600), lin(ctx, 0, 0, 0, H, [[0, T.bg[0]], [0.6, T.bg[1]], [1, T.bg[2]]]), 0.55);
  // tall back-wall ribs
  for (let i = 0; i < 9; i++) { const x = 60 + i * 230; ctx.fillStyle = 'rgba(3,4,12,0.35)'; ctx.fillRect(x, -100, 26, 960); }
  grainFill(ctx, c => { c.moveTo(-300, 820); c.lineTo(W + 300, 820); c.lineTo(W + 300, H + 300); c.lineTo(-300, H + 300); c.closePath(); }, lin(ctx, 0, 820, 0, H, [[0, T.floor[0]], [1, T.floor[1]]]), 0.55);
  ctx.strokeStyle = rgba(T.rim, 0.15); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-300, 820); ctx.lineTo(W + 300, 820); ctx.stroke();
}

function sceneMachine(ctx, t) {
  const z = lerp(1.0, 1.06, sm((t - T0) / (T_CUT + 0.4 - T0)));
  const dx = drift(t, 0.9, 41) * 6, dy = drift(t, 0.9, 42) * 4;
  ctx.save(); ctx.translate(OX, OY + 100); ctx.scale(z, z); ctx.translate(-OX + dx, -OY - 100 + dy);
  room(ctx, 'cold', t);
  blob(ctx, OX, 860, 520, 60, C.cyan, 0.22, true);
  const patch = ramp(t, T_PATCH - 0.03, T_PATCH + 0.05);
  const y = machine(ctx, t, 'cold', { crack: 1, patch });
  // the patch: a dull plate with tape across it, slapped on over the middle of the crack
  const pc = [OX + 0.36 * ORR, y - 0.40 * ORR];
  if (patch > 0) {
    const sq = 1 + 0.12 * Math.exp(-(t - T_PATCH) * 10) * Math.sin((t - T_PATCH) * 40);
    ctx.save(); ctx.translate(pc[0], pc[1]); ctx.rotate(0.62); ctx.scale(sq, sq); ctx.globalAlpha = patch;
    // light still bleeding round the edges
    blob(ctx, 0, 0, 120, 80, C.cyanW, 0.25 * (0.7 + 0.3 * Math.sin(t * 9) * Math.sin(t * 3.7)), true);
    grainFill(ctx, c => roundRect(c, -95, -48, 190, 96, 8), lin(ctx, -95, -48, 95, 48, [[0, '#5a6680'], [1, '#2a3248']]), 0.55);
    for (const xx of [-60, 0, 60]) { ctx.fillStyle = rgba('#c9c4b0', 0.55); ctx.fillRect(xx - 12, -62, 24, 124); }
    for (const [xx, yy] of [[-80, -34], [80, -34], [-80, 34], [80, 34]]) { ctx.fillStyle = '#1a2030'; ctx.beginPath(); ctx.arc(xx, yy, 5, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  // the person: from behind, a little to the right, slapping the plate on with the left hand, then stepping back
  const fx = 1275, s = 1.5, b = Math.sin(t * 1.7);
  const reach = ramp(t, 247.4, 248.1), slap = ramp(t, 248.05, T_PATCH), back = ramp(t, 248.6, 249.1);
  const hand = [lerp(lerp(fx - 60, pc[0] + 70, reach), pc[0] + 6, slap), lerp(lerp(700, pc[1] - 30, reach), pc[1], slap)];
  hand[0] = lerp(hand[0], fx - 70, back); hand[1] = lerp(hand[1], 720, back);
  const hipY = 820 - 150 * s;
  ctx.save(); ctx.fillStyle = 'rgba(2,3,10,0.5)'; ctx.beginPath(); ctx.ellipse(fx, 822, 90, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  dressed(ctx, { x: fx + 12 * back, y: hipY + b * 1.2, s, facing: 'back', br: b, lean: lerp(-0.03, -0.07, reach) * (1 - back), turn: -0.55, tilt: 0.05, lx: -1, grain: 0.38,
    rim: C.cyan, rimA: 0.6, rimDx: -3, rimDy: -1, pal: ['#d8955a', '#8a4a22', '#2e1408'], hair0: '#2a1208', coatLen: 1.0,
    legs: [{ a1: Math.PI / 2 + 0.2 * (1 - back) + 0.04, a2: Math.PI / 2 + 0.02 }, { a1: Math.PI / 2 - 0.1, a2: Math.PI / 2 + 0.04 }],
    arms: [{ tx: hand[0], ty: hand[1], bend: 1 }, { a1: Math.PI / 2 - 0.15, a2: Math.PI / 2 - 0.4 + 0.05 * Math.sin(t * 1.3) }] });
  ctx.restore();
}

function sceneRoad(ctx, t) {
  const u = clamp((t - T_CUT) / (T1 - T_CUT));
  const go = ease(clamp((t - 249.2) / 3.2));
  const carZ = lerp(7.5, 80, go * go);
  const camS = (t - T_CUT) * 14;                                      // the camera follows, slower than the car
  const thick = ramp(t, 249.5, 251.9);
  const dx = drift(t, 0.9, 43) * 6, dy = drift(t, 0.9, 44) * 4;
  ctx.save(); ctx.translate(dx, dy);
  road(ctx, t, { v: 30, s: camS + carZ, carZ, carX: 1.6, camX: 1.0, pal: 'cold', fog: lerp(38, 16, thick), reach: 34, bounce: 1.3, lamps: 1 - 0.55 * thick });
  ctx.restore();
  // the world dims as the light thins
  ctx.fillStyle = rgba('#02040a', 0.5 * ramp(t, 250.4, 252.4)); ctx.fillRect(0, 0, W, H);
}

// a person in a coat and dark trousers, built on the shared rig
function dressed(ctx, f) {
  const s = f.s;
  figure(ctx, Object.assign({}, f, { pal: f.trousers || ['#2a2440', '#16122a', '#08060f'], rimA: (f.rimA ?? 0.6) * 0.5 }));
  const cs = Math.cos(f.lean || 0), sn = Math.sin(f.lean || 0), P = (x, y) => [f.x + x * cs - y * sn, f.y + x * sn + y * cs];
  const len = 118 * s, sw = 47 * s, hw = 34 * s, hem = 74 * s * (f.coatLen ?? 1), fl = Math.sin(ctx.__t || 0) * 0;
  const coat = c => { let p = P(-sw * 0.6, -len * 1.02); c.moveTo(p[0], p[1]);
    let a = P(-sw * 1.05, -len * 0.98), b = P(-sw * 1.02, -len * 0.8); c.quadraticCurveTo(a[0], a[1], b[0], b[1]);
    a = P(-sw * 1.0, -len * 0.3); b = P(-hw * 1.45, hem); c.quadraticCurveTo(a[0], a[1], b[0], b[1]);
    a = P(0, hem + 8 * s); b = P(hw * 1.45, hem); c.quadraticCurveTo(a[0], a[1], b[0], b[1]);
    a = P(sw * 1.0, -len * 0.3); b = P(sw * 1.02, -len * 0.8); c.quadraticCurveTo(a[0], a[1], b[0], b[1]);
    a = P(sw * 1.05, -len * 0.98); b = P(sw * 0.6, -len * 1.02); c.quadraticCurveTo(a[0], a[1], b[0], b[1]);
    a = P(0, -len * 0.94); c.quadraticCurveTo(a[0], a[1], P(-sw * 0.6, -len * 1.02)[0], P(-sw * 0.6, -len * 1.02)[1]); c.closePath(); };
  const Lx = f.lx ?? -1;
  if (f.rim) { ctx.save(); ctx.translate(f.rimDx ?? -3, f.rimDy ?? -1); grainFill(ctx, coat, rgba(f.rim, f.rimA ?? 0.6), 0); ctx.restore(); }
  grainFill(ctx, coat, lin(ctx, f.x + Lx * sw, f.y - len, f.x - Lx * sw, f.y + hem, [[0, f.pal[0]], [0.5, f.pal[1]], [1, f.pal[2]]]), 0.42);
  // back seam, belt line and a fold
  const q1 = P(0, -len * 0.9), q2 = P(2 * s, hem - 4 * s), b1 = P(-sw * 0.95, -len * 0.05), b2 = P(sw * 0.95, -len * 0.05);
  ctx.save(); ctx.strokeStyle = rgba('#2a1004', 0.45); ctx.lineWidth = 2.5 * s; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(b1[0], b1[1]); ctx.quadraticCurveTo((b1[0] + b2[0]) / 2, b1[1] + 5 * s, b2[0], b2[1]); ctx.stroke();
  ctx.restore();
  // sleeves over the coat
  return figure(ctx, Object.assign({}, f, { only: 'arms', rim: null }));
}

let BUF = null;
function buf() { if (!BUF) { const c = L.createCanvas(W, H); BUF = { c, x: c.getContext('2d') }; } return BUF; }
function draw(ctx, t) {
  const x = ramp(t, T_CUT - 0.15, T_CUT + 0.3);
  if (x < 1) sceneMachine(ctx, t);
  if (x >= 1) sceneRoad(ctx, t);
  else if (x > 0) { const b = buf(); b.x.save(); b.x.fillStyle = '#070918'; b.x.fillRect(0, 0, W, H); sceneRoad(b.x, t); b.x.restore(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = x; ctx.drawImage(b.c, 0, 0); ctx.restore(); }
  L.label(ctx, t, 247.13, T1 + 1, 'Ending one', 'They patch it and keep racing', 110, 100, { color: C.cyan });
}

module.exports = { T0, T1, draw, dressed, machine, room, THEMES, OX, OY, ORR, CRACKP };
