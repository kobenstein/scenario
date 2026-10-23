// Film 7 · c09/c10's COPY of lib/f7_c08_land.mjs (c08's land, final version, for card I's engraving on the back; only the table import changed). Original header:
// Film 7 · c08 · THE LAND behind card I's answer (SUN): one engraved landscape in true perspective, from noon to the blue hour. Builder: c08.
// Pure functions of t and the state, deterministic. Everything draws under the current ctx transform (no setTransform), so the same
// picture can sit in card I's engraving box on the table (ink on cream) and fill the frame (colour) — the fly-in is one picture.
//
// WORLD  metres. X right (east), Y up, Z away from the camera's start (north). Camera = the table's tcam (pos, pitch, yaw, f).
//   LEFT  (az < 0.2): the solar fields (rows of panels to the horizon), a coal plant far left (two stacks, a cooling tower, smoke),
//         wind turbines on the far hills; the sun high in the south-west.
//   RIGHT (az ≈ .4 … 1.1): the Sonoran desert with saguaros, a long low DATA CENTER (c02's engraved hall: ribs, cool vents, roof fans,
//         waste heat), pylons and a power line into PHOENIX: a grid city of street lights and lit homes, a few downtown towers, the
//         mountains behind; one family home in the near desert (the warm window).
//
//   landCam({ x, y, z, yaw, pitch, f })      → the table's tcam (horizon, p, poly …)
//   pal(ev, ink) → palette   ev 0 noon · 1 golden sunset · 2 blue hour;  ink 0 colour · 1 engraving ink on cream (the card)
//   land(ctx, t, cam, st) → anchors (screen points for the scene's labels)
//     st: { ev, ink, sun: { az, el }, race 0..1 (years drawn 2000→2025), raceA 1, cross 0..1 (flash at the overtake), grow 0..1 (new clean
//           rows + turbines: all of the growth), dcOn 0..1, dcDim 0..1 (cut by a quarter), load 0..1 (the city's demand curve drawn on),
//           head 0..1 (the evening running along it), bracket 0..1 (3 hours), strain 0..1 (the wires and the peak glow), ticks 0..1,
//           lights 0..1 (city windows), home 0..1 (the family window) }
//   landInk(g, t)                             card I's engraving (ink, the entry camera) in picture px — for the cached card back
//   ENTRY                                     the entry camera (as seen in the card box)
import { W, H, rgba, clamp, lin, mix, sm, prng, text } from '../engine.mjs';
import { ease, n1 } from './f7_kit.mjs';
import { tcam } from './f7_c09_table.mjs';
import { figureFlat, POSES } from './figure.mjs';

const TAU = Math.PI * 2;
export const landCam = (c) => tcam({ x: c.x, y: c.y, z: c.z, pitch: c.pitch ?? 0, yaw: c.yaw ?? 0, f: c.f ?? 1600 });
export const ENTRY = { x: 0, y: 30, z: 0, yaw: -.06, pitch: .07, f: 1500 };

// ---------------------------------------------------------------- palette
const hx = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const K = ['sky0', 'sky1', 'sky2', 'sun', 'glow', 'far', 'farRim', 'mid', 'midRim', 'g0', 'g1', 'furrow', 'panel', 'panelHi', 'grid', 'coal', 'smoke', 'sand', 'cactus', 'cactusRim', 'dc', 'dcRim', 'city', 'win', 'road', 'ink', 'wire', 'stucco'];
const mk = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'string' ? hx(v) : v]));
const DAY = mk({ sky0: '#6f9cc8', sky1: '#b4cde2', sky2: '#e6ebe6', sun: '#fffdf6', glow: '#ffe9b0', far: '#a9b5c6', farRim: '#f2f5f7', mid: '#a3a184', midRim: '#efe8cc', g0: '#d2c497', g1: '#ad9868', furrow: '#6e5c3e',
  panel: '#33496a', panelHi: '#d8ecfa', grid: '#9fb8d6', coal: '#80838b', smoke: '#b4b8be', sand: '#d9c08c', cactus: '#4b5a3a', cactusRim: '#f3e2a6', dc: '#5d6680', dcRim: '#e3e9f2', city: '#bba886', win: '#ffd890',
  road: '#ffe2a6', ink: '#2a2420', wire: '#3a3a48', stucco: '#d8c09a', hatchA: .05, furrowA: .16, glowA: 1, lights: 0, stars: 0, vent: .25 });
const GOLD = mk({ sky0: '#3a3e7a', sky1: '#c4867a', sky2: '#f4c27c', sun: '#fff3d6', glow: '#ffb35c', far: '#5d4b70', farRim: '#ffcf8a', mid: '#4b3d58', midRim: '#f0ad72', g0: '#8e6c58', g1: '#4b3a40', furrow: '#2a2030',
  panel: '#383352', panelHi: '#ffcf8a', grid: '#c99a7a', coal: '#4a4048', smoke: '#8c7c7c', sand: '#9e7658', cactus: '#2a2230', cactusRim: '#ffb35c', dc: '#2e2c46', dcRim: '#f1c27a', city: '#5c4852', win: '#ffcf86',
  road: '#ffc070', ink: '#1a1424', wire: '#2a2030', stucco: '#b58a6a', hatchA: .06, furrowA: .22, glowA: 1, lights: .45, stars: 0, vent: .55 });
const DUSK = mk({ sky0: '#0d1434', sky1: '#37336e', sky2: '#c48078', sun: '#fff3d6', glow: '#e8906a', far: '#211c40', farRim: '#c98a7a', mid: '#1a1634', midRim: '#8a6a8a', g0: '#2a2238', g1: '#120f22', furrow: '#06050e',
  panel: '#1e1c34', panelHi: '#7a6a9a', grid: '#5a5a8a', coal: '#1e1a2c', smoke: '#3a3448', sand: '#2e2638', cactus: '#0c0a16', cactusRim: '#8a6a9a', dc: '#17162e', dcRim: '#9a8ac8', city: '#1c182c', win: '#ffcf86',
  road: '#ffb35c', ink: '#05040c', wire: '#0a0812', stucco: '#3a3044', hatchA: .07, furrowA: .3, glowA: .55, lights: 1, stars: .7, vent: 1 });
const INKP = mk({ sky0: '#efe6cf', sky1: '#efe6cf', sky2: '#efe6cf', sun: '#f8f1df', glow: '#efe6cf', far: '#ddd1b3', farRim: '#2a2420', mid: '#d2c5a5', midRim: '#2a2420', g0: '#e6dabd', g1: '#d8caa8', furrow: '#2a2420',
  panel: '#8f8370', panelHi: '#2a2420', grid: '#2a2420', coal: '#a99b80', smoke: '#d6caad', sand: '#e6dabd', cactus: '#2a2420', cactusRim: '#efe6cf', dc: '#8a7e6a', dcRim: '#2a2420', city: '#cfc2a2', win: '#efe6cf',
  road: '#efe6cf', ink: '#2a2420', wire: '#2a2420', stucco: '#e6dabd', hatchA: .32, furrowA: .55, glowA: 0, lights: 0, stars: 0, vent: 0 });
