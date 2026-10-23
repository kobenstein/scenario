// Film 8 · people: calm silhouettes with a rim from the one light (fire-circle style), always alive (breath, weight, blinks are in figure.mjs).
//   backFig(ctx, t, x, y, s, o)        figure.mjs figureBack (seen from behind, standing) rendered at a quantised scale and scaled: any size,
//                                      bounded caches. x,y = feet, s = px per 178 px of figure (s = k·h/1.78 for a person h m tall at k px/m)
//   walkerBack(ctx, t, x, y, h, phase, o)   a person walking away from us (back view), h = px height; o: { light: {x,y,col,a}, lantern: col|null, dress }
//                                      → { lantern: [x, y] } (the lamp in the front hand, hidden by the body: its glow wraps round the hip)
//   crowdWalker(ctx, t, x, y, h, phase, o)  a tiny walker in profile (crowds), o: { dir 1|-1, lamp: a (0..1), col }
import { canvas, rgba, clamp } from '../engine.mjs';
import { figureBack, breath, weight } from './figure.mjs';
import { capsule } from './figure.mjs';
import { TAU, mixHex } from './s8_kit.mjs';

const QC = new Map();
export function backFig(ctx, t, x, y, s, o = {}) {
  if (s < .02) return null;
  const q = Math.min(3.2, Math.pow(2, Math.round(Math.log2(s) * 3) / 3)), key = q.toFixed(3);
  let E = QC.get(key);
  const cw = Math.ceil(170 * q), ch = Math.ceil(230 * q);
  if (!E) { E = canvas(cw, ch); QC.set(key, E); }
  const [c, g] = E;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, cw, ch);
  const k = s / q, ox = 85 * q, oy = 215 * q;
  // the light position in the local canvas
  const L = o.light ? { ...o.light, x: ox + (o.light.x - x) / k, y: oy + (o.light.y - y) / k } : undefined;
  const r = figureBack(g, ox, oy, q, { ...o, t, light: L });
  ctx.drawImage(c, x - ox * k, y - oy * k, cw * k, ch * k);
  return { head: [x + (r.head[0] - ox) * k, y + (r.head[1] - oy) * k] };
}

// ---------------------------------------------------------------- a walker seen from behind
const WC = canvas(400, 600);
export function walkerBack(ctx, t, x, y, h, phase, o = {}) {
  const [c, g] = WC, S = 300 / 180, k = h / 180;   // draw at 300 px tall in the cache, scale to h
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 400, 600);
  const u = phase / TAU, sw = Math.sin(phase), bob = Math.abs(Math.cos(phase)) * 2.2, b = breath(t, 2) * .6;
  const D = Object.assign({ coat: '#1d1c33', pants: '#0f0e1c', skin: '#3a2a26', hair: '#0c0a12', bag: '#2a2236' }, o.dress || {});
  const paint = (q, mono) => {
    q.setTransform(S, 0, 0, S, 200, 560);
    const col = (k2) => mono || D[k2];
    const lift = (i) => { const s = i ? -sw : sw; return Math.max(0, s); };   // the leg in swing lifts the heel
    // legs: back view: the swing leg is shorter (knee bent, foot lifted), the stance leg straight; feet alternate
    for (const i of [0, 1]) {
      const xs = i ? 7.5 : -7.5, L = lift(i), fy = -4 - L * 13, kx = xs + (i ? 1 : -1) * L * 1.5;
      q.fillStyle = col('pants'); capsule(q, xs, -92 + bob, 8.6, kx, -50 + bob - L * 6, 6.6); capsule(q, kx, -50 + bob - L * 6, 6.4, xs * .95, fy, 5.0);
      q.fillStyle = mono || '#08070e'; q.beginPath(); q.ellipse(xs * .95, fy + 1.5, 6, 4.2 - L * 2.2, 0, 0, TAU); q.fill();
    }
    // arms: the swing shows as the forearm going out of sight (forward) or reaching further down/back
    for (const i of [0, 1]) {
      const sgn = i ? 1 : -1, ph = (i ? -sw : sw), ext = .5 + .5 * ph;   // ext 1 = arm back (visible, long), 0 = forward (shorter)
      q.fillStyle = col('coat'); capsule(q, 18 * sgn, -142 + bob - b, 6.8, 23 * sgn, -114 + bob, 5.8);
      if (!(i === 1 && o.lantern)) { capsule(q, 23 * sgn, -114 + bob, 5.6, (21 + 2 * ext) * sgn, -88 - (1 - ext) * 12 + bob, 4.6); q.fillStyle = col('skin'); q.beginPath(); q.ellipse((21 + 2 * ext) * sgn, -84 - (1 - ext) * 12 + bob, 3.8, 4.8, 0, 0, TAU); q.fill(); }
      else { capsule(q, 23 * sgn, -114 + bob, 5.6, 17 * sgn, -96 + bob, 4.8); }   // the lamp hand is in front of the body
    }
    // coat with a small pack, shoulders breathe
    q.fillStyle = col('coat'); q.beginPath();
    q.moveTo(-18, -74 + bob); q.bezierCurveTo(-19.5, -96, -16, -110, -16.5, -122 + bob); q.bezierCurveTo(-17, -136, -22, -141 - b, -17.5, -147 - b + bob);
    q.bezierCurveTo(-12, -152 - b + bob, 12, -152 - b + bob, 17.5, -147 - b + bob); q.bezierCurveTo(22, -141 - b, 17, -136, 16.5, -122 + bob);
    q.bezierCurveTo(16, -110, 19.5, -96, 18, -74 + bob); q.quadraticCurveTo(0, -70 + bob, -18, -74 + bob); q.closePath(); q.fill();
    q.fillStyle = col('bag'); q.beginPath(); q.roundRect(-11, -138 + bob, 22, 30, 6); q.fill();
    q.fillStyle = col('skin'); capsule(q, 0, -150 - b + bob, 4.4, 0, -157 - b + bob, 4.2);
    q.fillStyle = col('hair'); q.beginPath(); q.ellipse(0, -166 - b + bob, 9, 11, 0, 0, TAU); q.fill();
  };
  paint(g, null);
  // rim light: mask shifted away from the light
  const L = o.light;
  if (L) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    const [mc, mg] = RIM; mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalCompositeOperation = 'source-over'; mg.clearRect(0, 0, 400, 600); paint(mg, '#fff');
    const lx = (L.x - x) / k, ly = (L.y - (y - h * .6)) / k, m = Math.hypot(lx, ly) || 1, rw = 2.4;
    mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalCompositeOperation = 'destination-out'; mg.drawImage(mc, -lx / m * rw, -ly / m * rw);
    mg.globalCompositeOperation = 'source-in'; mg.fillStyle = L.col || '#ffb35c'; mg.fillRect(0, 0, 400, 600);
    g.globalAlpha = L.a ?? .9; g.drawImage(mc, 0, 0); g.globalAlpha = 1;
  }
  if (o.lantern) {   // the lamp's warm light spills round the right hip and the inside of the arm
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
    const px = 200 + 30 * S, py = 560 - 98 * S, gg = g.createRadialGradient(px, py, 0, px, py, 30 * S);
    gg.addColorStop(0, rgba(o.lantern, .4)); gg.addColorStop(.5, rgba(o.lantern, .1)); gg.addColorStop(1, rgba(o.lantern, 0)); g.fillStyle = gg; g.fillRect(0, 0, 400, 600);
    g.globalCompositeOperation = 'source-over';
  }
  const z = k / S; ctx.drawImage(c, x - 200 * z, y - 560 * z, 400 * z, 600 * z);
  return { lantern: [x + 24 * k, y - 98 * k] };
}
const RIM = canvas(400, 600);

