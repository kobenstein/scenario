// Film 25 · builder B2 (c05–c07) · own helpers (not part of the shared kit; wishes are in the B2 report).
//   frames + portals: a lit 16:9 window in the outer world shows an inner scene; the camera flies into it until the window IS the screen
//     (then only the inner scene is drawn: no cut, no blend). Inner scenes are flat layers with their own pan/zoom camera (lay()).
//   custom task glyphs (decide, carry, bolt, roof), a free-falling single stone, the rank row with extras (== S.rankRow without extras).
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f25_kit.mjs';
import * as S from './f25_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, halo, rad, lin } = E;
const TAU = Math.PI * 2;

// ============================================================================================================ FRAMES (inner scenes)
// FR = the screen matrix of the inner frame (1920×1080 inner design → screen). Identity when the inner scene fills the screen.
export const ID = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
let FR = ID;
export function frame(ctx) { ctx.setTransform(FR.a, FR.b, FR.c, FR.d, FR.e, FR.f); }
export function withFrame(m, fn) { const p = FR; FR = m; try { return fn(); } finally { FR = p; } }
// inner camera as a cam3 (so F.camPath / E.camDrift work on it): looks at (x, y), zoom s  ↔  z = F0 − F0 / s
export const IC = (x, y, s = 1) => E.cam3({ x, y, z: E.F0 - E.F0 / s });
export const icS = (c) => E.F0 / (E.F0 - c.z);
// a flat layer at parallax depth d (1 = focus plane, 0 = fixed backdrop, > 1 foreground) of an inner scene
export function lay(ctx, ic, d, fn) {
  const s = icS(ic), z = Math.pow(s, d), px = 960 + (ic.x - 960) * d, py = 540 + (ic.y - 540) * d;
  ctx.save(); frame(ctx); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-px, -py); fn(z); ctx.restore();
}
// inner design point on layer d → screen
export function ipt(ic, d, x, y) {
  const s = icS(ic), z = Math.pow(s, d), px = 960 + (ic.x - 960) * d, py = 540 + (ic.y - 540) * d;
  const X = 960 + (x - px) * z, Y = 540 + (y - py) * z;
  return [FR.a * X + FR.e, FR.d * Y + FR.f, z * FR.a];
}
// screen-space text etc. inside the current frame
export function inScreen(ctx, fn) { ctx.save(); frame(ctx); fn(); ctx.restore(); }

