// The three engraved guilloche paths with the fork (TAKE rust, PRINT verdigris, AGREE amber), owner C3 (2.01 …); also used by C4 (2.20, 2.23). PLACEHOLDER.
// paths(ctx, t, { view = 'persp' | 'top', cam = { x: 0, y: 0, z: 1 }, u = [1, 1, 1] (draw-on of TAKE, PRINT, AGREE), hi = null | 'take' | 'print' | 'agree',
//   fork = { x: 960, y: 760 }, fog = .5, life = { take: 0..1 (crowd, dust), print: 0..1 (rushing stream), agree: 0..1 (foil glint) } })
//   draws the whole frame. → { along(name, q) → { x, y, ang } (screen point on a path, q 0 = fork … 1 = far end) }
import { phFrame } from './shared_ph.mjs';
const COL = { take: '#c4512e', print: '#3fae9a', agree: '#ffb35c' };
export function paths(ctx, t, { view = 'persp', cam = { x: 0, y: 0, z: 1 }, u = [1, 1, 1], hi = null, fork = { x: 960, y: 760 } } = {}) {
  phFrame(ctx, '#0b0f2a', '#1b2040');
  const ends = { take: [-700, -520], print: [0, -560], agree: [700, -520] };
  const along = (name, q) => { const [dx, dy] = ends[name]; return { x: fork.x + dx * q, y: fork.y + dy * q, ang: Math.atan2(dy, dx) }; };
  ['take', 'print', 'agree'].forEach((k, i) => { ctx.strokeStyle = COL[k]; ctx.lineWidth = hi === k ? 10 : 5; ctx.beginPath(); ctx.moveTo(fork.x, fork.y);
    const p = along(k, u[i] ?? 1); ctx.lineTo(p.x, p.y); ctx.stroke(); });
  return { along };
}
