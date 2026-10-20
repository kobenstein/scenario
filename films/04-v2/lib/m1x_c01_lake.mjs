// C01 (Film 4 minute 1) · 1.07 + 1.08 the lake take: ONE continuous shot from the gold light (15.65) to the wall (1.09). Owner c01.
//   The gold light (the map's landing glow) shrinks into the low morning sun over a lake. A garden on the shore, two tall trees, a
//   hammock between them, you in it ("Finally rest."): a real sling (taut ropes to the gathered ends, the cloth sagging deepest under
//   your hips, its edges rising round you, head and feet higher than the hips) that swings as one pendulum (3.6 s) with you in it;
//   you breathe, blink, one hand rests on your belly. "But a few months in": one day passes as ONE slow sun arc (left → over the
//   top → right, ~2.7 s, continuous sky colour), the shadows of the trees and the hammock swing across the lawn, the leaves turn from
//   green to rust and some fall. "wall": the paper wall rises out of the lake in front of the setting sun (boom), the garden falls
//   into its shadow; the camera pushes (dolly + zoom + tilt) between the trees to the slip pinned on the wall and lands exactly on
//   wallShot's frame (lib/sc01_m1_world.mjs) with zero velocity: from then on the scene draws wallShot itself.
//   lakeTake(ctx, t, K)   K = { t0 (the light junction), months, wall, tl0, tl1 (the sun arc), push0, push1, K9 (= b12K(T)) }
//   LAKE_SUN0             the sun's screen point at the junction (where the light shrinks to)
// World: metres, y up, the camera looks along +z (no roll; f focal px; (px, py) principal point = the horizon point).
import { W, H, rgba, clamp, mix, sm, prng, drift, lin } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { figure, life, reachArm } from './figure.mjs';
import { once, eoX, qio } from './sc01_m1_open.mjs';
import { wallFrame, wallPaint, wallShot, wallVignette, WALL_DIM } from './sc01_m1_world.mjs';
import { lightAt } from './m1x_bridge.mjs';
import { passR, passBloom, mixHex, palAt, leafSprite, TONES } from './m1x_c01_kit.mjs';

const TAU = Math.PI * 2;
const sine = (x) => -(Math.cos(Math.PI * clamp(x)) - 1) / 2;
const HZ = 445, F0 = 1400;
const P3 = (C, X, Y, Z) => { const d = Math.max(.05, Z - C.z); return [C.px + C.f * (X - C.x) / d, C.py - C.f * (Y - C.y) / d, d]; };
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], sc3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const lerp3 = (a, b, q) => [mix(a[0], b[0], q), mix(a[1], b[1], q), mix(a[2], b[2], q)], norm3 = (a) => sc3(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1));
const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
// clip a 3D polygon to z >= z0 (nothing behind the camera gets projected)
function clipZ(pts, z0) { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[2] >= z0, ib = b[2] >= z0; if (ia) out.push(a); if (ia !== ib) { const q = (z0 - a[2]) / (b[2] - a[2]); out.push(lerp3(a, b, q)); } } return out; }

// ---------------------------------------------------------------- the wall in the lake (it lands on wallShot's frame)
const WL = { Z: 45, m: .4 * 45 / F0 };                       // depth; metres per wall px (scale .4 seen from the rest camera)
const SLIP_AT = [790, 262];                                   // the slip on screen from the rest camera, wall risen
const X_SLIP = (SLIP_AT[0] - W / 2) * WL.Z / F0, Y_SLIP = 1.55 + (HZ - SLIP_AT[1]) * WL.Z / F0;
const X_W0 = X_SLIP - WALL_DIM.slip[0] * WL.m, Y_W0 = Y_SLIP + WALL_DIM.slip[1] * WL.m;
const CEND = { x: -.35, y: 2.55, z: 3.0 };                    // where the camera ends (the zoom does the rest)

// ---------------------------------------------------------------- the camera
function restCam(t, K) {
  const u = clamp((t - K.t0) / (K.push0 - K.t0));
  return { x: .06 * sm(u) + drift(t, .02, 1), y: 1.55 + drift(t, .012, 2), z: .32 * u, f: F0, px: W / 2, py: HZ };
}
function endCam(t, K) {
  const Fw = wallFrame(t, K.K9), d = WL.Z - CEND.z, f = Fw.k * d / WL.m;
  return { x: CEND.x, y: CEND.y, z: CEND.z, f, px: Fw.ox - f * (X_W0 - CEND.x) / d, py: Fw.oy + f * (Y_W0 - CEND.y) / d };
}
function camAt(t, K) {
  const R = restCam(t, K); if (t <= K.push0) return { C: R, e: 0 };
  const u = lin(K.push0, K.push1, t), E = endCam(t, K), e = qio(u), ez = qio(u), et = qio(clamp(u * 1.08));
  return { C: { x: mix(R.x, E.x, ez), y: mix(R.y, E.y, ez), z: mix(R.z, E.z, ez), f: Math.exp(mix(Math.log(R.f), Math.log(E.f), e)), px: mix(R.px, E.px, et), py: mix(R.py, E.py, et) }, e };
}

