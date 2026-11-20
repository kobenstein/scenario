// art.mjs · "print look" toolkit for Film 04 (and later films).
// Builds on lib.mjs. Everything is code-drawn, deterministic (seeded), 1920x1080.
// Contents:
//   noise ............ vnoise / fbm (value noise for fog, paper, wobble)
//   layers ........... layer(), stipple() (stochastic grain in light falloffs), halftone(), maskGrad()
//   edges ............ roughPoly() / roughLine() (hand-cut, slightly irregular edges)
//   hatching ......... hatch() (parallel wobbly lines inside a clip), strokes() (flow lines along a function)
//   atmosphere ....... fog() (fbm fog band with stippled edge), cone() (volumetric light cone), pool() (light pool)
//   houses ........... house() (no two alike: roofs, bays, chimneys, window patterns, lean)
//   people ........... person() (clothes in colour, face/hair, form shading toward a light, rim)
//   finish ........... printFinish() (paper tooth + fine grain + vignette, cells <= 2 px)
import { createCanvas } from '@napi-rs/canvas';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade } from './lib.mjs';
export { W, H, C, rgba, clamp, mix, prng, mixHex, shade };

// ---------------------------------------------------------------- noise
const fract = (x) => x - Math.floor(x);
export function vnoise(seed = 1) {
  const h = (i, j) => fract(Math.sin(i * 127.1 + j * 311.7 + seed * 74.7) * 43758.5453);
  return (x, y) => {
    const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v);
    return mix(mix(h(i, j), h(i + 1, j), a), mix(h(i, j + 1), h(i + 1, j + 1), a), b);
  };
}
export function fbm(n, x, y, oct = 4) { let s = 0, a = .5, f = 1, t = 0; for (let o = 0; o < oct; o++) { s += a * n(x * f, y * f); t += a; a *= .5; f *= 2.03; } return s / t; }

// ---------------------------------------------------------------- layers
export function layer(w = W, h = H) { const c = createCanvas(w, h); return [c, c.getContext('2d')]; }
// Turn the smooth alpha of a layer into print grain: a' = a*(1-k) + k*[rnd < a^g].
// k = 1 -> pure stipple (spray), k = .5 -> half smooth, half dots. cell = dot size (1 or 2 px).
// boost: a dot's alpha is min(1, a*boost) so dots in dim regions stay dim (no salt-and-pepper noise).
// mid = true (default): the dots live only in the falloff (k scaled by 4a(1-a)), the core and the far tail stay smooth.
export function stipple(c, { k = .6, g = 1, cell = 1, seed = 1, mid = true, boost = 2.5, x = 0, y = 0, w = c.width, h = c.height } = {}) {
  const ctx = c.getContext('2d'), d = ctx.getImageData(x, y, w, h), p = d.data, r = prng(seed * 977 + 13);
  if (cell === 1) {
    for (let i = 3; i < p.length; i += 4) { const a = p[i] / 255; if (a <= 0) continue; const on = r() < Math.pow(a, g) ? Math.min(1, a * boost) : 0, kk = k * (mid ? 4 * a * (1 - a) : 1); p[i] = 255 * (a * (1 - kk) + kk * on); }
  } else {
    for (let yy = 0; yy < h; yy += cell) for (let xx = 0; xx < w; xx += cell) {
      const i0 = (yy * w + xx) * 4 + 3, a = p[i0] / 255; if (a <= 0) continue; const on = r() < Math.pow(a, g) ? Math.min(1, a * boost) : 0, kk = k * (mid ? 4 * a * (1 - a) : 1), v = 255 * (a * (1 - kk) + kk * on);
      for (let dy = 0; dy < cell && yy + dy < h; dy++) for (let dx = 0; dx < cell && xx + dx < w; dx++) p[((yy + dy) * w + xx + dx) * 4 + 3] = v;
    }
  }
  ctx.putImageData(d, x, y); return c;
}
// Ordered halftone screen: alpha becomes round dots on a rotated grid (spacing px, dot <= 2 px).
export function halftone(c, { spacing = 3.2, angle = .785, max = 1.15, seed = 1 } = {}) {
  const ctx = c.getContext('2d'), w = c.width, h = c.height, d = ctx.getImageData(0, 0, w, h), p = d.data;
  const out = new Uint8ClampedArray(p.length); out.set(p);
  const ca = Math.cos(angle), sa = Math.sin(angle);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4 + 3, a = p[i] / 255; if (a <= 0) continue;
    const u = (x * ca + y * sa) / spacing, v = (-x * sa + y * ca) / spacing, du = (fract(u) - .5) * spacing, dv = (fract(v) - .5) * spacing;
    const rad = max * Math.sqrt(a) * 1.25, dist = Math.hypot(du, dv);
    out[i] = 255 * clamp(rad - dist + .5) ;
  }
  d.data.set(out); ctx.putImageData(d, 0, 0); return c;
}
// Multiply a layer's alpha by a gradient (fade a hatch/fog/light toward one side).
export function maskLinear(c, x0, y0, x1, y1, stops) {
  const ctx = c.getContext('2d'); ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'destination-in';
  const g = ctx.createLinearGradient(x0, y0, x1, y1); for (const [o, a] of stops) g.addColorStop(o, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height); ctx.restore(); return c;
}
export function maskRadial(c, x, y, r0, r1, stops, sy = 1) {
  const ctx = c.getContext('2d'); ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'destination-in'; ctx.translate(x, y); ctx.scale(1, sy);
  const g = ctx.createRadialGradient(0, 0, r0, 0, 0, r1); for (const [o, a] of stops) g.addColorStop(o, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(-W * 3, -H * 3, W * 6, H * 6); ctx.restore(); return c;
}
export function put(ctx, c, { op = 'source-over', a = 1 } = {}) { ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.drawImage(c, 0, 0); ctx.restore(); }

// ---------------------------------------------------------------- hand-made edges
// pts: [[x,y],...]. Each edge is subdivided every `step` px and pushed sideways by low-frequency noise (amp px),
// so straight walls stay straight-ish but never ruler-perfect. Corners stay where they are.
export function roughPath(ctx, pts, { amp = 1.2, step = 7, seed = 1, closed = true, move = true } = {}) {
  const n = vnoise(seed), N = pts.length, last = closed ? N : N - 1; let s = seed * 13.1;
  if (move) ctx.moveTo(pts[0][0], pts[0][1]); else ctx.lineTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < last; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % N], L = Math.hypot(x1 - x0, y1 - y0), k = Math.max(1, Math.round(L / step));
    const nx = -(y1 - y0) / (L || 1), ny = (x1 - x0) / (L || 1);
    for (let j = 1; j <= k; j++) {
      const q = j / k, e = j === k ? 0 : (n(s + q * L * .045, 3.3) - .5) * 2 * amp * Math.sin(Math.PI * q) ** .35;
      ctx.lineTo(mix(x0, x1, q) + nx * e, mix(y0, y1, q) + ny * e);
    }
    s += L * .045;
  }
  if (closed) ctx.closePath();
}
export function roughPoly(ctx, pts, fill, o = {}) { ctx.beginPath(); roughPath(ctx, pts, o); if (fill) { ctx.fillStyle = fill; ctx.fill(); } }
export function roughRect(ctx, x, y, w, h, fill, o = {}) { roughPoly(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, o); }
// a slightly uneven stroke (power line, pole, rope): drawn as a thin polygon whose width breathes
export function roughLine(ctx, pts, { w = 2, col = '#000', seed = 1, amp = .6 } = {}) {
  const n = vnoise(seed), L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
    const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1, ww = w / 2 * (1 + (n(i * .3, 1) - .5) * amp);
    L.push([p[0] - dy / l * ww, p[1] + dx / l * ww]); R.push([p[0] + dy / l * ww, p[1] - dx / l * ww]);
  }
  ctx.beginPath(); ctx.moveTo(...L[0]); for (const p of L) ctx.lineTo(...p); for (const p of R.reverse()) ctx.lineTo(...p); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
}
// catenary between two points
export function sagLine(a, b, sag, n = 30) { const out = []; for (let i = 0; i <= n; i++) { const q = i / n; out.push([mix(a[0], b[0], q), mix(a[1], b[1], q) + Math.sin(Math.PI * q) * sag]); } return out; }

