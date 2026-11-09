// Film 23 · world kit (owned by the lead; builders import, never edit). THE STREET IN SECTION (docs/MOTION.md §2).
// One physical world, perspective camera without pitch or roll (lib/f10_editorial cam3 / camAt): X right, Y DOWN (ground Y = 0,
// up is negative), Z away from the camera. World units = design px at depth F0 (1700). The horizon is always the screen's middle line.
//
//   CAMERA      look(X, Y, Z, s, sx?, sy?)   the camera that shows world point (X, Y, Z) at screen (sx, sy) with s screen px per world unit
//               wp(c, X, Y, Z) → [x, y, s]   project a world point;  atZ(ctx, c, Z, fn) draw in world units on the plane at depth Z
//               camAt(t, K, ref) from f10_editorial: keys [[t, cam, ease]]; pass the subject depth as ref (ZS for the street)
//   WORLD       world(ctx, c, t, o)          everything back to front: sky, skyline, tower, testers' house, back rows, the street in
//                                             section (clinic, your building, Dad's building), the street front. o: see WORLD_DEFAULTS.
//               layers you can call alone: sky, skyline, tower, testersHouse, backRow, streetRow, streetFront
//   PLACES      STREET (all layout numbers), KITCHEN, LIGHTWALL (the wall's light area), floorY(level)
//               kitchen(ctx, t, o) / yourBuilding / dadBuilding / clinic: drawn in world units inside atZ(…, ZS, …)
//   SCAN        scanArt(ctx, x, y, w, h, t, o)  the chest scan as light (o.draw sweep 0..1, o.ring 0..1, o.tight 0..1, o.a)
//   FIGURES     you(ctx, x, y, h, t, o) (yellow: hoodie indoors, o.out → raincoat), kid, dad, other; alive(t, seed); steam
//   OBJECTS     voiceLight, answerCube, qStep, agentLight, thread, capsule, road, monthTicks, earbuds, bubble, library,
//               notebook, handwrite, priceTag, phone, coolPoint (all in the caller's coordinates; signatures: docs/BRIEF-builders.md §5)
// Rules: no canvas/pattern per frame; Path2D caches only for static shapes. Gold = human care; COOL = the machine; yellow = you only.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { life, blink as blinkOf } from './figure.mjs';
import { COOL } from './f23_hud.mjs';
const { W, H, P, F0, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, prng, drift, halo, cam3 } = E;
export { COOL };

export const PRINT23 = { grain: 14, floor: 4, vig: .5 };
// warm room light (lamps, the hallway door, pools on floors): a saturated gold so it stays gold over the indigo (thumbnail A)
export const WARM = { deep: '#b97a2a', mid: '#e3a744', hi: '#f6d78a' };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ================================================================================================================ camera
export function wp(c, X, Y, Z) { const dz = Z - c.z; if (dz < 30) return null; const s = c.f / dz; return [W / 2 + (X - c.x) * s, H / 2 + (Y - c.y) * s, s]; }
export function atZ(ctx, c, Z, fn) {
  const dz = Z - c.z; if (dz < 30) return false; const s = c.f / dz;
  ctx.save(); ctx.setTransform(s, 0, 0, s, W / 2 - c.x * s, H / 2 - c.y * s); fn(s); ctx.restore(); return true;
}
export function look(X, Y, Z, s, sx = W / 2, sy = H / 2, f = F0) { const dz = f / s; return cam3({ x: X - (sx - W / 2) / s, y: Y - (sy - H / 2) / s, z: Z - dz, f }); }

// ================================================================================================================ layout
export const ZS = 3000;            // the section plane (the street's buildings, cut open)
export const ZFRONT = 2400;        // the street front: kerb, lamp posts, trees
export const FLOOR = 520, SLAB = 30;
export const floorY = (level) => -level * FLOOR;           // top of the floor of a level (ground floor = level 0)
export const STREET = {
  you: { x0: -2600, x1: -200, floors: 4, level: 2 },       // your building, open in section
  hall: [-2600, -2000], kitchen: [-2000, -1000], kidRoom: [-1000, -200],
  clinic: { x0: -5600, x1: -4500, floors: 2, win: [-5130, -900, 200, 640] },   // the clinic's tall warm window [x, y, w, h]
  dad: { x0: 4200, x1: 6400, floors: 5, level: 3, balcony: [6400, 6760] },      // Dad's flat on level 3, side balcony to the right
  tower: { x: 4000, z: 16000, w: 1300, h: 7200 },
  testers: { x: 600, z: 9000, w: 820, h: 560 },
  rows: [{ z: 5200, x0: -11000, x1: 11000, h: [900, 2500], seed: 51 }, { z: 8200, x0: -17000, x1: 17000, h: [1300, 3400], seed: 83 }],
  skyline: { z: 24000 },
};
// rooms have depth: the cut (front) at ZS, the back wall at ZB. Everything inside a room lives between the two planes.
export const DEPTH = 600, ZB = ZS + DEPTH;
const KY = floorY(2), KC = KY - (FLOOR - SLAB);
export const KITCHEN = {
  x0: -2000, x1: -1000, floor: KY, ceil: KC, zBack: ZB,
  counter: { x0: -1992, x1: -1745, top: KY - 80, z0: ZB - 100 },                  // along the back wall, left (hip height of you: 140 tall)
  kettle: [-1935, KY - 80, ZB - 45], phone: [-1790, KY - 80, ZB - 92],          // [X, Y, Z]
  table: { x0: -1460, x1: -1100, top: KY - 62, z0: ZB - 250, z1: ZB - 90 },      // the dinner table under the light wall (stools, seat KY - 40; no chair backs over the wall)
  lamp: { x: -1050, y: KC + 190, z: ZB - 200 },                                 // the pendant right of the light wall (never in front of it)
  door: { top: KY - 300, z0: ZS + 250, z1: ZS + 450 },                          // the open door in the left wall (to the lit hallway)
  you: [-1700, KY, ZB - 120],                                                   // where you stand in the opening (thumbnail A) [X, Y, Z]
  seatY: KY - 40,                                                                 // stool seat height (sitting figures: hips here)
  seats: { left: [-1500, ZB - 170], right: [-1060, ZB - 170], front: [-1280, ZB - 300] },   // dinner places [X, Z] (feet on KY)
};
export const LIGHTWALL = { x: -1620, y: KC + 20, w: 520, h: 400, z: ZB };      // the light area of the back wall (scan, explainers, the old screen)
LIGHTWALL.cx = LIGHTWALL.x + LIGHTWALL.w / 2; LIGHTWALL.cy = LIGHTWALL.y + LIGHTWALL.h / 2;
// the old screen on the light wall (16:9, centred in the light area), world units on the plane ZB
export const SCREEN = { x: LIGHTWALL.x + 10, y: LIGHTWALL.cy - (LIGHTWALL.w - 20) * 9 / 32, w: LIGHTWALL.w - 20, z: ZB };
// the camera of the opening (thumbnail A): the hallway light through the door at the left, the counter, you with the mug,
// the scan on the light wall right of centre (back wall magnified 1.75: the scan spans ≈ 910 × 700 px), the floor band below
export const CAM_THUMB = look(LIGHTWALL.cx, KY, ZB, 1.75, 1410, 907);
// the wall camera of the dinner chunks (plateWall): the whole light wall (≈ 1014 × 780 px, top at y 60), the table's edge at y ≈ 880
export const CAM_WALL = look(LIGHTWALL.cx, LIGHTWALL.y, ZB, 1.95, 960, 60);
// the camera at the end of the clip push: the old screen (SCREEN) spans x 266–1754, y 161–998 (MOTION §5); it is inside the kitchen
export const CAM_SCREEN = look(SCREEN.x + SCREEN.w / 2, SCREEN.y + SCREEN.w * 9 / 32, ZB, 1488 / SCREEN.w, 960, 579.5);

// ================================================================================================================ the light of the hours
// hour (float, 0..24) → the sky and the light. 2026-11-09 (Jakob): the day hours are DAYLIGHT (MOTION §7): 07:30, 09:00, 12:00, 16:00
// get a bright blue day sky with a golden sun; facades, street and rooms lift by L.day (0 night … 1 full day), windows mostly unlit, street
// lamps off. Shadows keep the deep blues, gold stays the one accent. 06:15 dawn, 19:00 dusk and 22:30 night are unchanged (day 0).
//   L = { h, top, hor, gold (warm horizon band), star, win (lit window share), day 0..1 (daylight: colours of facades/street/rooms), sun 0..1 }
export const DAYC = {   // the daylight colours (L.day = 1); night colours stay where they were
  face: '#3c61c6', faceLo: '#1f3d9c', rim: '#9fb8f2', side: '#7898ea', glass: '#1a3288', warm: '#f6d27e',
  street: '#3a58b4', streetLo: '#1c348a', ground: '#26429c', front: '#3150a8', frontLo: '#182e80',
  tree: '#24499f', treeLit: '#5b86e0', wall: '#5878cc', wallLo: '#2e4ca6', cut: '#7290de', floor: '#3c5ab0',
  ceil: '#24409a', sideW: '#3656ae', furn: '#1d3488',
};
const HOURS_LOOK = [
  [0, { top: P.night0, hor: P.ind0, gold: 0, star: 1, win: .1, day: 0 }],
  [5.6, { top: P.night0, hor: P.ind0, gold: 0, star: 1, win: .12, day: 0 }],
  [6.25, { top: P.night0, hor: P.ind1, gold: .55, star: .8, win: .16, day: 0 }],
  [7.5, { top: '#1b3ea8', hor: '#6f93e4', gold: .55, star: 0, win: .06, day: .82 }],    // morning: day blue, the low sun's gold band left
  [9, { top: '#1c43b6', hor: '#79a0ee', gold: .2, star: 0, win: .04, day: 1 }],
  [12, { top: '#1f49be', hor: '#86abf3', gold: .12, star: 0, win: .03, day: 1 }],       // noon: the brightest sky of the film
  [16, { top: '#1d43b2', hor: '#93b0ec', gold: .55, star: 0, win: .05, day: .9 }],      // afternoon: warm band, low sun right
  // 19:00 dinner (B3 rework 9.11.): golden last light at 18.6–19.2 (an orange-gold horizon, warm windows), evening by ~20:00
  [18.6, { top: P.ind1, hor: '#d99a5c', gold: .9, star: .05, win: .34, day: .22 }],
  [19.2, { top: mixHex(P.ind1, P.night1, .35), hor: mixHex('#d99a5c', P.ind1, .35), gold: .7, star: .2, win: .42, day: 0 }],
  [20.2, { top: P.night1, hor: P.ind1, gold: .15, star: .5, win: .42, day: 0 }],
  [22.5, { top: P.night0, hor: P.ind0, gold: 0, star: 1, win: .28, day: 0 }],
  [24, { top: P.night0, hor: P.ind0, gold: 0, star: 1, win: .1, day: 0 }],
];
export function hourLook(h) {
  h = ((h % 24) + 24) % 24; let i = 0; while (i < HOURS_LOOK.length - 2 && HOURS_LOOK[i + 1][0] <= h) i++;
  const [h0, a] = HOURS_LOOK[i], [h1, b] = HOURS_LOOK[i + 1], u = sineIO((h - h0) / (h1 - h0));
  return { h, top: mixHex(a.top, b.top, u), hor: mixHex(a.hor, b.hor, u), gold: lerp(a.gold, b.gold, u), star: lerp(a.star, b.star, u), win: lerp(a.win, b.win, u), day: lerp(a.day, b.day, u), sun: clamp(1 - Math.abs(h - 12.5) / 6) };
}
const dayMix = (night, dayCol, L, k = 1) => (L && L.day > 0 ? mixHex(night, dayCol, clamp(L.day * k)) : night);
// the sun / moon in the world (Z 40000): east (left) at 7, high at 12.5, west (right) at 18.5
function sunPos(h, arc = 1) { const a = Math.PI * clamp((h - 6.6) / 12.2, -.1, 1.1); return [-26000 * Math.cos(a), -2000 - 15000 * arc * Math.sin(a)]; }
function moonPos(h) { const hh = ((h - 19 + 24) % 24); const a = Math.PI * clamp(hh / 11, -.1, 1.1); return [-22000 * Math.cos(a), -3000 - 13000 * Math.sin(a)]; }

