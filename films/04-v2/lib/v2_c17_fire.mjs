// c17 · the ancient fire (17.01): the c16>c17 light plate is the fire's own light seen from inside the flames; the camera pulls back
// and the light keeps its shape as the flames (an opaque, flame-shaped light, never a veil), then hands over to the drawn flames.
// Around the fire four people sit wrapped in blankets (profile, seated on the ground, knees up), two near (edge-lit), two across (lit).
//   fireBack(ctx, t, C, o)   ground light pool, shadows, the far people, ring, logs, flames, sparks, smoke   (behind the light)
//   fireHalo(ctx, t, C, o)   the fire's light: at the camera's start distance it IS the plate (same gradient, same stipple);
//                            it shrinks with the distance into the flame silhouette, then gives way to the flames (by ~2.6 m)
//   fireFront(ctx, t, C, o)  the near people (in front of the light)
//   FIRE (world position), fireScreen(C) (the heart on screen), PEOPLE, sitter(…) (a seated person wrapped in a blanket)
import { W, H, rgba, clamp, mix, prng, drift } from '../engine.mjs';
import { hatch as engHatch } from '../engine.mjs';
import { smooth01, sio, u01, hash, mixHex, shadeHex, groundAffine } from './v2_c17_kit.mjs';

const TAU = Math.PI * 2;
export const FIRE = { x: 0, z: 0, heart: .35 };
export const fireScreen = (C) => C.P(FIRE.x, FIRE.heart, FIRE.z);
export const fireBr = (t) => 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);   // the plate's own breathing

// ---------------------------------------------------------------- a smooth closed/open path through points (Catmull-Rom → Bézier)
export function spline(ctx, P, closed = true, move = true) {
  const n = P.length, g = (i) => P[closed ? (i + n) % n : clamp(i, 0, n - 1)];
  if (move) ctx.moveTo(P[0][0], P[0][1]);
  const m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]); }
  if (closed) ctx.closePath();
}

