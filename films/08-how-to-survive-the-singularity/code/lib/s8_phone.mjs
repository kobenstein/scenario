// Film 8 · the phone (owner B2; first use c07.09–c07.13, also B3 c09 pings / laptops). Built on phone.mjs (Film 5/6), no readable text,
// no brand: a call card with a paper-cut silhouette avatar that can flip over (its back is blank), a scribbled name, a voice wave that splits
// into two different waves; and the cool phone glow for crowds and windows.
//   callScreen(g, w, h, t, o)        draw the call on a display (phone units 0..w, 0..h). o: { lit 1, flip 0..1 (avatar turns over: back blank),
//                                     split 0..1 (the wave splits in two), wave 1 (voice amplitude), ring 0..1 (incoming rings round the avatar),
//                                     seed }
//   phoneOnTable(ctx, t, x, y, s, o) the phone lying face up (phone.mjs phone) showing the call; o: { ang, buzz: [t0,…], lit, ...callScreen o }
//   phoneInHand(ctx, t, x, y, s, o)  POV: your hand holds it up (phone.mjs heldPhone) showing the call → heldPhone's result
//   phoneGlow(ctx, x, y, r, a, o)    a phone's cool light in screen space (a small bright card + its spill), for crowds / windows
//   avatar(g, x, y, R, t, o)         the paper-cut avatar alone (o.flip, o.lit)
import { rgba, clamp } from '../engine.mjs';
import { phone, heldPhone } from './phone.mjs';
import { TAU, eoX, hash } from './s8_kit.mjs';

// the cut-paper profile (a head and shoulders facing right), in a unit circle
const PROF = [[-.62, .95], [-.6, .62], [-.42, .46], [-.3, .4], [-.32, .22], [-.38, .06], [-.36, -.18], [-.24, -.42], [-.04, -.56], [.18, -.56], [.34, -.44], [.4, -.26],
  [.46, -.14], [.42, -.08], [.44, .02], [.4, .06], [.4, .16], [.32, .22], [.18, .26], [.16, .38], [.42, .5], [.62, .66], [.66, .95]];
