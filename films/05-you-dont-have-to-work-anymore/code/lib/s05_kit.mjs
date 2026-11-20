// s05_kit · shared helpers for chapter 05 "Who you are" (camera, caches, sprites, top-down figures, glass, strips).
// Everything is a pure function of t; expensive layers are built once (memo) and only composited per frame.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, stipple, roughPath, roughPoly, vnoise } from './art.mjs';
import { lin, sm, eio, eout, drift } from '../engine.mjs';
export { W, H };

export const WARM = '#ffb35c', HOT = '#ffd9a0', CREAM = '#f3efe2', WHITE = '#fff4dc';
const MEMO = new Map();
export const memo = (k, f) => { if (!MEMO.has(k)) MEMO.set(k, f()); return MEMO.get(k); };

// ---------------------------------------------------------------- camera
// c = { x, y, z, r, f:[fx,fy], os } : pan x/y (px at parallax 1), zoom z (at parallax 1), roll r, focus f, overscan os.
// Layers further away (p < 1) move and zoom less (2.5D dolly); nearer layers (p > 1) more.
export function view(ctx, c, p = 1) {
  const F = c.f || [W / 2, H / 2], z = (c.os ?? 1.06) * (1 + (c.z - 1) * p);
  ctx.translate(F[0] - (c.x || 0) * p, F[1] - (c.y || 0) * p); if (c.r) ctx.rotate(c.r * p); ctx.scale(z, z); ctx.translate(-F[0], -F[1]);
}
export function toScreen(c, p, x, y) {
  const F = c.f || [W / 2, H / 2], z = (c.os ?? 1.06) * (1 + (c.z - 1) * p), r = (c.r || 0) * p;
  const dx = (x - F[0]) * z, dy = (y - F[1]) * z, cs = Math.cos(r), sn = Math.sin(r);
  return [F[0] - (c.x || 0) * p + dx * cs - dy * sn, F[1] - (c.y || 0) * p + dx * sn + dy * cs];
}
export function plate(ctx, img, c, p = 1, a = 1, op) {
  ctx.save(); view(ctx, c, p); if (a < 1) ctx.globalAlpha = a; if (op) ctx.globalCompositeOperation = op; ctx.drawImage(img, 0, 0); ctx.restore();
}
// interpolate keyed camera values with an ease; adds a perpetual drift so nothing ever stands still
export function camAt(t, keys, { dx = 5, dy = 3.5, ph = 0 } = {}) {
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const A = keys[i], B = keys[i + 1] || A, u = B === A ? 0 : (B.ease || eio)(lin(A.t, B.t, t));
  const g = (k, d = 0) => mix(A[k] ?? d, B[k] ?? d, u);
  return { x: g('x') + drift(t, dx, ph), y: g('y') + drift(t, dy, ph + 2), z: g('z', 1) * (1 + .003 * Math.sin(t * .5 + ph)), r: g('r'), f: A.f || B.f, os: A.os };
}

// ---------------------------------------------------------------- sprites
// soft light sprite (radial, stippled falloff) for bulbs, candles, glints; draw with 'lighter'
export function glowSprite(r, col = WARM, core = WHITE, a = .9, k = .45, seed = 1) {
  return memo(`gs${r}${col}${core}${a}${k}${seed}`, () => {
    const s = Math.ceil(r * 2), [c, g] = layer(s, s), rg = g.createRadialGradient(r, r, 0, r, r, r);
    rg.addColorStop(0, rgba(core, a)); rg.addColorStop(.12, rgba(core, a * .75)); rg.addColorStop(.3, rgba(col, a * .32)); rg.addColorStop(.62, rgba(col, a * .08)); rg.addColorStop(1, rgba(col, 0));
    g.fillStyle = rg; g.fillRect(0, 0, s, s); if (k) stipple(c, { k, g: 1.2, seed }); return c;
  });
}
export function spr(ctx, img, x, y, sc = 1, a = 1) {
  if (a <= 0) return; const w = img.width * sc, h = img.height * sc; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(img, x - w / 2, y - h / 2, w, h); ctx.restore();
}
// out-of-focus bokeh disc (soft edge, slightly brighter rim), additive
export function bokehSprite(r, col = WARM) {
  return memo(`bk${r}${col}`, () => {
    const s = Math.ceil(r * 2 + 4), [c, g] = layer(s, s), m = s / 2, rg = g.createRadialGradient(m, m, 0, m, m, r);
    rg.addColorStop(0, rgba(col, .22)); rg.addColorStop(.82, rgba(col, .3)); rg.addColorStop(.94, rgba(col, .42)); rg.addColorStop(1, rgba(col, 0));
    g.fillStyle = rg; g.beginPath(); g.arc(m, m, r, 0, 7); g.fill(); return c;
  });
}