// ---------------------------------------------------------------- one day as one sun arc; palettes
export const LAKE_SUN0 = [600, 392];
function dayU(t, K) { return .02 * clamp((t - K.t0) / (K.tl0 - K.t0)) + .98 * sine(lin(K.tl0, K.tl1, t)); }
function sunScreen(a) { return [mix(LAKE_SUN0[0], 1330, a), mix(LAKE_SUN0[1], 418, a) - 245 * Math.pow(Math.sin(Math.PI * clamp(a)), .85)]; }
const DAY = [
  [0, { top: '#465486', mid: '#c4927e', low: '#ffd4a2', water: '#8e7a90', wfar: '#f6cfac', hill1: '#8a7894', hill2: '#665a7c', lawn: '#56653c', lawnD: '#262f1c', sun: '#ffd8a0', I: .8, warm: 1 }],
  [.24, { top: '#4c6ea6', mid: '#9ebdd8', low: '#f2e4ca', water: '#6c8cae', wfar: '#dce4ea', hill1: '#7e8ea8', hill2: '#5a6c8e', lawn: '#5a7c40', lawnD: '#2c3e22', sun: '#fff0d4', I: 1, warm: .35 }],
  [.5, { top: '#3b67ab', mid: '#8ab4de', low: '#d8eaf4', water: '#5c8ab8', wfar: '#d2e2f0', hill1: '#7694b0', hill2: '#527292', lawn: '#5e8446', lawnD: '#2e4424', sun: '#fffaf0', I: 1.08, warm: 0 }],
  [.77, { top: '#42619e', mid: '#a8b8ce', low: '#f2dab4', water: '#6a82a4', wfar: '#e8d8c6', hill1: '#7e809a', hill2: '#5a5c7c', lawn: '#5c7442', lawnD: '#2e3a22', sun: '#ffe6c0', I: .96, warm: .45 }],
  [1, { top: '#2e3468', mid: '#b2727e', low: '#ffae6e', water: '#8c667a', wfar: '#f4aa7a', hill1: '#6c5072', hill2: '#4c3a5a', lawn: '#454c32', lawnD: '#1e2418', sun: '#ffb070', I: .62, warm: 1 }],
];
const SHADE = '#1c2440';   // the wall's shadow over the garden (cool)

// ---------------------------------------------------------------- the land, the lake and the hills (world, built once)
const NZ = vnoise(31);
const shoreZ = (X) => 9.8 + .9 * (fbm(NZ, X * .12 + 3, .5, 3) - .5) + .35 * Math.sin(X * .21);
const HILLS = (() => { const n1 = vnoise(17), n2 = vnoise(23), A = [], B = [];
  for (let X = -1100; X <= 1100; X += 9) { const dip = 1 - .75 * Math.exp(-(((X + 180) / 110) ** 2)); A.push([X, (14 + 46 * fbm(n1, X * .004, 1, 4) + 10 * Math.sin(X * .006)) * dip, 720]); }
  for (let X = -700; X <= 700; X += 6) { const dip = 1 - .8 * Math.exp(-(((X + 95) / 70) ** 2)) - .5 * Math.exp(-(((X - 160) / 90) ** 2)); B.push([X, (5 + 22 * fbm(n2, X * .007, 3, 4)) * dip, 400]); }
  return [A, B]; })();
