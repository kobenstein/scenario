// C08 · the engraved park vignette at the head of the form (8.01–8.05): a park bench at noon on a weekday, a person alone, pigeons,
// leaves, a far clock tower at twelve, two office workers hurrying along the far path.
// The vignette is a small 3D scene (metres) seen through a fixed vignette camera; its tones are painted into an offscreen and turned
// into line engraving (parallel lines whose width follows the tone, a direction per region), like a banknote vignette.
// Units on the form: FU (form units, the form is 1000 × 1414 FU). The picture area: VIG.x0..x1, VIG.y0..y1.
//   vigStatic()                       → { paths: [{ path: Path2D (FU), col }], sun: { x, y, r } }   built once
//   vigSprites(ctx, t, M, st)         per-frame engraved person, pigeons, leaves, walkers drawn with the form→screen matrix M
//   VIG, SUN, vcam                    geometry
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas, cam3, memo, hash, noise1, TAU, ss, eo3, qio, seg, hexMix } from './v2_c08_core.mjs';
import { figure, POSES, life } from './figure.mjs';

export const VIG = { x0: 104, y0: 100, x1: 896, y1: 516 };
export const INK = '#2a231d', INK2 = '#3b2f25';
// the vignette camera: metres → FU (horizon at y ≈ 345)
export const vcam = cam3({ x: 0, y: 1.55, z: 0, pitch: -.045, f: 700, cx: 500, cy: 314 });
export const SUN = { x: 720, y: 205, r: 37.7 };      // the watermark rosette of the plate becomes the sun (k0 = 6.9)
const P = (x, y, z) => vcam.P(x, y, z);

// ---------------------------------------------------------------- the scene (metres)
export const BENCH = { cx: -1.05, cz: 6.3, yaw: -.62, len: 1.75, seatH: .45, depth: .46, backH: .86 };
// bench local (u along the bench, v from the front edge to the back, h up) → world
export const benchW = (u, v, h) => { const c = Math.cos(BENCH.yaw), s = Math.sin(BENCH.yaw); return [BENCH.cx + u * c - v * s, h, BENCH.cz + u * s + v * c]; };
// the sitter: on the seat a little toward the front end, facing the bench front (−v)
export const SITTER = { u: -.18, v: .2 };
export const PIGEONS = [
  { x: .05, z: 5.35, seed: 1, dir: -1 }, { x: .55, z: 5.75, seed: 2, dir: 1 }, { x: -.25, z: 4.85, seed: 3, dir: 1 },
  { x: .95, z: 5.2, seed: 4, dir: -1 }, { x: .35, z: 4.6, seed: 5, dir: -1 },
];
const TREE = { x: -4.4, z: 12 }, TOWER = { x: 19, z: 185 };

// ---------------------------------------------------------------- tone painting
// tone canvas: grey = ink density (white paper .. black full ink); region canvas: one flat colour per hatch direction
const RS = 2;                                    // px per FU in the tone/region maps
const RW = Math.ceil((VIG.x1 - VIG.x0) * RS), RH = Math.ceil((VIG.y1 - VIG.y0) * RS);
const REG = { sky: '#ff0000', far: '#00ff00', tower: '#0000ff', grass: '#ffff00', path: '#ff00ff', trunk: '#00ffff', canopy: '#800000', bench: '#008000', iron: '#000080', lamp: '#808000', shadow: '#800080', cloud: '#008080' };
const SPEC = {
  sky: { ang: 0, pitch: 2.5, maxW: 1.55, wob: .25 },
  cloud: { ang: 0, pitch: 2.5, maxW: 1.55, wob: .25 },
  far: { ang: 0, pitch: 1.7, maxW: 1.3, wob: .3, freq: .3 },
  tower: { ang: Math.PI / 2, pitch: 1.7, maxW: 1.25, wob: .1 },
  grass: { ang: -.02, pitch: 2.0, maxW: 1.5, wob: .5, freq: .7, dash: { f: .11, cut: .28 }, cross: { ang: 1.25, from: .32, pitch: 2.3, freq: .25, dash: { f: .2, cut: .4 } } },
  path: { ang: .02, pitch: 3.0, maxW: 1.1, wob: .35 },
  trunk: { ang: 1.4, pitch: 1.6, maxW: 1.45, wob: .5, cross: { ang: -.4, from: .62, pitch: 2.0 } },
  canopy: { ang: -.62, pitch: 1.8, maxW: 1.6, wob: .7, freq: .35, cross: { ang: .7, from: .55, pitch: 2.1 } },
  bench: { ang: .32, pitch: 1.5, maxW: 1.3, wob: .1 },
  iron: { ang: 1.2, pitch: 1.3, maxW: 1.3, wob: .1, cross: { ang: -.3, from: .5, pitch: 1.5 } },
  lamp: { ang: Math.PI / 2, pitch: 1.4, maxW: 1.2, wob: .1 },
  shadow: { ang: -.035, pitch: 1.8, maxW: 1.5, wob: .4, cross: { ang: .55, from: .3, pitch: 2.0 } },
};
const grey = (v) => { const c = Math.round(255 * (1 - clamp(v))); return `rgb(${c},${c},${c})`; };
const polyFill = (g, pts, col) => { if (pts.length < 3) return; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); g.fillStyle = col; g.fill(); };
// world points → FU (dropping depth)
const pw = (pts) => pts.map((p) => { const q = P(p[0], p[1], p[2]); return [q[0], q[1]]; });
export const horizonY = () => P(0, 1.55, 1e5)[1];

