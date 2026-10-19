// s00_world.mjs · shared world of the bookends (chapter 00 "The Morning" and chapter 08 "The open question").
// The bedroom, the morning stripe, the harbour front (with the next bay along the coast), the cyan message light,
// the dawn sea with the pier. Everything static is baked once into cached layers (LRU byte budget) and per frame
// only composited with a 2.5D camera plus cheap animated elements. Deterministic, no Math.random.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, prng, drift, addGlow, glow, text } from '../engine.mjs';
import { layer, stipple, maskLinear, maskRadial, put, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, strokes, fog, cone, house, person, castShadow, printFinish, vnoise, fbm, mixHex, shade, soften, stratus, limb, qpts } from './art.mjs';
export { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, prng, drift, addGlow, glow, text, layer, stipple, maskLinear, maskRadial, put, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, strokes, fog, cone, house, person, castShadow, printFinish, vnoise, fbm, mixHex, shade, soften, stratus, limb, qpts };

// napi-rs putImageData honours the context transform, so art.mjs stipple() on a transformed context shifts the dots.
// stip() resets the transform first; pool()/bloom() are fixed copies of art.mjs (same look, same signature).
export function stip(c, o = {}) { const g = c.getContext('2d'); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, o); g.restore(); return c; }
export function pool(ctx, x, y, rx, ry, { col = '#ffb35c', a = .6, k = .7, seed = 1, op = 'lighter', cell = 1, rot = 0 } = {}) {
  const [c, g] = layer(); g.translate(x, y); g.rotate(rot); g.scale(1, ry / rx);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, rgba(col, a)); rg.addColorStop(.4, rgba(col, a * .5)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.beginPath(); g.arc(0, 0, rx, 0, 7); g.fill(); stip(c, { k, g: 1.2, seed, cell }); put(ctx, c, { op }); return c;
}
export function bloom(ctx, x, y, r, { col = '#ffb35c', core = '#ffd59a', a = .6, k = .5, seed = 1, sy = 1, op = 'lighter' } = {}) {
  const [c, g] = layer(); g.translate(x, y); g.scale(1, sy);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, rgba(core, a)); rg.addColorStop(.15, rgba(col, a * .6)); rg.addColorStop(.5, rgba(col, a * .18)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); stip(c, { k, g: 1.2, seed }); put(ctx, c, { op }); return c;
}
export const K = {
  hot: '#ffd59a', amber: '#ffb35c', gold: '#ffc477', cream: '#fff1cf', rose: '#e8a3a0', peach: '#f6b48a', coral: '#ef8f7a',
  cyan: '#8fe6ff', cyanW: '#d8f7ff', ink: '#070918', indigo: '#0b0f2a', night: '#121540', violet: '#3b2f6e',
};
export const quart = (x) => x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2;
export const eoutQ = (x) => 1 - Math.pow(1 - x, 4);
export const bell = (t, c, w) => Math.exp(-Math.pow((t - c) / w, 2));
// hash noise for per-item variation without consuming an rng
export const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------------------------------------------------------------- cache (LRU by bytes)
const CACHE = new Map(); let BYTES = 0; const BUDGET = Number(process.env.S00_CACHE_MB || 1400) * 1e6;
function bytesOf(v, seen = new Set()) {
  if (!v || typeof v !== 'object' || seen.has(v)) return 0; seen.add(v);
  if (typeof v.getContext === 'function' && v.width) return v.width * v.height * 4;
  let n = 0; for (const k of Object.keys(v)) n += bytesOf(v[k], seen); return n;
}
export function once(key, fn) {
  if (CACHE.has(key)) { const e = CACHE.get(key); CACHE.delete(key); CACHE.set(key, e); return e.v; }
  const v = fn(), b = bytesOf(v);
  while (BYTES + b > BUDGET && CACHE.size) { const [k0, e0] = CACHE.entries().next().value; CACHE.delete(k0); BYTES -= e0.b; }
  CACHE.set(key, { v, b }); BYTES += b; return v;
}
// scratch canvases reused every frame (never reallocated)
const SCR = new Map();
export function scratch(name, w = W, h = H) { const k = name + w + 'x' + h; if (!SCR.has(k)) SCR.set(k, layer(w, h)); const [c, g] = SCR.get(k); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, w, h); return [c, g]; }

// ---------------------------------------------------------------- 2.5D camera
// cam = { x, y, z, sx, sy }: world point (x, y) appears at screen point (sx, sy) (default centre) with zoom z.
// A layer with parallax p uses zoom 1 + (z - 1) * p and a focus moved p of the way: p = 0 sky (static), 1 = focus plane, >1 foreground.
export function camApply(ctx, cam, p = 1) {
  const z = Math.max(.05, 1 + (cam.z - 1) * p), fx = W / 2 + (cam.x - W / 2) * p, fy = H / 2 + (cam.y - H / 2) * p;
  ctx.translate(cam.sx ?? W / 2, cam.sy ?? H / 2); ctx.scale(z, z); ctx.translate(-fx, -fy);
}
// world -> screen for parallax p
export function toScreen(cam, p, x, y) {
  const z = Math.max(.05, 1 + (cam.z - 1) * p), fx = W / 2 + (cam.x - W / 2) * p, fy = H / 2 + (cam.y - H / 2) * p;
  return [(cam.sx ?? W / 2) + (x - fx) * z, (cam.sy ?? H / 2) + (y - fy) * z];
}
// draw a baked layer {c, ox, oy, s} (s = bake scale; the canvas covers world from ox,oy) with parallax p
export function lay(ctx, L, cam, p = 1, { a = 1, op = null } = {}) {
  ctx.save(); camApply(ctx, cam, p); if (a !== 1) ctx.globalAlpha = a; if (op) ctx.globalCompositeOperation = op;
  const s = L.s || 1; ctx.drawImage(L.c, L.ox, L.oy, L.c.width / s, L.c.height / s); ctx.restore();
}
// make a baked layer covering world [x0, x0+w] x [y0, y0+h]; fn(g) draws in world coords
export function bake(x0, y0, w, h, fn, s = 1) {
  const [c, g] = layer(Math.ceil(w * s), Math.ceil(h * s)); g.scale(s, s); g.translate(-x0, -y0); fn(g, c); return { c, ox: x0, oy: y0, s };
}
// soft camera drift that never stops
export const breathe = (t, a = 1, ph = 0) => ({ dx: drift(t, 5 * a, ph), dy: drift(t, 3.2 * a, ph + 2), dz: .004 * a * Math.sin(t * .41 + ph) });

// the per-shot finish: paper tooth + fine grain (the engine adds the global vignette + grain on top)
export function fin(ctx, { vig = .22, grain = .07, tint = null } = {}) { printFinish(ctx, { grain, vig, tint }); }

// ---------------------------------------------------------------- the message light (cyan, the only machine colour)
export function msgLight(ctx, x, y, a = 1, r = 60) {
  if (a <= 0) return;
  addGlow(ctx, x, y, r * 2.4, .28 * a, K.cyan, K.cyanW);
  addGlow(ctx, x, y, r, .7 * a, K.cyan, '#ffffff');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55 * a; ctx.strokeStyle = K.cyanW; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(x - r * 1.3, y); ctx.lineTo(x + r * 1.3, y); ctx.moveTo(x, y - r * .7); ctx.lineTo(x, y + r * .7); ctx.stroke(); ctx.restore();
}

