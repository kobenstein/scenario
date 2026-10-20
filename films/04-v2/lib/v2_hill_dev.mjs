// Film 4 v2 · the Maslow hill (development copy of lib/maslow4.mjs; same API). See the header of maslow4.mjs.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createCanvas, Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, prng, text } from '../engine.mjs';
import { figureFlat, POSES } from './figure.mjs';

const TAU = Math.PI * 2;
export const HILL = {
  horizon: 792, cx: 960, summit: { x: 960, y: 196 }, standY: 214, labelX: 1560,
  title: "Maslow's hierarchy of needs",
  levels: [
    { key: 'safety', label: 'Physiological · Safety', y0: 792, y1: 652, hw0: 700, hw1: 574 },
    { key: 'belonging', label: 'Belonging', y0: 652, y1: 526, hw0: 548, hw1: 436 },
    { key: 'esteem', label: 'Esteem', y0: 526, y1: 414, hw0: 410, hw1: 316 },
    { key: 'self', label: 'Self-actualization', y0: 414, y1: 312, hw0: 290, hw1: 206 },
    { key: 'trans', label: 'Self-transcendence', y0: 312, y1: 214, hw0: 180, hw1: 90 },
  ],
};
export const toScreen = (cam, x, y) => [(x - cam.x) * cam.z + W / 2, (y - cam.y) * cam.z + H / 2];
export const toWorld = (cam, sx, sy) => [(sx - W / 2) / cam.z + cam.x, (sy - H / 2) / cam.z + cam.y];
export const camAt = (a, b, u) => { const e = eio(clamp(u)); return { x: mix(a.x, b.x, e), y: mix(a.y, b.y, e), z: Math.exp(mix(Math.log(a.z), Math.log(b.z), e)) }; };
export const hwAt = (lv, y) => { const L = HILL.levels[lv]; return mix(L.hw0, L.hw1, (L.y0 - y) / (L.y0 - L.y1)); };
const CX = HILL.cx, HZ = HILL.horizon, LV = HILL.levels;

// ---------------------------------------------------------------- colour
const RGB = new Map();
const hexRGB = (h) => { let v = RGB.get(h); if (!v) { v = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; RGB.set(h, v); } return v; };
const cl8 = (v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));
const toHex = (r, g, b) => '#' + ((1 << 24) | (cl8(r) << 16) | (cl8(g) << 8) | cl8(b)).toString(16).slice(1);
const mixH = (a, b, u) => { const A = hexRGB(a), B = hexRGB(b); return toHex(mix(A[0], B[0], u), mix(A[1], B[1], u), mix(A[2], B[2], u)); };
const shadeH = (h, k) => { const [r, g, b] = hexRGB(h); return k >= 0 ? toHex(r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k) : toHex(r * (1 + k), g * (1 + k), b * (1 + k)); };
// the static palette is drawn at dusk; night multiplies it toward deep indigo (NIGHTM at night = 1)
const NIGHTM = [.25, .27, .52];
let NV = -1, KC = new Map();
function setN(n) { if (n !== NV) { NV = n; KC = new Map(); } }
function K(hex, a = 1) {
  const key = a === 1 ? hex : hex + (Math.round(a * 1000) / 1000); let s = KC.get(key); if (s !== undefined) return s;
  const [r, g, b] = hexRGB(hex);
  s = `rgba(${cl8(r * mix(1, NIGHTM[0], NV))},${cl8(g * mix(1, NIGHTM[1], NV))},${cl8(b * mix(1, NIGHTM[2], NV))},${Math.round(clamp(a) * 1000) / 1000})`;
  KC.set(key, s); return s;
}
const INK = '#130f24';

// ---------------------------------------------------------------- noise
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const noise = (x) => { const i = Math.floor(x), f = x - i; return mix(hash(i), hash(i + 1), f * f * (3 - 2 * f)) * 2 - 1; };
const fbm = (x) => noise(x) * .6 + noise(x * 2.13 + 7.1) * .28 + noise(x * 4.37 + 3.3) * .12;

// ---------------------------------------------------------------- level of detail
// Z = screen px per world unit of the pass being drawn; VB = visible world rect (big items cull inside); PASS = what is drawn:
//   'main' (raster build, dusk), 'vector' (live frame, uses ST), 'erase' / 'glass' / 'tv' / 'front' (lit masks, see bakeMasks)
let Z = 1, PASS = 'main', VB = [-1e9, -1e9, 1e9, 1e9], ST = {}, T = 0;
const lw = (px) => px * Math.pow(Z, -.82);
const inVB = (x0, y0, x1, y1) => x1 >= VB[0] && x0 <= VB[2] && y1 >= VB[1] && y0 <= VB[3];
// octave spacing: the coarsest base·2^k that is ≥ minPx on screen, plus the alpha of the in-between octave (fades in with zoom)
function oct(base, minPx = 2.6) { let d = base; while (d * Z < minPx) d *= 2; return [d, d === base ? 0 : clamp((d * Z * .5 - minPx * .5) / (minPx * .5))]; }
// engraved parallel lines over the world box b = [x0,y0,x1,y1] (the caller clips); stable in world space at any zoom
function hatchBox(ctx, b, ang, base, col, a, o = {}) {
  if (a <= .004) return;
  const x0 = Math.max(b[0], VB[0]), y0 = Math.max(b[1], VB[1]), x1 = Math.min(b[2], VB[2]), y1 = Math.min(b[3], VB[3]); if (x1 <= x0 || y1 <= y0) return;
  const [d, f] = oct(base, o.min ?? 2.6), c = Math.cos(ang), s = Math.sin(ang), nx = -s, ny = c, hd = d / 2;
  const pr = [x0 * nx + y0 * ny, x1 * nx + y0 * ny, x0 * nx + y1 * ny, x1 * nx + y1 * ny];
  const k0 = Math.ceil(Math.min(...pr) / hd), k1 = Math.floor(Math.max(...pr) / hd);
  const ta = [x0 * c + y0 * s, x1 * c + y0 * s, x0 * c + y1 * s, x1 * c + y1 * s], t0 = Math.min(...ta), t1 = Math.max(...ta);
  const brk = o.broken ?? .35, seed = o.seed || 0;
  ctx.lineWidth = lw(o.w ?? .75); ctx.lineCap = 'butt';
  for (let pass = 0; pass < 2; pass++) {
    const al = pass ? a * f : a; if (al < .004) continue;
    ctx.strokeStyle = K(o.col || col, al); ctx.beginPath();
    for (let k = k0; k <= k1; k++) {
      if ((((k % 2) + 2) % 2) !== (pass ? 1 : 0)) continue;
      const off = k * hd, fx = nx * off, fy = ny * off;
      // broken engraved line: segments of 9–30 units with small gaps, decided by the line index (stable)
      let t = t0 - hash(k * 1.7 + seed) * 12;
      let j = 0;
      while (t < t1) {
        const L = 9 + 22 * hash(k * 3.1 + j * 7.7 + seed), g = hash(k * 5.3 + j * 1.9 + seed) < brk ? 1.2 + 2.5 * hash(k + j * 3 + seed) : 0;
        const a1 = Math.max(t, t0), a2 = Math.min(t + L, t1);
        if (a2 > a1) { ctx.moveTo(fx + c * a1, fy + s * a1); ctx.lineTo(fx + c * a2, fy + s * a2); }
        t += L + g; j++;
      }
    }
    ctx.stroke();
  }
}
const rect = (ctx, x, y, w, h) => { ctx.beginPath(); ctx.rect(x, y, w, h); };
const polyP = (ctx, pts) => { ctx.beginPath(); for (let i = 0; i < pts.length; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); ctx.closePath(); };
function vgrad(ctx, y0, y1, stops) { const g = ctx.createLinearGradient(0, y0, 0, y1); for (const [u, c, a] of stops) g.addColorStop(u, K(c, a ?? 1)); return g; }
function hgrad(ctx, x0, x1, stops) { const g = ctx.createLinearGradient(x0, 0, x1, 0); for (const [u, c, a] of stops) g.addColorStop(u, K(c, a ?? 1)); return g; }

// ---------------------------------------------------------------- the ground: hill flanks, terrace arcs
function monotone(xs, ys) {
  const n = xs.length, d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}
// half-width of the hill mass at height y (left flank a little gentler, the right a little steeper and rockier)
const FLK = {
  L: monotone([203, 205, 209, 213.4, 214.6, 222, 240, 263, 312, 363, 414, 470, 526, 600, 652, 700, 740, 792, 812],
    [0, 26, 46, 66, 108, 132, 164, 214, 300, 392, 462, 526, 584, 642, 680, 716, 742, 770, 786]),
  R: monotone([203, 205, 209, 213.4, 214.6, 222, 240, 263, 312, 363, 414, 470, 526, 600, 652, 700, 740, 792, 812],
    [0, 24, 44, 62, 104, 122, 146, 180, 252, 318, 382, 442, 500, 560, 600, 656, 698, 730, 746]),
};
export function flankX(y, side) {
  const base = (side < 0 ? FLK.L : FLK.R)(y), k = side < 0 ? 3.1 : 8.7;
  const rough = y > 218 ? 4.2 * fbm(y * .043 + k) + 1.4 * noise(y * .31 + k * 2) : 0;
  return CX + side * Math.max(0, base + rough);
}
// the street / parapet line of a level: a gentle ∩ (we look up at the hill from the water, so the far ends sit a little lower)
export function terraceY(lv, x) { const L = LV[lv], u = clamp((x - CX) / L.hw0, -1.25, 1.25); return L.y0 + (HZ - L.y0) * .016 * u * u; }
// the hill silhouette (left foot → summit → right foot), world coords
const OUTLINE = (() => {
  const pts = [];
  for (let y = 812; y >= 203; y -= 3) pts.push([flankX(y, -1), y]);
  for (let y = 203; y <= 812; y += 3) pts.push([flankX(y, 1), y]);
  return pts;
})();
export function hillOutline() { return OUTLINE.map((p) => [p[0], p[1]]); }

// ---------------------------------------------------------------- palette (dusk; night is a multiply)
const PLASTER = ['#a8866c', '#a87a70', '#b8a080', '#8a8ca6', '#b0949a', '#9c9c86', '#b4aca4', '#9a8070', '#a88e7e', '#8e7e94', '#b49c84', '#a07c80'];
const ROOFC = ['#8e5f58', '#9a6a5c', '#7e5652', '#a07262', '#86605e', '#94685a'];
const SHUT = ['#5e7a74', '#6a7e94', '#7a6a5a', '#5a6c84', '#7e8a6a', '#6e5e70'];
const STONE = '#6c6480', STONE_L = '#aaa2b4', ROCK = '#5a5070', ROCK_D = '#3c354e', VEG = '#3c4a4a', VEG_D = '#28322f', VEG_L = '#5d6e66', EARTH = '#463e52';
const GLASS0 = '#2e2c4c', GLASS1 = '#1d1b36';

// ---------------------------------------------------------------- the town (deterministic)
const LVP = [
  { sH: 14.5, win: [5.8, 8.8], phiM: .9, hR: [3, 4], side: 18 },
  { sH: 13.5, win: [5.4, 8.4], phiM: .9, hR: [2, 4], side: 16 },
  { sH: 13, win: [5.2, 8.0], phiM: .9, hR: [2, 3], side: 15 },
  { sH: 12.5, win: [5.0, 7.8], phiM: .9, hR: [2, 3], side: 14 },
  { sH: 12, win: [4.6, 7.2], phiM: .9, hR: [1, 2], side: 12 },
];
const HOUSES = [[], [], [], [], []], WINDOWS = [[], [], [], [], []], DOORS = [], ROOMS = [[], [], [], [], []];
const STATIC = [];   // { o (painter order), b: [x0,y0,x1,y1], f(ctx) }
const add = (o, b, f, extra) => STATIC.push(Object.assign({ o, b, f }, extra || {}));
let HID = 0;

// projected facade width at x for a level (the terraces wrap round the hill: facades foreshorten toward the ends)
function rowR(lv, hw) { return hw / Math.sin(LVP[lv].phiM); }
function makeHouse(lv, row, x0, wt, yb, h, r, o = {}) {
  const P = LVP[lv], R = o.R, xc0 = x0 + wt * .5;
  const phi = Math.asin(clamp((xc0 - CX) / R, -.999, .999)), cs = Math.cos(phi), w = o.wp ?? wt * cs;
  const roofK = o.roof || (r() < .16 ? 'flat' : r() < .27 ? 'gable' : r() < .2 ? 'hip' : 'eave');
  const hs = {
    id: HID++, lv, row, x: x0, w, wt, yb, h, phi, cs, sn: Math.sin(phi), kind: o.kind || 'house',
    side: Math.abs(Math.sin(phi)) * (o.depth ?? P.side), sideDir: phi < 0 ? 1 : -1,   // the side wall that faces the centre is visible
    col: o.col || PLASTER[Math.floor(r() * PLASTER.length)], roof: roofK, roofC: ROOFC[Math.floor(r() * ROOFC.length)],
    rh: roofK === 'gable' ? clamp(wt * .34, 7, 15) : roofK === 'flat' ? 2.6 : clamp(wt * .19, 4.5, 8.5),
    shut: SHUT[Math.floor(r() * SHUT.length)], stone: o.stone ?? r() < .16, quoin: r() < .35, band: r() < .45,
    chim: [], seed: Math.floor(r() * 1e6), wins: [], doors: [], climb: r() < .18 ? { x: r(), h: .35 + r() * .5 } : null,
    tone: (r() - .5) * .12, arched: o.arched ?? r() < .14, bal: o.bal ?? .22, shutP: o.shutP ?? .6,
  };
  const nch = hs.roof === 'flat' ? (r() < .5 ? 1 : 0) : r() < .55 ? 1 : r() < .5 ? 2 : 0;
  for (let i = 0; i < nch; i++) hs.chim.push({ u: .15 + r() * .7, w: 2.4 + r() * 1.3, h: 3.5 + r() * 4 });
  if (hs.roof === 'flat') hs.terrace = { pergola: r() < .45, plants: r() < .7, tank: r() < .25 };
  return hs;
}
// windows and doors of a house (projected on the facade)
function fillWindows(hs, r, o = {}) {
  const P = LVP[hs.lv], [ww0, wh0] = P.win, storeys = Math.max(1, Math.round((hs.h - 4) / P.sH));
  const nb = o.bays ?? Math.max(1, Math.floor((hs.wt - 3) / (ww0 + 6.6)));
  const bw = hs.wt / nb, gF = hs.row === 0 && o.ground !== false;
  for (let j = 0; j < storeys; j++) {
    const yf = hs.yb - j * P.sH;   // floor line of storey j
    if (j === 0 && gF) {
      // ground floor of a front-row house: a door (the bay nearest a random pick) + windows or a shopfront
      const db = Math.floor(r() * nb);
      for (let i = 0; i < nb; i++) {
        const u = (i + .5) * bw;
        if (i === db) {
          const dw = Math.min(6.6, bw * .7), dh = Math.min(P.sH - 2.6, 11.8);
          const d = { house: hs, lv: hs.lv, x: hs.x + (u - dw / 2) * hs.cs, y: yf - dh, w: dw * hs.cs, h: dh, arch: r() < .4, ph: r() * TAU, k: r() };
          hs.doors.push(d); DOORS.push(d);
        } else if (o.shop && r() < .7) {
          const sw = Math.min(bw * .8, 9), sh = 9.2;
          hs.wins.push(win(hs, u - sw / 2, yf - sh - 1.6, sw, sh, r, { shop: true }));
        } else hs.wins.push(win(hs, u - ww0 / 2, yf - wh0 - 2.6, ww0, wh0, r, {}));
      }
      continue;
    }
    const top = j === storeys - 1, wh = top && storeys > 2 && r() < .4 ? wh0 * .82 : wh0;
    for (let i = 0; i < nb; i++) {
      if (r() < (o.skip ?? .05)) continue;
      const u = (i + .5) * bw, bal = j > 0 && r() < hs.bal;
      hs.wins.push(win(hs, u - ww0 / 2, yf - wh - (bal ? .6 : 3.2), ww0, bal ? wh + 2.6 : wh, r, { bal }));
    }
  }
  hs.storeys = storeys;
}
function win(hs, u, y, ww, wh, r, o) {
  const w = {
    id: WINDOWS[hs.lv].length, lv: hs.lv, house: hs, x: hs.x + u * hs.cs, y, w: ww * hs.cs, h: wh, u,
    arch: !o.shop && (hs.arched || o.arch) ? 1 : 0, shop: !!o.shop, bal: !!o.bal, box: !o.bal && !o.shop && r() < .16,
    sh: !o.shop && r() < hs.shutP ? 1 : 0, mull: o.shop ? 'shop' : 'cross', ph: r() * TAU, k: r(), warm: r(), cur: r(), tvk: r(),
  };
  WINDOWS[hs.lv].push(w); return w;
}
// fill [x0, x1] (projected x) with houses, left to right
function fillSpan(lv, row, x0, x1, yb, hr, wr, r, R, o = {}) {
  const out = []; let x = x0;
  while (x1 - x > 12) {
    const xc = x + 15, phi = Math.asin(clamp((xc - CX) / R, -.999, .999)), cs = Math.cos(phi);
    let wt = wr[0] + r() * (wr[1] - wr[0]), wp = wt * cs;
    if (x + wp > x1 - wr[0] * cs * .8) { wp = x1 - x; wt = wp / cs; }
    const sR = o.st || LVP[lv].hR, st = sR[0] + Math.floor(r() * (sR[1] - sR[0] + 1));
    const h = clamp(st * LVP[lv].sH + 3.5 + (r() - .5) * 2, hr[0], hr[1]);
    const hs = makeHouse(lv, row, x, wt, yb(x + wp / 2), h, r, { R, wp, ...o });
    out.push(hs); x += wp;
    if (r() < (o.alley ?? .12)) x += 2.5 + r() * 4.5;
  }
  return out;
}

