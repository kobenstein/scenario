// C01 (Film 4 minute 1) · small helpers shared by c01's continuous takes (lib/m1x_c01_morning.mjs, lib/m1x_c01_lake.mjs, scenes/sc01.mjs).
// Owner c01.
//   passR(t, J, R, D, r0)   radius of a light pass: R at the junction J (the light covers the frame), r0 at |t − J| = D. r = R·exp(−A s²):
//                           zero velocity at J, so the light's growth on one side and its shrinking on the other meet without a kink.
//   passBloom(r, rSun)      the light's halo strength as a function of its radius only (the same on both sides of a junction)
//   mixHex(a, b, u)         colour mix;  palAt(keys, u)  piecewise-linear palette (keys [[u, {name: '#hex' | number}], …])
//   leafSprite(tone, v)     a cluster of engraved leaves (cached Image), tones 0 summer shade … 5 rust (see TONES)
import { canvas, clamp, mix, prng } from '../engine.mjs';
import { stipple } from './art.mjs';
import { once } from './sc01_m1_open.mjs';

export function passR(t, J, R, D, r0 = 6) { const s = t - J, A = Math.log(R / r0) / (D * D); return R * Math.exp(-A * s * s); }
export const passBloom = (r, rSun = 0) => clamp((r - rSun) / 160);
export const mixHex = (a, b, u) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); };
export function palAt(keys, u) {
  let i = 0; while (i < keys.length - 2 && u > keys[i + 1][0]) i++;
  const [u0, A] = keys[i], [u1, B] = keys[i + 1], q = clamp((u - u0) / (u1 - u0)), o = {};
  for (const k of Object.keys(A)) o[k] = typeof A[k] === 'number' ? mix(A[k], B[k], q) : mixHex(A[k], B[k], q);
  return o;
}
// leaf tones: [lit, mid, dark]
export const TONES = [
  ['#3f7040', '#2c5634', '#173322'],   // 0 summer, shade side
  ['#78a64e', '#4f8442', '#2c5a30'],   // 1 summer, lit side
  ['#a6b04c', '#7c8c3a', '#4c5a26'],   // 2 late summer
  ['#e2b84a', '#c08e30', '#7a5418'],   // 3 yellow
  ['#ee9440', '#c8662a', '#7e3514'],   // 4 orange
  ['#c85a36', '#9a3a22', '#5a1e10'],   // 5 rust
];
export function leafSprite(tone, v) {
  return once(`c01leaf${tone}_${v}`, () => {
    const S = 128, [c, g] = canvas(S, S), r = prng(301 + v * 31), T = TONES[tone];
    g.translate(S / 2, S / 2);
    const n = 9 + v * 2;
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, d = Math.pow(r(), .7) * 34, x = Math.cos(a) * d, y = Math.sin(a) * d * .78, la = a + (r() - .5) * 1.5, lw = 14 + r() * 7, lh = 7 + r() * 3.5;
      g.save(); g.translate(x, y); g.rotate(la);
      const gr = g.createLinearGradient(-lw, -lh, lw, lh); gr.addColorStop(0, T[0]); gr.addColorStop(.55, T[1]); gr.addColorStop(1, T[2]); g.fillStyle = gr;
      g.beginPath(); g.moveTo(-lw, 0); g.quadraticCurveTo(0, -lh * 1.6, lw, 0); g.quadraticCurveTo(0, lh * 1.6, -lw, 0); g.fill();
      g.strokeStyle = 'rgba(12,16,8,.38)'; g.lineWidth = .8; g.beginPath(); g.moveTo(-lw * .85, 0); g.lineTo(lw * .85, 0); g.stroke();
      g.strokeStyle = 'rgba(255,244,210,.22)'; g.lineWidth = .8; g.beginPath(); g.moveTo(-lw * .7, -lh * .55); g.quadraticCurveTo(0, -lh * 1.25, lw * .7, -lh * .4); g.stroke();
      g.restore();
    }
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .35, g: 1, seed: 7 + v + tone * 3, mid: false, boost: 1 });
    return c;
  });
}
