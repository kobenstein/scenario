// Film 24 · builder B3 (c09–c11 + end screen) · shared helpers. Owned by B3; uses lib/f24_kit.mjs, never changes it.
//   glide(K, v0)            a camera path through word keys [[t, { u, v, s }]] (monotone cubic in u, v, log s): it glides THROUGH its
//                           keys; v0 = start velocity per second { u, v, ls } (to continue a plate's creep), the last key ends at rest
//   camOf(p) / camAt(p, t, amt)   E.aim(F0, u, v, s) (+ camDrift)
//   scr(ctx, O, fn)         a screen layer of a scene; O = the medallion's outer transform (null: full frame)
//   cardRef(ctx, c, Z, ref, fn)   a card designed "as seen from camera ref" (for sets that share a stage with another set)
//   inView / medallion(ctx, t, v, m)   a LIVE medallion on the night map: radius ∝ map zoom (r = PIN_R · v.z / zref), so the world
//                           inside and the map outside zoom as ONE move (sc01 mapPart); the scene inside is drawn full frame through O
//   hop(A, B, t0, t1)       one van Wijk flight from inside pin A's medallion to inside pin B's medallion
//   scenarioStamp, realCard, heartEar, figure glyph (grid), bubble, mindCard, phone, offscreen clip plate (phone → CLIP_RECT)
import { createCanvas, Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad } = E;
const { rise, maskLine, measure } = F;
const TAU = Math.PI * 2;
export const F0 = E.F0;

// ------------------------------------------------------------------------------------------------ easing
export function bez(x1, y1, x2, y2) {
  const c = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x) => { if (x <= 0) return 0; if (x >= 1) return 1; let lo = 0, hi = 1; for (let i = 0; i < 28; i++) { const m = (lo + hi) / 2; if (c(m, x1, x2) < x) lo = m; else hi = m; } return c((lo + hi) / 2, y1, y2); };
}
export const ZOUT = bez(.55, 0, .25, 1);   // zoom out of a medallion (sc01): slow while it is big, fast once small, long settle
export const ZIN = bez(.75, 0, .45, 1);    // the mirror: a zoom into a medallion
export const HOP = bez(.5, 0, .5, 1);      // a whole flight pin → pin (zoom out, pan, zoom in)

// ------------------------------------------------------------------------------------------------ camera
export function glide(K, v0 = null) {
  const n = K.length, T = K.map((k) => k[0]), V = K.map(([, c]) => [c.u, c.v, Math.log(c.s)]);
  return (t) => {
    if (n === 1 || t <= T[0]) { if (t < T[0] && v0) { const d = t - T[0]; return { u: V[0][0] + v0.u * d, v: V[0][1] + v0.v * d, s: Math.exp(V[0][2] + v0.ls * d) }; } return { u: V[0][0], v: V[0][1], s: Math.exp(V[0][2]) }; }
    if (t >= T[n - 1]) return { u: V[n - 1][0], v: V[n - 1][1], s: Math.exp(V[n - 1][2]) };
    let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
    const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
    for (let d = 0; d < 3; d++) {
      const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
      const tan = (j) => {
        if (j === 0) return v0 ? [v0.u, v0.v, v0.ls][d] : 0;
        if (j === n - 1) return 0;
        const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2;
        return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b));
      };
      const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
      out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
    }
    return { u: out[0], v: out[1], s: Math.exp(out[2]) };
  };
}
export const camOf = (p) => E.aim(F0, p.u, p.v, p.s);
export const camAt = (p, t, amt = 1.8, seed = 0) => (amt > 0 ? E.camDrift(camOf(p), t, amt, seed) : camOf(p));
export const mixCam = (a, b, x) => ({ u: lerp(a.u, b.u, x), v: lerp(a.v, b.v, x), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), x)) });