// ---- level by level
const SPECIAL = {};   // named anchors filled below
function buildTown() {
  const r = prng(4242);
  const yF = (lv) => (x) => terraceY(lv, x);
  const yBack = (lv, dy) => (x) => terraceY(lv, x) - dy;
  const reg = (hs) => { HOUSES[hs.lv].push(hs); return hs; };
  // L0 · the harbour street along the quay (front) and the row behind it on a low mid-terrace
  {
    const R = rowR(0, 680), quay = 784, yq = () => quay;
    const spans = [[316, 742], [798, 884], [912, 1052], [1100, 1560]];
    for (const [a, b] of spans) for (const hs of fillSpan(0, 0, a, b, yq, [44, 64], [30, 44], r, R, { alley: .1, st: [3, 4] })) reg(hs);
    // your house: four storeys on the quay, the named window on the top floor
    const you = reg(makeHouse(0, 0, 1052, 48, quay, 4 * 14.5 + 3.5, r, { R, roof: 'eave', col: '#9a8478', bal: 0, arched: false, kind: 'you' }));
    you.namedWin = 'you';
    // the round harbour tower at the right end of the quay, the boathouse at the left
    reg(makeHouse(0, 0, 1560, 40, quay, 48, r, { R, roof: 'cone', kind: 'tower', col: '#8a8290', stone: true, depth: 30 }));
    reg(makeHouse(0, 0, 276, 40, quay, 30, r, { R, roof: 'eave', kind: 'boathouse', col: '#86808e', stone: true }));
    SPECIAL.garden = { x: 742, y: 724, w: 56, h: 60, ground: quay };
    SPECIAL.stair0 = { x: 884, w: 28 };
    // back row (its feet are hidden by the front row)
    for (const [a, b] of [[352, 884], [912, 1580]]) for (const hs of fillSpan(0, 1, a, b, () => 744, [56, 88], [30, 46], r, rowR(0, 640), { alley: .08, st: [4, 5] })) reg(hs);
  }
  // L1 · belonging: homes with balconies, a church with its campanile, a pergola garden with a long table
  {
    const R = rowR(1, 500), y = yF(1);
    for (const [a, b] of [[452, 576], [642, 850], [896, 1000], [1044, 1236], [1266, 1468]]) for (const hs of fillSpan(1, 0, a, b, y, [40, 60], [30, 42], r, R, { bal: .32, st: [3, 4] })) reg(hs);
    reg(makeHouse(1, 0, 576, 15, y(583), 84, r, { R, roof: 'spire', kind: 'campanile', col: '#8e8494', stone: true, depth: 14 }));
    reg(makeHouse(1, 0, 591, 50, y(616), 46, r, { R, roof: 'gable', kind: 'church', col: '#9c8e86', stone: true, depth: 30 }));
    reg(makeHouse(1, 0, 850, 46, y(873), 3 * 13.5 + 3.5, r, { R, roof: 'eave', col: '#a08e7a', bal: 0, kind: 'family' })).namedWin = 'family';
    SPECIAL.pergola = { x: 1000, w: 44 };
    SPECIAL.stair1 = { x: 1236, w: 30 };
    for (const [a, b] of [[488, 1236], [1266, 1432]]) for (const hs of fillSpan(1, 1, a, b, yBack(1, 38), [44, 72], [30, 44], r, rowR(1, 470), { st: [3, 5] })) reg(hs);
  }
  // L2 · esteem: a street of workshops, the square with the tall frame, the clock tower
  {
    const R = rowR(2, 372), y = yF(2);
    for (const [a, b] of [[588, 700], [1094, 1208], [1238, 1334]]) for (const hs of fillSpan(2, 0, a, b, y, [36, 52], [30, 42], r, R)) reg(hs);
    let x = 700; const shopW = [48, 50, 47, 52, 49, 54];
    for (let i = 0; i < 6; i++) {
      const xc = x + 24, phi = Math.asin(clamp((xc - CX) / R, -.99, .99)), wp = i === 5 ? 1000 - x : shopW[i] * Math.cos(phi);
      const hs = reg(makeHouse(2, 0, x, wp / Math.cos(phi), y(x + wp / 2), 2 * 13 + 6 + (i % 2) * 6, r, { R, wp, kind: 'workshop', roof: i % 3 === 1 ? 'gable' : 'eave', bal: .15 }));
      hs.workshop = i; x += wp;
    }
    reg(makeHouse(2, 0, 1076, 18, y(1085), 80, r, { R, roof: 'clock', kind: 'clocktower', col: '#948a98', stone: true, depth: 18 }));
    SPECIAL.square = { x: 1000, w: 76 };
    SPECIAL.stair2 = { x: 1208, w: 30 };
    for (const [a, b] of [[612, 996], [1080, 1208], [1238, 1310]]) for (const hs of fillSpan(2, 1, a, b, yBack(2, 34), [40, 60], [30, 42], r, rowR(2, 348), { st: [3, 4] })) reg(hs);
    reg(makeHouse(2, 1, 996, 84, terraceY(2, 1038) - 20, 40, r, { R: rowR(2, 348), roof: 'eave', kind: 'hall', col: '#a2928a', arched: true, stone: true }));
  }
  // L3 · self-actualization: fewer, larger houses: a library, an atelier with a north light, a villa with a loggia, gardens
  {
    const R = rowR(3, 262), y = yF(3);
    const L3 = [[698, 46, 'villa', 44], [790, 70, 'library', 42], [860, 34, 'house', 38], [944, 48, 'atelier', 46], [1034, 38, 'house', 40], [1160, 60, 'house', 36]];
    for (const [x0, wt, kind, h] of L3) {
      const xc = x0 + wt / 2, cs = Math.cos(Math.asin(clamp((xc - CX) / R, -.99, .99)));
      reg(makeHouse(3, 0, x0, wt, y(xc), h, r, { R, wp: wt * cs, kind, roof: kind === 'library' ? 'flat' : kind === 'atelier' ? 'north' : kind === 'villa' ? 'hip' : undefined, arched: kind === 'library' || kind === 'villa', bal: .1 }));
    }
    reg(makeHouse(3, 1, 742, 40, terraceY(3, 762) - 28, 34, r, { R: rowR(3, 240), kind: 'house' }));
    reg(makeHouse(3, 1, 1098, 30, terraceY(3, 1113) - 30, 26, r, { R: rowR(3, 240), kind: 'observatory', roof: 'dome', col: '#9a92a0', stone: true }));
    SPECIAL.stair3 = { x: 900, w: 40 };
  }
  // L4 · self-transcendence: a hermitage chapel and one small house below the summit
  {
    const R = rowR(4, 160), y = yF(4);
    reg(makeHouse(4, 0, 872, 30, y(887) - 2, 21, r, { R, roof: 'gable', kind: 'chapel', col: '#9a9096', stone: true, arched: true }));
    reg(makeHouse(4, 0, 1012, 26, y(1025), 20, r, { R, roof: 'eave', kind: 'house', col: '#948678' }));
  }
  // windows for everybody
  for (const hs of HOUSES.flat()) {
    const rr = prng(hs.seed);
    if (hs.kind === 'campanile') { campWindows(hs); continue; }
    if (hs.kind === 'clocktower') { clockWindows(hs); continue; }
    if (hs.kind === 'church') { churchWindows(hs); continue; }
    if (hs.kind === 'chapel') { chapelWindows(hs); continue; }
    if (hs.kind === 'tower') { towerWindows(hs, rr); continue; }
    if (hs.kind === 'boathouse') { boathouseWindows(hs, rr); continue; }
    if (hs.kind === 'observatory') { hs.wins.push(win(hs, hs.wt / 2 - 2.2, hs.yb - 14, 4.4, 7, rr, { arch: true })); continue; }
    if (hs.kind === 'library') { fillWindows(hs, rr, { bays: 4, skip: 0 }); continue; }
    if (hs.kind === 'atelier') { atelierWindows(hs, rr); continue; }
    if (hs.kind === 'workshop') { fillWindows(hs, rr, { shop: true, skip: 0 }); continue; }
    if (hs.kind === 'hall') { fillWindows(hs, rr, { bays: 5, skip: 0, ground: false }); continue; }
    fillWindows(hs, rr, {});
  }
  // the named windows: a top-floor window of your house, a first-floor window of the family house, an upper window on the esteem street
  const named = (hs, pick) => { const ws = hs.wins.filter((w) => !w.shop); const w = pick(ws); w.named = hs.namedWin || 'street'; w.bal = false; w.box = false; w.sh = 1; w.arch = 0; return w; };
  const you = HOUSES[0].find((h) => h.kind === 'you'), fam = HOUSES[1].find((h) => h.kind === 'family');
  NAMEDW.you = named(you, (ws) => ws.filter((w) => w.y < you.yb - 3 * 14.5).sort((a, b) => Math.abs(a.u - you.wt * .62) - Math.abs(b.u - you.wt * .62))[0]);
  NAMEDW.family = named(fam, (ws) => ws.filter((w) => w.y < fam.yb - 13.5 && w.y > fam.yb - 2 * 13.5 - 6).sort((a, b) => Math.abs(a.u - fam.wt * .5) - Math.abs(b.u - fam.wt * .5))[0] || ws[0]);
  const st = HOUSES[2].filter((h) => h.row === 0 && h.kind === 'workshop').sort((a, b) => Math.abs(a.x + a.w / 2 - 930) - Math.abs(b.x + b.w / 2 - 930))[0];
  NAMEDW.street = named(st, (ws) => ws.filter((w) => w.y < st.yb - 14).sort((a, b) => Math.abs(a.u - st.wt * .5) - Math.abs(b.u - st.wt * .5))[0] || ws[ws.length - 1]);
  // lighting order: from the centre outward, house by house, a short stagger inside each house
  for (let lv = 0; lv < 5; lv++) {
    const span = LV[lv].hw0;
    for (const hs of HOUSES[lv]) {
      const rr = prng(hs.seed + 7), dh = clamp(Math.abs(hs.x + hs.w / 2 - CX) / span) * .9 + rr() * .05;
      const order = hs.wins.map((w, i) => [w, rr()]).sort((a, b) => a[1] - b[1]);
      order.forEach(([w], i) => { w.th = Math.min(1, dh + i * .011); w.d = dh; if (w.k > .93) w.th = Math.min(1, w.th + .08); w.sth = rr() * .92; });
    }
  }
}
const NAMEDW = {};
function campWindows(hs) {
  const r = prng(hs.seed); hs.wins.push(win(hs, hs.wt / 2 - 1.8, hs.yb - hs.h + 10, 3.6, 7.5, r, { arch: true })); hs.wins.at(-1).sh = 0; hs.wins.at(-1).mull = 'none';
  hs.wins.push(win(hs, hs.wt / 2 - 1.2, hs.yb - hs.h * .5, 2.4, 5, r, { arch: true })); hs.wins.at(-1).sh = 0; hs.wins.at(-1).mull = 'none';
}
function clockWindows(hs) { const r = prng(hs.seed); const w = win(hs, hs.wt / 2 - 1.6, hs.yb - 30, 3.2, 6, r, { arch: true }); w.sh = 0; w.mull = 'none'; hs.wins.push(w); }
function churchWindows(hs) {
  const r = prng(hs.seed), w = win(hs, hs.wt / 2 - 4.2, hs.yb - hs.h + 5, 8.4, 8.4, r, {}); w.round = 1; w.sh = 0; w.mull = 'rose'; hs.wins.push(w);
  for (const u of [.2, .8]) { const v = win(hs, hs.wt * u - 2, hs.yb - 30, 4, 10, r, { arch: true }); v.sh = 0; v.mull = 'none'; hs.wins.push(v); }
  const d = { house: hs, lv: hs.lv, x: hs.x + (hs.wt / 2 - 4.5) * hs.cs, y: hs.yb - 15, w: 9 * hs.cs, h: 15, arch: true, ph: r() * TAU, k: r(), church: true }; hs.doors.push(d); DOORS.push(d);
}
function chapelWindows(hs) {
  const r = prng(hs.seed), w = win(hs, hs.wt / 2 - 2.4, hs.yb - hs.h + 2.5, 4.8, 4.8, r, {}); w.round = 1; w.sh = 0; w.mull = 'none'; hs.wins.push(w);
  const v = win(hs, hs.wt * .78 - 1.6, hs.yb - 11, 3.2, 6, r, { arch: true }); v.sh = 0; v.mull = 'none'; hs.wins.push(v);
}
function towerWindows(hs, r) { for (const [u, y] of [[.5, 34], [.3, 20], [.72, 20]]) { const w = win(hs, hs.wt * u - 1.8, hs.yb - y, 3.6, 6.4, r, { arch: true }); w.sh = 0; w.mull = 'none'; hs.wins.push(w); } }
function boathouseWindows(hs, r) { const w = win(hs, hs.wt * .5 - 2.6, hs.yb - 26, 5.2, 6, r, {}); hs.wins.push(w); }
function atelierWindows(hs, r) {
  const w = win(hs, hs.wt * .5 - 13, hs.yb - hs.h + 3, 26, 17, r, {}); w.mull = 'grid'; w.sh = 0; w.big = true; hs.wins.push(w);
  for (const u of [.22, .5, .78]) hs.wins.push(win(hs, hs.wt * u - 2.8, hs.yb - 12, 5.6, 8.4, r, {}));
}
buildTown();

