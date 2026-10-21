// c18 · the sky of the dawn take: one dome seen through the moving camera.
// At H.b it IS the deep night plate of lib/handoff4.mjs (same gradient, same 520 stars, same band, same drift): the plate's pixels are
// read as directions through the start camera, so when the camera tilts down the stars stay where the plate put them and the horizon
// comes up from below. Then the dome warms by elevation (night → rose dawn → the warm morning: rose #e8a3a0, peach, gold), the sun
// glow grows on the horizon, engraved cloud strands catch the light from below, the IF seal rises like a pale foil moon, the sun crests.
//   drawSky(ctx, t, cam, S)   S = { L 0..2 (0 night plate, 1 rose dawn, 2 morning), stars 0..1, sun: { az, el }, sunA 0..1,
//                              seal: { az, el, r (rad), pale 0..1, glint, ring } | null, t0 (H.b), cam0 (the camera at H.b) }
import { W, H, clamp, mix, rgba, prng, canvas } from '../engine.mjs';
import { stipple } from './art.mjs';
import { ring } from './certificate.mjs';
import { TAU, once, ramp, css, mix3, mixRGB, dirScr, elevAt, horizonY, ifSeal, hash } from './v2_c18_kit.mjs';

const D = Math.PI / 180;
// ---------------------------------------------------------------- the plate (copied from lib/handoff4.mjs skyPlate, tone 'deep')
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
const BAND = (() => { const r = prng(55), b = []; for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); b.push([x, y, a]); } return b; })();
const S0 = '#04050f', S1 = '#0a0d26', S2 = '#141436';
// the plate colour at a start-camera row (piecewise linear in y, exactly as the plate's 3-stop gradient)
function plateRow(y) { if (y <= 0) return mixRGB(S0, S0, 0); if (y <= .62 * H) return mixRGB(S0, S1, y / (.62 * H)); if (y <= H) return mixRGB(S1, S2, (y - .62 * H) / (.38 * H)); return mixRGB(S2, S2, 0); }

// ---------------------------------------------------------------- the dome's colour by elevation
const DAWN = [[-2, '#f6c094'], [0, '#f2b08e'], [1.2, '#e8a090'], [3, '#c97f8e'], [6, '#9a6488'], [10, '#6f5080'], [16, '#4a3f72'], [26, '#2f2f61'], [40, '#1d2250'], [60, '#121740'], [90, '#0c1034']];
const MORN = [[-2, '#ffe9bf'], [0, '#ffe2b4'], [1.5, '#ffd3a2'], [3.5, '#f9bd98'], [7, '#ecaa9d'], [11, '#e8a3a0'], [17, '#c994a6'], [26, '#9d84aa'], [40, '#7a76a6'], [60, '#5f6699'], [90, '#4f5a8e']];
function nightRGB(e, cam0) {
  const y0 = (cam0.oy ?? H / 2) - cam0.f * Math.tan(e - cam0.pitch), eB = elevAt(cam0, H);
  if (y0 <= H) return plateRow(y0);
  return mixRGB(S2, '#1e1c48', clamp((eB - e) / eB));   // below the plate's bottom edge: the night thins toward the horizon
}
export function domeRGB(e, L, cam0) {
  const ed = e / D;
  if (L <= 1) { const n = nightRGB(e, cam0); if (L <= 0) return n; const d = ramp(DAWN, ed); return mix3(n, d, L * L * (3 - 2 * L)); }
  const d = ramp(DAWN, ed), m = ramp(MORN, ed), u = clamp(L - 1); return mix3(d, m, u * u * (3 - 2 * u));
}
const ESTOPS = [-3, -1, 0, .4, .8, 1.3, 2, 3, 4.2, 5.6, 7.2, 9, 11, 13.5, 16.5, 20, 24, 28, 33, 38, 44, 50, 57, 64, 72, 80, 89].map((v) => v * D);