// ------------------------------------------------------------------------------------------------ layers
export function scr(ctx, O, fn) { ctx.save(); if (O) ctx.setTransform(O.k, 0, 0, O.k, O.e, O.f); else ctx.setTransform(1, 0, 0, 1, 0, 0); const r = fn(); ctx.restore(); return r; }
export function cardRef(ctx, c, Z, ref, fn) {
  const mr = E.cardM(ref, Z); if (!mr) return false;
  return E.card(ctx, c, Z, (k) => { ctx.scale(1 / mr.k, 1 / mr.k); ctx.translate(-mr.e, -mr.f); fn(k / mr.k); });
}
// a screen point of a design point on card Z (with the medallion's outer transform O)
export function onScreen(c, Z, u, v, O = null) { const p = E.project(c, Z, u, v); if (!p) return null; return O ? [O.e + p[0] * O.k, O.f + p[1] * O.k, p[2] * O.k] : p; }

// ------------------------------------------------------------------------------------------------ the night map: live medallions
export const zIn = (zref) => zref * F.RF / F.PIN_R;
export const inView = (lon, lat, zref) => F.mapView(lon, lat, zIn(zref));
export function medHead(v, lon, lat, zref) {
  const [px, py] = F.mapXY(v, lon, lat), r = Math.max(F.PIN_R, F.PIN_R * v.z / zref);
  const k = sineIO(clamp((r - F.RF) / (F.PIN_R - F.RF) * 1.25 - .25));
  return { px, py, r, cx: px, cy: py - (F.STALK + r) * k };
}
// m: { lon, lat, kind 'other' | 'esp', zref, scene(ctx, O, s), label: [l1, l2], lu, grow }
export function medallion(ctx, t, v, m) {
  const h = medHead(v, m.lon, m.lat, m.zref);
  if (h.cx + h.r < -60 || h.cx - h.r > W + 60 || h.cy + h.r < -60 || h.cy - h.r > H + 60) return null;
  const esp = m.kind === 'esp';
  return F.pin(ctx, t, h.px, h.py, {
    kind: m.kind ?? 'other', grow: m.grow ?? 1, r: h.r / (esp ? 1.25 : 1), head: [h.cx, h.cy], label: m.label, lu: m.lu ?? 0,
    inner: (c2, cx, cy, hr) => { const s = hr / F.RF, O = { k: s, e: cx - W / 2 * s, f: cy - H / 2 * s }; c2.save(); c2.setTransform(O.k, 0, 0, O.k, O.e, O.f); E.withOuter(O, () => m.scene(c2, O, s)); c2.restore(); },
  });
}
export const covers = (v, m) => { const h = medHead(v, m.lon, m.lat, m.zref); return h.r >= F.RF * .999 && Math.hypot(h.cx - W / 2, h.cy - H / 2) < 2; };
// the map with the live medallions on it; the medallions' own pins are hidden from F.pins (the kit pins of places stay dots)
export function mapWith(ctx, t, T, v, meds, o = {}) {
  const full = meds.find((m) => covers(v, m));
  if (full) { scr(ctx, null, () => E.withOuter(null, () => full.scene(ctx, null, 1))); return; }
  F.map(ctx, t, v, { calls: o.calls ?? .45 });
  F.pins(ctx, t, T, v, { hide: [...meds.map((m) => m.id).filter(Boolean), ...(o.hide || [])], labels: o.labels, labDur: o.labDur ?? 6 });
  for (const m of meds) medallion(ctx, t, v, m);
}