// ---------------------------------------------------------------- drawing the static town
// window shape
function winPath(ctx, x, y, w, h, arch, round) {
  ctx.beginPath();
  if (round) { ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, TAU); return; }
  if (arch) { const r = w / 2; ctx.moveTo(x, y + h); ctx.lineTo(x, y + r); ctx.ellipse(x + r, y + r, r, r, 0, Math.PI, TAU); ctx.lineTo(x + w, y + h); ctx.closePath(); return; }
  ctx.rect(x, y, w, h);
}
// unlit glass: the dusk sky in it, lighter at the top
function glassUnlit(ctx, w) {
  winPath(ctx, w.x, w.y, w.w, w.h, w.arch, w.round);
  ctx.fillStyle = vgrad(ctx, w.y, w.y + w.h, [[0, '#4a4670'], [.45, GLASS0], [1, GLASS1]]); ctx.fill();
  if (Z > 1.6 && !w.named) { ctx.save(); ctx.clip(); ctx.fillStyle = K('#8a86b0', .16); ctx.beginPath(); ctx.moveTo(w.x + w.w * .15, w.y + w.h); ctx.lineTo(w.x + w.w * .55, w.y); ctx.lineTo(w.x + w.w * .75, w.y); ctx.lineTo(w.x + w.w * .35, w.y + w.h); ctx.fill(); ctx.restore(); }
  if (w.named) { // the open window: a dark room behind it
    ctx.fillStyle = vgrad(ctx, w.y, w.y + w.h, [[0, '#191630'], [1, '#100e22']]); winPath(ctx, w.x, w.y, w.w, w.h, w.arch, w.round); ctx.fill();
  }
}
// lit glass (amber room light or the cold light of a screen); raw colours (lights are not tinted by night)
function glassLit(ctx, w, kind, a = 1) {
  if (a <= .003) return;
  ctx.save(); ctx.globalAlpha *= a;
  winPath(ctx, w.x, w.y, w.w, w.h, w.arch, w.round); ctx.clip();
  const g = ctx.createLinearGradient(0, w.y, 0, w.y + w.h);
  if (kind === 'tv') {
    const k = w.tvk; g.addColorStop(0, k < .5 ? '#2c5f88' : '#244e78'); g.addColorStop(.55, '#5fb4dc'); g.addColorStop(1, k < .5 ? '#a8ecff' : '#8fe6ff');
    ctx.fillStyle = g; ctx.fillRect(w.x, w.y, w.w, w.h);
    if (Z > 2) { const cx = w.x + w.w * (.3 + .4 * w.k), cy = w.y + w.h * .8, rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, w.w * .9); rg.addColorStop(0, 'rgba(216,247,255,.75)'); rg.addColorStop(1, 'rgba(216,247,255,0)'); ctx.fillStyle = rg; ctx.fillRect(w.x, w.y, w.w, w.h); }
  } else {
    const wm = w.warm; // per window warmth: warm white … deep amber
    const top = wm < .3 ? '#ffe2a8' : wm < .75 ? '#ffcf86' : '#ffbe6a', bot = wm < .3 ? '#ffc070' : wm < .75 ? '#ffaa50' : '#f0913c';
    g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(w.x, w.y, w.w, w.h);
    // a lamp inside: a brighter core
    const cx = w.x + w.w * (.3 + .4 * w.k), cy = w.y + w.h * (.3 + .25 * w.cur), rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w.w, w.h) * .7);
    rg.addColorStop(0, 'rgba(255,248,230,.85)'); rg.addColorStop(1, 'rgba(255,241,214,0)'); ctx.fillStyle = rg; ctx.fillRect(w.x, w.y, w.w, w.h);
    if (!w.shop && !w.round && w.cur < .45) { // curtains: soft fabric at the sides
      ctx.fillStyle = 'rgba(255,236,200,.55)'; const cw = w.w * (.18 + .12 * w.k);
      ctx.fillRect(w.x, w.y, cw, w.h); if (w.cur < .25) ctx.fillRect(w.x + w.w - cw, w.y, cw, w.h);
      if (Z > 3) { ctx.strokeStyle = 'rgba(190,120,60,.35)'; ctx.lineWidth = lw(.6); ctx.beginPath(); for (let i = 1; i < 3; i++) { ctx.moveTo(w.x + cw * i / 3, w.y); ctx.lineTo(w.x + cw * i / 3, w.y + w.h); } ctx.stroke(); }
    }
    if (w.shop && Z > 2) { // a shop / workshop: shelves and things on them
      ctx.fillStyle = 'rgba(122,59,23,.45)'; for (let i = 1; i < 3; i++) ctx.fillRect(w.x, w.y + w.h * i / 3, w.w, w.h * .05);
    }
  }
  ctx.restore();
}
// window back parts: surround, sill, shutters (never over the glass)
function winBack(ctx, w, hs) {
  const x = w.x, y = w.y, ww = w.w, wh = w.h, s = hs.cs, fr = .75 * s;
  // surround
  ctx.fillStyle = K(shadeH(hs.col, .22));
  if (w.round) { ctx.beginPath(); ctx.ellipse(x + ww / 2, y + wh / 2, ww / 2 + 1.1, wh / 2 + 1.1, 0, 0, TAU); ctx.fill(); }
  else { winPath(ctx, x - fr, y - .9, ww + fr * 2, wh + 1.3, w.arch, 0); ctx.fill(); }
  // sill
  if (!w.round) {
    ctx.fillStyle = K(shadeH(hs.col, .3)); ctx.fillRect(x - fr - .5 * s, y + wh, ww + fr * 2 + s, .9);
    ctx.fillStyle = K(INK, .28); ctx.fillRect(x - fr - .3 * s, y + wh + .9, ww + fr * 2 + .6 * s, .7);
  }
  // shutters: open flat against the wall either side
  if (w.sh && !w.round && !w.shop) {
    const sw = ww * .5 + .1, c = hs.shut;
    for (const sd of [-1, 1]) {
      const sx = sd < 0 ? x - fr - sw - .15 : x + ww + fr + .15;
      ctx.fillStyle = K(c); ctx.fillRect(sx, y - .2, sw, wh + .2);
      ctx.fillStyle = K(INK, .22); ctx.fillRect(sd < 0 ? sx : sx + sw - .35 * s, y - .2, .35 * s, wh + .2);
      if (Z * .7 > 2.2) { // louvres
        ctx.strokeStyle = K(INK, .3); ctx.lineWidth = lw(.6); ctx.beginPath();
        for (let yy = y + .6; yy < y + wh - .2; yy += .7) { ctx.moveTo(sx + .25, yy); ctx.lineTo(sx + sw - .25, yy); }
        ctx.stroke();
      }
    }
  }
  if (w.named) { // the open casements: two glazed leaves swung outward beside the opening
    for (const sd of [-1, 1]) {
      const cw = ww * .28, sx = sd < 0 ? x - fr - cw : x + ww + fr;
      ctx.fillStyle = K('#e4dccf'); ctx.fillRect(sx, y - .1, cw, wh + .1);
      ctx.fillStyle = K('#3a3858'); ctx.fillRect(sx + .35 * s, y + .4, cw - .7 * s, wh - .8);
      ctx.fillStyle = K('#7a76a0', .5); ctx.fillRect(sx + .35 * s, y + .4, (cw - .7 * s) * .4, wh - .8);
      ctx.fillStyle = K('#e4dccf'); ctx.fillRect(sx, y + wh * .45, cw, .45);
    }
  }
}
// window front parts: mullions, balcony, flower box (these cover the glass)
function winFront(ctx, w, hs) {
  const x = w.x, y = w.y, ww = w.w, wh = w.h, s = hs.cs, mc = w.mull;
  if (!w.named && mc !== 'none') {
    ctx.fillStyle = K('#e8e0d4', PASS === 'front' ? 1 : .95);
    const bw = Math.max(.32, lw(.9)) * Math.min(1, s + .2);
    if (mc === 'cross') { ctx.fillRect(x + ww / 2 - bw / 2, y, bw, wh); ctx.fillRect(x, y + wh * .34, ww, bw); }
    else if (mc === 'shop') { ctx.fillRect(x + ww / 3 - bw / 2, y, bw, wh); ctx.fillRect(x + ww * 2 / 3 - bw / 2, y, bw, wh); ctx.fillRect(x, y + wh * .28, ww, bw); }
    else if (mc === 'grid') { for (let i = 1; i < 6; i++) ctx.fillRect(x + ww * i / 6 - bw / 2, y, bw, wh); for (let j = 1; j < 4; j++) ctx.fillRect(x, y + wh * j / 4 - bw / 2, ww, bw); }
    else if (mc === 'rose') { ctx.strokeStyle = K('#e8e0d4'); ctx.lineWidth = bw; ctx.beginPath(); const cx = x + ww / 2, cy = y + wh / 2; for (let i = 0; i < 8; i++) { const a = i * TAU / 8; ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * ww / 2, cy + Math.sin(a) * wh / 2); } ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy, ww * .18, wh * .18, 0, 0, TAU); ctx.stroke(); }
    // the lintel's shadow on the glass top
    if (!w.round) { ctx.fillStyle = K(INK, .35); ctx.fillRect(x, y, ww, Math.max(.3, wh * .06)); }
  }
  if (w.bal) { // balcony: slab + iron railing
    const bx = x - 2.2 * s, bw = ww + 4.4 * s, by = y + wh;
    ctx.fillStyle = K(shadeH(hs.col, .25)); ctx.fillRect(bx, by, bw, 1.1);
    ctx.fillStyle = K(INK, .3); ctx.fillRect(bx + .2, by + 1.1, bw - .4, .8);
    ctx.strokeStyle = K('#1d1a2e', .85); ctx.lineWidth = lw(.7); ctx.beginPath();
    ctx.moveTo(bx, by - 4.2); ctx.lineTo(bx + bw, by - 4.2);
    const step = Z > 2.2 ? .9 : Z > 1.1 ? 1.8 : 3.6;
    for (let xx = bx; xx <= bx + bw + .01; xx += step * s) { ctx.moveTo(xx, by - 4.2); ctx.lineTo(xx, by); }
    ctx.stroke();
    if (hash(w.ph * 3.3) < .55) { ctx.fillStyle = K(VEG); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(bx + bw * (.2 + .3 * i), by - .6, 1.1, 0, TAU); ctx.fill(); } }
  }
  if (w.box) { // flower box with geraniums
    const by = y + wh - .8; ctx.fillStyle = K('#6a4a44'); ctx.fillRect(x - .4, by, ww + .8, 1.4);
    ctx.fillStyle = K(VEG); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(x + ww * (i + .5) / 4, by - .2, .9, 0, TAU); ctx.fill(); }
    ctx.fillStyle = K('#c0666a'); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x + ww * (i + 1) / 4, by - .7, .55, 0, TAU); ctx.fill(); }
  }
}
// a whole house
function drawHouse(ctx, hs) {
  if (PASS === 'glass' || PASS === 'tv') { for (const w of hs.wins) if (!w.named) glassLit(ctx, w, PASS === 'tv' ? 'tv' : 'amber'); return; }
  if (PASS === 'front') { for (const w of hs.wins) winFront(ctx, w, hs); houseOver(ctx, hs); return; }
  const special = HOUSE_KIND[hs.kind];
  if (special) { special(ctx, hs); return; }
  houseBody(ctx, hs);
  for (const w of hs.wins) winBack(ctx, w, hs);
  for (const w of hs.wins) glassUnlit(ctx, w);
  if (PASS === 'vector') for (const w of hs.wins) liveGlass(ctx, w);
  for (const w of hs.wins) winFront(ctx, w, hs);
  for (const d of hs.doors) drawDoor(ctx, d, hs);
  houseRoof(ctx, hs);
  houseOver(ctx, hs);
}
function houseBody(ctx, hs) {
  const { x, w, yb, h } = hs, top = yb - h, col = shadeH(hs.col, hs.tone), b = hs.sideDir;
  // the side wall facing the centre (visible where the terraces curve round the hill)
  if (hs.side > .6) {
    const sx = b > 0 ? x + w : x, sw = hs.side * b, dy = hs.side * .05;
    ctx.fillStyle = K(shadeH(col, -.32));
    ctx.beginPath(); ctx.moveTo(sx, yb); ctx.lineTo(sx, top); if (hs.roof === 'eave' || hs.roof === 'hip') { ctx.lineTo(sx + sw * .5, top - hs.rh * .9); } ctx.lineTo(sx + sw, top + dy); ctx.lineTo(sx + sw, yb + dy); ctx.closePath(); ctx.fill();
    if (Z > .9) { ctx.save(); ctx.clip(); hatchBox(ctx, [Math.min(sx, sx + sw), top - hs.rh, Math.max(sx, sx + sw), yb + 1], b > 0 ? -.9 : .9, 1.1, INK, .22, { seed: hs.id }); ctx.restore(); }
  }
  // facade: sky light from above, darker toward the ground
  ctx.fillStyle = vgrad(ctx, top, yb, [[0, shadeH(col, .08)], [.55, col], [1, shadeH(col, -.2)]]);
  if (hs.roof === 'gable') { ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x, top); ctx.lineTo(x + w / 2, top - hs.rh); ctx.lineTo(x + w, top); ctx.lineTo(x + w, yb); ctx.closePath(); }
  else rect(ctx, x, top, w, h);
  ctx.fill();
  ctx.save(); ctx.clip();
  // the west glow on the left, shade on the right
  ctx.fillStyle = hgrad(ctx, x, x + w, [[0, '#ffd8c0', .08], [.5, '#ffd8c0', 0], [1, INK, .08]]); ctx.fillRect(x, top - hs.rh, w, h + hs.rh);
  if (hs.stone) { // ashlar courses
    const [d] = oct(2.4, 2.4); ctx.strokeStyle = K(INK, .2); ctx.lineWidth = lw(.6); ctx.beginPath();
    for (let yy = yb - d; yy > top - hs.rh; yy -= d) { if (yy < VB[1] || yy > VB[3]) continue; ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); const row = Math.round(yy / d); for (let xx = x + (row & 1 ? 1.8 : 4.2) * hs.cs; xx < x + w; xx += 5.2 * hs.cs) { ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + d); } }
    ctx.stroke();
  } else hatchBox(ctx, [x, top - hs.rh, x + w, yb], 0, 1.15, INK, .1 + .06 * hash(hs.id), { seed: hs.id * 3, broken: .5 });
  // storey bands and quoins
  if (hs.band) { ctx.fillStyle = K(shadeH(col, .16)); for (let j = 1; j < hs.storeys; j++) { const yy = yb - j * LVP[hs.lv].sH + .2; ctx.fillRect(x, yy, w, .7); } }
  if (hs.quoin && !hs.stone) { ctx.fillStyle = K(shadeH(col, .18)); for (let yy = yb - 2.6, i = 0; yy > top; yy -= 2.6, i++) { const qw = (i & 1 ? 2.4 : 3.6) * hs.cs; ctx.fillRect(x, yy, qw, 2.2); ctx.fillRect(x + w - qw, yy, qw, 2.2); } }
  // under the eaves: a soft shadow band
  ctx.fillStyle = vgrad(ctx, top, top + 4, [[0, INK, .45], [1, INK, 0]]); ctx.fillRect(x, top, w, 4);
  // ground: occlusion
  ctx.fillStyle = vgrad(ctx, yb - 7, yb, [[0, INK, 0], [1, INK, .3]]); ctx.fillRect(x, yb - 7, w, 7);
  ctx.restore();
  // engraved edges
  ctx.strokeStyle = K(INK, .45); ctx.lineWidth = lw(.7); ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x, top); ctx.moveTo(x + w, top); ctx.lineTo(x + w, yb); ctx.stroke();
  ctx.strokeStyle = K('#ffe6d0', .22); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(x + lw(.5), yb - 2); ctx.lineTo(x + lw(.5), top + 1); ctx.stroke();
}
function houseRoof(ctx, hs) {
  const { x, w, yb, h } = hs, top = yb - h, rc = hs.roofC, rh = hs.rh, ov = 1.1 + hs.wt * .02;
  if (hs.roof === 'flat') {
    ctx.fillStyle = K(shadeH(hs.col, .1)); ctx.fillRect(x - .4, top - rh, w + .8, rh);
    ctx.fillStyle = K(shadeH(hs.col, .28)); ctx.fillRect(x - .7, top - rh - .7, w + 1.4, .9);
    ctx.fillStyle = K(INK, .35); ctx.fillRect(x - .4, top - .2, w + .8, .6);
    const t = hs.terrace; if (t) {
      if (t.pergola) { const px = x + w * .15, pw = w * .62; ctx.strokeStyle = K('#4a3a3a', .9); ctx.lineWidth = lw(.6); ctx.beginPath(); for (let i = 0; i <= 3; i++) { const xx = px + pw * i / 3; ctx.moveTo(xx, top - rh); ctx.lineTo(xx, top - rh - 6.5); } ctx.moveTo(px - 1, top - rh - 6.5); ctx.lineTo(px + pw + 1, top - rh - 6.5); ctx.stroke(); leafMass(ctx, px + pw * .5, top - rh - 7.2, pw * .55, 2.2, VEG, hs.id); }
      if (t.plants) leafMass(ctx, x + w * .82, top - rh - 1.6, 2.4, 2, VEG_L, hs.id + 1);
      if (t.tank) { ctx.fillStyle = K('#8a8296'); ctx.fillRect(x + w * .1, top - rh - 4, 4, 4); }
    }
    return;
  }
  if (hs.roof === 'gable') { // the gable faces the street: raking eaves and a little round window
    ctx.strokeStyle = K(shadeH(rc, -.2)); ctx.lineWidth = 1.3; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - ov * .7, top + .5); ctx.lineTo(x + w / 2, top - rh - 1); ctx.lineTo(x + w + ov * .7, top + .5); ctx.stroke();
    ctx.strokeStyle = K(INK, .5); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(x - ov * .7, top + 1.2); ctx.lineTo(x + w / 2, top - rh); ctx.lineTo(x + w + ov * .7, top + 1.2); ctx.stroke();
    chimneys(ctx, hs, top - rh * .5);
    return;
  }
  // eave / hip / north (atelier) roofs: the tiled slope seen above the eave
  const y1 = top - rh, inset = hs.roof === 'hip' ? rh * 1.1 : hs.roof === 'north' ? 0 : rh * .25;
  const pts = [[x - ov, top + .4], [x + w + ov, top + .4], [x + w - inset + ov * .3, y1], [x + inset - ov * .3, y1]];
  polyP(ctx, pts); ctx.fillStyle = vgrad(ctx, y1, top, [[0, shadeH(rc, .14)], [1, shadeH(rc, -.12)]]); ctx.fill();
  ctx.save(); ctx.clip();
  // tile courses + channels
  const [d, f] = oct(1.25, 2.4); ctx.lineWidth = lw(.6);
  for (let pass = 0; pass < 2; pass++) {
    const al = pass ? .38 * f : .38; if (al < .01) continue;
    ctx.strokeStyle = K(INK, al); ctx.beginPath();
    for (let k = Math.ceil(y1 / (d / 2)); k * d / 2 < top; k++) { if ((((k % 2) + 2) % 2) !== pass) continue; const yy = k * d / 2; ctx.moveTo(x - ov, yy); ctx.lineTo(x + w + ov, yy); }
    ctx.stroke();
  }
  if (Z > 2.2) { const [dc] = oct(1.5, 3); ctx.strokeStyle = K(INK, .22); ctx.beginPath(); for (let xx = x - ov; xx < x + w + ov; xx += dc) { ctx.moveTo(xx, y1); ctx.lineTo(xx, top); } ctx.stroke(); }
  ctx.fillStyle = hgrad(ctx, x - ov, x + w + ov, [[0, '#ffd8c0', .12], [.4, '#ffd8c0', 0], [1, INK, .14]]); ctx.fillRect(x - ov, y1, w + 2 * ov, rh + 1);
  ctx.restore();
  // eave shadow line + ridge
  ctx.fillStyle = K(INK, .55); ctx.fillRect(x - ov, top + .2, w + 2 * ov, .8);
  ctx.strokeStyle = K(shadeH(rc, .3), .8); ctx.lineWidth = lw(.8); ctx.beginPath(); ctx.moveTo(pts[3][0], y1); ctx.lineTo(pts[2][0], y1); ctx.stroke();
  if (hs.roof === 'north') { // the atelier's skylight band
    ctx.fillStyle = K('#3c3a5e'); ctx.fillRect(x + w * .2, y1 + rh * .25, w * .6, rh * .45);
    ctx.strokeStyle = K('#e0d8cc', .7); ctx.lineWidth = lw(.5); ctx.beginPath(); for (let i = 0; i <= 6; i++) { const xx = x + w * .2 + w * .6 * i / 6; ctx.moveTo(xx, y1 + rh * .25); ctx.lineTo(xx, y1 + rh * .7); } ctx.stroke();
  }
  chimneys(ctx, hs, y1);
}
function chimneys(ctx, hs, yr) {
  for (const c of hs.chim) {
    const cx = hs.x + hs.w * c.u, cw = c.w * hs.cs, y0 = yr + 2.2, y1 = yr - c.h;
    ctx.fillStyle = K(shadeH(hs.col, -.08)); ctx.fillRect(cx - cw / 2, y1, cw, y0 - y1);
    ctx.fillStyle = K(INK, .3); ctx.fillRect(cx + cw * .1, y1, cw * .4, y0 - y1);
    ctx.fillStyle = K(shadeH(hs.col, .2)); ctx.fillRect(cx - cw / 2 - .5, y1 - 1, cw + 1, 1.1);
    ctx.fillStyle = K(INK, .7); ctx.fillRect(cx - cw / 2 + .3, y1 - 1.6, cw - .6, .6);
  }
}
function houseOver(ctx, hs) {
  if (!hs.climb) return; // a climber (bougainvillea / ivy) up the facade
  const cx = hs.x + hs.w * hs.climb.x, top = hs.yb - hs.h * hs.climb.h;
  const r = prng(hs.seed + 5); ctx.fillStyle = K(VEG_D);
  for (let i = 0; i < 16; i++) { const yy = mix(hs.yb, top, i / 15), xx = cx + (r() - .5) * 5 * (1 - i / 22); ctx.beginPath(); ctx.arc(xx, yy, 1.5 + r() * 1.5, 0, TAU); ctx.fill(); }
  ctx.fillStyle = K('#b05a72', .9); for (let i = 0; i < 10; i++) { const yy = mix(hs.yb - 3, top, r()), xx = cx + (r() - .5) * 5; ctx.beginPath(); ctx.arc(xx, yy, .6 + r() * .5, 0, TAU); ctx.fill(); }
}
function drawDoor(ctx, d, hs) {
  ctx.fillStyle = K(shadeH(hs.col, .2)); winPath(ctx, d.x - .7, d.y - .8, d.w + 1.4, d.h + .8, d.arch, 0); ctx.fill();
  ctx.fillStyle = vgrad(ctx, d.y, d.y + d.h, [[0, '#4a3438'], [1, '#2c2026']]); winPath(ctx, d.x, d.y, d.w, d.h, d.arch, 0); ctx.fill();
  if (Z > 2) { ctx.strokeStyle = K(INK, .45); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(d.x + d.w / 2, d.y + (d.arch ? d.w / 2 : 0)); ctx.lineTo(d.x + d.w / 2, d.y + d.h); ctx.rect(d.x + d.w * .14, d.y + d.h * .5, d.w * .26, d.h * .38); ctx.rect(d.x + d.w * .6, d.y + d.h * .5, d.w * .26, d.h * .38); ctx.stroke(); }
  ctx.fillStyle = K(shadeH(hs.col, .25)); ctx.fillRect(d.x - 1, d.y + d.h - .2, d.w + 2, .9);
}
// special buildings
const HOUSE_KIND = {
  campanile(ctx, hs) {
    houseBody(ctx, hs);
    const { x, w, yb, h } = hs, top = yb - h;
    // belfry: an arched opening with a bell
    const bx = x + w * .2, bw = w * .6, by = top + 3;
    ctx.fillStyle = K('#1d1a30'); winPath(ctx, bx, by, bw, 9, 1, 0); ctx.fill();
    ctx.fillStyle = K('#7a6a50'); ctx.beginPath(); ctx.moveTo(x + w / 2 - 2.2, by + 8); ctx.quadraticCurveTo(x + w / 2 - 2, by + 3.6, x + w / 2, by + 3.4); ctx.quadraticCurveTo(x + w / 2 + 2, by + 3.6, x + w / 2 + 2.2, by + 8); ctx.fill();
    ctx.fillStyle = K(shadeH(hs.col, .2)); ctx.fillRect(x - .8, top - .6, w + 1.6, 1.4); ctx.fillRect(x - .5, by + 10, w + 1, 1);
    for (const w2 of hs.wins) { if (w2.y < by + 10) continue; winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); }
    // the spire
    ctx.fillStyle = vgrad(ctx, top - 22, top, [[0, shadeH(hs.roofC, .1)], [1, shadeH(hs.roofC, -.15)]]);
    ctx.beginPath(); ctx.moveTo(x - .8, top - .6); ctx.lineTo(x + w / 2, top - 22); ctx.lineTo(x + w + .8, top - .6); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); hatchBox(ctx, [x + w / 2, top - 22, x + w + 1, top], -1.2, .9, INK, .3, { seed: 3 }); ctx.restore();
    ctx.strokeStyle = K(INK, .6); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(x + w / 2, top - 22); ctx.lineTo(x + w / 2, top - 27); ctx.moveTo(x + w / 2 - 1.6, top - 25.4); ctx.lineTo(x + w / 2 + 1.6, top - 25.4); ctx.stroke();
  },
  church(ctx, hs) {
    houseBody(ctx, hs);
    const { x, w, yb, h } = hs, top = yb - h;
    ctx.strokeStyle = K(shadeH(hs.col, .25)); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - .6, top + .4); ctx.lineTo(x + w / 2, top - hs.rh - .8); ctx.lineTo(x + w + .6, top + .4); ctx.stroke();
    ctx.fillStyle = K(shadeH(hs.col, .2)); ctx.fillRect(x - .6, top - .2, w + 1.2, 1.3);
    for (const w2 of hs.wins) { winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); winFront(ctx, w2, hs); }
    for (const d of hs.doors) drawDoor(ctx, d, hs);
    ctx.fillStyle = K(INK, .6); ctx.beginPath(); ctx.moveTo(x + w / 2, top - hs.rh - 1); ctx.lineTo(x + w / 2, top - hs.rh - 5); ctx.lineWidth = lw(.6); ctx.strokeStyle = K(INK, .7); ctx.stroke(); ctx.fillRect(x + w / 2 - 1.3, top - hs.rh - 4, 2.6, .5);
  },
  clocktower(ctx, hs) {
    houseBody(ctx, hs);
    const { x, w, yb, h } = hs, top = yb - h, cx = x + w / 2, cy = top + 18;
    ctx.fillStyle = K('#e8dcc4'); ctx.beginPath(); ctx.arc(cx, cy, 5.2 * Math.min(1, hs.cs + .1), 0, TAU); ctx.fill();
    ctx.strokeStyle = K(INK, .7); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.arc(cx, cy, 5.2 * Math.min(1, hs.cs + .1), 0, TAU); ctx.stroke();
    if (Z > 1.5) { ctx.beginPath(); for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ctx.moveTo(cx + Math.cos(a) * 4.2, cy + Math.sin(a) * 4.2); ctx.lineTo(cx + Math.cos(a) * 4.8, cy + Math.sin(a) * 4.8); } ctx.stroke(); }
    ctx.lineWidth = lw(.9); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 2.4, cy + 1.6); ctx.moveTo(cx, cy); ctx.lineTo(cx - .6, cy - 3.8); ctx.stroke();
    // bell loggia + pyramid roof
    ctx.fillStyle = K('#1d1a30'); for (const u of [.18, .55]) { winPath(ctx, x + w * u, top + 3, w * .27, 8, 1, 0); ctx.fill(); }
    ctx.fillStyle = K(shadeH(hs.col, .2)); ctx.fillRect(x - .8, top - .6, w + 1.6, 1.4); ctx.fillRect(x - .6, top + 11.5, w + 1.2, 1);
    for (const w2 of hs.wins) { winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); }
    ctx.fillStyle = vgrad(ctx, top - 14, top, [[0, shadeH(hs.roofC, .1)], [1, shadeH(hs.roofC, -.15)]]);
    ctx.beginPath(); ctx.moveTo(x - 1, top - .6); ctx.lineTo(cx, top - 14); ctx.lineTo(x + w + 1, top - .6); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); hatchBox(ctx, [cx, top - 14, x + w + 1, top], -1.1, .9, INK, .3, { seed: 9 }); ctx.restore();
    ctx.strokeStyle = K(INK, .6); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(cx, top - 14); ctx.lineTo(cx, top - 18); ctx.stroke();
  },
  tower(ctx, hs) { // the round harbour tower: a cylinder with battlements
    const { x, w, yb, h } = hs, top = yb - h;
    ctx.fillStyle = hgrad(ctx, x, x + w, [[0, shadeH(hs.col, .12)], [.35, hs.col], [1, shadeH(hs.col, -.38)]]); rect(ctx, x, top, w, h); ctx.fill();
    ctx.save(); rect(ctx, x, top - 6, w, h + 6); ctx.clip();
    const [d] = oct(2.4, 2.4); ctx.strokeStyle = K(INK, .22); ctx.lineWidth = lw(.6); ctx.beginPath();
    for (let yy = yb - d; yy > top; yy -= d) { ctx.moveTo(x, yy); ctx.quadraticCurveTo(x + w / 2, yy + 1.2, x + w, yy); }
    ctx.stroke(); hatchBox(ctx, [x + w * .6, top - 6, x + w, yb], 1.1, .9, INK, .28, { seed: 4 }); ctx.restore();
    ctx.fillStyle = K(shadeH(hs.col, .14)); ctx.fillRect(x - 1.4, top - 2, w + 2.8, 2.2);
    for (let i = 0; i < 6; i++) { const mx = x - 1.4 + i * (w + 2.8) / 5.5; ctx.fillRect(mx, top - 5.4, (w + 2.8) / 11, 3.6); }
    ctx.strokeStyle = K(INK, .45); ctx.lineWidth = lw(.7); ctx.strokeRect(x, top, w, h);
    for (const w2 of hs.wins) { winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); }
  },
  boathouse(ctx, hs) {
    houseBody(ctx, hs);
    const { x, w, yb } = hs; ctx.fillStyle = K('#14122a'); winPath(ctx, x + w * .18, yb - 17, w * .64, 17, 1, 0); ctx.fill();
    ctx.strokeStyle = K(shadeH(hs.col, .25)); ctx.lineWidth = 1; winPath(ctx, x + w * .18, yb - 17, w * .64, 17, 1, 0); ctx.stroke();
    for (const w2 of hs.wins) { winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); winFront(ctx, w2, hs); }
    houseRoof(ctx, hs);
  },
  chapel(ctx, hs) {
    houseBody(ctx, hs);
    const { x, w, yb, h } = hs, top = yb - h;
    ctx.strokeStyle = K(shadeH(hs.col, .25)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - .6, top + .4); ctx.lineTo(x + w / 2, top - hs.rh - .6); ctx.lineTo(x + w + .6, top + .4); ctx.stroke();
    // bell-cote on the gable
    const bx = x + w / 2; ctx.fillStyle = K(shadeH(hs.col, .05)); ctx.fillRect(bx - 2.6, top - hs.rh - 7, 5.2, 7); ctx.fillStyle = K('#1d1a30'); winPath(ctx, bx - 1.4, top - hs.rh - 6, 2.8, 4.4, 1, 0); ctx.fill();
    ctx.fillStyle = K('#7a6a50'); ctx.beginPath(); ctx.arc(bx, top - hs.rh - 3.2, .9, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = K(shadeH(hs.col, .2)); ctx.fillRect(bx - 3, top - hs.rh - 7.6, 6, .9);
    for (const w2 of hs.wins) { winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); winFront(ctx, w2, hs); }
    ctx.fillStyle = K('#2c2026'); winPath(ctx, x + w * .24, yb - 9, 4.4 * hs.cs, 9, 1, 0); ctx.fill();
  },
  observatory(ctx, hs) {
    const { x, w, yb, h } = hs, top = yb - h;
    houseBody(ctx, hs);
    for (const w2 of hs.wins) { winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); }
    ctx.fillStyle = hgrad(ctx, x, x + w, [[0, '#c8c0cc'], [.4, '#a49cac'], [1, '#5e5670']]);
    ctx.beginPath(); ctx.ellipse(x + w / 2, top, w / 2 + .8, w * .45, 0, Math.PI, TAU); ctx.closePath(); ctx.fill();
    ctx.fillStyle = K('#1d1a30'); ctx.fillRect(x + w * .44, top - w * .43, w * .12, w * .43);
    ctx.strokeStyle = K(INK, .4); ctx.lineWidth = lw(.6); ctx.beginPath(); for (let i = 1; i < 5; i++) { ctx.ellipse(x + w / 2, top, (w / 2 + .8) * i / 5, w * .45, 0, Math.PI, TAU); } ctx.stroke();
  },
};
// leaf masses (trees, vines): scalloped clusters, light from the left
function leafMass(ctx, cx, cy, rx, ry, col, seed) {
  const r = prng(seed * 7 + 3), n = Math.max(5, Math.round(rx * ry / 3));
  ctx.fillStyle = K(col);
  for (let i = 0; i < n; i++) { const a = r() * TAU, d = Math.sqrt(r()); ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rx * d * .8, cy + Math.sin(a) * ry * d * .8, Math.min(rx, ry) * (.35 + r() * .3), 0, TAU); ctx.fill(); }
  ctx.fillStyle = K(shadeH(col, .25), .7);
  for (let i = 0; i < n * .5; i++) { const a = Math.PI + (r() - .5) * 2.2, d = .5 + r() * .4; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, Math.min(rx, ry) * (.15 + r() * .15), 0, TAU); ctx.fill(); }
}

