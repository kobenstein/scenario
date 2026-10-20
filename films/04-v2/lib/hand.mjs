// Hands for Film 5: capsule fingers, a soft palm, sleeve in the accent colour, rim light on the light side,
// volume shading and engraved hatching on the shadow side, a breathing micro-motion from o.t.
//   hand(ctx, x, y, s, o)   x,y = wrist on screen, s = scale (s = 1 → ~150 px wrist to fingertip)
//     o: { pose: 'open'|'grip'|'write'|'reach'|'cup'|'baby', ang (finger direction, rad; 0 = right, -π/2 = up),
//          flip (mirror: left hand), skin, sleeve (accent colour or null), sleeveLen (px in hand units, default 260),
//          rim (colour), light ([dx,dy] direction the light comes FROM, default [0.3,-1]), t, seed,
//          close (0..1, closes the fingers: baby grip, picking up), spread (0..1.5), prop(ctx) drawn in hand units, ring (bool) }
//   handTip(x, y, s, o) → [x, y] screen position of the index fingertip (for a light, a pen point, a coin)
//   palmPos(x, y, s, o) → [x, y] centre of the palm (where a share light rests)
import { Path2D } from '@napi-rs/canvas';
import { rgba, mix, clamp, hatch } from '../engine.mjs';

const SKIN = ['#e9c2a0', '#c99a74', '#a8734f', '#7a4f33', '#5a3a26', '#f1d3b8'];
export const SKINS = SKIN;
const POSE = { // curl of [proximal, distal] per finger (0 = straight), spread, thumb angle, finger length factor
  open: { curl: [.08, .1], spread: 1, thumb: -.95, len: 1 },
  cup: { curl: [.35, .4], spread: .55, thumb: -.6, len: .86 },
  reach: { curl: [.05, .12], spread: .8, thumb: -.7, len: 1 },
  grip: { curl: [1.25, 1.2], spread: .3, thumb: -.25, len: .6 },
  write: { curl: [.9, 1.0], spread: .3, thumb: -.35, len: .7, write: true },
  baby: { curl: [.3, .35], spread: .8, thumb: -.8, len: .78, baby: true },
};
function cap(p, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1))));
  p.moveTo(x1 + Math.cos(a + Math.PI / 2 + k) * r1, y1 + Math.sin(a + Math.PI / 2 + k) * r1);
  p.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k);
  p.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k);
  p.closePath();
}
// geometry in hand units (wrist at 0,0, fingers along +x, thumb toward -y)
function geo(o) {
  const P = POSE[o.pose] || POSE.open, t = o.t ?? 0, ph = (o.seed || 0) * 2.1;
  const close = clamp(o.close ?? 0), baby = !!P.baby, k = baby ? 1.25 : 1;     // baby: chubby
  const flex = .04 * Math.sin(t * 1.3 + ph);                                  // fingers breathe
  const spread = (o.spread ?? P.spread);
  const fingers = [[-19, 52, 6.8], [-6.5, 57, 6.7], [6, 53, 6.3], [18, 42, 5.6]].map(([by, L, r], i) => {
    const c0 = mix(P.curl[0], 1.35, close) + flex * (1 + i * .3), c1 = mix(P.curl[1], 1.3, close) + flex;
    const base = [60 - Math.abs(by) * .12, by * (baby ? 1.08 : 1)], dir = [-.11, -.035, .045, .13][i] * spread * (1 - close * .6);
    const l1 = L * .56 * P.len * (baby ? .72 : 1), l2 = L * .44 * P.len * (baby ? .72 : 1);
    const fs = Math.cos(Math.min(1.3, c0) * .9);          // foreshortening as the finger curls toward us
    const a1 = dir + c0 * .18, j = [base[0] + Math.cos(a1) * l1 * fs, base[1] + Math.sin(a1) * l1 * fs];
    const a2 = a1 + c1 * .35, tip = [j[0] + Math.cos(a2) * l2 * Math.cos(Math.min(1.4, c1) * .95), j[1] + Math.sin(a2) * l2 * Math.cos(Math.min(1.4, c1) * .95)];
    return { base, j, tip, r: r * k };
  });
  const ta = P.thumb * (1 - close * .5) + flex * .5, tb = [12, -19 * (baby ? 1.05 : 1)];
  const tj = [tb[0] + Math.cos(ta) * 28 * (baby ? .75 : 1), tb[1] + Math.sin(ta) * 28 * (baby ? .75 : 1)];
  const ta2 = ta + .35 + close * .5, tt = [tj[0] + Math.cos(ta2) * 24 * (baby ? .7 : 1), tj[1] + Math.sin(ta2) * 24 * (baby ? .7 : 1)];
  if (P.write) { tt[0] = fingers[0].tip[0] + 2; tt[1] = fingers[0].tip[1] - 6; }
  return { fingers, thumb: { tb, tj, tt, r: 8.6 * k }, k, P };
}
function toScreen(x, y, s, o, px, py) {
  const a = o.ang ?? 0, f = o.flip ? -1 : 1, c = Math.cos(a), sn = Math.sin(a), qy = py * f;
  return [x + (px * c - qy * sn) * s, y + (px * sn + qy * c) * s];
}
export const handTip = (x, y, s, o = {}) => { const G = geo(o), tp = G.fingers[0].tip; return toScreen(x, y, s, o, tp[0], tp[1]); };
export const palmPos = (x, y, s, o = {}) => toScreen(x, y, s, o, 40, 0);

