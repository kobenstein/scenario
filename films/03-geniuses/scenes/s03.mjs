// 03 · The oldest limit (1:37–2:26): zoom out to the whole planet; more people meant more ideas; ideas get harder to find;
// the genius limit disappears. Carrier chain: fog → clouds → globe → a light → sparks → two islands → a spark → candle flames
//   → helmet lamp in a mine → a chunk of rock = a chip → the chip staircase → its crowd → hourglass → the free stream → the staircase
//   into the sky → a country of light (ends centred at 960,540 for s04).
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, back, prng, addGlow, glow, text, canvas } from '../engine.mjs';
import { P, fogBand, cone, person, finish, shade, mixHex } from '../lib/world.mjs';
import { source } from '../lib/kit.mjs';
import { figure } from './s02.mjs';

const cache = new Map(); const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };
const D2R = Math.PI / 180;

// ================= the globe =================
const LAND = [
  // Africa
  [[-17, 21], [-10, 30], [-5, 36], [10, 37], [20, 32], [32, 31], [35, 28], [43, 12], [51, 11], [42, -2], [40, -15], [35, -25], [20, -35], [17, -29], [12, -17], [13, -5], [9, 4], [-8, 5], [-15, 10]],
  // Eurasia
  [[-10, 36], [-9, 43], [-2, 48], [-5, 58], [5, 62], [15, 69], [30, 71], [60, 70], [80, 73], [110, 77], [140, 72], [170, 68], [180, 66], [160, 60], [142, 52], [135, 43], [122, 40], [121, 31], [110, 20], [105, 10], [100, 13], [97, 17], [92, 22], [80, 15], [77, 8], [72, 20], [66, 25], [57, 25], [56, 24], [59, 22], [52, 16], [43, 13], [35, 28], [35, 36], [27, 37], [24, 40], [15, 40], [12, 44], [8, 44], [3, 43], [-4, 36]],
  // Arabia
  [[35, 28], [43, 13], [52, 16], [59, 22], [56, 26], [48, 30], [38, 33]],
  // North America
  [[-168, 66], [-140, 70], [-95, 72], [-80, 73], [-62, 60], [-55, 50], [-66, 44], [-76, 35], [-81, 25], [-90, 30], [-97, 26], [-97, 20], [-90, 16], [-83, 9], [-80, 8], [-92, 15], [-105, 20], [-112, 30], [-118, 34], [-124, 42], [-124, 49], [-135, 58], [-150, 60], [-165, 62]],
  [[-50, 60], [-42, 60], [-20, 70], [-20, 80], [-60, 82], [-70, 76], [-55, 68]],
  // South America
  [[-80, 8], [-60, 10], [-50, 0], [-35, -6], [-40, -22], [-48, -28], [-58, -38], [-65, -42], [-68, -55], [-75, -50], [-73, -38], [-71, -18], [-81, -5], [-78, 2]],
  // Australia, Madagascar, Britain, Japan, India-ish SE Asia islands
  [[114, -22], [122, -18], [131, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [141, -38], [131, -31], [115, -34]],
  [[44, -25], [47, -25], [50, -15], [49, -12], [44, -16]],
  [[-5, 50], [1, 51], [-1, 55], [-3, 58], [-6, 56]],
  [[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [139, 40], [133, 34]],
  [[95, 5], [105, -6], [115, -8], [120, -9], [110, -3], [100, 2]],
];
function inPoly(lon, lat, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)) c = !c; } return c; }
// people lights: points on land; d = how far (0..1) from East Africa, for the spread out of Africa
const LIGHTS = once('lights', () => {
  const r = prng(2024), a = [];
  while (a.length < 1700) { const lon = r() * 360 - 180, lat = r() * 140 - 60; if (!LAND.some((p) => inPoly(lon, lat, p))) continue;
    const p1 = lat * D2R, p2 = 0, dl = (lon - 36) * D2R, d = Math.acos(Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(dl)) / Math.PI;
    a.push({ lon, lat, d: Math.pow(d, .8), m: r(), ph: r() * 7 }); }
  return a;
});
function proj(lon, lat, g) {
  const l = (lon - g.lon0) * D2R, p = lat * D2R, p0 = g.lat0 * D2R;
  const x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l), z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  return [g.cx + x * g.R, g.cy - y * g.R, z];
}
// g = {cx, cy, R, lon0, lat0}; spread 0..1 (which lights are on); opts.sparks
function globe(ctx, t, g, { spread = 0, lightA = 1, sparkRate = 0, landCol = '#26357e' } = {}) {
  // atmosphere halo
  addGlow(ctx, g.cx, g.cy, g.R * 1.25, .35, '#3a7fd0', '#8fe6ff');
  const oc = ctx.createRadialGradient(g.cx - g.R * .35, g.cy - g.R * .35, g.R * .1, g.cx, g.cy, g.R); oc.addColorStop(0, '#1d2c78'); oc.addColorStop(1, '#0a1240');
  ctx.fillStyle = oc; ctx.beginPath(); ctx.arc(g.cx, g.cy, g.R, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(g.cx, g.cy, g.R, 0, 7); ctx.clip();
  for (const poly of LAND) {
    const pts = poly.map(([lo, la]) => proj(lo, la, g)); if (pts.every((p) => p[2] < 0)) continue;
    ctx.beginPath(); pts.forEach(([x, y, z], i) => { if (z < 0) { const dx = x - g.cx, dy = y - g.cy, k = g.R / (Math.hypot(dx, dy) || 1); x = g.cx + dx * k; y = g.cy + dy * k; } i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
    ctx.fillStyle = landCol; ctx.fill(); ctx.strokeStyle = 'rgba(143,230,255,.18)'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  // graticule
  ctx.strokeStyle = 'rgba(143,230,255,.05)'; ctx.lineWidth = 1;
  for (let lo = -180; lo < 180; lo += 30) { ctx.beginPath(); let on = false; for (let la = -80; la <= 80; la += 5) { const [x, y, z] = proj(lo, la, g); if (z < 0) { on = false; continue; } on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; } ctx.stroke(); }
  // terminator shading + rim light
  const sh = ctx.createLinearGradient(g.cx - g.R, g.cy - g.R, g.cx + g.R, g.cy + g.R); sh.addColorStop(0, 'rgba(255,255,255,.04)'); sh.addColorStop(.6, 'rgba(4,5,18,0)'); sh.addColorStop(1, 'rgba(4,5,18,.55)'); ctx.fillStyle = sh; ctx.fillRect(g.cx - g.R, g.cy - g.R, g.R * 2, g.R * 2);
  // people lights
  if (spread > 0) for (const L of LIGHTS) {
    const on = clamp((spread - L.d) * 14); if (on <= 0) continue; const [x, y, z] = proj(L.lon, L.lat, g); if (z < .05) continue;
    const tw = .7 + .3 * Math.sin(t * (1.3 + L.m * 2) + L.ph), rr = Math.max(1.2, g.R / 220) * (.8 + L.m);
    ctx.fillStyle = rgba(L.m > .85 ? '#ffd29a' : '#ffe8c0', on * tw * lightA * z); ctx.fillRect(x - rr / 2, y - rr / 2, rr, rr);
    if (L.m > .93) addGlow(ctx, x, y, rr * 6, .4 * on * z * lightA, P.amber, '#fff3dd');
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(143,230,255,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(g.cx, g.cy, g.R, -2.6, -.6); ctx.stroke();
}
function stars(ctx, t, n = 260, seed = 8) { const r = prng(seed); for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H, a = (.2 + .6 * r()) * (.7 + .3 * Math.sin(t * (1 + r() * 2) + i)); ctx.fillStyle = rgba(C.cream, a); ctx.fillRect(x, y, r() < .1 ? 2.5 : 1.5, r() < .1 ? 2.5 : 1.5); } }
function space(ctx, t) { const g = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * .8); g.addColorStop(0, '#0e1236'); g.addColorStop(1, '#04050f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); stars(ctx, t); }

// tiny invention icons that pop where people gather
function icon(ctx, kind, x, y, s, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#fff3dd'; ctx.fillStyle = '#ffd27a'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  if (kind === 0) { ctx.beginPath(); ctx.moveTo(0, -16); ctx.quadraticCurveTo(10, -4, 6, 6); ctx.quadraticCurveTo(0, 12, -6, 6); ctx.quadraticCurveTo(-10, -4, 0, -16); ctx.fill(); ctx.beginPath(); ctx.moveTo(-10, 12); ctx.lineTo(10, 8); ctx.moveTo(-10, 8); ctx.lineTo(10, 12); ctx.stroke(); }
  else if (kind === 1) { ctx.beginPath(); ctx.arc(0, 0, 12, 0, 7); ctx.stroke(); for (let k = 0; k < 6; k++) { const q = k / 6 * 6.283; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(q) * 12, Math.sin(q) * 12); ctx.stroke(); } }
  else if (kind === 2) { ctx.beginPath(); ctx.moveTo(-14, -10); ctx.lineTo(4, 4); ctx.lineTo(14, 4); ctx.moveTo(4, 4); ctx.lineTo(-2, 12); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(-10, 10); ctx.lineTo(0, -12); ctx.lineTo(10, 10); ctx.closePath(); ctx.stroke(); }
  ctx.restore(); addGlow(ctx, x, y, 30 * s, .5 * a, P.amber, '#fff3dd');
}
function spark(ctx, x, y, t0, t, s = 1) { const u = (t - t0) / .7; if (u < 0 || u > 1) return; const r = prng(Math.floor(t0 * 100)); addGlow(ctx, x, y, 60 * s * (1 - u * .5), .9 * (1 - u), P.amber, '#ffffff'); for (let i = 0; i < 8; i++) { const a = r() * 6.283, d = (20 + r() * 40) * s * eout(u); ctx.fillStyle = rgba('#fff3dd', 1 - u); ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d - 10 * u * u * s, 2.5, 2.5); } }

// ================= 22: the camera rises out of the fog, through clouds, until the whole planet hangs below =================
const AF = { lon0: 22, lat0: 6 };
// a night cloud sprite: soft navy body, moonlit upper rim (lit layer drawn first, body shifted down over it)
function cloudSprite(seed) {
  return once('cloud' + seed, () => {
    const [c, x] = canvas(900, 380), r = prng(seed), puffs = [];
    for (let i = 0; i < 16; i++) { const u = i / 15; puffs.push([90 + u * 720 + (r() - .5) * 60, 250 - Math.sin(u * Math.PI) * (70 + r() * 80) + (r() - .5) * 30, 50 + Math.sin(u * Math.PI) * 70 + r() * 40]); }
    x.filter = 'blur(5px)';
    x.fillStyle = '#b9cdf2'; for (const [px, py, pr] of puffs) { x.beginPath(); x.arc(px, py, pr, 0, 7); x.fill(); }
    x.filter = 'blur(9px)';
    const g = x.createLinearGradient(0, 80, 0, 360); g.addColorStop(0, '#34407f'); g.addColorStop(1, '#141a48');
    x.fillStyle = g; for (const [px, py, pr] of puffs) { x.beginPath(); x.arc(px + 6, py + 12, pr * .97, 0, 7); x.fill(); }
    x.fillRect(80, 250, 740, 90);
    return c;
  });
}
const riseOut = (T) => {
  const t0 = T.S('03a', 'To see'), tZoom = T.S('03a', 'zoom out'), tAll = T.S('03a', 'All the way');
  const r = prng(31), clouds = Array.from({ length: 30 }, (_, i) => ({ layer: i % 3, x: r() * (W + 600) - 300, y: r() * H * 2.2 - H * .6, seed: 1 + (i % 6), s: .7 + r() * .6, flip: r() < .5 }));
  return (ctx, t, s) => {
    const uC = eio(lin(s.a, tZoom + .5, t)), uG = eio(lin(tZoom - .3, tAll + 1.0, t)), rise = t - s.a;
    space(ctx, t);
    // moon, upper right, lighting the cloud rims
    addGlow(ctx, 1560, 170, 260, .35 * (1 - uG * .5), '#9fb8ff', '#f3f6ff');
    ctx.fillStyle = rgba('#eef2ff', .9); ctx.beginPath(); ctx.arc(1560, 170, 26, 0, 7); ctx.fill();
    // the globe, huge at first (only a curved horizon), shrinking to a whole planet, with a glowing atmosphere band
    const R = mix(2600, 360, uG), cy = mix(H + R - 260, 540, uG);
    const at = ctx.createRadialGradient(960, cy, R * .96, 960, cy, R * 1.12); at.addColorStop(0, rgba('#8fe6ff', .0)); at.addColorStop(.25, rgba('#8fe6ff', .45)); at.addColorStop(.5, rgba('#3a7fd0', .25)); at.addColorStop(1, rgba('#3a7fd0', 0));
    ctx.fillStyle = at; ctx.beginPath(); ctx.arc(960, cy, R * 1.12, 0, 7); ctx.fill();
    globe(ctx, t, { cx: 960, cy, R, lon0: AF.lon0 + (t - s.a) * 1.2, lat0: AF.lat0 });
    ctx.strokeStyle = rgba('#bff3ff', .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(960, cy, R * 1.004, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    // cloud layers stream downward past the camera as it climbs (parallax: near layers faster and bigger), thinning out above
    const fogA = 1 - uC;
    if (fogA > .01) {
      for (const L of [0, 1, 2]) for (const c of clouds) {
        if (c.layer !== L) continue;
        const sp = [220, 520, 1000][L], sc = [.7, 1.1, 1.8][L] * c.s, y = c.y + rise * sp, a = fogA * [.75, .9, 1][L];
        if (y > H + 200 || y < -400 * sc) continue;
        ctx.save(); ctx.globalAlpha = a; ctx.translate(c.x, y); ctx.scale(c.flip ? -sc : sc, sc); ctx.drawImage(cloudSprite(c.seed), -450, -300); ctx.restore();
      }
      // haze inside the cloud deck at the very start
      ctx.fillStyle = rgba('#5b6fb0', .35 * Math.pow(fogA, 2)); ctx.fillRect(0, 0, W, H);
    }
    // stars brighten as we clear the clouds
    if (uC > .3) { ctx.save(); ctx.globalAlpha = (uC - .3) * .8 * (1 - uG * .4); stars(ctx, t * 1.3, 90, 41); ctx.restore(); }
    finish(ctx, t, { vig: .5 });
  };
};
const G2 = { cx: 960, cy: 560, R: 900 }; // the closer globe, Africa in the middle
const AFR_PT = (t, s) => proj(36, 0, { cx: 960, cy: 540, R: 360, lon0: AF.lon0 + (s.b - s.a) * 1.2, lat0: AF.lat0 });

// ================= 23 / 24: the first lights in Africa; more people, more ideas (sparks with tiny inventions) =================
const firstLights = (T) => {
  const t0 = T.S('03a', 'For almost'), tRule = T.S('03a', 'one simple rule');
  return (ctx, t, s) => {
    space(ctx, t);
    const g = { ...G2, lon0: AF.lon0 + 8 + (t - t0) * .8, lat0: AF.lat0 };
    globe(ctx, t, g, { spread: .02 + .04 * lin(t0, tRule + 1, t) });
    // the rule: one light kindles a spark
    const [x, y] = proj(36, -1, g); for (let k = 0; k < 3; k++) spark(ctx, x, y, tRule + .2 + k * .55, t, 1.2);
    addGlow(ctx, x, y, 90, .4 * sm(lin(tRule - .3, tRule + .2, t)), P.amber, '#fff3dd');
    finish(ctx, t, { vig: .55 });
  };
};
const spreadIdeas = (T) => {
  const t0 = T.S('03a', 'More people'), tIdeas = T.S('03a', 'more ideas'), t1 = T.S('03a', 'Economists');
  const r = prng(66), pops = []; for (let i = 0; i < 46; i++) { const L = LIGHTS[Math.floor(r() * LIGHTS.length)]; pops.push({ L, k: Math.floor(r() * 4), dt: r() }); }
  return (ctx, t, s) => {
    space(ctx, t);
    const u = eio(lin(t0 - .3, t1 + .5, t));
    // camera pulls back a little and the planet turns so all continents pass under the light
    const g = { cx: 960, cy: 560, R: mix(900, 470, u), lon0: AF.lon0 + 8 + (t - t0) * .8 + mix(0, 25, u), lat0: mix(AF.lat0, 20, u) };
    globe(ctx, t, g, { spread: mix(.06, 1.05, u) });
    for (const p of pops) { if (p.L.d > mix(.06, 1.05, u) - .05) continue; const tp = t0 + .5 + p.L.d * (t1 - t0) + p.dt * .8, [x, y, z] = proj(p.L.lon, p.L.lat, g); if (z < .2) continue;
      spark(ctx, x, y, tp, t, .8); const a = sm(lin(tp, tp + .3, t)) * (1 - sm(lin(tp + 1.6, tp + 2.2, t))); icon(ctx, p.k, x, y - 26 - 10 * sm(lin(tp, tp + 1, t)), .9, a); }
    const a = sm(lin(tIdeas - .3, tIdeas + .3, t)) * (1 - sm(lin(t1 - .4, t1, t)));
    text(ctx, 'more people, more ideas', 960, 880, { size: 46, font: 'Instrument Serif', align: 'center', alpha: a });
    finish(ctx, t, { vig: .55 });
  };
};

// ================= 25: two islands, looking back a million years: the bigger one sparks far more often =================
function blob(cx, cy, R, seed, n = 60) { const r = prng(seed), k = [r() * 6, r() * 6, r() * 6]; const pts = []; for (let i = 0; i < n; i++) { const a = i / n * 6.283, rr = R * (1 + .16 * Math.sin(a * 3 + k[0]) + .1 * Math.sin(a * 5 + k[1]) + .06 * Math.sin(a * 9 + k[2])); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .72]); } return pts; }
const ISL = [{ cx: 520, cy: 600, R: 170, n: 10, seed: 3, every: 2.4 }, { cx: 1260, cy: 580, R: 420, n: 130, seed: 9, every: .17 }];
const islands = (T) => {
  const t0 = T.S('03a', 'Economists'), tPl = T.S('03a', 'places'), tFaster = T.S('03a', 'faster'), tEnd = T.S('03a', 'Because');
  const data = ISL.map((I) => { const r = prng(I.seed + 1), shape = blob(I.cx, I.cy, I.R, I.seed), pts = []; while (pts.length < I.n) { const x = I.cx + (r() - .5) * I.R * 2, y = I.cy + (r() - .5) * I.R * 1.44; if (inPoly(x, y, shape) && Math.hypot((x - I.cx) / I.R, (y - I.cy) / (I.R * .72)) < .8) pts.push([x, y, r() * 7]); } return { ...I, shape, pts }; });
  return (ctx, t, s) => {
    // sea from above, gentle swell lines
    const g = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * .8); g.addColorStop(0, '#13205a'); g.addColorStop(1, '#070a24'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(143,230,255,.06)'; ctx.lineWidth = 2; for (let i = 0; i < 18; i++) { ctx.beginPath(); for (let x = 0; x <= W; x += 40) { const y = 60 + i * 60 + Math.sin(x * .006 + t * .6 + i) * 10; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    const z = mix(1.06, 1, eout(lin(s.a, s.a + 2, t))); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    for (const I of data) {
      // shore foam + land
      ctx.beginPath(); I.shape.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
      ctx.save(); ctx.shadowColor = 'rgba(143,230,255,.35)'; ctx.shadowBlur = 30; ctx.fillStyle = '#26357e'; ctx.fill(); ctx.restore();
      ctx.strokeStyle = 'rgba(216,247,255,.35)'; ctx.lineWidth = 3; ctx.stroke();
      const lg = ctx.createRadialGradient(I.cx - I.R * .3, I.cy - I.R * .3, 10, I.cx, I.cy, I.R); lg.addColorStop(0, 'rgba(95,143,196,.25)'); lg.addColorStop(1, 'rgba(4,5,18,.2)'); ctx.fillStyle = lg; ctx.fill();
      const on = sm(lin(t0 + .3, t0 + 1.6, t));
      for (const [x, y, ph] of I.pts) { const tw = .7 + .3 * Math.sin(t * 2 + ph); ctx.fillStyle = rgba('#ffe8c0', on * tw); ctx.fillRect(x - 2.5, y - 2.5, 5, 5); addGlow(ctx, x, y, 14, .3 * on, P.amber, '#fff3dd'); }
      // sparks of invention: rare on the small island, constant on the big one
      if (t > tPl) { const k0 = Math.floor((tPl - 3) / I.every), k1 = Math.floor(t / I.every); for (let k = Math.max(k0, k1 - 6); k <= k1; k++) { const p = I.pts[(k * 7919) % I.pts.length], tk = k * I.every + (I.seed % 3) * .3; if (tk < tPl) continue; spark(ctx, p[0], p[1], tk, t, I.R > 300 ? 1 : 1.2); } }
      const la = sm(lin(tPl, tPl + .5, t)) * (1 - sm(lin(tEnd - .6, tEnd - .2, t)));
      text(ctx, I.R > 300 ? 'MANY PEOPLE' : 'FEW PEOPLE', I.cx, I.cy + I.R * .72 + 70, { size: 20, weight: 600, color: C.muted, align: 'center', spacing: 6, alpha: la });
    }
    ctx.restore();
    // a timeline sweeps from a million years ago to today
    const uT = eio(lin(t0, t0 + 2.6, t)), ta = sm(lin(t0, t0 + .4, t)) * (1 - sm(lin(tPl + 1.5, tPl + 2.2, t)));
    if (ta > 0) { ctx.fillStyle = rgba(C.cream, .25 * ta); ctx.fillRect(360, 120, 1200, 2); ctx.fillStyle = rgba(P.amber, ta); ctx.fillRect(360, 118, 1200 * uT, 6); addGlow(ctx, 360 + 1200 * uT, 121, 30, .7 * ta, P.amber, '#fff3dd');
      text(ctx, '1,000,000 YEARS AGO', 360, 100, { size: 18, weight: 600, color: C.muted, spacing: 4, alpha: ta }); text(ctx, 'TODAY', 1560, 100, { size: 18, weight: 600, color: C.muted, spacing: 4, align: 'right', alpha: ta }); }
    source(ctx, t, tPl, tEnd, 'Kremer, 1993 · Quarterly Journal of Economics');
    // the carrier: a spark on the big island lifts and flies to the centre as a flame
    const uF = eio(lin(tEnd - .9, s.b, t)); if (uF > 0) { const x = mix(1260, W / 2, uF), y = mix(560, H / 2 + 40, uF); ctx.fillStyle = rgba('#07081c', .5 * uF); ctx.fillRect(0, 0, W, H); addGlow(ctx, x, y, mix(40, 140, uF), .9, P.amber, '#ffffff'); flame(ctx, x, y, mix(.6, 1.6, uF), t); }
    finish(ctx, t, { vig: .55 });
  };
};
function flame(ctx, x, y, s, t, a = 1) {
  if (a <= 0) return; const f = 1 + .08 * Math.sin(t * 17 + x) + .05 * Math.sin(t * 29 + y);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s * f);
  const g = ctx.createRadialGradient(0, -8, 1, 0, -10, 26); g.addColorStop(0, '#ffffff'); g.addColorStop(.35, '#ffe2a0'); g.addColorStop(1, 'rgba(255,150,60,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -38); ctx.quadraticCurveTo(14, -14, 9, 0); ctx.quadraticCurveTo(0, 8, -9, 0); ctx.quadraticCurveTo(-14, -14, 0, -38); ctx.fill(); ctx.restore();
  addGlow(ctx, x, y - 14 * s, 50 * s, .55 * a, P.amber, '#fff3dd');
}

// ================= 26: an idea, once found, can be used by everyone: one flame lights hundreds of candles, staying as big =================
const candles = (T) => {
  const t0 = T.S('03a', 'Because'), tUsed = T.S('03a', 'can be used'), tEnd = T.S('03a', 'But the best');
  const rows = 11, C0 = { x: W / 2, y: H / 2 + 40 };
  const list = once('candles', () => { const a = []; for (let j = 0; j < rows; j++) { const n = 9 + j * 3; for (let i = 0; i < n; i++) { const u = (i + .5) / n - .5; a.push({ j, u, d: 0 }); } } return a; });
  return (ctx, t, s) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#07081c'); g.addColorStop(1, '#141030'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // ignition wave: from the centre candle outward, accelerating ("used by everyone")
    const front = Math.pow(clamp((t - (t0 + .6)) / (tEnd - t0 - .8)), 1.6) * 1.3;
    const cam = mix(0, -60, sine(lin(s.a, s.b, t)));
    const pts = [];
    for (const c of list) {
      // rows recede upward; j = 0 closest
      const f = 1 / (1 + c.j * .28), y = 980 - (1 - f) * 900 + cam * f, x = W / 2 + c.u * 3000 * f, sz = 1.25 * f;
      if (x < -60 || x > W + 60) continue;
      const dist = Math.hypot(x - C0.x, (y - C0.y) * 2) / 1300; pts.push({ x, y, sz, dist, f });
    }
    pts.sort((a, b) => a.y - b.y);
    for (const p of pts) {
      const ch = 120 * p.sz; ctx.fillStyle = mixHex('#2a2440', '#e9dcc0', clamp((front - p.dist) * 5) * .9 + .1); ctx.fillRect(p.x - 13 * p.sz, p.y - ch, 26 * p.sz, ch);
      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(p.x - 1.5 * p.sz, p.y - ch - 8 * p.sz, 3 * p.sz, 9 * p.sz);
      const lit = clamp((front - p.dist) * 8); if (lit > 0) flame(ctx, p.x, p.y - ch - 6 * p.sz, p.sz, t, lit);
    }
    // the first flame (the idea) floats over the centre and keeps its size; small sparks leap from it to the nearest wicks
    const fx = C0.x, fy = C0.y - 140;
    flame(ctx, fx, fy, 2.2, t, 1); addGlow(ctx, fx, fy - 30, 260, .35, P.amber, '#fff3dd');
    ctx.strokeStyle = rgba(P.amber, .7); ctx.lineWidth = 1.5; ctx.setLineDash([3, 6]); ctx.beginPath(); ctx.arc(fx, fy - 30, 80 + 4 * Math.sin(t * 3), 0, 7); ctx.stroke(); ctx.setLineDash([]);
    const r = prng(Math.floor(t * 6));
    for (let k = 0; k < 6; k++) { const p = pts[Math.floor(r() * pts.length)]; if (!p || clamp((front - p.dist) * 8) >= 1 || p.dist > front + .15) continue; const u = (t * 6) % 1; const x = mix(fx, p.x, u), y = mix(fy - 20, p.y - 120 * p.sz, u) - Math.sin(u * Math.PI) * 120; addGlow(ctx, x, y, 18, .8 * (1 - u), P.amber, '#ffffff'); }
    const a = sm(lin(tUsed, tUsed + .4, t)) * (1 - sm(lin(tEnd - .4, tEnd, t)));
    text(ctx, 'used by everyone, and never used up', 960, 120, { size: 44, font: 'Instrument Serif', align: 'center', alpha: a });
    // the end: camera dips toward one flame, which becomes the helmet lamp
    finish(ctx, t, { vig: .6 });
  };
};

// ================= 27: the best ideas get harder to find: a miner with a helmet lamp; each strike yields fewer sparks =================
const mine = (T) => {
  const t0 = T.S('03a', 'But the best'), tHard = T.S('03a', 'harder'), tChip = T.S('03a', 'Keeping chips');
  return (ctx, t, s) => {
    ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H);
    // tunnel: receding rock rings, camera creeps forward
    const fw = (t - s.a) * .25;
    for (let i = 9; i >= 0; i--) { const d = i + 1 - (fw % 1), f = 1 / (d * .55), w = 1500 * f, h = 900 * f; const col = shade('#2a2240', -i * .015);
      const lit = 1 / (1 + i * .5);
      ctx.fillStyle = mixHex('#120f22', '#5a4060', lit * .6); ctx.beginPath(); ctx.ellipse(W / 2, H / 2 + 60 * f, w, h, 0, 0, 7); ctx.fill();
      ctx.fillStyle = mixHex('#0a0816', '#2a2038', lit * .5); ctx.beginPath(); ctx.ellipse(W / 2, H / 2 + 60 * f, w * .9, h * .88, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = rgba('#ffd29a', .12 * lit); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(W / 2, H / 2 + 60 * f, w * .9, h * .88, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      // timber frame
      ctx.fillStyle = 'rgba(90,60,30,.6)'; ctx.fillRect(W / 2 - w * .7, H / 2 - h * .6, 24 * f, h * 1.4); ctx.fillRect(W / 2 + w * .7 - 24 * f, H / 2 - h * .6, 24 * f, h * 1.4); ctx.fillRect(W / 2 - w * .72, H / 2 - h * .62, w * 1.44, 22 * f); }
    // rock face at the end
    const face = { x: 1240, y: 600 };
    { const rr = prng(12); ctx.fillStyle = '#3a2e4e'; ctx.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283, d = 1 + (rr() - .5) * .25; const x = face.x + 150 + Math.cos(a) * 280 * d, y = face.y + Math.sin(a) * 400 * d; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.fill();
      const lg = ctx.createRadialGradient(face.x + 20, face.y - 60, 10, face.x + 20, face.y - 60, 360); lg.addColorStop(0, 'rgba(255,226,160,.35)'); lg.addColorStop(1, 'rgba(255,226,160,0)'); ctx.fillStyle = lg; ctx.fill();
      ctx.strokeStyle = 'rgba(10,8,22,.7)'; ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { let x = face.x + 20 + rr() * 260, y = face.y - 340 + rr() * 640; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (rr() - .5) * 80; y += 30 + rr() * 50; ctx.lineTo(x, y); } ctx.stroke(); } }
    // rare golden glints in the rock (ideas)
    const r = prng(5); for (let i = 0; i < 14; i++) { const x = face.x + 30 + r() * 260, y = face.y - 300 + r() * 600, on = Math.sin(t * 2 + i) > .7; if (on) addGlow(ctx, x, y, 12, .6, P.amber, '#fff3dd'); }
    // miner with pickaxe, helmet lamp beam on the face
    const hitEvery = mix(.7, 1.6, lin(t0, tChip, t)), ph = ((t - s.a) / hitEvery) % 1, swing = ph < .7 ? -1.6 * eio(ph / .7) : -1.6 + 1.6 * ein((ph - .7) / .3);
    const mx = 900, my = 900;
    person(ctx, mx, my, 520, t, { coat: '#3a3050', hood: false, skin: '#a0705a', arm: (c, sh) => { c.save(); c.translate(3, sh + 6); c.rotate(-.6 - swing); c.strokeStyle = '#2a2238'; c.lineWidth = 5.5; c.beginPath(); c.moveTo(0, 0); c.lineTo(26, 0); c.stroke(); c.strokeStyle = '#5a3a20'; c.lineWidth = 3; c.beginPath(); c.moveTo(24, 0); c.lineTo(24, -36); c.stroke(); c.strokeStyle = '#9aa0b0'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(12, -36); c.quadraticCurveTo(24, -42, 38, -32); c.stroke(); c.restore(); } });
    // helmet
    const hx = mx + 10, hy = my - 520 * .92; ctx.fillStyle = '#e6b04a'; ctx.beginPath(); ctx.ellipse(hx, hy, 34, 22, 0, Math.PI, 0); ctx.fill();
    cone(ctx, hx + 30, hy - 4, 520, Math.PI / 2 - .25, .2, '#ffe2a0', .45); addGlow(ctx, hx + 32, hy - 6, 40, .9, '#ffe2a0', '#ffffff');
    // sparks at the strike: many at first, fewer and fewer
    const nHit = Math.floor((t - s.a) / hitEvery), tHit = s.a + nHit * hitEvery + .7 * hitEvery;
    const yield_ = Math.max(1, Math.round(mix(14, 1, lin(t0, tHard + .8, t))));
    const u = (t - tHit) / .6; if (u > 0 && u < 1) { const rr = prng(nHit + 3); for (let i = 0; i < yield_; i++) { const a = -Math.PI * (.3 + rr() * .9), d = 30 + rr() * 140 * eout(u); ctx.fillStyle = rgba('#fff3dd', 1 - u); ctx.fillRect(face.x + 20 + Math.cos(a) * d, face.y - 60 + Math.sin(a) * d + 80 * u * u, 4, 4); } addGlow(ctx, face.x + 20, face.y - 60, 60, .6 * (1 - u), P.amber, '#fff3dd'); }
    const a = sm(lin(tHard - .2, tHard + .3, t)); text(ctx, 'harder to find', 960, 140, { size: 52, font: 'Instrument Serif', align: 'center', alpha: a * .9 });
    // a chunk breaks out and tumbles toward the camera (carrier → chip)
    const uB = eio(lin(tChip - .8, s.b, t)); if (uB > 0) { const x = mix(face.x + 20, 960, uB), y = mix(face.y - 60, 540, uB), sz = mix(30, 220, uB); ctx.save(); ctx.translate(x, y); ctx.rotate(uB * 2); ctx.fillStyle = mixHex('#3a3050', '#1a1f4e', uB); ctx.beginPath(); ctx.moveTo(-sz, -sz * .6); ctx.lineTo(sz * .7, -sz); ctx.lineTo(sz, sz * .4); ctx.lineTo(-sz * .3, sz); ctx.fill(); ctx.restore(); addGlow(ctx, x, y, sz * 1.4, .3 * uB, C.cyan, C.cyanWhite); }
    finish(ctx, t, { vig: .6 });
  };
};

// ================= 28 / 29 / 32: the chip staircase =================
const ST = { x0: 150, y0: 1010, w: 236, h: 108, n: 7 };
function chipTop(ctx, x, y, w, h, dens, glowA = 0) {
  // a chip block: dark body, gold pins, a die whose grid doubles in density per step
  ctx.fillStyle = '#141a48'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#1e2766'; ctx.fillRect(x, y, w, 10);
  ctx.fillStyle = '#c9963a'; for (let k = 0; k < 8; k++) { ctx.fillRect(x + 12 + k * (w - 24) / 8, y + h - 6, 8, 10); }
  const dx = x + w * .2, dy = y + 18, dw = w * .6, dh = h - 36; ctx.fillStyle = '#0b0f30'; ctx.fillRect(dx, dy, dw, dh);
  const n = Math.pow(2, dens); ctx.strokeStyle = rgba(C.cyan, .5 + glowA * .4); ctx.lineWidth = Math.max(.6, 2.5 - dens * .3);
  for (let i = 1; i < n; i++) { ctx.beginPath(); ctx.moveTo(dx + dw * i / n, dy); ctx.lineTo(dx + dw * i / n, dy + dh); ctx.stroke(); ctx.beginPath(); ctx.moveTo(dx, dy + dh * i / n); ctx.lineTo(dx + dw, dy + dh * i / n); ctx.stroke(); }
  if (glowA > 0) addGlow(ctx, dx + dw / 2, dy + dh / 2, w * .6, .35 * glowA, C.cyan, C.cyanWhite);
}
function stairs(ctx, t, k, { n = ST.n, x0 = ST.x0, y0 = ST.y0, rise = 0 } = {}) {
  // k = how many steps exist (fractional = the next one is rising into place)
  const steps = [];
  for (let i = 0; i < n; i++) {
    const u = clamp(k - i); if (u <= 0) break;
    const x = x0 + i * ST.w, top = y0 - (i + 1) * ST.h - rise * i * 0, yy = mix(y0 + 60, top, eout(u));
    const bg = ctx.createLinearGradient(x, 0, x + ST.w, 0); bg.addColorStop(0, '#26307a'); bg.addColorStop(1, '#1a2262'); ctx.fillStyle = bg; ctx.fillRect(x, yy + ST.h, ST.w, y0 - yy - ST.h + 400); ctx.fillStyle = 'rgba(143,230,255,.12)'; ctx.fillRect(x, yy + ST.h, 3, y0 - yy - ST.h + 400);
    chipTop(ctx, x, yy, ST.w, ST.h, Math.min(i + 1, 6), u < 1 ? 1 - u : 0);
    steps.push({ x, y: yy });
  }
  return steps;
}
const chipStair = (T) => {
  const t0 = T.S('03a', 'Keeping chips'), tDbl = T.S('03a', 'doubling'), tNow = T.S('03a', 'now takes');
  const r = prng(2828), traces = Array.from({ length: 22 }, () => ({ y: 120 + r() * 760, x: r() * W, len: 160 + r() * 420, ph: r() * 6, turn: r() < .5 ? 1 : -1 }));
  return (ctx, t, s) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a0c26'); g.addColorStop(1, '#1b1f55'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // circuit traces in the dark behind, pulses running along them
    ctx.lineWidth = 2;
    for (const tr of traces) {
      ctx.strokeStyle = 'rgba(110,160,255,.07)'; ctx.beginPath(); ctx.moveTo(tr.x, tr.y); ctx.lineTo(tr.x + tr.len, tr.y); ctx.lineTo(tr.x + tr.len + 40, tr.y + 40 * tr.turn); ctx.stroke(); ctx.fillStyle = 'rgba(110,160,255,.18)'; ctx.beginPath(); ctx.arc(tr.x, tr.y, 4, 0, 7); ctx.arc(tr.x + tr.len + 40, tr.y + 40 * tr.turn, 4, 0, 7); ctx.fill();
      const u = ((t * .35 + tr.ph) % 1); ctx.fillStyle = rgba(C.cyan, .5 * Math.sin(u * Math.PI)); ctx.fillRect(tr.x + u * tr.len - 10, tr.y - 1.5, 20, 3);
    }
    addGlow(ctx, 960, 470, 700, .14, '#4f6bff', C.cyanWhite);
    // the chip from the rock lands as the first step; each next step pops up, denser.
    // camera keeps the built staircase centred and pulls back to the full stair (identity) for the hand-over to the crowd.
    const uLand = eio(lin(s.a + .2, s.a + 1.2, t));
    const k = 1 + clamp((t - tDbl) / (tNow - tDbl + .2)) * (ST.n - 1), e = eio((k - 1) / (ST.n - 1));
    const kk = Math.max(1, k), Fx = ST.x0 + kk * ST.w / 2, Fy = ST.y0 - kk * ST.h / 2, z = mix(1.6, 1, e);
    const Sx = mix(960, Fx, e), Sy = mix(560, Fy, e);
    const cam = (x, y) => [Sx + (x - Fx) * z, Sy + (y - Fy) * z];
    if (uLand < 1) {
      const [tx, ty] = cam(ST.x0, ST.y0 - ST.h), tw = ST.w * z, sz = mix(440, tw, uLand);
      // floor of the first step appears under the landing chip
      ctx.save(); ctx.translate(Sx, Sy); ctx.scale(z, z); ctx.translate(-Fx, -Fy); ctx.globalAlpha = uLand; stairs(ctx, t, uLand * .999); ctx.restore(); ctx.globalAlpha = 1;
      chipTop(ctx, mix(W / 2 - sz / 2, tx, uLand), mix(H / 2 - sz * .23, ty, uLand), sz, sz * ST.h / ST.w, 1, .7 * (1 - uLand));
    } else {
      ctx.save(); ctx.translate(Sx, Sy); ctx.scale(z, z); ctx.translate(-Fx, -Fy);
      const st = stairs(ctx, t, k);
      // rim light on the newest step + the ×2 marks riding with the camera
      const top = st[st.length - 1]; if (top) addGlow(ctx, top.x + ST.w / 2, top.y + ST.h / 2, 260, .3, C.cyan, C.cyanWhite);
      for (let i = 1; i < st.length; i++) { const a = sm(clamp(k - i) * 2 - .3); text(ctx, '×2', st[i].x + ST.w / 2, st[i].y - 26, { size: 44, font: 'Instrument Serif', align: 'center', alpha: a * (i < 4 ? 1 : .6), color: '#e9fbff' }); }
      ctx.restore();
    }
    finish(ctx, t, { vig: .5 });
  };
};
const crowdStair = (T) => {
  const t0 = T.S('03a', 'now takes'), t18 = T.S('03a', 'eighteen'), t70 = T.S('03a', 'early'), tEnd = T.S('03a', 'We have been');
  return (ctx, t, s) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a0c26'); g.addColorStop(1, '#1b1f55'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const steps = stairs(ctx, t, ST.n);
    // crowds of researchers pushing at each riser; the crowd grows per step (×18 from first to last), overflowing the frame
    const u = sm(lin(t0 - .3, t18 + .6, t));
    steps.forEach((st, i) => {
      const nPeople = Math.round(mix(1, 18, Math.pow(i / (ST.n - 1), 1.3)) * 2 * clamp(u * ST.n - i * .6));
      const r = prng(i * 13 + 1);
      for (let p = 0; p < nPeople; p++) {
        const lean = Math.sin(t * 3 + p) * 2, x = st.x - 30 - (p % 6) * 22 - Math.floor(p / 6) * 8 + r() * 6 + ST.w, y = st.y - (Math.floor(p / 6)) * 18 - 6;
        figure(ctx, x + lean, y + 4, 80, Math.floor(p / 6) % 2 ? '#2e3f86' : '#3a4c96', { a: 1 });
      }
    });
    // a crowd too big for the frame spills from the top right
    const ov = sm(lin(t18, t18 + 1.2, t)); if (ov > 0) { const r = prng(9); for (let p = 0; p < 160 * ov; p++) figure(ctx, 1540 + r() * 420 + Math.sin(t * 2 + p) * 3, 280 + r() * 200, 50, '#3a4c96', { a: ov }); addGlow(ctx, 1800, 300, 300, .2 * ov, C.cyan, C.cyanWhite); }
    // labels
    text(ctx, 'EARLY 1970s', ST.x0 + ST.w / 2, ST.y0 + 50, { size: 18, weight: 600, align: 'center', color: C.muted, spacing: 5, alpha: sm(lin(t70 - .6, t70, t)) });
    const a18 = sm(lin(t18 - .2, t18 + .3, t));
    text(ctx, '18×', 1500, 180, { size: 110, font: 'Instrument Serif', align: 'center', color: '#ffd27a', alpha: a18 });
    text(ctx, 'THE RESEARCHERS, TODAY', 1500, 220, { size: 18, weight: 600, align: 'center', color: C.muted, spacing: 5, alpha: a18 });
    source(ctx, t, t18, tEnd, 'Bloom, Jones, Van Reenen & Webb, 2020 · American Economic Review');
    finish(ctx, t, { vig: .5 });
  };
};

