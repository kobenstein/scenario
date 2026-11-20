// Film 7 · "Can Superintelligence Grow Forever?" · the shared drawing kit (built by c01). Pure functions of t and their options,
// deterministic (prng only). Screen space 1920×1080 unless noted. Read this header; you do not need the rest.
//
// SETUP  `await f7Prepare()` once in your scene's default export (builds the sky tile and the Earth textures, ~4 s, and turns them into
//        Images: the @napi-rs drawImage(<Canvas>) leak). Without it the kit still draws (it builds canvases lazily) but leaks per frame.
// PALETTE `F7` = { space, spaceTop, horizon, violet, amber, amberCore, amberDeep, cool, coolCore, rim, cream, ink, stamp, land, sea, night }.
//
// sky(ctx, t, { ox 0, oy 0 (px, the star field scrolls/wraps; tilt the camera by changing oy), ang -.38 (Milky Way angle), a 1,
//               band 1, horizon null|screenY (violet glow rising from that line), only: 'stars' (no gradient) , scale 1 })
//     skyWarm(ang, [[ox, oy], …]) async: pre-builds the rotated field for these offsets (call once in the scene's setup; ~45 ms/frame saved).
//     night sky: indigo gradient, Milky Way (stipple + dust lanes), 7000 faint stars, ~230 bright stars that twinkle. ~8 ms.
//
// THE ORBIT WORLD (the Earth from low orbit; world units, Earth centre (0,0), y down, radius EARTH.R = 3000, dome radius EARTH.RD = 3660)
//   camO(cam {x, y, z}) → { k, X(x), Y(y), x(sx), y(sy) }   world ↔ screen (z = px per world unit). Thumbnail framing: { x: 200, y: -3200, z: 1 }.
//   earthHorizon(ctx, t, cam, { heat 0..1 (shimmer over land and sea), city 1 (twinkle), atmo 1, props [{kind, x, h, a, grow, seed}] })
//       the night side: engraved land (latitude hatching) and sea, coasts, moonlit clouds, city lights as stipple, the violet atmosphere band.
//       props stand on the limb at world x (storybook silhouettes): 'turbine' (blades turn), 'solar', 'coin', 'parliament', 'tower', 'tree'.
//       → { cx, cy, r } (screen centre and radius of the disc)
//   limbY(x) → world y of the limb (top of the Earth) at world x.     onSphere(x, y, R) → front-surface 3D unit vector.
//   curveO({ S, C, k 5.5, foot 510, n 260 }) → world polyline [[x, y, w]] of THE curve: a flat foot on the land left of the city S, then
//       exponential up to the dome contact C (defaults S = CURVE.S, C = CURVE.C). Project with camO before calling curve().
//
// curve(ctx, t, pts (screen [[x, y, w?]]), { tone 'amber'|'cool', w 1, br 1, u 1 (draw-on by length), a 1, shimmer 1, sparks 0 (per s),
//       burst null|t0 (a spray of sparks), tip true, ticks true, seed 1, glint 0..1 (cool: a star-glint running along it) })
//     → { tip [x,y], ang, len, at(f) → [x, y, ang] }. The luminous filament: deep amber haze, glow, white core, heat shimmer, sparks.
//
// dome(ctx, t, cam, { contact [x, y] world (on the dome), touch 0..1, reveal 0..1 (rim light runs along the whole edge), flare 0..1,
//       lines 0..1 (lines of light spread from the contact over the glass), linesA 1, warm 0..1 (inner warm glow), glass 1 (base visibility),
//       sparks [t0,…] (sparks slide down the glass like rain), skyO {ox, oy, ang} (for the refracted stars), seed })
//     the near-invisible glass hemisphere; never cracks. → { cx, cy, r, P(alpha, beta) → screen point on the dome around the contact }
//
// ring(ctx, t, { cx, cy, r, w 40, sy 1 (ellipse squash for a ground view), a 1, line 0..1 (amber line lying in it), from 0, to 2π, seed })
//     the luminous band: warm sharp inner edge (the floor), soft outer edge (the ceiling), sparkles drifting along it.
//
// card(ctx, t, { x, y (centre), s 1 (1 → 250×350 px), rot 0, flip 0..1 (turn over, 3D), side 'front'|'back' (side shown at flip 0),
//       num 1..4, q 'question', stamp null|'TEXT', stampU 0..1, answer null|{ word, img(g, w, h) }, lift 0..1, shadow true,
//       light [x, y] (rim light from there), a 1, tilt 0 (lie on a table: y squash 0..1) })  → { corners }
//     cream letterpress card: deckled edge, double rule, numeral I–IV in Instrument Serif, question; back: engraved guilloche + numeral
//     (+ the answer image and word once the card is turned in c08–c11). cardPrepare([opts]) pre-builds faces as Images (optional).
//
// lightCover(ctx, t, k, { cx, cy, tone 'amber' }) a warm light that grows over the frame; at k = 1 it IS the full frame (identical for any
//     caller at the same t): use it to fly into a light in one world and out of it in the next.
// Small helpers: ease { out, inn, io, q } (expo-out, expo-in, quart in-out), keys(t, [[t, v], …], ease) piecewise easing, mod, smooth noise n1(x).
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas, text } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';

const TAU = Math.PI * 2;
export const F7 = {
  space: '#0a1030', spaceTop: '#050822', horizon: '#2a2350', violet: '#6a58c0', amber: '#ffb35c', amberCore: '#fff1d6', amberDeep: '#e0782e',
  cool: '#bfe3ff', coolCore: '#eef8ff', rim: '#cfe6ff', cream: '#f3ecda', ink: '#2a2420', stamp: '#b23a2a', land: '#141a3c', sea: '#070c26', night: '#0c1424',
};
export const mod = (a, n) => ((a % n) + n) % n;
// easing (MOTION.md): expo-out (.16,1,.3,1), expo-in (.7,0,.84,0), quart in-out (.76,0,.24,1)
export const ease = {
  out: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x))),
  inn: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * clamp(x) - 10)),
  io: (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; },
  q: (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; },
  sine: (x) => -(Math.cos(Math.PI * clamp(x)) - 1) / 2,
};
// piecewise keyframes: ks = [[t0, v0], [t1, v1, easeFn?], …] (v numbers or arrays); before/after: held
export function keys(t, ks, def = ease.io) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) {
      const [t0, a] = ks[i - 1], [t1, b, f] = ks[i], u = (f || def)((t - t0) / (t1 - t0));
      return Array.isArray(a) ? a.map((v, j) => v + (b[j] - v) * u) : a + (b - a) * u;
    }
  }
  return ks[ks.length - 1][1];
}
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
export const n1 = (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return mix(hash(i), hash(i + 1), u) * 2 - 1; };

// ---------------------------------------------------------------- caches → Images
const CAN = new Map(), IMG = new Map();
const built = (k, f) => { if (!CAN.has(k)) CAN.set(k, f()); return CAN.get(k); };
const src = (k, f) => IMG.get(k) || built(k, f);
let PREP = null;
export function f7Prepare() {
  if (PREP) return PREP;
  PREP = (async () => {
    for (const [k, f] of [['sky', buildSky], ['earthFull', () => buildEarth('full')], ['earthCap', () => buildEarth('cap')]]) {
      const c = built(k, f); IMG.set(k, await loadImage(c.toBuffer('image/png'))); CAN.delete(k);
    }
  })();
  return PREP;
}

