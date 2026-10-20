// c17 · world A: the long horizon (the ancient plateau with the fire, then the stations of the dolly through time).
//   worldA(ctx, t, C, K, HI)   everything under the sky for camera C (lib/v2_c17_kit camera), back to front
//   prepareA()                 builds the cached far layers (mountains), awaited through ready()
// Depths (m, +Z away from the camera rail): mountains 1600 / 650, hills 170, standing stones 5–10, the fire 0, the stations 1–2.5,
// the camera rail of the dolly −13.5. Ground Y = 0 everywhere (the rooftop building stands on it).
import { W, H, rgba, clamp, mix, prng } from '../engine.mjs';
import { hatch as engHatch } from '../engine.mjs';
import { vnoise, fbm, stipple, layer } from './art.mjs';
import { once, toImg, best, smooth01, mixHex, shadeHex, hash, HZ } from './v2_c17_kit.mjs';
import { fireBack, fireHalo, fireFront, FIRE } from './v2_c17_fire.mjs';
import { stations, prepareStations } from './v2_c17_stations.mjs';

const TAU = Math.PI * 2;
// ---------------------------------------------------------------- far layers (cached at a nominal camera distance, scaled per frame)
const LAYERS = [
  { key: 'm1', z: 1600, x0: -2700, x1: 2700, top: '#1c1b43', bot: '#25234f', rim: '#9aa6d4', ra: .32, seed: 3, h: (X, n) => 70 + 120 * fbm(n, X * .0016, .3, 4) + 60 * Math.max(0, Math.sin(X * .0011 + .8)) },
  { key: 'm2', z: 650, x0: -1300, x1: 1400, top: '#141333', bot: '#1c1b42', rim: '#8a96c4', ra: .26, seed: 5, h: (X, n) => 18 + 62 * fbm(n, X * .0042, .7, 4) },
  { key: 'm3', z: 170, x0: -330, x1: 420, top: '#0e0d25', bot: '#131231', rim: '#6e78a8', ra: .2, seed: 9, h: (X, n) => 2.5 + 11 * fbm(n, X * .013, .2, 3) },
];
const ZC0 = -8;   // nominal camera z for the caches
function farLayer(Ly) {
  return once('A' + Ly.key, () => {
    const k0 = 1400 / (Ly.z - ZC0), n = vnoise(Ly.seed), N = 420, hs = [];
    let hmax = 0; for (let i = 0; i <= N; i++) { const X = Ly.x0 + (Ly.x1 - Ly.x0) * i / N, hh = Ly.h(X, n); hs.push([X, hh]); hmax = Math.max(hmax, hh); }
    const w = Math.ceil((Ly.x1 - Ly.x0) * k0), h = Math.ceil((hmax + 6) * k0) + 24, [c, g] = layer(w, h), base = h - 4;
    const P = (X, Y) => [(X - Ly.x0) * k0, base - Y * k0];
    const path = () => { g.beginPath(); g.moveTo(0, h); for (const [X, Y] of hs) g.lineTo(...P(X, Y)); g.lineTo(w, h); g.closePath(); };
    path(); const gr = g.createLinearGradient(0, base - hmax * k0, 0, base); gr.addColorStop(0, Ly.top); gr.addColorStop(1, Ly.bot); g.fillStyle = gr; g.fill();
    g.save(); path(); g.clip();
    // gullies running down from the ridge, engraved hatch, darker hollows (fbm)
    const r = prng(Ly.seed * 31);
    g.strokeStyle = rgba('#05050f', .35); g.lineWidth = 1; g.lineCap = 'round';
    for (let i = 0; i < hs.length; i += 3) { const [X, Y] = hs[i]; if (r() < .45) continue; const [x, y] = P(X, Y); g.beginPath(); g.moveTo(x, y + 2); g.quadraticCurveTo(x + (r() - .5) * 18, y + (base - y) * .4, x + (r() - .5) * 30, y + (base - y) * (.6 + r() * .4)); g.stroke(); }
    engHatch(g, null, -.95, 4.2, .2, { box: [0, 0, w, h], col: '#04040c', w: .8, wobble: .6, seed: Ly.seed });
    const hz = g.createLinearGradient(0, base - 30, 0, base); hz.addColorStop(0, rgba(Ly.bot, 0)); hz.addColorStop(1, rgba(mixHex(Ly.bot, '#2a2858', .5), .9)); g.fillStyle = hz; g.fillRect(0, base - 30, w, 34);
    g.restore();
    // starlight on the ridge line
    g.strokeStyle = rgba(Ly.rim, Ly.ra); g.lineWidth = 1.2; g.beginPath(); hs.forEach(([X, Y], i) => { const [x, y] = P(X, Y); i ? g.lineTo(x, y + .6) : g.moveTo(x, y + .6); }); g.stroke();
    return c;
  });
}
function drawFar(ctx, C, Ly) {
  const im = farLayer(Ly), k0 = 1400 / (Ly.z - ZC0), k = C.k(Ly.z), s = k / k0;
  const x = 960 + C.pan + (Ly.x0 - C.x) * k, yb = HZ - C.dl - (0 - C.y) * k, h = im.height * s, w = im.width * s;
  ctx.drawImage(im, x, yb - h + 4 * s, w, h);
}

