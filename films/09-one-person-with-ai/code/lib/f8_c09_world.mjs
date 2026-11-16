// Film 8 · chunk c09 (08a from "India went further", shots 8.07–8.17) · the worlds of this chunk. Owner: B3. Others may import, never edit.
// Shared helpers used by c10/c11 too (B3): monotone camera keys, glow, crate, ghost figure, nest().
//
//   camKeys(keys)(t) → { x, y, d }        keys [[t, x, y, d, 'z'?], …] ('z': that segment is a zoom about its fixed point): Fritsch–Carlson monotone cubic per channel (d in log space): continuous
//                                         velocity through every key, no overshoot, eased start/end (MOTION.md "Smooth motion")
//   glow(ctx, x, y, r, col, a, core)      soft radial light ('lighter')
//   nest(ctx, rect, fn)                   draw a full-frame child world (fn(ctx)) into a screen rect (clip + transform)
//   crate(ctx, t, x, y, s, o)             an engraved wooden crate of fireflies (green light through the slats); x,y = bottom centre
//   priceTag(ctx, t, x, y, s, o)          the paper tag stuck on the hero crate; o.stamp = time of the stamp (text pressed in red)
//   ghostFig(ctx, x, y, h, o)             a dotted ghost figure (a conductor that does not exist yet); x,y = feet, h = height px
//   worldIndia(ctx, t, cam, S)            8.07–8.09: India at dawn, the gold line that becomes the skyline, the row of workshops
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, canvas } from '../engine.mjs';
import { F8, landCam, workshop, firefly, swarm, conductor, mistBand, qio, eoutX, einX } from './f8_kit.mjs';
import { vnoise, fbm } from './art.mjs';
import { inkText } from './f8_chart.mjs';

const TAU = Math.PI * 2;
export const sine = (x) => .5 - .5 * Math.cos(Math.PI * clamp(x));

// ---------------------------------------------------------------- caches (canvas → Image)
const IM = new Map(); let PEND = [];
export function cached(key, w, h, paint) {
  let e = IM.get(key); if (e) return e.img || e.c;
  const [c, g] = canvas(w, h); paint(g, c); e = { c, img: null }; IM.set(key, e);
  PEND.push(loadImage(c.toBuffer('image/png')).then((im) => { e.img = im; e.c = null; })); return c;
}
export async function b3Ready() { while (PEND.length) { const p = PEND; PEND = []; await Promise.all(p); } }

// ---------------------------------------------------------------- camera keys (monotone cubic, d in log space)
export function camKeys(keys) {
  const n = keys.length, T = keys.map((k) => k[0]);
  const ch = [1, 2, 3].map((c) => keys.map((k) => (c === 3 ? Math.log(k[3]) : k[c])));
  const M = ch.map((v) => {
    const del = [], m = new Array(n).fill(0);
    for (let i = 0; i < n - 1; i++) del.push((v[i + 1] - v[i]) / (T[i + 1] - T[i]));
    for (let i = 1; i < n - 1; i++) m[i] = del[i - 1] * del[i] <= 0 ? 0 : 3 * (T[i + 1] - T[i - 1]) / ((2 * T[i + 1] - T[i] - T[i - 1]) / del[i - 1] + (T[i + 1] + T[i] - 2 * T[i - 1]) / del[i]);
    return m;
  });
  return (t) => {
    if (t <= T[0]) return { x: ch[0][0], y: ch[1][0], d: Math.exp(ch[2][0]) };
    if (t >= T[n - 1]) return { x: ch[0][n - 1], y: ch[1][n - 1], d: Math.exp(ch[2][n - 1]) };
    let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
    const h = T[i + 1] - T[i], q = (t - T[i]) / h, h00 = 2 * q ** 3 - 3 * q * q + 1, h10 = q ** 3 - 2 * q * q + q, h01 = -2 * q ** 3 + 3 * q * q, h11 = q ** 3 - q * q;
    const v = ch.map((c, k) => h00 * c[i] + h10 * h * M[k][i] + h01 * c[i + 1] + h11 * h * M[k][i + 1]);
    const d = Math.exp(v[2]);
    // 'z' on the segment's end key: a pure zoom about the one point that keeps its screen position in both framings (no sideways
    // swish while the scale changes: the least change per frame). x, y follow d. Keys on both sides should be holds (velocity 0).
    if (keys[i + 1][4] === 'z') {
      const [, x0, y0, d0] = keys[i], [, x1, y1, d1] = keys[i + 1], den = 1 / d0 - 1 / d1;
      if (Math.abs(den) > 1e-9) { const px = (x0 / d0 - x1 / d1) / den, py = (y0 / d0 - y1 / d1) / den; return { x: px + (x0 - px) * d / d0, y: py + (y0 - py) * d / d0, d }; }
    }
    return { x: v[0], y: v[1], d };
  };
}