// ================= 30 / 31: the hourglass of geniuses runs low; then it tips and the glass dissolves =================
const HG = { x: 960, y: 540, w: 300, h: 380 };
function hourglass(ctx, t, { level = .2, rot = 0, glass = 1, flow = 1, seed = 1, free = 0 } = {}) {
  ctx.save(); ctx.translate(HG.x, HG.y); ctx.rotate(rot);
  const w = HG.w, h = HG.h;
  // frame
  ctx.globalAlpha = glass; ctx.fillStyle = '#5a3a20'; ctx.fillRect(-w * .62, -h - 30, w * 1.24, 30); ctx.fillRect(-w * .62, h, w * 1.24, 30);
  ctx.fillStyle = '#4a3018'; ctx.fillRect(-w * .58, -h, 16, h * 2); ctx.fillRect(w * .58 - 16, -h, 16, h * 2);
  // glass bulbs
  const bulb = () => { ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.bezierCurveTo(-w / 2, -h * .35, -18, -h * .2, -10, 0); ctx.bezierCurveTo(-18, h * .2, -w / 2, h * .35, -w / 2, h); ctx.lineTo(w / 2, h); ctx.bezierCurveTo(w / 2, h * .35, 18, h * .2, 10, 0); ctx.bezierCurveTo(18, -h * .2, w / 2, -h * .35, w / 2, -h); ctx.closePath(); };
  bulb(); ctx.fillStyle = 'rgba(143,230,255,.06)'; ctx.fill(); ctx.strokeStyle = 'rgba(216,247,255,.55)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.globalAlpha = 1;
  // contents: tiny silhouettes as sand
  ctx.save(); bulb(); ctx.clip();
  const r = prng(seed);
  const topN = Math.round(140 * level), botN = 160;
  for (let i = 0; i < topN; i++) { const x = (r() - .5) * mix(60, w * .9, (i % 10) / 10), y = -h * .25 - Math.floor(i / 12) * 14 - r() * 6; figure(ctx, x, y, 22, '#8fb8f0', { a: 1 }); }
  for (let i = 0; i < botN; i++) { const row = Math.floor(i / 16), x = (r() - .5) * (w * .95 - row * 18), y = h - 4 - row * 13; figure(ctx, x, y, 22, '#5a7acc', { a: 1 }); }
  ctx.restore();
  // the trickle through the neck
  if (flow > 0) for (let k = 0; k < 8; k++) { const q = ((t * 1.2 + k / 8) % 1); figure(ctx, Math.sin(k * 4) * 3, mix(-10, h * .6, q), 18, '#d8f7ff', { a: flow * (1 - q * .5) }); }
  ctx.restore();
  addGlow(ctx, HG.x, HG.y, 400, .12, C.cyan, C.cyanWhite);
}
const hourglassLow = (T) => {
  const t0 = T.S('03a', 'We have been'), tRun = T.S('03a', 'running out'), tLong = T.S('03a', 'long time');
  return (ctx, t, s) => {
    const g = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * .7); g.addColorStop(0, '#1d2260'); g.addColorStop(1, '#070818'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // the researchers of the staircase stream in from the right and into the top of the glass (carrier)
    const uIn = lin(s.a, s.a + 2.0, t); if (uIn < 1) { const r = prng(4); for (let i = 0; i < 40; i++) { const q = clamp(uIn * 1.6 - i / 60), x = mix(1700 + r() * 200, HG.x + (r() - .5) * 100, eio(q)), y = mix(300 + r() * 200, HG.y - HG.h + 20, eio(q)); figure(ctx, x, y, mix(50, 22, q), '#8fb8f0', { a: 1 - q * .8 }); } }
    const level = mix(.6, .06, eio(lin(s.a, tLong, t)));
    const z = mix(1, 1.06, sine(lin(s.a, s.b, t))); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    hourglass(ctx, t, { level });
    ctx.restore();
    const a = sm(lin(tRun - .2, tRun + .4, t)); text(ctx, 'running out of geniuses', 1300, 560, { size: 44, font: 'Instrument Serif', align: 'left', alpha: a * .9 });
    finish(ctx, t, { vig: .55 });
  };
};
const hourglassFree = (T) => {
  const t0 = T.S('03a', 'Now imagine'), tDis = T.S('03a', 'disappears'), tNot = T.S('03a', 'Not more');
  return (ctx, t, s) => {
    const g = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * .7); g.addColorStop(0, '#1d2260'); g.addColorStop(1, '#070818'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const uTip = eio(lin(t0 + .2, tDis, t)), uGone = sm(lin(tDis - .1, tDis + .9, t));
    if (uGone < 1) hourglass(ctx, t, { level: .06, rot: uTip * Math.PI / 2, glass: 1 - uGone, flow: 1 - uTip });
    // freed: silhouettes pour upward and multiply, a widening river of light
    if (uGone > 0) { const r = prng(21), n = Math.round(mix(120, 900, sm(lin(tDis, s.b, t))));
      for (let i = 0; i < n; i++) { const sp = 80 + r() * 260, ph = r(), q = ((t - tDis) * sp / 1200 + ph) % 1, x = HG.x + (r() - .5) * mix(200, 1500, q) + Math.sin(t + i) * 10, y = mix(HG.y + 200, -60, q);
        figure(ctx, x, y, mix(26, 40, q), i % 9 ? '#8fb8f0' : '#ffd27a', { a: uGone * (1 - q * .3) }); }
      addGlow(ctx, HG.x, HG.y, 700 * uGone, .25 * uGone, C.cyan, C.cyanWhite);
      // glass shards sparkle away
      const r2 = prng(3); for (let i = 0; i < 40; i++) { const q = clamp((t - tDis) / 1.2), a = r2() * 6.283, d = 100 + r2() * 300 * q; ctx.fillStyle = rgba('#d8f7ff', .8 * (1 - q)); ctx.fillRect(HG.x + Math.cos(a) * d, HG.y + Math.sin(a) * d * .7, 4, 4); } }
    finish(ctx, t, { vig: .5 });
  };
};
const stairToSky = (T) => {
  const t0 = T.S('03a', 'Not more'), tMany = T.S('03a', 'As many'), tWant = T.S('03a', 'want');
  return (ctx, t, s) => {
    // camera tilts up as the staircase grows: background goes from room dark to open sky
    const tilt = eio(lin(tMany - .5, s.b, t));
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mixHex('#0a0c26', '#141a52', tilt)); g.addColorStop(1, mixHex('#1b1f55', '#4a5fae', tilt)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const r0 = prng(2); for (let i = 0; i < 120; i++) { ctx.fillStyle = rgba(C.cream, (.2 + .5 * r0()) * tilt); ctx.fillRect(r0() * W, r0() * H * .6, 2, 2); }
    // the stream pours in from below left
    const k = mix(ST.n, 22, eio(lin(t0 + .3, s.b, t)));
    const scale = mix(1, .55, tilt), camY = mix(0, 420, tilt);
    ctx.save(); ctx.translate(0, camY); ctx.translate(ST.x0, ST.y0); ctx.scale(scale, scale); ctx.translate(-ST.x0, -ST.y0);
    const n = Math.ceil(k); const steps = [];
    for (let i = 0; i < n; i++) { const u = clamp(k - i); const x = ST.x0 + i * ST.w * .8, top = ST.y0 - (i + 1) * ST.h, yy = mix(top + 80, top, eout(u)); ctx.globalAlpha = clamp(u * 2); ctx.fillStyle = '#212a70'; ctx.fillRect(x, yy + ST.h, ST.w, ST.y0 - yy + 400); ctx.fillStyle = 'rgba(143,230,255,.12)'; ctx.fillRect(x, yy + ST.h, 3, ST.y0 - yy + 400); chipTop(ctx, x, yy, ST.w, ST.h, Math.min(i + 1, 6), u < 1 ? 1 - u : .25); ctx.globalAlpha = 1; steps.push([x, yy]); }
    // the stream of people climbing up the steps
    const r = prng(5); for (let i = 0; i < 420; i++) { const q = ((t * .25 + r()) % 1) * (n - .2), j = Math.floor(q), f = q - j, st = steps[Math.min(j, steps.length - 1)]; if (!st) continue; const x = st[0] + f * ST.w * .8 + (r() - .5) * 60, y = st[1] - f * 10; figure(ctx, x, y + 2, 48, i % 11 ? '#8fb8f0' : '#ffd27a', { a: .95 }); }
    ctx.restore();
    const a = sm(lin(tMany - .1, tMany + .4, t)) * (1 - sm(lin(s.b - .6, s.b, t))); text(ctx, 'as many as we want', 1380, 220, { size: 60, font: 'Instrument Serif', align: 'center', alpha: a });
    finish(ctx, t, { vig: .5 });
  };
};

