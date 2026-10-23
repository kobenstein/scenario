// Film 8 · c03 (B1, local): the pieces of the voyage that only c03 needs. Sky things are directions (s8_sky skyDir), world things metres.
//   bigStar(ctx, t, C, dir, o)          one named bright star (core, halo, four short spikes); o: { a 1, size 2.6, col '#f3efe2', seed }
//   crux(dir0, rot) → [dir × 5]         the Southern Cross round a centre direction [az, el], turned by rot (rad)
//   wake(ctx, t, C, K, o)               the lit wake behind Hōkūleʻa: a cool solid line from o.from (m along the heading, 0 = the canoe's centre)
//                                       back to o.len, plus two foam lines off the sterns; o.k0 (px/m at which widths equal the card line's), o.a
//   course(ctx, t, C, K, o)             the amber dotted course ahead (the card line's right half in the world): dots every o.step m from o.from
//                                       to o.len along the heading; o.k0, o.a
//   routeAhead(ctx, t, C, K, u, o)      a dotted route that draws itself from the bow to the horizon (Maui → Tahiti), u 0..1
//   maui(ctx, t, C, o)                  Honolua Bay at dusk: three black-green ridge layers on the horizon round o.az (sky directions), a dark
//                                       shore with torches at world points; o: { az, w, torches: [[X, Z], …], dusk } → { glints } for drawSea
//   atoll(ctx, t, C, o)                 Satawal: a ring of land with palms in an endless sea, one fire; o: { x, z, R 70, fire 1 } → { fire }
//   swellGlow(ctx, t, C, K, o)          the swell crests under the hulls light amber (c03.10 "the waves"); o: { u 0..1, az (where the swell runs) }
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projRuns, projPoly, fillPoly, mixHex, hash, nz, eoX } from './s8_kit.mjs';
import { skyDir } from './s8_sky.mjs';
import { waterY } from './s8_sea.mjs';
import { flames } from './s8_canoe.mjs';

const stroke = (ctx, run, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); };

