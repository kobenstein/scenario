// C08 · the engraved park vignette at the head of the form (8.01–8.05): a park bench at noon on a weekday, a person alone, pigeons,
// leaves, a far clock tower at twelve, two office workers hurrying along the far path.
// The vignette is a small 3D scene (metres) seen through a fixed vignette camera; its tones are painted into an offscreen and turned
// into line engraving (parallel lines whose width follows the tone, a direction per region), like a banknote vignette.
// Units on the form: FU (form units, the form is 1000 × 1414 FU). The picture area: VIG.x0..x1, VIG.y0..y1.
//   vigStatic()                 → { path, cont, tuft, gravel }   Path2D (FU), built once (~4 s)
//   drawVignette(ctx, t, st)    ctx transform = form → screen (FU); st: { k px/FU, rs (sprite map px/FU), reveal 0..1, sit 0..1,
//                               fly (s since take-off or -1), warm 0..1, paper(x, y) → css colour of the paper at that FU point,
//                               ringT0 (burin start on the sun's rings), rays0 (rays start) } → { tips } (FU, for drawTips)
//   VIG, SUN, vcam              geometry
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas, cam3, memo, hash, noise1, TAU, ss, eo3, hexMix, fract } from './v2_c08_core.mjs';
import { figure, figureFlat, walk } from './figure.mjs';
import { burinTip } from './ghost.mjs';

export const VIG = { x0: 104, y0: 100, x1: 896, y1: 516 };
export const INK = '#2a231d', INK2 = '#3b2f25';
// the vignette camera: metres → FU (horizon at y ≈ 345)
export const vcam = cam3({ x: 0, y: 1.55, z: 0, pitch: -.045, f: 700, cx: 500, cy: 314 });
export const SUN = { x: 720, y: 205, r: 37.7 };      // the watermark rosette of the plate becomes the sun
const P = (x, y, z) => vcam.P(x, y, z);

// ---------------------------------------------------------------- the scene (metres)
export const BENCH = { cx: -.95, cz: 6.6, yaw: 1.0, len: 1.75, seatH: .45, depth: .46, backH: .86 };
// bench local (u along the bench, v from the front edge to the back, h up) → world
export const benchW = (u, v, h) => { const c = Math.cos(BENCH.yaw), s = Math.sin(BENCH.yaw); return [BENCH.cx + u * c - v * s, h, BENCH.cz + u * s + v * c]; };
// the sitter: on the seat a little toward the far end, facing the bench front (−v, toward the front right)
export const SITTER = { u: .34, v: .2 };
export const PIGEONS = [
  { x: .75, z: 6.3, seed: 1, dir: -1, ph: .1 }, { x: 1.55, z: 7.1, seed: 2, dir: 1, ph: .55 }, { x: .35, z: 5.55, seed: 3, dir: 1, ph: .3 },
  { x: 1.9, z: 5.9, seed: 4, dir: -1, ph: .8 }, { x: 1.2, z: 5.2, seed: 5, dir: -1, ph: .2 },
];
const TREE = { x: -4.6, z: 12 }, TOWER = { x: 19, z: 185 };

// ---------------------------------------------------------------- tone painting
const RS = 2;                                    // px per FU in the static tone/region maps
const RW = Math.ceil((VIG.x1 - VIG.x0) * RS), RH = Math.ceil((VIG.y1 - VIG.y0) * RS);
const REG = { sky: '#ff0000', far: '#00ff00', tower: '#0000ff', grass: '#ffff00', path: '#ff00ff', trunk: '#00ffff', canopy: '#800000', bench: '#008000', iron: '#000080', shadow: '#800080', cloud: '#008080' };
const SPEC = {
  sky: { ang: 0, pitch: 2.5, maxW: 1.55, wob: .25 },
  cloud: { ang: 0, pitch: 2.5, maxW: 1.55, wob: .25 },
  far: { ang: 0, pitch: 1.7, maxW: 1.3, wob: .3, freq: .3 },
  tower: { ang: Math.PI / 2, pitch: 1.7, maxW: 1.25, wob: .1 },
  grass: { ang: -.015, pitch: 2.1, maxW: 1.45, wob: .18, freq: .16, dash: { f: .07, cut: .2 }, cross: { ang: 1.32, from: .3, pitch: 2.4, freq: .2, dash: { f: .16, cut: .38 } } },
  path: { ang: .02, pitch: 3.1, maxW: 1.0, wob: .3 },
  trunk: { ang: 1.4, pitch: 1.6, maxW: 1.45, wob: .5, cross: { ang: -.4, from: .62, pitch: 2.0 } },
  canopy: { ang: -.62, pitch: 1.8, maxW: 1.6, wob: .7, freq: .35, cross: { ang: .7, from: .55, pitch: 2.1 } },
  bench: { ang: .62, pitch: 1.45, maxW: 1.25, wob: .08 },
  iron: { ang: 1.2, pitch: 1.3, maxW: 1.3, wob: .1, cross: { ang: -.3, from: .5, pitch: 1.5 } },
  shadow: { ang: -.035, pitch: 1.8, maxW: 1.5, wob: .3, cross: { ang: .55, from: .3, pitch: 2.0 } },
};
const grey = (v) => { const c = Math.round(255 * (1 - clamp(v))); return `rgb(${c},${c},${c})`; };
const polyFill = (g, pts, col) => { if (pts.length < 3) return; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); g.fillStyle = col; g.fill(); };
// world points → FU (dropping depth)
const pw = (pts) => pts.map((p) => { const q = P(p[0], p[1], p[2]); return [q[0], q[1]]; });
export const horizonY = () => P(0, 1.55, 1e5)[1];
export const toFU = (x, y, z) => { const q = P(x, y, z); return [q[0], q[1], q[2]]; };