const mixP = (A, B, u) => { const o = {}; for (const k in A) o[k] = Array.isArray(A[k]) ? A[k].map((v, i) => v + (B[k][i] - v) * u) : A[k] + (B[k] - A[k]) * u; return o; };
export function pal(ev = 0, ink = 0) { const e = clamp(ev, 0, 2), base = e <= 1 ? mixP(DAY, GOLD, sm(e)) : mixP(GOLD, DUSK, sm(e - 1)); return ink > 0 ? mixP(base, INKP, clamp(ink)) : base; }
const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mixc = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);

// ---------------------------------------------------------------- geometry helpers
const dirPt = (cam, az, el, d = 1e6) => cam.p(cam.x + Math.sin(az) * Math.cos(el) * d, cam.y + Math.sin(el) * d, cam.z + Math.cos(az) * Math.cos(el) * d);
function seg(ctx, cam, a, b) {   // near-clipped segment a→b (world), moveTo/lineTo into the current path
  const A = cam.toC(...a), B = cam.toC(...b), n = .5; if (A[2] < n && B[2] < n) return;
  let P = A, Q = B; if (P[2] < n) { const q = (n - P[2]) / (Q[2] - P[2]); P = [mix(P[0], Q[0], q), mix(P[1], Q[1], q), n]; } if (Q[2] < n) { const q = (n - P[2]) / (Q[2] - P[2]); Q = [mix(P[0], Q[0], q), mix(P[1], Q[1], q), n]; }
  ctx.moveTo(W / 2 + P[0] * cam.f / P[2], H / 2 - P[1] * cam.f / P[2]); ctx.lineTo(W / 2 + Q[0] * cam.f / Q[2], H / 2 - Q[1] * cam.f / Q[2]);
}
const fillP = (ctx, P) => { if (P.length < 3) return false; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); return true; };
const vis = (q, m = 60) => q[3] > 1 && q[0] > -m && q[0] < W + m && q[1] > -m && q[1] < H + m;

// ---------------------------------------------------------------- static scene data
const RIDGE_FAR = (() => { const o = []; for (let a = -1.6; a <= 2.2; a += .008) { const h = 260 + 230 * Math.abs(n1(a * 4.1 + 2)) + 120 * n1(a * 13 + 7) * .5 + 140 * Math.max(0, Math.sin((a - .55) * 5)) * (a > .3 && a < 1.2 ? 1 : 0); o.push([a, h]); } return o; })();
const RIDGE_MID = (() => { const o = []; for (let a = -1.6; a <= 2.2; a += .006) { let h = 55 + 70 * Math.abs(n1(a * 7 + 11)) + 18 * n1(a * 31); if (a > .62 && a < .92) h += 190 * Math.pow(Math.sin(Math.PI * (a - .62) / .3), 1.6) * (1 + .25 * n1(a * 40)); o.push([a, h]); } return o; })();   // a camel-backed peak behind the city
// solar rows: geometric spacing in Z (constant screen rhythm), two fields with a service road between; a third field = the new growth
const ROWS = (() => { const o = []; let z = 70; while (z < 1500) { o.push(z); z = z * 1.034 + 4.5; } return o; })();
const FIELDS = [[-900, -70], [-40, 460]], NEWF = [500, 820];
// turbines on the far hills (the last ones rise with the growth)
const TURB = [[-1500, 3900, 0], [-1150, 4200, 0], [-650, 4500, 0], [700, 3600, .1], [1050, 3900, .35], [1350, 3500, .6], [1650, 4100, .85]];
// saguaros in the near desert (x, z, height, arms seed)
const CACTI = (() => { const r = prng(6061), o = []; for (let i = 0; i < 70; i++) { const x = 380 + r() * 1300, z = 160 + Math.pow(r(), 1.4) * 1300; if (x > 1080 && x < 1720 && z > 1150) continue; o.push([x, z, 7 + r() * 7, Math.floor(r() * 1000)]); } o.push([742, 405, 11, 17], [705, 438, 8, 5]); return o; })();
const STIP = (() => { const r = prng(6071), o = []; for (let i = 0; i < 900; i++) o.push([330 + r() * 1800, 120 + Math.pow(r(), 1.6) * 1600, r()]); return o; })();
// the data center (c02's hall in the desert): a long low box, roof fans in two rows
export const DC = { x0: 1120, x1: 1480, z0: 1260, z1: 1340, h: 18 };
const FANS = (() => { const o = []; for (let i = 0; i < 12; i++) for (let j = 0; j < 2; j++) o.push([DC.x0 + 20 + i * (DC.x1 - DC.x0 - 40) / 11, DC.z0 + 22 + j * 36]); return o; })();
const PYLONS = [[1500, 1300], [1660, 1450], [1820, 1600], [1980, 1750], [2140, 1900]];
// Phoenix: a grid of streets (lights every ~40 m), homes in the blocks, downtown towers
const CITY = { x0: 1000, x1: 5200, z0: 1550, z1: 6200 };
const STREET = (() => { const r = prng(7071), o = []; for (let x = CITY.x0; x <= CITY.x1; x += 160) for (let z = CITY.z0 + 20; z < CITY.z1; z += 40) o.push([x + (r() - .5) * 3, z, r()]);
  for (let z = CITY.z0; z <= CITY.z1; z += 160) for (let x = CITY.x0 + 20; x < CITY.x1; x += 40) o.push([x, z + (r() - .5) * 3, r()]); return o; })();
const HOMES = (() => { const r = prng(7072), o = []; for (let i = 0; i < 4200; i++) { const x = CITY.x0 + r() * (CITY.x1 - CITY.x0), z = CITY.z0 + Math.pow(r(), .8) * (CITY.z1 - CITY.z0); if ((x - CITY.x0) % 160 < 18 || (z - CITY.z0) % 160 < 18) continue; if (x < 1520 && z < 1420) continue; o.push([x, z, r(), r()]); } return o; })();
const TOWERS = [[3050, 3900, 120, 48], [3120, 3990, 165, 44], [3200, 3870, 95, 56], [2980, 4060, 140, 42], [3260, 4020, 110, 50], [3150, 4130, 190, 40], [2910, 3930, 80, 52], [3330, 3940, 70, 60], [2850, 4010, 60, 58]];
// the family home in the near desert
export const HOME = { x: 1150, z: 820, w: 16, d: 11, h: 4.6 };

// ---------------------------------------------------------------- the race (Ember, global electricity share %, 2000–2025; 2025: 33.8 vs 33.0)
const COAL = [[2000, 38.5], [2004, 40.0], [2008, 41.0], [2011, 40.6], [2014, 39.6], [2017, 38.2], [2020, 35.6], [2022, 35.8], [2023, 35.5], [2024, 34.4], [2025, 33.0]];
const REN = [[2000, 18.4], [2004, 17.9], [2008, 18.4], [2011, 20.2], [2014, 22.4], [2017, 24.6], [2020, 28.2], [2022, 29.4], [2023, 30.2], [2024, 32.0], [2025, 33.8]];
const at = (D, y) => { if (y <= D[0][0]) return D[0][1]; for (let i = 1; i < D.length; i++) if (y <= D[i][0]) { const p0 = D[Math.max(0, i - 2)], p1 = D[i - 1], p2 = D[i], p3 = D[Math.min(D.length - 1, i + 1)], u = (y - p1[0]) / (p2[0] - p1[0]);
  const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * (p2[0] - p1[0]), m2 = (p3[1] - p1[1]) / (p3[0] - p1[0] || 1) * (p2[0] - p1[0]), u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * p1[1] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[1] + (u3 - u2) * m2; } return D[D.length - 1][1]; };
