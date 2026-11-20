// Film 10 · builder B3 (c08–c12) · shared drawing pieces on top of the Editorial kit (lib/f10_editorial.mjs, unchanged).
//   morning sky + sun, the explainer field ("light on night") with an iris that grows out of an object, text written from the
//   baseline, tags (dot + leader + words), the co-op share ring, flow nodes + links with beads, raised palms, people in indigo
//   (standing, seated, phone, headset), the hall (K3 layout, as c01), houses and windows. Everything is a pure function of t.
// Rules kept: no canvas / pattern per frame, no Math.random, one hero light per picture, gold = human/learned, cyan = machine/data.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
export { E };
export const { W, H, P, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, glowFill, trail, catmull, dust } = E;

// ---------- extra colours (morning + data), all derived from the style palette ----------
export const M = {
  cyan: '#8fe6ff', cyanD: '#3f8fb0', data: '#bfeeff',                    // machine / data (sparingly)
  dawnLow: '#c79a6a', dawnRose: '#8e6f86', dawnBlue: '#3a4f96',          // morning horizon (warm band under the indigo)
  leaf0: '#1d3a46', leaf1: '#2f5a52', leafLit: '#8fae6a',                // plants: dark teal silhouettes, gold-green rim
  field0: '#0d1a4e', field1: '#0a1334', ink: '#060818',
};

// ---------- timing: anchor on words (approximate second only disambiguates repeated words) ----------
export function wordAt(T) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
  return (w, approx, end = false) => {
    let best = null;
    for (const x of T.words) { if (norm(x.w).startsWith(norm(w)) && Math.abs(x.s - approx) < 2.5 && (!best || Math.abs(x.s - approx) < Math.abs(best.s - approx))) best = x; }
    if (!best) { console.warn(`[b3] word "${w}" near ${approx} not found`); return approx; }
    return end ? best.e : best.s;
  };
}

// ---------- 2D view for explainer space (log-interpolated zoom) ----------
// v = { s, x, y }: design point (x,y) sits at the screen centre, magnified s×.
export function viewAt(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = K[i][1], b = K[i + 1][1], e = { s: sineIO, q: quartIO, i: expoIn, o: expoOut }[K[i + 1][2] || 's'];
  const u = e((t - K[i][0]) / (K[i + 1][0] - K[i][0]));
  // keep the zoom feeling constant in log space; positions follow the screen motion (lerp in screen-scaled units)
  const s = Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)), an = K[i + 1][3];
  if (an) {   // keep the anchor point's SCREEN position on a straight eased path (no drifting to a corner while zooming)
    const pa = [W / 2 + (an[0] - a.x) * a.s, H / 2 + (an[1] - a.y) * a.s], pb = [W / 2 + (an[0] - b.x) * b.s, H / 2 + (an[1] - b.y) * b.s];
    const px = lerp(pa[0], pb[0], u), py = lerp(pa[1], pb[1], u);
    return { s, x: an[0] - (px - W / 2) / s, y: an[1] - (py - H / 2) / s };
  }
  return { s, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) };
}
export const vDrift = (v, t, amt = 1, seed = 0) => ({ s: v.s * (1 + E.drift(t, .006 * amt, seed + 5)), x: v.x + E.drift(t, 4 * amt, seed) / v.s, y: v.y + E.drift(t, 3 * amt, seed + 2) / v.s });
export function applyView(ctx, v) { ctx.translate(W / 2, H / 2); ctx.scale(v.s, v.s); ctx.translate(-v.x, -v.y); }
// view that puts design point (u,v) at screen (sx,sy) with scale s
export const viewPut = (u, v, sx, sy, s) => ({ s, x: u - (sx - W / 2) / s, y: v - (sy - H / 2) / s });
export const viewToScreen = (v, x, y) => [W / 2 + (x - v.x) * v.s, H / 2 + (y - v.y) * v.s];

