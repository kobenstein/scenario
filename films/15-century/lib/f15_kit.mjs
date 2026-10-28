// Film 15 · the century kit (lead; builders import, never edit — wishes go into your report). Base stage: lib/f10_editorial.mjs.
// Builders import ONLY lib/f10_editorial.mjs (as E), this file (as F) and lib/f15_seams.mjs. lib/f13_kit.mjs is used through the
// re-exports below; its hourglass belongs to Film 13 and is NOT used in Film 15.
//
//   PRINT15                       the print finish of every entry: entry = { t, draw, print: F.PRINT15 }
//   paperBand(ctx, pts, t, o)     THE BAND OF A HUNDRED YEARS: a paper ribbon of light along a path, twist, year marks, handwriting,
//                                 slides in/out of the box (anchors only: hook, c04, c09 turn, c14)
//   box10(ctx, x, y, w, t, o)     THE BOX: ten compartments (2 × 5), oblique view from side (beta 0) to top (beta 1), lid, per-compartment
//                                 warm light (lit) / cool rim (cool), paper labels, a callback to draw INTO a compartment (portal)
//   paperLabel(ctx, s, x, y, o)   a slip of paper with ink capitals (compartment labels, envelope, sticky note, contract line)
//   vial(ctx, x, y, h, t, o)      the vaccine vial: glass, cap, light inside (fill), blank paper label, mark
//   pill(ctx, x, y, w, t, o)      a capsule of light that can split in two halves (warm / cool)
//   reticle(ctx, x, y, r, t, o)   the machine's aim: a cool ring with four inward ticks (the machine is never a robot or a brain)
//   genomeRows(ctx, x, y, w, t, o) the tumour read as a text: rows of A C G T, a reading cursor, gold marks behind picked letters
//   numberBlock(ctx, o)           THE explainer grammar: one number (serif, cream), one label (≤ 6 words, Inter caps), one source,
//                                 each rising from its own invisible baseline, staggered
//   source15(ctx, s, x, y, u, o)  a source line alone (Inter 600 caps, 22 px, halo2), rises from its baseline
//   inkLine(ctx, pts, u, o)       handwriting as a gentle ink wave along a path (u = how far it is written)
//   cell(ctx, x, y, r, t, o)      a living cell of warm light that can divide (split 0..1): membrane rim, nucleus, slow breath
//   syringe(ctx, x, y, len, t, o) the twice-a-year HIV shot: a slim syringe of light (gold dose, cool needle), rot, fill, glow
//   pathFrame(pts)                arc-length helper: { len, at(d) → [x, y, angle] } for carriers that ride along a path
//   re-exported from lib/f13_kit.mjs: maskLine, measure, trailSpan, textGrains, grainsFall (= sandGrains), ledge, ledgeY
// Rules as in the base kit: no canvas, pattern or gradient cache built per frame; seeded randomness only (E.prng).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { maskLine, measure, trailSpan, textGrains, sandGrains, ledge, ledgeY } from './f13_kit.mjs';
export { maskLine, measure, trailSpan, textGrains, ledge, ledgeY };
export const grainsFall = sandGrains;
const { P, rgba, mixHex, clamp, lerp, span, smooth, expoOut, glowFill, halo, dust, lin, rad, prng, glowText, catmull } = E;

export const PRINT15 = { grain: 14, floor: 4, vig: .5 };
// colours of this film (all from the style palette P): ink on paper, the cool "not yet / machine" light, paper tones
export const INK = mixHex(P.shade0, P.night1, .5);
export const COOL = mixHex(P.blue2, P.cream, .38);
export const COOL_HI = mixHex(P.blue1, P.cream, .7);
const PAPER_BACK = mixHex(P.shade0, P.halo1, .3);

// ---------- path helpers ----------
const FRAMES = new WeakMap();
export function pathFrame(pts) {
  if (FRAMES.has(pts)) return FRAMES.get(pts);
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1];
  const at = (d) => {
    d = clamp(d, 0, L); let lo = 0, hi = len.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (len[m] < d) lo = m; else hi = m; }
    const f = (d - len[lo]) / Math.max(1e-6, len[hi] - len[lo]), a = pts[lo], b = pts[hi];
    return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0])];
  };
  const fr = { len: L, at, atU: (u) => at(u * L) };
  FRAMES.set(pts, fr); return fr;
}
// a smooth path from a few control points (cached by the array you pass: build it ONCE, outside draw)
export const smoothPath = (ctrl, n = 14) => catmull(ctrl.map((p) => [p[0], p[1]]), n);

