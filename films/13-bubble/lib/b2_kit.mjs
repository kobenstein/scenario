// Film 13 · B2 (c06–c08) · drawing primitives of the B2 package (builder B2 owns this file).
// Base: lib/f10_editorial.mjs (E), lib/base_kit.mjs (K), lib/bubble_kit.mjs (B), lib/bubble_seams.mjs (S). Same rules as the kit:
// flat shapes + gradients, no canvas / pattern per frame, seeded randomness only, Path2D per frame is fine.
// Everything here is drawn in DESIGN coordinates of the card it is called in (the take decides the card and the camera).
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import * as B from './bubble_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, halo, dust, prng } = E;
const { COL } = B;

export const rise = (x) => 1 - (1 - clamp(x)) ** 3;
export const ease5 = (x) => 1 - (1 - clamp(x)) ** 5;
export const bell = (t, c, w) => Math.exp(-(((t - c) / w) ** 2));

// ---------- the night of the plates (plateBrick / plateDoor grounds), as fills ----------
export const BG_BRICK = [[0, P.night0], [.6, P.night1], [1, P.ind0]];
export const BG_DOOR = [[0, P.night0], [.7, P.night1], [1, P.night0]];
export function nightFill(ctx, stops = BG_BRICK, y0 = 0, y1 = H) { ctx.fillStyle = lin(ctx, 0, y0, 0, y1, stops); ctx.fillRect(-12000, -9000, 30000, 20000); }

// ---------- type: one line rising from / sinking under its baseline (K.maskLine with the film's label look) ----------
export function label(ctx, s, x, y, size, u, o = {}) {
  if (u <= 0) return null;
  return K.maskLine(ctx, [[s, o.warm ?? 0]], x, y, size, u, { serif: o.serif ?? false, col: o.col ?? P.halo2, glow: o.glow ?? false, align: o.align, weight: o.weight });
}
// right-aligned variant (maskLine knows left / center)
export function labelR(ctx, s, x, y, size, u, o = {}) { return label(ctx, s, x - K.measure(s, size, o.serif ?? false, o.weight), y, size, u, o); }

// ---------- c05|c06: the plate's chip bar, continued (same code as S.plateBrick, so the first frame after the plate is identical) ----
export const BRICK = { x0: 760, x1: 1160, y0: 520, y1: 600, axisY: 640 };
export function chipBar(ctx, x0, y0, w, h, t, o = {}) {
  const br = .95 + .05 * Math.sin(t * 1.7), a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + h, [[0, mixHex(COL.cool2, COL.loss, .35)], [1, COL.loss]]); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 6); ctx.fill();
  ctx.strokeStyle = rgba(COL.cool, .55 * br); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 6, y0 + 1); ctx.lineTo(x0 + w - 6, y0 + 1); ctx.stroke();
  ctx.restore();
}
export function chipGlow(ctx, cx, cy, t, k = 1) {
  if (k <= 0) return; const br = .95 + .05 * Math.sin(t * 1.7);
  ctx.fillStyle = rad(ctx, cx, cy, 700, [[0, rgba(COL.cool2, .14 * br * k)], [1, rgba(COL.cool2, 0)]]); ctx.fillRect(cx - 2400, cy - 2400, 4800, 4800);
}
// the plate's label, sunk below its baseline by k (0 = exactly the plate)
export function chipLabel(ctx, k, x = 960, y = BRICK.y0 - 34) {
  if (k >= 1) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 400, y - 40, 800, 48); ctx.clip();
  E.glowText(ctx, 'CHIPS · 3–6 YEARS', x, y + 40 * expoIn(k), { size: 30, weight: 600, col: P.halo2, glow: false, align: 'center' });
  ctx.restore();
}