// ================= 33: the real meaning of a country of geniuses: a city of light with a border, stamped "country" =================
const country = (T) => {
  const t0 = T.S('03a', "That's the real"), tC = T.S('03a', 'country of geniuses'), tEnd = T.seg('03a').end;
  const pts = once('country', () => { const r = prng(33), a = []; for (let i = 0; i < 2600; i++) { const ang = r() * 6.283, rr = Math.pow(r(), .7) * 430; const x = 960 + Math.cos(ang) * rr * 1.5 + (r() - .5) * 60, y = 540 + Math.sin(ang) * rr * .85; a.push({ x, y, m: r(), ph: r() * 7, d: rr / 430 }); } return a; });
  const border = blob(960, 540, 640, 77, 90).map(([x, y]) => [x, 540 + (y - 540) * 1.05]);
  return (ctx, t, s) => {
    // a map at night, seen from above, terrain contour lines
    const g = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * .75); g.addColorStop(0, '#16205c'); g.addColorStop(1, '#060818'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const z = mix(1.25, 1.0, eout(lin(s.a, s.a + 2.4, t))) * mix(1, 1.08, sm(lin(tC, s.b, t)));
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    ctx.strokeStyle = 'rgba(143,230,255,.05)'; ctx.lineWidth = 2; for (let i = 1; i < 12; i++) { ctx.beginPath(); blob(960, 540, i * 90, 5 + i, 60).forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke(); }
    // the lights: every point a mind; streets as faint lines between
    const on = sm(lin(s.a, s.a + 1.2, t));
    for (const p of pts) { const tw = .65 + .35 * Math.sin(t * (1 + p.m * 2) + p.ph), warm = p.m > .8; ctx.fillStyle = rgba(warm ? '#ffd29a' : C.cyanWhite, on * tw * (1 - p.d * .4)); ctx.fillRect(p.x - 1.6, p.y - 1.6, 3.2, 3.2); }
    addGlow(ctx, 960, 540, 700, .25 * on, C.cyan, C.cyanWhite); addGlow(ctx, 960, 540, 300, .25 * on, P.amber, '#fff3dd');
    // the border draws itself like a map line
    const uB = eio(lin(t0 + .2, tC, t)), nB = Math.floor(border.length * uB);
    ctx.save(); ctx.setLineDash([18, 10]); ctx.lineWidth = 4; ctx.strokeStyle = rgba('#ffd27a', .85); ctx.beginPath(); for (let i = 0; i <= nB; i++) { const [x, y] = border[i % border.length]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
    ctx.restore();
    // the stamp lands in the middle (carrier at the centre)
    const uS = clamp((t - tC) / .35); if (uS > 0) { const sc = mix(2.4, 1, eout(uS)), a = clamp(uS * 2);
      ctx.save(); ctx.translate(960, 540); ctx.rotate(-.06); ctx.scale(sc, sc); ctx.globalAlpha = a; ctx.strokeStyle = '#ffd27a'; ctx.lineWidth = 6; ctx.strokeRect(-250, -66, 500, 132); ctx.lineWidth = 2; ctx.strokeRect(-236, -52, 472, 104);
      text(ctx, 'COUNTRY', 0, 22, { size: 72, weight: 600, align: 'center', color: '#ffd27a', spacing: 18 }); ctx.restore();
      if (uS < 1) addGlow(ctx, 960, 540, 500, .5 * (1 - uS), P.amber, '#ffffff'); }
    const a2 = sm(lin(tC + .6, tC + 1.2, t)); text(ctx, 'OF GENIUSES', 960, 660, { size: 24, weight: 600, align: 'center', color: C.cream, spacing: 12, alpha: a2 });
    finish(ctx, t, { vig: .55 });
  };
};

export default function (T) {
  const S = (p) => T.S('03a', p);
  // where Africa sits on the globe at the end of shot 22 (screen point we zoom into)
  return [
    { t: S('To see') - .3, draw: riseOut(T), tr: 'up', d: 1.4 },
    { t: S('For almost') - .2, draw: firstLights(T), tr: 'zoom', d: 1.2, x: 1012, y: 577, depth: 2.5 },
    { t: S('More people') - .2, draw: spreadIdeas(T), tr: 'match', d: .6 },
    { t: S('Economists') - .2, draw: islands(T), tr: 'iris', d: 1.0, x: 960, y: 560 },
    { t: S('Because') - .05, draw: candles(T), tr: 'match', d: .5 },
    { t: S('But the best') - .2, draw: mine(T), tr: 'iris', d: .9, x: 960, y: 380 },
    { t: S('Keeping chips') - .05, draw: chipStair(T), tr: 'zoom', d: .8, x: 960, y: 540, depth: 2 },
    { t: S('now takes') - .25, draw: crowdStair(T), tr: 'match', d: .5 },
    { t: S('We have been') - .2, draw: hourglassLow(T), tr: 'push', d: .9 },
    { t: S('Now imagine') - .1, draw: hourglassFree(T), tr: 'match', d: .4 },
    { t: S('Not more') - .2, draw: stairToSky(T), tr: 'match', d: .7 },
    { t: S("That's the real") - .25, draw: country(T), tr: 'down', d: 1.1 },
  ];
}
