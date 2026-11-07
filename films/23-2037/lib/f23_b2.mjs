// Film 23 · B2 · shared pieces of c06 (16:00 Dad) and c07 (19:00 dinner): the light of the hours over the chunk boundary, the travel
// home (the rise over the city during subscribe line 1, then down into the lit kitchen), Dad's building extras (the upper balcony, the
// balcony door, railings redrawn over the figures), and small light graphics (earbud badge, waves).
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
import { dinnerPeople } from './f23_b2_dinner.mjs';
const { W, H, P, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, mixHex, rgba, rad, lin, halo } = E;
const { ZS, ZB, KITCHEN, STREET, floorY } = K;
const KY = KITCHEN.floor, D = STREET.dad;

// ---------------------------------------------------------------- anchors shared by c06 and c07 (global phrases, robust T.G)
export function homeAnchors(T) {
  const tFour = T.G("Four o'clock");
  const tNot = T.G('Not here', 0, tFour), tWhy = T.G('Why not', 0, tFour);
  const tSub = T.G('This channel exists', 0, tFour), tSubE = T.GE('subscribe', 0, tSub);
  const tSeven = T.G("Seven o'clock", 0, tSub), tDinner = T.G('dinner', 0, tSeven), tKid = T.G('Your kid', 0, tSeven);
  return { tFour, tNot, tWhy, tSub, tSubE, tSeven, tDinner, tKid };
}
// the light of the hours: 16:00 the walk and Dad; the sun goes down over the subscribe line (18.75); the HUD clock jumps to 19:00 while
// the world's light keeps sinking to 19 over 3 s, then 19.5 by the B3 seam (WALL_STATE)
export function hourAt(t, A) {
  if (t < A.tWhy) return 16;
  if (t < A.tSeven) return lerp(16, 18.75, sineIO(span(t, A.tWhy, A.tSeven - .4)));
  return 18.75 + .25 * sineIO(span(t, A.tSeven, A.tSeven + 3)) + .5 * clamp((t - A.tSeven) / 104);   // the light keeps going (no jump at the seam)
}

// ---------------------------------------------------------------- the travel home (c06 end → c07 start; ONE function for both)
// HIGH: the whole lit city at dusk (the rise during subscribe line 1); DINNER: the two at the kitchen table, the light wall above.
export const HIGH = K.look(900, -2700, ZS, .13, 960, 660);
export const DINNER = K.look(-1280, KY - 120, ZB - 170, 2.7, 960, 560);
export const homeKeys = (A) => [[A.tSubE + .3, HIGH], [A.tKid - .2, DINNER, 'l']];   // 303.3 → 310.2: down into the kitchen
// the descent itself (HIGH → DINNER): the kitchen glides to its place on screen while the distance shrinks on a log scale, so the
// camera homes in on the kitchen the whole way (a plain key lerp wanders over the neighbouring rooms at close range)
export function homeCam(t, A) {
  const [k0, k1] = homeKeys(A), a = k0[1], b = k1[1], Tp = [-1280, KY - 120, ZB - 170];
  if (t <= k0[0]) return { ...a }; if (t >= k1[0]) return { ...b };
  const u = E.trapIO(span(t, k0[0], k1[0])), p0 = K.wp(a, ...Tp), d0 = Tp[2] - a.z, d1 = Tp[2] - b.z;
  const d = Math.exp(lerp(Math.log(d0), Math.log(d1), u)), px = lerp(p0[0], 960, u), py = lerp(p0[1], 560, u);
  return { ...b, z: Tp[2] - d, x: Tp[0] - (px - W / 2) * d / b.f, y: Tp[1] - (py - H / 2) * d / b.f };
}
// the kitchen's lamp switches on as the camera comes down (seen from far): the carrier into the dinner
export const lampAt = (t, A) => expoOut(span(t, A.tSubE + 1.2, A.tSubE + 1.9));
// o.kitchen: extra kitchen options merged in (c07/c08: people with poses, wallFn); the rest of o overrides top-level world options
export function homeWorld(ctx, c, t, A, o = {}) {
  const lamp = lampAt(t, A), { kitchen: ko = {}, ...rest } = o;
  K.world(ctx, c, t, {
    hour: hourAt(t, A),
    lamps: clamp((hourAt(t, A) - 17.6) / .6),
    you: { hallLamp: lamp, rooms: YOUR_ROOMS, kid: { asleep: false, lamp: 0 }, kitchen: { lamp, wall: .35 * lamp, scan: null, phone: null, people: lamp > .5 ? dinnerPeople(t, c) : [], ...ko } },
    dad: DAD_REST(t, A),
    over: (cx) => dadBalconies(cx, t, {}),
    ...rest,
  });
}

