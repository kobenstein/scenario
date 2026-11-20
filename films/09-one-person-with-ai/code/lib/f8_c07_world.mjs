// Film 8 · B2 world for c07 (06a the fork, 07a learning to conduct). Owner: B2. Other builders may import, never edit.
//
// One perspective camera over one ground plane (Y up, ground Y = 0, the trunk road runs along +Z to the fork at the origin).
//   pcamKeys(keys) → (t) → cam    keys [{ t, x, z, h, yaw, pitch, roll, F, e }]  (pitch + = looking down; h and F log-interpolated)
//   mkCam(cam) → { …cam, toC(X,Y,Z) → [a, yc, zc], P(X,Y,Z) → [sx, sy, zc] | null, horizon }   (screen before roll)
//   withRoll(ctx, cam, fn)                 draw fn in the rolled frame
//   groundPath(ctx, cam, pts, Y)           polyline [[X,Z]…] on the ground (near-plane clipped) into the current path
//   facade(ctx, cam, X, Z, u, fn, o)       a vertical plane (facing −Z unless o.yaw) at ground point (X,Z): fn(ctx) draws in local units
//                                          (x right, y down, ground y = 0), u world units per local unit → depth or null
//   skyCopy(ctx, t, tone, ox, oy)          handoff4 sky plate (night / dusk) moved by (ox, oy) px: identical pixels at (0, 0)
//   ROAD { trunk, left, right, T (tower base) }, HOUSES (the warm left world), FOG
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, sm, prng } from '../engine.mjs';
import { TSHIFT } from './handoff4.mjs';
import { vnoise } from './art.mjs';

const TAU = Math.PI * 2;
const EASE = { sine: (x) => .5 - .5 * Math.cos(Math.PI * clamp(x)), lin: (x) => clamp(x), out: (x) => Math.sin(Math.PI / 2 * clamp(x)), in: (x) => 1 - Math.cos(Math.PI / 2 * clamp(x)) };
export const ease = EASE;

// ---------------------------------------------------------------- camera
const LOGK = new Set(['h', 'F']);
export function pcamKeys(keys) {
  const fields = ['x', 'z', 'h', 'yaw', 'pitch', 'roll', 'F', 'oy'];
  for (const f of fields) if (keys[0][f] == null) keys[0][f] = f === 'F' ? 1500 : 0;
  for (let i = 1; i < keys.length; i++) for (const f of fields) if (keys[i][f] == null) keys[i][f] = keys[i - 1][f];
  return (t) => {
    if (t <= keys[0].t) return { ...keys[0] };
    for (let i = 1; i < keys.length; i++) {
      const a = keys[i - 1], b = keys[i]; if (t > b.t) continue;
      const e = (typeof b.e === 'function' ? b.e : EASE[b.e || 'sine'])((t - a.t) / (b.t - a.t)), c = {};
      for (const f of fields) c[f] = LOGK.has(f) ? Math.exp(mix(Math.log(a[f]), Math.log(b[f]), e)) : mix(a[f], b[f], e);
      return c;
    }
    return { ...keys[keys.length - 1] };
  };
}
export function mkCam(c) {
  const cy = Math.cos(c.yaw || 0), sy = Math.sin(c.yaw || 0), cp = Math.cos(c.pitch || 0), sp = Math.sin(c.pitch || 0), F = c.F;
  const toC = (X, Y, Z) => { const dx = X - c.x, dy = Y - c.h, dz = Z - c.z, a = dx * cy - dz * sy, b = dx * sy + dz * cy; return [a, dy * cp + b * sp, b * cp - dy * sp]; };
  const CY = H / 2 + (c.oy || 0);
  const P = (X, Y, Z) => { const q = toC(X, Y, Z); if (q[2] < 1) return null; return [W / 2 + F * q[0] / q[2], CY - F * q[1] / q[2], q[2]]; };
  const pr = (q) => [W / 2 + F * q[0] / q[2], CY - F * q[1] / q[2]];
  // screen y of a direction at elevation e (radians) straight ahead
  const elevY = (e) => CY - F * Math.tan(e + (c.pitch || 0));
  return { ...c, CY, toC, P, pr, elevY, horizon: (c.pitch || 0) > -Math.PI / 2 + .01 && (c.pitch || 0) < Math.PI / 2 - .01 ? CY - F * Math.tan(c.pitch || 0) : -1e9 };
}
export function withRoll(ctx, cam, fn) {
  ctx.save(); if (cam.roll) { ctx.translate(W / 2, H / 2); ctx.rotate(cam.roll); ctx.translate(-W / 2, -H / 2); } fn(ctx); ctx.restore();
}
// screen (after roll) of an unrolled point
export function rolled(cam, p) { if (!p || !cam.roll) return p; const c = Math.cos(cam.roll), s = Math.sin(cam.roll), dx = p[0] - W / 2, dy = p[1] - H / 2; return [W / 2 + dx * c - dy * s, H / 2 + dx * s + dy * c, p[2]]; }

// polyline on the ground plane (Y), clipped at the near plane; adds to the current path. Returns the projected points (for ticks).
export function groundPath(ctx, cam, pts, Y = 0, near = 4) {
  let prev = null, pen = false; const out = [];
  for (const p of pts) {
    const c = cam.toC(p[0], Y, p[1]);
    if (prev) {
      let a = prev, b = c;
      if (a[2] < near && b[2] < near) { prev = c; pen = false; continue; }
      if (a[2] < near) { const k = (near - a[2]) / (b[2] - a[2]); a = [mix(a[0], b[0], k), mix(a[1], b[1], k), near]; pen = false; }
      if (b[2] < near) { const k = (near - a[2]) / (b[2] - a[2]); b = [mix(a[0], b[0], k), mix(a[1], b[1], k), near]; }
      const A = cam.pr(a), B = cam.pr(b);
      if (!pen) { ctx.moveTo(A[0], A[1]); out.push(null, A); pen = true; }
      ctx.lineTo(B[0], B[1]); out.push(B);
      if (c[2] < near) pen = false;
    }
    prev = c;
  }
  return out;
}

