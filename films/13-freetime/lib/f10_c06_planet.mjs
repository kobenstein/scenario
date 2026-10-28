// Film 10 · B2 · c06 "the second bill: the planet" (02c) and the start of c07: everything happens on ONE small planet.
// The rings of the pottery wheel (top view, end of c05) become the latitudes of a globe seen from the side. On its top stands a house
// with a porch lamp and a robot; the camera dives into the robot's knee (motor → magnets → kilograms → bin → < 1 % → battery → day →
// power → data centre), then pulls all the way back: a billion cool lights on the planet, mines, a robot-shaped pit; the planet turns:
// a mountain of e-waste on its horizon (you, a drawer of phones, a robot your size); it turns again: the bank on the horizon,
// ★ sales above the horizon, the same line mirrored into the ground as mines. Silence: the section closes, the horizon stays (→ c07).
//
// Space: one card at Z = ZP (deep, so the camera may magnify ~400×). Things that live at a smaller scale are drawn in FRAMES:
//   limbFrame(α, KZ)  a frame standing on the planet's rim at angle α from the top (rotates with the planet's roll ψ);
//                     local units are screen px when the camera magnification s = KZ; y up = away from the planet.
//   surfFrame(lat, lon, KZ)  a frame lying on the visible surface (foreshortened by the view tilt).
//   the knee frame    inside the house frame, at the robot's knee (KZ 420): motor, bars, bin, ring, day, cable, data centre.
// Kit functions (glows, blur, type) behave as if drawn at scale 1 inside a frame, so they keep their look at any magnification.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { wipe, writeOn, mark, env, iris, COOLC, markPath, house } from './f10_c04_b2.mjs';
import { potRings, farStars } from './f10_c05_pot.mjs';
const { W, H, P, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rgba, mixHex, lin, rad, prng } = E;

export const ZP = 20000, GC = [960, 760], R = 172, TAU = .32;
export const TOP = [GC[0], GC[1] - R];
const LAT = [172, 160, 140, 118, 96, 80, 66, 57, 50, 42, 32, 22, 12];   // the pottery rings → latitudes (same radii)

let A = null;
let TOWER_WARM = () => 0;
let MINES_A = () => 1;
export function setMinesA(fn) { MINES_A = fn; }
export function setTowerWarm(fn) { TOWER_WARM = fn; }
let ROBOT2 = () => null, ROLL7 = () => 0;
export function setRoll7(fn) { ROLL7 = fn; }
export function setRobot2(fn) { ROBOT2 = fn; }
export function initPlanet(T) {
  if (A) return A;
  const s = (ph, n) => T.S('02c', ph, n);
  A = {
    a: T.seg('02c').start, bill: s('second bill') + .4, planet: s('the planet'), robot: s('A robot looks'), clean: s('clean'), electric: s('Electric'), quiet: s('Quiet'), exhaust: s('No exhaust'),
    look: s('But look'), joints: s('the joints') + .16, every: s('Every joint'), motor: s('a motor'), motors: s('every motor') + .24, magnets: s('magnets made'), earths: s('rare earths') + .4,
    two: s('Two to four'), kg: s('kilograms'), about: s('About twice'), twice: s('twice'), car: s('electric car') + .48, thrown: s('thrown away'), those: s('those magnets'),
    never: s('almost never'), back: s('come back'), less: s('Less than'), one: s('one percent'), recycled: s('recycled'), battery: s('the battery'), hours: s('few hours') + .32,
    so: s('So every'), power: s('needs power'), day: s('every day') + .32, plus: s('Plus the'), centers: s('data centers'), thinking: s('its thinking') + .24,
    picture: s('Now picture'), billion: s('a billion'), mines: s('new mines') + .32, hole: s('a hole'), ground: s('the ground'), replaced: s('replaced'), phones: s('like phones'),
    years: s('few years'), mountain: s('vast mountain') + .48, waste: s('electronic waste') + .48, phone: s('A phone fits'), drawer: s('a drawer'), size: s('the size'), person: s('a person'),
    remember: s('And remember'), forecast: s('that forecast') + .2, bank: s('A bank.') , counts: s('A bank counts'), sales: s('as sales'), pcounts: s('The planet counts'), minesB: s('as mines'),
    end: T.seg('02c').end, c07: T.seg('03a').start,
  };
  A.sales += .24; A.minesB += .24; A.bank += .16;
  return A;
}
export const planetAnchors = () => A;

// ---------- the planet's state over time ----------
export const morph = (t) => smooth(span(t, A.a + .02, A.a + 1.1));                       // pot rings → globe
export const tilt = (t) => lerp(Math.PI / 2, TAU, sineIO(span(t, A.a + .1, A.planet - .2)));
// roll: the planet turns so that a place on its rim comes to the top (mountain α .55, bank α 1.1)
export const ALPHA = { house: 0, mount: .55, bank: 1.1, robot: .55 + 470 / 1720, vine: 1.5 };
export function roll(t) {
  return -ALPHA.mount * sineIO(span(t, A.replaced - .3, A.phones + 1.0)) - (ALPHA.bank - ALPHA.mount) * sineIO(span(t, A.remember - .1, A.bank - .1))
    + ROLL7(t);
}

// ---------- sphere geometry ----------
const proj2 = (X, Y, Z, tau) => [X, -Z * Math.cos(tau) + Y * Math.sin(tau)];
const depthOf = (X, Y, Z, tau) => Y * Math.cos(tau) + Z * Math.sin(tau);
const sph = (lat, lon) => [Math.cos(lat) * Math.sin(lon), Math.cos(lat) * Math.cos(lon), Math.sin(lat)];
const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
// design point of a limb-frame local point (lx, ly) at roll psi
export function limbPt(alpha, KZ, lx, ly, psi) { const [x, y] = rot(lx / KZ, -R + ly / KZ, alpha + psi); return [GC[0] + x, GC[1] + y]; }
export function limbFrame(ctx, alpha, KZ, psi, fn) { ctx.save(); ctx.translate(GC[0], GC[1]); ctx.rotate(alpha + psi); ctx.translate(0, -R); ctx.scale(1 / KZ, 1 / KZ); fn(); ctx.restore(); }
export const groundY = (x, RK) => RK - Math.sqrt(Math.max(0, RK * RK - x * x));                // local ground drop on the curved rim
export const onGround = (ctx, x, RK, fn) => { ctx.save(); ctx.translate(x, groundY(x, RK)); ctx.rotate(Math.asin(clamp(x / RK, -1, 1))); fn(); ctx.restore(); };
function surfM(lat, lon, tau, KZ) {
  const p = sph(lat, lon), e = [Math.cos(lon), -Math.sin(lon), 0], n = [-Math.sin(lat) * Math.sin(lon), -Math.sin(lat) * Math.cos(lon), Math.cos(lat)];
  const P2 = proj2(p[0] * R, p[1] * R, p[2] * R, tau), e2 = proj2(...e, tau), n2 = proj2(...n, tau);
  return { a: e2[0] / KZ, b: e2[1] / KZ, c: -n2[0] / KZ, d: -n2[1] / KZ, e: GC[0] + P2[0], f: GC[1] + P2[1], depth: depthOf(...p, tau) };
}
export function surfPt(lat, lon, psi, tau = TAU) { const p = sph(lat, lon), [x, y] = proj2(p[0] * R, p[1] * R, p[2] * R, tau), [rx, ry] = rot(x, y, psi); return [GC[0] + rx, GC[1] + ry]; }

