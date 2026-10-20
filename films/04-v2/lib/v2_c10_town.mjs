// Film 4 v2 · c10 · World 1, the old town by the sea (10.01–10.07): one continuous camera from the Maslow hill (H2) into the
// family's window, through the room into the garden, through the gate into the lane with the long dinner, down to the harbour wall,
// the two friends, their reflections that become two boats, under the stone bridge (→ World 2, lib/v2_c10_city.mjs).
//   townAnchors(T)          word anchors (K) for this world
//   hillTake(ctx, t, K)     249.46 → K.cover: the hill zoom with the room drawn through the window (st.inside)
//   townTake(ctx, t, K)     K.cover → the bridge: the 3D town
//   envAt(t, K)             light and colour state (one sun that sets slowly over 20 s)
import { W, H, rgba, clamp, mix, prng, mixHex, shade, TAU, cam, sm2, smr, eoX, eiX, qio, cio, radial, hash, spline } from './v2_c10_kit.mjs';
import { drawHill, VIEWS, hillWindow, toScreen } from './maslow4.mjs';
import { roomGarden, G } from './v2_c10_garden.mjs';
import { lane, LANE } from './v2_c10_lane.mjs';
import { harbour, QY, WY, HBR, boats } from './v2_c10_harbour.mjs';
import { city, SY, BLK, CORE, SKY_F } from './v2_c10_city.mjs';
import { stairs, ST } from './v2_c10_stairs.mjs';
import { handsOf } from './handoff4.mjs';

export const F = 1400;
export function townAnchors(T) {
  const S = (p, n) => T.S('04a', p, n), E = (p, n) => T.E('04a', p, n);
  const K = {
    first: S('First, to people'), people: S('people.'), peopleE: E('First, to people'),
    time: S('Time for the ones'), love: S('love,'), here: E('still here'),
    parents: S("Your parents'"), years: S('years,'), weekend: S('weekend.'), weekendE: E('weekend.'),
    long: S('Long dinners'), nine: S('nine'), workdayE: E("tomorrow's a workday"),
    neigh: S('Neighbours'), name: S('name.'), nameE: E('know your name'),
    whole: S('A whole afternoon'), friend: S('friend,'), calendar: S('calendar.'), calE: E('no calendar'),
    decades: S('For decades'), apart: S('apart.'), apartE: E('drifted apart'),
    small: S('Small flats'), flats: S('flats.'), commutes: S('commutes.'), commE: E('commutes.'), strangers: S('Strangers'),
    stair: S('staircase.'), stairE: E('staircase.'), now: S('Now there'), build: S('build'), tribe: S('tribe'), againE: E('again.'),
    streets: S('Streets full'), people2: S('people who'), hurry: S('hurry.'), hurryE: E('hurry.'),
  };
  K.end = handsOf('c10', T).out.a - 1 / 30;  // from here on the frame is the sky plate
  K.pushEnd = K.stair - .3;                  // the push into the stair core window ends (the window covers the frame)
  K.cover = K.peopleE + .14;                 // the window covers the frame (z ≥ 330)
  K.inGarden = K.love - .08;                 // the camera comes to rest in the garden
  K.seasons0 = K.parents - .2; K.seasons1 = K.weekend + .35;
  K.gate0 = K.weekendE - .02; K.gateT = K.long + .45;   // the gate opens; the camera passes it
  K.lane = K.long + 1.05;                    // looking down the lane
  K.glide0 = K.nameE - .2; K.wall = K.friend - .6;      // down the lane → resting by the harbour wall
  K.tilt0 = K.calE + .05; K.swap = K.decades + .5; K.arch = K.apartE + .2;
  return K;
}

