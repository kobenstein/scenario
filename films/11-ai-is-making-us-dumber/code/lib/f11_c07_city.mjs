// Film 11 · c07 / c08 / c10 · THE CITY THAT GROWS OUT OF THE HALL (builder c07/c08/c10). One world with the gym of light (lib/f11_kit.mjs):
// the same metres, the same camera (K.view3), the same sun, the same materials (plaster, honey wood, brass, paper, warm light).
//
// LAYOUT (metres, the hall's own frame: x right, y up, z into the hall)
//   the hall from outside: x −11.25…11.25, z −4.25…40.25, eaves 10.4, ridge 15.6 (along z); the six arched windows on the west wall
//     (x = −11.25, K.WINDOWS), the oculus on the back gable (z = 40.25, K.OCULUS), the door on the front gable (z = −4.25).
//   the plaza around it: |x| < 19, −14 < z < 56. The river starts behind the hall (quay at z = 58) and runs along +z: water |x| < 10.
//   house rows along z on both sides (mirror images: the same houses on both banks, for 07a "twice"): row 0 x 22…34 (riverfront, the
//     quay promenade x 10…22 with trees), rows 1–4 further out, taller. In front of the hall (z < −14) blocks along x.
//   special houses: the SCHOOL (row 0, z 150…170, its gable with a slate panel faces the river, big classroom windows below),
//     VILLAS (row 0, z 60…140: the rich riverfront), two stone bridges (z 236, z 436).
//
// API
//   PLAN                      { houses, trees, bridges, school, villas } (built once, deterministic)
//   cityFrame(ctx, t, V, env) draws sky + ground + river + every house / tree / bridge / the hall exterior, far to near.
//     env: { dusk 0…1 (afternoon → rose-gold dusk; the sky at dusk = the 'sky' handoff plate at SKYREF), grow(h) → 0…1 (a house rises),
//            win(w, h, t) → { glow 0…1 warm lamp, feed 0…1 grey flicker, fig: 'lift'|'sit'|'bent'|'train'|'tutor'|null, fork 0…1,
//                         hand 0…1, cool 0…1 (a machine's core in the window), dim 0…1 } (null = plain glass),
//            interior(ctx, V, w, h, S, t) → true if it drew the window itself (hero windows: clipped to the glass already),
//            hall: { glow 0…1 (its windows lit from inside), oculus(ctx, t) plate inside the oculus, pane: { win, c, r, fill(ctx, t) } },
//            noHall, clipBox [x0, y0, x1, y1] (screen box: skip objects outside, e.g. drawn through a hall window), chalk(ctx, V, t) extra
//            ground/wall drawing after the ground, after(ctx, V, h) per object hook, skipSky }
//   skyColour(e, dusk) → [r, g, b] at pseudo-elevation e (rad); drawSky(ctx, t, V, dusk, o); SKYREF (pitch, f, yaw where dusk = sky plate)
//   houseWin(h, face, i, j) the window object; winQuad(V, w) screen corners; facePt(h, face, u, y) a point on a facade
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift } from '../engine.mjs';
import * as K from './f11_kit.mjs';