const RIP = (() => { const r = prng(91), a = []; for (let i = 0; i < 300; i++) { const v = r(), Z = 1 / (v * (1 / 10.4 - 1 / 320) + 1 / 320); a.push({ X: (r() - .5) * Z * 2.4, Z, L: (.3 + r() * 1.4) * Math.sqrt(Z / 12), ph: r() * TAU, b: r() }); } return a; })();
const GRASS = (() => { const r = prng(57), a = []; for (let i = 0; i < 560; i++) { const v = r(), Z = 1 / (v * (1 / 3.0 - 1 / 10) + 1 / 10), X = (r() - .5) * Z * 1.5; if (Z > shoreZ(X) - .15) continue; a.push({ X, Z, h: .06 + r() * .12, lean: (r() - .5) * .5, ph: r() * TAU, c: r() }); } return a; })();
const REEDS = (() => { const r = prng(73), a = []; for (let i = 0; i < 70; i++) { const X = (r() - .5) * 26; if (Math.abs(X - .2) < 2.8 && r() < .8) continue; a.push({ X, Z: shoreZ(X) - .05 + r() * .25, h: .35 + r() * .6, lean: (r() - .5) * .3, ph: r() * TAU }); } return a; })();
const CLOUDS = (() => { const r = prng(5), a = []; for (let i = 0; i < 6; i++) a.push({ x: r() * 2400 - 240, y: 60 + r() * 190, w: 260 + r() * 360, h: 18 + r() * 22, sp: .6 + r() * .8 }); return a; })();
const cloudSpr = () => once('c01lakecloud', () => { const [c, g] = canvasOf(512, 96); const gr = g.createRadialGradient(256, 48, 4, 256, 48, 250); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(.5, 'rgba(255,255,255,.2)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.save(); g.scale(1, 96 / 512); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); g.restore();
  g.globalCompositeOperation = 'destination-in'; g.strokeStyle = '#fff'; g.lineWidth = 1.3; const r = prng(8); for (let k = 0; k < 26; k++) { const y = 20 + r() * 56; g.beginPath(); g.moveTo(40 + r() * 80, y); g.bezierCurveTo(180, y - 6 + r() * 12, 330, y - 6 + r() * 12, 470 - r() * 80, y + (r() - .5) * 6); g.stroke(); } return c; });
import { canvas as canvasOf } from '../engine.mjs';

// ---------------------------------------------------------------- the trees: two tall trunks, low limbs, leaf clusters dipping into the frame
const T1 = { x: -2.35, z: 6.2, r: .2, lean: -.03, side: -1, seed: 5 }, T2 = { x: 2.35, z: 7.0, r: .18, lean: .028, side: 1, seed: 9 };
const trunkAt = (T, Y) => [T.x + T.lean * Y, Y, T.z];
function limbsOf(T) {   // limbs: quadratic curves in 3D (start on the trunk, control, end), widths
  const s = T.side, L = [];
  const add = (Y0, end, ctrl, w0) => { const a = trunkAt(T, Y0); L.push({ a, c: add3(a, ctrl), b: add3(a, end), w0, w1: w0 * .3 }); };
  add(2.55, [-s * 1.9, 1.6, -.3], [-s * .9, .5, -.15], .1);    // inward, rising over the hammock
  add(2.85, [s * 2.2, 1.9, .5], [s * 1.1, .4, .2], .11);        // outward
  add(3.3, [-s * 1.2, 2.6, .9], [-s * .4, 1.2, .3], .09);        // inward, up and back
  add(2.4, [s * 1.4, .9, -.8], [s * .8, .2, -.4], .07);          // outward, toward us
  return L;
}
const LIMBS = [limbsOf(T1), limbsOf(T2)];
const qb = (L, q) => { const u = 1 - q; return [u * u * L.a[0] + 2 * u * q * L.c[0] + q * q * L.b[0], u * u * L.a[1] + 2 * u * q * L.c[1] + q * q * L.b[1], u * u * L.a[2] + 2 * u * q * L.c[2] + q * q * L.b[2]]; };
// leaf clusters: along the limbs and in the crown above; each has its own moment in autumn (the colour does not change all at once)
const LEAVES = [T1, T2].map((T, ti) => { const r = prng(400 + ti * 77), out = [];
  for (const L of LIMBS[ti]) for (let k = 0; k < 16; k++) { const q = .25 + .75 * r(), p = qb(L, q); out.push({ p: add3(p, [(r() - .5) * .9, (r() - .3) * .7, (r() - .5) * .8]), sz: .55 + r() * .45, v: Math.floor(r() * 3), rot: r() * TAU, lit: r(), off: r(), ph: r() * TAU }); }
  for (let k = 0; k < 60; k++) { const a = r() * TAU, rr = Math.sqrt(r()), p = [T.x + T.side * .9 + Math.cos(a) * 3.1 * rr, 3.4 + r() * 3.6, T.z + Math.sin(a) * 2.4 * rr]; out.push({ p, sz: .6 + r() * .5, v: Math.floor(r() * 3), rot: r() * TAU, lit: r(), off: r(), ph: r() * TAU }); }
  // the inner side stays open (the slip and the sun are seen between the crowns): drop clusters low over the middle
  return out.filter((c) => !(Math.abs(c.p[0] - .2) < 1.35 && c.p[1] < 4.6)).sort((a, b) => b.p[2] - a.p[2]); });

// ---------------------------------------------------------------- the hammock (a sling between the trunks)
const A1 = (() => { const c = trunkAt(T1, 1.8), d = norm3([T2.x - T1.x, 0, T2.z - T1.z]); return add3(c, sc3(d, T1.r)); })();
const A2 = (() => { const c = trunkAt(T2, 1.74), d = norm3([T1.x - T2.x, 0, T1.z - T2.z]); return add3(c, sc3(d, T2.r)); })();
const AXIS = norm3(sub3(A2, A1)), AXH = norm3([AXIS[0], 0, AXIS[2]]), NF = [-AXH[2], 0, AXH[0]];   // NF: across the sling, away from us
const E1 = add3(lerp3(A1, A2, .16), [0, -.6, 0]), E2 = add3(lerp3(A1, A2, .84), [0, -.54, 0]);   // the gathered ends (rings)
const QH = .43, YMIN = .52;   // the deepest point: under the hips
function slingC(q) { const b = lerp3(E1, E2, q), g = q < QH ? Math.pow((QH - q) / QH, 1.75) : Math.pow((q - QH) / (1 - QH), 1.75); return [b[0], YMIN + (b[1] - YMIN) * g, b[2]]; }
const spread = (q) => .37 * Math.pow(Math.sin(Math.PI * clamp(q)), .55);
const wrapH = (q) => (.14 + .16 * Math.exp(-(((q - QH) / .24) ** 2))) * Math.pow(Math.sin(Math.PI * clamp(q)), .6);
const slingP = (q, r) => { const c = slingC(q), d = spread(q) * r; return [c[0] + NF[0] * d, c[1] + wrapH(q) * Math.pow(Math.abs(r), 1.5), c[2] + NF[2] * d]; };
// the pendulum: the whole sling (and you) rolls about the line through the two ties
const swingA = (t) => .105 * Math.sin(TAU * t / 3.6 + .5);
function rotAxis(p, phi) { const v = sub3(p, A1), k = AXIS, c = Math.cos(phi), s = Math.sin(phi), kv = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
  const x = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]];
  return add3(A1, [v[0] * c + x[0] * s + k[0] * kv * (1 - c), v[1] * c + x[1] * s + k[1] * kv * (1 - c), v[2] * c + x[2] * s + k[2] * kv * (1 - c)]); }
const STRIPES = [[0, .14, '#e8dbbd'], [.14, .24, '#b4553c'], [.24, .29, '#e8dbbd'], [.29, .43, '#34436e'], [.43, .5, '#e8dbbd'], [.5, .6, '#d29a3c'], [.6, .66, '#e8dbbd'], [.66, .8, '#b4553c'], [.8, .92, '#e8dbbd'], [.92, 1, '#34436e']];
const NQ = 34;

