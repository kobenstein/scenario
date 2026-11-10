// Film 24 · B2 (c05–c08) · shared machinery: the map with ONE medallion zooming (in or out), the HUD (tablet + strip), camera
// helpers (monotone camera spline, bezier eases), a medallion iris without its own ring, text helpers.
// Owned by builder B2. Everything is drawn from (t, T) only: the chunk files sc05–sc08 call the same functions on both sides of a
// chunk boundary, so the last frame of cN and the first frame of cN+1 are the same picture (one continuous take).
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import { NORTH_VIEW, TABLET_AT, NORTH_TABLET, CA_CALLS } from './f24_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn } = E;
const { rise, maskLine, measure } = F;
export { NORTH_VIEW, TABLET_AT, NORTH_TABLET, CA_CALLS };

// ------------------------------------------------------------------------------------------------------------------ eases
// a cubic-bezier ease (x1, y1, x2, y2), solved by bisection (as in sc01)
export function bez(x1, y1, x2, y2) {
  const c = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x) => { if (x <= 0) return 0; if (x >= 1) return 1; let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (c(m, x1, x2) < x) lo = m; else hi = m; } return c((lo + hi) / 2, y1, y2); };
}
export const ZOUT = bez(.55, 0, .25, 1);   // zoom out of a medallion (sc01's hook zoom): slow while big, fast once small, long settle
export const ZIN = bez(.5, 0, .3, 1);      // zoom into a medallion: calm start on the map, long settle while the scene fills the frame
export const FLY = sineIO;
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
export const win = (t, a, b, fa = .5, fb = .5) => rise(span(t, a - fa * .3, a + fa)) * (1 - expoIn(span(t, b, b + fb)));   // rise in, sink out

// ------------------------------------------------------------------------------------------------------------------ camera
// the card camera: a monotone cubic spline through word keys (x, y, log distance) so the camera glides THROUGH its keys (sc01)
export function camSpline(t, K) {
  const F0 = E.F0, n = K.length, V = K.map(([, c]) => [c.x, c.y, Math.log(F0 - c.z)]), T = K.map((k) => k[0]);
  if (n === 1) return E.cam3({ ...K[0][1] });
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: F0 - Math.exp(out[2]) });
}
// camera of a habitat stage: spline + the barn-stage drift (amount ~1.8 as in c01)
export const stageCam = (t, K, amt = 1.6, seed = 0) => E.camDrift(camSpline(t, K), t, amt, seed);

// a map track: [[t0, t1, A, B, ease]] segments (views); between segments the view holds the last B with a slow creep (zoom ×(1+c·dt))
export function track(t, S, creepRate = .012) {
  if (t < S[0][0]) return S[0][2];
  for (let i = 0; i < S.length; i++) {
    const [t0, t1, A, B, e] = S[i];
    if (t < t1) return F.flight(A, B, (e || FLY)(span(t, t0, t1)));
    const nx = S[i + 1];
    if (!nx || t < nx[0]) { const k = 1 + creepRate * (t - t1); return F.mapView(B.lon, B.lat, B.z * k); }
  }
  return S[S.length - 1][3];
}
// the map view that puts a pin's point in the frame centre with its medallion filling the frame, starting from zoom zRef
export const pinR0 = (pid) => F.PIN_R * (F.PIN[pid].kind === 'esp' ? 1.25 : 1);
export const medView = (pid, zRef) => { const p = F.PIN[pid]; return F.mapView(p.lon, p.lat, zRef * F.RF / pinR0(pid)); };
// view with a creep folded in (the B side of a creeping hold continues from it)
export const crept = (v, k) => F.mapView(v.lon, v.lat, v.z * k);

