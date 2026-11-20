// M2 · the light of your share: a coin-sized amber light with halo and a thin cream rim, slowly pulsing.
// (Base version by K0; C2 owns and extends this file — keep the signature.)
//   shareLight(ctx, x, y, r, t, { mode: 'light'|'coin'|'seed'|'fruit', split: n (fruit/coin in n equal slices, 0..1 via u),
//              u (0..1 progress of the split), a (alpha), pulse (1), born (time it appears: grows in with a single bright pulse),
//              fibre (0..1: the coin turns into pressed paper fibre, 1.01), shadow (true when it rests on something) })
import { rgba, clamp, lin, eout, mix, prng, addGlow, glow } from '../engine.mjs';

export const AMBER = '#ffb35c', CORE = '#fff1d6', CREAM = '#f3efe2';
export function shareLight(ctx, x, y, r, t, o = {}) {
  const a = o.a ?? 1, mode = o.mode || 'light';
  const born = o.born != null ? eout(lin(o.born, o.born + .7, t)) : 1; if (born <= 0 || a <= 0) return;
  const flash = o.born != null ? Math.exp(-Math.pow((t - o.born - .35) / .18, 2)) : 0;
  const pulse = 1 + .06 * (o.pulse ?? 1) * Math.sin(t * 2.2) + .25 * flash, R = r * born * pulse;
  if (o.shadow) { ctx.save(); ctx.translate(x + R * .25, y + R * .9); ctx.scale(1, .3); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.3); g.addColorStop(0, `rgba(5,3,10,${.5 * a})`); g.addColorStop(1, 'rgba(5,3,10,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R * 1.3, 0, 7); ctx.fill(); ctx.restore(); }
  // halo: wide and faint, then tight and warm
  addGlow(ctx, x, y, R * 7, .22 * a * (1 + flash), AMBER, CORE);
  addGlow(ctx, x, y, R * 2.6, .55 * a, AMBER, CORE);
  const split = o.split || 0, su = clamp(o.u ?? 1);
  if (mode === 'seed') { // a lit seed: teardrop with a seam
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.5 + .05 * Math.sin(t)); ctx.globalAlpha = a;
    const g = ctx.createRadialGradient(-R * .2, -R * .3, 0, 0, 0, R * 1.3); g.addColorStop(0, CORE); g.addColorStop(.5, AMBER); g.addColorStop(1, '#a5541c');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -R * 1.3); ctx.bezierCurveTo(R * .95, -R * .5, R * .85, R * .9, 0, R); ctx.bezierCurveTo(-R * .85, R * .9, -R * .95, -R * .5, 0, -R * 1.3); ctx.fill();
    ctx.strokeStyle = rgba(CORE, .7); ctx.lineWidth = Math.max(1, R * .06); ctx.beginPath(); ctx.moveTo(0, -R * 1.1); ctx.quadraticCurveTo(R * .15, 0, 0, R * .85); ctx.stroke();
    ctx.restore(); return;
  }
  const slices = split > 1 ? split : 1;
  for (let i = 0; i < slices; i++) {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / slices, a1 = a0 + 2 * Math.PI / slices, mid = (a0 + a1) / 2, off = slices > 1 ? R * .45 * eout(su) : 0;
    const cx = x + Math.cos(mid) * off, cy = y + Math.sin(mid) * off;
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); if (slices > 1) { ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0 + .02, a1 - .02); ctx.closePath(); } else ctx.arc(cx, cy, R, 0, 7);
    const g = ctx.createRadialGradient(cx - R * .3, cy - R * .35, 0, cx, cy, R);
    if (mode === 'fruit') { g.addColorStop(0, '#ffe2b0'); g.addColorStop(.55, '#f0a04b'); g.addColorStop(1, '#c8442f'); }
    else { g.addColorStop(0, CORE); g.addColorStop(.55, AMBER); g.addColorStop(1, '#c86a22'); }
    ctx.fillStyle = g; ctx.fill();
    if (o.fibre) { // pressed paper fibre: script fragments in the material
      ctx.clip(); const r2 = prng(9 + i); ctx.globalAlpha = a * o.fibre; ctx.strokeStyle = 'rgba(90,50,20,.55)'; ctx.lineWidth = Math.max(.6, R * .025);
      for (let k = 0; k < 40; k++) { const px = cx + (r2() - .5) * 2 * R, py = cy + (r2() - .5) * 2 * R, L = R * (.1 + r2() * .35); ctx.beginPath(); ctx.moveTo(px, py); for (let s = 1; s < 5; s++) ctx.lineTo(px + L * s / 4, py + Math.sin(s * 2.3 + k) * R * .03); ctx.stroke(); }
    }
    ctx.restore();
    ctx.save(); ctx.globalAlpha = a * .85; ctx.strokeStyle = CREAM; ctx.lineWidth = Math.max(1, R * .07); ctx.beginPath();
    if (slices > 1) { ctx.arc(cx, cy, R * .96, a0 + .04, a1 - .04); } else ctx.arc(cx, cy, R * .94, 0, 7);
    ctx.stroke(); ctx.restore();
  }
  if (mode === 'coin') { ctx.save(); ctx.globalAlpha = a * .5; ctx.strokeStyle = '#7a3b17'; ctx.lineWidth = Math.max(1, R * .04); ctx.beginPath(); ctx.arc(x, y, R * .72, 0, 7); ctx.stroke(); ctx.restore(); }
  addGlow(ctx, x - R * .25, y - R * .3, R * .9, .5 * a, CORE, '#ffffff');
}
