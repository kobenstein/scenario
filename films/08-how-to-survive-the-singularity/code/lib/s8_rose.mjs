// Film 8 · the ONE compass geometry for both compasses (owner B1; shots.md §6 "Two compasses"). Same four points in the same order, the same
// four icons, one needle. YOURS = inkRose (small, ink on lamp-lit paper, hand-drawn and wobbly, amber needle). OURS = B2's seaRose (s8_fleet)
// draws the same POINTS / icon() paths in light on the sea.
//
//   POINTS                     [{ k: 'N', ang, icon: 'house' }, { k: 'E', …, 'kite' }, { k: 'S', …, 'fire' }, { k: 'W', …, 'tack' }]
//                              ang = screen angle of the point (rad, 0 = right, −π/2 = up); N up, E right, S down, W left
//   icon(ctx, kind, x, y, s, o)   one icon centred at x, y, about s px tall. kind 'house' (a house with one lit window) | 'kite' (a paper kite
//                              on its string) | 'fire' (a ring of people round a fire) | 'tack' (a short zigzag tack line with an arrow)
//                              o: { u 0..1 draw-on (the pen's path), ink '#2a2420', lw (px, default s/22), lit 0..1 (house window / fire
//                              glow, amber, drawn 'lighter'), t, seed, mode 'ink' (default, wobbly hand-drawn) | 'light' (clean, glowing
//                              strokes in o.ink, for the sea rose) }  → { window: [x, y] (house) | fire: [x, y] | string: [x, y] (kite) }
//   needle(t, kicks, o) → angle offset (rad, 0 = on its heading)  the needle physics (MOTION.md): each kick { t, amp (rad) } throws it off,
//                              it swings back, overshoots ≤ 5 %, settles, then breathes (o.breath .03 rad);
//                              o.settleT (1.4 s): the time a kick takes to settle.
//   inkRose(ctx, t, o)         YOUR compass on paper, in the current transform (draw it inside a sheet's content or in plate space).
//                              o: { x, y, R (px), seed 3, ink '#2a2420', ring 0..1 (circle draw-on), cross 0..1 (the cross), points [n, e, s, w]
//                              0..1 (each point's spike draw-on), letters [n, e, s, w] (the small N/E/S/W letters), icons [n, e, s, w] 0..1 (icon
//                              draw-on), words [n, e, s, w] 0..1 (unreadable scribbled words beside the points), lit [n, e, s, w] 0..1 (each
//                              point lights amber), needle (rad, screen angle: −π/2 = north) | null, needleU 0..1 (the needle is drawn on),
//                              glow 0..1 (the whole ring glows amber, for the reflection at your chest), t }
//                              → { centre: [x, y], tip(i): [x, y] of point i, pen: [x, y] where the pen is now (last stroke being drawn) | null }
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, eoX, settle, spline, nz } from './s8_kit.mjs';
import { scribble } from './paper.mjs';

export const POINTS = [{ k: 'N', ang: -Math.PI / 2, icon: 'house' }, { k: 'E', ang: 0, icon: 'kite' }, { k: 'S', ang: Math.PI / 2, icon: 'fire' }, { k: 'W', ang: Math.PI, icon: 'tack' }];

// ---------------------------------------------------------------- strokes
// a polyline with hand wobble; the visible prefix u (by length); returns the point where the pen is (for the pen hand)
function wob(pts, amp, seed) { const r = prng(seed); const ph = r() * 10; return pts.map(([x, y], i) => [x + amp * nz(i * .7 + ph, seed), y + amp * nz(i * .9 + ph + 3, seed + 1)]); }
function strokeU(ctx, pts, u, lw, ink, mode) {
  if (u <= 0 || pts.length < 2) return null;
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const end = L[L.length - 1] * clamp(u), out = [pts[0]]; let tip = pts[0];
  for (let i = 1; i < pts.length; i++) { if (L[i] <= end) { out.push(pts[i]); tip = pts[i]; continue; } const q = (end - L[i - 1]) / (L[i] - L[i - 1]); tip = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * q, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * q]; out.push(tip); break; }
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (mode === 'light') { ctx.globalCompositeOperation = 'lighter'; for (const [w, a] of [[lw * 5, .12], [lw * 2, .35], [lw, .95]]) { ctx.strokeStyle = rgba(ink, a); ctx.lineWidth = w; ctx.beginPath(); out.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  else { ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.beginPath(); out.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.strokeStyle = rgba(ink, .25); ctx.lineWidth = lw * 1.8; ctx.stroke(); }
  ctx.restore();
  return u < 1 ? tip : null;
}
const arc = (cx, cy, r, a0, a1, n = 24) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; };
const seg = (a, b, n = 6) => { const p = []; for (let i = 0; i <= n; i++) p.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); return p; };
// several strokes drawn one after another by one u (by count)
function strokes(ctx, list, u, lw, ink, mode) { let pen = null; const n = list.length; list.forEach((pts, i) => { const v = clamp(u * n - i); const p = strokeU(ctx, pts, v, lw, ink, mode); if (p) pen = p; }); return pen; }

