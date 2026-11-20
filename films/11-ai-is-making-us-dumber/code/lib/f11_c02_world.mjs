// Film 11 · c02–c04 builder lib (props and camera helpers shared by scenes/sc02.mjs, sc03.mjs, sc04.mjs). Same style as lib/f11_kit.mjs:
// brass, wood, paper, warm light, contact shadows, everything a pure function of t.
//
//   glide(t, keys)            RUHE camera: monotone cubic through timed keys [[t, cam], …] (no overshoot, velocity continuous, rest at the
//                             first and last key). Close keys = a hold that keeps drifting (no dead stop between move and hold); a move
//                             between far keys peaks at ~1.5× its mean speed (camEase: 1.57×, eio: 3×).
//   flyCam(t, t0, t1, A, B, target, o)   a fly-into / pull-out: distance to the target point interpolated in log space (constant
//                             apparent zoom rate), eased in and out; view direction and f eased with it.
//   mirrorOverlay(ctx, t, V, o)   the mirror wall drawn on top of the hall (kit look: glass gradient, the reflected window wall, the
//                             reflected floor) but its reflected WINDOWS are the mirror plate (handoff c02>c03): a camera that flies into a
//                             reflected window ends on the plate. o.actors(ctx, V) draws mirrored actors (use K.mirrorPt), clipped to the glass.
//   gymState / drawGym(ctx, t, V, st, mir)   you + the machine at the mirror (copied from sc01, plus st.dx/st.walk for a step).
//   rack(ctx, t, V, o)        the dumbbell rack along the mirror (RACK): wood, two shelves, dumbbells of light; o.dust: index of the unused one.
//   board01(ctx, B)           the blackboard as c01 left it (Turkey bars, final state) for chunks that see the back wall.
//   mapC02(ctx, t, V, o)      the pinned city map drawn on top of the kit's (same streets, a paper margin; o.paper(ctx) fills the paper,
//                             o.route u, o.fade u: the blue dot and the streets fading behind it).
//   slate(ctx, t, V, p, o)    a mobile blackboard on a wooden stand with castors (2.4 × 1.4 m), o.chalk(ctx, S) in slate cm (240 × 140).
//   doctorsPrepare / DOCTORS / doctorsRow(ctx, t, V, o)   nineteen doctors in white coats at the long table (c02, c04).
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, canvas } from '../engine.mjs';
import * as K from './f11_kit.mjs';
import { plate } from './handoff4.mjs';
import { figure } from './figure.mjs';

const TAU = Math.PI * 2;
const CH = ['x', 'y', 'z', 'yaw', 'pitch', 'f'];

// ---------------------------------------------------------------- camera
export function glide(t, keys) {
  const n = keys.length;
  if (t <= keys[0][0]) return { ...keys[0][1] };
  if (t >= keys[n - 1][0]) return { ...keys[n - 1][1] };
  let i = 0; while (t > keys[i + 1][0]) i++;
  const out = {};
  const t0 = keys[i][0], t1 = keys[i + 1][0], h = t1 - t0, u = (t - t0) / h;
  const h00 = 2 * u * u * u - 3 * u * u + 1, h10 = u * u * u - 2 * u * u + u, h01 = -2 * u * u * u + 3 * u * u, h11 = u * u * u - u * u;
  for (const c of CH) {
    const v = (k) => keys[k][1][c] ?? keys[0][1][c];
    const d = (k) => (v(k + 1) - v(k)) / (keys[k + 1][0] - keys[k][0]);
    const m = (k) => {
      if (k === 0 || k === n - 1) return 0;
      const d0 = d(k - 1), d1 = d(k); if (d0 * d1 <= 0) return 0;
      const h0 = keys[k][0] - keys[k - 1][0], h1 = keys[k + 1][0] - keys[k][0];
      return 3 * (h0 + h1) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1);
    };
    out[c] = h00 * v(i) + h10 * h * m(i) + h01 * v(i + 1) + h11 * h * m(i + 1);
  }
  return out;
}
// look-at helper: yaw/pitch of the direction from camera position c to point p
export const lookAt = (c, p) => ({ yaw: Math.atan2(p[0] - c.x, p[2] - c.z), pitch: Math.atan2(p[1] - c.y, Math.hypot(p[0] - c.x, p[2] - c.z)) });
// fly between A and B (cams) toward/away from a target point: log-distance interpolation along the line, eased; u = eased progress
export function flyCam(u, A, B, tgt) {
  const dA = Math.hypot(A.x - tgt[0], A.y - tgt[1], A.z - tgt[2]), dB = Math.hypot(B.x - tgt[0], B.y - tgt[1], B.z - tgt[2]);
  const d = dA * Math.pow(dB / dA, u), w = (d - dA) / ((dB - dA) || 1e-6);   // w: progress in metres (0…1)
  const o = {};
  for (const c of ['x', 'y', 'z']) o[c] = mix(A[c], B[c], clamp(w));
  for (const c of ['yaw', 'pitch']) o[c] = mix(A[c], B[c], u);
  o.f = A.f * Math.pow(B.f / A.f, u);
  return o;
}

