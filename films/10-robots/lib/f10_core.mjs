// Film 10 kit, core: palette, easing, the time of day tod(t) and its light (the ONLY light source), the 3D camera view3() with
// safeView clipping, camera keys, the trace (die Spur), text written by the trace, footage slots (ORIGINAL FOOTAGE) and the chunk handoffs.
// Builders import everything from lib/f10_kit.mjs (it re-exports this file, f10_valley, f10_figs and f10_hall).
import fs from 'node:fs';
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, drift, text } from '../engine.mjs';
import { ROOT } from './kit.mjs';

export { W, H, rgba, clamp, lin, mix, sm, prng, drift, text, ROOT };

// ---------------------------------------------------------------- palette (MOTION.md §4)
export const PAL = {
  paper: '#efe6d2', ink: '#2b2622', mist: '#e8e3d6', noonSky: '#dfe9ec', hallLight: '#fbf6ea', steel: '#8a9aa6',
  afternoon: '#f0c27a', roof: '#c8714a', golden: '#e9a25a', shadowWarm: '#6b4a5e', duskViolet: '#5d4f7a', horizonRose: '#d98f7a',
  blueHour: '#24305a', window: '#ffb35c', dawn: '#f2c9a0', vine: '#6f8f4e', leaf: '#9bb86a', soil: '#b8875a', soilDeep: '#8a5a3c',
  traceWarm: '#fff1c9', traceGlow: '#ffb35c', traceCold: '#9fb6cf', traceColdCore: '#e6eef6',
  robotShell: '#ecebe6', robotJoint: '#3a3d42', robotVisor: '#1f2a33', knit: '#d9c7a8', magnet: '#7a6f8f',
  you: '#c98a3a', grandma: '#c79a9a', trainer: '#3f7f7a', grower: '#4a6a8a',
  brick: '#b8694c', brickLight: '#e6d9c4', asphalt: '#8d8a86', meadow: '#a9b77a', meadowDry: '#c9bf86', field: '#d2c08a', water: '#9fbac4',
};
// skin tones (warm range), shared by all figures and hands
export const SKINS = ['#e3b896', '#c99a74', '#a8734f', '#7a4f33', '#efcfb1', '#b88660'];

// ---------------------------------------------------------------- colour + easing helpers
export function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
export function mixHex(a, b, u) { const A = hex2rgb(a), B = hex2rgb(b), k = clamp(u); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
export function shadeHex(h, d) { return '#' + hex2rgb(h).map((v) => Math.round(clamp(v + d * 255, 0, 255)).toString(16).padStart(2, '0')).join(''); }
export const expoOut = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)));            // ≈ cubic-bezier(0.16, 1, 0.3, 1): entrances, landings
export const expoIn = (x) => (x <= 0 ? 0 : Math.pow(2, 10 * clamp(x) - 10));              // ≈ (0.7, 0, 0.84, 0): exits
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out: moves
export const sineS = (x) => .5 - .5 * Math.cos(Math.PI * clamp(x));                       // camera
export const span = (t, a, b, e = sineS) => e(lin(a, b, t));
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
export function noise1(x, seed = 0) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return mix(hash(i + seed * 57.3), hash(i + 1 + seed * 57.3), u) * 2 - 1; }

