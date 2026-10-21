// c09 · 9.07 ★ "Which tells you exactly where to go": the amber curve runs off the card's edge into the night, keeps rising,
// arcs over the roofs and flows into the left foot of the Maslow hill across the bay; from there the hill's own build (lib/maslow4.mjs
// st.build: an amber outline round the silhouette, then the terraces rise out of the dark from the quay up) carries it on, the labels
// print in, and the camera lands on VIEW H2.
// The hill is drawn only by lib/maslow4.mjs drawHill(). On top of it this file only darkens the hill's reflection in the water while the
// hill above is still dark (the reflection follows the reveal front, mirrored), so nothing shows in the water that is not yet on the hill.
// Once the build and the labels are complete the frame is drawHill(VIEWS.H2) and nothing else.
import { W, H, clamp, mix } from '../engine.mjs';
import { drawHill, VIEWS, HILL, toScreen, hillOutline } from './maslow4.mjs';
import { camFar, hillPt, FAR } from './v2_c09_court.mjs';

export const HOUT = hillOutline();                 // world (hill units): left foot → summit → right foot (drawHill draws its build line along it)
// the head of the build's amber line: drawHill draws N = floor(len·b/.35) points (≥ 2) → [head, the point before]
export function outlineHead(b) { const uo = clamp(b / .35), N = Math.max(2, Math.floor(HOUT.length * uo)); return [HOUT[N - 1], HOUT[N - 2]]; }

// B: { build 0..1, labels 0..1 } (null → the finished H2 frame)
export function farField(ctx, t, cam, B) {
  const cf = camFar(cam), st = VIEWS.H2.st, b = B ? clamp(B.build) : 1, la = B ? clamp(B.labels) : st.labels;
  if (b >= 1 && la >= st.labels) { drawHill(ctx, t, cf, st); return; }
  drawHill(ctx, t, cf, { ...st, build: b, labels: la, buildFix: true });   // buildFix: no stub at b=0, dark reflection, rim fades
}
// the visible piece [a, b] of a polyline (fractions of its length)
export function sliceLen(pts, a, b) {
  const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = d[d.length - 1], s0 = clamp(a) * L, s1 = clamp(b) * L, out = [], at = (s) => { let i = 1; while (i < d.length - 1 && d[i] < s) i++; const q = (s - d[i - 1]) / ((d[i] - d[i - 1]) || 1); return [mix(pts[i - 1][0], pts[i][0], q), mix(pts[i - 1][1], pts[i][1], q)]; };
  if (s1 <= s0) return [];
  out.push(at(s0)); for (let i = 0; i < pts.length; i++) if (d[i] > s0 && d[i] < s1) out.push(pts[i]); out.push(at(s1));
  return out;
}
// the amber foil line: a warm glow under a bright core
export function amberStroke(ctx, pts, w) {
  if (pts.length < 2) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };
  ctx.globalCompositeOperation = 'lighter';
  path(); ctx.strokeStyle = 'rgba(255,150,60,.14)'; ctx.lineWidth = w * 5; ctx.stroke();
  path(); ctx.strokeStyle = 'rgba(255,170,80,.28)'; ctx.lineWidth = w * 2.2; ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  path(); ctx.strokeStyle = '#ffb35c'; ctx.lineWidth = w; ctx.stroke();
  path(); ctx.strokeStyle = 'rgba(255,241,214,.85)'; ctx.lineWidth = Math.max(.8, w * .35); ctx.stroke();
  ctx.restore();
}
// the same line with a width that tapers along it (w0 at the start → w1 at the end) and a hot core that cools (hot0 → hot1): each layer is
// one filled ribbon (no overlapping strokes, so the additive glow has no beads); used where the line hands over to the hill's thinner outline
export function amberTaper(ctx, pts, w0, w1, hot0 = 1, hot1 = 0) {
  if (pts.length < 2) return;
  const n = pts.length, d = [0]; for (let i = 1; i < n; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = d[n - 1] || 1, nr = pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
  const ribbon = (k) => {
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const hw = mix(w0, w1, d[i] / L) * k / 2; const x = pts[i][0] + nr[i][0] * hw, y = pts[i][1] + nr[i][1] * hw; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    const he = w1 * k / 2, ae = Math.atan2(nr[n - 1][1], nr[n - 1][0]); ctx.arc(pts[n - 1][0], pts[n - 1][1], he, ae, ae - Math.PI, false);
    for (let i = n - 1; i >= 0; i--) { const hw = mix(w0, w1, d[i] / L) * k / 2; ctx.lineTo(pts[i][0] - nr[i][0] * hw, pts[i][1] - nr[i][1] * hw); }
    const hs = w0 * k / 2, as = Math.atan2(-nr[0][1], -nr[0][0]); ctx.arc(pts[0][0], pts[0][1], hs, as, as - Math.PI, false);
    ctx.closePath();
  };
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ribbon(5); ctx.fillStyle = 'rgba(255,150,60,.14)'; ctx.fill();
  ribbon(2.2); ctx.fillStyle = 'rgba(255,170,80,.28)'; ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ribbon(1); ctx.fillStyle = '#ffb35c'; ctx.fill();
  if (Math.max(hot0, hot1) > 0) {   // the hot core, cooling along the line (drawn in pieces; its own alpha only, no glow)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 1; i < n; i++) { const u = d[i] / L, h = mix(hot0, hot1, u); if (h <= .01) continue; ctx.strokeStyle = `rgba(255,241,214,${.85 * h})`; ctx.lineWidth = Math.max(.8, mix(w0, w1, u) * .35); ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
  }
  ctx.restore();
}
export { hillPt, FAR };
