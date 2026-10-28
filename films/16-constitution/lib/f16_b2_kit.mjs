// Film 16 · builder B2 (c05–c08) · shared helpers for both stages (owned by B2; the lead's kit is imported, never edited).
//   sky()        the night behind everything, in SCREEN space (no parallax), so a stage switch with identical frames is invisible
//   layer()      draw F0-design content on a card at another depth so it coincides with F0 at a reference camera (parallax away from it)
//   plateButtonBg()  the plateButton panel (lib/f16_seams.mjs) as a drawing in PLATE coordinates, extended beyond the frame: the
//                console face of the control room IS the plate, scaled down around the button (c05 grows its world out of the plate)
//   nibPage()    the plateNib paper + ink line in PLATE coordinates (c08 lands on it): the top page of the training stack IS the plate
//   paperSheet(), coolHand(), magnifier(), lineCard() … small props drawn in the current space
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f16_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, prng, drift, halo, glowFill, F0, cardM, card } = E;

export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
export const ease = (t, a, b) => sineIO(span(t, a, b));

// ------------------------------------------------------------------------------------------------------------------------- sky
export function sky(ctx, t, lift = 0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  E.nightSky(ctx, [[0, P.night0], [.5, P.night1], [1, P.ind0]], 0, H);
  ctx.fillStyle = rad(ctx, 1500, 260, 1500, [[0, rgba(P.ind1, .55)], [.5, rgba(P.ind1, .2)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(0, 0, W, H);
  if (lift > 0) { ctx.fillStyle = rad(ctx, 960, 420, 1400, [[0, rgba(P.ind1, .5 * lift)], [1, rgba(P.ind1, .22 * lift)]]); ctx.fillRect(0, 0, W, H); }   // a lighter night for the dial (luma)
  E.stars(ctx, 1625, 170, t, [-260 + 40 * Math.sin(t * .031), -60 + 14 * Math.sin(t * .047), W + 520, H * .95], .55);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------------------------------- layers
// fn draws in F0 design coordinates; it is placed on card Z so that at camera cref it looks exactly like F0 content.
export function layer(ctx, c, Z, cref, fn) {
  const m0 = cardM(cref, F0), mz = cardM(cref, Z); if (!m0 || !mz) return;
  const a = m0.k / mz.k, bx = (m0.e - mz.e) / mz.k, by = (m0.f - mz.f) / mz.k;
  card(ctx, c, Z, (k) => { ctx.transform(a, 0, 0, a, bx, by); fn(k * a); });
}
export const proj = (c, u, v) => E.project(c, F0, u, v);

// ------------------------------------------------------------------------------------------------------------------------- plates
// plateButton's background (panel gradient + brushed brass lines), in plate coordinates, extended to ±4 frames (identical inside the frame)
export function plateButtonBg(ctx) {
  ctx.fillStyle = lin(ctx, 0, 0, W, H, [[0, mixHex(P.night1, P.shade0, .12)], [1, P.night0]]); ctx.fillRect(-4 * W, -4 * H, 9 * W, 9 * H);
  ctx.fillStyle = rad(ctx, 960, 300, 1300, [[0, rgba(P.shade0, .32)], [.5, rgba(P.shade0, .12)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-4 * W, -4 * H, 9 * W, 9 * H);
  const r = prng(16); ctx.strokeStyle = rgba(P.halo1, .05); ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) { const y = r() * H, d = (r() - .5) * 8; ctx.beginPath(); ctx.moveTo(-4 * W, y - 4 * d); ctx.lineTo(5 * W, y + 5 * d); ctx.stroke(); }
  const r2 = prng(1616);
  for (let i = 0; i < 260; i++) { const y = -4 * H + r2() * 9 * H, d = (r2() - .5) * 8; if (y >= -20 && y <= H + 20) continue; ctx.beginPath(); ctx.moveTo(-4 * W, y - 4 * d); ctx.lineTo(5 * W, y + 5 * d); ctx.stroke(); }
}
// plateNib's paper, fibres, ink line (up to x = xi) in plate coordinates; the pen is drawn by the caller. ext: paper beyond the frame
export const NIB = { x: 930, y: 600, ang: -.62, L: 980, line0: 260 };
export const inkY = (x) => NIB.y + 6 * Math.sin(x * .043) + 2.5 * Math.sin(x * .13);
export function nibPaper(ctx, ext = [0, 0, W, H]) {
  ctx.fillStyle = rad(ctx, 900, 520, 1250, [[0, P.core1], [.25, P.halo0], [.55, P.halo1], [.85, P.shade0], [1, mixHex(P.shade0, P.night1, .5)]]); ctx.fillRect(...ext);
  const r = prng(77); ctx.strokeStyle = rgba(P.shade0, .1); ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) { const x0 = r() * W, y0 = r() * H, l = 20 + r() * 60, a = r() * 6.28; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(a) * l, y0 + Math.sin(a) * l); ctx.stroke(); }
}
export function nibInk(ctx, xi) {
  if (xi <= NIB.line0 + 1) return;
  ctx.save(); ctx.lineCap = 'round';
  // the plate's gradient runs line0 → NIB.x; while the line is still being written its warm end sits at the nib (same stops, shorter run)
  ctx.strokeStyle = lin(ctx, NIB.line0, 0, xi, 0, [[0, rgba(P.shade0, .8)], [.85, rgba(mixHex(P.shade0, P.ind2, .3), .9)], [1, P.halo0]]); ctx.lineWidth = 5; ctx.beginPath();
  for (let x = NIB.line0; x <= xi; x += 6) { const y = inkY(x); x === NIB.line0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  if (xi < NIB.x && (xi - NIB.line0) % 6) ctx.lineTo(xi, inkY(xi));   // at the end exactly the plate's polyline
  ctx.stroke(); ctx.restore();
}

// ------------------------------------------------------------------------------------------------------------------------- props
// a sheet of paper (light): w × h centred at (x, y), rotation rot, flip 0..1 (1 = seen edge-on halfway; we use |cos| for a flip),
// side: 'paper' (warm light) or 'steel' (the door's face), lines: faint printed lines
export function sheet(ctx, x, y, w, h, rot, o = {}) {
  const sx = o.sx ?? 1, a = o.a ?? 1; if (Math.abs(sx) < .01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx, 1); ctx.globalAlpha *= a;
  const p = new Path2D(); p.rect(-w / 2, -h / 2, w, h);
  if (o.steel) {
    ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(P.blue1, P.ind2, .3)], [1, P.night1]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.blue0, .35); ctx.lineWidth = Math.max(1, w * .015); ctx.stroke(p);
  } else {
    const lit = o.lit ?? 1;
    if (o.glow !== false) glowFill(ctx, p, Math.max(4, w * .18), .35 * lit, P.halo1);
    ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(P.shade0, P.core1, .35 + .5 * lit)], [.6, mixHex(P.shade0, P.halo0, .3 + .5 * lit)], [1, mixHex(P.shade0, P.night1, .35 - .2 * lit)]]); ctx.fill(p);
    const n = o.lines ?? 0;
    if (n) { ctx.strokeStyle = rgba(P.shade0, .7); ctx.lineWidth = Math.max(.6, h * .018); ctx.lineCap = 'round';
      for (let i = 0; i < n; i++) { const yy = -h / 2 + h * (.2 + .62 * i / Math.max(1, n - 1)), x1 = w * (i === n - 1 ? .05 : .32 - .08 * ((i * 7) % 3));
        ctx.beginPath(); if (o.hand) { for (let k = 0; k <= 14; k++) { const q = k / 14, xx = lerp(-w * .36, x1, q); k ? ctx.lineTo(xx, yy + Math.sin(q * 17 + i * 2) * h * .012) : ctx.moveTo(xx, yy); } } else { ctx.moveTo(-w * .36, yy); ctx.lineTo(x1, yy); } ctx.stroke(); } }
  }
  ctx.restore();
}
// the machine's hand: cool cream light (never gold), open palm, fingers up. (x, y) = wrist, ang = finger direction, L = palm length
export function coolHand(ctx, x, y, ang, L, t, o = {}) {
  if (L < .5) return;
  const m = E.handMatrix(x, y, ang, L, o.flip ?? 1), path = new Path2D(); path.addPath(E.handPath({ pose: 'open', curl: o.curl ?? 0, spread: o.spread }), m);
  const br = (o.bright ?? 1), a = o.a ?? 1;
  const cool = mixHex(P.cream, P.blue0, .38);
  glowFill(ctx, path, L * 1.1, .38 * br * a, P.blue0);
  glowFill(ctx, path, L * .22, .45 * br * a, mixHex(P.blue0, P.cream, .5));
  const [cx, cy] = E.applyM(m, .9, 0);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rad(ctx, cx, cy, L * 2.4, [[0, mixHex(P.core0, cool, .3)], [.3, cool], [.7, mixHex(cool, P.blue1, .45)], [1, mixHex(P.blue1, P.ind2, .5)]]);
  ctx.fill(path);
  ctx.clip(path); ctx.filter = `blur(${Math.max(1, L * .05)}px)`; ctx.strokeStyle = rgba(P.blue1, .55); ctx.lineWidth = L * .1; ctx.stroke(path);
  ctx.restore();
  return { center: [cx, cy] };
}
// a cool light core (the machine's values): radius r, sharp or blurred (o.blur in px)
export function core(ctx, x, y, r, t, o = {}) {
  if (r <= .5) return;
  const warm = o.warm ?? 0, col = mixHex(mixHex(P.cream, P.blue0, .4), P.halo0, warm), br = 1 + .05 * Math.sin(t * 1.9);
  halo(ctx, x, y, r * 4.2 * br, .32 * (o.a ?? 1), warm > .5 ? P.halo0 : P.blue0, col);
  ctx.save(); if (o.blur) ctx.filter = `blur(${o.blur}px)`;
  ctx.fillStyle = rad(ctx, x - r * .25, y - r * .3, r * 1.3, [[0, P.core0], [.45, col], [1, mixHex(col, P.blue1, .5 - .4 * warm)]]);
  ctx.beginPath(); ctx.arc(x, y, r * br, 0, 6.29); ctx.fill(); ctx.restore();
}
// a brass magnifier: lens centre (x, y), radius r, handle toward ang. The lens is drawn by the caller (inside) between ring parts.
export function magnifierRing(ctx, x, y, r, ang, t) {
  ctx.save();
  const hx = x + Math.cos(ang) * r, hy = y + Math.sin(ang) * r;
  ctx.lineCap = 'round'; ctx.strokeStyle = lin(ctx, hx, hy, hx + Math.cos(ang) * r * 1.4, hy + Math.sin(ang) * r * 1.4, [[0, P.shade0], [1, mixHex(P.shade0, P.night1, .5)]]);
  ctx.lineWidth = r * .22; ctx.beginPath(); ctx.moveTo(hx + Math.cos(ang) * r * .12, hy + Math.sin(ang) * r * .12); ctx.lineTo(hx + Math.cos(ang) * r * 1.35, hy + Math.sin(ang) * r * 1.35); ctx.stroke();
  ctx.strokeStyle = lin(ctx, x - r, y - r, x + r, y + r, [[0, P.halo2], [.5, P.halo1], [1, P.shade0]]); ctx.lineWidth = r * .13;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.stroke();
  ctx.strokeStyle = rgba(P.core1, .5); ctx.lineWidth = r * .03; ctx.beginPath(); ctx.arc(x, y, r * .95, Math.PI * 1.05, Math.PI * 1.45); ctx.stroke();
  ctx.restore();
}
export function lensGlass(ctx, x, y, r, fn) {
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.clip();
  ctx.fillStyle = rgba(P.night1, .55); ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  fn();
  ctx.fillStyle = lin(ctx, x - r, y - r, x + r * .3, y + r * .3, [[0, rgba(P.cream, .12)], [1, rgba(P.cream, 0)]]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  ctx.restore();
}
// a thin gold rule with a short line of text rising above it (the three statements of 5.03, the tags of 8.08)
export function ruleText(ctx, t, x, y, text, size, uRule, uText, o = {}) {
  const w = K.measure(text, size, o.serif ?? true, o.weight ?? 600);
  if (uRule > 0) K.rule(ctx, x, y + size * .32, x + w * uRule, y + size * .32, 1, { spark: uRule < 1, w: 1.6, a: o.ruleA ?? .9 });
  if (uText > 0) K.maskLine(ctx, [[text, o.warm ?? 0]], x, y, size, uText, { serif: o.serif ?? true, weight: o.weight, col: o.col, glow: o.glow });
  return w;
}
// an arc of light (dial): centre (cx, cy), radius R, from angle a0 to a1 (canvas angles), colour from warm (left) to cool (right)
export function arcBand(ctx, cx, cy, R, a0, a1, o = {}) {
  if (a1 <= a0 + 1e-4) return;
  const n = Math.max(2, Math.ceil((a1 - a0) / .04)), w = o.w ?? 10, A = o.a ?? 1;
  const colAt = (ang) => { const u = clamp((ang - Math.PI) / Math.PI); return u < .5 ? mixHex(P.halo0, P.cream, u * 2) : mixHex(P.cream, mixHex(P.blue0, P.cream, .25), (u - .5) * 2); };
  ctx.save(); ctx.lineCap = 'round';
  ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${w * 1.6}px)`; ctx.globalAlpha = .35 * A;
  ctx.strokeStyle = mixHex(P.halo1, P.blue0, .5); ctx.lineWidth = w * 3; ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.lineCap = 'butt'; ctx.globalAlpha = A;
  for (let i = 0; i < n; i++) {
    const b0 = lerp(a0, a1, i / n), b1 = lerp(a0, a1, (i + 1) / n);
    ctx.strokeStyle = colAt((b0 + b1) / 2); ctx.lineWidth = w; ctx.beginPath(); ctx.arc(cx, cy, R, b0, b1 + .004); ctx.stroke();
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------------------------------- book
// K.book with two fixes for closing (kit wish to the lead): when the right half folds over, its glow and the right half of the page
// block fold with it, so the closed book is the left half only (the kit version leaves a gold slab and a glow where the right page was).
const BOOK_SEED = prng(1616), BOOK_JIT = Array.from({ length: 40 }, () => [BOOK_SEED(), BOOK_SEED()]);
export function bookB2(ctx, cx, cy, hw, ph, t, o = {}) {
  const a = o.a ?? 1, close = clamp(o.close ?? 0), nl = o.lines ?? 9, warm = clamp(o.warm ?? 0);
  const sag = ph * .07, lip = ph * .05;                                       // page tops curve down from the spine; outer corners lift
  const pageL = (s) => {                                                      // s = -1 left, +1 right · local page outline
    const p = new Path2D(); const x1 = cx + s * hw;
    p.moveTo(cx, cy); p.bezierCurveTo(cx + s * hw * .25, cy + sag, cx + s * hw * .7, cy + sag * .4, x1, cy - lip);
    p.lineTo(x1 - s * hw * .015, cy + ph - lip * .4); p.bezierCurveTo(cx + s * hw * .7, cy + ph + sag * .5, cx + s * hw * .25, cy + ph + sag * 1.1, cx, cy + ph + sag * .5);
    p.closePath(); return p;
  };
  // where a point (u across 0..1 from the spine, v down 0..1) lies on a page (follows the curved top/bottom)
  const page = (s, u, v) => {
    const top = cy + sag * 4 * u * (1 - u) * .9 - lip * u * u, bot = cy + ph + sag * (1 - u) * .7 - lip * .4 * u;
    return [cx + s * hw * u, lerp(top, bot, v)];
  };
  const gl = o.glow ?? 1;
  ctx.save(); ctx.globalAlpha = a;
  // the block of pages under the spread (thickness), dark gold edges
  const blk = new Path2D(); blk.moveTo(cx - hw, cy - lip + ph * .02); blk.lineTo(cx - hw * 1.012, cy + ph - lip * .4 + ph * .05); blk.quadraticCurveTo(cx, cy + ph + sag * 1.6 + ph * .06, cx + hw * 1.012, cy + ph - lip * .4 + ph * .05); blk.lineTo(cx + hw, cy - lip + ph * .02); blk.closePath();
  const fold0 = Math.cos(Math.PI * close), both = new Path2D(); both.addPath(pageL(-1));
  if (fold0 > 0) both.addPath(pageL(1), { a: fold0, b: 0, c: 0, d: 1, e: cx * (1 - fold0), f: 0 });   // B2 fix: the right page's glow folds with it
  glowFill(ctx, both, hw * .9 * gl, .45 * a, P.blue0);                       // the light lifts the night to blue round it
  glowFill(ctx, both, hw * .28 * gl, (.55 + .25 * warm) * a, P.halo1);
  ctx.save(); if (close > 0) { ctx.beginPath(); ctx.rect(cx - hw * 2, cy - ph, hw * 2 + hw * 1.03 * Math.max(0, fold0), ph * 3); ctx.clip(); }   // B2 fix
  ctx.fillStyle = lin(ctx, 0, cy + ph * .6, 0, cy + ph * 1.2, [[0, P.shade0], [1, mixHex(P.shade0, P.night1, .6)]]); ctx.fill(blk);
  ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = Math.max(1, ph * .004);
  for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(cx - hw * 1.004, cy + ph - lip * .4 + ph * .012 * k); ctx.quadraticCurveTo(cx, cy + ph + sag * 1.6 + ph * .012 * k, cx + hw * 1.004, cy + ph - lip * .4 + ph * .012 * k); ctx.stroke(); }
  ctx.restore();
  const out = { lines: { L: [], R: [] }, spine: [cx, cy], rect: [cx - hw, cy - lip, cx + hw, cy + ph + sag], page };
  const drawPage = (s, flip = 1) => {
    const p = pageL(s);
    ctx.fillStyle = rad(ctx, cx + s * hw * .18 * flip, cy + ph * .42, hw * 1.15, [[0, P.core0], [.22, P.core1], [.55, mixHex(P.halo0, P.core1, warm * .5)], [.85, P.halo1], [1, P.shade0]]); ctx.fill(p);
    ctx.save(); ctx.clip(p);                                                   // the gutter shadow and the soft edge darkening (volume)
    ctx.fillStyle = lin(ctx, cx, 0, cx + s * hw * .16, 0, [[0, rgba(P.shade0, .55)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(cx - hw, cy - ph, 2 * hw, 3 * ph);
    ctx.filter = `blur(${ph * .02}px)`; ctx.strokeStyle = rgba(P.shade0, .45); ctx.lineWidth = ph * .05; ctx.stroke(p); ctx.restore();
    // printed lines: thin gold-shadow strokes that follow the page curve; a lifted line is gone from the page
    for (let i = 0; i < nl; i++) {
      const v = .12 + .76 * i / Math.max(1, nl - 1), j = BOOK_JIT[(i + (s > 0 ? 17 : 0)) % 40];
      const u0 = .12 + .03 * j[0], u1 = (i === nl - 1 ? .55 : .86) - .1 * j[1];
      const p0 = page(s, u0, v), p1 = page(s, u1, v), pm = page(s, (u0 + u1) / 2, v);
      const lifted = o.lift ? clamp(o.lift(i, s > 0 ? 'R' : 'L')) : 0;
      out.lines[s > 0 ? 'R' : 'L'].push([p0[0], p0[1], p1[0], p1[1], pm[0], pm[1]]);
      if (lifted >= 1) continue;
      ctx.strokeStyle = rgba(mixHex(P.shade0, P.ind2, .25), .7 * (1 - lifted)); ctx.lineWidth = Math.max(1.2, ph * .011); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(pm[0], pm[1] - ph * .004, p1[0], p1[1]); ctx.stroke();
    }
  };
  drawPage(-1);
  // the right half: open (close 0) → folds over the spine (scale in x) → lies on the left as the back cover (close 1)
  const fold = Math.cos(Math.PI * close);
  if (close <= 0) drawPage(1);
  else {
    ctx.save(); ctx.translate(cx, 0); ctx.scale(fold, 1); ctx.translate(-cx, 0);
    if (fold > 0) drawPage(1, 1);
    else {                                                                     // past 90°: we see the cover (dark cloth, gold rim)
      const p = pageL(1);
      ctx.fillStyle = lin(ctx, cx, cy, cx + hw, cy + ph, [[0, P.ind2], [.6, P.ind1], [1, P.night1]]); ctx.fill(p);
      ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = Math.max(1.5, ph * .008); ctx.stroke(p);
    }
    ctx.restore();
  }
  // riffle: three pages lift off the right half and sweep toward the spine and back (u 0 → 1 → 0), staggered
  const rf = clamp(o.riffle ?? 0);
  if (rf > 0 && rf < 1 && close <= 0) {
    for (let k = 0; k < 3; k++) {
      const q = clamp((rf - k * .12) / .64), ang = Math.sin(Math.PI * q) * (.55 + .12 * k);
      if (q <= 0 || q >= 1) continue;
      ctx.save(); ctx.translate(cx, 0); ctx.scale(Math.cos(ang), 1); ctx.translate(-cx, -ph * .05 * Math.sin(ang));
      const p = pageL(1); ctx.fillStyle = rad(ctx, cx + hw * .3, cy + ph * .4, hw * 1.1, [[0, P.core1], [.6, P.halo0], [1, P.halo1]]); ctx.fill(p);
      ctx.strokeStyle = rgba(P.shade0, .5); ctx.lineWidth = Math.max(1, ph * .005); ctx.stroke(p); ctx.restore();
    }
  }
  ctx.restore();
  if (warm > 0) halo(ctx, cx - hw * .45, cy + ph * .45, hw * .8, .25 * warm * a, P.halo0, P.core1);
  return out;
}
