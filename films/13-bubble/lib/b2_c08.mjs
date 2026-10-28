// Film 13 · B2 · c08 primitives of the one take (Space A design coords). The take (lib/b2_take.mjs) owns camera, times, choreography.
//   hall      the lamp over the podium, the lots (cable drums, server racks) with LOT tags, the hammer
//   explainer Global Crossing bars, the flow, the 1844 parchment + wax seal, roof · seat · penny glyphs, the chip, the permit form
//   Ohio      the gauge (dialN, so it matches your meter), the data center, the calendar strip
//   end       the fence with the PUBLIC MONEY sign, the closed door (an exact replica of S.plateDoor in design coords)
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as B from './bubble_kit.mjs';
import * as S from './bubble_seams.mjs';
import * as G from './b2_kit.mjs';
import * as Hs from './b2_house.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, halo, dust, prng, glowText } = E;
const { COL } = B;
const { GROUND } = G;

// ================================================================================================= the hall (8.01)
export const HC = { x: 4700, y: 540 };
export const LAMP8 = { x: HC.x, y: 300 };
export const LOTS = [
  { kind: 'drum', x: 4170, r: 66 }, { kind: 'drum', x: 4350, r: 58 },
  { kind: 'rack', x: 5000, w: 96, h: 214 }, { kind: 'rack', x: 5160, w: 96, h: 230 },
];
// a lot tag: paper on a string (cx, cy = tag centre), sway angle
export function lotTag(ctx, cx, cy, sway, o = {}) {
  const w = o.w ?? 92, h = o.h ?? 50, lum = o.lum ?? .8;
  ctx.save(); ctx.translate(cx, cy - h / 2 - 26); ctx.rotate(sway);
  ctx.strokeStyle = rgba(COL.paper2, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 26); ctx.stroke();
  const p = new Path2D(); p.moveTo(-w / 2 + 12, 26); p.lineTo(w / 2, 26); p.lineTo(w / 2, 26 + h); p.lineTo(-w / 2 + 12, 26 + h); p.lineTo(-w / 2, 26 + h / 2); p.closePath();
  B.paperFill(ctx, p, { lum, seed: 811, fibre: 60 });
  ctx.fillStyle = COL.ink2; ctx.beginPath(); ctx.arc(-w / 2 + 14, 26 + h / 2, 4, 0, 6.29); ctx.fill();
  glowText(ctx, 'LOT', 6, 26 + h * .72, { size: 34, weight: 700, col: COL.ink, glow: false, align: 'center' });
  ctx.restore();
}
export function lot(ctx, t, L, k, lum) {
  if (k <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(L.x - 200, 300, 400, GROUND - 300); ctx.clip(); ctx.translate(0, 260 * (1 - k));
  if (L.kind === 'drum') {
    const cy = GROUND - L.r;
    ctx.fillStyle = rad(ctx, L.x - L.r * .3, cy - L.r * .4, L.r * 1.6, [[0, mixHex(P.ind2, P.halo1, .18 * lum)], [1, P.night1]]); ctx.beginPath(); ctx.arc(L.x, cy, L.r, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.halo1, .35 * lum); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(L.x, cy, L.r * .62, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(L.x, cy, L.r * .2, 0, 6.29); ctx.fill();
    ctx.strokeStyle = mixHex(P.ind2, P.night1, .3); ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i < 4; i++) ctx.arc(L.x, cy, L.r * (.32 + i * .07), Math.PI * 1.2, Math.PI * 1.9); ctx.stroke();
  } else {
    const y0 = GROUND - L.h;
    ctx.fillStyle = lin(ctx, 0, y0, 0, GROUND, [[0, mixHex(P.ind2, P.halo1, .14 * lum)], [1, P.night1]]); ctx.fillRect(L.x - L.w / 2, y0, L.w, L.h);
    ctx.fillStyle = rgba(P.halo1, .4 * lum); ctx.fillRect(L.x - L.w / 2, y0, L.w, 2);
    for (let j = 0; j < 9; j++) { ctx.fillStyle = rgba(COL.coolDeep, .7); ctx.fillRect(L.x - L.w / 2 + 10, y0 + 16 + j * 22, L.w - 20, 12); }   // dark, unplugged
  }
  ctx.restore();
}
export function podium(ctx, t, k, lum) {
  if (k <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(HC.x - 200, 400, 400, GROUND - 400); ctx.clip(); ctx.translate(0, 200 * (1 - k));
  const p = new Path2D(); p.moveTo(HC.x - 84, 690); p.lineTo(HC.x + 84, 690); p.lineTo(HC.x + 100, GROUND); p.lineTo(HC.x - 100, GROUND); p.closePath();
  ctx.fillStyle = lin(ctx, 0, 690, 0, GROUND, [[0, mixHex(P.ind2, P.shade0, .35 * lum)], [1, P.night1]]); ctx.fill(p);
  ctx.fillStyle = rgba(P.halo1, .6 * lum); ctx.fillRect(HC.x - 92, 684, 184, 8);
  ctx.restore();
}
// the hammer on the podium: up (raise 0..1), the strike happens in the take
export function hammer(ctx, ang, lum) {
  ctx.save(); ctx.translate(HC.x + 40, 680); ctx.rotate(-ang);
  ctx.fillStyle = mixHex(P.shade1, P.halo0, .4 * lum); ctx.fillRect(-70, -4, 70, 8);
  ctx.fillStyle = mixHex(P.shade0, P.halo0, .5 * lum); ctx.beginPath(); ctx.roundRect(-92, -15, 30, 30, 5); ctx.fill();
  ctx.restore();
  ctx.fillStyle = mixHex(P.night1, P.shade0, .4 * lum); ctx.fillRect(HC.x - 4, 676, 90, 8);   // the sounding block
}
export function hallLamp(ctx, t, k, drop) {
  // cord from the dark above, shade, bulb; k = lit; drop = how far it has come down (0 = out of the top)
  const y = lerp(-500, LAMP8.y, drop);
  ctx.strokeStyle = P.night0; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LAMP8.x, y - 2000); ctx.lineTo(LAMP8.x, y - 20); ctx.stroke();
  const sh = new Path2D(); sh.moveTo(LAMP8.x - 26, y - 22); sh.lineTo(LAMP8.x + 26, y - 22); sh.lineTo(LAMP8.x + 70, y + 16); sh.lineTo(LAMP8.x - 70, y + 16); sh.closePath();
  if (k > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const cone = new Path2D(); cone.moveTo(LAMP8.x - 66, y + 16); cone.lineTo(LAMP8.x + 66, y + 16); cone.lineTo(LAMP8.x + 340, GROUND); cone.lineTo(LAMP8.x - 340, GROUND); cone.closePath();
    ctx.fillStyle = lin(ctx, 0, y, 0, GROUND, [[0, rgba(P.halo1, .22 * k)], [1, rgba(P.shade0, .06 * k)]]); ctx.fill(cone);
    ctx.restore();
    E.lightPool(ctx, LAMP8.x - 300, LAMP8.x + 300, GROUND + 4, 160, 120, .4 * k);
  }
  ctx.fillStyle = lin(ctx, 0, y - 22, 0, y + 16, [[0, mixHex(P.ind2, P.shade0, .3 * k)], [1, mixHex(P.night1, P.shade0, .5 * k)]]); ctx.fill(sh);
  ctx.fillStyle = mixHex(P.night1, P.core0, k); ctx.beginPath(); ctx.ellipse(LAMP8.x, y + 17, 34, 7, 0, 0, 6.29); ctx.fill();
  if (k > 0) halo(ctx, LAMP8.x, y + 20, 220, .55 * k, P.halo1, P.core0);
}

// ================================================================================================= paper bars, flow (8.02 · 8.03)
export function paperBar(ctx, x, y, w, h, o = {}) {
  if (w < .5 || h < .5) return;
  const p = new Path2D(); p.roundRect(x, y, w, h, Math.min(4, h / 3, w / 3));
  if (o.glow) E.glowFill(ctx, p, 30, .35 * o.glow, P.halo1);
  B.paperFill(ctx, p, { lum: o.lum ?? .9, seed: 821, fibre: 200 });
}

// ================================================================================================= the 1844 parchment (8.04–8.08)
export const PCH = { x: 6000, y: 560, w: 1100, h: 680 };   // centre at scale 1; top edge = the roller
// u = how far unrolled (0..1, from the top), sc = scale about its centre's top, (cx, top) = where its top edge sits
export function parchment(ctx, cx, top, sc, u, o = {}) {
  const w = PCH.w * sc, h = PCH.h * sc * clamp(u);
  if (h < 1) return;
  const p = new Path2D(); p.rect(cx - w / 2, top, w, h);
  E.glowFill(ctx, p, 40 * sc, .18, P.halo1);
  ctx.save(); ctx.beginPath(); ctx.rect(cx - w / 2 - 2, top, w + 4, h); ctx.clip();
  const full = new Path2D(); full.rect(cx - w / 2, top, w, PCH.h * sc);
  B.paperFill(ctx, full, { lum: o.lum ?? .95, seed: 831, fibre: 1200, lx: cx - w * .2, ly: top + PCH.h * sc * .25 });
  // a ruled border
  ctx.strokeStyle = rgba(COL.ink2, .35); ctx.lineWidth = 2 * sc; ctx.strokeRect(cx - w / 2 + 24 * sc, top + 24 * sc, w - 48 * sc, PCH.h * sc - 48 * sc);
  ctx.restore();
  // the rollers (top fixed, bottom = the unrolling edge)
  ctx.fillStyle = mixHex(COL.paper2, P.shade1, .4); ctx.beginPath(); ctx.roundRect(cx - w / 2 - 14 * sc, top - 10 * sc, w + 28 * sc, 20 * sc, 10 * sc); ctx.fill();
  if (u < 1) { ctx.fillStyle = mixHex(COL.paper1, COL.paper2, .5); ctx.beginPath(); ctx.roundRect(cx - w / 2 - 6 * sc, top + h - 12 * sc, w + 12 * sc, 24 * sc, 12 * sc); ctx.fill(); }
}
// the wax seal (warm amber wax, an embossed ring). press: 0..1 (1 = pressed: flat disc + ring), blob before
export function seal(ctx, x, y, r, press, o = {}) {
  const sq = o.squash ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(1 + .12 * sq, 1 - .12 * sq);
  const rr = r * lerp(.62, 1, expoOut(press));
  const p = new Path2D(); const n = 14; for (let i = 0; i <= n; i++) { const q = i / n * Math.PI * 2, wob = 1 + (1 - press) * .12 * Math.sin(q * 3 + 1) + press * .05 * Math.sin(q * 7); const px = Math.cos(q) * rr * wob, py = Math.sin(q) * rr * wob; i ? p.lineTo(px, py) : p.moveTo(px, py); } p.closePath();
  E.glowFill(ctx, p, r * .5, .3 * (o.glow ?? .5), P.halo1);
  ctx.fillStyle = rad(ctx, -rr * .3, -rr * .35, rr * 1.6, [[0, mixHex(P.shade0, P.halo0, .35)], [.45, P.shade1], [1, mixHex(P.shade1, P.night0, .45)]]); ctx.fill(p);
  if (press > .3) {
    const k = smooth(span(press, .3, 1));
    ctx.strokeStyle = rgba(P.shade1, .7 * k); ctx.lineWidth = r * .08; ctx.beginPath(); ctx.arc(0, 0, rr * .66, 0, 6.29); ctx.stroke();
    ctx.strokeStyle = rgba(P.core1, .45 * k); ctx.lineWidth = r * .04; ctx.beginPath(); ctx.arc(-r * .02, -r * .03, rr * .66, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke();
    if (o.chip) { ctx.fillStyle = rgba(P.shade1, .8 * k); ctx.fillRect(-rr * .26, -rr * .26, rr * .52, rr * .52); }
  }
  ctx.restore();
}
// ink glyphs on the parchment: a roof, a seat (drawn: u), sizes ~ s
export const roofPts = (x, y, s) => [[x - s, y + s * .2], [x - s * .9, y + s * .2], [x, y - s * .55], [x + s * .9, y + s * .2], [x + s, y + s * .2]];
export const seatPts = (x, y, s) => [[x - s * .45, y - s * .7], [x - s * .45, y + s * .25], [x + s * .5, y + s * .25], [x + s * .5, y + s * .75], [x + s * .5, y + s * .25], [x - s * .45, y + s * .25], [x - s * .45, y + s * .75]];
// the penny (copper-amber coin with a "1d" stamp) / its back: a glowing chip
export function penny(ctx, x, y, r, sx = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1);
  ctx.fillStyle = rad(ctx, -r * .3, -r * .35, r * 1.5, [[0, P.core1], [.35, P.halo0], [1, P.shade0]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.shade1, .7); ctx.lineWidth = r * .08; ctx.beginPath(); ctx.arc(0, 0, r * .8, 0, 6.29); ctx.stroke();
  if (Math.abs(sx) > .3) glowText(ctx, '1d', 0, r * .3, { size: r * .9, serif: true, col: P.shade1, glow: false, align: 'center' });
  ctx.restore();
}
export function chip(ctx, x, y, r, sx = 1, o = {}) {
  const g = o.glow ?? 1, s = r * 1.5;
  ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1);
  halo(ctx, 0, 0, r * 3.2, .35 * g, COL.cool2, COL.cool);
  ctx.strokeStyle = mixHex(COL.cool2, P.night1, .2); ctx.lineWidth = r * .09; ctx.lineCap = 'round';
  for (let i = -2; i <= 2; i++) { const d = i * s * .28; ctx.beginPath(); ctx.moveTo(d, -s * .62); ctx.lineTo(d, -s * .82); ctx.moveTo(d, s * .62); ctx.lineTo(d, s * .82); ctx.moveTo(-s * .62, d); ctx.lineTo(-s * .82, d); ctx.moveTo(s * .62, d); ctx.lineTo(s * .82, d); ctx.stroke(); }
  ctx.fillStyle = lin(ctx, 0, -s * .6, 0, s * .6, [[0, mixHex(COL.coolDeep, COL.cool2, .5)], [1, COL.coolDeep]]); ctx.beginPath(); ctx.roundRect(-s * .6, -s * .6, s * 1.2, s * 1.2, s * .1); ctx.fill();
  ctx.fillStyle = rad(ctx, 0, 0, s * .5, [[0, P.cream], [.4, COL.cool], [1, COL.cool2]]); ctx.beginPath(); ctx.roundRect(-s * .32, -s * .32, s * .64, s * .64, s * .05); ctx.fill();
  ctx.restore();
}
// the permit form of today: a paper sheet with ruled fields and a seal place (bottom right)
export const FORM = { w: 520, h: 640 };
export function form(ctx, cx, cy, sc = 1, o = {}) {
  const w = FORM.w * sc, h = FORM.h * sc, x0 = cx - w / 2, y0 = cy - h / 2;
  const p = new Path2D(); p.rect(x0, y0, w, h);
  E.glowFill(ctx, p, 30 * sc, .16, P.halo1);
  B.paperFill(ctx, p, { lum: .92, seed: 841, fibre: 500, lx: x0 + w * .3, ly: y0 + h * .2 });
  ctx.fillStyle = rgba(COL.ink2, .55); ctx.fillRect(x0 + 40 * sc, y0 + 50 * sc, w * .55, 14 * sc);
  for (let i = 0; i < 7; i++) { ctx.fillStyle = rgba(COL.ink2, .2); ctx.fillRect(x0 + 40 * sc, y0 + (120 + i * 52) * sc, w - 80 * sc, 3 * sc); ctx.fillStyle = rgba(COL.ink2, .32); ctx.fillRect(x0 + 40 * sc, y0 + (100 + i * 52) * sc, (w - 80 * sc) * (.25 + .5 * ((i * 37) % 10) / 10), 9 * sc); }
  ctx.strokeStyle = rgba(COL.ink2, .5); ctx.lineWidth = 2 * sc; ctx.setLineDash([6 * sc, 6 * sc]); ctx.beginPath(); ctx.arc(x0 + w - 110 * sc, y0 + h - 110 * sc, 62 * sc, 0, 6.29); ctx.stroke(); ctx.setLineDash([]);
  return [x0 + w - 110 * sc, y0 + h - 110 * sc];
}

// ================================================================================================= Ohio (8.09)
export const GAUGE = { x: 7300, y: 520, R: 230 };
export const DC8 = { x: 7700, y: 800, w: 560, h: 180 };
export function gaugeBody(ctx, t, ang, band, o = {}) {
  const { x, y, R } = GAUGE;
  ctx.save(); ctx.fillStyle = lin(ctx, 0, y - R * 1.3, 0, y + R * 1.3, [[0, mixHex(P.ind2, P.blue1, .3)], [1, P.night1]]); ctx.beginPath(); ctx.roundRect(x - R * 1.3, y - R * 1.3, R * 2.6, R * 2.75, 26); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .4); ctx.fillRect(x - R * 1.3 + 14, y - R * 1.3, R * 2.6 - 28, 3); ctx.restore();
  Hs.dialN(ctx, x, y, R, ang, t, { lum: .95, band, bandCol: P.halo0 });
  // the socket (bottom)
  ctx.fillStyle = P.night0; ctx.fillRect(x - 34, y + R * 1.3 + 8, 68, 30);
}
export function calendar(ctx, x0, y, n, k, t) {   // n cells, k = filled share (cells fill one by one)
  const cw = 40, gap = 8;
  for (let i = 0; i < n; i++) {
    const f = clamp(k * n - i), x = x0 + i * (cw + gap);
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(x, y, cw, cw);
    if (f > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x, y + cw * (1 - expoOut(f)), cw, cw * expoOut(f)); ctx.clip(); B.paperFill(ctx, (() => { const p = new Path2D(); p.rect(x, y, cw, cw); return p; })(), { lum: .9, seed: 851 + i, fibre: 0 }); ctx.fillStyle = rgba(COL.ink2, .6); ctx.fillRect(x, y, cw, 8); ctx.restore(); }
  }
}

