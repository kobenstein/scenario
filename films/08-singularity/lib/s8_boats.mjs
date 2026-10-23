// Film 8 · the open sea II (5.01 … 6.04): two boats (one drifts, one navigates), their wakes from one point, three amber marks
// (the choices), a storm front with lightning, a hand with a small compass ("yours") and a rose of light ringed by boats ("ours").
//   PATHS.drift / PATHS.nav           the two wakes' centre lines (world XZ, arc-length sampled); at(path, s) → { x, z, head }
//   boat(ctx, t, C, B)               a small sailing boat; B: { x, z, head, roll, sail 'full'|'slack'|'none', fig 'sight'|null, lantern 0..1,
//                                    light: screen point of the main light (rim), star: screen point the figure sights }
//   wake(ctx, t, C, path, s1, o)     the wake behind a boat at arc length s1
//   marks(ctx, t, C, pts, on[])      the amber marks on the water (on[i] 0..1)
//   storm(ctx, t, C, o)              the storm front on the horizon (o: { az, flash 0..1, bolt seed })
//   handCompass(ctx, t, o)           the hand with the small compass (screen space; o: { y, glow, needle })
//   rose(ctx, t, C, o)               the rose of light on the water + its ring of boats (o: { x, z, R, a, lamps })
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projRuns, projPoly, fillPoly, mixHex, hash, spline, nz, eoX, sio, u01 } from './s8_kit.mjs';
import { waterY } from './s8_sea.mjs';
import { skyDir } from './s8_sky.mjs';
import { figure, handPos } from './figure.mjs';
import { hand } from './hand.mjs';

// ---------------------------------------------------------------- paths (arc-length sampled polylines in XZ)
function sampled(fn, s1, ds = .25) {
  const pts = []; let L = 0, prev = null;
  for (let u = 0; ; u += ds * .5) { const p = fn(u); if (prev) L += Math.hypot(p[0] - prev[0], p[1] - prev[1]); pts.push([p[0], p[1], L]); prev = p; if (L > s1) break; }
  return pts;
}
export const ORIGIN = [0, 2];
// the navigator: straight runs with three small turns (the choices)
const NAVK = [[0, 2], [.3, 8], [2.0, 13.4], [5.3, 17.6], [5.3 + .813 * 300, 17.6 + .582 * 300]];
export const NAVH = .95;   // the navigator's final heading
function navFn(u) {   // u = rough distance along; rounded corners
  let acc = 0;
  for (let i = 0; i < NAVK.length - 1; i++) {
    const a = NAVK[i], b = NAVK[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (u <= acc + L || i === NAVK.length - 2) { const v = (u - acc) / L; return [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v]; }
    acc += L;
  }
}
const driftFn = (u) => [.05 * u + 2.4 * Math.sin(u * .23) - 1.1 * Math.sin(u * .51 + .5) + 1.1 * Math.sin(.5), ORIGIN[1] + .52 * u + 2.6 * Math.sin(u * .23 + 1.9) - 2.6 * Math.sin(1.9)];
export const PATHS = { nav: sampled(navFn, 330, .2), drift: sampled(driftFn, 120, .2) };
export const TURNS = [NAVK[1], NAVK[2], NAVK[3]];
export function at(P, s) {
  s = clamp(s, 0, P[P.length - 1][2]);
  let lo = 0, hi = P.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m][2] < s) lo = m; else hi = m; }
  const a = P[lo], b = P[hi], v = (s - a[2]) / Math.max(1e-6, b[2] - a[2]);
  const i0 = Math.max(0, lo - 3), i1 = Math.min(P.length - 1, hi + 3);
  return { x: a[0] + (b[0] - a[0]) * v, z: a[1] + (b[1] - a[1]) * v, head: Math.atan2(P[i1][0] - P[i0][0], P[i1][1] - P[i0][1]) };
}
// smooth the corners of the nav path a little (so the wake bends, not kinks)
{ const P = PATHS.nav, Q = P.map((p, i) => { let x = 0, z = 0, n = 0; for (let j = -6; j <= 6; j++) { const q = P[clamp(i + j, 0, P.length - 1)]; x += q[0]; z += q[1]; n++; } return [x / n, z / n, p[2]]; }); PATHS.nav = Q; }