// ---------------------------------------------------------------- the day: tod(t) → hours, light(h) → everything light
// One day over the film (MOTION.md §2.3). The jump at 372 s (evening blue hour → morning blue hour) is invisible: light() is the same there.
const TOD = [[0, 6.75], [75, 9.6], [125, 11.9], [192, 13.2], [246, 15.6], [292, 17.9], [330, 19.3], [360, 20.35], [372, 20.6], [372.01, 5.35], [409, 6.55], [454, 7.5], [507, 8.4], [561, 9.1], [612.74, 7.3], [655.4, 7.6]];
export function tod(t) {
  if (t <= TOD[0][0]) return TOD[0][1];
  for (let i = 0; i + 1 < TOD.length; i++) { const [a, ha] = TOD[i], [b, hb] = TOD[i + 1]; if (t <= b) return mix(ha, hb, (t - a) / (b - a)); }
  return TOD[TOD.length - 1][1];
}
// sun: rises 6.2 h at the left (east, az −78°), noon high and slightly right of the valley axis, sets 19.9 h at the right (az +78°)
const SKYK = [   // [sun elevation°, top, horizon, fog, sun colour, shade colour, key] for the morning side; evening uses EVE
  [-12, '#1f2a52', '#3c4a7a', '#3a4670', '#ffb35c', '#2a2f55', .42],
  [-4, '#3a4a7c', '#a3a2c0', '#8f94b4', '#ffb070', '#4a4a72', .55],
  [1, '#c3d3df', '#f4d6ae', '#efe2cc', '#ffcf8a', '#8f8098', .86],
  [8, '#c9dce4', '#f4e0bf', '#efe6d6', '#ffe3b0', '#94899e', .95],
  [22, '#c4dbe5', '#ecece0', '#e9ebe4', '#fff1d6', '#8f93a6', 1],
  [55, '#bcd6e2', '#e3ece9', '#e6ebe8', '#fff8ea', '#8d97a8', 1],
];
const EVE = [
  [-12, '#1f2a52', '#3c4a7a', '#3a4670', '#ffb35c', '#2a2f55', .42],
  [-4, '#3b3f72', '#c08a8e', '#8e7f9e', '#ff9a5c', '#4d4170', .6],
  [1, '#8f9cc0', '#e9a066', '#d9b08e', '#ffa95c', '#6b4a5e', .8],
  [8, '#a9bccf', '#efbd84', '#ead2b2', '#ffc27a', '#7a6078', .9],
  [22, '#bed6e2', '#efe2c8', '#ebe6da', '#ffe7c0', '#8a889e', 1],
  [55, '#bcd6e2', '#e3ece9', '#e6ebe8', '#fff8ea', '#8d97a8', 1],
];
function skyRow(tab, el) {
  let i = 0; while (i + 2 < tab.length && el > tab[i + 1][0]) i++;
  const A = tab[i], B = tab[i + 1], u = clamp((el - A[0]) / (B[0] - A[0]));
  return { top: mixHex(A[1], B[1], u), hor: mixHex(A[2], B[2], u), fog: mixHex(A[3], B[3], u), sunCol: mixHex(A[4], B[4], u), shade: mixHex(A[5], B[5], u), key: mix(A[6], B[6], u) };
}
export function light(h) {
  const day = (h - 6.2) / (19.9 - 6.2);                       // 0 sunrise … 1 sunset
  const el = 54 * Math.sin(Math.PI * clamp(day, -.12, 1.12)) + (day < 0 ? day * 60 : day > 1 ? (1 - day) * 60 : 0);
  const az = mix(-78, 78, clamp(day, -.2, 1.2));
  const morning = h < 13 ? 1 : 0, r = skyRow(morning ? SKYK : EVE, el);
  const elr = el * Math.PI / 180, azr = az * Math.PI / 180;
  const dir = [Math.sin(azr) * Math.cos(elr), Math.sin(elr), Math.cos(azr) * Math.cos(elr)];   // towards the sun (world)
  const warm = clamp(1 - (el - 2) / 26);                        // 1 = low warm sun, 0 = high white sun
  return {
    h, el, az, dir, warm, morning,
    sky: [r.top, r.hor], fog: r.fog, sunCol: r.sunCol, shade: r.shade, key: r.key,
    rim: mixHex('#fff4dc', '#ffc27a', warm), shadowLen: clamp(1 / Math.tan(Math.max(4, el) * Math.PI / 180), .5, 8),
    // lit(colour, f): a surface colour under this light; f 0 = in shadow (coloured, never black), 1 = full sun
    lit(col, f = 1) { const s = mixHex(col, r.shade, .38 + .1 * (1 - r.key)), l = mixHex(col, r.sunCol, .1 + .12 * warm); return mixHex(s, l, clamp(f) * r.key + (1 - r.key) * .25); },
    // air(colour, dist m): atmospheric perspective towards the fog colour
    air(col, d, k = 1) { return mixHex(col, r.fog, clamp(1 - Math.exp(-d / (2600 / k)))); },
  };
}
export const lightAt = (t) => light(tod(t));

