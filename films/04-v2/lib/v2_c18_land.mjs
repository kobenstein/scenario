// c18 · the land of the dawn take, in world metres (Y up, the sunrise along −Z, +X to the right): the far plain with its hills and
// towns up to the horizon, the far city on the far rim of the valley (one district lit by the aqueduct of 3.02), the misty valley (the
// gap of 3.02), the arcades (the aqueduct, the network the burin draws in 18.05, the bridge across the gap), drawn back to front.
// Every arcade is one builder (arcade()): the 3.02 look in perspective — blue stone, two tiers (tall lower arches, three small upper
// arches per bay), dark cornices with a light lip, the lit channel lip, voussoir ticks, the inner faces of the piers through the openings.
import { W, H, clamp, mix, rgba, prng } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { TAU, cs, toScr, P3, NEAR, path3, line3, proj, mixRGB, css, mix3, ramp, hash, sio, horizonY } from './v2_c18_kit.mjs';

// ---------------------------------------------------------------- geometry
export const G = { coping: 1.05, roofY: 0, rimY: -34, valY: -112, farY: -30 };
const NZ = vnoise(17);
export const nearEdge = (x) => -0.6 + 5 * Math.sin(x * .013 + .4) * clamp((Math.abs(x) - 16) / 40);
export const farEdge = (x) => -236 + 9 * Math.sin(x * .0047 + 1) + 5 * Math.sin(x * .017 + 2);
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
export const fogK = (d, L) => clamp(1 - Math.exp(-d / mix(5200, 7800, clamp(L / 2))));
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
  for (const d of ds) { const x = cam.x + fw[0] * d, z = Math.min(cam.z + fw[1] * d, farEdge(x) - 1), y = plainY(x, z), p = cs(cam, x, y, z); if (p[2] < NEAR) continue; const s = toScr(cam, p); stops.push([s[1], mix3(tri(['#141634', '#3a3058', '#8e6c74'], L), hz, fogK(d, L))]); }
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
  const list = [];
  HILLPTS.forEach((pts, k) => list.push({ z: HILLS[k].z, draw: () => hill(ctx, t, cam, S, pts, HILLS[k]) }));
  for (const it of items || []) list.push(it);
  // the contour lines between the hills (one item per band, so a hill covers the lines behind it)
  for (let i = 0; i < CONT.length; i++) { const d = CONT[i]; list.push({ z: farEdge(0) - d, draw: () => contour(ctx, t, cam, S, d, i) }); }
  for (const F of FIELDS) list.push({ z: F[0][2], draw: () => field(ctx, cam, S, F) });
  list.sort((a, b) => a.z - b.z);
  for (const it of list) it.draw();
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

