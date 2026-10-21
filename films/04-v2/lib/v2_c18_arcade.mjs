// c18 · arcades in perspective: the aqueduct of 3.02 (blue stone, tall lower arches, three small upper arches per bay, dark cornices
// with a light lip, voussoir ticks, the lit channel on top, amber lights flowing along it), the network the burin draws on in 18.05 and
// the bridge across the gap (three tiers over the deep valley, like the Pont du Gard). One builder for all of them.
//   arcade(path, o) → A        path [[x, z], …]; o { top, ground(x, z), bay, pier, width, upper, small, midY }
//   arcadeItems(t, cam, A, o)  painter items: near bays one by one, far runs as engraved ribbons. o { L, lit 0..1 (amber channel),
//                              s0 / s1 (the stretch that exists), drop(b) → 0..1 (the stone unrolls down from the engraved line),
//                              broken (s of a ragged broken end), fogMul, lipGlow }
//   flowLights(cam, A, o) → [[x, y, r, depth]]   the share lights flowing along the channel
import { W, H, clamp, mix, rgba } from '../engine.mjs';
import { cs, toScr, NEAR, path3, line3, proj, css, mix3, hash } from './v2_c18_kit.mjs';
import { fogK, tri } from './v2_c18_land.mjs';

export function arcade(path, o) {
  const cum = [0]; for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
  const len = cum[cum.length - 1];
  const at = (s) => { s = clamp(s, 0, len); let lo = 0, hi = cum.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < s) lo = m; else hi = m; } const a = path[lo], b = path[hi], q = (s - cum[lo]) / ((cum[hi] - cum[lo]) || 1), dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1; return [mix(a[0], b[0], q), mix(a[1], b[1], q), dx / l, dz / l]; };
  const n = Math.max(1, Math.round(len / o.bay)), bl = len / n, pw = o.pier ?? bl * .2, wd = o.width ?? 5, top = o.top, up = o.upper ?? bl * .32;
  const bays = [];
  for (let i = 0; i < n; i++) {
    const s0 = i * bl, s1 = s0 + bl, sm = (s0 + s1) / 2, [mx, mz] = at(sm);
    const g = Math.min(o.ground(mx, mz), o.ground(...at(s0 + 1).slice(0, 2)), o.ground(...at(s1 - 1).slice(0, 2)));
    bays.push({ i, s0, s1, sm, gy: Math.min(g, top - up - 4), mx, mz });
  }
  return { len, at, bays, bl, pw, wd, top, up, small: o.small ?? 3, midY: o.midY ?? null, path };
}
const side3 = (A, s, sd, y) => { const [x, z, dx, dz] = A.at(s), nx = -dz, nz = dx; return [x + nx * sd * A.wd / 2, y, z + nz * sd * A.wd / 2]; };
const archPts = (A, sd, o0, o1, foot, crown, n = 12) => { const r = (o1 - o0) / 2, ys = crown - r, h = [side3(A, o0, sd, foot)]; for (let k = 0; k <= n; k++) { const an = Math.PI - k / n * Math.PI; h.push(side3(A, (o0 + o1) / 2 + Math.cos(an) * r, sd, ys + Math.sin(an) * r)); } h.push(side3(A, o1, sd, foot)); return { pts: h, o0, o1, r, ys, foot }; };
// one bay's face (side sd): the solid outline and its openings (lower tier, the middle tier over deep ground, the small upper arches)
function bayFace(A, b, sd) {
  const { pw, top, up } = A, s0 = b.s0, s1 = b.s1, gy = b.gy, yc = top - up, o0 = s0 + pw / 2, o1 = s1 - pw / 2;
  const outer = [side3(A, s0, sd, top), side3(A, s1, sd, top), side3(A, s1, sd, gy - 4), side3(A, s0, sd, gy - 4)];
  const holes = [], three = A.midY != null && gy < A.midY - 14;
  if (three) {
    holes.push({ ...archPts(A, sd, o0 + 1, o1 - 1, gy - 4, A.midY - 1.6), tier: 0 });
    holes.push({ ...archPts(A, sd, o0, o1, A.midY + .7, yc - 1.6), tier: 1 });
  } else if (yc - 2 - (o1 - o0) / 2 > gy + 1) holes.push({ ...archPts(A, sd, o0, o1, gy - 4, yc - 2), tier: 0 });
  const n = A.small, sw = (s1 - s0) / n;
  for (let j = 0; j < n; j++) { const u0 = s0 + j * sw + sw * .2, u1 = s0 + (j + 1) * sw - sw * .2; if (top - 1.4 - (u1 - u0) / 2 > yc + .6) holes.push({ ...archPts(A, sd, u0, u1, yc + .6, top - 1.4, 8), tier: 2 }); }
  return { outer, holes, three };
}
const faceSide = (A, cam, s) => { const [x, z, dx, dz] = A.at(s); return (cam.x - x) * -dz + (cam.z - z) * dx > 0 ? 1 : -1; };
export const STONE = ['#272b5a', '#544a74', '#9a7c8e'], STONE_L = ['#3b4178', '#76648c', '#c8a098'], STONE_TOP = ['#4b5188', '#b08a9c', '#f0c8a8'], STONE_D = ['#15183a', '#2a274c', '#4e3e58'];
// convex hull of screen points (monotone chain) → a clip path
function hull(P) {
  P = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (P.length < 3) return P;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function clipBox(ctx, cam, A, s0, s1, y0, y1) {
  const P = []; for (const s of [s0, s1]) for (const sd of [-1.4, 1.4]) for (const y of [y0, y1]) { const c = cs(cam, ...side3(A, s, sd, y)); if (c[2] < NEAR) return false; P.push(toScr(cam, c)); }
  const Hh = hull(P); ctx.beginPath(); Hh.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.clip(); return true;
}
// draw bay b of arcade A
export function drawBay(ctx, t, cam, A, b, o) {
  const L = o.L, sd = faceSide(A, cam, b.sm), c = cs(cam, ...side3(A, b.sm, sd, (A.top + b.gy) / 2)); if (c[2] < NEAR) return;
  const d = Math.hypot(c[0], c[2]), k = clamp(fogK(d, L) * (o.fogMul ?? 1)), hz = o.hz, px = cam.f / c[2] * (b.s1 - b.s0);
  if (px < .6) return;
  const drop = o.drop ? clamp(o.drop(b)) : 1; if (drop <= 0) return;
  const st = mix3(tri(STONE, L), hz, k), stL = mix3(tri(STONE_L, L), hz, k), stT = mix3(tri(STONE_TOP, L), hz, k), dark = mix3(tri(STONE_D, L), hz, k * .9);
  const F = bayFace(A, b, sd), yCut = mix(A.top, b.gy - 4, drop);
  ctx.save();
  if (drop < 1 && !clipBox(ctx, cam, A, b.s0 - .02, b.s1 + .02, A.top + .8, yCut)) { ctx.restore(); return; }
  if (o.brk != null && o.brk > b.s0 && o.brk < b.s1) {   // a ragged broken end (3.02): the stone stops along a jagged edge, loose blocks
    // the far side reaches toward smaller s: keep [brk, s1]; the top courses reach furthest, the lower ones broke back further
    const P = [side3(A, b.s1 + .1, sd, A.top + 1), side3(A, b.s1 + .1, sd, b.gy - 5)];
    for (let k2 = 0; k2 <= 22; k2++) { const u = k2 / 22, y = mix(b.gy - 5, A.top + 1, u), ss = o.brk + (b.s1 - o.brk) * ((1 - u) * .85 + .25 * hash(k2 * 3.1 + b.i) * (k2 % 3 === 0 ? 1 : .4)); P.push(side3(A, ss, sd, y)); }
    if (!path3(ctx, cam, P)) { ctx.restore(); return; } ctx.clip();
  }
  // the inner faces seen through the openings (jambs and soffits): the band between the front and the back outline
  if (px > 5) {
    ctx.fillStyle = css(dark);
    for (const h of F.holes) {
      const back = h.pts.map((p, i) => { const n = h.pts.length - 3, s = i === 0 ? h.o0 : i === h.pts.length - 1 ? h.o1 : (h.o0 + h.o1) / 2 + Math.cos(Math.PI - (i - 1) / n * Math.PI) * h.r; return side3(A, s, -sd, p[1]); });
      ctx.beginPath(); path3(ctx, cam, h.pts.concat(back.slice().reverse()), true); ctx.fill('evenodd');
    }
  }
  // the face with its openings
  ctx.beginPath(); path3(ctx, cam, F.outer, true); for (const h of F.holes) if (px > 3 || h.tier < 2) path3(ctx, cam, h.pts.slice().reverse(), true);
  const sy = proj(cam, [side3(A, b.sm, sd, A.top), side3(A, b.sm, sd, b.gy)]);
  if (sy.length === 2 && Math.abs(sy[1][1] - sy[0][1]) > 1) { const g = ctx.createLinearGradient(0, sy[0][1], 0, sy[1][1]); g.addColorStop(0, css(stT)); g.addColorStop(.06, css(stL)); g.addColorStop(.4, css(st)); g.addColorStop(1, css(mix3(st, hz, .45))); ctx.fillStyle = g; } else ctx.fillStyle = css(st);
  ctx.fill('evenodd');
  if (px > 14) {   // engraved detail: stone courses, cornices, voussoir ticks
    const det = clamp((px - 14) / 40) * (1 - k);
    ctx.save(); ctx.beginPath(); path3(ctx, cam, F.outer, true); for (const h of F.holes) path3(ctx, cam, h.pts.slice().reverse(), true); ctx.clip('evenodd');
    ctx.strokeStyle = css(mix3(st, [5, 6, 20], .7), .34 * det); ctx.lineWidth = .8; ctx.beginPath();
    const step = px > 120 ? 1.1 : px > 50 ? 1.6 : 2.6;
    for (let y = A.top - 1; y > b.gy - 4; y -= step) line3(ctx, cam, [side3(A, b.s0, sd, y), side3(A, b.s1, sd, y)], true);
    if (px > 60) for (let y = A.top - 1, r = 0; y > b.gy - 4; y -= step, r++) for (let s = b.s0 + (r % 2) * 1.3; s < b.s1; s += 2.6) line3(ctx, cam, [side3(A, s, sd, y), side3(A, s, sd, y - step)], true);
    ctx.stroke(); ctx.restore();
    const corn = [A.top - 1.6, A.top - A.up]; if (F.three) corn.push(A.midY);
    ctx.strokeStyle = css(mix3(st, [5, 6, 20], .8), .85); ctx.lineWidth = Math.min(3, px / 40); ctx.beginPath(); for (const y of corn) line3(ctx, cam, [side3(A, b.s0, sd, y), side3(A, b.s1, sd, y)], true); ctx.stroke();
    ctx.strokeStyle = css(mix3(stL, [200, 205, 240], .3), .4); ctx.lineWidth = 1.2; ctx.beginPath(); for (const y of corn) line3(ctx, cam, [side3(A, b.s0, sd, y + .3), side3(A, b.s1, sd, y + .3)], true); ctx.stroke();
    ctx.strokeStyle = css(mix3(st, [5, 6, 20], .7), .7 * det); ctx.lineWidth = .9; ctx.beginPath();
    for (const h of F.holes) { if (h.tier === 2) continue; const m = (h.o0 + h.o1) / 2; for (let v = 0; v <= 11; v++) { const an = Math.PI - v / 11 * Math.PI; line3(ctx, cam, [side3(A, m + Math.cos(an) * h.r, sd, h.ys + Math.sin(an) * h.r), side3(A, m + Math.cos(an) * (h.r + 1.4), sd, h.ys + Math.sin(an) * (h.r + 1.4))], true); } }
    ctx.stroke();
  }
  // the channel lip on top: light stone; the amber line where the light flows
  const lip = [side3(A, b.s0, sd, A.top), side3(A, b.s1, sd, A.top)], lipB = [side3(A, b.s0, -sd, A.top), side3(A, b.s1, -sd, A.top)];
  if (path3(ctx, cam, [lip[0], lip[1], lipB[1], lipB[0]])) { ctx.fillStyle = css(mix3(stT, [230, 230, 250], .25)); ctx.fill(); }
  ctx.strokeStyle = css(mix3(stT, [255, 255, 255], .3), .7); ctx.lineWidth = Math.max(.6, Math.min(2, px / 30)); line3(ctx, cam, lip); ctx.stroke();
  if (o.lit > 0) { ctx.strokeStyle = rgba('#ffb35c', .6 * o.lit); ctx.lineWidth = Math.max(.8, Math.min(3, px / 20)); line3(ctx, cam, [side3(A, b.s0, 0, A.top + .15), side3(A, b.s1, 0, A.top + .15)]); ctx.stroke(); }
  ctx.restore();
}
// a far run of bays as one engraved ribbon: the face band (unrolled to drop), pier ticks, the lit lip, the amber channel
function ribbon(ctx, t, cam, A, bs, o) {
  const L = o.L, m = bs[bs.length >> 1], c = cs(cam, m.mx, A.top, m.mz); if (c[2] < NEAR) return;
  const k = clamp(fogK(Math.hypot(c[0], c[2]), L) * (o.fogMul ?? 1)), hz = o.hz, sd = faceSide(A, cam, m.sm);
  const st = mix3(tri(STONE, L), hz, k), stT = mix3(tri(STONE_TOP, L), hz, k);
  const topP = [], botP = [];
  for (const b of bs) { const dr = o.drop ? clamp(o.drop(b)) : 1; if (dr <= 0) continue; topP.push(side3(A, b.s0, sd, A.top), side3(A, b.s1, sd, A.top)); botP.push(side3(A, b.s0, sd, mix(A.top, b.gy, dr)), side3(A, b.s1, sd, mix(A.top, b.gy, dr))); }
  if (topP.length < 2) return;
  if (path3(ctx, cam, topP.concat(botP.slice().reverse()))) { ctx.fillStyle = css(mix3(st, hz, .15)); ctx.fill(); }
  const pxb = cam.f / c[2] * A.bl;
  if (pxb > 1.2) { ctx.strokeStyle = css(mix3(st, [5, 6, 20], .6), .5 * (1 - k)); ctx.lineWidth = .7; ctx.beginPath(); for (let i = 0; i < topP.length; i += 2) line3(ctx, cam, [topP[i], mix3(topP[i], botP[i], .85)], true); ctx.stroke(); }
  ctx.strokeStyle = css(mix3(stT, [255, 250, 240], .3), .75 * (1 - k * .6)); ctx.lineWidth = 1; line3(ctx, cam, topP); ctx.stroke();
  if (o.lit > 0) { ctx.strokeStyle = rgba('#ffb35c', .55 * o.lit * (1 - k * .5)); ctx.lineWidth = 1.1; line3(ctx, cam, bs.map((b) => side3(A, b.s0, 0, A.top + .2)).concat([side3(A, bs[bs.length - 1].s1, 0, A.top + .2)])); ctx.stroke(); }
}
// painter items for an arcade: { d (depth), draw(ctx) }
export function arcadeItems(t, cam, A, o) {
  const out = [], s0 = o.s0 ?? 0, s1 = o.s1 ?? A.len; let run = [];
  const flush = () => { if (!run.length) return; const bs = run; run = []; const m = bs[bs.length >> 1]; out.push({ d: cs(cam, m.mx, A.top, m.mz)[2], draw: (ctx) => ribbon(ctx, t, cam, A, bs, o) }); };
  for (const b of A.bays) {
    if (b.s1 <= s0 + .01 || b.s0 >= s1 - .01) { flush(); continue; }
    const c = cs(cam, b.mx, (A.top + b.gy) / 2, b.mz);
    if (c[2] < -A.bl) { flush(); continue; }
    const px = cam.f / Math.max(NEAR, Math.hypot(c[0], c[2])) * A.bl;
    const sx = c[2] > NEAR ? toScr(cam, c)[0] : W / 2, off = sx < -px * 2 - 200 || sx > W + px * 2 + 200;
    if (off && c[2] > NEAR) { flush(); continue; }
    if (px < 3 && c[2] > NEAR) { run.push(b); if (run.length >= 24) flush(); continue; }
    flush();
    out.push({ d: Math.max(NEAR, c[2]), draw: (ctx) => drawBay(ctx, t, cam, A, b, { ...o, brk: o.broken != null && o.broken > b.s0 && o.broken < b.s1 ? o.broken : null }) });
  }
  flush();
  return out;
}
// the share lights flowing along the channel toward the end (dir +1) or the start (−1), within [s0, s1]
export function flowLights(cam, A, o) {
  const v = o.v ?? 60, P = o.gap ?? 70, n = Math.ceil(A.len / P) + 1, out = [], s0 = o.s0 ?? 0, s1 = o.s1 ?? A.len;
  for (let i = 0; i < n; i++) {
    let s = (i * P + o.t * v) % (n * P);
    if (o.dir < 0) s = A.len - s;
    if (s < s0 || s > s1) continue;
    const [x, z] = A.at(s), c = cs(cam, x, A.top + .9, z); if (c[2] < NEAR) continue;
    const p = toScr(cam, c); if (p[0] < -40 || p[0] > W + 40 || p[1] < -40 || p[1] > H + 40) continue;
    out.push([p[0], p[1], clamp(cam.f / c[2] * 1.1, .7, o.rmax ?? 14), c[2], s]);
  }
  return out;
}
export { side3 };
