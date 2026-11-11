// Film 26 · builder B1 (c02 c03 c04) · shared core: phrase anchors, ONE camera path for the whole B1 stretch (1:12.8 – 4:11.4), the
// warehouse by the river (a third set of near layers in front of the shared sky + far city: sky doors in 3.01 and 4.03), and the street
// additions (the hospital at the end of the street, the three lit windows under hers, the care room). Owned by B1; kit/seams are read-only.
//
// One camera space as everywhere (lib/f26_seams.mjs): the warehouse stands on F0 like the street, so the sky doors are exact: the camera is
// aimed at F0 y = −1700 (SKY_Y − 200) on the switch frame; there only stars + the far city are in view (both worlds call sky/city the same).
//
//   anchors(T)   every time B1 uses, from phrases (T.G with fences, never seconds). A = anchors(T).
//   camB1(A, t)  the camera (F.camPath through all keys, ref = S.Z_ROOM because of the care-window fly-in).
//   worldAt(A,t) 'street' | 'ware'  (switch frames: A.sw1 street → ware, A.sw2 ware → street; the camera is up in the stars there)
//   wareWorld(ctx, c, t, st)  st { field(ctx,c), front(ctx,c), conveyor: { u, t0 }, office: [u1,u2,u3], tiles: 0..1, gate: 0..1 }
//   hospital(ctx, t, o) · careWindows(ctx, c, t, o) (the three windows under hers; drawn in the street's `mid`, clipped interiors)
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
import * as S from './f26_seams.mjs';
const { P, W, H, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, lin, rad, prng } = E;
export const F0 = E.F0, TAU = Math.PI * 2;

// ================================================================================================================ ANCHORS (phrases only)
const AC = new WeakMap();
export function anchors(T) {
  if (AC.has(T)) return AC.get(T);
  const G = (p, after = 0, nth = 0) => T.G(p, nth, after), GE = (p, after = 0, nth = 0) => T.GE(p, nth, after);
  const a = {};
  a.TT = F.testTimes(T);
  // ---- c02
  a.b0 = T.G('And behind that picture'); a.whim = GE('not a whim', a.b0);
  a.ai = G('Artificial intelligence makes thinking', a.b0); a.thinking = G('thinking', a.ai); a.free1 = G('free', a.ai);
  a.robots = G('Robots make labor', a.b0); a.labor = G('labor', a.robots); a.free2 = G('free', a.robots);
  a.then = G('Then almost anything costs', a.b0); a.materials = G('materials', a.then); a.electricity = G('electricity', a.then); a.make = GE('to make it', a.then);
  a.pile = G('And when goods pile up', a.b0); a.money = G('faster than money', a.pile); a.rise = G("prices don't rise", a.pile); a.fall = G('They fall', a.pile);
  a.afford = G('Everyone can afford', a.b0); a.calls = G('He calls it', a.afford); a.uhi = G('universal high income', a.afford);
  a.figured = G('Even he says', a.b0); a.figuredE = GE('figured out', a.figured);
  a.advice = G("This isn't financial advice", a.b0); a.forecast = G('For his forecast', a.b0);
  a.write = a.TT.write; a.corner = a.TT.corner;
  // ---- c03
  a.c03 = G('The first line is where', a.b0);
  a.amazon = G("Amazon's warehouses", a.c03); a.million = G('million robots', a.amazon);
  a.offices = G('In offices', a.c03); a.drafts = G('first drafts', a.offices); a.code = G('checks code', a.offices); a.answers = G('answers customers', a.offices);
  a.isnt = G("It isn't almost everything", a.c03); a.notyet = G('Not yet', a.isnt); a.spreading = G("But it's spreading", a.isnt);
  a.guess = G('And by his own guess', a.c03); a.twenty = G('twenty to thirty', a.guess); a.stuff = GE('more stuff', a.guess);
  a.lot = G("That's a lot", a.c03); a.right = G("He's right", a.lot); a.endm = G("But it isn't the end of money", a.lot);
  a.space = G('For that, he says', a.c03); a.reach = G('into space', a.space); a.robots3 = G('robots, rockets', a.space); a.rockets = G('rockets', a.robots3); a.moon = G('Moon', a.robots3);
  a.first = G('So the first line', a.c03); a.onway = G('on its way', a.first);
  a.more = G('But if machines make more', a.c03); a.cheap3 = G('get cheap', a.more);
  // ---- c04
  a.c04 = T.G('Everything gets cheap', 1);
  a.heart = G('This is the heart', a.c04); a.halfS = G('And half of it', a.c04); a.half = G('half', a.halfS); a.trueA = G('already true', a.halfS);
  a.tv = G('For every dollar a TV', a.c04); a.twothousand = G('year two thousand', a.tv); a.cents = G('two cents', a.tv);
  a.soft = G('Software and phone plans', a.c04); a.phone = G('phone plans', a.soft);
  a.hosp = G('But for every dollar of hospital', a.c04); a.hospW = G('hospital care', a.hosp); a.four = G('four', a.hosp);
  a.nursing = G('Nursing homes, rent and college', a.c04); a.rent = G('rent', a.nursing); a.college = G('college', a.nursing); a.overall = G('prices overall', a.nursing);
  a.rule = G('The rule behind it', a.c04);
  a.copy = G('What a machine can copy', a.c04); a.cheap4 = G('gets cheap', a.copy);
  a.time = G("What takes a person's time", a.c04); a.place = G('particular place', a.time); a.doesnot = G('does not', a.time);
  a.look = G('Now look at what', a.c04); a.old = G("when you're old", a.look);
  a.home = G('A home', a.look); a.bed = G('A hospital bed', a.look); a.someone = G('Someone to look after', a.look);
  a.care = G('Care costs what it does', a.c04); a.ptime = G("person's time", a.care); a.hands = G('Their hands', a.care); a.patience = G('Their patience', a.care); a.makes = G("That's what makes it care", a.care); a.makesE = GE('makes it care', a.care);
  a.year = G('A year in a nursing home', a.c04); a.five = G('five years', a.year); a.check = G('Social Security check', a.year);
  a.second = G('So the second line', a.c04); a.halfV = a.TT.mark[1] ?? G('half', a.second); a.things = G('Things got cheap', a.second); a.needold = G('The things you need', a.second); a.didnot = GE('did not', a.needold);
  a.channel = G('This channel exists', a.c04); a.everybody = G('goes well for everybody', a.channel); a.including = G('Including you', a.channel); a.want = G('Want that too', a.channel); a.subscribe = G('Then subscribe', a.channel);
  a.stop = G('So when you stop working', a.channel); a.whopays = G('who pays', a.stop);
  a.T5 = T.G('Someone pays you an income', 1);
  // ---- derived beats
  a.sw1 = a.write[4] + .75;                         // sky door 1 (street → warehouse), the card is still big
  a.sw2 = a.tv + .45;                               // sky door 2 (warehouse → street) behind the torn tag
  a.lift = a.uhi + 1.1;                             // the lamp light rises from the shop (carrier up to the blueprint)
  a.belt0 = a.more - .2;                            // the conveyor rolls out of the gate
  a.tagUp = a.c04 - .1;                             // one tag leaves the conveyor and fills the frame
  a.tear = a.half + .05;                            // the tag tears on "half"
  a.flyIn0 = a.care - .3, a.flyIn1 = a.care + 2.6;   // into the third window (≥ 2.5 s)
  a.flyOut0 = a.year - .5, a.flyOut1 = a.year + 2.3; // and out again
  a.tvAt = a.cents - .2;   // the camera lands at the TV window (the descent from the sky door 4.03 needs ≈ 4 s)
  AC.set(T, a); return a;
}

