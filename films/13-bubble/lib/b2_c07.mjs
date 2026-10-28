// Film 13 · B2 · c07 pieces of the one take (Space A, design coords of the focus card F0). The take (lib/b2_take.mjs) owns the camera
// and the times; everything here is a pure function of (t, a = anchors, k-values the take passes).
//   NET     the grid in the sky above your house: your meter's cable → the trunk → the plant; a branch to a data center; a bus to the
//           neighbours. Bars of the capacity price rise from the trunk; the $23 BN counter; the cost flowing into the houses.
//   phone   your phone (DEFAULT FUND · BY DEFAULT) · the index ring (MORE THAN ¼) · the note that lands in your hand · the far bubble
//   street  the neighbours' houses and the parsonage further along the shore; their windows → the bidder cards (7.08)
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import * as B from './bubble_kit.mjs';
import * as G from './b2_kit.mjs';
import * as Hs from './b2_house.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, halo, dust, prng, catmull } = E;
const { COL } = B;
const { rise, bell, GROUND } = G;

// ================================================================================================= the grid (7.02 · 7.03)
export const NET = { P: [1450, -60], J: [2060, -60], Q: [2312, 150], D: { x0: 2620, x1: 3060, y: -300, h: 128 } };
// your meter's cable: up the wall, through the roof, up-left to the junction J
export const CABLE = catmull([[Hs.METER.x, Hs.METER.y - Hs.METER.bh * .38], [Hs.METER.x, 420], [2312, 300], [NET.Q[0], NET.Q[1]], [2250, 60], [2150, -30], [NET.J[0], NET.J[1]]], 8);
export const TRUNK = [[NET.J[0], NET.J[1]], [1300, NET.J[1]]];
export const DBRANCH = catmull([[NET.J[0], NET.J[1]], [2240, -110], [2420, -240], [2560, -296], [2620, NET.D.y]], 8).concat([[3110, NET.D.y]]);
// the bus to the neighbours (7.03 "everyone else"): from the cable's knee Q to the right, with drops into the roofs
export const BUS = [[NET.Q[0], NET.Q[1]], [3720, NET.Q[1]]];
export const DROPS = [[3180, 150, 3180, 322], [3550, 150, 3550, 330]];
// bars of the capacity price (baseline = the trunk)
export const BAR = { y: -60, w: 84, x1: 1598, x2: 1840, h1: 49, h2: 556 };   // $29 → $329 (× 11.3)

const plantPath = (() => {   // a cooling tower (waisted) + a chimney, standing on the trunk at P (local: base at y 0)
  const p = new Path2D(), [x] = NET.P;
  p.moveTo(x - 78, 0); p.bezierCurveTo(x - 58, -60, x - 50, -110, x - 58, -168); p.lineTo(x + 18, -168); p.bezierCurveTo(x + 10, -110, x + 18, -60, x + 38, 0); p.closePath();
  p.rect(x + 52, -232, 22, 232);
  p.rect(x + 34, -70, 86, 70);
  return p;
})();
export function plant(ctx, t, k, glow) {
  if (k <= 0) return;
  const y0 = NET.P[1];
  ctx.save(); ctx.beginPath(); ctx.rect(1200, y0 - 400, 560, 400); ctx.clip();
  ctx.translate(0, y0 + 330 * (1 - k)); ctx.translate(NET.P[0], 0); ctx.scale(1.35, 1.35); ctx.translate(-NET.P[0], 0);
  if (glow > 0) { halo(ctx, NET.P[0] - 20, -150, 210, .42 * glow, P.halo1, P.core0); }
  ctx.fillStyle = lin(ctx, 0, -232, 0, 0, [[0, mixHex(P.ind2, P.blue1, .3)], [1, P.night1]]); ctx.fill(plantPath);
  ctx.fillStyle = rgba(P.halo1, .5 + .4 * glow); ctx.fillRect(NET.P[0] - 58, -170, 76, 2.5); ctx.fillRect(NET.P[0] + 52, -234, 22, 2.5);
  // a steam breath from the tower (standby: slow)
  if (glow > 0) dust(ctx, 1461, 26, NET.P[0] - 20, -200 - 20 * Math.sin(t * .6), 60, 26, t * .4, .35 * glow, P.halo2);
  ctx.restore();
}
export function dcGlyph(ctx, t, k, lum) {
  if (k <= 0) return;
  const { x0, x1, y, h } = NET.D;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 40, y - h - 60, x1 - x0 + 80, h + 62); ctx.clip();
  ctx.translate(0, (h + 50) * (1 - k));
  B.dataCenter(ctx, x0, y, x1 - x0, h, t, { lum, seed: 17, rim: .6 });
  ctx.restore();
}
// the bars: they rise out of the trunk (clip at the baseline)
export function bars(ctx, t, k1, k2, glow2) {
  const lightBar = (x, h, g) => {
    if (h < 1) return;
    const p = new Path2D(); p.roundRect(x, BAR.y - h, BAR.w, h, [6, 6, 0, 0]);
    if (g > 0) E.glowFill(ctx, p, 40, .35 * g, P.halo1);
    ctx.fillStyle = lin(ctx, 0, BAR.y - h, 0, BAR.y, [[0, mixHex(P.core1, P.halo0, .5)], [.25, P.halo0], [1, P.shade0]]); ctx.fill(p);
  };
  ctx.save(); ctx.beginPath(); ctx.rect(1200, -1400, 1200, 1340); ctx.clip();
  lightBar(BAR.x1, BAR.h1 * k1, 0);
  lightBar(BAR.x2, BAR.h2 * k2, glow2);
  ctx.restore();
}