// ---------------------------------------------------------------- light: one sun, setting over the whole world
const PAL = [   // t-key, sky top / mid / horizon, haze, key light, rim, cloud top / low
  ['golden', ['#6a78b0', '#e6b08a', '#ffd6a2'], '#e8c8a0', '#ffd49a', '#ffe2b0', '#f1cdb4', '#ffb48a'],
  ['late', ['#525a9a', '#e09a7c', '#ffc48c'], '#e0b090', '#ffc888', '#ffd8a0', '#e8b8a8', '#ff9a72'],
  ['dusk', ['#343a7a', '#b9707c', '#ffa868'], '#b88890', '#ffb878', '#ffcc90', '#c98a98', '#ff8a5a'],
  ['sunset', ['#262c68', '#a85a78', '#ff9256'], '#9a7090', '#ffa860', '#ffbc78', '#b0708a', '#ff7a48'],
  ['after', ['#1a2052', '#5e3f74', '#d8786a'], '#5a4a78', '#e09070', '#e8a080', '#6a4a7a', '#c8606a'],
  ['night', ['#0b0f2c', '#1c1c4c', '#4a3a6e'], '#2a2a58', '#b08088', '#c8a0a8', '#2a2a58', '#4a3a6a'],
];
function palAt(t, K) {
  const keysT = [K.inGarden, K.weekend, K.nine + .3, K.friend, K.decades + .3, K.apartE + .3];
  let i = 0; while (i < keysT.length - 2 && t > keysT[i + 1]) i++;
  const u = sm2((t - keysT[i]) / (keysT[i + 1] - keysT[i])), a = PAL[i], b = PAL[i + 1];
  const m = (x, y) => mixHex(x, y, u);
  return { sky: a[1].map((c, j) => m(c, b[1][j])), haze: m(a[2], b[2]), key: m(a[3], b[3]), rim: m(a[4], b[4]), cloudTop: m(a[5], b[5]), cloudLow: m(a[6], b[6]), u, i };
}
export function envAt(t, K) {
  const P = palAt(t, K);
  // the sun: low over the sea at the lane's end (az 82°), sinking slowly; over the friends it moves along one smooth arc and sets
  const el = spline(t, [[K.cover, 10], [K.nine, 7], [K.wall, 5], [K.calE, 1.6], [K.apart, -2.5]]) * Math.PI / 180;
  const az = spline(t, [[K.cover, 82], [K.wall - .3, 82], [K.calE + .2, 86.5]]) * Math.PI / 180;
  const sunDir = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)];
  const sunA = clamp(1 + el * 30);   // fades as it sinks below the horizon (it is behind the sea line by then)
  return {
    ...P, sunDir, sunEl: el, sunA, sunGlow: mixHex('#ffcf8a', '#ff8a5a', P.i >= 2 ? .6 : .2), sunCore: '#fff6e2',
    figLight: { x: W + 400, y: 160, col: P.key, a: .55 }, facade: 1 - .55 * clamp((t - K.nine) / 8),
  };
}

