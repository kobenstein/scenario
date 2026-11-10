// Film 25 · builder B1 (c02–c04) · own helpers (the shared kit stays untouched; gaps are listed as kit wishes in the report).
//
//   THE RANK ROW IN DEPTH. S.rankRow draws the rank row with F.sky / F.plain, whose horizon and star cards are fixed in Z: a camera
//   that flies along the row to a far stone (No. 10 sits at Z 32 700) passes them and the horizon jumps. rankWorld() draws the same
//   picture (identical while the camera stays near home, c.z ≤ 1000) with sky cards that keep their distance ahead of a deep camera.
//   STONE FIELDS. field(n) = a local frame on the card of rank stone No. n: origin = its pivot (bottom-left front corner), 1 local unit
//   = 1 world unit (the stone is 478 tall, 139 wide in every field), so close-ups of No. 10, 9, 8 … look the same. fieldCam() aims.
//   WINDOWS (fly-in into a scene). A scene behind a lit window is a SUB-WORLD: an exact translated copy of the standard card stage whose
//   home camera is `home` (a world camera just in front of the window). Drawn with the local camera c − home, clipped to the window
//   (in the window's own card transform) while the window is in front of the camera; once the camera passes the window plane the
//   scene fills the frame. No cut, no blend: one continuous dolly.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f25_kit.mjs';
import * as S from './f25_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, rad, lin } = E;
const F0 = E.F0;
export const RK = S.RANKROW.stones;              // index i = No. (i + 1)
export const stoneOf = (n) => RK[n - 1];

// ------------------------------------------------------------------------------------------------ camera helpers
// camPath with a free depth reference: z is interpolated in log(ref − z) (F.camPath uses ref = F0, which breaks for z > F0)
export function camPathZ(t, K, ref = F0) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(Math.max(1, ref - c.z))]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: ref - Math.exp(out[2]) });
}
export const cAdd = (c, o) => ({ ...c, x: c.x + o.x, y: c.y + o.y, z: c.z + o.z });
export const cSub = (c, o) => ({ ...c, x: c.x - o.x, y: c.y - o.y, z: c.z - o.z });
// pick the active segment: segs = [[tStart, fn(t) → cam]] in time order
export function segCam(t, segs) { let f = segs[0][1]; for (const [ts, fn] of segs) if (t >= ts) f = fn; return f(t); }

// ------------------------------------------------------------------------------------------------ stone fields
export function field(n) { const s = stoneOf(n); return { Z: s.Z, x: s.x, y: s.y, sc: s.s, n }; }
export const fieldCam = (fd, u, v, s, sx = W / 2, sy = H / 2) => E.aim(fd.Z, fd.x + u * fd.sc, fd.y + v * fd.sc, s / fd.sc, sx, sy);
export function fieldCard(ctx, c, fd, fn) { return E.card(ctx, c, fd.Z, () => { ctx.translate(fd.x, fd.y); ctx.scale(fd.sc, fd.sc); fn(); }); }
// screen point of a field point (null if behind)
export function fieldPt(c, fd, u, v) { return E.project(c, fd.Z, fd.x + u * fd.sc, fd.y + v * fd.sc); }
export const STONE_H = 478, STONE_W = 478 * .29;   // a rank stone (No. 2 … 10) in its own field

