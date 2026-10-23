// Film 6 · c08 · the night street (8.01–8.03): the plate's cream line is the kerb line; a street lamp (the one hero light), the pavement,
// the road, a glass sign panel at the back of the pavement (the pane), "you" under the lamp with an ember in the chest, a walker who
// stumbles and goes down; the flinch. World space = 1920×1080 at the plate's camera (identity): the kerb line is the plate's line.
// Copied from lib/handoff4.mjs linePlate (ground + line, so the first frame IS the plate) and from lib/f6_c03_world.mjs (quartIO, expoOut, hermite).
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, canvas } from '../engine.mjs';
import { F6, once, layer, ember } from './f6_kit.mjs';
import { cone, pool } from './art.mjs';
import { figure, walk, reachArm, handPos } from './figure.mjs';

const TAU = Math.PI * 2;
export const LINE_Y = 620;                                  // HAND['c07>c08'].o.y
export const LAMP = { x: 1120, top: 150, base: 612 };       // the street lamp: post from the pavement to its lantern
export const SIGN = { x: 1480, y: 394, w: 592, h: 333 };    // the glass panel (the pane) at the back of the pavement; bottom edge at 560, posts to the pavement
export const PAVE = { y0: 470, y1: LINE_Y };                // the pavement band; the kerb face below the line, the road below that
export const quartIO = (x) => (x = clamp(x), x < .5 ? 8 * x * x * x * x : 1 - 8 * Math.pow(1 - x, 4));
export const quartIn = (x) => (x = clamp(x), x * x * x * x);
export const expoOut = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const expoIn = (x) => (x = clamp(x), x <= 0 ? 0 : Math.pow(2, 10 * (x - 1)));
// cubic hermite through keys [[u, value, slope], …] (monotone u)
export function hermite(keys, u) {
  u = clamp(u); let i = 0; while (i < keys.length - 2 && keys[i + 1][0] <= u) i++;
  const [u0, v0, m0] = keys[i], [u1, v1, m1] = keys[i + 1], h = u1 - u0, s = (u - u0) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * v0 + (s3 - 2 * s2 + s) * h * m0 + (-2 * s3 + 3 * s2) * v1 + (s3 - s2) * h * m1;
}
export const worldBox = (m) => ({ x: -m.tx / m.k, y: -m.ty / m.k, w: W / m.k, h: H / m.k });

