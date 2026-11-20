// Film 11 · c04 props: the Go player at the floor grid, the machine across the board (its core carries the core plate), the line of light that
// rises off the floor (now we see the height), the ticks of 5.8 million graded moves, the new moves (warm stones), the slate as c02 left it.
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng } from '../engine.mjs';
import * as K from './f11_kit.mjs';
import * as Wd from './f11_c02_world.mjs';
import { plate } from './handoff4.mjs';

const TAU = Math.PI * 2;
export const PLAYER = [4.12, 0, 20.65];            // the Go player sits at the grid's -x edge, facing +x
export const GOM = [9.62, 0, 20.65];               // the machine across the board (faces -x)
export const GOM_CORE = [GOM[0], 1.28, GOM[2]];    // its glass core (world), radius 0.23 m
const gpt = (i, j) => { const p = K.goPt(i, j); return [p[0], p[2]]; };

// the bent part of the line of light, lifted: h(s) = height in metres along the bend (s 0…1), u = drawn fraction
export const RISE = [gpt(11, 6), gpt(12.4, 6.6), gpt(13.4, 8.4), gpt(14.2, 11.5), gpt(14.8, 15.5), gpt(15.2, 19.2)];
export function riseLine(ctx, V, lift, o = {}) {
  // resample the bend finely, each point lifted by lift * shape(s)
  const P = [], n = 60; let L = 0; const seg = [];
  for (let i = 1; i < RISE.length; i++) { const l = Math.hypot(RISE[i][0] - RISE[i - 1][0], RISE[i][1] - RISE[i - 1][1]); seg.push(l); L += l; }
  for (let k = 0; k <= n; k++) {
    let d = L * k / n, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
    const q = clamp(d / seg[i]), x = mix(RISE[i][0], RISE[i + 1][0], q), z = mix(RISE[i][1], RISE[i + 1][1], q), s = k / n;
    P.push([x, .012 + lift * Math.pow(s, 1.6), z]);
  }
  const k0 = V.P(P[0]).k || 100;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'screen';
  for (const [w, a, c] of [[.5, .12, K.PAL.effort], [.2, .3, K.PAL.effort], [.07, .9, K.PAL.effortHot]]) { ctx.strokeStyle = rgba(c, a); ctx.lineWidth = Math.max(1, k0 * w * .55); ctx.beginPath(); V.path(ctx, P); ctx.stroke(); }
  // a faint curtain of light under the lifted line down to the floor (so the height reads): vertical strokes every few points
  if (lift > .05) { ctx.strokeStyle = rgba(K.PAL.effort, .1); ctx.lineWidth = Math.max(1, k0 * .03); ctx.beginPath(); for (let k = 4; k <= n; k += 4) V.seg(ctx, [P[k][0], .01, P[k][2]], P[k]); ctx.stroke(); }
  ctx.restore();
  return P;
}
// the graded moves: fine ticks along the flat line, appearing from 2016 back to 1950 (u 0…1)
export function ticks(ctx, V, u) {
  if (u <= 0) return;
  const a = gpt(1, 6), b = gpt(11, 6), n = 44;
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.strokeStyle = rgba(K.PAL.effortHot, .55); ctx.lineCap = 'round';
  const kk = V.P([(a[0] + b[0]) / 2, 0, a[1]]).k || 100; ctx.lineWidth = Math.max(1, kk * .012); ctx.beginPath();
  for (let i = 0; i <= n; i++) { const s = 1 - i / n; if (i / n > u) break; const x = mix(a[0], b[0], s), l = i % 4 ? .07 : .14; V.seg(ctx, [x, .012, a[1] - l], [x, .012, a[1] + l]); }
  ctx.stroke(); ctx.restore();
}
// new moves: black stones on unusual points, dropped one by one, glowing warm
export const NEW = [[7, 9], [9, 12], [6, 13], [12, 14], [10, 16], [8, 4]];
export function newStones(ctx, V, t, t0, gap = .8) {
  NEW.forEach(([i, j], k) => {
    const d = lin(t0 + k * gap, t0 + k * gap + .35, t); if (d <= 0) return;
    K.goStone(ctx, V, i, j, { col: 'black', lift: .8 * (1 - d * d * d), glow: sm(lin(t0 + k * gap + .3, t0 + k * gap + 1.0, t)) * .85 });
  });
}
// the Go player (seated on a low stool, profile facing +x); o.lift 0…1 raises the front arm with a warm stone (like the dumbbell)
const DRESS_GO = { coat: '#e9e4d8', pants: '#3a3f52', shoes: '#2a221c', skin: K.PAL.skin[0], hair: '#1c1420', sleeve: 'short' };
export function goPlayer(ctx, t, V, o = {}) {
  K.stool(ctx, V, PLAYER);
  const S = K.sprite(V, PLAYER); if (!S.vis || S.k > 6000) return;
  const hipY = S.y - 46 * S.s, u = eio(clamp(o.lift ?? 0));
  const pose = { ...K.GYM.look, lean: .2 - .14 * u, head: .25 - .3 * u, sh: [mix(.7, 2.3, u), .45], el: [mix(.9, .5, u), 1.1], hands: ['fist', 'relaxed'] };
  const h = K.athlete(ctx, S.x, hipY, S.s, pose, { t, seed: 23, dress: DRESS_GO, arm: 1 + .12 * u });
  if (o.stone) {   // the stone in the hand: warm, glowing more as it rises
    const p = h.hand(0), r = Math.max(2, S.k * .055), g = .4 + .6 * u;
    const gl = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 5); gl.addColorStop(0, rgba(K.PAL.effort, .6 * g)); gl.addColorStop(1, rgba(K.PAL.effort, 0));
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(p[0], p[1], r * 5, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#25201c'; ctx.beginPath(); ctx.ellipse(p[0], p[1] - r * .3, r, r * .6, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(K.PAL.effortHot, .45 * g); ctx.beginPath(); ctx.ellipse(p[0] - r * .2, p[1] - r * .5, r * .45, r * .25, 0, 0, TAU); ctx.fill();
  }
}
// the machine across the board (faces -x). Its core is drawn with the core plate (a uniform orb of cool light) so a push into it lands on the plate.
export function goMachine(ctx, t, V, o = {}) {
  // anchored on the raw projection (safeView culls floor points right under the camera, and the push ends with the feet far below the frame)
  const p = o.mirror ? K.mirrorPt(GOM) : GOM, s0 = (V.Praw || V.P)(p); if (!(s0.z > .15)) return null;
  const S = { x: s0.x, y: s0.y, k: s0.k };
  if (S.k > 9000) { if (o.mirror) return null; plate(ctx, t, 'light', { tone: 'core' }); return { core: [W / 2, H / 2], R: 1e4 }; }   // the orb (R = 0.23 k > 2000 px) fills the frame
  const km = S.k / 100, sg = o.mirror ? 1 : -1;
  if (!o.mirror) K.floorShadow(ctx, V, GOM, .6, .3, .26);
  ctx.save(); ctx.translate(S.x, S.y); ctx.scale(sg * km, km);
  K.machine(ctx, t, { armOut: 0, forkOut: 0, fork: 0, core: 1, seed: 2 });
  ctx.restore();
  // the core as the plate (screen space, clipped to the glass sphere)
  const cx = S.x, cy = S.y - 128 * km, R = 23 * km;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip(); plate(ctx, t, 'light', { tone: 'core' }); ctx.restore();
  return { core: [cx, cy], R };
}
// the slate as c02 left it (19 doctors · 2,000+ exams each · growth found: before 28 %, after 22 %)
export function chalkPoland(ctx) {
  const COOL = '#cfe6f2';
  K.chalkText(ctx, '19 doctors', 14, 30, { size: 21 });
  K.chalkText(ctx, '2,000+ exams each', 14, 54, { size: 15 });
  const base = 112, U = 2.3, xs = [134, 186], w = 32;
  K.chalkText(ctx, 'growth found', 172, 22, { size: 14, align: 'center', a: .8 });
  K.chalkLine(ctx, [[120, base], [232, base]], { lw: 1.6 });
  K.chalkText(ctx, 'before', xs[0] + w / 2, base + 13, { size: 11, align: 'center', a: .75 });
  K.chalkBar(ctx, xs[0], base, w, U * 28, { seed: 7, lw: 2.2 });
  K.chalkText(ctx, '28 %', xs[0] + w / 2, base - U * 28 - 7, { size: 17, align: 'center' });
  K.chalkText(ctx, 'after', xs[1] + w / 2, base + 13, { size: 11, align: 'center', a: .75 });
  K.chalkBar(ctx, xs[1], base, w, U * 22, { col: COOL, seed: 8, lw: 2.2 });
  K.chalkText(ctx, '22 %', xs[1] + w / 2, base - U * 22 - 7, { size: 17, align: 'center', col: COOL });
  K.chalkLine(ctx, [[xs[1] - 6, base - U * 22 - 27], [xs[1] + w + 6, base - U * 22 - 28.5]], { lw: 1.8, col: COOL });
}