// ---------- data: lights, mines ----------
const LIGHTS = (() => { const r = prng(606), out = []; for (let i = 0; i < 4200; i++) { const lat = Math.asin(r() * 2 - 1), lon = r() * 6.283; out.push([lat, lon, r()]); } return out; })();
const MINES = [[.62, .18, 1.0], [.38, -.52, .7], [.2, .5, .75], [.78, -.25, .6], [.05, -.15, .65], [.5, .85, .55], [.3, 1.2, .5]];
export const MINE0 = MINES[0];
const H3 = [0, -Math.sin(TAU), Math.cos(TAU)];   // the house point (top of the rim) in 3D

// ---------- the knee frame (inside the house frame) ----------
export const HKZ = 14, KNEE = [17.2, -68.9], KKZ = 420;   // house frame magnification, knee in house-local, knee magnification
export function kneePt(lx, ly, psi = 0) { return limbPt(ALPHA.house, HKZ, KNEE[0] + lx * HKZ / KKZ, KNEE[1] + ly * HKZ / KKZ, psi); }

// ---------- camera ----------
// keys [t, u, v, s, ease] on the planet card; u,v design, s magnification
export function planetKeys() {
  const kp = (lx, ly) => kneePt(lx, ly), hp = (lx, ly) => limbPt(0, HKZ, lx, ly, 0), mp = (lx, ly) => limbPt(ALPHA.mount, 10, lx, ly, -ALPHA.mount), bp = (lx, ly) => limbPt(ALPHA.bank, BKZ, lx, ly, -ALPHA.bank);
  const m0 = surfPt(MINE0[0], MINE0[1], 0);
  return [
    [A.a, GC[0], GC[1], 2.7],
    [A.planet - .1, GC[0] + 190, GC[1] - 60, 1.55],
    [A.robot + .4, ...hp(90, -150), HKZ, 'q'],
    [A.look, ...hp(110, -170), HKZ * 1.05],
    [A.joints + .5, ...hp(30, -150), HKZ * 2.6],
    [A.motor + .2, ...kp(0, 0), HKZ * 4.2],
    [A.motors + .3, ...kp(0, 0), KKZ, 'q'],
    [A.two - .2, ...kp(30, 0), KKZ * 1.02],
    [A.kg + .2, ...kp(380, 105), KKZ, 's'],
    [A.thrown - .5, ...kp(420, 125), KKZ * 1.02],
    [A.thrown + 1.0, ...kp(720, 780), KKZ, 's'],
    [A.less - .3, ...kp(720, 820), KKZ * 1.02],
    [A.less + .5, ...kp(720, 900), KKZ, 's'],
    [A.so + .2, ...kp(740, 900), KKZ * 1.03],
    [A.day - .2, ...kp(1000, 900), KKZ, 's'],
    [A.plus + .1, ...kp(1040, 900), KKZ * 1.01],
    [A.thinking - .2, ...kp(1980, 880), KKZ, 's'],
    [A.picture, ...kp(2000, 880), KKZ * .98],
    [A.billion + 1.1, GC[0] + 160, GC[1] - 40, 1.7, 's'],
    [A.hole - 1.4, GC[0] + 150, GC[1] - 50, 1.78],
    [A.hole - .1, ...m0, 11, 's'],
    [A.replaced - .4, ...m0, 11.5],
    [A.phones + .3, GC[0] + 60, GC[1] - 120, 2.4, 's'],
    [A.mountain - .8, ...mp(-120, -330), 10, 's'],
    [A.phone - .3, ...mp(-60, -320), 10.4],
    [A.drawer - .2, ...mp(340, -110), 17, 's'],
    [A.remember, ...mp(350, -120), 17.5],
    [A.bank - .2, ...bp(-60, -260), 13.5, 's'],
    [A.pcounts - .1, ...bp(-40, -240), 14.2],
    [A.minesB + .3, ...bp(-50, 230), 14.2, 's'],
    [A.end + .2, ...bp(-50, 210), 14.3],
    [A.c07, ...bp(-60, -190), 15, 's'],
  ];
}
const EASE = { s: sineIO, q: quartIO, o: expoOut, i: expoIn };
export function planetCam(t, K = planetKeys()) {
  let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1], u = (EASE[b[4] || 's'])(span(t, a[0], b[0]));
  const ls = lerp(Math.log(a[3]), Math.log(b[3]), u), s = Math.exp(ls);
  // centre path: lerp in design space, weighted so the zoom target stays on screen (move faster while magnification is low)
  let x = lerp(a[1], b[1], u), y = lerp(a[2], b[2], u);
  if (a[3] !== b[3]) {   // zooming: interpolate the centre in "screen-weighted" space: c(u) = (a/sa·(1-v) + b/sb·v)/(…) form
    const k = (1 / s - 1 / a[3]) / (1 / b[3] - 1 / a[3]); const kk = isFinite(k) ? clamp(k) : u;
    x = lerp(a[1], b[1], kk); y = lerp(a[2], b[2], kk);
  }
  // a quiet breathing drift that is the same size on screen at any magnification
  const dr = smooth(span(t, A.a, A.a + 1.6)); x += E.drift(t, 4, 3) / s * dr; y += E.drift(t, 2.5, 5) / s * dr;
  const c = E.aim(ZP, x, y, s);
  return { c, s };
}

