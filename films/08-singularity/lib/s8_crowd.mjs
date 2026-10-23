// Film 8 · crowds seen from behind (owner B1; first use c02.02 the beach cinema; B2 c05 fire circle, c06 harbour, c08 hall; B3 c09, c10).
// Built on s8_people.backFig (figure.mjs figureBack: breath, weight, blinks; rim from the one light). Everyone is a calm silhouette.
//
//   crowd(ctx, t, C, people, o)   people: [{ x, z (world, on the ground y = o.y ?? 0), h 1.72 (m), pose 'stand' | 'sit', hold null | 'lantern'
//                                 | 'torch' | 'phone', raise 0..1 (an arm goes up), turn 0..1 (looks right), flinch 0..1 (a small jolt back),
//                                 seed, dress {}, walk (phase rad: walking away, s8_people walkerBack) }], o: { light: [X, Y, Z] world point of the one light (rim side), lightCol '#ffb066',
//                                 y 0 (ground), lamp 1 (held lights on), dim 0 (0..1 darker silhouettes) }  → [{ head: [sx, sy], hand: [sx, sy] } …]
//                                 people are depth-sorted far → near; a person behind the camera is skipped.
//   rows(o) → people              seated or standing rows facing +Z (a cinema): o: { n 8 per row, rows 4, x0 −4, x1 4, z0 2 (first row), dz −1.1
//                                 (each further row is nearer the camera), jitter .25, pose 'sit', seed 1, hold }
//   circle(o) → people            a ring round a point, everyone facing in: o: { n 12, R 3, x 0, z 0, gap: [a0, a1] (rad, an opening for the
//                                 camera / a newcomer), pose 'sit', seed 2 }; each gets .face (rad) toward the centre
//   heads(o) → people             a standing crowd on a quay / in a hall: o: { n 40, x0, x1, z0, z1, seed, hold }
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU } from './s8_kit.mjs';
import { backFig, walkerBack } from './s8_people.mjs';

