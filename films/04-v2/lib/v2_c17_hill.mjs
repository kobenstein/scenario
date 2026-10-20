// c17 · world B: the hill with you, the city on the horizon (stub, filled next)
import { W, H } from '../engine.mjs';
import { HZ } from './v2_c17_kit.mjs';
export function prepareB() {}
export function worldB(ctx, t, C, K) {
  const hy = HZ - C.dl; if (hy < H) { ctx.fillStyle = '#0b0a1a'; ctx.fillRect(0, hy, W, H - hy); }
  const p = C.P(0, 7, 0); if (p) { ctx.fillStyle = '#0b0a1a'; ctx.beginPath(); ctx.ellipse(p[0], p[1] + 40 * p[2] / 30, 60 * p[2], 40 * p[2] / 30 * 7 / 7 + 7 * p[2], 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillRect(p[0] - .2 * p[2], p[1] - 1.75 * p[2], .4 * p[2], 1.75 * p[2]); }
}
