// Film 8 · the night sea: a dark plane to the horizon, engraved swell lines at world-fixed crests (they stream past when the camera
// flies, they bob and drift when it rests), starlight on the crests, a glitter path under each light, haze at the horizon.
//   drawSea(ctx, t, C, o)    o: { glints: [{ x (screen), y (screen, where the light sits), col, a, w (half width at the horizon, px), spread }],
//                                 calm 0..1 (smaller swell), dawn 0..1 (warm sky light on the water), lift 0 (overall brightness) }
//   waterY(X, Z, t)          the swell height (m) at a point: boats and wakes ride on it
import { rgba, clamp } from '../engine.mjs';
import { W, H, TAU, hash, mixHex } from './s8_kit.mjs';

export const waterY = (X, Z, t) => .16 * Math.sin(Z * .55 - t * 1.1 + .4 * Math.sin(X * .05)) + .07 * Math.sin((Z * .8 + X * .6) * .9 - t * 1.7);

// world X range on the row Z = z0 (Y = y0) that is on screen (± pad), or null
function rowRange(C, z0, y0, pad = 120) {
  const cy = Math.cos(C.yaw), sy = Math.sin(C.yaw), cp = Math.cos(C.pitch), sp = Math.sin(C.pitch), dz = z0 - C.z, dy = y0 - C.y;
  // x1 = a X + b, z2 = c X + d
  const a = cy, b = -C.x * cy - dz * sy, c = sy * cp, d = (-C.x * sy + dz * cy) * cp - dy * sp;
  const xs = [];
  for (const s of [-960 - pad, 960 + pad]) { const den = C.F * a - s * c; if (Math.abs(den) > 1e-9) xs.push((s * d - C.F * b) / den); }
  // keep the part in front of the camera (z2 > .2)
  let lo = Math.min(...xs), hi = Math.max(...xs);
  if (Math.abs(c) > 1e-9) { const xz = (.2 - d) / c; if (c > 0) lo = Math.max(lo, xz); else hi = Math.min(hi, xz); }
  else if (d < .2) return null;
  if (!(hi > lo)) return null;
  return [lo, hi];
}
// world Z range of the water on screen: from the bottom edge (or under the camera) to far away
function zRange(C, y0) {
  const h = Math.max(.05, C.y - y0), half = Math.atan(540 / C.F), dBot = C.pitch + half, dTop = C.pitch - half;
  const g = (d) => h / Math.tan(Math.min(1.5, d));
  let far = dTop > .002 ? g(dTop) * 1.25 + 5 : Math.min(4000, Math.max(300, h * 1200));
  const near = dBot > .002 ? g(dBot) : far;
  const hw = (near + 2) * (960 / C.F) * 1.4 + 1, cyw = Math.cos(C.yaw), syw = Math.abs(Math.sin(C.yaw));
  far = Math.min(far, 4000);
  return [C.z + near * cyw - hw * syw - 1.5, C.z + far * cyw + far * syw * .6];
}

