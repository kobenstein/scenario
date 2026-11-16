// Film 13 · B2 · Battle Creek drawing pieces: flat editorial cards (house, bare/full tree, the Kellogg factory front with its clock,
// a porch, people as plain indigo silhouettes, never yellow). Drawn in LOCAL units with the base centre at (0,0) and up = -y; the scene
// modules place them on the kit's 2.5D cards (E.card) with translate/scale. Jakob 28.10.: no camera journeys through one world, so
// these are pieces for separate pictures, not a 3D town.
//   look(m, dusk): the palette of a picture · m 0 winter night (snow, indigo, warm windows) · 1 summer evening (gold, long shadows)
// Rules (kit): nothing created per frame except paths and gradients; seeded randomness only.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, prng, rad, lin, halo } = E;
// the factory: front facing south (the camera), sawtooth roof, clock over the gate, chimney
export const FACT = { X: -880, Z: 620, w: 760, h: 230, clock: { u: 0, v: -300, r: 74 }, chimney: { u: 290, w: 46, h: 560 } };
// places that light up on the map (7.08 / 7.09) and the stages of c08
// ======================================================================================================== palettes
// mood m: 0 winter night (snow, indigo, warm windows) · 1 summer evening (gold horizon, long shadows, sun) — and dusk via o.dusk
export function look(m, dusk = 0) {
  const s = clamp(m), dk = clamp(dusk);
  return {
    skyTop: mixHex(P.night0, mixHex(P.ind0, P.night0, dk), s),
    skyMid: mixHex(P.night1, mixHex(mixHex(P.ind1, P.blue1, .35), P.ind0, dk), s),
    skyLow: mixHex(P.ind0, mixHex(mixHex(P.halo1, P.shade0, .25), mixHex(P.shade0, P.ind1, .55), dk), s),
    groundFar: mixHex(mixHex(P.blue1, P.ind1, .35), mixHex(mixHex(P.shade0, P.ind2, .55), P.ind2, dk), s),
    groundNear: mixHex(P.night1, P.night0, s * .5),
    snow: 1 - s,
    card: mixHex(P.ind2, mixHex(P.night1, P.night0, .3), s),
    cardLit: mixHex(mixHex(P.ind2, P.blue1, .5), mixHex(P.ind2, P.shade0, .25 * (1 - dk)), s),
    rim: mixHex(mixHex(P.blue0, P.blue1, .3), mixHex(P.halo0, P.blue1, dk), s),
    leaf: mixHex(P.night1, P.ind2, .3),
    sun: s * (1 - dk),
  };
}

// ======================================================================================================== drawing pieces
// a house card (local: base centre at 0,0; up = -y)
function houseShape(w, h, gable) {
  const p = new Path2D(), hw = w / 2;
  if (gable) { p.moveTo(-hw, 0); p.lineTo(-hw, -h * .62); p.lineTo(0, -h); p.lineTo(hw, -h * .62); p.lineTo(hw, 0); p.closePath(); }
  else { p.moveTo(-hw, 0); p.lineTo(-hw, -h * .8); p.lineTo(hw, -h * .8); p.lineTo(hw, 0); p.closePath(); }
  return p;
}
const HOUSE_PATHS = new Map();
const housePath = (hs) => { const k = `${hs.w.toFixed(1)}|${hs.h.toFixed(1)}|${hs.gable}`; if (!HOUSE_PATHS.has(k)) HOUSE_PATHS.set(k, houseShape(hs.w, hs.h, hs.gable)); return HOUSE_PATHS.get(k); };