const LIGHTS = { lantern: ['#ffb35c', '#fff1d6'], torch: ['#ff8a3a', '#fff1d6'], phone: ['#8fe6ff', '#eefcff'] };
export function crowd(ctx, t, C, people, o = {}) {
  const gy = o.y ?? 0, L = o.light ? C.P(...o.light) : null, out = [];
  const list = people.map((p, i) => ({ p, i, d: C.depth(p.x, gy + 1, p.z) })).filter((q) => q.d > .3).sort((a, b) => b.d - a.d);
  for (const { p, i } of list) {
    const h = p.h ?? 1.72, sit = p.pose === 'sit', feet = C.P(p.x, gy + (sit ? -h * .42 : 0), p.z); if (!feet) continue;
    const k = feet[2], s = k * h / 178, seed = p.seed ?? i;
    if (s < .02 || feet[0] < -300 || feet[0] > 2220) continue;
    const jolt = (p.flinch || 0) * 6 * s, X = feet[0] + jolt * (p.turn ? 1 : 0), Y = feet[1] - jolt;
    const light = L ? { x: L[0], y: L[1], col: o.lightCol || '#ffb066', a: 1 - (o.dim || 0) } : undefined;
    if (p.walk != null) {   // walking away from the camera (a queue, a surge): s8_people walkerBack
      const r = walkerBack(ctx, t, X, Y, h * k, p.walk, { light, dress: { coat: '#16141f', pants: '#0b0a14', skin: '#3a2a26', hair: '#0c0a12', ...(p.dress || {}) } });
      out.push({ head: [X, Y - h * k * .93], hand: r ? r.lantern : [X + 24 * s, Y - 98 * s], i }); continue;
    }
    ctx.save();
    if (sit) { const hip = Y - 92 / 178 * h * k; ctx.beginPath(); ctx.rect(X - 400 * s, hip - 400 * s, 800 * s, 400 * s + 2); ctx.clip(); }
    const r = backFig(ctx, t, X, Y, s, { light, seed, hold: p.hold === 'phone' ? 'phone' : 'none', dress: { coat: '#16141f', pants: '#0b0a14', shoes: '#08080e', skin: '#3a2a26', hair: '#0c0a12', ...(p.dress || {}) }, accent: p.accent ?? '#201c2c', headTilt: .22 + .25 * (p.turn || 0) });
    ctx.restore();
    if (sit) { const hip = Y - 92 / 178 * h * k; ctx.fillStyle = '#0c0b16'; ctx.beginPath(); ctx.ellipse(X, hip, 26 * s, 9 * s, 0, 0, TAU); ctx.fill(); }   // folded legs on the sand
    const head = r ? r.head : [X, Y - h * k * .93];
    // the held light / the raised arm
    const hand = [X + (p.raise ? 22 * s : 26 * s), Y - (p.raise ? 175 + 40 * p.raise : 96) * s * (sit ? 1 : 1)];
    if (p.raise) { ctx.save(); ctx.strokeStyle = '#141220'; ctx.lineCap = 'round'; ctx.lineWidth = 11 * s; ctx.beginPath(); ctx.moveTo(X + 14 * s, Y - 138 * s); ctx.quadraticCurveTo(X + 30 * s, Y - (150 + 20 * p.raise) * s, hand[0], hand[1]); ctx.stroke(); ctx.restore(); }
    const lit = p.hold && p.hold !== 'phone' ? (o.lamp ?? 1) : p.hold === 'phone' ? (o.lamp ?? 1) * .8 : 0;
    if (lit > 0) {
      const [c0, c1] = LIGHTS[p.hold], R = Math.max(6, (p.hold === 'torch' ? 90 : 60) * s), fl = .85 + .15 * Math.sin(t * 9 + seed) * Math.sin(t * 5.3 + seed * 2);
      const lp = p.hold === 'phone' ? [X + 4 * s, Y - 128 * s] : p.hold === 'torch' && !p.raise ? [X + 26 * s, Y - 150 * s] : hand;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], R); g.addColorStop(0, rgba(c0, .55 * lit * fl)); g.addColorStop(.3, rgba(c0, .16 * lit)); g.addColorStop(1, rgba(c0, 0)); ctx.fillStyle = g; ctx.fillRect(lp[0] - R, lp[1] - R, 2 * R, 2 * R);
      ctx.fillStyle = rgba(c1, .95 * lit); ctx.beginPath(); ctx.arc(lp[0], lp[1], Math.max(1, 4 * s), 0, TAU); ctx.fill();
      ctx.restore();
    }
    out.push({ head, hand, i });
  }
  return out;
}
export function rows(o = {}) {
  const r = prng(o.seed ?? 1), n = o.n ?? 8, R = o.rows ?? 4, out = [];
  for (let j = 0; j < R; j++) for (let i = 0; i < n; i++) {
    const x = (o.x0 ?? -4) + ((o.x1 ?? 4) - (o.x0 ?? -4)) * (i + .5 + (j % 2) * .35) / n + (r() - .5) * (o.jitter ?? .25), z = (o.z0 ?? 2) + j * (o.dz ?? -1.1) + (r() - .5) * .2;
    if (r() < .1) continue;
    out.push({ x, z, h: 1.6 + r() * .25, pose: o.pose ?? 'sit', seed: j * 31 + i, hold: o.hold ?? null });
  }
  return out;
}
export function circle(o = {}) {
  const r = prng(o.seed ?? 2), n = o.n ?? 12, R = o.R ?? 3, out = [], gap = o.gap;
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU + (r() - .5) * .12; if (gap && a > gap[0] && a < gap[1]) continue;
    out.push({ x: (o.x ?? 0) + Math.sin(a) * R, z: (o.z ?? 0) + Math.cos(a) * R, face: a + Math.PI, h: 1.6 + r() * .25, pose: o.pose ?? 'sit', seed: i * 7 + 3, hold: o.hold ?? null });
  }
  return out;
}
export function heads(o = {}) {
  const r = prng(o.seed ?? 3), out = [];
  for (let i = 0; i < (o.n ?? 40); i++) out.push({ x: (o.x0 ?? -6) + r() * ((o.x1 ?? 6) - (o.x0 ?? -6)), z: (o.z0 ?? 2) + r() * ((o.z1 ?? 10) - (o.z0 ?? 2)), h: 1.55 + r() * .35, pose: 'stand', seed: i * 13 + 5, hold: o.hold ?? null });
  return out;
}