// ---------------------------------------------------------------- the mirror (overlay with plate windows)
function winOutline(w, n = 10) {
  const pts = [[w.z - w.w / 2, w.y0], [w.z + w.w / 2, w.y0], [w.z + w.w / 2, w.y1]];
  for (let i = 1; i < n; i++) { const a = Math.PI * i / n; pts.push([w.z + Math.cos(a) * w.w / 2, w.y1 + Math.sin(a) * w.r]); }
  pts.push([w.z - w.w / 2, w.y1]);
  return pts;
}
export const WOUT = K.WINDOWS.map((w) => winOutline(w, 16));
export const MQUAD = (() => { const M = K.MIRROR; return [[M.x, M.y0, M.z0], [M.x, M.y0, M.z1], [M.x, M.y1, M.z1], [M.x, M.y1, M.z0]]; })();
const bbox = (S) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const s of S) { x0 = Math.min(x0, s.x); x1 = Math.max(x1, s.x); y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); } return { x0, y0, x1, y1 }; };
// pre-clip a world polygon at a safer near depth (zn m) so no vertex projects to huge screen coordinates (the kit clips at 6 cm)
export function nearClip(V, pts, zn = .35) {
  const d = pts.map((p) => V.toCam(p)[2]), out = [];
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length, a = pts[i], b = pts[j], ia = d[i] > zn, ib = d[j] > zn;
    if (ia) out.push(a);
    if (ia !== ib) { const u = (zn - d[i]) / (d[j] - d[i]); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]); }
  }
  return out;
}
// a guard-band view: the kit clips only at 6 cm, so a long wall or beam that passes beside/behind the camera projects to screen
// coordinates far beyond ±32k px, where the rasteriser wraps and paints stray slabs (a brown arc of the ceiling fill) for a frame.
// safeView(V) clips every polygon and segment to the frustum widened 3× (and z ≥ 5 cm) in world space before the kit projects it.
export function safeView(V) {
  const G = 3, gx = G * (W / 2) / V.f, gy = G * (H / 2) / V.f, ZG = .05;
  const planes = [(q) => q[2] - ZG, (q) => gx * q[2] - q[0], (q) => gx * q[2] + q[0], (q) => gy * q[2] - q[1], (q) => gy * q[2] + q[1]];
  const clip = (pts) => {
    let P = pts;
    for (const pl of planes) {
      if (P.length < 3) return P;
      const d = P.map((p) => pl(V.toCam(p))), out = [];
      for (let i = 0; i < P.length; i++) {
        const j = (i + 1) % P.length, ia = d[i] >= 0, ib = d[j] >= 0;
        if (ia) out.push(P[i]);
        if (ia !== ib) { const u = d[i] / (d[i] - d[j]), a = P[i], b = P[j]; out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]); }
      }
      P = out;
    }
    return P;
  };
  const cseg = (a, b) => {
    for (const pl of planes) {
      const da = pl(V.toCam(a)), db = pl(V.toCam(b));
      if (da < 0 && db < 0) return null;
      if (da < 0 || db < 0) { const u = da / (da - db), c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; if (da < 0) a = c; else b = c; }
    }
    return [a, b];
  };
  const poly = (ctx, pts, begin = true) => { const q = clip(pts); return q.length >= 3 ? V.poly(ctx, q, begin) : false; };
  const clipPoly = (pts) => { const q = clip(pts); return q.length >= 3 ? V.clipPoly(q) : []; };
  const seg = (ctx, a, b) => { const c = cseg(a, b); return c ? V.seg(ctx, c[0], c[1]) : null; };
  const line = (ctx, a, b) => { ctx.beginPath(); return seg(ctx, a, b); };
  const path = (ctx, pts, closed = false) => { for (let i = 0; i + 1 < pts.length; i++) seg(ctx, pts[i], pts[i + 1]); if (closed) seg(ctx, pts[pts.length - 1], pts[0]); };
  // the kit's pendant lamps (globe at y 6.4 m) size their shade by f/depth and only cull at 0.2 m depth: a lamp passing just in front of the
  // camera paints a giant brown shade ellipse into the top of the frame for a few frames. A lamp nearer than 3 m in depth is always
  // above the frame (it hangs ≥ 2.7 m over any camera here), so it is culled.
  // the truss struts take one stroke width per truss from V.P([0, 9, z]).k: when that point nears the camera plane the width runs to
  // thousands of px and a slab of beam colour sweeps the top of the frame. Its k is held at f/4 (as if 4 m away) inside 4 m.
  const P = (p) => {
    if (p[1] === 6.4 && V.toCam(p)[2] < 3) return { x: NaN, y: NaN, z: -1, k: 0 };
    if (p[1] < .2 && V.toCam(p)[2] < .5) return { x: NaN, y: NaN, z: -1, k: 0 };   // floor sprites (Go stones + their glow) passing under the camera
    if (p[0] === 0 && p[1] === 9) { const d = V.toCam(p)[2]; if (d < 4) return { ...V.P(p), k: V.f / 4 }; }
    return V.P(p);
  };
  return { ...V, P, Praw: V.P, poly, clipPoly, seg, line, path };
}
const spoly = (ctx, V, pts) => { const q = nearClip(V, pts); return q.length >= 3 ? V.poly(ctx, q) : false; };
const fillP = (ctx, V, pts, col) => { if (spoly(ctx, V, pts)) { ctx.fillStyle = col; ctx.fill(); return true; } return false; };
export const MX = 2 * K.MIRROR.x - K.HALL.x0;   // the reflected window wall (x = 32.94)
export function mirrorOverlay(ctx, t, V, o = {}) {
  const M = K.MIRROR, { h, z0, z1, wain } = K.HALL;
  const S = spoly(ctx, V, MQUAD); if (!S) return;
  ctx.save(); ctx.clip();
  const b = bbox(S), g = ctx.createLinearGradient(b.x0, b.y0, b.x1, b.y1); g.addColorStop(0, '#cfd2ca'); g.addColorStop(.5, K.PAL.mirror); g.addColorStop(1, '#c3c6bd');
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  // the reflected room (as the kit's mirrorRoom): the window wall, its wainscot, the floor between the glass and that wall
  fillP(ctx, V, [[MX, 0, z0], [MX, 0, z1], [MX, h, z1], [MX, h, z0]], '#b9a88e');
  fillP(ctx, V, [[MX, 0, z0], [MX, 0, z1], [MX, wain, z1], [MX, wain, z0]], '#8c7258');
  fillP(ctx, V, [[M.x, 0, z0], [MX, 0, z0], [MX, 0, z1], [M.x, 0, z1]], '#b18a5f');
  // a soft sheen across the glass (kit), drawn before the windows so the reflected windows stay pure plate
  const sh = ctx.createLinearGradient(b.x0, b.y0, b.x1, b.y1); sh.addColorStop(0, 'rgba(255,255,250,.1)'); sh.addColorStop(.5, 'rgba(255,255,250,0)'); sh.addColorStop(.8, 'rgba(255,255,250,.08)');
  ctx.fillStyle = sh; ctx.fillRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  // the reflected windows: bright pale silver light (the mirror plate itself)
  for (const out of WOUT) { if (spoly(ctx, V, out.map(([z, y]) => [MX, y, z]))) { ctx.save(); ctx.clip(); plate(ctx, t, 'mirror'); ctx.restore(); } }
  if (o.actors) o.actors(ctx, V);
  ctx.restore();
  // panel seams + the brass frame line on top
  ctx.strokeStyle = rgba('#7d7a70', .55); ctx.lineWidth = 1.2; ctx.beginPath(); for (let z = M.z0 + 3; z < M.z1 - .1; z += 3) V.seg(ctx, [M.x - .005, M.y0, z], [M.x - .005, M.y1, z]); ctx.stroke();
}

