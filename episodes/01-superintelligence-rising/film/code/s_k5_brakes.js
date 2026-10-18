// "Remember the brakes? That was them."
// Close-up: a heavy brake lever in its slotted steel gate, a warm hand on the knob. The hand pulls it from the cyan
// "run" end of the slot down into the amber "stop" notch; on "brakes" it clicks home and the notch lights up warm.
// Behind, out of focus, the giant rings hang dark.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, out, ease } = L;
const { grainFill, roundRect, cap, glowStroke, cached, cam, tag, handArt } = require('./s_k5_race');

const T0 = 314.4, T1 = 317.6;
const PV = [1180, 1060], RAD = 560;              // pivot (below frame) and handle radius
const A_RUN = -1.22, A_STOP = -2.12;

function bgArt(c) {
  c.fillStyle = lin(c, 0, 0, 0, H, [[0, '#05061a'], [1, '#0d0e2c']]); c.fillRect(-200, -200, W + 400, H + 400);
  for (let k = -1; k < 14; k++) { const x = k * 170; c.fillStyle = k % 2 ? '#0c0e2c' : '#0a0b26'; c.fillRect(x, -200, 160, 1400); }
  // the stopped rings, huge and soft behind
  c.save(); c.filter = 'blur(10px)';
  for (const [rx, ry, rot] of [[620, 720, 0.18], [500, 600, -0.3], [150, 470, 0.55]]) { c.strokeStyle = 'rgba(20,26,64,0.9)'; c.lineWidth = 40; c.beginPath(); c.ellipse(520, 360, rx, ry, rot, 0, 7); c.stroke();
    c.strokeStyle = 'rgba(143,230,255,0.22)'; c.lineWidth = 6; c.beginPath(); c.ellipse(520, 360, rx, ry, rot, 0, 7); c.stroke(); }
  c.restore();
}
function gateArt(c) {
  // the steel gate plate: a sector of an annulus with a slot and two notches
  const r0 = RAD - 120, r1 = RAD + 70, a0 = -2.5, a1 = -0.85;
  c.save(); c.translate(PV[0], PV[1]);
  c.fillStyle = 'rgba(4,4,16,0.55)'; c.beginPath(); c.arc(14, 22, r1, a0, a1); c.arc(14, 22, r0, a1, a0, true); c.closePath(); c.fill();
  grainFill(c, cc => { cc.arc(0, 0, r1, a0, a1); cc.arc(0, 0, r0, a1, a0, true); cc.closePath(); }, lin(c, -400, -600, 300, -300, [[0, '#3a3676'], [0.5, '#24205a'], [1, '#121030']]), 0.5);
  // bolts
  for (const a of [a0 + 0.08, a1 - 0.08, (a0 + a1) / 2]) for (const r of [r0 + 30, r1 - 26]) { c.fillStyle = '#4a4690'; c.beginPath(); c.arc(Math.cos(a) * r, Math.sin(a) * r, 10, 0, 7); c.fill(); c.fillStyle = '#100e26'; c.fillRect(Math.cos(a) * r - 6, Math.sin(a) * r - 1.5, 12, 3); }
  // slot
  c.strokeStyle = '#05051a'; c.lineWidth = 34; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, RAD - 30, A_STOP, A_RUN); c.stroke();
  for (const a of [A_STOP, A_RUN]) { c.beginPath(); c.moveTo(Math.cos(a) * (RAD - 30), Math.sin(a) * (RAD - 30)); c.lineTo(Math.cos(a) * (RAD - 80), Math.sin(a) * (RAD - 80)); c.stroke(); }
  c.restore();
}

function draw(ctx, t) {
  const layer = cam(ctx, t, T0, T1, 1.06, 1.0, 1000, 560, 71, t => lerp(1.08, 1.0, ease((t - 316.2) / 1.4)));
  const pull = ease((t - 314.55) / 0.85), click = Math.exp(-Math.max(0, t - 315.4) * 6) * (t > 315.4);
  const home = ramp(t, 315.3, 315.5), that = Math.exp(-Math.max(0, t - 316.4) * 2.2) * (t > 316.4);
  const a = lerp(A_RUN, A_STOP, pull) + click * 0.02 * Math.sin((t - 315.4) * 40), dep = home * 50;   // drops into the notch
  const r = RAD - 30 - dep, hx = PV[0] + Math.cos(a) * (r + 230), hy = PV[1] + Math.sin(a) * (r + 230);
  layer(0.3, () => cached(ctx, 'k5brk_bg', -200, -200, W + 200, H + 200, bgArt, 0.5));
  layer(0.8, () => {
    cached(ctx, 'k5brk_gate', PV[0] - RAD - 120, PV[1] - RAD - 120, PV[0] + RAD + 120, PV[1] + 40, gateArt, 1);
    // the two ends of the slot: cyan "run", amber "stop"
    const mark = (ang, col, k) => glowStroke(ctx, c => c.arc(PV[0], PV[1], RAD + 40, ang - 0.07, ang + 0.07), col, 5, k);
    mark(A_RUN, C.cyan, 0.5 * (1 - home));
    mark(A_STOP, C.amber, 0.35 + 0.65 * home + 0.5 * that);
    light(ctx, PV[0] + Math.cos(A_STOP) * (RAD + 40), PV[1] + Math.sin(A_STOP) * (RAD + 40), 160 + 120 * click, C.amber, (0.25 + 0.5 * click + 0.35 * that) * home);
    // the lever rod and knob
    const bx = PV[0] + Math.cos(a) * (RAD - 60 - dep), by = PV[1] + Math.sin(a) * (RAD - 60 - dep);
    ctx.fillStyle = 'rgba(4,4,16,0.45)'; ctx.beginPath(); ctx.ellipse(hx + 26, hy + 40, 70, 22, a, 0, 7); ctx.fill();
    grainFill(ctx, c => cap(c, bx, by, hx, hy, 22, 18), lin(ctx, bx - 20, by, bx + 20, by, [[0, '#6a64a8'], [0.5, '#3a3472'], [1, '#1c1844']]), 0.4);
    grainFill(ctx, c => c.arc(hx, hy, 62, 0, 7), rad(ctx, hx - 20, hy - 22, 4, 70, [[0, '#ffd8a8'], [0.45, '#e08a42'], [1, '#6a2e12']]), 0.35);
    // the hand over the knob, sleeve off to the right
    const br = Math.sin(t * 1.6) * 2, gr = r + 140, gx = PV[0] + Math.cos(a) * gr, gy = PV[1] + Math.sin(a) * gr, fa = a - Math.PI / 2;
    // the hand grips the rod just under the knob: fingers wrap across it, wrist toward the upper right
    ctx.save(); ctx.translate(gx - Math.cos(fa) * 70 + br, gy - Math.sin(fa) * 70); ctx.rotate(fa); ctx.scale(1.0, 1.0);
    ctx.save(); ctx.translate(16, 26); ctx.globalAlpha = 0.3; ctx.filter = 'brightness(0)'; cached(ctx, 'k5_hand', -770, -160, 200, 200, handArt, 1); ctx.restore();
    cached(ctx, 'k5_hand', -770, -160, 200, 200, handArt, 1);
    ctx.restore();
    light(ctx, hx, hy, 260, C.amber, 0.12 + 0.2 * home);
  });
  tag(ctx, 'THE BRAKES', 520, 300, ramp(t, 315.35, 315.8), { size: 34, ls: 10, color: '#ffd29a' });
}

module.exports = { T0, T1, draw };