// the canopy of the big tree: clumps (world), shared by tones and leaf spawning
const CANOPY = memo('c08canopy', () => {
  const r = prng(4411), out = [];
  for (let i = 0; i < 170; i++) { const a = r() * TAU, d = Math.pow(r(), .42) * 2.7; out.push([TREE.x + .7 + Math.cos(a) * d * 1.3, 4.9 + Math.sin(a) * d * .72, TREE.z + (r() - .5) * 1.6, .3 + r() * .42]); }
  out.sort((p, q) => q[2] - p[2]);
  return out;
});
function paintStatic(g, which) {
  // which = 'tone' | 'reg'; g is in FU (already scaled), origin at the picture corner
  const isT = which === 'tone', col = (k, v) => (isT ? grey(v) : REG[k]);
  const X0 = VIG.x0, Y0 = VIG.y0, X1 = VIG.x1, Y1 = VIG.y1, hz = horizonY();
  // sky: darker toward the top, light at the horizon, a halo around the sun
  if (isT) {
    const sg = g.createLinearGradient(0, Y0, 0, hz); sg.addColorStop(0, grey(.42)); sg.addColorStop(.6, grey(.25)); sg.addColorStop(1, grey(.08)); g.fillStyle = sg; g.fillRect(X0, Y0, X1 - X0, hz - Y0 + 2);
    const hg = g.createRadialGradient(SUN.x, SUN.y, SUN.r * 1.02, SUN.x, SUN.y, 128); hg.addColorStop(0, 'rgba(255,255,255,1)'); hg.addColorStop(.3, 'rgba(255,255,255,.62)'); hg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = hg; g.fillRect(X0, Y0, X1 - X0, hz - Y0 + 2);
  } else { g.fillStyle = REG.sky; g.fillRect(X0, Y0, X1 - X0, hz - Y0 + 2); }
  // two soft cumulus clouds (lighter, a darker belly)
  for (const [cx, cy, sc] of [[470, 150, .9], [870, 292, .55]]) {
    const r = prng(cx), blobs = []; for (let i = 0; i < 11; i++) blobs.push([cx + (r() - .5) * 130 * sc, cy + (r() - .65) * 20 * sc, (14 + r() * 20) * sc]);
    for (const [bx, by, br] of blobs) { g.beginPath(); g.ellipse(bx, by, br * 1.35, br * .78, 0, 0, TAU); if (isT) { const cg = g.createLinearGradient(0, by - br, 0, by + br); cg.addColorStop(0, grey(0)); cg.addColorStop(.6, grey(.02)); cg.addColorStop(1, grey(.16)); g.fillStyle = cg; } else g.fillStyle = REG.cloud; g.fill(); }
  }
  // the far town: a few roofs and the town-hall clock tower (it shows twelve)
  {
    const r = prng(901);
    for (let i = 0; i < 9; i++) { const x = 4 + i * 6.5 + r() * 3, z = 215 + r() * 40, w = 2.5 + r() * 2.5, h = 7 + r() * 9; const q = pw([[x - w, 0, z], [x + w, 0, z], [x + w, h, z], [x + w * .2, h + 3.5, z], [x - w, h, z]]); polyFill(g, q, col('tower', .3 + r() * .1)); }
    const b = TOWER, w = 3.4, h = 30, q = pw([[b.x - w, 0, b.z], [b.x + w, 0, b.z], [b.x + w, h, b.z], [b.x + w * 1.2, h + .6, b.z], [b.x + w * .5, h + 2.2, b.z], [b.x, h + 12, b.z], [b.x - w * .5, h + 2.2, b.z], [b.x - w * 1.2, h + .6, b.z], [b.x - w, h, b.z]]);
    polyFill(g, q, col('tower', .55));
    if (isT) { const c = towerClock(); g.beginPath(); g.arc(c.x, c.y, c.r * 1.25, 0, TAU); g.fillStyle = grey(0); g.fill(); }
  }
  // the far tree line along the horizon (rounded crowns), a little darker at its foot
  {
    const r = prng(77); g.beginPath(); g.moveTo(X0, hz + 4); let x = X0;
    while (x < X1 + 20) { const w = 16 + r() * 26, hh = 12 + r() * 18; g.arc(x + w / 2, hz - hh + w * .4, w * .6, Math.PI * 1.02, Math.PI * 1.98); x += w * .78; }
    g.lineTo(X1, hz + 4); g.closePath();
    if (isT) { const fg = g.createLinearGradient(0, hz - 30, 0, hz + 3); fg.addColorStop(0, grey(.24)); fg.addColorStop(1, grey(.44)); g.fillStyle = fg; } else g.fillStyle = REG.far; g.fill();
  }
  // ground: the lawn, lighter in the middle distance, darker toward the viewer
  if (isT) { const gg = g.createLinearGradient(0, hz, 0, Y1); gg.addColorStop(0, grey(.3)); gg.addColorStop(.3, grey(.15)); gg.addColorStop(1, grey(.3)); g.fillStyle = gg; } else g.fillStyle = REG.grass;
  g.fillRect(X0, hz, X1 - X0, Y1 - hz + 2);
  // the gravel path: from the front right curving to the left into the distance (world curve, 2.4 m wide)
  {
    const pts = pathOutline();
    if (isT) { const pg = g.createLinearGradient(0, hz, 0, Y1); pg.addColorStop(0, grey(.16)); pg.addColorStop(.3, grey(.05)); pg.addColorStop(1, grey(.1)); polyFill(g, pts, pg); } else polyFill(g, pts, REG.path);
  }
  // the big tree's shadow pool on the lawn, the bench's shadow (noon: short, right under it)
  {
    const sh = []; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; sh.push([TREE.x + .6 + Math.cos(a) * 2.9, 0, TREE.z - .4 + Math.sin(a) * 1.7]); }
    polyFill(g, pw(sh), col('shadow', .42));
    const bs = [benchW(-BENCH.len / 2 - .04, -.02, 0), benchW(BENCH.len / 2 + .04, -.02, 0), benchW(BENCH.len / 2 + .1, BENCH.depth + .16, 0), benchW(-BENCH.len / 2 - .1, BENCH.depth + .16, 0)];
    polyFill(g, pw(bs), col('shadow', .5));
  }
  // the big tree: trunk with limbs, then the canopy clumps (lit from the upper right, darker underneath)
  {
    const T0 = TREE, trunk = [[T0.x - .34, 0, T0.z], [T0.x + .3, 0, T0.z], [T0.x + .2, 2.8, T0.z], [T0.x + 1.2, 4.5, T0.z], [T0.x + 1.0, 4.65, T0.z], [T0.x + .05, 3.4, T0.z], [T0.x - .6, 4.7, T0.z], [T0.x - .8, 4.55, T0.z], [T0.x - .2, 2.9, T0.z]];
    if (isT) { const q = pw(trunk), tg = g.createLinearGradient(q[0][0], 0, q[1][0], 0); tg.addColorStop(0, grey(.86)); tg.addColorStop(.7, grey(.55)); tg.addColorStop(1, grey(.36)); polyFill(g, q, tg); } else polyFill(g, pw(trunk), REG.trunk);
    for (const [x, y, z, r] of CANOPY) {
      const c = P(x, y, z), rr = r * vcam.f / c[2], under = clamp((y - 4.4) / -1.2 + .5);
      if (isT) { const cg = g.createRadialGradient(c[0] + rr * .4, c[1] - rr * .45, rr * .05, c[0], c[1], rr * 1.05); cg.addColorStop(0, grey(.14)); cg.addColorStop(.55, grey(.45 + under * .15)); cg.addColorStop(1, grey(.72 + under * .12)); g.fillStyle = cg; } else g.fillStyle = REG.canopy;
      g.beginPath(); g.ellipse(c[0], c[1], rr * 1.1, rr * .9, 0, 0, TAU); g.fill();
    }
  }
  // the bench: iron ends, seat slats, back slats (back to front for this view)
  for (const p of benchParts()) polyFill(g, pw(p.pts), isT ? grey(p.k === 'iron' ? .86 : p.shade) : REG[p.k]);
}
export function pathOutline() {
  return memo('c08path', () => {
    const L = [], R = [];
    for (let i = 0; i <= 48; i++) { const u = i / 48, z = mix(1.8, 80, Math.pow(u, 1.9)), x = pathX(z), w = 1.2; L.push([x - w, 0, z]); R.push([x + w, 0, z]); }
    return [...pw(L), ...pw(R).reverse()];
  });
}
// the path's centre line x at depth z
export function pathX(z) {
  let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (mix(1.8, 80, Math.pow(m, 1.9)) < z) lo = m; else hi = m; }
  const u = (lo + hi) / 2; return mix(2.6, -9, Math.pow(u, .75)) + Math.sin(u * 3.2) * .9;
}
const onPath = (x, z) => Math.abs(x - pathX(z)) < 1.25;
// bench geometry (world quads), drawn back to front
export function benchParts() {
  return memo('c08bench', () => {
    const B = BENCH, L = B.len / 2, parts = [];
    const end = (u) => {
      const s = [[0, 0], [.04, 0], [.06, .4], [.36, .4], [.4, 0], [.44, 0], [.42, .44], [.5, .9], [.46, .92], [.38, .5], [.1, .5], [.0, .62], [-.04, .6], [.02, .44]];
      return s.map(([v, h]) => benchW(u, v - .02, h));
    };
    parts.push({ k: 'iron', pts: end(-L + .06), d: 0 });
    for (let i = 0; i < 3; i++) { const h0 = .52 + i * .13, h1 = h0 + .09, v0 = B.depth - .02 + (h0 - .5) * .22, v1 = B.depth - .02 + (h1 - .5) * .22; parts.push({ k: 'bench', pts: [benchW(-L, v0, h0), benchW(L, v0, h0), benchW(L, v1, h1), benchW(-L, v1, h1)], d: 1, shade: .5 - i * .04 }); }
    for (let i = 3; i >= 0; i--) { const v0 = .02 + i * .11, v1 = v0 + .085; parts.push({ k: 'bench', pts: [benchW(-L, v0, B.seatH), benchW(L, v0, B.seatH), benchW(L, v1, B.seatH), benchW(-L, v1, B.seatH)], d: 2, shade: .22 + i * .04 }); }
    parts.push({ k: 'bench', pts: [benchW(-L, .02, B.seatH), benchW(L, .02, B.seatH), benchW(L, .02, B.seatH - .045), benchW(-L, .02, B.seatH - .045)], d: 2, shade: .62 });
    parts.push({ k: 'iron', pts: end(L - .06), d: 3, near: true });
    return parts;
  });
}