// ---------------------------------------------------------------- 249.46 → cover: the hill, the push into the family window
const WIN = hillWindow(1, 'family');
const WC = { x: WIN.x + WIN.w / 2, y: WIN.y + WIN.h / 2 };
const Z0 = VIEWS.H2.cam.z, ZC = 330, LN = Math.log(ZC / Z0);
// log zoom: the log speed ramps up (smoothstep) from ta to tb and holds; its end speed matches the room's entry speed
function hillZoom(t, K) {
  const ta = K.first - .12, tb = ta + .65, tc = K.cover, lam = LN / ((tb - ta) / 2 + (tc - tb));
  let I = 0;
  if (t > ta) { const u = clamp((t - ta) / (tb - ta)); I += lam * (tb - ta) * (u * u * u - u * u * u * u / 2); }
  if (t > tb) I += lam * (Math.min(t, tc) - tb);
  if (t > tc) I += lam * (t - tc);
  return { z: Z0 * Math.exp(I), lam: t < ta ? 0 : t < tb ? lam * sm2((t - ta) / (tb - ta)) : lam };
}
export function hillCam(t, K) {
  const { z } = hillZoom(t, K), s0 = toScreen(VIEWS.H2.cam, WC.x, WC.y), a = qio(clamp((t - K.first + .05) / (K.cover - .25 - K.first + .05)));
  const sx = mix(s0[0], W / 2, a), sy = mix(s0[1], H / 2, a);
  return { x: WC.x - (sx - W / 2) / z, y: WC.y - (sy - H / 2) / z, z };
}
export function windowColor(t, on) {
  const n = VIEWS.H2.st.night, base = mixHex('#2a2348', '#151330', n);
  return mixHex(base, '#ffcf8a', on * (.85 + .15 * Math.sin(t * .7 + WIN.ph)));
}
const hillLit = (t, K) => sm2((t - K.first + .1) / .75);
export function hillTake(ctx, t, K) {
  const c = hillCam(t, K), L1 = hillLit(t, K), on = sm2(clamp((L1 * 1.25 - WIN.d) / .25));
  const st = { ...VIEWS.H2.st, lit: [1, L1, 0, 0, 0], focusU: sm2((t - K.first + .15) / .5), labels: 1 - sm2((c.z - 1.8) / 2.6) };
  st.inside = { level: 1, id: WIN.id, draw: (g, sx, sy, sw, sh, tt) => insideView(g, tt, K, sx, sy, sw, sh, on) };
  drawHill(ctx, t, c, st);
}
// what is seen through the family window, drawn into its screen rect (clipped by maslow4)
function insideView(ctx, t, K, sx, sy, sw, sh, on) {
  const wc = windowColor(t, on);
  if (sw < 9) { ctx.fillStyle = wc; ctx.fillRect(sx, sy, sw, sh); return; }
  const d = F * G.win.w / sw, C = cam({ x: G.win.x, y: G.win.y, z: -d, f: F, ox: sx + sw / 2, oy: sy + sh / 2 });
  const E = envAt(t, K); actions(t, K, E); E.lamp = on;
  ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip();
  roomGarden(ctx, C, t, E, { cheap: sw < 80 });
  // the window glass: its lit colour reads as one glow from afar and clears as we come close
  const ga = 1 - sm2((sw - 16) / 170);
  if (ga > 0) { ctx.globalAlpha = ga; ctx.fillStyle = wc; ctx.fillRect(sx, sy, sw, sh); ctx.globalAlpha = 1; }
  // mullions and the frame (engraved, dark), visible as the window grows
  const fa = sm2((sw - 30) / 120); if (fa > 0) { ctx.strokeStyle = `rgba(30,18,24,${.9 * fa})`; ctx.lineWidth = Math.max(1, sw * .045); ctx.beginPath(); ctx.moveTo(sx + sw / 2, sy); ctx.lineTo(sx + sw / 2, sy + sh); ctx.moveTo(sx, sy + sh * .42); ctx.lineTo(sx + sw, sy + sh * .42); ctx.stroke(); ctx.lineWidth = Math.max(1, sw * .07); ctx.strokeRect(sx, sy, sw, sh); }
  ctx.restore();
}

