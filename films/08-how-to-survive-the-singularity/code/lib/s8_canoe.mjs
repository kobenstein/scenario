// Film 8 · the canoe (7.01 … 7.04): a double-hulled voyaging canoe (after Hōkūleʻa, 1976) with two crab-claw sails, a small fire box
// on the deck, the navigator seated at the stern (rim-lit by the fire); its dotted route; the three instruments it did not carry;
// the island at dawn; the Hawaiian star compass drawn round the navigator on the water.
//   canoe(ctx, t, C, K)            K: { x, z, head } (world), returns { fire: screen point of the fire, mast: screen point of the fore mast top }
//   route(ctx, t, C, K, u)         the dotted route behind it, grown to u (0..1)
//   island(ctx, t, C, o)           o: { az, w, dawn }
//   instruments(ctx, t, o)         screen space; o: { u: [u0,u1,u2] each 0 (below) → 1 (up) → 2 (fallen) , spin: [s0,s1,s2] }
//   starCompass(ctx, t, C, K, o)   o: { u (draw 0..1), lab (labels 0..1), stars (0..1) }
//   tag(ctx, t, x, y, u, top, bottom)   a small two-line label on a thin line, wiped in from below (u 0..1)
import { rgba, clamp, prng, canvas } from '../engine.mjs';
import { TAU, projRuns, projPoly, fillPoly, mixHex, shadeHex, hash, spline, eoX, eiX, sio, u01 } from './s8_kit.mjs';
import { waterY } from './s8_sea.mjs';
import { skyDir } from './s8_sky.mjs';