// ================================================================================================= your phone (7.04)
export const PH = { x: 2507, y: 638, h: 64 };   // the phone in your raised right hand (hand at lift 1 ≈ 2512, 659)
export function phoneScreen(o) {
  return (ctx, w, h) => {
    ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.night1, COL.coolDeep, .55)], [1, P.night1]]); ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = COL.cool; ctx.font = `600 ${(w * .15).toFixed(3)}px Inter`; ctx.textAlign = 'center';
    ctx.fillText('DEFAULT', w / 2, h * .15); ctx.fillText('FUND', w / 2, h * .15 + w * .18);
    const cx = w / 2, cy = h * .5, r = w * .27, lw = w * .07, k = o.ring ?? 1;
    if (k > 0) {
      ctx.lineWidth = lw; ctx.strokeStyle = rgba(COL.cool2, .6 * k); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }
    const bx = w * .1, by = h * .76, bs = w * .15;
    ctx.strokeStyle = rgba(COL.cool, .9); ctx.lineWidth = w * .022; ctx.strokeRect(bx, by, bs, bs);
    ctx.fillStyle = rgba(COL.cool, .9); ctx.font = `600 ${(w * .12).toFixed(3)}px Inter`; ctx.textAlign = 'left'; ctx.fillText('BY DEFAULT', bx + bs * 1.3, by + bs * .85);
    const ck = clamp(o.check ?? 0);
    if (ck > 0) B.inkLine(ctx, [[bx + bs * .15, by + bs * .5], [bx + bs * .42, by + bs * .82], [bx + bs * 1.0, by - bs * .1]], ck, { col: P.halo0, w: w * .04 });
  };
}
// the screen's ring centre in design coords (phone upright, centre PH)
export const SCREEN_RING = { x: PH.x, y: PH.y, r: PH.h * .5 * .88 * .27 };

// ================================================================================================= the index ring (7.05) and the note (7.06)
export const RING = { x: PH.x - 50, y: PH.y - 8, r: 26, w: 4.2 };
const SEG = (() => { const out = [], sizes = [.068, .062, .052, .047, .041]; let q = -Math.PI / 2; for (const s of sizes) { const a0 = q + .004 * Math.PI * 2, a1 = q + s * Math.PI * 2 - .004 * Math.PI * 2; out.push([a0, a1]); q += s * Math.PI * 2; } return out; })();   // 27 %
export const SEGS = SEG;
// k: how far the ring has grown out of the phone (0 = the small screen ring) · seg[i] glow of the five · retract: tail retraction
export function indexRing(ctx, t, o) {
  const k = clamp(o.k ?? 1);
  const x = lerp(SCREEN_RING.x, RING.x, sineIO(k)), y = lerp(SCREEN_RING.y, RING.y, sineIO(k)), r = lerp(SCREEN_RING.r, RING.r, expoOut(k)), lw = lerp(PH.h * .5 * .88 * .07, RING.w, expoOut(k));
  const ret = clamp(o.retract ?? 0);
  ctx.save(); ctx.lineCap = 'butt';
  // the cool rest of the index (everything else)
  const a0 = -Math.PI / 2 + Math.PI * 2 * .27, a1 = -Math.PI / 2 + Math.PI * 2;
  if (ret < 1) { ctx.strokeStyle = rgba(COL.cool2, .6); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(x, y, r, lerp(a0, a1, ret), a1); ctx.stroke(); }
  // the five
  SEG.forEach(([s0, s1], i) => {
    if (o.skip === i) return;
    const g = clamp(o.seg?.[i] ?? 0), gone = clamp((ret - .2 * i / 5) * 1.25);
    if (gone >= 1) return;
    const col = mixHex(COL.cool2, P.halo0, g);
    if (g > .05) { ctx.strokeStyle = rgba(P.halo1, .22 * g); ctx.lineWidth = lw * 2.6; ctx.beginPath(); ctx.arc(x, y, r, lerp(s0, s1, gone), s1); ctx.stroke(); }
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(x, y, r, lerp(s0, s1, gone), s1); ctx.stroke();
  });
  ctx.restore();
  return { x, y, r, lw };
}
// the detached segment (7.06): an arc piece that flies, shrinks and flips into a tiny banknote
export function flyingNote(ctx, t, u, from, to, flipU, o = {}) {
  const e = sineIO(u), x = lerp(from[0], to[0], e), y = lerp(from[1], to[1], e) - Math.sin(Math.PI * e) * 14;
  const w = lerp(o.w0 ?? 9, o.w1 ?? 13, e);
  const front = (c, sx) => {
    // the warm segment, straightened into a small bar of light
    ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(.6, -.15, e)); ctx.scale(sx, 1);
    const p = new Path2D(); p.roundRect(-w / 2, -w * .23, w, w * .46, w * .06);
    E.glowFill(ctx, p, w * .5, .4, P.halo1);
    ctx.fillStyle = lin(ctx, 0, -w * .23, 0, w * .23, [[0, P.halo0], [1, P.shade0]]); ctx.fill(p); ctx.restore();
  };
  const back = (c, sx) => B.banknote(ctx, x, y, w, lerp(.6, -.15, e), { simple: true, sx, glow: .35 });
  B.flip(ctx, flipU, x, y, w, w * .46, front, back, { glint: .6 });
  return [x, y];
}

