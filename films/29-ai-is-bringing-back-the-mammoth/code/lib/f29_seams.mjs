// Film 29 · THE FENCE (the one world of the film) + the lab behind the hut window + the seam plates between the builder groups
// (owned by the lead; builders import, never edit — wishes go in the report).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it. Both
// call it with the same (t, T): the seam is invisible by construction. Plates creep (CREEP 3 %/s push, TRUCK 24 px/s); the receiving side
// continues both. Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet29.mjs <dir>
//
//   Lead → B1 at T.G('The mice belong') (c01 → c02): plateFence   THE FENCE, WIDE. You and the child from behind at the fence (left of
//            centre), the tundra beyond, today's animals lit softly gold (the wolf right, the ferret in the snow, the bird on a post), the
//            field station far left with its amber window. Camera FENCE_CAM. B1 glides left over the snow to the hut: the company.
//   B1 → B2  at T.G('Then it turned to the dodo') (c06 → c07): plateDodo   THE ONE DODO. The dodo drawn in gold rungs, centred on the
//            night stage, its single strand under it (unlit), the tally top left at 70+ LIVING SPECIES. Screen space (no world camera).
//   B2 → B3  at T.G('Now take an American animal') (c11 → c12): plateIce   THE ICE. A block of old ice in the snow, centred, with broken
//            strand shards frozen inside (gold, dim), the tundra's horizon behind. B3 turns the block into the freezer's frost door.
//
// THE FENCE (thumbnail; a real pinhole world, see below): a snowy night tundra under stars. A wooden fence runs across the snow (posts,
// two rails, snow caps). You (yellow coat, hood up) and a small child (indigo, no yellow) stand at it hand in hand, seen from behind.
// Beyond: the tundra rolls to a low ridge on the horizon; far left the FIELD STATION (a hut, one amber window, a mast with a tiny cyan light:
// the company and its machine). Frame 0: THE POSTER MAMMOTH, a giant mammoth in gold rungs of light standing on the horizon (the dream,
// the hero light). Behind the fence, at the anchors, THE ANIMAL (F.beast). Every glint in the snow is one difference in the DNA (GLINTS).
import { createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f29_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, halo, lin, rad, prng } = E;
const { GOLD, MACH, LAMP, INK, SNOW, FROST, FUR, F0 } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
export const CREEP = .03;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 24;
const tr = (k) => TRUCK * (k - 1) / CREEP;

// ================================================================================================================= THE WORLD
// camera { x, y, z, f, hz } (E.cam3), world X right, Y UP from the snow, Z away. A world point projects to
//   sx = W/2 + (X − c.x)·s,  sy = hz + (EYE − Y − c.y)·s,  s = c.f / (Z − c.z).
// The home horizon sits at HZ 780 (a lens shift: the sky gets the upper 70 %), the home eye is EYE 150 above the snow.
export const HZ = 780, EYE = 150, Z_REF = 40000;
export const WORLD = {
  fence: { x0: -7000, x1: 7000, z0: 3220, slope: -.08, step: 300, h: 150 },   // the fence line z = z0 + slope·x (nearer to the right)
  you: { x: -250, z: 2960, h: 172 },                                           // you (thumbnail: left of centre, from behind)
  child: { x: -168, z: 2968, h: 108 },                                         // the child at your right hand
  hut: { x: -5200, z: 11500, w: 980, h: 470, roof: 280, win: { x: 170, y: 250, w: 180, h: 130 }, mast: { x: -330, h: 900 } },
  mammoth: { x: 520, z: 4600, h: 330 },                                        // the animal behind the fence (facing left, toward you)
  poster: { x: 8600, z: 26000, h: 6800 },                                      // the poster mammoth on the horizon (frame 0)
  elephant: { x: -4300, z: 10600, h: 300 },                                    // the elephant at the field station
  wolf: { x: 1000, z: 4000, h: 88 }, ferret: { x: 300, z: 3500, s: 74 }, bird: { post: 25 },   // today's animals (the bird sits on POSTS[25])
};
export const fenceZ = (x) => WORLD.fence.z0 + WORLD.fence.slope * x;
export const POSTS = (() => { const f = WORLD.fence, r = prng(2911), out = []; for (let x = f.x0; x <= f.x1; x += f.step) { const xx = x + (r() - .5) * 40; out.push({ x: xx, z: fenceZ(xx), h: f.h * (.92 + r() * .14), tilt: (r() - .5) * .07, w: 20 + r() * 6, cap: .6 + r() * .5, cut: (r() - .5) * 8 }); } return out; })();
// THE SNOW OF DIFFERENCES: 2,600 glints on the snow beyond the fence (more of them near the horizon, evenly dense on screen).
// keep = one of the few the machine keeps (gold after the comb).
export const GLINTS = (() => { const r = prng(2929), out = []; for (let k = 0; k < 2600; k++) { const u = r(), z = 3500 * Math.pow(26000 / 3500, u), x = (r() - .5) * z * 1.7 + 400; out.push({ x, z, ph: r() * TAU, f: .25 + r() * .8, keep: r() < .022, sz: r() }); } return out; })();
const STARS = (() => { const r = prng(2905), out = []; for (let k = 0; k < 260; k++) out.push([r(), r(), r(), r() * TAU, .4 + r()]); return out; })();
const RIDGE = (() => { const r = prng(2944), out = []; let h = 14; for (let k = 0; k <= 64; k++) { h = clamp(h + (r() - .5) * 9, 4, 34); out.push(h); } return out; })();
const FLAKES = (() => { const r = prng(2977), out = []; for (let k = 0; k < 90; k++) out.push([r(), r(), r(), r() * TAU]); return out; })();
const DRIFTS = [4300, 5600, 7400, 9800, 13500, 19000];