// ================================================================================================================ GEOMETRY
export const Z_T = F0 * 1.25;            // the office tower behind the warehouse
export const Z_IN = F0 * 1.12;           // the warehouse hall seen through the gate
export const Z_PACK = F0 * 1.04;         // the packing tables just inside the gate
export const Z_MOON = F0 * 4.2;          // the Moon (deep: it barely moves, it is big)
export const HALL = { x0: 250, x1: 1650, top: 560, ridge: 470 };
export const GATE = { x: 760, y: 700, w: 420, h: S.GROUND - 700 };
export const TOWER = { x0: 1470, x1: 1870, roof: -380 };
export const OFFICE_WIN = [[1510, -200], [1690, -60], [1600, 100]];   // the three windows on their words (Z_T design), each 120 × 80
export const BELT = { x0: GATE.x + GATE.w - 10, x1: 3400, y: 912 };   // the conveyor out of the gate along the quay
export const STACK = { x: 980, base: HALL.ridge, cw: 128, ch: 64 };     // the crate stack on the warehouse roof deck (x 860 … 1140)
export const MOON = { x: 3000, y: -650, r: 450 };                     // on F0, far up-right: only in view when the camera is pulled back (3.07)
export const HOSP = { x0: 3020, x1: 3720, roof: -40, win: { x: 3290, y: 560, w: 200, h: 150 } };
export const CAREWIN = [{ x: 385, y: 700, w: 120, h: 170 }, { x: 615, y: 700, w: 120, h: 170 }, { x: 845, y: 700, w: 120, h: 170 }];
export const SHOPC = { x: S.SHOP.x + S.SHOP.w / 2, y: S.SHOP.y + S.SHOP.h / 2 };
export const SKY = (x) => E.aim(F0, x, -1700, 1);
const A_ = (u, v, s, Z = F0) => E.aim(Z, u, v, s);

