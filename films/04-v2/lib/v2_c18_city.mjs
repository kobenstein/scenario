// c18 · the city beyond the valley, in world metres: districts of towers in the look of 1.04's skyline (dark, back-lit bodies, a warm
// rim toward the dawn, fog bands at their feet, sparse windows, engraved vertical hatch, set-backs, crowns, slanted tops, water tanks,
// antennas). District A is the one the aqueduct feeds: its few tall towers glow amber from the start; the others wake with the dawn and
// light when the burin's network reaches them (S.wave), and their windows flare gold when the morning sun floods them (S.flare).
//   DIST (district centres), TOWERS, towerLit(T, S), drawTower(ctx, t, cam, T, S), tank()
import { W, H, clamp, mix, rgba, prng } from '../engine.mjs';
import { cs, toScr, NEAR, path3, line3, mixRGB, css, mix3, hash } from './v2_c18_kit.mjs';
import { G, farEdge, plainY, fogC, hazeRGB, tri } from './v2_c18_land.mjs';

// A sits straight ahead (the aqueduct from the left horizon ends in it); D and F lie along the aqueduct (it passes them by), the IF seal
// rises behind D; B, C, E, N wait on the right, back-lit by the sunrise.
export const DIST = { A: [-40, -770], B: [250, -640], C: [430, -1010], D: [-440, -1180], E: [760, -1520], F: [-980, -1960], N: [150, -1420], M: [-230, -1650] };
// the corridors that stay free: the branch from A's castellum to the bridge's landing on the far rim, the bridge axis itself
export const CASTELLUM = [-92, -748];
export const LANDING = [59.2, -226.9];
const segDist = (px, pz, a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1], u = clamp(((px - a[0]) * dx + (pz - a[1]) * dz) / (dx * dx + dz * dz)); return Math.hypot(px - a[0] - u * dx, pz - a[1] - u * dz); };
export const TOWERS = (() => {
  const r = prng(2024), out = [];
  const TOPS = ['flat', 'flat', 'setback', 'crown', 'slant', 'setback', 'flat'];
  const put = (x, z, w, d, h, dist, o = {}) => { out.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, y0: plainY(x, z) - 2, h, top: o.top || TOPS[Math.floor(r() * TOPS.length)], tank: o.tank ?? r() < .3, ant: o.ant ?? r() < .3, seed: Math.floor(r() * 1e6), dist, few: !!o.few, tone: r() }); };
  // A: the few lit towers (tall, close together round the castellum) and their low neighbours
  put(-40, -790, 24, 22, 96, 'A', { few: true, top: 'crown', ant: true, tank: false }); put(-2, -760, 20, 20, 74, 'A', { few: true, top: 'setback', tank: true });
  put(-70, -812, 18, 18, 62, 'A', { few: true, top: 'slant', ant: false }); put(22, -800, 16, 16, 52, 'A', { few: true, top: 'flat', tank: true });
  for (let i = 0; i < 10; i++) put(DIST.A[0] + (r() - .5) * 190, DIST.A[1] - 30 + (r() - .5) * 140, 14 + r() * 12, 14 + r() * 12, 12 + r() * 24, 'A');
  for (const k of Object.keys(DIST)) {
    if (k === 'A') continue;
    const [cx, cz] = DIST[k], n = k === 'F' || k === 'M' || k === 'E' ? 9 : 13, sp = k === 'F' || k === 'E' ? 300 : 220;
    for (let i = 0; i < n; i++) { const x = cx + (r() - .5) * sp, z = cz + (r() - .5) * sp * .7, tall = i < 3 ? 1.8 + r() * .8 : 1; put(x, z, 14 + r() * 16, 14 + r() * 16, (16 + r() * 26) * tall, k); }
  }
  return out.filter((T) => {
    const cx = (T.x0 + T.x1) / 2, cz = (T.z0 + T.z1) / 2, rad = Math.max(T.x1 - T.x0, T.z1 - T.z0) / 2;
    if (cz > farEdge(cx) - 40) return false;
    if (segDist(cx, cz, CASTELLUM, [20, -480]) < 26 + rad || segDist(cx, cz, [20, -480], LANDING) < 26 + rad) return false;   // the branch to you
    if (Math.hypot(cx - CASTELLUM[0], cz - CASTELLUM[1]) < 16 + rad) return false;
    return true;
  });
})();
// lit window fraction and colour: S.wake 0..1 (the city wakes: a few windows), S.wave(T) 0..1 (the burin's network reached it),
// S.flare(T) 0..1 (the morning sun floods its windows)
export function towerLit(T, S) {
  const wv = S.wave ? S.wave(T) : 0, fl = S.flare ? S.flare(T) : 0;
  if (T.dist === 'A' && T.few) return { p: mix(.5, .78, S.few ?? 0), warm: 1, amber: 1, flare: fl };
  const base = .02 + .06 * (S.wake ?? 0);
  return { p: mix(base, .55, wv), warm: mix(.45, 1, wv), amber: wv, flare: fl };
}
const FACES = [ // [corner pair on the footprint, outward normal]
  { n: [0, 1], c: (T) => [[T.x0, T.z1], [T.x1, T.z1]] },   // +Z (west, toward us)
  { n: [1, 0], c: (T) => [[T.x1, T.z1], [T.x1, T.z0]] },   // +X (south: it turns to the sunrise side)
  { n: [-1, 0], c: (T) => [[T.x0, T.z0], [T.x0, T.z1]] },  // −X (north)
  { n: [0, -1], c: (T) => [[T.x1, T.z0], [T.x0, T.z0]] },  // −Z (east, toward the sun)
];
const BODY = [['#10132e', '#2a2444', '#5a4458'], ['#131632', '#2e2848', '#624a5c']];
const RIM = ['#39407a', '#f4b49c', '#ffe4bc'];
export function drawTower(ctx, t, cam, T, S) {
  const L = S.L, hz = hazeRGB(L), cx = (T.x0 + T.x1) / 2, cz = (T.z0 + T.z1) / 2, c = cs(cam, cx, T.y0 + T.h / 2, cz); if (c[2] < NEAR) return;
  const d = Math.hypot(c[0], c[2]), k = fogC(d, L), px = cam.f / c[2];   // px per metre at the tower
  const sx = toScr(cam, c)[0], half = (T.x1 - T.x0 + T.z1 - T.z0) * px; if (sx < -half - 80 || sx > W + half + 80) return;
  const lit = towerLit(T, S), sun = clamp(S.sun ?? 0), yT = T.y0 + T.h, body = tri(BODY[T.tone < .5 ? 0 : 1], L);
  const rimC = tri(RIM, L), rimA = clamp(L * .55 + .1) * (1 - k * .7);
  for (const F of FACES) {
    const [[ax, az], [bx, bz]] = F.c(T), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    if ((cam.x - mx) * F.n[0] + (cam.z - mz) * F.n[1] <= 0) continue;
    const q = [[ax, yT, az], [bx, yT, bz], [bx, T.y0, bz], [ax, T.y0, az]];
    if (!path3(ctx, cam, q)) continue;
    // the sunrise side (south faces) warms as the light comes; the north faces stay deep
    const turn = F.n[0] > 0 ? 1 : F.n[0] < 0 ? -.5 : F.n[1] < 0 ? 1.2 : 0;
    let col = turn > 0 ? mix3(body, [255, 178, 138], clamp(L - .35) * .22 * turn + sun * .18 * turn) : mix3(body, [4, 4, 16], .25 * -turn);
    const top = mix3(mix3(col, [255, 226, 214], .05 * L), hz, k), foot = mix3(col, hz, clamp(k + .5 * (1 - k)));
    const pt = proj2(cam, [mx, yT, mz], [mx, T.y0, mz]);
    if (pt && Math.abs(pt[1][1] - pt[0][1]) > 1) { const g = ctx.createLinearGradient(0, pt[0][1], 0, pt[1][1]); g.addColorStop(0, css(top)); g.addColorStop(.62, css(mix3(top, foot, .35))); g.addColorStop(1, css(foot)); ctx.fillStyle = g; } else ctx.fillStyle = css(top);
    ctx.fill();
    const fw = Math.hypot(bx - ax, bz - az) * px;
    // engraved vertical hatch (the intaglio shadow of 1.04's near towers), only where it reads
    if (fw > 16 && T.h * px > 30) {
      ctx.save(); ctx.clip(); ctx.strokeStyle = css(mix3(body, [0, 0, 6], .6), .28 * (1 - k)); ctx.lineWidth = .8; ctx.beginPath();
      const n = Math.min(60, Math.floor(fw / 3.2));
      for (let i = 1; i < n; i++) { const u = i / n, x = mix(ax, bx, u), z = mix(az, bz, u), y1 = mix(yT, T.y0, .15 + .3 * hash(T.seed * .01 + i)); line3(ctx, cam, [[x, y1, z], [x, T.y0, z]], true); }
      ctx.stroke(); ctx.restore();
    }
    windows(ctx, cam, T, F, lit, px, k, L, hz, [ax, az], [bx, bz]);
    // the rim toward the light: the face's top edge, and its sunward vertical edge
    if (rimA > .02) {
      ctx.strokeStyle = css(rimC, rimA); ctx.lineWidth = clamp(px * .35, .7, 2); line3(ctx, cam, [[ax, yT, az], [bx, yT, bz]]); ctx.stroke();
      if (T.h * px > 18) { const e = F.n[1] !== 0 ? (bx > ax ? [bx, bz] : [ax, az]) : F.n[0] > 0 ? (bz < az ? [bx, bz] : [ax, az]) : null; if (e) { ctx.strokeStyle = css(rimC, rimA * .8); line3(ctx, cam, [[e[0], yT, e[1]], [e[0], mix(yT, T.y0, .55), e[1]]]); ctx.stroke(); } }
    }
  }
  // the roof and what stands on it
  if (cam.y > yT - 1 && path3(ctx, cam, [[T.x0, yT, T.z0], [T.x1, yT, T.z0], [T.x1, yT, T.z1], [T.x0, yT, T.z1]])) { ctx.fillStyle = css(mix3(mix3(body, rimC, .22 * L), hz, k)); ctx.fill(); }
  const dark = mix3(mix3(body, [0, 0, 8], .2), hz, k * .9), tw = T.x1 - T.x0;
  let yTop = yT;
  if (T.top === 'setback') { const ix = tw * .2, iz = (T.z1 - T.z0) * .2, h2 = T.h * .16; box(ctx, cam, T.x0 + ix, T.x1 - ix, T.z0 + iz, T.z1 - iz, yT, yT + h2, dark, rimC, rimA, L); yTop = yT + h2; }
  if (T.top === 'crown') { const ap = [cx, yT + tw * .7, cz]; for (const [a, b] of [[[T.x0, T.z1], [T.x1, T.z1]], [[T.x1, T.z1], [T.x1, T.z0]], [[T.x0, T.z0], [T.x0, T.z1]]]) if (path3(ctx, cam, [[a[0], yT, a[1]], [b[0], yT, b[1]], ap])) { ctx.fillStyle = css(dark); ctx.fill(); } ctx.strokeStyle = css(rimC, rimA); ctx.lineWidth = clamp(px * .3, .6, 1.6); line3(ctx, cam, [[T.x1, yT, T.z1], ap]); ctx.stroke(); yTop = ap[1]; }
  if (T.top === 'slant') { const a1 = [[T.x0, yT, T.z1], [T.x1, yT + tw * .55, T.z1], [T.x1, yT + tw * .55, T.z0], [T.x0, yT, T.z0]]; if (path3(ctx, cam, [[T.x0, yT, T.z1], [T.x1, yT, T.z1], [T.x1, yT + tw * .55, T.z1]])) { ctx.fillStyle = css(dark); ctx.fill(); } if (path3(ctx, cam, [[T.x1, yT, T.z1], [T.x1, yT, T.z0], [T.x1, yT + tw * .55, T.z0], [T.x1, yT + tw * .55, T.z1]])) { ctx.fillStyle = css(mix3(dark, rimC, .12)); ctx.fill(); } if (cam.y > yT && path3(ctx, cam, a1)) { ctx.fillStyle = css(mix3(dark, rimC, .2)); ctx.fill(); } ctx.strokeStyle = css(rimC, rimA); ctx.lineWidth = clamp(px * .3, .6, 1.6); line3(ctx, cam, [[T.x0, yT, T.z1], [T.x1, yT + tw * .55, T.z1]]); ctx.stroke(); }
  if (T.tank && px > .45) tank(ctx, cam, cx + tw * .18, yTop, cz, dark, L, rimC, rimA);
  if (T.ant && px > .35) { const ax = cx - tw * .2, ay = yTop; ctx.strokeStyle = css(dark); ctx.lineWidth = Math.max(.7, px * .45); line3(ctx, cam, [[ax, ay, cz], [ax, ay + 9 + (T.seed % 11), cz]]); ctx.stroke(); }
}
const proj2 = (cam, a, b) => { const p = cs(cam, ...a), q = cs(cam, ...b); if (p[2] < NEAR || q[2] < NEAR) return null; return [toScr(cam, p), toScr(cam, q)]; };
function box(ctx, cam, x0, x1, z0, z1, y0, y1, col, rimC, rimA, L) {
  for (const F of FACES) {
    const T = { x0, x1, z0, z1 }, [[ax, az], [bx, bz]] = F.c(T), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    if ((cam.x - mx) * F.n[0] + (cam.z - mz) * F.n[1] <= 0) continue;
    if (path3(ctx, cam, [[ax, y1, az], [bx, y1, bz], [bx, y0, bz], [ax, y0, az]])) { ctx.fillStyle = css(F.n[0] > 0 ? mix3(col, rimC, .1 * L) : col); ctx.fill(); }
    ctx.strokeStyle = css(rimC, rimA); ctx.lineWidth = 1; line3(ctx, cam, [[ax, y1, az], [bx, y1, bz]]); ctx.stroke();
  }
  if (cam.y > y1 && path3(ctx, cam, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])) { ctx.fillStyle = css(mix3(col, rimC, .2 * L)); ctx.fill(); }
}
// a water tank on stilts (1.04's tank): legs with a cross-brace, a cedar drum with hoops, a conical lid, rimmed toward the light
export function tank(ctx, cam, x, y, z, col, L, rimC, rimA = 0) {
  const q = cam.f / Math.max(1, cs(cam, x, y, z)[2]);
  ctx.strokeStyle = css(col); ctx.lineWidth = Math.max(.6, q * .3);
  ctx.beginPath(); for (const [dx, dz] of [[-2.2, -2.2], [2.2, -2.2], [2.2, 2.2], [-2.2, 2.2]]) line3(ctx, cam, [[x + dx, y, z + dz], [x + dx * .9, y + 4, z + dz * .9]], true);
  line3(ctx, cam, [[x - 2.2, y + .4, z + 2.2], [x + 2, y + 3.6, z + 2]], true); ctx.stroke();
  const n = 12, ring = (yy, r) => Array.from({ length: n }, (_, i) => [x + Math.cos(i / n * Math.PI * 2) * r, yy, z + Math.sin(i / n * Math.PI * 2) * r]);
  const lo = ring(y + 4, 2.6), hi = ring(y + 8.6, 2.6);
  ctx.fillStyle = css(mix3(col, [40, 30, 50], .15)); ctx.beginPath();
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; path3(ctx, cam, [lo[i], lo[j], hi[j], hi[i]], true); }
  ctx.fill();
  if (q > 4) { ctx.strokeStyle = css(mix3(col, [0, 0, 0], .4), .7); ctx.lineWidth = .8; ctx.beginPath(); for (const hy of [5.3, 6.6, 7.9]) line3(ctx, cam, ring(y + hy, 2.62).concat([ring(y + hy, 2.62)[0]]), true); ctx.stroke(); }
  ctx.fillStyle = css(col); ctx.beginPath(); for (let i = 0; i < n; i++) { const j = (i + 1) % n; path3(ctx, cam, [hi[i], hi[j], [x, y + 11.2, z]], true); } ctx.fill();
  if (rimC && rimA > 0) { ctx.strokeStyle = css(rimC, rimA * .8); ctx.lineWidth = Math.max(.6, q * .12); line3(ctx, cam, [[x + 2.6, y + 4, z], [x + 2.6, y + 8.6, z], [x, y + 11.2, z]]); ctx.stroke(); }
}
// windows of one face: floors every 3.6 m, exact rows (both row ends projected); only lit windows are drawn (warm / cool / amber / gold)
function windows(ctx, cam, T, F, lit, px, k, L, hz, a, b) {
  const fh = 3.6, ww = 3.2, rows = Math.floor((T.h - 4) / fh), wlen = Math.hypot(b[0] - a[0], b[1] - a[1]), cols = Math.max(1, Math.floor((wlen - 2) / ww));
  const wpx = px * 1.5; if (wpx < .35 || rows < 1) return;
  const fade = clamp(1 - k * 1.1), fl = clamp(lit.flare ?? 0);
  const warmC = mix3(mixRGB('#ffcf8a', '#ffb35c', lit.amber), [255, 236, 190], fl * .6), coolC = [190, 210, 245];
  const sh = (T.seed % 997) * 13.1 + (F.n[0] * 3 + F.n[1] * 7);
  const pW = [], pC = [];
  for (let rr = 0; rr < rows; rr++) {
    const y0 = T.y0 + 2.4 + rr * fh, y1 = y0 + 1.9;
    const A0 = cs(cam, a[0], y0, a[1]), B0 = cs(cam, b[0], y0, b[1]), A1 = cs(cam, a[0], y1, a[1]), B1 = cs(cam, b[0], y1, b[1]);
    if (A0[2] < NEAR || B0[2] < NEAR) continue;
    const pA0 = toScr(cam, A0), pB0 = toScr(cam, B0), pA1 = toScr(cam, A1), pB1 = toScr(cam, B1);
    for (let cc = 0; cc < cols; cc++) {
      const h = hash(sh + rr * 31.7 + cc * 7.13); if (h >= lit.p) continue;
      const u0 = (1 + cc * ww + .8) / wlen, u1 = u0 + 1.5 / wlen;
      const q = [[mix(pA0[0], pB0[0], u0), mix(pA0[1], pB0[1], u0)], [mix(pA0[0], pB0[0], u1), mix(pA0[1], pB0[1], u1)], [mix(pA1[0], pB1[0], u1), mix(pA1[1], pB1[1], u1)], [mix(pA1[0], pB1[0], u0), mix(pA1[1], pB1[1], u0)]];
      (hash(sh * .7 + rr * 3.3 + cc) < lit.warm ? pW : pC).push(q);
    }
  }
  const fillQ = (Q, col) => { if (!Q.length) return; ctx.fillStyle = col; ctx.beginPath(); for (const q of Q) { ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); ctx.lineTo(q[2][0], q[2][1]); ctx.lineTo(q[3][0], q[3][1]); ctx.closePath(); } ctx.fill(); };
  fillQ(pC, css(mix3(coolC, hz, k * .5), .7 * fade));
  fillQ(pW, css(mix3(warmC, [255, 244, 224], .12), (.9 + .1 * fl) * fade));
}