// ---------------------------------------------------------------- you + the machine (from sc01)
const DR = 11;
let TOP = null;
function top() {
  if (TOP) return TOP;
  const [, sg] = canvas(400, 400);
  const tp = K.athlete(sg, 200, 200, 1, K.curl(1), { t: 0, arm: 1 }).hand(0);
  return (TOP = [tp[0] - 200, tp[1] - 200]);
}
// the forklift state (c01 1.11): the forks hold your dumbbell, your arms thin
export const FORK = { curl: 0, arm: .85, armOut: 0, forkOut: 1, lift: 10, onFork: 1, glow: .2, refl: .85, dx: 0 };
export function drawGym(ctx, t, V, st, mir) {
  const T0 = top();
  const you = [K.YOU[0] + (st.dx || 0), 0, K.YOU[2] + (st.dz || 0)], mac = [K.MACHINE[0], 0, K.MACHINE[2] + (st.mz ?? st.dz ?? 0)];
  const pY = mir ? K.mirrorPt(you) : you, pM = mir ? K.mirrorPt(mac) : mac;
  const Y = K.sprite(V, pY), Mm = K.sprite(V, pM); if (!Y.vis || !Mm.vis || Y.k > 4000 || Mm.k > 4000) return;
  const sg = mir ? -1 : 1, km = Mm.k / 100;
  const toL = (p) => [sg * (p[0] - Mm.x) / km, (p[1] - Mm.y) / km], toS = (p) => [Mm.x + sg * p[0] * km, Mm.y + p[1] * km];
  const hipY = Y.y - 88 * Y.s;
  const topS = [Y.x + sg * T0[0] * Y.s, hipY + T0[1] * Y.s], topL = toL(topS);
  const fy = topL[1] + DR + 3 - st.lift, fork = st.fork ?? clamp((-fy - 16) / 134);
  if (!mir) { K.floorShadow(ctx, V, mac, .6, .3, .26); K.floorShadow(ctx, V, you, .4, .28, .3); }
  const reach = toL([Y.x - sg * 24 * Y.s, hipY - 46 * Y.s]);
  ctx.save(); ctx.translate(Mm.x, Mm.y); ctx.scale(sg * km, km);
  const mo = K.machine(ctx, t, { reach, armOut: st.armOut, fork, forkOut: st.forkOut, core: st.core ?? 1, noHand: true });
  ctx.restore();
  const pose = st.pose ? st.pose : { ...K.curl(st.curl), bulk: mir ? 1 + (st.refl - st.arm) * .3 : 1 };
  const hnd = K.athlete(ctx, Y.x, hipY, Y.s, pose, { t, arm: mir ? st.refl : st.arm, flip: mir, seed: 11 });
  const hp = toS(mo.hand); K.lightHand(ctx, t, hp[0], hp[1], mir ? Math.PI - mo.handAng : mo.handAng, { ...mo.handO, s: mo.handO.s * km });
  if (st.load) { const lp = toS([topL[0] + (st.loadDx || 0), -mix(16, 150, fork) - 3]); ctx.save(); ctx.translate(lp[0], lp[1]); ctx.scale(sg * km, km); st.load(ctx, t); ctx.restore(); }
  else { const hd = st.onFork ? toS([topL[0], -mix(16, 150, fork) - 3 - DR]) : hnd.hand(0); K.dumbbell(ctx, t, hd[0], hd[1], { r: DR * km, glow: st.glow }); }
  return { you: Y, machine: Mm, core: toS(mo.core), coreR: 23 * km };
}