// ================================================================================================================ CAMERA
const CK = new WeakMap();
function keysOf(a) {
  if (CK.has(a)) return CK.get(a);
  const pc = (t) => S.plateCam(t, a.b0, F0, 960, -230, 1), w = a.write;
  const K = [
    // c02: out of plateCondition (same creep), along the blueprint, down to the shop with the falling tag, up again, the card, up into the stars
    [a.b0 - .5, pc(a.b0 - .5)], [a.b0 + .5, pc(a.b0 + .5)], [a.b0 + 1.4, pc(a.b0 + 1.4)],
    [a.ai - .1, A_(930, -150, 1.1)],
    [a.robots + .9, A_(985, -158, 1.13)],
    [a.then + 2.2, A_(1050, -190, 1.12)],
    [a.pile + 2.4, A_(1120, -170, 1.14)],
    [a.fall + .4, A_(1200, -150, 1.17)],
    [a.afford + 2.6, A_(1470, 745, 1.5)],
    [a.uhi + .5, A_(1455, 730, 1.54)],
    [a.figured + .7, A_(1420, 260, 1.2)],
    [a.figured + 2.3, A_(1330, -205, 1.14)],
    [a.advice + .1, A_(1430, -195, 1.15)],
    [a.forecast + 1.2, A_(1330, -330, 1.06)],
    [w[0] + .2, A_(1320, -820, 1.05)],
    [a.sw1, SKY(1060)],   // door 2.06|3.01: x and scale keep travelling through the door (no stall at the top)
    // c03: down over the warehouse, the gate, the tower, the bar, the stack, up to the Moon (★), back down to the conveyor
    [a.c03 + .7, A_(950, -1240, .95)],
    [a.amazon + .15, A_(975, 790, 1.5)],
    [a.offices - .7, A_(980, 805, 1.62)],
    [a.offices + .55, A_(1330, 400, 1.02)],   // a breath back between the gate and the tower (smooth.py: no lurch)
    [a.offices + 1.8, A_(1650, -10, 1.55, Z_T)],
    [a.isnt + .2, A_(1640, -40, 1.6, Z_T)],
    [a.isnt + 1.4, A_(1060, -60, 1.02)],
    [a.guess + .6, A_(1010, 60, .86)],
    [a.right + .4, A_(1020, 70, .88)],
    [a.endm + 1.2, A_(1060, 150, .92)],
    [a.space + 1.4, A_(1020, -420, .8)],
    [a.rockets - .1, A_(1400, -700, .55)],
    [a.moon + .3, A_(1450, -300, .38)],
    [a.first - .1, A_(1440, -295, .374)],
    [a.onway + .9, A_(1560, 700, 1.12)],
    [a.more + 2.4, A_(1650, 860, 1.6)],
    [a.c04 + .2, A_(2150, 860, 1.6)],
    // c04: the tag fills the frame (screen) while the camera rises; sky door; the TV window; the hospital; the sky field; her window; the care
    // window (fly-in, out); the two stacks over her roof; wide over the city (subscribe); down to the mailbox = plateMailbox
    [a.heart + .8, A_(2250, 700, 1.4)],
    [a.half + 1.2, A_(1700, -620, .94)],
    [a.sw2, A_(2150, -2000, 1.0)],   // door 4.03: right of the crate stack, above the Moon's halo; x and scale keep travelling
    [a.sw2 + .6, A_(2250, -1650, 1.06)],
    [a.sw2 + 2.3, A_(1640, 60, .9)],      // down wide over the street, then in to the TV window
    [a.tvAt, A_(1470, 770, 2.05)],
    [a.soft + .9, A_(1480, 760, 2.15)],
    [a.hosp + .2, A_(2350, 520, .82)],
    [a.hosp + 1.7, A_(3330, 610, 1.42)],
    [a.nursing - .5, A_(3320, 590, 1.46)],
    [a.nursing + .6, A_(2850, 200, 1.05)],
    [a.nursing + 1.9, A_(2420, -250, .98)],
    [a.rule + .4, A_(2300, -270, 1.0)],
    [a.look - .7, A_(2260, -260, 1.02)],
    [a.look + 1.2, A_(1400, 150, .8)],
    [a.look + 2.9, A_(640, 560, 1.62)],
    [a.home - .05, A_(660, 620, 1.66)],
    [a.someone + .4, A_(760, 735, 1.85)],
    [a.flyIn0, A_(870, 780, 2.35)],
    [a.flyIn1, A_(905, 785, 15)],
    [a.makes + .6, A_(905, 784, 16.5)],
    [a.flyOut1, A_(800, 330, 1.35)],
    [a.five + .9, A_(610, 20, 1.12)],
    [a.second + .6, A_(610, -10, 1.1)],
    [a.needold + 1.6, A_(760, 20, .92)],
    [a.channel + 2.0, A_(1000, 250, .52)],
    [a.want + .2, A_(800, 300, .5)],
    // into plateMailbox with its creep already running (3 %/s push, 24 px/s truck), extrapolated back by 1 s
    [a.T5 - 1.5, A_(860 - S.TRUCK / 1.55, 760, 1.55 * (1 - S.CREEP))],
    [a.T5 - .5, S.MAIL_CAM],
    [a.T5 + .5, S.plateCam(a.T5 + .5, a.T5, F0, 860, 760, 1.55)],
    [a.T5 + 1.4, S.plateCam(a.T5 + 1.4, a.T5, F0, 860, 760, 1.55)],
  ];
  CK.set(a, K); return K;
}
// the camera never rests: on top of the key path a slow circular drift of constant screen speed (R px on the F0 plane at ω rad/s,
// ≈ 27 px/s at 1080p) plus a faint zoom breath; faded in after plateCondition and out before plateMailbox (the plates have their own creep)
const DRIFT = { R: 60, w: .45 };
export function camB1(a, t) {
  const c = F.camPath(t, keysOf(a), S.Z_ROOM);
  const e = E.smooth(span(t, a.b0 + .5, a.b0 + 2.5)) * (1 - E.smooth(span(t, a.T5 - 3, a.T5 - .5)));
  if (e <= 0) return c;
  const d = F0 - c.z, k = d / c.f, ph = DRIFT.w * (t - a.b0);
  const zb = 1 + .015 * e * Math.sin(.31 * (t - a.b0));
  return E.cam3({ x: c.x + e * DRIFT.R * (Math.sin(ph)) * k, y: c.y + e * DRIFT.R * .7 * (1 - Math.cos(ph)) * k, z: F0 - d / zb, f: c.f });
}
export const worldAt = (a, t) => (t >= a.sw1 && t < a.sw2 ? 'ware' : 'street');

