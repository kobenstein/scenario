// Film 24 · B1 (c02–c04) shared helpers and props. Owned by builder B1; imports the lead's kit, never edits it.
//   camPath(K)            a 2D field camera through word keys [[t, { x, y, z }], …]: monotone cubic in (x, y, log z), so the camera glides
//                         THROUGH its keys (no stop at each key). withCam(ctx, cam, fn) draws fn in field coordinates (relative transform,
//                         so it also works inside an iris / medallion).
//   fieldBg(ctx, t, cam)  the explainer field: the night inside the ESP medallion (indigo, a soft blue glow, slow dust with parallax)
//   bez(x1, y1, x2, y2)   cubic-bezier ease
//   tint wave: twave(ctx, t, x, y, w, h, kind, col, o)   a call waveform in ANY colour (the kit's wave() knows gold / cream only)
//   props: leaf, miniCard, die, phone (+ feed, keyboard), thumb, toyBox, bills, book, bubble, crowTag, savanna, dusk scenes …
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, prng, drift, lin, rad, halo } = E;
const { rise, maskLine, measure } = F;
const TAU = Math.PI * 2;

// ======================================================================================================================== easing / camera
export function bez(x1, y1, x2, y2) {
  const c = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x) => { if (x <= 0) return 0; if (x >= 1) return 1; let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (c(m, x1, x2) < x) lo = m; else hi = m; } return c((lo + hi) / 2, y1, y2); };
}
// K: [[t, { x, y, z }], …] sorted. Returns cam(t) → { x, y, z } (x, y = field point at the screen centre, z = magnification).
export function camPath(K) {
  const n = K.length, T = K.map((k) => k[0]), V = K.map(([, c]) => [c.x, c.y, Math.log(c.z)]);
  const sec = (j, d) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
  const tan = (j, d) => {
    if (n < 2) return 0;
    if (j === 0) return K[0][2]?.v0 != null ? K[0][2].v0[d] : 0;
    if (j === n - 1) return K[n - 1][2]?.lead ? sec(n - 2, d) * K[n - 1][2].lead : 0;
    const a = sec(j - 1, d), b = sec(j, d); if (a * b <= 0) return 0;
    const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b));
  };
  return (t) => {
    if (n === 1 || t <= T[0]) { const c = K[0][1]; return { x: c.x, y: c.y, z: c.z }; }
    if (t >= T[n - 1]) { const c = K[n - 1][1]; return { x: c.x, y: c.y, z: c.z }; }
    let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
    const h = T[i + 1] - T[i], u = (t - T[i]) / h, u2 = u * u, u3 = u2 * u, out = [];
    for (let d = 0; d < 3; d++) {
      const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i, d) * h, m1 = tan(i + 1, d) * h;
      out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
    }
    return { x: out[0], y: out[1], z: Math.exp(out[2]) };
  };
}
// the field camera never stops: a slow drift on top (amt in field px; the zoom breathes ±.6 %)
export const fieldDrift = (c, t, amt = 1, seed = 0) => ({ x: c.x + drift(t, 7 * amt, seed), y: c.y + drift(t, 4.5 * amt, seed + 2), z: c.z * (1 + .006 * amt * drift(t, 1, seed + 4)) });
export function withCam(ctx, cam, fn) { ctx.save(); ctx.transform(cam.z, 0, 0, cam.z, W / 2 - cam.x * cam.z, H / 2 - cam.y * cam.z); const r = fn(); ctx.restore(); return r; }
export const toScr = (cam, x, y) => [W / 2 + (x - cam.x) * cam.z, H / 2 + (y - cam.y) * cam.z];
export const toField = (cam, sx, sy) => [cam.x + (sx - W / 2) / cam.z, cam.y + (sy - H / 2) / cam.z];

