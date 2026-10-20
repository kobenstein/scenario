// c18 · the light's infrastructure: the aqueduct of 3.02 that carries the amber share lights out of the sunrise into district A (only),
// the castellum where it ends, the network the burin draws on in 18.05 (branches to every town and district up to the horizon), the towns.
import { W, H, clamp, mix, rgba, prng, canvas } from '../engine.mjs';
import { stipple } from './art.mjs';
import { shareLight } from './share.mjs';
import { cs, toScr, NEAR, path3, line3, proj, mixRGB, css, mix3, hash, once } from './v2_c18_kit.mjs';
import { G, plainY, farEdge, fogK, hazeRGB, tri, arcade, drawBay, flowLights } from './v2_c18_land.mjs';
import { DIST } from './v2_c18_city.mjs';

// a smooth path through control points (Catmull-Rom, sampled every ~step m)
export function smoothPath(P, step = 20) {
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)], n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let k = 0; k < n; k++) { const u = k / n, u2 = u * u, u3 = u2 * u; out.push([0, 1].map((j) => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3))); }
  }
  out.push(P[P.length - 1].slice()); return out;
}
// ---------------------------------------------------------------- the aqueduct (3.02) into district A
export const CASTELLUM = [-58, -618];
const AQ_PATH = smoothPath([[3600, -9600], [2700, -6200], [1700, -3300], [880, -1700], [330, -960], [40, -700], CASTELLUM], 24);
export const AQ = arcade(AQ_PATH, { top: -2, ground: (x, z) => plainY(x, z), bay: 30, pier: 6, width: 6, upper: 9.5, small: 3 });
// the aqueduct's bays as sortable items (far → near is done by the caller), each with its depth key z
export function aqueductItems(t, cam, S) {
  const hz = hazeRGB(S.L), items = [];
  for (const b of AQ.bays) { const [x, z] = AQ.at(b.sm); items.push({ z, x, kind: 'aq', draw: (ctx) => drawBay(ctx, t, cam, AQ, b, { L: S.L, hz, lit: S.aqLit ?? 1 }) }); }
  // the castellum: a round water tower where the aqueduct ends, its lantern lit
  items.push({ z: CASTELLUM[1], x: CASTELLUM[0], kind: 'castellum', draw: (ctx) => castellum(ctx, t, cam, S) });
  return items;
}
function castellum(ctx, t, cam, S) {
  const [x, z] = CASTELLUM, y0 = plainY(x, z) - 1, y1 = AQ.top + 4, r = 7, L = S.L, hz = hazeRGB(L), c = cs(cam, x, (y0 + y1) / 2, z); if (c[2] < NEAR) return;
  const k = fogK(Math.hypot(c[0], c[2]), L), col = mix3(tri(['#2c3060', '#5a4e78', '#9a7c8e'], L), hz, k), n = 16;
  const ring = (yy, rr) => Array.from({ length: n }, (_, i) => [x + Math.cos(i / n * Math.PI * 2) * rr, yy, z + Math.sin(i / n * Math.PI * 2) * rr]);
  const lo = ring(y0, r), hi = ring(y1, r);
  for (let i = 0; i < n; i++) { const j = (i + 1) % n, mx = (lo[i][0] + lo[j][0]) / 2, mz = (lo[i][2] + lo[j][2]) / 2; if ((cam.x - mx) * (mx - x) + (cam.z - mz) * (mz - z) <= 0) continue; if (path3(ctx, cam, [hi[i], hi[j], lo[j], lo[i]])) { const sh = clamp(.5 + .5 * ((mx - x) / r)); ctx.fillStyle = css(mix3(col, [5, 6, 22], .35 * sh)); ctx.fill(); } }
  const cap = ring(y1, r + .8); if (path3(ctx, cam, cap)) { ctx.fillStyle = css(mix3(col, [255, 220, 200], .15)); ctx.fill(); }
  ctx.beginPath(); for (let i = 0; i < n; i++) { const j = (i + 1) % n; path3(ctx, cam, [cap[i], cap[j], [x, y1 + 6, z]], true); } ctx.fillStyle = css(mix3(col, [0, 0, 0], .2)); ctx.fill();
  // the light inside: a warm opening facing us
  const p = cs(cam, x, y1 - 4, z + r + .3); if (p[2] > NEAR) { const s = toScr(cam, p), q = cam.f / p[2]; shareLight(ctx, s[0], s[1], clamp(q * 1.2, 1, 10), t, { pulse: .5 }); }
}
// the lights flowing along the aqueduct toward the castellum (screen list, far → near)
export function aqueductLights(ctx, t, cam, S) {
  if ((S.aqLit ?? 1) <= 0) return;
  const L = flowLights(ctx, t, cam, AQ, { v: 55, gap: 110, dir: 1, rmax: 9 }).sort((a, b) => b[3] - a[3]);
  for (const [x, y, r] of L) shareLight(ctx, x, y, r, t, { pulse: .4, a: S.aqLit ?? 1 });
}
export { DIST };