// the evening rooms of your building and of Dad's (lamps come on with the dusk)
export const YOUR_ROOMS = { l1a: .7, l3b: .6 };
export const dadRooms = (k) => ({ l3b: .85, l4b: .55 * k, l2a: .5 * k, l1a: .45 * k, l0b: .4 * k });
export const DAD_REST = (t, A) => ({ open: 1, lamp: .85, rooms: dadRooms(1) });
// Dad (his side balcony, level 3) and the neighbour on the roof terrace of the next building (same height, across a narrow gap);
// o.dad / o.nb: pose overrides; o.dadTurn 0..1 (Dad turns round: a flip through his profile); railings drawn over the figures
export const DAD_AT = [6560, floorY(3)], NB_AT = [6985, -1500];
export const DAD_REST_POSE = { dir: 1, look: .2, armR: [.25, .35], armL: [-.15, -.05] };
export const NB_REST_POSE = { dir: -1, look: .1, lean: .06, armR: [.3, .5], armL: [.2, .4] };
function terrace(ctx, t) {   // the neighbour's roof terrace: a parapet rail, a chair, a pot
  const y = NB_AT[1], x0 = 6900, x1 = 7400;
  ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fillRect(7150, y - 54, 50, 54); ctx.fillRect(7140, y - 90, 10, 90);
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .25); ctx.beginPath(); ctx.ellipse(7290, y - 100, 36, 62 + 2 * Math.sin(t * .9), .05 * Math.sin(t * .7), 0, 6.29); ctx.fill();
  ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fillRect(7270, y - 46, 44, 46);
}
function terraceRail(ctx) { const y = NB_AT[1]; ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(6915, y); ctx.lineTo(6915, y - 130); ctx.lineTo(7400, y - 130); ctx.stroke(); ctx.lineWidth = 3; for (let x = 6955; x < 7400; x += 48) { ctx.beginPath(); ctx.moveTo(x, y - 130); ctx.lineTo(x, y); ctx.stroke(); } }
export function dadBalconies(ctx, t, o = {}) {
  terrace(ctx, t);
  if (!o.nbHide) K.other(ctx, o.nbX ?? NB_AT[0], NB_AT[1], 138, t, { seed: 6, long: true, ...NB_REST_POSE, ...(o.nb || {}) });
  terraceRail(ctx);
  if (o.before) o.before(ctx);
  if (!o.dadHide) {
    const dp = { seed: 3, ...DAD_REST_POSE, ...(o.dad || {}) }, turn = o.dadTurn ?? 0, x = o.dadX ?? DAD_AT[0];
    if (turn > 0 && turn < 1) { const k = Math.cos(Math.PI * turn); ctx.save(); ctx.translate(x, 0); ctx.scale(Math.sign(k || 1) * Math.max(.08, Math.abs(k)), 1); K.dad(ctx, 0, DAD_AT[1], 145, t, { ...dp, dir: dp.dir }); ctx.restore(); }
    else K.dad(ctx, x, DAD_AT[1], 145, t, { ...dp, dir: turn >= 1 ? -dp.dir : dp.dir });
  }
  if (o.after) o.after(ctx);
  railing(ctx, 3);
}