// ---------------------------------------------------------------- smear (type c hand-offs)
// draws img (already positioned via fn(dx)) several times trailing behind the motion, decreasing alpha
export function smear(ctx, vx, fn, n = 4) {
  const k = Math.min(1, Math.abs(vx) / 3000); if (k < .05) { fn(0, 1); return; }
  for (let i = n; i >= 1; i--) { ctx.save(); ctx.globalAlpha = .18 * k * (1 - i / (n + 1)); fn(-Math.sign(vx) * i * Math.abs(vx) * .012, 0); ctx.restore(); }
  fn(0, 1);
}

// ---------------------------------------------------------------- figures from above
// Seated or standing person seen from straight above. (x,y) centre of the shoulders, ang = facing direction,
// s = scale (1 -> shoulders ~40 px wide). D = colours. o.light = angle (world) toward the light for the rim.
export function topPerson(ctx, x, y, ang, s, D, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const lit = (o.light ?? ang) - ang, lx = Math.cos(lit), ly = Math.sin(lit);
  if (o.chair) { ctx.fillStyle = o.chairCol || '#1b1420'; ctx.beginPath(); ctx.roundRect(-27, -17, 15, 34, 4); ctx.fill(); }
  // shadow on the ground, away from the light
  ctx.fillStyle = 'rgba(5,4,14,.35)'; ctx.beginPath(); ctx.ellipse(-lx * 7, -ly * 7, 15, 23, 0, 0, 7); ctx.fill();
  const reach = o.reach ?? 26, sw = o.swing ?? 0, wk = o.walk;
  // arms: forward onto the table (reach) or swinging at the sides (walk)
  ctx.lineCap = 'round'; ctx.strokeStyle = D.coatDark || shade(D.coat, -.08); ctx.lineWidth = 9;
  const armL = wk ? [[0, -16], [6 + sw * 8, -19], [12 + sw * 14, -18]] : [[0, -16], [reach * .55, -17 + (o.armL || 0)], [reach, -9 + (o.armL || 0)]];
  const armR = wk ? [[0, 16], [6 - sw * 8, 19], [12 - sw * 14, 18]] : [[0, 16], [reach * .55, 17 + (o.armR || 0)], [reach + (o.reachR || 0), 9 + (o.armR || 0)]];
  for (const A of [armL, armR]) { ctx.beginPath(); ctx.moveTo(...A[0]); ctx.lineTo(...A[1]); ctx.lineTo(...A[2]); ctx.stroke(); }
  ctx.fillStyle = D.skin; for (const A of [armL, armR]) { ctx.beginPath(); ctx.arc(A[2][0] + 2, A[2][1], 4.4, 0, 7); ctx.fill(); }
  if (wk) { ctx.fillStyle = D.shoes || '#0b0a14'; ctx.beginPath(); ctx.ellipse(14 + wk * 10, -6, 6, 3.6, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(14 - wk * 10, 6, 6, 3.6, 0, 0, 7); ctx.fill(); }
  // shoulders (rounded, sloping), lighter on the light side
  const g = ctx.createLinearGradient(-lx * 20, -ly * 20, lx * 20, ly * 20); g.addColorStop(0, shade(D.coat, -.1)); g.addColorStop(1, shade(D.coat, .06));
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 12, 21, 0, 0, 7); ctx.fill();
  // head: face sliver at the front, hair over the crown
  const ht = o.head || 0; ctx.save(); ctx.rotate(ht);
  ctx.fillStyle = D.skin; ctx.beginPath(); ctx.ellipse(5.5, 0, 6.5, 7.5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = D.hair; ctx.beginPath(); ctx.ellipse(1.5, 0, 9, 9.5, 0, 0, 7); ctx.fill();
  if (o.bun) { ctx.beginPath(); ctx.arc(-6.5, 0, 4.2, 0, 7); ctx.fill(); }
  ctx.restore();
  // rim light on the side that faces the light
  ctx.strokeStyle = rgba(o.rim || HOT, o.rimA ?? .55); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, 0, 12, 21, 0, lit - .9, lit + .9); ctx.stroke();
  ctx.beginPath(); ctx.arc(1.5 + Math.cos(ht) * 0, 0, 9.4, lit - ht - .8, lit - ht + .8); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- wine glass
// (x,y) = where the hand holds the stem; s scale; tilt radians; wine colour; returns the bowl centre
export function wineGlass(ctx, x, y, s, tilt = 0, { wine = '#e0913a', a = 1, glint = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s, s); ctx.globalAlpha = a;
  // bowl: tulip outline
  const bowl = () => { ctx.beginPath(); ctx.moveTo(-15, -58); ctx.bezierCurveTo(-17, -40, -14, -24, 0, -20); ctx.bezierCurveTo(14, -24, 17, -40, 15, -58); };
  bowl(); ctx.fillStyle = 'rgba(243,239,226,.10)'; ctx.fill();
  ctx.save(); bowl(); ctx.clip(); ctx.rotate(-tilt); ctx.fillStyle = wine; ctx.fillRect(-40, -38, 80, 40);
  const g = ctx.createLinearGradient(-15, 0, 15, 0); g.addColorStop(0, 'rgba(60,20,8,.45)'); g.addColorStop(.6, 'rgba(255,220,160,.0)'); g.addColorStop(1, 'rgba(255,236,200,.35)'); ctx.fillStyle = g; ctx.fillRect(-40, -70, 80, 80); ctx.restore();
  bowl(); ctx.strokeStyle = 'rgba(255,240,215,.55)'; ctx.lineWidth = 1.4; ctx.stroke();
  // stem + foot
  ctx.fillStyle = 'rgba(255,240,215,.5)'; ctx.fillRect(-1.2, -20, 2.4, 22); ctx.beginPath(); ctx.ellipse(0, 3, 10, 2.4, 0, 0, 7); ctx.fill();
  // specular streak
  ctx.strokeStyle = 'rgba(255,248,230,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(9, -54); ctx.quadraticCurveTo(12, -42, 8, -32); ctx.stroke();
  ctx.restore();
  const c = [x + Math.sin(tilt) * 40 * s, y - Math.cos(tilt) * 40 * s];
  return c;
}

// ---------------------------------------------------------------- paper strip (flag) renderer
// tex = canvas (w x h) of the flat strip; drawn as vertical slices displaced by wave(u) -> [dy, shade]
export function stripDraw(ctx, tex, x, y, wave, { slices = 120, scale = 1, alpha = 1 } = {}) {
  const w = tex.width, h = tex.height, sw = w / slices;
  ctx.save(); ctx.globalAlpha = alpha;
  for (let i = 0; i < slices; i++) {
    const u = (i + .5) / slices, [dy, sq, shd] = wave(u), sx = i * sw;
    const hh = h * scale * (sq ?? 1);
    ctx.drawImage(tex, sx, 0, sw + .6, h, x + sx * scale, y + dy - hh / 2, sw * scale + .8, hh);
    if (shd) { ctx.fillStyle = shd > 0 ? rgba('#2a1424', Math.min(.5, shd)) : rgba('#fff6e2', Math.min(.35, -shd)); ctx.fillRect(x + sx * scale, y + dy - hh / 2, sw * scale + .8, hh); }
  }
  ctx.restore();
}

// paper texture (cream, fibres, edge darkening), w x h
export function paper(w, h, { col = '#efe6d2', seed = 1, edge = .25 } = {}) {
  const [c, g] = layer(w, h), r = prng(seed), n = vnoise(seed);
  g.fillStyle = col; g.beginPath(); roughPath(g, [[0, 0], [w, 0], [w, h], [0, h]], { amp: 1.2, seed }); g.fill();
  g.save(); g.clip();
  for (let i = 0; i < w * h / 60; i++) { g.fillStyle = r() < .5 ? 'rgba(120,90,60,.06)' : 'rgba(255,255,255,.08)'; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1); }
  const eg = g.createLinearGradient(0, 0, 0, h); eg.addColorStop(0, `rgba(90,60,40,${edge})`); eg.addColorStop(.18, 'rgba(90,60,40,0)'); eg.addColorStop(.82, 'rgba(90,60,40,0)'); eg.addColorStop(1, `rgba(90,60,40,${edge})`); g.fillStyle = eg; g.fillRect(0, 0, w, h);
  g.restore(); return c;
}