// the canopy of the big tree: clumps (world), shared by tones and leaf spawning
const CANOPY = memo('c08canopy', () => {
  const r = prng(4411), out = [];
  for (let i = 0; i < 150; i++) { const a = r() * TAU, d = Math.pow(r(), .42) * 2.7; out.push([TREE.x + .7 + Math.cos(a) * d * 1.3, 4.9 + Math.sin(a) * d * .7, TREE.z + (r() - .5) * 1.6, .34 + r() * .44]); }
  out.sort((p, q) => q[2] - p[2]);
  return out;
});
function paintStatic(g, which) {
  // which = 'tone' | 'reg'; g is in FU (already scaled), origin at the picture corner
  const isT = which === 'tone', col = (k, v) => (isT ? grey(v) : REG[k]);
  const X0 = VIG.x0, Y0 = VIG.y0, X1 = VIG.x1, Y1 = VIG.y1, hz = horizonY();
  // sky: darker toward the top, light at the horizon, a halo around the sun
  if (isT) {
    const sg = g.createLinearGradient(0, Y0, 0, hz); sg.addColorStop(0, grey(.4)); sg.addColorStop(.6, grey(.24)); sg.addColorStop(1, grey(.07)); g.fillStyle = sg; g.fillRect(X0, Y0, X1 - X0, hz - Y0 + 2);
    const hg = g.createRadialGradient(SUN.x, SUN.y, SUN.r * 1.05, SUN.x, SUN.y, 175); hg.addColorStop(0, 'rgba(255,255,255,1)'); hg.addColorStop(.22, 'rgba(255,255,255,.7)'); hg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = hg; g.fillRect(X0, Y0, X1 - X0, hz - Y0 + 2);
  } else { g.fillStyle = REG.sky; g.fillRect(X0, Y0, X1 - X0, hz - Y0 + 2); }
  // two soft cumulus clouds (lighter, a darker belly)
  for (const [cx, cy, sc] of [[505, 150, .9], [860, 292, .55]]) {
    const r = prng(cx), blobs = []; for (let i = 0; i < 11; i++) blobs.push([cx + (r() - .5) * 130 * sc, cy + (r() - .65) * 20 * sc, (14 + r() * 20) * sc]);
    for (const [bx, by, br] of blobs) { g.beginPath(); g.ellipse(bx, by, br * 1.35, br * .78, 0, 0, TAU); if (isT) { const cg = g.createLinearGradient(0, by - br, 0, by + br); cg.addColorStop(0, grey(0)); cg.addColorStop(.6, grey(.02)); cg.addColorStop(1, grey(.16)); g.fillStyle = cg; } else g.fillStyle = REG.cloud; g.fill(); }
  }
  // the far town: a few roofs and the town-hall clock tower (it shows twelve)
  {
    const r = prng(901);
    for (let i = 0; i < 9; i++) { const x = 4 + i * 6.5 + r() * 3, z = 215 + r() * 40, w = 2.5 + r() * 2.5, h = 7 + r() * 9; const q = pw([[x - w, 0, z], [x + w, 0, z], [x + w, h, z], [x + w * .2, h + 3.5, z], [x - w, h, z]]); polyFill(g, q, col('tower', .3 + r() * .1)); }
    const b = TOWER, w = 3.4, h = 30, q = pw([[b.x - w, 0, b.z], [b.x + w, 0, b.z], [b.x + w, h, b.z], [b.x + w * 1.2, h + .6, b.z], [b.x + w * .5, h + 2.2, b.z], [b.x, h + 12, b.z], [b.x - w * .5, h + 2.2, b.z], [b.x - w * 1.2, h + .6, b.z], [b.x - w, h, b.z]]);
    polyFill(g, q, col('tower', .55));
  }
  // the far tree line along the horizon (rounded crowns), a little darker at its foot
  {
    const r = prng(77); g.beginPath(); g.moveTo(X0, hz + 4); let x = X0;
    while (x < X1 + 20) { const w = 16 + r() * 26, hh = 12 + r() * 18; g.arc(x + w / 2, hz - hh + w * .4, w * .6, Math.PI * 1.02, Math.PI * 1.98); x += w * .78; }
    g.lineTo(X1, hz + 4); g.closePath();
    if (isT) { const fg = g.createLinearGradient(0, hz - 30, 0, hz + 3); fg.addColorStop(0, grey(.24)); fg.addColorStop(1, grey(.44)); g.fillStyle = fg; } else g.fillStyle = REG.far; g.fill();
  }
  // ground: the lawn, lighter in the middle distance, darker toward the viewer
  if (isT) { const gg = g.createLinearGradient(0, hz, 0, Y1); gg.addColorStop(0, grey(.3)); gg.addColorStop(.3, grey(.17)); gg.addColorStop(1, grey(.32)); g.fillStyle = gg; } else g.fillStyle = REG.grass;
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
  benchTones(g, isT);
}
export function pathOutline() {
  return memo('c08path', () => {
    const L = [], R = [];
    for (let i = 0; i <= 48; i++) { const u = i / 48, z = mix(1.8, 80, Math.pow(u, 1.9)), x = mix(2.6, -9, Math.pow(u, .75)) + Math.sin(u * 3.2) * .9, w = 1.2; L.push([x - w, 0, z]); R.push([x + w, 0, z]); }
    return [...pw(L), ...pw(R).reverse()];
  });
}
// bench geometry (world quads), drawn back to front
export function benchParts() {
  const B = BENCH, L = B.len / 2, parts = [];
  // iron end frames: a side plate shape at u = ±(L - .05): legs, armrest curl
  const end = (u) => {
    const s = [[0, 0], [.04, 0], [.06, .4], [.36, .4], [.4, 0], [.44, 0], [.42, .44], [.5, .9], [.46, .92], [.38, .5], [.1, .5], [.0, .62], [-.04, .6], [.02, .44]];
    return s.map(([v, h]) => benchW(u, v - .02, h));
  };
  parts.push({ k: 'iron', pts: end(L - .06), d: 0 });
  // back slats (3), tilted back
  for (let i = 0; i < 3; i++) { const h0 = .52 + i * .13, h1 = h0 + .09, v0 = B.depth - .02 + (h0 - .5) * .22, v1 = B.depth - .02 + (h1 - .5) * .22; parts.push({ k: 'bench', pts: [benchW(-L, v0, h0), benchW(L, v0, h0), benchW(L, v1, h1), benchW(-L, v1, h1)], d: 1, shade: .46 + i * .03 }); }
  // seat slats (4): top faces + front lip
  for (let i = 0; i < 4; i++) { const v0 = .02 + i * .11, v1 = v0 + .085; parts.push({ k: 'bench', pts: [benchW(-L, v0, B.seatH), benchW(L, v0, B.seatH), benchW(L, v1, B.seatH), benchW(-L, v1, B.seatH)], d: 2, shade: .3 + i * .03 }); }
  parts.push({ k: 'bench', pts: [benchW(-L, .02, B.seatH), benchW(L, .02, B.seatH), benchW(L, .02, B.seatH - .045), benchW(-L, .02, B.seatH - .045)], d: 2, shade: .62 });
  parts.push({ k: 'iron', pts: end(-L + .06), d: 3 });
  return parts;
}
function benchTones(g, isT) {
  for (const p of benchParts()) polyFill(g, pw(p.pts), isT ? grey(p.k === 'iron' ? .86 : p.shade) : REG[p.k]);
}

