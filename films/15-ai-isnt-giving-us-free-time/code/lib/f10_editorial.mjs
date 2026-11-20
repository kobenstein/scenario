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
// local units: wrist at (0,0), fingers along +x, palm length 1, index finger on the -y side, seen from the back of the hand.
// o.pose: 'point' (default: the index leads, the others half curled) · 'open' (all fingers out and spread, offering) ·
//         'hold' (fingers curled round something small, thumb closing) · 'guide' (index + middle out together, leading)
// o.curl 0..1 closes the pose toward a fist; o.spread 0..1 overrides the finger spread. Curled fingers are foreshortened
// (they bend under the hand), so every pose stays a clean silhouette. Paths are cached per pose.
const HPOSE = {
  point: { c: [.04, .5, .66, .78, .2], sp: .25 },
  open: { c: [.06, .04, .07, .1, .08], sp: .85 },
  hold: { c: [.78, .88, .94, 1, .6], sp: .08 },
  guide: { c: [.04, .1, .62, .78, .25], sp: .08 },
};
const FING = [   // knuckle, base angle, spread angle, phalanx lengths, widths knuckle → tip (index, middle, ring, little, thumb)
  { b: [.94, -.31], a: -.06, sa: -.15, l: [.46, .3, .23], w: [.26, .22, .19, .15] },
  { b: [1.0, -.09], a: -.01, sa: -.04, l: [.5, .33, .25], w: [.27, .23, .2, .16] },
  { b: [.98, .13], a: .05, sa: .09, l: [.45, .3, .22], w: [.25, .21, .18, .14] },
  { b: [.9, .32], a: .12, sa: .2, l: [.36, .24, .19], w: [.22, .19, .16, .13] },
  { b: [.32, -.3], a: -.82, sa: -.28, l: [.36, .3, .24], w: [.32, .26, .22, .17] },
];
const HANDS = new Map();
function buildHand(o = {}) {
  const pose = HPOSE[o.pose] ? o.pose : 'point', ps = HPOSE[pose], sp = clamp(o.spread ?? ps.sp);
  const cu = ps.c.map((c) => lerp(c, 1, clamp(o.curl ?? 0)));
  const key = pose + cu.map((c) => c.toFixed(2)).join(',') + sp.toFixed(2);
  if (HANDS.has(key)) return HANDS.get(key);
  let p = new Path2D();   // forearm, tapering into a soft wrist
  p.moveTo(-3.4, -.64); p.bezierCurveTo(-2, -.56, -.6, -.46, -.02, -.37); p.lineTo(-.02, .38); p.bezierCurveTo(-.6, .5, -2, .62, -3.4, .8); p.closePath();
  const palm = new Path2D();
  palm.moveTo(-.06, -.37); palm.bezierCurveTo(.3, -.5, .72, -.47, 1.0, -.42); palm.bezierCurveTo(1.12, -.16, 1.12, .18, .98, .41);
  palm.bezierCurveTo(.62, .53, .24, .5, -.06, .39); palm.bezierCurveTo(-.12, .12, -.12, -.12, -.06, -.37); palm.closePath();
  p = p.op(palm, PathOp.Union);
  const thenar = new Path2D(); thenar.ellipse(.36, -.3, .3, .17, -.55, 0, Math.PI * 2); p = p.op(thenar, PathOp.Union);
  const tips = [];
  FING.forEach((f, i) => {
    let ang = f.a + f.sa * sp, x = f.b[0], y = f.b[1], cum = 0; const pts = [[x, y]];
    for (let k = 0; k < 3; k++) {
      cum += cu[i] * [.8, 1.05, .95][k];
      const L = f.l[k] * Math.max(.14, Math.cos(Math.min(cum, 1.45)));
      ang += (i === 4 ? -.14 : .035 * (i - 1.5)) * (1 - cu[i]);
      x += Math.cos(ang) * L; y += Math.sin(ang) * L; pts.push([x, y]);
    }
    for (let k = 0; k < 3; k++) p = seg(p, [pts[k], pts[k + 1]], lerp(f.w[k], f.w[k + 1], .5) * (1 + .22 * cu[i]));
    const kn = new Path2D(); kn.arc(pts[1][0], pts[1][1], f.w[1] * .56 * (1 + .25 * cu[i]), 0, Math.PI * 2); p = p.op(kn, PathOp.Union);   // knuckle volume
    tips.push(pts[3]);
  });
  if (HANDS.size > 400) HANDS.clear();
  const r = { path: p, tips }; HANDS.set(key, r); return r;
}
export function handPath(o = {}) { return buildHand(o).path; }
// local tip of a finger (0 index, 1 middle, 2 ring, 3 little, 4 thumb) for a pose
export function handTip(o = {}, i = 0) { const t = buildHand(o).tips[i]; return [t[0] + .08, t[1]]; }
export const HAND_TIP = handTip();   // tip of the index finger in the default pose (local)
// matrix of the hand: wrist (x,y), angle, palm length L, flip ±1 (mirror across the finger axis)
export function handMatrix(x, y, ang, L, flip = 1) { const c = Math.cos(ang), s = Math.sin(ang); return { a: c * L, b: s * L, c: -s * L * flip, d: c * L * flip, e: x, f: y }; }
export const applyM = (m, u, v) => [m.a * u + m.c * v + m.e, m.b * u + m.d * v + m.f];
// draw it: saturated blue aura, warm rim, gradient body (white-gold core in the palm, gold toward the edges, fading up the arm),
// soft inner edge for volume, stipple dust. o: { a, pose, curl, spread, dust }
export function lightHand(ctx, m, t, o = {}) {
  const path = new Path2D(); path.addPath(handPath(o), m);
  const a = o.a ?? 1, [cx, cy] = applyM(m, 1.05, -.05), L = Math.hypot(m.a, m.b);
  if (o.tone !== 'blue') return warmHand(ctx, path, m, t, o, cx, cy, L);   // Film 13: the warm gold hand (STIL-editorial-nacht)
  glowFill(ctx, path, L * 1.5, .55 * a, P.blue0);     // wide saturated blue
  glowFill(ctx, path, L * .55, .95 * a, P.blue0);     // the light lifts the night to blue
  glowFill(ctx, path, L * .09, .6 * a, P.halo0);      // narrow warm rim
  ctx.save(); ctx.globalAlpha = a; ctx.filter = `blur(${L * .012}px)`;
  ctx.fillStyle = rad(ctx, cx, cy, L * 3.1, [[0, P.core0], [.1, P.core0], [.22, P.core1], [.4, P.halo0], [.62, rgba(P.halo0, .9)], [.82, rgba(P.halo1, .45)], [1, rgba(P.blue0, 0)]]);
  ctx.fill(path); ctx.restore();
  // volume: a soft darker gold just inside the edge, and the back of the hand a touch warmer on the far side
  ctx.save(); ctx.clip(path); ctx.globalAlpha = .5 * a; ctx.filter = `blur(${L * .05}px)`;
  ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = L * .1; ctx.stroke(path); ctx.filter = 'none';
  const [sx, sy] = applyM(m, .5, .6), [ex, ey] = applyM(m, .6, -.3);
  ctx.globalAlpha = .3 * a; ctx.fillStyle = lin(ctx, sx, sy, ex, ey, [[0, rgba(P.shade0, .9)], [.7, rgba(P.halo1, 0)]]); ctx.fill(path); ctx.restore();
  dust(ctx, 41, o.dust ?? 9000, cx, cy, L * 1.2, L * .85, t, a, P.halo0, Math.atan2(m.b, m.a));
}

