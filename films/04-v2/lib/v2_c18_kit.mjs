// c18 · small helpers: cached layers as Images, easings, colour mixing, the 3D camera of the dawn take, and the IF seal.
// toImg / best / ready / once / eoX / eiX / qio are copied from lib/sc01_m1_open.mjs; sealFixed / ifSeal are copied from
// lib/sc03_world.mjs (3.03's seal, itself c02's seal of 2.05) so 18.01 shows the same seal. Minute files are never imported.
import { Image, Path2D } from '@napi-rs/canvas';
import { W, H, clamp, mix, rgba, canvas } from '../engine.mjs';
import { stipple } from './art.mjs';
import { FOIL, guilloche, microRing, foilGlint, INK, PAPER } from './certificate.mjs';

export const TAU = Math.PI * 2;
// ---------- cached canvases → Images (the @napi-rs/canvas drawImage(<Canvas>) leak) [copied from sc01_m1_open.mjs]
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };
export const memo = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };

// ---------- easings (MOTION.md: expo-out landings, expo-in exits, quart in-out moves)
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x ** 3 : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const sio = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const sm5 = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const span = (t, a, b, e = qio) => e(clamp((t - a) / (b - a)));
export const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---------- colour
const hx = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const HC = new Map(); const rgbOf = (h) => { let v = HC.get(h); if (!v) { v = hx(h); HC.set(h, v); } return v; };
export const mixRGB = (a, b, u) => { const A = rgbOf(a), B = rgbOf(b); u = clamp(u); return [mix(A[0], B[0], u), mix(A[1], B[1], u), mix(A[2], B[2], u)]; };
export const css = (c, a = 1) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
export const mixC = (a, b, u, al = 1) => css(mixRGB(a, b, u), al);
// a colour ramp: stops [[u, '#hex'], …] → rgb at u
export const ramp = (stops, u) => {
  if (u <= stops[0][0]) return rgbOf(stops[0][1]).slice();
  for (let i = 1; i < stops.length; i++) if (u <= stops[i][0]) { const [u0, c0] = stops[i - 1], [u1, c1] = stops[i]; return mixRGB(c0, c1, (u - u0) / (u1 - u0)); }
  return rgbOf(stops[stops.length - 1][1]).slice();
};
export const mix3 = (a, b, u) => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];