// ---------------------------------------------------------------- cover → the bridge: the camera through the town
// keys: [t, X, Y, Z, yaw, pitch]; Hermite with explicit slopes where given (the room entry speed), Catmull-Rom elsewhere
function camKeys(K) {
  const vIn = hillZoom(K.cover, K).lam * (F * G.win.w / (6 * ZC));   // m/s at the window, from the zoom's log speed
  const g = G.gate, gx = (g.x0 + g.x1) / 2;
  return [
    { t: K.cover, p: [0, G.win.y, -F * G.win.w / (6 * ZC), 0, 0], v: [0, 0, vIn, 0, 0] },
    { t: K.cover + .62, p: [.05, 1.52, 3.2, 0, -.02] },
    { t: K.inGarden, p: [.12, 1.55, 5.0, 0, -.055], v: [.03, 0, .32, 0, 0] },
    { t: K.seasons1 - .3, p: [.32, 1.62, 6.6, .015, -.06] },
    { t: K.gate0 + .55, p: [1.9, 2.55, 11.0, .05, -.12] },
    { t: K.gateT - .12, p: [gx - .05, 1.22, 16.55, .1, -.01] },
    { t: K.gateT + .25, p: [gx + .2, 1.45, 17.9, .55, -.05] },
    { t: K.lane, p: [gx + .55, 2.35, LANE.z - .1, Math.PI / 2, -.2], v: [.25, 0, 0, 0, 0] },
    { t: K.neigh + .1, p: [gx + 1.3, 2.4, LANE.z - .1, Math.PI / 2, -.17] },
    { t: K.neigh + .75, p: [gx + 1.5, 2.45, LANE.z + .1, Math.PI / 2 - .12, .12] },
    { t: K.name - .1, p: [gx + 1.7, 2.45, LANE.z + .1, Math.PI / 2 - .1, .1] },
    { t: K.glide0, p: [gx + 1.9, 2.4, LANE.z, Math.PI / 2 - .02, -.12] },
    { t: K.glide0 + .95, p: [12.2, 1.5, 19.7, Math.PI / 2 - .05, -.1] },
    { t: K.wall - .5, p: [16.4, -.4, 18.0, 1.3, -.06] },
    { t: K.wall, p: [17.9, -1.1, 16.1, 1.2, -.02], v: [.05, 0, .012, .003, 0] },
    { t: K.tilt0, p: [18.05, -1.08, 16.15, 1.21, -.02] },
    { t: K.tilt0 + .9, p: [17.0, 1.2, 14.4, 1.1, -.75] },
    { t: K.swap, p: [16.7, 1.8, 14.0, 1.07, -.92] },
    { t: K.swap + .45, p: [16.75, 1.9, 14.05, 1.1, -.92] },
    { t: K.apart + .3, p: [18.3, .5, 15.4, 1.56, -.42] },
    { t: K.apartE + .1, p: [21.5, -1.55, 16.25, 1.56, -.1] },
    { t: K.apartE + .75, p: [24.9, -1.85, 16.3, Math.PI / 2, -.02] },
    // World 2: out of the vault, the camera rises over the canal, pushes into the stair core window (analytic, see PUSH), looks down
    { t: K.flats + .55, p: [27.8, -1.65, 16.3, Math.PI / 2, .02] },
    { t: K.commutes + .05, p: [33.5, .9, 16.3, Math.PI / 2, .07] },
    { t: K.commE, p: [...PU.P0, Math.PI / 2, .12], v: [...PU.dir.map((d) => d * PU.v0), 0, 0] },
    { t: K.pushEnd, p: [...PU.P1, Math.PI / 2, PU.lp], v: [...PU.dir.map((d) => d * PU.vEnd), 0, -.4] },
    { t: K.pushEnd + 1.0, p: [ST.x - .3, PU.Y9 + 2.6, ST.z, Math.PI / 2, -1.3] },
    { t: K.now, p: [ST.x, PU.Y9 + 2.75, ST.z, Math.PI / 2 + .1, -1.33] },
    { t: K.now + .95, p: [ST.x, PU.Y9 + 4.2, ST.z, Math.PI / 2 + .25, -1.36] },
    { t: K.tribe, p: [ST.x, BLK.top + 2.2, ST.z, Math.PI / 2 + .45, -1.38] },
    { t: K.againE + .2, p: [114.5, BLK.top + 8, 12, .55, -.95] },
    { t: K.streets + .45, p: [105, BLK.top - 2, 8, .1, -.62] },
    { t: K.hurry, p: [101, 14, 30, -.15, -.38] },
    { t: K.hurryE, p: [100.4, 12.5, 37, -.35, -.25] },
    { t: K.end, p: [100, 13, 41, SKY_F.yaw, SKY_F.pitch] },
  ];
}
// the push into the stair core window: log distance to the window, its log speed ramps from the incoming speed and holds
const PU = (() => {
  const Y9 = SY + 9 * 3, T = [BLK.x0 + .02, Y9 + 2.2, CORE.z], P0 = [44, 8.2, CORE.z], d = T.map((v, i) => v - P0[i]), D0 = Math.hypot(...d), dir = d.map((v) => v / D0);
  const D1 = .55, v0 = 9, lp = Math.atan2(d[1], Math.hypot(d[0], d[2]));
  return { Y9, T, P0, dir, D0, D1, v0, lp, P1: T.map((v, i) => v - dir[i] * D1) };
})();
function push(t, K) {
  const Tp = K.pushEnd - K.commE, Tr = Tp * .45, l0 = PU.v0 / PU.D0, LN = Math.log(PU.D0 / PU.D1), lmax = (LN - l0 * Tr / 2) / (Tp - Tr / 2), tau = clamp(t - K.commE, 0, Tp);
  let I; if (tau < Tr) { const u = tau / Tr; I = l0 * tau + (lmax - l0) * Tr * (u * u * u - u * u * u * u / 2); } else I = l0 * Tr / 2 + lmax * (tau - Tr / 2);
  PU.vEnd = lmax * PU.D1;
  const D = PU.D0 * Math.exp(-I), pos = PU.T.map((v, i) => v - PU.dir[i] * D), pitch = mix(.12, PU.lp, sm2(tau / (Tp * .6)));
  return { x: pos[0], y: pos[1], z: pos[2], yaw: Math.PI / 2, pitch };
}
{ const Tp = 1, Tr = .45; PU.vEnd = 0; }
let KEYS = null, KEYK = null;
function hermite(t, Ks, j) {
  const n = Ks.length; if (t <= Ks[0].t) return Ks[0].p[j] + (Ks[0].v ? Ks[0].v[j] * (t - Ks[0].t) : 0);
  if (t >= Ks[n - 1].t) return Ks[n - 1].p[j];
  let i = 0; while (i < n - 2 && t > Ks[i + 1].t) i++;
  const A = Ks[i], B = Ks[i + 1], h = B.t - A.t, u = (t - A.t) / h;
  const slope = (k) => { const X = Ks[k]; if (X.v) return X.v[j]; if (k === 0 || k === n - 1) return 0; const P = Ks[k - 1], N = Ks[k + 1], a = X.p[j] - P.p[j], b = N.p[j] - X.p[j]; if (a * b <= 0) return 0; return (N.p[j] - P.p[j]) / (N.t - P.t); };
  const m0 = slope(i), m1 = slope(i + 1), u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * A.p[j] + (u3 - 2 * u2 + u) * h * m0 + (-2 * u3 + 3 * u2) * B.p[j] + (u3 - u2) * h * m1;
}
export function townCam(t, K) {
  if (KEYK !== K) { push(K.pushEnd, K); KEYS = camKeys(K); KEYK = K; boatStarts(K); }
  if (t > K.commE && t < K.pushEnd) return push(t, K);
  const v = [0, 1, 2, 3, 4].map((j) => hermite(t, KEYS, j));
  return { x: v[0], y: v[1], z: v[2], yaw: v[3], pitch: v[4] };
}
// where the two boats open out: the water points under the friends' reflections, seen from the camera at K.swap
function boatStarts(K) {
  const P = [0, 1, 2].map((j) => hermite(K.swap, KEYS, j)), out = [];
  for (const F of HBR.friends) {
    const Mx = F.x, My = 2 * WY - (QY + .1 + 34 * 1.75 / 188 * F.h), Mz = 18.6 + .17, u = (P[1] - WY) / (P[1] - My);
    out.push([P[0] + (Mx - P[0]) * u, P[2] + (Mz - P[2]) * u]);
  }
  K.boatA0 = out[0]; K.boatB0 = out[1];
}
// per-time actions of the family and the lane
function actions(t, K, E) {
  E.season = 4 * smr(K.seasons0, K.seasons1, t) ;
  E.lamp = 1;
  E.love = sm2((t - K.love + .12) / .55) * (1 - sm2((t - K.parents - .35) / .6));
  E.page = clamp((t - (K.years + .1)) / .55) * (t < K.years + .7 ? 1 : 0) + clamp((t - (K.weekend - .9)) / .55) * (t > K.weekend - .9 && t < K.weekend - .3 ? 1 : 0);
  const sAut = K.seasons0 + (K.seasons1 - K.seasons0) * .43;
  E.lap = sm2((t - sAut) / .5) * (1 - sm2((t - (K.seasons1 - .2)) / .5));
  E.give = sm2((t - sAut - .6) / .45) * (1 - sm2((t - sAut - 1.5) / .45));
  E.smile = .2 + .4 * E.love;
  E.gate = eoX(clamp((t - K.gate0) / .7)) * .98;
  E.rays = 1 - sm2((t - K.gateT + .4) / .6);
  E.northLit = (hh, f, i, r) => { const q = r(), q2 = r(); if (q < .28) return .6 + .2 * Math.sin(t * .5 + i + f); if (q < .55) return clamp((t - K.long - 1 - q2 * 6) / .4) * .85; return 0; };
}
export function townTake(ctx, t, K) {
  const c = townCam(t, K), C = cam({ ...c, f: F }), E = envAt(t, K); actions(t, K, E);
  if (C.z < G.wallZ + .05 && C.yaw < .9) roomGarden(ctx, C, t, E, { lane: (g, CC) => lane(g, CC, t, E, K, { behindWall: true }) });
  else if (C.x < LANE.x1 + 1) lane(ctx, C, t, E, K, {});
  else if (C.x < HBR.bridge.x1) harbour(ctx, C, t, E, K, { beyond: (g, CC) => city(g, CC, t, K) });
  else if (C.x > BLK.x0 + .01 && C.y < BLK.top && Math.hypot(C.x - ST.x, C.z - ST.z) < ST.ro + .6) stairs(ctx, C, t, K, {});
  else city(ctx, C, t, K, { stair: (g, CC, o) => stairs(g, CC, t, K, o), stairFloor: 9 });
}
