// c17 · world B (17.03–17.08): the hill under the wheeling sky. A low knoll on a wide plain, you on its crest (back view, looking up,
// rim-lit by starlight); far low hills; a city ~3 km off on the right horizon (glow dome, windows, aviation lights, cars on a highway)
// whose lights go out on "stops". The terrain is drawn as world-fixed cross-sections (far → near), each a band with an engraved
// starlit top edge, so the hill reads as contour lines; grass on the crest.
//   hillH(X, Z)                    terrain height (m)
//   worldB(ctx, t, C, K, skyCamAt) everything under the sky for camera C, then the ghost motifs and the film's border
//   prepareB()                     builds the cached far layers and the city
import { W, H, rgba, clamp, mix, prng } from '../engine.mjs';
import { layer } from './art.mjs';
import { figureBack } from './figure.mjs';
import { once, HZ, smooth01, u01, hash, mixHex } from './v2_c17_kit.mjs';
import { farLayer, drawFar } from './v2_c17_landA.mjs';
import { ghosts, frameBorder } from './v2_c17_ghost.mjs';

const TAU = Math.PI * 2;
const und = (X, Z) => (.16 + .16 * Math.sin(X * .13 + .7) * Math.sin(Z * .11 + 1.1) + .08 * Math.sin(X * .37 - Z * .2)) * Math.exp(-(Z * Z) / 2500);
export const hillH = (X, Z) => 7 * Math.exp(-(X * X / 1444 + Z * Z / 676)) + und(X, Z);
export const YOU = [0, hillH(0, 0), 0];

// ---------------------------------------------------------------- far land and the city
const FAR = [
  { key: 'b1', z: 2200, x0: -2800, x1: 640, top: '#1a1940', bot: '#211f4a', rim: '#9aa6d4', ra: .28, seed: 21, h: (X, n) => 14 + 46 * Math.pow(n(X * .0021, .4), 1.6) + 10 * n(X * .011, 1.7) },
  { key: 'b2', z: 760, x0: -1300, x1: 420, top: '#131232', bot: '#18173c', rim: '#7e8ab8', ra: .24, seed: 23, h: (X, n) => 4 + 22 * Math.pow(n(X * .006, .2), 1.8) },
].map((Ly) => ({ ...Ly, h: (X, n) => smooth01(Ly.x0, Ly.x0 + .25 * (Ly.x1 - Ly.x0), X) * (1 - smooth01(Ly.x1 - .3 * (Ly.x1 - Ly.x0), Ly.x1 - 20, X)) * Ly.h(X, (a, b) => { let s = 0, w = .5, f = 1, tt = 0; for (let o = 0; o < 4; o++) { s += w * n(a * f, b * f); tt += w; w *= .5; f *= 2.03; } return s / tt; }) }));
const CITY = { z: 2300, x0: 800, x1: 1440, zc: -20, cx: 1110 };
const BUILD = (() => { const r = prng(808), a = []; let X = CITY.x0;
  while (X < CITY.x1) { const w = 12 + r() * 30, c = Math.exp(-((X - CITY.cx) ** 2) / 20000), h = 8 + r() * 26 + (r() < .35 * c + .05 ? 50 + r() * 90 * c : 0); a.push({ X, w, h, g: Math.floor(r() * 6), red: h > 70 && r() < .7 }); X += w + r() * 6; }
  return a; })();