// ---------- the camera: world metres, Y up, the dawn (east) along −Z, +X to the right (south).
// cam = { x, y, z, az, pitch, f, oy }: az = look direction in radians from −Z toward +X (0 = straight at the sunrise side, + = turned
// right), pitch + = looking up, f = focal length in px, oy = screen row of the optical axis.
export const NEAR = .05;
// (the camera's trig is computed once per camera object: camPath hands out a fresh object per frame and nothing mutates one)
const trig = (cam) => cam._trig || (cam._trig = [Math.cos(cam.az || 0), Math.sin(cam.az || 0), Math.cos(cam.pitch || 0), Math.sin(cam.pitch || 0)]);
export function cs(cam, X, Y, Z) {
  const T = trig(cam), dx = X - cam.x, dy = Y - cam.y, dz = Z - cam.z;
  const xr = dx * T[0] + dz * T[1], zf = dx * T[1] - dz * T[0];
  return [xr, dy * T[2] - zf * T[3], dy * T[3] + zf * T[2]];
}
export const toScr = (cam, c) => { const q = cam.f / Math.max(NEAR, c[2]); return [W / 2 + c[0] * q, (cam.oy ?? H / 2) - c[1] * q]; };
export const P3 = (cam, X, Y, Z) => toScr(cam, cs(cam, X, Y, Z));
export const depth = (cam, X, Y, Z) => cs(cam, X, Y, Z)[2];
export const scaleAt = (cam, X, Y, Z) => cam.f / Math.max(NEAR, cs(cam, X, Y, Z)[2]);
// a direction (sky object): azimuth (from −Z toward +X) and elevation → screen point (null when behind the camera)
export function dirScr(cam, az, el) {
  const ce = Math.cos(el), D = [ce * Math.sin(az), Math.sin(el), -ce * Math.cos(az)];
  const ca = Math.cos(cam.az || 0), sa = Math.sin(cam.az || 0), xr = D[0] * ca + D[2] * sa, zf = D[0] * sa - D[2] * ca, p = cam.pitch || 0;
  const yc = D[1] * Math.cos(p) - zf * Math.sin(p), zc = D[1] * Math.sin(p) + zf * Math.cos(p);
  if (zc <= .01) return null;
  return [W / 2 + xr * cam.f / zc, (cam.oy ?? H / 2) - yc * cam.f / zc];
}
// the screen row of the true horizon (eye level) and the elevation seen at a screen row (centre column)
export const horizonY = (cam) => (cam.oy ?? H / 2) + cam.f * Math.tan(cam.pitch || 0);
export const elevAt = (cam, y) => (cam.pitch || 0) + Math.atan(((cam.oy ?? H / 2) - y) / cam.f);
// a closed 3D polygon → screen path (clipped against the near plane); add = append to the current path
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
  if (C.length < 3) return false;
  C.forEach((c, i) => { const s = toScr(cam, c); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); });
  ctx.closePath(); return true;
}
// a 3D polyline (open) → screen path, near-clipped per segment
export function line3(ctx, cam, pts, add = false) {
  if (!add) ctx.beginPath();
  let pen = false;
  const C = pts.map((p) => cs(cam, p[0], p[1], p[2]));
  for (let i = 0; i < pts.length - 1; i++) {
    let a = C[i], b = C[i + 1];
    if (a[2] < NEAR && b[2] < NEAR) { pen = false; continue; }
    if (a[2] < NEAR) { const u = (NEAR - a[2]) / (b[2] - a[2]); a = [mix(a[0], b[0], u), mix(a[1], b[1], u), NEAR]; pen = false; }
    if (b[2] < NEAR) { const u = (NEAR - a[2]) / (b[2] - a[2]); b = [mix(a[0], b[0], u), mix(a[1], b[1], u), NEAR]; }
    const sa = toScr(cam, a), sb = toScr(cam, b);
    if (!pen) ctx.moveTo(sa[0], sa[1]);
    ctx.lineTo(sb[0], sb[1]); pen = true;
  }
}
// a 3D polyline → screen polyline (points in front of the camera only; for ghost lines and lengths)
export function proj(cam, pts) { const out = []; for (const p of pts) { const c = cs(cam, p[0], p[1], p[2]); if (c[2] > NEAR) out.push(toScr(cam, c)); } return out; }
export const lerpCam = (a, b, u) => ({ x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), z: mix(a.z, b.z, u), az: mix(a.az || 0, b.az || 0, u), pitch: mix(a.pitch || 0, b.pitch || 0, u), f: mix(a.f, b.f, u), oy: mix(a.oy ?? H / 2, b.oy ?? H / 2, u) });
// a smooth camera path through keys [{ t, cam }] (Catmull-Rom on every channel, log-space for f), clamped at the ends
const CH = ['x', 'y', 'z', 'az', 'pitch', 'lf', 'oy'];
export function camPath(keys) {
  const K = keys.map((k) => ({ t: k.t, v: { ...k.cam, lf: Math.log(k.cam.f), oy: k.cam.oy ?? H / 2 } }));
  return (t) => {
    if (t <= K[0].t) return out(K[0].v);
    if (t >= K[K.length - 1].t) return out(K[K.length - 1].v);
    let i = 0; while (i < K.length - 2 && t > K[i + 1].t) i++;
    const k1 = K[i], k2 = K[i + 1], k0 = K[Math.max(0, i - 1)], k3 = K[Math.min(K.length - 1, i + 2)], u = (t - k1.t) / (k2.t - k1.t);
    const o = {};
    for (const c of CH) {   // non-uniform Catmull-Rom (tangents scaled by the key spacing) → C1 through the keys
      const p0 = k0.v[c], p1 = k1.v[c], p2 = k2.v[c], p3 = k3.v[c], d1 = k2.t - k1.t;
      const m1 = i === 0 ? 0 : (p2 - p0) / (k2.t - k0.t) * d1, m2 = i + 2 >= K.length ? 0 : (p3 - p1) / (k3.t - k1.t) * d1;
      const u2 = u * u, u3 = u2 * u;
      o[c] = (2 * u3 - 3 * u2 + 1) * p1 + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2 + (u3 - u2) * m2;
    }
    return out(o);
  };
  function out(v) { return { x: v.x, y: v.y, z: v.z, az: v.az, pitch: v.pitch, f: Math.exp(v.lf), oy: v.oy }; }
}

// a smooth path through control points (Catmull-Rom, sampled every ~step m)
export function smoothPath(P, step = 20) {
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)], n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let k = 0; k < n; k++) { const u = k / n, u2 = u * u, u3 = u2 * u; out.push([0, 1].map((j) => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3))); }
  }
  out.push(P[P.length - 1].slice()); return out;
}

