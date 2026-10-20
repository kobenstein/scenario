// The tree of Film 5 (owner C7: 4.18, 5.04, 5.05; also used by C8 in 6.02): it grows from a sprout to a full crown, doubles with a
// jolt on a signal (doubleAt) and carries amber fruit that splits into equal slices. Print look: tapered bark limbs with a rim on the
// lit side and engraved hatching, leaf clusters as cached sprites in three tones (shadow / mid / lit), wind sway, nothing static.
//
//   tree(ctx, x, y, s, t, o) → { fruits: [{ x, y, r }], top: { x, y }, crown: { x, y, r }, base: { x, y }, k (current size factor) }
//     x, y = root point on the ground, s = 1 → about 600 px tall when fully grown (grow 1)
//     o: { grow = 1 (0 = seed leaves just out, .1 sprout, .35 sapling, 1 grown), doubleAt = null (film time: the tree doubles with a jolt),
//          dbl = 2 (size factor after doubling), fruit = 0..1 (how many fruits hang), split = 0..1 (fruits split into equal slices),
//          slices = 6, seed = 5, light = '#ffb35c' (warm light colour: fruit, pulses, rim tint), lightDir = [.6, -.8] (where the key light
//          comes from), wind = 1 (sway amount), pulse = [t0, …] (a warm pulse runs up the trunk into the crown at each time: "every year"),
//          ink = null (a colour, e.g. '#1f2a3a': engraved monochrome version for a printed vignette), a = 1, leafTone = 0 (-1 cooler … 1 golder),
//          shake = 0..1 (extra crown shake) }
//   Cost: ~4–8 ms per call at s = 1 (structure built once per seed, leaf clusters are cached sprites).
import { rgba, clamp, mix, prng, canvas, eout, lin, addGlow } from '../engine.mjs';
import { hatch as artHatch, stipple } from './art.mjs';
import { shareLight } from './share.mjs';

