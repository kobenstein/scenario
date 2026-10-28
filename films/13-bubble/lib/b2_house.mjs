// Film 13 · B2 · your house on the lake shore (c06 end → c07 → c08 8.10): the façade, the lit room seen through its big window
// (cut-away: the window is the room), the meter, the lamp (hero), the table, you, the envelope, the phone; the parsonage and the
// neighbours' houses further along the shore. All in DESIGN coords of the focus card (Space A of the take).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as B from './bubble_kit.mjs';
import { GROUND } from './b2_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, lin, rad, halo, dust, prng } = E;
const { COL } = B;

export const HOUSE = { x0: 2150, x1: 2950, eave: 400, peak: 262, y: GROUND };
export const WIN = { x0: 2230, x1: 2870, y0: 470, y1: 800 };
export const LAMP = { x: 2600, y: 560 };
export const TABLE = { y: 742, yf: 712, x0: 2420, x1: 2820, inset: 28, bottom: 800 };
export const YOU = { x: 2590, y: 846, h: 240 };
export const METER = { x: 2312, y: 606, R: 34, bw: 96, bh: 140 };
export const ENV = { x: 2486, y: 727, w: 74, h: 30 };

// the dark night colour a silhouette takes when the night swallows it (k 0 = its own colour, 1 = the sky)
export const swallow = (col, k) => mixHex(col, P.night1, clamp(k));

// ---------- the meter: a round paper face with ticks and one needle (the dial match of 8.09 → 8.10 uses dialFace) ----------
export function dialFace(ctx, cx, cy, R, ang, t, o = {}) {
  const face = new Path2D(); face.arc(cx, cy, R, 0, Math.PI * 2);
  B.paperFill(ctx, face, { lum: o.lum ?? .95, seed: 641, lx: cx - R * .3, ly: cy - R * .4, r: R * 2.2, fibre: o.fibre ?? 900 });
  ctx.save(); ctx.strokeStyle = rgba(COL.ink2, .55); ctx.lineWidth = R * .02; ctx.lineCap = 'round';
  for (let i = 0; i <= 20; i++) {
    const q = Math.PI * (.75 + 1.5 * i / 20), r0 = R * (i % 5 ? .82 : .76);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(q) * r0, cy + Math.sin(q) * r0); ctx.lineTo(cx + Math.cos(q) * R * .9, cy + Math.sin(q) * R * .9); ctx.stroke();
  }
  if (o.band) {   // a band of the arc (0..1 of the sweep), warm: the share that must be paid
    ctx.strokeStyle = rgba(o.bandCol ?? P.shade0, .75); ctx.lineWidth = R * .07; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.arc(cx, cy, R * .68, Math.PI * .75, Math.PI * (.75 + 1.5 * o.band)); ctx.stroke();
  }
  // the needle (ink), a hub
  const q = Math.PI * (.75 + 1.5 * clamp(ang));
  ctx.strokeStyle = COL.ink; ctx.lineWidth = R * .035; ctx.beginPath(); ctx.moveTo(cx - Math.cos(q) * R * .12, cy - Math.sin(q) * R * .12); ctx.lineTo(cx + Math.cos(q) * R * .78, cy + Math.sin(q) * R * .78); ctx.stroke();
  ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(cx, cy, R * .07, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // the casing ring
  ctx.save(); ctx.strokeStyle = o.casing ?? mixHex(P.ind2, P.night1, .4); ctx.lineWidth = R * .16; ctx.beginPath(); ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = rgba(P.halo1, .35 * (o.rim ?? 1)); ctx.lineWidth = R * .02; ctx.beginPath(); ctx.arc(cx, cy, R * 1.0, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke(); ctx.restore();
}
// the same face, normalised: drawn as a 220-radius face scaled to R, so two dials of any size give the SAME picture when the camera
// shows them at the same screen radius (the dial match 8.09 → 8.10)
export function dialN(ctx, cx, cy, R, ang, t, o = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(R / 220, R / 220); dialFace(ctx, 0, 0, 220, ang, t, { fibre: 900, ...o }); ctx.restore();
}
// the household meter: box, round face, the turning disc in its slot (spin = rad), a counter strip
export function meter(ctx, t, o = {}) {
  const { x, y, R, bw, bh } = METER, lum = o.lum ?? 1;
  ctx.save();
  ctx.fillStyle = lin(ctx, 0, y - bh * .38, 0, y + bh * .62, [[0, mixHex(P.ind2, P.blue1, .3 * lum)], [1, P.night1]]);
  ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh * .38, bw, bh, 8); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .35 * lum); ctx.fillRect(x - bw / 2 + 6, y - bh * .38, bw - 12, 2);
  // the disc slot (a dark window) with the disc edge and its black mark running past
  const sy = y + R + 18, sw = 44;
  ctx.fillStyle = P.night0; ctx.fillRect(x - sw / 2, sy - 5, sw, 10);
  ctx.fillStyle = mixHex(COL.paper2, P.night1, .3); ctx.fillRect(x - sw / 2 + 2, sy - 2, sw - 4, 4);
  const m = ((o.spin ?? 0) % (Math.PI * 2)) / (Math.PI * 2);
  ctx.fillStyle = COL.ink; ctx.fillRect(x - sw / 2 + 2 + m * (sw - 10), sy - 2, 6, 4);
  ctx.restore();
  dialN(ctx, x, y, R, o.needle ?? .3, t, { lum: o.faceLum ?? (.85 * lum + .1) });
  // the cable: down the wall and out through the floor (o.cable = drawn share for the carrier line)
}

