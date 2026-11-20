// Film 29 · builder B1 (c02–c06) · extra drawings that the shared kit does not have (owned by B1; kit wishes in the report).
//   vComb(ctx, x, y0, y1, o { a, dir })          the machine's comb standing upright (a cyan line with teeth), for running ALONG a strand
//   cutaway(ctx, t, w, h, o { ice, mam, bones, shards, rise(k) })   the frozen ground under the snow (inside a portal from a slit in the snow)
//   slit(ctx, x, y, w, u)                        the thin dark opening in the snow the cutaway grows out of
//   blocks(ctx, t, o)                            the gene blocks (1,600): a grid that can rank itself into a sorted row
//   birdSil(ctx, t, x, y, s, o { beak, col, a, dir, skull, rim })   a living bird in profile with its own beak shape; skull 0..1 = its
//                                                skull outline drawn over the head (GenoMorph: DNA + the exact shape of the skull)
//   skyPin / skyPos                              explainers that hang in the far sky: they ride with the horizon (tilt) and move a little
//                                                with a pan (parallax of a far plane), so a camera move carries them in and out of frame
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f29_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, halo, lin, prng, expoOut, sineIO } = E;
const { GOLD, MACH, SNOW, FROST, FUR, LAMP } = F;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------------------------- the sky plane
export const KS = .06;   // px per world unit of a pan for things hanging in the far sky
export const skyPin = (c, px, py) => ({ X: c.x + (px - W / 2) / KS, dy: c.hz - py, px, py });
export const skyPos = (c, pin) => [W / 2 + (pin.X - c.x) * KS, c.hz - pin.dy];
// translate the context so a group designed at the pin's design point (px, py) is drawn where the pin is now
export function atSky(ctx, c, pin, fn) { const [x, y] = skyPos(c, pin); ctx.save(); ctx.translate(x - pin.px, y - pin.py); fn(x - pin.px, y - pin.py); ctx.restore(); }

// ---------------------------------------------------------------------------------------------------------------- the comb, upright
export function vComb(ctx, x, y0, y1, o = {}) {
  const a = o.a ?? 1, dir = o.dir ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, x - 70 * dir, 0, x, 0, [[0, rgba(MACH.halo, 0)], [1, rgba(MACH.halo, .26)]]);
  ctx.fillRect(Math.min(x, x - 70 * dir), y0 - 6, 70, y1 - y0 + 12);
  ctx.restore();
  F.accentSpan(ctx, [[x, y0 - 10], [x, y1 + 10]], 0, 1, { w: 2.2, spark: false, col: MACH });
  ctx.fillStyle = rgba(MACH.line, .6); for (let y = y0 + 6; y < y1; y += 15) ctx.fillRect(x - 9 * dir - (dir < 0 ? -2 : 0), y - 1, 8, 2);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the frozen ground