export const easeOutBack = (x) => { const c = 1.4; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export { lin, sm, eio, eout, clamp, mix, rgba, prng, shade, mixHex };

// art.mjs bloom()/pool() stipple while a transform is set, and @napi-rs/canvas applies that transform to
// putImageData, so their grain lands in a shifted rectangle. Fixed copies (transform reset before stipple):
import { put } from './art.mjs';
export function bloom(ctx, x, y, r, { col = WARM, core = '#ffd59a', a = .6, k = .5, seed = 1, sy = 1, op = 'lighter' } = {}) {
  const [c, g] = layer(); g.translate(x, y); g.scale(1, sy);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, rgba(core, a)); rg.addColorStop(.15, rgba(col, a * .6)); rg.addColorStop(.5, rgba(col, a * .18)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k, g: 1.2, seed }); put(ctx, c, { op }); return c;
}
export function pool(ctx, x, y, rx, ry, { col = WARM, a = .6, k = .7, seed = 1, op = 'lighter', rot = 0 } = {}) {
  const [c, g] = layer(); g.translate(x, y); g.rotate(rot); g.scale(1, ry / rx);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, rgba(col, a)); rg.addColorStop(.4, rgba(col, a * .5)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.beginPath(); g.arc(0, 0, rx, 0, 7); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k, g: 1.2, seed }); put(ctx, c, { op }); return c;
}
