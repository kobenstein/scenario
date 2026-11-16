// Film 13 · B2 graphics built from the film's own elements (BRIEF §3): the haze inside the glass (seam B1 → B2) that opens as the
// camera sinks through it, the rolling year stamp, the clock dial whose gold work arc shrinks 8 → 6 and frees two hour discs, the
// tape reels, the light halves (output / life), the glyphs of light for the town map, a falling sand stream.
// Rules: no canvas / pattern per frame, seeded randomness only, nothing fades in: things grow, rise from a baseline or are drawn.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, rad, lin, halo, drift, prng } = E;

// ---------------------------------------------------------------------------------------------- the glass haze (seam plate B1 → B2)
// Identical to lib/f13_seams.mjs plateGlass at k = 0 (same stops, glass arcs, thread, grains). k 0..1: a SHORT shape match (Jakob
// 28.10.: no journey into the glass): the gold haze and the glass arcs condense sideways into the falling thread, which stays.
// Over a caller background that is P.night0 where the haze was (the caller warms its sky afterwards).
const GR = (() => { const r = prng(1307), g = []; for (let i = 0; i < 90; i++) g.push([r(), r() * 2 - 1, .8 + r() * 1.6, r()]); return g; })();
const HAZE = [[0, P.halo0], [.14, P.halo1], [.3, mixHex(P.shade0, P.ind1, .35)], [.5, P.ind1], [.75, P.ind0], [1, P.night0]];
export function glassHaze(ctx, t, k = 0, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const cy = 470 + 6 * drift(t, 1, 3), x0 = plateThreadX(t), sx = Math.max(.002, 1 - k);
  if (k <= 0) { ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.fillStyle = rad(ctx, 960, cy, 1150, HAZE); ctx.fillRect(0, 0, W, H); }
  else {
    ctx.save(); ctx.translate(x0, 0); ctx.scale(sx, 1 - .25 * k); ctx.translate(-x0, 0);
    ctx.fillStyle = rad(ctx, 960, cy, 1150, HAZE.map(([x, c]) => [x, rgba(c, x < .8 ? 1 : 1 - (x - .8) / .2)])); ctx.fillRect(-W, -H, 3 * W, 3 * H);
    ctx.restore();
  }
  // the curved glass wall highlights, squeezed with the haze
  ctx.save(); ctx.translate(x0, 0); ctx.scale(sx, 1); ctx.translate(-x0, 0); ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(P.core1, .32); ctx.lineWidth = 5 / Math.max(sx, .2); ctx.beginPath(); ctx.ellipse(960, 640, 760, 760, 0, Math.PI * .78, Math.PI * 1.18); ctx.stroke();
  ctx.strokeStyle = rgba(P.core1, .14); ctx.lineWidth = 3 / Math.max(sx, .2); ctx.beginPath(); ctx.ellipse(960, 640, 760, 760, 0, -Math.PI * .16, Math.PI * .1); ctx.stroke();
  ctx.restore();
  if (o.thread !== false) {
    const tw = clamp(o.tw ?? 1);                      // tw < 1: the glow of the thread narrows into the bare core line (the river thread)
    for (const [w, a, c, b] of [[26 * tw, .22, P.halo1, 12 * tw], [lerp(2.4, 7, tw), .7, P.halo0, 0], [2.4, 1, P.core0, 0]]) {
      if (w < .3) continue;
      ctx.save(); if (b > .5) ctx.filter = `blur(${b}px)`; ctx.strokeStyle = rgba(c, a); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x0, -20); ctx.lineTo(x0, H + 20); ctx.stroke(); ctx.restore();
    }
  }
  if (o.grains !== false) plateGrains(ctx, t, o.grainsUntil, o.xAt);
  ctx.restore();
}
export const plateThreadX = (t) => 960 + 1.5 * drift(t * .7, 1, 9);
// the grains of the plate, falling along the thread; after `until` no grain starts a new cycle (they fall out of the frame)
export function plateGrains(ctx, t, until = Infinity, xAt = null) {
  const x0 = plateThreadX(t);
  for (const [u, s, r, ph] of GR) {
    const v = 420 * (.8 + .4 * ph), raw = u * (H + 80) + t * v, cyc = Math.floor(raw / (H + 80)), y = (raw % (H + 80)) - 40;
    if (until !== Infinity) { const tStart = (cyc * (H + 80) - u * (H + 80)) / v; if (tStart > until) continue; }
    const x = xAt ? xAt(y) : x0;
    ctx.fillStyle = rgba(P.core1, .55 + .4 * ph); ctx.beginPath(); ctx.arc(x + s * 9, y, r, 0, 6.29); ctx.fill();
  }
}