// ---------- drawing ----------
const LW = (s) => 1 / s;   // one screen px in design units
function globeBody(ctx, t, s, m, tau, psi) {
  const body = new Path2D(); body.arc(GC[0], GC[1], R, 0, 6.29);
  if (m > 0) {
    E.glowFill(ctx, body, R * .55, .6 * m, P.blue0);
    ctx.save(); ctx.globalAlpha = m;
    ctx.fillStyle = rad(ctx, GC[0] - R * .3, GC[1] - R * .55, R * 1.55, [[0, mixHex(P.ind1, P.blue0, .25)], [.4, P.ind0], [.75, P.night1], [1, P.night0]]); ctx.fill(body);
    ctx.restore();
  }
  // latitudes (from the rings), clipped to the globe, front part only when tilted
  ctx.save(); ctx.clip(body); ctx.translate(GC[0], GC[1]); ctx.rotate(psi); ctx.translate(-GC[0], -GC[1]);
  for (const r of LAT) {
    const z = Math.sqrt(Math.max(0, R * R - r * r)), cy = GC[1] - z * Math.cos(tau), ry = Math.max(.3, r * Math.sin(tau));
    const s0 = Math.cos(tau) < 1e-4 ? -2 : -z * Math.tan(tau) / Math.max(r, 1e-3);
    const a0 = s0 <= -1 ? 0 : s0 >= 1 ? null : Math.asin(s0), a1 = s0 <= -1 ? 6.2832 : Math.PI - a0;
    if (a0 == null) continue;
    ctx.strokeStyle = rgba(P.halo0, (.34 + .18 * (r === 172)) * m); ctx.lineWidth = lerp(6, 1.8, m) / s; ctx.beginPath(); ctx.ellipse(GC[0], cy, r, ry, 0, a0, a1); ctx.stroke();
  }
  ctx.restore();
  // a thin rim of light on the planet's edge
  if (m > 0) { ctx.strokeStyle = rgba(mixHex(P.blue2, P.cream, .3), .55 * m); ctx.lineWidth = 2 * LW(s); ctx.beginPath(); ctx.arc(GC[0], GC[1], R, 0, 6.29); ctx.stroke(); }
}
function lights(ctx, t, s, psi) {
  const g0 = A.picture + .3; if (t < g0) return;
  const tau = TAU, bl = smooth(span(t, g0, g0 + 1.6)); E.halo(ctx, GC[0], GC[1] - R * .2, R * 1.2, .16 * bl, P.blue0, P.blue0);
  ctx.save(); ctx.translate(GC[0], GC[1]); ctx.rotate(psi);
  for (const [lat, lon, rr] of LIGHTS) {
    const p = sph(lat, lon), d = depthOf(...p, tau); if (d < .03) continue;
    const ang = Math.acos(clamp(p[0] * H3[0] + p[1] * H3[1] + p[2] * H3[2], -1, 1)), u = span(t, g0 + ang * .55 + rr * .25, g0 + .4 + ang * .55 + rr * .25); if (u <= 0) continue;
    const [x, y] = proj2(p[0] * R, p[1] * R, p[2] * R, tau), sz = (.8 + 1.0 * Math.sqrt(d)) * LW(s) * 2.4 * expoOut(u);
    ctx.fillStyle = rgba(rr > .93 ? P.cream : COOLC, .65 + .35 * d); ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
  }
  ctx.restore();
}
function mines(ctx, t, s, psi) {
  const g = (i) => span(t, A.mines - .35 + i * .1, A.mines + .45 + i * .1);
  const ma = MINES_A(t); if (ma <= 0) return;
  ctx.save(); ctx.globalAlpha *= ma;
  MINES.forEach(([lat, lon, sc], i) => {
    const u = g(i); if (u <= 0) return;
    const KZ = 11, M = surfM(lat, lon, TAU, KZ); if (M.depth < .1) return;
    ctx.save(); ctx.translate(GC[0], GC[1]); ctx.rotate(psi); ctx.translate(-GC[0], -GC[1]); ctx.transform(M.a, M.b, M.c, M.d, M.e, M.f);
    if (i === 0) robotPit(ctx, t, u); else ringPit(ctx, t, u, sc);
    ctx.restore();
  });
  ctx.restore();
}
// an open pit: terraces of light around a dark bottom (local px at KZ 11)
function ringPit(ctx, t, u, sc) {
  const n = 5, R0 = 140 * sc * expoOut(u);
  for (let i = 0; i < n; i++) {
    const r = R0 * (1 - i / (n + .6)); ctx.fillStyle = mixHex(P.night1, P.night0, i / n); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.halo0, .75 - i * .1); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI * .1, Math.PI * .95); ctx.stroke();
  }
}
// the pit in the shape of a robot: terraces are offset outlines of the robot icon (robot lying in the ground)
let PIT = null;
function robotPit(ctx, t, u) {
  if (!PIT) {
    const base = new Path2D(); base.addPath(robotIconPath(), { a: 300, b: 0, c: 0, d: 300, e: 0, f: 0 });
    PIT = [0, 1, 2, 3, 4, 5].map((i) => (i ? new Path2D(base).stroke({ width: i * 64, cap: 1, join: 1 }).op(new Path2D(base), PathOp.Union) : new Path2D(base)));
  }
  const g = expoOut(u), hl = smooth(span(t, A.hole - .2, A.hole + .5));
  ctx.save(); ctx.scale(g, g);
  for (let i = PIT.length - 1; i >= 0; i--) {
    ctx.fillStyle = mixHex(mixHex(P.ind0, P.night1, .4), P.night0, 1 - i / PIT.length); ctx.fill(PIT[i]);
    ctx.strokeStyle = rgba(P.halo0, (.25 + .1 * (5 - i)) * (i ? 1 : 0)); ctx.lineWidth = 3; ctx.stroke(PIT[i]);
  }
  // the robot-shaped bottom: a hole, its edge lights on "hole"
  ctx.fillStyle = P.night0; ctx.fill(PIT[0]);
  if (hl > 0) { E.glowFill(ctx, PIT[0], 40, .7 * hl, P.halo0); ctx.strokeStyle = rgba(P.core1, hl); ctx.lineWidth = 5; ctx.stroke(PIT[0]); ctx.fillStyle = P.night0; ctx.fill(PIT[0]); }
  // ore veins: warm threads in the terrace walls
  ctx.strokeStyle = rgba(P.halo1, .5 * g); ctx.lineWidth = 3;
  for (const [x0, y0, x1, y1] of [[-260, -120, -180, 40], [200, -260, 290, -60], [-120, 300, 60, 380], [240, 200, 330, 330]]) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + 30, (y0 + y1) / 2 - 20, x1, y1); ctx.stroke(); }
  ctx.restore();
}
let RIP = null;
function robotIconPath() {
  if (RIP) return RIP;
  // the kit robot icon path, rebuilt via a 1×1 icon draw into a throwaway path (icon() returns the path it drew)
  const c = MEAS; c.save(); c.globalAlpha = 0; RIP = E.icon(c, 'robot', 0, 0, 1, 0, { dust: 0 }); c.restore(); return RIP;
}
import { createCanvas } from '@napi-rs/canvas';
const MEAS = createCanvas(8, 8).getContext('2d');

