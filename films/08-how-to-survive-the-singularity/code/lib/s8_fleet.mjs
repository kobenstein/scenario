// Film 8 · the fleet and OUR compass on the water (owner B2; first use c05.07 / c08.01, also B3 c09, c10, c11).
// Many small boats with lanterns (s8_boats.boat), laid out and moved by layouts; the great compass rose of light on the sea with four beacon
// points (N house, E kite, S fire circle, W tack line, drawn in lantern boats), a floating rope rim of light that hands can hold, and a
// needle made of a line of lantern boats. World: metres, +Y up, sea Y = 0; N = +Z, E = +X (so from above with yaw 0, N is up, E is right).
//
//   LAYOUTS (each returns [{ x, z, head, sc, seed }]):
//     ringLayout(n, cx, cz, R, seed)          boats on a ring, bows along it (the 6.04 rose's ring)
//     scatterLayout(n, cx, cz, R, seed)       loose drift round a point
//     needleLayout(n, cx, cz, ang, L, seed)   a line of boats from the centre out along ang (0 = N, π/2 = E): the needle
//     raftLayout(n, cx, cz, seed)             rafted up, hull to hull (c09: boats raft up)
//     iconLayout(kind, cx, cz, S, ang)        the lantern positions of an icon ('house'|'kite'|'fire'|'tack'), S = size (m), ang = rotation
//   moveLayout(A, B, u, o)                    boats sail from A to B (index-matched), staggered (o.stagger .4), heads turn into the move
//   tackPos(t, x0, z0, head, leg 14, legT 2.2, tack .7)   a boat tacking upwind in short legs → { x, z, head, turns: n }
//   drawFleet(ctx, t, C, boats, o)            o: { lantern 0..1 or fn(b, i), sail 'full'|'slack'|'none', scale 1, light: [sx, sy] (rim), ring 0..1
//                                             (an amber ring rises round every boat: c08.09 rights), ringFn(b, i) }, sorted far → near → screen lights
//   seaRose(ctx, t, C, o)                     OUR compass. o: { x, z, R 40, a 0..1 (draws from the centre out), points [n, e, s, w] 0..1 (each point's
//                                             beacon + icon lights), icons 0..1, rim 0..1 (the rope ring of light), rimHands 0..1 (small hands on the rope),
//                                             needle: { ang (0 = N), a 0..1, n 9 } | null, spin .02 rad/s, dim 0..1 (unlit: the dark ring of c05.07) }
//                                             → { centre: [sx, sy], points: [[sx, sy] ×4] }
//   ICON_PTS                                  the icon outlines in unit space (y up = N), for anyone who needs the same four shapes
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projRuns, projPoly, fillPoly, mixHex, hash, eoX, sio } from './s8_kit.mjs';
import { boat } from './s8_boats.mjs';
import { lanterns } from './s8_harbour.mjs';