export const RACE = { a0: -.42, a1: .12, y0: 2000, y1: 2025, e0: .09, e1: .27, s0: 15, s1: 42, cross: 2024.75 };
const raceAz = (y) => mix(RACE.a0, RACE.a1, (y - RACE.y0) / (RACE.y1 - RACE.y0)), raceEl = (s) => mix(RACE.e0, RACE.e1, (s - RACE.s0) / (RACE.s1 - RACE.s0));
// the city's demand on a May day (noon → night): a gentle rise to the evening peak (~6–9 pm), then down
export const LOAD = { a0: .6, a1: .98, e0: .085, e1: .19 };
const loadV = (s) => .25 + .55 * Math.pow(Math.sin(Math.PI * clamp((s - .05) / .95) * .92), 1.4) * (1 + .25 * Math.exp(-((s - .62) ** 2) / .02)) - .08 * s * s;
export const PEAK = [.5, .76];   // the 3-hour bracket on the curve (s range)

// ---------------------------------------------------------------- draw
export function land(ctx, t, cam, st = {}) {
  const P = pal(st.ev ?? 0, st.ink ?? 0), ink = st.ink ?? 0, A = {};
  const hz = cam.horizon;
  // sky
  { const g = ctx.createLinearGradient(0, Math.min(hz - 900, -200), 0, hz + 2); g.addColorStop(0, css(P.sky0)); g.addColorStop(.62, css(P.sky1)); g.addColorStop(1, css(P.sky2)); ctx.fillStyle = g; ctx.fillRect(-10, -10, W + 20, Math.max(0, hz + 12)); }
  // engraved sky: horizontal lines, denser and darker toward the top (the card's look; faint in colour)
  { ctx.fillStyle = css(P.ink, P.hatchA); const top = -10; for (let y = hz - 6, gap = 7; y > top; y -= gap, gap = Math.min(16, gap * 1.035)) ctx.fillRect(-10, y, W + 20, 1.6 * (1 + ink)); }
  // stars at the blue hour
  if (P.stars > .02) { const r = prng(91); for (let i = 0; i < 240; i++) { const az = -1.6 + r() * 3.6, el = .05 + r() * .5, q = dirPt(cam, az, el), tw = .5 + .5 * Math.sin(t * (.6 + r()) + i); if (q[1] > hz - 30 || !vis(q, 5)) continue; ctx.fillStyle = `rgba(243,239,226,${P.stars * (.25 + .6 * tw) * clamp((hz - 30 - q[1]) / 200)})`; ctx.fillRect(q[0], q[1], 1.6, 1.6); } }
  // the sun
  const sun = st.sun ?? { az: -.16, el: .2 }, S = dirPt(cam, sun.az, sun.el), sk = cam.f / 1600;
  if (S[3] > 0) {
    const rs = 30 * sk, br = 1 + .03 * Math.sin(t * 1.7);
    if (P.glowA > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [r, a] of [[900, .16], [380, .22], [140, .35]]) { const g = ctx.createRadialGradient(S[0], S[1], 0, S[0], S[1], r * sk * br); g.addColorStop(0, css(P.glow, a * P.glowA)); g.addColorStop(1, css(P.glow, 0)); ctx.fillStyle = g; ctx.fillRect(S[0] - r * sk * br, S[1] - r * sk * br, 2 * r * sk * br, 2 * r * sk * br); } ctx.restore(); }
    // engraved rays (ink: the classic engraved sun; colour: faint)
    ctx.strokeStyle = css(P.ink, .12 + .55 * ink); ctx.lineWidth = (1.2 + 1.6 * ink) * sk; ctx.beginPath();
    for (let i = 0; i < 48; i++) { const a = i / 48 * TAU + t * .01, r0 = rs * 1.45, r1 = rs * (i % 2 ? 2.1 : 2.9); ctx.moveTo(S[0] + Math.cos(a) * r0, S[1] + Math.sin(a) * r0); ctx.lineTo(S[0] + Math.cos(a) * r1, S[1] + Math.sin(a) * r1); }
    ctx.stroke();
    ctx.fillStyle = css(P.sun); ctx.beginPath(); ctx.arc(S[0], S[1], rs, 0, TAU); ctx.fill();
    if (ink > .02) { ctx.strokeStyle = css(P.ink, .9 * ink); ctx.lineWidth = 2.6 * sk; ctx.stroke(); ctx.lineWidth = 1.2 * sk; ctx.beginPath(); ctx.arc(S[0], S[1], rs * .72, 0, TAU); ctx.stroke(); }
    A.sun = [S[0], S[1]];
  }
  // far mountains, then the mid hills (silhouettes at their distance, rim light, engraved strokes)
  ridge(ctx, cam, RIDGE_FAR, 9000, P.far, P.farRim, P, .5, 11);
  ridge(ctx, cam, RIDGE_MID, 3900, P.mid, P.midRim, P, .7, 12);
  // the ground
  { const g = ctx.createLinearGradient(0, hz, 0, H + 10); g.addColorStop(0, css(P.g0)); g.addColorStop(1, css(P.g1)); ctx.fillStyle = g; ctx.fillRect(-10, Math.max(-10, hz), W + 20, H + 20 - Math.max(-10, hz)); }
  // turbines and the coal plant stand on the far ground
  turbines(ctx, t, cam, P, st.grow ?? 0);
  coalPlant(ctx, t, cam, P, st);
  // furrows: engraved lines across the land, in perspective
  { ctx.strokeStyle = css(P.furrow, P.furrowA); ctx.lineWidth = 1 + ink; ctx.beginPath(); let z = 40; while (z < 9000) { seg(ctx, cam, [-4000, 0, z], [6000, 0, z]); z = z * 1.06 + 3; } ctx.stroke(); }
  // the desert: stipple and the city glow at the horizon
  desert(ctx, t, cam, P);
  if (P.lights > .01 || (st.lights ?? 0) > 0) city(ctx, t, cam, P, st, A);
  solar(ctx, t, cam, P, st, sun);
  cacti(ctx, t, cam, P, sun, 0);
  dataCenter(ctx, t, cam, P, st, A);
  home(ctx, t, cam, P, st, A);
  cacti(ctx, t, cam, P, sun, 1);
  if ((st.race ?? 0) > 0) race(ctx, t, cam, P, st, A);
  if ((st.load ?? 0) > 0) loadCurve(ctx, t, cam, P, st, A);
  return A;
}