// projection helpers: proj(c, X, Y, Z) → [sx, sy, s] (s = px per world unit) or null (behind the camera)
export function proj(c, X, Y, Z) { const dz = Z - c.z; if (dz < 20) return null; const s = c.f / dz; return [W / 2 + (X - c.x) * s, (c.hz ?? HZ) + (EYE - Y - c.y) * s, s]; }
// the camera that shows world point (X, Y, Z) at screen (sx, sy) with mag = scale relative to the home view of that depth (1 = home).
// hz = this camera's horizon on screen (lens shift). The camera stays above the snow: look() raises the horizon when needed.
export function look(X, Y, Z, mag = 1, sx = W / 2, sy = H / 2, hz = HZ) {
  const s = mag * F0 / Z, dz = F0 / s; let y = EYE - Y - (sy - hz) / s;
  if (y > EYE - 40) { hz = sy + (Y - 40) * s; y = EYE - 40; }
  return E.cam3({ x: X - (sx - W / 2) / s, y, z: Z - dz, f: F0, hz });
}
// draw fn in world units at snow point (X, Z) (local y up is negative): returns false when behind the camera
export function at(ctx, c, X, Z, fn, Y = 0) { const p = proj(c, X, Y, Z); if (!p) return false; ctx.save(); ctx.setTransform(p[2], 0, 0, p[2], p[0], p[1]); fn(p[2]); ctx.restore(); return true; }
// camera path through keys [[t, cam]…] (monotone cubic in x, y, log(Z_REF − z) and hz): C1-smooth, no overshoot, safe for deep flights
export function camPath(t, K) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(Z_REF - c.z), c.hz ?? HZ]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 4; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: Z_REF - Math.exp(out[2]), hz: out[3] });
}
// "nothing ever stands still": drift scaled to the distance of what the camera looks at (dist in world units)
export const drift = (c, t, dist = 3000, amt = 1, seed = 0) => { const k = dist / F0 * amt; return { ...c, x: c.x + E.drift(t, 5 * k, seed), y: c.y + E.drift(t, 3 * k, seed + 2), z: c.z + E.drift(t, 12 * k, seed + 4) }; };
// screen rect of the hut's amber window (for the portal into the lab) and the animal's screen frame
export function winRect(c) { const hu = WORLD.hut, w = hu.win, a = proj(c, hu.x + w.x - w.w / 2, w.y + w.h / 2, hu.z), b = proj(c, hu.x + w.x + w.w / 2, w.y - w.h / 2, hu.z); return a && b ? { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] } : null; }
export function beastAt(c, o = {}) { const m = WORLD.mammoth, p = proj(c, o.x ?? m.x, 0, o.z ?? m.z); return p ? { x: p[0], y: p[1], s: p[2], h: (o.h ?? m.h) * p[2] } : null; }
const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };

// fenceWorld(ctx, c, t, st) → { you: hands, child: hands, win: rect, beast: {head, trunk, box} | null }   st (all optional):
//   sky 0..1 (stars) · poster { a, lift, glow } | 0 (the poster mammoth on the horizon) · glow 0..1 (warm horizon light under the poster)
//   glint { a (base sparkle, default .45), lit 0..1 (every glint gold: the 1.4 million), kept 0..1 (the comb's picks glow gold),
//           comb (world x of the comb; glints left of it are combed: dim and their gold dropped (drop 0..1, default 1), or gold if kept),
//           keepNear (draw the kept glints in front of the hut: they fly into its window), pos(k, g, sx, sy, s) → [sx, sy, a, gold] | null }
//   comb { x, a } (the machine's comb: a cyan line on the snow running from near to the horizon, a low curtain of light above it)
//   hut { a, win 0..1 (the window's light), mast 0..1 } · elephant { a, x, z, walk, ...beast o } | false
//   beast { a, x, z, h, dir, ...beast o (MAMMOTH by default) } | false (the animal behind the fence)
//   wolf / ferret / bird { a, lit 0..1 (a soft gold light: an animal still here), walk, ... } | false · fence 0..1
//   you { a, look, hold 0..1, o } | false · child { a, look, o } | false · snow 0..1 (falling flakes) · rim (rim colour of fence and people)
//   back(ctx) (screen space, after the snow and glints, before the animals) · extra(ctx) (screen space, last)
export function fenceWorld(ctx, c, t, st = {}) {
  const hz = c.hz ?? HZ, out = {};
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the sky: night indigo down to a pale cold band at the horizon; stars drift with the pan
  ctx.fillStyle = lin(ctx, 0, Math.min(0, hz - 900), 0, hz, [[0, P.night0], [.55, mixHex(P.night1, P.ind1, .55)], [1, mixHex(P.ind1, P.blue0, .5)]]); ctx.fillRect(0, 0, W, Math.max(0, hz + 2));
  const sa = .6 * (st.sky ?? 1);
  if (sa > 0 && hz > 0) for (const [u, v, s2, ph, f] of STARS) { const x = ((u * 2600 - c.x * .02) % 2600 + 2600) % 2600 - 340, y = v * (Math.max(hz, 400) - 110) - c.y * .02 - Math.max(0, 400 - hz); if (y > hz - 30) continue; ctx.globalAlpha = sa * (.55 + .45 * Math.sin(t * f + ph)) * (1 - v * .6); ctx.fillStyle = P.cream; ctx.fillRect(x, y, s2 > .93 ? 2.6 : 1.5, s2 > .93 ? 2.6 : 1.5); }
  ctx.globalAlpha = 1;
  ctx.restore();
  // THE POSTER MAMMOTH (behind the ridge: its feet stand in the horizon's haze)
  const po = st.poster || 0, pa = po ? (po.a ?? 1) : 0, pw = WORLD.poster, pp = proj(c, pw.x, 0, pw.z);
  const glow = clamp(st.glow ?? pa);
  if (glow > 0 && pp) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, hz - 260, 0, hz + 40, [[0, rgba(GOLD.halo, 0)], [.8, rgba(GOLD.halo, .12 * glow)], [1, rgba(GOLD.halo, .04 * glow)]]); ctx.fillRect(0, hz - 260, W, 300); ctx.restore(); }
  if (pa > 0 && pp) {
    const ph = pw.h * pp[2];
    halo(ctx, pp[0], pp[1] - ph * .62, ph * 1.6, .16 * pa * (po.glow ?? 1), GOLD.halo, GOLD.body);
    F.beast(ctx, t, pp[0], pp[1], ph, { ...F.MAMMOTH, dir: -1, light: 1, a: pa, lift: po.lift ?? .1, trunk: .02 * Math.sin(t * .4), pitch: .024 });
  }
  // the ridge on the horizon (screen space, parallax with the pan), the snow plain, drifts
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (hz < H + 40) {
    const off = -c.x * .012, step = W * 1.3 / 64;
    ctx.fillStyle = mixHex(INK.far, P.blue0, .25); ctx.beginPath(); ctx.moveTo(-200, hz + 4);
    RIDGE.forEach((h2, k) => ctx.lineTo(-200 + k * step + off, hz - h2 * .9));
    ctx.lineTo(W + 200, hz + 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, hz, 0, Math.max(H, hz + 300), [[0, mixHex(SNOW.body, P.blue0, .55)], [.14, mixHex(SNOW.shade, SNOW.body, .2)], [.6, mixHex(SNOW.shade, SNOW.deep, .7)], [1, mixHex(SNOW.deep, P.night0, .55)]]); ctx.fillRect(0, hz, W, H - hz + 2);
    if (pa > 0 && pp) {   // the poster's gold light lies on the snow below it (a long flat pool toward you)
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(pp[0], hz + 6); ctx.scale(1, .16);
      ctx.fillStyle = rad(ctx, 0, 0, W * .55, [[0, rgba(GOLD.halo, .2 * pa)], [.5, rgba(GOLD.halo, .07 * pa)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(-W * .6, -W * .6, W * 1.2, W * 1.2); ctx.restore();
    }
    // drifts: long low snow waves across the plain (lit crest, shadow behind)
    for (const zd of DRIFTS) {
      if (zd < c.z + 200) continue;
      const pts = []; for (let x = -16000; x <= 16000; x += 800) { const p = proj(c, x + c.x, 18 + 14 * Math.sin(x * .0007 + zd), zd); if (p) pts.push(p); }
      if (pts.length < 2) continue; const s = pts[0][2], bh = 90 * s + 2;
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + bh); ctx.closePath();
      ctx.fillStyle = lin(ctx, 0, pts[0][1] - 2, 0, pts[0][1] + bh, [[0, rgba(SNOW.lit, 0)], [.2, rgba(SNOW.lit, .06)], [.5, rgba(SNOW.body, .03)], [1, rgba(SNOW.deep, 0)]]); ctx.fill();
    }
  }
  ctx.restore();
  glintPass(ctx, c, t, st, WORLD.hut.z, 1e9, pa);   // the far glints (behind the hut)
  // THE FIELD STATION (far left): the hut, its amber window, the mast with the machine's small cyan light, the window's light on the snow
  const hu = WORLD.hut, ho = st.hut || {}, ha = ho.a ?? 1, wl = clamp(ho.win ?? 1) * (1 + .04 * Math.sin(t * 1.3));
  if (ha > 0) {
    const g0 = proj(c, hu.x + hu.win.x, 0, hu.z - 700), g1 = proj(c, hu.x + hu.win.x + 1100, 0, hu.z - 700), g2 = proj(c, hu.x + hu.win.x, 0, hu.z - 10);
    if (g0 && g1 && g2) {   // the window's light on the snow: a soft flat pool in front of the hut
      const rx = Math.abs(g1[0] - g0[0]), ry = Math.max(4, Math.abs(g0[1] - g2[1]));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.translate(g0[0], g0[1]); ctx.scale(1, ry / rx);
      ctx.fillStyle = rad(ctx, 0, 0, rx, [[0, rgba(LAMP.halo, .16 * wl * ha)], [.5, rgba(LAMP.halo, .05 * wl * ha)], [1, rgba(LAMP.halo, 0)]]); ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
    }
    at(ctx, c, hu.x, hu.z, () => {
      ctx.globalAlpha = ha;
      const w = hu.w, h = hu.h, rf = hu.roof, wn = hu.win, mx = hu.mast.x, mh = hu.mast.h;
      ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(mx - 6, -mh, 12, mh - h * .5);   // the mast (behind the roof)
      for (let y = -mh + 60; y < -h - rf * .5; y += 90) ctx.fillRect(mx - 26, y, 52, 5);
      ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, mixHex(P.night1, P.ind1, .5)], [1, mixHex(P.night1, P.ind2, .55)]]); ctx.fillRect(-w / 2, -h, w, h);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.beginPath(); ctx.moveTo(-w / 2 - 50, -h); ctx.lineTo(0, -h - rf); ctx.lineTo(w / 2 + 50, -h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = mixHex(SNOW.body, SNOW.lit, .4); ctx.beginPath(); ctx.moveTo(-w / 2 - 60, -h + 4); ctx.lineTo(0, -h - rf - 14); ctx.lineTo(w / 2 + 60, -h + 4); ctx.lineTo(w / 2 + 30, -h + 4); ctx.lineTo(0, -h - rf + 22); ctx.lineTo(-w / 2 - 30, -h + 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(SNOW.lit, .7); ctx.fillRect(-w / 2 - 20, -26, w + 40, 26);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .25); ctx.fillRect(-w * .36, -h * .62, w * .17, h * .62);   // the door
      const wx = wn.x - wn.w / 2, wy = -wn.y - wn.h / 2;
      ctx.fillStyle = mixHex(P.night0, mixHex(LAMP.body, LAMP.core, .3), .25 + .75 * wl); ctx.fillRect(wx, wy, wn.w, wn.h);
      ctx.fillStyle = rgba(LAMP.halo, .5 * wl); ctx.fillRect(wx, wy + wn.h * .62, wn.w, wn.h * .38);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(wx + wn.w / 2 - 5, wy, 10, wn.h); ctx.fillRect(wx, wy + wn.h * .45 - 4, wn.w, 8);
    });
    const pw2 = proj(c, hu.x + hu.win.x, hu.win.y, hu.z); if (pw2) halo(ctx, pw2[0], pw2[1], Math.max(30, 900 * pw2[2]), .5 * wl * ha, LAMP.halo, LAMP.core);
    const ma = clamp(ho.mast ?? 1), blink = .55 + .45 * Math.max(0, Math.sin(t * 2.1)), pm = proj(c, hu.x + hu.mast.x, hu.mast.h + 10, hu.z);
    if (pm && ma > 0) { halo(ctx, pm[0], pm[1], Math.max(10, 260 * pm[2]), .7 * ma * blink * ha, MACH.halo, MACH.core); ctx.fillStyle = rgba(MACH.core, ma * ha); ctx.fillRect(pm[0] - 1.5, pm[1] - 1.5, 3, 3); }
  }
  out.win = winRect(c);
  // the paper grain lies on sky and snow (never over people or text)
  F.paper(ctx, t, { x: c.x * .03, y: c.y * .03 });
  glintPass(ctx, c, t, st, 0, WORLD.hut.z, pa);   // the near glints (in front of the hut)
  // THE COMB: the machine's cyan line across the snow (from near to the horizon) with a low curtain of light; it moves in x
  const cm = st.comb;
  if (cm && (cm.a ?? 1) > 0) {
    const p0 = proj(c, cm.x, 0, Math.max(c.z + 300, 3400)), p1 = proj(c, cm.x, 0, 30000), q0 = proj(c, cm.x, 320, Math.max(c.z + 300, 3400)), q1 = proj(c, cm.x, 320, 30000);
    if (p0 && p1 && q0 && q1) {
      const a = cm.a ?? 1;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, q0[1], 0, p0[1], [[0, rgba(MACH.halo, 0)], [.7, rgba(MACH.halo, .1 * a)], [1, rgba(MACH.halo, .3 * a)]]); poly(ctx, [q0, q1, p1, p0]); ctx.fill();
      ctx.restore();
      F.accentSpan(ctx, [[p0[0], p0[1]], [p1[0], p1[1]]], 0, 1, { w: 2.2, spark: false, col: MACH, a });
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(MACH.line, .5 * a);
      for (let z = 3600; z < 26000; z *= 1.18) { const p = proj(c, cm.x, 0, z), q = proj(c, cm.x + 60, 0, z); if (p && q) { const s = p[2]; ctx.fillRect(p[0] - 1, p[1] - 22 * s - 1, 2, 22 * s + 2); } }
      ctx.restore();
    }
  }
  if (st.back) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); st.back(ctx); ctx.restore(); }
  // the animals beyond the fence (far → near)
  const items = [];
  const el = st.elephant; if (el && (el.a ?? 1) > 0) items.push({ z: el.z ?? WORLD.elephant.z, draw: () => { const p = proj(c, el.x ?? WORLD.elephant.x, 0, el.z ?? WORLD.elephant.z); if (p) F.beast(ctx, t, p[0], p[1], (el.h ?? WORLD.elephant.h) * p[2], { ...F.ELEPHANT, dir: 1, rim: LAMP.halo, rimA: .8, rimDir: [.4, 1], ...el }); } });
  const bs = st.beast; if (bs && (bs.a ?? 1) > 0) items.push({ z: bs.z ?? WORLD.mammoth.z, draw: () => { const b = beastAt(c, bs); if (b) out.beast = F.beast(ctx, t, b.x, b.y, b.h, { ...F.MAMMOTH, dir: -1, shade: .35, rim: st.rim ?? mixHex(GOLD.halo, SNOW.lit, .35), rimA: .75, ...bs }); } });
  const today = (o, w, fn) => { if (!o || (o.a ?? 1) <= 0) return; items.push({ z: o.z ?? w.z, draw: () => { const p = proj(c, o.x ?? w.x, 0, o.z ?? w.z); if (!p) return; const li = clamp(o.lit ?? 0); if (li > 0) halo(ctx, p[0], p[1] - (w.h ?? w.s * .3) * p[2] * .6, Math.max(60, (w.h ?? w.s) * p[2] * 2.6), .5 * li * (o.a ?? 1), GOLD.halo, GOLD.body); fn(p, li); } }); };
  today(st.wolf, WORLD.wolf, (p, li) => F.wolf(ctx, t, p[0], p[1], WORLD.wolf.h * p[2], { dir: -1, rim: li > 0 ? mixHex(P.cream, GOLD.body, li) : P.cream, ...st.wolf }));
  today(st.ferret, WORLD.ferret, (p, li) => F.ferret(ctx, t, p[0], p[1], WORLD.ferret.s * p[2], { dir: 1, rim: li > 0 ? mixHex(LAMP.body, GOLD.core, li) : LAMP.body, ...st.ferret }));
  items.sort((p, q) => q.z - p.z);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); for (const it of items) it.draw(); ctx.restore();
  // THE FENCE: rails then posts, far → near; snow on every top edge; the rim on the side toward the light
  const fa = st.fence ?? 1;
  if (fa > 0) {
    const rim = st.rim ?? mixHex(SNOW.lit, GOLD.body, .4 * pa), wood = mixHex(P.night1, '#4a3530', .6), woodLit = mixHex(wood, mixHex(P.blue1, '#8a6a58', .4), .45);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = fa;
    const PP = POSTS.map((q) => ({ q, b: proj(c, q.x, 0, q.z), tp: proj(c, q.x + q.tilt * q.h, q.h, q.z) }));
    for (let i = PP.length - 1; i > 0; i--) {   // rails (right → left = near → far is fine: they never overlap each other)
      const A = PP[i - 1], B = PP[i]; if (!A.b || !B.b) continue;
      if (Math.max(A.b[0], B.b[0]) < -50 || Math.min(A.b[0], B.b[0]) > W + 50) continue;
      for (const [y0, th] of [[44, 17], [104, 17]]) {
        const a0 = proj(c, A.q.x, y0 + th, A.q.z - 8), a1 = proj(c, A.q.x, y0, A.q.z - 8), b0 = proj(c, B.q.x, y0 + th + 3 * Math.sin(i), B.q.z - 8), b1 = proj(c, B.q.x, y0 + 3 * Math.sin(i), B.q.z - 8);
        if (!a0 || !a1 || !b0 || !b1) continue;
        ctx.fillStyle = lin(ctx, 0, a0[1], 0, a1[1], [[0, woodLit], [1, wood]]); poly(ctx, [a0, b0, b1, a1]); ctx.fill();
        const sn = 5; const a2 = proj(c, A.q.x, y0 + th + sn, A.q.z - 8), b2 = proj(c, B.q.x, y0 + th + sn + 3 * Math.sin(i), B.q.z - 8);
        if (a2 && b2) { ctx.fillStyle = rgba(mixHex(SNOW.lit, P.cream, .3), .85); poly(ctx, [a2, b2, b0, a0]); ctx.fill(); }
      }
    }
    for (const { q, b, tp } of PP) {
      if (!b || !tp) continue; const s = b[2], w = q.w * s; if (b[0] < -w * 4 || b[0] > W + w * 4) continue;
      ctx.fillStyle = lin(ctx, b[0] - w / 2, 0, b[0] + w / 2, 0, [[0, wood], [.7, woodLit], [1, rim]]);
      poly(ctx, [[b[0] - w / 2, b[1]], [tp[0] - w * .47, tp[1] + q.cut * s], [tp[0] + w * .47, tp[1] - q.cut * s], [b[0] + w / 2, b[1]]]); ctx.fill();
      ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(b[0] - w / 2, tp[1], w * .22, b[1] - tp[1]);
      ctx.fillStyle = rgba(mixHex(SNOW.lit, P.cream, .35), .92); ctx.beginPath(); ctx.ellipse(tp[0], tp[1] - 2 * s * q.cap, w * .62, 5 * s * q.cap + .8, 0, Math.PI, TAU); ctx.fill();
      ctx.fillStyle = rgba(SNOW.lit, .45); ctx.beginPath(); ctx.ellipse(b[0], b[1], w * 1.3, 4 * s + .5, 0, 0, TAU); ctx.fill();
    }
    // the bird on its post
    const bo = st.bird, bp = POSTS[WORLD.bird.post];
    if (bo && (bo.a ?? 1) > 0 && bp) { const p = proj(c, bp.x + bp.tilt * bp.h, bp.h + 6, bp.z); if (p) { const li = clamp(bo.lit ?? 0); if (li > 0) halo(ctx, p[0], p[1] - 14 * p[2], Math.max(50, 160 * p[2]), .5 * li * (bo.a ?? 1), GOLD.halo, GOLD.body); F.bird(ctx, t, p[0], p[1], 34 * p[2], { dir: -1, ...bo }); } }
    ctx.restore();
  }
  // you and the child, from behind, hand in hand (the child's hand rises into yours with you.hold)
  const yo = st.you, co = st.child;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const Y = WORLD.you, C = WORLD.child, py = yo !== false ? proj(c, yo?.x ?? Y.x, 0, yo?.z ?? Y.z) : null, pc = co !== false ? proj(c, co?.x ?? C.x, 0, co?.z ?? C.z) : null;
  if (py && pc) {
    const hy = (yo?.h ?? Y.h) * py[2], hc = (co?.h ?? C.h) * pc[2], hold = clamp(yo?.hold ?? 1);
    const shY = [py[0] + .098 * hy, py[1] - .74 * hy], shC = [pc[0] - .098 * hc, pc[1] - .74 * hc];
    const M = [lerp(shY[0], shC[0], .52), py[1] - .44 * hy];
    const ikY = F.reachArm([.098, -.74], [(M[0] - py[0]) / hy, (M[1] - py[1]) / hy], .17, .155, -1);
    const ikC = F.reachArm([-.098, -.74], [(M[0] - pc[0]) / hc, (M[1] - pc[1]) / hc], .17, .155, 1);
    const mixA = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
    const rim = st.rim ?? mixHex(P.coat, P.core1, .75);
    // the child first (it stands a hair further away), then you
    if ((co?.a ?? 1) > 0) out.child = F.child(ctx, pc[0], pc[1], hc, { view: 'back', back: .5, look: co?.look ?? .4, armL: mixA([-.15, -.08], ikC, E.sineIO(hold)), armR: [-.12, -.05], a: co?.a ?? 1, rim: mixHex(P.blue0, rim, .5), ...(co?.o || {}) });
    if ((yo?.a ?? 1) > 0) out.you = E.du(ctx, py[0], py[1], hy, { view: 'back', back: .55, look: yo?.look ?? .35, armR: mixA([.22, .14], ikY, E.sineIO(Math.min(1, hold * 1.6))), armL: [-.16, -.08], a: yo?.a ?? 1, ...(yo?.o || {}) });
  } else if (py && (yo?.a ?? 1) > 0) out.you = E.du(ctx, py[0], py[1], (yo?.h ?? Y.h) * py[2], { view: 'back', back: .55, look: yo?.look ?? .35, ...(yo?.o || {}) });
  ctx.restore();
  // falling snow (screen space, three depths, parallax with the camera)
  const sn = st.snow ?? 1;
  if (sn > 0) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = SNOW.lit;
    for (const [u, v, d, ph] of FLAKES) {
      const k = .25 + d, x = ((u * W * 1.2 + t * (4 + 9 * d) + 16 * Math.sin(t * .3 + ph) - c.x * .04 * k) % (W * 1.2) + W * 1.2) % (W * 1.2) - W * .1;
      const y = ((v * H * 1.1 + t * (8 + 20 * d) - c.y * .04 * k) % (H * 1.1) + H * 1.1) % (H * 1.1) - H * .05, r = .8 + 1.8 * d * d;
      ctx.globalAlpha = sn * (.14 + .3 * d); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  if (st.extra) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); st.extra(ctx, out); ctx.restore(); }
  return out;
}