const TAU = Math.PI * 2;
const hx = (s) => { const n = parseInt(s.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mx = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const css = (c, a = 1) => (a >= 1 ? `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})` : `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`);
const cl255 = (c) => [Math.min(255, c[0]), Math.min(255, c[1]), Math.min(255, c[2])];
export { hx, mx, css };

// ---------------------------------------------------------------- the sky
// The dusk sky is the 'sky' plate (handoff4 skyPlate: #5b6aa0 at the top, #c99aa0 at 0.6 H, #f6c48c at the bottom) as seen by the reference
// camera SKYREF; for any other camera the colour belongs to the pseudo-elevation e(y) = pitch + atan((H/2 − y) / f), so the sky stays put
// in the world while the camera tilts, and equals the plate exactly when the camera is at SKYREF (pitch, f).
export const SKYREF = { pitch: .5, f: 1500, yaw: 0 };
const DUSK = [hx('#5b6aa0'), hx('#c99aa0'), hx('#f6c48c')];
const DAY = { zen: hx('#cfd8d6'), mid: hx('#efe9da'), hor: hx('#fbe8c8') };
const duskU = (e) => clamp((H / 2 - SKYREF.f * Math.tan(clamp(e - SKYREF.pitch, -1.4, 1.4))) / H, 0, 1);
const duskAt = (u) => (u < .6 ? mx(DUSK[0], DUSK[1], u / .6) : mx(DUSK[1], DUSK[2], (u - .6) / .4));
const dayAt = (e) => (e < .14 ? mx(DAY.hor, DAY.mid, clamp(e / .14)) : mx(DAY.mid, DAY.zen, clamp((e - .14) / .6)));
export function skyColour(e, dusk) { return dusk <= 0 ? dayAt(e) : dusk >= 1 ? duskAt(duskU(e)) : mx(dayAt(e), duskAt(duskU(e)), dusk); }
const eOf = (cam, y) => (cam.pitch || 0) + Math.atan((H / 2 - y) / (cam.f || 1700));
// the plate's stars (handoff4: prng(4242), 520 entries; only the big ones above 0.4 H show in the dusk tone), anchored to the reference view
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
export function drawSky(ctx, t, V, dusk, o = {}) {
  const cam = V.cam, f = cam.f || 1700;
  // the stops: rows every 1/12 of the frame plus the exact points where the reference mapping has its kinks (u = 0, .6, 1)
  const ys = []; for (let i = 0; i <= 12; i++) ys.push(H * i / 12);
  if (dusk > 0) for (const u of [0, .6, 1]) { const e = SKYREF.pitch + Math.atan((H / 2 - u * H) / SKYREF.f), y = H / 2 - f * Math.tan(e - (cam.pitch || 0)); if (y > 0 && y < H) ys.push(y); }
  ys.sort((a, b) => a - b);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  for (const y of ys) g.addColorStop(clamp(y / H), css(skyColour(eOf(cam, y), dusk)));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // a soft warm glow where the sun sits low (west, −x) at dusk / the afternoon haze near the horizon
  if (o.sunGlow !== false) {
    const sd = sunDir(dusk), far = [cam.x - sd[0] * 4000, cam.y - sd[1] * 4000, cam.z - sd[2] * 4000], p = V.P(far);
    if (p.z > 0 && p.x > -W && p.x < 2 * W) { const R = 900, gl = rgrad(ctx, p.x, p.y, 0, R); gl.addColorStop(0, rgba('#fff2d8', .55 * (.4 + .6 * dusk))); gl.addColorStop(.3, rgba('#ffd9a8', .25)); gl.addColorStop(1, rgba('#ffd9a8', 0)); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.fillRect(p.x - R, p.y - R, 2 * R, 2 * R); ctx.restore(); }
  }
  if (dusk > .5) {
    const ref = K.view3({ x: 0, y: 0, z: 0, yaw: o.refYaw ?? SKYREF.yaw, pitch: SKYREF.pitch, f: SKYREF.f });
    const dx = t * 1.2, dy = t * .3, k = (dusk - .5) * 2;
    for (const [x, y, s, ph, fr] of STARS) {
      const X = ((x + dx) % W + W) % W, Y = ((y + dy) % H + H) % H;
      if (Y > H * .4 || s < 1.2) continue;
      const tw = .55 + .45 * Math.sin(t * fr * .6 + ph), a = (.25 + .5 * tw) * (1 - Y / (H * .45)) * k;
      // the ray of the plate pixel in the reference camera → a far world point → this camera
      const d = rayOf(ref.cam, X, Y), p = V.P([cam.x + d[0] * 1e5, cam.y + d[1] * 1e5, cam.z + d[2] * 1e5]);
      if (!(p.z > 0)) continue;
      ctx.fillStyle = `rgba(255,248,232,${a})`; ctx.beginPath(); ctx.arc(p.x, p.y, s * .8, 0, TAU); ctx.fill();
    }
  }
}
function rayOf(cam, X, Y) {   // inverse of view3 for a direction
  const f = cam.f || 1700, yaw = cam.yaw || 0, pitch = cam.pitch || 0, cx = (X - W / 2) / f, cy = (H / 2 - Y) / f, cz = 1;
  const cp = Math.cos(pitch), sp = Math.sin(pitch), cyw = Math.cos(yaw), syw = Math.sin(yaw);
  // camera → (x1, dy, z1): y' = dy·cp − z1·sp, z' = dy·sp + z1·cp  ⇒ dy = y'·cp + z'·sp, z1 = −y'·sp + z'·cp
  const dy = cy * cp + cz * sp, z1 = -cy * sp + cz * cp, x1 = cx;
  // x1 = dx·cy − dz·sy, z1 = dx·sy + dz·cy ⇒ dx = x1·cy + z1·sy, dz = −x1·sy + z1·cy
  return [x1 * cyw + z1 * syw, dy, -x1 * syw + z1 * cyw];
}

// ---------------------------------------------------------------- light (one sun, low from the west; at dusk lower and rose-gold)
export function sunDir(dusk) { const a = K.SUN, b = [.93, -.2, .3], u = clamp(dusk); const d = [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)], n = Math.hypot(...d); return d.map((v) => v / n); }
function lightEnv(dusk) {
  return {
    L: sunDir(dusk),
    sun: mx([1.0, .95, .84], [1.0, .78, .58], dusk),     // diffuse colour (multiplier)
    amb: mx([.86, .83, .79], [.80, .69, .70], dusk),     // ambient (shade side): warm by day, rose at dusk
    dif: mix(.26, .34, dusk),
    haze: mx(hx('#efe1c6'), hx('#f1c7a0'), dusk),
    fogD: mix(900, 700, dusk),
  };
}
function shadeCol(base, n, LE, dist) {
  const d = Math.max(0, -(n[0] * LE.L[0] + n[1] * LE.L[1] + n[2] * LE.L[2]));
  const c = [base[0] * (LE.amb[0] + LE.dif * d * LE.sun[0] * 1.15), base[1] * (LE.amb[1] + LE.dif * d * LE.sun[1] * 1.15), base[2] * (LE.amb[2] + LE.dif * d * LE.sun[2] * 1.15)];
  return mx(cl255(c), LE.haze, 1 - Math.exp(-dist / LE.fogD));
}

// ---------------------------------------------------------------- the plan (deterministic)
export const RIVER = { x: 10, z0: 58, y: -.7 };
export const HALLX = { x0: -11.25, x1: 11.25, z0: -4.25, z1: 40.25, h: 10.4, ridge: 15.6 };
const WALLS = ['#e3cfab', '#dcc6a2', '#e9d8b8', '#d8b88e', '#e2c39a', '#dcb79c', '#e6cfae', '#d4b48a', '#ead9bf', '#d9bb98'].map(hx);
const ROOFS = ['#9d6c41', '#8a5a36', '#a8693f', '#7e5534', '#b07450', '#956446'].map(hx);
const ROWS = [[22, 34, 2, 3], [42, 54, 3, 4], [62, 74, 3, 5], [82, 94, 4, 5], [102, 114, 4, 6]];
const FLOOR = 3.3;
export const SCHOOL_Z = [16, 40];
function makeHouse(o) {
  const h = Object.assign({ axis: 'z', arch: false, kind: 'house', side: 1 }, o);
  h.cx = (h.x0 + h.x1) / 2; h.cz = (h.z0 + h.z1) / 2;
  const half = (h.axis === 'z' ? h.x1 - h.x0 : h.z1 - h.z0) / 2; h.rh = h.rh ?? half * (h.kind === 'school' ? .55 : .62);
  h.rad = Math.hypot(h.x1 - h.x0, h.z1 - h.z0, h.h + h.rh) / 2 + .5;
  // windows per facade: faces 0 = −x, 1 = +x, 2 = −z, 3 = +z (u runs along the facade, left to right seen from outside)
  h.wins = [];
  const r = prng(h.seed);
  for (let f = 0; f < 4; f++) {
    const along = f < 2 ? h.z1 - h.z0 : h.x1 - h.x0, gable = (h.axis === 'z') === (f >= 2);
    if (h.kind === 'school' && f === (h.x0 > 0 ? 0 : 1)) {   // the school's river gable: two big classroom windows below, the slate above
      for (let j = 0; j < 2; j++) h.wins.push({ h, face: f, i: 0, j, u: along * (j ? .72 : .28), y0: 1.0, y1: 3.9, w: 4.2, arch: false, big: 1, seed: r() });
      continue;
    }
    const nc = Math.max(1, Math.floor((along - 1.4) / (h.kind === 'villa' ? 3.4 : 2.7)));
    for (let i = 0; i < h.floors; i++) for (let j = 0; j < nc; j++) {
      const u = along * (j + .5) / nc, y0 = 1.05 + i * FLOOR, ww = h.kind === 'villa' ? 1.5 : h.kind === 'school' ? 2.0 : 1.15;
      if (i === 0 && j === Math.floor(nc / 2) && !gable && h.kind === 'house' && nc > 1 && r() < .7) { h.wins.push({ h, face: f, i, j, u, y0: 0, y1: 2.3, w: 1.2, door: 1, seed: r() }); continue; }
      h.wins.push({ h, face: f, i, j, u, y0, y1: y0 + (h.arch && i === 0 ? 1.9 : h.kind === 'villa' ? 1.9 : 1.55), w: ww, arch: h.arch && (i === 0 || h.kind === 'villa'), seed: r() });
    }
    if (gable && r() < .35) h.wins.push({ h, face: f, i: h.floors, j: 0, u: along / 2, y0: h.h + h.rh * .32, y1: h.h + h.rh * .32 + .9, w: .9, round: 1, seed: r() });
  }
  h.wins.forEach((w, k) => { w.k = k; w.id = h.id * 100 + k; });
  return h;
}
export const PLAN = (() => {
  const r = prng(1107), right = [];
  let id = 1;
  for (let ri = 0; ri < ROWS.length; ri++) {
    const [x0, x1, f0, f1] = ROWS[ri];
    let z = -150 + r() * 10;
    while (z < 780) {
      const n = 3 + Math.floor(r() * 3);
      for (let k = 0; k < n && z < 780; k++) {
        let wz = 8 + r() * 4.5, kind = 'house', floors = f0 + Math.floor(r() * (f1 - f0 + 1)), arch = r() < .3, gap = r() < .25 ? .6 : 0;
        if (ri === 0 && z >= 58 && z < 142) { kind = 'villa'; wz = 13 + r() * 4; floors = 3; arch = true; gap = 4.5 + r() * 2; }
        if (ri === 0 && z + wz > SCHOOL_Z[0] && z < SCHOOL_Z[1] + 2) {   // the school takes this stretch of the riverfront
          if (z < SCHOOL_Z[0]) { z = SCHOOL_Z[0]; }
          right.push(makeHouse({ id: id++, x0, x1, z0: SCHOOL_Z[0], z1: SCHOOL_Z[1], h: 8.6, floors: 2, wall: hx('#e8d6b4'), roof: hx('#8a5a36'), axis: 'x', arch: true, kind: 'school', seed: 9001, row: 0 }));
          z = SCHOOL_Z[1] + 8; break;
        }
        const xx0 = kind === 'villa' ? x0 + 1 : x0, xx1 = kind === 'villa' ? x1 - 1 : x1;
        right.push(makeHouse({ id: id++, x0: xx0, x1: xx1, z0: z, z1: z + wz, h: floors * FLOOR + .4, floors, wall: WALLS[Math.floor(r() * WALLS.length)], roof: ROOFS[Math.floor(r() * ROOFS.length)], axis: kind === 'villa' && r() < .5 ? 'x' : 'z', arch, kind, seed: Math.floor(r() * 1e6), row: ri, chim: r() < .4 }));
        z += wz + gap;
      }
      z += 8;   // cross street
    }
  }
  // in front of the hall: blocks along x (|x| 4…18), ridges along x
  for (const [z0, z1] of [[-28, -16], [-48, -36], [-68, -56], [-88, -76], [-108, -96], [-128, -116], [-148, -136]]) {
    let x = 4.5;
    while (x < 18) { const wx = Math.min(18 - x, 6.5 + r() * 3.5); if (wx < 4) break; const floors = 2 + Math.floor(r() * 3); right.push(makeHouse({ id: id++, x0: x, x1: x + wx, z0, z1, h: floors * FLOOR + .4, floors, wall: WALLS[Math.floor(r() * WALLS.length)], roof: ROOFS[Math.floor(r() * ROOFS.length)], axis: 'x', arch: r() < .3, seed: Math.floor(r() * 1e6), row: 9, chim: r() < .4 })); x += wx; }
  }
  // the mirror image: the same houses on the other bank (the same seeds: the same windows)
  const left = right.map((h) => { const m = makeHouse({ ...h, id: h.id + 5000, x0: -h.x1, x1: -h.x0, side: -1, rh: undefined, wins: undefined }); m.twin = h; h.twin = m; return m; });
  const houses = right.concat(left);
  for (const h of houses) h.dist = Math.max(0, Math.hypot(Math.max(0, Math.abs(h.cx) - 11), Math.max(0, h.cz - 40, -4 - h.cz)));
  const trees = [];
  for (const s of [-1, 1]) for (let z = 64; z < 760; z += 11) { if (Math.abs(z - 236) < 9 || Math.abs(z - 436) < 9 || Math.abs(z - 89) < 11 || Math.abs(z - 64.5) < 3) continue; trees.push({ x: s * 16.5, z: z + (r() - .5) * 2, s: .85 + r() * .35, seed: r() * 100, kind: 'tree' }); }
  for (const [x, z] of [[-16, -9], [16, -9], [-16, 50], [-16, 4], [-16, -2]]) trees.push({ x, z, s: .9 + r() * .2, seed: r() * 100, kind: 'tree' });
  for (const t of trees) { t.cx = t.x; t.cz = t.z; t.rad = 4; t.dist = Math.hypot(Math.max(0, Math.abs(t.x) - 11), Math.max(0, t.z - 40)); }
  const bridges = [236, 436].map((z) => ({ kind: 'bridge', z, cx: 0, cz: z, rad: 14, dist: z - 40 }));
  const school = right.find((h) => h.kind === 'school');
  return { houses, trees, bridges, school, right, left };
})();

// ---------------------------------------------------------------- geometry helpers
const FN = [[-1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1]];
// a point on facade f of house h: u along the facade (seen from outside, left → right), height y, out = offset along the normal
export function facePt(h, f, u, y, out = .03) {
  if (f === 0) return [h.x0 - out, y, h.z1 - u];        // −x face seen from −x: left = +z
  if (f === 1) return [h.x1 + out, y, h.z0 + u];        // +x face seen from +x: left = −z
  if (f === 2) return [h.x0 + u, y, h.z0 - out];        // −z face seen from −z: left = −x
  return [h.x1 - u, y, h.z1 + out];                     // +z face seen from +z: left = +x
}
export function winQuad(V, w, out = .03) {
  const h = w.h, a = w.u - w.w / 2, b = w.u + w.w / 2;
  return [V.P(facePt(h, w.face, a, w.y0, out)), V.P(facePt(h, w.face, b, w.y0, out)), V.P(facePt(h, w.face, b, w.y1, out)), V.P(facePt(h, w.face, a, w.y1, out))];
}
function winPath(ctx, V, w, out = .03, inset = 0, begin = true) {
  const h = w.h, a = w.u - w.w / 2 + inset, b = w.u + w.w / 2 - inset, y0 = w.y0 + inset, y1 = w.y1 - inset;
  if (w.round) { const c = (a + b) / 2, yc = (y0 + y1) / 2, R = (b - a) / 2, pts = []; for (let k = 0; k < 16; k++) { const an = TAU * k / 16; pts.push(facePt(h, w.face, c + Math.cos(an) * R, yc + Math.sin(an) * R, out)); } return V.poly(ctx, pts, begin); }
  if (w.arch) { const R = (b - a) / 2, ya = y1 - R, pts = [facePt(h, w.face, a, y0, out), facePt(h, w.face, b, y0, out), facePt(h, w.face, b, ya, out)]; for (let k = 1; k < 8; k++) { const an = Math.PI * k / 8; pts.push(facePt(h, w.face, (a + b) / 2 + Math.cos(an) * R, ya + Math.sin(an) * R, out)); } pts.push(facePt(h, w.face, a, ya, out)); return V.poly(ctx, pts, begin); }
  return V.poly(ctx, [facePt(h, w.face, a, y0, out), facePt(h, w.face, b, y0, out), facePt(h, w.face, b, y1, out), facePt(h, w.face, a, y1, out)], begin);
}
export { winPath };
// an affine frame on a window (local metres: u right from the window's left edge, v up from its sill) → screen
export function winFrame(V, w, out = .05) {
  const h = w.h, a = w.u - w.w / 2, o = V.P(facePt(h, w.face, a, w.y0, out)), ux = V.P(facePt(h, w.face, a + 1, w.y0, out)), vy = V.P(facePt(h, w.face, a, w.y0 + 1, out));
  if (!(o.z > .1 && ux.z > .1 && vy.z > .1)) return null;
  return { a: ux.x - o.x, b: ux.y - o.y, c: vy.x - o.x, d: vy.y - o.y, e: o.x, f: o.y, k: o.k };
}
// a linear gradient that never fails (degenerate or non-finite ends → a tiny vertical one)
export function rgrad(ctx, x, y, r0, r1) { if (![x, y, r0, r1].every(Number.isFinite) || r1 <= .01) { x = -10; y = -10; r0 = 0; r1 = 1; } return ctx.createRadialGradient(x, y, Math.max(0, r0), x, y, Math.max(r1, r0 + .01)); }
export function lgrad(ctx, x0, y0, x1, y1) { if (![x0, y0, x1, y1].every(Number.isFinite)) { x0 = 0; y0 = 0; x1 = 0; y1 = 1; } if (Math.abs(x1 - x0) + Math.abs(y1 - y0) < .5) y1 = y0 + 1; return ctx.createLinearGradient(x0, y0, x1, y1); }
const visible = (cam, p, n) => (cam.x - p[0]) * n[0] + (cam.y - p[1]) * n[1] + (cam.z - p[2]) * n[2] > 0;

// ---------------------------------------------------------------- the frame
export function cityFrame(ctx, t, V, env = {}) {
  const dusk = clamp(env.dusk || 0), LE = lightEnv(dusk), cam = V.cam;
  if (!env.skipSky) drawSky(ctx, t, V, dusk, env);
  drawGround(ctx, t, V, env, LE);
  if (env.chalk) env.chalk(ctx, V, t);
  // objects far to near
  const objs = [];
  const cull = (o) => {
    const q = V.toCam([o.cx, 4, o.cz]); if (q[2] < -o.rad) return true;
    const zz = Math.max(q[2], .3), m = o.rad * (cam.f || 1700) / zz;
    const sx = W / 2 + (cam.f || 1700) * q[0] / zz, sy = H / 2 - (cam.f || 1700) * q[1] / zz;
    const out = (B) => sx + m < B[0] - 40 || sx - m > B[2] + 40 || sy + m * 1.6 < B[1] - 40 || sy - m * 1.6 > B[3] + 40;
    if (env.clipBoxes) return q[2] > 0 && env.clipBoxes.every(out);   // several screen boxes (e.g. the windows of the hall): outside all of them
    return q[2] > 0 && out(env.clipBox || [0, 0, W, H]);
  };
  // painter's order by the distance to the nearest point of each object's box (better than centres for big neighbours like the hall)
  const near = (x0, x1, z0, z1, y1) => Math.hypot(Math.max(x0 - cam.x, 0, cam.x - x1), Math.max(z0 - cam.z, 0, cam.z - z1), Math.max(0 - cam.y, 0, cam.y - y1) * .3);
  const consider = (o) => { if (cull(o)) return; const d = o.x0 != null ? near(o.x0, o.x1, o.z0, o.z1, o.h + o.rh) : o.kind === 'bridge' ? near(-12, 12, o.z - 2.5, o.z + 2.5, 5) : near(o.cx - 1, o.cx + 1, o.cz - 1, o.cz + 1, 5); objs.push([d + (o.kind === 'tree' ? -.5 : 0), o, Math.hypot(o.cx - cam.x, o.cz - cam.z, 4 - cam.y)]); };
  for (const h of PLAN.houses) { const g = env.grow ? env.grow(h, t) : 1; if (g <= 0) continue; consider(h); }
  for (const tr of PLAN.trees) { const g = env.grow ? env.grow(tr, t) : 1; if (g <= 0) continue; consider(tr); }
  for (const b of PLAN.bridges) { const g = env.grow ? env.grow(b, t) : 1; if (g <= 0) continue; consider(b); }
  if (!env.noHall) objs.push([near(HALLX.x0, HALLX.x1, HALLX.z0, HALLX.z1, HALLX.ridge), { kind: 'hall' }, 0]);
  objs.sort((a, b) => b[0] - a[0]);
  for (const [, o, d] of objs) {
    if (o.kind === 'hall') drawHallExt(ctx, t, V, env, LE);
    else if (o.kind === 'tree') drawTree(ctx, t, V, o, env.grow ? env.grow(o, t) : 1, LE, d);
    else if (o.kind === 'bridge') drawBridge(ctx, t, V, o, env.grow ? env.grow(o, t) : 1, LE, d);
    else drawHouse(ctx, t, V, o, env.grow ? env.grow(o, t) : 1, env, LE, d);
    if (env.after) env.after(ctx, V, o, t);
  }
}

// ---------------------------------------------------------------- ground, plaza, river, quays
function drawGround(ctx, t, V, env, LE) {
  const cam = V.cam, f = cam.f || 1700, yh = H / 2 + f * Math.tan(cam.pitch || 0);
  const g0 = hx('#cba77c'), near = mx(g0, [255, 236, 200], .05);
  // depth along the screen: d(y) = camera height / tan(depression)
  const stops = [];
  for (let k = 0; k <= 10; k++) { const y = yh + 2 + (H - yh) * Math.pow(k / 10, 1.6); if (y > H + 2) break; const dep = Math.atan((y - H / 2) / f) - (cam.pitch || 0), d = dep > .0005 ? Math.max(1, cam.y) / Math.tan(dep) : 1e5; stops.push([y, mx(near, LE.haze, 1 - Math.exp(-d / LE.fogD))]); }
  const big = 6000;
  if (V.poly(ctx, [[cam.x - big, 0, cam.z - big], [cam.x + big, 0, cam.z - big], [cam.x + big, 0, cam.z + big], [cam.x - big, 0, cam.z + big]])) {
    if (stops.length > 1) { const g = lgrad(ctx, 0, stops[0][0], 0, stops[stops.length - 1][0]); for (const [y, c] of stops) g.addColorStop(clamp((y - stops[0][0]) / (stops[stops.length - 1][0] - stops[0][0] + 1e-6)), css(c)); ctx.fillStyle = g; }
    else ctx.fillStyle = css(LE.haze);
    ctx.fill();
  }
  // the plaza around the hall (lighter stone) with a border, the avenue in front
  const plaza = mx(hx('#d8b88c'), LE.haze, .0);
  shadeFill(ctx, V, [[-19, .004, -14], [19, .004, -14], [19, .004, 56], [-19, .004, 56]], plaza, LE, cam);
  ctx.strokeStyle = rgba('#8a6440', .3); ctx.lineWidth = 1; ctx.beginPath(); for (let x = -18; x <= 18; x += 3) V.seg(ctx, [x, .006, -14], [x, .006, 56]); for (let z = -13; z <= 55; z += 3) V.seg(ctx, [-19, .006, z], [19, .006, z]); ctx.stroke();
  shadeFill(ctx, V, [[-4, .004, -160], [4, .004, -160], [4, .004, -14], [-4, .004, -14]], hx('#d9bc92'), LE, cam);
  // promenades along the river (honey stone) and the river itself (below the quay), the quay walls
  for (const s of [-1, 1]) shadeFill(ctx, V, [[s * 10, .004, 56], [s * 21, .004, 56], [s * 21, .004, 1400], [s * 10, .004, 1400]], hx('#d6b487'), LE, cam);
  shadeFill(ctx, V, [[-21, .004, 52], [21, .004, 52], [21, .004, 58], [-21, .004, 58]], hx('#d6b487'), LE, cam);
  water(ctx, t, V, env, LE);
}
function shadeFill(ctx, V, pts, col, LE, cam) {
  const S = V.poly(ctx, pts); if (!S) return;
  // fog by the polygon's near/far ends: a gradient along the screen y between its extreme points
  let ymin = 1e9, ymax = -1e9; for (const s of S) { ymin = Math.min(ymin, s.y); ymax = Math.max(ymax, s.y); }
  const f = cam.f || 1700, dAt = (y) => { const dep = Math.atan((y - H / 2) / f) - (cam.pitch || 0); return dep > .0005 ? Math.max(1, cam.y) / Math.tan(dep) : 1e5; };
  const g = lgrad(ctx, 0, ymin, 0, ymax + 1);
  for (let k = 0; k <= 6; k++) { const y = ymin + (ymax - ymin) * Math.pow(k / 6, 1.5); g.addColorStop(clamp((y - ymin) / (ymax - ymin + 1)), css(mx(col, LE.haze, 1 - Math.exp(-dAt(y) / LE.fogD)))); }
  ctx.fillStyle = g; ctx.fill();
}
function water(ctx, t, V, env, LE) {
  const cam = V.cam, y = RIVER.y, f = cam.f || 1700;
  // quay walls (stone faces down to the water), seen from the river side
  for (const s of [-1, 1]) {
    const S = V.poly(ctx, [[s * 10, 0, 58], [s * 10, 0, 1400], [s * 10, y, 1400], [s * 10, y, 58]]);
    if (S) { ctx.fillStyle = css(mx(hx('#a98258'), LE.haze, .25)); ctx.fill(); }
  }
  { const S = V.poly(ctx, [[-10, 0, 58], [10, 0, 58], [10, y, 58], [-10, y, 58]]); if (S) { ctx.fillStyle = css(mx(hx('#a07a52'), LE.haze, .2)); ctx.fill(); } }
  const S = V.poly(ctx, [[-10, y, 58], [10, y, 58], [10, y, 1400], [-10, y, 1400]]); if (!S) return;
  let ymin = 1e9, ymax = -1e9; for (const s of S) { ymin = Math.min(ymin, s.y); ymax = Math.max(ymax, s.y); }
  // the water mirrors the sky: at screen row y it shows the sky at the mirrored elevation, a little deeper and warmer
  const g = lgrad(ctx, 0, ymin, 0, ymax + 1), dusk = clamp(env.dusk || 0);
  for (let k = 0; k <= 8; k++) {
    const yy = ymin + (ymax - ymin) * k / 8, e = -(eOf(cam, yy));
    const c = mx(mx(skyColour(Math.max(0, e), dusk), hx('#8d8a7a'), .22), LE.haze, .15 * (1 - k / 8));
    g.addColorStop(k / 8, css(c));
  }
  ctx.save(); ctx.fillStyle = g; ctx.fill(); ctx.clip();
  // slow ripples: thin light lines that drift with the current (calm)
  const r = prng(77); ctx.lineCap = 'round';
  for (let i = 0; i < 70; i++) {
    const z = 60 + Math.pow(r(), 1.7) * 500, x = -9 + r() * 18, L = .8 + r() * 2.4, zz = z + ((t * .35 + r() * 30) % 30) - 15;
    const a = V.P([x, y + .01, zz]), b = V.P([x + L, y + .01, zz]); if (!(a.z > 1 && b.z > 1)) continue;
    ctx.strokeStyle = rgba('#fff4e0', .22 * (.5 + .5 * Math.sin(t * .6 + i))); ctx.lineWidth = Math.max(.6, a.k * .05); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- one house
function drawHouse(ctx, t, V, h, g, env, LE, dist) {
  const cam = V.cam, ge = eio(clamp(g / .8)), hw = h.h * ge, rr = h.rh * eout(clamp((g - .72) / .28));
  if (hw < .05) return;
  const { x0, x1, z0, z1 } = h, ax = h.axis, top = hw + rr;
  const kpx = (cam.f || 1700) / Math.max(1, dist);   // px per metre at this house
  // contact shadow on the ground (the sun from the west)
  if (kpx > 5) { const S = V.poly(ctx, [[x0, .01, z0], [x1, .01, z0], [x1 + hw * .25, .01, z0 + hw * .1], [x1 + hw * .25, .01, z1 + hw * .1], [x0, .01, z1]]); if (S) { ctx.fillStyle = rgba('#5a3a22', .12); ctx.fill(); } }
  const faces = [
    { f: 0, pts: [[x0, 0, z1], [x0, 0, z0], [x0, hw, z0], ...(ax === 'x' ? [[x0, top, (z0 + z1) / 2]] : []), [x0, hw, z1]].reverse(), c: [x0, hw / 2, (z0 + z1) / 2] },
    { f: 1, pts: [[x1, 0, z0], [x1, 0, z1], [x1, hw, z1], ...(ax === 'x' ? [[x1, top, (z0 + z1) / 2]] : []), [x1, hw, z0]], c: [x1, hw / 2, (z0 + z1) / 2] },
    { f: 2, pts: [[x0, 0, z0], [x1, 0, z0], [x1, hw, z0], ...(ax === 'z' ? [[(x0 + x1) / 2, top, z0]] : []), [x0, hw, z0]], c: [(x0 + x1) / 2, hw / 2, z0] },
    { f: 3, pts: [[x1, 0, z1], [x0, 0, z1], [x0, hw, z1], ...(ax === 'z' ? [[(x0 + x1) / 2, top, z1]] : []), [x1, hw, z1]], c: [(x0 + x1) / 2, hw / 2, z1] },
  ];
  for (const F of faces) {
    const n = FN[F.f]; if (!visible(cam, F.c, n)) continue;
    const col = shadeCol(h.wall, n, LE, dist);
    const S = V.poly(ctx, F.pts); if (!S) continue;
    // plaster with a soft darkening toward the ground (bounce) and a lighter band under the eaves
    if (kpx > 3) { let y0 = 1e9, y1 = -1e9; for (const s of S) { y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); }
      const gr = lgrad(ctx, 0, y0, 0, y1); gr.addColorStop(0, css(mx(col, [255, 245, 225], .06))); gr.addColorStop(1, css(mx(col, [90, 60, 40], .1))); ctx.fillStyle = gr; } else ctx.fillStyle = css(col);
    ctx.fill();
    if (kpx > 5) {
      // stone plinth and the cornice line under the eaves
      const a = facePt(h, F.f, 0, 0, .02), b = facePt(h, F.f, F.f < 2 ? z1 - z0 : x1 - x0, 0, .02);
      const P = (p, y) => [p[0], y, p[2]];
      if (V.poly(ctx, [P(a, 0), P(b, 0), P(b, Math.min(.8, hw)), P(a, Math.min(.8, hw))])) { ctx.fillStyle = css(mx(col, [120, 85, 55], .28)); ctx.fill(); }
      ctx.strokeStyle = css(mx(col, [70, 45, 28], .45)); ctx.lineWidth = Math.max(1, kpx * .12); if (V.line(ctx, P(a, hw - .05), P(b, hw - .05))) ctx.stroke();
      if (kpx > 6 && h.floors > 1) { ctx.strokeStyle = css(mx(col, [120, 85, 55], .18)); ctx.lineWidth = Math.max(1, kpx * .05); ctx.beginPath(); for (let i = 1; i < h.floors; i++) { const yy = i * FLOOR + .55; if (yy < hw) V.seg(ctx, P(a, yy), P(b, yy)); } ctx.stroke(); }
    }
    // windows
    if (kpx > 9) { const fr = []; for (const w of h.wins) { if (w.face !== F.f || w.y1 > hw + .01) continue; if (drawWindow(ctx, t, V, w, env, LE, kpx, dist, col)) fr.push(w); } if (fr.length) windowFrames(ctx, V, fr, LE, kpx, dist, col, env); }
    else if (kpx > 1.2) farWindows(ctx, t, V, h, F.f, hw, env, LE, dist, col, kpx);
  }
  // roof (two planes) with a small overhang
  if (rr > .02) {
    const o = .45, s = rr / ((ax === 'z' ? x1 - x0 : z1 - z0) / 2), roofs = [];
    if (ax === 'z') {
      const xm = (x0 + x1) / 2;
      roofs.push({ n: norm([-rr, (xm - x0), 0]), pts: [[x0 - o, hw - o * s, z0 - o], [xm, top, z0 - o], [xm, top, z1 + o], [x0 - o, hw - o * s, z1 + o]] });
      roofs.push({ n: norm([rr, (x1 - xm), 0]), pts: [[x1 + o, hw - o * s, z1 + o], [xm, top, z1 + o], [xm, top, z0 - o], [x1 + o, hw - o * s, z0 - o]] });
    } else {
      const zm = (z0 + z1) / 2;
      roofs.push({ n: norm([0, (zm - z0), -rr]), pts: [[x1 + o, hw - o * s, z0 - o], [x1 + o, top, zm], [x0 - o, top, zm], [x0 - o, hw - o * s, z0 - o]] });
      roofs.push({ n: norm([0, (z1 - zm), rr]), pts: [[x0 - o, hw - o * s, z1 + o], [x0 - o, top, zm], [x1 + o, top, zm], [x1 + o, hw - o * s, z1 + o]] });
    }
    for (const R of roofs) {
      const c = R.pts.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4, a[2] + p[2] / 4], [0, 0, 0]);
      if (!visible(cam, c, R.n)) continue;
      const col = shadeCol(h.roof, R.n, LE, dist), S = V.poly(ctx, R.pts); if (!S) continue;
      ctx.fillStyle = css(col); ctx.fill();
      if (kpx > 5) {   // shingle courses
        ctx.strokeStyle = css(mx(col, [50, 30, 18], .35)); ctx.lineWidth = Math.max(.7, kpx * .03); ctx.beginPath();
        const [A, B, C, D] = R.pts; for (let k = 1; k < 8; k++) { const u = k / 8; V.seg(ctx, [mix(A[0], B[0], u), mix(A[1], B[1], u), mix(A[2], B[2], u)], [mix(D[0], C[0], u), mix(D[1], C[1], u), mix(D[2], C[2], u)]); } ctx.stroke();
        ctx.strokeStyle = css(mx(col, [255, 230, 190], .25)); ctx.lineWidth = Math.max(1, kpx * .1); if (V.line(ctx, A, D)) ctx.stroke();
      }
    }
    if (h.chim && kpx > 3 && g >= 1) {   // a chimney on the ridge
      const cx = ax === 'z' ? (x0 + x1) / 2 + .6 : x0 + (x1 - x0) * .3, cz = ax === 'z' ? z0 + (z1 - z0) * .3 : (z0 + z1) / 2 + .6, cy = top - .3;
      for (const [fi, pts] of [[2, [[cx - .4, cy, cz - .4], [cx + .4, cy, cz - .4], [cx + .4, cy + 1.6, cz - .4], [cx - .4, cy + 1.6, cz - .4]]], [0, [[cx - .4, cy, cz + .4], [cx - .4, cy, cz - .4], [cx - .4, cy + 1.6, cz - .4], [cx - .4, cy + 1.6, cz + .4]]], [1, [[cx + .4, cy, cz - .4], [cx + .4, cy, cz + .4], [cx + .4, cy + 1.6, cz + .4], [cx + .4, cy + 1.6, cz - .4]]], [3, [[cx + .4, cy, cz + .4], [cx - .4, cy, cz + .4], [cx - .4, cy + 1.6, cz + .4], [cx + .4, cy + 1.6, cz + .4]]]]) {
        if (!visible(cam, [cx + FN[fi][0] * .4, cy + .8, cz + FN[fi][2] * .4], FN[fi])) continue;
        if (V.poly(ctx, pts)) { ctx.fillStyle = css(shadeCol(hx('#b07a52'), FN[fi], LE, dist)); ctx.fill(); }
      }
    }
  }
  if (h.kind === 'school') schoolSlate(ctx, t, V, h, env, LE, dist, hw);
}
// far / mid houses: the windows of one facade as flat quads, batched by colour (glass, lamp light, the grey of a feed); mid range adds one frame stroke
function farWindows(ctx, t, V, h, f, hw, env, LE, dist, wallCol, kpx) {
  const fog = 1 - Math.exp(-dist / LE.fogD), dusk = clamp(env.dusk || 0), B = new Map();
  const glassBase = mx(mx(GLASS_DAY, hx('#b9928a'), dusk * .8), mx(wallCol, [60, 45, 35], .35), .3), far = dist > 260 && dusk >= .5;
  const ws = [];
  for (const w of h.wins) {
    if (w.face !== f || w.y1 > hw + .01) continue;
    let c;
    if (w.door) { if (kpx < 2.5) continue; c = mx(hx('#7a5033'), LE.haze, fog); }
    else {
      const st = env.win ? env.win(w, h, t) : null, glow = st ? clamp(st.glow || 0) : 0, feed = st ? clamp(st.feed || 0) : 0;
      if (far && glow < .4) continue;
      c = mx(mx(mx(mx(glassBase, WARM, glow), FEED, feed * .6), hx('#e4f3fa'), (st && st.cool ? st.cool : 0) * .45), LE.haze, fog * (glow > .4 ? .7 : 1));
    }
    const key = css([Math.round(c[0] / 6) * 6, Math.round(c[1] / 6) * 6, Math.round(c[2] / 6) * 6]);
    if (!B.has(key)) B.set(key, []); B.get(key).push(w); ws.push(w);
  }
  const quad = (w) => { const a = w.u - w.w / 2, b = w.u + w.w / 2; V.poly(ctx, [facePt(h, f, a, w.y0), facePt(h, f, b, w.y0), facePt(h, f, b, w.y1), facePt(h, f, a, w.y1)], false); };
  for (const [key, list] of B) { ctx.beginPath(); list.forEach(quad); ctx.fillStyle = key; ctx.fill(); }
  if (kpx > 5 && ws.length) { ctx.strokeStyle = css(mx(hx('#5b3f2c'), LE.haze, fog)); ctx.lineWidth = 1; ctx.beginPath(); ws.forEach(quad); ctx.stroke(); }
}
const norm = (v) => { const n = Math.hypot(...v); return v.map((x) => x / n); };