// ---------------------------------------------------------------- the take
export function lakeTake(ctx, t, K) {
  if (t >= K.push1) { wallShot(ctx, t, K.K9); return { land: true }; }
  const { C, e } = camAt(t, K);
  const a = dayU(t, K), pal = palAt(DAY, a);
  const wallU = clamp((t - (K.wall - .12)) / .55), wallE = wallU <= 0 ? 0 : eoX(wallU) + .03 * Math.sin(clamp((t - K.wall - .4) / .4) * Math.PI) * (t > K.wall + .4);
  const shadeW = .58 * sm(clamp((t - (K.wall - .02)) / .5));      // the wall shades the garden once its top passes the sun
  const season = sine(lin(K.tl0 + .25, K.tl1 - .05, t));
  const I = pal.I * (1 - shadeW);
  // the sun: on screen for the rest camera, moved by the zoom/tilt like anything at infinity
  const [s0x, s0y] = sunScreen(a), SUN = [C.px + (s0x - W / 2) * C.f / F0, C.py + (s0y - HZ) * C.f / F0];
  const ev = mix(.06, .8, Math.pow(Math.sin(Math.PI * clamp(a)), .8)), az = mix(-.95, .95, a), dH = [Math.sin(az), Math.cos(az)];   // shadows: virtual elevation, swinging azimuth
  ctx.save();
  // 1 · sky, clouds (they stream while the day runs), the sun
  { const hz = C.py; const g = ctx.createLinearGradient(0, hz - 900 * C.f / F0, 0, hz); g.addColorStop(0, pal.top); g.addColorStop(.62, pal.mid); g.addColorStop(1, pal.low); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Math.min(H, hz + 4));
    const spd = (t - K.t0) * 6 + 90 * dayU(t, K); const CS = cloudSpr();
    ctx.save(); ctx.globalAlpha = .55 * (1 - .4 * pal.warm) * (1 - shadeW); for (const c of CLOUDS) { const x = ((c.x + spd * c.sp * 3) % 2400 + 2400) % 2400 - 240, cx = C.px + (x - W / 2) * C.f / F0, cy = C.py + (c.y - HZ) * C.f / F0, k = C.f / F0; ctx.drawImage(CS, cx - c.w / 2 * k, cy - c.h / 2 * k, c.w * k, c.h * k); } ctx.restore();
    // a wide warm glow round the sun, then the sun itself (the same light the junction shrinks into)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gr = ctx.createRadialGradient(SUN[0], SUN[1], 0, SUN[0], SUN[1], 520); gr.addColorStop(0, rgba(pal.sun, .38 * pal.I)); gr.addColorStop(.3, rgba(pal.sun, .12 * pal.I)); gr.addColorStop(1, rgba(pal.sun, 0)); ctx.fillStyle = gr; ctx.fillRect(SUN[0] - 520, SUN[1] - 520, 1040, 1040); ctx.restore();
    lightAt(ctx, t, SUN[0], SUN[1], R_SUN, { tone: 'gold', seed: 67 });
  }
  // 2 · the hills of the far shore (two planes) and the haze over the water
  for (const [k, pts] of [[0, HILLS[0]], [1, HILLS[1]]]) {
    const Z = pts[0][2], P = pts.map(([X, Y]) => P3(C, X, Y, Z)), y0 = P3(C, 0, 0, Z)[1] + 2;
    ctx.beginPath(); ctx.moveTo(P[0][0], y0); for (const p of P) ctx.lineTo(p[0], p[1]); ctx.lineTo(P[P.length - 1][0], y0); ctx.closePath();
    ctx.fillStyle = k ? pal.hill2 : pal.hill1; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#1a1830', .12); ctx.lineWidth = 1; ctx.beginPath(); for (let y = Math.floor(Math.min(...P.map((p) => p[1]))); y < y0; y += 4) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke(); ctx.restore();
  }
  { const hz = C.py, g = ctx.createLinearGradient(0, hz - 70, 0, hz + 30); g.addColorStop(0, rgba(pal.wfar, 0)); g.addColorStop(.7, rgba(pal.wfar, .45)); g.addColorStop(1, rgba(pal.wfar, 0)); ctx.fillStyle = g; ctx.fillRect(0, hz - 70, W, 100); }
  // 3 · the water: the sky mirrored, engraved ripples, the sun's glitter path
  { const hz = P3(C, 0, 0, 400)[1], ys = P3(C, 0, 0, 10)[1], g = ctx.createLinearGradient(0, hz, 0, ys); g.addColorStop(0, pal.wfar); g.addColorStop(.3, pal.water); g.addColorStop(1, mixHex(pal.water, '#101828', .45)); ctx.fillStyle = g; ctx.fillRect(0, hz, W, H - hz);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gw = ctx.createLinearGradient(SUN[0] - 140, 0, SUN[0] + 140, 0); gw.addColorStop(0, rgba(pal.sun, 0)); gw.addColorStop(.5, rgba(pal.sun, .22 * I)); gw.addColorStop(1, rgba(pal.sun, 0)); ctx.fillStyle = gw; ctx.fillRect(SUN[0] - 140, hz, 280, H - hz); ctx.restore();
    ctx.lineCap = 'round';
    for (const q of RIP) {
      const X = q.X + .25 * Math.sin(t * .5 + q.ph), a0 = P3(C, X, 0, q.Z), a1 = P3(C, X + q.L, 0, q.Z); if (a1[0] < -20 || a0[0] > W + 20 || a0[1] > H + 5) continue;
      const near = Math.abs((a0[0] + a1[0]) / 2 - SUN[0]) < 30 + 1400 / q.Z;
      ctx.strokeStyle = near ? rgba(pal.sun, (.35 + .45 * q.b) * I) : rgba(mixHex(pal.wfar, '#ffffff', .3), .08 + .14 * q.b); ctx.lineWidth = clamp(14 / q.Z, .6, 2.2);
      ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
    }
  }
  // 4 · the wall rises out of the lake (it carries the slip), the spray at its foot
  if (wallU > 0) {
    const sink = (1 - wallE) * (Y_W0 + .6), O = P3(C, X_W0, Y_W0 - sink, WL.Z), k = C.f * WL.m / O[2], wl = P3(C, 0, 0, WL.Z)[1];
    ctx.save(); ctx.beginPath(); ctx.rect(-10, -10, W + 20, wl + 10); ctx.clip(); ctx.translate(O[0], O[1]); ctx.scale(k, k);
    wallPaint(ctx, t, K.K9, { shade: .14 * (1 - e) });
    ctx.restore();
    const sp = clamp(1 - wallU * 1.3); if (sp > 0) { const r = prng(3); ctx.fillStyle = rgba('#f2eee6', .55 * sp); for (let i = 0; i < 160; i++) { const X = X_W0 + r() * WALL_DIM.w * WL.m, h = r() * 2.4 * wallU, p = P3(C, X, h, WL.Z - .5); if (p[0] > -5 && p[0] < W + 5) ctx.fillRect(p[0], p[1], 2, 2); } }
  }
  // 5 · the lawn, the shore line, reeds
  const lawn = mixHex(mixHex(pal.lawn, '#8a8040', .35 * season), SHADE, shadeW * .7), lawnD = mixHex(mixHex(pal.lawnD, '#3a3418', .3 * season), '#0c1020', shadeW * .6);
  { const pts = []; for (let X = -40; X <= 40; X += .5) pts.push(P3(C, X, 0, Math.max(C.z + .6, shoreZ(X))));
    const ys = Math.min(...pts.map((p) => p[1]));
    ctx.beginPath(); ctx.moveTo(pts[0][0], H + 400); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(pts[pts.length - 1][0], H + 400); ctx.closePath();
    const g = ctx.createLinearGradient(0, ys, 0, H); g.addColorStop(0, mixHex(lawn, pal.wfar, .18)); g.addColorStop(.35, lawn); g.addColorStop(1, lawnD); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = rgba(mixHex(pal.wfar, '#ffffff', .4), .55 * (1 - shadeW * .6)); ctx.lineWidth = 1.4; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] - 1) : ctx.moveTo(p[0], p[1] - 1))); ctx.stroke();
    ctx.lineCap = 'round'; for (const q of REEDS) { const b = P3(C, q.X, 0, q.Z), tp = P3(C, q.X + q.lean * q.h + .03 * Math.sin(t * 1.3 + q.ph), q.h, q.Z); if (b[0] < -10 || b[0] > W + 10) continue; ctx.strokeStyle = rgba(mixHex(lawnD, '#000000', .2), .85); ctx.lineWidth = clamp(10 / q.Z, .7, 2); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.quadraticCurveTo(b[0], (b[1] + tp[1]) / 2, tp[0], tp[1]); ctx.stroke(); }
  }
  // 6 · shadows on the lawn (they swing with the sun): the crowns (dappled), the trunks, the hammock
  const phi = swingA(t), shA = .38 * clamp(ev / .12) * (1 - shadeW) * pal.I;
  const toGround = (p) => { const l = p[1] / Math.tan(ev); return [p[0] - dH[0] * l, 0, p[2] - dH[1] * l]; };
  if (shA > .01) {
    ctx.save(); ctx.fillStyle = rgba('#0a1208', shA);
    const groundPoly = (pts3) => { const c = clipZ(pts3, C.z + .4); if (c.length < 3) return; poly(ctx, c.map((p) => P3(C, p[0], p[1], p[2]))); ctx.fill(); };
    for (const T of [T1, T2]) { const b = trunkAt(T, 0), tp = toGround(trunkAt(T, 14)), nx = -dH[1] * T.r * 1.1, nz = dH[0] * T.r * 1.1; groundPoly([[b[0] + nx, 0, b[2] + nz], [tp[0] + nx * .7, 0, tp[2] + nz * .7], [tp[0] - nx * .7, 0, tp[2] - nz * .7], [b[0] - nx, 0, b[2] - nz]]); }
    const r = prng(19); for (let i = 0; i < 2; i++) { const T = [T1, T2][i]; for (let k = 0; k < 16; k++) { const c = [T.x + T.side * .8 + (r() - .5) * 5, 3.6 + r() * 3.4, T.z + (r() - .5) * 4], g = toGround(c), rad = .55 + r() * .6, pts = []; for (let j = 0; j < 12; j++) { const aa = j / 12 * TAU; pts.push([g[0] + Math.cos(aa) * rad - dH[0] * Math.sin(aa) * rad * (1 / Math.sin(ev) - 1) * .25, 0, g[2] + Math.sin(aa) * rad * .8 - dH[1] * Math.sin(aa) * rad * (1 / Math.sin(ev) - 1) * .25]); } ctx.globalAlpha = .55; groundPoly(pts); } }
    ctx.globalAlpha = 1; const hp = []; for (let i = 0; i <= 16; i++) hp.push(toGround(rotAxis(slingP(i / 16, 1), phi))); for (let i = 16; i >= 0; i--) hp.push(toGround(rotAxis(slingP(i / 16, -1), phi))); ctx.fillStyle = rgba('#0a1208', shA * 1.2); groundPoly(hp);
    ctx.restore();
  }
  // 7 · grass (it catches the light at its tips)
  { ctx.lineCap = 'round'; const tip = rgba(pal.sun, .32 * I);
    for (const q of GRASS) { const b = P3(C, q.X, 0, q.Z); if (b[1] > H + 30 || b[0] < -20 || b[0] > W + 20 || b[2] < .5) continue; const sw = .02 * Math.sin(t * 1.6 + q.ph + q.X * .3), tp = P3(C, q.X + (q.lean + sw) * q.h, q.h, q.Z); const lw = clamp(9 / b[2], .6, 3.2);
      ctx.strokeStyle = mixHex(lawnD, lawn, .3 + .6 * q.c); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.quadraticCurveTo(b[0], (b[1] + tp[1]) / 2, tp[0], tp[1]); ctx.stroke();
      if (q.c > .55) { ctx.strokeStyle = tip; ctx.lineWidth = lw * .7; ctx.beginPath(); ctx.moveTo(mix(b[0], tp[0], .6), mix(b[1], tp[1], .6)); ctx.lineTo(tp[0], tp[1]); ctx.stroke(); } } }
  // 8 · the far tree, the hammock with you in it, the near tree
  const light = { pal, I, SUN, shadeW, season, t };
  drawTree(ctx, C, T2, 1, light);
  drawHammock(ctx, C, t, K, phi, light);
  drawTree(ctx, C, T1, 0, light);
  fallingLeaves(ctx, C, t, K, light);
  // motes in the morning light
  { const ma = .5 * (1 - sine(lin(K.tl0, K.tl0 + .8, t))) + .3 * sine(lin(K.tl1 - .6, K.tl1, t)) * (1 - shadeW); if (ma > .01) { const r = prng(23); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 90; i++) { const X = (r() - .5) * 8, Y = .3 + r() * 2.4, Z = 4 + r() * 6, p = P3(C, X + .25 * Math.sin(t * (.2 + r() * .3) + i), Y + .15 * Math.sin(t * .4 + i * 1.7), Z); if (p[2] < .5) continue; ctx.fillStyle = rgba(pal.sun, (.15 + .5 * r()) * ma); const z = clamp(8 / p[2], 1, 3); ctx.fillRect(p[0], p[1], z, z); } ctx.restore(); } }
  ctx.restore();
  // 9 · vignette (it becomes wallShot's on the landing), and the gold light of the junction shrinking into the sun
  wallVignette(ctx, W * .5, mix(H * .45, H * .5, e), mix(420, 380, e), mix(1250, 1200, e), mix(.5, .42, e));
  if (t < K.t0 + .7) { const r = passR(t, K.t0, R_JUNC, .75); if (r > R_SUN) lightAt(ctx, t, SUN[0], SUN[1], r, { tone: 'gold', seed: 67, bloom: passBloom(r, R_SUN) }); }
  return { land: false, sun: SUN };
}
export const R_SUN = 26, R_JUNC = 1750;