// ---------------------------------------------------------------- clouds: long engraved strands lit from below
const CLOUDS = [
  { az0: -.95, az1: -.18, el: 6.2 * D, th: .55 * D, seed: 1 }, { az0: -.55, az1: .35, el: 9.5 * D, th: .45 * D, seed: 2 },
  { az0: .05, az1: .78, el: 4.1 * D, th: .38 * D, seed: 3 }, { az0: .3, az1: 1.05, el: 12.8 * D, th: .7 * D, seed: 4 },
  { az0: -.3, az1: .5, el: 17.5 * D, th: .9 * D, seed: 5 }, { az0: -1.1, az1: -.4, el: 14.2 * D, th: .6 * D, seed: 6 },
  { az0: .55, az1: 1.2, el: 7.4 * D, th: .4 * D, seed: 7 }, { az0: -.15, az1: .25, el: 2.6 * D, th: .22 * D, seed: 8 },
  { az0: -.75, az1: .1, el: 23 * D, th: 1.1 * D, seed: 9 },
];
function cloudStrand(ctx, t, cam, C, L, sunAz) {
  const n = 28, top = [], bot = [], drift = t * .0016, w = (u) => Math.sin(Math.PI * u) ** .6;
  for (let i = 0; i <= n; i++) {
    const u = i / n, az = mix(C.az0, C.az1, u) + drift, k = w(u) * (.75 + .25 * Math.sin(u * 9 + C.seed * 2.1 + t * .05));
    const a = dirScr(cam, az, C.el + C.th * .5 * k), b = dirScr(cam, az, C.el - C.th * .5 * k * .8);
    if (!a || !b) return; top.push(a); bot.push(b);
  }
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of top.concat(bot)) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  if (x1 < -50 || x0 > W + 50 || y1 < -50 || y0 > H + 50) return;
  ctx.beginPath(); top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath();
  // colour: night = a shade darker than the sky; dawn = lavender body with a rose/gold underside; morning = peach and gold
  const near = clamp(1 - Math.abs(mix(C.az0, C.az1, .5) - sunAz) / 1.2), lo = L <= 1 ? mixRGB('#15153a', '#e3929a', L) : mixRGB('#e3929a', '#ffd6a6', L - 1), hi = L <= 1 ? mixRGB('#0d0f2c', '#5c4b7c', L) : mixRGB('#5c4b7c', '#c59aaa', L - 1);
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, css(hi, .92)); g.addColorStop(.62, css(mix3(hi, lo, .5), .92)); g.addColorStop(1, css(mix3(lo, [255, 236, 200], near * .35 * clamp(L - .6)), .95));
  ctx.fillStyle = g; ctx.fill();
  // engraved: fine lines along the strand, denser in its shadowed top
  ctx.save(); ctx.clip(); ctx.strokeStyle = css(mix3(hi, [10, 10, 30], .5), .35); ctx.lineWidth = .7; ctx.beginPath();
  for (let k = 1; k < 6; k++) { const q = k / 6; for (let i = 0; i <= n; i++) { const x = mix(top[i][0], bot[i][0], q), y = mix(top[i][1], bot[i][1], q * q); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }
  ctx.stroke(); ctx.restore();
  // the lit lip on the underside
  ctx.strokeStyle = css(mix3(lo, [255, 244, 222], .4), .55 * clamp(L - .3)); ctx.lineWidth = 1.2; ctx.beginPath(); bot.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + .5) : ctx.moveTo(p[0], p[1] + .5))); ctx.stroke();
}

// ---------------------------------------------------------------- the sun (1.04's sun: stippled bloom, a cream core, one guilloche halo)
const sunBloom = () => once('c18sunbloom', () => { const R = 640, [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); [[0, 'rgba(255,246,226,1)'], [.05, 'rgba(255,226,170,.9)'], [.16, 'rgba(255,180,100,.35)'], [.45, 'rgba(255,150,80,.08)'], [1, 'rgba(255,150,80,0)']].forEach(([o, col]) => rg.addColorStop(o, col)); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .8, g: 1.2, seed: R }); return c; });
const moonHalo = () => once('c18moonhalo', () => { const R = 400, [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); [[0, 'rgba(255,236,200,.5)'], [.3, 'rgba(255,220,170,.22)'], [.6, 'rgba(240,200,190,.06)'], [1, 'rgba(240,200,190,0)']].forEach(([o, col]) => rg.addColorStop(o, col)); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .7, g: 1.2, seed: 33 }); return c; });
function putSprite(ctx, B, x, y, s, a, op = 'lighter') { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(B, x - B.width / 2 * s, y - B.height / 2 * s, B.width * s, B.height * s); ctx.restore(); }

// the plate's stars and band, as the plate draws them at time t (unwrapped after H.b), in start-camera screen space
function starScreen(i, t, t0) {
  const [x, y] = STARS[i], dx = t * 2.2, dy = t * .6, X0 = ((x + t0 * 2.2) % W + W) % W, Y0 = ((y + t0 * .6) % H + H) % H;
  return [X0 + (dx - t0 * 2.2), Y0 + (dy - t0 * .6)];
}
// start-camera screen point → direction (az, el)
function toDir(cam0, X, Y) {
  const xr = X - W / 2, yc = (cam0.oy ?? H / 2) - Y, zc = cam0.f, p = cam0.pitch, cp = Math.cos(p), sp = Math.sin(p);
  const dy = yc * cp + zc * sp, zf = -yc * sp + zc * cp, ca = Math.cos(cam0.az || 0), sa = Math.sin(cam0.az || 0);
  const dx = xr * ca + zf * sa, dz = xr * sa - zf * ca;
  return [Math.atan2(dx, -dz), Math.atan2(dy, Math.hypot(dx, dz))];
}
const sameCam = (a, b) => Math.abs(a.pitch - b.pitch) < 1e-9 && Math.abs((a.az || 0) - (b.az || 0)) < 1e-9 && Math.abs(a.f - b.f) < 1e-9 && Math.abs((a.oy ?? H / 2) - (b.oy ?? H / 2)) < 1e-9;