// ---------------------------------------------------------------- hatching
// Parallel lines at `angle` inside the current clip (call inside ctx.save()/clip()). Lines wobble and vary
// in length/alpha like pen hatching. bbox = [x,y,w,h].
export function hatch(ctx, bbox, { angle = -.6, gap = 7, w = 1.1, col = '#000', a = .3, wobble = 1.2, seed = 1, broken = .25, dash = 0 } = {}) {
  const [bx, by, bw, bh] = bbox, r = prng(seed), n = vnoise(seed + 5), cx = bx + bw / 2, cy = by + bh / 2, R = Math.hypot(bw, bh) / 2 + 10;
  const ca = Math.cos(angle), sa = Math.sin(angle);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
  for (let o = -R; o <= R; o += gap * (.8 + r() * .4)) {
    ctx.globalAlpha = a * (.55 + .45 * r()); ctx.beginPath(); let pen = false;
    for (let s = -R; s <= R; s += 6) {
      const brk = broken && n(o * .07, s * .012) < broken; if (brk) { pen = false; continue; }
      const off = (n(o * .05, s * .02) - .5) * 2 * wobble, x = cx + ca * s - sa * (o + off), y = cy + sa * s + ca * (o + off);
      if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
// Flow strokes: n lines, each a function f(i, q) -> [x,y] for q in 0..1 (e.g. along a slope or cloud contour)
export function strokes(ctx, n, f, { w = 1, col = '#000', a = .3, seed = 1, steps = 40, aFn = null } = {}) {
  const r = prng(seed); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const q0 = r() * .25, q1 = .7 + r() * .3; ctx.globalAlpha = a * (.5 + .5 * r()) * (aFn ? aFn(i) : 1); ctx.beginPath();
    for (let k = 0; k <= steps; k++) { const q = mix(q0, q1, k / steps), [x, y] = f(i, q, r); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- atmosphere
// A fog band: fbm clouds between y0..y1 (soft top & bottom), stretched horizontally, with a stippled edge.
// Rendered at 1/4 res and scaled up (soft), then grain-stippled at full res so the edges read as print.
export function fog(ctx, { y0, y1, col = '#6fa0c8', a = .5, seed = 1, sx = .006, sy = .02, cover = .45, soft = .25, k = .45, op = 'source-over', x0 = 0, x1 = W, cell = 1, edgeTop = .5, edgeBot = .5, mask = null } = {}) {
  const q = 4, lw = Math.ceil(W / q), lh = Math.ceil(H / q), [lc, lx] = layer(lw, lh), d = lx.createImageData(lw, lh), p = d.data, n = vnoise(seed);
  const n2 = parseInt(col.slice(1), 16), R = n2 >> 16, G = (n2 >> 8) & 255, B = n2 & 255;
  for (let j = Math.floor(y0 / q); j < Math.min(lh, Math.ceil(y1 / q)); j++) {
    const y = j * q, v = (y - y0) / (y1 - y0), band = clamp(v / edgeTop) * clamp((1 - v) / edgeBot);
    for (let i = Math.floor(x0 / q); i < Math.min(lw, Math.ceil(x1 / q)); i++) {
      const x = i * q, f = fbm(n, x * sx, y * sy, 5), dens = clamp((f - (1 - cover)) / soft) * Math.pow(band, .7);
      const o = (j * lw + i) * 4; p[o] = R; p[o + 1] = G; p[o + 2] = B; p[o + 3] = 255 * a * dens;
    }
  }
  lx.putImageData(d, 0, 0);
  const [fc, fx] = layer(); fx.imageSmoothingEnabled = true; fx.drawImage(lc, 0, 0, lw * q, lh * q);
  if (k > 0) stipple(fc, { k, g: 1.1, seed: seed + 3, cell, y: Math.max(0, Math.floor(y0)), h: Math.min(H, Math.ceil(y1)) - Math.max(0, Math.floor(y0)) });
  if (mask) mask(fc);
  put(ctx, fc, { op });
  return fc;
}
// Volumetric light cone from a lamp at (x,y) pointing at angle dir (rad, 0 = down), spread half-angle, length len.
// Smooth core + stippled falloff. Additive.
export function cone(ctx, x, y, { dir = 0, spread = .45, len = 500, col = C.amber, a = .55, k = .7, seed = 1, cell = 1, op = 'lighter', soft = .25, clipFn = null } = {}) {
  const [c, g] = layer();
  if (clipFn) { g.save(); clipFn(g); g.clip(); }
  const ax = Math.sin(dir), ay = Math.cos(dir);
  const lg = g.createLinearGradient(x, y, x + ax * len, y + ay * len);
  lg.addColorStop(0, rgba(col, a)); lg.addColorStop(.35, rgba(col, a * .55)); lg.addColorStop(1, rgba(col, 0));
  // soft sides: draw several nested wedges with decreasing alpha
  for (let s = 0; s < 6; s++) {
    const sp = spread * (1 + soft * (s - 2.5) / 2.5); g.globalAlpha = 1 / 6 * 1.25;
    g.fillStyle = lg; g.beginPath(); g.moveTo(x, y);
    g.lineTo(x + Math.sin(dir - sp) * len / Math.cos(sp), y + Math.cos(dir - sp) * len / Math.cos(sp));
    g.lineTo(x + Math.sin(dir + sp) * len / Math.cos(sp), y + Math.cos(dir + sp) * len / Math.cos(sp)); g.closePath(); g.fill();
  }
  g.globalAlpha = 1; if (clipFn) g.restore();
  stipple(c, { k, g: 1.3, seed, cell }); put(ctx, c, { op }); return c;
}
// Light pool on a ground plane (ellipse), smooth + stippled; e.g. under a street lamp or spilling from a door.
export function pool(ctx, x, y, rx, ry, { col = C.amber, a = .6, k = .7, seed = 1, op = 'lighter', cell = 1, rot = 0 } = {}) {
  const [c, g] = layer(); g.translate(x, y); g.rotate(rot); g.scale(1, ry / rx);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, rgba(col, a)); rg.addColorStop(.4, rgba(col, a * .5)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.beginPath(); g.arc(0, 0, rx, 0, 7); g.fill();
  stipple(c, { k, g: 1.2, seed, cell }); put(ctx, c, { op }); return c;
}
// Smooth radial glow with stippled outer falloff (bloom around a hero light)
export function bloom(ctx, x, y, r, { col = C.amber, core = C.amberHot, a = .6, k = .5, seed = 1, sy = 1, op = 'lighter' } = {}) {
  const [c, g] = layer(); g.translate(x, y); g.scale(1, sy);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, rgba(core, a)); rg.addColorStop(.15, rgba(col, a * .6)); rg.addColorStop(.5, rgba(col, a * .18)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); stipple(c, { k, g: 1.2, seed }); put(ctx, c, { op }); return c;
}

// ---------------------------------------------------------------- houses
// One house, base-centred at (x, y) (y = ground line), w x h facade. rng-driven variety:
// roof: gable | steep | hip | flat | parapet | mansard | tower | sawtooth ; optional bay window column, chimney,
// stoop, side wall (3/4 view), window grid with irregular sizes. lit(wx,wy) -> 0..1 decides each window.
// o.wall / o.side / o.roof colours; o.light = {x,y,col,a} paints a gradient of light onto the facade.
export function house(ctx, r, x, y, w, h, o = {}) {
  const roofs = o.roofs || ['gable', 'steep', 'hip', 'flat', 'parapet', 'mansard', 'gable', 'flat', 'tower', 'sawtooth'];
  const roof = o.roof ?? roofs[Math.floor(r() * roofs.length)], lean = (r() - .5) * (o.lean ?? .02), sd = o.side ?? 0, seed = Math.floor(r() * 1e6);
  const wall = o.wall || '#1a1d4a', sideC = o.sideCol || shade(wall, -.05), roofC = o.roofCol || shade(wall, -.04), amp = o.amp ?? Math.max(.4, w * .012);
  const L = x - w / 2, Rr = x + w / 2, T = y - h, k = Math.tan(lean);
  const at = (px, py) => [px + (y - py) * k, py];
  let rh = 0, outline;
  switch (roof) {
    case 'gable': rh = w * (.28 + r() * .12); outline = [at(L, y), at(L, T), at(x, T - rh), at(Rr, T), at(Rr, y)]; break;
    case 'steep': rh = Math.min(w * (.55 + r() * .3), h * .7); outline = [at(L, y), at(L, T), at(x, T - rh), at(Rr, T), at(Rr, y)]; break;
    case 'hip': rh = w * .22; outline = [at(L - w * .04, y), at(L - w * .04, T), at(L + w * .25, T - rh), at(Rr - w * .25, T - rh), at(Rr + w * .04, T), at(Rr + w * .04, y)]; break;
    case 'mansard': rh = w * .3; outline = [at(L, y), at(L, T), at(L + w * .1, T - rh * .85), at(L + w * .22, T - rh), at(Rr - w * .22, T - rh), at(Rr - w * .1, T - rh * .85), at(Rr, T), at(Rr, y)]; break;
    case 'parapet': rh = h * .06; outline = [at(L, y), at(L, T), at(L - 2, T), at(L - 2, T - rh), at(Rr + 2, T - rh), at(Rr + 2, T), at(Rr, T), at(Rr, y)]; break;
    case 'tower': rh = Math.min(w * (1 + r() * .6), h * .9); outline = [at(L, y), at(L, T), at(x, T - rh), at(Rr, T), at(Rr, y)]; break;
    case 'sawtooth': rh = w * .2; outline = [at(L, y), at(L, T), at(L + w * .5, T - rh), at(L + w * .5, T), at(Rr, T - rh), at(Rr, y)]; break;
    default: rh = 0; outline = [at(L, y), at(L, T), at(Rr, T), at(Rr, y)];
  }
  // side wall (3/4 view): a darker quad to the given side
  if (sd) {
    const sw = Math.abs(sd) * w, s = Math.sign(sd), ex = s > 0 ? Rr : L, ey = T - (roof === 'flat' || roof === 'parapet' ? 0 : 0);
    roughPoly(ctx, [at(ex, y), at(ex, ey), [at(ex, ey)[0] + s * sw, ey - sw * .18], [ex + s * sw, y - sw * .1]], sideC, { amp, seed: seed + 1 });
    if (roof !== 'flat' && roof !== 'parapet') roughPoly(ctx, [at(ex, ey), at(x, T - rh), [at(x, T - rh)[0] + s * sw, T - rh - sw * .18], [at(ex, ey)[0] + s * sw, ey - sw * .18]], roofC, { amp, seed: seed + 2 });
  }
  roughPoly(ctx, outline, wall, { amp, seed });
  // chimney
  if (r() < (o.chimney ?? .45) && roof !== 'tower' && roof !== 'flat') { const cx = mix(L, Rr, .2 + r() * .6), cw = w * .07 + 2, ch = rh * .6 + h * .1; roughRect(ctx, ...at(cx, T - rh * .5 - ch), cw, ch, shade(wall, -.02), { amp: amp * .6, seed: seed + 3 }); }
  // optional light wash on the facade (clip to outline)
  if (o.light) {
    ctx.save(); ctx.beginPath(); roughPath(ctx, outline, { amp, seed }); ctx.clip();
    const { x: lx, y: ly, col = C.amber, a = .35, r: lr = 500 } = o.light, g = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
    g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(L - w, T - rh - 10, w * 3, h + rh + 20); ctx.restore();
  }
  // trim lines: cornice / floor band
  if (o.trim !== false && w > 30) { ctx.fillStyle = rgba('#000000', .18); const ty = T + h * (.08 + r() * .05); ctx.fillRect(at(L, ty)[0], ty, w, Math.max(1, h * .012)); }
  // bay window column (San Francisco / Victorian)
  const bay = w > 45 && r() < (o.bay ?? .3), bx = mix(L, Rr, r() < .5 ? .28 : .7), bw = w * .32;
  if (bay) roughRect(ctx, ...at(bx - bw / 2, T + h * .12), bw, h * .66, shade(wall, .03), { amp, seed: seed + 4 });
  // windows: irregular grid
  const floors = Math.max(1, Math.round(h / (o.floorH ?? 32) * (.8 + r() * .4))), cols = Math.max(1, Math.round(w / (o.colW ?? 26) * (.7 + r() * .5)));
  const ww = Math.min(w / cols * (.32 + r() * .2), 20 * (o.wscale ?? 1)), wh = Math.min(h / floors * (.42 + r() * .2), ww * (1.3 + r() * .9)), arch = r() < .25;
  const win = [];
  for (let fl = 0; fl < floors; fl++) for (let c = 0; c < cols; c++) {
    if (r() < (o.skip ?? .12)) continue;
    const wx = L + (c + .5) * w / cols + (r() - .5) * 2, wy = T + h * .1 + (fl + .5) * (h * .86) / floors - wh / 2 + (r() - .5) * 1.5;
    if (o.door !== false && fl === floors - 1 && c === Math.floor(cols / 2) && h > 40) { win.push({ x: wx, y: y - wh * 1.5, w: ww * 1.1, h: wh * 1.5, door: true }); continue; }
    win.push({ x: at(wx, wy)[0], y: wy, w: ww * (.9 + r() * .2), h: wh, arch });
  }
  for (const wn of win) {
    const l = o.lit ? o.lit(wn.x, wn.y, r) : 0;
    const col = l > 0 ? mixHex(o.winOff || shade(wall, -.06), o.winOn || C.amberHot, clamp(l)) : (o.winOff || shade(wall, -.06));
    ctx.fillStyle = col; ctx.beginPath();
    if (wn.arch) { ctx.moveTo(wn.x - wn.w / 2, wn.y + wn.h); ctx.lineTo(wn.x - wn.w / 2, wn.y + wn.w / 2); ctx.arc(wn.x, wn.y + wn.w / 2, wn.w / 2, Math.PI, 0); ctx.lineTo(wn.x + wn.w / 2, wn.y + wn.h); ctx.closePath(); ctx.fill(); }
    else { roughRect(ctx, wn.x - wn.w / 2, wn.y, wn.w, wn.h, col, { amp: .35, step: 5, seed: seed + wn.x | 0 }); }
    if (l > 0 && wn.w > 7 && !wn.door) { ctx.fillStyle = rgba(shade(wall, -.1), .7); ctx.fillRect(wn.x - .6, wn.y, 1.2, wn.h); ctx.fillRect(wn.x - wn.w / 2, wn.y + wn.h * .45, wn.w, 1.2); }
    wn.l = l;
  }
  return { outline, win, top: T - rh, L, R: Rr };
}

// ---------------------------------------------------------------- people
// Figure kit v2: same proportions as lib.figure (round sloping shoulders, hands in front, tapered limbs),
// but dressed: coat/jacket colour, trousers, shoes, skin (face + hands), hair; optional hood, scarf, cane, bag.
// Form shading: light {x,y,col,a} paints a gradient across the body on the side facing the light; rim on that side.
// x,y = hip joint, s = scale (1 -> ~185 px standing).
function capsule(ctx, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1))));
  ctx.beginPath(); ctx.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); ctx.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); ctx.closePath(); ctx.fill();
}
const PDEF = { lean: 0, head: 0, sh: [0.15, -0.1], el: [0.3, 0.25], hip: [0.05, -0.05], kn: [0, 0], hair: 'short', coat: 0, skirt: false, bulk: 1, hood: false, scarf: false };
function rig(P) {
  const shY = -64;
  return {
    shY,
    arm: (i) => { const a = P.sh[i], e = P.el[i], sx = i ? -3 : 3, sy = shY + 7, ex = sx + Math.sin(a) * 29, ey = sy + Math.cos(a) * 29; return { sx, sy, ex, ey, hx: ex + Math.sin(a + e) * 26, hy: ey + Math.cos(a + e) * 26, ang: a + e }; },
    leg: (i) => { const a = P.hip[i], k = P.kn[i], sx = i ? -4 : 4, kx = sx + Math.sin(a) * 45, ky = Math.cos(a) * 45; return { sx, kx, ky, fx: kx + Math.sin(a - k) * 43, fy: ky + Math.cos(a - k) * 43 }; },
  };
}
export const DRESS = {
  amber: { coat: '#e59a3a', coatDark: '#9a5420', pants: '#1a1830', shoes: '#0d0c1c', skin: '#e9c3a0', hair: '#2a1a14' },
};
export function person(ctx, x, y, s, pose = {}, o = {}) {
  const P = Object.assign({}, PDEF, pose), R = rig(P), B = P.bulk, flip = o.flip ? -1 : 1;
  const D = Object.assign({ coat: '#3a3560', pants: '#14132a', shoes: '#0b0a18', skin: '#d9b08e', hair: '#1c1420', shirt: null }, o.dress || {});
  const pad = 220 * s, [c, g] = layer(Math.ceil(pad * 2), Math.ceil(pad * 2));
  g.translate(pad, pad); g.scale(s * flip, s);
  const legC = D.pants, armC = D.coat;
  const leg = (i, col) => { const l = R.leg(i); g.fillStyle = col; capsule(g, l.sx, 0, 9.5 * B, l.kx, l.ky, 6.5); capsule(g, l.kx, l.ky, 6.5, l.fx, l.fy, 4.6); g.fillStyle = D.shoes; g.beginPath(); g.ellipse(l.fx + 6, l.fy + 2.5, 9.5, 4.6, 0, 0, 7); g.fill(); };
  const arm = (i, col) => { const m = R.arm(i); g.fillStyle = col; capsule(g, m.sx, m.sy, 8.6 * B, m.ex, m.ey, 6.4); capsule(g, m.ex, m.ey, 6.2, m.hx, m.hy, 5); g.fillStyle = D.skin; g.beginPath(); g.ellipse(m.hx + Math.sin(m.ang) * 3.5, m.hy + Math.cos(m.ang) * 3.5, 4.6, 5.4, -m.ang, 0, 7); g.fill(); };
  leg(1, shade(legC, -.03)); leg(0, legC);
  g.save(); g.rotate(P.lean);
  arm(1, shade(armC, -.06));
  // torso
  const sY = R.shY, w = B, hem = P.coat ? 22 + 16 * P.coat : 6;
  g.fillStyle = armC; g.beginPath();
  g.moveTo(-15 * w, 4); g.bezierCurveTo(-17 * w, -14, -13 * w, -30, -14 * w, -46); g.bezierCurveTo(-15 * w, sY + 4, -12 * w, sY - 3, -4, sY - 4); g.lineTo(5, sY - 4);
  g.bezierCurveTo(14 * w, sY - 3, 20 * w, sY + 6, 19 * w, -44); g.bezierCurveTo(18 * w, -30, 13 * w, -14, 15 * w, 4);
  if (P.skirt) { g.lineTo(21 * w, hem + 34); g.quadraticCurveTo(0, hem + 38, -20 * w, hem + 34); }
  else if (P.coat) { g.lineTo(17 * w + P.coat * 3, hem); g.quadraticCurveTo(0, hem + 3, -17 * w - P.coat * 3, hem); }
  else g.quadraticCurveTo(0, 12, -15 * w, 4);
  g.closePath(); g.fill();
  if (P.skirt && D.skirt) { g.fillStyle = D.skirt; g.beginPath(); g.moveTo(-15 * w, 0); g.lineTo(15 * w, 0); g.lineTo(21 * w, hem + 34); g.quadraticCurveTo(0, hem + 38, -20 * w, hem + 34); g.closePath(); g.fill(); }
  // coat details: front edge / zip, pocket, collar
  g.fillStyle = rgba('#000000', .16); g.fillRect(10 * w, sY + 4, 1.6, (P.coat ? hem : 2) - sY - 4);
  if (P.coat) { g.fillRect(4, -18, 9, 1.4); }
  if (P.scarf) { g.fillStyle = D.scarf || C.rose; g.beginPath(); g.ellipse(2, sY - 1, 11, 6, .1, 0, 7); g.fill(); g.fillRect(4, sY, 6, 20); }
  // neck + head
  g.save(); g.translate(1, sY - 2); g.rotate(P.head);
  g.fillStyle = D.skin; capsule(g, 0, 3, 5.4, 1.5, -5, 4.8);
  g.beginPath(); g.ellipse(2.5, -16, 10.2, 11.8, .12, 0, 7); g.fill();
  // hair (back + top), face stays on the front side (faceless, a profile read)
  g.fillStyle = D.hair;
  const hairStyles = {
    short: () => { g.beginPath(); g.ellipse(0, -20, 10.4, 9.5, .12, Math.PI * .75, Math.PI * 2.05); g.closePath(); g.fill(); },
    long: () => { g.beginPath(); g.moveTo(9, -26); g.quadraticCurveTo(-4, -33, -10, -20); g.quadraticCurveTo(-14, -2, -9, 12); g.quadraticCurveTo(-1, 14, 0, 4); g.quadraticCurveTo(-3, -12, 9, -22); g.closePath(); g.fill(); },
    bun: () => { hairStyles.short(); g.beginPath(); g.arc(-8, -27, 5.6, 0, 7); g.fill(); },
    curly: () => { for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-8 + i * 3, -26 + Math.sin(i * 2) * 1.5 + (i < 2 ? 6 : 0), 5, 0, 7); g.fill(); } },
    grey: () => { g.fillStyle = D.hair; g.beginPath(); g.ellipse(-2, -19, 9.6, 8, .2, Math.PI * .6, Math.PI * 1.75); g.closePath(); g.fill(); },
    bald: () => { },
    cap: () => { g.beginPath(); g.ellipse(1, -22, 11, 7, .1, Math.PI, Math.PI * 2.02); g.closePath(); g.fill(); g.fillRect(4, -23, 13, 3); },
  };
  (hairStyles[P.hair] || hairStyles.short)();
  if (P.hair === 'cap' || P.hair === 'grey') { g.fillStyle = D.hairBack || D.hair; g.beginPath(); g.ellipse(-3.5, -13, 7, 9.5, .15, Math.PI * .45, Math.PI * 1.5); g.closePath(); g.fill(); g.fillStyle = shade(D.skin, -.08); g.beginPath(); g.ellipse(1, -14, 2.2, 3.4, 0, 0, 7); g.fill(); }
  if (P.hood) { g.fillStyle = armC; g.beginPath(); g.moveTo(10, -30); g.quadraticCurveTo(-6, -36, -13, -18); g.quadraticCurveTo(-15, 0, -6, 6); g.lineTo(4, 6); g.quadraticCurveTo(-3, -4, -2, -14); g.quadraticCurveTo(0, -27, 12, -24); g.closePath(); g.fill(); }
  g.restore();
  arm(0, armC);
  if (o.prop) o.prop(g, R.arm(0), R.arm(1), D);
  g.restore();
  // form light: gradient across the body from the light side + darker far side (screen-space)
  if (o.light) {
    const { x: lx, y: ly, col = C.amberHot, a = .55 } = o.light;
    const dx = lx - x, dy = ly - y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
    const gr = g.createLinearGradient(pad - ux * 30 * s, pad - 60 * s - uy * 30 * s, pad + ux * 30 * s, pad - 60 * s + uy * 30 * s);
    gr.addColorStop(0, 'rgba(5,6,20,.38)'); gr.addColorStop(.5, 'rgba(5,6,20,0)'); gr.addColorStop(.62, rgba(col, 0)); gr.addColorStop(1, rgba(col, a));
    g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
  }
  if (o.shadeA) { g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = rgba(o.shadeCol || '#070818', o.shadeA); g.fillRect(0, 0, c.width, c.height); }
  // rim: silhouette copy offset toward the light, drawn under the body
  if (o.rim) {
    const [rc, rx] = layer(c.width, c.height); rx.drawImage(c, 0, 0); rx.globalCompositeOperation = 'source-in'; rx.fillStyle = o.rim; rx.fillRect(0, 0, c.width, c.height);
    const off = o.rimW ?? Math.max(1.2, 1.6 * s), side = o.rimSide ?? 1;
    ctx.drawImage(rc, x - pad + side * off, y - pad - off * .4);
  }
  ctx.drawImage(c, x - pad, y - pad);
  return { hand: (i) => { const m = R.arm(i), cs = Math.cos(P.lean), sn = Math.sin(P.lean), hx = m.hx + Math.sin(m.ang) * 4, hy = m.hy + Math.cos(m.ang) * 4; return [x + (hx * cs - hy * sn) * s * flip, y + (hx * sn + hy * cs) * s]; }, feetY: y + 88 * s };
}
// a ground shadow under/behind a figure, cast away from a light
export function castShadow(ctx, x, footY, s, lx, ly, { a = .45, len = 2.4, col = '#05060f' } = {}) {
  const ang = Math.atan2(footY - ly, x - lx); ctx.save(); ctx.translate(x, footY); ctx.rotate(ang);
  const g = ctx.createLinearGradient(0, 0, 180 * s * len, 0); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(90 * s * len, 0, 90 * s * len, 12 * s, 0, 0, 7); ctx.fill(); ctx.restore();
}

