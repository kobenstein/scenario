// s07_kit · shared drawing kit for chapter 07 "The top" (night meadow, star sky, ridges, figure sprites, camera).
// Every expensive layer is built once per shot group (lazy) and evicted when the playhead has moved far away,
// so memory stays flat across the chapter. Per frame we only composite layers with a 2.5D camera + live details.
import { createCanvas } from '@napi-rs/canvas';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, hatch, person, vnoise, fbm } from './art.mjs';
export { W, H, C, rgba, clamp, mix, prng, mixHex, shade };

// stip() reads/writes pixels through getImageData/putImageData, which in @napi-rs/canvas honour the current
// transform; our world layers are translated, so reset the transform around it.
export function stip(c, o) { const x = c.getContext('2d'); x.save(); x.setTransform(1, 0, 0, 1, 0, 0); stipple(c, o); x.restore(); return c; }
export const lin = (a, b, t) => clamp((t - a) / (b - a));
export const sm = (x) => x * x * (3 - 2 * x);
export const eio = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const eout = (x) => 1 - Math.pow(1 - x, 3);
export const ein = (x) => x * x * x;
export const quart = (x) => x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2;
export const drift = (t, a = 1, ph = 0) => a * (Math.sin(t * 0.37 + ph) * 0.6 + Math.sin(t * 0.91 + ph * 1.7) * 0.3 + Math.sin(t * 1.73 + ph * 2.3) * 0.1);
export const PX = 220, PY = 160;            // padding of world layers around the frame (parallax room)
export const LW = W + 2 * PX, LH = H + 2 * PY;

// ------------------------------------------------------------------ cache with eviction by playhead distance
const GROUPS = new Map();
let lastSweep = -1e9;
export function cache(group, key, t, build) {
  let g = GROUPS.get(group);
  if (!g) { g = { last: t, m: new Map() }; GROUPS.set(group, g); }
  g.last = t;
  if (Math.abs(t - lastSweep) > 1) {
    lastSweep = t;
    for (const [k, v] of GROUPS) if (k !== group && Math.abs(v.last - t) > 8) GROUPS.delete(k);
  }
  if (!g.m.has(key)) g.m.set(key, build());
  return g.m.get(key);
}

// world layer: a canvas of LW×LH whose pixel (u,v) is world (u-PX, v-PY); world = screen at camera rest.
export function wl() { const [c, x] = layer(LW, LH); x.translate(PX, PY); return [c, x]; }
// camera: {x, y, z} pan in px (positive x = camera moves right) and zoom. Layer parallax p (0 = sky at infinity, 1 = subject plane).
export function camT(ctx, cam, p = 1, cx = W / 2, cy = H / 2) {
  const z = 1 + (cam.z - 1) * (p * .85 + .15);
  ctx.translate(cx, cy); ctx.scale(z, z); if (cam.r) ctx.rotate(cam.r * (.4 + .6 * p)); ctx.translate(-cx - cam.x * p, -cy - cam.y * p);
}
export function drawL(ctx, c, cam, p = 1, { a = 1, op = null, cx, cy } = {}) {
  ctx.save(); if (a !== 1) ctx.globalAlpha = a; if (op) ctx.globalCompositeOperation = op;
  camT(ctx, cam, p, cx, cy); ctx.drawImage(c, -PX, -PY); ctx.restore();
}
// project a world point on a layer with parallax p to the screen (for carriers / tr x,y)
export function proj(cam, p, x, y, cx = W / 2, cy = H / 2) {
  const z = 1 + (cam.z - 1) * (p * .85 + .15); let dx = x - cx - cam.x * p, dy = y - cy - cam.y * p;
  if (cam.r) { const r = cam.r * (.4 + .6 * p), c = Math.cos(r), s = Math.sin(r); [dx, dy] = [dx * c - dy * s, dx * s + dy * c]; }
  return [cx + dx * z, cy + dy * z];
}