// ------------------------------------------------------------------------------------------------ the SCENARIO stamp (top left)
// SCENARIO and the row DAY 1 · YEAR 1 · YEAR 10; o: { u (rise), at (0 DAY 1 … 2 YEAR 10, fractional while the bead slides) }
const STAMP_ITEMS = ['DAY 1', 'YEAR 1', 'YEAR 10'];
export function scenarioStamp(ctx, t, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const x0 = 110, y0 = 104, at = o.at ?? 0;
  scr(ctx, null, () => {
    maskLine(ctx, [['SCENARIO', 1]], x0, y0, 22, u, { serif: false, weight: 600, col: P.halo2, glow: false });
    let x = x0; const cs = [];
    STAMP_ITEMS.forEach((s, i) => {
      const on = clamp(1 - Math.abs(at - i)), col = mixHex(mixHex(P.halo2, P.ind2, .45), P.cream, on);
      maskLine(ctx, [[s, 0]], x, y0 + 34, 17, rise(span(u, .15 + i * .08, 1)), { serif: false, weight: 600, col, glow: false });
      const w = measure(s, 17, false); cs.push(x + w / 2); x += w + 30;
      if (i < 2) { ctx.fillStyle = rgba(P.halo2, .45 * u); ctx.beginPath(); ctx.arc(x - 15, y0 + 28, 2, 0, TAU); ctx.fill(); }
    });
    const bi = clamp(at, 0, 2), i0 = Math.floor(Math.min(bi, 1.999)), bx = lerp(cs[i0], cs[i0 + 1] ?? cs[i0], bi - i0), bu = expoOut(span(u, .5, 1));
    if (bu > 0) { halo(ctx, bx, y0 + 50, 16, .35 * bu, P.halo0, P.core1); ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(bx, y0 + 50, 3.6 * bu, 0, TAU); ctx.fill(); }
  });
}

// ------------------------------------------------------------------------------------------------ cards
function cardBox(ctx, x, y, w, h, col = 'cream') {
  const C = F.colOf(col);
  ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .93); ctx.beginPath(); ctx.roundRect(x, y, w, h, 12); ctx.fill();
  ctx.strokeStyle = rgba(C.line, .55); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = rgba(C.body, .9); ctx.fillRect(x + 14, y, 46, 3);
}
// REAL card (fact before the scenario): rises from its baseline; the REAL stamp lands with a small thump (stampU)
// o: { u, stampU, w, lines: [[text, size, col, u]] }
export function realCard(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const lines = o.lines || [], hgt = 74 + lines.reduce((s, l) => s + l[1] * 1.45, 0) + 18, w = o.w ?? 600, k = expoOut(u), dy = (1 - k) * (hgt + 16);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 30, y - 50, w + 60, hgt + 56); ctx.clip(); ctx.translate(0, dy);
  cardBox(ctx, x, y, w, hgt);
  const su = clamp(o.stampU ?? 1);
  if (su > 0) {   // the stamp: a framed REAL, tilted, scales down onto the card
    const s = 1 + .45 * (1 - expoOut(su)), a = clamp(su * 3);
    ctx.save(); ctx.translate(x + 74, y + 40); ctx.rotate(-.06); ctx.scale(s, s); ctx.globalAlpha *= a;
    ctx.strokeStyle = P.cream; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(-50, -20, 100, 40, 5); ctx.stroke();
    E.glowText(ctx, 'REAL', 0, 9, { size: 24, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .22 });
    ctx.restore();
    if (su < 1) halo(ctx, x + 74, y + 40, 90, .3 * (1 - su), P.halo2, P.cream);
  }
  let yy = y + 74;
  for (const [txt, size, col, lu] of lines) {
    yy += size * 1.45;
    maskLine(ctx, [[txt, 0]], x + 28, yy - size * .3, size, rise(lu ?? 1), { serif: false, weight: 600, col: col ?? P.cream, glow: false });
  }
  ctx.restore();
  return { w, h: hgt };
}
// the pig card with a MIND row (9.11): like the hook's index card, the bead sinks from + toward −
export function mindCard(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const w = 300, h = 150, k = expoOut(u), dy = (1 - k) * (h + 16);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 20, y - 40, w + 40, h + 44); ctx.clip(); ctx.translate(0, dy);
  cardBox(ctx, x, y, w, h);
  ctx.save(); ctx.beginPath(); ctx.arc(x + 44, y + 42, 26, 0, TAU); ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fill(); ctx.clip();
  F.icon(ctx, 'pig', x + 44, y + 44, 24, { col: 'cream', t, base: mixHex(F.CREAM.deep, P.blue1, .3) }); ctx.restore();
  E.glowText(ctx, o.name ?? 'PIG 2', x + 84, y + 40, { size: 26, weight: 600, col: P.cream, glow: false, spacing: .06 });
  E.glowText(ctx, o.sub ?? 'FARM · EUROPE', x + 84, y + 64, { size: 15, weight: 600, col: P.halo2, glow: false, spacing: .12 });
  const ty = y + 100, tx0 = x + 84, tx1 = x + w - 22;
  E.glowText(ctx, 'MIND', x + 18, ty + 6, { size: 14, weight: 600, col: P.halo2, glow: false, spacing: .14 });
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx0, ty); ctx.lineTo(tx1, ty); ctx.stroke();
  E.glowText(ctx, '–', tx0 - 2, ty - 8, { size: 16, weight: 600, col: P.halo2, glow: false }); E.glowText(ctx, '+', tx1 - 8, ty - 8, { size: 16, weight: 600, col: P.halo2, glow: false });
  const m = o.mind ?? .7, bx = lerp(tx0, tx1, (m + 1) / 2), cool = clamp(.6 - m);
  ctx.fillStyle = rgba(mixHex(P.halo2, P.blue0, cool), .55); ctx.fillRect(tx0, ty - 1.5, bx - tx0, 3);   // the filled part of the track
  const bc = mixHex(P.cream, mixHex(P.blue0, P.cream, .45), cool);
  halo(ctx, bx, ty, 30, .35, mixHex(P.halo2, P.blue0, cool), bc); ctx.fillStyle = bc; ctx.beginPath(); ctx.arc(bx, ty, 8, 0, TAU); ctx.fill();
  ctx.restore();
  return { w, h };
}

