// c17 · the one sky over the whole chunk (ancient fire → dolly through time → you on the hill → the open sky = the deep sky plate).
//
// Sky coordinates Q = screen coordinates of the FINAL view (the deep sky plate of c17>c18, lib/handoff4.mjs skyPlate). The camera sees
// the sky through   S = POLE + R(φ)·(Q − POLE) + (pan, −dl)     (R(φ) turns clockwise on screen for φ > 0)
//   pan  horizontal look (px), dl the tilt (px, + looks down: the horizon is at screen y = HZ − dl), φ the star wheel (rad, → 0 at the end).
// At pan = dl = φ = 0 the sky IS the plate: the same gradient, the same faint band (prng 55) and the same 520 stars (prng 4242,
// drifting 2.2/.6 px/s, wrapping) — the stars are the plate's own, tiled with its period (W × H), so they exist everywhere the camera looks.
// The Milky Way (cached layer) and its dense stars live only at sky Y > 1095: below the final frame (Y > 1080), so the end view contains
// nothing but the plate; while φ is large it is high in the sky, and as the sky wheels back to φ = 0 it sets along the horizon.
//   drawSky(ctx, t, cam)          cam: { pan, dl, phi, omega (dφ/dt, for the trails), tau (trail exposure, s), mw (1) }
//   skyToScreen(cam, X, Y) / screenToSky(cam, x, y)
//   starsOnScreen(t, cam, box)   the plate's stars (tiled) on screen now: [{x, y, s, tw}] (targets for lines that unwind into the stars)
//   HZ (horizon at sky Y), POLE, DEEP (gradient)
import { W, H, rgba, clamp, prng } from '../engine.mjs';
import { vnoise, fbm, stipple, layer } from './art.mjs';
import { toImg, best } from './v2_c17_kit.mjs';

const TAU = Math.PI * 2;
export const HZ = 1300;
export const POLE = [1500, 640];
export const DEEP = ['#04050f', '#0a0d26', '#141436'];
const HORIZON = '#1f1c47';

// ---------------------------------------------------------------- the plate's own data (verbatim copies from lib/handoff4.mjs)
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
const BAND = (() => { const r = prng(55), b = []; for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); b.push([x, y, `rgba(216,230,255,${a})`]); } return b; })();

// ---------------------------------------------------------------- mapping
export function skyM(cam) {
  const c = Math.cos(cam.phi || 0), s = Math.sin(cam.phi || 0), [px, py] = POLE;
  return [c, s, -s, c, px - c * px + s * py + (cam.pan || 0), py - s * px - c * py - (cam.dl || 0)];
}
export function skyToScreen(cam, X, Y) { const m = skyM(cam); return [m[0] * X + m[2] * Y + m[4], m[1] * X + m[3] * Y + m[5]]; }
export function screenToSky(cam, x, y) {
  const c = Math.cos(cam.phi || 0), s = Math.sin(cam.phi || 0), [px, py] = POLE, dx = x - (cam.pan || 0) - px, dy = y + (cam.dl || 0) - py;
  return [px + c * dx + s * dy, py - s * dx + c * dy];
}