function ridge(ctx, cam, R, dist, col, rim, P, rimA, seed) {
  const top = [], base = [];
  for (const [a, h] of R) { const X = Math.sin(a) * dist, Z = Math.cos(a) * dist, q = cam.p(X, h, Z), b = cam.p(X, 0, Z); if (q[3] < 1) continue; if (q[0] < -200 || q[0] > W + 200) continue; top.push([q[0], q[1]]); base.push([b[0], b[1] + 2]); }
  if (top.length < 2) return;
  ctx.beginPath(); top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); for (let i = base.length - 1; i >= 0; i--) ctx.lineTo(base[i][0], base[i][1]); ctx.closePath(); ctx.fillStyle = css(col); ctx.fill();
  ctx.strokeStyle = css(rim, rimA); ctx.lineWidth = 1.4; ctx.beginPath(); top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  // engraved strokes down the slopes
  ctx.strokeStyle = css(P.ink, .1 + P.hatchA); ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i < top.length; i += 2) { const [x, y] = top[i], b = base[i][1], L = (b - y) * (.25 + .5 * Math.abs(n1(i * .37 + seed))); if (L < 3) continue; ctx.moveTo(x, y + 3); ctx.lineTo(x - L * .35, y + L); }
  ctx.stroke();
}

function turbines(ctx, t, cam, P, grow) {
  for (const [x, z, g0] of TURB) {
    const u = g0 === 0 ? 1 : ease.out(clamp((grow - g0 * .8) / .3)); if (u <= 0) continue;
    const hgt = 105 * u, b = cam.p(x, 0, z), tp = cam.p(x, hgt, z); if (!vis(b, 200)) continue;
    const k = b[2];
    ctx.strokeStyle = css(mixc(P.far, P.ink, .25)); ctx.lineWidth = Math.max(1, 3.2 * k); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(tp[0], tp[1]); ctx.stroke();
    if (u < .98) continue;
    const ang = t * 1.1 + x * .01, L = 48 * k; ctx.lineWidth = Math.max(.8, 2.2 * k); ctx.beginPath();
    for (let i = 0; i < 3; i++) { const a = ang + i * TAU / 3; ctx.moveTo(tp[0], tp[1]); ctx.lineTo(tp[0] + Math.cos(a) * L, tp[1] + Math.sin(a) * L); }
    ctx.stroke(); ctx.fillStyle = css(mixc(P.far, P.ink, .25)); ctx.fillRect(tp[0] - 3 * k, tp[1] - 2 * k, 7 * k, 4 * k);
  }
}

const PUFFS = (() => { const r = prng(808), o = []; for (let i = 0; i < 26; i++) o.push([r(), r(), r()]); return o; })();
function coalPlant(ctx, t, cam, P, st) {
  const X = -1250, Z = 2700, b = cam.p(X, 0, Z); if (b[3] < 1 || b[0] < -500 || b[0] > W + 300) return;
  const box = (x0, x1, z0, z1, h, col) => { const F = cam.poly([[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0]]); if (fillP(ctx, F)) { ctx.fillStyle = css(col); ctx.fill(); ctx.strokeStyle = css(P.ink, .35); ctx.lineWidth = 1; ctx.stroke(); } };
  const dim = mixc(P.coal, P.ink, .15);
  box(X - 120, X + 60, Z, Z + 60, 45, P.coal); box(X - 40, X + 20, Z - 4, Z + 30, 70, dim);
  // cooling tower (hyperboloid outline)
  { const c = cam.p(X + 170, 0, Z + 40), k = c[2], h = 120 * k, r0 = 48 * k, r1 = 30 * k, rt = 34 * k; ctx.beginPath(); ctx.moveTo(c[0] - r0, c[1]); ctx.quadraticCurveTo(c[0] - r1 * .9, c[1] - h * .6, c[0] - rt, c[1] - h); ctx.lineTo(c[0] + rt, c[1] - h); ctx.quadraticCurveTo(c[0] + r1 * .9, c[1] - h * .6, c[0] + r0, c[1]); ctx.closePath(); ctx.fillStyle = css(P.coal); ctx.fill(); ctx.strokeStyle = css(P.ink, .35); ctx.lineWidth = 1; ctx.stroke();
    ctx.strokeStyle = css(P.ink, .14); ctx.beginPath(); for (let i = 1; i < 6; i++) { const x = c[0] - r0 + 2 * r0 * i / 6; ctx.moveTo(x, c[1]); ctx.lineTo(mix(x, c[0], .3), c[1] - h); } ctx.stroke();
    puffs(ctx, t, c[0], c[1] - h, k, P, 1.4, 0); }
  // two stacks
  for (const dx of [-90, -60]) { const a = cam.p(X + dx, 0, Z + 20), q = cam.p(X + dx, 175, Z + 20), k = a[2]; ctx.fillStyle = css(dim); ctx.fillRect(q[0] - 4 * k, q[1], 8 * k, a[1] - q[1]); ctx.fillStyle = css(P.ink, .3); ctx.fillRect(q[0] - 4 * k, q[1] + 8 * k, 8 * k, 3 * k); puffs(ctx, t, q[0], q[1], k, P, .8, dx); }
}
function puffs(ctx, t, x, y, k, P, s, seed) {
  for (let i = 0; i < 9; i++) { const [a, b, c] = PUFFS[(i + Math.abs(seed)) % PUFFS.length], ph = ((t * .09 + a + i / 9) % 1), r = (10 + 40 * ph) * k * s, px = x + (ph * 160 + 12 * Math.sin(t * .3 + b * 6)) * k * s, py = y - (ph * 90 + 6 * c) * k * s;
    ctx.fillStyle = css(P.smoke, .3 * (1 - ph) * (.6 + .4 * c)); ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill(); }
}

function desert(ctx, t, cam, P) {
  ctx.fillStyle = css(mixc(P.sand, P.ink, .45), .35);
  for (const [x, z, r] of STIP) { const q = cam.p(x, 0, z); if (!vis(q, 2)) continue; const s = clamp(q[2] * 1.2, .6, 3); ctx.fillRect(q[0], q[1], s * (1 + r), s * .6); }
}