// ---------------------------------------------------------------- 3D camera (metres, y up, z north = into the valley)
// cam { x, y, z, yaw (rad, + turns right towards +x), pitch (rad, + looks up), f (focal px, default 1700) }
// safeView (from Film 11): every polygon and segment is clipped to the near plane (z ≥ 5 cm) and to the frustum widened 3× before it is
// projected, so geometry that passes the camera plane (walls, fences, window bars, vines) never paints a stray full-frame shape.
export function view3(cam) {
  const yaw = cam.yaw || 0, pitch = cam.pitch || 0, f = cam.f || 1700;
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const toCam = (p) => {
    const dx = p[0] - cam.x, dy = p[1] - cam.y, dz = p[2] - cam.z;
    const x1 = dx * cy - dz * sy, z1 = dx * sy + dz * cy;
    return [x1, dy * cp - z1 * sp, dy * sp + z1 * cp];
  };
  const ZN = .05, G = 3, gx = G * (W / 2) / f, gy = G * (H / 2) / f;
  const scr = (q) => ({ x: W / 2 + f * q[0] / q[2], y: H / 2 - f * q[1] / q[2], z: q[2], k: f / q[2] });
  const P = (p) => { const q = toCam(p); return q[2] > ZN ? scr(q) : { x: NaN, y: NaN, z: q[2], k: 0 }; };
  const planes = [(q) => q[2] - ZN, (q) => gx * q[2] - q[0], (q) => gx * q[2] + q[0], (q) => gy * q[2] - q[1], (q) => gy * q[2] + q[1]];
  const clipQ = (Q) => {
    for (const pl of planes) {
      if (Q.length < 3) return Q;
      const d = Q.map(pl), out = [];
      for (let i = 0; i < Q.length; i++) {
        const j = (i + 1) % Q.length, ia = d[i] >= 0, ib = d[j] >= 0;
        if (ia) out.push(Q[i]);
        if (ia !== ib) { const u = d[i] / (d[i] - d[j]), a = Q[i], b = Q[j]; out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]); }
      }
      Q = out;
    }
    return Q;
  };
  const proj = (pts) => clipQ(pts.map(toCam)).map(scr);
  const poly = (ctx, pts, begin = true) => { const S = proj(pts); if (S.length < 3) return null; if (begin) ctx.beginPath(); S.forEach((s, i) => (i ? ctx.lineTo(s.x, s.y) : ctx.moveTo(s.x, s.y))); ctx.closePath(); return S; };
  const cseg = (a, b) => {
    let A = toCam(a), B = toCam(b);
    for (const pl of planes) {
      const da = pl(A), db = pl(B);
      if (da < 0 && db < 0) return null;
      if (da < 0 || db < 0) { const u = da / (da - db), c = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u]; if (da < 0) A = c; else B = c; }
    }
    return [scr(A), scr(B)];
  };
  const seg = (ctx, a, b) => { const s = cseg(a, b); if (!s) return null; ctx.moveTo(s[0].x, s[0].y); ctx.lineTo(s[1].x, s[1].y); return s; };
  // a polyline (open), clipped piece by piece
  const line = (ctx, pts) => { let pen = false; for (let i = 0; i + 1 < pts.length; i++) { const s = cseg(pts[i], pts[i + 1]); if (!s) { pen = false; continue; } if (!pen) ctx.moveTo(s[0].x, s[0].y); ctx.lineTo(s[1].x, s[1].y); pen = true; } };
  const horizonY = () => { const q = toCam([cam.x + Math.sin(yaw) * 1e6, cam.y, cam.z + Math.cos(yaw) * 1e6]); return H / 2 - f * q[1] / q[2]; };
  const dirPt = (d) => { const q = toCam([cam.x + d[0] * 1e6, cam.y + d[1] * 1e6, cam.z + d[2] * 1e6]); return q[2] > 0 ? scr(q) : null; };
  const dist = (p) => Math.hypot(p[0] - cam.x, p[1] - cam.y, p[2] - cam.z);
  return { cam, f, toCam, P, poly, seg, line, proj, horizonY, dirPt, dist, yaw, pitch };
}
// a local frame (a building turned by `rot` about the vertical through `piv`): the same API as view3, points given in local coordinates.
// local +z points along world bearing rot (yaw convention), local +x along (cos rot, −sin rot).
export function toWorldFn(rot, piv) { const c = Math.cos(rot), s = Math.sin(rot); return (p) => { const dx = p[0] - piv[0], dz = p[2] - piv[2]; return [piv[0] + dx * c + dz * s, p[1], piv[2] - dx * s + dz * c]; }; }
export function toLocalFn(rot, piv) { const c = Math.cos(rot), s = Math.sin(rot); return (p) => { const dx = p[0] - piv[0], dz = p[2] - piv[2]; return [piv[0] + dx * c - dz * s, p[1], piv[2] + dx * s + dz * c]; }; }
export function localView(V, rot, piv) {
  const w = toWorldFn(rot, piv), lc = toLocalFn(rot, piv)([V.cam.x, V.cam.y, V.cam.z]);
  return { ...V, cam: { ...V.cam, x: lc[0], y: lc[1], z: lc[2], yaw: (V.cam.yaw || 0) - rot }, yaw: V.yaw - rot, P: (p) => V.P(w(p)), toCam: (p) => V.toCam(w(p)), poly: (ctx, pts, b) => V.poly(ctx, pts.map(w), b), seg: (ctx, a, b) => V.seg(ctx, w(a), w(b)), line: (ctx, pts) => V.line(ctx, pts.map(w)), proj: (pts) => V.proj(pts.map(w)), dist: (p) => V.dist(w(p)), world: w };
}
// a standing thing at ground point p (feet), h metres tall → screen anchor + scale for figure()/robot() (s = 1 ↔ 185 px ↔ 1.75 m)
export function sprite(V, p, h = 1.75) {
  const s = V.P(p); if (!(s.z > .15)) return { vis: false };
  return { x: s.x, y: s.y, k: s.k, z: s.z, s: s.k * h / 185, vis: true };
}
// affine frame for a vertical plane through p facing the camera direction (billboard) in local units per metre (upm), or along an axis
export function wallFrame(V, o, ux, vy, upm) {   // o origin [x,y,z], ux unit vector along u (right), vy unit vector along v (down)
  const a = V.P(o), b = V.P([o[0] + ux[0], o[1] + ux[1], o[2] + ux[2]]), c = V.P([o[0] + vy[0], o[1] + vy[1], o[2] + vy[2]]);
  if (!(a.z > .1 && b.z > .1 && c.z > .1)) return null;
  return [(b.x - a.x) / upm, (b.y - a.y) / upm, (c.x - a.x) / upm, (c.y - a.y) / upm, a.x, a.y];
}