export function hand(ctx, x, y, s, o = {}) {
  const G = geo(o), skin = o.skin || SKIN[1], rim = o.rim || null, f = o.flip ? -1 : 1;
  const light = o.light || [.3, -1], lm = Math.hypot(light[0], light[1]) || 1, lx = light[0] / lm, ly = light[1] / lm;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang ?? 0); ctx.scale(s, s * f);
  // light direction in hand units (undo rotation and flip)
  const a = -(o.ang ?? 0), Lx = lx * Math.cos(a) - ly * Math.sin(a), Ly = (lx * Math.sin(a) + ly * Math.cos(a)) * f;
  const shape = new Path2D(), k = G.k;
  // palm
  shape.moveTo(-2, -21 * k); shape.quadraticCurveTo(30, -27 * k, 58, -25 * k); shape.quadraticCurveTo(70, -2, 60, 24 * k);
  shape.quadraticCurveTo(30, 27 * k, -2, 21 * k); shape.quadraticCurveTo(-8, 0, -2, -21 * k); shape.closePath();
  for (const fg of G.fingers) { cap(shape, fg.base[0], fg.base[1], fg.r * 1.05, fg.j[0], fg.j[1], fg.r * .92); cap(shape, fg.j[0], fg.j[1], fg.r * .92, fg.tip[0], fg.tip[1], fg.r * .78); }
  const T = G.thumb; cap(shape, T.tb[0], T.tb[1], T.r * 1.15, T.tj[0], T.tj[1], T.r * .85); cap(shape, T.tj[0], T.tj[1], T.r * .85, T.tt[0], T.tt[1], T.r * .7);
  // sleeve
  if (o.sleeve) {
    const sl = o.sleeveLen ?? 260, sw = 27 * k;
    ctx.save(); ctx.fillStyle = rim ? rgba(rim, .9) : o.sleeve;
    if (rim) { ctx.beginPath(); ctx.roundRect(-sl + Lx * 2, -sw + Ly * 2, sl + 6, sw * 2, 10); ctx.fill(); }
    ctx.fillStyle = o.sleeve; ctx.beginPath(); ctx.roundRect(-sl, -sw, sl + 6, sw * 2, 10); ctx.fill();
    const g = ctx.createLinearGradient(Lx * sw, Ly * sw, -Lx * sw, -Ly * sw); g.addColorStop(0, 'rgba(255,240,220,.12)'); g.addColorStop(1, 'rgba(0,0,8,.45)');
    ctx.fillStyle = g; ctx.fillRect(-sl, -sw, sl + 6, sw * 2);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-14, -sw, 4, sw * 2);   // cuff seam
    ctx.restore();
  }
  // rim: the silhouette shifted toward the light, then the skin on top
  if (rim) { ctx.save(); ctx.translate(Lx * 2.4, Ly * 2.4); ctx.fillStyle = rim; ctx.fill(shape); ctx.restore(); }
  ctx.fillStyle = skin; ctx.fill(shape);
  ctx.save(); ctx.clip(shape);
  // volume: light side warm lift, far side into shadow
  const g = ctx.createLinearGradient(30 + Lx * 32, Ly * 32, 30 - Lx * 32, -Ly * 32);
  g.addColorStop(0, 'rgba(255,238,215,.22)'); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,6,20,.5)');
  ctx.fillStyle = g; ctx.fillRect(-20, -80, 160, 160);
  // finger separations + palm creases (ink, very light)
  ctx.strokeStyle = 'rgba(40,20,20,.28)'; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
  for (const fg of G.fingers) { ctx.beginPath(); ctx.moveTo(fg.j[0] - 2, fg.j[1] - fg.r * .55); ctx.lineTo(fg.j[0] + 1, fg.j[1] + fg.r * .55); ctx.stroke(); }
  if (o.pose === 'open' || o.pose === 'cup' || o.pose === 'baby' || !o.pose) {
    ctx.beginPath(); ctx.moveTo(52, -16); ctx.quadraticCurveTo(36, -4, 24, 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, -17); ctx.quadraticCurveTo(24, 2, 8, 18); ctx.stroke();
  }
  hatch(ctx, null, 1.0, 3.4, .28, { box: [-20, -80, 170, 160], fade: [30 - Lx * 40, -Ly * 40, 30 + Lx * 10, Ly * 10], col: '#140a14', w: .8, wobble: .4 });
  ctx.restore();
  if (o.ring) { const fg = G.fingers[2]; ctx.strokeStyle = '#e9c46a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(mix(fg.base[0], fg.j[0], .5), mix(fg.base[1], fg.j[1], .5), 3, fg.r + 1, 0, 0, 7); ctx.stroke(); }
  if (o.henna) { ctx.strokeStyle = 'rgba(120,40,20,.55)'; ctx.lineWidth = 1.2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(30, 0, 6 + i * 5, -1.2, 1.2); ctx.stroke(); } }
  if (o.prop) o.prop(ctx, G);
  ctx.restore();
}
