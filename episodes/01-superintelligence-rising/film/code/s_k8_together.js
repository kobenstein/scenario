// "Can competitors agree on that? It's happened before."
// The same four runners, level now. On "agree" they glance at one another and, together, ease from a run to a walk,
// side by side. The cold glow ahead warms toward dawn.
const { scene, KITS } = require('./s_k8_race');
const { ramp, sm } = require('./lib');

const T0 = 511.25, T1 = 515.0;
const slow = t => 1 - 0.85 * ramp(t, 512.55, 513.9);
const glance = (a, b) => t => sm((t - a) / 0.3) * (1 - sm((t - b) / 0.4));
const CFG = {
  T0, T1, cache: {}, camCache: {}, camG: slow, zoom: 1.08,
  warm: t => ramp(t, 512.6, 514.4),
  runners: [
    { lane: 0, x0: 1250, g: slow, gl: t => glance(511.85, 512.7)(t) * 0.9, kit: KITS[1], ph: 1.3 },
    { lane: 1, x0: 1110, g: slow, gl: t => glance(511.95, 512.8)(t) * 0.8 - glance(513.7, 514.6)(t) * 0.6, kit: KITS[2], ph: 3.9 },
    { lane: 2, x0: 960, g: slow, gl: t => -glance(512.05, 512.9)(t) * 0.8, kit: KITS[3], ph: 0.4 },
    { lane: 3, x0: 800, g: slow, gl: t => -glance(511.8, 512.75)(t) * 0.9 - glance(513.9, 514.9)(t) * 0.5, kit: KITS[0], ph: 2.2 },
  ],
};
function draw(ctx, t) { scene(ctx, t, CFG); }
module.exports = { T0, T1, draw };
