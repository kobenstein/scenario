// Film 8 · c06 local pieces (owner B2): the envelope you draw your compass on (front: an address and a stamp; back: the flap), the pen
// that rolls across the table, the rolled chart bobbing on the swell (c06.09), Tahiti's high peaks at dawn (c06.12), small outrigger canoes
// paddling out (c06.13). World pieces in metres (s8 camera, +Y up).
//
//   envFront(g, t, W, H)              the envelope's front in plate space (scribbled address, a stamp, a postmark)
//   envBack(g, t, W, H)               the back: the flap's V and its shadow (draw your compass on top)
//   envCorners(c, w, h, rot, flip)    the 4 world corners (TL, TR, BR, BL of the visible face) of an envelope lying at c = [x, y, z], turned over
//                                     about its far long edge by flip 0..1 (0 front up, 1 back up) → { corners, back: bool }
//   tablePen(ctx, t, C, a, b)         a pen lying on the table from world point a (nib) to b (cap end)
//   floatRoll(ctx, t, C, p, o)        a rolled paper chart floating at world p (bobbing on the swell), o: { len 1.1, r .07, ang (rad about Y) }
//   peaks(ctx, t, C, o)               high island peaks at infinity: o: { az, w (rad half width), h (rad, the tallest peak), dawn 0..1, seed }
//   outrigger(ctx, t, C, o)           a small outrigger canoe with paddlers: o: { x, z, head, n 3 (paddlers), phase, lit (torch on board 0..1) }
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projPoly, projRuns, fillPoly, mixHex, nz, hash } from './s8_kit.mjs';
import { skyDir } from './s8_sky.mjs';
import { waterY } from './s8_sea.mjs';
import { scribble } from './paper.mjs';

