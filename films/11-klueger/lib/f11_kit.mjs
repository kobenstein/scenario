// Film 11 · "How Superintelligence Will Make You Smarter" · THE KIT (lead, c01). One world for the whole film: the GYM OF LIGHT.
// Every export is a pure function of its arguments (t in seconds): no state between frames, deterministic prng only.
//
// THE WORLD (MOTION.md §1): one old timber hall in warm afternoon light (an atelier / school gym, never neon, never a gaming look).
// It is a real 3D space in metres, seen through ONE camera model, so every move is a true camera move (dolly, crane, pan, tilt)
// and every place of the film is a spot in this hall: the window wall (left, x = -11), the mirror wall (right, x = +11), the
// back wall with the blackboard, the city map and the round window (z = 40), the wooden floor with the Go grid inlaid like a court
// marking (right half, a few steps behind your place at the mirror, z 18.4…22.9), the exam desks (middle), the dumbbell rack along the mirror.
//   x right (-11 … 11), y up (0 floor … 10 ceiling), z into the hall (entrance -4 … back wall 40).
//
// CAMERA
//   cam = { x, y, z, yaw, pitch, f }   position in metres, yaw + = turn right, pitch + = look up (radians), f = focal px (1700 ≈ 59° hfov)
//   const V = view3(cam)  → { P(p) → {x, y, z, k} screen point (k = px per metre at that depth; z = depth, ≤ 0 = behind),
//                             poly(ctx, pts3) path of a 3D polygon clipped at the near plane (returns false if fully behind),
//                             line(ctx, a, b) path segment (clipped), seg(ctx, a, b) the same but adds to the current path,
//                             cam, f }
//   camPath(t, keys)  Catmull-Rom through timed keys [[t, {x, y, z, yaw, pitch, f}], …] (velocity continuous, ends held)
//   camEase(t, keys)  the RUHE version: every key a soft stop (move – hold – move); c01 uses it
//   keysEase(keys, ease) helper not needed: keys carry their own timing. Keep moves slow (MOTION.md §5: ≤ 0.6 m/s dolly, ≤ 6°/s pan).
//
// THE HALL
//   hall(ctx, t, V, o)   draws the whole room behind the actors (walls, windows + sky, back wall with board/map/oculus, ceiling trusses
//                        and pendant lamps, floor planks + Go grid + sun patches, light shafts, dust). ~60–110 ms.
//     o: { board(ctx, B) chalk content drawn in board units (B = { w: 850, h: 360 } cm, origin top-left; called inside the board),
//          map(ctx, M) content of the pinned city map (M = { w, h } in cm; default: the kit's city map),
//          mirror(ctx, V, M) reflections: draw mirrored actors with mirrorPt(p) (M = mirror quad), called clipped to the mirror,
//          go(ctx, V, G) extra on the Go grid (stones, the line) in floor metres (G = GO), dust: 1, shafts: 1, warm: 0…1 (evening),
//          lamps: 1 (pendant glow), sky: { top, low } window sky override, outside(ctx, V) draws what is outside the windows (city later) }
//   HALL, WINDOWS, BOARD, MAP, MIRROR, GO, RACK, SUN   geometry (metres) for scenes to place things relative to the room.
//   mirrorPt(p)   the reflection of a world point in the mirror wall (x → 2·11 − x): project it with V.P and draw the actor flipped.
//   floorShadow(ctx, V, p, rx, rz, a)  a soft contact shadow ellipse on the floor at p (metres).
//   sprite(V, p, h)  screen anchor of a billboard standing at world point p (feet) with height h metres → { x, y, k, z, vis }.
//
// OBJECTS (2D drawings in local units placed with sprite(); units are cm unless noted)
//   (see the second half of this file: machine, dumbbell, athlete, desk, students, chalk, goStone, …)
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift } from '../engine.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- palette (MOTION.md §3)
export const PAL = {
  plaster: '#dcc6a2', plasterLit: '#ecdcbc', plasterShade: '#b49874', wainscot: '#9c6b43', wainscotDark: '#7a5033',
  floor: '#c99a62', floorLit: '#e7bd82', floorDark: '#9d6c41', plank: '#7e5534', court: '#6b4528',
  ceiling: '#6e4c34', beam: '#5a3c28', beamLit: '#8a6244',
  sky: '#fbeed4', skyLow: '#f6dcb4', mullion: '#5b3f2c', sun: '#fff1d6', sunWarm: '#ffd9a0', shaft: '#ffe7bf',
  slate: '#34403a', slateDark: '#283330', chalk: '#efe9da', chalkDim: '#cfc9b9', frame: '#8a5d3b',
  paper: '#f3ead6', paperShade: '#d9cba9', ink: '#3a2a22', inkSoft: '#6b5442',
  mirror: '#d9dcd6', mirrorDeep: '#b9bdb6', brass: '#c9a25a', brassLit: '#f1d491', brassDark: '#7a5a2a',
  core: '#d6ecf6', coreHot: '#f6fcff', coreCool: '#9fc4d8',   // the machine's light (the one cool accent of the film)
  effort: '#ffc96a', effortHot: '#fff3d4',                      // your own effort (warm gold light in the arm / the lifted weight)
  shirt: '#3f7f8a', shirtB: '#c46a45', pants: '#2e3448', skin: ['#e6c0a0', '#c98d6a', '#9a6446', '#f0cfb4', '#7a4a32'],
};

// ---------------------------------------------------------------- camera
export function view3(cam) {
  const yaw = cam.yaw || 0, pitch = cam.pitch || 0, f = cam.f || 1700;
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const toCam = (p) => {
    const dx = p[0] - cam.x, dy = p[1] - cam.y, dz = p[2] - cam.z;
    const x1 = dx * cy - dz * sy, z1 = dx * sy + dz * cy;
    return [x1, dy * cp - z1 * sp, dy * sp + z1 * cp];
  };
  const ZN = .06;
  const scr = (q) => ({ x: W / 2 + f * q[0] / q[2], y: H / 2 - f * q[1] / q[2], z: q[2], k: f / q[2] });
  const P = (p) => { const q = toCam(p); return q[2] > ZN ? scr(q) : { x: NaN, y: NaN, z: q[2], k: 0 }; };
  // Sutherland-Hodgman against the near plane, then project
  const clipPoly = (pts) => {
    const Q = pts.map(toCam), out = [];
    for (let i = 0; i < Q.length; i++) {
      const a = Q[i], b = Q[(i + 1) % Q.length], ia = a[2] > ZN, ib = b[2] > ZN;
      if (ia) out.push(a);
      if (ia !== ib) { const u = (ZN - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, ZN]); }
    }
    return out.map(scr);
  };
  const poly = (ctx, pts, begin = true) => {
    const S = clipPoly(pts); if (S.length < 3) return false;
    if (begin) ctx.beginPath(); S.forEach((s, i) => (i ? ctx.lineTo(s.x, s.y) : ctx.moveTo(s.x, s.y))); ctx.closePath(); return S;
  };
  const clipSeg = (a, b) => {
    let A = toCam(a), B = toCam(b);
    if (A[2] <= ZN && B[2] <= ZN) return null;
    if (A[2] <= ZN) { const u = (ZN - A[2]) / (B[2] - A[2]); A = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, ZN]; }
    if (B[2] <= ZN) { const u = (ZN - B[2]) / (A[2] - B[2]); B = [B[0] + (A[0] - B[0]) * u, B[1] + (A[1] - B[1]) * u, ZN]; }
    return [scr(A), scr(B)];
  };
  const seg = (ctx, a, b) => { const s = clipSeg(a, b); if (!s) return null; ctx.moveTo(s[0].x, s[0].y); ctx.lineTo(s[1].x, s[1].y); return s; };
  const line = (ctx, a, b) => { ctx.beginPath(); return seg(ctx, a, b); };
  // a planar polyline (many points) as one path, each piece clipped
  const path = (ctx, pts, closed = false) => { for (let i = 0; i + 1 < pts.length; i++) seg(ctx, pts[i], pts[i + 1]); if (closed) seg(ctx, pts[pts.length - 1], pts[0]); };
  return { P, poly, line, seg, path, clipPoly, toCam, cam, f };
}

// Catmull-Rom through timed keys (each value an object of numbers); the velocity is continuous through the keys, ends held
export function camPath(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const k0 = K[Math.max(0, i - 1)], k1 = K[i], k2 = K[i + 1], k3 = K[Math.min(K.length - 1, i + 2)], d1 = k2[0] - k1[0], u = (t - k1[0]) / d1;
  const u2 = u * u, u3 = u2 * u, out = {};
  for (const j of Object.keys(k1[1])) {
    const v1 = k1[1][j], v2 = k2[1][j] ?? v1, v0 = k0[1][j] ?? v1, v3 = k3[1][j] ?? v2;
    const m1 = i > 0 ? (v2 - v0) / (k2[0] - k0[0]) * d1 : 0, m2 = i + 2 < K.length ? (v3 - v1) / (k3[0] - k1[0]) * d1 : 0;
    out[j] = (2 * u3 - 3 * u2 + 1) * v1 + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * v2 + (u3 - u2) * m2;
  }
  return out;
}

// RUHE camera: piecewise eased keys (move – hold – move). Every key is a rest point (velocity 0, eased in and out), so a pair of close keys is a calm
// hold with a slow drift and the moves between holds are short and soft. Prefer this to camPath for Film 11 (calm.py: holds keep the mafd median low).
const sine01 = (x) => .5 - .5 * Math.cos(Math.PI * x);
export function camEase(t, K, ease = sine01) {
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const u = ease((t - K[i][0]) / (K[i + 1][0] - K[i][0])), a = K[i][1], b = K[i + 1][1], out = {};
  for (const j of Object.keys(a)) out[j] = a[j] + ((b[j] ?? a[j]) - a[j]) * u;
  return out;
}