// ---------------------------------------------------------------- the four icons (unit geometry: about 1 tall, centred on 0,0)
const ICON = {
  house: () => [seg([-.42, .45], [-.42, -.05]), seg([-.42, -.05], [0, -.45], 5), seg([0, -.45], [.42, -.05], 5), seg([.42, -.05], [.42, .45]), seg([.42, .45], [-.42, .45], 8),
    seg([-.1, .02], [.12, .02], 3), seg([.12, .02], [.12, .22], 3), seg([.12, .22], [-.1, .22], 3), seg([-.1, .22], [-.1, .02], 3)],
  kite: () => [[[0, -.5], [.24, -.18], [0, .16], [-.24, -.18], [0, -.5]], seg([0, -.5], [0, .16], 4), seg([-.24, -.18], [.24, -.18], 4),
    [[0, .16], [.05, .26], [-.04, .34], [.06, .42], [-.02, .5]], [[0, .16], [.18, .3], [.3, .5], [.46, .62]]],
  fire: () => { const L = []; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + i / 7 * TAU, x = .42 * Math.cos(a), y = .3 * Math.sin(a) + .08; L.push(arc(x, y - .06, .055, 0, TAU, 10), seg([x, y], [x, y + .12], 2)); }
    L.push([[-.1, .16], [-.05, .02], [0, -.16], [.04, .0], [.1, .16]]); return L; },
  tack: () => [[[-.46, .4], [-.22, -.1], [0, .32], [.22, -.16], [.4, .12]], seg([.4, .12], [.3, -.02], 2), seg([.4, .12], [.46, -.04], 2)],
};
export function icon(ctx, kind, x, y, s, o = {}) {
  const ink = o.ink || '#2a2420', lw = o.lw ?? Math.max(1, s / 22), mode = o.mode || 'ink', t = o.t || 0, seed = o.seed ?? 5, u = o.u ?? 1;
  const list = (ICON[kind] || ICON.house)().map((pts, i) => { const P = pts.map(([a, b]) => [x + a * s, y + b * s]); return mode === 'ink' ? wob(P, s * .012, seed + i * 7) : P; });
  const pen = strokes(ctx, list, u, lw, ink, mode);
  const lit = clamp(o.lit ?? 0) * clamp(u * 1.2 - .2), out = { pen };
  const glow = (gx, gy, r, a) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r); g.addColorStop(0, rgba('#fff1d6', .95 * a)); g.addColorStop(.25, rgba('#ffb35c', .6 * a)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(gx - r, gy - r, 2 * r, 2 * r); ctx.restore(); };
  if (kind === 'house') { out.window = [x + .01 * s, y + .12 * s]; if (lit > 0) { ctx.fillStyle = rgba('#ffb35c', .9 * lit); ctx.fillRect(x - .09 * s, y + .03 * s, .2 * s, .18 * s); glow(out.window[0], out.window[1], s * .45, lit * (.85 + .15 * Math.sin(t * 6.28))); } }
  if (kind === 'fire') { out.fire = [x, y + .06 * s]; if (lit > 0) glow(out.fire[0], out.fire[1], s * .55, lit * (.8 + .2 * Math.sin(t * 9) * Math.sin(t * 5.3))); }
  if (kind === 'kite') { out.string = [x + .46 * s, y + .62 * s]; if (lit > 0) glow(x, y - .15 * s, s * .45, lit * .8); }
  if (kind === 'tack') { out.tip = [x + .4 * s, y + .12 * s]; if (lit > 0) glow(out.tip[0], out.tip[1], s * .4, lit * .8); }
  return out;
}

// ---------------------------------------------------------------- the needle
export function needle(t, kicks = [], o = {}) {
  const T = o.settleT ?? 1.4; let a = 0;
  for (const k of kicks) { if (t < k.t) continue; const u = (t - k.t) / T; a += (k.amp || 0) * (1 - settle(u)); }
  const br = o.breath ?? .03;   // ±3 % of a radian: a living wobble once settled
  return a + br * (.7 * Math.sin(t * 1.9) + .3 * Math.sin(t * 4.3 + 1));
}