// ---------- the explainer field: deep night, a little lift in the middle (screen space, stable while an iris grows) ----------
export function fieldFill(ctx, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = rad(ctx, W * (o.cx ?? .5), H * (o.cy ?? .42), W * .78, [[0, o.c0 ?? '#13236a'], [.45, o.c1 ?? M.field0], [1, o.c2 ?? P.night0]]);
  ctx.fillRect(0, 0, W, H);
  if (o.stars !== false) E.stars(ctx, 31, 90, o.t ?? 0, [0, 0, W, H], .35);
  ctx.restore();
}
// iris out of an object: (x,y) in SCREEN px, r screen radius. Draws the field inside, then fn() (clipped). Rim of light on the edge.
export function iris(ctx, x, y, r, fn, o = {}) {
  if (r <= 0) return;
  const full = r > Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 4;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (!full) {
    const p = new Path2D(); p.arc(x, y, r, 0, Math.PI * 2);
    const ra = 1 - smooth(span(r, W * .25, W * .9));
    if (ra > 0) glowFill(ctx, p, Math.max(8, r * .25), .45 * ra, P.blue0);
    ctx.clip(p);
  }
  fieldFill(ctx, { ...o, t: o.t });
  ctx.restore();
  ctx.save(); if (!full) { ctx.setTransform(1, 0, 0, 1, 0, 0); const p = new Path2D(); p.arc(x, y, r, 0, Math.PI * 2); ctx.clip(p); }
  fn(); ctx.restore();
  if (!full) {   // warm rim, fades as the iris passes the frame
    const ra = 1 - smooth(span(r, W * .2, W * .85));
    if (ra > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(P.halo0, .85 * ra); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(10px)'; ctx.strokeStyle = rgba(P.halo1, .35 * ra); ctx.lineWidth = 10; ctx.stroke(); ctx.restore(); }
  }
}
// the reverse: the world grows out of a point inside the field (field outside, world inside the circle)
export function irisWorld(ctx, x, y, r, worldFn, fieldFn, o = {}) {
  const full = r > Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 4;
  if (full) { worldFn(); return; }
  fieldFill(ctx, o); ctx.save(); fieldFn && fieldFn(); ctx.restore();
  if (r <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const p = new Path2D(); p.arc(x, y, r, 0, Math.PI * 2); ctx.clip(p); worldFn(); ctx.restore();
  const ra = 1 - smooth(span(r, W * .2, W * .85));
  if (ra > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(P.halo0, .8 * ra); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
}
// iris radius from a 0..1 progress: starts as the object's size, ends past the frame corner (expo out)
// (the opened AREA grows with a sine ease: fast while small, never more than ~1/20 of the frame per frame → no lurch)
// p > 1 starts the opening gentler (the radius does not jump in the first frames)
export const irisR = (u, r0, x, y, p = 1) => { const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 40; return Math.sqrt(lerp(r0 * r0, R * R, sineIO(u / .75) ** p)); };   // done at 3/4 of the slot: fewer frames in motion

// ---------- type ----------
export const SZ = { hero: 168, num: 132, mid: 84, word: 64, label: 40, small: 34, src: 26 };
// text written from its baseline (mask reveal), then still. u 0..1
export function write(ctx, s, x, y, u, o = {}) {
  if (u <= 0 || (o.a ?? 1) <= .003) return;
  const size = o.size ?? SZ.label, e = expoOut(clamp(u)), serif = !!o.serif;
  ctx.save(); ctx.beginPath(); ctx.rect(-1e5, y - size * 2.4, 2e5, size * 2.4 + size * .34); ctx.clip();
  E.glowText(ctx, serif ? s : s.toUpperCase(), x, y + (1 - e) * size * 1.25, { size, serif, align: o.align ?? 'center', col: o.col ?? P.cream, a: o.a ?? 1, spacing: o.spacing ?? (serif ? 0 : .18), glow: o.glow, weight: o.weight });
  ctx.restore();
}
// tag: a dot of light on the thing, a leader line, words at its end (no box). o { dx, dy, label, sub, align }
export function tag(ctx, x, y, u, o = {}) {
  if (u <= 0) return;
  const dx = o.dx ?? 0, dy = o.dy ?? -80, lu = expoOut(span(u, 0, .45)), ex = x + dx * lu, ey = y + dy * lu;
  halo(ctx, x, y, 22, .5 * smooth(span(u, 0, .2)), P.halo1, P.halo0);
  ctx.save(); ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.halo0, .85); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
  const al = o.align ?? (dx > 0 ? 'left' : dx < 0 ? 'right' : 'center'), tx = x + dx + (al === 'left' ? 14 : al === 'right' ? -14 : 0), ty = y + dy + (dy < 0 ? -14 : 44);
  if (o.label) write(ctx, o.label, tx, ty, span(u, .3, 1), { size: o.size ?? SZ.label, align: al, col: o.col });
  if (o.sub) write(ctx, o.sub, tx, ty + (o.size ?? SZ.label) * .5 + (o.subSize ?? 34) * (dy < 0 ? 1 : 1), span(u, .45, 1), { size: o.subSize ?? SZ.src, align: al, col: P.halo2, glow: false });
}

// ---------- the co-op share ring (T2): n equal shares of light, dark joints, one may glow brighter ----------
// o { n (may be fractional while a share joins), u grow 0..1, hi index, hk 0..1, a, dotted (an idea, not yet real), palms 0..1 }
export function shares(ctx, x, y, r, t, o = {}) {
  const n = o.n ?? 12, u = o.u ?? 1, a = o.a ?? 1, N = Math.ceil(n - 1e-6), br = 1 + .012 * Math.sin(t * 1.1);
  if (u <= 0 || a <= 0) return;
  r *= br;
  if (o.dotted) {   // an idea, not yet real: dotted outline and dotted joints
    ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([3, 13]); ctx.lineCap = 'round'; ctx.strokeStyle = P.halo0; ctx.lineWidth = Math.max(2.5, r * .022);
    ctx.shadowColor = rgba(P.halo0, .7); ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + 6.283 * expoOut(u)); ctx.stroke();
    for (let i = 0; i < N; i++) { const q = -Math.PI / 2 + i / n * 6.283, k = expoOut(span(u, .3 + i / N * .4, .6 + i / N * .4)); if (k <= 0) continue; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(q) * r * k, y + Math.sin(q) * r * k); ctx.stroke(); }
    ctx.restore(); return;
  }
  const step = 6.283 / n;
  const wedge = (i, rr, push) => {
    const a0 = -Math.PI / 2 + i * step, a1 = a0 + Math.min(step, 6.283 - i * step), am = (a0 + a1) / 2;
    const px = x + Math.cos(am) * push, py = y + Math.sin(am) * push, p = new Path2D(); p.moveTo(px, py); p.arc(px, py, rr, a0, a1); p.closePath(); return p;
  };
  let body = null; const ks = [];
  for (let i = 0; i < N; i++) {
    const k = expoOut(span(u, i / (N + 5), (i + 6) / (N + 5))); ks.push(k); if (k <= .002) continue;
    const p = wedge(i, r * k, 0); body = body ? body.op(p, PathOp.Union) : p;
  }
  if (!body) return;
  E.lightShape(ctx, body, t, { lit: 1, a, seed: o.seed ?? 21, dust: o.dust ?? 1, cy: 0, glow: o.glow ?? 1 });
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = rgba(P.shade0, .95); ctx.lineWidth = Math.max(2, r * .018); ctx.lineCap = 'round';
  for (let i = 0; i < N; i++) { if (ks[i] <= .002) continue; const q = -Math.PI / 2 + i * step; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(q) * r * ks[i], y + Math.sin(q) * r * ks[i]); ctx.stroke(); }
  const ru = expoOut(span(u, .1, .9));
  ctx.strokeStyle = rgba(P.core1, .9); ctx.lineWidth = Math.max(1.5, r * .012); ctx.beginPath(); ctx.arc(x, y, r * 1.03, -Math.PI / 2, -Math.PI / 2 + 6.283 * ru); ctx.stroke();
  ctx.restore();
  // her / your share: brighter, nudged outward
  if (o.hi != null && (o.hk ?? 0) > 0 && ks[o.hi] > 0) {
    const hk = o.hk, p = wedge(o.hi, r * ks[o.hi] * (1 + .06 * hk), r * .09 * hk);
    glowFill(ctx, p, r * .3, .9 * hk * a, P.halo0); glowFill(ctx, p, r * .08, .8 * hk * a, P.core1);
    ctx.save(); ctx.globalAlpha = a * hk; ctx.fillStyle = rad(ctx, x, y, r * 1.1, [[0, P.core0], [.6, P.core1], [1, P.halo0]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = Math.max(2, r * .018); ctx.stroke(p); ctx.restore();
  }
  // raised hands around the ring: one per member (1 member · 1 vote)
  if ((o.palms ?? 0) > 0) for (let i = 0; i < N; i++) {
    const k = expoOut(span(o.palms, i / (N + 6), (i + 7) / (N + 6))); if (k <= 0) continue;
    const q = -Math.PI / 2 + (i + .5) * step, rr = r * (1.3 + .08 * k), s = r * .26 * (.7 + .3 * k);
    ctx.save(); ctx.translate(x + Math.cos(q) * rr, y + Math.sin(q) * rr); ctx.rotate(q + Math.PI / 2);
    E.icon(ctx, 'hand', 0, 0, s, t, { lit: 1, a: k * a, dust: 0, glow: .6, seed: 90 + i }); ctx.restore();
  }
}

// ---------- flow (T5): nodes of light joined by links that carry beads ----------
export function node(ctx, x, y, r, u, t, o = {}) {
  if (u <= 0) return;
  const k = expoOut(u), p = new Path2D(); p.arc(x, y, r * k, 0, Math.PI * 2);
  E.lightShape(ctx, p, t, { lit: o.warm ?? 1, a: o.a ?? 1, dust: o.dust ?? 0, seed: o.seed ?? 3, glow: o.glow ?? 1 });
  if (o.label) write(ctx, o.label, x + (o.lx ?? 0), y + (o.ly ?? r + 62), span(u, .45, 1), { size: o.size ?? SZ.label, col: o.lcol ?? P.cream });
}
// link a → b as a soft arc; u = drawn share; beads flow along it (dir +1 a→b); col warm/cool
export function link(ctx, a, b, u, t, o = {}) {
  if (u <= 0) return null;
  const bend = o.bend ?? -60, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = -(b[1] - a[1]), ny = b[0] - a[0], nl = Math.hypot(nx, ny) || 1;
  const c = [mx + nx / nl * bend, my + ny / nl * bend], w = o.w ?? 2.6;
  const pts = []; for (let i = 0; i <= 40; i++) { const s = i / 40; pts.push([(1 - s) ** 2 * a[0] + 2 * s * (1 - s) * c[0] + s * s * b[0], (1 - s) ** 2 * a[1] + 2 * s * (1 - s) * c[1] + s * s * b[1], w]); }
  const cool = o.warm === 0;
  if (cool) { coolLine(ctx, pts, u, o.a ?? 1); } else trail(ctx, pts, u, { w, a: o.a ?? 1, spark: o.spark ?? u < 1 });
  if (o.beads && u >= 1) beads(ctx, pts, t, { n: o.beads, dir: o.dir ?? 1, col: cool ? M.data : P.core0, speed: o.speed ?? .35, a: o.a ?? 1, size: o.bsize ?? 4 });
  return pts;
}
export function coolLine(ctx, pts, u, a = 1) {
  const n = Math.max(2, Math.floor(pts.length * clamp(u)));
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [w, al, col] of [[9, .18, M.cyanD], [2.4, .9, M.cyan]]) { ctx.globalAlpha = al * a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
  ctx.restore();
}
export function beads(ctx, pts, t, o = {}) {
  const n = o.n ?? 5, L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1];
  ctx.save(); ctx.fillStyle = o.col ?? P.core0;
  for (let k = 0; k < n; k++) {
    let f = ((t * (o.speed ?? .35) + k / n) % 1); if (o.dir === -1) f = 1 - f;
    const d = f * tot; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
    const q = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]), x = lerp(pts[i - 1][0], pts[i][0], q), y = lerp(pts[i - 1][1], pts[i][1], q);
    const fade = Math.sin(Math.PI * f) * (o.a ?? 1);
    halo(ctx, x, y, (o.size ?? 4) * 5, .45 * fade, o.col === M.data ? P.blue0 : P.halo1, o.col ?? P.core0);
    ctx.globalAlpha = fade; ctx.beginPath(); ctx.arc(x, y, o.size ?? 4, 0, 6.29); ctx.fill();
  }
  ctx.restore();
}
// point on a polyline at fraction f (by length)
export function along(pts, f) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = clamp(f) * L[L.length - 1]; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const q = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)];
}
export function arcPts(a, b, lift, n = 40, w = 3) {
  const c1 = [lerp(a[0], b[0], .3), Math.min(a[1], b[1]) - lift], c2 = [lerp(a[0], b[0], .7), Math.min(a[1], b[1]) - lift], out = [];
  for (let i = 0; i <= n; i++) { const s = i / n, m = 1 - s; out.push([m ** 3 * a[0] + 3 * m * m * s * c1[0] + 3 * m * s * s * c2[0] + s ** 3 * b[0], m ** 3 * a[1] + 3 * m * m * s * c1[1] + 3 * m * s * s * c2[1] + s ** 3 * b[1], w]); }
  return out;
}