// ------------------------------------------------------------------------------------------------ small graphics
// a heart with an ear in it (FEELING): warm light shape, the ear engraved; s = height in px
export function heartEar(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (s <= .5 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); const br = 1 + .03 * Math.sin(t * 2.2); ctx.scale(s * br, s * br);
  halo(ctx, 0, .02, 1.5, .4 * (o.glow ?? 1), P.halo1, P.core1);
  const hp = new Path2D(); hp.moveTo(0, .42); hp.bezierCurveTo(-.2, .25, -.55, .05, -.55, -.18); hp.bezierCurveTo(-.55, -.42, -.32, -.52, -.16, -.46);
  hp.bezierCurveTo(-.07, -.42, -.02, -.36, 0, -.3); hp.bezierCurveTo(.02, -.36, .07, -.42, .16, -.46); hp.bezierCurveTo(.32, -.52, .55, -.42, .55, -.18); hp.bezierCurveTo(.55, .05, .2, .25, 0, .42); hp.closePath();
  ctx.fillStyle = lin(ctx, -.5, -.5, .5, .45, [[0, P.core1], [.45, P.halo1], [1, P.shade0]]); ctx.fill(hp);
  ctx.strokeStyle = rgba(P.core0, .7); ctx.lineWidth = .025; ctx.stroke(hp);
  ctx.strokeStyle = rgba(P.shade0, .95); ctx.lineWidth = .055; ctx.lineCap = 'round';   // the ear: an outer curve and the inner curl
  ctx.beginPath(); ctx.moveTo(-.08, .14); ctx.bezierCurveTo(-.2, .04, -.2, -.26, .02, -.28); ctx.bezierCurveTo(.2, -.29, .25, -.08, .12, .02); ctx.bezierCurveTo(.06, .07, .07, .16, .0, .2); ctx.stroke();
  ctx.lineWidth = .04; ctx.beginPath(); ctx.moveTo(-.04, -.06); ctx.bezierCurveTo(-.05, -.17, .1, -.18, .1, -.08); ctx.bezierCurveTo(.1, -.03, .04, -.02, .04, .04); ctx.stroke();
  ctx.restore();
}
// one figure of a grid: head and shoulders, feet at (x, y), height h
export function fig(ctx, x, y, h, col) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - h * .82, h * .17, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - h * .27, y); ctx.lineTo(x - h * .27, y - h * .38); ctx.quadraticCurveTo(x - h * .27, y - h * .6, x, y - h * .6); ctx.quadraticCurveTo(x + h * .27, y - h * .6, x + h * .27, y - h * .38); ctx.lineTo(x + h * .27, y); ctx.closePath(); ctx.fill();
}
// a speech bubble growing out of a point (tail): rounded pill with the text; u 0..1 (grows from the tail), x, y = centre
export function bubble(ctx, t, x, y, text, u, tail, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const size = o.size ?? 26, w = measure(text, size, false) * 1.16 + 56, h = size * 2.1, k = expoOut(u);
  ctx.save(); ctx.translate(lerp(tail[0], x, k), lerp(tail[1], y, k)); ctx.scale(lerp(.2, 1, k), lerp(.2, 1, k));
  const warm = o.warm ?? 0;
  ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .92); ctx.strokeStyle = rgba(mixHex(P.cream, P.halo0, warm), .7); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  const tx = (tail[0] - x) * .25, ty = h / 2;   // the little tail toward the head
  ctx.beginPath(); ctx.moveTo(tx - 12, ty - 2); ctx.lineTo(tx - 4 + (tail[0] - x) * .06, ty + 20); ctx.lineTo(tx + 10, ty - 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(P.cream, P.halo0, warm), .7); ctx.beginPath(); ctx.moveTo(tx - 12, ty); ctx.lineTo(tx - 4 + (tail[0] - x) * .06, ty + 20); ctx.lineTo(tx + 10, ty); ctx.stroke();
  E.glowText(ctx, text, 0, size * .36, { size, weight: 600, align: 'center', col: mixHex(P.cream, P.halo0, warm), glow: false, spacing: .08 });
  ctx.restore();
}
// a line of Inter caps that rises from its baseline (screen layer helper)
export function capsLine(ctx, text, x, y, size, u, o = {}) {
  if (u <= 0) return null;
  return maskLine(ctx, [[text, o.warm ?? 0]], x, y, size, u, { serif: false, weight: 600, col: o.col ?? P.cream, glow: o.glow ?? false, align: o.align });
}