// THE SNOW OF DIFFERENCES: glints (additive) with z in [z0, z1). base sparkle, all-gold (lit), combed (dim or kept gold), or moved (pos)
const GLOW = (() => { const n = 48, cv = createCanvas(n, n), g = cv.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); gr.addColorStop(0, 'rgba(255,214,140,1)'); gr.addColorStop(.35, 'rgba(243,169,60,.45)'); gr.addColorStop(1, 'rgba(243,169,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, n, n); return cv; })();
function glintPass(ctx, c, t, st, z0, z1) {
  const gl = st.glint || {}, ga = gl.a ?? .45, lit = clamp(gl.lit ?? 0), kept = clamp(gl.kept ?? 0), cx = gl.comb, gp = gl.pos;
  if (ga > 0 || lit > 0 || gp) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < GLINTS.length; k++) {
      const g = GLINTS[k], zz = gl.keepNear && g.keep ? 0 : g.z; if (zz < z0 || zz >= z1) continue; const p = proj(c, g.x, 0, g.z); if (!p && !gp) continue;
      let sx = p ? p[0] : -99, sy = p ? p[1] : -99, s = p ? p[2] : .1, a = 1, gold = lit;
      if (gp) { const q = gp(k, g, sx, sy, s); if (!q) continue; [sx, sy, a] = q; if (q[3] != null) gold = q[3]; }
      if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue;
      const tw = .72 + .28 * Math.max(0, Math.sin(t * g.f + g.ph)) ** 2;   // calm: a soft twinkle (was .55 + .45)
      let base = ga * tw, dim = 0;
      if (cx != null && g.x < cx) { if (g.keep) gold = Math.max(gold, kept); else { dim = 1; gold *= 1 - (gl.drop ?? 1); } }
      const al = a * (base * (1 - dim * .75) + gold * (.55 + .45 * tw));
      if (al <= .01) continue;
      const sz = clamp(1 + (1.4 + 2.2 * g.sz) * Math.sqrt(s), 1, 5.5) * (1 + .7 * gold);
      if (gold > .05) { ctx.globalAlpha = Math.min(1, al) * .55 * gold; const r = sz * 2.6; ctx.drawImage(GLOW, sx - r, sy - r, r * 2, r * 2); ctx.globalAlpha = 1; }   // a soft glow (one sprite, made once)
      ctx.fillStyle = rgba(mixHex(dim ? mixHex(SNOW.body, P.blue2, .5) : mixHex(SNOW.lit, P.cream, .5), GOLD.core, gold), Math.min(1, al));
      ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
      if (gold > .5 && g.keep && cx != null) halo(ctx, sx, sy, Math.max(14, sz * 6), .45 * gold * a, GOLD.halo, GOLD.core);   // the comb's picks shine
    }
    ctx.restore();
  }
}