// ---------------------------------------------------------------- geometry of the hall (metres)
export const HALL = { x0: -11, x1: 11, h: 10, z0: -4, z1: 40, wain: 1.25 };
export const SUN = (() => { const d = [.8, -.5, .3], n = Math.hypot(...d); return d.map((v) => v / n); })();
export const WINDOWS = [3.5, 9.5, 15.5, 21.5, 27.5, 33.5].map((z, i) => ({ i, z, w: 2.6, y0: 2.1, y1: 7.0, r: 1.3 }));
export const BOARD = { x0: -7.6, x1: .9, y0: 2.05, y1: 5.65, z: HALL.z1 - .04, w: 850, h: 360 };   // w/h in cm (board units)
export const MAP = { x0: 3.2, x1: 7.6, y0: 2.3, y1: 5.5, z: HALL.z1 - .05, w: 440, h: 320 };
export const OCULUS = { x: -3.35, y: 8.0, r: 1.15 };
export const MIRROR = { x: HALL.x1 - .03, z0: 4.5, z1: 31.5, y0: .3, y1: 3.1 };
export const GO = { x0: 4.6, x1: 9.1, z0: 18.4, z1: 22.9, n: 19 };   // a 4.5 m square, 19 lines (0.25 m apart), inlaid in the floor a few steps behind your place
export const RACK = { x: 10.2, z0: 18, z1: 23 };
export const YOU = [9.0, 0, 15.0];      // where you train: in front of the mirror wall (you face +x, toward the mirror)
export const MACHINE = [8.4, 0, 15.45];  // the machine just behind you (−x, a little deeper): its arm reaches your back, its forks reach past you
export const TRUSS = [1, 7, 13, 19, 25, 31, 37];
export const mirrorPt = (p) => [2 * MIRROR.x - p[0], p[1], p[2]];

// window outline in (z, y) on the left wall: rectangle + round arch, clockwise from bottom-left
function winOutline(w, n = 10) {
  const pts = [[w.z - w.w / 2, w.y0], [w.z + w.w / 2, w.y0], [w.z + w.w / 2, w.y1]];
  for (let i = 1; i < n; i++) { const a = Math.PI * i / n; pts.push([w.z + Math.cos(a) * w.w / 2, w.y1 + Math.sin(a) * w.r]); }
  pts.push([w.z - w.w / 2, w.y1]);
  return pts;
}
// the window panes (for the sun patches: each pane casts its own patch, the mullions stay dark)
function winPanes(w) {
  const panes = [], cols = 3, rows = 4, gx = .07, z0 = w.z - w.w / 2, pw = w.w / cols, ph = (w.y1 - w.y0) / rows;
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
    const a = z0 + c * pw + gx, b = z0 + (c + 1) * pw - gx, y0 = w.y0 + r * ph + gx, y1 = w.y0 + (r + 1) * ph - gx;
    panes.push([[a, y0], [b, y0], [b, y1], [a, y1]]);
  }
  // the arch as two panes
  for (const side of [-1, 1]) {
    const p = [[w.z, w.y1 + gx]]; for (let i = 0; i <= 6; i++) { const a = side < 0 ? Math.PI / 2 + Math.PI / 2 * i / 6 : Math.PI / 2 - Math.PI / 2 * i / 6; p.push([w.z + Math.cos(a) * (w.w / 2 - gx), w.y1 + gx + Math.sin(a) * (w.r - gx)]); }
    panes.push(p);
  }
  return panes;
}
const WOUT = WINDOWS.map((w) => winOutline(w));
const WPANES = WINDOWS.map((w) => winPanes(w));
// a point (z, y) on the left wall → its sun patch on the floor
const toFloor = ([z, y]) => { const s = y / -SUN[1]; return [HALL.x0 + SUN[0] * s, 0, z + SUN[2] * s]; };
const onWall = ([z, y]) => [HALL.x0, y, z];

// deterministic decoration (planks, joints, dust)
const PLANKS = (() => { const r = prng(311), out = []; for (let x = HALL.x0; x <= HALL.x1 + 1e-6; x += .3) { const joints = []; let z = HALL.z0 + r() * 3; while (z < HALL.z1) { joints.push(z); z += 2.2 + r() * 2.8; } out.push({ x, a: .16 + .16 * r(), joints, tone: (r() - .5) * 2 }); } return out; })();
const DUST = (() => { const r = prng(97), d = []; for (let i = 0; i < 160; i++) d.push({ w: Math.floor(r() * WINDOWS.length), u: r(), v: r(), s: .15 + r() * .8, ph: r() * TAU, sp: .02 + r() * .05, sz: .6 + r() * 1.4 }); return d; })();

// ---------------------------------------------------------------- small drawing helpers
const fillPoly = (ctx, V, pts, col) => { if (V.poly(ctx, pts)) { ctx.fillStyle = col; ctx.fill(); return true; } return false; };
// a gradient across a projected polygon from screen point a to b
function gradFill(ctx, V, pts, stops, a, b) {
  const S = V.poly(ctx, pts); if (!S) return null;
  const A = a(S), B = b(S); const g = ctx.createLinearGradient(A[0], A[1], B[0], B[1]);
  for (const [o, c] of stops) g.addColorStop(o, c);
  ctx.fillStyle = g; ctx.fill(); return S;
}
const bbox = (S) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const s of S) { x0 = Math.min(x0, s.x); x1 = Math.max(x1, s.x); y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); } return { x0, y0, x1, y1 }; };
function hull(points) {   // monotone chain on screen points [x, y]
  const p = points.filter((q) => Number.isFinite(q[0])).sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = []; for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  const up = []; for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
export function floorShadow(ctx, V, p, rx = .35, rz = .25, a = .28, col = '#4a2e1c') {
  const c = V.P([p[0], .002, p[2]]); if (!(c.z > .1)) return;
  const ex = V.P([p[0] + rx, .002, p[2]]), ez = V.P([p[0], .002, p[2] + rz]);
  const rX = Math.max(1, Math.abs(ex.x - c.x)), rY = Math.max(1, Math.abs(ez.y - c.y) + rx * c.k * .05);
  const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, rX); g.addColorStop(0, rgba(col, a)); g.addColorStop(.6, rgba(col, a * .5)); g.addColorStop(1, rgba(col, 0));
  ctx.save(); ctx.translate(c.x, c.y); ctx.scale(1, rY / rX); ctx.translate(-c.x, -c.y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, rX, 0, TAU); ctx.fill(); ctx.restore();
}
export function sprite(V, p, h = 1.75) {
  const s = V.P(p); if (!(s.z > .15)) return { vis: false };
  return { x: s.x, y: s.y, k: s.k, z: s.z, s: s.k * h / 185 * 1.0, vis: true };   // s = scale for figure()/person() (185 units ≈ 1.75 m)
}
// affine frame of a vertical rectangle facing -z (back wall objects) at depth z: maps local units (u right, v down) → screen
export function wallFrame(V, x0, y1, z, upm) {   // upm = local units per metre; returns {a,b,c,d,e,f} for ctx.transform or null
  const o = V.P([x0, y1, z]), ux = V.P([x0 + 1, y1, z]), vy = V.P([x0, y1 - 1, z]);
  if (!(o.z > .1 && ux.z > .1 && vy.z > .1)) return null;
  return { a: (ux.x - o.x) / upm, b: (ux.y - o.y) / upm, c: (vy.x - o.x) / upm, d: (vy.y - o.y) / upm, e: o.x, f: o.y };
}
// the same for a horizontal floor rectangle (u along +x, v along +z), exact only near the reference point: used for small things
export function floorFrame(V, x0, z0, upm, y = .003) {
  const o = V.P([x0, y, z0]), ux = V.P([x0 + 1, y, z0]), vz = V.P([x0, y, z0 + 1]);
  if (!(o.z > .1 && ux.z > .1 && vz.z > .1)) return null;
  return { a: (ux.x - o.x) / upm, b: (ux.y - o.y) / upm, c: (vz.x - o.x) / upm, d: (vz.y - o.y) / upm, e: o.x, f: o.y };
}

// ---------------------------------------------------------------- the hall
export function hall(ctx, t, V, o = {}) {
  const { x0, x1, h, z0, z1, wain } = HALL, warm = o.warm || 0;
  ctx.save();
  ctx.fillStyle = PAL.ceiling; ctx.fillRect(0, 0, W, H);   // behind everything (never seen except through gaps)
  // --- ceiling
  gradFill(ctx, V, [[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]], [[0, '#4e3524'], [1, '#7a573c']], (S) => { const b = bbox(S); return [0, b.y0]; }, (S) => { const b = bbox(S); return [0, b.y1]; });
  // ceiling boards
  ctx.strokeStyle = rgba('#2e1e14', .35); ctx.lineWidth = 1; ctx.beginPath();
  for (let x = x0; x <= x1; x += .55) V.seg(ctx, [x, h, z0], [x, h, z1]); ctx.stroke();
  // --- back wall
  backWall(ctx, t, V, o);
  // --- side walls
  sideWall(ctx, t, V, o, -1);
  sideWall(ctx, t, V, o, 1);
  // --- floor
  floor(ctx, t, V, o);
  // --- trusses + lamps (in front of the walls, above the floor)
  trusses(ctx, t, V, o);
  // --- the light: shafts + dust
  if ((o.shafts ?? 1) > 0) shafts(ctx, t, V, o);
  // warm air: a soft haze that gathers under the roof and toward the far end (screen space, depth-free, very low contrast)
  const hz = ctx.createLinearGradient(0, 0, 0, H); hz.addColorStop(0, rgba('#ffe6c0', .07 * (o.haze ?? 1))); hz.addColorStop(.55, rgba('#ffe6c0', .025 * (o.haze ?? 1))); hz.addColorStop(1, rgba('#ffe6c0', 0));
  ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}