// ------------------------------------------------------------------------------------------------ phone + the clip that grows out of it
// a phone standing upright (portrait), the feed scrolling on its screen. o: { on 0..1 (screen lit), scroll (px), card (the video card
// index in the feed: drawn with the clip frame) } returns the screen rect and the video card rect
export function phone(ctx, t, x, y, w, h, o = {}) {
  const on = clamp(o.on ?? 1);
  ctx.save();
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, w * .16); ctx.fill();
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = Math.max(1, w * .025); ctx.stroke();
  const sx = x - w / 2 + w * .07, sy = y - h / 2 + w * .1, sw = w * .86, sh = h - w * .2;
  ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, w * .09); ctx.save(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, mixHex(P.ind1, P.blue0, .4), on); ctx.fillRect(sx, sy, sw, sh);
  let vid = null;
  if (on > 0) {   // the feed: cards that scroll up, endlessly
    const ch = sh * .36, gap = sh * .06, step = ch + gap, sc = o.scroll ?? 0, first = Math.floor(sc / step) - 1;
    for (let i = first; i < first + 5; i++) {
      const cy = sy + gap + i * step - sc; if (cy > sy + sh || cy + ch < sy) continue;
      if (o.card != null && i === o.card) { vid = { x: sx + sw * .06, y: cy, w: sw * .88, h: ch }; continue; }
      ctx.fillStyle = rgba(mixHex(P.blue2, P.cream, .25), .55 * on); ctx.beginPath(); ctx.roundRect(sx + sw * .06, cy, sw * .88, ch * .72, w * .05); ctx.fill();
      ctx.fillStyle = rgba(P.cream, .35 * on); ctx.fillRect(sx + sw * .06, cy + ch * .8, sw * .6, ch * .07); ctx.fillRect(sx + sw * .06, cy + ch * .92, sw * .38, ch * .06);
    }
  }
  ctx.restore(); ctx.restore();
  if (on > 0) halo(ctx, x, y, h * 1.1, .12 * on, P.blue0, mixHex(P.blue0, P.cream, .5));
  return { screen: { x: sx, y: sy, w: sw, h: sh }, vid };
}
let CLIPCAN = null;
// the clip plate drawn into a rect r (x, y, w, h; screen px, cover-cropped from CLIP_RECT): the phone's video card growing into the plate
export function clipInRect(ctx, t, T, id, r, o = {}) {
  if (!CLIPCAN) CLIPCAN = createCanvas(W, H);   // ONE offscreen canvas for the whole render (no per-frame canvases)
  const R = F.CLIP_RECT, cx = CLIPCAN.getContext('2d');
  cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(R.x - 4, R.y - 4, R.w + 8, R.h + 8);
  F.clipPlate(cx, t, T, id, { morph: 1, credits: false, dark: o.dark ?? 0 });
  const ar = r.w / r.h, ra = R.w / R.h;   // cover-crop the plate into the rect
  let sw = R.w, sh = R.h; if (ar < ra) sw = R.h * ar; else sh = R.w / ar;
  ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, o.rr ?? 10); ctx.clip();
  ctx.drawImage(CLIPCAN, R.x + (R.w - sw) / 2, R.y + (R.h - sh) / 2, sw, sh, r.x, r.y, r.w, r.h); ctx.restore();
  ctx.strokeStyle = F.colOf(F.CLIPS[id].col).core; ctx.lineWidth = o.lw ?? 3; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, o.rr ?? 10); ctx.stroke();
}
export const lerpRect = (a, b, x) => ({ x: lerp(a.x, b.x, x), y: lerp(a.y, b.y, x), w: lerp(a.w, b.w, x), h: lerp(a.h, b.h, x) });