function solar(ctx, t, cam, P, st, sun) {
  const grow = st.grow ?? 0, glintAz = sun.az;
  const field = (x0, x1, z, rowU, glint) => {
    const F = cam.poly([[x0, 1, z], [x1, 1, z], [x1, 2.9, z + 3.2], [x0, 2.9, z + 3.2]]); if (!fillP(ctx, F)) return null;
    ctx.fillStyle = css(P.panel); ctx.fill();
    const a = cam.p(x0, 2.9, z + 3.2), b = cam.p(x1, 2.9, z + 3.2);
    return [a, b, F];
  };
  const rows = [];
  for (let i = ROWS.length - 1; i >= 0; i--) {
    const z = ROWS[i];
    for (const [x0, x1] of FIELDS) { const r = field(x0, x1, z); if (r) rows.push([r, x0, x1, z]); }
    if (grow > 0) { const g = ease.out(clamp((grow * 1.25 - (ROWS.length - i) / ROWS.length * .25) / .7)); if (g > 0) { const r = field(NEWF[0], mix(NEWF[0], NEWF[1], g), z); if (r) rows.push([r, NEWF[0], mix(NEWF[0], NEWF[1], g), z, g]); } }
  }
  // the glint along the upper edges (the sun on glass), the cell grid on the near rows
  ctx.lineWidth = 1.2; ctx.strokeStyle = css(P.panelHi, .7); ctx.beginPath();
  for (const [[a, b]] of rows) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } ctx.stroke();
  // cell grid: per-row alpha by projected cell width, so receding rows thin out instead of shimmering (moiré under the riso)
  ctx.lineWidth = 1;
  for (const [[a, b, F], x0, x1, z] of rows) { if (z > 260) continue; const sp = Math.abs(b[0] - a[0]) * 4.5 / Math.max(1, x1 - x0), al = .55 * clamp((sp - 7) / 9); if (al <= .01) continue;
    ctx.strokeStyle = css(P.grid, al); ctx.beginPath(); const n = Math.floor((x1 - x0) / 4.5); for (let j = 1; j < n; j++) { const x = x0 + j * 4.5; seg(ctx, cam, [x, 1, z], [x, 2.9, z + 3.2]); } ctx.stroke(); }
  // the new rows catch the light as they unroll (all of the growth is clean)
  if (grow > 0 && grow < 1.6) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = css(P.panelHi, .5 * Math.sin(Math.PI * clamp(grow / 1.4))); ctx.lineWidth = 2.2; ctx.beginPath(); for (const r of rows) if (r[4] !== undefined && r[4] < 1) { const [a, b] = r[0]; ctx.moveTo(b[0] - 18, b[1]); ctx.lineTo(b[0], b[1]); } ctx.stroke(); ctx.restore(); }
}

function cacti(ctx, t, cam, P, sun, near) {
  const lit = Math.sin(sun.az - cam.yaw) < 0 ? -1 : 1;
  for (const [x, z, h, sd] of CACTI) {
    if ((Math.hypot(x - cam.x, z - cam.z) < 150) !== !!near) continue;
    const b = cam.p(x, 0, z); if (!vis(b, 160)) continue; const k = b[2], hp = h * k; if (hp < 2) continue;
    const tw = Math.max(1, .8 * k), aw = Math.max(.8, .58 * k), top = b[1] - hp;
    ctx.strokeStyle = css(P.cactus); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = tw; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0], top + tw * .5); ctx.stroke();
    if (hp > 9) {
      const r = prng(sd + 3), na = 1 + sd % 3; ctx.lineWidth = aw; ctx.beginPath();
      for (let i = 0; i < na; i++) { const side = (i % 2 ? 1 : -1) * (sd % 2 ? 1 : -1), y0 = b[1] - hp * (.32 + .22 * r()), out = hp * (.13 + .06 * r()), up = hp * (.22 + .2 * r());
        ctx.moveTo(b[0], y0); ctx.quadraticCurveTo(b[0] + side * out, y0, b[0] + side * out, y0 - out * .9); ctx.lineTo(b[0] + side * out, y0 - out * .9 - up); }
      ctx.stroke();
    }
    if (tw > 2.5) { ctx.strokeStyle = css(P.cactusRim, .5); ctx.lineWidth = Math.max(.8, tw * .16); ctx.beginPath(); ctx.moveTo(b[0] + lit * tw * .28, b[1] - tw); ctx.lineTo(b[0] + lit * tw * .28, top + tw); ctx.stroke(); }
  }
}

function dataCenter(ctx, t, cam, P, st, A) {
  const { x0, x1, z0, z1, h } = DC, b = cam.p((x0 + x1) / 2, 0, z0); if (b[3] < 1 || b[0] < -900 || b[0] > W + 900) return;
  const on = st.dcOn ?? 1, dim = st.dcDim ?? 0, pw = on * (1 - .25 * dim);
  // power lines from the hall into the city (pylons on the desert)
  pylonsAndWires(ctx, t, cam, P, st);
  // contact shadow + faces
  const front = cam.poly([[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0]]), side = cam.poly([[x0, 0, z1], [x0, 0, z0], [x0, h, z0], [x0, h, z1]]), roof = cam.poly([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]]);
  if (fillP(ctx, side)) { ctx.fillStyle = css(mixc(P.dc, P.ink, .35)); ctx.fill(); }
  if (fillP(ctx, roof)) { ctx.fillStyle = css(mixc(P.dc, P.dcRim, .12)); ctx.fill(); ctx.strokeStyle = css(P.dcRim, .45); ctx.lineWidth = 1; ctx.stroke(); }
  if (fillP(ctx, front)) { ctx.fillStyle = css(P.dc); ctx.fill(); }
  // engraved ribs on the cladding
  ctx.strokeStyle = css(P.ink, .3); ctx.lineWidth = 1; ctx.beginPath(); for (let x = x0 + 6; x < x1; x += 6) seg(ctx, cam, [x, .3, z0 - .05], [x, h - .3, z0 - .05]); ctx.stroke();
  ctx.strokeStyle = css(P.dcRim, .5); ctx.lineWidth = 1.2; ctx.beginPath(); seg(ctx, cam, [x0, h, z0], [x1, h, z0]); ctx.stroke();
  // vents: two bands of slits that glow cool while the chips run (dim by a quarter at the cut)
  const vA = clamp(P.vent * pw);
  if (vA > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [y0, y1] of [[11.5, 13.5], [6.5, 8.5]]) { ctx.fillStyle = `rgba(207,228,255,${.42 * vA})`; for (let x = x0 + 5; x < x1 - 5; x += 15) { const Q = cam.poly([[x, y0, z0 - .1], [x + 3.2, y0, z0 - .1], [x + 3.2, y1, z0 - .1], [x, y1, z0 - .1]]); if (fillP(ctx, Q)) ctx.fill(); } } ctx.restore(); }
  // roof fans (turning; they slow at the cut) and the waste heat above them
  const sp = .6 + 6 * pw, rr = 9;
  for (const [fx, fz] of FANS) {
    const c = cam.p(fx, h + .6, fz), k = c[2]; if (c[3] < 1) continue; const R = rr * k;
    const ex = cam.p(fx + rr, h + .6, fz), ez = cam.p(fx, h + .6, fz + rr), ax = [ex[0] - c[0], ex[1] - c[1]], az = [ez[0] - c[0], ez[1] - c[1]];
    ctx.fillStyle = css(mixc(P.dc, P.ink, .4)); ctx.beginPath(); for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU; ctx.lineTo(c[0] + ax[0] * Math.cos(a) + az[0] * Math.sin(a), c[1] + ax[1] * Math.cos(a) + az[1] * Math.sin(a)); } ctx.fill();
    ctx.strokeStyle = css(P.dcRim, .5); ctx.lineWidth = 1; ctx.stroke();
    const ang = t * sp + fx * .1; ctx.strokeStyle = css(P.dcRim, .65); ctx.beginPath(); for (let i = 0; i < 4; i++) { const a = ang + i * TAU / 4; ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + (ax[0] * Math.cos(a) + az[0] * Math.sin(a)) * .85, c[1] + (ax[1] * Math.cos(a) + az[1] * Math.sin(a)) * .85); } ctx.stroke();
    if (pw > .05 && R > 2) { ctx.strokeStyle = css(P.glow, .18 * pw * ((st.ev ?? 0) > .3 ? 1 : .5)); ctx.lineWidth = 1; for (let kk = 0; kk < 2; kk++) { const ph = ((t / 2.4 + fx * .013 + kk * .5) % 1); ctx.beginPath(); for (let q = 0; q <= 6; q++) ctx[q ? 'lineTo' : 'moveTo'](c[0] + Math.sin(q * 1.2 + t * 4 + fx) * R * .25 + (kk - .5) * R * .6, c[1] - R - ph * R * 5 - q * R * .5); ctx.stroke(); } }
  }
  // the cool glow the hall throws on the evening air (a quarter less at the cut)
  if (P.vent > .3) { const c = cam.p((x0 + x1) / 2, h, z0), R = 260 * c[2]; if (R > 4) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g.addColorStop(0, `rgba(170,200,255,${.22 * P.vent * pw})`); g.addColorStop(1, 'rgba(170,200,255,0)'); ctx.fillStyle = g; ctx.fillRect(c[0] - R, c[1] - R, 2 * R, 2 * R); ctx.restore(); } }
  // anchors: the hall's top-left (labels) and its front centre
  const tl = cam.p(x0, h, z0), tr = cam.p(x1, h, z0); A.dc = [(tl[0] + tr[0]) / 2, Math.min(tl[1], tr[1])]; A.dcL = [tl[0], tl[1]]; A.dcR = [tr[0], tr[1]];
  // the jobs: a row of small lamps along the hall's front, each gets a tick (every job met its target)
  const tk = st.ticks ?? 0;
  if (tk > 0) { const n = 8; for (let i = 0; i < n; i++) { const u = clamp((tk * (n + 2) - i) / 2); if (u <= 0) continue; const x = mix(x0 + 30, x1 - 30, i / (n - 1)), q = cam.p(x, h + 7, z0), k = clamp(q[2] * .7, .5, 2.2); ctx.strokeStyle = `rgba(236,244,214,${.95 * ease.out(u)})`; ctx.lineWidth = Math.max(1.4, 1.8 * k); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(q[0] - 4 * k, q[1]); ctx.lineTo(q[0] - 1 * k, q[1] + 3 * k); ctx.lineTo(q[0] + 5 * k * ease.out(u), q[1] - 5 * k * ease.out(u)); ctx.stroke(); } }
}