// ---------------------------------------------------------------- trees
function tree(ctx, t) {
  const { x, y, kind, s } = t, k = t.seed;
  if (kind === 'cypress') {
    const hgt = 30 * s, wd = 5.2 * s;
    ctx.fillStyle = K('#2a2226'); ctx.fillRect(x - .5 * s, y - 2 * s, 1 * s, 2 * s);
    ctx.beginPath(); ctx.moveTo(x, y - hgt); ctx.bezierCurveTo(x + wd * .9, y - hgt * .7, x + wd * .7, y - hgt * .15, x + wd * .25, y - 1.5 * s); ctx.lineTo(x - wd * .25, y - 1.5 * s); ctx.bezierCurveTo(x - wd * .7, y - hgt * .15, x - wd * .9, y - hgt * .7, x, y - hgt); ctx.closePath();
    ctx.fillStyle = hgrad(ctx, x - wd, x + wd, [[0, '#4c5e58'], [.45, '#33433f'], [1, '#1e2828']]); ctx.fill();
    ctx.save(); ctx.clip(); hatchBox(ctx, [x - wd, y - hgt, x + wd, y], 1.0, .8, INK, .3, { seed: k }); ctx.restore();
    ctx.strokeStyle = K('#c8d8c8', .25); ctx.lineWidth = lw(.5); ctx.beginPath(); ctx.moveTo(x - wd * .1, y - hgt * .95); ctx.bezierCurveTo(x - wd * .75, y - hgt * .7, x - wd * .7, y - hgt * .2, x - wd * .3, y - 2 * s); ctx.stroke();
    return;
  }
  if (kind === 'pine') { // umbrella pine: a bare trunk and a flat crown
    const hgt = 26 * s, cw = 17 * s;
    ctx.strokeStyle = K('#3a2c2c'); ctx.lineWidth = 1.3 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 3 * s, y - hgt * .6, x + 1.5 * s, y - hgt); ctx.stroke();
    const r = prng(k), cx = x + 1.5 * s, cy = y - hgt - 2.5 * s;
    for (let i = 0; i < 7; i++) { const u = (i / 6 - .5) * 2, bx = cx + u * cw * .8, by = cy + Math.abs(u) * 2 * s; ctx.fillStyle = K(i % 2 ? '#3a4a44' : '#334038'); ctx.beginPath(); ctx.ellipse(bx, by, cw * .32, 3.2 * s, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = K('#5e7266', .7); for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(cx - cw * .5 + i * cw * .2, cy - 2 * s, cw * .14, 1.2 * s, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = K(INK, .35); ctx.beginPath(); ctx.ellipse(cx + cw * .1, cy + 2.4 * s, cw * .75, 1.4 * s, 0, 0, TAU); ctx.fill();
    return;
  }
  if (kind === 'olive' || kind === 'lemon' || kind === 'round') {
    const cw = (kind === 'olive' ? 9 : 7) * s, ch = (kind === 'olive' ? 6.5 : 6) * s, col = kind === 'olive' ? '#69766c' : kind === 'lemon' ? '#45584a' : '#3e5048';
    ctx.strokeStyle = K('#3a2c2c'); ctx.lineWidth = .9 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 1.5 * s, y - ch * .6, x + .5 * s, y - ch * 1.1); ctx.stroke();
    leafMass(ctx, x, y - ch * 1.45, cw, ch, col, k);
    ctx.save(); ctx.beginPath(); ctx.ellipse(x, y - ch * 1.45, cw * 1.1, ch * 1.1, 0, 0, TAU); ctx.clip(); hatchBox(ctx, [x, y - ch * 2.6, x + cw * 1.2, y - ch * .3], .9, .9, INK, .28, { seed: k }); ctx.restore();
    if (kind === 'lemon' && Z > 1.5) { const r = prng(k + 1); ctx.fillStyle = K('#d8b860'); for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(x + (r() - .5) * cw * 1.4, y - ch * 1.45 + (r() - .5) * ch * 1.2, .55 * s, 0, TAU); ctx.fill(); } }
    return;
  }
  if (kind === 'palm') {
    const hgt = 30 * s; ctx.strokeStyle = K('#4a3a36'); ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 4 * s, y - hgt * .5, x - 2 * s, y - hgt); ctx.stroke();
    ctx.strokeStyle = K('#3e5048'); ctx.lineWidth = 1.1 * s; ctx.beginPath(); const tx = x - 2 * s, ty = y - hgt;
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i / 8 - .5) * 3.2, L = (10 + 3 * Math.sin(i * 2.1)) * s; ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * L * .6, ty + Math.sin(a) * L * .6 - 2 * s, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 3 * s); }
    ctx.stroke(); return;
  }
  if (kind === 'bush') { leafMass(ctx, x, y - 2.2 * s, 4.5 * s, 2.8 * s, t.col || VEG, k); }
}
const treeBB = (t) => { const s = t.s; return [t.x - 20 * s, t.y - 40 * s, t.x + 20 * s, t.y + 1]; };
function addTree(o, t) { add(o, treeBB(t), (ctx) => tree(ctx, t)); }

