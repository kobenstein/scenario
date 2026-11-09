// Film 23 · STREET LIFE (B1, 2026-11-09 rework: Jakob wants the day out in a living street). Shared module: B1, B2 and B3 may import it.
// Flat editorial shapes in the kit's palette (P + COOL; gold only as the care accent), soft edges, always alive (a bob, a blink of the
// status light, turning wheels/rotors). No faces, nothing humanoid: robots are friendly appliances (rounded boxes on wheels, a cool dot).
//
// All functions draw in the CALLER'S coordinates, like the kit objects: (x, y) = the ground contact point (bottom centre), so they work
// on screen (s = px per world unit) and inside K.atZ(ctx, c, Z, (s) => …) in world units (s = 1 → real size next to a 140-tall you).
// Real sizes at s = 1: delivery robot ≈ 62 tall · 70 long, drone ≈ 80 wide (box hangs ≈ 60 below), shuttle ≈ 190 tall · 470 long,
// stall ≈ 240 wide · 230 tall. Motion is the caller's job (move x with sineIO/linear drift); the functions animate their own parts from t.
//
//   deliveryRobot(ctx, x, y, s, t, o)   a small rolling box on six wheels with a lid and a cool status dot.
//        o: { dir ±1 (facing), roll (distance travelled in world units → wheel turn; default t·40), lid 0..1 (opens), crates 0..3
//             (stacked crates on its back: the market's carrier), flag true (a thin whip with a gold pennant), a 0..1, day 0..1 }
//   drone(ctx, x, y, s, t, o)           a flat four-rotor drone; (x, y) = its body centre (it flies, no ground).
//        o: { dir ±1, tilt (rad, nose down when moving), box true (a small parcel hangs below), med true (the parcel carries the
//             clinic's gold ring = medicine), a, day }
//   shuttle(ctx, x, y, s, t, o)         a quiet driverless shuttle: a rounded cabin with a long window band, no driver's seat.
//        o: { dir ±1, doors 0..1 (the middle door slides open), riders 0..4 (indigo silhouettes inside), roll (distance → wheels),
//             a, day }
//   stall(ctx, x, y, s, t, o)           a market stall: a striped awning on two posts, a table with goods.
//        o: { goods 'fruit'|'bread'|'flowers'|'crates', awn 'gold'|'blue' (gold = the one warm accent, use sparingly), sway 0..1, a, day }
//   passerby(ctx, x, y, h, t, o)        an indigo passer-by (K.other), walking or standing, alive.
//        o: { dir ±1, walk (phase; default from t), stand true, bag true (a small shopping bag), seed, light, a }
//   shuttleStop(ctx, x, y, s, t, o)     a slim stop pole with a cool sign disc and a small bench. o: { a, day }
//   pace(t, t0, x0, x1, dur)            helper: linear position from x0 to x1 over dur seconds starting at t0 (a steady crossing; wraps)
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
const { P, rgba, mixHex, lin, rad, clamp, lerp } = E;
const { COOL } = K;

