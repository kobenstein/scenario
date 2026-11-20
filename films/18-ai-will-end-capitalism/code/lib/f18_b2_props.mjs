// Film 18 · B2 (c05–c08) · props of the board that only B2 needs. Owned by B2; drawn by lib/f18_b2_world.mjs.
// Everything here draws in the caller's space (world units inside stand(), or screen px) unless the name says otherwise.
// No canvas / pattern caches per frame; seeded randomness only.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f18_kit.mjs';
import { HOOK_PLATE } from './f18_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, rad, lin, glowFill, halo, prng } = E;
const { BOARD, COOL, wp } = F;

// ------------------------------------------------------------------------------------------------ screen-space night (= the plates' night)
// lib/f18_seams.mjs draws its plates on this exact night (not exported there): copied 1:1 so B2 can converge onto / grow out of a plate.
export function plateNight(ctx, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); ctx.fillRect(0, 0, W, H);
  E.stars(ctx, 1818, 90, t, [0, 0, W, H], .55 * a);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the column of value (plate units)
// Exactly the column of plateHook, drawn in "plate px" (the column's top centre is (HOOK_PLATE.x, top)); the caller maps plate px to
// the world. o: { top (plate y of the dome, default colTop), bottom (plate y of the foot), coreEnd (plate y where the core strip has
// faded; plate: H), glowY (centre of the foot glow; plate: H + 200), glowA (1), a (1), dust (emit level, plate .4), pulse 0..1 }
export function columnPlate(ctx, t, o = {}) {
  const T = HOOK_PLATE, top = o.top ?? T.colTop, bot = o.bottom ?? H + 10, a = o.a ?? 1;
  if (a <= 0 || bot - top < 2) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const gy = o.glowY ?? H + 200;
  ctx.fillStyle = rad(ctx, T.x, gy, 900, [[0, rgba(P.halo1, .35 * (o.glowA ?? 1))], [.5, rgba(P.blue0, .2 * (o.glowA ?? 1))], [1, rgba(P.blue0, 0)]]); ctx.fillRect(T.x - 900, gy - 900, 1800, 1800);
  ctx.restore();
  const cw = T.colW * (1 + .02 * Math.sin(t * 1.4)) * (o.wk ?? 1);
  ctx.fillStyle = lin(ctx, T.x - cw / 2, 0, T.x + cw / 2, 0, [[0, rgba(P.halo1, 0)], [.2, rgba(P.halo0, .7)], [.5, P.core1], [.8, rgba(P.halo0, .7)], [1, rgba(P.halo1, 0)]]);
  // the plate's side lines run from (±cw/2, H + 10) to (±.42 cw, top + 40); a longer column keeps the same lines (it only gets longer)
  const k = (bot - (top + 40)) / (H + 10 - (T.colTop + 40)) / (o.wk ?? 1), hw = cw * .42 + cw * .08 * k;
  ctx.beginPath(); ctx.moveTo(T.x - hw, bot); ctx.lineTo(T.x - cw * .42, top + 40); ctx.quadraticCurveTo(T.x, top - 30, T.x + cw * .42, top + 40); ctx.lineTo(T.x + hw, bot); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const ce = o.coreEnd ?? H;
  ctx.fillStyle = lin(ctx, 0, top, 0, Math.max(top + 1, ce), [[0, rgba(P.core0, .5 + .3 * (o.pulse ?? 0))], [1, rgba(P.core0, 0)]]); ctx.fillRect(T.x - cw * .12, top, cw * .24, bot - top);
  if ((o.pulse ?? 0) > 0) { ctx.fillStyle = lin(ctx, T.x - cw / 2, 0, T.x + cw / 2, 0, [[0, rgba(P.halo0, 0)], [.5, rgba(P.halo0, .35 * o.pulse)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(T.x - cw / 2, top, cw, bot - top); }
  ctx.restore();
  const em = o.dust ?? .4;
  if (em > 0) F.evap(ctx, t, [[T.x - cw * .35, top + 30], [T.x + cw * .35, top + 30]], () => em, { seed: 5, size: 3, rise: 260 });
  ctx.restore();
}
// the empty hook (plate units): thread from (thX, thY0) down to the ring at (x, y). Plate: thread top (HOOK_PLATE.x, −10), ring at
// (HOOK_PLATE.x + 3 sin 1.1t, 380). o: { glint 0..1 }
export function hookPlate(ctx, t, x, y, thX, thY0, o = {}) {
  const T = HOOK_PLATE, k = o.k ?? 1, r = T.r * k;
  ctx.save();
  ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 3 * Math.sqrt(k); ctx.beginPath(); ctx.moveTo(thX, thY0); ctx.lineTo(x, y - r); ctx.stroke();
  ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = 6 * k; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.stroke();
  halo(ctx, x, y, 70 * k * (1 + .6 * (o.glint ?? 0)), .35 + .4 * (o.glint ?? 0), P.halo0, P.core1);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the search bar (world units)
// A long search box of light with a magnifier glyph (no logo). Centre (x, y), full width w, height h, grown 0..1 from the centre.
export function searchBar(ctx, t, x, y, w, h, u, a = 1) {
  if (u <= 0 || a <= 0) return;
  const ww = lerp(h * 1.2, w, expoOut(u)), p = new Path2D(); p.roundRect(x - ww / 2, y - h / 2, ww, h, h / 2);
  ctx.save(); ctx.globalAlpha *= a;
  glowFill(ctx, p, h * .9, .55, P.blue0); glowFill(ctx, p, h * .25, .6, P.halo0);
  ctx.fillStyle = lin(ctx, 0, y - h / 2, 0, y + h / 2, [[0, P.core0], [1, P.core1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.shade0, .7); ctx.lineWidth = h * .05; ctx.stroke(p);
  // the magnifier at the left end (it rides out with the growing end)
  const mx = x - ww / 2 + h * .62, my = y - h * .04, mr = h * .2, ink = mixHex(P.shade0, P.night1, .35);
  ctx.strokeStyle = ink; ctx.lineWidth = h * .075; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.29); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(mx + mr * .72, my + mr * .72); ctx.lineTo(mx + mr * 1.55, my + mr * 1.55); ctx.stroke();
  // a blinking caret where you would type (nothing typed: it costs nothing)
  const cu = span(u, .6, 1);
  if (cu > 0) { ctx.globalAlpha *= cu * (.35 + .65 * F.blink(t, 0, 1.1)); ctx.fillStyle = ink; ctx.fillRect(mx + h * .55, y - h * .26, h * .045, h * .52); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the record (world units)
// A record of light standing on its edge (the song whose price hit zero in c03): dark disc, gold grooves, lit label. Origin = foot.
export function record(ctx, t, r, o = {}) {
  const a = o.a ?? 1, spin = t * .6;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, -r);
  const d = new Path2D(); d.arc(0, 0, r, 0, 6.29);
  glowFill(ctx, d, r * .35, .35, P.blue0);
  ctx.fillStyle = rad(ctx, -r * .3, -r * .3, r * 1.3, [[0, mixHex(P.night1, P.blue1, .5)], [1, P.night0]]); ctx.fill(d);
  ctx.strokeStyle = rgba(P.halo1, .9); ctx.lineWidth = r * .02; ctx.stroke(d);
  for (let k = 0; k < 6; k++) { ctx.strokeStyle = rgba(P.halo1, .12 + .05 * (k % 2)); ctx.lineWidth = r * .012; ctx.beginPath(); ctx.arc(0, 0, r * (.45 + k * .085), spin + k, spin + k + 4.6); ctx.stroke(); }
  const l = new Path2D(); l.arc(0, 0, r * .3, 0, 6.29);
  ctx.fillStyle = rad(ctx, 0, 0, r * .3, [[0, P.core0], [.6, P.core1], [1, P.halo0]]); ctx.fill(l);
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(0, 0, r * .035, 0, 6.29); ctx.fill();
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the three doors' places (world units)
// the bare earth round the ground door (drawn ON the ground: call with a ground projection, see groundPoly in the world)
// a power pylon (lattice silhouette), origin = foot centre, height h; returns the tip of its upper cross-arm (for the wire)
export function pylon(ctx, t, h, o = {}) {
  const w = h * .34, a = o.a ?? 1, rim = o.rim ?? P.blue0;
  ctx.save(); ctx.globalAlpha *= a;
  const legs = new Path2D(); legs.moveTo(-w / 2, 0); legs.lineTo(-w * .08, -h); legs.lineTo(w * .08, -h); legs.lineTo(w / 2, 0);
  ctx.strokeStyle = mixHex(P.ind2, P.blue0, .55); ctx.lineWidth = h * .022; ctx.lineJoin = 'round'; ctx.stroke(legs);
  // the lattice
  ctx.lineWidth = h * .009; ctx.strokeStyle = mixHex(P.ind2, P.blue0, .4);
  for (let k = 0; k < 6; k++) {
    const y0 = -h * k / 6, y1 = -h * (k + 1) / 6, x0 = lerp(w / 2, w * .08, k / 6), x1 = lerp(w / 2, w * .08, (k + 1) / 6);
    ctx.beginPath(); ctx.moveTo(-x0, y0); ctx.lineTo(x1, y1); ctx.moveTo(x0, y0); ctx.lineTo(-x1, y1); ctx.moveTo(-x1, y1); ctx.lineTo(x1, y1); ctx.stroke();
  }
  // two cross-arms with insulators
  ctx.lineWidth = h * .018; ctx.strokeStyle = mixHex(P.ind2, P.blue0, .6);
  for (const [yy, ww] of [[-h * .78, w * .95], [-h * .6, w * .75]]) { ctx.beginPath(); ctx.moveTo(-ww, yy); ctx.lineTo(ww, yy); ctx.stroke(); }
  ctx.strokeStyle = rgba(rim, .8); ctx.lineWidth = h * .006; ctx.beginPath(); ctx.moveTo(-w * .08, -h); ctx.lineTo(-w / 2, 0); ctx.stroke();
  for (const s of [-1, 1]) halo(ctx, s * w * .95, -h * .78 + h * .03, h * .05, .5 + .2 * Math.sin(t * 1.3 + s), P.halo0, P.core1);
  ctx.restore();
  return { armL: [-w * .95, -h * .78 + h * .03], armR: [w * .95, -h * .78 + h * .03], top: [0, -h] };
}
// the chip block the chip door is set into: a dark square package with pins left and right. origin = foot centre; size s (square)
export function chipBlock(ctx, t, s, o = {}) {
  const a = o.a ?? 1, lit = o.lit ?? .5;
  ctx.save(); ctx.globalAlpha *= a;
  const b = new Path2D(); b.roundRect(-s / 2, -s, s, s, s * .04);
  ctx.fillStyle = lin(ctx, -s / 2, 0, s / 2, 0, [[0, P.night1], [.5, mixHex(P.night1, P.ind2, .7)], [1, P.night0]]); ctx.fill(b);
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = s * .01; ctx.stroke(b);
  ctx.strokeStyle = rgba(P.blue0, .35); ctx.lineWidth = s * .006; ctx.strokeRect(-s * .42, -s * .92, s * .84, s * .84);
  // pins
  const n = 7;
  for (let i = 0; i < n; i++) {
    const y = -s * (.12 + .76 * i / (n - 1));
    for (const sd of [-1, 1]) {
      ctx.fillStyle = mixHex(mixHex(P.shade0, P.ind2, .5), P.halo0, lit * (.5 + .5 * Math.sin(t * 1.7 + i * .9 + sd)));
      ctx.fillRect(sd < 0 ? -s / 2 - s * .09 : s / 2, y - s * .018, s * .09, s * .036);
    }
  }
  ctx.fillStyle = rgba(P.blue0, .8); ctx.beginPath(); ctx.arc(-s * .34, -s * .84, s * .025, 0, 6.29); ctx.fill();   // the pin-1 notch
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the bill (screen px)
// A receipt of light that unrolls downward from its top edge. (x, y) = top centre, w width; rows [{ k, v, lit 0..1 }]; u 0..1 unroll
// (the clip grows down, a roll rides on the edge); roll-up = u going back. Thinking sits dim at ≈ 0; lit rows warm and glow.
export function bill(ctx, t, x, y, w, rows, u, o = {}) {
  if (u <= 0) return null;
  const rh = o.rowH ?? 84, pad = 46, h = pad * 2 + rows.length * rh + 30, cur = h * expoOut(u) * (u >= 1 ? 1 : 1);
  const p = new Path2D(); const zz = 14, nz = Math.round(w / (zz * 2));
  p.moveTo(x - w / 2, y); p.lineTo(x + w / 2, y); p.lineTo(x + w / 2, y + h);
  for (let i = nz; i >= 0; i--) p.lineTo(x - w / 2 + i * w / nz, y + h + (i % 2 ? zz : 0));
  p.closePath();
  ctx.save();
  ctx.beginPath(); ctx.rect(x - w, y - 40, w * 2, cur + 40); ctx.clip();
  glowFill(ctx, p, w * .18, .45, P.blue0); glowFill(ctx, p, w * .03, .5, P.halo0);
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, P.core0], [.5, P.core1], [1, mixHex(P.core1, P.halo0, .6)]]); ctx.fill(p);
  const ink = mixHex(P.shade0, P.night1, .35);
  ctx.strokeStyle = rgba(P.shade0, .5); ctx.lineWidth = 2; ctx.setLineDash([3, 7]);
  ctx.beginPath(); ctx.moveTo(x - w / 2 + 30, y + pad - 18); ctx.lineTo(x + w / 2 - 30, y + pad - 18); ctx.stroke(); ctx.setLineDash([]);
  rows.forEach((r, i) => {
    const ry = y + pad + i * rh + rh * .62, lit = clamp(r.lit ?? 0), dim = r.dim ?? 0;
    if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = rgba(P.halo0, .55 * lit); ctx.fillRect(x - w / 2 + 16, ry - rh * .62, w - 32, rh * .86); ctx.restore(); }
    const col = mixHex(ink, mixHex(P.halo1, P.core1, .3), dim * .55);
    ctx.font = `600 ${o.size ?? 40}px Inter`; ctx.letterSpacing = '0.12em'; ctx.textAlign = 'left'; ctx.fillStyle = col; ctx.fillText(r.k, x - w / 2 + 44, ry);
    const kw = ctx.measureText(r.k).width; ctx.letterSpacing = '0em';
    // leader dots
    ctx.fillStyle = rgba(col, .7); const x0 = x - w / 2 + 60 + kw, x1 = x + w / 2 - 130;
    for (let d = x0; d < x1; d += 16) ctx.fillRect(d, ry - 4, 4, 4);
    if (r.v) { ctx.font = `600 ${(o.size ?? 40)}px Inter`; ctx.textAlign = 'right'; ctx.fillStyle = col; ctx.fillText(r.v, x + w / 2 - 40, ry + 4); }
    else doorGlyph(ctx, x + w / 2 - 78, ry + 6, rh * .58, col, lit);
  });
  ctx.restore();
  // the roll riding on the unrolling edge
  { const ry = y + cur;                                                       // (it stays as the bill's bottom: it rolls back up when the bill leaves)
    ctx.save(); ctx.fillStyle = lin(ctx, 0, ry - 16, 0, ry + 16, [[0, P.halo1], [.5, P.core0], [1, P.shade0]]); const rw = (w + 20) * smooth(clamp(u * 5)); ctx.beginPath(); ctx.roundRect(x - rw / 2, ry - 16, rw, 32, 16); ctx.fill(); ctx.restore(); }
  return { h, bottom: y + cur };
}
// a small arched doorway glyph (the door on the bill), foot at (x, y), height h
export function doorGlyph(ctx, x, y, h, col, lit = 0) {
  const w = h * .55, p = new Path2D(); p.moveTo(x - w / 2, y); p.lineTo(x - w / 2, y - h + w / 2); p.arc(x, y - h + w / 2, w / 2, Math.PI, 0); p.lineTo(x + w / 2, y); p.closePath();
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, h * .09); ctx.stroke(p);
  if (lit > 0) { ctx.globalAlpha = lit; ctx.fillStyle = col; ctx.fill(p); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ data-centre blocks (world, projected)
// one flat block on the ground: footprint (X0..X1, Z0..Z1), height hgt. Drawn in screen space from the camera (top + front face +
// the side facing the camera). u 0..1: it rises out of the ground. lights: a few blinking cool points along the roof.
export function dcBlock(ctx, c, t, X0, X1, Z0, Z1, hgt, u, o = {}) {
  if (u <= 0) return;
  const Y = BOARD.GY, h = hgt * expoOut(u) * (1 - (o.sink ?? 0)), seed = o.seed ?? 1;
  if (h < 1) return;
  const P3 = (x, y, z) => wp(c, x, y, z);
  const tl = P3(X0, Y - h, Z1), tr = P3(X1, Y - h, Z1), br = P3(X1, Y - h, Z0), bl = P3(X0, Y - h, Z0), fl = P3(X0, Y, Z0), fr = P3(X1, Y, Z0);
  if (!tl || !tr || !br || !bl || !fl || !fr) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  // side face toward the camera (left or right)
  const sideX = c.x < X0 ? X0 : c.x > X1 ? X1 : null;
  if (sideX != null) { const a = P3(sideX, Y, Z0), b = P3(sideX, Y, Z1), d = P3(sideX, Y - h, Z1), e = P3(sideX, Y - h, Z0); if (a && b && d && e) poly([a, b, d, e], mixHex(P.night0, COOL.deep, .25)); }
  poly([fl, fr, br, bl], mixHex(P.night1, COOL.deep, .45));                                  // front face
  poly([tl, tr, br, bl], mixHex(mixHex(P.ind1, COOL.deep, .55), COOL.edge, .18 + .1 * (o.lit ?? 0)));   // roof
  ctx.strokeStyle = rgba(COOL.mid, .55); ctx.lineWidth = Math.max(1, 6 * bl[2]); ctx.beginPath(); ctx.moveTo(bl[0], bl[1]); ctx.lineTo(br[0], br[1]); ctx.stroke();
  // roof units (rows of small rectangles) and blinking lights on the front
  const r = prng(seed * 97 + 3);
  ctx.fillStyle = rgba(COOL.edge, .35);
  for (let i = 0; i < 4; i++) { const zz = lerp(Z0, Z1, (i + .5) / 4), a = P3(lerp(X0, X1, .1), Y - h, zz), b = P3(lerp(X0, X1, .9), Y - h, zz); if (a && b) { ctx.fillRect(a[0], a[1] - 1, b[0] - a[0], Math.max(1, 14 * a[2])); } }
  for (let i = 0; i < 7; i++) {
    const fx = (i + .5 + .3 * (r() - .5)) / 7, on = .5 + .5 * Math.sin(t * (1.1 + r() * 2.2) + r() * 6), p = P3(lerp(X0, X1, fx), Y - h * .55, Z0);
    if (!p) continue; const s = Math.max(1.4, 18 * p[2]);
    ctx.fillStyle = rgba(COOL.core, .35 + .6 * on * u); ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s);
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the section (world units, at the house)
// The cut face of the earth under your house: from the ground (y 0) down to depth d, width w, centred on 0. open 0..1: the cut runs
// down from the ground line (a mask); glow 0..1: the land value lights in the earth (warm, from the top down); a: alpha
export function earthSection(ctx, t, w, d, o = {}) {
  const op = clamp(o.open ?? 1); if (op <= 0) return;
  const g = clamp(o.glow ?? 0);
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2 - 40, -4, w + 80, d * expoOut(op) + 4); ctx.clip();
  // earth: dark warm brown-indigo layers
  const body = new Path2D(); body.rect(-w / 2, 0, w, d);
  ctx.fillStyle = lin(ctx, 0, 0, 0, d, [[0, mixHex(P.shade0, P.night1, .62)], [.12, mixHex(P.shade0, P.night1, .72)], [.5, mixHex(P.shade0, P.night0, .82)], [1, P.night0]]); ctx.fill(body);
  // strata lines
  ctx.strokeStyle = rgba(P.shade0, .22); ctx.lineWidth = 3;
  for (let k = 1; k < 6; k++) { const y = d * k / 6; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = -w / 2 + w * i / 40, yy = y + Math.sin(i * .9 + k * 2.1) * 10; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
  // stones (seeded)
  const r = prng(606);
  ctx.fillStyle = rgba(P.shade1, .18);
  for (let i = 0; i < 40; i++) { const x = (r() - .5) * w * .96, y = d * (.08 + r() * .88), s = 8 + r() * 26; ctx.beginPath(); ctx.ellipse(x, y, s, s * .6, r() * 3, 0, 6.29); ctx.fill(); }
  // the glow: the land value lights in the dirt (warm light rising from the cut, strongest under the house)
  if (g > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, 0, 0, d, [[0, rgba(P.halo1, .4 * g)], [.45, rgba(P.shade0, .32 * g)], [1, rgba(P.shade0, .08 * g)]]); ctx.fill(body);
    const gn = o.gain ?? 1, gr = w * .4 * (1 + .25 * (gn - 1)), br = 1 + .06 * Math.sin(t * 1.3);   // gain > 1: a hot core under the thing that stands on it
    ctx.fillStyle = rad(ctx, o.cx ?? 0, 0, gr * br, [[0, rgba(P.core0, clamp(.35 * g * gn))], [.35, rgba(P.core1, clamp(.18 * g * gn))], [.7, rgba(P.halo0, .08 * g)], [1, rgba(P.halo0, 0)]]); ctx.fill(body);
    E.dust(ctx, 66, Math.round(260 * Math.min(gn, 2)), o.cx ?? 0, d * .4, w * .32, d * .28, t, Math.min(1, .8 * g * gn), P.core1);
    ctx.restore();
  }
  // the cut edge (a hot rim along the ground line and the sides)
  ctx.strokeStyle = rgba(P.halo1, .55 + .35 * g); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.stroke();
  ctx.strokeStyle = rgba(P.blue0, .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, d); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, d); ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the first picture (screen px)
// F.firstPicture with the coins' place, size and slice exposed (7.01–7.02: the picture is called back, then its coins sink into the
// loop). Defaults reproduce F.firstPicture exactly (same composition as 2.05). o: { x, y, uL, uR, hiL, hiR, txt (0..1 text kept),
// cL, cR (coin centres override), rs (radius scale), pie (slice scale) }
export function firstPictureB2(ctx, t, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 440, a = o.a ?? 1, r = 150, dx = 400, txt = o.txt ?? 1;
  const parts = [
    { u: o.uL ?? 1, hi: o.hiL ?? 0, c: o.cL ?? [x - dx, y], share: F.FIRST.profit, num: '17.0 %', l1: 'PROFIT KEPT PER SALES DOLLAR', l2: 'HIGHEST SINCE 2009', src: 'S&P 500 · FACTSET' },
    { u: o.uR ?? 1, hi: o.hiR ?? 0, c: o.cR ?? [x + dx, y], share: F.FIRST.work, num: '52.8 %', l1: 'WORKERS’ SHARE OF OUTPUT', l2: 'LOWEST SINCE 1947', src: 'U.S. BUSINESS SECTOR · BLS' },
  ];
  ctx.save(); ctx.globalAlpha *= a;
  for (const p of parts) {
    if (p.u <= 0) continue;
    const g = expoOut(clamp(p.u * 1.2)), cx = p.c[0], cy = p.c[1];
    F.coin(ctx, t, cx, cy, r * (.4 + .6 * g) * (o.rs ?? 1), { pie: p.share * smooth(span(p.u, .25, 1)) * (o.pie ?? 1), hi: p.hi });
    const tu = F.rise(span(p.u, .35, 1)) * txt;
    if (tu > 0) {
      const tx = x + (p === parts[0] ? -dx : dx);
      F.maskLine(ctx, [[p.num, p.hi]], tx, y - r - 46, 96, tu, { align: 'center' });
      F.maskLine(ctx, [[p.l1, 0]], tx, y + r + 64, 28, tu, { serif: false, align: 'center', glow: false });
      F.maskLine(ctx, [[p.l2, 0]], tx, y + r + 104, 28, tu, { serif: false, align: 'center', col: P.halo0, glow: false });
      F.maskLine(ctx, [[p.src, 0]], tx, y + r + 140, 21, tu, { serif: false, align: 'center', col: P.halo2, glow: false });
    }
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the moon (screen px)
// a thin moon: phase 0..1 (0 = thin crescent, grows), drawn as a lit disc minus a shifted dark disc
export function moon(ctx, t, x, y, r, phase, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, r * 4, .25, P.halo1, P.core1);
  const lit = new Path2D(); lit.arc(x, y, r, 0, 6.29);
  const off = new Path2D(); off.arc(x - r * lerp(.42, 1.25, clamp(phase)), y - r * .1, r * 1.02, 0, 6.29);
  const m = lit.op(off, PathOp.Difference);
  ctx.fillStyle = rad(ctx, x + r * .3, y, r, [[0, P.core0], [1, P.halo0]]); ctx.fill(m);
  ctx.restore();
}
