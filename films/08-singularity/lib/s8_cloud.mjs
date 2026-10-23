// Film 8 · cloud kit (owner B1; shots.md §6 storms, §7 palette). Engraved, opaque cloud (never a fade): the overcast lid that closes over the
// Milky Way and tears open again, single cloud banks lit from below (an island's fire / the dawn under them), rain curtains, wind streaks,
// and the grey-blue tone for sky and sea. Sky things live at infinity (directions through the camera), so a tilt or a pan moves them right.
//
//   TONE                        { overcast: { sky: [top, mid, low], sea, cloud, lit }, storm: …, dawn: … }  (§7: overcast #2a3346 / #55607a)
//   tone(ctx, C, kind, k)       the light of `kind` over what is drawn so far (sky above the horizon, sea below); k 0..1 (a lighting change)
//   lid(ctx, t, C, o)           the overcast deck: o: { close 0..1 (0 = open sky, 1 = shut; the two fronts slide in from the left and the
//                               right of az; at close 0 the gap is ±o.open rad, default .9), az (rad, where the last gap is; default the camera's yaw), tear 0..1 (a gap tears open
//                               again round o.tearAz, o.tearW rad wide at 1), tone 'overcast'|'storm', base (el of the deck's underside,
//                               default .03 rad), lit: { az, col '#ffb35c', a } (a warm glow on the underside, e.g. the fire box below),
//                               drift (rad/s, default .004) }  → { edges: [azL, azR] the open gap (null when shut) }
//   bank(ctx, t, C, o)          one cloud bank on the horizon: o: { az, w (rad half width), h (rad top), base .004, seed, tone, lit 0..1
//                               (its underside glows: an island below it, c03.10), litCol '#ffb35c', a 1 (rise: 0 → 1 grows it up from the
//                               horizon, opaque at every stage) }
//   rain(ctx, t, o)             rain curtains in screen space: o: { a .5, ang .25 (slant), speed 1, x0 0, x1 1920, y0 0, y1 1080, seed,
//                               col '#b8c4dc', n 220 }
//   wind(ctx, t, o)             wind streaks across the frame: o: { a .4, dir 1 (→) | −1, speed 1, y0, y1, n 26, col, seed }
import { Path2D } from '@napi-rs/canvas';
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, mixHex, nz, once } from './s8_kit.mjs';
import { skyDir } from './s8_sky.mjs';
import { vnoise, fbm, layer } from './art.mjs';

export const TONE = {
  overcast: { sky: ['#1a2030', '#2a3346', '#55607a'], sea: '#1e2534', cloud: ['#2a3346', '#3c465c', '#55607a'], lit: '#8a94ac' },
  storm: { sky: ['#0e121e', '#232c40', '#55607a'], sea: '#161c2a', cloud: ['#1c2232', '#2c3548', '#4a5470'], lit: '#7a86a4' },
  dawn: { sky: ['#2a2a52', '#8a6a8a', '#f4c08a'], sea: '#3a3456', cloud: ['#4a3a5a', '#8a6a7a', '#e8a07a'], lit: '#ffd9a0' },
};

export function tone(ctx, C, kind, k) {
  if (k <= 0) return; const T = TONE[kind] || TONE.overcast, hy = C.hy;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(k);
  if (hy > 0) { const g = ctx.createLinearGradient(0, Math.min(hy - 900, 0), 0, hy); g.addColorStop(0, T.sky[0]); g.addColorStop(.6, T.sky[1]); g.addColorStop(1, T.sky[2]); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, Math.min(1080, hy)); }
  if (hy < 1080) { ctx.globalCompositeOperation = 'color'; ctx.fillStyle = T.sea; ctx.fillRect(0, Math.max(0, hy), 1920, 1080); }
  ctx.restore();
}

// the engraved cloud texture (tileable in x): fbm masses, dark tops, lighter undersides, fine hatch along the flow
const TW = 2400, TH = 700;
function cloudTex(kind) {
  return once('s8cloud:' + kind, () => {
    const T = TONE[kind] || TONE.overcast, [c, g] = layer(TW, TH), n = vnoise(77), img = g.createImageData(TW, TH), d = img.data;
    const A = T.cloud.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
    for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) {
      const u = x / TW * TAU, f = fbm(n, Math.cos(u) * 2.2 + 5, Math.sin(u) * 2.2 + y / 160, 5), v = y / TH;   // tileable in x
      const m = clamp(.5 + (f - .5) * 2.4 + v * .35 - .1), [a, b] = m < .5 ? [A[0], A[1]] : [A[1], A[2]], q = m < .5 ? m * 2 : (m - .5) * 2;
      const i = (y * TW + x) * 4; d[i] = a[0] + (b[0] - a[0]) * q; d[i + 1] = a[1] + (b[1] - a[1]) * q; d[i + 2] = a[2] + (b[2] - a[2]) * q; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    // engraved flow lines
    const r = prng(78); g.strokeStyle = 'rgba(10,12,22,.22)'; g.lineWidth = 1;
    for (let k = 0; k < 520; k++) { const x = r() * TW, y = r() * TH, L = 40 + r() * 140; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < L; s += 8) g.lineTo(x + s, y + 3 * Math.sin((x + s) * .02 + y)); g.stroke(); }
    g.strokeStyle = 'rgba(200,210,235,.08)'; for (let k = 0; k < 260; k++) { const x = r() * TW, y = TH * (.5 + r() * .5), L = 30 + r() * 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x + L, y + 2); g.stroke(); }
    return c;
  });
}
// a ragged front edge: el-dependent az offset (the clouds' boiling edge)
const edgeOff = (el, seed, t) => .05 * nz(el * 9 + t * .05, seed) + .025 * nz(el * 23 + t * .1, seed + 3);

