// Film 24 · builder B3 · the habitats of c09–c11 (2.5D card sets in the Editorial-Nacht look; owned by B3).
// Every set is drawn with an E.cam3 camera c and designed as seen from its home camera (cam3(), 1920×1080) — except the shelf,
// which shares the barn's stage (it hangs above it: the camera rises out of the barn into it; SHELF_REF is its home camera).
// One warm hero light per set; animals and people alive (breath, blink, small moves); nothing fades in.
//   shelf(ctx, c, t)                         plant burgers and oat milk under a warm shelf light (9.02)
//   barnOutside(ctx, t, o)                   the barn from outside at night; its calls stay inside the walls (9.06), SCREEN space
//   recordKitchen(ctx, c, t, st)             1970 record player (tilts from a circle to the side view) → a kitchen today (9.07–9.08)
//   harbour(ctx, c, t, st)                   Iceland, June: midnight sun, a whaling ship leaves (9.09)
//   camp(ctx, c, t, st)                      Amboseli at dawn: Kilimanjaro, the elephant family, the camp, laptop, speaker (10.02–10.07)
//   court(ctx, c, t, st)                     a courtroom in New Zealand: bench, judge, the whale recording, the ship outside (10.09–10.12)
//   farmKitchen(ctx, c, t, st)               Iowa, evening: the barn through the window, the table, the dog under it (11.01–11.04)
//   room(ctx, c, t, st)                      a room full of people; the new voice is a line of light (11.07–11.08)
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import { cardRef } from './f24_b3_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng } = E;
const TAU = Math.PI * 2, F0 = E.F0;
const card = E.card;