// ================================================================================================================ SMALL HELPERS
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
export const qb = (p0, p1, p2, u) => [(1 - u) ** 2 * p0[0] + 2 * u * (1 - u) * p1[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * u * (1 - u) * p1[1] + u * u * p2[1]];
export function cut(pts, u) {   // the first u (0..1) of a polyline
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = L[L.length - 1] * clamp(u), out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (L[i] <= d) out.push(pts[i]); else { const f = (d - L[i - 1]) / (L[i] - L[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]); break; } }
  return out.length > 1 ? out : [pts[0], pts[0]];
}
// a caps label (Inter 600) rising out of its baseline mask
export const cap = (ctx, s, x, y, size, u, o = {}) => F.maskLine(ctx, [[s, 0]], x, y, size, F.rise(clamp(u)), { serif: false, weight: 600, align: o.align ?? 'center', col: o.col ?? F.GOLD.text, glow: false });
export const serif = (ctx, s, x, y, size, u, o = {}) => F.maskLine(ctx, [[s, o.warm ?? 0]], x, y, size, F.rise(clamp(u)), { align: o.align ?? 'center', col: o.col, glow: o.glow ?? true });
// a quote card that unfolds UP out of a base line (x centre, base y): the paper grows from the line, then the words rise. q = { lines, src }
export function qcardUp(ctx, t, x, yb, w, h, q, u, o = {}) {
  const k = expoOut(span(u, 0, .45)); if (k <= 0) return;
  ctx.save(); ctx.translate(x, yb); ctx.scale(1, Math.max(.001, k)); ctx.translate(-x, -yb);
  F.qcard(ctx, t, x - w / 2, yb - h, w, h, q, span(u, .25, 1), { size: o.size ?? 30 });
  ctx.restore();
}
// screen point of a design point (u, v) on card Z, or null
export const scr = (c, Z, u, v) => E.project(c, Z, u, v);

