// Film 8 · the navigators and their sky (owner B1; first use c03.04; B2 c06, c07; B3 c10, c11). Builds on s8_canoe (Hōkūleʻa, the seated
// navigator, the fire box, the star compass on the water). STUB: the signatures below are final; the drawing grows while B1 builds c03.
//
//   re-exported from s8_canoe:  canoe(ctx, t, C, K), canoeFrame(K, t), sitter(ctx, t, f, X, Y, k, L, o), flames(ctx, t, bx, by, k),
//                               starCompass(ctx, t, C, K, o) (the ring on the water round K), route(ctx, t, C, K, u), island(ctx, t, C, o)
//   starRing(ctx, t, C, o)      the star compass ring round ANY world point, in a horizontal plane (c03.17 round Mau's chest, c11 many rings):
//                               o: { c: [X, Y, Z], R (m), u 0..1 draw-on, glow 1, breath 0 (0..1: the ring breathes ±3 % with a sitter),
//                               ticks true (32 houses), col '#ffe2b0' }  → { front: [sx, sy] (nearest point on screen) }
//   tern(ctx, t, C, o)          a white tern and its flight line: o: { path: (u) → [X, Y, Z] (world), u 0..1 (where it is), trail .25 (how
//                               much of the path behind it is drawn as a line), s .35 (wingspan m), line 1 (the line's alpha) }
//                               → { at: [sx, sy], tail: [sx, sy] (the line's far end) }
//   starPath(ctx, t, C, from, to, u, o)   a dotted star path (cyan) from a sky direction from = [az, el] down to a world point to = [X, Y, Z],
//                               drawn to u 0..1 from the star; o: { col '#8fe6ff', a 1 }
//   seatedNav(ctx, t, C, o)     a navigator seated at the stern (Mau): o: { at: [X, Y, Z] (seat), face (rad, the way he looks), light: [sx, sy]
//                               (the fire on screen), lit .7, nod 0 }  → { head, hand } screen points (wraps s8_canoe sitter)
//   navFigure(ctx, t, C, o)     a navigator as a figure in 3D, right from ANY side (orbits, close-ups): body volumes as tapered capsules,
//                               dark skin and cloth, rim-lit by one light, breathing. o: { at: [X, Y, Z] (the hips: the seat when sitting),
//                               face (rad, yaw the body faces), pose 'sit' (cross-legged) | 'stand', lean 0 (rad forward), nod 0, light:
//                               [X, Y, Z] (world, the fire), lit .8, seed, arms: { r, l } each a wrist spec: 'knee' | 'lap' | 'palm' (forearm
//                               forward, palm up) | 'raise' (hauling a line overhead) | { at: [X, Y, Z] } | { dir: [az, el] } (arm's length
//                               toward a sky direction) | { a: spec, b: spec, u } (between two), hands: { r, l } hand.mjs pose ('open', 'cup',
//                               'grip', 'reach'; default 'open'), handAng: { r, l } (screen angle of the fingers, default along the forearm),
//                               skin '#6a4430', cloth '#14101a', hair '#0a080c', scale 1 }  → { head, chest, wrist: { r, l }, tip: { r, l }, k }
//   canoeNav(ctx, t, C, K, o)   Hōkūleʻa as s8_canoe draws it (same hulls, deck, fire box, sails) with the navigator left out or replaced, and
//                               more life: o: { nav: null (no navigator) | (ctx, F, fireW) → {} (draw yours in the canoe's depth order; F is the
//                               canoe frame, fireW the fire's local point), sails 1 (0 → 1 the crab-claw sails are raised: the spars swing up
//                               from the deck), streamers 0 (0..1 the streamers on the sail tops snap out downwind), crew [{ w, u, pose,
//                               arms }] (small navFigures on the deck, local metres), fire 1 }  → { fire, mast, stern, bow, nav } screen points
import { Path2D } from '@napi-rs/canvas';
import { rgba, clamp } from '../engine.mjs';
import { TAU, projRuns, projPoly, fillPoly, eoX, mixHex, hash } from './s8_kit.mjs';
import { skyDir } from './s8_sky.mjs';
import { waterY } from './s8_sea.mjs';
import { canoe, canoeFrame, sitter, flames, starCompass, route, island } from './s8_canoe.mjs';
import { hand as drawHand } from './hand.mjs';