// ---------------------------------------------------------------- YOUR compass, ink on paper
const four = (v, d = 0) => (Array.isArray(v) ? v : [v ?? d, v ?? d, v ?? d, v ?? d]);
export function inkRose(ctx, t, o = {}) {
  const x = o.x ?? 0, y = o.y ?? 0, R = o.R ?? 200, ink = o.ink || '#2a2420', seed = o.seed ?? 3, lw = Math.max(1.2, R / 70);
  const pts = four(o.points), lets = four(o.letters), icons = four(o.icons), words = four(o.words), lit = four(o.lit);
  let pen = null; const P = (u) => { if (u) pen = u; };
  // the ring: one circle, slightly off-round, the ends overlapping a little (drawn by hand)
  const ring = []; for (let i = 0; i <= 64; i++) { const a = -Math.PI / 2 - .1 + i / 64 * (TAU + .22), rr = R * (1 + .012 * nz(i * .4, seed)); ring.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]); }
  if (o.glow) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; for (const [w, a] of [[R * .22, .07], [R * .08, .2], [R * .025, .6]]) { ctx.strokeStyle = rgba('#ffb35c', a * o.glow); ctx.lineWidth = w; ctx.beginPath(); ring.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } ctx.restore(); }
  P(strokeU(ctx, ring, o.ring ?? 1, lw, ink, 'ink'));
  P(strokes(ctx, [wob(seg([x - R * .92, y], [x + R * .92, y], 10), R * .006, seed + 2), wob(seg([x, y - R * .92], [x, y + R * .92], 10), R * .006, seed + 3)], o.cross ?? 1, lw * .8, ink, 'ink'));
  POINTS.forEach((p, i) => {
    const c = Math.cos(p.ang), s = Math.sin(p.ang), nx = -s, ny = c;
    const tip = [x + c * R * 1.18, y + s * R * 1.18], b1 = [x + c * R * .78 + nx * R * .08, y + s * R * .78 + ny * R * .08], b2 = [x + c * R * .78 - nx * R * .08, y + s * R * .78 - ny * R * .08];
    if (lit[i] > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], R * .5); g.addColorStop(0, rgba('#fff1d6', .8 * lit[i])); g.addColorStop(.3, rgba('#ffb35c', .45 * lit[i])); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(tip[0] - R * .5, tip[1] - R * .5, R, R); ctx.restore(); }
    P(strokeU(ctx, wob([b1, ...seg(b1, tip, 4).slice(1), ...seg(tip, b2, 4).slice(1)], R * .005, seed + 10 + i), pts[i], lw, ink, 'ink'));
    if (lets[i] > 0) { ctx.save(); ctx.font = `italic 500 ${Math.round(R * .16)}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const lp = [x + c * R * 1.34, y + s * R * 1.34]; ctx.beginPath(); ctx.rect(lp[0] - R * .2, lp[1] - R * .12 - R * .2 * (1 - lets[i]), R * .4, R * .24 * lets[i] + 1); ctx.clip(); ctx.fillStyle = ink; ctx.fillText(p.k, lp[0], lp[1]); ctx.restore(); }
    // the icon sits inside the ring near its point
    const ic = [x + c * R * .48, y + s * R * .48];
    if (icons[i] > 0) { const r = icon(ctx, p.icon, ic[0], ic[1], R * .3, { u: icons[i], ink, lit: lit[i], t, seed: seed + 20 + i }); if (r.pen) pen = r.pen; }
    if (words[i] > 0) { const wx = x + c * R * 1.55 + (c < -.5 ? -R * .7 : c > .5 ? 0 : -R * .35), wy = y + s * R * 1.5 - R * .06; scribble(ctx, wx, wy, R * .7, R * .13, { seed: seed + 30 + i, u: words[i], ink, lw: Math.max(1, lw * .6) }); }
  });
  if (o.needle != null && (o.needleU ?? 1) > 0) {
    const a = o.needle, u = eoX(o.needleU ?? 1), c = Math.cos(a), s = Math.sin(a), L = R * .82 * u, wdt = R * .07;
    ctx.save(); ctx.translate(x, y);
    ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(c * L * .6, s * L * .6, 0, c * L * .6, s * L * .6, R * .5); g.addColorStop(0, rgba('#ffb35c', .35)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(-R, -R, 2 * R, 2 * R);
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath(); ctx.moveTo(c * L, s * L); ctx.lineTo(-s * wdt, c * wdt); ctx.lineTo(-c * L * .45, -s * L * .45); ctx.lineTo(s * wdt, -c * wdt); ctx.closePath();
    ctx.fillStyle = '#e8892e'; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = lw * .7; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(c * L, s * L); ctx.lineTo(-s * wdt, c * wdt); ctx.lineTo(s * wdt, -c * wdt); ctx.closePath(); ctx.fillStyle = '#ffb35c'; ctx.fill();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(0, 0, wdt * .45, 0, TAU); ctx.fill();
    ctx.restore();
  }
  return { centre: [x, y], tip: (i) => { const p = POINTS[i]; return [x + Math.cos(p.ang) * R * 1.18, y + Math.sin(p.ang) * R * 1.18]; }, pen };
}
