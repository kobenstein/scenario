// Chapter 04 helpers (only used by scenes/s04.mjs and lib/s04_*.mjs).
// - once(): build an expensive static layer one time, then reuse it every frame
// - fig(): a copy of art.person() that reuses pooled canvases (art.person allocates two big canvases per call,
//   ~100 ms for a large figure); same drawing, same look, ~10x cheaper; cropped bounding box
// - lay()/at(): 2.5D camera for cached layers (parallax p, dolly z)
// - smear(): cheap directional motion smear for (c) hand-offs
import { createCanvas } from '@napi-rs/canvas';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, printFinish } from './art.mjs';

export const sm = (x) => x * x * (3 - 2 * x);
export const lin = (a, b, t) => clamp((t - a) / (b - a));
export const eio = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const eout = (x) => 1 - Math.pow(1 - x, 3);
export const ein = (x) => x * x * x;
export const qio = (x) => x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2;
export const drift = (t, a = 1, ph = 0) => a * (Math.sin(t * 0.37 + ph) * 0.6 + Math.sin(t * 0.91 + ph * 1.7) * 0.3 + Math.sin(t * 1.73 + ph * 2.3) * 0.1);
export const HOT = '#ffd59a';

// cached layers are grouped by key prefix (before ':'); groups not touched for a few group switches are dropped so the
// chapter's memory stays flat (~one or two shots' layers); a dropped layer is rebuilt identically if needed again
const CACHE = new Map(), GROUP = new Map();
let tick = 0, lastG = null;
export function once(key, fn) {
  const g = key.split(':')[0];
  if (g !== lastG) { lastG = g; tick++; GROUP.set(g, tick);
    for (const [gg, tk] of GROUP) if (gg !== 'ls' && tick - tk > 12) { GROUP.delete(gg); for (const k of [...CACHE.keys()]) if (k.split(':')[0] === gg) CACHE.delete(k); } }
  if (!CACHE.has(key)) CACHE.set(key, fn()); return CACHE.get(key);
}
export function lay2(w = W, h = H) { const c = createCanvas(Math.ceil(w), Math.ceil(h)); return [c, c.getContext('2d')]; }

// ---------------------------------------------------------------- camera
// A layer image is centred on the frame at rest. cam = {x, y, z, r}: the camera looks at (W/2 + x, H/2 + y),
// zoom z, roll r. A layer with parallax p moves p * x and scales 1 + (z - 1) * p (near layers grow faster: dolly).
export function T(cam, p = 1) {
  const z = 1 + (cam.z - 1) * p, cx = W / 2 + (cam.x || 0) * p, cy = H / 2 + (cam.y || 0) * p;
  return { z, X: (x) => W / 2 + (x - cx) * z, Y: (y) => H / 2 + (y - cy) * z, cx, cy };
}
export function lay(ctx, img, cam, p = 1, { dx = 0, dy = 0, a = 1, op = null } = {}) {
  const t = T(cam, p), x0 = (W - img.width) / 2 + dx, y0 = (H - img.height) / 2 + dy;
  ctx.save(); if (a !== 1) ctx.globalAlpha = a; if (op) ctx.globalCompositeOperation = op;
  ctx.setTransform(t.z, 0, 0, t.z, t.X(x0), t.Y(y0));
  ctx.drawImage(img, 0, 0); ctx.restore();
}
// apply the camera transform for layer p so that drawing in world coords lands right (call inside save/restore)
export function camTo(ctx, cam, p = 1) { const t = T(cam, p); ctx.setTransform(t.z, 0, 0, t.z, W / 2 - t.cx * t.z, H / 2 - t.cy * t.z); return t; }

// ---------------------------------------------------------------- smear for (c) motion hand-offs
const [smC, smX] = lay2(W / 4, H / 4);
export function smear(ctx, src, dx, dy, a = .5) {
  if (Math.abs(dx) + Math.abs(dy) < 2) return;
  smX.clearRect(0, 0, W / 4, H / 4); smX.drawImage(src, 0, 0, W / 4, H / 4);
  ctx.save(); const n = 5;
  for (let i = 1; i <= n; i++) { ctx.globalAlpha = a * (1 - i / (n + 1)) * .55; ctx.drawImage(smC, -dx * i / n, -dy * i / n, W, H); }
  ctx.restore();
}