export { canoe, canoeFrame, sitter, flames, starCompass, route, island };

export function starRing(ctx, t, C, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const [cx, cy, cz] = o.c || [0, 1, 0], R = (o.R ?? 1.2) * (1 + .03 * (o.breath || 0) * Math.sin(t * TAU / 4.3 + 1.1)), col = o.col || '#ffe2b0', g = o.glow ?? 1, rot = t * .01;
  const fr = eoX(u), pts = (rr, n = 120) => { const p = []; for (let i = 0; i <= n * fr; i++) { const th = i / n * TAU + rot; p.push([cx + Math.sin(th) * rr, cy, cz + Math.cos(th) * rr]); } return p; };
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const line = (P, w, a, c) => { for (const run of projRuns(C, P, .2)) { ctx.strokeStyle = rgba(c, a); ctx.lineWidth = w; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } };
  const k = C.P(cx, cy, cz)?.[2] ?? 100, lw = Math.max(1.2, R * k * .012);
  line(pts(R), lw * 5, .1 * g, '#ff9a4a'); line(pts(R), lw * 2, .3 * g, '#ffb35c'); line(pts(R), lw, .9, col); line(pts(R * 1.1), lw * .6, .45, col);
  if (o.ticks !== false) for (let i = 0; i < 32 && i / 32 <= fr; i++) { const th = i / 32 * TAU + rot, L = i % 8 === 0 ? .18 : i % 4 === 0 ? .12 : .06; line([[cx + Math.sin(th) * R * (1 - L), cy, cz + Math.cos(th) * R * (1 - L)], [cx + Math.sin(th) * R * 1.1, cy, cz + Math.cos(th) * R * 1.1]], lw * (i % 8 ? .7 : 1.2), i % 8 ? .6 : .95, col); }
  ctx.restore();
  let front = null, dmin = 1e9; for (let i = 0; i < 16; i++) { const th = i / 16 * TAU, P = [cx + Math.sin(th) * R, cy, cz + Math.cos(th) * R], d = C.depth(...P); if (d > .2 && d < dmin) { dmin = d; front = C.P(...P); } }
  return { front };
}

export function tern(ctx, t, C, o = {}) {
  if (!o.path) return null;
  const u = clamp(o.u ?? 0), tr = o.trail ?? .25, n = 40, P = [];
  for (let i = 0; i <= n; i++) P.push(o.path(Math.max(0, u - tr) + (u - Math.max(0, u - tr)) * i / n));
  ctx.save(); ctx.lineCap = 'round';
  for (const run of projRuns(C, P, .2)) { ctx.strokeStyle = rgba('#f3efe2', .6 * (o.line ?? 1)); ctx.lineWidth = 1.4; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  const p = C.P(...o.path(u)), q = C.P(...o.path(Math.max(0, u - .01)));
  if (p) {
    const k = p[2], span = (o.s ?? .35) * k, flap = Math.sin(t * 13), dir = q ? Math.atan2(p[1] - q[1], p[0] - q[0]) : 0;
    ctx.translate(p[0], p[1]); ctx.rotate(dir); ctx.fillStyle = '#f3efe2';
    ctx.beginPath(); ctx.ellipse(0, 0, span * .22, span * .05, 0, 0, TAU); ctx.fill();
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-span * .02, 0); ctx.quadraticCurveTo(-span * .12, s * span * (.25 + .15 * flap), -span * .2, s * span * (.5 + .1 * flap)); ctx.quadraticCurveTo(span * .02, s * span * .2, span * .06, 0); ctx.fill(); }
  }
  ctx.restore();
  const tail = C.P(...o.path(Math.max(0, u - tr)));
  return { at: p ? [p[0], p[1]] : null, tail: tail ? [tail[0], tail[1]] : null };
}