// ---------------------------------------------------------------- small helpers
export function glow(ctx, x, y, r, col, a = 1, core = null) {
  if (a <= .003 || r < .5) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(core || col, Math.min(1, a))); g.addColorStop(.18, rgba(col, .55 * Math.min(1, a))); g.addColorStop(.5, rgba(col, .14 * Math.min(1, a))); g.addColorStop(1, rgba(col, 0));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}
export function nest(ctx, R, fn) {
  ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip(); ctx.translate(R.x, R.y); ctx.scale(R.w / W, R.h / H); fn(ctx); ctx.restore();
}
// diagonal engraved hatch inside the current path (screen spaced)
export function hatchIn(ctx, box, gap = 5, a = .25, ang = -.9, col = '#000000') {
  const [x, y, w, h] = box; if (w <= 0 || h <= 0) return;
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = Math.max(.6, gap * .22); ctx.beginPath();
  const c = Math.cos(ang), s = Math.sin(ang), R = Math.hypot(w, h) / 2 + 2, cx = x + w / 2, cy = y + h / 2;
  for (let d = -R; d <= R; d += gap) { ctx.moveTo(cx - s * d - c * R, cy + c * d - s * R); ctx.lineTo(cx - s * d + c * R, cy + c * d + s * R); }
  ctx.stroke(); ctx.restore();
}