export function lid(ctx, t, C, o = {}) {
  const close = clamp(o.close ?? 1), tear = clamp(o.tear ?? 0), kind = o.tone || 'overcast', tex = cloudTex(kind);
  const az = o.az ?? C.yaw, base = o.base ?? .03, drift = (o.drift ?? .004) * t, ppr = C.F;   // pixels per radian (near the view centre)
  const gapW = (1 - close) * (o.open ?? .9);   // half width of the open gap (rad; o.open at close 0)
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the deck's region on screen: above the base line (el = base), outside the gap(s); sampled per row of el
  const rows = 90, region = new Path2D();
  const yAt = (el) => { const p = C.D(...skyDir(C.yaw, el)); return p ? p[1] : null; };
  const yB = yAt(base); if (yB == null || yB < -50) { ctx.restore(); return { edges: null }; }
  ctx.save();
  // the deck = everything above the base line, minus the gap(s); each gap is a smooth polygon (its two ragged edges sampled per el)
  region.rect(-50, -4000, 2020, yB + 4001);
  const xs = (a) => 960 + Math.tan(clamp(a - C.yaw, -1.5, 1.5)) * ppr;
  const G = []; if (gapW > 0) G.push(0); if (tear > 0) G.push(1);
  for (const gi of G) {
    const L = [], R = [];
    for (let i = 0; i <= rows; i++) {
      const el = base + (Math.PI / 2 - base) * Math.pow(i / rows, 1.6), y = yAt(el); if (y == null) continue;
      const off = edgeOff(el, 11, t), off2 = edgeOff(el, 23, t);
      let a0, a1; if (gi === 0) { a0 = az - gapW + off; a1 = az + gapW + off2; } else { const ta = o.tearAz ?? az, tw = (o.tearW ?? .6) * tear; a0 = ta - tw + off2 * .6; a1 = ta + tw - off * .6; }
      const yy = i === 0 ? y + 2 : y; L.push([xs(a0), yy]); R.push([xs(a1), yy]);
      if (y < -60) break;
    }
    if (L.length < 2) continue;
    L.forEach((p, i) => (i ? region.lineTo(p[0], p[1]) : region.moveTo(p[0], p[1]))); for (let i = R.length - 1; i >= 0; i--) region.lineTo(R[i][0], R[i][1]); region.closePath();
  }
  ctx.clip(region, 'evenodd');
  // the texture, tiled along the azimuth, its underside on the base line; it drifts slowly
  const sx = ((-(C.yaw + drift) * ppr) % TW + TW) % TW, h = TH * (ppr / 1400);
  for (let x = -sx - TW; x < 1920; x += TW) { ctx.drawImage(tex, x, yB - h, TW, h); ctx.drawImage(tex, 0, 0, TW, 2, x, -4000, TW, yB - h + 4000); }
  // the underside rim (lit from below by the sea's light) and an optional warm glow
  const ug = ctx.createLinearGradient(0, yB - 120, 0, yB); ug.addColorStop(0, 'rgba(0,0,0,0)'); ug.addColorStop(1, rgba((TONE[kind] || TONE.overcast).lit, .35)); ctx.fillStyle = ug; ctx.fillRect(0, yB - 120, 1920, 121);
  if (o.lit) { const p = C.D(...skyDir(o.lit.az ?? C.yaw, base)); if (p) { ctx.globalCompositeOperation = 'lighter'; const r = 700, g = ctx.createRadialGradient(p[0], yB, 0, p[0], yB, r); g.addColorStop(0, rgba(o.lit.col || '#ffb35c', .35 * (o.lit.a ?? 1))); g.addColorStop(1, rgba(o.lit.col || '#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(p[0] - r, yB - r, 2 * r, r + 2); } }
  ctx.restore(); ctx.restore();
  return { edges: gapW > 0 ? [az - gapW, az + gapW] : null };
}

export function bank(ctx, t, C, o = {}) {
  const az = o.az ?? 0, w = o.w ?? .15, h = (o.h ?? .05) * clamp(o.a ?? 1), base = o.base ?? .004, seed = o.seed ?? 5, T = TONE[o.tone] || TONE.overcast, n = 40, top = [], bot = [];
  if (h <= 0) return;
  for (let i = 0; i <= n; i++) { const v = i / n, a = az - w + 2 * w * v, prof = Math.pow(Math.sin(Math.PI * v), .6) * (.75 + .25 * nz(v * 7 + t * .03, seed)) + .12 * nz(v * 19, seed + 1) * Math.sin(Math.PI * v); top.push(C.D(...skyDir(a, base + h * Math.max(0, prof)))); bot.push(C.D(...skyDir(a, base))); }
  if (top.some((p) => !p) || bot.some((p) => !p)) return;
  const P = [...top, ...bot.reverse()];
  ctx.save(); ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  const yb = bot[0][1], yt = Math.min(...top.map((p) => p[1])), g = ctx.createLinearGradient(0, yt, 0, yb); g.addColorStop(0, T.cloud[0]); g.addColorStop(.6, T.cloud[1]); g.addColorStop(1, T.cloud[2]);
  ctx.fillStyle = g; ctx.fill(); ctx.clip();
  ctx.strokeStyle = 'rgba(10,12,22,.25)'; ctx.lineWidth = 1; const r = prng(seed); for (let k = 0; k < 60; k++) { const x = top[0][0] + r() * (top[n][0] - top[0][0]), y = yt + r() * (yb - yt), L = 20 + r() * 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + L, y + 1); ctx.stroke(); }
  if (o.lit) { ctx.globalCompositeOperation = 'lighter'; const mid = (top[0][0] + top[n][0]) / 2, R = Math.abs(top[n][0] - top[0][0]) * .6, lg = ctx.createRadialGradient(mid, yb + 10, 0, mid, yb + 10, R); lg.addColorStop(0, rgba(o.litCol || '#ffb35c', .55 * o.lit)); lg.addColorStop(.5, rgba(o.litCol || '#ffb35c', .18 * o.lit)); lg.addColorStop(1, rgba(o.litCol || '#ffb35c', 0)); ctx.fillStyle = lg; ctx.fillRect(mid - R, yb - R, 2 * R, R + 12); }
  ctx.restore();
}

const DROPS = (() => { const r = prng(91), d = []; for (let i = 0; i < 600; i++) d.push([r(), r(), .5 + r() * .5, r()]); return d; })();
export function rain(ctx, t, o = {}) {
  const a = o.a ?? .5, ang = o.ang ?? .25, sp = (o.speed ?? 1) * 1400, x0 = o.x0 ?? 0, x1 = o.x1 ?? 1920, y0 = o.y0 ?? 0, y1 = o.y1 ?? 1080, n = Math.min(600, o.n ?? 220);
  if (a <= 0) return;
  ctx.save(); ctx.strokeStyle = rgba(o.col || '#b8c4dc', a); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const [u, v, s, k] = DROPS[i], L = 26 + 30 * s, H = y1 - y0 + L, y = y0 + ((v * H + t * sp * s) % H) - L, x = x0 + u * (x1 - x0) + (y - y0) * Math.tan(ang); ctx.globalAlpha = .4 + .6 * k; ctx.lineWidth = .8 + s * .7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + L * Math.sin(ang), y + L * Math.cos(ang)); ctx.stroke(); }
  ctx.restore();
}
const STREAKS = (() => { const r = prng(92), d = []; for (let i = 0; i < 80; i++) d.push([r(), r(), .4 + r() * .6, r() * 10]); return d; })();
export function wind(ctx, t, o = {}) {
  const a = o.a ?? .4, dir = o.dir ?? 1, sp = (o.speed ?? 1) * 1600, y0 = o.y0 ?? 0, y1 = o.y1 ?? 1080, n = Math.min(80, o.n ?? 26);
  if (a <= 0) return;
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const [u, v, s, ph] = STREAKS[i], L = 120 + 260 * s, span = 1920 + L * 2, x = ((u * span + t * sp * s) % span) - L, X = dir > 0 ? x : 1920 - x, y = y0 + v * (y1 - y0) + 6 * Math.sin(t * 2 + ph);
    const g = ctx.createLinearGradient(X, 0, X + dir * L, 0); g.addColorStop(0, rgba(o.col || '#c8d4f0', 0)); g.addColorStop(.7, rgba(o.col || '#c8d4f0', a * s)); g.addColorStop(1, rgba(o.col || '#c8d4f0', 0)); ctx.strokeStyle = g; ctx.lineWidth = 1 + s;
    ctx.beginPath(); ctx.moveTo(X, y); ctx.quadraticCurveTo(X + dir * L * .5, y - 4 * Math.sin(ph), X + dir * L, y + 2); ctx.stroke(); }
  ctx.restore();
}