// Film 13 hand: an OPAQUE warm light form (never see-through, so it never turns grey-blue against the night). Brightness is
// lum (0..1): 1 = halo gold with a cream palm, lower = sinks towards gold shadow and indigo (the hand steps back, it does not fade).
// The palm stays below the hourglass core (#fefde2) so the sand remains the hero. o.a still scales the whole thing (entrances only).
function warmHand(ctx, path, m, t, o, cx, cy, L) {
  const a = o.a ?? 1, lum = clamp(o.lum ?? .8);
  const k = (c) => mixHex(mixHex(c, P.shade0, .75 * (1 - lum)), P.ind1, .3 * (1 - lum));   // dims towards gold shadow, stays gold
  const gold = mixHex(P.halo0, P.coat, .3);                     // the thumbnail hand: a touch richer than the halo gold
  glowFill(ctx, path, L * 1.3, .22 * a * lum, P.blue0);         // the light lifts the night round it to blue (as in the Film-11 thumbnail)
  glowFill(ctx, path, L * .7, .3 * a * lum, P.halo1);           // wide warm halo
  glowFill(ctx, path, L * .18, .42 * a * lum, gold);            // close gold bloom: the edge glows instead of ending
  ctx.save(); ctx.globalAlpha = a; ctx.filter = `blur(${L * .022}px)`;
  ctx.fillStyle = rad(ctx, cx, cy, L * 2.6, [[0, k(mixHex(P.core1, gold, .45))], [.18, k(gold)], [.48, k(mixHex(gold, P.halo1, .5))], [.78, k(mixHex(P.halo1, P.shade0, .5))], [1, k(P.shade0)]]);
  ctx.fill(path); ctx.restore();
  // volume: gold shadow just inside the edge and on the far side of the back of the hand
  ctx.save(); ctx.clip(path); ctx.globalAlpha = .5 * a; ctx.filter = `blur(${L * .05}px)`;
  ctx.strokeStyle = rgba(k(P.shade0), .6); ctx.lineWidth = L * .1; ctx.stroke(path); ctx.filter = 'none';
  const [sx, sy] = applyM(m, .5, .6), [ex, ey] = applyM(m, .6, -.3);
  ctx.globalAlpha = .3 * a; ctx.fillStyle = lin(ctx, sx, sy, ex, ey, [[0, rgba(k(P.shade0), .9)], [.7, rgba(P.halo1, 0)]]); ctx.fill(path); ctx.restore();
  dust(ctx, 41, o.dust ?? 9000, cx, cy, L * 1.2, L * .85, t, a * (.4 + .6 * lum), P.halo0, Math.atan2(m.b, m.a));
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

// ---------- figures: "du" (the viewer: yellow raincoat with hood) and person() (everyone else: indigo, no yellow) ----------
// Small, faceless silhouettes built from joints. Shared options:
//   o.pose 'stand' · 'look' (up at the light) · 'lift' (both arms overhead) · 'point' · 'reach' (one arm up) · 'hold' (cup at chest)
//          · 'walk' (side view, needs o.walk phase) · 'sit' (crouched on the ground, arms round the knees)
//   o.dir ±1 facing, o.walk phase (radians), o.armR / o.armL = [shoulder, elbow] angles from straight down (+ = forward),
//   o.look 0..1 head up, o.lean (rad, + forward), o.light ±1 light side on screen, o.back 0..1 backlight, o.view 'back' | 'side',
//   o.headset, o.cup 'R' | 'L', o.hood (du: hood up). Explicit values override the pose. Returns both hands {R, L} in the caller's space.
export const COAT = { base: P.coat, lit: mixHex(P.coat, P.core1, .45), shade: mixHex(P.coat, P.shade0, .62), deep: mixHex(P.coat, P.night1, .55) };
const PERSON = { base: P.ind2, lit: mixHex(P.ind2, P.blue0, .85), shade: P.night1, deep: P.night0 };
const FPOSE = {
  stand: {}, look: { look: 1, lean: -.03 }, lift: { armR: [2.92, 3.08], armL: [-2.92, -3.08], look: .5 },
  point: { armR: [1.85, 1.92], look: .25, lean: .02 }, reach: { armR: [2.5, 2.62], look: .85 },
  hold: { armR: [.75, 2.35] }, walk: { view: 'side' }, sit: { sit: true },
};
const SKIN = mixHex(P.shade0, P.night1, .5);
function figure(ctx, x, y, h, o, CC, isDu) {
  const q = { ...(FPOSE[o.pose] || {}) }; for (const [k, v] of Object.entries(o)) if (v !== undefined) q[k] = v;
  const dir = q.dir ?? 1, L = (q.light ?? 1) * dir, back = q.back ?? 0, look = q.look ?? 0, lean = q.lean ?? 0;
  const ph = q.walk, walking = ph != null, side = q.view === 'side' || (walking && q.view !== 'back');
  const sw = walking ? Math.sin(ph) : 0, wf = side ? .74 : 1, hm = CC.hem;
  const cLit = mixHex(CC.lit, CC.shade, back), cShade = mixHex(CC.shade, CC.deep, back * .6);
  const rimCol = q.rim || (isDu ? mixHex(P.coat, P.core1, .75) : P.blue0);
  const hands = {}, hip = [0, -.47];
  const toCaller = (u, v) => { const c = Math.cos(lean), s = Math.sin(lean), du0 = u - hip[0], dv = v - hip[1]; const uu = hip[0] + du0 * c - dv * s, vv = hip[1] + du0 * s + dv * c; return [x + h * dir * uu, y + h * vv]; };
  const cap = (pts, w0, w1, col) => { ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (let i = 0; i < pts.length - 1; i++) { ctx.lineWidth = lerp(w0, w1, i / Math.max(1, pts.length - 2)); ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[i + 1]); ctx.stroke(); } };
  const rimFill = (path, col, dx, dy) => { const sh = new Path2D(); sh.addPath(path, { a: 1, b: 0, c: 0, d: 1, e: dx, f: dy }); ctx.fillStyle = col; ctx.fill(new Path2D(path).op(sh, PathOp.Difference)); };
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h);
  ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.ellipse(-L * .2, 0, .3, .022, 0, 0, 6.29); ctx.fill();
  const pants = isDu ? P.ind1 : P.night1, pantsLit = mixHex(pants, P.blue1, .45);
  if (q.sit) {   // crouched on the ground, arms round the knees, head down on them (thumbnail "or dumber")
    const cp = new Path2D(); cp.moveTo(-.02, -.62); cp.bezierCurveTo(-.12, -.62, -.18, -.5, -.19, -.32); cp.bezierCurveTo(-.2, -.16, -.22, -.06, -.23, -.006);
    cp.lineTo(.0, -.006); cp.bezierCurveTo(.02, -.12, .04, -.3, .05, -.42); cp.bezierCurveTo(.05, -.55, .03, -.61, -.02, -.62); cp.closePath();
    ctx.fillStyle = lin(ctx, -.23 * L, 0, .06 * L, 0, [[0, cShade], [.55, CC.base], [1, cLit]]); ctx.fill(cp); rimFill(cp, rimCol, -L * .016, .01);
    cap([[-.05, -.1], [.12, -.33], [.16, -.03]], .085, .07, pantsLit);                  // the near leg, knee up
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(.185, -.018, .052, .024, 0, 0, 6.29); ctx.fill();
    if (isDu) { ctx.fillStyle = cShade; ctx.beginPath(); ctx.ellipse(-.02, -.6, .075, .045, -.5, 0, 6.29); ctx.fill(); }
    ctx.fillStyle = isDu ? P.ind2 : P.night0; ctx.beginPath(); ctx.ellipse(.075, -.53, .064, .07, .6, 0, 6.29); ctx.fill();   // head down on the knees
    cap([[.0, -.52], [.15, -.42], [.15, -.3]], .068, .056, mixHex(CC.base, cLit, .4));   // arm round the knees
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(.15, -.29, .022, 0, 6.29); ctx.fill();
    ctx.restore(); const hh = [x + h * dir * .15, y - h * .29]; return { R: hh, L: hh };
  }
  // legs (trousers, shoes pointing where you go)
  const leg = (hx, a, k, col) => {
    const kn = [hx + Math.sin(a) * .22, -.45 + Math.cos(a) * .22], ft = [kn[0] + Math.sin(a - k) * .21, kn[1] + Math.cos(a - k) * .21];
    cap([[hx, -.45], kn, ft], .075, .062, col);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(ft[0] + (side ? .035 : .015), ft[1] - .006, side ? .058 : .046, .024, 0, 0, 6.29); ctx.fill();
  };
  const a1 = walking ? .4 * sw : .03, k1 = walking ? Math.max(0, Math.sin(ph + 1.7)) * .6 : 0, k2 = walking ? Math.max(0, Math.sin(ph + 1.7 + Math.PI)) * .6 : 0;
  const lx = side ? .012 : .045;
  leg(-lx, -a1, k2, pants); leg(lx, a1, k1, pantsLit);
  // upper body: lean around the hip
  ctx.translate(hip[0], hip[1]); ctx.rotate(lean); ctx.translate(-hip[0], -hip[1]);
  let armR = q.armR || [.2, .1], armL = q.armL || [-.2, -.1];
  if (walking && !o.armR) armR = [-.42 * sw, -.42 * sw + .3];
  if (walking && !o.armL) armL = [.42 * sw, .42 * sw + .3];
  const arm = (sd, [s1, s2], col) => {
    const sx = sd * .098 * wf + (side ? -.01 : 0), sy = -.74, el = [sx + Math.sin(s1) * .17, sy + Math.cos(s1) * .17], hd = [el[0] + Math.sin(s2) * .155, el[1] + Math.cos(s2) * .155];
    cap([[sx, sy], el, hd], .072, .056, col);
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.ellipse(hd[0] + Math.sin(s2) * .01, hd[1] + Math.cos(s2) * .01, .021, .025, -s2, 0, 6.29); ctx.fill();
    hands[sd > 0 ? 'R' : 'L'] = toCaller(hd[0], hd[1]);
    if (q.cup === (sd > 0 ? 'R' : 'L')) { ctx.fillStyle = P.cream; ctx.beginPath(); ctx.moveTo(hd[0] - .036, hd[1] - .075); ctx.lineTo(hd[0] + .036, hd[1] - .075); ctx.lineTo(hd[0] + .028, hd[1] - .005); ctx.lineTo(hd[0] - .028, hd[1] - .005); ctx.closePath(); ctx.fill(); }
  };
  arm(-1, armL, cShade);
  // the coat: rounded shoulders, A-line, a hem that swings with the walk
  const s2 = walking ? -.025 * sw - .02 : 0, yA = lerp(-.52, -hm, .4), yB = lerp(-.52, -hm, .75), fl = lerp(.135, .19, clamp((.47 - hm) / .27));
  const cp = new Path2D(), ox = side ? -.012 : 0;
  cp.moveTo(ox - .05 * wf, -.805); cp.bezierCurveTo(ox - .09 * wf, -.8, ox - .122 * wf, -.78, ox - .124 * wf, -.735);
  cp.bezierCurveTo(ox - .13 * wf, -.66, ox - .132 * wf, -.58, ox - .135 * wf, -.52);
  cp.bezierCurveTo(ox - .148 * wf, yA, ox - (fl - .02) * wf + s2, yB, ox - fl * wf + s2, -hm);
  cp.bezierCurveTo(ox - .1 * wf + s2, -hm + .02, ox + .05 * wf + s2, -hm + .008, ox + fl * wf + s2 * 1.2, -hm - .006);
  cp.bezierCurveTo(ox + (fl - .02) * wf + s2, yB, ox + .148 * wf, yA, ox + .135 * wf, -.52);
  cp.bezierCurveTo(ox + .132 * wf, -.58, ox + .13 * wf, -.66, ox + .124 * wf, -.735);
  cp.bezierCurveTo(ox + .122 * wf, -.78, ox + .09 * wf, -.8, ox + .05 * wf, -.805); cp.quadraticCurveTo(ox, -.815, ox - .05 * wf, -.805); cp.closePath();
  ctx.fillStyle = lin(ctx, -.19 * L, 0, .19 * L, 0, [[0, cShade], [.42, CC.base], [.8, mixHex(CC.base, cLit, .7)], [1, cLit]]); ctx.fill(cp);
  ctx.save(); ctx.clip(cp);
  ctx.fillStyle = rgba(CC.deep, .32); ctx.beginPath(); ctx.moveTo(-.03 * L, -.55); ctx.quadraticCurveTo(-.05 * L, -.35, (-.1 * L) + s2, -hm); ctx.lineTo((-.045 * L) + s2, -hm); ctx.quadraticCurveTo(-.03 * L, -.38, -.02 * L, -.55); ctx.fill();   // fold
  ctx.fillStyle = rgba(CC.deep, .2); ctx.beginPath(); ctx.moveTo(.05 * L, -.5); ctx.quadraticCurveTo(.07 * L, -.33, (.12 * L) + s2, -hm); ctx.lineTo((.085 * L) + s2, -hm); ctx.quadraticCurveTo(.06 * L, -.34, .055 * L, -.5); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -.52, 0, -hm, [[0, rgba(CC.deep, 0)], [1, rgba(CC.deep, .3)]]); ctx.fillRect(-.3, -.55, .6, .5);
  ctx.fillStyle = lin(ctx, 0, -.8, 0, -.66, [[0, rgba(cLit, .35)], [1, rgba(cLit, 0)]]); ctx.fillRect(-.3, -.82, .6, .2);   // light on the shoulders
  ctx.restore();
  rimFill(cp, rimCol, -L * .02, .012);
  if (back > .05) rimFill(cp, rgba(P.core1, .8 * back), L * .016, .01);
  // hood (down, bunched round the neck) or up; then the head (dark, no face)
  const hx = (side ? .012 : 0) - .012 * look, hy = -.885 - .008 * look;
  if (isDu) {
    const hp = new Path2D(); hp.ellipse(ox - .004, -.8, .088 * wf + .012, .05, 0, 0, 6.29); hp.ellipse(ox - .02 - .012 * look - (side ? .025 : 0), -.835, .078, .062, -.3, 0, 6.29);
    ctx.fillStyle = lin(ctx, -.1 * L, 0, .1 * L, 0, [[0, cShade], [1, mixHex(CC.base, cLit, .5)]]); ctx.fill(hp); rimFill(hp, rimCol, -L * .014, .008);
  } else { ctx.fillStyle = CC.shade; ctx.beginPath(); ctx.ellipse(ox, -.8, .05, .03, 0, 0, 6.29); ctx.fill(); }
  ctx.fillStyle = isDu ? P.ind2 : P.night0; ctx.beginPath(); ctx.ellipse(hx, hy, .066, .074 - .01 * look, look * -.35, 0, 6.29); ctx.fill();
  ctx.fillStyle = rgba(P.blue1, .55); ctx.beginPath(); ctx.ellipse(hx + .03 * L, hy - .012, .026, .048, look * -.35, 0, 6.29); ctx.fill();   // light on the hair
  if (isDu && q.hood) {   // Film 13: the hood is up by default (raincoat). A soft peak at the back, a dark face opening on the facing side.
    const ra = look * -.35;
    let hu = new Path2D(); hu.ellipse(hx - .006, hy + .002, .084, .09, ra, 0, 6.29);
    const pk = new Path2D(); pk.moveTo(hx - .075, hy - .005); pk.quadraticCurveTo(hx - .1, hy - .085, hx - .035, hy - .096); pk.lineTo(hx + .02, hy - .07); pk.lineTo(hx - .02, hy - .01); pk.closePath();
    hu = hu.op(pk, PathOp.Union);
    ctx.fillStyle = lin(ctx, -.09 * L, 0, .09 * L, 0, [[0, cShade], [1, cLit]]); ctx.fill(hu); rimFill(hu, rimCol, -L * .014, .008);
    if (q.view !== 'back') {   // the opening: a dark crescent at the front edge (no face, ever)
      ctx.save(); ctx.clip(hu); ctx.fillStyle = mixHex(P.night0, P.ind1, .35);
      ctx.beginPath(); ctx.ellipse(hx + .066 + (side ? .01 : 0), hy + .016 - .012 * look, .036 + (side ? .008 : 0), .056, ra - .12, 0, 6.29); ctx.fill(); ctx.restore();
    }
  }
  if (q.headset) {
    ctx.strokeStyle = P.cream; ctx.lineWidth = .014; ctx.beginPath(); ctx.arc(hx, hy + .004, .075, Math.PI * 1.08, Math.PI * 1.95); ctx.stroke();
    ctx.fillStyle = P.blue2; ctx.beginPath(); ctx.ellipse(hx + .058, hy + .012, .022, .032, 0, 0, 6.29); ctx.fill();
    ctx.strokeStyle = P.cream; ctx.lineWidth = .008; ctx.stroke();
  }
  arm(1, armR, mixHex(CC.base, cLit, .55));
  ctx.restore();
  return hands;
}
export function du(ctx, x, y, h, o = {}) { return figure(ctx, x, y, h, { hood: true, ...o }, { ...COAT, hem: .2 }, true); }   // Film 13: hood up unless o.hood === false
// everyone else: same skeleton in indigo (short jacket by default, o.long for a coat), rim light in blue (o.rim to change)
export function person(ctx, x, y, h, o = {}) { return figure(ctx, x, y, h, o, { ...PERSON, hem: o.long ? .22 : .44 }, false); }

