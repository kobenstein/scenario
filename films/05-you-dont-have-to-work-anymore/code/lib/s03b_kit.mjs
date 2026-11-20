// s03b_kit · small helpers for chapter 03 (second half): plate cache, parallax camera, cached figure sprites,
// walk/plane cycles, particles. Everything deterministic; expensive things are built once and reused.
import { W, H, C, rgba, clamp, mix, prng, layer, person, shade, mixHex } from './art.mjs';

// ---------- cache ----------
const CACHE = new Map();
export function once(key, fn) { if (!CACHE.has(key)) CACHE.set(key, fn()); return CACHE.get(key); }

// ---------- camera ----------
// Draw layered plates with parallax. cam = { x, y, z, fx, fy } (offset px at depth 1, zoom, zoom focus).
// layers: [[canvas, p, alpha?], ...]; p = depth factor (0 far … 1 reference … >1 near the lens).
export function plate(ctx, c, cam, p = 1, a = 1) {
  const z = 1 + (cam.z - 1) * p, fx = cam.fx ?? W / 2, fy = cam.fy ?? H / 2;
  ctx.save(); if (a < 1) ctx.globalAlpha = a;
  ctx.translate(fx + cam.x * p, fy + cam.y * p); ctx.scale(z, z); ctx.translate(-fx, -fy);
  ctx.drawImage(c, 0, 0); ctx.restore();
}
// same transform, but run a draw callback in plate space (for animated elements living on that layer)
export function inPlate(ctx, cam, p, fn) {
  const z = 1 + (cam.z - 1) * p, fx = cam.fx ?? W / 2, fy = cam.fy ?? H / 2;
  ctx.save(); ctx.translate(fx + cam.x * p, fy + cam.y * p); ctx.scale(z, z); ctx.translate(-fx, -fy); fn(ctx); ctx.restore();
}
// map a plate-space point to the screen (to hand a carrier position to the next shot)
export function toScreen(cam, p, x, y) {
  const z = 1 + (cam.z - 1) * p, fx = cam.fx ?? W / 2, fy = cam.fy ?? H / 2;
  return [fx + cam.x * p + (x - fx) * z, fy + cam.y * p + (y - fy) * z];
}

// ---------- figure sprites ----------
// person() allocates a canvas per call, so poses are rendered once into sprites and composited per frame.
// sprite.draw(ctx, x, y, k) puts the hip joint at x,y with extra scale k.
export function sprite(key, s, pose, o = {}) {
  return once('spr:' + key, () => {
    const pad = Math.ceil(240 * s), [c, g] = layer(pad * 2, pad * 2);
    if (o.lightRel) o = Object.assign({}, o, { light: Object.assign({ x: pad + o.lightRel[0], y: pad + o.lightRel[1] }, o.lightRel[2] || {}) });
    const f = person(g, pad, pad, s, pose, o);
    return {
      c, pad, s, hand: (i) => { const [hx, hy] = f.hand(i); return [hx - pad, hy - pad]; },
      draw(ctx, x, y, k = 1, a = 1) {
        if (a <= 0) return; if (a < 1) { ctx.save(); ctx.globalAlpha = a; }
        ctx.drawImage(c, x - pad * k, y - pad * k, pad * 2 * k, pad * 2 * k); if (a < 1) ctx.restore();
      },
    };
  });
}
// walk cycle pose at phase th (radians)
export function walkPose(th, extra = {}) {
  const ph = Math.sin(th), c = Math.cos(th);
  return Object.assign({ lean: .05, head: .04, sh: [-.32 * ph, .32 * ph], el: [.35, .4], hip: [.36 * ph, -.36 * ph], kn: [.1 + .45 * Math.max(0, c), .1 + .45 * Math.max(0, -c)] }, extra);
}
// a walk cycle of n cached frames; returns draw(ctx, x, y, phase(0..1 cycles), k)
export function walker(key, s, dress, o = {}, n = 8, extra = {}) {
  const frames = [];
  for (let i = 0; i < n; i++) frames.push(sprite(`${key}:w${i}`, s, walkPose(i / n * Math.PI * 2, extra), Object.assign({ dress }, o)));
  return {
    frames,
    draw(ctx, x, y, phase, k = 1, a = 1) {
      const f = ((Math.floor(phase * n) % n) + n) % n, bob = Math.abs(Math.sin(phase * Math.PI * 2)) * 2.2 * s * k;
      frames[f].draw(ctx, x, y - bob, k, a);
    },
  };
}

