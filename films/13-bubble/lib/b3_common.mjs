// Film 13 · B3 (c09–c12) · shared helpers and the INTERNAL seam plates of the B3 package (c09|c10, c10|c11, c11|c12).
// Owned by B3. Same principle as lib/bubble_seams.mjs: both sides of a seam draw the same function with the same t, so the frames
// left and right of the boundary are identical by construction; each plate keeps a slow push so the camera never stops.
//   sheet*      c09 | c10   a blueprint sheet lifts off the Europe map, flies at the camera, FLIPS (its back is the 1932 newspaper)
//                           and fills the frame (headline INSULL EMPIRE COLLAPSES); c10 pulls back and the wind carries it over the farm
//   plateTickets c10 | c11  the 1844 penny ticket and today's ticket side by side on the night (they become the scale's pans)
//   plateBubble  c11 | c12  the last peak of the Perez timeline has become the bubble over the data center (the first image again)
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import * as B from './bubble_kit.mjs';
export { E, K, B };
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, lin, rad, prng, halo, dust } = E;
const { COL } = B;

// ---------- math ----------
export const rise = (x) => 1 - (1 - clamp(x)) ** 3;
export const ramp = (t, a, b) => smooth(span(t, a, b));
export const sramp = (t, a, b) => sineIO(span(t, a, b));
// cubic Hermite on [t0, t1]: value p0 → p1 with slopes v0, v1 (per second). Outside: clamped (constant).
export function herm(t, t0, t1, p0, p1, v0 = 0, v1 = 0) {
  const d = t1 - t0, u = clamp((t - t0) / d), u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * d * v0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * d * v1;
}
// a gentle bump 0 → 1 → 0 over [a, b]
export const bump = (t, a, b) => Math.sin(Math.PI * clamp((t - a) / (b - a)));
// screen-space zoom about a point
export function zoomAt(ctx, z, cx, cy) { ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); }
export const PUSH = .05;   // the seam push (same rate as the lead's plates)

// ---------- type ----------
// a fact label (MOTION.md §7): rows rise from their baselines one after another. rows: [[text, size?, col?, serif?]];
// first row 34 px Inter 600 (halo2), source rows 24 px. u 0..1 (in), out 0..1 (sinks again). Returns the bottom y.
export function label(ctx, rows, x, y, u, o = {}) {
  let yy = y;
  rows.forEach((r, i) => {
    const [txt, size = i ? 26 : 34, col = i ? rgba(P.halo2, .78) : P.halo2, serif = false] = r;
    const k = clamp(u * (1 + .25 * (rows.length - 1)) - i * .25), sink = o.out ? 1 - clamp(o.out * (1 + .2 * (rows.length - 1)) - i * .2) ** 2 : 1;
    const uu = Math.min(rise(k), sink);
    if (uu > 0) K.maskLine(ctx, [[txt, 0]], x, yy, size, uu, { serif, col, glow: serif, align: o.align, spacing: o.spacing });
    yy += size * (serif ? 1.15 : 1.5);
  });
  return yy;
}
export const S_LABEL = { serif: false, glow: false };