// ------------------------------------------------------------------------------------------------ falls
const ALPHA = (Math.PI / 2) * 2 / (1.1 * Math.sqrt(STONE_H / 690)) ** 2;   // same gravity as F.cascade, for the stone's real size
// a rank stone falling from rest at t0 (with a small rock back before) to `lie`; clack + tiny bounce on landing
export function fallAngle(t, t0, lie = Math.PI / 2 - .015, o = {}) {
  const ant = o.ant ?? .4;
  let a = 0;
  if (t > t0) { const dt = t - t0, th = Math.sqrt(2 * lie / ALPHA); a = Math.min(lie, .5 * ALPHA * dt * dt); if (dt > th) a -= .03 * Math.exp(-(dt - th) * 9) * Math.sin((dt - th) * 30); }
  else if (ant > 0) { const u = span(t, t0 - ant, t0); if (u > 0 && u < 1) a -= .035 * Math.sin(Math.PI * u); }
  return a;
}
export const fallHit = (t0, lie = Math.PI / 2 - .015) => t0 + Math.sqrt(2 * lie / ALPHA);
// the c02 → c03 match: the ANIMATION header slab stands up and leans like a domino; at the cut it leans LEAN0 and keeps falling.
// lean(t): t < tc: LEAN0 · ((t − tL) / (tc − tL))² · after: LEAN0 + ω0 · dt + ½ α dt² (gravity), until it lies.
export const LEAN0 = .26;
export function leanAngle(t, tL, tc, lie = Math.PI / 2 - .015) {
  if (t < tL) return 0;
  if (t < tc) return LEAN0 * ((t - tL) / (tc - tL)) ** 2;
  const w0 = 2 * LEAN0 / (tc - tL), dt = t - tc;
  // time to land: solve LEAN0 + w0 dt + ½ α dt² = lie
  const th = (-w0 + Math.sqrt(w0 * w0 + 2 * ALPHA * (lie - LEAN0))) / ALPHA;
  let a = Math.min(lie, LEAN0 + w0 * dt + .5 * ALPHA * dt * dt);
  if (dt > th) a -= .03 * Math.exp(-(dt - th) * 9) * Math.sin((dt - th) * 30);
  return a;
}
export const leanHit = (tL, tc, lie = Math.PI / 2 - .015) => { const w0 = 2 * LEAN0 / (tc - tL); return tc + (-w0 + Math.sqrt(w0 * w0 + 2 * ALPHA * (lie - LEAN0))) / ALPHA; };

// ------------------------------------------------------------------------------------------------ the rank world (depth-safe)
const deep = (c) => Math.max(0, c.z - 1000);
// sky like F.sky, but its cards keep their distance ahead of a deep camera. o { glow, cs (camera for the sky, e.g. a blend), stars }
export function rankSky(ctx, c, t, o = {}) {
  const cs = o.cs || c, dz = deep(cs);
  const hy = (E.project(cs, F.Z_HOR + dz, 0, F.HOR) || [0, H * .75])[1];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, hy - 1100, 0, hy, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue0, .35)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, cs, F.Z_SKY + dz, () => E.stars(ctx, 25, 900, t, [-6000, -5200, 16000, 6200], o.stars ?? 1));
  const g = o.glow === undefined ? S.SKY_GLOW : o.glow;
  if (g) E.card(ctx, cs, F0 * 2.2 + dz, () => halo(ctx, g[0], g[1], g[2], .32, P.blue0, mixHex(P.blue0, P.halo2, .35)));
  return hy;
}
export function rankPlain(ctx, c) {
  const hy = (E.project(c, F.Z_HOR + deep(c), 0, F.HOR) || [0, H * .75])[1];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, hy, 0, Math.max(hy + 10, H), [[0, mixHex(P.night1, P.ind0, .5)], [.25, P.night1], [1, P.night0]]); ctx.fillRect(0, hy, W, H - hy + 2);
  ctx.strokeStyle = rgba(P.blue0, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(W, hy); ctx.stroke();
  ctx.fillStyle = lin(ctx, 0, hy - 30, 0, hy + 4, [[0, rgba(P.blue0, 0)], [1, rgba(P.blue0, .22)]]); ctx.fillRect(0, hy - 30, W, 34);
  ctx.restore();
  return hy;
}
// the rank row (rank coordinates, camera c). o { fall(n) → angle, gold (No. 1), each(n) → extra stone options, after(n, ctx, k)
//   (drawn on the stone's card right after it, in its field frame: local units, origin at the pivot), sky: { cs, glow }, hide(n) }
export function rankWorld(ctx, c, t, o = {}) {
  rankSky(ctx, c, t, o.sky || {}); rankPlain(ctx, c);
  for (let i = RK.length - 1; i >= 0; i--) {
    const s = RK[i], n = i + 1, ang = o.fall ? o.fall(n) : S.rankLie(n);
    if (o.hide && o.hide(n)) continue;
    const ex = { ...(i === 0 ? { gold: o.gold ?? 1, glyph: null, num: 1 } : { num: n, dark: ang > 1 ? .3 : 0 }), ...(o.each ? o.each(n) || {} : {}) };
    E.card(ctx, c, s.Z, () => {
      if (ang < 1.2) {   // the long soft shadow away from the light (as F.drawRow)
        const L = [RK[0].x - 300, RK[0].y], dirx = s.x - L[0] > 0 ? 1 : -1, len = s.h * (1.1 - ang * .6) * (ex.gold ? 0 : 1);
        if (len > 4) { ctx.fillStyle = lin(ctx, s.x, s.y, s.x + dirx * len, s.y + len * .18, [[0, rgba(P.night0, .55)], [1, rgba(P.night0, 0)]]);
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + s.w, s.y); ctx.lineTo(s.x + s.w + dirx * len, s.y + len * .2); ctx.lineTo(s.x + dirx * len * .9, s.y + len * .26); ctx.closePath(); ctx.fill(); }
      }
      F.stone(ctx, t, s.x, s.y, s.h, { w: s.w, fall: ang, glyph: s.glyph, rim: 1 - .6 * clamp(ang), ...ex });
      if (o.after) { ctx.save(); ctx.translate(s.x, s.y); ctx.scale(s.s, s.s); o.after(n, ang); ctx.restore(); }
    });
  }
}
// is a field card in front of the camera (not passed)?
export const inFront = (c, fd) => fd.Z - c.z >= 30;

