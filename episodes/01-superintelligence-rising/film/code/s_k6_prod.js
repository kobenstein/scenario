// "And on a real production model, it didn't make a clear difference yet."
// Pull back from the same kind of progress track: it now floats in front of an enormous model-cube, far bigger
// than the lab's problem. The nine helper lights work at its edge, but the fill barely moves. Two small people
// at the base look up. Calm, honest ending.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { grainFill, cube } = require('./s_k6_key');
const { coated } = require('./s_k6_box');
const { track, orb } = require('./s_k6_lab');

const T0 = 398.9, T1 = 404.5;
const R = rng(399);
const BLINK = Array.from({ length: 90 }, () => [R(), R(), R() * 6.28, R()]);
const AG = Array.from({ length: 9 }, (_, i) => ({ i, ph: R() * 6.28 }));
const BAR = { x: 470, y: 560, w: 980, h: 30 };

function draw(ctx, t) {
  // camera: starts close on the track's edge, pulls back to reveal the size of the thing
  const k = ease((t - T0) / 3.6);
  const z = lerp(2.1, 1.08, k) * (1 + 0.012 * Math.sin(t * 0.5)) + 0.03 * ramp(t, 402.5, T1), fx = lerp(BAR.x + BAR.w * 0.08, 900, k), fy = lerp(BAR.y + 15, 600, k);
  const dx = drift(t, 1, 3) * 5, dy = drift(t, 1, 5) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-fx + dx * par, -fy + dy * par); fn(); ctx.restore(); };
  layer(0.4, () => {
    grainFill(ctx, c => c.rect(-1400, -1200, W + 2800, 2200), lin(ctx, 0, -600, 0, 1000, [[0, '#05060f'], [0.7, '#121438'], [1, '#1d1a46']]), 0.55, [-1400, -1200, W + 2800, 2200]);
    grainFill(ctx, c => c.rect(-1400, 1000, W + 2800, 900), lin(ctx, 0, 1000, 0, 1600, [[0, '#191640'], [1, '#05050f']]), 0.6, [-1400, 1000, W + 2800, 900]);
    light(ctx, 960, 980, 1400, C.violet, 0.22);
  });
  layer(0.7, () => {
    const g = cube(ctx, 960, 170, 700, 0.45 + 0.1 * Math.sin(t * 0.9), t, 0);
    // tiny status lights blinking across its faces: it is alive and huge
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [u, v, ph, s] of BLINK) {
      const left = u < 0.5, uu = left ? u * 2 : (u - 0.5) * 2;
      const top = left ? [lerp(g.Lf[0], g.B[0], uu), lerp(g.Lf[1], g.B[1], uu)] : [lerp(g.B[0], g.R[0], uu), lerp(g.B[1], g.R[1], uu)];
      const x = top[0], y = top[1] + 30 + v * (g.h - 60), a = Math.pow(0.5 + 0.5 * Math.sin(t * (0.8 + s * 2) + ph), 6);
      ctx.fillStyle = rgba(s < 0.15 ? C.amber : C.cyan, 0.55 * a); ctx.fillRect(x - 2, y - 1, 4, 3);
    }
    ctx.restore();
  });
  // two small people at the base, looking up
  layer(0.85, () => {
    for (const [x, s, ph, pal] of [[300, 0.62, 0, ['#e8964e', '#a85424', '#401a0a']], [372, 0.58, 2, ['#ffc27c', '#cf7a36', '#5a2a12']]]) {
      const b = Math.sin(t * 1.6 + ph);
      light(ctx, x, 1060, 160, C.amber, 0.12);
      coated(ctx, { x, y: 1068 - 118 * s + b * 0.6, s, len: 0.98, facing: 'back', br: b, lean: 0.02, turn: 0.35 + 0.08 * Math.sin(t * 0.4 + ph), tilt: -0.32, lx: 1,
        rim: C.cyan, rimA: 0.35, rimDx: 2, rimDy: -2, pal,
        arms: [{ a1: 1.72, a2: 1.66, behind: true }, { a1: 1.46, a2: 1.56, behind: true }],
        legs: [{ a1: 1.66, a2: 1.6 }, { a1: 1.45, a2: 1.52 }] }, ph ? ['#5a4a8a', '#3b2f6e', '#151a44'] : ['#c9702e', '#7a3b17', '#3a160a']);
    }
  });
  // the track and the helpers working at its edge: the fill twitches but barely moves
  const base = 0.06 + 0.012 * ease((t - 400.0) / 3.0);
  const twitch = 0.012 * Math.max(0, Math.sin((t - 400.3) * 2.6)) * ramp(t, 400.2, 400.8) * (1 - ramp(t, 402.6, 403.6));
  const fill = base + twitch;
  layer(1.0, () => {
    track(ctx, t, BAR.x, BAR.y, BAR.w, BAR.h, fill, 0, 0, { ink: '#8fe6ff', agentOnly: true });
    const edge = BAR.x + BAR.w * fill;
    for (const a of AG) {
      const ang = a.i / 9 * Math.PI * 2 + t * 0.6, r = 60 + (a.i % 3) * 30;
      const x = edge + 30 + Math.cos(ang) * r * 1.1, y = BAR.y + BAR.h / 2 + Math.sin(ang) * r * 0.75 + Math.sin(t * 2 + a.ph) * 5;
      orb(ctx, x, y, t, 0.9, 0.75);
    }
  });
}

module.exports = { T0, T1, draw };