// a vertical plane at ground point (X, Z); local units: x right, y down (ground y 0); u world units per local unit; o.yaw turns the plane
// (0 = facing −Z, toward the trunk). Affine approximation from the projected origin and two axis points (fine for objects ≤ ~1/4 frame).
export function facade(ctx, cam, X, Z, u, fn, o = {}) {
  const ya = o.yaw || 0, ex = [Math.cos(ya), Math.sin(ya)], L = o.L ?? 100;
  const b = cam.toC(X, 0, Z); if (b[2] < (o.near ?? 6)) return null;
  { // true corners of the plane's extent: skip it when they all project off one side of the frame (steep views make the affine lie)
    const R0 = o.r ?? 160, q = [[-1, 0], [1, 0], [-1, 1], [1, 1]].map(([a, k]) => cam.toC(X + ex[0] * u * R0 * a, u * R0 * k, Z + ex[1] * u * R0 * a));
    if (q.every((p) => p[2] > 1)) { const sp = q.map((p) => cam.pr(p)); if (sp.every((p) => p[1] > H + 300) || sp.every((p) => p[1] < -300) || sp.every((p) => p[0] < -200) || sp.every((p) => p[0] > W + 200)) return null; } }
  const xp = cam.toC(X + ex[0] * u * L, 0, Z + ex[1] * u * L), yp = cam.toC(X, u * L, Z); if (xp[2] < 1 || yp[2] < 1) return null;
  const B = cam.pr(b), XA = cam.pr(xp), YA = cam.pr(yp);
  const ax = (XA[0] - B[0]) / L, ay = (XA[1] - B[1]) / L, cx = -(YA[0] - B[0]) / L, cyy = -(YA[1] - B[1]) / L;
  if (o.cull !== false) { const R = Math.hypot(ax, ay) * (o.r ?? 160) + Math.hypot(cx, cyy) * (o.r ?? 160); if (B[0] + R < -200 || B[0] - R > W + 200 || B[1] + R < -300 || B[1] - R > H + 300) return null; }
  ctx.save(); ctx.transform(ax, ay, cx, cyy, B[0], B[1]); fn(ctx, Math.hypot(ax, ay), b[2]); ctx.restore();
  return { x: B[0], y: B[1], s: Math.hypot(ax, ay), d: b[2] };
}

// ---------------------------------------------------------------- the sky plate, moved (copy of handoff4 skyPlate; identical at ox = oy = 0)
const SKY = { night: ['#060818', '#0d1236', '#1d1a4a'], deep: ['#04050f', '#0a0d26', '#141436'], dusk: ['#0b0f2a', '#3b2f6e', '#c77a8a'] };
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
export function skyCopy(ctx, t, tone = 'dusk', ox = 0, oy = 0, o = {}) {
  t += TSHIFT;
  const [s0, s1, s2] = SKY[tone] || SKY.night;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (o.clipY != null) { ctx.beginPath(); ctx.rect(0, 0, W, Math.max(0, o.clipY)); ctx.clip(); }
  const g = ctx.createLinearGradient(0, oy, 0, oy + H); g.addColorStop(0, s0); g.addColorStop(.62, s1); g.addColorStop(1, s2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2 + ox, H / 2 + oy); ctx.rotate(-.42); const r = prng(55);
  for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); ctx.fillStyle = `rgba(216,230,255,${a})`; ctx.fillRect(x + t * 1.5, y, 1.3, 1.3); }
  ctx.restore();
  const dx = t * 2.2, dy = t * .6, oyw = ((oy % H) + H) % H;
  for (const [x, y, s, ph, f] of STARS) {
    const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx + ox) % W + W) % W, Y0 = ((y + dy) % H + H) % H;
    for (const Y of [Y0 + oyw, Y0 + oyw - H]) {
      if (Y < -10 || Y > H + 10) continue;
      if (tone === 'dusk' && Y - oy > H * .7) continue;
      if (Y < oy - H * (o.above ?? 2)) continue;
      ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
      if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- roads (world units ≈ 10 cm; road 70 wide)
const bez = (p0, p1, p2, p3, n) => { const o = []; for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u; o.push([v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]); } return o; };
export const ROAD = (() => {
  const trunk = [[0, -60000], [0, -20000], [0, -8000], [0, -3000], [0, -1000], [0, 0]];
  const left = [...bez([0, 0], [-60, 1100], [-1500, 2600], [-2600, 5200], 40), ...bez([-2600, 5200], [-3400, 7000], [-4800, 14000], [-7000, 26000], 30).slice(1), [-12000, 60000]];
  const T = [1500, 5200];
  const right = bez([0, 0], [80, 1500], [1250, 3000], [T[0], T[1] - 260], 40);
  return { trunk, left, right, T, W: 70 };
})();
// X of the left branch at depth Z (for placing the houses)
export function leftX(Z) { const L = ROAD.left; for (let i = 1; i < L.length; i++) if (L[i][1] >= Z) { const a = L[i - 1], b = L[i], k = (Z - a[1]) / (b[1] - a[1]); return mix(a[0], b[0], k); } return L[L.length - 1][0]; }
export function offsetPath(pts, d) {
  return pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], tx = b[0] - a[0], tz = b[1] - a[1], l = Math.hypot(tx, tz) || 1; return [p[0] + tz / l * d, p[1] - tx / l * d]; });
}