export function starPath(ctx, t, C, from, to, u = 1, o = {}) {
  const d = skyDir(from[0], from[1]), far = 400, A = [to[0] + d[0] * far, to[1] + d[1] * far, to[2] + d[2] * far], n = 60, P = [];
  for (let i = 0; i <= n * clamp(u); i++) { const v = i / n; P.push([A[0] + (to[0] - A[0]) * v, A[1] + (to[1] - A[1]) * v, A[2] + (to[2] - A[2]) * v]); }
  if (P.length < 2) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.setLineDash([3, 8]); ctx.lineDashOffset = -t * 20; ctx.lineCap = 'round';
  for (const run of projRuns(C, P, .2)) { ctx.strokeStyle = rgba(o.col || '#8fe6ff', .75 * (o.a ?? 1)); ctx.lineWidth = 1.5; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
}

export function seatedNav(ctx, t, C, o = {}) {
  const [X, Y, Z] = o.at || [0, 1.32, 0], p = C.P(X, Y, Z); if (!p) return null;
  const f = Math.sin((o.face ?? 0) - C.yaw) >= 0 ? 1 : -1;
  return sitter(ctx, t, f, p[0], p[1], p[2] * .95, o.light || [p[0] + 200 * f, p[1] - 40], { lit: o.lit ?? .7, nod: o.nod || 0 });
}

// ---------------------------------------------------------------- the navigator in 3D
const capPath = (p, x1, y1, r1, x2, y2, r2) => {   // a tapered capsule, always wound the same way (nonzero unions stay solid)
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1);
  if (d <= Math.abs(r1 - r2) + .05) { const r = Math.max(r1, r2), x = r1 >= r2 ? x1 : x2, y = r1 >= r2 ? y1 : y2; p.moveTo(x + r, y); p.arc(x, y, r, 0, TAU); return; }
  const k = Math.asin(clamp((r1 - r2) / d, -1, 1));
  p.moveTo(x1 + Math.cos(a + Math.PI / 2 + k) * r1, y1 + Math.sin(a + Math.PI / 2 + k) * r1);
  p.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); p.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); p.closePath();
};
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], len = (a) => Math.hypot(a[0], a[1], a[2]), nrm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const UA = .29, FA = .27;
function elbowOf(S, Wt, pole) {   // two-bone IK: shoulder S, wrist target Wt, the elbow bends toward pole
  let d = sub(Wt, S), L = len(d); const dir = nrm(d); L = clamp(L, .08, UA + FA - .002);
  const a = (UA * UA + L * L - FA * FA) / (2 * L), h = Math.sqrt(Math.max(0, UA * UA - a * a));
  let p = sub(pole, [dir[0] * dot(pole, dir), dir[1] * dot(pole, dir), dir[2] * dot(pole, dir)]); p = nrm(p);
  return { E: add(add(S, dir, a), p, h), W: add(S, dir, L) };
}
export function navFigure(ctx, t, C, o = {}) {
  const P0 = o.at || [0, 1.3, 0], fa = o.face ?? 0, sc = o.scale ?? 1, seed = o.seed ?? 1;
  const f = [Math.sin(fa), 0, Math.cos(fa)], r = [Math.cos(fa), 0, -Math.sin(fa)], up = [0, 1, 0];
  const b = Math.sin(t * TAU / 4.4 + seed * 1.7), lean = (o.lean ?? 0) + .012 * b, nod = (o.nod ?? 0) + .03 * Math.sin(t * .41 + seed);
  const L = (x, y, z) => { const yy = y * Math.cos(lean) - z * Math.sin(lean) * 0, zz = z + y * Math.sin(lean); return add(add(add(P0, r, x * sc), up, (y > 0 ? yy : y) * sc), f, (y > 0 ? zz : z) * sc); };   // upper body leans forward about the hips
  const Lw = (x, y, z) => add(add(add(P0, r, x * sc), up, y * sc), f, z * sc);   // no lean (legs, hand targets)
  const sit = (o.pose || 'sit') === 'sit', breathU = .006 * b;
  const J = { hipL: L(-.11, .02, 0), hipR: L(.11, .02, 0), shL: L(-.18, .46 + breathU, 0), shR: L(.18, .46 + breathU, 0), chest: L(0, .34 + breathU, .03), neck: L(0, .54, .02), head: L(0, .67 + breathU, .04 + nod * .2) };
  if (sit) Object.assign(J, { kL: Lw(-.32, .07, .3), kR: Lw(.32, .07, .3), aL: Lw(.1, 0, .4), aR: Lw(-.1, .02, .43) });
  else Object.assign(J, { kL: Lw(-.1, -.47, .04), kR: Lw(.11, -.48, .02), aL: Lw(-.11, -.9, -.01), aR: Lw(.12, -.9, .02) });
  const spec = (s, side) => {   // → wrist target (world)
    if (s && s.a !== undefined) { const A = spec(s.a, side), B = spec(s.b, side), u = clamp(s.u ?? 0); return [0, 1, 2].map((i) => A[i] + (B[i] - A[i]) * u); }
    const sd = side === 'r' ? 1 : -1;
    if (!s || s === 'knee') return sit ? Lw(sd * .27, .12, .27) : Lw(sd * .24, -.32, .03);
    if (s === 'lap') return Lw(sd * .06, .1, .2);
    if (s === 'palm') return Lw(sd * .14, .2, .34);
    if (s === 'raise') return L(sd * .1, .98, .16);
    if (s.at) return s.at;
    if (s.dir) { const S = side === 'r' ? J.shR : J.shL, d = skyDir(s.dir[0], s.dir[1]); return add(S, d, (UA + FA - .01) * sc); }
    return Lw(sd * .27, .12, .27);
  };
  const arm = (side) => { const S = side === 'r' ? J.shR : J.shL, sd = side === 'r' ? 1 : -1, Wt = spec(o.arms?.[side], side), pole = nrm(add(add([0, -1, 0], r, .55 * sd), f, -.35)); return { S, ...elbowOf(S, Wt, pole) }; };
  const AR = arm('r'), AL = arm('l');
  const cloth = o.cloth || '#14101a', skin = o.skin || '#6a4430', hair = o.hair || '#0a080c', lit = o.lit ?? .8;
  // the parts: [world a, ra, world b, rb, kind]
  const parts = [
    [J.hipL, .085, J.kL, .07, 'cloth'], [J.kL, .062, J.aL, .045, 'skin'], [J.hipR, .085, J.kR, .07, 'cloth'], [J.kR, .062, J.aR, .045, 'skin'],
    [L(0, .08, -.01), .125, L(0, .36, .01), .13, 'skin'], [J.hipL, .095, L(-.14, .43, 0), .085, 'skin'], [J.hipR, .095, L(.14, .43, 0), .085, 'skin'], [L(-.07, .0, 0), .12, L(.07, .0, 0), .12, 'cloth'], [L(-.15, .45, -.01), .07, L(.15, .45, -.01), .07, 'skin'],
    [J.neck, .055, L(0, .6, .03), .05, 'skin'],
    [AR.S, .058, AR.E, .046, 'skin'], [AR.E, .044, AR.W, .036, 'skin'], [AL.S, .058, AL.E, .046, 'skin'], [AL.E, .044, AL.W, .036, 'skin'],
  ];
  const PR = (w) => C.P(w[0], w[1], w[2], .05);
  const hp = PR(J.head); if (!hp) return null;
  const k = hp[2], lp = o.light ? PR(o.light) : null, lpS = lp ? [lp[0], lp[1]] : [hp[0] + (o.lightDir?.[0] ?? 300), hp[1] + (o.lightDir?.[1] ?? -60)];
  const list = [];
  for (const [a, ra, bb, rb, kind] of parts) { const pa = PR(a), pb = PR(bb); if (!pa || !pb) continue; list.push({ d: (C.depth(...a) + C.depth(...bb)) / 2, pa, pb, ra: ra * sc * pa[2], rb: rb * sc * pb[2], kind }); }
  list.push({ d: C.depth(...J.head), head: true, pa: hp, ra: .095 * sc * k });
  list.sort((p, q) => q.d - p.d);
  const pathOf = (it) => { const p = new Path2D(); if (it.head) { p.ellipse(it.pa[0], it.pa[1], it.ra, it.ra * 1.18, 0, 0, TAU); } else capPath(p, it.pa[0], it.pa[1], it.ra, it.pb[0], it.pb[1], it.rb); return p; };
  const all = new Path2D(), paths = list.map((it) => { const p = pathOf(it); all.addPath(p); return p; });
  ctx.save();
  // rim pass (each part shifted toward the light), then the dark body in depth order
  const rw = Math.max(1.1, k * .012 * sc);
  const cen = (it) => (it.head ? [it.pa[0], it.pa[1]] : [(it.pa[0] + it.pb[0]) / 2, (it.pa[1] + it.pb[1]) / 2]);
  list.forEach((it, i) => { const c = cen(it), dx = lpS[0] - c[0], dy = lpS[1] - c[1], dl = Math.hypot(dx, dy) || 1; ctx.save(); ctx.translate(dx / dl * rw, dy / dl * rw); ctx.fillStyle = rgba('#ffb066', .55 + .4 * lit); ctx.fill(paths[i]); ctx.restore(); });
  list.forEach((it, i) => { ctx.fillStyle = it.kind === 'cloth' ? cloth : mixHex('#0b090f', skin, .16); ctx.fill(paths[i]); });
  // form light from the fire side over the whole figure, hair on the head
  ctx.save(); ctx.clip(all);
  const R = Math.max(40, 1.1 * k * sc), g = ctx.createRadialGradient(lpS[0], lpS[1], 0, lpS[0], lpS[1], Math.max(R, Math.hypot(lpS[0] - hp[0], lpS[1] - hp[1]) * 1.25));
  g.addColorStop(0, rgba('#ffa860', .16 + .22 * lit)); g.addColorStop(.35, rgba('#c86a32', .08 * lit)); g.addColorStop(1, rgba('#000000', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  // hair: short and dark, over the crown and the back of the head (away from the face)
  { const fc = PR(add(J.head, f, .1 * sc)), hr = .095 * sc * k; let fx = 0, fy = 0; if (fc) { fx = fc[0] - hp[0]; fy = fc[1] - hp[1]; } const fl = Math.hypot(fx, fy), ux = fl > .5 ? fx / Math.max(fl, hr * .9) : 0, uy = fl > .5 ? fy / Math.max(fl, hr * .9) : 0;
    ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(hp[0] - ux * hr * .28, hp[1] - hr * .3 - uy * hr * .2, hr * 1.04, hr * .95, Math.atan2(uy, ux) * .3, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba('#ffb066', .35 * lit); ctx.lineWidth = Math.max(.8, hr * .05); ctx.lineCap = 'round'; const lx = lpS[0] - hp[0], ly = lpS[1] - hp[1], la = Math.atan2(ly, lx); ctx.beginPath(); ctx.arc(hp[0] - ux * hr * .28, hp[1] - hr * .3, hr * .98, la - .6, la + .6); ctx.stroke(); }
  ctx.restore();
  // hands: hand.mjs when they are big enough on screen
  const out = { head: [hp[0], hp[1]], chest: PR(J.chest), wrist: {}, tip: {}, k, joints: J };
  for (const [side, A] of [['r', AR], ['l', AL]]) {
    const w = PR(A.W), e = PR(A.E); if (!w || !e) continue; out.wrist[side] = [w[0], w[1]];
    const hl = .18 * sc * w[2];
    if (hl > 26) {
      const ang = o.handAng?.[side] ?? Math.atan2(w[1] - e[1], w[0] - e[0]);
      const lightV = [lpS[0] - w[0], lpS[1] - w[1]];
      drawHand(ctx, w[0], w[1], hl / 150, { pose: o.hands?.[side] || 'open', ang, flip: side === 'l', skin: mixHex('#3a2418', skin, .8), sleeve: null, rim: '#ffb066', light: lightV, t: t + (side === 'l' ? 1.3 : 0), close: o.close?.[side] ?? 0 });
      out.tip[side] = [w[0] + Math.cos(ang) * hl, w[1] + Math.sin(ang) * hl];
    } else out.tip[side] = [w[0], w[1]];
  }
  ctx.restore();
  return out;
}

// ---------------------------------------------------------------- Hōkūleʻa with options (s8_canoe's geometry; navigator, sails, streamers, crew)
const LEN = 19, HALF = LEN / 2, SEP = 1.35;
const HULLPTS = (() => { const g = [], w = []; for (let i = 0; i <= 28; i++) { const v = i / 28, s = -HALF + v * LEN, e = Math.abs(s) / HALF, bw = .42 * Math.pow(Math.max(0, 1 - Math.pow(e, 2.4)), .55) + .02, sh = 1.05 + .9 * Math.pow(Math.max(0, e - .7) / .3, 2.2); g.push([bw, sh, s]); w.push([bw * .8, 0, s * .94]); } return { g, w }; })();
function hullN(ctx, t, C, F, side, fire) {
  const G = [...HULLPTS.g.map(([u, v, w]) => F(side + u, v, w)), ...HULLPTS.g.slice().reverse().map(([u, v, w]) => F(side - u, v, w))];
  const Wl = [...HULLPTS.w.map(([u, v, w]) => F(side + u, v, w)), ...HULLPTS.w.slice().reverse().map(([u, v, w]) => F(side - u, v, w))];
  const dC = C.depth(...F(side, .5, 0)), q = [];
  for (let i = 0; i < G.length; i++) { const j = (i + 1) % G.length, P = [G[i], G[j], Wl[j], Wl[i]]; q.push([P.reduce((a, p) => a + C.depth(...p), 0) / 4, P, i]); }
  const draw = (Lq) => { Lq.sort((a, b) => b[0] - a[0]); for (const [, P, i] of Lq) { const S = projPoly(C, P); if (S.length < 3) continue; const n = i < G.length / 2 ? 1 : -1, lt = clamp(.35 + .35 * n * Math.sign(side || 1)); const col = mixHex('#120c10', '#3a2018', lt * fire); fillPoly(ctx, S, col); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke(); } };
  draw(q.filter((x) => x[0] >= dC)); fillPoly(ctx, projPoly(C, G), '#0a0710'); draw(q.filter((x) => x[0] < dC));
  for (const run of projRuns(C, [...G, G[0]])) { ctx.strokeStyle = rgba('#ffb066', .35 * fire + .15); ctx.lineWidth = 1.6; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  for (const run of projRuns(C, [...Wl, Wl[0]])) { ctx.strokeStyle = rgba('#c8d4f0', .22); ctx.lineWidth = 1.4; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
}
function sailN(ctx, t, C, F, w0, ang, size, fireP, raise, stream, wind) {
  const d = [Math.sin(ang), Math.cos(ang)], base = [0, 1.45, w0], fl = .06 * Math.sin(t * 1.3 + w0) * (1 + 2 * stream), ph = Math.PI / 2 * (.1 + .9 * raise);
  // the spars lie aft along the deck and swing up about the tack as the sail is raised
  const S = (a, y, bul = 0) => { const yy = y * Math.sin(ph), aa = a - y * Math.cos(ph); return F(base[0] + d[0] * aa + d[1] * bul * raise, base[1] + yy, base[2] + d[1] * aa - d[0] * bul * raise); };
  const sp1 = [-1.3 * size, 9.6 * size], sp2 = [4.4 * size, 7.6 * size], pts = [];
  for (let i = 0; i <= 10; i++) { const v = i / 10; pts.push(S(sp1[0] * v, sp1[1] * v, .3 * Math.sin(Math.PI * v))); }
  for (let i = 1; i < 12; i++) { const v = i / 12, a = sp1[0] + (sp2[0] - sp1[0]) * v, y = sp1[1] + (sp2[1] - sp1[1]) * v - 2.0 * size * Math.sin(Math.PI * v) * (1 + fl) * (.3 + .7 * raise); pts.push(S(a, y, .9 * Math.sin(Math.PI * v) * .5)); }
  for (let i = 10; i >= 0; i--) { const v = i / 10; pts.push(S(sp2[0] * v, sp2[1] * v, .5 * Math.sin(Math.PI * v))); }
  const P = projPoly(C, pts);
  if (P.length > 2) {
    fillPoly(ctx, P, '#3a1c1c');
    ctx.save(); fillPoly(ctx, P); ctx.clip();
    const tk = C.P(...S(0, 0)), tp = C.P(...S(1.4 * size, 8 * size));
    if (tk && tp) { const g = ctx.createLinearGradient(tk[0], tk[1], tp[0], tp[1]); g.addColorStop(0, rgba('#ff9a50', .55)); g.addColorStop(.35, rgba('#a0402a', .3)); g.addColorStop(1, rgba('#1a0c14', .3)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    if (fireP) { const g = ctx.createRadialGradient(fireP[0], fireP[1], 0, fireP[0], fireP[1], fireP[2] * 6); g.addColorStop(0, rgba('#ffb35c', .35)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    ctx.strokeStyle = rgba('#140808', .45); ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 1; i < 6; i++) { const v = i / 6, a = sp1[0] + (sp2[0] - sp1[0]) * v, y = sp1[1] + (sp2[1] - sp1[1]) * v - 2.0 * size * Math.sin(Math.PI * v); const p = C.P(...S(0, 0)), q = C.P(...S(a, y, .45 * Math.sin(Math.PI * v))); if (p && q) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } }
    ctx.stroke(); ctx.restore();
    for (const sp of [sp1, sp2]) { const R = projRuns(C, [0, .25, .5, .75, 1].map((v) => S(sp[0] * v, sp[1] * v, (sp === sp1 ? .3 : .5) * Math.sin(Math.PI * v)))); for (const rr of R) { ctx.strokeStyle = '#120a0a'; ctx.lineWidth = Math.max(1.5, rr[0][2] * .1); ctx.beginPath(); rr.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.strokeStyle = rgba('#ffb066', .4); ctx.lineWidth = 1; ctx.stroke(); } }
    ctx.strokeStyle = rgba('#a4b0dc', .3); ctx.lineWidth = 1.2; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
  }
  // streamers at both spar tops: they hang, then snap out downwind (wind = [x, z] world direction)
  if (stream > 0 || raise > .9) for (const [sp, sd] of [[sp1, 1], [sp2, 2]]) {
    const A = S(sp[0], sp[1]), n = 14, Lr = .9 + 1.6 * stream, pts2 = [];
    for (let i = 0; i <= n; i++) { const v = i / n, flap = Math.sin(t * (9 + 5 * stream) - v * 7 + sd) * .25 * v * (.4 + stream); const hang = (1 - stream) * v * Lr * .8; pts2.push([A[0] + wind[0] * v * Lr * (.3 + .7 * stream) + flap * wind[1], A[1] - hang + .15 * Math.sin(t * 5 + v * 4 + sd) * v, A[2] + wind[1] * v * Lr * (.3 + .7 * stream) - flap * wind[0]]); }
    for (const run of projRuns(C, pts2, .3)) { ctx.strokeStyle = rgba(sd === 1 ? '#e8dcc0' : '#d8a070', .85); ctx.lineWidth = Math.max(1.2, run[0][2] * .05); ctx.lineCap = 'round'; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  }
}
export function canoeNav(ctx, t, C, K, o = {}) {
  const F = canoeFrame(K, t), out = {}, fireA = o.fire ?? 1;
  const fireW = [.35, 1.35, 1.2], fireP = C.P(...F(...fireW));
  const navW = [0, 1.32, -6.6], navP = C.P(...F(...navW));
  const raise = clamp(o.sails ?? 1), stream = clamp(o.streamers ?? 0), wind = o.wind || [-Math.sin(K.head), -Math.cos(K.head)];
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const sd of [-SEP, SEP]) fillPoly(ctx, projPoly(C, HULLPTS.w.map(([u, v, w]) => F(sd + u * 1.6, -.02, w)).concat(HULLPTS.w.slice().reverse().map(([u, v, w]) => F(sd - u * 1.6, -.02, w)))), 'rgba(2,2,8,.5)');
  const parts = [], hi = C.y - (K.y0 ?? 0) > 5;
  for (const sd of [-SEP, SEP]) parts.push([C.depth(...F(sd, .5, 0)) + (hi ? 3 : 0), () => hullN(ctx, t, C, F, sd, fireA)]);
  parts.push([C.depth(...F(0, 1.3, 0)) + (hi ? 1 : 0), () => {
    const deck = [F(-SEP - .2, 1.28, -5.6), F(SEP + .2, 1.28, -5.6), F(SEP + .2, 1.28, 5.2), F(-SEP - .2, 1.28, 5.2)], D = projPoly(C, deck);
    if (fillPoly(ctx, D, '#1a1014')) {
      ctx.save(); fillPoly(ctx, D); ctx.clip();
      if (fireP && fireA > 0) { const g = ctx.createRadialGradient(fireP[0], fireP[1], 0, fireP[0], fireP[1], fireP[2] * 5); g.addColorStop(0, rgba('#ffb35c', .6 * fireA)); g.addColorStop(.4, rgba('#c4512e', .2 * fireA)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
      ctx.strokeStyle = rgba('#05030a', .55); ctx.lineWidth = 1; ctx.beginPath(); for (let w = -5.2; w < 5.2; w += .55) { const a = C.P(...F(-SEP - .2, 1.29, w)), b = C.P(...F(SEP + .2, 1.29, w)); if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } } ctx.stroke();
      ctx.restore();
    }
    for (const w of [-7.2, -5.9, 5.6, 6.9]) { const a = C.P(...F(-SEP - .3, 1.25, w)), b = C.P(...F(SEP + .3, 1.25, w)); if (a && b) { ctx.strokeStyle = '#120a0a'; ctx.lineWidth = Math.max(1.5, a[2] * .14); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.strokeStyle = rgba('#ffb066', .35); ctx.lineWidth = 1; ctx.stroke(); } }
    const a = C.P(...F(.9, 2.2, -8.2)), b = C.P(...F(1.1, -.6, -10.6)); if (a && b) { ctx.strokeStyle = '#100808'; ctx.lineWidth = Math.max(1.5, a[2] * .09); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  }]);
  parts.push([C.depth(...F(...fireW)) - .1, () => {
    const box = [[-.35, -.35], [.35, -.35], [.35, .35], [-.35, .35]].map(([u, w]) => [fireW[0] + u, w + fireW[2]]);
    const top = box.map(([u, w]) => F(u, 1.62, w)), bot = box.map(([u, w]) => F(u, 1.3, w));
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; fillPoly(ctx, projPoly(C, [top[i], top[j], bot[j], bot[i]]), i % 2 ? '#24140e' : '#1a0e0c'); }
    if (fireP && fireA > 0) {
      const k = fireP[2]; flames(ctx, t, fireP[0], fireP[1] + k * .22, k * 1.9 * (.6 + .4 * fireA));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = k * 5 * (1 + .04 * Math.sin(t * 7.3) + .03 * Math.sin(t * 13.1)); const g = ctx.createRadialGradient(fireP[0], fireP[1], 0, fireP[0], fireP[1], R); g.addColorStop(0, rgba('#ffb35c', .6 * fireA)); g.addColorStop(.3, rgba('#ff8a3a', .18 * fireA)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fireP[0], fireP[1], R, 0, TAU); ctx.fill();
      for (let n = Math.floor(t / .07) - 30; n <= Math.floor(t / .07); n++) { const a = t - n * .07, life = 1.1 + hash(n) * .9; if (a < 0 || a > life || hash(n * 3.3) > .45) continue; const p = C.P(...F(fireW[0] + (hash(n * 1.7) - .5) * .3, 1.6 + a * (.9 + .6 * hash(n * 2.1)), fireW[2] - a * 1.4 + (hash(n * 5.1) - .5) * .4)); if (!p) continue; const heat = 1 - a / life; ctx.fillStyle = rgba(heat > .5 ? '#ffe7b0' : '#ff9a4a', heat); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(.8, p[2] * .025), 0, TAU); ctx.fill(); }
      ctx.restore();
    }
  }]);
  if (o.nav !== null) parts.push([C.depth(...F(...navW)), () => {
    if (typeof o.nav === 'function') { out.nav = o.nav(ctx, F, fireW); return; }
    if (!navP) return; const fw = C.P(...F(0, 1.32, -5.6)), f = fw && fw[0] >= navP[0] ? 1 : -1;
    out.nav = sitter(ctx, t, f, navP[0], navP[1], navP[2], fireP || [navP[0] + 200 * f, navP[1] - 50], { lit: .85 });
  }]);
  for (const cw of o.crew || []) parts.push([C.depth(...F(cw.u ?? 0, 1.3, cw.w ?? 0)), () => navFigure(ctx, t, C, { at: F(cw.u ?? 0, 1.3 + .92, cw.w ?? 0), face: K.head + (cw.face ?? 0), pose: 'stand', arms: cw.arms || { r: 'raise', l: 'raise' }, light: F(...fireW), lit: .7, seed: cw.seed ?? 3, scale: cw.scale ?? 1 })]);
  for (const [w0, ang, sz] of [[3.4, .5, 1], [-2.6, .42, .86]]) parts.push([C.depth(...F(0, 5, w0)), () => sailN(ctx, t, C, F, w0, ang, sz, fireP, raise, stream, wind)]);
  parts.sort((a, b) => b[0] - a[0]);
  for (const [, fn] of parts) fn();
  ctx.restore();
  out.fire = fireP; out.mast = C.P(...F(0, 11.5, 3.4)); out.tagP = C.P(...F(0, 3.2, 8.6)); out.stern = C.P(...F(0, .2, -HALF)); out.bow = C.P(...F(0, .2, HALF)); out.F = F;
  return out;
}
export const CANOE = { LEN, HALF, SEP, fire: [.35, 1.35, 1.2], nav: [0, 1.32, -6.6] };
