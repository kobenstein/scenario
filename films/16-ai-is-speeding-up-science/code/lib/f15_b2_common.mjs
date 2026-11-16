// Film 15 · group B2 (c07–c11, 198.46–380.30) · shared helpers (builder B2; lead: do not import from other groups).
// Anchors (words only), the light body with an explicit gradient (so a shape can split into two without a jump in its shading),
// a plain silhouette for "other people" (indigo, no yellow) that can turn into warm light, chalk strokes, paper sheets, sticky note.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, expoOut, glowFill, halo, dust, lin, rad } = E;

// ------------------------------------------------------------------------------------------------ anchors (words only)
export function anchors(T) {
  const S = (sec, w, n) => T.S(sec, w, n);
  const last = (sec, ph, n) => { const { s } = { s: T.S(sec, ph, n) }; const ws = T.W(sec, ph, ph); return ws.length ? ws[ws.length - 1].s : s; };
  return { S, last, E: (sec, w, n) => T.E(sec, w, n), seg: (id) => T.seg(id) };
}

// ------------------------------------------------------------------------------------------------ light body
// Like E.lightShape, but the gradient centre/radius and the glow sizes are given explicitly (g: {x, y, R}), so two halves of one
// shape can be drawn separately with exactly the gradient of the whole and then drift towards their own. lit 1 warm, 0 cool.
export function lightBody(ctx, path, t, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 1); if (a <= 0) return;
  const g = o.g, R = g.R, gl = o.glow ?? 1;
  if (gl > 0) {
    glowFill(ctx, path, (o.blurR ?? R) * .6 * gl, .8 * a * gl, P.blue0);
    glowFill(ctx, path, (o.blurR ?? R) * .093 * gl + 2, (.25 + .4 * lit) * a * Math.min(1, gl), lit > .5 ? P.halo0 : P.blue2);
  }
  ctx.save(); ctx.globalAlpha = a;
  const warm = [[0, P.core0], [.18, P.core1], [.45, P.halo0], [.85, P.halo1], [1, mixHex(P.halo1, P.shade0, .45)]];
  const cool = [[0, P.cream], [.3, F.COOL], [1, mixHex(P.blue2, P.blue0, .4)]];
  ctx.fillStyle = rad(ctx, g.x, g.y, R, lit > .5 ? warm : cool); ctx.fill(path);
  if (lit > .02 && lit < .98) { ctx.globalAlpha = a * (lit > .5 ? 1 - lit : lit); ctx.fillStyle = rad(ctx, g.x, g.y, R, lit > .5 ? cool : warm); ctx.fill(path); }
  if (o.edge !== false) {
    ctx.globalAlpha = a; ctx.clip(path); ctx.filter = `blur(${(o.blurR ?? R) * .053 + 1}px)`; ctx.strokeStyle = rgba(lit > .5 ? P.shade0 : P.ind0, .45); ctx.lineWidth = (o.blurR ?? R) * .08 + 2; ctx.stroke(path);
  }
  ctx.restore();
}

// a polygon path from points
export function poly(pts, close = true) { const p = new Path2D(); pts.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1]))); if (close) p.closePath(); return p; }

// ------------------------------------------------------------------------------------------------ Cassini cell outline
// The same outline as F.cell (split 0..1), as points (local, before rotation), so it can be cut into two lobes.
export function cassini(r, split, br = 1, N = 96) {
  const e = smooth(clamp(split)) * .985, b = r * br / Math.sqrt(1 + .35 * e * e), c = b * e, b4 = b ** 4, c4 = c ** 4, out = [];
  for (let k = 0; k <= N; k++) {
    const ph = k / N * Math.PI * 2, s2 = Math.sin(2 * ph), rr = Math.sqrt(Math.max(0, c * c * Math.cos(2 * ph) + Math.sqrt(Math.max(0, b4 - c4 * s2 * s2))));
    out.push([rr * Math.cos(ph), rr * Math.sin(ph) * .97]);
  }
  return { pts: out, b, c, e };
}