// ---------- the night (screen space) ----------
export function nightBack(ctx, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, o.stops || [[0, P.night0], [.62, P.night1], [1, mixHex(P.ind0, P.night1, .3)]]); ctx.fillRect(0, 0, W, H);
  if (o.glow !== false) { ctx.fillStyle = rad(ctx, o.gx ?? 960, o.gy ?? 520, 1100, [[0, rgba(P.ind1, .55)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(0, 0, W, H); }
  if (o.stars !== false) E.stars(ctx, o.seed ?? 913, o.n ?? 110, t, [-60, -40, W + 120, H * .8], o.starA ?? .5);
  ctx.restore();
}

// =====================================================================================================================
// EUROPE (c09 9.07): a coarse outline (lon, lat), used as a mask for a dot-matrix map made of the chip tiles of the pool.
// =====================================================================================================================
const EU = [
  [[-9.3, 38.7], [-8.9, 37.0], [-6.0, 36.3], [-5.4, 36.0], [-2.1, 36.7], [-.5, 38.3], [.2, 39.5], [.9, 40.8], [3.2, 41.9], [3.1, 43.0], [4.6, 43.4], [6.0, 43.1], [7.5, 43.8], [8.9, 44.4], [10.3, 43.5], [12.2, 41.8], [14.2, 40.8], [15.6, 40.0], [15.7, 38.0], [16.6, 38.4], [17.1, 39.4], [16.9, 40.5], [18.5, 40.1], [16.9, 41.1], [14.0, 42.6], [12.3, 44.4], [12.3, 45.4], [13.6, 45.7], [14.5, 45.2], [15.9, 43.6], [18.1, 42.6], [19.4, 41.8], [19.4, 40.4], [20.2, 39.5], [21.0, 38.3], [22.0, 37.0], [22.9, 36.5], [23.2, 38.0], [22.9, 39.4], [22.9, 40.6], [24.0, 40.8], [26.0, 40.8], [28.9, 41.0], [28.1, 41.6], [27.7, 42.4], [28.6, 43.4], [29.6, 45.2], [30.7, 46.5], [31.8, 46.6], [33.5, 46.0], [34.5, 47.5], [34.5, 55.0], [30.3, 59.9], [28.0, 59.5], [24.0, 59.4], [23.5, 58.3], [24.4, 57.2], [22.6, 57.7], [21.0, 56.8], [21.1, 55.7], [20.5, 54.9], [18.6, 54.4], [16.5, 54.5], [14.2, 53.9], [12.1, 54.2], [10.9, 54.0], [10.6, 55.1], [10.2, 56.2], [10.5, 57.5], [9.5, 57.0], [8.2, 56.6], [8.1, 55.5], [8.6, 54.9], [8.9, 53.9], [7.0, 53.4], [4.8, 52.9], [4.2, 51.9], [3.4, 51.4], [2.5, 51.1], [1.6, 50.9], [1.6, 50.2], [.2, 49.7], [-1.6, 49.7], [-1.6, 48.6], [-3.0, 48.8], [-4.7, 48.4], [-4.2, 47.8], [-2.5, 47.3], [-1.2, 46.2], [-1.2, 44.7], [-1.5, 43.5], [-3.8, 43.5], [-6.0, 43.6], [-8.0, 43.7], [-9.3, 43.0], [-8.9, 42.0], [-8.7, 41.2]],
  [[12.9, 55.4], [14.3, 55.5], [16.0, 56.2], [16.6, 57.6], [18.2, 59.4], [17.2, 60.7], [17.4, 62.3], [19.8, 63.6], [21.4, 64.8], [22.2, 65.8], [25.4, 65.0], [24.5, 64.0], [21.5, 62.8], [21.5, 61.5], [22.0, 60.4], [25.0, 60.2], [27.8, 60.5], [30.0, 62.0], [29.5, 64.0], [30.0, 67.0], [28.5, 69.0], [30.8, 69.8], [28.0, 71.0], [25.6, 71.1], [23.0, 70.6], [19.0, 69.8], [16.0, 68.4], [14.4, 67.3], [12.5, 65.9], [10.8, 64.3], [8.0, 63.0], [5.3, 62.0], [5.0, 60.4], [5.6, 59.0], [7.0, 58.0], [8.8, 58.4], [10.5, 59.4], [11.3, 58.9], [11.9, 57.7], [12.8, 56.3]],
  [[-5.7, 50.1], [-3.0, 50.6], [-1.0, 50.8], [1.4, 51.2], [.9, 51.6], [1.7, 52.6], [.3, 53.0], [.1, 53.6], [-1.0, 54.5], [-1.5, 55.0], [-2.0, 55.8], [-2.6, 56.3], [-1.8, 57.5], [-3.9, 57.7], [-3.0, 58.6], [-5.0, 58.6], [-5.7, 57.6], [-5.6, 56.4], [-4.9, 55.7], [-5.1, 54.8], [-3.4, 54.9], [-3.0, 53.8], [-3.1, 53.3], [-4.6, 53.3], [-4.2, 52.4], [-5.2, 51.9], [-3.0, 51.5], [-4.2, 51.2]],
  [[-6.0, 52.2], [-6.2, 53.3], [-6.0, 54.6], [-5.6, 54.6], [-6.2, 55.2], [-7.3, 55.3], [-8.3, 55.1], [-8.6, 54.3], [-10.0, 54.2], [-9.9, 53.4], [-9.0, 53.2], [-9.9, 52.1], [-10.2, 51.6], [-8.5, 51.6], [-7.0, 52.1]],
];
// screen projection of the map: centre (cx, cy), k px per degree latitude
export const EUMAP = { cx: 1000, cy: 470, k: 17.5, lon0: 12, lat0: 53.5 };
export const euXY = (lon, lat, m = EUMAP) => [m.cx + (lon - m.lon0) * Math.cos(52 * Math.PI / 180) * m.k, m.cy - (lat - m.lat0) * m.k];
function inPoly(x, y, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
let EUDOTS = null;
// the dot grid inside Europe (screen px), sorted left → right; built once
export function europeDots(step = 11) {
  if (EUDOTS) return EUDOTS;
  const polys = EU.map((p) => p.map(([lo, la]) => euXY(lo, la))), out = [];
  for (let y = 120; y < 860; y += step) for (let x = 600; x < 1420; x += step) { const xx = x + ((y / step) % 2) * step * .5; if (polys.some((p) => inPoly(xx, y, p))) out.push([xx, y]); }
  out.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  EUDOTS = out; return out;
}
export const europePaths = () => EU.map((poly) => { const p = new Path2D(); poly.forEach(([lo, la], i) => { const [x, y] = euXY(lo, la); i ? p.lineTo(x, y) : p.moveTo(x, y); }); p.closePath(); return p; });
// the seven planned hubs (rough, not real sites: the call is still open; "PLANNED") · the 4th one becomes the flying sheet
export const HUBS = [[-3.7, 40.4], [2.3, 48.9], [8.7, 50.1], [12.5, 41.9], [16.4, 48.2], [24.9, 60.2], [21.0, 52.2]].map(([lo, la]) => euXY(lo, la));
export const HUB_SHEET = 4;

// =====================================================================================================================
// SEAM c09 | c10: the sheet (blueprint → flip → the 1932 newspaper)
// =====================================================================================================================
const SHEET_W0 = 23, SHEET_WC = 2550, SHEET_LAND = { x: 1330, y: 812, w: 230 };
// the anchor is the headline point of the page (local (0, -0.3 h)); h = 1.3 w
export const SHEET_DRIFT = [-14, 7];   // px/s: the plate is never still (the full-frame paper drifts a little, besides the push)
export const SHEET_LIFT = 3.4;   // the sheet lifts off the map SHEET_LIFT s before the seam
// coverage of the frame by the sheet (anchor x, y; width w; rotation ignored)
function sheetCov(x, y, w) {
  const h = 1.3 * w, cy = y + .3 * h, x0 = Math.max(0, x - w / 2), x1 = Math.min(W, x + w / 2), y0 = Math.max(0, cy - h / 2), y1 = Math.min(H, cy + h / 2);
  return Math.max(0, x1 - x0) * Math.max(0, y1 - y0) / (W * H);
}
const GROW = new Map();
function sheetGrowth(T0) {
  if (GROW.has(T0)) return GROW.get(T0);
  const tA = T0 - SHEET_LIFT, tP = T0 - .5, tX = tP - .45, [hx, hy] = HUBS[HUB_SHEET], [vx, vy] = SHEET_DRIFT, dt = 1 / 120, tab = [];
  const pos = (t) => [herm(t, tA, tP, hx, 960 + vx * (tP - T0), 0, vx), herm(t, tA, tP, hy - 6 - .3 * 1.3 * SHEET_W0, 540 + vy * (tP - T0), -60, vy)];
  const c0 = sheetCov(...pos(tA), SHEET_W0);
  for (let t = tA; t <= tX + 1e-9; t += dt) {
    const u = span(t, tA, tX), S = u * u * u * (10 - 15 * u + 6 * u * u), c = c0 + (1 - c0) * S, [x, y] = pos(t);
    let lo = Math.log(SHEET_W0), hi = Math.log(SHEET_WC);
    if (c >= .9999) { lo = Math.log(400); for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; sheetCov(x, y, Math.exp(m)) >= .9999 ? (hi = m) : (lo = m); } }
    else for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; sheetCov(x, y, Math.exp(m)) < c ? (lo = m) : (hi = m); }
    tab.push((lo + hi) / 2);
  }
  const n = tab.length - 1, lX = tab[n], vX = Math.max(.15, (tab[n] - tab[n - 4]) / (4 * dt));
  const f = (t) => {
    if (t <= tA) return tab[0];
    if (t < tX) { const i = (t - tA) / dt, j = Math.min(n - 1, Math.floor(i)); return lerp(tab[j], tab[j + 1], i - j); }
    return herm(t, tX, tP, lX, Math.log(SHEET_WC), vX, PUSH);
  };
  GROW.set(T0, f); return f;
}
export function sheetState(t, T0) {
  const tA = T0 - SHEET_LIFT, tP = T0 - .5, tQ = T0 + .5, tR = T0 + 4.6, tL = T0 + 7.35;
  const [hx, hy] = HUBS[HUB_SHEET], [vx, vy] = SHEET_DRIFT;
  let x, y, lw, rot, sy = 1;
  if (t < tP) {
    // growth: the share of the FRAME the sheet covers rises evenly (smootherstep) until it covers it at tX, then it grows on to the
    // plate's size in log space (ends at the plate's push rate). An even coverage rate = no lurch (smooth.py), whatever the paper's contrast.
    x = herm(t, tA, tP, hx, 960 + vx * (tP - T0), 0, vx); y = herm(t, tA, tP, hy - 6 - .3 * 1.3 * SHEET_W0, 540 + vy * (tP - T0), -60, vy);
    lw = sheetGrowth(T0)(t);
    const k = smooth(span(t, tA, tP)); rot = herm(t, tA, tP, -.08, .02, 0, 0) + .09 * Math.sin(Math.PI * k) * (1 - k);
  } else if (t < tQ) {
    lw = Math.log(SHEET_WC) + PUSH * (t - tP); x = 960 + vx * (t - T0); y = 540 + vy * (t - T0); rot = .02;
  } else if (t < tR) {
    lw = herm(t, tQ, tR, Math.log(SHEET_WC) + PUSH, Math.log(560), PUSH, -.05);
    x = herm(t, tQ, tR, 960 + vx * .5, 1010, vx, 55); y = herm(t, tQ, tR, 540 + vy * .5, 430, vy, 10); rot = herm(t, tQ, tR, .02, -.16, 0, -.06);
  } else {
    // the wind carries it right and down, it turns, and lands flat by the fence ("collapsed")
    const k = span(t, tR, tL);
    lw = herm(t, tR, tL, Math.log(560), Math.log(SHEET_LAND.w), -.05, 0);
    x = herm(t, tR, tL, 1010, SHEET_LAND.x, 55, 0) + 26 * Math.sin(k * Math.PI * 2) * (1 - k);
    y = herm(t, tR, tL, 430, SHEET_LAND.y, 10, 0) - 30 * Math.sin(k * Math.PI) ;
    rot = herm(t, tR, tL, -.16, -.04, -.06, 0) + .22 * Math.sin(k * Math.PI * 1.5) * (1 - k);
    sy = 1 - .66 * smooth(span(t, tL - 1.6, tL));
  }
  // the paper is dim while it fills the frame (night light, no luminance lurch at the seam), it brightens as it falls to the farm
  const w = Math.exp(lw), flip = sineIO(span(t, T0 - 2.95, T0 - 2.35)), lum = .55 + .3 * smooth(span(t, T0 + .5, T0 + 3.5));
  const dim = .6 - .38 * smooth(span(t, T0 + .5, T0 + 3.8));   // night on the paper while it fills the frame (low contrast = no lurch)
  return { x, y, w, h: w * 1.3, rot, sy, flip, lum, dim, landed: t >= tL, tL };
}
// the faces, drawn in local coords (0, 0) = sheet centre
function blueprintFace(ctx, w, h) {
  const p = new Path2D(); p.rect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, '#2a4f9e'], [.6, '#1f3f86'], [1, '#183470']]); ctx.fill(p);
  ctx.save(); ctx.clip(p);
  ctx.strokeStyle = rgba(P.cream, .12); ctx.lineWidth = Math.max(.6, w * .002);
  for (let i = 1; i < 12; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + w * i / 12, -h / 2); ctx.lineTo(-w / 2 + w * i / 12, h / 2); ctx.stroke(); }
  for (let i = 1; i < 16; i++) { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + h * i / 16); ctx.lineTo(w / 2, -h / 2 + h * i / 16); ctx.stroke(); }
  // the plan of a hall: outline, rows of racks, a door, dimension lines
  ctx.strokeStyle = rgba(P.cream, .75); ctx.lineWidth = Math.max(1, w * .006);
  ctx.strokeRect(-w * .36, -h * .3, w * .72, h * .5);
  ctx.lineWidth = Math.max(.8, w * .003);
  for (let i = 0; i < 6; i++) ctx.strokeRect(-w * .3 + i * w * .1, -h * .24, w * .05, h * .36);
  ctx.beginPath(); ctx.arc(w * .36, h * .14, w * .07, Math.PI, Math.PI * 1.5); ctx.stroke();
  ctx.setLineDash([w * .012, w * .012]); ctx.beginPath(); ctx.moveTo(-w * .36, h * .3); ctx.lineTo(w * .36, h * .3); ctx.moveTo(-w * .42, -h * .3); ctx.lineTo(-w * .42, h * .2); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .35); ctx.lineWidth = Math.max(1, w * .004); ctx.strokeRect(-w / 2 + w * .03, -h / 2 + w * .03, w - w * .06, h - w * .06);
}
const NEWS_COLS = (() => { const r = prng(1932), a = []; for (let c = 0; c < 4; c++) for (let i = 0; i < 46; i++) a.push([c, i, .2 + .1 * r(), r() < .12 ? .3 : 0]); return a; })();
export function newsFace(ctx, w, h, o = {}) {
  const p = new Path2D(); p.rect(-w / 2, -h / 2, w, h);
  B.paperFill(ctx, p, { seed: 1932, lum: o.lum ?? 1, lx: -w * .1, ly: -h * .3, r: h * .9, fibre: 1 });
  ctx.save(); ctx.textAlign = 'center';
  ctx.fillStyle = rgba(COL.ink2, .8); ctx.font = `600 ${Math.round(w * .022)}px Inter`; ctx.fillText('EVENING EDITION · APRIL 1932', 0, -h * .43);
  ctx.fillStyle = rgba(COL.ink2, .5); ctx.fillRect(-w * .45, -h * .415, w * .9, Math.max(1, h * .002));
  ctx.fillStyle = rgba(COL.ink, .9); ctx.font = `${Math.round(w * .056)}px "Instrument Serif"`; ctx.fillText('INSULL EMPIRE COLLAPSES', 0, -h * .3 + w * .02);
  ctx.fillStyle = rgba(COL.ink2, .5); ctx.fillRect(-w * .45, -h * .27, w * .9, Math.max(1, h * .0025)); ctx.fillRect(-w * .45, -h * .262, w * .9, Math.max(1, h * .0012));
  const cw = w * .9 / 4;
  for (const [c, i, a, sh] of NEWS_COLS) { const yy = -h * .24 + i * h * .0155; if (yy > h * .46) continue; ctx.fillStyle = rgba(COL.ink2, a); ctx.fillRect(-w * .45 + c * cw + cw * .05, yy, cw * (.88 - sh), Math.max(1, h * .005)); }
  ctx.restore();
}
// draw the sheet at its state (screen space). o.clipSky: nothing
export function sheetDraw(ctx, t, T0, o = {}) {
  const s = sheetState(t, T0); if (s.w > 9000) return s;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); sheetFace(ctx, s, o); ctx.restore();
  return s;
}
// the sheet at a state s, in the CURRENT transform (c10 draws the landed newspaper in its world with this)
export function sheetFace(ctx, s, o = {}) {
  ctx.save();
  ctx.translate(s.x, s.y); ctx.rotate(s.rot); ctx.scale(1, s.sy); ctx.translate(0, s.h * .3);   // anchor = headline point
  if (s.landed || s.sy < .99) { ctx.save(); ctx.fillStyle = rgba(P.night0, .45); ctx.filter = 'blur(6px)'; ctx.fillRect(-s.w / 2 + 10, -s.h / 2 + 18, s.w, s.h); ctx.restore(); }
  const c = Math.cos(Math.PI * s.flip), sx = Math.max(.02, Math.abs(c));
  ctx.save(); ctx.scale(sx, 1);
  if (c >= 0) blueprintFace(ctx, s.w, s.h); else { newsFace(ctx, s.w, s.h, { lum: o.lum ?? s.lum }); if (s.dim > 0) { ctx.fillStyle = rgba(P.night0, s.dim); ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h); } }
  ctx.restore();
  const g = Math.max(0, 1 - Math.abs(c) * 4); if (g > 0) halo(ctx, 0, 0, s.w * .5 * g, .4 * g, P.halo0, P.core0);
  if (o.after) o.after(ctx, s);
  ctx.restore();
}

