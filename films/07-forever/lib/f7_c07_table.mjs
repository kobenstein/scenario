// Film 7 · THE TABLE · c07's COPY of lib/f7_c04_table.mjs (identical code, copied 1:1 per the brief so the table looks the same; c07 only
// uses tcam, camKeys, tableTop, beam, tablePaperCard, paperCardPrepare, windowCam, CARDS, ROW, SPOT, TB). Original header:
// Film 7 · THE TABLE (c04 builds it; c05, c07–c11 reuse it): the dark test table on the empty stage, the cold spotlight, the four cards
// lying on it, and the paper / glass plates mapped onto in-world surfaces. Pure functions of t, deterministic. Builder: c04.
//
// WORLD  centimetres. X right, Y up, Z away from the stage front (toward the screen). The table top is the plane Y = 0, a dark round
//        table of radius TB.R = 95 centred at the origin; the stage floor is Y = -75; the stage screen (640 × 360) hangs at Z = 600.
//        A card is 7 × 9.8 cm (TB.cw × TB.ch), a page 21 × 29.7 cm. Flat objects use local units with u → right, v → down (toward the
//        stage front, −Z) when the object has rot 0; rot turns it counter-clockwise as seen from above.
//
// CAMERA tcam({ x, y, z, pitch (rad, < 0 looks down; −π/2 = straight down, screen-up = +Z), yaw (rad, > 0 turns right), f 1600 })
//        → { p(X, Y, Z) → [sx, sy, k px/cm, depth] , horizon (screen y), M3(C, Ru, Dv, e) affine, flatM(X, Z, rot, unit, e, Y) affine,
//            poly(worldPts) → near-clipped screen polygon }.   An affine is [a, b, c, d, e, f] for ctx.setTransform / transform.
//        camKeys(t, K) monotone (no-overshoot) C1 path through [[t, [x, y, z, pitch, yaw]], …] (holds at both ends).
//
// THE TABLE
//   stage(ctx, t, cam, o)       the night behind the stage when the camera looks up (kit sky, the ridge, the screen on its truss, the light
//                               towers) and the stage black below the horizon. o: { screen (draws the stage screen), words 0..1 (SUSTAINABLE
//                               ABUNDANCE on it, opened by a TV line), glassT (the c03>c04 glass plate mapped on the screen) }.
//                               Cheap to skip when the camera looks down (pitch < −1.15): call it anyway, it returns early.
//   tableTop(ctx, t, cam, o)    the round table: lacquer black, engraved grain, the edge band with its cool rim, the spotlight pool.
//                               o: { spot: { x, z, r 42, a 1 }  (the pool; animate x/z/r/a to move or narrow the spotlight) }
//   beam(ctx, t, cam, o)        the cone of cold light from the lamp high above the front-left and the dust motes in it (draw last).
//                               o: { spot (same as tableTop), a 1 }
//   shadowQuad(ctx, cam, X, Z, rot, w, d, o)   a soft contact shadow of a flat object (cm), o: { lift 0..∞ cm, a 1 }
//
// THE CARDS (same four cards everywhere; fronts from CARDS; the kit draws faces II–IV, card I can be the paper card below)
//   CARDS[i] = { num, q, stamp }.  ROW = the deal: the four card centres on the table [{ X, Z, rot }] (c04 deals them there).
//   tableCard(ctx, t, cam, o)   a kit card lying on the table / lifted / tilted up toward the camera.
//                               o: { X, Z, rot, Y 0 (lift in cm), up 0..1 (tilt about its own horizontal axis: 1 = standing facing −Z),
//                                    num, side, flip, stamp, stampU, a, shadow true }   → the affine used (card px, centre origin)
//   paperCard(ctx, t, A, o)     card I drawn by this file (front, same layout as the kit) with a PAPER WINDOW: the face px rect
//                               WIN = { x 200, y 54, w 213.33, h 120 } (16:9, blank: right of the numeral, above the rule) carries the
//                               cream paper plate (handoff4 'paper') at 1/9 scale, so pushing a camera into that window until it fills
//                               the frame lands EXACTLY on the c04>c05 / c07>c08 … paper plates. A = face px (500 × 700) → screen affine.
//                               o: { num, q, stamp, stampU, plateT (time used for the plate's slow life) }
//                               Below ~1 screen px per face px it draws a cached image of itself, above that it draws vectors.
//   tablePaperCard(ctx, t, cam, o)   paperCard placed like tableCard (same options) → the face affine.
//   windowCam(o)                the camera that shows exactly the paper window of a flat card { X, Z, rot } (Y 0) → { x, y, z, pitch, yaw }:
//                               at that camera the frame IS the paper plate. Push to it (log height) to hand off; pull from it to start.
//   paperPlateAt(ctx, t, M) / glassPlateAt(ctx, t, M)   the handoff4 'paper' / 'glass' plates drawn under the affine M (plate px → screen):
//                               identical to the plates film.mjs draws when M is the identity.
//
//   paperCardPrepare(list, t) async   cache the card faces once ([{ num, q, stamp }], t = the plate time used in the cached window).
//
// HELPERS   spotAt(X, Z, spot) → 0..1 light at a table point · depthSpread(cam, at) → { ratio, off } (how much a flat object's depth
//   varies: affine is fine above ~.85, else use meshImage) · meshImage(ctx, cam, img, iw, ih, at, nu, nv) an Image laid on any world
//   surface at(u, v) → [X, Y, Z] in exact perspective (triangle mesh) · apply(ctx, M) · mulA(A, B).
//
// COST (full size): stage ~20 ms, tableTop 25–45 ms, beam < 1 ms. Every gradient in here keeps ≤ 8 colour stops (Skia shades longer
//   ones ~4× slower) and the top is not clipped (a clip mask doubles the cost of everything drawn after it) — keep it that way.
//
// Usage (c05 incoming from paper):  const wc = windowCam(ROW[1]); camera at wc for t = HI.b, then pull out (raise y, ease) while card II
//   is drawn with tablePaperCard(ctx, t, cam, { ...ROW[1], num: 2, q: CARDS[1].q }) — its window lands exactly on the plate at HI.b.
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, drift, canvas, text } from '../engine.mjs';
import { F7, sky, ease, n1 } from './f7_kit.mjs';
import { card as kitCard } from './f7_kit.mjs';
import { TSHIFT } from './handoff4.mjs';

