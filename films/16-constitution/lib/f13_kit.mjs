// Film 13 · additions to the editorial-night kit (lib/f10_editorial.mjs stays the base; import both).
//   hourglass()   the through-line object: an hourglass whose SAND IS THE LIGHT (gold), glass and frame as dark flat shapes with rim
//   trailSpan()   a trail drawn between two arc-length shares (u0..u1): a thread that grows at its head and retracts at its tail
//   maskLine()    one line of type revealed from (or sunk below) an invisible baseline; segments can glow warm (gold) instead of cream
//   textGrains()  the pixel positions of a word set in a font, sampled ONCE (cached), so type can crumble into sand
//   sandGrains()  draw grains that leave those positions, fall under gravity and land on a target line
//   ledge()       the flat cliff edge with a lit rim (the hook's stage)
// Rules as in the base kit: no canvas or pattern per frame (one scratch canvas is created once for textGrains), seeded randomness only.
import { Path2D, PathOp, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, expoOut, glowFill, halo, dust, lin, rad, prng } = E;

// the print finish for every Film 13 entry (approved with the style test 28.10.): entry = { t, draw, print: PRINT13 }
export const PRINT13 = { grain: 14, floor: 4, vig: .5 };

// ---------- the hourglass ----------
// local units: height 1, origin = centre of the base, up = -y. Glass profile built once (cubic beziers, mirrored).
const HG = (() => {
  const R = [   // right half, top attach → neck → bottom attach
    [.105, -.94], [.215, -.925, .238, -.80, .205, -.70], [.172, -.615, .052, -.565, .021, -.5],
    [.052, -.435, .172, -.385, .205, -.30], [.238, -.20, .215, -.075, .105, -.06],
  ];
  const glass = new Path2D(); glass.moveTo(R[0][0], R[0][1]);
  for (const c of R.slice(1)) glass.bezierCurveTo(...c);
  glass.lineTo(-.105, -.06);   // left half: the right half walked backwards, mirrored in x
  glass.bezierCurveTo(-.215, -.075, -.238, -.20, -.205, -.30); glass.bezierCurveTo(-.172, -.385, -.052, -.435, -.021, -.5);
  glass.bezierCurveTo(-.052, -.565, -.172, -.615, -.205, -.70); glass.bezierCurveTo(-.238, -.80, -.215, -.925, -.105, -.94); glass.closePath();
  // the frame as separate parts (no path union: a union with an inner hole filled the whole box): two plates, two posts, two feet
  const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };
  const frame = [rr(-.32, -1, .64, .05, .016), rr(-.32, -.05, .64, .05, .016), rr(-.302, -.955, .026, .91, .01), rr(.276, -.955, .026, .91, .01)];
  return { glass, frame };
})();
const M = (x, y, h) => ({ a: h, b: 0, c: 0, d: h, e: x, f: y });
const tp = (p, m) => { const q = new Path2D(); q.addPath(p, m); return q; };
// o: { top 0..1 (sand in the upper bulb), bot 0..1 (lower pile), flow 0..1 (the stream; 0 = none), hold (y share 0..1 where a
//      falling stream stops in mid-air: the "frozen" sand), crack 0..1, a, glow (aura scale), light ±1 (side of the key light),
//      leak: { u, pts } a stream that leaves through the crack along pts (caller space) }
// returns { neck:[x,y], topY, botPeak:[x,y], glassPath, sandTop, stream:[[x,y],[x,y]] } in caller space
export function hourglass(ctx, x, y, h, t, o = {}) {
  const a = o.a ?? 1, top = clamp(o.top ?? .7), bot = clamp(o.bot ?? .25), flow = clamp(o.flow ?? 1), m = M(x, y, h), L = o.light ?? 1;
  const glass = tp(HG.glass, m), frame = HG.frame;
  const yN = y - .5 * h, xN = x;
  // sand in the upper bulb: from the neck up to the level, the surface dips toward the neck while it drains
  const yT = lerp(-.52, -.885, top), dip = .05 * flow * (1 - top * .4);
  const st = new Path2D(); st.moveTo(-.3, yT); st.quadraticCurveTo(0, yT + dip * 2, .3, yT); st.lineTo(.3, -.49); st.lineTo(-.3, -.49); st.closePath();
  const sandTop = top > .01 ? tp(st.op(HG.glass, PathOp.Intersect), m) : null;
  // the pile in the lower bulb: a soft cone
  const yB = lerp(-.07, -.40, bot), yS = lerp(-.07, -.26, bot * bot);
  const sb = new Path2D(); sb.moveTo(-.3, -.05); sb.lineTo(-.3, yS + .02); sb.bezierCurveTo(-.18, yS, -.07, yB + .02, 0, yB); sb.bezierCurveTo(.07, yB + .02, .18, yS, .3, yS + .02); sb.lineTo(.3, -.05); sb.closePath();
  const sandBot = bot > .01 ? tp(sb.op(HG.glass, PathOp.Intersect), m) : null;
  const botPeak = [x, y + yB * h];
  ctx.save(); ctx.globalAlpha = a;
  // 1 · the light the sand gives: blue aura round the glass, warm glow round the sand (the sand is the brightest thing)
  const gl = o.glow ?? 1;
  glowFill(ctx, glass, h * .32 * gl, .5 * a, P.blue0);
  if (sandTop) { glowFill(ctx, sandTop, h * .16 * gl, .75 * a, P.halo1); glowFill(ctx, sandTop, h * .04, .55 * a, P.halo0); }
  if (sandBot) glowFill(ctx, sandBot, h * .1 * gl, .5 * a, P.halo1);
  halo(ctx, x, y - .5 * h, h * .75 * gl, .22 * a, P.halo1, P.halo0);
  // 2 · the glass: a faint blue body, lighter on the light side, a cream edge and two curved highlights
  ctx.fillStyle = lin(ctx, x - .24 * h * L, 0, x + .24 * h * L, 0, [[0, rgba(P.blue0, .12)], [.6, rgba(P.blue1, .2)], [1, rgba(P.cream, .16)]]); ctx.fill(glass);
  // 3 · the sand: hot core at the neck, gold toward the walls, a darker gold at the glass (volume), stipple dust
  const sandFill = (p, cx, cy, r) => {
    ctx.fillStyle = rad(ctx, cx, cy, r, [[0, P.core0], [.18, P.core0], [.38, P.core1], [.7, P.halo0], [1, P.halo1]]); ctx.fill(p);
    ctx.save(); ctx.clip(p); ctx.filter = `blur(${h * .012}px)`; ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = h * .03; ctx.stroke(glass); ctx.restore();
  };
  if (sandTop) sandFill(sandTop, x, y - .52 * h, h * .36);
  if (sandBot) sandFill(sandBot, x, botPeak[1] + .02 * h, h * .34);
  // 4 · the stream: a thread of light from the neck down to the pile (or stopped in mid-air: o.hold)
  let stream = null;
  if (flow > 0) {
    const yEnd = lerp(yN, botPeak[1], o.hold != null ? clamp(o.hold) : 1), y0 = lerp(yEnd, yN, flow);
    stream = [[xN, y0], [xN, yEnd]];
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(P.halo0, .5 * a); ctx.lineWidth = Math.max(2, h * .016); ctx.filter = `blur(${h * .01}px)`; ctx.beginPath(); ctx.moveTo(xN, y0); ctx.lineTo(xN, yEnd); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.strokeStyle = rgba(P.core0, a); ctx.lineWidth = Math.max(1.2, h * .006); ctx.beginPath(); ctx.moveTo(xN, y0); ctx.lineTo(xN, yEnd); ctx.stroke();
    // grains along the thread (seeded, moving down)
    const r = prng(7); ctx.fillStyle = P.core1;
    for (let i = 0; i < 14; i++) { const ph = (r() + t * (.9 + r() * .4)) % 1, gy = lerp(y0, yEnd, ph); ctx.globalAlpha = a * (.5 + .5 * r()); ctx.fillRect(xN + (r() - .5) * h * .012, gy, 1.6, 1.6); }
    ctx.restore();
    if (o.hold == null && bot > 0) halo(ctx, botPeak[0], botPeak[1], h * .07, .7 * a * flow, P.halo0, P.core0);   // where it lands
  }
  // the leak (5.05): the thread leaves through a crack along a caller path
  if (o.leak && o.leak.u > 0) trailSpan(ctx, o.leak.pts, Math.max(0, o.leak.u - .55), o.leak.u, { w: Math.max(1.2, h * .006), a });
  // 5 · glass edge and highlights (over the sand: the glass is in front)
  ctx.save(); ctx.strokeStyle = rgba(P.cream, .38); ctx.lineWidth = Math.max(1, h * .005); ctx.stroke(glass);
  ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.cream, .22); ctx.lineWidth = Math.max(1.5, h * .012); ctx.lineCap = 'round';
  for (const [y0, y1, xx] of [[-.86, -.66, -.15], [-.40, -.18, -.15]]) { ctx.beginPath(); ctx.moveTo(x + xx * h * L, y + y0 * h); ctx.quadraticCurveTo(x + (xx - .045) * h * L, y + (y0 + y1) / 2 * h, x + xx * h * L, y + y1 * h); ctx.stroke(); }
  ctx.restore();
  if (o.crack > 0) {   // a hairline crack in the upper bulb (accent: it runs fast, then stays)
    const c = clamp(o.crack), pts = [[.16, -.78], [.12, -.72], [.135, -.67], [.09, -.62], [.1, -.585]];
    ctx.save(); ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = Math.max(1, h * .004); ctx.beginPath();
    const n = 1 + (pts.length - 1) * c; for (let i = 0; i < Math.ceil(n); i++) { const k = Math.min(1, n - i), p = i ? pts[i - 1] : pts[0], q = pts[i]; const px = lerp(p[0], q[0], k), py = lerp(p[1], q[1], k); i ? ctx.lineTo(x + px * h * L, y + py * h) : ctx.moveTo(x + q[0] * h * L, y + q[1] * h); }
    ctx.stroke(); ctx.restore();
  }
  // 6 · the frame: dark indigo plates and posts; the key light (blue) on the outer edge, the sand's warm light on the faces near the glass
  for (const fp of frame) {
    const part = tp(fp, m), [x0, y0, x1, y1] = part.getBounds();
    ctx.fillStyle = lin(ctx, x - .33 * h * L, 0, x + .33 * h * L, 0, [[0, P.night1], [.55, P.ind2], [1, mixHex(P.ind2, P.blue1, .55)]]); ctx.fill(part);
    ctx.save(); ctx.clip(part); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, x, y - .5 * h, h * .6, [[0, rgba(P.halo0, .6 * (top + bot) * .7)], [.55, rgba(P.halo1, .14)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.fillStyle = rgba(P.blue0, .9); if (L > 0) ctx.fillRect(x1 - Math.max(1.2, h * .006), y0, Math.max(1.2, h * .006), y1 - y0); else ctx.fillRect(x0, y0, Math.max(1.2, h * .006), y1 - y0);
    ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(x0, y0, x1 - x0, Math.max(1, h * .004));
    ctx.restore();
  }
  ctx.restore();
  return { neck: [xN, yN], topY: y + yT * h, botPeak, glassPath: glass, stream, top: [x, y - .94 * h], base: [x, y] };
}

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
    if (warm > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glowText(ctx, txt, xx, y + dy, { size, serif, col: rgba(P.halo0, .35), a: clamp(warm), weight: o.weight }); ctx.restore(); }   // a (not the colour alpha) also scales the shadow: no step on the first warm frame
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

// ---------- the hook's stage: a flat cliff ledge with a lit rim ----------
export function ledge(ctx, x0, y0, x1, y1, o = {}) {
  // top edge: a soft lip at x0 that rolls over into the cliff face, then a gentle line to x1 (ledgeY follows it within ~2 px)
  const top = (p) => { p.moveTo(x0 - 70, y0 + 300); p.bezierCurveTo(x0 - 58, y0 + 120, x0 - 40, y0 + 16, x0 + 20, y0 + 1); p.lineTo(x1, y1); };
  const body = new Path2D(); top(body); body.lineTo(x1, 2200); body.lineTo(x0 - 80, 2200); body.closePath();
  ctx.fillStyle = lin(ctx, 0, Math.min(y0, y1), 0, Math.min(y0, y1) + 420, [[0, P.ind1], [.07, P.night1], [1, P.night0]]); ctx.fill(body);
  ctx.fillStyle = lin(ctx, x0 - 80, 0, x0 + 60, 0, [[0, rgba(P.night0, .9)], [1, rgba(P.night0, 0)]]); ctx.fill(body);   // the cliff face falls into shadow
  const rim = new Path2D(); rim.moveTo(x0 - 46, y0 + 40); rim.bezierCurveTo(x0 - 36, y0 + 12, x0 - 20, y0 + 2, x0 + 20, y0 + 1); rim.lineTo(x1, y1);
  ctx.save(); ctx.strokeStyle = lin(ctx, x0, 0, x1, 0, o.rimStops || [[0, rgba(P.blue0, .9)], [.35, rgba(P.halo1, .8)], [.6, rgba(P.halo1, .55)], [1, rgba(P.blue0, .7)]]);
  ctx.lineWidth = o.rimW ?? 4; ctx.lineCap = 'round'; ctx.stroke(rim); ctx.restore();
}
export const ledgeY = (x0, y0, x1, y1, x) => lerp(y0, y1, clamp((x - x0) / (x1 - x0)));
