// Film 8 · the horizon light (the singularity): a white-cyan point on the horizon that bends the stars round it.
//   lightAt(C, o) → { x, y, on } screen position of the light (o: { az, el })
//   lensOf(C, o, L) → the lens for drawSky ({ x, y, th, R })
//   drawLight(ctx, t, C, o, L)   o: { az, el, ign 0..1 (ignition), ring 0..1 (the stars bend), size 1, pulse 0..1 }
import { rgba, clamp } from '../engine.mjs';
import { TAU } from './s8_kit.mjs';
import { skyDir } from './s8_sky.mjs';

export const LIGHT = { az: .2, el: .0025 };
export function lightAt(C, o = LIGHT) { const p = C.D(...skyDir(o.az ?? LIGHT.az, o.el ?? LIGHT.el)); return p ? { x: p[0], y: p[1] } : null; }
export function lensOf(C, o, L) { if (!L) return null; const z = C.F / 1400, ring = clamp(o.ring ?? 0); return { x: L.x, y: L.y, th: 64 * ring * z * (o.size ?? 1), R: 380 * z * (o.size ?? 1) }; }
// the light's own flicker before it ignites (anticipation) and its slow breathing after (machine-even, no heartbeat)
export function drawLight(ctx, t, C, o, L) {
  if (!L) return;
  const z = C.F / 1400 * (o.size ?? 1), ign = clamp(o.ign ?? 1), ring = clamp(o.ring ?? 0), pu = o.pulse || 0;
  const pre = o.pre ? clamp(o.pre) * (.5 + .5 * Math.sin(t * 47) * Math.sin(t * 13)) : 0;
  const I = Math.max(ign * (1 + .04 * Math.sin(t * 2.1) + .5 * pu), pre * .35);
  if (I <= .002) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  const { x, y } = L;
  // the wide halo (cool), squashed a little by the atmosphere at the horizon
  ctx.save(); ctx.translate(x, y); ctx.scale(1, .8);
  let g = ctx.createRadialGradient(0, 0, 0, 0, 0, 260 * z * (.6 + .4 * I));
  g.addColorStop(0, rgba('#8fe6ff', .22 * I)); g.addColorStop(.25, rgba('#5fb8e0', .08 * I)); g.addColorStop(1, rgba('#0a6f8c', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 260 * z, 0, TAU); ctx.fill(); ctx.restore();
  g = ctx.createRadialGradient(x, y, 0, x, y, 46 * z); g.addColorStop(0, rgba('#ffffff', .95 * I)); g.addColorStop(.18, rgba('#d8f7ff', .6 * I)); g.addColorStop(.5, rgba('#8fe6ff', .14 * I)); g.addColorStop(1, rgba('#8fe6ff', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 46 * z, 0, TAU); ctx.fill();
  // a thin horizontal streak (the light lies on the horizon)
  const sw = (150 + 120 * pu) * z * I, sg = ctx.createLinearGradient(x - sw, 0, x + sw, 0);
  sg.addColorStop(0, rgba('#d8f7ff', 0)); sg.addColorStop(.5, rgba('#eefcff', .55 * I)); sg.addColorStop(1, rgba('#d8f7ff', 0));
  ctx.fillStyle = sg; ctx.fillRect(x - sw, y - .9, sw * 2, 1.8);
  ctx.fillStyle = rgba('#ffffff', Math.min(1, 1.2 * I)); ctx.beginPath(); ctx.arc(x, y, Math.max(1.6, 3.2 * z), 0, TAU); ctx.fill();
  // the Einstein ring: a thin cold circle where the bent starlight piles up (only the upper part: the sea hides the rest)
  if (ring > .02) {
    const th = 64 * ring * z;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1920, y + 1.5); ctx.clip();
    for (const [lw, a] of [[7, .025], [2.6, .06], [1.1, .16]]) { ctx.strokeStyle = rgba('#d8f7ff', a * ring * I); ctx.lineWidth = lw * Math.max(.8, z); ctx.beginPath(); ctx.arc(x, y, th, Math.PI, TAU); ctx.stroke(); }
    ctx.restore();
  }
  ctx.restore();
}