// ================================================================================================================= THE LAB (behind the hut window)
// Local px (w × h, e.g. 1920 × 1080) for a portal from the window: a warm small lab at night. A lamp over the bench, a glass box with
// straw-coloured bedding where the WOOLLY MOUSE walks, a wall screen with two strands and the cyan comb (the machine: it reads, it marks).
// o { lamp 0..1, mouse { x 0..1 (along the box), walk (phase), fur, dir, a } | false, screen { a, comb 0..1, diff(k) } | false, extra(ctx, w, h) }
export function lab(ctx, t, w, h, o = {}) {
  const lamp = clamp(o.lamp ?? 1);
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.night0, LAMP.deep, .3)], [.6, mixHex(P.night1, LAMP.deep, .55 * lamp)], [1, P.night0]]); ctx.fillRect(0, 0, w, h);
  { const m = ctx.getTransform(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.paper(ctx, t, { x: -m.e, y: -m.f }); ctx.restore(); }
  // the wall screen (the machine at work): two strands, the comb runs over them, differences light gold
  const sc = o.screen === false ? null : (o.screen || {});
  if (sc && (sc.a ?? 1) > 0) {
    const sx = w * .56, sy = h * .1, sw = w * .36, sh = h * .3, a = sc.a ?? 1;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = mixHex(P.night0, MACH.deep, .25); ctx.fillRect(sx - 10, sy - 10, sw + 20, sh + 20);
    ctx.fillStyle = mixHex(P.night0, MACH.deep, .45); ctx.fillRect(sx, sy, sw, sh);
    const cu = clamp(sc.comb ?? (t * .23) % 1), dif = sc.diff ?? ((k) => (k % 11 === 3 || k % 17 === 5 ? 1 : 0));
    F.strand(ctx, t, sx + 30, sy + sh * .34, sw - 60, { n: 46, h: 30, col: mixHex(P.blue1, P.cream, .3), diff: (k) => (k / 46 < cu ? dif(k) : 0), seed: 5 });
    F.strand(ctx, t, sx + 30, sy + sh * .7, sw - 60, { n: 46, h: 30, col: mixHex(FUR.tip, P.cream, .3), diff: (k) => (k / 46 < cu ? dif(k) : 0), seed: 6 });
    const bx = sx + 30 + (sw - 60) * cu; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, bx - 40, 0, bx, 0, [[0, rgba(MACH.halo, 0)], [1, rgba(MACH.halo, .35)]]); ctx.fillRect(bx - 40, sy + 8, 40, sh - 16); ctx.restore();
    ctx.fillStyle = MACH.core; ctx.fillRect(bx - 1.5, sy + 8, 3, sh - 16);
    ctx.restore();
    halo(ctx, sx + sw / 2, sy + sh / 2, sw * .7, .1 * a, MACH.halo, MACH.body);
  }
  // the lamp and its pool
  const lx = w * .3, ly = h * .16;
  ctx.strokeStyle = mixHex(P.night0, P.ind2, .4); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx, -h); ctx.lineTo(lx, ly - 24); ctx.stroke();
  ctx.fillStyle = mixHex(P.night0, P.ind2, .55); ctx.beginPath(); ctx.moveTo(lx - 26, ly - 24); ctx.lineTo(lx + 26, ly - 24); ctx.lineTo(lx + 70, ly + 26); ctx.lineTo(lx - 70, ly + 26); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(LAMP.core, .9 * lamp); ctx.beginPath(); ctx.ellipse(lx, ly + 26, 68, 8, 0, 0, TAU); ctx.fill();
  halo(ctx, lx, ly + 260, w * .4, .3 * lamp, LAMP.body, LAMP.core);
  // the bench
  const by = h * .7;
  ctx.fillStyle = lin(ctx, 0, by, 0, by + 20, [[0, mixHex(P.ind2, LAMP.deep, .5 * lamp)], [1, mixHex(P.night1, P.ind2, .5)]]); ctx.fillRect(w * .04, by, w * .92, 20);
  ctx.fillStyle = lin(ctx, 0, by + 20, 0, h, [[0, mixHex(P.night1, P.ind1, .35)], [1, P.night0]]); ctx.fillRect(w * .06, by + 20, w * .88, h - by);
  // the glass box with bedding; the mouse inside
  const gx = w * .1, gw = w * .42, gh = h * .3, gy = by - gh;
  ctx.fillStyle = rgba(mixHex(P.ind2, LAMP.body, .2), .25); ctx.fillRect(gx, gy, gw, gh);
  ctx.fillStyle = lin(ctx, 0, by - gh * .2, 0, by, [[0, mixHex('#b89a6a', LAMP.deep, .3)], [1, mixHex('#6e5634', P.night1, .3)]]); ctx.fillRect(gx + 4, by - gh * .18, gw - 8, gh * .18);
  const mo = o.mouse === false ? null : (o.mouse || {});
  if (mo && (mo.a ?? 1) > 0) F.mouse(ctx, t, gx + gw * (mo.x ?? .45), by - gh * .12, gh * .62, { fur: mo.fur ?? 1, walk: mo.walk, dir: mo.dir ?? 1, a: mo.a ?? 1, rim: LAMP.core });
  ctx.strokeStyle = rgba(P.cream, .35); ctx.lineWidth = 3; ctx.strokeRect(gx, gy, gw, gh);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, gx, gy, gx + gw * .5, gy + gh, [[0, rgba(P.cream, .12)], [.4, rgba(P.cream, 0)]]); ctx.fillRect(gx, gy, gw, gh); ctx.restore();
  if (o.extra) o.extra(ctx, w, h);
}