// ---------- the room (seen through the big window; clip to the window) ----------
export function room(ctx, t, s = {}) {
  const lamp = clamp(s.lamp ?? 1), fl = 1 + .012 * Math.sin(t * 3.1) * Math.sin(t * 1.3);
  const cl = s.clip ?? [WIN.x0, WIN.y0, WIN.x1, WIN.y1];
  ctx.save(); ctx.beginPath(); ctx.rect(cl[0], cl[1], cl[2] - cl[0], cl[3] - cl[1]); ctx.clip();
  // back wall: dark, warm where the lamp reaches
  ctx.fillStyle = lin(ctx, 0, WIN.y0, 0, WIN.y1, [[0, mixHex(P.ind2, P.night1, .3)], [1, P.night1]]); ctx.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
  if (lamp > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, LAMP.x, LAMP.y + 30, 520 * fl, [[0, rgba(P.halo1, .55 * lamp)], [.3, rgba(P.shade0, .32 * lamp)], [.75, rgba(P.shade1, .08 * lamp)], [1, rgba(P.shade1, 0)]]);
    ctx.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); ctx.restore();
  }
  // a skirting line and the floor
  ctx.fillStyle = mixHex(P.night1, P.night0, .4); ctx.fillRect(WIN.x0, 776, WIN.x1 - WIN.x0, 30);
  ctx.fillStyle = rgba(P.shade0, .25 * lamp); ctx.fillRect(WIN.x0, 776, WIN.x1 - WIN.x0, 1.5);
  // the meter on the left wall + its cable down to the floor
  ctx.strokeStyle = mixHex(P.night1, P.ind2, .5); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(METER.x, METER.y + METER.bh * .62); ctx.lineTo(METER.x, 790); ctx.stroke();
  meter(ctx, t, { spin: s.spin ?? t * 2, needle: s.needle ?? .3, lum: .55 + .45 * lamp, faceLum: s.faceLum });
  // the lamp: cord, shade, bulb (THE light of the room)
  ctx.strokeStyle = P.night0; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(LAMP.x, WIN.y0); ctx.lineTo(LAMP.x, LAMP.y - 12); ctx.stroke();
  const shade = new Path2D(); shade.moveTo(LAMP.x - 14, LAMP.y - 14); shade.lineTo(LAMP.x + 14, LAMP.y - 14); shade.lineTo(LAMP.x + 36, LAMP.y + 10); shade.lineTo(LAMP.x - 36, LAMP.y + 10); shade.closePath();
  ctx.fillStyle = lin(ctx, 0, LAMP.y - 14, 0, LAMP.y + 10, [[0, mixHex(P.ind2, P.shade0, .25 * lamp)], [1, mixHex(P.night1, P.shade0, .5 * lamp)]]); ctx.fill(shade);
  ctx.fillStyle = mixHex(P.night1, P.core0, lamp); ctx.beginPath(); ctx.ellipse(LAMP.x, LAMP.y + 11, 20, 5, 0, 0, Math.PI * 2); ctx.fill();
  halo(ctx, LAMP.x, LAMP.y + 14, 160 * fl, .55 * lamp, P.halo1, P.core0);
  // the table (seen a little from above), its cloth hides your legs
  const tp = new Path2D(); tp.moveTo(TABLE.x0 + TABLE.inset, TABLE.yf); tp.lineTo(TABLE.x1 - TABLE.inset, TABLE.yf); tp.lineTo(TABLE.x1, TABLE.y); tp.lineTo(TABLE.x0, TABLE.y); tp.closePath();
  // you first (behind the table)
  const hands = you(ctx, t, s);
  ctx.fillStyle = lin(ctx, 0, TABLE.yf, 0, TABLE.y, [[0, mixHex(P.ind2, P.shade0, .3 * lamp)], [1, mixHex(P.ind2, P.shade0, .5 * lamp)]]); ctx.fill(tp);
  ctx.fillStyle = lin(ctx, 0, TABLE.y, 0, TABLE.bottom, [[0, mixHex(P.ind2, P.shade1, .22 * lamp)], [1, P.night1]]); ctx.fillRect(TABLE.x0, TABLE.y, TABLE.x1 - TABLE.x0, TABLE.bottom - TABLE.y);
  ctx.fillStyle = rgba(P.halo1, .4 * lamp); ctx.fillRect(TABLE.x0, TABLE.y - 1, TABLE.x1 - TABLE.x0, 2);
  // the envelope on the table (the bill); s.env 0..1 drawn, s.envLum
  if ((s.env ?? 1) > 0) envelope(ctx, ENV.x, ENV.y, ENV.w, ENV.h, { lum: .55 + .45 * lamp, glow: s.envGlow ?? 0, a: s.env ?? 1 });
  // the hand in front of the table edge: the phone / the letter / the note are drawn by the caller with the returned hands
  ctx.restore();
  return hands;
}
function you(ctx, t, s) {
  const br = .5 + .5 * Math.sin(t * 1.4);
  const lift = clamp(s.lift ?? 0);   // 0 hands on the table · 1 the right hand raised before the face (phone)
  const armR = [lerp(.75 + .02 * br, 1.05, lift), lerp(1.55, 2.75, lift)], armL = [lerp(.62 + .02 * br, .7, s.liftL ?? 0), lerp(1.45, 2.2, s.liftL ?? 0)];
  E.castShadow(ctx, YOU.x, TABLE.yf + 4, 40, 60, Math.PI * .5, .0);
  return E.du(ctx, YOU.x, YOU.y, YOU.h, { dir: -1, look: (s.look ?? .1) + .02 * Math.sin(t * .5), light: 1, armR, armL, lean: .05 + .01 * br, hood: s.hood ?? false });
}
// an envelope lying on the table (a parallelogram of paper with its flap line); also used upright in the grid of 8.11
export function envelope(ctx, x, y, w, h, o = {}) {
  const p = new Path2D(), sk = o.skew ?? 8; p.moveTo(x - w / 2 + sk, y - h / 2); p.lineTo(x + w / 2 + sk, y - h / 2); p.lineTo(x + w / 2 - sk, y + h / 2); p.lineTo(x - w / 2 - sk, y + h / 2); p.closePath();
  if (o.glow) E.glowFill(ctx, p, w * .3, .45 * o.glow, P.halo1);
  B.paperFill(ctx, p, { lum: o.lum ?? 1, a: o.a ?? 1, seed: 651, fibre: 200 });
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.strokeStyle = rgba(COL.ink2, .45); ctx.lineWidth = Math.max(1, w * .02);
  ctx.beginPath(); ctx.moveTo(x - w / 2 + sk, y - h / 2); ctx.lineTo(x + sk * .1, y + h * .1); ctx.lineTo(x + w / 2 + sk, y - h / 2); ctx.stroke(); ctx.restore();
}

