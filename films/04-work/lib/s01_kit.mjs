// s01_kit · helpers for chapter 01 "The biggest if" (only used by scenes/s01.mjs).
// Caching (static layers, figure sprites, glow sprites), the light-thread "if", camera transforms, paper ribbons.
import { createCanvas } from '@napi-rs/canvas';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, person, stipple, roughPath, vnoise } from './art.mjs';

// ---------------------------------------------------------------- caches
const STATIC = new Map();
export function memo(key, fn) { if (!STATIC.has(key)) STATIC.set(key, fn()); return STATIC.get(key); }

// glow sprite: radial gradient pre-rendered once, drawn additively (cheap per frame)
const GS = new Map();
function glowSprite(col, core) {
  const k = col + core; if (GS.has(k)) return GS.get(k);
  const c = createCanvas(128, 128), g = c.getContext('2d'), rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(.16, rgba(col, .62)); rg.addColorStop(.45, rgba(col, .18)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.fillRect(0, 0, 128, 128); GS.set(k, c); return c;
}
// stippled glow sprite (print grain in the falloff) for bigger lights
function grainSprite(col, core, seed = 1) {
  const k = 'g' + col + core + seed; if (GS.has(k)) return GS.get(k);
  const [c, g] = layer(256, 256), rg = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(.12, rgba(col, .7)); rg.addColorStop(.4, rgba(col, .22)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256); stipple(c, { k: .7, g: 1.2, seed }); GS.set(k, c); return c;
}
export function spot(ctx, x, y, r, a, col = C.amber, core = '#fff1d6', { grain = false, sy = 1 } = {}) {
  if (r <= 0 || a <= 0.003) return;
  const s = grain ? grainSprite(col, core) : glowSprite(col, core);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a);
  ctx.drawImage(s, x - r, y - r * sy, 2 * r, 2 * r * sy); ctx.restore();
}

// figure sprites: person() renders into its own canvas each call, so cache pose frames (LRU).
const FIG = new Map(); let FIGB = 0; const FIGMAX = 160e6;
const q = (v, s = .02) => Math.round(v / s) * s;
export function fig(ctx, x, y, s, pose, o = {}) {
  const P = {}; for (const [k, v] of Object.entries(pose)) P[k] = Array.isArray(v) ? v.map((u) => q(u)) : typeof v === 'number' ? q(v) : v;
  const sq = Math.round(s * 50) / 50, ld = o.light ? Math.round(Math.atan2(o.light.y - y, o.light.x - x) * 4) / 4 : 0;
  const key = JSON.stringify([P, sq, o.key || '', ld, !!o.flip]);
  let e = FIG.get(key);
  if (!e) {
    const pad = Math.ceil(220 * sq) + 6, c = createCanvas(pad * 2, pad * 2), g = c.getContext('2d');
    const oo = { ...o }; if (o.light) oo.light = { ...o.light, x: pad + Math.cos(ld) * 500, y: pad + Math.sin(ld) * 500 };
    const r = person(g, pad, pad, sq, P, oo);
    e = { c, pad, hands: [r.hand(0), r.hand(1)].map(([hx, hy]) => [hx - pad, hy - pad]) };
    e.b = c.width * c.height * 4; FIG.set(key, e); FIGB += e.b;
    while (FIGB > FIGMAX && FIG.size > 1) { const k0 = FIG.keys().next().value; FIGB -= FIG.get(k0).b; FIG.delete(k0); }
  } else { FIG.delete(key); FIG.set(key, e); }
  const k = s / sq;
  if (o.alpha !== undefined) { ctx.save(); ctx.globalAlpha = o.alpha; }
  ctx.drawImage(e.c, x - e.pad * k, y - e.pad * k, e.c.width * k, e.c.height * k);
  if (o.alpha !== undefined) ctx.restore();
  return { hand: (i) => [x + e.hands[i][0] * k, y + e.hands[i][1] * k], feetY: y + 88 * s };
}
export const lerpPose = (A, B, u) => { const o = { ...A }; for (const k of Object.keys(B)) { const a = A[k] ?? B[k], b = B[k]; o[k] = Array.isArray(b) ? b.map((v, i) => mix(a[i], v, u)) : typeof b === 'number' ? mix(a, b, u) : (u < .5 ? a : b); } return o; };