// ================================================================================================================= THE ICE BLOCK (c11 → c12)
// (x, y) = bottom centre, s = width px. A block of old ice, frost-cream facets, with broken strand shards frozen inside (gold, dim).
// o { a, shards 0..1 (how visible the broken DNA is), frost 0..1 (the face frosts over: the freezer door, B3), crack 0..1 }
const SHARDS = (() => { const r = prng(2961), out = []; for (let k = 0; k < 9; k++) out.push({ x: (r() - .5) * .7, y: -.2 - r() * .55, w: .12 + r() * .2, rot: (r() - .5) * 1.4, n: 4 + Math.floor(r() * 6), seed: 300 + k }); return out; })();
export function iceBlock(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const h = s * .82, fr = clamp(o.frost ?? 0), sh = clamp(o.shards ?? 1);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(0, 4, s * .62, s * .05, 0, 0, TAU); ctx.fill();
  const body = [[-s * .5, 0], [-s * .53, -h * .7], [-s * .42, -h], [s * .38, -h * .97], [s * .52, -h * .78], [s * .5, 0]];
  ctx.fillStyle = lin(ctx, -s * .5, -h, s * .5, 0, [[0, mixHex(FROST.body, P.blue1, .35)], [.5, mixHex(FROST.shade, P.ind1, .45)], [1, mixHex(FROST.deep, P.night1, .4)]]);
  poly(ctx, body); ctx.fill();
  ctx.save(); poly(ctx, body); ctx.clip();
  // facets
  ctx.fillStyle = rgba(FROST.core, .14); poly(ctx, [[-s * .42, -h], [s * .38, -h * .97], [s * .1, -h * .78], [-s * .3, -h * .82]]); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .16); poly(ctx, [[s * .1, -h * .78], [s * .52, -h * .78], [s * .5, 0], [s * .05, 0]]); ctx.fill();
  // the shards: short broken pieces of a ladder, gold but dim, slowly drifting in the ice
  if (sh > 0) for (const q of SHARDS) {
    ctx.save(); ctx.translate(q.x * s + E.drift(t, 2, q.seed), q.y * h); ctx.rotate(q.rot + .02 * Math.sin(t * .3 + q.seed)); ctx.globalAlpha *= sh * .85;
    const L = q.w * s, rr = prng(q.seed), hh = s * .045;
    ctx.fillStyle = rgba(GOLD.line, .55); ctx.fillRect(-L / 2, -hh / 2 - 1, L * (.7 + .3 * rr()), 2); ctx.fillRect(-L / 2 + L * .15 * rr(), hh / 2 - 1, L * (.6 + .3 * rr()), 2);
    for (let k = 0; k < q.n; k++) { const px = -L / 2 + (k + .5) * L / q.n, len = hh * (.4 + .6 * rr()); ctx.fillStyle = rgba(mixHex(GOLD.body, P.cream, .3), .45 + .35 * Math.sin(t * .8 + k + q.seed)); ctx.fillRect(px - 1.5, -len / 2, 3, len); }
    ctx.restore();
  }
  if (fr > 0) { ctx.fillStyle = rgba(FROST.body, .75 * fr); ctx.fillRect(-s, -h * 1.1, s * 2, h * 1.2); }
  ctx.restore();
  ctx.strokeStyle = rgba(FROST.core, .5); ctx.lineWidth = Math.max(1.5, s * .006); poly(ctx, body); ctx.stroke();
  ctx.fillStyle = rgba(SNOW.lit, .9); ctx.beginPath(); ctx.moveTo(-s * .44, -h + 2); ctx.quadraticCurveTo(-s * .05, -h - s * .05, s * .38, -h * .97 + 2); ctx.lineTo(s * .3, -h * .95); ctx.quadraticCurveTo(-s * .05, -h - s * .01, -s * .4, -h + 8); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ================================================================================================================= THE PLATES