// ---------------------------------------------------------------- Dad's building extras (world units on the section plane ZS)
const CUT = mixHex(P.ind2, P.blue1, .35);
export function railing(ctx, level, a = 1) {
  const [b0, b1] = D.balcony, by = floorY(level);
  ctx.strokeStyle = rgba(P.blue1, .9 * a); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(D.x1 + 60, by - 150); ctx.lineTo(b1, by - 150); ctx.lineTo(b1, by); ctx.stroke();
  ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(D.x1 + 90 + i * 45, by - 150); ctx.lineTo(D.x1 + 90 + i * 45, by); ctx.stroke(); }
}
export function upperBalcony(ctx, t) {
  const [b0, b1] = D.balcony, by = floorY(4);
  ctx.fillStyle = CUT; ctx.fillRect(D.x1 + 44, by, b1 - D.x1 - 44, K.SLAB);
  ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fillRect(b1 - 110, by - 54, 50, 54);
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .25); ctx.beginPath(); ctx.ellipse(b1 - 85, by - 110, 34, 60 + 2 * Math.sin(t * .9), .05 * Math.sin(t * .7), 0, 6.29); ctx.fill();
}
// the balcony door at the right end of the facade (level 3): opens warm; o 0..1
export const DOOR = { x0: D.x1 - 112, x1: D.x1 + 28, y1: floorY(3), y0: floorY(3) - 300 };
export function balconyDoor(ctx, open) {
  const { x0, x1, y0, y1 } = DOOR;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .35); ctx.fillRect(x0 - 8, y0 - 8, x1 - x0 + 16, y1 - y0 + 8);
  if (open > 0) ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.night1, K.WARM.deep, .5 * open)], [.7, mixHex(P.night1, K.WARM.mid, .55 * open)], [1, mixHex(P.night1, K.WARM.hi, .7 * open)]]), ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  const lw = (x1 - x0) * (1 - .85 * smooth(open));   // the door leaf swings in (gets narrow)
  ctx.fillStyle = mixHex(P.ind2, P.night1, .45); ctx.fillRect(x0, y0, lw, y1 - y0);
  ctx.fillStyle = rgba(P.blue1, .7); ctx.fillRect(x0 + lw - 5, y0, 5, y1 - y0); ctx.fillRect(x0 + lw - 22, y0 + 150, 10, 22);
}

// ---------------------------------------------------------------- small light graphics
// a pair of earbuds with a soft cool ring round it (reads as "the same good thing" at a distance). a 0..1 grows (scale from the centre)
export function budBadge(ctx, x, y, s, t, a = 1, dim = 0) {
  if (a <= 0) return;
  const k = expoOut(a), lit = 1 - dim;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = rad(ctx, 0, 0, s * 4.2, [[0, rgba(K.COOL.mid, .38 * lit)], [.5, rgba(K.COOL.edge, .14 * lit)], [1, rgba(K.COOL.edge, 0)]]); ctx.fillRect(-s * 4.2, -s * 4.2, s * 8.4, s * 8.4);
  ctx.strokeStyle = rgba(K.COOL.mid, .7 * lit + .15); ctx.lineWidth = Math.max(1.5, s * .12); ctx.beginPath(); ctx.arc(0, 0, s * 2.4, 0, 6.29); ctx.stroke();
  K.earbuds(ctx, 0, 0, s, t, { a: .35 + .65 * lit });
  ctx.restore();
}
// a waveform line between x0 and x1 at y: amp (world units), clarity 0..1 (faint & ragged → full & clean), col
export function waveform(ctx, x0, x1, y, amp, t, clar, col = P.core1, w = 3) {
  const n = 48; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const v = i / n, env = Math.sin(Math.PI * v) ** 1.2, ragged = (1 - clar) * .55 * Math.sin(v * 53 + t * 9), y1 = y + amp * env * (Math.sin(v * 22 - t * 6) * (.6 + .4 * clar) + ragged); i ? ctx.lineTo(lerp(x0, x1, v), y1) : ctx.moveTo(lerp(x0, x1, v), y1); } };
  path(); ctx.strokeStyle = rgba(P.halo0, .25 * (.3 + .7 * clar)); ctx.lineWidth = w * 4; ctx.stroke();
  path(); ctx.strokeStyle = rgba(col, .35 + .65 * clar); ctx.lineWidth = w; ctx.stroke();
  ctx.restore();
}
