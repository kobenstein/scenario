// c09 · small helpers: cached layers as Images, easings, the 3D camera of the courtyard take.
// toImg / best / ready / once / eoX / eiX / qio are copied from lib/sc01_m1_open.mjs (minute file: never imported, only copied).
import { Image } from '@napi-rs/canvas';
import { W, H, clamp, mix, rgba, prng } from '../engine.mjs';

// ---------- cached canvases → Images (the @napi-rs/canvas drawImage(<Canvas>) leak) [copied from sc01_m1_open.mjs]
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map(); export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));            // expo-out (landings)
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));            // expo-in (exits)
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out (moves)
// expo in-out, normalised so that it starts and ends exactly at 0 / 1
export const eioX = (x) => { x = clamp(x); if (x === 0 || x === 1) return x; return x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2; };
// a smooth step from a to b (0 before a, 1 after b) with a chosen ease
export const span = (t, a, b, e = qio) => e(clamp((t - a) / (b - a)));
export const TAU = Math.PI * 2;

// ---------- the camera: world metres, Y up, looking along −Z; pitch (+ = looking up) around the camera's own X axis.
// cam = { x, y, z, f, pitch, oy }: f = focal length in px, oy = the screen row of the optical axis (lens shift).
// cs(cam, X, Y, Z) → camera space [xc, yc, zc] (zc = depth in front of the camera)
export function cs(cam, X, Y, Z) {
  const p = cam.pitch || 0, cp = Math.cos(p), sp = Math.sin(p), dy = Y - cam.y, d0 = cam.z - Z;
  return [X - cam.x, dy * cp - d0 * sp, dy * sp + d0 * cp];
}
export const NEAR = .02;
export function toScr(cam, c) { const q = cam.f / Math.max(NEAR, c[2]); return [W / 2 + c[0] * q, (cam.oy ?? H / 2) - c[1] * q]; }
export function P3(cam, X, Y, Z) { return toScr(cam, cs(cam, X, Y, Z)); }
// a 3D polygon → screen path (clipped against the near plane). add = true appends to the current path.
export function path3(ctx, cam, pts, add = false) {
  let C = pts.map((p) => cs(cam, p[0], p[1], p[2]));
  if (C.some((c) => c[2] < NEAR)) {
    const out = [];
    for (let i = 0; i < C.length; i++) {
      const a = C[i], b = C[(i + 1) % C.length], ia = a[2] >= NEAR, ib = b[2] >= NEAR;
      if (ia) out.push(a);
      if (ia !== ib) { const u = (NEAR - a[2]) / (b[2] - a[2]); out.push([mix(a[0], b[0], u), mix(a[1], b[1], u), NEAR]); }
    }
    C = out;
  }
  if (!add) ctx.beginPath();
  if (C.length < 2) return false;
  C.forEach((c, i) => { const s = toScr(cam, c); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); });
  ctx.closePath(); return true;
}
// a 3D polyline (open) → screen path, near-clipped per segment
export function line3(ctx, cam, pts, add = false) {
  if (!add) ctx.beginPath();
  let pen = false;
  for (let i = 0; i < pts.length - 1; i++) {
    let a = cs(cam, ...pts[i]), b = cs(cam, ...pts[i + 1]);
    if (a[2] < NEAR && b[2] < NEAR) { pen = false; continue; }
    if (a[2] < NEAR) { const u = (NEAR - a[2]) / (b[2] - a[2]); a = [mix(a[0], b[0], u), mix(a[1], b[1], u), NEAR]; pen = false; }
    if (b[2] < NEAR) { const u = (NEAR - a[2]) / (b[2] - a[2]); b = [mix(a[0], b[0], u), mix(a[1], b[1], u), NEAR]; }
    const sa = toScr(cam, a), sb = toScr(cam, b);
    if (!pen) ctx.moveTo(sa[0], sa[1]);
    ctx.lineTo(sb[0], sb[1]); pen = true;
  }
}
// local affine map of the plane Z = z0 around (X0, Y0): screen = [a*X + c, b*Y + d] (exact at pitch 0; a good local fit otherwise)
// → { s (px per metre at that point), set(ctx) (a transform with Y up: draw in metres), toS(X, Y) }
export function plane(cam, X0, Y0, z0) {
  const p0 = P3(cam, X0, Y0, z0), px = P3(cam, X0 + .01, Y0, z0), py = P3(cam, X0, Y0 + .01, z0);
  const ax = (px[0] - p0[0]) / .01, ay = (py[0] - p0[0]) / .01, bx = (px[1] - p0[1]) / .01, by = (py[1] - p0[1]) / .01;
  const e = p0[0] - ax * X0 - ay * Y0, f = p0[1] - bx * X0 - by * Y0;
  return { s: Math.hypot(ax, bx), set: (ctx) => ctx.setTransform(ax, bx, ay, by, e, f), toS: (X, Y) => [ax * X + ay * Y + e, bx * X + by * Y + f], m: [ax, bx, ay, by, e, f] };
}
// screen-space px per metre at a point (for line widths and level of detail)
export function scaleAt(cam, X, Y, Z) { const c = cs(cam, X, Y, Z); return cam.f / Math.max(NEAR, c[2]); }
// the pitch that puts a world point at screen row sy (camera at its position, yaw 0)
export function pitchFor(cam, X, Y, Z, sy) {
  const phi = Math.atan2(Y - cam.y, cam.z - Z), oy = cam.oy ?? H / 2;
  return phi - Math.atan((oy - sy) / cam.f);
}
export const lerpCam = (a, b, u) => ({ x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), z: mix(a.z, b.z, u), f: mix(a.f, b.f, u), pitch: mix(a.pitch || 0, b.pitch || 0, u), oy: mix(a.oy ?? H / 2, b.oy ?? H / 2, u) });
const mixC = (a, b, u) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(mix(v, B[i], clamp(u))).toString(16).padStart(2, '0')).join(''); };
// a 3D polyline → screen polylines, clipped against a near plane (split where it passes behind the camera)
export function proj3(cam, pts, near = NEAR * 4) {
  const out = []; let cur = null;
  for (let i = 0; i < pts.length; i++) {
    const c = cs(cam, ...pts[i]), inF = c[2] >= near;
    if (i > 0) {
      const p = cs(cam, ...pts[i - 1]), pin = p[2] >= near;
      if (pin !== inF) { const u = (near - p[2]) / (c[2] - p[2]), q = [mix(p[0], c[0], u), mix(p[1], c[1], u), near]; if (pin) { cur.push(toScr(cam, q)); out.push(cur); cur = null; } else cur = [toScr(cam, q)]; }
    }
    if (inF) { if (!cur) cur = []; cur.push(toScr(cam, c)); }
  }
  if (cur && cur.length) out.push(cur);
  return out.filter((p) => p.length > 1);
}
// the burin point: copied from lib/ghost.mjs burinTip (read-only there) with two options added so it can sit on lit paper
// without blooming into a white blob: o.glow (0..1 strength of the glint) and o.glowR (its radius in S); o.dust (0..1).
// It never fades: it is carried in and out (o.a is not supported on purpose).
export function burin(ctx, x, y, ang, t = 0, o = {}) {
  const S = o.size ?? 14, foil = o.foil || '#ffb35c', r = prng((o.seed ?? 3) * 17 + 5), G = o.glow ?? 1, GR = o.glowR ?? 2.6, D = o.dust ?? 1, PA = o.paper === true ? 1 : clamp(o.paper || 0);
  ctx.save();
  if (G > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = S * GR, gl = ctx.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba('#fff1d6', .9 * G)); gl.addColorStop(.25, rgba(foil, .45 * G)); gl.addColorStop(1, rgba(foil, 0)); ctx.fillStyle = gl; ctx.fillRect(x - R, y - R, 2 * R, 2 * R); ctx.restore(); }
  if (D > 0) {
    ctx.save(); ctx.globalCompositeOperation = PA > .5 ? 'source-over' : 'lighter';
    for (let i = 0; i < 26; i++) { const life = (t * (.8 + r() * .9) + r()) % 1, sp = (r() - .5) * 1.6, dist = S * (.4 + life * (1.5 + r() * 2.5));
      const px = x - Math.cos(ang + sp) * dist, py = y - Math.sin(ang + sp) * dist - life * S * .8; ctx.fillStyle = rgba(PA > .5 ? (r() < .6 ? '#8a6a3a' : foil) : (r() < .6 ? foil : '#fff1d6'), (1 - life) * (.35 + .5 * r()) * D); const z = .8 + r() * 1.2; ctx.fillRect(px, py, z, z); }
    ctx.restore();
  }
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.strokeStyle = rgba(mixC('#ffe2a8', '#c08a40', PA), .85); ctx.lineWidth = Math.max(.7, S * .07); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-S * .2, 0); ctx.bezierCurveTo(-S * .9, -S * .1, -S * 1.2, -S * .8, -S * .75, -S * 1.05); ctx.bezierCurveTo(-S * .35, -S * 1.25, -S * .2, -S * .75, -S * .55, -S * .62); ctx.stroke();
  // the steel point (lozenge) leaning back over the line, with a soft cast shadow when it lies on paper
  ctx.rotate(-.55);
  if (PA > 0) { ctx.fillStyle = `rgba(60,40,20,${.22 * PA})`; ctx.beginPath(); ctx.moveTo(S * .1, S * .25); ctx.lineTo(-S * 1.1, S * .05); ctx.lineTo(-S * 3.3, S * .1); ctx.lineTo(-S * 3.3, S * .7); ctx.lineTo(-S * 1.1, S * .55); ctx.closePath(); ctx.fill(); }
  const st = ctx.createLinearGradient(0, -S * .3, 0, S * .3); st.addColorStop(0, '#dfe6f2'); st.addColorStop(.45, '#7d8798'); st.addColorStop(1, '#2a2f3a');
  ctx.fillStyle = st; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-S * 1.1, -S * .26); ctx.lineTo(-S * 3.2, -S * .3); ctx.lineTo(-S * 3.2, S * .3); ctx.lineTo(-S * 1.1, S * .26); ctx.closePath(); ctx.fill();
  if (PA > 0) { ctx.strokeStyle = `rgba(30,26,36,${.6 * PA})`; ctx.lineWidth = .9; ctx.stroke(); }
  ctx.strokeStyle = rgba('#ffffff', .7); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-S * .2, -S * .03); ctx.lineTo(-S * 3.1, -S * .2); ctx.stroke();
  ctx.restore();
  ctx.restore();
}