// ---------- the IF seal (copied from lib/sc03_world.mjs: sealFixed + ifSeal, 3.03 = 2.05's seal)
const strokePts = (ctx, pts) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); };
function foilFill(g, x, y, w, h, ang = .6) { const gr = g.createLinearGradient(x, y, x + Math.cos(ang) * w, y + Math.sin(ang) * h); FOIL.forEach((c, i) => gr.addColorStop(i / (FOIL.length - 1), c)); return gr; }
function sealBody(g, r, o = {}) {
  const foil = !!o.foil, scal = o.scallops ?? 36;
  const edge = (gg, rr) => { gg.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * TAU, q = rr * (1 + .035 * Math.cos(scal * a)); i ? gg.lineTo(Math.cos(a) * q, Math.sin(a) * q) : gg.moveTo(Math.cos(a) * q, Math.sin(a) * q); } gg.closePath(); };
  const pad = r * .3, S = (r + pad) * 2;
  const [cc, h] = canvas(Math.ceil(S), Math.ceil(S));
  h.translate(S / 2, S / 2);
  h.save(); h.translate(-r * .025, -r * .025); edge(h, r); h.fillStyle = foil ? '#ffe9c0' : 'rgba(255,252,240,.9)'; h.fill(); h.restore();
  h.save(); h.translate(r * .035, r * .04); edge(h, r); h.fillStyle = foil ? 'rgba(70,30,8,.85)' : 'rgba(60,45,30,.35)'; h.fill(); h.restore();
  edge(h, r); h.fillStyle = foil ? foilFill(h, -r, -r, 2 * r, 2 * r) : PAPER; h.fill();
  const ink = foil ? 'rgba(90,40,10,.75)' : rgba(INK, .55);
  h.strokeStyle = ink; h.lineWidth = Math.max(.8, r * .012);
  for (const q of [.9, .72, .7]) { h.beginPath(); h.arc(0, 0, r * q, 0, TAU); h.stroke(); }
  microRing(h, 0, 0, r * .81, o.label || 'ONE EQUAL SHARE FOR EVERY PERSON', { size: Math.max(5, r * .085), col: foil ? '#5a2a08' : INK, a: .8 });
  const G = guilloche({ R: r * .42, A: r * .12, B: r * .05, n: 12, m: 5, lines: 18 }); h.lineWidth = Math.max(.6, r * .008);
  for (let k = 0; k < G.lines; k++) strokePts(h, G.line(k));
  if (foil) { const [nc, nx] = canvas(Math.ceil(S), Math.ceil(S)); nx.translate(S / 2, S / 2); edge(nx, r); nx.fillStyle = 'rgba(255,240,200,.35)'; nx.fill(); nx.setTransform(1, 0, 0, 1, 0, 0); stipple(nc, { k: 1, g: 1.4, seed: 5, mid: false, boost: 1.4 }); h.save(); h.setTransform(1, 0, 0, 1, 0, 0); h.globalCompositeOperation = 'overlay'; h.drawImage(nc, 0, 0); h.restore(); }
  g.drawImage(cc, -S / 2, -S / 2);
}
// the seal as one cached Image at radius r (px): body + centre disc + engraved IF
export function sealImage(r) {
  return once('c18seal' + r, () => {
    const S = Math.ceil(r * 2.8), [c, g] = canvas(S, S); g.translate(S / 2, S / 2);
    sealBody(g, r, { foil: true, label: 'IF AI AND ROBOTS KEEP GETTING BETTER', emblem: 'none' });
    const cg = g.createRadialGradient(-r * .2, -r * .25, 0, 0, 0, r * .66); cg.addColorStop(0, '#ffe7b8'); cg.addColorStop(.6, '#d98d3c'); cg.addColorStop(1, '#8a4416'); g.fillStyle = cg; g.beginPath(); g.arc(0, 0, r * .64, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(90,40,10,.6)'; g.lineWidth = Math.max(.8, r * .01); for (let k = 0; k < 26; k++) { g.beginPath(); g.arc(0, 0, r * (.2 + k * .017), 0, TAU); g.stroke(); }
    g.font = `400 ${Math.round(r * .82)}px "Instrument Serif"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(70,28,6,.85)'; g.fillText('IF', r * .025, r * .1); g.fillStyle = 'rgba(255,246,222,.95)'; g.fillText('IF', -r * .015, r * .055);
    g.fillStyle = '#b5621f'; g.fillText('IF', 0, r * .075);
    return c;
  });
}
// the seal at (x, y) with radius r: o.rot, o.glint 0..1 (a foil sweep), o.pale 0..1 (a daytime moon: the sky's colour laid over the
// foil, never transparent), o.paleCol, o.clip(ctx) (a path the seal is clipped to: the horizon hides its lower part)
export function ifSeal(ctx, x, y, r, t, o = {}) {
  const R0 = 150, img = sealImage(R0), S = img.width * r / R0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.drawImage(img, -S / 2, -S / 2, S, S);
  if (o.pale > 0) {   // atmospheric paling: the sky colour laid over the body only (clipped to the scalloped rim: still a solid picture)
    ctx.save(); ctx.beginPath();
    for (let i = 0; i <= 144; i++) { const a = i / 144 * TAU, q = r * 1.03 * (1 + .035 * Math.cos(36 * a)); i ? ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q) : ctx.moveTo(Math.cos(a) * q, Math.sin(a) * q); }
    ctx.closePath(); ctx.clip(); ctx.fillStyle = rgba(o.paleCol || '#f3dccf', clamp(o.pale) * .62); ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4); ctx.restore();
  }
  if (o.glint != null) { const p = o.glint, gx = mix(-r * 1.4, r * 1.4, p), gg = ctx.createLinearGradient(gx - r * .4, -r, gx + r * .4, r); gg.addColorStop(0, 'rgba(255,240,210,0)'); gg.addColorStop(.5, `rgba(255,248,232,${.55 * Math.sin(Math.PI * clamp(p))})`); gg.addColorStop(1, 'rgba(255,240,210,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); ctx.arc(0, 0, r * 1.02, 0, TAU); ctx.fillStyle = gg; ctx.fill(); }
  ctx.restore();
}
export { foilGlint, Path2D };