// ---------------------------------------------------------------- layouts
export function ringLayout(n, cx, cz, R, seed = 1) { const r = prng(seed), a = []; for (let i = 0; i < n; i++) { const th = i / n * TAU + (r() - .5) * .1; a.push({ x: cx + Math.sin(th) * R * (1 + (r() - .5) * .06), z: cz + Math.cos(th) * R * (1 + (r() - .5) * .06), head: th + Math.PI / 2 + (r() - .5) * .4, sc: .8 + .25 * r(), seed: r() }); } return a; }
export function scatterLayout(n, cx, cz, R, seed = 2) { const r = prng(seed), a = []; for (let i = 0; i < n; i++) { const th = r() * TAU, rr = R * Math.sqrt(r()); a.push({ x: cx + Math.sin(th) * rr, z: cz + Math.cos(th) * rr, head: r() * TAU, sc: .8 + .25 * r(), seed: r() }); } return a; }
export function needleLayout(n, cx, cz, ang, L, seed = 3) { const r = prng(seed), a = []; for (let i = 0; i < n; i++) { const v = (i + .5) / n, d = -L * .35 + L * 1.35 * v; a.push({ x: cx + Math.sin(ang) * d + (r() - .5) * .8, z: cz + Math.cos(ang) * d + (r() - .5) * .8, head: ang + (r() - .5) * .1, sc: .75 + .2 * r(), seed: r() }); } return a; }
export function raftLayout(n, cx, cz, seed = 4) { const r = prng(seed), a = [], cols = Math.ceil(Math.sqrt(n * 2.2)); for (let i = 0; i < n; i++) { const c = i % cols, rw = Math.floor(i / cols); a.push({ x: cx + (c - cols / 2) * 2.3 + (rw % 2) * 1.1, z: cz + (rw - n / cols / 2) * 6.2, head: (r() - .5) * .08, sc: .85 + .1 * r(), seed: r() }); } return a; }
// icon outlines in unit space (x right = E, y up = N), radius ~1
export const ICON_PTS = {
  house: [[-.7, -.6], [.7, -.6], [.7, .2], [0, .8], [-.7, .2], [-.7, -.6]],
  kite: [[0, .9], [.5, .1], [0, -.5], [-.5, .1], [0, .9]],
  fire: Array.from({ length: 13 }, (_, i) => [Math.sin(i / 12 * TAU) * .75, Math.cos(i / 12 * TAU) * .75]),
  tack: [[-.8, -.7], [-.25, -.2], [-.55, .15], [.05, .55], [-.1, .85]],
};
const ICON_EXTRA = { house: [[0, -.15]], kite: [[0, -.6], [.1, -.8], [-.05, -.95]], fire: [[0, 0]], tack: [] };
function resample(pts, step) { const out = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(d / step)); for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } out.push(pts[pts.length - 1]); return out; }
export function iconLayout(kind, cx, cz, S, ang = 0) {
  const c = Math.cos(ang), s = Math.sin(ang), P = resample(ICON_PTS[kind], .32).concat(ICON_EXTRA[kind] || []);
  return P.map(([u, v], i) => ({ x: cx + (u * c + v * s) * S, z: cz + (-u * s + v * c) * S, head: ang + i * .9, sc: .55, seed: hash(i + kind.length), hot: (ICON_EXTRA[kind] || []).some((q) => q[0] === u && q[1] === v) }));
}
export function moveLayout(A, B, u, o = {}) {
  const st = o.stagger ?? .4, n = Math.min(A.length, B.length), out = [];
  for (let i = 0; i < n; i++) {
    const d = hash(i * 1.37 + (o.seed || 0)) * st, v = sio(clamp((u - d) / (1 - st))), a = A[i], b = B[i];
    const x = a.x + (b.x - a.x) * v, z = a.z + (b.z - a.z) * v, mv = Math.atan2(b.x - a.x, b.z - a.z), turn = Math.sin(Math.PI * v);
    out.push({ ...b, x, z, head: (v < 1e-3 ? a.head : v > .999 ? b.head : mv * turn + (v < .5 ? a.head : b.head) * (1 - turn)), sc: a.sc + (b.sc - a.sc) * v });
  }
  return out;
}
export function tackPos(t, x0, z0, head, leg = 14, legT = 2.2, tack = .7) {
  const k = Math.floor(t / legT), f = (t / legT) - k, sgn = (n) => (n % 2 ? -1 : 1);
  let x = x0, z = z0; for (let i = 0; i < k; i++) { const h = head + sgn(i) * tack; x += Math.sin(h) * leg; z += Math.cos(h) * leg; }
  const h = head + sgn(k) * tack, e = f * f * (3 - 2 * f) * .3 + f * .7;
  const turnH = f < .12 ? head + sgn(k) * tack * (f / .12) - sgn(k - 1) * tack * (1 - f / .12) : h;
  return { x: x + Math.sin(h) * leg * e, z: z + Math.cos(h) * leg * e, head: k ? turnH : h, turns: k };
}