// ---------------------------------------------------------------- figures (pooled copy of art.person)
function capsule(ctx, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1))));
  ctx.beginPath(); ctx.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); ctx.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); ctx.closePath(); ctx.fill();
}
const PDEF = { lean: 0, head: 0, sh: [0.15, -0.1], el: [0.3, 0.25], hip: [0.05, -0.05], kn: [0, 0], hair: 'short', coat: 0, skirt: false, bulk: 1, hood: false, scarf: false };
function rig(P) {
  const shY = -64;
  return {
    shY,
    arm: (i) => { const a = P.sh[i], e = P.el[i], sx = i ? -3 : 3, sy = shY + 7, ex = sx + Math.sin(a) * 29, ey = sy + Math.cos(a) * 29; return { sx, sy, ex, ey, hx: ex + Math.sin(a + e) * 26, hy: ey + Math.cos(a + e) * 26, ang: a + e }; },
    leg: (i) => { const a = P.hip[i], k = P.kn[i], sx = i ? -4 : 4, kx = sx + Math.sin(a) * 45, ky = Math.cos(a) * 45; return { sx, kx, ky, fx: kx + Math.sin(a - k) * 43, fy: ky + Math.cos(a - k) * 43 }; },
  };
}
const POOL = new Map();
function pooled(w, h, slot) {
  const k = `${w}x${h}:${slot}`; let e = POOL.get(k);
  if (!e) { const c = createCanvas(w, h); e = [c, c.getContext('2d')]; POOL.set(k, e); }
  const [c, g] = e; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, w, h); return e;
}
// fig(ctx, x, y, s, pose, o): same API as art.person (x,y = hip joint, s = scale, ~185 px standing at s = 1)
export function fig(ctx, x, y, s, pose = {}, o = {}) {
  const P = Object.assign({}, PDEF, pose), R = rig(P), B = P.bulk, flip = o.flip ? -1 : 1;
  const D = Object.assign({ coat: '#3a3560', pants: '#14132a', shoes: '#0b0a18', skin: '#d9b08e', hair: '#1c1420', shirt: null }, o.dress || {});
  // bounding box in figure units (generous for raised arms / props), quantised so the pool stays small
  const bx0 = -150, bx1 = 150, by0 = -190, by1 = 115;
  const bw = Math.ceil((bx1 - bx0) * s / 16) * 16 + 16, bh = Math.ceil((by1 - by0) * s / 16) * 16 + 16, ox = -bx0 * s + 8, oy = -by0 * s + 8;
  const [c, g] = pooled(bw, bh, 0);
  g.translate(ox, oy); g.scale(s * flip, s);
  const legC = D.pants, armC = D.coat;
  const leg = (i, col) => { const l = R.leg(i); g.fillStyle = col; capsule(g, l.sx, 0, 9.5 * B, l.kx, l.ky, 6.5); capsule(g, l.kx, l.ky, 6.5, l.fx, l.fy, 4.6); g.fillStyle = D.shoes; g.beginPath(); g.ellipse(l.fx + 6, l.fy + 2.5, 9.5, 4.6, 0, 0, 7); g.fill(); };
  const arm = (i, col) => { const m = R.arm(i); g.fillStyle = col; capsule(g, m.sx, m.sy, 8.6 * B, m.ex, m.ey, 6.4); capsule(g, m.ex, m.ey, 6.2, m.hx, m.hy, 5); g.fillStyle = D.skin; g.beginPath(); g.ellipse(m.hx + Math.sin(m.ang) * 3.5, m.hy + Math.cos(m.ang) * 3.5, 4.6, 5.4, -m.ang, 0, 7); g.fill(); };
  if (!o.noLegs) { leg(1, shade(legC, -.03)); leg(0, legC); }
  g.save(); g.rotate(P.lean);
  if (o.propBack) o.propBack(g, R.arm(0), R.arm(1), D);
  arm(1, shade(armC, -.06));
  const sY = R.shY, w = B, hem = P.coat ? 22 + 16 * P.coat : 6;
  g.fillStyle = armC; g.beginPath();
  g.moveTo(-15 * w, 4); g.bezierCurveTo(-17 * w, -14, -13 * w, -30, -14 * w, -46); g.bezierCurveTo(-15 * w, sY + 4, -12 * w, sY - 3, -4, sY - 4); g.lineTo(5, sY - 4);
  g.bezierCurveTo(14 * w, sY - 3, 20 * w, sY + 6, 19 * w, -44); g.bezierCurveTo(18 * w, -30, 13 * w, -14, 15 * w, 4);
  if (P.skirt) { g.lineTo(21 * w, hem + 34); g.quadraticCurveTo(0, hem + 38, -20 * w, hem + 34); }
  else if (P.coat) { g.lineTo(17 * w + P.coat * 3, hem); g.quadraticCurveTo(0, hem + 3, -17 * w - P.coat * 3, hem); }
  else g.quadraticCurveTo(0, 12, -15 * w, 4);
  g.closePath(); g.fill();
  if (P.skirt && D.skirt) { g.fillStyle = D.skirt; g.beginPath(); g.moveTo(-15 * w, 0); g.lineTo(15 * w, 0); g.lineTo(21 * w, hem + 34); g.quadraticCurveTo(0, hem + 38, -20 * w, hem + 34); g.closePath(); g.fill(); }
  g.fillStyle = rgba('#000000', .16); g.fillRect(10 * w, sY + 4, 1.6, (P.coat ? hem : 2) - sY - 4);
  if (P.coat) { g.fillRect(4, -18, 9, 1.4); }
  if (P.scarf) { g.fillStyle = D.scarf || C.rose; g.beginPath(); g.ellipse(2, sY - 1, 11, 6, .1, 0, 7); g.fill(); g.fillRect(4, sY, 6, 20); }
  g.save(); g.translate(1, sY - 2); g.rotate(P.head);
  g.fillStyle = D.skin; capsule(g, 0, 3, 5.4, 1.5, -5, 4.8);
  g.beginPath(); g.ellipse(2.5, -16, 10.2, 11.8, .12, 0, 7); g.fill();
  g.fillStyle = D.hair;
  const hs = {
    short: () => { g.beginPath(); g.ellipse(0, -20, 10.4, 9.5, .12, Math.PI * .75, Math.PI * 2.05); g.closePath(); g.fill(); },
    long: () => { g.beginPath(); g.moveTo(9, -26); g.quadraticCurveTo(-4, -33, -10, -20); g.quadraticCurveTo(-14, -2, -9, 12); g.quadraticCurveTo(-1, 14, 0, 4); g.quadraticCurveTo(-3, -12, 9, -22); g.closePath(); g.fill(); },
    bun: () => { hs.short(); g.beginPath(); g.arc(-8, -27, 5.6, 0, 7); g.fill(); },
    curly: () => { for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-8 + i * 3, -26 + Math.sin(i * 2) * 1.5 + (i < 2 ? 6 : 0), 5, 0, 7); g.fill(); } },
    grey: () => { g.beginPath(); g.ellipse(-2, -19, 9.6, 8, .2, Math.PI * .6, Math.PI * 1.75); g.closePath(); g.fill(); },
    bald: () => { },
    cap: () => { g.beginPath(); g.ellipse(1, -22, 11, 7, .1, Math.PI, Math.PI * 2.02); g.closePath(); g.fill(); g.fillRect(4, -23, 13, 3); },
  };
  (hs[P.hair] || hs.short)();
  if (P.hair === 'cap' || P.hair === 'grey') { g.fillStyle = D.hairBack || D.hair; g.beginPath(); g.ellipse(-3.5, -13, 7, 9.5, .15, Math.PI * .45, Math.PI * 1.5); g.closePath(); g.fill(); g.fillStyle = shade(D.skin, -.08); g.beginPath(); g.ellipse(1, -14, 2.2, 3.4, 0, 0, 7); g.fill(); }
  if (P.hood) { g.fillStyle = armC; g.beginPath(); g.moveTo(10, -30); g.quadraticCurveTo(-6, -36, -13, -18); g.quadraticCurveTo(-15, 0, -6, 6); g.lineTo(4, 6); g.quadraticCurveTo(-3, -4, -2, -14); g.quadraticCurveTo(0, -27, 12, -24); g.closePath(); g.fill(); }
  g.restore();
  arm(0, armC);
  if (o.prop) o.prop(g, R.arm(0), R.arm(1), D);
  g.restore();
  if (o.light) {
    const { x: lx, y: ly, col = HOT, a = .55 } = o.light;
    const dx = lx - x, dy = ly - y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, cx = ox, cy = oy - 60 * s;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
    const gr = g.createLinearGradient(cx - ux * 30 * s, cy - uy * 30 * s, cx + ux * 30 * s, cy + uy * 30 * s);
    gr.addColorStop(0, 'rgba(5,6,20,.38)'); gr.addColorStop(.5, 'rgba(5,6,20,0)'); gr.addColorStop(.62, rgba(col, 0)); gr.addColorStop(1, rgba(col, a));
    g.fillStyle = gr; g.fillRect(0, 0, bw, bh);
  }
  if (o.shadeA) { g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = rgba(o.shadeCol || '#070818', o.shadeA); g.fillRect(0, 0, bw, bh); }
  if (o.rim) {
    const [rc, rx] = pooled(bw, bh, 1); rx.drawImage(c, 0, 0); rx.globalCompositeOperation = 'source-in'; rx.fillStyle = o.rim; rx.fillRect(0, 0, bw, bh);
    const off = o.rimW ?? Math.max(1.2, 1.6 * s), side = o.rimSide ?? 1;
    ctx.save(); if (o.alpha !== undefined) ctx.globalAlpha = o.alpha; ctx.drawImage(rc, x - ox + side * off, y - oy - off * .4); ctx.restore();
  }
  ctx.save(); if (o.alpha !== undefined) ctx.globalAlpha = o.alpha; ctx.drawImage(c, x - ox, y - oy); ctx.restore();
  return { hand: (i) => { const m = R.arm(i), cs = Math.cos(P.lean), sn = Math.sin(P.lean), hx = m.hx + Math.sin(m.ang) * 4, hy = m.hy + Math.cos(m.ang) * 4; return [x + (hx * cs - hy * sn) * s * flip, y + (hx * sn + hy * cs) * s]; }, head: () => { const cs = Math.cos(P.lean), sn = Math.sin(P.lean), hx = 3.5, hy = R.shY - 18; return [x + (hx * cs - hy * sn) * s * flip, y + (hx * sn + hy * cs) * s]; }, feetY: y + 88 * s };
}
// walking pose: phase in cycles; amp 0..1
export function walk(ph, amp = 1, extra = {}) {
  const a = Math.sin(ph * Math.PI * 2) * amp;
  return Object.assign({ lean: .05, head: .04, sh: [-a * .45, a * .45], el: [.35, .35], hip: [a * .42, -a * .42], kn: [.12 + Math.max(0, -a) * .5, .12 + Math.max(0, a) * .5] }, extra);
}
export const bob = (ph, s, amp = 1) => -Math.abs(Math.cos(ph * Math.PI * 2)) * 2.2 * s * amp;