// ---------------------------------------------------------------- tone + region maps → line engraving (Path2D in FU)
function maps(paint) {
  const [, tg] = canvas(RW, RH), [, rg] = canvas(RW, RH);
  for (const [g, which] of [[tg, 'tone'], [rg, 'reg']]) {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, RW, RH); g.imageSmoothingEnabled = which === 'tone';
    g.setTransform(RS, 0, 0, RS, -VIG.x0 * RS, -VIG.y0 * RS); paint(g, which); g.setTransform(1, 0, 0, 1, 0, 0);
  }
  return { tone: tg.getImageData(0, 0, RW, RH).data, reg: rg.getImageData(0, 0, RW, RH).data };
}
const regKey = (d, i) => (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
const hexKey = (h) => parseInt(h.slice(1), 16);
function sampler(M) {
  return (x, y) => {
    const px = (x - VIG.x0) * RS, py = (y - VIG.y0) * RS; if (px < 0 || py < 0 || px >= RW - 1 || py >= RH - 1) return null;
    const i0 = Math.floor(px), j0 = Math.floor(py), fx = px - i0, fy = py - j0, idx = (i, j) => (j * RW + i) * 4;
    const t = (i, j) => 1 - M.tone[idx(i, j)] / 255;
    const tone = mix(mix(t(i0, j0), t(i0 + 1, j0), fx), mix(t(i0, j0 + 1), t(i0 + 1, j0 + 1), fx), fy);
    return { tone, reg: regKey(M.reg, idx(Math.round(px), Math.round(py))) };
  };
}
// one hatch family: lines at angle ang, every pitch FU, anchored at origin (lines do not crawl when the box moves); a run where the
// region matches and the width is visible. box = [x0, y0, x1, y1] limits the lines.
export function hatchLines(path, S, key, sp, fromTone, seed, box, origin, ds = .9) {
  const ca = Math.cos(sp.ang), sa = Math.sin(sp.ang), ox = origin[0], oy = origin[1];
  let dmin = 1e9, dmax = -1e9, qmin = 1e9, qmax = -1e9;
  for (const [x, y] of [[box[0], box[1]], [box[2], box[1]], [box[2], box[3]], [box[0], box[3]]]) { const q = (x - ox) * ca + (y - oy) * sa, d = -(x - ox) * sa + (y - oy) * ca; dmin = Math.min(dmin, d); dmax = Math.max(dmax, d); qmin = Math.min(qmin, q); qmax = Math.max(qmax, q); }
  const maxW = sp.maxW, wob = sp.wob ?? .3, fq = sp.freq ?? .06, n0 = Math.floor(dmin / sp.pitch) - 1, n1 = Math.ceil(dmax / sp.pitch) + 1;
  const q0 = Math.floor(qmin / ds) * ds;
  for (let n = n0; n <= n1; n++) {
    const d = n * sp.pitch, ph = hash(n, seed) * 50, L = [], Rr = [];
    const flush = () => { if (L.length > 1) { path.moveTo(L[0][0], L[0][1]); for (const p of L) path.lineTo(p[0], p[1]); for (let i = Rr.length - 1; i >= 0; i--) path.lineTo(Rr[i][0], Rr[i][1]); path.closePath(); } L.length = 0; Rr.length = 0; };
    for (let q = q0; q <= qmax + ds; q += ds) {
      const off = wob * noise1(q * fq + ph, seed);
      const x = ox + ca * q - sa * (d + off), y = oy + sa * q + ca * (d + off), s = S(x, y);
      if (!s || s.reg !== key) { flush(); continue; }
      const v = clamp((s.tone - fromTone) / (1 - fromTone)); let w = maxW * Math.pow(v, .85) * .5;
      if (sp.dash) { const dn = noise1(q * sp.dash.f + ph * 3.1, seed + 17) * .5 + .5; w *= ss(sp.dash.cut, sp.dash.cut + .12, dn); }
      if (w < .07) { flush(); continue; }
      L.push([x + sa * w, y - ca * w]); Rr.push([x - sa * w, y + ca * w]);
    }
    flush();
  }
}
function engrave(M, specs, seed = 1) {
  const S = sampler(M), path = new Path2D(), box = [VIG.x0, VIG.y0, VIG.x1, VIG.y1], org = [(VIG.x0 + VIG.x1) / 2, (VIG.y0 + VIG.y1) / 2];
  let k = 0;
  for (const [name, sp] of Object.entries(specs)) {
    const key = hexKey(REG[name] || '#000000');
    hatchLines(path, S, key, sp, 0, seed + k * 13, box, org); k++;
    if (sp.cross) hatchLines(path, S, key, { ...sp, ang: sp.cross.ang, pitch: sp.cross.pitch, freq: sp.cross.freq ?? sp.freq, dash: sp.cross.dash || null }, sp.cross.from, seed + k * 29 + 7, box, org);
  }
  return path;
}
export function vigStatic() {
  return memo('c08vigStatic', () => {
    const M = maps(paintStatic);
    const path = engrave(M, SPEC, 5);
    // contours: the bench edges
    const cont = new Path2D();
    for (const p of benchParts()) { const q = pw(p.pts); cont.moveTo(q[0][0], q[0][1]); for (let i = 1; i < q.length; i++) cont.lineTo(q[i][0], q[i][1]); cont.closePath(); }
    // grass tufts (short strokes fanning up), denser and bigger toward the viewer, never on the path or under the bench
    const tuft = new Path2D(), r = prng(6060);
    for (let i = 0; i < 1500; i++) {
      const z = 2.2 + Math.pow(r(), 1.7) * 40, x = (r() - .5) * z * 1.25;
      if (onPath(x, z) || (Math.abs(x - BENCH.cx) < 1.2 && Math.abs(z - BENCH.cz) < .9) || (Math.abs(x - TREE.x) < .5 && Math.abs(z - TREE.z) < .4)) continue;
      const b = P(x, 0, z); if (!(b[2] > 0) || b[1] > VIG.y1 - 1 || b[0] < VIG.x0 + 1 || b[0] > VIG.x1 - 1) continue;
      const hgt = (.05 + r() * .05) * vcam.f / b[2], nb = 2 + Math.floor(r() * 3);
      for (let j = 0; j < nb; j++) { const a = -Math.PI / 2 + (j - (nb - 1) / 2) * .38 + (r() - .5) * .25; tuft.moveTo(b[0] + (j - (nb - 1) / 2) * hgt * .12, b[1]); tuft.quadraticCurveTo(b[0] + Math.cos(a) * hgt * .5, b[1] + Math.sin(a) * hgt * .6, b[0] + Math.cos(a) * hgt * 1.05, b[1] + Math.sin(a) * hgt); }
    }
    // gravel: sparse dots on the path, a few more along its edges
    const gravel = new Path2D(), rg = prng(7171);
    for (let i = 0; i < 1500; i++) {
      const z = 1.9 + Math.pow(rg(), 1.15) * 12, side = rg() * 2 - 1, x = pathX(z) + side * 1.18, b = P(x, 0, z);
      if (!(b[2] > 0) || b[1] > VIG.y1 - 1 || (Math.abs(side) < .55 && rg() < .55)) continue;
      const rr = Math.min(.95, (.004 + rg() * .007) * vcam.f / b[2]); gravel.moveTo(b[0] + rr, b[1]); gravel.arc(b[0], b[1], rr, 0, TAU);
    }
    return { path, cont, tuft, gravel };
  });
}
// raster levels of the static engraving (transparent, ink only): drawn with drawImage (~20 ms) instead of filling the Path2D (~150 ms)
const RASTER = new Map();
export function vigRaster(rs) {
  if (RASTER.has(rs)) return RASTER.get(rs);
  const S = vigStatic(), w = Math.ceil((VIG.x1 - VIG.x0) * rs), h = Math.ceil((VIG.y1 - VIG.y0) * rs), [c, g] = canvas(w, h);
  g.setTransform(rs, 0, 0, rs, -VIG.x0 * rs, -VIG.y0 * rs);
  g.fillStyle = INK; g.fill(S.path);
  g.strokeStyle = INK; g.lineCap = 'round'; g.lineWidth = Math.max(.35, 1.1 / rs * 1.1); g.stroke(S.cont);
  g.lineWidth = Math.max(.28, .9 / rs * 1.1); g.stroke(S.tuft);
  g.fill(S.gravel);
  g.setTransform(1, 0, 0, 1, 0, 0); g.getImageData(0, 0, 1, 1);
  RASTER.set(rs, c); return c;
}
// the tower clock face (FU)
export function towerClock() { const b = TOWER, c = P(b.x, 21, b.z - .2), r = 2.1 * vcam.f / c[2]; return { x: c[0], y: c[1], r }; }

// ---------------------------------------------------------------- the sun: the plate's watermark rings, cut by the burin, plus rays
// the plate's rosette rings mapped onto the form (plate px → FU: (p − C) / K0 + C0)
export const K0 = 6.9;
export const C0 = [SUN.x - (W * .72 - W / 2) / K0, SUN.y - (H * .56 - H / 2) / K0];
export const plateToFU = (p) => [(p[0] - W / 2) / K0 + C0[0], (p[1] - H / 2) / K0 + C0[1]];
function ringFU(k, t, n = 240) {
  const rot = t * .02, out = [];
  for (let i = 0; i <= n; i++) { const q = i / n * TAU, rr = 300 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); out.push(plateToFU([W * .72 + rr * Math.cos(q + rot), H * .56 + rr * Math.sin(q + rot) * .92])); }
  return out;
}
const RAYS = memo('c08rays', () => { const r = prng(515), out = []; for (let i = 0; i < 44; i++) { const a = i / 44 * TAU + (r() - .5) * .03, long = i % 2 === 0; out.push([a, long ? 1.95 + r() * .5 : 1.42 + r() * .22, long ? .85 : .6]); } return out; });
function drawSun(ctx, t, st) {
  const k = st.k, lw = Math.max(.32, .9 / k), col = st.warm > 0 ? hexMix(INK, '#b0601f', st.warm * .8) : INK;
  const t0 = st.ringT0 ?? -1e9, tips = [];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 0; i < 7; i++) {
    const u = eo3(clamp((t - t0 - i * .085) / .62)); if (u <= 0) continue;
    const pts = ringFU(i, t), n = Math.max(2, Math.round(u * (pts.length - 1)));
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let j = 1; j <= n; j++) ctx.lineTo(pts[j][0], pts[j][1]);
    ctx.strokeStyle = col; ctx.lineWidth = lw * (1.15 - i * .05); ctx.stroke();
    if (u < 1 && tips.length < 2) { const a = pts[n - 1], b = pts[n]; tips.push([b[0], b[1], Math.atan2(b[1] - a[1], b[0] - a[0])]); }
  }
  const ru = clamp((t - (st.rays0 ?? -1e9)) / .6);
  if (ru > 0) {
    const R = SUN.r;
    ctx.strokeStyle = col; ctx.lineWidth = lw * .9;
    ctx.beginPath(); ctx.arc(SUN.x, SUN.y, R * .52 * eo3(ru), 0, TAU); ctx.stroke();
    if (ru > .35) { ctx.beginPath(); ctx.arc(SUN.x, SUN.y, R * .3 * eo3((ru - .35) / .65), 0, TAU); ctx.stroke(); }
    ctx.fillStyle = col;
    for (const [a, L, wd] of RAYS) {
      const e = eo3(clamp(ru * 1.3 - (a / TAU) * .3)); if (e <= 0) continue;
      const r0 = R * 1.12, r1 = R * mix(1.12, L, e), w0 = wd * 1.1, ca = Math.cos(a), sa = Math.sin(a);
      ctx.beginPath(); ctx.moveTo(SUN.x + ca * r0 - sa * w0, SUN.y + sa * r0 + ca * w0); ctx.lineTo(SUN.x + ca * r1, SUN.y + sa * r1); ctx.lineTo(SUN.x + ca * r0 + sa * w0, SUN.y + sa * r0 - ca * w0); ctx.closePath(); ctx.fill();
    }
  }
  return tips;
}

