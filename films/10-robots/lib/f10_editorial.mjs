// Film 10 · "Editorial-Nacht" style kit (stil/STIL-editorial-nacht.md). Lean on purpose: flat shapes, one light form, grain.
//   Palette P (exactly the measured hex values from the style doc), easing + prng, camera layers (flat parallax planes),
//   night sky + stars, big soft glow (halo, glowFill), dust (stipple around the light), light hand, light trail,
//   the figure du() (the viewer: yellow raincoat, faceless, joints), robot() (plain silhouette, no face), finish() (vignette + grain),
//   the 2.5D stage (cam3, card, camAt, aim, project, camDrift, lightFlood), lightForm, ground, castShadow, lightPool, glowText,
//   and the explainers in light (counter, bars, curve, pie, section, lightMap). Guide: film-roboter/bild/EDITORIAL-KIT.md
// Rules: no pattern / canvas is created per frame (the napi canvas leaks). The grain is computed ONCE (prepareEditorial) and
// applied as a pixel pass; everything else is paths + gradients drawn straight into the frame.
import { Path2D, PathOp } from '@napi-rs/canvas';

export const W = 1920, H = 1080;

// ---------- palette (style doc, measured on the film-11 thumbnails) ----------
export const P = {
  night0: '#080b27', night1: '#0a1334', night2: '#0e112c',
  ind0: '#0a184a', ind1: '#0c1f5c', ind2: '#151f4b',
  blue0: '#193f8c', blue1: '#33497a', blue2: '#394773',
  core0: '#fefde2', core1: '#fef4bf',
  halo0: '#ead295', halo1: '#dec688', halo2: '#e7d19a',
  shade0: '#9e7d54', shade1: '#a28f7b',
  coat: '#f2b632', cream: '#fefcde',
};

// ---------- math ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, x) => a + (b - a) * x;
export const span = (t, a, b) => clamp((t - a) / (b - a));
export const smooth = (x) => x * x * (3 - 2 * x);
export const sineIO = (x) => -(Math.cos(Math.PI * clamp(x)) - 1) / 2;
export const quartIO = (x) => (x = clamp(x), x < .5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2);
export const expoOut = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - 2 ** (-10 * x));
export const expoIn = (x) => (x = clamp(x), x <= 0 ? 0 : 2 ** (10 * x - 10));
export const drift = (t, a = 1, ph = 0) => a * (Math.sin(t * .37 + ph) * .6 + Math.sin(t * .91 + ph * 1.7) * .3 + Math.sin(t * 1.73 + ph * 2.3) * .1);
export function prng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const gauss = (r) => { let u = 0; for (let i = 0; i < 4; i++) u += r(); return (u - 2) * 1.73; };

// ---------- colour ----------
const rgbOf = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const rgba = (h, a = 1) => { const [r, g, b] = rgbOf(h); return `rgba(${r},${g},${b},${clamp(a)})`; };
export const mixHex = (a, b, x) => { const A = rgbOf(a), B = rgbOf(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(x))).toString(16).padStart(2, '0')).join(''); };
export function lin(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); for (const [o, c] of stops) g.addColorStop(o, c); return g; }
export function rad(ctx, x, y, r, stops, r0 = 0) { const g = ctx.createRadialGradient(x, y, r0, x, y, Math.max(r, r0 + 1e-3)); for (const [o, c] of stops) g.addColorStop(o, c); return g; }

// ---------- camera: flat parallax planes ----------
// C = { z, px, py, fx, fy }: world point (px,py) of the focus plane sits at screen (fx,fy), zoom z.
// A plane at depth d (0 = infinitely far, 1 = focus plane, >1 = foreground) zooms by z^d and pans by (F-P)*d.
export const cam = (z = 1, px = W / 2, py = H / 2, fx = px, fy = py) => ({ z, px, py, fx, fy });
export function plane(ctx, C, d, fn) {
  const z = Math.pow(C.z, d), ox = C.px * (1 - z) + (C.fx - C.px) * d, oy = C.py * (1 - z) + (C.fy - C.py) * d;
  ctx.save(); ctx.setTransform(z, 0, 0, z, ox, oy); fn(z); ctx.restore();
}
// screen position of a world point on plane d (for screen-space effects such as the light flood)
export function toScreen(C, d, x, y) { const z = Math.pow(C.z, d); return [x * z + C.px * (1 - z) + (C.fx - C.px) * d, y * z + C.py * (1 - z) + (C.fy - C.py) * d, z]; }

// ---------- night ----------
export function nightSky(ctx, stops = [[0, P.night0], [.55, P.night1], [1, P.ind0]], y0 = 0, y1 = H) {
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, stops); ctx.fillRect(-W, -H, W * 3, H * 3);
}
const STARS = new Map();
export function stars(ctx, seed, n, t, box = [0, 0, W, H * .7], a = 1) {
  const key = seed + ':' + n;
  if (!STARS.has(key)) { const r = prng(seed), s = []; for (let i = 0; i < n; i++) { const big = r() < .06; s.push([r(), r(), big ? 2 + r() * 1.1 : .9 + r() * .8, r() * 6.3, .4 + r() * 1.2]); } STARS.set(key, s); }
  const [x0, y0, bw, bh] = box;
  ctx.save(); ctx.fillStyle = P.cream;
  for (const [u, v, s, ph, f] of STARS.get(key)) {
    ctx.globalAlpha = a * (.6 + .4 * Math.sin(t * f + ph)) * (s > 1.5 ? 1 : .85);
    ctx.beginPath(); ctx.arc(x0 + u * bw, y0 + v * bh, s, 0, 6.29); ctx.fill();
  }
  ctx.restore();
}