// ---------------------------------------------------------------- tree (trunk + limbs + leaf clusters), drawn in the world
function drawTree(ctx, C, T, ti, L) {
  const { pal, I, SUN, shadeW, season, t } = L;
  // trunk: a tapered column with a flared foot, bark lines, a rim toward the sun
  const N = 26, lft = [], rgt = [], ys = [];
  for (let i = 0; i <= N; i++) { const Y = -.05 + Math.pow(i / N, 1.4) * 9, c = trunkAt(T, Y), p = P3(C, c[0], c[1], c[2]), rr = T.r * (1 + .55 * Math.exp(-Y / .28)) * (1 - .025 * Y), w = C.f * rr / p[2]; lft.push([p[0] - w, p[1]]); rgt.push([p[0] + w, p[1]]); ys.push(Y); }
  const bark = mixHex(mixHex('#3a2c22', '#5a4a3a', .3 * I), SHADE, shadeW * .6);
  poly(ctx, [...lft, ...rgt.reverse()]); rgt.reverse();
  const tb = P3(C, ...trunkAt(T, 1)), sunSide = Math.sign(SUN[0] - tb[0]) || 1;
  const g = ctx.createLinearGradient(lft[4][0], 0, rgt[4][0], 0); g.addColorStop(0, sunSide < 0 ? mixHex(bark, pal.sun, .28 * I) : mixHex(bark, '#000000', .35)); g.addColorStop(.5, bark); g.addColorStop(1, sunSide > 0 ? mixHex(bark, pal.sun, .28 * I) : mixHex(bark, '#000000', .35)); ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#120c08', .45); ctx.lineWidth = clamp(C.f / tb[2] * .008, .6, 3);
  for (let k = -5; k <= 5; k++) { ctx.beginPath(); for (let i = 0; i <= N; i++) { const f = k / 6 + .04 * Math.sin(ys[i] * 3.1 + k * 1.7), x = mix(lft[i][0], rgt[i][0], .5 + f * .5), y = lft[i][1]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = rgba(pal.sun, .5 * I); ctx.lineWidth = clamp(C.f / tb[2] * .006, .8, 2.4); ctx.beginPath(); const rim = sunSide > 0 ? rgt : lft; rim.forEach((p, i) => (i ? ctx.lineTo(p[0] - sunSide * 1.2, p[1]) : ctx.moveTo(p[0] - sunSide * 1.2, p[1]))); ctx.stroke();
  // limbs
  ctx.fillStyle = mixHex(bark, '#000000', .1);
  for (const Lb of LIMBS[ti]) { const n = 12, l = [], r = []; for (let i = 0; i <= n; i++) { const q = i / n, p3 = qb(Lb, q), p = P3(C, ...p3), q2 = qb(Lb, Math.min(1, q + .05)), p2 = P3(C, ...q2), dx = p2[0] - p[0], dy = p2[1] - p[1], m = Math.hypot(dx, dy) || 1, w = C.f * mix(Lb.w0, Lb.w1, q) / p[2] / 2; l.push([p[0] - dy / m * w, p[1] + dx / m * w]); r.push([p[0] + dy / m * w, p[1] - dx / m * w]); } poly(ctx, [...l, ...r.reverse()]); ctx.fill(); }
  // leaf clusters: shade side first; the season turns each cluster at its own moment (two tones of the same cluster, never two pictures)
  const sway = (c) => .05 * Math.sin(t * 1.1 + c.ph) + .02 * Math.sin(t * 2.7 + c.ph * 2);
  const tint = rgba(SHADE, shadeW * .55);
  for (const c of LEAVES[ti]) {
    const p = P3(C, c.p[0] + sway(c), c.p[1], c.p[2]); if (p[2] < .6) continue; const sz = C.f * c.sz / p[2] / 128 * 1.9; if (p[0] < -128 * sz || p[0] > W + 128 * sz || p[1] < -128 * sz || p[1] > H + 128 * sz) continue;
    const lit = (p[0] - SUN[0]) * 0 + c.lit > .5 ? 1 : 0, tq = clamp(season * 4.6 - c.off * 1.6, 0, 4), t0 = Math.floor(Math.min(3.999, tq)), fr = tq - t0;
    const base = lit ? [1, 2, 3, 4, 5] : [0, 2, 3, 4, 5];
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(c.rot + sway(c) * 2); ctx.scale(sz, sz);
    ctx.drawImage(leafSprite(base[t0], c.v), -64, -64); if (fr > .01) { ctx.globalAlpha = fr; ctx.drawImage(leafSprite(base[t0 + 1], c.v), -64, -64); }
    ctx.restore();
  }
  if (shadeW > .01) { /* the wall's shade over the crown: one cool veil per tree, drawn as the clusters' own tint (cheap) */ }
}
// leaves that let go in autumn: each from a cluster, drifting and turning down to the lawn, where it stays
function fallingLeaves(ctx, C, t, K, L) {
  const { season, I, shadeW } = L; if (season < .3) return;
  const r = prng(808);
  for (let i = 0; i < 26; i++) {
    const ti = i % 2, src = LEAVES[ti][Math.floor(r() * LEAVES[ti].length)], t0 = mix(K.tl0 + 1.0, K.tl1 + .3, r()), sp = .8 + r() * .5, ph = r() * TAU, tone = 3 + Math.floor(r() * 3);
    const u = t - t0; if (u <= 0) continue;
    const Y = Math.max(.01, src.p[1] - u * sp * 1.6), land = Y <= .011, du = land ? (src.p[1] - .01) / (sp * 1.6) : u;
    const X = src.p[0] + .35 * Math.sin(du * 2.4 + ph) + du * .3, Z = src.p[2] - du * .4, p = P3(C, X, Y, Z); if (p[2] < .6 || p[1] > H + 10) continue;
    const s = C.f * .06 / p[2], ang = land ? ph : du * 5 + ph, fl = land ? .35 : Math.cos(du * 7 + ph);
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang); ctx.scale(s, s * (land ? .35 : Math.max(.15, Math.abs(fl))));
    ctx.fillStyle = mixHex(TONES[tone][1], '#1c2440', shadeW * .5); ctx.beginPath(); ctx.moveTo(-1, 0); ctx.quadraticCurveTo(0, -.75, 1, 0); ctx.quadraticCurveTo(0, .75, -1, 0); ctx.fill();
    ctx.restore();
  }
}

// ---------------------------------------------------------------- the hammock and you
function drawHammock(ctx, C, t, K, phi, L) {
  const { pal, I, SUN, shadeW } = L;
  const R = (p) => rotAxis(p, phi), Pj = (p) => { const q = R(p); return P3(C, q[0], q[1], q[2]); };
  const d0 = P3(C, ...slingC(QH))[2], px = C.f / d0;   // px per metre at the hammock
  const ink = '#2a1e16';
  // ropes: taut, straight from the ties to the rings (the twist drawn as ticks)
  const rope = (A, E) => { const a = P3(C, ...A), e = Pj(E), w = clamp(px * .022, 1.2, 6);
    ctx.lineCap = 'round'; ctx.strokeStyle = mixHex('#3a2c1c', SHADE, shadeW * .5); ctx.lineWidth = w + 1.4; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
    ctx.strokeStyle = mixHex(mixHex('#cbb48a', '#8a7a5a', 1 - I), SHADE, shadeW * .5); ctx.lineWidth = w; ctx.stroke();
    ctx.strokeStyle = rgba('#3a2c1c', .5); ctx.lineWidth = Math.max(.6, w * .25); const n = Math.floor(Math.hypot(e[0] - a[0], e[1] - a[1]) / (w * 1.6)); ctx.beginPath();
    for (let i = 1; i < n; i++) { const q = i / n, x = mix(a[0], e[0], q), y = mix(a[1], e[1], q), dx = (e[0] - a[0]), dy = (e[1] - a[1]), m = Math.hypot(dx, dy); ctx.moveTo(x - dy / m * w * .45 - dx / m * w * .3, y + dx / m * w * .45 - dy / m * w * .3); ctx.lineTo(x + dy / m * w * .45 + dx / m * w * .3, y - dx / m * w * .45 + dy / m * w * .3); } ctx.stroke();
    return e; };
  const e1 = rope(A1, E1), e2 = rope(A2, E2);
  // the cloth: far half (its inside), the strings at the ends, you, the near half (its outside) over your back and hips
  const curve = (r) => { const out = []; for (let i = 0; i <= NQ; i++) { const q = .045 + .91 * i / NQ; out.push(Pj(slingP(q, r))); } return out; };
  const band = (r0, r1) => { const A = curve(r0), B = curve(r1); return [...A, ...B.reverse()]; };
  const lightK = (inner, rr) => (inner ? mix(.6, .95, rr) : mix(.5, .7, rr)) * mix(.55, 1, I / 1.08);
  const half = (sgn, inner) => {
    for (const [r0, r1, col] of STRIPES) { const c = mixHex(mixHex(col, '#000000', 1 - lightK(inner, (r0 + r1) / 2)), SHADE, shadeW * .6); poly(ctx, band(sgn * r0, sgn * r1)); ctx.fillStyle = c; ctx.fill(); }
    // weave: fine engraved lines along the cloth, and the cloth's shade toward the bottom (inside) / toward the ground (outside)
    ctx.save(); poly(ctx, band(0, sgn)); ctx.clip();
    ctx.strokeStyle = rgba(ink, .16); ctx.lineWidth = .7; for (let k = 1; k < 16; k++) { const C2 = curve(sgn * k / 16); ctx.beginPath(); C2.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    const mid = curve(0), edge = curve(sgn), mi = mid[NQ >> 1], ed = edge[NQ >> 1], g = ctx.createLinearGradient(mi[0], mi[1], ed[0], ed[1]);
    g.addColorStop(0, rgba('#0a0606', inner ? .34 : .18)); g.addColorStop(.6, rgba('#0a0606', inner ? .08 : .14)); g.addColorStop(1, rgba('#0a0606', inner ? 0 : .3)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (inner && I > .05) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(pal.sun, .12 * I * (.4 + .6 * pal.warm)); ctx.fillRect(0, 0, W, H); }   // the sun through the cloth
    ctx.restore();
    // the hem: a corded edge
    const hem = curve(sgn); ctx.strokeStyle = mixHex('#2c2018', SHADE, shadeW * .4); ctx.lineWidth = clamp(px * .016, 1, 4); ctx.beginPath(); hem.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    if (I > .05) { ctx.strokeStyle = rgba(pal.sun, .35 * I); ctx.lineWidth = 1; ctx.beginPath(); hem.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] - 1) : ctx.moveTo(p[0], p[1] - 1))); ctx.stroke(); }
  };
  half(1, true);
  // the strings fanning from each ring into the cloth's gathered end
  ctx.strokeStyle = mixHex('#b8a07a', SHADE, shadeW * .5); ctx.lineWidth = clamp(px * .006, .6, 1.6);
  for (const [e, q] of [[e1, .045], [e2, .955]]) { ctx.beginPath(); for (let k = -3; k <= 3; k++) { const p = Pj(slingP(q, k / 3)); ctx.moveTo(e[0], e[1]); ctx.lineTo(p[0], p[1]); } ctx.stroke(); ctx.fillStyle = '#2a2018'; ctx.beginPath(); ctx.arc(e[0], e[1], clamp(px * .02, 1.5, 5), 0, TAU); ctx.fill(); }
  hammockYou(ctx, C, t, K, phi, L, px);
  half(-1, false);
}
// you lying in it: the kit figure turned onto its back (head left, face up); the torso and legs follow the cloth's curve
const SEED = 7, UNIT = 1.78 / 185;   // metres per figure unit
function hammockYou(ctx, C, t, K, phi, L, px) {
  const { pal, I, SUN, shadeW } = L;
  const R = (p) => rotAxis(p, phi), up = (q, h) => { const c = slingC(q); return R([c[0], c[1] + h, c[2]]); };
  const Hh = up(QH, .12), Sh = up(QH - .19, .13), Kn = up(QH + .145, .13), Hl = up(QH + .28, .1);
  const h = P3(C, ...Hh), sh = P3(C, ...Sh), kn = P3(C, ...Kn), hl = P3(C, ...Hl);
  const s = C.f * UNIT / h[2];
  const Lf = life(t, SEED);
  // a small lift of the head when the months run ("months") and when the wall comes up
  const lift = .16 * sine(lin(K.months - .1, K.months + .5, t)) * (1 - sine(lin(K.months + 1.0, K.months + 1.6, t))) + .3 * sine(lin(K.wall - .05, K.wall + .5, t));
  const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  const lean = ang(h, sh) + Math.PI + (ang(h, sh) < 0 ? 0 : -2 * Math.PI) + .012 * Lf.b;
  const hipA = -ang(h, kn), knA = hipA + ang(kn, hl);
  const pose = { lean, head: .2 + lift, hip: [hipA, hipA - .05], kn: [knA, knA + .12], sh: [.3, .12], el: [1.1, .35], hands: ['relaxed', 'relaxed'], hair: 'short', lock: [true, false], turn: .1 * lift };
  // the near hand rests on the belly and rides the breath
  const o = { t, seed: SEED, dress: { coat: '#3a4266', pants: '#262840', shoes: '#16131c', skin: '#b98262', hair: '#16111a' }, accent: '#c8843a', accentPart: 'scarf', shadow: false, rimW: 1.6 };
  const cl = Math.cos(lean), sl = Math.sin(lean), bx = 15 + 1.2 * Lf.b, by = -27;
  const r = reachArm(0, 0, s, pose, 0, false, o, [s * (bx * cl - by * sl), s * (bx * sl + by * cl)], 1); pose.sh[0] = r.sh; pose.el[0] = r.el;
  // light in the figure's frame (the frame turns by -90°: figure (x, y) → screen (y, -x))
  const lx = -(SUN[1] - h[1]), ly = SUN[0] - h[0];
  o.light = { x: lx, y: ly, col: pal.sun, a: .4 * I }; o.rim = mixHex(pal.sun, '#ffffff', .2); o.rimSide = lx > 0 ? 1 : -1; o.shadeA = .1 + .35 * shadeW;
  ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(-Math.PI / 2);
  figure(ctx, -2 * Lf.w * s, .35 * Lf.b * s, s, pose, o);
  ctx.restore();
}