// ---------------------------------------------------------------- the hill mass, the walls, stairs, the quay, the summit
function drawMass(ctx) {
  polyP(ctx, OUTLINE);
  ctx.fillStyle = vgrad(ctx, 200, 800, [[0, '#6a6078'], [.5, ROCK], [1, '#4c4560']]); ctx.fill();
  ctx.save(); ctx.clip();
  // engraved slope lines following each flank, denser on the shaded right
  for (const side of [-1, 1]) {
    const [d, f] = oct(2.2, 2.6);
    for (let pass = 0; pass < 2; pass++) {
      const al = (pass ? f : 1) * (side > 0 ? .3 : .18); if (al < .01) continue;
      ctx.strokeStyle = K(INK, al); ctx.lineWidth = lw(.7); ctx.beginPath();
      for (let k = 1; k * d / 2 < 70; k++) {
        if ((k & 1) !== pass) continue;
        const off = k * d / 2; let started = false;
        for (let y = 214; y <= 806; y += 6) {
          const x = flankX(y, side) - side * off * (1 + .3 * noise(y * .02 + k));
          if (!inVB(x - 1, y - 6, x + 1, y + 6)) { started = false; continue; }
          const gap = hash(k * 13.1 + Math.floor(y / 30)) < .25;
          if (gap) { started = false; continue; }
          started ? ctx.lineTo(x, y) : ctx.moveTo(x, y); started = true;
        }
      }
      ctx.stroke();
    }
  }
  ctx.restore();
  // rim of the flanks: the dusk glow on the left edge, cold on the right
  ctx.lineWidth = lw(1.1); ctx.strokeStyle = K('#f0c0b0', .35); ctx.beginPath(); for (let y = 216; y <= 800; y += 4) { const x = flankX(y, -1) + .4; y === 216 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  ctx.strokeStyle = K('#a8a8d8', .18); ctx.beginPath(); for (let y = 216; y <= 800; y += 4) { const x = flankX(y, 1) - .4; y === 216 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
}
// rocks on the flanks (outcrops with a lit top-left face)
function rock(ctx, k) {
  const { x, y, s, seed } = k, r = prng(seed), pts = [];
  for (let i = 0; i < 7; i++) { const a = Math.PI + i * Math.PI / 6, rr = s * (.7 + r() * .4); pts.push([x + Math.cos(a) * rr * 1.3, y + Math.sin(a) * rr * .8]); }
  polyP(ctx, pts); ctx.fillStyle = hgrad(ctx, x - s, x + s, [[0, '#8a809a'], [.5, '#6a6080'], [1, '#463e58']]); ctx.fill();
  ctx.save(); ctx.clip(); hatchBox(ctx, [x, y - s, x + s * 1.4, y + 1], 1.1, .9, INK, .35, { seed }); ctx.restore();
  ctx.strokeStyle = K(INK, .4); ctx.lineWidth = lw(.6); ctx.stroke();
}
// a retaining wall: the face below level lv's street (it hangs down into the band of lv-1), stone courses, buttresses, arches, a parapet
function drawWall(ctx, wl) {
  const { lv, x0, x1, bx0, bx1, ybot } = wl, L = LV[lv];
  const top = (x) => terraceY(lv, x);
  ctx.beginPath(); ctx.moveTo(x0, top(x0) - .5); for (let x = x0; x <= x1; x += 8) ctx.lineTo(x, top(x)); ctx.lineTo(x1, top(x1)); ctx.lineTo(bx1, ybot); ctx.lineTo(bx0, ybot); ctx.closePath();
  ctx.fillStyle = vgrad(ctx, L.y0, ybot, [[0, shadeH(STONE, .08)], [.4, STONE], [1, shadeH(STONE, -.35)]]); ctx.fill();
  ctx.save(); ctx.clip();
  // courses (parallel to the terrace curve) and staggered joints
  const ch = 3.4, vx0 = Math.max(bx0, VB[0] - 2), vx1 = Math.min(bx1, VB[2] + 2);
  ctx.strokeStyle = K(INK, .2); ctx.lineWidth = lw(.6); ctx.beginPath();
  for (let k = 0; ; k++) {
    const dy = 4.4 + k * ch; if (L.y0 + dy > ybot) break;
    const yA = L.y0 + dy; if (yA + 8 < VB[1] || yA - 8 > VB[3]) continue;
    ctx.moveTo(vx0, top(vx0) + dy); for (let x = vx0; x <= vx1; x += 16) ctx.lineTo(x, top(x) + dy); ctx.lineTo(vx1, top(vx1) + dy);
    if (Z * 5 > 3) { let x = vx0 - ((vx0 - bx0) % 7.3) + hash(k * 3.7 + lv) * 6; while (x < vx1) { const yy = top(x) + dy; ctx.moveTo(x, yy); ctx.lineTo(x, yy + ch); x += 4.6 + 4.4 * hash(x * .37 + k * 1.3); } }
  }
  ctx.stroke();
  // weathering: vertical streaks and a darker foot
  const r = prng(lv * 91 + 5); ctx.fillStyle = K(INK, .08);
  for (let i = 0; i < (x1 - x0) / 9; i++) { const sx = mix(x0, x1, r()), sy = top(sx) + 5 + r() * 10, sl = 6 + r() * 26; if (inVB(sx - 1, sy, sx + 1, sy + sl)) ctx.fillRect(sx, sy, .6 + r() * 1.4, sl); }
  // buttresses
  for (const bt of wl.butt) {
    const yt = top(bt) + 3.5; if (!inVB(bt - 4, yt, bt + 4, ybot)) continue;
    ctx.fillStyle = hgrad(ctx, bt - 3, bt + 3, [[0, shadeH(STONE, .14)], [.5, shadeH(STONE, .04)], [1, shadeH(STONE, -.3)]]);
    ctx.beginPath(); ctx.moveTo(bt - 2.6, yt + 2); ctx.lineTo(bt + 2.6, yt + 2); ctx.lineTo(bt + 3.6, ybot); ctx.lineTo(bt - 3.6, ybot); ctx.closePath(); ctx.fill();
    ctx.fillStyle = K(INK, .25); ctx.fillRect(bt + 2.6, yt + 2, .8, ybot - yt);
  }
  // arches in the foot of the wall (store rooms under the terrace)
  for (const a of wl.arches) {
    if (!inVB(a.x - 6, a.y - 12, a.x + 6, a.y)) continue;
    ctx.fillStyle = K(shadeH(STONE, .15)); winPath(ctx, a.x - a.w / 2 - 1.1, a.y - a.h - 1.1, a.w + 2.2, a.h + 1.1, 1, 0); ctx.fill();
    ctx.fillStyle = vgrad(ctx, a.y - a.h, a.y, [[0, '#120f22'], [1, '#221c30']]); winPath(ctx, a.x - a.w / 2, a.y - a.h, a.w, a.h, 1, 0); ctx.fill();
  }
  ctx.restore();
  // ivy curtains over the parapet
  for (const iv of wl.ivy) {
    if (!inVB(iv.x - iv.w, top(iv.x), iv.x + iv.w, top(iv.x) + iv.h)) continue;
    const r2 = prng(iv.seed); ctx.fillStyle = K(VEG_D);
    for (let i = 0; i < iv.w * iv.h / 6; i++) { const u = r2(), xx = iv.x + (u - .5) * iv.w, yy = top(xx) + r2() * iv.h * (1 - Math.abs(u - .5) * 1.2); ctx.beginPath(); ctx.arc(xx, yy, .9 + r2() * 1.3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = K(VEG_L, .7); for (let i = 0; i < iv.w * iv.h / 18; i++) { const u = r2(), xx = iv.x + (u - .5) * iv.w * .9, yy = top(xx) + r2() * iv.h * .7; ctx.beginPath(); ctx.arc(xx - .4, yy - .3, .5 + r2() * .6, 0, TAU); ctx.fill(); }
  }
  parapet(ctx, lv, x0, x1, wl.kind);
}
function parapet(ctx, lv, x0, x1, kind) {
  const top = (x) => terraceY(lv, x), a = Math.max(x0, VB[0] - 4), b = Math.min(x1, VB[2] + 4); if (b <= a) return;
  if (kind === 'balustrade') {
    // rail + plinth, balusters between
    ctx.fillStyle = K(STONE_L); ctx.beginPath(); ctx.moveTo(a, top(a) - 4.6); for (let x = a; x <= b; x += 8) ctx.lineTo(x, top(x) - 4.6); ctx.lineTo(b, top(b) - 4.6); ctx.lineTo(b, top(b) - 3.7); for (let x = b; x >= a; x -= 8) ctx.lineTo(x, top(x) - 3.7); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(a, top(a) - .9); for (let x = a; x <= b; x += 8) ctx.lineTo(x, top(x) - .9); ctx.lineTo(b, top(b) - .9); ctx.lineTo(b, top(b) + .3); for (let x = b; x >= a; x -= 8) ctx.lineTo(x, top(x) + .3); ctx.closePath(); ctx.fill();
    const step = Z > 1.8 ? 1.5 : 3;
    ctx.fillStyle = K(shadeH(STONE_L, -.08));
    for (let x = Math.ceil(a / step) * step; x < b; x += step) {
      const y = top(x);
      if (Z > 2.5) { ctx.beginPath(); ctx.moveTo(x - .3, y - 3.7); ctx.quadraticCurveTo(x - .75, y - 2.6, x - .45, y - 1.5); ctx.quadraticCurveTo(x - .2, y - 1.1, x - .4, y - .9); ctx.lineTo(x + .4, y - .9); ctx.quadraticCurveTo(x + .2, y - 1.1, x + .45, y - 1.5); ctx.quadraticCurveTo(x + .75, y - 2.6, x + .3, y - 3.7); ctx.closePath(); ctx.fill(); }
      else ctx.fillRect(x - .45, y - 3.7, .9, 2.8);
    }
    ctx.strokeStyle = K(INK, .35); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(a, top(a) - 3.7); for (let x = a; x <= b; x += 8) ctx.lineTo(x, top(x) - 3.7); ctx.stroke();
    return;
  }
  // solid parapet with a coping
  const hgt = kind === 'low' ? 2.6 : 4.2;
  ctx.beginPath(); ctx.moveTo(a, top(a) - hgt); for (let x = a; x <= b; x += 8) ctx.lineTo(x, top(x) - hgt); ctx.lineTo(b, top(b) - hgt); ctx.lineTo(b, top(b) + .4); for (let x = b; x >= a; x -= 8) ctx.lineTo(x, top(x) + .4); ctx.closePath();
  ctx.fillStyle = vgrad(ctx, LV[lv].y0 - hgt, LV[lv].y0 + 2, [[0, shadeH(STONE, .2)], [1, shadeH(STONE, -.05)]]); ctx.fill();
  ctx.fillStyle = K(STONE_L); ctx.beginPath(); ctx.moveTo(a, top(a) - hgt - .7); for (let x = a; x <= b; x += 8) ctx.lineTo(x, top(x) - hgt - .7); ctx.lineTo(b, top(b) - hgt - .7); ctx.lineTo(b, top(b) - hgt + .5); for (let x = b; x >= a; x -= 8) ctx.lineTo(x, top(x) - hgt + .5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = K(INK, .3); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(a, top(a) - hgt + .6); for (let x = a; x <= b; x += 8) ctx.lineTo(x, top(x) - hgt + .6); ctx.stroke();
  if (Z > 1.2) { ctx.beginPath(); for (let x = Math.ceil(a / 6.2) * 6.2; x < b; x += 6.2) { const y = top(x); ctx.moveTo(x, y - hgt - .7); ctx.lineTo(x, y - hgt + .5); } ctx.stroke(); }
  ctx.strokeStyle = K(INK, .35); ctx.beginPath(); ctx.moveTo(a, top(a) + .5); for (let x = a; x <= b; x += 8) ctx.lineTo(x, top(x) + .5); ctx.stroke();
}
// switchback stairs climbing a wall face (in a gap of the row below)
function drawStair(ctx, s) {
  const { x, w, yb, yt, flights } = s, fh = (yb - yt) / flights;
  for (let i = 0; i < flights; i++) {
    const y0 = yb - i * fh, y1 = y0 - fh, dir = i % 2 ? -1 : 1, xa = dir > 0 ? x + 2 : x + w - 2, xb = dir > 0 ? x + w - 2 : x + 2;
    if (!inVB(Math.min(xa, xb), y1 - 4, Math.max(xa, xb), y0 + 2)) continue;
    // the flight: its outer wall (a sloping band) with a coping, steps showing above it
    ctx.fillStyle = K(shadeH(STONE, .06)); ctx.beginPath(); ctx.moveTo(xa, y0); ctx.lineTo(xb, y1); ctx.lineTo(xb, y1 + 3.2); ctx.lineTo(xa, y0 + 3.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = K(INK, .25); ctx.beginPath(); ctx.moveTo(xa, y0 + 3.2); ctx.lineTo(xb, y1 + 3.2); ctx.lineTo(xb, y1 + 4.2); ctx.lineTo(xa, y0 + 4.2); ctx.closePath(); ctx.fill();
    const n = Math.max(3, Math.round(fh / 1.4)); ctx.fillStyle = K(STONE_L);
    for (let j = 0; j < n; j++) { const u = j / n, sx = mix(xa, xb, u), sy = mix(y0, y1, u); ctx.fillRect(Math.min(sx, sx + (xb - xa) / n), sy - fh / n, Math.abs(xb - xa) / n, .45); }
    ctx.strokeStyle = K('#1d1a2e', .7); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(xa, y0 - 3.8); ctx.lineTo(xb, y1 - 3.8); for (let j = 0; j <= 4; j++) { const u = j / 4; ctx.moveTo(mix(xa, xb, u), mix(y0, y1, u) - 3.8); ctx.lineTo(mix(xa, xb, u), mix(y0, y1, u)); } ctx.stroke();
    // landing
    ctx.fillStyle = K(shadeH(STONE, .12)); ctx.fillRect(Math.min(xb, xb + dir * 2.4) - .5, y1, 3.4, 2.6);
  }
}
// the quay: coping, wet stone, bollards, steps into the water, the mole with its light tower
function drawQuay(ctx) {
  const y = 784, a = Math.max(250, VB[0] - 2), b = Math.min(1660, VB[2] + 2);
  ctx.fillStyle = vgrad(ctx, y, HZ + 2, [[0, '#9a92a4'], [.3, STONE], [1, '#3c3650']]); ctx.fillRect(a, y, b - a, HZ + 2 - y);
  ctx.save(); rect(ctx, a, y, b - a, HZ + 2 - y); ctx.clip();
  ctx.strokeStyle = K(INK, .25); ctx.lineWidth = lw(.6); ctx.beginPath();
  for (const yy of [y + 1.6, y + 4.4]) { ctx.moveTo(a, yy); ctx.lineTo(b, yy); }
  if (Z > .8) for (let x = Math.ceil(a / 6.4) * 6.4; x < b; x += 6.4) { ctx.moveTo(x, y + 1.6); ctx.lineTo(x, y + 4.4); ctx.moveTo(x + 3.2, y + 4.4); ctx.lineTo(x + 3.2, HZ); }
  ctx.stroke();
  ctx.fillStyle = vgrad(ctx, HZ - 3, HZ + 1, [[0, INK, 0], [1, INK, .5]]); ctx.fillRect(a, HZ - 3, b - a, 4);
  ctx.restore();
  ctx.fillStyle = K('#b4acbc'); ctx.fillRect(a, y - .4, b - a, 1.3);
  // bollards and rings
  for (let x = 330; x < 1650; x += 41) { if (!inVB(x - 2, y - 3, x + 2, y)) continue; ctx.fillStyle = K('#2a2434'); ctx.beginPath(); ctx.moveTo(x - 1, y); ctx.lineTo(x - .8, y - 2.4); ctx.quadraticCurveTo(x, y - 3.2, x + .8, y - 2.4); ctx.lineTo(x + 1, y); ctx.fill(); }
  // steps down to the water
  for (const sx of [560, 1340]) {
    if (!inVB(sx - 2, y, sx + 16, HZ)) continue;
    ctx.fillStyle = K(shadeH(STONE, -.1)); ctx.beginPath(); ctx.moveTo(sx, y + 1); ctx.lineTo(sx + 14, HZ); ctx.lineTo(sx + 3, HZ); ctx.lineTo(sx - 3, y + 1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = K(STONE_L, .7); ctx.lineWidth = lw(.5); ctx.beginPath(); for (let i = 0; i < 5; i++) { const u = i / 5; ctx.moveTo(mix(sx - 3, sx + 3, u), mix(y + 1, HZ, u)); ctx.lineTo(mix(sx, sx + 14, u), mix(y + 1, HZ, u)); } ctx.stroke();
  }
  // the mole to the right, a small light tower at its end (unlit)
  if (inVB(1600, 760, 1780, HZ)) {
    ctx.fillStyle = vgrad(ctx, 786, HZ + 1, [[0, '#8e86a0'], [1, '#3a3450']]); ctx.beginPath(); ctx.moveTo(1640, 784); ctx.lineTo(1752, 787); ctx.lineTo(1756, HZ + 1); ctx.lineTo(1640, HZ + 1); ctx.closePath(); ctx.fill();
    const tx = 1744; ctx.fillStyle = hgrad(ctx, tx - 3, tx + 3, [[0, '#d8d0d8'], [1, '#7a7288']]); ctx.beginPath(); ctx.moveTo(tx - 3, 787); ctx.lineTo(tx - 2.2, 764); ctx.lineTo(tx + 2.2, 764); ctx.lineTo(tx + 3, 787); ctx.closePath(); ctx.fill();
    ctx.fillStyle = K('#7a5a58'); ctx.fillRect(tx - 2.2, 772, 4.4, 2.4); ctx.fillRect(tx - 2.6, 763, 5.2, 1.2);
    ctx.fillStyle = K('#3a3858'); ctx.fillRect(tx - 1.6, 758.5, 3.2, 4.5); ctx.fillStyle = K('#5a4a4a'); ctx.beginPath(); ctx.moveTo(tx - 2.2, 758.6); ctx.lineTo(tx, 755.6); ctx.lineTo(tx + 2.2, 758.6); ctx.fill();
  }
}
// the summit: the plateau ledge, a low parapet behind, the cairn (the very top, y 196), a bench, a wind-bent pine
function drawSummit(ctx) {
  // rock ledge under the plateau
  ctx.fillStyle = vgrad(ctx, 214, 232, [[0, '#8a809a'], [1, ROCK_D]]); ctx.beginPath(); ctx.moveTo(864, 215); ctx.quadraticCurveTo(960, 212.6, 1056, 215); ctx.lineTo(1048, 226); ctx.quadraticCurveTo(960, 236, 872, 226); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); hatchBox(ctx, [860, 212, 1060, 236], 1.25, 1, INK, .3, { seed: 77 }); ctx.restore();
  ctx.strokeStyle = K('#f0d8d0', .4); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(864, 215); ctx.quadraticCurveTo(960, 212.6, 1056, 215); ctx.stroke();
  // parapet (a low curved wall at the back of the plateau)
  ctx.fillStyle = vgrad(ctx, 206, 213.6, [[0, shadeH(STONE, .25)], [1, shadeH(STONE, -.1)]]); ctx.beginPath(); ctx.moveTo(904, 213.6); ctx.quadraticCurveTo(960, 207.4, 1016, 213.6); ctx.lineTo(1016, 209.6); ctx.quadraticCurveTo(960, 203.6, 904, 209.6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = K(STONE_L); ctx.beginPath(); ctx.moveTo(903, 209.8); ctx.quadraticCurveTo(960, 203.8, 1017, 209.8); ctx.lineTo(1017, 209); ctx.quadraticCurveTo(960, 203, 903, 209); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = K(INK, .3); ctx.lineWidth = lw(.5); ctx.beginPath(); for (let x = 908; x < 1014; x += 4.4) { const yy = 209.8 - 6 * (1 - Math.pow((x - 960) / 56, 2)) * .5; ctx.moveTo(x, yy); ctx.lineTo(x, yy + 3.6); } ctx.stroke();
  // cairn: a few stones piled to the very top
  const st = [[960, 205.6, 5.6, 2.6], [957.6, 202.4, 4, 2], [961.6, 202.6, 3.4, 1.9], [959.8, 199.6, 3.2, 1.7], [960.3, 197.3, 2, 1.3]];
  for (const [x, y, rx, ry] of st) { ctx.fillStyle = hgrad(ctx, x - rx, x + rx, [[0, '#b0a8b8'], [1, '#5a5270']]); ctx.beginPath(); ctx.ellipse(x, y, rx / 2, ry / 2, 0, 0, TAU); ctx.fill(); }
  // bench
  ctx.fillStyle = K('#4a3a38'); ctx.fillRect(918, 210.6, 12, .9); ctx.fillRect(918.6, 211.4, .8, 2.4); ctx.fillRect(928.6, 211.4, .8, 2.4); ctx.fillRect(918, 207.6, 12, .7);
  // the wind-bent pine on the right
  ctx.strokeStyle = K('#3a2c2c'); ctx.lineWidth = 1.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1034, 214); ctx.bezierCurveTo(1036, 204, 1044, 196, 1052, 190); ctx.stroke();
  ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(1044, 197); ctx.quadraticCurveTo(1036, 190, 1030, 188); ctx.stroke();
  for (const [x, y, rx, ry, c] of [[1030, 187, 7, 2.6, '#334038'], [1052, 188.6, 11, 3, '#3a4a44'], [1064, 191, 7, 2.2, '#334038'], [1044, 185, 6, 2, '#3e5048']]) { ctx.fillStyle = K(c); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -.1, 0, TAU); ctx.fill(); }
  ctx.fillStyle = K('#6a7e70', .6); ctx.beginPath(); ctx.ellipse(1046, 186, 8, 1.1, -.1, 0, TAU); ctx.fill();
}
// the zigzag path from the top terrace to the plateau
const PATH4 = [[1004, 311], [944, 291], [1000, 270], [948, 250], [990, 232], [962, 216]];
function drawPath4(ctx) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = K('#9a90a4'); ctx.lineWidth = 2.6; ctx.beginPath(); PATH4.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  ctx.strokeStyle = K(INK, .35); ctx.lineWidth = lw(.6); ctx.beginPath(); PATH4.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + 1.5) : ctx.moveTo(x, y + 1.5))); ctx.stroke();
  ctx.strokeStyle = K(STONE_L, .8); ctx.lineWidth = .9; ctx.beginPath(); PATH4.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + 2.4) : ctx.moveTo(x, y + 2.4))); ctx.stroke();
}

