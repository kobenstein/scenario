// c18 · the land of the dawn take, in world metres (Y up, the sunrise along −Z, +X to the right): the far plain with its hills and
// towns up to the horizon, the far city on the far rim of the valley (one district lit by the aqueduct of 3.02), the misty valley (the
// gap of 3.02), the arcades (the aqueduct, the network the burin draws in 18.05, the bridge across the gap), drawn back to front.
// Every arcade is one builder (arcade()): the 3.02 look in perspective — blue stone, two tiers (tall lower arches, three small upper
// arches per bay), dark cornices with a light lip, the lit channel lip, voussoir ticks, the inner faces of the piers through the openings.
import { W, H, clamp, mix, rgba, prng } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { TAU, cs, toScr, P3, NEAR, path3, line3, proj, mixRGB, css, mix3, ramp, hash, sio, horizonY } from './v2_c18_kit.mjs';

// ---------------------------------------------------------------- geometry
export const G = { coping: 1.05, roofY: 0, rimY: -34, valY: -95, farY: -30 };
const NZ = vnoise(17);
export const nearEdge = (x) => -0.6 + 5 * Math.sin(x * .013 + .4) * clamp((Math.abs(x) - 16) / 40);
export const farEdge = (x) => -128 + 6 * Math.sin(x * .0047 + 1) + 4 * Math.sin(x * .017 + 2);
export function plainY(x, z) { const d = farEdge(x) - z; return G.farY + 10 * clamp(d / 2600) + 5 * (fbm(NZ, x * .0016, z * .0016, 3) - .5) * clamp(d / 300); }
export function groundY(x, z) {
  const ne = nearEdge(x), fe = farEdge(x);
  if (z >= ne) return G.rimY;
  if (z > ne - 18) return mix(G.rimY, G.valY, sio((ne - z) / 18));
  if (z > fe + 16) return G.valY + 2.5 * (fbm(NZ, x * .012, z * .012, 2) - .5);
  if (z > fe) return mix(G.farY, G.valY, sio((z - fe) / 16));
  return plainY(x, z);
}
// the light of the take: L 0 night · 1 rose dawn · 2 morning;  sun = 0..1 the sun is up (direct light on what the front has passed)
export const HAZE = [[0, '#1e1c48'], [1, '#c4879a'], [2, '#f7c9a2']];
export const hazeRGB = (L) => ramp(HAZE, L);
// aerial perspective: how much of the haze a thing at distance d (m) takes
export const fogK = (d, L) => clamp(1 - Math.exp(-d / mix(4200, 6400, clamp(L / 2))));
export const fogC = (d, L) => clamp(1 - Math.exp(-d / mix(5200, 7600, clamp(L / 2))));
// a colour of the stone/land family by light state: [night, dawn, morning-lit]
export const tri = (c, L) => (L <= 1 ? mixRGB(c[0], c[1], L) : mixRGB(c[1], c[2], L - 1));
const dist2 = (cam, x, z) => Math.hypot(x - cam.x, z - cam.z);

// ---------------------------------------------------------------- the far plain, the hills, the contour lines
const HILLS = [
  { z: -21000, base: 40, amp: 260, f: .00018, seed: 1 }, { z: -15000, base: 30, amp: 230, f: .00024, seed: 2 },
  { z: -10500, base: 20, amp: 170, f: .0003, seed: 3 }, { z: -7200, base: 12, amp: 120, f: .0004, seed: 4 },
  { z: -4800, base: 6, amp: 90, f: .0006, seed: 5 }, { z: -3100, base: 2, amp: 55, f: .0009, seed: 6 },
];
// the ridge height of hill k at x (a gap opens toward the sunrise, where the aqueduct comes from: az ~ +15°)
function ridge(h, x) {
  const n = fbm(NZ, x * h.f + h.seed * 7.3, h.seed * 3.1, 4), az = Math.atan2(x, -h.z), gap = 1 - .75 * Math.exp(-Math.pow((az - .25) / .13, 2));
  return plainY(x, h.z) + h.base + h.amp * Math.pow(n, 1.6) * gap;
}
const HILLPTS = HILLS.map((h) => { const pts = []; for (let i = 0; i <= 160; i++) { const th = (-78 + 156 * i / 160) * Math.PI / 180, x = -h.z * Math.tan(th); pts.push([x, ridge(h, x), h.z]); } return pts; });
// contour lines on the plain (z = const, wobbling): engraved hatch in perspective
const CONT = (() => { const out = []; let d = 40; for (let k = 0; k < 46; k++) { out.push(d); d *= 1.105; } return out; })();
// field edges and lanes: short engraved strokes on the plain
const FIELDS = (() => {
  const r = prng(812), L = [];
  for (let i = 0; i < 420; i++) {
    const d = 320 * Math.pow(30, r()), az = (r() - .5) * 2.4, x = d * Math.sin(az), z = farEdge(x) - d * Math.cos(az) * .9 - 30;
    const a = r() * Math.PI, len = (40 + r() * 160) * (1 + d / 3000), dx = Math.cos(a) * len / 2, dz = Math.sin(a) * len / 2 * .6;
    L.push([[x - dx, 0, z - dz], [x + dx, 0, z + dz]].map(([X, , Z]) => [X, plainY(X, Z) + .3, Z]));
  }
  return L;
})();