// ---------- sky, sun, hills (morning) ----------
// w 0..1: how far the morning has come (0 = deep blue before sunrise, 1 = bright low-sun morning). hy = horizon y.
export function morningSky(ctx, w, hy = 760, o = {}) {
  const top = mixHex(P.night1, '#14256e', w), mid = mixHex(P.ind1, M.dawnBlue, w), low = mixHex(P.blue1, M.dawnRose, w * .8), hor = mixHex(P.blue2, M.dawnLow, w);
  ctx.fillStyle = lin(ctx, 0, -200, 0, hy, [[0, top], [.5, mid], [.82, low], [1, hor]]); ctx.fillRect(-W, -H, W * 3, hy + H);
  ctx.fillStyle = hor; ctx.fillRect(-W, hy - 1, W * 3, H * 2);
  if (o.stars ?? (1 - w) > .05) E.stars(ctx, 13, 120, o.t ?? 0, [0, 0, W, hy * .6], clamp(1 - w * 1.3) * .8);
}
// the low sun: hero light (cream core, gold halo, blue bloom), optional quiet rays
export function sun(ctx, x, y, r, t, o = {}) {
  E.lightForm(ctx, 'disc', x - r, y - r, 2 * r, 2 * r, t, { breath: .015, dust: o.dust ?? 3000, seed: o.seed ?? 77, a: o.a ?? 1 });
  if (o.rays) E.rays(ctx, x, y, r * 1.12, r * 1.75, 16, .18 * (o.a ?? 1), t * .015);
}
// silhouette band with rim light on its top edge (light from the sun side)
export function hill(ctx, pts, o = {}) {
  E.ground(ctx, pts, { stops: o.stops || [[0, o.c0 ?? P.ind0], [1, o.c1 ?? P.night0]], rim: o.rim ?? rgba(P.halo1, .55), rimW: o.rimW ?? 2.5, bottom: o.bottom });
}