// ---------------------------------------------------------------- a small sailing boat
const HULL = (() => { const g = [], w = []; const L = 5.4; for (let i = 0; i <= 16; i++) { const v = i / 16, s = -L / 2 + v * L, bw = .92 * Math.pow(Math.sin(Math.PI * (.08 + .92 * v)), .62) * (v > .8 ? 1 - (v - .8) * 1.6 : 1); g.push([bw, .62 + .25 * Math.pow(v, 3), s]); w.push([bw * .78, 0, s * .93]); } return { g, w }; })();
export function frameOf(B, t) {
  const h = B.head, fx = Math.sin(h), fz = Math.cos(h), rx = Math.cos(h), rz = -Math.sin(h);
  const y0 = waterY(B.x, B.z, t) * .7, roll = (B.roll ?? 0) + .045 * Math.sin(t * 1.3 + B.x), pit = .03 * Math.sin(t * 1.1 + B.z * .5);
  const cr = Math.cos(roll), sr = Math.sin(roll);
  return (u, v, w) => { const uu = u * cr - v * sr, vv = u * sr + v * cr + w * pit; return [B.x + rx * uu + fx * w, y0 + vv, B.z + rz * uu + fz * w]; };
}
export function boat(ctx, t, C, B) {
  const F = frameOf(B, t), sc = B.scale ?? 1;
  const L = (u, v, w) => F(u * sc, v * sc, w * sc);
  const c0 = C.P(...L(0, .4, 0)); if (!c0 || c0[0] < -900 || c0[0] > 2820) return null;
  const dC = C.depth(...L(0, .4, 0)), lan = B.lantern ?? 0, light = B.light;
  const gp = [...HULL.g.map(([u, v, w]) => [u, v, w]), ...HULL.g.slice().reverse().map(([u, v, w]) => [-u, v, w])];
  const wp = [...HULL.w.map(([u, v, w]) => [u, v, w]), ...HULL.w.slice().reverse().map(([u, v, w]) => [-u, v, w])];
  const G = gp.map((p) => L(...p)), Wl = wp.map((p) => L(...p));
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // the hull's shadow / dark water under it
  fillPoly(ctx, projPoly(C, wp.map(([u, v, w]) => L(u * 1.35, -.02, w * 1.08))), 'rgba(2,2,8,.55)');
  const quads = [];
  for (let i = 0; i < G.length; i++) { const j = (i + 1) % G.length, q = [G[i], G[j], Wl[j], Wl[i]], d = q.reduce((a, p) => a + C.depth(...p), 0) / 4; quads.push([d, q, i]); }
  const far = quads.filter((q) => q[0] >= dC), near = quads.filter((q) => q[0] < dC);
  const side = (list) => { list.sort((a, b) => b[0] - a[0]); for (const [, q, i] of list) { const P = projPoly(C, q); if (P.length < 3) continue; const lit = .5 + .5 * Math.sin(i * .2); fillPoly(ctx, P, mixHex('#0d0c18', '#22203a', lit * .6 + lan * .2)); ctx.strokeStyle = mixHex('#0d0c18', '#22203a', lit * .6 + lan * .2); ctx.lineWidth = 1; ctx.stroke(); } };
  side(far);
  fillPoly(ctx, projPoly(C, G), '#07060e');   // inside the hull (dark)
  if (lan > 0) { const lp = C.P(...L(0, .7, -1.7)); if (lp) { ctx.save(); fillPoly(ctx, projPoly(C, G)); ctx.clip(); const g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], lp[2] * 2.2); g.addColorStop(0, rgba('#ff9a4a', .45 * lan)); g.addColorStop(1, rgba('#7a2a10', 0)); ctx.fillStyle = g; ctx.fillRect(lp[0] - lp[2] * 3, lp[1] - lp[2] * 3, lp[2] * 6, lp[2] * 6); ctx.restore(); } }
  side(near);
  // gunwale rim (starlight; amber near the lantern)
  { const R = projRuns(C, [...G, G[0]]); ctx.strokeStyle = rgba(lan > .3 ? '#ffc890' : '#a4b0dc', .45 + .3 * lan); ctx.lineWidth = Math.max(1, c0[2] * .018); for (const r of R) { ctx.beginPath(); r.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  // the waterline foam
  { const R = projRuns(C, [...Wl.map((p) => [p[0], p[1] + .02, p[2]]), Wl[0]]); ctx.strokeStyle = rgba('#c8d4f0', .3); ctx.lineWidth = Math.max(1, c0[2] * .02); for (const r of R) { ctx.beginPath(); r.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  // the figure (in the stern) — drawn before the sail when the sail is nearer
  const figAt = L(0, .62, -1.55), fp = C.P(...figAt), sailD = C.depth(...L(B.sailSide ?? .4, 2.6, -.3));
  let out = { lantern: null, hand: null };
  const drawFig = () => {
    if (!B.fig || !fp) return;
    const s = fp[2] * 1.72 / 184 * sc, scr = C.P(...L(0, .62, 1)), flip = scr ? scr[0] < fp[0] : false;
    const pose = { sh: [2.62, .3], el: [.12, .35], head: -.42, lean: -.04 };
    const o = { t, seed: 3, light: light ? { x: light[0], y: light[1], col: '#d8e4ff', a: .6 } : undefined, rim: '#a4b0dc', dress: { coat: '#1a1a2e', pants: '#0e0d1c', skin: '#3a2a26', hair: '#0c0a12' }, shadow: false };
    figure(ctx, fp[0], fp[1] - 90 * s, s, pose, { ...o, flip });
    out.hand = handPos(fp[0], fp[1] - 90 * s, s, pose, 0, flip, o);
  };
  const figFirst = !fp || C.depth(...figAt) > sailD;
  if (figFirst) drawFig();
  // mast, sail
  if (B.sail !== 'none') {
    const mf = L(0, .62, .9), mt = L(0, 5.6, .9), a = C.P(...mf), b = C.P(...mt);
    if (a && b) { ctx.strokeStyle = '#0a0912'; ctx.lineWidth = Math.max(1.2, a[2] * .07); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.strokeStyle = rgba('#a4b0dc', .35); ctx.lineWidth = Math.max(.8, a[2] * .02); ctx.stroke(); }
    const slack = B.sail === 'slack', side = B.sailSide ?? .4, pts = [];
    const boom = slack ? .35 * Math.sin(t * .9 + 1) + .2 * Math.sin(t * 2.3) : side;   // the slack boom swings, the full one is sheeted in
    const clew = [boom * 2.2, 1.05, .9 - 2.6 * Math.cos(boom * .5)];
    for (let i = 0; i <= 10; i++) { const v = i / 10; pts.push([0, .95 + v * 4.55, .9]); }   // luff (along the mast)
    for (let i = 1; i <= 12; i++) { const v = i / 12, bul = (slack ? .25 * Math.sin(v * Math.PI * 3 + t * 4.1) * Math.sin(Math.PI * v) : .55 * Math.sin(Math.PI * v)) * (side >= 0 ? 1 : -1); pts.push([clew[0] * v + bul * .6, 5.5 + (clew[1] - 5.5) * v, .9 + (clew[2] - .9) * v]); }   // leech
    for (let i = 1; i < 6; i++) { const v = i / 6, bul = (slack ? .1 : .3) * Math.sin(Math.PI * v); pts.push([clew[0] * (1 - v) + bul, 1.05 - .1 * v, clew[2] + (.9 - clew[2]) * v]); }   // foot
    const SP = projPoly(C, pts.map((p) => L(...p)));
    if (SP.length > 2) {
      fillPoly(ctx, SP, slack ? '#262438' : '#2e2c46');
      ctx.save(); fillPoly(ctx, SP); ctx.clip();
      const top = C.P(...L(0, 5.5, .9)), bot = C.P(...L(clew[0], 1.05, clew[2]));
      if (top && bot) { const g = ctx.createLinearGradient(top[0], top[1], bot[0], bot[1]); g.addColorStop(0, rgba('#8a90b8', .35)); g.addColorStop(1, rgba(lan > 0 ? '#ffb070' : '#0a0a18', lan > 0 ? .35 * lan : .4)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
      ctx.strokeStyle = rgba('#0a0a18', .35); ctx.lineWidth = Math.max(.6, c0[2] * .008);   // seams
      for (let k = 1; k < 5; k++) { const v = k / 5, a1 = C.P(...L(0, .95 + v * 4.55, .9)), b1 = C.P(...L(clew[0] * (1 - v) * .9, 5.5 + (clew[1] - 5.5) * (1 - v), .9 + (clew[2] - .9) * (1 - v))); if (a1 && b1) { ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(b1[0], b1[1]); ctx.stroke(); } }
      ctx.restore();
      ctx.strokeStyle = rgba('#c8cff0', .32); ctx.lineWidth = Math.max(1, c0[2] * .012); ctx.beginPath(); SP.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
    }
  }
  if (!figFirst) drawFig();
  // the lantern on a short pole at the stern
  if (lan > 0) {
    const p = C.P(...L(-.5, 1.35, -2.4)), q = C.P(...L(-.5, .6, -2.4));
    if (p && q) {
      ctx.strokeStyle = '#0a0912'; ctx.lineWidth = Math.max(1, p[2] * .04); ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0], p[1] - p[2] * .1); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter'; const fl = 1 + .06 * Math.sin(t * 9.1 + B.x) + .04 * Math.sin(t * 23.7);
      const R = p[2] * 1.6 * fl, g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, rgba('#fff1d6', .95 * lan)); g.addColorStop(.12, rgba('#ffb35c', .6 * lan)); g.addColorStop(.4, rgba('#ff8a3a', .12 * lan)); g.addColorStop(1, rgba('#c4512e', 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba('#fff6e2', lan); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(1.2, p[2] * .07), 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      out.lantern = [p[0], p[1], C.P(...L(-.5, 0, -2.4))];
    }
  }
  ctx.restore();
  return out;
}

// ---------------------------------------------------------------- the wake: foam lines spreading behind the boat, fading with age
export function wake(ctx, t, C, P, s1, o = {}) {
  const a0 = o.a ?? 1, step = o.step ?? .5, n = Math.floor(s1 / step);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const sides = [[], [], []];
  for (let i = n; i >= 0; i--) {
    const s = i * step, p = at(P, s), age = s1 - s; if (age > (o.maxAge ?? 1e9)) continue; const w = .45 + .11 * Math.sqrt(age) * 3 + .02 * age, rx = Math.cos(p.head), rz = -Math.sin(p.head);
    const wob = .08 * Math.sin(s * 2.1 + t * 1.5);
    sides[0].push([p.x + rx * (w + wob), .02, p.z + rz * (w + wob), age]); sides[1].push([p.x - rx * (w - wob), .02, p.z - rz * (w - wob), age]); sides[2].push([p.x, .02, p.z, age]);
  }
  const mn = o.min ?? .18, fade = (age) => a0 * (mn + (1 - mn) * Math.exp(-age / (o.life ?? 18)));
  for (let k = 0; k < 3; k++) {
    const pts = sides[k];
    for (let i = 0; i < pts.length - 1; i += 1) {
      const A = pts[i], Bp = pts[i + 1], g = hash(i * 1.37 + k * 7.1 + Math.floor((t * .8 + i * .1)) * .0); if (k < 2 ? g < .22 : g < .55) continue;
      const pa = C.P(A[0], A[1], A[2], .3), pb = C.P(Bp[0], Bp[1], Bp[2], .3); if (!pa || !pb) continue;
      const al = fade(A[3]) * (k === 2 ? .45 : .7) * clamp((C.depth(A[0], A[1], A[2]) - 3) / 9);
      if (al < .01) continue;
      ctx.strokeStyle = rgba(o.col || '#c8d4f0', al); ctx.lineWidth = clamp(pa[2] * (k === 2 ? .09 : .045), .7, 4);
      ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the marks: three amber points on the water at the turns (they light one by one)
export function marks(ctx, t, C, pts, on) {
  ctx.save();
  pts.forEach(([X, Z], i) => {
    const u = on[i] || 0; if (u <= 0) return;
    const p = C.P(X, .05, Z, .3); if (!p) return;
    const k = p[2], br = 1 + .08 * Math.sin(t * 3.1 + i * 2);
    ctx.globalCompositeOperation = 'lighter';
    const R = Math.max(14, k * 1.6) * br * (.6 + .4 * eoX(u)), g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R);
    g.addColorStop(0, rgba('#fff1d6', .95 * u)); g.addColorStop(.15, rgba('#ffb35c', .7 * u)); g.addColorStop(.5, rgba('#ff8a3a', .14 * u)); g.addColorStop(1, rgba('#c4512e', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.fill();
    // a ring that runs out over the water once when it lights (on the water plane)
    const rr = .3 + 2.8 * eoX(Math.min(1, u * 1.2)), ra = (1 - u) * .9 + .12;
    const ring = []; for (let a = 0; a <= 48; a++) { const th = a / 48 * TAU; ring.push([X + Math.sin(th) * rr, .03, Z + Math.cos(th) * rr]); }
    for (const run of projRuns(C, ring, .3)) { ctx.strokeStyle = rgba('#ffb35c', ra * Math.min(1, u * 3)); ctx.lineWidth = Math.max(1, k * .05); ctx.beginPath(); run.forEach((q, j) => (j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';
  });
  ctx.restore();
}

// ---------------------------------------------------------------- the storm front: an anvil of cloud on the horizon, rain curtains, lightning inside
const STORM = (() => {   // outline (x across −1..1, el): flat base, cumulus body with bulges, a wide anvil that overhangs both sides
  const r = prng(4411), P = [];
  const body = (y) => .5 + .06 * Math.sin(y * 90) + .05 * Math.sin(y * 210 + 1) - .5 * (y - .03);
  P.push([.56, .03]); for (let i = 1; i <= 8; i++) { const y = .03 + i / 8 * .12; P.push([body(y) + .03 * (r() - .5), y]); }
  P.push([.75, .162], [.98, .176], [1.04, .184], [.9, .194], [.6, .204], [.3, .21], [0, .214], [-.3, .21], [-.6, .202], [-.95, .19], [-1.08, .181], [-1.0, .174], [-.75, .165]);
  for (let i = 8; i >= 1; i--) { const y = .03 + i / 8 * .12; P.push([-body(y + .3) - .03 * (r() - .5), y]); }
  P.push([-.56, .03]);
  return P;
})();
export function storm(ctx, t, C, o) {
  const az0 = o.az, wd = o.w ?? .3, dr = t * .0015;
  const D = (x, el) => C.D(...skyDir(az0 + x * wd + dr, el));
  const shape = STORM.map(([x, e]) => D(x, e)), base = [D(.5, .03), D(0, .03), D(-.5, .03)], top = shape.slice(9, 23);
  if (shape.some((p) => !p)) return;
  ctx.save();
  // rain curtains (under the cloud, slanted hatching down to the horizon)
  const hy = C.hy, b0 = base[2];
  ctx.strokeStyle = rgba('#34345a', .6); ctx.lineWidth = 1.6; ctx.beginPath();
  for (let i = 0; i < 70; i++) { const x = -.45 + .9 * hash(i * 3.1), p = D(x, .03), dens = .5 + .5 * Math.sin(x * 7 + 1); if (!p || hash(i * 7.7) > dens) continue; const sl = (8 + 6 * hash(i)) * (1 + .1 * Math.sin(t * 2 + i)); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] - sl, hy + 1); }
  ctx.stroke();
  // the cloud: dark, a cool rim from the moonless sky along the top
  ctx.beginPath(); spline(ctx, shape, true); ctx.fillStyle = '#100f22'; ctx.fill();
  ctx.save(); ctx.clip();
  const g = ctx.createLinearGradient(0, Math.min(...top.map((p) => p[1])), 0, b0[1]); g.addColorStop(0, rgba('#3a3a62', .5)); g.addColorStop(.4, rgba('#1a1a34', .2)); g.addColorStop(1, rgba('#06060e', .4));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  // billows (engraved arcs)
  ctx.strokeStyle = rgba('#4a4a78', .35); ctx.lineWidth = 1.2;
  for (let i = 0; i < 26; i++) { const x = -.8 + 1.6 * hash(i * 1.9 + 3), e = Math.abs(x) < .4 ? .05 + .12 * hash(i * 4.3) : .15 + .03 * hash(i * 4.3), p = D(x, e); if (!p) continue; const r = 14 + 26 * hash(i * 2.2); ctx.beginPath(); ctx.arc(p[0], p[1], r, Math.PI * 1.05, Math.PI * 1.9); ctx.stroke(); }
  // lightning inside: the cloud lights from within
  const f = o.flash || 0;
  if (f > 0) {
    const c = D(o.fx ?? -.15, .08), R = 380; const lg = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R);
    lg.addColorStop(0, rgba('#e8f4ff', .8 * f)); lg.addColorStop(.3, rgba('#8fb8e6', .35 * f)); lg.addColorStop(1, rgba('#3a4a7a', 0));
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lg; ctx.fillRect(0, 0, 1920, 1080);
  }
  ctx.restore();
  ctx.strokeStyle = rgba('#7a80b0', .45); ctx.lineWidth = 1.5; ctx.beginPath(); spline(ctx, top, false); ctx.stroke();
  if (f > .5) {   // the bolt: cloud base to the sea, jagged, with one branch
    const r = prng(o.bolt || 7), s = D(o.fx ?? -.15, .03), pts = [[s[0], s[1]]]; let x = s[0], y = s[1];
    while (y < hy) { y += 14 + 20 * r(); x += (r() - .5) * 34; pts.push([x, Math.min(y, hy)]); }
    ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'miter';
    for (const [lw, a] of [[10, .15], [3.2, .6], [1.4, 1]]) { ctx.strokeStyle = rgba(lw > 2 ? '#a8d0ff' : '#ffffff', a * f); ctx.lineWidth = lw; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); const m = pts[Math.floor(pts.length * .4)]; if (m) { ctx.moveTo(m[0], m[1]); ctx.lineTo(m[0] + 28, m[1] + 22); ctx.lineTo(m[0] + 40, m[1] + 50); } ctx.stroke(); }
    const sea = ctx.createRadialGradient(x, hy + 4, 0, x, hy + 4, 260); sea.addColorStop(0, rgba('#a8d0ff', .2 * f)); sea.addColorStop(1, rgba('#a8d0ff', 0)); ctx.fillStyle = sea; ctx.fillRect(x - 260, hy - 40, 520, 300);
  }
  ctx.restore();
  return { center: D(-.1, .08) };
}

// ---------------------------------------------------------------- the hand with the small compass ("yours"), screen space
export function handCompass(ctx, t, o) {
  const x = o.x ?? 1290, y = o.y, s = o.s ?? 3.1, glow = o.glow ?? 0, br = 1 + .006 * Math.sin(t * 1.4), ang = -Math.PI / 2 - .2 + .015 * Math.sin(t * .9);
  ctx.save();
  // the warm light on the hand from the compass
  hand(ctx, x, y, s * br, { pose: 'cup', ang, flip: false, skin: '#8a5a40', sleeve: '#1e1d30', sleeveLen: 300, rim: glow > .05 ? '#ffc27a' : '#6a70a0', light: [-.2, -1], t, seed: 4 });
  // the compass sits in the palm (palm centre ≈ 30 units along the hand direction)
  const pcx = x + Math.cos(ang) * 34 * s, pcy = y + Math.sin(ang) * 34 * s, R = 30 * s, e = .62;
  // case
  ctx.fillStyle = '#2a1e12'; ctx.beginPath(); ctx.ellipse(pcx, pcy + R * .16, R * 1.02, R * e * 1.02, 0, 0, TAU); ctx.fill();
  const brass = mixHex('#6a5030', '#e6b86a', .3 + .55 * glow); ctx.fillStyle = brass; ctx.beginPath(); ctx.ellipse(pcx, pcy, R, R * e, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex('#4a4658', '#f3e6c4', .25 + .7 * glow); ctx.beginPath(); ctx.ellipse(pcx, pcy, R * .84, R * e * .84, 0, 0, TAU); ctx.fill();
  // ticks + rose (in the tilted disc: a scaled circle)
  ctx.save(); ctx.translate(pcx, pcy); ctx.scale(1, e);
  ctx.strokeStyle = rgba('#2a1a0c', .65); ctx.lineWidth = 1.2; ctx.beginPath();
  for (let i = 0; i < 48; i++) { const a = i / 48 * TAU, r0 = R * (i % 4 ? .78 : .72); ctx.moveTo(Math.sin(a) * r0, -Math.cos(a) * r0); ctx.lineTo(Math.sin(a) * R * .82, -Math.cos(a) * R * .82); }
  ctx.stroke();
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, L = i % 2 ? .42 : .64; ctx.fillStyle = rgba('#2a2420', i % 2 ? .25 : .45); ctx.beginPath(); ctx.moveTo(Math.sin(a) * R * L, -Math.cos(a) * R * L); ctx.lineTo(Math.sin(a + 1.2) * R * .1, -Math.cos(a + 1.2) * R * .1); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); }
  // the needle (swings, settles), north half amber, glowing on "Yours"
  const na = o.needle ?? 0; ctx.rotate(na);
  ctx.fillStyle = '#1a1622'; ctx.beginPath(); ctx.moveTo(0, R * .62); ctx.lineTo(-R * .07, 0); ctx.lineTo(R * .07, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex('#8a4a20', '#ffcf8a', glow); ctx.beginPath(); ctx.moveTo(0, -R * .66); ctx.lineTo(-R * .07, 0); ctx.lineTo(R * .07, 0); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.fillStyle = mixHex('#5a4020', '#f0c27a', .4 + .5 * glow); ctx.beginPath(); ctx.arc(pcx, pcy, R * .05, 0, TAU); ctx.fill();
  // glass highlight + rim
  ctx.strokeStyle = rgba('#ffffff', .18 + .1 * glow); ctx.lineWidth = R * .04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(pcx, pcy, R * .7, R * e * .7, 0, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
  ctx.strokeStyle = rgba('#ffd08a', .3 + .5 * glow); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(pcx, pcy, R, R * e, 0, Math.PI, TAU); ctx.stroke();
  if (glow > 0) {
    ctx.globalCompositeOperation = 'lighter'; const nx = pcx + Math.sin(na) * R * .3, ny = pcy - Math.cos(na) * R * .3 * e, GR = R * 2.6 * (1 + .03 * Math.sin(t * 6.28));
    const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, GR); g.addColorStop(0, rgba('#ffb35c', .75 * glow)); g.addColorStop(.25, rgba('#ff8a3a', .22 * glow)); g.addColorStop(1, rgba('#c4512e', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(nx, ny, GR, 0, TAU); ctx.fill();
  }
  ctx.restore();
  return [pcx, pcy];
}

// ---------------------------------------------------------------- the rose of light on the water ("ours") and its ring of boats
const RING = (() => { const r = prng(808), a = []; for (let i = 0; i < 28; i++) { const th = i / 28 * TAU + (r() - .5) * .12; a.push({ th, rr: 1.18 + .1 * r(), head: th + Math.PI / 2 + (r() - .5) * .4, ign: r(), sc: .8 + .25 * r() }); } return a; })();
export function roseBoats(R) { return RING.map((b) => ({ ...b, rr: b.rr * R })); }
export function rose(ctx, t, C, o) {
  const { x: X0, z: Z0, R } = o, a = o.a ?? 0;
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const W = (X, Z) => [X0 + X, .04, Z0 + Z];
  const line = (pts, col, al, lw) => { for (const run of projRuns(C, pts.map(([X, Z]) => W(X, Z)), .3)) { ctx.strokeStyle = rgba(col, al); ctx.lineWidth = lw; ctx.beginPath(); run.forEach((q, j) => (j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); } };
  const k = (C.P(X0, 0, Z0, .3) || [0, 0, 20])[2];
  const draw = (u) => clamp(a * 1.6 - u * .6);   // draws from the centre outward
  // the glow pool
  const A = C.plane([X0, .03, Z0], [1, 0, 0], [0, 0, 1]);
  if (A) { ctx.save(); ctx.transform(...A); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.25); g.addColorStop(0, rgba('#ffb35c', .32 * a)); g.addColorStop(.5, rgba('#c4512e', .1 * a)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R * 1.25, 0, TAU); ctx.fill(); ctx.restore(); }
  // rings
  for (const [rr, al] of [[.32, .7], [.62, .5], [1, .9]]) { const u = draw(rr); if (u <= 0) continue; const n = 120, pts = []; for (let i = 0; i <= n * u; i++) { const th = i / n * TAU + t * .02; pts.push([Math.sin(th) * R * rr, Math.cos(th) * R * rr]); } line(pts, '#ffd9a0', al * a, Math.max(1, k * .1)); line(pts, '#ff9a4a', al * .3 * a, Math.max(3, k * .5)); }
  // ticks on the outer ring
  { const u = draw(1); if (u > 0) for (let i = 0; i < 32; i++) { const th = i / 32 * TAU + t * .02, L = i % 8 ? (i % 2 ? .05 : .08) : .14; line([[Math.sin(th) * R * (1 - L), Math.cos(th) * R * (1 - L)], [Math.sin(th) * R, Math.cos(th) * R]], '#ffd9a0', .8 * a * u, Math.max(1, k * .08)); } }
  // the 16-point star (lines from the centre)
  for (let i = 0; i < 16; i++) {
    const th = i / 16 * TAU + t * .02, L = i % 4 === 0 ? .95 : i % 2 === 0 ? .7 : .45, u = draw(L * .6); if (u <= 0) continue;
    const tip = [Math.sin(th) * R * L * u, Math.cos(th) * R * L * u], w = R * (i % 4 === 0 ? .09 : .06), l = [Math.sin(th - Math.PI / 2) * w, Math.cos(th - Math.PI / 2) * w], r = [Math.sin(th + Math.PI / 2) * w, Math.cos(th + Math.PI / 2) * w];
    line([l, tip, r], '#ffe2b0', (i % 4 === 0 ? .9 : .55) * a, Math.max(1, k * .08));
  }
  ctx.restore();
}