export function avatar(g, x, y, R, t, o = {}) {
  const fl = clamp(o.flip || 0), sx = Math.cos(fl * Math.PI), back = sx < 0, lit = o.lit ?? 1;
  g.save(); g.translate(x, y);
  // the paper disc, turning about its vertical axis (scaleX), a thin cast shadow under it
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(R * .06, R * .1, R * Math.max(.05, Math.abs(sx)), R, 0, 0, TAU); g.fill();
  g.scale(Math.max(.03, Math.abs(sx)), 1);
  const pg = g.createRadialGradient(-R * .3, -R * .4, 0, 0, 0, R * 1.2); pg.addColorStop(0, back ? '#d8cfb8' : '#f3ecda'); pg.addColorStop(1, back ? '#a89c80' : '#c9b88e');
  g.fillStyle = pg; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(42,36,32,.5)'; g.lineWidth = R * .03; g.stroke();
  if (!back) {
    // the silhouette: ink-dark paper cut, a slightly torn edge
    g.save(); g.beginPath(); g.arc(0, 0, R * .97, 0, TAU); g.clip();
    g.fillStyle = '#2a2420'; g.beginPath(); PROF.forEach(([a, b], i) => { const j = hash(i * 3.1 + (o.seed || 0)) * .025; (i ? g.lineTo : g.moveTo).call(g, (a + j) * R, (b + j) * R); }); g.closePath(); g.fill();
    g.restore();
  } else {
    // the blank back: only fibre and the glue marks where the cut-out was
    g.strokeStyle = 'rgba(110,90,60,.25)'; g.lineWidth = R * .015; g.beginPath(); for (let i = 0; i < 14; i++) { const a = hash(i) * TAU, r0 = hash(i * 2.3) * R * .8; g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * r0 + R * .2, Math.sin(a) * r0 + R * .05); } g.stroke();
  }
  g.restore();
  if (lit < 1) { g.fillStyle = `rgba(4,5,12,${.6 * (1 - lit)})`; g.beginPath(); g.arc(x, y, R * 1.02, 0, TAU); g.fill(); }
}
// a scribbled, unreadable name (a few connected loops)
function scribbleName(g, x, y, w, h, seed, a) {
  g.save(); g.strokeStyle = `rgba(232,236,245,${.85 * a})`; g.lineWidth = h * .12; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
  const n = 26; for (let i = 0; i <= n; i++) { const u = i / n, X = x + u * w, Y = y + Math.sin(u * 22 + seed) * h * .32 * (.6 + .4 * hash(Math.floor(u * 7) + seed)) - (hash(Math.floor(u * 9) + seed * 2) > .8 ? h * .3 : 0); i ? g.lineTo(X, Y) : g.moveTo(X, Y); }
  g.stroke(); g.restore();
}
function waveRow(g, x, y, w, h, t, amp, ph, col, a) {
  const n = 26, bw = w / n;
  g.fillStyle = rgba(col, a);
  for (let i = 0; i < n; i++) { const env = Math.sin(Math.PI * (i + .5) / n), v = (.25 + .75 * Math.abs(Math.sin(t * 9.1 + i * .7 + ph) * Math.sin(t * 3.3 + i * .23 + ph * 2))) * env * amp, bh = Math.max(h * .04, h * v); g.beginPath(); g.roundRect(x + i * bw + bw * .2, y - bh / 2, bw * .6, bh, bw * .3); g.fill(); }
}
export function callScreen(g, w, h, t, o = {}) {
  const lit = o.lit ?? 1, ring = o.ring ?? 0, sp = eoX(clamp(o.split || 0));
  g.save();
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, `rgba(30,40,64,${lit})`); bg.addColorStop(1, `rgba(10,14,26,${lit})`); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h * .3, R = w * .24;
  // ringing: thin rings run out of the avatar
  if (ring > 0) { g.lineWidth = 1.2; for (let k = 0; k < 3; k++) { const u = ((t * .9 + k / 3) % 1); g.strokeStyle = `rgba(207,230,255,${(1 - u) * .5 * ring * lit})`; g.beginPath(); g.arc(cx, cy, R * (1.05 + u * .7), 0, TAU); g.stroke(); } }
  avatar(g, cx, cy, R, t, { flip: o.flip, lit, seed: o.seed || 3 });
  scribbleName(g, cx - w * .26, h * .52, w * .52, h * .05, o.seed || 3, lit);
  // the voice: one wave, which splits into two different ones (one drifts up warm, one down cool)
  const wy = h * .66, ww = w * .7, wx = (w - ww) / 2, amp = (o.wave ?? 1) * lit;
  if (sp < .02) waveRow(g, wx, wy, ww, h * .07, t, amp, 0, '#cfe6ff', .9 * lit);
  else { waveRow(g, wx, wy - sp * h * .045, ww, h * .06, t, amp, 0, '#cfe6ff', .9 * lit); waveRow(g, wx, wy + sp * h * .045, ww, h * .06, t * 1.37 + 2, amp * .9, 1.7, '#ffcf8a', .9 * lit); }
  // two round buttons at the bottom (no symbols)
  for (const [bx, col] of [[w * .3, '#3a3f52'], [w * .7, '#c88a4a']]) { g.fillStyle = rgba(col, lit); g.beginPath(); g.arc(bx, h * .86, w * .09, 0, TAU); g.fill(); }
  g.restore();
}
export function phoneOnTable(ctx, t, x, y, s, o = {}) {
  return phone(ctx, x, y, s, { t, ang: o.ang ?? -.12, buzz: o.buzz, lit: o.lit, glow: o.glow ?? 1, screen: (g, w, h, tt) => callScreen(g, w, h, tt, { lit: o.lit ?? 1, ...o }) });
}
export function phoneInHand(ctx, t, x, y, s, o = {}) {
  return heldPhone(ctx, x, y, s, { t, ang: o.ang ?? -.06, pitch: o.pitch ?? .18, skin: o.skin || '#9a6a4c', lit: o.lit ?? 1, warm: .25, rim: o.rim ?? '#8fa4d0', rimA: .35, seed: 2,
    sleeve: o.sleeve ?? '#1e1d30', screen: (g, w, h, tt) => callScreen(g, w, h, tt, { lit: o.lit ?? 1, ...o }) });
}
export function phoneGlow(ctx, x, y, r, a = 1, o = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6); g.addColorStop(0, rgba('#cfe6ff', .55 * a)); g.addColorStop(.25, rgba('#9fd4ff', .16 * a)); g.addColorStop(1, rgba('#5a8ac0', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 6, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba('#eef6ff', .95 * a); ctx.beginPath(); ctx.roundRect(x - r * .45, y - r * .8, r * .9, r * 1.6, r * .2); ctx.fill();
  ctx.restore();
}
