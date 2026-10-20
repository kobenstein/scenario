// Rooftop set, owner C1 (H.04, H.05, H.10); also used by C6 (3.14–3.16) and C10 (7.02a, 7.07–7.10). PLACEHOLDER until C1 delivers.
// rooftop(ctx, t, { state = 'blue' | 'night' | 'dawn', dawn = 0..1 (sunrise progress in 'dawn'), cam = { x: 0, y: 0, z: 1 } (lateral glide px,
//   vertical px, zoom), seats = 0 | 1 | 2 }) draws the whole frame: sky, skyline in 4 parallax planes with fog bands, roof, parapet, water tanks,
//   antennas (template: ref/k0 hookRooftop). Figures are drawn by the caller at the returned anchors.
//   → { horizon, parapet: { y, x0, x1 }, seats: [{ x, y, s }] (feet point + figure scale), light: { x, y, col } (key light) }
// The owner may add options; the signature and the anchors stay.
import { phFrame, phBox } from './shared_ph.mjs';
export function rooftop(ctx, t, { state = 'blue', dawn = 0, cam = { x: 0, y: 0, z: 1 }, seats = 0 } = {}) {
  phFrame(ctx, state === 'dawn' ? '#3a3a5a' : '#0a0d22', state === 'dawn' ? '#ffd08a' : '#1d2a44');
  const z = cam.z ?? 1, cx = 960 - (cam.x ?? 0), py = 760 + (cam.y ?? 0);
  phBox(ctx, 0, 520 + (cam.y ?? 0) * .3, 1920, 180, `skyline (${state})`, '#9fb6cf', .5);
  phBox(ctx, cx - 900 * z, py, 1800 * z, 40, 'parapet', '#efe4cc');
  return { horizon: 600, parapet: { y: py, x0: cx - 900 * z, x1: cx + 900 * z }, seats: [{ x: cx - 140 * z, y: py + 10, s: .9 * z }, { x: cx + 140 * z, y: py + 10, s: .9 * z }].slice(0, seats || 2),
    light: { x: 960, y: state === 'dawn' ? 560 : 1080, col: state === 'night' ? '#ff9a3c' : '#ffb35c' } };
}