// ---------------------------------------------------------------- the Milky Way (sky coordinates, φ = 0 orientation: along the horizon)
const MW = { x0: -1500, x1: 3400, y0: 1095, y1: 1640 };
const axisY = (X) => 1352 + 26 * Math.sin(X * .0011 + .6) + 14 * Math.sin(X * .0031 + 2.1);
const halfW = (X) => 205 + 38 * Math.sin(X * .0007 + 1.3) + 46 * Math.exp(-(((X - 560) / 520) ** 2));
const coreK = (X) => Math.exp(-(((X - 560) / 640) ** 2));
let MWI = null;
function mwLayer() {
  if (MWI) return best(MWI);
  const w = MW.x1 - MW.x0, h = MW.y1 - MW.y0, q = 4, lw = Math.ceil(w / q), lh = Math.ceil(h / q);
  // 1 · density at quarter resolution: a soft band, brighter and warmer at the core, star clouds (fbm) and dark dust lanes along the axis
  const [dc, dg] = layer(lw, lh), img = dg.createImageData(lw, lh), p = img.data, n1 = vnoise(17), n2 = vnoise(29), n3 = vnoise(43);
  for (let j = 0; j < lh; j++) for (let i = 0; i < lw; i++) {
    const X = MW.x0 + i * q, Y = MW.y0 + j * q, ay = axisY(X), hw = halfW(X), v = (Y - ay) / hw, ck = coreK(X);
    const along = .55 + .45 * Math.exp(-(((X - 700) / 1500) ** 2)), prof = Math.exp(-v * v * 2.1) * along;
    const cloud = .55 + .9 * (fbm(n1, X * .006, Y * .012, 4) - .5) * 1.6;
    const rift = Math.exp(-(((Y - ay + 18 + 30 * Math.sin(X * .0024)) / (22 + 16 * fbm(n2, X * .004, 0, 2))) ** 2)) * (.55 + .45 * fbm(n2, X * .009, Y * .01, 3));
    const lane2 = Math.exp(-(((Y - ay - 64 - 20 * Math.sin(X * .0017 + 1)) / 14) ** 2)) * clamp(fbm(n3, X * .005, 3, 3) * 1.8 - .55);
    let d = prof * clamp(cloud) * (1 - .8 * clamp(rift * 1.35)) * (1 - .6 * lane2) * (1 + .7 * ck);
    d *= clamp((Y - 1095) / 90) ** 1.5;   // nothing at all above sky Y 1095 (the final frame ends at 1080)
    const k = (j * lw + i) * 4, warm = clamp(ck * 1.2 + .1 * (1 - Math.abs(v)));
    p[k] = 205 + 50 * warm; p[k + 1] = 214 + 24 * warm; p[k + 2] = 255 - 50 * warm; p[k + 3] = Math.round(255 * clamp(d * .34));
  }
  dg.putImageData(img, 0, 0);
  const [c, g] = layer(w, h);
  g.imageSmoothingEnabled = true; g.drawImage(dc, 0, 0, lw, lh, 0, 0, w, h);
  stipple(c, { k: .55, g: 1.1, seed: 7, boost: 2.2 });
  // 2 · the band's own dense stars (fine, cool, a few warm and bright ones), more where the band is bright
  const r = prng(733);
  for (let i = 0; i < 26000; i++) {
    const X = MW.x0 + r() * w, ay = axisY(X), hw = halfW(X), v = (r() + r() + r() - 1.5) * 1.15, Y = ay + v * hw;
    if (Y < 1100 || Y > MW.y1 - 4) continue;
    const ck = coreK(X), along = .55 + .45 * Math.exp(-(((X - 700) / 1500) ** 2)), keep = Math.exp(-v * v * 1.6) * along * (1 + .6 * ck) * clamp((Y - 1095) / 90);
    if (r() > keep) continue;
    const m = r(), sz = m < .93 ? .35 + r() * .5 : .8 + r() * .7, a = (m < .93 ? .25 + .45 * r() : .6 + .4 * r()) * clamp((Y - 1100) / 60);
    const col = m > .985 ? '255,214,170' : m > .96 ? '214,226,255' : '238,236,228';
    g.fillStyle = `rgba(${col},${a})`; g.beginPath(); g.arc(X - MW.x0, Y - MW.y0, sz, 0, TAU); g.fill();
    if (sz > 1.2) { g.fillStyle = `rgba(${col},${a * .08})`; g.beginPath(); g.arc(X - MW.x0, Y - MW.y0, sz * 4.5, 0, TAU); g.fill(); }
  }
  MWI = toImg(c); return best(MWI);
}
export function prepareSky() { mwLayer(); }