function pylonsAndWires(ctx, t, cam, P, st) {
  const strain = st.strain ?? 0, hh = 32, tops = [];
  const start = [DC.x1, 10, (DC.z0 + DC.z1) / 2];
  for (const [x, z] of PYLONS) {
    const b = cam.p(x, 0, z), tp = cam.p(x, hh, z); tops.push([x, hh - 4, z]); if (b[3] < 1) continue; const k = b[2];
    ctx.strokeStyle = css(mixc(P.wire, P.ink, .2)); ctx.lineWidth = Math.max(1, 1.6 * k); ctx.beginPath(); const w = 4 * k;
    ctx.moveTo(b[0] - w, b[1]); ctx.lineTo(tp[0], tp[1]); ctx.lineTo(b[0] + w, b[1]); const cy = mix(tp[1], b[1], .2); ctx.moveTo(tp[0] - w * 1.4, cy); ctx.lineTo(tp[0] + w * 1.4, cy);
    for (let q = 1; q < 4; q++) { const y1 = mix(b[1], tp[1], q / 4), y0 = mix(b[1], tp[1], (q - 1) / 4); ctx.moveTo(mix(b[0] - w, tp[0], (q - 1) / 4), y0); ctx.lineTo(mix(b[0] + w, tp[0], q / 4), y1); }
    ctx.stroke();
  }
  const pts = [start, ...tops, [CITY.x0 + 400, 8, 2100]];
  const wire = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; for (let j = 0; j <= 10; j++) { const q = j / 10; wire.push([mix(a[0], b[0], q), mix(a[1], b[1], q) - Math.sin(Math.PI * q) * 3.5, mix(a[2], b[2], q)]); } }
  const S = wire.map((p) => cam.p(...p)).filter((q) => q[3] > 1);
  for (const off of [0, 1]) {
    ctx.strokeStyle = css(P.wire, .8); ctx.lineWidth = 1; ctx.beginPath(); S.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + off * 3) : ctx.moveTo(x, y + off * 3))); ctx.stroke();
  }
  if (strain > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [lw, al] of [[6, .1], [2, .45]]) { ctx.strokeStyle = `rgba(255,179,92,${al * strain * (.85 + .15 * Math.sin(t * 9))})`; ctx.lineWidth = lw; ctx.beginPath(); S.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); } ctx.restore(); }
}

function city(ctx, t, cam, P, st, A) {
  const L = clamp(Math.max(P.lights, st.lights ?? 0)), hz = cam.horizon;
  // the city's glow on the horizon
  { const c = cam.p(3100, 0, 3900); if (c[3] > 1) { const R = 900 * (cam.f / 1600); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g.addColorStop(0, `rgba(255,190,120,${.2 * L})`); g.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = g; ctx.translate(c[0], c[1]); ctx.scale(1, .5); ctx.translate(-c[0], -c[1]); ctx.fillRect(c[0] - R, c[1] - R, 2 * R, 2 * R); ctx.restore(); } }
  // homes: small dark blocks with a warm window each
  ctx.fillStyle = css(P.city); const wins = [];
  for (const [x, z, r, r2] of HOMES) { const q = cam.p(x, 0, z); if (!vis(q, 4)) continue; const k = q[2], w = Math.max(1.2, 14 * k), hh = Math.max(.8, 5 * k); ctx.fillRect(q[0] - w / 2, q[1] - hh, w, hh); if (r2 < .75) wins.push([q[0] + (r - .5) * w * .6, q[1] - hh * .6, k, r]); }
  if (L > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = css(P.win, .85 * L); for (const [x, y, k, r] of wins) { const tw = .8 + .2 * Math.sin(t * .4 + r * 40); if (r > L * 1.1 + .05) continue; const s = Math.max(1, 2.4 * k); ctx.globalAlpha = tw; ctx.fillRect(x, y, s * 1.3, s); } ctx.globalAlpha = 1;
    // street lights: the grid
    ctx.fillStyle = css(P.road, .95 * L); for (const [x, z, r] of STREET) { const q = cam.p(x, 2, z); if (!vis(q, 2)) continue; if (r > L * 1.15) continue; const s = clamp(3.2 * q[2], .9, 3); ctx.fillRect(q[0], q[1], s, s); }
    ctx.restore(); }
  // downtown towers
  for (const [x, z, h, w] of TOWERS) {
    const F = cam.poly([[x - w / 2, 0, z], [x + w / 2, 0, z], [x + w / 2, h, z], [x - w / 2, h, z]]); if (!fillP(ctx, F)) continue; ctx.fillStyle = css(mixc(P.city, P.ink, .3)); ctx.fill(); ctx.strokeStyle = css(P.farRim, .25); ctx.lineWidth = 1; ctx.stroke();
    if (L > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = prng(Math.round(x)); ctx.fillStyle = css(P.win, .7 * L); for (let yy = 6; yy < h - 4; yy += 7) for (let xx = -w / 2 + 4; xx < w / 2 - 3; xx += 6) { if (r() < .45) continue; const q = cam.p(x + xx, yy, z - .2); if (q[3] < 1) continue; const s = Math.max(.8, 2.6 * q[2]); ctx.fillRect(q[0], q[1], s, s * 1.3); } ctx.restore(); }
  }
  A.city = (() => { const q = cam.p(3000, 0, 3600); return [q[0], q[1]]; })();
}