// ---------------------------------------------------------------- the warm world: many small workshops on the left
export const HOUSES = (() => {
  const r = prng(707), out = [];
  for (let i = 0; i < 760; i++) {
    const v = r(), Z = (i < 90 ? 380 : 1300) + 52000 * Math.pow(v, 2.1) * (i < 90 ? .02 : 1), lx = leftX(Z), side = i < 90 ? 0 : r();
    let X;
    if (side < .78) X = lx - (260 + Math.pow(r(), 1.4) * (.75 * Z + 3500));                         // left of the left branch
    else { const span = Math.max(0, -lx - 650); if (span < 200) { X = lx - 300 - r() * 2000; } else X = lx + 300 + r() * span; }   // between the branch and the trunk line
    out.push({ i, X, Z, u: .62 * (.8 + .45 * r()), seed: r(), yaw: (r() - .5) * .5, rank: r() });
  }
  return out;
})();

// ---------------------------------------------------------------- sprites + fog (cached Images)
const IM = {};
const FOGTONE = { night: [120, 116, 172], pale: [176, 172, 214], warm: [246, 228, 196] };
async function toImg(c) { return await loadImage(c.toBuffer('image/png')); }
function radial(n, stops) { const c = createCanvas(n, n), g = c.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); for (const [k, col] of stops) gr.addColorStop(k, col); g.fillStyle = gr; g.fillRect(0, 0, n, n); return c; }
export async function c07Ready() {
  if (IM.ready) return;
  IM.amber = await toImg(radial(256, [[0, 'rgba(255,241,214,.95)'], [.12, 'rgba(255,190,110,.6)'], [.45, 'rgba(255,150,70,.16)'], [1, 'rgba(196,81,46,0)']]));
  IM.cold = await toImg(radial(256, [[0, 'rgba(250,252,255,.95)'], [.15, 'rgba(220,232,250,.55)'], [.5, 'rgba(170,190,230,.14)'], [1, 'rgba(120,140,200,0)']]));
  IM.pool = await toImg(radial(256, [[0, 'rgba(255,214,150,.55)'], [.5, 'rgba(255,170,90,.18)'], [1, 'rgba(255,150,70,0)']]));
  IM.dawn = await toImg(radial(256, [[0, 'rgba(255,246,226,1)'], [.25, 'rgba(255,217,160,.8)'], [.6, 'rgba(244,167,122,.25)'], [1, 'rgba(244,167,122,0)']]));
  // fog: a soft cloudy band, 1024 × 256, tileable in x; one tinted copy per tone
  const fw = 1024, fh = 256, nz = vnoise(31), A = new Float32Array(fw * fh);
  for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) {
    const u = x / fw, nx = Math.cos(u * TAU) * 1.3, ny = Math.sin(u * TAU) * 1.3;
    let n = 0, amp = 1, f = 1; for (let o = 0; o < 4; o++) { n += amp * nz(nx * f * 2.2 + 10 + o * 7.3, ny * f * 2.2 + (y / fh) * 2.6 * f + 3.1 * o); amp *= .5; f *= 2; }
    n /= 1.875; const v = y / fh, env = Math.pow(Math.sin(Math.PI * v), 1.1);
    A[y * fw + x] = clamp((n - .25) * 1.9) * env;
  }
  for (const [name, rgb] of Object.entries(FOGTONE)) {
    const c = createCanvas(fw, fh), g = c.getContext('2d'), id = g.createImageData(fw, fh), d = id.data;
    for (let k = 0; k < fw * fh; k++) { d[k * 4] = rgb[0]; d[k * 4 + 1] = rgb[1]; d[k * 4 + 2] = rgb[2]; d[k * 4 + 3] = Math.round(255 * A[k]); }
    g.putImageData(id, 0, 0); IM['fog_' + name] = await toImg(c);
  }
  IM.ready = true;
}
export function glow(ctx, which, x, y, r, a = 1, comp = 'lighter') {
  if (a <= .003 || r < .5 || x + r < 0 || x - r > W || y + r < 0 || y - r > H) return;
  ctx.save(); ctx.globalCompositeOperation = comp; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(IM[which], x - r, y - r, 2 * r, 2 * r); ctx.restore();
}
// fog band: a tinted cloud layer from screen y0 to y1 (soft at both ends), drifting sideways; o { tone 'night'|'pale'|'warm', a, speed, seed }
export function fogBand(ctx, t, y0, y1, o = {}) {
  if (y1 <= y0 + 2) return;
  const im = IM['fog_' + (o.tone || 'night')], sp = o.speed ?? 14, tw = Math.max(W * .9, (y1 - y0) * 4);
  const off = (((t * sp + (o.seed ?? 0) * 337) % tw) + tw) % tw;
  ctx.save(); ctx.globalAlpha = clamp(o.a ?? 1);
  for (let x = -off; x < W; x += tw) ctx.drawImage(im, x, y0, tw, y1 - y0);
  ctx.restore();
}
export const IMG = IM;