// ================================================================================================= the end (8.11 · 8.12)
// the door of S.plateDoor, in design coords: plate point (X, Y) = design (X + OX, Y + OY)
export const OX = 2550 - 960, OY = 635 - 540;
export const DOORD = { x0: S.DOOR.x0 + OX, x1: S.DOOR.x1 + OX, y0: S.DOOR.y0 + OY, y1: S.DOOR.y1 + OY };
const RIV = (() => { const r = prng(1409), a = []; for (let i = 0; i < 16; i++) a.push([r(), r()]); return a; })();
// the plate's lamp light on the wall (k 0..1 = 1 exactly the plate)
export function doorLamp(ctx, t, k) {
  if (k <= 0) return;
  const br = .94 + .06 * Math.sin(t * 1.3), cx = (DOORD.x0 + DOORD.x1) / 2;
  ctx.fillStyle = rad(ctx, cx, DOORD.y0 - 60, 820, [[0, rgba(P.halo1, .4 * br * k)], [.4, rgba(P.shade0, .16 * br * k)], [1, rgba(P.night0, 0)]]); ctx.fillRect(OX - 3000, OY - 3000, W + 6000, H + 6000);
}
// the frame + door leaf in rect r = [x0, y0, x1, y1] (= DOORD at the end). leaf: share closed (from the left), lock: padlock drop 0..1
export function doorParts(ctx, t, r, o) {
  const [x0, y0, x1, y1] = r, w = x1 - x0, h = y1 - y0, br = .94 + .06 * Math.sin(t * 1.3), fk = o.frame ?? 1;
  // frame (the wall opening)
  ctx.fillStyle = mixHex(P.night0, mixHex(P.night0, P.ind0, .4), fk);
  ctx.fillRect(x0 - lerp(12, 26, fk), y0 - lerp(12, 26, fk), w + 2 * lerp(12, 26, fk), h + lerp(24, 40, fk));
  if (o.room) o.room(x0, y0, x1, y1);   // the room still visible where the leaf has not closed
  const lw = w * clamp(o.leaf ?? 1); if (lw <= .5) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, lw, h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.ind1, P.shade1, .25)], [.3, P.ind1], [1, P.ind0]]); ctx.fillRect(x0, y0, w, h);
  ctx.fillStyle = rgba(P.halo1, .5 * br); ctx.fillRect(x0, y0, w, 3);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x0 + 24, y0 + 30, w - 48, 4); ctx.fillRect(x0 + 24, y1 - 40, w - 48, 4);
  for (const [u, v] of RIV) { ctx.fillStyle = rgba(P.halo1, .25); ctx.beginPath(); ctx.arc(x0 + 14 + u * (w - 28), v < .5 ? y0 + 14 : y1 - 14, 3, 0, 6.29); ctx.fill(); }
  const hx = x1 - 70, hy = (y0 + y1) / 2;
  ctx.fillStyle = mixHex(P.shade0, P.ind1, .4); ctx.fillRect(hx - 8, hy - 50, 16, 100);
  ctx.restore();
  // the padlock: drops onto the handle and hangs (lock 1 = exactly the plate)
  const lk = o.lock ?? 1; if (lk <= 0) return;
  const dy = -260 * (1 - expoIn(clamp(lk / .7))) + (lk > .7 ? 6 * Math.sin((lk - .7) / .3 * Math.PI * 2) * (1 - (lk - .7) / .3) : 0);
  ctx.save(); ctx.translate(0, dy);
  ctx.strokeStyle = rgba(P.halo1, .8 * br); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(hx, hy + 52, 22, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = lin(ctx, hx - 32, hy + 52, hx + 32, hy + 104, [[0, P.halo0], [1, P.shade0]]); ctx.beginPath(); ctx.roundRect(hx - 32, hy + 52, 64, 54, 8); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .7); ctx.beginPath(); ctx.arc(hx, hy + 74, 6, 0, 6.29); ctx.fill(); ctx.fillRect(hx - 2, hy + 76, 4, 14);
  ctx.restore();
}
export function doorDust(ctx, t, k) { if (k > 0) dust(ctx, 1411, 60, (DOORD.x0 + DOORD.x1) / 2, DOORD.y0 + 120, 320, 160, t * .3, .3 * k, P.halo0); }