// ---------------------------------------------------------------- the light-thread "if"
// Monoline italic letters, unit = letter height (1 = cap to baseline). Origin at the centre of the word.
function bez(p0, p1, p2, p3, n = 24) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return o; }
const cat = (...a) => a.reduce((o, s) => o.concat(o.length ? s.slice(1) : s), []);
export const IF = (() => {
  // i stem: entry flick, slanted stroke, curled foot
  const i = cat(bez([-.52, -.16], [-.47, -.24], [-.42, -.3], [-.38, -.32]), bez([-.38, -.32], [-.42, -.12], [-.5, .1], [-.5, .2]), bez([-.5, .2], [-.5, .3], [-.41, .29], [-.33, .2]));
  // f: hooked top, long italic stem with a descender loop, then the crossbar
  const f = cat(bez([.5, -.6], [.54, -.86], [.3, -1.0], [.14, -.78]), bez([.13, -.76], [.07, -.56], [.03, -.26], [-.03, .08]), bez([-.03, .08], [-.09, .42], [-.15, .64], [-.28, .66]), bez([-.28, .66], [-.39, .66], [-.39, .55], [-.31, .51]));
  const bar = bez([-.15, -.3], [-.02, -.33], [.16, -.34], [.32, -.31], 12);
  const segs = [i, f, bar], len = segs.map((s) => { let L = 0; for (let k = 1; k < s.length; k++) L += Math.hypot(s[k][0] - s[k - 1][0], s[k][1] - s[k - 1][1]); return L; });
  return { segs, len, total: len.reduce((a, b) => a + b), dot: [-.33, -.52] };
})();
// draw the "if": u = writing progress 0..1, a = alpha, sc = letter height in px. dotA = alpha of the i dot (the lantern).
export function drawIf(ctx, cx, cy, sc, u, a = 1, { t = 0, dotA = 1, width = 1, hot = 1, glowK = 1 } = {}) {
  if (a <= 0) return;
  let left = u * IF.total; const n0 = vnoise(4);
  const lw = Math.max(1.5, sc * .011) * width;
  const pts = [];
  for (let s = 0; s < IF.segs.length; s++) {
    const seg = IF.segs[s], L = IF.len[s]; if (left <= 0) break;
    const frac = Math.min(1, left / L); left -= L;
    const n = Math.max(2, Math.ceil(seg.length * frac)); const P = seg.slice(0, n).map(([x, y], k) => [cx + x * sc + (n0(k * .3 + s * 9, t * .7) - .5) * sc * .004, cy + y * sc + (n0(k * .3 + s * 9 + 40, t * .7) - .5) * sc * .004]);
    pts.push(P);
  }
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = (P) => { ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (const p of P) ctx.lineTo(p[0], p[1]); };
  ctx.globalCompositeOperation = 'lighter';
  for (const [w, al] of [[lw * 9, .05], [lw * 4.5, .12], [lw * 2.2, .22]]) { ctx.strokeStyle = rgba(C.amber, al * a * glowK); ctx.lineWidth = w; for (const P of pts) path(P), ctx.stroke(); }
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = rgba('#fff3dc', a); ctx.lineWidth = lw; for (const P of pts) path(P), ctx.stroke();
  ctx.restore();
  // pen head while writing
  if (u > 0 && u < 1 && pts.length) { const P = pts[pts.length - 1], p = P[P.length - 1]; spot(ctx, p[0], p[1], sc * .09, .9 * a * hot, C.amber, '#fff6e2'); }
  // the i dot (the lantern light)
  if (dotA > 0) { const [dx, dy] = [cx + IF.dot[0] * sc, cy + IF.dot[1] * sc]; spot(ctx, dx, dy, sc * .16, .7 * a * dotA, C.amber, '#fff6e2', { grain: true }); ctx.fillStyle = rgba('#fff6e2', a * dotA); ctx.beginPath(); ctx.arc(dx, dy, lw * 1.9, 0, 7); ctx.fill(); }
  return { dot: [cx + IF.dot[0] * sc, cy + IF.dot[1] * sc] };
}