// shared painting helpers ---------------------------------------------------------------------------------------------------------
function slab(ctx, x, y, w, h, top, bot, rim = null, r = 0) {   // a flat block: vertical grain gradient, lit top edge
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, top], [1, bot]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
  if (rim) { ctx.fillStyle = rim; ctx.fillRect(x + r * .5, y, w - r, Math.max(2, Math.min(4, h * .2))); }
}
function wallFill(ctx, top, mid, bot, x0 = -3600, x1 = W + 3600, y0 = -1600, y1 = H + 1600) { ctx.fillStyle = lin(ctx, 0, y0 + 1600, 0, H, [[0, top], [.55, mid], [1, bot]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
function cone(ctx, x, y, w0, w1, len, a) {   // a lamp's soft light cone (additive)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, y, 0, y + len, [[0, rgba(P.halo1, a)], [1, rgba(P.halo1, 0)]]);
  ctx.beginPath(); ctx.moveTo(x - w0, y); ctx.lineTo(x + w0, y); ctx.lineTo(x + w1, y + len); ctx.lineTo(x - w1, y + len); ctx.closePath(); ctx.fill(); ctx.restore();
}
function pendant(ctx, x, y, t, o = {}) {   // a hanging lamp: cord, shade, warm bulb, halo (the hero light)
  const lit = (o.lit ?? 1) * (1 + .02 * Math.sin(t * 2.1) + .01 * Math.sin(t * 5.3)), s = o.s ?? 1;
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(x, -1200); ctx.lineTo(x, y - 50 * s); ctx.stroke();
  if (o.cone !== false) cone(ctx, x, y + 6 * s, 60 * s, (o.spread ?? 700) * s, (o.len ?? 1100) * s, .18 * lit);
  halo(ctx, x, y + 12 * s, (o.halo ?? 560) * s * lit, .5 * lit, P.halo1, P.core1);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.beginPath(); ctx.moveTo(x - 26 * s, y - 52 * s); ctx.lineTo(x + 26 * s, y - 52 * s); ctx.lineTo(x + 78 * s, y + 6 * s); ctx.lineTo(x - 78 * s, y + 6 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(x - 78 * s, y + 3 * s, 156 * s, 4 * s);
  ctx.fillStyle = rad(ctx, x, y + 10 * s, 30 * s, [[0, P.core0], [.6, P.core1], [1, rgba(P.halo0, 0)]]); ctx.beginPath(); ctx.arc(x, y + 11 * s, 22 * s, 0, TAU); ctx.fill();
}
function underTable(ctx, x0, x1, top, floor) {   // the dark under a table: hides the legs of the people seated behind it
  ctx.fillStyle = lin(ctx, 0, top, 0, floor + 10, [[0, rgba(P.night0, .97)], [.8, rgba(P.night0, .9)], [1, rgba(P.night0, .5)]]);
  ctx.beginPath(); ctx.moveTo(x0 + 6, top + 10); ctx.lineTo(x1 - 6, top + 10); ctx.lineTo(x1 + 30, floor + 10); ctx.lineTo(x0 - 30, floor + 10); ctx.closePath(); ctx.fill();
}
function pool(ctx, x, y, rx, ry, a) {   // a light pool on a floor or table (additive)
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(1, ry / rx);
  ctx.fillStyle = rad(ctx, 0, 0, rx, [[0, rgba(P.halo1, a)], [.6, rgba(P.shade0, a * .35)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-rx, -rx, rx * 2, rx * 2); ctx.restore();
}
const STARS = (() => { const r = prng(2451), s = []; for (let i = 0; i < 160; i++) s.push([r() * 3600 - 800, r() * 700 - 300, .6 + r() * 1.4, r() * 6.3]); return s; })();
function stars(ctx, t, a = 1, ymax = 520) { for (const [x, y, r, ph] of STARS) { if (y > ymax) continue; ctx.fillStyle = rgba(P.core1, a * (.25 + .25 * Math.sin(t * .8 + ph)) * clamp((ymax - y) / 200)); ctx.fillRect(x, y, r, r); } }
function shadowE(ctx, x, y, rx, a = .5) { ctx.fillStyle = rgba(P.night0, a); ctx.beginPath(); ctx.ellipse(x, y, rx, rx * .06, 0, 0, TAU); ctx.fill(); }

// =================================================================================================================== SHELF (9.02)
export const SHELF_UP = 1500;                                 // the shelf hangs SHELF_UP design px above the barn (camera rise)
export const SHELF_REF = E.aim(F0, 960, 540 - SHELF_UP, 1);  // its home camera on the barn stage
const PRODUCTS = (() => {   // oat milk cartons on the upper shelf, plant-burger packs on the lower one (seeded layout)
  const r = prng(2452), up = [], lo = [];
  for (let x = 180; x < 1760; x += 92 + r() * 10) up.push([x, .9 + r() * .2, r()]);
  for (let x = 170; x < 1700; x += 196 + r() * 14) lo.push([x, r(), r() < .5 ? 2 : 3]);
  return { up, lo };
})();
function carton(ctx, x, y, w, h, q) {   // a gable-top carton; feet at (x, y)
  const body = mixHex(P.cream, P.blue2, .42 + .12 * q), sh = mixHex(body, P.night1, .45);
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, sh], [.6, body], [1, mixHex(body, P.core1, .2)]]); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.beginPath(); ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x - w / 2 + 6, y - h - 22); ctx.lineTo(x + w / 2 - 6, y - h - 22); ctx.lineTo(x + w / 2, y - h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(body, P.night0, .25); ctx.fillRect(x - w / 2 + 6, y - h - 28, w - 12, 7);
  ctx.fillStyle = mixHex(P.blue0, P.ind1, .3); ctx.fillRect(x - w / 2, y - h * .42, w, h * .16);   // the band
  ctx.strokeStyle = mixHex(P.halo1, P.shade0, .3); ctx.lineWidth = 2.4; ctx.lineCap = 'round';   // an oat sprig
  const sx = x, sy = y - h * .62; ctx.beginPath(); ctx.moveTo(sx, sy + 18); ctx.lineTo(sx, sy - 16); ctx.stroke();
  for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(sx - 6, sy - 8 + k * 9, 5, 2.6, -.6, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(sx + 6, sy - 8 + k * 9, 5, 2.6, .6, 0, TAU); ctx.stroke(); }
}
function pack(ctx, x, y, w, h, q) {   // a plant-burger pack (flat box, a leaf on the label)
  const body = mixHex(mixHex(P.shade1, P.blue2, .45), P.night1, .1 + .15 * q);
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, mixHex(body, P.core1, .18)], [1, mixHex(body, P.night1, .35)]]); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h, w, h, 8); ctx.fill();
  ctx.fillStyle = rgba(P.cream, .85); ctx.beginPath(); ctx.ellipse(x - w * .18, y - h / 2, h * .32, h * .32, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(P.shade0, P.ind1, .2); ctx.beginPath(); ctx.ellipse(x - w * .18, y - h / 2, h * .2, h * .1, -.7, 0, TAU); ctx.fill();   // the leaf
  ctx.fillStyle = rgba(P.cream, .45); ctx.fillRect(x + w * .02, y - h * .62, w * .32, 5); ctx.fillRect(x + w * .02, y - h * .44, w * .22, 4);
}
export function shelf(ctx, c, t) {
  const R = SHELF_REF;
  cardRef(ctx, c, F0, R, () => {   // the store's back panel (same plane as the shelves); its lower edge is the barn's ceiling slab
    ctx.fillStyle = lin(ctx, 0, -900, 0, 1300, [[0, P.night0], [.35, mixHex(P.night1, P.ind1, .35)], [.8, mixHex(P.night1, P.shade0, .12)], [1, P.night1]]); ctx.fillRect(-1800, -1400, W + 3600, 2700);
    ctx.strokeStyle = rgba(P.night0, .35); ctx.lineWidth = 3; for (let x = -1700; x < W + 1700; x += 240) { ctx.beginPath(); ctx.moveTo(x, -1400); ctx.lineTo(x, 1240); ctx.stroke(); }
    ctx.fillStyle = mixHex(P.night0, P.ind2, .3); ctx.fillRect(-1800, 1240, W + 3600, 110); ctx.fillStyle = rgba(P.halo1, .25); ctx.fillRect(-1800, 1240, W + 3600, 3);
  });
  cardRef(ctx, c, F0, R, () => {
    // the light strip over the shelves (the hero light): a warm bar, its glow falls down onto the products
    const lit = 1 + .015 * Math.sin(t * 2.3);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, 170, 0, 1200, [[0, rgba(P.halo1, .2 * lit)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(130, 170, 1660, 1030); ctx.restore();
    halo(ctx, 960, 158, 900, .27 * lit, P.halo1, P.core1);
    ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.fillRect(110, 130, 1700, 26);
    ctx.fillStyle = lin(ctx, 130, 0, 1790, 0, [[0, P.halo0], [.5, P.core0], [1, P.halo0]]); ctx.fillRect(130, 152, 1660, 9);
    // upper shelf: oat milk; lower shelf: plant burgers
    for (const [x, sc, q] of PRODUCTS.up) carton(ctx, x, 470, 64 * sc, 130 * sc, q);
    for (const [x, q, n] of PRODUCTS.lo) for (let k = 0; k < n; k++) pack(ctx, x + (k % 2) * 6, 820 - k * 58, 176, 54, q + k * .1);
    for (const [x, sc, q] of PRODUCTS.up) if (x < 1740) carton(ctx, x + 40, 1150, 48 * sc, 96 * sc, 1 - q);
    for (const y of [470, 820, 1150]) {
      slab(ctx, 120, y, 1680, 26, mixHex(P.shade1, P.night1, .55), mixHex(P.night1, P.night0, .4), rgba(P.halo1, .7), 3);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(120, y + 26, 1680, 22);   // the price rail
      ctx.fillStyle = rgba(P.cream, .55); for (let x = 200; x < 1760; x += 196) ctx.fillRect(x, y + 31, 44, 12);
    }
  });
}

// =================================================================================================================== THE BARN FROM OUTSIDE (9.06)
// SCREEN space (full frame); drawn inside the pig pin's medallion. The calls rise inside as rings and die on the walls.
export function barnOutside(ctx, t, o = {}) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  const k = o.k ?? 1; ctx.save(); ctx.translate(960, 600); ctx.scale(k, k); ctx.translate(-960, -600);   // o.k: closer (inside a medallion)
  stars(ctx, t, .8, 520);
  ctx.fillStyle = lin(ctx, 0, 790, 0, H, [[0, mixHex(P.ind1, P.night1, .5)], [1, P.night0]]); ctx.fillRect(-W, 790, 3 * W, H);
  const body = new Path2D(); body.moveTo(560, 800); body.lineTo(560, 540); body.lineTo(960, 320); body.lineTo(1360, 540); body.lineTo(1360, 800); body.closePath();
  ctx.fillStyle = lin(ctx, 560, 0, 1360, 0, [[0, mixHex(P.night1, P.ind2, .6)], [.55, mixHex(P.ind2, P.blue1, .35)], [1, mixHex(P.night1, P.ind2, .5)]]); ctx.fill(body);
  ctx.save(); ctx.clip(body);   // boards and the calls trapped inside (rings from the two pigs, fading where they meet the walls)
  ctx.strokeStyle = rgba(P.night0, .3); ctx.lineWidth = 3; for (let x = 590; x < 1360; x += 60) { ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, 800); ctx.stroke(); }
  for (const [sx, sy, ph] of [[790, 730, 0], [1130, 720, 1.2]]) {
    for (let k = 0; k < 3; k++) {
      const u = (((t * .42 + ph + k / 3) % 1) + 1) % 1, r = 30 + u * 520;
      ctx.strokeStyle = rgba(mixHex(P.cream, P.blue0, .3), .5 * (1 - u) ** 1.3 * (o.calls ?? 1)); ctx.lineWidth = 3 / Math.sqrt(k);
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, TAU); ctx.stroke();
    }
  }
  ctx.restore();
  ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 3; ctx.stroke(body);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.moveTo(530, 556); ctx.lineTo(960, 300); ctx.lineTo(1390, 556); ctx.lineTo(1390, 536); ctx.lineTo(960, 280); ctx.lineTo(530, 536); ctx.closePath(); ctx.fill();   // the roof edge
  slab(ctx, 860, 610, 200, 190, mixHex(P.night1, P.ind2, .3), P.night0, rgba(P.halo1, .5));   // the closed door
  ctx.strokeStyle = rgba(P.halo1, .25); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(960, 612); ctx.lineTo(960, 800); ctx.moveTo(862, 612); ctx.lineTo(1058, 798); ctx.moveTo(1058, 612); ctx.lineTo(862, 798); ctx.stroke();
  const lit = 1 + .03 * Math.sin(t * 2.1);   // the yard lamp over the door (the hero light)
  halo(ctx, 960, 578, 260 * lit, .5, P.halo1, P.core1); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(960, 580, 9, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.fillRect(940, 562, 40, 8);
  pool(ctx, 960, 812, 320, 40, .35);
  ctx.restore();
}