// ---------- the façade (the house itself, on the near shore), the window frame ----------
export function facade(ctx, t, s = {}) {
  const sw = s.swallow ?? 0, rim = (s.rim ?? 1) * (1 - sw);
  if (sw >= .995) return;
  const body = new Path2D(); body.moveTo(HOUSE.x0 - 30, HOUSE.eave); body.lineTo((HOUSE.x0 + HOUSE.x1) / 2, HOUSE.peak); body.lineTo(HOUSE.x1 + 30, HOUSE.eave); body.lineTo(HOUSE.x1, HOUSE.eave); body.lineTo(HOUSE.x1, HOUSE.y + 4); body.lineTo(HOUSE.x0, HOUSE.y + 4); body.lineTo(HOUSE.x0, HOUSE.eave); body.closePath();
  ctx.fillStyle = lin(ctx, 0, HOUSE.peak, 0, HOUSE.y, [[0, swallow(mixHex(P.ind2, P.blue1, .2), sw)], [1, swallow(P.night1, sw)]]); ctx.fill(body);
  if (rim > 0) { ctx.strokeStyle = rgba(P.blue0, .7 * rim); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(HOUSE.x0 - 30, HOUSE.eave); ctx.lineTo((HOUSE.x0 + HOUSE.x1) / 2, HOUSE.peak); ctx.lineTo(HOUSE.x1 + 30, HOUSE.eave); ctx.stroke(); }
  // the window frame around the room
  ctx.strokeStyle = swallow(P.night0, sw); ctx.lineWidth = 12; ctx.strokeRect(WIN.x0 - 6, WIN.y0 - 6, WIN.x1 - WIN.x0 + 12, WIN.y1 - WIN.y0 + 12);
  ctx.fillStyle = swallow(mixHex(P.ind2, P.blue1, .35), sw); ctx.fillRect(WIN.x0 - 16, WIN.y1 + 6, WIN.x1 - WIN.x0 + 32, 8);   // the sill
}
// the window glass light falling out on the ground in front of the house
export function windowSpill(ctx, k) { if (k > 0) E.lightPool(ctx, WIN.x0 + 40, WIN.x1 - 40, GROUND + 6, 120, 120, .35 * k); }