// ---------------------------------------------------------------- assemble the static list (painter's order: back to front)
// the flanks: olive groves on little dry-stone terraces (left, the gentle side), rock, scrub and pines (right, the steep side)
const lvAt = (y) => (y > 652 ? 0 : y > 526 ? 1 : y > 414 ? 2 : y > 312 ? 3 : 4);
function plantFlanks() {
  const r = prng(606);
  for (const side of [-1, 1]) {
    for (let y = 226; y < 794; y += side < 0 ? 8.5 + r() * 3 : 10 + r() * 5) {
      const lv = lvAt(y), xin = CX + side * (hwAt(lv, y) - 16), xout = flankX(y, side) - side * 2.5;
      if ((xout - xin) * side < 5) continue;
      const row = { side, y, xin, xout, items: [], wall: side < 0 && y > 300 && r() < .8 };
      for (let x = xin + side * (1 + r() * 6); (xout - x) * side > 2; x += side * (6.5 + r() * 7)) {
        const u = r(), top = y < 330;
        const kind = side < 0 ? (top ? (u < .45 ? 'bush' : u < .75 ? 'cypress' : 'rock') : u < .6 ? 'olive' : u < .78 ? 'cypress' : u < .92 ? 'bush' : 'rock')
          : (u < .3 ? 'rock' : u < .56 ? 'bush' : u < .7 ? 'pine' : u < .86 ? 'cypress' : 'olive');
        row.items.push({ x, y: y + (r() - .5) * 2, kind, s: kind === 'rock' ? 2.6 + r() * 4.4 : kind === 'bush' ? .7 + r() * .8 : kind === 'pine' ? .5 + r() * .35 : .5 + r() * .45, seed: Math.floor(r() * 1e6), col: r() < .5 ? VEG : VEG_D });
      }
      add(O(lv, 4) + y * 1e-5, [Math.min(xin, xout) - 14, y - 34, Math.max(xin, xout) + 14, y + 5], (ctx) => grove(ctx, row));
    }
  }
}
function grove(ctx, row) {
  const { y, xin, xout } = row;
  if (row.wall) { // dry-stone terrace wall
    const a = Math.min(xin, xout), b = Math.max(xin, xout);
    ctx.fillStyle = K('#5e566c'); ctx.fillRect(a, y - .6, b - a, 2.2);
    ctx.fillStyle = K('#8e86a0', .8); ctx.fillRect(a, y - .9, b - a, .6);
    if (Z > 1.6) { ctx.strokeStyle = K(INK, .3); ctx.lineWidth = lw(.5); ctx.beginPath(); for (let x = a + hash(y) * 3; x < b; x += 2.2 + hash(x) * 2) { ctx.moveTo(x, y - .3); ctx.lineTo(x, y + 1.6); } ctx.stroke(); }
  }
  for (const it of row.items) {
    if (!inVB(it.x - 16, it.y - 34, it.x + 16, it.y + 4)) continue;
    if (it.kind === 'rock') rock(ctx, { x: it.x, y: it.y, s: it.s, seed: it.seed }); else tree(ctx, it);
  }
}
const O = (lv, k) => (5 - lv) * 100 + k;   // painter's order: level lv: back row 10, mid wall 15, front row 20, things 25-35, the wall below its street 40
function assemble() {
  add(0, [180, 190, 1780, 812], drawMass);
  plantFlanks();
  // the summit, the path, its cypresses
  add(1, [850, 176, 1076, 240], drawSummit);
  add(2, [930, 206, 1012, 316], drawPath4);
  for (const [x, y, s] of [[934, 293, .55], [1010, 272, .6], [938, 252, .5], [1000, 234, .45], [880, 262, .5], [1050, 296, .6], [1068, 262, .5], [856, 300, .55]]) addTree(3, { x, y, kind: 'cypress', s, seed: Math.round(x * 3 + y) });
  addTree(3, { x: 912, y: 268, kind: 'olive', s: .6, seed: 51 }); addTree(3, { x: 1032, y: 246, kind: 'olive', s: .55, seed: 52 });
  // houses (rows: back 10, front 20) — ends first so the houses nearer the centre overlap them
  for (let lv = 4; lv >= 0; lv--) {
    for (const row of [1, 0]) {
      const hs = HOUSES[lv].filter((h) => h.row === row).sort((a, b) => Math.abs(b.x + b.w / 2 - CX) - Math.abs(a.x + a.w / 2 - CX));
      hs.forEach((h, i) => add(O(lv, row ? 10 : 20) + i * .001, [h.x - h.side - 3, h.yb - h.h - h.rh - 12, h.x + h.w + h.side + 3, h.yb + 2], (ctx) => drawHouse(ctx, h), { house: h }));
    }
    // the low wall of the mid-terrace between the back row and the front row (shows in gaps)
    if (lv < 4) {
      const yb = lv === 0 ? 744 : terraceY(lv, CX) - (lv === 1 ? 38 : lv === 2 ? 34 : 30), hw = LV[lv].hw0 - 40;
      add(O(lv, 15), [CX - hw, yb - 2, CX + hw, LV[lv].y0], (ctx) => midWall(ctx, lv, yb, hw));
    }
  }
  // the retaining walls (each hangs below its level's street), stairs, trees in the gaps
  const PK = ['', 'solid', 'balustrade', 'solid', 'low'];
  for (let lv = 1; lv <= 4; lv++) {
    const L = LV[lv], Lb = LV[lv - 1], r = prng(lv * 77);
    const wl = { lv, x0: CX - L.hw0 - 3, x1: CX + L.hw0 + 3, bx0: CX - Lb.hw0 + 18, bx1: CX + Lb.hw0 - 18, ybot: Lb.y0 + 2, kind: PK[lv], butt: [], arches: [], ivy: [] };
    for (let x = wl.x0 + 30 + r() * 30; x < wl.x1 - 20; x += 70 + r() * 60) wl.butt.push(x);
    for (let x = wl.bx0 + 20; x < wl.bx1 - 20; x += 22 + r() * 30) if (r() < .55) wl.arches.push({ x, y: Lb.y0 - 1, w: 7 + r() * 4, h: 9 + r() * 5 });
    for (let i = 0; i < 6 + lv; i++) wl.ivy.push({ x: mix(wl.x0 + 20, wl.x1 - 20, r()), w: 8 + r() * 16, h: 8 + r() * 18, seed: lv * 100 + i });
    add(O(lv, 40), [wl.bx0 - 6, L.y0 - 6, wl.bx1 + 6, wl.ybot], (ctx) => drawWall(ctx, wl));
  }
  // stairs: in the gaps of each level's rows, climbing the wall of the level above
  const stairs = [
    { lv: 0, ...SPECIAL.stair0, yb: 784, yt: 652 + 4 }, { lv: 1, ...SPECIAL.stair1, yb: terraceY(1, 1250), yt: 526 + 4 },
    { lv: 2, ...SPECIAL.stair2, yb: terraceY(2, 1222), yt: 414 + 4 }, { lv: 3, ...SPECIAL.stair3, yb: terraceY(3, 920), yt: 312 + 4 },
  ];
  for (const s of stairs) { s.flights = Math.max(3, Math.round((s.yb - s.yt) / 18)); add(O(s.lv, 16), [s.x, s.yt - 6, s.x + s.w, s.yb + 2], (ctx) => drawStair(ctx, s)); }
  // trees in gardens and gaps
  const T0 = [[748, 772, 'lemon', 1], [790, 778, 'round', .8], [1640, 784, 'palm', 1], [300, 784, 'palm', .9], [1015, 646, 'olive', .9], [1030, 650, 'lemon', .8], [1460, 650, 'cypress', .8], [472, 648, 'cypress', .9],
    [760, 412, 'cypress', 1], [772, 412, 'cypress', .85], [1000, 414, 'lemon', .8], [1130, 414, 'cypress', 1], [1144, 413, 'cypress', .8], [1222, 410, 'pine', .8], [700, 412, 'pine', .75],
    [1336, 524, 'cypress', .9], [586, 524, 'cypress', .9], [1090, 525, 'round', .6]];
  for (const [x, y, kind, s] of T0) { const lv = y > 700 ? 0 : y > 600 ? 1 : y > 470 ? 2 : 3; addTree(O(lv, 25), { x, y, kind, s, seed: Math.round(x + y * 3) }); }
  // the garden (grandmother's) and the pergola garden on the belonging terrace, the square with the frame
  add(O(0, 24), [SPECIAL.garden.x - 2, 740, SPECIAL.garden.x + SPECIAL.garden.w + 2, 786], drawGarden, { garden: true });
  add(O(1, 24), [SPECIAL.pergola.x - 2, 620, SPECIAL.pergola.x + SPECIAL.pergola.w + 2, 653], drawPergola);
  add(O(2, 24), [SPECIAL.square.x - 2, 480, SPECIAL.square.x + SPECIAL.square.w + 2, 528], drawSquare);
  add(O(0, 40), [240, 782, 1780, 794], drawQuay);
  STATIC.sort((a, b) => a.o - b.o);
}
function midWall(ctx, lv, yb, hw) {
  const a = Math.max(CX - hw, VB[0]), b = Math.min(CX + hw, VB[2]); if (b <= a) return;
  const y1 = (x) => terraceY(lv, x) + .5;
  ctx.beginPath(); ctx.moveTo(a, yb); ctx.lineTo(b, yb); ctx.lineTo(b, y1(b)); ctx.lineTo(a, y1(a)); ctx.closePath();
  ctx.fillStyle = vgrad(ctx, yb, LV[lv].y0, [[0, shadeH(STONE, .1)], [1, shadeH(STONE, -.3)]]); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = K(INK, .2); ctx.lineWidth = lw(.6); ctx.beginPath();
  for (let y = yb + 3.4; y < LV[lv].y0; y += 3.4) { ctx.moveTo(a, y); ctx.lineTo(b, y); if (Z > 1) for (let x = a + hash(y) * 6; x < b; x += 5 + 3 * hash(x + y)) { ctx.moveTo(x, y); ctx.lineTo(x, y + 3.4); } }
  ctx.stroke(); ctx.restore();
  ctx.fillStyle = K(STONE_L); ctx.fillRect(a, yb - 1.2, b - a, 1.4);
}
function drawGarden(ctx) {
  const g = SPECIAL.garden; if (PASS === 'glass' || PASS === 'tv' || PASS === 'front') return;
  if (PASS === 'vector' && ST.garden && ST.garden.draw) return;   // the builder draws the garden (in drawLive)
  // pergola with a vine, a bench, a chair, beds; the low garden wall along the quay with a gate
  const x = g.x, y = g.ground;
  ctx.strokeStyle = K('#4a3a36'); ctx.lineWidth = .9; ctx.beginPath(); for (const px of [x + 26, x + 50]) { ctx.moveTo(px, y); ctx.lineTo(px, y - 15); } ctx.moveTo(x + 22, y - 15); ctx.lineTo(x + 54, y - 15); ctx.stroke();
  leafMass(ctx, x + 38, y - 16, 15, 3, VEG, 901);
  ctx.fillStyle = K('#5a4440'); ctx.fillRect(x + 30, y - 4.2, 11, .9); ctx.fillRect(x + 30.5, y - 3.3, .7, 3.3); ctx.fillRect(x + 39.8, y - 3.3, .7, 3.3); ctx.fillRect(x + 30, y - 7, 11, .7);
  ctx.fillRect(x + 44, y - 4, 4, .8); ctx.fillRect(x + 44.2, y - 3.2, .6, 3.2); ctx.fillRect(x + 47.2, y - 3.2, .6, 3.2); ctx.fillRect(x + 47.4, y - 8, .7, 4.8);
  for (const [bx, c] of [[x + 6, '#b06070'], [x + 14, '#d0a060'], [x + 52, '#9070a0']]) { leafMass(ctx, bx, y - 2.6, 4, 2, VEG, Math.round(bx)); ctx.fillStyle = K(c); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(bx - 3 + i * 1.5, y - 3.6 + (i % 2) * .8, .55, 0, TAU); ctx.fill(); } }
  ctx.fillStyle = K(shadeH(STONE, .15)); ctx.fillRect(x, y - 3.4, 20, 3.4); ctx.fillRect(x + 27, y - 3.4, 29, 3.4);
  ctx.fillStyle = K(STONE_L); ctx.fillRect(x - .4, y - 4, 20.8, .9); ctx.fillRect(x + 26.6, y - 4, 29.8, .9);
  ctx.strokeStyle = K('#1d1a2e', .8); ctx.lineWidth = lw(.5); ctx.beginPath(); for (let gx = x + 20.6; gx < x + 26.6; gx += .9) { ctx.moveTo(gx, y); ctx.lineTo(gx, y - 4.4); } ctx.stroke();
}
function drawPergola(ctx) {
  if (PASS === 'glass' || PASS === 'tv' || PASS === 'front') return;
  const p = SPECIAL.pergola, x = p.x, y = terraceY(1, x + p.w / 2);
  ctx.strokeStyle = K('#4a3a36'); ctx.lineWidth = .9; ctx.beginPath(); for (let i = 0; i <= 4; i++) { const px = x + 3 + (p.w - 6) * i / 4; ctx.moveTo(px, y); ctx.lineTo(px, y - 17); } ctx.moveTo(x, y - 17); ctx.lineTo(x + p.w, y - 17); ctx.stroke();
  leafMass(ctx, x + p.w / 2, y - 18, p.w * .55, 3.4, VEG, 902);
  ctx.fillStyle = K('#e8dcc8'); ctx.fillRect(x + 6, y - 7.4, p.w - 12, 1);    // the long table's cloth
  ctx.fillStyle = K('#4a3a36'); ctx.fillRect(x + 7, y - 6.4, .7, 2.4); ctx.fillRect(x + p.w - 7.7, y - 6.4, .7, 2.4);
}
function drawSquare(ctx) {
  if (PASS === 'glass' || PASS === 'tv' || PASS === 'front') return;
  const s = SPECIAL.square, y = terraceY(2, s.x + s.w / 2), F = SPECIAL.frame;
  // fountain: a column with a basin on the square's left
  const fx = s.x + 16; ctx.fillStyle = K(STONE_L); ctx.fillRect(fx - 1.1, y - 13, 2.2, 10); ctx.beginPath(); ctx.ellipse(fx, y - 13, 4.4, 1.2, 0, 0, TAU); ctx.fill(); ctx.fillRect(fx - 6.5, y - 4.6, 13, 4.6);
  ctx.fillStyle = K(INK, .3); ctx.fillRect(fx + .4, y - 13, .7, 10); ctx.fillRect(fx - 6.5, y - 1.4, 13, 1.4);
  // a lamp post
  const lx = s.x + s.w - 10; ctx.fillStyle = K('#1d1a2e'); ctx.fillRect(lx - .35, y - 15, .7, 15); ctx.fillRect(lx - 1.4, y - 17.2, 2.8, 2.4);
  // the tall frame: an engraved stand (posts, pediment, base), its aperture is SPECIAL.frame
  const x0 = F.x - 1.4, x1 = F.x + F.w + 1.4;
  ctx.fillStyle = K('#2a2438'); ctx.fillRect(x0 - .6, F.y - 1.6, x1 - x0 + 1.2, F.h + 3.2);
  ctx.fillStyle = K('#b8a888'); ctx.fillRect(x0, F.y - 1, x1 - x0, 1); ctx.fillRect(x0, F.y + F.h, x1 - x0, 1); ctx.fillRect(x0, F.y - 1, 1, F.h + 2); ctx.fillRect(x1 - 1, F.y - 1, 1, F.h + 2);
  ctx.fillStyle = K('#8a7a66'); ctx.beginPath(); ctx.moveTo(x0 - 1.2, F.y - 1.6); ctx.lineTo((x0 + x1) / 2, F.y - 5); ctx.lineTo(x1 + 1.2, F.y - 1.6); ctx.closePath(); ctx.fill();
  ctx.fillRect(x0 + 2, F.y + F.h + 1, 1.2, y - F.y - F.h - 1); ctx.fillRect(x1 - 3.2, F.y + F.h + 1, 1.2, y - F.y - F.h - 1); ctx.fillRect(x0 - .8, y - 1.6, x1 - x0 + 1.6, 1.6);
  // the aperture at rest: a dark engraved poster
  ctx.fillStyle = K('#1e1a30'); ctx.fillRect(F.x, F.y, F.w, F.h);
}
// frame aperture anchor (12.09: a portrait clip plays in it)
SPECIAL.frame = { x: SPECIAL.square.x + 46 - 6.2, y: terraceY(2, SPECIAL.square.x + 46) - 27, w: 12.4, h: 22 };
assemble();