// =====================================================================================================================
// THE BAND OF A HUNDRED YEARS
// pts: the spine (design coords, from smoothPath, built once). The band is paper: front face lit cream-gold, back face gold shadow,
// a thin darker paper edge. It glows (the hero light of the anchors).
// o: { w: [w0, w1] width at the start and the end of the path (or fn(s) → px), twist: fn(s) → phase (rad; cos < 0 = back face),
//      slide: 0..1 the paper slid back INTO the box along its own path (0 = all out; material m = s + slide; ink and marks move with
//      the paper), cut: 0..1 visible share of the path from the start (the band grows / is cut at its far end),
//      marks: [{ m, len, label, w, sz }] at MATERIAL coords 0..1 (len = share of the width, label = text on the paper, sz = label scale),
//      ink: [{ m0, m1, u, amp, seed }] handwriting on the paper, glow (1), a (1), light: fn(s) → 0..1 brightness along the band }
// returns { at(s) → {x, y, ang, w, c} at path share s, atM(m) → same at material m (null while inside the box) }
export function paperBand(ctx, pts, t, o = {}) {
  const fr = pathFrame(pts), N = 150, slide = clamp(o.slide ?? 0), cut = clamp(o.cut ?? 1) * (1 - slide), a = o.a ?? 1;
  const wOf = typeof o.w === 'function' ? o.w : ((w) => (s) => lerp(w[0], w[1], Math.pow(s, .85)))(o.w || [20, 160]);
  const tw = o.twist || (() => 0), light = o.light || (() => 1);
  const S = (s) => { const [x, y, ang] = fr.atU(s), w = wOf(s), c = Math.cos(tw(s)); return { x, y, ang, w, c, nx: -Math.sin(ang), ny: Math.cos(ang) }; };
  const out = { at: S, atM: (m) => { const s = m - slide; return s < 0 || s > cut ? null : S(s); } };
  if (cut <= .002 || a <= 0) return out;
  const n = Math.max(2, Math.round(N * cut)), smp = [];
  for (let i = 0; i <= n; i++) smp.push(S(cut * i / n));
  const edge = (q, k) => [q.x + q.nx * q.w / 2 * q.c * k, q.y + q.ny * q.w / 2 * q.c * k];
  // glow: the outline as one polygon (a twist makes a bow tie; nonzero fill handles it)
  const outline = new Path2D();
  smp.forEach((q, i) => { const [x, y] = edge(q, 1); i ? outline.lineTo(x, y) : outline.moveTo(x, y); });
  for (let i = smp.length - 1; i >= 0; i--) { const [x, y] = edge(smp[i], -1); outline.lineTo(x, y); }
  outline.closePath();
  const g = o.glow ?? 1, wMax = Math.max(...smp.map((q) => q.w));
  ctx.save(); ctx.globalAlpha = a;
  glowFill(ctx, outline, wMax * .9 * g, .55 * a * g, P.blue0);
  glowFill(ctx, outline, wMax * .22 * g, .5 * a * g, P.halo1);
  // the paper: one quad per sample, colour from the face, the twist (|c| = how flat it faces you) and the light along the band
  for (let i = 0; i < n; i++) {
    const q0 = smp[i], q1 = smp[i + 1], c = (q0.c + q1.c) / 2, s = cut * (i + .5) / n, L = clamp(light(s));
    const col = c >= 0 ? mixHex(mixHex(P.halo1, P.halo0, L), mixHex(P.core1, P.core0, L), clamp(Math.abs(c) * 1.25 - .15))
                       : mixHex(P.shade0, PAPER_BACK, clamp(Math.abs(c)) * .8);
    const [a0x, a0y] = edge(q0, 1), [a1x, a1y] = edge(q1, 1), [b1x, b1y] = edge(q1, -1), [b0x, b0y] = edge(q0, -1);
    ctx.beginPath(); ctx.moveTo(a0x, a0y); ctx.lineTo(a1x, a1y); ctx.lineTo(b1x, b1y); ctx.lineTo(b0x, b0y); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke();
  }
  // paper edges (a fine darker line on both sides) and a soft inner shade toward one edge (volume)
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const k of [1, -1]) {
    ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = Math.max(1, wMax * .012);
    ctx.beginPath(); smp.forEach((q, i) => { const [x, y] = edge(q, k); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
  }
  // year marks on the paper (material coords: they ride with the paper when it slides)
  for (const mk of o.marks || []) {
    const s = mk.m - slide; if (s < 0 || s > cut) continue;
    const q = S(s), ac = Math.abs(q.c); if (ac < .2 || q.w * ac < 6) continue;
    const len = (mk.len ?? .25) * q.w * q.c, [x0, y0] = edge(q, 1);
    ctx.strokeStyle = rgba(q.c > 0 ? INK : P.halo1, .85 * clamp((ac - .2) * 3)); ctx.lineWidth = (mk.w ?? 1.6) * clamp(q.w / 90, .6, 1.8);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 - q.nx * len, y0 - q.ny * len); ctx.stroke();
    if (mk.label && q.c > .55) {
      const size = clamp(q.w * .24, 0, 34) * (mk.sz ?? 1); if (size < 7) continue;
      let ang = q.ang; if (Math.cos(ang) < 0) ang += Math.PI;
      const cx = q.x - q.nx * q.w * q.c * .1, cy = q.y - q.ny * q.w * q.c * .1;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(1, q.c);
      ctx.font = `600 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(INK, clamp((q.c - .55) * 4));
      ctx.fillText(mk.label, 0, 0); ctx.restore();
    }
  }
  // handwriting on the paper
  for (const ik of o.ink || []) {
    const m1 = lerp(ik.m0, ik.m1, clamp(ik.u ?? 1)); if (m1 <= ik.m0) continue;
    const pts2 = [], steps = 90;
    for (let k = 0; k <= steps; k++) {
      const m = lerp(ik.m0, m1, k / steps), s = m - slide; if (s < (ik.minS ?? .08) || s > cut) continue;   // the ink never reaches the narrow root
      const q = S(s), wob = Math.sin(m * 900 + (ik.seed ?? 0)) * .55 + Math.sin(m * 2300) * .3 + Math.sin(m * 5100) * .15;
      const off = (ik.off ?? 0) + (ik.amp ?? .12) * wob;
      pts2.push([q.x + q.nx * q.w * q.c * off, q.y + q.ny * q.w * q.c * off, q.c]);
    }
    if (pts2.length < 2) continue;
    ctx.strokeStyle = rgba(INK, .9); ctx.lineWidth = ik.lw ?? 2.2; ctx.beginPath();
    pts2.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  }
  ctx.restore();
  return out;
}

// =====================================================================================================================
// THE BOX: ten compartments in 2 rows × 5 (reading order: back row 1–5, front row 6–10). Oblique view: beta 0 = from the side
// (front face only, the openings a thin line), beta 1 = straight from above (ten open rectangles). (x, y) = the middle of the
// FRONT-BOTTOM edge (where hands hold it); in top view the box spans y - .44w … y.
// o: { beta 0..1, lid 0..1 (0 closed, 1 open flat behind the box), lit: [10] warm light 0..1, cool: [10] cool rim 0..1,
//      labels: [10] { s, u } paper labels on the wall in front of each opening (top view), inside(i, rect) draws INTO opening i
//      (clipped; rect in caller coords) — the portal for a fly-in, paper: 0..1 (or [10]) the folded band visible in the openings, a }
// returns { cells: [{ x, y, w, h, cx, cy }] (opening rects), top: [x, yTop] (centre of the top face), d, hb }
export function box10(ctx, x, y, w, t, o = {}) {
  const beta = clamp(o.beta ?? .3), cb = Math.cos(beta * Math.PI / 2), sb = Math.sin(beta * Math.PI / 2), a = o.a ?? 1;
  const d = .44 * w, hb = .2 * w, wall = .028 * w, cw = (w - 6 * wall) / 5, cd = (d - 3 * wall) / 2;
  const pr = (X, Y, Z) => [x + X, y - Y * cb - Z * sb];
  const lit = o.lit || [], cool = o.cool || [], lid = clamp(o.lid ?? 1);
  const cells = [];
  for (let r = 0; r < 2; r++) for (let k = 0; k < 5; k++) {
    const X0 = -w / 2 + wall + k * (cw + wall), Z1 = d - wall - r * (cd + wall), Z0 = Z1 - cd;   // r 0 = back row
    const [px0, py1] = pr(X0, hb, Z1), [, py0] = pr(X0, hb, Z0);
    cells.push({ x: px0, y: py1, w: cw, h: Math.max(.01, py0 - py1), cx: px0 + cw / 2, cy: (py0 + py1) / 2 });
  }
  ctx.save(); ctx.globalAlpha = a;
  // the lid, when it stands behind the top face (open)
  const al = lid * Math.PI * .97, lidFar = pr(0, hb + d * Math.sin(al), d - d * Math.cos(al)), hinge = pr(0, hb, d);
  const anyLit = Math.max(0, ...lit.map((v) => v || 0));
  const drawLid = () => {
    const y0 = Math.min(hinge[1], lidFar[1]), y1 = Math.max(hinge[1], lidFar[1]);
    if (y1 - y0 < .5) return;
    // the inner side of the lid: a lining that catches the light from the compartments (warm at the hinge when any is lit)
    ctx.fillStyle = lin(ctx, 0, lidFar[1], 0, hinge[1], [[0, mixHex(P.ind2, P.blue1, .55)], [.7, mixHex(P.ind1, P.blue1, .3)], [1, mixHex(P.ind1, P.shade0, .25 * anyLit)]]);
    ctx.beginPath(); ctx.roundRect(x - w / 2, y0, w, y1 - y0, Math.min(w * .02, (y1 - y0) / 2)); ctx.fill();
    ctx.strokeStyle = rgba(P.night1, .9); ctx.lineWidth = Math.max(1, w * .012); ctx.strokeRect(x - w / 2 + w * .03, y0 + (y1 - y0) * .08, w * .94, (y1 - y0) * .84);
    ctx.fillStyle = rgba(P.blue0, .9); ctx.fillRect(x - w / 2 + w * .01, lidFar[1] < hinge[1] ? y0 : y1 - 2, w * .98, Math.max(1, w * .005));
  };
  if (lid > .5) drawLid();
  // front face
  if (cb > .02) {
    const [fx0, fy0] = pr(-w / 2, hb, 0);
    ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .5)]]);
    ctx.beginPath(); ctx.roundRect(fx0, fy0, w, y - fy0, Math.min(w * .015, (y - fy0) / 2)); ctx.fill();
    ctx.fillStyle = rgba(anyLit > .05 ? P.halo1 : P.blue0, .5 + .4 * anyLit); ctx.fillRect(fx0, fy0, w, Math.max(1, w * .006));
  }
  // top face: the walls (frame) lit from the key light, then the ten openings
  if (sb > .02) {
    const [tx0, ty0] = pr(-w / 2, hb, d), [, ty1] = pr(-w / 2, hb, 0);
    ctx.fillStyle = lin(ctx, 0, ty0, 0, ty1, [[0, mixHex(P.ind2, P.blue1, .3)], [1, mixHex(P.ind2, P.blue1, .65)]]);
    ctx.beginPath(); ctx.roundRect(tx0, ty0, w, ty1 - ty0, Math.min(w * .015, (ty1 - ty0) / 2)); ctx.fill();
    cells.forEach((c, i) => {
      // the opening: dark; the inner back wall shows as a strip while the view is oblique; warm light rising from inside
      ctx.fillStyle = P.night0; ctx.fillRect(c.x, c.y, c.w, c.h);
      if (o.inside) { ctx.save(); ctx.beginPath(); ctx.rect(c.x, c.y, c.w, c.h); ctx.clip(); o.inside(i, c); ctx.restore(); }
      const strip = Math.min(c.h, hb * .8 * cb);
      if (strip > .5) { ctx.fillStyle = lin(ctx, 0, c.y, 0, c.y + strip, [[0, P.ind1], [1, P.night1]]); ctx.fillRect(c.x, c.y, c.w, strip); }
      const L = clamp(lit[i] || 0);
      if (L > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(c.x, c.y, c.w, c.h); ctx.clip();
        ctx.fillStyle = rad(ctx, c.cx, c.y + c.h * .65, Math.max(c.w, c.h) * .8, [[0, rgba(P.core0, L)], [.3, rgba(P.core1, .9 * L)], [.7, rgba(P.halo0, .55 * L)], [1, rgba(P.shade0, .3 * L)]]);
        ctx.fillRect(c.x, c.y, c.w, c.h); ctx.restore();
        halo(ctx, c.cx, c.cy, Math.max(c.w, c.h) * 1.3, .32 * L, P.halo1, P.core1);
      }
      const pp = Array.isArray(o.paper) ? (o.paper[i] || 0) : (o.paper || 0);
      if (pp > 0) {   // the folded band lies in the openings: a strip of paper with folds
        const pw = c.w * .72, ph = Math.max(1, c.h * .5 * clamp(pp)), px = c.cx - pw / 2, py = c.y + c.h * .62 - ph / 2;
        ctx.fillStyle = mixHex(P.halo1, P.core1, .35 + .5 * L); ctx.fillRect(px, py, pw, ph);
        ctx.strokeStyle = rgba(P.shade0, .6); ctx.lineWidth = Math.max(.6, w * .002);
        for (let f = 1; f < 4; f++) { ctx.beginPath(); ctx.moveTo(px + pw * f / 4, py); ctx.lineTo(px + pw * f / 4, py + ph); ctx.stroke(); }
      }
      const C = clamp(cool[i] || 0);
      ctx.strokeStyle = C > 0 ? rgba(mixHex(P.blue0, COOL_HI, C), .7 + .3 * C) : rgba(P.blue0, .65); ctx.lineWidth = Math.max(1, w * (.003 + .004 * C));
      ctx.strokeRect(c.x, c.y, c.w, c.h);
      if (L > 0) { ctx.strokeStyle = rgba(P.halo0, .8 * L); ctx.lineWidth = Math.max(1, w * .004); ctx.beginPath(); ctx.moveTo(c.x, c.y + c.h); ctx.lineTo(c.x + c.w, c.y + c.h); ctx.stroke(); }
    });
    // labels: paper slips on the wall in front of each opening
    (o.labels || []).forEach((lb, i) => {
      if (!lb || !lb.s || (lb.u ?? 1) <= 0) return;
      const c = cells[i]; paperLabel(ctx, lb.s, c.cx, c.y + c.h + wall * .5 * sb, { size: lb.size ?? cw * .085, u: lb.u, maxW: c.w * .96, rot: lb.rot ?? 0, lit: clamp(lit[i] || 0) });
    });
  }
  if (lid <= .5) drawLid();
  ctx.restore();
  return { cells, top: pr(0, hb, d / 2), front: pr(0, hb, 0), d, hb, pr };
}

// ---------- a slip of paper with ink capitals (centred on x, y = its middle). o { size, u (written share), rot, maxW, lit, a } ----------
export function paperLabel(ctx, s, x, y, o = {}) {
  const size = o.size ?? 26, a = o.a ?? 1, u = clamp(o.u ?? 1); if (a <= 0 || u <= 0) return null;
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  ctx.font = `600 ${size}px Inter`; ctx.letterSpacing = '0.12em';
  const tw = ctx.measureText(s).width, padX = size * .55, w = Math.min(o.maxW ?? 1e9, tw + padX * 2), h = size * 1.55;
  const k = Math.min(1, (o.maxW ?? 1e9) / (tw + padX * 2));
  // the slip arrives by unfolding from its left edge (scaleX), then the ink is written left → right
  const unfold = expoOut(span(u, 0, .35)), write = span(u, .25, 1);
  ctx.globalAlpha = a;
  ctx.save(); ctx.translate(-w / 2, 0); ctx.scale(unfold, 1);
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(2, -h / 2 + 3, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(P.core1, P.core0, o.lit ?? 0)], [1, mixHex(P.halo2, P.halo1, .5)]]); ctx.fillRect(0, -h / 2, w, h);
  ctx.fillStyle = rgba(P.shade0, .5); ctx.fillRect(0, h / 2 - 1.5, w, 1.5);
  ctx.restore();
  if (write > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w * write, h); ctx.clip();
    ctx.scale(k, k); ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, size * .04); ctx.restore();
  }
  ctx.restore();
  return { w, h };
}

// ---------- the vaccine vial. (x, y) = bottom centre, h = total height. o { fill 0..1 (light inside), glow, label (text, '' = blank),
//            mark 0..1 (a small warm cross on the label), a, light ±1 } returns { label: [x0, y0, x1, y1], top: [x, y], mid: [x, y] } ----------
export function vial(ctx, x, y, h, t, o = {}) {
  const a = o.a ?? 1, bw = .44 * h, bh = .66 * h, nw = .26 * h, nh = .08 * h, capW = .34 * h, capH = .17 * h, L = o.light ?? 1;
  const body = new Path2D(); body.roundRect(x - bw / 2, y - bh, bw, bh, [bw * .16, bw * .16, bw * .22, bw * .22]);
  const neck = new Path2D(); neck.rect(x - nw / 2, y - bh - nh, nw, nh + 2);
  const fill = clamp(o.fill ?? .7), br = 1 + .02 * Math.sin(t * 1.3);
  ctx.save(); ctx.globalAlpha = a;
  glowFill(ctx, body, h * .35 * (o.glow ?? 1), .45 * a, P.blue0);
  if (fill > 0) {
    const ly = y - bh * fill * .94;
    const liq = new Path2D(); liq.roundRect(x - bw / 2 + 3, ly, bw - 6, y - ly - 3, [3, 3, bw * .2, bw * .2]);
    glowFill(ctx, liq, h * .14 * (o.glow ?? 1) * br, .75 * a, P.halo1);
    ctx.fillStyle = rad(ctx, x, y - bh * .3, bh * .75, [[0, P.core0], [.3, P.core1], [.7, P.halo0], [1, P.halo1]]); ctx.fill(liq);
    ctx.fillStyle = rgba(P.core0, .9); ctx.fillRect(x - bw / 2 + 5, ly, bw - 10, 2);   // the meniscus catches the light
  }
  ctx.fillStyle = lin(ctx, x - bw / 2 * L, 0, x + bw / 2 * L, 0, [[0, rgba(P.blue0, .14)], [.6, rgba(P.blue1, .2)], [1, rgba(P.cream, .18)]]); ctx.fill(body); ctx.fill(neck);
  ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = Math.max(1, h * .008); ctx.stroke(body);
  ctx.stroke(neck);
  // the crimp under the cap (aluminium: it catches the cool light, so the cap never floats)
  ctx.fillStyle = lin(ctx, x - nw * .7, 0, x + nw * .7, 0, [[0, P.ind2], [.45, mixHex(P.blue1, P.cream, .45)], [1, P.ind2]]); ctx.fillRect(x - nw * .62, y - bh - nh - 1, nw * 1.24, nh * .7 + 1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = Math.max(1.5, h * .02); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - bw * .3 * L, y - bh * .85); ctx.lineTo(x - bw * .3 * L, y - bh * .2); ctx.stroke(); ctx.restore();
  // the label: a paper band round the body
  const lx0 = x - bw / 2, lx1 = x + bw / 2, ly0 = y - bh * .62, ly1 = y - bh * .3;
  ctx.fillStyle = lin(ctx, lx0, 0, lx1, 0, [[0, mixHex(P.halo1, P.shade0, .4)], [.35, P.core1], [.7, P.halo2], [1, mixHex(P.halo1, P.shade0, .5)]]); ctx.fillRect(lx0, ly0, bw, ly1 - ly0);
  if (o.label) { ctx.font = `600 ${Math.round((ly1 - ly0) * .32)}px Inter`; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, x, (ly0 + ly1) / 2); }
  if (o.mark > 0) { const m = clamp(o.mark), r = (ly1 - ly0) * .28 * expoOut(m); ctx.strokeStyle = rgba(P.shade0, .95); ctx.lineWidth = Math.max(1.5, h * .012); ctx.beginPath(); ctx.moveTo(x - r, (ly0 + ly1) / 2); ctx.lineTo(x + r, (ly0 + ly1) / 2); ctx.moveTo(x, (ly0 + ly1) / 2 - r); ctx.lineTo(x, (ly0 + ly1) / 2 + r); ctx.stroke(); }
  // cap: dark with a rim of light
  const cap = new Path2D(); cap.roundRect(x - capW / 2, y - bh - nh - capH, capW, capH, capW * .12);
  ctx.fillStyle = lin(ctx, x - capW / 2, 0, x + capW / 2, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .6)]]); ctx.fill(cap);
  ctx.fillStyle = rgba(P.blue0, .9); ctx.fillRect(x - capW / 2, y - bh - nh - capH, capW, Math.max(1, h * .008));
  ctx.restore();
  return { label: [lx0, ly0, lx1, ly1], top: [x, y - bh - nh - capH], mid: [x, y - bh * .45], body: [x - bw / 2, y - bh, bw, bh] };
}

// ---------- a capsule of light that can split. (x, y) = centre, w = length. o { split 0..1, rot, lit: [left, right], a } ----------
export function pill(ctx, x, y, w, t, o = {}) {
  const h = w * .42, sp = expoOut(clamp(o.split ?? 0)) * w * .28, rot = o.rot ?? 0, lit = o.lit || [1, .15];
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  for (const [k, side] of [[0, -1], [1, 1]]) {
    const p = new Path2D(), r = h / 2, xs = side * sp / 2;
    if (side < 0) { p.moveTo(xs, -r); p.lineTo(xs - w / 2 + r, -r); p.arc(xs - w / 2 + r, 0, r, -Math.PI / 2, Math.PI / 2, true); p.lineTo(xs, r); p.closePath(); }
    else { p.moveTo(xs, -r); p.lineTo(xs + w / 2 - r, -r); p.arc(xs + w / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2); p.lineTo(xs, r); p.closePath(); }
    ctx.save(); if (o.split) ctx.rotate(side * .06 * expoOut(clamp(o.split)));
    E.lightShape(ctx, p, t, { lit: lit[k], a: o.a ?? 1, seed: 31 + k, dust: o.dust ?? 0 }); ctx.restore();
  }
  ctx.restore();
}

// ---------- the machine's aim: a cool ring with four inward ticks; lock 0..1 pulls the ticks in and warms the centre ----------
export function reticle(ctx, x, y, r, t, o = {}) {
  const a = o.a ?? 1, lock = clamp(o.lock ?? 0), rot = (o.rot ?? 0) + t * .15 * (1 - lock);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round';
  ctx.save(); ctx.filter = `blur(${r * .06}px)`; ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = r * .09; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = COOL_HI; ctx.lineWidth = Math.max(2.5, r * .04); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.stroke();
  for (let k = 0; k < 4; k++) {
    const an = rot + k * Math.PI / 2, r0 = r * (1.12 - .05 * lock), r1 = r * lerp(.78, .42, expoOut(lock));
    ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0); ctx.lineTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1); ctx.stroke();
  }
  if (lock > 0) halo(ctx, x, y, r * .5, .5 * lock, P.halo1, P.core0);
  ctx.restore();
}

// ---------- the tumour as a text: rows of A C G T ----------
// (x, y) = left end of the MIDDLE row's baseline, w = visible width. o { rows (odd, 9), pitch (52), size (30), shift (px the text has
// moved left: reading), hi (0..1 brightness of the middle row), seed, marks: [{ row (−4…4), col (index in the row), u 0..1 }],
// cursor: x (screen-space x of the reading cursor on the middle row; null = none), a }
// Letters are drawn one by one on a fixed advance (no jitter while they scroll); the text is seeded and identical everywhere.
const ROWS = new Map();
const genome = (seed, n) => { const k = seed + ':' + n; if (!ROWS.has(k)) { const r = prng(seed); ROWS.set(k, Array.from({ length: n }, () => 'ACGT'[Math.floor(r() * 4)])); } return ROWS.get(k); };
export function genomeRows(ctx, x, y, w, t, o = {}) {
  const rows = o.rows ?? 9, pitch = o.pitch ?? 52, size = o.size ?? 30, adv = size * .95, a = o.a ?? 1, hi = clamp(o.hi ?? 1), shift = o.shift ?? 0;
  const half = (rows - 1) / 2, n = 400;
  ctx.save(); ctx.globalAlpha = a; ctx.font = `600 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  for (let r = -half; r <= half; r++) {
    const seq = genome((o.seed ?? 15) + r * 7, n), yy = y + r * pitch, rs = shift * (1 + (r % 2) * .0), dist = Math.abs(r) / Math.max(1, half);
    const col = r === 0 ? mixHex(mixHex(P.blue2, P.cream, .45), P.cream, hi) : mixHex(P.blue1, mixHex(P.blue2, P.cream, .4), 1 - dist * .7);
    const c0 = Math.max(0, Math.floor((rs - size) / adv)), c1 = Math.min(n - 1, Math.ceil((rs + w + size) / adv));
    for (const mk of o.marks || []) {   // gold marks behind picked letters (they light up, then stay)
      if (mk.row !== r || mk.u <= 0 || mk.col < c0 || mk.col > c1) continue;
      const cx = x + mk.col * adv - rs, k = expoOut(clamp(mk.u));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo0, .55 * k); ctx.fillRect(cx - adv * .48, yy - size * .86, adv * .96, size * 1.08); ctx.restore();
      halo(ctx, cx, yy - size * .35, size * 1.4, .35 * k, P.halo1, P.core1);
    }
    ctx.fillStyle = col;
    for (let c = c0; c <= c1; c++) {
      const cx = x + c * adv - rs; if (cx < x - adv || cx > x + w + adv) continue;
      const mk = (o.marks || []).find((m) => m.row === r && m.col === c && m.u > 0);
      if (mk) { ctx.fillStyle = mixHex(col, P.night0, expoOut(clamp(mk.u)) * .85); ctx.fillText(seq[c], cx, yy); ctx.fillStyle = col; }
      else ctx.fillText(seq[c], cx, yy);
    }
  }
  if (o.cursor != null) {
    const cx = o.cursor;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, cx - 40, 0, cx + 6, 0, [[0, rgba(P.blue0, 0)], [1, rgba(P.blue0, .5)]]); ctx.fillRect(cx - 40, y - size * 1.05, 46, size * 1.4); ctx.restore();
    ctx.fillStyle = COOL_HI; ctx.fillRect(cx, y - size * 1.05, 3, size * 1.4);
  }
  ctx.restore();
  return { adv, letterX: (row, col) => x + col * adv - shift, rowY: (row) => y + row * pitch };
}

