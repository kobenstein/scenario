// Film 8 · chunk c02 (01a · the memory) · the world of this chunk, drawn around the shared kit (lib/f8_kit.mjs: glyph,
// firefly, nightLand, pulse). Owner: c02 builder. Other chunks may import, never edit.
//
// ONE CAMERA for the whole chunk: the plane Z = 0 holds the houses and the great network (W1 coordinates = screen px at the reference
// camera {x 720, y 470, k 1}); a real perspective floor (Y = FLOOR) runs toward the camera. cam = { x, y, k, h }:
//   x, y = the world point of the Z=0 plane at the screen centre, k = zoom of that plane, h = the camera's 3D height (world Y; a lens
//   shift keeps verticals vertical, so the network keeps its shape while the camera cranes up to look down on the floor).
//   P(cam, X, Y, Z) → [sx, sy, scale] | null      plane(ctx, cam, fn) draws fn in plane coords (Z = 0)
//
// What lives here:
//   memNet / cluster / filament / sparks   the memory as an organic neural network (no grid anywhere; see THE NETWORK below)
//   oldHouse(ctx, t, S) / newHouse(ctx, t, S)   the ordinary company (3 storeys, 9 rooms) and the A.I.-native one (one hall + the network)
//   hallFloor(ctx, t, cam, o)          the dark hall: floor boards in perspective, the light pool under the network
//   plaque(ctx, t, cam, o)             the brass museum plaque under the network ("COMPANY BRAIN" / SILICON VALLEY)
//   meetingRing(ctx, t, cam, m, o)     a circle of seated people on the floor (a meeting as a form), its centre light, its thread
//   nameLabel(ctx, t, o)               TOM BLOMFIELD · role line with strike-through and the new line (mask reveals only)
//   glowFrom(ctx, t, plateFn, u, at, o) a handoff plate as a light that shrinks to / grows from a point (no alpha over the scene:
//                                      the plate is the core of an in-world light, its edge is the light's own falloff)
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, canvas, hatch, text } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { figure, figureFlat, POSES, walk, life } from './figure.mjs';
import { F8, glyph, qio, eoutX } from './f8_kit.mjs';
import { TSHIFT } from './handoff4.mjs';

const TAU = Math.PI * 2;
export const FCAM = 1500;          // focal length (px) of the one camera
export const FLOOR = 830;          // world Y of every floor / ground
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---------------------------------------------------------------- camera
export function camZ(cam) { return -FCAM / cam.k; }
export function P(cam, X, Y, Z = 0) {
  const d = Z - camZ(cam); if (d < 8) return null;
  const s = FCAM / d, h = cam.h ?? cam.y;
  return [W / 2 + (X - cam.x) * s, H / 2 + (Y - h) * s + cam.k * (h - cam.y), s];
}
export function plane(ctx, cam, fn) { ctx.save(); ctx.translate(W / 2 - cam.x * cam.k, H / 2 - cam.y * cam.k); ctx.scale(cam.k, cam.k); fn(ctx); ctx.restore(); }
// keyframed camera: keys [{ t, x, y, k, h, e }] (e = easing INTO this key: 'qio' (default) | 'sine' | 'lin' | 'eout' | fn); k in log space
const EASE = { qio, sine: (x) => .5 - .5 * Math.cos(Math.PI * clamp(x)), lin: (x) => clamp(x), eout: (x) => eoutX(x), eio: (x) => eio(clamp(x)) };
export function camAt(keys, t) {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i]; if (t > b.t) continue;
    const e = typeof b.e === 'function' ? b.e : EASE[b.e || 'qio'], u = e((t - a.t) / (b.t - a.t));
    const ha = a.h ?? a.y, hb = b.h ?? b.y;
    return { x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), k: Math.exp(mix(Math.log(a.k), Math.log(b.k), u)), h: mix(ha, hb, u) };
  }
  return { ...keys[keys.length - 1] };
}