// ---------------------------------------------------------------- the morning stripe texture
// a horizontal band 1600 x 160: smooth amber core, stippled soft edges, dust specks. Drawn with any transform.
export function stripeTex(col = K.amber, key = 'a') {
  return once('stripe:' + key + col, () => {
    const [c, g] = layer(1600, 160);
    const lg = g.createLinearGradient(0, 0, 0, 160); lg.addColorStop(0, rgba(col, 0)); lg.addColorStop(.3, rgba(col, .55)); lg.addColorStop(.45, rgba(K.hot, .95)); lg.addColorStop(.55, rgba(K.hot, .95)); lg.addColorStop(.7, rgba(col, .55)); lg.addColorStop(1, rgba(col, 0));
    g.fillStyle = lg; g.fillRect(0, 0, 1600, 160);
    maskLinear(c, 0, 0, 1600, 0, [[0, 0], [.06, 1], [.9, 1], [1, 0]]);
    stipple(c, { k: .85, g: 1.15, seed: 7 });
    return c;
  });
}
// draw the stripe as a quad [p0 (start, top edge), p1 (end, top edge), p2 (end, bottom), p3 (start, bottom)] (affine from 3 pts)
export function stripeQuad(ctx, p0, p1, p3, a = 1, u0 = 0, u1 = 1, tex = stripeTex()) {
  if (a <= 0 || u1 <= u0) return;
  const ax = (p1[0] - p0[0]), ay = (p1[1] - p0[1]), bx = (p3[0] - p0[0]), by = (p3[1] - p0[1]);
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter';
  ctx.transform(ax / 1600, ay / 1600, bx / 160, by / 160, p0[0], p0[1]);
  ctx.drawImage(tex, u0 * 1600, 0, (u1 - u0) * 1600, 160, u0 * 1600, 0, (u1 - u0) * 1600, 160);
  ctx.restore();
}