// the school's river gable carries a slate panel (the FT line in 7.05 is chalked on it: env.slate(ctx, S, t) in slate units 600 × 260 cm)
export function slateGeom(h) {
  const f = h.x0 > 0 ? 0 : 1, along = h.z1 - h.z0, u0 = along / 2 - 3, u1 = along / 2 + 3, y0 = 4.6, y1 = 7.2;
  return { f, u0, u1, y0, y1, w: 600, h: 260 };
}
function schoolSlate(ctx, t, V, h, env, LE, dist, hw) {
  const G = slateGeom(h); if (hw < G.y1) return;
  if (!visible(V.cam, facePt(h, G.f, G.u0, G.y0, 0), FN[G.f])) return;
  const fr = .14, Q = (u, y, o = .05) => facePt(h, G.f, u, y, o);
  if (V.poly(ctx, [Q(G.u0 - fr, G.y0 - fr, .04), Q(G.u1 + fr, G.y0 - fr, .04), Q(G.u1 + fr, G.y1 + fr, .04), Q(G.u0 - fr, G.y1 + fr, .04)])) { ctx.fillStyle = css(mx(hx('#8a5d3b'), LE.haze, 1 - Math.exp(-dist / LE.fogD))); ctx.fill(); }
  const S = V.poly(ctx, [Q(G.u0, G.y0), Q(G.u1, G.y0), Q(G.u1, G.y1), Q(G.u0, G.y1)]); if (!S) return;
  ctx.fillStyle = css(mx(hx('#3c4a43'), LE.haze, (1 - Math.exp(-dist / LE.fogD)) * .8)); ctx.fill();
  const o = V.P(Q(G.u0, G.y1)), ux = V.P(Q(G.u0 + 1, G.y1)), vy = V.P(Q(G.u0, G.y1 - 1));
  if (env.slate && o.z > .1 && ux.z > .1 && vy.z > .1) {
    ctx.save(); V.poly(ctx, [Q(G.u0, G.y0), Q(G.u1, G.y0), Q(G.u1, G.y1), Q(G.u0, G.y1)]); ctx.clip();
    ctx.transform((ux.x - o.x) / 100, (ux.y - o.y) / 100, (vy.x - o.x) / 100, (vy.y - o.y) / 100, o.x, o.y);
    env.slate(ctx, G, t); ctx.restore();
  }
}

