// C06 (Film 4 v2) · the city flat (owner c06): 6.15–6.19. A tired person in work clothes (the bag by the door, the shoes still on) drops
// onto the sofa, reaches for the remote: on "remote" the TV's cold light floods the room, the wall clock reaches nine; the bottle pours
// the third glass (the same image as in your room, 6.06); the laptop on the table still glows with work; the head sinks back. On the wall
// above the sofa the guilloche "?" (1.09) engraves itself, unwinds on "guess" into one straight engraved line, the camera pushes onto it:
// from HO.a − .07 the frame IS the line plate c06>c07 (drawn by HO.plate itself; before that the same ground, hatch and line are drawn
// here in "plate space" mapped onto the back wall, so the last frames of the push converge onto the plate exactly).
// Local cm, y DOWN, the camera looks along +Z (pinhole, v2_c06_kit pr / plane / poly3). The window we fly in through: the opening
// X −60..60, Y −80..80 in the front wall (inner face Z 0, outer face Z −30). Floor Y 150, ceiling −140, side walls X −300 / 200,
// back wall Z 520. Nothing fades in: the TV and the laptop are lights; the "?" is engraved by a burin; the bottle is carried in.
// Copied code: QM / qmLines (the "?" centre line and its 9 guilloche strands) and the dot's rosette call from lib/sc01_m1_world.mjs (1.09);
// the line plate's ground, hatch and line from lib/handoff4.mjs (linePlate), replicated in plate space.
import { W, H, rgba, clamp, mix, sm, prng } from '../engine.mjs';
import { TAU, mono, mixC, mixH, shadeH, s5, eoX, pr, plane, poly3, seg3, wineGlass, bottle, wineStream, wallClock, flick, SCREEN, SCREEN_HOT, AMBER, OCHRE } from './v2_c06_kit.mjs';
import { figure, reachArm, handPos, life } from './figure.mjs';
import { ghostLine } from './ghost.mjs';
import { rosette, resample, unwind } from './certificate.mjs';

export const FLATWIN = { hw: 60, hh: 80 };
export const FLAT = { FL: 150, CE: -140, XL: -300, XR: 200, ZB: 520, FZ: -30 };
const { FL, CE, XL, XR, ZB } = FLAT;
const ZP = 400, U = .94;                       // the person's plane; cm per figure unit
const SOFA = { z0: 300, z1: 505, aw: 22 };
const TABLE = { x0: -64, x1: 56, z0: 345, z1: 445, top: FL - 42.4, th: 3.6 };
const TVB = { x0: 162, x1: 200, z0: 330, z1: 470, top: FL - 50 };
const TV = { x: 176, z0: 345, z1: 455, y0: FL - 122, y1: FL - 58 };
const CLOCK = { x: -40, y: -44, r: 15 };
const DOOR = { x0: 62, x1: 150, top: -64 };
const LAMP = { x: -274, z: 492, y: -10 };
const GLASS = { x: -27, z: ZP }, RING = [[-41, 397, .9], [-14, 407, 1.1]], BOT0 = { x: -44, z: 412 }, REM0 = { x: -57, z: ZP };
const LAPTOP = { x: 22, z: 420, ang: -.5 };
// the "?" and the line: the plate's line centre (960, 590) sits on the wall at Q; the camera's end pose CEND sees the wall exactly as the plate
const Q = { x: -165, y: -45 };
export const KE = 18.75; const DE = ZB - 440;
export const CEND = { x: Q.x, y: Q.y - 50 / KE, z: ZB - DE, F: 1500, ox: 0, oy: 0 };
const QS = 2.25, QX = W / 2, QY = 590 + 80 * QS;   // "?" units → plate px; its origin in plate px (the visual centre on the line centre)

