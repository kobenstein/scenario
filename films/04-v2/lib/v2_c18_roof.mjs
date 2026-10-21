// c18 · "here": your rooftop (1.04's roof: concrete parapet with a lit coping, the dark gravel deck with last night's puddle, a vent,
// a roof hatch, a water tank on stilts, an antenna) on a tower at the near rim of the valley, and the low district around it.
// World metres as v2_c18_land.mjs; the roof deck is Y 0, the coping Y 1.05, the east parapet's outer face Z −0.34 (the edge of the gap).
import { W, H, clamp, mix, rgba, prng } from '../engine.mjs';
import { cs, toScr, NEAR, path3, line3, proj, mixRGB, css, mix3, hash } from './v2_c18_kit.mjs';
import { G, nearEdge, fogK, hazeRGB, tri } from './v2_c18_land.mjs';
import { tank } from './v2_c18_city.mjs';

export const ROOFB = { x0: -9, x1: 12, z0: -.34, z1: 20, t: .32, base: G.rimY };
export const YOU = { x: 0, z: .58 };
// the district on the near rim (low blocks, a few taller), kept clear of your tower and of the camera's way down
export const NEAR_B = (() => {
  const r = prng(77), out = [];
  for (let i = 0; i < 70; i++) {
    const x = (r() - .5) * 520, z = 2 + Math.pow(r(), .8) * 260, w = 12 + r() * 20, d = 12 + r() * 20;
    if (x + w / 2 > ROOFB.x0 - 3 && x - w / 2 < ROOFB.x1 + 3 && z - d / 2 < ROOFB.z1 + 6) continue;
    const ne = nearEdge(x); if (z - d / 2 < ne + 1) continue;
    const h = 8 + Math.pow(r(), 1.5) * 34 * (Math.abs(x) < 60 ? .8 : 1);
    out.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, y0: G.rimY, h, tank: r() < .25, seed: Math.floor(r() * 1e6), tone: r() });
  }
  return out;
})();
const FACES = [
  { n: [0, 1], c: (T) => [[T.x0, T.z1], [T.x1, T.z1]] }, { n: [1, 0], c: (T) => [[T.x1, T.z1], [T.x1, T.z0]] },
  { n: [-1, 0], c: (T) => [[T.x0, T.z0], [T.x0, T.z1]] }, { n: [0, -1], c: (T) => [[T.x1, T.z0], [T.x0, T.z0]] },
];
function block(ctx, t, cam, B, S) {
  const L = S.L, hz = hazeRGB(L), cx = (B.x0 + B.x1) / 2, cz = (B.z0 + B.z1) / 2, yT = B.y0 + B.h, c = cs(cam, cx, yT, cz); if (c[2] < NEAR) return;
  const k = fogK(Math.hypot(c[0], c[2]), L) * .8, px = cam.f / c[2];
  const base = B.tone < .5 ? ['#1a1f44', '#3a3462', '#7c6074'] : ['#1e2348', '#433a68', '#8a687a'];
  for (const F of FACES) {
    const [[ax, az], [bx, bz]] = F.c(B), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    if ((cam.x - mx) * F.n[0] + (cam.z - mz) * F.n[1] <= 0) continue;
    if (!path3(ctx, cam, [[ax, yT, az], [bx, yT, bz], [bx, B.y0, bz], [ax, B.y0, az]])) continue;
    const sunny = (F.n[1] < 0 ? 1 : F.n[0] !== 0 ? .4 : 0) * clamp(S.sunNear ?? 0);
    ctx.fillStyle = css(mix3(mix3(tri(base, L), [255, 200, 160], sunny * .35), hz, k)); ctx.fill();
    if (px * 3.6 > 2.5) {   // a few lit windows (the district wakes too)
      const rows = Math.floor((B.h - 3) / 3.4), len = Math.hypot(bx - ax, bz - az), cols = Math.floor(len / 3.4);
      ctx.fillStyle = css(mixRGB('#ffcf8a', '#ffe0b0', .3), .85); ctx.beginPath();
      for (let rr = 0; rr < rows; rr++) for (let cc = 0; cc < cols; cc++) {
        if (hash(B.seed * .013 + rr * 7.1 + cc * 3.3 + F.n[0] * 5 + F.n[1] * 11) > .05 + .12 * (S.wake ?? 0)) continue;
        const u0 = (cc + .3) / cols, u1 = (cc + .7) / cols, y0 = B.y0 + 1.6 + rr * 3.4, y1 = y0 + 1.8;
        path3(ctx, cam, [[mix(ax, bx, u0), y1, mix(az, bz, u0)], [mix(ax, bx, u1), y1, mix(az, bz, u1)], [mix(ax, bx, u1), y0, mix(az, bz, u1)], [mix(ax, bx, u0), y0, mix(az, bz, u0)]], true);
      }
      ctx.fill();
    }
  }
  if (cam.y > yT && path3(ctx, cam, [[B.x0, yT, B.z0], [B.x1, yT, B.z0], [B.x1, yT, B.z1], [B.x0, yT, B.z1]])) { ctx.fillStyle = css(mix3(tri(['#252a52', '#4e4470', '#a08490'], L), hz, k)); ctx.fill(); ctx.strokeStyle = css(mix3(tri(['#3c427a', '#9c84a0', '#e8c0a8'], L), hz, k), .6); ctx.lineWidth = Math.max(.5, Math.min(1.5, px * .3)); ctx.stroke(); }
  if (B.tank && px > .6) tank(ctx, cam, cx + 2, yT, cz + 2, mix3(tri(['#141838', '#2c2848', '#5a4458'], L), hz, k), L, tri(['#39407a', '#f4b49c', '#ffe4bc'], L), .5);
}
// the near rim's ground and its edge (seen from above)
function rimGround(ctx, cam, S) {
  const L = S.L, P = []; for (let x = -1400; x <= 1400; x += 40) P.push([x, G.rimY, nearEdge(x)]); P.push([1400, G.rimY, 1800], [-1400, G.rimY, 1800]);
  if (path3(ctx, cam, P)) { ctx.fillStyle = css(mix3(tri(['#10122c', '#2c2848', '#5a4658'], L), hazeRGB(L), .1)); ctx.fill(); }
  const E = []; for (let x = -1400; x <= 1400; x += 20) E.push([x, G.rimY + .1, nearEdge(x)]);
  ctx.strokeStyle = css(tri(['#3a3f78', '#c99aa6', '#f6d2b4'], L), .55); ctx.lineWidth = 1.2; line3(ctx, cam, E); ctx.stroke();
  // the near cliff's lip falling away (a dark band just past the edge)
}
// your tower: facade (seen from the high camera), parapet, coping, deck and its props
const GRAVEL = (() => { const r = prng(9), g = []; for (let i = 0; i < 900; i++) g.push([mix(ROOFB.x0 + .4, ROOFB.x1 - .4, r()), mix(ROOFB.z0 + .5, ROOFB.z1 - .4, Math.pow(r(), 1.3)), r()]); return g; })();
export function drawRoof(ctx, t, cam, S) {
  const L = S.L, R = ROOFB, cop = G.coping, warm = clamp(S.sunNear ?? 0);
  // the facade (only from outside/above)
  const fac = tri(['#1b2046', '#3e3664', '#86667a'], L);
  for (const F of FACES) {
    const [[ax, az], [bx, bz]] = F.c(R), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    if ((cam.x - mx) * F.n[0] + (cam.z - mz) * F.n[1] <= 0) continue;
    if (path3(ctx, cam, [[ax, cop, az], [bx, cop, bz], [bx, R.base, bz], [ax, R.base, az]])) {
      ctx.fillStyle = css(mix3(fac, [255, 200, 160], (F.n[1] < 0 ? .3 : F.n[0] ? .12 : 0) * warm)); ctx.fill();
      // window rows (dark, a few lit)
      ctx.fillStyle = 'rgba(8,8,22,.5)'; ctx.beginPath();
      const len = Math.hypot(bx - ax, bz - az), cols = Math.floor(len / 3.2);
      for (let y = R.base + 2; y < -2.5; y += 3.3) for (let cc = 0; cc < cols; cc++) { const u0 = (cc + .3) / cols, u1 = (cc + .7) / cols; path3(ctx, cam, [[mix(ax, bx, u0), y + 1.8, mix(az, bz, u0)], [mix(ax, bx, u1), y + 1.8, mix(az, bz, u1)], [mix(ax, bx, u1), y, mix(az, bz, u1)], [mix(ax, bx, u0), y, mix(az, bz, u0)]], true); }
      ctx.fill();
    }
  }
  // the deck: dark membrane, seams, gravel
  const dk = [[R.x0 + R.t, 0, R.z0 + R.t], [R.x1 - R.t, 0, R.z0 + R.t], [R.x1 - R.t, 0, R.z1 - R.t], [R.x0 + R.t, 0, R.z1 - R.t]];
  if (cam.y > 0 && path3(ctx, cam, dk)) {
    const p = proj(cam, [[YOU.x, 0, R.z0], [YOU.x, 0, R.z1]]);
    if (p.length === 2) { const g = ctx.createLinearGradient(0, p[0][1], 0, p[1][1]); g.addColorStop(0, css(tri(['#2a2238', '#4a3a52', '#7a5a62'], L))); g.addColorStop(1, css(tri(['#120f1c', '#241c2c', '#3c2a34'], L))); ctx.fillStyle = g; } else ctx.fillStyle = css(tri(['#1e1a2c', '#382c42', '#5a4450'], L));
    ctx.fill();
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(120,140,190,.08)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = R.x0 + 2; x < R.x1; x += 2.6) line3(ctx, cam, [[x, .01, R.z0], [x, .01, R.z1]], true);
    for (let z = R.z0 + 3; z < R.z1; z += 4.4) line3(ctx, cam, [[R.x0, .01, z], [R.x1, .01, z]], true);
    ctx.stroke();
    for (const [x, z, h] of GRAVEL) { const c = cs(cam, x, .02, z); if (c[2] < NEAR) continue; const s = toScr(cam, c), q = clamp(cam.f / c[2] * .03, .6, 2.6); ctx.fillStyle = h < .5 ? 'rgba(170,180,220,.08)' : 'rgba(0,0,0,.3)'; ctx.fillRect(s[0], s[1], q, q); }
    // last night's puddle: it mirrors the sky's glow
    const pc = cs(cam, 3.6, .02, 4.2);
    if (pc[2] > NEAR) { const s = toScr(cam, pc), q = cam.f / pc[2]; ctx.save(); ctx.translate(s[0], s[1]); ctx.scale(q * 2.4, q * 2.4 * Math.max(.08, Math.abs(Math.sin(Math.atan2(cam.y, Math.hypot(3.6 - cam.x, 4.2 - cam.z)))))); const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); pg.addColorStop(0, css(tri(['#3a3d6a', '#d59a9c', '#ffd8b0'], L), .5)); pg.addColorStop(.6, css(tri(['#2a2c54', '#8a6a86', '#c8a49c'], L), .2)); pg.addColorStop(1, 'rgba(160,170,210,0)'); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, 1, 0, 7); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }
  // props on the deck: the roof hatch, a vent with its cap, the tank on stilts, an antenna
  const prop = tri(['#16142a', '#2e2640', '#54404e'], L), rim = tri(['#4a5677', '#d8a8a0', '#ffe2b8'], L);
  boxP(ctx, cam, 2.2, 5.2, 13.2, 15.4, 0, .95, prop, rim, L);
  boxP(ctx, cam, 8.3, 8.75, 6.3, 6.75, 0, 1.6, prop, rim, L); boxP(ctx, cam, 8.15, 8.9, 6.15, 6.9, 1.6, 1.75, prop, rim, L);
  tank(ctx, cam, -5.2, 0, 15.6, prop, L, rim, .5);
  ctx.strokeStyle = css(prop); ctx.lineWidth = Math.max(.6, cam.f / Math.max(1, cs(cam, 10.6, 3, 17.5)[2]) * .06); line3(ctx, cam, [[10.6, 0, 17.5], [10.6, 7.5, 17.5]]); ctx.stroke();
  // the parapet: four walls (inner faces toward the deck), the coping on top
  parapet(ctx, t, cam, S);
}
function boxP(ctx, cam, x0, x1, z0, z1, y0, y1, col, rim, L) {
  for (const F of FACES) {
    const B = { x0, x1, z0, z1 }, [[ax, az], [bx, bz]] = F.c(B), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    if ((cam.x - mx) * F.n[0] + (cam.z - mz) * F.n[1] <= 0) continue;
    if (path3(ctx, cam, [[ax, y1, az], [bx, y1, bz], [bx, y0, bz], [ax, y0, az]])) { ctx.fillStyle = css(mix3(col, [0, 0, 0], F.n[0] ? .15 : 0)); ctx.fill(); }
  }
  if (cam.y > y1 && path3(ctx, cam, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])) { ctx.fillStyle = css(mix3(col, rim, .25)); ctx.fill(); }
  ctx.strokeStyle = css(rim, .45); ctx.lineWidth = 1; line3(ctx, cam, [[x0, y1, z0], [x1, y1, z0]]); ctx.stroke();
}
// the parapet (1.04: concrete blocks, joints, a lit coping with a thin dark lip)
export function parapet(ctx, t, cam, S) {
  const L = S.L, R = ROOFB, cop = G.coping, par = tri(['#1e1a30', '#3a2e48', '#6a4e5a'], L), top = tri(['#8a7a8a', '#d2a8a4', '#ffd8b8'], L);
  const walls = [
    { a: [R.x0, R.z0], b: [R.x1, R.z0], n: [0, 1] }, { a: [R.x1 - R.t, R.z0], b: [R.x1 - R.t, R.z1], n: [-1, 0] },
    { a: [R.x0 + R.t, R.z1], b: [R.x0 + R.t, R.z0], n: [1, 0] }, { a: [R.x1, R.z1 - R.t], b: [R.x0, R.z1 - R.t], n: [0, -1] },
  ];
  // the walls' outer faces when seen from outside (the high camera), inner faces from the deck
  for (const w of walls) {
    const off = w.n, ia = [w.a[0] + off[0] * R.t, w.a[1] + off[1] * R.t], ib = [w.b[0] + off[0] * R.t, w.b[1] + off[1] * R.t];
    const mx = (ia[0] + ib[0]) / 2, mz = (ia[1] + ib[1]) / 2;
    if ((cam.x - mx) * off[0] + (cam.z - mz) * off[1] > 0) {   // inner face visible
      if (path3(ctx, cam, [[ia[0], cop - .1, ia[1]], [ib[0], cop - .1, ib[1]], [ib[0], 0, ib[1]], [ia[0], 0, ia[1]]])) {
        const p = proj(cam, [[mx, cop, mz], [mx, 0, mz]]);
        if (p.length === 2) { const g = ctx.createLinearGradient(0, p[0][1], 0, p[1][1]); g.addColorStop(0, css(mix3(par, [255, 255, 255], .03))); g.addColorStop(1, css(mix3(par, [0, 0, 0], .3))); ctx.fillStyle = g; } else ctx.fillStyle = css(par);
        ctx.fill();
        // block joints and a horizontal joint
        ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.beginPath();
        const len = Math.hypot(ib[0] - ia[0], ib[1] - ia[1]), n = Math.round(len / 1.75);
        for (let i = 1; i < n; i++) { const u = i / n + (hash(i * 3.7) - .5) * .01; line3(ctx, cam, [[mix(ia[0], ib[0], u), cop - .12, mix(ia[1], ib[1], u)], [mix(ia[0], ib[0], u), 0, mix(ia[1], ib[1], u)]], true); }
        line3(ctx, cam, [[ia[0], .55, ia[1]], [ib[0], .55, ib[1]]], true); ctx.stroke();
      }
    }
  }
  // the coping: top surface (lit), its front lip, the light running along its edge
  for (const w of walls) {
    const o = .04, q = [[w.a[0] - w.n[0] * o, cop, w.a[1] - w.n[1] * o], [w.b[0] - w.n[0] * o, cop, w.b[1] - w.n[1] * o], [w.b[0] + w.n[0] * (R.t + o), cop, w.b[1] + w.n[1] * (R.t + o)], [w.a[0] + w.n[0] * (R.t + o), cop, w.a[1] + w.n[1] * (R.t + o)]];
    if (cam.y > cop && path3(ctx, cam, q)) { ctx.fillStyle = css(top); ctx.fill(); }
    const lip = [[w.a[0] + w.n[0] * (R.t + o), cop, w.a[1] + w.n[1] * (R.t + o)], [w.b[0] + w.n[0] * (R.t + o), cop, w.b[1] + w.n[1] * (R.t + o)]];
    if (path3(ctx, cam, [lip[0], lip[1], [lip[1][0], cop - .12, lip[1][2]], [lip[0][0], cop - .12, lip[0][2]]])) { ctx.fillStyle = css(mix3(top, [0, 0, 0], .45)); ctx.fill(); }
    ctx.strokeStyle = css(mix3(top, [255, 240, 220], .4), .55 + .25 * clamp(L - .5)); ctx.lineWidth = 1.4; line3(ctx, cam, [q[0], q[1]]); ctx.stroke();
  }
}
// "here": the rim's ground, the district and your tower, back to front; you(ctx) is drawn right after your tower
export function drawHere(ctx, t, cam, S, you, onRoof) {
  if (cam.y > G.rimY) rimGround(ctx, cam, S);
  const list = NEAR_B.map((B) => ({ B, d: cs(cam, (B.x0 + B.x1) / 2, B.y0 + B.h / 2, (B.z0 + B.z1) / 2)[2] })).filter((e) => e.d > NEAR);
  list.push({ B: null, d: Math.max(NEAR * 2, cs(cam, (ROOFB.x0 + ROOFB.x1) / 2, -10, (ROOFB.z0 + ROOFB.z1) / 2)[2]) });
  list.sort((a, b) => b.d - a.d);
  for (const { B } of list) { if (B) block(ctx, t, cam, B, S); else { drawRoof(ctx, t, cam, S); if (onRoof) onRoof(ctx); if (you) you(ctx); } }
}
export { rimGround };