// ---------------------------------------------------------------------------------------------- type helpers
// a stamp line (Inter caps, spaced), risen from its baseline (u 0..1), or sunk (u falling)
// Phone-legible (coordinator 28.10.): at least 56 px (≈ 40 px cap height); the visible rise and sink follow a smoothstep of u
// (maskLine eases u with expoOut, which made exits drop in their last frames), so a stamp leaves as calmly as it came.
export const LBL = 60;
export function stamp(ctx, s, x, y, u, o = {}) {
  if (u <= 0) return;
  const k = clamp(u), e = k * k * (3 - 2 * k), uu = e >= 1 ? 1 : -Math.log2(1 - e * .999) / 10;
  K.maskLine(ctx, [[s, 0]], x, y, Math.max(o.size ?? LBL, 56), uu, { serif: false, col: o.col ?? P.halo2, glow: false, align: o.align });
}
// the year stamp: digits roll (each wheel turns from `from` to `to`, staggered), Instrument Serif, cream with a warm glow
export function yearRoll(ctx, x, y, size, from, to, u, o = {}) {
  const a = String(from), b = String(to), n = Math.max(a.length, b.length), dw = K.measure('0', size) * 1.02;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 20, y - size * 1.02, n * dw + 40, size * 1.28); ctx.clip();
  for (let i = 0; i < n; i++) {
    const d0 = Number(a[i] ?? 0), d1 = Number(b[i] ?? 0), steps = (d1 - d0 + 10) % 10 + (i < 2 ? 0 : 10);
    const k = expoOut(span(u, i * .08, .6 + i * .1)), pos = d0 + steps * k, base = Math.floor(pos), f = pos - base;
    for (const [dig, off] of [[base % 10, -f], [(base + 1) % 10, 1 - f]]) {
      if (Math.abs(off) >= 1) continue;
      E.glowText(ctx, String(dig), x + i * dw, y + off * size * 1.15, { size, serif: true, a: o.a ?? 1 });
    }
  }
  ctx.restore();
  return n * dw;
}