// ---------- light ----------
// big soft radial glow, added (the light form's halo)
export function halo(ctx, x, y, r, a = 1, col = P.halo0, core = P.core0) {
  if (r <= 0 || a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, x, y, r, [[0, rgba(core, a)], [.1, rgba(col, .5 * a)], [.35, rgba(col, .12 * a)], [1, rgba(col, 0)]]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill(); ctx.restore();
}
// blurred copy of a shape, added (glow that follows the silhouette of the light form)
export function glowFill(ctx, path, blur, a, col = P.halo0) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${blur}px)`; ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fill(path); ctx.restore();
}
// stipple dust: seeded gaussian specks around a light form (the "gold dust" of the thumbnails)
const DUST = new Map();
export function dust(ctx, seed, n, cx, cy, rx, ry, t, a = 1, col = P.halo2, rot = 0) {
  const key = seed + ':' + n;
  if (!DUST.has(key)) { const r = prng(seed), s = []; for (let i = 0; i < n; i++) s.push([gauss(r), gauss(r), r() < .8 ? 1.4 + r() * .9 : 2.2 + r() * 1.3, r() * 6.3, .3 + r()]); DUST.set(key, s); }
  const c = Math.cos(rot), s = Math.sin(rot), m = ctx.getTransform(), zs = Math.pow(Math.hypot(m.a, m.b), .8);   // specks stay specks when the camera flies in
  ctx.save(); ctx.fillStyle = col;
  for (const [u, v, sz, ph, f] of DUST.get(key)) {
    const k = Math.min(1, 1.8 * Math.exp(-(u * u + v * v) / 1.7)); if (k < .03) continue;
    const du = u * rx + Math.sin(t * f * .4 + ph) * 3, dv = v * ry + Math.cos(t * f * .3 + ph) * 3 - t * f * 2 % 40 * 0;
    ctx.globalAlpha = a * k * (.55 + .45 * Math.sin(t * f * 1.3 + ph));
    ctx.fillRect(cx + du * c - dv * s, cy + du * s + dv * c, sz / zs, sz / zs);
  }
  ctx.restore();
}

// ---------- shapes as unions of stroked segments ----------
function seg(path, pts, w) { const p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]); for (const q of pts.slice(1)) p.lineTo(q[0], q[1]); return path.op(p.stroke({ width: w, cap: 1, join: 1 }), PathOp.Union); }
function chain(path, pts, w0, w1) { for (let i = 0; i < pts.length - 1; i++) path = seg(path, [pts[i], pts[i + 1]], lerp(w0, w1, i / Math.max(1, pts.length - 2))); return path; }

// ---------- the hand of light ----------
// local units: wrist at (0,0), fingers along +x, palm length 1, index finger on the -y side. Index extended, others curled.
let HAND = null;
export function handPath() {
  if (HAND) return HAND;
  let p = new Path2D();
  p.moveTo(-3.4, -.62); p.quadraticCurveTo(-1.6, -.52, -.05, -.38); p.lineTo(-.05, .38); p.quadraticCurveTo(-1.6, .6, -3.4, .78); p.closePath();
  const palm = new Path2D(); palm.moveTo(-.1, -.38); palm.bezierCurveTo(.35, -.52, .8, -.5, 1.02, -.44); palm.bezierCurveTo(1.12, -.1, 1.1, .2, .98, .42);
  palm.bezierCurveTo(.6, .5, .25, .5, -.1, .38); palm.closePath(); p = p.op(palm, PathOp.Union);
  p = chain(p, [[.88, -.33], [1.4, -.38], [1.78, -.4], [2.08, -.4]], .25, .19);    // index, leading
  p = chain(p, [[.95, -.11], [1.45, -.13], [1.78, -.1], [1.96, -.04]], .24, .19);    // middle
  p = chain(p, [[.95, .1], [1.36, .11], [1.62, .17], [1.74, .24]], .23, .18);        // ring
  p = chain(p, [[.88, .29], [1.16, .33], [1.36, .4], [1.44, .46]], .2, .16);         // little
  p = chain(p, [[.22, -.32], [.55, -.62], [.86, -.8], [1.06, -.86]], .26, .19);      // thumb, spread
  HAND = p; return p;
}
export const HAND_TIP = [2.17, -.4];   // tip of the index finger (local)
// matrix of the hand: wrist (x,y), angle, palm length L, flip ±1 (mirror across the finger axis)
export function handMatrix(x, y, ang, L, flip = 1) { const c = Math.cos(ang), s = Math.sin(ang); return { a: c * L, b: s * L, c: -s * L * flip, d: c * L * flip, e: x, f: y }; }
export const applyM = (m, u, v) => [m.a * u + m.c * v + m.e, m.b * u + m.d * v + m.f];
// draw it: soft bloom, gradient body (bright toward the fingers, dissolving toward the arm), silhouette glow, dust
export function lightHand(ctx, m, t, o = {}) {
  const path = new Path2D(); path.addPath(handPath(), m);
  const a = o.a ?? 1, [cx, cy] = applyM(m, 1.1, -.1), L = Math.hypot(m.a, m.b);
  glowFill(ctx, path, L * .7, .75 * a, P.blue0);      // the light lifts the night to a saturated blue
  glowFill(ctx, path, L * .1, .55 * a, P.halo1);      // narrow warm rim
  ctx.save(); ctx.globalAlpha = a; ctx.filter = `blur(${L * .01}px)`;
  ctx.fillStyle = rad(ctx, cx, cy, L * 3.2, [[0, P.core0], [.1, P.core1], [.24, P.halo0], [.5, rgba(P.halo1, .95)], [.78, rgba(P.halo1, .5)], [1, rgba(P.blue0, 0)]]);
  ctx.fill(path); ctx.restore();
  // a little form: the back of the hand a touch warmer, the finger edge brightest
  ctx.save(); ctx.clip(path); ctx.globalAlpha = .35 * a;
  const [sx, sy] = applyM(m, .5, .55), [ex, ey] = applyM(m, .6, -.4);
  ctx.fillStyle = lin(ctx, sx, sy, ex, ey, [[0, rgba(P.shade0, .9)], [.6, rgba(P.halo1, 0)]]); ctx.fill(path); ctx.restore();
  dust(ctx, 41, 9000, cx, cy, L * 1.15, L * .8, t, a, P.halo1, Math.atan2(m.b, m.a));
}

// ---------- light trail (die Spur) ----------
// pts: [[x,y,w], …] in the current space; u: drawn share 0..1. Three passes: wide glow, warm body, cream core; spark at the head.
export function catmull(pts, n = 8) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const s = k / n, s2 = s * s, s3 = s2 * s;
      out.push(p1.map((_, j) => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * s + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * s2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * s3)));
    }
  }
  out.push(pts[pts.length - 1].slice()); return out;
}
export function trail(ctx, pts, u = 1, o = {}) {
  if (u <= 0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const stop = len[len.length - 1] * clamp(u); let head = pts[0];
  const a = o.a ?? 1;
  const passes = [[5, .22, P.halo1, 'lighter'], [2.4, .75, P.halo1, 'source-over'], [1, 1, P.core1, 'source-over']];
  for (const [k, al, col, op] of passes) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = al * a;
    if (k > 3) ctx.filter = `blur(${(o.w || 3) * 2}px)`;
    for (let i = 1; i < pts.length; i++) {
      if (len[i - 1] >= stop) break;
      let q = pts[i]; if (len[i] > stop) { const f = (stop - len[i - 1]) / (len[i] - len[i - 1]); q = pts[i - 1].map((v, j) => lerp(v, pts[i][j], f)); }
      ctx.lineWidth = (pts[i][2] ?? o.w ?? 3) * k; ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); head = q;
    }
    ctx.restore();
  }
  if (o.spark !== false && u < 1) halo(ctx, head[0], head[1], (head[2] ?? o.w ?? 3) * 14, .8 * a);
  return head;
}

// ---------- the figure "du" ----------
// The viewer. Small, faceless, yellow raincoat with hood, dark head. Built from joints so it can walk, lift and look up.
//   o.dir ±1 facing, o.walk phase (radians) or null, o.armR / o.armL = [shoulder, elbow] angles from straight down (+ = forward),
//   o.look 0..1 head up, o.light ±1 light side on screen, o.back 0..1 backlight (coat goes to shadow, rim stays), o.headset, o.cup 'R'
//   returns the screen positions of both hands (for trails and cups).
export const COAT = { base: P.coat, lit: mixHex(P.coat, P.core1, .45), shade: mixHex(P.coat, P.shade0, .62), deep: mixHex(P.coat, P.night1, .55) };
export function du(ctx, x, y, h, o = {}) {
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, back = o.back ?? 0, look = o.look ?? 0;
  const ph = o.walk, sw = ph == null ? 0 : Math.sin(ph);
  const armR = o.armR || [.2, .1], armL = o.armL || [-.2, -.1];
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h);
  // ground shadow, away from the light
  ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.ellipse(-L * .2, 0, .3, .022, 0, 0, 6.29); ctx.fill();
  const cap = (pts, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(...pts[0]); for (const q of pts.slice(1)) ctx.lineTo(...q); ctx.stroke(); };
  // legs (navy trousers, dark shoes)
  const leg = (hx, a, k, col) => {
    const kn = [hx + Math.sin(a) * .23, -.44 + Math.cos(a) * .22], ft = [kn[0] + Math.sin(a - k) * .21, kn[1] + Math.cos(a - k) * .21];
    cap([[hx, -.44], kn, ft], .068, col);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(ft[0] + .03, ft[1] - .005, .05, .024, 0, 0, 6.29); ctx.fill();
  };
  const a1 = ph == null ? .03 : .36 * sw, k1 = ph == null ? 0 : Math.max(0, Math.sin(ph + 1.7)) * .55, k2 = ph == null ? 0 : Math.max(0, Math.sin(ph + 1.7 + Math.PI)) * .55;
  leg(-.04, -a1, k2, P.ind1); leg(.04, a1, k1, mixHex(P.ind1, P.blue1, .35));
  // arms: sleeve (coat), hand
  const hands = {};
  const arm = (side, [s1, s2], col) => {
    const sx = side * .095, sy = -.735, el = [sx + Math.sin(s1) * .17, sy + Math.cos(s1) * .17], hd = [el[0] + Math.sin(s2) * .16, el[1] + Math.cos(s2) * .16];
    cap([[sx, sy], el, hd], .062, col);
    ctx.fillStyle = mixHex(P.shade0, P.night1, .25); ctx.beginPath(); ctx.arc(hd[0], hd[1], .03, 0, 6.29); ctx.fill();
    hands[side > 0 ? 'R' : 'L'] = [x + h * dir * hd[0], y + h * hd[1]];   // in the caller's space
    if (o.cup === (side > 0 ? 'R' : 'L')) { ctx.fillStyle = P.cream; ctx.beginPath(); ctx.moveTo(hd[0] - .036, hd[1] - .075); ctx.lineTo(hd[0] + .036, hd[1] - .075); ctx.lineTo(hd[0] + .028, hd[1] - .005); ctx.lineTo(hd[0] - .028, hd[1] - .005); ctx.closePath(); ctx.fill(); }
  };
  const coatL = mixHex(COAT.lit, COAT.shade, back), coatS = mixHex(COAT.shade, COAT.deep, back);
  arm(-1, armL, coatS);
  // coat: A-line from the shoulders, hem swings with the walk
  const hem = .2 + .012 * Math.abs(sw), swing = .02 * sw;
  ctx.beginPath(); ctx.moveTo(-.1, -.77); ctx.quadraticCurveTo(-.135, -.72, -.13, -.6);
  ctx.lineTo(-.175 + swing, -hem); ctx.quadraticCurveTo(0, -hem + .028, .175 + swing, -hem - .006);
  ctx.lineTo(.13, -.6); ctx.quadraticCurveTo(.135, -.72, .1, -.77); ctx.quadraticCurveTo(0, -.8, -.1, -.77); ctx.closePath();
  ctx.fillStyle = lin(ctx, -.18 * L, 0, .18 * L, 0, [[0, coatS], [.5, mixHex(P.coat, coatS, back * .7)], [1, coatL]]); ctx.fill();
  ctx.save(); ctx.clip();
  ctx.fillStyle = rgba(COAT.deep, .28); ctx.beginPath(); ctx.moveTo(-.02, -.62); ctx.quadraticCurveTo(-.01, -.4, -.06 + swing, -hem); ctx.lineTo(.02 + swing, -hem); ctx.quadraticCurveTo(.015, -.42, .0, -.62); ctx.fill();  // fold
  ctx.fillStyle = lin(ctx, 0, -.5, 0, -.18, [[0, rgba(COAT.deep, 0)], [1, rgba(COAT.deep, .35)]]); ctx.fillRect(-.3, -.6, .6, .5);
  if (back > 0) { ctx.strokeStyle = rgba(P.core1, .8 * back); ctx.lineWidth = .02; ctx.stroke(); }
  ctx.restore();
  // hood (behind the head) and the head (dark, no face)
  const hx = -.012 * look, hy = -.885 - .008 * look;
  ctx.fillStyle = coatS; ctx.beginPath(); ctx.ellipse(.0, -.8, .088, .048, 0, 0, 6.29); ctx.fill();
  ctx.fillStyle = mixHex(coatS, P.coat, .4); ctx.beginPath(); ctx.ellipse(-.018 - .01 * look, -.835, .08, .06, -.3, 0, 6.29); ctx.fill();
  ctx.fillStyle = P.ind2; ctx.beginPath(); ctx.ellipse(hx, hy, .066, .074 - .01 * look, look * -.35, 0, 6.29); ctx.fill();
  ctx.fillStyle = rgba(P.blue1, .55); ctx.beginPath(); ctx.ellipse(hx + .03 * L, hy - .01, .028, .05, look * -.35, 0, 6.29); ctx.fill();   // light on the hair
  if (o.headset) {
    ctx.strokeStyle = P.cream; ctx.lineWidth = .014; ctx.beginPath(); ctx.arc(hx, hy + .004, .075, Math.PI * 1.08, Math.PI * 1.95); ctx.stroke();
    ctx.fillStyle = P.blue2; ctx.beginPath(); ctx.ellipse(hx + .058, hy + .012, .022, .032, 0, 0, 6.29); ctx.fill();
    ctx.strokeStyle = P.cream; ctx.lineWidth = .008; ctx.stroke();
  }
  arm(1, armR, mixHex(P.coat, coatL, .5));
  ctx.restore();
  return hands;
}

// ---------- robot: plain silhouette, no face, readable joints ----------
//   o.armR / o.armL / o.legs as in du (angles from straight down), o.light ±1, o.rim colour, o.body colour, o.cup, o.dir
function robotPath(o) {
  const armR = o.armR || [.08, .04], armL = o.armL || [-.06, -.03];
  let p = new Path2D(); p.ellipse(0, -.945, .072, .07, 0, 0, Math.PI * 2);
  const t = new Path2D(); t.moveTo(-.03, -.885); t.lineTo(.03, -.885); t.lineTo(.035, -.84); t.lineTo(.15, -.825); t.quadraticCurveTo(.18, -.81, .17, -.75);
  t.lineTo(.13, -.63); t.lineTo(.095, -.55); t.lineTo(-.095, -.55); t.lineTo(-.13, -.63); t.lineTo(-.17, -.75); t.quadraticCurveTo(-.18, -.81, -.15, -.825); t.lineTo(-.035, -.84); t.closePath();
  p = p.op(t, PathOp.Union);
  const pel = new Path2D(); pel.roundRect(-.105, -.575, .21, .1, .035); p = p.op(pel, PathOp.Union);
  const J = { };
  for (const s of [-1, 1]) {
    const [s1, s2] = s > 0 ? armR : armL, sx = s * .168, sy = -.775;
    const el = [sx + Math.sin(s1) * .17, sy + Math.cos(s1) * .17], hd = [el[0] + Math.sin(s2) * .16, el[1] + Math.cos(s2) * .16];
    p = seg(p, [[sx, sy], el], .07); p = seg(p, [el, hd], .06);
    const hx = hd[0] + Math.sin(s2) * .035, hy = hd[1] + Math.cos(s2) * .035; p = seg(p, [hd, [hx, hy]], .045);
    const hip = [s * .062, -.49], kn = [s * .07, -.26], ft = [s * .074, -.04];
    p = seg(p, [hip, kn], .078); p = seg(p, [kn, ft], .066);
    const f = new Path2D(); f.roundRect(s * .07 - .045, -.05, .11, .05, .02); p = p.op(f, PathOp.Union);
    J[s] = { sh: [sx, sy], el, hd: [hx, hy], kn };
  }
  return { p, J };
}
export function robot(ctx, x, y, h, o = {}) {
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, { p, J } = robotPath(o);
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h); ctx.globalAlpha = o.alpha ?? 1;
  ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.ellipse(-L * .2, 0, .3, .02, 0, 0, 6.29); ctx.fill();
  // rim light: the silhouette minus itself shifted away from the light
  const sh = new Path2D(); sh.addPath(p, { a: 1, b: 0, c: 0, d: 1, e: -L * .016, f: .009 });
  ctx.fillStyle = o.body || P.ind0; ctx.fill(p);
  ctx.fillStyle = o.rim || P.blue0; ctx.fill(new Path2D(p).op(sh, PathOp.Difference));
  ctx.fillStyle = o.joint || mixHex(o.body || P.ind0, P.blue0, .6);
  for (const s of [-1, 1]) for (const [k, r] of [['sh', .034], ['el', .026], ['kn', .03]]) { ctx.beginPath(); ctx.arc(J[s][k][0], J[s][k][1], r, 0, 6.29); ctx.fill(); }
  const hands = {};
  for (const s of [-1, 1]) { const [u, v] = J[s].hd; hands[s > 0 ? 'R' : 'L'] = [x + h * dir * u, y + h * v]; }   // in the caller's space
  if (o.cup) { const [u, v] = J[o.cup === 'L' ? -1 : 1].hd; ctx.fillStyle = o.body || P.ind0; ctx.beginPath(); ctx.moveTo(u - .028, v - .06); ctx.lineTo(u + .028, v - .06); ctx.lineTo(u + .022, v - .01); ctx.lineTo(u - .022, v - .01); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  return hands;
}

// ---------- finish: vignette + grain (computed once, applied as a pixel pass) ----------
let GRAIN = null;
export function prepareEditorial() {
  if (GRAIN) return;
  GRAIN = [];
  for (let k = 0; k < 3; k++) {
    const r = prng(97 + k * 31), cw = W >> 1, ch = H >> 1, coarse = new Float32Array(cw * ch);
    for (let i = 0; i < coarse.length; i++) coarse[i] = r() + r() - 1;
    const g = new Int8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) g[y * W + x] = Math.round(clamp(.72 * coarse[(y >> 1) * cw + (x >> 1)] + .28 * (r() + r() - 1), -1, 1) * 127);
    GRAIN.push(g);
  }
}
// o.grain: amplitude (0..255 units) in the mid tones, o.floor: amplitude in the darks, o.vig: vignette strength
export function finish(ctx, t, o = {}) {
  prepareEditorial();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const v = o.vig ?? .55;
  if (v > 0) { ctx.fillStyle = rad(ctx, W / 2, H * .52, W * .72, [[.45, rgba(P.night0, 0)], [1, rgba(P.night0, v)]]); ctx.fillRect(0, 0, W, H); }
  ctx.restore();
  const id = ctx.getImageData(0, 0, W, H), d = id.data, N = GRAIN[Math.floor(t * 12) % GRAIN.length];
  const amp = o.grain ?? 30, fl = o.floor ?? 7;
  for (let p = 0, i = 0; p < N.length; p++, i += 4) {
    const l = Math.max(d[i], d[i + 1], d[i + 2]) / 255, n = N[p] / 127 * (fl + amp * 4 * l * (1 - l));
    d[i] += n; d[i + 1] += n; d[i + 2] += n * .92;
  }
  ctx.putImageData(id, 0, 0);
}

// =====================================================================================================================
// 2.5D STAGE: flat cards standing at real depth in front of a perspective camera (same model as the engine camera view3:
// position x,y,z + focal length f, looking down +z). A card is drawn in DESIGN coordinates: the 1920×1080 layout exactly as it
// looks from the home camera cam3() — then given a depth Z. Moving the camera gives true parallax (near cards move more),
// a dolly (z up) magnifies near cards faster than far ones, and a card the camera passes is flown through (skipped).
//   depths (convention): sky 40000 · far ridge / horizon 9000 · mid 4000 · FOCUS 1700 (= F0, k 1 at home) · foreground 1100 · lens 700
// =====================================================================================================================
export const F0 = 1700;
export const cam3 = (o = {}) => ({ x: 0, y: 0, z: 0, f: F0, roll: 0, ...o });
// scale + offset of a card at depth Z for camera c (null if behind / too close)
export function cardM(c, Z) {
  const dz = Z - c.z; if (dz < 30) return null;
  const s = c.f / dz, k = Z / F0 * s;
  return { k, e: W / 2 + (-(W / 2) * Z / F0 - c.x) * s, f: H / 2 + (-(H / 2) * Z / F0 - c.y) * s };
}
export function card(ctx, c, Z, fn) {
  const m = cardM(c, Z); if (!m) return false;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (c.roll) { ctx.translate(W / 2, H / 2); ctx.rotate(c.roll); ctx.translate(-W / 2, -H / 2); }
  ctx.transform(m.k, 0, 0, m.k, m.e, m.f); fn(m.k); ctx.restore(); return true;
}
// design point (u,v) of card Z → screen [x, y, k]
export function project(c, Z, u, v) { const m = cardM(c, Z); return m ? [m.e + u * m.k, m.f + v * m.k, m.k] : null; }
// the camera that shows design point (u,v) of card Z at screen point (sx,sy) magnified s× (s = 1 at the home distance)
export function aim(Z, u, v, s = 1, sx = W / 2, sy = H / 2, f = F0) {
  const dz = Z * f / (F0 * s), z = Z - dz, k = f / dz;
  return cam3({ x: (u - W / 2) * Z / F0 - (sx - W / 2) / k, y: (v - H / 2) * Z / F0 - (sy - H / 2) / k, z, f });
}
// camera keyframes: [[t, cam, ease]] ease: 's' sine (default) · 'q' quart in-out · 'i' expo in (into a light) · 'o' expo out (out of one)
// z is interpolated in log-distance to a reference card (Z ref) so fly-ins feel like constant speed through space.
export function camAt(t, K, ref = F0) {
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = K[i][1], b = K[i + 1][1], e = { s: sineIO, q: quartIO, i: expoIn, o: expoOut }[K[i + 1][2] || 's'];
  const u = e((t - K[i][0]) / (K[i + 1][0] - K[i][0])), out = cam3();
  for (const k of ['x', 'y', 'f', 'roll']) out[k] = lerp(a[k] ?? out[k], b[k] ?? out[k], u);
  const da = Math.max(1, ref - (a.z || 0)), db = Math.max(1, ref - (b.z || 0)); out.z = ref - Math.exp(lerp(Math.log(da), Math.log(db), u));
  return out;
}
// "nothing ever stands still": a slow drift on top of any camera (amplitude in design px at the focus plane)
export const camDrift = (c, t, amt = 1, seed = 0) => ({ ...c, x: c.x + drift(t, 5 * amt, seed), y: c.y + drift(t, 3 * amt, seed + 2), z: c.z + drift(t, 14 * amt, seed + 4) });
// inside the light form: the whole frame becomes light (draw last, before finish). Both sides of a fly-through cut draw a = 1.
export function lightFlood(ctx, a) {
  if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = rad(ctx, W / 2, H / 2, W * .9, [[0, rgba(P.core0, a)], [.6, rgba(P.core1, a)], [1, rgba(P.halo2, a)]]); ctx.fillRect(0, 0, W, H); ctx.restore();
}

// ---------- generic light forms (the ONE hero light of a picture) ----------
// kind 'disc' (sun, lamp, moon) · 'window' (hall window with mullions) · 'gate' (arched door) · 'ring'. Blue bloom around it,
// warm rim, gradient body (hot core → gold edge), stipple dust. o: { a, breath, dust (count), mullions: [cols, rows], seed }
export function lightForm(ctx, kind, x, y, w, h, t, o = {}) {
  const a = o.a ?? 1, br = 1 + (o.breath ?? .03) * Math.sin(t * 1.1), cx = x + w / 2, cy = y + h / 2, R = Math.max(w, h) / 2;
  const path = new Path2D();
  if (kind === 'disc' || kind === 'ring') path.ellipse(cx, cy, w / 2 * br, h / 2 * br, 0, 0, Math.PI * 2);
  else if (kind === 'gate') { path.moveTo(x, y + h); path.lineTo(x, y + w / 2); path.arc(cx, y + w / 2, w / 2, Math.PI, 0); path.lineTo(x + w, y + h); path.closePath(); }
  else path.rect(x, y, w, h);
  glowFill(ctx, path, R * .55, .85 * a, P.blue0);
  glowFill(ctx, path, R * .09, .5 * a, P.halo1);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rad(ctx, cx, kind === 'disc' || kind === 'ring' ? cy : y + h * .62, R * (kind === 'disc' || kind === 'ring' ? 1 : 1.25),
    [[0, P.core0], [.2, P.core1], [.5, P.halo0], [.82, P.halo1], [1, mixHex(P.halo1, P.shade0, .5)]]);
  if (kind === 'ring') { ctx.lineWidth = R * .12; ctx.strokeStyle = ctx.fillStyle; ctx.stroke(path); } else ctx.fill(path);
  if (kind === 'window' || kind === 'gate') {
    const [cols, rows] = o.mullions || [3, 2];
    ctx.save(); ctx.clip(path); ctx.filter = `blur(${R * .004}px)`; ctx.strokeStyle = rgba(P.shade0, .3); ctx.lineWidth = Math.max(2, w * .012);
    for (let i = 1; i < cols; i++) { ctx.beginPath(); ctx.moveTo(x + w * i / cols, y); ctx.lineTo(x + w * i / cols, y + h); ctx.stroke(); }
    for (let i = 1; i < rows; i++) { ctx.beginPath(); ctx.moveTo(x, y + h * .28 * i); ctx.lineTo(x + w, y + h * .28 * i); ctx.stroke(); }
    ctx.restore();
  }
  ctx.restore();
  if (kind === 'disc') halo(ctx, cx, cy, R * 2.2, .25 * a, P.halo1, P.halo2);
  dust(ctx, o.seed ?? 77, o.dust ?? 6000, cx, cy, w * .62 + R * .2, h * .5 + R * .2, t, .9 * a, P.halo1);
  return path;
}
// thin rays from a disc (as in the "smarter than ever" thumbnail), very quiet
export function rays(ctx, cx, cy, r0, r1, n = 12, a = .3, rot = 0) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, a); ctx.lineWidth = 1.6;
  for (let i = 0; i < n; i++) { const q = rot + i / n * 6.283; ctx.beginPath(); ctx.moveTo(cx + Math.cos(q) * r0, cy + Math.sin(q) * r0); ctx.lineTo(cx + Math.cos(q) * r1, cy + Math.sin(q) * r1); ctx.stroke(); }
  ctx.restore();
}

// ---------- ground, hills, shadows ----------
// a flat shape with a vertical gradient and a lit rim on its top edge. pts: [[x,y], …] top edge left → right; closes to the bottom.
export function ground(ctx, pts, o = {}) {
  const top = Math.min(...pts.map((p) => p[1])), bot = o.bottom ?? H + 400;
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i]; ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
  const last = pts[pts.length - 1]; ctx.lineTo(last[0], last[1]);
  ctx.strokeStyle = o.rim ?? rgba(P.blue0, .95); ctx.lineWidth = o.rimW ?? 3; ctx.stroke();
  ctx.lineTo(last[0], bot); ctx.lineTo(pts[0][0], bot); ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, top, 0, Math.min(bot, H), o.stops || [[0, P.night1], [1, P.night0]]); ctx.fill();
}
// long cast shadow from feet (x,y) away from a light: length len, direction ang (radians, 0 = right, π/2 = toward the viewer)
export function castShadow(ctx, x, y, w, len, ang, a = .6) {
  const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len, nx = -Math.sin(ang), ny = Math.cos(ang);
  ctx.save(); ctx.filter = 'blur(3px)'; ctx.fillStyle = rgba(P.night0, a); ctx.beginPath();
  ctx.moveTo(x - nx * w / 2, y - ny * w / 2); ctx.lineTo(x + nx * w / 2, y + ny * w / 2); ctx.lineTo(ex + nx * w * .9, ey + ny * w * .9); ctx.lineTo(ex - nx * w * .9, ey - ny * w * .9); ctx.closePath(); ctx.fill(); ctx.restore();
}
// a light pool on the floor (window or disc light falling out toward the viewer)
export function lightPool(ctx, x0, x1, y, spread, depth, a = 1) {
  ctx.save(); ctx.filter = 'blur(6px)'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.lineTo(x1 + spread, y + depth); ctx.lineTo(x0 - spread * 1.4, y + depth); ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + depth, [[0, rgba(P.halo2, .75 * a)], [.45, rgba(P.halo1, .38 * a)], [1, rgba(P.shade0, .12 * a)]]); ctx.fill(); ctx.restore();
}

// ---------- type: cream with a warm glow (numbers, 1–3 words, sources) ----------
import { GlobalFonts } from '@napi-rs/canvas';
const FONTS = '/home/user/scenario/style-tests/shared/fonts/';
try { GlobalFonts.registerFromPath(FONTS + 'InstrumentSerif.woff2', 'Instrument Serif'); for (const w of [400, 500, 600]) GlobalFonts.registerFromPath(FONTS + `Inter-${w}-normal.woff2`, 'Inter'); } catch { /* fonts optional */ }
export const TYPE = { hero: 168, num: 120, mid: 80, label: 34, small: 28, src: 22 };
export function glowText(ctx, s, x, y, o = {}) {
  const size = o.size ?? TYPE.label, font = o.serif ? `${size}px "Instrument Serif"` : `${o.weight ?? 600} ${size}px Inter`;
  ctx.save(); ctx.font = font; ctx.textAlign = o.align ?? 'left'; ctx.textBaseline = o.base ?? 'alphabetic'; ctx.globalAlpha = o.a ?? 1;
  if (o.spacing) ctx.letterSpacing = `${o.spacing}em`;
  if (o.glow !== false) { ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = size * .45; }
  ctx.fillStyle = o.col ?? P.cream; ctx.fillText(s, x, y); ctx.shadowBlur = 0; ctx.fillText(s, x, y); ctx.restore();
}

// =====================================================================================================================
// EXPLAINERS IN THE SAME LOOK: lines, bars, rings and dots made of light on night blue; numbers in cream. Each takes u 0..1
// (how far it has grown) so it can be driven by the voice. Warm = human / learned / good; cool blue-cream = machine / not yet.
// =====================================================================================================================
const COOL = mixHex(P.blue2, P.cream, .35);
// counter: a number that runs from → to (eased), cream with glow, optional label underneath
export function counter(ctx, t, o) {
  const v = lerp(o.from ?? 0, o.to, expoOut(o.u ?? 1)), s = o.fmt ? o.fmt(v) : Math.round(v).toLocaleString('en-US');
  glowText(ctx, (o.pre || '') + s + (o.post || ''), o.x, o.y, { size: o.size ?? TYPE.hero, align: o.align ?? 'center', serif: o.serif ?? true });
  if (o.label) glowText(ctx, o.label.toUpperCase(), o.x, o.y + (o.size ?? TYPE.hero) * .42, { size: TYPE.label, align: o.align ?? 'center', spacing: .2, glow: false, col: P.halo2, a: smooth(span(o.u ?? 1, .4, 1)) });
}
// bars of light rising from a ground line. o { x, y (baseline), w, h (max), values[], max, lit[] (0..1 warm), labels[], u, gap }
export function bars(ctx, t, o) {
  const n = o.values.length, gap = o.gap ?? .35, bw = o.w / (n + (n - 1) * gap), max = o.max ?? Math.max(...o.values);
  ctx.save(); ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x - 20, o.y); ctx.lineTo(o.x + o.w + 20, o.y); ctx.stroke(); ctx.restore();
  o.values.forEach((v, i) => {
    const k = expoOut(span(o.u ?? 1, i / (n + 2), (i + 3) / (n + 2))), bh = o.h * v / max * k, x = o.x + i * bw * (1 + gap), warm = o.lit ? o.lit[i] : 1;
    const p = new Path2D(); p.roundRect(x, o.y - bh, bw, bh, [bw * .12, bw * .12, 0, 0]);
    glowFill(ctx, p, bw * .5, .5 * k, warm > .5 ? P.halo1 : P.blue0);
    ctx.fillStyle = lin(ctx, 0, o.y - bh, 0, o.y, warm > .5 ? [[0, P.core1], [.4, P.halo0], [1, rgba(P.halo1, .55)]] : [[0, COOL], [1, rgba(P.blue1, .5)]]); ctx.fill(p);
    if (o.labels?.[i] && k > .5) glowText(ctx, o.labels[i], x + bw / 2, o.y + 48, { size: TYPE.small, align: 'center', glow: false, col: P.halo2, a: smooth(span(k, .5, 1)) });
  });
}
// curve of light over quiet axes. o { rect [x,y,w,h], data [[x,y]…], xr [a,b], yr [a,b], u, dashFrom (x where forecast starts), xTicks, yTicks }
export function curve(ctx, t, o) {
  const [x, y, w, h] = o.rect, [xa, xb] = o.xr, [ya, yb] = o.yr, map = (p) => [x + (p[0] - xa) / (xb - xa) * w, y + h - (p[1] - ya) / (yb - ya) * h];
  ctx.save(); ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke(); ctx.restore();
  for (const [v, s] of o.xTicks || []) glowText(ctx, s, map([v, ya])[0], y + h + 44, { size: TYPE.small, align: 'center', glow: false, col: P.halo2 });
  for (const [v, s] of o.yTicks || []) glowText(ctx, s, x - 18, map([xa, v])[1] + 10, { size: TYPE.small, align: 'right', glow: false, col: P.halo2 });
  const pts = catmull(o.data.map((p) => [...map(p), o.w ?? 4]), 12), u = o.u ?? 1;
  const cut = o.dashFrom != null ? clamp((map([o.dashFrom, ya])[0] - x) / w) : 1;
  const head = trail(ctx, pts, Math.min(u, cut), { w: o.w ?? 4, spark: u < cut });
  if (u > cut) {   // forecast: dotted light
    const i0 = Math.floor(cut * (pts.length - 1)), i1 = Math.floor(u * (pts.length - 1));
    ctx.save(); ctx.setLineDash([2, 14]); ctx.lineCap = 'round'; ctx.strokeStyle = P.halo0; ctx.lineWidth = (o.w ?? 4) * 1.4; ctx.beginPath();
    for (let i = i0; i <= i1; i++) (i === i0 ? ctx.moveTo(pts[i][0], pts[i][1]) : ctx.lineTo(pts[i][0], pts[i][1])); ctx.stroke(); ctx.restore();
  }
  return { head, map };
}
// share ring: a ring of light, shares fill with warm light. o { x, y, r, parts [{v, lit, label}], u }
export function pie(ctx, t, o) {
  const tot = o.parts.reduce((s, p) => s + p.v, 0), u = o.u ?? 1, w = o.r * .22;
  ctx.save(); ctx.lineWidth = w; ctx.strokeStyle = rgba(P.blue1, .55); ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 6.29); ctx.stroke(); ctx.restore();
  let a0 = o.start ?? -Math.PI / 2;
  for (const p of o.parts) {
    const a1 = a0 + p.v / tot * 6.283 * expoOut(u);
    const arc = new Path2D(); arc.arc(o.x, o.y, o.r, a0, a1); const band = arc.stroke({ width: w, cap: 0, join: 1 });
    const warm = p.lit ?? 1; glowFill(ctx, band, w * .6, .55, warm > .5 ? P.halo1 : P.blue0);
    ctx.fillStyle = warm > .5 ? P.halo0 : COOL; ctx.fill(band);
    if (p.label && u > .8) { const am = (a0 + a1) / 2; glowText(ctx, p.label, o.x + Math.cos(am) * (o.r + w * 1.6), o.y + Math.sin(am) * (o.r + w * 1.6) + 10, { size: TYPE.small, align: Math.cos(am) > 0 ? 'left' : 'right', glow: false, col: P.halo2 }); }
    a0 = a1;
  }
}
// cross-section: stacked layers of a thing (a robot hand, a battery, the soil). o { x, y, w, layers [{h, label, lit}], u }
export function section(ctx, t, o) {
  let yy = o.y; const n = o.layers.length;
  o.layers.forEach((L, i) => {
    const k = expoOut(span(o.u ?? 1, i / (n + 1), (i + 2) / (n + 1))), lh = L.h * k;
    const p = new Path2D(); p.roundRect(o.x, yy, o.w, Math.max(0, lh - 6), 8);
    ctx.fillStyle = L.lit ? lin(ctx, o.x, 0, o.x + o.w, 0, [[0, rgba(P.halo1, .9)], [1, rgba(P.halo0, .6)]]) : lin(ctx, o.x, 0, o.x + o.w, 0, [[0, P.ind1], [1, P.blue0]]); ctx.fill(p);
    if (L.lit) glowFill(ctx, p, 24, .35, P.halo1);
    if (L.label && k > .6) glowText(ctx, L.label, o.x + o.w + 36, yy + lh / 2 + 11, { size: TYPE.small, glow: false, col: P.halo2, a: smooth(span(k, .6, 1)) });
    yy += lh;
  });
}
// map of light: dots (towns, halls, robots) on night blue, warm when lit, joined by a trail. o { pts [[x,y,lit]], route [[x,y]], u, size }
export function lightMap(ctx, t, o) {
  const s = o.size ?? 2.2;
  for (const [x, y, l] of o.pts) { if (l > .5) halo(ctx, x, y, s * 9, .35 * l, P.halo1, P.halo0); ctx.fillStyle = l > .5 ? P.core1 : COOL; ctx.globalAlpha = l > .5 ? 1 : .7; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
  ctx.globalAlpha = 1;
  if (o.route) return trail(ctx, catmull(o.route.map((p) => [p[0], p[1], o.w ?? 3]), 10), o.u ?? 1, { w: o.w ?? 3 });
  return null;
}