// ---------------------------------------------------------------- the dumbbell rack along the mirror (RACK: x 10.2, z 18…23)
export const RACKBELLS = (() => { const b = []; for (const [y, n] of [[.98, 5], [.5, 5]]) for (let i = 0; i < n; i++) b.push({ y, z: 18.55 + i * 0.98 + (y < .7 ? .3 : 0) }); return b; })();
export function rack(ctx, t, V, o = {}) {
  const x0 = K.RACK.x - .22, x1 = K.RACK.x + .22, za = K.RACK.z0, zb = K.RACK.z1;
  K.floorShadow(ctx, V, [K.RACK.x, 0, (za + zb) / 2], .5, 2.6, .22);
  const wood = '#9d6c41', lit = '#c99a62', dark = '#6b4a30';
  // posts (far to near)
  const posts = [zb, (za + zb) / 2, za];
  for (const z of posts) for (const x of [x1, x0]) { const a = V.P([x, 0, z]), b = V.P([x, 1.12, z]); if (a.z > .2) { ctx.strokeStyle = x === x0 ? wood : dark; ctx.lineWidth = Math.max(1.5, a.k * .06); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
  // shelves: slanted boards (front lip lower), each with a lit top and a dark front
  for (const y of [.98, .5]) {
    fillP(ctx, V, [[x0, y - .04, za], [x1, y + .02, za], [x1, y + .02, zb], [x0, y - .04, zb]], lit);
    fillP(ctx, V, [[x0, y - .04, za], [x0, y - .04, zb], [x0, y - .1, zb], [x0, y - .1, za]], dark);
  }
  // dumbbells (seen from the side: bar + two discs), far to near
  const bells = RACKBELLS.map((d, i) => ({ ...d, i })).sort((p, q) => q.z - p.z);
  for (const d of bells) {
    if (o.skip && o.skip(d.i)) continue;
    const S = K.sprite(V, [K.RACK.x - .02, d.y + .12, d.z]); if (!S.vis) continue;
    const k = S.k / 100, dim = o.dust === d.i ? 1 : 0;
    K.dumbbell(ctx, t, S.x, S.y, { r: 11 * k, side: 1, glow: dim ? 0 : (o.glow ?? .14), dim });
    if (dim) {   // dust on the unused one: grey specks and a thread of cobweb to the post
      const r = prng(77); ctx.fillStyle = 'rgba(150,140,124,.55)'; for (let j = 0; j < 26; j++) ctx.fillRect(S.x + (r() - .5) * 28 * k, S.y + (r() - .6) * 22 * k, 1.2, 1.2);
      const p = V.P([K.RACK.x - .2, d.y + .4, d.z - .45]); if (p.z > .2) { ctx.strokeStyle = 'rgba(235,228,210,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(S.x - 12 * k, S.y - 9 * k); ctx.quadraticCurveTo((S.x + p.x) / 2, (S.y + p.y) / 2 + 6 * k, p.x, p.y); ctx.stroke(); }
    }
  }
}

// ---------------------------------------------------------------- the blackboard as c01 leaves it (Turkey, all chalk written)
const COOL = '#cfe6f2';
export function board01(ctx, B) {
  const U = 85;
  K.chalkText(ctx, 'Turkey  ·  almost 1,000 students  ·  math', 40, 58, { size: 34 });
  const base = 296, xs = { p: [110, 190, 270], e: [500, 580, 660] }, w = 56, cols = ['#efe9da', COOL, COOL];
  const dotB = (x, y) => { ctx.fillStyle = rgba(K.PAL.effort, .9); ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill(); };
  K.chalkText(ctx, 'practice', 218, 352, { size: 26, align: 'center' });
  K.chalkLine(ctx, [[80, base], [356, base]], { lw: 2.4 });
  K.chalkBar(ctx, xs.p[0], base, w, U * 1, { col: cols[0], seed: 1 });
  K.chalkBar(ctx, xs.p[1], base, w, U * 1.48, { col: cols[1], seed: 2 });
  K.chalkBar(ctx, xs.p[2], base, w, U * 2.27, { col: cols[2], seed: 3 });
  K.chalkText(ctx, '+48 %', xs.p[1] + w / 2, base - U * 1.48 - 12, { size: 22, align: 'center', col: COOL });
  K.chalkText(ctx, '+127 %', xs.p[2] + w / 2, base - U * 2.27 - 12, { size: 22, align: 'center', col: COOL });
  for (const [i, s] of [[0, 'none'], [1, 'machine'], [2, 'machine']]) K.chalkText(ctx, s, xs.p[i] + w / 2, base + 24, { size: 17, align: 'center', a: .75 });
  dotB(xs.p[2] + w / 2 + 34, base + 18);
  K.chalkText(ctx, 'exam', 608, 352, { size: 26, align: 'center' });
  K.chalkLine(ctx, [[470, base], [746, base]], { lw: 2.4 });
  K.chalkBar(ctx, xs.e[0], base, w, U, { col: cols[0], seed: 4 });
  K.chalkLine(ctx, [[xs.e[0] - 14, base - U], [xs.e[2] + w + 18, base - U]], { dash: [10, 9], lw: 2, a: .7 });
  K.chalkBar(ctx, xs.e[1], base, w, U * .83, { col: cols[1], seed: 5 });
  K.chalkText(ctx, '−17 %', xs.e[1] + w / 2, base - U * .83 + 26, { size: 22, align: 'center', col: COOL });
  K.chalkBar(ctx, xs.e[2], base, w, U, { col: cols[2], seed: 6 });
  for (const [i, s] of [[0, 'none'], [1, 'machine'], [2, 'machine']]) K.chalkText(ctx, s, xs.e[i] + w / 2, base + 24, { size: 17, align: 'center', a: .75 });
  dotB(xs.e[2] + w / 2 + 34, base + 18);
}

// ---------------------------------------------------------------- planar frames for small slanted surfaces
// origin o (world), unit directions u (local +x) and v (local +y, i.e. "down" on the surface), upm local units per metre → ctx.transform
export function planeFrame(V, o, u, v, upm) {
  const A = V.P(o), B = V.P([o[0] + u[0], o[1] + u[1], o[2] + u[2]]), C = V.P([o[0] + v[0], o[1] + v[1], o[2] + v[2]]);
  if (!(A.z > .1 && B.z > .1 && C.z > .1)) return null;
  return { a: (B.x - A.x) / upm, b: (B.y - A.y) / upm, c: (C.x - A.x) / upm, d: (C.y - A.y) / upm, e: A.x, f: A.y };
}

// ---------------------------------------------------------------- the pinned city map, drawn over the kit's (with a paper margin)
// The kit's cityMap is drawn inside an inner rectangle (MARG cm margin); the margin is blank paper. o.paper(ctx) paints the paper (the plate
// at the handoff), o.route: 0…1 the blue dot along ROUTE, o.fade: 0…1 how far the streets have faded behind it.
export const MARG = 34;
const MW = K.MAP.w, MHt = K.MAP.h, IW = MW - 2 * MARG, IH = MHt - 2 * MARG;
// the route of the blue dot in inner-map cm (follows the kit map's streets: an avenue-ish path through the grid)
export const ROUTE = (() => {
  // rebuild the kit's street curves (same prng order as cityMap seed 21) to find points on them
  const r = prng(21); for (let i = 0; i < 46; i++) { r(); r(); r(); r(); }
  const v = [], hz = [];
  for (let i = 1; i < 9; i++) { const x = i * IW / 9 + (r() - .5) * 10; v.push([x, x + (r() - .5) * 30, x + (r() - .5) * 16]); }
  for (let i = 1; i < 7; i++) { const y = i * IH / 7 + (r() - .5) * 8; hz.push([y, y + (r() - .5) * 24, y + (r() - .5) * 10]); }
  const qv = (c, s) => [(1 - s) * (1 - s) * c[0] + 2 * s * (1 - s) * c[1] + s * s * c[2], s * IH];          // vertical street i at param s
  const qh = (c, s) => [s * IW, (1 - s) * (1 - s) * c[0] + 2 * s * (1 - s) * c[1] + s * s * c[2]];          // horizontal street j
  const cross = (cv, chh) => { let best = null; for (let a = 0; a <= 400; a++) { const p = qv(cv, a / 400); const q = qh(chh, p[0] / IW); const d = Math.abs(q[1] - p[1]); if (!best || d < best.d) best = { d, s: a / 400, p }; } return best; };
  // the route: along horizontal street 1 from the left edge to vertical street 2, down it to horizontal 3, right to vertical 5, down to horizontal 5, right to vertical 7
  const legs = [['h', 1, null, 2], ['v', 2, 1, 3], ['h', 3, 2, 5], ['v', 5, 3, 5], ['h', 5, 5, 7]];
  const pts = [];
  const push = (p) => { const l = pts[pts.length - 1]; if (!l || Math.hypot(l[0] - p[0], l[1] - p[1]) > 1) pts.push(p); };
  for (const [kind, idx, from, to] of legs) {
    if (kind === 'h') {
      const c = hz[idx], x0 = from == null ? 0 : cross(v[from], c).p[0], x1 = cross(v[to], c).p[0];
      for (let k = 0; k <= 24; k++) push(qh(c, mix(x0, x1, k / 24) / IW));
    } else {
      const c = v[idx], s0 = cross(c, hz[from]).s, s1 = cross(c, hz[to]).s;
      for (let k = 0; k <= 16; k++) push(qv(c, mix(s0, s1, k / 16)));
    }
  }
  let L = 0; const cum = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cum.push(L); }
  return { pts, cum, L, at: (u) => { const d = clamp(u) * L; let i = 1; while (i < cum.length - 1 && cum[i] < d) i++; const q = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); return [mix(pts[i - 1][0], pts[i][0], q), mix(pts[i - 1][1], pts[i][1], q)]; } };
})();
export function mapC02(ctx, t, V, o = {}) {
  const M = K.MAP, z = M.z - .012;
  const quad = [[M.x0, M.y0, z], [M.x1, M.y0, z], [M.x1, M.y1, z], [M.x0, M.y1, z]];
  const F = K.wallFrame(V, M.x0, M.y1, z, 100); if (!F) return;
  ctx.save(); if (!V.poly(ctx, quad)) { ctx.restore(); return; } ctx.clip();
  if (o.paper) o.paper(ctx); else { ctx.fillStyle = K.PAL.paper; ctx.fillRect(0, 0, W, H); }
  ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f);
  // the printed map inside the margin (kit cityMap, its own paper is replaced by ours: draw it, then the paper shows through the margin)
  ctx.save(); ctx.translate(MARG, MARG); ctx.beginPath(); ctx.rect(0, 0, IW, IH); ctx.clip();
  mapInk(ctx, t, { w: IW, h: IH });
  // the streets fade behind the dot: paper laid over a band along the travelled route (a mask that follows the dot, never a global fade)
  const fu = clamp(o.fade ?? 0);
  if (fu > 0) {
    const P = ROUTE.pts, n = Math.max(2, Math.round(P.length * fu));
    ctx.strokeStyle = rgba(K.PAL.paper, .82); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [lw, a] of [[64, .55], [40, .75], [20, .9]]) { ctx.lineWidth = lw; ctx.strokeStyle = rgba('#f1e6cf', a); ctx.beginPath(); for (let i = 0; i < n; i++) (i ? ctx.lineTo(P[i][0], P[i][1]) : ctx.moveTo(P[i][0], P[i][1])); if (fu < 1) { const e = ROUTE.at(fu); ctx.lineTo(e[0], e[1]); } ctx.stroke(); }
  }
  // the blue dot (cool, small, a soft halo ring that breathes) and its trail
  const ru = o.route ?? -1;
  if (ru >= 0) {
    const p = ROUTE.at(ru), pulse = .5 + .5 * Math.sin(t * 3.2);
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 26 + 6 * pulse); g.addColorStop(0, 'rgba(110,170,215,.45)'); g.addColorStop(1, 'rgba(110,170,215,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 32, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fbfaf4'; ctx.beginPath(); ctx.arc(p[0], p[1], 10.5, 0, TAU); ctx.fill();
    ctx.fillStyle = '#4f8fc4'; ctx.beginPath(); ctx.arc(p[0], p[1], 7.5, 0, TAU); ctx.fill();
  }
  ctx.restore();
  // a fine printed border line around the inner map
  ctx.strokeStyle = rgba(K.PAL.inkSoft, .55); ctx.lineWidth = 1.6; ctx.strokeRect(MARG - 4, MARG - 4, IW + 8, IH + 8);
  ctx.restore();
  // pins (upper corners, outside the margin's lower part where the camera starts)
  for (const [x, y] of [[M.x0 + .12, M.y1 - .12], [M.x1 - .12, M.y1 - .12]]) { const p = V.P([x, y, z - .02]); if (p.z > .1) { ctx.fillStyle = '#b23a2a'; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.5, p.k * .04), 0, TAU); ctx.fill(); } }
}
// the kit's map ink (cityMap without its paper fill): blocks, river, streets, avenues
function mapInk(ctx, t, M) {
  const r = prng(21);
  ctx.fillStyle = '#e2d3b0';
  for (let i = 0; i < 46; i++) { const x = r() * M.w, y = r() * M.h, w = 18 + r() * 40, hh = 14 + r() * 30; ctx.fillRect(x, y, w, hh); }
  ctx.strokeStyle = rgba('#9fb8c4', .8); ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-10, M.h * .72); ctx.bezierCurveTo(M.w * .3, M.h * .6, M.w * .5, M.h * .95, M.w + 10, M.h * .8); ctx.stroke();
  ctx.strokeStyle = rgba(K.PAL.inkSoft, .75); ctx.lineWidth = 2.4; ctx.beginPath();
  for (let i = 1; i < 9; i++) { const x = i * M.w / 9 + (r() - .5) * 10; ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + (r() - .5) * 30, M.h / 2, x + (r() - .5) * 16, M.h); }
  for (let i = 1; i < 7; i++) { const y = i * M.h / 7 + (r() - .5) * 8; ctx.moveTo(0, y); ctx.quadraticCurveTo(M.w / 2, y + (r() - .5) * 24, M.w, y + (r() - .5) * 10); }
  ctx.stroke();
  ctx.strokeStyle = rgba('#b8661f', .7); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, M.h * .15); ctx.lineTo(M.w, M.h * .55); ctx.moveTo(M.w * .2, M.h); ctx.lineTo(M.w * .65, 0); ctx.stroke();
}

