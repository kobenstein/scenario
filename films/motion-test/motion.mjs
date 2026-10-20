// Shared motion helpers for the motion-test directors.
import { clamp } from '../05-share/engine.mjs';
import { toScreen } from './worlds.mjs';
export const qio = (x) => (x < .5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2);          // quart in-out (moves)
export const expoOut = (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x));                          // entrances, landings
export const expoIn = (x) => (x <= 0 ? 0 : 2 ** (10 * x - 10));                           // exits
export const cubicIO = (x) => (x < .5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
// piecewise keyframes [[t, v], …]; each segment eased with ease (default quart in-out); v may be a number
export function kf(t, keys, ease = qio) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) { const [t1, v1] = keys[i], [t0, v0] = keys[i - 1]; if (t <= t1) { const e = keys[i][2] || ease; return v0 + (v1 - v0) * e(clamp((t - t0) / (t1 - t0))); } }
  return keys[keys.length - 1][1];
}
// pan (screen shift, no parallax) so that point (x, y) on plane z lands at screen (fx, fy), blended by w
export function aim(cam, x, y, z, fx, fy, w = 1) { const [sx, sy] = toScreen({ ...cam, sx: 0, sy: 0 }, x, y, z); return { ...cam, sx: (fx - sx) * w, sy: (fy - sy) * w }; }
// how near a plane is to the camera: 1 = comfortable, 0 = about to pass through it
export const nearFade = (cam, z, a = .12, b = .55) => clamp(((z - (cam.dz || 0)) - a) / (b - a));