const TAU = Math.PI * 2;
export const TB = { R: 95, floor: -75, cw: 7, ch: 9.8, f: 1600, black: '#0b0b10', lacquer: '#101016', spot: '#e8eef6', screen: { x: 0, y: 330, z: 600, w: 640, h: 360 } };
export const CARDS = [
  { num: 1, q: 'Where does the energy come from?', stamp: 'NO POWER BILL' },
  { num: 2, q: 'Where do the materials come from?', stamp: "METAL DOESN'T SCALE" },
  { num: 3, q: 'Is the planet only about carbon?', stamp: 'ONE DIAL OF NINE' },
  { num: 4, q: 'Who is it for?', stamp: 'FOR WHOM?' },
];
// where c04 deals the four cards (left to right, near the stage-front edge of the pool)
export const ROW = [{ X: -13.6, Z: -12, rot: .035 }, { X: -4.5, Z: -12.3, rot: -.02 }, { X: 4.6, Z: -11.8, rot: .028 }, { X: 13.7, Z: -12.2, rot: -.03 }];
// the lamp (on the truss, high above the front-left) and the default pool
export const LAMP = [-120, 430, -70];
export const SPOT = { x: 0, z: 2, r: 46, a: 1 };

// ================================================================ camera
export function tcam(c) {
  const x = c.x, y = c.y, z = c.z, pitch = c.pitch ?? 0, yaw = c.yaw ?? 0, f = c.f ?? TB.f;
  const cp = Math.cos(pitch), sp = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
  const fw = [sy * cp, sp, cy * cp], rt = [cy, 0, -sy], up = [-sy * sp, cp, -cy * sp];
  const toC = (X, Y, Z) => { const dx = X - x, dy = Y - y, dz = Z - z; return [dx * rt[0] + dz * rt[2], dx * up[0] + dy * up[1] + dz * up[2], dx * fw[0] + dy * fw[1] + dz * fw[2]]; };
  const p = (X, Y, Z) => { const [a, b, d] = toC(X, Y, Z), k = f / Math.max(d, 1e-3); return [W / 2 + a * k, H / 2 - b * k, k, d]; };
  // affine for a local frame at C with 3D axes Ru (one local unit right) and Dv (one local unit down), fitted over ±e units
  const M3 = (C, Ru, Dv, e = 1) => {
    const P = (s, q) => p(C[0] + Ru[0] * s + Dv[0] * q, C[1] + Ru[1] * s + Dv[1] * q, C[2] + Ru[2] * s + Dv[2] * q);
    const o = P(0, 0), u1 = P(e, 0), u0 = P(-e, 0), v1 = P(0, e), v0 = P(0, -e);
    if (Math.min(o[3], u1[3], u0[3], v1[3], v0[3]) < .6) return null;
    return [(u1[0] - u0[0]) / (2 * e), (u1[1] - u0[1]) / (2 * e), (v1[0] - v0[0]) / (2 * e), (v1[1] - v0[1]) / (2 * e), o[0], o[1]];
  };
  const flatM = (X, Z, rot = 0, unit = 1, e = 1, Y = 0) => { const c0 = Math.cos(rot), s0 = Math.sin(rot); return M3([X, Y, Z], [c0 * unit, 0, s0 * unit], [s0 * unit, 0, -c0 * unit], e); };
  // near-plane clipped projection of a closed world polygon
  const poly = (pts, near = .8) => {
    const C = pts.map(([X, Y, Z]) => toC(X, Y, Z)), out = [];
    for (let i = 0; i < C.length; i++) {
      const a = C[i], b = C[(i + 1) % C.length], ia = a[2] >= near, ib = b[2] >= near;
      if (ia) out.push(a);
      if (ia !== ib) { const q = (near - a[2]) / (b[2] - a[2]); out.push([mix(a[0], b[0], q), mix(a[1], b[1], q), near]); }
    }
    return out.map(([a, b, d]) => [W / 2 + a * f / d, H / 2 - b * f / d]);
  };
  const horizon = H / 2 + f * Math.tan(clamp(pitch, -1.5, 1.5));
  return { x, y, z, pitch, yaw, f, p, toC, M3, flatM, poly, horizon, fw, rt, up };
}
// monotone cubic (Fritsch–Carlson) per component: C1, no overshoot, holds at the ends
export function camKeys(t, K) {
  if (t <= K[0][0]) return K[0][1].slice(); if (t >= K[K.length - 1][0]) return K[K.length - 1][1].slice();
  let i = 0; while (t > K[i + 1][0]) i++;
  const n = K[0][1].length, h = K[i + 1][0] - K[i][0], u = (t - K[i][0]) / h, out = [];
  const slope = (j, d) => (K[j + 1][1][d] - K[j][1][d]) / (K[j + 1][0] - K[j][0]);
  const tan = (j, d) => {
    if (j === 0 || j === K.length - 1) return 0;   // ends held (start and stop softly)
    const s0 = slope(j - 1, d), s1 = slope(j, d); if (s0 * s1 <= 0) return 0;
    const h0 = K[j][0] - K[j - 1][0], h1 = K[j + 1][0] - K[j][0], w1 = 2 * h1 + h0, w2 = h1 + 2 * h0;
    return (w1 + w2) / (w1 / s0 + w2 / s1);
  };
  for (let d = 0; d < n; d++) {
    const p0 = K[i][1][d], p1 = K[i + 1][1][d], m0 = tan(i, d) * h, m1 = tan(i + 1, d) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return out;
}
export const apply = (ctx, A) => ctx.transform(A[0], A[1], A[2], A[3], A[4], A[5]);
export const mulA = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const fillPoly = (ctx, P) => { if (P.length < 3) return false; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); return true; };
const circleW = (cx, cz, r, n = 72, Y = 0) => { const o = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; o.push([cx + r * Math.cos(a), Y, cz + r * Math.sin(a)]); } return o; };