// ======================================================================================================================== the field
const DUSTF = (() => { const r = prng(2441), s = []; for (let i = 0; i < 260; i++) s.push([-1600 + r() * 5200, -900 + r() * 2900, .8 + r() * 1.6, r() * 6.3, .2 + r() * .5]); return s; })();
// o.glow: [fx, fy] field point of the soft blue glow (default: the camera's centre, with lag); o.warm 0..1 adds warmth (dusk / page light)
export function fieldBg(ctx, t, cam, o = {}) {
  ctx.save();
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night1, P.ind0, .55)], [.55, mixHex(P.ind0, P.ind1, .45)], [1, mixHex(P.night1, P.ind0, .4)]]); ctx.fillRect(-60, -60, W + 120, H + 120);
  const [gx, gy] = o.glow ? toScr(cam, o.glow[0], o.glow[1]) : [W / 2, H / 2];
  ctx.fillStyle = rad(ctx, gx, gy, 1100, [[0, rgba(mixHex(P.blue0, P.blue1, .3), .62)], [.5, rgba(P.blue0, .2)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-60, -60, W + 120, H + 120);
  // dust specks at 0.45 parallax (depth), breathing; they never pop (size from the camera only)
  ctx.fillStyle = P.halo2;
  for (const [x, y, s, ph, f] of DUSTF) {
    const sx = W / 2 + (x - cam.x * .45) * Math.pow(cam.z, .45) * .7, sy = H / 2 + (y - cam.y * .45) * Math.pow(cam.z, .45) * .7;
    if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue;
    ctx.globalAlpha = .16 + .12 * Math.sin(t * f + ph); ctx.beginPath(); ctx.arc(sx, sy, s, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ======================================================================================================================== waves in any colour
const AMPC = new Map();
export function amps(kind, seed = 1, N = 32) {
  const k = kind + ':' + seed + ':' + N; if (AMPC.has(k)) return AMPC.get(k);
  const r = prng(seed * 131 + kind.length * 7), a = new Float32Array(N), g = (x, c, w) => Math.exp(-(((x - c) / w) ** 2));
  for (let i = 0; i < N; i++) {
    const x = i / (N - 1), n = r(); let v;
    if (kind === 'grunt') v = Math.max(g(x, .2, .08), g(x, .5, .08), g(x, .8, .08)) * (.5 + .2 * n);
    else if (kind === 'squeal' || kind === 'caw') v = Math.max(g(x, .3, .12), g(x, .7, .12)) * (.6 + .4 * n);
    else if (kind === 'click') v = [.15, .3, .45, .6, .75].some((c) => Math.abs(x - c) < .6 / N) ? .9 : .05 * n;
    else if (kind === 'whistle' || kind === 'song') v = (.4 + .35 * Math.sin(x * 9 + seed) ** 2) * Math.min(1, x * 6, (1 - x) * 6);
    else if (kind === 'chirp') v = (Math.sin(x * 40 + seed) > .4 ? .6 + .3 * n : .06) * Math.min(1, x * 6, (1 - x) * 6);
    else if (kind === 'babble') v = Math.max(g(x, .18, .07), g(x, .42, .07), g(x, .66, .07), g(x, .86, .06)) * (.45 + .3 * n);
    else v = (.35 + .2 * Math.sin(x * 8 + seed) + .1 * n) * Math.min(1, x * 7, (1 - x) * 6);   // rumble
    a[i] = clamp(v);
  }
  AMPC.set(k, a); return a;
}
// mirrored bars, col any hex; o { u (drawn 0→1), a, bars, seed, live, lw }
export function twave(ctx, t, x, y, w, h, kind, col, o = {}) {
  const N = o.bars ?? 20, A = amps(kind, o.seed ?? 1, N), u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return;
  const step = w / N, bw = Math.max(1.2, step * (o.thin ?? .5));
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = bw; ctx.lineCap = 'round'; ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const f = (i + .5) / N; if (f > u) break;
    const grow = clamp((u - f) * N / 2.5), live = o.live ? 1 + .08 * Math.sin(t * 7 + i * 1.3 + (o.seed ?? 0)) : 1;
    const hh = Math.max(bw * .55, A[i] * h * .5 * grow * live), xx = x - w / 2 + (i + .5) * step;
    ctx.moveTo(xx, y - hh); ctx.lineTo(xx, y + hh);
  }
  ctx.stroke(); ctx.restore();
}

// ======================================================================================================================== small things
// a text line that rises from its baseline (u) and sinks back (expoIn on out)
export function riseOut(t, a, b, d = .7, dOut = .45) { return rise(span(t, a, a + d)) * (b == null ? 1 : 1 - expoIn(span(t, b, b + dOut))); }
export function tag(ctx, text, x, y, u, o = {}) {   // a small caps tag in a pill (Inter), rises from its baseline; centred at x
  u = clamp(u); if (u <= 0) return;
  const sz = o.size ?? 18, w = measure(text, sz, false) * 1.12 + 30, h = sz * 1.9, k = expoOut(u), C = o.col === 'gold' ? F.GOLD : F.CREAM;
  ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2 - 12, y - h / 2 - 12, w + 24, h + 24); ctx.clip(); ctx.translate(0, (1 - k) * (h + 14));
  ctx.fillStyle = rgba(P.night0, .78); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = rgba(o.line ?? C.line, .7); ctx.lineWidth = 2; ctx.stroke();
  E.glowText(ctx, text, x, y + sz * .36, { size: sz, weight: 600, align: 'center', col: o.text ?? (o.col === 'gold' ? P.halo0 : P.cream), glow: false, spacing: .12 });
  ctx.restore();
}
// a leaf / lily pad under a small animal
export function leaf(ctx, x, y, w, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(.02 * Math.sin(t * .7));
  ctx.fillStyle = lin(ctx, -w, 0, w, 0, [[0, mixHex(P.night1, P.ind1, .4)], [1, mixHex(P.ind1, P.blue1, .5)]]);
  ctx.beginPath(); ctx.ellipse(0, 0, w, w * .16, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, w, w * .16, 0, Math.PI * 1.05, Math.PI * 1.9); ctx.stroke();
  ctx.restore();
}
// a mini card of the tries row: hit (cream, gold tick) or miss (cool, tilted, sunk a little)
export function miniCard(ctx, x, y, u, hit, t, sc = 1) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), w = 42, h = 30;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(hit ? 0 : .22 * k); ctx.scale(.5 + .5 * k, .5 + .5 * k);
  ctx.fillStyle = hit ? rgba(mixHex(P.night0, P.ind0, .5), .95) : rgba(P.night1, .9); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 6); ctx.fill();
  ctx.strokeStyle = hit ? rgba(F.CREAM.line, .8) : rgba(mixHex(P.blue0, P.cream, .4), .55); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = hit ? rgba(F.CREAM.body, .9) : rgba(P.blue1, .9); ctx.fillRect(-w / 2 + 6, -h / 2, 14, 2.5);
  ctx.restore();
  if (hit) F.tick(ctx, x + 1, y + 2, 8 * sc, span(u, .5, 1), 'gold');
}
// a die seen from the front, rolling (rot rad), face = number of pips shown
export function die(ctx, x, y, s, rot, face, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = lin(ctx, -s, -s, s, s, [[0, mixHex(P.cream, P.halo2, .3)], [1, mixHex(P.halo2, P.blue1, .5)]]);
  ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * .18); ctx.fill();
  ctx.strokeStyle = rgba(P.night0, .4); ctx.lineWidth = 2; ctx.stroke();
  const pp = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[face] || [[0, 0]];
  ctx.fillStyle = P.night1; for (const [a, b] of pp) { ctx.beginPath(); ctx.arc(a * s * .26, b * s * .26, s * .075, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ======================================================================================================================== the phone
// phone body centred at (x, y), w × h (morph to the toy box via o.box 0..1); o.screen(ctx, sx, sy, sw, sh) draws into the screen (clipped)
export function phone(ctx, t, x, y, w, h, o = {}) {
  const r = lerp(w * .13, 18, o.box ?? 0);
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(x - w / 2 + 10, y - h / 2 + 14, w, h, r); ctx.fill();   // its shadow
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.night0, P.ind2, .6)], [1, mixHex(P.ind2, P.blue1, .5)]]);
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r); ctx.fill();
  ctx.strokeStyle = rgba(P.halo2, .55); ctx.lineWidth = 2.5; ctx.stroke();
  const m = lerp(14, 18, o.box ?? 0), sx = x - w / 2 + m, sy = y - h / 2 + lerp(36, 18, o.box ?? 0), sw = w - 2 * m, sh = h - lerp(36 + 26, 36, o.box ?? 0);
  ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, lerp(10, 8, o.box ?? 0)); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, sy, 0, sy + sh, [[0, mixHex(P.ind0, P.blue1, .35)], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(sx, sy, sw, sh);
  if (o.screen) o.screen(ctx, sx, sy, sw, sh);
  ctx.restore();
  ctx.restore();
  // screen glow: the phone is a small light
  halo(ctx, x, y, Math.max(w, h) * .9, .12 * (o.glow ?? 1), P.blue0, mixHex(P.blue0, P.cream, .5));
  return { sx, sy, sw, sh };
}
// the endless feed inside a screen: posts scroll up by off (px); o.drain (px) pulls the posts down and out of the bottom
export function feed(ctx, t, sx, sy, sw, sh, off, o = {}) {
  const ph = 150, gap = 16, step = ph + gap, a = o.a ?? 1;
  const k0 = Math.floor(off / step) - 1;
  for (let k = k0; k < k0 + Math.ceil(sh / step) + 3; k++) {
    const y = sy + 14 + k * step - off + (o.drain ?? 0); if (y > sy + sh + 4 || y + ph < sy - 4) continue;
    const r = prng(5000 + ((k % 97) + 97) % 97);
    const x0 = sx + 12, w = sw - 24;
    ctx.fillStyle = rgba(P.blue1, .32 * a); ctx.beginPath(); ctx.roundRect(x0, y, w, ph, 10); ctx.fill();
    ctx.fillStyle = rgba(P.cream, .45 * a); ctx.beginPath(); ctx.arc(x0 + 20, y + 20, 10, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(P.halo2, .45 * a); ctx.fillRect(x0 + 38, y + 14, w * (.35 + .3 * r()), 6); ctx.fillStyle = rgba(P.halo2, .25 * a); ctx.fillRect(x0 + 38, y + 25, w * (.2 + .3 * r()), 5);
    ctx.fillStyle = rgba(mixHex(P.blue0, P.shade1, r()), .45 * a); ctx.beginPath(); ctx.roundRect(x0 + 10, y + 42, w - 20, ph - 60, 6); ctx.fill();
    ctx.fillStyle = rgba(P.halo2, .3 * a); ctx.fillRect(x0 + 10, y + ph - 12, w * (.25 + .4 * r()), 4);
  }
}
// a thumb (skin, no nail detail) coming in from the lower right of the phone; lift 0..1 moves it up the screen (a flick)
export function thumb(ctx, x, y, s, lift) {
  ctx.save(); ctx.translate(x, y - lift * s * .9); ctx.rotate(-.5);
  const skin = mixHex(P.shade0, P.night1, .45);
  ctx.fillStyle = lin(ctx, -s * .3, 0, s * .3, 0, [[0, mixHex(skin, P.night0, .4)], [1, mixHex(skin, P.halo1, .25)]]);
  ctx.beginPath(); ctx.roundRect(-s * .26, -s * .2, s * .52, s * 1.6, s * .26); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .2); ctx.beginPath(); ctx.ellipse(0, -s * .02, s * .15, s * .2, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
// the phone keyboard (autocomplete): a text line with a wave and the cursor, a suggestion bar with icons, rows of keys
export function keyboard(ctx, t, sx, sy, sw, sh, o = {}) {
  const kbY = sy + sh * .5;
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(sx, kbY, sw, sh * .5);
  const rows = [10, 9, 7], kw = (sw - 20) / 10;
  rows.forEach((n, j) => { for (let i = 0; i < n; i++) { const x = sx + 10 + (10 - n) * kw / 2 + i * kw, y = kbY + 64 + j * 46; ctx.fillStyle = rgba(P.blue1, .5); ctx.beginPath(); ctx.roundRect(x + 2, y, kw - 4, 38, 6); ctx.fill(); } });
  ctx.fillStyle = rgba(P.blue1, .5); ctx.beginPath(); ctx.roundRect(sx + 10 + kw * 2, kbY + 64 + 3 * 46, kw * 6, 38, 6); ctx.fill();
  // the suggestion bar: three pills (filled by o.sugg(ctx, i, cx, cy, u))
  for (let i = 0; i < 3; i++) {
    const cx = sx + sw * (i + .5) / 3, cy = kbY + 26, u = o.su ? o.su[i] : 0;
    ctx.strokeStyle = rgba(P.halo2, .25); ctx.lineWidth = 1.5; if (i) { ctx.beginPath(); ctx.moveTo(sx + sw * i / 3, kbY + 12); ctx.lineTo(sx + sw * i / 3, kbY + 40); ctx.stroke(); }
    if (u > 0 && o.sugg) o.sugg(ctx, i, cx, cy, u);
  }
  // the text line: a wave being typed and the cursor
  const ty = sy + sh * .36;
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(sx + 12, ty - 30, sw - 24, 60, 30); ctx.fill();
  if (o.line) o.line(ctx, sx + 30, ty, sw - 60);
}

// ======================================================================================================================== the toy box
export function toyScreen(ctx, t, sx, sy, sw, sh, u) {
  ctx.save(); ctx.globalAlpha *= clamp(u);
  F.icon(ctx, 'dog', sx + sw * .3, sy + sh * .42, sh * .3, { col: 'cream', t });
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { ctx.fillStyle = rgba(P.halo2, .35); ctx.beginPath(); ctx.arc(sx + sw * .62 + i * 16, sy + sh * .3 + j * 16, 3.5, 0, TAU); ctx.fill(); }
  E.glowText(ctx, 'DOG TRANSLATOR', sx + sw / 2, sy + sh * .86, { size: 19, weight: 700, align: 'center', col: P.cream, glow: false, spacing: .1 });
  ctx.restore();
}

// ======================================================================================================================== bills, book
export function bills(ctx, x, y, n, u, t) {   // a stack of banknotes: n slabs, bottom centre (x, y); u 0..1 builds it (staggered)
  for (let i = 0; i < n; i++) {
    const k = expoOut(span(u, i / (n + 2), (i + 3) / (n + 2))); if (k <= 0) continue;
    const yy = y - i * 22 - 22 + (1 - k) * 60, xx = x + 4 * Math.sin(i * 1.7);
    ctx.save(); ctx.beginPath(); ctx.rect(x - 200, y - 400, 400, 400); ctx.clip();
    ctx.fillStyle = lin(ctx, xx - 120, 0, xx + 120, 0, [[0, mixHex(P.halo2, P.blue1, .55)], [1, mixHex(P.cream, P.halo2, .4)]]);
    ctx.beginPath(); ctx.roundRect(xx - 120, yy, 240, 20, 3); ctx.fill();
    ctx.fillStyle = rgba(P.night0, .25); ctx.fillRect(xx - 120, yy + 16, 240, 4);
    ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xx - 28, yy + 2); ctx.lineTo(xx - 28, yy + 16); ctx.moveTo(xx + 28, yy + 2); ctx.lineTo(xx + 28, yy + 16); ctx.stroke();
    ctx.restore();
  }
}
// the open dictionary, front view, spine at (x, y) (top of the spine), page w × h; o: { u (opens 0..1), flip (0..n flipping pages),
//   glow 0..1 (the right page lights up), tabs (thumb index letters) }. Returns the right page rect.
export function book(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1), k = sineIO(u), gl = clamp(o.glow ?? 0);
  ctx.save();
  // the cover under the pages
  ctx.fillStyle = mixHex(P.night0, P.ind2, .7); ctx.beginPath(); ctx.roundRect(x - w * k - 16, y - 10, (w * k + 16) * 2, h + 26, 8); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .25); ctx.fillRect(x - w * k - 16, y + h + 12, (w * k + 16) * 2, 3);
  // page edges (thickness) under each page
  for (let s of [-1, 1]) for (let i = 0; i < 4; i++) { ctx.fillStyle = rgba(mixHex(P.halo2, P.blue1, .5), .7 - i * .12); ctx.fillRect(s < 0 ? x - w * k : x, y + h + 2 + i * 3, w * k, 2); }
  const pageFill = (px, pw, light) => {
    const c0 = mixHex(mixHex(P.halo2, P.blue1, .5), P.core1, light), c1 = mixHex(mixHex(P.cream, P.blue1, .32), P.core0, light);
    ctx.fillStyle = lin(ctx, px, 0, px + pw, 0, [[0, c0], [1, c1]]); ctx.fillRect(px, y, pw, h);
  };
  pageFill(x - w * k, w * k, 0);
  const rp = { x: x + 6, y, w: w - 6, h };
  pageFill(x, w * k, gl);
  // the spine shadow
  ctx.fillStyle = lin(ctx, x - 22, 0, x + 22, 0, [[0, rgba(P.night0, 0)], [.5, rgba(P.night0, .45)], [1, rgba(P.night0, 0)]]); ctx.fillRect(x - 22, y, 44, h);
  // flipping pages (blank): a page turning over the spine, right → left
  const fl = o.flip ?? 0;
  if (fl > 0 && fl < 999) {
    const f = fl % 1, c = Math.cos(Math.PI * sineIO(f)), pw = w * k * c;
    if (Math.abs(pw) > 1) { ctx.fillStyle = mixHex(mixHex(P.halo2, P.blue1, .5), P.cream, .15 + .2 * Math.abs(c)); ctx.fillRect(Math.min(x, x + pw), y - 4 * (1 - Math.abs(c)), Math.abs(pw), h); }
  }
  // thumb index tabs (A B C …) on the right page edge: it reads as a dictionary without a word in it
  if (o.tabs && k > .9) {
    const L = ['A', 'D', 'G', 'K', 'O', 'S', 'W'];
    L.forEach((ch, i) => { const ty = y + 24 + i * (h - 48) / L.length; ctx.fillStyle = rgba(P.night1, .75); ctx.beginPath(); ctx.roundRect(x + w * k - 2, ty, 18, 28, 4); ctx.fill(); E.glowText(ctx, ch, x + w * k + 7, ty + 20, { size: 14, weight: 700, align: 'center', col: rgba(P.halo2, .8), glow: false }); });
  }
  ctx.restore();
  if (gl > 0) halo(ctx, x + w * k / 2, y + h / 2, w * 2.2, .32 * gl, P.halo1, P.core1);
  return rp;
}