const TAU = Math.PI * 2;
const MAXD = 4;
const STRUCT = new Map();
// branch geometry in tree units (root 0,0; up = -y; full tree ~600 high): start, angle (0 = up), length, bend, widths, growth window b0..b1
function pointOn(b, q, ang = b.ang) {
  const dx = Math.sin(ang), dy = -Math.cos(ang), nx = Math.cos(ang), ny = Math.sin(ang), bend = b.bend * b.len * q * (1 - q) * 1.4;
  return [b.x0 + dx * b.len * q + nx * bend, b.y0 + dy * b.len * q + ny * bend];
}
function build(seed) {
  if (STRUCT.has(seed)) return STRUCT.get(seed);
  const r = prng(seed * 7919 + 3), B = [], L = [];
  const make = (x0, y0, ang, len, w0, depth, b0, b1, ph) => {
    const b = { x0, y0, ang, len, w0, w1: w0 * (depth === 0 ? .5 : .55), depth, b0, b1, bend: (r() - .5) * (depth === 0 ? .18 : .5), ph, kids: [], id: B.length };
    B.push(b);
    if (depth < MAXD) {
      const n = depth === 0 ? 5 : depth === 1 ? 3 : (r() < .55 ? 3 : 2);
      for (let i = 0; i < n; i++) {
        const q = depth === 0 ? .38 + i * .12 + r() * .05 : .3 + (i / n) * .55 + r() * .12, side = (i % 2 ? 1 : -1) * (depth === 0 && i === n - 1 ? .25 : 1);
        let ca = ang + side * (depth === 0 ? .5 + r() * .35 : .3 + r() * .4) + (r() - .5) * .16;
        ca = clamp(ca * (depth === 0 ? 1 : .78), -1.2, 1.2);   // phototropism: the crown stays upright and round
        const [px, py] = pointOn(b, q), cb0 = mix(b0, b1, q * .85), cb1 = Math.min(1, cb0 + (b1 - b0) * (.75 + r() * .3));
        const cl = len * (depth === 0 ? .56 + r() * .14 - i * .02 : .62 + r() * .18);
        b.kids.push(make(px, py, ca, cl, mix(b.w0, b.w1, q) * (depth === 0 ? .62 : .66), depth + 1, cb0, cb1, ph + r() * 6));
      }
      // the leader continues a little past the top
      if (depth === 0) { const [px, py] = pointOn(b, .96); b.kids.push(make(px, py, ang + (r() - .5) * .25, len * .42, b.w1 * .9, 1, mix(b0, b1, .8), b1, ph + 2)); }
    }
    // leaf clusters along the outer branches (they appear once the branch has grown past them)
    {
      const n = depth === 0 ? 2 : depth === MAXD ? 2 : depth === MAXD - 1 ? 2 : 2;
      for (let k = 0; k < n; k++) { const q = depth === 0 ? .58 + k * .26 : depth >= MAXD - 1 ? .55 + k * .4 + r() * .06 : .5 + k * .42 + r() * .06; L.push({ b, q, size: (.8 + r() * .45) * (depth <= 2 ? 1.45 : depth === 3 ? 1.15 : 1), rot: r() * TAU, v: Math.floor(r() * 4), ph: r() * TAU }); }
    }
    return b;
  };
  make(0, 0, (r() - .5) * .05, 270, 36, 0, 0, .62, r() * 6);
  // crown extent (for anchors) and fruit spots (mid-depth clusters, spread over the crown)
  const S = { B, L };
  STRUCT.set(seed, S); return S;
}
// ---------- leaf-cluster sprites ----------
const SPR = new Map();
const TONES = { deep: ['#173a2c', '#24553a', '#0d2219'], mid: ['#2f6a3c', '#4f8f4a', '#1b3f27'], lit: ['#6faa4f', '#a8cf6a', '#3d7a3a'], gold: ['#9fb84f', '#e9c46a', '#5f8a3a'] };
function leafSprite(tone, v, ink) {
  const key = tone + v + (ink || ''); if (SPR.has(key)) return SPR.get(key);
  const S = 96, [c, g] = canvas(S, S), r = prng(31 + v * 17 + tone.length * 5), T = TONES[tone];
  g.translate(S / 2, S / 2);
  const n = 7 + v * 2;
  for (let i = 0; i < n; i++) {
    const a = r() * TAU, d = Math.pow(r(), .7) * 24, x = Math.cos(a) * d, y = Math.sin(a) * d * .8, la = a + (r() - .5) * 1.4, lw = 11 + r() * 6, lh = 6.5 + r() * 3;
    g.save(); g.translate(x, y); g.rotate(la);
    if (ink) { g.fillStyle = rgba('#efe6cf', .9); g.beginPath(); g.ellipse(0, 0, lw, lh, 0, 0, TAU); g.fill(); g.strokeStyle = ink; g.lineWidth = 1; g.stroke(); g.beginPath(); g.moveTo(-lw * .9, 0); g.lineTo(lw * .9, 0); g.lineWidth = .6; g.stroke(); }
    else {
      const gr = g.createLinearGradient(-lw, -lh, lw, lh); gr.addColorStop(0, T[1]); gr.addColorStop(.55, T[0]); gr.addColorStop(1, T[2]); g.fillStyle = gr;
      g.beginPath(); g.moveTo(-lw, 0); g.quadraticCurveTo(0, -lh * 1.6, lw, 0); g.quadraticCurveTo(0, lh * 1.6, -lw, 0); g.fill();
      g.strokeStyle = rgba('#071510', .35); g.lineWidth = .7; g.beginPath(); g.moveTo(-lw * .85, 0); g.lineTo(lw * .85, 0); g.stroke();
      g.strokeStyle = rgba('#fff4cf', tone === 'lit' || tone === 'gold' ? .35 : .12); g.lineWidth = .8; g.beginPath(); g.moveTo(-lw * .7, -lh * .55); g.quadraticCurveTo(0, -lh * 1.25, lw * .7, -lh * .4); g.stroke();
    }
    g.restore();
  }
  if (ink) { g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; artHatch(g, [0, 0, S, S], { angle: -.8, gap: 2.6, w: .6, col: ink, a: .55, wobble: .3, seed: v + 3, broken: .2 }); g.globalCompositeOperation = 'source-over'; }
  else stipple(c, { k: .35, g: 1, seed: v + 9, mid: false, boost: 1 });
  SPR.set(key, c); return c;
}
// ---------- helpers ----------
const jolt = (u) => (u <= 0 ? 0 : 1 - Math.exp(-u * 11) * Math.cos(u * 10));   // fast rise, ~3 % overshoot, settles
function limbPoly(ctx, pts, w0, w1) {
  const n = pts.length; if (n < 2) return;
  const Lft = [], Rgt = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, w = mix(w0, w1, i / (n - 1)) / 2;
    Lft.push([pts[i][0] - dy / m * w, pts[i][1] + dx / m * w]); Rgt.push([pts[i][0] + dy / m * w, pts[i][1] - dx / m * w]);
  }
  ctx.beginPath(); ctx.moveTo(Lft[0][0], Lft[0][1]); for (const p of Lft) ctx.lineTo(p[0], p[1]);
  const e = pts[n - 1], d = pts[n - 2], ang = Math.atan2(e[1] - d[1], e[0] - d[0]); ctx.arc(e[0], e[1], w1 / 2, ang - Math.PI / 2, ang + Math.PI / 2);
  for (let i = n - 1; i >= 0; i--) ctx.lineTo(Rgt[i][0], Rgt[i][1]); ctx.closePath();
}