// ---------------------------------------------------------------- paper ribbon (flag) drawn in slices
// strip = pre-rendered canvas (paper + print). Anchored at (x,y) on its left edge; wave(q) -> [dy, twist] for q 0..1 along it.
export function ribbon(ctx, strip, x, y, len, hgt, wave, { slices = 140, alpha = 1, shadeCol = '#2a1830', light = .25, droop = 0 } = {}) {
  const sw = strip.width / slices;
  ctx.save(); ctx.globalAlpha = alpha;
  for (let i = 0; i < slices; i++) {
    const qn = i / slices, [dy, tw] = wave(qn), sx = x + qn * len, hh = hgt * Math.max(.08, Math.abs(Math.cos(tw)));
    const yy = y + dy + droop * qn * qn - hh / 2;
    ctx.drawImage(strip, i * sw, 0, sw + .6, strip.height, sx, yy, len / slices + 1.2, hh);
    const sh = Math.sin(tw);
    if (Math.abs(sh) > .02) { ctx.fillStyle = sh > 0 ? rgba(shadeCol, Math.min(.55, sh * .6)) : rgba('#fff4e0', Math.min(light, -sh * light)); ctx.fillRect(sx, yy, len / slices + 1.2, hh); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- misc
// camera: world point (cx,cy) at screen centre, zoom z; parallax p shifts the focus toward the layer's own centre
export function camT(ctx, cam, p = 1, ref = [W / 2, H / 2]) {
  const z = 1 + (cam.z - 1) * p, fx = ref[0] + (cam.x - ref[0]) * p, fy = ref[1] + (cam.y - ref[1]) * p;
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-fx, -fy);
}
export const toScreen = (cam, x, y, p = 1, ref = [W / 2, H / 2]) => { const z = 1 + (cam.z - 1) * p, fx = ref[0] + (cam.x - ref[0]) * p, fy = ref[1] + (cam.y - ref[1]) * p; return [W / 2 + (x - fx) * z, H / 2 + (y - fy) * z, z]; };
// keyframed value with smooth easing between keys: keys = [[t, v], ...]
export function keys(t, ks, ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) {
  if (t <= ks[0][0]) return ks[0][1]; if (t >= ks[ks.length - 1][0]) return ks[ks.length - 1][1];
  for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) { const u = ease((t - ks[i][0]) / (ks[i + 1][0] - ks[i][0])), a = ks[i][1], b = ks[i + 1][1]; return Array.isArray(a) ? a.map((v, j) => mix(v, b[j], u)) : mix(a, b, u); }
}
// paper bird (origami silhouette) flapping; dir = +1 flies right, -1 left
export function bird(ctx, x, y, s, t, { col = '#f3e6d0', dark = '#b9a48a', dir = 1, flap = 1, a = 1, rot = 0 } = {}) {
  const f = Math.sin(t * 9 * flap) * .9;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(dir * s, s);
  // far wing
  ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(10, -2); ctx.lineTo(-4 + 6 * f, -30 * f - 4); ctx.closePath(); ctx.fill();
  // body (folded paper: tail, belly, head)
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-34, -8); ctx.lineTo(-8, 4); ctx.lineTo(22, 2); ctx.lineTo(34, -8); ctx.lineTo(26, -2); ctx.lineTo(4, -4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(-8, 4); ctx.lineTo(22, 2); ctx.lineTo(4, -4); ctx.closePath(); ctx.fill();
  // near wing
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-10, -2); ctx.lineTo(12, -3); ctx.lineTo(-2 - 4 * f, 34 * -f + (f < 0 ? 0 : 0) - 6); ctx.closePath(); ctx.fill();
  ctx.restore();
}
export { W, H, C, rgba, clamp, mix, prng, mixHex, shade };