// ---------------------------------------------------------------- a window: glass, the light inside, who is in it, the frame
const GLASS_DAY = hx('#b7ae9e'), WARM = hx('#ffd79c'), WARM_HOT = hx('#fff1d2'), FEED = hx('#c8d0d0');
function drawWindow(ctx, t, V, w, env, LE, kpx, dist, wallCol) {
  const px = (w.y1 - w.y0) * kpx; if (px < 1.2) return false;
  const st = env.win ? env.win(w, w.h, t) : null, dusk = clamp(env.dusk || 0);
  const glow = st ? clamp(st.glow || 0) : 0, feed = st ? clamp(st.feed || 0) : 0;
  const fog = 1 - Math.exp(-dist / LE.fogD);
  const glassBase = mx(mx(GLASS_DAY, hx('#b9928a'), dusk * .8), mx(wallCol, [60, 45, 35], .35), .25);
  if (w.door) { if (winPath(ctx, V, w, .03)) { ctx.fillStyle = css(mx(hx('#7a5033'), LE.haze, fog)); ctx.fill(); } return false; }
  if (!winPath(ctx, V, w, .03)) return false;
  // glass (sky reflection) or lamp light inside
  const inner = mx(mx(mx(glassBase, WARM, glow), hx('#e4f3fa'), (st && st.cool ? st.cool : 0) * .3), FEED, feed * (.55 + .2 * Math.sin(t * 1.7 + w.seed * 20) * Math.sin(t * .9 + w.seed * 7)));
  if (px > 12) {
    const Q = winQuad(V, w), g = lgrad(ctx, Q[3].x, Q[3].y, Q[0].x, Q[0].y);
    g.addColorStop(0, css(mx(mx(inner, glow > .3 ? WARM_HOT : [255, 250, 240], glow > .3 ? .35 * glow : .12), LE.haze, fog)));
    g.addColorStop(1, css(mx(mx(inner, [60, 40, 30], glow > .3 ? .12 : .18), LE.haze, fog)));
    ctx.fillStyle = g;
  } else ctx.fillStyle = css(mx(inner, LE.haze, fog));
  ctx.fill();
  // what is inside (clipped to the glass)
  if (px > 14 && (st || env.interior)) {
    ctx.save(); winPath(ctx, V, w, .03); ctx.clip();
    let done = false;
    if (env.interior) done = env.interior(ctx, V, w, w.h, t, { px, kpx, fog, LE });
    if (!done && st && st.fig) windowFigure(ctx, t, V, w, st, fog, px);
    ctx.restore();
  }
  // a lit window throws a little warm light onto the plaster around it
  if (glow > .2 && px > 7) { const Q = winQuad(V, w), cx = (Q[0].x + Q[2].x) / 2, cy = (Q[0].y + Q[2].y) / 2, R = px * 1.3; const gl = rgrad(ctx, cx, cy, R * .2, R); gl.addColorStop(0, rgba('#ffd9a0', .16 * glow * (1 - fog))); gl.addColorStop(1, rgba('#ffd9a0', 0)); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore(); }
  return px > 8;
}
// frames, mullions and sills of the windows of one facade in three batched strokes
function windowFrames(ctx, V, ws, LE, kpx, dist, wallCol, env = {}) {
  const fog = 1 - Math.exp(-dist / LE.fogD);
  ctx.strokeStyle = css(mx(hx('#5b3f2c'), LE.haze, fog)); ctx.lineWidth = Math.max(1, kpx * .07); ctx.beginPath();
  for (const w of ws) winPath(ctx, V, w, .035, 0, false);
  ctx.stroke();
  ctx.lineWidth = Math.max(.8, kpx * .045); ctx.beginPath();
  for (const w of ws) {
    const h = w.h, um = w.u, ym = w.y0 + (w.y1 - w.y0) * (w.arch ? .5 : .62);
    if (w.big) { for (const k of [-1, 0, 1]) V.seg(ctx, facePt(h, w.face, um + k * w.w / 4, w.y0, .04), facePt(h, w.face, um + k * w.w / 4, w.y1, .04)); V.seg(ctx, facePt(h, w.face, um - w.w / 2, w.y0 + (w.y1 - w.y0) * .72, .04), facePt(h, w.face, um + w.w / 2, w.y0 + (w.y1 - w.y0) * .72, .04)); }
    else if (env.noCross && env.noCross(w)) continue;
    else if (!w.round) { V.seg(ctx, facePt(h, w.face, um, w.y0, .04), facePt(h, w.face, um, w.y1 - (w.arch ? w.w / 2 : 0), .04)); V.seg(ctx, facePt(h, w.face, um - w.w / 2, ym, .04), facePt(h, w.face, um + w.w / 2, ym, .04)); }
    else V.seg(ctx, facePt(h, w.face, um, w.y0, .04), facePt(h, w.face, um, w.y1, .04));
  }
  ctx.stroke();
  ctx.strokeStyle = css(mx(mx(wallCol, [255, 245, 225], .35), LE.haze, fog)); ctx.lineWidth = Math.max(1, kpx * .09); ctx.beginPath();
  for (const w of ws) if (!w.round) V.seg(ctx, facePt(w.h, w.face, w.u - w.w / 2 - .1, w.y0 - .05, .06), facePt(w.h, w.face, w.u + w.w / 2 + .1, w.y0 - .05, .06));
  ctx.stroke();
}