// ---------- the explainer grammar: number + label + source, each rising from its own baseline (staggered) ----------
// o { x, y (number baseline), num, label, src, u 0..1 (in) — pass a falling u to sink it, align 'left'|'center', size (132),
//     warm 0..1 (the number turns gold), labelSize (34), gap } — returns the label baseline y (for things placed under it)
export function numberBlock(ctx, o) {
  const u = clamp(o.u ?? 1), size = o.size ?? 132, ls = o.labelSize ?? 34, al = o.align ?? 'left';
  const ly = o.y + (o.gap ?? size * .5) + ls * .5, sy = ly + ls * 1.45;
  if (o.num != null) maskLine(ctx, [[String(o.num), o.warm ?? 0]], o.x, o.y, size, span(u, 0, .55), { align: al });
  if (o.label) maskLine(ctx, [[o.label.toUpperCase(), 0]], o.x, ly, ls, span(u, .2, .75), { serif: false, col: P.cream, glow: false, align: al, weight: 600 });
  if (o.src) source15(ctx, o.src, o.x, sy, span(u, .4, 1), { align: al });
  return ly;
}
export function source15(ctx, s, x, y, u, o = {}) {
  if (u <= 0) return;
  maskLine(ctx, [[s.toUpperCase(), 0]], x, y, o.size ?? 22, u, { serif: false, col: P.halo2, glow: false, align: o.align ?? 'left', weight: 600 });
}

