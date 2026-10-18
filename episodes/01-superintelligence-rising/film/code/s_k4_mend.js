// "In the other, they slow down long enough to understand the problem and actually fix it."
// Warm light. The car brakes and comes to a stop in an amber fog (brake lights on "slow down"). Then the machine:
// a work lamp clicks on, the milky orb clears so you can see the structure inside ("understand"), and a person
// traces the crack with a finger while it is sealed in glowing gold ("fix it").
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { grainFill, roundRect, blob } = require('./s_k4_gap');
const { road } = require('./s_k4_fog');
const { dressed, machine, room, OX, OY, ORR, CRACKP } = require('./s_k4_patch');

const T0 = 252.40, T1 = 257.80;
const T_STOP = [253.45, 254.3], T_CUT = 254.4, T_LAMP = 254.55, T_SEE = [254.75, 255.9], T_FIX = [256.25, 257.25];

const vel = t => 15 * (1 - ease(clamp((t - T_STOP[0]) / (T_STOP[1] - T_STOP[0]))));
function dist(t) { const n = 50, h = (t - T0) / n; let s = 0; for (let i = 0; i < n; i++) s += vel(T0 + (i + 0.5) * h) * h; return s; }

function sceneRoad(ctx, t) {
  const z = lerp(1.0, 1.04, sm((t - T0) / 2));
  const dx = drift(t, 0.9, 51) * 6, dy = drift(t, 0.9, 52) * 4;
  const br = ramp(t, T_STOP[0] - 0.1, T_STOP[0] + 0.15);
  // the car dips forward as it stops, then settles
  const dip = Math.sin(clamp((t - T_STOP[1] + 0.25) / 0.7) * Math.PI) * 4;
  ctx.save(); ctx.translate(W / 2, H * 0.6); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H * 0.6 + dy + dip * 0.3);
  road(ctx, t, { v: vel(t), s: dist(t), carZ: lerp(6.8, 6.2, ease(clamp((t - T_STOP[0]) / 1.3))), carX: 1.6, camX: 1.0, pal: 'warm', fog: 40, reach: 30, bounce: 0.3 + vel(t) / 20, brake: br });
  ctx.restore();
}