// ---------------------------------------------------------------- per-frame engraved sprites (person, pigeons): tone map → lines
const SCR = new Map();
function scratch(key, w, h) {
  let e = SCR.get(key);
  if (!e || e[0].width < w || e[0].height < h) { e = canvas(Math.ceil(Math.max(w, e ? e[0].width : 0) / 64) * 64, Math.ceil(Math.max(h, e ? e[0].height : 0) / 64) * 64); SCR.set(key, e); }
  const g = e[1]; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, e[0].width, e[0].height); return e;
}
// paint(g, rs, bb) draws the sprite in grey tones over transparency into map px (FU → px: (x − bb0) · rs)
// → { lines: Path2D (FU), cont: Path2D (FU), mask: canvas (map px), bb, rs, w, h }. Typed arrays + straight lines: ~5–10 ms a sprite.
function engraveSprite(key, bb, rs, paint, specs, origin) {
  const w = Math.max(4, Math.ceil((bb[2] - bb[0]) * rs) + 2), h = Math.max(4, Math.ceil((bb[3] - bb[1]) * rs) + 2);
  const [c, g] = scratch(key, w, h);
  paint(g, rs, bb);
  const D = g.getImageData(0, 0, w, h).data, N = w * h, TN = new Float32Array(N), AL = new Uint8Array(N);
  let i0 = w, i1 = -1, j0 = h, j1 = -1;
  for (let j = 0, q = 0; j < h; j++) for (let i = 0; i < w; i++, q++) {
    const a = D[q * 4 + 3]; AL[q] = a; if (a < 110) continue;
    TN[q] = 1 - (D[q * 4] * .3 + D[q * 4 + 1] * .59 + D[q * 4 + 2] * .11) / 255;
    if (i < i0) i0 = i; if (i > i1) i1 = i; if (j < j0) j0 = j; if (j > j1) j1 = j;
  }
  const lines = new Path2D(), cont = new Path2D();
  if (i1 < 0) return { lines, cont, mask: c, bb, rs, w, h };
  // the hatch: straight lines anchored at origin (FU), sampled in map px
  const ox = (origin[0] - bb[0]) * rs, oy = (origin[1] - bb[1]) * rs, ds = .7 * rs;
  const corners = [[i0, j0], [i1 + 1, j0], [i1 + 1, j1 + 1], [i0, j1 + 1]];
  for (const sp of specs) {
    const ca = Math.cos(sp.ang), sa = Math.sin(sp.ang), pitch = sp.pitch * rs, from = sp.from ?? 0, maxW = sp.maxW * rs * .5;
    let dmin = 1e9, dmax = -1e9, qmin = 1e9, qmax = -1e9;
    for (const [x, y] of corners) { const qq = (x - ox) * ca + (y - oy) * sa, d = -(x - ox) * sa + (y - oy) * ca; dmin = Math.min(dmin, d); dmax = Math.max(dmax, d); qmin = Math.min(qmin, qq); qmax = Math.max(qmax, qq); }
    const n0 = Math.floor(dmin / pitch), n1 = Math.ceil(dmax / pitch);
    for (let n = n0; n <= n1; n++) {
      const d = n * pitch; let run = null;
      const flush = () => { if (run && run.length > 3) { const m = run.length / 3; lines.moveTo(bb[0] + (run[0] + sa * run[2]) / rs, bb[1] + (run[1] - ca * run[2]) / rs); for (let k = 1; k < m; k++) lines.lineTo(bb[0] + (run[k * 3] + sa * run[k * 3 + 2]) / rs, bb[1] + (run[k * 3 + 1] - ca * run[k * 3 + 2]) / rs); for (let k = m - 1; k >= 0; k--) lines.lineTo(bb[0] + (run[k * 3] - sa * run[k * 3 + 2]) / rs, bb[1] + (run[k * 3 + 1] + ca * run[k * 3 + 2]) / rs); lines.closePath(); } run = null; };
      for (let qq = Math.floor(qmin / ds) * ds; qq <= qmax + ds; qq += ds) {
        const x = ox + ca * qq - sa * d, y = oy + sa * qq + ca * d, xi = x | 0, yi = y | 0;
        if (x < 0 || y < 0 || xi >= w - 1 || yi >= h - 1) { flush(); continue; }
        const q = yi * w + xi; if (AL[q] < 110) { flush(); continue; }
        const fx = x - xi, fy = y - yi, tv = (TN[q] * (1 - fx) + TN[q + 1] * fx) * (1 - fy) + (TN[q + w] * (1 - fx) + TN[q + w + 1] * fx) * fy;
        const v = (tv - from) / (1 - from); if (v <= 0) { flush(); continue; }
        const hw = maxW * Math.pow(Math.min(1, v), .85); if (hw < .07 * rs) { flush(); continue; }
        (run || (run = [])).push(x, y, hw);
      }
      flush();
    }
  }
  // contour: marching squares on the alpha at 50 %, only inside the alpha box
  const th = 128, fu = (i, j) => [bb[0] + i / rs, bb[1] + j / rs], sg = (p, q) => { cont.moveTo(p[0], p[1]); cont.lineTo(q[0], q[1]); };
  for (let j = Math.max(0, j0 - 2); j < Math.min(h - 1, j1 + 2); j++) for (let i = Math.max(0, i0 - 2); i < Math.min(w - 1, i1 + 2); i++) {
    const a = AL[j * w + i], b = AL[j * w + i + 1], cc = AL[(j + 1) * w + i + 1], d = AL[(j + 1) * w + i], id = (a > th) | ((b > th) << 1) | ((cc > th) << 2) | ((d > th) << 3);
    if (id === 0 || id === 15) continue;
    const e = (p, q, x0, y0, x1, y1) => { const u = Math.min(1, Math.max(0, (th - p) / ((q - p) || 1e-6))); return fu(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u); };
    const T = () => e(a, b, i, j, i + 1, j), Rr = () => e(b, cc, i + 1, j, i + 1, j + 1), B = () => e(d, cc, i, j + 1, i + 1, j + 1), L = () => e(a, d, i, j, i, j + 1);
    switch (id) {
      case 1: case 14: sg(L(), T()); break; case 2: case 13: sg(T(), Rr()); break; case 3: case 12: sg(L(), Rr()); break;
      case 4: case 11: sg(Rr(), B()); break; case 6: case 9: sg(T(), B()); break; case 7: case 8: sg(L(), B()); break;
      case 5: sg(L(), T()); sg(Rr(), B()); break; case 10: sg(T(), Rr()); sg(L(), B()); break;
    }
  }
  return { lines, cont, mask: c, bb, rs, w, h };
}
// paper knock-out: the sprite's silhouette filled with the paper colour (so the static lines behind do not show through)
function knockOut(ctx, sp, col) {
  const [mc, mg] = scratch('ko', sp.w, sp.h);
  mg.drawImage(sp.mask, 0, 0); mg.globalCompositeOperation = 'source-in'; mg.fillStyle = col; mg.fillRect(0, 0, sp.w, sp.h); mg.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.translate(sp.bb[0], sp.bb[1]); ctx.scale(1 / sp.rs, 1 / sp.rs); ctx.drawImage(mc, 0, 0, sp.w, sp.h, 0, 0, sp.w, sp.h); ctx.restore();
}

