// "By September, after more incidents, it had stopped training its most capable models."
// A vast hall: the training machine, three giant cyan rings spinning around a bright core, streams of light racing
// round them. Small amber warning beacons flash one after another ("more incidents"). In the foreground an engineer
// pulls a big brake lever on "stopped"; the rings slow, glide, and come to rest; the light drains out of them.
// Exports scene() for s_k5_brakes.js.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, stamp, label, out, ease } = L;
const { grainFill, roundRect, cap, glowStroke, cached, tag } = require('./s_k5_race');
const { figure, ik } = require('./s_timeline');

const T0 = 308.8, T1 = 314.7;
const TA = 312.15, TB = 314.0;                       // brake pulled / rings at rest
const M = { x: 900, y: 420 };
const RINGS = [{ R: 330, tilt: 0.18, ph: 0.3, w: 0.55 }, { R: 262, tilt: -0.32, ph: 1.9, w: -0.8 }, { R: 196, tilt: 0.55, ph: 3.1, w: 1.1 }];
const LEVER = { x: 1540, y: 925, len: 125 };
const BEACONS = [[360, 610, 310.45], [1450, 590, 310.75], [620, 300, 311.0]];

// spin "time": runs with the clock, then decelerates smoothly to a stop between TA and TB
function spinT(t) { if (t < TA) return t; const D = TB - TA, u = clamp((t - TA) / D); return TA + D * (u - (u * u * u - u * u * u * u / 2)); }

function hallArt(c) {
  c.fillStyle = lin(c, 0, -200, 0, H, [[0, '#04050f'], [0.5, '#0c0e2c'], [1, '#0a0a20']]); c.fillRect(-300, -300, W + 600, H + 600);
  // ribbed back wall
  for (let k = -2; k < 14; k++) { const x = k * 160; grainFill(c, cc => cc.rect(x, -200, 150, 1000), lin(c, x, 0, x + 150, 0, [[0, '#0e1032'], [1, '#090a24']]), 0.5); c.fillStyle = 'rgba(70,80,160,0.12)'; c.fillRect(x, -200, 3, 1000); }
  // floor
  grainFill(c, cc => cc.rect(-300, 780, W + 600, 600), lin(c, 0, 780, 0, H, [[0, '#1c1c48'], [1, '#07071a']]), 0.55);
  c.strokeStyle = 'rgba(120,130,220,0.07)'; c.lineWidth = 2; for (let k = 0; k < 9; k++) { const y = 790 + k * k * 5; c.beginPath(); c.moveTo(-300, y); c.lineTo(W + 300, y); c.stroke(); }
  // the cradle that holds the rings
  for (const s of [-1, 1]) grainFill(c, cc => { cc.moveTo(M.x + s * 200, 800); cc.lineTo(M.x + s * 380, 800); cc.lineTo(M.x + s * 300, 520); cc.lineTo(M.x + s * 250, 520); cc.closePath(); }, lin(c, 0, 520, 0, 800, [[0, '#1e1e4c'], [1, '#0c0c24']]), 0.5);
  grainFill(c, cc => roundRect(cc, M.x - 420, 780, 840, 40, 10), '#141438', 0.5);
  // lever pedestal
  grainFill(c, cc => { cc.moveTo(LEVER.x - 60, 1100); cc.lineTo(LEVER.x - 44, LEVER.y + 20); cc.lineTo(LEVER.x + 44, LEVER.y + 20); cc.lineTo(LEVER.x + 60, 1100); cc.closePath(); }, lin(c, LEVER.x - 70, 0, LEVER.x + 70, 0, [[0, '#2a2658'], [1, '#100e28']]), 0.5);
  grainFill(c, cc => roundRect(cc, LEVER.x - 60, LEVER.y - 10, 120, 36, 10), '#1c1a44', 0.5);
  // the lever's slot, with "run" and "stop" ends marked by colour only
  c.fillStyle = '#05051a'; c.beginPath(); c.arc(LEVER.x, LEVER.y, 30, 0, 7); c.fill();
}