// ------------------------------------------------------------------------------------------------ on the face of a stone (field frame)
// map a point given in the stone's own frame (u across the face 0..w, v up the face 0..−h) to the field frame for angle ang
export const facePt = (ang, u, v) => [u * Math.cos(ang) + v * Math.sin(ang), -u * Math.sin(ang) + v * Math.cos(ang)];
// upright task glyphs along the face of a (lying) stone: list [[name, along 0..1 (bottom → top of the stone), lit 0..1, col]]
export function faceGlyphs(ctx, t, ang, list, o = {}) {
  const w = o.w ?? STONE_W, h = o.h ?? STONE_H, s = o.size ?? 74;
  for (const [name, along, lit, col, a] of list) {
    if ((a ?? 1) <= 0) continue;
    const [x, y] = facePt(ang, w * .5, -h * along);
    F.glyph(ctx, name, x, y, s * (a ?? 1), { lit, col, glow: .6 + lit * .6, a: a ?? 1 });
  }
}
// the window cut into a stone face (stone frame, then rotated): returns a Path2D in the field frame. inset in local units
export function faceWindow(ang, o = {}) {
  const w = o.w ?? STONE_W, h = o.h ?? STONE_H, ix = o.ix ?? 14, iy = o.iy ?? 26, r = o.r ?? 6;
  const p0 = new Path2D(); p0.roundRect(ix, -h + iy, w - 2 * ix, h - 2 * iy, r);
  const p = new Path2D(); p.addPath(p0, { a: Math.cos(ang), b: -Math.sin(ang), c: Math.sin(ang), d: Math.cos(ang), e: 0, f: 0 }); return p;
}
// a lit window (warm light filling the cut, growing from its centre line). u 0..1, glow 0..1
export function litWindow(ctx, path, cx, cy, rr, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.clip(path);
  ctx.fillStyle = rad(ctx, cx, cy, rr, [[0, rgba(P.core0, .95 * u)], [.45, rgba(P.halo0, .85 * u)], [1, rgba(P.shade0, .7 * u)]]); ctx.fillRect(cx - rr * 2, cy - rr * 2, rr * 4, rr * 4);
  ctx.restore();
  halo(ctx, cx, cy, rr * 1.6, .35 * u * (o.glow ?? 1), P.halo1, P.halo0);
}
// a sub-world (scene behind a window): home = the world camera at which the scene shows its design layout exactly.
export const local = (c, home) => cSub(c, home);
// the window's clip path drawn inside the current transform (call from an `after` hook), then the scene with the local camera
export function throughWindow(ctx, path, scene, cl, t) {
  ctx.save(); ctx.clip(path); const m = ctx.getTransform(); scene(ctx, cl, t); ctx.setTransform(m); ctx.restore();
}