export function slit(ctx, x, y, w, u) {
  if (u <= 0) return;
  const hw = w / 2 * expoOut(u);
  ctx.save(); ctx.fillStyle = rgba(P.night0, .9); ctx.beginPath(); ctx.ellipse(x, y, hw, 3 + 2 * u, 0, 0, TAU); ctx.fill();
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(SNOW.lit, .25 * u); ctx.fillRect(x - hw, y - 5, hw * 2, 1.5); ctx.restore();
}
const STRATA = (() => { const r = prng(2991), out = []; let y = .1; while (y < 1.05) { const h = .05 + r() * .09; out.push({ y, h, w: r(), ph: r() * TAU }); y += h; } return out; })();
const STONES = (() => { const r = prng(2993), out = []; for (let k = 0; k < 70; k++) out.push([r(), .14 + r() * .86, 2 + r() * 6, r()]); return out; })();
const BONES = [[.16, .62, .13, -.25], [.74, .78, .1, .4], [.86, .46, .07, -.6], [.3, .86, .09, .15], [.58, .5, .06, 1.2]];
export const SHARDS7 = (() => { const r = prng(2997), out = []; for (let k = 0; k < 10; k++) out.push({ x: .08 + .84 * (k + r() * .6) / 10.3, y: .32 + r() * .5, w: .07 + r() * .05, rot: (r() - .5) * .9, n: 5 + Math.floor(r() * 4), seed: 410 + k }); return out; })();
// inside a portal: w × h local px. o.ice 0..1 the ice block with the frozen mammoth (1.02), o.bones / o.shards 0..1 (1.07), o.lift(k) → px a
// shard has risen (it leaves the ground), o.cross 0..1 (NOT THIS)
export function cutaway(ctx, t, w, h, o = {}) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(SNOW.shade, P.ind1, .35)], [.09, mixHex(P.ind2, '#3a2c30', .35)], [.5, mixHex(P.night1, '#2e2224', .45)], [1, P.night0]]);
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = lin(ctx, 0, 0, 0, h * .1, [[0, rgba(SNOW.lit, .55)], [1, rgba(SNOW.body, 0)]]); ctx.fillRect(0, 0, w, h * .1);   // the snow on top
  for (const s of STRATA) {   // the layers of frozen ground (soft wavy bands)
    ctx.fillStyle = rgba(s.w > .5 ? '#3c2c30' : P.ind1, .22 + .18 * s.w);
    ctx.beginPath(); ctx.moveTo(0, s.y * h);
    for (let x = 0; x <= w; x += w / 16) ctx.lineTo(x, s.y * h + 7 * Math.sin(x * .006 + s.ph));
    for (let x = w; x >= 0; x -= w / 16) ctx.lineTo(x, (s.y + s.h * .45) * h + 6 * Math.sin(x * .007 + s.ph + 1));
    ctx.closePath(); ctx.fill();
  }
  for (const [u, v, r, q] of STONES) { ctx.fillStyle = rgba(q > .6 ? FROST.shade : '#5a4648', .25 + .2 * q); ctx.beginPath(); ctx.ellipse(u * w, v * h, r * 1.4, r, q * 3, 0, TAU); ctx.fill(); }
  const bo = clamp(o.bones ?? 0);
  if (bo > 0) for (const [u, v, l, rot] of BONES) {   // old bones lying in the ground
    ctx.save(); ctx.translate(u * w, v * h); ctx.rotate(rot); ctx.globalAlpha *= bo; const L = l * w, r = Math.max(4, L * .07);
    ctx.fillStyle = mixHex('#cfc4a8', P.night1, .45); ctx.fillRect(-L / 2, -r * .45, L, r * .9);
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * L / 2, -r * .5, r * .7, 0, TAU); ctx.arc(sx * L / 2, r * .5, r * .7, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  const ic = clamp(o.ice ?? 0);
  if (ic > 0) {   // the frozen mammoth in a block of ice (1.02: NOT THIS)
    const bx = w * .5, by = h * .88, bs = h * .95;
    ctx.save(); ctx.globalAlpha *= ic;
    iceBody(ctx, t, bx, by, bs);
    ctx.save(); ctx.beginPath(); ctx.rect(bx - bs * .5, by - bs * .8, bs, bs * .8); ctx.clip();
    F.beast(ctx, t, bx + bs * .02, by - bs * .1, bs * .44, { ...F.MAMMOTH, dir: 1, shade: 1, a: .8, rim: FROST.body, rimA: .5, lift: .05 });
    ctx.restore();
    iceGloss(ctx, bx, by, bs);
    ctx.restore();
  }
  const sh = clamp(o.shards ?? 0);
  if (sh > 0) for (let k = 0; k < SHARDS7.length; k++) {   // short broken pieces of strands, frozen in
    const q = SHARDS7[k], lift = o.lift ? o.lift(k) : 0; if (lift === null) continue;
    shard(ctx, t, q.x * w, q.y * h - lift, q.w * w, q, sh);
  }
}
export function shard(ctx, t, x, y, L, q, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(q.rot * (q.unrot ?? 1)); ctx.globalAlpha *= a;
  const rr = prng(q.seed), hh = 22;
  ctx.fillStyle = rgba(mixHex(P.blue1, P.cream, .3), .75); ctx.fillRect(-L / 2, -hh / 2 - 1, L * (.75 + .25 * rr()), 2.5); ctx.fillRect(-L / 2 + L * .1 * rr(), hh / 2 - 1, L * (.7 + .25 * rr()), 2.5);
  for (let k = 0; k < q.n; k++) { const px = -L / 2 + (k + .5) * L / q.n, len = hh * (.45 + .55 * rr()); ctx.fillStyle = rgba(mixHex(GOLD.body, P.cream, .35), .5 + .3 * Math.sin(t * .8 + k + q.seed)); ctx.fillRect(px - 1.8, -len / 2, 3.6, len); }
  ctx.restore();
}
function iceBody(ctx, t, x, y, s) {
  const h = s * .7, body = [[-s * .5, 0], [-s * .53, -h * .7], [-s * .42, -h], [s * .38, -h * .97], [s * .52, -h * .78], [s * .5, 0]];
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = lin(ctx, -s * .5, -h, s * .5, 0, [[0, mixHex(FROST.body, P.blue1, .55)], [.5, mixHex(FROST.shade, P.ind1, .55)], [1, mixHex(FROST.deep, P.night1, .5)]]);
  ctx.beginPath(); body.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function iceGloss(ctx, x, y, s) {
  const h = s * .7, body = [[-s * .5, 0], [-s * .53, -h * .7], [-s * .42, -h], [s * .38, -h * .97], [s * .52, -h * .78], [s * .5, 0]];
  ctx.save(); ctx.translate(x, y);
  ctx.beginPath(); body.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  ctx.save(); ctx.clip(); ctx.fillStyle = rgba(FROST.body, .16); ctx.fillRect(-s, -h * 1.2, s * 2, h * 1.3);
  ctx.fillStyle = rgba(FROST.core, .14); ctx.beginPath(); ctx.moveTo(-s * .42, -h); ctx.lineTo(s * .38, -h * .97); ctx.lineTo(s * .1, -h * .78); ctx.lineTo(-s * .3, -h * .82); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.strokeStyle = rgba(FROST.core, .55); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the gene blocks
// 1,600 blocks. o { x, y (top left of the grid), cols 80, cell 11, u(k) 0..1 present, gold(k) 0..1, rank 0..1 (grid → sorted row),
// rowX, rowY (baseline of the row), rowW, rowH (tallest bar), grey(k by rank) 0..1, a, hide(k) }
export const NB = 1600;
export const BLOCK = (() => { const r = prng(2999), sc = []; for (let k = 0; k < NB; k++) sc.push(Math.pow(r(), 2.2)); const order = sc.map((v, k) => [v, k]).sort((p, q) => q[0] - p[0]); const rank = new Array(NB); order.forEach(([, k], i) => { rank[k] = i; }); return { sc, rank }; })();
export function blocks(ctx, t, o) {
  const cols = o.cols ?? 80, cell = o.cell ?? 11, a = o.a ?? 1, rk = clamp(o.rank ?? 0); if (a <= 0) return;
  const bw = (o.rowW ?? 1400) / NB;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < NB; k++) {
    const u = o.u ? clamp(o.u(k)) : 1; if (u <= 0) continue;
    const i = BLOCK.rank[k], gx = o.x + (k % cols) * cell, gy = o.y + Math.floor(k / cols) * cell;
    const e = sineIO(span(rk, (k % cols) / cols * .35, (k % cols) / cols * .35 + .65));   // the columns leave the grid one after the other (left first)
    const bh = Math.max(2, (o.rowH ?? 200) * (.08 + .92 * BLOCK.sc[k]));
    const x = lerp(gx, o.rowX + i * bw, e), y = lerp(gy, o.rowY - bh, e), w = lerp(cell - 3, Math.max(1, bw * .9), e), h = lerp(cell - 3, bh, e);
    const g = o.gold ? clamp(o.gold(k, i)) : 1, gr = o.grey ? clamp(o.grey(k, i)) : 0;
    const col = mixHex(mixHex(mixHex(P.blue1, P.cream, .25), GOLD.body, g), mixHex(P.blue2, P.night1, .35), gr);
    ctx.globalAlpha = a * u * (1 - .45 * gr);
    ctx.fillStyle = col; ctx.fillRect(x + (1 - u) * 2, y + (1 - u) * 2, w * u, h * u);
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- living birds
// a bird in profile: (x, y) = feet, s = height px. o.beak { len, curve, depth } (0..1 each), o.col (body), o.skull 0..1, o.a, o.dir, o.hop 0..1
export function birdSil(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < 1) return;
  const b = o.beak ?? { len: .5, curve: .3, depth: .4 }, dir = o.dir ?? 1, hop = Math.sin(Math.PI * clamp(o.hop ?? 0)) * .35;
  const tilt = .05 * Math.sin(t * (1.3 + b.len) + b.curve * 9);
  ctx.save(); ctx.translate(x, y - hop * s); ctx.scale(s * dir, s); ctx.globalAlpha *= a;
  const body = new Path2D();
  body.ellipse(-.05, -.42, .3, .22, -.25, 0, TAU);
  body.moveTo(-.28, -.4); body.lineTo(-.62, -.28); body.lineTo(-.56, -.22); body.lineTo(-.24, -.3); body.closePath();
  const hx = .22, hy = -.7, hr = .15;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt);
  const head = new Path2D(); head.ellipse(0, 0, hr, hr * .95, 0, 0, TAU);
  // the beak: length, curve (down-hooked) and depth (thick at the base) differ from bird to bird
  const L = .12 + .42 * b.len, D = .05 + .11 * b.depth, cv = .25 * b.curve;
  const bk = new Path2D(); bk.moveTo(hr * .7, -D * .55); bk.quadraticCurveTo(hr + L * .6, -D * .5 - cv * .2, hr + L, cv * L); bk.quadraticCurveTo(hr + L * .5, D * .3 + cv * L * .4, hr * .7, D * .55); bk.closePath();
  ctx.restore();
  const col = o.col ?? mixHex(P.blue1, P.halo2, .25);
  ctx.fillStyle = col; ctx.fill(body);
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt); ctx.fill(head); ctx.fillStyle = mixHex(col, GOLD.ink, .35); ctx.fill(bk);
  const sk = clamp(o.skull ?? 0);
  if (sk > 0) {   // the skull: a cream outline of the cranium and the beak bone, with the eye socket
    ctx.globalAlpha *= sk; ctx.strokeStyle = rgba(mixHex(P.cream, GOLD.body, clamp(o.learn ?? 0)), .9); ctx.lineWidth = .028; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.ellipse(-.01, -.01, hr * .82, hr * .78, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(.03, -.02, hr * .32, 0, TAU); ctx.stroke();
    if ((o.learn ?? 0) > 0) { ctx.lineWidth = .045; ctx.strokeStyle = rgba(GOLD.core, .9 * o.learn); }
    ctx.stroke(bk);
  }
  ctx.restore();
  ctx.strokeStyle = mixHex(col, P.night0, .3); ctx.lineWidth = .035; ctx.beginPath(); ctx.moveTo(-.04, -.22); ctx.lineTo(-.06, 0); ctx.moveTo(.06, -.22); ctx.lineTo(.07, 0); ctx.stroke();
  ctx.restore();
}
