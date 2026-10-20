// C06 (Film 4 v2) · shared kit for the slump and the turn (owner c06).
//   once / toImg / best / ready   cached layers handed to the renderer as Images (copied from lib/sc01_m1_open.mjs: the napi leak)
//   ease helpers, keyed curves (mono: monotone cubic through keys, path3: a smooth 3-D camera path through timed keys)
//   pinhole camera for the rooms: world in cm, y DOWN, the camera looks along +Z (no rotation): pr, plane, poly3
//   flick(t, k, ph)               the screen flicker of the hill (same formula as lib/maslow4.mjs, so the TV and the window agree)
//   props: wineGlass, bottle, remote, wallClock (engraved, readable at a glance)
//   youBack(ctx, x, y, s, o)      you seen from behind, seated (sofa): adapted from Film 5's backFig (lib/sc07_rain.mjs on its branch)
import { Image, Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, sm, eio, prng, canvas } from '../engine.mjs';

export const TAU = Math.PI * 2;
// ---------------------------------------------------------------- cached layers (napi-rs: draw Images, not Canvases)
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map(); export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };

// ---------------------------------------------------------------- easing and keyed curves
export const ss = (a, b, x) => sm(clamp((x - a) / (b - a)));                 // smoothstep window a→b
export const E = (t0, d, t) => sm(clamp((t - t0) / d));                        // ease starting at t0 over d
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
export const s5 = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };   // smootherstep
export const hash = (i, j = 0) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };
// monotone cubic (Fritsch–Carlson) through [[t, v], …]: no overshoot, flat at local extrema; clamps outside
export function mono(keys) {
  const n = keys.length, xs = keys.map((k) => k[0]), ys = keys.map((k) => k[1]), d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (3 * (xs[i + 1] - xs[i - 1])) / ((2 * xs[i + 1] - xs[i] - xs[i - 1]) / d[i - 1] + (xs[i + 1] + xs[i] - 2 * xs[i - 1]) / d[i]);
  if (keys.flat0) { m[0] = 0; m[n - 1] = 0; }
  const f = (x) => {
    if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], u = (x - xs[i]) / h, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * ys[i] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * ys[i + 1] + (u3 - u2) * h * m[i + 1];
  };
  return f;
}
// a 3-D path through timed keys [[t, x, y, z], …]: each axis a monotone cubic (eases where an axis turns, glides where it continues)
export function path3(keys) { const fx = mono(keys.map((k) => [k[0], k[1]])), fy = mono(keys.map((k) => [k[0], k[2]])), fz = mono(keys.map((k) => [k[0], k[3]])); return (t) => [fx(t), fy(t), fz(t)]; }

// ---------------------------------------------------------------- colour
const P3 = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const HX = new Map(); const rgb3 = (h) => { let v = HX.get(h); if (!v) HX.set(h, v = P3(h)); return v; };
export const mixC = (a, b, u) => { const A = rgb3(a), B = rgb3(b); u = clamp(u); return `rgb(${Math.round(mix(A[0], B[0], u))},${Math.round(mix(A[1], B[1], u))},${Math.round(mix(A[2], B[2], u))})`; };
export const mixH = (a, b, u) => { const A = rgb3(a), B = rgb3(b); u = clamp(u); return '#' + [0, 1, 2].map((i) => Math.round(mix(A[i], B[i], u)).toString(16).padStart(2, '0')).join(''); };
export const shadeH = (h, d) => { const A = rgb3(h); return '#' + A.map((v) => Math.round(clamp(v * (1 + d), 0, 255)).toString(16).padStart(2, '0')).join(''); };
// the hill's screen flicker (lib/maslow4.mjs, base windows when st.screens): the TV in your room flickers in the same rhythm as your window
// the screens' flicker, copied from lib/maslow4.mjs (winState, 2026-10-20): one window (its k, ph) or, with sync = 1, the town's common
// rhythm. Every screen in c06 uses it (your TV = your window's flicker; after "numb" everything falls into syncF, the city too).
const hsh = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const nz = (x) => { const i = Math.floor(x), f = x - i; return mix(hsh(i), hsh(i + 1), f * f * (3 - 2 * f)) * 2 - 1; };
export function screenF(t, k = 0, ph = 0, sync = 1) { const rate = mix(.9 + 1.6 * k, 1.3, sync), p = mix(ph * 5, 0, sync); return .62 + .38 * (.5 + .5 * nz(t * rate + p)) + .04 * nz(t * 6.1 + p * 3); }
export const syncF = (t) => screenF(t, 0, 0, 1);
export const flick = (t, k = .42, ph = 3.378) => .65 + .35 * Math.sin(t * (5 + k * 7) + ph) * Math.sin(t * 2.3 + ph * 2);
export const SCREEN = '#8fe6ff', SCREEN_HOT = '#d8f7ff', SCREEN_DIM = '#5fb8d8', AMBER = '#ffb35c', CREAM = '#f3efe2', OCHRE = '#c8843a';