// A plate camera = look(X, Y, Z, mag, sx, sy, hz); while it creeps, mag × k and X + TRUCK·(k − 1)/CREEP (world units at that depth).
const plateCam = (P0, k) => look(P0[0] + tr(k) * P0[2] / F0, P0[1], P0[2], P0[3] * k, P0[4], P0[5], P0[6] ?? HZ);   // P0 = [X, Y, Z, mag, sx, sy, hz]
// 1 · Lead → B1: THE FENCE, WIDE. You and the child at the fence (left of centre, from behind), today's animals lit soft gold, the hut far left
// a world camera that creeps: × k at the focus depth Zf (push), trucking TRUCK px/s to the right
export const creepCam = (c0, k, Zf) => { const s = k * c0.f / (Zf - c0.z); return E.cam3({ ...c0, z: Zf - c0.f / s, x: c0.x + tr(k) / s }); };
export const FENCE_C0 = E.cam3({ x: 120, y: -40, z: 1900, f: F0, hz: 545 }), FENCE_ZF = 3000;
export const FENCE_CAM = FENCE_C0;
export const FENCE_ST = { wolf: { lit: 1, look: .3 }, ferret: { lit: 1 }, bird: { lit: 1 }, you: { hold: 1, look: .25 }, child: { look: .45 }, beast: false, glint: { a: .45 },
  elephant: { x: -4450, dir: -1, walk: -4450 * .012 } };   // the elephant stands in the hut's light (where c01 left it)