// =====================================================================================================================
// SEAM c10 | c11: the two tickets on the night
// =====================================================================================================================
export const TK = { l: [690, 500], r: [1230, 500], w: 400, rot: [-.035, .03] };
export const TKBOB = 11, tkSway = (t, k) => .02 * Math.sin(t * .9 + k * 2.1);   // the pair floats (never frozen at the plate)
// today's ticket face: B.ticket body + our own rows (no "AI" in the picture). rows: [[text, size share, serif]]
export function ticketNew(ctx, cx, cy, w, rot = 0, o = {}) {
  B.ticket(ctx, cx, cy, w, rot, { lines: ['', ''], sx: o.sx, glow: o.glow, a: o.a, lum: o.lum });
  const h = w * .45, sx = o.sx ?? 1; if (Math.abs(sx) < .02) return;
  if (o.dim > 0) {   // night on the paper (same body as B.ticket: rounded rect minus the two notches)
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sx, 1);
    const p = new Path2D(); p.roundRect(-w / 2, -h / 2, w, h, w * .03); const nb = new Path2D(); nb.arc(-w / 2, 0, h * .12, 0, Math.PI * 2); nb.arc(w / 2, 0, h * .12, 0, Math.PI * 2);
    ctx.fillStyle = rgba(P.night0, o.dim); ctx.fill(p.op(nb, PathOp.Difference)); ctx.restore();
  }
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sx, 1); ctx.textAlign = 'center'; ctx.globalAlpha = o.a ?? 1;
  const rows = o.rows ?? [['1 SEAT', .4, true], ['ARTIFICIAL INTELLIGENCE · EVERY DAY', .075, false]];
  let yy = -h * .2;
  rows.forEach(([txt, sz, serif, k = 1], i) => {
    if (k <= 0) return;
    const size = Math.round(h * sz); yy += size * (i ? 1.25 : .95);
    ctx.save(); ctx.beginPath(); ctx.rect(-w * .5, yy - size * 1.1, w * .72, size * 1.4); ctx.clip();
    ctx.fillStyle = rgba(serif ? COL.ink : COL.ink2, .88); ctx.font = serif ? `${size}px "Instrument Serif"` : `600 ${size}px Inter`;
    ctx.fillText(txt, -w * .14, yy + (1 - expoOut(k)) * size * 1.2); ctx.restore();
  });
  ctx.restore();
}
export const ticketOld = (ctx, cx, cy, w, rot = 0, o = {}) => B.ticket(ctx, cx, cy, w, rot, { lines: ['1d', 'PER MILE · 1844'], lum: .9, ...o });
export function plateTickets(ctx, t, T0) {
  nightBack(ctx, t, { gy: 500, seed: 1011 });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); zoomAt(ctx, Math.exp(PUSH * (t - (T0 - .5))), 960, 500);
  ticketsPair(ctx, t, 1);
  ctx.restore();
}
// the pair as it stands at the seam (both sides use it): glow 0..1 on today's ticket
export function ticketsPair(ctx, t, glow = 1, o = {}) {
  const b = .5 + .5 * Math.sin(t * 1.2);
  ticketOld(ctx, TK.l[0], TK.l[1] + TKBOB * Math.sin(t * .8), TK.w, TK.rot[0] + tkSway(t, 0), { glow: .35 });
  ticketNew(ctx, TK.r[0], TK.r[1] + TKBOB * Math.sin(t * .8 + 1.4), TK.w, TK.rot[1] + tkSway(t, 1), { glow: (.6 + .15 * b) * glow, rows: o.rows });
}