// ---------- robot: its own silhouette (helmet head, broad chest plate, armoured limbs), no face, no logo ----------
//   o.pose 'stand' · 'reach' (right arm up) · 'lift' (both arms up) · 'point' · 'walk' (needs o.walk phase)
//   o.hand 'hand' (default, mitten with thumb) | 'gripper' (two prongs); o.armR / o.armL / o.walk as in du; o.light ±1, o.dir ±1,
//   o.rim (rim light colour), o.body, o.seam (panel lines, default rim at .35), o.cup, o.alpha. Returns the hands {R, L}.
const RPOSE = { stand: {}, reach: { armR: [2.42, 2.5] }, lift: { armR: [2.9, 3.05], armL: [-2.9, -3.05] }, point: { armR: [1.62, 1.62] } };
function robotPath(o) {
  const pr = RPOSE[o.pose] || {}, armR = o.armR || pr.armR || [.1, .05], armL = o.armL || pr.armL || [-.1, -.05];
  const ph = o.walk, a1 = ph == null ? 0 : .32 * Math.sin(ph), kA = ph == null ? 0 : Math.max(0, Math.sin(ph + 1.7)) * .5, kB = ph == null ? 0 : Math.max(0, Math.sin(ph + 1.7 + Math.PI)) * .5;
  const U = (q, r) => q.op(r, PathOp.Union);
  let p = new Path2D(); p.ellipse(0, -.945, .08, .072, 0, 0, Math.PI * 2);                          // helmet dome
  const chin = new Path2D(); chin.roundRect(-.066, -.95, .132, .075, [0, 0, .035, .035]); p = U(p, chin);
  const neck = new Path2D(); neck.rect(-.032, -.885, .064, .045); p = U(p, neck);
  const ch = new Path2D(); ch.moveTo(-.06, -.86); ch.bezierCurveTo(-.12, -.86, -.17, -.85, -.178, -.8); ch.bezierCurveTo(-.185, -.74, -.15, -.68, -.1, -.63);
  ch.lineTo(-.08, -.6); ch.lineTo(.08, -.6); ch.lineTo(.1, -.63); ch.bezierCurveTo(.15, -.68, .185, -.74, .178, -.8); ch.bezierCurveTo(.17, -.85, .12, -.86, .06, -.86); ch.closePath(); p = U(p, ch);
  const ab = new Path2D(); ab.roundRect(-.066, -.615, .132, .08, .02); p = U(p, ab);
  const pel = new Path2D(); pel.roundRect(-.108, -.555, .216, .09, [.02, .02, .045, .045]); p = U(p, pel);
  const J = {}, seams = [];
  for (const s of [-1, 1]) {
    const [s1, s2] = s > 0 ? armR : armL, sh = [s * .175, -.79];
    const el = [sh[0] + Math.sin(s1) * .165, sh[1] + Math.cos(s1) * .165], wr = [el[0] + Math.sin(s2) * .15, el[1] + Math.cos(s2) * .15];
    const pd = new Path2D(); pd.ellipse(sh[0], sh[1] + .005, .058, .052, 0, 0, Math.PI * 2); p = U(p, pd);   // shoulder plate
    p = seg(p, [sh, el], .062);
    p = seg(p, [el, [lerp(el[0], wr[0], .55), lerp(el[1], wr[1], .55)]], .078); p = seg(p, [[lerp(el[0], wr[0], .5), lerp(el[1], wr[1], .5)], wr], .062);   // gauntlet
    let tip;
    if (o.hand === 'gripper') {
      for (const d of [-.42, .42]) { const e = [wr[0] + Math.sin(s2 + d) * .06, wr[1] + Math.cos(s2 + d) * .06], f = [e[0] + Math.sin(s2 - d * .6) * .04, e[1] + Math.cos(s2 - d * .6) * .04]; p = seg(p, [wr, e, f], .022); }
      tip = [wr[0] + Math.sin(s2) * .07, wr[1] + Math.cos(s2) * .07];
    } else {
      tip = [wr[0] + Math.sin(s2) * .06, wr[1] + Math.cos(s2) * .06]; p = seg(p, [wr, tip], .058);
      p = seg(p, [wr, [wr[0] + Math.sin(s2 - .9 * s) * .04, wr[1] + Math.cos(s2 - .9 * s) * .04]], .024);   // thumb
    }
    const hip = [s * .066, -.49], aa = s > 0 ? a1 : -a1, kk = s > 0 ? kA : kB, kn = [hip[0] + Math.sin(aa) * .225, hip[1] + Math.cos(aa) * .225], an = [kn[0] + Math.sin(aa - kk) * .2, kn[1] + Math.cos(aa - kk) * .2];
    p = seg(p, [hip, kn], .084); p = seg(p, [kn, an], .07);
    const kc = new Path2D(); kc.ellipse(kn[0], kn[1], .044, .048, 0, 0, Math.PI * 2); p = U(p, kc);
    const bt = new Path2D(); bt.roundRect(s > 0 ? an[0] - .036 : an[0] - .074, an[1] - .03, .11, .06, [.03, .03, .012, .012]); p = U(p, bt);
    J[s] = { sh, el, wr, tip, kn };
    seams.push([[el[0] + Math.cos(s1) * .035, el[1] - Math.sin(s1) * .035], [el[0] - Math.cos(s1) * .035, el[1] + Math.sin(s1) * .035]]);
    seams.push([[kn[0] - .04, kn[1] - .03], [kn[0] + .04, kn[1] - .03]]);
  }
  seams.push([[-.072, -.935], [.072, -.935]]);                       // helmet seam
  seams.push([[-.12, -.72], [0, -.69], [.12, -.72]]);                // chest plate
  seams.push([[-.066, -.578], [.066, -.578]]);
  return { p, J, seams };
}
export function robot(ctx, x, y, h, o = {}) {
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, { p, J, seams } = robotPath(o), rim = o.rim || P.blue0, body = o.body || P.ind0;
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h); ctx.globalAlpha = o.alpha ?? 1;
  ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.ellipse(-L * .2, 0, .32, .02, 0, 0, 6.29); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -1, 0, 0, [[0, mixHex(body, rim, .12)], [.5, body], [1, mixHex(body, P.night0, .3)]]); ctx.fill(p);
  const sh = new Path2D(); sh.addPath(p, { a: 1, b: 0, c: 0, d: 1, e: -L * .011, f: .007 });
  ctx.fillStyle = rim; ctx.fill(new Path2D(p).op(sh, PathOp.Difference));   // rim light on the side of the light
  ctx.save(); ctx.clip(p); ctx.strokeStyle = o.seam || rgba(rim, .35); ctx.lineWidth = .007; ctx.lineCap = 'round';
  for (const s of seams) { ctx.beginPath(); ctx.moveTo(...s[0]); for (const q of s.slice(1)) ctx.lineTo(...q); ctx.stroke(); }
  ctx.restore();
  if (o.joint) { ctx.fillStyle = o.joint; for (const s of [-1, 1]) for (const [k, r] of [['sh', .02], ['el', .016], ['kn', .018]]) { ctx.beginPath(); ctx.arc(J[s][k][0], J[s][k][1], r, 0, 6.29); ctx.fill(); } }
  const hands = {};
  for (const s of [-1, 1]) { const [u, v] = J[s].tip; hands[s > 0 ? 'R' : 'L'] = [x + h * dir * u, y + h * v]; }
  if (o.cup) { const [u, v] = J[o.cup === 'L' ? -1 : 1].tip; ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(u - .03, v - .07); ctx.lineTo(u + .03, v - .07); ctx.lineTo(u + .024, v - .012); ctx.lineTo(u - .024, v - .012); ctx.closePath(); ctx.fill(); }
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
  const id = ctx.getImageData(0, 0, W, H), d = id.data, N = GRAIN[Math.floor(t * (o.grainHz ?? 10) + 1e-6) % GRAIN.length];   // Film 13: 10 Hz = every 3rd frame (even cadence, calmer than 12 Hz)
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
  glowFill(ctx, path, R * 1.4, .5 * a, P.blue0);      // wide saturated blue
  glowFill(ctx, path, R * .5, .95 * a, P.blue0);
  glowFill(ctx, path, R * .09, .6 * a, P.halo0);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rad(ctx, cx, kind === 'disc' || kind === 'ring' ? cy : y + h * .62, R * (kind === 'disc' || kind === 'ring' ? 1 : 1.25),
    [[0, P.core0], [.14, P.core0], [.3, P.core1], [.55, P.halo0], [.84, P.halo0], [1, P.halo1]]);
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
// EXPLAINERS IN THE SAME LOOK (60–70 % of the film): every mark is a LIGHT SHAPE drawn like the scene light forms:
// saturated blue aura, warm rim, gold gradient body with a white-gold core, a soft darker inner edge (volume), stipple dust.
// Warm (lit 1) = human / learned / good · cool (lit 0) = machine / not yet / cost. Numbers in cream. Each takes u 0..1
// (how far it has grown) so the voice can drive it; nothing pops: things grow, fill with light or are drawn by a trail.
// =====================================================================================================================
const COOL = mixHex(P.blue2, P.cream, .35);
// the core primitive: fill any Path2D with light. o { lit 0..1, a, dust (count, 0 = none), seed, glow (aura scale), flat (no core) }
export function lightShape(ctx, path, t, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 1); if (a <= 0) return;
  const [x0, y0, x1, y1] = path.getBounds(), w = x1 - x0, h = y1 - y0, R = Math.max(w, h, 8), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, g = o.glow ?? 1;
  glowFill(ctx, path, R * .45 * g, .8 * a, P.blue0);
  glowFill(ctx, path, R * .07 * g + 2, (.25 + .4 * lit) * a, lit > .5 ? P.halo0 : P.blue2);
  ctx.save(); ctx.globalAlpha = a;
  const warm = [[0, P.core0], [.18, P.core1], [.45, P.halo0], [.85, P.halo1], [1, mixHex(P.halo1, P.shade0, .45)]];
  const cool = [[0, P.cream], [.3, COOL], [1, mixHex(P.blue2, P.blue0, .4)]];
  ctx.fillStyle = rad(ctx, cx + (o.cx ?? 0) * w, cy + (o.cy ?? -.15) * h, R * .75, lit > .5 ? warm : cool); ctx.fill(path);
  if (lit > .02 && lit < .98) { ctx.globalAlpha = a * (lit > .5 ? 1 - lit : lit); ctx.fillStyle = rad(ctx, cx, cy, R * .75, lit > .5 ? cool : warm); ctx.fill(path); }
  ctx.globalAlpha = a; ctx.clip(path); ctx.filter = `blur(${R * .04 + 1}px)`; ctx.strokeStyle = rgba(lit > .5 ? P.shade0 : P.ind0, .45); ctx.lineWidth = R * .06 + 2; ctx.stroke(path);
  ctx.restore();
  if ((o.dust ?? 1) && lit > .3) dust(ctx, o.seed ?? 5, o.dust > 1 ? o.dust : Math.min(2500, Math.round(R * 6)), cx, cy, w * .55 + 6, h * .55 + 6, t, .8 * a * lit, P.halo0);
}
// light that rises inside a shape (fill level u from the bottom): cool outline + warm fill. For icons, battery, glass, bars.
export function fillWithLight(ctx, path, u, t, o = {}) {
  const [x0, y0, x1, y1] = path.getBounds();
  lightShape(ctx, path, t, { ...o, lit: 0, a: (o.a ?? 1) * .55, dust: 0 });
  if (u <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 999, lerp(y1, y0, clamp(u)), x1 - x0 + 1998, (y1 - y0) * clamp(u) + 999); ctx.clip();
  lightShape(ctx, path, t, { ...o, lit: 1 }); ctx.restore();
  const yy = lerp(y1, y0, clamp(u)); if (u < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, yy - 6, 0, yy + 6, [[0, rgba(P.core0, 0)], [.5, rgba(P.core0, .9)], [1, rgba(P.core0, 0)]]); ctx.save(); ctx.clip(path); ctx.fillRect(x0, yy - 6, x1 - x0, 12); ctx.restore(); ctx.restore(); }
}