// ======================================================================================================================== the medallion window
// a scene seen through a circle at (cx, cy) radius r, in the current transform: fn(ctx) draws a full 1920×1080 scene (relative transforms
// only, or cards through E.withOuter). ring: colour, rw: ring width. Returns nothing.
export function medal(ctx, cx, cy, r, fn, o = {}) {
  if (r <= .5) return;
  const s = r / F.RF, m = ctx.getTransform();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
  const g = ctx.getTransform();   // the absolute transform of the scene (for card stages through withOuter)
  E.withOuter({ k: g.a, e: g.e, f: g.f }, () => fn(ctx, s));
  ctx.restore();
  const zs = Math.hypot(m.a, m.b); ctx.save(); ctx.strokeStyle = o.ring ?? F.GOLD.body; ctx.lineWidth = (o.rw ?? clamp(r * zs * .12, 2, 3.2)) / zs; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); ctx.restore();
}
// a rounded-rect morph between a circle (cx, cy, r) and CLIP_RECT (m 0..1, eased inside), in screen space. Returns the shape.
export function plateShape(c, m) {
  const R = F.CLIP_RECT, e = sineIO(clamp(m));
  const cx = lerp(c[0], R.x + R.w / 2, e), cy = lerp(c[1], R.y + R.h / 2, e), w = lerp(c[2] * 2, R.w, e), h = lerp(c[2] * 2, R.h, e), rr = lerp(c[2], 14, e);
  return { cx, cy, w, h, rr: Math.min(rr, w / 2, h / 2) };
}
// draw a scene (fn as in medal) inside the morphing plate (screen space); the scene's scale follows the plate (circle: r / RF → rect: w / W)
export function plateScene(ctx, c, m, fn, o = {}) {
  const S = plateShape(c, m), s = lerp(c[2] * 2 / (2 * F.RF), S.w / W, sineIO(clamp(m))) * (o.zoom ?? 1);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.roundRect(S.cx - S.w / 2, S.cy - S.h / 2, S.w, S.h, S.rr); ctx.clip();
  ctx.translate(S.cx, S.cy); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
  const g = ctx.getTransform(); E.withOuter({ k: g.a, e: g.e, f: g.f }, () => fn(ctx, s));
  ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = o.ring ?? F.GOLD.body; ctx.lineWidth = lerp(clamp(c[2] * .12, 2, 3.2), 3, sineIO(clamp(m)));
  ctx.beginPath(); ctx.roundRect(S.cx - S.w / 2, S.cy - S.h / 2, S.w, S.h, S.rr); ctx.stroke(); ctx.restore();
  return S;
}