function machine(ctx, t, o) {
  const st = spinT(t), act = o.active;
  light(ctx, M.x, M.y, 640, C.cyan, 0.14 + 0.16 * act);
  for (const r of RINGS) {
    const th = r.ph + r.w * st, rx = Math.max(6, Math.abs(Math.cos(th)) * r.R);
    const back = c => c.ellipse(M.x, M.y, rx, r.R, r.tilt, Math.PI * 0.5, Math.PI * 1.5);
    const front = c => c.ellipse(M.x, M.y, rx, r.R, r.tilt, -Math.PI * 0.5, Math.PI * 0.5);
    // the ring body: a dark band with a cyan edge; light runs round it while training
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = '#141a40'; ctx.lineWidth = 26; ctx.beginPath(); ctx.ellipse(M.x, M.y, rx, r.R, r.tilt, 0, 7); ctx.stroke();
    ctx.strokeStyle = 'rgba(80,110,190,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(M.x, M.y, rx + 12, r.R + 12, r.tilt, 0, 7); ctx.stroke();
    ctx.restore();
    glowStroke(ctx, c => c.ellipse(M.x, M.y, rx, r.R, r.tilt, 0, 7), C.cyan, 3, 0.25 + 0.65 * act);
    glowStroke(ctx, front, C.cyanW, 1.5, 0.2 + 0.6 * act);
    if (act > 0.02) for (let k = 0; k < 7; k++) { const a = st * (2.6 + r.R / 200) * Math.sign(r.w) + k * 0.9, x = Math.cos(a) * rx, y = Math.sin(a) * r.R, X = M.x + x * Math.cos(r.tilt) - y * Math.sin(r.tilt), Y = M.y + x * Math.sin(r.tilt) + y * Math.cos(r.tilt);
      light(ctx, X, Y, 22, C.cyanW, 0.9 * act); }
  }
  // the core
  const p = 0.5 + 0.5 * Math.sin(t * 4.1);
  light(ctx, M.x, M.y, 220, C.cyan, (0.2 + 0.15 * p) * (0.2 + 0.8 * act));
  light(ctx, M.x, M.y, 70, '#ffffff', 0.25 + 0.55 * act);
}

function beacons(ctx, t, o) {
  for (const [x, y, t0] of BEACONS) {
    const on = ramp(t, t0, t0 + 0.08) * (1 - ramp(t, o.offAt ?? 1e9, (o.offAt ?? 1e9) + 0.3));
    ctx.fillStyle = '#0a0a20'; ctx.fillRect(x - 12, y, 24, 18);
    grainFill(ctx, c => { c.moveTo(x - 10, y); c.quadraticCurveTo(x, y - 30, x + 10, y); c.closePath(); }, on > 0 ? '#ffcf8a' : '#3a2a3a', 0.2);
    if (on > 0) { const rot = (t - t0) * 7, f = 0.6 + 0.4 * Math.max(0, Math.cos(rot));
      light(ctx, x, y - 10, 140, C.amber, 0.55 * on * f);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(C.amber, 0.12 * on * f); ctx.beginPath(); ctx.moveTo(x, y - 10);
      ctx.lineTo(x + Math.cos(rot) * 420, y - 10 + Math.sin(rot) * 60 - 40); ctx.lineTo(x + Math.cos(rot) * 420, y - 10 + Math.sin(rot) * 60 + 40); ctx.closePath(); ctx.fill(); ctx.restore(); }
  }
}

function leverHandle(lv) { const a = lerp(-1.05, -2.35, lv); return [LEVER.x + Math.cos(a) * LEVER.len, LEVER.y + Math.sin(a) * LEVER.len, a]; }
function lever(ctx, t, lv, glow) {
  const [hx, hy] = leverHandle(lv);
  // arc track marks: cyan at "run", amber at "stop"
  ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(C.cyan, 0.5); ctx.beginPath(); ctx.arc(LEVER.x, LEVER.y, LEVER.len * 0.6, -1.25, -0.85); ctx.stroke();
  ctx.strokeStyle = rgba(C.amber, 0.6 + 0.4 * glow); ctx.beginPath(); ctx.arc(LEVER.x, LEVER.y, LEVER.len * 0.6, -2.55, -2.15); ctx.stroke();
  grainFill(ctx, c => cap(c, LEVER.x, LEVER.y, hx, hy, 10, 7), lin(ctx, LEVER.x, LEVER.y, hx, hy, [[0, '#3a3472'], [1, '#6a64a8']]), 0.4);
  grainFill(ctx, c => c.arc(hx, hy, 20, 0, 7), rad(ctx, hx - 6, hy - 6, 2, 24, [[0, '#ffd8a8'], [0.5, '#e08a42'], [1, '#7a3b17']]), 0.35);
  ctx.fillStyle = '#2a2458'; ctx.beginPath(); ctx.arc(LEVER.x, LEVER.y, 16, 0, 7); ctx.fill();
  if (glow > 0) { light(ctx, hx, hy, 110, C.amber, 0.55 * glow); glowStroke(ctx, c => c.arc(LEVER.x, LEVER.y, LEVER.len * 0.6, -2.55, -2.15), C.amber, 4, glow); }
}

