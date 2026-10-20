// c07 · station clocks: backlit amber-cream dials (the only warm light in the hall of have-to), the giant one in the end wall's lunette.
//   clockAt(ctx, C, x, y, z, r, t, K, o)   a dial in the plane z (faces the camera), radius r m, lit to o.L (rises out of the dark as a
//                                          solid disc), o.giant (Roman numerals, guilloche heart), o.on (face lamp 0..1)
//   clockGlow(ctx, C, x, y, z, r, t, K, o)  its light in the air (additive), with the pulse on "have-to"
// Time on every dial: 7:59 and sweeping seconds; on "have-to" every minute hand clicks to 8:00 at once (the shift begins); on "ends"
// every second hand stops.
import { rgba, clamp, canvas } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { stipple } from './art.mjs';
import { rosette } from './certificate.mjs';
import { once, TAU, eoX, planeT, setT, solid, glowAt, proj } from './v2_c07_kit.mjs';

function dialCanvas(S, giant) {
  const [c, g] = canvas(S, S), cx = S / 2, R = S / 2 - 2;
  const bz = g.createLinearGradient(0, 0, S, S); bz.addColorStop(0, '#b4bed2'); bz.addColorStop(.45, '#454e64'); bz.addColorStop(1, '#141924'); g.fillStyle = bz; g.beginPath(); g.arc(cx, cx, R, 0, TAU); g.fill();
  g.fillStyle = '#0d111c'; g.beginPath(); g.arc(cx, cx, R * .9, 0, TAU); g.fill();
  const fg = g.createRadialGradient(cx - R * .2, cx - R * .25, R * .05, cx, cx, R * .87); fg.addColorStop(0, '#fff4df'); fg.addColorStop(.6, '#ffdcaa'); fg.addColorStop(1, '#e8a868'); g.fillStyle = fg; g.beginPath(); g.arc(cx, cx, R * .87, 0, TAU); g.fill();
  g.strokeStyle = '#1b1f2c';
  for (let k = 0; k < 60; k++) { const a = k / 60 * TAU, big = k % 5 === 0, r0 = R * .83, r1 = R * (big ? (giant ? .7 : .62) : .77); g.lineWidth = big ? R * (giant ? .035 : .06) : R * .014; g.beginPath(); g.moveTo(cx + Math.sin(a) * r0, cx - Math.cos(a) * r0); g.lineTo(cx + Math.sin(a) * r1, cx - Math.cos(a) * r1); g.stroke(); }
  if (giant) {
    g.fillStyle = '#1b1f2c'; g.font = `${Math.round(R * .15)}px "Instrument Serif"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const RN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.fillText(RN[k], cx + Math.sin(a) * R * .56, cx - Math.cos(a) * R * .56); }
    rosette(g, cx, cx, { R: R * .2, A: R * .05, B: R * .02, n: 12, m: 5, lines: 16, col: '#8a5a24', w: Math.max(.6, R * .004), a: .55 });
    g.textBaseline = 'alphabetic';
  }
  const sh = g.createLinearGradient(cx - R, cx - R, cx + R * .3, cx + R * .4); sh.addColorStop(0, 'rgba(255,255,255,.2)'); sh.addColorStop(.5, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.beginPath(); g.arc(cx, cx, R * .87, 0, TAU); g.fill();
  stipple(c, { k: .2, g: 1, seed: giant ? 9 : 4, mid: false, boost: 1 });
  return c;
}
const dialTex = () => once('c07dial', () => dialCanvas(192, false));
const giantTex = () => once('c07giant', () => dialCanvas(768, true));
export const warmClocks = () => { dialTex(); giantTex(); };

// the shift: 7:59 → 8:00 on "have-to"; the second hand sweeps until "ends"
export function clockTime(t, K) {
  const tc = Math.min(t, K.stop + .05), jump = eoX(clamp((t - K.haveTo) / .12));
  const mm = 59 + jump, hh = 7 + mm / 60, sec = ((tc - K.hb) * 6 + 41) % 60;
  return { hh, mm, sec };
}
// the dial: o = { L (light 0..1), giant, on (face lamp 0..1, default L), dark (draw the unlit disc against lit things behind) }
export function clockAt(ctx, C, x, y, z, r, t, K, o = {}) {
  const T = planeT(C, z), q = T[6], rp = r * q, L = o.L ?? 1; if (rp < 1.2 || C.z - z < 1 || (L <= .002 && !o.dark)) return null;
  const disc = new Path2D(); disc.arc(x, -y, r, 0, TAU);
  const M = [T[0], T[1], -T[2], -T[3], T[4], T[5]];   // plane transform with y flipped (texture space)
  if (L < .998) solid(ctx, disc, M, '#000000', 0, t, true);   // the dark ground in its outline, then the lit dial over it
  if (L <= .002) return null;
  ctx.save(); setT(ctx, M); ctx.globalAlpha = L;
  ctx.drawImage(o.giant ? giantTex() : dialTex(), x - r, -y - r, 2 * r, 2 * r);
  if (rp > 3) {
    const { hh, mm, sec } = clockTime(t, K);
    const hand = (ang, len, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x - Math.sin(ang) * len * .18, -y + Math.cos(ang) * len * .18); ctx.lineTo(x + Math.sin(ang) * len, -y - Math.cos(ang) * len); ctx.stroke(); };
    ctx.lineCap = 'butt';
    hand(hh / 12 * TAU, r * .5, r * .085, '#14161f'); hand(mm / 60 * TAU, r * .74, r * .06, '#14161f');
    if (rp > 10) hand(sec / 60 * TAU, r * .76, r * .016, '#8e2f2a');
    ctx.fillStyle = '#14161f'; ctx.beginPath(); ctx.arc(x, -y, r * .05, 0, TAU); ctx.fill();
  }
  const on = o.on ?? 1;
  if (on < 1) { ctx.fillStyle = `rgba(8,10,24,${(.82 * (1 - on)).toFixed(3)})`; ctx.beginPath(); ctx.arc(x, -y, r * .9, 0, TAU); ctx.fill(); }
  ctx.restore();
  return rp;
}
// the pulse of every clock on "have-to" (0..1, decays over ~.8 s)
export const havePulse = (t, K) => (t < K.haveTo ? 0 : Math.exp(-(t - K.haveTo) / .32) * clamp((t - K.haveTo) / .05));
export function clockGlow(ctx, C, x, y, z, r, t, K, o = {}) {
  const on = o.on ?? 1, a = o.a ?? 1; if (on <= 0 || C.z - z < 1) return; const q = C.f / (C.z - z), p = proj(C)(x, y, z);
  const pu = havePulse(t, K);
  glowAt(ctx, p[0], p[1], r * q * (o.giant ? 2.2 : 3.4) * (1 + .25 * pu), '#ffb35c', ((o.giant ? .22 : .28) + .3 * pu) * on * a, '#fff1d6');
}