// ---------------------------------------------------------------- tone + region maps → line engraving (Path2D in FU)
function maps(paint) {
  const [tc, tg] = canvas(RW, RH), [rc, rg] = canvas(RW, RH);
  for (const [g, which] of [[tg, 'tone'], [rg, 'reg']]) {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, RW, RH); g.imageSmoothingEnabled = which === 'tone';
    g.setTransform(RS, 0, 0, RS, -VIG.x0 * RS, -VIG.y0 * RS); paint(g, which); g.setTransform(1, 0, 0, 1, 0, 0);
  }
  return { tone: tg.getImageData(0, 0, RW, RH).data, reg: rg.getImageData(0, 0, RW, RH).data };
}
const regKey = (d, i) => (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
const hexKey = (h) => parseInt(h.slice(1), 16);
// sample (FU) → tone 0..1, region key (nearest, antialiased edges snap to the nearest flat colour)
function sampler(M) {
  return (x, y) => {
    const px = (x - VIG.x0) * RS, py = (y - VIG.y0) * RS; if (px < 0 || py < 0 || px >= RW - 1 || py >= RH - 1) return null;
    const i0 = Math.floor(px), j0 = Math.floor(py), fx = px - i0, fy = py - j0, idx = (i, j) => (j * RW + i) * 4;
    const t = (i, j) => 1 - M.tone[idx(i, j)] / 255;
    const tone = mix(mix(t(i0, j0), t(i0 + 1, j0), fx), mix(t(i0, j0 + 1), t(i0 + 1, j0 + 1), fx), fy);
    return { tone, reg: regKey(M.reg, idx(Math.round(px), Math.round(py))) };
  };
}
// one hatch family: lines at angle ang through the picture, every pitch FU; a run where region matches and the width is visible
function hatchFamily(path, S, key, sp, fromTone = 0, seed = 1, curve = null) {
  const ca = Math.cos(sp.ang), sa = Math.sin(sp.ang), cx = (VIG.x0 + VIG.x1) / 2, cy = (VIG.y0 + VIG.y1) / 2, R = Math.hypot(VIG.x1 - VIG.x0, VIG.y1 - VIG.y0) / 2 + 4;
  const ds = .9, r = prng(seed), maxW = sp.maxW, wob = sp.wob ?? .3, fq = sp.freq ?? .06;
  for (let d = -R; d <= R; d += sp.pitch) {
    const ph = r() * 50, L = [], Rr = [];
    const flush = () => { if (L.length > 1) { path.moveTo(L[0][0], L[0][1]); for (const p of L) path.lineTo(p[0], p[1]); for (let i = Rr.length - 1; i >= 0; i--) path.lineTo(Rr[i][0], Rr[i][1]); path.closePath(); } L.length = 0; Rr.length = 0; };
    for (let q = -R; q <= R; q += ds) {
      const off = wob * noise1(q * fq + ph, seed) + (curve ? curve(q, d) : 0);
      const x = cx + ca * q - sa * (d + off), y = cy + sa * q + ca * (d + off), s = S(x, y);
      if (!s || s.reg !== key) { flush(); continue; }
      const v = clamp((s.tone - fromTone) / (1 - fromTone)); let w = maxW * Math.pow(v, .85) * .5;
      if (sp.dash) { const dn = noise1(q * sp.dash.f + ph * 3.1, seed + 17) * .5 + .5; w *= ss(sp.dash.cut, sp.dash.cut + .12, dn); }
      if (w < .07) { flush(); continue; }
      L.push([x - sa * -w, y + ca * -w]); Rr.push([x - sa * w, y + ca * w]);
    }
    flush();
  }
}
export function engrave(M, specs, seed = 1) {
  const S = sampler(M), path = new Path2D();
  let k = 0;
  for (const [name, sp] of Object.entries(specs)) {
    const key = hexKey(REG[name] || '#000000');
    hatchFamily(path, S, key, sp, 0, seed + k * 13); k++;
    if (sp.cross) hatchFamily(path, S, key, { ...sp, ang: sp.cross.ang, pitch: sp.cross.pitch, freq: sp.cross.freq ?? sp.freq, dash: sp.cross.dash || null }, sp.cross.from, seed + k * 29 + 7);
  }
  return path;
}
export function vigStatic() {
  return memo('c08vigStatic', () => {
    const M = maps(paintStatic);
    const path = engrave(M, SPEC, 5);
    // contours: the bench edges, the tree crown edge (scallops), the tower, the clouds' lower edges, the horizon
    const cont = new Path2D();
    for (const p of benchParts()) { const q = pw(p.pts); cont.moveTo(q[0][0], q[0][1]); for (let i = 1; i < q.length; i++) cont.lineTo(q[i][0], q[i][1]); cont.closePath(); }
    return { path, cont };
  });
}
// the tower clock face (paper with hands at twelve) and the sun's static rays
export function towerClock() { const b = TOWER, c = P(b.x, 21, b.z - .2), r = 2.1 * vcam.f / c[2]; return { x: c[0], y: c[1], r }; }