// ------------------------------------------------------------------------------------------------------------------ medallion
// a full-frame scene fn(ctx) seen through a circle (no ring; the caller draws the pin's ring). r ≥ RF at the frame centre = full frame.
export function inMed(ctx, cx, cy, r, fn) {
  if (r <= .5) return;
  const s = r / F.RF;
  if (Math.abs(s - 1) < 1e-6 && Math.abs(cx - W / 2) < .01 && Math.abs(cy - H / 2) < .01) { fn(ctx); return; }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
  E.withOuter({ k: s, e: cx - W / 2 * s, f: cy - H / 2 * s }, () => fn(ctx));
  ctx.restore();
}
export function ring(ctx, cx, cy, r, kind) {
  if (r > F.RF * 1.05) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = kind === 'esp' ? F.GOLD.body : F.CREAM.core;
  ctx.lineWidth = clamp(r * .12, 2, 3.2); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.restore();
}
// the night map at view v with ONE pin's medallion scaled with the map (the world inside and the map outside zoom as one move).
// o: { pid, zRef (the map zoom at which the medallion has its pin size), scene(ctx) (full-frame habitat), calls, dim, pins (extra pins()
//      options), medFrom (r0 multiple from which the scene replaces the icon, default 1) } → { hd, med: { cx, cy, r } }
export function mapMed(ctx, t, T, v, o = {}) {
  const po = { ...(o.pins || {}) };
  let med = null;
  if (o.pid) {
    const p = F.PIN[o.pid], f = p.kind === 'esp' ? 1.25 : 1, r0 = F.PIN_R * f, r = Math.max(r0, r0 * v.z / o.zRef);
    if (r >= F.RF && o.scene) {   // the medallion covers the frame: only the scene
      const [px, py] = F.mapXY(v, p.lon, p.lat);
      inMed(ctx, px, py, r, o.scene); return { hd: {}, med: { cx: px, cy: py, r } };
    }
    const [px, py] = F.mapXY(v, p.lon, p.lat), k = sineIO(clamp((r - F.RF) / (r0 - F.RF) * 1.25 - .25));
    const head = [px, py - (F.STALK + r) * k];
    po.head = { ...(po.head || {}), [o.pid]: head }; po.r = { ...(po.r || {}), [o.pid]: r / f };
    if (o.scene) po.inner = { ...(po.inner || {}), [o.pid]: () => {} };
    med = { cx: head[0], cy: head[1], r, kind: p.kind };
  }
  F.map(ctx, t, v, { calls: o.calls ?? CA_CALLS, dim: o.dim, callA: o.callA });
  const hd = F.pins(ctx, t, T, v, po);
  if (med && o.scene && hd[o.pid]) { const [cx, cy, rr] = hd[o.pid]; inMed(ctx, cx, cy, rr - 1, o.scene); ring(ctx, cx, cy, rr, med.kind); med = { cx, cy, r: rr, kind: med.kind }; }
  return { hd, med };
}

// ------------------------------------------------------------------------------------------------------------------ HUD
// the tablet docked lower left during the tour (c04–c06; plateNorth's place), o: { x, y, s, u, pulse: { id: 0..1 } }
export function hudTablet(ctx, t, T, o = {}) {
  const x = o.x ?? TABLET_AT.x, y = o.y ?? TABLET_AT.y, s = o.s ?? TABLET_AT.s;
  ctx.save();   // (no setTransform: callers may wrap it in a sink)
  const r = F.tablet(ctx, t, T, x, y, s, { filled: NORTH_TABLET, u: o.u ?? 1, at: o.at ?? tabAt(T) });
  ctx.restore();
  return r;
}
// screen point of a tablet slot (SLOTS grid of the kit: gx 286, gy 92; ids in TABLET order)
const SLOT_GRID = { names: [-1, -1], room: [0, -1], context: [1, -1], feel: [-1, 0], parts: [1, 0], next: [-.5, 1], there: [.5, 1], mid: [0, 0] };
export function slotXY(id, o = {}) { const x = o.x ?? TABLET_AT.x, y = o.y ?? TABLET_AT.y, s = o.s ?? TABLET_AT.s, [c, r] = SLOT_GRID[id]; return [x + c * 286 * s, y + r * 92 * s]; }
export const slotAt = (T, id) => { const sp = F.TABLET.find((q) => q.id === id); for (const ph of sp.at) if (T.gHas(ph)) return T.G(ph); return null; };

// ------------------------------------------------------------------------------------------------------------------ text
// a caps label (Inter) rising from its baseline: u 0..1
export function caps(ctx, s, x, y, size, u, o = {}) {
  if (u <= 0) return null;
  return maskLine(ctx, [[s, o.warm ?? 0]], x, y, size, u, { serif: false, weight: o.weight ?? 600, col: o.col ?? P.cream, glow: o.glow ?? false, align: o.align });
}
export function serif(ctx, s, x, y, size, u, o = {}) {
  if (u <= 0) return null;
  return maskLine(ctx, [[s, o.warm ?? 0]], x, y, size, u, { serif: true, col: o.col ?? P.cream, glow: o.glow ?? true, align: o.align });
}
export const fmt = (n) => Math.round(n).toLocaleString('en-US');
export { measure };

