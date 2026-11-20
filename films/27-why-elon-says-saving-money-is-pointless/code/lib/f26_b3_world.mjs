// Film 26 · B3 (c08–c11) · the pieces and places only B3 needs. Owned by B3; uses lib/f26_kit.mjs + lib/f26_seams.mjs read-only.
//   oldWorld   the old street (1889 → 1935 → Vermont 1940): the SAME sky + far city as the hill and your street (sky door safe), on F0:
//              old gabled houses, the factory with its gate and steam, the cinema (newsreel screen = the C5 plate's source), the snowy
//              Vermont lane with the wooden mailbox; gas lamps on the Z_LAMP card. Sepia-warm inside the night palette.
//   hillEnd    the hill for the ending (c11): the same hill + piggy + you, but the hill ends at a bluff (XE) over the near river; the
//              gold dust builds your plank bridge over it (deck), beside it the broad bridge with railings and people walking across.
//   archive    the archive window on the far shore (Z_SHORE) with the glowing box (8.16 → the light door into 1889)
//   sky-field pieces: ribbon, lawPage, chest, pen, hand, chips, savingsBook, riskWeight, wrench, dome, tree, snow, gasLamp
// Rules as everywhere: deterministic in t, seeded randomness only, no canvas/pattern/gradient cache per frame.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
import * as S from './f26_seams.mjs';
const { P, W, H, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const F0 = E.F0, TAU = Math.PI * 2;
const NIGHT = F.NIGHT;

// ===================================================================================================== colours of the old world
export const SEPIA = {
  wall: mixHex(NIGHT.wall, P.shade0, .2), wallLit: mixHex(NIGHT.wallLit, P.shade0, .3), roof: mixHex(P.night1, P.shade0, .12),
  wood: mixHex(P.shade0, P.night1, .55), woodLit: mixHex(P.shade0, P.halo1, .2), iron: mixHex(P.night0, P.night1, .6),
  snow: mixHex(P.cream, P.blue1, .28), snowDeep: mixHex(P.blue1, P.ind1, .35), win: mixHex(P.halo1, P.shade0, .25),
};
export const PERSON_GOLD = mixHex(P.halo0, P.coat, .15);

// ===================================================================================================== small pieces
// a gas lamp: post foot (x, y), height h; returns the flame centre. a = flame 0..1
export function gasLamp(ctx, t, x, y, h, a = 1) {
  const fx = x, fy = y - h * .93, col = SEPIA.iron;
  ctx.fillStyle = col; ctx.fillRect(x - h * .014, y - h * .86, h * .028, h * .86);
  ctx.fillRect(x - h * .045, y - h * .05, h * .09, h * .05); ctx.fillRect(x - h * .06, y - h * .87, h * .12, h * .018);   // foot + crossbar
  // the lantern: a glass trapezoid with a cap
  const lw = h * .055, lh = h * .085;
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(fx - lw * 1.15, fy - lh * .62); ctx.lineTo(fx + lw * 1.15, fy - lh * .62); ctx.lineTo(fx, fy - lh * 1.05); ctx.closePath(); ctx.fill();
  const flick = 1 + .05 * Math.sin(t * 7.3 + x) + .03 * Math.sin(t * 13.1 + x * .3);
  ctx.fillStyle = lin(ctx, 0, fy - lh * .6, 0, fy + lh * .5, [[0, rgba(mixHex(P.core1, P.halo0, .3), a)], [1, rgba(P.halo1, a * .9)]]);
  ctx.beginPath(); ctx.moveTo(fx - lw, fy - lh * .6); ctx.lineTo(fx + lw, fy - lh * .6); ctx.lineTo(fx + lw * .7, fy + lh * .5); ctx.lineTo(fx - lw * .7, fy + lh * .5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = h * .006; ctx.stroke();
  ctx.fillStyle = col; ctx.fillRect(fx - lw * .8, fy + lh * .5, lw * 1.6, lh * .12);
  if (a > 0) { ctx.fillStyle = rgba(P.core0, a); ctx.beginPath(); ctx.ellipse(fx, fy, lw * .28 * flick, lh * .26 * flick, 0, 0, TAU); ctx.fill();
    halo(ctx, fx, fy, h * .55, .5 * a * flick, P.halo0, P.core0); }
  return [fx, fy];
}
// an old gabled house on F0: o { x0, x1, eave, ground, gable (roof height), rows [[y, h]], cols, lit, seed, door }
export function oldHouse(ctx, t, o) {
  const { x0, x1, eave, ground } = o, gab = o.gable ?? 120, r = prng(o.seed ?? 7), col = o.col ?? SEPIA.wall;
  ctx.fillStyle = lin(ctx, x0, eave, x1, ground, [[0, mixHex(col, P.blue1, .2)], [.55, col], [1, mixHex(col, P.night0, .4)]]); ctx.fillRect(x0, eave, x1 - x0, ground - eave);
  const p = new Path2D(); p.moveTo(x0 - 18, eave); p.lineTo((x0 + x1) / 2, eave - gab); p.lineTo(x1 + 18, eave); p.closePath();
  ctx.fillStyle = lin(ctx, 0, eave - gab, 0, eave, [[0, mixHex(SEPIA.roof, P.blue1, .25)], [1, SEPIA.roof]]); ctx.fill(p);
  ctx.fillStyle = rgba(P.blue0, .45); ctx.beginPath(); ctx.moveTo(x0 - 18, eave); ctx.lineTo((x0 + x1) / 2, eave - gab); ctx.lineTo((x0 + x1) / 2, eave - gab + 3); ctx.lineTo(x0 - 14, eave + 1); ctx.closePath(); ctx.fill();
  if (o.chimney) { ctx.fillStyle = SEPIA.roof; ctx.fillRect(x1 - (x1 - x0) * .28, eave - gab * .75, 26, gab * .5); }
  const cols = o.cols ?? 3, ww = o.ww ?? 70;
  for (const [y, h] of o.rows || []) for (let i = 0; i < cols; i++) {
    const x = x0 + (x1 - x0) * (i + .5) / cols - ww / 2, lit = r() < (o.lit ?? .4) ? .35 + r() * .3 : 0;
    ctx.fillStyle = mixHex(NIGHT.glass, P.night0, .2); ctx.fillRect(x, y, ww, h);
    if (lit > 0) { ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, rgba(mixHex(P.core1, P.halo0, .5), lit)], [1, rgba(P.shade0, lit)]]); ctx.fillRect(x, y, ww, h); }
    ctx.fillStyle = mixHex(col, P.night0, .45); ctx.fillRect(x + ww / 2 - 2, y, 4, h); ctx.fillRect(x, y + h * .5 - 2, ww, 4);
    ctx.strokeStyle = mixHex(col, P.night0, .5); ctx.lineWidth = 6; ctx.strokeRect(x, y, ww, h);
    ctx.fillStyle = mixHex(col, P.blue0, .25); ctx.fillRect(x - 8, y + h + 2, ww + 16, 7);
  }
  if (o.door != null) { ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.beginPath(); ctx.roundRect(o.door, ground - 190, 92, 190, [46, 46, 0, 0]); ctx.fill(); ctx.fillStyle = rgba(P.halo1, .3); ctx.fillRect(o.door + 16, ground - 160, 60, 30); }
}
// steam puffs rising from (x, y): soft round puffs that grow and thin out (deterministic)
export function steam(ctx, t, x, y, s = 1, o = {}) {
  const n = o.n ?? 7, life = o.life ?? 5, a = o.a ?? 1; if (a <= 0) return;
  for (let i = 0; i < n; i++) {
    const ph = ((t / life + i / n) % 1 + 1) % 1, r = prng(1000 + i * 7 + (o.seed ?? 0))();
    const px = x + s * (ph * 120 * (o.dir ?? 1) + Math.sin(t * .6 + i) * 10), py = y - s * ph * 260, rr = s * (18 + ph * 70) * (.8 + .4 * r);
    ctx.fillStyle = rgba(mixHex(P.blue1, P.cream, .25), a * .32 * Math.sin(Math.PI * Math.min(1, ph * 1.4)) * (1 - ph * .6));
    ctx.beginPath(); ctx.arc(px, py, rr, 0, TAU); ctx.fill();
  }
}
// falling snow over a design box [x0, y0, w, h] (deterministic, drifting)
export function snow(ctx, t, box, a = 1, n = 160, seed = 3) {
  if (a <= 0) return;
  const [x0, y0, w, h] = box, r = prng(seed);
  ctx.save(); ctx.fillStyle = P.cream;
  for (let i = 0; i < n; i++) {
    const u = r(), v = r(), sp = 30 + r() * 40, sz = 1.5 + r() * 2.6, ph = r() * TAU;
    const yy = y0 + (((v * h + t * sp) % h) + h) % h, xx = x0 + u * w + Math.sin(t * .7 + ph) * 18;
    ctx.globalAlpha = a * (.45 + .4 * r()); ctx.beginPath(); ctx.arc(xx, yy, sz, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// a tree: trunk foot (x, y), height h; season float: 0 winter (bare + snow) · 1 spring · 2 summer · 3 autumn (gold) · 4 = winter again
export function tree(ctx, t, x, y, h, season = 0) {
  const s = ((season % 4) + 4) % 4, trunk = mixHex(SEPIA.wood, P.night0, .4);
  ctx.fillStyle = trunk; ctx.beginPath(); ctx.moveTo(x - h * .04, y); ctx.lineTo(x - h * .02, y - h * .55); ctx.lineTo(x + h * .02, y - h * .55); ctx.lineTo(x + h * .045, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = trunk; ctx.lineCap = 'round';
  const br = [[-.32, .72, .5], [.3, .78, .55], [-.18, .92, .7], [.15, .95, .8], [0, 1, .58]];
  for (const [dx, hy, sy] of br) { ctx.lineWidth = h * .018; ctx.beginPath(); ctx.moveTo(x, y - h * sy); ctx.quadraticCurveTo(x + dx * h * .3, y - h * (sy + hy) / 2, x + dx * h, y - h * hy); ctx.stroke(); }
  // the crown: leaves (spring/summer indigo-teal, autumn gold), snow on the branches in winter
  const leaf = (k) => { const w1 = clamp(1 - Math.abs(s - k)) ; return w1; };
  const green = mixHex(P.ind1, '#2c5a62', .55), gold = mixHex(P.halo0, P.shade0, .35);
  const amt = Math.max(leaf(1) * .7, leaf(2), leaf(3) * .9), col = s < 2 ? green : s < 3 ? mixHex(green, gold, s - 2) : gold;
  if (amt > 0) { const r = prng(77); ctx.fillStyle = rgba(col, .95);
    for (let i = 0; i < 160; i++) { const a = r() * TAU, d = Math.sqrt(r()), cx = x + Math.cos(a) * d * h * .4, cy = y - h * .8 + Math.sin(a) * d * h * .24, rr = h * (.016 + .014 * r()); if (r() > amt) continue;
      ctx.beginPath(); ctx.ellipse(cx + Math.sin(t * .8 + i) * 2, cy, rr, rr * .7, a, 0, TAU); ctx.fill(); } }
  const sn = Math.max(leaf(0), leaf(4)); if (sn > 0) { ctx.strokeStyle = rgba(SEPIA.snow, .9 * sn); ctx.lineWidth = h * .012;
    for (const [dx, hy] of br) { ctx.beginPath(); ctx.moveTo(x + dx * h * .45, y - h * (hy - .02)); ctx.lineTo(x + dx * h * .95, y - h * hy - 2); ctx.stroke(); } }
}
// a fountain pen (nib at x, y), angle ang (0 = nib pointing down-left), length s
export function pen(ctx, x, y, ang, s, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = mixHex(P.halo0, P.shade0, .2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(.05, -.16); ctx.lineTo(-.05, -.16); ctx.closePath(); ctx.fill();   // nib
  ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.beginPath(); ctx.roundRect(-.055, -.98, .11, .82, .05); ctx.fill();
  ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(-.03, -.94, .022, .7);
  ctx.fillStyle = mixHex(P.halo0, P.shade0, .3); ctx.fillRect(-.06, -.5, .12, .035);
  ctx.restore();
}
// a hand (indigo silhouette, no light): wrist (x, y), angle, palm length L, o { pose, curl, flip, rim (rim light col), a }
export function hand(ctx, x, y, ang, L, o = {}) {
  const m = E.handMatrix(x, y, ang, L, o.flip ?? 1), p = new Path2D(); p.addPath(E.handPath({ pose: o.pose ?? 'hold', curl: o.curl ?? 0 }), m);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const [cx, cy] = E.applyM(m, .5, 0), [ax, ay] = E.applyM(m, -3, 0);
  ctx.fillStyle = lin(ctx, ax, ay, cx, cy, [[0, rgba(P.ind2, 0)], [.35, P.ind2], [1, mixHex(P.ind2, P.blue1, .45)]]); ctx.fill(p);
  if (o.rim) { const sh = new Path2D(); sh.addPath(p, { a: 1, b: 0, c: 0, d: 1, e: -L * .06, f: -L * .05 }); ctx.fillStyle = o.rim; ctx.fill(new Path2D(p).op(sh, PathOp.Difference)); }
  ctx.restore();
  return E.applyM(m, 1.1, .05);
}
// a wrench (centre x, y), angle, length s
export function wrench(ctx, x, y, ang, s, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const col = mixHex(P.blue1, P.cream, .35);
  ctx.fillStyle = lin(ctx, 0, -.1, 0, .1, [[0, mixHex(col, P.cream, .3)], [1, mixHex(col, P.night1, .3)]]);
  ctx.beginPath(); ctx.roundRect(-.38, -.045, .72, .09, .04); ctx.fill();
  const head = (x0, d) => { const p = new Path2D(); p.arc(x0, 0, .13, 0, TAU); const jaw = new Path2D(); jaw.rect(x0 + d * .02, -.055, d * .2, .11); ctx.fill(new Path2D(p).op(jaw, PathOp.Difference)); };
  head(-.42, -1); head(.4, 1);
  ctx.restore();
}
// a stack of chips made of machines (the owner's stake): bottom centre (x, y), n chips, radius r; o.fall 0..1 (the top chip slides off)
export function chips(ctx, t, x, y, n, r, o = {}) {
  const th = r * .3, u = clamp(o.u ?? 1), m = n * u, body = mixHex(F.COOL.deep, P.ind1, .3), face = mixHex(F.COOL.body, P.ind1, .45);
  const fall = clamp(o.fall ?? 0);
  for (let i = 0; i < Math.ceil(m); i++) {
    const f = clamp(m - i), top = i === n - 1;
    let yy = y - i * th - (1 - expoOut(f)) * r * 1.5, xx = x, rot = 0, al = clamp(f * 3);
    if (top && fall > 0) { xx = x + fall * r * 2.6; yy += fall * fall * (i * th + r * 1.2); rot = fall * 1.4; al *= 1 - smooth(span(fall, .7, 1)); }
    ctx.save(); ctx.globalAlpha *= al; ctx.translate(xx, yy); ctx.rotate(rot);
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(0, 0, r, r * .3, 0, 0, Math.PI); ctx.lineTo(-r, -th); ctx.ellipse(0, -th, r, r * .3, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(F.COOL.line, .6); for (let k = -2; k <= 2; k++) ctx.fillRect(k * r * .38 - r * .05, -th * .85, r * .1, th * .6);   // edge marks
    ctx.fillStyle = lin(ctx, -r, 0, r, 0, [[0, mixHex(face, P.cream, .15)], [1, face]]); ctx.beginPath(); ctx.ellipse(0, -th, r, r * .3, 0, 0, TAU); ctx.fill();
    // a tiny factory on the face (saw-tooth roof + a chimney)
    ctx.fillStyle = rgba(P.night1, .75); ctx.beginPath(); const fy = -th + r * .1, fw = r * .9;
    ctx.moveTo(-fw / 2, fy); for (let k = 0; k < 3; k++) { ctx.lineTo(-fw / 2 + k * fw / 3, fy - r * .14); ctx.lineTo(-fw / 2 + (k + 1) * fw / 3, fy - r * .06); }
    ctx.lineTo(fw / 2, fy - r * .06); ctx.lineTo(fw / 2, fy - r * .26); ctx.lineTo(fw / 2 - r * .1, fy - r * .26); ctx.lineTo(fw / 2 - r * .1, fy); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  return y - m * th;
}
// a savings book (bottom centre x, y, width s): a small booklet with a gold coin on the cover
export function savingsBook(ctx, t, x, y, s, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.rot ?? -.06);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-s / 2 + 4, -s * .72 + 5, s, s * .72);
  ctx.fillStyle = lin(ctx, -s / 2, -s * .72, s / 2, 0, [[0, mixHex(P.shade0, P.halo1, .35)], [1, mixHex(P.shade0, P.night1, .3)]]); ctx.fillRect(-s / 2, -s * .72, s, s * .72);
  ctx.fillStyle = mixHex(P.cream, P.halo1, .4); ctx.fillRect(-s / 2 + s * .04, -s * .05, s * .92, s * .04);   // the pages' edge
  ctx.fillStyle = rgba(P.night1, .35); ctx.fillRect(-s * .1, -s * .72, s * .03, s * .72);
  ctx.restore();
  F.coin(ctx, x + s * .12, y - s * .4, s * .14, { flip: .3 + .1 * Math.sin(t), glint: o.glint ?? .4 });
}
// the RISK weight (an iron weight with a ring), bottom centre (x, y), width s
export function riskWeight(ctx, t, x, y, s, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.strokeStyle = SEPIA.iron; ctx.lineWidth = s * .07; ctx.beginPath(); ctx.arc(x, y - s * .78, s * .13, 0, TAU); ctx.stroke();
  ctx.fillStyle = lin(ctx, x - s / 2, 0, x + s / 2, 0, [[0, mixHex(P.blue1, P.night1, .2)], [.5, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]);
  ctx.beginPath(); ctx.moveTo(x - s * .28, y - s * .66); ctx.lineTo(x + s * .28, y - s * .66); ctx.lineTo(x + s * .5, y); ctx.lineTo(x - s * .5, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(F.ROSE.mark, .7); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  F.maskLine(ctx, [['RISK', 0]], x, y - s * .2, s * .24, o.text ?? 1, { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
}
// the Capitol dome far away (silhouette), base centre (x, y), width s; o.a, o.glow
export function dome(ctx, t, x, y, s, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.col ?? mixHex(P.night1, P.ind1, .55);
  ctx.fillRect(x - s * .5, y - s * .16, s, s * .16);                       // the wings
  ctx.fillRect(x - s * .2, y - s * .26, s * .4, s * .12);                  // the drum base
  for (let i = 0; i < 9; i++) ctx.fillRect(x - s * .17 + i * s * .042, y - s * .36, s * .018, s * .11);   // columns
  ctx.fillRect(x - s * .19, y - s * .38, s * .38, s * .03);
  ctx.beginPath(); ctx.ellipse(x, y - s * .38, s * .16, s * .19, 0, Math.PI, TAU); ctx.fill();          // the dome
  ctx.fillRect(x - s * .025, y - s * .64, s * .05, s * .08); ctx.beginPath(); ctx.arc(x, y - s * .66, s * .02, 0, TAU); ctx.fill();
  ctx.restore();
  if (o.glow) halo(ctx, x, y - s * .4, s * .7, .25 * o.glow, P.halo1, P.halo0);
}

// ===================================================================================================== sky-field paper
// a quote ribbon: a long dark band unrolling from the left (x, y = left end of its centre line), width w, u 0..1; q = { lines, src }
export function ribbon(ctx, t, x, y, w, u, q, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), ww = w * k, h = o.h ?? 150, wave = (xx) => Math.sin(xx * .006 + t * .9) * 6 * k;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const band = new Path2D(); const N = 24;
  for (let i = 0; i <= N; i++) { const xx = x + ww * i / N; i ? band.lineTo(xx, y - h / 2 + wave(xx)) : band.moveTo(xx, y - h / 2 + wave(xx)); }
  for (let i = N; i >= 0; i--) { const xx = x + ww * i / N; band.lineTo(xx, y + h / 2 + wave(xx)); }
  band.closePath();
  ctx.fillStyle = rgba(P.night0, .45); ctx.save(); ctx.translate(10, 12); ctx.fill(band); ctx.restore();
  ctx.fillStyle = lin(ctx, 0, y - h / 2, 0, y + h / 2, [[0, mixHex(P.ind0, P.blue1, .28)], [1, mixHex(P.night1, P.ind0, .55)]]); ctx.fill(band);
  ctx.strokeStyle = P.halo0; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= N; i++) { const xx = x + ww * i / N; i ? ctx.lineTo(xx, y - h / 2 + wave(xx)) : ctx.moveTo(xx, y - h / 2 + wave(xx)); } ctx.stroke();
  if (u < 1) { ctx.fillStyle = mixHex(P.ind1, P.blue1, .5); ctx.beginPath(); ctx.ellipse(x + ww, y + wave(x + ww), 16, h / 2 + 4, 0, 0, TAU); ctx.fill(); }   // the roll
  ctx.save(); ctx.beginPath(); ctx.rect(x, y - h, ww, h * 2); ctx.clip();
  const size = o.size ?? 44, L = q.lines;
  L.forEach((l, i) => F.maskLine(ctx, [[(i === 0 ? '“' : '') + l + (i === L.length - 1 ? '”' : ''), 0]], x + w / 2, y - (L.length - 1) * size * .55 + i * size * 1.1 + size * .25 - 10, size, F.rise(span(u, .35 + i * .12, .9 + i * .12)), { align: 'center' }));
  if (q.src) F.maskLine(ctx, [[q.src, 0]], x + w / 2, y + h / 2 - 16, 17, F.rise(span(u, .6, 1)), { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false });
  ctx.restore(); ctx.restore();
}
// a law page (cream paper, typed lines). Top-left (x, y), width w (height 1.3 w). o { u (paper unfolds from the top), title [l1, l2],
//   type 0..1 (typed lines), sig 0..1 (a signature stroke), fields [[label, u]] (three boxes fill: RIGHT · WRITTEN DOWN · FUNDED),
//   dim, glow, a, empty (no typed lines) }
export function lawPage(ctx, t, x, y, w, o = {}) {
  const h = w * 1.3, u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return null;
  const hh = h * expoOut(u);
  ctx.save(); ctx.globalAlpha *= a;
  if (o.glow) halo(ctx, x + w / 2, y + h / 2, w * 1.3, .35 * o.glow);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(x + 10, y + 14, w, hh);
  ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, P.cream], [1, mixHex(P.cream, P.halo1, .4)]]); ctx.fillRect(x, y, w, hh);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, hh); ctx.clip();
  const ink = P.night1, m = w * .1;
  if (o.title) o.title.forEach((l, i) => { ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.font = i === 0 ? `600 ${w * .056}px Inter` : `${w * .07}px "Instrument Serif"`; ctx.fillText(l, x + w / 2, y + h * (.1 + i * .075)); });
  ctx.fillStyle = rgba(ink, .5); ctx.fillRect(x + m, y + h * .2, w - 2 * m, 1.5);
  if (!o.empty) { const ty = clamp(o.type ?? 1), r = prng(o.seed ?? 4), nl = 13;
    for (let i = 0; i < nl; i++) { const ll = (w - 2 * m) * (i % 5 === 4 ? .5 + r() * .2 : .82 + r() * .18), f = clamp(ty * nl - i); if (f <= 0) { r(); continue; }
      ctx.fillStyle = rgba(ink, .28); ctx.fillRect(x + m, y + h * (.25 + i * .045), ll * f, h * .012); } }
  if (o.fields) o.fields.forEach(([lab, fu], i) => {
    const fy = y + h * (.3 + i * .2), fx = x + m, fw = w - 2 * m, fh = h * .13;
    ctx.strokeStyle = rgba(ink, .45); ctx.lineWidth = 2; ctx.setLineDash([8, 6]); ctx.strokeRect(fx, fy, fw, fh); ctx.setLineDash([]);
    const k = expoOut(clamp(fu)); if (k > 0) { ctx.fillStyle = rgba(P.halo0, .55 * k); ctx.fillRect(fx, fy, fw * k, fh); ctx.strokeStyle = rgba(P.shade0, .9 * k); ctx.lineWidth = 2.5; ctx.strokeRect(fx, fy, fw, fh); }
    F.maskLine(ctx, [[lab, 0]], fx + fw / 2, fy + fh * .64, w * .075, F.rise(span(fu, .1, .9)), { serif: false, weight: 600, align: 'center', col: ink, glow: false });
  });
  if (o.sig > 0) {   // a signature: a pen stroke that writes itself
    const sx = x + w * .5, sy = y + h * .86, pts = [];
    for (let i = 0; i <= 40; i++) { const s = i / 40; pts.push([sx - w * .28 + s * w * .5, sy - Math.sin(s * 14) * w * .028 * (1 - s * .4) - s * w * .03]); }
    ctx.strokeStyle = mixHex(P.ind1, P.night1, .3); ctx.lineWidth = Math.max(2, w * .009); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); const n = Math.max(2, Math.round(pts.length * clamp(o.sig))); pts.slice(0, n).forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke();
    ctx.fillStyle = rgba(ink, .5); ctx.fillRect(x + w * .2, sy + w * .03, w * .6, 1.5);
    o.sigTip = pts[n - 1];
  }
  if (o.dim) { ctx.fillStyle = rgba(P.night1, .5 * o.dim); ctx.fillRect(x, y, w, h); }
  ctx.restore(); ctx.restore();
  return { x, y, w, h, sigTip: o.sigTip };
}
// a wooden chest (front view, lid hinged at the back), bottom centre (x, y), width w; o { open 0..1, fill 0..1 (gold inside), a, glow }
export function chest(ctx, t, x, y, w, o = {}) {
  const h = w * .5, open = clamp(o.open ?? 0), fill = clamp(o.fill ?? 0), x0 = x - w / 2, y0 = y - h;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (fill > 0 || o.glow) halo(ctx, x, y0, w * (.6 + .5 * fill), (.25 + .4 * fill) * (o.glow ?? 1), P.halo1, P.core0);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(x0 + 8, y0 + 10, w, h);
  // the inside (behind the front): dark, with the gold heap rising
  ctx.fillStyle = mixHex(P.night0, SEPIA.wood, .25); ctx.fillRect(x0 + w * .05, y0 - h * .12 * open, w * .9, h * .2);
  if (fill > 0) { const r = prng(11); for (let i = 0; i < 26; i++) { const cx = x0 + w * (.1 + .8 * r()), cy = y0 + h * .05 - fill * h * .22 * r(); if (r() > fill * 1.3) continue; F.coin(ctx, cx, cy, w * .045, { flip: 1.3 + r() * .2, tilt: (r() - .5) * .5 }); } }
  ctx.fillStyle = lin(ctx, 0, y0, 0, y, [[0, SEPIA.woodLit], [1, SEPIA.wood]]); ctx.fillRect(x0, y0, w, h);
  ctx.fillStyle = rgba(P.night0, .35); for (const v of [.33, .66]) ctx.fillRect(x0, y0 + h * v, w, 3);
  ctx.fillStyle = mixHex(P.halo0, P.shade0, .4); for (const u of [.06, .9]) ctx.fillRect(x0 + w * u, y0, w * .04, h);   // brass bands
  ctx.fillRect(x - w * .05, y0 + h * .12, w * .1, h * .16);
  // the lid: seen from the front it lifts (height shrinks, then flips back above)
  const lh = h * .38, ly = y0 - lh * Math.cos(open * Math.PI * .55) - h * .02;
  ctx.fillStyle = lin(ctx, 0, ly, 0, y0, [[0, mixHex(SEPIA.woodLit, P.halo1, .2)], [1, SEPIA.wood]]);
  ctx.beginPath(); ctx.roundRect(x0 - 4, Math.min(ly, y0 - 2), w + 8, Math.max(6, Math.abs(y0 - ly)), [w * .12, w * .12, 0, 0]); ctx.fill();
  ctx.restore();
  return { mouth: [x, y0 - 4] };
}
// the archive on the far shore (design px of the Z_SHORE card): a narrow old building with a tall arched window; inside, shelves and a
// box whose light rises (glow 0..1). ARCH.win = the window centre (the dive target).
export const ARCH = { Z: F.Z_SHORE, x: 330, y: 680, w: 30, h: 46 };   // the window sits high in a tower so the dive clears the hill
export function archive(ctx, t, glow = 0) {
  const A = ARCH, x = A.x, y = A.y;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .45); ctx.fillRect(x - 60, y - 84, 120, F.HOR + 30 - (y - 84)); ctx.fillRect(x - 70, y - 92, 140, 10);
  ctx.fillRect(x - 84, y + 90, 168, F.HOR + 30 - (y + 90)); ctx.fillRect(x - 92, y + 84, 184, 8);   // the wide archive hall the tower stands on
  ctx.beginPath(); ctx.moveTo(x - 66, y - 92); ctx.lineTo(x, y - 128); ctx.lineTo(x + 66, y - 92); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(NIGHT.glass, P.night0, .35);
  for (let i = 0; i < 4; i++) { ctx.fillRect(x - 64 + i * 38, y + 120, 14, 26); ctx.fillRect(x - 64 + i * 38, y + 170, 14, 26); }
  ctx.fillRect(x - 6, y + 48, 12, 22);
  // the arched window: dark glass → warm box light
  const p = new Path2D(); p.roundRect(x - A.w / 2, y - A.h / 2, A.w, A.h, [A.w / 2, A.w / 2, 0, 0]);
  ctx.fillStyle = mixHex(NIGHT.glass, P.night0, .2); ctx.fill(p);
  ctx.save(); ctx.clip(p);
  ctx.fillStyle = lin(ctx, 0, y - A.h / 2, 0, y + A.h / 2, [[0, rgba(P.shade0, .6 * glow)], [1, rgba(P.halo1, .9 * glow)]]); ctx.fillRect(x - A.w, y - A.h, A.w * 2, A.h * 2);
  ctx.fillStyle = rgba(P.night0, .55); for (const v of [-.18, .1]) ctx.fillRect(x - A.w / 2, y + A.h * v, A.w, 1.2);   // shelves
  // the box on the lowest shelf, lid ajar, light coming out of it
  const bx = x - 5, by = y + A.h * .36;
  ctx.fillStyle = mixHex(SEPIA.wood, P.night0, .2); ctx.fillRect(bx - 6, by - 6, 12, 6);
  ctx.fillStyle = rgba(P.core0, glow); ctx.fillRect(bx - 5, by - 7.6, 10, 1.6);
  ctx.save(); ctx.translate(bx - 6, by - 6); ctx.rotate(-.5 * glow); ctx.fillStyle = mixHex(SEPIA.woodLit, P.night0, .2); ctx.fillRect(0, -1.5, 12, 1.5); ctx.restore();
  ctx.restore();
  ctx.strokeStyle = mixHex(P.night0, P.night1, .3); ctx.lineWidth = 1.6; ctx.stroke(p);
  ctx.fillStyle = mixHex(P.night0, P.night1, .3); ctx.fillRect(x - .8, y - A.h / 2, 1.6, A.h);
  if (glow > 0) { halo(ctx, bx, by - 8, 26 * glow + 6, .9 * glow); halo(ctx, x, y, 170 * glow, .4 * glow, P.halo1, P.halo0); }
}

// ===================================================================================================== THE OLD STREET (1889 → 1940)
// F0 design: houses of 1889 (x −900 … 960), the factory (980 … 2080, gate at GATE), the cinema of 1935 (2200 … 2950, screen CINE),
// then the Vermont lane (3500 … 5000: snow, a wooden house, a tree, the wooden mailbox OLDBOX). Gas lamps on Z_LAMP.
export const OLD_GROUND = S.GROUND;
export const GATE = { x: 1380, w: 300, h: 330 };
export const CINE = { x: 2370, y: 520, w: 400, h: 230 };          // the newsreel screen (F0 design) inside the cinema window
export const OLDBOX = { x: 4290, y: OLD_GROUND + 22, h: 230 };      // Ida May Fuller's wooden mailbox
export const IDA = { x: 4160, y: OLD_GROUND + 26, h: 232 };
export const VT_HOUSE = { x0: 3700, x1: 4060 };
export const GASLAMPS = [-260, 720, 2090, 3020];                     // x on the Z_LAMP card
export const LAMP_H = 600;
const OLD_HOUSES = [
  { x0: -900, x1: -330, eave: 300, gable: 150, rows: [[380, 130], [600, 130]], cols: 3, seed: 41, lit: .45, chimney: true },
  { x0: -300, x1: 330, eave: 250, gable: 170, rows: [[330, 140], [560, 140]], cols: 3, seed: 42, lit: .5, door: 120 },
  { x0: 360, x1: 950, eave: 330, gable: 130, rows: [[410, 130], [630, 130]], cols: 3, seed: 43, lit: .35, chimney: true },
];
// st: { field(ctx, c), mid(ctx, c), front(ctx, c), workers (t → [{x, walk, dir, old}]), steamA, cineA (screen flicker 0..1), cineScreen 0..1,
//   snowA (falling snow 0..1), season (tree), ida: { …person options, x, h, a } | false, box: { open, check, flag }, vtLit, winterA (snow ground) }
export function oldWorld(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: S.SKY_GLOW });
  F.city(ctx, c, t, { deck: 0, winA: st.winA ?? .75 });
  if (st.field) st.field(ctx, c);
  E.card(ctx, c, F0, () => {
    for (const hz of OLD_HOUSES) oldHouse(ctx, t, { ...hz, ground: OLD_GROUND });
    factory(ctx, t, st);
    cinema(ctx, t, st);
    vermont(ctx, t, st);
    // the street: cobbles (old) → a snowy lane (Vermont)
    F.street(ctx, t, OLD_GROUND, { x1: 3300 });
    ctx.fillStyle = rgba(P.blue0, .22); const r = prng(5);
    for (let i = 0; i < 260; i++) { const x = -1200 + r() * 4500, y = OLD_GROUND + 52 + r() * 160; ctx.fillRect(x, y, 14 + r() * 10, 3); }
    snowGround(ctx, t, 3300, 5600, OLD_GROUND, st.winterA ?? 1);
    if (st.mid) st.mid(ctx, c);
    if (st.workers) for (const w of st.workers) {
      const o = { dir: w.dir ?? 1, walk: w.walk, view: w.walk != null ? 'side' : undefined, light: -1, back: .35, long: w.old, lean: w.old ? .14 : 0, look: w.look ?? (w.old ? -.15 : 0), ...(w.o || {}) };
      E.person(ctx, w.x, OLD_GROUND + 26, w.h ?? 200, o);
      if (w.old) { ctx.fillStyle = mixHex(P.cream, P.blue1, .4); ctx.beginPath(); ctx.ellipse(w.x + (w.dir ?? 1) * 4, OLD_GROUND + 26 - (w.h ?? 200) * .9, (w.h ?? 200) * .06, (w.h ?? 200) * .035, 0, Math.PI, TAU); ctx.fill(); }   // a flat cap
    }
    // Vermont: the wooden mailbox and Ida May Fuller
    const b = st.box || {};
    st.boxOut = F.mailbox(ctx, t, OLDBOX.x, OLDBOX.y, OLDBOX.h, { old: true, open: b.open ?? 0, check: b.check ?? 0, flag: b.flag ?? 0 });
    if (b.snow !== 0) { ctx.fillStyle = rgba(SEPIA.snow, .95 * (b.snow ?? 1)); ctx.beginPath(); ctx.ellipse(OLDBOX.x + OLDBOX.h * .05, st.boxOut.top + 3, OLDBOX.h * .27, OLDBOX.h * .028, 0, Math.PI, TAU); ctx.fill(); }
    if (st.ida) { const o = st.ida; st.idaHands = E.person(ctx, o.x ?? IDA.x, o.y ?? IDA.y, o.h ?? IDA.h, { dir: 1, long: true, light: 1, back: .5, ...o });
      // a winter hat (a small brim) + the hair turns white with the years (o.age 0..1)
      const hx = (o.x ?? IDA.x) + .0, hh = o.h ?? IDA.h, hy = (o.y ?? IDA.y) - hh * .895;
      ctx.fillStyle = mixHex(mixHex(P.night1, P.shade0, .25), P.cream, .5 * (o.age ?? 0)); ctx.beginPath(); ctx.ellipse(hx - hh * .01, hy - hh * .035, hh * .085, hh * .03, 0, 0, TAU); ctx.fill(); }
  });
  E.card(ctx, c, S.Z_LAMP, () => { for (const x of GASLAMPS) gasLamp(ctx, t, x, OLD_GROUND + 70, LAMP_H, 1); });
  if ((st.snowA ?? 0) > 0) E.card(ctx, c, F0 * .95, () => snow(ctx, t, [3200, -400, 2400, 1500], st.snowA, 340, 9));
  if (st.front) st.front(ctx, c);
  // the warm print of old photographs, inside the night palette
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = rgba(P.shade0, .32 * (st.sepia ?? 1)); ctx.fillRect(0, 0, W, H); ctx.restore();
}
function snowGround(ctx, t, x0, x1, y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, y - 10, 0, y + 260, [[0, SEPIA.snow], [.25, mixHex(SEPIA.snow, SEPIA.snowDeep, .5)], [1, P.night1]]);
  ctx.beginPath(); ctx.moveTo(x0, y + 60); ctx.bezierCurveTo(x0 + 200, y - 6, x0 + 400, y - 4, x0 + 700, y - 2); ctx.lineTo(x1, y - 2); ctx.lineTo(x1, y + 900); ctx.lineTo(x0, y + 900); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.blue0, .25); const r = prng(8); for (let i = 0; i < 40; i++) ctx.fillRect(x0 + 600 + r() * (x1 - x0 - 600), y + 30 + r() * 150, 30 + r() * 60, 3);
  ctx.restore();
}
function factory(ctx, t, st) {
  const x0 = 980, x1 = 2080, top = 420, g = OLD_GROUND, col = mixHex(SEPIA.wall, P.night1, .25);
  // chimneys + steam behind the hall
  for (const [cx, ch] of [[1180, 420], [1840, 520]]) { ctx.fillStyle = mixHex(col, P.night0, .2); ctx.fillRect(cx - 28, top - ch, 56, ch); ctx.fillRect(cx - 34, top - ch, 68, 16);
    steam(ctx, t, cx, top - ch - 10, 1.6, { a: st.steamA ?? 1, seed: cx }); }
  ctx.fillStyle = lin(ctx, 0, top, 0, g, [[0, mixHex(col, P.blue1, .2)], [1, mixHex(col, P.night0, .3)]]); ctx.fillRect(x0, top, x1 - x0, g - top);
  // saw-tooth roof
  ctx.fillStyle = mixHex(SEPIA.roof, P.blue1, .15); ctx.beginPath(); ctx.moveTo(x0 - 10, top);
  const n = 7; for (let i = 0; i < n; i++) { const a = x0 + (x1 - x0) * i / n, b = x0 + (x1 - x0) * (i + 1) / n; ctx.lineTo(a, top - 90); ctx.lineTo(b, top); }
  ctx.lineTo(x1 + 10, top); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .45); for (let i = 0; i < n; i++) { const a = x0 + (x1 - x0) * i / n; ctx.beginPath(); ctx.moveTo(a + 6, top - 80); ctx.lineTo(a + 6, top - 6); ctx.lineTo(a + 40, top - 6); ctx.closePath(); ctx.fill(); }   // lit roof lights
  // tall windows (warm, the shift inside)
  for (let i = 0; i < 8; i++) { const wx = x0 + 50 + i * 130; if (wx > GATE.x - 120 && wx < GATE.x + GATE.w + 20) continue;
    ctx.fillStyle = lin(ctx, 0, top + 70, 0, top + 300, [[0, rgba(mixHex(P.core1, P.halo0, .5), .55)], [1, rgba(P.shade0, .5)]]); ctx.beginPath(); ctx.roundRect(wx, top + 70, 70, 230, [35, 35, 0, 0]); ctx.fill();
    ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(wx + 33, top + 70, 4, 230); ctx.fillRect(wx, top + 180, 70, 4); }
  // the gate: an arch, open; warm light inside, iron bars folded to the sides
  const { x, w, h } = GATE, gp = new Path2D(); gp.roundRect(x, g - h, w, h, [w / 2, w / 2, 0, 0]);
  ctx.fillStyle = lin(ctx, 0, g - h, 0, g, [[0, mixHex(P.shade0, P.night1, .4)], [1, mixHex(P.halo1, P.shade0, .3)]]); ctx.fill(gp);
  ctx.save(); ctx.clip(gp); halo(ctx, x + w / 2, g - 40, 260, .5, P.halo1, P.core1); ctx.restore();
  ctx.strokeStyle = SEPIA.iron; ctx.lineWidth = 7; ctx.stroke(gp);
  ctx.fillStyle = SEPIA.iron; for (let i = 0; i < 4; i++) { ctx.fillRect(x - 46 + i * 10, g - h + 60, 4, h - 60); ctx.fillRect(x + w + 12 + i * 10, g - h + 60, 4, h - 60); }
  ctx.fillRect(x - 50, g - h + 60, 44, 5); ctx.fillRect(x + w + 8, g - h + 60, 44, 5);
}
function cinema(ctx, t, st) {
  const x0 = 2200, x1 = 2950, top = 300, g = OLD_GROUND, col = mixHex(SEPIA.wall, P.ind1, .3);
  ctx.fillStyle = lin(ctx, x0, top, x1, g, [[0, mixHex(col, P.blue1, .2)], [1, mixHex(col, P.night0, .35)]]); ctx.fillRect(x0, top, x1 - x0, g - top);
  ctx.fillStyle = mixHex(col, P.night0, .4); ctx.fillRect(x0 - 12, top - 18, x1 - x0 + 24, 20);
  // the marquee: a band with chasing bulbs
  const my = 790; ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(x0 + 40, my, x1 - x0 - 80, 60);
  for (let i = 0; i < 34; i++) { const bx = x0 + 56 + i * ((x1 - x0 - 112) / 33), on = .45 + .55 * (Math.sin(t * 5 - i * .9) > .2 ? 1 : 0);
    for (const by of [my + 10, my + 50]) { ctx.fillStyle = rgba(P.core1, on); ctx.beginPath(); ctx.arc(bx, by, 4, 0, TAU); ctx.fill(); } }
  halo(ctx, (x0 + x1) / 2, my + 30, 360, .35, P.halo1, P.halo0);
  // the screen window: the newsreel frame (cool-grey flicker)
  const C = CINE, fl = st.cineA ?? 1;
  ctx.fillStyle = mixHex(P.night0, P.night1, .4); ctx.fillRect(C.x - 16, C.y - 16, C.w + 32, C.h + 32);
  ctx.fillStyle = lin(ctx, C.x, C.y, C.x + C.w, C.y + C.h, [[0, mixHex(P.cream, P.blue1, .35 + .08 * Math.sin(t * 9))], [1, mixHex(P.blue1, P.night1, .4)]]);
  ctx.globalAlpha = .4 + .6 * fl * (st.cineScreen ?? 1); ctx.fillRect(C.x, C.y, C.w, C.h); ctx.globalAlpha = 1;
  ctx.fillStyle = rgba(P.night0, .25); ctx.fillRect(C.x, C.y + ((t * 60) % C.h), C.w, 3);
  halo(ctx, C.x + C.w / 2, C.y + C.h / 2, 300, .18 * fl, P.blue0, P.cream);
  // doors + two small windows
  ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(2480, g - 120, 180, 120); ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(2496, g - 108, 70, 50); ctx.fillRect(2574, g - 108, 70, 50);
}
function vermont(ctx, t, st) {
  // a small wooden house with a lit window, a fence, the tree
  const { x0, x1 } = VT_HOUSE, g = OLD_GROUND, eave = 640, lit = st.vtLit ?? .7, w = st.winterA ?? 1;
  ctx.fillStyle = lin(ctx, x0, eave, x1, g, [[0, mixHex(SEPIA.wood, P.blue1, .3)], [1, mixHex(SEPIA.wood, P.night0, .5)]]); ctx.fillRect(x0, eave, x1 - x0, g - eave);
  ctx.fillStyle = rgba(P.night0, .25); for (let y = eave + 20; y < g; y += 26) ctx.fillRect(x0, y, x1 - x0, 3);   // boards
  ctx.fillStyle = mixHex(SEPIA.roof, P.blue1, .2); ctx.beginPath(); ctx.moveTo(x0 - 30, eave); ctx.lineTo((x0 + x1) / 2, eave - 150); ctx.lineTo(x1 + 30, eave); ctx.closePath(); ctx.fill();
  if (w > 0) { ctx.fillStyle = rgba(SEPIA.snow, w); ctx.beginPath(); ctx.moveTo(x0 - 34, eave + 2); ctx.lineTo((x0 + x1) / 2, eave - 154); ctx.lineTo(x1 + 34, eave + 2); ctx.lineTo(x1 + 20, eave - 8); ctx.lineTo((x0 + x1) / 2, eave - 140); ctx.lineTo(x0 - 20, eave - 8); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = mixHex(NIGHT.glass, P.night0, .2); ctx.fillRect(x0 + 60, eave + 90, 100, 110); ctx.fillRect(x0 + 210, eave + 90, 100, 110);
  ctx.fillStyle = lin(ctx, 0, eave + 90, 0, eave + 200, [[0, rgba(mixHex(P.core1, P.halo0, .4), lit)], [1, rgba(P.shade0, lit)]]); ctx.fillRect(x0 + 60, eave + 90, 100, 110);
  ctx.fillStyle = mixHex(SEPIA.wood, P.night0, .5); ctx.fillRect(x0 + 108, eave + 90, 4, 110); ctx.fillRect(x0 + 60, eave + 143, 100, 4);
  halo(ctx, x0 + 110, eave + 145, 200, .3 * lit);
  ctx.fillStyle = mixHex(P.night0, SEPIA.wood, .3); ctx.fillRect(x0 + 130, g - 170, 70, 170);
  // the fence
  ctx.fillStyle = mixHex(SEPIA.wood, P.night1, .45); for (let x = x1 + 40; x < 4950; x += 34) { if (Math.abs(x - OLDBOX.x) < 60) continue; ctx.fillRect(x, g - 70, 9, 70); } ctx.fillRect(x1 + 40, g - 52, 4950 - x1 - 40, 7);
  tree(ctx, t, 4930, g + 4, 520, st.season ?? 0);
}

// ===================================================================================================== THE HILL AT THE END (c11)
// the same hill as hillWorld, but the hill ends at a bluff XE; the near river runs from XE to XF (F0 card), the far bank beyond XF.
// st: everything hillWorld takes + { future 0..1 (the far shore glows warm), deck 0..1 (your plank bridge, built from your feet),
//   walkers 0..1 (the broad bridge + its people), dust (t → the gold dust's route), duX, du }
export const XE = 2280, XF = 4400, RIVER_Y = F.HILL_Y;
export const Z_BROAD = F0 * 1.32;
export function hillEnd(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: S.SKY_GLOW });
  // the far shore glows: a warm dawn band over the city (drawn under the city)
  const fu = clamp(st.future ?? 0);
  if (fu > 0) E.card(ctx, c, F.Z_CITY * 1.25, () => { ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, F.HOR - 520, 0, F.HOR, [[0, rgba(P.halo1, 0)], [.6, rgba(P.shade0, .3 * fu)], [1, rgba(P.halo1, .85 * fu)]]); ctx.fillRect(-3000, F.HOR - 520, 9000, 520);
    ctx.fillStyle = rad(ctx, 2900, F.HOR, 2400, [[0, rgba(P.core1, .85 * fu)], [.35, rgba(P.halo1, .35 * fu)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(-3000, F.HOR - 1600, 9000, 1700); ctx.restore(); });
  F.city(ctx, c, t, { deck: st.cityDeck ?? 0, winA: (st.winA ?? 1) * (1 + .35 * fu) });
  if (st.field) st.field(ctx, c);
  // the broad bridge (behind your bridge): a solid deck with railings and lamps, people walking across
  if ((st.walkers ?? 0) > 0) E.card(ctx, c, Z_BROAD, () => broadBridge(ctx, t, st.walkers));
  F.hill(ctx, c, t, { pool: [S.PIG.x - 380, 560, st.pool ?? 1] });
  E.card(ctx, c, F0, () => {
    river(ctx, t, fu);
    const p = st.pig || {};
    const out = F.piggy(ctx, t, S.PIG.x, S.PIG.y, S.PIG.h, { crack: 1, ...p });
    st.crack = out.crack;
    if (st.fountain !== false) { const f = st.fountain || {}; F.fountain(ctx, t, out.crack[0], out.crack[1] + 12, S.PIG.h / 700, { rate: f.rate ?? 1.5, a: f.a ?? 1, dust: f.dust ?? 260, seed: 5 }); }
    if (st.dustPath) st.dustPath(ctx);
    if ((st.deck ?? 0) > 0) planks(ctx, t, st.deck, st.deckGlow ?? 0);
    if (st.du !== false) { const d = st.du || {}; E.du(ctx, d.x ?? S.DU_HILL.x, d.y ?? S.DU_HILL.y, d.h ?? S.DU_HILL.h, { look: .3, light: 1, back: .35, ...d }); halo(ctx, (d.x ?? S.DU_HILL.x) + 30, (d.y ?? S.DU_HILL.y) - 60, 260, .12); }
  });
  if (st.front) st.front(ctx, c);
}
// the near river (F0): from the bluff XE to the far bank XF, below the hill line; the far bank beyond XF glows with the future
function river(ctx, t, fu) {
  const y0 = RIVER_Y;
  // cut the hill: water from the bluff on
  ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + 420, [[0, mixHex(P.ind1, P.blue0, .35)], [.3, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]);
  ctx.beginPath(); ctx.moveTo(XE, y0 - 1); ctx.bezierCurveTo(XE + 40, y0 + 30, XE + 50, y0 + 140, XE + 120, y0 + 600); ctx.lineTo(XF + 2000, y0 + 600); ctx.lineTo(XF + 2000, y0 - 1); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = prng(91);
  const LR = XF - XE + 400;   // the current flows slowly left to right; glints breathe
  for (let i = 0; i < 150; i++) { const x = XE + 80 + (r() * LR + t * (10 + 6 * (i % 3))) % LR, y = y0 + 10 + r() * 240, w = 14 + r() * 60, ph = r() * 6.3, warm = r() < .4 + .4 * fu;
    ctx.fillStyle = rgba(warm ? P.halo1 : P.blue0, (.14 + .16 * Math.sin(t * 1.9 + ph)) * (warm ? .6 + fu : 1) * smooth(span(x, XE + 80, XE + 200)) * smooth(span(x, XE + 80 + LR, XE + LR - 40))); ctx.fillRect(x + Math.sin(t * .5 + ph) * 8, y, w, 2.5); }
  ctx.restore();
  // the bluff edge (a darker slope face)
  ctx.fillStyle = lin(ctx, XE - 80, 0, XE + 120, 0, [[0, F.NIGHT.ground], [1, P.night0]]); ctx.beginPath(); ctx.moveTo(XE - 60, y0); ctx.lineTo(XE, y0 - 1); ctx.bezierCurveTo(XE + 40, y0 + 30, XE + 50, y0 + 140, XE + 120, y0 + 600); ctx.lineTo(XE - 300, y0 + 600); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(XE - 60, y0); ctx.lineTo(XE, y0); ctx.stroke();
  // the far bank: warm ground
  ctx.fillStyle = lin(ctx, 0, y0 - 4, 0, y0 + 300, [[0, mixHex(F.NIGHT.ground, P.shade0, .25 + .35 * fu)], [1, P.night0]]);
  ctx.beginPath(); ctx.moveTo(XF - 60, y0 + 600); ctx.bezierCurveTo(XF - 30, y0 + 120, XF - 10, y0 + 20, XF + 40, y0 - 2); ctx.lineTo(XF + 3000, y0 - 2); ctx.lineTo(XF + 3000, y0 + 600); ctx.closePath(); ctx.fill();
  if (fu > 0) halo(ctx, XF + 300, y0, 700, .35 * fu, P.halo1, P.halo0);
}
// your bridge: planks set by the gold dust from the bluff over the river (deck 0..1 = how far it reaches), a slight arch
export const deckY = (x) => RIVER_Y - 10 - 70 * Math.sin(Math.PI * clamp((x - XE) / (XF - XE)));
export const PLANKS = 40;
export const plankX = (i) => lerp(XE - 24, XF + 24, (i + .5) / PLANKS);
function planks(ctx, t, deck, glow) {
  const n = PLANKS, u = deck * n;
  for (let i = 0; i < n; i++) {
    const f = clamp(u - i); if (f <= 0) break;
    const x = plankX(i), y = deckY(x), k = expoOut(f), w = (XF - XE + 48) / n * .86;
    ctx.save(); ctx.globalAlpha *= clamp(f * 2.5); ctx.translate(x, y - (1 - k) * 60); ctx.rotate((1 - k) * .6 * (i % 2 ? 1 : -1));
    ctx.fillStyle = lin(ctx, 0, -8, 0, 8, [[0, mixHex(P.core1, P.halo0, .4)], [1, mixHex(P.halo0, P.shade0, .45)]]); ctx.fillRect(-w / 2, -9, w, 18);
    ctx.fillStyle = rgba(P.shade0, .75); ctx.fillRect(-w / 2, 6, w, 4);
    ctx.restore();
    if (f < 1) halo(ctx, x, y, 70, .5 * (1 - f));
  }
  if (glow > 0 && deck > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo1, .22 * glow); ctx.lineWidth = 40; ctx.lineCap = 'round';
    ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = lerp(XE - 24, XE - 24 + (XF - XE + 48) * deck, i / 40); i ? ctx.lineTo(x, deckY(x)) : ctx.moveTo(x, deckY(x)); } ctx.stroke(); ctx.restore(); }
  // the rope rails (thin gold lines) once the deck is laid
  const ru = smooth(span(deck, .7, 1)); if (ru > 0) { ctx.strokeStyle = rgba(P.halo0, .55 * ru); ctx.lineWidth = 2;
    for (const dy of [-58]) { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = lerp(XE - 10, XF + 10, i / 40); i ? ctx.lineTo(x, deckY(x) + dy) : ctx.moveTo(x, deckY(x) + dy); } ctx.stroke(); }
    for (let i = 0; i <= 10; i++) { const x = lerp(XE - 10, XF + 10, i / 10); ctx.fillStyle = rgba(P.halo0, .6 * ru); ctx.fillRect(x - 2, deckY(x) - 58, 4, 52); } }
}
// the broad bridge (Z_BROAD card, design px): a solid stone deck with railings and lamps; many people walk across (both ways)
const BB = { x0: 1700, x1: 4700, y: 850, n: 22 };
function broadBridge(ctx, t, u) {
  const k = clamp(u), { x0, x1, y } = BB, col = mixHex(P.night1, P.ind1, .55), arch = (x) => y - 34 * Math.sin(Math.PI * clamp((x - x0) / (x1 - x0)));
  // it is built from the hill side outward: a light front runs along it (lamps light, deck + people appear behind the front)
  const L0 = x1 - x0, X = x0 - 60 + (L0 + 260) * k, lit = (x) => smooth(span(X - x, 0, 220));
  ctx.save(); ctx.globalAlpha *= clamp(k * 6); ctx.beginPath(); ctx.rect(x0 - 80, -5000, X - x0 + 80, 10000); ctx.clip();
  // piers + deck
  for (let i = 0; i <= 5; i++) { const x = lerp(x0 + 200, x1 - 200, i / 5); ctx.fillStyle = mixHex(col, P.night0, .3); ctx.fillRect(x - 22, arch(x), 44, 260); }
  ctx.fillStyle = lin(ctx, 0, y - 40, 0, y + 30, [[0, mixHex(col, P.blue1, .3)], [1, col]]);
  ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = lerp(x0, x1, i / 40); i ? ctx.lineTo(x, arch(x)) : ctx.moveTo(x, arch(x)); } for (let i = 40; i >= 0; i--) { const x = lerp(x0, x1, i / 40); ctx.lineTo(x, arch(x) + 26); } ctx.closePath(); ctx.fill();
  // people (behind the railing)
  const r = prng(33);
  for (let i = 0; i < BB.n; i++) {
    const dir = r() < .7 ? 1 : -1, sp = 34 + r() * 22, off = r(), h = 64 + r() * 16, L = x1 - x0;
    const x = x0 + (((off * L + dir * t * sp) % L) + L) % L, edge = smooth(span(x, x0, x0 + 120)) * smooth(span(x, x1, x1 - 120));
    ctx.save(); ctx.globalAlpha *= edge * lit(x); E.person(ctx, x, arch(x) + 2, h, { dir, walk: t * 5.2 * (sp / 40) + i, light: 1, back: .55, rim: mixHex(P.halo1, P.blue0, .4), long: r() < .4 }); ctx.restore();
  }
  // railing + lamps
  ctx.strokeStyle = mixHex(col, P.blue0, .5); ctx.lineWidth = 4; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = lerp(x0, x1, i / 40); i ? ctx.lineTo(x, arch(x) - 42) : ctx.moveTo(x, arch(x) - 42); } ctx.stroke();
  for (let i = 0; i <= 30; i++) { const x = lerp(x0, x1, i / 30); ctx.fillStyle = mixHex(col, P.blue0, .3); ctx.fillRect(x - 2, arch(x) - 42, 4, 42); }
  for (let i = 0; i <= 8; i++) { const x = lerp(x0, x1, i / 8), ly = arch(x) - 110; ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(x - 3, ly, 6, 110);
    const on = lit(x); if (on > 0) { ctx.fillStyle = rgba(P.core1, .95 * on); ctx.beginPath(); ctx.arc(x, ly, 7, 0, TAU); ctx.fill(); halo(ctx, x, ly, 120 + 80 * (1 - on), .35 * on * (1 + .03 * Math.sin(t * 2 + i)) + .3 * on * (1 - on)); } }
  if (k < 1) halo(ctx, X, arch(X) - 20, 140, .45 * (1 - k));
  ctx.restore();
}