// ------------------------------------------------------------------------------------------------ people (everyone but you)
// A plain standing silhouette, local units: feet at (0,0), height 1, up = -y. Built once (union of simple shapes).
let PERSON = null;
export function personPath() {
  if (PERSON) return PERSON;
  let p = new Path2D(); p.ellipse(0, -.89, .07, .082, 0, 0, Math.PI * 2);           // head
  const body = new Path2D();                                                       // shoulders, coat to the knees
  body.moveTo(-.05, -.79); body.bezierCurveTo(-.12, -.785, -.15, -.76, -.152, -.7); body.bezierCurveTo(-.158, -.58, -.17, -.42, -.175, -.3);
  body.lineTo(.175, -.3); body.bezierCurveTo(.17, -.42, .158, -.58, .152, -.7); body.bezierCurveTo(.15, -.76, .12, -.785, .05, -.79); body.closePath();
  p = p.op(body, PathOp.Union);
  for (const s of [-1, 1]) { const leg = new Path2D(); leg.roundRect(s * .075 - .045, -.33, .09, .33, .03); p = p.op(leg, PathOp.Union); }
  const neck = new Path2D(); neck.rect(-.03, -.82, .06, .05); p = p.op(neck, PathOp.Union);
  PERSON = p; return p;
}
// draw a person at feet (x, y), height h. warm 0..1: 0 = indigo silhouette with a blue rim, 1 = warm cream light (treated / reached)
export function person(ctx, x, y, h, t, o = {}) {
  const warm = clamp(o.warm ?? 0), path = new Path2D(); path.addPath(personPath(), { a: h * (o.dir ?? 1), b: 0, c: 0, d: h, e: x, f: y });
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.ellipse(x, y, h * .2, h * .02, 0, 0, 6.29); ctx.fill();
  if (warm < 1) {
    ctx.fillStyle = lin(ctx, x - h * .18, 0, x + h * .18, 0, [[0, P.night1], [.55, P.ind2], [1, mixHex(P.ind2, P.blue1, .6)]]); ctx.fill(path);
    const sh = new Path2D(); sh.addPath(path, { a: 1, b: 0, c: 0, d: 1, e: -h * .014, f: h * .006 });
    ctx.fillStyle = rgba(o.rim ?? P.blue0, .95); ctx.fill(new Path2D(path).op(sh, PathOp.Difference));
  }
  if (warm > 0) {
    // the warm light rises inside the figure from the feet (it is reached), then the figure glows softly
    ctx.save(); ctx.beginPath(); ctx.rect(x - h, y - h * 1.05 * expoOut(warm), 2 * h, h * 1.1); ctx.clip();
    lightBody(ctx, path, t, { g: { x, y: y - h * .62, R: h * .75 }, lit: 1, glow: .55, blurR: h * .5 });
    ctx.restore();
  }
  ctx.restore();
  return { head: [x, y - h * .89], hand: [x + h * .16 * (o.dir ?? 1), y - h * .45] };
}

// ------------------------------------------------------------------------------------------------ paper
export const PAPER = { hi: P.core1, lo: mixHex(P.halo2, P.halo1, .5), cool: mixHex(P.cream, F.COOL, .55), coolLo: mixHex(F.COOL, P.blue2, .35) };
// a sheet of paper of light (rect x, y, w, h, rotation about its bottom centre). cool 0..1 tints it towards the cool "not yet" light.
export function sheet(ctx, x, y, w, h, o = {}) {
  const cool = clamp(o.cool ?? 0), rot = o.rot ?? 0, glow = o.glow ?? 1;
  ctx.save(); ctx.translate(x + w / 2, y + h); ctx.rotate(rot); ctx.translate(-w / 2, -h);
  const p = new Path2D(); p.roundRect(0, 0, w, h, Math.min(w, h) * .04);
  if (glow > 0) { glowFill(ctx, p, Math.max(w, h) * .35, .45 * glow, P.blue0); glowFill(ctx, p, Math.max(w, h) * .06 + 2, .4 * glow, cool > .5 ? P.blue2 : P.halo1); }
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(PAPER.hi, PAPER.cool, cool)], [1, mixHex(PAPER.lo, PAPER.coolLo, cool)]]); ctx.fill(p);
  ctx.fillStyle = rgba(P.shade0, .45); ctx.fillRect(0, h - Math.max(1.5, h * .012), w, Math.max(1.5, h * .012));
  if (o.ink) o.ink(w, h);
  ctx.restore();
  return p;
}