function backWall(ctx, t, V, o) {
  const { x0, x1, h, z1, wain } = HALL;
  gradFill(ctx, V, [[x0, 0, z1], [x1, 0, z1], [x1, h, z1], [x0, h, z1]], [[0, PAL.plasterShade], [.45, PAL.plaster], [1, '#e6d2ae']],
    (S) => { const b = bbox(S); return [0, b.y0]; }, (S) => { const b = bbox(S); return [0, b.y1]; });
  // bounce light from the sun patches on the floor warms the lower back wall
  { const c = V.P([-2, 1.2, z1 - .01]); if (c.z > .3) { const R = c.k * 9, g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, R); g.addColorStop(0, rgba('#ffe0b0', .32)); g.addColorStop(1, rgba('#ffe0b0', 0)); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(c.x - R, c.y - R, 2 * R, 2 * R); ctx.globalCompositeOperation = 'source-over'; } }
  // the oculus (round window) above the board
  const oc = [], n = 40; for (let i = 0; i < n; i++) { const a = TAU * i / n; oc.push([OCULUS.x + Math.cos(a) * OCULUS.r, OCULUS.y + Math.sin(a) * OCULUS.r, z1 - .01]); }
  const S = V.poly(ctx, oc);
  if (S) {
    const b = bbox(S), cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, R = (b.x1 - b.x0) / 2;
    const g = ctx.createRadialGradient(cx, cy - R * .2, 0, cx, cy, R); g.addColorStop(0, '#fffaf0'); g.addColorStop(1, PAL.skyLow); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = PAL.mullion; ctx.lineWidth = Math.max(1, R * .07); ctx.beginPath();
    for (let k = 0; k < 4; k++) { const a = Math.PI * k / 4; V.seg(ctx, [OCULUS.x + Math.cos(a) * OCULUS.r, OCULUS.y + Math.sin(a) * OCULUS.r, z1 - .015], [OCULUS.x - Math.cos(a) * OCULUS.r, OCULUS.y - Math.sin(a) * OCULUS.r, z1 - .015]); }
    ctx.stroke(); ctx.lineWidth = Math.max(1.5, R * .12); V.poly(ctx, oc); ctx.stroke();
    const gl = ctx.createRadialGradient(cx, cy, R * .8, cx, cy, R * 2.6); gl.addColorStop(0, rgba(PAL.sun, .35)); gl.addColorStop(1, rgba(PAL.sun, 0));
    ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.fillRect(cx - R * 2.6, cy - R * 2.6, R * 5.2, R * 5.2); ctx.globalCompositeOperation = 'source-over';
  }
  // wainscot
  gradFill(ctx, V, [[x0, 0, z1 - .02], [x1, 0, z1 - .02], [x1, wain, z1 - .02], [x0, wain, z1 - .02]], [[0, PAL.wainscotDark], [1, PAL.wainscot]], (S) => { const b = bbox(S); return [0, b.y1]; }, (S) => { const b = bbox(S); return [0, b.y0]; });
  ctx.strokeStyle = rgba('#3a2414', .4); ctx.lineWidth = 1; ctx.beginPath(); for (let x = x0 + 1.1; x < x1; x += 1.1) V.seg(ctx, [x, .08, z1 - .025], [x, wain - .08, z1 - .025]); ctx.stroke();
  ctx.strokeStyle = rgba('#f0d2a8', .5); ctx.lineWidth = 2; V.line(ctx, [x0, wain, z1 - .03], [x1, wain, z1 - .03]); ctx.stroke();
  // the blackboard (frame, slate, chalk tray) + its content
  board(ctx, t, V, o);
  // the pinned city map
  mapSheet(ctx, t, V, o);
}

function board(ctx, t, V, o) {
  const B = BOARD, fr = .12;
  fillPoly(ctx, V, [[B.x0 - fr, B.y0 - fr, B.z], [B.x1 + fr, B.y0 - fr, B.z], [B.x1 + fr, B.y1 + fr, B.z], [B.x0 - fr, B.y1 + fr, B.z]], PAL.frame);
  const S = gradFill(ctx, V, [[B.x0, B.y0, B.z - .005], [B.x1, B.y0, B.z - .005], [B.x1, B.y1, B.z - .005], [B.x0, B.y1, B.z - .005]],
    [[0, '#3c4a43'], [.6, PAL.slate], [1, PAL.slateDark]], (S) => { const b = bbox(S); return [b.x0, b.y0]; }, (S) => { const b = bbox(S); return [b.x1, b.y1]; });
  if (!S) return;
  // old chalk haze (wiped board)
  const M = wallFrame(V, B.x0, B.y1, B.z - .006, 100);
  if (M) {
    ctx.save(); V.poly(ctx, [[B.x0, B.y0, B.z - .006], [B.x1, B.y0, B.z - .006], [B.x1, B.y1, B.z - .006], [B.x0, B.y1, B.z - .006]]); ctx.clip();
    ctx.transform(M.a, M.b, M.c, M.d, M.e, M.f);
    const r = prng(5); ctx.strokeStyle = rgba(PAL.chalk, .045); ctx.lineCap = 'round';
    for (let i = 0; i < 26; i++) { const x = r() * B.w, y = r() * B.h, L = 80 + r() * 260; ctx.lineWidth = 10 + r() * 30; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + L * .5, y + (r() - .5) * 40, x + L, y + (r() - .5) * 30); ctx.stroke(); }
    if (o.board) o.board(ctx, B, t);
    ctx.restore();
  }
  // chalk tray
  fillPoly(ctx, V, [[B.x0 - .05, B.y0 - .02, B.z - .01], [B.x1 + .05, B.y0 - .02, B.z - .01], [B.x1 + .05, B.y0 - .02, B.z - .2], [B.x0 - .05, B.y0 - .02, B.z - .2]], '#a57650');
  fillPoly(ctx, V, [[B.x0 - .05, B.y0 - .02, B.z - .2], [B.x1 + .05, B.y0 - .02, B.z - .2], [B.x1 + .05, B.y0 - .1, B.z - .2], [B.x0 - .05, B.y0 - .1, B.z - .2]], '#7a5236');
}

// the city map (pinned paper): streets, blocks, a river; o.map overrides the content; o.mapFade 0..1 fades the streets (GPS story)
export function cityMap(ctx, M, t, o = {}) {
  const r = prng(o.seed || 21), fade = o.fade || 0;
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, M.w, M.h);
  // blocks
  ctx.fillStyle = rgba('#e2d3b0', 1 - fade * .7);
  for (let i = 0; i < 46; i++) { const x = r() * M.w, y = r() * M.h, w = 18 + r() * 40, hh = 14 + r() * 30; ctx.fillRect(x, y, w, hh); }
  // river
  ctx.strokeStyle = rgba('#9fb8c4', .8 * (1 - fade * .5)); ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-10, M.h * .72); ctx.bezierCurveTo(M.w * .3, M.h * .6, M.w * .5, M.h * .95, M.w + 10, M.h * .8); ctx.stroke();
  // streets: a grid bent a little + two avenues
  ctx.strokeStyle = rgba(PAL.inkSoft, .75 * (1 - fade)); ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let i = 1; i < 9; i++) { const x = i * M.w / 9 + (r() - .5) * 10; ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + (r() - .5) * 30, M.h / 2, x + (r() - .5) * 16, M.h); }
  for (let i = 1; i < 7; i++) { const y = i * M.h / 7 + (r() - .5) * 8; ctx.moveTo(0, y); ctx.quadraticCurveTo(M.w / 2, y + (r() - .5) * 24, M.w, y + (r() - .5) * 10); }
  ctx.stroke();
  ctx.strokeStyle = rgba('#b8661f', .7 * (1 - fade)); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, M.h * .15); ctx.lineTo(M.w, M.h * .55); ctx.moveTo(M.w * .2, M.h); ctx.lineTo(M.w * .65, 0); ctx.stroke();
}
function mapSheet(ctx, t, V, o) {
  const M = MAP, sh = .04;
  fillPoly(ctx, V, [[M.x0 + .05, M.y0 - .06, M.z + .01], [M.x1 + .07, M.y0 - .05, M.z + .01], [M.x1 + .06, M.y1 - .04, M.z + .01], [M.x0 + .04, M.y1 - .05, M.z + .01]], rgba('#6b4a2e', .28));
  const F = wallFrame(V, M.x0, M.y1, M.z, 100); if (!F) return;
  ctx.save(); V.poly(ctx, [[M.x0, M.y0, M.z], [M.x1, M.y0, M.z], [M.x1, M.y1, M.z], [M.x0, M.y1, M.z]]); ctx.clip();
  ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f);
  if (o.map) o.map(ctx, M, t); else cityMap(ctx, M, t, { fade: o.mapFade || 0 });
  // paper light falloff + a fold line
  const g = ctx.createLinearGradient(0, 0, M.w, M.h); g.addColorStop(0, 'rgba(255,250,240,.12)'); g.addColorStop(1, 'rgba(90,60,30,.16)'); ctx.fillStyle = g; ctx.fillRect(0, 0, M.w, M.h);
  ctx.strokeStyle = 'rgba(90,60,30,.18)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(M.w / 2, 0); ctx.lineTo(M.w / 2, M.h); ctx.moveTo(0, M.h / 2); ctx.lineTo(M.w, M.h / 2); ctx.stroke();
  ctx.restore();
  // pins
  for (const [x, y] of [[M.x0 + .12, M.y1 - .12], [M.x1 - .12, M.y1 - .12]]) { const p = V.P([x, y, M.z - .02]); if (p.z > .1) { ctx.fillStyle = '#b23a2a'; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.5, p.k * .04), 0, TAU); ctx.fill(); } }
}

