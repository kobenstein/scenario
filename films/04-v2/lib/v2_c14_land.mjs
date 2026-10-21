// c14 (Film 4 v2) · the country of kitchen windows (shots 14.01 → the dive into one window).
// One metric 3D world (metres, y up, the camera looks along -Z), drawn back to front in world-fixed depth slices (an engraved relief:
// every slice is a filled band with its crest line), a winding river with its valley, ~4000 houses in villages and farms whose
// kitchen windows light in waves outward from the river valley, valley mist, and the dusk sky of the handoff plate.
//   drawSky(ctx, t, P, n)        the 'dusk' sky plate of lib/handoff4.mjs (copied), remapped through the camera pitch: at pitch P0 and
//                                yaw 0 it is the plate pixel for pixel; below the plate's bottom edge it continues to the horizon glow.
//                                n (0..1) darkens dusk toward night.
//   drawLand(ctx, t, P, o)       terrain + river + mist + houses + lights for camera P (cam() of v2_c14_util). o: { n (night 0..1),
//                                wave: { t0 } (the light waves start), target: the dive cottage drawer (called in its depth bin) }
//   COTTAGE                      the one house the camera dives into (position, facing, window)
import { W, H, clamp, mix, lin, prng } from '../engine.mjs';
import { once, onceRaw, smo, hash, hexRGB, mixRGB, css, TAU } from './v2_c14_util.mjs';

export const FL = 1400;           // focal length of the land camera (px) — the sky remap uses the same
export const P0 = .42;            // the pitch at which the sky IS the dusk plate

// ---------------------------------------------------------------- the dusk sky (lib/handoff4.mjs skyPlate, tone 'dusk', copied)
const SKY = ['#0b0f2a', '#3b2f6e', '#c77a8a'], SKYN = ['#070918', '#1d1a46', '#5a3f6a'];
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
const BAND = (() => { const r = prng(55), d = []; for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); d.push([x, y, a]); } return d; })();
const elevOf = (yp) => P0 + Math.atan((H / 2 - yp) / FL);           // plate y → elevation angle
// below the plate's bottom edge (elevation .052) the glow continues down to the horizon (elevation 0) and a little beyond
const GLOW = [[.03, '#d48f8f'], [.014, '#e3a28f'], [0, '#eeb593'], [-.04, '#c98c87']];
const GLOWN = [[.03, '#6b4a72'], [.014, '#7e5676'], [0, '#8e6178'], [-.04, '#6a4a68']];
export function drawSky(ctx, t, P, n = 0) {
  const p = P.o.pitch || 0, dyaw = P.o.yaw || 0, ys = (e) => H / 2 - FL * Math.tan(e - p), xs = (x) => x - FL * dyaw;
  const col = (i) => n > 0 ? css(mixRGB(hexRGB(SKY[i]), hexRGB(SKYN[i]), n)) : SKY[i];
  // gradient: the plate's stops (linear in plate y) sampled at 7 points + the glow below, all at their remapped screen heights
  const st = [];
  for (const f of [0, .2, .4, .62, .74, .87, 1]) {
    const c = f <= .62 ? mixRGB(hexRGB(SKY[0]), hexRGB(SKY[1]), f / .62) : mixRGB(hexRGB(SKY[1]), hexRGB(SKY[2]), (f - .62) / .38);
    const cn = f <= .62 ? mixRGB(hexRGB(SKYN[0]), hexRGB(SKYN[1]), f / .62) : mixRGB(hexRGB(SKYN[1]), hexRGB(SKYN[2]), (f - .62) / .38);
    st.push([ys(elevOf(f * H)), css(n > 0 ? mixRGB(c, cn, n) : c)]);
  }
  for (let i = 0; i < GLOW.length; i++) st.push([ys(GLOW[i][0]), css(mixRGB(hexRGB(GLOW[i][1]), hexRGB(GLOWN[i][1]), n))]);
  const y0 = st[0][0], y1 = st[st.length - 1][0];
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  for (const [y, c] of st) g.addColorStop(clamp((y - y0) / (y1 - y0)), c);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, p === P0 ? H : Math.min(H, Math.max(0, ys(-.03) + 40)));
  if (p === P0 && dyaw === 0 && n === 0) { plateDetail(ctx, t); return; }
  const remap = (X, Y) => [xs(X), ys(elevOf(Y))];
  // the band (rotated -.42 about the frame centre in plate space), batched by alpha
  const ca = Math.cos(-.42), sa = Math.sin(-.42), cb = Math.cos(.42), sb = Math.sin(.42), fade = 1 - .6 * n, bk = new Map();
  for (const [x, y, a] of BAND) {
    const bx = x + t * 1.5, X = W / 2 + bx * ca - y * sa, Y = H / 2 + bx * sa + y * ca, [X2, Y2] = remap(X, Y);
    if (Y2 < -4 || Y2 > H + 4) continue;
    const u = X2 - W / 2, v = Y2 - H / 2, key = Math.round(a * fade * 200);
    let L = bk.get(key); if (!L) bk.set(key, L = []); L.push(u * cb - v * sb, u * sb + v * cb);
  }
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.42);
  for (const [key, L] of bk) { ctx.fillStyle = `rgba(216,230,255,${key / 200})`; ctx.beginPath(); for (let i = 0; i < L.length; i += 2) ctx.rect(L[i], L[i + 1], 1.3, 1.3); ctx.fill(); }
  ctx.restore();
  const dx = t * 2.2, dy = t * .6, sk = new Map(), halo = [];
  for (const [x, y, s, ph, f] of STARS) {
    const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx) % W + W) % W, Y = ((y + dy) % H + H) % H;
    if (Y > H * .7) continue;
    const [X2, Y2] = remap(X, Y); if (Y2 < -12 || Y2 > H + 12) continue;
    const key = Math.round((.35 + .65 * tw) * (s > 1.2 ? 1 : .8) * 40);
    let L = sk.get(key); if (!L) sk.set(key, L = []); L.push(X2, Y2, s);
    if (s > 2) halo.push(X2, Y2, s, tw);
  }
  for (const [key, L] of sk) { ctx.fillStyle = `rgba(243,239,226,${key / 40})`; ctx.beginPath(); for (let i = 0; i < L.length; i += 3) { ctx.moveTo(L[i] + L[i + 2], L[i + 1]); ctx.arc(L[i], L[i + 1], L[i + 2], 0, TAU); } ctx.fill(); }
  for (let i = 0; i < halo.length; i += 4) { ctx.fillStyle = `rgba(255,241,214,${.07 * halo[i + 3]})`; ctx.beginPath(); ctx.arc(halo[i], halo[i + 1], halo[i + 2] * 5, 0, TAU); ctx.fill(); }
}
// the plate's own band + stars, unmapped (the exact plate at pitch P0)
function plateDetail(ctx, t) {
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.42);
  for (const [x, y, a] of BAND) { ctx.fillStyle = `rgba(216,230,255,${a})`; ctx.fillRect(x + t * 1.5, y, 1.3, 1.3); }
  ctx.restore();
  const dx = t * 2.2, dy = t * .6;
  for (const [x, y, s, ph, f] of STARS) {
    const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx) % W + W) % W, Y = ((y + dy) % H + H) % H;
    if (Y > H * .7) continue;
    ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
    if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
  }
}