// ================================================================================================================ sky (screen space, horizon = H/2)
export function sky(ctx, c, t, o = {}) {
  const L = hourLook(o.hour ?? 6.25);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const hy = H / 2 - (c.y < -2600 ? 0 : 0);
  ctx.fillStyle = lin(ctx, 0, hy - 1500, 0, hy, [[0, L.top], [.62, mixHex(L.top, L.hor, .5)], [1, L.hor]]); ctx.fillRect(0, 0, W, H);
  if (L.gold > .01) {   // a thin warm band on the horizon (dawn / dusk)
    ctx.fillStyle = lin(ctx, 0, hy - 160, 0, hy + 4, [[0, rgba(P.halo2, 0)], [.8, rgba(P.halo1, .22 * L.gold)], [1, rgba(P.core1, .55 * L.gold)]]); ctx.fillRect(0, hy - 160, W, 164);
  }
  if (L.star > .02) E.stars(ctx, 2337, 140, t, [-200 - c.x * .004, 0, W + 400, hy - 60], .7 * L.star);
  const sz = 40000, k = c.f / (sz - c.z);
  if (L.day > .02) {   // daylight: a few long flat cloud streaks (cream, very soft), drifting slowly with a little parallax
    const kc = c.f / (30000 - c.z), dr = t * 6;
    for (const [cx0, cy0, w, h] of [[-9000, -9800, 9000, 240], [6000, -12500, 12000, 300], [19000, -8400, 7000, 200], [-24000, -11200, 10000, 260], [32000, -10600, 8000, 220]]) {
      const x = W / 2 + (cx0 + dr - c.x) * kc, y = H / 2 + (cy0 - c.y) * kc, ww = w * kc, hh = Math.max(3, h * kc);
      if (x + ww < 0 || x - ww > W || y > hy) continue;
      ctx.fillStyle = rgba(P.cream, .1 * L.day); ctx.beginPath(); ctx.roundRect(x - ww / 2, y - hh / 2, ww, hh, hh / 2); ctx.fill();
      ctx.fillStyle = rgba(P.cream, .06 * L.day); ctx.beginPath(); ctx.roundRect(x - ww * .3, y - hh * 1.6, ww * .55, hh * .8, hh * .4); ctx.fill();
    }
  }
  if (o.sun !== false && L.sun > 0) {
    const [sx, sy] = sunPos(L.h, o.sunArc ?? 1), x = W / 2 + (sx - c.x) * k, y = H / 2 + (sy - c.y) * k, r = Math.max(10, 1400 * k * (1 + .5 * L.day));
    if (y < hy + r) {
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hy); ctx.clip();
      if (L.day > 0) { const R = r * 13; ctx.fillStyle = rad(ctx, x, y, R, [[0, rgba(DAYC.warm, .62 * L.day)], [.22, rgba(DAYC.warm, .26 * L.day)], [.6, rgba(DAYC.warm, .06 * L.day)], [1, rgba(DAYC.warm, 0)]]); ctx.fillRect(x - R, y - R, R * 2, R * 2); }   // the warm day glow round the sun
      halo(ctx, x, y, r * 7, .35); ctx.fillStyle = rad(ctx, x, y, r, [[0, P.core0], [.6, P.core1], [1, P.halo0]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill(); ctx.restore();
    }
  }
  const hm = ((L.h - 19 + 24) % 24);
  if (o.moon !== false && hm < 11) {
    const [mx, my] = moonPos(L.h), x = W / 2 + (mx - c.x) * k, y = H / 2 + (my - c.y) * k, r = Math.max(8, 900 * k);
    ctx.fillStyle = rad(ctx, x, y, r * 6, [[0, rgba(COOL.mid, .25)], [1, rgba(COOL.mid, 0)]]); ctx.fillRect(x - r * 6, y - r * 6, r * 12, r * 12);
    ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
    ctx.fillStyle = mixHex(L.top, P.night1, .3); ctx.beginPath(); ctx.arc(x + r * .42, y - r * .2, r * .86, 0, 6.29); ctx.fill();   // crescent
  }
  ctx.restore();
  return L;
}

// ================================================================================================================ windows (the map of the city)
// every facade window of the city as data: { X, Y, Z, w, h, r (0..1 random), q (0..1 second random), id }. Lit if r < o.win (hour).
const ROWS = new Map();
function rowBuildings(R) {
  if (ROWS.has(R.seed)) return ROWS.get(R.seed);
  const rnd = prng(R.seed), out = []; let x = R.x0;
  while (x < R.x1) {
    const w = 420 + rnd() * 760, h = R.h[0] + rnd() ** 1.6 * (R.h[1] - R.h[0]), gap = 30 + rnd() * 160;
    const b = { x0: x, x1: x + w, h, roof: rnd() < .3 ? 'step' : rnd() < .5 ? 'flat' : 'cap', wins: [] };
    const cols = Math.max(2, Math.round(w / 170)), rows = Math.max(2, Math.round(h / 260)), cw = w / cols, rh = h / rows;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      if (j === rows - 1 && rnd() < .5) continue;
      b.wins.push({ X: x + cw * (i + .5), Y: -h + rh * (j + .55), Z: R.z, w: cw * .46, h: rh * .5, r: rnd(), q: rnd(), id: `${R.seed}:${out.length}:${j}:${i}` });
    }
    out.push(b); x += w + gap;
  }
  ROWS.set(R.seed, out); return out;
}
// the facade buildings of the street row (ZS) besides yours and the clinic (left and right of them)
const SROW = [
  { x0: -4300, x1: -3300, h: 1500, seed: 3 }, { x0: -3200, x1: -2700, h: 1150, seed: 5 },
  { x0: -100, x1: 1500, h: 1620, seed: 7 }, { x0: 1600, x1: 2600, h: 1100, seed: 9 }, { x0: 2700, x1: 4050, h: 1900, seed: 11 },
  { x0: 6900, x1: 8200, h: 1500, seed: 13 }, { x0: -7600, x1: -5750, h: 1300, seed: 15 }, { x0: 8300, x1: 9800, h: 2100, seed: 17 },
];
for (const b of SROW) {
  const rnd = prng(b.seed * 31), cols = Math.max(2, Math.round((b.x1 - b.x0) / 230)), rows = Math.round(b.h / FLOOR), cw = (b.x1 - b.x0) / cols;
  b.wins = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) b.wins.push({ X: b.x0 + cw * (i + .5), Y: -FLOOR * (j + .5) - 20, Z: ZS, w: cw * .5, h: FLOOR * .46, r: rnd(), q: rnd(), id: `s${b.seed}:${j}:${i}` });
}
// all windows (facades of the street row, the two back rows) + the rooms of your building and Dad's as "windows" (for the fans of 1.05 etc.)
let ALLWIN = null;
export function cityWindows() {
  if (ALLWIN) return ALLWIN;
  ALLWIN = [];
  for (const b of SROW) ALLWIN.push(...b.wins);
  for (const R of STREET.rows) for (const b of rowBuildings(R)) ALLWIN.push(...b.wins);
  const rnd = prng(404);
  for (let l = 0; l < STREET.you.floors; l++) for (const [a, b] of [[-2600, -1400], [-1400, -200]]) ALLWIN.push({ X: (a + b) / 2, Y: floorY(l) - 230, Z: ZS, w: 300, h: 200, r: rnd(), q: rnd(), id: `you:${l}:${a}`, room: true });
  for (let l = 0; l < STREET.dad.floors; l++) for (const [a, b] of [[4200, 5300], [5300, 6400]]) ALLWIN.push({ X: (a + b) / 2, Y: floorY(l) - 230, Z: ZS, w: 300, h: 200, r: rnd(), q: rnd(), id: `dad:${l}:${a}`, room: true });
  ALLWIN.push({ X: STREET.kitchen[0] / 2 + STREET.kitchen[1] / 2, Y: KY - 230, Z: ZS, w: 300, h: 200, r: 0, q: 0, id: 'kitchen', room: true, yours: true });
  return ALLWIN;
}
// o.win: lit share (default by hour) · o.cool 0..1: share of windows with a small cool machine point · o.winFn(w) → {lit 0..1, gold 0..1, cool 0..1} override
function winLook(wn, o) {
  if (o.winFn) { const r = o.winFn(wn); if (r) return r; }
  return { lit: wn.r < o.win ? 1 : 0, gold: 0, cool: wn.q < (o.cool ?? 0) && wn.r < .6 ? 1 : 0 };
}
function drawWin(ctx, wn, L, o, s) {
  const k = winLook(wn, o), x = wn.X - wn.w / 2, y = wn.Y - wn.h / 2;
  ctx.fillStyle = dayMix(mixHex(P.night0, L.top, .25), DAYC.glass, L); ctx.fillRect(x, y, wn.w, wn.h);
  if (L.day > 0 && k.lit < 1) { ctx.fillStyle = rgba(P.cream, .07 * L.day * (1 - k.lit)); ctx.beginPath(); ctx.moveTo(x, y + wn.h * .7); ctx.lineTo(x + wn.w * .55, y); ctx.lineTo(x + wn.w * .85, y); ctx.lineTo(x, y + wn.h); ctx.closePath(); ctx.fill(); }   // a sky sheen on the glass
  if (k.lit > 0) { ctx.fillStyle = lin(ctx, 0, y, 0, y + wn.h, [[0, rgba(P.halo1, k.lit)], [1, rgba(P.core1, k.lit)]]); ctx.fillRect(x, y, wn.w, wn.h); }
  if (k.gold > 0) {   // care arrived: a warm glow round the window
    ctx.fillStyle = rad(ctx, wn.X, wn.Y, wn.w * 1.6, [[0, rgba(P.core1, .55 * k.gold)], [.5, rgba(P.halo0, .25 * k.gold)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(wn.X - wn.w * 1.6, wn.Y - wn.w * 1.6, wn.w * 3.2, wn.w * 3.2);
    ctx.fillStyle = rgba(P.core0, k.gold); ctx.fillRect(x + wn.w * .12, y + wn.h * .12, wn.w * .76, wn.h * .76);
  }
  if (k.cool > 0) coolPoint(ctx, wn.X + wn.w * .18, wn.Y + wn.h * .2, Math.max(wn.w * .12, 2.4 / s), k.cool);
}
// a tiny machine light (a device in a room): cool core + soft bloom
export function coolPoint(ctx, x, y, r, a = 1) {
  if (a <= 0) return;
  ctx.fillStyle = rad(ctx, x, y, r * 4, [[0, rgba(COOL.mid, .5 * a)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
  ctx.fillStyle = rgba(COOL.core, a); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
}

// ================================================================================================================ buildings
function facade(ctx, x0, x1, h, L, o, s, roof = 'flat', wins = []) {
  const top = -h, rim = Math.max(1.2 / s, 2);
  ctx.fillStyle = lin(ctx, 0, top, 0, 0, [[0, dayMix(mixHex(P.ind2, L.top, .25), DAYC.face, L)], [1, dayMix(mixHex(P.night1, P.night0, .4), DAYC.faceLo, L)]]);
  ctx.beginPath(); ctx.rect(x0, top, x1 - x0, h);
  if (roof === 'step') ctx.rect(x0 + (x1 - x0) * .2, top - 140, (x1 - x0) * .4, 140);
  if (roof === 'cap') ctx.rect(x0 + (x1 - x0) * .55, top - 90, (x1 - x0) * .2, 90);
  ctx.fill();
  ctx.fillStyle = rgba(dayMix(P.blue0, DAYC.rim, L), .9); ctx.fillRect(x0, top - rim * .5, x1 - x0, rim);              // the lit roof rim
  if (L.day > 0) { ctx.fillStyle = lin(ctx, 0, top, 0, top + h * .55, [[0, rgba(DAYC.warm, .2 * L.day)], [1, rgba(DAYC.warm, 0)]]); ctx.fillRect(x0, top, x1 - x0, h * .55); }   // the sun on the upper floors
  if (L.day > 0) { const sl = Math.min((x1 - x0) * .12, 90); ctx.fillStyle = lin(ctx, x1 - sl, 0, x1, 0, [[0, rgba(DAYC.side, 0)], [1, rgba(DAYC.side, .45 * L.day)]]); ctx.fillRect(x1 - sl, top, sl, h); }   // the sunlit side
  ctx.fillStyle = rgba(P.blue1, .35); ctx.fillRect(x1 - rim * 2, top, rim * 2, h);                   // light on one side
  for (const wn of wins) drawWin(ctx, wn, L, o, s);
}
export function backRow(ctx, c, t, R, o = {}) {
  const L = o.L || hourLook(o.hour ?? 6.25), oo = { win: L.win, ...o };
  atZ(ctx, c, R.z, (s) => {
    const sw = (W / 2 + 200) / s, cx = c.x;
    for (const b of rowBuildings(R)) { if (b.x1 < cx - sw || b.x0 > cx + sw) continue; facade(ctx, b.x0, b.x1, b.h, L, oo, s, b.roof, b.wins); }
    ctx.fillStyle = dayMix(mixHex(P.night1, P.night0, .5), DAYC.ground, L); ctx.fillRect(cx - sw, 0, sw * 2, 40000);
  });
}
export function skyline(ctx, c, t, o = {}) {
  const L = o.L || hourLook(o.hour ?? 6.25);
  atZ(ctx, c, STREET.skyline.z, (s) => {
    const rnd = prng(991); ctx.fillStyle = dayMix(mixHex(L.hor, P.ind0, .55), mixHex(L.hor, '#2a50c0', .55), L); ctx.beginPath(); ctx.moveTo(-60000, 0);
    for (let x = -60000; x < 60000; x += 900 + rnd() * 1400) { const h = 900 + rnd() ** 2 * 4200; ctx.lineTo(x, -h); ctx.lineTo(x + 700 + rnd() * 900, -h); }
    ctx.lineTo(60000, 0); ctx.lineTo(60000, 60000); ctx.lineTo(-60000, 60000); ctx.closePath(); ctx.fill();
  });
}
// THE NIGHT-SHIFT TOWER: a tall slab whose windows glow machine-cool. o.glow 0..1 (the windows light bottom → top), o.open 0..1 (the
// front facade slides up and shows the floors: rows of tireless cool minds), o.thread (a point [X,Y] in world units for a cool thread start)
export function tower(ctx, c, t, o = {}) {
  const T = STREET.tower, L = o.L || hourLook(o.hour ?? 6.25), glow = o.glow ?? 1, open = clamp(o.open ?? 0);
  atZ(ctx, c, T.z, (s) => {
    const x0 = T.x - T.w / 2, top = -T.h;
    ctx.fillStyle = rad(ctx, T.x, -T.h * .5, T.h * .7, [[0, rgba(COOL.edge, .16 * glow)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(T.x - T.h, -T.h * 1.3, T.h * 2, T.h * 1.6);
    ctx.fillStyle = lin(ctx, x0, 0, x0 + T.w, 0, [[0, dayMix(mixHex(P.ind2, P.night1, .3), DAYC.faceLo, L, .8)], [1, dayMix(mixHex(P.ind1, COOL.deep, .25), DAYC.face, L, .8)]]); ctx.fillRect(x0, top, T.w, T.h);
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(T.x - 40, top - 420, 80, 420); ctx.fillRect(T.x - 160, top - 60, 320, 60);   // mast
    ctx.fillStyle = rgba(COOL.mid, .9); ctx.beginPath(); ctx.arc(T.x, top - 420, 26 + 6 * Math.sin(t * 2.1), 0, 6.29); ctx.fill();   // the mast light breathes
    const rows = 36, cols = 7, rh = T.h / rows, cw = T.w / cols, rnd = prng(7070);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const r = rnd(), y = top + rh * (j + .25), x = x0 + cw * (i + .2), lit = clamp((glow * 1.25 - (1 - (j + 1) / rows) * .25 - r * .2) * 4);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x, y, cw * .6, rh * .5);
      if (lit > 0) { ctx.fillStyle = rgba(mixHex(COOL.mid, COOL.core, r), lit * (.75 + .25 * Math.sin(t * .7 + r * 9))); ctx.fillRect(x, y, cw * .6, rh * .5); }
    }
    if (open > 0) {   // the front slides up: inside, floor after floor of small cool orbs at desks, working through the night
      const oh = T.h * smooth(open);
      ctx.save(); ctx.beginPath(); ctx.rect(x0, -oh, T.w, oh); ctx.clip();
      ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(x0, -oh, T.w, oh);
      for (let j = 0; j < rows; j++) {
        const y = -rh * j; ctx.fillStyle = rgba(P.blue1, .6); ctx.fillRect(x0, y - 8, T.w, 8);
        for (let i = 0; i < 9; i++) { const xx = x0 + T.w * (i + .5) / 9, p = .5 + .5 * Math.sin(t * 1.3 + i * 1.7 + j * 2.3); coolPoint(ctx, xx, y - rh * .45, rh * .12, .6 + .4 * p); }
      }
      ctx.restore();
      ctx.fillStyle = rgba(COOL.core, .8); ctx.fillRect(x0, -oh - 6, T.w, 6);
    }
    ctx.fillStyle = rgba(COOL.mid, .5); ctx.fillRect(x0 + T.w - 10, top, 10, T.h);
  });
}
// THE TESTERS' HOUSE: small, warm lamp, a visible gap to the tower. o.open 0..1 (the front wall folds down: the testers at their table)
export function testersHouse(ctx, c, t, o = {}) {
  const T = STREET.testers, open = clamp(o.open ?? 0);
  atZ(ctx, c, T.z, (s) => {
    const x0 = T.x - T.w / 2, x1 = T.x + T.w / 2, h = T.h;
    ctx.fillStyle = rad(ctx, T.x, -h * .4, T.w * 1.2, [[0, rgba(P.halo0, .22)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(T.x - T.w * 1.2, -h * 1.6, T.w * 2.4, h * 1.7);
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(x0, -h, T.w, h);
    ctx.beginPath(); ctx.moveTo(x0 - 40, -h); ctx.lineTo(T.x, -h - 300); ctx.lineTo(x1 + 40, -h); ctx.closePath(); ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fill();
    ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = Math.max(2 / s, 6); ctx.beginPath(); ctx.moveTo(x0 - 40, -h); ctx.lineTo(T.x, -h - 300); ctx.lineTo(x1 + 40, -h); ctx.stroke();
    // interior (always drawn; the front covers it until it opens)
    ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, mixHex(P.ind1, P.halo1, .25)], [1, mixHex(P.night1, P.halo1, .2)]]); ctx.fillRect(x0 + 30, -h + 20, T.w - 60, h - 20);
    ctx.fillStyle = rad(ctx, T.x, -h + 160, 360, [[0, rgba(P.core1, .7)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x0, -h, T.w, h);
    ctx.fillStyle = P.night1; ctx.fillRect(T.x - 220, -150, 440, 22); ctx.fillRect(T.x - 200, -128, 16, 128); ctx.fillRect(T.x + 184, -128, 16, 128);   // the table
    for (const [dx, hh] of [[-150, 240], [0, 230], [150, 250]]) E.person(ctx, T.x + dx, -6, hh, { light: -1, look: .2 });
    if (open < 1) {   // the front wall: hinged at the bottom, folds toward us (its height shrinks)
      const fh = h * (1 - smooth(open));
      ctx.fillStyle = mixHex(P.night1, P.ind1, .55); ctx.fillRect(x0, -fh, T.w, fh);
      if (fh > 120) { const wy = -fh + fh * .22; ctx.fillStyle = lin(ctx, 0, wy, 0, wy + fh * .36, [[0, P.core1], [1, P.halo0]]); ctx.fillRect(T.x - 120, wy, 240, fh * .36); }   // the warm lamp window
    }
  });
}
// THE CLINIC: low building at the left end of the street, one tall warm window. o: { glow 0..1 (halo), lit 0..1 (0: dark for the night) }
export function clinic(ctx, t, L, o = {}, s = 1) {
  const C = STREET.clinic, h = C.floors * FLOOR, [wx, wy, ww, wh] = C.win;
  facade(ctx, C.x0, C.x1, h, L, { win: 0 }, s, 'flat', []);
  ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fillRect(C.x0 - 60, -h - 40, C.x1 - C.x0 + 120, 50);
  const g = o.glow ?? 1, lit = o.lit ?? 1, dk = (col) => mixHex(mixHex(P.night0, L.top, .25), col, lit);   // lit 0: closed for the night
  ctx.fillStyle = rad(ctx, wx, wy, wh * 1.1, [[0, rgba(P.halo0, .35 * g * lit)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(wx - wh * 1.1, wy - wh * 1.1, wh * 2.2, wh * 2.2);
  ctx.fillStyle = lin(ctx, 0, wy - wh / 2, 0, wy + wh / 2, [[0, dk(P.core0)], [.5, dk(P.core1)], [1, dk(P.halo0)]]); ctx.fillRect(wx - ww / 2, wy - wh / 2, ww, wh);
  ctx.fillStyle = rgba(P.shade0, .5); ctx.fillRect(wx - 3, wy - wh / 2, 6, wh); ctx.fillRect(wx - ww / 2, wy - wh * .1, ww, 6);
  // the small ring sign over the door (care), no text
  ctx.strokeStyle = rgba(P.core1, .9); ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(C.x0 + 220, -h * .78, 46, 0, 6.29); ctx.stroke();
  ctx.fillStyle = rgba(dk(P.halo0), .8); ctx.fillRect(C.x0 + 160, -300, 120, 300);   // the lit door
}
export const CLINIC_WIN = [STREET.clinic.win[0], STREET.clinic.win[1], ZS];

// ================================================================================================================ rooms in depth
// a projected polygon (world points [X, Y, Z]) filled in screen space; returns the screen points (or null)
export function quad(ctx, c, pts, fill) {
  const q = pts.map((p) => wp(c, p[0], p[1], p[2])); if (q.some((v) => !v)) return null;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  ctx.fillStyle = typeof fill === 'function' ? fill(q) : fill; ctx.fill(); ctx.restore(); return q;
}
// a soft light pool on a floor (centre X, Z, radius r in world units)
export function floorPool(ctx, c, X, Y, Z, r, col, a, warm = col === WARM.mid || col === WARM.hi) {
  const p = wp(c, X, Y, Z), p1 = wp(c, X, Y, Math.max(Z - r, c.z + 31)), p2 = wp(c, X, Y, Z + r); if (!p || !p1 || !p2 || a <= 0) return;   // the near edge clamps at the camera (no pop when it passes it)
  const rx = r * p[2], ry = Math.max(1, Math.abs(p1[1] - p2[1]) / 2);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(p[0], p[1]); ctx.scale(1, ry / rx);
  if (warm) ctx.fillStyle = rad(ctx, 0, 0, rx, [[0, rgba(col, Math.min(.85, .8 * a))], [.4, rgba(WARM.deep, .4 * a)], [1, rgba(WARM.deep, 0)]]);   // gold stays gold (source-over)
  else { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 0, 0, rx, [[0, rgba(col, .55 * a)], [.45, rgba(col, .22 * a)], [1, rgba(col, 0)]]); }
  ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx); ctx.restore();
}
// one room of a building in section. R: { x0, x1, level, lamp 0..1, lampX, cool 0..1, back(ctx, s) (world units on ZB),
//   items: [[Z, fn(ctx, s)], …] drawn far → near on their own planes, door: { top, z0, z1, a } (a lit door in the LEFT wall),
//   pools: [[X, Z, r, col, a]] light on the floor, dark 0..1 (how dark the walls are) }
export function room(ctx, c, t, L, R) {
  const yF = floorY(R.level), yC = yF - (FLOOR - SLAB), x0 = R.x0, x1 = R.x1;
  const inside = c.z > ZS - 40;   // the camera has passed the cut: it is inside a room (dinner close-ups); draw only that room, full frame
  if (inside && !(c.x > x0 && c.x < x1 && c.y > yC && c.y < yF && c.z < ZB - 40)) return false;
  const ZN = inside ? c.z + 40 : ZS;   // near edge of floor / ceiling / side walls
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (!inside) { const a = wp(c, x0, yC, ZS), b = wp(c, x1, yF, ZS); if (!a || !b || b[0] < 0 || a[0] > W || b[1] < 0 || a[1] > H) { ctx.restore(); return false; } ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.clip(); }
  const lamp = (R.lamp ?? 0) * (1 - .75 * L.day), wallTop = dayMix(mixHex(P.night1, P.ind1, .55), DAYC.wall, L, .9), wallBot = dayMix(mixHex(P.night1, P.ind0, .3), DAYC.wallLo, L, .9);   // by day the lamps are (nearly) off
  FURN_DAY = L.day;
  const sunDx = (12.5 - L.h) * 34;   // the sun's patches move across the room with the hour (morning: from the left → patches right)
  atZ(ctx, c, ZB, (s) => {
    ctx.fillStyle = lin(ctx, 0, yC, 0, yF, [[0, wallTop], [1, wallBot]]); ctx.fillRect(x0 - 2, yC - 2, x1 - x0 + 4, yF - yC + 4);
    if (L.day > 0) {   // sunlight falls in: two warm window patches on the back wall (soft edge, then the patch)
      ctx.save(); ctx.beginPath(); ctx.rect(x0, yC, x1 - x0, yF - yC); ctx.clip();
      const pw = (x1 - x0) * .2, ph = (yF - yC) * .46, py = yF - ph - (yF - yC) * .12;
      const sunC = mixHex(WARM.mid, DAYC.warm, .55);   // a near-opaque saturated gold shape: half-alpha warm on blue turns grey/lavender
      for (const k of [0, 1]) { const px = x0 + (x1 - x0) * (.3 + k * .26) + sunDx;
        for (const [e, a] of [[14, .22], [0, .82]]) { ctx.fillStyle = rgba(sunC, a * L.day); ctx.beginPath(); ctx.moveTo(px - e, py - e); ctx.lineTo(px + pw + e, py - e); ctx.lineTo(px + pw + e + ph * .35, py + ph + e); ctx.lineTo(px - e + ph * .35, py + ph + e); ctx.closePath(); ctx.fill(); } }
      ctx.restore();
    }
    if (lamp > 0) { const lx = R.lampX ?? (x0 + x1) / 2; ctx.fillStyle = rad(ctx, lx, yC + 120, (x1 - x0) * .75, [[0, rgba(WARM.hi, .6 * lamp)], [.35, rgba(WARM.mid, .3 * lamp)], [1, rgba(WARM.deep, 0)]]); ctx.fillRect(x0, yC, x1 - x0, yF - yC); ctx.fillStyle = rgba(P.core1, lamp); ctx.beginPath(); ctx.ellipse(lx, yC + 110, 24, 14, 0, 0, 6.29); ctx.fill(); }
    if (R.back) R.back(ctx, s);
  });
  const ceil = dayMix(mixHex(P.night0, P.night1, .5), DAYC.ceil, L, .9), side = dayMix(mixHex(P.night1, P.ind1, .3), DAYC.sideW, L, .9), flo = dayMix(mixHex(P.night1, P.ind2, .35), DAYC.floor, L, .9);
  quad(ctx, c, [[x0, yC, ZN], [x1, yC, ZN], [x1, yC, ZB], [x0, yC, ZB]], ceil);
  const fq = quad(ctx, c, [[x0, yF, ZN], [x1, yF, ZN], [x1, yF, ZB], [x0, yF, ZB]], (q) => lin(ctx, 0, q[2][1], 0, q[0][1], [[0, flo], [1, dayMix(mixHex(P.night0, P.night1, .4), DAYC.wallLo, L, .85)]]));
  if (L.day > 0) {   // the sun's patch on the floor (from the open front, slanted with the hour)
    const fx = x0 + (x1 - x0) * .28 + sunDx * 1.4, fw = (x1 - x0) * .42, z0 = Math.max(ZN, ZS + 40), z1 = ZS + 330;
    if (z1 > z0) { quad(ctx, c, [[fx, yF, z0], [fx + fw, yF, z0], [fx + fw + 120, yF, z1], [fx + 120, yF, z1]], rgba(mixHex(WARM.mid, DAYC.warm, .4), .78 * L.day)); }
  }
  quad(ctx, c, [[x0, yC, ZN], [x0, yC, ZB], [x0, yF, ZB], [x0, yF, ZN]], (q) => lin(ctx, q[1][0], 0, q[0][0], 0, [[0, side], [1, mixHex(side, P.night0, .5)]]));
  quad(ctx, c, [[x1, yC, ZN], [x1, yC, ZB], [x1, yF, ZB], [x1, yF, ZN]], (q) => lin(ctx, q[1][0], 0, q[0][0], 0, [[0, side], [1, mixHex(side, P.night0, .5)]]));
  if (R.door) {   // the lit doorway in the left wall + the light it throws onto the floor
    const D = R.door, da = D.a ?? 1;
    quad(ctx, c, [[x0, D.top, Math.max(D.z0, ZN)], [x0, D.top, D.z1], [x0, yF, D.z1], [x0, yF, Math.max(D.z0, ZN)]], (q) => lin(ctx, 0, q[0][1], 0, q[3][1], [[0, mixHex(side, WARM.deep, .8 * da)], [.3, mixHex(side, WARM.mid, .95 * da)], [1, mixHex(side, WARM.hi, .95 * da)]]));
  }
  // light pools on the floor, clipped to the floor (a pool never spills onto the walls when the camera is close)
  ctx.save(); if (fq) { ctx.beginPath(); fq.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.clip(); }
  if (R.door) { const D = R.door, da = D.a ?? 1; floorPool(ctx, c, x0 + 230, yF, (D.z0 + D.z1) / 2, 400, WARM.mid, .8 * da); floorPool(ctx, c, x0 + 80, yF, (D.z0 + D.z1) / 2, 160, WARM.hi, .9 * da); }
  for (const [X, Z, r, col, al] of R.pools || []) floorPool(ctx, c, X, yF, Z, r, col, al);
  if (lamp > 0) floorPool(ctx, c, R.lampX ?? (x0 + x1) / 2, yF, (ZS + ZB) / 2, (x1 - x0) * .5, WARM.mid, .55 * lamp);
  ctx.restore();
  for (const [Z, fn] of [...(R.items || [])].sort((p, q) => q[0] - p[0])) atZ(ctx, c, Z, (s) => fn(ctx, s));
  ctx.restore();
  return true;
}
let FURN_DAY = 0;   // set by room(): furniture lightens by day
function furniture(ctx, kind, x, y) {   // flat dark silhouettes standing on floor y (drawn on a plane near the back wall)
  ctx.fillStyle = FURN_DAY > 0 ? mixHex(mixHex(P.night0, P.ind0, .5), DAYC.furn, FURN_DAY) : mixHex(P.night0, P.ind0, .5);
  if (kind === 'sofa') { ctx.fillRect(x - 170, y - 52, 340, 36); ctx.fillRect(x - 170, y - 82, 36, 82); ctx.fillRect(x + 134, y - 82, 36, 82); ctx.fillRect(x - 160, y - 16, 16, 16); ctx.fillRect(x + 144, y - 16, 16, 16); ctx.fillRect(x - 170, y - 100, 340, 50); }   // human scale (people 140)
  if (kind === 'bed') { ctx.fillRect(x - 210, y - 50, 420, 36); ctx.fillRect(x - 210, y - 115, 30, 115); ctx.fillRect(x + 190, y - 72, 20, 72); }   // mattress top y − 50
  if (kind === 'desk') { ctx.fillRect(x - 120, y - 64, 240, 10); ctx.fillRect(x - 110, y - 54, 10, 54); ctx.fillRect(x + 100, y - 54, 10, 54); }
  if (kind === 'shelf') { ctx.fillRect(x - 60, y - 220, 120, 220); ctx.fillStyle = mixHex(P.ind0, P.ind1, .5); for (let i = 1; i < 4; i++) ctx.fillRect(x - 54, y - 220 + i * 54, 108, 5); }
  if (kind === 'plant') { ctx.fillRect(x - 24, y - 60, 48, 60); ctx.beginPath(); ctx.ellipse(x, y - 110, 60, 70, 0, 0, 6.29); ctx.fill(); }
  if (kind === 'shutter') { ctx.fillRect(x - 300, y - 360, 600, 360); ctx.fillStyle = rgba(P.blue1, .25); for (let i = 1; i < 12; i++) ctx.fillRect(x - 300, y - 360 + i * 30, 600, 3); }
  if (kind === 'stairs') { for (let i = 0; i < 10; i++) ctx.fillRect(x + i * 50, y - (i + 1) * 49, 50, (i + 1) * 49); }
}
const winOnWall = (ctx, L, x, y, w, h) => {   // a window in a back wall: the sky of the hour inside, a cross
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, L.top], [1, L.hor]]); ctx.fillRect(x, y, w, h);
  if (L.star > .3) { ctx.fillStyle = rgba(P.cream, .6 * L.star); ctx.fillRect(x + w * .3, y + h * .2, 3, 3); ctx.fillRect(x + w * .7, y + h * .35, 2.5, 2.5); }
  ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(x + w / 2 - 4, y, 8, h); ctx.fillRect(x, y + h * .45, w, 8); ctx.fillRect(x - 10, y + h, w + 20, 10);
};
// cut faces of a building at ZS (slabs, outer walls, partitions, parapet), drawn after its rooms
function cutFaces(ctx, c, x0, x1, floors, parts, L) {
  atZ(ctx, c, ZS, () => {
    const cut = dayMix(mixHex(P.ind2, P.blue1, .35), DAYC.cut, L, .85), wall = 44, top = floorY(floors);
    for (let l = 0; l <= floors; l++) { const y = floorY(l); ctx.fillStyle = cut; ctx.fillRect(x0 - wall, y, x1 - x0 + 2 * wall, SLAB); ctx.fillStyle = rgba(P.blue0, .9); ctx.fillRect(x0 - wall, y, x1 - x0 + 2 * wall, 4); }
    ctx.fillStyle = cut; ctx.fillRect(x0 - wall, top, wall, -top); ctx.fillRect(x1, top, wall, -top);
    for (const [x, l, yTop] of parts) ctx.fillRect(x - 12, floorY(l + 1) + SLAB, 24, (yTop ?? floorY(l)) - floorY(l + 1) - SLAB);
    ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fillRect(x0 - wall - 30, top - 70, x1 - x0 + 2 * wall + 60, 70);
    ctx.fillStyle = rgba(P.blue0, .9); ctx.fillRect(x0 - wall - 30, top - 70, x1 - x0 + 2 * wall + 60, 5);
  });
}

// ================================================================================================================ your building (open in section)
// o: { rooms: { l0a, l0b, l1a, l1b, l3a, l3b: lamp 0..1 }, cool (machine points in two neighbours' rooms), hallLamp 0..1,
//      kitchen: {…kitchen o}, kid: { asleep, lamp, items: [[Z, fn]], pools: [[X, Z, r, col, a]] } }
export function yourBuilding(ctx, c, t, L, o = {}) {
  const B = STREET.you, rm = o.rooms || {}, nb = (x) => [[ZB - 40, (cx) => x(cx)]], cool = o.cool ? .9 : 0;
  const cp = (x, y) => [ZB - 30, (cx) => coolPoint(cx, x, y, 7, cool)];
  room(ctx, c, t, L, { x0: B.x0, x1: -1800, level: 0, lamp: rm.l0a ?? 0, items: nb((cx) => furniture(cx, 'stairs', -2560, 0)) });
  room(ctx, c, t, L, { x0: -1800, x1: B.x1, level: 0, lamp: rm.l0b ?? 0, items: nb((cx) => furniture(cx, 'shutter', -1000, 0)) });
  room(ctx, c, t, L, { x0: B.x0, x1: -1400, level: 1, lamp: rm.l1a ?? 0, items: [...nb((cx) => { furniture(cx, 'sofa', -2000, floorY(1)); furniture(cx, 'plant', -1600, floorY(1)); }), cp(-1700, floorY(1) - 112)] });
  room(ctx, c, t, L, { x0: -1400, x1: B.x1, level: 1, lamp: rm.l1b ?? 0, back: (cx) => winOnWall(cx, L, -700, floorY(1) - 400, 220, 200), items: nb((cx) => furniture(cx, 'bed', -1000, floorY(1))) });
  room(ctx, c, t, L, { x0: B.x0, x1: -1200, level: 3, lamp: rm.l3a ?? 0, items: nb((cx) => { furniture(cx, 'shelf', -2400, floorY(3)); furniture(cx, 'sofa', -1750, floorY(3)); }) });
  room(ctx, c, t, L, { x0: -1200, x1: B.x1, level: 3, lamp: rm.l3b ?? 0, back: (cx) => winOnWall(cx, L, -560, floorY(3) - 400, 220, 200), items: [...nb((cx) => furniture(cx, 'desk', -800, floorY(3))), cp(-760, floorY(3) - 78)] });
  hallway(ctx, c, t, L, o);
  kitchen(ctx, c, t, { L, hallLamp: o.hallLamp ?? 1, ...(o.kitchen || {}) });
  kidRoom(ctx, c, t, L, o.kid || {});
  cutFaces(ctx, c, B.x0, B.x1, B.floors, [[-1800, 0], [-1400, 1], [-1200, 3], [-1000, 2], [-2000, 2, KITCHEN.door.top]], L);
  atZ(ctx, c, ZS, () => { ctx.fillStyle = dayMix(mixHex(P.ind2, P.blue1, .35), DAYC.cut, L, .85); ctx.fillRect(-2012, KITCHEN.door.top, 24, KY - KITCHEN.door.top); });   // the partition's cut end below the door top (the door is deeper)
}
function hallway(ctx, c, t, L, o) {
  const [x0, x1] = STREET.hall, lamp = o.hallLamp ?? 1;
  room(ctx, c, t, L, {
    x0, x1, level: 2, lamp: 0,
    back: (cx) => {
      winOnWall(cx, L, x0 + 110, KC + 70, 190, 360);
      if (lamp > 0) {   // the warm wall lamp whose light falls through the open door into the kitchen (thumbnail A, left)
        cx.fillStyle = rad(cx, x1 - 140, KC + 190, 400, [[0, rgba(WARM.hi, .85 * lamp)], [.25, rgba(WARM.mid, .55 * lamp)], [.65, rgba(WARM.deep, .2 * lamp)], [1, rgba(WARM.deep, 0)]]); cx.fillRect(x0, KC, x1 - x0, KY - KC);
        cx.fillStyle = mixHex(P.ind2, P.night1, .2); cx.fillRect(x1 - 156, KC + 168, 32, 30); cx.fillStyle = rgba(P.core0, lamp); cx.beginPath(); cx.ellipse(x1 - 140, KC + 166, 22, 9, 0, 0, 6.29); cx.fill();
      }
    },
    pools: [[x1 - 160, (ZS + ZB) / 2, 340, WARM.mid, .7 * lamp]],
    items: [[ZB - 60, (cx) => { cx.fillStyle = mixHex(P.night0, P.ind0, .6); cx.fillRect(x0 + 40, KY - 200, 50, 200); cx.beginPath(); cx.ellipse(x0 + 65, KY - 240, 46, 52, 0, 0, 6.29); cx.fill(); }]],   // coats on a hook
  });
}
function kidRoom(ctx, c, t, L, o) {
  const [x0, x1] = STREET.kidRoom;
  room(ctx, c, t, L, {
    x0, x1, level: 2, lamp: o.lamp ?? 0, lampX: x0 + 520, pools: o.pools,
    back: (cx) => winOnWall(cx, L, x0 + 300, KC + 90, 220, 200),
    items: [[ZB - 60, (cx) => { furniture(cx, 'bed', x0 + 230, KY); furniture(cx, 'desk', x1 - 170, KY); }],
      [ZB - 70, (cx) => { if (o.asleep === false) return; cx.fillStyle = mixHex(P.blue1, P.ind1, .4); cx.beginPath(); cx.ellipse(x0 + 250, KY - 50, 140, 22 + 1.5 * Math.sin(t * 1.4), 0, Math.PI, 0); cx.fill(); cx.beginPath(); cx.ellipse(x0 + 70, KY - 60, 22, 17, 0, 0, 6.29); cx.fill(); }], ...(o.items || [])],
  });
}

// ================================================================================================================ the kitchen
// kitchen(ctx, c, t, o): the room on level 2 (KITCHEN, LIGHTWALL). o: { L, scan: {…scanArt o} | null, wall 0..1 (the light wall's own glow),
// wallFn(ctx, LW) (draw on the wall: world units, plane ZB), lamp 0..1 (the pendant), hallLamp 0..1, kettle { steam } | null, phone { on, buzz, gold } | null,
// table true, chairs true, people: [[Z, fn(ctx, s)], …] (figures etc. on their own depth planes; feet at Y = KITCHEN.floor) }
export function kitchen(ctx, c, t, o = {}) {
  const K = KITCHEN, L = o.L || hourLook(o.hour ?? 6.25), lamp = o.lamp ?? 0, LW = LIGHTWALL, hl = o.hallLamp ?? 1;
  const scanA = o.scan ? (o.scan.a ?? 1) * (1 - (o.scan.collapse ?? 0)) : 0, wall = Math.max(o.wall ?? 0, scanA);
  const C = K.counter, T = K.table, Lp = K.lamp;
  const items = [
    [C.z0, (cx) => {   // the counter: its top (seen from above) and its front
      cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0);
      quad(cx, c, [[C.x0, C.top, C.z0], [C.x1, C.top, C.z0], [C.x1, C.top, ZB], [C.x0, C.top, ZB]], dayMix(mixHex(P.ind2, P.blue1, .3 + .3 * hl), DAYC.wall, L, .8));
      quad(cx, c, [[C.x1, C.top, C.z0], [C.x1, C.top, ZB], [C.x1, K.floor, ZB], [C.x1, K.floor, C.z0]], mixHex(P.night1, P.ind0, .4));
      cx.restore();
      cx.fillStyle = lin(cx, 0, C.top, 0, K.floor, [[0, mixHex(P.ind2, P.night1, .35)], [1, P.night0]]); cx.fillRect(C.x0, C.top, C.x1 - C.x0, K.floor - C.top);
      cx.fillStyle = lin(cx, C.x0, 0, C.x0 + 260, 0, [[0, rgba(P.halo0, .5 * hl)], [1, rgba(P.halo0, .05 * hl)]]); cx.fillRect(C.x0, C.top - 6, C.x1 - C.x0, 8);   // the warm edge
      cx.strokeStyle = rgba(P.night0, .7); cx.lineWidth = 3; for (const x of [C.x0 + 82, C.x0 + 165]) { cx.beginPath(); cx.moveTo(x, C.top + 14); cx.lineTo(x, K.floor - 8); cx.stroke(); }
    }],
    [K.kettle[2], (cx) => { if (o.kettle !== null) kettle(cx, K.kettle[0], K.kettle[1], 30, t, o.kettle || {}); }],
    [K.phone[2], (cx) => { if (o.phone !== null) phone(cx, K.phone[0], K.phone[1], 30, t, o.phone || {}); }],
    ...(o.people || []),
  ];
  if (o.table !== false) {
    if (o.chairs !== false) for (const [x, z] of [[T.x0 - 40, (T.z0 + T.z1) / 2], [T.x1 + 40, (T.z0 + T.z1) / 2], [(T.x0 + T.x1) / 2, T.z0 - 50]]) items.push([z, (cx) => { cx.fillStyle = mixHex(P.night0, P.ind0, .7); cx.fillRect(x - 32, K.floor - 42, 64, 9); cx.fillRect(x - 25, K.floor - 33, 8, 33); cx.fillRect(x + 17, K.floor - 33, 8, 33); }]);   // stools
    items.push([T.z1 + .5, (cx) => {   // the top first (things standing on the table, between z0 and z1, draw over it)
      cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0);
      quad(cx, c, [[T.x0, T.top, Math.max(T.z0, c.z + 31)], [T.x1, T.top, Math.max(T.z0, c.z + 31)], [T.x1, T.top, T.z1], [T.x0, T.top, T.z1]], (q) => lin(cx, 0, q[2][1], 0, q[0][1], [[0, dayMix(mixHex(mixHex(P.ind1, WARM.mid, .72 * lamp), WARM.hi, .25 * lamp), '#4d68b8', L, .85)], [1, dayMix(mixHex(P.ind0, WARM.deep, .62 * lamp), '#2a4596', L, .85)]]));
      cx.restore();
    }]);
    items.push([T.z0, (cx) => {   // the front edge and the legs
      const tl = mixHex(P.night1, WARM.deep, .45 * lamp);
      cx.fillStyle = tl; cx.fillRect(T.x0, T.top, T.x1 - T.x0, 14); cx.fillRect(T.x0 + 16, T.top + 14, 14, K.floor - T.top - 14); cx.fillRect(T.x1 - 30, T.top + 14, 14, K.floor - T.top - 14);
      cx.fillStyle = rgba(P.blue1, .7); cx.fillRect(T.x0, T.top, T.x1 - T.x0, 3);
    }]);
  }
  items.push([Lp.z, (cx) => {   // the pendant: cord from the ceiling, shade, light
    cx.strokeStyle = mixHex(P.night0, P.ind1, .5); cx.lineWidth = 3; cx.beginPath(); cx.moveTo(Lp.x, K.ceil); cx.lineTo(Lp.x, Lp.y - 34); cx.stroke();
    cx.fillStyle = mixHex(P.ind2, P.night1, .2); cx.beginPath(); cx.moveTo(Lp.x - 16, Lp.y - 36); cx.lineTo(Lp.x + 16, Lp.y - 36); cx.lineTo(Lp.x + 48, Lp.y); cx.lineTo(Lp.x - 48, Lp.y); cx.closePath(); cx.fill();
    if (lamp > 0) {
      cx.fillStyle = rad(cx, Lp.x, Lp.y + 60, 460, [[0, rgba(WARM.hi, .35 * lamp)], [.4, rgba(WARM.mid, .14 * lamp)], [1, rgba(WARM.deep, 0)]]); cx.fillRect(Lp.x - 460, Lp.y - 400, 920, 900);
      cx.fillStyle = rgba(P.core0, lamp); cx.beginPath(); cx.ellipse(Lp.x, Lp.y, 42, 7, 0, 0, 6.29); cx.fill();
    }
  }]);
  // the lamp's warm light over the table, the people and the near wall (screen blend). It steps aside while the old screen / a
  // dinner window fills the frame (the camera centred on the light wall, close): the clips stay untouched.
  if (lamp > 0) items.push([Math.max(ZS + 2, c.z + 40), (cx) => {
    const ctr = wp(c, Lp.x - 190, T.top - 46, (T.z0 + T.z1) / 2), sc = wp(c, SCREEN.x, LW.cy, ZB), sc2 = wp(c, SCREEN.x + SCREEN.w, LW.cy, ZB);
    if (!ctr) return;
    const off = sc && sc2 ? smooth(span(sc2[0] - sc[0], 1000, 1400)) * (1 - smooth(span(Math.abs(sc[1] - H / 2), 120, 300))) : 0, a = lamp * (1 - off);
    if (a <= .01) return;
    const r = 330 * ctr[2];
    cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalCompositeOperation = 'screen';
    cx.fillStyle = rad(cx, ctr[0], ctr[1], r, [[0, rgba(WARM.mid, .42 * a)], [.45, rgba(WARM.deep, .22 * a)], [1, rgba(WARM.deep, 0)]]); cx.fillRect(ctr[0] - r, ctr[1] - r, 2 * r, 2 * r);
    cx.restore();
  }]);
  room(ctx, c, t, L, {
    x0: K.x0, x1: K.x1, level: 2,
    door: { ...K.door, a: hl },
    pools: [[LW.cx, ZB - 160, 420, P.blue0, 1.1 * wall], [LW.cx + 40, ZB - 120, 220, COOL.edge, .45 * scanA], [Lp.x - 160, (T.z0 + T.z1) / 2, 560, WARM.mid, .95 * lamp], [Lp.x - 200, (T.z0 + T.z1) / 2, 240, WARM.hi, .6 * lamp]],
    back: (cx) => {
      // the light wall: a slightly lighter panel (it can show light), a cool sheen when it does
      if (L.day > 0) for (let i = 0; i < 4; i++) { const e = 40 - i * 12; cx.fillStyle = rgba(mixHex(P.night1, P.ind1, .5), .2 * L.day); cx.beginPath(); cx.roundRect(LW.x - e, LW.y - e, LW.w + 2 * e, LW.h + 2 * e, 18); cx.fill(); }   // by day: a soft dark glass panel, so light on it keeps its contrast
      cx.fillStyle = rgba(P.blue0, .18 + .12 * wall); cx.fillRect(LW.x - 14, LW.y - 14, LW.w + 28, LW.h + 28);
      cx.fillStyle = rad(cx, LW.cx, LW.cy, LW.w * .9, [[0, rgba(P.blue0, .5 * wall)], [1, rgba(P.blue0, 0)]]); cx.fillRect(LW.x - LW.w * .5, LW.y - 40, LW.w * 2, LW.h + 200);
      if (o.scan) { cx.save(); cx.beginPath(); cx.rect(LW.x, LW.y, LW.w, LW.h); cx.clip(); scanArt(cx, LW.x - LW.w * .04, LW.y - LW.h * .06, LW.w * 1.08, LW.h * 1.12, t, o.scan); cx.restore(); if (scanA > 0) { cx.strokeStyle = rgba(COOL.mid, .35 * scanA); cx.lineWidth = 2; cx.strokeRect(LW.x, LW.y, LW.w, LW.h); } }
      if (o.wallFn) o.wallFn(cx, LW);
    },
    items,
  });
}
export function kettle(ctx, x, y, h, t, o = {}) {
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .35); ctx.beginPath(); ctx.moveTo(x - h * .42, y); ctx.lineTo(x - h * .36, y - h * .7); ctx.quadraticCurveTo(x, y - h * .86, x + h * .36, y - h * .7); ctx.lineTo(x + h * .42, y); ctx.closePath(); ctx.fill();
  ctx.fillRect(x + h * .36, y - h * .62, h * .3, h * .1); ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(x - h * .4, y - h * .12, h * .8, h * .05);
  if ((o.steam ?? 0) > 0) steam(ctx, x + h * .6, y - h * .65, h * 1.4, t, o.steam, 3);
}
// the phone lying on the counter (screen up). o.on 0..1 (screen light, cool white), o.buzz 0..1 (two small shivers), o.gold 0..1 (the clinic's line arrived)
export function phone(ctx, x, y, w, t, o = {}) {
  const on = o.on ?? 0, bz = (o.buzz ?? 0) * Math.sin(t * 90) * w * .05;
  ctx.fillStyle = P.night0; ctx.fillRect(x - w / 2 + bz, y - w * .14, w, w * .14);
  if (on > 0) {
    ctx.fillStyle = rad(ctx, x, y - w * .2, w * 2.2, [[0, rgba(COOL.core, .55 * on)], [.4, rgba(COOL.mid, .2 * on)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(x - w * 2.2, y - w * 2.4, w * 4.4, w * 2.4);
    ctx.fillStyle = rgba(COOL.core, on); ctx.fillRect(x - w * .44 + bz, y - w * .15, w * .88, w * .05);
  }
  if ((o.gold ?? 0) > 0) halo(ctx, x, y - w * .12, w * 1.4, .9 * o.gold);
}
// steam from a cup / kettle: thin wisps rising and swaying (ambient life). (x,y) = the rim, h = how high it rises
export function steam(ctx, x, y, h, t, a = 1, n = 3) {
  ctx.save(); ctx.lineCap = 'round'; ctx.filter = `blur(${Math.max(.6, h * .012)}px)`;
  for (let i = 0; i < n; i++) {
    const ph = (t * .28 + i / n) % 1, yy = y - h * .35 * ph, al = a * Math.sin(Math.PI * ph) ** 1.5 * .42, len = h * (.25 + .15 * Math.sin(i * 2.1));
    ctx.strokeStyle = rgba(P.cream, al); ctx.lineWidth = h * .028 * (1 + ph);
    ctx.beginPath();
    for (let k = 0; k <= 8; k++) { const v = k / 8, px = x + (i - 1) * h * .035 + Math.sin(t * 1.1 + v * 3.5 + i * 2) * h * .04 * (v + ph), py = yy - v * len; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
  }
  ctx.restore();
}

// ================================================================================================================ the scan (chest, as light)
// scanArt(ctx, x, y, w, h, t, o) in any coordinates (box x,y,w,h). Neck + shoulders + two darker lungs in cool blue light, a small gold
// spot in the right lung, a thin gold ring round it. o: { a 0..1, draw 0..1 (sweeps on top → bottom with a scan line), ring 0..1 (closes),
// tight 0..1 (the ring tightens a step), spot 0..1, collapse 0..1 (folds to a horizontal line → point: the old-screen grammar),
// timeline 0..1 (the 'Early' line across the lower body: a wedge of growth, the mark at its very start), small 0..1 (the wedge stays small) }
let SCAN = null;
function scanPaths() {
  if (SCAN) return SCAN;
  const body = new Path2D();
  body.moveTo(.41, 0); body.lineTo(.41, .14); body.bezierCurveTo(.4, .2, .3, .22, .18, .25); body.bezierCurveTo(.08, .28, .03, .36, .02, .5);
  body.lineTo(0, 1.02); body.lineTo(1, 1.02); body.lineTo(.98, .5); body.bezierCurveTo(.97, .36, .92, .28, .82, .25); body.bezierCurveTo(.7, .22, .6, .2, .59, .14); body.lineTo(.59, 0); body.closePath();
  const lungL = new Path2D(); lungL.moveTo(.44, .3); lungL.bezierCurveTo(.36, .28, .24, .36, .2, .55); lungL.bezierCurveTo(.17, .72, .16, .86, .2, .9); lungL.bezierCurveTo(.3, .88, .4, .84, .45, .8); lungL.bezierCurveTo(.47, .6, .47, .4, .44, .3); lungL.closePath();
  const lungR = new Path2D(); lungR.addPath(lungL, { a: -1, b: 0, c: 0, d: 1, e: 1, f: 0 });
  SCAN = { body, lungL, lungR, spot: [.66, .48] };
  return SCAN;
}
export const SCAN_SPOT = [.66, .48];   // the spot in the scan box (u, v share of w, h)
export function scanArt(ctx, x, y, w, h, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const S = scanPaths(), col = clamp(o.collapse ?? 0), dr = o.draw ?? 1;
  ctx.save(); ctx.translate(x, y);
  // the collapse: the picture folds to a line (vertical scale), then the line to a point
  const fy = col < .55 ? 1 - expoIn(col / .55) : 0, fx = col < .55 ? 1 : 1 - expoIn((col - .55) / .45);
  if (col > 0) { ctx.translate(w / 2, h / 2); ctx.scale(Math.max(fx, .001), Math.max(fy, .004)); ctx.translate(-w / 2, -h / 2); }
  ctx.globalAlpha = a;
  // the wall glows cool around the picture
  ctx.fillStyle = rad(ctx, w * .5, h * .55, w * .75, [[0, rgba(P.blue0, .55)], [.6, rgba(P.blue0, .22)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-w * .25, -h * .1, w * 1.5, h * 1.2);
  ctx.save(); ctx.beginPath(); ctx.rect(-w, -h, w * 3, h * (1 + dr * 1.06)); ctx.clip();   // the sweep: drawn down to dr
  ctx.save(); ctx.scale(w, h);
  ctx.fillStyle = lin(ctx, 0, 0, 0, 1, [[0, mixHex(P.blue0, COOL.edge, .5)], [.4, mixHex(P.blue0, COOL.edge, .62)], [1, mixHex(P.blue0, P.ind1, .3)]]); ctx.fill(S.body);
  ctx.restore();
  // a soft inner light in the chest (volume)
  const bodyAbs = new Path2D(); bodyAbs.addPath(S.body, { a: w, b: 0, c: 0, d: h, e: 0, f: 0 });
  ctx.save(); ctx.clip(bodyAbs);
  ctx.fillStyle = rad(ctx, w * .5, h * .45, w * .55, [[0, rgba(COOL.mid, .28)], [1, rgba(COOL.mid, 0)]]); ctx.fillRect(0, 0, w, h);
  ctx.filter = `blur(${w * .012}px)`; ctx.strokeStyle = rgba(COOL.mid, .45); ctx.lineWidth = w * .02; ctx.stroke(bodyAbs);   // the lit edge
  ctx.restore();
  ctx.save(); ctx.scale(w, h);
  ctx.fillStyle = rgba(P.ind1, .82); ctx.fill(S.lungL); ctx.fill(S.lungR);
  ctx.fillStyle = rgba(mixHex(P.blue0, COOL.edge, .3), .45); ctx.fillRect(.485, .18, .03, .55);   // spine / trachea hint
  ctx.restore();
  E.dust(ctx, 2301, 2600, w * .5, h * .55, w * .45, h * .5, t * .3, .35, COOL.mid);              // grain of the image
  // the spot + ring
  const [su, sv] = S.spot, sx = su * w, sy = sv * h, R = w * .085 * (1 - .22 * smooth(o.tight ?? 0));
  if ((o.spot ?? 1) > 0) {
    const sp = o.spot ?? 1, br = 1 + .08 * Math.sin(t * 2.2);
    ctx.fillStyle = rad(ctx, sx, sy, w * .05 * br, [[0, rgba(P.core0, sp)], [.3, rgba(P.core1, .8 * sp)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(sx - w * .06, sy - w * .06, w * .12, w * .12);
    ctx.fillStyle = rgba(P.core0, sp); ctx.beginPath(); ctx.arc(sx, sy, w * .011, 0, 6.29); ctx.fill();
  }
  const rg = o.ring ?? 1;
  if (rg > 0) {
    ctx.strokeStyle = rgba(P.halo0, .35); ctx.lineWidth = w * .01; ctx.beginPath(); ctx.arc(sx, sy, R, -Math.PI / 2, -Math.PI / 2 + 6.283 * rg); ctx.stroke();
    ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = w * .0035; ctx.beginPath(); ctx.arc(sx, sy, R, -Math.PI / 2, -Math.PI / 2 + 6.283 * rg); ctx.stroke();
    if (rg < 1) halo(ctx, sx + Math.cos(-Math.PI / 2 + 6.283 * rg) * R, sy + Math.sin(-Math.PI / 2 + 6.283 * rg) * R, w * .02, .9);
  }
  // 'Early': a thin timeline across the lower body; a cool wedge of how big it could grow, the gold mark at its very start
  const tl = o.timeline ?? 0;
  if (tl > 0) {
    const lx0 = w * .2, lx1 = w * .8, ly = h * .93, u = expoOut(tl), sm = smooth(o.small ?? 0);
    ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = w * .003; ctx.beginPath(); ctx.moveTo(lx0, ly); ctx.lineTo(lerp(lx0, lx1, u), ly); ctx.stroke();
    const wx = lerp(lx0, lx1, u * (1 - .82 * sm)), wh = h * .1 * u * (1 - .8 * sm);
    ctx.fillStyle = lin(ctx, lx0, 0, lx1, 0, [[0, rgba(COOL.mid, .15)], [1, rgba(COOL.mid, .45)]]); ctx.beginPath(); ctx.moveTo(lx0, ly); ctx.lineTo(wx, ly - wh); ctx.lineTo(wx, ly); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(lx0 + w * .012, ly, w * .008 * (1 + .1 * Math.sin(t * 2.2)), 0, 6.29); ctx.fill(); halo(ctx, lx0 + w * .012, ly, w * .03, .8);
  }
  ctx.restore();
  if (dr < 1) {   // the scan line (bright cool) at the sweep front
    const yy = h * dr * 1.06 - h * .03;
    ctx.fillStyle = lin(ctx, 0, yy - h * .05, 0, yy + 4, [[0, rgba(COOL.mid, 0)], [1, rgba(COOL.core, .9)]]); ctx.fillRect(-w * .02, yy - h * .05, w * 1.04, h * .05 + 4);
  }
  if (col > .5) halo(ctx, w / 2, h / 2, w * .06, (1 - span(col, .85, 1)) * 1);
  ctx.restore();
}

// ================================================================================================================ figures
// alive(t, seed): the life of one figure. { b breath -1..1, w weight -1..1, turn, nod (glances, -1..1), blink 0..1 } (MOTION §8)
export function alive(t, seed = 0) { return { ...life(t, seed), blink: blinkOf(t, seed) }; }
const HOODIE = { ...E.COAT, hem: .36 };
const KIDC = { base: P.blue1, lit: mixHex(P.blue1, COOL.mid, .5), shade: mixHex(P.blue1, P.night1, .5), deep: P.night1, hem: .44 };
const DADC = { base: mixHex(P.ind2, P.blue2, .5), lit: mixHex(P.blue2, P.cream, .3), shade: P.night1, deep: P.night0, hem: .3 };
// apply life to a pose: breath (shoulders/arms), weight shift (lean + 1 % sway), glance (look), the faceless blink = a tiny head settle
function lived(t, o, seed) {
  const A = alive(t, seed), q = { ...o };
  q.lean = (o.lean ?? 0) + .012 * A.w - .01 * A.blink;
  q.look = clamp((o.look ?? 0) + .14 * A.nod - .08 * A.blink, 0, 1.2);
  const br = .03 * A.b;
  if (o.armR) q.armR = [o.armR[0] + br, o.armR[1] + br * .6]; else q.armR = [.2 + br, .1 + br * .5];
  if (o.armL) q.armL = [o.armL[0] - br, o.armL[1] - br * .6]; else q.armL = [-.2 - br, -.1 - br * .5];
  return { q, A };
}
// YOU: yellow. Indoors a hoodie (hood down, hem at the hip), outdoors (o.out) the raincoat with the hood up. Faceless, always.
// o: everything E.du takes (pose, dir, look, lean, armR/armL, walk, cup 'R'|'L', light, back, rim) + seed, steam 0..1 (with a cup)
export function you(ctx, x, y, h, t, o = {}) {
  const { q, A } = lived(t, o, o.seed ?? 1);
  const sy = 1 + .006 * A.b;
  ctx.save(); ctx.translate(x + h * .006 * A.w, y); ctx.scale(1, sy);
  const hands = o.out ? E.du(ctx, 0, 0, h, q) : E.figureRaw(ctx, 0, 0, h, { hood: false, ...q }, HOODIE, true);
  ctx.restore();
  const R = hands.R && [x + h * .006 * A.w + hands.R[0], y + hands.R[1] * sy], Lh = hands.L && [x + h * .006 * A.w + hands.L[0], y + hands.L[1] * sy];
  if (o.cup && (o.steam ?? 1) > 0) { const hp = o.cup === 'L' ? Lh : R; steam(ctx, hp[0], hp[1] - h * .08, h * .55, t, o.steam ?? 1); }
  return { R, L: Lh };
}
// the face dots for the kid and Dad in close-ups (decision 1): two dots that blink (lids close in 80 ms, open in 140 ms)
function eyes(ctx, x, y, h, dir, look, A) {
  const hx = x + h * dir * (.02 - .012 * look), hy = y - h * (.885 + .008 * look), r = h * .009, k = 1 - A.blink;
  ctx.fillStyle = P.cream;
  for (const d of [.0, .032]) { ctx.beginPath(); ctx.ellipse(hx + h * dir * (d + .012), hy - h * .006, r, Math.max(r * .12, r * k), 0, 0, 6.29); ctx.fill(); }
}
export function kid(ctx, x, y, h, t, o = {}) {
  const { q, A } = lived(t, o, o.seed ?? 2);
  const hands = E.figureRaw(ctx, x, y, h * (1 + .006 * A.b), q, { ...KIDC, ...(o.colors || {}) }, false);
  // ponytail
  const dir = q.dir ?? 1; ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.ellipse(x - dir * h * .07, y - h * .9, h * .03, h * .06, dir * .5 + .15 * Math.sin(t * 1.7), 0, 6.29); ctx.fill();
  if (o.eyes) eyes(ctx, x, y, h, dir, q.look ?? 0, A);
  return hands;
}
export function dad(ctx, x, y, h, t, o = {}) {
  const { q, A } = lived(t, { lean: .05, ...o }, o.seed ?? 3);
  const hands = E.figureRaw(ctx, x, y, h * (1 + .005 * A.b), q, DADC, false);
  const dir = q.dir ?? 1, look = q.look ?? 0, hx = x + h * dir * (-.012 * look), hy = y - h * (.9 + .008 * look);
  ctx.fillStyle = mixHex(P.blue2, P.cream, .35); ctx.beginPath(); ctx.ellipse(hx - dir * h * .01, hy - h * .03, h * .064, h * .035, 0, Math.PI, 0); ctx.fill();   // grey-blue hair
  if (o.earbud !== false) coolPoint(ctx, hx + dir * h * .05, hy + h * .02, h * .008, 1);
  if (o.eyes) eyes(ctx, x, y, h, dir, look, A);
  return hands;
}
// everyone else: plain indigo silhouettes, alive (head settles, no faces)
export function other(ctx, x, y, h, t, o = {}) { const { q } = lived(t, o, o.seed ?? 4); return E.person(ctx, x, y, h, q); }

// ================================================================================================================ the street (ZS row + the front)
export const WORLD_DEFAULTS = {
  hour: 6.25,           // the light of the hour (hourLook)
  win: undefined,       // lit share of facade windows (default by hour); winFn(w) per-window override {lit, gold, cool}
  cool: 0,              // share of windows with a cool machine point (1.02 'for years')
  tower: {},            // { glow, open }
  testers: {},          // { open }
  you: {},              // yourBuilding o: { rooms, kitchen: {…kitchen o}, kid: {asleep, lamp}, hallLamp, cool }
  dad: {},              // dadBuilding o: { open, lamp, balcony }
  lamps: undefined,     // street lamps on 0..1 (default: on at night)
  over: null,           // fn(ctx, s) in ZS world units, drawn last on the section plane (lines, rings, tags)
};
export function streetRow(ctx, c, t, o = {}) {
  const L = o.L || hourLook(o.hour ?? 6.25), oo = { win: L.win, ...o }, sw = (W / 2 + 300) / Math.max(.01, c.f / (ZS - c.z));
  atZ(ctx, c, ZS, (s) => {
    for (const b of SROW) if (!(b.x1 < c.x - sw || b.x0 > c.x + sw)) facade(ctx, b.x0, b.x1, b.h, L, oo, s, 'flat', b.wins);
    if (STREET.clinic.x1 > c.x - sw && STREET.clinic.x0 < c.x + sw) clinic(ctx, t, L, o.clinic || {}, s);
  });
  if (STREET.dad.x1 + 400 > c.x - sw && STREET.dad.x0 < c.x + sw) dadBuilding(ctx, c, t, L, o.dad || {});
  if (STREET.you.x1 > c.x - sw && STREET.you.x0 < c.x + sw) yourBuilding(ctx, c, t, L, { cool: (o.cool ?? 0) > .5, ...(o.you || {}) });
  atZ(ctx, c, ZS, (s) => {
    ctx.fillStyle = lin(ctx, 0, SLAB, 0, 900, [[0, dayMix(mixHex(P.night1, P.ind0, .3), DAYC.street, L)], [1, dayMix(P.night0, DAYC.streetLo, L)]]); ctx.fillRect(c.x - sw, SLAB, sw * 2, 30000);   // the street
    ctx.fillStyle = rgba(dayMix(P.blue0, DAYC.rim, L), .8); ctx.fillRect(c.x - sw, SLAB, sw * 2, Math.max(2 / s, 3));
    if (o.over) o.over(ctx, s);
  });
}
// DAD'S BUILDING, two streets over: 5 levels, Dad's flat on level 3 (left half), the side balcony with tomatoes. o.open 0..1: the closed
// facade slides down into the ground and shows the building in section (6.05); o.lamp (Dad's lamp), o.rooms { l0a … l4b }, o.items { 'l3a': [[Z, fn]] }
export function dadBuilding(ctx, c, t, L, o = {}) {
  const D = STREET.dad, top = floorY(D.floors), open = clamp(o.open ?? 0);
  if (open > 0) {
    for (let l = 0; l < D.floors; l++) for (const [a, b, k] of [[D.x0, 5300, 'a'], [5300, D.x1, 'b']]) {
      const id = `l${l}${k}`, mine = l === D.level && k === 'a';
      room(ctx, c, t, L, { x0: a, x1: b, level: l, lamp: mine ? (o.lamp ?? .8) : (o.rooms?.[id] ?? 0), lampX: a + 300,
        back: (cx) => winOnWall(cx, L, a + 380, floorY(l) - 400, 200, 200), items: [[ZB - 40, (cx) => furniture(cx, ['sofa', 'bed', 'desk', 'shelf'][(l * 2 + (k === 'a' ? 0 : 1)) % 4], a + 700, floorY(l))], ...((o.items || {})[id] || [])] });
    }
    cutFaces(ctx, c, D.x0, D.x1, D.floors, Array.from({ length: D.floors }, (_, l) => [5300, l]), L);
  }
  atZ(ctx, c, ZS, () => {
    const [b0, b1] = D.balcony, by = floorY(D.level), cut = mixHex(P.ind2, P.blue1, .35);
    ctx.fillStyle = cut; ctx.fillRect(D.x1 + 44, by, b1 - D.x1 - 44, SLAB);
    ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(D.x1 + 60, by - 150); ctx.lineTo(b1, by - 150); ctx.lineTo(b1, by); ctx.stroke();
    ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(D.x1 + 90 + i * 45, by - 150); ctx.lineTo(D.x1 + 90 + i * 45, by); ctx.stroke(); }
    for (const px of [b1 - 80, b1 - 175]) { ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fillRect(px - 26, by - 60, 52, 60); ctx.fillStyle = mixHex(P.ind1, P.blue1, .3); ctx.beginPath(); ctx.ellipse(px, by - 130, 40, 70, 0, 0, 6.29); ctx.fill(); ctx.fillStyle = rgba(P.halo0, .9); for (const [dx, dy] of [[-14, -120], [12, -150], [6, -100]]) { ctx.beginPath(); ctx.arc(px + dx, by + dy, 9, 0, 6.29); ctx.fill(); } }
    if (open < 1) {   // the closed facade (slides down into the ground as the section opens)
      const fh = -top * (1 - smooth(open)) + 70;
      ctx.save(); ctx.beginPath(); ctx.rect(D.x0 - 60, -fh, D.x1 - D.x0 + 120, fh); ctx.clip();
      const wins = []; for (let l = 0; l < D.floors; l++) for (let i = 0; i < 6; i++) wins.push({ X: D.x0 + 180 + i * 368, Y: floorY(l) - 260, Z: ZS, w: 170, h: 230, r: l === D.level && i < 3 ? 0 : .5 + ((l * 7 + i * 3) % 10) / 20, q: 1 });
      facade(ctx, D.x0 - 44, D.x1 + 44, -top, L, { win: Math.max(.08, L.win) }, 1, 'flat', wins);
      ctx.restore();
    }
  });
}
export function streetFront(ctx, c, t, o = {}) {
  const L = o.L || hourLook(o.hour ?? 6.25), lamps = o.lamps ?? clamp((.5 - L.day) / .3);
  atZ(ctx, c, ZFRONT, (s) => {
    const sw = (W / 2 + 300) / s;
    ctx.fillStyle = lin(ctx, 0, 0, 0, 600, [[0, dayMix(mixHex(P.night1, P.ind0, .25), DAYC.front, L)], [1, dayMix(P.night0, DAYC.frontLo, L)]]); ctx.fillRect(c.x - sw, 0, sw * 2, 30000);
    ctx.fillStyle = rgba(dayMix(P.blue1, DAYC.rim, L), .5); ctx.fillRect(c.x - sw, 0, sw * 2, Math.max(2 / s, 3));
    if (o.streetLife) o.streetLife(ctx, s);   // (B1) things on the pavement between the kerb and the street row: robots, walkers (world units at ZFRONT)
    for (let x = -9400; x < 10000; x += 1500) {
      if (x < c.x - sw || x > c.x + sw) continue;
      const tx = x + 700;   // a tree between two lamps
      const gap = (v) => (o.frontGap || []).some(([a, b]) => v > a && v < b);   // o.frontGap [[x0, x1]]: a square with no kerb trees/lamps
      if (!gap(tx)) {
        ctx.fillStyle = mixHex(P.night1, P.ind0, .6); ctx.fillRect(tx - 14, -300, 28, 300);
        ctx.fillStyle = dayMix(mixHex(P.ind0, P.blue0, .15), DAYC.tree, L); ctx.beginPath(); ctx.ellipse(tx, -420, 170, 190, 0, 0, 6.29); ctx.fill();
        ctx.fillStyle = rgba(dayMix(P.blue0, DAYC.treeLit, L), .5 + .2 * L.day); ctx.beginPath(); ctx.ellipse(tx + 40, -470, 110, 120, 0, Math.PI * 1.2, Math.PI * 1.9); ctx.fill();
      }
      if (gap(x)) continue;
      ctx.fillStyle = dayMix(mixHex(P.night1, P.ind0, .4), P.ind1, L, .6); ctx.fillRect(x - 7, -520, 14, 520); ctx.fillRect(x - 7, -520, 70, 10);
      if (lamps > 0) { ctx.fillStyle = rad(ctx, x + 56, -500, 260, [[0, rgba(P.halo0, .35 * lamps)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - 210, -760, 530, 760); ctx.fillStyle = rgba(P.core1, lamps); ctx.beginPath(); ctx.ellipse(x + 56, -506, 22, 8, 0, 0, 6.29); ctx.fill(); }
    }
  });
}
// the whole world back to front. Returns { L }.
export function world(ctx, c, t, o = {}) {
  const L = hourLook(o.hour ?? 6.25), oo = { ...o, L };
  sky(ctx, c, t, oo);
  skyline(ctx, c, t, oo);
  tower(ctx, c, t, { ...(o.tower || {}), L });
  backRow(ctx, c, t, STREET.rows[1], oo);
  testersHouse(ctx, c, t, o.testers || {});
  backRow(ctx, c, t, STREET.rows[0], oo);
  streetRow(ctx, c, t, oo);
  streetFront(ctx, c, t, oo);
  return { L };
}

// ================================================================================================================ objects (caller's coordinates)
// the gold line from A to B with a soft upward arc; u 0..1 drawn from A (u0..u1 to retract from A). o: { w, lift (arc height share), a, cool }
export function arcPts(a, b, lift = .18, n = 24) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * lift, out = [];
  for (let i = 0; i <= n; i++) { const v = i / n, w = 1 - v; out.push([w * w * a[0] + 2 * w * v * mx + v * v * b[0], w * w * a[1] + 2 * w * v * my + v * v * b[1]]); }
  return out;
}
export function goldLine(ctx, a, b, u1, o = {}) {
  const u0 = o.u0 ?? 0; if (u1 <= u0) return null;
  const pts = arcPts(a, b, o.lift ?? .18), w = o.w ?? 2, al = o.a ?? 1, cool = o.cool;
  const n = pts.length - 1, i0 = Math.floor(u0 * n), i1 = Math.min(n, Math.ceil(u1 * n));
  const sub = pts.slice(i0, i1 + 1); if (sub.length < 2) return null;
  const end = pts[Math.min(n, Math.round(u1 * n))];
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = rgba(cool ? COOL.edge : P.halo0, .3 * al); ctx.lineWidth = w * 4; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  ctx.strokeStyle = rgba(cool ? COOL.core : P.core1, al); ctx.lineWidth = w; ctx.stroke();
  ctx.restore();
  if (o.spark !== false && u1 < 1) halo(ctx, end[0], end[1], w * 9, .8 * al);
  return end;
}
// a small gold price tag hanging at (x, y) (the "only for payers" mark). s = its height, u 0..1 grows from the hook (mask), cool for the other way
export function priceTag(ctx, x, y, s, u = 1, o = {}) {
  if (u <= 0) return;
  const w = s * .62, k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - s, y - s * .1, s * 2, s * 1.4 * k); ctx.clip();
  ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineWidth = s * .05; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + s * .28); ctx.stroke();
  const p = new Path2D(); p.moveTo(x, y + s * .22); p.lineTo(x + w / 2, y + s * .45); p.lineTo(x + w / 2, y + s * 1.2); p.lineTo(x - w / 2, y + s * 1.2); p.lineTo(x - w / 2, y + s * .45); p.closePath();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + s * 1.2, o.cool ? [[0, COOL.mid], [1, COOL.edge]] : [[0, P.core1], [1, P.halo0]]); ctx.fill(p);
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(x, y + s * .5, s * .07, 0, 6.29); ctx.fill();
  ctx.restore();
}
// THE VOICE-LIGHT (the tutor): a cool sphere with three slow rings. r = radius. o: { a, talk 0..1 (rings pulse with the voice), warm 0..1 }
export function voiceLight(ctx, x, y, r, t, o = {}) {
  const a = o.a ?? 1, talk = o.talk ?? 0, wm = o.warm ?? 0; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rad(ctx, x, y, r * 4, [[0, rgba(COOL.mid, .35)], [.4, rgba(COOL.edge, .12)], [1, rgba(COOL.deep, 0)]]); ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
  for (let i = 0; i < 3; i++) {
    const ph = (t * .32 + i / 3) % 1, rr = r * (1.15 + 1.6 * ph + .25 * talk * Math.sin(t * 9 + i)), al = (1 - ph) * .55;
    ctx.strokeStyle = rgba(mixHex(COOL.mid, P.halo0, wm), al); ctx.lineWidth = Math.max(1.2 / Math.abs(ctx.getTransform().a || 1), r * .025); ctx.beginPath(); ctx.ellipse(x, y, rr, rr * .32, 0, 0, 6.29); ctx.stroke();
  }
  const br = 1 + .03 * Math.sin(t * 1.4) + .05 * talk * Math.abs(Math.sin(t * 7));
  ctx.fillStyle = rad(ctx, x - r * .25, y - r * .3, r * br, [[0, COOL.core], [.45, mixHex(COOL.mid, P.core1, wm)], [1, mixHex(COOL.edge, P.halo0, wm)]]); ctx.beginPath(); ctx.arc(x, y, r * br, 0, 6.29); ctx.fill();
  ctx.restore();
}
// THE SEALED ANSWER CUBE: a cube of light (the answer) that stays shut. s = edge, o: { seal 0..1 (the gold band round it), open 0..1 (lid lifts), a }
export function answerCube(ctx, x, y, s, t, o = {}) {
  const a = o.a ?? 1, d = s * .32, op = smooth(o.open ?? 0);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rad(ctx, x, y, s * 1.6, [[0, rgba(P.halo0, .25)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - s * 1.6, y - s * 1.6, s * 3.2, s * 3.2);
  const fr = [[x - s / 2, y - s / 2], [x + s / 2, y - s / 2], [x + s / 2, y + s / 2], [x - s / 2, y + s / 2]];
  ctx.fillStyle = lin(ctx, x, y - s / 2, x, y + s / 2, [[0, P.core1], [1, P.halo0]]); ctx.fillRect(fr[0][0], fr[0][1], s, s);
  ctx.fillStyle = mixHex(P.halo0, P.shade0, .45); ctx.beginPath(); ctx.moveTo(fr[1][0], fr[1][1]); ctx.lineTo(fr[1][0] + d, fr[1][1] - d); ctx.lineTo(fr[2][0] + d, fr[2][1] - d); ctx.lineTo(fr[2][0], fr[2][1]); ctx.closePath(); ctx.fill();
  ctx.fillStyle = P.core0; ctx.beginPath(); ctx.moveTo(fr[0][0], fr[0][1] - op * s * .4); ctx.lineTo(fr[1][0], fr[1][1] - op * s * .4); ctx.lineTo(fr[1][0] + d, fr[1][1] - d - op * s * .4); ctx.lineTo(fr[0][0] + d, fr[0][1] - d - op * s * .4); ctx.closePath(); ctx.fill();
  const sl = o.seal ?? 1;
  if (sl > 0) { ctx.fillStyle = rgba(P.shade0, .8 * sl); ctx.fillRect(x - s / 2, y - s * .06, s, s * .12); ctx.fillStyle = rgba(P.core0, sl); ctx.beginPath(); ctx.arc(x, y, s * .1, 0, 6.29); ctx.fill(); }
  ctx.restore();
}
// one step of the LADDER OF QUESTIONS: a '?' of light standing on a short step. size = glyph height, u 0..1 rises from the baseline, lit 0..1 (answered → gold)
export function qStep(ctx, x, y, size, t, o = {}) {
  const u = o.u ?? 1, lit = o.lit ?? 0; if (u <= 0) return;
  ctx.fillStyle = rgba(mixHex(COOL.edge, P.halo0, lit), .9); ctx.fillRect(x - size * .45, y, size * .9 * expoOut(u), size * .06);
  ctx.save(); ctx.beginPath(); ctx.rect(x - size, y - size * 1.3, size * 2, size * 1.3); ctx.clip();
  E.glowText(ctx, '?', x, y - size * .08 + size * 1.2 * (1 - expoOut(u)), { size, serif: true, align: 'center', col: mixHex(COOL.core, P.core1, lit) });
  ctx.restore();
}
// THE AGENT'S LIGHT: a small warm-cool light that works for you (a lantern-like drop). o: { a, warm 0..1 (belongs to you → warm), keys 0..1 (the ring of keys hangs from it) }
export function agentLight(ctx, x, y, r, t, o = {}) {
  const a = o.a ?? 1, wm = o.warm ?? 1, bob = Math.sin(t * 1.6) * r * .08;
  ctx.save(); ctx.globalAlpha = a; y += bob;
  ctx.fillStyle = rad(ctx, x, y, r * 3.5, [[0, rgba(mixHex(COOL.mid, P.halo0, wm), .4)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - r * 3.5, y - r * 3.5, r * 7, r * 7);
  const p = new Path2D(); p.moveTo(x, y - r * 1.35); p.bezierCurveTo(x + r * .9, y - r * .5, x + r, y + r * .4, x, y + r); p.bezierCurveTo(x - r, y + r * .4, x - r * .9, y - r * .5, x, y - r * 1.35); p.closePath();
  ctx.fillStyle = rad(ctx, x - r * .2, y - r * .1, r * 1.3, [[0, P.core0], [.5, mixHex(COOL.mid, P.core1, wm)], [1, mixHex(COOL.edge, P.halo0, wm)]]); ctx.fill(p);
  if ((o.keys ?? 0) > 0) {
    const k = o.keys, kx = x, ky = y + r * 1.9, kr = r * .55; ctx.strokeStyle = rgba(P.halo0, k); ctx.lineWidth = r * .08;
    ctx.beginPath(); ctx.moveTo(x, y + r); ctx.lineTo(kx, ky - kr); ctx.stroke(); ctx.beginPath(); ctx.arc(kx, ky, kr, 0, 6.29); ctx.stroke();
    for (let i = 0; i < 3; i++) { const an = Math.PI * (.3 + i * .2) + Math.sin(t * 1.2 + i) * .06, ex = kx + Math.cos(an) * kr, ey = ky + Math.sin(an) * kr; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.cos(an) * r * .9, ey + Math.sin(an) * r * .9); ctx.stroke(); ctx.fillStyle = rgba(P.core1, k); ctx.fillRect(ex + Math.cos(an) * r * .9 - r * .12, ey + Math.sin(an) * r * .9 - r * .05, r * .24, r * .1); }
  }
  ctx.restore();
}
// A THREAD between two points: taut-ish (slight sag), gold (yours) or cool (the makers'). o: { u 0..1 grows from a, sag (px), cool, w, a,
// slide 0..1 (the cool thread that cannot attach: the end slides off b and falls back) }
export function thread(ctx, a, b, t, o = {}) {
  const u = o.u ?? 1; if (u <= 0) return null;
  let bx = b[0], by = b[1];
  if ((o.slide ?? 0) > 0) { const s = smooth(o.slide); bx = lerp(b[0], b[0] - (b[0] - a[0]) * .25, s); by = b[1] + s * 140 + Math.sin(t * 3) * 8 * s; }
  const sag = (o.sag ?? 30) + Math.sin(t * 1.1) * 4, n = 28, pts = [];
  for (let i = 0; i <= n; i++) { const v = i / n; pts.push([lerp(a[0], bx, v), lerp(a[1], by, v) + Math.sin(Math.PI * v) * sag]); }
  const m = Math.max(2, Math.round(n * clamp(u) + 1)), sub = pts.slice(0, m), cool = o.cool, w = o.w ?? 2.5, al = o.a ?? 1;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = rgba(cool ? COOL.edge : P.halo0, .3 * al); ctx.lineWidth = w * 4; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  ctx.strokeStyle = rgba(cool ? COOL.core : P.core1, al); ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  const e = sub[sub.length - 1]; if (u < 1) halo(ctx, e[0], e[1], w * 8, .8 * al);
  return e;
}
// THE CAPSULE on the gold road (a new machine / medicine on its way to the testers): rounded pill of light. o: { cool 0..1 (untested), a }
export function capsule(ctx, x, y, w, t, o = {}) {
  const h = w * .42, c = o.cool ?? .5;
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  ctx.fillStyle = rad(ctx, x, y, w, [[0, rgba(mixHex(P.halo0, COOL.mid, c), .3)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - w, y - w, w * 2, w * 2);
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.core1, COOL.core, c)], [.5, mixHex(P.core1, COOL.core, c)], [.5, mixHex(P.halo0, COOL.mid, c)], [1, mixHex(P.halo0, COOL.edge, c)]]); ctx.fill();
  ctx.restore();
}
// THE GOLD ROAD: a path of light through pts (u 0..1 drawn), with month ticks (n ticks, k of them reached)
export function road(ctx, pts, u, o = {}) { return E.trail ? E.trail(ctx, pts, u, { w: o.w ?? 6, ...o }) : null; }
export function monthTicks(ctx, pts, n, k, o = {}) {
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = (d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; };
  const sz = o.size ?? 14;
  for (let i = 0; i < n; i++) { const [x, y] = at(T * (i + 1) / (n + 1)), on = clamp(k - i); ctx.fillStyle = on > 0 ? rgba(P.core1, .4 + .6 * on) : rgba(P.blue1, .8); ctx.fillRect(x - sz * .12, y - sz, sz * .24, sz * 2); }
}
// THE EARBUDS: a tiny cool pair (the good version, for everyone). s = size of one bud
export function earbuds(ctx, x, y, s, t, o = {}) {
  for (const d of [-1, 1]) {
    const bx = x + d * s * .9, by = y + Math.sin(t * 1.3 + d) * s * .05;
    ctx.fillStyle = rad(ctx, bx, by, s * 2, [[0, rgba(COOL.mid, .35 * (o.a ?? 1))], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(bx - s * 2, by - s * 2, s * 4, s * 4);
    ctx.fillStyle = rgba(COOL.core, o.a ?? 1); ctx.beginPath(); ctx.ellipse(bx, by, s * .5, s * .62, d * .3, 0, 6.29); ctx.fill(); ctx.fillRect(bx - s * .12 + d * s * .1, by + s * .3, s * .24, s * .7);
  }
}
// A SPEECH BUBBLE of light with wave-glyphs inside (translated speech, no words). r = radius, u 0..1 grows, cool for the machine
export function bubble(ctx, x, y, r, t, o = {}) {
  const u = expoOut(o.u ?? 1); if (u <= 0) return; const rr = r * u, cool = o.cool;
  const p = new Path2D(); p.ellipse(x, y, rr * 1.3, rr, 0, 0, 6.29); const tl = new Path2D(); tl.moveTo(x - rr * .5, y + rr * .7); tl.lineTo(x - rr * .9 * (o.tail ?? 1), y + rr * 1.35); tl.lineTo(x - rr * .05, y + rr * .85); tl.closePath();
  const pp = p.op(tl, PathOp.Union);
  ctx.fillStyle = rgba(cool ? COOL.deep : P.ind1, .85); ctx.fill(pp); ctx.strokeStyle = cool ? COOL.mid : P.halo0; ctx.lineWidth = Math.max(1.5, r * .04); ctx.stroke(pp);
  ctx.strokeStyle = cool ? COOL.core : P.core1; ctx.lineWidth = Math.max(1.5, r * .05); ctx.lineCap = 'round';
  for (let j = 0; j < 3; j++) { ctx.beginPath(); for (let i = 0; i <= 16; i++) { const v = i / 16, px = x - rr * .85 + v * rr * 1.7 * clamp(u * 1.4 - j * .15), py = y + (j - 1) * rr * .34 + Math.sin(v * 9 + t * 3 + j) * rr * .08; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
}
// THE LIBRARY (towns buying it for everyone): columns of light, an open door with warm light. (x, y) = foot centre, w = width
export function library(ctx, x, y, w, t, o = {}) {
  const h = w * .62, u = o.u ?? 1, cols = 6;
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - h * 1.6 * expoOut(u), w * 2, h * 1.7); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y - h * 1.3, 0, y, [[0, P.core1], [1, P.halo0]]);
  ctx.beginPath(); ctx.moveTo(x - w * .58, y - h); ctx.lineTo(x, y - h * 1.35); ctx.lineTo(x + w * .58, y - h); ctx.closePath(); ctx.fill();
  ctx.fillRect(x - w * .55, y - h * .98, w * 1.1, h * .07); ctx.fillRect(x - w * .58, y - h * .05, w * 1.16, h * .05);
  for (let i = 0; i < cols; i++) { const cx = x - w * .46 + i * w * .92 / (cols - 1); ctx.fillRect(cx - w * .03, y - h * .9, w * .06, h * .86); }
  ctx.fillStyle = rad(ctx, x, y - h * .3, w * .5, [[0, rgba(P.core0, .9)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - w * .5, y - h * .9, w, h * .9);
  ctx.restore();
}
// THE KID'S NOTEBOOK: an open double page on the table (x, y = spine centre, w = width of both pages), lines, o.lines [[text, u], …] handwriting
// the moonlit page colour at night (kept a step down so the gold line reads and the frame stays near the film's luma)
export const NOTEBOOK_MOON_PAGE = mixHex(mixHex(P.cream, P.blue1, .62), P.ind1, .32);
export function notebook(ctx, x, y, w, t, o = {}) {
  const h = w * .36, k = o.moon ? COOL.mid : P.halo2;
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x, y + h * .55, w * .58, h * .14, 0, 0, 6.29); ctx.fill();
  for (const d of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(x, y - h * .48); ctx.quadraticCurveTo(x + d * w * .25, y - h * .56, x + d * w * .5, y - h * .5); ctx.lineTo(x + d * w * .5, y + h * .48); ctx.quadraticCurveTo(x + d * w * .25, y + h * .42, x, y + h * .5); ctx.closePath();
    const pg = o.moon ? NOTEBOOK_MOON_PAGE : P.cream; ctx.fillStyle = lin(ctx, x, 0, x + d * w * .5, 0, [[0, mixHex(pg, P.night1, .4)], [.15, mixHex(pg, k, .15)], [1, pg]]); ctx.fill();
    ctx.strokeStyle = rgba(P.blue1, .35); ctx.lineWidth = w * .0016; for (let i = 1; i < 8; i++) { const yy = y - h * .45 + i * h * .115; ctx.beginPath(); ctx.moveTo(x + d * w * .04, yy); ctx.lineTo(x + d * w * .47, yy); ctx.stroke(); }
  }
  (o.lines || []).forEach(([s, u], i) => handwrite(ctx, s, x - w * .46 + (i % 2 ? w * .5 : 0) * 0, y - h * .3 + i * h * .23, w * .045, u, { col: P.shade0 }));
}
// HANDWRITING in gold (Instrument Serif Italic as the base): written on left → right with a pen spark at the nib (u 0..1)
export function handwrite(ctx, s, x, y, size, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.font = `italic ${size}px "Instrument Serif"`; const w = ctx.measureText(s).width, xe = x + w * clamp(u);
  ctx.beginPath(); ctx.moveTo(x - size, y - size * 1.2); ctx.lineTo(xe + size * .25, y - size * 1.2); ctx.lineTo(xe - size * .1, y + size * .4); ctx.lineTo(x - size, y + size * .4); ctx.closePath(); ctx.clip();
  if (o.glow !== false) { ctx.shadowColor = rgba(P.halo0, .7); ctx.shadowBlur = size * .3; }
  ctx.fillStyle = o.col ?? P.halo0; ctx.fillText(s, x, y); ctx.restore();
  if (u < 1) halo(ctx, xe, y - size * .3, size * .5, .9);
  return w;
}