// ---------------------------------------------------------------- pinhole camera for the rooms (cm, y down, looking along +Z)
//   c = { x, y, z, F, ox, oy }   pr(c, X, Y, Z) → [sx, sy, k (px per cm at that depth), d]   (ox, oy: lens shift in px = a small pan)
export const pr = (c, X, Y, Z) => { const d = Z - c.z, k = c.F / d; return [W / 2 + (c.ox || 0) + (X - c.x) * k, H / 2 + (c.oy || 0) + (Y - c.y) * k, k, d]; };
// set the transform so that drawing in world cm at depth Z lands on screen (a plane parallel to the image)
export function plane(ctx, c, Z) { const k = c.F / (Z - c.z); ctx.setTransform(k, 0, 0, k, W / 2 + (c.ox || 0) - c.x * k, H / 2 + (c.oy || 0) - c.y * k); return k; }
// a 3-D polygon as a path (screen space, identity transform), clipped against the near plane; false if nothing is left
export function poly3(ctx, c, pts, near = 3, add = false) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); const zn = c.z + near, out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[2] >= zn, ib = b[2] >= zn;
    if (ia) out.push(a);
    if (ia !== ib) { const u = (zn - a[2]) / (b[2] - a[2]); out.push([mix(a[0], b[0], u), mix(a[1], b[1], u), zn]); }
  }
  if (!add) ctx.beginPath();
  if (out.length < 3) return false;
  out.forEach((p, i) => { const q = pr(c, p[0], p[1], p[2]); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
  ctx.closePath(); return true;
}
// a 3-D line segment clipped at the near plane → screen points or null
export function seg3(c, a, b, near = 3) {
  const zn = c.z + near; if (a[2] < zn && b[2] < zn) return null;
  if (a[2] < zn) { const u = (zn - a[2]) / (b[2] - a[2]); a = [mix(a[0], b[0], u), mix(a[1], b[1], u), zn]; }
  if (b[2] < zn) { const u = (zn - b[2]) / (a[2] - b[2]); b = [mix(b[0], a[0], u), mix(b[1], a[1], u), zn]; }
  const p = pr(c, a[0], a[1], a[2]), q = pr(c, b[0], b[1], b[2]); return [p[0], p[1], q[0], q[1]];
}

// ---------------------------------------------------------------- props (drawn in their own cm units, origin given, current transform)
// an engraved crystal wine glass standing at (x, y = foot bottom), height ~21 cm. o: { level 0..1 (wine), wine '#6e0f23', light {col, a, side},
//   glint (0..1 highlight), tilt (rad, for lifting), rim cyan/amber }
export function wineGlass(ctx, x, y, o = {}) {
  const lv = clamp(o.level ?? 0), side = o.side ?? 1, L = o.light || { col: '#ffe6c0', a: .8 }, ink = 'rgba(8,10,22,.75)';
  ctx.save(); ctx.translate(x, y); if (o.tilt) ctx.rotate(o.tilt);
  const bowl = (g) => { g.beginPath(); g.moveTo(-4.4, -21); g.bezierCurveTo(-4.6, -16, -4.4, -12.2, -2.2, -10.6); g.quadraticCurveTo(-.6, -9.9, 0, -9.8); g.quadraticCurveTo(.6, -9.9, 2.2, -10.6); g.bezierCurveTo(4.4, -12.2, 4.6, -16, 4.4, -21); g.closePath(); };
  // the wine: an ellipse surface + the body under it, clipped to the bowl
  if (lv > .01) {
    const top = mix(-10.4, -17.6, lv);
    ctx.save(); bowl(ctx); ctx.clip();
    const wg = ctx.createLinearGradient(-4.5, 0, 4.5, 0); wg.addColorStop(0, shadeH(o.wine || '#6e0f23', -.35)); wg.addColorStop(.5 + .25 * side, o.wine || '#6e0f23'); wg.addColorStop(1, shadeH(o.wine || '#6e0f23', -.2));
    ctx.fillStyle = wg; ctx.fillRect(-6, top, 12, 14);
    const hw = 4.4 * Math.min(1, .52 + .62 * lv); ctx.fillStyle = rgba('#e0566e', .55); ctx.beginPath(); ctx.ellipse(0, top, hw, .55, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(L.col, .5 * L.a); ctx.lineWidth = .18; ctx.beginPath(); ctx.ellipse(0, top, hw, .55, 0, Math.PI * (side > 0 ? 1.55 : .95), Math.PI * (side > 0 ? 2.05 : 1.45)); ctx.stroke();
    ctx.restore();
  }
  // glass body: faint fill, engraved cut lines (facets), the rim ellipse
  ctx.fillStyle = 'rgba(200,220,240,.07)'; bowl(ctx); ctx.fill();
  ctx.save(); bowl(ctx); ctx.clip(); ctx.strokeStyle = 'rgba(220,235,255,.16)'; ctx.lineWidth = .16;
  for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 1.3, -21); ctx.quadraticCurveTo(i * 1.45, -14, i * .5, -10.2); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = rgba(L.col, .55 * L.a); ctx.lineWidth = .26; bowl(ctx); ctx.stroke();
  ctx.strokeStyle = rgba('#e8f2ff', .45); ctx.lineWidth = .22; ctx.beginPath(); ctx.ellipse(0, -21, 4.4, .7, 0, 0, TAU); ctx.stroke();
  // stem and foot
  ctx.fillStyle = 'rgba(210,228,246,.28)'; ctx.fillRect(-.35, -9.9, .7, 9.2);
  ctx.strokeStyle = rgba(L.col, .5 * L.a); ctx.lineWidth = .16; ctx.beginPath(); ctx.moveTo(side * .35, -9.8); ctx.lineTo(side * .35, -.8); ctx.stroke();
  ctx.fillStyle = 'rgba(210,228,246,.22)'; ctx.beginPath(); ctx.ellipse(0, -.4, 3.6, .65, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(L.col, .45 * L.a); ctx.lineWidth = .18; ctx.stroke();
  // highlights: a long vertical glint on the lit side of the bowl, a dot on the rim
  const gl = o.glint ?? .8; ctx.strokeStyle = rgba('#ffffff', .55 * gl); ctx.lineWidth = .45; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(side * 3.3, -19.6); ctx.quadraticCurveTo(side * 3.6, -15.5, side * 2.4, -12.4); ctx.stroke();
  ctx.fillStyle = rgba('#ffffff', .8 * gl); ctx.beginPath(); ctx.arc(side * 3.2, -20.9, .38, 0, TAU); ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = .12; ctx.beginPath(); ctx.moveTo(-side * 3.9, -19.8); ctx.quadraticCurveTo(-side * 4.1, -14, -side * 2.2, -11); ctx.stroke();
  ctx.restore();
}
// a wine bottle, origin at the neck tip (the mouth), pointing along +x when ang = 0; body ~30 cm. o: { ang, light, label (0..1) }
export function bottle(ctx, x, y, o = {}) {
  const ang = o.ang ?? 0, L = o.light || { col: '#ffe6c0', a: .8 };
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  // outline along -x from the mouth: lip, neck, shoulder, body, punt
  const half = [[0, 1.25], [-.6, 1.35], [-.9, 1.2], [-9, 1.25], [-12.5, 2.2], [-15, 3.6], [-17.5, 3.9], [-44, 3.9], [-44.6, 3.6]];
  ctx.beginPath(); half.forEach(([a, b], i) => (i ? ctx.lineTo(a, -b) : ctx.moveTo(a, -b))); for (let i = half.length - 1; i >= 0; i--) ctx.lineTo(half[i][0], half[i][1]); ctx.closePath();
  const g = ctx.createLinearGradient(0, -4, 0, 4); g.addColorStop(0, '#2c4a36'); g.addColorStop(.3, '#14261b'); g.addColorStop(.75, '#081109'); g.addColorStop(1, '#050806'); ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.clip();
  // the label (blank engraved paper, no brand): cream band with two rules and a tiny vignette
  ctx.fillStyle = '#d9cfb4'; ctx.fillRect(-38, -3.95, 15, 7.9); ctx.strokeStyle = 'rgba(60,40,20,.5)'; ctx.lineWidth = .18; for (const yy of [-2.6, 2.6]) { ctx.beginPath(); ctx.moveTo(-37.4, yy); ctx.lineTo(-23.6, yy); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(-30.5, 0, 2.6, 1.6, 0, 0, TAU); ctx.stroke();
  const lg = ctx.createLinearGradient(0, -4, 0, 4); lg.addColorStop(0, 'rgba(255,255,255,.0)'); lg.addColorStop(.6, 'rgba(0,0,0,.25)'); lg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = lg; ctx.fillRect(-38, -4, 15, 8);
  // capsule (foil) on the neck
  ctx.fillStyle = '#5a1420'; ctx.fillRect(-9.5, -1.6, 9.5, 3.2); ctx.strokeStyle = 'rgba(255,200,180,.25)'; ctx.lineWidth = .2; ctx.beginPath(); ctx.moveTo(-9.3, -1); ctx.lineTo(-.4, -1); ctx.stroke();
  ctx.restore();
  // glints along the top edge (toward the light)
  ctx.strokeStyle = rgba(L.col, .7 * L.a); ctx.lineWidth = .35; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-43, -3.3); ctx.lineTo(-18.5, -3.3); ctx.quadraticCurveTo(-15.4, -3.1, -13, -1.8); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(-42, -2.5); ctx.lineTo(-20, -2.5); ctx.stroke();
  ctx.restore();
}
// the stream of wine from a mouth (x0, y0) falling to (x1, y1) (cm), u 0..1 (how far the front has fallen), thin = 0..1 (ending)
export function wineStream(ctx, x0, y0, x1, y1, u, o = {}) {
  if (u <= 0) return; const thin = clamp(o.thin ?? 0), w = mix(o.w ?? .75, .12, thin), yf = mix(y0, y1, clamp(u)), r = prng(7);
  ctx.save(); ctx.lineCap = 'round';
  const pts = []; for (let i = 0; i <= 16; i++) { const q = i / 16, yy = mix(y0, yf, q), xx = mix(x0, x1, Math.pow(q, .6) * clamp(u * 1.4)) + Math.sin(q * 9 + (o.t ?? 0) * 14) * .06; pts.push([xx, yy]); }
  ctx.strokeStyle = '#4a0716'; ctx.lineWidth = w * 1.5; ctx.beginPath(); pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke();
  ctx.strokeStyle = '#9e1f36'; ctx.lineWidth = w; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,190,200,.55)'; ctx.lineWidth = w * .25; ctx.beginPath(); pts.forEach(([a, b], i) => (i ? ctx.lineTo(a - w * .25, b) : ctx.moveTo(a - w * .25, b))); ctx.stroke();
  ctx.restore();
}
// a TV remote lying flat, seen from above-behind, centre (x, y), length 17 cm along the angle; glow = the TV light on its buttons
export function remote(ctx, x, y, o = {}) {
  const ang = o.ang ?? -.1, sq = o.sq ?? .42, L = o.light || { col: SCREEN, a: .7 };
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(1, sq);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(.6, 2.6, 9.4, 3.4, 0, 0, TAU); ctx.fill();
  const g = ctx.createLinearGradient(0, -3, 0, 3); g.addColorStop(0, '#3a3e4c'); g.addColorStop(1, '#101219'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-8.5, -2.4, 17, 4.8, 2.2); ctx.fill();
  ctx.strokeStyle = rgba(L.col, .6 * L.a); ctx.lineWidth = .3; ctx.beginPath(); ctx.moveTo(-7.8, -2.3); ctx.lineTo(7.4, -2.3); ctx.stroke();
  // buttons: a red power dot, a round pad, rows of small keys
  ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(6.6, -.2, .7, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(200,215,235,.55)'; ctx.lineWidth = .25; ctx.beginPath(); ctx.arc(2.6, 0, 1.6, 0, TAU); ctx.stroke(); ctx.fillStyle = 'rgba(200,215,235,.45)'; ctx.beginPath(); ctx.arc(2.6, 0, .55, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(200,215,235,.4)'; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) ctx.fillRect(-6.8 + i * 1.5, -1.3 + j * 1.15, .9, .55);
  ctx.restore();
}
// a round wall clock at (x, y), radius r (cm); hour 0..24 (fractional), o: { blur (minute hand fan when time races), light, face }
export function wallClock(ctx, x, y, r, hour, o = {}) {
  const L = o.light || { col: '#ffe6c0', a: .5 }, face = o.face || '#e8dfc8', ink = o.ink || '#1f2433';
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.arc(r * .08, r * .1, r * 1.08, 0, TAU); ctx.fill();
  const rg = ctx.createRadialGradient(-r * .3, -r * .3, 0, 0, 0, r * 1.1); rg.addColorStop(0, '#4a3a2a'); rg.addColorStop(1, '#1c140d'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, r * 1.08, 0, TAU); ctx.fill();
  ctx.fillStyle = face; ctx.beginPath(); ctx.arc(0, 0, r * .94, 0, TAU); ctx.fill();
  // engraved ring and ticks (no numerals: ticks read at a glance; 12, 3, 6, 9 heavy)
  ctx.strokeStyle = rgba(ink, .5); ctx.lineWidth = r * .012; ctx.beginPath(); ctx.arc(0, 0, r * .86, 0, TAU); ctx.stroke();
  for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, big = i % 15 === 0, hr = i % 5 === 0, r0 = r * (big ? .66 : hr ? .72 : .8), r1 = r * .86;
    ctx.strokeStyle = rgba(ink, big ? .95 : hr ? .8 : .45); ctx.lineWidth = r * (big ? .07 : hr ? .035 : .012); ctx.beginPath(); ctx.moveTo(Math.sin(a) * r0, -Math.cos(a) * r0); ctx.lineTo(Math.sin(a) * r1, -Math.cos(a) * r1); ctx.stroke(); }
  const hh = ((hour % 12) + 12) % 12, ha = hh / 12 * TAU, ma = (hour % 1) * TAU, blur = clamp(o.blur ?? 0);
  ctx.lineCap = 'round';
  if (blur > .02) { ctx.fillStyle = rgba(ink, .22); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * .78, ma - Math.PI / 2 - blur * 2.6, ma - Math.PI / 2); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = ink; ctx.lineWidth = r * .07; ctx.beginPath(); ctx.moveTo(-Math.sin(ha) * r * .1, Math.cos(ha) * r * .1); ctx.lineTo(Math.sin(ha) * r * .5, -Math.cos(ha) * r * .5); ctx.stroke();
  ctx.lineWidth = r * .045; ctx.globalAlpha = 1 - blur * .6; ctx.beginPath(); ctx.moveTo(-Math.sin(ma) * r * .12, Math.cos(ma) * r * .12); ctx.lineTo(Math.sin(ma) * r * .76, -Math.cos(ma) * r * .76); ctx.stroke(); ctx.globalAlpha = 1;
  ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(0, 0, r * .06, 0, TAU); ctx.fill();
  // glass reflection
  ctx.strokeStyle = rgba(L.col, .35 * L.a); ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(0, 0, r * .82, -2.6, -1.7); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- you, seen from behind, seated (adapted from Film 5's backFig)
// Helpers copied from Film 5 lib/sc07_rain.mjs (branch claude/project-thread-whfhr9): cub, run, sym, cw, trace, line, xf, tube, rimOn.
const cub = (o, a, b, c, d, n = 8) => { for (let i = o.length ? 1 : 0; i <= n; i++) { const u = i / n, v = 1 - u; o.push([v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]); } return o; };
const run = (p0, segs, n = 8, o = [p0]) => { let p = p0; for (const [b, c, d] of segs) { cub(o, p, b, c, d, n); p = d; } return o; };
const sym = (half, dx = 0) => { const o = half.map(([x, y]) => [x + dx, y]); for (let i = half.length - 2; i > 0; i--) o.push([-half[i][0] + dx, half[i][1]]); return o; };
const area = (p) => { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } return a / 2; };
const cw = (p) => (area(p) < 0 ? p.reverse() : p);
const trace = (ctx, p) => { ctx.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]); ctx.closePath(); };
const line = (ctx, p) => { ctx.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]); };
const xf = (p, m) => p.map(([x, y]) => [m[0] + x * m[2] - y * m[3], m[1] + x * m[3] + y * m[2]]);
function tube(nodes, n = 6) {
  const C = [], cr = (a, b, c, d, u) => { const u2 = u * u, u3 = u2 * u; return [0, 1, 2].map((i) => .5 * (2 * b[i] + (-a[i] + c[i]) * u + (2 * a[i] - 5 * b[i] + 4 * c[i] - d[i]) * u2 + (-a[i] + 3 * b[i] - 3 * c[i] + d[i]) * u3)); };
  for (let i = 0; i < nodes.length - 1; i++) { const a = nodes[Math.max(0, i - 1)], b = nodes[i], c = nodes[i + 1], d = nodes[Math.min(nodes.length - 1, i + 2)]; for (let k = i ? 1 : 0; k <= n; k++) C.push(cr(a, b, c, d, k / n)); }
  const Lp = [], Rp = [];
  for (let i = 0; i < C.length; i++) { const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1; Lp.push([C[i][0] - dy / m * C[i][2], C[i][1] + dx / m * C[i][2]]); Rp.push([C[i][0] + dy / m * C[i][2], C[i][1] - dx / m * C[i][2]]); }
  const capAt = (c, from, out) => { const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]); for (let k = 1; k < 7; k++) { const a = a0 - Math.PI * k / 7; out.push([c[0] + Math.cos(a) * c[2], c[1] + Math.sin(a) * c[2]]); } };
  const o = [...Lp]; capAt(C[C.length - 1], Lp[Lp.length - 1], o); for (let i = Rp.length - 1; i >= 0; i--) o.push(Rp[i]); capAt(C[0], Rp[0], o);
  return { pts: cw(o), C };
}
// rim light on a closed outline: edges whose outward normal faces the light (d) or lie near a point light (p, r) get a stroke
function rimOn(ctx, pts, L) {
  if (!L || !(L.a > 0)) return;
  const lv = [[], [], []];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length], dx = q[0] - p[0], dy = q[1] - p[1], m = Math.hypot(dx, dy); if (m < 1e-6) continue;
    const nx = dy / m, ny = -dx / m, my = (p[1] + q[1]) / 2;
    let w = Math.pow(Math.max(0, nx * L.d[0] + ny * L.d[1]), L.pow ?? 1.4);
    if (L.fall) w *= L.fall(my);
    const k = Math.round(w * 3); if (k > 0) lv[k - 1].push(p, q);
  }
  ctx.lineWidth = L.w; ctx.lineCap = 'round';
  for (let k = 0; k < 3; k++) { if (!lv[k].length) continue; ctx.beginPath(); for (let i = 0; i < lv[k].length; i += 2) { ctx.moveTo(lv[k][i][0], lv[k][i][1]); ctx.lineTo(lv[k][i + 1][0], lv[k][i + 1][1]); } ctx.strokeStyle = rgba(L.col, L.a * (k + 1) / 3); ctx.stroke(); }
}
// hair strands for the back of the head (head-local units, centre 0,0), cached
let HAIRP = null;
function hairStrands() {
  if (HAIRP) return HAIRP;
  const r = prng(311), dark = new Path2D(), lite = new Path2D(), W0 = [1.2, -9.6];
  const inside = (x, y) => (x * x) / (9.1 * 9.1) + ((y + 1.6) * (y + 1.6)) / (11.3 * 11.3) < 1 && y < 7.6 - Math.abs(x) * .35;
  for (let i = 0; i < 360; i++) {
    let x, y, n = 0; do { x = (r() * 2 - 1) * 9.2; y = -12.8 + r() * 21; n++; } while (!inside(x, y) && n < 30);
    let dx = x - W0[0], dy = y - W0[1]; const m = Math.hypot(dx, dy) || 1, sw = .55 * Math.exp(-m / 4); dx /= m; dy /= m; [dx, dy] = [dx * Math.cos(sw) - dy * Math.sin(sw), dx * Math.sin(sw) + dy * Math.cos(sw)]; dy += .35 + m * .03; const mm = Math.hypot(dx, dy); dx /= mm; dy /= mm;
    const len = 1.4 + r() * 2.4, bend = (r() - .5) * .9, ex = x + dx * len, ey = y + dy * len, cx = (x + ex) / 2 - dy * bend, cy = (y + ey) / 2 + dx * bend;
    const P = r() < .34 ? lite : dark; P.moveTo(x, y); P.quadraticCurveTo(cx, cy, ex, ey);
  }
  HAIRP = { dark, lite }; return HAIRP;
}
// youBack(ctx, x, y, s, o): you on a sofa, seen from behind (head, neck, shoulders and upper back; the backrest hides the rest).
//   x, y = the seat point under the spine (screen px), s = px per cm.  o: { t, seed, sink 0..1 (weight sinks into the cushions, shoulders
//   round, head settles), look -1..1 (head turn), blanket 0..1 (the ochre blanket round the shoulders), tv { col, a } (the screen in front:
//   rim round the top of the silhouette), sun { col, a } (light from behind the viewer: warms the back), shade 0..1 }
// → { head: [x, y], shoulderY }
export function youBack(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, sd = o.seed ?? 3, sink = clamp(o.sink ?? 0), S = s;
  const D = { sweater: o.sweater || '#26304d', skin: '#a8734f', hair: '#17110f', blanket: OCHRE };
  const ph = sd * 1.37, br = Math.sin(t * TAU / 4.4 + ph), sway = Math.sin(t * TAU / 9.5 + ph * 1.7) * .7 + Math.sin(t * TAU / 3.9 + ph) * .3;
  const U = br * .45 - sink * 3.2;                       // shoulder lift (breath), shoulders drop as you sink
  const bx = sway * .5, ys = -55 - U, yc = -59 - U * .8;    // shoulder line / collar base above the seat (cm)
  const look = o.look ?? 0, pitch = clamp(.12 + sink * .22 + .04 * Math.sin(t * .7 + ph)), roll = .03 * Math.sin(t * .53 + ph * 2) + look * .05;
  const tv = o.tv || null, sun = o.sun || null, shade = o.shade || 0;
  const rimTV = tv && tv.a > 0 ? { d: [0, -1], col: tv.col, a: tv.a, w: 1.5 / S + .35, pow: .9 } : null;
  const rimTV2 = tv && tv.a > 0 ? { d: [-.85, -.5], col: tv.col, a: tv.a * .6, w: 1.2 / S + .3 } : null;
  const rimTV3 = tv && tv.a > 0 ? { d: [.85, -.5], col: tv.col, a: tv.a * .6, w: 1.2 / S + .3 } : null;
  const rims = [rimTV, rimTV2, rimTV3];
  ctx.save(); ctx.translate(x, y + sink * 6 * S); ctx.scale(S, S);
  const all = [];
  const part = (pts, fill, detail, rr = rims) => {
    cw(pts); all.push(pts);
    ctx.save(); ctx.beginPath(); trace(ctx, pts); ctx.fillStyle = fill; ctx.fill(); ctx.clip();
    const fg = ctx.createLinearGradient(0, -90, 0, -20); fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(2,3,9,.45)'); ctx.fillStyle = fg; ctx.fillRect(-45, -100, 90, 110);
    if (sun && sun.a > 0) { ctx.fillStyle = rgba(sun.col, .22 * sun.a); ctx.fillRect(-45, -100, 90, 110); }
    if (detail) detail();
    for (const R of rr) if (R) rimOn(ctx, pts, R);
    ctx.restore();
  };
  const fold = (pts, w = .45, a = .5) => { ctx.lineCap = 'round'; ctx.strokeStyle = rgba('#03040a', a); ctx.lineWidth = w; ctx.beginPath(); line(ctx, pts); ctx.stroke(); };
  // ---- the sweater body (cut at the seat), round shoulders, slumped
  const sh = 21.5 - sink * .8, ar = 20.4, wa = 18.6 + sink * .8;
  const half = (sx) => run([0, yc], [
    [[sx * 4, yc], [sx * 7.6, yc + .2], [sx * 10, yc + .9]],
    [[sx * 14.5, ys - 1.4], [sx * (sh - 6), ys - .3], [sx * (sh - 3), ys + .5]],
    [[sx * (sh - .6), ys + 1.3], [sx * (sh + .3), ys + 3.8], [sx * sh, ys + 7.2]],
    [[sx * (sh - .2), -42], [sx * (ar + .3), -36], [sx * ar, -30]],
    [[sx * (ar - .4), -22], [sx * wa, -12], [sx * wa, 0]],
  ], 7);
  const R = half(1), Lh = half(-1), body = [...R.map(([a, b]) => [a + bx * clamp(-b / 60), b]), [wa * .4, 2], [-wa * .4, 2], ...Lh.slice().reverse().map(([a, b]) => [a + bx * clamp(-b / 60), b])];
  part(body, D.sweater, () => {
    // knit: ribbed vertical courses, a centre seam, folds where the back rounds
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = .35; for (let xx = -22; xx <= 22; xx += 1.6) { ctx.beginPath(); ctx.moveTo(xx + bx * .5, yc + 2); ctx.quadraticCurveTo(xx * 1.05, -30, xx * 1.08, 2); ctx.stroke(); }
    for (const sx of [-1, 1]) fold(run([sx * 12 + bx, ys - .5], [[[sx * 17, ys + 1], [sx * (ar - 2.6), -46], [sx * (ar - 1.2), -38]]], 6), .5, .45);
    fold([[-12, -34 + sink * 2], [0, -31 + sink * 3], [12, -34 + sink * 2]], .55, .35 + sink * .2);
  });
  // ---- upper arms at the sides, bent forward (the hands rest in the lap, hidden)
  for (const sx of [-1, 1]) {
    const j = [sx * (sh - 4.2) + bx, ys + 7.2];
    const T = tube([[j[0], j[1], 5.2], [sx * (sh + .6) + bx * .5, -40, 5], [sx * (sh + 1), -27, 4.7], [sx * (sh - .5), -18, 4.4]], 6);
    part(T.pts, shadeH(D.sweater, sx * .03 - .04), () => { const c = T.C[Math.round(T.C.length * .7)]; fold([[c[0] - sx * 3.5, c[1] - 1], [c[0], c[1] + .4], [c[0] + sx * 2.5, c[1] - .4]], .45, .45); });
  }
  // ---- the ochre blanket round the shoulders (the accent of you): it drapes over both shoulders and down the back, a fold at the neck
  const bl = clamp(o.blanket ?? 1);
  if (bl > 0) {
    const sw2 = Math.sin(t * .6 + ph) * .3, bw0 = sh + 4.4, top = yc + 1.6;
    const blk = run([0, top + 1], [
      [[5, top - .4], [10, top + .4], [13, ys + .2]], [[18, ys + 1], [bw0 - 1, ys + 3], [bw0, ys + 9]],
      [[bw0 + 1, -38], [bw0 + .6, -26], [bw0 - 1.5 + sw2, -14]], [[bw0 - 3, -8], [bw0 - 4, -4], [bw0 - 4.5, 0]],
      [[10, 1.5], [-10, 1.5], [-bw0 + 4.5, 0]], [[-bw0 + 4, -4], [-bw0 + 3, -8], [-bw0 + 1.5 - sw2, -14]],
      [[-bw0 - .6, -26], [-bw0 - 1, -38], [-bw0, ys + 9]], [[-bw0 + 1, ys + 3], [-18, ys + 1], [-13, ys + .2]], [[-10, top + .4], [-5, top - .4], [0, top + 1]],
    ], 7).map(([a, b]) => [a + bx * clamp(-b / 60), b]);
    part(blk, D.blanket, () => {
      // wool: a woven check in two engraved directions, deep folds hanging from the shoulders, a darker hem with a fringe
      ctx.strokeStyle = 'rgba(70,30,6,.28)'; ctx.lineWidth = .3; for (let yy = top; yy < 2; yy += 1.4) { ctx.beginPath(); ctx.moveTo(-30, yy); ctx.lineTo(30, yy + .6); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(255,220,170,.12)'; for (let xx = -30; xx < 30; xx += 2.2) { ctx.beginPath(); ctx.moveTo(xx, top); ctx.lineTo(xx + .4, 2); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(90,40,8,.5)'; ctx.lineWidth = .8; for (let xx = -22; xx <= 22; xx += 11) { ctx.beginPath(); ctx.moveTo(xx * .5, ys + 4); ctx.lineTo(xx * .55, 2); ctx.stroke(); }
      for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) fold([[sx * (8 + i * 4), ys + 2 + i], [sx * (9 + i * 4.6) + sw2, -30 + i * 3], [sx * (8.5 + i * 5) + sw2 * 1.4, 0]], .9, .4);
      const hg = ctx.createLinearGradient(0, -14, 0, 2); hg.addColorStop(0, 'rgba(40,14,2,0)'); hg.addColorStop(1, 'rgba(40,14,2,.45)'); ctx.fillStyle = hg; ctx.fillRect(-32, -16, 64, 20);
      const g2 = ctx.createLinearGradient(0, top - 2, 0, ys + 12); g2.addColorStop(0, 'rgba(255,230,190,.16)'); g2.addColorStop(1, 'rgba(255,230,190,0)'); ctx.fillStyle = g2; ctx.fillRect(-32, top - 3, 64, 18);
    });
  }
  // ---- neck, the collar of the sweater (ribbed), the head (skin, hair with strands, ears)
  const hc = [bx * 1.1 + roll * 6, -75.6 - U * .62 + pitch * 1.5 + sink * 1.2], sq = 1 - .05 * pitch;
  const HM = [hc[0], hc[1], Math.cos(roll), Math.sin(roll)], hp = (p) => xf(p.map(([a, b]) => [a, b * sq]), HM);
  const neck = cw([[hc[0] - 5.2, hc[1] + 7], [hc[0] + 5.2, hc[1] + 7], [6.4 + bx, yc + 1.4], [-6.4 + bx, yc + 1.4]]);
  part(neck, shadeH(D.skin, -.32), () => { const g2 = ctx.createLinearGradient(0, hc[1] + 7, 0, yc); g2.addColorStop(0, 'rgba(10,5,4,.55)'); g2.addColorStop(1, 'rgba(10,5,4,.1)'); ctx.fillStyle = g2; ctx.fillRect(-9, hc[1] + 6, 18, yc - hc[1]); });
  const col = run([-8.2 + bx, yc + 1.2], [[[-8, yc - 1.6], [-7.6 + hc[0] * .3, yc - 3.8], [-7 + hc[0] * .4, yc - 5]], [[-3, yc - 4.2], [3, yc - 4.2], [7 + hc[0] * .4, yc - 5]], [[7.6 + hc[0] * .3, yc - 3.8], [8 + bx, yc - 1.6], [8.2 + bx, yc + 1.2]], [[3, yc + 2], [-3, yc + 2], [-8.2 + bx, yc + 1.2]]], 6);
  part(col, shadeH(D.sweater, .06), () => { ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .3; for (let i = -8; i <= 8; i += .9) { ctx.beginPath(); ctx.moveTo(i, yc - 4.6); ctx.lineTo(i * 1.04, yc + 1.6); ctx.stroke(); } });
  const skin = hp(sym(run([0, -12], [[[4.6, -12], [8, -9.6], [8.7, -5.2]], [[9.1, -2.4], [9, 1.2], [8.6, 3.4]], [[8.3, 5.4], [7.6, 7.6], [6.6, 9.2]], [[5.9, 10.2], [5.5, 11], [5.2, 12.6]], [[3, 12.9], [1.2, 13], [0, 13]]], 6)));
  part(skin, shadeH(D.skin, -.3), null, [rimTV2, rimTV3]);
  const nape = -2.4 * pitch, r = prng(sd * 17 + 5);
  const hairHalf = run([0, -12.9], [[[4.9, -13], [8.7, -10.3], [9.35, -5.6]], [[9.75, -2.8], [9.65, .2], [9.15, 2.4]], [[8.6, 4.2], [7.4, 5.6], [6.1, 6.6 + nape * .4]], [[4.6, 7.5 + nape], [3.4, 7.9 + nape], [1.8, 8.3 + nape]], [[1, 8.6 + nape], [.4, 8.5 + nape], [0, 8.4 + nape]]], 7);
  const hairS = hp(sym(hairHalf.map(([a, b]) => { const j = (r() - .5) * (b > 4 ? .7 : .35); return [a + j * Math.sign(a || 1), b + (b > 4 ? Math.abs(j) : 0)]; })));
  part(hairS, D.hair, () => {
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(roll); ctx.scale(1, sq);
    const HS = hairStrands(); ctx.lineCap = 'round'; ctx.lineWidth = Math.min(1.5, Math.max(.6, S * .13)) / S;
    ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.stroke(HS.dark); ctx.strokeStyle = rgba('#7a6a62', .3); ctx.stroke(HS.lite);
    if (tv && tv.a > 0) { const sg = ctx.createLinearGradient(0, -13, 0, -4); sg.addColorStop(0, rgba(tv.col, .18 * tv.a)); sg.addColorStop(1, rgba(tv.col, 0)); ctx.fillStyle = sg; ctx.fillRect(-11, -16, 22, 14); }
    ctx.restore();
  });
  const earR = run([8.45, -3.4], [[[10.5, -4.3], [11.2, -1.6], [10.6, 1.4]], [[10.2, 3.4], [9.5, 4.6], [8.6, 4.5]], [[8.9, 2.2], [8.9, -.8], [8.45, -3.4]]], 5), earL = earR.map(([a, b]) => [-a, b]);
  for (const [ep, sx] of [[earL, -1], [earR, 1]]) { const Ep = hp(ep); part(Ep, shadeH(D.skin, -.22), () => { ctx.strokeStyle = 'rgba(40,14,8,.55)'; ctx.lineWidth = .3; ctx.beginPath(); line(ctx, hp([[sx * 9.9, -2.4], [sx * 10.1, 0], [sx * 9.4, 2.9]])); ctx.stroke(); });
    if (tv && tv.a > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ff8a66', .3 * tv.a); ctx.lineWidth = .6; ctx.beginPath(); line(ctx, Ep.slice(2, 14)); ctx.stroke(); ctx.restore(); } }
  // ---- engraved hatch toward the seat over everything, and the shade
  ctx.save(); ctx.beginPath(); for (const p of all) trace(ctx, p); ctx.clip();
  ctx.strokeStyle = 'rgba(3,4,10,.32)'; ctx.lineWidth = Math.max(.25, .7 / S); for (let k = -60; k < 60; k += 1.6) { ctx.beginPath(); ctx.moveTo(k, -20); ctx.lineTo(k + 24, -66); ctx.stroke(); }
  const vg = ctx.createLinearGradient(0, -52, 0, 0); vg.addColorStop(0, 'rgba(3,4,10,0)'); vg.addColorStop(1, 'rgba(3,4,10,.55)'); ctx.fillStyle = vg; ctx.fillRect(-45, -60, 90, 65);
  if (shade > 0) { ctx.fillStyle = `rgba(8,11,24,${shade})`; ctx.fillRect(-45, -100, 90, 105); }
  ctx.restore();
  ctx.restore();
  return { head: [x + hc[0] * S, y + sink * 6 * S + hc[1] * S], shoulderY: y + sink * 6 * S + ys * S };
}