// ---------------------------------------------------------------- THE NETWORK (MOTION.md §1, revised 2026-10-23: no grid anywhere)
// An organic neural network of light: nodes = soft glowing somata (gold, white core, faint halo), filaments = curved, tapering,
// branching strands between them (thick at the node, hair-thin in the middle), signals travelling along them, slow breathing,
// staggered twinkle. Seen whole, the cloud of nodes reads as a brain: two hemispheres, a faint central cleft, gyri-like curls in
// the node density (silhouette only, made of the network itself). Close up it is pure network.
//   await netReady()                         sprites as Images + the geometry (call once)
//   memNet(ctx, t, cam, o)                   the great network in plane coords (inside plane()); o = { a, clip [x,y,w,h], breath,
//                                            sprouts [{ t0, X, Y, glyph, from [X,Y] , n 3 }], wave { i | X,Y, t0, speed }, dim,
//                                            flares [{ i, t, a }] }
//   netNearest(X, Y, n, f?) → [i…]           nearest front nodes (f: (node) → bool filter)
//   netNode(i, t) → [X, Y]                   a front node's live position
//   cluster(ctx, t, cam, X, Y, o)            the small 3D cluster of nodes over a head (screen space; at k ≫ 1 the camera is inside it)
//                                            o = { r 18, seed, n 9, a 1, glow 1, flare 0 } → { x, y, s, nodes [[sx,sy,s]|null] }
//   filament(ctx, a, b, o)                   one organic strand between two points (current coords); o = { bow, a, w, t, seed, signal,
//                                            grow 0..1 (from a), wob }
//   sparks(ctx, t, t0, x, y, o)              thin sparks where a filament snaps
export const BR = { cx: 720, cy: 175, rx: 1320, ry: 615 };      // the brain silhouette in plane coords (bottom ≈ y 790)
const NETSPR = {};
function makeSprite(R, core, col, deep, stops) {
  const [c, g] = canvas(R * 2, R * 2);
  const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(stops[0], rgba(col, .75)); rg.addColorStop(stops[1], rgba(deep, .18)); rg.addColorStop(1, rgba(deep, 0));
  g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2);
  const d = g.getImageData(0, 0, R * 2, R * 2), p = d.data, r = prng(R * 7 + 5);
  for (let i = 3; i < p.length; i += 4) { const a = p[i] / 255; if (a <= 0) continue; const kk = .45 * 4 * a * (1 - a), on = r() < a ? Math.min(1, a * 2.2) : 0; p[i] = 255 * (a * (1 - kk) + kk * on); }
  g.putImageData(d, 0, 0); return c;
}
// brain shape: < 1 inside. Two hemispheres side by side, a cleft between them, a notch at the bottom centre, lobed outline.
function brainE(X, Y) {
  const u = (X - BR.cx) / BR.rx, v = (Y - BR.cy) / BR.ry, au = Math.abs(u);
  if (v < .42 && au < (.016 + .03 * (.42 - v)) * clamp((.42 - v) / .25)) return 9;   // the cleft (wide at the top, closing toward the middle)
  if (au < .07 && v > .9) return 9;                                              // a small notch at the bottom centre
  const ang = Math.atan2(v, au - .5), lobe = 1 + .05 * Math.sin(ang * 5 + .6) + .03 * Math.sin(ang * 9 + 2);
  const ru = .5 * (1 - .12 * Math.max(0, v)) * lobe, rv = 1 * lobe;
  const hemi = ((au - .5) / ru) ** 2 + (v / rv) ** 2;
  const body = (au / (.44 * (1 + .03 * Math.sin(v * 9)))) ** 2 + ((v - .28) / .7) ** 2;   // the full lower middle (no V-gap between the domes)
  return Math.min(hemi, body);
}
let NETG = null;
function netGeom() {
  if (NETG) return NETG;
  const r = prng(8123), n1 = vnoise(31), n2 = vnoise(77);
  const nodes = [], deep = [];
  const gyri = (X, Y) => {   // curled bands (mirrored left/right) + low-frequency clumps
    const u = Math.abs(X - BR.cx) / BR.rx, v = (Y - BR.cy) / BR.ry;
    const w = fbm(n1, u * 3.2, v * 3.2, 3), band = .5 + .5 * Math.sin((u * 7 + v * 2.5 + w * 4.2) * 3.1);
    const clump = fbm(n2, X / 520, Y / 520, 3);
    return { band, clump };
  };
  // front nodes (bright, alive)
  let guard = 0;
  while (nodes.length < 900 && guard++ < 60000) {
    const X = BR.cx + (r() * 2 - 1) * BR.rx * 1.02, Y = BR.cy + (r() * 2 - 1) * BR.ry * 1.02, e = brainE(X, Y); if (e > 1) continue;
    const { band, clump } = gyri(X, Y), rim = e > .78 ? 1.7 : 1;
    const p = (.22 + .78 * band ** 2) * (.45 + 1.2 * clump ** 2) * rim; if (r() > p) continue;
    const big = r();
    nodes.push({ X, Y, core: 2.2 + 9 * big ** 4 + 1.5 * r(), br: .55 + .45 * r(), ph: r() * TAU, tw: .6 + r() * 1.6, side: Math.sign(X - BR.cx), e });
  }
  // deep, older nodes (dimmer, smaller, they stay)
  guard = 0;
  while (deep.length < 1700 && guard++ < 60000) {
    const X = BR.cx + (r() * 2 - 1) * BR.rx, Y = BR.cy + (r() * 2 - 1) * BR.ry, e = brainE(X, Y); if (e > .98) continue;
    const { band } = gyri(X, Y); if (r() > .25 + .75 * band) continue;
    deep.push({ X, Y, core: 1 + 1.6 * r(), br: .35 + .4 * r(), ph: r() * TAU, tw: .4 + r(), side: Math.sign(X - BR.cx) });
  }
  // a spatial hash for nearest neighbours
  const grid = (list, cell) => { const m = new Map(); list.forEach((q, i) => { const k = Math.floor(q.X / cell) + ':' + Math.floor(q.Y / cell); (m.get(k) || m.set(k, []).get(k)).push(i); }); return { m, cell }; };
  const near = (list, G, X, Y, n, maxD, ok) => {
    const cx = Math.floor(X / G.cell), cy = Math.floor(Y / G.cell), out = [];
    for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) { const L = G.m.get((cx + a) + ':' + (cy + b)); if (!L) continue; for (const i of L) { const q = list[i], d = Math.hypot(q.X - X, q.Y - Y); if (d > 0 && d < maxD && (!ok || ok(q, i))) out.push([d, i]); } }
    out.sort((p, q) => p[0] - q[0]); return out.slice(0, n).map((x) => x[1]);
  };
  const G0 = grid(nodes, 120), G1 = grid(deep, 90);
  const mkEdges = (list, G, kMin, kMax, maxD, bridge) => {
    const E = [], seen = new Set();
    list.forEach((q, i) => {
      const k = kMin + Math.floor(r() * (kMax - kMin + 1));
      for (const j of near(list, G, q.X, q.Y, k, maxD, (o) => o.side === q.side || (q.Y > BR.cy + .4 * BR.ry && o.Y > BR.cy + .4 * BR.ry) || (bridge && Math.abs(q.X - BR.cx) < 160 && r() < .25))) {
        const key = i < j ? i + ',' + j : j + ',' + i; if (seen.has(key)) continue; seen.add(key);
        const L = Math.hypot(list[j].X - q.X, list[j].Y - q.Y);
        E.push({ a: i, b: j, L, bow: (r() - .5) * .5, br: .45 + .55 * r(), ph: r() * TAU, sig: r() < .3 ? { per: 2.5 + r() * 4.5, off: r() * 10, dir: r() < .5 } : null });
      }
    });
    return E;
  };
  // micro layer: fine somata and strands that only matter close up (k > 1.5), so the close-up is a dense living tissue
  const micro = [];
  for (let X = BR.cx - BR.rx; X < BR.cx + BR.rx; X += 44) for (let Y = BR.cy - BR.ry; Y < BR.cy + BR.ry; Y += 44) {
    const n = 1 + Math.floor(r() * 3); for (let k = 0; k < n; k++) { const x = X + r() * 44, y = Y + r() * 44; if (brainE(x, y) > 1) continue; micro.push({ X: x, Y: y, core: .9 + 1.8 * r() ** 2, br: .4 + .6 * r(), ph: r() * TAU, tw: .5 + r() * 1.5, side: Math.sign(x - BR.cx) }); }
  }
  const G2 = grid(micro, 60);
  const edges = mkEdges(nodes, G0, 2, 3, 200, true), dedges = mkEdges(deep, G1, 2, 2, 130, false), medges = mkEdges(micro, G2, 2, 3, 90, true);
  // dendrite tips: short branching stubs that end in nothing
  const stubs = [];
  nodes.forEach((q, i) => { const n = r() < .65 ? 1 + (r() < .35 ? 1 : 0) : 0; for (let k = 0; k < n; k++) { const ang = r() * TAU, L = 16 + 42 * r() * (1 + q.core / 8); stubs.push({ i, ang, L, bend: (r() - .5) * 1.2, fork: r() < .5 ? { at: .55, ang: (r() < .5 ? 1 : -1) * (.5 + .4 * r()), L: .45 } : null, ph: r() * TAU }); } });
  NETG = { nodes, deep, micro, edges, dedges, medges, stubs, G0, near: (X, Y, n, ok, maxD = 600) => near(nodes, G0, X, Y, n, maxD, ok) };
  // nearest with a wide search (the hash covers ±2 cells); fall back to a scan
  NETG.nearest = (X, Y, n, ok) => { let res = NETG.near(X, Y, n, ok, 280); if (res.length < n) res = nodes.map((q, i) => [Math.hypot(q.X - X, q.Y - Y), i]).filter(([d, i]) => d > 0 && (!ok || ok(nodes[i], i))).sort((p, q) => p[0] - q[0]).slice(0, n).map((x) => x[1]); return res; };
  return NETG;
}
export async function netReady() {
  const mk = { gold: [64, F8.goldCore, F8.gold, F8.goldDeep, [.26, .58]], halo: [96, F8.gold, F8.gold, F8.goldDeep, [.25, .6]] };
  for (const [k, a] of Object.entries(mk)) if (!NETSPR[k]) { const c = makeSprite(...a); NETSPR[k] = await loadImage(c.toBuffer('image/png')); }
  netGeom();
}
function nspr(ctx, k, x, y, r, a) { if (a <= .004 || r < .2) return; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(NETSPR[k], x - r, y - r, r * 2, r * 2); }
export const netNearest = (X, Y, n, ok) => netGeom().nearest(X, Y, n, ok);
const nodePos = (q, t) => [q.X + 2.4 * Math.sin(t * .31 + q.ph), q.Y + 2.4 * Math.cos(t * .27 + q.ph * 1.3)];
export const netNode = (i, t) => nodePos(netGeom().nodes[i], t);
// a quadratic strand a→b with a sideways bow; returns its control point
const ctrl = (a, b, bow, wob) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1]; return [mx - dy * bow + wob[0], my + dx * bow + wob[1]]; };
const qpt = (a, c, b, q) => [(1 - q) ** 2 * a[0] + 2 * (1 - q) * q * c[0] + q * q * b[0], (1 - q) ** 2 * a[1] + 2 * (1 - q) * q * c[1] + q * q * b[1]];
// sub-curve [q0, q1] of a quadratic → (start, control, end)
function subq(a, c, b, q0, q1) {
  const p0 = qpt(a, c, b, q0), p1 = qpt(a, c, b, q1);
  const d0 = [2 * (1 - q0) * (c[0] - a[0]) + 2 * q0 * (b[0] - c[0]), 2 * (1 - q0) * (c[1] - a[1]) + 2 * q0 * (b[1] - c[1])], s = (q1 - q0) / 2;
  return [p0, [p0[0] + d0[0] * s, p0[1] + d0[1] * s], p1];
}
// the great network. ctx: plane coords (inside plane(ctx, cam, …)).
export function memNet(ctx, t, cam, o = {}) {
  const N = netGeom(), k = cam.k, A = (o.a ?? 1), f = Math.pow(k, .5) / k, fn = Math.pow(k, .7) / k;   // fn: node size (somata grow a little more close up)    // f: plane units per "screen px at k = 1"
  const mg = 120 / k, vx0 = cam.x - W / 2 / k - mg, vx1 = cam.x + W / 2 / k + mg, vy0 = cam.y - H / 2 / k - mg, vy1 = cam.y + H / 2 / k + mg;
  const cl = o.clip; const inV = (X, Y, m = 0) => X > vx0 - m && X < vx1 + m && Y > vy0 - m && Y < vy1 + m && (!cl || (X > cl[0] - m && X < cl[0] + cl[2] + m && Y > cl[1] - m && Y < cl[1] + cl[3] + m));
  // brightness of each front node: twinkle, a breathing wave across the brain (period ~4.2 s), wave and flares
  const P0 = N.nodes.map((q) => nodePos(q, t)), nb = new Float32Array(N.nodes.length), boost = new Float32Array(N.nodes.length);
  const wv = o.wave; let wO = null; if (wv) wO = wv.i != null ? N.nodes[wv.i] : { X: wv.X, Y: wv.Y };
  const wHit = (i) => wv.t0 + Math.hypot(N.nodes[i].X - wO.X, N.nodes[i].Y - wO.Y) / (wv.speed ?? 1500);
  const dim = o.dim ?? 0;
  for (let i = 0; i < N.nodes.length; i++) {
    const q = N.nodes[i];
    const breath = 1 + .16 * Math.sin(TAU * t / 4.2 - (q.X - BR.cx) / 900 + q.Y / 1400);
    let b = q.br * (.72 + .28 * Math.sin(t * q.tw + q.ph)) * breath;
    if (wv) { const d = t - wHit(i); if (d > -.2) b += 1.5 * Math.exp(-(((d) / .16) ** 2)) + .25 * Math.exp(-Math.max(0, d) * .9) * (d > 0 ? 1 : 0); }
    nb[i] = b * (1 - dim);
  }
  for (const fl of o.flares || []) { const d = t - fl.t; if (d > -.15 && d < 2) boost[fl.i] += (fl.a ?? 1.4) * (d < 0 ? Math.exp(-((d / .06) ** 2)) : Math.exp(-d * 2.6)); }
  // sprouts: new nodes and their growing filaments; their targets flare 60–120 ms after a filament arrives
  const SP = (o.sprouts || []).filter((s) => t > s.t0 - .7).map((s) => {
    const tg = s.targets || (s.targets = N.nearest(s.X, s.Y, s.n ?? 3));
    tg.forEach((i, j) => { const ta = s.t0 + .5 + j * .07 + .09, d = t - ta; if (d > -.1 && d < 2) boost[i] += 1.2 * (d < 0 ? Math.exp(-((d / .05) ** 2)) : Math.exp(-d * 2.4)); });
    return s;
  });
  for (let i = 0; i < nb.length; i++) nb[i] += boost[i];
  ctx.save();
  if (cl) { ctx.beginPath(); ctx.rect(cl[0], cl[1], cl[2], cl[3]); ctx.clip(); }
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const wob = (e) => [3 * Math.sin(t * .5 + e.ph), 3 * Math.cos(t * .43 + e.ph * 1.7)];
  // ---- the deep layer (old memories: dim, fine, they stay)
  {
    ctx.beginPath();
    for (const e of N.dedges) { const a = N.deep[e.a], b = N.deep[e.b]; if (!inV(a.X, a.Y, 160) && !inV(b.X, b.Y, 160)) continue; const pa = [a.X, a.Y], pb = [b.X, b.Y], c = ctrl(pa, pb, e.bow, [0, 0]); ctx.moveTo(pa[0], pa[1]); ctx.quadraticCurveTo(c[0], c[1], pb[0], pb[1]); }
    ctx.strokeStyle = rgba(F8.gold, .13 * A * (1 - dim * .6)); ctx.lineWidth = .7 * f; ctx.stroke();
    for (const q of N.deep) { if (!inV(q.X, q.Y)) continue; nspr(ctx, 'gold', q.X, q.Y, q.core * 3 * f, q.br * .42 * A * (1 - dim * .5) * (.75 + .25 * Math.sin(t * q.tw + q.ph))); }
    ctx.globalAlpha = 1;
  }
  // ---- the micro layer (close up only; its strength follows the zoom, so it never pops)
  const mk = clamp((k - 1.4) / 2.2);
  if (mk > 0) {
    ctx.beginPath();
    for (const e of N.medges) { const a = N.micro[e.a], b = N.micro[e.b]; if (!inV(a.X, a.Y, 90) && !inV(b.X, b.Y, 90)) continue; const pa = [a.X, a.Y], pb = [b.X, b.Y], c = ctrl(pa, pb, e.bow, [1.5 * Math.sin(t * .5 + e.ph), 1.5 * Math.cos(t * .4 + e.ph)]); ctx.moveTo(pa[0], pa[1]); ctx.quadraticCurveTo(c[0], c[1], pb[0], pb[1]); }
    ctx.strokeStyle = rgba(F8.gold, .1 * mk * A * (1 - dim * .5)); ctx.lineWidth = 2.6 * f; ctx.stroke();
    ctx.strokeStyle = rgba(F8.gold, .3 * mk * A * (1 - dim * .5)); ctx.lineWidth = .6 * f; ctx.stroke();
    for (const q of N.micro) { if (!inV(q.X, q.Y)) continue; const breath = 1 + .16 * Math.sin(TAU * t / 4.2 - (q.X - BR.cx) / 900 + q.Y / 1400); nspr(ctx, 'gold', q.X, q.Y, q.core * 3.4 * fn, q.br * .8 * mk * A * breath * (1 - dim * .5) * (.7 + .3 * Math.sin(t * q.tw + q.ph))); }
    ctx.globalAlpha = 1;
  }
  // ---- front filaments, bucketed by brightness (one path per bucket and pass)
  const NB = 6, bucket = Array.from({ length: NB }, () => []), roots = Array.from({ length: NB }, () => []);
  for (const e of N.edges) {
    const a = P0[e.a], b = P0[e.b]; if (!inV(a[0], a[1], 240) && !inV(b[0], b[1], 240)) continue;
    const br = e.br * Math.min(2.2, (nb[e.a] + nb[e.b]) / 2), lv = Math.min(NB - 1, Math.floor(br / 2.2 * NB)); if (br < .03) continue;
    const c = ctrl(a, b, e.bow, wob(e)); bucket[lv].push([a, c, b]); roots[lv].push(subq(a, c, b, 0, .3), subq(a, c, b, .7, 1));
  }
  for (let lv = 0; lv < NB; lv++) {
    const L = (lv + .5) / NB * 2.2 * A; if (!bucket[lv].length) continue;
    ctx.beginPath(); for (const [a, c, b] of bucket[lv]) { ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(c[0], c[1], b[0], b[1]); }
    ctx.strokeStyle = rgba(F8.gold, .05 * L); ctx.lineWidth = 4.5 * f; ctx.stroke();
    ctx.strokeStyle = rgba(F8.gold, .3 * L); ctx.lineWidth = .9 * f; ctx.stroke();
    ctx.strokeStyle = rgba(F8.goldCore, .32 * L); ctx.lineWidth = .4 * f; ctx.stroke();
    ctx.beginPath(); for (const [a, c, b] of roots[lv]) { ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(c[0], c[1], b[0], b[1]); }
    ctx.strokeStyle = rgba(F8.gold, .32 * L); ctx.lineWidth = 1.9 * f; ctx.stroke();
  }
  // ---- dendrite tips (hair-thin, branching, ending in nothing)
  ctx.beginPath();
  for (const s of N.stubs) {
    const p = P0[s.i]; if (!inV(p[0], p[1], 60)) continue;
    const ang = s.ang + .15 * Math.sin(t * .6 + s.ph), e = [p[0] + Math.cos(ang) * s.L, p[1] + Math.sin(ang) * s.L], c = ctrl(p, e, s.bend * .4, [0, 0]);
    ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]);
    if (s.fork) { const m = qpt(p, c, e, s.fork.at), a2 = ang + s.fork.ang, e2 = [m[0] + Math.cos(a2) * s.L * s.fork.L, m[1] + Math.sin(a2) * s.L * s.fork.L]; ctx.moveTo(m[0], m[1]); ctx.quadraticCurveTo((m[0] + e2[0]) / 2 + 3, (m[1] + e2[1]) / 2 - 3, e2[0], e2[1]); }
  }
  ctx.strokeStyle = rgba(F8.gold, .26 * A * (1 - dim * .5)); ctx.lineWidth = .7 * f; ctx.stroke();
  ctx.strokeStyle = rgba(F8.gold, .09 * A * (1 - dim * .5)); ctx.lineWidth = 2.6 * f; ctx.stroke();
  // ---- signals: small bright pulses with a short tail travelling along filaments
  for (const e of N.edges) {
    if (!e.sig) continue; const a = P0[e.a], b = P0[e.b]; if (!inV(a[0], a[1], 200) && !inV(b[0], b[1], 200)) continue;
    const ph = ((t + e.sig.off) / e.sig.per) % 1, dur = Math.min(.9, e.L / 260) / e.sig.per; if (ph > dur) continue;
    let q = ph / dur; if (e.sig.dir) q = 1 - q; const c = ctrl(a, b, e.bow, wob(e)), sa = A * (1 - dim) * Math.sin(Math.PI * clamp(ph / dur)) ** .5;
    sigDraw(ctx, a, c, b, q, e.sig.dir ? 1 : -1, f, sa * .9);
  }
  // ---- the query wave: pulses race outward along every filament it crosses
  if (wv) for (const e of N.edges) {
    const ha = wHit(e.a), hb = wHit(e.b), t0 = Math.min(ha, hb), t1 = Math.max(ha, hb) + .02; if (t < t0 || t > t1 + .12) continue;
    const a = P0[e.a], b = P0[e.b]; if (!inV(a[0], a[1], 200) && !inV(b[0], b[1], 200)) continue;
    let q = clamp((t - t0) / (t1 - t0)); const fwd = ha <= hb; if (!fwd) q = 1 - q;
    sigDraw(ctx, a, ctrl(a, b, e.bow, wob(e)), b, q, fwd ? -1 : 1, f, 1.1 * A * (1 - clamp((t - t1) / .12)));
  }
  // ---- nodes (halo, soma)
  for (let i = 0; i < N.nodes.length; i++) {
    const q = N.nodes[i], p = P0[i]; if (!inV(p[0], p[1])) continue;
    const b = nb[i] * A, r = q.core * fn * (1 + .25 * Math.min(2, boost[i]));
    nspr(ctx, 'halo', p[0], p[1], r * 7, .14 * b);
    nspr(ctx, 'gold', p[0], p[1], r * 3.6, .9 * b);
  }
  ctx.globalAlpha = 1;
  // ---- sprouts: incoming spark, flash, the new soma, filaments growing to the neighbours, the glyph for ~1 s
  for (const s of SP) {
    const d = t - s.t0, X = s.X, Y = s.Y;
    if (d < 0 && s.from) { const u = eoutX(clamp((d + .7) / .7)), c = [(s.from[0] + X) / 2, Math.min(s.from[1], Y) - 140], p = qpt(s.from, c, [X, Y], u), p2 = qpt(s.from, c, [X, Y], Math.max(0, u - .22));
      ctx.strokeStyle = rgba(F8.gold, .5 * A); ctx.lineWidth = 1.6 * f * (s.s ?? 1); ctx.beginPath(); ctx.moveTo(p2[0], p2[1]); ctx.quadraticCurveTo((p2[0] + p[0]) / 2 + 4, (p2[1] + p[1]) / 2, p[0], p[1]); ctx.stroke();
      nspr(ctx, 'gold', p[0], p[1], 16 * f * (s.s ?? 1), .9 * A); continue; }
    if (d < 0) continue;
    const fl = Math.exp(-d * 3.5), sz = (s.core ?? 7) * f * (s.s ?? 1);
    s.targets.forEach((i, j) => {
      const g = eoutX(clamp((d - j * .07) / .5)); if (g <= 0) return;
      const b = P0[i], c = ctrl([X, Y], b, (j % 2 ? .22 : -.18), [0, 0]), sub = subq([X, Y], c, b, 0, g);
      ctx.beginPath(); ctx.moveTo(sub[0][0], sub[0][1]); ctx.quadraticCurveTo(sub[1][0], sub[1][1], sub[2][0], sub[2][1]);
      ctx.strokeStyle = rgba(F8.gold, (.5 + .5 * fl) * A); ctx.lineWidth = 1.2 * f; ctx.stroke(); ctx.strokeStyle = rgba(F8.gold, .08 * A); ctx.lineWidth = 5 * f; ctx.stroke();
      if (g < 1) nspr(ctx, 'gold', sub[2][0], sub[2][1], 9 * f, .9 * A);
    });
    nspr(ctx, 'halo', X, Y, sz * (5 + 8 * fl), (.1 + .4 * fl) * A);
    nspr(ctx, 'gold', X, Y, sz * 2.8 * eoutX(clamp(d / .3)), (.95 + .3 * Math.sin(t * 2 + X)) * A);
    if (s.glyph) { const ga = clamp(d / .2) * (1 - clamp((d - 1.1) / .45)), sh = 1 - .6 * clamp((d - 1.1) / .45), gs = (s.gs ?? 1.5) * f * (s.s ?? 1);
      ctx.globalAlpha = 1; glyph(ctx, s.glyph, X + 22 * f * (s.s ?? 1) * sh, Y - 22 * f * (s.s ?? 1) * sh, gs * sh, F8.goldCore, .95 * ga * A); }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  return { P: P0, nb };
}
function sigDraw(ctx, a, c, b, q, back, f, al) {
  if (al <= .01) return;
  const p = qpt(a, c, b, q), p2 = qpt(a, c, b, clamp(q + back * .22));
  ctx.globalAlpha = 1; ctx.strokeStyle = rgba(F8.goldCore, .55 * al); ctx.lineWidth = 1.3 * f; ctx.beginPath(); ctx.moveTo(p2[0], p2[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
  nspr(ctx, 'gold', p[0], p[1], 7 * f, al); ctx.globalAlpha = 1;
}
// one organic strand between two points (current coords); o.grow draws it from a up to that fraction; o.signal = 0..1 pulse position
export function filament(ctx, a, b, o = {}) {
  const A = o.a ?? 1, w = o.w ?? 1, t = o.t ?? 0, ph = o.seed ?? 0, wb = o.wob ?? 3;
  const c = ctrl(a, b, o.bow ?? .18, [wb * Math.sin(t * .6 + ph), wb * Math.cos(t * .5 + ph * 1.3)]), g = clamp(o.grow ?? 1); if (g <= 0 || A <= 0) return;
  const [p0, c1, p1] = subq(a, c, b, 0, g);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(c1[0], c1[1], p1[0], p1[1]);
  ctx.strokeStyle = rgba(F8.gold, .07 * A); ctx.lineWidth = 4.5 * w; ctx.stroke();
  ctx.strokeStyle = rgba(F8.gold, .45 * A); ctx.lineWidth = .9 * w; ctx.stroke();
  ctx.strokeStyle = rgba(F8.goldCore, .4 * A); ctx.lineWidth = .4 * w; ctx.stroke();
  for (const [q0, q1] of [[0, .28], [.72, 1]]) { if (q0 >= g) continue; const s = subq(a, c, b, q0, Math.min(q1, g)); ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]); ctx.quadraticCurveTo(s[1][0], s[1][1], s[2][0], s[2][1]); ctx.strokeStyle = rgba(F8.gold, .4 * A); ctx.lineWidth = 1.9 * w; ctx.stroke(); }
  if (o.signal != null && o.signal > 0 && o.signal < 1 && o.signal <= g) sigDraw(ctx, a, c, b, o.signal, o.sigBack ?? -1, w, (o.sigA ?? 1) * A);
  ctx.restore();
}
// thin sparks where a filament snaps (pure function of t)
export function sparks(ctx, t, t0, x, y, o = {}) {
  const d = t - t0; if (d < 0 || d > .7) return; const r = prng(o.seed ?? 3), s = o.s ?? 1, n = o.n ?? 9;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const ang = r() * TAU, sp = (60 + 120 * r()) * s, life = .3 + .35 * r(); if (d > life) continue;
    const u = d / life, e = 1 - (1 - u) ** 2, x1 = x + Math.cos(ang) * sp * e, y1 = y + Math.sin(ang) * sp * e + 30 * s * u * u, x0 = x + Math.cos(ang) * sp * Math.max(0, e - .25), y0 = y + Math.sin(ang) * sp * Math.max(0, e - .25) + 30 * s * Math.max(0, u - .2) ** 2;
    ctx.strokeStyle = rgba(F8.goldCore, .9 * (1 - u)); ctx.lineWidth = 1.1 * s; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  const g = ctx.createRadialGradient(x, y, 0, x, y, 26 * s); g.addColorStop(0, rgba(F8.goldCore, .9 * Math.exp(-d * 9))); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - 26 * s, y - 26 * s, 52 * s, 52 * s);
  ctx.restore();
}