export function plateFence(ctx, t, T) { return fenceWorld(ctx, creepCam(FENCE_C0, creep(t, T, 'The mice belong'), FENCE_ZF), t, FENCE_ST); }
// 2 · B1 → B2: THE ONE DODO (screen space): the dodo in gold rungs, centred, its single strand under it (unlit), tally 70+ top left
export const DODO_PLATE = { x: 960, y: 640, s: 400, strand: { x: 560, y: 740, w: 800 } };
export function stage(ctx, t, o = {}) {   // the night stage for screen-space explainers: indigo, a low horizon haze, paper grain, stars
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, mixHex(P.night1, P.ind1, .5)], [1, mixHex(P.night1, SNOW.deep, .5)]]); ctx.fillRect(0, 0, W, H);
  E.stars(ctx, 2907, 70, t, [0, 0, W, H * .55], .35 * (o.stars ?? 1));
  ctx.restore();
  F.paper(ctx, t, { x: (o.px ?? 0), y: 0 });
}
export function plateDodo(ctx, t, T) {
  const k = creep(t, T, 'Then it turned to the dodo'), d = DODO_PLATE;
  stage(ctx, t, { px: tr(k) * .1 });
  ctx.save(); ctx.translate(d.x, d.y); ctx.scale(k, k); ctx.translate(-d.x - tr(k) * .05, -d.y);
  F.dodo(ctx, t, d.x, d.y, d.s, { light: 1, dir: -1 });
  F.strand(ctx, t, d.strand.x, d.strand.y, d.strand.w, { n: 70, h: 40, seed: 29 });
  ctx.restore();
  F.tally(ctx, t, { v: 70, plus: '+', label: 'LIVING BIRD SPECIES' });
}
// 3 · B2 → B3: THE ICE. The block centred in the snow, broken shards inside, the horizon behind (camera ICE_CAM on the fence world)
export const ICE = { x: 300, z: 4300, s: 520 };
export const ICE_P = [ICE.x, 220, ICE.z, 1.15, 960, 700, 520];
export const ICE_CAM = plateCam(ICE_P, 1);
export const ICE_ST = { you: false, child: false, beast: false, wolf: false, ferret: false, bird: false, fence: 0, glint: { a: .3 } };
export function plateIce(ctx, t, T) {
  const c = plateCam(ICE_P, creep(t, T, 'Now take an American animal'));
  return fenceWorld(ctx, c, t, { ...ICE_ST, back: (cx) => at(cx, c, ICE.x, ICE.z, () => iceBlock(cx, t, 0, 0, ICE.s, { shards: 1 })) });
}

// THE THUMBNAIL CAMERA (frame 0 of the film; c16 returns to it): behind you and the child, the poster mammoth on the horizon right of centre
export const THUMB_CAM = E.cam3({ x: -60, y: 10, z: 2050, f: F0, hz: 640 });

// ================================================================================================================= THE END SCREEN (last 15 s)
// The fence centred and calm, you and the child at it from behind, between the two free areas for the YouTube tiles (sky left and right);
// the poster mammoth NOT there (the dream is gone: the animals that are still here are lit). Nothing moves but drift, breath, snow, stars.
// No text, no QR.
export const END_P = [WORLD.you.x + 40, 120, WORLD.you.z, .9, 960, 800, 700];
export const END_CAM = plateCam(END_P, 1);
export const END_TILES = { left: { x: 100, y: 130, w: 720, h: 405 }, right: { x: 1100, y: 130, w: 720, h: 405 }, subscribe: { x: 960, y: 640, r: 90 } };