// ------------------------------------------------------------------------------------------------ the strip helpers
// strip shrunk into its own dot (k 0..1: 1 = docked size); used to clear the top edge for a clip's credits
export function stripShrunk(ctx, t, T, k) {
  if (k <= .02) return;
  const D = F.STRIP_DOCK; F.strip(ctx, t, T, { big: 1, at: [D.x, D.y], w: D.w * k, s: k });
}
// the screen position of the strip's TODAY dot for a strip drawn with { big, at, w, s } (mirrors lib/f24_kit.mjs strip)
export function stripToday(T, t, o) {
  const D = F.STRIP_DOCK, eb = sineIO(clamp(o.big ?? 0)), A = o.at ?? [W / 2, H / 2];
  const x = lerp(D.x, A[0], eb), y = lerp(D.y, A[1], eb), w = lerp(D.w, o.w ?? 1100, eb), s = lerp(1, o.s ?? 1.9, eb), ww = w / s;
  const [word] = F.stripWord(t, T), lx0 = -ww / 2 + 22, lx1 = ww / 2 - 22 - measure(word, 34, true) - 14, today = lerp(lx0, lx1, o.today ?? .62);
  return [x + today * s, y, 4.5 * s];
}

// the map view that shows a live medallion (pin lon/lat, zref) with radius r, its head centred at screen (hx, hy)
export function viewForHead(lon, lat, zref, r, hx = W / 2, hy = H / 2) {
  const z = r * zref / F.PIN_R, k = F.kOf({ z }), kk = sineIO(clamp((r - F.RF) / (F.PIN_R - F.RF) * 1.25 - .25));
  const px = hx, py = hy + (F.STALK + r) * kk;
  return F.mapView(lon - (px - W / 2) / k, lat + (py - H / 2) / k, z);
}
// smooth step between two values on [a, b] (sine), for camera-free parameters
export const ramp = (t, a, b, v0 = 0, v1 = 1, e = sineIO) => lerp(v0, v1, e(span(t, a, b)));
export const PIG = F.PIN.pigs, AMBO = F.PIN.amboseli;
export const BARN_MED_P = { u: 965, v: 640, s: 1.5 };   // = F.BARN_MED as glide params
// how far a medallion has opened (0 = pin size, 1 = full frame), from its radius: drives the inner camera during a zoom
export const openOf = (r) => clamp((Math.log(r) - Math.log(F.PIN_R)) / (Math.log(F.RF) - Math.log(F.PIN_R)));