// ---------- the house on top (frame α 0, KZ 14): robot, porch lamp; ELECTRIC · QUIET · NO EXHAUST ----------
function houseTop(ctx, t, s, psi) {
  const RK = R * HKZ;
  const rise = smooth(span(t, A.a + 1.0, A.planet - .3));
  if (rise <= 0) return;
  limbFrame(ctx, ALPHA.house, HKZ, psi, () => {
    ctx.translate(0, 700 * (1 - rise));
    const lamp = [214, -238];
    onGround(ctx, 330, RK, () => {
      // the house: dark body, roof, a door with the porch lamp (the hero light)
      ctx.fillStyle = mixHex(P.night1, P.ind0, .35); ctx.fillRect(-150, -250, 300, 252);
      ctx.beginPath(); ctx.moveTo(-178, -248); ctx.lineTo(0, -380); ctx.lineTo(178, -248); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-178, -248); ctx.lineTo(0, -380); ctx.lineTo(178, -248); ctx.stroke();
      ctx.fillStyle = rgba(P.blue1, .45); ctx.fillRect(-92, -130, 64, 132);   // door
      E.lightForm(ctx, 'window', 40, -176, 70, 58, t, { mullions: [2, 2], dust: 0, breath: .01, a: .35 });
    });
    E.lightPool(ctx, -120, 330, groundY(100, RK) + 2, 240, 60, .55);
    E.lightForm(ctx, 'disc', lamp[0] - 16, lamp[1] - 16, 32, 32, t, { dust: 500, seed: 66, breath: .02 });
    E.halo(ctx, lamp[0], lamp[1], 260, .22, P.halo1, P.halo2);
    // the robot under the lamp; joints glow "inside the joints"
    const jg = env(t, A.joints - .5, A.joints + .2, A.motors - 1.0, A.motors - .5), rimA = 1 - smooth(span(s, 20, 70));
    E.robot(ctx, 0, groundY(0, RK), 260, { dir: 1, light: -1, rim: rgba(P.halo0, rimA), seam: rgba(P.halo0, .35 * rimA), body: P.night1, joint: jg > 0 ? rgba(P.core1, jg) : undefined });
    if (jg > 0) for (const [x, y] of [[-17, -69], [17, -69], [-46, -205], [46, -205]]) E.halo(ctx, x, y, 40, .5 * jg);
    // clean: three marks over the porch (ELECTRIC · QUIET · NO EXHAUST)
    const items = [['bolt', 'ELECTRIC', A.electric], ['wave', 'QUIET', A.quiet], ['cloud', 'NO EXHAUST', A.exhaust]];
    items.forEach(([nm, lab, at], i) => {
      const u = span(t, at - .15, at + .45), out = 1 - smooth(span(t, A.look - .1, A.look + .5)); if (u <= 0) return;
      const x = -300 + i * 250, y = -500;
      mark(ctx, nm, x, y, 110 * out, t, { lit: 0, u, glow: 1.1 });
      if (nm === 'cloud' && u > .4) { const k = smooth(span(t, at + .3, at + .7)) * out; E.trail(ctx, [[x - 60, y + 50, 4], [x + 60, y - 50, 4]], k, { w: 4, spark: k < 1 }); }
      wipe(ctx, lab, x, y + 110, u * out, { size: 38, align: 'center', glow: false, col: COOLC, spacing: .12, weight: 700 });
    });
  });
}