// soft ground shadow ellipse
export function footShadow(ctx, x, y, rx, a = .4, col = '#05060f') {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, .22); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 7); ctx.fill(); ctx.restore();
}
// cheap additive glow (no stipple), for per-frame breathing lights
export function glowA(ctx, x, y, r, a, col = C.amber, core = HOT, sy = 1) {
  if (r <= 0 || a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(1, sy);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, rgba(core, a)); g.addColorStop(.2, rgba(col, a * .55)); g.addColorStop(.55, rgba(col, a * .15)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore();
}
// light print finish per shot (the film runner adds its own vignette + grain on top)
export function finish(ctx, o = {}) { printFinish(ctx, Object.assign({ grain: .07, vig: .32 }, o)); }
// pre-stippled sprite of a soft light (built once): draw scaled with 'lighter' each frame
export function lightSprite(key, col, core, { k = .55, seed = 1, size = 512 } = {}) {
  return once('ls:' + key, () => {
    const [c, g] = lay2(size, size), r = size / 2, rg = g.createRadialGradient(r, r, 0, r, r, r);
    rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(.15, rgba(col, .6)); rg.addColorStop(.5, rgba(col, .18)); rg.addColorStop(1, rgba(col, 0));
    g.fillStyle = rg; g.fillRect(0, 0, size, size);
    const d = g.getImageData(0, 0, size, size), p = d.data, rr = prng(seed * 31 + 7);
    for (let i = 3; i < p.length; i += 4) { const a = p[i] / 255; if (a <= 0) continue; const on = rr() < Math.pow(a, 1.2) ? Math.min(1, a * 2.5) : 0, kk = k * 4 * a * (1 - a); p[i] = 255 * (a * (1 - kk) + kk * on); }
    g.putImageData(d, 0, 0); return c;
  });
}
export function spr(ctx, img, x, y, r, a = 1, sy = 1, op = 'lighter') {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = Math.min(1, a); ctx.translate(x, y); ctx.scale(1, sy); ctx.drawImage(img, -r, -r, 2 * r, 2 * r); ctx.restore();
}
export { W, H, C, rgba, clamp, mix, prng, mixHex, shade };
// hand position of a fig() pose relative to the hip (screen px), i = 0 front arm
export function handAt(pose, s, i = 0, flip = false) {
  const P = Object.assign({}, PDEF, pose), a = P.sh[i], e = P.el[i], sx = i ? -3 : 3, sy = -57;
  const ex = sx + Math.sin(a) * 29, ey = sy + Math.cos(a) * 29, ang = a + e, hx = ex + Math.sin(ang) * 30, hy = ey + Math.cos(ang) * 30;
  const cs = Math.cos(P.lean), sn = Math.sin(P.lean); return [(hx * cs - hy * sn) * s * (flip ? -1 : 1), (hx * sn + hy * cs) * s];
}
// stipple() on a canvas whose context is translated: napi's putImageData honours the transform, so reset it first
import { stipple as _stipple } from './art.mjs';
export function stip(c, o) { const g = c.getContext('2d'); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); _stipple(c, o); g.restore(); return c; }
// composite a full-size layer canvas 1:1 onto another layer canvas regardless of the target's transform
export function putL(ctx, c, { op = 'source-over', a = 1 } = {}) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.drawImage(c, 0, 0); ctx.restore(); }
// a layer canvas with `pad` px margin on every side, context translated so world (0,0) = frame top-left at rest
export function mkL(pad = 200, padY = pad) { const c = createCanvas(W + 2 * pad, H + 2 * padY), g = c.getContext('2d'); g.translate(pad, padY); return [c, g]; }
// smooth vertical gradient fill of a rect
export function vgr(g, x, y, w, h, stops) { const gr = g.createLinearGradient(0, y, 0, y + h); for (const [o, c] of stops) gr.addColorStop(o, c); g.fillStyle = gr; g.fillRect(x, y, w, h); }
// radial soft light painted into a (translated) layer as a circle (no rect edges)
export function softLight(g, x, y, r, col, a, sy = 1) { g.save(); g.translate(x, y); g.scale(1, sy); const rg = g.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, rgba(col, a)); rg.addColorStop(.45, rgba(col, a * .35)); rg.addColorStop(1, rgba(col, 0)); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.restore(); }
