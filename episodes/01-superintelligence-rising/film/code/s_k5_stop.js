// "Do you stop?"  (then three seconds of silence)
// Looking down at the desk: a big emergency stop button with its guard flipped open. Your hand comes in and
// hovers just above it, its shadow on the desk below. It trembles, sinks a little, and stays. Unresolved.
// The knotted ring glows in the window above and is reflected in the glossy desk.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, ease, out } = L;
const { grainFill, roundRect, cap, glowStroke, cached, cam, handArt } = require('./s_k5_race');

const T0 = 284.65, T1 = 288.6;
const BX = 780, BY = 600;                                  // button centre on the desk

function knotPath(c, x, y, s, t) {
  for (let i = 0; i <= 150; i++) { const b = i / 150 * Math.PI * 2 + t * 0.9; const X = (Math.sin(b) + 2 * Math.sin(2 * b)) / 3, Y = (Math.cos(b) - 2 * Math.cos(2 * b)) / 3;
    i ? c.lineTo(x + X * s, y + Y * s * 0.7) : c.moveTo(x + X * s, y + Y * s * 0.7); }
}

function deskArt(c) {
  // window band at the top: dark city, out of focus
  c.fillStyle = lin(c, 0, -100, 0, 230, [[0, '#090a22'], [1, '#1c1a48']]); c.fillRect(-200, -200, W + 400, 440);
  const r = rng(3); let x = -200; while (x < W + 200) { const w = 40 + r() * 90, h = 30 + r() * 110; c.fillStyle = '#121236'; c.fillRect(x, 220 - h, w, h + 20); x += w + 8; }
  c.fillStyle = '#05061a'; c.fillRect(-200, 220, W + 400, 40);
  // the desk, seen from above at an angle
  grainFill(c, cc => { cc.moveTo(-200, 260); cc.lineTo(W + 200, 260); cc.lineTo(W + 200, H + 200); cc.lineTo(-200, H + 200); cc.closePath(); },
    lin(c, 0, 260, 0, H, [[0, '#2a2458'], [0.3, '#1c1844'], [1, '#0a0a1e']]), 0.55);
  c.fillStyle = 'rgba(143,230,255,0.12)'; c.fillRect(-200, 260, W + 400, 3);
  // wood-grain sweeps in the lacquer
  c.strokeStyle = 'rgba(8,8,24,0.35)'; c.lineWidth = 2;
  for (let k = 0; k < 14; k++) { const y = 300 + k * k * 4.2; c.beginPath(); c.moveTo(-200, y); c.bezierCurveTo(500, y + 10, 1200, y - 12, W + 200, y + 6); c.stroke(); }
  // the switch housing: a heavy plate in perspective
  c.save(); c.translate(BX, BY); c.scale(1, 0.58);
  c.fillStyle = 'rgba(4,4,16,0.55)'; c.beginPath(); roundRect(c, -220, -170, 460, 380, 46); c.fill();
  grainFill(c, cc => roundRect(cc, -230, -200, 460, 380, 46), lin(c, -230, -200, 230, 180, [[0, '#3a3472'], [0.5, '#221e4c'], [1, '#0f0d26']]), 0.5);
  grainFill(c, cc => roundRect(cc, -200, -172, 400, 324, 34), lin(c, 0, -172, 0, 152, [[0, '#2a2560'], [1, '#14122e']]), 0.45);
  // hazard ring around the button
  grainFill(c, cc => cc.arc(0, -10, 150, 0, 7), lin(c, 0, -160, 0, 140, [[0, '#ffc27c'], [1, '#a2521f']]), 0.4);
  c.strokeStyle = 'rgba(40,16,6,0.75)'; c.lineWidth = 16;
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; c.beginPath(); c.arc(0, -10, 136, a, a + 0.22); c.stroke(); }
  grainFill(c, cc => cc.arc(0, -10, 118, 0, 7), '#1a1430', 0.5);
  // screws
  for (const [sx, sy] of [[-180, -150], [180, -150], [-180, 130], [180, 130]]) { c.fillStyle = '#4a4488'; c.beginPath(); c.arc(sx, sy, 9, 0, 7); c.fill(); c.fillStyle = '#100e26'; c.fillRect(sx - 6, sy - 1.5, 12, 3); }
  c.restore();
  // hinge of the guard at the back
  c.fillStyle = '#0c0b22'; c.fillRect(BX - 150, BY - 128, 300, 16);
}