// ------------------------------------------------------------------ sky
// gradient + stipple haze toward a light + stars (static), as a world layer. stars = density 0..1.
export function skyLayer({ stops, glowAt = null, glowCol = '#c8c4ff', glowA = .25, glowR = 900, stars = 1, seed = 3, starCol = '#f3efe2', band = null }) {
  const [c, x] = wl();
  const g = x.createLinearGradient(0, -PY, 0, H + PY); for (const [o, col] of stops) g.addColorStop(o, col); x.fillStyle = g; x.fillRect(-PX, -PY, LW, LH);
  if (glowAt) {
    const [gc, gx] = layer(LW, LH); gx.translate(PX, PY);
    const rg = gx.createRadialGradient(glowAt[0], glowAt[1], 0, glowAt[0], glowAt[1], glowR); rg.addColorStop(0, rgba(glowCol, glowA)); rg.addColorStop(.45, rgba(glowCol, glowA * .35)); rg.addColorStop(1, rgba(glowCol, 0));
    gx.fillStyle = rg; gx.fillRect(-PX, -PY, LW, LH); stip(gc, { k: .35, g: 1.1, seed: seed + 1 }); x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'screen'; x.drawImage(gc, 0, 0); x.restore();
  }
  if (band) { // faint diagonal haze of countless far stars (not a column): stippled
    const [bc, bx] = layer(LW, LH); bx.translate(PX, PY); const n = vnoise(seed + 7);
    const d = bx.createImageData(LW, LH), p = d.data, [r0, g0, b0] = [210, 205, 240];
    for (let j = 0; j < LH; j += 2) for (let i = 0; i < LW; i += 2) {
      const wx = i - PX, wy = j - PY, dist = Math.abs((wy - band.y0) - (wx - band.x0) * band.k) / band.w;
      const v = Math.exp(-dist * dist * 2) * (.45 + .9 * (fbm(n, wx * .004, wy * .006, 4) - .3)); if (v <= 0) continue;
      for (const [di, dj] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const o = ((j + dj) * LW + i + di) * 4; p[o] = r0; p[o + 1] = g0; p[o + 2] = b0; p[o + 3] = 255 * clamp(v) * band.a; }
    }
    bx.setTransform(1, 0, 0, 1, 0, 0); bx.putImageData(d, 0, 0); stip(bc, { k: .8, g: 1.2, seed: seed + 9, mid: false, boost: 1.6 }); x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'screen'; x.drawImage(bc, 0, 0); x.restore();
  }
  if (stars) {
    const r = prng(seed * 31 + 7);
    const N = Math.round(1400 * stars);
    for (let i = 0; i < N; i++) {
      const sx = -PX + r() * LW, sy = -PY + Math.pow(r(), 1.25) * LH * .95, m = r();
      const fall = 1 - clamp((sy + PY) / (LH * 1.05));
      const a = (.12 + .55 * m * m) * (.35 + .65 * fall), s = m > .985 ? 2.6 : m > .9 ? 1.8 : m > .6 ? 1.3 : 1;
      x.fillStyle = rgba(r() < .2 ? '#ffd9a0' : starCol, a); x.fillRect(sx, sy, s, s);
      if (m > .985) { const rg = x.createRadialGradient(sx + 1, sy + 1, 0, sx + 1, sy + 1, 9); rg.addColorStop(0, rgba(starCol, .35 * fall)); rg.addColorStop(1, rgba(starCol, 0)); x.fillStyle = rg; x.fillRect(sx - 9, sy - 9, 20, 20); }
    }
  }
  return c;
}
// live twinkle on top of a sky (cheap): a fixed set of bright stars whose alpha breathes
export function twinkle(ctx, t, cam, { seed = 5, n = 70, p = .05, y1 = H * .75, a = 1, col = '#f6f1ff' } = {}) {
  const r = prng(seed * 7 + 3);
  ctx.save(); camT(ctx, cam, p);
  for (let i = 0; i < n; i++) {
    const x = -PX + r() * LW, y = -PY + Math.pow(r(), 1.3) * (y1 + PY), ph = r() * 7, sp = .6 + r() * 1.6, m = r();
    const al = a * (.25 + .6 * m) * (.55 + .45 * Math.sin(t * sp + ph));
    ctx.fillStyle = rgba(col, al); const s = m > .8 ? 2.2 : 1.5; ctx.fillRect(x, y, s, s);
    if (m > .9) { ctx.fillStyle = rgba(col, al * .25); ctx.fillRect(x - 3, y + s / 2 - .5, 6 + s, 1); ctx.fillRect(x + s / 2 - .5, y - 3, 1, 6 + s); }
  }
  ctx.restore();
}