// ---------- the wall ----------
export const BW = 400, BH = 80, GAP = 12;
export const ROWY = [760, 668, 576];                     // row tops: r0 (bottom) … r2 (top)
export const GROUND = 846;
export const WALL = { x0: 140, x1: 1900 };
export const brickX = (r, c) => 760 + c * (BW + GAP) + (r % 2 ? (BW + GAP) / 2 : 0);
// all bricks of the wall: {r, c, x, y, kind}
export const WALL_BRICKS = (() => {
  const out = [];
  for (let r = 0; r < 3; r++) for (let c = -4; c <= 4; c++) {
    const x = brickX(r, c), cx = x + BW / 2; if (cx < WALL.x0 || cx > WALL.x1) continue;
    out.push({ r, c, x, y: ROWY[r] });
  }
  return out;
})();
// a plain brick (unlit: the wall is dark, it only has a cool rim from above). k = how far it has grown up from its baseline.
export function plainBrick(ctx, x, y, w, h, o = {}) {
  const lum = o.lum ?? 1, top = mixHex(P.ind2, P.blue1, .28 * lum);
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, top], [1, mixHex(P.night1, P.ind2, .3)]]);
  ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(5, h / 3)); ctx.fill();
  ctx.fillStyle = rgba(P.blue0, .55 * lum); ctx.fillRect(x + 4, y, w - 8, Math.min(2.5, h / 4));
  if (o.chip) { ctx.fillStyle = rgba(P.night0, .2); ctx.fillRect(x + w * .62, y + h * .55, w * .2, 2); }
}
export const BRICK_COLS = { plain: [mixHex(P.ind2, P.blue1, .28), mixHex(P.night1, P.ind2, .3), P.blue0], chip: [mixHex(COL.cool2, COL.loss, .35), COL.loss, COL.cool], paper: [COL.paper1, COL.paper2, P.cream] };
// a labelled limit brick (front: cool, two lines of cream type) — sx for the flip
export function limitBrick(ctx, cx, cy, sx, l1, l2, o = {}) {
  const w = BW, h = BH;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sx, 1);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(COL.cool2, COL.coolDeep, .25)], [1, mixHex(COL.coolDeep, P.ind2, .35)]]);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 6); ctx.fill();
  ctx.fillStyle = rgba(COL.cool, .6); ctx.fillRect(-w / 2 + 6, -h / 2, w - 12, 2);
  if (Math.abs(sx) > .25) E.glowText(ctx, l1, 0, 14, { size: 40, weight: 600, col: P.cream, glow: false, align: 'center' });
  ctx.restore();
}
// its back: lamp-lit paper with one serif word (MONEY · POWER · DEBT)
export function wordBrick(ctx, cx, cy, sx, word, o = {}) {
  const w = BW, h = BH;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sx, 1);
  const p = new Path2D(); p.roundRect(-w / 2, -h / 2, w, h, 6);
  if (o.glow) E.glowFill(ctx, p, 30, .35 * o.glow, P.halo1);
  B.paperFill(ctx, p, { lum: o.lum ?? 1, seed: 601 + word.length, fibre: 600 });
  if (Math.abs(sx) > .2 && (o.sink ?? 0) < 1) {   // o.sink: the word sinks under the brick's lower edge (mask)
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
    E.glowText(ctx, word, 0, 24 + 70 * expoIn(clamp(o.sink ?? 0)), { size: 66, serif: true, col: COL.ink, glow: false, align: 'center' });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- ice: a brick flattened into a floe on the lake (f 0 → 1) ----------
export const BAND = { r0: [826, 846], r1: [808, 824], r2: [792, 806] };   // floe rows (near → far)
export function iceY(r, f) { const [a, b] = BAND['r' + r]; return [lerp(ROWY[r], a, f), lerp(BH, b - a, f)]; }
export function iceFloe(ctx, x, y, w, h, o = {}) {
  const tilt = o.tilt ?? 0, sink = o.sink ?? 0, dark = o.dark ?? 0;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2 + sink); ctx.rotate(tilt);
  // o.from = [top, bottom, rim] of the brick it was; o.k = how much of the brick is still in it (1 = the brick's colours)
  const fk = o.from ? clamp(o.k ?? 0) : 0, fr = o.from || [];
  let top = mixHex(mixHex(P.blue1, COL.cool, .32), P.night1, dark), bot = mixHex(mixHex(P.blue2, P.ind2, .4), P.night0, dark);
  if (fk > 0) { top = mixHex(top, fr[0], fk); bot = mixHex(bot, fr[1], fk); }
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, top], [1, bot]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, Math.min(5, h / 3)); ctx.fill();
  ctx.fillStyle = fk > 0 ? rgba(mixHex(P.cream, fr[2], fk), lerp(.35, .55, fk) * (1 - dark)) : rgba(P.cream, .35 * (1 - dark)); ctx.fillRect(-w / 2 + 4, -h / 2, w - 8, Math.min(2.5, h / 4));
  ctx.restore();
}