// ---------------------------------------------------------------- a tiny walker in profile, with a lamp (crowds at a distance)
export function crowdWalker(ctx, t, x, y, h, phase, o = {}) {
  const k = h / 180, d = o.dir ?? 1, sw = Math.sin(phase), bob = Math.abs(Math.cos(phase)) * 2;
  ctx.save(); ctx.translate(x, y); ctx.scale(k * d, k);
  ctx.fillStyle = o.col || '#0b0a16';
  for (const s of [sw, -sw]) { const a = s * .45; capsule(ctx, 0, -92 + bob, 9, Math.sin(a) * 46, -92 + bob + Math.cos(a) * 46, 6.5); capsule(ctx, Math.sin(a) * 46, -46 + bob, 6.4, Math.sin(a) * 46 + Math.sin(a - .3 * Math.max(0, -s)) * 44, bob, 5); }
  capsule(ctx, 0, -95 + bob, 15, 2, -145 + bob, 16);
  ctx.beginPath(); ctx.arc(4, -166 + bob, 11, 0, TAU); ctx.fill();
  const a2 = -sw * .35; capsule(ctx, 2, -140 + bob, 6, 2 + Math.sin(a2) * 30, -140 + bob + Math.cos(a2) * 30, 5);
  // the lamp hand, forward
  capsule(ctx, 4, -138 + bob, 6, 18, -112 + bob, 5); capsule(ctx, 18, -112 + bob, 5, 30, -100 + bob, 4.4);
  ctx.restore();
  const la = o.lamp ?? 1;
  if (la > 0) {
    const lx = x + 32 * k * d, ly = y + (-96 + bob) * k;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(6, 70 * k)); g.addColorStop(0, rgba('#ffb35c', .55 * la)); g.addColorStop(.3, rgba('#ff8a3a', .15 * la)); g.addColorStop(1, rgba('#c4512e', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lx, ly, Math.max(6, 70 * k), 0, TAU); ctx.fill();
    ctx.fillStyle = rgba('#fff1d6', .95 * la); ctx.beginPath(); ctx.arc(lx, ly, Math.max(1, 5 * k), 0, TAU); ctx.fill();
    ctx.restore();
  }
}