// ---------------------------------------------------------------- flames + a seated person (after Film 4 · the fire circle)
const TONGUES = (() => { const r = prng(511), a = []; for (let i = 0; i < 9; i++) { const u = i / 8 - .5; a.push({ x: u * .44 + (r() - .5) * .05, h: .5 + r() * .3 - Math.abs(u) * .42, w: .085 + r() * .05, p: r() * 10, q: r() * 10, f: 1.0 + r() * .6 }); } return a; })();
const nzf = (x) => Math.sin(x) * .5 + Math.sin(x * 2.31 + 1.3) * .3 + Math.sin(x * 5.17 + 2.1) * .2;
function tonguePts(T, t, sh, sw) {
  const h = T.h * sh * (1 + .14 * nzf(t * 2.3 + T.p) + .05 * Math.sin(t * 6.1 + T.q)), w = T.w * sw, n = 9, L = [], R = [];
  for (let j = 0; j <= n; j++) {
    const v = j / n, y = h * v, xi = T.x + (.05 + .03 * nzf(T.q + t * .7)) * v * Math.sin(TAU * (v * .75 - t * T.f) + T.p) + .05 * v * v;
    const hw = w * Math.pow(1 - v, .7) * (1 + .18 * Math.sin(TAU * (v * 1.3 - t * T.f * 1.1) + T.q)) * (v < .12 ? .75 + 2.1 * v : 1);
    L.push([xi - hw, y]); R.push([xi + hw, y]);
  }
  return [...L, ...R.reverse()];
}
export function flames(ctx, t, bx, by, k) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [sh, sw, c0, c1, a, dt] of [[1.0, 1.0, '#ff7a2e', '#b8361e', .55, 0], [.76, .74, '#ffb35c', '#ff7a2e', .6, .11], [.46, .5, '#fff6e2', '#ffd9a0', .82, .23]]) {
    for (const T of TONGUES) {
      const pts = tonguePts(T, t + dt, sh, sw), top = Math.max(...pts.map((p) => p[1]));
      ctx.beginPath(); spline(ctx, pts.map(([x, y]) => [bx + x * k, by - y * k]));
      const g = ctx.createLinearGradient(0, by, 0, by - top * k); g.addColorStop(0, rgba(c0, a)); g.addColorStop(.55, rgba(c1, a * .75)); g.addColorStop(1, rgba(c1, 0));
      ctx.fillStyle = g; ctx.fill();
    }
  }
  ctx.restore();
}
const HOOD = [[-.24, 0], [-.28, .16], [-.26, .4], [-.19, .64], [-.11, .84], [-.05, 1.0], [.05, 1.11], [.16, 1.13], [.245, 1.07]];
const FACE = [[.255, 1.045], [.272, 1.018], [.297, .988], [.278, .975], [.283, .96], [.268, .932], [.238, .914]];
const FRONT = [[.27, .86], [.36, .74], [.47, .61], [.535, .52], [.545, .34], [.51, .15], [.6, .07], [.65, .03], [.64, 0], [.3, -.01]];
export function sitter(ctx, t, f, X, Y, k, L, o = {}) {
  const b = Math.sin(t * TAU / 4.3 + 1.1), nod = (Math.sin(t * .37 + 1.7) * .6 + Math.sin(t * .19) * .4) * .05 + (o.nod || 0);
  const up = (p) => (p[1] > .3 ? [p[0], .3 + (p[1] - .3) * (1 + .012 * b)] : p);
  const hd = (p) => { const [x, y] = up(p), cx = .1, cy = .9, c = Math.cos(nod), s = Math.sin(nod); return y > .86 ? [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c] : [x, y]; };
  const S = (p) => [X + p[0] * k * f, Y - p[1] * k];
  const outline = [...HOOD.map(hd), ...FACE.map(hd), ...FRONT.map(up)].map(S);
  const lx = L[0] - X, ly = L[1] - (Y - .55 * k), ln = Math.hypot(lx, ly) || 1, ux = lx / ln, uy = ly / ln, lit = o.lit ?? .7;
  const path = () => { ctx.beginPath(); spline(ctx, outline); };
  ctx.save();
  const rw = Math.max(1.2, k * .018);
  ctx.save(); ctx.translate(ux * rw, uy * rw); path(); ctx.fillStyle = rgba('#ffb066', .95); ctx.fill(); ctx.restore();
  path(); ctx.fillStyle = mixHex('#0b090f', '#5a3a2a', .2 + .5 * lit); ctx.fill();
  ctx.save(); path(); ctx.clip();
  const g = ctx.createLinearGradient(X + ux * .55 * k, Y - .55 * k + uy * .55 * k, X - ux * .4 * k, Y - .55 * k - uy * .4 * k);
  g.addColorStop(0, rgba('#ffa860', .25 + .45 * lit)); g.addColorStop(.4, rgba('#c86a32', .1)); g.addColorStop(.65, rgba('#000000', 0)); g.addColorStop(1, rgba('#020104', .5));
  ctx.fillStyle = g; ctx.fillRect(X - .8 * k, Y - 1.3 * k, 1.6 * k, 1.4 * k);
  ctx.strokeStyle = rgba('#05030a', .5); ctx.lineWidth = Math.max(.8, k * .006); ctx.lineCap = 'round'; ctx.beginPath();
  for (const q of [[[.2, .84], [.12, .6], [.02, .3], [-.02, .05]], [[.08, .9], [-.04, .62], [-.12, .32], [-.15, .06]], [[.33, .74], [.3, .5], [.38, .32], [.46, .2]]]) spline(ctx, q.map(up).map(S), false);
  ctx.stroke(); ctx.restore();
  const fp = [...FACE, [.205, .955], [.2, 1.02], [.235, 1.06]].map(hd).map(S);
  ctx.beginPath(); spline(ctx, fp); ctx.fillStyle = mixHex('#5a3828', '#ffb070', .2 + .35 * lit); ctx.fill();
  ctx.restore();
  return { head: S(hd([.15, 1.0])), hand: S(up([.47, .56])) };
}