// day-lit colours for the machines (cream-white bodies, cool shade; deep-blue shadow)
const BODY = (day) => mixHex(mixHex(P.blue1, COOL.mid, .55), mixHex(COOL.mid, P.cream, .5), .35 + .5 * day);
const SHADE = (day) => mixHex(P.ind1, mixHex(COOL.mid, P.blue1, .55), .6 + .4 * day);
const DEEP = P.night1;
const ell = (ctx, x, y, rx, ry, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), 0, 0, 6.29); ctx.fill(); };
const rr = (ctx, x, y, w, h, r, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); };
function statusDot(ctx, x, y, r, t, ph = 0) {   // the machine's cool dot, breathing
  const b = .8 + .2 * Math.sin(t * 2.3 + ph);
  ctx.fillStyle = rad(ctx, x, y, r * 4, [[0, rgba(COOL.mid, .45 * b)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
  ell(ctx, x, y, r, r, rgba(COOL.core, b));
}
function wheel(ctx, x, y, r, ang) {
  ell(ctx, x, y, r, r, DEEP);
  ctx.strokeStyle = rgba(P.blue2, .9); ctx.lineWidth = r * .22; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * r * .7, y + Math.sin(ang) * r * .7); ctx.stroke();
  ell(ctx, x, y, r * .28, r * .28, P.blue2);
}
function shadow(ctx, x, y, w, a = .45) { ell(ctx, x, y, w, w * .07, rgba(P.night0, a)); }
export const pace = (t, t0, x0, x1, dur) => lerp(x0, x1, ((((t - t0) / dur) % 1) + 1) % 1);

// ---------------------------------------------------------------------------------------------------------------- delivery robot
export function deliveryRobot(ctx, x, y, s, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dir = o.dir ?? 1, day = o.day ?? 1, roll = o.roll ?? t * 40, bob = Math.abs(Math.sin(roll / 9)) * .8;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * dir, s);
  shadow(ctx, 0, 0, 40);
  for (const wx of [-24, 0, 24]) wheel(ctx, wx, -7, 7, roll / 7);
  ctx.translate(0, -bob);
  // the body: a rounded box, light top, shaded side, a darker band
  rr(ctx, -35, -54, 70, 42, 10, SHADE(day));
  rr(ctx, -35, -54, 62, 40, 10, BODY(day));
  ctx.fillStyle = rgba(P.blue1, .35); ctx.fillRect(-35, -24, 70, 5);
  // the lid (hinged at the back) and the front 'eye-less' sensor strip with the status dot
  const lid = clamp(o.lid ?? 0);
  ctx.save(); ctx.translate(-33, -54); ctx.rotate(-lid * 1.1); rr(ctx, 0, -5, 66, 7, 3, mixHex(BODY(day), P.cream, .3)); ctx.restore();
  rr(ctx, 18, -44, 14, 6, 3, rgba(P.night1, .75));
  statusDot(ctx, 25, -41, 2.2, t, x * .01);
  // crates on its back (the market carrier)
  const n = Math.round(o.crates ?? 0);
  for (let i = 0; i < n; i++) { const cy = -58 - i * 22, cx = -4 + (i % 2) * 3; rr(ctx, cx - 26, cy - 20, 52, 20, 3, mixHex(P.shade0, P.blue1, .35)); ctx.fillStyle = rgba(P.night1, .35); ctx.fillRect(cx - 22, cy - 13, 44, 2.5); if (i === n - 1) { for (const [fx, col] of [[-12, P.halo0], [0, P.core1], [12, mixHex(P.halo0, P.shade0, .4)]]) ell(ctx, cx + fx, cy - 22, 6.5, 5.5, col); } }
  if (o.flag !== false && !n) {   // the thin whip with a small pennant (so walkers see it)
    const sw = Math.sin(t * 2.6 + x * .02) * .12;
    ctx.strokeStyle = rgba(P.blue2, .9); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-26, -54); ctx.quadraticCurveTo(-30, -80, -28 - sw * 30, -104); ctx.stroke();
    ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.moveTo(-28 - sw * 30, -104); ctx.lineTo(-44 - sw * 34, -99); ctx.lineTo(-28 - sw * 30, -94); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- drone
export function drone(ctx, x, y, s, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dir = o.dir ?? 1, day = o.day ?? 1, tilt = o.tilt ?? 0, hov = Math.sin(t * 1.9 + x * .003) * 1.6;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + hov * s); ctx.scale(s * dir, s); ctx.rotate(tilt);
  // the parcel (hangs on two lines, swings a little)
  if (o.box !== false) {
    const sw = Math.sin(t * 1.4 + x * .002) * .06 - tilt * .6;
    ctx.save(); ctx.rotate(sw);
    ctx.strokeStyle = rgba(P.night1, .7); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(-8, 4); ctx.lineTo(-10, 34); ctx.moveTo(8, 4); ctx.lineTo(10, 34); ctx.stroke();
    rr(ctx, -16, 34, 32, 24, 3, mixHex(P.shade0, P.halo1, .35)); ctx.fillStyle = rgba(P.night1, .25); ctx.fillRect(-16, 44, 32, 3);
    if (o.med) { ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(0, 46, 6.5, 0, 6.29); ctx.stroke(); }
    ctx.restore();
  }
  // arms + rotors (flat ellipses that flicker: spinning)
  ctx.strokeStyle = SHADE(day); ctx.lineWidth = 3.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-36, -6); ctx.lineTo(36, -6); ctx.stroke();
  for (const rx of [-36, 36]) {
    ctx.fillStyle = SHADE(day); ctx.fillRect(rx - 1.6, -11, 3.2, 6);
    const fl = .55 + .25 * Math.sin(t * 47 + rx);
    ell(ctx, rx, -12, 19, 2.6, rgba(mixHex(COOL.core, P.cream, .3), .45 * fl));
    ell(ctx, rx, -12, 6, 1.6, rgba(P.night1, .55));
  }
  // the body: a flat rounded pod
  rr(ctx, -17, -9, 34, 13, 6, BODY(day)); rr(ctx, -17, -2, 34, 6, 3, SHADE(day));
  statusDot(ctx, 11, 1, 1.8, t, x * .01);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- shuttle
export function shuttle(ctx, x, y, s, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dir = o.dir ?? 1, day = o.day ?? 1, roll = o.roll ?? t * 120, L = 470, Hh = 190;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * dir, s);
  shadow(ctx, 0, 0, 250, .5);
  for (const wx of [-150, 150]) wheel(ctx, wx, -20, 20, roll / 20);
  // the cabin: one rounded capsule, a slightly darker skirt
  const body = new Path2D(); body.roundRect(-L / 2, -Hh, L, Hh - 18, [70, 70, 18, 18]);
  ctx.fillStyle = lin(ctx, 0, -Hh, 0, -18, [[0, BODY(day)], [.75, mixHex(BODY(day), SHADE(day), .35)], [1, SHADE(day)]]); ctx.fill(body);
  ctx.fillStyle = rgba(P.night1, .28); ctx.fillRect(-L / 2 + 10, -46, L - 20, 8);
  // the window band (dark glass, a sky sheen by day) with riders
  const wy = -Hh + 34, wh = 74;
  rr(ctx, -L / 2 + 40, wy, L - 80, wh, 16, mixHex(P.night1, P.ind1, .4));
  ctx.save(); ctx.beginPath(); ctx.roundRect(-L / 2 + 40, wy, L - 80, wh, 16); ctx.clip();
  const n = Math.round(o.riders ?? 2);
  for (let i = 0; i < n; i++) { const px = -120 + i * 85 + (i % 2) * 14; ell(ctx, px, wy + 34, 13, 15, mixHex(P.ind2, P.blue1, .4)); ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.roundRect(px - 22, wy + 50, 44, 40, 14); ctx.fill(); }
  ctx.fillStyle = lin(ctx, -L / 2, wy, L / 2, wy + wh, [[0, rgba(P.cream, .0)], [.45, rgba(P.cream, .12 * day)], [.55, rgba(P.cream, .02)], [1, rgba(P.cream, 0)]]); ctx.fillRect(-L / 2, wy, L, wh);
  ctx.restore();
  // the middle door (slides open to the side)
  const dr = clamp(o.doors ?? 0);
  ctx.fillStyle = rgba(P.night1, .45); ctx.fillRect(-36 + 70 * dr, wy - 4, 3, Hh - 60);
  if (dr > 0) { ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(-36, wy - 4, 70 * dr, Hh - 60 - 4); }
  // a cool light strip at the front (no face) + a small cool dot on the roof
  rr(ctx, L / 2 - 26, -100, 12, 36, 6, rgba(COOL.core, .9));
  ctx.fillStyle = rad(ctx, L / 2 - 20, -82, 60, [[0, rgba(COOL.mid, .35)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(L / 2 - 80, -142, 120, 120);
  statusDot(ctx, 0, -Hh - 6, 4, t);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- stall
export function stall(ctx, x, y, s, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const day = o.day ?? 1, goods = o.goods || 'fruit', gold = o.awn === 'gold', sway = (o.sway ?? 1) * Math.sin(t * .9 + x * .01);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  shadow(ctx, 0, 0, 130, .4);
  const post = mixHex(P.night1, P.ind1, .5);
  ctx.fillStyle = post; ctx.fillRect(-114, -228, 7, 228); ctx.fillRect(107, -228, 7, 228);
  // the table + its cloth
  ctx.fillStyle = gold ? mixHex(P.shade0, P.blue1, .35) : mixHex(P.ind1, P.blue1, .35 + .3 * day); ctx.fillRect(-120, -86, 240, 12);
  ctx.fillStyle = gold ? mixHex(mixHex(P.shade0, P.ind1, .55), P.halo1, .1 * day) : mixHex(P.ind2, P.blue1, .2 + .2 * day); ctx.fillRect(-116, -74, 232, 62);
  ctx.fillStyle = rgba(P.night0, .3); ctx.fillRect(-116, -20, 232, 8);
  // goods on the table
  const rnd = E.prng(Math.round(Math.abs(x) * 7) + 3);
  if (goods === 'fruit' || goods === 'flowers') {
    for (let i = 0; i < 16; i++) { const gx = -100 + (i % 8) * 28 + rnd() * 6, gy = -94 - Math.floor(i / 8) * 12 - rnd() * 3, r = 8 + rnd() * 3;
      ell(ctx, gx, gy, r, r * .9, goods === 'flowers' ? (i % 3 ? mixHex(P.blue2, P.cream, .4) : P.halo0) : (i % 4 === 0 ? P.halo0 : i % 3 ? mixHex(P.blue1, COOL.mid, .25) : mixHex(P.shade0, P.halo1, .4))); }
  } else if (goods === 'bread') {
    for (let i = 0; i < 6; i++) { ctx.fillStyle = mixHex(P.shade0, P.halo1, .45 + .1 * (i % 2)); ctx.beginPath(); ctx.ellipse(-90 + i * 36, -96, 17, 10, -.1, Math.PI, 0); ctx.fill(); }
  } else {
    for (let i = 0; i < 4; i++) { rr(ctx, -104 + i * 54, -110, 48, 24, 3, mixHex(P.shade0, P.blue1, .35)); }
  }
  // the awning: a slanted striped roof with a scalloped edge that sways a little
  ctx.save(); ctx.translate(0, -228); ctx.rotate(.015 * sway);
  const c1 = gold ? P.halo0 : mixHex(P.blue1, P.cream, .25 + .35 * day), c2 = gold ? mixHex(P.cream, P.halo1, .3) : mixHex(P.ind1, P.blue1, .45);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? c2 : c1; ctx.beginPath(); ctx.moveTo(-130 + i * 32.5, -36); ctx.lineTo(-130 + (i + 1) * 32.5, -36); ctx.lineTo(-136 + (i + 1) * 34, 6); ctx.lineTo(-136 + i * 34, 6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(-136 + i * 34 + 17, 6, 17, 0, Math.PI); ctx.fill();
  }
  ctx.fillStyle = rgba(P.night0, .25); ctx.fillRect(-136, 4, 272, 3);
  ctx.restore();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- passer-by
export function passerby(ctx, x, y, h, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const dir = o.dir ?? 1, walking = !o.stand, ph = o.walk ?? t * 4.4 + (o.seed ?? 0) * 1.3;
  ctx.save(); ctx.globalAlpha *= a;
  const by = walking ? -h * .012 * Math.abs(Math.cos(ph)) : 0;
  const hands = K.other(ctx, x, y + by, h, t, { pose: walking ? 'walk' : 'stand', walk: walking ? ph : undefined, dir, seed: o.seed ?? 5, light: o.light ?? 1, look: o.look, lean: o.lean ?? (walking ? .04 : 0) });
  if (o.bag && hands) { const hp = dir > 0 ? hands.L : hands.R; if (hp) { ctx.fillStyle = mixHex(P.shade0, P.halo1, .35); ctx.beginPath(); ctx.roundRect(hp[0] - h * .045, hp[1], h * .09, h * .1, h * .015); ctx.fill(); } }
  ctx.restore();
  return hands;
}

// ---------------------------------------------------------------------------------------------------------------- shuttle stop
export function shuttleStop(ctx, x, y, s, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const day = o.day ?? 1;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  shadow(ctx, 30, 0, 70, .35);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(-4, -250, 8, 250);
  ell(ctx, 0, -262, 22, 22, BODY(day)); ell(ctx, 0, -262, 15, 15, SHADE(day)); statusDot(ctx, 0, -262, 5, t);
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .4); ctx.fillRect(20, -46, 90, 9); ctx.fillRect(26, -37, 6, 37); ctx.fillRect(98, -37, 6, 37);
  ctx.restore();
}