// ================================================================ NIGHT (06a)
// far hills at the horizon as a function of azimuth (elevation in radians)
const hillE = (az) => .006 + .0045 * Math.sin(az * 7.3 + 1.2) + .003 * Math.sin(az * 17.1 + .4) + .0016 * Math.sin(az * 41 + 2) + .004 * Math.max(0, Math.sin(az * 2.1 - .9));
export function horizonHills(ctx, cam, col, o = {}) {
  if (cam.horizon < -40 || cam.horizon > H + 400) return;
  ctx.beginPath(); ctx.moveTo(-10, H + 10);
  for (let sx = -10; sx <= W + 10; sx += 6) { const az = (cam.yaw || 0) + Math.atan((sx - W / 2) / cam.F); ctx.lineTo(sx, cam.elevY(hillE(az) * (o.k ?? 1))); }
  ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  if (o.edge) { ctx.strokeStyle = o.edge; ctx.lineWidth = 1; ctx.stroke(); }
}
// the field boundaries (hedgerows) of the left world: faint engraved lines in perspective
const HEDGES = (() => {
  const r = prng(99), L = [];
  for (const Z of [1900, 2700, 3700, 5000, 6800, 9200, 12500, 17000, 23000, 31000]) { const pts = []; for (let X = -40000; X <= leftX(Z) + 600; X += 600) pts.push([X, Z + 60 * Math.sin(X * .0013 + Z) + 40 * (r() - .5)]); L.push(pts); }
  for (const X0 of [-900, -1900, -3200, -4800, -7000, -10000, -14000, -19000]) { const pts = []; for (let Z = Math.max(1600, 1600 + (-X0 - 900) * .3); Z <= 40000; Z += 500) pts.push([X0 - Z * .08 + 50 * Math.sin(Z * .002 + X0), Z]); L.push(pts); }
  return L;
})();
export function hedges(ctx, cam, col, lw = 1) { ctx.beginPath(); for (const p of HEDGES) groundPath(ctx, cam, p); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }

// the road: two engraved edges (grow 0..1 = the edges part from the thread), and the thread itself (gold, glowing, ticks every 9 px)
export function roadEdges(ctx, cam, grow, col, lw = 1.2, which = { trunk: 1, left: 1, right: 1 }) {
  if (grow <= 0) return; const d = ROAD.W / 2 * grow;
  ctx.beginPath();
  for (const k of ['trunk', 'left', 'right']) { const f = which[k] ?? 1; if (f <= 0) continue; const pts = partPath(ROAD[k], f, k === 'trunk'); groundPath(ctx, cam, offsetPath(pts, d)); groundPath(ctx, cam, offsetPath(pts, -d)); }
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke();
}
// a path's first fraction f (by index; the trunk is taken from its far end so it always reaches the fork)
export function partPath(pts, f, fromEnd = false) {
  if (f >= 1) return pts; const n = pts.length - 1, x = f * n, i = Math.floor(x), k = x - i;
  if (fromEnd) return pts;
  const out = pts.slice(0, i + 1); if (i < n) out.push([mix(pts[i][0], pts[i + 1][0], k), mix(pts[i][1], pts[i + 1][1], k)]); return out;
}
const TONES = { gold: ['#f3d9a0', '#fff8e6'], amber: ['#ffb35c', '#fff1d6'], cool: ['#bfe3ff', '#eef8ff'] };
// the glowing thread along a ground polyline; o { tone, a, bob, t, tickPhase, anchor [sx,sy] (tick 0 sits 4 px right of it, as the plate's) }
export function thread(ctx, t, cam, pts, o = {}) {
  const col = TONES[o.tone || 'gold'], br = .9 + .1 * Math.sin((t + TSHIFT) * 2.1), a = o.a ?? 1;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'lighter';
  if (o.bob) ctx.translate(0, o.bob);
  ctx.beginPath(); const sp = groundPath(ctx, cam, pts);
  const strokeAll = () => { ctx.beginPath(); let pen = false; for (const p of sp) { if (!p) { pen = false; continue; } if (!pen) { ctx.moveTo(p[0], p[1]); pen = true; } else ctx.lineTo(p[0], p[1]); } };
  for (const [w, al, c] of [[26, .05, col[0]], [10, .14, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) { strokeAll(); ctx.strokeStyle = rgba(c, al * a); ctx.lineWidth = w * (o.wk ?? 1); ctx.stroke(); }
  // ticks every 9 px of screen length (the plate's engraving), measured from the anchor
  if (o.ticks !== false) {
    ctx.strokeStyle = rgba(col[1], .35 * a); ctx.lineWidth = 1; ctx.beginPath(); const tt = t + TSHIFT;
    let acc = null; const anc = o.anchor;
    for (let i = 1; i < sp.length; i++) {
      const A = sp[i - 1], B = sp[i]; if (!A || !B) continue; const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy); if (L < .01) continue;
      const ux = dx / L, uy = dy / L;
      if (acc == null) { acc = anc ? ((4 - (ux * (A[0] - anc[0]) + uy * (A[1] - anc[1]))) % 9 + 9) % 9 : 0; }
      for (let s = acc; s < L; s += 9) { const x = A[0] + ux * s, y = A[1] + uy * s; if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue; const xl = anc ? ux * (x - anc[0]) + uy * (y - anc[1]) : s, h = 2 + 1.5 * Math.sin(xl * .07 + tt); ctx.moveTo(x - uy * -h, y + ux * -h); ctx.lineTo(x + ux * 3 - uy * h, y + uy * 3 + ux * h); }
      acc = ((acc - L) % 9 + 9) % 9;
    }
    ctx.stroke();
  }
  ctx.restore();
  return sp;
}

// one small workshop at night (the kit's instance silhouette), local units (240 wide, roof to −104); lit 0..1, fig 0..1 (the figure in
// the door raises its hand), hand 0..1
export function nightHouse(ctx, t, lit, o = {}) {
  ctx.fillStyle = o.fill || '#121535'; ctx.beginPath(); ctx.moveTo(-120, 0); ctx.lineTo(-120, -70);
  for (let q = 0; q < 4; q++) { const x0 = -120 + q * 60; ctx.lineTo(x0, -104); ctx.lineTo(x0 + 60, -70); } ctx.lineTo(120, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#8a80d0', .5); ctx.lineWidth = o.lw ?? 1; ctx.stroke();
  if (lit > 0) {
    ctx.fillStyle = rgba('#ffd89a', clamp(lit)); for (let q = 0; q < 10; q++) ctx.fillRect(-112 + q * 18.2, -54, 11, 30);
    ctx.fillStyle = rgba('#ffb35c', clamp(lit)); ctx.fillRect(90, -46, 20, 46);
    if (o.fig) {   // a figure in the door, its hand half/fully raised
      const hu = clamp(o.hand ?? 1), f = clamp(o.fig);
      ctx.fillStyle = '#1a1424'; ctx.beginPath(); ctx.ellipse(100, -36, 3.6, 4.2, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(96, -31); ctx.lineTo(104, -31); ctx.lineTo(105.5, 0); ctx.lineTo(94.5, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#1a1424'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(103, -29); const ang = mix(.3, 2.5, hu * f); ctx.lineTo(103 + Math.sin(ang) * 11, -29 + Math.cos(ang) * 11); ctx.stroke();
    }
  }
}
export const housesNight = (ctx, t, cam, o = {}) => houses(ctx, t, cam, { ...o, day: false });

// ---------------------------------------------------------------- the tower: one huge prism of cold white glass at the end of the right branch
export const TOWER = { X: ROAD.T[0], Z: ROAD.T[1], w: 340, d: 300, h: 1150 };
const TNET = (() => { const r = prng(515), n = []; for (let i = 0; i < 90; i++) n.push([.08 + .84 * r(), .04 + .9 * Math.pow(r(), .9), r()]); const e = []; for (let i = 0; i < n.length; i++) { const ds = n.map((q, j) => [Math.hypot((q[0] - n[i][0]) * 1.4, q[1] - n[i][1]), j]).sort((a, b) => a[0] - b[0]); for (const [, j] of ds.slice(1, 3)) if (j > i) e.push([i, j]); } return { n, e }; })();
const TSW = (() => { const r = prng(616), s = []; for (let i = 0; i < 220; i++) s.push([r(), .05 + .9 * r(), .3 + r() * .9, r() * TAU, .6 + r() * .9]); return s; })();
export function tower(ctx, t, cam, o = {}) {
  const T = TOWER, X0 = T.X - T.w / 2, X1 = T.X + T.w / 2, Z0 = T.Z - T.d / 2, Z1 = T.Z + T.d / 2, Ht = T.h * (o.hk ?? 1);
  const P = (X, Y, Z) => cam.P(X, Y, Z);
  const quad = (a, b, c, d) => { const q = [a, b, c, d].map((p) => P(...p)); if (!q.every(Boolean)) return null; ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); for (const p of q.slice(1)) ctx.lineTo(p[0], p[1]); ctx.closePath(); return q; };
  const base = P(T.X, 0, Z0); if (!base) return null;
  // halo
  const topP = P(T.X, Ht * .55, Z0); if (topP) glow(ctx, 'cold', topP[0], topP[1], cam.F * 1500 / Math.max(200, base[2]), .5 * (o.a ?? 1));
  // faces: left side (−X) when the camera is left of it, then the front (−Z)
  const faces = [];
  if (cam.x < X0) faces.push({ q: [[X0, 0, Z1], [X0, 0, Z0], [X0, Ht, Z0], [X0, Ht, Z1]], k: .78 });
  if (cam.x > X1) faces.push({ q: [[X1, 0, Z0], [X1, 0, Z1], [X1, Ht, Z1], [X1, Ht, Z0]], k: .78 });
  if (cam.z < Z0) faces.push({ q: [[X0, 0, Z0], [X1, 0, Z0], [X1, Ht, Z0], [X0, Ht, Z0]], k: 1 });
  for (const f of faces) {
    const q = quad(...f.q); if (!q) continue;
    const g = ctx.createLinearGradient(0, q[0][1], 0, q[3][1]); g.addColorStop(0, rgba('#f6f9ff', .96 * f.k)); g.addColorStop(.35, rgba('#e8eef6', .82 * f.k)); g.addColorStop(1, rgba('#b8c6e2', .5 * f.k));
    ctx.fillStyle = g; ctx.fill();
    // inside: the weave (cold gold) and the swarm, seen through the glass
    ctx.save(); ctx.clip();
    const at = (u, v) => { const [a, b, c, d] = f.q; const X = mix(mix(a[0], b[0], u), mix(d[0], c[0], u), v), Y = mix(mix(a[1], b[1], u), mix(d[1], c[1], u), v), Z = mix(mix(a[2], b[2], u), mix(d[2], c[2], u), v); return P(X, Y, Z); };
    ctx.strokeStyle = rgba('#8a96c8', .55); ctx.lineWidth = 1; ctx.beginPath();
    for (const [i, j] of TNET.e) { const A = at(TNET.n[i][0], TNET.n[i][1]), B = at(TNET.n[j][0], TNET.n[j][1]); if (A && B) { ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); } }
    ctx.stroke();
    for (const [u, v, k] of TNET.n) { const A = at(u, v); if (!A) continue; const tw = .6 + .4 * Math.sin(t * 2 + k * 9); ctx.fillStyle = rgba('#b9a36a', .8 * tw); ctx.beginPath(); ctx.arc(A[0], A[1], 1.6 + 1.6 * k, 0, TAU); ctx.fill(); }
    const ds = clamp(cam.F / base[2] * 2.2, .6, 3);
    for (const [u0, v, sp, ph, k] of TSW) { const u = .5 + .42 * Math.sin(t * sp * .8 + ph), vv = v + .02 * Math.sin(t * 1.3 + ph * 2); const A = at(u, vv); if (!A) continue; ctx.fillStyle = rgba('#2a3566', .8); ctx.beginPath(); ctx.ellipse(A[0], A[1], (1.1 + k) * ds, (.7 + .5 * k) * ds, Math.sin(t * sp + ph), 0, TAU); ctx.fill(); }
    // mullions + floors
    ctx.strokeStyle = rgba('#6d7ba6', .55); ctx.lineWidth = clamp(cam.F / base[2] * 1.4, 1, 2.6); ctx.beginPath();
    for (let u = 0; u <= 1.001; u += 1 / 10) { const A = at(u, 0), B = at(u, 1); if (A && B) { ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); } }
    const fl = Math.max(1, Math.round(28 * clamp(Math.abs(q[3][1] - q[0][1]) / 900, .3, 1)));
    for (let v = 0; v <= 1.001; v += 1 / fl) { const A = at(0, v), B = at(1, v); if (A && B) { ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); } }
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = rgba('#f6f9ff', .9); ctx.lineWidth = 1.4; quad(...f.q); ctx.stroke();
  }
  return { base, top: P(T.X, Ht, Z0) };
}