// ---------------------------------------------------------------- the plate (handoff4 linePlate, cream) as the ground of this world
// ground + the plate's radial haze + its drifting hatching, under the caller's (world) transform; B = the visible world box
export function plateGround(g, t, B) {
  g.fillStyle = '#0a0c22'; g.fillRect(B.x - 2, B.y - 2, B.w + 4, B.h + 4);
  const v = g.createRadialGradient(W / 2, LINE_Y, 0, W / 2, LINE_Y, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); g.fillStyle = v; g.fillRect(B.x - 2, B.y - 2, B.w + 4, B.h + 4);
  g.strokeStyle = 'rgba(160,150,220,.05)'; g.lineWidth = 1; g.beginPath();
  for (let k = -120; k < 220; k++) { const x = k * 34 + (t * 6) % 34; g.moveTo(x + 520 * 2000 / 1080, -2000); g.lineTo(x - 520 * 3000 / 1080, 3000); } g.stroke();
}
// the plate's line (cream): identical pixels at identity. o.a scales the light (the line stays), o.x0/x1 clip it to a stretch
export function kerbLine(g, t, o = {}) {
  const col = ['#e9dcc0', '#fffaf0'], y = LINE_Y, L = 1400, a = o.a ?? 1;
  g.save(); g.translate(W / 2, y + 2 * Math.sin(t * .9)); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  const br = .9 + .1 * Math.sin(t * 2.1);
  for (const [w, al, c] of [[26, .05, col[0]], [10, .14, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) { g.strokeStyle = rgba(c, al * a); g.lineWidth = w; g.beginPath(); g.moveTo(-L, 0); g.lineTo(L, 0); g.stroke(); }
  g.strokeStyle = rgba(col[1], .35 * a); g.lineWidth = 1; g.beginPath(); for (let x = -L; x < L; x += 9) { const h = 2 + 1.5 * Math.sin(x * .07 + t); g.moveTo(x, -h); g.lineTo(x + 3, h); } g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- the street's surfaces: light added onto the plate's ground (u = how far the
// world has come up out of the dark; at u 0 nothing is added, so the first frame stays the plate)
const FACADE = { y0: 150, y1: PAVE.y0 };
function slabJoints() {
  return once('c08joints', () => { const r = prng(808), out = []; let x = -900; while (x < 2900) { out.push(x); x += 95 + r() * 60; } return out; });
}
export function streetPlanes(g, t, u, B) {
  if (u <= 0) return;
  const lx = LAMP.x, ly = LAMP.top + 30;
  g.save();
  // the building behind the pavement: a dark wall, a little lighter than the night, the lamp's light on it; dark window recesses
  g.globalCompositeOperation = 'lighter';
  const fg = g.createLinearGradient(0, FACADE.y0, 0, FACADE.y1); fg.addColorStop(0, rgba('#0c1226', .35 * u)); fg.addColorStop(1, rgba('#182038', .75 * u)); g.fillStyle = fg; g.fillRect(B.x, FACADE.y0, B.w, FACADE.y1 - FACADE.y0);
  const wl = g.createRadialGradient(lx, ly, 0, lx, ly, 900); wl.addColorStop(0, rgba(F6.amber, .22 * u)); wl.addColorStop(.45, rgba(F6.amberDeep, .07 * u)); wl.addColorStop(1, rgba(F6.amberDeep, 0)); g.fillStyle = wl; g.fillRect(B.x, FACADE.y0 - 100, B.w, FACADE.y1 - FACADE.y0 + 100);
  // the pavement: slate, lit from the lamp
  const pg = g.createLinearGradient(0, PAVE.y0, 0, PAVE.y1); pg.addColorStop(0, rgba('#1a2140', .6 * u)); pg.addColorStop(1, rgba('#2a3358', .95 * u)); g.fillStyle = pg; g.fillRect(B.x, PAVE.y0, B.w, PAVE.y1 - PAVE.y0);
  g.restore();
  // shadows (not light): the building's base line, the window recesses, the slab joints, the kerb face, the road's dark asphalt
  g.save();
  g.fillStyle = `rgba(0,0,0,${.35 * u})`; g.fillRect(B.x, FACADE.y1 - 3, B.w, 3);
  const r = prng(77);
  for (let x = -600; x < 2800; x += 170) { const w = 60 + r() * 30, h = 90 + r() * 40, y = FACADE.y0 + 40 + r() * 60; for (let row = 0; row < 2; row++) { const yy = y + row * 140; if (yy + h > FACADE.y1 - 30) continue; g.fillStyle = `rgba(2,3,10,${.5 * u})`; g.fillRect(x, yy, w, h); g.fillStyle = `rgba(80,90,130,${.12 * u})`; g.fillRect(x, yy, w, 2); } }
  g.strokeStyle = `rgba(4,5,14,${.45 * u})`; g.lineWidth = 1.2; g.beginPath();
  for (const x of slabJoints()) { g.moveTo(x + 6, PAVE.y0); g.lineTo(x, PAVE.y1); }
  g.moveTo(B.x, PAVE.y0 + 62); g.lineTo(B.x + B.w, PAVE.y0 + 62); g.moveTo(B.x, PAVE.y0 + 118); g.lineTo(B.x + B.w, PAVE.y0 + 118); g.stroke();
  g.fillStyle = `rgba(0,0,0,${.5 * u})`; g.fillRect(B.x, LINE_Y + 1, B.w, 13);                       // the kerb face
  const rg = g.createLinearGradient(0, LINE_Y + 14, 0, H + 200); rg.addColorStop(0, `rgba(3,4,12,${.5 * u})`); rg.addColorStop(1, `rgba(3,4,12,${.15 * u})`); g.fillStyle = rg; g.fillRect(B.x, LINE_Y + 14, B.w, B.y + B.h - LINE_Y + 200);
  g.restore();
}
// the lamp's light: the cone onto the pavement (cached), the pool, its wet reflection on the road; all additive, scaled by u
const LIGHTS = once('c08lights', () => {
  const [cc, cg] = canvas(W, H), c1 = cone(cg, LAMP.x, LAMP.top + 34, { dir: 0, spread: .42, len: 540, col: F6.amber, a: .5, k: .6, seed: 3, soft: .3 });
  const [pc, pg] = canvas(W, H), p1 = pool(pg, LAMP.x, PAVE.y1 - 20, 420, 70, { col: F6.amber, a: .45, k: .6, seed: 5 });
  return { cone: c1, pool: p1 };
});
export function lampLight(g, t, u, br = 1) {
  if (u <= 0) return;
  g.save(); g.globalCompositeOperation = 'lighter';
  g.globalAlpha = u * (.85 + .15 * br); g.drawImage(LIGHTS.cone, 0, 0); g.globalAlpha = u * (.8 + .2 * br); g.drawImage(LIGHTS.pool, 0, 0); g.globalAlpha = 1;
  // the reflection in the road: a long soft streak under the lamp, breaking up with distance
  const sg = g.createLinearGradient(0, LINE_Y + 14, 0, LINE_Y + 420); sg.addColorStop(0, rgba(F6.amber, .22 * u)); sg.addColorStop(.5, rgba(F6.amber, .08 * u)); sg.addColorStop(1, rgba(F6.amber, 0));
  g.fillStyle = sg; g.save(); g.translate(LAMP.x, LINE_Y + 14); g.scale(1, 1); g.beginPath(); g.moveTo(-26, 0); g.lineTo(26, 0); g.lineTo(44, 420); g.lineTo(-44, 420); g.closePath(); g.fill(); g.restore();
  g.restore();
}
// the lamp post + lantern (an object: rises with the others); the bulb is the ember
export function lampPost(g, t, o = {}) {
  const x = LAMP.x, y0 = LAMP.base, y1 = LAMP.top;
  g.save();
  g.fillStyle = 'rgba(3,3,10,.5)'; g.beginPath(); g.ellipse(x + 4, y0 + 3, 30, 8, 0, 0, TAU); g.fill();
  const bg = g.createLinearGradient(x - 10, 0, x + 10, 0); bg.addColorStop(0, '#141a2c'); bg.addColorStop(.5, '#2a3350'); bg.addColorStop(1, '#0d1120');
  g.fillStyle = bg; g.beginPath(); g.roundRect(x - 9, y1 + 40, 18, y0 - y1 - 40, 3); g.fill();
  g.fillStyle = '#1b2236'; g.beginPath(); g.ellipse(x, y0 - 2, 22, 6, 0, 0, TAU); g.fill(); g.fillRect(x - 14, y0 - 30, 28, 28);
  // the lantern: a small dark housing with a glass body; the bulb (ember) inside
  g.fillStyle = '#0f1424'; g.beginPath(); g.moveTo(x - 30, y1 + 10); g.lineTo(x + 30, y1 + 10); g.lineTo(x + 22, y1 - 10); g.lineTo(x - 22, y1 - 10); g.closePath(); g.fill();
  g.fillStyle = '#1a2136'; g.fillRect(x - 5, y1 - 22, 10, 12);
  g.restore();
  const E = ember(g, t, { x, y: y1 + 44, kind: 'bulb', s: 1.25, r: 190, a: o.a ?? 1 });
  g.save(); g.strokeStyle = 'rgba(200,220,255,.18)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 30, y1 + 10); g.lineTo(x - 24, y1 + 54); g.lineTo(x + 24, y1 + 54); g.lineTo(x + 30, y1 + 10); g.stroke(); g.restore();
  return E;
}
// the sign panel's posts and its top rail (the pane itself is drawn by the scene, so it can turn)
export function signPosts(g, t, o = {}) {
  const S = SIGN, yb = S.y + S.h / 2, cy = Math.max(.08, Math.cos(o.yaw || 0));
  g.save();
  g.fillStyle = 'rgba(3,3,10,.45)'; g.beginPath(); g.ellipse(S.x + 6, LAMP.base + 2, S.w * .5 * cy + 20, 7, 0, 0, TAU); g.fill();
  for (const sx of [S.x - (S.w / 2 - 26) * cy, S.x + (S.w / 2 - 26) * cy]) { g.fillStyle = '#161c30'; g.fillRect(sx - 7, yb - 4, 14, LAMP.base - yb + 4); g.fillStyle = '#0d1120'; g.fillRect(sx - 12, LAMP.base - 6, 24, 6); }
  g.fillStyle = '#1a2136'; g.fillRect(S.x - S.w / 2 * cy - 6, yb - 2, S.w * cy + 12, 6);
  g.restore();
}

// ---------------------------------------------------------------- the people
export const BY = { x: 560, s: 2.0, seed: 3 };             // "you": under the lamp, facing the walker (right)
export const WK = { s: 2.0, seed: 6, x0: 950, v: 152 };   // the walker: comes from the right at 152 px/s, stumbles at x0
const feetY = LAMP.base;
const hipStand = (s) => feetY - 90 * s;
// the walker's state at t: { x, y (hip), pose, flip }
export function walkerAt(t, K) {
  const { tTrip, tLand } = K, s = WK.s;
  if (t < tTrip) { const x = WK.x0 + WK.v * (tTrip - t), pose = walk(TAU * (t - tTrip) * 1.0 + 1.2); return { x, y: hipStand(s), pose: { ...pose, lean: pose.lean + .02 }, flip: true }; }
  // the stumble: the front foot catches, the body pitches forward, then goes down on the knees
  const u = lin(tTrip, tLand, t), pitch = quartIO(clamp(u / .35)), drop = quartIn(clamp((u - .2) / .8)), settle = eout(lin(tLand, tLand + .45, t));
  const w0 = walk(1.2);
  const kneel = { hip: [.16, .32], kn: [1.78, 1.92], lean: .34, sh: [.72, .6], el: [1.2, 1.12], head: .42, hands: ['open', 'relaxed'], ft: [0, 0], dy: 0, lock: [true, true] };
  const pitchP = { hip: [.62, -.25], kn: [.18, .32], lean: .55, sh: [1.35, 1.1], el: [.12, .22], head: .18, hands: ['open', 'open'], ft: [.3, -.5], dy: 0, lock: [true, true] };
  const mixP = (A, B, k) => ({ hip: [mix(A.hip[0], B.hip[0], k), mix(A.hip[1], B.hip[1], k)], kn: [mix(A.kn[0], B.kn[0], k), mix(A.kn[1], B.kn[1], k)], lean: mix(A.lean, B.lean, k), sh: [mix(A.sh[0], B.sh[0], k), mix(A.sh[1], B.sh[1], k)], el: [mix(A.el[0], B.el[0], k), mix(A.el[1], B.el[1], k)], head: mix(A.head, B.head, k), ft: [mix(A.ft ? A.ft[0] : 0, B.ft[0], k), mix(A.ft ? A.ft[1] : 0, B.ft[1], k)], dy: 0, hands: B.hands, lock: [true, true] });
  let pose = mixP({ ...w0, hands: ['relaxed', 'relaxed'] }, pitchP, pitch);
  pose = mixP(pose, kneel, drop);
  // after the landing: a hunch, then the head lifts slowly toward the one who comes
  const hunch = Math.sin(Math.PI * clamp((t - tLand) / .5)) * .12, lift = eout(lin(K.tLift, K.tLift + 1.2, t));
  pose.lean += hunch * .6; pose.head += hunch - .3 * lift; pose.lean -= .08 * lift;
  const x = WK.x0 - 72 * eout(clamp(u * 1.2)), y = mix(hipStand(s), feetY - 44.4 * s, drop) + 3 * s * (1 - settle) * (drop >= 1 ? 1 : 0);
  return { x, y, pose, flip: true };
}
// "you": standing under the lamp; the flinch (a recoil, the hand to the chest), then the steps toward the fallen one and the bend down
export function bystanderAt(t, K, fallen) {
  const s = BY.s, { tFlinch, tStep, tBend } = K;
  const stand = { hip: [.05, -.05], kn: [0, 0], lean: .02, sh: [.22, .1], el: [.35, .3], head: .04, hands: ['relaxed', 'relaxed'] };
  const flinch = { hip: [-.08, .12], kn: [.08, .06], lean: -.12, sh: [.78, .3], el: [1.42, .55], head: -.2, hands: ['open', 'relaxed'] };
  const fIn = expoOut(lin(tFlinch, tFlinch + .13, t)), fOut = quartIO(lin(tFlinch + .55, tFlinch + 1.25, t)), f = fIn * (1 - fOut);
  const mixP = (A, B, k) => ({ hip: [mix(A.hip[0], B.hip[0], k), mix(A.hip[1], B.hip[1], k)], kn: [mix(A.kn[0], B.kn[0], k), mix(A.kn[1], B.kn[1], k)], lean: mix(A.lean, B.lean, k), sh: [mix(A.sh[0], B.sh[0], k), mix(A.sh[1], B.sh[1], k)], el: [mix(A.el[0], B.el[0], k), mix(A.el[1], B.el[1], k)], head: mix(A.head, B.head, k), hands: k > .5 ? B.hands : A.hands });
  let pose = mixP(stand, flinch, f), x = BY.x, y = hipStand(s), lock = f > .02 ? [true, true] : undefined;
  // the steps: two real steps toward the fallen one (0.9 s), the arms swing little
  const uS = lin(tStep, tStep + .95, t);
  if (uS > 0) {
    const wk = walk(TAU * uS * 1.0), stop = quartIO(lin(tStep + .8, tStep + 1.15, t));
    const walkP = { hip: wk.hip, kn: wk.kn, lean: wk.lean + .05, sh: [wk.sh[0] * .6, wk.sh[1] * .6], el: [wk.el[0], wk.el[1]], head: wk.head + .1, ft: wk.ft, dy: wk.dy, hands: ['relaxed', 'relaxed'] };
    const standP = { hip: [.08, -.08], kn: [.02, .02], lean: .1, sh: [.3, .2], el: [.45, .4], head: .12, ft: [0, 0], dy: 0, hands: ['relaxed', 'relaxed'] };
    pose = mixP(walkP, standP, stop); pose.ft = [mix(wk.ft[0], 0, stop), mix(wk.ft[1], 0, stop)]; pose.dy = wk.dy * (1 - stop);
    x = BY.x + (fallen.x - 150 - BY.x) * quartIO(uS);
    lock = [true, true];
  }
  // the bend: lean down, the front hand to the fallen one's shoulder
  const uB = quartIO(lin(tBend, tBend + .8, t));
  if (uB > 0) {
    const o = { t, seed: BY.seed }, bent = { ...pose, lean: mix(pose.lean, .42, uB), head: mix(pose.head, .28, uB), hip: [mix(pose.hip[0], .22, uB), mix(pose.hip[1], -.1, uB)], kn: [mix(pose.kn[0], .22, uB), pose.kn[1]] };
    const target = [fallen.x - 2 * s, fallen.y - 56 * s];
    const r = reachArm(x, y, s, bent, 0, false, o, target);
    pose = { ...bent, sh: [mix(bent.sh[0], r.sh, uB), mix(bent.sh[1], .5, uB)], el: [mix(bent.el[0], r.el, uB), mix(bent.el[1], .6, uB)], hands: ['open', 'relaxed'] };
    lock = [true, true];
  }
  if (lock) pose.lock = lock;
  return { x, y, pose, flip: false, f };
}
// the warmth in the chest of "you" (behind the coat): the ember, breathing; the flinch makes it flare
export function chestPoint(B, s) { const c = Math.cos(B.pose.lean || 0), sn = Math.sin(B.pose.lean || 0); const lx = 9, ly = -50; return [B.x + (lx * c - ly * sn) * s, B.y + (lx * sn + ly * c) * s + (B.pose.dy || 0) * s]; }