// ---------- the knee frame: motor → magnets → bars → bin → ring → day → cable → data centre ----------
function kneeChain(ctx, t, s, psi) {
  if (s < 6 || t > A.hole) return;
  limbFrame(ctx, ALPHA.house, HKZ, psi, () => {
    ctx.save(); ctx.translate(KNEE[0], KNEE[1]); ctx.scale(HKZ / KKZ, HKZ / KKZ);
    motor(ctx, t); bars(ctx, t); bin(ctx, t); ring(ctx, t); cable(ctx, t);
    ctx.restore();
  });
}
const SEG = 8;
const segPath = (i, r0 = 120, r1 = 180) => { const a0 = i / SEG * 6.283 + .06, a1 = (i + 1) / SEG * 6.283 - .06, p = new Path2D(); p.arc(0, 0, r1, a0, a1); p.arc(0, 0, r0, a1, a0, true); p.closePath(); return p; };
const BAR = { x0: 470, x1: 830, w: 130, base: 400, kg: 150 };
const blockPos = (i) => [BAR.x0, BAR.base - (i + .5) * (2 * BAR.kg / SEG)];
function motor(ctx, t) {
  const op = expoOut(span(t, A.motor + .3, A.motors + .5)), out = smooth(span(t, A.thrown - .6, A.thrown + .4));
  if (op <= 0 || out >= 1) return;
  const rr = 330 * op, rt = t * .5;
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, rr, 0, 6.29); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(-400, -400, 800, 800);
  // housing ring, stator teeth with coils, rotor with magnet segments, shaft
  const hs = new Path2D(); hs.arc(0, 0, 300, 0, 6.29); E.lightShape(ctx, hs.stroke({ width: 22, cap: 0, join: 1 }), t, { lit: 0, dust: 0, glow: .6, a: .9 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; ctx.save(); ctx.rotate(a); const p = new Path2D(); p.roundRect(-20, -282, 40, 82, 8); E.lightShape(ctx, p, t, { lit: 0, dust: 0, glow: .4, a: .7 }); ctx.restore(); }
  ctx.save(); ctx.rotate(rt);
  const hot = smooth(span(t, A.magnets - .1, A.magnets + .5)), fly = (i) => span(t, A.two + i * .09, A.two + .8 + i * .09);
  for (let i = 0; i < SEG; i++) if (fly(i) <= 0) E.lightShape(ctx, segPath(i), t, { lit: hot > .5 ? 1 : 0, dust: hot > .5 ? 1 : 0, glow: .7 + .6 * hot, seed: 80 + i });
  const sh = new Path2D(); sh.arc(0, 0, 50, 0, 6.29); E.lightShape(ctx, sh, t, { lit: 0, dust: 0, glow: .5 });
  ctx.restore();
  ctx.restore();
  // the knee cap opening: two dark halves slide apart (the section opens)
  if (op < 1) { const rg = new Path2D(); rg.arc(0, 0, rr, 0, 6.29); E.lightShape(ctx, rg.stroke({ width: 10, cap: 0, join: 1 }), t, { lit: 1, dust: 0, glow: .8, a: 1 - op }); }
  const la = span(t, A.magnets + .1, A.magnets + .6) * (1 - smooth(span(t, A.thrown - .5, A.thrown)));
  if (la > 0) { E.trail(ctx, [[-90, 150, 2], [-150, 330, 2], [-150, 385, 2]], la, { spark: false, a: .8 }); wipe(ctx, 'RARE-EARTH MAGNETS', -175, 440, la, { size: 42, glow: false, col: P.halo2, spacing: .1, weight: 700 }); }
  // the line down into the ground ("from rare earths")
  const ld = span(t, A.earths - .3, A.earths + .7) * (1 - smooth(span(t, A.two, A.two + .4)));
  if (ld > 0) E.trail(ctx, [[60, 170, 3], [90, 700, 3], [100, 2100, 3]], ld, { w: 3 });
}
function bars(ctx, t) {
  const sink = smooth(span(t, A.thrown + .1, A.those + .4)) * 1400 + smooth(span(t, A.less - .3, A.less + .7)) * 600, lab = 1 - smooth(span(t, A.thrown - .5, A.thrown));
  if (t < A.two || t > A.less + .8) return;
  ctx.save(); ctx.translate(0, sink);
  E.trail(ctx, [[BAR.x0 - 70, BAR.base, 2], [BAR.x1 + BAR.w + 70, BAR.base, 2]], expoOut(span(t, A.two - .1, A.two + .5)), { spark: false, a: .8 });
  // the eight magnet segments fly out of the motor and stack into the robot's bar (2 kg); the range up to 4 kg as a dotted outline
  for (let i = 0; i < SEG; i++) {
    const k = span(t, A.two + i * .09, A.two + .8 + i * .09); if (k <= 0) continue;
    const e = quartIO(k), am = (i + .5) / SEG * 6.283 + t * .5, from = [Math.cos(am) * 150, Math.sin(am) * 150 - sink], [bx, by] = blockPos(i);
    const x = lerp(from[0], bx + BAR.w / 2, e), y = lerp(from[1], by, e) - Math.sin(Math.PI * e) * 160, hh = 2 * BAR.kg / SEG - 6;
    const p = new Path2D(); p.roundRect(x - lerp(30, BAR.w / 2, e), y - lerp(20, hh / 2, e), lerp(60, BAR.w, e), lerp(40, hh, e), 6); E.lightShape(ctx, p, t, { lit: 1, dust: 0, glow: .8, seed: 90 + i });
  }
  const rg = smooth(span(t, A.kg - .2, A.kg + .5));
  if (rg > 0) { ctx.save(); ctx.setLineDash([3, 14]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .8 * rg); ctx.lineWidth = 4; const y2 = BAR.base - 2 * BAR.kg, y4 = BAR.base - 4 * BAR.kg * lerp(.5, 1, rg); ctx.beginPath(); ctx.moveTo(BAR.x0, y2); ctx.lineTo(BAR.x0, y4); ctx.lineTo(BAR.x0 + BAR.w, y4); ctx.lineTo(BAR.x0 + BAR.w, y2); ctx.stroke(); ctx.restore(); }
  writeOn(ctx, '2–4 KG', BAR.x0 + BAR.w / 2, BAR.base - 4 * BAR.kg - 40, span(t, A.kg - .1, A.kg + .5) * lab, { serif: true, size: 120, align: 'center' });
  mark(ctx, 'robot', BAR.x0 + BAR.w / 2, BAR.base + 90, 120, t, { lit: 0, u: span(t, A.two, A.two + .6) * lab, glow: .8 });
  // the electric car's bar: about half
  const ev = expoOut(span(t, A.twice - .15, A.twice + .7));
  if (ev > 0) { const h = 1.4 * BAR.kg * ev, p = new Path2D(); p.roundRect(BAR.x1, BAR.base - h, BAR.w, h, [10, 10, 0, 0]); E.lightShape(ctx, p, t, { lit: 1, seed: 97, glow: .8, cy: -.4 }); }
  writeOn(ctx, '~1.4 KG', BAR.x1 + BAR.w / 2, BAR.base - 1.4 * BAR.kg - 40, span(t, A.twice + .2, A.twice + .8) * lab, { serif: true, size: 120, align: 'center' });
  mark(ctx, 'car', BAR.x1 + BAR.w / 2, BAR.base + 90, 130, t, { lit: 0, u: span(t, A.twice, A.twice + .6) * lab, glow: .8 });
  wipe(ctx, 'ABOUT 2× AN ELECTRIC CAR', (BAR.x0 + BAR.x1 + BAR.w) / 2, BAR.base + 172, span(t, A.about + .1, A.about + .6) * lab, { size: 40, align: 'center', glow: false, col: P.halo2, spacing: .1, weight: 700 });
  wipe(ctx, '2–4 KG RARE-EARTH MAGNETS PER ROBOT · FAI', (BAR.x0 + BAR.x1 + BAR.w) / 2, BAR.base + 220, span(t, A.about + .5, A.about + 1.0) * lab, { size: 26, align: 'center', glow: false, col: P.halo2, spacing: .1 });
  ctx.restore();
}
// the bin under the lantern: an old robot falls in, the magnets sink in; nothing comes back
const BIN = { cx: 720, top: 900, w: 780, h: 330 };
function bin(ctx, t) {
  const g = smooth(span(t, A.thrown - .7, A.thrown)), lookDown = smooth(span(t, A.less - .3, A.less + .7));
  if (g <= 0 || lookDown >= 1) return;
  const y0 = BIN.top + (1 - g) * 500 + lookDown * 600;
  // the old robot: tumbles in from above
  const fk = span(t, A.thrown - .1, A.thrown + .6);
  if (fk > 0) { const e = expoIn(fk) , y = lerp(-500, y0 + 120, e); ctx.save(); ctx.beginPath(); ctx.rect(-2000, -3000, 5000, y0 + 3000 + 40); ctx.clip(); ctx.translate(BIN.cx - 120, y); ctx.rotate(lerp(-.3, 1.2, e)); E.robot(ctx, 0, 0, 420, { dir: 1, light: 1, rim: P.blue0, body: P.night1 }); ctx.restore(); }
  // a magnet that tries to come back up on "never come back" and sinks again
  const bk = env(t, A.never - .1, A.never + .4, A.back, A.back + .5);
  if (bk > 0) { const p = new Path2D(); p.roundRect(BIN.cx + 140, y0 - 30 - 90 * bk, 120, 32, 6); E.lightShape(ctx, p, t, { lit: 1, dust: 0, glow: .8 }); }
  // the bin body (front), its rim catches the lantern light
  ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + BIN.h, [[0, mixHex(P.night1, P.ind0, .4)], [1, P.night0]]);
  ctx.beginPath(); ctx.moveTo(BIN.cx - BIN.w / 2, y0); ctx.lineTo(BIN.cx + BIN.w / 2, y0); ctx.lineTo(BIN.cx + BIN.w / 2 - 40, y0 + BIN.h); ctx.lineTo(BIN.cx - BIN.w / 2 + 40, y0 + BIN.h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 3; for (const f of [.25, .5, .75]) { ctx.beginPath(); ctx.moveTo(BIN.cx - BIN.w / 2 + 20 + f * (BIN.w - 40), y0 + 30); ctx.lineTo(BIN.cx - BIN.w / 2 + 30 + f * (BIN.w - 60), y0 + BIN.h - 20); ctx.stroke(); }
  if (lookDown <= 0) { const rim = new Path2D(); rim.roundRect(BIN.cx - BIN.w / 2 - 10, y0 - 12, BIN.w + 20, 24, 12); E.lightShape(ctx, rim, t, { lit: 0, dust: 0, glow: .6 }); }
}
// the rim of the bin becomes the recycling ring: < 1 %; then the day circle with the battery; a few hours drain
const RC = [720, 900], RR = 260;
function ring(ctx, t) {
  const k = smooth(span(t, A.less - .3, A.less + .6)); if (k <= 0) return;
  const w = lerp(BIN.w + 20, RR * 2, k), h = lerp(24, RR * 2, k), cy = lerp(BIN.top, RC[1], k), rr = lerp(12, RR, k);
  const o = new Path2D(); o.roundRect(RC[0] - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2));
  E.lightShape(ctx, o.stroke({ width: lerp(24, 30, k), cap: 0, join: 1 }), t, { lit: 0, dust: 0, glow: .7, a: .9 });
  if (k < 1) return;
  // < 1 %: a hair-thin warm sliver of the ring
  const one = span(t, A.one - .1, A.one + .5), day = smooth(span(t, A.battery - .2, A.battery + .6));
  if (one > 0) { const p = new Path2D(); p.arc(RC[0], RC[1], RR, -Math.PI / 2, -Math.PI / 2 + .0628 * expoOut(one)); E.lightShape(ctx, p.stroke({ width: 30, cap: 0, join: 1 }), t, { lit: 1, dust: 0, glow: 1.4 }); }
  const out = 1 - smooth(span(t, A.battery - .4, A.battery + .1));
  writeOn(ctx, '< 1 %', RC[0], RC[1] + 48, span(t, A.one - .2, A.one + .4) * out, { serif: true, size: 150, align: 'center' });
  wipe(ctx, 'OF RARE EARTHS RECYCLED', RC[0], RC[1] + RR + 90, span(t, A.recycled - .4, A.recycled + .2) * out, { size: 40, align: 'center', glow: false, col: P.halo2, spacing: .1, weight: 700 });
  wipe(ctx, 'IEA', RC[0], RC[1] + RR + 136, span(t, A.recycled - .2, A.recycled + .3) * out, { size: 26, align: 'center', glow: false, col: P.halo2, spacing: .14 });
  // the day: 24 ticks grow on the ring, a battery in the middle; A FEW HOURS (a warm arc) that drains; refilled by the pulses
  if (day > 0) {
    for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283 - Math.PI / 2, l = (i % 6 ? 18 : 34) * expoOut(span(day, i / 40, i / 40 + .4)); ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = i % 6 ? 3 : 5; ctx.beginPath(); ctx.moveTo(RC[0] + Math.cos(a) * (RR - 30), RC[1] + Math.sin(a) * (RR - 30)); ctx.lineTo(RC[0] + Math.cos(a) * (RR - 30 - l), RC[1] + Math.sin(a) * (RR - 30 - l)); ctx.stroke(); }
    const fill = level(t), lvl = fill * smooth(span(t, A.battery, A.battery + .5));
    mark(ctx, 'battery', RC[0], RC[1], 230, t, { lit: 0, u: span(t, A.battery - .1, A.battery + .5), level: Math.max(.02, Math.round(lvl * 40) / 40), glow: .7 });
    if (lvl > .01) { const p = new Path2D(); p.arc(RC[0], RC[1], RR, -Math.PI / 2, -Math.PI / 2 + 6.283 * 3 / 24 * lvl); E.lightShape(ctx, p.stroke({ width: 30, cap: 0, join: 1 }), t, { lit: 1, dust: 0, glow: 1.1 }); }
    const fa = span(t, A.hours - .3, A.hours + .3) * (1 - smooth(span(t, A.plus - .2, A.plus + .3)));
    wipe(ctx, 'A FEW HOURS', RC[0] + 140, RC[1] - RR - 50, fa, { size: 42, glow: false, col: P.halo2, spacing: .1, weight: 700 });
  }
}
// battery level 0..1: full when it appears, drains after "few hours", three pulses refill it a little each "every day"
const PULSES = () => [A.power - .15, A.power + .45, A.day - .35];
function level(t) {
  let v = 1 - .9 * smooth(span(t, A.hours + .1, A.so - .1));
  for (const p of PULSES()) { const arrive = p + .55; v += .3 * smooth(span(t, arrive, arrive + .25)); v -= .3 * smooth(span(t, arrive + .3, arrive + .55)); }
  return clamp(v);
}
// the cable from the battery to the right, along the ground to the power line and the data centre
const CAB = [[RC[0] + 100, RC[1] + 60], [RC[0] + 330, RC[1] + 330], [1500, 1230], [2050, 1230], [2350, 1080]];
const DC = [2350, 960];
function cable(ctx, t) {
  const u = span(t, A.so - .2, A.power + .2); if (u <= 0) return;
  const pts = E.catmull(CAB.map(([x, y]) => [x, y, 5]), 14), out = smooth(span(t, A.picture + .4, A.billion + .8));
  ctx.save(); ctx.strokeStyle = P.night0; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); const n = Math.max(2, Math.floor(u * pts.length)); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
  ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  // pulses of light from the right into the battery (each a day); on "thinking" they run on into the data centre
  const at = (f) => { const i = clamp(f, 0, .999) * (pts.length - 1), j = Math.floor(i), q = i - j; return [lerp(pts[j][0], pts[j + 1][0], q), lerp(pts[j][1], pts[j + 1][1], q)]; };
  for (const p of PULSES()) { const k = span(t, p, p + .6); if (k <= 0 || k >= 1) continue; const [x, y] = at(1 - k); E.halo(ctx, x, y, 70, .9); }
  if (t > A.plus) for (let i = 0; i < 3; i++) { const k = ((t - A.plus) * .7 + i / 3) % 1; const [x, y] = at(lerp(.75, 1, k)); E.halo(ctx, x, y, 50, .7 * (1 - out), P.blue0, P.cream); }
  // the data centre: cold, steam lit from below
  const dk = span(t, A.plus - .2, A.centers + .4), th = smooth(span(t, A.thinking - .4, A.thinking + .2));
  if (dk > 0) { mark(ctx, 'datacenter', DC[0], DC[1], 260, t, { lit: 0, u: dk, glow: .9 + th }); if (th > 0) { E.halo(ctx, DC[0], DC[1] - 40, 380, .3 * th, P.blue0, P.blue0); for (let i = 0; i < 3; i++) { const ph = (t * .3 + i / 3) % 1; E.halo(ctx, DC[0] - 60 + i * 60, DC[1] - 170 - ph * 220, 50 + ph * 40, .25 * th * (1 - ph), P.blue0, COOLC); } } }
}