// ---------------------------------------------------------------- camera keys
// camEase: rest-to-rest keys (velocity 0 at every key), sine-S by default; a key may carry e: 'q' (quart in-out). Keys [t, {x,y,z,yaw,pitch,f}].
// Height (y) is interpolated in log space when both ends are above 2 m and differ by more than 2× (cranes from the road into the sky).
export function camEase(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = K[i][1], b = K[i + 1][1], mode = K[i + 1][2], ef = (mode === 'q' ? qio : sineS), u = ef((t - K[i][0]) / (K[i + 1][0] - K[i][0])), out = {};
  for (const j of Object.keys(a)) {
    const va = a[j], vb = b[j] ?? va;
    if (j === 'y' && va > .3 && vb > .3 && Math.max(va, vb) / Math.min(va, vb) > 2) out[j] = Math.exp(mix(Math.log(va), Math.log(vb), u));
    else out[j] = va + (vb - va) * u;
  }
  // 'log': approach in log distance (fast while far, very slow near the target: no rush onto a wall);
  // 'logout': the mirror image, leave a near subject slowly and gain speed with distance (a crane up from a close figure)
  if (mode === 'log' || mode === 'logout') {
    const D = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z), k = Math.log(Math.max(1.01, D / .6));
    const g = mode === 'log' ? 1 - (Math.exp(-k * u) - Math.exp(-k)) / (1 - Math.exp(-k)) : (Math.exp(k * u) - 1) / (Math.exp(k) - 1);
    for (const j of ['x', 'y', 'z']) out[j] = a[j] + (b[j] - a[j]) * g;
  }
  return out;
}
// the hold drift: a camera never stands still (1–2 % push equivalent, 8–25 px/s)
export function holdDrift(t, seed = 1, amt = 1) { return { dx: drift(t * .5, .05 * amt, seed), dy: drift(t * .45, .03 * amt, seed + 3), dyaw: drift(t * .4, .0016 * amt, seed + 5), dpitch: drift(t * .35, .001 * amt, seed + 7) }; }
export function withDrift(c, t, seed = 1, amt = 1) { const d = holdDrift(t, seed, amt); return { ...c, x: c.x + d.dx, y: c.y + d.dy, yaw: (c.yaw || 0) + d.dyaw, pitch: (c.pitch || 0) + d.dpitch }; }

