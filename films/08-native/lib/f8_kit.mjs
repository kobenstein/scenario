// Film 8 kit · "The Rise of AI-Native Companies" (owner: c01 builder). The organism: weave (memory), fireflies (hands), conductor (will),
// workshop (the whole company), anatomy plate, night land. Pure functions of t, screen space 1920×1080, deterministic (prng).
// Other builders import, never edit. Signatures below are FINAL; the drawing behind them improves.
//
//   await ready()                          build the cached sprites/layers as Images (call once in your async default export)
//   F8                                     palette { night, violet, gold, goldCore, green, greenCore, amber, amberCore, rust, ink, paper }
//   qio(x)                                 quart in-out (MOTION: moves) · eoutX(x) expo-out (entrances) · einX(x) expo-in (exits)
//
// ---- night land (fire-circle reference) ----
//   landCam(cam, d) → { k, X(wx), Y(wy), RX(sx), RY(sy), s }  world → screen at depth d (0 = subject plane, + farther); RX/RY map a
//                                          point designed at the reference camera {960,540,1}. cam = { x, y, dist 1 }
//   nightLand(ctx, t, { cam, ridges 4, mist 1, milky 1, stars 1, moon null|{x,y,r}, seed 1, dim 0, horizon '#2a2350', top '#060818' })
//       o.after(i, proj) is called right after ridge i is drawn (put workshops/houses standing on it there); ridgeY(i, sx) = crest height
//       → { proj(d) }   indigo ridges in parallax, mist between them, Milky Way, twinkling stars. At cam {960,540,1} the ridges sit
//       at their design positions (horizon ≈ y 600, valley floor ≈ y 760–900).
//
// ---- the memory: an organic neural network (MOTION §1, revised 2026-10-23; API names kept from the old weave) ----
//   weave(ctx, t, { x, y, w, h, depth 3, seed 1, a 1, old .45, oldGlow 0, cols 34, rows 20, shimmer 1, persp .3, shape 'brain'|'cloud' (auto:
//                   brain when w/h ≤ 2.8), thick 1, stitches [{ t0, u, v, glyph, from [sx,sy], s, dur }], pulse { u, x .5, y .5 }, ghost 0,
//                   knots [{ u, v, untie 0..1, r }], tear { rect [u0,v0,u1,v1], u 0..1, to [dx,dy], rot }, clip [x,y,w,h] })
//       → { at(u, v, layer 0) → [x,y], rect, nodes(layer 0) → [[x,y,r]…] }   nodes (somata) joined by curved tapering filaments with
//       dendrites; signals travel along them, the whole breathes (4.2 s), nodes twinkle; seen whole the node cloud is two hemispheres.
//       cols × rows only set the node density now (no grid); glyphs is ignored (glyphs appear only by new nodes). Static parts are cached
//       per layer (first call of a new size/seed costs 2–7 s once); very close (rect wider than ~3200 px) it is drawn as culled vectors.
//   stitch(ctx, t, t0, x, y, glyph, { from [sx,sy], s 1, dur .7, to [[x,y]…] }) a spark arrives from `from` (first half of dur), the node
//       sprouts with a flash, 2–4 filaments grow to `to` (weave({stitches}) passes the 3 nearest nodes), they light up 60–120 ms later;
//       glyph: 'meeting' | 'envelope' | 'check' | 'cross' | 'question' | null sits by the new node ~1 s, then slides into it.
//   glyph(ctx, kind, x, y, s, col, a)    the tiny engraved glyph alone
//   knot(ctx, t, x, y, { r 14, seed, untie 0..1, a 1 })   a failure: dark rust node with dead grey broken filaments; untie 1 = reconnected, gold
//   untie(ctx, t, x, y, u, o)            = knot(…, { untie: u })
//   pulse(ctx, t, x, y, u, { r 600, col, a 1, sy 1 })   the query wave alone: an irregular ring of signal pulses travelling outward
//   ghost(ctx, t, o)                     = weave(ctx, t, { …o, ghost: o.u ?? 1 }) dotted network, hollow nodes (not yet real)
//   tear(ctx, t, o)                      = weave(ctx, t, { …o, tear: { rect, u, to } }) a patch of the network rips out and drifts away
//
// ---- fireflies (hands) ----
//   firefly(ctx, t, { x, y, s 1, a 1, seed, trail [[x,y]…] (old→new) | path (t)→[x,y] + trailT .35, glyph 'seal'|'gear'|'chart'|'fix'|null,
//                     glow 1, pulse 0..1, wings (auto when s ≥ 3), heading })  → { x, y }
//   carry(from, to, t0, t1, { lift 120, seed, s 1, curve }) → { pos(t), draw(ctx, t, o), at: [x,y] }  a firefly carried along an arc,
//       pure function of absolute time (use the same call on both sides of a shot/chunk boundary). from/to: [x,y] or (t)→[x,y]
//   swarm(ctx, t, { n 24, mode 'drift'|'orbit'|'rows'|'scatter', from mode, u 1, cx, cy, rx 220, ry 120, seed, s .8, turn, trail .3, a 1 })
//       → [[x,y]…]   mode morphs from `from` to `mode` with u (positions travel; nothing fades)
//   turnTo(x, y, t0, delay .1) → turn spec for swarm({ turn }): from t0+delay (stagger 80–120 ms) the swarm faces/leans to (x, y)
//
// ---- conductor (will) ----
//   conductor(ctx, t, x, y, s, { pose 'stand'|'handHalf'|'handRaised'|'handFlat'|'point'|'walk', from, u 1, view 'back'|'profile',
//                                flip, seed 8, light {x,y,col,a}, rim 1, glow 1, walkPhase, shade 0 })
//       → { hand [x,y], head [x,y], feet [x,y] }   always the same long coat, amber rim; x,y = feet; s 1 ≈ 185 px tall
//   CPOSE                                pose table (raised-arm angles), life(t, seed) re-exported from figure.mjs
//
// ---- workshop (the whole company) ----
//   workshop(ctx, t, x, y, s, { state 'lit'|'dark'|'ghost', lit 1, door 1, figure true, fireflies 0, thread 0, seed 1, dim 0,
//                               lift { roof, front, side } 0..1, interior(ctx, t, rect) , inWindow(ctx, i, rect), winLit (i)→0..1,
//                               hatch true, winDim 0, glowA 1, threadLen 900 })   interior/inWindow draw in the caller's space, clipped
//       → { door [x,y], roof [x,y], win(i) → {x,y,w,h}, rect {x,y,w,h}, k }  x,y = ground centre, s 1 = 240 px wide, 12 windows
//   instances(ctx, t, { list [{x,y,s,lit}] | n, seed, area {x0,x1,y0,y1}, lit (i)→0..1 | number, threads 0 })  many small workshops
//
// ---- anatomy plate ----
//   anatomyPlate(ctx, t, { x 860, y 800, s 2.6, open 0..1, close 0..1, openAt (time; overrides open), frame 0..1, paper 1,
//                          leaders 0..1, labels { memory, hands, will } 0..1, will 0..1 (hand raise), memGlow 0, handsLoop 0..1,
//                          stitches [...], turn, seed })
//       → { memory [x,y], hands [x,y], will [x,y], hand [x,y], rect }  walls lift in paper layers (roof, front, side; stagger 80 ms)
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, prng, drift, canvas, hatch } from '../engine.mjs';
import { figure, life, walk, capsule } from './figure.mjs';
import { vnoise, fbm } from './art.mjs';
export { life };

const TAU = Math.PI * 2;
export const F8 = {
  night: '#0b1030', deep: '#060818', violet: '#2a2350', ridge: '#141a3e', gold: '#f3d9a0', goldCore: '#fff8e6', goldDeep: '#8a6a34',
  green: '#b9f0c8', greenCore: '#f2fff5', greenDeep: '#2f6b52', amber: '#ffb35c', amberCore: '#fff1d6', rust: '#7a3b2a',
  ink: '#05060f', paper: '#0d1028', star: '#f3efe2',
};
export const qio = (x) => (x = clamp(x), x < .5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2);
export const eoutX = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const einX = (x) => (x = clamp(x), x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---------------------------------------------------------------- caches (canvas → Image, see BRIEF §6: drawImage(<Canvas>) leaks)
const IMGS = new Map(); let PEND = [];
function cached(key, w, h, paint) {
  let e = IMGS.get(key); if (e) return e.img || e.c;
  const [c, g] = canvas(w, h); paint(g, c); e = { c, img: null }; IMGS.set(key, e);
  PEND.push(loadImage(c.toBuffer('image/png')).then((im) => { e.img = im; e.c = null; }));
  return c;
}
export async function ready() { warm(); while (PEND.length) { const p = PEND; PEND = []; await Promise.all(p); } }

// stippled radial sprite (the print look of light): white core → col → transparent
function sprite(key, R, core, col, deep, stops = [.12, .45]) {
  return cached('spr:' + key, R * 2, R * 2, (g, c) => {
    const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(stops[0], rgba(col, .6)); rg.addColorStop(stops[1], rgba(deep, .16)); rg.addColorStop(1, rgba(deep, 0));
    g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2);
    const d = g.getImageData(0, 0, R * 2, R * 2), p = d.data, r = prng(R * 7 + 3);
    for (let i = 3; i < p.length; i += 4) { const a = p[i] / 255; if (a <= 0) continue; const kk = .55 * 4 * a * (1 - a), on = r() < a ? Math.min(1, a * 2.4) : 0; p[i] = 255 * (a * (1 - kk) + kk * on); }
    g.putImageData(d, 0, 0);
  });
}
const SPR = {
  green: () => sprite('green', 128, F8.greenCore, F8.green, F8.greenDeep),
  gold: () => sprite('gold', 160, F8.goldCore, F8.gold, F8.goldDeep),
  amber: () => sprite('amber', 200, F8.amberCore, F8.amber, '#c4512e'),
  soft: () => sprite('soft', 256, F8.gold, F8.gold, F8.goldDeep, [.3, .6]),
};
const SPRC = { green: [F8.greenCore, F8.green, F8.greenDeep, .12, .45], gold: [F8.goldCore, F8.gold, F8.goldDeep, .12, .45], amber: [F8.amberCore, F8.amber, '#c4512e', .12, .45], soft: [F8.gold, F8.gold, F8.goldDeep, .3, .6] };
function spr(ctx, which, x, y, r, a = 1) {
  if (a <= .003 || r < .5) return;
  if (r > 700) {   // huge (camera very close): a smooth gradient, never a blown-up stipple sprite
    const [c0, c1, c2, s1, s2] = SPRC[which]; if (x + r < 0 || x - r > W || y + r < 0 || y - r > H) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c0, Math.min(1, a))); g.addColorStop(s1, rgba(c1, .6 * Math.min(1, a))); g.addColorStop(s2, rgba(c2, .16 * Math.min(1, a))); g.addColorStop(1, rgba(c2, 0));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); return;
  }
  const im = SPR[which](); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(im, x - r, y - r, r * 2, r * 2); ctx.restore(); }