// ---------------------------------------------------------------- ground
const TUFTS = (() => { const r = prng(4711), a = []; for (let i = 0; i < 520; i++) { const z = -13 + Math.pow(r(), .8) * 26, x = -16 + r() * 60; a.push({ x, z, h: .14 + r() * .22, n: 3 + Math.floor(r() * 4), s: r() * 10, lean: (r() - .5) * .5 }); } return a.sort((p, q) => q.z - p.z); })();
const PEBBLES = (() => { const r = prng(4712), a = []; for (let i = 0; i < 160; i++) a.push({ x: -14 + r() * 56, z: -12 + r() * 22, w: .08 + r() * .25, s: r() }); return a; })();
function ground(ctx, t, C) {
  const hy = HZ - C.dl, y0 = Math.max(-10, hy + (C.y) * C.k(170) - 1);
  if (y0 < H) {
    const g = ctx.createLinearGradient(0, y0, 0, H + 40); g.addColorStop(0, '#15142e'); g.addColorStop(.12, '#0e0d22'); g.addColorStop(1, '#07060f');
    ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0 + 2);
  }
}
function tuftsAndPebbles(ctx, t, C, zmin, zmax) {
  const fx = FIRE.x, fz = FIRE.z;
  // pebbles (a dark stone with a lit top when near the fire)
  for (const P of PEBBLES) {
    if (P.z < zmin || P.z >= zmax) continue; const p = C.P(P.x, 0, P.z); if (!p) continue; const [x, y, k] = p, w = P.w * k; if (x < -w || x > W + w || y > H + w || y < 0) continue;
    const df = Math.hypot(P.x - fx, P.z - fz), lit = clamp(1 - df / 5);
    ctx.fillStyle = '#0c0b16'; ctx.beginPath(); ctx.ellipse(x, y - w * .18, w * .5, w * .26, 0, 0, TAU); ctx.fill();
    if (lit > 0) { ctx.fillStyle = rgba('#ff9a4a', .4 * lit); ctx.beginPath(); ctx.ellipse(x, y - w * .28, w * .38, w * .12, 0, 0, TAU); ctx.fill(); }
  }
  const sway = (s, k) => Math.sin(t * 1.3 + s) * .03 + Math.sin(t * 2.9 + s * 1.7) * .012;
  for (const P of TUFTS) {
    if (P.z < zmin || P.z >= zmax) continue; const p = C.P(P.x, 0, P.z); if (!p) continue; const [x, y, k] = p, hh = P.h * k;
    if (x < -hh || x > W + hh || y > H + hh || y < -2 || hh < 1.2) continue;
    const df = Math.hypot(P.x - fx, P.z - fz), lit = clamp(1 - df / 6);
    ctx.lineCap = 'round'; ctx.lineWidth = Math.max(.7, k * .008);
    ctx.strokeStyle = '#06050e'; ctx.beginPath();
    for (let i = 0; i < P.n; i++) { const a = (i / (P.n - 1 || 1) - .5) * .9 + P.lean + sway(P.s + i, k), L = hh * (.7 + .3 * hash(P.s + i)); ctx.moveTo(x + (i - P.n / 2) * k * .012, y); ctx.quadraticCurveTo(x + Math.sin(a) * L * .4, y - L * .55, x + Math.sin(a) * L, y - Math.cos(a) * L); }
    ctx.stroke();
    ctx.strokeStyle = lit > .05 ? rgba('#ffb35c', .55 * lit) : rgba('#7e8ab8', .28); ctx.lineWidth = Math.max(.6, k * .004); ctx.beginPath();
    for (let i = 0; i < P.n; i++) { const a = (i / (P.n - 1 || 1) - .5) * .9 + P.lean + sway(P.s + i, k), L = hh * (.7 + .3 * hash(P.s + i)); const tx = x + Math.sin(a) * L, ty = y - Math.cos(a) * L; ctx.moveTo(x + Math.sin(a) * L * .55, y - Math.cos(a) * L * .55); ctx.lineTo(tx, ty); }
    ctx.stroke();
  }
}
// ---------------------------------------------------------------- the standing stones behind the fire (ancient), lit by it from below
const MENHIRS = [{ x: -3.4, z: 5.6, w: .9, h: 2.5, s: 1 }, { x: 2.9, z: 7.4, w: 1.1, h: 3.3, s: 2 }, { x: -.5, z: 10.5, w: .8, h: 2.0, s: 3 }, { x: 6.2, z: 12.5, w: .95, h: 2.7, s: 4 }];
function menhir(ctx, t, C, M) {
  const b = C.P(M.x, 0, M.z); if (!b) return; const [x, y, k] = b, w = M.w * k, h = M.h * k; if (x + w < 0 || x - w > W) return;
  const r = prng(M.s * 13), pts = [[-.5, 0], [-.52, .3], [-.44, .72], [-.25, .95], [.02, 1.0], [.3, .9], [.47, .6], [.5, .2], [.5, 0]].map(([u, v]) => [x + (u + (r() - .5) * .06) * w, y - v * h]);
  ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath();
  ctx.fillStyle = '#17141f'; ctx.fill();
  ctx.save(); ctx.clip();
  const lit = clamp(1.4 - Math.hypot(M.x - FIRE.x, M.z - FIRE.z) / 9), br = .85 + .15 * Math.sin(t * 1.7 + M.s);
  const g = ctx.createLinearGradient(0, y, 0, y - h); g.addColorStop(0, rgba('#ff9a4a', .5 * lit * br)); g.addColorStop(.5, rgba('#a04a28', .18 * lit)); g.addColorStop(1, rgba('#000000', 0)); ctx.fillStyle = g; ctx.fillRect(x - w, y - h - 2, 2 * w, h + 4);
  if (w > 14) engHatch(ctx, null, -1.1, Math.max(2.6, k * .02), .3, { box: [x - w, y - h, 2 * w, h], col: '#000000', w: .8, fade: [x + w * .6, 0, x - w * .6, 0], seed: M.s });
  ctx.strokeStyle = rgba('#05040a', .5); ctx.lineWidth = Math.max(.7, k * .01); ctx.beginPath();
  for (let i = 0; i < 4; i++) { const u = r() - .5, v = .2 + r() * .6; ctx.moveTo(x + u * w * .6, y - v * h); ctx.lineTo(x + (u + (r() - .5) * .3) * w * .6, y - (v + .12 + r() * .15) * h); }
  ctx.stroke(); ctx.restore();
  ctx.strokeStyle = rgba('#8e9ac8', .35); ctx.lineWidth = Math.max(.8, k * .01); ctx.beginPath(); pts.slice(2, 7).forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke();
}

export function prepareA() { for (const Ly of LAYERS) farLayer(Ly); prepareStations(); }
export function worldA(ctx, t, C, K, HI) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (const Ly of LAYERS) drawFar(ctx, C, Ly);
  ground(ctx, t, C);
  const o = { tb: K.hb, hb: K.hb };
  tuftsAndPebbles(ctx, t, C, 3, 99);
  for (const M of MENHIRS.slice().sort((a, b) => b.z - a.z)) menhir(ctx, t, C, M);
  stations(ctx, t, C, K, 'back');
  tuftsAndPebbles(ctx, t, C, -.2, 3);
  fireBack(ctx, t, C, o);
  fireHalo(ctx, t, C, o);
  tuftsAndPebbles(ctx, t, C, -1.6, -.2);
  fireFront(ctx, t, C, o);
  stations(ctx, t, C, K, 'front');
  tuftsAndPebbles(ctx, t, C, -99, -1.6);
  ctx.restore();
}
