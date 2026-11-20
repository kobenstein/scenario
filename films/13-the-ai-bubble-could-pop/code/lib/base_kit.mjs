// Generic additions to the editorial-night kit, carried over from Film 13 "free time" (lib/f10_editorial.mjs stays the base).
//   trailSpan()   a trail drawn between two arc-length shares (u0..u1): a line that grows at its head and retracts at its tail
//   maskLine()    one line of type revealed from (or sunk below) an invisible baseline; segments can glow warm (gold) instead of cream
//   measure()     text width for a size / font
//   textGrains()  the pixel positions of a word set in a font, sampled ONCE (cached), so type can crumble into grains
//   sandGrains()  draw grains that leave those positions, fall under gravity and land on a target line
// (The free-time motifs hourglass() and ledge() are removed: this film has its own motifs in lib/bubble_kit.mjs.)
// Rules as in the base kit: no canvas or pattern per frame (one scratch canvas is created once for textGrains), seeded randomness only.
import { Path2D, PathOp, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, expoOut, glowFill, halo, dust, lin, rad, prng } = E;

// the print finish (approved with the Film 13 free-time style test 28.10.): entry = { t, draw, print: PRINT13 }
export const PRINT13 = { grain: 14, floor: 4, vig: .5 };

// ---------- a trail between two shares of its length (thread grows at the head, retracts at the tail) ----------
export function trailSpan(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = (d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], clamp(f)), lerp(pts[i - 1][1], pts[i][1], clamp(f)), i]; };
  const [sx, sy, i0] = at(u0 * T), [ex, ey, i1] = at(u1 * T), sub = [[sx, sy]];
  for (let i = i0; i < i1; i++) sub.push([pts[i][0], pts[i][1]]);
  sub.push([ex, ey]);
  const w = o.w ?? 3, a = o.a ?? 1;
  for (const [k, al, col, op, bl] of [[5, .25, P.halo1, 'lighter', true], [2.2, .8, P.halo0, 'source-over', false], [1, 1, P.core0, 'source-over', false]]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = col; ctx.globalAlpha = al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (bl) ctx.filter = `blur(${w * 2}px)`;
    ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  }
  if (o.spark !== false && u1 < 1) halo(ctx, ex, ey, w * 12, .75 * a);
  return [ex, ey];
}

// ---------- type: one line, revealed from an invisible baseline (u 0 → 1) or sunk below it (u 1 → 0) ----------
// segs: [[text, warm 0..1], …] set left to right; serif (Instrument Serif) by default. Returns { w, xs: [segment x starts] }.
const MEAS = createCanvas(8, 8).getContext('2d');
export function measure(s, size, serif = true, weight = 600) { MEAS.font = serif ? `${size}px "Instrument Serif"` : `${weight} ${size}px Inter`; return MEAS.measureText(s).width; }
export function maskLine(ctx, segs, x, y, size, u, o = {}) {
  const serif = o.serif ?? true, k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15;
  let xx = x; const xs = [];
  const total = segs.reduce((s, [txt]) => s + measure(txt, size, serif, o.weight), 0);
  if (o.align === 'center') xx = x - total / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(xx - size, y - size * 1.25, total + size * 2, size * 1.25 + size * .32); ctx.clip();   // the invisible baseline mask
  for (const [txt, warm] of segs) {
    xs.push(xx);
    const col = warm > 0 ? mixHex(o.col ?? P.cream, P.halo0, clamp(warm)) : (o.col ?? P.cream);
    E.glowText(ctx, txt, xx, y + dy, { size, serif, col, weight: o.weight, glow: o.glow ?? true });
    if (warm > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glowText(ctx, txt, xx, y + dy, { size, serif, col: rgba(P.halo0, .35 * warm), weight: o.weight }); ctx.restore(); }
    xx += measure(txt, size, serif, o.weight);
  }
  ctx.restore();
  return { w: total, xs, x0: xs[0] };
}

// ---------- type → sand: glyph pixels sampled once ----------
const GRAINS = new Map();
let SCR = null;
export function textGrains(s, size, serif = true, step = 3) {
  const key = `${s}|${size}|${serif}|${step}`; if (GRAINS.has(key)) return GRAINS.get(key);
  const w = Math.ceil(measure(s, size, serif)) + 20, hh = Math.ceil(size * 1.5);
  if (!SCR || SCR.width < w || SCR.height < hh) SCR = createCanvas(Math.max(w, SCR?.width || 0), Math.max(hh, SCR?.height || 0));
  const x = SCR.getContext('2d'); x.clearRect(0, 0, SCR.width, SCR.height); x.fillStyle = '#fff'; x.font = serif ? `${size}px "Instrument Serif"` : `600 ${size}px Inter`; x.textBaseline = 'alphabetic';
  x.fillText(s, 10, size * 1.1);
  const d = x.getImageData(0, 0, w, hh).data, out = [], r = prng(size * 13 + s.length);
  for (let yy = 0; yy < hh; yy += step) for (let xx = 0; xx < w; xx += step) if (d[(yy * w + xx) * 4 + 3] > 110) out.push([xx - 10 + (r() - .5) * step, yy - size * 1.1 + (r() - .5) * step, r(), r()]);
  GRAINS.set(key, out); return out;
}
// grains start at (x + gx, y + gy) and fall: u 0..1 over the fall, staggered left → right by a per-grain delay; land at yLand,
// pulled toward xLand (a funnel) when given. Gold, the brightest specks in the frame.
export function sandGrains(ctx, grains, x, y, u, o = {}) {
  const yLand = o.yLand ?? y + 600, a = o.a ?? 1, spread = o.stagger ?? .45;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [gx, gy, r1, r2] of grains) {
    const d = (gx / (o.width ?? 400)) * spread * .6 + r1 * spread * .4, k = clamp((u - d) / (1 - spread));
    if (k >= 1) continue;
    const fall = k * k, px = x + gx + (o.xLand != null ? (o.xLand - x - gx) * smooth(k) * (o.funnel ?? .85) : 0) + Math.sin(r2 * 9 + k * 4) * 6 * k;
    const py = lerp(y + gy, yLand, fall);
    ctx.fillStyle = k > 0 ? (r2 > .5 ? P.core1 : P.halo0) : P.core0; ctx.globalAlpha = a * (k > 0 ? 1 - .5 * k : 1);
    const s = k > 0 ? 2.2 : 2.6; ctx.fillRect(px - s / 2, py - s / 2, s, s * (1 + 2.5 * k));
  }
  ctx.restore();
}