// ================================================================ DAY (warm twilight on paper, 07a)
export const DAY = { paper: '#f1d9a8', sky: '#f6e6c4', ochre: '#c9893f', ink: '#2a2420', wall: '#f3e7cb', roof: '#e7d3ab', win: '#dcc9a2' };
// one small workshop as an ink engraving on warm paper (same local units as nightHouse)
export function dayHouse(ctx, t, lit, o = {}) {
  const lw = o.lw ?? 1, ink = DAY.ink;
  ctx.lineJoin = 'round';
  ctx.fillStyle = DAY.wall; ctx.fillRect(-120, -70, 240, 70);
  ctx.beginPath(); ctx.moveTo(-122, -70); for (let q = 0; q < 4; q++) { const x0 = -122 + q * 61; ctx.lineTo(x0, -104); ctx.lineTo(x0 + 61, -70); } ctx.closePath(); ctx.fillStyle = DAY.roof; ctx.fill();
  if (o.detail) {   // roof hatch + wall hatch (close only)
    ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(ink, .35); ctx.lineWidth = lw * .6; ctx.beginPath(); for (let x = -130; x < 130; x += 4) { ctx.moveTo(x, -70); ctx.lineTo(x + 14, -106); } ctx.stroke(); ctx.restore();
    ctx.strokeStyle = rgba(ink, .18); ctx.lineWidth = lw * .5; ctx.beginPath(); for (let x = -120; x < 120; x += 5) { ctx.moveTo(x, -70); ctx.lineTo(x + 4, 0); } ctx.stroke();
  }
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-122, -70); for (let q = 0; q < 4; q++) { const x0 = -122 + q * 61; ctx.lineTo(x0, -104); ctx.lineTo(x0 + 61, -70); } ctx.closePath(); ctx.stroke();
  ctx.strokeRect(-120, -70, 240, 70);
  const L = clamp(lit);
  for (let q = 0; q < 10; q++) { const x = -112 + q * 18.2; ctx.fillStyle = L > 0 ? mixHex(DAY.win, '#ffc978', L) : DAY.win; ctx.fillRect(x, -54, 11, 30); if (o.detail) { ctx.strokeStyle = ink; ctx.lineWidth = lw * .8; ctx.strokeRect(x, -54, 11, 30); } }
  ctx.fillStyle = L > 0 ? mixHex('#cdb88e', '#ffb35c', L) : '#cdb88e'; ctx.fillRect(90, -46, 20, 46); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.strokeRect(90, -46, 20, 46);
  // ground shadow (hatched)
  ctx.strokeStyle = rgba(ink, .4); ctx.lineWidth = lw * .7; ctx.beginPath(); for (let x = -118; x < 122; x += 6) { ctx.moveTo(x, 2); ctx.lineTo(x - 5, 8); } ctx.stroke();
}
function mixHex(a, b, k) { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(mix(v, B[i], k)).toString(16).padStart(2, '0')).join(''); }
export { mixHex };

// all the houses, far → near, in one style; o { day, lit(h,t), fig(h,t), hand(h,t), glowA, after(h, proj, s) (draw things in front of house h) }
export function houses(ctx, t, cam, o = {}) {
  const vis = [], list = o.list || HOUSES;
  for (const h of list) { const c = cam.toC(h.X, 0, h.Z); if (c[2] < 30) continue; const sx = W / 2 + cam.F * c[0] / c[2], sy = cam.CY - cam.F * c[1] / c[2], s = cam.F * h.u / c[2]; if (sx < -260 * s - 60 || sx > W + 260 * s + 60 || sy < -60 || sy > H + 160 * s + 60) continue; vis.push([c[2], h, sx, sy, s]); }
  for (const e of o.extra || []) { const c = cam.toC(e.X, 0, e.Z); if (c[2] < (e.near ?? 4)) continue; vis.push([c[2], e, 0, 0, 0, true]); }
  vis.sort((a, b) => b[0] - a[0]);
  const top = (cam.pitch || 0) > .9, day = !!o.day;
  for (const [d, h, sx, sy, s, ex] of vis) {
    if (ex) { h.draw(ctx, cam, d); continue; }
    const ph = o.ph ? o.ph(h, t) : 1; if (ph <= .002) continue;
    const lit = o.lit ? o.lit(h, t) : 0;
    if (s * 240 < 7) {
      if (day) { ctx.fillStyle = lit > .5 ? rgba('#e0a050', .9) : rgba(DAY.ink, .55); ctx.fillRect(sx - s * 120, sy - s * 70, s * 240, Math.max(1, s * 70)); continue; }
      if (lit > 0) { const r = Math.max(1, s * 60); ctx.fillStyle = rgba('#ffd89a', clamp(lit) * .95); ctx.fillRect(sx - r, sy - r * .7, 2 * r, r * 1.2); glow(ctx, 'amber', sx, sy - r, Math.max(6, 160 * s), .5 * lit * (o.glowA ?? 1)); }
      else if (top || s * 240 > 2.5) { ctx.fillStyle = rgba('#2a2a5a', .9); ctx.fillRect(sx - s * 120, sy - s * 60, s * 240, Math.max(1, s * 60)); }
      continue;
    }
    if (top && !day) { ctx.beginPath(); const q = [[-120, 0], [120, 0], [120, 90], [-120, 90]].map(([a, b]) => cam.P(h.X + (a * Math.cos(h.yaw) - b * Math.sin(h.yaw)) * h.u, 0, h.Z + (a * Math.sin(h.yaw) + b * Math.cos(h.yaw)) * h.u)); if (q.every(Boolean)) { ctx.moveTo(q[0][0], q[0][1]); for (const p of q.slice(1)) ctx.lineTo(p[0], p[1]); ctx.closePath(); ctx.fillStyle = '#151838'; ctx.fill(); ctx.strokeStyle = rgba('#8a80d0', .45); ctx.lineWidth = 1; ctx.stroke(); } }
    facade(ctx, cam, h.X, h.Z, h.u, (g, sc) => (ph < 1 && g.scale(1, ph), day) ? dayHouse(g, t, lit, { lw: 1.1 / Math.max(.05, sc), detail: sc > .9 }) : nightHouse(g, t, lit, { lw: 1 / Math.max(.05, sc), fig: o.fig ? o.fig(h, t) : 0, hand: o.hand ? o.hand(h, t) : 1 }), { yaw: h.yaw, cull: false });
    if (lit > 0 && !day) glow(ctx, 'amber', sx, sy - 40 * s, 200 * s + 14, .42 * lit * (o.glowA ?? 1));
    if (o.after) o.after(h, sx, sy, s, d);
  }
}