export function drawSky(ctx, t, cam, S) {
  const L = S.L ?? 0, cam0 = S.cam0, hy = horizonY(cam);
  // 1 · the dome
  const stops = [];
  for (const e of ESTOPS) { const de = e - (cam.pitch || 0); if (Math.abs(de) > 88 * D) continue; const y = (cam.oy ?? H / 2) - cam.f * Math.tan(de); if (y < -400 || y > H + 400) continue; stops.push([y, domeRGB(e, L, cam0)]); }
  for (const yy of [0, .62 * H, H]) stops.push([yy, domeRGB(elevAt(cam, yy), L, cam0)]);
  stops.sort((a, b) => a[0] - b[0]);
  const ya = Math.min(0, stops[0][0]), yb = Math.max(H, stops[stops.length - 1][0]), g = ctx.createLinearGradient(0, ya, 0, yb);
  for (const [y, c] of stops) g.addColorStop(clamp((y - ya) / (yb - ya)), css(c));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // 2 · the glow of the coming sun: a wide warm dome round its point on the horizon, a hot band hugging the horizon
  const sun = S.sun, sp = dirScr(cam, sun.az, Math.max(sun.el, -.2)), sh = dirScr(cam, sun.az, 0);
  const gw = clamp(L / 1.4) * (S.glowA ?? 1);
  if (sp && sh && gw > 0) {
    const R = cam.f * .95, cx = sh[0], cy = sh[1];
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(cx, cy); ctx.scale(1.55, 1);
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, R); rg.addColorStop(0, `rgba(255,214,160,${.42 * gw})`); rg.addColorStop(.18, `rgba(246,170,130,${.22 * gw})`); rg.addColorStop(.5, `rgba(200,120,140,${.08 * gw})`); rg.addColorStop(1, 'rgba(160,100,140,0)');
    ctx.fillStyle = rg; ctx.fillRect(-R, -R, 2 * R, 2 * R); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(cx, hy); ctx.scale(1, .075);
    const R2 = W * 1.1, hb = ctx.createRadialGradient(0, 0, 0, 0, 0, R2); hb.addColorStop(0, `rgba(255,228,180,${.5 * gw})`); hb.addColorStop(.35, `rgba(255,190,140,${.2 * gw})`); hb.addColorStop(1, 'rgba(255,170,130,0)');
    ctx.fillStyle = hb; ctx.fillRect(-R2, -R2, 2 * R2, 2 * R2); ctx.restore();
  }
  // 3 · stars and the band (the plate's), fading as the sky brightens
  const sa = clamp(S.stars ?? 1);
  if (sa > .002) {
    const t0 = S.t0, exact = sameCam(cam, cam0);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.42); const c42 = Math.cos(.42), s42 = Math.sin(.42);
    for (const [x, y, a] of BAND) {
      let px = x + t * 1.5, py = y;
      if (!exact) {   // local band point → start-camera screen → direction → current screen → back into the rotated frame
        const X = W / 2 + px * c42 + py * s42, Y = H / 2 - px * s42 + py * c42, [az, el] = toDir(cam0, X, Y), q = dirScr(cam, az, el); if (!q) continue;
        const ux = q[0] - W / 2, uy = q[1] - H / 2; px = ux * c42 - uy * s42; py = ux * s42 + uy * c42;
      }
      ctx.fillStyle = `rgba(216,230,255,${a * sa})`; ctx.fillRect(px, py, 1.3, 1.3);
    }
    ctx.restore();
    for (let i = 0; i < STARS.length; i++) {
      const [, , s, ph, f] = STARS[i], tw = .55 + .45 * Math.sin(t * f + ph);
      let [X, Y] = starScreen(i, t, t0);
      if (!exact) { const [az, el] = toDir(cam0, X, Y), q = dirScr(cam, az, el); if (!q) continue; [X, Y] = q; }
      if (X < -10 || X > W + 10 || Y < -10 || Y > H + 10) continue;
      const fade = clamp((hy - Y) / 260);   // stars thin out toward the glowing horizon
      ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8) * sa * fade})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
      if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw * sa * fade})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
    }
  }
  // 4 · cloud strands (they appear out of the dark sky as the light reaches them: drawn from the start, a shade off the night sky)
  for (const C of CLOUDS) cloudStrand(ctx, t, cam, C, L, sun.az);
  // 5 · the IF seal: a pale foil moon
  const M = S.seal;
  if (M) {
    const c = dirScr(cam, M.az, M.el), e = dirScr(cam, M.az, M.el + M.r);
    if (c && e) {
      const r = Math.hypot(e[0] - c[0], e[1] - c[1]);
      if (c[0] > -r * 3 && c[0] < W + r * 3 && c[1] > -r * 3 && c[1] < H + r * 3) {
        putSprite(ctx, moonHalo(), c[0], c[1], r * 3.2 / 400, (M.halo ?? 1) * .85 * clamp((M.el + .03) / .06));
        const rg = M.ring * clamp((M.el + .01) / .05); if (rg > 0) ring(ctx, c[0], c[1], r * 1.42, r * 1.42, { lines: 7, band: Math.max(6, r * .1), wave: Math.max(14, r * .2), col: '#fff1d6', glow: '#ffb35c', glowA: .06, a: .34 * rg, lw: .7, ph: t * .21 });
        ifSeal(ctx, c[0], c[1], r, t, { rot: M.rot ?? 0, pale: M.pale ?? 0, paleCol: M.paleCol, glint: M.glint });
      }
    }
  }
  // 6 · the sun: bloom always (its upper half shows over the land before it rises), the disc once it is near the horizon
  if (sp) {
    const k = cam.f / 1400, a = S.sunA ?? 1;
    putSprite(ctx, sunBloom(), sp[0], sp[1], 1.15 * k * (1 + .02 * Math.sin(t * 1.4)) * (S.bloomK ?? 1), .95 * a);
    if (sun.el > -.05) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,248,232,${.95 * a})`; ctx.beginPath(); ctx.arc(sp[0], sp[1], Math.max(4, cam.f * .0195), 0, TAU); ctx.fill(); ctx.restore(); }
    if ((S.sunRing ?? 0) > 0) ring(ctx, sp[0], sp[1], 150 * k, 150 * k, { lines: 7, band: 14, wave: 24, col: '#fff1d6', glow: '#ffb35c', glowA: .05, a: .28 * S.sunRing, lw: .6, ph: t * .25 });
  }
  return { sun: sp, horizon: hy };
}
export const prewarmSky = () => { sunBloom(); moonHalo(); };
// after the land: the sun's glow spills over the skyline (1.04: the stippled bloom over the towers), a warm haze band on the horizon
export function skyGlow(ctx, t, cam, S, sk) {
  if (!sk || !sk.sun) return;
  const k = cam.f / 1400, a = clamp((S.L - .3) / .9) * (S.glowA ?? 1), [x, y] = sk.sun;
  const yy = Math.min(y, sk.horizon + 20), R0 = 520 * k, g0 = ctx.createRadialGradient(x, yy, 0, x, yy, R0);
  g0.addColorStop(0, `rgba(255,226,180,${.32 * a})`); g0.addColorStop(.25, `rgba(255,190,140,${.12 * a})`); g0.addColorStop(1, 'rgba(255,170,130,0)');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g0; ctx.fillRect(x - R0, yy - R0, 2 * R0, 2 * R0); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, sk.horizon); ctx.scale(1, .06);
  const R = W * .9, g = ctx.createRadialGradient(0, 0, 0, 0, 0, R); g.addColorStop(0, `rgba(255,214,160,${.3 * a})`); g.addColorStop(.4, `rgba(246,170,130,${.1 * a})`); g.addColorStop(1, 'rgba(240,160,130,0)');
  ctx.fillStyle = g; ctx.fillRect(-R, -R, 2 * R, 2 * R); ctx.restore();
}
// motes in the low sun (1.04)
export function motes(ctx, t, cx, cy, R, a, seed = 23) {
  if (a <= 0) return; const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 120; i++) { const ang = r() * TAU, d = R * (.2 + r() * 1.1), sp = .2 + r() * .5, x = cx + Math.cos(ang) * d + Math.sin(t * sp + i) * 24, y = cy + Math.sin(ang) * d * .8 + Math.cos(t * sp * .8 + i * 1.7) * 18 - ((t * 8) % 60); const f = Math.max(0, 1 - d / (R * 1.3)); ctx.fillStyle = `rgba(255,214,170,${(.12 + .45 * r()) * f * a})`; const z = r() < .8 ? 1.5 : 2.6; ctx.fillRect(x, y, z, z); }
  ctx.restore();
}
export { hash };