// ---------------------------------------------------------------- the cluster over a head: a small 3D knot of nodes and filaments
// Seen from far it is a small glowing group of somata; as the camera comes within r we are inside it: somata drift past as soft
// lights and filaments sweep across the frame toward a bright core.
const CLUS = new Map();
function cluGeom(seed, n) {
  const key = seed + ':' + n; if (CLUS.has(key)) return CLUS.get(key);
  const r = prng(seed * 41 + 3), nodes = [{ p: [0, 0, 0], core: 1.15, br: 1, ph: 0 }];
  for (let i = 1; i < n; i++) { let p; do { p = [r() * 2 - 1, r() * 2 - 1, r() * 2 - 1]; } while (Math.hypot(...p) > 1 || Math.hypot(...p) < .35);
    nodes.push({ p, core: .45 + .55 * r() ** 2, br: .6 + .4 * r(), ph: r() * TAU }); }
  const E = [], seen = new Set();
  nodes.forEach((a, i) => { const ds = nodes.map((b, j) => [Math.hypot(b.p[0] - a.p[0], b.p[1] - a.p[1], b.p[2] - a.p[2]), j]).filter((x) => x[1] !== i).sort((p, q) => p[0] - q[0]);
    for (const [, j] of ds.slice(0, i === 0 ? 4 : 2)) { const k = i < j ? i + ',' + j : j + ',' + i; if (seen.has(k)) continue; seen.add(k);
      const m = nodes[j].p, c = [(a.p[0] + m[0]) / 2 + (r() - .5) * .5, (a.p[1] + m[1]) / 2 + (r() - .5) * .5, (a.p[2] + m[2]) / 2 + (r() - .5) * .5]; E.push({ a: i, b: j, c, ph: r() * TAU, sig: r() < .5 ? 1.6 + r() * 2 : 0 }); } });
  // dendrite tips pointing outward
  nodes.forEach((a, i) => { if (i === 0) return; const L = .35 + .4 * r(); const d = a.p.map((v) => v / (Math.hypot(...a.p) || 1)); E.push({ a: i, tip: a.p.map((v, k) => v + d[k] * L + (r() - .5) * .3), c: a.p.map((v, k) => v + d[k] * L * .5 + (r() - .5) * .25), ph: r() * TAU }); });
  const g = { nodes, E }; CLUS.set(key, g); return g;
}
export function cluster(ctx, t, cam, X, Y, o = {}) {
  const r = o.r ?? 18, A = o.a ?? 1, glowA = o.glow ?? 1, fl = o.flare ?? 0;
  const c = P(cam, X, Y, 0); if (!c) return null;
  const D = -camZ(cam), sc = c[2];
  if (c[0] < -r * sc * 4 - 200 || c[0] > W + r * sc * 4 + 200 || c[1] < -r * sc * 4 - 200 || c[1] > H + r * sc * 4 + 200) return { x: c[0], y: c[1], s: sc, nodes: [] };
  const G = cluGeom(o.seed ?? 1, o.n ?? 9), rot = t * (o.spin ?? .22) + (o.seed ?? 1), tilt = .35, ct = Math.cos(tilt), st = Math.sin(tilt), cs = Math.cos(rot), sn = Math.sin(rot);
  const near = Math.max(.5, D * .03);
  const proj = (p) => { let px = p[0] * r, py = p[1] * r, pz = p[2] * r; [px, pz] = [px * cs - pz * sn, px * sn + pz * cs]; [py, pz] = [py * ct - pz * st, py * st + pz * ct]; const d = D + pz; if (d < near) return null; const s = FCAM / d; return [c[0] + px * s, c[1] + py * s, s, d]; };
  const fade = (p) => clamp((p[3] - near) / (near * 2.5 + 1));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  // the warm light the cluster gives off (it lights the room)
  if (glowA > 0) { const insideK = clamp((D / r - .3) / 1.2), coreR = Math.min(2600, r * sc * 2.6) * mix(.12, 1, insideK), g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], coreR);
    g.addColorStop(0, rgba(F8.goldCore, (.32 + .3 * fl) * glowA * A)); g.addColorStop(.3, rgba(F8.gold, (.13 + .12 * fl) * glowA * A)); g.addColorStop(1, rgba(F8.goldDeep, 0)); ctx.fillStyle = g; ctx.fillRect(c[0] - coreR, c[1] - coreR, coreR * 2, coreR * 2); }
  const PN = G.nodes.map((q) => proj(q.p));
  for (const e of G.E) {
    const pts = []; const a = G.nodes[e.a].p, b = e.tip || G.nodes[e.b].p, cc = e.c.map((v, k) => v + .06 * Math.sin(t * .7 + e.ph + k));
    for (let k = 0; k <= 14; k++) { const q = k / 14; pts.push(proj([0, 1, 2].map((m) => (1 - q) ** 2 * a[m] + 2 * (1 - q) * q * cc[m] + q * q * b[m]))); }
    const ok = pts.filter(Boolean); if (ok.length < 2) continue;
    const md = Math.min(...ok.map((p) => p[3])), sw = FCAM / md, fa = clamp((md - near) / (near * 2.5 + 1));
    for (const [wm, al, col] of [[4, .06, F8.gold], [1, .45, F8.gold], [.45, .6, F8.goldCore]]) {
      ctx.strokeStyle = rgba(col, al * A * fa * (e.tip ? .55 : 1) * (1 + .6 * fl)); ctx.lineWidth = clamp(.16 * r * sw * .1, .45, 5) * wm * (e.tip ? .7 : 1);
      ctx.beginPath(); let s0 = false; for (const p of pts) { if (!p) { s0 = false; continue; } s0 ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); s0 = true; } ctx.stroke();
    }
    if (e.sig && !e.tip) { const ph = ((t + e.ph) / e.sig) % 1; if (ph < .45) { const q = ph / .45, i = Math.round(q * 14), p = pts[i]; if (p) nspr(ctx, 'gold', p[0], p[1], clamp(1.6 * p[2], 2.5, 60), .85 * A * fa); } }
  }
  G.nodes.forEach((q, i) => { const p = PN[i]; if (!p) return; const rr = Math.min(i === 0 ? 46 : 70, q.core * 1.6 * p[2]), b = q.br * (.75 + .25 * Math.sin(t * 1.3 + q.ph)) * A * fade(p) * (1 + .7 * fl);
    nspr(ctx, 'halo', p[0], p[1], Math.max(4, rr * 4.5), .14 * b); nspr(ctx, 'gold', p[0], p[1], Math.max(2.2, rr * 2.4), .85 * b); });
  ctx.globalAlpha = 1; ctx.restore();
  return { x: c[0], y: c[1], s: sc, nodes: PN };
}
// ---------------------------------------------------------------- houses (plane coords, Z = 0)
// engraved structure: a slab or wall piece = dark fill + pale engraved edge + hatch
const INK = '#07081a', WALL = '#141634', EDGE = '#8b84c4';
function slab(ctx, x, y, w, h, o = {}) {
  ctx.fillStyle = o.fill || WALL; ctx.fillRect(x, y, w, h);
  hatch(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], -.9, 4.2, .35, { col: '#000000', w: .8, wobble: .3, seed: Math.round(x * 3 + y) });
  ctx.strokeStyle = rgba(o.edge || EDGE, o.edgeA ?? .55); ctx.lineWidth = 1.1; ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
}
// a room's back wall: deep warm-violet, lit by its own light (the knot) from (lx, ly) with strength a
function roomWall(ctx, x, y, w, h, lx, ly, a, seed) {
  ctx.fillStyle = '#0d0c22'; ctx.fillRect(x, y, w, h);
  if (a > 0) {
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * .85);
    g.addColorStop(0, rgba('#6e5a36', .55 * a)); g.addColorStop(.45, rgba('#3a2e3e', .35 * a)); g.addColorStop(1, 'rgba(13,12,34,0)');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  }
  // plaster: fine engraved hatch, denser in the corners (shadow)
  hatch(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], -.86, 6, .22, { col: '#000000', w: .7, wobble: .5, seed });
  // the floor line and a skirting board
  ctx.fillStyle = '#0a0918'; ctx.fillRect(x, y + h - 6, w, 6);
  ctx.strokeStyle = rgba('#6f6aa8', .25); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + h - 6.5); ctx.lineTo(x + w, y + h - 6.5); ctx.stroke();
}
// the open archway in a side wall (a passage, no door leaf)
function arch(ctx, x, w, yTop, yBot) {
  ctx.fillStyle = '#05060f'; ctx.beginPath(); ctx.moveTo(x, yBot); ctx.lineTo(x, yTop + w * .5); ctx.quadraticCurveTo(x + w / 2, yTop - w * .2, x + w, yTop + w * .5); ctx.lineTo(x + w, yBot); ctx.closePath(); ctx.fill();
}
function roof(ctx, x0, x1, yBase, apex, t, seed) {
  const cx = (x0 + x1) / 2, pts = [[x0 - 26, yBase], [cx, apex], [x1 + 26, yBase]];
  ctx.fillStyle = '#10112c'; ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...pts[2]); ctx.closePath(); ctx.fill();
  // tiles: engraved rows
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#000000', .45); ctx.lineWidth = .9;
  ctx.beginPath(); for (let y = apex + 8; y < yBase; y += 9) { ctx.moveTo(x0 - 30, y); ctx.lineTo(x1 + 30, y); } ctx.stroke();
  ctx.strokeStyle = rgba('#000000', .3); ctx.beginPath(); for (let y = apex + 8, r = 0; y < yBase; y += 9, r++) for (let x = x0 - 30 + (r % 2) * 9; x < x1 + 30; x += 18) { ctx.moveTo(x, y); ctx.lineTo(x, y + 9); } ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = rgba(EDGE, .6); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...pts[2]); ctx.stroke();
  // the cut edge of the roof (cross-section): a pale engraved line under the eaves
  ctx.strokeStyle = rgba('#c9b98f', .25); ctx.beginPath(); ctx.moveTo(x0 - 20, yBase - 2); ctx.lineTo(x1 + 20, yBase - 2); ctx.stroke();
}
// the ground: dark earth from the house out into the night, engraved grass ticks
export function ground(ctx, t, x0, x1) {
  const y = FLOOR;
  const g = ctx.createLinearGradient(0, y, 0, y + 260); g.addColorStop(0, '#0d0f2a'); g.addColorStop(1, '#05060f');
  ctx.fillStyle = g; ctx.fillRect(x0, y, x1 - x0, 400);
  ctx.strokeStyle = rgba('#7a74b8', .35); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, y + .5); ctx.lineTo(x1, y + .5); ctx.stroke();
  const r = prng(61); ctx.strokeStyle = rgba('#6f6aa8', .22); ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i < 260; i++) { const x = x0 + r() * (x1 - x0), yy = y + 4 + r() * r() * 120, L = 3 + r() * 6, sw = Math.sin(t * .8 + i) * 1.2; ctx.moveTo(x, yy); ctx.lineTo(x + sw + 1, yy - L); } ctx.stroke();
}