// ---------- people (indigo silhouettes; only "du" wears yellow, that is E.du) ----------
// fig: same joint build as E.du, without the yellow. o: dir, walk, armR, armL, look, light, coat ('ind' | colours), hair ('short'|'bun'|'long'),
//   headset, cup 'R'|'L', phone 'R'|'L' (a cyan screen at the hand), sit 0..1 (seated on a chair at seat height .26), skirt
export function fig(ctx, x, y, h, o = {}) {
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, look = o.look ?? 0, sit = o.sit ?? 0;
  const ph = o.walk, sw = ph == null || sit ? 0 : Math.sin(ph);
  const armR = o.armR || [.2, .1], armL = o.armL || [-.2, -.1];
  const C = o.colors || { lit: mixHex(P.ind1, P.blue1, .55), base: P.ind1, shade: P.ind0, deep: P.night1, rim: o.rim ?? rgba(P.halo1, .8) };
  const drop = sit * .17;
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h);
  if (!sit) { ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.ellipse(-L * .2, 0, .3, .022, 0, 0, 6.29); ctx.fill(); }
  const cap = (pts, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(...pts[0]); for (const q of pts.slice(1)) ctx.lineTo(...q); ctx.stroke(); };
  const legCol = [C.deep, mixHex(C.deep, C.shade, .5)];
  if (sit) {   // seated legs; sit < 1 blends from the standing legs (sitting down is one continuous move)
    const k = smooth(clamp(sit));
    for (const [i, hx] of [[0, -.03], [1, .04]]) {
      const hx0 = i ? .04 : -.04, hp = [lerp(hx0, hx, k), -.44 + drop], kn = [lerp(hx0 + .01, hx + .2, k), lerp(-.22, -.44 + drop - .01, k)], ft = [lerp(hx0 + .01, hx + .22, k), lerp(-.01, -.02, k)];
      cap([hp, kn, ft], .07, legCol[i]); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(ft[0] + .03, ft[1], .05, .024, 0, 0, 6.29); ctx.fill();
    }
  } else {
    const leg = (hx, a, k, col) => {
      const kn = [hx + Math.sin(a) * .23, -.44 + Math.cos(a) * .22], ft = [kn[0] + Math.sin(a - k) * .21, kn[1] + Math.cos(a - k) * .21];
      cap([[hx, -.44], kn, ft], .068, col); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(ft[0] + .03, ft[1] - .005, .05, .024, 0, 0, 6.29); ctx.fill();
    };
    const a1 = ph == null ? .03 : .36 * sw, k1 = ph == null ? 0 : Math.max(0, Math.sin(ph + 1.7)) * .55, k2 = ph == null ? 0 : Math.max(0, Math.sin(ph + 1.7 + Math.PI)) * .55;
    leg(-.04, -a1, k2, legCol[0]); leg(.04, a1, k1, legCol[1]);
  }
  ctx.translate(0, drop);
  const hands = {};
  const arm = (side, [s1, s2], col) => {
    const sx = side * .095, sy = -.735, el = [sx + Math.sin(s1) * .17, sy + Math.cos(s1) * .17], hd = [el[0] + Math.sin(s2) * .16, el[1] + Math.cos(s2) * .16];
    cap([[sx, sy], el, hd], .06, col);
    ctx.fillStyle = mixHex(P.shade0, P.night1, .35); ctx.beginPath(); ctx.arc(hd[0], hd[1], .029, 0, 6.29); ctx.fill();
    hands[side > 0 ? 'R' : 'L'] = [x + h * dir * hd[0], y + h * (hd[1] + drop)];
    const s = side > 0 ? 'R' : 'L';
    if (o.cup === s) { ctx.fillStyle = P.cream; ctx.beginPath(); ctx.moveTo(hd[0] - .034, hd[1] - .072); ctx.lineTo(hd[0] + .034, hd[1] - .072); ctx.lineTo(hd[0] + .027, hd[1] - .005); ctx.lineTo(hd[0] - .027, hd[1] - .005); ctx.closePath(); ctx.fill(); }
    if (o.phone === s) { ctx.fillStyle = M.cyan; ctx.globalAlpha = .95; ctx.fillRect(hd[0] - .012, hd[1] - .06, .03, .06); ctx.globalAlpha = 1; }
  };
  arm(-1, armL, C.shade);
  // coat / dress: A-line (standing) or a short body over the lap (seated)
  const hem = sit ? .44 : .2 + .012 * Math.abs(sw), swing = .02 * sw;
  ctx.beginPath(); ctx.moveTo(-.1, -.77); ctx.quadraticCurveTo(-.135, -.72, -.13, -.6);
  {   // standing A-line → seated body over the lap, blended by sit (no pop while sitting down)
    const k = smooth(clamp(sit)), hs = .2 + .012 * Math.abs(sw), q = (a, b) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
    const pA = q([-.165 + swing, -hs], [-.15, -.43]), pQ = q([0, -hs + .028], [-.05, -.39]), pB = q([.165 + swing, -hs - .006], [.2, -.41]), pC = q([.13, -.6], [.22, -.47]), pD = q([.13, -.6], [.12, -.52]);
    ctx.lineTo(...pA); ctx.quadraticCurveTo(...pQ, ...pB); ctx.lineTo(...pC); ctx.lineTo(...pD);
  }
  ctx.quadraticCurveTo(.135, -.72, .1, -.77); ctx.quadraticCurveTo(0, -.8, -.1, -.77); ctx.closePath();
  ctx.fillStyle = lin(ctx, -.18 * L, 0, .18 * L, 0, [[0, C.shade], [.55, C.base], [1, C.lit]]); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = C.rim; ctx.lineWidth = .016; ctx.translate(-.012 * L, 0); ctx.stroke(); ctx.restore();
  // head, hair (no face)
  const hx = -.012 * look, hy = -.875 - .008 * look;
  ctx.fillStyle = C.deep; ctx.beginPath(); ctx.ellipse(hx, hy, .062, .07 - .01 * look, look * -.35, 0, 6.29); ctx.fill();
  if (o.hair === 'bun') { ctx.beginPath(); ctx.arc(hx - .04, hy - .055, .035, 0, 6.29); ctx.fill(); }
  if (o.hair === 'long') { ctx.beginPath(); ctx.ellipse(hx - .03, hy + .04, .05, .08, .2, 0, 6.29); ctx.fill(); }
  ctx.fillStyle = o.hairLit ?? rgba(P.halo1, .5); ctx.beginPath(); ctx.ellipse(hx + .036 * L, hy - .012, .016, .045, look * -.35, 0, 6.29); ctx.fill();
  if (o.headset) { ctx.strokeStyle = P.cream; ctx.lineWidth = .014; ctx.beginPath(); ctx.arc(hx, hy + .004, .072, Math.PI * 1.08, Math.PI * 1.95); ctx.stroke(); ctx.fillStyle = P.blue2; ctx.beginPath(); ctx.ellipse(hx + .056, hy + .012, .021, .03, 0, 0, 6.29); ctx.fill(); }
  arm(1, armR, C.base);
  ctx.restore();
  return hands;
}