// the fence in front (low in the frame, wide gate in the middle; it leaves the frame as the camera pushes through)
export const FENCE = { top: 1192, h: 150, gx: 2550, gap: 1010, step: 44, n: 25, pw: 26 };
export const picketX = (i) => (i < FENCE.n ? FENCE.gx - FENCE.gap - (FENCE.n - 1 - i) * FENCE.step : FENCE.gx + FENCE.gap + (i - FENCE.n) * FENCE.step);
export function fenceFrame(ctx, k) {
  if (k <= 0) return;
  ctx.fillStyle = mixHex(P.ind2, P.night1, .2);
  for (const s of [-1, 1]) {
    const x = FENCE.gx + s * (FENCE.gap - 34);
    ctx.save(); ctx.beginPath(); ctx.rect(x - 30, FENCE.top - 20, 60, 400); ctx.clip(); ctx.fillRect(x - 15, FENCE.top - 12 + 220 * (1 - k), 30, 300); ctx.restore();
    ctx.fillStyle = rgba(P.halo1, .4 * k); ctx.fillRect(x - 15, FENCE.top - 12 + 220 * (1 - k), 30, 2); ctx.fillStyle = mixHex(P.ind2, P.night1, .2);
  }
  // the crossbar over the gate (the sign hangs from it)
  const cb = expoOut(k); ctx.fillStyle = mixHex(P.ind2, P.night1, .2);
  ctx.fillRect(FENCE.gx - (FENCE.gap - 34) * cb, FENCE.top - 24, 2 * (FENCE.gap - 34) * cb, 12);
  // the two rails run out from the posts (left and right)
  const rl = 1200 * expoOut(k);
  ctx.fillStyle = mixHex(P.ind2, P.night1, .35);
  ctx.fillRect(FENCE.gx - FENCE.gap + 20 - rl, FENCE.top + 30, rl, 8); ctx.fillRect(FENCE.gx + FENCE.gap - 20, FENCE.top + 30, rl, 8);
  ctx.fillRect(FENCE.gx - FENCE.gap + 20 - rl, FENCE.top + 104, rl, 8); ctx.fillRect(FENCE.gx + FENCE.gap - 20, FENCE.top + 104, rl, 8);
}
// the sign over the gate (hangs from two chains; swing)
export function gateSign(ctx, t, drop, swing) {
  // it unfolds down from the crossbar (rotates down about its chains' top: a hinge)
  if (drop <= 0) return;
  ctx.save(); ctx.translate(FENCE.gx, FENCE.top - 14); ctx.rotate(swing); ctx.scale(1, Math.max(.02, expoOut(clamp(drop)))); ctx.translate(0, 22);
  ctx.strokeStyle = rgba(COL.paper2, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-200, -22); ctx.lineTo(-200, 0); ctx.moveTo(200, -22); ctx.lineTo(200, 0); ctx.stroke();
  const p = new Path2D(); p.roundRect(-280, 0, 560, 104, 6);
  E.glowFill(ctx, p, 30, .25, P.halo1);
  B.paperFill(ctx, p, { lum: .95, seed: 861, fibre: 300 });
  glowText(ctx, 'PUBLIC MONEY', 0, 74, { size: 64, weight: 700, col: COL.ink, glow: false, align: 'center' });
  ctx.restore();
}