// ---------------------------------------------------------------- finish
const [paperC, paperX] = layer(W, H);
{ const n = vnoise(91), d = paperX.createImageData(W, H), p = d.data, r = prng(31);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4, v = 128 + (fbm(n, x * .9, y * .9, 2) - .5) * 70 + (r() - .5) * 90; p[i] = p[i + 1] = p[i + 2] = v; p[i + 3] = 255; }
  paperX.putImageData(d, 0, 0); }
export function printFinish(ctx, { grain = .085, vig = .45, vigCol = '#05060f', lift = 0, liftCol = '#1a1840', tint = null } = {}) {
  if (vig) { const g = ctx.createRadialGradient(W * .5, H * .5, H * .35, W * .5, H * .5, H * 1.08); g.addColorStop(0, rgba(vigCol, 0)); g.addColorStop(1, rgba(vigCol, vig)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  if (lift) { ctx.save(); ctx.globalCompositeOperation = 'lighten'; ctx.fillStyle = rgba(liftCol, lift); ctx.fillRect(0, 0, W, H); ctx.restore(); }   // raise the blacks a touch (ink on paper, never pure black)
  if (tint) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = tint; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  ctx.save(); ctx.globalAlpha = grain; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(paperC, 0, 0); ctx.restore();
}

// ---------------------------------------------------------------- perspective facades
// q = [tl, tr, br, bl] (any quad, e.g. a wall receding to a vanishing point). Windows are laid out in (u,v)
// facade space and mapped bilinearly, so they foreshorten with the wall. Returns the mapper for further drawing.
export function quadMap(q) { const [a, b, c, d] = q; return (u, v) => { const tx = mix(a[0], b[0], u), ty = mix(a[1], b[1], u), bx = mix(d[0], c[0], u), by = mix(d[1], c[1], u); return [mix(tx, bx, v), mix(ty, by, v)]; }; }
export function quadIn(m, u0, v0, u1, v1) { return [m(u0, v0), m(u1, v0), m(u1, v1), m(u0, v1)]; }
export function facade(ctx, r, q, o = {}) {
  const m = quadMap(q), wall = o.wall || '#16202c', seed = Math.floor(r() * 1e6), amp = o.amp ?? 1.2;
  roughPoly(ctx, q, wall, { amp, seed });
  ctx.save(); ctx.beginPath(); roughPath(ctx, q, { amp, seed }); ctx.clip();
  if (o.shade) { const [x0, y0] = m(0, .5), [x1, y1] = m(1, .5), g = ctx.createLinearGradient(x0, y0, x1, y1); for (const [s2, c] of o.shade) g.addColorStop(s2, c); ctx.fillStyle = g; ctx.fill(); }
  const floors = o.floors ?? 3, cols = o.cols ?? 3, top = o.top ?? .1, bot = o.bottom ?? .95;
  const ww = o.ww ?? .4, wh = o.wh ?? .55, lit = o.lit || (() => 0), trim = o.trimCol || shade(wall, .045), dark = shade(wall, -.045);
  // bay window columns: a lighter vertical band with its own edge shadow (Victorian / SF)
  const bays = [];
  if (o.bays) for (let c = 0; c < cols; c++) if (r() < o.bays) bays.push(c);
  for (const c of bays) { const u0 = (c + .5 - .42) / cols, u1 = (c + .5 + .42) / cols; roughPoly(ctx, quadIn(m, u0, top - .02, u1, bot), shade(wall, .028), { amp: .5, seed: seed + c }); roughPoly(ctx, quadIn(m, u1 - .025 / cols * 3, top - .02, u1, bot), dark, { amp: .3, seed: seed + c + 1 }); }
  // cornice with a shadow line + floor bands
  const band = (v, th, col) => roughPoly(ctx, quadIn(m, -.02, v, 1.02, v + th), col, { amp: .4, seed: seed + Math.round(v * 1000) });
  if (o.cornice !== false) { band(0, .03, trim); band(.03, .012, rgba('#000000', .35)); }
  const style = o.style ?? Math.floor(r() * 4);   // 0 plain, 1 arched, 2 tall pairs, 3 shutters
  for (let f = 0; f < floors; f++) {
    const v0 = mix(top, bot, f / floors), v1 = mix(top, bot, (f + 1) / floors);
    if (f > 0 && o.bands !== false) band(v0 - .004, .006, rgba(trim, .6));
    for (let c = 0; c < cols; c++) {
      if (r() < (o.skip ?? .06)) continue;
      const pair = style === 2 ? 2 : 1;
      for (let p2 = 0; p2 < pair; p2++) {
        const cw = ww / pair, cc = c + .5 + (pair === 2 ? (p2 - .5) * cw * 1.15 : 0);
        const u0 = (cc - cw / 2) / cols, u1 = (cc + cw / 2) / cols, vv0 = mix(v0, v1, (1 - wh) / 2), vv1 = mix(v0, v1, (1 + wh) / 2);
        const l = lit(f, c, r), col = l > 0 ? mixHex(o.winOff || dark, o.winOn || C.amberHot, l) : (o.winOff || dark);
        roughPoly(ctx, quadIn(m, u0 - .008, vv0 - .01, u1 + .008, vv1 + .006), trim, { amp: .2, step: 4, seed: seed + f * 10 + c });   // frame
        const wq = quadIn(m, u0, vv0, u1, vv1);
        if (style === 1) { const mid = quadMap(wq); ctx.beginPath(); const [ax, ay] = mid(0, .2), [bx, by] = mid(1, .2), [tx, ty] = mid(.5, -.05); ctx.moveTo(...mid(0, 1)); ctx.lineTo(ax, ay); ctx.quadraticCurveTo(tx, ty - (by - ty) * .3, bx, by); ctx.lineTo(...mid(1, 1)); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
        else roughPoly(ctx, wq, col, { amp: .25, step: 4, seed: seed + f * 10 + c });
        if (style === 3) { roughPoly(ctx, quadIn(m, u0 - cw / cols * .45, vv0, u0 - .004, vv1), shade(wall, .02), { amp: .2, seed: c }); roughPoly(ctx, quadIn(m, u1 + .004, vv0, u1 + cw / cols * .45, vv1), shade(wall, .02), { amp: .2, seed: c + 1 }); }
        roughPoly(ctx, quadIn(m, u0 - .012, vv1 + .006, u1 + .012, vv1 + .016), trim, { amp: .2, seed: seed + c });   // sill
        if (l > 0 && o.frames !== false) { const [ax, ay] = m((u0 + u1) / 2, vv0), [bx, by] = m((u0 + u1) / 2, vv1); ctx.strokeStyle = rgba(dark, .85); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); const [cx2, cy2] = m(u0, mix(vv0, vv1, .4)), [dx2, dy2] = m(u1, mix(vv0, vv1, .4)); ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(dx2, dy2); ctx.stroke(); }
      }
    }
  }
  // vertical edge highlight on the near corner (catches the light) + aerial fog veil by distance
  if (o.edgeLight) roughPoly(ctx, quadIn(m, .985, 0, 1, 1), o.edgeLight, { amp: .2, seed });
  if (o.fogA) { ctx.fillStyle = rgba(o.fogCol || '#7aa5a8', o.fogA); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  ctx.restore();
  return m;
}
// blurred copy of a layer (soft light edges); px = blur radius
export function soften(c, px) { const [o, g] = layer(c.width, c.height); g.filter = `blur(${px}px)`; g.drawImage(c, 0, 0); return o; }

// a stratus band with tapered ends (for hatched clouds): returns a closed path on ctx
export function stratus(ctx, y, x0, x1, th, seed = 1) { const n = vnoise(seed); ctx.moveTo(x0, y);
  for (let x = x0; x <= x1; x += 12) { const q = (x - x0) / (x1 - x0), taper = Math.pow(Math.sin(Math.PI * q), .6); ctx.lineTo(x, y - th * taper * (.55 + .45 * n(x * .01, 1))); }
  for (let x = x1; x >= x0; x -= 12) { const q = (x - x0) / (x1 - x0), taper = Math.pow(Math.sin(Math.PI * q), .8); ctx.lineTo(x, y + th * .4 * taper * (.6 + .4 * n(x * .013, 2))); }
  ctx.closePath(); }
// tapered organic branch/limb from a list of points (w0 at the start, w1 at the end)
export function limb(ctx, pts, w0, w1, col, seed = 1) { const L = [], R = []; const n = vnoise(seed);
  for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)], dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1, w = mix(w0, w1, i / (pts.length - 1)) / 2 * (1 + (n(i * .7, 1) - .5) * .3); L.push([p[0] - dy / l * w, p[1] + dx / l * w]); R.push([p[0] + dy / l * w, p[1] - dx / l * w]); }
  ctx.beginPath(); ctx.moveTo(...L[0]); for (const p of L) ctx.lineTo(...p); for (const p of R.reverse()) ctx.lineTo(...p); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
// sample points along a quadratic curve
export function qpts(a, c, b, n = 12) { const out = []; for (let i = 0; i <= n; i++) { const t = i / n; out.push([(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]); } return out; }