function sideWall(ctx, t, V, o, side) {
  const { h, z0, z1, wain } = HALL, X = side < 0 ? HALL.x0 : HALL.x1;
  if (side < 0) {
    // window wall: in its own shadow (the sun comes through it), lit only by bounce
    gradFill(ctx, V, [[X, 0, z0], [X, 0, z1], [X, h, z1], [X, h, z0]], [[0, '#a98a68'], [1, '#c4a682']], (S) => { const b = bbox(S); return [b.x0, 0]; }, (S) => { const b = bbox(S); return [b.x1, 0]; });
    fillPoly(ctx, V, [[X + .01, 0, z0], [X + .01, 0, z1], [X + .01, wain, z1], [X + .01, wain, z0]], PAL.wainscotDark);
    for (let i = 0; i < WINDOWS.length; i++) windowOpening(ctx, t, V, o, WINDOWS[i], WOUT[i]);
  } else {
    gradFill(ctx, V, [[X, 0, z0], [X, 0, z1], [X, h, z1], [X, h, z0]], [[0, '#e3cfaa'], [1, PAL.plaster]], (S) => { const b = bbox(S); return [b.x1, 0]; }, (S) => { const b = bbox(S); return [b.x0, 0]; });
    fillPoly(ctx, V, [[X - .01, 0, z0], [X - .01, 0, z1], [X - .01, wain, z1], [X - .01, wain, z0]], PAL.wainscot);
    mirrorWall(ctx, t, V, o);
    wallBars(ctx, V);
  }
  ctx.strokeStyle = rgba('#f0d2a8', .45); ctx.lineWidth = 2; V.line(ctx, [X - side * .02, wain, z0], [X - side * .02, wain, z1]); ctx.stroke();
}
function windowOpening(ctx, t, V, o, w, out) {
  const X = HALL.x0, pts = out.map(([z, y]) => [X + .005, y, z]);
  const S = V.poly(ctx, pts); if (!S) return;
  const b = bbox(S), sk = o.sky || {};
  const g = ctx.createLinearGradient(0, b.y0, 0, b.y1); g.addColorStop(0, sk.top || '#fff8ea'); g.addColorStop(1, sk.low || PAL.skyLow); ctx.fillStyle = g; ctx.fill();
  if (o.outside) { ctx.save(); V.poly(ctx, pts); ctx.clip(); o.outside(ctx, V, w, t); ctx.restore(); }
  // deep reveal (the wall's thickness) on the far side, then the mullions
  ctx.strokeStyle = PAL.mullion; ctx.lineCap = 'butt';
  const lw = (z) => Math.max(1, V.P([X, 4, z]).k * .07);
  const pw = w.w / 3, ph = (w.y1 - w.y0) / 4, z0w = w.z - w.w / 2;
  ctx.lineWidth = lw(w.z); ctx.beginPath();
  for (let c = 1; c < 3; c++) V.seg(ctx, [X + .01, w.y0, z0w + c * pw], [X + .01, w.y1, z0w + c * pw]);
  for (let r = 1; r < 4; r++) V.seg(ctx, [X + .01, w.y0 + r * ph, z0w], [X + .01, w.y0 + r * ph, z0w + w.w]);
  V.seg(ctx, [X + .01, w.y1, z0w], [X + .01, w.y1, z0w + w.w]); V.seg(ctx, [X + .01, w.y1, w.z], [X + .01, w.y1 + w.r, w.z]);
  ctx.stroke();
  ctx.lineWidth = lw(w.z) * 1.8; V.poly(ctx, pts.map((p) => [p[0] + .01, p[1], p[2]])); ctx.stroke();
  // sill
  fillPoly(ctx, V, [[X, w.y0 - .02, z0w - .15], [X, w.y0 - .02, z0w + w.w + .15], [X + .3, w.y0 - .02, z0w + w.w + .15], [X + .3, w.y0 - .02, z0w - .15]], '#b98d62');
  // window glow onto the wall around it
  const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, R = Math.max(b.x1 - b.x0, b.y1 - b.y0);
  const gl = ctx.createRadialGradient(cx, cy, R * .2, cx, cy, R * 1.2); gl.addColorStop(0, rgba(PAL.sun, .28)); gl.addColorStop(1, rgba(PAL.sun, 0));
  ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.fillRect(cx - R * 1.2, cy - R * 1.2, R * 2.4, R * 2.4); ctx.globalCompositeOperation = 'source-over';
}
function mirrorWall(ctx, t, V, o) {
  const M = MIRROR, quad = [[M.x, M.y0, M.z0], [M.x, M.y0, M.z1], [M.x, M.y1, M.z1], [M.x, M.y1, M.z0]];
  // frame
  fillPoly(ctx, V, [[M.x + .01, M.y0 - .08, M.z0 - .08], [M.x + .01, M.y0 - .08, M.z1 + .08], [M.x + .01, M.y1 + .08, M.z1 + .08], [M.x + .01, M.y1 + .08, M.z0 - .08]], PAL.brassDark);
  const S = gradFill(ctx, V, quad, [[0, '#cfd2ca'], [.5, PAL.mirror], [1, '#c3c6bd']], (S) => { const b = bbox(S); return [b.x0, b.y0]; }, (S) => { const b = bbox(S); return [b.x1, b.y1]; });
  if (!S) return;
  ctx.save(); V.poly(ctx, quad); ctx.clip();
  // the reflected room: a warm band of the window wall (soft), seen mirrored
  mirrorRoom(ctx, t, V);
  if (o.mirror) o.mirror(ctx, V, M, t);
  // sheen
  const b = bbox(S), sh = ctx.createLinearGradient(b.x0, b.y0, b.x1, b.y1); sh.addColorStop(0, 'rgba(255,255,250,.1)'); sh.addColorStop(.5, 'rgba(255,255,250,0)'); sh.addColorStop(.8, 'rgba(255,255,250,.08)'); ctx.fillStyle = sh; ctx.fillRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  ctx.restore();
  // panel seams
  ctx.strokeStyle = rgba('#7d7a70', .55); ctx.lineWidth = 1.2; ctx.beginPath(); for (let z = M.z0 + 3; z < M.z1 - .1; z += 3) V.seg(ctx, [M.x - .005, M.y0, z], [M.x - .005, M.y1, z]); ctx.stroke();
}
// what the mirror shows of the room behind the camera side: the window wall (mirrored at x = 2·11 − (−11) = 33) — drawn simply
function mirrorRoom(ctx, t, V) {
  const X = 2 * MIRROR.x - HALL.x0, { h, z0, z1, wain } = HALL;
  fillPoly(ctx, V, [[X, 0, z0], [X, 0, z1], [X, h, z1], [X, h, z0]], '#b9a88e');
  fillPoly(ctx, V, [[X, 0, z0], [X, 0, z1], [X, wain, z1], [X, wain, z0]], '#8c7258');
  for (let i = 0; i < WINDOWS.length; i++) { const S = V.poly(ctx, WOUT[i].map(([z, y]) => [X, y, z])); if (S) { ctx.fillStyle = '#f4ead6'; ctx.fill(); } }
  // the floor seen in the mirror
  fillPoly(ctx, V, [[MIRROR.x, 0, z0], [X, 0, z0], [X, 0, z1], [MIRROR.x, 0, z1]], '#b18a5f');
}
function wallBars(ctx, V) {   // Sprossenwand on the mirror wall near the back
  const X = HALL.x1 - .12, z0 = 33, z1 = 38.4, y1 = 3.4;
  ctx.strokeStyle = '#a2734a'; ctx.lineWidth = Math.max(1, V.P([X, 1, 35]).k * .07); ctx.beginPath();
  for (let z = z0; z <= z1 + 1e-6; z += 1.08) V.seg(ctx, [X, 0, z], [X, y1, z]); ctx.stroke();
  ctx.lineWidth = Math.max(1, V.P([X, 1, 35]).k * .035); ctx.beginPath(); for (let y = .25; y <= y1; y += .3) V.seg(ctx, [X, y, z0], [X, y, z1]); ctx.stroke();
}

function floor(ctx, t, V, o) {
  const { x0, x1, z0, z1 } = HALL;
  gradFill(ctx, V, [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]], [[0, '#a8774a'], [.5, PAL.floor], [1, '#b98a57']], (S) => { const b = bbox(S); return [0, b.y1]; }, (S) => { const b = bbox(S); return [0, b.y0]; });
  // plank tones (every plank a slightly different honey), then the seams
  for (let i = 0; i + 1 < PLANKS.length; i++) {
    const P = PLANKS[i], v = P.tone;
    if (Math.abs(v) < .25) continue;
    if (V.poly(ctx, [[P.x, 0, z0], [P.x + .3, 0, z0], [P.x + .3, 0, z1], [P.x, 0, z1]])) { ctx.fillStyle = v > 0 ? rgba('#f2c48a', .09 * v) : rgba('#6a4224', -.1 * v); ctx.fill(); }
  }
  // the polished floor reflects the windows, the oculus and the lamps (mirror the points below the floor: y → −y)
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < WINDOWS.length; i++) {
    const S = V.poly(ctx, WOUT[i].map(([z, y]) => [HALL.x0 + .02, -y, z])); if (!S) continue;
    const b = bbox(S), g = ctx.createLinearGradient(0, b.y0, 0, b.y1); g.addColorStop(0, rgba('#ffe9c4', .16)); g.addColorStop(1, rgba('#ffe9c4', 0)); ctx.fillStyle = g; ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  // planks (lines along z) with their joints
  ctx.lineCap = 'butt';
  for (const P of PLANKS) {
    ctx.strokeStyle = rgba(PAL.plank, P.a); ctx.lineWidth = 1; ctx.beginPath(); V.seg(ctx, [P.x, 0, z0], [P.x, 0, z1]);
    for (const z of P.joints) V.seg(ctx, [P.x, 0, z], [P.x + .3, 0, z]);
    ctx.stroke();
  }
  // the Go grid inlaid like a court marking (darker inlay lines + star points)
  goGrid(ctx, t, V, o);
  // sun patches (each window pane casts its patch), drawn as light on the wood
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < WINDOWS.length; i++) {
    for (const pane of WPANES[i]) { if (V.poly(ctx, pane.map(toFloor))) { ctx.fillStyle = rgba('#ffd39a', .3); ctx.fill(); } }
  }
  ctx.globalCompositeOperation = 'source-over';
  // contact darkness where the floor meets the walls (soft, a few depths)
  ao(ctx, V, [HALL.x0, 0, z0], [HALL.x0, 0, z1]); ao(ctx, V, [HALL.x1, 0, z0], [HALL.x1, 0, z1]); ao(ctx, V, [HALL.x0, 0, z1], [HALL.x1, 0, z1]);
}
function ao(ctx, V, a, b, n = 10) {
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const u0 = i / n, u1 = (i + 1) / n, A = a.map((v, j) => mix(v, b[j], u0)), B = a.map((v, j) => mix(v, b[j], u1)), m = V.P(A.map((v, j) => (v + B[j]) / 2));
    if (!(m.z > .3)) continue;
    for (const [w, al] of [[.9, .05], [.4, .07], [.15, .09]]) { ctx.strokeStyle = rgba('#4a2c18', al); ctx.lineWidth = Math.max(1, m.k * w); if (V.line(ctx, A, B)) ctx.stroke(); }
  }
}
export function goGrid(ctx, t, V, o = {}) {
  const G = GO, n = G.n, step = (G.x1 - G.x0) / (n - 1);
  const kc = V.P([(G.x0 + G.x1) / 2, 0, (G.z0 + G.z1) / 2]).k || 100;
  ctx.strokeStyle = rgba(PAL.court, .55); ctx.lineWidth = clamp(kc * .012, 1, 3); ctx.beginPath();
  for (let i = 0; i < n; i++) { V.seg(ctx, [G.x0 + i * step, .002, G.z0], [G.x0 + i * step, .002, G.z1]); V.seg(ctx, [G.x0, .002, G.z0 + i * step], [G.x1, .002, G.z0 + i * step]); }
  ctx.stroke();
  ctx.strokeStyle = rgba(PAL.court, .7); ctx.lineWidth = clamp(kc * .025, 1.5, 6); V.poly(ctx, [[G.x0 - .25, .002, G.z0 - .25], [G.x1 + .25, .002, G.z0 - .25], [G.x1 + .25, .002, G.z1 + .25], [G.x0 - .25, .002, G.z1 + .25]]); ctx.stroke();
  ctx.fillStyle = rgba(PAL.court, .75);
  for (const a of [3, 9, 15]) for (const b of [3, 9, 15]) { const p = V.P([G.x0 + a * step, .002, G.z0 + b * step]); if (p.z > .1) { ctx.beginPath(); ctx.ellipse(p.x, p.y, Math.max(1, p.k * .035), Math.max(.6, p.k * .035 * Math.min(1, Math.abs(V.P([G.x0 + a * step, .002, G.z0 + b * step + .1]).y - p.y) / (p.k * .1 + 1e-6))), 0, 0, TAU); ctx.fill(); } }
  if (o.go) o.go(ctx, V, G, t);
}