// ---------------------------------------------------------------- the crate of fireflies
// x,y = bottom centre (screen), s = px per unit (crate 60 × 40 units); o = { lid 0..1 (open), light 1, seed }
export function crate(ctx, t, x, y, s, o = {}) {
  const w = 60 * s, h = 40 * s, x0 = x - w / 2, y0 = y - h, L = o.light ?? 1, r = prng(o.seed ?? 3);
  // shadow on the ground
  ctx.save(); const sg = ctx.createRadialGradient(x, y, 0, x, y, w * .8); sg.addColorStop(0, 'rgba(8,6,12,.5)'); sg.addColorStop(1, 'rgba(8,6,12,0)'); ctx.translate(x, y); ctx.scale(1, .18); ctx.fillStyle = sg; ctx.fillRect(-w, -w, 2 * w, 2 * w); ctx.restore();
  // green light inside (seen through the slats), breathing
  const br = .85 + .15 * Math.sin(t * 2.3 + (o.seed ?? 3));
  ctx.fillStyle = '#0d1a16'; ctx.fillRect(x0, y0, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
  const ig = ctx.createRadialGradient(x, y0 + h * .45, 0, x, y0 + h * .45, w * .7); ig.addColorStop(0, rgba(F8.greenCore, .95 * L * br)); ig.addColorStop(.35, rgba(F8.green, .7 * L * br)); ig.addColorStop(1, rgba(F8.greenDeep, .2 * L)); ctx.fillStyle = ig; ctx.fillRect(x0, y0, w, h);
  ctx.restore();
  // planks (horizontal), with gaps where the light leaks
  const wood = o.wood || '#7a5532', woodD = '#4a3020';
  for (let i = 0; i < 4; i++) {
    const py = y0 + i * h / 4 + h * .02, ph = h / 4 - h * .07;
    ctx.fillStyle = i % 2 ? wood : '#84603a'; ctx.fillRect(x0, py, w, ph);
    ctx.strokeStyle = rgba(woodD, .7); ctx.lineWidth = Math.max(.6, .5 * s); ctx.beginPath();
    for (let k = 0; k < 3; k++) { const gy = py + ph * (.25 + .25 * k) + r() * 2; ctx.moveTo(x0 + 2, gy); ctx.bezierCurveTo(x0 + w * .3, gy + r() * 2 - 1, x0 + w * .7, gy + r() * 2 - 1, x0 + w - 2, gy); }
    ctx.stroke();
  }
  // corner posts + diagonal brace
  ctx.fillStyle = '#5a3c24'; ctx.fillRect(x0, y0, 5 * s, h); ctx.fillRect(x0 + w - 5 * s, y0, 5 * s, h);
  ctx.strokeStyle = '#5a3c24'; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(x0 + 5 * s, y - 2 * s); ctx.lineTo(x0 + w - 5 * s, y0 + 2 * s); ctx.stroke();
  ctx.strokeStyle = rgba('#20140c', .8); ctx.lineWidth = Math.max(.8, .8 * s); ctx.strokeRect(x0, y0, w, h);
  // the dawn rim (light from behind, upper right)
  ctx.strokeStyle = rgba('#ffd9a0', .55 * (o.rim ?? 1)); ctx.lineWidth = Math.max(1, 1.2 * s); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.lineTo(x0 + w, y0 + h * .6); ctx.stroke();
  // lid, hinged at the back: lifts a little when open, light spills up
  const lid = clamp(o.lid ?? 0);
  ctx.save(); ctx.translate(x0, y0); ctx.rotate(-.5 * lid); ctx.fillStyle = '#6a4a2c'; ctx.fillRect(-2 * s, -5 * s, w + 4 * s, 5 * s); ctx.strokeStyle = rgba('#20140c', .8); ctx.lineWidth = Math.max(.8, .8 * s); ctx.strokeRect(-2 * s, -5 * s, w + 4 * s, 5 * s); ctx.restore();
  glow(ctx, x, y0 + h * .4, w * (.9 + .5 * lid), F8.green, .32 * L * br, F8.greenCore);
  if (lid > 0) glow(ctx, x, y0 - 4 * s, w * .9 * lid, F8.green, .4 * lid * L, F8.greenCore);
  return { top: [x, y0], w, h };
}

// the price tag: a cream card on a thin stick out of the crate; stamped in red at o.stamp. x,y = stick foot, s = px per unit (tag 92 × 52)
export function priceTag(ctx, t, x, y, s, o = {}) {
  const sway = .02 * Math.sin(t * 1.1 + 1) + .01 * Math.sin(t * 2.3);
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.04 + sway);
  ctx.strokeStyle = '#5a3c24'; ctx.lineWidth = 2.2 * s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -30 * s); ctx.stroke();
  const w = 104 * s, h = 58 * s, x0 = -w / 2, y0 = -30 * s - h;
  ctx.save(); ctx.shadowColor = 'rgba(10,6,4,.45)'; ctx.shadowBlur = 8 * s; ctx.shadowOffsetX = 3 * s; ctx.shadowOffsetY = 4 * s;
  ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.moveTo(x0 + 10 * s, y0); ctx.lineTo(x0 + w, y0); ctx.lineTo(x0 + w, y0 + h); ctx.lineTo(x0 + 10 * s, y0 + h); ctx.lineTo(x0, y0 + h / 2); ctx.closePath(); ctx.fill(); ctx.restore();
  const g = ctx.createLinearGradient(x0, y0, x0 + w, y0 + h); g.addColorStop(0, 'rgba(255,235,200,.25)'); g.addColorStop(1, 'rgba(120,80,40,.18)'); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = 'rgba(90,70,50,.55)'; ctx.lineWidth = Math.max(.8, .6 * s); ctx.stroke();
  ctx.beginPath(); ctx.arc(x0 + 7 * s, y0 + h / 2, 2.4 * s, 0, TAU); ctx.fillStyle = '#5a4a3a'; ctx.fill();
  // the stamp: pressed in on contact (slight overshoot ≤ 4 %), ink a little uneven
  const st = o.stamp;
  if (st != null && t > st - .12) {
    const k = t - st, land = k >= 0, sq = land ? 1 + .04 * Math.exp(-k * 10) * Math.cos(k * 34) : mix(1.25, 1, eoutX((k + .12) / .12));
    ctx.save(); ctx.translate(x0 + w * .55, y0 + h * .5); ctx.rotate(-.04); ctx.scale(sq, sq);
    ctx.globalAlpha = land ? .93 : .25;
    const red = '#b23a2a';
    ctx.strokeStyle = red; ctx.lineWidth = 1.5 * s; ctx.strokeRect(-42 * s, -23 * s, 84 * s, 46 * s);
    inkText(ctx, '≈ $1', 0, 6 * s, { size: 25 * s, font: 'serif', align: 'center', color: red });
    inkText(ctx, 'PER CHIP · PER HOUR', 0, 17 * s, { size: 5.2 * s, font: 'caps', align: 'center', color: red });
    ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the dotted ghost figure (a conductor that does not exist yet)
const GH = { w: 150, h: 260 };
function ghostSprite(pose) {
  return cached('ghost:' + pose, GH.w, GH.h, (g) => {
    const [c2, g2] = canvas(GH.w, GH.h);
    conductor(g2, 0, GH.w / 2, GH.h - 14, 1.25, { view: 'back', pose, glow: 0, rim: 0, seed: 8, light: { x: GH.w, y: 0 } });
    const d = g2.getImageData(0, 0, GH.w, GH.h).data, A = (x, y) => (x < 0 || y < 0 || x >= GH.w || y >= GH.h ? 0 : d[(y * GH.w + x) * 4 + 3]);
    g.fillStyle = '#fff2d6';
    for (let y = 0; y < GH.h; y += 2) for (let x = 0; x < GH.w; x += 2) {
      if (A(x, y) < 120) continue;
      const edge = A(x - 3, y) < 60 || A(x + 3, y) < 60 || A(x, y - 3) < 60 || A(x, y + 3) < 60;
      if (edge ? (x + y) % 4 === 0 : (x % 8 === 0 && y % 8 === 0)) { g.beginPath(); g.arc(x, y, edge ? 1.5 : 1.0, 0, TAU); g.fill(); }
    }
  });
}
// x,y = feet; h = figure height (px); o = { pose 'handHalf'|'stand', a 1, rev 0..1 (dots revealed from the feet up), t, seed }
export function ghostFig(ctx, x, y, h, o = {}) {
  const im = ghostSprite(o.pose || 'handHalf'), k = h / 232, rev = clamp(o.rev ?? 1); if (rev <= 0) return;
  const t = o.t ?? 0, jit = Math.sin(t * 7.1 + (o.seed || 0) * 3) > .93 ? 1 : 0, a = (o.a ?? 1) * (.82 + .18 * Math.sin(t * 2.7 + (o.seed || 0)));
  ctx.save(); ctx.globalAlpha = clamp(a);
  const top = y - GH.h * k * rev; ctx.beginPath(); ctx.rect(x - GH.w * k, top, GH.w * 2 * k, GH.h * k * rev + 2); ctx.clip();
  ctx.drawImage(im, x - GH.w / 2 * k + jit * k, y - (GH.h - 14) * k, GH.w * k, GH.h * k); ctx.restore();
}

// ---------------------------------------------------------------- WORLD A · India at dawn (8.07–8.09)
// Reference design space as the kit's landCam (cam {960,540,1}); horizon y 600. cam = { x, y, d } (d = dist).
export const HZ = 600;
// a copy of handoff4's line plate background, with its line at y (so the plate's line can become the horizon)
const LINE = ['#f3d9a0', '#fff8e6'];
function lineGround(ctx, t, y, hatchA = 1) {
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, y, 0, W / 2, y, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  if (hatchA > 0) { ctx.strokeStyle = `rgba(160,150,220,${.05 * hatchA})`; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke(); }
}
// the plate's gold line along a polyline (screen), alpha a; with ticks (engraving) when flat
function goldLine(ctx, t, pts, a = 1, ticks = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const br = .9 + .1 * Math.sin(t * 2.1);
  for (const [w, al, c] of [[26, .05, LINE[0]], [10, .14, LINE[0]], [3.2, .55 * br, LINE[0]], [1.4, .95, LINE[1]]]) {
    ctx.strokeStyle = rgba(c, al * a); ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  }
  if (ticks > 0) { ctx.strokeStyle = rgba(LINE[1], .35 * a * ticks); ctx.lineWidth = 1; ctx.beginPath(); const y0 = pts[0][1]; for (let x = -1400 + W / 2; x < 1400 + W / 2; x += 9) { const hh = 2 + 1.5 * Math.sin((x - W / 2) * .07 + t); ctx.moveTo(x, y0 - hh); ctx.lineTo(x + 3, y0 + hh); } ctx.stroke(); }
  ctx.restore();
}

// skyline rows: buildings along reference x, their top contour as [x, h] relative to the base (h up)
function skyline(seed, x0, x1, hmax, mode, marks = []) {
  const r = prng(seed), out = []; let x = x0;
  const env = (x) => .32 + .68 * Math.exp(-Math.pow((x - 1050) / 520, 2)) + .35 * Math.exp(-Math.pow((x - 300) / 260, 2));
  while (x < x1) {
    const mk = marks.find((m) => m.x >= x && m.x < x + 60);
    if (mk) { out.push({ ...mk, s: r(), gap: 6, win: .8 }); x = mk.x + mk.w + 6; continue; }
    const kind = r(), w = 16 + r() * 40; let shape;
    const h = (.18 + .82 * Math.pow(r(), 1.6)) * hmax * env(x);
    if (mode === 'far') shape = kind < .08 ? 'dome' : kind < .2 ? 'tower' : 'block';
    else shape = kind < .05 ? 'dome' : kind < .08 ? 'shikhara' : kind < .1 ? 'minaret' : kind < .3 ? 'tower' : kind < .35 ? 'tank' : kind < .4 && mode === 'near' ? 'palm' : 'block';
    out.push({ x, w: shape === 'minaret' ? 7 : shape === 'palm' ? 26 : shape === 'tower' ? w * .7 : w, h: shape === 'tower' ? h * 1.5 : shape === 'shikhara' ? h * 1.2 : h, shape, s: r(), gap: r() < .2 ? 3 + r() * 14 : 0, win: r() });
    x += out[out.length - 1].w + out[out.length - 1].gap;
  }
  return out;
}
// the top contour of one building as points [x, hUp] (absolute ref x); u = how far it has risen (0 flat … 1 full)
function bTop(b, u) {
  const x = b.x, w = b.w, h = b.h * u, P = [];
  if (b.shape === 'dome') { const bh = h * .55, R = w * .42; P.push([x, 0], [x, bh], [x + w * .08, bh]); for (let i = 0; i <= 10; i++) { const a = Math.PI - i / 10 * Math.PI, ox = x + w / 2 + Math.cos(a) * R, oy = bh + Math.sin(a) * R * 1.15 * u + (i === 5 ? 0 : 0); P.push([ox, oy]); if (i === 5) P.push([ox, oy + 10 * u], [ox + .1, oy]); } P.push([x + w * .92, bh], [x + w, bh], [x + w, 0]); return P; }
  if (b.shape === 'shikhara') { P.push([x, 0], [x, h * .25]); for (let i = 0; i <= 8; i++) { const q = i / 8, hw = w / 2 * (1 - Math.pow(q, 1.6)) * .92; P.push([x + w / 2 - hw, h * (.25 + .7 * q) + (i % 2) * 2 * u]); } P.push([x + w / 2, h * 1.02]); for (let i = 8; i >= 0; i--) { const q = i / 8, hw = w / 2 * (1 - Math.pow(q, 1.6)) * .92; P.push([x + w / 2 + hw, h * (.25 + .7 * q) + (i % 2) * 2 * u]); } P.push([x + w, h * .25], [x + w, 0]); return P; }
  if (b.shape === 'minaret') return [[x, 0], [x, h * 1.5], [x + w * .5, h * 1.6], [x + w, h * 1.5], [x + w, 0]];
  if (b.shape === 'tower') return [[x, 0], [x, h], [x + w * .2, h], [x + w * .2, h * 1.05], [x + w * .8, h * 1.05], [x + w * .8, h], [x + w, h], [x + w, 0]];
  if (b.shape === 'tank') { const th = h * .7; return [[x, 0], [x + w * .2, th], [x + w * .05, th], [x + w * .05, th + 14 * u], [x + w * .95, th + 14 * u], [x + w * .95, th], [x + w * .8, th], [x + w, 0]]; }
  if (b.shape === 'palm') { const th = h * 1.1; return [[x + w * .45, 0], [x + w * .47, th], [x, th - 8 * u], [x + w * .48, th + 4 * u], [x + w * .2, th + 12 * u], [x + w * .52, th + 6 * u], [x + w * .8, th + 13 * u], [x + w * .55, th + 3 * u], [x + w, th - 7 * u], [x + w * .53, th], [x + w * .55, 0]]; }
  return [[x, 0], [x, h], [x + w, h], [x + w, 0]];
}
const ROWS = [
  { d: 7, base: 598, seed: 5, hmax: 70, x0: -1800, x1: 3800, mode: 'far', c0: '#7a5468', c1: '#5c3e58', rim: '#ffd9a8', rimA: .35, rise: [445.0, 1.6] },
  { d: 3.2, base: 600, seed: 9, hmax: 118, x0: -1200, x1: 3200, mode: 'mid', c0: '#3a2840', c1: '#2a1e34', rim: '#ffe2b0', rimA: .75, rise: [444.24, 1.25], hero: true },
  { d: 1.6, base: 628, seed: 13, hmax: 150, x0: -900, x1: 2900, mode: 'near', c0: '#2a1d30', c1: '#1c1424', rim: '#ffcf96', rimA: .45, rise: [445.5, 1.4] },
];
// landmarks of the hero row: a great temple tower, a domed hall with two minarets, a cluster of towers by the sun
const MARKS = [{ x: 330, w: 70, h: 150, shape: 'shikhara' }, { x: 404, w: 40, h: 96, shape: 'shikhara' }, { x: 1580, w: 8, h: 92, shape: 'minaret' }, { x: 1596, w: 96, h: 70, shape: 'dome' }, { x: 1700, w: 8, h: 92, shape: 'minaret' },
  { x: 980, w: 34, h: 210, shape: 'tower' }, { x: 1020, w: 28, h: 168, shape: 'tower' }, { x: 1120, w: 30, h: 236, shape: 'tower' }, { x: 1156, w: 40, h: 150, shape: 'tower' }, { x: 760, w: 60, h: 64, shape: 'dome' }];
const ROWB = ROWS.map((R) => skyline(R.seed, R.x0, R.x1, R.hmax, R.mode, R.hero ? MARKS : []));
// rise of building b in row R at time t (from the centre outward, expo-out each)
function riseOf(R, b, t) { const c = Math.abs(b.x + b.w / 2 - 980) / 1400; return eoutX((t - R.rise[0] - c * R.rise[1] * .55) / (R.rise[1] * .55)); }

// the sky and the sun (screen space, tilting slightly with the horizon)
function dawnSky(ctx, t, yH, dawn) {
  if (dawn <= 0) return;
  const g = ctx.createLinearGradient(0, yH - 900, 0, yH);
  g.addColorStop(0, '#141432'); g.addColorStop(.42, '#3a2a56'); g.addColorStop(.72, '#9a5a6a'); g.addColorStop(.9, '#e09a72'); g.addColorStop(1, '#f6cf98');
  ctx.save(); ctx.globalAlpha = dawn; ctx.fillStyle = g; ctx.fillRect(0, 0, W, Math.max(0, yH + 2)); ctx.restore();
}
export function worldIndia(ctx, t, cam, S) {
  const c = { x: cam.x, y: cam.y, dist: cam.d }, dawn = S.dawn(t), P0 = landCam(c, 0);
  const yH = landCam(c, 40).RY(HZ), haze = sm(clamp((t - 444.2) / .7));   // the ground layers rise out of the plate's dark over .7 s
  lineGround(ctx, t, yH, 1 - dawn);
  dawnSky(ctx, t, yH, dawn);
  // the sun, low behind the city: the hero light
  { const Ps = landCam(c, 40), sx = Ps.RX(1270), sy = Ps.RY(HZ - 6), k = Ps.s;
    glow(ctx, sx, sy, 900 * k, '#ffb070', .5 * dawn, '#ffe7c0'); glow(ctx, sx, sy, 260 * k, '#ffd090', .55 * dawn, '#fff4dc');
    ctx.save(); ctx.globalAlpha = dawn; ctx.fillStyle = '#fff3d6'; ctx.beginPath(); ctx.arc(sx, sy, 34 * k, 0, TAU); ctx.fill(); ctx.restore(); }
  // the rows of the city
  for (let ri = 0; ri < ROWS.length; ri++) {
    const R = ROWS[ri], P = landCam(c, R.d), X = P.RX, Y = P.RY, sc = P.s;
    if (ri === 1 && (S.mist ?? 1)) mistBand(ctx, t, c, 4.5, HZ - 6, { seed: 21, a: .55 * dawn, v: 3, col: '#f0b48a', h: .5 });
    if (ri === 2) mistBand(ctx, t, c, 2.2, 616, { seed: 22, a: .45 * dawn, v: 5, col: '#d8a088', h: .45 });
    const pts = []; let any = false;
    for (const b of ROWB[ri]) {
      if (X(b.x + b.w) < -40 || X(b.x) > W + 40) continue;
      const u = riseOf(R, b, t); if (u > .002) any = true;
      for (const [px, ph] of bTop(b, u)) pts.push([X(px), Y(R.base - ph)]);
    }
    if (!pts.length) continue;
    const yb = Y(R.base);
    if (any || R.hero) {
      ctx.save(); ctx.beginPath(); ctx.moveTo(pts[0][0], yb + 2); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(pts[pts.length - 1][0], yb + 2); ctx.closePath();
      const top = Math.min(...pts.map((p) => p[1])), gr = ctx.createLinearGradient(0, top, 0, yb);
      // before dawn the silhouettes are the plate's dark; they take their colour with the light
      gr.addColorStop(0, R.c0); gr.addColorStop(1, R.c1); ctx.globalAlpha = R.hero ? 1 : haze; ctx.fillStyle = R.hero ? '#0a0c22' : gr; ctx.fill();
      if (R.hero) { ctx.globalAlpha = dawn; ctx.fillStyle = gr; ctx.fill(); }
      ctx.globalAlpha = 1; hatchIn(ctx, [pts[0][0], top, pts[pts.length - 1][0] - pts[0][0], yb - top], 5 + 3 * sc, .22 * dawn, -1.0);
      ctx.restore();
      // lit windows (morning lights), only nearer rows
      if (ri > 0 && dawn > 0) { ctx.save(); ctx.fillStyle = rgba('#ffcf8a', .7 * dawn); for (const b of ROWB[ri]) { if (b.shape !== 'block' && b.shape !== 'tower' || b.win < .5) continue; const u = riseOf(R, b, t); if (u < .9) continue; const x0 = X(b.x), x1 = X(b.x + b.w); if (x1 < 0 || x0 > W) continue; const r2 = prng(Math.round(b.x * 7)); for (let k = 0; k < 4; k++) { const wx = mix(x0, x1, .15 + .7 * r2()), wy = Y(R.base - b.h * (.15 + .6 * r2())); ctx.fillRect(wx, wy, Math.max(1, 2.4 * sc), Math.max(1, 3 * sc)); } } ctx.restore(); }
    }
    // the rim of dawn along the contour; for the hero row it is the plate's gold line becoming the skyline's rim
    if (R.hero) {
      const flat = 1 - sm(clamp((t - 444.4) / 1.6));
      goldLine(ctx, t, pts.map(([x, y]) => [x, y + 2 * Math.sin(t * .9) * flat]), .45 + .55 * flat, flat);
      // the line continues across the whole frame beyond the row's ends while it is the plate's line
      if (pts[0][0] > -30) goldLine(ctx, t, [[-60, yb], [pts[0][0], yb]], .45 + .55 * flat, 0);
      if (pts[pts.length - 1][0] < W + 30) goldLine(ctx, t, [[pts[pts.length - 1][0], yb], [W + 60, yb]], .45 + .55 * flat, 0);
    } else if (dawn > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(R.rim, R.rimA * dawn * haze); ctx.lineWidth = 1.2; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
    }
  }
  // the ground in front of the city: a plain, fields with palms, the near street (they rise out of the plate's dark)
  groundLayers(ctx, t, c, dawn, haze);
  if (S.after) S.after(ctx, t, c, P0);
}
const PALMS = (() => { const r = prng(61), o = []; for (let i = 0; i < 90; i++) o.push({ sx: -1200 + r() * 4400, band: r() < .5 ? 1 : 2, dy: 8 + r() * 70, h: 20 + r() * 26, lean: (r() - .5) * .3, seed: r() * 100 }); return o.sort((a, b) => a.dy - b.dy); })();
const TOWN = skyline(17, -1400, 3400, 46, 'near');
function palm(ctx, x, y, h, lean, t, seed, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(lean); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(1, h * .05); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(h * .08, -h * .5, 0, -h); ctx.stroke();
  const sw = Math.sin(t * .9 + seed) * .05;
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .48 + sw, L = h * (.42 + .1 * Math.sin(i * 2.1 + seed)); ctx.beginPath(); ctx.moveTo(0, -h); ctx.quadraticCurveTo(Math.cos(a) * L * .6, -h + Math.sin(a) * L * .6 - L * .15, Math.cos(a) * L, -h + Math.sin(a) * L + L * .3); ctx.lineWidth = Math.max(1, h * .035); ctx.stroke(); }
  ctx.restore();
}
function groundLayers(ctx, t, c, dawn, haze) {
  const bands = [
    { d: 2.4, top: 606, c0: '#3a2836', c1: '#2a1e2c', amp: 4 },
    { d: 1.15, top: 660, c0: '#33242c', c1: '#241a22', amp: 10, fields: true },
    { d: .55, top: 790, c0: '#2e2026', c1: '#1e161c', amp: 18, fields: true },
    { d: 0, top: 1180, c0: '#3a2a26', c1: '#1c1418', amp: 6, street: true },
  ];
  for (const B of bands) {
    const P = landCam(c, B.d), X = P.RX, Y = P.RY; if (Y(B.top) > H + 40) continue;
    const n = vnoise(Math.round(B.d * 100) + 3), pts = []; for (let x = -1400; x <= 3400; x += 40) pts.push([X(x), Y(B.top - B.amp * (fbm(n, x * .002, 1, 3) - .5) * 2)]);
    ctx.save(); ctx.beginPath(); ctx.moveTo(pts[0][0], H + 10); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(pts[pts.length - 1][0], H + 10); ctx.closePath();
    const top = Y(B.top), gr = ctx.createLinearGradient(0, top - 20, 0, Math.min(H, top + 500 * P.s)); gr.addColorStop(0, B.c0); gr.addColorStop(1, B.c1);
    ctx.globalAlpha = haze; ctx.fillStyle = '#0a0c22'; ctx.fill(); ctx.globalAlpha = dawn * haze; ctx.fillStyle = gr; ctx.fill(); ctx.globalAlpha = 1;
    ctx.save(); ctx.clip();
    // furrows converging toward the sun (fields) / dust ruts (street)
    if (B.fields && dawn > 0) { ctx.strokeStyle = rgba('#d9a070', .09 * dawn); ctx.lineWidth = 1; ctx.beginPath(); const vx = landCam(c, 40).RX(1270); for (let k = -30; k <= 30; k++) { const bx = X(960 + k * 160); ctx.moveTo(bx, H + 10); ctx.lineTo(mix(bx, vx, .7), top); } ctx.stroke(); }
    hatchIn(ctx, [0, top - 30, W, H - top + 40], 6, .2 * dawn, -.95);
    ctx.restore();
    // the rim where the land catches the low sun
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffcf96', .28 * dawn * haze); ctx.lineWidth = 1.1; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    ctx.restore();
    // palms standing on this band
    const bi = bands.indexOf(B);
    if (dawn > 0) for (const p of PALMS) { if (p.band !== bi) continue; const x = X(p.sx); if (x < -60 || x > W + 60) continue; const y = Y(B.top + p.dy); ctx.save(); ctx.globalAlpha = dawn * haze; palm(ctx, x, y, p.h * P.s, p.lean, t, p.seed, '#1a1220'); ctx.restore(); }
    if (bi === 2) townRow(ctx, t, c, dawn, haze);
  }
}
// low houses and trees between the fields and the street (the town the workshops belong to)
function townRow(ctx, t, c, dawn, haze) {
  const P = landCam(c, .32), X = P.RX, Y = P.RY, base = 900, pts = [];
  for (const b of TOWN) { if (X(b.x + b.w) < -40 || X(b.x) > W + 40) continue; for (const [px, ph] of bTop(b, 1)) pts.push([X(px), Y(base - ph)]); }
  if (!pts.length) return;
  const yb = Y(base) + 4, top = Math.min(...pts.map((p) => p[1]));
  ctx.save(); ctx.beginPath(); ctx.moveTo(pts[0][0], yb + 30 * P.s); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(pts[pts.length - 1][0], yb + 30 * P.s); ctx.closePath();
  ctx.globalAlpha = haze; ctx.fillStyle = '#0a0c22'; ctx.fill(); ctx.globalAlpha = dawn * haze; ctx.fillStyle = '#211826'; ctx.fill(); ctx.globalAlpha = 1;
  hatchIn(ctx, [pts[0][0], top, pts[pts.length - 1][0] - pts[0][0], yb - top + 30 * P.s], 6, .2 * dawn, -1);
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffcf96', .3 * dawn * haze); ctx.lineWidth = 1; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
  if (dawn > 0) { ctx.save(); ctx.fillStyle = rgba('#ffc878', .75 * dawn * haze); for (const b of TOWN) { if (b.shape !== 'block' || b.win < .45) continue; const x0 = X(b.x), x1 = X(b.x + b.w); if (x1 < 0 || x0 > W) continue; const r2 = prng(Math.round(b.x * 3)); for (let k = 0; k < 2; k++) ctx.fillRect(mix(x0, x1, .2 + .6 * r2()), Y(base - b.h * (.25 + .4 * r2())), Math.max(1, 3 * P.s), Math.max(1, 4 * P.s)); } ctx.restore(); }
}