// ================================================================ NIGHT LAND
export function landCam(cam = {}, d = 0) {
  const cx = cam.x ?? W / 2, cy = cam.y ?? H / 2, dist = cam.dist ?? 1, k = 1 / Math.max(1e-6, dist + d);
  const X = (wx) => W / 2 + (wx - cx) * k, Y = (wy) => H / 2 + (wy - cy) * k;
  // RX/RY: a point designed in reference screen space (where it sits at cam {960,540,1}) for this depth
  return { k, X, Y, RX: (sx) => X(W / 2 + (sx - W / 2) * (1 + d)), RY: (sy) => Y(H / 2 + (sy - H / 2) * (1 + d)), s: k * (1 + d) };
}
// a ridge layer designed in reference screen space (cam 960,540,1), drawn as a cached image of size LW×LH with margin
const LM = 700, LW = W + 2 * LM, LH = H + 2 * LM;
const RN = new Map();
// crest height of ridge i at reference-screen x (to stand things on a ridge)
export function ridgeY(i, sx, seed = 1) {
  const spec = RIDGES[i], key = seed * 31 + i * 7; if (!RN.has(key)) RN.set(key, vnoise(key)); const n = RN.get(key), u = sx / W;
  const base = spec.y - spec.valley * Math.pow(Math.abs(u - spec.vx) * 2, 1.6);
  return base - spec.amp * (fbm(n, sx * spec.f, 3.1, 5) - .5) * 2 - spec.peak * Math.exp(-Math.pow((u - spec.px) / spec.pw, 2));
}
// ridge geometry in reference coords (crest points, trees), built once; drawn live as vectors (crisp at any zoom, cheap)
// one full-frame engraved hatch (screen spaced), drawn unscaled inside each ridge's clip
const hatchImg = () => cached('hatch', W + 32, H, (g) => { g.strokeStyle = 'rgba(0,0,0,.24)'; g.lineWidth = 1; const r = prng(5); g.beginPath(); for (let k = -H; k < W + 40; k += 8) { const j = (r() - .5) * 1.6; g.moveTo(k + j, 0); g.lineTo(k + j - H * .55, H); } g.stroke(); g.strokeStyle = 'rgba(0,0,0,.1)'; g.beginPath(); for (let k = -H + 4; k < W + 40; k += 8) { g.moveTo(k, H * .35); g.lineTo(k - H * .65 * .55, H); } g.stroke(); });
const RG = new Map();
function ridgeGeom(i, seed) {
  const key = i + ':' + seed; if (RG.has(key)) return RG.get(key);
  const spec = RIDGES[i], pts = []; for (let x = -LM; x <= W + LM; x += 8) pts.push([x, ridgeY(i, x, seed)]);
  const trees = [], r2 = prng(seed * 3 + i); for (let k = 0; k < (spec.trees || 0); k++) { const p = pts[Math.floor(r2() * pts.length)]; trees.push([p[0], p[1], 8 + r2() * 22 * spec.treeS]); }
  const top = Math.min(...pts.map((p) => p[1])), g = { pts, trees, top }; RG.set(key, g); return g;
}
function drawRidge(ctx, i, seed, P, t) {
  const spec = RIDGES[i], G = ridgeGeom(i, seed), s = P.s, X = P.RX, Y = P.RY, n = G.pts.length;
  let x0 = 0; while (x0 < n - 1 && X(G.pts[x0 + 1][0]) < -10) x0++; let x1 = n - 1; while (x1 > 0 && X(G.pts[x1 - 1][0]) > W + 10) x1--;
  if (x1 <= x0) return; const topY = Y(G.top); if (topY > H + 10) return;
  ctx.beginPath(); ctx.moveTo(X(G.pts[x0][0]), H + 10); for (let k = x0; k <= x1; k++) ctx.lineTo(X(G.pts[k][0]), Y(G.pts[k][1])); ctx.lineTo(X(G.pts[x1][0]), H + 10); ctx.closePath();
  const gr = ctx.createLinearGradient(0, topY, 0, topY + 420 * s); gr.addColorStop(0, spec.c0); gr.addColorStop(1, spec.c1); ctx.fillStyle = gr; ctx.fill();
  // engraved hatch on the slope (screen-spaced lines, so the engraving keeps its grain at every zoom)
  if (i >= 2) { ctx.save(); ctx.clip(); const hi = hatchImg(), off = ((X(0) * .5) % 16 + 16) % 16; ctx.globalAlpha = .75 + .25 * (i / 3); ctx.drawImage(hi, -16 + off, 0); ctx.restore(); }
  ctx.strokeStyle = rgba(spec.rim, spec.rimA); ctx.lineWidth = 1.6; ctx.beginPath(); for (let k = x0; k <= x1; k++) { const px = X(G.pts[k][0]), py = Y(G.pts[k][1]); k > x0 ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
  if (G.trees.length) { ctx.fillStyle = spec.c0; ctx.beginPath(); for (const [tx, ty, hh] of G.trees) { const px = X(tx), py = Y(ty), h = hh * s; if (px < -20 || px > W + 20) continue; ctx.moveTo(px - h * .28, py + 3 * s); ctx.lineTo(px, py - h); ctx.lineTo(px + h * .28, py + 3 * s); } ctx.fill(); }
}
const RIDGES = [
  { d: 6, y: 590, valley: 0, vx: .5, amp: 70, f: .0021, peak: 120, px: .28, pw: .14, c0: '#1d1a4a', c1: '#141436', rim: '#8a7fd0', rimA: .5, gap: 11 },
  { d: 3, y: 650, valley: 0, vx: .5, amp: 55, f: .003, peak: 60, px: .78, pw: .12, c0: '#17173e', c1: '#0f1130', rim: '#7a70c0', rimA: .42, gap: 9, trees: 40, treeS: .5 },
  { d: 1.4, y: 740, valley: 90, vx: .52, amp: 40, f: .004, peak: 0, px: .5, pw: .1, c0: '#111334', c1: '#0b0d26', rim: '#6a62b0', rimA: .38, gap: 8, trees: 90, treeS: .8 },
  { d: .55, y: 845, valley: 230, vx: .5, amp: 28, f: .005, peak: 0, px: .5, pw: .1, c0: '#0c0e28', c1: '#07081a', rim: '#5a52a0', rimA: .3, gap: 7, trees: 70, treeS: 1.2 },
];
function milkyImg(seed) {
  return cached('milky:' + seed, 2600, 1500, (g) => {
    g.translate(1300, 750); g.rotate(-.38);
    const r = prng(seed), n = vnoise(seed + 5);
    const gr = g.createLinearGradient(0, -260, 0, 260); gr.addColorStop(0, 'rgba(120,110,200,0)'); gr.addColorStop(.5, 'rgba(170,160,235,.26)'); gr.addColorStop(1, 'rgba(120,110,200,0)');
    g.fillStyle = gr; g.fillRect(-1300, -260, 2600, 520);
    for (let i = 0; i < 52000; i++) {
      const x = (r() - .5) * 2600, y = (r() + r() + r() + r() - 2) * 150, den = fbm(n, x * .004, y * .01, 4);
      if (r() > den * 1.35) continue; const a = .12 + .6 * r() * den; g.fillStyle = `rgba(225,228,255,${a})`; const s = r() < .97 ? 1.1 : 2; g.fillRect(x, y, s, s);
    }
    // the dark lane through the band
    g.strokeStyle = 'rgba(6,8,24,.35)'; g.lineWidth = 28; g.beginPath(); for (let x = -1300; x <= 1300; x += 40) g.lineTo(x, 18 * Math.sin(x * .004) + 10 * n(x * .01, 2)); g.stroke();
  });
}
const STARS = (() => { const r = prng(808), s = []; for (let i = 0; i < 700; i++) { const m = r(); s.push([r() * W * 1.4 - W * .2, r() * H * .9 - 60, m < .92 ? .5 + r() * .8 : 1.1 + r() * 1.3, r() * TAU, .5 + r() * 1.8]); } return s; })();
function mistImg(seed, y0, y1, col) {
  return cached(`mist:${seed}`, W * 2, 360, (g) => {
    const q = 4, lw = W * 2 / q, lh = 360 / q, d = g.createImageData(lw, lh), p = d.data, n = vnoise(seed), c = parseInt(col.slice(1), 16);
    for (let j = 0; j < lh; j++) { const v = j / lh, band = Math.sin(Math.PI * v) ** 1.4; for (let i = 0; i < lw; i++) {
      // horizontally periodic noise so the band can wrap
      const a1 = i / lw * TAU, f = fbm(n, Math.cos(a1) * 3 + 10, Math.sin(a1) * 3 + j * .06, 4), den = clamp((f - .38) / .3) * band;
      const o = (j * lw + i) * 4; p[o] = c >> 16; p[o + 1] = (c >> 8) & 255; p[o + 2] = c & 255; p[o + 3] = 255 * .5 * den; } }
    const [lc, lx] = canvas(lw, lh); lx.putImageData(d, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(lc, 0, 0, W * 2, 360);
    const dd = g.getImageData(0, 0, W * 2, 360), pp = dd.data, r = prng(seed + 1);
    for (let i = 3; i < pp.length; i += 4) { const a = pp[i] / 255; if (a <= 0) continue; const kk = .5 * 4 * a * (1 - a), on = r() < a ? Math.min(1, a * 2.2) : 0; pp[i] = 255 * (a * (1 - kk) + kk * on); }
    g.putImageData(dd, 0, 0);
  });
}
// a mist band at depth d centred on reference-screen y = sy, drifting with speed v
export function mistBand(ctx, t, cam, d, sy, { seed = 3, a = 1, v = 6, col = '#6a6aa8', h = 1 } = {}) {
  const P = landCam(cam, d), im = mistImg(seed, 0, 1, col), k = P.s, w = W * 2 * k, hh = 360 * k * h;
  let x0 = P.RX(((t * v) % (W * 2)) - W * .5); const y = P.RY(sy) - hh / 2;
  ctx.save(); ctx.globalAlpha = clamp(a); x0 = ((x0 % w) + w) % w - w;
  for (let x = x0; x < W; x += w) ctx.drawImage(im, x, y, w + 1, hh);
  ctx.restore();
}
export function nightLand(ctx, t, o = {}) {
  const cam = o.cam || { x: W / 2, y: H / 2, dist: 1 }, seed = o.seed ?? 1;
  // sky (screen space, a hint of tilt with cam.y)
  const sy = (cam.y - H / 2) * .04, g = ctx.createLinearGradient(0, -sy - 200, 0, H - sy);
  g.addColorStop(0, o.top || F8.deep); g.addColorStop(.5, '#0d1238'); g.addColorStop(.78, o.horizon || F8.violet); g.addColorStop(1, '#3a2c5c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // milky way + stars at near-infinite depth
  const P0 = landCam(cam, 40);
  if (o.milky ?? 1) { const im = milkyImg(seed), k = P0.k * 41; ctx.save(); ctx.globalAlpha = o.milky ?? 1; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(im, Math.round(P0.RX(W * .42) + t * .6 - 1300), Math.round(P0.RY(H * .2) - 750)); ctx.restore(); }
  if (o.stars ?? 1) {
    const k = P0.k * 41;
    for (const [x, y, s, ph, f] of STARS) {
      const X = P0.RX(x) + t * .6, Y = P0.RY(y); if (X < -4 || X > W + 4 || Y < -4 || Y > H) continue;
      const tw = .55 + .45 * Math.sin(t * f + ph); ctx.fillStyle = `rgba(243,239,226,${(.3 + .6 * tw) * (o.stars ?? 1)})`;
      ctx.fillRect(X, Y, s, s); if (s > 1.8) { ctx.fillStyle = `rgba(243,239,226,${.08 * tw})`; ctx.fillRect(X - s * 1.5, Y + s / 2 - .4, s * 4, .8); ctx.fillRect(X + s / 2 - .4, Y - s * 1.5, .8, s * 4); }
    }
  }
  if (o.moon) { const P = landCam(cam, 30), mx = P.RX(o.moon.x), my = P.RY(o.moon.y), r = o.moon.r || 16;
    spr(ctx, 'soft', mx, my, r * 7, .18); ctx.save(); ctx.beginPath(); ctx.arc(mx, my, r, 0, TAU); ctx.clip(); ctx.fillStyle = '#efe6cf'; ctx.beginPath(); ctx.arc(mx - r * .55, my + r * .2, r * 1.0, 0, TAU); ctx.fill(); ctx.restore(); }
  // ridges with mist between them
  const n = clamp(o.ridges ?? 4, 0, RIDGES.length);
  for (let i = 0; i < n; i++) {
    const R = RIDGES[i], P = landCam(cam, R.d);
    if (o.mist ?? 1) mistBand(ctx, t, cam, R.d + .2, R.y + 10, { seed: 3 + i, a: (o.mist ?? 1) * (.55 - i * .06), v: 5 + i * 3, col: i < 2 ? '#5d5a9c' : '#4a4a86' });
    drawRidge(ctx, i, seed, P, t);
    if (o.after) o.after(i, P);
  }
  if (o.dim) { ctx.fillStyle = rgba(F8.ink, clamp(o.dim)); ctx.fillRect(0, 0, W, H); }
  return { proj: (d) => landCam(cam, d) };
}

// ================================================================ GLYPHS
export function glyph(ctx, kind, x, y, s = 1, col = F8.goldCore, a = 1) {
  if (!kind || a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = rgba(col, a); ctx.fillStyle = rgba(col, a); ctx.lineWidth = 1.3 / Math.max(.5, s) * Math.max(1, s * .6); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (kind === 'meeting') { ctx.arc(0, 0, 6, 0, TAU); ctx.stroke(); for (let i = 0; i < 3; i++) { const q = -Math.PI / 2 + i * TAU / 3; ctx.beginPath(); ctx.arc(Math.cos(q) * 6, Math.sin(q) * 6, 2, 0, TAU); ctx.fill(); } }
  else if (kind === 'envelope') { ctx.rect(-7, -4.5, 14, 9); ctx.moveTo(-7, -4.5); ctx.lineTo(0, 1); ctx.lineTo(7, -4.5); ctx.stroke(); }
  else if (kind === 'check') { ctx.moveTo(-6, 0); ctx.lineTo(-2, 4.5); ctx.lineTo(7, -5); ctx.stroke(); }
  else if (kind === 'cross') { ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.moveTo(-6, 4); ctx.lineTo(6, -4); ctx.stroke(); }
  else if (kind === 'question') { ctx.arc(0, -2.5, 4, Math.PI * 1.1, Math.PI * 2.35); ctx.lineTo(0, 3); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 6.5, 1.1, 0, TAU); ctx.fill(); }
  else if (kind === 'seal') { ctx.arc(0, 0, 5, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba('#05060f', a * .6); ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, TAU); ctx.stroke(); }
  else if (kind === 'gear') { for (let i = 0; i < 8; i++) { const q = i / 8 * TAU; ctx.moveTo(Math.cos(q) * 4, Math.sin(q) * 4); ctx.lineTo(Math.cos(q) * 7, Math.sin(q) * 7); } ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 4.2, 0, TAU); ctx.stroke(); }
  else if (kind === 'chart') { ctx.moveTo(-7, 5); ctx.lineTo(-3, 0); ctx.lineTo(1, 2); ctx.lineTo(7, -6); ctx.stroke(); }
  else if (kind === 'fix') { for (let i = 0; i < 3; i++) { ctx.moveTo(-7, -4 + i * 4); ctx.lineTo(i === 1 ? 2 : 7, -4 + i * 4); } ctx.stroke(); }
  ctx.restore();
}

// ================================================================ THE NETWORK (memory) · drawn behind the old `weave` API
// MOTION.md §1 (revised 2026-10-23): an organic neural network of light, no grid. Nodes = glowing somata, filaments = curved, tapering,
// branching strands (thick at the node, hair-thin at the tip), signals travel along them, the whole breathes (period 4.2 s), seen whole the
// node cloud reads as two hemispheres with a faint cleft and gyri-like curls. Static drawing is cached per layer (young / old parts) in mip
// levels; when the camera is very close the same geometry is drawn as vectors (culled), so it stays crisp at any zoom.
const NETS = new Map(), NET_CW = 3072, NET_MIPS = [3072, 1536, 768, 384];
const qbez = (p0, p1, p2, p3, q) => { const m = 1 - q; return m * m * m * p0 + 3 * m * m * q * p1 + 3 * m * q * q * p2 + q * q * q * p3; };
// density of nodes in box coords (X 0…a, Y 0…1)
function netDensity(shape, a, n1, n2) {
  const Hb = .96, Wb = Math.min(a * .97, 1.22 * Hb), cx = a / 2, cy = .5;
  return (X, Y) => {
    const cl = fbm(n2, X * 3.1, Y * 3.1, 3), edgeF = Math.min(X, a - X, Y, 1 - Y);
    if (shape === 'cloud') return clamp(edgeF / .12) * Math.pow(clamp((cl - .28) / .5), 1.3) * (.6 + .4 * fbm(n1, X * 7, Y * 7, 2));
    const nx = (X - cx) / (Wb / 2), ny = (Y - cy) / (Hb / 2), ax = Math.abs(nx);
    // two hemispheres side by side (seen from above): flat medial edge along the cleft, round lateral side, frontal end a little narrower
    const hx = (ax - .5) / (.5 * (1 - .07 * ny)), hy = ny / (ny < 0 ? .97 : 1);
    const e = Math.pow(Math.abs(hx), hx < 0 ? 6 : 2.3) + Math.pow(Math.abs(hy), 2.2);
    const m = clamp((1 - e) / .2) * clamp((ax - .022) / .05);
    // gyri: the iso-lines of a warped noise field make winding, curling bands; nodes gather on them
    const f = fbm(n1, X * 2.3 + .7 * fbm(n2, X * 1.3, Y * 1.3, 2), Y * 2.3, 3), g = Math.pow(.5 + .5 * Math.sin(f * 58), 2.2);
    const rim = Math.exp(-Math.pow((1 - e - .13) / .1, 2)) * clamp((ax - .022) / .05);
    let d = m * (.07 + .93 * g) * (.35 + 1.1 * cl * cl) + rim * .75;
    // outside the silhouette (wide rects): a sparse halo of loose nodes so the wall is not empty
    if (a > 1.6) d += (1 - m) * .07 * clamp(edgeF / .1) * clamp((cl - .35) / .4);
    return d;
  };
}
function netGeom(seed, N, aspect, shape) {
  const a = Math.round(aspect * 20) / 20, key = `${seed}:${N}:${a}:${shape}`; if (NETS.has(key)) return NETS.get(key);
  const r = prng(seed * 131 + 7), dens = netDensity(shape, a, vnoise(seed * 3 + 1), vnoise(seed * 5 + 2));
  const s0 = Math.sqrt(a * (shape === 'cloud' ? .45 : .5) / N), minD = s0 * .42, cs = minD, gw = Math.ceil(a / cs) + 1, grid = new Map();
  const nodes = [], ag = (X, Y) => clamp(1 - (X / a) * .9 - (1 - Y) * .2 + .1);
  for (let tries = 0; tries < N * 60 && nodes.length < N; tries++) {
    const X = r() * a, Y = r() * 1; if (r() > dens(X, Y) * 1.15) continue;
    const gx = Math.floor(X / cs), gy = Math.floor(Y / cs); let ok = true;
    for (let i = -2; i <= 2 && ok; i++) for (let j = -2; j <= 2 && ok; j++) { const c = grid.get((gx + i) + (gy + j) * gw); if (c) for (const q of c) if (Math.hypot(q.x - X, q.y - Y) < minD) { ok = false; break; } }
    if (!ok) continue;
    const big = r(), nd = { x: X, y: Y, r: big > .93 ? 4.5 + r() * 3 : 1.1 + 2.6 * Math.pow(r(), 2.2), age: clamp(ag(X, Y) * .6 + r() * .45), ph: r() * TAU, f: .6 + r() * 1.6, tw: r() < .45, i: nodes.length, deg: 0 };
    nodes.push(nd); const k = gx + gy * gw; if (!grid.has(k)) grid.set(k, []); grid.get(k).push(nd);
  }
  // filaments to 2–4 nearest neighbours (rarely across the cleft), as cubic curves that bend (C or S), never straight
  const edges = [], seen = new Set(), cx = a / 2;
  for (const A of nodes) {
    const want = 2 + (r() < .45) + (r() < .2), cand = [];
    const gx = Math.floor(A.x / cs), gy = Math.floor(A.y / cs);
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const c = grid.get((gx + i) + (gy + j) * gw); if (c) for (const q of c) if (q !== A) cand.push([Math.hypot(q.x - A.x, q.y - A.y), q]); }
    cand.sort((p, q) => p[0] - q[0]);
    let got = 0;
    for (const [d, B] of cand) {
      if (got >= want || d > s0 * 3.2) break; const kk = A.i < B.i ? A.i + ':' + B.i : B.i + ':' + A.i; if (seen.has(kk)) { got++; continue; }
      if (shape !== 'cloud' && (A.x - cx) * (B.x - cx) < 0 && r() > .06) continue;
      if (B.deg > 5) continue;
      seen.add(kk); got++; A.deg++; B.deg++;
      const dx = B.x - A.x, dy = B.y - A.y, nx = -dy, ny = dx, b1 = (r() - .5) * .7, b2 = r() < .5 ? b1 * (.4 + r() * .5) : -b1 * (.3 + r() * .6);
      const e = { a: A, b: B, c1x: A.x + dx * .33 + nx * b1, c1y: A.y + dy * .33 + ny * b1, c2x: A.x + dx * .67 + nx * b2, c2y: A.y + dy * .67 + ny * b2, w: .55 + .35 * Math.min(A.r, B.r) / 2.5, age: Math.max(A.age, B.age), len: d };
      e.bb = [Math.min(A.x, B.x, e.c1x, e.c2x), Math.min(A.y, B.y, e.c1y, e.c2y), Math.max(A.x, B.x, e.c1x, e.c2x), Math.max(A.y, B.y, e.c1y, e.c2y)];
      edges.push(e);
    }
  }
  // dendrites: free branches that end in hair-thin tips, some with a fork
  const dend = [];
  for (const A of nodes) {
    const m = (A.r > 3 ? 2 : 0) + Math.floor(r() * 2.4);
    for (let k = 0; k < m; k++) {
      const an = r() * TAU, L = s0 * (.35 + r() * .8) * (A.r > 3 ? 1.3 : 1), bend = (r() - .5) * 1.4;
      const ex = A.x + Math.cos(an) * L, ey = A.y + Math.sin(an) * L, px = -Math.sin(an) * L * .3 * bend, py = Math.cos(an) * L * .3 * bend;
      const d = { a: A, x0: A.x, y0: A.y, c1x: A.x + Math.cos(an) * L * .35 + px, c1y: A.y + Math.sin(an) * L * .35 + py, c2x: A.x + Math.cos(an) * L * .7 + px * .4, c2y: A.y + Math.sin(an) * L * .7 + py * .4, x1: ex, y1: ey, w: .5 + .25 * A.r / 2.5, age: A.age };
      dend.push(d);
      if (r() < .55) { const q = .5 + r() * .2, bx = qbez(d.x0, d.c1x, d.c2x, d.x1, q), by = qbez(d.y0, d.c1y, d.c2y, d.y1, q), a2 = an + (r() < .5 ? -1 : 1) * (.5 + r() * .5), L2 = L * (.3 + r() * .3);
        dend.push({ a: A, x0: bx, y0: by, c1x: bx + Math.cos(a2) * L2 * .4, c1y: by + Math.sin(a2) * L2 * .4, c2x: bx + Math.cos(a2 + .3) * L2 * .75, c2y: by + Math.sin(a2 + .3) * L2 * .75, x1: bx + Math.cos(a2 + .2) * L2, y1: by + Math.sin(a2 + .2) * L2, w: d.w * .55, age: A.age, sub: true }); }
    }
  }
  for (const d of dend) d.bb = [Math.min(d.x0, d.x1, d.c1x, d.c2x), Math.min(d.y0, d.y1, d.c1y, d.c2y), Math.max(d.x0, d.x1, d.c1x, d.c2x), Math.max(d.y0, d.y1, d.c1y, d.c2y)];
  const g = { a, nodes, edges, dend, s0, imgs: new Map() }; NETS.set(key, g); return g;
}
// draw the static network (or the part with age > / ≤ .55) at px-per-unit S, origin (ox, oy), line scale lw; vp = culling box in screen px
function paintNet(g, G, S, ox, oy, lw, part, vp, ghost) {
  const sel = (age) => part === 'all' || (part === 'old' ? age > .55 : age <= .55);
  const vis = (bb) => !vp || !(ox + bb[2] * S < vp[0] - 40 || ox + bb[0] * S > vp[2] + 40 || oy + bb[3] * S < vp[1] - 40 || oy + bb[1] * S > vp[3] + 40);
  const N = 9;
  const strand = (x0, y0, c1x, c1y, c2x, c2y, x1, y1, w0, prof) => {   // a tapered filled ribbon along the cubic
    const L = [], R = [];
    for (let k = 0; k <= N; k++) {
      const q = k / N, x = qbez(x0, c1x, c2x, x1, q), y = qbez(y0, c1y, c2y, y1, q), dq = .02, xa = qbez(x0, c1x, c2x, x1, Math.min(1, q + dq)) - qbez(x0, c1x, c2x, x1, Math.max(0, q - dq)), ya = qbez(y0, c1y, c2y, y1, Math.min(1, q + dq)) - qbez(y0, c1y, c2y, y1, Math.max(0, q - dq));
      const l = Math.hypot(xa, ya) || 1, hw = w0 * prof(q) * .5; L.push([ox + x * S - ya / l * hw, oy + y * S + xa / l * hw]); R.push([ox + x * S + ya / l * hw, oy + y * S - xa / l * hw]);
    }
    g.moveTo(L[0][0], L[0][1]); for (let k = 1; k <= N; k++) g.lineTo(L[k][0], L[k][1]); for (let k = N; k >= 0; k--) g.lineTo(R[k][0], R[k][1]); g.closePath();
  };
  const OLD = part === 'old', cS = OLD ? '#dc9a40' : '#eeb25e', cD = OLD ? '#d0903c' : '#e2a453', cN = OLD ? '#eaa850' : '#f7c878', cC = OLD ? '#ffe2b0' : F8.goldCore;
  const pE = (q) => .16 + .84 * Math.pow(Math.abs(2 * q - 1), 1.7), pD = (q) => .05 + .95 * Math.pow(1 - q, 1.4);
  g.save(); g.globalCompositeOperation = 'lighter';
  if (ghost) {   // not yet real: dotted strands, hollow nodes
    g.setLineDash([1.2 * lw, 7 * lw]); g.lineCap = 'round'; g.strokeStyle = rgba(F8.gold, .7); g.lineWidth = 1.3 * lw; g.beginPath();
    for (const e of G.edges) { if (!sel(e.age) || !vis(e.bb)) continue; g.moveTo(ox + e.a.x * S, oy + e.a.y * S); g.bezierCurveTo(ox + e.c1x * S, oy + e.c1y * S, ox + e.c2x * S, oy + e.c2y * S, ox + e.b.x * S, oy + e.b.y * S); }
    g.stroke(); g.setLineDash([]); g.strokeStyle = rgba(F8.goldCore, .6); g.lineWidth = .9 * lw; g.beginPath();
    for (const n of G.nodes) { if (!sel(n.age)) continue; const x = ox + n.x * S, y = oy + n.y * S, rr = (1.5 + n.r * .8) * lw; g.moveTo(x + rr, y); g.arc(x, y, rr, 0, TAU); } g.stroke(); g.restore(); return;
  }
  // soft glow under the strands (wide, faint), then the strands themselves
  g.lineCap = 'round'; g.strokeStyle = rgba('#c98a3a', .08); g.lineWidth = 5 * lw; g.beginPath();
  for (const e of G.edges) { if (!sel(e.age) || !vis(e.bb)) continue; g.moveTo(ox + e.a.x * S, oy + e.a.y * S); g.bezierCurveTo(ox + e.c1x * S, oy + e.c1y * S, ox + e.c2x * S, oy + e.c2y * S, ox + e.b.x * S, oy + e.b.y * S); }
  g.stroke();
  g.fillStyle = rgba(cS, .8); g.beginPath();
  for (const e of G.edges) { if (!sel(e.age) || !vis(e.bb)) continue; strand(e.a.x, e.a.y, e.c1x, e.c1y, e.c2x, e.c2y, e.b.x, e.b.y, 2.3 * lw * e.w, pE); }
  g.fill();
  g.fillStyle = rgba(cD, .7); g.beginPath();
  for (const d of G.dend) { if (!sel(d.age) || !vis(d.bb)) continue; strand(d.x0, d.y0, d.c1x, d.c1y, d.c2x, d.c2y, d.x1, d.y1, 2.4 * lw * d.w, pD); }
  g.fill();
  // somata: a halo, a gold body and a white core
  for (const n of G.nodes) { if (!sel(n.age)) continue; const x = ox + n.x * S, y = oy + n.y * S, rr = n.r * lw; if (vp && (x < vp[0] - 80 || x > vp[2] + 80 || y < vp[1] - 80 || y > vp[3] + 80)) continue; spr(g, 'gold', x, y, rr * 4.5 + 3 * lw, .2 + .035 * n.r); spr(g, 'soft', x, y, 46 * lw, .03); }
  g.fillStyle = rgba(cN, .95); g.beginPath();
  for (const n of G.nodes) { if (!sel(n.age)) continue; const x = ox + n.x * S, y = oy + n.y * S, rr = n.r * lw * 1.05; if (vp && (x < vp[0] - 30 || x > vp[2] + 30 || y < vp[1] - 30 || y > vp[3] + 30)) continue; g.moveTo(x + rr, y); g.arc(x, y, rr, 0, TAU); }
  g.fill(); g.fillStyle = rgba(cC, .95); g.beginPath();
  for (const n of G.nodes) { if (!sel(n.age)) continue; const x = ox + n.x * S, y = oy + n.y * S, rr = n.r * lw * .5; if (vp && (x < vp[0] - 30 || x > vp[2] + 30 || y < vp[1] - 30 || y > vp[3] + 30)) continue; g.moveTo(x + rr, y); g.arc(x, y, rr, 0, TAU); }
  g.fill(); g.restore();
}
// cached image of one part (young / old / ghost) at mip level m: { img, pad, S } (box unit → px)
function netImg(G, key, part, m, ghost, thick = 1) {
  const a = G.a, top = a >= 1 ? NET_CW / a : NET_CW, S = top * m / NET_CW, pad = Math.ceil(.08 * Math.max(a, 1) * S), w = Math.ceil(a * S) + 2 * pad, h = Math.ceil(S) + 2 * pad;
  const k = `net:${key}:${part}:${m}:${ghost ? 1 : 0}:${thick}`;
  const img = cached(k, w, h, (g) => {
    if (m === NET_CW) { paintNet(g, G, S, pad, pad, (a * S) / 1400 * thick, part, null, ghost); return; }
    const up = netImg(G, key, part, m * 2, ghost, thick); g.imageSmoothingEnabled = true; g.drawImage(up.img, 0, 0, w, h);
  });
  return { img, pad, S, w, h };
}
const netLw = (sw) => (sw <= NET_CW ? sw / 1400 : (NET_CW / 1400) * Math.pow(sw / NET_CW, .45));
// draw one network layer into the screen rect R (box → screen: X·R.w/a); alpha per part; vector when very close
function drawNetLayer(ctx, G, key, R, alphaYoung, alphaOld, ghost, thick = 1) {
  const sw = R.w, S = sw / G.a, vecK = clamp((sw / NET_CW - 1.05) / .3), cacheK = 1 - vecK;
  const parts = [['young', alphaYoung], ['old', alphaOld]];
  if (cacheK > 0) {
    let m = NET_MIPS[NET_MIPS.length - 1]; for (const mm of NET_MIPS) if (mm >= sw * 1.0) m = mm;
    for (const [part, al] of parts) {
      let A = al * cacheK; if (A <= .004) continue;
      const I = netImg(G, key, part, m, ghost, thick), k = S / I.S;
      // brighten very small networks a little (fine strands lose coverage when small)
      const boost = clamp(Math.sqrt(700 / Math.max(1, sw)), 1, 1.8);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; A *= boost;
      while (A > .004) { ctx.globalAlpha = Math.min(1, A); ctx.drawImage(I.img, R.x - I.pad * k, R.y - I.pad * k, I.w * k, I.h * k); A -= 1; }
      ctx.restore();
    }
  }
  if (vecK > 0) {
    const lw = netLw(sw) * thick;
    for (const [part, al] of parts) {
      const A = al * vecK; if (A <= .004) continue;
      ctx.save(); let left = A; while (left > .004) { ctx.globalAlpha = Math.min(1, left); paintNet(ctx, G, S, R.x, R.y, lw, part, [0, 0, W, H], ghost); left -= 1; } ctx.restore();
    }
  }
}
// a point on an edge (screen), q 0…1 from a to b
const edgePt = (e, q, R, a) => [R.x + qbez(e.a.x, e.c1x, e.c2x, e.b.x, q) / a * R.w, R.y + qbez(e.a.y, e.c1y, e.c2y, e.b.y, q) * R.h];
// a travelling signal: a bright dot with a short tail along the filament
function signal(ctx, e, q, R, a, lw, al, dir) {
  const qq = dir > 0 ? q : 1 - q, tail = .22;
  ctx.strokeStyle = rgba(F8.goldCore, .55 * al); ctx.lineWidth = Math.max(.7, 1.6 * lw); ctx.beginPath();
  for (let k = 0; k <= 6; k++) { const s = clamp(qq - dir * tail * k / 6), p = edgePt(e, s, R, a); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
  ctx.stroke(); const p = edgePt(e, qq, R, a); spr(ctx, 'gold', p[0], p[1], 5 + 9 * lw, .9 * al);
}

// age of a point: the left/lower part of the network is older (dimmer); old parts flare with o.oldGlow
const ageAt = (u, v) => clamp(1 - u * .9 - (1 - v) * .2 + .1);
export function weave(ctx, t, o = {}) {
  const x = o.x ?? 360, y = o.y ?? 180, w = o.w ?? 1200, h = o.h ?? 700, depth = o.depth ?? 3, A = o.a ?? 1, persp = o.persp ?? .3;
  const oldDim = o.old ?? .45, ghostU = clamp(o.ghost ?? 0), sh = o.shimmer ?? 1, seed = o.seed ?? 1, aspect = w / Math.max(1, h);
  const shape = o.shape || (aspect <= 2.8 ? 'brain' : 'cloud'), N0 = Math.round(clamp((o.cols ?? 34) * (o.rows ?? 20) * (shape === 'brain' ? .6 : .42), 40, 1000));
  const cx = x + w / 2, cy = y + h / 2;
  const rect = (l) => { const f = 1 / (1 + l * persp); return { x: cx - w / 2 * f + l * w * .02, y: cy - h / 2 * f - l * h * .03, w: w * f, h: h * f }; };
  const geo = (l) => { const N = Math.round(N0 * (1 - l * .18)); return [netGeom(seed * 7 + l, N, aspect, shape), `${seed * 7 + l}:${N}:${Math.round(aspect * 20) / 20}:${shape}`]; };
  const stitches = o.stitches || [], tr = o.tear, trU = tr ? clamp(tr.u) : 0, pul = o.pulse;
  const breath = (l) => 1 + .16 * Math.sin(TAU * t / 4.2 + l * 1.3);
  ctx.save();
  if (o.clip) { ctx.beginPath(); ctx.rect(o.clip[0], o.clip[1], o.clip[2], o.clip[3]); ctx.clip(); }
  const R0 = rect(0);
  if (tr && trU > 0) {   // the torn patch leaves a hole: clip it out of the whole network
    const [u0, v0, u1, v1] = tr.rect; ctx.beginPath(); ctx.rect(-W, -H, 3 * W, 3 * H); ctx.rect(R0.x + u1 * R0.w, R0.y + v0 * R0.h, -(u1 - u0) * R0.w, (v1 - v0) * R0.h); ctx.clip('evenodd');
  }
  for (let l = depth - 1; l >= 0; l--) {
    const R = rect(l), [G, key] = geo(l), la = A * (1 - l * .28) * breath(l), a = G.a;
    // a slow parallax sway per layer (deeper = more), never a jump
    const sway = l * R.w * .0025, Rl = { ...R, x: R.x + Math.sin(t * .21 + l * 2) * sway, y: R.y + Math.cos(t * .17 + l) * sway * .5 };
    const oldA = la * oldDim * (1 + (o.oldGlow || 0) * 1.6);
    if (ghostU < 1) drawNetLayer(ctx, G, key, Rl, la * (1 - ghostU), oldA * (1 - ghostU), false, o.thick ?? 1);
    if (ghostU > 0) drawNetLayer(ctx, G, key, Rl, la * ghostU * .8, oldA * ghostU * .8, true, o.thick ?? 1);
    if (Rl.w < 60) continue;
    const lw = netLw(Rl.w) * (o.thick ?? 1), vis = (p, m = 60) => p[0] > -m && p[0] < W + m && p[1] > -m && p[1] < H + m;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    // nodes twinkle softly, staggered
    if (sh > 0) for (const n of G.nodes) {
      if (!n.tw) continue; const tw = Math.sin(t * n.f + n.ph); if (tw < .55) continue;
      const p = [Rl.x + n.x / a * Rl.w, Rl.y + n.y * Rl.h]; if (!vis(p)) continue;
      const old = n.age > .55 ? oldDim * (1 + (o.oldGlow || 0) * 1.6) : 1;
      spr(ctx, 'gold', p[0], p[1], (n.r * 4 + 4) * lw + 2, (tw - .55) * 1.9 * la * old * sh * .7);
    }
    // signals travelling along filaments all the time
    if (sh > 0 && ghostU < .9) {
      const M = Math.round((10 + G.edges.length * .05) * sh * (1 - l * .35));
      for (let j = 0; j < M; j++) {
        const P = 1.1 + hash(j * 3.1 + l * 17 + seed) * 1.6, ph = hash(j * 7.7 + seed), c = Math.floor(t / P + ph), q = t / P + ph - c;
        const e = G.edges[Math.floor(hash(c * 13.37 + j * 1.91 + l * 5.3 + seed) * G.edges.length)]; if (!e) continue;
        const dir = hash(c * 3.3 + j) < .5 ? 1 : -1, env = Math.sin(Math.PI * q), old = e.age > .55 ? oldDim * (1 + (o.oldGlow || 0) * 1.2) : 1;
        const p = edgePt(e, .5, Rl, a); if (!vis(p, Rl.w * .1 + 80)) continue;
        signal(ctx, e, eio(q), Rl, a, lw, env * la * old * (1 - ghostU), dir);
      }
    }
    // the query wave: a front of signal pulses races through the network from one node
    if (pul && l <= 1) {
      const u = clamp(pul.u ?? 0), ox = R0.x + R0.w * (pul.x ?? .5), oy = R0.y + R0.h * (pul.y ?? .5), RR = Math.hypot(w, h) * eout(u) * 1.05, fade = (1 - u * .6) * la, band = 60 + 40 * lw;
      if (u > 0 && u < 1) {
        for (const n of G.nodes) { const p = [Rl.x + n.x / a * Rl.w, Rl.y + n.y * Rl.h], d = Math.hypot(p[0] - ox, p[1] - oy), k = Math.exp(-Math.pow((d - RR) / band, 2)); if (k > .06 && vis(p)) spr(ctx, 'gold', p[0], p[1], (n.r * 5 + 8) * lw + 4, k * fade); }
        for (const e of G.edges) {
          const pa = [Rl.x + e.a.x / a * Rl.w, Rl.y + e.a.y * Rl.h], pb = [Rl.x + e.b.x / a * Rl.w, Rl.y + e.b.y * Rl.h], da = Math.hypot(pa[0] - ox, pa[1] - oy), db = Math.hypot(pb[0] - ox, pb[1] - oy);
          if ((da - RR) * (db - RR) > 0 || Math.abs(db - da) < 1e-3) continue; const q = (RR - da) / (db - da); signal(ctx, e, q, Rl, a, lw, fade * .9, 1);
        }
      }
    }
    ctx.restore();
  }
  // knots (failures): dark rust nodes with dead filaments
  if (o.knots) { const R = rect(0); for (const kn of o.knots) knot(ctx, t, R.x + kn.u * R.w, R.y + kn.v * R.h, { r: kn.r ?? 14 * R.w / 1200 + 6, untie: kn.untie ?? 0, seed: kn.seed ?? 3, a: A }); }
  ctx.restore();
  // the torn patch drifts away with its loose filaments (the same cached network, cut out)
  if (tr && trU > 0) {
    const R = R0, [u0, v0, u1, v1] = tr.rect, e = eio(trU), dx = (tr.to?.[0] ?? 300) * e, dy = (tr.to?.[1] ?? 0) * e, rot = (tr.rot ?? .12) * e;
    const px = R.x + u0 * R.w, py = R.y + v0 * R.h, pw = (u1 - u0) * R.w, ph = (v1 - v0) * R.h, [G, key] = geo(0);
    ctx.save(); if (o.clip) { ctx.beginPath(); ctx.rect(o.clip[0], o.clip[1], o.clip[2], o.clip[3]); ctx.clip(); }
    ctx.translate(px + pw / 2 + dx, py + ph / 2 + dy); ctx.rotate(rot); ctx.translate(-(px + pw / 2), -(py + ph / 2));
    ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip(); drawNetLayer(ctx, G, key, R, A, A * oldDim, false); ctx.restore();
    // loose ends: snapped filaments curling at the hole's rim and the patch's rim
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F8.gold, .5 * A); ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i < 16; i++) { const rr = prng(40 + i), side = i % 4, q = rr(); let sx = px + pw * q, sy = py; if (side === 1) sy = py + ph; if (side === 2) { sx = px; sy = py + ph * q; } if (side === 3) { sx = px + pw; sy = py + ph * q; }
      const L = 10 + 18 * rr(), ang = Math.atan2(py + ph / 2 - sy, px + pw / 2 - sx) + (rr() - .5) * 1.2 + .1 * Math.sin(t * 2 + i); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + Math.cos(ang) * L * .6 + 4, sy + Math.sin(ang) * L * .6 + 5, sx + Math.cos(ang) * L, sy + Math.sin(ang) * L + 8); }
    ctx.stroke(); ctx.restore();
  }
  // stitches: a new memory sprouts as a node and grows filaments to its nearest neighbours
  if (stitches.length) {
    const [G] = geo(0), R = R0, a = G.a;
    for (const s of stitches) {
      if (t < s.t0) continue; const sx = R.x + s.u * R.w, sy = R.y + s.v * R.h;
      const near = G.nodes.map((n) => [Math.hypot(n.x / a - s.u, (n.y - s.v) / aspect), n]).sort((p, q) => p[0] - q[0]).slice(1, 4).map(([, n]) => [R.x + n.x / a * R.w, R.y + n.y * R.h]);
      stitch(ctx, t, s.t0, sx, sy, s.glyph, { from: s.from, s: s.s ?? clamp(R.w / 1200, .8, 2.6), dur: s.dur, to: near });
    }
  }
  return { at: (u, v, l = 0) => { const R = rect(l); return [R.x + u * R.w, R.y + v * R.h]; }, rect: R0,
    nodes: (l = 0) => { const [G] = geo(l), R = rect(l); return G.nodes.map((n) => [R.x + n.x / G.a * R.w, R.y + n.y * R.h, n.r]); } };
}
// a new memory: a spark arrives along a curve from `from` (laying a faint filament), the node sprouts with a soft flash, 2–4 filaments
// grow out (expo-out) to its neighbours (o.to, else outward), the neighbours light up 60–120 ms later; a tiny glyph sits by it ~1 s.
export function stitch(ctx, t, t0, x, y, kind, o = {}) {
  const dur = o.dur ?? .7, u = (t - t0) / dur; if (u <= 0) return { done: false };
  const from = o.from || [x - 700, y - 260], s = o.s ?? 1, arr = .5, ua = clamp(u / arr), e = eoutX(ua);
  const cx = mix(from[0], x, .55) + (y - from[1]) * .18, cy = mix(from[1], y, .45) - 90 * s;
  const P = (q) => [(1 - q) ** 2 * from[0] + 2 * (1 - q) * q * cx + q * q * x, (1 - q) ** 2 * from[1] + 2 * (1 - q) * q * cy + q * q * y];
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  // the arriving spark and the filament it lays (it stays faint as one of the network's long strands)
  const keep = .12 + .5 * Math.exp(-Math.max(0, t - t0 - dur * arr) * 1.6);
  ctx.beginPath(); for (let k = 0; k <= 28; k++) { const [px, py] = P(e * k / 28); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.strokeStyle = rgba(F8.gold, .4 * keep); ctx.lineWidth = 1.3 * s; ctx.stroke();
  const [hx, hy] = P(e); if (ua < 1) { spr(ctx, 'gold', hx, hy, 24 * s, .9); ctx.beginPath(); for (let k = 0; k <= 8; k++) { const [px, py] = P(Math.max(0, e - .12 * k / 8)); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = rgba(F8.goldCore, .8); ctx.lineWidth = 1.6 * s; ctx.stroke(); }
  if (ua >= 1) {
    const k = t - t0 - dur * arr, fl = Math.exp(-k * 3.5), sp = eoutX(clamp(k / .25));
    // the node sprouts with a soft flash
    spr(ctx, 'gold', x, y, (30 + 70 * fl) * s, .35 + .8 * fl);
    ctx.fillStyle = rgba(F8.goldCore, .95); ctx.beginPath(); ctx.arc(x, y, (2.2 + 1.6 * fl) * s * sp, 0, TAU); ctx.fill();
    // 2–4 filaments grow out to the neighbours (0.5 s, expo-out), the neighbours answer 60–120 ms after being reached
    let to = o.to; if (!to || !to.length) { const r = prng(Math.round(x * 3 + y * 7)); to = [0, 1, 2].map((i) => { const an = i * 2.1 + r() * 1.2; return [x + Math.cos(an) * (50 + 30 * r()) * s, y + Math.sin(an) * (40 + 30 * r()) * s]; }); }
    to.forEach(([bx, by], i) => {
      const g = eoutX(clamp((k - .04 * i) / .5)); if (g <= 0) return;
      const dx = bx - x, dy = by - y, bend = (i % 2 ? 1 : -1) * .22, c1 = [x + dx * .35 - dy * bend, y + dy * .35 + dx * bend], c2 = [x + dx * .7 - dy * bend * .5, y + dy * .7 + dx * bend * .5];
      ctx.beginPath(); for (let q = 0; q <= 16; q++) { const qq = g * q / 16; const px = qbez(x, c1[0], c2[0], bx, qq), py = qbez(y, c1[1], c2[1], by, qq); q ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.strokeStyle = rgba(F8.gold, .75); ctx.lineWidth = 1.6 * s; ctx.stroke(); ctx.strokeStyle = rgba(F8.goldCore, .6 * (.4 + .6 * fl)); ctx.lineWidth = .7 * s; ctx.stroke();
      const kr = k - .04 * i - .5 - (.06 + .02 * i); if (kr > 0) spr(ctx, 'gold', bx, by, (14 + 26 * Math.exp(-kr * 4)) * s, .9 * Math.exp(-kr * 2.2) + .05);
    });
    // the tiny glyph by the new node for ~1 s, then it slides into the node and is gone
    if (kind) { const ga = 1 - eio(clamp((k - 1) / .45)), gi = eio(clamp((k - 1) / .45)); if (ga > 0) glyph(ctx, kind, x + 14 * s * (1 - gi), y - 14 * s * (1 - gi), 1.3 * s * (1 - .6 * gi), F8.goldCore, clamp(.85 * ga * sp)); }
  }
  ctx.restore();
  return { done: u >= 1, head: [hx, hy] };
}
// a failure: a dark rust node whose filaments are dead (grey, broken); untie 1 = the filaments have reconnected and the node is gold
export function knot(ctx, t, x, y, o = {}) {
  const r = o.r ?? 14, un = clamp(o.untie ?? 0), rr = prng(o.seed ?? 3), A = o.a ?? 1, e = eio(un);
  ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round';
  const n = 5 + Math.floor(rr() * 2);
  for (let i = 0; i < n; i++) {
    const an = i / n * TAU + rr() * .7, L = r * (2.2 + rr() * 1.8), gap = .35 + rr() * .2, bend = (rr() - .5) * .8, ph = rr() * TAU;
    const pt = (q) => { const d = q * L, b = Math.sin(q * Math.PI) * bend * L * .3; return [Math.cos(an) * d - Math.sin(an) * b, Math.sin(an) * d + Math.cos(an) * b + (1 - e) * q * q * L * .25]; };
    // dead: two broken pieces that sag; alive: one whole strand reaching out, gold
    const reach = mix(gap, 1, e), seg = (q0, q1) => { ctx.beginPath(); for (let k = 0; k <= 10; k++) { const p = pt(mix(q0, q1, k / 10)); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } };
    seg(.12, reach); ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba(e > .5 ? F8.goldDeep : '#7a7280', A * (.9 - .4 * e)); ctx.lineWidth = Math.max(1.4, r * .12) * (1 - .3 * e); ctx.stroke();
    if (e < 1) { seg(gap + .14 + .1 * (1 - e), 1); ctx.strokeStyle = rgba('#5e5864', A * .8 * (1 - e)); ctx.lineWidth = Math.max(1.1, r * .09); ctx.stroke(); }
    if (e > 0) { seg(.12, reach); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F8.gold, A * .85 * e); ctx.lineWidth = 1.3; ctx.stroke(); }
    // a dim spark at a broken tip, sometimes
    if (e < .5 && Math.sin(t * 2.3 + ph) > .85) { const p = pt(gap); spr(ctx, 'gold', p[0], p[1], 6, .25 * (1 - e * 2) * A); }
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = rgba('#2a120c', A * (1 - e)); ctx.beginPath(); ctx.arc(0, 0, r * .62, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(F8.rust, A * (1 - e)); ctx.beginPath(); ctx.arc(0, 0, r * .45, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba('#a0573e', A * .5 * (1 - e)); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, r * .45, 0, TAU); ctx.stroke();
  if (e > 0) { spr(ctx, 'gold', 0, 0, r * (1.5 + 2 * e), .9 * e * A); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(F8.goldCore, e * A); ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, TAU); ctx.fill(); }
  ctx.restore();
}
export const untie = (ctx, t, x, y, u, o = {}) => knot(ctx, t, x, y, { ...o, untie: u });
// the query wave alone: a ring of signal pulses (an irregular, living front) travelling outward from (x, y)
export function pulse(ctx, t, x, y, u, o = {}) {
  u = clamp(u); if (u <= 0 || u >= 1) return; const R = (o.r ?? 600) * eout(u), a = (o.a ?? 1) * (1 - u), sy = o.sy ?? 1, col = o.col === 'green' ? 'green' : 'gold';
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const n = Math.round(40 + R * .25), r = prng(19);
  for (let i = 0; i < n; i++) {
    const q = i / n * TAU + r() * .08, rr = R * (1 + (r() - .5) * .12 + .05 * Math.sin(q * 5 + r() * 3)), px = x + Math.cos(q) * rr, py = y + Math.sin(q) * rr * sy;
    const tl = 18 + 20 * r(); ctx.strokeStyle = rgba(col === 'green' ? F8.green : F8.goldCore, .35 * a); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - Math.cos(q) * tl, py - Math.sin(q) * tl * sy); ctx.stroke();
    spr(ctx, col, px, py, 8 + 6 * r(), a * .6);
  }
  ctx.restore();
}
export const ghost = (ctx, t, o = {}) => weave(ctx, t, { ...o, ghost: o.u ?? 1 });
export const tear = (ctx, t, o = {}) => weave(ctx, t, { ...o, tear: { rect: o.rect || [.3, .3, .5, .6], u: o.u ?? 1, to: o.to, rot: o.rot } });

// ================================================================ FIREFLIES
export function firefly(ctx, t, o = {}) {
  let x = o.x ?? 0, y = o.y ?? 0; const s = o.s ?? 1, A = o.a ?? 1, seed = o.seed ?? 0;
  let trail = o.trail;
  if (o.path) { [x, y] = o.path(t); if (!trail) { trail = []; const T0 = o.trailT ?? .35; for (let k = 10; k >= 0; k--) trail.push(o.path(t - T0 * k / 10)); } }
  // hover: a small living wobble
  const hx = x + Math.sin(t * 7.3 + seed) * 1.2 * s, hy = y + Math.cos(t * 6.1 + seed * 2) * 1.2 * s;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (trail && trail.length > 1) {
    for (let k = 1; k < trail.length; k++) {
      const q = k / (trail.length - 1); ctx.strokeStyle = rgba(F8.green, .55 * q * A); ctx.lineWidth = Math.max(.6, 2.6 * s * q);
      ctx.beginPath(); ctx.moveTo(trail[k - 1][0], trail[k - 1][1]); ctx.lineTo(trail[k][0], trail[k][1]); ctx.stroke();
    }
  }
  const pu = 1 + .9 * clamp(o.pulse ?? 0), br = (.85 + .15 * Math.sin(t * 3.1 + seed * 1.7)) * pu;
  spr(ctx, 'green', hx, hy, 22 * s * (o.glow ?? 1) * br, .85 * A);
  ctx.restore();
  // the engraved body (visible from s ≥ 1.6): abdomen light, dark thorax, two hatched wings fluttering — never a face
  if (s >= 1.6) {
    const ang = o.heading ?? (trail && trail.length > 1 ? Math.atan2(y - trail[trail.length - 2][1], x - trail[trail.length - 2][0]) : -.4);
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); const k = s * .9;
    const fl = Math.sin(t * 38 + seed) * .5 + .5;
    for (const sd of [-1, 1]) {   // wings
      ctx.save(); ctx.translate(-2 * k, 0); ctx.rotate(sd * (.5 + .55 * fl)); ctx.beginPath(); ctx.ellipse(-6 * k, sd * 7 * k, 9 * k, 4.2 * k, sd * .3, 0, TAU);
      ctx.fillStyle = rgba('#cfe9df', .16 * A); ctx.fill(); ctx.strokeStyle = rgba('#e6fff0', .55 * A); ctx.lineWidth = .7; ctx.stroke();
      ctx.clip(); ctx.strokeStyle = rgba('#e6fff0', .22 * A); ctx.beginPath(); for (let i = -16; i < 16; i += 2.2) { ctx.moveTo(i * k, -12 * k); ctx.lineTo(i * k + 6 * k, 12 * k); } ctx.stroke(); ctx.restore();
    }
    ctx.fillStyle = rgba('#1c2a26', A); ctx.beginPath(); ctx.ellipse(1.5 * k, 0, 3.4 * k, 2.6 * k, 0, 0, TAU); ctx.fill();          // thorax
    ctx.beginPath(); ctx.ellipse(5.4 * k, 0, 1.9 * k, 1.8 * k, 0, 0, TAU); ctx.fill();                                               // small head, no eyes
    ctx.strokeStyle = rgba('#1c2a26', A * .8); ctx.lineWidth = .6 * k; ctx.beginPath(); ctx.moveTo(6.6 * k, -.8 * k); ctx.quadraticCurveTo(10 * k, -3 * k, 12 * k, -5 * k); ctx.moveTo(6.6 * k, .8 * k); ctx.quadraticCurveTo(10 * k, 3 * k, 12 * k, 5 * k); ctx.stroke();
    ctx.fillStyle = rgba(F8.greenCore, A); ctx.beginPath(); ctx.ellipse(-5 * k, 0, 4.6 * k, 3 * k, 0, 0, TAU); ctx.fill();       // the lit abdomen
    ctx.strokeStyle = rgba(F8.greenDeep, .5 * A); ctx.lineWidth = .5 * k; ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.moveTo(-7 + i * 2.2, -2.6); } ctx.stroke();
    ctx.restore();
  }
  if (o.glyph) glyph(ctx, o.glyph, hx + 10 * s, hy - 9 * s, .9 * Math.max(1, s * .6), F8.greenCore, .85 * A);
  return { x: hx, y: hy };
}
// a carried firefly: pure function of absolute time
export function carry(from, to, t0, t1, o = {}) {
  const P = (f, t) => (typeof f === 'function' ? f(t) : f), lift = o.lift ?? 120, seed = o.seed ?? 1;
  const pos = (t) => {
    const u = clamp((t - t0) / (t1 - t0)), e = o.ease ? o.ease(u) : eio(u), a = P(from, Math.min(t, t0)), b = P(to, t);
    const mx = (a[0] + b[0]) / 2 + (o.curve ?? 0) * (b[1] - a[1]), my = Math.min(a[1], b[1]) - lift;
    const x = (1 - e) ** 2 * a[0] + 2 * (1 - e) * e * mx + e * e * b[0], y = (1 - e) ** 2 * a[1] + 2 * (1 - e) * e * my + e * e * b[1];
    const w = Math.sin(Math.PI * u) * 10; return [x + w * Math.sin(t * 5 + seed), y + w * Math.cos(t * 4.3 + seed)];
  };
  return { pos, at: pos(t0), draw: (ctx, t, oo = {}) => firefly(ctx, t, { path: pos, s: o.s ?? 1, seed, ...oo }) };
}
export const turnTo = (x, y, t0, delay = .1) => ({ x, y, t0, delay });
function swarmPos(i, n, t, mode, o, r) {
  const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, rx = o.rx ?? 220, ry = o.ry ?? 120, ph = r[0] * TAU, sp = .25 + r[1] * .35;
  if (mode === 'orbit') { const a = ph + t * sp * (r[2] < .5 ? 1 : -1) * 1.4, rr = .55 + .45 * r[3]; return [cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr]; }
  if (mode === 'rows') { const cols = Math.ceil(Math.sqrt(n * 2.2)), row = Math.floor(i / cols), col = i % cols, rows = Math.ceil(n / cols);
    // a shallow arc of rows (an orchestra facing its conductor)
    const u = (col + .5) / cols - .5, v = (row + .5) / rows - .5; return [cx + u * rx * 2, cy + v * ry * 2 + Math.abs(u) * ry * .7 + 3 * Math.sin(t * 2 + ph)]; }
  if (mode === 'scatter') { const a = ph + t * sp * 3.4, k = Math.sin(t * (1.3 + r[2]) + ph); return [cx + (r[3] - .5) * rx * 2.4 + Math.cos(a) * 60 * k, cy + (r[4] - .5) * ry * 2.4 + Math.sin(a * 1.3) * 50]; }
  // drift
  return [cx + (r[3] - .5) * rx * 2 + drift(t, 30, ph * 3), cy + (r[4] - .5) * ry * 2 + drift(t, 22, ph * 5 + 1)];
}
export function swarm(ctx, t, o = {}) {
  const n = o.n ?? 24, mode = o.mode || 'drift', from = o.from || mode, u = eio(clamp(o.u ?? 1)), seed = o.seed ?? 1, out = [];
  for (let i = 0; i < n; i++) {
    const rr = prng(seed * 101 + i * 7), r = [rr(), rr(), rr(), rr(), rr()];
    const pt = (tt) => {
      let a = swarmPos(i, n, tt, from, o, r); const b = swarmPos(i, n, tt, mode, o, r); a = [mix(a[0], b[0], u), mix(a[1], b[1], u)];
      if (o.turn) { const T = o.turn, k = eoutX(clamp((tt - T.t0 - T.delay - .04 * (i % 3)) / .6)); if (k > 0) { const dx = T.x - a[0], dy = T.y - a[1], d = Math.hypot(dx, dy) || 1; a = [a[0] + dx / d * 40 * k, a[1] + dy / d * 40 * k]; } }
      return a;
    };
    const p = pt(t), trail = []; const TT = o.trail ?? .3; for (let k = 6; k >= 0; k--) trail.push(pt(t - TT * k / 6));
    firefly(ctx, t, { x: p[0], y: p[1], trail, s: (o.s ?? .8) * (.75 + .5 * r[2]), seed: i + seed, a: o.a ?? 1, glyph: o.glyphs ? o.glyphs[i % o.glyphs.length] : null });
    out.push(p);
  }
  return out;
}