// =====================================================================================================================
// SEAM c11 | c12: the bubble over the data center (the film's first image, once more), with the Perez timeline at rest on the left
// =====================================================================================================================
export const BB = { x: 1340, y: 350, r: 285 };                   // = the first image (sc01 BUB)
export const DCB = { x: 820, y: 885, w: 1100, h: 165 };          // = the first image (sc01 DC)
export const PL_C = [BB.x, BB.y + 120];                           // the plate's zoom centre
// the night of the first image, split so that c11 can draw its parts with their own transforms (identical pixels at the plate)
export function bwSky(ctx, t) {
  ctx.fillStyle = lin(ctx, 0, -300, 0, H, [[0, P.night0], [.55, P.night1], [1, P.ind0]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  ctx.fillStyle = rad(ctx, BB.x, BB.y, 1300, [[0, rgba(P.ind1, .85)], [.5, rgba(P.ind1, .35)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  E.stars(ctx, 1213, 170, t, [-300, -400, W + 600, DCB.y + 100], .7);
}
export function bwGround(ctx, x0 = -W, x1 = 2 * W) {
  ctx.fillStyle = lin(ctx, 0, DCB.y, 0, DCB.y + 400, [[0, mixHex(P.ind1, P.night1, .45)], [.4, P.night1], [1, P.night0]]); ctx.fillRect(x0, DCB.y, x1 - x0, 2 * H);
  ctx.fillStyle = rgba(P.blue0, .4); ctx.fillRect(x0, DCB.y - 1, x1 - x0, 2);
}
export function bwDC(ctx, t, dr = 1, lum = .8) {
  if (dr <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(-W, DCB.y - (DCB.h + 40) * dr, 3 * W, (DCB.h + 40) * dr); ctx.clip();
  B.dataCenter(ctx, DCB.x, DCB.y + (1 - dr) * (DCB.h + 30), DCB.w, DCB.h, t, { lum, rim: .8 });
  ctx.restore();
}
export function bubbleWorld(ctx, t, o = {}) {
  bwSky(ctx, t); bwGround(ctx);
  if (o.mid) o.mid(ctx);
  bwDC(ctx, t, o.dcRise ?? 1, o.lum ?? .8);
}
// ---------- the Perez timeline (c11 ★): waves of technology along the ground line, each a spike (bubble) then a wide warm plateau
// over the evenly spread lights; § = the rules were right (those plateaus stay golden). Coordinates = the plate's (ground y = DCB.y).
export const WAVES = [-1700, -1160, -620, -80, 460].map((x, i) => ({ x, rule: i === 1 || i === 3 || i === 4 }));
export const PZ = { tip: 300, plat: 100, p0: 80, p1: 440, spikeX: BB.x, spikeTop: BB.y + BB.r };
const GY = DCB.y;
export const PZ_PATH = (() => {   // the polyline (x monotonic) of the whole line, from the left to the bubble's spike
  const a = [[-2300, GY]];
  for (const w of WAVES) a.push([w.x - 34, GY], [w.x, GY - PZ.tip], [w.x + 34, GY], [w.x + PZ.p0, GY], [w.x + PZ.p0 + 26, GY - PZ.plat], [w.x + PZ.p1 - 26, GY - PZ.plat], [w.x + PZ.p1, GY]);
  a.push([PZ.spikeX - 44, GY]);
  return a;
})();
export const DOTS = (() => { const a = []; for (let x = -4300; x <= 1800; x += 64) a.push(x); return a; })();
// st: { lx (the line is drawn up to x), fill 0..1 per wave by lx, gold 0..1, rules 0..1, sink 0..1 (c12), spike 0..1 (the last spike up to the
// bubble), dots(i) → 0..1 (each light's arrival), hall (x of the Davos hall, the lights come from there) }
export function perez(ctx, t, st = {}) {
  const lx = st.lx ?? 1e9, gold = st.gold ?? 1, rules = st.rules ?? 1, sink = st.sink ?? 0, spike = st.spike ?? 1;
  ctx.save();
  ctx.beginPath(); ctx.rect(-9000, -3000, 20000, 3000 + GY + 1); ctx.clip();            // nothing below the ground (it sinks into it)
  ctx.translate(0, sink * (PZ.tip + 80));
  // the plateaus (fill under the line) and their small figures
  WAVES.forEach((w, i) => {
    const k = clamp((lx - (w.x + PZ.p0)) / (PZ.p1 - PZ.p0)); if (k <= 0) return;
    const off = w.rule ? 0 : rules, x0 = w.x + PZ.p0 + 13, x1 = lerp(x0, w.x + PZ.p1 - 13, k);
    const col = mixHex(mixHex(P.halo1, P.core1, gold * .5), P.blue1, off);
    ctx.fillStyle = lin(ctx, 0, GY - PZ.plat, 0, GY, [[0, rgba(col, (.2 + .5 * gold) * (1 - .6 * off))], [1, rgba(col, .05 + .12 * gold * (1 - off))]]); ctx.fillRect(x0, GY - PZ.plat, x1 - x0, PZ.plat);
    if (gold > 0 && off < 1) halo(ctx, (x0 + x1) / 2, GY - PZ.plat * .6, 260, .22 * gold * (1 - off), P.halo1, P.halo2);
    // the small figures under it (rise from the ground)
    for (let j = 0; j < 6; j++) {
      const fx = lerp(w.x + PZ.p0 + 50, w.x + PZ.p1 - 50, j / 5), fk = clamp((lx - fx) / 60) * (1 - .0 * off); if (fk <= 0) continue;
      const fh = 34 * fk, lit = mixHex(P.night1, mixHex(P.halo1, P.blue0, off), .35 + .4 * gold * (1 - off));
      ctx.fillStyle = lit; ctx.beginPath(); ctx.roundRect(fx - 6, GY - fh * .78, 12, fh * .8, 5); ctx.fill();
      ctx.beginPath(); ctx.arc(fx, GY - fh * .9, fh * .14, 0, 6.29); ctx.fill();
    }
    // § before the plateau: the rule (on "rules were right")
    if (w.rule && rules > 0) {
      const sx = w.x + PZ.p0 - 4, sy = GY - PZ.plat - 70, u = rise(rules);
      ctx.save(); ctx.translate(sx, sy + (1 - u) * 20); ctx.globalAlpha = u;
      ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.arc(0, 0, 24, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(P.halo2, .9); ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = P.cream; ctx.font = '36px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.fillText('§', 0, 12); ctx.restore();
      halo(ctx, sx, sy, 60, .3 * u, P.halo1, P.core0);
    }
  });
  // the evenly spread lights on the ground
  if (st.dots) DOTS.forEach((x, i) => { const u = st.dots(i, x); if (u <= 0) return; const [dx, dy] = u < 1 ? st.dotPos(i, x, u) : [x, GY - 5];
    halo(ctx, dx, dy, 22, .5, P.halo1, P.core0); ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(dx, dy, 3, 0, 6.29); ctx.fill(); });
  // the line itself (light on the night), drawn up to lx; the last spike rises to the bubble
  ctx.save(); ctx.beginPath(); ctx.rect(-9000, -3000, lx + 9000, 6000); ctx.clip();
  const pth = new Path2D(); PZ_PATH.forEach(([x, y], i) => (i ? pth.lineTo(x, y) : pth.moveTo(x, y)));
  if (spike > 0) { pth.lineTo(PZ.spikeX - 6, lerp(GY, PZ.spikeTop, spike)); pth.lineTo(PZ.spikeX + 6, lerp(GY, PZ.spikeTop, spike)); pth.lineTo(PZ.spikeX + 44, GY); pth.lineTo(PZ.spikeX + 600, GY); }
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(P.halo1, .25); ctx.lineWidth = 9; ctx.stroke(pth);
  ctx.strokeStyle = mixHex(P.halo2, P.core1, .4); ctx.lineWidth = 3; ctx.stroke(pth);
  ctx.restore();
  ctx.restore();
}
export function plateBubble(ctx, t, T0, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); zoomAt(ctx, Math.exp(PUSH * (t - (T0 - .5))), PL_C[0], PL_C[1]);
  bubbleWorld(ctx, t, { mid: (c) => perez(c, t, { dots: () => 1 }) });
  B.bubble(ctx, BB.x, BB.y, BB.r, t, { tremble: .25 });
  ctx.restore();
}