// ================================================================================================= the street (7.07 · 7.08)
// houses along the near shore right of yours; the parsonage among them (older: small panes, a candle). win = [x0, y0, x1, y1]
export const STREET = [
  { x0: 3030, x1: 3330, eave: 560, peak: 470, win: [3110, 640, 3250, 740] },
  { x0: 3400, x1: 3700, eave: 540, peak: 440, win: [3470, 620, 3630, 730] },
  { par: true, x0: 3800, x1: 4320, eave: 470, peak: 330, win: [3900, 560, 4220, 760] },
  { x0: 4450, x1: 4750, eave: 560, peak: 450, win: [4520, 640, 4680, 740] },
  { x0: 4820, x1: 5160, eave: 520, peak: 400, win: [4890, 600, 5090, 720] },
  { x0: 5230, x1: 5500, eave: 580, peak: 480, win: [5290, 650, 5440, 750] },
  { x0: 5580, x1: 5900, eave: 540, peak: 430, win: [5650, 620, 5830, 730] },
  { x0: 5980, x1: 6300, eave: 560, peak: 450, win: [6050, 640, 6230, 740] },
];
export const PARS = STREET[2];
// a house silhouette (sw = how far the night has swallowed it: colours → the sky, rim → off; 1 = not drawn)
export function houseBody(ctx, hs, sw) {
  if (sw >= .995) return;
  const sky = P.night1, m = (c) => mixHex(c, sky, sw);
  const p = new Path2D(); p.moveTo(hs.x0 - 20, hs.eave); p.lineTo((hs.x0 + hs.x1) / 2, hs.peak); p.lineTo(hs.x1 + 20, hs.eave); p.lineTo(hs.x1, hs.eave); p.lineTo(hs.x1, GROUND + 4); p.lineTo(hs.x0, GROUND + 4); p.lineTo(hs.x0, hs.eave); p.closePath();
  if (hs.par) p.rect(hs.x1 - 120, hs.peak + 20, 40, 120);   // the chimney
  ctx.fillStyle = lin(ctx, 0, hs.peak, 0, GROUND, [[0, m(mixHex(P.ind2, P.blue1, .14))], [1, m(P.night1)]]); ctx.fill(p);
  if (sw < 1) { ctx.strokeStyle = rgba(P.blue0, .5 * (1 - sw)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hs.x0 - 20, hs.eave); ctx.lineTo((hs.x0 + hs.x1) / 2, hs.peak); ctx.lineTo(hs.x1 + 20, hs.eave); ctx.stroke(); }
  const [x0, y0, x1, y1] = hs.win;
  ctx.fillStyle = m(P.night0); ctx.fillRect(x0 - 8, y0 - 8, x1 - x0 + 16, y1 - y0 + 16);
}
// a modern window's light (k 0 = dark glass, 1 = lit) — the warm rect that later lifts as a card
export function windowLight(ctx, rect, k, t, seed = 0, sw = 0) {
  const [x0, y0, x1, y1] = rect, w = x1 - x0, h = y1 - y0;
  if (k <= 0 && sw >= .995) return;
  ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .5), P.night1, sw); ctx.fillRect(x0, y0, w, h);
  if (k <= 0) return;
  const fl = 1 + .02 * Math.sin(t * 2.3 + seed);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
  ctx.fillStyle = rad(ctx, x0 + w * .5, y0 + h * .35, Math.max(w, h) * .9 * fl, [[0, rgba(P.core1, .95 * k)], [.4, rgba(P.halo0, .85 * k)], [1, rgba(P.shade0, .7 * k)]]); ctx.fillRect(x0, y0, w, h);
  ctx.restore();
  halo(ctx, x0 + w / 2, y0 + h / 2, Math.max(w, h) * 1.1, .18 * k, P.halo1, P.halo0);
}
// the parsonage window: candle light, three sisters, the railway paper (clip to the window)
export function parsonageRoom(ctx, t, k, paper, sw = 0) {
  const [x0, y0, x1, y1] = PARS.win, w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.fillRect(x0, y0, w, h);
  if (k > 0) {
    const fl = 1 + .05 * Math.sin(t * 7.1) * Math.sin(t * 3.3) + .02 * Math.sin(t * 11);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, cx + 44, y1 - 70, 330 * fl, [[0, rgba(P.halo1, .95 * k)], [.3, rgba(P.halo0, .5 * k)], [.7, rgba(P.shade0, .28 * k)], [1, rgba(P.shade1, .1 * k)]]); ctx.fillRect(x0, y0, w, h);
    ctx.restore();
  }
  // the sisters: three seated silhouettes round the table (heads above the table edge), the middle one holds the paper up
  const lit = .25 + .75 * k;
  const sis = [[cx - 98, 1, .25], [cx, -1, .05], [cx + 98, -1, -.2]];
  for (const [x, dir, look] of sis) E.person(ctx, x, y1 + 60, 230, { dir, look: look + .03 * Math.sin(t * .7 + x), long: true, lanyard: false, light: x < cx + 44 ? 1 : -1, rim: mixHex(P.core1, P.night1, 1 - lit) });
  // the table and the candle
  ctx.fillStyle = mixHex(P.night1, P.shade1, .35 * k); ctx.fillRect(x0 - 10, y1 - 40, w + 20, 44);
  ctx.fillStyle = rgba(P.halo1, .45 * k); ctx.fillRect(x0, y1 - 41, w, 2);
  ctx.fillStyle = COL.paper1; ctx.fillRect(cx + 40, y1 - 64, 8, 24);
  if (k > 0) { const fl = 1 + .1 * Math.sin(t * 9.3); halo(ctx, cx + 44, y1 - 70, 46 * fl, .7 * k, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.ellipse(cx + 44, y1 - 72, 3, 6 * fl, 0, 0, 6.29); ctx.fill(); }
  // the railway paper, held up in the middle (glows on "railway paper")
  if (paper > 0) B.certificate(ctx, cx - 6, y1 - 92, 92, -.06 + .02 * Math.sin(t * .8), { lum: .45 + .55 * k, a: 1 });
  ctx.restore();
  // the small panes (muntins) over the glass + the frame
  ctx.fillStyle = mixHex(P.night0, P.night1, sw); ctx.fillRect(cx - 4, y0, 8, h); ctx.fillRect(x0, y0 + h / 2 - 4, w, 8);
  ctx.fillRect(x0 + w / 4 - 3, y0, 6, h); ctx.fillRect(x0 + w * .75 - 3, y0, 6, h);
}

// a bidder card: a window's light rect lifted out of its house, its light settling into lamp-lit paper, on a stick
// p = {x, y, w, h} centre + size · paper 0..1 (light → paper) · stick (0..1 drawn, from the card down)
export function bidCard(ctx, t, p, paper, stick, glow = 0) {
  const { x, y, w, h } = p;
  if (stick > 0) { ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(x - 3, y + h / 2, 6, 420 * stick); }
  const r = new Path2D(); r.roundRect(x - w / 2, y - h / 2, w, h, 4);
  if (glow > 0) E.glowFill(ctx, r, w * .4, .4 * glow, P.halo1);
  if (paper < 1) {
    ctx.fillStyle = rad(ctx, x, y - h * .15, Math.max(w, h) * .9, [[0, P.core1], [.4, P.halo0], [1, P.shade0]]); ctx.fill(r);
  }
  if (paper > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y + h / 2 - h * paper, w, h * paper); ctx.clip(); B.paperFill(ctx, r, { lum: .75 + .25 * glow, seed: 663 + Math.round(x) % 7, fibre: 120 }); ctx.restore(); }
}

// the far bubble (7.06 → 7.08): THE motif, far up in the night over the street
export const BUB = { x: 4700, y: -380, r: 330 };