// ---------------------------------------------------------------- a mobile blackboard (slate on a wooden stand with castors)
// p = floor point under its centre, facing -z (toward the hall's front). Slate 240 × 140 cm, bottom edge at 0.95 m. o.chalk(ctx, S) in slate cm.
export const SLATE = { w: 240, h: 140, y0: .95 };
export function slate(ctx, t, V, p, o = {}) {
  const [x, , z] = p, hw = SLATE.w / 200, y0 = SLATE.y0, y1 = y0 + SLATE.h / 100, fr = .07;
  K.floorShadow(ctx, V, [x, 0, z + .05], hw + .2, .35, .22);
  // the stand: two uprights with feet + castors
  for (const sx of [x - hw - .02, x + hw + .02]) {
    const a = V.P([sx, .12, z + .02]), b = V.P([sx, y1 + .12, z + .02]); if (!(a.z > .2)) continue;
    ctx.strokeStyle = '#8a5d3b'; ctx.lineWidth = Math.max(1.5, a.k * .06); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.lineWidth = Math.max(1.5, a.k * .05); ctx.beginPath(); V.seg(ctx, [sx, .1, z - .28], [sx, .1, z + .32]); ctx.stroke();
    for (const dz of [-.26, .3]) { const c = V.P([sx, .05, z + dz]); if (c.z > .2) { ctx.fillStyle = '#4a3420'; ctx.beginPath(); ctx.arc(c.x, c.y, Math.max(1.2, c.k * .05), 0, TAU); ctx.fill(); } }
  }
  fillP(ctx, V, [[x - hw - fr, y0 - fr, z], [x + hw + fr, y0 - fr, z], [x + hw + fr, y1 + fr, z], [x - hw - fr, y1 + fr, z]], K.PAL.frame);
  const q = [[x - hw, y0, z - .006], [x + hw, y0, z - .006], [x + hw, y1, z - .006], [x - hw, y1, z - .006]];
  const S = V.poly(ctx, q); if (!S) return;
  const b = bbox(S), g = ctx.createLinearGradient(b.x0, b.y0, b.x1, b.y1); g.addColorStop(0, '#3c4a43'); g.addColorStop(.6, K.PAL.slate); g.addColorStop(1, K.PAL.slateDark); ctx.fillStyle = g; ctx.fill();
  const F = K.wallFrame(V, x - hw, y1, z - .007, 100);
  if (F) {
    ctx.save(); V.poly(ctx, q); ctx.clip(); ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f);
    const r = prng(9); ctx.strokeStyle = rgba(K.PAL.chalk, .045); ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const xx = r() * SLATE.w, yy = r() * SLATE.h, L = 40 + r() * 90; ctx.lineWidth = 6 + r() * 14; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.quadraticCurveTo(xx + L * .5, yy + (r() - .5) * 20, xx + L, yy + (r() - .5) * 14); ctx.stroke(); }
    if (o.chalk) o.chalk(ctx, SLATE, t);
    ctx.restore();
  }
  // chalk tray
  fillP(ctx, V, [[x - hw, y0 - .02, z - .01], [x + hw, y0 - .02, z - .01], [x + hw, y0 - .02, z - .12], [x - hw, y0 - .02, z - .12]], '#a57650');
}