// ---------- the far shore (low hills) whose rim becomes the S&P 500 line ----------
const SHORE = (() => { const r = prng(611), pts = []; for (let x = -1400; x <= 5400; x += 60) pts.push([x, 0]); return pts.map(([x], i) => [x, 781 - 4 * Math.sin(x * .004 + 1) - 3 * Math.sin(x * .013) - 2 * (r() - .5) - (x > 800 && x < 1960 ? 5 * smooth(span(x, 800, 1880)) : 0)]); })();
export const shoreY = (x) => { for (let i = 1; i < SHORE.length; i++) if (SHORE[i][0] >= x) { const [x0, y0] = SHORE[i - 1], [x1, y1] = SHORE[i]; return lerp(y0, y1, (x - x0) / (x1 - x0)); } return 781; };
// k = how far they have risen from the band (0 = flat on the ice line)
export function farShore(ctx, k, o = {}) {
  const sw = o.sw ?? 0;
  if (k <= 0 || sw >= .995) return;
  const lift = (1 - expoOut(k)) * 26;
  ctx.save(); ctx.beginPath(); ctx.rect(-1600, -2000, 7200, 2000 + 792); ctx.clip();
  const hp = new Path2D(); hp.moveTo(-1400, 900);
  for (const [x, y] of SHORE) {
    const hill = (x < 140 || x > 1900) ? 60 * (.5 + .5 * Math.sin(x * .0021 + .4)) + 30 * Math.sin(x * .0067) ** 2 : 10 + 8 * Math.sin(x * .009) ** 2;
    hp.lineTo(x, y - hill * .6 + lift);
  }
  hp.lineTo(5400, 900); hp.closePath();
  ctx.fillStyle = lin(ctx, 0, 690, 0, 800, [[0, mixHex(mixHex(P.ind1, P.night1, .45), P.night1, sw)], [1, P.night1]]); ctx.fill(hp);
  ctx.strokeStyle = rgba(P.blue0, .5 * (o.rim ?? 1) * (1 - sw)); ctx.lineWidth = 2; ctx.stroke(hp);
  ctx.restore();
}
// the shore line itself as a polyline (x0 → x1) for the S&P line
export function shoreLine(x0, x1) { const out = []; for (let x = x0; x <= x1; x += 20) out.push([x, shoreY(x) - 8]); return out; }

// ---------- the moon (cool-cream disc, the capability light settled) ----------
export function moon(ctx, x, y, r, t, k = 1) {
  if (k <= 0 || r <= .5) return;
  const br = 1 + .015 * Math.sin(t * .9);
  halo(ctx, x, y, r * 7 * br, .16 * k, COL.cool2, COL.cool);
  halo(ctx, x, y, r * 2.6 * br, .3 * k, COL.cool, P.cream);
  ctx.save(); ctx.globalAlpha = k;
  ctx.fillStyle = rad(ctx, x - r * .25, y - r * .3, r * 1.3, [[0, P.cream], [.55, mixHex(P.cream, COL.cool, .5)], [1, COL.cool2]]);
  ctx.beginPath(); ctx.arc(x, y, r * br, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgba(COL.cool2, .25); ctx.beginPath(); ctx.arc(x + r * .3, y + r * .15, r * .22, 0, 6.29); ctx.arc(x - r * .2, y + r * .35, r * .12, 0, 6.29); ctx.fill();
  ctx.restore();
  dust(ctx, 621, 160, x, y, r * 1.6, r * 1.6, t * .4, .35 * k, P.cream);
}
// the moon's path of light on the ice (a vertical glimmer on the band under the moon)
export function moonGlimmer(ctx, x, y0, y1, t, k = 1) {
  if (k <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) {
    const yy = lerp(y0, y1, i / 8), w = lerp(26, 120, i / 8) * (1 + .15 * Math.sin(t * 1.3 + i * 1.7));
    ctx.fillStyle = rgba(P.cream, .16 * k * (1 - i / 12)); ctx.fillRect(x - w / 2 + 6 * Math.sin(t * .8 + i), yy, w, 1.6 + i * .25);
  }
  ctx.restore();
}

// ---------- a crack: a jagged dark line with a cool lip, grown by u ----------
const CRACK = new Map();
export function crackPts(seed, x0, y0, x1, y1, n = 9, amp = 10) {
  const key = `${seed}`; if (CRACK.has(key)) return CRACK.get(key);
  const r = prng(seed), pts = [];
  for (let i = 0; i <= n; i++) { const k = i / n; pts.push([lerp(x0, x1, k) + (i && i < n ? (r() - .5) * amp : 0), lerp(y0, y1, k) + (i && i < n ? (r() - .5) * amp * .6 : 0)]); }
  CRACK.set(key, pts); return pts;
}
export function crack(ctx, pts, u, o = {}) {
  if (u <= 0) return null;
  B.inkLine(ctx, pts, u, { col: o.lip ?? COL.cool, w: (o.w ?? 2.4) + 1.6, a: .35 * (o.a ?? 1) });
  return B.inkLine(ctx, pts, u, { col: o.col ?? P.night0, w: o.w ?? 2.4, a: o.a ?? 1 });
}

// ---------- data points of a measured trend (dots of cool light) ----------
export const DOTS = (() => { const r = prng(633), d = []; for (let i = 0; i < 22; i++) d.push([i / 21 + (r() - .5) * .02, (r() - .5) * 2]); return d; })();