// ---------- the mountain of e-waste on the rim (α .55, KZ 10): you, a drawer of phones, a robot your size ----------
const MKZ = 10;
const MTN = (() => { const r = prng(77), pts = []; for (let i = 0; i <= 40; i++) { const x = -820 + i * 32; const h = 600 * Math.pow(Math.max(0, 1 - Math.abs(x + 180) / 640), 1.15) + (r() - .5) * 26; pts.push([x, -Math.max(0, h)]); } const parts = []; for (let i = 0; i < 140; i++) parts.push([-760 + r() * 1100, -r() * 560, ['phone', 'robot', 'box', 'battery'][Math.floor(r() * 4)], .6 + r() * .8, r() * 6.28]); return { pts, parts }; })();
function mountain(ctx, t, s, psi) {
  if (t < A.replaced - .5) return;
  const RK = R * MKZ, rise = expoOut(span(t, A.years - .2, A.mountain + .3));
  limbFrame(ctx, ALPHA.mount, MKZ, psi, () => {
    // the pile: rises out of the horizon
    ctx.save(); ctx.translate(0, 620 * (1 - rise));
    const p = new Path2D(); p.moveTo(-860, 200); for (const [x, y] of MTN.pts) p.lineTo(x, y + groundY(x, RK)); p.lineTo(500, 200); p.closePath();
    ctx.fillStyle = lin(ctx, 0, -600, 0, 100, [[0, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]); ctx.fill(p);
    ctx.save(); ctx.clip(p);
    for (const [x, y, nm, sc, a] of MTN.parts) { ctx.save(); ctx.translate(x, y + groundY(x, RK)); ctx.rotate(a); ctx.strokeStyle = rgba(COOLC, .3); ctx.lineWidth = 2; const q = new Path2D(); q.addPath(nm === 'robot' || nm === 'battery' ? kitPath(nm) : markPath(nm), { a: 40 * sc, b: 0, c: 0, d: 40 * sc, e: 0, f: 0 }); ctx.stroke(q); ctx.restore(); }
    ctx.restore();
    ctx.strokeStyle = rgba(mixHex(P.blue2, P.cream, .4), .7); ctx.lineWidth = 2.5; ctx.beginPath(); MTN.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + groundY(x, RK)) : ctx.moveTo(x, y + groundY(x, RK)))); ctx.stroke();
    ctx.restore();
    // you, at its foot; a drawer of old phones; a robot your size
    const dk = smooth(span(t, A.phone - .6, A.phone + .1));
    const wk = span(t, A.years - .7, A.mountain + .3), dx = lerp(760, 330, sineIO(wk));
    onGround(ctx, dx, RK, () => {
      E.du(ctx, 0, 0, 120, wk < 1 ? { pose: 'walk', walk: -dx / 120 * 4.2, dir: -1, light: 1 } : { dir: -1, light: 1, look: .5 });
    });
    onGround(ctx, 210, RK, () => {
      const u = span(t, A.phone - .2, A.drawer + .1);
      ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(-46, -26, 92, 26); ctx.fillStyle = P.night0; ctx.fillRect(-40, -22, 80, 6);
      for (let i = 0; i < 4; i++) mark(ctx, 'phone', -30 + i * 20, -28, 30, t, { lit: 0, u: span(u, i * .15, i * .15 + .5), glow: .6, rot: -.2 + i * .12 });
    });
    onGround(ctx, 470, RK, () => {
      ctx.save(); ctx.translate(0, 620 * (1 - rise)); const ro = ROBOT2(t); if (ro?.sx != null) ctx.scale(ro.sx, 1); E.robot(ctx, 0, 0, 124, { dir: -1, light: 1, rim: mixHex(P.blue2, P.cream, .3), body: P.night1, ...(ro?.o || {}) }); ctx.restore();
      const hl = smooth(span(t, A.person - .2, A.person + .4)) * (1 - smooth(span(t, A.remember + .3, A.forecast)));
      if (hl > 0) { ctx.save(); ctx.setLineDash([2, 9]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.core1, .85 * hl); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-170, -122); ctx.lineTo(lerp(-170, 16, hl), -122); ctx.stroke(); ctx.restore(); }
    });
    void dk;
  });
}
const KP = new Map();
function kitPath(nm) { if (!KP.has(nm)) { MEAS.save(); MEAS.globalAlpha = 0; KP.set(nm, E.icon(MEAS, nm, 0, 0, 1, 0, { dust: 0 })); MEAS.restore(); } return KP.get(nm); }