// small figures in a window, drawn in the window's own metres (u right, v up from the sill): backlit silhouettes with a warm rim,
// the machine as a brass column with its cool core. kinds: lift (you curl, warm dumbbell), train (+ the machine's hand on the back),
// sit (slumped, the forks hold the weight), bent (over a grey feed), tutor (a child at a desk, an adult beside)
export function windowFigure(ctx, t, V, w, st, fog, px) {
  const F = winFrame(V, w, .2); if (!F) return;
  if (![F.a, F.b, F.c, F.d, F.e, F.f].every(Number.isFinite)) return;
  ctx.save(); ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f);
  const sil = rgba('#4a3022', .86 * (1 - fog * .8)), seed = w.seed * 10, ww = w.w;
  const b = Math.sin(t * TAU / 4.3 + seed) * .006;
  const person = (x, yH, s, lean, armA, armB) => {   // yH = shoulder height above the sill (m), s = scale, lean (rad)
    ctx.fillStyle = sil;
    const hy = yH + .24 * s + b, hx2 = x + Math.sin(lean) * .25 * s;
    ctx.beginPath(); ctx.ellipse(hx2, hy, .1 * s, .115 * s, 0, 0, TAU); ctx.fill();                      // head
    ctx.beginPath(); ctx.moveTo(x - .14 * s, -.2); ctx.lineTo(x + .14 * s, -.2); ctx.lineTo(hx2 + .12 * s, yH + b); ctx.lineTo(hx2 - .14 * s, yH + b); ctx.closePath(); ctx.fill();   // torso
    ctx.strokeStyle = sil; ctx.lineCap = 'round'; ctx.lineWidth = .075 * s;
    const sx = hx2 + .05 * s, sy = yH - .04 * s + b, ex = sx + Math.sin(armA) * .27 * s, ey = sy - Math.cos(armA) * .27 * s, hx3 = ex + Math.sin(armA + armB) * .25 * s, hy3 = ey - Math.cos(armA + armB) * .25 * s;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(hx3, hy3); ctx.stroke();
    return { hand: [hx3, hy3], back: [hx2 - .14 * s, yH - .12 * s + b], head: [hx2, hy] };
  };
  const machineSil = (x, s, core, fork, armOut, hand) => {
    ctx.fillStyle = rgba('#7a5a2a', .9 * (1 - fog * .8)); ctx.fillRect(x - .025 * s, -.3, .05 * s, 1.25 * s);   // column
    ctx.beginPath(); ctx.arc(x, .95 * s - .3, .045 * s, 0, TAU); ctx.fill();
    const cy = .55 * s - .3;
    const gl = rgrad(ctx, x, cy, 0, .3 * s); gl.addColorStop(0, rgba(K.PAL.core, .75 * core)); gl.addColorStop(1, rgba(K.PAL.core, 0)); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, cy, .3 * s, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(K.PAL.coreHot, .9 * core + .1); ctx.beginPath(); ctx.arc(x, cy, .085 * s, 0, TAU); ctx.fill();
    return { cy };
  };
  const kind = st.fig, curl = .5 + .5 * Math.sin(t * TAU / 2.9 + seed);
  if (kind === 'lift' || kind === 'train') {
    const x = ww * .56, curlA = mix(.25, 2.4, eio(curl * (st.lift ?? 1)));
    const P = person(x, .62, 1, .05, .12, curlA);
    const gw = .5 + .4 * curl; const g = rgrad(ctx, P.hand[0], P.hand[1], 0, .3); g.addColorStop(0, rgba(K.PAL.effortHot, .95)); g.addColorStop(.3, rgba(K.PAL.effort, .7 * gw)); g.addColorStop(1, rgba(K.PAL.effort, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(P.hand[0], P.hand[1], .3, 0, TAU); ctx.fill();
    if (kind === 'train') {
      const M = machineSil(ww * .2, 1, 1); const hd = st.hand ?? 1;
      ctx.strokeStyle = rgba('#7a5a2a', .9 * (1 - fog * .8)); ctx.lineWidth = .04; ctx.beginPath(); ctx.moveTo(ww * .2, M.cy - .1); ctx.lineTo(mix(ww * .25, P.back[0] - .12, hd), mix(M.cy - .3, P.back[1] - .02, hd)); ctx.lineTo(mix(ww * .28, P.back[0], hd), mix(M.cy - .35, P.back[1], hd)); ctx.stroke();
      const hp = [mix(ww * .28, P.back[0], hd), mix(M.cy - .35, P.back[1], hd)], hg = rgrad(ctx, hp[0], hp[1], 0, .16); hg.addColorStop(0, rgba('#f2fbff', .95 * hd)); hg.addColorStop(1, rgba(K.PAL.core, 0)); ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hp[0], hp[1], .16, 0, TAU); ctx.fill();
    }
  } else if (kind === 'sit') {
    const x = ww * .6; const P = person(x, .35, .95, .32, .5, .9);
    const M = machineSil(ww * .22, 1, .8);
    const fy = mix(-.1, .55, st.fork ?? 1);   // the forks carry the weight past the person
    ctx.strokeStyle = rgba('#7a5a2a', .9 * (1 - fog * .8)); ctx.lineWidth = .035; ctx.beginPath(); ctx.moveTo(ww * .22, fy); ctx.lineTo(ww * .22 + .34, fy + .01); ctx.stroke();
    ctx.fillStyle = rgba('#b9c9cf', .85); ctx.beginPath(); ctx.arc(ww * .22 + .26, fy + .08, .07, 0, TAU); ctx.fill();
  } else if (kind === 'bent') {
    const x = ww * .5; const P = person(x, .38, .95, .55, .75, .7);
    const fx = P.hand[0] + .02, fy = P.hand[1] + .02, fl = .55 + .25 * Math.sin(t * 2.1 + seed) * Math.sin(t * 1.3 + seed * 2);
    ctx.fillStyle = rgba('#dfe6e6', .9); ctx.fillRect(fx - .07, fy - .04, .14, .09);
    const g = rgrad(ctx, fx, fy, 0, .45); g.addColorStop(0, rgba('#d6dee0', .35 * fl)); g.addColorStop(1, rgba('#d6dee0', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx, fy, .45, 0, TAU); ctx.fill();
  } else if (kind === 'tutor') {
    person(ww * .62, .22, .78, .25, .6, .8);
    person(ww * .3, .7, 1, .3, .7, .5);
  }
  if (st.cool && kind !== 'train' && kind !== 'sit') machineSil(ww * .18, .55, st.cool);
  ctx.restore();
}

// ---------------------------------------------------------------- trees along the quays, bridges
function drawTree(ctx, t, V, tr, g, LE, dist) {
  const s = tr.s * eout(clamp(g)); if (s < .05) return;
  const base = V.P([tr.x, 0, tr.z]); if (!(base.z > .5)) return;
  const k = base.k, fog = 1 - Math.exp(-dist / LE.fogD); if (k * s * 5 < 2) return;
  const top = V.P([tr.x, 3.2 * s, tr.z]); if (!(top.z > .5)) return;
  ctx.strokeStyle = css(mx(hx('#6b4a30'), LE.haze, fog)); ctx.lineWidth = Math.max(1, k * .22 * s); ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(top.x, top.y); ctx.stroke();
  const sway = Math.sin(t * .6 + tr.seed) * .05 * k * s, r0 = 1.9 * s * k;
  const leaf = mx(hx('#8f9a5e'), LE.haze, fog * .9), lit = mx(hx('#c2b874'), LE.haze, fog * .9), dark = mx(hx('#6d7748'), LE.haze, fog * .9);
  if (r0 < 6) { ctx.fillStyle = css(leaf); ctx.beginPath(); ctx.ellipse(top.x, top.y - r0 * .6, r0 * 1.1, r0, 0, 0, TAU); ctx.fill(); return; }
  const blobs = [[-.55, .1, .75, dark], [.5, .2, .7, dark], [0, .55, .85, leaf], [-.3, -.05, .65, leaf], [.35, -.1, .6, leaf], [-.25, .45, .45, lit], [.1, .75, .4, lit]];
  for (const [dx, dy, rr, c] of blobs) { ctx.fillStyle = css(c); ctx.beginPath(); ctx.ellipse(top.x + dx * r0 + sway * (dy + .5), top.y - dy * r0 - r0 * .5, rr * r0, rr * r0 * .9, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = rgba('#4a3020', .14 * (1 - fog)); ctx.beginPath(); ctx.ellipse(base.x + k * .6, base.y, r0 * .9, r0 * .2, 0, 0, TAU); ctx.fill();
}
function drawBridge(ctx, t, V, b, g, LE, dist) {
  const z = b.z, cam = V.cam, side = cam.z < z ? -1 : 1, zf = z + side * 2.5, y0 = RIVER.y, yd = 3.6, fog = 1 - Math.exp(-dist / LE.fogD);
  const stone = hx('#d2b48c'), n = [0, 0, side];
  // the arched face toward the camera: deck band + a wide flat arch over the water
  const pts = []; pts.push([-12, yd + .9, zf], [12, yd + .9, zf], [12, y0, zf], [10, y0, zf]);
  for (let k = 0; k <= 16; k++) { const a = Math.PI * k / 16; pts.push([10 * Math.cos(a), y0 + (yd - .6 - y0) * Math.sin(a), zf]); }
  pts.push([-10, y0, zf], [-12, y0, zf]);
  if (V.poly(ctx, pts)) { ctx.fillStyle = css(shadeCol(stone, n, LE, dist)); ctx.fill(); }
  if (V.poly(ctx, [[-12, yd + .9, z - 2.5], [12, yd + .9, z - 2.5], [12, yd + .9, z + 2.5], [-12, yd + .9, z + 2.5]]) && cam.y > yd + .9) { ctx.fillStyle = css(shadeCol(hx('#c9a77c'), [0, 1, 0], LE, dist)); ctx.fill(); }
  ctx.strokeStyle = css(mx(hx('#8a6a48'), LE.haze, fog)); ctx.lineWidth = Math.max(1, V.P([0, yd, zf]).k * .08); if (V.line(ctx, [-12, yd + .2, zf + side * .02], [12, yd + .2, zf + side * .02])) ctx.stroke();
  // lamps on the parapet
  for (const x of [-8, -3, 3, 8]) { const p = V.P([x, yd + 1.9, zf]), q = V.P([x, yd + .9, zf]); if (!(p.z > .5 && q.z > .5)) continue; ctx.strokeStyle = css(mx(hx('#5a3c28'), LE.haze, fog)); ctx.lineWidth = Math.max(1, p.k * .06); ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.fillStyle = css(mx(hx('#ffe2b0'), LE.haze, fog * .6)); ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1, p.k * .14), 0, TAU); ctx.fill(); }
}

// ---------------------------------------------------------------- the hall from outside
export const OCC = { x: K.OCULUS.x, y: K.OCULUS.y, r: K.OCULUS.r, z: HALLX.z1 + .02 };
export function oculusPts(r = OCC.r, z = OCC.z, n = 48) { const p = []; for (let i = 0; i < n; i++) { const a = TAU * i / n; p.push([OCC.x + Math.cos(a) * r, OCC.y + Math.sin(a) * r, z]); } return p; }
// the arched hall windows seen from outside (on x = HALLX.x0): pane polygons (3 columns × 4 rows + the two arch panes) as in the kit
export function hallPanes(i) {
  const w = K.WINDOWS[i], X = HALLX.x0 - .02, panes = [], cols = 3, rows = 4, gx = .07, z0 = w.z - w.w / 2, pw = w.w / cols, ph = (w.y1 - w.y0) / rows;
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) { const a = z0 + c * pw + gx, b = z0 + (c + 1) * pw - gx, y0 = w.y0 + r * ph + gx, y1 = w.y0 + (r + 1) * ph - gx; panes.push({ c, r, pts: [[X, y0, b], [X, y0, a], [X, y1, a], [X, y1, b]] }); }
  return panes;
}
function hallOutline(w, X, n = 12) { const pts = [[X, w.y0, w.z + w.w / 2], [X, w.y0, w.z - w.w / 2], [X, w.y1, w.z - w.w / 2]]; for (let i = 1; i < n; i++) { const a = Math.PI - Math.PI * i / n; pts.push([X, w.y1 + Math.sin(a) * w.r, w.z + Math.cos(a) * w.w / 2]); } pts.push([X, w.y1, w.z + w.w / 2]); return pts; }
function drawHallExt(ctx, t, V, env, LE) {
  const cam = V.cam, { x0, x1, z0, z1, h, ridge } = HALLX, E = env.hall || {}, dist = Math.hypot(cam.x, cam.z - 18, cam.y - 6);
  const wall = hx('#e2cba4'), roof = hx('#8a5a36');
  const kpx = (cam.f || 1700) / Math.max(1, dist);
  const faces = [
    { f: 0, pts: [[x0, 0, z1], [x0, 0, z0], [x0, h, z0], [x0, h, z1]] },
    { f: 1, pts: [[x1, 0, z0], [x1, 0, z1], [x1, h, z1], [x1, h, z0]] },
    { f: 2, pts: [[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [0, ridge, z0], [x0, h, z0]] },
    { f: 3, pts: [[x1, 0, z1], [x0, 0, z1], [x0, h, z1], [0, ridge, z1], [x1, h, z1]] },
  ];
  // contact shadow
  if (V.poly(ctx, [[x0, .01, z0], [x1, .01, z0], [x1 + 3, .01, z0 + 1], [x1 + 3, .01, z1 + 1], [x0, .01, z1]])) { ctx.fillStyle = rgba('#5a3a22', .14); ctx.fill(); }
  for (const F of faces) {
    const n = FN[F.f], c = F.pts[0].map((v, j) => (v + F.pts[2][j]) / 2); if (!visible(cam, c, n)) continue;
    const col = shadeCol(wall, n, LE, dist), S = V.poly(ctx, F.pts); if (!S) continue;
    let y0 = 1e9, y1 = -1e9; for (const s of S) { y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); }
    const gr = lgrad(ctx, 0, y0, 0, y1); gr.addColorStop(0, css(mx(col, [255, 245, 225], .07))); gr.addColorStop(1, css(mx(col, [90, 60, 40], .1))); ctx.fillStyle = gr; ctx.fill();
    // stone plinth (the wainscot height), pilasters every 6 m, the cornice
    const L = F.f < 2 ? z1 - z0 : x1 - x0, at = (u, y, o = .03) => (F.f === 0 ? [x0 - o, y, z1 - u] : F.f === 1 ? [x1 + o, y, z0 + u] : F.f === 2 ? [x0 + u, y, z0 - o] : [x1 - u, y, z1 + o]);
    if (V.poly(ctx, [at(0, 0), at(L, 0), at(L, 1.25), at(0, 1.25)])) { ctx.fillStyle = css(mx(col, [130, 92, 60], .3)); ctx.fill(); }
    if (kpx > 2) {
      ctx.fillStyle = css(mx(col, [255, 246, 228], .18));
      for (let u = (F.f < 2 ? 3.5 : 2.25) - 3; u <= L + .01; u += 6) { const a = Math.max(0, u - .25), b = Math.min(L, u + .25); if (b - a < .1) continue; if (F.f === 0 && K.WINDOWS.some((w) => Math.abs((z1 - (a + b) / 2) - w.z) < w.w / 2 + .3)) continue; if (V.poly(ctx, [at(a, 1.25, .05), at(b, 1.25, .05), at(b, h - .3, .05), at(a, h - .3, .05)])) ctx.fill(); }
      ctx.strokeStyle = css(mx(col, [70, 45, 28], .5)); ctx.lineWidth = Math.max(1, kpx * .2); if (V.line(ctx, at(0, h - .15), at(L, h - .15))) ctx.stroke();
    }
    if (F.f === 0) for (let i = 0; i < K.WINDOWS.length; i++) hallWindow(ctx, t, V, i, E, LE, dist, kpx);
    if (F.f === 3) hallOculus(ctx, t, V, E, LE, kpx);
    if (F.f === 2 && kpx > 1) {   // the door: two wooden leaves under a round arch
      const D = [[-2, 0], [2, 0], [2, 3.4], ...Array.from({ length: 9 }, (_, k) => { const a = Math.PI * (k + 1) / 10; return [2 * Math.cos(a), 3.4 + 2 * Math.sin(a)]; }), [-2, 3.4]].map(([x, y]) => [x, y, z0 - .04]);
      if (V.poly(ctx, D)) { ctx.fillStyle = css(mx(hx('#7a5033'), LE.haze, 0)); ctx.fill(); ctx.strokeStyle = css(hx('#5b3f2c')); ctx.lineWidth = Math.max(1, kpx * .08); ctx.stroke(); }
      ctx.beginPath(); V.seg(ctx, [0, 0, z0 - .05], [0, 5.3, z0 - .05]); ctx.stroke();
    }
  }
  // the roof: two planes along z, an overhang, shingle courses, the ridge
  const o = .6, s = (ridge - h) / 11.25;
  const roofs = [
    { n: norm([-(ridge - h), 11.25, 0]), pts: [[x0 - o, h - o * s, z0 - o], [0, ridge, z0 - o], [0, ridge, z1 + o], [x0 - o, h - o * s, z1 + o]] },
    { n: norm([(ridge - h), 11.25, 0]), pts: [[x1 + o, h - o * s, z1 + o], [0, ridge, z1 + o], [0, ridge, z0 - o], [x1 + o, h - o * s, z0 - o]] },
  ];
  for (const R of roofs) {
    const c = [R.pts[0][0] / 2, (h + ridge) / 2, 18]; if (!visible(cam, c, R.n)) continue;
    const col = shadeCol(roof, R.n, LE, dist); if (!V.poly(ctx, R.pts)) continue; ctx.fillStyle = css(col); ctx.fill();
    ctx.strokeStyle = css(mx(col, [40, 25, 15], .3)); ctx.lineWidth = Math.max(.7, kpx * .035); ctx.beginPath();
    const [A, B, C, D] = R.pts; for (let k = 1; k < 14; k++) { const u = k / 14; V.seg(ctx, [mix(A[0], B[0], u), mix(A[1], B[1], u), mix(A[2], B[2], u)], [mix(D[0], C[0], u), mix(D[1], C[1], u), mix(D[2], C[2], u)]); }
    ctx.stroke();
    ctx.strokeStyle = css(mx(hx('#c9a25a'), LE.haze, 0)); ctx.lineWidth = Math.max(1, kpx * .18); if (V.line(ctx, B, C)) ctx.stroke();   // a brass ridge cap: the gym of light
  }
}
function hallWindow(ctx, t, V, i, E, LE, dist, kpx) {
  const w = K.WINDOWS[i], X = HALLX.x0 - .02, out = hallOutline(w, X);
  if (!V.poly(ctx, out)) return;
  const glow = E.glow ?? .6, S = V.poly(ctx, out); let y0 = 1e9, y1 = -1e9; for (const s of S) { y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); }
  const g = lgrad(ctx, 0, y0, 0, y1); g.addColorStop(0, css(mx(hx('#e9dcc8'), hx('#fff1d6'), glow))); g.addColorStop(1, css(mx(hx('#c9b49a'), hx('#ffd59a'), glow))); ctx.fillStyle = g; ctx.fill();
  if (E.pane && E.pane.win === i) { const P = hallPanes(i).find((p) => p.c === E.pane.c && p.r === E.pane.r); if (P) { ctx.save(); if (V.poly(ctx, P.pts)) { ctx.clip(); E.pane.fill(ctx, t); } ctx.restore(); } }
  if (E.inside) { ctx.save(); V.poly(ctx, out); ctx.clip(); E.inside(ctx, V, i, t); ctx.restore(); }
  // mullions (3 × 4) and the frame
  ctx.strokeStyle = css(hx('#5b3f2c')); const lw = Math.max(1, kpx * .07); ctx.lineWidth = lw; ctx.beginPath();
  const pw = w.w / 3, ph = (w.y1 - w.y0) / 4, z0 = w.z - w.w / 2;
  for (let c = 1; c < 3; c++) V.seg(ctx, [X - .01, w.y0, z0 + c * pw], [X - .01, w.y1, z0 + c * pw]);
  for (let r = 1; r <= 4; r++) V.seg(ctx, [X - .01, w.y0 + r * ph, z0], [X - .01, w.y0 + r * ph, z0 + w.w]);
  V.seg(ctx, [X - .01, w.y1, w.z], [X - .01, w.y1 + w.r, w.z]); ctx.stroke();
  ctx.lineWidth = lw * 1.8; V.poly(ctx, hallOutline(w, X - .015)); ctx.stroke();
  ctx.fillStyle = css(hx('#cfae86')); if (V.poly(ctx, [[X, w.y0 - .05, z0 - .2], [X, w.y0 - .05, z0 + w.w + .2], [X - .35, w.y0 - .05, z0 + w.w + .2], [X - .35, w.y0 - .05, z0 - .2]])) ctx.fill();
}
function hallOculus(ctx, t, V, E, LE, kpx) {
  const pts = oculusPts();
  if (!V.poly(ctx, pts)) return;
  if (E.oculus) { ctx.save(); V.poly(ctx, pts); ctx.clip(); E.oculus(ctx, t); ctx.restore(); }
  else { ctx.fillStyle = css(hx('#fff3dc')); ctx.fill(); }
  ctx.strokeStyle = css(hx('#5b3f2c')); ctx.lineWidth = Math.max(1, kpx * .08); ctx.beginPath();
  for (let k = 0; k < 4; k++) { const a = Math.PI * k / 4; V.seg(ctx, [OCC.x + Math.cos(a) * OCC.r, OCC.y + Math.sin(a) * OCC.r, OCC.z + .01], [OCC.x - Math.cos(a) * OCC.r, OCC.y - Math.sin(a) * OCC.r, OCC.z + .01]); }
  ctx.stroke(); ctx.lineWidth = Math.max(1.5, kpx * .14); V.poly(ctx, oculusPts(OCC.r, OCC.z + .015)); ctx.stroke();
  ctx.lineWidth = Math.max(1, kpx * .2); ctx.strokeStyle = css(hx('#c9a25a')); V.poly(ctx, oculusPts(OCC.r + .12, OCC.z + .01)); ctx.stroke();
}