// ---------------------------------------------------------------------------------------------- the clock dial (7.04, 8.05, 8.07)
const clockAng = (h) => (h % 12) / 12 * Math.PI * 2 - Math.PI / 2;   // canvas angle of an hour on the dial
// the gold work arc along the rim from hour h0 for `len` hours (len may shrink): a thick band of light
export function workArc(ctx, cx, cy, R, h0, len, t, o = {}) {
  if (len <= .01) return;
  const a0 = clockAng(h0), a1 = a0 + len / 12 * Math.PI * 2, w = R * (o.w ?? .13), rr = R * (o.r ?? 1.16);
  const p = new Path2D(); p.arc(cx, cy, rr, a0, a1); const band = p.stroke({ width: w, cap: 1, join: 1 });
  E.lightShape(ctx, band, t, { lit: o.lit ?? 1, dust: 0, glow: .5, a: o.a ?? 1 });
  return { a0, a1, rr };
}
// the base track (the 12 hours) as a faint cool ring
export function dialTrack(ctx, cx, cy, R, u = 1, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.strokeStyle = rgba(mixHex(P.blue2, P.cream, .3), .45 * (o.a ?? 1)); ctx.lineWidth = Math.max(1.5, R * .02); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(cx, cy, R * (o.r ?? 1.16), -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * expoOut(u)); ctx.stroke();
  for (let i = 0; i < 12; i++) { if (i / 12 > u) break; const a = clockAng(i); ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R * 1.07, cy + Math.sin(a) * R * 1.07); ctx.lineTo(cx + Math.cos(a) * R * 1.1, cy + Math.sin(a) * R * 1.1); ctx.stroke(); }
  ctx.restore();
}
export const arcPoint = (cx, cy, R, h, rr = 1.16) => { const a = clockAng(h); return [cx + Math.cos(a) * R * rr, cy + Math.sin(a) * R * rr]; };
// an hour disc: a coin of gold light (one freed hour)
export function hourDisc(ctx, x, y, r, t, o = {}) {
  if (r <= .5) return;
  if (o.halo !== false) halo(ctx, x, y, r * 3.2, .45 * (o.a ?? 1), P.halo1, P.core1);
  const p = new Path2D(); p.arc(x, y, r, 0, 6.29);
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.fillStyle = rad(ctx, x - r * .25, y - r * .3, r * 1.3, [[0, P.core0], [.35, P.core1], [.75, P.halo0], [1, P.halo1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = Math.max(1, r * .08); ctx.beginPath(); ctx.arc(x, y, r * .72, 0, 6.29); ctx.stroke(); ctx.restore();
  if (o.spin != null) {   // a reel: three windows turning (the hour disc becomes a tape reel)
    ctx.save(); ctx.fillStyle = rgba(P.shade0, .75 * clamp(o.reel ?? 1));
    for (let i = 0; i < 3; i++) { const a = o.spin + i * 2.094; ctx.beginPath(); ctx.moveTo(x + Math.cos(a - .38) * r * .26, y + Math.sin(a - .38) * r * .26); ctx.arc(x, y, r * .62, a - .42, a + .42); ctx.lineTo(x + Math.cos(a + .38) * r * .26, y + Math.sin(a + .38) * r * .26); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(x, y, r * .12, 0, 6.29); ctx.fill(); ctx.restore();
  }
}

// ---------------------------------------------------------------------------------------------- light halves (7.07)
// one disc split in two: left cool (with a stack of boxes: output), right warm (filled with gold sand: life). u 0..1 builds.
const BOXES = (() => { const o = []; const rows = [5, 4, 4, 3, 2]; rows.forEach((n, j) => { for (let i = 0; i < n; i++) o.push([i - (n - 1) / 2, j]); }); return o; })();
export function halves(ctx, cx, cy, R, t, o = {}) {
  const gap = o.gap ?? 16, cool = o.cool ?? 1, fill = clamp(o.fill ?? 0);
  // left: cool half with the boxes (cereal boxes, the output)
  const L = new Path2D(); L.arc(cx - gap, cy, R, Math.PI / 2, Math.PI * 1.5); L.closePath();
  E.lightShape(ctx, L, t, { lit: 0, a: (o.aL ?? 1) * (.45 + .55 * cool), dust: 0, cx: .2, glow: .25 });
  ctx.save(); ctx.clip(L);
  const bw = R * .2, bh = R * .26, bx = cx - gap - R * .5, by = cy + R * .62;
  for (const [i, j] of BOXES) { const x = bx + i * bw * 1.06 - bw / 2, y = by - (j + 1) * bh * 1.04; ctx.fillStyle = mixHex(mixHex(P.blue2, P.night1, .35), mixHex(P.cream, P.blue2, .5), .35 * cool); ctx.fillRect(x, y, bw, bh); ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x + bw * .15, y + bh * .2, bw * .7, bh * .22); }
  ctx.restore();
  // right: the warm half fills with gold sand from the bottom (life)
  const Rp = new Path2D(); Rp.arc(cx + gap, cy, R, -Math.PI / 2, Math.PI / 2); Rp.closePath();
  E.fillWithLight(ctx, Rp, fill, t, { seed: 72, a: o.aR ?? 1, glow: .25 });
  return { L, R: Rp };
}

// ---------------------------------------------------------------------------------------------- glyphs of light for the map (7.08, 7.09)
// unit glyphs (height ~1, base at y = 0, up = -y); drawn with lightShape (warm) at a size
const U = (a, b) => a.op(b, PathOp.Union);
const strokeP = (pts, w, close = false) => { const p = new Path2D(); pts.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1]))); if (close) p.closePath(); return p.stroke({ width: w, cap: 1, join: 1 }); };
const figure = (x, h) => { const p = new Path2D(); p.arc(x, -h * .86, h * .12, 0, 6.29); const b = new Path2D(); b.moveTo(x - h * .16, 0); b.bezierCurveTo(x - h * .17, -h * .4, x - h * .14, -h * .68, x, -h * .7); b.bezierCurveTo(x + h * .14, -h * .68, x + h * .17, -h * .4, x + h * .16, 0); b.closePath(); return U(p, b); };
export const GLYPH = {
  children: (() => { let p = figure(-.18, 1); p = U(p, figure(.24, .6)); p = U(p, strokeP([[-.05, -.5], [.16, -.38]], .07)); return p; })(),
  neighbors: (() => { let p = figure(-.42, .9); p = U(p, figure(.42, .9)); for (let i = -2; i <= 2; i++) p = U(p, strokeP([[i * .14, 0], [i * .14, -.42]], .06)); p = U(p, strokeP([[-.36, -.28], [.36, -.28]], .05)); return p; })(),
  library: (() => { let p = new Path2D(); p.moveTo(-.55, -.72); p.lineTo(0, -1); p.lineTo(.55, -.72); p.closePath(); const b = new Path2D(); b.rect(-.52, -.06, 1.04, .06); p = U(p, b); for (let i = 0; i < 4; i++) { const c = new Path2D(); c.rect(-.42 + i * .26, -.68, .1, .62); p = U(p, c); } return p; })(),
  garden: (() => { let p = new Path2D(); for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const x = -.45 + i * .3 + r * .05, y = -r * .25; const s = new Path2D(); s.ellipse(x, y - .14, .1, .14, 0, 0, 6.29); p = U(p, s); p = U(p, strokeP([[x, y], [x, y - .06]], .04)); } return p; })(),
  jars: (() => { let p = new Path2D(); for (const [x, h] of [[-.34, .66], [0, .82], [.34, .6]]) { const j = new Path2D(); j.roundRect(x - .13, -h, .26, h, .05); const l = new Path2D(); l.rect(x - .1, -h - .08, .2, .08); p = U(U(p, j), l); } return p; })(),
  sew: (() => { let p = strokeP([[-.5, .0], [.45, -.9]], .06); const eye = new Path2D(); eye.ellipse(.43, -.87, .05, .09, .8, 0, 6.29); p = p.op(eye, PathOp.Difference); return p; })(),
  churn: (() => { let p = new Path2D(); p.moveTo(-.3, 0); p.lineTo(-.24, -.6); p.lineTo(.24, -.6); p.lineTo(.3, 0); p.closePath(); const l = new Path2D(); l.rect(-.28, -.68, .56, .08); p = U(p, l); p = U(p, strokeP([[0, -.68], [0, -.86], [.32, -.86], [.32, -.74]], .06)); return p; })(),
  ball: (() => { let p = strokeP([[0, 0], [.5, -.5], [0, -1], [-.5, -.5]], .06, true); const b = new Path2D(); b.arc(.0, -.5, .1, 0, 6.29); return U(p, b); })(),
  fish: (() => { let p = figure(-.3, 1); p = U(p, strokeP([[-.18, -.62], [.62, -1.05]], .045)); return p; })(),
  farm: (() => { let p = new Path2D(); p.moveTo(-.5, 0); p.lineTo(-.5, -.55); p.lineTo(-.25, -.85); p.lineTo(.25, -.85); p.lineTo(.5, -.55); p.lineTo(.5, 0); p.closePath(); const d = new Path2D(); d.rect(-.14, -.38, .28, .38); return p.op(d, PathOp.Difference); })(),
};
// a glyph rises from its base line (u 0..1: mask from below), warm light, label under it
export function glyph(ctx, name, x, y, size, t, u, o = {}) {
  if (u <= 0) return;
  const p = new Path2D(); p.addPath(GLYPH[name], { a: size, b: 0, c: 0, d: size, e: x, f: y });
  const k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - size * 2, y - size * 1.3 * k - 4, size * 4, size * 1.3 * k + 6); ctx.clip();
  ctx.translate(0, (1 - k) * size * .5);
  E.lightShape(ctx, p, t, { lit: o.lit ?? 1, dust: 0, glow: .6, a: o.a ?? 1 });
  ctx.restore();
  if (name === 'sew' && k > .5) K.trailSpan(ctx, E.catmull([[x + .43 * size, y - .87 * size, 2], [x + .7 * size, y - .5 * size, 2], [x + .55 * size, y - .1 * size, 2], [x + .9 * size, y + .05 * size, 2]], 8), 0, smooth(span(u, .5, 1)), { w: 1.6, spark: false });
  if (o.label) stamp(ctx, o.label, Math.max(x, 300), o.labelUp ? y - size * 1.55 : y + 104, smooth(span(u, .3, 1)) * (o.labelK ?? 1), { align: 'center' });
}