// ---------------------------------------------------------------- light (a tiny shading model: ambient night + lamp + TV + laptop)
const LAMPP = [LAMP.x, LAMP.y - 6, LAMP.z], TVP = [TV.x - 2, (TV.y0 + TV.y1) / 2, (TV.z0 + TV.z1) / 2], LAPP = [LAPTOP.x, TABLE.top - 14, LAPTOP.z];
const AMB = [.16, .18, .3], LAMPC = [1, .66, .34], TVC = [.5, .88, 1], LAPC = [.78, .9, 1];
const h3 = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
function shade(alb, P, n, L) {
  let r = AMB[0], g = AMB[1], b = AMB[2];
  const add = (S, C, I, R, tv) => {
    if (!(I > 0)) return; const dx = S[0] - P[0], dy = S[1] - P[1], dz = S[2] - P[2], d = Math.hypot(dx, dy, dz) || 1, nd = (n[0] * dx + n[1] * dy + n[2] * dz) / d; if (nd <= 0) return;
    const e = tv ? Math.max(0, dx / d) * .85 + .15 : 1, f = I * nd * e / (1 + (d / R) * (d / R)); r += C[0] * f; g += C[1] * f; b += C[2] * f;
  };
  add(LAMPP, LAMPC, L.lamp, 150); add(TVP, TVC, L.tv, 210, true); add(LAPP, LAPC, L.lap, 55);
  return `rgb(${Math.round(255 * Math.min(1, alb[0] * r))},${Math.round(255 * Math.min(1, alb[1] * g))},${Math.round(255 * Math.min(1, alb[2] * b))})`;
}
// a 2-D profile (X–Y, cm) extruded along Z (z0 < z1): the side faces turned to the camera (each shaded, with a gradient along its depth),
// then the visible cap. o: { cap (draw the cap, default true), detail(ctx, k, z) on the cap in cm, ink (outline alpha) }
function extrude(ctx, c, prof, z0, z1, alb, L, o = {}) {
  const n = prof.length; let A2 = 0; for (let i = 0; i < n; i++) { const p = prof[i], q = prof[(i + 1) % n]; A2 += p[0] * q[1] - q[0] * p[1]; }
  const sg = A2 > 0 ? 1 : -1, zm = (z0 + z1) / 2, zn = c.z + 3;
  if (z1 <= zn) return;
  const za = Math.max(z0, zn);
  for (let i = 0; i < n; i++) {
    const p = prof[i], q = prof[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1], m = Math.hypot(dx, dy); if (m < 1e-6) continue;
    const nx = sg * dy / m, ny = -sg * dx / m; if (nx * (c.x - p[0]) + ny * (c.y - p[1]) <= 0) continue;
    if (!poly3(ctx, c, [[p[0], p[1], za], [q[0], q[1], za], [q[0], q[1], z1], [p[0], p[1], z1]])) continue;
    const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, a = pr(c, mx, my, za), b = pr(c, mx, my, z1);
    const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, shade(alb, [mx, my, za], [nx, ny, 0], L)); g.addColorStop(1, shade(alb, [mx, my, z1], [nx, ny, 0], L));
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = .8; ctx.stroke();
  }
  if (o.cap === false) return;
  const capZ = c.z < z0 ? z0 : c.z > z1 ? z1 : null; if (capZ == null || capZ <= zn) return;
  if (!poly3(ctx, c, prof.map(([x, y]) => [x, y, capZ]))) return;
  const cx = prof.reduce((s, p) => s + p[0], 0) / n, cy = prof.reduce((s, p) => s + p[1], 0) / n;
  ctx.fillStyle = shade(alb, [cx, cy, capZ], [0, 0, capZ === z0 ? -1 : 1], L); ctx.fill();
  if (o.ink) { ctx.strokeStyle = `rgba(4,5,14,${o.ink})`; ctx.lineWidth = 1; ctx.stroke(); }
  if (o.detail) { ctx.save(); poly3(ctx, c, prof.map(([x, y]) => [x, y, capZ])); ctx.clip(); const k = plane(ctx, c, capZ); o.detail(ctx, k, capZ); ctx.restore(); }
}
// an ellipse of light (or shade) lying on a horizontal plane at height Y (a pool on the floor or the table, a patch on the ceiling)
function pool(ctx, c, X, Y, Z, rx, rz, col, a, op = 'lighter') {
  if (Z - rz <= c.z + 4 || a <= .002) return; const [sx, sy, k] = pr(c, X, Y, Z), sq = Math.abs(Y - c.y) / (Z - c.z);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = op; ctx.translate(sx, sy); ctx.scale(1, Math.max(.02, sq) * rz / rx);
  const R = rx * k, g = ctx.createRadialGradient(0, 0, 0, 0, 0, R); g.addColorStop(0, rgba(col, a)); g.addColorStop(.55, rgba(col, a * .4)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.restore();
}
// a glow in a vertical plane (wall), elliptical
function wallGlow(ctx, c, Z, X, Y, rx, ry, col, a, op = 'lighter') {
  if (Z <= c.z + 4 || a <= .002) return; const k = plane(ctx, c, Z); ctx.save(); ctx.globalCompositeOperation = op; ctx.translate(X, Y); ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba(col, a)); g.addColorStop(.5, rgba(col, a * .35)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
}

// ---------------------------------------------------------------- the "?" (copied from lib/sc01_m1_world.mjs, shot 1.09)
const QM = (() => { const out = []; for (let i = 0; i <= 120; i++) { const q = i / 120, a = mix(Math.PI * 1.08, Math.PI * 2.5, q), r = 118; out.push([Math.cos(a) * r, -200 + Math.sin(a) * r * 1.02]); } const e = out[out.length - 1]; for (let i = 1; i <= 40; i++) { const q = i / 40; out.push([mix(e[0], 0, sm(q)), mix(e[1], 50, q)]); } return out; })();
let QML = null;
function qmLines() {
  if (QML) return QML; const L = [], d = [0]; for (let i = 1; i < QM.length; i++) d.push(d[i - 1] + Math.hypot(QM[i][0] - QM[i - 1][0], QM[i][1] - QM[i - 1][1]));
  for (let k = 0; k < 9; k++) { const pts = []; for (let i = 0; i < QM.length; i++) { const a = QM[Math.max(0, i - 1)], b = QM[Math.min(QM.length - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1, nx = -ty / m, ny = tx / m, off = (k - 4) * 4.2 + 9 * Math.sin(d[i] * .045 + k * .7) * Math.sin(Math.min(1, d[i] / 60) * Math.PI / 2); pts.push([QM[i][0] + nx * off, QM[i][1] + ny * off]); } L.push(pts); }
  return (QML = L);
}
const PL = { c0: '#e9dcc0', c1: '#fffaf0', ang: -.32, y: 590, L: 1400 };
// plate space → screen for camera c: the wall seen by c, scaled so that at c = CEND it is the identity
function plateXf(ctx, c) { const k = plane(ctx, c, ZB); ctx.translate(CEND.x - (W / 2) / KE, CEND.y - (H / 2) / KE); ctx.scale(1 / KE, 1 / KE); return k / KE; }

// ---------------------------------------------------------------- the person (a profile figure facing +X, seated in the plane Z = ZP)
const SEED = 5, DRESS = { coat: '#b9c5d9', pants: '#1c2031', shoes: '#0c0b12', skin: '#c99874', hair: '#21160f' };
const FOOT = [[-79, FL - 4.3], [-87, FL - 4.3]];   // ankles (cm), planted
function legIK(dx, dy) { const L1 = 45, L2 = 43, d = clamp(Math.hypot(dx, dy), 3, L1 + L2 - .05), base = Math.atan2(dx, dy), al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), be = Math.acos(clamp((L2 * L2 + d * d - L1 * L1) / (2 * L2 * d), -1, 1)); return [base + al, al + be]; }

// ---------------------------------------------------------------- the take inside
export function makeFlat(A, HO) {
  // time anchors (all on VO words)
  const T = {
    drop: A.tired - .2, contact: A.tired + .32, reach0: A.reach - .06, grab: A.reach + .38, point: A.remote - .12, sink: A.nine - .2,
    b0: A.why3 + .06, bg: A.why3 + .34, pour0: A.third + .12, pour1: A.glassE - .18, bset: A.glassE + .52, back: A.maybe1 + .3,
    ex0: A.exhausted - .5, ex1: A.exhaustedE - .1, q0: A.thats + .05, q1: A.didnt - .1, dot: A.didnt - .02, uw0: A.guess - .06, uw1: A.HOa - .14, plate: A.HOa - .07,
  };
  // ---- the TV and the laptop (lights)
  const tvOn = (t) => s5((t - A.remote) / .16);
  const tvL = (t) => { const u = tvOn(t); if (u <= 0) return 0; const f = flick(t, .5, 0); return u * (.72 + .28 * f) + .9 * Math.exp(-Math.max(0, t - A.remote) / .22) * u; };
  const lapL = (t) => .55 + .45 * s5((t - (A.lazy - .05)) / .25);
  const lights = (t) => ({ lamp: 1.45, tv: 1.9 * tvL(t), lap: .35 * lapL(t) });
  // ---- the person's keys (hip in cm, angles in rad)
  const KHX = mono([[0, -84], [T.drop, -84], [T.drop + .15, -89], [T.drop + .32, -106], [T.contact - .06, -126], [T.contact, -131.5], [T.contact + .1, -133], [T.contact + .22, -133.4], [T.contact + .45, -134],
    [T.reach0, -133.5], [T.grab, -128], [T.point + .1, -129.5], [T.sink + .5, -133.5], [T.b0, -133.5], [T.bg, -130.5], [T.pour0, -129.5], [T.pour1, -129.5], [T.bset, -130], [T.back + .4, -134], [A.maybe2, -134.5], [T.ex0, -134.5], [T.ex1, -119], [999, -118.5]]);
  const KHY = mono([[0, 63.5], [T.drop, 63.5], [T.drop + .15, 68], [T.drop + .32, 82], [T.contact - .06, 97.5], [T.contact, 102.5], [T.contact + .08, 105.2], [T.contact + .2, 102.6], [T.contact + .4, 103.4],
    [T.reach0, 103.3], [T.grab, 102.6], [T.point + .1, 103], [T.sink + .5, 103.6], [T.bg, 103.2], [T.bset, 103.2], [T.back + .4, 103.8], [A.maybe2, 104.2], [T.ex0, 104.2], [T.ex1, 106.4], [999, 106.6]]);
  const KLEAN = mono([[0, .07], [T.drop, .07], [T.drop + .18, .3], [T.drop + .36, .34], [T.contact - .04, .12], [T.contact + .1, -.3], [T.contact + .2, -.22], [T.contact + .36, -.29], [T.reach0, -.24],
    [T.grab - .06, .76], [T.grab + .08, .7], [T.point, .1], [T.point + .25, .02], [T.sink + .6, -.3], [T.b0, -.3], [T.bg, .52], [T.pour0, .42], [T.pour1, .42], [T.bset - .1, .56], [T.bset + .08, .5], [T.back + .4, -.31],
    [A.maybe2, -.33], [T.ex0, -.34], [T.ex1, -.63], [999, -.64]]);
  const KHEAD = mono([[0, .26], [T.drop, .26], [T.drop + .25, .12], [T.contact, .06], [T.contact + .07, .24], [T.contact + .16, -.12], [T.contact + .34, .1], [T.reach0, .1], [T.grab - .1, .34], [T.point, .04],
    [T.point + .3, -.04], [T.sink + .6, .08], [T.b0, .08], [T.bg, .3], [T.pour0, .36], [T.pour1, .34], [T.bset, .3], [T.back + .4, .1], [A.maybe2, .12], [T.ex0, .12], [T.ex1, -.3], [999, -.31]]);
  const KEYE = mono([[0, 0], [T.ex0 + .3, 0], [T.ex1 - .2, 1], [999, 1]]);
  // ---- the props: remote (in the front hand from the grab), bottle (in the back hand from bg to bset)
  const remoteIn = (t) => t >= T.grab;
  // the bottle: mouth position (cm, in the person's plane) and its angle; the hand follows it (grip 20 cm from the mouth)
  const BS = 30.3, BSC = .68;   // the bottle's length (cm) at the scale used (the kit's bottle is 44.6 long)
  const bTop = (x, z) => [x, TABLE.top - BS];
  const pourM = [GLASS.x + 2.2, TABLE.top - 21 - 3.2];
  const KBX = mono([[0, BOT0.x], [T.bg, BOT0.x], [T.bg + .22, -38], [T.pour0 - .12, pourM[0] - 2], [T.pour0, pourM[0]], [T.pour1, pourM[0]], [T.pour1 + .2, -33], [T.bset - .08, -49.5], [T.bset, -49.5], [999, -49.5]]);
  const KBY = mono([[0, TABLE.top - BS], [T.bg, TABLE.top - BS], [T.bg + .22, TABLE.top - BS - 18], [T.pour0 - .12, pourM[1] - 6], [T.pour0, pourM[1]], [T.pour1, pourM[1] - .5], [T.pour1 + .2, TABLE.top - BS - 20], [T.bset - .08, TABLE.top - BS - 1], [T.bset, TABLE.top - BS], [999, TABLE.top - BS]]);
  const KBA = mono([[0, -Math.PI / 2], [T.bg + .05, -Math.PI / 2], [T.pour0 - .1, .78], [T.pour0 + .1, 1.02], [T.pour1, 1.12], [T.pour1 + .22, -1.2], [T.bset - .1, -Math.PI / 2], [999, -Math.PI / 2]]);
  const KBZ = mono([[0, BOT0.z], [T.bg, BOT0.z], [T.bg + .3, ZP], [T.bset - .1, ZP], [T.bset, ZP + 4], [999, ZP + 4]]);
  const bottleAt = (t) => { const ang = KBA(t), mx = KBX(t), my = KBY(t); return { mx, my, z: KBZ(t), ang, grip: [mx - Math.cos(ang) * 20 * (ang > -1.4 ? 1 : 1), my - Math.sin(ang) * 20] }; };
  const glassLv = (t) => mix(.04, .56, s5((t - (T.pour0 + .1)) / (T.pour1 - T.pour0)));
  // ---- the remote in the hand: its angle relative to the forearm; pointing (on "remote") it tilts up toward the TV
  // the person's pose at t (and the screen-space arm targets), for a camera c
  function personPose(t, c) {
    const hx = KHX(t), hy = KHY(t), [sx, sy, k] = pr(c, hx, hy, ZP), s = U * k;
    const o = { t, seed: SEED };
    const Lf = life(t, SEED), wx = Lf.w, bb = Lf.b;
    const pose = { lean: KLEAN(t), head: KHEAD(t), thigh: 1, hip: [0, 0], kn: [0, 0], sh: [.1, .05], el: [.2, .2], lock: [true, true], hands: ['relaxed', 'relaxed'] };
    const ey = KEYE(t); if (ey > .01) pose.eye = ey;
    // legs: IK to the planted feet (compensating the figure's own weight shift and breath)
    for (const i of [0, 1]) { const sxh = i ? -4 : 4, dx = (FOOT[i][0] - hx) / U - sxh - wx, dy = (FOOT[i][1] - hy) / U + bb * .35; const [a, kk] = legIK(dx, dy); pose.hip[i] = a; pose.kn[i] = kk; }
    // the screen point of a cm position in the person's plane
    const P = (X, Y) => { const q = pr(c, X, Y, ZP); return [q[0], q[1]]; };
    // resting targets: the hands on the thighs (front hand nearer the knee)
    const knee = (i) => { const sxh = i ? -4 : 4, a = pose.hip[i]; return [hx + (sxh + wx + Math.sin(a) * 45 * .62) * U, hy + (Math.cos(a) * 45 * .62 - 9.5) * U]; };
    const rest0 = P(...knee(0)), rest1 = P(...knee(1));
    // hanging arms (standing): from the pose itself
    const hang = (i) => handPos(sx, sy, s, { ...pose, sh: [-pose.lean + .1, -pose.lean + .06], el: [.22, .26] }, i, false, o);
    const stand = 1 - s5((t - (T.drop + .1)) / .45);
    let tg0 = [mix(rest0[0], hang(0)[0], stand), mix(rest0[1], hang(0)[1], stand)], tg1 = [mix(rest1[0], hang(1)[0], stand), mix(rest1[1], hang(1)[1], stand)];
    // the drop: the arms come forward a little for balance
    const bal = Math.sin(Math.PI * clamp((t - T.drop) / (T.contact + .15 - T.drop))); if (bal > 0) { tg0 = [tg0[0] + 14 * k * bal, tg0[1] - 10 * k * bal]; tg1 = [tg1[0] + 10 * k * bal, tg1[1] - 6 * k * bal]; }
    // the reach for the remote, the grab, the pointing at the TV, back to the thigh
    const r0 = P(REM0.x, TABLE.top - 2.2), pt = P(hx + 52, hy - 46);
    const uReach = s5((t - T.reach0) / (T.grab - T.reach0)), uLift = s5((t - T.grab - .06) / (T.point - T.grab - .06)), uDown = s5((t - (T.sink + .05)) / .75);
    if (uReach > 0) { let p = [mix(tg0[0], r0[0], uReach), mix(tg0[1], r0[1], uReach)]; if (uLift > 0) p = [mix(r0[0], pt[0], uLift), mix(r0[1], pt[1], uLift)]; if (uDown > 0) p = [mix(pt[0], rest0[0], uDown), mix(pt[1], rest0[1], uDown)]; tg0 = p; }
    if (t > T.grab - .05) pose.hands[0] = 'fist';
    // the bottle in the back hand
    const B = bottleAt(t), uB = s5((t - T.b0) / (T.bg - T.b0)) * (1 - s5((t - T.bset) / .45));
    if (uB > 0) { const g = P(B.grip[0], B.grip[1]); tg1 = [mix(tg1[0], g[0], uB), mix(tg1[1], g[1], uB)]; if (t > T.bg - .05 && t < T.bset + .05) pose.hands[1] = 'fist'; }
    // 6.18: the hands slide off the thighs, heavy
    const ex = s5((t - T.ex0) / (T.ex1 - T.ex0)); if (ex > 0) { tg0 = [tg0[0] - 6 * k * ex, tg0[1] + 5 * k * ex]; tg1 = [tg1[0] - 8 * k * ex, tg1[1] + 4 * k * ex]; }
    for (const [i, tg] of [[0, tg0], [1, tg1]]) { const r = reachArm(sx, sy, s, pose, i, false, o, tg); pose.sh[i] = r.sh; pose.el[i] = r.el; }
    return { sx, sy, s, k, pose, o, hx, hy };
  }
  // ---- draw the person (and the props in the hands)
  function drawPerson(ctx, t, c, L) {
    const pp = personPose(t, c); if (pp.s < .05) return pp;
    // cull: the figure's box
    const bx0 = pp.sx - 120 * pp.s, bx1 = pp.sx + 150 * pp.s, by0 = pp.sy - 130 * pp.s, by1 = pp.sy + 100 * pp.s; if (bx1 < 0 || bx0 > W || by1 < 0 || by0 > H) return pp;
    if (pp.s > 9) return pp;   // never a portrait: the camera never gets this close while the person is in frame
    const tvp = pr(c, TVP[0], TVP[1], TVP[2]), lp = pr(c, LAMPP[0], LAMPP[1], LAMPP[2]), tl = clamp(L.tv / 1.9);
    const lightPt = { x: mix(lp[0], tvp[0], s5(tl * 1.4)), y: mix(lp[1], tvp[1], s5(tl * 1.4)), col: mixC('#ffc98a', SCREEN_HOT, s5(tl * 1.4)), a: mix(.32, .62, tl) };
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    figure(ctx, pp.sx, pp.sy, pp.s, pp.pose, { ...pp.o, dress: DRESS, light: lightPt, rim: rgba('#ffb35c', .85), rimSide: -1, rimW: Math.max(1.2, pp.s * .45) });
    // the remote in the front hand (drawn over the fist, along the forearm; its red LED lights when the TV answers)
    if (remoteIn(t)) {
      const hp = handPos(pp.sx, pp.sy, pp.s, pp.pose, 0, false, pp.o), ang = pp.pose.sh[0] + pp.pose.el[0], lean = pp.pose.lean;
      const rot = lean + Math.PI / 2 - ang - .25, dx = Math.sin(ang + lean), dy = Math.cos(ang + lean);
      ctx.translate(hp[0] - dx * .6 * pp.s, hp[1] - dy * .6 * pp.s); ctx.rotate(rot); ctx.scale(pp.s, pp.s);
      ctx.fillStyle = '#15171f'; ctx.beginPath(); ctx.roundRect(-5, -2.3, 19, 4.6, 2); ctx.fill(); ctx.fillStyle = 'rgba(160,170,190,.25)'; ctx.fillRect(-3, -2.2, 16, .8);
      ctx.fillStyle = tvOn(t) > .5 ? '#ff4a3a' : '#7a2a24'; ctx.beginPath(); ctx.arc(12, -.6, .7, 0, TAU); ctx.fill();
      if (tl > .02) { ctx.strokeStyle = rgba(SCREEN, .5 * tl); ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(-4, -2.3); ctx.lineTo(13, -2.3); ctx.stroke(); }
    }
    ctx.restore();
    return pp;
  }

  // ---------------------------------------------------------------- the room
  function drawRoom(ctx, t, c, o = {}) {
    const L = lights(t), tl = clamp(L.tv / 1.9);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ---- the back wall: the plate's ground (in plate space), then what hangs on it
    if (poly3(ctx, c, [[XL, CE, ZB], [XR, CE, ZB], [XR, FL, ZB], [XL, FL, ZB]])) {
      ctx.fillStyle = '#0a0c22'; ctx.fill();
      ctx.save(); poly3(ctx, c, [[XL, CE, ZB], [XR, CE, ZB], [XR, FL, ZB], [XL, FL, ZB]]); ctx.clip();
      plateGround(ctx, t, c);
      // light on the wall: the lamp (a tall soft patch beside its shade), the TV's cold spill on the right, the laptop's faint glow
      wallGlow(ctx, c, ZB, LAMP.x + 4, LAMP.y + 6, 52, 120, '#ffb35c', .2);
      wallGlow(ctx, c, ZB, LAMP.x + 4, LAMP.y - 50, 34, 50, '#ffcf8a', .12);
      if (tl > .01) { wallGlow(ctx, c, ZB, 150, 40, 170, 120, SCREEN, .2 * tl); wallGlow(ctx, c, ZB, 60, 80, 120, 80, SCREEN, .08 * tl); }
      plane(ctx, c, ZB - .5); door(ctx, t, L); clock(ctx, t, c, L);
      ctx.restore();
    }
    // ---- ceiling, side walls, floor
    if (poly3(ctx, c, [[XL, CE, 0], [XR, CE, 0], [XR, CE, ZB], [XL, CE, ZB]])) { ctx.fillStyle = '#0c0e25'; ctx.fill(); ctx.save(); ctx.clip(); pool(ctx, c, LAMP.x, CE, LAMP.z - 30, 120, 90, '#ffb35c', .2); if (tl > .01) pool(ctx, c, 120, CE, 400, 220, 160, SCREEN, .07 * tl); ctx.restore(); }
    if (poly3(ctx, c, [[XL, CE, 0], [XL, CE, ZB], [XL, FL, ZB], [XL, FL, 0]])) { ctx.fillStyle = '#0d1029'; ctx.fill(); ctx.save(); ctx.clip(); const k = 1; wallX(ctx, c, XL, L, t); ctx.restore(); }
    if (poly3(ctx, c, [[XR, CE, ZB], [XR, CE, 0], [XR, FL, 0], [XR, FL, ZB]])) { ctx.fillStyle = '#0d1029'; ctx.fill(); ctx.save(); ctx.clip(); wallX(ctx, c, XR, L, t); ctx.restore(); }
    if (poly3(ctx, c, [[XL, FL, 0], [XR, FL, 0], [XR, FL, ZB], [XL, FL, ZB]])) { ctx.fillStyle = '#141119'; ctx.fill(); ctx.save(); ctx.clip(); floor(ctx, c, t, L); ctx.restore(); }
    // ---- objects, far to near
    lamp(ctx, c, t, L); bag(ctx, c, t, L);
    sofaFar(ctx, c, t, L);
    tvSet(ctx, c, t, L);
    table(ctx, c, t, L, 'top');
    const pp = drawPerson(ctx, t, c, L);
    cushionNear(ctx, c, t, L);
    table(ctx, c, t, L, 'near');
    heldProps(ctx, c, t, L);
    sofaNear(ctx, c, t, L);
    // dust in the TV's beam (when on): slow motes between the screen and the sofa
    if (tl > .05) motes(ctx, c, t, tl);
    ctx.restore();
    // the "?" and its line, on the wall (drawn over the room only where the wall is visible: everything in front of it stays in front?
    // the "?" lives in the wall plane above the sofa's backrest, where nothing stands in front of it except during the push)
    return pp;
  }

  // ---- the plate's ground on the back wall (in plate space: at CEND this is linePlate's ground exactly), the "?" and the line
  function plateGround(ctx, t, c) {
    ctx.save(); const a = plateXf(ctx, c);
    const gq = s5((t - (A.thats - .1)) / (A.guess - A.thats + .1));
    if (gq > .002) { const v = ctx.createRadialGradient(W / 2, PL.y, 0, W / 2, PL.y, W * .7); v.addColorStop(0, `rgba(40,36,90,${.55 * gq})`); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(-W * 3, -H * 4, W * 7, H * 9); }
    // the hatch: the plate's lines, continued over the whole wall (extended range and length, same slope and drift)
    ctx.strokeStyle = 'rgba(160,150,220,.05)'; ctx.lineWidth = 1 / Math.max(a, .2) * Math.min(1, a * 5); ctx.beginPath();
    const y0 = -H * 4, y1 = H * 5, kk0 = Math.floor((-W * 3 - 520 * 5) / 34), kk1 = Math.ceil((W * 4 + 520 * 4) / 34);
    for (let kk = kk0; kk < kk1; kk++) { const x = kk * 34 + (t * 6) % 34; ctx.moveTo(x - 520 * (y0 / H), y0); ctx.lineTo(x - 520 * (y1 / H), y1); }
    ctx.stroke(); ctx.restore();
  }
  function qmark(ctx, t, c) {
    const qu = clamp((t - T.q0) / (T.q1 - T.q0)), uw = clamp((t - T.uw0) / (T.uw1 - T.uw0));
    if (qu <= 0) return;
    ctx.save(); ctx.beginPath(); poly3(ctx, c, [[XL, CE, ZB], [XR, CE, ZB], [XR, FL, ZB], [XL, FL, ZB]]); ctx.clip();
    const a = plateXf(ctx, c), px = 1 / Math.max(a, 1e-3);   // one screen px in plate px
    const Ls = qmLines(), wq = Math.max(2.1, 1.25 * px / QS), conv = s5(uw), br = .9 + .1 * Math.sin(t * 2.1), ly = PL.y + 2 * Math.sin(t * .9);
    if (uw <= 0) {
      ctx.save(); ctx.translate(QX, QY); ctx.scale(QS, QS);
      Ls.forEach((pts, k) => ghostLine(ctx, pts, { ghost: 0, burin: k === 4 ? clamp(qu * 1.06 - .03) : null, u: clamp(qu * 1.08 - k * .01), col: PL.c0, w: wq, a: .95, t, seed: k + 1, glow: k % 3 === 0 ? '#ffb35c' : null, tipSize: 15 * px / QS, op: 'lighter' }));
      ctx.restore();
    } else {
      // the unwinding: every strand morphs into the straight line (sweeping from the hook to the stem), the strands close up into one
      const ca = Math.cos(PL.ang), sa = Math.sin(PL.ang), ue = s5(uw);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const paths = Ls.map((pts, k) => {
        const from = pts.map(([x, y]) => [QX + x * QS, QY + y * QS]), off = (k - 4) * 4.2 * QS * (1 - conv);
        const to = []; for (let i = 0; i <= 60; i++) { const s = mix(PL.L, -PL.L, i / 60); to.push([W / 2 + s * ca - off * sa, ly + s * sa + off * ca]); }
        return unwind(from, to, ue, { n: 360, sweep: .55 });
      });
      const strokeP = (P, w, col, al) => { if (al <= .003) return; ctx.strokeStyle = rgba(col, al); ctx.lineWidth = w; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
      const wl = mix(wq * QS, 1.4, conv), fadeS = 1 - s5((uw - .5) / .45);
      paths.forEach((P, k) => { if (k === 4) return; if (k % 3 === 0) { strokeP(P, wl * 5, '#ffb35c', .14 * .95 * fadeS); strokeP(P, wl * 2.2, '#ffb35c', .3 * .95 * fadeS); } strokeP(P, wl, PL.c0, .95 * fadeS); });
      // the centre strand becomes the plate's line: its glow layers grow as it straightens
      const pg = s5((uw - .3) / .7), P4 = paths[4];
      strokeP(P4, 26, PL.c0, .05 * pg); strokeP(P4, 10, PL.c0, .14 * pg); strokeP(P4, mix(wl * 2.2, 3.2, pg), PL.c0, mix(.3, .55 * br, pg)); strokeP(P4, mix(wl, 1.4, pg), PL.c1, .95);
      if (pg > .6) { ctx.save(); ctx.translate(W / 2, ly); ctx.rotate(PL.ang); ctx.strokeStyle = rgba(PL.c1, .35); ctx.lineWidth = 1; ctx.beginPath(); const hk = s5((pg - .6) / .4); for (let x = -PL.L; x < PL.L; x += 9) { const h = (2 + 1.5 * Math.sin(x * .07 + t)) * hk; ctx.moveTo(x, -h); ctx.lineTo(x + 3 * hk, h); } ctx.stroke(); ctx.restore(); }
      ctx.restore();
    }
    // the dot: an engraved rosette that lands (on "didn't"), then draws into the line's centre as the line forms
    const du = clamp((t - T.dot) / .32);
    if (du > 0) {
      const e = eoX(du), tight = s5((uw - .05) / .5);
      if (tight < 1) {
        const dp = [QX, QY + 150 * QS], dl = [W / 2, ly], pos = [mix(dp[0], dl[0], s5(uw * 1.6)), mix(dp[1], dl[1], s5(uw * 1.6))];
        ctx.save(); ctx.translate(pos[0], pos[1]); const sc = mix(2.2, 1, e) * QS * (1 - tight); ctx.scale(sc, sc); rosette(ctx, 0, 0, { R: 34, A: 10, B: 5, n: 14, m: 5, lines: 22, col: PL.c0, w: Math.max(.9, 1.1 * px / sc), a: .95, rot: t * .2 }); ctx.restore();
        if (du < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,200,140,${.5 * (1 - du)})`; ctx.lineWidth = 2 * px; ctx.beginPath(); ctx.arc(dp[0], dp[1], (40 + 90 * e) * QS, 0, TAU); ctx.stroke(); ctx.restore(); }
      }
    }
    ctx.restore();
  }

  // ---- the walls' details
  function wallX(ctx, c, X, L, t) {
    // engraved vertical courses (wallpaper) and the lights that reach the side walls
    const side = X < 0 ? 1 : -1;
    if (X < 0) { const g = (z, y, rx, ry, col, a) => { if (a <= .002 || z - c.z < 12) return; const p = pr(c, X, y, z); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(p[0], p[1]); const sq = Math.abs(X - c.x) / Math.max(10, z - c.z); ctx.scale(Math.max(.05, sq), ry / rx); const R = rx * p[2], gg = ctx.createRadialGradient(0, 0, 0, 0, 0, R); gg.addColorStop(0, rgba(col, a)); gg.addColorStop(1, rgba(col, 0)); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.restore(); };
      g(LAMP.z - 10, LAMP.y, 130, 150, '#ffb35c', .22); }
    else { const tl = clamp(L.tv / 1.9); if (tl > .01 && TVP[2] - c.z > 12) { const p = pr(c, X, TVP[1], TVP[2]); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(p[0], p[1]); const sq = Math.abs(X - c.x) / Math.max(10, TVP[2] - c.z); ctx.scale(Math.max(.05, sq), 1); const R = 120 * p[2], gg = ctx.createRadialGradient(0, 0, 0, 0, 0, R); gg.addColorStop(0, rgba(SCREEN, .35 * tl)); gg.addColorStop(1, rgba(SCREEN, 0)); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.restore(); } }
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1; ctx.beginPath(); for (let z = 20; z < ZB; z += 24) { const s = seg3(c, [X, CE, z], [X, FL, z]); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } } ctx.stroke();
  }
  function floor(ctx, c, t, L) {
    // planks along Z, their joints; a rug under the table; the lamp's and the TV's pools; the sofa's shadow
    ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = XL; x <= XR; x += 16) { const s = seg3(c, [x, FL, 1], [x, FL, ZB]); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } }
    const r = prng(41); for (let x = XL; x < XR; x += 16) { let z = r() * 90; while (z < ZB) { const s = seg3(c, [x, FL, z], [x + 16, FL, z]); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } z += 90 + r() * 80; } }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(120,90,70,.08)'; ctx.beginPath(); for (let x = XL + 5; x <= XR; x += 16) { const s = seg3(c, [x, FL, 1], [x, FL, ZB]); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } } ctx.stroke();
    // the rug
    if (poly3(ctx, c, [[-110, FL - .3, 320], [110, FL - .3, 320], [110, FL - .3, 480], [-110, FL - .3, 480]])) {
      ctx.fillStyle = '#231a2a'; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(200,150,110,.12)'; ctx.lineWidth = 1; ctx.beginPath();
      for (const inset of [8, 14]) { const q = [[-110 + inset, 320 + inset], [110 - inset, 320 + inset], [110 - inset, 480 - inset], [-110 + inset, 480 - inset]]; q.forEach(([x, z], i) => { const p = pr(c, x, FL - .3, Math.max(z, c.z + 4)); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath(); }
      ctx.stroke(); ctx.restore();
    }
    pool(ctx, c, LAMP.x + 10, FL, LAMP.z - 20, 130, 110, '#ffb35c', .26);
    const tl = clamp(L.tv / 1.9); if (tl > .01) pool(ctx, c, 60, FL, 400, 200, 140, SCREEN, .14 * tl);
    pool(ctx, c, -130, FL, 400, 70, 110, '#03040a', .7, 'source-over');   // under the sofa
    pool(ctx, c, -80, FL, 404, 22, 14, '#03040a', .55, 'source-over');    // under the feet
  }
  function door(ctx, t, L) {
    // a panelled door (painted, dark), its architrave, a brass handle that catches the TV
    const x0 = DOOR.x0, x1 = DOOR.x1, y0 = DOOR.top, tl = clamp(L.tv / 1.9);
    ctx.fillStyle = '#121530'; ctx.fillRect(x0 - 7, y0 - 7, x1 - x0 + 14, FL - y0 + 7);
    ctx.fillStyle = '#171b3a'; ctx.fillRect(x0, y0, x1 - x0, FL - y0);
    ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 1.2; for (const [a, b, cc, d] of [[x0 + 10, y0 + 12, x1 - 10, y0 + 95], [x0 + 10, y0 + 110, x1 - 10, FL - 14]]) { ctx.strokeRect(a, b, cc - a, d - b); ctx.strokeRect(a + 4, b + 4, cc - a - 8, d - b - 8); }
    ctx.strokeStyle = rgba('#9fb0e0', .1); ctx.beginPath(); ctx.moveTo(x0 + 10, y0 + 12); ctx.lineTo(x0 + 10, y0 + 95); ctx.moveTo(x0 + 10, y0 + 110); ctx.lineTo(x0 + 10, FL - 14); ctx.stroke();
    if (tl > .01) { const g = ctx.createLinearGradient(x1, 0, x0, 0); g.addColorStop(0, rgba(SCREEN, .14 * tl)); g.addColorStop(1, rgba(SCREEN, 0)); ctx.fillStyle = g; ctx.fillRect(x0 - 7, y0 - 7, x1 - x0 + 14, FL - y0 + 7); }
    ctx.fillStyle = '#6a5228'; ctx.beginPath(); ctx.roundRect(x0 + 8, 52, 9, 3.2, 1.5); ctx.fill(); ctx.fillStyle = mixC('#c9a050', '#d8f7ff', tl * .6); ctx.fillRect(x0 + 9, 52.3, 7, .9);
  }
  function clock(ctx, t, c, L) {
    // 8:57 when you come in, nine on "nine", the evening goes on (≈ 4 min per s): the minute hand moves, slowly
    const hr = t < A.nine ? 21 - (A.nine - t) * (3 / 60) / 2.6 : 21 + (t - A.nine) * (42 / 60) / (155.2 - A.nine);
    const tl = clamp(L.tv / 1.9), face = mixC('#5d5a52', '#a9c4cc', tl);
    wallClock(ctx, CLOCK.x, CLOCK.y, CLOCK.r, hr, { face, ink: '#0b0d18', light: { col: tl > .1 ? SCREEN : '#ffcf8a', a: .4 + .5 * tl } });
    // "nine": the minute hand lands on twelve with a small glint on the rim
    const gN = Math.exp(-Math.abs(t - A.nine) / .18) * (t > A.nine - .2 ? 1 : 0); if (gN > .02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#d8f7ff', .5 * gN); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(CLOCK.x, CLOCK.y, CLOCK.r * 1.12, -2.2, -.9); ctx.stroke(); ctx.restore(); }
  }
  // ---- the lamp: base, brass pole, a drum shade glowing from inside (the hero amber), its bulb seen from below
  function lamp(ctx, c, t, L) {
    if (LAMP.z <= c.z + 6) return; const k = plane(ctx, c, LAMP.z), x = LAMP.x, sy = LAMP.y;
    const shTop = sy - 16, shBot = sy + 13, rT = 18, rB = 22;
    ctx.fillStyle = '#16120e'; ctx.beginPath(); ctx.ellipse(x, FL - 1.5, 17, 3.2, 0, 0, TAU); ctx.fill(); ctx.fillStyle = rgba('#ffcf8a', .18); ctx.fillRect(x - 16, FL - 3.5, 32, 1);
    ctx.fillStyle = '#3a2c18'; ctx.fillRect(x - 1, shBot, 2, FL - 2 - shBot); ctx.fillStyle = rgba('#ffcf8a', .45); ctx.fillRect(x + .2, shBot, .6, FL - 2 - shBot);
    // the shade (fabric, lit from inside): warm, brighter at the bottom rim, vertical engraved seams
    ctx.beginPath(); ctx.moveTo(x - rT, shTop); ctx.lineTo(x + rT, shTop); ctx.lineTo(x + rB, shBot); ctx.lineTo(x - rB, shBot); ctx.closePath();
    const g = ctx.createLinearGradient(0, shTop, 0, shBot); g.addColorStop(0, '#c9873e'); g.addColorStop(.6, '#f2b265'); g.addColorStop(1, '#ffd79a'); ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(120,60,10,.25)'; ctx.lineWidth = .35; for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(x + i * rT / 6.5, shTop); ctx.lineTo(x + i * rB / 6.5, shBot); ctx.stroke(); } const sg = ctx.createLinearGradient(x - rB, 0, x + rB, 0); sg.addColorStop(0, 'rgba(60,20,0,.35)'); sg.addColorStop(.45, 'rgba(60,20,0,0)'); sg.addColorStop(1, 'rgba(60,20,0,.2)'); ctx.fillStyle = sg; ctx.fillRect(x - rB, shTop, rB * 2, shBot - shTop); ctx.restore();
    // the bottom opening (seen from below: the bulb's light), the rims
    const ry = Math.max(.3, Math.abs(shBot - c.y) / (LAMP.z - c.z) * rB);
    if (c.y > shBot) { ctx.fillStyle = '#fff1d6'; ctx.beginPath(); ctx.ellipse(x, shBot, rB - .5, ry, 0, 0, TAU); ctx.fill(); const bg = ctx.createRadialGradient(x, shBot, 0, x, shBot, rB); bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, 'rgba(255,220,160,0)'); ctx.fillStyle = bg; ctx.fill(); }
    ctx.strokeStyle = '#7a4a18'; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(x, shBot, rB, ry, 0, 0, Math.PI); ctx.stroke();
    // the glow around the shade (light in the air)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(x, sy, 0, x, sy, 90); gg.addColorStop(0, 'rgba(255,190,110,.32)'); gg.addColorStop(.4, 'rgba(255,170,90,.1)'); gg.addColorStop(1, 'rgba(255,160,80,0)'); ctx.fillStyle = gg; ctx.fillRect(x - 90, sy - 90, 180, 180); ctx.restore();
  }
  // ---- the work bag slumped at the door: a leather briefcase with a flap and a handle, its strap on the floor
  function bag(ctx, c, t, L) {
    const z = ZB - 9; if (z <= c.z + 6) return; plane(ctx, c, z); const x = 76, y = FL, tl = clamp(L.tv / 1.9);
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.ellipse(x + 20, y - .5, 30, 3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2, y - 30); ctx.quadraticCurveTo(x + 3, y - 34, x + 8, y - 34); ctx.lineTo(x + 34, y - 33); ctx.quadraticCurveTo(x + 39, y - 33, x + 40, y - 28); ctx.lineTo(x + 42, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3a2618'; ctx.beginPath(); ctx.moveTo(x + 1.5, y - 31); ctx.quadraticCurveTo(x + 3, y - 35, x + 8, y - 35); ctx.lineTo(x + 34, y - 34); ctx.quadraticCurveTo(x + 40, y - 34, x + 40.5, y - 28); ctx.lineTo(x + 40.8, y - 16); ctx.quadraticCurveTo(x + 21, y - 13, x + 1.2, y - 16); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,220,180,.18)'; ctx.lineWidth = .4; ctx.beginPath(); ctx.moveTo(x + 2, y - 30); ctx.quadraticCurveTo(x + 21, y - 32, x + 40, y - 28); ctx.stroke();
    ctx.fillStyle = '#a07a3a'; ctx.fillRect(x + 18.5, y - 17, 4, 3); ctx.strokeStyle = '#1a100a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x + 14, y - 34); ctx.quadraticCurveTo(x + 21, y - 43, x + 28, y - 34); ctx.stroke();
    ctx.strokeStyle = '#1a110b'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + 40, y - 20); ctx.quadraticCurveTo(x + 52, y - 4, x + 66, y - .8); ctx.stroke();
    if (tl > .01) { ctx.strokeStyle = rgba(SCREEN, .35 * tl); ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(x + 40.4, y - 30); ctx.lineTo(x + 41.8, y - 2); ctx.stroke(); }
  }
  // ---- the sofa (seen from its end: profiles extruded along Z)
  const ALB = h3('#56607e'), ALB_D = h3('#454e6a'), WOOD = h3('#4a3020');
  const SPR = {
    back: [[-178, 138], [-178, 70], [-176.5, 63], [-172, 59], [-166, 57.5], [-160, 58.5], [-156, 62], [-153.6, 68], [-152, 78], [-151.5, 88], [-152.5, 98], [-155, 106], [-158, 120], [-164, 138]],
    base: [[-176, 120], [-90, 120], [-88.4, 122], [-88.4, 135.5], [-90, 137.5], [-176, 137.5]],
    arm: [[-178, 137.5], [-178, 88], [-175, 85], [-168, 84], [-104, 84], [-97.5, 84.6], [-93, 86.6], [-89.8, 90.4], [-88.8, 95.5], [-89.6, 100.5], [-90.8, 104.5], [-90.8, 137.5]],
  };
  const seatProf = (dent) => [[-156, 107], [-154.5, 104.6 + dent * .4], [-148, 103.8 + dent * .9], [-120, 103.8 + dent], [-100, 103.9 + dent * .7], [-95, 104.6 + dent * .4], [-91.6, 106.6 + dent * .15], [-90.2, 110.4], [-90.4, 115.6], [-92, 118.8], [-95, 120.2], [-156, 120.2]];
  const CZ = [322, 375.7, 429.3, 483];
  const dentAt = (t) => { const u = s5((t - (T.contact - .05)) / .12); return u * (5.5 + 2.2 * Math.exp(-Math.max(0, t - T.contact) / .12) * Math.sin(Math.max(0, t - T.contact) * 22) * (t > T.contact ? 1 : 0)); };
  function armDetail(ctx, k, z) {
    // the rolled arm's scroll, the welt round the panel, a few creases, the engraved fabric lines
    ctx.strokeStyle = 'rgba(4,5,14,.55)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(-176, 89); ctx.quadraticCurveTo(-140, 86.6, -100, 87.2); ctx.quadraticCurveTo(-92.5, 88.5, -92.2, 95); ctx.quadraticCurveTo(-92.6, 100, -96.5, 99.6); ctx.quadraticCurveTo(-99.5, 98.2, -98.5, 94.8); ctx.quadraticCurveTo(-97.2, 92.6, -95, 94); ctx.stroke();
    ctx.strokeStyle = 'rgba(200,215,255,.12)'; ctx.lineWidth = .35; ctx.beginPath(); ctx.moveTo(-176, 88.2); ctx.quadraticCurveTo(-140, 85.8, -100, 86.4); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = .3; ctx.beginPath(); for (let x = -176; x < -92; x += 1.6) { ctx.moveTo(x, 92); ctx.lineTo(x + .6, 137); } ctx.stroke();
    const vg = ctx.createLinearGradient(0, 88, 0, 138); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(2,3,10,.55)'); ctx.fillStyle = vg; ctx.fillRect(-180, 84, 95, 56);
  }
  function backDetail(ctx, k, z) {
    ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = .3; ctx.beginPath(); for (let x = -177; x < -152; x += 1.6) { ctx.moveTo(x, 60); ctx.lineTo(x, 138); } ctx.stroke();
    ctx.strokeStyle = 'rgba(200,215,255,.1)'; ctx.lineWidth = .35; ctx.beginPath(); ctx.moveTo(-176, 64); ctx.quadraticCurveTo(-166, 57.8, -156.5, 63); ctx.stroke();
  }
  function sofaFar(ctx, c, t, L) {
    // legs at the far end, the backrest's far piece, the far arm (its inner panel faces us), the backrest, the base, the far and middle seat cushions
    for (const [x, z] of [[-172, 500], [-95, 500]]) legSofa(ctx, c, x, z, L);
    extrude(ctx, c, SPR.back, 483, 505, ALB_D, L, { cap: false });
    extrude(ctx, c, SPR.arm, 483, 505, ALB, L, { ink: .4, detail: armDetail });
    extrude(ctx, c, SPR.back, 300, 483, ALB_D, L, { ink: .35, detail: backDetail });
    // the back cushions' seams and buttons on the front face (X ≈ −152)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = 'rgba(3,4,10,.5)'; ctx.lineWidth = 1; ctx.beginPath();
    for (const z of [375.7, 429.3]) { const s = seg3(c, [-152.6, 64, z], [-153, 104, z]); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } }
    ctx.stroke();
    for (const z of [348, 402, 456]) for (const y of [76, 92]) { if (z <= c.z + 5) continue; const p = pr(c, -151.6, y, z); ctx.fillStyle = 'rgba(3,4,10,.55)'; ctx.beginPath(); ctx.ellipse(p[0], p[1], Math.max(.6, .55 * p[2] * .4), Math.max(.6, .55 * p[2]), 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    extrude(ctx, c, SPR.base, CZ[0], CZ[3], ALB_D, L, { cap: false });
    // seat cushions: far, middle (the one you sit on: it dents), each with a piped front edge
    extrude(ctx, c, seatProf(0), CZ[2] + .6, CZ[3], ALB, L, { ink: .5 });
    const dn = dentAt(t); extrude(ctx, c, seatProf(dn), CZ[1] + .6, CZ[2], ALB, L, { ink: .5 });
    piping(ctx, c, [CZ[1] + .6, CZ[3]], dn, L);
  }
  function cushionNear(ctx, c, t, L) { extrude(ctx, c, seatProf(0), CZ[0], CZ[1], ALB, L, { ink: .5 }); piping(ctx, c, [CZ[0], CZ[1]], 0, L); }
  function piping(ctx, c, [z0, z1], dn, L) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const tl = clamp(L.tv / 1.9);
    const s = seg3(c, [-91.4, 106.4 + dn * .15, Math.max(z0, c.z + 4)], [-91.4, 106.4, z1]); if (s) { ctx.strokeStyle = 'rgba(3,4,10,.55)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.stroke(); ctx.strokeStyle = rgba(tl > .1 ? SCREEN : '#c9d4ff', .22 + .3 * tl); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(s[0], s[1] - 1); ctx.lineTo(s[2], s[3] - 1); ctx.stroke(); }
    ctx.restore();
  }
  function legSofa(ctx, c, x, z, L) { if (z <= c.z + 6) return; const k = plane(ctx, c, z); ctx.fillStyle = '#20140c'; ctx.beginPath(); ctx.moveTo(x - 2.2, 137.5); ctx.lineTo(x + 2.2, 137.5); ctx.lineTo(x + 1.3, FL); ctx.lineTo(x - 1.3, FL); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,200,150,.18)'; ctx.fillRect(x - 1.9, 138, .6, 10); }
  function sofaNear(ctx, c, t, L) {
    for (const [x, z] of [[-172, 302], [-95, 302]]) legSofa(ctx, c, x, z, L);
    extrude(ctx, c, SPR.arm, SOFA.z0, CZ[0], ALB, L, { ink: .45, detail: (g, k, z) => { armDetail(g, k, z); backDetail(g, k, z); } });
  }
  // ---- the TV on its low bench against the right wall (the screen faces −X, toward the sofa)
  function tvSet(ctx, c, t, L) {
    const tl = clamp(L.tv / 1.9), on = tvOn(t), wood = h3('#3b2a1e');
    // the bench: top, front (doors), the near end
    const bx0 = TVB.x0, bx1 = TVB.x1, bz0 = TVB.z0, bz1 = TVB.z1, by = TVB.top;
    if (poly3(ctx, c, [[bx0, by, bz0], [bx1, by, bz0], [bx1, by, bz1], [bx0, by, bz1]])) { ctx.fillStyle = shade(wood, [bx0 + 10, by, 400], [0, -1, 0], L); ctx.fill(); }
    if (poly3(ctx, c, [[bx0, by, bz0], [bx0, by, bz1], [bx0, FL - 6, bz1], [bx0, FL - 6, bz0]])) { ctx.fillStyle = shade(wood, [bx0, 125, 400], [-1, 0, 0], L); ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; ctx.beginPath(); const s = seg3(c, [bx0, by + 2, 400], [bx0, FL - 8, 400]); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } ctx.stroke(); ctx.restore(); }
    if (bz0 > c.z + 4 && poly3(ctx, c, [[bx0, by, bz0], [bx1, by, bz0], [bx1, FL - 6, bz0], [bx0, FL - 6, bz0]])) { ctx.fillStyle = shade(wood, [180, 125, bz0], [0, 0, -1], L); ctx.fill(); }
    // the screen (a quad in the plane X = TV.x): off = dark glass with the lamp's reflection; on = the show, in the common rhythm
    const sx = TV.x, z0 = TV.z0, z1 = TV.z1, y0 = TV.y0, y1 = TV.y1;
    if (poly3(ctx, c, [[sx + 3, y0 - 2.5, z0 - 2.5], [sx + 3, y0 - 2.5, z1 + 2.5], [sx + 3, y1 + 2.5, z1 + 2.5], [sx + 3, y1 + 2.5, z0 - 2.5]])) { ctx.fillStyle = '#07080e'; ctx.fill(); }
    if (poly3(ctx, c, [[sx, y0, z0], [sx, y0, z1], [sx, y1, z1], [sx, y1, z0]])) {
      const a = pr(c, sx, y0, z0), b = pr(c, sx, y1, z1);
      if (on < .01) { const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, '#0d1018'); g.addColorStop(.5, '#151a26'); g.addColorStop(1, '#090b12'); ctx.fillStyle = g; ctx.fill(); }
      else {
        const f = flick(t, .5, 0), g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, mixC('#0d1018', '#cdf3ff', on * (.75 + .25 * f))); g.addColorStop(.5, mixC('#151a26', '#7fd6f0', on * (.7 + .3 * f))); g.addColorStop(1, mixC('#090b12', '#3a86a8', on)); ctx.fillStyle = g; ctx.fill();
        // the show: a horizon and two figures talking, a slow pan (abstract, it only has to read as a picture)
        ctx.save(); ctx.clip(); const hzY = mix(y0, y1, .62); const hs = seg3(c, [sx, hzY, z0], [sx, hzY, z1]); if (hs) { ctx.strokeStyle = rgba('#0b2a3a', .5 * on); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hs[0], hs[1]); ctx.lineTo(hs[2], hs[3]); ctx.stroke(); }
        for (const [zz, hh] of [[z0 + 40 + 6 * Math.sin(t * .7), 22], [z0 + 70 + 4 * Math.sin(t * .5 + 1), 25]]) if (poly3(ctx, c, [[sx, hzY - hh, zz - 4], [sx, hzY - hh, zz + 4], [sx, y1, zz + 5], [sx, y1, zz - 5]])) { ctx.fillStyle = rgba('#0b2a3a', .55 * on); ctx.fill(); }
        ctx.restore();
      }
      // the glass: a diagonal reflection
      ctx.save(); poly3(ctx, c, [[sx, y0, z0], [sx, y0, z1], [sx, y1, z1], [sx, y1, z0]]); ctx.clip(); if (poly3(ctx, c, [[sx - .1, y0, z0 + 20], [sx - .1, y0, z0 + 34], [sx - .1, y1, z0 + 8], [sx - .1, y1, z0 - 6]])) { ctx.fillStyle = 'rgba(200,220,255,.06)'; ctx.fill(); } ctx.restore();
    }
    // the stand
    if (poly3(ctx, c, [[sx + 2, y1 + 2.5, 392], [sx + 2, y1 + 2.5, 408], [sx + 2, by, 412], [sx + 2, by, 388]])) { ctx.fillStyle = '#0a0b10'; ctx.fill(); }
    // the light out of the screen into the air (bloom when it comes on)
    if (on > .01) { const p = pr(c, sx - 4, (y0 + y1) / 2, (z0 + z1) / 2); if (p[3] > 5) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; const R = 160 * p[2], g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); const bl = .22 * tl + .25 * Math.exp(-Math.max(0, t - A.remote) / .2) * on; g.addColorStop(0, rgba(SCREEN_HOT, bl)); g.addColorStop(.35, rgba(SCREEN, bl * .4)); g.addColorStop(1, rgba(SCREEN, 0)); ctx.fillStyle = g; ctx.fillRect(p[0] - R, p[1] - R, 2 * R, 2 * R); ctx.restore(); } }
  }
  // ---- the coffee table: walnut top (engraved grain), the two wine rings, the glass, the bottle, the remote, the laptop; legs
  function table(ctx, c, t, L, part) {
    const { x0, x1, z0, z1, top, th } = TABLE, wood = h3('#5a3a24');
    if (part === 'top') {
      for (const [x, z] of [[x0 + 6, z1 - 6], [x1 - 6, z1 - 6]]) tableLeg(ctx, c, x, z, L);
      // the top face
      if (poly3(ctx, c, [[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]])) {
        const a = pr(c, 0, top, z0), b = pr(c, 0, top, z1), g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, shade(wood, [0, top, z0], [0, -1, 0], L)); g.addColorStop(1, shade(wood, [0, top, z1], [0, -1, 0], L)); ctx.fillStyle = g; ctx.fill();
        ctx.save(); ctx.clip();
        // grain: long wavy lines along X
        ctx.strokeStyle = 'rgba(20,8,2,.35)'; ctx.lineWidth = .8; const r = prng(19);
        for (let i = 0; i < 26; i++) { const z = z0 + 2 + i * (z1 - z0 - 4) / 25 + r() * 2; ctx.beginPath(); for (let x = x0; x <= x1; x += 6) { const p = pr(c, x, top - .05, z + Math.sin(x * .05 + i) * 1.2); x === x0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); } ctx.stroke(); }
        // the two wine rings (the first and the second glass)
        for (const [rx, rz, sz] of RING) { ctx.strokeStyle = 'rgba(70,6,18,.75)'; ctx.lineWidth = Math.max(1, .5 * pr(c, rx, top, rz)[2]); ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a2 = i / 40 * TAU, rr = 3.7 * sz * (1 + .06 * Math.sin(a2 * 3 + rx)), p = pr(c, rx + Math.cos(a2) * rr, top - .05, rz + Math.sin(a2) * rr); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke();
          ctx.strokeStyle = 'rgba(120,20,36,.35)'; ctx.lineWidth = Math.max(.6, .25 * pr(c, rx, top, rz)[2]); ctx.stroke(); }
        // light on the top: the laptop's glow, the TV's sheen
        pool(ctx, c, LAPTOP.x - 10, top, LAPTOP.z - 12, 40, 26, '#cfe8ff', .18 * L.lap / .35);
        const tl = clamp(L.tv / 1.9); if (tl > .01) pool(ctx, c, 30, top, 395, 60, 50, SCREEN, .14 * tl);
        ctx.restore();
      }
      // the front edge (Z = z0)
      if (z0 > c.z + 4 && poly3(ctx, c, [[x0, top, z0], [x1, top, z0], [x1, top + th, z0], [x0, top + th, z0]])) { ctx.fillStyle = shade(wood, [0, top + 2, z0], [0, 0, -1], L); ctx.fill(); }
      // the props standing on it
      laptop(ctx, c, t, L);
      if (t < T.bg) { const k = plane(ctx, c, BOT0.z); bottle(ctx, BOT0.x, TABLE.top - BS, { ang: -Math.PI / 2, light: lightFor(L), scale: 1 }); }
      if (t >= T.bset + .02) { plane(ctx, c, ZP + 4); bottleScaled(ctx, -49.5, TABLE.top - BS, -Math.PI / 2, L); }
      if (t < T.grab) remoteFlat(ctx, c, REM0.x, REM0.z, L);
      { plane(ctx, c, GLASS.z); wineGlass(ctx, GLASS.x, TABLE.top, { level: glassLv(t), light: lightFor(L), side: 1, glint: .8 }); }
    } else {
      for (const [x, z] of [[x0 + 6, z0 + 6], [x1 - 6, z0 + 6]]) tableLeg(ctx, c, x, z, L);
    }
  }
  const lightFor = (L) => { const tl = clamp(L.tv / 1.9); return { col: tl > .15 ? SCREEN_HOT : '#ffe0b0', a: .55 + .4 * tl }; };
  function bottleScaled(ctx, mx, my, ang, L) { ctx.save(); ctx.translate(mx, my); ctx.scale(BSC, BSC); bottle(ctx, 0, 0, { ang, light: lightFor(L) }); ctx.restore(); }
  function tableLeg(ctx, c, x, z, L) { if (z <= c.z + 6) return; plane(ctx, c, z); ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.moveTo(x - 2.4, TABLE.top + TABLE.th); ctx.lineTo(x + 2.4, TABLE.top + TABLE.th); ctx.lineTo(x + 1.4, FL); ctx.lineTo(x - 1.4, FL); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,210,170,.12)'; ctx.fillRect(x + 1, TABLE.top + TABLE.th, .6, FL - TABLE.top - TABLE.th - 2); }
  function remoteFlat(ctx, c, x, z, L) {
    // a remote lying on the table: a slim dark slab (17 × 4.6 × 1.6 cm), its top face with the buttons, its side
    const y = TABLE.top, a = -.25, ca = Math.cos(a), sa = Math.sin(a), P = (u, v, h) => [x + u * ca - v * sa, y - h, z + u * sa + v * ca];
    const top = [P(-8.5, -2.3, 1.6), P(8.5, -2.3, 1.6), P(8.5, 2.3, 1.6), P(-8.5, 2.3, 1.6)], side = [P(-8.5, -2.3, 1.6), P(8.5, -2.3, 1.6), P(8.5, -2.3, 0), P(-8.5, -2.3, 0)];
    if (poly3(ctx, c, side)) { ctx.fillStyle = '#07080c'; ctx.fill(); }
    if (poly3(ctx, c, top)) { ctx.fillStyle = '#1d2029'; ctx.fill(); const tl = clamp(L.tv / 1.9); ctx.strokeStyle = 'rgba(190,200,220,.35)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#c0392b'; const q = pr(c, ...P(6.6, 0, 1.7)); ctx.beginPath(); ctx.arc(q[0], q[1], Math.max(.8, .6 * q[2]), 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(200,215,235,.45)'; for (let i = 0; i < 4; i++) for (let j = -1; j <= 1; j++) { const p = pr(c, ...P(-6 + i * 2, j * 1.2, 1.7)); ctx.fillRect(p[0] - .5, p[1] - .3, Math.max(1, .5 * p[2]), Math.max(.6, .3 * p[2])); } }
  }
  function laptop(ctx, c, t, L) {
    // an open laptop on the table, turned toward the sofa: base, lid at ~105°, the screen (a spreadsheet; a notification on "lazy")
    const { x, z, ang } = LAPTOP, y = TABLE.top, ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, h) => [x + u * ca - v * sa, y - h, z + u * sa + v * ca];
    const w = 17, d = 23, lid = 23, tilt = .28;   // half width, depth, lid height; lid leans back by tilt
    const base = [P(-w, -d / 2, 1.8), P(w, -d / 2, 1.8), P(w, d / 2, 1.8), P(-w, d / 2, 1.8)];
    const hinge = d / 2, L1 = [P(-w, hinge, 1.8), P(w, hinge, 1.8)], top = (u) => P(u, hinge + Math.sin(tilt) * lid, 1.8 + Math.cos(tilt) * lid);
    const lidQ = [L1[0], L1[1], top(w), top(-w)];
    const lap = L.lap / .35, notif = s5((t - (A.lazy - .05)) / .25);
    if (poly3(ctx, c, [P(-w, -d / 2, 0), P(w, -d / 2, 0), P(w, -d / 2, 1.8), P(-w, -d / 2, 1.8)])) { ctx.fillStyle = '#1a1c24'; ctx.fill(); }
    if (poly3(ctx, c, base)) { ctx.fillStyle = '#2a2d38'; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = .8; ctx.beginPath(); for (let i = 0; i < 5; i++) { const s = seg3(c, P(-w + 2, -d / 2 + 4 + i * 2.6, 1.85), P(w - 2, -d / 2 + 4 + i * 2.6, 1.85)); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } } ctx.stroke(); pool(ctx, c, x - 2, y - 1.9, z - 4, 16, 10, '#cfe8ff', .25 * lap); ctx.restore(); }
    // the lid: the screen side faces the person (−X after the turn): visible from the camera? draw its face (screen) if it faces us, else its back
    const n = (() => { const a3 = lidQ[0], b3 = lidQ[1], c3 = lidQ[3]; const u = [b3[0] - a3[0], b3[1] - a3[1], b3[2] - a3[2]], v = [c3[0] - a3[0], c3[1] - a3[1], c3[2] - a3[2]]; return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; })();
    const ctr = [(lidQ[0][0] + lidQ[2][0]) / 2, (lidQ[0][1] + lidQ[2][1]) / 2, (lidQ[0][2] + lidQ[2][2]) / 2], facing = n[0] * (c.x - ctr[0]) + n[1] * (c.y - ctr[1]) + n[2] * (c.z - ctr[2]);
    if (poly3(ctx, c, lidQ)) {
      if (facing > 0) {   // the screen
        ctx.fillStyle = '#0c0e14'; ctx.fill(); ctx.save(); ctx.clip();
        const sc = (u, v) => { const q = [L1[0][0] + (L1[1][0] - L1[0][0]) * u + (lidQ[3][0] - lidQ[0][0]) * v, L1[0][1] + (L1[1][1] - L1[0][1]) * u + (lidQ[3][1] - lidQ[0][1]) * v, L1[0][2] + (L1[1][2] - L1[0][2]) * u + (lidQ[3][2] - lidQ[0][2]) * v]; return q; };
        const inner = [sc(.05, .08), sc(.95, .08), sc(.95, .94), sc(.05, .94)];
        if (poly3(ctx, c, inner)) { ctx.fillStyle = mixC('#9fc2d6', '#e6f5ff', .5 * lap); ctx.fill(); }
        ctx.strokeStyle = 'rgba(40,70,90,.55)'; ctx.lineWidth = .8; ctx.beginPath();
        for (let i = 1; i < 9; i++) { const s = seg3(c, sc(.05, .08 + i * .095), sc(.95, .08 + i * .095)); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } }
        for (let i = 1; i < 5; i++) { const s = seg3(c, sc(.05 + i * .18, .08), sc(.05 + i * .18, .94)); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } }
        ctx.stroke();
        // a few filled cells (numbers) and a red one
        for (const [u, v, col] of [[.14, .22, '#3a6a86'], [.32, .41, '#3a6a86'], [.5, .31, '#b24a3a'], [.68, .6, '#3a6a86'], [.14, .7, '#3a6a86']]) if (poly3(ctx, c, [sc(u, v), sc(u + .14, v), sc(u + .14, v + .07), sc(u, v + .07)])) { ctx.fillStyle = rgba(col, .6); ctx.fill(); }
        if (notif > .01 && poly3(ctx, c, [sc(.55, mix(.98, .82, notif)), sc(.94, mix(.98, .82, notif)), sc(.94, mix(.98, .82, notif) + .12), sc(.55, mix(.98, .82, notif) + .12)])) { ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.fillStyle = '#d0453a'; const p = pr(c, ...sc(.6, mix(.98, .82, notif) + .06)); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(1, .8 * p[2]), 0, TAU); ctx.fill(); }
        ctx.restore();
      } else { ctx.fillStyle = '#232631'; ctx.fill(); ctx.strokeStyle = rgba('#cfe8ff', .25 * lap); ctx.lineWidth = 1; ctx.stroke(); }
    }
    // the screen's light in the air
    const p = pr(c, ...top(0)); if (p[3] > 5) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; const R = 30 * p[2], g = ctx.createRadialGradient(p[0], p[1] + 8 * p[2], 0, p[0], p[1] + 8 * p[2], R); g.addColorStop(0, rgba('#cfe8ff', .12 * lap + .1 * notif)); g.addColorStop(1, 'rgba(207,232,255,0)'); ctx.fillStyle = g; ctx.fillRect(p[0] - R, p[1] + 8 * p[2] - R, 2 * R, 2 * R); ctx.restore(); }
  }
  // ---- what the hands carry (drawn over the figure): the bottle while it is lifted, poured and set down
  function heldProps(ctx, c, t, L) {
    if (t >= T.bg && t < T.bset + .02) {
      const B = bottleAt(t); plane(ctx, c, B.z); bottleScaled(ctx, B.mx, B.my, B.ang, L);
      // the pour: the stream from the mouth into the glass
      const u = clamp((t - T.pour0) / .14), thin = s5((t - (T.pour1 - .12)) / .16), gone = t > T.pour1 + .06;
      if (u > 0 && !gone) { plane(ctx, c, GLASS.z); const lv = glassLv(t), surf = TABLE.top - mix(10.4, 17.6, lv); wineStream(ctx, B.mx, B.my + .3, GLASS.x + .4, surf, u, { thin, t, w: .46 }); }
    }
  }
  function motes(ctx, c, t, tl) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; const r = prng(77);
    for (let i = 0; i < 70; i++) { const x = -60 + r() * 220, y = 20 + r() * 90, z = 340 + r() * 120, ph = r() * TAU, X = x + 6 * Math.sin(t * .2 + ph), Y = y + ((t * (1.5 + r() * 2) + r() * 90) % 90) - 45, Z = z; if (Z <= c.z + 20) continue; const p = pr(c, X, Y, Z); if (p[0] < -5 || p[0] > W + 5 || p[1] < -5 || p[1] > H + 5) continue; const lit = Math.max(0, (X + 60) / 220); ctx.fillStyle = rgba(SCREEN_HOT, .25 * tl * lit * (.5 + .5 * Math.sin(t * 2 + ph))); ctx.fillRect(p[0], p[1], Math.max(1, .25 * p[2]), Math.max(1, .25 * p[2])); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- frame
  function draw(ctx, t, c) {
    if (t >= T.plate && HO) { HO.plate(ctx, t); return; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H); ctx.restore();
    drawRoom(ctx, t, c);
    qmark(ctx, t, c);
  }
  // ---- the camera inside (local cm): [t, x, y, z, oy]. The take's camera (v2_c06_city) continues the flight through the window into these.
  const into = A.why2 + .1;
  const keys = [
    [into + .32, -6, 12, -8, 0], [A.tired, -13, 20, 6, 0], [A.tired + .45, -20, 26, 22, 0], [A.reach, -22, 28, 30, 0], [A.remote, -24, 29, 37, 0], [A.night, -26, 30, 44, 0],
    // 6.16: down to the table, the third glass; then back out (the person stays out of frame while the camera is close)
    [A.why3 + .02, -26, 30.5, 46, 0], [A.why3 + .3, -8, 52, 160, -20], [A.third - .02, -9, 88, 330, -60], [A.glassE, -10, 88.6, 336, -60],
    [A.glassE + .28, -8, 70, 262, -40], [A.glassE + .8, -28, 32, 70, 0], [A.maybe1 + .55, -40, 22, 12, 0],
    // 6.17 wide, 6.18 the slow push to the exhausted face (figure scale), 6.19 up to the "?" and onto its line
    [A.maybe2, -43, 23, 22, 0], [A.exhaustedE, -55, 24, 78, 0], [A.thats + .1, -57, 18, 80, 0], [A.didnt, -60, -4, 86, 0],
    [A.didnt + .24, -95, -30, 150, 0], [A.didnt + .46, -135, -42, 290, 0], [A.didnt + .69, -161, -47.2, 405, 0], [A.HOa - .12, CEND.x, CEND.y, CEND.z, 0], [A.HOb + .3, CEND.x, CEND.y, CEND.z, 0],
  ];
  return { draw, drawRoom, qmark, T, tvOn, personPose, keys };
}