function trusses(ctx, t, V, o) {
  const { x0, x1, h } = HALL, yb = 8.75;
  for (let i = TRUSS.length - 1; i >= 0; i--) {
    const z = TRUSS[i];
    // bottom chord (a beam with a lit underside)
    fillPoly(ctx, V, [[x0, yb, z - .18], [x1, yb, z - .18], [x1, yb, z + .18], [x0, yb, z + .18]], PAL.beamLit);
    fillPoly(ctx, V, [[x0, yb, z - .18], [x1, yb, z - .18], [x1, yb + .42, z - .18], [x0, yb + .42, z - .18]], PAL.beam);
    // struts to the ceiling
    ctx.strokeStyle = PAL.beam; ctx.lineWidth = Math.max(1, V.P([0, 9, z]).k * .16); ctx.beginPath();
    for (let x = x0 + 2; x < x1 - 1; x += 4) { V.seg(ctx, [x, yb + .4, z - .19], [x + 2, h, z - .19]); V.seg(ctx, [x + 4, yb + .4, z - .19], [x + 2, h, z - .19]); }
    ctx.stroke();
  }
  // pendant lamps (warm globes) on cords from trusses 2, 4, 6
  if ((o.lamps ?? 1) > 0) for (const z of [TRUSS[1], TRUSS[3], TRUSS[5]]) for (const x of [-5.5, 5.5]) {
    const top = V.P([x, 8.75, z]), bot = V.P([x, 6.4, z]); if (!(bot.z > .2)) continue;
    ctx.strokeStyle = 'rgba(40,26,18,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.lineTo(bot.x, bot.y); ctx.stroke();
    const r = Math.max(2, bot.k * .26);
    ctx.fillStyle = '#5a3c28'; ctx.beginPath(); ctx.ellipse(bot.x, bot.y - r * .55, r * .5, r * .28, 0, 0, TAU); ctx.fill();
    const g = ctx.createRadialGradient(bot.x, bot.y + r * .3, 0, bot.x, bot.y + r * .3, r); g.addColorStop(0, '#fff6e2'); g.addColorStop(1, '#ffd08a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bot.x, bot.y + r * .3, r, 0, TAU); ctx.fill();
    const gl = ctx.createRadialGradient(bot.x, bot.y, 0, bot.x, bot.y, r * 6); gl.addColorStop(0, rgba('#ffd9a0', .3 * (o.lamps ?? 1))); gl.addColorStop(1, rgba('#ffd9a0', 0));
    ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.fillRect(bot.x - r * 6, bot.y - r * 6, r * 12, r * 12); ctx.globalCompositeOperation = 'source-over';
  }
}

function shafts(ctx, t, V, o) {
  const k = o.shafts ?? 1;
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < WINDOWS.length; i++) {
    const wallPts = WOUT[i].map(onWall), flPts = WOUT[i].map(toFloor);
    const A = wallPts.map((p) => V.P(p)), B = flPts.map((p) => V.P(p));
    const vis = [...A, ...B].filter((p) => p.z > .1); if (vis.length < 6) continue;
    const Hl = hull(vis.map((p) => [p.x, p.y])); if (Hl.length < 3) continue;
    const ca = A.filter((p) => p.z > .1), cb = B.filter((p) => p.z > .1);
    const ax = ca.reduce((s, p) => s + p.x, 0) / (ca.length || 1), ay = ca.reduce((s, p) => s + p.y, 0) / (ca.length || 1);
    const bx = cb.reduce((s, p) => s + p.x, 0) / (cb.length || 1), by = cb.reduce((s, p) => s + p.y, 0) / (cb.length || 1);
    const g = ctx.createLinearGradient(ax, ay, bx || ax + 1, by || ay + 1);
    const br = .24 * k * (1 + .04 * Math.sin(t * .4 + i));
    g.addColorStop(0, rgba(PAL.shaft, br)); g.addColorStop(.7, rgba(PAL.shaft, br * .45)); g.addColorStop(1, rgba(PAL.shaft, br * .2));
    ctx.fillStyle = g; ctx.beginPath(); Hl.forEach((q, j) => (j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill();
  }
  // dust in the light (slow, a few pixels a second: "breathing", never busy)
  if ((o.dust ?? 1) > 0) {
    for (const d of DUST) {
      const w = WINDOWS[d.w], z = w.z - w.w / 2 + d.u * w.w, y = w.y0 + d.v * (w.y1 - w.y0), s = d.s * (y / -SUN[1]);
      const p = [HALL.x0 + SUN[0] * s, y + SUN[1] * s + .25 * Math.sin(t * d.sp * 6 + d.ph), z + SUN[2] * s + .2 * Math.sin(t * d.sp * 4 + d.ph * 2)];
      const q = V.P(p); if (!(q.z > .3) || q.x < -10 || q.x > W + 10 || q.y < -10 || q.y > H + 10) continue;
      const a = .35 * (o.dust ?? 1) * (.6 + .4 * Math.sin(t * .7 + d.ph));
      ctx.fillStyle = rgba('#fff4dc', a); ctx.beginPath(); ctx.arc(q.x, q.y, Math.max(.6, d.sz * Math.min(2.2, q.k * .012)), 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}

// ================================================================ OBJECTS
// All drawn in local units (cm) around an anchor; place them with sprite(V, p) → { x, y, k } and draw with
//   ctx.save(); ctx.translate(S.x, S.y); ctx.scale(S.k / 100, S.k / 100); … ; ctx.restore()      (k = px per metre)
// or call the *At(ctx, V, p, o) variants that do this for you. Profile drawings face +x (right) unless o.flip.
import { figure, POSES, life, blink } from './figure.mjs';
export { POSES, life, blink };

const brassGrad = (ctx, x0, y0, x1, y1, lit = 1) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, PAL.brassDark); g.addColorStop(.35, PAL.brass); g.addColorStop(.55, lit > .5 ? PAL.brassLit : PAL.brass); g.addColorStop(1, PAL.brassDark); return g; };
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
// 2-bone IK in a plane: shoulder (sx, sy), lengths a, b, target (tx, ty), bend +1/-1 → elbow + clamped hand
export function ik2(sx, sy, a, b, tx, ty, bend = 1) {
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy); const dm = Math.min(a + b - .01, Math.max(Math.abs(a - b) + .01, d));
  if (d < 1e-6) { dx = 1; dy = 0; d = 1; }
  const ux = dx / d, uy = dy / d, hx = sx + ux * dm, hy = sy + uy * dm, ca = (a * a + dm * dm - b * b) / (2 * a * dm), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
  return { ex: sx + (ux * ca - uy * sa * bend) * a, ey: sy + (uy * ca + ux * sa * bend) * a, hx, hy };
}

// ---------------------------------------------------------------- THE MACHINE (one instrument, two shapes)
// A tall brass instrument on a small wheeled carriage, with a glass core of cool light (its mind), a mast with a fork carriage
// (FORKLIFT shape: it lifts for you) and an articulated arm that ends in a hand of light (TRAINER shape: one hand on your back).
// Never a face, never eyes, never a robot body. Height ≈ 205 cm, origin = ground under the carriage centre, faces +x.
//   machine(ctx, t, o)   o: { fork: 0…1 (carriage height: 0 = floor, 1 = 150 cm), forkOut: 0…1 (tines out), load: fn(ctx, x, y) draws
//     what sits on the tines (the dumbbell) at its contact point, reach: [x, y] | null (hand target in local cm; null = arm folded),
//     armOut: 0…1 (fold → reach), core: 0…1 (glow), fold: [x, y] folded hand target, bend: ±1 elbow side, noHand: true (draw the hand
//     yourself with lightHand(…, out.hand, out.handAng, out.handO) after the figure it rests on), seed }  → { core, fork, hand, handAng, handO } local
//   machineAt(ctx, t, V, p, o)  the same placed at world point p (metres), returns { core: [x, y] screen, hand: [x, y] screen }
export function machine(ctx, t, o = {}) {
  const core = o.core ?? 1, br = 1 + .035 * Math.sin(t * TAU / 4.8) + .015 * Math.sin(t * 2.3);
  const fy = -mix(16, 150, clamp(o.fork ?? 0)), fo = clamp(o.forkOut ?? 1), armOut = clamp(o.armOut ?? (o.reach ? 1 : 0));
  const out = {};
  // shadow + round plinth on three castors
  ctx.fillStyle = 'rgba(60,36,20,.3)'; ctx.beginPath(); ctx.ellipse(4, 1, 62, 7, 0, 0, TAU); ctx.fill();
  for (const wx of [-34, 0, 34]) { ctx.fillStyle = '#4a3420'; ctx.beginPath(); ctx.arc(wx, -6, 6, 0, TAU); ctx.fill(); ctx.fillStyle = PAL.brassLit; ctx.beginPath(); ctx.arc(wx, -6, 1.8, 0, TAU); ctx.fill(); }
  ctx.fillStyle = brassGrad(ctx, -46, 0, 46, 0); ctx.beginPath(); ctx.ellipse(0, -14, 46, 9, 0, 0, Math.PI); ctx.lineTo(-46, -24); ctx.ellipse(0, -24, 46, 9, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAL.brassLit; ctx.beginPath(); ctx.ellipse(0, -24, 46, 9, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = brassGrad(ctx, -46, -30, 46, -18); ctx.beginPath(); ctx.ellipse(0, -24, 42, 7.4, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(PAL.brassDark, .7); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, -24, 30, 5, 0, 0, TAU); ctx.stroke();
  // the column (one slender brass post), collars, finial
  ctx.fillStyle = brassGrad(ctx, -5, 0, 5, 0); ctx.fillRect(-4.5, -204, 9, 182);
  for (const y of [-34, -76, -184]) { ctx.fillStyle = brassGrad(ctx, -8, 0, 8, 0); rr(ctx, -8, y - 3, 16, 6, 3); ctx.fill(); }
  ctx.fillStyle = brassGrad(ctx, -7, -220, 7, -205); ctx.beginPath(); ctx.arc(0, -210, 7, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-2, -216); ctx.lineTo(0, -232); ctx.lineTo(2, -216); ctx.closePath(); ctx.fill();
  // the core: a glass sphere pierced by the column, two armillary rings turning slowly (its thinking), cool light that breathes
  const cx = 0, cy = -128, R = 23;
  out.core = [cx, cy];
  const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 5.2 * br); gl.addColorStop(0, rgba(PAL.core, .4 * core)); gl.addColorStop(1, rgba(PAL.core, 0));
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, R * 5.2 * br, 0, TAU); ctx.fill(); ctx.restore();
  const ph = t * .35 + (o.seed || 0);
  const ring = (rx, ry, rot, front) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.strokeStyle = brassGrad(ctx, -rx, 0, rx, 0); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.ellipse(0, 0, rx, Math.max(.5, ry), 0, front ? 0 : Math.PI, front ? Math.PI : TAU); ctx.stroke(); ctx.restore(); };
  const ry1 = (R + 7) * Math.abs(Math.sin(ph)), ry2 = (R + 4) * Math.abs(Math.cos(ph * .8));
  ring(R + 7, ry1, .35, false); ring(R + 4, ry2, Math.PI / 2 - .2, false);
  const gg = ctx.createRadialGradient(cx - 6, cy - 7, 1, cx, cy, R); gg.addColorStop(0, mixc(PAL.coreHot, '#8a9aa0', 1 - core)); gg.addColorStop(.55, mixc(PAL.core, '#7d8a8e', 1 - core)); gg.addColorStop(1, mixc(PAL.coreCool, '#56615f', 1 - core));
  ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba('#8aa6b4', .5); ctx.fillRect(-2.5, cy - R, 5, 2 * R);   // the column seen through the glass
  ctx.strokeStyle = rgba(PAL.coreHot, .55 * core); ctx.lineWidth = 1; ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.moveTo(cx - R * .75, cy - 9 + k * 9); ctx.quadraticCurveTo(cx, cy - 13 + k * 9 + 5 * Math.sin(t * 1.1 + k * 2), cx + R * .75, cy - 9 + k * 9); } ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(cx - 8, cy - 9, 5, 2.6, -.6, 0, TAU); ctx.fill();
  ring(R + 7, ry1, .35, true); ring(R + 4, ry2, Math.PI / 2 - .2, true);
  // the fork carriage on the column front + two slender tines (folded up against the column when forkOut = 0)
  ctx.fillStyle = brassGrad(ctx, 0, fy - 22, 0, fy + 4); rr(ctx, 3, fy - 22, 13, 26, 3); ctx.fill();
  const tl = 88, ta = -Math.PI / 2 * (1 - eio(fo));
  ctx.save(); ctx.translate(15, fy); ctx.rotate(ta);
  ctx.fillStyle = rgba(PAL.brassDark, .9); ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(tl, -2.5); ctx.lineTo(tl + 3, 0); ctx.lineTo(0, 1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = brassGrad(ctx, 0, -4, 0, 3); ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(tl, -.5); ctx.lineTo(tl + 4, 2); ctx.lineTo(0, 3.5); ctx.closePath(); ctx.fill();
  ctx.restore();
  out.fork = [15 + Math.cos(ta) * tl * .6, fy + Math.sin(ta) * tl * .6 - 3];
  if (o.load) o.load(ctx, out.fork[0], out.fork[1]);
  // the arm: shoulder under the core (y = -96), two brass segments with ball joints, a hand of light at the end
  const sx = 7, sy = -98, a = 56, b = 52;
  const fold = o.fold || [sx + 33, sy + 48];   // folded: upper arm down along the column, forearm resting forward
  const tgt = o.reach ? [mix(fold[0], o.reach[0], eio(armOut)), mix(fold[1], o.reach[1], eio(armOut))] : fold;
  const J = ik2(sx, sy, a, b, tgt[0], tgt[1], o.bend ?? 1);   // +1: the elbow below the line (a supporting arm)
  ctx.lineCap = 'round';
  ctx.strokeStyle = PAL.brassDark; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(J.ex, J.ey); ctx.lineTo(J.hx, J.hy); ctx.stroke();
  ctx.strokeStyle = PAL.brass; ctx.lineWidth = 5.2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(J.ex, J.ey); ctx.lineTo(J.hx, J.hy); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,240,200,.55)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(sx, sy - 1.8); ctx.lineTo(J.ex, J.ey - 1.8); ctx.lineTo(J.hx, J.hy - 1.8); ctx.stroke();
  for (const [x, y, r] of [[sx, sy, 6.5], [J.ex, J.ey, 5.5]]) { ctx.fillStyle = brassGrad(ctx, x - r, y - r, x + r, y + r); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  const ang = Math.atan2(J.hy - J.ey, J.hx - J.ex);
  out.hand = [J.hx, J.hy]; out.handAng = ang; out.handO = { a: core * (.5 + .5 * armOut), open: armOut, s: 1.05 };
  if (!o.noHand) lightHand(ctx, t, J.hx, J.hy, ang, out.handO);   // noHand: the caller draws it later (on top of the figure it touches)
  return out;
}
const mixc = (a, b, u) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return `rgb(${m(16)},${m(8)},${m(0)})`; };
// a hand of light: a soft open palm with four fingers and a thumb, glowing cool-white, no skin, no joints drawn
export function lightHand(ctx, t, x, y, ang, o = {}) {
  const a = o.a ?? 1, open = o.open ?? 1, s = o.s ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const gl = ctx.createRadialGradient(10, 0, 0, 10, 0, 46); gl.addColorStop(0, rgba(PAL.core, .45 * a)); gl.addColorStop(1, rgba(PAL.core, 0));
  ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(10, 0, 46, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
  // palm (local: +x = toward the fingers)
  ctx.fillStyle = rgba('#eaf6fb', .92 * a); ctx.beginPath(); ctx.ellipse(6, 0, 9, 7.5, 0, 0, TAU); ctx.fill();
  const spread = .1 + .22 * open;
  for (let k = 0; k < 4; k++) { const fa = (k - 1.5) * spread, L = [11, 13, 12.5, 10][k] * (.75 + .25 * open); ctx.save(); ctx.translate(12, (k - 1.5) * 3.2); ctx.rotate(fa); rr(ctx, 0, -1.6, L, 3.3, 1.65); ctx.fill(); ctx.restore(); }
  ctx.save(); ctx.translate(5, -6); ctx.rotate(-.9 - .3 * open); rr(ctx, 0, -1.7, 9, 3.4, 1.7); ctx.fill(); ctx.restore();
  ctx.restore();
}

// ---------------------------------------------------------------- THE DUMBBELL OF LIGHT (the thought)
// Seen end-on in profile scenes (its bar points into the picture): a disc of warm glass with a brass rim and hub, d ≈ 30 cm.
//   dumbbell(ctx, t, x, y, o)  o: { r: 15 (radius, local units), glow: 0…1 (your effort: warmer + brighter), dim: 0…1 (unused: dust-grey),
//     side: 0 = end-on disc | 1 = seen from the side (bar + two discs, for racks and close-ups), ang }
export function dumbbell(ctx, t, x, y, o = {}) {
  const r = o.r ?? 15, glow = clamp(o.glow ?? .3), dim = clamp(o.dim ?? 0), side = o.side ?? 0;
  ctx.save(); ctx.translate(x, y); if (o.ang) ctx.rotate(o.ang);
  const hot = mixc(PAL.effortHot, '#cdbfa6', dim), mid = mixc(PAL.effort, '#a8977a', dim), edge = mixc('#c9852e', '#7d6a52', dim);
  const discAt = (dx, rx, ry) => {
    if (glow > .02) { const gl = ctx.createRadialGradient(dx, 0, 0, dx, 0, r * (2.2 + 2.8 * glow)); gl.addColorStop(0, rgba(PAL.effort, .5 * glow)); gl.addColorStop(1, rgba(PAL.effort, 0)); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(dx, 0, r * (2.2 + 2.8 * glow), 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
    const g = ctx.createRadialGradient(dx - rx * .25, -ry * .3, 0, dx, 0, Math.max(rx, ry)); g.addColorStop(0, hot); g.addColorStop(.6, mid); g.addColorStop(1, edge);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(dx, 0, rx, ry, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = brassGrad(ctx, dx - rx, -ry, dx + rx, ry); ctx.lineWidth = Math.max(1, r * .13); ctx.beginPath(); ctx.ellipse(dx, 0, rx, ry, 0, 0, TAU); ctx.stroke();
    // facets: concentric rings of the glass (engraved), turning very slowly
    ctx.strokeStyle = rgba('#fff8e8', .35 + .3 * glow); ctx.lineWidth = Math.max(.6, r * .04); ctx.beginPath(); ctx.ellipse(dx, 0, rx * .62, ry * .62, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba('#8a5a20', .25); ctx.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + t * .05; ctx.moveTo(dx + Math.cos(a) * rx * .3, Math.sin(a) * ry * .3); ctx.lineTo(dx + Math.cos(a) * rx * .9, Math.sin(a) * ry * .9); } ctx.stroke();
    ctx.fillStyle = brassGrad(ctx, dx - rx * .25, -ry * .25, dx + rx * .25, ry * .25); ctx.beginPath(); ctx.ellipse(dx, 0, rx * .22, ry * .22, 0, 0, TAU); ctx.fill();
  };
  if (side < .5) discAt(0, r, r);
  else {   // side view: bar + two discs seen nearly edge-on
    ctx.fillStyle = brassGrad(ctx, 0, -r * .12, 0, r * .12); ctx.fillRect(-r * 1.25, -r * .1, r * 2.5, r * .2);
    for (const dx of [-r * 1.1, r * 1.1]) discAt(dx, r * .3, r);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- YOU (and the other people): Film 4/5 person, gym dress, bare arms
// athlete(ctx, x, y, s, pose, o) = figure() with a sports shirt (short sleeves, o.dress.sleeve) and o.arm = muscle (0.75 thin … 1.45 strong).
// Returns figure()'s handle { hand(i), arm(i) → {s, e, h, ang}, head, back, shoulder, feetY } in screen px.
export const DRESS_YOU = { coat: PAL.shirt, pants: PAL.pants, shoes: '#2a221c', skin: PAL.skin[1], hair: '#2a1a14', sleeve: 'short' };
export function athlete(ctx, x, y, s, pose = {}, o = {}) {
  return figure(ctx, x, y, s, pose, { t: o.t, seed: o.seed ?? 11, dress: { ...DRESS_YOU, ...(o.dress || {}) }, arm: o.arm ?? 1, light: o.light ?? { x: x - 900, y: y - 600, col: '#fff1d6', a: .45 },
    rim: o.rim ?? '#fff1d6', rimSide: o.rimSide ?? -1, rimW: o.rimW ?? Math.max(1, s), flip: o.flip, prop: o.prop, part: o.part, shadow: o.shadow, shadeA: o.shadeA, shadeCol: o.shadeCol, hatch: o.hatch });
}
// poses for the gym (angles like POSES: 0 = straight down, + = forward)
export const GYM = {
  curlDown: { sh: [.12, .1], el: [.18, .3], hands: ['fist', 'relaxed'] },
  curlUp: { sh: [.2, .1], el: [2.35, .3], hands: ['fist', 'relaxed'] },
  idle: { sh: [.08, .06], el: [.12, .2] },
  sitBench: { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [.3, .24], el: [.6, .7], lean: .1, head: .12 },
  write: { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [.75, .55], el: [1.1, 1.25], lean: .2, head: .3 },
  look: { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [.55, .45], el: [1.0, 1.1], lean: .1, head: .02 },
};
// curl pose between down (u = 0) and up (u = 1)
export const curl = (u) => ({ sh: [mix(.12, .2, u), .1], el: [mix(.18, 2.35, eio(clamp(u))), .3], hands: ['fist', 'relaxed'] });

// ---------------------------------------------------------------- a gym bench (Turnbank), profile, length 300 cm, seat height 32
export function bench(ctx, o = {}) {
  const L = o.L ?? 260;
  ctx.fillStyle = 'rgba(60,36,20,.25)'; ctx.beginPath(); ctx.ellipse(0, 2, L * .55, 6, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#8a5a36'; for (const x of [-L * .36, L * .36]) { ctx.beginPath(); ctx.moveTo(x - 10, 0); ctx.lineTo(x - 4, -30); ctx.lineTo(x + 4, -30); ctx.lineTo(x + 10, 0); ctx.closePath(); ctx.fill(); }
  const g = ctx.createLinearGradient(0, -38, 0, -28); g.addColorStop(0, '#e2b27c'); g.addColorStop(1, '#a8743f'); ctx.fillStyle = g; rr(ctx, -L / 2, -38, L, 9, 3); ctx.fill();
}

// ---------------------------------------------------------------- desks, students, the small machine of today
// desk3(ctx, V, p, o): a wooden school desk standing at p (metres, the floor point under the desk centre), top 1.1 × 0.6 m at 0.74 m,
//   long side along z, the student sits on its −x side facing +x. o: { sheet: 0…1 (an exam sheet on it), top: colour,
//   sheetFill(ctx, S): draws the sheet itself, clipped to it (e.g. a handoff plate for a push into the paper) } → the sheet's screen polygon
export function desk3(ctx, V, p, o = {}) {
  const [x, , z] = p, hw = .3, hl = .55, y = .74;
  const top = [[x - hw, y, z - hl], [x + hw, y, z - hl], [x + hw, y, z + hl], [x - hw, y, z + hl]];
  ctx.strokeStyle = '#6b4a30'; const k = V.P([x, .4, z]).k; if (!(k > 0)) return;
  ctx.lineWidth = Math.max(1, k * .035); ctx.beginPath();
  for (const [dx, dz] of [[-hw + .05, -hl + .05], [hw - .05, -hl + .05], [hw - .05, hl - .05], [-hw + .05, hl - .05]]) V.seg(ctx, [x + dx, 0, z + dz], [x + dx, y, z + dz]);
  ctx.stroke();
  fillPoly(ctx, V, [[x - hw, y, z - hl], [x - hw, y, z + hl], [x - hw, y - .06, z + hl], [x - hw, y - .06, z - hl]], '#8e6240');
  fillPoly(ctx, V, [[x - hw, y, z - hl], [x + hw, y, z - hl], [x + hw, y - .06, z - hl], [x - hw, y - .06, z - hl]], '#9a6b45');
  fillPoly(ctx, V, top, o.top || '#c99a66');
  if (o.sheet) {   // an exam sheet (A4) on the desk, slightly turned
    const sx = x - .02, sz = z - .12, a = .12, w2 = .105, l2 = .15;
    const q = [[-w2, -l2], [w2, -l2], [w2, l2], [-w2, l2]].map(([u, v]) => [sx + u * Math.cos(a) - v * Math.sin(a), y + .002, sz + u * Math.sin(a) + v * Math.cos(a)]);
    const S = V.poly(ctx, q);
    if (S) { if (o.sheetFill) { ctx.save(); ctx.clip(); o.sheetFill(ctx, S); ctx.restore(); } else { ctx.fillStyle = rgba(PAL.paper, o.sheet); ctx.fill(); } }
    return S;
  }
}
// the small machine of today (on a desk, ~30 cm): plinth, column, core. o: { core 0…1, dot: 0…1 (the small difference: a warm dial), dial: 0…1 (legible), t }
export function deskMachine(ctx, t, o = {}) {
  const core = o.core ?? 1, br = 1 + .04 * Math.sin(t * TAU / 4.2 + (o.seed || 0));
  ctx.fillStyle = 'rgba(60,36,20,.3)'; ctx.beginPath(); ctx.ellipse(0, 0, 9, 1.6, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = brassGrad(ctx, -8, 0, 8, 0); ctx.beginPath(); ctx.ellipse(0, -2.4, 8, 2, 0, 0, TAU); ctx.fill(); ctx.fillRect(-8, -4.4, 16, 2); ctx.fillStyle = PAL.brassLit; ctx.beginPath(); ctx.ellipse(0, -4.4, 8, 2, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = brassGrad(ctx, -1.4, 0, 1.4, 0); ctx.fillRect(-1.2, -30, 2.4, 26);
  const cy = -19, R = 5.4;
  if (core > .02) { const gl = ctx.createRadialGradient(0, cy, 0, 0, cy, R * 4.5 * br); gl.addColorStop(0, rgba(PAL.core, .42 * core)); gl.addColorStop(1, rgba(PAL.core, 0)); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, cy, R * 4.5 * br, 0, TAU); ctx.fill(); ctx.restore(); }
  const gg = ctx.createRadialGradient(-1.5, cy - 1.8, .3, 0, cy, R); gg.addColorStop(0, mixc(PAL.coreHot, '#8e979a', 1 - core)); gg.addColorStop(1, mixc(PAL.coreCool, '#5d6663', 1 - core)); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, cy, R, 0, TAU); ctx.fill();
  ctx.strokeStyle = brassGrad(ctx, -R, 0, R, 0); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, cy, R + 1.6, (R + 1.6) * Math.abs(Math.sin(t * .4 + (o.seed || 0))), .3, 0, TAU); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(-2, cy - 2.2, 1.3, .7, -.6, 0, TAU); ctx.fill();
  // the dial on the plinth front: group B's machine carries a small warm mark (the difference). Legible only at o.dial = 1
  if (o.dot) {
    ctx.fillStyle = PAL.brassDark; ctx.beginPath(); ctx.arc(4.6, -3.4, 1.9, 0, TAU); ctx.fill();
    const gw = ctx.createRadialGradient(4.6, -3.4, 0, 4.6, -3.4, 4); gw.addColorStop(0, rgba(PAL.effort, .9 * o.dot)); gw.addColorStop(1, rgba(PAL.effort, 0)); ctx.fillStyle = gw; ctx.beginPath(); ctx.arc(4.6, -3.4, 4, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(PAL.effortHot, o.dot); ctx.beginPath(); ctx.arc(4.6, -3.4, .9, 0, TAU); ctx.fill();
  }
}
// students: pre-rendered seated profile figures (writing / looking up), drawn as sprites (cheap). studentsPrepare() once, then
//   student(ctx, V, p, o) with p = the seat point on the floor (metres); o: { v: variant 0…11, pose: 'write'|'look', live: t (draw live) }
import { loadImage } from '@napi-rs/canvas';
import { canvas as mkCanvas } from '../engine.mjs';
const SPR = new Map(); const SPR_S = 1.6;   // sprite scale: 185 units ≈ 296 px tall standing
const SHIRTS = ['#3f7f8a', '#c46a45', '#e2b04a', '#6c7fb0', '#8a9a5b', '#b86a7d'];
const HAIRS = ['short', 'long', 'curly', 'short', 'bun', 'long'];
export const studentDress = (v) => ({ coat: SHIRTS[v % SHIRTS.length], pants: '#2e3448', shoes: '#2a221c', skin: PAL.skin[(v * 3) % PAL.skin.length], hair: ['#2a1a14', '#5a3a24', '#1c1420', '#7a5232'][v % 4], sleeve: 'short' });
export async function studentsPrepare() {
  if (SPR.size) return;
  const jobs = [];
  for (let v = 0; v < 12; v++) for (const pose of ['write', 'look']) {
    const [c, g] = mkCanvas(220, 360);
    figure(g, 110, 200, SPR_S, { ...(pose === 'write' ? GYM.write : GYM.look), hair: HAIRS[v % HAIRS.length] }, { t: v * 1.7, seed: v, dress: studentDress(v), light: { x: -400, y: -200, col: '#fff1d6', a: .45 }, rim: '#fff1d6', rimSide: -1, shadow: false });
    jobs.push(loadImage(c.toBuffer('image/png')).then((im) => SPR.set(`${v}:${pose}`, im)));
  }
  await Promise.all(jobs);
}
export function student(ctx, V, p, o = {}) {
  const S = sprite(V, p); if (!S.vis || S.z < .7) return null;   // a billboard this close would explode: skip it
  const hipY = S.y - 46 * S.s;   // seated: hip ~0.45 m above the floor
  if (o.live != null) return athlete(ctx, S.x, hipY, S.s, { ...(o.pose === 'look' ? GYM.look : GYM.write), hair: HAIRS[(o.v || 0) % HAIRS.length] }, { t: o.live, seed: o.v || 0, dress: studentDress(o.v || 0), arm: o.arm, rimW: Math.max(1, .7 * S.s) });
  const im = SPR.get(`${(o.v || 0) % 12}:${o.pose || 'write'}`); if (!im) return null;
  const k = S.s / SPR_S; ctx.drawImage(im, S.x - 110 * k, hipY - 200 * k, 220 * k, 360 * k);
  return { head: [S.x + 4 * S.s, hipY - 82 * S.s] };
}
// a chair (stool) under a seated student, at p
export function stool(ctx, V, p) {
  const [x, , z] = p, k = V.P([x, .3, z]).k; if (!(k > 0)) return;
  ctx.strokeStyle = '#5a3c28'; ctx.lineWidth = Math.max(1, k * .03); ctx.beginPath();
  for (const [dx, dz] of [[-.16, -.16], [.16, -.16], [.16, .16], [-.16, .16]]) V.seg(ctx, [x + dx, 0, z + dz], [x + dx, .45, z + dz]); ctx.stroke();
  fillPoly(ctx, V, [[x - .2, .45, z - .2], [x + .2, .45, z - .2], [x + .2, .45, z + .2], [x - .2, .45, z + .2]], '#a87448');
}

// ---------------------------------------------------------------- chalk on the board, labels on screen
// chalk text / lines in board units (cm). Write-on: u 0…1 reveals the text left to right (mask), never a fade.
export function chalkText(ctx, s, x, y, o = {}) {
  const size = o.size ?? 34, u = clamp(o.u ?? 1); if (u <= 0) return;
  ctx.save(); ctx.font = `${o.italic ? '' : ''}${size}px "${o.font || 'Instrument Serif'}"`; const w = ctx.measureText(s).width, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.beginPath(); ctx.rect(x0 - 4, y - size * 1.2, (w + 8) * u, size * 1.6); ctx.clip();
  ctx.fillStyle = rgba(o.col || PAL.chalk, o.a ?? .92); ctx.textAlign = 'left'; ctx.fillText(s, x0, y);
  ctx.fillStyle = rgba(PAL.slate, .35); const r = prng(s.length * 7 + 3); for (let i = 0; i < w * .5; i++) ctx.fillRect(x0 + r() * w, y - r() * size * .8, 1.6, 1.6);   // chalk grain gaps
  ctx.restore();
}
// a chalk bar: an outlined, hatched column from the baseline y up to height h (board units); u = how far it has grown
export function chalkBar(ctx, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1), hh = h * u; if (hh <= .5) return;
  const col = o.col || PAL.chalk, r = prng(o.seed || 9);
  ctx.save(); ctx.strokeStyle = rgba(col, .9); ctx.lineWidth = o.lw ?? 3.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + .8, y - hh); ctx.lineTo(x + w - .6, y - hh - .8); ctx.lineTo(x + w, y); ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = rgba(col, .55); ctx.beginPath();
  for (let d = 6; d < hh + w; d += 9) { const a = Math.max(0, d - w), b = Math.min(d, hh); if (b <= a) continue; ctx.moveTo(x + (d - a > w ? w : d - a) + (r() - .5), y - a); ctx.lineTo(x + Math.max(0, d - b) + (r() - .5), y - b); }
  ctx.stroke(); ctx.restore();
}
export function chalkLine(ctx, pts, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0 || pts.length < 2) return;
  let L = 0; const d = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(l); L += l; }
  let rem = L * u; ctx.save(); ctx.strokeStyle = rgba(o.col || PAL.chalk, o.a ?? .9); ctx.lineWidth = o.lw ?? 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && rem > 0; i++) { const q = Math.min(1, rem / d[i - 1]); ctx.lineTo(mix(pts[i - 1][0], pts[i][0], q), mix(pts[i - 1][1], pts[i][1], q)); rem -= d[i - 1]; }
  ctx.stroke(); ctx.restore();
}
// a small source / place label in screen space (Inter caps, dark warm ink with a light backing so it reads on the bright hall).
// Never in the bottom 170 px; masked in left to right, held still while it is read. u = reveal 0…1, a = 1.
export function tag(ctx, s, x, y, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return;
  ctx.save(); ctx.font = `600 ${o.size ?? 17}px Inter`; const sp = o.spacing ?? 3.5; let w = 0; for (const ch of s) w += ctx.measureText(ch).width + sp;
  const x0 = o.align === 'right' ? x - w : x, pad = 12;
  ctx.beginPath(); ctx.rect(x0 - pad, y - 26, (w + pad * 2) * u, 40); ctx.clip();
  ctx.globalAlpha = a; ctx.fillStyle = rgba(o.bg || '#f6ecd8', o.bgA ?? .82); ctx.fillRect(x0 - pad, y - 24, w + pad * 2, 34);
  ctx.fillStyle = o.col || '#5a4232'; let xx = x0; for (const ch of s) { ctx.fillText(ch, xx, y); xx += ctx.measureText(ch).width + sp; }
  ctx.restore();
}

// ---------------------------------------------------------------- Go stones (on the floor grid, metres), the line of light
// goStone(ctx, V, i, j, o): stone on intersection (i, j) of GO (0…18 each). o: { col: 'black'|'white', lift: metres above the floor (a drop),
//   glow: 0…1 (warm glow: the hook's stone that is kept), r: radius metres (.22) }
export function goPt(i, j, y = .004) { const st = (GO.x1 - GO.x0) / (GO.n - 1); return [GO.x0 + i * st, y, GO.z0 + j * st]; }
export function goStone(ctx, V, i, j, o = {}) {
  const r = o.r ?? .11, lift = o.lift ?? 0, p = goPt(i, j, .004), c = V.P([p[0], lift + .03, p[2]]); if (!(c.z > .1)) return;
  const ex = V.P([p[0] + r, lift + .03, p[2]]), ez = V.P([p[0], lift + .03, p[2] + r]);
  const rx = Math.hypot(ex.x - c.x, ex.y - c.y), ry = Math.max(rx * .18, Math.hypot(ez.x - c.x, ez.y - c.y)), th = Math.max(1, rx * .3 * Math.min(1, ry / rx + .2));
  if (lift < 2) floorShadow(ctx, V, p, r * (1 + lift * .6), r * (1 + lift * .6), .35 / (1 + lift * 2));
  const black = (o.col || 'black') === 'black';
  if (o.glow) { const gl = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, rx * 4); gl.addColorStop(0, rgba(PAL.effort, .55 * o.glow)); gl.addColorStop(1, rgba(PAL.effort, 0)); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(c.x, c.y, rx * 4, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = black ? '#1e1a18' : '#d9d4c8'; ctx.beginPath(); ctx.ellipse(c.x, c.y + th * .5, rx, ry, 0, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(c.x - rx * .3, c.y - ry * .4, 0, c.x, c.y, rx); g.addColorStop(0, black ? '#6a625c' : '#ffffff'); g.addColorStop(1, black ? '#24201d' : '#e4dfd2');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(c.x, c.y, rx, ry, 0, 0, TAU); ctx.fill();
  if (o.glow) { ctx.fillStyle = rgba(PAL.effortHot, .3 * o.glow); ctx.beginPath(); ctx.ellipse(c.x, c.y, rx * .5, ry * .5, 0, 0, TAU); ctx.fill(); }
}
// the line of light on the floor board: pts in floor metres [[x, z], …], u = drawn fraction, w = width metres
export function floorLine(ctx, V, pts, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  let L = 0; const d = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(l); L += l; }
  const P = [[pts[0][0], .01, pts[0][1]]]; let rem = L * u;
  for (let i = 1; i < pts.length && rem > 1e-6; i++) { const q = Math.min(1, rem / d[i - 1]); P.push([mix(pts[i - 1][0], pts[i][0], q), .01, mix(pts[i - 1][1], pts[i][1], q)]); rem -= d[i - 1]; }
  const k = V.P([P[0][0], 0, P[0][2]]).k || 100, col = o.col || PAL.effort, core = o.core || PAL.effortHot;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'screen';
  for (const [w, a, c] of [[.5, .12, col], [.2, .3, col], [.07, .9, core]]) { ctx.strokeStyle = rgba(c, a * (o.a ?? 1)); ctx.lineWidth = Math.max(1, k * w * (o.w ?? 1)); ctx.beginPath(); V.path(ctx, P); ctx.stroke(); }
  ctx.restore();
  const tip = V.P(P[P.length - 1]); return { tip };
}

// ---------------------------------------------------------------- THE EXAM (Turkey, c01; again in c05): three groups of desks in the hall
// Group A = the machine as it comes (it gives answers), B = the same machine with the small difference (hints, never answers: the warm
// dial), C = no machine. Students sit facing +x (we see them in profile). EXAM.desks: { x, z, g: 'A'|'B'|'C', v (look variant), row, col }
export const EXAM = (() => {
  const desks = [], groups = [['C', -8.6], ['A', -4.1], ['B', .4]];
  for (const [g, gx] of groups) for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) {
    const v = (row * 7 + col * 3 + gx * 5 | 0) & 0xffff;
    desks.push({ g, row, col, x: gx + col * 1.4, z: 14.6 + row * 2.5, v: Math.abs(v) % 12 });
  }
  return { desks, at: (g, row, col) => desks.find((d) => d.g === g && d.row === row && d.col === col) };
})();
// examHall(ctx, t, V, o): all desks + students + desk machines, far to near. o: { lamp: { A: 0…1, B: 0…1 } machine glow per group,
//   lampOf: fn(d) → 0…1 per desk (a wave), dot / dotOf(d): B's warm dial (shown even while the glass is dark), sheet: 0…1, look: fn(d) → 'write'|'look',
//   live: [desk, …] drawn live (breathing, blinking), only: fn(d) filter, machines: false hides the desk machines, after(ctx, d) draws on top of a desk }
export function examHall(ctx, t, V, o = {}) {
  const lamp = o.lamp || {}, list = EXAM.desks.filter(o.only || (() => true)).map((d) => ({ d, z: V.toCam([d.x + .3, .74, d.z])[2] })).filter((e) => e.z > -1.5).sort((a, b) => b.z - a.z);
  for (const { d } of list) {
    stool(ctx, V, [d.x, 0, d.z]);
    const live = o.live && o.live.includes(d);
    student(ctx, V, [d.x, 0, d.z], { v: d.v, pose: o.look ? o.look(d) : 'write', live: live ? t : null });
    desk3(ctx, V, [d.x + .62, 0, d.z], { sheet: o.sheet ?? 1, sheetFill: o.sheetOf ? o.sheetOf(d) : null });
    const L = d.g === 'C' ? 0 : (o.lampOf ? o.lampOf(d) : (lamp[d.g] ?? 0));
    if (d.g !== 'C' && o.machines !== false) {   // the machines stand on A and B desks all the time; lamp = their glow (0 = dark glass)
      const S = sprite(V, [d.x + .72, .74, d.z + .3]); if (S.vis && S.z > .5) { ctx.save(); ctx.translate(S.x, S.y); ctx.scale(S.k / 100, S.k / 100); deskMachine(ctx, t, { core: L, dot: d.g === 'B' ? (o.dotOf ? o.dotOf(d) : (o.dot ?? 1)) : 0, seed: d.v }); ctx.restore(); }
    }
    if (o.after) o.after(ctx, d);
  }
}