export function envFront(g, t, W, H) {
  const ink = '#2a2420';
  scribble(g, W * .38, H * .5, W * .4, H * .06, { seed: 41, u: 1, ink, lw: 3 });
  scribble(g, W * .38, H * .6, W * .34, H * .06, { seed: 42, u: 1, ink, lw: 3 });
  scribble(g, W * .38, H * .7, W * .3, H * .06, { seed: 43, u: 1, ink, lw: 3 });
  // the stamp: a small engraved square with perforations, a wavy postmark over it
  const sx = W * .8, sy = H * .12, sw = W * .12, sh = H * .26;
  g.fillStyle = '#b0503a'; g.fillRect(sx, sy, sw, sh); g.fillStyle = '#e8d8b8'; g.fillRect(sx + sw * .12, sy + sh * .1, sw * .76, sh * .8);
  g.strokeStyle = 'rgba(120,50,30,.8)'; g.lineWidth = 3; g.beginPath(); g.arc(sx + sw / 2, sy + sh * .5, sw * .25, 0, TAU); g.stroke();
  g.fillStyle = '#efe6d2'; for (let i = 0; i < 12; i++) { g.beginPath(); g.arc(sx + i * sw / 11, sy, 4, 0, TAU); g.arc(sx + i * sw / 11, sy + sh, 4, 0, TAU); g.fill(); }
  g.strokeStyle = 'rgba(40,30,30,.55)'; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); for (let i = 0; i <= 30; i++) { const x = sx - sw * .9 + i * sw * .06; g.lineTo(x, sy + sh * (.25 + k * .17) + 6 * Math.sin(i * .9)); } g.stroke(); }
}
export function envBack(g, t, W, H) {
  // the flap: a V from the top corners to just below the middle, its edge catching the lamp, a soft shadow under it
  const tip = [W * .5, H * .58];
  g.fillStyle = 'rgba(60,40,20,.12)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(tip[0], tip[1] + 14); g.lineTo(W, 0); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(70,50,30,.45)'; g.lineWidth = 3; g.beginPath(); g.moveTo(6, 6); g.lineTo(tip[0], tip[1]); g.lineTo(W - 6, 6); g.stroke();
  g.strokeStyle = 'rgba(70,50,30,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, H); g.lineTo(W * .36, H * .46); g.moveTo(W, H); g.lineTo(W * .64, H * .46); g.stroke();
}
export function envCorners(c, w, h, rot, flip) {
  const ex = [Math.cos(rot), 0, -Math.sin(rot)], ez = [Math.sin(rot), 0, Math.cos(rot)], b0 = h / 2, phi = Math.PI * clamp(flip);
  const P = (a, b) => { const d = b - b0, bz = b0 + d * Math.cos(phi), by = -d * Math.sin(phi); return [c[0] + ex[0] * a + ez[0] * bz, c[1] + Math.max(0, by) + .002, c[2] + ex[2] * a + ez[2] * bz]; };
  const back = phi > Math.PI / 2;
  return { back, corners: back ? [P(-w / 2, -h / 2), P(w / 2, -h / 2), P(w / 2, h / 2), P(-w / 2, h / 2)] : [P(-w / 2, h / 2), P(w / 2, h / 2), P(w / 2, -h / 2), P(-w / 2, -h / 2)] };
}
export function tablePen(ctx, t, C, a, b) {
  const A = C.P(...a), B = C.P(...b); if (!A || !B) return;
  const k = (A[2] + B[2]) / 2, r = .0055 * k;
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = r * 2.6; ctx.beginPath(); ctx.moveTo(A[0] + r, A[1] + r * 1.2); ctx.lineTo(B[0] + r, B[1] + r * 1.2); ctx.stroke();
  ctx.strokeStyle = '#17161f'; ctx.lineWidth = r * 2; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  ctx.strokeStyle = rgba('#ffb066', .55); ctx.lineWidth = Math.max(1, r * .45); ctx.beginPath(); ctx.moveTo(A[0], A[1] - r * .55); ctx.lineTo(B[0], B[1] - r * .55); ctx.stroke();
  // the nib (brass) and the clip
  const n = [A[0] + (B[0] - A[0]) * .08, A[1] + (B[1] - A[1]) * .08]; ctx.strokeStyle = '#c89a52'; ctx.lineWidth = r * 1.2; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(n[0], n[1]); ctx.stroke();
  const c0 = [A[0] + (B[0] - A[0]) * .7, A[1] + (B[1] - A[1]) * .7]; ctx.strokeStyle = '#d8b070'; ctx.lineWidth = Math.max(1, r * .5); ctx.beginPath(); ctx.moveTo(c0[0], c0[1] - r * .9); ctx.lineTo(B[0], B[1] - r * .9); ctx.stroke();
  ctx.restore();
}
export function floatRoll(ctx, t, C, p, o = {}) {
  const L = o.len ?? 1.1, r = o.r ?? .07, ang = o.ang ?? 0, y = waterY(p[0], p[2], t) * .8 + r * .4, rock = .12 * Math.sin(t * 1.3 + p[2]);
  const d = [Math.cos(ang) * L / 2, Math.sin(rock) * L / 2 * .3, -Math.sin(ang) * L / 2];
  const A = C.P(p[0] - d[0], y - d[1], p[2] - d[2]), B = C.P(p[0] + d[0], y + d[1], p[2] + d[2]); if (!A || !B) return null;
  const k = (A[2] + B[2]) / 2, w = 2 * r * k;
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = '#b8a47a'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  ctx.strokeStyle = '#ddd0ac'; ctx.lineWidth = w * .45; ctx.beginPath(); ctx.moveTo(A[0], A[1] - w * .2); ctx.lineTo(B[0], B[1] - w * .2); ctx.stroke();
  ctx.strokeStyle = '#6a2c22'; ctx.lineWidth = Math.max(1.5, w * .2); const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; ctx.beginPath(); ctx.moveTo(m[0] - w * .1, m[1] - w * .5); ctx.lineTo(m[0] + w * .1, m[1] + w * .5); ctx.stroke();
  // the water line: the lower third under the surface (dark band) and a little wash
  ctx.strokeStyle = 'rgba(20,26,38,.75)'; ctx.lineWidth = w * .35; ctx.beginPath(); ctx.moveTo(A[0], A[1] + w * .32); ctx.lineTo(B[0], B[1] + w * .32); ctx.stroke();
  ctx.strokeStyle = rgba('#c8d4f0', .35); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(A[0] - w * .6, A[1] + w * .2); ctx.lineTo(B[0] + w * .6, B[1] + w * .2); ctx.stroke();
  ctx.restore();
  return [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, k];
}
export function peaks(ctx, t, C, o = {}) {
  const az = o.az ?? 0, w = o.w ?? .3, h = o.h ?? .1, dawn = clamp(o.dawn ?? 1), r = prng(o.seed ?? 7), n = 90, pts = [];
  const prof = []; for (let i = 0; i <= n; i++) { const x = -1 + 2 * i / n; prof.push(x); }
  const H = prof.map((x) => { const e = h * (.95 * Math.exp(-((x + .15) ** 2) / .05) + .7 * Math.exp(-((x - .35) ** 2) / .03) + .45 * Math.exp(-((x + .6) ** 2) / .04) + .22 * Math.exp(-((x - .7) ** 2) / .06)); return Math.max(.004, e + h * .07 * nz(x * 9, 3) * Math.min(1, e / h * 3) + .004 * (1 - x * x)); });
  for (let i = 0; i <= n; i++) pts.push(C.D(...skyDir(az + prof[i] * w, H[i])));
  pts.push(C.D(...skyDir(az + w, -.002)), C.D(...skyDir(az - w, -.002)));
  if (pts.some((p) => !p)) return;
  ctx.save(); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  const ys = pts.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, mixHex('#141030', '#4a3050', dawn)); g.addColorStop(1, mixHex('#0a0818', '#2a1c34', dawn)); ctx.fillStyle = g; ctx.fill();
  ctx.clip();
  // ridges and gullies: engraved lines down the slopes, lit gold on the dawn side
  ctx.lineWidth = 1.2;
  for (let i = 4; i < n - 4; i += 3) { const p = pts[i], q = pts[Math.min(n, i + 1)]; const sl = q[1] - p[1]; ctx.strokeStyle = rgba(sl > 0 ? '#ffb88a' : '#05040c', sl > 0 ? .25 * dawn : .35); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + (r() - .5) * 30, y1); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = rgba('#ffd09a', .7 * dawn); ctx.lineWidth = 1.6; ctx.beginPath(); pts.slice(0, n + 1).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
}
export function outrigger(ctx, t, C, o = {}) {
  const h = o.head ?? 0, fx = Math.sin(h), fz = Math.cos(h), rx = Math.cos(h), rz = -Math.sin(h), n = o.n ?? 3, L = 5.5;
  const y0 = waterY(o.x, o.z, t) * .6;
  const W = (u, v, w) => [o.x + rx * u + fx * w, y0 + v, o.z + rz * u + fz * w];
  const c = C.P(...W(0, .3, 0)); if (!c || c[0] < -300 || c[0] > 2220) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // the outrigger float and its two booms
  for (const run of projRuns(C, [W(1.5, .12, -L * .3), W(1.5, .12, L * .3)])) { ctx.strokeStyle = '#140c0c'; ctx.lineWidth = Math.max(1.5, c[2] * .12); ctx.beginPath(); ctx.moveTo(...run[0]); ctx.lineTo(...run[run.length - 1]); ctx.stroke(); }
  for (const w of [-L * .18, L * .18]) for (const run of projRuns(C, [W(0, .45, w), W(1.5, .25, w)])) { ctx.strokeStyle = '#1a1010'; ctx.lineWidth = Math.max(1, c[2] * .05); ctx.beginPath(); ctx.moveTo(...run[0]); ctx.lineTo(...run[run.length - 1]); ctx.stroke(); }
  // the hull: a long narrow dark shape with a light rim
  const hullPts = []; for (let i = 0; i <= 16; i++) { const v = i / 16, w = -L / 2 + L * v, b = .32 * Math.sin(Math.PI * v); hullPts.push(W(-b, .4, w)); } for (let i = 16; i >= 0; i--) { const v = i / 16, w = -L / 2 + L * v, b = .32 * Math.sin(Math.PI * v); hullPts.push(W(b, .4, w)); }
  const P = projPoly(C, hullPts); if (fillPoly(ctx, P, '#2a1612')) { ctx.strokeStyle = rgba(o.rim || '#ffd09a', .55); ctx.lineWidth = 1.2; ctx.stroke(); }
  // paddlers: small dark torsos, paddles dipping in rhythm
  for (let i = 0; i < n; i++) {
    const w = -L * .3 + i * L * .3, s = C.P(...W(0, .45, w)), hd = C.P(...W(0, 1.25, w)); if (!s || !hd) continue;
    const k = s[2]; ctx.fillStyle = '#120a0c'; ctx.beginPath(); ctx.moveTo(s[0] - .16 * k, s[1]); ctx.lineTo(hd[0] - .12 * k, hd[1] + .18 * k); ctx.lineTo(hd[0] + .12 * k, hd[1] + .18 * k); ctx.lineTo(s[0] + .16 * k, s[1]); ctx.fill();
    ctx.beginPath(); ctx.arc(hd[0], hd[1], .1 * k, 0, TAU); ctx.fill();
    const ph = t * 4.2 + (o.phase || 0) + (i % 2) * Math.PI, side = i % 2 ? -1 : 1, dip = Math.sin(ph);
    const top = C.P(...W(side * .2, 1.25 + .2 * dip, w + .3 * Math.cos(ph))), bot = C.P(...W(side * .75, -.1 + .3 * Math.max(0, dip), w - .5 * Math.cos(ph)));
    if (top && bot) { ctx.strokeStyle = '#1a1010'; ctx.lineWidth = Math.max(1, k * .05); ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(bot[0], bot[1]); ctx.stroke(); if (dip < 0) { ctx.strokeStyle = rgba('#e8eef8', .4); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bot[0], bot[1], k * .18, Math.PI, TAU); ctx.stroke(); } }
  }
  if (o.lit) { const p = C.P(...W(0, 1.9, L * .42)); if (p) { ctx.globalCompositeOperation = 'lighter'; const R = p[2] * 1.2, g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, rgba('#ffd9a0', .7 * o.lit)); g.addColorStop(.2, rgba('#ff8a3a', .25 * o.lit)); g.addColorStop(1, rgba('#ff8a3a', 0)); ctx.fillStyle = g; ctx.fillRect(p[0] - R, p[1] - R, 2 * R, 2 * R); } }
  ctx.restore();
}