// =================================================================================================================== RECORD → KITCHEN (9.07–9.08)
// st: { tilt 1 (top view: the record is a circle) → .3 (side view), arm 0..1 (swings in), drop 0..1, wave: { x, y, w, h, u, a },
//       look (family looks up 0..1), fill (the wave fills the kitchen 0..1) }
export const REC = { x: 700, y: 610, r: 150 };
export const KITCHEN = { table: 1960, top: 690 };
export function recordKitchen(ctx, c, t, st = {}) {
  card(ctx, c, 7000, () => {
    wallFill(ctx, P.night0, mixHex(P.night1, P.shade0, .12), P.night1);
    ctx.strokeStyle = rgba(P.night0, .25); ctx.lineWidth = 2; for (let x = -1500; x < 1350; x += 46) { ctx.beginPath(); ctx.moveTo(x, -900); ctx.lineTo(x, 790); ctx.stroke(); }   // 1970 wallpaper stripes
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-3000, 120, 8000, 18);
  });
  card(ctx, c, 3600, () => pendant(ctx, 1960, 300, t, { halo: 520, spread: 600 }));   // the kitchen lamp
  card(ctx, c, 3000, () => {   // the kitchen window (night) and the cupboards
    slab(ctx, 2230, 210, 290, 330, mixHex(P.ind1, P.blue1, .3), mixHex(P.night1, P.ind1, .5), null, 4);
    ctx.strokeStyle = mixHex(P.night0, P.ind2, .5); ctx.lineWidth = 12; ctx.strokeRect(2230, 210, 290, 330); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(2375, 210); ctx.lineTo(2375, 540); ctx.stroke();
    ctx.fillStyle = rgba(P.core1, .7); ctx.beginPath(); ctx.arc(2300, 280, 14, 0, TAU); ctx.fill();
    slab(ctx, 2200, 600, 600, 200, mixHex(P.night1, P.ind2, .4), P.night0, rgba(P.halo1, .35));
  });
  card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, 780, 0, H + 300, [[0, mixHex(P.shade0, P.night1, .72)], [1, P.night0]]); ctx.fillRect(-1600, 780, 5200, 900);
    // the 1970 floor lamp (warm, left) and its pool
    const fl = 1 + .02 * Math.sin(t * 1.9);
    halo(ctx, 190, 360, 420 * fl, .45, P.halo1, P.core1); pool(ctx, 300, 800, 420, 50, .3);
    ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.fillRect(184, 380, 10, 410); ctx.fillRect(140, 784, 100, 10);
    ctx.fillStyle = lin(ctx, 0, 300, 0, 390, [[0, mixHex(P.halo1, P.shade0, .5)], [1, P.halo0]]); ctx.beginPath(); ctx.moveTo(150, 300); ctx.lineTo(230, 300); ctx.lineTo(260, 390); ctx.lineTo(120, 390); ctx.closePath(); ctx.fill();
    // the sideboard
    slab(ctx, 340, 660, 720, 130, mixHex(P.shade0, P.night1, .55), mixHex(P.night1, P.night0, .5), rgba(P.halo1, .55), 4);
    ctx.strokeStyle = rgba(P.night0, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(700, 672); ctx.lineTo(700, 784); ctx.stroke();
    ctx.fillStyle = rgba(P.halo1, .4); ctx.fillRect(670, 720, 4, 18); ctx.fillRect(726, 720, 4, 18);
    turntable(ctx, t, st);
    // the door frame between the rooms
    slab(ctx, 1290, 120, 44, 670, mixHex(P.night1, P.ind2, .4), P.night0, null); ctx.fillStyle = rgba(P.halo1, .2); ctx.fillRect(1290, 120, 3, 670);
    // the kitchen table today, the family behind it (seated: the table hides their legs)
    const K = KITCHEN, lk = clamp(st.look ?? 0);
    pool(ctx, K.table, K.top + 4, 360, 30, .45);
    E.person(ctx, K.table - 175, 900, 330, { dir: 1, look: .1 + .45 * lk, armR: [.5, .9], light: 1 });
    E.person(ctx, K.table + 5, 900, 345, { dir: -1, look: .15 + .5 * lk, light: -1, long: true });
    E.person(ctx, K.table + 175, 900, 300, { dir: -1, look: .1 + .4 * lk, light: -1 });
    underTable(ctx, K.table - 300, K.table + 300, K.top, 790);
    slab(ctx, K.table - 300, K.top, 600, 20, mixHex(P.shade0, P.night1, .45), mixHex(P.night1, P.night0, .3), rgba(P.halo1, .6), 3);
    ctx.fillStyle = mixHex(P.night1, P.night0, .5); ctx.fillRect(K.table - 270, K.top + 20, 18, 100); ctx.fillRect(K.table + 252, K.top + 20, 18, 100);
    for (const dx of [-170, 0, 170]) { ctx.fillStyle = rgba(P.cream, .8); ctx.beginPath(); ctx.ellipse(K.table + dx, K.top - 2, 56, 9, 0, 0, TAU); ctx.fill(); ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.beginPath(); ctx.ellipse(K.table + dx, K.top - 5, 30, 5, 0, 0, TAU); ctx.fill(); }
    // the pig's call, floating out of the record into the kitchen
    const wv = st.wave;
    if (wv && wv.u > 0) {
      halo(ctx, wv.x, wv.y, wv.w * .55, .22 * (wv.a ?? 1), P.halo2, P.cream);
      F.wave(ctx, t, wv.x, wv.y, wv.w, wv.h, 'grunt', { u: wv.u, live: true, seed: 11, col: 'cream', bars: 40, a: wv.a ?? 1 });
      const fl2 = clamp(st.fill ?? 0);   // the call fills the room: faint echoes spread to both sides
      if (fl2 > 0) for (const k of [-1, 1]) for (let j = 1; j <= 2; j++) F.wave(ctx, t, wv.x + k * (wv.w * .55 + j * 210) * expoOut(fl2), wv.y + j * 14, wv.w * .5 / j, wv.h * .55 / j, 'grunt', { u: 1, live: true, seed: 11 + j, col: 'cream', bars: 20, a: .5 * fl2 / j, head: false });
    }
  });
}
function turntable(ctx, t, st) {
  const { x, y, r } = REC, tl = clamp(st.tilt ?? 1, .05, 1), fd = 44 * (1 - tl) + 4;
  // plinth: the top face (a rounded rect compressed by the tilt) and the front face growing as it tilts
  ctx.fillStyle = lin(ctx, 0, y + 160 * tl, 0, y + 160 * tl + fd, [[0, mixHex(P.shade0, P.night1, .5)], [1, mixHex(P.night1, P.night0, .4)]]);
  ctx.beginPath(); ctx.roundRect(x - 220, y + 160 * tl - 6, 440, fd + 6, 6); ctx.fill();
  ctx.fillStyle = lin(ctx, x - 220, y - 160 * tl, x + 220, y + 160 * tl, [[0, mixHex(P.shade0, P.night1, .35)], [1, mixHex(P.shade0, P.night1, .65)]]);
  ctx.beginPath(); ctx.roundRect(x - 220, y - 160 * tl, 440, 320 * tl, 14 * tl); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .45); ctx.fillRect(x - 214, y + 160 * tl - 3, 428, 3);
  ctx.save(); ctx.translate(x, y); ctx.scale(1, tl);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .35); ctx.beginPath(); ctx.arc(0, 0, r + 8, 0, TAU); ctx.fill();   // platter rim
  ctx.fillStyle = rad(ctx, 0, 0, r, [[0, '#15131c'], [.75, '#0d0c14'], [1, '#1b1a26']]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(P.blue2, .25); ctx.lineWidth = 1.4; for (let rr = 58; rr < r - 3; rr += 8) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.stroke(); }
  ctx.strokeStyle = rgba(P.halo2, .22); ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, 0, r * .68, -2.5, -1.9); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * .68, .64, 1.24); ctx.stroke();   // the sheen (stays put)
  const sp = t * 3.46;   // 33 rpm: the label turns
  ctx.rotate(sp); ctx.fillStyle = mixHex(P.cream, P.halo2, .35); ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.clip(); F.icon(ctx, 'humpback', 0, 4, 36, { col: 'cream', t, base: mixHex(P.blue1, P.ind1, .3) }); ctx.restore();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill();
  ctx.restore();
  // the tone arm (top-face coordinates, projected with the tilt); it swings in and lowers onto the record
  const pv = [x + 178, y - 112 * tl], arm = sineIO(clamp(st.arm ?? 0)), ang = lerp(1.62, 2.28, arm), L = 210;
  const hx = pv[0] + Math.cos(ang) * L, hz = -112 + Math.sin(ang) * L, lift = 16 * (1 - expoOut(clamp(st.drop ?? 0))) * (1 - tl * .6);
  const hy = y + hz * tl - lift;
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.ellipse(pv[0], pv[1], 18, 18 * tl + 6 * (1 - tl), 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = mixHex(P.cream, P.blue2, .35); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(pv[0], pv[1] - 8 * (1 - tl)); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.fillStyle = mixHex(P.cream, P.blue2, .25); ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang + Math.PI / 2); ctx.fillRect(-9, -6, 18, 22); ctx.restore();
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.arc(pv[0] - Math.cos(ang) * 34, pv[1] - Math.sin(ang) * 34 * tl, 12, 0, TAU); ctx.fill();   // counterweight
  REC.needle = [hx, hy + 6];
}

