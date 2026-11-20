// Film 23 · B3 · the dinner's CITY WINDOWS (rework 9.11.): at dinner the light wall opens a window into the real city, the camera flies
// into it, lives there a few seconds (evening, warm windows, people, a robot / shuttle still moving), and pulls back to the table.
//
//   PORTAL      the window on the light wall: 16:9, world units on ZB, centred on the light area (≈ wall px 472–1448 × 176–724)
//   CAM_PORTAL  the kitchen camera that shows exactly the portal, full frame (it is inside the kitchen, nothing of the room in front)
//   cityWindow({ t0, tFull, tBack, t1, from, to, view(t) → { cam, state }, life(ctx, c, t) })
//               t0: the portal starts to open (a mask that grows out of `from` [X, Y] on the wall) and the push begins;
//               tFull: the portal fills the frame (the kitchen camera == CAM_PORTAL; from here only the city is drawn, 1:1);
//               tBack: the pull back starts; t1: the portal has closed into `to` [X, Y] on the wall.
//               → { on(t), w(t), cam(base, t), wall(ctx, t), full(t), drawFull(ctx, t) }
//   The city is drawn by the lead's K.world into ONE persistent offscreen canvas (no canvas per frame), then masked into the portal.
//   Camera blend: x, y, f linear, z in log of the distance to the wall (as camAt), so the push is a calm fly-into-the-surface.
//   Life helpers (all world → screen through the city camera): walkers, agentOn (agent light + thread), robot, shuttle, school rooms.
import { createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
import * as ST from './f23_street.mjs';   // B1's shared street life (delivery robot, shuttle)
const { W, H, P, clamp, lerp, span, sineIO, expoOut, expoIn, rgba, mixHex, lin, rad, halo, camDrift, prng } = E;
const { ZS, ZB, LIGHTWALL: LW, COOL, WARM, FLOOR, SLAB, floorY } = K;

export const PORTAL = { w: 500, h: 500 * 9 / 16, x: LW.cx - 250, y: LW.cy - 500 * 9 / 32 };
export const CAM_PORTAL = K.look(LW.cx, LW.cy, ZB, W / PORTAL.w, 960, 540);

const OFF = createCanvas(W, H), OX = OFF.getContext('2d');
let LAST = { key: null };

export function blendCam(a, b, k, ref = ZB) {
  if (k <= 0) return a; if (k >= 1) return b;
  const o = { ...b }; for (const q of ['x', 'y', 'f']) o[q] = lerp(a[q], b[q], k);
  const da = Math.max(1, ref - a.z), db = Math.max(1, ref - b.z); o.z = ref - Math.exp(lerp(Math.log(da), Math.log(db), k));
  o.roll = 0; return o;
}

export function cityWindow(o) {
  const id = Symbol('win');
  const w = (t) => t < o.tBack ? sineIO(span(t, o.t0 + .2, o.tFull)) : 1 - sineIO(span(t, o.tBack, o.t1 - .55));
  const g = (t) => t < o.tBack ? expoOut(span(t, o.t0, o.t0 + 1.0)) : 1 - expoIn(span(t, o.t1 - .75, o.t1));
  const on = (t) => t > o.t0 && t < o.t1;
  const render = (t) => {
    if (LAST.key === id && LAST.t === t) return;
    const v = o.view(t);
    OX.setTransform(1, 0, 0, 1, 0, 0); OX.globalAlpha = 1; OX.globalCompositeOperation = 'source-over';
    if (v.state.warm != null) duskWorld(OX, v.cam, t, v.state); else K.world(OX, v.cam, t, v.state);
    if (o.life) { OX.save(); o.life(OX, v.cam, t); OX.restore(); }
    LAST = { key: id, t };
  };
  // the mask rect (world units on ZB): grows out of `from`, closes into `to`
  const rect = (t) => {
    const k = g(t), p = t < o.tBack ? o.from : o.to;
    return [lerp(p[0], PORTAL.x, k), lerp(p[1], PORTAL.y, k), lerp(0, PORTAL.w, k), lerp(0, PORTAL.h, k)];
  };
  return {
    on, w, o,
    cam: (base, t) => on(t) ? blendCam(base, CAM_PORTAL, w(t)) : base,
    full: (t) => on(t) && w(t) >= 1,
    // in screen space, right after the kitchen world (drawing it inside wallFn let the room's light wash over it: a colour pop at full)
    screen(ctx, c, t) {
      if (!on(t)) return; const [x, y, ww, hh] = rect(t); if (ww < .5 || hh < .5) return;
      const a = K.wp(c, x, y, ZB), b = K.wp(c, x + ww, y + hh, ZB), p0 = K.wp(c, PORTAL.x, PORTAL.y, ZB), p1 = K.wp(c, PORTAL.x + PORTAL.w, PORTAL.y + PORTAL.h, ZB);
      if (!a || !b || !p0 || !p1) return;
      render(t);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.clip();
      ctx.drawImage(OFF, p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]);
      ctx.restore();
      // a warm rim of light round the opening (outside the picture, so it leaves the frame exactly when the portal fills it)
      const r = Math.max(1.5, 1.4 * a[2]);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(P.halo0, .22); ctx.lineWidth = 4 * r; ctx.strokeRect(a[0] - 2.5 * r, a[1] - 2.5 * r, b[0] - a[0] + 5 * r, b[1] - a[1] + 5 * r);
      ctx.strokeStyle = rgba(P.core1, .9); ctx.lineWidth = r; ctx.strokeRect(a[0] - r / 2, a[1] - r / 2, b[0] - a[0] + r, b[1] - a[1] + r); ctx.restore();
    },
    drawFull(ctx, t) { render(t); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(OFF, 0, 0); ctx.restore(); },
  };
}
// apply a list of windows: camera, wall, full
export const winCam = (wins, base, t) => { for (const v of wins) if (v.on(t)) return v.cam(base, t); return base; };
export const winScreen = (wins, ctx, c, t) => { for (const v of wins) v.screen(ctx, c, t); };
export const winFull = (wins, t) => wins.find((v) => v.full(t));