// ---------------------------------------------------------------- the valley: the far cliff face, the floor, the river, the mist
const RIVER = (() => { const p = []; for (let x = -3200; x <= 3200; x += 40) p.push([x, G.valY + .4, -118 + 34 * Math.sin(x * .0042 + .6) + 12 * Math.sin(x * .011)]); return p; })();
export function drawValley(ctx, t, cam, S) {
  const L = S.L, hz = hazeRGB(L);
  // the floor
  const F = []; for (let x = -3200; x <= 3200; x += 160) F.push([x, G.valY, nearEdge(x) - 18]); for (let x = 3200; x >= -3200; x -= 160) F.push([x, G.valY, farEdge(x) + 16]);
  if (path3(ctx, cam, F)) { ctx.fillStyle = css(mix3(tri(['#0b0c22', '#2a2546', '#5c4a5c'], L), hz, .2)); ctx.fill(); }
  // the river catches the sky
  const rv = RIVER.map(([x, y, z]) => [x, y, z]), rv2 = RIVER.map(([x, y, z]) => [x, y, z + 9]);
  if (path3(ctx, cam, rv.concat(rv2.reverse()))) { ctx.fillStyle = css(tri(['#2a2f62', '#d99a9a', '#ffe0b4'], L), .8); ctx.fill(); }
  // the far cliff: strips facing the camera, rock hatch, the rim lit by the dawn behind it
  const step = 50, body = tri(['#141638', '#2e2850', '#5a4660'], L);
  for (let x = -3000; x < 3000; x += step) {
    const x1 = x + step, q = [[x, G.farY, farEdge(x)], [x1, G.farY, farEdge(x1)], [x1, G.valY, farEdge(x1) + 16], [x, G.valY, farEdge(x) + 16]];
    const c = cs(cam, x + step / 2, (G.farY + G.valY) / 2, farEdge(x) + 8); if (c[2] < NEAR) continue;
    const s = toScr(cam, c); if (s[0] < -cam.f || s[0] > W + cam.f) continue;
    if (!path3(ctx, cam, q)) continue;
    const d = Math.hypot(c[0], c[2]), k = fogK(d, L) * .7;
    ctx.fillStyle = css(mix3(mix3(body, [0, 0, 0], .15 * Math.sin(x * .07) ** 2), hz, k)); ctx.fill();
  }
  // rock strokes on the cliff (projected verticals, broken)
  ctx.strokeStyle = css(mix3(body, [0, 0, 0], .5), .45); ctx.lineWidth = .7; ctx.beginPath();
  for (let x = -1800; x < 1800; x += 7) { const z0 = farEdge(x), h0 = hash(x * .37), y0 = G.farY - 2 - h0 * 8, y1 = G.valY + 10 + hash(x * .91) * 30; line3(ctx, cam, [[x, y0, z0 + 1], [x + (h0 - .5) * 3, y1, z0 + 16 * sio((G.farY - y1) / (G.farY - G.valY))]], true); }
  ctx.stroke();
  const rimC = tri(['#5d63a8', '#f2b0a0', '#ffe6c0'], L), rimP = []; for (let x = -3000; x <= 3000; x += 25) rimP.push([x, G.farY + .2, farEdge(x)]);
  ctx.strokeStyle = css(rimC, .7); ctx.lineWidth = 1.4; line3(ctx, cam, rimP); ctx.stroke();
}
// valley mist: soft sprites floating over the floor (drawn after the bridge piers so they stand in it)
const MIST = (() => { const r = prng(404), m = []; for (let i = 0; i < 46; i++) m.push({ x: (r() - .5) * 2600, z: mix(-30, -215, r()), y: G.valY + 8 + r() * 34, w: 140 + r() * 260, h: 14 + r() * 26, sp: (r() - .4) * 1.6, a: .35 + .4 * r() }); return m; })();
export function drawMist(ctx, t, cam, S, o = {}) {
  const L = S.L, col = tri(['#3a4078', '#e0a6a8', '#fff0dc'], L), a0 = (o.a ?? 1) * mix(.55, .75, clamp(L - .5));
  const list = MIST.map((m) => ({ m, d: cs(cam, m.x + m.sp * t, m.y, m.z)[2] })).filter((e) => e.d > NEAR).sort((p, q) => q.d - p.d);
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  for (const { m } of list) {
    const x = m.x + m.sp * (t - 540) * 1.5, c = cs(cam, x, m.y, m.z); if (c[2] < 1) continue;
    const s = toScr(cam, c), q = cam.f / c[2], rx = m.w * q / 2, ry = m.h * q / 2 * mix(1, .45, clamp(-cam.pitch * 2));
    if (s[0] + rx < 0 || s[0] - rx > W || s[1] + ry < 0 || s[1] - ry > H) continue;
    ctx.save(); ctx.translate(s[0], s[1]); ctx.scale(rx, Math.max(2, ry));
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, css(col, m.a * a0 * .55)); g.addColorStop(.55, css(col, m.a * a0 * .25)); g.addColorStop(1, css(col, 0));
    ctx.fillStyle = g; ctx.fillRect(-1, -1, 2, 2); ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- arcades (the 3.02 aqueduct in perspective)
// path: [[x, z], …] polyline; o: { top (Y of the channel lip), ground(x, z), bay, pier, width, upper (height of the upper tier), small (3) }
// → { len, at(s) → [x, z, dirx, dirz], bays: [{ s0, s1, …3D outlines… }] }
export function arcade(path, o) {
  const cum = [0]; for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
  const len = cum[cum.length - 1];
  const at = (s) => { s = clamp(s, 0, len); let i = 1; while (i < cum.length - 1 && cum[i] < s) i++; const a = path[i - 1], b = path[i], q = (s - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1), dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1; return [mix(a[0], b[0], q), mix(a[1], b[1], q), dx / l, dz / l]; };
  const bay = o.bay, n = Math.max(1, Math.round(len / bay)), bl = len / n, pw = o.pier ?? bl * .2, wd = o.width ?? 5, top = o.top, up = o.upper ?? bl * .42;
  const bays = [];
  for (let i = 0; i < n; i++) {
    const s0 = i * bl, s1 = s0 + bl, sm0 = (s0 + s1) / 2, [mx, mz] = at(sm0), gy = Math.min(o.ground(mx, mz), top - up - 4);
    bays.push({ i, s0, s1, sm: sm0, gy, mx, mz });
  }
  return { len, at, bays, bl, pw, wd, top, up, small: o.small ?? 3, ground: o.ground };
}
// a point on the arcade: s along, side −1 left / +1 right face, y height
const side3 = (A, s, sd, y) => { const [x, z, dx, dz] = A.at(s), nx = -dz, nz = dx; return [x + nx * sd * A.wd / 2, y, z + nz * sd * A.wd / 2]; };
// the outline of one bay's face (side sd) as 3D polygons: the solid face (outer) and its openings (holes)
function bayFace(A, b, sd) {
  const { pw, top, up } = A, s0 = b.s0, s1 = b.s1, gy = b.gy, yc = top - up;   // yc = the cornice between the tiers
  const outer = [side3(A, s0, sd, top), side3(A, s1, sd, top), side3(A, s1, sd, gy - 4), side3(A, s0, sd, gy - 4)];
  const holes = [];
  // lower tier: one tall opening between the piers, arch crown 2 m under the cornice
  const o0 = s0 + pw / 2, o1 = s1 - pw / 2, r = (o1 - o0) / 2, ys = yc - 2 - r;
  if (ys > gy + 1) { const h = [side3(A, o0, sd, gy - 4)]; for (let k = 0; k <= 12; k++) { const an = Math.PI - k / 12 * Math.PI; h.push(side3(A, (o0 + o1) / 2 + Math.cos(an) * r, sd, ys + Math.sin(an) * r)); } h.push(side3(A, o1, sd, gy - 4)); holes.push({ pts: h, lower: true, o0, o1, r, ys }); }
  // upper tier: small arches
  const n = A.small, sw = (s1 - s0) / n;
  for (let j = 0; j < n; j++) {
    const u0 = s0 + j * sw + sw * .2, u1 = s0 + (j + 1) * sw - sw * .2, rr = (u1 - u0) / 2, ys2 = top - 1.4 - rr, yb = yc + .6;
    if (ys2 <= yb) continue;
    const h = [side3(A, u0, sd, yb)]; for (let k = 0; k <= 8; k++) { const an = Math.PI - k / 8 * Math.PI; h.push(side3(A, (u0 + u1) / 2 + Math.cos(an) * rr, sd, ys2 + Math.sin(an) * rr)); } h.push(side3(A, u1, sd, yb));
    holes.push({ pts: h, lower: false, o0: u0, o1: u1, r: rr, ys: ys2, yb });
  }
  return { outer, holes };
}
// which face of the arcade looks at the camera at s
const faceSide = (A, cam, s) => { const [x, z, dx, dz] = A.at(s), nx = -dz, nz = dx; return (cam.x - x) * nx + (cam.z - z) * nz > 0 ? 1 : -1; };
const STONE = ['#2c3060', '#5a4e78', '#9a7c8e'], STONE_L = ['#40467c', '#7c6890', '#c8a098'], STONE_TOP = ['#4b5188', '#b08a9c', '#f0c8a8'];
// draw bay b of arcade A. o: { L, hz (haze rgb), lit 0..1 (amber channel), lip (lip colour mix), detail 0..1 (LOD), clipS [s0, s1] (only this
// stretch exists: the broken end / growth), broken (loose blocks at the end) }
export function drawBay(ctx, t, cam, A, b, o) {
  const L = o.L, sd = faceSide(A, cam, b.sm), c = cs(cam, ...side3(A, b.sm, sd, (A.top + b.gy) / 2)); if (c[2] < NEAR) return;
  const d = Math.hypot(c[0], c[2]), k = fogK(d, L) * (o.fogMul ?? 1), hz = o.hz, px = cam.f / c[2] * (b.s1 - b.s0);   // px = the bay's width on screen
  if (px < .6) return;
  const st = mix3(tri(STONE, L), hz, k), stL = mix3(tri(STONE_L, L), hz, k), stT = mix3(tri(STONE_TOP, L), hz, k), dark = mix3(mix3(tri(['#1b1e42', '#2e2a50', '#4e3e58'], L), hz, k), [0, 0, 0], .1);
  const F = bayFace(A, b, sd);
  // inner faces (seen through the openings): the pier side toward the camera and the soffit
  if (px > 6) {
    ctx.fillStyle = css(dark);
    for (const h of F.holes) {
      const p0 = h.o0, p1 = h.o1, mid = (p0 + p1) / 2, toward = cs(cam, ...side3(A, p0, sd, h.ys))[0] < cs(cam, ...side3(A, p1, sd, h.ys))[0];
      // the far face's arch (the soffit is the band between front and back arch curves)
      const back = h.pts.map((p, i) => { const s = i === 0 ? p0 : i === h.pts.length - 1 ? p1 : mid + Math.cos(Math.PI - (i - 1) / (h.pts.length - 3) * Math.PI) * h.r; return side3(A, s, -sd, p[1]); });
      ctx.beginPath(); path3(ctx, cam, h.pts.concat(back.slice().reverse()), true); ctx.fill('evenodd');
      void toward;
    }
  }
  // the face with its openings
  ctx.beginPath(); path3(ctx, cam, F.outer, true); for (const h of F.holes) { if (px > 3 || h.lower) path3(ctx, cam, h.pts.slice().reverse(), true); }
  const sy = proj(cam, [side3(A, b.sm, sd, A.top), side3(A, b.sm, sd, b.gy)]);
  if (sy.length === 2 && Math.abs(sy[1][1] - sy[0][1]) > 1) { const g = ctx.createLinearGradient(0, sy[0][1], 0, sy[1][1]); g.addColorStop(0, css(stT)); g.addColorStop(.1, css(stL)); g.addColorStop(.5, css(st)); g.addColorStop(1, css(mix3(st, [10, 12, 40], .55))); ctx.fillStyle = g; } else ctx.fillStyle = css(st);
  ctx.fill('evenodd');
  if (px > 14) {   // engraved detail: stone courses, cornices, voussoir ticks
    const det = clamp((px - 14) / 40);
    ctx.save(); ctx.beginPath(); path3(ctx, cam, F.outer, true); for (const h of F.holes) path3(ctx, cam, h.pts.slice().reverse(), true); ctx.clip('evenodd');
    ctx.strokeStyle = css(mix3(st, [5, 6, 20], .7), .38 * det); ctx.lineWidth = .8; ctx.beginPath();
    for (let y = A.top - 1; y > b.gy; y -= 1.4) line3(ctx, cam, [side3(A, b.s0, sd, y), side3(A, b.s1, sd, y)], true);
    ctx.stroke(); ctx.restore();
    ctx.strokeStyle = css(mix3(st, [5, 6, 20], .8), .85); ctx.lineWidth = Math.min(3, px / 40); ctx.beginPath();
    line3(ctx, cam, [side3(A, b.s0, sd, A.top - 1.6), side3(A, b.s1, sd, A.top - 1.6)], true); line3(ctx, cam, [side3(A, b.s0, sd, A.top - A.up), side3(A, b.s1, sd, A.top - A.up)], true); ctx.stroke();
    ctx.strokeStyle = css(mix3(stL, [200, 205, 240], .3), .4); ctx.lineWidth = 1.2; ctx.beginPath();
    line3(ctx, cam, [side3(A, b.s0, sd, A.top - 1.3), side3(A, b.s1, sd, A.top - 1.3)], true); line3(ctx, cam, [side3(A, b.s0, sd, A.top - A.up + .3), side3(A, b.s1, sd, A.top - A.up + .3)], true); ctx.stroke();
    ctx.strokeStyle = css(mix3(st, [5, 6, 20], .7), .7 * det); ctx.lineWidth = .9; ctx.beginPath();
    for (const h of F.holes) { if (!h.lower) continue; const m = (h.o0 + h.o1) / 2; for (let v = 0; v <= 11; v++) { const an = Math.PI - v / 11 * Math.PI; line3(ctx, cam, [side3(A, m + Math.cos(an) * h.r, sd, h.ys + Math.sin(an) * h.r), side3(A, m + Math.cos(an) * (h.r + 1.4), sd, h.ys + Math.sin(an) * (h.r + 1.4))], true); } }
    ctx.stroke();
  }
  // the channel lip on top: light stone, an amber line when the light flows
  const lip = [side3(A, b.s0, sd, A.top), side3(A, b.s1, sd, A.top)], lipB = [side3(A, b.s0, -sd, A.top), side3(A, b.s1, -sd, A.top)];
  if (path3(ctx, cam, [lip[0], lip[1], lipB[1], lipB[0]])) { ctx.fillStyle = css(mix3(stT, [230, 230, 250], .25)); ctx.fill(); }
  ctx.strokeStyle = css(mix3(stT, [255, 255, 255], .3), .7); ctx.lineWidth = Math.max(.6, Math.min(2, px / 30)); line3(ctx, cam, lip); ctx.stroke();
  if (o.lit > 0) { ctx.strokeStyle = rgba('#ffb35c', .55 * o.lit); ctx.lineWidth = Math.max(.8, Math.min(3, px / 20)); line3(ctx, cam, [side3(A, b.s0, 0, A.top + .15), side3(A, b.s1, 0, A.top + .15)]); ctx.stroke(); }
}
// the share lights flowing along an arcade's channel: s positions move at v m/s toward the end (dir +1) or the start (−1)
export function flowLights(ctx, t, cam, A, o) {
  const v = o.v ?? 60, P = o.gap ?? 70, n = Math.ceil(A.len / P) + 1, out = [];
  for (let i = 0; i < n; i++) {
    let s = ((i * P + t * v) % (n * P));
    if (o.dir < 0) s = A.len - s;
    if (s < (o.s0 ?? 0) || s > (o.s1 ?? A.len)) continue;
    const [x, z] = A.at(s), c = cs(cam, x, A.top + .9, z); if (c[2] < NEAR) continue;
    const p = toScr(cam, c), r = clamp(cam.f / c[2] * 1.1, .8, o.rmax ?? 14);
    out.push([p[0], p[1], r, c[2]]);
  }
  return out;
}