// ---------------------------------------------------------------- the day sky: the dusk plate (moved so that it sits where the final crane
// pose will show it) under a warm band anchored to elevation (warm below e0, the plate above e1)
export const CRANE_PITCH = -1.25;
export function skyDayDusk(ctx, t, cam, o = {}) {
  const p = cam.pitch || 0, oy = cam.CY - cam.F * Math.tan(p - CRANE_PITCH) - H / 2;
  skyCopy(ctx, t, 'dusk', 0, oy, { clipY: cam.horizon + 1 });
  const e0 = o.e0 ?? .45, e1 = o.e1 ?? .82, y0 = cam.elevY(e0), y1 = cam.elevY(e1), hz = cam.horizon;
  ctx.save(); ctx.beginPath(); ctx.rect(-400, -4000, W + 800, Math.min(H + 4000, hz + 4001)); ctx.clip();
  const g = ctx.createLinearGradient(0, y0, 0, Math.min(y1, y0 - 1)); g.addColorStop(0, rgba('#fbe6bd', 1)); g.addColorStop(.25, rgba('#f6dcae', .95)); g.addColorStop(.6, rgba('#efc39a', .55)); g.addColorStop(1, rgba('#e9b296', 0));
  ctx.fillStyle = '#fbe6bd'; if (hz > y0) ctx.fillRect(-400, y0, W + 800, hz - y0 + 1);
  ctx.fillStyle = g; ctx.fillRect(-400, Math.min(y1, y0) - 1, W + 800, Math.abs(y0 - y1) + 2);
  if (o.sun) { const az = o.sun[0] - (cam.yaw || 0), sx = W / 2 + cam.F * Math.tan(az); glow(ctx, 'dawn', sx, hz - 4, o.sun[1] ?? 560, o.sun[2] ?? .6, 'source-over'); }
  ctx.restore();
}