// ---------- the hall (K3 layout as in c01, B1: window x 1110–1630, y 70–860; du x 640 feet 944 h 250; robot x 1385 feet 904 h 372) ----------
export const HALL = { win: { x: 1110, y: 70, w: 520, h: 790 }, du: [640, 944, 250], bot: [1385, 904, 372] };
// background card (Z far): wall + blue lift around the window
export function hallBack(ctx, t, o = {}) {
  const Wn = HALL.win, fy = Wn.y + Wn.h;
  E.nightSky(ctx, [[0, P.night0], [.7, P.night1], [1, P.ind0]], -400, fy);
  ctx.fillStyle = rad(ctx, Wn.x + Wn.w / 2, fy - 300, 1300, [[0, rgba(P.blue0, 1)], [.4, rgba(P.blue0, .5)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);
}
// focus card: floor, the window light, light pool, shadows. Figures are drawn by the caller on the same card.
export function hallWindow(ctx, t, o = {}) {
  const Wn = HALL.win, fy = Wn.y + Wn.h, cx = Wn.x + Wn.w / 2, cy = Wn.y + Wn.h * .45, br = 1 + .03 * Math.sin(t * 1.1), warm = o.warm ?? 1;
  ctx.fillStyle = lin(ctx, 0, fy, 0, H, [[0, P.ind1], [.15, P.ind0], [1, P.night0]]); ctx.fillRect(-W * 2, fy, 5 * W, H * 3);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(160px)'; ctx.fillStyle = rgba(P.blue0, .9); ctx.fillRect(Wn.x - 60, Wn.y - 60, Wn.w + 120, Wn.h + 60);
  ctx.filter = 'blur(28px)'; ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(Wn.x - 10, Wn.y - 10, Wn.w + 20, Wn.h + 10); ctx.restore();
  halo(ctx, cx, cy, 1150 * br, .1, P.halo1, P.halo2);
  ctx.fillStyle = rad(ctx, cx, cy + 120, Wn.h * .62, [[0, P.core0], [.2, P.core1], [.48, P.halo0], [.8, mixHex(P.halo1, P.halo0, .3 * warm)], [1, mixHex(P.halo1, P.shade0, .5)]]); ctx.fillRect(Wn.x, Wn.y, Wn.w, Wn.h);
  ctx.save(); ctx.filter = 'blur(2px)'; ctx.strokeStyle = rgba(P.shade0, .3); ctx.lineWidth = 6;
  for (const f of [1 / 3, 2 / 3]) { ctx.beginPath(); ctx.moveTo(Wn.x + Wn.w * f, Wn.y); ctx.lineTo(Wn.x + Wn.w * f, fy); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(Wn.x, Wn.y + Wn.h * .28); ctx.lineTo(Wn.x + Wn.w, Wn.y + Wn.h * .28); ctx.stroke(); ctx.restore();
  ctx.beginPath(); ctx.moveTo(Wn.x, fy); ctx.lineTo(Wn.x + Wn.w, fy); ctx.lineTo(Wn.x + Wn.w + 360, H + 40); ctx.lineTo(Wn.x - 520, H + 40); ctx.closePath();
  ctx.save(); ctx.filter = 'blur(6px)'; ctx.fillStyle = lin(ctx, 0, fy, 0, H, [[0, rgba(P.halo2, .75)], [.45, rgba(P.halo1, .38)], [1, rgba(P.shade0, .12)]]); ctx.fill(); ctx.restore();
  dust(ctx, 77, o.dust ?? 6000, cx, cy + 40, Wn.w * .62, Wn.h * .5, t, .9, P.halo1);
  ctx.save(); ctx.filter = 'blur(3px)'; ctx.fillStyle = rgba(P.night0, .75);
  const [bx] = HALL.bot, [dx] = HALL.du;
  ctx.beginPath(); ctx.moveTo(bx - 30, fy + 44); ctx.lineTo(bx + 30, fy + 44); ctx.lineTo(bx + 150, H + 60); ctx.lineTo(bx + 10, H + 60); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(dx - 26, fy + 84); ctx.lineTo(dx + 26, fy + 84); ctx.lineTo(dx - 160, H + 60); ctx.lineTo(dx - 260, H + 60); ctx.closePath(); ctx.fillStyle = rgba(P.night0, .5); ctx.fill(); ctx.restore();
}
// the pair: robot in the light (copies), you with the headset. lift / rob 0..1 (arm up). Returns hand positions.
export function hallPair(ctx, t, o = {}) {
  const [bx, by, bh] = HALL.bot, [dx, dy, dh] = HALL.du, rl = smooth(o.rob ?? 0), lf = smooth(o.lift ?? 0);
  const rob = E.robot(ctx, bx, by, bh, { dir: -1, light: -1, rim: P.halo0, body: P.night1, joint: P.ind1, cup: o.robCup === false ? null : 'R', armR: [lerp(.2, 1.35, rl), lerp(.1, 2.55, rl)], armL: [-.08, -.03] });
  const you = E.du(ctx, dx, dy, dh, { dir: 1, light: 1, back: .2, headset: o.headset ?? true, cup: o.cup === false ? null : 'R', look: o.look ?? .1, armR: [lerp(.18, 1.35, lf), lerp(.1, 2.55, lf)], armL: [-.1, -.04] });
  return { rob: rob.R, du: you.R };
}

// ---------- houses, windows ----------
export function house(ctx, x, y, w, h, o = {}) {   // a simple gabled house, base centre at (x,y); o.win = 0..1 lit window, o.flat (flat roof)
  const roof = o.flat ? h * .06 : h * .45, L = o.light ?? 1;
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - h); if (o.flat) { ctx.lineTo(x - w / 2 - w * .04, y - h); ctx.lineTo(x - w / 2 - w * .04, y - h - roof); ctx.lineTo(x + w / 2 + w * .04, y - h - roof); ctx.lineTo(x + w / 2 + w * .04, y - h); } else { ctx.lineTo(x, y - h - roof); }
  ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y); ctx.closePath();
  ctx.fillStyle = lin(ctx, x - w / 2 * L, 0, x + w / 2 * L, 0, [[0, o.c0 ?? P.night1], [1, o.c1 ?? P.ind0]]); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = o.rim ?? rgba(P.halo1, .6); ctx.lineWidth = 3; ctx.translate(-2 * L, 2); ctx.stroke(); ctx.restore();
  if (o.win > 0) { const ww = w * .22, wh = h * .3, wx = x + (o.wx ?? 0) * w - ww / 2, wy = y - h * .62; ctx.save(); ctx.globalAlpha = o.win; ctx.fillStyle = rad(ctx, wx + ww / 2, wy + wh / 2, ww, [[0, P.core1], [1, P.halo0]]); ctx.fillRect(wx, wy, ww, wh); ctx.restore(); halo(ctx, wx + ww / 2, wy + wh / 2, ww * 2.2, .3 * o.win, P.halo1, P.halo2); }
}

// ---------- the hall as a 2.5D shot: far wall (Z 9000), the window + floor + people (F0), a dark edge in front (Z 1100) ----------
// st: { lift, rob, look, headset, cup, robCup, du (false = no you), bot (false = no robot), extra(ctx) on the focus card, people[] }
// returns { du, rob } hand positions in DESIGN coords of the focus card (use E.project(c, E.F0, …) for the screen)
export function hallScene(ctx, c, t, st = {}) {
  let hands = {};
  E.card(ctx, c, 9000, () => hallBack(ctx, t));
  E.card(ctx, c, E.F0, () => {
    hallWindow(ctx, t, st);
    if (st.behind) st.behind(ctx);
    const [bx, by, bh] = HALL.bot, [dx, dy, dh] = HALL.du, rl = smooth(clamp(st.rob ?? 0)), lf = smooth(clamp(st.lift ?? 0));
    if (st.bot !== false) hands.rob = E.robot(ctx, bx, by, bh, { dir: -1, light: -1, rim: P.halo0, body: P.night1, cup: st.robCup === false ? null : 'R', hand: 'hand', armR: st.robArm || [lerp(.2, 1.35, rl), lerp(.1, 2.55, rl)], armL: [-.08, -.03] }).R;
    if (st.du !== false) hands.du = E.du(ctx, dx, dy, dh, { dir: 1, light: 1, back: .2, headset: st.headset ?? true, cup: st.cup === false ? null : 'R', look: st.look ?? .1, armR: st.duArm || [lerp(.18, 1.35, lf), lerp(.1, 2.55, lf)], armL: st.duArmL || [-.1, -.04], pose: st.pose }).R;
    if (st.extra) st.extra(ctx, hands);
  });
  E.card(ctx, c, 1100, () => {   // dark soft edge on the left (foreground, out of focus)
    ctx.save(); ctx.filter = 'blur(8px)'; ctx.beginPath(); ctx.moveTo(-400, -200); ctx.bezierCurveTo(420, 100, 520, 520, 380, 1300); ctx.lineTo(-400, 1300); ctx.closePath();
    ctx.fillStyle = lin(ctx, 460, 0, -200, 0, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .8)]]); ctx.fill(); ctx.restore();
  });
  return hands;
}
// measure hand positions without drawing anything visible (scratch context created once)
import { createCanvas } from '@napi-rs/canvas';
const SCR = createCanvas(8, 8).getContext('2d');
export function measure(fn) { SCR.save(); const r = fn(SCR); SCR.restore(); return r; }