// ------------------------------------------------------------------ ridges / ground
// fn(x) -> y (world). Draws silhouette + contour hatching + optional light from a point. Returns world layer.
export function ridgeLayer(fn, { col = '#141842', hc = '#8a86c8', ha = .35, seed = 1, light = null, gap = 6, rim = null, rimA = .6, into = null, hatchN = 22, x0 = -PX, x1 = W + PX, bottom = H + PY, grassCol = null, grassN = 0 }) {
  const [c, x] = into || wl();
  const pts = [[x0 - 10, bottom + 10]]; for (let xx = x0 - 10; xx <= x1 + 10; xx += 8) pts.push([xx, fn(xx)]); pts.push([x1 + 10, bottom + 10]);
  roughPoly(x, pts, col, { amp: 1.2, seed });
  x.save(); x.beginPath(); roughPath(x, pts, { amp: 1.2, seed }); x.clip();
  if (light) { const g = x.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.r || 1200); g.addColorStop(0, rgba(light.col, light.a)); g.addColorStop(1, rgba(light.col, 0)); x.fillStyle = g; x.fillRect(x0, -PY, x1 - x0, LH); }
  { const g = x.createLinearGradient(0, H * .4, 0, bottom); g.addColorStop(0, 'rgba(4,5,16,0)'); g.addColorStop(1, 'rgba(4,5,16,.45)'); x.fillStyle = g; x.fillRect(x0, -PY, x1 - x0, LH); }
  const n = vnoise(seed + 3), rr = prng(seed + 40);
  x.strokeStyle = hc; x.lineCap = 'round';
  for (let k = 1; k < hatchN; k++) {
    const off = k * gap * (1 + k * .05); let xx = x0 + rr() * 60;
    while (xx < x1) { const len = 30 + rr() * 170; x.globalAlpha = ha * (.35 + .65 * rr()) * (1 - k / hatchN * .6); x.lineWidth = .9 + rr() * .5; x.beginPath();
      for (let q = xx; q < Math.min(x1, xx + len); q += 6) x.lineTo(q, fn(q) + off + (n(q * .02, k) - .5) * 3); x.stroke(); xx += len + 10 + rr() * 80; }
  }
  x.globalAlpha = 1;
  if (grassCol && grassN) { for (let i = 0; i < grassN; i++) { const gx = x0 + rr() * (x1 - x0), y0 = fn(gx), d = Math.pow(rr(), 1.6), gy = y0 + d * (bottom - y0), l = 3 + rr() * 8 * (1 + d * 3); x.strokeStyle = rr() < .45 - d * .3 ? grassCol : shade(col, .05); x.globalAlpha = (.2 + .5 * rr()) * (1 - d * .4); x.lineWidth = 1 + d; x.beginPath(); x.moveTo(gx, gy); x.lineTo(gx + (rr() - .4) * 4, gy - l); x.stroke(); } x.globalAlpha = 1; }
  x.restore();
  if (rim) { x.save(); x.strokeStyle = rgba(rim, rimA); x.lineWidth = 1.6; x.beginPath(); for (let xx = x0; xx <= x1; xx += 6) x.lineTo(xx, fn(xx) + .5); x.stroke(); x.restore(); }
  return c;
}
// fog band as a world layer (wider than the frame, so it can drift)
export function fogLayer({ y0, y1, col = '#6f73b8', a = .45, seed = 1, sx = .005, sy = .02, cover = .5, soft = .35, k = .4, edgeTop = .5, edgeBot = .5 }) {
  const q = 4, lw = Math.ceil(LW / q), lh = Math.ceil(LH / q), [lc, lx] = layer(lw, lh), d = lx.createImageData(lw, lh), p = d.data, n = vnoise(seed);
  const n2 = parseInt(col.slice(1), 16), R = n2 >> 16, G = (n2 >> 8) & 255, B = n2 & 255;
  for (let j = 0; j < lh; j++) {
    const y = j * q - PY; if (y < y0 || y > y1) continue; const v = (y - y0) / (y1 - y0), band = clamp(v / edgeTop) * clamp((1 - v) / edgeBot);
    for (let i = 0; i < lw; i++) { const xx = i * q - PX, f = fbm(n, xx * sx, y * sy, 5), dens = clamp((f - (1 - cover)) / soft) * Math.pow(band, .7); const o = (j * lw + i) * 4; p[o] = R; p[o + 1] = G; p[o + 2] = B; p[o + 3] = 255 * a * dens; }
  }
  lx.putImageData(d, 0, 0);
  const [fc, fx] = layer(LW, LH); fx.imageSmoothingEnabled = true; fx.drawImage(lc, 0, 0, lw * q, lh * q);
  if (k > 0) stip(fc, { k, g: 1.1, seed: seed + 3 });
  return fc;
}
// soft radial light (world layer), stippled falloff
export function lightLayer(x0, y0, r, { col = C.amber, core = C.amberHot, a = .6, sy = 1, k = .5, seed = 1 } = {}) {
  const [c, x] = wl(); x.translate(x0, y0); x.scale(1, sy);
  const rg = x.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, rgba(core, a)); rg.addColorStop(.15, rgba(col, a * .6)); rg.addColorStop(.5, rgba(col, a * .18)); rg.addColorStop(1, rgba(col, 0));
  x.fillStyle = rg; x.fillRect(-r, -r, 2 * r, 2 * r); stip(c, { k, g: 1.2, seed }); return c;
}

