// Film 8 · small helpers shared by B2's chunks (c05–c08) only (owner B2).
//   growPlate(ctx, t, kind, o, cx, cy, u)   a handoff plate (handoff4.plate) grows out of a point as one opaque disc (u 0..1, radius to the
//                                           far corner): a light that fills the frame (push into the fire box / lantern), never a blend.
//                                           u = 1 → the frame IS the plate. Reverse u for the pull back out of it.
//   K(T, seg) → { S(p, n), E(p, n) }        phrase anchors in one segment
//   vign(ctx, a)                            a soft dark vignette (the lamp-lit / night print look)
//   paperPatch(ctx, t, C, Q, a)              the paper lamp plate laid onto a flat world rect Q (4 corners TL TR BR BL) as seen by C, opacity a:
//                                           the lamp pool that is exactly the `paper` plate once Q fills the frame (c05>c06 margin)
//   keys(list) → camera from tracks: list = [[t, { x, y, z, yaw, pitch, F }], …] (missing values keep the previous key's) → (t) => camera
import { plate, paperLamp } from './handoff4.mjs';
import { camera, track, trackLog } from './s8_kit.mjs';

export function growPlate(ctx, t, kind, o, cx, cy, u) {
  if (u <= 0) return;
  const R = u >= 1 ? 4000 : Math.max(Math.hypot(cx, cy), Math.hypot(1920 - cx, cy), Math.hypot(cx, 1080 - cy), Math.hypot(1920 - cx, 1080 - cy)) * u;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, Math.max(.5, R), 0, Math.PI * 2); ctx.clip();
  plate(ctx, t, kind, o); ctx.restore();
  // the light spills past its edge (a glow, so the disc reads as light filling the lens, not as a ball)
  if (u < 1 && kind === 'light') {
    // the light spills past the disc's edge as a ring of glow outside it (never over it: inside, the frame is exactly the plate), fading
    // out as the disc reaches the corners, so the disc never reads as a ball and the full frame is the clean plate
    const ga = Math.min(1, (1 - u) * 5), R2 = R * 2.2 + 90;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(cx, cy, R, cx, cy, R2); g.addColorStop(0, `rgba(255,190,120,${.75 * ga})`); g.addColorStop(.25, `rgba(255,160,80,${.32 * ga})`); g.addColorStop(1, 'rgba(196,81,46,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R2, 0, Math.PI * 2); ctx.arc(cx, cy, Math.max(.5, R), 0, Math.PI * 2, true); ctx.fill('evenodd'); ctx.restore();
  }
}
export const anchors = (T, seg) => ({ S: (p, n) => T.S(seg, p, n), E: (p, n) => T.E(seg, p, n) });
export function vign(ctx, a = .55, cx = 960, cy = 540) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createRadialGradient(cx, cy, 380, cx, cy, 1250); g.addColorStop(0, 'rgba(5,5,14,0)'); g.addColorStop(.6, `rgba(5,5,14,${a * .4})`); g.addColorStop(1, `rgba(5,5,14,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
}
// camera from keyframes: every key names only what it sets; others carry over. F is interpolated in log space.
export function keys(list) {
  const names = ['x', 'y', 'z', 'yaw', 'pitch', 'F'], full = [], cur = {};
  for (const [t, k] of list) { Object.assign(cur, k); full.push([t, { ...cur }]); }
  const tr = {};
  for (const n of names) { const ks = full.filter(([, k]) => k[n] != null).map(([t, k]) => [t, k[n]]); tr[n] = n === 'F' ? trackLog(ks) : track(ks); }
  const f = (t) => camera({ x: tr.x(t), y: tr.y(t), z: tr.z(t), yaw: tr.yaw(t), pitch: tr.pitch(t), F: tr.F(t) });
  f.tr = tr; return f;
}

export function paperPatch(ctx, t, C, Q, a = 1) {
  if (a <= 0) return;
  const P = Q.map((q) => C.P(...q)); if (P.some((p) => !p)) return;
  // affine from plate space (1920 × 1080) to the projected rect (camera straight above: a parallelogram is exact)
  const [A, B, , D] = P, m = [(B[0] - A[0]) / 1920, (B[1] - A[1]) / 1920, (D[0] - A[0]) / 1080, (D[1] - A[1]) / 1080, A[0], A[1]];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = Math.min(1, a); ctx.transform(...m); paperLamp(ctx, t, {}); ctx.restore();
}