// ---------------------------------------------------------------- the market street (07a: Kenya again, before the tools), the path, vignettes
export const STREET = (() => { const r = prng(2024), L = []; for (let k = 0; k < 27; k++) L.push({ k, X: -1305 - k * 58, Z: 2598, seed: r(), flip: k % 2 === 1, vs: Math.floor(r() * 1000) }); return L; })();
export const PATH = [[-1285, 2570], [-1200, 2553], [-1140, 2546], [-1090, 2552], [-1052, 2580], [-1022, 2640], [-990, 2740], [-900, 3100], [-500, 4800], [500, 10000], [3000, 22000], [6000, 40000]];
// a sampled point of a polyline by fraction of its length
export function along(pts, f) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = clamp(f) * L[L.length - 1]; let i = 1; while (i < L.length - 1 && L[i] < d) i++; const k = (d - L[i - 1]) / (L[i] - L[i - 1] || 1);
  return [mix(pts[i - 1][0], pts[i][0], k), mix(pts[i - 1][1], pts[i][1], k)];
}
// the well + tree of a village square (local units, ground y 0; ~120 wide)
export function squareVignette(ctx, lw) {
  const ink = DAY.ink; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // tree: trunk + a scalloped engraved canopy
  ctx.fillStyle = '#e9d6ae'; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU, rr = 34 + 5 * Math.sin(a * 7); ctx.lineTo(-38 + Math.cos(a) * rr * 1.1, -78 + Math.sin(a) * rr * .85); } ctx.closePath(); ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(ink, .35); ctx.lineWidth = lw * .6; ctx.beginPath(); for (let x = -90; x < 20; x += 4) { ctx.moveTo(x, -120); ctx.lineTo(x + 30, -40); } ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#d9c39a'; ctx.fillRect(-42, -52, 8, 52); ctx.strokeRect(-42, -52, 8, 52);
  // the well: a round stone rim, two posts, a little roof, a bucket
  ctx.fillStyle = '#eadbb8'; ctx.beginPath(); ctx.ellipse(34, -16, 22, 6, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillRect(12, -16, 44, 16); ctx.strokeRect(12, -16, 44, 16);
  ctx.strokeStyle = rgba(ink, .5); ctx.beginPath(); for (let x = 16; x < 56; x += 7) { ctx.moveTo(x, -14); ctx.lineTo(x, -2); } ctx.stroke(); ctx.strokeStyle = ink;
  ctx.beginPath(); ctx.moveTo(16, -16); ctx.lineTo(16, -46); ctx.moveTo(52, -16); ctx.lineTo(52, -46); ctx.moveTo(16, -36); ctx.lineTo(52, -36); ctx.stroke();
  ctx.fillStyle = '#e1c99c'; ctx.beginPath(); ctx.moveTo(8, -44); ctx.lineTo(34, -58); ctx.lineTo(60, -44); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(34, -36); ctx.lineTo(34, -26); ctx.stroke(); ctx.fillStyle = '#cdb68c'; ctx.fillRect(30, -27, 8, 6); ctx.strokeRect(30, -27, 8, 6);
  // a bench
  ctx.beginPath(); ctx.moveTo(-10, -9); ctx.lineTo(8, -9); ctx.moveTo(-8, -9); ctx.lineTo(-8, 0); ctx.moveTo(6, -9); ctx.lineTo(6, 0); ctx.stroke();
  ctx.strokeStyle = rgba(ink, .4); ctx.lineWidth = lw * .7; ctx.beginPath(); for (let x = -60; x < 64; x += 6) { ctx.moveTo(x, 2); ctx.lineTo(x - 5, 7); } ctx.stroke();
}
// a guild hall: a broad gabled hall open at the front, engraved tools hanging on its back wall (local units, ~220 wide, ~150 tall)
export function guildHall(ctx, lw) {
  const ink = DAY.ink; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // back wall (inside, darker paper) + the tools
  ctx.fillStyle = '#e7d4ad'; ctx.fillRect(-96, -96, 192, 96);
  ctx.strokeStyle = rgba(ink, .2); ctx.lineWidth = lw * .5; ctx.beginPath(); for (let x = -96; x < 96; x += 4) { ctx.moveTo(x, -96); ctx.lineTo(x, 0); } ctx.stroke();
  ctx.strokeStyle = ink; ctx.lineWidth = lw * 1.2; ctx.beginPath(); ctx.moveTo(-88, -74); ctx.lineTo(88, -74); ctx.stroke();   // the tool rail
  const tool = (x, k) => {
    ctx.save(); ctx.translate(x, -74); ctx.lineWidth = lw; ctx.fillStyle = '#d6bf92';
    ctx.beginPath(); ctx.arc(0, 0, 1.6, 0, TAU); ctx.fill(); ctx.stroke();
    if (k === 0) { ctx.fillRect(-1.5, 2, 3, 26); ctx.strokeRect(-1.5, 2, 3, 26); ctx.fillRect(-7, 26, 14, 6); ctx.strokeRect(-7, 26, 14, 6); }   // hammer
    else if (k === 1) { ctx.beginPath(); ctx.moveTo(-4, 2); ctx.lineTo(4, 2); ctx.lineTo(5, 9); ctx.lineTo(-5, 9); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-4, 9); ctx.lineTo(-4, 36); ctx.lineTo(9, 36); ctx.lineTo(4, 9); ctx.closePath(); ctx.stroke(); ctx.beginPath(); for (let y = 12; y < 36; y += 3) { ctx.moveTo(-4, y); ctx.lineTo(-6, y + 1.5); } ctx.stroke(); }   // saw
    else if (k === 2) { ctx.fillRect(-2, 2, 4, 12); ctx.strokeRect(-2, 2, 4, 12); ctx.beginPath(); ctx.moveTo(-1.5, 14); ctx.lineTo(1.5, 14); ctx.lineTo(1, 34); ctx.lineTo(-1, 34); ctx.closePath(); ctx.stroke(); }   // chisel
    else if (k === 3) { ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(-7, 30); ctx.moveTo(0, 2); ctx.lineTo(7, 30); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 4, 2.5, 0, TAU); ctx.stroke(); }   // compass
    else { ctx.beginPath(); ctx.moveTo(-1, 2); ctx.lineTo(-1, 30); ctx.lineTo(16, 30); ctx.stroke(); ctx.beginPath(); for (let y = 6; y < 30; y += 4) { ctx.moveTo(-1, y); ctx.lineTo(2, y); } ctx.stroke(); }   // square
    ctx.restore();
  };
  [-76, -56, -36, -16, 6, 26, 46, 66, 82].forEach((x, i) => tool(x, i % 5));
  ctx.fillStyle = '#d8c193'; ctx.fillRect(-70, -26, 140, 6); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.strokeRect(-70, -26, 140, 6);   // the bench
  ctx.beginPath(); ctx.moveTo(-64, -20); ctx.lineTo(-64, 0); ctx.moveTo(64, -20); ctx.lineTo(64, 0); ctx.stroke();
  // the front frame: posts, a broad gable, a lintel with a blank sign
  ctx.fillStyle = '#efdfbd'; ctx.beginPath(); ctx.moveTo(-112, -96); ctx.lineTo(0, -150); ctx.lineTo(112, -96); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(ink, .35); ctx.lineWidth = lw * .6; ctx.beginPath(); for (let x = -120; x < 120; x += 5) { ctx.moveTo(x, -96); ctx.lineTo(x + 20, -152); } ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#e9d6ae'; for (const x of [-112, -60, 50, 102]) { ctx.fillRect(x, -96, 10, 96); ctx.strokeRect(x, -96, 10, 96); }
  ctx.fillRect(-112, -100, 224, 8); ctx.strokeRect(-112, -100, 224, 8);
  ctx.beginPath(); ctx.ellipse(0, -122, 14, 9, 0, 0, TAU); ctx.fillStyle = '#f3e7cb'; ctx.fill(); ctx.stroke();
  ctx.strokeStyle = rgba(ink, .4); ctx.lineWidth = lw * .7; ctx.beginPath(); for (let x = -114; x < 116; x += 6) { ctx.moveTo(x, 2); ctx.lineTo(x - 5, 7); } ctx.stroke();
}