// ---------------------------------------------------------------- the canoe
const LEN = 19, HALF = LEN / 2, SEP = 1.35;
const HULLPTS = (() => { const g = [], w = []; for (let i = 0; i <= 28; i++) { const v = i / 28, s = -HALF + v * LEN, e = Math.abs(s) / HALF, bw = .42 * Math.pow(Math.max(0, 1 - Math.pow(e, 2.4)), .55) + .02, sh = 1.05 + .9 * Math.pow(Math.max(0, e - .7) / .3, 2.2); g.push([bw, sh, s]); w.push([bw * .8, 0, s * .94]); } return { g, w }; })();
export function canoeFrame(K, t) {
  const h = K.head, fx = Math.sin(h), fz = Math.cos(h), rx = Math.cos(h), rz = -Math.sin(h);
  const y0 = waterY(K.x, K.z, t) * .5, roll = .025 * Math.sin(t * 1.1 + .4), pit = .012 * Math.sin(t * .9);
  return (u, v, w) => { const vv = v + u * roll + w * pit; return [K.x + rx * u + fx * w, y0 + vv, K.z + rz * u + fz * w]; };
}
function hull(ctx, t, C, F, side, fire) {
  const G = [...HULLPTS.g.map(([u, v, w]) => F(side + u, v, w)), ...HULLPTS.g.slice().reverse().map(([u, v, w]) => F(side - u, v, w))];
  const Wl = [...HULLPTS.w.map(([u, v, w]) => F(side + u, v, w)), ...HULLPTS.w.slice().reverse().map(([u, v, w]) => F(side - u, v, w))];
  const dC = C.depth(...F(side, .5, 0)), q = [];
  for (let i = 0; i < G.length; i++) { const j = (i + 1) % G.length, P = [G[i], G[j], Wl[j], Wl[i]]; q.push([P.reduce((a, p) => a + C.depth(...p), 0) / 4, P, i]); }
  const draw = (L) => { L.sort((a, b) => b[0] - a[0]); for (const [, P, i] of L) { const S = projPoly(C, P); if (S.length < 3) continue; const n = i < G.length / 2 ? 1 : -1, lit = clamp(.35 + .35 * n * Math.sign(side || 1)); const col = mixHex('#120c10', '#3a2018', lit * fire); fillPoly(ctx, S, col); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke(); } };
  draw(q.filter((x) => x[0] >= dC)); fillPoly(ctx, projPoly(C, G), '#0a0710'); draw(q.filter((x) => x[0] < dC));
  for (const run of projRuns(C, [...G, G[0]])) { ctx.strokeStyle = rgba('#ffb066', .35 * fire + .15); ctx.lineWidth = 1.6; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  for (const run of projRuns(C, [...Wl, Wl[0]])) { ctx.strokeStyle = rgba('#c8d4f0', .22); ctx.lineWidth = 1.4; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
}
function sail(ctx, t, C, F, w0, ang, size, fireP) {
  // crab claw: two spars from the tack spreading upward, the top edge between them concave; the plane turned 'ang' off the centreline
  const d = [Math.sin(ang), Math.cos(ang)], base = [0, 1.45, w0], fl = .06 * Math.sin(t * 1.3 + w0);
  const S = (a, y, bul = 0) => F(base[0] + d[0] * a + d[1] * bul, base[1] + y, base[2] + d[1] * a - d[0] * bul);
  const sp1 = [-1.3 * size, 9.6 * size], sp2 = [4.4 * size, 7.6 * size], pts = [];
  for (let i = 0; i <= 10; i++) { const v = i / 10; pts.push(S(sp1[0] * v, sp1[1] * v, .3 * Math.sin(Math.PI * v))); }
  for (let i = 1; i < 12; i++) { const v = i / 12, a = sp1[0] + (sp2[0] - sp1[0]) * v, y = sp1[1] + (sp2[1] - sp1[1]) * v - 2.0 * size * Math.sin(Math.PI * v) * (1 + fl); pts.push(S(a, y, .9 * Math.sin(Math.PI * v) * .5)); }
  for (let i = 10; i >= 0; i--) { const v = i / 10; pts.push(S(sp2[0] * v, sp2[1] * v, .5 * Math.sin(Math.PI * v))); }
  const P = projPoly(C, pts); if (P.length < 3) return;
  fillPoly(ctx, P, '#3a1c1c');
  ctx.save(); fillPoly(ctx, P); ctx.clip();
  const tk = C.P(...S(0, 0)), tp = C.P(...S(1.4 * size, 8 * size));
  if (tk && tp) { const g = ctx.createLinearGradient(tk[0], tk[1], tp[0], tp[1]); g.addColorStop(0, rgba('#ff9a50', .55)); g.addColorStop(.35, rgba('#a0402a', .3)); g.addColorStop(1, rgba('#1a0c14', .3)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
  if (fireP) { const g = ctx.createRadialGradient(fireP[0], fireP[1], 0, fireP[0], fireP[1], fireP[2] * 6); g.addColorStop(0, rgba('#ffb35c', .35)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
  // panel seams radiating from the tack
  ctx.strokeStyle = rgba('#140808', .45); ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 1; i < 6; i++) { const v = i / 6, a = sp1[0] + (sp2[0] - sp1[0]) * v, y = sp1[1] + (sp2[1] - sp1[1]) * v - 2.0 * size * Math.sin(Math.PI * v); const p = C.P(...S(0, 0)), q = C.P(...S(a, y, .45 * Math.sin(Math.PI * v))); if (p && q) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } }
  ctx.stroke(); ctx.restore();
  // spars (dark) with a rim
  for (const sp of [sp1, sp2]) { const R = projRuns(C, [0, .25, .5, .75, 1].map((v) => S(sp[0] * v, sp[1] * v, (sp === sp1 ? .3 : .5) * Math.sin(Math.PI * v)))); for (const r of R) { ctx.strokeStyle = '#120a0a'; ctx.lineWidth = Math.max(1.5, r[0][2] * .1); ctx.beginPath(); r.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.strokeStyle = rgba('#ffb066', .4); ctx.lineWidth = 1; ctx.stroke(); } }
  ctx.strokeStyle = rgba('#a4b0dc', .3); ctx.lineWidth = 1.2; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
}
export function canoe(ctx, t, C, K) {
  const F = canoeFrame(K, t), out = {};
  const fireW = [.35, 1.35, 1.2], fireP = C.P(...F(...fireW));
  const navW = [0, 1.32, -6.6], navP = C.P(...F(...navW));
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // the shadow on the water
  for (const sd of [-SEP, SEP]) fillPoly(ctx, projPoly(C, HULLPTS.w.map(([u, v, w]) => F(sd + u * 1.6, -.02, w)).concat(HULLPTS.w.slice().reverse().map(([u, v, w]) => F(sd - u * 1.6, -.02, w)))), 'rgba(2,2,8,.5)');
  const parts = [];
  for (const sd of [-SEP, SEP]) parts.push([C.depth(...F(sd, .5, 0)) + (C.y > 5 ? 3 : 0), () => hull(ctx, t, C, F, sd, 1)]);
  parts.push([C.depth(...F(0, 1.3, 0)) + (C.y > 5 ? 1 : 0), () => {
    // deck platform + crossbeams (ʻiako), lit by the fire
    const deck = [F(-SEP - .2, 1.28, -5.6), F(SEP + .2, 1.28, -5.6), F(SEP + .2, 1.28, 5.2), F(-SEP - .2, 1.28, 5.2)], D = projPoly(C, deck);
    if (fillPoly(ctx, D, '#1a1014')) {
      ctx.save(); fillPoly(ctx, D); ctx.clip();
      if (fireP) { const g = ctx.createRadialGradient(fireP[0], fireP[1], 0, fireP[0], fireP[1], fireP[2] * 5); g.addColorStop(0, rgba('#ffb35c', .6)); g.addColorStop(.4, rgba('#c4512e', .2)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
      ctx.strokeStyle = rgba('#05030a', .55); ctx.lineWidth = 1; ctx.beginPath(); for (let w = -5.2; w < 5.2; w += .55) { const a = C.P(...F(-SEP - .2, 1.29, w)), b = C.P(...F(SEP + .2, 1.29, w)); if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } } ctx.stroke();
      ctx.restore();
    }
    for (const w of [-7.2, -5.9, 5.6, 6.9]) { const a = C.P(...F(-SEP - .3, 1.25, w)), b = C.P(...F(SEP + .3, 1.25, w)); if (a && b) { ctx.strokeStyle = '#120a0a'; ctx.lineWidth = Math.max(1.5, a[2] * .14); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.strokeStyle = rgba('#ffb066', .35); ctx.lineWidth = 1; ctx.stroke(); } }
    // the steering paddle at the stern
    const a = C.P(...F(.9, 2.2, -8.2)), b = C.P(...F(1.1, -.6, -10.6)); if (a && b) { ctx.strokeStyle = '#100808'; ctx.lineWidth = Math.max(1.5, a[2] * .09); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  }]);
  // the fire box: a small dark box on the deck, flames inside, sparks
  parts.push([C.depth(...F(...fireW)) - .1, () => {
    const box = [[-.35, -.35], [.35, -.35], [.35, .35], [-.35, .35]].map(([u, w]) => [fireW[0] + u, w + fireW[2]]);
    const top = box.map(([u, w]) => F(u, 1.62, w)), bot = box.map(([u, w]) => F(u, 1.3, w));
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; fillPoly(ctx, projPoly(C, [top[i], top[j], bot[j], bot[i]]), i % 2 ? '#24140e' : '#1a0e0c'); }
    if (fireP) {
      const k = fireP[2]; flames(ctx, t, fireP[0], fireP[1] + k * .22, k * 1.9);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = k * 5 * (1 + .04 * Math.sin(t * 7.3) + .03 * Math.sin(t * 13.1)); const g = ctx.createRadialGradient(fireP[0], fireP[1], 0, fireP[0], fireP[1], R); g.addColorStop(0, rgba('#ffb35c', .6)); g.addColorStop(.3, rgba('#ff8a3a', .18)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fireP[0], fireP[1], R, 0, TAU); ctx.fill();
      // sparks rise and drift aft
      ctx.lineCap = 'round';
      for (let n = Math.floor(t / .07) - 30; n <= Math.floor(t / .07); n++) { const a = t - n * .07, life = 1.1 + hash(n) * .9; if (a < 0 || a > life || hash(n * 3.3) > .45) continue; const p = C.P(...F(fireW[0] + (hash(n * 1.7) - .5) * .3, 1.6 + a * (.9 + .6 * hash(n * 2.1)), fireW[2] - a * 1.4 + (hash(n * 5.1) - .5) * .4)); if (!p) continue; const heat = 1 - a / life; ctx.fillStyle = rgba(heat > .5 ? '#ffe7b0' : '#ff9a4a', heat); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(.8, p[2] * .025), 0, TAU); ctx.fill(); }
      ctx.restore();
    }
  }]);
  // the navigator, seated at the stern, facing forward
  parts.push([C.depth(...F(...navW)), () => {
    if (!navP) return;
    const fw = C.P(...F(0, 1.32, -5.6)), f = fw && fw[0] >= navP[0] ? 1 : -1;
    const L = fireP || [navP[0] + 200 * f, navP[1] - 50];
    out.nav = sitter(ctx, t, f, navP[0], navP[1], navP[2] * 1.0, L, { lit: .85 });
  }]);
  // masts + sails (fore and aft)
  for (const [w0, ang, sz] of [[3.4, .5, 1], [-2.6, .42, .86]]) parts.push([C.depth(...F(0, 5, w0)), () => sail(ctx, t, C, F, w0, ang, sz, fireP)]);
  parts.sort((a, b) => b[0] - a[0]);
  for (const [, fn] of parts) fn();
  ctx.restore();
  out.fire = fireP; out.mast = C.P(...F(0, 11.5, 3.4)); out.tagP = C.P(...F(0, 3.2, 8.6)); out.stern = C.P(...F(0, .2, -HALF));
  return out;
}

// ---------------------------------------------------------------- the route: dots on the water behind the canoe, back to the horizon
export function route(ctx, t, C, K, u) {
  if (u <= 0) return;
  const bx = -Math.sin(K.head), bz = -Math.cos(K.head);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 160; i++) {
    const d = 12 + i * 3.2 * (1 + i * .02), v = i / 160; if (v > u) break;
    const sw = 1.5 * Math.sin(d * .01 + 1) * Math.min(1, d / 40);
    const p = C.P(K.x + bx * d + bz * sw, .03, K.z + bz * d - bx * sw, .5); if (!p) continue;
    const r = Math.max(.9, p[2] * .09), a = .75 * clamp((u - v) * 8) * (1 - .5 * v);
    ctx.fillStyle = rgba('#ffd9a0', a); ctx.beginPath(); ctx.ellipse(p[0], p[1], r * 1.6, r * .6, 0, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the island on the horizon (at dawn): high peaks, a warm rim
export function island(ctx, t, C, o) {
  const pts = [], n = 40;
  for (let i = 0; i <= n; i++) { const v = i / n, x = -1 + 2 * v, e = .006 + .028 * Math.exp(-((x + .25) ** 2) / .08) + .018 * Math.exp(-((x - .4) ** 2) / .05) + .003 * Math.sin(x * 37) * (1 - x * x); pts.push(C.D(...skyDir(o.az + x * o.w, e * (1 - x * x * .6)))); }
  pts.push(C.D(...skyDir(o.az + o.w, -.001)), C.D(...skyDir(o.az - o.w, -.001)));
  if (pts.some((p) => !p)) return;
  ctx.save(); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = mixHex('#120e26', '#3a2440', (o.dawn ?? 0) * .4); ctx.fill();
  ctx.strokeStyle = rgba('#ffb88a', .5 * (o.dawn ?? 0)); ctx.lineWidth = 1.4; ctx.beginPath(); pts.slice(0, n + 1).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- the three instruments (screen space, in the deck light): chart, compass, sextant
function chartArt(ctx, s) {   // a rolled chart, tied
  ctx.fillStyle = '#d8c79c'; ctx.beginPath(); ctx.roundRect(-150 * s, -26 * s, 300 * s, 52 * s, 26 * s); ctx.fill();
  const g = ctx.createLinearGradient(0, -26 * s, 0, 26 * s); g.addColorStop(0, 'rgba(255,240,210,.5)'); g.addColorStop(.4, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(40,20,10,.55)'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-150 * s, -26 * s, 300 * s, 52 * s, 26 * s); ctx.fill();
  ctx.fillStyle = '#b8a47a'; ctx.beginPath(); ctx.ellipse(150 * s, 0, 10 * s, 26 * s, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(60,40,20,.6)'; ctx.lineWidth = 1.5 * s; for (const r of [8, 15, 21]) { ctx.beginPath(); ctx.ellipse(150 * s, 0, r * .38 * s, r * s, 0, 0, TAU); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(90,60,40,.4)'; ctx.lineWidth = 1.2 * s; ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(-120 * s + i * 60 * s, -22 * s); ctx.quadraticCurveTo(-100 * s + i * 60 * s, 0, -120 * s + i * 60 * s, 22 * s); } ctx.stroke();
  ctx.strokeStyle = '#7a2a1a'; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(-10 * s, -27 * s); ctx.lineTo(-10 * s, 27 * s); ctx.moveTo(-10 * s, 27 * s); ctx.quadraticCurveTo(-20 * s, 50 * s, -34 * s, 58 * s); ctx.moveTo(-10 * s, 27 * s); ctx.quadraticCurveTo(4 * s, 48 * s, 16 * s, 62 * s); ctx.stroke();
}
function compassArt(ctx, s, t) {
  ctx.fillStyle = '#4a3420'; ctx.beginPath(); ctx.ellipse(0, 12 * s, 112 * s, 40 * s, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#c8964e'; ctx.beginPath(); ctx.ellipse(0, 0, 112 * s, 40 * s, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#efe2c0'; ctx.beginPath(); ctx.ellipse(0, 0, 92 * s, 33 * s, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.scale(1, 33 / 92); ctx.fillStyle = 'rgba(42,36,32,.45)'; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, L = (i % 2 ? 40 : 70) * s; ctx.beginPath(); ctx.moveTo(Math.sin(a) * L, -Math.cos(a) * L); ctx.lineTo(Math.sin(a + 1.3) * 8 * s, -Math.cos(a + 1.3) * 8 * s); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); }
  const na = .3 * Math.sin(t * 2.2); ctx.rotate(na); ctx.fillStyle = '#b8361e'; ctx.beginPath(); ctx.moveTo(0, -78 * s); ctx.lineTo(-7 * s, 0); ctx.lineTo(7 * s, 0); ctx.fill(); ctx.fillStyle = '#1a1622'; ctx.beginPath(); ctx.moveTo(0, 78 * s); ctx.lineTo(-7 * s, 0); ctx.lineTo(7 * s, 0); ctx.fill(); ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.ellipse(0, 0, 70 * s, 25 * s, 0, Math.PI * 1.1, Math.PI * 1.5); ctx.stroke();
}
function sextantArt(ctx, s) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#a8803e'; ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(0, -120 * s); ctx.lineTo(-70 * s, 40 * s); ctx.moveTo(0, -120 * s); ctx.lineTo(70 * s, 40 * s); ctx.stroke();
  ctx.lineWidth = 16 * s; ctx.beginPath(); ctx.arc(0, -120 * s, 170 * s, Math.PI / 2 - .44, Math.PI / 2 + .44); ctx.stroke();
  ctx.strokeStyle = '#2a1e10'; ctx.lineWidth = 1.2 * s; for (let i = -12; i <= 12; i++) { const a = Math.PI / 2 + i * .034; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 164 * s, -120 * s + Math.sin(a) * 164 * s); ctx.lineTo(Math.cos(a) * 176 * s, -120 * s + Math.sin(a) * 176 * s); ctx.stroke(); }
  ctx.strokeStyle = '#d8b06a'; ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.moveTo(0, -120 * s); ctx.lineTo(24 * s, 52 * s); ctx.stroke();
  ctx.fillStyle = '#3a4a5a'; ctx.fillRect(-12 * s, -138 * s, 24 * s, 30 * s); ctx.fillStyle = 'rgba(200,230,255,.5)'; ctx.fillRect(-9 * s, -135 * s, 9 * s, 24 * s);
  ctx.fillStyle = '#1e1a14'; ctx.beginPath(); ctx.roundRect(-96 * s, -60 * s, 44 * s, 18 * s, 6 * s); ctx.fill();   // the telescope
  ctx.fillStyle = '#3a2614'; ctx.beginPath(); ctx.roundRect(40 * s, -50 * s, 22 * s, 70 * s, 8 * s); ctx.fill();   // the handle
}
const IC = canvas(900, 900);
export function instruments(ctx, t, o) {
  const arts = [chartArt, compassArt, sextantArt], [c, g] = IC;
  for (let i = 0; i < 3; i++) {
    const u = o.u[i]; if (u <= 0 || u >= 2) continue;
    const rise = eoX(Math.min(1, u)), fall = eiX(Math.max(0, u - 1));
    const y = 1500 - 700 * rise + 1000 * fall, spin = o.spin[i] * TAU, s = 2.1;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, 900, 900);
    g.translate(450, 450); g.scale(Math.abs(Math.cos(spin)) < .02 ? .02 : Math.cos(spin), 1);
    arts[i](g, s, t);
    // warm deck light from the left and below, a cool shade toward the top right (only on the object)
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
    const lg = g.createLinearGradient(150, 750, 750, 150); lg.addColorStop(0, 'rgba(255,150,70,.4)'); lg.addColorStop(.5, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(10,8,30,.5)'); g.fillStyle = lg; g.fillRect(0, 0, 900, 900);
    ctx.save(); ctx.translate(960 + 30 * Math.sin(t * .7 + i), y); ctx.rotate(.08 * Math.sin(t * .9 + i) + fall * .5 * (i % 2 ? 1 : -1));
    ctx.shadowColor = 'rgba(255,150,70,.5)'; ctx.shadowBlur = 50; ctx.drawImage(c, -450, -450); ctx.restore();
  }
}

// ---------------------------------------------------------------- the star compass (Hawaiian): 32 houses round the navigator, on the water
const QUARTERS = [['ʻĀKAU', 0], ['HIKINA', Math.PI / 2], ['HEMA', Math.PI], ['KOMOHANA', -Math.PI / 2]];
export function starCompass(ctx, t, C, K, o) {
  const u = o.u ?? 0; if (u <= 0) return;
  const R = o.R ?? 15, cx = K.x, cz = K.z, rot = t * .004;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const ring = (rr, a, lw, col, frac = 1) => { const pts = []; for (let i = 0; i <= 160 * frac; i++) { const th = i / 160 * TAU + rot; pts.push([cx + Math.sin(th) * rr, .05, cz + Math.cos(th) * rr]); } for (const run of projRuns(C, pts, .3)) { ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } };
  const fr = eoX(u);
  ring(R, .85, 2, '#ffe2b0', fr); ring(R, .25, 7, '#ff9a4a', fr); ring(R * 1.12, .4, 1.2, '#ffd9a0', fr);
  // 32 houses: ticks between the rings, longer at the quarters
  for (let i = 0; i < 32; i++) {
    const v = i / 32; if (v > fr) break;
    const th = v * TAU + rot, L = i % 8 === 0 ? .2 : i % 4 === 0 ? .14 : .08;
    const a = C.P(cx + Math.sin(th) * R * (1 - L), .05, cz + Math.cos(th) * R * (1 - L), .3), b = C.P(cx + Math.sin(th) * R * 1.12, .05, cz + Math.cos(th) * R * 1.12, .3);
    if (a && b) { ctx.strokeStyle = rgba('#ffe2b0', i % 8 === 0 ? .95 : .6); ctx.lineWidth = i % 8 === 0 ? 2.4 : 1.4; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    // the house's star on the horizon (rising and setting points)
    const st = clamp((o.stars ?? 0) * 1.4 - v * .4);
    if (st > 0) { const p = C.D(...skyDir(th, .012 + .006 * (i % 2))); if (p && p[1] < C.hy + 2) { const tw = .75 + .25 * Math.sin(t * 3 + i * 1.7); ctx.fillStyle = rgba('#f0f6ff', st * tw); ctx.beginPath(); ctx.arc(p[0], p[1], 1.8, 0, TAU); ctx.fill(); const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 9); g.addColorStop(0, rgba('#c8e0ff', .4 * st)); g.addColorStop(1, rgba('#c8e0ff', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, TAU); ctx.fill(); } }
  }
  // spokes to the quarters
  for (const [, th0] of QUARTERS) { const th = th0 + rot, pts = [[cx + Math.sin(th) * R * .12, .05, cz + Math.cos(th) * R * .12], [cx + Math.sin(th) * R * .8, .05, cz + Math.cos(th) * R * .8]]; for (const run of projRuns(C, pts, .3)) { ctx.strokeStyle = rgba('#ffd9a0', .3 * fr); ctx.lineWidth = 1.2; ctx.setLineDash([4, 8]); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.setLineDash([]); } }
  ctx.restore();
  // labels at the quarters (small, cream; wiped in from below)
  const lu = o.lab ?? 0;
  if (lu > 0) for (const [name, th0] of QUARTERS) {
    const th = th0 + rot, p = C.P(cx + Math.sin(th) * R * 1.3, .05, cz + Math.cos(th) * R * 1.3, .5); if (!p || p[0] < 40 || p[0] > 1880 || p[1] < 40 || p[1] > 1060) continue;
    tagWord(ctx, p[0], p[1], lu, name, Math.max(15, Math.min(24, p[2] * 1.3)));
  }
}
function tagWord(ctx, x, y, u, s, size) {
  ctx.save(); ctx.font = `600 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = `${size * .3}px`;
  ctx.beginPath(); ctx.rect(x - 400, y - size * .9, 800, size * 1.8); ctx.clip();
  const dy = (1 - eoX(u)) * size * 1.6; ctx.fillStyle = '#f3efe2'; ctx.shadowColor = 'rgba(0,0,10,.8)'; ctx.shadowBlur = 8; ctx.fillText(s, x, y + dy);
  ctx.restore();
}
// a small label: a thin line up from the anchor, two lines of text wiped in from below
export function tag(ctx, t, ax, ay, u, top, bottom, o = {}) {
  if (u <= 0) return;
  const lx = ax + (o.dx ?? 60), ly = ay - (o.len ?? 120), lu = eoX(clamp(u * 1.6));
  ctx.save(); ctx.strokeStyle = 'rgba(243,239,226,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + (lx - ax) * lu, ay + (ly - ay) * lu); ctx.stroke();
  ctx.fillStyle = '#f3efe2'; ctx.beginPath(); ctx.arc(ax, ay, 3, 0, TAU); ctx.fill();
  const tu = clamp((u - .3) / .7);
  if (tu > 0) {
    ctx.beginPath(); ctx.rect(lx + 10, ly - 70, 900, 96); ctx.clip();
    const dy = (1 - eoX(tu)) * 80;
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    ctx.font = '600 26px Inter'; ctx.letterSpacing = '7px'; ctx.fillStyle = '#f3efe2'; ctx.fillText(top, lx + 16, ly - 30 + dy);
    ctx.font = '500 20px Inter'; ctx.letterSpacing = '5px'; ctx.fillStyle = '#a49fc4'; ctx.fillText(bottom, lx + 16, ly + 4 + dy);
  }
  ctx.restore();
}
