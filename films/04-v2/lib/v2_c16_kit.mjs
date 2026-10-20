// c16 · kit: cached images, easing, the 3D camera, and an exact replica of the deep sky plate (lib/handoff4.mjs skyPlate) whose
// stars become objects of the c16 world (sky stars at infinity, plane stars that fly into the grid of weeks).
//   toImg / best / ready / once      cached canvases handed to the renderer as Images (the @napi-rs/canvas leak, see sc01_m1_open)
//   eoX eiX qio sstep smooth1        easing
//   cam3(o) → { P(X,Y,Z) → [sx, sy, zc], D(dx,dy,dz) → [sx, sy, zc] (a direction at infinity), R, U, F, f, pos }
//            o: { x, y, z (position, world y up), yaw (0 = looking along -Z, + = to the right), pitch (- = down), f }
//   SKYP                            the plate's own arrays (stars, band) rebuilt with the same generators
//   skyGround(ctx)                  the plate's gradient
import { Image } from '@napi-rs/canvas';
import { W, H, clamp, mix, prng, canvas } from '../engine.mjs';

const TAU = Math.PI * 2;
// ---------------------------------------------------------------- cached images
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
export const onceRaw = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };   // data, not images

// ---------------------------------------------------------------- easing
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x ** 3 : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const smoother = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---------------------------------------------------------------- 3D camera (world y up; floor = the plane y = 0)
// yaw 0 looks along -Z, + turns right (toward +X); pitch 0 is level, -π/2 looks straight down (then screen-up = -Z)
export function cam3(o) {
  const cy = Math.cos(o.yaw || 0), sy = Math.sin(o.yaw || 0), cp = Math.cos(o.pitch || 0), sp = Math.sin(o.pitch || 0), f = o.f || 1400;
  const F = [sy * cp, sp, -cy * cp], R = [cy, 0, sy], U = [-sy * sp, cp, cy * sp];
  const ox = o.ox ?? W / 2, oy = o.oy ?? H / 2, px = o.x, py = o.y, pz = o.z;
  const P = (X, Y, Z) => {
    const dx = X - px, dy = Y - py, dz = Z - pz, zc = dx * F[0] + dy * F[1] + dz * F[2];
    const xc = dx * R[0] + dz * R[2], yc = dx * U[0] + dy * U[1] + dz * U[2], q = f / Math.max(1e-4, zc);
    return [ox + xc * q, oy - yc * q, zc];
  };
  const D = (dx, dy, dz) => { const zc = dx * F[0] + dy * F[1] + dz * F[2], xc = dx * R[0] + dz * R[2], yc = dx * U[0] + dy * U[1] + dz * U[2], q = f / Math.max(1e-6, zc); return [ox + xc * q, oy - yc * q, zc]; };
  return { P, D, F, R, U, f, pos: [px, py, pz], o };
}
// blend two camera states (angles blended along the shortest way)
export function camMix(a, b, u) {
  const ang = (p, q) => { let d = q - p; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return p + d * u; };
  return { x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), z: mix(a.z, b.z, u), yaw: ang(a.yaw || 0, b.yaw || 0), pitch: mix(a.pitch || 0, b.pitch || 0, u), f: mix(a.f || 1400, b.f || 1400, u) };
}
// Catmull-Rom through camera keys [{ t, x, y, z, yaw, pitch, f }] with per-segment easing e (u) on the key times
export function camPath(keys, t) {
  if (t <= keys[0].t) return { ...keys[0] };
  if (t >= keys[keys.length - 1].t) return { ...keys[keys.length - 1] };
  let i = 0; while (i < keys.length - 2 && keys[i + 1].t <= t) i++;
  const k0 = keys[Math.max(0, i - 1)], k1 = keys[i], k2 = keys[i + 1], k3 = keys[Math.min(keys.length - 1, i + 2)];
  const u = (k2.ease || ((x) => x))(clamp((t - k1.t) / (k2.t - k1.t)));
  const cr = (p0, p1, p2, p3) => .5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (3 * p1 - p0 - 3 * p2 + p3) * u * u * u);
  const out = {};
  for (const k of ['x', 'y', 'z', 'yaw', 'pitch', 'f']) {
    const a = k1[k] ?? 0, b = k2[k] ?? 0;
    if (k2.linear || k1.hold) out[k] = mix(a, b, u);
    else out[k] = cr(k0[k] ?? a, a, b, k3[k] ?? b);
  }
  return out;
}

// ---------------------------------------------------------------- the deep sky plate, rebuilt (lib/handoff4.mjs skyPlate, tone 'deep')
export const SKY_DEEP = ['#04050f', '#0a0d26', '#141436'];
export const SKYP = (() => {
  const r = prng(4242), stars = [];
  for (let i = 0; i < 520; i++) { const m = r(); stars.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); }
  const rb = prng(55), band = [];
  for (let i = 0; i < 900; i++) { const x = (rb() - .5) * W * 1.5, y = (rb() + rb() + rb() - 1.5) * 150, a = .05 + .1 * rb(); band.push([x, y, a]); }
  return { stars, band };
})();
let GRAD = null;
export function skyGround(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, SKY_DEEP[0]); g.addColorStop(.62, SKY_DEEP[1]); g.addColorStop(1, SKY_DEEP[2]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// the plate exactly as handoff4 draws it, at plate time tp (used for the first frames; the c16 objects take over from it)
export function plateReplica(ctx, tp) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  skyGround(ctx);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.42);
  for (const [x, y, a] of SKYP.band) { ctx.fillStyle = `rgba(216,230,255,${a})`; ctx.fillRect(x + tp * 1.5, y, 1.3, 1.3); }
  ctx.restore();
  const dx = tp * 2.2, dy = tp * .6;
  for (const [x, y, s, ph, f] of SKYP.stars) {
    const tw = .55 + .45 * Math.sin(tp * f + ph), X = ((x + dx) % W + W) % W, Y = ((y + dy) % H + H) % H;
    ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
    if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}
export { TAU };