// layout of the ordinary house: 3 storeys × 3 rooms
export const OLD = (() => {
  const x0 = 300, x1 = 1140, wt = 16, iw = 10, sh = 200, slabT = 14, floors = [FLOOR, FLOOR - sh, FLOOR - 2 * sh];
  const rw = (x1 - x0 - 2 * wt - 2 * iw) / 3, rooms = [];
  for (let f = 0; f < 3; f++) for (let r = 0; r < 3; r++) { const rx = x0 + wt + r * (rw + iw); rooms.push({ f, r, x: rx, w: rw, y: floors[f] - sh + slabT, h: sh - slabT, floor: floors[f] }); }
  return { x0, x1, wt, sh, slabT, floors, rooms, top: FLOOR - 3 * sh, apex: FLOOR - 3 * sh - 120, arch: { x: x1 - wt, w: wt, top: FLOOR - 128 } };
})();
// the A.I.-native house: one tall hall, the great weave on its back wall
export const NEW = { x0: 420, x1: 1020, wt: 16, top: 460, slabT: 14, apex: 360, inner: { x: 436, y: 474, w: 568, h: FLOOR - 474 }, arch: { x: 1004, w: 16, top: FLOOR - 128 } };

export function oldHouseShell(ctx, t, S) {
  const H0 = OLD;
  roof(ctx, H0.x0, H0.x1, H0.top, H0.apex, t, 3);
  // back walls of the rooms, lit by their knots
  for (const rm of H0.rooms) { const L = S.roomLight(rm); roomWall(ctx, rm.x, rm.y, rm.w, rm.h, L.x, L.y, L.a, rm.f * 3 + rm.r + 1); }
}
export function oldHouseFront(ctx, t, S) {
  const H0 = OLD;
  // slabs (floors, ceilings) and walls as engraved cross-sections, drawn after the rooms' contents so they frame them
  for (let f = 0; f < 3; f++) slab(ctx, H0.x0, H0.floors[f] - H0.sh, H0.x1 - H0.x0, H0.slabT);
  slab(ctx, H0.x0 - 6, FLOOR, H0.x1 - H0.x0 + 12, 12, { fill: '#0b0c22' });
  slab(ctx, H0.x0, H0.top, H0.wt, FLOOR - H0.top); slab(ctx, H0.x1 - H0.wt, H0.top, H0.wt, FLOOR - H0.top);
  for (let f = 0; f < 3; f++) for (let r = 1; r < 3; r++) { const rm = H0.rooms[f * 3 + r]; slab(ctx, rm.x - 10, rm.y, 10, rm.h); }
  arch(ctx, H0.arch.x, H0.arch.w, H0.arch.top, FLOOR);
}
export function newHouseShell(ctx, t) {
  const N = NEW; roof(ctx, N.x0, N.x1, N.top, N.apex, t, 5);
  ctx.fillStyle = '#0b0c22'; ctx.fillRect(N.inner.x, N.inner.y, N.inner.w, N.inner.h);
}
export function newHouseFront(ctx, t) {
  const N = NEW;
  slab(ctx, N.x0, N.top, N.x1 - N.x0, N.slabT); slab(ctx, N.x0 - 6, FLOOR, N.x1 - N.x0 + 12, 12, { fill: '#0b0c22' });
  slab(ctx, N.x0, N.top, N.wt, FLOOR - N.top); slab(ctx, N.x1 - N.wt, N.top, N.wt, FLOOR - N.top);
  arch(ctx, N.arch.x, N.arch.w, N.arch.top, FLOOR);
}