export function drawFar(ctx, t, cam, S, items) {
  const L = S.L, hz = hazeRGB(L), hy = horizonY(cam);
  // the plain: one big polygon to the horizon, its colour by distance (rows along the view's centre line)
  const fw = [Math.sin(cam.az || 0), -Math.cos(cam.az || 0)];
  const ds = [60, 150, 300, 600, 1100, 2000, 3500, 6000, 10000, 16000, 26000], stops = [];
  for (const d of ds) { const x = cam.x + fw[0] * d, z = Math.min(cam.z + fw[1] * d, farEdge(x) - 1), y = plainY(x, z), p = cs(cam, x, y, z); if (p[2] < NEAR) continue; const s = toScr(cam, p); stops.push([s[1], mix3(tri(['#101230', '#28233f', '#4c3a50'], L), hz, fogK(d, L))]); }
  const top = Math.min(hy, H), bot = H;
  if (top < bot) {
    const yb = Math.max(...stops.map((s) => s[0]), bot);
    stops.push([hy, hz]); stops.sort((a, b) => a[0] - b[0]);
    const y0 = Math.min(stops[0][0], top), y1 = Math.max(yb, bot), gg = ctx.createLinearGradient(0, y0, 0, y1);
    for (const [y, c] of stops) gg.addColorStop(clamp((y - y0) / (y1 - y0)), css(c));
    ctx.fillStyle = gg;
    ctx.beginPath(); const far = -30000, ext = 90000;
    const P = [[-ext, plainY(-ext, far), far], [ext, plainY(ext, far), far], [ext, G.farY, farEdge(ext)]];
    for (let x = 3000; x >= -3000; x -= 60) P.push([x, G.farY, farEdge(x)]);
    P.push([-ext, G.farY, farEdge(-ext)]);
    if (path3(ctx, cam, P)) ctx.fill();
  }
  // the far items (hills, towns, the network's far parts), sorted far → near
  const list = [], dep = (x, y, z) => cs(cam, x, y, z)[2];
  HILLPTS.forEach((pts, k) => list.push({ d: dep(cam.x, 0, HILLS[k].z), draw: () => hill(ctx, t, cam, S, pts, HILLS[k]) }));
  for (const it of items || []) list.push(it);
  // the contour lines between the hills (one item per band, so a hill covers the lines behind it)
  for (let i = 0; i < CONT.length; i++) { const d = CONT[i]; list.push({ d: dep(cam.x, G.farY, farEdge(0) - d), draw: () => contour(ctx, t, cam, S, d, i) }); }
  for (const F of FIELDS) { const d = dep(F[0][0], F[0][1], F[0][2]); if (d > NEAR) list.push({ d, draw: () => field(ctx, cam, S, F) }); }
  list.sort((a, b) => b.d - a.d);
  for (const it of list) it.draw(ctx);
}
function hill(ctx, t, cam, S, pts, h) {
  const L = S.L, d = Math.abs(h.z - cam.z), hz = hazeRGB(L), k = fogK(d, L);
  const body = mix3(tri(['#191a40', '#4a3d68', '#9b7a88'], L), hz, k), rim = mix3(tri(['#2a2a5c', '#f0a898', '#ffe0b8'], L), [255, 240, 220], .15);
  const P = pts.slice(); P.push([pts[pts.length - 1][0], plainY(0, h.z) - 30, h.z], [pts[0][0], plainY(0, h.z) - 30, h.z]);
  if (!path3(ctx, cam, P)) return;
  const sc = proj(cam, [[0, plainY(0, h.z) + h.base + h.amp * .5, h.z], [0, plainY(0, h.z), h.z]]);
  if (sc.length === 2) { const g = ctx.createLinearGradient(0, sc[0][1], 0, sc[1][1]); g.addColorStop(0, css(mix3(body, hz, .12))); g.addColorStop(1, css(mix3(body, hz, .35))); ctx.fillStyle = g; } else ctx.fillStyle = css(body);
  ctx.fill();
  // the backlit rim of the ridge (the dawn behind it) and a few engraved contour strokes on its flank
  ctx.strokeStyle = css(rim, clamp(L * .5) * (1 - k * .5)); ctx.lineWidth = 1.1; line3(ctx, cam, pts); ctx.stroke();
  ctx.strokeStyle = css(mix3(body, [8, 8, 24], .45), .35 * (1 - k)); ctx.lineWidth = .7; ctx.beginPath();
  for (let j = 1; j <= 3; j++) { const q = pts.map(([x, y, z]) => [x, mix(y, plainY(x, z), j * .22) + 2 * Math.sin(x * .002 + j), z]); line3(ctx, cam, q, true); }
  ctx.stroke();
}
function contour(ctx, t, cam, S, d, i) {
  const L = S.L, k = fogK(d, L), a = .22 * (1 - k) * clamp(1.4 - i / 40);
  if (a < .01) return;
  const n = 90, pts = [];
  for (let j = 0; j <= n; j++) { const th = (-80 + 160 * j / n) * Math.PI / 180, x = cam.x + Math.tan(th) * (d + 200), z = farEdge(x) - d - 6 * Math.sin(x * .004 + i); pts.push([x, plainY(x, z) + .2, z]); }
  ctx.strokeStyle = css(mix3(tri(['#2a2c5c', '#6a5878', '#c39a8c'], L), [0, 0, 0], .1), a); ctx.lineWidth = .8; line3(ctx, cam, pts); ctx.stroke();
}
function field(ctx, cam, S, F) {
  const d = dist2(cam, F[0][0], F[0][2]), k = fogK(d, S.L), a = .3 * (1 - k); if (a < .02) return;
  ctx.strokeStyle = css(tri(['#262850', '#5a4a6c', '#a98a84'], S.L), a); ctx.lineWidth = .8; line3(ctx, cam, F); ctx.stroke();
}