// ---------------------------------------------------------------- nineteen doctors at the long table (Poland)
// the table runs along z at x 6.7…7.6, z 26.0…37.6; the doctors sit at x 6.35 facing +x (toward the mirror), each with a slanted
// reading stand (an engraved exam image, facing the doctor), a desk machine beside it and a stack of exam folders behind it.
export const DOCTORS = (() => { const d = []; for (let i = 0; i < 19; i++) d.push({ i, x: 6.35, z: 26.3 + i * .6, v: (i * 5 + 3) % 12 }); return d; })();
export const DTABLE = { x0: 6.72, x1: 7.6, z0: 25.95, z1: 37.55, y: .74 };
const COATS = ['#f3efe6', '#eef0ec', '#f4ede2'];
const HAIRS = ['short', 'long', 'curly', 'short', 'bun', 'long'];
const DSPR = new Map(); const DS = 1.6;
const docDress = (v) => ({ coat: COATS[v % 3], pants: ['#3a3f52', '#4a3d34', '#2e3448'][v % 3], shoes: '#2a221c', skin: K.PAL.skin[(v * 3 + 1) % K.PAL.skin.length], hair: ['#2a1a14', '#5a3a24', '#1c1420', '#8a8478', '#7a5232'][v % 5] });
const DOCPOSE = { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [.95, .75], el: [.9, 1.0], lean: .22, head: .3, coat: .6 };
export async function doctorsPrepare() {
  if (DSPR.size) return;
  const jobs = [];
  for (let v = 0; v < 12; v++) {
    const [c, g] = canvas(220, 360);
    figure(g, 110, 200, DS, { ...DOCPOSE, hair: HAIRS[v % HAIRS.length] }, { t: v * 1.3, seed: v + 40, dress: docDress(v), light: { x: -400, y: -200, col: '#fff1d6', a: .45 }, rim: '#fff1d6', rimSide: -1, shadow: false });
    jobs.push(loadImage(c.toBuffer('image/png')).then((im) => DSPR.set(v, im)));
  }
  await Promise.all(jobs);
}
// o: { lamp(d) 0…1 desk machine glow, mark(d) 0…1 the cool square on the image, stack(d) 0…1 folder stack height, live: Set of indices drawn
//      live (breathing), lean(d) extra lean 0…1 (looking alone), mirror: true (draw for the reflection: flipped) }
export function doctorsRow(ctx, t, V, o = {}) {
  const list = DOCTORS.map((d) => ({ d, z: V.toCam([d.x, .8, d.z])[2] })).filter((e) => e.z > .4).sort((a, b) => b.z - a.z);
  // the table first (one long top + front skirt), then per doctor far to near: stool, doctor, stand, machine, stack
  const T = DTABLE;
  if (!o.mirror) {
    ctx.strokeStyle = '#6b4a30'; const kk = V.P([T.x0, .4, (T.z0 + T.z1) / 2]).k || 50; ctx.lineWidth = Math.max(1, kk * .04); ctx.beginPath();
    for (const zz of [T.z0 + .08, (T.z0 + T.z1) / 2, T.z1 - .08]) for (const xx of [T.x0 + .06, T.x1 - .06]) V.seg(ctx, [xx, 0, zz], [xx, T.y, zz]);
    ctx.stroke();
  }
  fillP(ctx, V, [[T.x0, T.y, T.z0], [T.x0, T.y, T.z1], [T.x0, T.y - .07, T.z1], [T.x0, T.y - .07, T.z0]], '#8e6240');
  fillP(ctx, V, [[T.x0, T.y, T.z0], [T.x1, T.y, T.z0], [T.x1, T.y, T.z1], [T.x0, T.y, T.z1]], '#c99a66');
  for (const { d } of list) {
    if (!o.mirror) K.stool(ctx, V, [d.x - .05, 0, d.z]);
    const S = K.sprite(V, [d.x, 0, d.z]);
    if (S.vis && S.z > .7) {
      const hipY = S.y - 46 * S.s, lean = o.lean ? o.lean(d) : 0;
      if (o.live && o.live.has(d.i)) figure(ctx, S.x, hipY, S.s, { ...DOCPOSE, lean: DOCPOSE.lean + .1 * lean, head: DOCPOSE.head + .08 * lean, hair: HAIRS[d.v % HAIRS.length] }, { t, seed: d.v + 40, dress: docDress(d.v), light: { x: S.x - 900, y: S.y - 600, col: '#fff1d6', a: .45 }, rim: '#fff1d6', rimSide: -1, rimW: Math.max(1, .7 * S.s), shadow: false, flip: !!o.mirror });
      else {
        const im = DSPR.get(d.v % 12); if (im) {
          const k = S.s / DS, br = 1 + .004 * Math.sin(t * 1.45 + d.i * 1.7);   // a breath: the sprite swells a hair
          ctx.save(); ctx.translate(S.x, hipY); if (o.mirror) ctx.scale(-1, 1); ctx.scale(k, k * br); ctx.drawImage(im, -110, -200 + 8 * lean, 220, 360); ctx.restore();
        }
      }
    }
    standAt(ctx, t, V, d, o);
  }
}
// the slanted reading stand with the engraved exam image (a round endoscopic view: folds as engraved rings), the cool square, the desk machine, the stack
function standAt(ctx, t, V, d, o) {
  const z = d.z, xb = 6.9, xt = 7.12, yb = T_Y + .03, yt = T_Y + .31, hz = .17;
  const lamp = o.lamp ? o.lamp(d) : 0, mark = o.mark ? o.mark(d) : 0, st = o.stack ? o.stack(d) : 0;
  // stack of exam folders behind the stand (far side of the table): manila slabs, the top one a little turned
  if (st > 0) stackAt(ctx, V, [7.38, T_Y, z + .05], st, d.i);
  // the stand: a wooden board slanted toward the doctor (-x), a little ledge
  const q = [[xb, yb, z - hz], [xb, yb, z + hz], [xt, yt, z + hz], [xt, yt, z - hz]];
  const back = [[xb + .03, T_Y, z - hz + .02], [xt + .02, yt - .02, z - hz + .02], [xt + .02, yt - .02, z + hz - .02], [xb + .03, T_Y, z + hz - .02]];
  fillP(ctx, V, back, '#7a5236');
  if (fillP(ctx, V, q, '#b98d62')) {
    // the image: a plate of engraved paper on the board
    const F = planeFrame(V, [xt, yt, z - hz], [0, 0, 1], [(xb - xt), (yb - yt), 0].map((c) => c / Math.hypot(xb - xt, yb - yt)), 100);
    if (F) {
      ctx.save(); V.poly(ctx, q); ctx.clip(); ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f);
      const L = Math.hypot(xb - xt, yb - yt) * 100, Wd = hz * 200, cx = Wd / 2, cy = L / 2, R = Math.min(Wd, L) * .4;
      ctx.fillStyle = '#efe4cc'; ctx.fillRect(2, 2, Wd - 4, L - 4);
      const g = ctx.createRadialGradient(cx - R * .2, cy - R * .2, R * .1, cx, cy, R); g.addColorStop(0, '#e7b9a0'); g.addColorStop(.7, '#c98d78'); g.addColorStop(1, '#8a5a4a');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(70,40,30,.5)'; ctx.lineWidth = .9;
      for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.ellipse(cx + k * .6, cy + k * .4, R * (1 - k * .19), R * (1 - k * .19) * .85, .3, 0, TAU); ctx.stroke(); }
      ctx.fillStyle = 'rgba(60,30,24,.75)'; ctx.beginPath(); ctx.ellipse(cx + 2.4, cy + 1.6, R * .14, R * .11, .3, 0, TAU); ctx.fill();
      if (mark > 0) {   // the machine's cool light square around a tiny growth
        const mx = cx + R * .45 * Math.cos(d.i * 2.1), my = cy + R * .4 * Math.sin(d.i * 2.1), s = 5.2;
        const gl = ctx.createRadialGradient(mx, my, 0, mx, my, s * 2.6); gl.addColorStop(0, rgba(K.PAL.core, .7 * mark)); gl.addColorStop(1, rgba(K.PAL.core, 0)); ctx.fillStyle = gl; ctx.fillRect(mx - s * 2.6, my - s * 2.6, s * 5.2, s * 5.2);
        ctx.strokeStyle = rgba('#f4fbff', mark); ctx.lineWidth = 1.5; ctx.strokeRect(mx - s * mark, my - s * mark, 2 * s * mark, 2 * s * mark);
      }
      ctx.restore();
    }
  }
  // the desk machine beside the stand
  const S = K.sprite(V, [7.1, T_Y, z + .33]);
  if (S.vis && S.z > .5) { ctx.save(); ctx.translate(S.x, S.y); ctx.scale(S.k / 100, S.k / 100); K.deskMachine(ctx, t, { core: lamp, seed: d.i }); ctx.restore(); }
}
const T_Y = DTABLE.y;
// a stack of manila exam folders standing on the table (h up to 0.85 m at u = 1)
function stackAt(ctx, V, p, u, seed) {
  const [x, y, z] = p, hx = .14, hz = .12, hh = .85 * u, r = prng(seed * 13 + 5);
  const top = y + hh;
  fillP(ctx, V, [[x - hx, y, z - hz], [x - hx, y, z + hz], [x - hx, top, z + hz], [x - hx, top, z - hz]], '#c9a56c');   // front (toward the camera side, -x)
  fillP(ctx, V, [[x - hx, y, z - hz], [x + hx, y, z - hz], [x + hx, top, z - hz], [x - hx, top, z - hz]], '#a8854f');   // the near end (-z)
  fillP(ctx, V, [[x - hx, top, z - hz], [x + hx, top, z - hz], [x + hx, top, z + hz], [x - hx, top, z + hz]], '#e8d2a4');   // top
  // folder edges: thin lines every ~3 cm, a few paler sheets sticking out
  ctx.lineWidth = 1; ctx.beginPath();
  for (let yy = y + .03; yy < top - .005; yy += .03) { ctx.strokeStyle = 'rgba(110,80,40,.45)'; V.seg(ctx, [x - hx - .002, yy, z - hz], [x - hx - .002, yy, z + hz]); V.seg(ctx, [x - hx, yy, z - hz - .002], [x + hx, yy, z - hz - .002]); }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(250,240,215,.7)'; ctx.beginPath();
  for (let yy = y + .045; yy < top - .02; yy += .09 + r() * .06) V.seg(ctx, [x - hx - .006, yy, z - hz + .02 + r() * .05], [x - hx - .006, yy, z + hz - .03]);
  ctx.stroke();
}