// ------------------------------------------------------------------ figures
// sprite of a person (art.mjs person) rendered once; returns {c, fx, fy} where (fx, fy) = feet centre inside c.
export function figSprite(s, pose = {}, o = {}) {
  const pad = Math.ceil(240 * s), [c, x] = layer(pad * 2, pad * 2);
  const lit = o.light ? { ...o.light, x: pad + (o.light.x ?? 0), y: pad + (o.light.y ?? 0) } : undefined;
  const r = person(x, pad, pad, s, pose, { ...o, light: lit });
  if (o.after) o.after(x, r, pad);
  // feet = lowest opaque row (works for standing, seated and kneeling poses alike)
  const d = x.getImageData(0, 0, c.width, c.height).data; let fy = r.feetY;
  outer: for (let yy = c.height - 1; yy > 0; yy--) for (let xx = 0; xx < c.width; xx += 2) if (d[(yy * c.width + xx) * 4 + 3] > 60) { fy = yy; break outer; }
  return { c, fx: pad, fy, hand: r.hand, s };
}
// draw a sprite with breathing + weight shift (pivot at the feet). k = scale multiplier.
export function drawFig(ctx, sp, x, y, t, { k = 1, ph = 0, sway = 1, alpha = 1, flipX = false } = {}) {
  ctx.save(); if (alpha !== 1) ctx.globalAlpha = alpha; ctx.translate(x, y);
  ctx.rotate(sway * (.008 * Math.sin(t * .7 + ph) + .004 * Math.sin(t * 1.9 + ph * 2)));
  ctx.scale(k * (flipX ? -1 : 1), k * (1 + .008 * Math.sin(t * 2.1 + ph)));
  ctx.drawImage(sp.c, -sp.fx, -sp.fy); ctx.restore();
}
// silhouette sprite (one colour) from a sprite, for distant figures / ghosts
export function tintSprite(sp, col, a = 1) {
  const [c, x] = layer(sp.c.width, sp.c.height); x.drawImage(sp.c, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = rgba(col, a); x.fillRect(0, 0, c.width, c.height);
  return { ...sp, c };
}
export function groundShadow(ctx, x, y, rx, a = .45, col = '#05060f') {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, .16); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx); ctx.restore();
}

// ------------------------------------------------------------------ type
export function txt(ctx, s, x, y, { size = 40, font = 'Inter', weight = 500, color = C.cream, align = 'left', alpha = 1, spacing = 0, base = 'alphabetic' } = {}) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
  ctx.font = `${font.startsWith('Instrument') ? '' : weight + ' '}${size}px "${font}"`;
  if (spacing) { try { ctx.letterSpacing = spacing + 'px'; } catch { } }
  ctx.fillText(s, x, y); ctx.restore();
}
// place label: amber tick + caps word, wipes in
export function placeLabel(ctx, t, t0, x, y, word, sub = '', { a1 = 99 } = {}) {
  const a = eout(lin(t0, t0 + .45, t)) * (1 - lin(a1 - .3, a1, t)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.amber; ctx.fillRect(x, y - 30, 3, 40 * a); ctx.restore();
  txt(ctx, word.toUpperCase(), x + 16, y + (1 - a) * 10, { size: 22, weight: 600, color: C.cream, alpha: a, spacing: 7 });
  if (sub) txt(ctx, sub, x + 16, y + 26 + (1 - a) * 10, { size: 15, weight: 500, color: '#b9b3d8', alpha: a * .9, spacing: 2 });
}

// ------------------------------------------------------------------ finish (per frame, cheap)
export function vig(ctx, a = .45, col = '#05060f') { const g = ctx.createRadialGradient(W * .5, H * .5, H * .35, W * .5, H * .5, H * 1.08); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
// motion smear for (c) handoffs: draws the current content again with offsets (cheap directional blur feel)
export function smear(ctx, cvs, dx, dy, n = 4, a = .22) {
  if (Math.abs(dx) + Math.abs(dy) < 2) return;
  ctx.save(); for (let i = 1; i <= n; i++) { ctx.globalAlpha = a * (1 - i / (n + 1)); ctx.drawImage(cvs, -dx * i / n, -dy * i / n); } ctx.restore();
}