// ---------------------------------------------------------------- public anchors
HILL.quay = { y: 784, x0: 290, x1: 1650 };
HILL.garden = { ...SPECIAL.garden };
HILL.square = { x: SPECIAL.square.x, y: terraceY(2, SPECIAL.square.x + SPECIAL.square.w / 2), w: SPECIAL.square.w, frame: { ...SPECIAL.frame }, rule: { x0: SPECIAL.frame.x, x1: SPECIAL.frame.x + SPECIAL.frame.w, y: SPECIAL.frame.y + SPECIAL.frame.h } };
HILL.view = { x: 960, y: HILL.standY, parapet: { x0: 904, x1: 1016, y: 207 }, cairn: { x: 960, y: 196 }, bench: { x: 924, y: 214 }, path: PATH4.map((p) => [...p]) };

export function hillWindows(lv) { return WINDOWS[lv]; }
export function hillWindow(lv, id) {
  if (typeof id === 'number') { const a = WINDOWS[lv]; return a[((id % a.length) + a.length) % a.length]; }
  if (NAMEDW[id]) return NAMEDW[id];
  return WINDOWS[lv][0];
}
export function hillHouses(lv) { return HOUSES[lv]; }
export function hillRooms(lv) { return ROOMS[lv]; }

// ---------------------------------------------------------------- the views used as plates (handoff4)
export const VIEWS = {
  H1: { cam: { x: 960, y: 520, z: 1 }, st: { night: .3, lit: [1, 0, 0, 0, 0], labels: 1, title: 1, focus: 0, focusU: .35, people: 1 } },
  H2: { cam: { x: 960, y: 540, z: 1.04 }, st: { night: .75, lit: [1, 0, 0, 0, 0], labels: 1, title: 0, focus: 1, focusU: 0, people: .6 } },
  H4: { cam: { x: 960, y: 292, z: 2.1 }, st: { night: 1, lit: [1, 1, 1, 1, 0], labels: 1, title: 0, focus: 4, focusU: 1, people: .3, summitFigs: 0 } },
};