// =================================================================================================================== HARBOUR, ICELAND (9.09)
// st: { ship (x of the bow), slow 0..1 }
export function harbour(ctx, c, t, st = {}) {
  const sun = [1300, 600];
  card(ctx, c, 40000, () => {
    ctx.fillStyle = lin(ctx, 0, -300, 0, 660, [[0, P.night0], [.45, mixHex(P.ind1, P.blue0, .3)], [.8, mixHex(P.blue1, P.shade0, .45)], [1, mixHex(P.halo1, P.shade0, .5)]]); ctx.fillRect(-2000, -900, W + 4000, 1600);
    stars(ctx, t, .35, 260);
    halo(ctx, sun[0], sun[1], 620, .55, P.halo1, P.core1); halo(ctx, sun[0], sun[1], 160, .8, P.halo0, P.core0);
    ctx.fillStyle = rad(ctx, sun[0], sun[1], 50, [[0, P.core0], [.7, P.core1], [1, P.halo0]]); ctx.beginPath(); ctx.arc(sun[0], sun[1], 46, 0, TAU); ctx.fill();
  });
  card(ctx, c, 9000, () => {   // the mountains: two ranges, snow on the lit flanks
    const rng = (pts, col, snow) => {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(pts[0][0], 700); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(pts[pts.length - 1][0], 700); ctx.closePath(); ctx.fill();
      if (snow) { ctx.strokeStyle = rgba(mixHex(P.cream, P.halo2, .4), .55); ctx.lineWidth = 4; ctx.lineJoin = 'round'; for (let i = 1; i < pts.length - 1; i++) if (pts[i][1] < pts[i - 1][1] && pts[i][1] < pts[i + 1][1]) { ctx.beginPath(); ctx.moveTo(pts[i][0] - 40, pts[i][1] + 26); ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i][0] + 60, pts[i][1] + 34); ctx.stroke(); } }
    };
    rng([[-900, 600], [-500, 470], [-200, 540], [180, 420], [520, 520], [860, 450], [1180, 560], [1600, 500], [2000, 580], [2600, 480], [3000, 600]], mixHex(P.ind2, P.blue1, .45), true);
    rng([[-900, 640], [-300, 560], [300, 620], [700, 570], [1100, 630], [1700, 600], [2300, 640], [3000, 620]], mixHex(P.night1, P.ind2, .55), false);
  });
  card(ctx, c, 6000, () => {   // the sea with the sun's glitter path
    ctx.fillStyle = lin(ctx, 0, 640, 0, H + 400, [[0, mixHex(P.blue1, P.shade0, .3)], [.25, mixHex(P.ind1, P.night1, .4)], [1, P.night0]]); ctx.fillRect(-3000, 640, W + 6000, 1400);
    const r = prng(2453); ctx.fillStyle = rgba(P.core1, .5);
    for (let i = 0; i < 70; i++) { const y = 650 + r() ** 1.6 * 520, w0 = 20 + (y - 640) * .25, x = sun[0] + (r() - .5) * (40 + (y - 640) * .9), a = .2 + .6 * Math.max(0, Math.sin(t * (1 + r() * 2) + i)); ctx.fillStyle = rgba(P.core1, a * (1 - (y - 640) / 700)); ctx.fillRect(x - w0 / 2, y, w0, 2.5); }
  });
  card(ctx, c, 2400, () => whaler(ctx, t, st.ship ?? 700, 700, st));
  card(ctx, c, F0, () => {   // the pier (foreground left)
    ctx.fillStyle = mixHex(P.night0, P.ind1, .25); ctx.fillRect(-1600, 760, 2140, 34);
    ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(-1600, 760, 2140, 3);
    for (let x = -1500; x < 540; x += 150) { ctx.fillStyle = mixHex(P.night0, P.ind1, .2); ctx.fillRect(x, 794, 22, 400); }
    for (const x of [120, 420]) { ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.beginPath(); ctx.roundRect(x - 16, 726, 32, 36, 6); ctx.fill(); ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(x - 12, 728, 4, 30); }
    ctx.fillStyle = lin(ctx, 0, 794, 0, H + 300, [[0, rgba(P.night0, .2)], [1, rgba(P.night0, .9)]]); ctx.fillRect(-1600, 794, 2140, 900);
  });
}
function whaler(ctx, t, x, y, st) {   // a whaling ship heading right (to sea); bow at x; the harpoon gun on the bow; wake behind
  const bob = 3 * Math.sin(t * 1.3), L = 560, sp = clamp(1 - (st.slow ?? 0));
  ctx.save(); ctx.translate(0, bob);
  for (let k = 0; k < 4; k++) {   // the wake: lines opening behind the stern
    const ph = ((t * .6 * sp + k / 4) % 1), xx = x - L - ph * 520, sp2 = 6 + ph * 60;
    ctx.strokeStyle = rgba(P.cream, .4 * (1 - ph) * (.3 + .7 * sp)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xx, y + 6 - sp2 * .3); ctx.lineTo(xx - 90, y + 6 - sp2); ctx.moveTo(xx, y + 10 + sp2 * .2); ctx.lineTo(xx - 90, y + 12 + sp2 * .7); ctx.stroke();
  }
  const hull = new Path2D(); hull.moveTo(x, y - 74); hull.lineTo(x - 40, y - 44); hull.lineTo(x - L + 20, y - 40); hull.lineTo(x - L, y - 54); hull.lineTo(x - L + 30, y + 8); hull.lineTo(x - 70, y + 10); hull.closePath();
  ctx.fillStyle = lin(ctx, x - L, 0, x, 0, [[0, P.night0], [.7, mixHex(P.night1, P.ind2, .5)], [1, mixHex(P.ind2, P.shade0, .25)]]); ctx.fill(hull);
  ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y - 74); ctx.lineTo(x - 70, y + 10); ctx.stroke();   // the sun on the bow
  ctx.fillStyle = mixHex(P.night0, P.ind2, .35);
  ctx.fillRect(x - L + 80, y - 120, 190, 80); ctx.fillRect(x - L + 120, y - 160, 120, 44);   // the bridge
  ctx.fillRect(x - L + 300, y - 104, 40, 64);                                                 // the funnel
  ctx.fillStyle = rgba(P.core1, .6); for (let i = 0; i < 4; i++) ctx.fillRect(x - L + 130 + i * 26, y - 148, 14, 10);
  ctx.strokeStyle = mixHex(P.night0, P.ind2, .45); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - L + 230, y - 160); ctx.lineTo(x - L + 230, y - 300); ctx.stroke();   // the mast
  ctx.fillRect(x - L + 214, y - 280, 32, 22);                                                       // the crow's nest
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - L + 230, y - 300); ctx.lineTo(x - 10, y - 76); ctx.moveTo(x - L + 230, y - 300); ctx.lineTo(x - L + 10, y - 56); ctx.stroke();
  ctx.fillRect(x - 78, y - 96, 44, 22); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x - 56, y - 92); ctx.lineTo(x - 6, y - 112); ctx.stroke();   // the harpoon gun on the bow
  ctx.restore();
}