// ---------------------------------------------------------------- the hall (after the push into the weave): back wall + floor
// the back wall is the same dark as the new house's inner wall, so the house can be gone while the weave fills the frame
export function hallWall(ctx, cam) {
  ctx.fillStyle = '#0b0c22'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * .38, 0, W / 2, H * .38, W * .8); g.addColorStop(0, 'rgba(60,48,40,.28)'); g.addColorStop(1, 'rgba(5,6,15,.35)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
export function hallFloor(ctx, t, cam, o = {}) {
  const A = o.a ?? 1, zFar = 0, zNear = camZ(cam) + 60;
  const f0 = P(cam, cam.x, FLOOR, zFar); if (!f0) return;
  const yH = f0[1]; if (yH > H) return;
  // floor fill
  const g = ctx.createLinearGradient(0, yH, 0, H); g.addColorStop(0, '#120f26'); g.addColorStop(1, '#05050e');
  ctx.fillStyle = g; ctx.fillRect(0, yH, W, H - yH);
  // the light pool of the weave on the floor (an ellipse in perspective)
  const pc = P(cam, 720, FLOOR, -260);
  if (pc) { const rx = 1500 * pc[2], ry = 300 * pc[2]; ctx.save(); ctx.translate(pc[0], pc[1]); ctx.scale(1, ry / rx); const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    lg.addColorStop(0, rgba('#8a6a34', .36 * A * (o.pool ?? 1))); lg.addColorStop(.5, rgba('#5a4430', .14 * A * (o.pool ?? 1))); lg.addColorStop(1, 'rgba(20,16,30,0)'); ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore(); }
  // boards: lines running toward the weave (along Z), and joints across
  ctx.save(); ctx.beginPath(); ctx.rect(0, yH, W, H - yH); ctx.clip(); ctx.lineCap = 'round';
  ctx.strokeStyle = rgba('#8b84c4', .13 * A); ctx.lineWidth = 1; ctx.beginPath();
  for (let X = -3000; X <= 4400; X += 110) { const a = P(cam, X, FLOOR, zFar), b = P(cam, X, FLOOR, Math.max(zNear, -6000)); if (!a || !b) continue; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();
  ctx.strokeStyle = rgba('#000000', .45); ctx.beginPath();
  for (let Z = -40; Z > Math.max(zNear, -6000); Z -= 160) { const a = P(cam, -3000, FLOOR, Z), b = P(cam, 4400, FLOOR, Z); if (!a || !b) continue; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();
  // a sheen of the weave light on the near boards (stippled)
  if (pc) { const r = prng(5); ctx.fillStyle = rgba('#f3d9a0', .09 * A * (o.pool ?? 1)); for (let i = 0; i < 700; i++) { const u = (r() - .5) * 2, v = r(); const X = 720 + u * 1700, Z = -60 - v * 1800, p = P(cam, X, FLOOR, Z); if (!p) continue; if (r() > (1 - Math.abs(u)) * (1 - v) * 1.4) continue; ctx.fillRect(p[0], p[1], 1.4, 1.4); } }
  ctx.restore();
  // the edge where floor meets the back wall
  ctx.strokeStyle = rgba('#8b84c4', .25 * A); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, yH); ctx.lineTo(W, yH); ctx.stroke();
}
// two rows of plain pillars along the hall (left and right of the weave), so the hall reads as a room
export function hallPillars(ctx, t, cam, o = {}) {
  const A = o.a ?? 1, list = [];
  for (const X of [-1150, 2590]) for (let Z = 0; Z > -4200; Z -= 700) list.push([X, Z]);
  list.sort((a, b) => b[1] - a[1]);
  for (const [X, Z] of list) {
    const b = P(cam, X, FLOOR, Z), top = P(cam, X, -900, Z); if (!b || !top) continue;
    const w = 90 * b[2]; if (b[0] + w < -10 || b[0] - w > W + 10) continue;
    const side = X < 720 ? 1 : -1;
    ctx.fillStyle = '#0a0b1e'; ctx.fillRect(b[0] - w / 2, top[1], w, b[1] - top[1]);
    hatch(ctx, [[b[0] - w / 2, top[1]], [b[0] + w / 2, top[1]], [b[0] + w / 2, b[1]], [b[0] - w / 2, b[1]]], -.9, Math.max(2.5, 5 * b[2]), .4, { col: '#000000', w: .8, seed: Math.round(Z) });
    // the edge toward the weave catches its light
    ctx.strokeStyle = rgba('#d9b880', .22 * A); ctx.lineWidth = Math.max(1, 1.6 * b[2]); ctx.beginPath(); ctx.moveTo(b[0] + side * w / 2, top[1]); ctx.lineTo(b[0] + side * w / 2, b[1]); ctx.stroke();
  }
}

// ---------------------------------------------------------------- the plaque under the weave
export function plaque(ctx, t, cam, o = {}) {
  const X = 720, Z = -420, Yc = 752, pw = 600, ph = 176;
  const c = P(cam, X, Yc, Z), foot = P(cam, X, FLOOR, Z); if (!c || !foot) return null;
  if (c[2] > 5) return null;   // the camera is (almost) at the plaque: it is far outside the frame; never build a giant hatch
  const s = c[2], w = pw * s, h = ph * s, x = c[0] - w / 2, y = c[1] - h / 2;
  // the post
  ctx.fillStyle = '#0c0b1c'; ctx.fillRect(c[0] - 14 * s, y + h, 28 * s, foot[1] - y - h);
  ctx.strokeStyle = rgba('#d9b880', .25); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(c[0] - 14 * s, y + h); ctx.lineTo(c[0] - 14 * s, foot[1]); ctx.stroke();
  // brass plate with bevel, engraved border, catching the weave's light from above
  const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#a88a50'); g.addColorStop(.5, '#7a6034'); g.addColorStop(1, '#4e3a1e');
  ctx.fillStyle = '#3a2a14'; ctx.fillRect(x - 3 * s, y - 3 * s, w + 6 * s, h + 6 * s);
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  hatch(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], -.3, Math.max(2, 3.2 * s), .12, { col: '#3a2a14', w: .6, seed: 3 });
  ctx.strokeStyle = rgba('#2e200e', .7); ctx.lineWidth = Math.max(1, 2 * s); ctx.strokeRect(x + 10 * s, y + 10 * s, w - 20 * s, h - 20 * s);
  ctx.strokeStyle = rgba('#fff1cc', .45); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + .5); ctx.lineTo(x + w, y + .5); ctx.stroke();
  // a slow glint wandering across the brass
  const gx = x + w * ((t * .12) % 1.6 - .3); const gl = ctx.createLinearGradient(gx - 60 * s, 0, gx + 60 * s, 0); gl.addColorStop(0, 'rgba(255,240,200,0)'); gl.addColorStop(.5, 'rgba(255,240,200,.18)'); gl.addColorStop(1, 'rgba(255,240,200,0)');
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = gl; ctx.fillRect(x, y, w, h); ctx.restore();
  // the engraving: pressed in letter by letter (a mask from the left), dark cut + light lower edge
  const u = clamp(o.u ?? 1);
  if (u > 0) {
    const fs = 56 * s, fs2 = 36 * s;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * u, h); ctx.clip();
    for (const [dy, col] of [[1.4, 'rgba(255,236,190,.55)'], [0, '#2a1c0a']]) {
      text(ctx, '“COMPANY BRAIN”', c[0], c[1] - h * .02 + dy * s, { size: fs, font: 'Inter', weight: 600, color: col, align: 'center', spacing: 5 * s });
    }
    ctx.restore();
    const u2 = clamp(o.u2 ?? u);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * u2, h); ctx.clip();
    for (const [dy, col] of [[1.1, 'rgba(255,236,190,.5)'], [0, '#3a2a12']]) text(ctx, 'SILICON VALLEY', c[0], c[1] + h * .31 + dy * s, { size: fs2, font: 'Inter', weight: 600, color: col, align: 'center', spacing: 7 * s });
    ctx.restore();
  }
  return { x, y, w, h, s };
}