// ---------------------------------------------------------------- live window state
function winState(w) {
  const st = ST, lit = st.lit || [];
  let on = 0; const L = lit[w.lv] ?? 0;
  if (L > 0) on = sm(clamp((L * 1.07 - w.th) / .05));
  if (st.sweep) { const lvs = Array.isArray(st.sweep.level) ? st.sweep.level : [st.sweep.level]; if (lvs.includes(w.lv)) { const hw = LV[w.lv].hw0, xs = (w.x - (CX - hw)) / (2 * hw); on = Math.max(on, sm(clamp((st.sweep.u * 1.15 - xs) / .07))); } }
  let tv = 0;
  if (w.lv === 0 && (st.screens ?? 0) > 0 && !w.shop) tv = sm(clamp((st.screens * 1.1 - w.sth) / .05));
  const b = .9 + .1 * Math.sin(T * (.3 + .4 * w.k) + w.ph);
  let f = 1;
  if (tv > 0) { const sy = clamp(st.sync ?? 0), rate = mix(.9 + 1.6 * w.k, 1.3, sy), ph = mix(w.ph * 5, 0, sy); f = .62 + .38 * (.5 + .5 * noise(T * rate + ph)) + .04 * noise(T * 6.1 + ph * 3); }
  return { on, tv, b, f };
}
// vector pass: the window's live glass over the unlit glass
function liveGlass(ctx, w) {
  if (ST.inside && ST.inside.level === w.lv && ST.inside.id === w.id) return;
  const s = winState(w);
  if (s.on > .002 && !w.named) glassLit(ctx, w, 'amber', s.on * s.b * (1 - s.tv));
  if (s.tv > .002) glassLit(ctx, w, 'tv', s.tv * s.f);
  if (w.named && s.on > .002) { // the open window glows from the room
    ctx.save(); ctx.globalAlpha = s.on * .9; winPath(ctx, w.x, w.y, w.w, w.h, 0, 0); ctx.clip();
    const g = ctx.createLinearGradient(0, w.y, 0, w.y + w.h); g.addColorStop(0, '#ffcf86'); g.addColorStop(1, '#e8913c'); ctx.fillStyle = g; ctx.fillRect(w.x, w.y, w.w, w.h); ctx.restore();
  }
}

// ---------------------------------------------------------------- drawing a frame
let LOG = false;
export function drawHill(ctx, t, cam, st = {}) {
  T = t; ST = st;
  const n = clamp(st.night ?? .5), z = cam.z;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  sky(ctx, t, cam, n, st);
  water(ctx, t, cam, n, st);
  // world transform
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cam.x, -cam.y);
  const [vx0, vy0] = toWorld(cam, -40, -40), [vx1, vy1] = toWorld(cam, W + 40, H + 40);
  VB = [vx0, vy0, vx1, vy1]; Z = z; PASS = 'vector'; setN(n);
  for (const it of STATIC) { if (it.b[2] < vx0 || it.b[0] > vx1 || it.b[3] < vy0 || it.b[1] > vy1) continue; it.f(ctx); }
  live(ctx, t, cam, n, st);
  ctx.restore();
  labels(ctx, t, cam, st);
  VB = [-1e9, -1e9, 1e9, 1e9];
}
// lights, glows, people, boats, the inside of a window
function live(ctx, t, cam, n, st) {
  // halos round lit windows
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const ga = .16 + .2 * n;
  for (let lv = 0; lv < 5; lv++) for (const w of WINDOWS[lv]) {
    if (!inVB(w.x - 10, w.y - 10, w.x + w.w + 10, w.y + w.h + 10)) continue;
    const s = winState(w), a = (s.on * (1 - s.tv) + s.tv * s.f * .8) * ga; if (a < .01) continue;
    const cx = w.x + w.w / 2, cy = w.y + w.h / 2, rr = Math.max(w.w, w.h) * 1.5 + 3;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr); const c = s.tv > .5 ? '143,230,255' : '255,179,92';
    g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
  }
  ctx.restore();
  // the inside of a window (push-ins)
  if (st.inside) { const w = hillWindows(st.inside.level)[st.inside.id] || null; if (w) insideWindow(ctx, t, w, st.inside); }
}
function insideWindow(ctx, t, w, ins) {
  const m = ctx.getTransform(), sx = m.a * w.x + m.e, sy = m.d * w.y + m.f, sw = m.a * w.w, sh = m.d * w.h;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip(); ins.draw(ctx, sx, sy, sw, sh, t); ctx.restore();
}

// ---------------------------------------------------------------- sky, far land, water
const STARS = (() => { const r = prng(7), s = []; for (let i = 0; i < 700; i++) { const m = r(); s.push([r() * 2600 - 340, r() * 820 - 120, m < .86 ? .5 + r() * .7 : 1 + r() * 1.3, r() * TAU, .3 + r() * 1.2]); } return s; })();
function skyCols(n) {
  return [mixH('#2a2660', '#04050f', n), mixH('#5a4a88', '#0b0f2a', n), mixH('#b0789a', '#1a1a46', n), mixH('#f0b0a0', '#26244e', n)];
}
function parCam(cam, k) { return { x: 960 + (cam.x - 960) / k, y: 520 + (cam.y - 520) / k, z: k / (k - 1 + 1 / cam.z) }; }
function sky(ctx, t, cam, n, st) {
  const c4 = parCam(cam, 6), [, hy] = toScreen(c4, 0, HZ), [s0, s1, s2, s3] = skyCols(n);
  const g = ctx.createLinearGradient(0, hy - 900, 0, hy); g.addColorStop(0, s0); g.addColorStop(.55, s1); g.addColorStop(.85, s2); g.addColorStop(1, s3);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // a soft glow low on the left (where the sun went down)
  const [gx] = toScreen(c4, 520, 0), rg = ctx.createRadialGradient(gx, hy, 0, gx, hy, 900); rg.addColorStop(0, rgba(mixH('#ffc8a0', '#3a3470', n), .5 * (1 - n * .7))); rg.addColorStop(1, 'rgba(255,200,160,0)');
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  // stars
  const cs = parCam(cam, 40), sa = sm(clamp((n - .15) / .6));
  if (sa > .01) for (const [x, y, s, ph, f] of STARS) {
    const [X, Y] = toScreen(cs, x, y); if (X < -4 || X > W + 4 || Y < -4 || Y > hy - 20) continue;
    const a = sa * (.45 + .55 * (.5 + .5 * Math.sin(t * f + ph))) * clamp((hy - 20 - Y) / 200); if (a < .02) continue;
    ctx.fillStyle = `rgba(243,239,226,${a.toFixed(3)})`; if (s < 1) ctx.fillRect(X, Y, s * 1.4, s * 1.4); else { ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill(); }
  }
  // long engraved cloud bands
  const cc = parCam(cam, 10);
  for (const [cx, cy, L, k] of [[300, 330, 900, 0], [1300, 270, 1100, 1], [820, 420, 700, 2], [1620, 470, 600, 3], [140, 520, 520, 4]]) {
    const x0 = cx - L / 2 + t * (2 + k), [X0, Y] = toScreen(cc, x0, cy), [X1] = toScreen(cc, x0 + L, cy); if (X1 < 0 || X0 > W) continue;
    const lit = mixH('#f0b8b0', '#2a2a58', n), dark = mixH('#3a3070', '#0c1030', n);
    for (let i = 0; i < 7; i++) { const yy = Y + i * 2.6 * cc.z, inset = (Math.abs(i - 3) / 3) * (X1 - X0) * .18 + hash(i + k * 7) * 40; ctx.strokeStyle = rgba(i > 3 ? lit : dark, (.18 + .1 * (i > 3)) * (1 - n * .4)); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X0 + inset, yy); ctx.lineTo(X1 - inset * .7, yy); ctx.stroke(); }
  }
  // far mountains and hills (parallax), fog at their feet
  const layers = [[8, '#8a7aa8', '#1c1c46', 1], [4, '#6a5c8a', '#14143a', 2]];
  for (const [k, cd, cn, li] of layers) {
    const cl = parCam(cam, k), col = mixH(cd, cn, n);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cl.z, cl.z); ctx.translate(-cl.x, -cl.y);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-900, HZ + 300);
    for (let x = -900; x <= 2900; x += 12) { const near = Math.abs(x - 960) < 760 ? 0 : 1; const hgt = li === 1 ? 70 + 90 * Math.max(0, fbm(x * .0026 + 4)) + 40 * Math.abs(noise(x * .011)) : 26 + 34 * Math.max(0, fbm(x * .004 + 9)) + 10 * noise(x * .03); ctx.lineTo(x, HZ - hgt * (li === 1 ? 1 : .9 + .1 * near)); }
    ctx.lineTo(2900, HZ + 300); ctx.closePath(); ctx.fill();
    // fog band at the foot
    const fg = ctx.createLinearGradient(0, HZ - 60, 0, HZ + 4); fg.addColorStop(0, rgba(mixH('#d8b0c0', '#2a2c5c', n), 0)); fg.addColorStop(1, rgba(mixH('#d8b0c0', '#2a2c5c', n), li === 1 ? .55 : .4)); ctx.fillStyle = fg; ctx.fillRect(-900, HZ - 60, 3800, 64);
    ctx.restore();
  }
}
function water(ctx, t, cam, n, st) {
  const [, hy] = toScreen(cam, 0, HZ); if (hy >= H) return;
  const g = ctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, mixH('#6a5888', '#151440', n)); g.addColorStop(.25, mixH('#3a3068', '#0c0c2c', n)); g.addColorStop(1, mixH('#1e1a44', '#05060f', n));
  ctx.fillStyle = g; ctx.fillRect(0, hy, W, H - hy);
}

// ---------------------------------------------------------------- labels and title (screen space)
function labels(ctx, t, cam, st) {
  const la = st.labels ?? 0, z = cam.z;
  if (la > 0) {
    const zf = 1 - sm(lin(2.2, 3.2, z)), foc = Array.isArray(st.focus) ? st.focus : [st.focus ?? -1];
    for (let lv = 0; lv < 5; lv++) {
      const L = LV[lv], isF = foc.includes(lv), u = clamp(la * 1.25 - lv * .06) * (isF ? 1 : zf); if (u <= .01) continue;
      const size = isF ? mix(34, 58, sm(clamp(st.focusU ?? 0))) : 34;
      ctx.font = `400 ${size}px "Instrument Serif"`; const tw = ctx.measureText(L.label).width;
      // anchor on the terrace (world) and label position (screen)
      let ax, ay, lx, ly;
      if (lv === 0) { [ax, ay] = toScreen(cam, 1586, 776); [, ly] = toScreen(cam, 0, 838); lx = HILL.labelX; }
      else { const ym = mix(L.y0, L.y1, .45); [ax, ay] = toScreen(cam, CX + hwAt(lv, ym) - 22, ym); ly = ay + size * .3; lx = HILL.labelX; }
      lx = Math.min(lx, 1840 - tw); ly = clamp(ly, 70 + size * .7, 905);
      const on = Math.max((st.lit || [])[lv] ?? 0, st.sweep && (Array.isArray(st.sweep.level) ? st.sweep.level : [st.sweep.level]).includes(lv) ? st.sweep.u : 0) > .5;
      const amber = isF && (st.focusU ?? 0) > 0;
      // leader: from the anchor to the label's left edge
      const ex = lx - 14, ey = ly - size * .3;
      const lu = clamp(u / .35), tu = clamp((u - .25) / .75);
      ctx.save();
      ctx.strokeStyle = rgba(amber ? '#ffb35c' : on ? '#e8dcc0' : '#a49fc4', .7); ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(mix(ax, ex, lu), mix(ay, ey, lu)); ctx.stroke();
      ctx.fillStyle = rgba(amber ? '#ffb35c' : on ? '#f3efe2' : '#a49fc4', .9); ctx.beginPath(); ctx.arc(ax, ay, 2.4, 0, TAU); ctx.fill();
      if (tu > 0) {
        ctx.beginPath(); ctx.rect(lx - 6, ly - size, (tw + 12) * tu, size * 1.4); ctx.clip();
        ctx.shadowColor = 'rgba(6,6,20,.85)'; ctx.shadowBlur = 14;
        ctx.fillStyle = on ? '#f3efe2' : '#a49fc4'; ctx.textBaseline = 'alphabetic'; ctx.fillText(L.label, lx, ly);
      }
      ctx.restore();
    }
  }
  if ((st.title ?? 0) > 0) {
    const u = clamp(st.title), x1 = 1840, y = 112;
    ctx.save(); ctx.font = '600 17px Inter'; try { ctx.letterSpacing = '5px'; } catch { }
    const s = HILL.title.toUpperCase(), tw = ctx.measureText(s).width, x0 = x1 - tw;
    ctx.strokeStyle = rgba('#a49fc4', .6); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x1, y - 30); ctx.lineTo(x1 - (tw + 4) * clamp(u / .4), y - 30); ctx.moveTo(x1, y + 16); ctx.lineTo(x1 - (tw + 4) * clamp(u / .4), y + 16); ctx.stroke();
    ctx.beginPath(); ctx.rect(x0 - 6, y - 26, (tw + 12) * clamp((u - .2) / .8), 40); ctx.clip();
    ctx.fillStyle = '#c8c2e0'; ctx.fillText(s, x0, y); ctx.restore();
  }
}