function sceneMachine(ctx, t) {
  const z = lerp(1.0, 1.09, sm((t - T_CUT) / (T1 - T_CUT)));
  const dx = drift(t, 0.9, 53) * 6, dy = drift(t, 0.9, 54) * 4;
  const lamp = ramp(t, T_LAMP, T_LAMP + 0.12) * (0.94 + 0.06 * Math.sin(t * 9) * Math.sin(t * 2.3));
  const clar = ease(clamp((t - T_SEE[0]) / (T_SEE[1] - T_SEE[0])));
  const seam = clamp((t - T_FIX[0]) / (T_FIX[1] - T_FIX[0]));
  ctx.save(); ctx.translate(OX, OY + 60); ctx.scale(z, z); ctx.translate(-OX + dx, -OY - 60 + dy);
  room(ctx, 'warm', t);
  // the work lamp on a stand, left, aimed at the orb
  const LX = 420, LY = 330;
  ctx.save(); ctx.strokeStyle = '#0c0812'; ctx.lineCap = 'round';
  ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(LX - 40, 820); ctx.lineTo(LX - 40, LY + 70); ctx.lineTo(LX, LY + 20); ctx.stroke();
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(LX - 90, 822); ctx.lineTo(LX - 40, 790); ctx.lineTo(LX + 10, 822); ctx.stroke();
  ctx.translate(LX, LY); ctx.rotate(0.38);
  grainFill(ctx, c => { c.moveTo(-30, -26); c.lineTo(34, -40); c.lineTo(34, 40); c.lineTo(-30, 26); c.closePath(); }, lin(ctx, 0, -40, 0, 40, [[0, '#4a3448'], [1, '#160c18']]), 0.4);
  ctx.fillStyle = rgba('#fff1d6', 0.2 + 0.8 * lamp); ctx.fillRect(32, -36, 6, 72);
  // its beam
  ctx.globalCompositeOperation = 'lighter';
  for (const [wd, a] of [[1.15, 0.035], [0.95, 0.04], [0.75, 0.05], [0.55, 0.06], [0.35, 0.07]]) {
    ctx.fillStyle = lin(ctx, 36, 0, 760, 0, [[0, rgba('#ffe6b8', a * 2.2 * lamp)], [1, rgba('#ffcf8a', 0)]]);
    ctx.beginPath(); ctx.moveTo(36, -36 * wd); ctx.lineTo(820, -330 * wd); ctx.lineTo(820, 330 * wd); ctx.lineTo(36, 36 * wd); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  light(ctx, LX + 30, LY + 12, 120, '#ffe6b8', 0.7 * lamp);
  blob(ctx, OX, 860, 560, 70, C.amber, 0.28 * lamp, true);
  const y = machine(ctx, t, 'warm', { crack: 1, clarity: clar, seam, lamp, warm: 0.15 * lamp + 0.25 * clar + 0.6 * ease(clamp((t - T_FIX[0] - 0.3) / 1.0)) });
  // where the light falls on the orb, warmer
  // the person: from behind on the right, leaning in to look, then tracing the crack while it seals
  const P = CRACKP.map(([a, b]) => [OX + a * ORR, y + b * ORR]);
  const k = seam * (P.length - 1), i = Math.min(P.length - 2, Math.floor(k)), f = k - i;
  const tip = seam > 0 ? [lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)] : P[0];
  const fx = 1300, s = 1.5, b = Math.sin(t * 1.6);
  const lookIn = ramp(t, 254.5, 255.4), reach = ramp(t, 255.7, T_FIX[0]), done = ramp(t, T_FIX[1] + 0.05, T_FIX[1] + 0.5);
  const hand = [lerp(lerp(fx - 50, fx - 120, lookIn), tip[0] + 4, reach), lerp(lerp(700, 560, lookIn), tip[1] + 2, reach)];
  hand[0] = lerp(hand[0], P[P.length - 1][0] + 40, done); hand[1] = lerp(hand[1], P[P.length - 1][1] + 40, done);
  const hipY = 820 - 150 * s;
  ctx.save(); ctx.fillStyle = 'rgba(8,4,10,0.5)'; ctx.beginPath(); ctx.ellipse(fx, 822, 90, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  dressed(ctx, { x: fx, y: hipY + b * 1.2, s, facing: 'back', br: b, lean: lerp(-0.02, -0.07, lookIn), turn: lerp(-0.3, -0.6, lookIn), tilt: lerp(0, 0.1, lookIn), lx: -1, grain: 0.38,
    rim: '#ffcf8a', rimA: 0.55, rimDx: -3, rimDy: -1, pal: ['#ffc27c', '#d0783a', '#5a2a12'], hair0: '#3a1a0c', trousers: ['#3a2a44', '#1c1426', '#0a0610'], coatLen: 1.0,
    legs: [{ a1: Math.PI / 2 + 0.2, a2: Math.PI / 2 + 0.04 }, { a1: Math.PI / 2 - 0.1, a2: Math.PI / 2 + 0.04 }],
    arms: [{ tx: hand[0], ty: hand[1], bend: 1 }, { a1: Math.PI / 2 - 0.15, a2: Math.PI / 2 - 0.45 + 0.05 * Math.sin(t * 1.3) }] });
  // a spark of warm light at the fingertip while it seals
  if (seam > 0 && seam < 1) light(ctx, tip[0], tip[1], 70, '#ffe6b8', 0.8);
  // warm sparks drifting up from the mended seam
  if (seam > 0) { const R = rng(9); for (let n = 0; n < 24; n++) { const ph = (t * 0.6 + R()) % 1, p = P[Math.floor(R() * P.length)], a = Math.sin(ph * Math.PI) * 0.7 * Math.min(1, seam * 3);
    if (R() > seam + 0.1) continue; ctx.fillStyle = rgba('#ffd9a0', a); ctx.fillRect(p[0] + Math.sin(t + n) * 14 + (R() - 0.5) * 30, p[1] - ph * 120, 3, 3); } }
  ctx.restore();
}

let BUF = null;
function buf() { if (!BUF) { const c = L.createCanvas(W, H); BUF = { c, x: c.getContext('2d') }; } return BUF; }
function draw(ctx, t) {
  const x = ramp(t, T_CUT - 0.15, T_CUT + 0.3);
  if (x < 1) sceneRoad(ctx, t);
  if (x >= 1) sceneMachine(ctx, t);
  else if (x > 0) { const b = buf(); b.x.save(); b.x.fillStyle = '#070918'; b.x.fillRect(0, 0, W, H); sceneMachine(b.x, t); b.x.restore(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = x; ctx.drawImage(b.c, 0, 0); ctx.restore(); }
  L.label(ctx, t, 252.75, T1 + 1, 'Ending two', 'They slow down and fix it', 110, 100, { color: C.amber });
}

module.exports = { T0, T1, draw };