// ---------- particles ----------
// falling snow: three depths, deterministic positions as a function of t. col may change (confetti → snow).
export function snowField(seed, n) {
  const r = prng(seed), P = [];
  for (let i = 0; i < n; i++) P.push({ x: r() * W * 1.2 - W * .1, y: r() * H, d: Math.pow(r(), 1.6), ph: r() * 7, c: Math.floor(r() * 5) });
  return P;
}
export function drawSnow(ctx, P, t, { a = 1, wind = 30, speed = 60, confetti = 0, sizeK = 1, dy = 0 } = {}) {
  const CONF = ['#ffb35c', '#e8a3a0', '#f3efe2', '#8fd0c8', '#ffd59a'];
  for (const p of P) {
    const v = speed * (.35 + p.d * 1.1), y = ((p.y + t * v + dy * (.3 + p.d)) % (H + 40) + H + 40) % (H + 40) - 20;
    const x = ((p.x + t * wind * (.3 + p.d) + Math.sin(t * .8 + p.ph) * 14 * (.4 + p.d)) % (W * 1.2) + W * 1.2) % (W * 1.2) - W * .1;
    const s = (.8 + p.d * 2.6) * sizeK, al = a * (.25 + .7 * p.d);
    if (confetti > 0 && p.c < 4) {
      ctx.fillStyle = rgba(mixHex('#eef3fa', CONF[p.c], confetti), al);
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3 + p.ph); ctx.fillRect(-s * 1.6, -s * .6, s * 3.2 * mix(.5, 1, confetti), s * 1.2); ctx.restore();
    } else { ctx.fillStyle = rgba('#eef3fa', al); ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); }
  }
}
// drifting leaves (park): position as a function of t, tumble by flattening the ellipse
export function leafField(seed, n, cols) {
  const r = prng(seed), P = [];
  for (let i = 0; i < n; i++) P.push({ x: r() * W, y: r() * H, d: r(), ph: r() * 7, c: cols[Math.floor(r() * cols.length)] });
  return P;
}
export function drawLeaves(ctx, P, t, { a = 1, wind = 40, fall = 28, k = 1 } = {}) {
  for (const p of P) {
    const y = ((p.y + t * fall * (.5 + p.d)) % (H + 60) + H + 60) % (H + 60) - 30;
    const x = ((p.x + t * wind * (.4 + p.d) + Math.sin(t * 1.1 + p.ph) * 40) % (W + 80) + W + 80) % (W + 80) - 40;
    const s = (3 + p.d * 6) * k, tum = Math.sin(t * 2.3 + p.ph);
    ctx.fillStyle = rgba(p.c, a * (.5 + .5 * p.d)); ctx.beginPath(); ctx.ellipse(x, y, s, Math.max(.6, Math.abs(tum) * s * .5), t * .9 + p.ph, 0, 7); ctx.fill();
  }
}
// a small bird (two strokes), flapping
export function bird(ctx, x, y, s, t, ph = 0, col = '#2a2020') {
  const f = Math.sin(t * 9 + ph) * 5 * s;
  ctx.strokeStyle = col; ctx.lineWidth = 1.8 * s; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.moveTo(x - 12 * s, y - 2 * s - f); ctx.quadraticCurveTo(x - 5 * s, y - 7 * s - f * .5, x, y); ctx.quadraticCurveTo(x + 5 * s, y - 7 * s - f * .5, x + 12 * s, y - 2 * s - f); ctx.stroke();
}
// integral of a speed profile v(t) from a to b (simple trapezoid; cheap enough per frame)
export function integ(v, a, b, n = 40) { if (b <= a) return 0; let s = 0; const h = (b - a) / n; for (let i = 0; i < n; i++) s += (v(a + i * h) + v(a + (i + 1) * h)) * .5 * h; return s; }
export { W, H, C, rgba, clamp, mix, prng, shade, mixHex };

// light pool / bloom: art.mjs pool()/bloom() call stipple() while the layer still carries a transform, and on this
// canvas build putImageData honours that transform (shifted copy, lost quadrant). These reset it first.
import { stipple as _stip, put as _put } from './art.mjs';
export function pool2(ctx, x, y, rx, ry, { col = C.amber, a = .6, k = .7, seed = 1, rot = 0, op = 'lighter', core = null } = {}) {
  const [c, g] = layer(); g.translate(x, y); g.rotate(rot); g.scale(1, ry / rx);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, rgba(core || col, a)); rg.addColorStop(.4, rgba(col, a * .5)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.fillRect(-rx, -rx, rx * 2, rx * 2); g.setTransform(1, 0, 0, 1, 0, 0); _stip(c, { k, g: 1.2, seed }); _put(ctx, c, { op }); return c;
}
export function bloom2(ctx, x, y, r, { col = C.amber, core = '#ffd59a', a = .6, k = .5, seed = 1, sy = 1, op = 'lighter' } = {}) {
  const [c, g] = layer(); g.translate(x, y); g.scale(1, sy);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, rgba(core, a)); rg.addColorStop(.15, rgba(col, a * .6)); rg.addColorStop(.5, rgba(col, a * .18)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.fillRect(-r, -r, r * 2, r * 2); g.setTransform(1, 0, 0, 1, 0, 0); _stip(c, { k, g: 1.2, seed }); _put(ctx, c, { op }); return c;
}