// ---------------------------------------------------------------- the fleet
export function drawFleet(ctx, t, C, boats, o = {}) {
  const list = boats.map((b, i) => [C.depth(b.x, .5, b.z), b, i]).filter((p) => p[0] > .5).sort((a, b) => b[0] - a[0]);
  const lights = [];
  for (const [d, b, i] of list) {
    const lan = typeof o.lantern === 'function' ? o.lantern(b, i) : (o.lantern ?? 1);
    const ringA = typeof o.ringFn === 'function' ? o.ringFn(b, i) : (o.ring || 0);
    if (ringA > 0) amberRing(ctx, t, C, b.x, b.z, 3.4 * (b.sc ?? 1) * (o.scale ?? 1), ringA);
    const k = C.F / d;
    if (k * (b.sc ?? 1) < 1.6) {   // far: a lantern point and a short dark hull stroke
      const p = C.P(b.x, .3, b.z); if (!p) continue;
      ctx.strokeStyle = '#05050c'; ctx.lineWidth = Math.max(1, k * 1.4); ctx.beginPath(); ctx.moveTo(p[0] - k * 2.4, p[1]); ctx.lineTo(p[0] + k * 2.4, p[1]); ctx.stroke();
      if (lan > 0) lights.push([p[0], p[1] - k, Math.max(1.1, k * .9), b.seed ?? hash(i), lan]);
      continue;
    }
    const r = boat(ctx, t, C, { x: b.x, z: b.z, head: b.head, roll: b.roll ?? .04 * Math.sin(t * .8 + i), sail: b.sail || o.sail || 'none', sailSide: b.sailSide, lantern: lan, scale: (b.sc ?? 1) * (o.scale ?? 1), light: o.light });
    if (r && r.lantern && lan > 0 && o.collect) lights.push([r.lantern[0], r.lantern[1], 2, b.seed ?? 0, lan]);
  }
  if (lights.length) { ctx.save(); for (const L of lights) lanterns(ctx, t, [L], L[4], 0); ctx.restore(); }
  return { n: list.length };
}
// the amber ring that rises round a boat (rights): a circle of light on the water that a cool beam cannot wash out
export function amberRing(ctx, t, C, X, Z, R, a) {
  const pts = []; for (let i = 0; i <= 48; i++) { const th = i / 48 * TAU; pts.push([X + Math.sin(th) * R, .05 + .3 * eoX(a), Z + Math.cos(th) * R]); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const run of projRuns(C, pts, .3)) for (const [lw, al, col] of [[6, .12, '#ff9a4a'], [1.6, .85, '#ffd9a0']]) { ctx.strokeStyle = rgba(col, al * a); ctx.lineWidth = Math.max(1, lw * (run[0][2] / 12)); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- OUR compass: the rose of light on the sea
const DIRS = [['house', 0], ['kite', Math.PI / 2], ['fire', Math.PI], ['tack', -Math.PI / 2]];
export function seaRose(ctx, t, C, o) {
  const X0 = o.x, Z0 = o.z, R = o.R ?? 40, a = clamp(o.a ?? 1), rot = (o.spin ?? .02) * t, dim = o.dim || 0, out = { centre: C.P(X0, 0, Z0), points: [] };
  const W = (x, z, y = .05) => [X0 + x, y, Z0 + z];
  const k = (out.centre || [0, 0, 1])[2];
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const line = (pts, col, al, lw, dash) => { for (const run of projRuns(C, pts.map(([x, z]) => W(x, z)), .3)) { ctx.strokeStyle = rgba(col, al); ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash); ctx.beginPath(); run.forEach((q, j) => (j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); if (dash) ctx.setLineDash([]); } };
  if (dim > 0) {   // the dark ring, planted and unlit: a ring of dark floats, a faint starlight rim
    const pts = []; for (let i = 0; i <= 160; i++) { const th = i / 160 * TAU; pts.push([Math.sin(th) * R, Math.cos(th) * R]); }
    line(pts, '#05050c', dim, Math.max(2, k * 1.2)); line(pts, '#7e8ab8', .35 * dim, Math.max(1, k * .25));
    for (let i = 0; i < 48; i++) { const th = i / 48 * TAU, p = C.P(...W(Math.sin(th) * R, Math.cos(th) * R, .2)); if (p) { ctx.fillStyle = rgba('#0a0a16', dim); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(1, k * .5), 0, TAU); ctx.fill(); } }
  }
  if (a <= 0) { ctx.restore(); return out; }
  const draw = (u) => clamp(a * 1.6 - u * .6);
  ctx.globalCompositeOperation = 'lighter';
  // the glow pool
  const A = C.plane([X0, .03, Z0], [1, 0, 0], [0, 0, 1]);
  if (A) { ctx.save(); ctx.transform(...A); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.3); g.addColorStop(0, rgba('#ffb35c', .26 * a)); g.addColorStop(.55, rgba('#c4512e', .08 * a)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R * 1.3, 0, TAU); ctx.fill(); ctx.restore(); }
  // rings and ticks
  for (const [rr, al] of [[.3, .6], [.62, .45], [1, .85]]) { const u = draw(rr); if (u <= 0) continue; const pts = []; for (let i = 0; i <= 160 * u; i++) { const th = i / 160 * TAU + rot; pts.push([Math.sin(th) * R * rr, Math.cos(th) * R * rr]); } line(pts, '#ffd9a0', al * a, Math.max(1, k * .12)); line(pts, '#ff9a4a', al * .28 * a, Math.max(3, k * .6)); }
  { const u = draw(1); if (u > 0) for (let i = 0; i < 32; i++) { const th = i / 32 * TAU + rot, L = i % 8 ? (i % 2 ? .04 : .07) : .12; line([[Math.sin(th) * R * (1 - L), Math.cos(th) * R * (1 - L)], [Math.sin(th) * R, Math.cos(th) * R]], '#ffd9a0', .75 * a * u, Math.max(1, k * .1)); } }
  // the 16-point star
  for (let i = 0; i < 16; i++) {
    const th = i / 16 * TAU + rot, L = i % 4 === 0 ? .9 : i % 2 === 0 ? .62 : .4, u = draw(L * .6); if (u <= 0) continue;
    const tip = [Math.sin(th) * R * L * u, Math.cos(th) * R * L * u], w = R * (i % 4 === 0 ? .07 : .045), l = [Math.sin(th - Math.PI / 2) * w, Math.cos(th - Math.PI / 2) * w], r = [Math.sin(th + Math.PI / 2) * w, Math.cos(th + Math.PI / 2) * w];
    line([l, tip, r], '#ffe2b0', (i % 4 === 0 ? .85 : .5) * a, Math.max(1, k * .09));
  }
  ctx.globalCompositeOperation = 'source-over';
  // the rope rim: a floating rope ring of light just outside the rose (twisted strands, floats), small hands can hold it
  const rim = clamp(o.rim ?? 0);
  if (rim > 0) {
    const RR = R * 1.18, pts = [], n = 220; for (let i = 0; i <= n * rim; i++) { const th = i / n * TAU + rot * .5; pts.push([Math.sin(th) * RR, Math.cos(th) * RR]); }
    ctx.globalCompositeOperation = 'lighter';
    line(pts, '#ff9a4a', .22, Math.max(4, k * 1.4)); line(pts, '#ffd9a0', .8, Math.max(1.2, k * .3));
    // the twist: short diagonal strokes along it
    for (let i = 0; i < n * rim; i += 2) { const th = i / n * TAU + rot * .5, c = [Math.sin(th) * RR, Math.cos(th) * RR], d = [Math.cos(th) * .5, -Math.sin(th) * .5]; line([[c[0] - d[0] - c[0] * .006, c[1] - d[1] - c[1] * .006], [c[0] + d[0] + c[0] * .006, c[1] + d[1] + c[1] * .006]], '#fff1d6', .35, Math.max(.8, k * .12)); }
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
  // the four beacon points with their icons in lantern boats
  const pts = o.points || [1, 1, 1, 1], ic = clamp(o.icons ?? 1);
  DIRS.forEach(([kind, th0], d) => {
    const on = clamp(pts[d] ?? 0), th = th0 + rot, cx = Math.sin(th) * R * 1.42, cz = Math.cos(th) * R * 1.42;
    out.points.push(C.P(...W(cx, cz)));
    if (on <= 0) return;
    // beacon: a short tower of light on a float
    const b0 = C.P(...W(Math.sin(th) * R * 1.02, Math.cos(th) * R * 1.02, .2)), b1 = C.P(...W(Math.sin(th) * R * 1.02, Math.cos(th) * R * 1.02, 3 + 2 * eoX(on)));
    if (b0 && b1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffd9a0', .8 * on); ctx.lineWidth = Math.max(1.2, b1[2] * .3); ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.lineTo(b1[0], b1[1]); ctx.stroke(); ctx.restore(); lanterns(ctx, t, [[b1[0], b1[1], Math.max(2, b1[2] * .8), d]], on, 0, { big: 1.4 }); }
    if (ic > 0) {
      const boats = iconLayout(kind, X0 + cx, Z0 + cz, R * .2, th);
      const lit = (b, i) => clamp(on * 1.5 - i / boats.length * .5) * ic;
      drawFleet(ctx, t, C, boats, { lantern: lit, sail: 'none', scale: Math.max(.5, R / 80) });
      // the icon's outline in thin light between its boats, and its flare
      const P = resample(ICON_PTS[kind], .1).map(([u, v]) => { const c = Math.cos(th), s = Math.sin(th); return [cx + (u * c + v * s) * R * .2, cz + (-u * s + v * c) * R * .2]; });
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; line(P, '#ffb35c', .35 * on * ic, Math.max(1, k * .12)); ctx.restore();
    }
  });
  // the needle: a line of lantern boats
  if (o.needle && (o.needle.a ?? 1) > 0) {
    const nd = o.needle, boats = needleLayout(nd.n ?? 9, X0, Z0, nd.ang ?? 0, R * .85, 7);
    drawFleet(ctx, t, C, boats, { lantern: (b, i) => clamp((nd.a ?? 1) * boats.length * 1.2 - i), sail: 'none', scale: Math.max(.5, R / 80) });
  }
  return out;
}