// ---------- icon set from light: house, factory, magnet, battery, hand, coin, tool (+ robot, person, cup) ----------
// icon(ctx, name, x, y, size, t, { lit, u (fill level; omit = full), a, level (battery) }) · (x,y) = centre, size = height
const ICON = new Map();
function iconPath(name, o = {}) {
  const key = name + (o.level ?? ''); if (ICON.has(key)) return ICON.get(key);
  const U = (a, b) => a.op(b, PathOp.Union), D = (a, b) => a.op(b, PathOp.Difference);
  let p = new Path2D();
  if (name === 'house') { p.moveTo(-.5, -.02); p.lineTo(0, -.5); p.lineTo(.5, -.02); p.lineTo(.4, -.02); p.lineTo(.4, .46); p.lineTo(-.4, .46); p.lineTo(-.4, -.02); p.closePath(); const d = new Path2D(); d.roundRect(-.1, .14, .2, .32, [.1, .1, 0, 0]); const w = new Path2D(); w.rect(.14, .04, .14, .14); p = D(D(p, d), w); }
  else if (name === 'factory') { p.moveTo(-.5, .46); p.lineTo(-.5, -.05); p.lineTo(-.2, -.25); p.lineTo(-.2, -.05); p.lineTo(.1, -.25); p.lineTo(.1, -.05); p.lineTo(.5, -.3); p.lineTo(.5, .46); p.closePath(); const ch = new Path2D(); ch.rect(.3, -.5, .12, .3); p = U(p, ch); for (const xx of [-.33, -.05, .23]) { const w = new Path2D(); w.rect(xx, .1, .14, .14); p = D(p, w); } }
  else if (name === 'magnet') { const a = new Path2D(); a.arc(0, -.05, .32, Math.PI, 0); a.lineTo(.32, .4); a.moveTo(-.32, .4); a.lineTo(-.32, -.05); p = a.stroke({ width: .26, cap: 0, join: 1 }); }
  else if (name === 'battery') { p.roundRect(-.26, -.42, .52, .9, .08); const tm = new Path2D(); tm.roundRect(-.1, -.5, .2, .1, .03); p = U(p, tm); const inner = new Path2D(); inner.roundRect(-.18, -.34, .36, .74, .04); p = D(p, inner); const lv = clamp(o.level ?? 1); if (lv > 0) { const f = new Path2D(); f.roundRect(-.14, .36 - .66 * lv, .28, .66 * lv, .03); p = U(p, f); } }
  else if (name === 'hand') { const m = handMatrix(0, .5, -Math.PI / 2, .34, 1); p = new Path2D(); const hp = new Path2D(); hp.addPath(handPath({ pose: 'open' }), m); const clipR = new Path2D(); clipR.rect(-.7, -.6, 1.4, 1.1); p = hp.op(clipR, PathOp.Intersect); }
  else if (name === 'coin') { p.arc(0, 0, .46, 0, Math.PI * 2); const r = new Path2D(); r.arc(0, 0, .36, 0, Math.PI * 2); const r2 = new Path2D(); r2.arc(0, 0, .3, 0, Math.PI * 2); p = U(D(p, r), r2); const s = new Path2D(); s.rect(-.04, -.2, .08, .4); p = D(p, s); }
  else if (name === 'tool') { const h = new Path2D(); h.moveTo(-.32, .4); h.lineTo(.12, -.06); p = h.stroke({ width: .16, cap: 1, join: 1 }); const hd = new Path2D(); hd.arc(.2, -.2, .22, 0, Math.PI * 2); p = U(p, hd); const sl = new Path2D(); sl.moveTo(.2, -.2); sl.lineTo(.5, -.5); p = D(p, sl.stroke({ width: .16, cap: 0, join: 0 })); const ho = new Path2D(); ho.arc(.2, -.2, .08, 0, Math.PI * 2); p = D(p, ho); }
  else if (name === 'cup') { p.moveTo(-.3, -.36); p.lineTo(.3, -.36); p.lineTo(.24, .42); p.lineTo(-.24, .42); p.closePath(); const hdl = new Path2D(); hdl.arc(.32, 0, .16, -Math.PI / 2, Math.PI / 2); p = U(p, hdl.stroke({ width: .08, cap: 1, join: 1 })); }
  else if (name === 'robot') { const r = robotPath({}); p = new Path2D(); p.addPath(r.p, { a: 1, b: 0, c: 0, d: 1, e: 0, f: .5 }); }
  else if (name === 'person') { p.arc(0, -.36, .13, 0, Math.PI * 2); const b = new Path2D(); b.moveTo(-.12, -.2); b.bezierCurveTo(-.22, -.18, -.26, 0, -.3, .46); b.lineTo(.3, .46); b.bezierCurveTo(.26, 0, .22, -.18, .12, -.2); b.closePath(); p = U(p, b); }
  else p.arc(0, 0, .45, 0, Math.PI * 2);
  ICON.set(key, p); return p;
}
export const ICONS = ['house', 'factory', 'magnet', 'battery', 'hand', 'coin', 'tool', 'cup', 'robot', 'person'];
export function icon(ctx, name, x, y, size, t, o = {}) {
  const p = new Path2D(); p.addPath(iconPath(name, o), { a: size, b: 0, c: 0, d: size, e: x, f: y });
  if (o.u == null) lightShape(ctx, p, t, o); else fillWithLight(ctx, p, o.u, t, o);
  if (o.label) glowText(ctx, o.label, x, y + size * .5 + 44, { size: o.labelSize ?? TYPE.small, align: 'center', glow: false, col: P.halo2, a: o.labelA ?? 1 });
  return p;
}