// ---------------------------------------------------------------- a meeting on the floor: people sitting in a circle
// m = { X, Z, n, r, seed }; o = { lit 0..1 (the circle lights), thread 0..1 (its thread rises), to [X,Y,Z] (where the thread goes), t }
const DRESS = ['#2c3450', '#3a3046', '#28384a', '#40364a', '#2a2e44', '#3a3a50'];
export function meetingRing(ctx, t, cam, m, o = {}) {
  const c = P(cam, m.X, FLOOR, m.Z); if (!c || c[2] > 5) return;   // behind / at the camera: outside the frame
  const lit = clamp(o.lit ?? 0), R = m.r ?? 120, thA = o.threadA ?? 1;
  // the ring on the floor (an ellipse in perspective): engraved, then lit
  const e = []; for (let k = 0; k <= 48; k++) { const q = k / 48 * TAU, p = P(cam, m.X + Math.cos(q) * R, FLOOR, m.Z + Math.sin(q) * R); if (p) e.push(p); }
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = rgba('#8b84c4', .25); ctx.lineWidth = Math.max(.8, 1.4 * c[2]); ctx.beginPath(); e.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  // the centre light: a small warm point that the meeting gathers around; lit → it flares gold
  const cr = 120 * c[2] * (1 + 1.4 * lit);
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], cr); g.addColorStop(0, rgba(F8.goldCore, .25 + .6 * lit)); g.addColorStop(.3, rgba(F8.gold, .1 + .25 * lit)); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(1, .55); ctx.translate(-c[0], -c[1]); ctx.fillStyle = g; ctx.fillRect(c[0] - cr, c[1] - cr, cr * 2, cr * 2); ctx.restore();
  if (lit > 0) { ctx.strokeStyle = rgba(F8.gold, .55 * lit); ctx.lineWidth = Math.max(1, 2 * c[2]); ctx.beginPath(); e.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
  // the people: seated, in profile, facing the centre (far ones first)
  const n = m.n ?? 5, seats = [];
  for (let i = 0; i < n; i++) { const q = (i / n) * TAU + (m.seed || 0) * .7 + .3; seats.push({ q, X: m.X + Math.cos(q) * R * .92, Z: m.Z + Math.sin(q) * R * .92, i }); }
  seats.sort((a, b) => b.Z - a.Z);
  for (const st of seats) {
    const p = P(cam, st.X, FLOOR, st.Z); if (!p || p[2] > 5) continue;
    const s = .68 * p[2], hipY = p[1] - 48 * s, flip = Math.cos(st.q) > 0;   // on the right of the circle: face left
    figureFlat(ctx, p[0], hipY, s, POSES.sit, { t, seed: (m.seed || 1) * 10 + st.i, col: '#0e0f26', rim: lit > .05 ? '#f3d9a0' : '#5a5490', shade: 1 - .5 * (o.dark ?? 0), rimSide: flip ? -1 : 1, flip, accent: DRESS[(st.i + (m.seed || 0)) % 6], accentPart: 'sweater', fast: true, shadow: false });
    // the stool (a small dark block)
    ctx.fillStyle = '#08081a'; ctx.fillRect(p[0] - 9 * s, hipY + 4 * s, 18 * s, 44 * s);
  }
  // the thread rising from the centre into the weave (a 3D curve, drawn up to its head)
  const th = clamp(o.thread ?? 0);
  if (th > 0 && o.to) {
    const [tx, ty, tz] = o.to, N = 40, pts = [];
    for (let k = 0; k <= N; k++) {
      const q = k / N * th, X = mix(m.X, tx, sm(clamp((q - .35) / .65))), Y = mix(FLOOR - 10, ty, q < .6 ? q / .6 * .8 : .8 + .2 * (q - .6) / .4), Z = mix(m.Z, tz, sm(clamp((q - .25) / .75)));
      const pp = P(cam, X, Y, Z); if (pp) pts.push(pp);
    }
    if (pts.length > 1) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (const [w, a, col] of [[7, .08, F8.gold], [2.4, .4, F8.gold], [1, .9, F8.goldCore]]) { ctx.strokeStyle = rgba(col, a * thA); ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
      const hd = pts[pts.length - 1]; if (th < 1) { const hg = ctx.createRadialGradient(hd[0], hd[1], 0, hd[0], hd[1], 22); hg.addColorStop(0, rgba(F8.goldCore, .9)); hg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = hg; ctx.fillRect(hd[0] - 22, hd[1] - 22, 44, 44); }
      ctx.restore();
    }
  }
}