function cityLayers() {
  return once('Bcity', () => {
    const k0 = 1400 / (CITY.z - CITY.zc), hmax = Math.max(...BUILD.map((b) => b.h)), w = Math.ceil((CITY.x1 - CITY.x0 + 60) * k0), h = Math.ceil(hmax * k0) + 8, base = h - 2;
    const [c, g] = layer(w, h), lights = [];
    for (const b of BUILD) {
      const x = (b.X - CITY.x0) * k0, bw = b.w * k0, bh = b.h * k0;
      g.fillStyle = mixHex('#0c0b1d', '#16142e', hash(b.X)); g.fillRect(x, base - bh, bw, bh);
      g.fillStyle = rgba('#ffb35c', .22); g.fillRect(x, base - bh, bw, Math.max(.6, k0 * 1.2));
    }
    for (let gi = 0; gi < 6; gi++) {
      const [lc, lg] = layer(w, h);
      for (const b of BUILD) {
        const x = (b.X - CITY.x0) * k0, bw = b.w * k0, bh = b.h * k0;
        for (let yy = base - 3; yy > base - bh + 1.5; yy -= 2.2) for (let xx = x + 1; xx < x + bw - 1; xx += 1.9) {
          const hh = hash(xx * 3.17 + yy * 7.31 + b.X); if (hh > .5 || Math.floor(hash(xx * 1.9 + yy * .7) * 6) !== gi) continue;
          lg.fillStyle = hh < .06 ? '#cfe4ff' : hh < .3 ? '#ffd08a' : '#ffb35c'; lg.globalAlpha = .55 + .45 * hash(xx + yy); lg.fillRect(xx, yy, 1, 1);
        }
      }
      lights.push(lc);
    }
    return { c, lights, k0, base, w, h };
  });
}
// the highway across the plain toward the city: cars as headlight / tail-light dots
const ROAD = [[-900, 700], [1000, 2250]], CARS = (() => { const r = prng(4040), a = []; for (let i = 0; i < 26; i++) a.push({ u0: r(), v: (22 + r() * 14) / 2700 * (r() < .5 ? 1 : -1), lane: r() < .5 ? -1 : 1, g: Math.floor(r() * 6) }); return a; })();
function city(ctx, t, C, K) {
  const L = cityLayers(), ts = K.stops - .12, k = C.k(CITY.z), s = k / L.k0, hy = HZ - C.dl;
  const x = 960 + C.pan + (CITY.x0 - C.x) * k, yb = hy - (0 - C.y) * k, w = L.w * s, h = L.h * s;
  if (x > W + 50 || x + w < -50 || yb - h > H || yb < -20) return;
  const dome = 1 - smooth01(ts, ts + 1.1, t), cx = 960 + C.pan + (CITY.cx - C.x) * k;
  if (dome > 0) {   // the glow over the city (sodium), lit from below
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(cx, yb); ctx.scale(1, .36);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 640 * s); g.addColorStop(0, rgba('#ff9a3a', .42 * dome)); g.addColorStop(.3, rgba('#c86a2a', .17 * dome)); g.addColorStop(1, rgba('#c86a2a', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 640 * s, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.drawImage(L.c, x, yb - h + 2 * s, w, h);
  for (let gi = 0; gi < 6; gi++) { const on = 1 - smooth01(ts + .11 * gi, ts + .11 * gi + .16, t); if (on <= 0) continue; ctx.globalAlpha = on; ctx.drawImage(L.lights[gi], x, yb - h + 2 * s, w, h); }
  ctx.globalAlpha = 1;
  // aviation lights on the towers (slow red blink), the cars
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const b of BUILD) if (b.red) { const on = 1 - smooth01(ts + .5, ts + .62, t), bl = Math.max(0, Math.sin(t * TAU / 1.6 + b.X)) ** 4; if (on * bl <= .01) continue;
    const px = 960 + C.pan + (b.X + b.w / 2 - C.x) * k, py = yb - b.h * k; ctx.fillStyle = rgba('#ff4a3a', .9 * on * bl); ctx.beginPath(); ctx.arc(px, py, 1.6, 0, TAU); ctx.fill(); }
  const tt = t < ts ? t : ts + .55 * (1 - Math.exp(-(t - ts) / .55));   // the traffic slows to a stop
  for (const c of CARS) {
    const on = 1 - smooth01(ts + .08 * c.g, ts + .08 * c.g + .2, t); if (on <= 0) continue;
    const u = ((c.u0 + c.v * tt) % 1 + 1) % 1, X = mix(ROAD[0][0], ROAD[1][0], u) + c.lane * 4, Z = mix(ROAD[0][1], ROAD[1][1], u), p = C.P(X, 0, Z); if (!p || p[0] < -5 || p[0] > W + 5) continue;
    const col = c.v > 0 ? '#ff6a4a' : '#fff1d6', r = clamp(p[2] * 1.2, .7, 1.8);
    ctx.fillStyle = rgba(col, .85 * on); ctx.beginPath(); ctx.arc(p[0] - r, p[1] - .4, r * .7, 0, TAU); ctx.arc(p[0] + r, p[1] - .4, r * .7, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the plain and the hill (world-fixed cross-sections, far → near)
const ZS = (() => { const a = []; for (let z = 60; z > 14; z -= 2) a.push(z); for (let z = 14; z > -14; z -= .5) a.push(+z.toFixed(2)); for (let z = -14; z >= -60; z -= 1.5) a.push(z); return a; })();
function plain(ctx, t, C) {
  const hy = HZ - C.dl; if (hy >= H) return;
  const g = ctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, '#1b1a3c'); g.addColorStop(.06, '#13122c'); g.addColorStop(.4, '#0d0c20'); g.addColorStop(1, '#08070f');
  ctx.fillStyle = g; ctx.fillRect(0, Math.max(0, hy - 1), W, H - hy + 2);
  ctx.save(); ctx.lineCap = 'round';   // engraved furrows of the plain (world-fixed dashes)
  for (let i = 0; i < 30; i++) {
    const z = 64 * Math.pow(1.19, i), k = C.k(z), y = hy + C.y * k; if (y > H + 4) continue; if (y < hy + 1.2) break;
    const lw = clamp(k * .02, .5, 1.4), cw = .1 * (z - C.z), X0 = C.x - 960 / k, X1 = C.x + (W - 960) / k;
    ctx.strokeStyle = rgba(i % 3 ? '#2a2852' : '#33305e', .3); ctx.lineWidth = lw; ctx.beginPath();
    for (let n = Math.floor(X0 / cw) - 1; n <= Math.ceil(X1 / cw); n++) { const hh = hash(i * 31.7 + n * 7.3); if (hh < .4) continue; const xa = 960 + (n * cw - C.x) * k; ctx.moveTo(xa, y); ctx.lineTo(xa + cw * k * (.3 + .5 * hh), y); }
    ctx.stroke();
  }
  ctx.restore();
}
function slices(ctx, t, C, zFrom, zTo, after) {
  const hy = HZ - C.dl, list = ZS.filter((z) => z <= zFrom && z > zTo && z - C.z > .7);
  for (let i = 0; i < list.length; i++) {
    const Z = list[i], D = Z - C.z, k = 1400 / D, zn = i + 1 < list.length ? list[i + 1] : null, yb = zn != null && zn - C.z > .7 ? hy + C.y * (1400 / (zn - C.z)) + 1.5 : H + 10;
    const half = (W / 2 + 60) / k, n = 46, pts = []; let ymin = 1e9;
    for (let j = 0; j <= n; j++) { const X = C.x - half + 2 * half * j / n, hh = hillH(X, Z), y = hy - (hh - C.y) * k; pts.push([960 + (X - C.x) * k, y, hh]); if (y < ymin) ymin = y; }
    if (ymin > H + 2) continue;
    const yB = Math.min(H + 10, Math.max(yb, ymin + 1));
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(pts[n][0], yB); ctx.lineTo(pts[0][0], yB); ctx.closePath();
    const cTop = mixHex('#0b0a1a', '#1a1938', clamp(D / 70)), g = ctx.createLinearGradient(0, ymin, 0, yB); g.addColorStop(0, mixHex(cTop, '#2a2a52', .35)); g.addColorStop(.25, cTop); g.addColorStop(1, mixHex(cTop, '#05040c', .4));
    ctx.fillStyle = g; ctx.fill();
    // the engraved, starlit top edge (brighter where the ground rises)
    ctx.lineWidth = clamp(k * .01, .6, 1.6); ctx.lineJoin = 'round';
    const fa = clamp((D - 2.5) / 12); if (fa > 0) for (let j = 0; j < n; j++) { const a = fa * clamp(.14 + .09 * (pts[j][2] + pts[j + 1][2]) / 2, .14, .5); ctx.strokeStyle = rgba('#8e9ac8', a); ctx.beginPath(); ctx.moveTo(pts[j][0], pts[j][1]); ctx.lineTo(pts[j + 1][0], pts[j + 1][1]); ctx.stroke(); }
    if (Math.abs(Z) <= 6 && D > 1.2) grass(ctx, t, C, Z, k, hy);
    if (after) after(Z);
  }
}
function grass(ctx, t, C, Z, k, hy) {
  const sway = (s) => .05 * Math.sin(t * 1.1 + s) + .02 * Math.sin(t * 2.7 + s * 1.9);
  ctx.lineCap = 'round';
  for (let X = -8; X <= 8; X += .32) {
    const hh = hash(X * 12.9 + Z * 7.1); if (hh > .55) continue;
    const Xj = X + (hash(X * 3.3 + Z) - .5) * .25, x = 960 + (Xj - C.x) * k; if (x < -40 || x > W + 40) continue;
    const y = hy - (hillH(Xj, Z) - C.y) * k; if (y > H + 30) continue;
    const nb = 3 + Math.floor(hh * 6), L0 = (.1 + .22 * hash(X + Z * 3.1)) * k; if (L0 < 1.5) continue;
    ctx.strokeStyle = '#07061a'; ctx.lineWidth = clamp(k * .006, .6, 1.8); ctx.beginPath();
    for (let b = 0; b < nb; b++) { const a = (b / (nb - 1) - .5) * .9 + sway(X * 5 + b), L = L0 * (.6 + .4 * hash(b + X)); ctx.moveTo(x + (b - nb / 2) * k * .008, y + 1); ctx.quadraticCurveTo(x + Math.sin(a) * L * .4, y - L * .55, x + Math.sin(a) * L, y - Math.cos(a) * L); }
    ctx.stroke();
    ctx.strokeStyle = rgba('#9fb0dc', .32); ctx.lineWidth = clamp(k * .004, .5, 1.2); ctx.beginPath();
    for (let b = 0; b < nb; b++) { const a = (b / (nb - 1) - .5) * .9 + sway(X * 5 + b), L = L0 * (.6 + .4 * hash(b + X)); ctx.moveTo(x + Math.sin(a) * L * .6, y - Math.cos(a) * L * .6); ctx.lineTo(x + Math.sin(a) * L, y - Math.cos(a) * L); }
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- you
function you(ctx, t, C, K) {
  const p = C.P(YOU[0], YOU[1], YOU[2]); if (!p) return; const [x, y, k] = p, s = k * 1.72 / 185; if (s < .08) return;
  const A = C.P(YOU[0], YOU[1], YOU[2]); // contact shadow on the crest
  ctx.save(); ctx.translate(A[0], A[1]); ctx.scale(1, .22); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, .5 * k); g.addColorStop(0, rgba('#04030a', .6)); g.addColorStop(1, rgba('#04030a', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, .5 * k, 0, TAU); ctx.fill(); ctx.restore();
  const rim = .7 + .25 * smooth01(K.do, K.do + 1.2, t);
  figureBack(ctx, x, y, s, { t, seed: 3, hold: 'none', headTilt: -.3 + .05 * Math.sin(t * .31 + 1), light: { x: x + 260 * Math.max(1, s), y: y - 1200, col: '#d6e4ff', a: rim } });
}

export function prepareB() { for (const Ly of FAR) farLayer(Ly); cityLayers(); }
export function worldB(ctx, t, C, K, skyCamAt) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const hy = HZ - C.dl;
  if (hy < H + 2) {
    plain(ctx, t, C);
    city(ctx, t, C, K);
    for (const Ly of FAR) drawFar(ctx, C, Ly);
    const chest = [YOU[0], YOU[1] + 1.12, YOU[2]];
    slices(ctx, t, C, 1e9, 0, null);
    ghosts(ctx, t, C, K, chest, 'behind');
    you(ctx, t, C, K);
    slices(ctx, t, C, 0, -1e9, null);
    ghosts(ctx, t, C, K, chest, 'front');
  }
  frameBorder(ctx, t, K, skyCamAt);
  ctx.restore();
}