// ------------------------------------------------------------------------------------------------ small things
export const rise = F.rise;
// a sink-out multiplier: 1 until t1, falls with expoIn over d
export const sink = (t, t1, d = .5) => 1 - expoIn(span(t, t1, t1 + d));
// mini stone (for counters / rows): pivot bottom-left, h, o { a (0..1 rise from below), warm 0..1 (rim + halo), gold, fall, glyph, could }
export function mini(ctx, t, x, y, h, o = {}) {
  const e = o.a ?? 1, w = h * .3;
  const could = clamp(o.could ?? 0);
  if (could > 0) { ctx.save(); ctx.strokeStyle = rgba(F.COOL.body, .85 * could); ctx.lineWidth = Math.max(2, h * .022); ctx.setLineDash([h * .055, h * .045]); ctx.lineDashOffset = -t * 8;
    ctx.beginPath(); ctx.roundRect(x - h * .06, y - h * 1.06, w + h * .12, h * 1.12, h * .05); ctx.stroke(); ctx.restore(); halo(ctx, x + w / 2, y - h / 2, h * .8, .1 * could, F.COOL.halo, F.COOL.body); }
  if (e <= 0) return;
  if ((o.warm ?? 0) > 0) halo(ctx, x + w / 2, y - h * .5, h * .9, .22 * o.warm * e, P.halo1, P.halo0);
  ctx.save(); ctx.beginPath(); ctx.rect(x - h * 2, y - h * 3, h * 5, h * 3 + 2); ctx.clip();   // rises out of its baseline
  ctx.translate(0, (1 - expoOut(e)) * h * 1.05);
  F.stone(ctx, t, x, y, h, { w, d: h * .1, fall: o.fall ?? 0, gold: o.gold ?? 0, glyph: o.glyph, glyphA: .85, glyphWarm: o.glyphWarm ?? 0, rim: .6 + .4 * (o.warm ?? 0) });
  if ((o.warm ?? 0) > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, .55 * o.warm); ctx.lineWidth = h * .03; ctx.beginPath(); ctx.rect(x, y - h, w, h); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
// a dashed cool gap outline (a slot where a stone should be): pulse 0..1
export function gapSlot(ctx, t, x, y, h, a = 1, pulse = 0) {
  if (a <= 0) return;
  const w = h * .3;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba(F.COOL.body, .7 + .3 * pulse); ctx.lineWidth = Math.max(2, h * .022); ctx.setLineDash([h * .055, h * .045]); ctx.lineDashOffset = -t * 8;
  ctx.beginPath(); ctx.roundRect(x, y - h, w, h, h * .04); ctx.stroke(); ctx.restore();
  if (pulse > 0) halo(ctx, x + w / 2, y - h / 2, h * .9, .25 * pulse * a, F.COOL.halo, F.COOL.body);
}
// text in screen space helpers
export function capsLine(ctx, txt, x, y, size, u, o = {}) {
  if (u <= 0) return null;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const r = F.maskLine(ctx, [[txt, o.warm ?? 0]], x, y, size, u, { serif: false, weight: 600, col: o.col ?? P.cream, glow: false, align: o.align });
  ctx.restore(); return r;
}
// a source line sinking/rising (kit F.source), re-exported for one import
export const source = F.source;

// a camera path for deep moves: every key is converted to an aim (u, v, s) on ONE reference card Z (the card the move is about);
// u, v and log s glide through the keys (monotone cubic). The target stays on its screen line, nothing drifts out of frame mid-flight.
export function camAimPath(t, K, Z) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => { const s = Z / Math.max(1, Z - c.z); return [c.x * F0 / Z + W / 2, c.y * F0 / Z + H / 2, Math.log(s)]; }), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.aim(Z, out[0], out[1], Math.exp(out[2]));
}
// right-aligned caps label (maskLine only centres): x = right edge
export function rightLine(ctx, segs, x, y, size, u, o = {}) {
  const w = segs.reduce((s, [txt]) => s + F.measure(txt, size, o.serif ?? false, o.weight ?? 600), 0);
  return F.maskLine(ctx, segs, x - w, y, size, u, { serif: false, weight: 600, glow: false, ...o });
}
// a zoom-to-point path: P = [u, v] a design point on card Z (e.g. a stone's face). For every key the magnification s (on card Z) and
// the screen position of P are computed; log s and the screen position glide through the keys, the camera is solved back. P stays
// where it should be on screen through the whole dolly, however deep (camAimPath slides it off frame when the zoom is large).
export function camFocusPath(t, K, Z, Pt) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => { const s = Z / Math.max(1, Z - c.z), cu = c.x * F0 / Z + W / 2, cv = c.y * F0 / Z + H / 2; return [W / 2 + (Pt[0] - cu) * s, H / 2 + (Pt[1] - cv) * s, Math.log(s)]; });
  const T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  const s = Math.exp(out[2]);
  return E.aim(Z, Pt[0], Pt[1], s, out[0], out[1]);
}