// ======================================================================================================================== habitats
// the low sun of a dusk / savanna scene: sky, sun, haze, ground; sunY moves the sun (sets), warm 0..1
export function duskSky(ctx, t, o = {}) {
  const hy = o.horizon ?? 700, sx = o.sunX ?? 960, sy = o.sunY ?? hy - 40, sr = o.sunR ?? 70, set = clamp(o.set ?? 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, hy, [[0, mixHex(P.night1, P.ind0, .5)], [.55, mixHex(P.ind1, P.blue1, .5)], [.85, mixHex(mixHex(P.blue2, P.shade0, .55), P.night1, set * .6)], [1, mixHex(mixHex(P.shade0, P.halo1, .45), P.night1, set * .7)]]);
  ctx.fillRect(-1300, -1000, W + 2600, hy + 1010);
  halo(ctx, sx, sy, 900 * (1 - .45 * set), .5 * (1 - .7 * set), P.halo1, P.core1);
  ctx.save(); ctx.beginPath(); ctx.rect(-1300, -1000, W + 2600, hy + 1000); ctx.clip();
  ctx.fillStyle = rad(ctx, sx, sy, sr, [[0, P.core0], [.7, P.core1], [1, mixHex(P.core1, P.halo0, .5)]]); ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
  ctx.restore();
  // thin haze bands across the sun
  ctx.fillStyle = rgba(P.shade0, .22); for (let i = 0; i < 3; i++) ctx.fillRect(-1300, hy - 70 + i * 22 + 4 * Math.sin(t * .2 + i), W + 2600, 5);
  // the ground
  ctx.fillStyle = lin(ctx, 0, hy, 0, H + 700, [[0, mixHex(P.shade0, P.night1, .62)], [.3, mixHex(P.night1, P.ind0, .4)], [1, P.night0]]); ctx.fillRect(-1300, hy, W + 2600, H + 1000 - hy);
  ctx.fillStyle = rgba(P.halo1, .35 * (1 - set)); ctx.fillRect(-1300, hy, W + 2600, 3);
}
// an acacia silhouette (flat top) at (x, y ground), size s
export function acacia(ctx, x, y, s) {
  ctx.save(); ctx.fillStyle = mixHex(P.night0, P.ind0, .5);
  ctx.beginPath(); ctx.moveTo(x - s * .04, y); ctx.lineTo(x - s * .02, y - s * .6); ctx.lineTo(x - s * .28, y - s * .82); ctx.lineTo(x - s * .25, y - s * .86); ctx.lineTo(x, y - s * .66); ctx.lineTo(x + s * .22, y - s * .88); ctx.lineTo(x + s * .26, y - s * .84); ctx.lineTo(x + s * .04, y - s * .6); ctx.lineTo(x + s * .05, y); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y - s * .9, s * .55, s * .09, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - s * .2, y - s * .96, s * .3, s * .07, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
// grass tufts along a ground line (seeded)
const GRASS = (() => { const r = prng(2451), g = []; for (let i = 0; i < 160; i++) g.push([r() * 2300 - 190, r(), 6 + r() * 16, r() * 6.3]); return g; })();
export function grass(ctx, t, y0, y1, a = 1) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 2;
  for (const [x, v, h, ph] of GRASS) { const y = lerp(y0, y1, v * v), sc = .6 + .8 * v, sw = 3 * Math.sin(t * .8 + ph); ctx.strokeStyle = rgba(mixHex(P.shade0, P.night1, .5), .55 * a); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sw * sc, y - h * sc); ctx.moveTo(x + 4, y); ctx.lineTo(x + 4 + sw * sc + 4, y - h * sc * .8); ctx.stroke(); }
  ctx.restore();
}
// the research jeep (side view) with a speaker on the back; front at the right. (x = rear, y = ground), s = length; returns the speaker's mouth
export function jeep(ctx, t, x, y, s, o = {}) {
  const dir = o.dir ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
  const body = mixHex(P.night1, P.blue2, .55), lit = mixHex(P.blue2, P.shade0, .4);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(s * .5, 0, s * .58, s * .04, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -s * .5, 0, 0, [[0, lit], [1, body]]);
  ctx.beginPath(); ctx.moveTo(0, -s * .1); ctx.lineTo(0, -s * .34); ctx.lineTo(s * .55, -s * .34); ctx.lineTo(s * .62, -s * .5); ctx.lineTo(s * .82, -s * .5); ctx.lineTo(s * .9, -s * .32); ctx.lineTo(s, -s * .3); ctx.lineTo(s, -s * .1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(s * .64, -s * .47, s * .15, s * .1);   // the windscreen catches the sun
  ctx.fillStyle = P.night0; for (const wx of [s * .2, s * .8]) { ctx.beginPath(); ctx.arc(wx, -s * .1, s * .1, 0, TAU); ctx.fill(); ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.beginPath(); ctx.arc(wx, -s * .1, s * .04, 0, TAU); ctx.fill(); ctx.fillStyle = P.night0; }
  // the speaker on a pole at the back, facing left (towards the elephant)
  ctx.fillStyle = body; ctx.fillRect(s * .1, -s * .62, s * .025, s * .3);
  const pls = o.pulse ?? 0;
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.roundRect(s * .03, -s * .74, s * .17, s * .14, s * .02); ctx.fill();
  ctx.fillStyle = mixHex(P.blue1, P.halo2, .3 + .4 * pls); ctx.beginPath(); ctx.arc(s * .07, -s * .67, s * .045 * (1 + .12 * pls), 0, TAU); ctx.fill();
  ctx.restore();
  return [x + dir * s * .05, y - s * .67];
}

// ======================================================================================================================== clip credits
// the credits of a clip in ONE row from the left above CLIP_RECT (name · ROLE · YEAR · ORIGINAL FOOTAGE), so the docked 2030 strip
// (top right) never collides with them (the kit's clipPlate puts ORIGINAL FOOTAGE under the strip). lu 0..1.
export function credits(ctx, id, lu) {
  if (lu <= 0) return;
  const R = F.CLIP_RECT, info = F.CLIPS[id], by = R.y - 26;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const nw = maskLine(ctx, [[info.name, info.col === 'gold' ? 1 : 0]], R.x, by, 40, rise(lu), { glow: true });
  const rl = `${info.role.toUpperCase()} · ${info.year}`, rw = measure(rl, 20, false);
  maskLine(ctx, [[rl, 0]], R.x + nw.w + 22, by - 2, 20, rise(lu), { serif: false, col: P.halo2, glow: false });
  maskLine(ctx, [['ORIGINAL FOOTAGE', 0]], R.x + nw.w + 22 + rw + 30, by - 2, 20, rise(lu), { serif: false, col: P.halo0, glow: false });
  ctx.restore();
}

// ======================================================================================================================== card-stage camera
// a monotone cubic through E.cam3 keys [[t, cam], …] in (x, y, log distance to the focus card): it glides THROUGH its keys (as sc01)
export function cam3Path(K) {
  const F0 = E.F0, n = K.length, T = K.map((k) => k[0]), V = K.map(([, c]) => [c.x, c.y, Math.log(F0 - c.z)]);
  return (t) => {
    if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
    let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
    const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
    for (let d = 0; d < 3; d++) {
      const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
      const tan = (j) => { if (j === 0) return K[0][2]?.lead ? sec(0) * K[0][2].lead : 0; if (j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
      const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
      out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
    }
    return E.cam3({ x: out[0], y: out[1], z: F0 - Math.exp(out[2]) });
  };
}