// =================================================================================================================== CAMP, AMBOSELI (10.02–10.07)
// st: { rise 0..1 (the sun), walk (s since the family set off, or null), chorus 0..1 (they call), hand 0..1 (her hand to the button),
//       tremble, phone: { on, scroll, card }, screen 0..1 (laptop) } → anchors { laptop, bell, button, phone (screen rect), els }
export const CAMP = { table: [610, 1000, 690], laptop: [820, 640], speaker: [1170, 600], her: 1030, phone: [962, 646] };
const ELS = [{ x: 1290, h: 132, seed: 1 }, { x: 1450, h: 146, seed: 2 }, { x: 1570, h: 72, seed: 3, calf: true }, { x: 1700, h: 124, seed: 4 }];
export function camp(ctx, c, t, st = {}) {
  const out = {}, rs = clamp(st.rise ?? 0), sun = [1420, 648 - 46 * sineIO(rs)];
  card(ctx, c, 40000, () => {
    ctx.fillStyle = lin(ctx, 0, -300, 0, 660, [[0, P.night0], [.4, mixHex(P.ind1, P.night1, .3)], [.72, mixHex(P.blue1, P.ind1, .3)], [1, mixHex(P.halo1, P.shade0, .45 - .1 * rs)]]); ctx.fillRect(-2000, -900, W + 4000, 1600);
    stars(ctx, t, .5 * (1 - .6 * rs), 300);
    halo(ctx, sun[0], sun[1], 760 + 120 * rs, .55 + .15 * rs, P.halo1, P.core1); halo(ctx, sun[0], sun[1], 170, .85, P.halo0, P.core0);
    ctx.fillStyle = rad(ctx, sun[0], sun[1], 64, [[0, P.core0], [.7, P.core1], [1, P.halo0]]); ctx.beginPath(); ctx.arc(sun[0], sun[1], 60, 0, TAU); ctx.fill();
  });
  card(ctx, c, 9000, () => {   // Kilimanjaro: a wide flat cone with its snow cap, lit from the right
    const m = new Path2D(); m.moveTo(-200, 660); m.bezierCurveTo(200, 560, 470, 380, 560, 336); m.lineTo(770, 328); m.bezierCurveTo(880, 380, 1150, 560, 1500, 660); m.closePath();
    ctx.fillStyle = lin(ctx, 200, 0, 1300, 0, [[0, mixHex(P.night1, P.ind2, .55)], [1, mixHex(P.ind2, P.blue1, .45)]]); ctx.fill(m);
    ctx.fillStyle = rgba(mixHex(P.cream, P.blue1, .35), .75); ctx.beginPath(); ctx.moveTo(530, 352); ctx.lineTo(560, 336); ctx.lineTo(770, 328); ctx.lineTo(830, 362); ctx.lineTo(790, 372); ctx.lineTo(760, 360); ctx.lineTo(720, 378); ctx.lineTo(680, 362); ctx.lineTo(630, 380); ctx.lineTo(590, 364); ctx.closePath(); ctx.fill();
  });
  card(ctx, c, 4500, () => {   // the plain and two acacias
    ctx.fillStyle = lin(ctx, 0, 650, 0, H + 300, [[0, mixHex(P.shade0, P.ind1, .55)], [.3, mixHex(P.shade0, P.night1, .75)], [1, P.night0]]); ctx.fillRect(-3000, 650, W + 6000, 1200);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, sun[0], 660, 900, [[0, rgba(P.halo1, .25 + .1 * rs)], [1, rgba(P.halo1, 0)]]); ctx.save(); ctx.translate(sun[0], 660); ctx.scale(1, .12); ctx.translate(-sun[0], -660); ctx.fillRect(sun[0] - 900, -300, 1800, 1900); ctx.restore(); ctx.restore();
    for (const [x, y, s] of [[1760, 520, 1], [250, 540, .8], [-420, 560, .7]]) {
      ctx.strokeStyle = P.night0; ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(x, 660); ctx.lineTo(x - 6 * s, y + 30 * s); ctx.lineTo(x - 50 * s, y + 6 * s); ctx.moveTo(x - 6 * s, y + 30 * s); ctx.lineTo(x + 46 * s, y + 4 * s); ctx.stroke();
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(x, y, 170 * s, 26 * s, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x - 50 * s, y - 14 * s, 100 * s, 18 * s, 0, 0, TAU); ctx.fill();
    }
  });
  card(ctx, c, 3000, () => {   // the family: they stand facing the sun; on "time to go" they set off toward it
    const wk = st.walk;
    out.els = ELS.map((e, i) => {
      const go = wk == null ? 0 : Math.max(0, wk - i * .25), dist = go > 0 ? 34 * go - 18 * (1 - Math.exp(-go)) : 0, ph = go > 0 ? go * 3.1 + i : null;
      const call = clamp(st.chorus ?? 0) * Math.max(0, Math.sin(t * 1.3 + i * 1.7)) ** 2;
      return F.elephant(ctx, t, e.x + dist, 700, e.h, { dir: 1, light: 1, warm: .75, seed: e.seed, calf: e.calf, walk: ph, ears: .25 + .3 * call, trunk: -.1 + .5 * call, open: call });
    });
  });
  card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, 770, 0, H + 300, [[0, mixHex(P.shade0, P.night1, .6)], [1, P.night0]]); ctx.fillRect(-1800, 770, W + 3600, 900);
    // the tent (lit on the sun side)
    const tp = new Path2D(); tp.moveTo(110, 792); tp.lineTo(300, 520); tp.lineTo(490, 792); tp.closePath();
    ctx.fillStyle = lin(ctx, 110, 0, 490, 0, [[0, mixHex(P.night1, P.ind2, .5)], [.5, mixHex(P.shade1, P.ind2, .55)], [1, mixHex(P.halo1, P.shade0, .45)]]); ctx.fill(tp);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.moveTo(250, 792); ctx.lineTo(300, 600); ctx.lineTo(350, 792); ctx.closePath(); ctx.fill();
    shadowE(ctx, 300, 794, 220, .45);
    // the table, the laptop with the chorus on its screen, the phone propped up
    const [tx0, tx1, ty] = CAMP.table;
    slab(ctx, tx0, ty, tx1 - tx0, 16, mixHex(P.shade0, P.night1, .45), mixHex(P.night1, P.night0, .3), rgba(P.halo1, .55), 3);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(tx0 + 20, ty + 16, 12, 84); ctx.fillRect(tx1 - 32, ty + 16, 12, 84);
    const [lx, ly] = CAMP.laptop, scn = clamp(st.screen ?? 1);
    ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(lx - 92, ly + 42, 184, 8);
    ctx.save(); ctx.translate(lx, ly + 44); ctx.transform(1, 0, -.12, 1, 0, 0);
    ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(-84, -112, 168, 112);
    ctx.fillStyle = mixHex(P.night0, mixHex(P.ind1, P.blue0, .5), scn); ctx.fillRect(-78, -106, 156, 100);
    ctx.save(); ctx.beginPath(); ctx.rect(-78, -106, 156, 100); ctx.clip();
    const off = (t * 26) % 156;   // the chorus scrolls across the screen (a running spectrogram of rumbles)
    for (let k = -1; k < 2; k++) for (let row = 0; row < 3; row++) F.wave(ctx, t, -off + k * 156 + 78, -86 + row * 30, 150, 24, 'rumble', { u: 1, bars: 22, seed: 40 + row + (k & 1), col: row === 1 ? 'gold' : 'cream', a: .8 * scn, head: false });
    ctx.restore(); ctx.restore();
    halo(ctx, lx - 6, ly - 12, 180, .2 * scn, P.blue0, mixHex(P.blue0, P.cream, .5));
    out.laptop = [lx - 6, ly - 14];
    const ph = st.phone || {}, [px, py] = CAMP.phone;
    out.phone = phoneOnTable(ctx, t, px, py, ph);
    // the researcher (faces the family) and the playback speaker; her hand goes to its button and stops there
    const [sx, sy] = CAMP.speaker, hd = sineIO(clamp(st.hand ?? 0)), tr = (st.tremble ?? 0) * .03 * Math.sin(t * 9);
    ctx.strokeStyle = mixHex(P.night0, P.ind1, .4); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(sx, sy + 50); ctx.lineTo(sx - 46, 792); ctx.moveTo(sx, sy + 50); ctx.lineTo(sx + 46, 792); ctx.moveTo(sx, sy + 50); ctx.lineTo(sx + 4, 792); ctx.stroke();
    slab(ctx, sx - 44, sy - 56, 88, 106, mixHex(P.ind2, P.night1, .4), P.night0, rgba(P.halo1, .5), 8);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.arc(sx, sy, 30, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = mixHex(P.cream, P.halo1, .4); ctx.fillRect(sx - 12, sy - 66, 24, 10);
    out.button = [sx, sy - 62];
    E.person(ctx, CAMP.her, 792, 340, { dir: 1, light: 1, back: .25, armR: [lerp(.15, 1.45, hd) + tr, lerp(.1, 1.85, hd) + tr], armL: [-.1, -.05], look: .05 + .1 * hd });
    shadowE(ctx, CAMP.her, 794, 70, .5);
  });
  return out;
}
function phoneOnTable(ctx, t, x, y, o) {   // a phone in a little stand on the table (portrait)
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(x - 14, y + 30, 28, 14);
  return phoneBody(ctx, t, x, y, 36, 64, o);
}
function phoneBody(ctx, t, x, y, w, h, o) {
  const on = clamp(o.on ?? 0);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 6); ctx.fill(); ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 1.5; ctx.stroke();
  const sx = x - w / 2 + 3, sy = y - h / 2 + 4, sw = w - 6, sh = h - 8;
  ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 3); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, mixHex(P.ind1, P.blue0, .45), on); ctx.fillRect(sx, sy, sw, sh);
  let vid = null;
  if (on > 0) {
    const ch = sh * .34, gap = sh * .05, step = ch + gap, sc = o.scroll ?? 0, first = Math.floor(sc / step) - 1;
    for (let i = first; i < first + 5; i++) {
      const cy = sy + gap + i * step - sc; if (cy > sy + sh || cy + ch < sy) continue;
      if (o.card != null && i === o.card) { vid = { x: sx + 2, y: cy, w: sw - 4, h: ch }; ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(vid.x, vid.y, vid.w, vid.h); continue; }
      ctx.fillStyle = rgba(mixHex(P.blue2, P.cream, .3), .6 * on); ctx.fillRect(sx + 2, cy, sw - 4, ch * .7);
      ctx.fillStyle = rgba(P.cream, .4 * on); ctx.fillRect(sx + 2, cy + ch * .78, sw * .6, ch * .08);
    }
  }
  ctx.restore();
  if (on > 0) halo(ctx, x, y, h * 1.4, .18 * on, P.blue0, mixHex(P.blue0, P.cream, .5));
  return { x, y, w, h, vid };
}