// window light per house: o.win(house) → 0..1 warmth (default by the seed)
export function drawHouse(ctx, hs, L, o = {}) {
  const p = housePath(hs), w = hs.w, h = hs.h;
  ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, L.card], [1, L.cardLit]]); ctx.fill(p);
  // roof light: snow cap (winter) or the warm rim of the low sun (summer)
  ctx.save(); ctx.clip(p);
  const top = hs.gable ? -h : -h * .8;
  if (L.snow > .02) { ctx.fillStyle = rgba(mixHex(P.blue1, P.cream, .35), .75 * L.snow); ctx.beginPath(); if (hs.gable) { ctx.moveTo(-w / 2 - 4, -h * .62 + 6); ctx.lineTo(0, top - 2); ctx.lineTo(w / 2 + 4, -h * .62 + 6); ctx.lineTo(w / 2, -h * .62 + 12); ctx.lineTo(0, top + 10); ctx.lineTo(-w / 2, -h * .62 + 12); } else ctx.rect(-w / 2, top, w, 9); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = L.rim; ctx.lineWidth = 2.2; ctx.beginPath();
  if (hs.gable) { ctx.moveTo(-w / 2, -h * .62); ctx.lineTo(0, -h); ctx.lineTo(w / 2, -h * .62); } else { ctx.moveTo(-w / 2, -h * .8); ctx.lineTo(w / 2, -h * .8); }
  ctx.stroke();
  // windows: two small panes; lit ones warm (the town's lights), dark ones indigo
  const wl = o.win ? o.win(hs) : (hs.lit < .55 ? 1 : 0);
  for (const xx of [-w * .24, w * .1]) {
    const lit = wl * (xx < 0 ? 1 : hs.lit < .3 ? 1 : .0);
    ctx.fillStyle = lit > .02 ? mixHex(P.night0, mixHex(P.halo0, P.core1, .3), lit) : rgba(P.night0, .8); ctx.fillRect(xx, -h * .5, w * .16, h * .2);
  }
}
const TREE = new Map();
export function drawTree(ctx, tr, L, leaf) {
  // leaf 0: bare winter tree (trunk + a few branches) · 1: full round canopy (summer)
  const h = tr.h, r = prng(tr.seed);
  ctx.strokeStyle = L.card; ctx.lineCap = 'round';
  ctx.lineWidth = h * .06; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -h * .55); ctx.stroke();
  if (leaf < .99) {
    ctx.lineWidth = h * .025;
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (r() - .5) * 1.6, y0 = -h * (.35 + r() * .3), l = h * (.25 + r() * .25); ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(Math.cos(a) * l, y0 + Math.sin(a) * l); ctx.stroke(); }
  }
  if (leaf > .01) {
    const k = smooth(leaf), cy = -h * .68, rr = h * .36 * k;
    ctx.fillStyle = lin(ctx, -rr, 0, rr, 0, [[0, L.leaf], [1, mixHex(L.leaf, L.rim, .25)]]);
    ctx.beginPath(); ctx.arc(0, cy, rr, 0, 6.29); ctx.arc(-rr * .55, cy + rr * .35, rr * .7, 0, 6.29); ctx.arc(rr * .55, cy + rr * .3, rr * .72, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(L.rim, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, cy, rr, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  }
}
// the factory front (local base centre). o.clock = { lit 0..1, hands: [h, m] in hours } ; o.win(i, row) → warmth of window i
export const FACT_PATH = (() => {
  const { w, h } = FACT, p = new Path2D(), n = 6, tw = w / n;
  p.moveTo(-w / 2, 0); p.lineTo(-w / 2, -h);
  for (let i = 0; i < n; i++) { const x0 = -w / 2 + i * tw; p.lineTo(x0 + tw * .78, -h - 70); p.lineTo(x0 + tw * .78, -h); p.lineTo(x0 + tw, -h); }
  p.lineTo(w / 2, 0); p.closePath();
  const tower = new Path2D(); tower.rect(-90, -h - 150, 180, 160); tower.moveTo(-104, -h - 150); tower.lineTo(0, -h - 230); tower.lineTo(104, -h - 150); tower.closePath();
  return { body: p, tower };
})();
export function sawtoothRoof(local = true) {   // the roof line points (local) for the curve → roof match in 7.02
  const { w, h } = FACT, n = 6, tw = w / n, o = [[-w / 2, -h]];
  for (let i = 0; i < n; i++) { const x0 = -w / 2 + i * tw; o.push([x0 + tw * .78, -h - 70], [x0 + tw * .78, -h], [x0 + tw, -h]); }
  return o;
}
export function drawFactory(ctx, L, t, o = {}) {
  const { w, h, chimney: ch } = FACT;
  // chimney behind (with smoke that drifts east)
  ctx.fillStyle = lin(ctx, ch.u - ch.w / 2, 0, ch.u + ch.w / 2, 0, [[0, L.card], [1, L.cardLit]]);
  ctx.beginPath(); ctx.moveTo(ch.u - ch.w / 2, -h + 20); ctx.lineTo(ch.u - ch.w * .38, -ch.h); ctx.lineTo(ch.u + ch.w * .38, -ch.h); ctx.lineTo(ch.u + ch.w / 2, -h + 20); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = L.rim; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ch.u - ch.w * .38, -ch.h); ctx.lineTo(ch.u + ch.w * .38, -ch.h); ctx.stroke();
  if (o.smoke !== false) {
    for (let i = 0; i < 7; i++) {
      const ph = (t * .05 + i / 7) % 1, x = ch.u + 20 + ph * 520 + 30 * Math.sin(ph * 5 + i), y = -ch.h - 30 - ph * 160, r = 26 + ph * 70;
      ctx.fillStyle = rgba(mixHex(L.cardLit, L.skyLow ?? P.ind1, .4), .38 * Math.sin(Math.PI * ph)); ctx.beginPath(); ctx.ellipse(x, y, r * 1.4, r * .7, -.15, 0, 6.29); ctx.fill();
    }
  }
  ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, L.card], [.6, mixHex(L.card, L.cardLit, .5)], [1, L.cardLit]]); ctx.fill(FACT_PATH.body); ctx.fill(FACT_PATH.tower);
  ctx.strokeStyle = L.rim; ctx.lineWidth = 2.4; ctx.beginPath();
  for (const [x, y] of sawtoothRoof()) ctx.lineTo(x, y);
  ctx.stroke();
  // windows: two rows of tall panes (departments) — warm or cool per o.win
  const win = o.win || ((i, row) => ((i * 7 + row * 3) % 5 === 0 ? .8 : 0));
  for (let row = 0; row < 2; row++) for (let i = 0; i < 12; i++) {
    if (row === 1 && (i === 5 || i === 6)) continue;                      // the gate
    const x = -w / 2 + 30 + i * (w - 60) / 12, y = -h + 40 + row * 90, k = win(i, row);
    ctx.fillStyle = k >= 0 ? mixHex(mixHex(P.night1, P.blue1, .4), mixHex(P.halo0, P.core1, .2), k) : mixHex(P.night1, mixHex(P.blue2, P.cream, .3), -k);
    ctx.fillRect(x, y, 34, 56);
  }
  // the gate
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(-58, -92); ctx.arc(0, -92, 58, Math.PI, 0); ctx.lineTo(58, 0); ctx.closePath(); ctx.fill();
  // the clock (the hero of 7.03): a disc of light in the tower
  const cl = o.clock || {}, cr = FACT.clock.r, cx = 0, cy = -h - 72;
  if ((cl.lit ?? 1) > 0) clockFace(ctx, cx, cy, cr, t, cl);
  return [cx, cy - 0];
}
export function clockFace(ctx, cx, cy, r, t, cl = {}) {
  const lit = cl.lit ?? 1;
  halo(ctx, cx, cy, r * 3.2, .35 * lit, P.halo1, P.halo0);
  ctx.fillStyle = rad(ctx, cx, cy - r * .2, r * 1.1, [[0, P.core0], [.35, P.core1], [.8, P.halo0], [1, P.halo1]]); ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = Math.max(1.5, r * .05); ctx.stroke();
  ctx.fillStyle = rgba(P.shade0, .75);
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; ctx.beginPath(); ctx.arc(cx + Math.sin(a) * r * .8, cy - Math.cos(a) * r * .8, r * (i % 3 ? .025 : .045), 0, 6.29); ctx.fill(); }
  const [hh, mm] = cl.hands || [8, 0];
  ctx.strokeStyle = P.night1; ctx.lineCap = 'round';
  const ha = (hh % 12 + mm / 60) / 12 * 6.283, ma = mm / 60 * 6.283;
  ctx.lineWidth = r * .09; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ha) * r * .48, cy - Math.cos(ha) * r * .48); ctx.stroke();
  ctx.lineWidth = r * .055; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ma) * r * .72, cy - Math.cos(ma) * r * .72); ctx.stroke();
}