// ---------------------------------------------------------------- the Go grid as c01 leaves it (a quiet game, the line of light: flat from
// 1950, bent up into the depth after the white stone of 2016; the black stone on the rising line glows warm). o: { glow, line: 0…1 bend drawn }
export const GAME = [[3, 15, 'b'], [4, 14, 'w'], [3, 13, 'w'], [5, 15, 'b'], [2, 14, 'b'], [15, 15, 'w'], [14, 16, 'b'], [16, 14, 'b'], [15, 3, 'w'], [16, 4, 'b'], [4, 3, 'b']];
const gpt = (i, j) => { const p = K.goPt(i, j); return [p[0], p[2]]; };
export const FLAT = [gpt(1, 6), gpt(11, 6)], BEND = [gpt(11, 6), gpt(12.4, 6.6), gpt(13.4, 8.4), gpt(14.2, 11.5), gpt(14.8, 15.5), gpt(15.2, 19.2)];
export function go01(ctx, V, t, o = {}) {
  for (const [i, j, c] of GAME) K.goStone(ctx, V, i, j, { col: c === 'b' ? 'black' : 'white' });
  K.floorLine(ctx, V, FLAT, { u: 1, w: .55 });
  K.floorLine(ctx, V, BEND, { u: o.bend ?? 1, w: .55 });
  K.goStone(ctx, V, 11, 7, { col: 'white' });
  K.goStone(ctx, V, 13, 9, { col: 'black', glow: o.glow ?? 1 });
}