// ================================================================ the stage (only when the camera looks up)
const RIDGE = (() => { const r = prng(404), o = []; for (let i = 0; i <= 120; i++) o.push(18 + 26 * Math.abs(n1(i * .21 + 3)) + 10 * Math.sin(i * .37) + r() * 3); return o; })();
const LIGHTS = (() => { const r = prng(405), o = []; for (let i = 0; i < 26; i++) o.push([r(), r() * .6, .5 + r()]); return o; })();
export function stage(ctx, t, cam, o = {}) {
  const hz = cam.horizon;
  ctx.fillStyle = TB.black; ctx.fillRect(0, 0, W, H);
  if (cam.pitch < -1.15 || hz < -40) return;
  // the night above the horizon (kit sky; the stars move with the tilt)
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, Math.max(0, hz) + 2); ctx.clip();
  sky(ctx, t, { ox: 420 - cam.yaw * cam.f, oy: 150 + (hz - H / 2) * .8, ang: -.42, horizon: hz });
  // the far ridge with a few warm windows (the landscape of c01 around the stage)
  const span = W * 1.6, x0 = -W * .3 - cam.yaw * cam.f * .6;
  ctx.beginPath(); ctx.moveTo(-10, hz + 2);
  RIDGE.forEach((v, i) => ctx.lineTo(x0 + span * i / (RIDGE.length - 1), hz - v * .9));
  ctx.lineTo(W + 10, hz + 2); ctx.closePath(); ctx.fillStyle = '#14123a'; ctx.fill();
  ctx.strokeStyle = 'rgba(150,130,230,.22)'; ctx.lineWidth = 1.2; ctx.stroke();
  for (const [u, v, s] of LIGHTS) { const X = x0 + span * u, Y = hz - 4 - v * 14; ctx.fillStyle = rgba('#ffb35c', .55 + .2 * Math.sin(t * .8 + u * 30)); ctx.fillRect(X, Y, 2.2 * s, 2.2 * s); }
  ctx.restore();
  // the stage floor: lacquer black with long cool reflections of the lamps
  const fl = ctx.createLinearGradient(0, hz, 0, H); fl.addColorStop(0, '#0e0e18'); fl.addColorStop(1, TB.black);
  ctx.fillStyle = fl; ctx.fillRect(0, Math.max(0, hz), W, H);
  // truss, towers, screen (world geometry)
  const S = TB.screen, fy = TB.floor;
  const seg = (a, b, w, col) => { const A = cam.p(...a), B = cam.p(...b); if (A[3] < 1 || B[3] < 1) return; ctx.strokeStyle = col; ctx.lineWidth = Math.max(.8, w * (A[2] + B[2]) / 2); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); };
  const xl = -S.w / 2 - 34, xr = S.w / 2 + 34, yt = S.y + S.h / 2 + 40;
  seg([xl, fy, S.z + 4], [xl, yt, S.z + 4], 9, '#17163a'); seg([xr, fy, S.z + 4], [xr, yt, S.z + 4], 9, '#17163a'); seg([xl, yt, S.z + 4], [xr, yt, S.z + 4], 11, '#17163a');
  { ctx.strokeStyle = 'rgba(140,130,220,.35)'; ctx.lineWidth = 1; ctx.beginPath(); for (let X = xl; X < xr; X += 16) { const a = cam.p(X, yt + 6, S.z), b = cam.p(X + 8, yt - 6, S.z), c = cam.p(X + 16, yt + 6, S.z); if (a[3] < 1) continue; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); } ctx.stroke(); }
  for (const tx of [-S.w / 2 - 170, S.w / 2 + 170]) {
    seg([tx, fy, S.z - 20], [tx, S.y + 140, S.z - 20], 12, '#121030');
    for (let i = 0; i < 3; i++) { const L = cam.p(tx, S.y + 110 - i * 46, S.z - 26); if (L[3] < 1) continue; ctx.fillStyle = '#1c1a40'; ctx.beginPath(); ctx.arc(L[0], L[1], 11 * L[2], 0, TAU); ctx.fill(); glowSoft(ctx, L[0], L[1], 30 * L[2], .55 + .08 * Math.sin(t * 2 + i), '#cfe0f0'); ctx.fillStyle = rgba('#f4f8ff', .85); ctx.beginPath(); ctx.arc(L[0], L[1], 5 * L[2], 0, TAU); ctx.fill(); }
  }
  // stage front edge (a fine cool line far behind the table)
  { const a = cam.p(-900, fy, -120), b = cam.p(900, fy, -120); if (a[3] > 1 && b[3] > 1) { ctx.strokeStyle = rgba('#cfe6ff', .25); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  if (o.screen !== false) stageScreen(ctx, t, cam, o);
}
function convexHull(P) {
  const pts = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (pts.length < 3) return pts;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function glowSoft(ctx, x, y, r, a, col) { if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, r * .15, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
// the stage screen: dark glass (the c03>c04 glass plate lives on it) that opens into SUSTAINABLE ABUNDANCE
export function screenQuad(cam) { const S = TB.screen; return [[S.x - S.w / 2, S.y + S.h / 2, S.z], [S.x + S.w / 2, S.y + S.h / 2, S.z], [S.x + S.w / 2, S.y - S.h / 2, S.z], [S.x - S.w / 2, S.y - S.h / 2, S.z]].map((q) => cam.p(...q)); }
export function stageScreen(ctx, t, cam, o = {}) {
  const Q = screenQuad(cam); if (Q.some((q) => q[3] < 1)) return null;
  // affine plate px → screen from three corners (the screen faces the camera, so this is exact for pitch 0 and close otherwise)
  const M = [(Q[1][0] - Q[0][0]) / W, (Q[1][1] - Q[0][1]) / W, (Q[3][0] - Q[0][0]) / H, (Q[3][1] - Q[0][1]) / H, Q[0][0], Q[0][1]];
  ctx.save(); fillPoly(ctx, Q); ctx.clip();
  glassPlateAt(ctx, o.glassT ?? t, M);
  const wa = o.words ?? 0;
  if (wa > 0) {
    // the screen opens from its centre line (a TV line), the words in light behind it
    ctx.save(); apply(ctx, M);
    const hv = Math.max(4, H * ease.out(wa)); ctx.beginPath(); ctx.rect(0, H / 2 - hv / 2, W, hv); ctx.clip();
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#141a44'); g.addColorStop(1, '#0a0c26'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; const bl = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * .5); bl.addColorStop(0, rgba('#b8c8ff', .16)); bl.addColorStop(1, 'rgba(184,200,255,0)'); ctx.fillStyle = bl; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
    const sz = H * .15; for (const [s, dy] of [['SUSTAINABLE', -.08], ['ABUNDANCE', .14]]) text(ctx, s, W / 2, H * (.5 + dy) + sz * .35, { size: sz, weight: 600, color: rgba('#eef2ff', .95), align: 'center', spacing: sz * .22 });
    ctx.globalAlpha = .06; ctx.fillStyle = '#000'; for (let yy = 0; yy < H; yy += 9) ctx.fillRect(0, yy, W, 3.6); ctx.globalAlpha = 1;
    if (wa < .999) { ctx.globalCompositeOperation = 'lighter'; for (const yy of [H / 2 - hv / 2, H / 2 + hv / 2]) for (const [lw, al] of [[40, .08], [14, .25], [4, .95]]) { ctx.strokeStyle = rgba(lw < 5 ? F7.coolCore : F7.cool, al * (1 - wa * .6)); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); } }
    ctx.restore();
  }
  ctx.restore();
  // the bezel (outside the glass, so the glass alone can fill the frame) + the light the words spill
  { const S = TB.screen, m = 7, B = [[S.x - S.w / 2 - m, S.y + S.h / 2 + m, S.z], [S.x + S.w / 2 + m, S.y + S.h / 2 + m, S.z], [S.x + S.w / 2 + m, S.y - S.h / 2 - m, S.z], [S.x - S.w / 2 - m, S.y - S.h / 2 - m, S.z]].map((q) => cam.p(...q));
    ctx.strokeStyle = rgba('#cfe6ff', .35); ctx.lineWidth = Math.max(1, 2.2 * Q[0][2]); fillPoly(ctx, B); ctx.stroke(); }
  if (wa > 0) glowSoft(ctx, (Q[0][0] + Q[2][0]) / 2, (Q[0][1] + Q[2][1]) / 2, Math.abs(Q[1][0] - Q[0][0]) * .9, .08 * wa, '#b8c8ff');
  return { Q, M };
}

// ================================================================ the table top and the spotlight
const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const GRAIN = (() => { const r = prng(808), L = []; for (let z = -TB.R + 1; z < TB.R; z += .25 + Math.pow(r(), 2) * 1.6) L.push([z, r() * 10, .3 + r() * .9, .12 + .38 * Math.pow(r(), 1.5), .5 + r() * 1.2]); return L; })();
const GRANK = (() => { const r = prng(4242); return GRAIN.map(() => r()); })();
// the grooves' world points, computed once (X, Z, or null where the cut breaks)
const GPTS = GRAIN.map(([z0, ph, amp]) => { const xe = Math.sqrt(Math.max(0, TB.R * TB.R - z0 * z0)), out = [];
  for (let X = -xe; X <= xe + .01; X += Math.max(2, xe / 18)) { const Z = z0 + amp * Math.sin(X * .035 + ph) + .5 * n1(X * .06 + ph * 7) + 1.6 * n1(z0 * .05 + X * .012); out.push(n1(X * .05 + ph * 13) > .55 || X * X + Z * Z > (TB.R - .6) ** 2 ? null : [X, Z]); }
  return out; });
export function tableTop(ctx, t, cam, o = {}) {
  const sp = { ...SPOT, ...(o.spot || {}) }, R = TB.R;
  // the edge band (seen when the camera is not straight above) and the pedestal falling into the dark
  if (cam.y > 0) {
    const band = []; for (let i = 0; i <= 64; i++) { const a = Math.PI + i / 64 * Math.PI; band.push([R * Math.cos(a), 0, R * Math.sin(a)]); }
    for (let i = 64; i >= 0; i--) { const a = Math.PI + i / 64 * Math.PI; band.push([R * .99 * Math.cos(a), -4.5, R * .99 * Math.sin(a)]); }
    const P = cam.poly(band); if (fillPoly(ctx, P)) { ctx.fillStyle = '#08080d'; ctx.fill(); }
    const ped = cam.poly([[-14, -4, -10], [14, -4, -10], [14, TB.floor, -10], [-14, TB.floor, -10]]); if (fillPoly(ctx, ped)) { const g = ctx.createLinearGradient(0, ped[0][1], 0, ped[2][1]); g.addColorStop(0, '#0a0a10'); g.addColorStop(1, 'rgba(11,11,16,0)'); ctx.fillStyle = g; ctx.fill(); }
  }
  // the top
  const top = cam.poly(circleW(0, 0, R, 96));
  if (!fillPoly(ctx, top)) return;
  // (no clip: a clip mask makes every later draw ~2× slower; the pool is zero off the top, the grooves stay inside the rim)
  ctx.save(); ctx.fillStyle = TB.lacquer; ctx.fill();
  // the pool of cold light: a theatre spot (flat core, soft edge, a faint halo), exact in perspective: every 4 px screen row is a
  // horizontal gradient (4 pieces over the lit span) sampled where that row's rays meet the table
  ctx.globalCompositeOperation = 'lighter';
  const B = (d) => sp.a * (.27 * (1 - sstep(.52, 1, d)) + .055 * (1 - sstep(.9, 1.9, d)) + .05 * (1 - sstep(0, .65, d)));
  // seen from (nearly) straight above, the plane is parallel to the screen: one radial gradient under the plane's affine is exact
  // (the two ways of computing the same light hand over smoothly between pitch -1.35 and -1.5)
  const wTop = sstep(-1.35, -1.5, cam.pitch);
  // (Skia shades gradients of up to 8 stops ~4× faster than longer ones: every gradient here has 8 stops, split in pieces where needed;
  // the pieces meet exactly because 'lighter' adds their anti-aliased edges back to full)
  const stops = (g, d0, d1, k) => { for (let i = 0; i < 8; i++) { const d = d0 + (d1 - d0) * i / 7; g.addColorStop(i / 7, `rgba(214,224,240,${B(d) * k})`); } };
  if (wTop > 0) { const M = cam.flatM(sp.x, sp.z, 0, sp.r, 1); if (M) { ctx.save(); apply(ctx, M);
    const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); stops(g1, 0, 1, wTop); ctx.fillStyle = g1; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill();
    const g2 = ctx.createRadialGradient(0, 0, 1, 0, 0, 2); stops(g2, 1, 2, wTop); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(0, 0, 2, 0, TAU); ctx.arc(0, 0, 1, 0, TAU, true); ctx.fill();
    ctx.restore(); } }
  if (wTop < 1) { const [rt, up, fw] = [cam.rt, cam.up, cam.fw], NS = 32, y0 = Math.max(0, Math.floor(cam.horizon + 2)), st = 4, k = 1 - wTop;
    const at = (xs, yc) => { const xc = xs - W / 2, dx = rt[0] * xc + up[0] * yc + fw[0] * cam.f, dy = up[1] * yc + fw[1] * cam.f, dz = rt[2] * xc + up[2] * yc + fw[2] * cam.f;
      if (dy >= -1e-6) return 0; const s0 = -cam.y / dy, X = cam.x + dx * s0, Z = cam.z + dz * s0; return X * X + Z * Z > R * R ? 0 : B(Math.hypot(X - sp.x, Z - sp.z) / sp.r); };
    for (let y = y0; y < H; y += st) {
      const yc = -(y + st / 2 - H / 2);
      // where on this row the light is: coarse scan, then two 8-stop gradients over just that span
      let xa = -1, xb = -1; for (let i = 0; i <= NS; i++) if (at(i / NS * W, yc) > .0015) { if (xa < 0) xa = i; xb = i; }
      if (xa < 0) continue;
      const x0 = Math.max(0, (xa - 1) / NS * W), x1 = Math.min(W, (xb + 1) / NS * W), NP = 4;
      for (let pi = 0; pi < NP; pi++) { const u0 = Math.round(x0 + (x1 - x0) * pi / NP), u1 = Math.round(x0 + (x1 - x0) * (pi + 1) / NP); if (u1 - u0 < 1) continue;
        const g = ctx.createLinearGradient(u0, 0, u1, 0); for (let i = 0; i < 8; i++) g.addColorStop(i / 7, `rgba(214,224,240,${at(u0 + (u1 - u0) * i / 7, yc) * k})`);
        ctx.fillStyle = g; ctx.fillRect(u0, y, u1 - u0, st); }
    } }
  // the lacquer catches the lamp: a soft specular smear toward the lamp
  { const s = cam.p(sp.x - 12, 0, sp.z - 4), k = s[2]; if (s[3] > 1) { const r = 26 * k; const g = ctx.createRadialGradient(s[0], s[1], 0, s[0], s[1], r); g.addColorStop(0, rgba('#e8eef6', .05 * sp.a)); g.addColorStop(1, 'rgba(232,238,246,0)'); ctx.fillStyle = g; ctx.fillRect(s[0] - r, s[1] - r, 2 * r, 2 * r); } }
  ctx.globalCompositeOperation = 'source-over';
  // engraved grain: long wavy grooves along X, cut into the lacquer, broken and uneven (they only show where the light falls)
  ctx.lineCap = 'butt';
  const k0 = cam.p(sp.x, 0, sp.z)[2], gw = clamp(k0 * .05, .4, 2);
  // where the grooves crowd on screen (far side, grazing views) only a share of them is cut: each groove has a fixed rank, and the
  // share follows its own on-screen spacing, so grooves thin out smoothly (a fading band in rank, quantized to 4 alpha steps)
  const BK = new Map();
  GRAIN.forEach((gl, gi) => {
    const a0 = cam.toC(0, 0, gl[0]), a1 = cam.toC(0, 0, gl[0] + .78);
    let f = 1; if (a0[2] > 1 && a1[2] > 1) { const dy = Math.abs(a0[1] / a0[2] - a1[1] / a1[2]) * cam.f, d = clamp(dy / 3.2, .18, 1); f = clamp((d - GRANK[gi]) / .15 + (d >= 1 ? 1 : 0)); }
    const lv = Math.round(f * 4); if (!lv) return;
    const key = Math.min(3, Math.floor((gl[3] - .12) / .38 * 4)) * 8 + lv; if (!BK.has(key)) BK.set(key, []); BK.get(key).push(gi);
  });
  BK.forEach((list, key) => {
    const bi = key >> 3, lv = key & 7;
    // sub-pixel grooves are drawn 1 px wide at proportionally lower alpha (same ink, far cheaper to stroke)
    const lw = gw * (.6 + .35 * bi); ctx.strokeStyle = `rgba(4,4,10,${(.12 + .38 * (bi + .5) / 4) * Math.min(1, lw) * lv / 4})`; ctx.lineWidth = Math.max(1, lw);
    ctx.beginPath();
    for (const gi of list) {
      let last = null, drawing = false;
      for (const P of GPTS[gi]) {
        if (!P) { last = null; drawing = false; continue; }   // the cut breaks here and there
        const q = cam.toC(P[0], 0, P[1]); if (q[2] < 1) { last = null; drawing = false; continue; }
        const sx = W / 2 + q[0] * cam.f / q[2], sy = H / 2 - q[1] * cam.f / q[2], inF = sx > -30 && sx < W + 30 && sy > -30 && sy < H + 30;
        // only segments that touch the frame are stroked (off-screen grooves cost nothing)
        if (last && (inF || last[2])) { if (!drawing) ctx.moveTo(last[0], last[1]); ctx.lineTo(sx, sy); drawing = true; } else drawing = false;
        last = [sx, sy, inF];
      }
    }
    ctx.stroke();
  });
  ctx.restore();
  // the rim: the near edge catches the cold light
  if (cam.y > 0 && cam.pitch > -1.45) {
    const rim = []; for (let i = 0; i <= 96; i++) { const a = Math.PI + i / 96 * Math.PI; rim.push([R * Math.cos(a), 0, R * Math.sin(a)]); }
    const P = rim.map((q) => cam.p(...q)).filter((q) => q[3] > 1);
    ctx.strokeStyle = rgba('#cfe6ff', .5); ctx.lineWidth = 2; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  }
}
// brightness of the pool at a table point (0..1), for lighting objects
export function spotAt(X, Z, spot = SPOT) { const sp = { ...SPOT, ...spot }, d = Math.hypot(X - sp.x, Z - sp.z) / sp.r; return sp.a * clamp(1 - d * d * .8); }
// the beam: a cone from the lamp to the pool (visible when the camera sees it from the side) and dust motes drifting in it
const MOTES = (() => { const r = prng(909), o = []; for (let i = 0; i < 160; i++) o.push([r(), r(), r(), r() * TAU, .3 + r() * .7]); return o; })();
export function beam(ctx, t, cam, o = {}) {
  const sp = { ...SPOT, ...(o.spot || {}) }, a = (o.a ?? 1) * sp.a, Lp = LAMP;
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // the cone: the hull of the lamp and the pool's rim, a gradient from the lamp down (seen from the side); inside it, a faint haze
  const L = cam.p(...Lp), dl = L[3];
  if (dl > 8) {
    const rim = circleW(sp.x, sp.z, sp.r * .82, 40).map((q) => cam.p(...q)).filter((q) => q[3] > 1).map((q) => [q[0], q[1]]);
    const hull = convexHull([[L[0], L[1]], ...rim]);
    if (hull.length > 2) {
      const c = cam.p(sp.x, 0, sp.z), fa = clamp((dl - 8) / 60);
      const g = ctx.createLinearGradient(L[0], L[1], c[0], c[1]); g.addColorStop(0, rgba(TB.spot, .16 * a * fa)); g.addColorStop(.6, rgba(TB.spot, .05 * a * fa)); g.addColorStop(1, rgba(TB.spot, .02 * a * fa));
      ctx.fillStyle = g; fillPoly(ctx, hull); ctx.fill();
      // a brighter core along the axis
      const g2 = ctx.createLinearGradient(L[0], L[1], c[0], c[1]); g2.addColorStop(0, rgba(TB.spot, .1 * a * fa)); g2.addColorStop(1, rgba(TB.spot, 0));
      const core = convexHull([[L[0], L[1]], ...circleW(sp.x, sp.z, sp.r * .3, 24).map((q) => cam.p(...q)).filter((q) => q[3] > 1).map((q) => [q[0], q[1]])]);
      if (core.length > 2) { ctx.fillStyle = g2; fillPoly(ctx, core); ctx.fill(); }
    }
  }
  // inside the cone (the camera in the light): a faint even haze, fading out toward the cone's wall and the table
  { const ax = [sp.x - Lp[0], -Lp[1], sp.z - Lp[2]], L2 = ax[0] ** 2 + ax[1] ** 2 + ax[2] ** 2, v = [cam.x - Lp[0], cam.y - Lp[1], cam.z - Lp[2]];
    const q = (v[0] * ax[0] + v[1] * ax[1] + v[2] * ax[2]) / L2, rad = mix(3, sp.r * .82, q), dd = Math.hypot(v[0] - ax[0] * q, v[1] - ax[1] * q, v[2] - ax[2] * q);
    const fa = (1 - clamp((dl - 8) / 60)) * sstep(0, .3, q) * (1 - sstep(.75, .97, q)) * (1 - sstep(.6, 1, dd / Math.max(1, rad)));
    if (fa > 0) { ctx.fillStyle = rgba(TB.spot, .025 * a * fa); ctx.fillRect(0, 0, W, H); } }
  // the lamp itself, when in view
  { const L = cam.p(...Lp); if (L[3] > 5 && L[0] > -200 && L[0] < W + 200 && L[1] > -200 && L[1] < H + 200) { glowSoft(ctx, L[0], L[1], 60 * Math.max(.4, L[2] * 3), .6 * a, TB.spot); ctx.fillStyle = rgba('#ffffff', .9 * a); ctx.beginPath(); ctx.arc(L[0], L[1], Math.max(1.5, 6 * L[2]), 0, TAU); ctx.fill(); } }
  // dust motes in the light, drifting slowly (they twinkle as they turn)
  for (const [u, v, w, ph, s] of MOTES) {
    const q = .25 + .73 * u, cx = mix(Lp[0], sp.x, q), cy = mix(Lp[1], 0, q), cz = mix(Lp[2], sp.z, q), rr = mix(3, sp.r * .75, q) * Math.sqrt(v);
    const X = cx + rr * Math.cos(w * TAU + t * .03) + 3 * Math.sin(t * .21 + ph), Y = cy + 4 * Math.sin(t * .13 + ph * 2) + 2.5 * Math.sin(t * .07 + ph * 3), Z = cz + rr * Math.sin(w * TAU + t * .03);
    const P = cam.p(X, Y, Z); if (P[3] < 3 || P[0] < -10 || P[0] > W + 10 || P[1] < -10 || P[1] > H + 10) continue;
    const sz = clamp(.12 * s * P[2], .7, 4), tw = .5 + .5 * Math.sin(t * (1.2 + s) + ph);
    ctx.fillStyle = rgba('#f4f8ff', .45 * a * tw * clamp(2 / sz)); ctx.fillRect(P[0], P[1], sz, sz);
  }
  ctx.restore();
}
// a soft contact shadow under a flat object (three stacked quads, no blur filter)
export function shadowQuad(ctx, cam, X, Z, rot, w, d, o = {}) {
  const lift = o.lift ?? 0, a = o.a ?? 1, dx = -LAMP[0] / LAMP[1] * lift, dz = -LAMP[2] / LAMP[1] * lift;
  const c0 = Math.cos(rot), s0 = Math.sin(rot);
  for (const [g, al] of [[1.04 + lift * .02, .22], [1.13 + lift * .04, .12], [1.28 + lift * .07, .07]]) {
    const hw = w / 2 * g, hd = d / 2 * g;
    const P = cam.poly([[-hw, hd], [hw, hd], [hw, -hd], [-hw, -hd]].map(([u, v]) => [X + dx + .22 + u * c0 + v * s0, 0, Z + dz - .3 + u * s0 - v * c0]));
    if (fillPoly(ctx, P)) { ctx.fillStyle = `rgba(2,2,6,${al * a / (1 + lift * .08)})`; ctx.fill(); }
  }
}

// ================================================================ the cards on the table
// 3D frame of a card: centre C, right axis Ru, down axis Dv (unit vectors), for lift Y and tilt `up` (0 flat … 1 standing, facing −Z)
function cardFrame(o) {
  const rot = o.rot ?? 0, c0 = Math.cos(rot), s0 = Math.sin(rot), al = (o.up ?? 0) * Math.PI / 2;
  const Ru = [c0, 0, s0], D0 = [s0, 0, -c0], Dv = [D0[0] * Math.cos(al), -Math.sin(al), D0[2] * Math.cos(al)];
  return { C: [o.X, (o.Y ?? 0) + .03, o.Z], Ru, Dv };
}
// a kit card on the table (card px: 250 × 350 at s 1, centre origin; 1 card px = TB.cw / 250 cm)
export function tableCard(ctx, t, cam, o = {}) {
  const { C, Ru, Dv } = cardFrame(o), u = TB.cw / 250;
  const A = cam.M3(C, Ru.map((v) => v * u), Dv.map((v) => v * u), 120); if (!A) return null;
  if (o.shadow !== false) shadowQuad(ctx, cam, o.X, o.Z, o.rot ?? 0, TB.cw, TB.ch * Math.cos((o.up ?? 0) * Math.PI / 2) + .01, { lift: o.Y ?? 0, a: o.a ?? 1 });
  ctx.save(); apply(ctx, A);
  kitCard(ctx, t, { x: 0, y: 0, s: 1, side: o.side || 'front', num: o.num, q: o.q ?? CARDS[(o.num || 1) - 1].q, flip: o.flip ?? 0, stamp: o.stamp ?? null, stampU: o.stampU ?? 1, shadow: false, a: o.a ?? 1, answer: o.answer });
  ctx.restore();
  return A;
}
// the face (500 × 700 face px) → screen affine of a card placed on the table
export function cardFaceM(cam, o) { const { C, Ru, Dv } = cardFrame(o), u = TB.cw / 500; const A = cam.M3(C, Ru.map((v) => v * u), Dv.map((v) => v * u), 240); return A ? mulA(A, [1, 0, 0, 1, -250, -350]) : null; }
// how strongly perspective bends a rectangle at(u, v) (u, v ∈ 0..1): null = behind the camera / off screen, else min/max corner depth
export function depthSpread(cam, at) {
  const Q = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([u, v]) => cam.p(...at(u, v)));
  if (Q.some((q) => q[3] < .5)) return { Q, ratio: 0, off: Q.every((q) => q[3] < .5) };
  const xs = Q.map((q) => q[0]), ys = Q.map((q) => q[1]), off = Math.max(...xs) < -20 || Math.min(...xs) > W + 20 || Math.max(...ys) < -20 || Math.min(...ys) > H + 20;
  return { Q, ratio: Math.min(...Q.map((q) => q[3])) / Math.max(...Q.map((q) => q[3])), off };
}
// an image mapped onto a world rectangle at(u, v) with true perspective: a grid of triangles, each an exact affine (image source only)
export function meshImage(ctx, cam, img, iw, ih, at, nu = 6, nv = 8, near = 1.2) {
  const P = []; for (let j = 0; j <= nv; j++) { const row = []; for (let i = 0; i <= nu; i++) row.push(cam.p(...at(i / nu, j / nv))); P.push(row); }
  const sw = iw / nu, sh = ih / nv;
  const tri = (d0, d1, d2, M, sx, sy) => {
    const cx = (d0[0] + d1[0] + d2[0]) / 3, cy = (d0[1] + d1[1] + d2[1]) / 3, ex = (q) => { const dx = q[0] - cx, dy = q[1] - cy, l = Math.hypot(dx, dy) || 1; return [q[0] + dx / l * .7, q[1] + dy / l * .7]; };
    ctx.save(); ctx.beginPath(); for (const [k, q] of [d0, d1, d2].map(ex).entries()) (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
    ctx.transform(M[0], M[1], M[2], M[3], M[4], M[5]);
    const x0 = Math.max(0, sx - 3), y0 = Math.max(0, sy - 3), x1 = Math.min(iw, sx + sw + 3), y1 = Math.min(ih, sy + sh + 3);
    ctx.drawImage(img, x0 * img.width / iw, y0 * img.height / ih, (x1 - x0) * img.width / iw, (y1 - y0) * img.height / ih, x0, y0, x1 - x0, y1 - y0);
    ctx.restore();
  };
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = P[j][i], b = P[j][i + 1], c = P[j + 1][i], d = P[j + 1][i + 1];
    if (Math.min(a[3], b[3], c[3], d[3]) < near) continue;
    const xs = [a[0], b[0], c[0], d[0]], ys = [a[1], b[1], c[1], d[1]];
    if (Math.max(...xs) < 0 || Math.min(...xs) > W || Math.max(...ys) < 0 || Math.min(...ys) > H) continue;
    const sx = i * sw, sy = j * sh;
    // triangle a-b-c: source (sx,sy),(sx+sw,sy),(sx,sy+sh)
    { const m0 = (b[0] - a[0]) / sw, m1 = (b[1] - a[1]) / sw, m2 = (c[0] - a[0]) / sh, m3 = (c[1] - a[1]) / sh; tri(a, b, c, [m0, m1, m2, m3, a[0] - m0 * sx - m2 * sy, a[1] - m1 * sx - m3 * sy], sx, sy); }
    // triangle b-d-c: source (sx+sw,sy),(sx+sw,sy+sh),(sx,sy+sh)
    { const m0 = (d[0] - c[0]) / sw, m1 = (d[1] - c[1]) / sw, m2 = (d[0] - b[0]) / sh, m3 = (d[1] - b[1]) / sh, X = sx + sw, Y = sy + sh; tri(b, d, c, [m0, m1, m2, m3, d[0] - m0 * X - m2 * Y, d[1] - m1 * X - m3 * Y], sx, sy); }
  }
}
// card I–IV drawn by this file on the table: one affine when the card is nearly parallel to the screen, a perspective mesh otherwise
export function tablePaperCard(ctx, t, cam, o = {}) {
  const { C, Ru, Dv } = cardFrame(o), at = (u, v) => [0, 1, 2].map((d) => C[d] + (u - .5) * TB.cw * Ru[d] + (v - .5) * TB.ch * Dv[d]);
  const ds = depthSpread(cam, at); if (ds.off) return null;
  if (o.shadow !== false) shadowQuad(ctx, cam, o.X, o.Z, o.rot ?? 0, TB.cw, TB.ch * Math.cos((o.up ?? 0) * Math.PI / 2) + .01, { lift: o.Y ?? 0, a: o.a ?? 1 });
  if (ds.ratio > .82) { const A = cardFaceM(cam, o); if (A) { paperCard(ctx, t, A, o); return A; } }
  const img = PC.get(faceKeyP(o, (o.stampU ?? 1) >= 1)) || PC.get(faceKeyP(o, false)); if (!img) return null;
  ctx.save(); ctx.globalAlpha = o.a ?? 1; meshImage(ctx, cam, img, FACE.w, FACE.h, at, 4, 5); ctx.restore();
  return null;
}