// right arm: pick the IK solution whose elbow points out and down (away from the spine), whichever way the lever goes
function elbowOut(sx, sy, tx, ty) {
  const e = b => { const [a1] = ik(sx, sy, tx, ty, 57, 53, b); return Math.cos(a1) * 0.8 + Math.sin(a1) * 0.6; };
  return e(1) >= e(-1) ? 1 : -1;
}
function engineer(ctx, t, lv, grip, fx = 1425, up = 0) {
  const [hx, hy] = leverHandle(lv), br = Math.sin(t * 1.6);
  const lean = 0.05 + 0.12 * lv * grip;
  const tx = lerp(fx + 44, hx - 6, grip), ty = lerp(862, hy + 6, grip);
  figure(ctx, { x: fx, y: 850, s: 0.95, facing: 'back', br, lean: lean - 0.12 * lv * grip, turn: 0.15 + 0.2 * Math.sin(t * 0.4) - 0.25 * ramp(t, 312.5, 313.6), tilt: -0.08 - 0.12 * up, lx: 1, grain: 0.35,
    rim: C.cyan, rimA: 0.55, rimDx: -3, rimDy: -2, pal: ['#ffb35c', '#c9702e', '#5a2a12'],
    legs: [{ a1: Math.PI / 2 + 0.1, a2: Math.PI / 2 + 0.06 }, { a1: Math.PI / 2 - 0.12, a2: Math.PI / 2 - 0.05 }],
    arms: [{ a1: Math.PI / 2 + 0.15, a2: Math.PI / 2 + 0.08 + 0.03 * br }, { tx, ty, bend: elbowOut(fx + 39, 854 - 112, tx, ty) }] });
}

// o: { z, fx, fy, active, lv, grip, leverGlow, offAt, after(ctx) }
function scene(ctx, t, o) {
  const dx = drift(t, 1, 61) * 6, dy = drift(t, 1, 62) * 4;
  const layer = (par, fn) => { const zz = 1 + (o.z - 1) * (0.55 + par * 0.45); ctx.save(); ctx.translate(o.sx ?? o.fx, o.sy ?? o.fy); ctx.scale(zz, zz); ctx.translate(-o.fx + dx * par, -o.fy + dy * par); fn(); ctx.restore(); };
  layer(0.3, () => { cached(ctx, 'k5halt_hall', -300, -300, W + 300, H + 300, hallArt, 1); if (o.under) o.under(ctx); });
  layer(0.5, () => { machine(ctx, t, o); beacons(ctx, t, o); if (o.after) o.after(ctx); });
  layer(0.9, () => { engineer(ctx, t, o.lv, o.grip, o.figX, o.up); lever(ctx, t, o.lv, o.leverGlow || 0); });
}

function draw(ctx, t) {
  const lv = ease((t - 312.0) / 0.45), act = 1 - sm((t - TA) / (TB - TA + 0.4));
  scene(ctx, t, { z: lerp(1.0, 1.08, sm((t - T0) / (T1 - T0))), fx: 960, fy: 480, active: act, lv, grip: ramp(t, 311.3, 311.9), offAt: 312.6, leverGlow: 0.4 * ramp(t, 312.3, 312.6) });
  stamp(ctx, t, 309.5, T1 + 0.5, 'September', '2026, after more incidents', { size: 110 });
}

module.exports = { T0, T1, draw, scene, leverHandle, LEVER, M };