// ================================================================================================================ THE WAREHOUSE BY THE RIVER
const SHELVES = (() => { const r = prng(2601), out = []; for (let i = 0; i < 9; i++) out.push([560 + i * 100 + r() * 20, 640 + r() * 30, .7 + r() * .3]); return out; })();
const ROVERS = (() => { const r = prng(2602), out = []; for (let i = 0; i < 16; i++) out.push({ lane: i % 3, v: (40 + r() * 70) * (r() < .5 ? -1 : 1), ph: r(), s: 34 + r() * 10, shelf: r() < .55 }); return out; })();
function hallInterior(ctx, t, st) {
  const g = clamp(st.gate ?? 1), x0 = GATE.x - 260, x1 = GATE.x + GATE.w + 260, y0 = GATE.y - 140, y1 = S.GROUND + 40;
  // back wall: cool machine light from high windows
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(COOLD(), P.night1, .35)], [.55, mixHex(F.COOL.deep, P.blue1, .5)], [1, mixHex(P.night1, F.COOL.deep, .4)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, (x0 + x1) / 2, y0 + 40, 520, [[0, rgba(F.COOL.halo, .35 * g)], [1, rgba(F.COOL.halo, 0)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.restore();
  // rows of tall shelves (far), amber boxes on them
  for (const [x, y, k] of SHELVES) {
    ctx.fillStyle = mixHex(P.night1, F.COOL.deep, .45); ctx.fillRect(x, y, 70 * k, S.GROUND - 40 - y);
    ctx.fillStyle = mixHex(P.shade0, P.night1, .45); for (let j = 0; j < 4; j++) ctx.fillRect(x + 6, y + 20 + j * 70, 70 * k - 12, 34);
  }
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x0, S.GROUND - 46, x1 - x0, 90);
  // the swarm: flat rovers glide in three lanes under their shelves
  for (const r of ROVERS) {
    const span0 = x1 - x0 + 200, p = (((r.ph * span0 + t * r.v) % span0) + span0) % span0, x = x0 - 100 + p, y = S.GROUND - 34 + r.lane * 16;
    F.rover(ctx, t, x, y, r.s * (1 + r.lane * .12), { ph: r.ph * 9, shelf: r.shelf });
  }
}
const COOLD = () => mixHex(F.COOL.deep, P.ind1, .4);
function packing(ctx, t, st) {
  // the packing tables just inside the gate: two people stay, under the one warm lamp (the hero light of the place)
  const lx = GATE.x + GATE.w / 2, ly = GATE.y + 70, br = Math.sin(t * 1.2) * .015;
  ctx.fillStyle = mixHex(P.night0, P.night1, .4); ctx.fillRect(lx - 1, GATE.y - 40, 2, 104);
  ctx.fillStyle = mixHex(P.halo0, P.shade0, .3); ctx.beginPath(); ctx.moveTo(lx - 34, ly); ctx.lineTo(lx + 34, ly); ctx.lineTo(lx + 16, ly - 18); ctx.lineTo(lx - 16, ly - 18); ctx.closePath(); ctx.fill();
  halo(ctx, lx, ly + 10, 300, .55 * (1 + .02 * Math.sin(t * 2)), P.halo1, P.core1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo1, .2); ctx.beginPath(); ctx.moveTo(lx - 30, ly); ctx.lineTo(lx + 30, ly); ctx.lineTo(lx + 170, S.GROUND - 70); ctx.lineTo(lx - 170, S.GROUND - 70); ctx.closePath(); ctx.fill(); ctx.restore();
  E.person(ctx, lx - 120, S.GROUND - 18, 176, { dir: 1, view: 'side', armR: [.9 + .12 * Math.sin(t * 1.7), 1.5], armL: [.7, 1.3], lean: .12, look: -.2 + br, light: 1, back: .3 });
  E.person(ctx, lx + 125, S.GROUND - 18, 170, { dir: -1, view: 'side', armR: [.8, 1.45 + .1 * Math.sin(t * 1.3 + 1)], armL: [.6, 1.2], lean: .1, look: -.25 - br, light: -1, back: .3, long: true });
  ctx.fillStyle = mixHex(P.shade0, P.night1, .5); ctx.fillRect(lx - 95, S.GROUND - 108, 190, 12); ctx.fillRect(lx - 85, S.GROUND - 96, 8, 78); ctx.fillRect(lx + 77, S.GROUND - 96, 8, 78);
  ctx.fillStyle = mixHex(P.halo0, P.shade0, .45); ctx.fillRect(lx - 60, S.GROUND - 132, 46, 24); ctx.fillRect(lx + 6, S.GROUND - 128, 38, 20);
}
function tower(ctx, t, st) {
  const { x0, x1, roof } = TOWER, g0 = S.GROUND;
  ctx.fillStyle = lin(ctx, x0, roof, x1, g0, [[0, mixHex(F.NIGHT.wall, P.blue1, .3)], [.5, F.NIGHT.wall], [1, mixHex(F.NIGHT.wall, P.night0, .4)]]); ctx.fillRect(x0, roof, x1 - x0, g0 - roof);
  ctx.fillStyle = mixHex(F.NIGHT.wall, P.night0, .4); ctx.fillRect(x0 - 8, roof - 12, x1 - x0 + 16, 14); ctx.fillRect(x0 + 160, roof - 60, 12, 50);
  const r = prng(2610);
  for (let row = 0; row < 18; row++) for (let col = 0; col < 4; col++) {
    const x = x0 + 30 + col * 90, y = roof + 40 + row * 70; if (y > g0 - 120) continue;
    const special = OFFICE_WIN.some(([sx, sy]) => Math.abs(sx - x) < 60 && Math.abs(sy - y) < 40); if (special) continue;
    const lit = r() < .3 ? .3 + r() * .3 : 0; F.win(ctx, t, x, y, 60, 42, { lit, mull: [1, 1], sill: false, frame: 4, cool: r() < .4 });
  }
  const off = st.office || [0, 0, 0], tiles = clamp(st.tiles ?? 0);
  OFFICE_WIN.forEach(([x, y], i) => { officeWin(ctx, t, x, y, 120, 80, i, off[i], 0); if (tiles > 0) { ctx.fillStyle = mixHex(P.night0, P.night1, .4); ctx.fillRect(x + 4, y + 4, 112, 72); } });
}
// one office window with its screen (i: 0 a draft fills, 1 code lines turn gold, 2 a chat answers); u 0..1 the work; lift (a tile copy)
export function officeWin(ctx, t, x, y, w, h, i, u, lift = 0) {
  ctx.fillStyle = mixHex(P.night1, F.COOL.deep, .5); ctx.fillRect(x, y, w, h);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(F.COOL.halo, .25 + .15 * clamp(u * 3)); ctx.fillRect(x, y, w, h); ctx.restore();
  const p = w * .1, lw = w - 2 * p, lh = Math.max(2, h * .055);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  if (i === 0) for (let k = 0; k < 6; k++) { const f = clamp(u * 7 - k); if (f <= 0) continue; ctx.fillStyle = rgba(P.cream, .85); ctx.fillRect(x + p, y + p + k * h * .13, lw * (k === 5 ? .5 : .92) * f, lh); }
  if (i === 1) for (let k = 0; k < 6; k++) { const ind = [0, 1, 1, 2, 1, 0][k], g = clamp(u * 7 - k); ctx.fillStyle = g > 0 ? mixHex(F.COOL.line, P.halo0, g) : rgba(F.COOL.line, .7); ctx.fillRect(x + p + ind * w * .08, y + p + k * h * .13, lw * (.4 + .1 * ((k * 3) % 4)), lh); }
  if (i === 2) { const b1 = clamp(u * 3), b2 = clamp(u * 3 - 1.2);
    if (b1 > 0) { ctx.fillStyle = rgba(P.cream, .8); ctx.beginPath(); ctx.roundRect(x + p, y + p, lw * .55 * expoOut(b1), h * .2, 4); ctx.fill(); }
    if (b2 > 0) { ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.roundRect(x + w - p - lw * .7 * expoOut(b2), y + h * .42, lw * .7 * expoOut(b2), h * .36, 4); ctx.fill(); } }
  ctx.restore();
  ctx.strokeStyle = mixHex(F.NIGHT.wall, P.night0, .4); ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h);
}
function hallFacade(ctx, t, st) {
  const { x0, x1, top, ridge } = HALL, g0 = S.GROUND, G_ = GATE;
  const p = new Path2D(); p.moveTo(x0, g0); p.lineTo(x0, top);
  const n = 7, tw = (x1 - x0) / n; for (let i = 0; i < n; i++) { p.lineTo(x0 + i * tw, ridge); p.lineTo(x0 + (i + 1) * tw, top); }
  p.lineTo(x1, g0); p.closePath(); p.rect(G_.x + G_.w, G_.y, -G_.w, G_.h);
  ctx.fillStyle = lin(ctx, x0, ridge, x1, g0, [[0, mixHex(F.NIGHT.wall, P.blue1, .25)], [.5, F.NIGHT.wall], [1, mixHex(F.NIGHT.wall, P.night0, .4)]]); ctx.fill(p, 'evenodd');
  ctx.strokeStyle = rgba(P.blue0, .45); ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < n; i++) { ctx.moveTo(x0 + i * tw, ridge); ctx.lineTo(x0 + (i + 1) * tw, top); } ctx.stroke();
  // high windows (cool, the machine) and the gate frame
  for (let i = 0; i < n; i++) F.win(ctx, t, x0 + i * tw + tw * .22, top + 26, tw * .56, 44, { lit: .55, cool: true, mull: [4, 1], sill: false, frame: 4 });
  ctx.fillStyle = mixHex(F.NIGHT.wall, P.night0, .5); ctx.fillRect(G_.x - 16, G_.y - 18, G_.w + 32, 18); ctx.fillRect(G_.x - 16, G_.y, 14, G_.h); ctx.fillRect(G_.x + G_.w + 2, G_.y, 14, G_.h);
  ctx.fillStyle = mixHex(F.NIGHT.wall, P.night0, .3); for (let k = 0; k < 6; k++) ctx.fillRect(G_.x - 4, G_.y - 70 + k * 9, G_.w + 8, 4);   // the rolled-up door
  // the flat roof deck the crate stack stands on
  ctx.fillStyle = lin(ctx, 0, ridge, 0, top, [[0, mixHex(F.NIGHT.wall, P.blue1, .3)], [1, F.NIGHT.wall]]); ctx.fillRect(860, ridge, 280, top - ridge + 2);
  ctx.fillStyle = rgba(P.blue0, .6); ctx.fillRect(852, ridge - 3, 296, 4);
}
// a quay lamp
function quay(ctx, t) {
  F.street(ctx, t, S.GROUND, { x0: -2400, x1: 4600 });
}
export function conveyor(ctx, t, o) {
  const u = clamp(o.u ?? 0); if (u <= 0) return;
  const { x0, x1, y } = BELT, xe = lerp(x0, x1, expoOut(u));
  ctx.fillStyle = mixHex(P.night0, P.night1, .4); for (let x = x0 + 40; x < xe; x += 160) ctx.fillRect(x, y + 14, 8, S.GROUND - y - 14);
  ctx.fillStyle = lin(ctx, 0, y, 0, y + 16, [[0, mixHex(P.blue1, P.night1, .3)], [1, P.night1]]); ctx.fillRect(x0, y, xe - x0, 16);
  ctx.fillStyle = rgba(P.blue0, .5); for (let x = x0 + ((t * 90) % 30); x < xe; x += 30) ctx.fillRect(x, y + 6, 10, 2);
  const KIN = ['box', 'bread', 'lamp', 'shoe', 'books', 'cup', 'tv', 'box', 'chair', 'flat'];
  for (let k = 0; k < 40; k++) {   // goods ride out of the gate, each with a price tag
    const x = x0 + (t - o.t0) * 90 - k * 150; if (x < x0 + 10 || x > xe - 20) continue;
    if (o.skip === k) continue;
    const kind = KIN[k % KIN.length]; F.goods(ctx, kind, x, y, kind === 'flat' ? 40 : 48);
    F.priceTag(ctx, t, x + 26, y - 52, 34, '', { len: 14, ang: .1 * Math.sin(t * 1.6 + k) });
  }
}
// the good whose tag fills the frame in 4.01 (index on the belt) and its tag position at time t (F0 design)
export const BELT_K = 3;
export const beltX = (a, t, k = BELT_K) => BELT.x0 + (t - a.belt0) * 90 - k * 150;
export function wareWorld(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: S.SKY_GLOW });
  F.city(ctx, c, t, {});
  if (st.field) st.field(ctx, c);
  E.card(ctx, c, Z_T, () => tower(ctx, t, st));
  E.card(ctx, c, F0, () => { ctx.save(); ctx.beginPath(); ctx.rect(GATE.x, GATE.y, GATE.w, GATE.h); ctx.restore(); });
  // the hall interior and the packing tables are seen only through the gate: clip to the gate's screen rectangle
  const g0 = E.project(c, F0, GATE.x, GATE.y), g1 = E.project(c, F0, GATE.x + GATE.w, GATE.y + GATE.h);
  if (g0 && g1) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(g0[0], g0[1], g1[0] - g0[0], g1[1] - g0[1]); ctx.clip();
    E.card(ctx, c, Z_IN, () => hallInterior(ctx, t, st));
    E.card(ctx, c, Z_PACK, () => packing(ctx, t, st));
    ctx.restore();
  }
  E.card(ctx, c, F0, () => {
    hallFacade(ctx, t, st); quay(ctx, t);
    if (st.mid) st.mid(ctx, c);
    conveyor(ctx, t, st.conveyor || {});
  });
  E.card(ctx, c, S.Z_LAMP, () => { for (const [x, d] of [[-240, 1], [2050, -1], [2950, 1]]) F.streetLamp(ctx, t, x, S.GROUND + 70, 560, { dir: d }); });
  if (st.front) st.front(ctx, c);
}

