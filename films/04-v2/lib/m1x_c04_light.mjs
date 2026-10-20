// Film 4 v2 · the minute, chunk c04 · the light of your window condensing into plate I (the incoming bridge c03>c04 after B.b).
// Owner: c04 (minute repair). A copy of lib/m1x_bridge.mjs lightAt (same ramp, rays, dust, breathing, same prng seeds) with one more
// parameter, o.soft 0..1: at soft = 0 it IS lightAt (opaque to 0.9 r, so at r = R_FULL in the frame centre the picture is b34); as soft
// grows the opaque core gives way to a wide falloff, so the light gathers into its centre like a glow on the paper instead of a disc
// closing like an iris.
//   condense(ctx, t, x, y, r, o)   screen space; o: { tone ('cream'), core, bloom, seed, soft }
import { W, H, rgba, clamp, mix, sm, prng } from '../engine.mjs';
import { mixHex } from './m1x_c04_sun.mjs';

const TAU = Math.PI * 2;
const TONES = { cream: ['#fffaf0', '#f8e6c0', '#e2b77e'], lamp: ['#fff4dc', '#ffc978', '#e8893a'], dawn: ['#fff6e2', '#ffd9a0', '#f4a77a'], gold: ['#fff3d6', '#ffc070', '#e0784a'] };   // = m1x_bridge TONES
// = m1x_bridge RAYS / DUST (same seeds, same order of draws)
const RAYN = 132;
const RAYS = (() => { const r = prng(9001), out = []; for (let i = 0; i < RAYN; i++) { const long = i % 2 === 0; out.push({ a: i / RAYN * TAU + (r() - .5) * .012, l0: long ? .13 + r() * .04 : .2 + r() * .06, l1: long ? .78 + r() * .3 : .42 + r() * .2, w: (long ? 1.7 : 1.1) * (.8 + r() * .4), al: .55 + r() * .45, wob: r() * TAU }); } return out; })();
const DUSTN = 520;
const DUST = (() => { const r = prng(4711), out = []; for (let i = 0; i < DUSTN; i++) out.push({ a: r() * TAU, u0: r(), v: .05 + r() * .09, z: 1.1 + r() * 1.5, al: .35 + r() * .65, rot: (r() - .5) * .05 }); return out; })();

export function condense(ctx, t, x, y, r, o = {}) {
  const [c0, c1, c2] = TONES[o.tone] || TONES.cream, core = clamp(o.core ?? 1), bloom = clamp(o.bloom ?? 1), seed = o.seed ?? 0, soft = clamp(o.soft ?? 0);
  if (r <= .5) return;
  const R = r * (1 + .014 * Math.sin(t * 1.9 + seed) + .006 * Math.sin(t * 4.7 + seed * 2));   // the light breathes
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  // 1 · halo on the world around it (additive)
  if (bloom > 0) {
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, R * .4, x, y, R * 2.6); g.addColorStop(0, rgba(c1, .5 * bloom)); g.addColorStop(.35, rgba(c2, .16 * bloom)); g.addColorStop(1, rgba(c2, 0));
    const bx0 = Math.max(0, x - R * 2.6), by0 = Math.max(0, y - R * 2.6), bx1 = Math.min(W, x + R * 2.6), by1 = Math.min(H, y + R * 2.6);
    if (bx1 > bx0 && by1 > by0) { ctx.fillStyle = g; ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0); }
  }
  // 2 · the source: lightAt's ramp (white · c0 · c1 · c2 at 0 · .1 · .5 · .9), opaque to a (= .9 at soft 0), then falling off to 0 at r
  //     (linear at soft 0 as in lightAt, smoothstep-shaped as it softens)
  if (core > 0) {
    ctx.globalCompositeOperation = 'source-over';
    const a = .9 - .8 * soft, ramp = [[0, '#ffffff'], [.1, c0], [.5, c1], [.9, c2], [1, c2]];
    // as it softens, the falloff keeps the paper's lit colour (toward c0), so the glow never shows a darker ring against the lit paper
    const col0 = (p) => { for (let i = 1; i < ramp.length; i++) if (p <= ramp[i][0]) { const [p0, h0] = ramp[i - 1], [p1, h1] = ramp[i]; return mixHex(h0, h1, (p - p0) / (p1 - p0)); } return c2; };
    const col = (p) => mixHex(col0(p), c0, .75 * soft);
    const al = (p) => { if (p <= a) return 1; const q = (p - a) / (1 - a); return clamp(mix(1 - q, 1 - sm(q), soft)); };
    const P = new Set([0, .1, .5, .9, a]); for (let j = 1; j <= 4; j++) P.add(j === 4 ? 1 : a + (1 - a) * j / 4);
    const g = ctx.createRadialGradient(x, y, 0, x, y, R);
    for (const p of [...P].sort((u, v) => u - v)) g.addColorStop(p, rgba(col(p), core * al(p)));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
  }
  // 3 · engraved rays (= lightAt)
  const ra = core * clamp((R - 30) / 220);
  if (ra > 0) {
    ctx.globalCompositeOperation = 'source-over';
    const spin = t * .045 + seed * .7, lw = clamp(R / 900, .55, 1.4);
    ctx.fillStyle = rgba(c2, .3 * ra); ctx.beginPath();
    for (const q of RAYS) {
      const a = q.a + spin + .004 * Math.sin(t * .7 + q.wob), ca = Math.cos(a), sa = Math.sin(a), hw = q.w * lw * (1 + .25 * Math.sin(t * 1.1 + q.wob));
      const r0 = R * q.l0, r1 = R * q.l1 * (1 + .03 * Math.sin(t * .8 + q.wob * 2));
      ctx.moveTo(x + ca * r0 - sa * hw * .15, y + sa * r0 + ca * hw * .15);
      ctx.lineTo(x + ca * (r0 + (r1 - r0) * .35) - sa * hw, y + sa * (r0 + (r1 - r0) * .35) + ca * hw);
      ctx.lineTo(x + ca * r1, y + sa * r1);
      ctx.lineTo(x + ca * (r0 + (r1 - r0) * .35) + sa * hw, y + sa * (r0 + (r1 - r0) * .35) - ca * hw);
      ctx.lineTo(x + ca * r0 + sa * hw * .15, y + sa * r0 - ca * hw * .15); ctx.closePath();
    }
    ctx.fill();
  }
  // 4 · engraved dust (= lightAt)
  const da = core * clamp((R - 180) / 500);
  if (da > 0) {
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = rgba(c2, .42 * da);
    const n = Math.round(DUSTN * clamp(R / 1200, .25, 1));
    for (let i = 0; i < n; i++) {
      const d = DUST[i], u = .22 + (((d.u0 + d.v * t + seed * .13) % 1) + 1) % 1 * 1.05, a = d.a + d.rot * t + seed;
      const f = sm(clamp((u - .3) / .15)) * (1 - sm(clamp((u - 1.05) / .2)));
      if (f <= .02) continue;
      const px = x + Math.cos(a) * u * R, py = y + Math.sin(a) * u * R; if (px < -4 || px > W + 4 || py < -4 || py > H + 4) continue;
      const z = d.z * 1.3; ctx.globalAlpha = f * d.al; ctx.fillRect(px - z / 2, py - z / 2, z, z);
    }
  }
  ctx.restore();
}