// ---------------------------------------------------------------- terrain
const NS = 256, NP = (() => { const r = prng(1414), a = new Float32Array(NS * NS); for (let i = 0; i < a.length; i++) a[i] = r() * 2 - 1; return a; })();
function vn(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const i0 = ((xi % NS) + NS) % NS, j0 = ((yi % NS) + NS) % NS, i1 = (i0 + 1) % NS, j1 = (j0 + 1) % NS;
  const a = NP[j0 * NS + i0], b = NP[j0 * NS + i1], c = NP[j1 * NS + i0], d = NP[j1 * NS + i1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, o = 4) { let s = 0, a = .55, f = 1; for (let i = 0; i < o; i++) { s += a * vn(x * f + i * 17.3, y * f - i * 9.1); f *= 2.03; a *= .5; } return s; }
// the river: from the far mountains it winds down the valley toward the viewer and passes under the camera on the right
export const xr = (Z) => 330 * Math.sin(Z / 2300 + .9) + 150 * Math.sin(Z / 820 + 2.4) - 300 + 160 * clamp((Z + 800) / 2000);
export const wr = (Z) => 34 + 26 * clamp(-Z / 9000);
// the dive cottage (a stranger's kitchen): on a flat bench above the valley, west of the river, its front facing the camera
export const COTTAGE = { X: -760, Z: -1180, Y: 0, rot: .12, w: 8.2, d: 7, hw: 3.4, ridge: 2.8 };
export function hgt(X, Z) {
  const dR = Math.abs(X - xr(Z)), far = clamp((-Z - 2500) / 11000);
  const val = (300 + 120 * far) * (1 - Math.exp(-((dR / 1250) ** 2)));
  const hills = (300 + 200 * far) * fbm(X / 1700, Z / 1700) * smo(clamp((dR - 160) / 900));
  const mtn = 720 * far * far * clamp(.5 + .7 * fbm(X / 3200 + 7, Z / 2600 - 3));
  const det = 26 * fbm(X / 260, Z / 260, 3) * smo(clamp((dR - 90) / 300));
  let h = val + hills + mtn + det;
  const fl = smo(clamp((dR - 50) / 280)); h = h * fl + 3 * (1 - fl);     // the flat valley floor along the river
  const rc = Math.hypot(X - COTTAGE.X, Z - COTTAGE.Z), bench = 1 - smo(clamp((rc - 70) / 260));   // the cottage's bench
  h = mix(h, COTTAGE.Y0 ?? 0, bench);
  return Math.max(h, 1.5);
}
COTTAGE.Y0 = 0; { const h0 = (() => { const save = COTTAGE.Y0; COTTAGE.Y0 = 0; let s = 0, k = 0; for (let a = 0; a < TAU; a += .5) { const X = COTTAGE.X + 420 * Math.cos(a), Z = COTTAGE.Z + 420 * Math.sin(a); s += hgt(X, Z); k++; } COTTAGE.Y0 = save; return s / k; })(); COTTAGE.Y0 = Math.max(18, h0 * .55); COTTAGE.Y = COTTAGE.Y0; }

// ---------------------------------------------------------------- depth slices (world-fixed, back to front)
// spacing: dense where the cameras of 14.01 look down steeply, ~7.5 % of the distance far out; a few extra slices on the cottage's
// bench (the dive comes down there)
const dzOf = (Z) => (Z > 600 ? 20 + .05 * (Z - 600) : 20 + .075 * (600 - Z));
const dxOf = (Z) => Math.max(2.5, .0065 * (Math.min(Math.abs(900 - Z), Math.abs(2100 - Z)) + 300));
export const SLICES = (() => {
  const zs = []; let Z = 1500;
  while (Z > -27000) { zs.push(Z); Z -= dzOf(Z); }
  for (const d of [95, 62, 36, 16, -22, -55]) zs.push(COTTAGE.Z + d);
  zs.sort((a, b) => b - a);
  return zs.map((Z) => {
    const dx = dxOf(Z), half = 1.08 * (2300 - Z) + 500, i0 = Math.floor(-half / dx), i1 = Math.ceil(half / dx);
    const hs = new Float32Array(i1 - i0 + 1), sh = new Float32Array(i1 - i0 + 1), e = Math.max(4, dx);
    for (let i = i0; i <= i1; i++) {
      const X = i * dx, h = hgt(X, Z); hs[i - i0] = h;
      const hZ = (hgt(X, Z + e) - hgt(X, Z - e)) / (2 * e), hX = (hgt(X + e, Z) - hgt(X - e, Z)) / (2 * e);
      sh[i - i0] = clamp(.5 + 1.6 * hZ - .5 * Math.abs(hX) + .25 * hX);   // lit where the slope faces the afterglow (−Z), a little from the west
    }
    return { Z, dx, i0, i1, hs, sh, houses: [], mist: [] };
  });
})();
const binOf = (Z) => { let k = 0; while (k < SLICES.length - 1 && SLICES[k + 1].Z >= Z) k++; return k + 1 < SLICES.length ? k + 1 : k; };   // the slice just behind Z

// ---------------------------------------------------------------- houses (villages, hamlets, farms) and their kitchen windows
export const HOUSES = (() => {
  const r = prng(2718), out = [], V = [];
  // the town on the river (c13's valley), villages up and down the valley, villages on the slopes, hamlets far out
  V.push({ Z: -1650, X: null, n: 230, s: 300, town: true });
  for (const [Z, n, s] of [[-700, 60, 170], [-2900, 120, 260], [-4300, 110, 300], [-6000, 150, 380], [-8200, 130, 420], [-10500, 170, 520], [-13500, 160, 600], [-17000, 190, 750], [-21000, 180, 900]]) V.push({ Z, X: null, n, s });
  for (let i = 0; i < 46; i++) {
    const Z = -500 - 23000 * Math.pow(r(), 1.25), side = r() < .5 ? -1 : 1, off = side * (900 + r() * (2500 + .55 * -Z));
    V.push({ Z, X: xr(Z) + off, n: Math.round(14 + r() * (40 + -Z / 300)), s: 120 + r() * 260 + -Z / 60 });
  }
  const add = (X, Z, town) => {
    const dR = Math.abs(X - xr(Z)); if (dR < wr(Z) / 2 + 24) return;
    if (Math.abs(X - COTTAGE.X) < 60 && Math.abs(Z - COTTAGE.Z) < 60) return;
    const Y = hgt(X, Z); if (Y > 560) return;
    const sl = Math.abs(hgt(X + 12, Z) - hgt(X - 12, Z)) + Math.abs(hgt(X, Z + 12) - hgt(X, Z - 12)); if (sl > 14) return;
    const big = town && r() < .5;
    out.push({ X, Y, Z, w: 7 + r() * 4 + (big ? 2 : 0), d: 6 + r() * 3, hh: (big ? 5.6 : 3.2) + r() * 1.8, ridge: 2.2 + r() * 1.6, rot: (r() - .5) * 1.1 + (r() < .2 ? Math.PI / 2 : 0),
      seed: Math.floor(r() * 1e6), wave: r() < .5 ? 0 : r() < .62 ? 1 : 2, jit: r(), pre: r() < .045, two: r() < .3, warm: r() });
  };
  for (const v of V) {
    const cx = v.X ?? xr(v.Z) + (v.town ? -40 : (r() - .5) * 500);
    for (let i = 0; i < v.n; i++) {
      const a = r() * TAU, rr = v.s * Math.sqrt(-2 * Math.log(1 - r() * .995)) * .7;
      add(cx + Math.cos(a) * rr * 1.25, v.Z + Math.sin(a) * rr, v.town);
    }
  }
  // farms: scattered over the whole country
  for (let i = 0; i < 900; i++) { const Z = 300 - 26000 * Math.pow(r(), 1.4), X = (r() - .5) * 2 * (1.05 * (2300 - Z) + 300); add(X, Z, false); }
  // the dive cottage's neighbours (a hamlet on its bench)
  for (const [dx, dz] of [[-48, -26], [-22, -62], [44, -40], [70, 18], [-85, 30]]) add(COTTAGE.X + dx, COTTAGE.Z + dz, false);
  out.sort((a, b) => a.Z - b.Z);
  for (const h of out) SLICES[binOf(h.Z)].houses.push(h);
  return out;
})();
// light wave: the time after o.wave.t0 at which a house's window lights (fronts run out from the river valley around the town,
// faster along the valley; exponential in distance so the front keeps an even pace on screen as it runs toward the horizon)
const ORIGIN = { X: xr(-1650), Z: -1650 };
const WAVE = { r0: 70, tau: .43, gap: [0, .42, .84] };
export function lightTime(h) {
  const dX = h.X - xr(h.Z), dZ = h.Z - ORIGIN.Z, rr = Math.hypot(dX * 1.0, dZ * .62);
  return WAVE.gap[h.wave] + WAVE.tau * Math.log(1 + rr / WAVE.r0) + .06 * h.jit;
}
// the mist: soft banks along the river and in the side valleys
const MIST = (() => {
  const r = prng(99), out = [];
  for (let Z = 600; Z > -16000; Z -= 140 + -Z * .09) { const X = xr(Z) + (r() - .5) * 300; out.push({ X, Z, Y: 14 + r() * 30, R: 260 + -Z * .05 + r() * 200, a: .5 + r() * .5 }); }
  for (const m of out) SLICES[binOf(m.Z)].mist.push(m);
  return out;
})();
const MISTIMG = () => once('c14-mist', () => {
  const S = 256, [c, x] = canvasOf(S, S / 4);
  const g = x.createRadialGradient(S / 2, S / 8, 0, S / 2, S / 8, S / 2);
  g.addColorStop(0, 'rgba(196,178,214,1)'); g.addColorStop(.4, 'rgba(180,162,204,.55)'); g.addColorStop(1, 'rgba(170,150,200,0)');
  x.fillStyle = g; x.fillRect(0, 0, S, S / 4); return c;
});
const GLOWIMG = () => once('c14-glow', () => {
  const S = 64, [c, x] = canvasOf(S, S), g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,214,150,1)'); g.addColorStop(.18, 'rgba(255,179,92,.55)'); g.addColorStop(.5, 'rgba(255,150,60,.14)'); g.addColorStop(1, 'rgba(255,140,50,0)');
  x.fillStyle = g; x.fillRect(0, 0, S, S); return c;
});
import { canvas as canvasOf } from '../engine.mjs';
export function warmLand() { MISTIMG(); GLOWIMG(); }