// ================================================================ the plates, drawn under an affine (copies of handoff4's, same pixels at M = identity)
const FIB = (() => { const r = prng(77), f = []; for (let i = 0; i < 420; i++) f.push([r() * W, r() * H, (r() - .5) * 2.4, 6 + r() * 26, r()]); return f; })();
const PAPER = ['#f3ecda', '#e3d6b8', '#cdbb94'];
export function paperPlateAt(ctx, t, M, o = {}) {
  t += TSHIFT;
  ctx.save(); apply(ctx, M);
  const [p0, p1, p2] = PAPER, lx = W * .32 + 30 * drift(t, 1, 2), ly = H * .25, ext = o.ext ?? 0;
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1700); g.addColorStop(0, p0); g.addColorStop(.6, p1); g.addColorStop(1, p2);
  ctx.fillStyle = g; ctx.fillRect(-ext, -ext, W + 2 * ext, H + 2 * ext);
  if (!o.baseOnly) {
    ctx.lineCap = 'round';
    for (const [x, y, a, L, k] of FIB) { ctx.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .07 + .06 * k); ctx.lineWidth = .7 + k * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke(); }
    ctx.strokeStyle = rgba('#9c8458', .1); ctx.lineWidth = .8; const R0 = 300, rot = t * .02;
    for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let i = 0; i <= 360; i++) { const q = i / 360 * TAU, rr = R0 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); const x = W * .72 + rr * Math.cos(q + rot), y = H * .56 + rr * Math.sin(q + rot) * .92; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  }
  const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .75); v.addColorStop(0, 'rgba(60,40,20,0)'); v.addColorStop(1, 'rgba(60,40,20,.22)'); ctx.fillStyle = v; ctx.fillRect(-ext, -ext, W + 2 * ext, H + 2 * ext);
  ctx.restore();
}
export function glassPlateAt(ctx, t, M) {
  t += TSHIFT;
  ctx.save(); apply(ctx, M);
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0a0f24'); g.addColorStop(1, '#05060f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const x = W * (.3 + .04 * Math.sin(t * .4)); ctx.save(); ctx.translate(x, H / 2); ctx.rotate(.5);
  const s = ctx.createLinearGradient(-260, 0, 260, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, 'rgba(216,247,255,.06)'); s.addColorStop(1, 'rgba(216,247,255,0)');
  ctx.fillStyle = s; ctx.fillRect(-260, -1400, 520, 2800); ctx.restore();
  const r = prng(12); for (let i = 0; i < 70; i++) { const px = r() * W, py = (r() * H + t * 8 * (r() + .3)) % H; ctx.fillStyle = `rgba(216,247,255,${.05 + .08 * r()})`; ctx.fillRect(px, py, 1.6, 1.6); }
  ctx.restore();
}

