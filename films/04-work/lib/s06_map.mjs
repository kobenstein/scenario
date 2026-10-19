// s06_map.mjs · ★ Wow 6 (G7): "Now multiply that by every kitchen table on Earth."
// The splash droplets rise into the night and become lights: the kitchen windows of one small coastal town.
// On "multiply" the camera pulls back ~40x: town → coast → an endless strip of coastlines (no globe), amber dots
// igniting in waves outward from that first town. Three levels of detail are cached; dots are drawn per frame.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, lin, sm, eio, eout, ein, sine, drift, lay, big, spr, glowAt, vgrad, radial, paper, vignetteL } from './s06_kit.mjs';
import { vnoise, fbm, stipple, hatch, roughPath, roughPoly, roughRect } from './art.mjs';

const AMB = '#ffb35c', ZMAX = 42;
const n1 = vnoise(71), n2 = vnoise(72);
// land field in world units (world = the full strip at zoom 1, 1920x1080); > 0 is land
const landF = (x, y) => fbm(n1, x * .0016, y * .0034, 6) - .5 + .16 * Math.sin(y * .0058 + 1.2) + .05 * (fbm(n2, x * .02, y * .02, 3) - .5);
// find the home town on a coast near (720, 560)
const O = (() => { let best = null, bd = 1e9; for (let y = 470; y < 650; y += 2) for (let x = 600; x < 840; x += 2) { const v = landF(x, y); if (Math.abs(v) < bd && landF(x, y - 6) > 0 && landF(x, y + 6) < 0) { bd = Math.abs(v); best = [x, y]; } } return best || [720, 560]; })();
export const HOME = O;
// LOD windows: [cx, cy, scale] → a canvas of 1920x1080 shows world [cx ± 960/s, cy ± 540/s]
const LODS = [[960, 540, 1], [O[0], O[1] - 4, 6], [O[0], O[1] - 1, ZMAX * .9]];
function lodPlate(i) {
  return big('s06:map' + i, () => {
    const [cx, cy, s] = LODS[i], [c, g] = lay(), d = g.createImageData(W, H), p = d.data;
    const wx = (X) => cx + (X - W / 2) / s, wy = (Y) => cy + (Y - H / 2) / s;
    const q = i === 0 ? 2 : 2;
    const F = new Float32Array(Math.ceil(W / q) * Math.ceil(H / q)), gw = Math.ceil(W / q);
    for (let Y = 0; Y < H; Y += q) for (let X = 0; X < W; X += q) F[(Y / q) * gw + X / q] = landF(wx(X), wy(Y));
    for (let Y = 0; Y < H; Y++) for (let X = 0; X < W; X++) {
      const v = F[Math.floor(Y / q) * gw + Math.floor(X / q)], o = (Y * W + X) * 4;
      if (v > 0) { const k = clamp(v * 3); p[o] = 22 + 12 * (1 - k); p[o + 1] = 22 + 8 * (1 - k); p[o + 2] = 52 + 10 * (1 - k); }
      else { const k = clamp(-v * 6); p[o] = 8 + 6 * (1 - k); p[o + 1] = 11 + 8 * (1 - k); p[o + 2] = 30 + 14 * (1 - k); }
      p[o + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    // coast lines: cream contour where the field crosses 0, plus offshore echo lines (engraved-map look)
    for (const [lv, a, w] of [[0, .55, 1.4], [-.025, .16, 1], [-.055, .1, 1], [-.09, .06, 1]]) {
      g.strokeStyle = rgba('#f3e6c8', a); g.lineWidth = w; g.beginPath();
      for (let j = 0; j < Math.ceil(H / q) - 1; j++) for (let i2 = 0; i2 < gw - 1; i2++) {
        const A = F[j * gw + i2], B = F[j * gw + i2 + 1], Cc = F[(j + 1) * gw + i2 + 1], D = F[(j + 1) * gw + i2], pts = [];
        const e = (u, v, x0, y0, x1, y1) => { if ((u - lv) * (v - lv) < 0) { const k = (lv - u) / (v - u); pts.push([mix(x0, x1, k), mix(y0, y1, k)]); } };
        const x = i2 * q, y = j * q; e(A, B, x, y, x + q, y); e(B, Cc, x + q, y, x + q, y + q); e(D, Cc, x, y + q, x + q, y + q); e(A, D, x, y, x, y + q);
        if (pts.length >= 2) { g.moveTo(...pts[0]); g.lineTo(...pts[1]); }
      }
      g.stroke();
    }
    // relief hatching on land (shadow side), very faint
    { const [hc, hx] = lay(); hatch(hx, [0, 0, W, H], { angle: .8, gap: 7, col: '#000000', a: .25, seed: 3 + i, broken: .5 }); const m = hx.getImageData(0, 0, W, H).data; void m; g.save(); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = .5; g.drawImage(hc, 0, 0); g.restore(); }
    if (i === 2) {   // the home town from above: roofs, lanes, a quay; lights are drawn per frame
      const rr = prng(9);
      for (const h of townHouses()) { const [X, Y] = [W / 2 + (h[0] - cx) * s, H / 2 + (h[1] - cy) * s]; g.save(); g.translate(X, Y); g.rotate(h[2]); roughRect(g, -h[3] / 2, -h[4] / 2, h[3], h[4], mixHex('#2a2448', '#3a3058', rr()), { amp: .8, seed: Math.floor(rr() * 99) }); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-h[3] / 2, 0, h[3], h[4] / 2); g.fillStyle = 'rgba(200,190,230,.18)'; g.fillRect(-h[3] / 2, -1, h[3], 2); g.restore(); }
    }
    return c;
  });
}
// houses of the home town in world coords: [x, y, rot, w, h] (w,h in screen px at LOD 2)
function townHouses() {
  return spr('s06townhouses', () => {
    const rr = prng(31), out = [];
    for (let k = 0; k < 140 && out.length < 70; k++) { const x = O[0] + (rr() - .5) * 46, y = O[1] - 2 - rr() * 24; if (landF(x, y) < .01) continue; out.push([x, y, (rr() - .5) * .5 + Math.round(rr()) * Math.PI / 2, 40 + rr() * 50, 30 + rr() * 30]); }
    return out;
  });
}
// dots: world points on land, denser near coasts; three sets for three scales
function dots() {
  return spr('s06mapdots', () => {
    const out = [], rr = prng(5);
    const add = (n, cx, cy, rx, ry, lvl, size) => { let k = 0; while (k < n) { const x = cx + (rr() - .5) * 2 * rx, y = cy + (rr() - .5) * 2 * ry, v = landF(x, y); if (v <= 0) continue; const coast = Math.exp(-v * 14); if (rr() > .15 + .85 * coast) continue; out.push([x, y, Math.hypot(x - O[0], y - O[1]), lvl, size * (.6 + rr() * .8), rr()]); k++; } };
    add(7000, 960, 540, 1000, 560, 0, 1.6);
    add(2600, O[0], O[1], 170, 95, 1, 1.4);
    for (const h of townHouses()) out.push([h[0] + (rr() - .5) * 1.2, h[1] + (rr() - .5) * .8, Math.hypot(h[0] - O[0], h[1] - O[1]), 2, 1.4, rr()]);
    return out;
  });
}
export const DOT_WORLD = (() => { let best = [1180, 430], bd = 1e9; for (let y = 380; y < 480; y += 3) for (let x = 1100; x < 1260; x += 3) { const v = landF(x, y); if (v > 0 && v < bd) { bd = v; best = [x, y]; } } return best; })();
export const DOT_OUT = [W / 2 + (DOT_WORLD[0] - 960), H / 2 + (DOT_WORLD[1] - 540)];
export function map(ctx, t, s, A) {
  const tM = A.multiply - .12, tE = A.earth + .5;
  const u = lin(tM, tE, t), e = 1 - Math.pow(1 - sine(u), 1.6);
  const z = Math.exp(Math.log(ZMAX) * (1 - e)) * (1 + .01 * Math.sin(t * .5));
  const cx = mix(O[0], 960, Math.pow(e, 1.8)) + drift(t, 3, 1) / z, cy = mix(O[1] - 2, 540, Math.pow(e, 1.8)) + drift(t, 2, 2) / z;
  const SX = (x) => W / 2 + (x - cx) * z, SY = (y) => H / 2 + (y - cy) * z;
  ctx.fillStyle = '#070a1e'; ctx.fillRect(0, 0, W, H);
  // LOD plates
  for (const [i, [lx, ly, ls]] of LODS.entries()) {
    const k = z / ls, a = i === 0 ? 1 : sm(lin(ls * .45, ls * .8, z));
    if (a <= 0 || k > 6) continue;
    ctx.save(); ctx.globalAlpha = a; ctx.setTransform(k, 0, 0, k, W / 2 + (lx - cx) * z - W / 2 * k, H / 2 + (ly - cy) * z - H / 2 * k); ctx.drawImage(lodPlate(i), 0, 0); ctx.restore();
  }
  // the wave front: radius in world units, always reaching toward the frame edge as we pull back
  const front = t < tM ? 0 : (900 / z) * .95 * sm(lin(tM, tM + .5, t)) + (t > tE ? (t - tE) * 400 : 0);
  const D = dots(), gs = spr('s06dotglow', () => { const [c, g] = lay(64, 64), rg = g.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, 'rgba(255,240,210,1)'); rg.addColorStop(.18, rgba(AMB, .7)); rg.addColorStop(1, rgba(AMB, 0)); g.fillStyle = rg; g.fillRect(0, 0, 64, 64); return c; });
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, d, lvl, size, r] of D) {
    const X = SX(x), Y = SY(y); if (X < -20 || X > W + 20 || Y < -20 || Y > H + 20) continue;
    // visibility by scale level (fine dots fade out as they crowd)
    const lv = lvl === 2 ? sm(lin(ZMAX * .3, ZMAX * .6, z)) : lvl === 1 ? sm(lin(2.5, 5, z)) * (1 - sm(lin(ZMAX * .6, ZMAX, z)) * .7) : 1 - sm(lin(6, 12, z));
    if (lv <= 0) continue;
    const lit = lvl === 2 ? sm(lin(s.a + .4 + r * 1.2, s.a + .9 + r * 1.2, t)) : clamp((front - d) / (front * .12 + 2));
    if (lit <= 0) continue;
    const tw = .75 + .25 * Math.sin(t * (1.5 + r * 3) + r * 20), R = size * (lvl === 2 ? 3.2 : 2.2) * (1 + .6 * Math.exp(-Math.pow((front - d) / (front * .05 + 1), 2)));
    ctx.globalAlpha = Math.min(1, lit * lv * tw);
    ctx.drawImage(gs, X - R * 3, Y - R * 3, R * 6, R * 6);
  }
  ctx.restore();
  // the wave crest: a faint ring of light travelling outward
  if (front > 0 && t < tE + .6) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; { const fa = 1 - lin(tE - .3, tE + .6, t); for (const [lw, al] of [[90, .025], [50, .035], [18, .04]]) { ctx.strokeStyle = rgba(AMB, al * fa); ctx.lineWidth = lw; ctx.beginPath(); ctx.ellipse(SX(O[0]), SY(O[1]), front * z, front * z * .9, 0, 0, 7); ctx.stroke(); } } ctx.restore(); }
  // your town's light: the first and warmest
  { const X = SX(O[0]), Y = SY(O[1] - 2); glowAt(ctx, X, Y, mix(40, 260, clamp(z / ZMAX)), .35 + .1 * Math.sin(t * 2), AMB, '#fff1d0'); }
  // the droplets arriving from the splash below: they rise, slow, warm to amber and settle as the town's lights
  if (t < s.a + 1.8) {
    const rr = prng(21), H0 = townHouses();
    for (let i = 0; i < 34; i++) {
      const tg = H0[i % H0.length], tx = SX(tg[0]), ty = SY(tg[1]), x0 = W / 2 + (rr() - .5) * 700, ph = rr();
      const k = eout(lin(s.a - .5 + ph * .3, s.a + 1.2 + ph * .3, t));
      const X = mix(x0, tx, k), Y = mix(H + 80 + rr() * 300, ty, k), col = mixHex('#ffffff', AMB, k), a = 1 - sm(lin(s.a + 1.2, s.a + 1.8, t));
      glowAt(ctx, X, Y, 14 + 10 * k, .7 * a, col, '#ffffff'); ctx.fillStyle = rgba('#ffffff', .9 * a); ctx.beginPath(); ctx.arc(X, Y, 3, 0, 7); ctx.fill();
    }
  }
  // the dot we will push into for the square
  if (t > tE - .5) { const a = sm(lin(tE - .5, tE + .2, t)); glowAt(ctx, SX(DOT_WORLD[0]), SY(DOT_WORLD[1]), 40, .6 * a, AMB, '#fff4d8'); }
  vignetteL(ctx, .5, '#03040e'); paper(ctx, .06, t);
}