function home(ctx, t, cam, P, st, A) {
  const { x, z, w, d, h } = HOME, b = cam.p(x, 0, z); if (b[3] < 2 || b[0] < -900 || b[0] > W + 900) return;
  const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2;
  const front = cam.poly([[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0]]), side = cam.poly([[x0, 0, z1], [x0, 0, z0], [x0, h, z0], [x0, h, z1]]), roof = cam.poly([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]]);
  const stucco = P.stucco;
  const skyLit = mixc(stucco, P.sky2, .28);
  if (fillP(ctx, side)) { ctx.fillStyle = css(mixc(stucco, P.ink, .38)); ctx.fill(); }
  if (fillP(ctx, roof)) { ctx.fillStyle = css(mixc(skyLit, P.sky1, .25)); ctx.fill(); }
  if (fillP(ctx, front)) { const fa = cam.p(x0, h, z0), fb = cam.p(x0, 0, z0), g = ctx.createLinearGradient(0, fa[1], 0, fb[1]); g.addColorStop(0, css(skyLit)); g.addColorStop(1, css(mixc(stucco, P.ink, .3))); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = css(P.ink, .35); ctx.lineWidth = 1; ctx.stroke(); }
  // stucco texture: fine engraved horizontal strokes, the roof edge catches the last light
  ctx.strokeStyle = css(P.ink, .12); ctx.lineWidth = 1; ctx.beginPath(); for (let yy = .4; yy < h - .5; yy += .32) seg(ctx, cam, [x0 + .2, yy, z0 - .03], [x1 - .2, yy, z0 - .03]); ctx.stroke();
  ctx.strokeStyle = css(P.sky2, .7); ctx.lineWidth = 1.5; ctx.beginPath(); seg(ctx, cam, [x0, h, z0], [x1, h, z0]); seg(ctx, cam, [x0, h, z0], [x0, h, z1]); ctx.stroke();
  // parapet line, a few roof beams (vigas) sticking out
  ctx.strokeStyle = css(P.ink, .45); ctx.lineWidth = 1.2; ctx.beginPath(); seg(ctx, cam, [x0, h - .35, z0 - .02], [x1, h - .35, z0 - .02]); for (let i = 1; i < 6; i++) { const xx = x0 + i * w / 6; seg(ctx, cam, [xx, h - .7, z0], [xx, h - .7, z0 - .8]); } ctx.stroke();
  // the big window: warm light, a lamp, a parent and a child
  const wx0 = x0 + 3, wx1 = x0 + 9.5, wy0 = .62, wy1 = 3.4, Q = cam.poly([[wx0, wy0, z0 - .05], [wx1, wy0, z0 - .05], [wx1, wy1, z0 - .05], [wx0, wy1, z0 - .05]]);
  const hw = Math.max(st.home ?? 0, P.lights * .9);
  if (fillP(ctx, Q)) {
    const ca = cam.p(wx0, wy1, z0), cb = cam.p(wx1, wy0, z0), g = ctx.createLinearGradient(ca[0], ca[1], cb[0], cb[1]);
    g.addColorStop(0, css(mixc([60, 50, 60], [255, 214, 150], hw))); g.addColorStop(1, css(mixc([40, 34, 44], [240, 170, 100], hw))); ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.clip();
    const k = ca[2], ww = cb[0] - ca[0];
    if (k * 1.7 > 10) {
      // the people inside: silhouettes against the warm room (figure scale, alive)
      const fy = cam.p(wx0, 0, z0 + 1)[1];
      figureFlat(ctx, ca[0] + ww * .3, fy - 1.0 * k, k * 1.78 / 185, POSES.stand, { t, seed: 31, col: '#2a1c18', rim: '#ffd9a0', rimSide: 1, shadow: false, fast: true });
      figureFlat(ctx, ca[0] + ww * .7, fy - .72 * k, k * 1.3 / 185, POSES.look, { t, seed: 47, col: '#2a1c18', rim: '#ffd9a0', rimSide: -1, shadow: false, fast: true });
      // a lamp on the right of the room
      const lp = cam.p(wx1 - 1, 2.2, z0 + 2); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], 2.6 * lp[2]); lg.addColorStop(0, `rgba(255,236,190,${.7 * hw})`); lg.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = lg; ctx.fillRect(lp[0] - 3 * lp[2], lp[1] - 3 * lp[2], 6 * lp[2], 6 * lp[2]); ctx.restore();
    }
    ctx.restore();
    ctx.strokeStyle = css(P.ink, .7); ctx.lineWidth = Math.max(1, .12 * ca[2]); ctx.stroke(); ctx.beginPath(); seg(ctx, cam, [(wx0 + wx1) / 2, wy0, z0 - .06], [(wx0 + wx1) / 2, wy1, z0 - .06]); ctx.stroke();
    // the window's warm light falls on the ground
    if (hw > .05) { const c = cam.p((wx0 + wx1) / 2, 0, z0 - 2.5), R = 7 * c[2]; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g2 = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g2.addColorStop(0, `rgba(255,200,130,${.25 * hw})`); g2.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = g2; ctx.translate(c[0], c[1]); ctx.scale(1, .45); ctx.translate(-c[0], -c[1]); ctx.fillRect(c[0] - R, c[1] - R, 2 * R, 2 * R); ctx.restore(); }
    A.home = [(ca[0] + cb[0]) / 2, ca[1]];
  }
}