// ================================================================================================================ STREET ADDITIONS
// the hospital at the end of the street (F0): a tall block, a cream cross, one lit window with a bed. o { lit 0..1 }
export function hospital(ctx, t, o = {}) {
  const { x0, x1, roof, win: w } = HOSP, g0 = S.GROUND;
  ctx.fillStyle = lin(ctx, x0, roof, x1, g0, [[0, mixHex(F.NIGHT.wall, P.blue1, .28)], [.5, F.NIGHT.wall], [1, mixHex(F.NIGHT.wall, P.night0, .4)]]); ctx.fillRect(x0, roof, x1 - x0, g0 - roof);
  ctx.fillStyle = mixHex(F.NIGHT.wall, P.night0, .4); ctx.fillRect(x0 - 10, roof - 14, x1 - x0 + 20, 16);
  const cx = (x0 + x1) / 2; ctx.fillStyle = rgba(P.cream, .85); ctx.fillRect(cx - 14, roof + 40, 28, 84); ctx.fillRect(cx - 42, roof + 68, 84, 28); halo(ctx, cx, roof + 82, 90, .18, P.blue0, P.cream);
  const r = prng(2620);
  for (let row = 0; row < 5; row++) for (let col = 0; col < 4; col++) {
    const x = x0 + 60 + col * 165, y = roof + 170 + row * 150; if (Math.abs(x - w.x) < 120 && Math.abs(y - w.y) < 100) continue;
    F.win(ctx, t, x, y, 110, 90, { lit: r() < .2 ? .3 : 0, mull: [2, 1], frame: 5 });
  }
  const lit = clamp(o.lit ?? 1);
  ctx.fillStyle = lin(ctx, 0, w.y, 0, w.y + w.h, [[0, mixHex(P.shade0, P.night1, .4)], [1, mixHex(P.halo1, P.shade0, .5)]]); ctx.fillRect(w.x, w.y, w.w, w.h);
  if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, w.x + w.w * .3, w.y + 20, w.w, [[0, rgba(P.halo1, .5 * lit)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(w.x, w.y, w.w, w.h); ctx.restore(); }
  bed(ctx, w.x + w.w * .55, w.y + w.h - 14, w.w * .62);
  ctx.strokeStyle = mixHex(F.NIGHT.wall, P.night0, .45); ctx.lineWidth = 8; ctx.strokeRect(w.x, w.y, w.w, w.h);
  ctx.fillStyle = mixHex(F.NIGHT.wallLit, P.blue0, .2); ctx.fillRect(w.x - 12, w.y + w.h + 4, w.w + 24, 10);
  if (lit > .2) halo(ctx, w.x + w.w / 2, w.y + w.h / 2, 220, .2 * lit);
  ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(cx - 70, g0 - 200, 140, 200); ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(cx - 56, g0 - 186, 112, 40);
}
// a hospital bed (side view), foot centre (x, y), width w
export function bed(ctx, x, y, w) {
  const h = w * .45;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(x - w / 2, y - h * .1, 6, -h * .9); ctx.fillRect(x + w / 2 - 6, y - h * .1, 6, -h * .6);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(x - w / 2, y - h * .45, w, h * .12); ctx.fillRect(x - w * .42, y - h * .33, 4, h * .33); ctx.fillRect(x + w * .4, y - h * .33, 4, h * .33);
  ctx.fillStyle = mixHex(P.cream, P.halo1, .35); ctx.beginPath(); ctx.roundRect(x - w / 2 + 6, y - h * .62, w - 12, h * .2, 6); ctx.fill();
  ctx.fillStyle = P.cream; ctx.beginPath(); ctx.roundRect(x - w / 2 + 10, y - h * .76, w * .22, h * .16, 8); ctx.fill();
}
// the three windows under hers (house A, row 700): 0 a door with a key, 1 a hospital bed, 2 the care room (two hands, an old hand, a cup).
// Interiors on deeper cards, clipped to each window's screen rectangle (parallax). o.lit [0..1 ×3]. Draw in streetWorld's `mid`.
export function careWindows(ctx, c, t, o = {}) {
  const lit = o.lit || [0, 0, 0];
  CAREWIN.forEach((w, i) => {
    const p0 = E.project(c, F0, w.x, w.y), p1 = E.project(c, F0, w.x + w.w, w.y + w.h); if (!p0 || !p1) return;
    const L = clamp(lit[i]); if (L <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= smooth(L); ctx.beginPath(); ctx.rect(p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]); ctx.clip();
    E.card(ctx, c, S.Z_ROOM, () => roomBack(ctx, t, w, L));
    E.card(ctx, c, S.Z_FIG, () => { if (i === 0) homeDoor(ctx, t, w, L); else if (i === 1) bed(ctx, w.x + w.w / 2 + 4, w.y + w.h - 12, w.w * .78); else careScene(ctx, t, w, L, o); });
    ctx.restore();
    E.card(ctx, c, F0, () => { ctx.globalAlpha *= smooth(L);
      ctx.strokeStyle = mixHex(F.NIGHT.wall, P.night0, .45); ctx.lineWidth = 6; ctx.strokeRect(w.x, w.y, w.w, w.h);
      ctx.fillStyle = mixHex(F.NIGHT.wallLit, P.blue0, .2); ctx.fillRect(w.x - 8, w.y + w.h + 3, w.w + 16, 8);
      if (L > .2) halo(ctx, w.x + w.w / 2, w.y + w.h / 2, 150, .14 * L);
    });
  });
}
function roomBack(ctx, t, w, L) {
  const x = w.x - 260, y = w.y - 200, ww = w.w + 520, hh = w.h + 400;
  ctx.fillStyle = lin(ctx, x, y, x + ww, y + hh, [[0, mixHex(P.shade0, P.night1, .5)], [.55, mixHex(P.halo1, P.shade0, .55)], [1, mixHex(P.halo0, P.shade0, .35)]]); ctx.fillRect(x, y, ww, hh);
  ctx.fillStyle = rgba(P.night0, .25); ctx.fillRect(x, w.y + w.h - 26, ww, 300);
  halo(ctx, w.x + w.w * .75, w.y + 30, 160, .45 * L * (1 + .02 * Math.sin(t * 2.3 + w.x)));
}
function homeDoor(ctx, t, w, L) {
  const dx = w.x + w.w * .3, dy = w.y + 30, dw = w.w * .42, dh = w.h - 42;
  ctx.fillStyle = mixHex(P.shade0, P.night1, .35); ctx.fillRect(dx, dy, dw, dh);
  ctx.fillStyle = mixHex(P.shade0, P.night1, .55); ctx.fillRect(dx + 6, dy + 8, dw - 12, dh * .38); ctx.fillRect(dx + 6, dy + dh * .52, dw - 12, dh * .4);
  ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.arc(dx + dw - 9, dy + dh * .5, 3.5, 0, TAU); ctx.fill();
  // the key, hanging on a hook beside the door, swinging a little
  const kx = w.x + w.w * .86, ky = w.y + 64, a = .2 * Math.sin(t * 1.4);
  ctx.save(); ctx.translate(kx, ky); ctx.rotate(a); ctx.strokeStyle = P.halo0; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 8, 6, 0, TAU); ctx.moveTo(0, 14); ctx.lineTo(0, 34); ctx.moveTo(0, 26); ctx.lineTo(5, 26); ctx.moveTo(0, 32); ctx.lineTo(5, 32); ctx.stroke();
  ctx.restore(); halo(ctx, kx, ky + 20, 30, .3 * L);
}
// the care room: the older you seated (yellow coat, white hair), a carer (indigo) beside her holding her hand; a cup of tea; a warm lamp.
// A person's hands and time. No machine in this room.
export function careScene(ctx, t, w, L, o = {}) {
  const cx = w.x + w.w / 2 + 2, fy = w.y + w.h + 6, br = Math.sin(t * 1.1) * .02;
  // the armchair
  ctx.fillStyle = mixHex(P.shade0, P.night1, .45); ctx.beginPath(); ctx.roundRect(cx - 52, fy - 70, 46, 64, 8); ctx.fill();
  ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.fillRect(cx - 58, fy - 38, 58, 20);
  // the older you, seated on the chair edge (drawn standing short and leaning back a little: the chair hides the legs)
  const hO = F.older(ctx, cx - 30, fy - 18, 84, { dir: 1, armR: [.55, 1.15], armL: [.2, .7], lean: -.04, look: .1 + br, light: 1, back: .2 });
  ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.fillRect(cx - 60, fy - 30, 30, 26);
  // the carer, leaning toward her, both hands round her hand
  const k = o.hold ?? 1;
  E.person(ctx, cx + 34, fy - 2, 96, { dir: -1, view: 'side', armR: [lerp(.3, .95, k), lerp(.4, 1.55, k)], armL: [lerp(.2, .8, k), lerp(.3, 1.35, k)], lean: .18 + .02 * Math.sin(t * .9), look: -.15 - br, light: -1, back: .25, long: true });
  // the small table and the cup of tea (steam rises)
  ctx.fillStyle = mixHex(P.shade0, P.night1, .5); ctx.fillRect(cx + 46, fy - 40, 34, 5); ctx.fillRect(cx + 61, fy - 36, 4, 34);
  F.goods(ctx, 'cup', cx + 62, fy - 40, 16);
  ctx.strokeStyle = rgba(P.cream, .35); ctx.lineWidth = 1.2; for (let s = 0; s < 2; s++) { ctx.beginPath(); for (let j = 0; j <= 10; j++) { const yy = fy - 50 - j * 2.4, xx = cx + 60 + s * 5 + 2.5 * Math.sin(t * 2 + j * .6 + s * 2); j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  // where the hands meet: a soft warm light
  halo(ctx, hO.R[0] + 4, hO.R[1], 26, .35 * L, P.halo1, P.core1);
  return hO;
}