// ---------------------------------------------------------------- the sky
//   gradient: horizon-fixed (the atmosphere does not turn with the stars); everything else turns with φ about the pole.
const BK = [], HALO = [];
export function drawSky(ctx, t, cam = {}) {
  const pan = cam.pan || 0, dl = cam.dl || 0, phi = cam.phi || 0, om = cam.omega || 0, tau = cam.tau ?? 5.5;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0, -dl, 0, HZ - dl);
  g.addColorStop(0, DEEP[0]); g.addColorStop(.62 * H / HZ, DEEP[1]); g.addColorStop(H / HZ, DEEP[2]); g.addColorStop(1, HORIZON);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const M = skyM(cam);
  // the Milky Way (only where it can be on screen)
  if ((cam.mw ?? 1) > 0) {
    const corners = [[MW.x0, MW.y0], [MW.x1, MW.y0], [MW.x1, MW.y1], [MW.x0, MW.y1]].map(([X, Y]) => [M[0] * X + M[2] * Y + M[4], M[1] * X + M[3] * Y + M[5]]);
    const xs = corners.map((c) => c[0]), ys = corners.map((c) => c[1]);
    if (Math.max(...xs) > 0 && Math.min(...xs) < W && Math.max(...ys) > 0 && Math.min(...ys) < H) {
      ctx.setTransform(M[0], M[1], M[2], M[3], M[4], M[5]); ctx.globalAlpha = cam.mw ?? 1; ctx.drawImage(mwLayer(), MW.x0, MW.y0); ctx.globalAlpha = 1;
    }
  }
  // the plate's faint band
  ctx.setTransform(M[0], M[1], M[2], M[3], M[4], M[5]); ctx.translate(W / 2, H / 2); ctx.rotate(-.42);
  for (const [x, y, f] of BAND) { ctx.fillStyle = f; ctx.fillRect(x + t * 1.5, y, 1.3, 1.3); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the plate's stars, tiled; trails while the sky wheels (tapered arcs about the pole, batched per segment and brightness)
  const L = -om * tau, trails = Math.abs(L) > .002, mg = trails ? Math.min(900, Math.abs(L) * 1500) + 8 : 8;
  const box = [[-mg, -mg], [W + mg, -mg], [W + mg, H + mg], [-mg, H + mg]].map(([x, y]) => screenToSky(cam, x, y));
  const kx0 = Math.floor(Math.min(...box.map((b) => b[0])) / W) - 1, kx1 = Math.floor(Math.max(...box.map((b) => b[0])) / W);
  const ky0 = Math.floor(Math.min(...box.map((b) => b[1])) / H) - 1, ky1 = Math.floor(Math.max(...box.map((b) => b[1])) / H);
  const dx = t * 2.2, dy = t * .6, [pX, pY] = POLE, psx = M[0] * pX + M[2] * pY + M[4], psy = M[1] * pX + M[3] * pY + M[5], hor = HZ - dl + 30;
  const exact = !!cam.exact, NS = 5, TR = trails ? [[], []] : null, cL = Math.cos(L), sL = Math.sin(L), cH = Math.cos(L / 2), sH = Math.sin(L / 2);
  for (let kx = kx0; kx <= kx1; kx++) for (let ky = ky0; ky <= ky1; ky++) {
    for (const [x, y, s, ph, f] of STARS) {
      const X0 = ((x + dx) % W + W) % W, Y0 = ((y + dy) % H + H) % H, QX = X0 + kx * W, QY = Y0 + ky * H;
      const X = M[0] * QX + M[2] * QY + M[4], Y = M[1] * QX + M[3] * QY + M[5];
      if (X < -mg || X > W + mg || Y < -mg || Y > H + mg) continue;
      const vis = X > -6 && X < W + 6 && Y > -6 && Y < Math.min(H + 6, hor);
      if (trails) {   // the arc's head, middle and tail: keep it if its box touches the frame above the horizon
        const ux = X - psx, uy = Y - psy, mx = psx + ux * cH - uy * sH, my = psy + ux * sH + uy * cH, tx = psx + ux * cL - uy * sL, ty = psy + ux * sL + uy * cL;
        if (Math.max(X, mx, tx) > -3 && Math.min(X, mx, tx) < W + 3 && Math.max(Y, my, ty) > -3 && Math.min(Y, my, ty) < Math.min(H + 3, hor)) TR[s > 1.2 ? 1 : 0].push([ux, uy]);
      }
      if (!vis) continue;
      if (exact) {   // the plate's own way, star by star (pixel-identical to handoff4 at the identity view)
        const tw = .55 + .45 * Math.sin(t * f + ph);
        ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
        if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
      } else {       // batched: one path per alpha step (24 steps, invisible) and size class
        const tw = .55 + .45 * Math.sin(t * f + ph), q = Math.round((.35 + .65 * tw) * 23), k = (s > 1.2 ? 24 : 0) + q;
        (BK[k] || (BK[k] = [])).push(X, Y, s);
        if (s > 2) HALO.push(X, Y, s, tw);
      }
    }
  }
  if (!exact) {
    for (let k = 0; k < 48; k++) {
      const b = BK[k]; if (!b || !b.length) continue;
      ctx.fillStyle = `rgba(243,239,226,${(k % 24) / 23 * (k >= 24 ? 1 : .8)})`; ctx.beginPath();
      for (let i = 0; i < b.length; i += 3) { ctx.moveTo(b[i] + b[i + 2], b[i + 1]); ctx.arc(b[i], b[i + 1], b[i + 2], 0, TAU); }
      ctx.fill(); b.length = 0;
    }
    for (let i = 0; i < HALO.length; i += 4) { ctx.fillStyle = `rgba(255,241,214,${.07 * HALO[i + 3]})`; ctx.beginPath(); ctx.arc(HALO[i], HALO[i + 1], HALO[i + 2] * 5, 0, TAU); ctx.fill(); }
    HALO.length = 0;
  }
  if (trails) {   // chords along the arc (sub-pixel from the true circle), 5 segments fading toward the tail
    ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
    for (let b = 0; b < 2; b++) {
      const list = TR[b]; if (!list.length) continue;
      for (let k = 0; k < NS; k++) {
        const u0 = k / NS, fade = Math.pow(1 - (k + .5) / NS, 1.2), dA = L / NS;
        ctx.strokeStyle = `rgba(243,239,226,${(b ? .6 : .4) * fade})`; ctx.lineWidth = b ? 1.6 - .1 * k : 1.0 - .05 * k;
        ctx.beginPath();
        for (const [ux, uy] of list) {
          const rr = Math.hypot(ux, uy); if (rr < 2) continue;
          const a0 = Math.atan2(uy, ux) + L * u0, n = Math.max(1, Math.ceil(rr * Math.abs(dA) / 60));
          ctx.moveTo(psx + Math.cos(a0) * rr, psy + Math.sin(a0) * rr);
          for (let j = 1; j <= n; j++) { const a = a0 + dA * j / n; ctx.lineTo(psx + Math.cos(a) * rr, psy + Math.sin(a) * rr); }
        }
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

// the plate's stars that are on screen now (inside box = [x0, y0, x1, y1]): targets for lines that unwind into the stars
export function starsOnScreen(t, cam, box = [0, 0, W, H]) {
  const M = skyM(cam), out = [], dx = t * 2.2, dy = t * .6;
  const bb = [[box[0], box[1]], [box[2], box[1]], [box[2], box[3]], [box[0], box[3]]].map(([x, y]) => screenToSky(cam, x, y));
  const kx0 = Math.floor(Math.min(...bb.map((b) => b[0])) / W) - 1, kx1 = Math.floor(Math.max(...bb.map((b) => b[0])) / W);
  const ky0 = Math.floor(Math.min(...bb.map((b) => b[1])) / H) - 1, ky1 = Math.floor(Math.max(...bb.map((b) => b[1])) / H);
  for (let kx = kx0; kx <= kx1; kx++) for (let ky = ky0; ky <= ky1; ky++) {
    STARS.forEach(([x, y, s, ph, f], i) => {
      const QX = ((x + dx) % W + W) % W + kx * W, QY = ((y + dy) % H + H) % H + ky * H, X = M[0] * QX + M[2] * QY + M[4], Y = M[1] * QX + M[3] * QY + M[5];
      if (X >= box[0] && X <= box[2] && Y >= box[1] && Y <= box[3]) out.push({ x: X, y: Y, s, tw: .55 + .45 * Math.sin(t * f + ph), i, kx, ky, t0: t });
    });
  }
  return out;
}
// the same star ({ i, kx, ky } from starsOnScreen) at another time / camera (follows the drift; a star that wraps continues in the next tile)
export function starAt(st, t, cam) {
  const { i, kx, ky } = st, [x, y, s, ph, f] = STARS[i], M = skyM(cam), QX = x + t * 2.2 - Math.floor((x + st.t0 * 2.2) / W) * W + kx * W, QY = y + t * .6 - Math.floor((y + st.t0 * .6) / H) * H + ky * H;
  return { x: M[0] * QX + M[2] * QY + M[4], y: M[1] * QX + M[3] * QY + M[5], s, tw: .55 + .45 * Math.sin(t * f + ph) };
}