// ---------------------------------------------------------------- flames: tongues around wavy centrelines (waves travel upward)
const TONGUES = (() => { const r = prng(511), a = []; for (let i = 0; i < 9; i++) { const u = i / 8 - .5; a.push({ x: u * .44 + (r() - .5) * .05, h: .5 + r() * .3 - Math.abs(u) * .42, w: .085 + r() * .05, p: r() * 10, q: r() * 10, f: 1.0 + r() * .6 }); } return a; })();
const nz = (x) => Math.sin(x) * .5 + Math.sin(x * 2.31 + 1.3) * .3 + Math.sin(x * 5.17 + 2.1) * .2;
function tonguePts(T, t, sh, sw, hi = 1, wi = 1) {   // metres, origin at the fire base centre, y up; hi/wi inflate (the light seen from inside)
  const h = T.h * sh * (1 + .14 * nz(t * 2.3 + T.p) + .05 * Math.sin(t * 6.1 + T.q)) * hi, w = T.w * sw * wi, n = 9, L = [], R = [], sx = 1 + .5 * (wi - 1);
  for (let j = 0; j <= n; j++) {
    const v = j / n, y = h * v, xi = T.x * sx + (.05 + .03 * nz(T.q + t * .7)) * Math.sqrt(wi) * v * Math.sin(TAU * (v * .75 - t * T.f) + T.p) + .05 * v * v;
    const hw = w * Math.pow(1 - v, .7) * (1 + .18 * Math.sin(TAU * (v * 1.3 - t * T.f * 1.1) + T.q)) * (v < .12 ? .75 + 2.1 * v : 1);
    L.push([xi - hw, y]); R.push([xi + hw, y]);
  }
  return [...L, ...R.reverse()];
}
function pathM(ctx, pts, bx, by, k) { spline(ctx, pts.map(([x, y]) => [bx + x * k, by - y * k])); }
export function flames(ctx, t, bx, by, k) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const eg = ctx.createRadialGradient(bx, by, 0, bx, by, .38 * k); eg.addColorStop(0, rgba('#ffcf8a', .8)); eg.addColorStop(.45, rgba('#ff7a2e', .5)); eg.addColorStop(1, rgba('#7a2010', 0));
  ctx.fillStyle = eg; ctx.save(); ctx.translate(bx, by); ctx.scale(1, .3); ctx.beginPath(); ctx.arc(0, 0, .38 * k, 0, TAU); ctx.fill(); ctx.restore();
  for (const [sh, sw, c0, c1, a, dt] of [[1.0, 1.0, '#ff7a2e', '#b8361e', .55, 0], [.76, .74, '#ffb35c', '#ff7a2e', .6, .11], [.46, .5, '#fff6e2', '#ffd9a0', .82, .23]]) {
    for (const T of TONGUES) {
      const pts = tonguePts(T, t + dt, sh, sw), top = Math.max(...pts.map((p) => p[1]));
      ctx.beginPath(); pathM(ctx, pts, bx, by, k);
      const g = ctx.createLinearGradient(0, by, 0, by - top * k); g.addColorStop(0, rgba(c0, a)); g.addColorStop(.55, rgba(c1, a * .75)); g.addColorStop(1, rgba(c1, 0));
      ctx.fillStyle = g; ctx.fill();
    }
  }
  const hg = ctx.createRadialGradient(bx, by - .1 * k, 0, bx, by - .1 * k, .2 * k); hg.addColorStop(0, rgba('#fffaf0', .9)); hg.addColorStop(1, rgba('#ffd9a0', 0));
  ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(bx, by - .1 * k, .2 * k, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- the light: plate gradient + plate stipple inside the (inflated) flame silhouette
const LC = ['#fff1d6', '#ffb35c', '#c4512e'];
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();
// inf ≥ 1: fat, tall tongues (the camera inside the light); m 0→1: from the outer flame silhouette down to the white core layer
function blobPath(ctx, t, bx, by, k, inf, m) {
  const sh = mix(1, .46, Math.pow(m, 1.5)), sw = mix(1, .46, Math.sqrt(m)), hi = 1 + .7 * (inf - 1), wi = 1 + 1.8 * (inf - 1);
  ctx.beginPath();
  for (const T of TONGUES) pathM(ctx, tonguePts(T, t + .23 * m, sh, sw, hi, wi), bx, by, k);
  const rx = .25 * sw * wi * k, ry = .09 * sw * hi * k; ctx.moveTo(bx + rx, by - .07 * k); ctx.ellipse(bx, by - .07 * k, rx, ry, 0, 0, TAU);
}
// sc = colour scale (1 = the plate), (cx, cy) its centre; drawn inside the current clip
function plateFill(ctx, t, cx, cy, sc, a, grow = 1) {
  const br = fireBr(t), R = 1150 * br * sc * grow, g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  g.addColorStop(0, LC[0]); g.addColorStop(.42, LC[1]); g.addColorStop(1, LC[2]);
  ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const pcx = W / 2 + 18 * drift(t, 1, 3), pcy = H / 2 + 12 * drift(t, 1, 7), r = prng(31 + Math.floor(t * 12)), keep = sc * sc;
  ctx.fillStyle = rgba(LC[2], .32);
  for (let i = 0; i < DOTS.length; i++) {
    const [u, v, kk] = DOTS[i], x = u * W, y = v * H, d = Math.hypot(x - pcx, y - pcy) / 1100; if (d < .35) continue;
    if (kk > (d - .35) * 1.4) continue;
    const s = .8 + r() * 1.1, ox = (r() - .5) * 2, oy = (r() - .5) * 2;
    if (keep < 1 && hash(i * .37 + 1.3) > keep) continue;
    ctx.fillRect(cx + (x - pcx) * sc + ox, cy + (y - pcy) * sc + oy, s, s);
  }
  ctx.globalAlpha = 1;
}
export function fireHalo(ctx, t, C, o) {
  const L = fireScreen(C), B = C.P(FIRE.x, 0, FIRE.z); if (!L || !B) return;
  const d = Math.hypot(C.x - FIRE.x, C.y - FIRE.heart, C.z - FIRE.z), sc = Math.min(1, .45 / d), k = B[2];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the glow in the air around the fire (adds light, hides nothing)
  const br = fireBr(t), gr = 1.25 * k * br;
  if (L[0] + gr > 0 && L[0] - gr < W && L[1] + gr > 0 && L[1] - gr < H) {
    ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(L[0], L[1], 0, L[0], L[1], gr);
    g.addColorStop(0, rgba('#ffb35c', .26)); g.addColorStop(.35, rgba('#ff8a3a', .1)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(L[0], L[1], gr, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  // the light itself, opaque inside the flame silhouette: inflated while the camera is in it, then it condenses into the white core
  // of the drawn flames (same tongues, same phase) and only there, white on white, lets go (never a veil over the scene)
  const a = 1 - smooth01(2.45, 2.75, d);
  if (a > 0) {
    const inf = 1 + 1.35 * (1 - smooth01(.45, 1.5, d)), m = smooth01(1.5, 2.6, d), e = sio(u01(t, o.hb, o.hb + 1.5));
    const Hc = C.P(FIRE.x, mix(FIRE.heart, .14, m), FIRE.z) || L;
    const cx = Hc[0] + 18 * drift(t, 1, 3) * (1 - e), cy = Hc[1] + 12 * drift(t, 1, 7) * (1 - e);
    ctx.save(); blobPath(ctx, t, B[0], B[1], k, inf, m); ctx.clip('nonzero'); plateFill(ctx, t, cx, cy, sc, a, 1 + 2.2 * m); ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- people: seated on the ground, knees up, wrapped in a blanket (profile, facing +x)
// metres; origin = the seat on the ground under the hips. hood: the blanket over the head; else hair and the blanket on the shoulders.
const HOOD = [[-.24, 0], [-.28, .16], [-.26, .4], [-.19, .64], [-.11, .84], [-.05, 1.0], [.05, 1.11], [.16, 1.13], [.245, 1.07]];
const HEAD = [[-.24, 0], [-.28, .16], [-.26, .4], [-.19, .64], [-.11, .82], [-.03, .88], [-.0, .99], [.05, 1.08], [.15, 1.11], [.235, 1.07]];
const FACE = [[.255, 1.045], [.272, 1.018], [.297, .988], [.278, .975], [.283, .96], [.268, .932], [.238, .914]];
const FRONT = [[.27, .86], [.36, .74], [.47, .61], [.535, .52], [.545, .34], [.51, .15], [.6, .07], [.65, .03], [.64, 0], [.3, -.01]];
export const PEOPLE = [
  { x: -1.48, z: -.45, f: 1, cloth: '#3a2a26', seed: 1, hood: true, lit: .2, skin: '#8a5a3c' },
  { x: 1.52, z: -.3, f: -1, cloth: '#2c2a38', seed: 2, hood: false, hair: '#1a1210', lit: .22, skin: '#6a4430' },
  { x: -.95, z: 1.15, f: 1, cloth: '#6a4632', seed: 3, hood: true, stick: true, lit: .95, skin: '#c98b5e' },
  { x: .98, z: 1.25, f: -1, cloth: '#4a5468', seed: 4, hood: false, hair: '#2a1a14', lit: .9, skin: '#a8714a' },
];
const lifeP = (t, sd) => ({ b: Math.sin(t * TAU / (4.1 + sd * .37) + sd * 2.1), nod: Math.sin(t * .37 + sd * 1.7) * .6 + Math.sin(t * .19 + sd) * .4 });
export function sitter(ctx, t, P, X, Y, k, L, extra = {}) {
  const f = P.f, lf = lifeP(t, P.seed), b = lf.b, nod = lf.nod * .05 + (extra.nod || 0);
  // the pose: the upper body breathes (scaled about the hips), the head nods about the neck
  const up = (p) => (p[1] > .3 ? [p[0], .3 + (p[1] - .3) * (1 + .009 * b)] : p);
  const hd = (p) => { const [x, y] = up(p), cx = .1, cy = .9, c = Math.cos(nod), s = Math.sin(nod); return y > .86 ? [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c] : [x, y]; };
  const top = (P.hood ? HOOD : HEAD).map(hd), face = FACE.map(hd), front = FRONT.map(up);
  const S = (p) => [X + p[0] * k * f, Y - p[1] * k];
  const outline = [...top, ...face, ...front].map(S);
  const lx = L[0] - X, ly = L[1] - (Y - .55 * k), ln = Math.hypot(lx, ly) || 1, ux = lx / ln, uy = ly / ln, lit = P.lit;
  const path = () => { ctx.beginPath(); spline(ctx, outline); };
  ctx.save();
  // rim toward the fire
  const rw = Math.max(1.4, k * .016);
  ctx.save(); ctx.translate(ux * rw, uy * rw); path(); ctx.fillStyle = rgba('#ffb066', .95); ctx.fill(); ctx.restore();
  // body
  path(); ctx.fillStyle = mixHex('#0b090f', P.cloth, .22 + .6 * lit); ctx.fill();
  ctx.save(); path(); ctx.clip();
  const c0x = X + ux * .55 * k, c0y = Y - .55 * k + uy * .55 * k, c1x = X - ux * .4 * k, c1y = Y - .55 * k - uy * .4 * k;
  const g = ctx.createLinearGradient(c0x, c0y, c1x, c1y);
  g.addColorStop(0, rgba('#ffa860', .25 + .45 * lit)); g.addColorStop(.38, rgba('#c86a32', .06 + .14 * lit)); g.addColorStop(.62, rgba('#000000', 0)); g.addColorStop(1, rgba('#020104', .55 - .25 * lit));
  ctx.fillStyle = g; ctx.fillRect(X - .8 * k, Y - 1.3 * k, 1.6 * k, 1.4 * k);
  // folds of the blanket (engraved lines), the hood's inner edge
  ctx.strokeStyle = rgba('#05030a', .5); ctx.lineWidth = Math.max(.8, k * .006); ctx.lineCap = 'round'; ctx.beginPath();
  for (const q of [[[.2, .84], [.12, .6], [.02, .3], [-.02, .05]], [[.08, .9], [-.04, .62], [-.12, .32], [-.15, .06]], [[.33, .74], [.3, .5], [.38, .32], [.46, .2]], [[-.1, .78], [-.2, .5], [-.22, .2]]]) spline(ctx, q.map(up).map(S), false);
  ctx.stroke();
  if (k > 70) engHatch(ctx, null, f > 0 ? -1.05 : 1.05, Math.max(3, k * .016), .26, { box: [X - .45 * k, Y - 1.2 * k, .9 * k, 1.25 * k], col: '#000000', w: Math.max(.6, k * .0028), fade: [c1x, c1y, c0x, c0y], seed: P.seed });
  ctx.restore();
  // the face (profile, toward the fire): skin lit from the front and below, the shadow under the brow, the hood's inner shade
  const fpts = [...face, [.205, .955], [.2, 1.02], [.235, 1.06]].map(S);
  ctx.beginPath(); spline(ctx, fpts);
  const gf = ctx.createLinearGradient(S([.29, 1])[0], 0, S([.19, 1])[0], 0); gf.addColorStop(0, mixHex(P.skin, '#ffc68a', .25 + .3 * lit)); gf.addColorStop(1, shadeHex(P.skin, -.55));
  ctx.fillStyle = gf; ctx.globalAlpha = .35 + .65 * Math.max(lit, .25); ctx.fill(); ctx.globalAlpha = 1;
  if (!P.hood && P.hair) { ctx.beginPath(); spline(ctx, [[.235, 1.075], [.15, 1.11], [.05, 1.08], [-.0, .99], [-.02, .9], [.08, .93], [.17, 1.0], [.22, 1.05]].map(hd).map(S)); ctx.fillStyle = P.hair; ctx.fill(); }
  if (k > 160) { const e = S(hd([.258, 1.012])); ctx.fillStyle = rgba('#140a08', .8); ctx.beginPath(); ctx.ellipse(e[0], e[1], k * .007, k * .004, 0, 0, TAU); ctx.fill(); }
  // feet peeking out under the blanket
  ctx.fillStyle = mixHex('#120c0c', '#6a4028', .25 + .5 * lit); ctx.beginPath(); spline(ctx, [[.53, .07], [.6, .055], [.64, .025], [.63, 0], [.52, 0]].map(S)); ctx.fill();
  ctx.restore();
  return { hand: S(up([.47, .56])), head: S(hd([.15, 1.0])) };
}

// ---------------------------------------------------------------- logs, stones, sparks, smoke
const STONES = (() => { const r = prng(77), s = []; for (let i = 0; i < 13; i++) { const a = i / 13 * TAU + (r() - .5) * .25; s.push({ a, r: .54 + (r() - .5) * .06, w: .13 + r() * .07, h: .08 + r() * .05, sh: r() }); } return s; })();
const LOGS = [[-.36, -.1, .14, .26, .055], [.34, -.14, -.1, .28, .05], [-.3, .25, .2, -.02, .05], [.05, -.32, .02, .26, .045]];
function stone(ctx, C, S, lit) {
  const X = FIRE.x + Math.cos(S.a) * S.r, Z = FIRE.z + Math.sin(S.a) * S.r, p = C.P(X, S.h * .45, Z); if (!p) return;
  const [x, y, k] = p, w = S.w * k, h = S.h * k;
  ctx.fillStyle = mixHex('#17131c', '#2a2430', S.sh); ctx.beginPath(); ctx.ellipse(x, y, w * .6, h * .62, (S.sh - .5) * .3, 0, TAU); ctx.fill();
  const g = ctx.createLinearGradient(x, y - h * .6, x, y + h * .6); g.addColorStop(0, rgba('#ffb35c', .55 * lit)); g.addColorStop(.5, rgba('#c4512e', .12 * lit)); g.addColorStop(1, rgba('#000000', .35));
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, w * .6, h * .62, (S.sh - .5) * .3, 0, TAU); ctx.fill();
}
function logs(ctx, t, C) {
  for (const [x0, z0, x1, z1, rad] of LOGS) {
    const a = C.P(FIRE.x + x0, .05, FIRE.z + z0), b = C.P(FIRE.x + x1, .2, FIRE.z + z1); if (!a || !b) continue;
    const kk = (a[2] + b[2]) / 2, wv = rad * kk, ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(ang);
    ctx.fillStyle = '#160f0c'; ctx.beginPath(); ctx.roundRect(0, -wv, L, wv * 2, wv); ctx.fill();
    const g = ctx.createLinearGradient(0, -wv, 0, wv); g.addColorStop(0, rgba('#ff8a3a', .5)); g.addColorStop(.45, rgba('#7a2a12', .25)); g.addColorStop(1, rgba('#000000', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(0, -wv, L, wv * 2, wv); ctx.fill();
    ctx.strokeStyle = rgba('#ffb35c', .5 + .25 * Math.sin(t * 2.3 + x0 * 9)); ctx.lineWidth = Math.max(.6, wv * .14); ctx.beginPath();
    for (let i = 1; i < 6; i++) { const xx = L * i / 6; ctx.moveTo(xx, -wv * .7); ctx.lineTo(xx + wv * .4, -wv * .15); }
    ctx.stroke(); ctx.restore();
  }
}
export const pokeAt = (t, t0) => { const u = ((t - t0) % 7.4 + 7.4) % 7.4; let v = 0; for (const p of [1.9, 5.3]) { const q = (u - p) / .6; if (q > 0 && q < 1) v = Math.sin(Math.PI * q) ** 2; } return v; };
const SPARK = (n) => { const r = prng(9001 + n * 7); return { life: .9 + r() * 1.5, vy: 1.1 + r() * 1.2, vx: (r() - .5) * .6, vz: (r() - .5) * .4, x: (r() - .5) * .3, z: (r() - .5) * .25, w: r() * 10, hot: r() }; };
const sparkPos = (S, a) => [S.x + S.vx * a + .16 * a * a + .1 * Math.sin(a * 3.7 + S.w) * a, .25 + S.vy * a - .3 * a * a, S.z + S.vz * a + .07 * Math.sin(a * 2.3 + S.w * 1.7) * a];
export function sparks(ctx, t, C, tb) {
  const dt = .04, n1 = Math.floor(t / dt);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let n = n1 - 70; n <= n1; n++) {
    const S = SPARK(n), born = n * dt, a = t - born; if (a < 0 || a > S.life) continue;
    if (hash(n * .113) > .3 + .7 * pokeAt(born - .08, tb)) continue;   // a few sparks always, a burst right after the stick pokes
    const p0 = sparkPos(S, a), p1 = sparkPos(S, Math.max(0, a - .03));
    const p = C.P(FIRE.x + p0[0], p0[1], FIRE.z + p0[2]), q = C.P(FIRE.x + p1[0], p1[1], FIRE.z + p1[2]); if (!p || !q) continue;
    const heat = 1 - a / S.life, col = heat > .65 ? '#ffe7b0' : heat > .3 ? '#ffb35c' : '#e0602a', al = Math.min(1, heat * 1.8) * (.55 + .45 * S.hot), lw = clamp(p[2] * .006, .9, 3) * (.65 + .35 * heat);
    ctx.strokeStyle = rgba(col, al); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0] + .01, p[1]); ctx.stroke();
  }
  ctx.restore();
}
export function smoke(ctx, t, C) {
  ctx.save();
  for (let j = 0; j < 9; j++) {
    const u = ((t * .16 + j / 9) % 1), y = .9 + u * 4.2, x = FIRE.x + .5 * u * u + .25 * Math.sin(u * 4 + j), z = FIRE.z + .2 * Math.sin(u * 3 + j * 2), p = C.P(x, y, z); if (!p) continue;
    const rr = (.25 + u * 1.1) * p[2], al = Math.sin(Math.PI * u) * .07, g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], rr), col = mixHex('#8a5a40', '#3a3a5a', clamp(u * 1.6));
    g.addColorStop(0, rgba(col, al)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the fire scene parts
function drawPerson(ctx, t, C, P, L, o) {
  const p = C.P(P.x, 0, P.z); if (!p) return;
  const [x, y, k] = p; if (x < -k * .8 || x > W + k * .8 || y - k * 1.2 > H) return;
  const v = P.stick ? pokeAt(t, o.tb) : 0;
  if (P.stick) {   // the stick: from the hands at the knees into the embers (pokes, the sparks answer)
    const hand = [x + .46 * k * P.f, y - .56 * k], tip = C.P(FIRE.x - .1 + .1 * v, .1 - .03 * v, FIRE.z + .1);
    if (tip) { ctx.strokeStyle = '#24160e'; ctx.lineWidth = Math.max(1, k * .022); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hand[0] + v * .04 * k, hand[1] + v * .02 * k); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
      ctx.strokeStyle = rgba('#ffb35c', .45); ctx.lineWidth = Math.max(.6, k * .008); ctx.beginPath(); ctx.moveTo(mix(hand[0], tip[0], .5), mix(hand[1], tip[1], .5) - 1); ctx.lineTo(tip[0], tip[1] - 1); ctx.stroke(); }
  }
  sitter(ctx, t, P, x, y, k, L, { nod: P.stick ? .05 * v : 0 });
  if (P.stick) {   // the blanket's opening where the hands hold the stick (the hands stay inside)
    const hd = [x + .47 * k * P.f, y - .56 * k]; ctx.strokeStyle = rgba('#05030a', .6); ctx.lineWidth = Math.max(.8, k * .008); ctx.beginPath();
    ctx.moveTo(hd[0] - .07 * k * P.f, hd[1] - .09 * k); ctx.quadraticCurveTo(hd[0] - .02 * k * P.f, hd[1], hd[0] - .06 * k * P.f, hd[1] + .1 * k); ctx.stroke();
  }
}
function shadow(ctx, C, P) {   // thrown away from the fire on the ground: a soft tapered ellipse, projected point by point
  const d = Math.hypot(P.x, P.z), ux = P.x / d, uz = P.z / d, zmin = C.z + .3, pts = [];
  for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, along = .9 + 1.15 * Math.cos(a), across = .36 * Math.sin(a) * (1 - .25 * Math.cos(a));
    const X = FIRE.x + ux * (d + along) - uz * across, Z = Math.max(zmin, FIRE.z + uz * (d + along) + ux * across), p = C.P(X, 0, Z); if (!p) return; pts.push(p); }
  const p0 = C.P(P.x, 0, Math.max(zmin, P.z)), p1 = C.P(FIRE.x + ux * (d + 2.1), 0, Math.max(zmin, FIRE.z + uz * (d + 2.1))); if (!p0 || !p1) return;
  const g = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]); g.addColorStop(0, rgba('#06040a', .5)); g.addColorStop(1, rgba('#06040a', 0));
  ctx.fillStyle = g; ctx.beginPath(); spline(ctx, pts.map((p) => [p[0], p[1]])); ctx.fill();
}
export function fireBack(ctx, t, C, o) {
  const base = C.P(FIRE.x, 0, FIRE.z), L = fireScreen(C); if (!base || !L) return;
  const A = groundAffine(C, FIRE.x, FIRE.z), br = fireBr(t);
  if (A) {
    ctx.save(); ctx.setTransform(...A); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 5.5 * br); g.addColorStop(0, rgba('#ffb35c', .5)); g.addColorStop(.12, rgba('#ff9a4a', .3)); g.addColorStop(.4, rgba('#c4512e', .1)); g.addColorStop(1, rgba('#c4512e', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 5.5 * br, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }
  for (const P of PEOPLE) shadow(ctx, C, P);
  for (const P of PEOPLE.filter((p) => p.z > 0).sort((a, b) => b.z - a.z)) drawPerson(ctx, t, C, P, L, o);
  for (const s of STONES.filter((s) => Math.sin(s.a) > 0)) stone(ctx, C, s, 1);
  logs(ctx, t, C);
  flames(ctx, t, base[0], base[1], base[2]);
  for (const s of STONES.filter((s) => Math.sin(s.a) <= 0)) stone(ctx, C, s, .6);
  smoke(ctx, t, C);
  sparks(ctx, t, C, o.tb);
}
export function fireFront(ctx, t, C, o) {
  const L = fireScreen(C); if (!L) return;
  for (const P of PEOPLE.filter((p) => p.z <= 0).sort((a, b) => b.z - a.z)) drawPerson(ctx, t, C, P, L, o);
}