// ================================================================ SKY
const TW = 3000, TH = 2400;
const bandY = (x) => TH * .5 + 230 * Math.sin(TAU * x / TW + .6) + 70 * Math.sin(2 * TAU * x / TW + 2.1);
function buildSky() {
  const [c, g] = canvas(TW, TH), r = prng(701), n = vnoise(17), n2 = vnoise(31);
  const per = (f, x, y) => ((TW - x) * f(x, y) + x * f(x - TW, y)) / TW;
  const lum = (x, y) => per((a, b) => fbm(n, a * .0035, b * .0035, 4), mod(x, TW), y);
  const put = (fn, x, y, m) => { for (const dx of [0, -TW, TW]) for (const dy of [0, -TH, TH]) { const X = x + dx, Y = y + dy; if (X > -m && X < TW + m && Y > -m && Y < TH + m) fn(X, Y); } };
  // 1 · the diffuse glow of the band
  for (let i = 0; i < 1300; i++) {
    const x = r() * TW, y = bandY(x) + (r() + r() + r() - 1.5) * 170, rad = 70 + r() * 190, b = lum(x, y), al = .008 + .05 * b * b * b;
    const warm = r() < .35;
    put((X, Y) => { const gr = g.createRadialGradient(X, Y, 0, X, Y, rad); gr.addColorStop(0, warm ? `rgba(236,214,255,${al})` : `rgba(160,180,255,${al})`); gr.addColorStop(1, 'rgba(120,140,230,0)'); g.fillStyle = gr; g.fillRect(X - rad, Y - rad, rad * 2, rad * 2); }, x, y, rad);
  }
  // 2 · dust lanes (darker filaments along the band centre)
  g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 520; i++) {
    const x = r() * TW, y = bandY(x) + (r() - .5) * 70 + 40 * Math.sin(x * .004), rad = 20 + r() * 60, d = per((a, b) => fbm(n2, a * .006, b * .006, 3), x, y), al = .18 * Math.max(0, d - .45) * 3;
    if (al <= 0) continue;
    put((X, Y) => { const gr = g.createRadialGradient(X, Y, 0, X, Y, rad); gr.addColorStop(0, `rgba(0,0,0,${al})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(X - rad, Y - rad, rad * 2, rad * 2); }, x, y, rad);
  }
  g.globalCompositeOperation = 'source-over';
  // 3 · star dust in the band (the stipple)
  for (let i = 0; i < 130000; i++) {
    const x = r() * TW, gy = (r() + r() + r() + r() - 2) * 120, y = mod(bandY(x) + gy, TH), b = lum(x, y);
    if (r() > .25 + .9 * b * b) continue;
    g.fillStyle = `rgba(${220 + Math.round(r() * 35)},${226 + Math.round(r() * 25)},255,${(.16 + .5 * r()) * Math.max(0, 1 - Math.abs(gy) / 330)})`;
    const s = .6 + r() * .9; g.fillRect(x, y, s, s);
  }
  // 4 · faint stars everywhere, 5 · medium stars
  for (let i = 0; i < 7500; i++) { const x = r() * TW, y = r() * TH, s = .55 + r() * .7; g.fillStyle = `rgba(230,236,255,${.12 + .4 * r()})`; g.fillRect(x, y, s, s); }
  for (let i = 0; i < 1100; i++) {
    const x = r() * TW, y = r() * TH, s = .9 + r() * .8, k = r();
    g.fillStyle = k < .15 ? `rgba(255,214,170,${.5 + .4 * r()})` : k < .3 ? `rgba(190,215,255,${.5 + .4 * r()})` : `rgba(245,242,232,${.45 + .45 * r()})`;
    g.beginPath(); g.arc(x, y, s * .7, 0, TAU); g.fill();
  }
  return c;
}
const BRIGHT = (() => { const r = prng(4711), s = []; for (let i = 0; i < 230; i++) { const x = r() * TW, near = r() < .45; s.push({ x, y: near ? mod(bandY(x) + (r() - .5) * 420, TH) : r() * TH, s: 1.1 + Math.pow(r(), 2.2) * 2.2, ph: r() * TAU, f: .6 + r() * 1.8, c: r() < .2 ? '#ffd6aa' : r() < .3 ? '#cfe2ff' : '#f6f2e6' }); } return s; })();
const SKYC = new Map(), SKYM = 640;
// a rotated draw of the sky tile costs ~45 ms, so a scene can pre-build the rotated field in screen space (skyWarm, async, once) for the
// offsets it will use; sky() then only translates a cached image. Offsets with no cache fall back to the rotated draw.
function skyLayer(ang, ox, oy) {
  const L = SKYC.get(ang.toFixed(4)); if (!L) return null;
  const co = Math.cos(ang), si = Math.sin(ang);
  for (const c of L) { const dox = ox - c.ox, doy = oy - c.oy, sx = dox * co - doy * si, sy = dox * si + doy * co; if (Math.abs(sx) < SKYM - 2 && Math.abs(sy) < SKYM - 2) return { img: c.img, dx: -SKYM + sx, dy: -SKYM + sy }; }
  return null;
}
export async function skyWarm(ang, offsets) {
  const key = ang.toFixed(4); if (!SKYC.has(key)) SKYC.set(key, []);
  for (const [ox, oy] of offsets) {
    if (skyLayer(ang, ox, oy)) continue;
    const CWd = W + 2 * SKYM, CHd = H + 2 * SKYM, [cc, g] = canvas(CWd, CHd), im = src('sky', buildSky), R = Math.hypot(CWd, CHd) / 2 + 4;
    g.translate(CWd / 2, CHd / 2); g.rotate(ang);
    const x0 = mod(ox - TW / 2 + R, TW) - R - TW, y0 = mod(oy - TH / 2 + R, TH) - R - TH;
    for (let x = x0; x < R; x += TW) for (let y = y0; y < R; y += TH) if (x + TW > -R && y + TH > -R) g.drawImage(im, x, y);
    SKYC.get(key).push({ img: await loadImage(cc.toBuffer('image/png')), ox, oy });
  }
}
export function sky(ctx, t, o = {}) {
  const ox = o.ox ?? 0, oy = o.oy ?? 0, ang = o.ang ?? -.38, a = o.a ?? 1, sc = o.scale ?? 1;
  ctx.save();
  if (o.only !== 'stars') {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, F7.spaceTop); g.addColorStop(.6, F7.space); g.addColorStop(1, '#101342');
    ctx.fillStyle = g; ctx.fillRect(-2, -2, W + 4, H + 4);
    if (o.horizon != null) {
      const hy = o.horizon, hg = ctx.createLinearGradient(0, hy - 420, 0, hy + 10);
      hg.addColorStop(0, 'rgba(42,35,80,0)'); hg.addColorStop(.7, 'rgba(58,44,104,.55)'); hg.addColorStop(1, 'rgba(96,70,140,.75)');
      ctx.fillStyle = hg; ctx.fillRect(-2, hy - 420, W + 4, 432);
    }
  }
  ctx.globalAlpha = a * (o.band ?? 1);
  const L = sc === 1 ? skyLayer(ang, ox, oy) : null;
  if (a * (o.band ?? 1) <= 0) { ctx.translate(W / 2, H / 2); ctx.rotate(ang); ctx.scale(sc, sc); }
  else if (L) { ctx.drawImage(L.img, L.dx, L.dy); ctx.translate(W / 2, H / 2); ctx.rotate(ang); }
  else {
    ctx.translate(W / 2, H / 2); ctx.rotate(ang); ctx.scale(sc, sc);
    const R = Math.hypot(W, H) / 2 / Math.min(1, sc) + 4, im = src('sky', buildSky);
    const x0 = mod(ox - TW / 2 + R, TW) - R - TW, y0 = mod(oy - TH / 2 + R, TH) - R - TH;
    for (let x = x0; x < R; x += TW) for (let y = y0; y < R; y += TH) if (x + TW > -R && y + TH > -R) ctx.drawImage(im, x, y);
  }
  const R = Math.hypot(W, H) / 2 / Math.min(1, sc) + 4;
  ctx.globalAlpha = 1;
  for (const s of BRIGHT) {
    const X = mod(s.x + ox - TW / 2 + R, TW) - R, Y = mod(s.y + oy - TH / 2 + R, TH) - R; if (X > R || Y > R) continue;
    const tw = .62 + .38 * Math.sin(t * s.f + s.ph) * Math.sin(t * s.f * .37 + s.ph * 2);
    ctx.globalAlpha = a * tw; ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(X, Y, s.s * .62, 0, TAU); ctx.fill();
    if (s.s > 2.75) { ctx.globalAlpha = a * tw * .55; ctx.strokeStyle = s.c; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(X - s.s * 3.4, Y); ctx.lineTo(X + s.s * 3.4, Y); ctx.moveTo(X, Y - s.s * 3.4); ctx.lineTo(X, Y + s.s * 3.4); ctx.stroke(); ctx.globalAlpha = a * tw * .12; ctx.beginPath(); ctx.arc(X, Y, s.s * 3, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

// ================================================================ THE ORBIT WORLD: the Earth, its limb, the dome
export const EARTH = { R: 3000, RD: 3660, tilt: .78 };
export const CURVE = { S: [-140, -2910], C: [330, -3625] };
export function camO(cam) {
  const k = cam.z ?? 1, cx = cam.x ?? 0, cy = cam.y ?? 0;
  return { k, X: (x) => W / 2 + (x - cx) * k, Y: (y) => H / 2 + (y - cy) * k, x: (sx) => cx + (sx - W / 2) / k, y: (sy) => cy + (sy - H / 2) / k };
}
export const limbY = (x, R = EARTH.R) => -Math.sqrt(Math.max(0, R * R - x * x));
const RC = Math.cos(EARTH.tilt), RS = Math.sin(EARTH.tilt);
export function onSphere(x, y, R = EARTH.R) { const nx = x / R, ny = -y / R, q = 1 - nx * nx - ny * ny; return q < 0 ? null : [nx, ny, Math.sqrt(q)]; }
const latlon = (nx, ny, nz) => [Math.atan2(nx, ny * RS + nz * RC), Math.asin(clamp(ny * RC - nz * RS, -1, 1))];
const fromLL = (lon, lat) => { const sx = Math.cos(lat) * Math.sin(lon), sy = Math.sin(lat), sz = Math.cos(lat) * Math.cos(lon); return [sx, sy * RC + sz * RS, -sy * RS + sz * RC]; };
const gauss = (x, y, cx, cy, r) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r));
const NL = vnoise(101), NR = vnoise(202), NC = vnoise(303), NT = vnoise(404);
// land value at a world point (with the composition biases: land round the city, a bay of sea to the right)
function landAt(x, y) {
  const v = onSphere(x, y); if (!v) return -1;
  const [lon, lat] = latlon(...v);
  let f = fbm(NL, lon * 2.1 + 7.3, lat * 3.0 + 2.2, 5) - .5;
  f += .32 * gauss(x, y, CURVE.S[0], CURVE.S[1], 520) + .12 * gauss(x, y, -600, -2950, 500) - .3 * gauss(x, y, 780, -2860, 420) - .18 * gauss(x, y, 1250, -2700, 380);
  return f;
}
const SEA_SPOTS = [];
// city clusters on the land: [x, y, radius, dots, hero]; the hero city is the curve's source S
const CLUSTERS = (() => {
  const r = prng(4242), out = [[CURVE.S[0], CURVE.S[1], 70, 1400, true], [CURVE.S[0] - 120, CURVE.S[1] + 25, 34, 300, false], [CURVE.S[0] + 95, CURVE.S[1] + 30, 28, 220, false]];
  for (let i = 0; i < 9000 && out.length < 520; i++) {
    const x = -2900 + r() * 5800, y = -3000 + r() * 2400, v = onSphere(x, y); if (!v || v[2] < .03) continue;
    const f = landAt(x, y); if (f < .02) continue;
    const [lon, lat] = latlon(...v), de = fbm(NT, lon * 16, lat * 24, 3); if (r() > Math.pow(de, 3) * 2.5 + .02) continue;
    out.push([x, y, 8 + r() * r() * 34, Math.round(20 + r() * r() * 260), false]);
  }
  return out;
})();
const CAPR = { x0: -1700, y0: -3010, w: 3800, h: 450, k: 1.4 };
function buildEarth(kind) {
  const R = EARTH.R, cap = kind === 'cap';
  const k = cap ? CAPR.k : .32, x0 = cap ? CAPR.x0 : -R, y0 = cap ? CAPR.y0 : -R, ww = cap ? CAPR.w : 2 * R, hh = cap ? CAPR.h : 2 * R;
  const pw = Math.ceil(ww * k), ph = Math.ceil(hh * k), [c, g] = canvas(pw, ph);
  const img = g.createImageData(pw, ph), d = img.data;
  const [mc, mg] = canvas(pw, ph), mimg = mg.createImageData(pw, ph), md = mimg.data;   // land mask (alpha)
  for (let j = 0; j < ph; j++) {
    const y = y0 + (j + .5) / k;
    for (let i = 0; i < pw; i++) {
      const x = x0 + (i + .5) / k, v = onSphere(x, y), o = (j * pw + i) * 4;
      if (!v) continue;
      const [lon, lat] = latlon(...v), f = landAt(x, y), land = clamp((f + .006) / .012), coast = Math.exp(-Math.pow(f / .007, 2));
      const rel = fbm(NR, lon * 9, lat * 13, 3), cl = Math.max(0, fbm(NC, lon * 3.2 + 4, lat * 9.5, 4) - .52) * 2.4, limb = Math.pow(1 - v[2], 3);
      let R0 = mix(5, 13 + 9 * rel, land), G0 = mix(8, 17 + 10 * rel, land), B0 = mix(27, 42 + 14 * rel, land);
      // coast: a fine cool engraved line; moonlit clouds (faint); limb: the atmosphere seen through more air
      R0 += coast * 16; G0 += coast * 22; B0 += coast * 40;
      R0 += cl * 26; G0 += cl * 30; B0 += cl * 42;
      const lb = Math.exp(-v[2] / .035); R0 += lb * 40; G0 += lb * 26; B0 += lb * 92;
      d[o] = R0; d[o + 1] = G0; d[o + 2] = B0; d[o + 3] = 255;
      md[o] = md[o + 1] = md[o + 2] = 255; md[o + 3] = 255 * land;
      if (cap && land < .05 && v[2] < .35 && ((i * 7 + j * 13) % 997 === 0)) SEA_SPOTS.push([x, y]);
    }
  }
  g.putImageData(img, 0, 0); mg.putImageData(mimg, 0, 0);
  // engraving: latitude hatching over land (dense near the limb), dashed wave lines over the sea
  const hatchLayer = (landSide) => {
    const [hc, hg] = canvas(pw, ph); hg.setTransform(k, 0, 0, k, -x0 * k, -y0 * k); hg.lineCap = 'round';
    const step = cap ? .0016 : .004;
    for (let lat = -.9; lat < 1.2; lat += step) {
      hg.beginPath(); let on = false;
      for (let lon = -1.6; lon <= 1.6; lon += .004) {
        const v = fromLL(lon, lat); if (v[2] <= 0) { on = false; continue; }
        const X = v[0] * R, Y = -v[1] * R; if (X < x0 - 20 || X > x0 + ww + 20 || Y < y0 - 20 || Y > y0 + hh + 20) { on = false; continue; }
        const wob = n1(lon * 60 + lat * 900) * .8;
        on ? hg.lineTo(X, Y + wob) : hg.moveTo(X, Y + wob); on = true;
      }
      if (landSide) { hg.strokeStyle = 'rgba(150,160,235,.30)'; hg.lineWidth = (cap ? .6 : 1.8); hg.setLineDash([]); }
      else { hg.strokeStyle = 'rgba(110,130,215,.18)'; hg.lineWidth = (cap ? .5 : 1.4); hg.setLineDash(cap ? [6, 9] : [14, 20]); }
      hg.stroke();
    }
    hg.setTransform(1, 0, 0, 1, 0, 0); hg.globalCompositeOperation = landSide ? 'destination-in' : 'destination-out'; hg.drawImage(mc, 0, 0);
    return hc;
  };
  g.drawImage(hatchLayer(true), 0, 0); g.drawImage(hatchLayer(false), 0, 0);
  // the dark inner limb rim (the night side curving away) and the city lights as stipple
  g.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
  const r = prng(9001), dot = (x, y, s, col) => { const v = onSphere(x, y); if (!v) return; g.fillStyle = col; g.fillRect(x - s / 2, y - s * v[2] / 2, s, s * (.35 + .65 * v[2])); };
  const unit = cap ? 1 : 2.6, glowL = [];
  for (const [x, y, rad, n, hero] of CLUSTERS) {
    if (cap && (x < x0 - 200 || x > x0 + ww + 200 || y < y0 - 200 || y > y0 + hh + 200)) continue;
    const rr = prng(Math.round(x * 13 + y * 7));
    for (let i = 0; i < n * (cap ? 1 : .5); i++) {
      const q = rr() * TAU, d = rad * Math.sqrt(-Math.log(1 - rr() * .995)) * .6, px = x + Math.cos(q) * d, py = y + Math.sin(q) * d * .8, core = Math.exp(-d * d / (rad * rad * .15));
      if (landAt(px, py) < -.01) continue;
      const hot = rr() < .1 + .5 * core;
      dot(px, py, unit * (.8 + rr() * 1.5 + core * 1.2), hot ? `rgba(255,240,205,${.75 + .25 * rr()})` : `rgba(255,${165 + Math.round(rr() * 60)},${70 + Math.round(rr() * 60)},${.35 + .45 * rr()})`);
    }
    glowL.push([x, y, rad, hero]);
  }
  // roads: faint dotted threads between neighbouring clusters
  for (let i = 0; i < CLUSTERS.length; i++) for (let j = i + 1; j < CLUSTERS.length; j++) {
    const A = CLUSTERS[i], B = CLUSTERS[j], d = Math.hypot(A[0] - B[0], A[1] - B[1]); if (d > 260 || hash(i * 31 + j) > .45) continue;
    if (cap && (A[0] < x0 - 300 || A[0] > x0 + ww + 300)) continue;
    const n = Math.round(d / (cap ? 4 : 10));
    for (let k = 0; k < n; k++) { const q = k / n, px = mix(A[0], B[0], q) + n1(q * 6 + i) * 8, py = mix(A[1], B[1], q) + n1(q * 5 + j) * 6; if (r() < .6) dot(px, py, unit * (.6 + r() * .8), `rgba(255,190,110,${.25 + .3 * r()})`); }
  }
  g.globalCompositeOperation = 'lighter';
  for (const [x, y, rad, hero] of glowL) { const R2 = rad * (hero ? 2.6 : 1.5), gr = g.createRadialGradient(x, y, 0, x, y, R2); gr.addColorStop(0, `rgba(255,180,100,${hero ? .4 : .12})`); gr.addColorStop(.4, `rgba(255,150,70,${hero ? .14 : .04})`); gr.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = gr; g.fillRect(x - R2, y - R2, R2 * 2, R2 * 2); }
  g.globalCompositeOperation = 'source-over'; g.setTransform(1, 0, 0, 1, 0, 0);
  return c;
}
// bright city points that twinkle per frame (world coords, near the hero city and along the land near the limb)
const CITYLIVE = (() => { const r = prng(55), out = []; for (let i = 0; i < 1400 && out.length < 260; i++) { const x = -1500 + r() * 3400, y = -3000 + r() * 420, v = onSphere(x, y); if (!v || landAt(x, y) < .02) continue; const near = gauss(x, y, CURVE.S[0], CURVE.S[1], 300); if (r() > .25 + near) continue; out.push([x, y, r() * TAU, .8 + r() * 2.2, .6 + r() * 1.4]); } return out; })();
export const seaSpots = () => SEA_SPOTS;

export function earthHorizon(ctx, t, cam, o = {}) {
  const m = camO(cam), R = EARTH.R, cx = m.X(0), cy = m.Y(0), r = R * m.k;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.fillStyle = F7.sea; ctx.fillRect(0, 0, W, H);
  ctx.imageSmoothingQuality = m.k / .32 > 1.2 ? 'low' : 'medium';
  ctx.drawImage(src('earthFull', () => buildEarth('full')), m.X(-R), m.Y(-R), 2 * R * m.k, 2 * R * m.k);
  const capVis = m.X(CAPR.x0 + CAPR.w) > 0 && m.X(CAPR.x0) < W && m.Y(CAPR.y0 + CAPR.h) > 0 && m.Y(CAPR.y0) < H;
  ctx.imageSmoothingQuality = m.k / CAPR.k > 1.2 ? 'low' : 'medium';
  if (capVis && m.k > .3) ctx.drawImage(src('earthCap', () => buildEarth('cap')), m.X(CAPR.x0), m.Y(CAPR.y0), CAPR.w * m.k, CAPR.h * m.k);
  // living city lights
  if ((o.city ?? 1) > 0 && m.k > .35) {
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, ph, f, s] of CITYLIVE) {
      const X = m.X(x), Y = m.Y(y); if (X < -10 || X > W + 10 || Y < -10 || Y > H + 10) continue;
      const tw = .5 + .5 * Math.sin(t * f + ph); ctx.fillStyle = `rgba(255,214,150,${.5 * tw * (o.city ?? 1)})`; const ss = s * Math.min(2, m.k); ctx.fillRect(X - ss / 2, Y - ss / 4, ss, ss / 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // heat: the land and the sea shimmer (fine warm wavering lines rising, a warm veil)
  const heat = o.heat ?? 0;
  if (heat > 0) {
    const veil = ctx.createLinearGradient(0, m.Y(-R), 0, m.Y(-R + 500)); veil.addColorStop(0, rgba('#ff9a50', .16 * heat)); veil.addColorStop(1, rgba('#ff9a50', .03 * heat));
    ctx.fillStyle = veil; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.1;
    const rr = prng(77);
    for (let i = 0; i < 90; i++) {
      const x = -1600 + rr() * 3600, life = 2.2 + rr() * 1.6, ph = rr() * life, u = ((t + ph) % life) / life, y0 = limbY(x) + 10 + rr() * 300;
      const v = onSphere(x, y0); if (!v) continue;
      const X = m.X(x), Y = m.Y(y0) - u * 60 * m.k; if (X < -80 || X > W + 80 || Y < -40 || Y > H + 40) continue;
      const L = (60 + rr() * 90) * m.k * (.4 + .6 * v[2]); ctx.strokeStyle = rgba('#ffc890', .16 * heat * Math.sin(Math.PI * u)); ctx.beginPath();
      for (let q = 0; q <= 16; q++) { const xx = X - L / 2 + L * q / 16; ctx[q ? 'lineTo' : 'moveTo'](xx, Y + Math.sin(q * .9 + t * 5 + i) * 2.2 * m.k); }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
  // the atmosphere band: a thin violet glow over the limb, a fine bright airglow line on it
  const at = o.atmo ?? 1;
  if (at > 0 && r > 20) {
    const th = Math.max(16, 40 * m.k), gr = ctx.createRadialGradient(cx, cy, r - th * .5, cx, cy, r + th);
    gr.addColorStop(0, 'rgba(80,60,160,0)'); gr.addColorStop(.3, rgba('#6a58c8', .35 * at)); gr.addColorStop(.36, rgba('#b4a4ff', .62 * at)); gr.addColorStop(.5, rgba('#6a56c0', .28 * at)); gr.addColorStop(.75, rgba('#3a2c88', .08 * at)); gr.addColorStop(1, 'rgba(40,30,100,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, r + th, 0, TAU); ctx.arc(cx, cy, Math.max(1, r - th * .5), 0, TAU, true); ctx.fill('evenodd');
    ctx.strokeStyle = rgba('#d4c8ff', .32 * at); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(cx, cy, r + th * .04, 0, TAU); ctx.stroke();
  }
  if (o.props) for (const p of o.props) limbProp(ctx, t, m, p);
  return { cx, cy, r };
}
// storybook silhouettes standing on the limb (engraved: dark body, a fine rim of light on one side)
export function limbProp(ctx, t, m, p) {
  const R = EARTH.R, ang = Math.asin(clamp(p.x / R, -1, 1)), gx = p.x, gy = limbY(p.x) + 2;
  const X = m.X(gx), Y = m.Y(gy), s = (p.h ?? 40) * m.k * (p.grow ?? 1), a = p.a ?? 1;
  if (s < 1.5 || a <= 0 || X < -s * 3 || X > W + s * 3 || Y < -s * 3 || Y > H + s * 2) return;
  ctx.save(); ctx.translate(X, Y); ctx.rotate(ang); ctx.globalAlpha = a;
  const body = p.col || '#0d1030', rim = p.rim || 'rgba(190,180,255,.55)';
  ctx.fillStyle = body; ctx.strokeStyle = rim; ctx.lineWidth = Math.max(.8, s * .025); ctx.lineJoin = 'round';
  const kind = p.kind;
  if (kind === 'turbine') {
    ctx.beginPath(); ctx.moveTo(-s * .03, 0); ctx.lineTo(-s * .012, -s); ctx.lineTo(s * .012, -s); ctx.lineTo(s * .03, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    const rot = t * (p.speed ?? 1.1) + (p.seed || 0);
    ctx.save(); ctx.translate(0, -s); ctx.rotate(rot); for (let i = 0; i < 3; i++) { ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(-s * .018, 0); ctx.quadraticCurveTo(s * .06, -s * .24, s * .008, -s * .5); ctx.quadraticCurveTo(-s * .01, -s * .25, -s * .018, 0); ctx.fill(); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(0, 0, s * .028, 0, TAU); ctx.fill(); ctx.restore();
  } else if (kind === 'solar') {
    const n = p.n ?? 5, w = s * 1.1;
    for (let i = 0; i < n; i++) { const x = -n * w * .6 + i * w * 1.2; ctx.beginPath(); ctx.moveTo(x, -s * .05); ctx.lineTo(x + w * .1, -s * .38); ctx.lineTo(x + w, -s * .5); ctx.lineTo(x + w * .9, -s * .17); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.globalAlpha = a * .5; ctx.strokeStyle = 'rgba(160,190,255,.5)'; ctx.lineWidth = Math.max(.5, s * .01); for (let q = 1; q < 4; q++) { ctx.beginPath(); ctx.moveTo(x + w * .1 * (1 - q / 4) + w * .9 * q / 4 * 0 + w * q / 4 * .9, -s * .38 - (s * .12) * q / 4 + s * .21 * 0); ctx.lineTo(x + w * q / 4 * .9, -s * .05 - s * .12 * q / 4); ctx.stroke(); } ctx.restore();
      ctx.fillRect(x + w * .48, -s * .26, s * .03, s * .26); }
  } else if (kind === 'coin') {
    ctx.beginPath(); ctx.ellipse(0, -s * .5, s * .5, s * .5, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -s * .5, s * .4, s * .4, 0, 0, TAU); ctx.stroke();
    ctx.save(); ctx.lineWidth = Math.max(.6, s * .015); for (let i = 0; i < 40; i++) { const q = i / 40 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(q) * s * .44, -s * .5 + Math.sin(q) * s * .44); ctx.lineTo(Math.cos(q) * s * .49, -s * .5 + Math.sin(q) * s * .49); ctx.stroke(); } ctx.restore();
    ctx.font = `${Math.round(s * .42)}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.fillStyle = rim; ctx.globalAlpha = a * .7; ctx.fillText('$', 0, -s * .36);
  } else if (kind === 'parliament') {
    const w = s * 1.3;
    ctx.beginPath(); ctx.rect(-w / 2, -s * .34, w, s * .34); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(-w * .2, -s * .52, w * .4, s * .18); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -s * .52, w * .17, s * .3, 0, Math.PI, TAU); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * .82); ctx.lineTo(0, -s * .98); ctx.stroke();
    ctx.save(); ctx.lineWidth = Math.max(.6, s * .02); for (let i = 0; i < 9; i++) { const x = -w * .45 + i * w * .9 / 8; ctx.beginPath(); ctx.moveTo(x, -s * .3); ctx.lineTo(x, -s * .04); ctx.stroke(); } ctx.restore();
  } else if (kind === 'tower') {
    ctx.beginPath(); ctx.moveTo(-s * .18, 0); ctx.quadraticCurveTo(-s * .08, -s * .5, -s * .13, -s); ctx.lineTo(s * .13, -s); ctx.quadraticCurveTo(s * .08, -s * .5, s * .18, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (kind === 'tree') {
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * .2, -s * .35); ctx.lineTo(-s * .08, -s * .35); ctx.lineTo(-s * .16, -s * .7); ctx.lineTo(0, -s); ctx.lineTo(s * .16, -s * .7); ctx.lineTo(s * .08, -s * .35); ctx.lineTo(s * .2, -s * .35); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
// THE curve in the orbit world: a straight foot on the land left of the city S, then exponential up to the contact C
export function curveO(o = {}) {
  const S = o.S || CURVE.S, C = o.C || CURVE.C, k = o.k ?? 5.5, foot = o.foot ?? 510, n = o.n ?? 260, out = [];
  const nf = 30; for (let i = 0; i < nf; i++) { const q = i / nf; out.push([S[0] - foot * (1 - q), S[1], .35 + .65 * Math.pow(q, .7)]); }
  const den = Math.exp(k) - 1;
  for (let i = 0; i <= n; i++) { const s = i / n, e = (Math.exp(k * s) - 1) / den; out.push([S[0] + (C[0] - S[0]) * Math.pow(s, 1.0) - 18 * Math.sin(Math.PI * s) * e, S[1] + (C[1] - S[1]) * e, 1]); }
  return out;
}

// ================================================================ THE CURVE (the luminous filament)
const AMBER_L = [[44, .05, '#ff7a2c'], [18, .13, '#ff9a40'], [7, .42, F7.amber], [2.6, .9, '#ffd9a0'], [1.1, .85, '#fff8ea']];
const COOL_L = [[30, .04, '#8fc4ff'], [12, .1, F7.cool], [4.5, .34, '#d6eeff'], [1.8, .95, F7.coolCore]];
function ribbon(ctx, P, N, wl, wfn) {
  ctx.beginPath();
  for (let i = 0; i < P.length; i++) { const w = wl * wfn(i) / 2; i ? ctx.lineTo(P[i][0] + N[i][0] * w, P[i][1] + N[i][1] * w) : ctx.moveTo(P[i][0] + N[i][0] * w, P[i][1] + N[i][1] * w); }
  for (let i = P.length - 1; i >= 0; i--) { const w = wl * wfn(i) / 2; ctx.lineTo(P[i][0] - N[i][0] * w, P[i][1] - N[i][1] * w); }
  ctx.closePath(); ctx.fill();
}
export function curve(ctx, t, pts, o = {}) {
  if (!pts || pts.length < 2) return null;
  const cool = o.tone === 'cool', w = o.w ?? 1, br = o.br ?? 1, a = o.a ?? 1, seed = o.seed ?? 1;
  // arclength + cut at u
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = L[L.length - 1], cut = clamp(o.u ?? 1) * len, P = [];
  for (let i = 0; i < pts.length; i++) {
    if (L[i] <= cut) P.push(pts[i]);
    else { const q = (cut - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); P.push([mix(pts[i - 1][0], pts[i][0], q), mix(pts[i - 1][1], pts[i][1], q), mix(pts[i - 1][2] ?? 1, pts[i][2] ?? 1, q)]); break; }
  }
  if (P.length < 2) return null;
  const N = P.map((p, i) => { const a0 = P[Math.max(0, i - 1)], a1 = P[Math.min(P.length - 1, i + 1)], dx = a1[0] - a0[0], dy = a1[1] - a0[1], d = Math.hypot(dx, dy) || 1; return [-dy / d, dx / d]; });
  const tipI = P.length - 1, Lc = []; { let s = 0; Lc.push(0); for (let i = 1; i < P.length; i++) { s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); Lc.push(s); } }
  const lv = Lc[tipI], taper = (i) => { const d = lv - Lc[i]; return (P[i][2] ?? 1) * (o.tip === false ? 1 : clamp(.25 + d / 26)); };
  const breathe = 1 + .04 * Math.sin(t * 1.9 + seed) + .02 * Math.sin(t * 4.7 + seed * 2);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [wl, al, col] of cool ? COOL_L : AMBER_L) { ctx.fillStyle = rgba(col, clamp(al * br * a * breathe)); ribbon(ctx, P, N, wl * w * (wl > 10 ? Math.sqrt(br) : 1), taper); }
  // heat shimmer: two wavering thin edges and rising heat curls
  const sh = cool ? 0 : (o.shimmer ?? 1) * a;
  if (sh > 0) {
    ctx.lineWidth = 1; ctx.strokeStyle = rgba('#ffcf96', .16 * sh * br);
    for (const side of [-1, 1]) { ctx.beginPath(); for (let i = 0; i < P.length; i += 2) { const off = side * (7 * w + 3.2 * Math.sin(Lc[i] * .045 - t * 7 + side)) * taper(i); const X = P[i][0] + N[i][0] * off, Y = P[i][1] + N[i][1] * off; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
    const r = prng(seed * 31 + 7); ctx.lineWidth = .9;
    for (let i = 0; i < 26; i++) {
      const f = r(), life = 1.4 + r() * 1.2, u = ((t + r() * life) % life) / life, at = f * lv; let j = 0; while (j < tipI && Lc[j] < at) j++;
      const p = P[j], up = 10 + u * (34 + r() * 30) * w, X = p[0] + N[j][0] * up * (N[j][1] < 0 ? 1 : -1) * .4, Y = p[1] - up;
      ctx.strokeStyle = rgba('#ffd2a0', .13 * sh * Math.sin(Math.PI * u)); ctx.beginPath();
      for (let q = 0; q <= 6; q++) ctx[q ? 'lineTo' : 'moveTo'](X + Math.sin(q * 1.3 + t * 6 + i) * 2.4, Y - q * 3.2);
      ctx.stroke();
    }
  }
  // engraved ticks on the core
  if (o.ticks !== false) {
    ctx.strokeStyle = rgba(cool ? F7.coolCore : F7.amberCore, .22 * a * br); ctx.lineWidth = .8; ctx.beginPath();
    for (let s = 6, j = 0; s < lv - 6; s += 9) { while (j < tipI && Lc[j + 1] < s) j++; const q = (s - Lc[j]) / Math.max(1e-6, Lc[j + 1] - Lc[j]), X = mix(P[j][0], P[j + 1][0], q), Y = mix(P[j][1], P[j + 1][1], q), h = (2 + 1.5 * Math.sin(s * .07 + t)) * w * (P[j][2] ?? 1); ctx.moveTo(X - N[j][0] * h - N[j][1] * 1.5, Y - N[j][1] * h + N[j][0] * 1.5); ctx.lineTo(X + N[j][0] * h + N[j][1] * 1.5, Y + N[j][1] * h - N[j][0] * 1.5); }
    ctx.stroke();
  }
  // cool glint running along
  if (cool && (o.glint ?? 0) > 0) {
    const f = mod(t * .45 + seed * .3, 1), at = f * lv; let j = 0; while (j < tipI && Lc[j] < at) j++;
    const p = P[j]; glowAt(ctx, p[0], p[1], 26 * w, .7 * o.glint * a, F7.cool, '#ffffff');
  }
  const tip = P[tipI], ang = Math.atan2(tip[1] - P[Math.max(0, tipI - 3)][1], tip[0] - P[Math.max(0, tipI - 3)][0]);
  if (o.tip !== false && (o.tipA ?? 1) > 0) glowAt(ctx, tip[0], tip[1], 34 * w * Math.sqrt(br), .55 * a * br * breathe * (o.tipA ?? 1), cool ? F7.cool : F7.amber, cool ? F7.coolCore : F7.amberCore);
  // sparks shed at the tip (a steady trickle and/or a burst)
  if (!cool) sparks(ctx, t, tip, ang, { rate: o.sparks ?? 0, burst: o.burst, w, a, seed });
  ctx.restore();
  const at = (f) => { const s = clamp(f) * lv; let j = 0; while (j < tipI && Lc[j + 1] < s) j++; const q = (s - Lc[j]) / Math.max(1e-6, (Lc[j + 1] ?? Lc[j]) - Lc[j]), nx = P[Math.min(tipI, j + 1)]; return [mix(P[j][0], nx[0], q), mix(P[j][1], nx[1], q), Math.atan2(nx[1] - P[j][1], nx[0] - P[j][0])]; };
  return { tip, ang, len: lv, at, P };
}
function glowAt(ctx, x, y, r, a, col, core) {
  if (a <= 0 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(core, clamp(a))); g.addColorStop(.25, rgba(col, clamp(a * .5))); g.addColorStop(1, rgba(col, 0));
  const op = ctx.globalCompositeOperation; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.globalCompositeOperation = op;
}
export { glowAt };
function sparks(ctx, t, tip, ang, o) {
  const draw = (k, tb, life, sp, dir, sz) => {
    const age = t - tb; if (age < 0 || age > life) return;
    const vx = Math.cos(dir) * sp, vy = Math.sin(dir) * sp, x = tip[0] + vx * age, y = tip[1] + vy * age + 160 * age * age, u = age / life;
    const x2 = x - vx * .03, y2 = y - (vy + 320 * age) * .03;
    ctx.strokeStyle = rgba(u < .4 ? '#fff1d6' : '#ffb35c', (1 - u) * .9 * o.a); ctx.lineWidth = sz * (1 - u * .5); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x, y); ctx.stroke();
  };
  ctx.lineCap = 'round';
  if (o.rate > 0) {
    const per = 1 / o.rate, n0 = Math.floor((t - 1.4) / per), n1 = Math.floor(t / per);
    for (let k = n0; k <= n1; k++) { const h1 = hash(k * 1.7 + o.seed), h2 = hash(k * 3.1 + o.seed), h3 = hash(k * 5.3 + o.seed); draw(k, k * per + h1 * per, .6 + h2 * .8, 60 + h3 * 120, ang + (h1 - .5) * 2.4 - .3, 1.1 * o.w); }
  }
  if (o.burst != null) for (let k = 0; k < 34; k++) { const h1 = hash(k * 2.9 + 11), h2 = hash(k * 4.7 + 3), h3 = hash(k * 7.1 + 5); draw(k, o.burst + h1 * .12, .5 + h2 * .9, 140 + h3 * 280, ang + (h1 - .5) * 3.4, 1.5 * o.w); }
}

// ================================================================ THE DOME (glass; reveals itself only at contact; never cracks)
const v3 = { add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], norm: (a) => { const d = Math.hypot(...a) || 1; return [a[0] / d, a[1] / d, a[2] / d]; } };
export function domeFrame(contact, R = EARTH.RD) {
  const n = onSphere(contact[0], contact[1], R) || [0, 1, 0], u = v3.norm(v3.cross(n, [0, 0, 1])), v = v3.norm(v3.cross(n, u));
  // geodesic point at angular distance al in direction be (be 0 = along u), world coords + front flag
  return (al, be) => { const d = v3.add(v3.mul(n, Math.cos(al)), v3.add(v3.mul(u, Math.sin(al) * Math.cos(be)), v3.mul(v, Math.sin(al) * Math.sin(be)))); return [d[0] * R, -d[1] * R, d[2]]; };
}
export function dome(ctx, t, cam, o = {}) {
  const m = camO(cam), R = o.R ?? EARTH.RD, cx = m.X(0), cy = m.Y(0), r = R * m.k, C = o.contact || CURVE.C, Cs = [m.X(C[0]), m.Y(C[1])];
  const touch = o.touch ?? 0, reveal = clamp(o.reveal ?? 0), lines = clamp(o.lines ?? 0), warm = o.warm ?? 0, glass = o.glass ?? 1, flare = o.flare ?? 0;
  const G = domeFrame(C, R), P = (al, be) => { const p = G(al, be); return [m.X(p[0]), m.Y(p[1]), p[2]]; };
  ctx.save();
  const thC = Math.atan2(Cs[1] - cy, Cs[0] - cx), ext = reveal * Math.PI, win = Math.min(Math.PI, .03 + .07 * touch + ext + .4 * flare);
  const sector = (r0, r1) => { ctx.beginPath(); if (win >= Math.PI - 1e-3) { ctx.arc(cx, cy, r1, 0, TAU); ctx.arc(cx, cy, r0, 0, TAU, true); } else { ctx.arc(cx, cy, r1, thC - win, thC + win); ctx.arc(cx, cy, r0, thC + win, thC - win, true); ctx.closePath(); } };
  // refracted stars in a thin band inside the rim (the glass bends the sky outward): only where the rim light has run (soft-edged)
  const vis = clamp(Math.max(reveal * 1.4, flare));
  if (vis > .02 && o.skyO && r > 200) {
    const th = Math.min(.05, 70 / r);
    for (const [grow, al] of [[0, .45], [.05, .3], [.12, .25]]) {
      const w0 = Math.min(Math.PI, win + grow); if (w0 <= 0) continue;
      ctx.save(); ctx.beginPath(); if (w0 >= Math.PI - 1e-3) { ctx.arc(cx, cy, r, 0, TAU); ctx.arc(cx, cy, r * (1 - th), 0, TAU, true); } else { ctx.arc(cx, cy, r, thC - w0, thC + w0); ctx.arc(cx, cy, r * (1 - th), thC + w0, thC - w0, true); ctx.closePath(); }
      ctx.clip('evenodd'); ctx.globalAlpha = al * vis; ctx.translate(cx, cy); ctx.scale(1.035, 1.035); ctx.translate(-cx, -cy);
      sky(ctx, t, { ...o.skyO, only: 'stars', a: .95, band: 0 }); ctx.restore();
    }
  }
  // the glass body: a faint fresnel band inside the rim, its strength following the same profile as the rim light (conic)
  const fres = (ang) => { const dd = Math.abs(mod(ang - thC + Math.PI, TAU) - Math.PI); return clamp((dd < ext ? .7 : 0) + .9 * touch * Math.exp(-dd * dd / .006) + flare * .5 + .08 * glass + .3 * warm); };
  if (r > 30) {
    const fb = Math.max(18, Math.min(r * .05, 120));
    for (const [f0, f1, k] of [[1, .6, .22], [.6, .3, .45], [.3, .1, .75], [.1, 0, 1]]) {
      const cg = ctx.createConicGradient(0, cx, cy); for (let i = 0; i <= 90; i++) cg.addColorStop(i / 90, rgba(F7.rim, .13 * k * fres(i / 90 * TAU - Math.PI / 2)));
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, r - fb * f1, 0, TAU); ctx.arc(cx, cy, r - fb * f0, 0, TAU, true); ctx.fill('evenodd');
    }
  }
  // inner warm glow (heat caught under the glass)
  if (warm > 0) {
    const gw = ctx.createRadialGradient(cx, cy, r * .82, cx, cy, r); gw.addColorStop(0, 'rgba(255,150,80,0)'); gw.addColorStop(.75, rgba('#ff9a50', .08 * warm)); gw.addColorStop(1, rgba('#ffc890', .2 * warm));
    ctx.fillStyle = gw; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.arc(cx, cy, r * .82, 0, TAU, true); ctx.fill('evenodd');
  }
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'butt';
  // the rim light: runs from the contact along the whole edge (reveal), then stays softly lit (one stroke, conic alpha profile)
  if (r > 30) {
    const A = (ang) => { const dd = Math.abs(mod(ang - thC + Math.PI, TAU) - Math.PI); let v = 0;
      if (dd < ext) { const front = reveal < 1 ? Math.max(0, 1 - (ext - dd) / .22) : 0; v += (.4 + .6 * front) * (1 - .4 * dd / Math.PI); }
      return v + flare * .6 * (1 - .3 * dd / Math.PI) + touch * 1.1 * Math.exp(-dd * dd / .004) + .02 * glass; };
    const prof = []; for (let i = 0; i <= 120; i++) { const ang = i / 120 * TAU - Math.PI / 2; prof.push(A(ang)); }
    for (const [lw, al, col] of [[Math.max(10, Math.min(40, r * .012)), .07, F7.rim], [3.4, .22, F7.rim], [1.3, .85, '#ffffff']]) {
      const cg = ctx.createConicGradient(0, cx, cy); prof.forEach((v, i) => cg.addColorStop(i / 120, rgba(col, clamp(al * v * 2.2))));
      ctx.strokeStyle = cg; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    }
    if (reveal > 0 && reveal < 1) for (const sgn of [-1, 1]) { const q = thC + sgn * ext; glowAt(ctx, cx + Math.cos(q) * r, cy + Math.sin(q) * r, 46, .8, F7.rim, '#ffffff'); }
  }
  // lines of light spreading from the contact over the glass (geodesic rings + meridians; light, never cracks)
  if (lines > 0) {
    const amax = 1.25, front = lines * amax, LA = (o.linesA ?? 1);
    ctx.lineWidth = 1.1;
    for (let j = 1; j <= 26; j++) {
      const al = j * .045; if (al > front + .02) break;
      const fade = Math.exp(-al * 1.6) * LA, near = Math.max(0, 1 - Math.abs(front - al) / .06);
      const A = clamp((.12 + .5 * near) * fade); if (A < .01) continue;
      ctx.beginPath(); let on = false;
      for (let q = 0; q <= 96; q++) { const p = P(al, q / 96 * TAU); if (p[2] < -.02) { on = false; continue; } on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; }
      ctx.strokeStyle = rgba(F7.rim, A); ctx.stroke();
    }
    for (let k = 0; k < 16; k++) {
      const be = k / 16 * TAU + .1; ctx.beginPath(); let on = false;
      for (let q = 1; q <= 40; q++) { const al = q / 40 * Math.min(front, amax); const p = P(al, be); if (p[2] < -.02) { on = false; continue; } on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; }
      ctx.strokeStyle = rgba(F7.rim, .16 * LA); ctx.stroke();
    }
  }
  // the contact: a ring of refracted light (chromatic), heat haze, a soft bloom
  if (touch > 0) {
    const br = touch * (1 + .06 * Math.sin(t * 3.1));
    for (const [al, col, A] of [[.006, '#ffd9a8', .7], [.0068, '#cfe6ff', .55], [.012, '#ffffff', .35], [.019, '#cfe6ff', .22], [.028, '#cfe6ff', .12]]) {
      ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(col, A * br); ctx.beginPath(); let on = false;
      for (let q = 0; q <= 64; q++) { const p = P(al * (1 + .04 * Math.sin(t * 2 + q)), q / 64 * TAU); on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; }
      ctx.closePath(); ctx.stroke();
    }
    glowAt(ctx, Cs[0], Cs[1], 70 * Math.max(.6, Math.min(2, m.k * 1.2)), .5 * br, F7.amber, F7.amberCore);
    glowAt(ctx, Cs[0], Cs[1], 160 * Math.max(.6, Math.min(2, m.k)), .12 * br, F7.rim, '#ffffff');
  }
  // sparks sliding down the glass like rain on a window
  if (o.sparks) {
    ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    for (let i = 0; i < o.sparks.length; i++) {
      const t0 = o.sparks[i], age = t - t0; if (age < 0 || age > 5) continue;
      const al = .01 + .05 * age * age + .02 * age, u = age / 5;
      const sgn = hash(i * 1.3) < .5 ? 1 : -1, b2 = Math.PI / 2 + sgn * (.25 + .9 * hash(i * 2.2));
      const p = P(al, b2), p2 = P(Math.max(.004, al - .02 - .02 * age), b2); if (p[2] < -.05) continue;
      const A = (1 - u) * (1 - u);
      ctx.strokeStyle = rgba(u < .3 ? '#fff1d6' : '#ffb35c', .9 * A); ctx.beginPath(); ctx.moveTo(p2[0], p2[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
      glowAt(ctx, p[0], p[1], 9, .5 * A, F7.amber, F7.amberCore);
    }
  }
  ctx.restore();
  return { cx, cy, r, P, contact: Cs };
}

// ================================================================ THE RING (enough, inside the limits)
export function ring(ctx, t, o = {}) {
  const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, r = o.r ?? 400, w = o.w ?? 40, sy = o.sy ?? 1, a = o.a ?? 1, from = o.from ?? 0, to = o.to ?? TAU;
  if (a <= 0) return;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(1, sy); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(0, 0, r - 3, 0, 0, r + w);
  g.addColorStop(0, rgba('#ffe2a8', 0)); g.addColorStop(.04, rgba('#fff1d6', .75 * a)); g.addColorStop(.12, rgba('#ffcf8a', .42 * a)); g.addColorStop(.45, rgba(F7.amber, .14 * a)); g.addColorStop(.85, rgba('#e9a0a8', .05 * a)); g.addColorStop(1, 'rgba(200,140,160,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r + w, from, to); ctx.arc(0, 0, r - 3, to, from, true); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 1.2 / Math.max(.3, sy); ctx.strokeStyle = rgba('#fff6e0', .6 * a); ctx.beginPath(); ctx.arc(0, 0, r, from, to); ctx.stroke();
  ctx.strokeStyle = rgba('#f1d9a8', .16 * a); ctx.beginPath(); ctx.arc(0, 0, r + w * .92, from, to); ctx.stroke();
  // sparkles drifting along the band
  const rr = prng(o.seed ?? 5);
  for (let i = 0; i < 120; i++) {
    const q = rr() * TAU + t * (.02 + .03 * rr()), rad = r + w * (.05 + .5 * rr() * rr()); if (from !== 0 || to !== TAU) { const qq = mod(q, TAU); if (qq < from || qq > to) continue; }
    const tw = .5 + .5 * Math.sin(t * (1 + rr() * 2) + i); ctx.fillStyle = rgba('#fff1d6', .5 * tw * a); ctx.fillRect(Math.cos(q) * rad, Math.sin(q) * rad, 1.6, 1.6 / Math.max(.3, sy));
  }
  ctx.restore();
  if ((o.line ?? 0) > 0) { const pts = []; for (let i = 0; i <= 200; i++) { const q = from + (to - from) * i / 200; pts.push([cx + Math.cos(q) * (r + w * .35), cy + Math.sin(q) * (r + w * .35) * sy]); } curve(ctx, t, pts, { u: o.line, w: .7, br: .8, sparks: 0, tip: o.line < 1, shimmer: .4 }); }
}

// ================================================================ THE CARDS (I–IV)
const ROMAN = ['', 'I', 'II', 'III', 'IV'];
const CW = 250, CH = 350, CS = 2;   // card size at s = 1; faces are cached at 2× (500×700)
function deckle(g, w, h, seed) {
  const r = prng(seed), pts = [], step = 10;
  const edge = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(L / step); for (let i = 0; i < n; i++) { const q = i / n, j = (r() - .5) * 2.2; pts.push([mix(x0, x1, q) + (y1 - y0) / L * j, mix(y0, y1, q) - (x1 - x0) / L * j]); } };
  const c = 14; edge(c, 0, w - c, 0); pts.push([w - c * .3, c * .3]); edge(w, c, w, h - c); pts.push([w - c * .3, h - c * .3]); edge(w - c, h, c, h); pts.push([c * .3, h - c * .3]); edge(0, h - c, 0, c); pts.push([c * .3, c * .3]);
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
}
function paperFill(g, w, h, seed) {
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f6f0e0'); gr.addColorStop(1, '#e6dbc2'); g.fillStyle = gr; g.fill();
  g.save(); g.clip(); const r = prng(seed); g.lineCap = 'round';
  for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h, L = 4 + r() * 18, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(120,95,60,${.05 + .07 * r()})` : `rgba(255,252,240,${.15 + .2 * r()})`; g.lineWidth = .6 + r() * .6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a0) * L, y + Math.sin(a0) * L); g.stroke(); }
  const v = g.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, h * .75); v.addColorStop(0, 'rgba(120,90,50,0)'); v.addColorStop(1, 'rgba(120,90,50,.16)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
  g.restore();
}
function wrapText(g, s, maxW) { const words = s.split(' '), lines = []; let cur = ''; for (const wd of words) { const nx = cur ? cur + ' ' + wd : wd; if (cur && g.measureText(nx).width > maxW) { lines.push(cur); cur = wd; } else cur = nx; } if (cur) lines.push(cur); return lines; }
function buildFace(o, side) {
  const w = CW * CS, h = CH * CS, [c, g] = canvas(w, h), seed = 300 + (o.num || 1) * 17 + (side === 'back' ? 5 : 0);
  deckle(g, w, h, seed); paperFill(g, w, h, seed);
  g.save(); deckle(g, w, h, seed); g.clip();
  const ink = F7.ink;
  g.strokeStyle = rgba(ink, .85); g.lineWidth = 3; g.strokeRect(34, 34, w - 68, h - 68); g.lineWidth = 1.2; g.strokeRect(46, 46, w - 92, h - 92);
  if (side === 'front') {
    text(g, ROMAN[o.num || 1], 74, 150, { size: 92, font: 'Instrument Serif', color: ink });
    g.strokeStyle = rgba(ink, .5); g.lineWidth = 1.2; g.beginPath(); g.moveTo(74, 182); g.lineTo(w - 74, 182); g.stroke();
    if (o.q) { g.font = '52px "Instrument Serif"'; const ls = wrapText(g, o.q, w - 150); ls.forEach((ln, i) => text(g, ln, w / 2, h * .5 - (ls.length - 1) * 31 + i * 62 + 18, { size: 52, font: 'Instrument Serif', color: ink, align: 'center' })); }
    text(g, `QUESTION ${ROMAN[o.num || 1]}`, w / 2, h - 84, { size: 20, weight: 600, color: rgba(ink, .7), align: 'center', spacing: 6 });
  } else {
    // engraved guilloche border and a medallion with the numeral
    g.strokeStyle = rgba(ink, .32); g.lineWidth = 1;
    for (let k = 0; k < 9; k++) { g.beginPath(); for (let i = 0; i <= 400; i++) { const q = i / 400 * TAU, rr = 150 + k * 4 + 14 * Math.sin(q * 14 + k * .7); const x = w / 2 + rr * Math.cos(q) * .92, y = h * (o.answer ? .38 : .5) + rr * Math.sin(q) * 1.18; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    for (let i = 0; i < 64; i++) { const x = 64 + (w - 128) * i / 63; g.beginPath(); g.moveTo(x, 58 + 6 * Math.sin(i * .9)); g.lineTo(x + 6, 70); g.stroke(); g.beginPath(); g.moveTo(x, h - 58 - 6 * Math.sin(i * .9)); g.lineTo(x + 6, h - 70); g.stroke(); }
    if (o.answer) {
      const ix = 90, iy = 120, iw = w - 180, ih = 300; g.save(); g.beginPath(); g.rect(ix, iy, iw, ih); g.clip(); g.fillStyle = '#efe6cf'; g.fillRect(ix, iy, iw, ih); if (o.answer.img) { g.translate(ix, iy); o.answer.img(g, iw, ih); } g.restore();
      g.strokeStyle = rgba(ink, .7); g.lineWidth = 1.5; g.strokeRect(ix, iy, iw, ih);
      text(g, String(o.answer.word || '').toUpperCase(), w / 2, h - 150, { size: 44, weight: 600, color: ink, align: 'center', spacing: 8 });
      text(g, ROMAN[o.num || 1], w / 2, h - 84, { size: 40, font: 'Instrument Serif', color: rgba(ink, .8), align: 'center' });
    } else {
      g.fillStyle = '#efe5cb'; g.beginPath(); g.ellipse(w / 2, h / 2, 92, 108, 0, 0, TAU); g.fill(); g.strokeStyle = rgba(ink, .75); g.lineWidth = 2.4; g.stroke(); g.lineWidth = 1; g.beginPath(); g.ellipse(w / 2, h / 2, 80, 96, 0, 0, TAU); g.stroke();
      text(g, ROMAN[o.num || 1], w / 2, h / 2 + 34, { size: 104, font: 'Instrument Serif', color: ink, align: 'center' });
    }
  }
  g.restore();
  return c;
}
const faceKey = (o, side) => `card:${side}:${o.num}:${o.q || ''}:${o.answer ? o.answer.word : ''}`;
const faceOf = (o, side) => IMG.get(faceKey(o, side)) || built(faceKey(o, side), () => buildFace(o, side));
export async function cardPrepare(list) { for (const o of list) for (const side of ['front', 'back']) { const k = faceKey(o, side); if (!IMG.has(k)) { const c = built(k, () => buildFace(o, side)); IMG.set(k, await loadImage(c.toBuffer('image/png'))); CAN.delete(k); } } }
function stampOn(ctx, s, u, txt) {
  if (u <= 0) return;
  const k = 1 + .5 * (1 - ease.out(u)), a = clamp(u * 3);
  ctx.save(); ctx.rotate(-.2); ctx.scale(k, k); ctx.globalAlpha = a * .88;
  ctx.font = `600 ${Math.round(30 * s)}px "Inter"`; try { ctx.letterSpacing = `${3 * s}px`; } catch { }
  const tw = ctx.measureText(txt).width + 30 * s;
  ctx.strokeStyle = F7.stamp; ctx.lineWidth = 3.2 * s; ctx.strokeRect(-tw / 2, -28 * s, tw, 56 * s); ctx.lineWidth = 1.2 * s; ctx.strokeRect(-tw / 2 + 6 * s, -22 * s, tw - 12 * s, 44 * s);
  ctx.fillStyle = F7.stamp; ctx.textAlign = 'center'; ctx.fillText(txt, 0, 11 * s);
  ctx.restore();
}
export function card(ctx, t, o = {}) {
  const s = o.s ?? 1, a = o.a ?? 1; if (a <= 0 || s <= 0) return null;
  const phi = clamp(o.flip ?? 0) * Math.PI, cs = Math.cos(phi), side0 = o.side || 'front', side = cs >= 0 ? side0 : (side0 === 'front' ? 'back' : 'front');
  const lift = o.lift ?? 0, tilt = o.tilt ?? 0, x = o.x ?? W / 2, y = o.y ?? H / 2, rot = o.rot ?? 0;
  const w = CW * s, h = CH * s;
  ctx.save(); ctx.globalAlpha = a;
  // soft shadow on the ground under the card
  if (o.shadow !== false) {
    ctx.save(); ctx.translate(x + lift * 26 * s, y + lift * 34 * s); ctx.rotate(rot); ctx.scale(Math.max(.15, Math.abs(cs)), 1 - tilt * .55);
    ctx.fillStyle = `rgba(4,4,12,${.35 * (1 - lift * .4) * a})`; ctx.filter = `blur(${Math.round(6 + lift * 14)}px)`; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.filter = 'none'; ctx.restore();
  }
  ctx.translate(x, y - lift * 30 * s); ctx.rotate(rot); ctx.scale(1, 1 - tilt * .55);
  ctx.transform(cs, Math.sin(phi) * .12 * (cs >= 0 ? 1 : -1), 0, 1, 0, 0);
  if (cs < 0) ctx.scale(-1, 1);
  ctx.drawImage(faceOf(o, side), -w / 2, -h / 2, w, h);
  // light: a warm rim along the edge facing the light, a sheen that moves with the turn
  if (o.light) {
    ctx.globalCompositeOperation = 'lighter';
    const gl = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gl.addColorStop(0, `rgba(255,190,120,${.0})`); gl.addColorStop(.5 + .4 * Math.sin(phi), `rgba(255,220,170,${.12 * a})`); gl.addColorStop(1, 'rgba(255,190,120,0)');
    ctx.fillStyle = gl; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }
  if (side === 'front' && o.stamp) { ctx.save(); ctx.translate(0, h * .2); stampOn(ctx, s, o.stampU ?? 1, o.stamp); ctx.restore(); }
  ctx.restore();
  return { x, y, w, h };
}

// ================================================================ fly into / out of a light
export function lightCover(ctx, t, k, o = {}) {
  if (k <= 0) return;
  const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, kk = clamp(k), br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  const R = mix(60, 2400, Math.pow(kk, 1.3)), g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  g.addColorStop(0, rgba('#fff1d6', clamp(.5 + .5 * kk))); g.addColorStop(.3, rgba('#ffc878', clamp(.25 + .5 * kk))); g.addColorStop(1, rgba('#f2a258', 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // the light itself (identical for every caller at the same t): it takes over the frame as k → 1
  const A = sm(lin(.5, 1, kk));
  if (A > 0) {
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = A;
    const p = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 1250 * br); p.addColorStop(0, '#fff1d6'); p.addColorStop(.45, '#ffd08e'); p.addColorStop(1, '#f2a258');
    ctx.fillStyle = p; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}