// ================================================================ card I: the paper card with the plate window
export const FACE = { w: 500, h: 700 };
export const WIN = { x: 200, y: 54, w: 1920 / 9, h: 120 };       // face px; 16:9; plate px → face px = 1/9
const PW = [1 / 9, 0, 0, 1 / 9, WIN.x, WIN.y];                    // plate px → face px
const ROMAN = ['', 'I', 'II', 'III', 'IV'];
function deckle(g, w, h, seed) {   // = kit deckle (same seed → same outline)
  const r = prng(seed), pts = [], step = 10;
  const edge = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(L / step); for (let i = 0; i < n; i++) { const q = i / n, j = (r() - .5) * 2.2; pts.push([mix(x0, x1, q) + (y1 - y0) / L * j, mix(y0, y1, q) - (x1 - x0) / L * j]); } };
  const c = 14; edge(c, 0, w - c, 0); pts.push([w - c * .3, c * .3]); edge(w, c, w, h - c); pts.push([w - c * .3, h - c * .3]); edge(w - c, h, c, h); pts.push([c * .3, h - c * .3]); edge(0, h - c, 0, c); pts.push([c * .3, c * .3]);
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
}
function wrapText(g, s, maxW) { const words = s.split(' '), lines = []; let cur = ''; for (const wd of words) { const nx = cur ? cur + ' ' + wd : wd; if (cur && g.measureText(nx).width > maxW) { lines.push(cur); cur = wd; } else cur = nx; } if (cur) lines.push(cur); return lines; }
// the paper of the card: the kit's cream paper, and inside WIN the paper plate (continued softly around it)
function cardPaper(g, t, seed) {
  const w = FACE.w, h = FACE.h;
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f6f0e0'); gr.addColorStop(1, '#e6dbc2'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  // the kit's fibres and vignette everywhere but the window
  g.save(); g.beginPath(); g.rect(0, 0, w, h); g.rect(WIN.x, WIN.y + WIN.h, WIN.w, -WIN.h); g.clip('evenodd');
  const r = prng(seed); g.lineCap = 'round';
  for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h, L = 4 + r() * 18, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(120,95,60,${.05 + .07 * r()})` : `rgba(255,252,240,${.15 + .2 * r()})`; g.lineWidth = .6 + r() * .6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a0) * L, y + Math.sin(a0) * L); g.stroke(); }
  const v = g.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, h * .75); v.addColorStop(0, 'rgba(120,90,50,0)'); v.addColorStop(1, 'rgba(120,90,50,.16)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
  g.restore();
  // the watermark window: the paper plate itself, at 1/9 scale, framed by a fine printed rule just outside it
  g.save(); g.beginPath(); g.rect(WIN.x, WIN.y, WIN.w, WIN.h); g.clip(); paperPlateAt(g, t, PW); g.restore();
  g.strokeStyle = rgba(F7.ink, .28); g.lineWidth = .8; g.strokeRect(WIN.x - 4, WIN.y - 4, WIN.w + 8, WIN.h + 8);
}
function cardInk(g, o) {
  const w = FACE.w, h = FACE.h, ink = F7.ink, num = o.num || 1;
  g.strokeStyle = rgba(ink, .85); g.lineWidth = 3; g.strokeRect(34, 34, w - 68, h - 68); g.lineWidth = 1.2; g.strokeRect(46, 46, w - 92, h - 92);
  text(g, ROMAN[num], 74, 150, { size: 92, font: 'Instrument Serif', color: ink });
  g.strokeStyle = rgba(ink, .5); g.lineWidth = 1.2; g.beginPath(); g.moveTo(74, 182); g.lineTo(w - 74, 182); g.stroke();
  const q = o.q ?? CARDS[num - 1].q;
  if (q) { g.font = '52px "Instrument Serif"'; const ls = wrapText(g, q, w - 150); ls.forEach((ln, i) => text(g, ln, w / 2, h * .5 - (ls.length - 1) * 31 + i * 62 + 18, { size: 52, font: 'Instrument Serif', color: ink, align: 'center' })); }
  text(g, `QUESTION ${ROMAN[num]}`, w / 2, h - 84, { size: 20, weight: 600, color: rgba(ink, .7), align: 'center', spacing: 6 });
}
// the stamp (as the kit's, in face px; scaled down when the word is wider than the card so the ink stays on the paper)
export function stampFace(g, u, txt) {
  if (u <= 0 || !txt) return;
  const k = 1 + .5 * (1 - ease.out(u)), a = clamp(u * 3), s = 2;
  g.save(); g.translate(FACE.w / 2, FACE.h / 2 + 140); g.rotate(-.2);
  g.font = `600 ${30 * s}px "Inter"`; try { g.letterSpacing = `${3 * s}px`; } catch { }
  const tw0 = g.measureText(txt).width + 30 * s, fit = Math.min(1, (FACE.w - 70) / tw0);
  g.scale(k * fit, k * fit); g.globalAlpha = a * .88;
  const tw = tw0;
  g.strokeStyle = F7.stamp; g.lineWidth = 3.2 * s; g.strokeRect(-tw / 2, -28 * s, tw, 56 * s); g.lineWidth = 1.2 * s; g.strokeRect(-tw / 2 + 6 * s, -22 * s, tw - 12 * s, 44 * s);
  g.fillStyle = F7.stamp; g.textAlign = 'center'; g.fillText(txt, 0, 11 * s);
  // the ink is uneven: a few paper-coloured flecks knock it back
  const r = prng(31); g.globalAlpha = a * .5; g.fillStyle = '#efe6d0'; for (let i = 0; i < 60; i++) g.fillRect((r() - .5) * tw, (r() - .5) * 52 * s, 2 + r() * 5, 1.5 + r() * 3);
  try { g.letterSpacing = '0px'; } catch { }
  g.restore();
}
const PC = new Map();
const faceKeyP = (o, stamped) => `${o.num}:${o.q ?? CARDS[(o.num || 1) - 1].q}:${stamped && o.stamp ? o.stamp : ''}`;
export function paperCardFace(g, t, o) {   // the whole face in face px (vector)
  const seed = 300 + (o.num || 1) * 17;
  g.save(); deckle(g, FACE.w, FACE.h, seed); g.clip();
  cardPaper(g, t, seed); cardInk(g, o);
  g.restore();
}
// cache faces as images: list of { num, q?, stamp? } (with a stamp: also the stamped face, used once the stamp has landed)
export async function paperCardPrepare(list, t) {
  for (const o of list) for (const st of o.stamp ? [false, true] : [false]) {
    const k = faceKeyP(o, st); if (PC.has(k)) continue;
    const [c, g] = canvas(FACE.w, FACE.h); paperCardFace(g, t, o);
    if (st) { g.save(); deckle(g, FACE.w, FACE.h, 300 + (o.num || 1) * 17); g.clip(); stampFace(g, 1, o.stamp); g.restore(); }
    PC.set(k, await loadImage(c.toBuffer('image/png')));
  }
}
export function paperCard(ctx, t, A, o = {}) {
  const sc = Math.sqrt(Math.abs(A[0] * A[3] - A[1] * A[2])), su = o.stampU ?? 1, imgS = o.stamp && su >= 1 ? PC.get(faceKeyP(o, true)) : null, img = imgS || PC.get(faceKeyP(o, false)), a = o.a ?? 1;
  ctx.save(); apply(ctx, A); ctx.globalAlpha = a;
  const vec = !img || sc >= (o.vectorAt ?? 1.05);
  if (!vec) ctx.drawImage(img, 0, 0, FACE.w, FACE.h);
  else paperCardFace(ctx, o.plateT ?? t, o);
  if (o.stamp && (vec || !imgS)) { ctx.save(); deckle(ctx, FACE.w, FACE.h, 300 + (o.num || 1) * 17); ctx.clip(); stampFace(ctx, su, o.stamp); ctx.restore(); }
  ctx.restore();
}
// the camera at which the paper window of a flat card fills the frame exactly (the paper plate)
export function windowCam(o, f = TB.f) {
  const rot = o.rot ?? 0, c0 = Math.cos(rot), s0 = Math.sin(rot), u = TB.cw / FACE.w;
  const du = (WIN.x + WIN.w / 2 - FACE.w / 2) * u, dv = (WIN.y + WIN.h / 2 - FACE.h / 2) * u;
  const X = o.X + du * c0 + dv * s0, Z = o.Z + du * s0 - dv * c0, hgt = f * WIN.w * u / W;
  return { x: X, y: (o.Y ?? 0) + .03 + hgt, z: Z, pitch: -Math.PI / 2, yaw: -rot, f };
}