// ---------------------------------------------------------------- the camera (RUHE, softer than K.camEase)
// camSmooth: monotone cubic (Fritsch–Carlson) through timed keys, per channel: no overshoot, the velocity is continuous, a hold between two
// close keys keeps drifting and a move eases in out of that drift (no dead stop, lower peak speed than a sine ease of the same length).
// keep a flying camera clear of the hall roof (a camera skimming the roof plane sees it as a band to its horizon): above the hall's
// footprint the camera stays >= m metres over the roof surface (a soft max; only for cameras above the eaves, so window pushes are free)
export function aboveRoof(c, m = 1.8) {
  const { x0, x1, z0, z1, h, ridge } = HALLX, o = .6;
  const ax = Math.abs(c.x), roofY = ridge - (ridge - h) * Math.min(ax, x1 + o) / x1;
  const wx = 1 - sm(lin(x1 + o, x1 + o + 1.6, ax)), wz = (1 - sm(lin(z1 + o, z1 + o + 1.6, c.z))) * sm(lin(z0 - o - 1.6, z0 - o, c.z));
  const w = wx * wz * sm(lin(7, 9.5, c.y)); if (w <= 0) return c;
  const req = roofY + m, k = .9, d = c.y - req, smax = req + (d + Math.sqrt(d * d + k * k)) / 2;
  return { ...c, y: mix(c.y, Math.max(c.y, smax), w) };
}
export function camSmooth(t, K) {
  const n = K.length; if (t <= K[0][0]) return { ...K[0][1] }; if (t >= K[n - 1][0]) return { ...K[n - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const out = {}, T = (k) => K[k][0], h = T(i + 1) - T(i), u = (t - T(i)) / h;
  for (const j of Object.keys(K[i][1])) {
    const Vv = (k) => (K[k][1][j] ?? K[i][1][j]);
    const sec = (k) => (Vv(k + 1) - Vv(k)) / (T(k + 1) - T(k));
    const tan = (k) => {
      if (k <= 0 || k >= n - 1) return 0;
      const a = sec(k - 1), b = sec(k); if (a * b <= 0) return 0;
      const h0 = T(k) - T(k - 1), h1 = T(k + 1) - T(k), w1 = 2 * h1 + h0, w2 = h1 + 2 * h0;
      return (w1 + w2) / (w1 / a + w2 / b);
    };
    const m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out[j] = (2 * u3 - 3 * u2 + 1) * Vv(i) + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * Vv(i + 1) + (u3 - u2) * m1;
  }
  return out;
}
// a camera that looks at L from distance D (azimuth az: 0 = from +z, + = from +x; elevation el), f focal
export function orbitCam(L, D, az, el, f) {
  const x = L[0] + D * Math.cos(el) * Math.sin(az), y = L[1] + D * Math.sin(el), z = L[2] + D * Math.cos(el) * Math.cos(az);
  return { x, y, z, yaw: Math.atan2(L[0] - x, L[2] - z), pitch: -el, f };
}
// look-at helper: yaw/pitch from a position to a target
export function lookAt(p, L, f) { const dx = L[0] - p[0], dy = L[1] - p[1], dz = L[2] - p[2]; return { x: p[0], y: p[1], z: p[2], yaw: Math.atan2(dx, dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)), f }; }