function button(ctx, t, pulse) {
  // mushroom button: a stem, then a domed cap, seen from above at an angle
  ctx.save(); ctx.translate(BX, BY - 6);
  grainFill(ctx, c => { c.ellipse(0, 6, 84, 50, 0, 0, Math.PI); c.lineTo(-84, -26); c.ellipse(0, -26, 84, 50, 0, Math.PI, 0, true); c.closePath(); }, lin(ctx, -84, 0, 84, 0, [[0, '#6a1e10'], [0.5, '#a8361c'], [1, '#4a140a']]), 0.45);
  grainFill(ctx, c => c.ellipse(0, -26, 84, 50, 0, 0, 7), rad(ctx, -24, -46, 6, 110, [[0, '#ffb08a'], [0.35, '#f06a3c'], [1, '#8a2a14']]), 0.4);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffd2b0', 0.35); ctx.beginPath(); ctx.ellipse(-26, -46, 26, 10, -0.3, 0, 7); ctx.fill(); ctx.restore();
  ctx.restore();
  light(ctx, BX, BY - 30, 220, '#ff8a50', 0.16 + 0.1 * pulse);
}

function guard(ctx, t) {
  // the clear guard flap, flipped up and back, catching cyan from the window
  ctx.save(); ctx.translate(BX, BY - 122);
  const g = c => { c.moveTo(-150, 0); c.lineTo(150, 0); c.lineTo(170, -230); c.quadraticCurveTo(0, -270, -170, -230); c.closePath(); };
  ctx.fillStyle = rgba('#8fe6ff', 0.10); ctx.beginPath(); g(ctx); ctx.fill();
  ctx.strokeStyle = rgba(C.cyanW, 0.45); ctx.lineWidth = 3; ctx.beginPath(); g(ctx); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, -150, -230, 150, 0, [[0, 'rgba(216,247,255,0)'], [0.45, 'rgba(216,247,255,0.16)'], [0.55, 'rgba(216,247,255,0)']]); ctx.beginPath(); g(ctx); ctx.fill(); ctx.restore();
  ctx.restore();
}

function draw(ctx, t) {
  const layer = cam(ctx, t, T0, T1, 1.0, 1.14, BX + 120, BY - 20, 31);
  const pulse = 0.5 + 0.5 * Math.sin(t * 1.9);
  const breath = Math.sin(t * 1.5);
  layer(0.3, () => {
    cached(ctx, 'k5stop_desk', -200, -200, W + 200, H + 200, deskArt, 1);
    // the knotted ring in the window, soft and far
    ctx.save(); ctx.filter = 'blur(3px)'; glowStroke(ctx, c => knotPath(c, 1180, 120, 120, t), C.cyan, 4, 0.75); ctx.restore();
    light(ctx, 1180, 120, 320, C.cyan, 0.28 + 0.06 * pulse);
    // and its reflection in the lacquer
    ctx.save(); ctx.globalAlpha = 0.35; ctx.filter = 'blur(6px)'; ctx.translate(0, 560); ctx.scale(1, -0.55); glowStroke(ctx, c => knotPath(c, 1180, 120, 120, t), C.cyan, 4, 0.6); ctx.restore();
    light(ctx, 1180, 420, 260, C.cyan, 0.08 + 0.04 * pulse);
  });
  layer(0.6, () => { guard(ctx, t); button(ctx, t, pulse); });
  // your hand: in on "Do you", stops above the button on "stop", then hangs there, trembling
  layer(0.9, () => {
    const come = ease((t - 284.75) / 0.9), sink = ease((t - 286.3) / 1.6) * 18;
    const trem = ramp(t, 285.6, 286.2) * (1.6 * Math.sin(t * 31) * Math.sin(t * 7.3) + 0.8 * Math.sin(t * 19));
    const hx = lerp(1700, BX + 330, come) + trem, hy = lerp(1200, BY + 100, come) + sink + breath * 2 + trem * 0.6;
    const lift = 110 - sink;                                   // height above the desk: the shadow sits apart
    // shadow on the desk/housing
    ctx.save(); ctx.translate(hx - 170, hy + 30 + lift * 0.9); ctx.rotate(-0.55); ctx.scale(1, 0.4);
    ctx.fillStyle = rad(ctx, 0, 0, 0, 170, [[0, `rgba(4,4,16,${0.45 + 0.15 * (1 - lift / 110)})`], [1, 'rgba(4,4,16,0)']]); ctx.fillRect(-170, -170, 340, 340); ctx.restore();
    ctx.save(); ctx.translate(hx, hy); ctx.scale(1, 0.7); ctx.rotate(-2.45); ctx.scale(1.25, 1.25);
    cached(ctx, 'k5_hand', -770, -160, 200, 200, handArt, 1); ctx.restore();
    // warm under-light from the button on the fingers
    light(ctx, hx - 120, hy - 70, 160, '#ff8a50', 0.12 + 0.06 * pulse);
  });
}

module.exports = { T0, T1, draw };