// single trees in the cottage's garden (they matter only when the camera comes down there)
export const TREES = [[-16, -9, 4.2], [14, -14, 5], [24, 6, 3.6], [-30, 12, 4.6], [17, 26, 3.4], [-20, 40, 3.9]].map(([dx, dz, rr]) => ({ X: COTTAGE.X + dx, Z: COTTAGE.Z + dz, Y: hgt(COTTAGE.X + dx, COTTAGE.Z + dz) + 5.5 + rr * .4, r: rr }));
for (const tr of TREES) { let k = 0; while (k < SLICES.length - 1 && SLICES[k + 1].Z >= tr.Z) k++; const sl = SLICES[Math.min(SLICES.length - 1, k + 1)]; (sl.trees || (sl.trees = [])).push(tr); }

// ---------------------------------------------------------------- colours of the land (dusk → night)
const LAND = { near: '#141330', haze: '#6a5884', nightNear: '#0b0b20', nightHaze: '#2a2546', rim: '#6d5f98', rimFar: '#d2aab8' };
const fogOf = (d) => 1 - Math.exp(-d / 8500);
const LITC = hexRGB('#8c78ac'), DARKC = [3, 3, 12];
const Q = (v, k = 12) => Math.round(v * k) / k;    // quantised alpha → fewer distinct paths