// an exit that sinks back into its baseline: everything fn draws is clipped above baseY and pushed down by k·depth (k 0..1, expoIn)
export function sink(ctx, baseY, k, depth, fn) {
  if (k >= 1) return;
  if (k <= 0) { fn(); return; }
  ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 12000, baseY + 4000); ctx.clip(); ctx.translate(0, expoIn(k) * depth); fn(); ctx.restore();
}
// a bead of light flying along an arc (screen px): from p0 to p1, u 0..1; col 'gold' | 'cream' | 'cool'
export function bead(ctx, p0, p1, u, col = 'cream', lift = 160) {
  if (u <= 0 || u >= 1) return;
  const q = sineIO(u), cx = lerp(p0[0], p1[0], .45), cy = Math.min(p0[1], p1[1]) - lift;
  const x = (1 - q) ** 2 * p0[0] + 2 * (1 - q) * q * cx + q * q * p1[0], y = (1 - q) ** 2 * p0[1] + 2 * (1 - q) * q * cy + q * q * p1[1];
  const C = col === 'gold' ? F.GOLD : col === 'cool' ? { body: P.blue0, core: mixHex(P.blue0, P.cream, .45) } : F.CREAM;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  E.halo(ctx, x, y, 46, .5, C.body, C.core); ctx.fillStyle = C.core; ctx.beginPath(); ctx.arc(x, y, 9 * (1 - .35 * q), 0, 7); ctx.fill();
  ctx.restore();
}
// B2's engraving times (a bead of light arrives, then the slot engraves); the other slots keep the kit's phrases
export function tabAt(T) {
  const G = (p, after = 0) => T.G(p, 0, after);
  const piece = G('So one piece is already in place'), gm = G("Google's model is built for dolphins"), there = G('So the meaning is there');
  return { feel: piece + .2, next: G('dolphins', gm) + .85, there: there + .2 };
}

// ------------------------------------------------------------------------------------------------------------------ clips
// the clip credits in one left-aligned line above CLIP_RECT (the kit's right-aligned ORIGINAL FOOTAGE would sit under the docked
// strip): Name (serif) · ROLE · YEAR · ORIGINAL FOOTAGE (Inter caps). Same timing as the kit's credits.
export function credits(ctx, t, T, id, m = 1) {
  const R = F.CLIP_RECT, win = F.clipWin(T, id), info = F.CLIPS[id]; if (!win) return;
  const lu = span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)) * span(m, .85, 1); if (lu <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const by = R.y - 26, nw = maskLine(ctx, [[info.name, info.col === 'gold' ? 1 : 0]], R.x, by, 40, rise(lu), { glow: true });
  const rl = `${info.role.toUpperCase()} · ${info.year}`;
  maskLine(ctx, [[rl, 0]], R.x + nw.w + 22, by - 2, 20, rise(lu), { serif: false, col: P.halo2, glow: false });
  maskLine(ctx, [['ORIGINAL FOOTAGE', 0]], R.x + nw.w + 22 + measure(rl, 20, false) + 26, by - 2, 20, rise(lu), { serif: false, col: P.halo0, glow: false });
  ctx.restore();
}
// a round medallion (centre M, radius RM) that grows into the clip rect and back (m 0..1), with a full-frame scene fn(ctx) inside
export function plateMorph(ctx, m, M, RM, fn, kind = 'other') {
  const R = F.CLIP_RECT, mm = sineIO(m), cx = lerp(M[0], R.x + R.w / 2, mm), cy = lerp(M[1], R.y + R.h / 2, mm), w = lerp(RM * 2, R.w, mm), h = lerp(RM * 2, R.h, mm), rr = lerp(RM, 14, mm);
  const s = lerp(RM / F.RF, Math.max(R.w / W, R.h / H), mm);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); ctx.clip();
  ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2); E.withOuter({ k: s, e: cx - W / 2 * s, f: cy - H / 2 * s }, () => fn(ctx)); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = kind === 'esp' ? F.GOLD.body : F.CREAM.core; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); ctx.stroke(); ctx.restore();
}
// the view that puts pin pid's medallion of radius RM (scaled with the map from PIN size at zoom zRef) with its centre at screen M
export function medViewAt(pid, zRef, RM, M) {
  const p = F.PIN[pid], r0 = pinR0(pid), z = zRef * RM / r0, km = z * W / 360, k = sineIO(clamp((RM - F.RF) / (r0 - F.RF) * 1.25 - .25)), off = (F.STALK + RM) * k;
  return F.mapView(p.lon - (M[0] - W / 2) / km, p.lat + (M[1] + off - H / 2) / km, z);
}
// screen point of a design point (u, v) on card Z seen by camera c inside a medallion (cx, cy, r)
export function medPoint(c, Z, u, v, cx, cy, r) {
  const p = E.project(c, Z, u, v); if (!p) return [cx, cy]; const s = r / F.RF;
  return [cx + (p[0] - W / 2) * s, cy + (p[1] - H / 2) * s];
}
