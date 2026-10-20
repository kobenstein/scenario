// v5 · Endloser Zoom (Powers of Ten), inside the one shared space (space.mjs): one continuous flight, never a cut.
// The camera rises from the roof over your shoulder into the rosette of light above the city; the light engraves the certificate it
// holds; the flight keeps going, into the foil seal; the seal spools a thread, and the camera rides the laying point out along
// Alaska's coast until it eases to rest on seal and coast together. Scale moves at a constant pace in log space while it travels.
import { W, H, clamp, lin, sm, mix } from '../05-share/engine.mjs';
import { drawWorld, ROOF, ROS } from './worlds.mjs';
import { drawSky, Z, SC, SEAL, AKC, akTip } from './space.mjs';
import { aim, nearFade, qio } from './motion.mjs';

// monotone cubic (Fritsch–Carlson): smooth, no overshoot, flat at turning points
function mono(keys) {
  const n = keys.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  m[0] = 0; m[n - 1] = 0;
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : 3 * (d[i - 1] + d[i]) / (2 * d[i - 1] / d[i] + d[i] / d[i - 1] + 4);
  return (t) => {
    if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
    let i = 0; while (t > keys[i + 1][0]) i++;
    const h = keys[i + 1][0] - keys[i][0], s = (t - keys[i][0]) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * keys[i][1] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * keys[i + 1][1] + (s3 - s2) * h * m[i + 1];
  };
}
// scale of the sky plane on screen, in log space: rest → rosette → certificate → seal → out along the coast
const LK = mono([[0, 0], [1.5, Math.log(1.06)], [3.7, Math.log(2.0)], [5.5, Math.log(2.75)], [7.15, Math.log(5.2)], [7.55, Math.log(5.25)], [9.6, Math.log(2.45)], [10, Math.log(2.42)]]);
const DZ = mono([[0, 0], [1.5, .12], [3.5, 1.55], [10, 1.6]]);   // the dolly: you, the railing and the near towers pass under the camera
const U = (t) => { const x = clamp((t - 6.9) / 2.6); return x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };
const P2 = (a, b, u) => [mix(a[0], b[0], u), mix(a[1], b[1], u)];

function focus(t) {
  const cert = [SC.x, SC.y], ros = [ROS.x, ROS.y - 60];
  let f = P2(ros, cert, qio(lin(1.9, 4.2, t)));                       // the rosette, then the certificate it holds
  f = P2(f, SEAL, qio(lin(5.3, 7.15, t)));                            // into the seal
  const tip = akTip(Math.max(.02, U(t)), t), end = P2(SEAL, AKC, .62);
  f = P2(f, P2(SEAL, tip, .55), sm(lin(7.2, 8.3, t)));                // ride along the thread, a little behind the laying point
  f = P2(f, end, sm(lin(8.6, 9.8, t)));                               // settle on seal and coast together
  return f;
}
function camAt(t) {
  const k = Math.exp(LK(t)), dz = DZ(t), zoom = k / (Z / (Z - dz));
  const r = .018 * Math.sin(t * .55) * (1 - sm(lin(8.8, 10, t))) - .01 * sm(lin(3, 6, t)) * (1 - sm(lin(7, 9.5, t)));
  const w = sm(lin(.4, 3.0, t)), f = focus(t);
  return aim({ dz, zoom, r }, f[0], f[1], Z, W / 2, H / 2 - 20, w);
}

export function frame(ctx, t) {
  const cam = camAt(t), u = U(t);
  const burin = clamp((t - 2.3) / 2.1), paper = sm(lin(4.1, 5.3, t));
  drawWorld(ctx, ROOF, t, cam, {
    p: { rise: Math.min(1, sm(lin(.1, 2.4, t)) * .85 + .15) },
    alpha: (L) => (L.screen ? 1 : nearFade(cam, L.z) * (L.id === 'rosette' ? 1 - .55 * paper : 1)),   // the rosette's light stays behind the paper, quieter
  });
  drawSky(ctx, t, cam, { burin, paper, u, glow: Math.max(burin, .4), ghostA: sm(lin(6.4, 7.0, t)), coast: t > 6.3 });
}
export const print = () => ({ riso: .35 });