// ---------------------------------------------------------------------------------------------- the sand stream
// a thread of falling sand from (x0,y0) to (x1,y1): a straight gold line with grains running down; u0..u1 = visible share
export function sandStream(ctx, x0, y0, x1, y1, t, o = {}) {
  const u0 = clamp(o.u0 ?? 0), u1 = clamp(o.u1 ?? 1); if (u1 <= u0) return;
  const ax = lerp(x0, x1, u0), ay = lerp(y0, y1, u0), bx = lerp(x0, x1, u1), by = lerp(y0, y1, u1), w = o.w ?? 2.4;
  ctx.save(); ctx.lineCap = 'round';
  ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo1, .3); ctx.lineWidth = w * 4; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba(P.halo0, .85); ctx.lineWidth = w * 1.4; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  ctx.strokeStyle = P.core0; ctx.lineWidth = w * .6; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  const r = prng(o.seed ?? 3), len = Math.hypot(bx - ax, by - ay); ctx.fillStyle = P.core1;
  for (let i = 0; i < (o.n ?? 26); i++) { const ph = (r() + t * (380 / Math.max(200, Math.hypot(x1 - x0, y1 - y0))) * (.8 + .4 * r())) % 1; if (ph < u0 || ph > u1) continue; const gx = lerp(x0, x1, ph) + (r() - .5) * w * 3, gy = lerp(y0, y1, ph); ctx.globalAlpha = .5 + .5 * r(); ctx.fillRect(gx - 1, gy - 1, 2, 2 + 2 * r()); }
  ctx.restore(); void len;
  return [bx, by];
}
// a little pile / splash of light where sand lands
export function landing(ctx, x, y, s, t, a = 1) { if (a <= 0) return; halo(ctx, x, y, s * 3, .55 * a, P.halo1, P.core1); E.dust(ctx, 919, 220, x, y - s * .2, s * 1.2, s * .35, t, .9 * a, P.halo0); }