// ---- the person on the bench (figure() → engraving)
const SLUMP = { lean: .42, head: .5, sh: [.1, .04], el: [1.3, 1.35], hip: [1.48, 1.56], kn: [1.42, 1.38], hair: 'short', coat: 0, thigh: [.86, .82], turn: 0 };
const UPRIGHT = { lean: -.08, head: -.32, sh: [.22, .12], el: [1.2, 1.28], hip: [1.42, 1.5], kn: [1.4, 1.36], hair: 'short', coat: 0, thigh: [.86, .82], turn: .3 };
const lerpPose = (a, b, k) => { const o = {}; for (const key of Object.keys(a)) { const va = a[key], vb = b[key] ?? va; o[key] = Array.isArray(va) ? va.map((v, i) => mix(v, vb[i], k)) : typeof va === 'number' ? mix(va, vb, k) : (k < .5 ? va : vb); } return o; };
export function sitterAt() {
  const hp = benchW(SITTER.u, SITTER.v, BENCH.seatH + .03), q = P(...hp);
  return { x: q[0], y: q[1], z: q[2], s: .00946 * vcam.f / q[2] };     // s: FU per figure unit
}
function personSprite(t, st) {
  const S = sitterAt(), rs = st.rs, pose = lerpPose(SLUMP, UPRIGHT, st.sit ?? 0);
  const bb = [S.x - 58 * S.s, S.y - 120 * S.s, S.x + 84 * S.s, S.y + 70 * S.s];
  const paint = (g, r, b) => {
    figure(g, (S.x - b[0]) * r, (S.y - b[1]) * r, S.s * r, pose, { t, seed: 11, shadow: false, hatch: false, dress: { coat: '#7a7a7a', pants: '#3e3e3e', shoes: '#1a1a1a', skin: '#ededed', hair: '#2e2e2e' } });
  };
  return engraveSprite('person', bb, rs, paint, [{ ang: 1.1, pitch: 1.05, maxW: 1.05 }, { ang: -.35, pitch: 1.25, maxW: 1.0, from: .55 }], [S.x, S.y]);
}
// ---- pigeons: pecking, a little walk; take off (fly ≥ 0: seconds since the take-off)
function pigeonState(p, t, fly) {
  const per = 1.25 + p.seed * .17, u = fract(t / per + p.ph), peck = u < .32 ? Math.sin(u / .32 * Math.PI) : 0;
  const stepX = (Math.floor(t / per + p.ph) % 3 === 0 ? .04 : 0) * p.dir;
  let x = p.x + stepX + .03 * Math.sin(t * .4 + p.seed), y = 0, z = p.z, flap = 0, airborne = false;
  if (fly >= 0) {
    const d = fly - p.seed * .06; if (d > 0) {
      airborne = true;
      const dirx = p.dir * (.5 + .4 * hash(p.seed, 3)), up = 1.6 + .8 * hash(p.seed, 5);
      x += dirx * (d * 1.4 + d * d * 1.6); y = up * (d * 1.8 + d * d * 3.4); z += (1.5 + hash(p.seed, 7) * 2.5) * d * d;
      flap = Math.sin(d * TAU * 7 + p.seed * 1.3);
    }
  }
  return { x, y, z, peck: airborne ? 0 : peck, flap, airborne };
}
function paintPigeon(g, q, sc, dir, st) {
  // q: FU of the feet; sc: FU per metre; drawn in metres, y up negative, facing +x (dir mirrors)
  g.save(); g.translate(q[0], q[1]); g.scale(sc * dir, sc);
  const T = (v) => grey(v), pk = st.peck;
  g.strokeStyle = T(.55); g.lineWidth = .012; g.beginPath();
  if (!st.airborne) { g.moveTo(-.01, -.06); g.lineTo(-.02, 0); g.moveTo(.03, -.06); g.lineTo(.035, 0); } else { g.moveTo(0, -.07); g.lineTo(-.05, -.04); }
  g.stroke();
  g.save(); g.translate(0, -.1); g.rotate(st.airborne ? -.25 : pk * .45);
  g.fillStyle = T(.62); g.beginPath(); g.moveTo(-.08, -.01); g.lineTo(-.2, .015); g.lineTo(-.2, .04); g.lineTo(-.07, .03); g.closePath(); g.fill();
  g.fillStyle = T(.85); g.fillRect(-.2, .012, .03, .03);
  const bg = g.createLinearGradient(0, -.06, 0, .06); bg.addColorStop(0, T(.28)); bg.addColorStop(1, T(.52)); g.fillStyle = bg;
  g.beginPath(); g.ellipse(0, 0, .11, .06, -.08, 0, TAU); g.fill();
  if (!st.airborne) {
    g.fillStyle = T(.45); g.beginPath(); g.ellipse(-.02, -.005, .085, .042, -.12, 0, TAU); g.fill();
    g.fillStyle = T(.88); g.fillRect(-.05, -.002, .045, .009); g.fillRect(-.045, .016, .04, .009);
  } else {
    const fa = st.flap;
    for (const side of [1, -1]) {
      const tip = [-.02 + .04 * fa, -.05 - .2 * (side > 0 ? (fa * .5 + .5) : (.6 - fa * .4))];
      g.fillStyle = side > 0 ? T(.4) : T(.6); g.beginPath(); g.moveTo(.04, -.02); g.quadraticCurveTo(.05, tip[1] * .6, tip[0], tip[1]); g.quadraticCurveTo(-.05, tip[1] * .5, -.06, -.01); g.closePath(); g.fill();
    }
  }
  const hx = .1 + pk * .045, hy = -.07 + pk * .135;
  g.fillStyle = T(.55); g.beginPath(); g.moveTo(.05, -.035); g.quadraticCurveTo(hx - .01, hy + .01, hx, hy); g.lineTo(hx + .02, hy + .03); g.quadraticCurveTo(.1, .0, .07, .03); g.closePath(); g.fill();
  g.fillStyle = T(.62); g.beginPath(); g.arc(hx, hy, .028, 0, TAU); g.fill();
  g.fillStyle = T(.15); g.beginPath(); g.moveTo(hx + .024, hy - .004); g.lineTo(hx + .055, hy + .006 + pk * .01); g.lineTo(hx + .024, hy + .01); g.closePath(); g.fill();
  g.fillStyle = T(1); g.beginPath(); g.arc(hx + .006, hy - .006, .006, 0, TAU); g.fill();
  g.restore(); g.restore();
}
function pigeonSprites(t, st) {
  const fly = st.fly ?? -1, out = [];
  const ps = PIGEONS.map((p) => ({ p, s: pigeonState(p, t, fly) })).sort((a, b) => b.s.z - a.s.z);
  for (const { p, s } of ps) {
    const q = P(s.x, s.y, s.z); if (!(q[2] > 0)) continue;
    const sc = vcam.f / q[2], rad = .3 * sc;
    if (q[1] + rad < VIG.y0 || q[0] + rad < VIG.x0 || q[0] - rad > VIG.x1) continue;
    const bb = [q[0] - rad, q[1] - rad * 1.3, q[0] + rad, q[1] + rad * .25];
    const paint = (g, r, b) => { g.setTransform(r, 0, 0, r, -b[0] * r, -b[1] * r); paintPigeon(g, q, sc, p.dir, s); g.setTransform(1, 0, 0, 1, 0, 0); };
    out.push(engraveSprite('pg' + p.seed, bb, st.rs, paint, [{ ang: .25 * p.dir, pitch: .9, maxW: .95 }, { ang: -1.1 * p.dir, pitch: 1.05, maxW: .9, from: .5 }], [q[0], q[1]]));
  }
  return out;
}
// ---- leaves drifting down from the canopy (small engraved leaves, tumbling)
function drawLeaves(ctx, t, lw, paperCol) {
  for (let i = 0; i < 7; i++) {
    const per = 5.5 + hash(i, 1) * 3, life = fract(t / per + hash(i, 2)), cyc = Math.floor(t / per + hash(i, 2));
    const c = CANOPY[Math.floor(hash(i, cyc + 3) * CANOPY.length)];
    const x = c[0] + 1.6 * life + .35 * Math.sin(life * 9 + i), y = mix(c[1] - .3, .02, Math.pow(life, .9)), z = c[2] - 1.5 - life * 2;
    if (y < .03) continue;
    const q = P(x, y, z), sc = vcam.f / q[2], L = .07 * sc, spin = Math.cos(life * 17 + i * 2), rot = life * 6 + i;
    ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(rot); ctx.scale(1, Math.max(.15, Math.abs(spin)));
    ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.quadraticCurveTo(0, -L * .55, L, 0); ctx.quadraticCurveTo(0, L * .55, -L, 0); ctx.fill();
    ctx.strokeStyle = paperCol; ctx.lineWidth = lw * .7; ctx.beginPath(); ctx.moveTo(-L * .8, 0); ctx.lineTo(L * .85, 0); ctx.stroke();
    ctx.restore();
  }
}
// ---- two office workers with briefcases hurrying along the far path (it is a weekday)
function drawWalkers(ctx, t, ink) {
  for (const [i, z, x0, sp] of [[0, 36, 2.6, 1.42], [1, 40, .4, 1.36]]) {
    const x = x0 + (t - 188) * sp;
    const q = P(x, 0, z); if (q[0] > VIG.x1 + 30) continue;
    const sc = vcam.f / q[2] * .00946, ph = (t - 188) * TAU * .96 + i * 2.3;
    figureFlat(ctx, q[0], q[1] - 92.6 * sc, sc, walk(ph), {
      col: ink, fast: true, shadow: false,
      prop: (g, fa) => { g.fillStyle = ink; g.fillRect(fa.hx - 7, fa.hy + 2, 14, 10); g.fillRect(fa.hx - 2.5, fa.hy - 1, 5, 4); },
    });
  }
}