// ---------------------------------------------------------------- named stars
export function bigStar(ctx, t, C, dir, o = {}) {
  const p = C.D(dir[0], dir[1], dir[2]); if (!p) return null;
  if (p[0] < -60 || p[0] > 1980 || p[1] < -60 || p[1] > 1140) return p;
  const a = clamp(o.a ?? 1), s = (o.size ?? 2.6) * Math.sqrt(C.F / 1400), tw = .85 + .15 * Math.sin(t * 3.1 + (o.seed || 0)), col = o.col || '#f3efe2';
  if (a <= 0) return p;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], s * 10); g.addColorStop(0, rgba('#fff6e8', .45 * a * tw)); g.addColorStop(.25, rgba(col, .12 * a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(p[0] - s * 10, p[1] - s * 10, s * 20, s * 20);
  ctx.strokeStyle = rgba('#fff6e8', .45 * a * tw); ctx.lineWidth = Math.max(.7, s * .35); ctx.lineCap = 'round'; const L = s * 6 * (.8 + .2 * tw);
  ctx.beginPath(); ctx.moveTo(p[0] - L, p[1]); ctx.lineTo(p[0] + L, p[1]); ctx.moveTo(p[0], p[1] - L); ctx.lineTo(p[0], p[1] + L); ctx.stroke();
  ctx.fillStyle = rgba('#ffffff', Math.min(1, a * 1.1)); ctx.beginPath(); ctx.arc(p[0], p[1], s, 0, TAU); ctx.fill();
  ctx.restore();
  return p;
}
const CRUX = [[0, .105, 2.4], [.008, 0, 2.6], [-.058, .052, 2.2], [.052, .066, 1.8], [.02, .036, 1.2]];   // Gacrux, Acrux, Mimosa, δ, ε (rad, size)
export function crux(c, rot = 0) {
  const cr = Math.cos(rot), sr = Math.sin(rot);
  return CRUX.map(([dx, dy, s]) => { const x = dx * cr - (dy - .05) * sr, y = dx * sr + (dy - .05) * cr; return { dir: skyDir(c[0] + x / Math.max(.2, Math.cos(c[1])), c[1] + y), size: s }; });
}

// ---------------------------------------------------------------- the wake and the course (c03.04: the card line becomes them)
const along = (K, s, side = 0, y = .03) => [K.x + Math.sin(K.head) * s + Math.cos(K.head) * side, y, K.z + Math.cos(K.head) * s - Math.sin(K.head) * side];
export function wake(ctx, t, C, K, o = {}) {
  const a = o.a ?? 1, k0 = o.k0 ?? 6, from = o.from ?? -9.5, len = o.len ?? 1400; if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  // the solid cool line, in chunks so its width follows the depth
  const N = 60;
  for (let i = 0; i < N; i++) {
    const span = from + len, e0 = i / N, e1 = (i + 1) / N, s0 = from - span * e0 * e0, s1 = from - span * e1 * e1;   // denser near the canoe
    const p = C.P(...along(K, s0)), q = C.P(...along(K, s1)); if (!p || !q) continue;
    const m = clamp(((p[2] + q[2]) / 2) / k0, .12, 1.6);
    for (const [w, al, c] of [[22, .06, '#8fe6ff'], [7, .2, '#8fe6ff'], [2, .95, '#eefcff']]) { ctx.strokeStyle = rgba(c, al * a); ctx.lineWidth = Math.max(.8, w * m); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
  }
  // foam: two broken lines spreading from the sterns, churned
  const fa = o.foam ?? a;
  if (fa > 0) for (const sd of [-1, 1]) {
    const pts = []; for (let i = 0; i <= 40; i++) { const s = -9.5 - i * 1.6, spread = sd * (1.35 + i * .32); pts.push(along(K, s, spread + .15 * Math.sin(i * 1.7 + t * 2), .04)); }
    for (const run of projRuns(C, pts, .3)) { ctx.setLineDash([6, 9]); ctx.lineDashOffset = -t * 30; stroke(ctx, run, rgba('#d8e4f8', .35 * fa), clamp(run[0][2] * .12, 1, 3.5)); ctx.setLineDash([]); }
  }
  ctx.restore();
}
export function course(ctx, t, C, K, o = {}) {
  const a = o.a ?? 1, k0 = o.k0 ?? 6, step = o.step ?? 22 / k0, from = o.from ?? 0, len = o.len ?? 600; if (a <= 0) return;
  const br = .85 + .15 * Math.sin(t * 2.3);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let s = from; s < len; s += step) {
    const p = C.P(...along(K, s)); if (!p) continue; if (p[0] < -30 || p[0] > 1950 || p[1] < -30 || p[1] > 1110) continue;
    const r = 10 * clamp(p[2] / k0, .1, 4);
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); g.addColorStop(0, rgba('#fff1d6', .95 * br * a)); g.addColorStop(.35, rgba('#ffb35c', .5 * br * a)); g.addColorStop(1, rgba('#ffb35c', 0));
    ctx.fillStyle = g; ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r);
  }
  ctx.restore();
}
export function routeAhead(ctx, t, C, K, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const n = 90;
  for (let i = 0; i < n; i++) {
    const v = i / n; if (v > u) break;
    const d = 14 * Math.pow(1.085, i), sw = 3 * Math.sin(d * .004 + .5) * Math.min(1, d / 60);
    const p = C.P(...along(K, 9.5 + d, sw, .05), .5); if (!p || p[1] < C.hy) continue;
    const r = Math.max(.8, p[2] * .16), al = .85 * clamp((u - v) * 10) * (1 - .4 * v);
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 3); g.addColorStop(0, rgba('#fff1d6', al)); g.addColorStop(.3, rgba('#ffb35c', al * .5)); g.addColorStop(1, rgba('#ffb35c', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(p[0], p[1], r * 3, r * 1.4, 0, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- Maui at dusk: ridges on the horizon, a dark shore, torches
const RIDGES = [
  { w: 1.0, h: .06, seed: 3, col: '#0f1a1c', rim: '#4a3a5a' },     // far (West Maui mountains, hazy violet rim)
  { w: .8, h: .045, seed: 7, col: '#0b1512', rim: '#2a2a3a' },
  { w: .62, h: .028, seed: 11, col: '#070d0a', rim: '#1a1a22' },   // near headlands of the bay
];
export function maui(ctx, t, C, o = {}) {
  const az = o.az ?? 0, W = o.w ?? .5, dusk = o.dusk ?? .5, out = { glints: [] };
  RIDGES.forEach((R, li) => {
    const n = 70, top = [];
    for (let i = 0; i <= n; i++) {
      const v = i / n, x = -1 + 2 * v, env = Math.pow(Math.max(0, 1 - x * x), .5);
      const e = R.h * env * (.55 + .45 * Math.abs(nz(x * 3.1 + R.seed, R.seed))) + .006 * nz(x * 23 + R.seed, R.seed + 1) * env + (li === 2 ? .01 * Math.exp(-((x + .55) ** 2) / .02) : 0);
      top.push(C.D(...skyDir(az + x * W * R.w, Math.max(.0015, e))));
    }
    const bl = C.D(...skyDir(az + W * R.w, -.002)), br = C.D(...skyDir(az - W * R.w, -.002));
    if (top.some((p) => !p) || !bl || !br) return;
    ctx.save(); ctx.beginPath(); top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.lineTo(bl[0], bl[1]); ctx.lineTo(br[0], br[1]); ctx.closePath();
    ctx.fillStyle = R.col; ctx.fill();
    ctx.clip();   // a faint valley texture: engraved strokes down the slopes, lighter toward the dusk
    ctx.strokeStyle = rgba('#3a5048', .16); ctx.lineWidth = 1;
    for (let i = 2; i < n - 1; i += 2) { const p = top[i]; if (!p) continue; ctx.beginPath(); ctx.moveTo(p[0], p[1] + 2); ctx.lineTo(p[0] + 6 * nz(i, li), p[1] + 30 + 40 * hash(i + li * 9)); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = rgba(R.rim, .9 * (.4 + .6 * dusk)); ctx.lineWidth = 1.3; ctx.beginPath(); top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  });
  // torches along the shore: a flame on a pole, a warm pool, a glint path on the water (returned for drawSea)
  for (const [i, [X, Z]] of (o.torches || []).entries()) {
    const b = C.P(X, 0, Z), p = C.P(X, 2.2, Z); if (!b || !p || p[1] > C.hy + 400) continue;
    const k = p[2], fl = Math.max(.6, 1.4 * k);
    ctx.strokeStyle = '#0a0606'; ctx.lineWidth = Math.max(1, .1 * k); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
    flames(ctx, t + i * 1.3, p[0], p[1], fl * .5);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = Math.max(6, 9 * k), g = ctx.createRadialGradient(p[0], p[1] - fl * .2, 0, p[0], p[1] - fl * .2, r); g.addColorStop(0, rgba('#fff1d6', .8)); g.addColorStop(.2, rgba('#ffb35c', .35)); g.addColorStop(1, rgba('#ff8a3a', 0)); ctx.fillStyle = g; ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r); ctx.restore();
    out.glints.push({ x: p[0], y: Math.max(b[1], C.hy + 1), col: '#ffb35c', a: .7, w: 2, spread: .06, fade: 160 });
  }
  return out;
}

// ---------------------------------------------------------------- Satawal: a ring of palms in an endless sea, one fire
const ATOLL = (() => { const r = prng(611), land = [], palms = []; for (let i = 0; i < 160; i++) { const a = i / 160 * TAU; land.push(.55 + .45 * Math.max(0, Math.sin(a * 3 + 1.2) * .6 + Math.sin(a * 7 + .4) * .4 + .3)); }
  for (let i = 0; i < 70; i++) { const a = r() * TAU, k = Math.floor(a / TAU * 160) % 160; if (land[k] < .62) continue; palms.push({ a, rr: .97 + .07 * (r() - .5), h: 7 + 5 * r(), lean: (r() - .5) * .5, la: r() * TAU, ph: r() * 10 }); } return { land, palms }; })();
export function atoll(ctx, t, C, o = {}) {
  const X = o.x ?? 0, Z = o.z ?? 0, R = o.R ?? 70, fire = o.fire ?? 1, out = {};
  const ring = (rr, y = .02) => { const p = []; for (let i = 0; i <= 160; i++) { const a = i / 160 * TAU; p.push([X + Math.sin(a) * rr, y, Z + Math.cos(a) * rr]); } return p; };
  // the reef surf: a pale broken line outside the land; the lagoon a lighter indigo
  const lag = projPoly(C, ring(R * .9, .01)); fillPoly(ctx, lag, '#14183a');
  for (const run of projRuns(C, ring(R * 1.14, .03), .5)) { ctx.save(); ctx.setLineDash([10, 7]); ctx.lineDashOffset = -t * 16; stroke(ctx, run, rgba('#c8d4f0', .4), Math.max(1, run[0][2] * .6)); ctx.restore(); }
  // the land: a narrow ring of motus, dark green-black, with gaps
  for (let i = 0; i < 160; i++) {
    const w = ATOLL.land[i]; if (w < .62) continue;
    const a0 = i / 160 * TAU, a1 = (i + 1.05) / 160 * TAU, r0 = R * (1 - .1 * w), r1 = R * (1 + .06 * w);
    const P = projPoly(C, [[X + Math.sin(a0) * r0, .4, Z + Math.cos(a0) * r0], [X + Math.sin(a1) * r0, .4, Z + Math.cos(a1) * r0], [X + Math.sin(a1) * r1, .4, Z + Math.cos(a1) * r1], [X + Math.sin(a0) * r1, .4, Z + Math.cos(a0) * r1]]);
    if (fillPoly(ctx, P, '#0a120e')) { ctx.strokeStyle = '#0a120e'; ctx.lineWidth = 1; ctx.stroke(); }
  }
  // the fire on the lagoon shore
  const fa = Math.PI * 1.15, FW = [X + Math.sin(fa) * R * .93, .45, Z + Math.cos(fa) * R * .93], fp = C.P(...FW);
  // palms, far to near
  const pl = ATOLL.palms.map((p) => { const b = [X + Math.sin(p.a) * R * p.rr, .4, Z + Math.cos(p.a) * R * p.rr]; return [C.depth(...b), p, b]; }).sort((p, q) => q[0] - p[0]);
  for (const [d, p, b] of pl) {
    if (d < .5) continue;
    const sway = .25 * Math.sin(t * .8 + p.ph), top = [b[0] + Math.sin(p.la) * (p.lean * p.h + sway), b[1] + p.h, b[2] + Math.cos(p.la) * (p.lean * p.h + sway)];
    const tr = []; for (let i = 0; i <= 8; i++) { const v = i / 8; tr.push([b[0] + (top[0] - b[0]) * v * v, b[1] + p.h * v, b[2] + (top[2] - b[2]) * v * v]); }
    const tp = C.P(...top); if (!tp) continue;
    for (const run of projRuns(C, tr, .5)) stroke(ctx, run, '#06080a', Math.max(1, tp[2] * .35));
    ctx.save(); ctx.lineCap = 'round';
    for (let f = 0; f < 7; f++) { const fa2 = f / 7 * TAU + p.ph, Lf = 3.2, pts = []; for (let i = 0; i <= 6; i++) { const v = i / 6; pts.push([top[0] + Math.sin(fa2) * Lf * v, top[1] + .6 * v - 2.2 * v * v + .15 * Math.sin(t * 1.3 + f + p.ph) * v, top[2] + Math.cos(fa2) * Lf * v]); } for (const run of projRuns(C, pts, .5)) stroke(ctx, run, '#070a0a', Math.max(1, tp[2] * .25)); }
    ctx.restore();
    if (fp) { const dx = fp[0] - tp[0], dy = fp[1] - tp[1], dl = Math.hypot(dx, dy); if (dl < 400 * Math.max(.2, fp[2] / 3)) { ctx.fillStyle = rgba('#ffb066', .5 * fire * clamp(1 - dl / 400)); ctx.beginPath(); ctx.arc(tp[0] + dx / dl * 1.5, tp[1] + dy / dl * 1.5, Math.max(1, tp[2] * .4), 0, TAU); ctx.fill(); } }
  }
  if (fp && fire > 0) {
    flames(ctx, t, fp[0], fp[1], Math.max(1.5, fp[2] * 1.2));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = Math.max(14, fp[2] * 14), g = ctx.createRadialGradient(fp[0], fp[1], 0, fp[0], fp[1], r); g.addColorStop(0, rgba('#fff1d6', .8 * fire)); g.addColorStop(.15, rgba('#ffb35c', .4 * fire)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.fillRect(fp[0] - r, fp[1] - r, 2 * r, 2 * r); ctx.restore();
    out.fire = fp;
  }
  return out;
}

// ---------------------------------------------------------------- the swell crests light amber under the hulls
export function swellGlow(ctx, t, C, K, o = {}) {
  const u = clamp(o.u ?? 0); if (u <= 0) return;
  const az = o.az ?? (K.head - Math.PI / 2), dx = Math.sin(az), dz = Math.cos(az), px = -dz, pz = dx, sp = 4.2, run0 = (t * 1.3) % sp;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = -4; i <= 4; i++) {
    const off = i * sp + run0, pts = [], L = 22 * eoX(u);
    for (let j = 0; j <= 30; j++) { const s = -L + 2 * L * j / 30, X = K.x + dx * off + px * s, Z = K.z + dz * off + pz * s; pts.push([X, Math.max(0, waterY(X, Z, t)) + .06, Z]); }
    const fade = Math.exp(-(off * off) / 160);
    for (const run of projRuns(C, pts, .3)) { stroke(ctx, run, rgba('#ff9a4a', .18 * fade * u), Math.max(2, run[0][2] * .5)); stroke(ctx, run, rgba('#ffd9a0', .7 * fade * u), Math.max(1, run[0][2] * .09)); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- helpers: a screen point back to a world direction; the sea seen from high above
export function unproj(C, sx, sy) {
  const a = (sx - 960) / C.F, b = -(sy - 540) / C.F, c = 1, cy = Math.cos(C.yaw), sy_ = Math.sin(C.yaw), cp = Math.cos(C.pitch), sp = Math.sin(C.pitch);
  const dy = b * cp - c * sp, z1 = b * sp + c * cp, dx = a * cy + z1 * sy_, dz = -a * sy_ + z1 * cy, l = Math.hypot(dx, dy, dz);
  return [dx / l, dy / l, dz / l];
}
export const dirAzEl = (d) => [Math.atan2(d[0], d[2]), Math.asin(clamp(d[1], -1, 1))];
// drawSea thins its rows out under a steep camera; seaTop adds the swell crests over the whole visible water for pitch > ~.8 (o.a)
export function seaTop(ctx, t, C, o = {}) {
  const a = o.a ?? 1, dawn = o.dawn ?? 0; if (a <= 0) return;
  const hit = (sx, sy) => { const d = unproj(C, sx, sy); if (d[1] > -.02) return null; const s = Math.min(3000, -C.y / d[1]); return [C.x + d[0] * s, C.z + d[2] * s]; };
  const Q = [hit(0, 0), hit(1920, 0), hit(1920, 1080), hit(0, 1080), hit(960, 540)].filter(Boolean); if (Q.length < 3) return;
  const x0 = Math.min(...Q.map((q) => q[0])) - 4, x1 = Math.max(...Q.map((q) => q[0])) + 4, z0 = Math.min(...Q.map((q) => q[1])) - 4, z1 = Math.max(...Q.map((q) => q[1])) + 4;
  const kc = C.F / Math.max(1, C.y), lam = .9, step = Math.max(1, 2 ** Math.ceil(Math.log2(Math.max(1, 7 / (kc * lam)))));
  ctx.save(); ctx.lineCap = 'round';
  const j0 = Math.ceil(z0 / lam / step) * step;
  for (let j = j0; j * lam < z1; j += step) {
    const Z = j * lam, n = 60, rim = [], dark = [];
    for (let i = 0; i <= n; i++) { const X = x0 + (x1 - x0) * i / n, hh = waterY(X, Z, t), p = C.P(X, hh, Z, .5); if (!p) continue; (hash(j * 7.3 + Math.floor((X + t * .35) / 1.7) * 1.31) > .3 ? rim : dark).push([p[0], p[1], hh]); }
    const lw = clamp(kc * .02, .6, 2);
    ctx.strokeStyle = rgba('#03030a', .45 * a); ctx.lineWidth = lw * 1.6; ctx.beginPath(); for (let i = 1; i < dark.length; i++) { ctx.moveTo(dark[i - 1][0], dark[i - 1][1] + lw); ctx.lineTo(dark[i][0], dark[i][1] + lw); } ctx.stroke();
    ctx.strokeStyle = rgba(mixHex('#7e8ab8', '#d8a080', dawn * .7), .3 * a); ctx.lineWidth = lw; ctx.beginPath(); for (let i = 1; i < rim.length; i++) { if (rim[i - 1][2] + rim[i][2] < 0) continue; ctx.moveTo(rim[i - 1][0], rim[i - 1][1]); ctx.lineTo(rim[i][0], rim[i][1]); } ctx.stroke();
  }
  ctx.restore();
}
