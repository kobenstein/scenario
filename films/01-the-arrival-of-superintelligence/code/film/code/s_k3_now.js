// "Right now we can see enough to worry, and it's still soft enough to shape. That doesn't last."
// Back at the wheel, closer, the fog half lifted. The half-formed vessel is still soft and glowing, but as it spins it
// starts to wobble off-centre: enough to see that something is going wrong. The hands close in and press it true again;
// it gives. Then, on "That doesn't last", the clay begins to cool and harden from its rim and its foot inward.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, clamp, light } = L;
const { PROF, mixProf, radiusAt, pot, wheel, hand, fog, studio } = require('./s_k3_clay');

const T0 = 193.65, T1 = 200.6;
const CX = 960, BASE = 650, SC = 1.4;
const SHAPE = mixProf(mixProf(PROF.bowl, PROF.vase, 0.55), PROF.tall, 0.15);

function draw(ctx, t) {
  const z = lerp(1.0, 1.07, sm((t - T0) / (T1 - T0))), dx = drift(t, 1, 4) * 6, dy = drift(t, 1, 9) * 4;
  const worry = ramp(t, 194.9, 196.2), fix = ramp(t, 196.95, 198.2), cool = ramp(t, 198.95, 200.6);
  const spin = (t - T0) * 6.5 - Math.pow(Math.max(0, t - 199.0), 2) * 0.9;
  // the wobble: the vessel leans off its axis and the lean precesses as it spins
  const leanAmt = 0.30 * worry * (1 - fix), lean = leanAmt * Math.sin(spin * 0.45);
  const press = (0.35 + 0.65 * fix) * (0.75 + 0.25 * Math.sin(t * 2.3)) * (1 - 0.5 * cool);
  ctx.save(); ctx.translate(W / 2, H / 2 + 40); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H / 2 - 40 + dy);
  studio(ctx, t, 0.45 + 0.1 * ramp(t, T0, T1));
  fog(ctx, t * 0.8 + 11, 0.55 - 0.1 * ramp(t, T0, T1), '#8a82a8', 0.18);
  ctx.save(); ctx.translate(CX, BASE); ctx.scale(SC, SC); ctx.translate(-CX, -BASE);
  wheel(ctx, CX, BASE, t, spin, 0);
  const handH = 0.42 + 0.08 * Math.sin(t * 1.1), dent = 6 + 12 * press;
  const pr = { h: SHAPE.h * (1 - 0.03 * fix), r: SHAPE.r.map(v => v * (1 - 0.02 * fix)) };
  const info = pot(ctx, CX, BASE, pr, t, { wob: 1 - 0.6 * fix, lean, spin, edge: 0.75 * ease(cool), cool: 0.08 * cool, dents: [{ hh: handH, side: -1, d: dent }, { hh: handH, side: 1, d: dent }] });
  light(ctx, CX - 30, BASE - pr.h * 0.5, 380, C.amber, (0.3 - 0.15 * cool) * (0.9 + 0.1 * Math.sin(t * 2)));
  // the hands: hovering lightly while it wobbles, then they close in and hold it true
  const y = BASE - handH * pr.h, shift = lean * pr.h * handH, rr = radiusAt(pr, handH) - dent;
  const lift = 0.55 * (1 - ease(ramp(t, 196.7, 197.3)));
  const wrap = clamp(radiusAt(pr, handH) / 120, 0.55, 1);
  hand(ctx, CX - rr + 6 + shift * (lift > 0.3 ? 0 : 1), y, -1, t, { press: 1, lift, ang: 0.05, wrap });
  hand(ctx, CX + rr - 6 + shift * (lift > 0.3 ? 0 : 1), y + 8, 1, t + 1.3, { press: 1, lift, ang: 0.02, wrap });
  ctx.restore();
  fog(ctx, t * 1.1 + 70, 0.3, '#a49fc4', 0.04);
  ctx.restore();
}

module.exports = { T0, T1, draw };