// =================================================================================================================== COURTROOM, NEW ZEALAND (10.09–10.12)
// st: { ship (x), slow 0..1, nod 0..1 (the judge nods), rec 0..1 (the recording plays) } → anchors { screen, bench }
export const COURT = { screen: [1330, 190, 470, 290], bar: [1565, 540] };
export function court(ctx, c, t, st = {}) {
  const out = {};
  card(ctx, c, 7000, () => {
    wallFill(ctx, P.night0, mixHex(P.night1, P.shade0, .16), P.night1);
    ctx.strokeStyle = rgba(P.night0, .32); ctx.lineWidth = 3; for (let x = -1500; x < W + 1500; x += 96) { ctx.beginPath(); ctx.moveTo(x, -900); ctx.lineTo(x, 900); ctx.stroke(); }
    ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-3000, 660, 8000, 16);
    // the window: dusk over the harbour, a container ship; it slows down (its wake calms)
    const [wx, wy, ww, wh] = [150, 140, 420, 500];
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(P.ind1, P.night1, .3)], [.55, mixHex(P.blue1, P.shade0, .3)], [.62, mixHex(P.blue1, P.ind1, .4)], [1, P.night1]]); ctx.fillRect(wx, wy, ww, wh);
    halo(ctx, wx + ww * .7, wy + wh * .55, 200, .3, P.halo1, P.core1);
    const sx = st.ship ?? 420, sy = wy + wh * .62, sp = clamp(1 - (st.slow ?? 0));
    for (let k = 0; k < 3; k++) { const ph = (t * .5 * (.25 + .75 * sp) + k / 3) % 1; ctx.strokeStyle = rgba(P.cream, .45 * (1 - ph) * (.15 + .85 * sp)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - 150 - ph * 160, sy + 4); ctx.lineTo(sx - 220 - ph * 160, sy + 4 + 6 + 20 * ph * sp); ctx.stroke(); }
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(sx, sy - 14); ctx.lineTo(sx - 150, sy - 10); ctx.lineTo(sx - 146, sy + 4); ctx.lineTo(sx - 10, sy + 4); ctx.closePath(); ctx.fill();
    const cc = [P.ind2, P.shade0, P.blue1, P.ind1]; for (let i = 0; i < 6; i++) { ctx.fillStyle = mixHex(cc[i % 4], P.night0, .55); ctx.fillRect(sx - 128 + i * 18, sy - 28 - (i % 2) * 8, 16, 16 + (i % 2) * 8); }
    ctx.fillStyle = mixHex(P.night0, P.ind2, .3); ctx.fillRect(sx - 146, sy - 40, 18, 28);
    ctx.restore();
    ctx.strokeStyle = mixHex(P.night0, P.ind2, .35); ctx.lineWidth = 14; ctx.strokeRect(wx, wy, ww, wh); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh * .42); ctx.lineTo(wx + ww, wy + wh * .42); ctx.stroke();
    // the screen with the sperm whale recording
    const [qx, qy, qw, qh] = COURT.screen;
    slab(ctx, qx - 8, qy - 8, qw + 16, qh + 16, mixHex(P.night0, P.ind2, .5), P.night0, null, 8);
    ctx.fillStyle = lin(ctx, 0, qy, 0, qy + qh, [[0, mixHex(P.ind0, P.blue0, .35)], [1, mixHex(P.night0, P.ind0, .5)]]); ctx.fillRect(qx, qy, qw, qh);
    halo(ctx, qx + qw / 2, qy + qh / 2, 330, .16, P.blue0, mixHex(P.blue0, P.cream, .4));
    ctx.save(); ctx.beginPath(); ctx.rect(qx, qy, qw, qh); ctx.clip();
    F.spermWhale(ctx, t, qx + 150, qy + 100, 34, { dir: 1, warm: .3, light: 1, seed: 3 });
    F.wave(ctx, t, qx + qw / 2, qy + 200, qw - 70, 90, 'click', { u: st.rec ?? 1, live: (st.rec ?? 1) < 1.01, seed: 7, col: 'cream', bars: 52 });
    ctx.restore();
    out.screen = [qx + qw / 2, qy + qh / 2];
  });
  card(ctx, c, 3600, () => pendant(ctx, 1010, 236, t, { halo: 480, spread: 520, len: 900 }));
  card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, 800, 0, H + 300, [[0, mixHex(P.shade0, P.night1, .7)], [1, P.night0]]); ctx.fillRect(-1800, 800, W + 3600, 900);
    pool(ctx, 1010, 806, 440, 44, .35);
    const nod = (st.nod ?? 0) * Math.max(0, Math.sin(Math.PI * 2 * clamp(st.nod ?? 0) * 1.0));
    E.person(ctx, 1010, 790, 420, { dir: 1, light: 1, long: true, look: .12 - .5 * nod, lean: .04 * nod, armR: [.6, 1.2], armL: [-.6, -1.2] });
    slab(ctx, 690, 560, 640, 240, mixHex(P.shade0, P.night1, .5), mixHex(P.night1, P.night0, .5), rgba(P.halo1, .7), 4);
    ctx.strokeStyle = rgba(P.night0, .45); ctx.lineWidth = 3; for (const x of [850, 1010, 1170]) { ctx.beginPath(); ctx.moveTo(x, 590); ctx.lineTo(x, 790); ctx.stroke(); }
    out.bench = [1010, 560];
  });
  card(ctx, c, 1250, () => {   // the people in the front rows, from behind; the pew backs
    for (const [x, h, d] of [[180, 470, 1], [520, 500, -1], [1440, 480, 1], [1760, 460, -1]]) E.person(ctx, x, 1250, h, { dir: d, view: 'back', light: d, back: .5 });
    slab(ctx, -400, 1010, 2700, 200, mixHex(P.shade0, P.night1, .62), P.night0, rgba(P.halo1, .4), 6);
  });
  return out;
}