// a porch (local base centre): house front with a roof overhang, two posts, steps, a lamp (o.lamp 0..1)
export function drawPorch(ctx, L, t, o = {}) {
  const w = 300, h = 210;
  ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, L.card], [1, L.cardLit]]);
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -h * .64); ctx.lineTo(0, -h); ctx.lineTo(w / 2, -h * .64); ctx.lineTo(w / 2, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = L.rim; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-w / 2, -h * .64); ctx.lineTo(0, -h); ctx.lineTo(w / 2, -h * .64); ctx.stroke();
  // door + window (warm)
  ctx.fillStyle = mixHex(P.night0, P.halo1, .55 * (o.door ?? 1)); ctx.fillRect(-28, -86, 40, 86);
  ctx.fillStyle = mixHex(P.night0, mixHex(P.halo0, P.core1, .3), .85 * (o.door ?? 1)); ctx.fillRect(48, -96, 52, 44);
  // the porch roof and posts (in front)
  ctx.fillStyle = mixHex(L.card, P.night0, .3); ctx.beginPath(); ctx.moveTo(-w / 2 - 34, -118); ctx.lineTo(w / 2 + 34, -118); ctx.lineTo(w / 2 + 20, -134); ctx.lineTo(-w / 2 - 20, -134); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = L.rim; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2 - 20, -134); ctx.lineTo(w / 2 + 20, -134); ctx.stroke();
  ctx.fillStyle = mixHex(L.card, P.night0, .2); for (const x of [-w / 2 - 24, w / 2 + 16]) ctx.fillRect(x, -118, 8, 118);
  ctx.fillRect(-w / 2 - 34, -14, w + 68, 14);   // the floor boards
  // the lamp under the roof
  if ((o.lamp ?? 0) > 0) { halo(ctx, -w / 2 + 40, -104, 120, .55 * o.lamp, P.halo1, P.core1); ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(-w / 2 + 40, -104, 6, 0, 6.29); ctx.fill(); }
}

// people as cards: a plain indigo silhouette (never yellow). o: person() options + hat
export function drawPerson(ctx, h, o = {}) {
  const hands = E.person(ctx, 0, 0, h, o);
  if (o.hat) {   // a hat with a brim (Kellogg, the father): over the head
    const d = o.dir ?? 1, hx = ((o.view === 'side' || o.walk != null) ? .012 : 0) * d * h, hy = -.93 * h;
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(hx, hy + .02 * h, .115 * h, .022 * h, 0, 0, 6.29); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx - .06 * h, hy + .02 * h); ctx.lineTo(hx - .055 * h, hy - .06 * h); ctx.quadraticCurveTo(hx, hy - .085 * h, hx + .055 * h, hy - .06 * h); ctx.lineTo(hx + .06 * h, hy + .02 * h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(o.rim || P.blue0, .9); ctx.lineWidth = .012 * h; ctx.beginPath(); ctx.moveTo(hx - .055 * h, hy - .06 * h); ctx.quadraticCurveTo(hx, hy - .085 * h, hx + .055 * h, hy - .06 * h); ctx.stroke();
  }
  return hands;
}
