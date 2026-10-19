// s03_kit · small helpers for chapter 03 (the slump, and the turn), first half.
// Everything expensive is built once per shot into offscreen canvases (cached by key) and evicted again when the
// render has moved past the shot, so a long render keeps memory flat.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, fog, cone, pool, bloom, person, vnoise, fbm, printFinish } from './art.mjs';

export const P = {
  ink: '#070918', ind: '#0b0f2a', night: '#121a44', deep: '#0a1030', cy: '#8fe6ff', cyw: '#d8f7ff', cyd: '#0a6f8c',
  amb: '#ffb35c', hot: '#ffd59a', cream: '#fff1cf', wine: '#6a1426', wineHi: '#c2404f', sodium: '#f2a54a', grey: '#5d6478',
  rose: '#e8a3a0', violet: '#3b2f6e',
};

// ---------------------------------------------------------------- cache with per-shot eviction
const CACHE = new Map();          // key -> { v, until }
export function once(key, until, fn) {
  let e = CACHE.get(key);
  if (!e) { e = { v: fn(), until }; CACHE.set(key, e); }
  return e.v;
}
// drop everything whose shot ended more than 3 s before t (renders run forwards; snapshots simply rebuild)
let lastEvict = -1e9;
export function evict(t) {
  if (Math.abs(t - lastEvict) < 1) return; lastEvict = t;
  for (const [k, e] of CACHE) if (e.until < t - 3) CACHE.delete(k);
}
export function plate(w, h, fn) { const [c, g] = layer(w, h); fn(g, c); return c; }

// ---------------------------------------------------------------- camera / parallax
// camera C = {x, y, z, r}: a layer of depth d moves by C.x*d and scales by 1+(z-1)*d around the frame centre.
export function L(ctx, C, d, fn) {
  const z = 1 + (C.z - 1) * d; ctx.save(); ctx.translate(W / 2 + C.x * d, H / 2 + C.y * d); if (C.r) ctx.rotate(C.r * d); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); fn(ctx); ctx.restore();
}
export const Lp = (C, d, x, y) => { const z = 1 + (C.z - 1) * d, a = (C.r || 0) * d, dx = (x - W / 2) * z, dy = (y - H / 2) * z; return [W / 2 + C.x * d + dx * Math.cos(a) - dy * Math.sin(a), H / 2 + C.y * d + dx * Math.sin(a) + dy * Math.cos(a)]; };
export function img(ctx, C, d, c, x = 0, y = 0, a = 1) { L(ctx, C, d, (g) => { if (a < 1) g.globalAlpha = a; g.drawImage(c, x, y); }); }
export const drift = (t, a = 1, ph = 0) => a * (Math.sin(t * 0.37 + ph) * 0.6 + Math.sin(t * 0.91 + ph * 1.7) * 0.3 + Math.sin(t * 1.73 + ph * 2.3) * 0.1);
export const cam = (t, { x = 0, y = 0, z = 1.06, amp = 1, ph = 0, r = 0 } = {}) => ({ x: x + drift(t, 12 * amp, ph), y: y + drift(t, 7 * amp, ph + 2.1), z: z + drift(t, .004 * amp, ph + 4), r });

// ---------------------------------------------------------------- figures (cached poses)
const FIG = new Map();
const rnd = (v) => typeof v === 'number' ? Math.round(v * 40) / 40 : Array.isArray(v) ? v.map(rnd) : v;
// person() into its own canvas, cached by pose (quantised); draw at hip (x, y). o.light is given in screen coords.
export function fig(ctx, key, x, y, s, pose, o = {}) {
  const q = {}; for (const k in pose) q[k] = rnd(pose[k]);
  const lk = o.light ? [Math.round((o.light.x - x) / 40), Math.round((o.light.y - y) / 40)] : 0;
  const id = key + JSON.stringify(q) + lk;
  let e = FIG.get(id);
  if (!e) {
    const pad = Math.ceil(240 * s), [c, g] = layer(pad * 2, pad * 2), oo = { ...o };
    if (o.light) oo.light = { ...o.light, x: pad + lk[0] * 40, y: pad + lk[1] * 40 };
    const r = person(g, pad, pad, s, q, oo);
    e = { c, pad, hand: [r.hand(0), r.hand(1)].map(([hx, hy]) => [hx - pad, hy - pad]) };
    if (FIG.size > 160) FIG.delete(FIG.keys().next().value);
    FIG.set(id, e);
  }
  ctx.drawImage(e.c, x - e.pad, y - e.pad);
  return { hand: (i) => [x + e.hand[i][0], y + e.hand[i][1]] };
}

// ---------------------------------------------------------------- light helpers (cheap, per frame)
export function glowA(ctx, x, y, r, a, col = P.cy, core = P.cyw, sy = 1) {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(1, sy);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, rgba(core, a)); g.addColorStop(.2, rgba(col, a * .5)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore();
}
// a pre-stippled additive light sprite (bloom) that can be stamped per frame at any size/alpha
export function bloomSprite(key, col = P.amb, core = P.hot, k = .5) {
  return once('bloom' + key + col, 1e9, () => plate(512, 512, (g, c) => {
    const rg = g.createRadialGradient(256, 256, 0, 256, 256, 256); rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(.14, rgba(col, .6)); rg.addColorStop(.5, rgba(col, .16)); rg.addColorStop(1, rgba(col, 0));
    g.fillStyle = rg; g.fillRect(0, 0, 512, 512); stipple(c, { k, g: 1.2, seed: 7 });
  }));
}
export function stamp(ctx, spr, x, y, r, a, sy = 1) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(spr, x - r, y - r * sy, r * 2, r * 2 * sy); ctx.restore(); }

// finish: paper tooth + light vignette (the film adds grain on top)
export function finish(ctx, o = {}) { printFinish(ctx, { grain: .075, vig: .3, ...o }); }

// fill a gradient quickly
export function vg(ctx, stops, x0 = 0, y0 = 0, x1 = 0, y1 = H, rect = [0, 0, W, H]) { const g = ctx.createLinearGradient(x0, y0, x1, y1); for (const [o, c] of stops) g.addColorStop(o, c); ctx.fillStyle = g; ctx.fillRect(...rect); }
export function rg(ctx, x, y, r, stops, sy = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(1, sy); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r); for (const [o, c] of stops) g.addColorStop(o, c); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore(); }
// a stippled light wash layer (built once): a radial falloff of colour, grain only in the falloff
export function washLayer(x, y, r, col, a, { sy = 1, k = .6, seed = 3, w = W, h = H } = {}) {
  return plate(w, h, (g, c) => { g.translate(x, y); g.scale(1, sy); const q = g.createRadialGradient(0, 0, 0, 0, 0, r); q.addColorStop(0, rgba(col, a)); q.addColorStop(.35, rgba(col, a * .45)); q.addColorStop(1, rgba(col, 0)); g.fillStyle = q; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k, g: 1.2, seed }); });
}

export { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, fog, cone, pool, bloom, person, vnoise, fbm };
