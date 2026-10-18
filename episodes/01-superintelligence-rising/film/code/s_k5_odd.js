// "Your AI just did something you can't explain."
// Same office, the camera leans in toward your lab's ring. On "did" it stands up and pinches through itself
// into a figure eight, then into a knot no ring can make, and keeps turning. The floors below flicker.
// The rival rings on the horizon stay ordinary.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rgba, light, ease, out } = L;
const { glowStroke } = require('./s_k5_race');
const { scene, RIVALS, RING } = require('./s_k5_office');

const T0 = 281.2, T1 = 284.95;

function knot(ctx, t) {
  const f1 = ease((t - 282.55) / 0.7), f2 = ease((t - 283.2) / 0.75), flash = Math.exp(-Math.max(0, t - 282.67) * 4) * (t > 282.67);
  const spin = (t - 282.5) * 0.9 * (f1 > 0 ? 1 : 0);
  const rx = RING.rx, ry = lerp(RING.ry, 120, f1);
  const pt = (a, off = 0) => {
    const b = a + spin;
    const e = [Math.cos(a), Math.sin(a)];                                       // the ring
    const l = [Math.cos(b) * 1.05, Math.sin(2 * b) * 0.85];                      // figure eight
    const k = [(Math.sin(b) + 2 * Math.sin(2 * b)) / 3, (Math.cos(b) - 2 * Math.cos(2 * b)) / 3]; // trefoil knot
    const x = lerp(lerp(e[0], l[0], f1), k[0], f2), y = lerp(lerp(e[1], l[1], f1), k[1], f2);
    return [RING.x + x * rx * (1 + off), RING.y - 46 * f1 + y * ry * (1 + off) + off * 30 * Math.sin(3 * b)];
  };
  const path = off => c => { for (let i = 0; i <= 180; i++) { const q = pt(i / 180 * Math.PI * 2, off); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); } };
  const p = 0.5 + 0.5 * Math.sin(t * 5.3);
  light(ctx, RING.x, RING.y, 380, C.cyan, 0.2 + 0.1 * p + 0.5 * flash);
  // the band: two strands that should stay apart cross through each other
  glowStroke(ctx, path(0.06 * f1), C.cyan, 2, 0.5 * f1);
  glowStroke(ctx, path(0), C.cyan, 5.5 + 1.5 * p + 4 * flash, 0.85);
  glowStroke(ctx, path(0), C.cyanW, 1.8, 0.8);
  // the crossings flare where it passes through itself
  if (f1 > 0.5) for (let i = 0; i < 3; i++) { const q = pt(i * 2.09 + 0.5); light(ctx, q[0], q[1], 30, C.cyanW, 0.5 * (0.5 + 0.5 * Math.sin(t * 9 + i * 2))); }
  for (let i = 0; i < 12; i++) { const q = pt(t * 1.3 + i * 0.52); light(ctx, q[0], q[1], 9, C.cyanW, 0.8 * (0.5 + 0.5 * Math.sin(t * 8 + i))); }
  if (flash > 0.02) glowStroke(ctx, c => c.ellipse(RING.x, RING.y, rx * (1 + 1.2 * (1 - flash)), ry * (1 + 1.2 * (1 - flash)), 0, 0, 7), C.cyanW, 2, flash * 0.7);
}

function draw(ctx, t) {
  const z = lerp(1.1, 1.55, ease((t - T0) / (T1 - T0 + 0.6)));
  const glitch = t > 282.67 ? 0.75 + 0.25 * Math.sin(t * 23) * Math.sin(t * 7.7) : 1;
  scene(ctx, t, { slide: 1, enter: 1, labOn: glitch, rivals: RIVALS.map(r => [r[0], r[1], r[2], 0]), ringK: 0, z, fx: 960, fy: 330, after: c => knot(c, t) });
}

module.exports = { T0, T1, draw };