// =================================================================================================================== FARM KITCHEN, IOWA (11.01–11.04)
// st: { look (dog looks up 0..1), wag (rate), tilt, mic 0..1 (its light) } → anchors { mic, dog, window }
export const IOWA = { lamp: [760, 252], table: [360, 1160, 640], dog: [760, 862], window: [1220, 170, 500, 390], mic: [1488, 402] };
export function farmKitchen(ctx, c, t, st = {}) {
  const out = {};
  card(ctx, c, 7000, () => {
    wallFill(ctx, P.night0, mixHex(P.night1, P.shade0, .18), P.night1);
    ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-3000, 600, 8000, 14);
    const [wx, wy, ww, wh] = IOWA.window;
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();   // outside: dusk, the barn, a microphone under its eave
    ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(P.ind1, P.night1, .3)], [.7, mixHex(P.blue1, P.shade0, .25)], [1, mixHex(P.ind1, P.night1, .4)]]); ctx.fillRect(wx, wy, ww, wh);
    stars(ctx, t, .5, 330);
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(wx, wy + wh * .78, ww, wh);
    const b = new Path2D(); b.moveTo(1330, 494); b.lineTo(1330, 404); b.lineTo(1470, 318); b.lineTo(1610, 404); b.lineTo(1610, 494); b.closePath();
    ctx.fillStyle = lin(ctx, 1330, 0, 1610, 0, [[0, mixHex(P.night1, P.ind2, .5)], [1, mixHex(P.ind2, P.blue1, .4)]]); ctx.fill(b);
    ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.stroke(b);
    ctx.fillStyle = P.night0; ctx.fillRect(1440, 440, 60, 54);
    const [mx, my] = IOWA.mic, ml = clamp(st.mic ?? 1) * (.75 + .25 * Math.sin(t * 2.4));
    ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, 390); ctx.lineTo(mx, my - 6); ctx.stroke();
    ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.beginPath(); ctx.roundRect(mx - 6, my - 8, 12, 18, 5); ctx.fill();
    halo(ctx, mx, my + 12, 30, .6 * ml, P.halo2, P.cream); ctx.fillStyle = rgba(P.cream, .9 * ml + .1); ctx.beginPath(); ctx.arc(mx, my + 12, 2.6, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = mixHex(P.night0, P.shade0, .25); ctx.lineWidth = 14; ctx.strokeRect(wx, wy, ww, wh); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
    slab(ctx, wx - 30, wy + wh + 4, ww + 60, 18, mixHex(P.shade0, P.night1, .5), P.night1, rgba(P.halo1, .4));
    out.mic = [IOWA.mic[0], IOWA.mic[1] + 12];
  });
  card(ctx, c, 3600, () => pendant(ctx, IOWA.lamp[0], IOWA.lamp[1], t, { halo: 600, spread: 620, len: 900 }));
  card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, 800, 0, H + 300, [[0, mixHex(P.shade0, P.night1, .62)], [1, P.night0]]); ctx.fillRect(-1800, 800, W + 3600, 900);
    ctx.strokeStyle = rgba(P.night0, .3); ctx.lineWidth = 2; for (let y = 830; y < 1300; y += 40) { ctx.beginPath(); ctx.moveTo(-1800, y); ctx.lineTo(W + 1800, y); ctx.stroke(); }
    const [x0, x1, ty] = IOWA.table;
    pool(ctx, 760, 812, 520, 60, .3);
    E.person(ctx, 560, 900, 350, { dir: 1, light: 1, look: .1 + .05 * Math.sin(t * .4), armR: [.6, 1.1] });
    E.person(ctx, 800, 900, 330, { dir: -1, light: -1, long: true, look: .08, armR: [.5, 1.1] });
    E.du(ctx, 1060, 902, 350, { dir: -1, view: 'side', light: -1, look: .05 - .2 * clamp(st.youDown ?? 0), lean: .1 * clamp(st.youDown ?? 0), armR: [.7, 1.2], armL: [.5, 1.0] });
    // under the table: deep shadow (the seated people's legs vanish in it), the dog in front of it
    underTable(ctx, x0, x1, ty, 870);
    ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.ellipse(760, 866, 380, 26, 0, 0, TAU); ctx.fill();
    out.dog = F.dog(ctx, t, IOWA.dog[0], IOWA.dog[1], 132, { lie: true, dir: 1, light: 1, warm: .5, seed: 2, wag: st.wag ?? 3, look: st.look ?? 0, tilt: st.tilt ?? 0 });
    slab(ctx, x0, ty, x1 - x0, 22, mixHex(P.shade0, P.night1, .4), mixHex(P.night1, P.night0, .3), rgba(P.halo1, .65), 3);
    ctx.fillStyle = mixHex(P.night1, P.night0, .4); ctx.fillRect(x0 + 30, ty + 22, 20, 180); ctx.fillRect(x1 - 50, ty + 22, 20, 180);
    for (const dx of [-260, -20, 220]) { ctx.fillStyle = rgba(P.cream, .82); ctx.beginPath(); ctx.ellipse(760 + dx, ty - 2, 60, 10, 0, 0, TAU); ctx.fill(); ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.beginPath(); ctx.ellipse(760 + dx, ty - 5, 32, 5, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = mixHex(P.cream, P.blue2, .35); ctx.beginPath(); ctx.roundRect(866, ty - 50, 34, 48, 6); ctx.fill();   // a jug
  });
  return out;
}