// ================================================================ CONDUCTOR
// arm angles for the profile figure (0 = down, + = forward): [shoulder, elbow] of the front arm
export const CPOSE = {
  stand: { sh: .12, el: .25 }, handHalf: { sh: 1.15, el: .55 }, handRaised: { sh: 2.35, el: .35 }, handFlat: { sh: 1.5, el: .05 }, point: { sh: 1.62, el: .02 },
};
const CDRESS = { coat: '#24283e', pants: '#14142a', shoes: '#0a0a12', skin: '#b98762', hair: '#1a1214' };
export function conductor(ctx, t, x, y, s = 1, o = {}) {
  const pose = o.pose || 'stand', from = o.from || pose, u = clamp(o.u ?? 1), seed = o.seed ?? 8, view = o.view || 'back';
  const A = CPOSE[from] || CPOSE.stand, B = CPOSE[pose] || CPOSE.stand, sh = mix(A.sh, B.sh, u), el = mix(A.el, B.el, u);
  const L = o.light || { x: x + (o.flip ? -500 : 500) * s, y: y - 300 * s, col: F8.amber, a: .9 };
  if (view === 'profile') {
    const P = pose === 'walk' ? { ...walk(o.walkPhase ?? t * 4), coat: true } : { coat: true, sh: [sh, .1], el: [el, .3], lock: [true, false] };
    figure(ctx, x, y - 92 * s, s, P, { t, seed, dress: CDRESS, flip: o.flip, rim: F8.amber, rimSide: (L.x > x) !== !!o.flip ? 1 : -1, light: L, shadeA: o.shade });
    const hand = [x + (o.flip ? -1 : 1) * Math.sin(sh) * 29 * s + (o.flip ? -1 : 1) * Math.sin(sh + el) * 28 * s, y - 92 * s - 57 * s + Math.cos(sh) * 29 * s + Math.cos(sh + el) * 28 * s];
    if (o.glow ?? 1) spr(ctx, 'amber', hand[0], hand[1], 50 * s * (o.glow ?? 1), .25);
    return { hand, head: [x, y - 170 * s], feet: [x, y] };
  }
  return backConductor(ctx, t, x, y, s, sh, el, L, o);
}
// seen from behind: long coat, round shoulders, the right arm lifts (the baton gesture without a baton)
function backConductor(ctx, t, x, y, s, sh, el, L, o) {
  const Lf = life(t, o.seed ?? 8), b = Lf.b, wsh = Lf.w * 2.2, f = o.flip ? -1 : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
  const sy = -b * .9;
  // contact shadow
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 40); g.addColorStop(0, 'rgba(4,4,14,.55)'); g.addColorStop(1, 'rgba(4,4,14,0)'); ctx.save(); ctx.scale(1, .2); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fill(); ctx.restore();
  const col = (o.shade ? '#14172a' : '#1c2034');
  // legs (weight on one leg)
  ctx.fillStyle = '#101024'; capsule(ctx, -7 + wsh, -84, 8, -8, -46, 6.5); capsule(ctx, -8, -46, 6.3, -8, -6, 5); capsule(ctx, 8 + wsh, -84, 8, 9.5, -47, 6.4); capsule(ctx, 9.5, -47, 6.2, 9, -7, 5);
  ctx.fillStyle = '#08080f'; ctx.beginPath(); ctx.ellipse(-8, -3.5, 6.5, 4, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(9, -4, 6.5, 4, .1, 0, TAU); ctx.fill();
  // left arm hanging
  ctx.fillStyle = col; capsule(ctx, -18, -140 + sy, 7, -23, -112, 6); capsule(ctx, -23, -112, 5.8, -21, -86, 4.8);
  ctx.fillStyle = '#7a5640'; ctx.beginPath(); ctx.ellipse(-20.5, -81, 3.9, 5.2, .15, 0, TAU); ctx.fill();
  // long coat: round shoulders to below the knee
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-21, -40 + wsh * .2);
  ctx.bezierCurveTo(-21, -80, -16, -110, -16.5, -122); ctx.bezierCurveTo(-17, -134, -23, -140 + sy, -18.5, -147 + sy); ctx.bezierCurveTo(-13, -152 + sy, -6, -151.5 + sy, 0, -151.5 + sy);
  ctx.bezierCurveTo(6, -151.5 + sy, 13, -152 + sy, 18.5, -147 + sy); ctx.bezierCurveTo(23, -140 + sy, 17, -134, 16.5, -122); ctx.bezierCurveTo(16, -110, 21, -80, 22, -40 + wsh * .2);
  ctx.quadraticCurveTo(0, -36, -21, -40 + wsh * .2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(.5, -146 + sy); ctx.lineTo(1, -40); ctx.moveTo(-8, -100); ctx.quadraticCurveTo(-10, -70, -12, -42); ctx.stroke();
  // collar + head
  ctx.fillStyle = '#2a2f48'; ctx.beginPath(); ctx.moveTo(-9.5, -148 + sy); ctx.quadraticCurveTo(0, -145 + sy, 9.5, -148 + sy); ctx.lineTo(8.5, -155 + sy); ctx.quadraticCurveTo(0, -153 + sy, -8.5, -155 + sy); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5a3f30'; capsule(ctx, 0, -151 + sy, 4.6, 0, -158 + sy, 4.3);
  ctx.save(); ctx.translate(Lf.turn * 1.5, -167 + sy); ctx.rotate(Lf.turn * .06); ctx.fillStyle = '#17111a'; ctx.beginPath(); ctx.ellipse(0, 0, 9.3, 11.2, 0, 0, TAU); ctx.fill(); ctx.restore();
  // the right arm: shoulder at (17, -142); angle sh measured from down, lifting outward/up; forearm bends up
  const sx = 17, syy = -142 + sy, a1 = Math.PI / 2 - sh * .95, ex = sx + Math.cos(a1) * 0 + Math.sin(sh) * 26, ey = syy + Math.cos(sh) * 27;
  const a2 = sh + el, hx = ex + Math.sin(a2) * 24 * .85, hy = ey + Math.cos(a2) * 25;
  ctx.fillStyle = col; capsule(ctx, sx, syy, 7, ex, ey, 6); capsule(ctx, ex, ey, 5.8, hx, hy, 4.8);
  ctx.fillStyle = '#7a5640'; ctx.beginPath(); ctx.ellipse(hx + Math.sin(a2) * 3, hy + Math.cos(a2) * 3, 4, 5.2, -a2, 0, TAU); ctx.fill();
  ctx.restore();
  // amber rim on the side toward the light: re-stroke the silhouette edge offset (cheap: a lit sliver on shoulder, arm and head)
  const hand = [x + hx * s * f, y + hy * s], head = [x + Lf.turn * 1.5 * s * f, y + (-167 + sy) * s];
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const side = Math.sign((L.x - x) * f) || 1, R = o.rim ?? 1;
  ctx.strokeStyle = rgba(F8.amber, Math.min(1, .95 * R)); ctx.lineCap = 'round';
  ctx.translate(x, y); ctx.scale(s * f, s);
  ctx.beginPath();
  if (side > 0) { ctx.moveTo(18.5, -147 + sy); ctx.bezierCurveTo(23, -140 + sy, 17, -134, 16.5, -122); ctx.bezierCurveTo(16, -110, 21, -80, 22, -42); ctx.moveTo(7, -176 + sy); ctx.quadraticCurveTo(10.5, -166 + sy, 7, -157 + sy); }
  else { ctx.moveTo(-18.5, -147 + sy); ctx.bezierCurveTo(-23, -140 + sy, -17, -134, -16.5, -122); ctx.bezierCurveTo(-16, -110, -21, -80, -21, -42); ctx.moveTo(-7, -176 + sy); ctx.quadraticCurveTo(-10.5, -166 + sy, -7, -157 + sy); }
  ctx.lineWidth = Math.max(1.6, 2.6 * s) / s; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx + 5, syy - 3); ctx.lineTo(ex + 5, ey); ctx.lineTo(hx + 4, hy); ctx.strokeStyle = rgba(F8.amber, Math.min(1, .8 * R)); ctx.stroke();
  ctx.restore();
  if (o.glow ?? 1) spr(ctx, 'amber', hand[0], hand[1], 46 * s * (o.glow ?? 1), .3);
  return { hand, head, feet: [x, y] };
}