// ------------------------------------------------------------------------------------------------ chalk
// a chalk stroke from a to b (u = drawn share), slightly uneven, cool cream (warm 0..1 tints it gold), with a faint glow
export function chalk(ctx, a, b, w, u = 1, o = {}) {
  if (u <= 0) return;
  const x1 = lerp(a[0], b[0], clamp(u)), y1 = lerp(a[1], b[1], clamp(u)), warm = clamp(o.warm ?? 0), al = o.a ?? 1;
  const col = mixHex(mixHex(P.cream, F.COOL, .25), P.halo0, warm);
  ctx.save(); ctx.lineCap = 'round'; ctx.globalAlpha = al;
  if ((o.glow ?? 1) > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${w * 1.6}px)`; ctx.strokeStyle = rgba(warm > .5 ? P.halo1 : P.blue0, .5 * (o.glow ?? 1)); ctx.lineWidth = w * 3; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore(); }
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(x1, y1); ctx.stroke();
  // chalk grain: a few darker gaps along the stroke (seeded by the start point, never flicker)
  if (o.grain === false) { ctx.restore(); return; }
  const r = E.prng(Math.floor(Math.abs(a[0] * 7 + a[1] * 13)) + 3), n = Math.floor(Math.hypot(x1 - a[0], y1 - a[1]) / (w * 1.4));
  ctx.fillStyle = rgba(P.night1, .35);
  for (let i = 0; i < n; i++) { const k = r(), s = w * (.25 + .3 * r()); ctx.fillRect(lerp(a[0], x1, k) - s / 2 + (r() - .5) * w * .5, lerp(a[1], y1, k) - s / 2 + (r() - .5) * w * .5, s, s); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ screen-space night (the plate's ground)
export function nightBg(ctx, cx = 960, cy = 540, r = 1250) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, E.W, E.H);
  ctx.fillStyle = rad(ctx, cx, cy, r, [[0, P.ind1], [.5, P.ind0], [1, P.night0]]); ctx.fillRect(0, 0, E.W, E.H);
  ctx.restore();
}
// the glyph of a quotation mark drop, built from a ball (cx, cy, r) and a tail: dir 1 = opening (“: tail up from the ball's left,
// curling right), -1 = closing (”: tail down from the right, curling left). grow 0..1 = how far the tail has sprouted.
export function dropPath(cx, cy, r, grow, dir = 1, pts = null) {
  const p = new Path2D();
  if (pts) pts.forEach((q, i) => (i ? p.lineTo(cx + q[0], cy + q[1]) : p.moveTo(cx + q[0], cy + q[1])));
  else p.ellipse(cx, cy, r, r, 0, 0, Math.PI * 2);
  p.closePath();
  const g = clamp(grow); if (g <= .01) return p;
  // tail: a tapering curve leaving the ball (opening: from the upper left, rising and bending right)
  const n = 18, L = r * 2.05 * g, side = [], other = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n, ang = lerp(-2.2, -.55, s * s) , rr = r * .82 + L * s;    // spiral outward from the ball
    const x = Math.cos(ang) * rr * .62, y = Math.sin(ang) * rr - s * L * .25, w = r * .62 * (1 - s) ** .9 * (1 - .5 * s) + .6;
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    side.push([x + nx * w, y + ny * w]); other.push([x - nx * w, y - ny * w]);
  }
  const q = new Path2D(); const all = side.concat(other.reverse());
  all.forEach(([x, y], i) => { const X = cx + x * dir, Y = cy + y * dir; i ? q.lineTo(X, Y) : q.moveTo(X, Y); }); q.closePath();
  return p.op(q, PathOp.Union);
}
export { E, F };