// ---------------------------------------------------------------- the name label (lower third, above y 900; mask reveals only)
// o = { x, y (name baseline), name, role, u (0..1 reveal), strike 0..1, nu 0..1 (new line), newRole, source, su 0..1 }
export function nameLabel(ctx, t, o = {}) {
  const x = o.x ?? 120, y = o.y ?? 800, u = clamp(o.u ?? 1); if (u <= 0) return;
  ctx.save(); ctx.font = '46px "Instrument Serif"'; const nw = ctx.measureText(o.name).width; ctx.font = '600 19px "Inter"'; const rw = ctx.measureText(o.role).width + o.role.length * 4.2; ctx.restore();
  const wmax = Math.max(nw, rw) + 30;
  // the engraved rule under the name, drawn by a gold point
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F8.gold, .75); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y + 14); ctx.lineTo(x + wmax * eoutX(u), y + 14); ctx.stroke();
  if (u < 1) { const hx = x + wmax * eoutX(u), g = ctx.createRadialGradient(hx, y + 14, 0, hx, y + 14, 16); g.addColorStop(0, rgba(F8.goldCore, .9)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(hx - 16, y - 2, 32, 32); }
  ctx.restore();
  const tu = clamp((u - .2) / .8);
  // the label is printed on a small dark card (it sits over the lit floor): revealed by the same mask as its text
  { const cw = wmax + 60, ch = 104 + 74 * eoutX(clamp((o.nu ?? 0) * 1.4)); ctx.save(); ctx.beginPath(); ctx.rect(x - 30, y - 62, cw * eoutX(u), ch + 20); ctx.clip();
    ctx.fillStyle = '#080918'; ctx.fillRect(x - 30, y - 62, cw, ch + 20); hatch(ctx, [[x - 30, y - 62], [x - 30 + cw, y - 62], [x - 30 + cw, y - 42 + ch], [x - 30, y - 42 + ch]], -.9, 5, .25, { col: '#000000', w: .7, seed: 9 });
    ctx.strokeStyle = rgba('#8b84c4', .3); ctx.lineWidth = 1; ctx.strokeRect(x - 29.5, y - 61.5, cw - 1, ch + 19); ctx.restore(); }
  ctx.save(); ctx.beginPath(); ctx.rect(x - 6, y - 50, (wmax + 12) * tu, 130); ctx.clip();
  text(ctx, o.name, x, y, { size: 46, font: 'Instrument Serif', color: '#f3ecda' });
  text(ctx, o.role, x, y + 44, { size: 19, weight: 600, color: rgba('#e9dcc0', .9), spacing: 4.2 });
  ctx.restore();
  // strike-through the old role (a fine engraved line drawn from the left)
  const sk = clamp(o.strike ?? 0);
  if (sk > 0) { ctx.save(); ctx.strokeStyle = rgba('#f3d9a0', .95); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 4, y + 37); ctx.lineTo(x - 4 + (rw + 8) * eoutX(sk), y + 37); ctx.stroke(); ctx.restore(); }
  const nu = clamp(o.nu ?? 0);
  if (nu > 0 && o.newRole) {
    ctx.save(); ctx.font = '600 22px "Inter"'; const nw2 = ctx.measureText(o.newRole).width + o.newRole.length * 4.5; ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(x - 6, y + 50, (nw2 + 12) * eoutX(nu), 48); ctx.clip();
    text(ctx, o.newRole, x, y + 82, { size: 22, weight: 600, color: '#f3ecda', spacing: 4.5 }); ctx.restore();
  }
  const su = clamp(o.su ?? 0);
  if (su > 0 && o.source) { ctx.save(); ctx.beginPath(); ctx.rect(x - 6, y + 92, 900 * eoutX(su), 30); ctx.clip(); text(ctx, o.source, x, y + 110, { size: 14, weight: 500, color: rgba('#cfc6e8', .7), spacing: 3 }); ctx.restore(); }
}