export function tree(ctx, x, y, s, t, o = {}) {
  const S = build(o.seed ?? 5), g = clamp(o.grow ?? 1), a = o.a ?? 1, ink = o.ink || null, light = o.light || '#ffb35c';
  const ld = o.lightDir || [.6, -.8], lm = Math.hypot(ld[0], ld[1]) || 1, lx = ld[0] / lm, ly = ld[1] / lm;
  const dA = Number.isFinite(o.doubleAt) ? o.doubleAt : null;   // a missing/NaN signal never breaks the canvas
  const dU = dA != null ? t - dA : -1, kd = dA != null ? 1 + ((o.dbl ?? 2) - 1) * jolt(dU) : 1;
  const shake = clamp((o.shake ?? 0) + (dU > 0 ? Math.exp(-dU * 4) * 1.2 : 0)), wind = (o.wind ?? 1) * (1 + shake * 2.5);
  const K = s * kd;
  // young trees are green and slim; the bark browns as it grows
  const young = clamp(1 - g / .3), barkA = ink || mixHex('#3a2a20', '#4f7d3a', young * .9), barkL = ink ? ink : mixHex('#7a5a40', '#9fd27a', young * .8);
  const out = { fruits: [], top: { x, y: y - 600 * K * g }, crown: { x, y: y - 430 * K * Math.max(.1, g), r: 300 * K * Math.max(.1, g) }, base: { x, y }, k: kd };
  if (a <= 0) return out;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(K, K);
  // growth: lengths and widths ramp with g; widths keep growing after the length is done (trunks thicken)
  const vis = (b) => clamp((g - b.b0) / Math.max(.001, b.b1 - b.b0));
  const thick = mix(.22, 1, Math.pow(g, .7));
  // sway: every branch bends a little with the wind, more toward the tips; the jolt shakes the crown
  const swayA = (b) => (Math.sin(t * .9 + b.ph) * .018 + Math.sin(t * 2.3 + b.ph * 1.7) * .007) * wind * (b.depth + .3) * (1 + 6 * shake * Math.exp(-Math.max(0, dU) * 3) * Math.sin(dU * 30 + b.ph) * (dU > 0 ? 1 : 0));
  // recursive walk to place branches with inherited sway (positions recomputed from the swayed parent)
  const P = [];
  const walk = (b, ox, oy, angOff) => {
    const f = vis(b); if (f <= 0) return;
    const ang = b.ang + angOff + swayA(b), bb = { ...b, x0: ox, y0: oy, ang }, N = b.depth === 0 ? 14 : 8, pts = [];
    for (let i = 0; i <= N; i++) pts.push(pointOn(bb, f * i / N));
    P.push({ b, bb, pts, f, w0: b.w0 * thick, w1: b.w1 * thick });   // a growing limb tapers to its tip (no blunt stake)
    for (const k of b.kids) { const q = (k.b0 - b.b0) / Math.max(.001, (b.b1 - b.b0) * .85); const [px, py] = pointOn(bb, clamp(q)); walk(k, px, py, angOff + (ang - b.ang - angOff) * .8 + swayA(b) * .4); }
  };
  walk(S.B[0], 0, 0, 0);
  // the sprout stage: two seed leaves at the top of the young stem
  // branches back to front (deep ones first), rim on the lit side, then bark hatch on the thick ones
  P.sort((p, q) => q.b.depth - p.b.depth);
  for (const p of P) {
    if (!ink) { ctx.save(); ctx.translate(lx * 1.6, ly * 1.6); ctx.fillStyle = rgba(mixHex(barkL, '#ffd9a0', .4), .85); limbPoly(ctx, p.pts, p.w0, p.w1); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = p.b.depth >= 3 ? mixHex(barkA, '#20160f', .25) : barkA; limbPoly(ctx, p.pts, p.w0, p.w1); ctx.fill();
    if (p.b.depth <= 1 && p.w0 > 6) {   // engraved bark lines along the limb, on the shadow side
      ctx.save(); limbPoly(ctx, p.pts, p.w0, p.w1); ctx.clip(); ctx.strokeStyle = ink ? rgba('#efe6cf', .5) : rgba('#0b0806', .5); ctx.lineWidth = .9 / K;
      for (let k = -2; k <= 2; k++) { ctx.beginPath(); p.pts.forEach(([px, py], i) => { const w = mix(p.w0, p.w1, i / (p.pts.length - 1)) * (.18 * k - lx * .15); i ? ctx.lineTo(px + w, py) : ctx.moveTo(px + w, py); }); ctx.stroke(); }
      ctx.restore();
    }
  }
  // seed leaves (cotyledons) while young: two round leaves unfolding at the tip of the stem
  const trunk = P.find((p) => p.b.depth === 0);
  if (trunk && young > 0 && !ink) {
    const tip = trunk.pts[trunk.pts.length - 1], open = clamp(g / .05), sz = 16 * (.4 + .6 * open) * (1 + young * .3);
    for (const sg of [-1, 1]) { ctx.save(); ctx.translate(tip[0], tip[1]); ctx.rotate(sg * mix(.15, 1.05, eout(open)) + Math.sin(t * 1.2) * .05); ctx.globalAlpha = a * young;
      const gr = ctx.createLinearGradient(0, -sz, sg * sz, 0); gr.addColorStop(0, '#c6ec8e'); gr.addColorStop(1, '#4f8f3a'); ctx.fillStyle = gr;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(sg * sz * .2, -sz * 1.2, sg * sz * 1.5, -sz * 1.1, sg * sz * 1.25, -sz * .1); ctx.bezierCurveTo(sg * sz, sz * .2, sg * sz * .3, sz * .1, 0, 0); ctx.fill();
      ctx.strokeStyle = rgba('#fff8d8', .5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sg * sz * .6, -sz * .7, sg * sz * 1.1, -sz * .35); ctx.stroke(); ctx.restore(); }
  }
  // leaf clusters: they open once their branch has reached them; tone from the light direction; sway with the wind
  const bmap = new Map(P.map((p) => [p.b.id, p]));
  let cx0 = 1e9, cx1 = -1e9, cy0 = 1e9, cy1 = -1e9;
  const tone = o.leafTone ?? 0, leaves = [];
  for (const l of S.L) {
    const p = bmap.get(l.b.id); if (!p || p.f < l.q * .9) continue;
    const open = clamp((p.f - l.q * .9) / .25), idx = Math.min(p.pts.length - 1, Math.round(l.q / p.f * (p.pts.length - 1))), [px, py] = p.pts[clamp(idx, 0, p.pts.length - 1)];
    cx0 = Math.min(cx0, px); cx1 = Math.max(cx1, px); cy0 = Math.min(cy0, py); cy1 = Math.max(cy1, py);
    leaves.push({ l, px, py, open });
  }
  const ccx = (cx0 + cx1) / 2, ccy = (cy0 + cy1) / 2, crx = Math.max(1, (cx1 - cx0) / 2), cry = Math.max(1, (cy1 - cy0) / 2);
  leaves.sort((p, q) => (p.px * lx + p.py * ly) - (q.px * lx + q.py * ly));   // shadow side first, lit side on top
  for (const { l, px, py, open } of leaves) {
    const side = ((px - ccx) / crx) * lx + ((py - ccy) / cry) * ly;   // -1 shadow … 1 lit
    const tn = ink ? 'ink' : side + tone * .6 > .45 ? (tone > .3 ? 'gold' : 'lit') : side + tone * .6 > -.2 ? 'mid' : 'deep';
    const spr = ink ? leafSprite('mid', l.v, ink) : leafSprite(tn, l.v), sw = Math.sin(t * 1.4 + l.ph) * 3 * wind + Math.sin(t * 3.1 + l.ph * 2) * 1.2 * wind;
    const sz = l.size * eout(open) * (.85 + .15 * Math.sin(t * .7 + l.ph)) * 1.25;
    ctx.save(); ctx.translate(px + sw, py + sw * .4); ctx.rotate(l.rot + sw * .02); ctx.scale(sz, sz); ctx.drawImage(spr, -48, -48); ctx.restore();
  }
  ctx.restore();
  // warm pulses running up the trunk into the crown ("every year"), and the glow of the jolt
  const toS = (px, py) => [x + px * K, y + py * K];
  if (trunk && o.pulse) for (const p0 of [].concat(o.pulse)) {
    const u = (t - p0) / 1.1; if (u <= 0 || u >= 1.6) continue;
    const q = Math.min(1, u), i = Math.min(trunk.pts.length - 1, Math.round(q * (trunk.pts.length - 1))), [px, py] = toS(...trunk.pts[i]);
    addGlow(ctx, px, py, 60 * K, .55 * a * (u < 1 ? 1 : 1 - (u - 1) / .6), light, '#fff1d6');
    if (u > .85) addGlow(ctx, ...toS(ccx, ccy), Math.max(crx, cry) * K * 1.3, .22 * a * Math.sin(Math.PI * clamp((u - .85) / .75)), light, '#fff1d6');
  }
  if (dU > 0 && dU < 1.2) addGlow(ctx, ...toS(ccx, ccy), Math.max(crx, cry) * K * 1.6, .35 * a * Math.exp(-dU * 3), light, '#fff1d6');
  // fruit: amber lights hanging in the crown; they split into equal slices
  const nF = Math.round((o.nFruit ?? 6) * (kd > 1.2 ? 2 : 1) * clamp(o.fruit ?? 0)), fr = prng((o.seed ?? 5) * 13 + 1);
  if (nF > 0 && leaves.length) {
    const cand = leaves.filter((q, i) => i % 3 === 1);
    for (let i = 0; i < nF && cand.length; i++) {
      const L2 = cand[Math.floor(fr() * cand.length)], [fx, fy] = toS(L2.px, L2.py + 14), rr = 15 * K * (.85 + fr() * .3);
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = rgba('#3a2a20', .8); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(fx, fy - rr * 1.6); ctx.lineTo(fx, fy - rr * .9); ctx.stroke(); ctx.restore();
      shareLight(ctx, fx, fy + Math.sin(t * 1.3 + i) * 1.5, rr, t, { mode: 'fruit', split: (o.split ?? 0) > 0 ? (o.slices ?? 6) : 0, u: o.split ?? 0, a });
      out.fruits.push({ x: fx, y: fy, r: rr });
    }
  }
  out.crown = { x: x + ccx * K, y: y + ccy * K, r: Math.max(crx, cry) * K };
  if (trunk) { const tp = trunk.pts[trunk.pts.length - 1]; out.top = { x: x + tp[0] * K, y: y + Math.min(tp[1], cy0) * K }; }
  return out;
}
function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