// ---------------------------------------------------------------- draw the land
export function drawLand(ctx, t, P, o = {}) {
  const n = o.n ?? 0, cz = P.o.z, cx = P.o.x, cyy = P.o.y, wt = o.wave ? t - o.wave.t0 : -1e9;
  const near = hexRGB(LAND.near), haze = hexRGB(LAND.haze), nN = hexRGB(LAND.nightNear), nH = hexRGB(LAND.nightHaze);
  const rim0 = hexRGB(LAND.rim), rim1 = hexRGB(LAND.rimFar);
  const glow = GLOWIMG();
  // the slices in front of the camera
  const list = [];
  for (let k = SLICES.length - 1; k >= 0; k--) { const c = P.cs(cx, 0, SLICES[k].Z); if (c[2] > 2) list.push(k); }
  if (!list.length) return;
  // project every crest (far → near), dropping vertices closer than ~5 px to the last kept one (unless the line turns)
  const tanH = (W / 2 + 80) / FL, crests = new Map();
  for (const k of list) {
    const s = SLICES[k], dz = P.cs(cx, 0, s.Z)[2], half = dz * tanH * 1.25 + 80;
    const a = Math.max(s.i0, Math.floor((cx - half) / s.dx)), b = Math.min(s.i1, Math.ceil((cx + half) / s.dx));
    if (b <= a) continue;
    // keep a vertex only where the line bends by more than ~.5 px from the straight run since the last kept one
    const buf = [], gs = []; let ymax = -1e9, gx = -1e9, kx = 0, ky = 0, run = [];
    for (let i = a; i <= b; i++) {
      const q = P(i * s.dx, s.hs[i - s.i0], s.Z); if (q[2] < 1) continue;
      const x = q[0], y = q[1]; if (y > ymax) ymax = y;
      if (x - gx >= 150 || i === b) { gs.push(x, s.sh[i - s.i0]); gx = x; }
      if (!buf.length) { buf.push(x, y); kx = x; ky = y; continue; }
      run.push(x, y);
      const dx = x - kx, dy = y - ky, L = Math.hypot(dx, dy) || 1; let bad = false;
      for (let r = 0; r < run.length - 2; r += 2) { if (Math.abs((run[r] - kx) * dy - (run[r + 1] - ky) * dx) / L > .55) { bad = true; break; } }
      if (bad) { const px = run[run.length - 4], py = run[run.length - 3]; buf.push(px, py); kx = px; ky = py; run = [x, y]; }
    }
    if (run.length) buf.push(run[run.length - 2], run[run.length - 1]);
    if (buf.length >= 4) crests.set(k, { pts: buf, gs, ymax, d: dz });
  }
  const order = list.filter((k) => crests.has(k));
  // pass A (far → near, half resolution): the relief bands with their slope light, the river, the mist
  const [TC, tx] = TERR();
  tx.setTransform(1, 0, 0, 1, 0, 0); tx.globalAlpha = 1; tx.globalCompositeOperation = 'source-over'; tx.clearRect(0, 0, W / TR, H / TR);
  tx.setTransform(1 / TR, 0, 0, 1 / TR, 0, 0);
  const fogs = new Map();
  for (let j = 0; j < order.length; j++) {
    const k = order[j], C = crests.get(k), nxt = order[j + 1] != null ? crests.get(order[j + 1]) : null, s = SLICES[k];
    const d = Math.max(0, cz - s.Z) + Math.abs(cyy) * .3, fg = fogOf(d);
    const base = mixRGB(mixRGB(near, haze, fg), mixRGB(nN, nH, fg), n); fogs.set(k, [fg, base]);
    const pts = C.pts, m = pts.length / 2, gs = C.gs;
    if (gs.length >= 6 && gs[gs.length - 2] - gs[0] > 40) {
      const x0 = gs[0], x1 = gs[gs.length - 2], g = tx.createLinearGradient(x0, 0, x1, 0), kl = .26 * (1 - .45 * fg) * (1 - .5 * n);
      for (let i = 0; i < gs.length; i += 2) { const sv = gs[i + 1]; g.addColorStop(clamp((gs[i] - x0) / (x1 - x0)), css(sv > .5 ? mixRGB(base, LITC, (sv - .5) * 2 * kl) : mixRGB(base, DARKC, (.5 - sv) * 2 * .32))); }
      tx.fillStyle = g;
    } else tx.fillStyle = css(base);
    // the band: a strip from this crest down to the next nearer crest (+3 px under it; that crest's band covers the rest).
    // Where the nearer crest stands higher the strip turns over, which is still right: the nearer band paints over it.
    tx.beginPath(); tx.moveTo(pts[0], pts[1]);
    for (let i = 1; i < m; i++) tx.lineTo(pts[i * 2], pts[i * 2 + 1]);
    if (nxt) {
      const np = nxt.pts, nm = np.length / 2;
      tx.lineTo(Math.max(pts[(m - 1) * 2], np[(nm - 1) * 2]) + 2, np[(nm - 1) * 2 + 1] + 3);
      for (let i = nm - 1; i >= 0; i--) tx.lineTo(np[i * 2], np[i * 2 + 1] + 3);
      tx.lineTo(Math.min(pts[0], np[0]) - 2, np[1] + 3);
    } else { tx.lineTo(pts[(m - 1) * 2], H + 4); tx.lineTo(pts[0], H + 4); }
    tx.closePath(); tx.fill();
    const s1 = k > 0 ? SLICES[k - 1] : null;
    if (s1 && s.Z > -17000) river(tx, P, s.Z, s1.Z, fg, n);
    for (const mm of s.mist) mist(tx, P, mm, fg, n);
  }
  tx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(TC, 0, 0, W, H);
  // pass B (near → far, full resolution): what each slice hides is known from the slices in front of it (a per-column horizon),
  // so ridge lines, houses and lights can be drawn sharp over the relief and still disappear behind the hills in front of them
  const occ = OCC; occ.fill(1e9);
  const items = [];
  for (let j = order.length - 1; j >= 0; j--) {
    const k = order[j], C = crests.get(k), far = j > 0 ? crests.get(order[j - 1]) : null, s = SLICES[k], [fg, base] = fogs.get(k);
    const it = { k, fg, base, rim: null, houses: null, trees: s.trees };
    // ridge line: where this crest stands above the land behind it and is not hidden by the land in front
    if (far) {
      const pts = C.pts, m = pts.length / 2, pp = far.pts, pm = pp.length / 2, seg = []; let w = 0, on = false;
      for (let i = 0; i < m; i++) {
        const x = pts[i * 2], y = pts[i * 2 + 1];
        while (w < pm - 2 && pp[(w + 1) * 2] < x) w++;
        const x0 = pp[w * 2], x1 = pp[(w + 1) * 2] ?? x0, y0 = pp[w * 2 + 1], y1 = pp[(w + 1) * 2 + 1] ?? y0;
        const yf = x1 > x0 ? mix(y0, y1, clamp((x - x0) / (x1 - x0))) : y0, xi = x | 0;
        const sil = y < yf - .7 && (xi < 0 || xi >= W || y < occ[xi] - .5);
        if (sil) { if (!on) { seg.push(NaN, NaN); if (i) seg.push(pts[i * 2 - 2], pts[i * 2 - 1]); on = true; } seg.push(x, y); }
        else if (on) { seg.push(x, y); on = false; }
      }
      if (seg.length > 4) it.rim = seg;
    }
    it.vis = (x, y) => { const xi = Math.round(x); return xi < 0 || xi >= W || y < occ[xi] - .3; };
    it.hs = s.houses.length ? collectHouses(t, P, s.houses, wt, it.vis) : null;
    if (o.target && o.target.bin === k) it.target = true;
    items.push(it);
    // this crest now hides what lies behind it
    const pts = C.pts, m = pts.length / 2;
    for (let i = 0; i < m - 1; i++) {
      let x0 = pts[i * 2], y0 = pts[i * 2 + 1], x1 = pts[i * 2 + 2], y1 = pts[i * 2 + 3]; if (x1 < x0) { [x0, x1] = [x1, x0]; [y0, y1] = [y1, y0]; }
      const a = Math.max(0, Math.ceil(x0)), b = Math.min(W - 1, Math.floor(x1)), dd = x1 - x0 || 1;
      for (let x = a; x <= b; x++) { const y = y0 + (y1 - y0) * (x - x0) / dd; if (y < occ[x]) occ[x] = y; }
    }
  }
  // the ridge lines, batched by brightness, under all houses and lights
  const rb = new Map();
  for (const it of items) {
    if (!it.rim) continue;
    const ra = Q((.62 - .2 * it.fg) * (1 - .5 * n), 16), rc = mixRGB(rim0, rim1, Math.min(1, it.fg * 1.25)), key = css([Math.round(rc[0] / 6) * 6, Math.round(rc[1] / 6) * 6, Math.round(rc[2] / 6) * 6], ra);
    let L = rb.get(key); if (!L) rb.set(key, L = []); L.push(it.rim);
  }
  ctx.lineWidth = 1;
  for (const [key, L] of rb) {
    ctx.strokeStyle = key; ctx.beginPath();
    for (const seg of L) { let mv = true; for (let i = 0; i < seg.length; i += 2) { if (seg[i] !== seg[i]) { mv = true; continue; } if (mv) { ctx.moveTo(seg[i], seg[i + 1]); mv = false; } else ctx.lineTo(seg[i], seg[i + 1]); } }
    ctx.stroke();
  }
  for (let j = items.length - 1; j >= 0; j--) {
    const it = items[j];
    if (it.trees) trees(ctx, P, it.trees, it.base, it.fg, n);
    if (it.hs) drawHouses(ctx, t, P, it.hs, it.fg, n, glow);
    if (it.target) o.target.draw(ctx, t, P, it.fg, it.vis);
  }
}
const TR = 3;   // the relief is drawn at a third of the resolution (it is soft light; the ridge lines on top are sharp)
const TERR = () => onceRaw('c14-terrain', () => canvasOf(W / TR, H / TR));
const OCC = new Float32Array(W);
// the river ribbon from Za (far) to Zb (near), 30 cm above the valley floor: the afterglow on the water
function river(ctx, P, Za, Zb, fg, n) {
  const N = Math.max(2, Math.ceil((Zb - Za) / 50)), L = [], R = [];
  for (let i = 0; i <= N; i++) {
    const Z = mix(Za, Zb, i / N), x = xr(Z), w = wr(Z) / 2, a = P(x - w, 3.3, Z), b = P(x + w, 3.3, Z);
    if (a[2] < 1 || b[2] < 1) return;
    L.push(a); R.push(b);
  }
  const graze = clamp(1 - Math.abs(P.o.pitch || 0) * 2.2), sheen = (.18 + .4 * graze) * (1 - .55 * n) * (1 - fg * .4);
  const col = mixRGB(mixRGB(hexRGB('#1f1c3e'), hexRGB('#a6809a'), sheen), hexRGB('#6e5f8e'), fg * .45);
  ctx.fillStyle = css(col); ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]);
  for (let i = 1; i <= N; i++) ctx.lineTo(L[i][0], L[i][1]); for (let i = N; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]); ctx.closePath(); ctx.fill();
}
function mist(ctx, P, m, fg, n) {
  const q = P(m.X, m.Y, m.Z); if (q[2] < 20) return;
  const s = FL * m.R / q[2]; if (s < 8) return;
  const a = m.a * (.06 + .08 * fg) * (1 - .4 * n) * smo(clamp((q[2] - 1400) / 2200)); if (a < .005) return;
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(MISTIMG(), q[0] - s, q[1] - s * .25, s * 2, s * .5); ctx.restore();
}
function trees(ctx, P, list, base, fg, n) {
  const dk = css(mixRGB(base, [4, 4, 14], .38)), lt = css(mixRGB(base, hexRGB('#8f7cb0'), .32 * (1 - .4 * n)));
  const dots = [], big = [];
  for (const tr of list) {
    const q = P(tr.X, tr.Y, tr.Z); if (q[2] < 2 || q[0] < -20 || q[0] > W + 20 || q[1] < -20 || q[1] > H + 20) { if (!(q[2] >= 2 && FL * tr.r / q[2] > 60 && q[0] > -FL * tr.r / q[2] && q[0] < W + FL * tr.r / q[2] && q[1] > -FL * tr.r / q[2] && q[1] < H + FL * tr.r / q[2])) continue; }
    const rr = FL * tr.r / q[2]; if (rr < .42) continue;
    if (rr < 1.4) dots.push(q[0], q[1], rr); else { const g = P(tr.X, tr.Y - 5.5 - tr.r * .4, tr.Z); big.push(q[0], q[1], rr, g[1], (tr.X * 7.13 + tr.Z * 3.71) % 6.283); }
  }
  if (dots.length) { ctx.fillStyle = dk; ctx.beginPath(); for (let i = 0; i < dots.length; i += 3) { const z = Math.max(1, dots[i + 2] * 1.6); ctx.rect(dots[i] - z / 2, dots[i + 1] - z / 2, z, z); } ctx.fill(); }
  if (big.length) {
    // a trunk and a clumped crown (lobes), lit from the sky on its upper left
    const crown = (dx, dy, k) => { ctx.beginPath(); for (let i = 0; i < big.length; i += 5) { const x = big[i] + dx * big[i + 2], y = big[i + 1] + dy * big[i + 2], r = big[i + 2], sd = big[i + 4];
      if (r < 6) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); continue; }
      for (let l = 0; l < 7; l++) { const a = sd + l * .9, d = l === 6 ? 0 : r * (.42 + .1 * Math.sin(sd * 3 + l)), lr = r * (l === 6 ? .62 : .44 + .1 * Math.sin(sd * 5 + l * 2.1)) * k, cx = x + Math.cos(a) * d * 1.08, cy = y + Math.sin(a) * d * .9; ctx.moveTo(cx + lr, cy); ctx.arc(cx, cy, lr, 0, TAU); } }
      ctx.fill(); };
    ctx.strokeStyle = dk; ctx.lineCap = 'round';
    for (let i = 0; i < big.length; i += 5) { if (big[i + 2] < 6) continue; ctx.lineWidth = Math.max(1, big[i + 2] * .14); ctx.beginPath(); ctx.moveTo(big[i], big[i + 1] + big[i + 2] * .3); ctx.lineTo(big[i] + big[i + 2] * .03, Math.max(big[i + 1] + big[i + 2] * .5, big[i + 3])); ctx.stroke(); }
    ctx.fillStyle = lt; crown(-.07, -.3, 1);
    ctx.fillStyle = dk; crown(.04, -.2, .97);
  }
}
// the houses of one depth bin, by level of detail. wt = seconds since the light waves started
const WIN = { y0: 1.05, y1: 2.15, w: 1.25 };
function collectHouses(t, P, list, wt, vis) {
  const dots = [], blocks = [], wins = [], flares = [], full = [];
  for (const h of list) {
    const q = P(h.X, h.Y + 1.6, h.Z); if (q[2] < 3 || q[0] < -60 || q[0] > W + 60 || q[1] < -60 || q[1] > H + 80) continue;
    const s = FL * h.w / q[2];
    if (!vis(q[0], q[1])) continue;
    const lt = h.pre ? -10 : lightTime(h), on = smo(clamp((wt - lt) / .16)), fl = wt > lt ? Math.exp(-(wt - lt) / .24) * clamp((wt - lt) / .06) : 0;
    if (fl > .06) flares.push(q[0], q[1], fl, s);
    if (s < 1.7) { if (on > .01) dots.push(q[0], q[1], on, s); continue; }
    if (s < 9) { blocks.push(h, q, s); if (on > .01) wins.push(q, s, on); continue; }
    full.push(h, on, fl);
  }
  return { dots, blocks, wins, flares, full };
}
function drawHouses(ctx, t, P, H0, fg, n, glow) {
  const { dots, blocks, wins, flares, full } = H0;
  const wall = css(mixRGB(mixRGB(hexRGB('#0c0b20'), hexRGB('#463a64'), fg), hexRGB('#08081a'), n * .5));
  const roof = css(mixRGB(mixRGB(hexRGB('#221f42'), hexRGB('#76648f'), fg), hexRGB('#141230'), n * .55));
  // far lights: amber points with a soft square halo (batched), brighter when fully on
  if (dots.length) {
    ctx.fillStyle = 'rgba(255,170,80,.16)'; ctx.beginPath();
    for (let i = 0; i < dots.length; i += 4) { if (dots[i + 2] < .3) continue; const z = 3.2 + dots[i + 3]; ctx.rect(dots[i] - z / 2, dots[i + 1] - z / 2, z, z); }
    ctx.fill();
    for (const [lo, hi, a] of [[.01, .5, .45], [.5, 1.01, 1]]) {
      ctx.fillStyle = `rgba(255,${200 + Math.round(30 * a)},${130 + Math.round(60 * a)},${a})`; ctx.beginPath();
      for (let i = 0; i < dots.length; i += 4) { const on = dots[i + 2]; if (on < lo || on >= hi) continue; const z = .95 + dots[i + 3] * .55; ctx.rect(dots[i] - z / 2, dots[i + 1] - z / 2, z, z); }
      ctx.fill();
    }
  }
  // small houses: walls (dark) and roofs (sky-lit), then their windows
  if (blocks.length) {
    for (const [col, part] of [[wall, 0], [roof, 1]]) {
      ctx.fillStyle = col; ctx.beginPath();
      for (let i = 0; i < blocks.length; i += 3) {
        const h = blocks[i], q = blocks[i + 1], s = blocks[i + 2], ww = s, wh = s * h.hh / h.w, rh = s * (h.ridge + .6) / h.w, x0 = q[0] - ww / 2, yb = q[1] + s * 1.6 / h.w;
        if (part === 0) { ctx.rect(x0, yb - wh, ww, wh); }
        else { ctx.moveTo(x0 - s * .06, yb - wh + s * .05); ctx.lineTo(q[0] + s * .04, yb - wh - rh); ctx.lineTo(x0 + ww + s * .06, yb - wh + s * .05); ctx.closePath(); }
      }
      ctx.fill();
    }
    for (let i = 0; i < wins.length; i += 3) {
      const q = wins[i], s = wins[i + 1], on = wins[i + 2], ww = Math.max(1.1, s * .17), wh = Math.max(1.1, s * .15);
      ctx.fillStyle = `rgba(255,${205 + Math.round(30 * on)},${140 + Math.round(60 * on)},${on})`; ctx.fillRect(q[0] - ww / 2 - s * .14, q[1] - wh / 2, ww, wh);
    }
    ctx.fillStyle = 'rgba(255,170,80,.14)'; ctx.beginPath();
    for (let i = 0; i < wins.length; i += 3) { if (wins[i + 2] < .3) continue; const q = wins[i], s = wins[i + 1], z = 4 + s * .5; ctx.rect(q[0] - s * .14 - z / 2, q[1] - z / 2, z, z); }
    ctx.fill();
  }
  // the wave front: each window flares as it lights (soft discs, batched in brightness steps, added to the light)
  if (flares.length) {   // drawn as the glow sprite, one image each (many arcs in one path are quadratic in this canvas)
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < flares.length; i += 4) { const f = flares[i + 2], r = 4 + flares[i + 3] * .7 + 13 * f; ctx.globalAlpha = Math.min(1, f * 1.15); ctx.drawImage(glow, flares[i] - r, flares[i + 1] - r, r * 2, r * 2); }
    ctx.restore();
  }
  for (let i = 0; i < full.length; i += 3) house3d(ctx, t, P, full[i], full[i + 1], full[i + 2], fg, n, glow);
}
// one house as a solid: walls, roof, chimney, the kitchen window (lit: amber with the table and the lamp in it)
export function house3d(ctx, t, P, h, on, fl, fg, n, glow) {
  const c = Math.cos(h.rot), s = Math.sin(h.rot), hw = h.w / 2, hd = h.d / 2;
  const L = (x, y, z) => [h.X + x * c + z * s, h.Y + y, h.Z - x * s + z * c];
  const V = { A: L(-hw, 0, hd), B: L(hw, 0, hd), C: L(hw, 0, -hd), D: L(-hw, 0, -hd) };
  const top = (p) => [p[0], p[1] + h.hh, p[2]];
  const r0 = L(0, h.hh + h.ridge, hd), r1 = L(0, h.hh + h.ridge, -hd);
  const cam = [P.o.x, P.o.y, P.o.z];
  const vis = (p, nx, nz) => (cam[0] - p[0]) * nx + (cam[2] - p[2]) * nz > 0;
  const wallLit = mixRGB(mixRGB(hexRGB('#1d1a3a'), hexRGB('#54476f'), fg), hexRGB('#0e0d22'), n * .6), wallSh = mixRGB(wallLit, hexRGB('#06060f'), .4);
  const roofC = mixRGB(mixRGB(hexRGB('#262246'), hexRGB('#7a6894'), fg), hexRGB('#151330'), n * .5);
  const face = (pts, col) => { if (P.poly(ctx, pts)) { ctx.fillStyle = css(col); ctx.fill(); } };
  // the faces, back to front by their distance (4 walls, then the roof planes)
  const faces = [];
  const fN = [s, c], fS = [-s, -c], fE = [c, -s], fW = [-c, s];   // outward normals (x, z) of front (+z local), back, right, left
  if (vis(V.A, fN[0], fN[1])) faces.push([[V.A, V.B, top(V.B), r0, top(V.A)], wallLit, 'front']);
  if (vis(V.C, fS[0], fS[1])) faces.push([[V.C, V.D, top(V.D), r1, top(V.C)], wallSh, 'back']);
  if (vis(V.B, fE[0], fE[1])) faces.push([[V.B, V.C, top(V.C), top(V.B)], mixRGB(wallLit, wallSh, .5), 'right']);
  if (vis(V.D, fW[0], fW[1])) faces.push([[V.D, V.A, top(V.A), top(V.D)], mixRGB(wallLit, wallSh, .7), 'left']);
  for (const [pts, col] of faces) face(pts, col);
  // roof: both planes (the one facing the sky glow lighter); eaves overhang a little
  const ov = .45;
  const RA = L(-hw - ov, h.hh - .2, hd + ov), RB = L(hw + ov, h.hh - .2, hd + ov), RC = L(hw + ov, h.hh - .2, -hd - ov), RD = L(-hw - ov, h.hh - .2, -hd - ov);
  const R0 = L(-0, h.hh + h.ridge, hd + ov), R1 = L(0, h.hh + h.ridge, -hd - ov);
  const left = [RA, R0, R1, RD], right = [R0, RB, RC, R1];
  const dl = Math.hypot(cam[0] - (RA[0] + R1[0]) / 2, cam[2] - (RA[2] + R1[2]) / 2), dr = Math.hypot(cam[0] - (RB[0] + R1[0]) / 2, cam[2] - (RB[2] + R1[2]) / 2);
  const roofs = dl > dr ? [[left, mixRGB(roofC, hexRGB('#a08aa8'), .12)], [right, roofC]] : [[right, roofC], [left, mixRGB(roofC, hexRGB('#a08aa8'), .12)]];
  for (const [pts, col] of roofs) face(pts, col);
  // chimney
  const ch = [L(hw * .45, h.hh + h.ridge * .55, -hd * .2), L(hw * .45 + .7, h.hh + h.ridge * .55, -hd * .2), L(hw * .45 + .7, h.hh + h.ridge + .9, -hd * .2), L(hw * .45, h.hh + h.ridge + .9, -hd * .2)];
  face(ch, mixRGB(wallSh, hexRGB('#000000'), .2));
  // the kitchen window on the front wall (and a second one on some houses)
  if (!vis(V.A, fN[0], fN[1])) return;
  for (const [wx, isK] of h.two ? [[-hw * .45, true], [hw * .42, false]] : [[-hw * .3, true]]) {
    const Q = [L(wx - WIN.w / 2, WIN.y0, hd + .02), L(wx + WIN.w / 2, WIN.y0, hd + .02), L(wx + WIN.w / 2, WIN.y1, hd + .02), L(wx - WIN.w / 2, WIN.y1, hd + .02)];
    const S = P.clip(Q); if (!S) continue;
    const lit = isK ? on : on * (h.warm > .5 ? 1 : 0) * .8;
    const xs = S.map((p) => p[0]), ys = S.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), sz = x1 - x0;
    ctx.beginPath(); ctx.moveTo(S[0][0], S[0][1]); for (let i = 1; i < S.length; i++) ctx.lineTo(S[i][0], S[i][1]); ctx.closePath();
    if (lit < .01) { ctx.fillStyle = css(mixRGB(hexRGB('#151330'), hexRGB('#3c3462'), fg)); ctx.fill(); continue; }
    const g = ctx.createRadialGradient((x0 + x1) / 2, y0 + (y1 - y0) * .3, 0, (x0 + x1) / 2, y0 + (y1 - y0) * .3, Math.max(2, sz));
    g.addColorStop(0, `rgba(255,241,214,${lit})`); g.addColorStop(.6, `rgba(255,190,110,${lit})`); g.addColorStop(1, `rgba(214,128,58,${lit})`);
    ctx.fillStyle = g; ctx.fill();
    if (isK && sz > 4) {   // the table in it: a dark top and two legs, the lamp above it
      ctx.save(); ctx.clip();
      const cxw = (x0 + x1) / 2, ty = y0 + (y1 - y0) * .66, tw = sz * .62;
      ctx.fillStyle = `rgba(40,22,14,${.85 * lit})`; ctx.fillRect(cxw - tw / 2, ty, tw, Math.max(1, (y1 - y0) * .07));
      ctx.fillRect(cxw - tw * .42, ty, Math.max(.8, sz * .045), (y1 - y0) * .4); ctx.fillRect(cxw + tw * .42 - Math.max(.8, sz * .045), ty, Math.max(.8, sz * .045), (y1 - y0) * .4);
      if (sz > 9) { ctx.strokeStyle = `rgba(40,22,14,${.7 * lit})`; ctx.lineWidth = Math.max(.6, sz * .015); ctx.beginPath(); ctx.moveTo(cxw, y0); ctx.lineTo(cxw, y0 + (y1 - y0) * .22); ctx.stroke(); ctx.fillStyle = `rgba(255,250,235,${lit})`; ctx.beginPath(); ctx.ellipse(cxw, y0 + (y1 - y0) * .25, sz * .07, sz * .04, 0, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    // frame + cross
    if (sz > 7) {
      ctx.strokeStyle = css(mixRGB(hexRGB('#2a2340'), hexRGB('#000000'), .2), .9); ctx.lineWidth = Math.max(.7, sz * .05);
      ctx.beginPath(); ctx.moveTo(S[0][0], S[0][1]); for (let i = 1; i < S.length; i++) ctx.lineTo(S[i][0], S[i][1]); ctx.closePath(); ctx.stroke();
      const m = (a, b, u) => [mix(a[0], b[0], u), mix(a[1], b[1], u)];
      if (S.length === 4) { const a = m(S[0], S[1], .5), b = m(S[3], S[2], .5), c2 = m(S[0], S[3], .55), d2 = m(S[1], S[2], .55); ctx.lineWidth = Math.max(.5, sz * .03); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.moveTo(c2[0], c2[1]); ctx.lineTo(d2[0], d2[1]); ctx.stroke(); }
    }
    // the light falls out of the window
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = sz * 1.6 + 6 + 20 * fl; ctx.globalAlpha = Math.min(1, .35 * lit + .5 * fl);
    ctx.drawImage(glow, (x0 + x1) / 2 - r, (y0 + y1) / 2 - r, r * 2, r * 2); ctx.restore();
  }
}