export function drawSea(ctx, t, C, o = {}) {
  const hy = C.hy; if (hy > H + 4) return;
  const y0 = 0, lift = o.lift || 0, dawn = o.dawn || 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const top = Math.max(-2, hy);
  const g = ctx.createLinearGradient(0, hy, 0, Math.max(hy + 40, H + 60));
  g.addColorStop(0, mixHex('#1c1a42', '#5a4060', dawn * .6)); g.addColorStop(.06, mixHex('#121131', '#3a2c4a', dawn * .5)); g.addColorStop(.35, '#0b0b22'); g.addColorStop(1, '#05050e');
  ctx.fillStyle = g; ctx.fillRect(0, top, W, H - top + 2);
  // swell crests at world Z = j·λ; level of detail: far rows are thinned (every 2nd, 4th …) where they would crowd
  const [z0, z1] = zRange(C, y0), lam = .9, j0 = Math.ceil(z0 / lam), calm = o.calm ?? 0;
  const amp = 1 - .6 * calm, glints = o.glints || [];
  let lastY = 1e9;
  for (let j = j0; j * lam < z1; ) {
    const Z = j * lam, pz = C.P(C.x + (Z - C.z) * Math.tan(C.yaw), y0, Z, .2);
    const dist = Z - C.z, step = Math.max(1, 2 ** Math.floor(Math.log2(Math.max(1, dist / 14))));
    if (j % step) { j += step - (((j % step) + step) % step); continue; }
    const rr = rowRange(C, Z, y0); if (!rr) { j += step; continue; }
    const [x0, x1] = rr, k = C.F / Math.max(.3, dist), segs = Math.min(120, Math.max(10, Math.round((x1 - x0) * k / 26)));
    const sy = pz ? pz[1] : null; if (sy != null && (sy > H + 30 || sy < hy - 2)) { j += step; continue; }
    if (sy != null && Math.abs(sy - lastY) < 1.4) { j += step; continue; }
    lastY = sy ?? lastY;
    const far = clamp((dist - 30) / 900), lw = clamp(k * .012, .5, 2.4), ph = hash(j * .37) * TAU;
    // the crest line: bright rims on the crests (starlight), dark troughs, broken into strokes like an engraving
    const rim = [], dark = [];
    for (let s = 0; s <= segs; s++) {
      const X = x0 + (x1 - x0) * s / segs, hh = waterY(X, Z, t) * amp, p = C.P(X, y0 + hh, Z, .2); if (!p) continue;
      const crest = clamp((hh / (.23 * amp) + 1) / 2), gap = hash(j * 7.3 + Math.floor((X + t * .35 + ph) / 1.7) * 1.31);
      (gap > .3 ? rim : dark).push([p[0], p[1], crest, X]);
    }
    const fa = (1 - far * .85) * (1 - .55 * clamp((C.pitch - .7) / .5));
    ctx.lineCap = 'round';
    // the swell's body: a broad band under each crest, alternating a shade darker or lighter (layered indigo)
    { const all = rim.concat(dark).sort((p, q) => p[3] - q[3]), sp = clamp(C.F * Math.max(.3, C.y - y0) * lam * step / Math.max(1, dist * dist), 1, 60);
      if (all.length > 1 && sp > 1.5 && C.pitch < .9) { const v = hash(j * .61 + 3.1); ctx.strokeStyle = v > .5 ? rgba(mixHex('#15153a', '#3a2a50', dawn * .6), .35 * fa) : rgba('#04040e', .4 * fa); ctx.lineWidth = sp * .55; ctx.beginPath(); all.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + sp * .3) : ctx.moveTo(p[0], p[1] + sp * .3))); ctx.stroke(); } }
    ctx.strokeStyle = rgba('#03030a', .55 * fa); ctx.lineWidth = lw * 1.4; ctx.beginPath();
    for (let i = 1; i < dark.length; i++) { const a = dark[i - 1], b = dark[i]; if (b[3] - a[3] > (x1 - x0) / segs * 1.5) continue; ctx.moveTo(a[0], a[1] + lw); ctx.lineTo(b[0], b[1] + lw); }
    ctx.stroke();
    ctx.strokeStyle = rgba(mixHex('#7e8ab8', '#d8a080', dawn * .7), (.18 + .3 * (1 - far) + lift) * (.6 + .4 * fa)); ctx.lineWidth = lw; ctx.beginPath();
    for (let i = 1; i < rim.length; i++) { const a = rim[i - 1], b = rim[i]; if (b[3] - a[3] > (x1 - x0) / segs * 1.5 || a[2] + b[2] < .9) continue; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    ctx.stroke();
    // glitter paths: brighter strokes on this row where it passes under a light
    if (glints.length && sy != null) for (const L of glints) {
      if (sy < L.y) continue;
      const hw = (L.w ?? 6) + (sy - Math.max(hy, L.y)) * (L.spread ?? .22), la = (L.a ?? 1) * clamp((sy - L.y) / 6) * (L.fade ? clamp(1 - (sy - L.y) / L.fade) : 1);
      if (la <= 0) continue;
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(L.col, .55 * la); ctx.lineWidth = Math.max(1, lw * 1.2); ctx.beginPath();
      const n = Math.max(2, Math.round(hw / 9));
      for (let q = 0; q < n; q++) {
        const u = hash(j * 3.7 + q * 1.9 + Math.floor(t * 6 + q) * .13), xx = L.x + (u * 2 - 1) * hw * (.3 + .7 * hash(q + j));
        const len = (3 + 9 * hash(j + q * 5.1)) * clamp(lw, .7, 2), yy = sy + (hash(j * 1.3 + q) - .5) * lw * 3;
        if (hash(j * 9.1 + q * 2.3 + Math.floor(t * 9 + j) * .7) < .35) continue;
        ctx.moveTo(xx - len, yy); ctx.lineTo(xx + len, yy);
      }
      ctx.stroke(); ctx.globalCompositeOperation = 'source-over';
    }
    j += step;
  }
  // haze on the horizon
  if (hy > -10 && hy < H) {
    const hz = ctx.createLinearGradient(0, hy - 16, 0, hy + 26); hz.addColorStop(0, rgba('#2a2858', 0)); hz.addColorStop(.4, rgba(mixHex('#2a2858', '#e0a080', dawn * .8), .55)); hz.addColorStop(1, rgba('#1a1840', 0));
    ctx.fillStyle = hz; ctx.fillRect(0, hy - 16, W, 42);
  }
  ctx.restore();
}
