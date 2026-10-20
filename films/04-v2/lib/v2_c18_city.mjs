// c18 · the far city on the far rim of the valley: towers in world metres (boxes with set-backs, crowns, water tanks, antennas), window
// grids that light by state (dark, waking, the lit district A that the aqueduct feeds, the warm wave of 18.05), rims toward the dawn.
//   TOWERS, DIST (district centres), towerLit(T, S) → fraction of lit windows, drawTower(ctx, t, cam, T, S)
import { W, H, clamp, mix, rgba, prng } from '../engine.mjs';
import { cs, toScr, P3, NEAR, path3, line3, mixRGB, css, mix3, hash } from './v2_c18_kit.mjs';
import { G, farEdge, plainY, fogK, hazeRGB, tri } from './v2_c18_land.mjs';

// district centres (x, z); A is fed by the aqueduct (its few towers are lit), the others wait
export const DIST = { A: [-112, -560], B: [10, -470], C: [205, -640], D: [-330, -720], E: [470, -900], F: [-560, -980], N: [120, -1180], M: [-170, -1350] };
export const TOWERS = (() => {
  const r = prng(2024), out = [];
  const put = (x, z, w, d, h, dist, o = {}) => { const y0 = plainY(x, z) - 1; out.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, y0, h, top: o.top || ['flat', 'flat', 'setback', 'crown', 'setback'][Math.floor(r() * 5)], tank: o.tank ?? r() < .22, ant: o.ant ?? r() < .25, seed: Math.floor(r() * 1e6), dist, few: !!o.few, tone: r() }); };
  // district A: the few lit towers (tall, close together) and their low neighbours
  put(-128, -548, 22, 22, 92, 'A', { few: true, top: 'crown', ant: true }); put(-96, -580, 20, 24, 74, 'A', { few: true, top: 'setback' }); put(-150, -600, 18, 18, 64, 'A', { few: true, top: 'flat', tank: true });
  put(-82, -530, 16, 16, 48, 'A', { few: true, top: 'flat', tank: true });
  for (const k of Object.keys(DIST)) {
    if (k === 'A') { for (let i = 0; i < 6; i++) put(DIST.A[0] + (r() - .5) * 150, DIST.A[1] + (r() - .5) * 120, 14 + r() * 12, 14 + r() * 12, 14 + r() * 22, 'A'); continue; }
    const [cx, cz] = DIST[k], n = k === 'N' || k === 'M' || k === 'F' ? 7 : 11;
    for (let i = 0; i < n; i++) { const x = cx + (r() - .5) * 190, z = cz + (r() - .5) * 150, tall = r() < .3 ? 1.6 : 1; put(x, z, 14 + r() * 16, 14 + r() * 16, (18 + r() * 46) * tall, k); }
  }
  // keep the bridge's landing and the aqueduct's corridor free, and everything behind the far rim
  return out.filter((T) => { const cx = (T.x0 + T.x1) / 2, cz = (T.z0 + T.z1) / 2; return cz < farEdge(cx) - 25 && !(cx > 0 && cx < 110 && cz > -330); });
})();
// lit window fraction and warmth: S.wake 0..1 (the city wakes: a few windows), S.fed (district A fed), S.wave(T) 0..1 (18.05 reached it)
export function towerLit(T, S) {
  const wv = S.wave ? S.wave(T) : 0;
  if (T.dist === 'A' && T.few) return { p: mix(.55, .8, S.few ?? 0), warm: 1, amber: 1 };
  const base = .025 + .07 * (S.wake ?? 0);
  return { p: mix(base, .62, wv), warm: mix(.35, 1, wv), amber: wv };
}
const FACES = [ // [corner indices on the footprint, normal]
  { n: [0, 1], c: (T) => [[T.x0, T.z1], [T.x1, T.z1]] },   // +Z (west, toward us)
  { n: [1, 0], c: (T) => [[T.x1, T.z1], [T.x1, T.z0]] },   // +X (south)
  { n: [-1, 0], c: (T) => [[T.x0, T.z0], [T.x0, T.z1]] },  // −X (north)
  { n: [0, -1], c: (T) => [[T.x1, T.z0], [T.x0, T.z0]] },  // −Z (east, toward the sun)
];
export function drawTower(ctx, t, cam, T, S) {
  const L = S.L, hz = hazeRGB(L), cx = (T.x0 + T.x1) / 2, cz = (T.z0 + T.z1) / 2, c = cs(cam, cx, T.y0 + T.h / 2, cz); if (c[2] < NEAR) return;
  const d = Math.hypot(c[0], c[2]), k = fogK(d, L) * .9, px = cam.f / c[2];   // px per metre at the tower
  const sx = toScr(cam, c)[0], half = (T.x1 - T.x0) * px; if (sx < -half - 60 || sx > W + half + 60) return;
  const lit = towerLit(T, S), sunUp = clamp(S.sunLit ? S.sunLit(cz) : 0);
  const yT = T.y0 + T.h, base = T.tone < .5 ? ['#1c2248', '#3a3462', '#7a5e74'] : ['#20264e', '#40386a', '#86667a'];
  // the faces that look at the camera
  for (const F of FACES) {
    const [[ax, az], [bx, bz]] = F.c(T), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    if ((cam.x - mx) * F.n[0] + (cam.z - mz) * F.n[1] <= 0) continue;
    const q = [[ax, yT, az], [bx, yT, bz], [bx, T.y0, bz], [ax, T.y0, az]];
    if (!path3(ctx, cam, q)) continue;
    const facing = F.n[1] < 0 ? 1 : F.n[0] !== 0 ? .45 : 0;   // how much this face turns to the sunrise
    let col = tri(base, L); col = mix3(col, [255, 196, 150], sunUp * facing * .35); col = mix3(col, hz, k);
    const pt = proj2(cam, [mx, yT, mz], [mx, T.y0, mz]);
    if (pt) { const g = ctx.createLinearGradient(0, pt[0][1], 0, pt[1][1]); g.addColorStop(0, css(mix3(col, [255, 220, 200], .06 * L))); g.addColorStop(1, css(mix3(col, hz, .3 + .2 * (1 - k)))); ctx.fillStyle = g; } else ctx.fillStyle = css(col);
    ctx.fill();
    windows(ctx, cam, T, F, lit, px, k, L, hz, [ax, az], [bx, bz], yT);
    // the rim toward the light: the face edge nearest the sunrise side catches the dawn
    if (L > .2 && px * T.h > 20) {
      const ex = F.n[0] === 0 ? (az < bz ? [ax, az] : [bx, bz]) : (F.n[0] > 0 ? [bx, bz] : [ax, az]), rimA = clamp(L * .5) * (1 - k * .6);
      ctx.strokeStyle = css(tri(['#3a3f7a', '#f2b8a4', '#ffe6c4'], L), rimA); ctx.lineWidth = clamp(px * .5, .8, 2.2); line3(ctx, cam, [[ex[0], yT, ex[1]], [ex[0], mix(yT, T.y0, .65), ex[1]]]); ctx.stroke();
    }
  }
  // the roof and what stands on it
  if (cam.y > yT - 1) { if (path3(ctx, cam, [[T.x0, yT, T.z0], [T.x1, yT, T.z0], [T.x1, yT, T.z1], [T.x0, yT, T.z1]])) { ctx.fillStyle = css(mix3(tri(['#2a3060', '#5c4c74', '#a88690'], L), hz, k)); ctx.fill(); } }
  const top = mix3(tri(['#161a3c', '#2e2a50', '#5a4a62'], L), hz, k);
  if (T.top === 'setback') { const ix = (T.x1 - T.x0) * .2, iz = (T.z1 - T.z0) * .2; box(ctx, cam, T.x0 + ix, T.x1 - ix, T.z0 + iz, T.z1 - iz, yT, yT + T.h * .14, top, L); }
  if (T.top === 'crown') { const ap = [cx, yT + (T.x1 - T.x0) * .55, cz]; for (const [a, b] of [[[T.x0, T.z1], [T.x1, T.z1]], [[T.x1, T.z1], [T.x1, T.z0]], [[T.x0, T.z0], [T.x0, T.z1]]]) { if (path3(ctx, cam, [[a[0], yT, a[1]], [b[0], yT, b[1]], ap])) { ctx.fillStyle = css(top); ctx.fill(); } } }
  if (T.tank && px > .8) tank(ctx, cam, cx + (T.x1 - T.x0) * .18, yT + (T.top === 'setback' ? T.h * .14 : 0), cz, top, L);
  if (T.ant && px > .5) { const ax = cx - (T.x1 - T.x0) * .2, ay = yT + (T.top === 'crown' ? (T.x1 - T.x0) * .55 : T.top === 'setback' ? T.h * .14 : 0); ctx.strokeStyle = css(top); ctx.lineWidth = Math.max(.7, px * .5); line3(ctx, cam, [[ax, ay, cz], [ax, ay + 10 + (T.seed % 9), cz]]); ctx.stroke(); }
}
const proj2 = (cam, a, b) => { const p = cs(cam, ...a), q = cs(cam, ...b); if (p[2] < NEAR || q[2] < NEAR) return null; return [toScr(cam, p), toScr(cam, q)]; };
function box(ctx, cam, x0, x1, z0, z1, y0, y1, col, L) {
  for (const F of FACES) {
    const T = { x0, x1, z0, z1 }, [[ax, az], [bx, bz]] = F.c(T), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    if ((cam.x - mx) * F.n[0] + (cam.z - mz) * F.n[1] <= 0) continue;
    if (path3(ctx, cam, [[ax, y1, az], [bx, y1, bz], [bx, y0, bz], [ax, y0, az]])) { ctx.fillStyle = css(col); ctx.fill(); }
  }
  if (cam.y > y1 && path3(ctx, cam, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])) { ctx.fillStyle = css(mix3(col, [255, 220, 210], .08 * L)); ctx.fill(); }
}
// a water tank on stilts (1.04's tank, small): legs, a cedar drum, a conical lid
export function tank(ctx, cam, x, y, z, col, L) {
  ctx.strokeStyle = css(col); ctx.lineWidth = Math.max(.6, cam.f / Math.max(1, cs(cam, x, y, z)[2]) * .35);
  ctx.beginPath(); for (const [dx, dz] of [[-2.2, -2.2], [2.2, -2.2], [2.2, 2.2], [-2.2, 2.2]]) line3(ctx, cam, [[x + dx, y, z + dz], [x + dx * .9, y + 4, z + dz * .9]], true); ctx.stroke();
  const n = 10, ring = (yy, r) => Array.from({ length: n }, (_, i) => [x + Math.cos(i / n * Math.PI * 2) * r, yy, z + Math.sin(i / n * Math.PI * 2) * r]);
  const lo = ring(y + 4, 2.6), hi = ring(y + 8.6, 2.6);
  ctx.fillStyle = css(mix3(col, [40, 30, 50], .2)); ctx.beginPath();
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; path3(ctx, cam, [lo[i], lo[j], hi[j], hi[i]], true); }
  ctx.fill();
  ctx.fillStyle = css(col); if (path3(ctx, cam, hi)) ctx.fill();
  ctx.beginPath(); for (let i = 0; i < n; i++) { const j = (i + 1) % n; path3(ctx, cam, [hi[i], hi[j], [x, y + 11.2, z]], true); } ctx.fill();
}
// windows of one face: rows of floors, exact rows (both row ends projected), lit ones warm/cool, unlit dark when big enough
function windows(ctx, cam, T, F, lit, px, k, L, hz, a, b, yT) {
  const fh = 3.6, ww = 3.2, rows = Math.floor((T.h - 4) / fh), wlen = Math.hypot(b[0] - a[0], b[1] - a[1]), cols = Math.max(1, Math.floor((wlen - 2) / ww));
  const wpx = px * 1.6; if (wpx < .45 || rows < 1) return;
  const dark = wpx > 2.2, fade = clamp(1 - k * 1.2);
  const warmC = mixRGB('#ffcf8a', '#ffb35c', lit.amber), coolC = [196, 214, 245];
  const sh = (T.seed % 997) * 13.1 + (F.n[0] * 3 + F.n[1] * 7);
  ctx.save();
  const pathsW = [], pathsC = [], pathsD = [];
  for (let rr = 0; rr < rows; rr++) {
    const y0 = T.y0 + 2.2 + rr * fh, y1 = y0 + 2.0;
    const A0 = cs(cam, a[0], y0, a[1]), B0 = cs(cam, b[0], y0, b[1]), A1 = cs(cam, a[0], y1, a[1]), B1 = cs(cam, b[0], y1, b[1]);
    if (A0[2] < NEAR || B0[2] < NEAR) continue;
    const pA0 = toScr(cam, A0), pB0 = toScr(cam, B0), pA1 = toScr(cam, A1), pB1 = toScr(cam, B1);
    for (let cc = 0; cc < cols; cc++) {
      const h = hash(sh + rr * 31.7 + cc * 7.13), on = h < lit.p, u0 = (1 + cc * ww + .8) / wlen, u1 = u0 + 1.6 / wlen;
      if (!on && !dark) continue;
      const q = [[mix(pA0[0], pB0[0], u0), mix(pA0[1], pB0[1], u0)], [mix(pA0[0], pB0[0], u1), mix(pA0[1], pB0[1], u1)], [mix(pA1[0], pB1[0], u1), mix(pA1[1], pB1[1], u1)], [mix(pA1[0], pB1[0], u0), mix(pA1[1], pB1[1], u0)]];
      (on ? (hash(sh * .7 + rr * 3.3 + cc) < lit.warm ? pathsW : pathsC) : pathsD).push(q);
    }
  }
  const fillQ = (Q, col) => { if (!Q.length) return; ctx.fillStyle = col; ctx.beginPath(); for (const q of Q) { ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); ctx.lineTo(q[2][0], q[2][1]); ctx.lineTo(q[3][0], q[3][1]); ctx.closePath(); } ctx.fill(); };
  fillQ(pathsD, css(mix3(tri(['#0c0e26', '#1e1a38', '#3c2e44'], L), hz, k * .8), .75));
  fillQ(pathsC, css(mix3(coolC, hz, k * .5), .8 * fade));
  fillQ(pathsW, css(mix3(warmC, [255, 240, 220], .15), .95 * fade));
  ctx.restore();
}