// ---------------------------------------------------------------- the valley (the gap of 3.02): the far cliff, the floor, the river, the mist
const RIVER = (() => { const p = []; for (let x = -3200; x <= 3200; x += 30) p.push([x, G.valY + .4, -66 + 20 * Math.sin(x * .0042 + .6) + 8 * Math.sin(x * .011)]); return p; })();
const ROCK = (() => { const r = prng(321), L = []; for (let i = 0; i < 900; i++) { const x = (r() - .5) * 1400, u0 = r() * .4, u1 = u0 + .15 + r() * .5; L.push([x, u0, Math.min(1, u1), (r() - .5) * 2]); } return L; })();
const STRATA = Array.from({ length: 9 }, (_, i) => ({ u: .08 + i * .1 + .03 * Math.sin(i * 2.3), ph: i * 1.7 }));
const cliffAt = (x, u) => { const fe = farEdge(x); return [x, mix(G.farY, G.valY, u), fe + 16 * Math.pow(u, 1.4) + 3 * Math.sin(x * .05 + u * 6) * u]; };
export function drawValley(ctx, t, cam, S) {
  const L = S.L, hz = hazeRGB(L);
  // the floor: dark, misty toward its middle
  const F = []; for (let x = -3200; x <= 3200; x += 100) F.push([x, G.valY, nearEdge(x) - 18]); for (let x = 3200; x >= -3200; x -= 100) F.push([x, G.valY, farEdge(x) + 16]);
  if (path3(ctx, cam, F)) { ctx.fillStyle = css(mix3(tri(['#0a0b22', '#1e1a36', '#3a2c42'], L), hz, .25)); ctx.fill(); }
  // the river catches the sky (rose, then gold), engraved ripples along it
  const rv = RIVER, rv2 = RIVER.map(([x, y, z]) => [x, y, z + 7]);
  if (path3(ctx, cam, rv.concat(rv2.slice().reverse()))) { ctx.fillStyle = css(tri(['#262b5c', '#c98a94', '#ffd8a8'], L), .85); ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = css(tri(['#3a4078', '#f2b8a8', '#fff0d0'], L), .5); ctx.lineWidth = .8; ctx.beginPath(); for (let k = 1; k < 4; k++) line3(ctx, cam, RIVER.map(([x, y, z], i) => [x, y + .05, z + k * 1.75 + .6 * Math.sin(i * .9 + k + t * .4)]), true); ctx.stroke(); ctx.restore(); }
  // the far cliff: one rock face from the rim down to the floor
  const top = [], bot = [];
  for (let x = -3000; x <= 3000; x += 30) { top.push(cliffAt(x, 0)); bot.push(cliffAt(x, 1)); }
  if (!path3(ctx, cam, top.concat(bot.slice().reverse()))) return;
  const pT = proj(cam, [cliffAt(cam.x + 20, 0)]), pB = proj(cam, [cliffAt(cam.x + 20, 1)]);
  const rock = tri(['#0f1132', '#2a2446', '#4a3850'], L), lit = tri(['#3c4282', '#d99a98', '#ffd2a8'], L);
  if (pT.length && pB.length && Math.abs(pB[0][1] - pT[0][1]) > 2) { const g = ctx.createLinearGradient(0, pT[0][1], 0, pB[0][1]); g.addColorStop(0, css(mix3(rock, lit, .35))); g.addColorStop(.12, css(rock)); g.addColorStop(.6, css(mix3(rock, [4, 4, 18], .2))); g.addColorStop(1, css(mix3(rock, hz, .55))); ctx.fillStyle = g; } else ctx.fillStyle = css(rock);
  ctx.fill();
  // engraved rock: falling strokes and strata, clipped to the face, only where they read
  const near = cs(cam, cam.x, (G.farY + G.valY) / 2, farEdge(cam.x))[2], q = near > NEAR ? cam.f / near : 0;
  if (q > .8) {
    ctx.save(); ctx.clip();
    ctx.strokeStyle = css(mix3(rock, [0, 0, 10], .6), .55); ctx.lineWidth = .8; ctx.beginPath();
    for (const [x0, u0, u1, w] of ROCK) { const x = cam.x + x0; line3(ctx, cam, [cliffAt(x, u0), cliffAt(x + w, u1)], true); }
    ctx.stroke();
    ctx.strokeStyle = css(mix3(rock, lit, .3), .35); ctx.lineWidth = .9; ctx.beginPath();
    for (const st of STRATA) { const P = []; for (let x = cam.x - 900; x <= cam.x + 900; x += 15) P.push(cliffAt(x, st.u + .025 * Math.sin(x * .02 + st.ph))); line3(ctx, cam, P, true); }
    ctx.stroke(); ctx.restore();
  }
  // the rim: lit by the dawn behind it
  ctx.strokeStyle = css(lit, .75); ctx.lineWidth = 1.6; line3(ctx, cam, top); ctx.stroke();
}
// valley mist: soft banks floating in the gorge (drawn after the bridge piers so they stand in it), lit from above by the dawn
const MIST = (() => { const r = prng(404), m = []; for (let i = 0; i < 70; i++) m.push({ x: (r() - .5) * 1800, z: mix(-14, -118, r()), y: G.valY + 6 + r() * 30, w: 90 + r() * 200, h: 10 + r() * 22, sp: (r() - .4) * 1.4, a: .35 + .4 * r() }); return m; })();
export function drawMist(ctx, t, cam, S, o = {}) {
  const L = S.L, col = tri(['#2e3470', '#d49aa6', '#ffe6cc'], L), a0 = (o.a ?? 1) * mix(.5, .7, clamp(L - .5));
  const list = MIST.map((m) => ({ m, x: m.x + m.sp * (t - 540) * 1.5 })).map((e) => ({ ...e, c: cs(cam, e.x, e.m.y, e.m.z) })).filter((e) => e.c[2] > 1).sort((p, q) => q.c[2] - p.c[2]);
  ctx.save();
  for (const { m, c } of list) {
    const s = toScr(cam, c), q = cam.f / c[2], rx = m.w * q / 2, ry = Math.max(2, m.h * q / 2 * mix(1, .5, clamp(-cam.pitch * 2)));
    if (s[0] + rx < 0 || s[0] - rx > W || s[1] + ry < 0 || s[1] - ry > H) continue;
    ctx.save(); ctx.translate(s[0], s[1]); ctx.scale(rx, ry);
    const g = ctx.createRadialGradient(0, -.2, 0, 0, 0, 1); g.addColorStop(0, css(col, m.a * a0 * .6)); g.addColorStop(.55, css(col, m.a * a0 * .25)); g.addColorStop(1, css(col, 0));
    ctx.fillStyle = g; ctx.fillRect(-1, -1, 2, 2); ctx.restore();
  }
  ctx.restore();
}