// ---------- the bank on the rim (α 1.1, KZ 4); ★ sales above the horizon, mines mirrored below ----------
export const BKZ = 18, TWR = { x: 300, w: 84, h: 520 };
const SALES = (() => { const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24, x = lerp(-760, TWR.x - 30, u); pts.push([x, -(30 + 420 * Math.pow(u, 2.2))]); } return pts; })();
function bank(ctx, t, s, psi, under) {
  if (t < A.remember - 1) return;
  const RK = R * BKZ;
  limbFrame(ctx, ALPHA.bank, BKZ, psi, () => {
    if (under) {   // ---- inside the planet: the section of the ground, the mirrored line, the holes ----
      const open = smooth(span(t, A.pcounts - .2, A.pcounts + .8)) * (1 - smooth(span(t, A.end + .4, A.c07 - .4)));
      if (open <= 0) return;
      const depth = 720 * open;
      ctx.save(); ctx.beginPath(); ctx.rect(-1450, -20, 2900, depth + 20); ctx.clip();
      // layers: bands concentric with the planet
      [[0, mixHex(P.ind0, P.night1, .3)], [70, P.night1], [170, mixHex(P.night1, P.ind0, .5)], [300, P.night0], [460, mixHex(P.night0, P.ind0, .4)]].forEach(([d, col]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, RK, Math.max(1, RK - d), 0, 6.29); ctx.fill(); });
      ctx.strokeStyle = rgba(P.halo1, .45); ctx.lineWidth = 3; for (const [x0, y0, x1, y1] of [[-600, 120, -380, 210], [-200, 260, 60, 330], [180, 140, 420, 230], [-420, 420, -160, 520]]) { ctx.beginPath(); ctx.moveTo(x0, y0 + groundY(x0, RK)); ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 - 40, x1, y1 + groundY(x1, RK)); ctx.stroke(); }
      // the mirrored line: each tick a glowing hole
      const mu = span(t, A.pcounts + .1, A.minesB + .2);
      const mpts = SALES.map(([x, y]) => [x, groundY(x, RK) - y, 4]);
      E.trail(ctx, E.catmull(mpts, 6), mu, { w: 4 });
      SALES.forEach(([x, y], i) => { if (i % 2) return; const k = span(mu, i / 24 - .02, i / 24 + .1); if (k <= 0) return; const yy = groundY(x, RK) - y; ctx.save(); ctx.translate(x, yy); const p = new Path2D(); p.ellipse(0, 0, 20 * expoOut(k), 8 * expoOut(k), 0, 0, 6.29); E.glowFill(ctx, p, 14, .8, P.halo0); ctx.fillStyle = P.night0; ctx.fill(p); ctx.strokeStyle = rgba(P.core1, .9); ctx.lineWidth = 2.5; ctx.stroke(p); ctx.restore(); });
      wipe(ctx, 'MINES', -760, 600, span(t, A.minesB - .2, A.minesB + .3) * (1 - smooth(span(t, A.end + .3, A.end + .9))), { size: 52, glow: false, col: P.halo1, spacing: .16, weight: 700 });
      ctx.restore();
      return;
    }
    // ---- above the horizon: the tower, cold; the forecast label; the sales line with little robots ----
    onGround(ctx, TWR.x, RK, () => {
      const g = expoOut(span(t, A.remember - .6, A.forecast)), wl = smooth(span(t, A.bank - .2, A.bank + .5));
      ctx.fillStyle = mixHex(P.night1, P.ind0, .3); ctx.fillRect(-TWR.w / 2, -TWR.h * g, TWR.w, TWR.h * g); ctx.fillRect(-4, -TWR.h * g - 70 * g, 8, 70 * g);
      ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2; ctx.strokeRect(-TWR.w / 2, -TWR.h * g, TWR.w, TWR.h * g);
      const tw = TOWER_WARM(t); for (let r = 0; r < 18; r++) for (let c = 0; c < 3; c++) { const y = -TWR.h * g + 20 + r * 25; if (y > -14) continue; const on = tw > (r * 3 + c) / 54; ctx.fillStyle = rgba(on ? P.halo0 : COOLC, (.15 + .6 * Math.max(wl, on ? 1 : 0)) * (((r * 3 + c) * 7) % 5 ? 1 : .4)); ctx.fillRect(-TWR.w / 2 + 11 + c * 20, y, 12, 10); }
      if (wl > 0) E.halo(ctx, 0, -TWR.h * .6, 300, .18 * wl, P.blue0, P.blue0);
    });
    const la = span(t, A.forecast - .3, A.forecast + .3) * (1 - smooth(span(t, A.end + .2, A.end + .8)));
    wipe(ctx, 'FORECAST · MORGAN STANLEY', TWR.x + 80, -TWR.h - 10 + groundY(TWR.x, RK), la, { size: 44, glow: false, col: P.halo2, spacing: .12, weight: 700 });
    // ★ the sales line, dotted (it is a forecast), drawn to the tower; each tick a little robot
    const su = span(t, A.counts - .1, A.sales + .2), back = smooth(span(t, A.end + .3, A.c07 - .5));
    if (su > 0) {
      const pts = SALES.map(([x, y]) => [x, y + groundY(x, RK)]);
      const i1 = Math.floor(su * (1 - back) * (pts.length - 1));
      ctx.save(); ctx.setLineDash([3, 14]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i <= i1; i++) (i ? ctx.lineTo(...pts[i]) : ctx.moveTo(...pts[i])); ctx.stroke(); ctx.restore();
      if (su < 1) E.halo(ctx, pts[i1][0], pts[i1][1], 50, .7);
      pts.forEach(([x, y], i) => { if (i % 2 || i > i1) return; mark(ctx, 'robot', x, y - 32, 48, t, { lit: 0, u: span(su * (1 - back), i / 24, i / 24 + .15), glow: .8, dust: 0 }); });
      wipe(ctx, 'SALES', -760, -330, span(t, A.sales - .3, A.sales + .2) * (1 - back), { size: 52, glow: false, col: P.halo2, spacing: .16, weight: 700 });
    }
  });
}