// ================================================================ WORKSHOP
// local units: wall 240 × 70 (x -120…120, y -70…0), sawtooth roof (4 teeth) up to y -104, 12 windows, door at the right end
const WS = { w: 240, h: 70, roof: 34, teeth: 4, nwin: 11 };
const winRect = (i) => ({ x: -112 + i * 18.2, y: -54, w: 11.5, h: 32 });
const DOOR = { x: 92, y: -46, w: 18, h: 46 };
export function workshop(ctx, t, x, y, s = 1, o = {}) {
  const state = o.state || 'lit', lit = state === 'dark' ? 0 : clamp(o.lit ?? 1), ghostS = state === 'ghost', seed = o.seed ?? 1, r = prng(seed * 17 + 5);
  const lift = o.lift || {}, lr = eio(clamp(lift.roof ?? 0)), lf = eio(clamp(lift.front ?? 0)), ls = eio(clamp(lift.side ?? 0));
  const k = s, br = (1 + .03 * Math.sin(t * 1.3 + seed)) * (1 - (o.winDim ?? 0)), base = ctx.getTransform();
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const lw = (px) => px / k;
  const wallC = o.wall || '#1b1f44', sideC = '#12153a', roofC = '#15183c', edge = rgba('#8f86d8', .55);
  const stroke = (c, w) => { ctx.strokeStyle = c; ctx.lineWidth = lw(w); ctx.stroke(); };
  if (ghostS) ctx.setLineDash([lw(2), lw(5)]);
  // ground light pool (the door's light on the ground)
  if (lit > 0 && !ghostS && o.pool !== false) { const gp = ctx.createRadialGradient(DOOR.x + 9, 2, 0, DOOR.x + 9, 2, 90); gp.addColorStop(0, rgba(F8.amber, .35 * lit * (o.door ?? 1))); gp.addColorStop(1, rgba(F8.amber, 0)); ctx.save(); ctx.scale(1, .22); ctx.fillStyle = gp; ctx.beginPath(); ctx.arc(DOOR.x + 9, 2 / .22, 90, 0, TAU); ctx.fill(); ctx.restore(); }
  // INTERIOR (visible when walls lift): back wall + whatever the caller draws (weave, fireflies, the figure)
  const opened = Math.max(lf, lr * .6, ls);
  if (opened > 0 && o.interior) { ctx.save(); ctx.fillStyle = '#080a1c'; ctx.fillRect(-120, -70, 240, 70); ctx.beginPath(); ctx.rect(-120, -70, 240, 70); ctx.clip(); ctx.setTransform(base); o.interior(ctx, t, { x: x - 120 * k, y: y - 70 * k, w: 240 * k, h: 70 * k, k, open: opened }); ctx.restore(); }
  // SIDE WALL (3/4 view on the left: a narrow side face)
  ctx.save(); ctx.translate(-ls * 70, -ls * 30); ctx.rotate(-ls * .1); liftShadow(ctx, ls);
  ctx.beginPath(); ctx.moveTo(-120, 0); ctx.lineTo(-138, -10); ctx.lineTo(-138, -78); ctx.lineTo(-120, -70); ctx.closePath();
  if (!ghostS) { ctx.fillStyle = sideC; ctx.fill(); } stroke(edge, 1); if (ls > .01) stroke(rgba('#e9dcb8', .6 * ls), 1.4); if (!ghostS && o.hatch !== false) { ctx.beginPath(); ctx.moveTo(-120, 0); ctx.lineTo(-138, -10); ctx.lineTo(-138, -78); ctx.lineTo(-120, -70); ctx.closePath(); hatchClip(ctx, -140, -80, 22, 82, -1.1, lw(3.2), .35); }
  ctx.restore();
  // FRONT WALL with windows and door
  ctx.save(); ctx.translate(-lf * 40, -lf * 98); ctx.rotate(-lf * .05); liftShadow(ctx, lf);
  ctx.beginPath(); ctx.rect(-120, -70, 240, 70); if (o.clearGlass) for (let i = 0; i < WS.nwin; i++) { const R = winRect(i); ctx.rect(R.x + R.w, R.y, -R.w, R.h); }
  if (!ghostS) { ctx.fillStyle = wallC; ctx.fill('evenodd'); if (o.hatch !== false) { hatchClip(ctx, -120, -70, 240, 70, -.86, lw(3), .28); } }
  ctx.beginPath(); ctx.rect(-120, -70, 240, 70); stroke(edge, 1.1); if (lf > .01) { ctx.beginPath(); ctx.rect(-120, -70, 240, 70); stroke(rgba('#e9dcb8', .7 * lf), 1.6); ctx.beginPath(); ctx.rect(-117, -67, 234, 64); stroke(rgba('#e9dcb8', .25 * lf), .8); }
  // plinth line + planks
  ctx.beginPath(); ctx.moveTo(-120, -6); ctx.lineTo(120, -6); for (let i = -110; i < 120; i += 22) { ctx.moveTo(i, -70); ctx.lineTo(i, -66); } stroke(rgba('#8f86d8', .3), .8);
  for (let i = 0; i < WS.nwin; i++) {
    const R = winRect(i), wl = lit * (o.winLit ? o.winLit(i) : 1);
    if (!ghostS && !o.clearGlass) { ctx.fillStyle = '#05060f'; ctx.fillRect(R.x, R.y, R.w, R.h); }
    if (o.clearGlass && !ghostS) { ctx.fillStyle = rgba('#ffcf8a', .08 * wl); ctx.fillRect(R.x, R.y, R.w, R.h); ctx.strokeStyle = rgba('#fff1d6', .25 * wl); ctx.lineWidth = lw(.8); ctx.beginPath(); ctx.moveTo(R.x + R.w * .15, R.y + R.h * .55); ctx.lineTo(R.x + R.w * .55, R.y + R.h * .2); ctx.stroke(); }
    else if (wl > 0 && !ghostS) {
      const gw = ctx.createLinearGradient(0, R.y, 0, R.y + R.h); gw.addColorStop(0, rgba('#ffd89a', .95 * wl * br)); gw.addColorStop(1, rgba(F8.amber, .85 * wl * br));
      ctx.fillStyle = gw; ctx.fillRect(R.x, R.y, R.w, R.h);
      // the weave behind the glass: a few gold threads, shimmering (no people inside)
      if (o.inWindow) { ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip(); ctx.setTransform(base); o.inWindow(ctx, i, { x: x + R.x * k, y: y + R.y * k, w: R.w * k, h: R.h * k }); ctx.restore(); }
      else if (o.weave !== false) {   // the network behind the glass: a few nodes and curved strands of one shared net, glimpsed (no people inside)
        ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
        const rr = prng(seed * 31 + i * 7), P = []; for (let j = 0; j < 4; j++) P.push([R.x + 1.5 + rr() * (R.w - 3) + .5 * Math.sin(t * .6 + i + j * 2), R.y + 3 + rr() * (R.h - 6) + .6 * Math.cos(t * .5 + j + i)]);
        ctx.strokeStyle = rgba('#fff4dc', .4 * wl); ctx.lineWidth = lw(.55); ctx.beginPath();
        for (let j = 0; j < 4; j++) { const [ax, ay] = P[j], [bx, by] = P[(j + 1) % 4], bnd = (rr() - .5) * 8; ctx.moveTo(ax, ay); ctx.bezierCurveTo(mix(ax, bx, .3) + bnd, mix(ay, by, .3) - bnd * .5, mix(ax, bx, .7) - bnd * .4, mix(ay, by, .7) + bnd, bx, by); }
        ctx.stroke(); ctx.fillStyle = rgba('#fffaf0', .75 * wl); ctx.beginPath(); for (const [px, py] of P) { const r0 = lw(.9) + .35 * rr(); ctx.moveTo(px + r0, py); ctx.arc(px, py, r0, 0, TAU); } ctx.fill(); ctx.restore(); }
    }
    ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.moveTo(R.x, R.y + 7); ctx.lineTo(R.x + R.w, R.y + 7); ctx.moveTo(R.x + R.w / 3, R.y); ctx.lineTo(R.x + R.w / 3, R.y + R.h); ctx.moveTo(R.x + R.w * 2 / 3, R.y); ctx.lineTo(R.x + R.w * 2 / 3, R.y + R.h); stroke(rgba('#0a0b1c', .9), .9);
    ctx.beginPath(); ctx.moveTo(R.x - 1, R.y + R.h + 1.2); ctx.lineTo(R.x + R.w + 1, R.y + R.h + 1.2); stroke(edge, 1);
  }
  // the door: open, bright, with the figure in it
  const D = DOOR, dl = lit * (o.door ?? 1) * (1 - lf);
  if (!ghostS) { ctx.fillStyle = '#05060f'; ctx.fillRect(D.x, D.y, D.w, D.h); if (dl > 0) { const gd = ctx.createLinearGradient(0, D.y, 0, 0); gd.addColorStop(0, rgba('#ffe2b0', dl)); gd.addColorStop(1, rgba(F8.amber, dl)); ctx.fillStyle = gd; ctx.fillRect(D.x, D.y, D.w, D.h); } }
  ctx.beginPath(); ctx.rect(D.x, D.y, D.w, D.h); stroke(edge, 1.1);
  // door light falling out on the ground
  if (dl > 0 && !ghostS) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createLinearGradient(0, 0, 0, 14); gl.addColorStop(0, rgba(F8.amber, .5 * dl)); gl.addColorStop(1, rgba(F8.amber, 0)); ctx.fillStyle = gl; ctx.beginPath(); ctx.moveTo(D.x, 0); ctx.lineTo(D.x + D.w, 0); ctx.lineTo(D.x + D.w + 14, 14); ctx.lineTo(D.x - 10, 14); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.restore();
  // ROOF: sawtooth (the workshop silhouette)
  ctx.save(); ctx.translate(lr * 20, -lr * 125); ctx.rotate(lr * .05); liftShadow(ctx, lr);
  const tw = 244 / WS.teeth; ctx.beginPath(); ctx.moveTo(-122, -70);
  for (let i = 0; i < WS.teeth; i++) { const x0 = -122 + i * tw; ctx.lineTo(x0, -70 - WS.roof); ctx.lineTo(x0 + tw, -70); }
  ctx.closePath(); if (!ghostS) { ctx.fillStyle = roofC; ctx.fill(); } stroke(edge, 1.1); if (lr > .01) stroke(rgba('#e9dcb8', .7 * lr), 1.6);
  if (!ghostS && o.hatch !== false) { ctx.beginPath(); ctx.moveTo(-122, -70); for (let i = 0; i < WS.teeth; i++) { const x0 = -122 + i * tw; ctx.lineTo(x0, -70 - WS.roof); ctx.lineTo(x0 + tw, -70); } ctx.closePath(); hatchClip(ctx, -122, -106, 244, 36, -.4, lw(2.6), .3); }
  // north lights in the teeth glow
  for (let i = 0; i < WS.teeth; i++) { const x0 = -122 + i * tw; ctx.beginPath(); ctx.moveTo(x0 + 1.5, -70 - WS.roof + 3); ctx.lineTo(x0 + 1.5, -72); ctx.lineTo(x0 + 7, -72); ctx.closePath(); if (!ghostS) { ctx.fillStyle = rgba('#ffd89a', .8 * lit * br); ctx.fill(); } }
  ctx.restore();
  ctx.setLineDash([]);
  ctx.restore();
  // glow of the windows (screen space), the thread of light from the roof, fireflies around the roof
  if (lit > 0 && !ghostS && (o.glowA ?? 1) > 0) spr(ctx, 'amber', x, y - 40 * k, 190 * k, .22 * lit * (o.glowA ?? 1) * br);
  const th = clamp(o.thread ?? 0);
  if (th > 0) { const top = y - 104 * k - th * (o.threadLen ?? 900); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    const gx = x - 92 * k, y0 = y - 104 * k, ga = ctx.createLinearGradient(0, y0, 0, top), gb = ctx.createLinearGradient(0, y0, 0, top);
    ga.addColorStop(0, rgba(F8.gold, .22)); ga.addColorStop(1, rgba(F8.gold, .04)); gb.addColorStop(0, rgba(F8.goldCore, .95)); gb.addColorStop(.75, rgba(F8.goldCore, .5)); gb.addColorStop(1, rgba(F8.gold, th < 1 ? .9 : 0));
    ctx.strokeStyle = ga; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(gx, y0); ctx.lineTo(gx, top); ctx.stroke(); ctx.strokeStyle = gb; ctx.lineWidth = 1.4; ctx.stroke();
    if (th < 1) spr(ctx, 'gold', gx, top, 30, .9); ctx.restore(); }
  // the one figure in the door, seen from behind against the light: always the conductor (same coat, same silhouette)
  if (o.figure !== false && lit > 0 && !ghostS) {
    const F = typeof o.figure === 'object' ? o.figure : {}, fx = x + (DOOR.x + 9) * k + (F.dx || 0) * k;
    conductor(ctx, t, fx - (F.fwd || 0) * 6 * k, y + (F.fwd || 0) * 5 * k, .216 * k * (1 + .4 * (F.fwd || 0)), { view: 'back', pose: F.pose || 'stand', from: F.from, u: F.u ?? 1, seed: 8, glow: F.glow ?? 0, rim: F.rim ?? .8, light: F.light || { x: fx + 2 * k, y: y - 60 * k } });
  }
  if (o.fireflies) swarm(ctx, t, { n: o.fireflies, mode: 'orbit', cx: x, cy: y - 120 * k, rx: 150 * k, ry: 40 * k, seed: seed + 9, s: Math.max(.35, .5 * k) });
  return { door: [x + (DOOR.x + 9) * k, y - 20 * k], roof: [x, y - 100 * k], win: (i) => { const R = winRect(i); return { x: x + R.x * k, y: y + R.y * k, w: R.w * k, h: R.h * k }; }, rect: { x: x - 120 * k, y: y - 104 * k, w: 240 * k, h: 104 * k }, k };
}
// a lifted paper layer casts a soft dark shadow below itself (in its own local frame, before its own fill)
function liftShadow(ctx, u) { if (u <= .01) return; ctx.save(); ctx.translate(6 * u, 14 * u); ctx.fillStyle = `rgba(2,3,10,${.35 * u})`; ctx.filter = 'none'; ctx.restore(); }
function hatchClip(ctx, x, y, w, h, ang, gap, a) {
  gap = Math.max(gap, Math.hypot(w, h) / 260);
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#000000', a); ctx.lineWidth = gap * .3; ctx.beginPath();
  const c = Math.cos(ang), sn = Math.sin(ang), R = Math.hypot(w, h) / 2 + 2, cx = x + w / 2, cy = y + h / 2;
  for (let d = -R; d <= R; d += gap) { ctx.moveTo(cx - sn * d - c * R, cy + c * d - sn * R); ctx.lineTo(cx - sn * d + c * R, cy + c * d + sn * R); }
  ctx.stroke(); ctx.restore();
}
// many small workshops (landscapes with thousands of lights)
export function instances(ctx, t, o = {}) {
  let list = o.list;
  if (!list) { const r = prng(o.seed ?? 4), A = o.area || { x0: 0, x1: W, y0: 700, y1: 900 }; list = []; for (let i = 0; i < (o.n ?? 200); i++) { const v = r(); list.push({ x: mix(A.x0, A.x1, r()), y: mix(A.y0, A.y1, v), s: (o.s ?? .12) * (.5 + v * .9), i }); } list.sort((a, b) => a.y - b.y); }
  for (let i = 0; i < list.length; i++) {
    const it = list[i], k = it.s, lv = typeof o.lit === 'function' ? o.lit(it.i ?? i, t) : it.lit ?? (o.lit ?? 0);
    ctx.fillStyle = '#121535'; ctx.beginPath(); ctx.moveTo(it.x - 120 * k, it.y); ctx.lineTo(it.x - 120 * k, it.y - 70 * k);
    for (let q = 0; q < 4; q++) { const x0 = it.x - 120 * k + q * 60 * k; ctx.lineTo(x0, it.y - 104 * k); ctx.lineTo(x0 + 60 * k, it.y - 70 * k); } ctx.lineTo(it.x + 120 * k, it.y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba('#8a80d0', .55); ctx.lineWidth = .9; ctx.stroke();
    if (lv > 0) { ctx.fillStyle = rgba('#ffd89a', lv); const ww = Math.max(1, 11 * k), hh = Math.max(1.2, 30 * k); for (let q = 0; q < 11; q += (k < .05 ? 2 : 1)) ctx.fillRect(it.x + (-112 + q * 18.2) * k, it.y - 54 * k, ww, hh);
      spr(ctx, 'amber', it.x, it.y - 40 * k, 200 * k + 14, .4 * lv);
      if (o.threads) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F8.gold, .5 * lv * o.threads); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(it.x - 92 * k, it.y - 104 * k); ctx.lineTo(it.x - 92 * k, it.y - 104 * k - 400 * o.threads * (k * 4 + .3)); ctx.stroke(); ctx.restore(); } }
  }
  return list;
}
workshop.instances = instances;