// ---------------------------------------------------------------- reveal: the picture is cut outward from the sun
function revealPath(u) {
  const ry = mix(10, 560, u), rx = ry * 1.75, p = new Path2D();
  for (let i = 0; i <= 96; i++) { const a = i / 96 * TAU, n = 1 + .07 * noise1(a * 3.1, 9) + .04 * noise1(a * 7.3, 4); const x = SUN.x + Math.cos(a) * rx * n, y = SUN.y + Math.sin(a) * ry * n; i ? p.lineTo(x, y) : p.moveTo(x, y); }
  p.closePath(); return { p, rx, ry };
}
function revealTips(u, t) {
  const { rx, ry } = revealPath(u), out = [];
  for (let j = 0; j < 3; j++) { const a = j * 2.1 + t * .45 + 1.2, n = 1 + .07 * noise1(a * 3.1, 9) + .04 * noise1(a * 7.3, 4); out.push([SUN.x + Math.cos(a) * rx * n, SUN.y + Math.sin(a) * ry * n, a + Math.PI / 2]); }
  return out;
}

// ---------------------------------------------------------------- draw the vignette (ctx transform: FU → screen)
export function drawVignette(ctx, t, st) {
  const k = st.k, lw = 1 / k, rev = st.reveal ?? 1, tipsS = [];
  const ink = st.warm > 0 ? hexMix(INK, '#5a3216', st.warm * .5) : INK;
  ctx.save();
  ctx.beginPath(); ctx.rect(VIG.x0, VIG.y0, VIG.x1 - VIG.x0, VIG.y1 - VIG.y0); ctx.clip();
  const ringTips = drawSun(ctx, t, st);
  if (rev > 0) {
    ctx.save();
    if (rev < 1) ctx.clip(revealPath(rev).p);
    { const lv = k <= 3.3 ? 3.2 : 6.4, img = vigRaster(lv); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'medium'; ctx.drawImage(img, VIG.x0, VIG.y0, VIG.x1 - VIG.x0, VIG.y1 - VIG.y0); }
    // tower clock: paper face, both hands up (twelve)
    const c = towerClock(); ctx.fillStyle = st.paper(c.x, c.y); ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, TAU); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = Math.max(.25, c.r * .14); ctx.stroke();
    ctx.lineWidth = Math.max(.25, c.r * .16); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x, c.y - c.r * .82); ctx.moveTo(c.x + c.r * .05, c.y); ctx.lineTo(c.x + c.r * .05, c.y - c.r * .55); ctx.stroke();
    drawWalkers(ctx, t, ink);
    // the person
    const ps = personSprite(t, st), sat = sitterAt();
    knockOut(ctx, ps, st.paper(sat.x, sat.y - 40));
    ctx.fillStyle = ink; ctx.fill(ps.lines); ctx.strokeStyle = ink; ctx.lineWidth = Math.max(.3, 1.25 * lw); ctx.stroke(ps.cont);
    // pigeons (far to near), leaves
    for (const sp of pigeonSprites(t, st)) { knockOut(ctx, sp, st.paper((sp.bb[0] + sp.bb[2]) / 2, sp.bb[3])); ctx.fillStyle = ink; ctx.fill(sp.lines); ctx.strokeStyle = ink; ctx.lineWidth = Math.max(.3, 1.1 * lw); ctx.stroke(sp.cont); }
    drawLeaves(ctx, t, Math.max(.3, lw), st.paper(300, 300));
    ctx.restore();
    if (rev < 1) for (const tp of revealTips(rev, t)) tipsS.push(tp);
  }
  // the light warms to amber (8.05): a warm wash on the paper from the sun, under the lines
  if (st.warm > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'multiply';
    const g = ctx.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 760); g.addColorStop(0, rgba('#ffc46e', .55 * st.warm)); g.addColorStop(.45, rgba('#f2a95a', .32 * st.warm)); g.addColorStop(1, rgba('#d9894a', .2 * st.warm));
    ctx.fillStyle = g; ctx.fillRect(VIG.x0, VIG.y0, VIG.x1 - VIG.x0, VIG.y1 - VIG.y0); ctx.restore();
  }
  ctx.restore();
  return { tips: [...ringTips, ...tipsS] };
}
// burin tips (FU positions) drawn in screen space with the form→screen matrix M
export function drawTips(ctx, tips, M, t, size = 13) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  tips.forEach(([x, y, a], i) => { const sx = M[0] * x + M[2] * y + M[4], sy = M[1] * x + M[3] * y + M[5]; if (sx < -60 || sy < -60 || sx > W + 60 || sy > H + 60) return; burinTip(ctx, sx, sy, a, t, { size, seed: i + 3 }); });
  ctx.restore();
}