// ---------- counter: a number running from → to, cream with a warm glow, label underneath ----------
export function counter(ctx, t, o) {
  const v = lerp(o.from ?? 0, o.to, expoOut(o.u ?? 1)), s = o.fmt ? o.fmt(v) : Math.round(v).toLocaleString('en-US'), size = o.size ?? TYPE.hero;
  halo(ctx, o.x, o.y - size * .35, size * 2.2, .18 * (o.u ?? 1), P.blue0, P.blue0);
  glowText(ctx, (o.pre || '') + s + (o.post || ''), o.x, o.y, { size, align: o.align ?? 'center', serif: o.serif ?? true });
  if (o.label) glowText(ctx, o.label.toUpperCase(), o.x, o.y + size * .42, { size: TYPE.label, align: o.align ?? 'center', spacing: .2, glow: false, col: P.halo2, a: smooth(span(o.u ?? 1, .4, 1)) });
}
// ---------- bars of light rising from a line of light. o { x, y (baseline), w, h, values, max, lit[], labels[], top[] (value texts), u, gap } ----------
export function bars(ctx, t, o) {
  const n = o.values.length, gap = o.gap ?? .45, bw = o.w / (n + (n - 1) * gap), max = o.max ?? Math.max(...o.values);
  trail(ctx, [[o.x - 30, o.y, 2], [o.x + o.w + 30, o.y, 2]], expoOut(span(o.u ?? 1, 0, .3)), { spark: false, a: .8 });
  o.values.forEach((v, i) => {
    const k = expoOut(span(o.u ?? 1, .1 + i * .6 / n, .1 + i * .6 / n + .5)), bh = Math.max(1, o.h * v / max * k), x = o.x + i * bw * (1 + gap);
    if (k <= 0) return;
    const p = new Path2D(); p.roundRect(x, o.y - bh, bw, bh, [Math.min(bw * .5, bh) * .5, Math.min(bw * .5, bh) * .5, 0, 0]);
    lightShape(ctx, p, t, { lit: o.lit ? o.lit[i] : 1, seed: 11 + i, cy: -.4 });
    if (o.top?.[i] && k > .6) glowText(ctx, o.top[i], x + bw / 2, o.y - bh - 22, { size: TYPE.label, align: 'center', a: smooth(span(k, .6, 1)) });
    if (o.labels?.[i]) glowText(ctx, o.labels[i], x + bw / 2, o.y + 48, { size: TYPE.small, align: 'center', glow: false, col: P.halo2, a: smooth(span(k, .2, .8)) });
  });
}
// ---------- curve of light with a pool of light under it. o { rect, data, xr, yr, u, dashFrom, xTicks, yTicks, area (true), w } ----------
export function curve(ctx, t, o) {
  const [x, y, w, h] = o.rect, [xa, xb] = o.xr, [ya, yb] = o.yr, map = (p) => [x + (p[0] - xa) / (xb - xa) * w, y + h - (p[1] - ya) / (yb - ya) * h];
  ctx.save(); ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke(); ctx.restore();
  for (const [v, s] of o.xTicks || []) glowText(ctx, s, map([v, ya])[0], y + h + 44, { size: TYPE.small, align: 'center', glow: false, col: P.halo2 });
  for (const [v, s] of o.yTicks || []) glowText(ctx, s, x - 18, map([xa, v])[1] + 10, { size: TYPE.small, align: 'right', glow: false, col: P.halo2 });
  const pts = catmull(o.data.map((p) => [...map(p), o.w ?? 4]), 12), u = o.u ?? 1;
  const cut = o.dashFrom != null ? clamp((map([o.dashFrom, ya])[0] - x) / w) : 1, iu = Math.max(1, Math.floor(Math.min(u, cut) * (pts.length - 1)));
  if (o.area !== false && iu > 1) {   // light pooling under the drawn part
    const a = new Path2D(); a.moveTo(pts[0][0], y + h); for (let i = 0; i <= iu; i++) a.lineTo(pts[i][0], pts[i][1]); a.lineTo(pts[iu][0], y + h); a.closePath();
    ctx.save(); ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, rgba(P.halo0, .55)], [.5, rgba(P.halo1, .22)], [1, rgba(P.blue0, .08)]]); ctx.fill(a); ctx.restore();
    dust(ctx, 23, 1800, (pts[0][0] + pts[iu][0]) / 2, y + h * .8, (pts[iu][0] - pts[0][0]) * .45, h * .3, t, .6, P.halo0);
  }
  const head = trail(ctx, pts, Math.min(u, cut), { w: o.w ?? 4, spark: u < cut });
  if (u > cut) {   // forecast: dotted light
    const i0 = Math.floor(cut * (pts.length - 1)), i1 = Math.floor(u * (pts.length - 1));
    ctx.save(); ctx.setLineDash([2, 14]); ctx.lineCap = 'round'; ctx.strokeStyle = P.halo0; ctx.lineWidth = (o.w ?? 4) * 1.4; ctx.beginPath();
    for (let i = i0; i <= i1; i++) (i === i0 ? ctx.moveTo(pts[i][0], pts[i][1]) : ctx.lineTo(pts[i][0], pts[i][1])); ctx.stroke(); ctx.restore();
    halo(ctx, pts[i1][0], pts[i1][1], 40, .6);
  }
  return { head, map };
}
// ---------- share ring: a ring of light, shares fill with warm light. o { x, y, r, parts [{v, lit, label}], u, center, centerSub } ----------
export function pie(ctx, t, o) {
  const tot = o.parts.reduce((s, p) => s + p.v, 0), u = o.u ?? 1, w = o.r * .26;
  const base = new Path2D(); base.arc(o.x, o.y, o.r, 0, 6.29); lightShape(ctx, base.stroke({ width: w * .35, cap: 0, join: 1 }), t, { lit: 0, a: .35, dust: 0 });
  let a0 = o.start ?? -Math.PI / 2;
  o.parts.forEach((p, i) => {
    const a1 = a0 + p.v / tot * 6.283 * expoOut(u); if (a1 - a0 < .01) { a0 = a1; return; }
    const arc = new Path2D(); arc.arc(o.x, o.y, o.r, a0 + .02, a1 - .02); lightShape(ctx, arc.stroke({ width: w, cap: 0, join: 1 }), t, { lit: p.lit ?? 1, seed: 31 + i });
    if (p.label && u > .8) { const am = (a0 + a1) / 2; glowText(ctx, p.label, o.x + Math.cos(am) * (o.r + w * 1.4), o.y + Math.sin(am) * (o.r + w * 1.4) + 10, { size: TYPE.small, align: Math.cos(am) > .2 ? 'left' : Math.cos(am) < -.2 ? 'right' : 'center', glow: false, col: P.halo2 }); }
    a0 = a1;
  });
  if (o.center) glowText(ctx, o.center, o.x, o.y + o.r * .18, { size: o.r * .55, align: 'center', serif: true, a: smooth(span(u, .5, 1)) });
  if (o.centerSub) glowText(ctx, o.centerSub.toUpperCase(), o.x, o.y + o.r * .45, { size: TYPE.small, align: 'center', glow: false, col: P.halo2, spacing: .15, a: smooth(span(u, .6, 1)) });
}
// ---------- cross-section: stacked layers of a thing. o { x, y, w, layers [{h, label, lit}], u } ----------
export function section(ctx, t, o) {
  let yy = o.y; const n = o.layers.length;
  o.layers.forEach((L, i) => {
    const k = expoOut(span(o.u ?? 1, i / (n + 1), (i + 2) / (n + 1))), lh = L.h * k;
    if (lh > 4) { const p = new Path2D(); p.roundRect(o.x, yy, o.w, lh - 8, 10); lightShape(ctx, p, t, { lit: L.lit ? 1 : 0, seed: 51 + i, dust: L.lit ? 1 : 0 }); }
    if (L.label && k > .6) { trail(ctx, [[o.x + o.w + 10, yy + lh / 2 - 4, 1.5], [o.x + o.w + 48, yy + lh / 2 - 4, 1.5]], 1, { spark: false, a: .7 }); glowText(ctx, L.label, o.x + o.w + 62, yy + lh / 2 + 6, { size: TYPE.small, glow: false, col: P.halo2, a: smooth(span(k, .6, 1)) }); }
    yy += lh;
  });
}
// ---------- map of light: dots warm when lit, joined by a trail. o { pts [[x,y,lit]], route [[x,y]], u, size, w } ----------
export function lightMap(ctx, t, o) {
  const s = o.size ?? 2.2;
  for (const [x, y, l] of o.pts) { if (l > .5) halo(ctx, x, y, s * 10, .4 * l, P.halo1, P.halo0); ctx.fillStyle = l > .5 ? P.core1 : COOL; ctx.globalAlpha = l > .5 ? 1 : .7; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
  ctx.globalAlpha = 1;
  if (o.route) return trail(ctx, catmull(o.route.map((p) => [p[0], p[1], o.w ?? 3]), 10), o.u ?? 1, { w: o.w ?? 3 });
  return null;
}
// ---------- timeline: a line of light, events ignite as the head passes. o { x, y, w, events [{at 0..1, label, sub, lit, icon}], u } ----------
export function timeline(ctx, t, o) {
  const u = o.u ?? 1, head = trail(ctx, [[o.x, o.y, 3], [o.x + o.w, o.y, 3]], u, { w: 3, spark: u < 1 });
  ctx.save(); ctx.setLineDash([2, 12]); ctx.strokeStyle = rgba(COOL, .35); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(o.x + o.w * u, o.y); ctx.lineTo(o.x + o.w, o.y); ctx.stroke(); ctx.restore();
  o.events.forEach((e, i) => {
    const ex = o.x + o.w * e.at, k = smooth(span(u, e.at - .005, e.at + .06)), up = i % 2 === 0 ? -1 : 1, r = 13;
    const d = new Path2D(); d.arc(ex, o.y, r * (.6 + .4 * k), 0, 6.29); lightShape(ctx, d, t, { lit: k > .5 ? (e.lit ?? 1) : 0, a: .5 + .5 * k, dust: 0 });
    if (k > 0) {
      trail(ctx, [[ex, o.y + up * 18, 1.5], [ex, o.y + up * 58, 1.5]], k, { spark: false, a: .7 });
      if (e.icon) icon(ctx, e.icon, ex, o.y + up * 120, 80, t, { lit: e.lit ?? 1, a: k });
      if (e.label) glowText(ctx, e.label, ex, o.y + up * (e.icon ? 200 : 96) + (up > 0 ? 30 : 0), { size: TYPE.label, align: 'center', a: k });
      if (e.sub) glowText(ctx, e.sub, ex, o.y + up * (e.icon ? 200 : 96) + (up > 0 ? 66 : 36), { size: TYPE.small, align: 'center', glow: false, col: P.halo2, a: k });
    }
  });
  return head;
}
// ---------- flow: nodes joined by arrows of light; a node lights when its arrow arrives. o { nodes [{x,y,icon,label,lit,size}], u, bend } ----------
export function flow(ctx, t, o) {
  const n = o.nodes.length, u = o.u ?? 1;
  o.nodes.forEach((nd, i) => {
    const ki = i === 0 ? smooth(span(u, 0, .08)) : smooth(span(u, (i - .15) / (n - .8), (i + .05) / (n - .8)));
    icon(ctx, nd.icon || 'coin', nd.x, nd.y, nd.size ?? 120, t, { lit: ki > .5 ? (nd.lit ?? 1) : 0, a: .45 + .55 * ki, label: nd.label, labelA: .4 + .6 * ki, seed: 61 + i });
    if (i < n - 1) {
      const b = o.nodes[i + 1], sz = (nd.size ?? 120) * .62, d = Math.hypot(b.x - nd.x, b.y - nd.y), ux = (b.x - nd.x) / d, uy = (b.y - nd.y) / d, bend = o.bend ?? -.18;
      const p0 = [nd.x + ux * sz, nd.y + uy * sz], p1 = [b.x - ux * sz, b.y - uy * sz], mid = [(p0[0] + p1[0]) / 2 - uy * d * bend, (p0[1] + p1[1]) / 2 + ux * d * bend];
      const pts = catmull([[...p0, 3], [...mid, 3], [...p1, 3]], 16), ka = smooth(span(u, (i + .05) / (n - .8), (i + .85) / (n - .8)));
      trail(ctx, pts, ka, { w: 3 });
      if (ka >= 1) {   // arrow head: a small chevron of light
        const [ax, ay] = p1, q = pts[pts.length - 3], an = Math.atan2(ay - q[1], ax - q[0]);
        const ch = new Path2D(); ch.moveTo(ax - Math.cos(an - .5) * 22, ay - Math.sin(an - .5) * 22); ch.lineTo(ax, ay); ch.lineTo(ax - Math.cos(an + .5) * 22, ay - Math.sin(an + .5) * 22);
        lightShape(ctx, ch.stroke({ width: 5, cap: 1, join: 1 }), t, { dust: 0 });
      }
    }
  });
}
// ---------- compare: two light halves (warm vs cool) of one disc, values + labels under each. ----------
// o { x, y, r, left {label, value, sub, lit}, right {…}, u (split opens 0..1), vertical (split top/bottom) }
export function compare(ctx, t, o) {
  const u = o.u ?? 1, gap = 18 * expoOut(u), r = o.r;
  for (const [side, d] of [[o.left, -1], [o.right, 1]]) {
    const p = new Path2D(); p.arc(o.x + d * gap, o.y, r, d < 0 ? Math.PI / 2 : -Math.PI / 2, d < 0 ? Math.PI * 1.5 : Math.PI / 2); p.closePath();
    lightShape(ctx, p, t, { lit: side.lit ?? (d < 0 ? 1 : 0), cx: d * -.2, seed: d < 0 ? 71 : 72, dust: (side.lit ?? (d < 0 ? 1 : 0)) > .5 ? 1 : 0 });
    const tx = o.x + d * (gap + 34), al = d < 0 ? 'right' : 'left', k = smooth(span(u, .3, 1));
    if (side.value) glowText(ctx, side.value, tx, o.y + r + 110, { size: TYPE.num * .8, align: al, serif: true, a: k });
    if (side.label) glowText(ctx, side.label.toUpperCase(), tx, o.y + r + 160, { size: TYPE.small, align: al, glow: false, spacing: .15, col: P.halo2, a: k });
  }
  halo(ctx, o.x, o.y, r * .5, .5 * u, P.blue0, P.core1);   // light leaking through the split
}
