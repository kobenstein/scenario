// A freshly ploughed field with pegs, string and a stake holding a sheet, morning mist, owner C4 (2.20, 2.21a); also used by C6 (4.09) and C7 (4.18). PLACEHOLDER.
// field(ctx, t, { cam = { x: 0, y: 0, z: 1 }, mist = .5, light = 'dawn' | 'day', pegs = 0..1, string = 0..1, post = 0..1 (the stake with the sheet), sprout = 0..1 })
//   draws the whole frame. → { post: { x, y } (foot of the stake), soil: { x, y } (a free spot for seeds), ground(x) → y }
import { phFrame, phBox } from './shared_ph.mjs';
export function field(ctx, t, { cam = { x: 0, y: 0, z: 1 }, mist = .5, light = 'dawn', pegs = 1, string = 1, post = 1 } = {}) {
  phFrame(ctx, '#e8a3a0', '#4a3426'); const gy = 620 + (cam.y ?? 0);
  phBox(ctx, 0, gy, 1920, 1080 - gy, `field (${light})`, '#4a3426', .6);
  return { post: { x: 1240 - (cam.x ?? 0), y: gy + 120 }, soil: { x: 820 - (cam.x ?? 0), y: gy + 200 }, ground: () => gy + 100 };
}