// ---------- labels at the planet scale ----------
function planetLabels(ctx, t, s) {
  // BILL 2 · TO: THE PLANET (beside the globe, written by the trace)
  const bx = GC[0] + R + 70, by = GC[1] - 40, KZ = 1.55;
  ctx.save(); ctx.translate(bx, by); ctx.scale(1 / KZ, 1 / KZ);
  const bo = 1 - smooth(span(t, A.robot + .5, A.robot + 1.1));
  writeOn(ctx, 'BILL 2', 0, 0, span(t, A.bill - .1, A.bill + .5) * bo, { serif: true, size: 120 });
  writeOn(ctx, 'TO: THE PLANET', 4, 70, span(t, A.planet - .15, A.planet + .5) * bo, { size: 44, spacing: .16, weight: 700 });
  ctx.restore();
  // ~1 BILLION (forecast, dotted underline)
  const ba = span(t, A.billion - .1, A.billion + .5) * (1 - smooth(span(t, A.hole - 1.2, A.hole - .5)));
  if (ba > 0) {
    ctx.save(); ctx.translate(GC[0] + R + 60, GC[1] - 90); ctx.scale(1 / 1.75, 1 / 1.75);
    writeOn(ctx, '~1 BILLION', 0, 0, ba, { serif: true, size: 130 });
    wipe(ctx, 'IN USE BY 2050 · FORECAST', 4, 62, ba, { size: 34, glow: false, col: P.halo2, spacing: .12, weight: 700 });
    ctx.save(); ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .8 * ba); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(4, 86); ctx.lineTo(4 + 520 * expoOut(ba), 86); ctx.stroke(); ctx.restore();
    ctx.restore();
  }
}

// ---------- the whole planet world ----------
export function planetWorld(ctx, t, o = {}) {
  const { c, s } = o.cam || planetCam(t), m = morph(t), tau = tilt(t), psi = roll(t);
  if (o.starRot) {
    ctx.save(); ctx.translate(W / 2, -H * 2); ctx.rotate(o.starRot); ctx.translate(-W / 2, H * 2); farStars(ctx, t, o.starA ?? 1);
    ctx.beginPath(); ctx.rect(-W, -H, W * 3, H * 3); ctx.rect(0, 0, W, H); ctx.clip('evenodd'); E.stars(ctx, 93, 2070, t, [-W, -H, W * 3, H * 3], .8 * (o.starA ?? 1)); ctx.restore();
  } else farStars(ctx, t, o.starA ?? 1);
  E.card(ctx, c, ZP, () => {
    if (o.before) o.before(ctx, t, s, psi);
    // the pottery rings while they are still clay (top view; same picture as c05's last frame), then the globe
    if (m < 1) { ctx.save(); ctx.globalAlpha = 1 - m; potRings(ctx, t, { tilt: Math.PI / 2, k: 1 }, { wet: .5 }); ctx.restore(); }
    globeBody(ctx, t, s, m, tau, psi);
    bank(ctx, t, s, psi, true);
    lights(ctx, t, s, psi);
    mines(ctx, t, s, psi);
    // things standing on the rim: clipped to outside the globe (the planet hides what is below its horizon)
    ctx.save(); ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 2e5); ctx.arc(GC[0], GC[1], R, 0, 6.29); ctx.clip('evenodd');
    houseTop(ctx, t, s, psi); mountain(ctx, t, s, psi); bank(ctx, t, s, psi, false);
    ctx.restore();
    kneeChain(ctx, t, s, psi);
    planetLabels(ctx, t, s);
    if (o.extra) o.extra(ctx, t, s, psi);
  });
  return { c, s };
}