// ---------------------------------------------------------------- dust motes in a light beam
export function motes(ctx, t, n, box, { seed = 3, col = K.hot, a = .7, speed = 1, inFn = null } = {}) {
  const r = prng(seed), [x0, y0, w, h] = box;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const u = r(), v = r(), m = r(), ph = r() * 7;
    const x = x0 + ((u * w + t * 9 * speed * (m - .4) + Math.sin(t * .6 + ph) * 14) % w + w) % w, y = y0 + ((v * h - t * 6 * speed * (.3 + m)) % h + h) % h;
    const k = inFn ? inFn(x, y) : 1; if (k <= 0.01) continue;
    const tw = .55 + .45 * Math.sin(t * (1.5 + m * 2) + ph);
    ctx.fillStyle = rgba(col, a * k * tw * (.3 + .7 * m)); const s = m > .85 ? 2.2 : 1.3; ctx.fillRect(x, y, s, s);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- sky helpers
export const SKY = {
  blue: [[0, '#14173f'], [.35, '#2c2a66'], [.62, '#6a4a86'], [.82, '#d98488'], [1, '#f4b08a']],
  gold: [[0, '#3c4f86'], [.35, '#8a86a8'], [.65, '#f0c898'], [.85, '#ffdca6'], [1, '#fff0cc']],
  night: [[0, '#05071a'], [.45, '#0e1438'], [.8, '#1c2a55'], [1, '#2a3a66']],
  dusk: [[0, '#151440'], [.4, '#3a2a68'], [.75, '#8a4c7a'], [1, '#e08a72']],
  dawn: [[0, '#2a2c6a'], [.3, '#6a4f8e'], [.55, '#d98a8e'], [.75, '#f6b48a'], [.9, '#ffd59a'], [1, '#fff0cc']],
};
export function skyFill(g, stops, x0, y0, w, h) { const lg = g.createLinearGradient(0, y0, 0, y0 + h); for (const [o, c] of stops) lg.addColorStop(o, c); g.fillStyle = lg; g.fillRect(x0, y0, w, h); }
export function starField(g, x0, y0, w, h, n, seed = 5, a = 1, col = '#d8e4ff') {
  const r = prng(seed); for (let i = 0; i < n; i++) { const x = x0 + r() * w, y = y0 + Math.pow(r(), 1.5) * h, m = r(); g.fillStyle = rgba(col, a * (.12 + .6 * m * m) * (1 - (y - y0) / h * .7)); const s = m > .96 ? 2.2 : m > .8 ? 1.6 : 1.1; g.fillRect(x, y, s, s); }
}
// hatched cloud strata (Stauffer pins): rows [[y, x0, x1, th]]
export function strata(g, rows, { fill = '#e88a8a', fa = .4, line = '#ffd0b0', la = .5, seed = 4, mask = null } = {}) {
  const [hc, hx] = layer(g.canvas.width, g.canvas.height); hx.setTransform(g.getTransform()); hx.save(); hx.beginPath();
  for (const [y, x0, x1, th] of rows) stratus(hx, y, x0, x1, th, Math.round(y + x0));
  hx.fillStyle = rgba(fill, fa); hx.fill(); hx.clip();
  const ys = rows.map((r0) => r0[0]), y0 = Math.min(...ys) - 80, y1 = Math.max(...ys) + 40;
  hatch(hx, [-800, y0, W + 3200, y1 - y0], { angle: -0.012, gap: 4, w: 1, col: line, a: la, seed, broken: .3 }); hx.restore();
  if (mask) mask(hc);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(hc, 0, 0); g.restore();
}

// ================================================================= THE HARBOUR FRONT
// World: our harbour town along a quay, x 0..1920 (waterline ~ y 712, receding slightly to the right), hills behind.
// ext > 0 extends the coast to the right: a headland and the next bay with its own town (x 2200..2200+ext).
// Modes: blue (blue hour, before the wave), gold (sunny morning), night, dawn (rose/peach, our town lit, next bay dark), dusk.
const HPAD = 360;
const shoreY = (x) => 712 - 34 * clamp(x / 1920, -.3, 2.2) + 10 * Math.sin(x * .0021);
const townScale = (x) => clamp(1.05 - .42 * x / 1920, .38, 1.2);
const HMODE = {
  blue: { sky: SKY.blue, ridge: ['#4a3a72', '#33295c'], walls: ['#2c2452', '#352a5c', '#2a2a5a', '#3b2c5a', '#30254e', '#272a55'], water: ['#5a4378', '#1f1c48'], fog: '#b88aa8', fogA: .32, sky2: '#f4a08a', stars: .5, lit: 0 },
  gold: { sky: SKY.gold, ridge: ['#9a8aa8', '#6e6a92'], walls: ['#c8946a', '#d9a878', '#b88866', '#e0b488', '#a87a64', '#cf9c70'], water: ['#e9c08a', '#5a5a86'], fog: '#fff0d0', fogA: .3, sky2: '#ffe6b0', stars: 0, lit: 0, sunlit: 1 },
  night: { sky: SKY.night, ridge: ['#1c2650', '#121a3c'], walls: ['#1a1d42', '#221f44', '#1c2248', '#271f40', '#18203e', '#20243f'], water: ['#16204a', '#060818'], fog: '#5f7cb0', fogA: .3, sky2: '#2a3a6a', stars: 1, lit: 1 },
  dusk: { sky: SKY.dusk, ridge: ['#4a3060', '#2e2250'], walls: ['#2a2048', '#33264e', '#2a2450', '#3a2848', '#2c2046'], water: ['#5a3a68', '#1a1640'], fog: '#c08aa0', fogA: .3, sky2: '#e89078', stars: .3, lit: .4 },
  dawn: { sky: SKY.dawn, ridge: ['#8a6a96', '#5a4a80'], walls: ['#4a3a6a', '#5a426e', '#43406c', '#5c4466', '#4c3a62', '#3e3c66'], water: ['#e0a08e', '#3a3468'], fog: '#ffd0b8', fogA: .36, sky2: '#ffd59a', stars: .15, lit: 1, sun: [2600, 600] },
};
export function harbour(mode = 'blue', ext = 0) {
  return once(`harb:${mode}:${ext}`, () => {
    const M = HMODE[mode], x0 = -HPAD, X1 = W + HPAD + ext, y0 = -HPAD, y1 = H + HPAD, ww = X1 - x0, hh = y1 - y0;
    const out = { mode, ext, M };
    const sun = M.sun;
    // ---- sky
    out.sky = bake(x0, y0, ww, hh, (g) => {
      skyFill(g, M.sky, x0, y0, ww, 760 - y0);
      g.fillStyle = M.sky[M.sky.length - 1][1]; g.fillRect(x0, 760, ww, y1 - 760);
      if (M.stars) starField(g, x0, y0, ww, 520 - y0, Math.round(ww * .14), 5, M.stars);
      if (sun) { const rg = g.createRadialGradient(sun[0], sun[1], 0, sun[0], sun[1], 1500); rg.addColorStop(0, rgba('#fff3dc', .95)); rg.addColorStop(.1, rgba(K.gold, .7)); rg.addColorStop(.4, rgba(K.coral, .25)); rg.addColorStop(1, rgba(K.coral, 0)); g.fillStyle = rg; g.fillRect(x0, y0, ww, hh); }
      if (mode === 'blue' || mode === 'dusk' || mode === 'dawn') strata(g, [[300, -300, 900, 16], [360, 500, 1700, 22], [250, 1200, 2400, 12], [420, -200, 700, 10], [330, 2200, 3600, 18], [400, 2600, 4200, 12]], { fill: mode === 'dawn' ? '#f4a08a' : '#c87a92', fa: mode === 'dawn' ? .5 : .35, line: mode === 'dawn' ? '#ffe0c0' : '#f0b0b0', la: .45, seed: 3 });
      if (mode === 'gold') strata(g, [[260, -200, 1000, 14], [330, 700, 2000, 18]], { fill: '#fff0d8', fa: .4, line: '#ffffff', la: .4, seed: 9 });
      if (mode === 'night') strata(g, [[220, -200, 900, 10], [300, 900, 2300, 14]], { fill: '#2a3a6a', fa: .4, line: '#6f8cbc', la: .35, seed: 4 });
      // a soft horizon glow
      { const hg = g.createLinearGradient(0, 380, 0, 740); hg.addColorStop(0, rgba(M.sky2, 0)); hg.addColorStop(1, rgba(M.sky2, .45)); g.fillStyle = hg; g.fillRect(x0, 380, ww, 360); }
    }, .5);
    // ---- far ridges (two silhouettes) with fog between
    out.ridge = bake(x0, 200, ww, 700, (g) => {
      const n = vnoise(31);
      const ridge = (base, amp, f, col, seed, xa = x0, xb = X1) => { const pts = [[xa, 900]]; for (let x = xa; x <= xb; x += 10) pts.push([x, base(x) - amp * fbm(vnoise(seed), x * f, seed, 4)]); pts.push([xb, 900]); roughPoly(g, pts, col, { amp: 1.5, seed }); };
      ridge((x) => shoreY(x) - 130 + 60 * clamp((x - 2000) / 600, 0, 1) - 40 * clamp(x / 1920 - .5, 0, 1), 140, .0016, M.ridge[0], 3);
      fog(g, { y0: 420, y1: 720, col: M.fog, a: M.fogA * 1.3, seed: 11, cover: .7, soft: .5, k: .35, sx: .004, sy: .02, x0: 0, x1: W });
      ridge((x) => shoreY(x) - 40 - 10 * Math.sin(x * .004), 90, .0022, M.ridge[1], 5);
      // headland to the right of our harbour (separates the two bays)
      if (ext) { const hx = 2050; const pts = [[hx - 220, 760]]; for (let x = hx - 220; x <= hx + 420; x += 8) { const q = (x - hx + 220) / 640; pts.push([x, 690 - 210 * Math.sin(Math.PI * Math.pow(q, .8)) * (1 - .15 * n(x * .02, 1))]); } pts.push([hx + 420, 760]); roughPoly(g, pts, shade(M.ridge[1], -.03), { amp: 2, seed: 8 }); }
      if (mode === 'gold') { const sg = g.createLinearGradient(0, 300, 0, 760); sg.addColorStop(0, rgba('#fff0cc', .0)); sg.addColorStop(1, rgba('#fff0cc', .35)); g.fillStyle = sg; g.fillRect(x0, 300, ww, 460); }
    }, .5);
    // ---- the town: three rows of houses, back rows smaller and foggier; each house different
    const wins = []; const r = prng(mode === 'dawn' ? 77 : 77);
    const walls = M.walls;
    const town = (g, xa, xb, litP, seedOff, dark = false) => {
      const rr = prng(77 + seedOff);
      for (let row = 2; row >= 0; row--) {
        let x = xa + rr() * 30;
        while (x < xb) {
          const sc = townScale(x) * [1, .78, .6][row], wdt = (54 + rr() * 64) * sc, hgt = (64 + rr() * 90) * sc * [1, 1.05, 1.1][row];
          const gy = shoreY(x) - 20 - row * 46 * townScale(x) - (row ? rr() * 14 * sc : 0);
          if (row && rr() < .18) { x += wdt * .9; continue; }
          let wall = walls[Math.floor(rr() * walls.length)];
          wall = mixHex(wall, M.fog, row * .16 + (dark ? .1 : 0));
          if (dark) wall = shade(wall, -.06);
          const res = house(g, rr, x + wdt / 2, gy, wdt, hgt, { wall, lit: () => 0, skip: .3, winOff: shade(wall, -.07), floorH: 28 * sc + 6, colW: 24 * sc + 4, sideCol: shade(wall, -.05), side: row === 0 ? (rr() < .5 ? -.1 : .1) : 0, chimney: .45, bay: .25, amp: .5 + sc * .6, roofCol: shade(wall, -.035),
            light: M.sunlit ? { x: x + wdt, y: gy - hgt, col: '#ffe2b0', a: .35, r: hgt * 1.4 } : (row === 0 && !dark ? { x: x + wdt / 2, y: gy + 30, col: mode === 'blue' ? '#e88f86' : K.amber, a: mode === 'blue' ? .18 : .22, r: hgt } : null) });
          for (const wn of res.win) { if (wn.door && row) continue; const hsh = hash(wn.x * .37 + seedOff, wn.y * .71); wins.push({ x: wn.x, y: wn.y, w: wn.w, h: wn.h, row, door: !!wn.door, lit: hsh < litP, v: .7 + .3 * hash(wn.x, 3), ph: hash(wn.y, 9), dark }); }
          x += wdt + (rr() * 6 - 1) * sc;
        }
        if (row) fog(g, { y0: shoreY(960) - 150 - row * 40, y1: shoreY(960) - 10 - row * 40, col: M.fog, a: M.fogA * .7, seed: 40 + row + seedOff, cover: .7, soft: .4, k: .3, sx: .005, sy: .03, edgeTop: .7, edgeBot: .3, x0: Math.max(0, xa), x1: Math.min(W, xb) });
      }
    };
    out.town = bake(x0, 200, ww, 620, (g) => {
      town(g, -300, 1980, .62, 0);
      if (ext) town(g, 2380, 2200 + ext, .02, 50, true);
      // quay wall
      const q = []; for (let x = x0; x <= X1; x += 12) q.push([x, shoreY(x) - 20]); for (let x = X1; x >= x0; x -= 12) q.push([x, shoreY(x) + 4]);
      roughPoly(g, q, shade(walls[0], -.08), { amp: 1, seed: 3 });
      g.strokeStyle = rgba(M.sky2, .35); g.lineWidth = 1.4; g.beginPath(); for (let x = x0; x <= X1; x += 12) g.lineTo(x, shoreY(x) - 20); g.stroke();
      // lamp posts on the quay (dark), boats' masts are per frame
      const lamps = []; for (let x = -200; x < 1960; x += 120 * townScale(x) + 14) lamps.push(x);
      out.lamps = lamps;
      for (const lx of lamps) { const sc = townScale(lx), y = shoreY(lx) - 20; roughLine(g, [[lx, y], [lx, y - 58 * sc]], { w: 2.4 * sc, col: shade(walls[0], -.12), seed: lx | 0 }); g.fillStyle = shade(walls[0], -.12); g.fillRect(lx - 5 * sc, y - 60 * sc, 11 * sc, 4 * sc); }
    }, .75);
    out.wins = wins;
    // ---- lit layer extras (baked): lamp cones and the warm wash along the quay, bloom around the lit town
    out.glow = bake(x0, 200, ww, 700, (g) => {
      for (const lx of out.lamps) { const sc = townScale(lx), y = shoreY(lx) - 20; const [cc, cg] = layer(160, 140); const lg = cg.createRadialGradient(80, 6, 0, 80, 6, 120); lg.addColorStop(0, rgba(K.hot, .8)); lg.addColorStop(.3, rgba(K.amber, .35)); lg.addColorStop(1, rgba(K.amber, 0)); cg.fillStyle = lg; cg.beginPath(); cg.moveTo(80, 4); cg.lineTo(0, 140); cg.lineTo(160, 140); cg.closePath(); cg.fill(); stip(cc, { k: .6, seed: lx | 0 }); g.drawImage(cc, lx - 80 * sc * .7, y - 58 * sc, 160 * sc * .7, 140 * sc * .55); }
      for (const wn of wins) if (wn.lit && !wn.dark) { const rg = g.createRadialGradient(wn.x, wn.y + wn.h / 2, 0, wn.x, wn.y + wn.h / 2, wn.w * 2.2); rg.addColorStop(0, rgba(K.amber, .28)); rg.addColorStop(1, rgba(K.amber, 0)); g.fillStyle = rg; g.fillRect(wn.x - wn.w * 2.2, wn.y + wn.h / 2 - wn.w * 2.2, wn.w * 4.4, wn.w * 4.4); }
      const [bc, bg] = layer(Math.ceil(ww * .5), 350); bg.scale(.5, .5); bg.translate(-x0, -500);
      const rg = bg.createRadialGradient(900, 700, 0, 900, 700, 1200); rg.addColorStop(0, rgba(K.amber, .38)); rg.addColorStop(.5, rgba(K.amber, .12)); rg.addColorStop(1, rgba(K.amber, 0));
      bg.save(); bg.translate(900, 700); bg.scale(1, .22); bg.translate(-900, -700); bg.fillStyle = rg; bg.fillRect(-400, -4000, 2800, 9000); bg.restore();
      stip(bc, { k: .4, seed: 5 }); g.drawImage(bc, x0, 500, ww, 700);
    }, .5);
    // ---- water + baked reflections
    out.water = bake(x0, 600, ww, y1 - 600, (g) => {
      const lg = g.createLinearGradient(0, 700, 0, y1); lg.addColorStop(0, M.water[0]); lg.addColorStop(1, M.water[1]); g.fillStyle = lg; g.fillRect(x0, 600, ww, y1 - 600);
      const rr = prng(12);
      // sky reflection streaks
      for (let i = 0; i < ww * .5; i++) { const y = 700 + Math.pow(rr(), 1.4) * (y1 - 700), x = x0 + rr() * ww, d = (y - 700) / (y1 - 700); g.fillStyle = rgba(M.sky2, (.05 + .14 * rr()) * (1 - d * .6)); g.fillRect(x, y, (14 + rr() * 60) * (1 + d * 2), 1.2 + d * 1.5); }
      // dark mirrored band of the town
      const mg = g.createLinearGradient(0, 700, 0, 820); mg.addColorStop(0, rgba(shade(walls[0], -.1), .7)); mg.addColorStop(1, rgba(shade(walls[0], -.1), 0)); g.fillStyle = mg; g.fillRect(x0, 690, ww, 140);
      if (sun) { const sx = sun[0]; for (let i = 0; i < 700; i++) { const y = 700 + Math.pow(rr(), 1.2) * (y1 - 700), d = (y - 700) / (y1 - 700), x = sx + (rr() - .5) * (40 + d * 900); g.fillStyle = rgba(rr() < .5 ? K.hot : '#fff3dc', (.25 + .5 * rr()) * (1 - d * .5)); g.fillRect(x, y, (6 + rr() * 30) * (1 + d * 2), 1.5 + d * 2); } }
      if (M.sunlit) { for (let i = 0; i < 500; i++) { const y = 700 + Math.pow(rr(), 1.2) * (y1 - 700), d = (y - 700) / (y1 - 700), x = 300 + (rr() - .5) * (100 + d * 1400); g.fillStyle = rgba('#fff6dc', (.2 + .5 * rr()) * (1 - d * .3)); g.fillRect(x, y, (6 + rr() * 40) * (1 + d * 2), 1.5 + d * 2); } }
    }, .5);
    out.refl = bake(x0, 690, ww, 420, (g) => {
      const rr = prng(13);
      for (const wn of wins) { if (!wn.lit || wn.dark || rr() < .35) continue; const sy = shoreY(wn.x) + 4, len = 40 + (sy - wn.y) * 1.2 * (.6 + .6 * rr()); for (let y = sy + 4; y < sy + len; y += 3 + rr() * 5) { if (rr() < .3) continue; const d = (y - sy) / len, w = (2 + rr() * 6) * (1 + d * 2); g.fillStyle = rgba(rr() < .7 ? K.amber : K.hot, .45 * (1 - d) * (.4 + .6 * rr())); g.fillRect(wn.x - w / 2 + Math.sin(y * .3) * 2 * (1 + d * 3), y, w, 1.6); } }
      for (const lx of out.lamps) { const sy = shoreY(lx) + 4; for (let y = sy + 4; y < sy + 150; y += 4 + rr() * 5) { const d = (y - sy) / 150; g.fillStyle = rgba(K.hot, .5 * (1 - d) * rr()); const w = 3 + rr() * 9; g.fillRect(lx - w / 2 + Math.sin(y * .3) * 3, y, w, 1.6); } }
    }, .75);
    // ---- low mist over the water near the quay (drifts per frame)
    out.mist = bake(0, 560, W, 300, (g) => { fog(g, { y0: 600, y1: 800, col: M.fog, a: M.fogA * 1.2, seed: 61, cover: .62, soft: .5, k: .35, sx: .003, sy: .03, edgeTop: .5, edgeBot: .4 }); }, .5);
    return out;
  });
}
// boats moored along the quay (per frame, bobbing)
const BOATS = [[180, 1.0], [520, .9, 1], [1130, .75], [1460, .66, 1], [1720, .6]];
function boats(g, t, M, darkCol) {
  for (const [bx, s0, mast] of BOATS) {
    const s = s0 * townScale(bx) * 1.05, y = shoreY(bx) + 26 * s + 6 + Math.sin(t * 1.1 + bx) * 1.6, rot = Math.sin(t * .9 + bx * .3) * .025;
    g.save(); g.translate(bx, y); g.rotate(rot);
    g.fillStyle = darkCol; g.beginPath(); g.moveTo(-46 * s, -8 * s); g.lineTo(52 * s, -10 * s); g.quadraticCurveTo(44 * s, 6 * s, 30 * s, 8 * s); g.lineTo(-36 * s, 8 * s); g.quadraticCurveTo(-46 * s, 2 * s, -46 * s, -8 * s); g.fill();
    g.fillRect(-14 * s, -22 * s, 26 * s, 13 * s);
    if (mast) { g.fillRect(-2 * s, -92 * s, 2.4 * s, 80 * s); g.strokeStyle = rgba(darkCol, .8); g.lineWidth = 1; g.beginPath(); g.moveTo(-1 * s, -90 * s); g.lineTo(46 * s, -10 * s); g.stroke(); }
    g.strokeStyle = rgba(M.sky2, .35); g.lineWidth = 1.2; g.beginPath(); g.moveTo(-46 * s, -8 * s); g.lineTo(52 * s, -10 * s); g.stroke();
    g.restore();
    g.fillStyle = rgba(darkCol, .5); g.fillRect(bx - 40 * s, y + 10 * s, 80 * s, 2); g.fillRect(bx - 30 * s + Math.sin(t + bx) * 3, y + 16 * s, 60 * s, 1.5);
  }
}
// Draw the harbour. o.ign: ignition wave 0..1 (null = all lit per mode), o.cx = wave centre, o.flick = {x,y, a} single window flicker
export function drawHarbour(ctx, t, cam, mode = 'blue', o = {}) {
  const P = harbour(mode, o.ext || 0), M = P.M;
  const ign = o.ign ?? M.lit, cx = o.cx ?? 960;
  if (!o.noSky) lay(ctx, P.sky, cam, .04);
  ctx.save(); ctx.globalAlpha = .9;
  lay(ctx, P.ridge, cam, .18); ctx.restore();
  const pT = .38, pW = .55;
  lay(ctx, P.water, cam, pW);
  // ignited windows (per window, staggered from the centre outward) + baked glow masked by the same front
  const front = ign >= 1 ? 1e5 : ign * 1500;
  if (ign > 0) {
    // reflections and glow: reveal with a soft radial mask around cx (half res scratch)
    const reveal = (L, p, a) => {
      if (front > 9e4) { lay(ctx, L, cam, p, { a, op: 'lighter' }); return; }
      const [sc, sg] = scratch('hreveal', W / 2, H / 2); sg.scale(.5, .5); camApply(sg, cam, p); const s = L.s || 1; sg.drawImage(L.c, L.ox, L.oy, L.c.width / s, L.c.height / s);
      sg.setTransform(.5, 0, 0, .5, 0, 0); camApply(sg, cam, p); sg.globalCompositeOperation = 'destination-in';
      const rg = sg.createRadialGradient(cx, 700, 0, cx, 700, front + 10); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(Math.max(.01, 1 - 120 / (front + 10)), 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
      sg.fillStyle = rg; sg.fillRect(-2000, -2000, 9000, 6000);
      ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(sc, 0, 0, W, H); ctx.restore();
    };
    reveal(P.refl, pW, 1);
  }
  lay(ctx, P.mist, cam, pW, { a: .8 }); // static part; the drifting copy below
  ctx.save(); camApply(ctx, cam, pW); ctx.globalAlpha = .5; const mx = (t * 14) % W; ctx.drawImage(P.mist.c, mx - W, 560, W, 300); ctx.drawImage(P.mist.c, mx, 560, W, 300); ctx.restore();
  lay(ctx, P.town, cam, pT);
  ctx.save(); camApply(ctx, cam, pT);
  for (const wn of P.wins) {
    if (!wn.lit || wn.dark) continue;
    let a = 1;
    if (front < 9e4) { const d = Math.abs(wn.x - cx) + Math.abs(wn.y - 600) * .5 + wn.ph * 60; a = clamp((front - d) / 50); }
    if (o.flick && Math.abs(wn.x - o.flick.x) < 1 && Math.abs(wn.y - o.flick.y) < 1) a *= o.flick.a;
    if (a <= 0) continue;
    const pop = a < 1 ? 1 + .6 * Math.sin(a * Math.PI) : 1;
    ctx.globalAlpha = a * wn.v; ctx.fillStyle = wn.v > .9 ? '#fff0c8' : K.hot; ctx.fillRect(wn.x - wn.w / 2, wn.y, wn.w, wn.h);
    if (pop > 1.01) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = (pop - 1) * .7; ctx.fillStyle = K.amber; ctx.fillRect(wn.x - wn.w, wn.y - wn.h * .3, wn.w * 2, wn.h * 1.6); ctx.globalCompositeOperation = 'source-over'; }
    if (wn.w > 6 && !wn.door) { ctx.globalAlpha = a * .6; ctx.fillStyle = '#5a3a2a'; ctx.fillRect(wn.x - .5, wn.y, 1, wn.h); ctx.fillRect(wn.x - wn.w / 2, wn.y + wn.h * .45, wn.w, 1); }
  }
  ctx.globalAlpha = 1;
  if (o.flick && o.flick.glow > 0) { addGlow(ctx, o.flick.x, o.flick.y + 6, 60, .5 * o.flick.glow, K.amber, K.hot); }
  boats(ctx, t, M, shade(M.walls[0], -.12));
  ctx.restore();
  if (ign > 0) {
    if (front > 9e4) lay(ctx, P.glow, cam, pT, { a: Math.min(1, ign) * (o.glowA ?? 1), op: 'lighter' });
    else {
      const [sc, sg] = scratch('hreveal2', W / 2, H / 2); sg.scale(.5, .5); camApply(sg, cam, pT); const L = P.glow, s = L.s; sg.drawImage(L.c, L.ox, L.oy, L.c.width / s, L.c.height / s);
      sg.globalCompositeOperation = 'destination-in'; const rg = sg.createRadialGradient(cx, 650, 0, cx, 650, front + 10); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(Math.max(.01, 1 - 160 / (front + 10)), 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = rg; sg.fillRect(-2000, -2000, 9000, 6000);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(sc, 0, 0, W, H); ctx.restore();
    }
  }
  // glints on the water (per frame, drifting)
  ctx.save(); camApply(ctx, cam, pW); ctx.globalCompositeOperation = 'lighter';
  const r = prng(21), gx = M.sun ? M.sun[0] : (M.sunlit ? 300 : cx);
  for (let i = 0; i < 140; i++) { const y = 712 + Math.pow(r(), 1.5) * 420, d = (y - 712) / 420, x = gx + (r() - .5) * (300 + d * 1300) + drift(t, 6, i) , tw = .5 + .5 * Math.sin(t * (2 + r() * 3) + i); ctx.fillStyle = rgba(M.sun || M.sunlit ? '#fff3dc' : (ign > .5 ? K.hot : M.sky2), (.15 + .35 * r()) * tw * (M.sun || M.sunlit ? 1 : .6 + .4 * ign)); ctx.fillRect(x, y, (4 + r() * 16) * (1 + d * 2), 1.4 + d * 1.4); }
  ctx.restore();
}
// screen position of a window (for push-ins): pick the lit window nearest to (x, y) in town space
export function harbourWindow(mode, x, y, ext = 0) {
  const P = harbour(mode, ext); let best = null, bd = 1e9;
  for (const wn of P.wins) { if (!wn.lit || wn.dark || wn.row) continue; const d = Math.hypot(wn.x - x, wn.y - y); if (d < bd) { bd = d; best = wn; } }
  return best;
}
export const HARBOUR_P = { town: .38, water: .55 };

// ================================================================= THE BEDROOM (K1 composition, print look)
// window hole at WX..WX+WW, WY..WY+WH. Modes: blue (blue hour), gold (amber flood), dawn (empty bed, window open, rose-gold).
export const WIN = { x: 1010, y: 110, w: 760, h: 640 };
const BED = { x: 120, y: 760 };
export function bedroom(mode = 'blue') {
  return once('bed:' + mode, () => {
    const pad = 260, x0 = -pad, y0 = -pad, ww = W + 2 * pad, hh = H + 2 * pad;
    const warm = mode === 'gold', dawn = mode === 'dawn';
    const wallTop = warm ? '#8a4632' : dawn ? '#3a2c56' : '#141640', wallMid = warm ? '#c8784c' : dawn ? '#4c3560' : '#1b1d50', wallBot = warm ? '#7a3a26' : dawn ? '#2c2246' : '#0f1034';
    const lightCol = warm ? K.amber : dawn ? K.peach : '#e8a0a0';
    const { x: wx, y: wy, w: ww0, h: wh } = WIN;
    const out = {};
    out.room = bake(x0, y0, ww, hh, (g) => {
      // wall (with the window cut out)
      g.save(); g.beginPath(); g.rect(x0, y0, ww, hh); g.rect(wx, wy, ww0, wh);
      const lg = g.createLinearGradient(0, y0, 0, 900); lg.addColorStop(0, wallTop); lg.addColorStop(.6, wallMid); lg.addColorStop(1, wallBot); g.fillStyle = lg; g.fill('evenodd'); g.clip('evenodd');
      // light from the window on the wall: soft radial with stippled falloff
      { const [c, lc] = layer(W + 2 * pad, H + 2 * pad); lc.translate(pad, pad); const rg = lc.createRadialGradient(wx + ww0 * .4, wy + wh * .55, 100, wx + ww0 * .4, wy + wh * .55, 1100); rg.addColorStop(0, rgba(warm ? K.hot : lightCol, warm ? .6 : .28)); rg.addColorStop(.5, rgba(lightCol, warm ? .25 : .08)); rg.addColorStop(1, rgba(lightCol, 0)); lc.fillStyle = rg; lc.fillRect(-pad, -pad, W + 2 * pad, H + 2 * pad); stip(c, { k: .55, g: 1.2, seed: 2 }); g.drawImage(c, x0, y0); }
      // wall hatching in the shadowed left part (pen lines)
      g.save(); g.beginPath(); g.rect(x0, y0, 900 - x0, 900 - y0); g.clip(); hatch(g, [x0, y0, 1000, 1100], { angle: -1.2, gap: 8, w: 1, col: warm ? '#5a2010' : '#05061a', a: warm ? .22 : .32, seed: 4, broken: .35 }); g.restore();
      // a framed picture (left wall) and a lamp shape, for scale and story
      roughRect(g, 300, 260, 190, 140, warm ? '#3a2226' : dawn ? '#2a2044' : '#0d0f30', { amp: 1, seed: 6 }); roughRect(g, 314, 274, 162, 112, warm ? '#8a5a46' : dawn ? '#5a4470' : '#202458', { amp: .8, seed: 7 });
      g.strokeStyle = rgba(lightCol, .5); g.lineWidth = 1.2; g.beginPath(); g.moveTo(490, 262); g.lineTo(490, 400); g.stroke();
      // skirting board
      roughRect(g, x0, 846, ww, 16, warm ? '#3a2020' : '#0a0b28', { amp: .8, seed: 8 });
      g.restore();
      // window frame (deep reveal on the left = 3/4 view), cross bars, sill
      const fr = warm ? '#4a2014' : dawn ? '#241a3a' : '#0a0b26';
      roughPoly(g, [[wx - 22, wy - 22], [wx, wy], [wx, wy + wh], [wx - 22, wy + wh + 14]], shade(fr, .03), { amp: .6, seed: 9 });
      roughRect(g, wx - 16, wy - 16, ww0 + 32, 16, fr, { amp: .5, seed: 10 }); roughRect(g, wx - 16, wy, 16, wh, fr, { amp: .5, seed: 11 }); roughRect(g, wx + ww0, wy, 16, wh, fr, { amp: .5, seed: 12 });
      if (!dawn) { roughRect(g, wx + ww0 / 2 - 7, wy, 14, wh, fr, { amp: .5, seed: 13 }); roughRect(g, wx, wy + wh * .42 - 5, ww0, 11, fr, { amp: .5, seed: 14 }); }
      else { // casements open inward: two skewed sashes at the sides
        const sash = (xa, s) => { const q = [[xa, wy + 4], [xa + s * 150, wy - 30], [xa + s * 150, wy + wh + 50], [xa, wy + wh - 4]]; roughPoly(g, q, fr, { amp: .6, seed: xa | 0 }); const inner = [[xa + s * 16, wy + 22], [xa + s * 136, wy - 4], [xa + s * 136, wy + wh + 22], [xa + s * 16, wy + wh - 20]]; roughPoly(g, inner, rgba('#ffd9b0', .16), { amp: .4, seed: (xa | 0) + 1 }); g.strokeStyle = rgba('#ffe6c8', .35); g.lineWidth = 1.4; g.beginPath(); g.moveTo(inner[1][0], inner[1][1]); g.lineTo(inner[2][0], inner[2][1]); g.stroke(); };
        sash(wx, 1); sash(wx + ww0, -1); }
      roughRect(g, wx - 40, wy + wh, ww0 + 80, 20, warm ? '#6a3a30' : dawn ? '#4a3a66' : '#1d1f58', { amp: .6, seed: 15 });
      g.strokeStyle = rgba(lightCol, .6); g.lineWidth = 1.6; g.beginPath(); g.moveTo(wx - 38, wy + wh + 1); g.lineTo(wx + ww0 + 40, wy + wh + 1); g.stroke();
      // a plant on the sill (left corner)
      { const px = wx + 40, py = wy + wh; roughPoly(g, [[px - 22, py], [px - 18, py - 34], [px + 18, py - 34], [px + 22, py]], warm ? '#5a2a20' : '#0c0d2a', { amp: .5, seed: 16 }); g.fillStyle = warm ? '#2a2a1a' : '#0a0c22'; for (let i = 0; i < 9; i++) { const a = -2.6 + i * .28; limb(g, qpts([px, py - 32], [px + Math.cos(a) * 30, py - 50 + Math.sin(a) * 30], [px + Math.cos(a) * 64, py - 34 + Math.sin(a) * 70]), 7, 1, warm ? '#2a2a18' : '#0a0c22', i); } }
      // floor: boards in perspective toward a vanishing point at the window
      { const fy = 862; const lg2 = g.createLinearGradient(0, fy, 0, y0 + hh); lg2.addColorStop(0, warm ? '#9a5232' : dawn ? '#2e2444' : '#0f1032'); lg2.addColorStop(1, warm ? '#4a1e12' : dawn ? '#1a1430' : '#06071a'); g.fillStyle = lg2; g.fillRect(x0, fy, ww, y0 + hh - fy);
        const vp = [1200, 520]; g.strokeStyle = rgba(warm ? '#1a0a08' : '#000000', .45); g.lineWidth = 1.2;
        for (let i = -16; i <= 22; i++) { const xb = 960 + i * 150; const q = (fy - vp[1]) / (y0 + hh - vp[1]); g.beginPath(); g.moveTo(mix(vp[0], xb, q), fy); g.lineTo(xb, y0 + hh); g.stroke(); }
        g.save(); g.beginPath(); g.rect(x0, fy, ww, 600); g.clip(); hatch(g, [x0, fy, ww, 600], { angle: .02, gap: 9, w: 1, col: '#000000', a: .18, seed: 17, broken: .5 }); g.restore(); }
      // bed: headboard, frame, mattress, duvet (rounded mass), pillow; a small bedside table at the head
      const bx = BED.x, by = BED.y, bed = warm ? '#a85a48' : dawn ? '#3a2e5a' : '#2c2b66', duv = warm ? '#d08a62' : dawn ? '#5a4478' : '#2e2d6c';
      roughRect(g, bx - 54, 520, 34, 340, warm ? '#4a1e14' : '#0a0b24', { amp: .8, seed: 18 });
      roughRect(g, bx - 20, by + 40, 900, 110, warm ? '#4a1e14' : '#0a0b24', { amp: .8, seed: 19 });
      g.beginPath(); g.moveTo(bx - 24, by + 64); g.bezierCurveTo(bx + 100, by - 14, bx + 400, by + 26, bx + 620, by + 4); g.bezierCurveTo(bx + 760, by - 10, bx + 880, by + 20, bx + 902, by + 74); g.lineTo(bx + 902, by + 128); g.lineTo(bx - 24, by + 128); g.closePath(); g.fillStyle = duv; g.fill();
      // duvet folds: flow strokes + shadow hatching on the lower part
      g.save(); g.clip(); strokes(g, 22, (i, q) => [bx + q * 900, by + 20 + i * 4.6 + Math.sin(q * 9 + i) * 6], { w: 1.1, col: shade(duv, -.12), a: .5, seed: 20 }); hatch(g, [bx - 30, by + 40, 960, 100], { angle: -.4, gap: 6, w: 1, col: '#05061a', a: .35, seed: 21, broken: .3 });
      const dl = g.createLinearGradient(bx + 300, 0, bx + 900, 0); dl.addColorStop(0, rgba(lightCol, 0)); dl.addColorStop(1, rgba(lightCol, warm ? .45 : .3)); g.fillStyle = dl; g.fillRect(bx, by - 30, 920, 170); g.restore();
      g.strokeStyle = rgba(lightCol, .7); g.lineWidth = 2; g.beginPath(); g.moveTo(bx + 340, by + 16); g.bezierCurveTo(bx + 500, by + 4, bx + 700, by - 12, bx + 900, by + 70); g.stroke();
      roughPoly(g, Array.from({ length: 24 }, (_, i) => { const a = i / 24 * 6.283; return [bx + 110 + Math.cos(a) * 124, by - 2 + Math.sin(a) * 34 - .08 * Math.cos(a) * 124 * .3]; }), warm ? '#f0c8a0' : dawn ? '#7a6898' : '#3a3878', { amp: 1.2, seed: 22 });
      // bedside table (left of the headboard is off-frame; we put it at the foot side right, near the window)
      // (the close-up in 0.02 shows it; here a low silhouette)
      roughRect(g, bx + 940, 760, 120, 18, warm ? '#3a1c1a' : '#0b0c2a', { amp: .5, seed: 23 }); roughRect(g, bx + 950, 778, 12, 84, warm ? '#2a1414' : '#090a24', { amp: .4, seed: 24 }); roughRect(g, bx + 1038, 778, 12, 84, warm ? '#2a1414' : '#090a24', { amp: .4, seed: 25 });
      roughPoly(g, [[bx + 980, 760], [bx + 1020, 760], [bx + 1014, 752], [bx + 986, 752]], warm ? '#c08a60' : '#2a2c66', { amp: .3, seed: 26 });
    });
    // the light patch on the floor (stippled), with the cross shadow of the window bars; drawn additively
    out.patch = bake(x0, 800, ww, 600, (g) => {
      const q = [[wx + 60, 862], [wx + ww0 - 40, 862], [wx + ww0 - 420, 1180], [wx - 640, 1180]];
      const [c, lc] = layer(ww, 600); lc.translate(-x0, -800);
      const lg = lc.createLinearGradient(wx + 300, 862, wx - 200, 1180); lg.addColorStop(0, rgba(warm ? K.hot : dawn ? K.peach : K.amber, warm ? .75 : .5)); lg.addColorStop(1, rgba(warm ? K.amber : K.coral, warm ? .25 : .12));
      lc.fillStyle = lg; lc.beginPath(); roughPath(lc, q, { amp: 2, seed: 3 }); lc.fill();
      if (!dawn) { lc.globalCompositeOperation = 'destination-out'; const L = (u, v) => [mix(mix(q[0][0], q[1][0], u), mix(q[3][0], q[2][0], u), v), mix(862, 1180, v)];
        lc.fillStyle = 'rgba(0,0,0,.85)'; lc.beginPath(); lc.moveTo(...L(.49, 0)); lc.lineTo(...L(.515, 0)); lc.lineTo(...L(.515, 1)); lc.lineTo(...L(.475, 1)); lc.fill();
        lc.beginPath(); lc.moveTo(...L(0, .36)); lc.lineTo(...L(1, .36)); lc.lineTo(...L(1, .4)); lc.lineTo(...L(0, .4)); lc.fill(); }
      stip(c, { k: .7, g: 1.2, seed: 4 }); g.drawImage(c, x0, 800);
    });
    out.lightCol = lightCol; out.mode = mode;
    return out;
  });
}
// curtain: a sheer on the left of the window, breathing; swing 0..1 swings it toward camera (fills the left of frame)
export function curtain(ctx, t, { swing = 0, col = K.cream, a = .2, x = WIN.x - 16 } = {}) {
  const top = WIN.y - 26, bot = WIN.y + WIN.h + 14, wv = 70 + swing * 900;
  ctx.save(); ctx.globalAlpha = a + swing * .35;
  const cg = ctx.createLinearGradient(x - 40, 0, x + wv + 60, 0); cg.addColorStop(0, rgba(col, 1)); cg.addColorStop(.6, rgba(col, .55)); cg.addColorStop(1, rgba(col, 0)); ctx.fillStyle = cg;
  ctx.beginPath(); ctx.moveTo(x, top);
  for (let y = top; y <= bot + swing * 400; y += 10) { const q = (y - top) / (bot - top); ctx.lineTo(x + wv * (.4 + .6 * q) * (1 - swing * .2) + Math.sin(y * .018 + t * 1.3) * (22 + swing * 60) + swing * 600 * q * q, y); }
  ctx.lineTo(x - 20, bot + swing * 400); ctx.closePath(); ctx.fill();
  // folds
  ctx.globalAlpha = (a + swing * .2) * .8; ctx.strokeStyle = rgba('#ffffff', .25); ctx.lineWidth = 1.2;
  for (let k = 0; k < 5; k++) { ctx.beginPath(); for (let y = top; y <= bot + swing * 400; y += 14) { const q = (y - top) / (bot - top); ctx.lineTo(x + (12 + k * 14) * (1 + swing * 4) * (.5 + .5 * q) + Math.sin(y * .02 + t * 1.3 + k) * 8 + swing * 500 * q * q, y); } ctx.stroke(); }
  ctx.restore();
}
// the sitter (you), on the bed edge facing the window. o: look (0..1 head up), coat (0..1 coat on → off), phone (0..1 glow)
export function sitter(ctx, t, o = {}) {
  const look = o.look ?? 0, br = Math.sin(t * 2.1) * .006, exhale = o.exhale ?? 0;
  const fx = o.x ?? 820, fy = (o.y ?? 786) + exhale * 6, s = o.s ?? 2.45;
  const pose = { lean: .17 - .1 * look + br + exhale * .06, head: .38 - .55 * look + exhale * .15, sh: [1.05 - .2 * look * (o.lower ?? 0), .95], el: [1.35, 1.5], hip: [1.42, 1.32], kn: [1.62, 1.4], bulk: 1.15 + .12 * (o.coat ?? 0), hair: 'bun' };
  const warm = o.warm ?? 0;
  const dress = { coat: mixHex(o.coat ? '#1a1838' : '#2a2a58', '#6a3a34', warm), pants: '#15142e', shoes: '#0b0a18', skin: mixHex('#b08a78', '#e0b090', warm), hair: '#140e1c' };
  const res = person(ctx, fx, fy, s, pose, { dress, light: { x: 1500, y: 300, col: warm ? K.hot : '#ffc0a8', a: .45 + .2 * warm }, shadeA: .25 * (1 - warm), shadeCol: '#070818', rim: warm ? '#ffd59a' : '#ffc0a0', rimSide: 1, rimW: 3,
    prop: o.phone != null ? (g, a0, a1) => { g.save(); g.translate(a0.hx + 4, a0.hy - 6); g.rotate(-.9); g.fillStyle = '#0b0d22'; g.fillRect(-5, -9, 10, 17); g.fillStyle = rgba(K.cyanW, .35 + .6 * o.phone); g.fillRect(-4, -8, 8, 15); g.restore(); } : null });
  // the heavy coat of the years: a dark coat over the shoulders and back; slides down the back and off (coat 1 → on, 0 → off)
  if (o.coat != null && o.coat > 0.001) {
    const c = o.coat, sl = 1 - c, k = s / 2.45;
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(pose.lean); ctx.scale(s, s); ctx.translate(-8 * sl, 46 * sl * sl + 10 * sl); ctx.rotate(-.25 * sl);
    ctx.globalAlpha = Math.min(1, c * 2.2);
    ctx.fillStyle = '#0a0918'; ctx.beginPath(); ctx.moveTo(4, -76); ctx.bezierCurveTo(-8, -80, -22, -72, -23, -56); ctx.bezierCurveTo(-27, -30, -28, -6, -30, 12); ctx.lineTo(10, 10);
    ctx.bezierCurveTo(14, -10, 18, -34, 20, -58); ctx.bezierCurveTo(16, -72, 10, -76, 4, -76); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba('#ffc0a0', .35); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(20, -58); ctx.bezierCurveTo(18, -34, 14, -10, 10, 10); ctx.stroke();
    ctx.fillStyle = '#121026'; ctx.beginPath(); ctx.moveTo(4, -78); ctx.lineTo(-10, -82); ctx.lineTo(-6, -66); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  return res;
}
// render the harbour as seen through the window (camera framed into the window at zoom zv)
export function windowView(ctx, t, mode, hcam, o = {}) { drawHarbour(ctx, t, hcam, mode, o); }

// ================================================================= THE "IF" (Instrument Serif, a thread of light)
export function ifGlyph(size = 420) {
  return once('ifglyph' + size, () => {
    const w = Math.round(size * 1.1), h = Math.round(size * 1.4), [c, g] = layer(w, h);
    g.font = `${size}px "Instrument Serif Italic"`; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.lineWidth = Math.max(2, size / 140); g.strokeStyle = '#fff3dc'; g.strokeText('if', w / 2, h * .76);
    g.fillStyle = rgba('#fff3dc', .08); g.fillText('if', w / 2, h * .76);
    const glowC = soften(c, size / 30), glow2 = soften(c, size / 9);
    return { line: c, glow: glowC, glow2, w, h };
  });
}
export function drawIf(ctx, x, y, size, a = 1, reveal = 1, t = 0, col = K.amber) {
  if (a <= 0) return;
  const G = ifGlyph(420), k = size / 420, w = G.w * k, h = G.h * k, br = 1 + .03 * Math.sin(t * 1.3);
  const sw = G.w * clamp(reveal);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = a * .55 * br; ctx.drawImage(G.glow2, 0, 0, sw, G.h, x - w / 2, y - h * .62, sw * k, h);
  ctx.globalAlpha = a * .8; ctx.drawImage(G.glow, 0, 0, sw, G.h, x - w / 2, y - h * .62, sw * k, h);
  ctx.globalAlpha = a; ctx.drawImage(G.line, 0, 0, sw, G.h, x - w / 2, y - h * .62, sw * k, h);
  if (reveal < 1) addGlow(ctx, x - w / 2 + sw * k, y - h * .2, 30 * k + 10, .8 * a, col, '#fff3dc');
  ctx.restore();
}

// ================================================================= CLIP FRAME (portrait, light frame)
import fs from 'node:fs';
const CLIPS = JSON.parse(fs.readFileSync('/mnt/project-files/scenario/film-04-work/audio/clips.json', 'utf8'));
export const clipRole = (id) => CLIPS[id]?.role || '';
export function frameRect(ctx, x, y, w, h, r, a = 1) {
  // soft drop shadow + cream hairline 35 %
  ctx.save(); ctx.globalAlpha = a * .55; ctx.fillStyle = '#03040c';
  for (let i = 4; i >= 1; i--) { ctx.globalAlpha = a * .09 * i; ctx.beginPath(); ctx.roundRect(x - i * 6 + 10, y - i * 6 + 18, w + i * 12, h + i * 12, r + i * 6); ctx.fill(); }
  ctx.restore();
}
export function frameLine(ctx, x, y, w, h, r, a = 1) { ctx.save(); ctx.strokeStyle = rgba(K.cream, .35 * a); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke(); ctx.restore(); }
export function nameLabel(ctx, x, y, name, role, a) {
  if (a <= 0) return; const dy = (1 - a) * 14;
  ctx.fillStyle = rgba(K.amber, a); ctx.fillRect(x, y - 36 + dy, 4, 78);
  text(ctx, name, x + 22, y + dy, { size: 44, font: 'Instrument Serif', alpha: a, color: K.cream });
  const parts = role.split(' · ');
  parts.forEach((p, i) => text(ctx, p.toUpperCase(), x + 22, y + 34 + i * 24 + dy, { size: 16, weight: 600, color: C.muted, alpha: a, spacing: 4 }));
}