// ---------------------------------------------------------------- the trace (die Spur)
// A fine glowing line with small joint ticks; warm at human hands, cold when it flows away (col 0 warm … 1 cold).
// trace(ctx, pts (screen [x,y] list), u 0..1 (how much is drawn), o { col, w, ticks: [fractions], head, a, from })
export function trace(ctx, pts, u, o = {}) {
  if (u <= 0 || pts.length < 2) return null;
  const col = o.col || 0, core = mixHex(PAL.traceWarm, PAL.traceColdCore, col), glowC = mixHex(PAL.traceGlow, PAL.traceCold, col), w = o.w || 3, a = o.a ?? 1;
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1], u0 = (o.from || 0) * tot, u1 = clamp(u) * tot;
  const at = (s) => { let i = 1; while (i < L.length - 1 && L[i] < s) i++; const k = (s - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return [mix(pts[i - 1][0], pts[i][0], k), mix(pts[i - 1][1], pts[i][1], k)]; };
  const path = () => { ctx.beginPath(); const p0 = at(u0); ctx.moveTo(p0[0], p0[1]); for (let i = 1; i < pts.length; i++) if (L[i] > u0 && L[i] < u1) ctx.lineTo(pts[i][0], pts[i][1]); const pe = at(u1); ctx.lineTo(pe[0], pe[1]); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'source-over';
  path(); ctx.strokeStyle = rgba(glowC, .22 * a); ctx.lineWidth = w * 5; ctx.stroke();
  path(); ctx.strokeStyle = rgba(glowC, .55 * a); ctx.lineWidth = w * 2.2; ctx.stroke();
  path(); ctx.strokeStyle = rgba(core, a); ctx.lineWidth = w; ctx.stroke();
  // joint ticks: short cross strokes at given fractions, appear when the line passes
  for (const f of o.ticks || []) {
    const s = f * tot; if (s > u1 || s < u0) continue;
    const p = at(s), q = at(Math.min(tot, s + 2)), ang = Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2, r = w * 3.2;
    ctx.beginPath(); ctx.moveTo(p[0] - Math.cos(ang) * r, p[1] - Math.sin(ang) * r); ctx.lineTo(p[0] + Math.cos(ang) * r, p[1] + Math.sin(ang) * r);
    ctx.strokeStyle = rgba(core, .9 * a); ctx.lineWidth = Math.max(1, w * .6); ctx.stroke();
    ctx.beginPath(); ctx.arc(p[0], p[1], w * 1.1, 0, 7); ctx.fillStyle = rgba(core, a); ctx.fill();
  }
  // the head: a small hot point while the line is still being written
  const pe = at(u1);
  if (o.head !== false && u < 1) {
    const g = ctx.createRadialGradient(pe[0], pe[1], 0, pe[0], pe[1], w * 9);
    g.addColorStop(0, rgba(core, .95 * a)); g.addColorStop(.3, rgba(glowC, .45 * a)); g.addColorStop(1, rgba(glowC, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pe[0], pe[1], w * 9, 0, 7); ctx.fill();
  }
  ctx.restore();
  return pe;
}
// a world polyline as a trace: project, then trace()
export function trace3(ctx, V, pts3, u, o = {}) {
  const S = []; for (const p of pts3) { const s = V.P(p); if (s.z > .2 && isFinite(s.x)) S.push([s.x, s.y]); }
  return trace(ctx, S, u, o);
}

// ---------------------------------------------------------------- text written by the trace (numbers, labels, quotes)
// Screen space, never moves while it is read. The trace runs along the baseline (left → right, `dur` s from t0) and leaves the letters
// behind it (a mask, never a fade); the source line (Inter caps) is revealed the same way 0.35 s later. Text stays until t1, then the
// mask closes from the left (0.5 s, expo-in).
export function traceWrite(ctx, t, { text: s, x, y, size = 64, font = 'Instrument Serif', col = PAL.ink, t0, t1 = 1e9, dur, source, srcSize = 17, srcCol = null, align = 'left', shadow = null, warm = 0 }) {
  if (t < t0 || t > t1 + .6) return;
  ctx.save();
  ctx.font = `400 ${size}px "${font}"`; const w = ctx.measureText(s).width; const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  const d = dur ?? clamp(s.length / 14, .5, 1.6), u = expoOut(lin(t0, t0 + d, t) * .999 + 1e-4), out = expoIn(lin(t1, t1 + .5, t));
  const xa = x0 - 10 + (w + 20) * out, xb = x0 - 10 + (w + 30) * u;
  ctx.save(); ctx.beginPath(); ctx.rect(xa, y - size * 1.1, Math.max(0, xb - xa), size * 1.5); ctx.clip();
  if (shadow) { ctx.shadowColor = shadow; ctx.shadowBlur = size * .35; }
  text(ctx, s, x0, y, { size, font, color: col, align: 'left' });
  ctx.restore();
  // the baseline trace: it runs ahead of the letters and then draws itself away into the end of the word
  // the baseline trace runs ahead of the letters, then its tail catches up with its head and it is gone (0.45 s after the word)
  const tail = lin(t0 + d * .6, t0 + d + .45, t);
  if (tail < 1 && out <= 0) trace(ctx, [[x0 - 10, y + size * .16], [x0 + w + 24, y + size * .16]], u, { from: Math.max(0, u - .4, tail), w: Math.max(1.6, size * .028), col: warm });
  if (source) {
    ctx.font = `600 ${srcSize}px "Inter"`; const sw = ctx.measureText(source.toUpperCase()).width + source.length * 3;
    const sx = align === 'center' ? x - sw / 2 : align === 'right' ? x - sw : x;
    const us = expoOut(lin(t0 + .35, t0 + .35 + d * .8, t)), so = expoIn(lin(t1, t1 + .5, t));
    ctx.save(); ctx.beginPath(); ctx.rect(sx - 4 + (sw + 8) * so, y + size * .3, (sw + 8) * (us - so), srcSize * 2.2); ctx.clip();
    text(ctx, source.toUpperCase(), sx, y + size * .3 + srcSize * 1.4, { size: srcSize, weight: 600, color: srcCol || rgba(col, .75), spacing: 3 });
    ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- footage (ORIGINAL FOOTAGE)
// Frames are extracted once (tools/clips_f10.sh) to ROOT/clips/<slot>/f00001.jpg … at 30 fps, already cropped against logos and
// overlays. A slot plays from film time t0 on; frame k = floor((t − t0)·30) + 1, held on the last frame.
export const SLOTS = new Map(); const FRAMES = new Map();
export function footage(id, t0, t1) { SLOTS.set(id + '@' + t0.toFixed(3), { id, t0, t1 }); return { id, t0, t1 }; }
const fpath = (id, k) => `${ROOT}clips/${id}/f${String(k).padStart(5, '0')}.jpg`;
const nFrames = new Map();
function frameFile(id, t, t0) {
  if (!nFrames.has(id)) { try { nFrames.set(id, fs.readdirSync(`${ROOT}clips/${id}`).filter((f) => f.endsWith('.jpg')).length); } catch { nFrames.set(id, 0); } }
  const n = nFrames.get(id); if (!n) return null;
  return fpath(id, Math.min(n, Math.max(1, Math.floor((t - t0) * 30 + 1e-6) + 1)));
}
export async function prepareFootage(t) {
  for (const s of SLOTS.values()) {
    if (t < s.t0 - .05 || t > s.t1 + .05) continue;
    const f = frameFile(s.id, t, s.t0); if (!f || FRAMES.has(f) || !fs.existsSync(f)) continue;
    if (FRAMES.size > 6) FRAMES.delete(FRAMES.keys().next().value);
    FRAMES.set(f, await loadImage(fs.readFileSync(f)));
  }
}
// draws the slot full frame (or a grey placeholder card while the frames are missing)
export function clipSlot(ctx, t, slot, { place, date, desc } = {}) {
  const f = frameFile(slot.id, t, slot.t0), im = f && FRAMES.get(f);
  if (im) ctx.drawImage(im, 0, 0, W, H);
  else {
    ctx.fillStyle = '#9a968e'; ctx.fillRect(0, 0, W, H);
    text(ctx, `CLIP SLOT ${slot.id}`, W / 2, H / 2 - 30, { size: 64, font: 'Instrument Serif', color: PAL.paper, align: 'center' });
    text(ctx, `${(slot.t1 - slot.t0).toFixed(2)} s · ${desc || ''}`.toUpperCase(), W / 2, H / 2 + 30, { size: 20, weight: 600, color: PAL.paper, align: 'center', spacing: 4 });
  }
  if (place) lowerThird(ctx, t, { place, date, t0: slot.t0 });
}
// lower third on footage: place · date in Inter caps on a small paper tag, plus ORIGINAL FOOTAGE (60 %); above y 900 (subtitles below)
export function lowerThird(ctx, t, { place, date, t0, x = 104, y = 838 }) {
  const u = expoOut(lin(t0 + .15, t0 + .75, t)); if (u <= 0) return;
  const s1 = [place, date].filter(Boolean).join(' · ').toUpperCase();
  ctx.save(); ctx.font = '600 24px "Inter"'; const w1 = ctx.measureText(s1).width + s1.length * 3.2 + 36;
  ctx.beginPath(); ctx.rect(x, y - 6, w1 * u, 92); ctx.clip();
  ctx.fillStyle = rgba(PAL.paper, .92); ctx.fillRect(x, y, w1, 44);
  ctx.fillStyle = rgba(PAL.traceGlow, 1); ctx.fillRect(x, y, 5, 44);
  text(ctx, s1, x + 20, y + 31, { size: 24, weight: 600, color: PAL.ink, spacing: 3.2 });
  ctx.fillStyle = rgba('#2b2622', .45); ctx.fillRect(x, y + 50, 196, 26);
  text(ctx, 'ORIGINAL FOOTAGE', x + 10, y + 68, { size: 14, weight: 600, color: rgba(PAL.paper, .9), spacing: 3 });
  ctx.restore();
}

// ---------------------------------------------------------------- chunk handoffs (MOTION.md §10)
// At each boundary both builders draw the same frame: the outgoing chunk ends in `cam` (+ the named state), the incoming chunk starts there.
// Times are resolved from the words at build time (handoff(T, key)). c01 → c02 is fixed by c01 (sc01.mjs exports HALL_WIDE_CAM, the last frame's camera).
export const HAND = {
  'c01>c02': { at: ['01a', 'China has announced'], kind: 'plan sequence in the drawn hall', note: 'wide hall, 12 stations, robots lifting cups; same camera (HALL_WIDE_CAM), cup in the middle' },
  'c02>c03': { at: ['01b'], kind: 'drive', note: 'the book closes → back out through the living-room window into the valley (start 124.6)' },
  'c03>c04': { at: ['02a'], kind: 'drive', note: 'your hand turns the board of the signpost towards the house → drive up the road' },
  'c04>c05': { at: ['02b', 'Now imagine'], kind: 'plan sequence', note: 'pan one station further in the hall, you stand there' },
  'c05>c06': { at: ['02c'], kind: 'transformation', note: 'the grooves in the clay become the contour lines of the far hill' },
  'c06>c07': { at: ['03a'], kind: 'transformation', note: 'the cutaway closes, the horizon line stays → blue hour' },
  'c07>c08': { at: ['03b', 'So picture the training'], kind: 'drive', note: 'a warm light on a grower’s hand → the trace runs down the valley into the hall gate' },
  'c08>c09': { at: ['03c', 'Keeping people'], kind: 'pan', note: 'the western thread of light → pan west' },
  'c09>c10': { at: ['03d', 'Built to be repaired'], kind: 'drive', note: 'the shared robot rolls into the CUMA shed' },
  'c10>c11': { at: ['03e', 'And the hands themselves'], kind: 'plan sequence', note: 'the camera drives on along the road with the windows to the workshops' },
  'c11>c12': { at: ['04a', 'So do we want'], kind: 'drive', note: 'thumb on the switch → drive out of the living-room window into the valley' },
};
export const handoff = (T, key) => { const h = HAND[key]; return { ...h, t: T.S(h.at[0], h.at[1]) }; };