// ---------- the phone screen of 7.04 (dark, readable): DEFAULT FUND · the fund ring · the default check ----------
export function appScreen(o) {
  return (ctx, w, h) => {
    ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.night1, COL.coolDeep, .5)], [1, P.night1]]); ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = COL.cool; ctx.font = `600 ${(w * .13).toFixed(2)}px Inter`; ctx.textAlign = 'center';
    ctx.fillText('DEFAULT', w / 2, h * .13); ctx.fillText('FUND', w / 2, h * .13 + w * .15);
    // the fund ring (the carrier of 7.05): cool ring, its warm part = the five companies
    const cx = w / 2, cy = h * .5, r = w * .3, lw = w * .07, k = o.ring ?? 1;
    if (k > 0) {
      ctx.lineWidth = lw; ctx.strokeStyle = rgba(COL.cool2, .55 * k); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = rgba(P.halo0, .9 * k * (o.warm ?? 0)); ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * .27); ctx.stroke();
    }
    // the default check box
    const bx = w * .2, by = h * .78, bs = w * .16;
    ctx.strokeStyle = rgba(COL.cool, .85); ctx.lineWidth = w * .022; ctx.strokeRect(bx, by, bs, bs);
    ctx.fillStyle = rgba(COL.cool, .8); ctx.font = `600 ${(w * .095).toFixed(2)}px Inter`; ctx.textAlign = 'left'; ctx.fillText('BY DEFAULT', bx + bs * 1.35, by + bs * .78);
    const ck = clamp(o.check ?? 0);
    if (ck > 0) {
      const pts = [[bx + bs * .18, by + bs * .52], [bx + bs * .42, by + bs * .8], [bx + bs * .92, by + bs * .1]];
      B.inkLine(ctx, pts, ck, { col: P.halo0, w: w * .035 });
    }
  };
}