// ================================================================================================ the evening city (state)
// 19:00 → 20:00: the last golden light, then evening; many warm windows, street lamps on, a few machine points in rooms
export function evening(hour, o = {}) {
  return {
    hour, warm: o.warm ?? clamp((20.5 - hour) / 1.5), lamps: 1, cool: o.cool ?? .12,
    winFn: o.winFn || ((wn) => ({ lit: wn.r < (o.win ?? .58) ? 1 : 0, gold: 0, cool: wn.q < (o.cool ?? .12) && wn.r < .58 ? 1 : 0 })),
    you: { hallLamp: 1, rooms: { l1a: .7, l3b: .6, l0b: .5 }, kid: { asleep: false, lamp: .5 }, kitchen: { lamp: 1, wall: .35, scan: null, phone: null, people: [] } },
    dad: { open: 0 },
    tower: { glow: 1 }, testers: o.testers || {}, clinic: { glow: 1, lit: 1 },
    over: o.over || null,
  };
}
// the dusk: the lead's world layers under OUR sky (19:00 is golden last light: an orange-gold horizon, a low sun going down behind
// the skyline on the right, a warm light from it over the street; it cools into evening as `warm` sinks 1 → 0)
const DUSK_HOR = '#eab066', DUSK_MID = mixHex(P.blue1, '#a28f7b', .55);
export function duskWorld(ctx, c, t, o) {
  const wm = clamp(o.warm), L0 = K.hourLook(o.hour);
  const L = { ...L0, top: mixHex(L0.top, P.ind1, .5 * wm), hor: mixHex(L0.hor, DUSK_HOR, wm), gold: Math.max(L0.gold, .7 * wm), star: L0.star * (1 - wm), win: L0.win };
  const oo = { ...o, L };
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const hy = H / 2;
  ctx.fillStyle = lin(ctx, 0, hy - 1300, 0, hy, [[0, mixHex(L0.top, P.ind1, .6 * wm)], [.55, mixHex(mixHex(L0.top, L0.hor, .5), DUSK_MID, wm)], [.85, mixHex(L0.hor, '#d7955a', wm)], [1, mixHex(L0.hor, DUSK_HOR, wm)]]);
  ctx.fillRect(0, 0, W, H);
  if (L.star > .02) E.stars(ctx, 2337, 140, t, [-200 - c.x * .004, 0, W + 400, hy - 60], .7 * L.star);
  // the low sun (world, far): right of the street, sinking behind the skyline as the evening goes on
  const k = c.f / (40000 - c.z), sx = W / 2 + (9000 - c.x) * k, sy = H / 2 + (lerp(300, -900, wm) - c.y) * k, r = Math.max(14, 1500 * k);
  if (wm > .05) {
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = rad(ctx, sx, Math.min(sy, hy), W * .7, [[0, rgba(WARM.mid, .55 * wm)], [.35, rgba(WARM.deep, .28 * wm)], [1, rgba(WARM.deep, 0)]]); ctx.fillRect(0, 0, W, H);
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hy); ctx.clip(); ctx.fillStyle = rad(ctx, sx, sy, r, [[0, P.core0], [.6, P.core1], [1, WARM.hi]]); ctx.beginPath(); ctx.arc(sx, sy, r, 0, 6.29); ctx.fill(); ctx.restore();
  }
  ctx.restore();
  K.skyline(ctx, c, t, oo);
  K.tower(ctx, c, t, { ...(o.tower || {}), L });
  K.backRow(ctx, c, t, K.STREET.rows[1], oo);
  K.testersHouse(ctx, c, t, o.testers || {});
  K.backRow(ctx, c, t, K.STREET.rows[0], oo);
  K.streetRow(ctx, c, t, oo);
  K.streetFront(ctx, c, t, oo);
  if (wm > .05) {   // the last light rakes in from the right over the whole street (warm, soft)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = lin(ctx, W * 1.1, 0, -W * .2, 0, [[0, rgba(WARM.deep, .32 * wm)], [.5, rgba(WARM.deep, .12 * wm)], [1, rgba(WARM.deep, 0)]]); ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}
// city cameras: word keys + drift + a steady slow truck to the right (≈ 40 screen px/s), so a held view never reads as a still
export const camKeys = (t, keys, ref, drift = .35, seed = 9, pan = 40) => {
  const c = camDrift(E.camAt(t, keys, ref), t, drift, seed), s = c.f / Math.max(1, ref - c.z);
  return { ...c, x: c.x + (t - keys[0][0]) * pan / s };
};

// ================================================================================================ life
// a walker on the pavement (feet Y 0 at depth Z): x(t) = x0 + v (t − ts); a stand-still when v == 0. Returns its hands (screen) + head.
export function walker(ctx, c, t, p) {
  const v = p.v ?? 0, x = p.x0 + v * (t - (p.ts ?? 0)), dir = p.dir ?? (v >= 0 ? 1 : -1), h = p.h ?? 140;
  const moving = Math.abs(v) > 1;
  let hands = null;
  K.atZ(ctx, c, p.z, () => {
    const q = { pose: moving ? 'walk' : (p.pose || 'stand'), walk: moving ? (t - (p.ts ?? 0)) * 2 * Math.PI * Math.abs(v) / (h * 1.05) + (p.ph ?? 0) : undefined, dir, seed: p.seed ?? 3, armR: p.armR, armL: p.armL, look: p.look, lean: p.lean, long: p.long, light: p.light ?? 1 };
    hands = p.you ? K.you(ctx, x, 0, h, t, { ...q, out: true }) : p.kid ? K.kid(ctx, x, 0, h, t, q) : K.other(ctx, x, 0, h, t, q);
  });
  const s = c.f / (p.z - c.z), sx = W / 2 + (x - c.x) * s, sy = H / 2 + (0 - c.y) * s;
  const toS = (hp) => hp ? [W / 2 + (hp[0] - c.x) * s, H / 2 + (hp[1] - c.y) * s] : null;
  return { x, s, foot: [sx, sy], head: [sx, sy - h * .93 * s], R: toS(hands?.R), L: toS(hands?.L), h };
}
// an agent light floating at a walker's shoulder, tied by a thread: gold to the wrist (o.gold 0..1) or cool up to its maker (o.to [x, y])
export function agentOn(ctx, wk, t, o = {}) {
  const s = wk.s, side = o.side ?? 1, ph = o.ph ?? 0;
  const ax = wk.foot[0] + side * wk.h * .42 * s + Math.sin(t * .9 + ph) * 3 * s, ay = wk.head[1] - wk.h * .06 * s + Math.sin(t * 1.7 + ph) * 4 * s, r = Math.max(3.2, wk.h * .075 * s);
  const hand = (side > 0 ? wk.R : wk.L) || wk.R || wk.L;
  if (o.cool > 0 && o.to) {   // the cool thread up to the maker (u0 retracts after the cut: the loose end falls)
    const fall = clamp(o.fall ?? 0), end = [lerp(o.to[0], ax + (o.to[0] - ax) * .2, fall), lerp(o.to[1], ay + 60 + 80 * fall, fall)];
    K.thread(ctx, [ax, ay], end, t, { u: o.cool, sag: 10 + 70 * fall, cool: true, w: 1.6, a: .85 * (1 - fall * .6) });
  }
  if ((o.gold ?? 0) > 0 && hand) K.thread(ctx, [ax, ay + r * .6], hand, t, { u: o.gold, sag: 6 * s + 4, w: Math.max(1.4, 2.2 * s), a: 1 });
  K.agentLight(ctx, ax, ay, r, t, { warm: o.warm ?? 1, a: 1 });
  return [ax, ay];
}
// a small delivery robot: a rounded cart of light on two wheels, a cool lamp strip, a parcel; rolls at depth Z, feet on Y 0
export function robot(ctx, c, t, p) {
  const x = p.x0 + (p.v ?? 0) * (t - (p.ts ?? 0)), dir = Math.sign(p.v || 1);
  K.atZ(ctx, c, p.z, () => ST.deliveryRobot(ctx, x, 0, (p.len ?? 70) / 70, t, { dir, roll: x, flag: true }));
  return x;
}
// a slow city shuttle (B1's street shuttle) at depth Z
export function shuttle(ctx, c, t, p) {
  const x = p.x0 + (p.v ?? 0) * (t - (p.ts ?? 0)), dir = Math.sign(p.v || 1);
  K.atZ(ctx, c, p.z, () => ST.shuttle(ctx, x, 0, (p.len ?? 470) / 470, t, { dir, riders: 3, roll: x }));
  return x;
}
// a '?' of light that rises from a point and fades out by its height (small, gold or cool)
export function qRise(ctx, x, y, size, t, t0, dur = 2.2, o = {}) {
  const u = span(t, t0, t0 + dur); if (u <= 0 || u >= 1) return;
  const a = Math.sin(Math.PI * u), yy = y - size * 1.6 * expoOut(u);
  ctx.save(); ctx.globalAlpha *= a; E.glowText(ctx, '?', x, yy, { size, serif: true, align: 'center', col: o.cool ? COOL.core : P.core1 }); ctx.restore();
}

// ================================================================================================ places drawn over the street row
// THE SCHOOL in section (replaces the street-row facade X 2700 … 4050 below level 3): 3 levels × 2 classrooms, lamps per room,
// items per room id 'l0a' … 'l2b': [[Z, fn(ctx)]] (world units on their own plane)
export const SCHOOL = { x0: 2700, x1: 4050, xm: 3375, floors: 3 };
export function school(ctx, c, t, L, o = {}) {
  const S = SCHOOL, rooms = o.rooms || {};
  for (let l = 0; l < S.floors; l++) for (const [a, b, k] of [[S.x0, S.xm, 'a'], [S.xm, S.x1, 'b']]) {
    const id = `l${l}${k}`, lamp = rooms[id] ?? 0;
    K.room(ctx, c, t, L, { x0: a, x1: b, level: l, lamp, lampX: (a + b) / 2,
      back: (cx) => { board(cx, (a + b) / 2, floorY(l) - 300, lamp, k === 'a'); },
      items: (o.items || {})[id] || [] });
  }
  K.atZ(ctx, c, ZS, () => {   // the cut faces: slabs, outer walls, the partition; a roof parapet with a small bell-less sign of a '?'
    const cut = mixHex(P.ind2, P.blue1, .35), wl = 40, top = floorY(S.floors);
    for (let l = 0; l <= S.floors; l++) { const y = floorY(l); ctx.fillStyle = cut; ctx.fillRect(S.x0 - wl, y, S.x1 - S.x0 + 2 * wl, SLAB); ctx.fillStyle = rgba(P.blue0, .9); ctx.fillRect(S.x0 - wl, y, S.x1 - S.x0 + 2 * wl, 4); }
    ctx.fillStyle = cut; ctx.fillRect(S.x0 - wl, top, wl, -top); ctx.fillRect(S.x1, top, wl, -top);
    for (let l = 0; l < S.floors; l++) ctx.fillRect(S.xm - 12, floorY(l + 1) + SLAB, 24, FLOOR - SLAB);
  });
}
function board(ctx, x, y, lamp, left) {   // a dark board on the back wall (with a faint '?' when the room is lit)
  ctx.fillStyle = mixHex(P.night0, P.ind0, .6); ctx.fillRect(x - 170, y, 340, 150);
  ctx.fillStyle = rgba(P.blue1, .5); ctx.fillRect(x - 176, y + 150, 352, 6);
  if (lamp > .2) E.glowText(ctx, left ? '?' : '? ?', x, y + 105, { size: 70, serif: true, align: 'center', col: rgba(P.cream, .55 * lamp) });
}
// a desk with a seated person (in a room, at depth Z), facing the board (back view) or sideways; o.light: a small cool tutor light
export function deskPerson(ctx, x, yF, t, o = {}) {
  const h = o.h ?? 130, sY = yF - h * .3;
  ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.fillRect(x - 46, yF - 56, 92, 7); ctx.fillRect(x - 40, yF - 50, 6, 50); ctx.fillRect(x + 34, yF - 50, 6, 50);
  const q = { seed: o.seed ?? 5, dir: o.dir ?? 1, armR: o.armR ?? [1.1, 1.7], armL: o.armL ?? [.9, 1.6], look: o.look ?? .2, lean: o.lean ?? .1 };
  ctx.save(); ctx.beginPath(); ctx.rect(x - 200, yF - h * 1.6, 400, h * 1.6 - 50); ctx.clip();   // seated: the legs are hidden by the desk
  const hd = o.kid ? K.kid(ctx, x - (o.dir ?? 1) * 22, yF + h * .32, h, t, q) : K.other(ctx, x - (o.dir ?? 1) * 22, yF + h * .32, h, t, q);
  ctx.restore();
  if (o.tutor) K.voiceLight(ctx, x + (o.dir ?? 1) * 26, yF - 76 + Math.sin(t * 1.5 + (o.seed ?? 0)) * 2, 7, t, { talk: o.talk ?? .2, a: o.tutor });
  return hd;
}