// ---------------------------------------------------------------- the race of two lines in the sky (share of world electricity)
function lineGlow(ctx, pts, col, core, w, a) {
  if (pts.length < 2) return; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [lw, al, c] of [[w * 7, .1, col], [w * 2.6, .3, col], [w, .95, core]]) { ctx.strokeStyle = css(c, al * a); ctx.lineWidth = lw; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
}
function race(ctx, t, cam, P, st, A) {
  const u = st.race, ra = st.raceA ?? 1, yNow = mix(RACE.y0, RACE.y1, u), yFrom = mix(RACE.y0, RACE.y1, clamp(st.raceFrom ?? 0)), n = Math.max(2, Math.ceil(120 * (u - (st.raceFrom ?? 0))));
  if (yFrom >= yNow - .02) return;
  const pts = (D) => { const o = []; for (let i = 0; i <= n; i++) { const y = mix(yFrom, yNow, i / n), q = dirPt(cam, raceAz(y), raceEl(at(D, y))); o.push([q[0], q[1]]); } return o; };
  const C = pts(COAL), R = pts(REN);
  // the baseline: years written faintly on a ruled line just above the hills
  { const a = dirPt(cam, raceAz(yFrom), raceEl(RACE.s0)), b = dirPt(cam, raceAz(RACE.y1), raceEl(RACE.s0)); ctx.strokeStyle = css(P.ink, .28 * ra); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); const ub = clamp((u * 1.05 - (st.raceFrom ?? 0)) / (1 - (st.raceFrom ?? 0) + 1e-6)); ctx.lineTo(mix(a[0], b[0], ub), mix(a[1], b[1], ub)); ctx.stroke();
    ctx.beginPath(); for (let y = 2000; y <= Math.min(2025, yNow + .01); y += 5) { if (y < yFrom) continue; const q = dirPt(cam, raceAz(y), raceEl(RACE.s0)); ctx.moveTo(q[0], q[1] - 5); ctx.lineTo(q[0], q[1] + 5); } ctx.stroke();
    A.base0 = [a[0], a[1]]; A.base1 = [b[0], b[1]]; }
  const grey = [96, 100, 108], greyC = [60, 62, 70], gold = [214, 170, 52], goldC = [255, 236, 170];
  lineGlow(ctx, C, grey, greyC, 6, ra);
  // the gold line: a little heat of light along it, sparks at its tip
  ctx.save(); ctx.globalCompositeOperation = 'source-over'; lineGlow(ctx, R, gold, goldC, 6.5, ra); ctx.restore();
  const tc = C[C.length - 1], tr = R[R.length - 1];
  const dk = clamp((yNow - yFrom) / 3); for (const [p, col, r0] of [[tc, greyC, 7], [tr, goldC, 9]]) { ctx.fillStyle = css(col, ra); ctx.beginPath(); ctx.arc(p[0], p[1], r0 * dk, 0, TAU); ctx.fill(); }
  { if (dk > .05) { } const g = ctx.createRadialGradient(tr[0], tr[1], 0, tr[0], tr[1], 46 * dk + .01); g.addColorStop(0, `rgba(240,190,70,${.45 * ra})`); g.addColorStop(1, 'rgba(240,190,70,0)'); ctx.fillStyle = g; ctx.fillRect(tr[0] - 46, tr[1] - 46, 92, 92); }
  // the overtake: a flash of light where gold passes grey
  const cf = st.cross ?? 0; if (cf > 0 && cf < 1) { const q = dirPt(cam, raceAz(RACE.cross), raceEl(at(REN, RACE.cross))), r = 18 + 56 * ease.out(cf), al = (1 - cf) * .55; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], r); g.addColorStop(0, `rgba(250,206,96,${al})`); g.addColorStop(1, 'rgba(250,206,96,0)'); ctx.fillStyle = g; ctx.fillRect(q[0] - r, q[1] - r, 2 * r, 2 * r);
    ctx.strokeStyle = `rgba(200,150,30,${al})`; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; ctx.moveTo(q[0] + Math.cos(a) * r * .2, q[1] + Math.sin(a) * r * .2); ctx.lineTo(q[0] + Math.cos(a) * r * .55, q[1] + Math.sin(a) * r * .55); } ctx.stroke(); ctx.restore(); }
  A.tipC = tc; A.tipR = tr; A.start = R[0]; A.startC = C[0];
}

// ---------------------------------------------------------------- the city's demand through the afternoon and evening
function loadCurve(ctx, t, cam, P, st, A) {
  const u = st.load, n = 90, pts = [];
  const pt = (s) => { const q = dirPt(cam, mix(LOAD.a0, LOAD.a1, s), mix(LOAD.e0, LOAD.e1, loadV(s))); return [q[0], q[1]]; };
  const base = (s) => { const q = dirPt(cam, mix(LOAD.a0, LOAD.a1, s), LOAD.e0 - .015); return [q[0], q[1]]; };
  for (let i = 0; i <= n; i++) pts.push(pt(u * i / n));
  // hatched area under the drawn curve (engraved), the ruled base
  const b0 = base(0), b1 = base(1); ctx.strokeStyle = 'rgba(246,239,220,.4)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.lineTo(mix(b0[0], b1[0], u), mix(b0[1], b1[1], u)); ctx.stroke();
  ctx.strokeStyle = 'rgba(246,239,220,.16)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i <= n; i += 2) { const s = u * i / n, p = pts[i], b = base(s); ctx.moveTo(p[0], p[1] + 3); ctx.lineTo(b[0], b[1]); } ctx.stroke();
  // the peak window: the three hours, the strain glows on the curve
  const br = st.bracket ?? 0, sg = st.strain ?? 0;
  if (sg > 0) { const seg2 = pts.filter((_, i) => { const s = u * i / n; return s >= PEAK[0] && s <= PEAK[1]; }); ctx.save(); ctx.globalCompositeOperation = 'lighter'; lineGlow(ctx, seg2, [255, 179, 92], [255, 241, 214], 3.2, sg * (.85 + .15 * Math.sin(t * 6))); ctx.restore(); }
  lineGlow(ctx, pts, [233, 220, 192], [255, 250, 240], 2.6, 1);
  // the evening running along the curve (a small light)
  const hd = st.head ?? 0; if (hd > 0) { const p = pt(Math.min(u, hd)); ctx.fillStyle = 'rgba(255,246,224,.95)'; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, TAU); ctx.fill(); }
  if (br > 0) { const p0 = pt(PEAK[0]), p1 = pt(PEAK[1]), q0 = base(PEAK[0]), q1 = base(PEAK[1]), y = Math.min(q0[1], q1[1]) + 22, w = ease.out(br);
    ctx.strokeStyle = `rgba(255,214,150,${.95 * clamp(br * 2)})`; ctx.lineWidth = 2.2; ctx.beginPath(); const xm = (q0[0] + q1[0]) / 2, hw = (q1[0] - q0[0]) / 2 * w; ctx.moveTo(xm - hw, y - 10); ctx.lineTo(xm - hw, y); ctx.lineTo(xm + hw, y); ctx.lineTo(xm + hw, y - 10); ctx.stroke();
    ctx.setLineDash([4, 6]); ctx.strokeStyle = `rgba(255,214,150,${.5 * clamp(br * 2)})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(xm - hw, y - 10); ctx.lineTo(p0[0], p0[1] + 6); ctx.moveTo(xm + hw, y - 10); ctx.lineTo(p1[0], p1[1] + 6); ctx.stroke(); ctx.setLineDash([]);
    A.bracket = [xm, y]; }
  A.loadEnd = pts[pts.length - 1]; A.load0 = b0; A.loadPeak = pt(.64);
}

// ---------------------------------------------------------------- card I's engraving (ink)
export function landInk(g, t) { const cam = landCam(ENTRY); land(g, t, cam, { ev: 0, ink: 1, sun: { az: .46, el: .26 } }); }