// =================================================================================================================== THE ROOM (11.07–11.08)
// st: { turn (s since the voice appeared, or null), line 0..1 (the line of light's strength), mind: { x, y, w, h } } → anchors
const CROWD = (() => {   // [x, ground, h, card Z, dir0, delay, isYou]
  const r = prng(2454), a = [];
  for (const [x, d] of [[180, 1], [420, -1], [610, 1], [1290, -1], [1500, 1], [1740, -1]]) a.push([x, 690, 230, 4000, d, .1 + r() * .5, false]);
  for (const [x, d] of [[90, 1], [330, -1], [700, 1], [1120, -1], [1380, 1], [1640, -1], [1860, 1]]) a.push([x, 820, 330, F0, d, r() * .5, false]);
  a.push([900, 830, 340, F0, -1, .25, true]);
  for (const [x, d] of [[260, 1], [1600, -1]]) a.push([x, 1240, 560, 1150, d, .3 + r() * .4, false]);
  return a;
})();
export const MIND = { x: 960, y: 470 };
export function room(ctx, c, t, st = {}) {
  const ln = clamp(st.line ?? 1), md = st.mind || { x: MIND.x, y: MIND.y, w: 1000, h: 110 };
  card(ctx, c, 7000, () => {
    wallFill(ctx, P.night0, mixHex(P.night1, P.ind1, .35), P.night1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, md.x, md.y, 1100, [[0, rgba(P.blue0, .3 * ln)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-2000, -900, W + 4000, H + 1800); ctx.restore();
    ctx.fillStyle = rgba(P.night0, .4); for (let x = -1400; x < W + 1400; x += 360) ctx.fillRect(x, -900, 26, 1800);
  });
  card(ctx, c, F0, () => { ctx.fillStyle = lin(ctx, 0, 700, 0, H + 300, [[0, mixHex(P.ind1, P.night1, .5)], [1, P.night0]]); ctx.fillRect(-1800, 680, W + 3600, 900); });
  const people = (Z) => card(ctx, c, Z, () => {
    for (const [x, g, h, z, d0, dl, you] of CROWD) {
      if (z !== Z) continue;
      const toward = md.x >= x ? 1 : -1, tu = st.turn == null ? 0 : clamp((st.turn - dl - Math.abs(x - md.x) / 2600) / .55), turn = d0 === toward ? 0 : tu;
      const look = (st.turn == null ? .05 : .05 + .35 * sineIO(clamp((st.turn - dl) / 1.2))) + .03 * Math.sin(t * .7 + x);
      const sq = turn > 0 && turn < 1 ? Math.max(.25, Math.abs(Math.cos(Math.PI * turn))) : 1, dir = turn >= .5 ? toward : d0;
      ctx.save(); ctx.translate(x, 0); ctx.scale(sq, 1); ctx.translate(-x, 0);
      const o = { dir, light: md.x >= x ? 1 : -1, back: .35, look, view: 'side' };
      if (you) E.du(ctx, x, g + 4, h, o); else E.person(ctx, x, g, h, { ...o, long: (Math.round(x) % 3) === 0 });
      ctx.restore();
    }
  });
  people(4000);
  card(ctx, c, 2400, () => {   // the new voice: a calm wave that hangs in the room as a line of light
    const m = md; halo(ctx, m.x, m.y, m.w * .6, .3 * ln, P.blue0, mixHex(P.blue0, P.cream, .6));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, m.x - m.w / 2 - 200, 0, m.x + m.w / 2 + 200, 0, [[0, rgba(P.cream, 0)], [.5, rgba(P.cream, .5 * ln)], [1, rgba(P.cream, 0)]]); ctx.fillRect(m.x - m.w / 2 - 200, m.y - 1.5, m.w + 400, 3); ctx.restore();
    F.wave(ctx, t, m.x, m.y, m.w, m.h, 'mind', { u: 1, live: true, seed: 9, col: 'cream', bars: 64, head: false });
  });
  people(F0);
  people(1150);
}
export { pendant, slab, pool, stars, cone };
