// The giant scaffold without walls in night fog, owner C2 (1.01b, 1.05, 1.10a); also used by C5 (3.04, far view). PLACEHOLDER until C2 delivers.
// scaffold(ctx, t, { view = 'macro' | 'far', cam = { x: 0, y: 0, z: 1 }, lights = 0..1 (work lamps), fog = 0..1, workers = 0..1 (tiny figures on ropes) })
//   draws the whole frame. → { top: { x, y } (crown of the scaffold), base: { x, y } }
import { phFrame, phBox } from './shared_ph.mjs';
export function scaffold(ctx, t, { view = 'far', cam = { x: 0, y: 0, z: 1 }, lights = 1, fog = .6, workers = 1 } = {}) {
  phFrame(ctx, '#10123a', '#2a1c18'); const z = cam.z ?? 1, x = 960 - (cam.x ?? 0), w = (view === 'far' ? 420 : 1400) * z;
  phBox(ctx, x - w / 2, 160 + (cam.y ?? 0), w, 760 * z, `scaffold (${view})`, '#e9a54b');
  return { top: { x, y: 160 + (cam.y ?? 0) }, base: { x, y: 160 + (cam.y ?? 0) + 760 * z } };
}