// project a design rect on card Z to a screen rect
export function cardRect(c, Z, r) { const m = E.cardM(c, Z); if (!m) return null; return { x: m.e + r.x * m.k, y: m.f + r.y * m.k, w: r.w * m.k, h: r.h * m.k }; }
// the camera that makes design rect r (16:9) on card Z fill the screen exactly
export const fillCam = (Z, r) => E.aim(Z, r.x + r.w / 2, r.y + r.h / 2, W / r.w);
export const covers = (q) => q && q.x <= .5 && q.y <= .5 && q.x + q.w >= W - .5 && q.y + q.h >= H - .5;
// a lit window: rect (screen) shows inner(ctx) cover-fitted; warm rim + glow. a = rim/glow strength
export function portal(ctx, q, inner, o = {}) {
  if (!q || q.w < 1) return;
  const k = Math.max(q.w / W, q.h / H), m = { a: k, b: 0, c: 0, d: k, e: q.x + q.w / 2 - W / 2 * k, f: q.y + q.h / 2 - H / 2 * k };
  const r = Math.min(o.r ?? 6, q.w / 2, q.h / 2), col = o.cool ? F.COOL : F.WARM;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if ((o.glow ?? 1) > 0 && q.w < W * 1.5) halo(ctx, q.x + q.w / 2, q.y + q.h / 2, Math.max(q.w, q.h) * .9, .22 * (o.glow ?? 1), o.cool ? F.COOL.halo : P.halo1, o.cool ? F.COOL.body : P.halo0);
  ctx.save(); ctx.beginPath(); ctx.roundRect(q.x, q.y, q.w, q.h, r); ctx.clip();
  withFrame(m, () => inner(ctx));
  ctx.restore();
  if (q.w < W * 1.2) { ctx.strokeStyle = rgba(o.cool ? F.COOL.line : col.line, .75 * (o.rim ?? 1)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(q.x, q.y, q.w, q.h, r); ctx.stroke(); }
  ctx.restore();
}
// a window rect that opens out of a source point (glyph): u 0..1; final design rect r; source [x, y] (same card), size s0
export function openRect(r, src, u, s0 = 30) {
  const e = E.sineIO(clamp(u)), w = lerp(s0 * 16 / 9, r.w, e), h = w * 9 / 16;
  const cx = lerp(src[0], r.x + r.w / 2, e), cy = lerp(src[1], r.y + r.h / 2, e);
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

// ============================================================================================================ GLYPHS (custom task glyphs)
const GP = new Map();
function myPath(name) {
  if (GP.has(name)) return GP.get(name);
  let out = new Path2D();
  const U = (p) => { out = out.op(p, PathOp.Union); };
  const L = (pts, w = .075) => { const p = new Path2D(); pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); U(p.stroke({ width: w, cap: 1, join: 1 })); };
  const C = (x, y, r, w = .075) => { const p = new Path2D(); p.arc(x, y, r, 0, TAU); U(p.stroke({ width: w })); };
  switch (name) {
    case 'decide': C(0, 0, .4); L([[-.2, .02], [-.05, .17], [.22, -.16]], .09); break;                       // a check in a circle
    case 'carry': { const p = new Path2D(); p.moveTo(0, -.42); p.lineTo(.34, -.28); p.bezierCurveTo(.34, .1, .2, .3, 0, .42); p.bezierCurveTo(-.2, .3, -.34, .1, -.34, -.28); p.closePath(); U(p.stroke({ width: .075, join: 1 })); L([[0, -.2], [0, .2]], .06); break; }   // a shield
    case 'bolt': { const p = new Path2D(); p.moveTo(.08, -.44); p.lineTo(-.22, .06); p.lineTo(.02, .06); p.lineTo(-.08, .44); p.lineTo(.24, -.08); p.lineTo(0, -.08); p.closePath(); U(p.stroke({ width: .07, join: 1 })); break; }
    case 'roof': L([[-.44, .04], [0, -.32], [.44, .04]], .08); L([[-.3, -.08], [-.3, .38], [.3, .38], [.3, -.08]], .07); L([[.2, -.22], [.2, -.36]], .07); break;
    case 'pipe': L([[-.44, -.1], [.1, -.1], [.1, .4]], .14); L([[-.44, -.24], [-.44, .04]], .06); L([[-.04, .4], [.24, .4]], .06); break;
    default: C(0, 0, .3);
  }
  GP.set(name, out); return out;
}
const CUSTOM = new Set(['decide', 'carry', 'bolt', 'roof', 'pipe']);
export function glyph(ctx, name, x, y, s, o = {}) {
  if (!CUSTOM.has(name)) return F.glyph(ctx, name, x, y, s, o);
  const a = o.a ?? 1; if (a <= 0 || s <= 1) return;
  const lit = clamp(o.lit ?? 0), col = o.col === 'cool' ? F.COOL.body : o.col === 'cream' ? P.cream : mixHex(F.COOL.line, mixHex(P.halo0, P.coat, .7), lit);
  const p = new Path2D(); p.addPath(myPath(name), { a: s, b: 0, c: 0, d: s, e: x, f: y });
  if ((o.glow ?? 1) > 0) halo(ctx, x, y, s * (.9 + .5 * lit), (.12 + .3 * lit) * a * (o.glow ?? 1), lit > .5 ? P.halo0 : P.blue0, lit > .5 ? P.core1 : F.COOL.body);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fill(p, 'evenodd'); ctx.restore();
}

// ============================================================================================================ ONE FALLING STONE
// a single stone toppling left from standing under gravity (the cascade's physics), to `to` radians, with the landing clack
export function fall1(t, t0, h, to = Math.PI / 2 - .015, tau = 1.1) {
  if (t <= t0) return 0;
  const al = (Math.PI / 2) * 2 / (tau * Math.sqrt(h / 690)) ** 2, th = Math.sqrt(2 * to / al);
  let a = Math.min(to, .5 * al * (t - t0) ** 2);
  if (t > t0 + th) a -= .025 * Math.exp(-(t - t0 - th) * 9) * Math.sin((t - t0 - th) * 30);
  return a;
}
// an eased tip (a stone that only leans: "how far that job falls"), with a small settle
export function tip(t, t0, to, d = .9) {
  const u = span(t, t0, t0 + d); if (u <= 0) return 0;
  return to * (u * u * (3 - 2 * u)) - (u >= 1 ? .02 * to * Math.exp(-(t - t0 - d) * 6) * Math.sin((t - t0 - d) * 18) : 0);
}

// ============================================================================================================ RANK ROW + extras
// exactly S.rankRow when o has only { fall }; extras: o.mid(ctx, c, t) after the plain (the ridge), o.each(i) merged stone options
export function rankRowX(ctx, c, t, o = {}) {
  F.sky(ctx, c, t, { glow: S.SKY_GLOW }); F.plain(ctx, c, t);
  if (o.mid) o.mid(ctx, c, t);
  const fall = (n) => (o.fall ? o.fall(n) : S.rankLie(n));
  F.drawRow(ctx, c, t, S.RANKROW, S.RANKROW.stones.map((s) => fall(s.i + 1)), {
    each: (i) => ({ ...(i === 0 ? { gold: o.gold ?? 1, glyph: null, num: 1 } : { num: i + 1, dark: fall(i + 1) > 1 ? .3 : 0 }), ...(o.each ? o.each(i) || {} : {}) }),
  });
}
export const RS = S.RANKROW.stones;
// a point on the face of rank stone i (u across 0..1, v up 0..1) at angle ang, in its card's design coords
export function stonePt(s, ang, u, v) { const x = s.w * u, y = -s.h * v, ca = Math.cos(ang), sa = Math.sin(ang); return [s.x + x * ca + y * sa, s.y - x * sa + y * ca]; }
export const facePt = (i, ang, u, v) => stonePt(RS[i], ang, u, v);
// camera on rank stone i: its face centre at screen (sx, sy), magnified s (k = s on its card)
export const onStone = (i, s, sx = W / 2, sy = H / 2, v = .55) => E.aim(RS[i].Z, RS[i].x + RS[i].w / 2, RS[i].y - RS[i].h * v, s, sx, sy);

// ============================================================================================================ SMALL THINGS
export const blend = (a, b, u) => ({ ...a, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), f: lerp(a.f ?? E.F0, b.f ?? E.F0, u) });
// key-framed 2D point along sine-eased segments: K [[t, [x, y]], …]
export function track(t, K) {
  if (t <= K[0][0]) return K[0][1].slice(); if (t >= K[K.length - 1][0]) return K[K.length - 1][1].slice();
  let i = 0; while (t > K[i + 1][0]) i++;
  const u = E.sineIO((t - K[i][0]) / (K[i + 1][0] - K[i][0]));
  return [lerp(K[i][1][0], K[i + 1][1][0], u), lerp(K[i][1][1], K[i + 1][1][1], u)];
}
// a small label (one or two lines) that rises from its baseline and sinks back: u in, v out (0..1)
export function tag(ctx, s, x, y, u, o = {}) {
  if (u <= 0) return;
  F.maskLine(ctx, [[s, o.warm ?? 0]], x, y, o.size ?? 26, u, { serif: false, weight: 600, col: o.col ?? P.cream, glow: false, align: o.align });
}
export const inOut = (t, a, b, d = .7, d2 = .5) => F.rise(span(t, a, a + d)) * (1 - E.expoIn(span(t, b - d2, b)));
// F.camPath with a reference card R (log-distance to R instead of F0): needed when keys sit beyond F0 (deep rank stones, the ridge)
export function camPathR(t, K, R = E.F0) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(Math.max(1, R - c.z))]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: R - Math.exp(out[2]) });
}
// a living hold for any camera (cam3): slow truck + rise + push/pull, in screen terms on the subject card R (k = 1: ±~70 px, ±8 % zoom).
// Unlike E.camDrift its speed never sinks to ~0 for long (incommensurate sines), so holds never freeze.
export function breathe(c, t, k = .5, R = E.F0, s = 0, push = 0) {
  if (k <= 0) return c;
  const d = Math.max(50, R - c.z), u = d / E.F0 * 1.15; t *= 1.7;   // (speed: grain-free frame pairs must still differ, static share < 5 %)
  return { ...c, x: c.x + k * u * (60 * Math.sin(t * .43 + s) + 30 * Math.sin(t * .97 + 1.3 * s)),
    y: c.y + k * u * (26 * Math.sin(t * .37 + 2 * s) + 12 * Math.sin(t * 1.1 + s)),
    z: c.z + k * d * (push + 1.15 * (.08 * Math.sin(t * .47 + 3 * s) + .03 * Math.sin(t * 1.07 + s))) };
}