// ================================================================ ANATOMY PLATE
// the workshop as an engraved anatomical plate: dark paper, plate mark, walls lifting in paper layers, the organs inside, leader lines + labels
export function anatomyPlate(ctx, t, o = {}) {
  const x = o.x ?? 860, y = o.y ?? 800, s = o.s ?? 2.6, seed = o.seed ?? 1;
  let lift;
  if (o.openAt != null) { const lay = (k) => qio((t - o.openAt - k * .08) / 1.0); lift = { roof: lay(0), front: lay(1), side: lay(2) }; }
  else { const u = clamp(o.open ?? 0) * (1 - clamp(o.close ?? 0)), lay = (k) => qio(clamp((u * 1.16 - k * .08))); lift = { roof: lay(0), front: lay(1), side: lay(2) }; }
  if (o.close != null && o.openAt != null) { const c = clamp(o.close); for (const k in lift) lift[k] *= 1 - qio(c); }
  // paper + plate mark
  plateGround(ctx, t, clamp(o.paper ?? 1), clamp(o.frame ?? 1), seed, o.plateRect);
  const k = s, organ = { memory: [x - 62 * k, y - 46 * k], hands: [x - 4 * k, y - 34 * k], will: [x + 101 * k, y - 26 * k] };
  const op = Math.max(lift.front, lift.roof * .6, lift.side);
  // inside (behind the walls, revealed when they lift): the weave at the back (gold), the fireflies in the middle (green)
  const interior = (g, tt, L) => {
    // the room: a warm glow from the weave on the back wall, a floor line, engraved hatching in the dark corners
    const bg = g.createRadialGradient(organ.memory[0] + 30 * k, L.y + L.h * .45, 0, organ.memory[0] + 30 * k, L.y + L.h * .45, L.w * .7); bg.addColorStop(0, '#3a2a1a'); bg.addColorStop(.5, '#16121e'); bg.addColorStop(1, '#07081a');
    g.fillStyle = bg; g.fillRect(L.x, L.y, L.w, L.h);
    g.strokeStyle = rgba('#d8c08a', .25); g.lineWidth = Math.max(1, .5 * k); g.beginPath(); g.moveTo(L.x, L.y + L.h - 6 * k); g.lineTo(L.x + L.w, L.y + L.h - 6 * k); g.stroke();
    // the memory: a faint network along the whole back wall, and in front of it the brain-shaped network of light (the organ itself)
    weave(g, tt, { x: L.x + 4 * k, y: L.y + 3 * k, w: L.w - 8 * k, h: L.h - 10 * k, depth: 2, cols: 30, rows: 8, a: .3 * (1 + (o.memGlow || 0) * .6), seed: seed + 2, thick: 1.6, old: .5, oldGlow: o.oldGlow || 0, persp: .12, shimmer: .6, shape: 'cloud' });
    weave(g, tt, { x: organ.memory[0] - 52 * k, y: L.y + 3 * k, w: 104 * k, h: 56 * k, depth: 2, cols: 22, rows: 14, a: 1.5 * (1 + (o.memGlow || 0) * .8), seed: seed + 3, thick: 2.2, old: .5, oldGlow: o.oldGlow || 0, persp: .1, stitches: o.stitches || [], shimmer: 1, pulse: o.pulse, shape: 'brain' });
    spr(g, 'gold', organ.memory[0], organ.memory[1], 70 * k * (1 + (o.memGlow || 0) * .5), .1 + .25 * (o.memGlow || 0));
    spr(g, 'green', organ.hands[0], organ.hands[1], 60 * k, .3);
    const hx = organ.hands[0], hy = organ.hands[1];
    swarm(g, tt, { n: 16, mode: o.handsMode || 'orbit', from: o.handsFrom || 'orbit', u: o.handsU ?? 1, cx: hx, cy: hy, rx: 50 * k, ry: 12 * k, seed: seed + 5, s: Math.min(.38 * k, 2.4), turn: o.turn, trail: .4 });
    if (o.handsLoop) { const u = clamp(o.handsLoop), R = 46 * k; g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.strokeStyle = rgba(F8.green, .9 * Math.sin(Math.PI * u)); g.lineWidth = Math.max(1.5, .9 * k); g.beginPath(); const a0 = -Math.PI / 2 + TAU * Math.max(0, eout(u) - .35), a1 = -Math.PI / 2 + TAU * eout(u); g.ellipse(hx, hy, R, R * .26, -.05, a0, a1); g.stroke(); g.restore(); }
    if (o.interiorExtra) o.interiorExtra(g, tt, L, organ);
  };
  const wil = clamp(o.will ?? 0), fig = { pose: 'handRaised', from: 'stand', u: wil, glow: wil * .9, rim: .9 + wil * .4, fwd: lift.front, light: { x: x + 140 * k, y: y - 80 * k } };
  if (op > 0) { spr(ctx, 'amber', organ.will[0] - 4 * k, y - 2 * k, 46 * k, .28 * op); }
  const ws = workshop(ctx, t, x, y, k, { seed, ...(o.ws || {}), lift, interior: op > 0 ? interior : null, figure: fig });
  if (wil > 0) spr(ctx, 'amber', organ.will[0] + 4 * k, organ.will[1] - 14 * k, 34 * k, .3 * wil);
  organ.hand = [organ.will[0] + 8 * k, organ.will[1] - 20 * k];
  // leader lines and labels (right margin, Inter caps, mask reveal)
  const LX = o.labelX ?? x + 150 * k, labels = o.labels || {}, ld = clamp(o.leaders ?? 0), names = [['memory', 'MEMORY'], ['hands', 'HANDS'], ['will', 'WILL']];
  if (ld > 0) names.forEach(([key, lab], i) => {
    const u = clamp(ld * 3 - i * .9 + .0), p = organ[key], ty = (o.labelY ?? y - 120 * k) + i * (o.labelGap ?? 44 * k), pts = [p, [mix(p[0], LX, .55), ty], [LX, ty]];
    if (u <= 0) return; const e = eio(u);
    ctx.save(); ctx.strokeStyle = rgba('#d9cfb0', .8); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p[0], p[1]);
    const L1 = Math.hypot(pts[1][0] - p[0], pts[1][1] - p[1]), L2 = LX - pts[1][0], Lt = L1 + L2, d = Lt * e;
    if (d <= L1) ctx.lineTo(mix(p[0], pts[1][0], d / L1), mix(p[1], pts[1][1], d / L1)); else { ctx.lineTo(pts[1][0], pts[1][1]); ctx.lineTo(pts[1][0] + d - L1, ty); }
    ctx.stroke(); ctx.fillStyle = '#e9dfc4'; ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, TAU); ctx.fill();
    if (e >= 1) { ctx.beginPath(); ctx.arc(LX, ty, 3, 0, TAU); ctx.fill(); }
    ctx.restore();
    const lu = clamp(labels[key] ?? 0);
    if (lu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(LX + 14, ty - 26, 260 * eoutX(lu), 40); ctx.clip(); ctx.fillStyle = '#efe4c6'; ctx.font = '600 26px "Inter"'; try { ctx.letterSpacing = '7px'; } catch { } ctx.textBaseline = 'middle'; ctx.fillText(lab, LX + 20, ty); ctx.restore(); }
  });
  return { ...organ, rect: ws.rect, lift, ws };
}
const PLATE = { x: 120, y: 70, w: W - 240, h: 860 };
function plateGround(ctx, t, a, frame, seed, PR = PLATE) {
  // dark printing paper with fibre and a soft light from the upper left
  const im = cached('plateGround:' + seed, W, H, (g) => {
    const gr = g.createRadialGradient(W * .38, H * .35, 0, W * .5, H * .5, W * .75); gr.addColorStop(0, '#171a3a'); gr.addColorStop(1, '#090a1c'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const r = prng(seed + 71); g.lineCap = 'round'; for (let i = 0; i < 2600; i++) { const px = r() * W, py = r() * H, L = 4 + r() * 16, an = r() * TAU; g.strokeStyle = r() < .5 ? 'rgba(160,150,220,.05)' : 'rgba(0,0,0,.12)'; g.lineWidth = .6 + r() * .6; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(an) * L, py + Math.sin(an) * L); g.stroke(); }
    // fine engraved ground hatching in the plate
    g.strokeStyle = 'rgba(140,130,210,.05)'; g.lineWidth = 1; g.beginPath(); for (let k = -H; k < W; k += 7) { g.moveTo(k, PLATE.y + PLATE.h); g.lineTo(k + 520, PLATE.y); } g.stroke();
  });
  if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.drawImage(im, 0, 0); ctx.restore(); }
  // the plate mark: a double rough border, drawn on with a burin (u = frame)
  if (frame > 0) {
    ctx.save(); ctx.strokeStyle = rgba('#b9b0e0', .55); ctx.lineWidth = 1.4; ctx.lineCap = 'round';
    const PLATE = PR, P = [[PLATE.x, PLATE.y], [PLATE.x + PLATE.w, PLATE.y], [PLATE.x + PLATE.w, PLATE.y + PLATE.h], [PLATE.x, PLATE.y + PLATE.h], [PLATE.x, PLATE.y]];
    for (const inset of [0, 10]) {
      const Q = P.map(([px, py], i) => [px + (i === 1 || i === 2 ? -inset : inset), py + (i >= 2 && i <= 3 ? -inset : inset)]); Q[4] = Q[0];
      const tot = 2 * (PLATE.w + PLATE.h); let d = tot * eio(frame); ctx.beginPath(); ctx.moveTo(Q[0][0], Q[0][1]);
      for (let i = 1; i < 5 && d > 0; i++) { const L = Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]), q = Math.min(1, d / L); ctx.lineTo(mix(Q[i - 1][0], Q[i][0], q), mix(Q[i - 1][1], Q[i][1], q)); d -= L; }
      ctx.stroke(); ctx.lineWidth = .8;
    }
    ctx.restore();
  }
}
export { plateGround, PLATE };

// warm the caches (sprites + land layers) so ready() can convert them to Images
function warm() { hatchImg(); for (const k in SPR) SPR[k](); milkyImg(1); for (let i = 0; i < 4; i++) mistImg(3 + i, 0, 1, i < 2 ? '#5d5a9c' : '#4a4a86'); plateGround({ save() {}, restore() {}, drawImage() {}, set globalAlpha(v) {} }, 0, 0, 0, 1); }