// ---------- handwriting as an ink wave along a path (pts [[x,y],…]); u 0..1 written; o { amp, freq, lw, col, a } ----------
export function inkLine(ctx, pts, u, o = {}) {
  const fr = pathFrame(pts), L = fr.len * clamp(u); if (L <= 0) return null;
  const amp = o.amp ?? 6, f = o.freq ?? .09, step = 4;
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.strokeStyle = o.col ?? INK; ctx.lineWidth = o.lw ?? 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  let head = null;
  for (let d = 0; d <= L; d += step) {
    const [px, py, ang] = fr.at(d), wob = Math.sin(d * f) * .7 + Math.sin(d * f * 2.7 + 1) * .3, nx = -Math.sin(ang), ny = Math.cos(ang);
    head = [px + nx * amp * wob, py + ny * amp * wob]; d ? ctx.lineTo(...head) : ctx.moveTo(...head);
  }
  ctx.stroke(); ctx.restore();
  return head;
}

// ---------- a living cell of warm light. (x, y) = centre, r = radius. o { split 0..1, rot, lit, a, dust } ----------
// Division as a Cassini oval: split 0 = a round cell, .5 = an oval with a waist, 1 = pinched to a thread-thin waist (after that,
// draw two cells: cell(…, { split: 0 }) at ±.75 r along rot, radius .72 r). The body is E.lightShape (opaque, warm: the hero light);
// a fine cream membrane, one nucleus (two drifting apart while it divides), the membrane breathes by 1.5 %.
export function cell(ctx, x, y, r, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const e = smooth(clamp(o.split ?? 0)) * .985, br = 1 + .015 * Math.sin(t * 1.3 + x * .01), rot = o.rot ?? 0;
  const b = r * br / Math.sqrt(1 + .35 * e * e), c = b * e, b4 = b ** 4, c4 = c ** 4;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const p = new Path2D(), N = 96;
  for (let k = 0; k <= N; k++) {
    const ph = k / N * Math.PI * 2, s2 = Math.sin(2 * ph), rr = Math.sqrt(Math.max(0, c * c * Math.cos(2 * ph) + Math.sqrt(Math.max(0, b4 - c4 * s2 * s2))));
    const px = rr * Math.cos(ph), py = rr * Math.sin(ph) * .97; k ? p.lineTo(px, py) : p.moveTo(px, py);
  }
  p.closePath();
  E.lightShape(ctx, p, t, { lit: o.lit ?? 1, a, seed: 57, dust: o.dust ?? 0 });
  ctx.globalAlpha = a; ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = Math.max(1.5, r * .018); ctx.stroke(p);
  const nr = r * .16 * lerp(1, .82, e), off = c * .8;
  for (const k of e < .02 ? [0] : [-1, 1]) {
    // the nucleus: a brighter core inside a fine gold-shadow ring (never a dark hole)
    ctx.fillStyle = rad(ctx, k * off, -r * .04, nr, [[0, rgba(P.core0, .9)], [.75, rgba(P.core1, .5)], [1, rgba(P.halo0, .2)]]);
    ctx.beginPath(); ctx.arc(k * off, -r * .04, nr, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = rgba(P.shade0, .45); ctx.lineWidth = Math.max(1.2, r * .012); ctx.stroke();
  }
  ctx.restore();
}

// ---------- the HIV shot: a slim syringe of light. (x, y) = centre of the barrel, len = total length (needle included) ----------
// o { rot (0 = needle to the right), fill 0..1 (gold dose), glow, a }. Barrel glass like the vial, plunger dark, needle a cool line.
export function syringe(ctx, x, y, len, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const bl = len * .56, bh = len * .12, nl = len * .2, pl = len * .24, fill = clamp(o.fill ?? .8), br = 1 + .02 * Math.sin(t * 1.2);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  const x0 = -bl / 2, x1 = bl / 2;
  const barrel = new Path2D(); barrel.roundRect(x0, -bh / 2, bl, bh, bh * .18);
  glowFill(ctx, barrel, len * .12 * (o.glow ?? 1), .45 * a, P.blue0);
  // the dose: gold light from the needle end back to fill · bl
  const dose = new Path2D(); dose.roundRect(x1 - bl * fill + 3, -bh / 2 + 3, bl * fill - 6, bh - 6, bh * .12);
  glowFill(ctx, dose, len * .05 * (o.glow ?? 1) * br, .7 * a, P.halo1);
  ctx.fillStyle = lin(ctx, 0, -bh / 2, 0, bh / 2, [[0, P.core0], [.4, P.core1], [.8, P.halo0], [1, P.halo1]]); ctx.fill(dose);
  ctx.fillStyle = lin(ctx, 0, -bh / 2, 0, bh / 2, [[0, rgba(P.cream, .2)], [.5, rgba(P.blue1, .14)], [1, rgba(P.blue0, .2)]]); ctx.fill(barrel);
  ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = Math.max(1, len * .004); ctx.stroke(barrel);
  // dose marks on the glass
  ctx.strokeStyle = rgba(P.cream, .45); for (let k = 1; k < 6; k++) { const mx = x0 + bl * k / 6; ctx.beginPath(); ctx.moveTo(mx, -bh / 2); ctx.lineTo(mx, -bh / 2 + bh * (k % 3 ? .22 : .38)); ctx.stroke(); }
  // plunger rod + thumb rest (dark silhouette with a blue rim), finger flange
  ctx.fillStyle = lin(ctx, 0, -bh / 2, 0, bh / 2, [[0, P.ind2], [1, P.night1]]);
  ctx.fillRect(x0 - pl, -bh * .14, pl + 2, bh * .28); ctx.fillRect(x0 - pl - bh * .12, -bh * .5, bh * .14, bh);
  ctx.fillRect(x0 - bh * .1, -bh * .78, bh * .14, bh * 1.56);
  ctx.fillStyle = rgba(P.blue0, .9); ctx.fillRect(x0 - pl - bh * .12, -bh * .5, bh * .14, Math.max(1, len * .004));
  // hub + needle (cool)
  ctx.fillStyle = mixHex(P.blue1, P.cream, .4); ctx.fillRect(x1, -bh * .2, bh * .32, bh * .4);
  ctx.strokeStyle = COOL_HI; ctx.lineWidth = Math.max(1.2, len * .005); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1 + bh * .32, 0); ctx.lineTo(x1 + bh * .32 + nl, 0); ctx.stroke();
  ctx.restore();
}
