// Film 4 v2 · the minute, chunk c04 · the sun of the pop-up dawn, drawn in SCREEN space so the camera can fly into it and arrive exactly
// in the handoff plate c04>c05 (lib/handoff4.mjs, kind 'light', tone 'dawn'). Owner: c04 (minute repair).
// The sun is a small copy of that light plate: a radial light (white-hot centre, peach falloff) with the plate's stipple in its limb.
// While it is small it keeps the golden look of the approved minute; as the camera flies in, its colours turn into the plate's
// (m 0 → 1). With m = 1, radius R_END and its centre on plateCentre(t), sunDisc() paints exactly the plate (gradient + stipple).
//   R_END                          disc radius (px) at which the sun covers the whole frame (and every corner after the camera float)
//   plateCentre(t)                 the light plate's centre on screen (handoff4 lightPlate)
//   sunDisc(ctx, t, x, y, r, m)    the disc (screen space)
//   sunHalo(ctx, t, x, y, R, a)    the stippled halo around it (additive; R = halo radius px, a = intensity 0..1): a vector gradient plus
//                                  screen-space dust, so the grain stays fine at any zoom
import { W, H, rgba, clamp, mix, prng, drift } from '../engine.mjs';

const TAU = Math.PI * 2;
export const R_END = 1180;
const C0 = '#fff6e2', C1 = '#ffd9a0', C2 = '#f4a77a';                 // = handoff4 LIGHT.dawn
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();   // = handoff4 DOTS
export const plateCentre = (t) => [W / 2 + 18 * drift(t, 1, 3), H / 2 + 12 * drift(t, 1, 7)];
const breath = (t) => 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
const hexN = (h) => parseInt(h.slice(1), 16);
export function mixHex(a, b, u) {
  if (u <= 0) return a; if (u >= 1) return b;
  const A = hexN(a), B = hexN(b), m = (k) => Math.round(mix((A >> k) & 255, (B >> k) & 255, u));
  return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function sunDisc(ctx, t, sx, sy, rd, m = 0) {
  if (rd <= .3) return;
  m = clamp(m);
  const Z = rd / R_END, br = breath(t);
  // golden sun of the minute: stops 0 #fffaf0 · .7 #ffe1a6 · 1 #ffc27a over the disc radius, focus offset to the upper left (−8, −10 at r 44)
  // dawn plate: stops 0 C0 · .42 C1 · 1 C2 over 1150·breath (screen px at Z = 1), centred
  const rg = mix(rd, 1150 * br * Z, m), off = (1 - m) * rd / 44;
  const g = ctx.createRadialGradient(sx - 8 * off, sy - 10 * off, 0, sx, sy, rg);
  g.addColorStop(0, mixHex('#fffaf0', C0, m)); g.addColorStop(mix(.7, .42, m), mixHex('#ffe1a6', C1, m)); g.addColorStop(1, mixHex('#ffc27a', C2, m));
  ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, rd, 0, TAU); ctx.fill();
  // the plate's stipple in the falloff (screen-space dots), scaled with the disc; at Z = 1 the same dots in the same order as the plate
  const S = 1100 * Z;
  if (S > 6) {
    ctx.beginPath(); ctx.arc(sx, sy, rd, 0, TAU); ctx.clip();
    const r = prng(31 + Math.floor(t * 12)); ctx.fillStyle = rgba(C2, .32);
    for (const [u, v, k] of DOTS) {
      const x = u * W, y = v * H, d = Math.hypot(x - sx, y - sy) / S; if (d < .35) continue;
      if (k > (d - .35) * 1.4) continue; const s = .8 + r() * 1.1; ctx.fillRect(x + (r() - .5) * 2, y + (r() - .5) * 2, s, s);
    }
  }
  ctx.restore();
}

// the halo: the old sunBloom sprite (stops .95 / .7 @ .12 / .22 @ .35 / 0, stippled) rebuilt as light that stays fine when the camera
// is very close: a smooth additive gradient at part strength plus a field of dust grains whose density follows the same falloff
const HALO = (() => { const r = prng(4477), out = []; for (let i = 0; i < 1400; i++) { const q = Math.pow(r(), .7); out.push({ a: r() * TAU, q, z: .9 + r() * 1.3, al: .45 + r() * .55, v: .006 + r() * .012, ph: r() }); } return out; })();
const prof = (q) => q < .12 ? mix(.95, .7, q / .12) : q < .35 ? mix(.7, .22, (q - .12) / .23) : mix(.22, 0, (q - .35) / .65);
export function sunHalo(ctx, t, sx, sy, R, a = 1) {
  if (a <= 0 || R < 2) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1;
  const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, R);
  g.addColorStop(0, `rgba(255,241,214,${.62 * a})`); g.addColorStop(.12, `rgba(255,214,150,${.42 * a})`); g.addColorStop(.35, `rgba(255,170,100,${.12 * a})`); g.addColorStop(1, 'rgba(255,150,90,0)');
  const x0 = Math.max(0, sx - R), y0 = Math.max(0, sy - R), x1 = Math.min(W, sx + R), y1 = Math.min(H, sy + R);
  if (x1 > x0 && y1 > y0) { ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
  // dust: grains drifting slowly outward through the halo (the print look of light; screen-sized, so they never blur)
  ctx.fillStyle = '#ffe6c4';
  for (const d of HALO) {
    const q = ((d.q + d.v * t) % 1), p = prof(q) * clamp(q / .12); if (p < .03) continue;   // born at the centre unseen, gone at the rim
    const x = sx + Math.cos(d.a + .02 * t) * q * R, y = sy + Math.sin(d.a + .02 * t) * q * R; if (x < -3 || x > W + 3 || y < -3 || y > H + 3) continue;
    ctx.globalAlpha = clamp(p * 1.25 * d.al * a); ctx.fillRect(x - d.z / 2, y - d.z / 2, d.z, d.z);
  }
  ctx.restore();
}