// ---------------------------------------------------------------- a handoff plate as an in-world light
// u = 0: the frame IS the plate (identity). u → 1: the light shrinks into the point `at` (screen) and its edge falls off inside the
// plate's own colours, so what remains is the glow of an object (the knot's core, the firefly). o.r1: radius of the opaque core at u=1.
export const plateCentre = (t) => [W / 2 + 18 * drift(t + TSHIFT, 1, 3), H / 2 + 12 * drift(t + TSHIFT, 1, 7)];   // where glowFrom's disc sits at u = a
const PLC = { c: null, g: null };
export function glowFrom(ctx, t, plateFn, u, at, o = {}) {
  u = clamp(u); if (!PLC.c) [PLC.c, PLC.g] = canvas(W, H);
  const c = PLC.c, g = PLC.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
  plateFn(g, t);
  const tt = t + TSHIFT, pcx = W / 2 + 18 * drift(tt, 1, 3), pcy = H / 2 + 12 * drift(tt, 1, 7);
  // phase A (u 0…a): the light's edge contracts inside the plate (no transform) until the whole lit disc sits inside the canvas;
  // phase B (u a…1): the disc shrinks and travels to `at` (the object whose glow it is)
  const a = o.a ?? .38, uA = (o.easeA || sm)(clamp(u / a)), uB = clamp((u - a) / (1 - a));
  if (u > 0) {
    const R1 = mix(1180, o.core ?? 260, uA), R2 = mix(1210, o.edge ?? 520, uA);
    g.globalCompositeOperation = 'destination-in';
    const rg = g.createRadialGradient(pcx, pcy, 0, pcx, pcy, R2); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(R1 / R2, 'rgba(0,0,0,1)');
    rg.addColorStop(R1 / R2 + (1 - R1 / R2) * .4, 'rgba(0,0,0,.4)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
  }
  const eB = .5 - .5 * Math.cos(Math.PI * uB), k = Math.exp(mix(0, Math.log(o.kMin ?? .06), eB)), tx = o.follow ? at[0] : mix(pcx, at[0], eB), ty = o.follow ? at[1] : mix(pcy, at[1], eB);   // follow: the disc stays on its object (which must reach plateCentre by u = a)
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u === 0) ctx.drawImage(c, 0, 0);
  else { ctx.translate(tx, ty); ctx.scale(k, k); ctx.translate(-pcx, -pcy); ctx.drawImage(c, 0, 0); }
  ctx.restore();
  return { k, x: tx, y: ty };
}
