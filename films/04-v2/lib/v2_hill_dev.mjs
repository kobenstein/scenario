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
const NIGHTM = [.3, .32, .56];
let NV = -1, KC = new Map(), KCS = new Map(), TH = 0, TD = 0;
function setN(n) { if (n !== NV) { NV = n; KCS = new Map(); KC = new Map(); KCS.set(TH * 100 + TD, KC); } }
// the tint of the thing being drawn, from its place on the hill: TD −1 (left, toward the evening light) … 1 (right, in shade);
// TH 0 (the quay) … 1 (the summit: farther away, in the evening haze). Quantised, one colour cache per tint.
function setTint(x, y) {
  const th = Math.round(clamp((735 - y) / 520) * 8) / 8, hw = Math.max(40, (flankX(y, 1) - flankX(y, -1)) / 2), td = Math.round(clamp((x - CX) / hw, -1, 1) * 4) / 4;
  if (th === TH && td === TD) return;
  TH = th; TD = td; const key = th * 100 + td; KC = KCS.get(key); if (!KC) { KC = new Map(); KCS.set(key, KC); }
}
const HZC = [104, 104, 146];
// the blue hour: every pigment is seen in cool, fading light (desaturated, cooled, a little darker); darks stay dark
const SAT = .56, TINT = [.87, .9, 1.03], DARK = .92, GR = new Map();
function grade(hex) {
  let v = GR.get(hex); if (v) return v;
  const [r, g, b] = hexRGB(hex), l = .3 * r + .55 * g + .15 * b;
  v = [(l + (r - l) * SAT) * TINT[0] * DARK, (l + (g - l) * SAT) * TINT[1] * DARK, (l + (b - l) * SAT) * TINT[2] * DARK]; GR.set(hex, v); return v;
}
function K(hex, a = 1) {
  const key = a === 1 ? hex : hex + (Math.round(a * 1000) / 1000); let s = KC.get(key); if (s !== undefined) return s;
  let [r, g, b] = grade(hex);
  if (TD < 0) { const k = -TD * .075; r += (255 - r) * k; g += (226 - g) * k; b += (206 - b) * k; }
  else if (TD > 0) { const k = TD * .22; r *= 1 - k; g *= 1 - k; b *= 1 - k * .75; }
  if (TH > 0) { const k = TH * .16; r = mix(r, HZC[0], k); g = mix(g, HZC[1], k); b = mix(b, HZC[2], k); }
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
  L: monotone([201, 203, 206, 210, 213.6, 216, 220, 226, 234, 246, 263, 290, 312, 363, 414, 470, 526, 600, 652, 700, 740, 792, 812],
    [0, 18, 34, 48, 62, 80, 98, 118, 140, 166, 198, 246, 284, 378, 452, 520, 580, 640, 678, 714, 742, 770, 786]),
  R: monotone([201, 203, 206, 210, 213.6, 216, 220, 226, 234, 246, 263, 290, 312, 363, 414, 470, 526, 600, 652, 700, 740, 792, 812],
    [0, 17, 32, 46, 60, 77, 94, 112, 132, 156, 184, 226, 262, 314, 378, 440, 498, 558, 600, 656, 698, 730, 746]),
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
const PLASTER = ['#8d715b', '#8d665e', '#9b866c', '#74768b', '#947c81', '#838371', '#97908a', '#816c5e', '#8d776a', '#776a7c', '#97836f', '#86686c'];
const ROOFC = ['#8e5f58', '#9a6a5c', '#7e5652', '#a07262', '#86605e', '#94685a'];
const SHUT = ['#5e7a74', '#6a7e94', '#7a6a5a', '#5a6c84', '#7e8a6a', '#6e5e70'];
const STONE = '#5c5470', STONE_L = '#aaa2b4', ROCK = '#5a5070', ROCK_D = '#3c354e', VEG = '#3c4a4a', VEG_D = '#28322f', VEG_L = '#5d6e66', EARTH = '#463e52';
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
  w.closed = !w.shop && !w.bal && !w.arch && !o.arch && hash(w.ph * 7.7 + 1.3) < .13;
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
  const named = (hs, pick) => { const ws = hs.wins.filter((w) => !w.shop); const w = pick(ws); w.named = hs.namedWin || 'street'; w.bal = false; w.box = false; w.sh = 1; w.arch = 0; w.closed = false; return w; };
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
// per-house colours (computed once) and gradients that only change with the night value (kept per context)
function HC(hs) {
  if (hs.c) return hs.c;
  const col = shadeH(hs.col, hs.tone);
  return (hs.c = { col, hi: shadeH(col, .08), lo: shadeH(col, -.2), side: shadeH(col, -.32), sur: shadeH(hs.col, .1), sill: shadeH(hs.col, .3),
    band: shadeH(col, .16), quoin: shadeH(col, .18), door: shadeH(hs.col, .2), step: shadeH(hs.col, .25), bal: shadeH(hs.col, .25), chim: shadeH(hs.col, -.08), chimC: shadeH(hs.col, .2) });
}
function GC(o, key, ctx, make) { const e = o[key]; if (e && e.n === NV && e.c === ctx) return e.g; const g = make(); o[key] = { g, n: NV, c: ctx }; return g; }
// unlit glass: a dark pane, the evening sky in its upper third
function glassUnlit(ctx, w) {
  winPath(ctx, w.x, w.y, w.w, w.h, w.arch, w.round);
  if (w.named) { ctx.fillStyle = K('#14122a'); ctx.fill(); return; }   // the open window: a dark room behind it
  if (w.arch || w.round) { ctx.fillStyle = GC(w, 'gU', ctx, () => vgrad(ctx, w.y, w.y + w.h, [[0, '#4a4670'], [.45, GLASS0], [1, GLASS1]])); ctx.fill(); return; }
  ctx.fillStyle = K(GLASS1); ctx.fill(); ctx.fillStyle = K('#3e3c64', .9); ctx.fillRect(w.x, w.y, w.w, w.h * .3);
  if (Z > 1.6) { ctx.fillStyle = K('#8a86b0', .14); ctx.beginPath(); ctx.moveTo(w.x + w.w * .12, w.y + w.h); ctx.lineTo(w.x + w.w * .5, w.y); ctx.lineTo(w.x + w.w * .72, w.y); ctx.lineTo(w.x + w.w * .34, w.y + w.h); ctx.fill(); }
}
// lit glass (amber room light or the cold light of a screen); raw colours (lights are not tinted by night); gradients are world-anchored
function glassLit(ctx, w, kind, a = 1) {
  if (a <= .003) return;
  const clip = w.arch || w.round, ga = ctx.globalAlpha;
  if (clip) { ctx.save(); winPath(ctx, w.x, w.y, w.w, w.h, w.arch, w.round); ctx.clip(); }
  ctx.globalAlpha = ga * a;
  if (kind === 'tv') {
    ctx.fillStyle = GC(w, 'gT', ctx, () => { const g = ctx.createLinearGradient(0, w.y, 0, w.y + w.h), k = w.tvk; g.addColorStop(0, k < .5 ? '#2c5f88' : '#244e78'); g.addColorStop(.55, '#5fb4dc'); g.addColorStop(1, k < .5 ? '#a8ecff' : '#8fe6ff'); return g; });
    ctx.fillRect(w.x, w.y, w.w, w.h);
    if (Z > 2) { ctx.fillStyle = GC(w, 'gT2', ctx, () => { const cx = w.x + w.w * (.3 + .4 * w.k), cy = w.y + w.h * .8, rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, w.w * .9); rg.addColorStop(0, 'rgba(216,247,255,.75)'); rg.addColorStop(1, 'rgba(216,247,255,0)'); return rg; }); ctx.fillRect(w.x, w.y, w.w, w.h); }
  } else {
    ctx.fillStyle = GC(w, 'gA', ctx, () => { const wm = w.warm, g = ctx.createLinearGradient(0, w.y, 0, w.y + w.h); g.addColorStop(0, wm < .3 ? '#ffe2a8' : wm < .75 ? '#ffcf86' : '#ffbe6a'); g.addColorStop(1, wm < .3 ? '#ffc070' : wm < .75 ? '#ffaa50' : '#f0913c'); return g; });
    ctx.fillRect(w.x, w.y, w.w, w.h);
    // a lamp inside: a brighter core
    ctx.fillStyle = GC(w, 'gL', ctx, () => { const cx = w.x + w.w * (.3 + .4 * w.k), cy = w.y + w.h * (.3 + .25 * w.cur), rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w.w, w.h) * .7); rg.addColorStop(0, 'rgba(255,248,230,.85)'); rg.addColorStop(1, 'rgba(255,241,214,0)'); return rg; });
    ctx.fillRect(w.x, w.y, w.w, w.h);
    if (!w.shop && !w.round && w.cur < .45) { // curtains: soft fabric at the sides
      ctx.fillStyle = 'rgba(255,236,200,.55)'; const cw = w.w * (.18 + .12 * w.k);
      ctx.fillRect(w.x, w.y, cw, w.h); if (w.cur < .25) ctx.fillRect(w.x + w.w - cw, w.y, cw, w.h);
      if (Z > 3) { ctx.strokeStyle = 'rgba(190,120,60,.35)'; ctx.lineWidth = lw(.6); ctx.beginPath(); for (let i = 1; i < 3; i++) { ctx.moveTo(w.x + cw * i / 3, w.y); ctx.lineTo(w.x + cw * i / 3, w.y + w.h); } ctx.stroke(); }
    }
    if (w.shop && Z > 2) { ctx.fillStyle = 'rgba(122,59,23,.45)'; for (let i = 1; i < 3; i++) ctx.fillRect(w.x, w.y + w.h * i / 3, w.w, w.h * .05); }
  }
  ctx.globalAlpha = ga;
  if (clip) ctx.restore();
}
// window back parts: surround, sill, open shutters (never over the glass); louvres are collected and stroked once per house
const LOUV = [];
function strokeLouvres(ctx) {
  if (!LOUV.length) return;
  ctx.strokeStyle = K(INK, .3); ctx.lineWidth = lw(.6); ctx.beginPath();
  for (const [sx, sw, y, wh] of LOUV) for (let yy = y + .6; yy < y + wh - .2; yy += .7) { ctx.moveTo(sx + .25, yy); ctx.lineTo(sx + sw - .25, yy); }
  ctx.stroke(); LOUV.length = 0;
}
function winBack(ctx, w, hs) {
  const c = HC(hs), x = w.x, y = w.y, ww = w.w, wh = w.h, s = hs.cs, fr = .75 * s;
  ctx.fillStyle = K(c.sur);
  if (w.round) { ctx.beginPath(); ctx.ellipse(x + ww / 2, y + wh / 2, ww / 2 + 1.1, wh / 2 + 1.1, 0, 0, TAU); ctx.fill(); }
  else { winPath(ctx, x - fr, y - .9, ww + fr * 2, wh + 1.3, w.arch, 0); ctx.fill(); }
  if (!w.round) {
    ctx.fillStyle = K(c.sill); ctx.fillRect(x - fr - .5 * s, y + wh, ww + fr * 2 + s, .9);
    ctx.fillStyle = K(INK, .28); ctx.fillRect(x - fr - .3 * s, y + wh + .9, ww + fr * 2 + .6 * s, .7);
  }
  if (w.sh && !w.round && !w.shop && !w.closed) {   // open shutters, flat against the wall either side
    const sw = ww * .5 + .1;
    ctx.fillStyle = K(hs.shut); ctx.fillRect(x - fr - sw - .15, y - .2, sw, wh + .2); ctx.fillRect(x + ww + fr + .15, y - .2, sw, wh + .2);
    ctx.fillStyle = K(INK, .22); ctx.fillRect(x - fr - sw - .15, y - .2, .35 * s, wh + .2); ctx.fillRect(x + ww + fr + .15 + sw - .35 * s, y - .2, .35 * s, wh + .2);
    if (Z * .7 > 2.2) LOUV.push([x - fr - sw - .15, sw, y, wh], [x + ww + fr + .15, sw, y, wh]);
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
// window front parts: closed shutters, mullions, balcony, flower box (these cover the glass)
function winFront(ctx, w, hs) {
  const x = w.x, y = w.y, ww = w.w, wh = w.h, s = hs.cs, mc = w.mull;
  if (w.closed && !w.named) {
    // closed shutters: slats over the opening; between them the room shows (light leaks through when it is lit)
    ctx.fillStyle = K(hs.shut); ctx.beginPath();
    for (let yy = y + .2; yy < y + wh - .15; yy += .95) ctx.rect(x, yy, ww, Math.min(.64, y + wh - yy));
    ctx.rect(x, y, ww, .5); ctx.rect(x, y + wh - .5, ww, .5); ctx.rect(x, y, .45 * s, wh); ctx.rect(x + ww - .45 * s, y, .45 * s, wh); ctx.rect(x + ww / 2 - .22 * s, y, .44 * s, wh);
    ctx.fill();
    ctx.fillStyle = K(INK, .35); ctx.fillRect(x + ww / 2 + .22 * s, y, .2 * s, wh); ctx.fillRect(x, y, ww, Math.max(.3, wh * .05));
    return;
  }
  if (!w.named && mc !== 'none') {
    ctx.fillStyle = K('#c8c0bc', PASS === 'front' ? 1 : .9);
    const bw = Math.max(.32, lw(.9)) * Math.min(1, s + .2);
    if (mc === 'cross') { ctx.fillRect(x + ww / 2 - bw / 2, y, bw, wh); ctx.fillRect(x, y + wh * .34, ww, bw); }
    else if (mc === 'shop') { ctx.fillRect(x + ww / 3 - bw / 2, y, bw, wh); ctx.fillRect(x + ww * 2 / 3 - bw / 2, y, bw, wh); ctx.fillRect(x, y + wh * .28, ww, bw); }
    else if (mc === 'grid') { for (let i = 1; i < 6; i++) ctx.fillRect(x + ww * i / 6 - bw / 2, y, bw, wh); for (let j = 1; j < 4; j++) ctx.fillRect(x, y + wh * j / 4 - bw / 2, ww, bw); }
    else if (mc === 'rose') { ctx.strokeStyle = K('#c8c0bc'); ctx.lineWidth = bw; ctx.beginPath(); const cx = x + ww / 2, cy = y + wh / 2; for (let i = 0; i < 8; i++) { const a = i * TAU / 8; ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * ww / 2, cy + Math.sin(a) * wh / 2); } ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy, ww * .18, wh * .18, 0, 0, TAU); ctx.stroke(); }
    // the lintel's shadow on the glass top
    if (!w.round) { ctx.fillStyle = K(INK, .35); ctx.fillRect(x, y, ww, Math.max(.3, wh * .06)); }
  }
  if (w.bal) { // balcony: slab + iron railing
    const bx = x - 2.2 * s, bw = ww + 4.4 * s, by = y + wh;
    ctx.fillStyle = K(HC(hs).bal); ctx.fillRect(bx, by, bw, 1.1);
    ctx.fillStyle = K(INK, .3); ctx.fillRect(bx + .2, by + 1.1, bw - .4, .8);
    ctx.strokeStyle = K('#1d1a2e', .85); ctx.lineWidth = lw(.7); ctx.beginPath();
    ctx.moveTo(bx, by - 4.2); ctx.lineTo(bx + bw, by - 4.2);
    const step = Z > 2.2 ? .9 : Z > 1.1 ? 1.8 : 3.6;
    for (let xx = bx; xx <= bx + bw + .01; xx += step * s) { ctx.moveTo(xx, by - 4.2); ctx.lineTo(xx, by); }
    ctx.stroke();
    if (hash(w.ph * 3.3) < .55) { ctx.fillStyle = K(VEG); ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.moveTo(bx + bw * (.2 + .3 * i) + 1.1, by - .6); ctx.arc(bx + bw * (.2 + .3 * i), by - .6, 1.1, 0, TAU); } ctx.fill(); }
  }
  if (w.box) { // flower box with geraniums
    const by = y + wh - .8; ctx.fillStyle = K('#6a4a44'); ctx.fillRect(x - .4, by, ww + .8, 1.4);
    ctx.fillStyle = K(VEG); ctx.beginPath(); for (let i = 0; i < 4; i++) { const cx = x + ww * (i + .5) / 4; ctx.moveTo(cx + .9, by - .2); ctx.arc(cx, by - .2, .9, 0, TAU); } ctx.fill();
    ctx.fillStyle = K('#c0666a'); ctx.beginPath(); for (let i = 0; i < 3; i++) { const cx = x + ww * (i + 1) / 4; ctx.moveTo(cx + .55, by - .7); ctx.arc(cx, by - .7, .55, 0, TAU); } ctx.fill();
  }
}
// a whole house
function drawHouse(ctx, hs) {
  if (PASS === 'glass' || PASS === 'tv') { for (const w of hs.wins) if (!w.named) glassLit(ctx, w, PASS === 'tv' ? 'tv' : 'amber'); return; }
  if (PASS === 'front') { for (const w of hs.wins) winFront(ctx, w, hs); houseOver(ctx, hs); return; }
  const special = HOUSE_KIND[hs.kind];
  if (special) { special(ctx, hs); strokeLouvres(ctx); return; }
  houseBody(ctx, hs);
  for (const w of hs.wins) winBack(ctx, w, hs);
  strokeLouvres(ctx);
  for (const w of hs.wins) glassUnlit(ctx, w);
  if (PASS === 'vector') for (const w of hs.wins) liveGlass(ctx, w);
  for (const w of hs.wins) winFront(ctx, w, hs);
  for (const d of hs.doors) drawDoor(ctx, d, hs);
  houseRoof(ctx, hs);
  houseOver(ctx, hs);
}
function houseBody(ctx, hs) {
  const { x, w, yb, h } = hs, top = yb - h, C = HC(hs), col = C.col, b = hs.sideDir;
  // the side wall facing the centre (visible where the terraces curve round the hill)
  if (hs.side > .6) {
    const sx = b > 0 ? x + w : x, sw = hs.side * b, dy = hs.side * .05;
    ctx.fillStyle = K(C.side);
    ctx.beginPath(); ctx.moveTo(sx, yb); ctx.lineTo(sx, top); if (hs.roof === 'eave' || hs.roof === 'hip') { ctx.lineTo(sx + sw * .5, top - hs.rh * .9); } ctx.lineTo(sx + sw, top + dy); ctx.lineTo(sx + sw, yb + dy); ctx.closePath(); ctx.fill();
    if (Z > .9) { ctx.save(); ctx.clip(); hatchBox(ctx, [Math.min(sx, sx + sw), top - hs.rh, Math.max(sx, sx + sw), yb + 1], b > 0 ? -.9 : .9, 1.1, INK, .22, { seed: hs.id }); ctx.restore(); }
  }
  // facade: sky light from above, darker toward the ground
  ctx.fillStyle = GC(hs, 'gF', ctx, () => vgrad(ctx, top, yb, [[0, C.hi], [.55, col], [1, C.lo]]));
  if (hs.roof === 'gable') { ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x, top); ctx.lineTo(x + w / 2, top - hs.rh); ctx.lineTo(x + w, top); ctx.lineTo(x + w, yb); ctx.closePath(); }
  else rect(ctx, x, top, w, h);
  ctx.fill();
  ctx.save(); ctx.clip();
  // the west glow on the left, shade on the right
  ctx.fillStyle = GC(hs, 'gW', ctx, () => hgrad(ctx, x, x + w, [[0, '#ffd2b8', .13], [.4, '#ffd2b8', 0], [.7, INK, .07], [1, INK, .3]])); ctx.fillRect(x, top - hs.rh, w, h + hs.rh);
  if (hs.stone) { // ashlar courses
    const [d] = oct(2.4, 2.4); ctx.strokeStyle = K(INK, .2); ctx.lineWidth = lw(.6); ctx.beginPath();
    for (let yy = yb - d; yy > top - hs.rh; yy -= d) { if (yy < VB[1] || yy > VB[3]) continue; ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); const row = Math.round(yy / d); for (let xx = x + (row & 1 ? 1.8 : 4.2) * hs.cs; xx < x + w; xx += 5.2 * hs.cs) { ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + d); } }
    ctx.stroke();
  } else hatchBox(ctx, [x, top - hs.rh, x + w, yb], 0, 1.15, INK, .1 + .06 * hash(hs.id), { seed: hs.id * 3, broken: .5 });
  // storey bands and quoins
  if (hs.band) { ctx.fillStyle = K(C.band); for (let j = 1; j < hs.storeys; j++) { const yy = yb - j * LVP[hs.lv].sH + .2; ctx.fillRect(x, yy, w, .7); } }
  if (hs.quoin && !hs.stone) { ctx.fillStyle = K(C.quoin); for (let yy = yb - 2.6, i = 0; yy > top; yy -= 2.6, i++) { const qw = (i & 1 ? 2.4 : 3.6) * hs.cs; ctx.fillRect(x, yy, qw, 2.2); ctx.fillRect(x + w - qw, yy, qw, 2.2); } }
  // under the eaves: a soft shadow band
  ctx.fillStyle = GC(hs, 'gE', ctx, () => vgrad(ctx, top, top + 4, [[0, INK, .45], [1, INK, 0]])); ctx.fillRect(x, top, w, 4);
  // ground: occlusion and damp, a few weather stains
  ctx.fillStyle = GC(hs, 'gG', ctx, () => vgrad(ctx, yb - 9, yb, [[0, INK, 0], [1, INK, .34]])); ctx.fillRect(x, yb - 9, w, 9);
  if (!hs.stone) { const r = hash(hs.id * 1.37); ctx.fillStyle = K(INK, .07); ctx.fillRect(x + w * (.1 + .5 * r), top + h * .25, w * (.08 + .1 * hash(hs.id)), h * (.3 + .4 * r)); ctx.fillRect(x + w * (.62 + .2 * r), yb - h * .3, w * .14, h * .3); }
  ctx.restore();
  // engraved edges
  ctx.strokeStyle = K(INK, .62); ctx.lineWidth = lw(.75); ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x, top); ctx.moveTo(x + w, top); ctx.lineTo(x + w, yb); ctx.stroke();
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
    ctx.fillStyle = K(HC(hs).chim); ctx.fillRect(cx - cw / 2, y1, cw, y0 - y1);
    ctx.fillStyle = K(INK, .3); ctx.fillRect(cx + cw * .1, y1, cw * .4, y0 - y1);
    ctx.fillStyle = K(HC(hs).chimC); ctx.fillRect(cx - cw / 2 - .5, y1 - 1, cw + 1, 1.1);
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
    for (const w2 of hs.wins) { if (w2.y < by + 10) continue; winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); winFront(ctx, w2, hs); }
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
    for (const w2 of hs.wins) { winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); winFront(ctx, w2, hs); }
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
    for (const w2 of hs.wins) { winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); winFront(ctx, w2, hs); }
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
    for (const w2 of hs.wins) { winBack(ctx, w2, hs); glassUnlit(ctx, w2); if (PASS === 'vector') liveGlass(ctx, w2); winFront(ctx, w2, hs); }
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
  ctx.fillStyle = K(shadeH(col, .2), .5);
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
    const cw = (kind === 'olive' ? 9 : 7) * s, ch = (kind === 'olive' ? 6.5 : 6) * s, col = kind === 'olive' ? '#55625a' : kind === 'lemon' ? '#45584a' : '#3e5048';
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
  ctx.fillStyle = vgrad(ctx, 200, 800, [[0, '#4e4c5c'], [.5, '#463f56'], [1, '#3a3450']]); ctx.fill();
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
        const ya = Math.max(214, Math.floor((VB[1] - 214) / 6) * 6 + 214 - 6), yb2 = Math.min(806, VB[3] + 6);
        for (let y = ya; y <= yb2; y += 6) {
          const x = FLY(y, side) - side * off * (1 + .3 * noise(y * .02 + k));
          if (!inVB(x - 1, y - 6, x + 1, y + 6)) { started = false; continue; }
          const gap = hash(k * 13.1 + Math.floor(y / 30)) < .25;
          if (gap) { started = false; continue; }
          started ? ctx.lineTo(x, y) : ctx.moveTo(x, y); started = true;
        }
      }
      ctx.stroke();
    }
  }
  // the dome: the evening light from the left, shade on the right; haze toward the top
  ctx.fillStyle = hgrad(ctx, 180, 1780, [[0, '#ffd8c0', .1], [.3, '#ffd8c0', .02], [.55, INK, .05], [1, INK, .38]]); ctx.fillRect(180, 190, 1600, 622);
  ctx.fillStyle = vgrad(ctx, 200, 740, [[0, '#686892', .16], [1, '#686892', 0]]); ctx.fillRect(180, 190, 1600, 550);
  ctx.restore();
  // rim of the flanks: the dusk glow on the left edge, cold on the right
  ctx.lineWidth = lw(1.1); ctx.strokeStyle = K('#f0c0b0', .35); ctx.beginPath(); for (let y = 216; y <= 800; y += 4) { const x = flankX(y, -1) + .4; y === 216 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  ctx.strokeStyle = K('#a8a8d8', .18); ctx.beginPath(); for (let y = 216; y <= 800; y += 4) { const x = flankX(y, 1) - .4; y === 216 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
}
const FLYC = new Map();
const FLY = (y, side) => { const k = y * 2 + (side > 0 ? 1 : 0); let v = FLYC.get(k); if (v === undefined) { v = flankX(y, side); FLYC.set(k, v); } return v; };
// rocks on the flanks (outcrops with a lit top-left face)
function rock(ctx, k) {
  const { x, y, s, seed } = k, r = prng(seed), pts = [];
  for (let i = 0; i < 7; i++) { const a = Math.PI + i * Math.PI / 6, rr = s * (.7 + r() * .4); pts.push([x + Math.cos(a) * rr * 1.3, y + Math.sin(a) * rr * .8]); }
  polyP(ctx, pts); ctx.fillStyle = hgrad(ctx, x - s, x + s, [[0, '#766e8a'], [.5, '#5a5272'], [1, '#3a3450']]); ctx.fill();
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
  ctx.fillStyle = vgrad(ctx, L.y0, L.y0 + 9, [[0, INK, .5], [1, INK, 0]]); ctx.beginPath(); ctx.moveTo(vx0, top(vx0)); for (let x = vx0; x <= vx1; x += 8) ctx.lineTo(x, top(x)); ctx.lineTo(vx1, top(vx1)); ctx.lineTo(vx1, top(vx1) + 9); for (let x = vx1; x >= vx0; x -= 8) ctx.lineTo(x, top(x) + 9); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = K(INK, .3); ctx.lineWidth = lw(.6); ctx.beginPath();
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
  // the dome's light across the wall (left lighter, right in shade)
  ctx.save(); ctx.beginPath(); ctx.moveTo(x0, top(x0) - 6); for (let x = x0; x <= x1; x += 8) ctx.lineTo(x, top(x) - 6); ctx.lineTo(x1, top(x1)); ctx.lineTo(bx1, ybot); ctx.lineTo(bx0, ybot); ctx.closePath(); ctx.clip();
  ctx.fillStyle = hgrad(ctx, bx0, bx1, [[0, '#ffd8c0', .08], [.35, '#ffd8c0', 0], [.6, INK, .04], [1, INK, .3]]); ctx.fillRect(bx0, L.y0 - 8, bx1 - bx0, ybot - L.y0 + 8);
  ctx.restore();
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
// the summit: the rock ledge under the plateau's edge (y 214 = where you stand), a dry-stone parapet behind, the cairn (the very top,
// y 196), a bench, a wind-bent umbrella pine on the right edge. Seen from below: the plateau's floor is hidden by its edge.
function drawSummit(ctx) {
  if (PASS === 'glass' || PASS === 'tv' || PASS === 'front') return;
  const edge = (x) => 214 + .0016 * (x - 960) * (x - 960) * .25;
  // the ledge: a broken rock face with strata, lit along its top edge by the sky
  ctx.beginPath(); ctx.moveTo(890, 216.4);
  for (let x = 890; x <= 1030; x += 4) ctx.lineTo(x, edge(x) + .5 * noise(x * .3));
  ctx.lineTo(1030, 217); ctx.lineTo(1024, 226);
  for (let x = 1024; x >= 896; x -= 6) ctx.lineTo(x, 231 + 4 * Math.sin((x - 896) / 128 * Math.PI) + 2.2 * noise(x * .17 + 3));
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, 213, 238, [[0, '#7a7290'], [.25, ROCK], [1, ROCK_D]]); ctx.fill();
  ctx.save(); ctx.clip();
  hatchBox(ctx, [886, 212, 1034, 240], .06, 1.15, INK, .34, { seed: 77, broken: .45 });
  hatchBox(ctx, [960, 212, 1034, 240], 1.05, .9, INK, .26, { seed: 78 });
  ctx.fillStyle = K(INK, .3); for (const [cx, w] of [[912, 2.2], [941, 1.6], [978, 2.4], [1006, 1.8]]) { ctx.beginPath(); ctx.moveTo(cx, edge(cx) + 2); ctx.lineTo(cx + w, edge(cx) + 9); ctx.lineTo(cx - w * .4, edge(cx) + 15); ctx.lineTo(cx - w, edge(cx) + 8); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = K('#dcd2ea', .5); ctx.lineWidth = lw(.8); ctx.beginPath(); for (let x = 892; x <= 1028; x += 4) { const y = edge(x) + .5 * noise(x * .3); x === 892 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  // tufts of grass along the edge
  ctx.strokeStyle = K('#4a5a58', .9); ctx.lineWidth = lw(.6); ctx.beginPath();
  for (let i = 0; i < 46; i++) { const x = 896 + i * 2.8 + 1.4 * hash(i * 3.1), y = edge(x) + .3; for (let k = -1; k <= 1; k++) { ctx.moveTo(x, y); ctx.lineTo(x + k * .8 + .3 * hash(i + k), y - 1.4 - 1.2 * hash(i * 7 + k)); } }
  ctx.stroke();
  // the parapet: a low dry-stone wall curving round the back of the plateau
  const py = (x) => 210.8 - 2.2 * (1 - Math.pow((x - 960) / 47, 2));
  ctx.beginPath(); ctx.moveTo(913, py(913) + 4.6); for (let x = 913; x <= 1007; x += 2) ctx.lineTo(x, py(x)); for (let x = 1007; x >= 913; x -= 2) ctx.lineTo(x, py(x) + 4.6 + (x - 913) * 0); ctx.closePath();
  ctx.fillStyle = vgrad(ctx, 204, 214, [[0, shadeH(STONE, .16)], [1, shadeH(STONE, -.2)]]); ctx.fill();
  ctx.save(); ctx.clip();
  if (Z > 2.4) { ctx.strokeStyle = K(INK, .4); ctx.lineWidth = lw(.55); ctx.beginPath(); for (let row = 0; row < 3; row++) { const dy = 1 + row * 1.3; let x = 913 + (row % 2) * 1.2; ctx.moveTo(913, py(913) + dy); for (let xx = 913; xx <= 1007; xx += 3) ctx.lineTo(xx, py(xx) + dy); while (x < 1007) { const w = 1.8 + 1.6 * hash(x * 1.3 + row); ctx.moveTo(x, py(x) + dy - 1.3); ctx.lineTo(x, py(x) + dy); x += w; } } ctx.stroke(); }
  else hatchBox(ctx, [912, 204, 1008, 214], 0, 1.3, INK, .3, { seed: 5 });
  ctx.restore();
  ctx.fillStyle = K(STONE_L); ctx.beginPath(); ctx.moveTo(912, py(912) + .2); for (let x = 912; x <= 1008; x += 2) ctx.lineTo(x, py(x) - .5); for (let x = 1008; x >= 912; x -= 2) ctx.lineTo(x, py(x) + .5); ctx.closePath(); ctx.fill();
  // the cairn: stones piled to the very top (y 196)
  const st = [[960, 210.6, 7.4, 3.6], [956.6, 207.4, 5.4, 3], [962.8, 207.6, 5, 2.8], [959.4, 204.4, 5.2, 2.6], [961.2, 201.6, 4.2, 2.4], [959.6, 199.2, 3.4, 2], [960.4, 197.2, 2.2, 1.4]];
  for (const [x, y, rx, ry] of st) {
    ctx.fillStyle = hgrad(ctx, x - rx / 2, x + rx / 2, [[0, '#a8a0b8'], [.55, '#7a7290'], [1, '#4a4460']]); ctx.beginPath(); ctx.ellipse(x, y, rx / 2, ry / 2, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = K(INK, .45); ctx.lineWidth = lw(.5); ctx.stroke();
    ctx.fillStyle = K('#e0d8ec', .35); ctx.beginPath(); ctx.ellipse(x - rx * .1, y - ry * .28, rx * .3, ry * .14, 0, 0, TAU); ctx.fill();
  }
  // the bench (in front of the parapet, facing the view)
  ctx.fillStyle = K('#4a3a38'); ctx.fillRect(921.5, 209.8, 12, 1); ctx.fillRect(922.2, 210.8, .8, 3.4); ctx.fillRect(932, 210.8, .8, 3.4); ctx.fillRect(921.5, 206.2, 12, .8); ctx.fillRect(922.4, 206.2, .6, 3.8); ctx.fillRect(932.1, 206.2, .6, 3.8);
  ctx.fillStyle = K('#8a7a70', .6); ctx.fillRect(921.5, 209.8, 12, .3);
  // the wind-bent umbrella pine on the right edge: a leaning trunk, a flat crown in three layers
  const tx = 1016, ty = edge(1016);
  ctx.strokeStyle = K('#2e2428'); ctx.lineCap = 'round'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(tx, ty + 1); ctx.bezierCurveTo(tx + 1, ty - 8, tx + 7, ty - 17, tx + 17, ty - 24); ctx.stroke();
  ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(tx + 9, ty - 17); ctx.quadraticCurveTo(tx, ty - 22, tx - 8, ty - 24.5); ctx.moveTo(tx + 14, ty - 22); ctx.quadraticCurveTo(tx + 24, ty - 25, tx + 33, ty - 25); ctx.stroke();
  ctx.strokeStyle = K('#b0a0a8', .35); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(tx - .6, ty); ctx.bezierCurveTo(tx + .4, ty - 8, tx + 6.4, ty - 17, tx + 16.4, ty - 24.4); ctx.stroke();
  const crown = [[tx - 9, ty - 26, 13, 3.4], [tx + 6, ty - 28.6, 17, 4.2], [tx + 24, ty - 27, 13, 3.6], [tx + 36, ty - 25.6, 8, 2.6], [tx + 14, ty - 31.4, 11, 3]];
  for (const [cx, cy, rx, ry] of crown) {
    ctx.fillStyle = vgrad(ctx, cy - ry, cy + ry, [[0, '#4e6058'], [.5, '#33423c'], [1, '#1e2826']]);
    ctx.beginPath(); for (let i = 0; i <= 18; i++) { const a = Math.PI + i / 18 * Math.PI, rr = 1 + .12 * Math.sin(i * 2.7 + cx); ctx.lineTo(cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * 1.25 * rr); } ctx.quadraticCurveTo(cx, cy + ry * .9, cx - rx, cy); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); hatchBox(ctx, [cx - rx, cy - ry * 1.4, cx + rx, cy + ry], .2, .8, INK, .3, { seed: Math.round(cx) }); ctx.restore();
    ctx.strokeStyle = K('#a8b8b0', .3); ctx.lineWidth = lw(.6); ctx.beginPath(); for (let i = 3; i <= 15; i++) { const a = Math.PI + i / 18 * Math.PI, rr = 1 + .12 * Math.sin(i * 2.7 + cx), X = cx + Math.cos(a) * rx * rr, Y = cy + Math.sin(a) * ry * 1.25 * rr; i === 3 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); } ctx.stroke();
  }
}
// the zigzag path from the top terrace to the plateau
const PATH4 = [[1004, 311], [944, 291], [1000, 270], [948, 250], [990, 232], [962, 216]];
function drawPath4(ctx) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = K('#6e6680'); ctx.lineWidth = 2; ctx.beginPath(); PATH4.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  ctx.strokeStyle = K(INK, .35); ctx.lineWidth = lw(.6); ctx.beginPath(); PATH4.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + 1.5) : ctx.moveTo(x, y + 1.5))); ctx.stroke();
  ctx.strokeStyle = K(STONE_L, .45); ctx.lineWidth = .6; ctx.beginPath(); PATH4.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + 1.9) : ctx.moveTo(x, y + 1.9))); ctx.stroke();
}

// ---------------------------------------------------------------- assemble the static list (painter's order: back to front)
// the flanks: olive groves on little dry-stone terraces (left, the gentle side), rock, scrub and pines (right, the steep side)
const SPAN = [640, 508, 374, 262, 92];
function townHW(y) {
  const lv = lvAt(y), L = LV[lv], up = lv < 4 ? SPAN[lv + 1] + 8 : 40;
  return mix(up, SPAN[lv], clamp((y - L.y1) / (L.y0 - L.y1)));
}
const lvAt = (y) => (y > 652 ? 0 : y > 526 ? 1 : y > 414 ? 2 : y > 312 ? 3 : 4);
function plantFlanks() {
  const r = prng(606);
  for (const side of [-1, 1]) {
    for (let y = 352; y < 794; y += side < 0 ? 8.5 + r() * 3 : 10 + r() * 5) {
      const lv = lvAt(y), xin = CX + side * (townHW(y) - 12), xout = flankX(y, side) - side * 2.5;
      if ((xout - xin) * side < 5) continue;
      const row = { side, y, xin, xout, items: [], wall: side < 0 && y > 300 && r() < .8 };
      for (let x = xin + side * (1 + r() * 6); (xout - x) * side > 2; x += side * (6.5 + r() * 7)) {
        const u = r(), top = y < 330;
        const kind = side < 0 ? (top ? (u < .45 ? 'bush' : u < .75 ? 'cypress' : 'rock') : u < .6 ? 'olive' : u < .78 ? 'cypress' : u < .92 ? 'bush' : 'rock')
          : (u < .3 ? 'rock' : u < .56 ? 'bush' : u < .7 ? ((xout - x) * side > 30 ? 'pine' : 'cypress') : u < .86 ? 'cypress' : 'olive');
        row.items.push({ x, y: y + (r() - .5) * 2, kind, s: kind === 'rock' ? 2.6 + r() * 4.4 : kind === 'bush' ? .7 + r() * .8 : kind === 'pine' ? .5 + r() * .35 : .5 + r() * .45, seed: Math.floor(r() * 1e6), col: r() < .5 ? VEG : VEG_D });
      }
      add(O(lv, 4) + y * 1e-5, [Math.min(xin, xout) - 14, y - 34, Math.max(xin, xout) + 14, y + 5], (ctx) => grove(ctx, row), { wide: true });
    }
  }
  // the hilltop: scrub, rocks and cypresses over the whole slope above the top terrace (the path is drawn over it)
  for (let y = 224; y < 352; y += 6.5 + r() * 3) {
    const lv = lvAt(y), a = flankX(y, -1) + 3, b = flankX(y, 1) - 3, segs = [[a, b]];
    for (const [s0, s1] of segs) {
      if (s1 - s0 < 4) continue;
      const row = { side: 1, y, xin: s0, xout: s1, items: [] };
      for (let x = s0 + r() * 5; x < s1 - 2; x += 4.5 + r() * 7) {
        if (y < 240 && Math.abs(x - CX) < 106) continue;
        const u = r(), kind = y < 242 ? (u < .65 ? 'bush' : 'rock') : (u < .52 ? 'bush' : u < .7 ? 'rock' : u < .88 ? 'cypress' : 'olive');
        row.items.push({ x, y: y + (r() - .5) * 2, kind, s: kind === 'rock' ? 1.6 + r() * 2.4 : kind === 'bush' ? .6 + r() * .7 : .42 + r() * .35, seed: Math.floor(r() * 1e6), col: r() < .5 ? VEG : VEG_D });
      }
      add(O(lv, 4) + y * 1e-5, [s0 - 14, y - 30, s1 + 14, y + 5], (ctx) => grove(ctx, row), { wide: true });
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
    setTint(it.x, it.y - 6);
    if (it.kind === 'rock') rock(ctx, { x: it.x, y: it.y, s: it.s, seed: it.seed }); else tree(ctx, it);
  }
}
const O = (lv, k) => (5 - lv) * 100 + k;
// the tint an item is drawn with: its own place (houses, trees), or neutral across for things that span the hill (they shade themselves)
function tintOf(it) { if (it.wide) setTint(CX, (it.b[1] + it.b[3]) / 2); else setTint((it.b[0] + it.b[2]) / 2, (it.b[1] + it.b[3]) / 2); }   // painter's order: level lv: back row 10, mid wall 15, front row 20, things 25-35, the wall below its street 40
function assemble() {
  add(0, [180, 190, 1780, 812], drawMass, { wide: true });
  plantFlanks();
  // the summit, the path, its cypresses
  add(1, [880, 170, 1070, 242], drawSummit, { wide: true });
  add(O(4, 5), [930, 206, 1012, 316], drawPath4, { wide: true });
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
      add(O(lv, 15), [CX - hw, yb - 2, CX + hw, LV[lv].y0], (ctx) => midWall(ctx, lv, yb, hw), { wide: true });
    }
  }
  // the retaining walls (each hangs below its level's street), stairs, trees in the gaps
  const PK = ['', 'solid', 'balustrade', 'solid', 'low'];
  for (let lv = 1; lv <= 4; lv++) {
    const L = LV[lv], Lb = LV[lv - 1], r = prng(lv * 77);
    if (lv === 4) continue;
    const wl = { lv, x0: CX - SPAN[lv] - 8, x1: CX + SPAN[lv] + 8, bx0: CX - SPAN[lv - 1] + 4, bx1: CX + SPAN[lv - 1] - 4, ybot: Lb.y0 + 2, kind: PK[lv], butt: [], arches: [], ivy: [] };
    for (let x = wl.x0 + 30 + r() * 30; x < wl.x1 - 20; x += 70 + r() * 60) wl.butt.push(x);
    for (let x = wl.bx0 + 20; x < wl.bx1 - 20; x += 22 + r() * 30) if (r() < .55) wl.arches.push({ x, y: Lb.y0 - 1, w: 7 + r() * 4, h: 9 + r() * 5 });
    for (let i = 0; i < 6 + lv; i++) wl.ivy.push({ x: mix(wl.x0 + 20, wl.x1 - 20, r()), w: 8 + r() * 16, h: 8 + r() * 18, seed: lv * 100 + i });
    add(O(lv, 40), [wl.bx0 - 6, L.y0 - 6, wl.bx1 + 6, wl.ybot], (ctx) => drawWall(ctx, wl), { wide: true });
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
  add(O(0, 40), [240, 782, 1780, 794], drawQuay, { wide: true });
  for (const L of LAMPS) add(O(0, 41), [L.x - 3, L.y - 4, L.x + 3, 785], (ctx) => lampPost(ctx, L));
  // haze lying in front of each level's upper wall (between the levels: depth)
  for (let lv = 0; lv < 4; lv++) add(O(lv, 5), [CX - SPAN[lv] - 30, LV[lv].y1 - 2, CX + SPAN[lv] + 30, LV[lv].y1 + 64], (ctx) => hazeBand(ctx, lv), { wide: true });
  STATIC.sort((a, b) => a.o - b.o);
}
// lamps along the quay (cast iron; their light is live)
const LAMPS = (() => { const out = []; for (let x = 352; x < 1640; x += 92) { if (Math.abs(x - 898) < 20 || (x > 736 && x < 802)) continue; out.push({ x: x + 8 * hash(x), y: 784 - 16.5, th: clamp(Math.abs(x - CX) / 700) * .85 + .04 * hash(x * 3) }); } return out; })();
function lampPost(ctx, L) {
  if (PASS === 'glass' || PASS === 'tv' || PASS === 'front') return;
  const { x, y } = L; ctx.fillStyle = K('#1d1a2e');
  ctx.fillRect(x - .32, y + 2, .64, 784 - y - 2); ctx.fillRect(x - .9, 782.8, 1.8, 1.2); ctx.fillRect(x - .6, y + 6, 1.2, .5);
  ctx.beginPath(); ctx.moveTo(x - 1.3, y + 2.2); ctx.lineTo(x - 1, y - .4); ctx.lineTo(x + 1, y - .4); ctx.lineTo(x + 1.3, y + 2.2); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 1.5, y - .3); ctx.lineTo(x, y - 1.9); ctx.lineTo(x + 1.5, y - .3); ctx.closePath(); ctx.fill();
  ctx.fillStyle = K('#4a4670'); ctx.fillRect(x - .75, y + .1, 1.5, 1.8);
}
function hazeBand(ctx, lv) {
  if (PASS === 'glass' || PASS === 'tv' || PASS === 'front') return;
  const y0 = LV[lv].y1 + 3, a = CX - SPAN[lv] - 30, b = CX + SPAN[lv] + 30, hb = 60;
  const g = ctx.createLinearGradient(0, y0, 0, y0 + hb); g.addColorStop(0, K('#a89ab8', 0)); g.addColorStop(.35, K('#a89ab8', .2)); g.addColorStop(1, K('#a89ab8', .06));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(a, y0 + 12); ctx.quadraticCurveTo(CX, y0 - 6, b, y0 + 12); ctx.lineTo(b, y0 + hb); ctx.lineTo(a, y0 + hb); ctx.closePath(); ctx.fill();
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
HILL.view = { x: 960, y: HILL.standY, parapet: { x0: 914, x1: 1006, y: 207 }, cairn: { x: 960, y: 196 }, bench: { x: 927, y: 214 }, edge: { x0: 896, x1: 1024 }, path: PATH4.map((p) => [...p]) };

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
  if (w.named) { namedGlow(ctx, w, s); return; }
  if (s.on > .002) glassLit(ctx, w, 'amber', s.on * s.b * (1 - s.tv));
  if (s.tv > .002) glassLit(ctx, w, 'tv', s.tv * s.f);
}

// ---------------------------------------------------------------- people and boats (live, drawn every frame)
const ACC = ['#8a4a4a', '#4a6a8a', '#8a7a4a', '#5a7a5a', '#7a5a7a', '#9a6a50'];
const PEOPLE = (() => {
  const r = prng(321), out = [];
  const P = (x, y, pose, o = {}) => out.push({ x, y, pose, s: o.s ?? .051, flip: o.flip ?? r() < .5, seed: Math.floor(r() * 1000), th: o.th ?? r() * .9,
    clip: o.clip ?? null, lv: o.lv ?? 0, door: o.door ?? null, acc: o.acc === undefined ? (r() < .55 ? ACC[Math.floor(r() * ACC.length)] : null) : o.acc, part: r() < .5 ? 'sweater' : 'coat', hair: ['short', 'long', 'bun', 'curly', 'short'][Math.floor(r() * 5)], rod: o.rod });
  const q = 784;
  for (const [x, gap] of [[430, 7.5], [612, 8], [934, 7], [1176, 8], [1418, 7.5]]) { P(x, q, 'stand', { flip: false }); P(x + gap, q, r() < .5 ? 'look' : 'stand', { flip: true }); }
  P(520, q, 'perch', { flip: false, rod: true, th: .1 }); P(1300, q, 'perch', { flip: true, th: .3 }); P(1306.5, q, 'perch', { flip: false, th: .32 });
  P(700, q, 'stand', { flip: true }); P(1050, q, 'look', { flip: false }); P(1520, q, 'stand', { flip: true });
  // neighbours on their doorsteps (st.doors)
  const ds = DOORS.filter((d) => d.lv === 0 && d.house.row === 0 && !d.church);
  for (let i = 0; i < ds.length; i += 3) { const d = ds[i]; P(d.x + d.w + 1.6, q, r() < .5 ? 'sit' : 'stand', { door: d, flip: r() < .5, th: r() * .6 }); }
  // the belonging terrace: behind its parapet (seen from the waist up), at the pergola's long table
  for (const x of [700, 1124, 1340]) P(x, terraceY(1, x), 'stand', { lv: 1, clip: terraceY(1, x) - 4.4, s: .049 });
  for (let i = 0; i < 4; i++) { const x = SPECIAL.pergola.x + 9 + i * 8.6; P(x, terraceY(1, x), 'sit', { lv: 1, clip: terraceY(1, x) - 4.4, s: .049, flip: i >= 2, th: .2 + i * .1 }); }
  // the esteem square
  for (const [dx, pose, fl] of [[6, 'stand', false], [26, 'look', true], [34, 'stand', false], [66, 'stand', true]]) { const x = SPECIAL.square.x + dx; P(x, terraceY(2, x), pose, { lv: 2, clip: terraceY(2, x) - 3.7, s: .047, flip: fl }); }
  // self-actualization: someone in a garden
  P(1002, terraceY(3, 1002), 'sit', { lv: 3, clip: terraceY(3, 1002) - 4.4, s: .045, flip: true });
  return out;
})();
const SUMMIT_FIGS = [{ x: 944, pose: 'look', flip: false, seed: 41 }, { x: 972, pose: 'stand', flip: true, seed: 42 }, { x: 990, pose: 'look', flip: false, seed: 43 }];
function person(ctx, p, t, n, alpha = 1) {
  const s = p.s, pose = Object.assign({}, POSES[p.pose] || POSES.stand, { hair: p.hair });
  const feet = p.y, hip = p.pose === 'sit' ? feet - 50 * s - 1.2 : p.pose === 'perch' ? feet - 1.4 : feet - 90 * s;
  if (p.clip != null) { ctx.save(); ctx.beginPath(); ctx.rect(p.x - 30, p.clip - 40, 60, 40); ctx.clip(); }
  const col = mixH('#241e36', '#0c0b1c', n), rim = mixH('#f0b898', '#6a5a88', n);
  figureFlat(ctx, p.x, hip, s, pose, { t, seed: p.seed, col, rim, rimSide: p.flip ? 1 : -1, flip: p.flip, fast: true, shadow: false, rimW: clamp(.9 / Z, .09, .45) * s / .05,
    accent: p.acc ? mixH(p.acc, '#141230', n * .8) : null, accentPart: p.part });
  if (p.rod) { ctx.strokeStyle = K('#2a2230', .9); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(p.x + 2, hip - 2.5); ctx.quadraticCurveTo(p.x + 14, hip - 12, p.x + 22, hip - 10); ctx.stroke(); ctx.strokeStyle = K('#d8d0e0', .35); ctx.beginPath(); ctx.moveTo(p.x + 22, hip - 10); ctx.lineTo(p.x + 23, HZ + 4); ctx.stroke(); }
  if (p.clip != null) ctx.restore();
}
const BOATS = [[392, 4.5, 17, 'gozzo', '#34506e', .3], [468, 2.8, 14, 'row', '#7a4a3e', 1.2], [596, 5.2, 21, 'mast', '#e0d8cc', 2.1], [826, 3.2, 15, 'gozzo', '#7a6a44', 2.9],
  [1006, 4.6, 18, 'gozzo', '#4a6a5a', 3.7], [1118, 2.6, 13, 'row', '#e0d8cc', 4.4], [1262, 5.6, 24, 'mast', '#36506a', 5.2], [1468, 3.6, 16, 'gozzo', '#8a4a40', 6.1], [1560, 6.4, 13, 'row', '#4a4a6a', 7.3]];
function boat(ctx, b, t, n, refl) {
  const [x, d, L, kind, col, ph] = b, wl = HZ + d, bob = .35 * Math.sin(t * 1.05 + ph) + .15 * Math.sin(t * 2.3 + ph * 2), rot = .014 * Math.sin(t * .85 + ph * 1.7);
  ctx.save(); ctx.translate(x, wl + bob); ctx.rotate(rot); if (refl) { ctx.scale(1, -.85); }
  const h = kind === 'row' ? 2.6 : 3.6, hw = L / 2;
  // hull
  ctx.beginPath(); ctx.moveTo(-hw, -h); ctx.quadraticCurveTo(0, -h + .8, hw + 1.2, -h - 1.2); ctx.quadraticCurveTo(hw, -.6, hw - 2, 0); ctx.lineTo(-hw + 1.4, 0); ctx.quadraticCurveTo(-hw - .4, -h * .4, -hw, -h); ctx.closePath();
  ctx.fillStyle = refl ? K(shadeH(col, -.55)) : hgrad(ctx, -hw, hw, [[0, shadeH(col, .1)], [1, shadeH(col, -.35)]]); ctx.fill();
  if (!refl) {
    ctx.fillStyle = K('#e8e0d4', .85); ctx.beginPath(); ctx.moveTo(-hw, -h); ctx.quadraticCurveTo(0, -h + .8, hw + 1.2, -h - 1.2); ctx.lineTo(hw + .9, -h - .4); ctx.quadraticCurveTo(0, -h + 1.6, -hw + .1, -h + .8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = K(INK, .5); ctx.lineWidth = lw(.6); ctx.beginPath(); ctx.moveTo(-hw + 1.4, -.2); ctx.lineTo(hw - 2, -.2); ctx.stroke();
    if (Z > 1.6) { ctx.strokeStyle = K(INK, .25); ctx.beginPath(); for (let k = 1; k < 3; k++) { ctx.moveTo(-hw + .5, -h + k * h / 3); ctx.quadraticCurveTo(0, -h + k * h / 3 + .6, hw - .5, -h + k * h / 3 - .6); } ctx.stroke(); }
  }
  if (kind === 'gozzo') { ctx.fillStyle = K(refl ? '#1a1a2a' : '#c8c0b8'); ctx.fillRect(-hw * .5, -h - 3.4, hw * .55, 3); ctx.fillStyle = K('#3a3850'); ctx.fillRect(-hw * .45, -h - 2.6, hw * .18, 1.4); }
  if (kind === 'mast') {
    ctx.strokeStyle = K(refl ? '#1a1a2a' : '#3a3036'); ctx.lineWidth = .55; ctx.beginPath(); ctx.moveTo(-1, -h); ctx.lineTo(-1, -h - L * .95); ctx.moveTo(-1, -h - 3); ctx.lineTo(hw * .8, -h - 2); ctx.stroke();
    ctx.strokeStyle = K('#d8d0c8', refl ? .2 : .55); ctx.lineWidth = .3; ctx.beginPath(); ctx.moveTo(-1, -h - L * .95); ctx.lineTo(hw + 1, -h - 1); ctx.moveTo(-1, -h - L * .95); ctx.lineTo(-hw, -h); ctx.stroke();
    ctx.fillStyle = K(refl ? '#24222e' : '#d8cfc4'); ctx.beginPath(); ctx.ellipse(hw * .35, -h - 2.6, hw * .6, .9, -.04, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the cache: the static town as images (dusk + night), and the lit glass as masks
const RB = [176, 150, 1780, 808], RBW = RB[2] - RB[0], RBH = RB[3] - RB[1];
const ZV = 4.3;                       // above this zoom everything is drawn as vectors (crisp at any zoom)
const CACHE = { ok: false };
function renderLevel(s, pass) {
  const c = createCanvas(Math.ceil(RBW * s), Math.ceil(RBH * s)), x = c.getContext('2d');
  x.setTransform(s, 0, 0, s, -RB[0] * s, -RB[1] * s); Z = s; VB = [...RB]; setN(0); ST = {};
  if (pass === 'main') { PASS = 'main'; for (const it of STATIC) { tintOf(it); it.f(x); } setTint(CX, HZ); }
  else {
    for (const it of STATIC) {
      x.globalCompositeOperation = 'destination-out'; PASS = 'erase'; x.save(); it.f(x); x.restore();
      if (it.house) {
        x.globalCompositeOperation = 'source-over'; PASS = pass; x.save(); it.f(x); x.restore();
        x.globalCompositeOperation = 'destination-out'; PASS = 'front'; x.save(); it.f(x); x.restore();
      }
    }
    x.globalCompositeOperation = 'source-over';
  }
  PASS = 'main'; VB = [-1e9, -1e9, 1e9, 1e9];
  return c;
}
function nightOf(c) {   // exact per-pixel multiply toward night (the lights are not in these images)
  const w = c.width, h = c.height, x = c.getContext('2d'), id = x.getImageData(0, 0, w, h), d = id.data;
  const m0 = Math.round(NIGHTM[0] * 256), m1 = Math.round(NIGHTM[1] * 256), m2 = Math.round(NIGHTM[2] * 256);
  for (let i = 0; i < d.length; i += 4) { d[i] = (d[i] * m0) >> 8; d[i + 1] = (d[i + 1] * m1) >> 8; d[i + 2] = (d[i + 2] * m2) >> 8; }
  const c2 = createCanvas(w, h); c2.getContext('2d').putImageData(id, 0, 0); return c2;
}
async function buildCache() {
  const t0 = Date.now();
  const SRCF = fileURLToPath(import.meta.url), KEY = crypto.createHash('md5').update(fs.readFileSync(SRCF)).digest('hex').slice(0, 12);
  const DIR = process.env.HILL_CACHE_DIR || '/tmp/claude-0/hill/cache', names = ['b1', 'n1', 'b2', 'n2', 'g2', 't2', 'b3', 'n3'], files = names.map((k) => `${DIR}/${KEY}_${k}.png`);
  const have = () => files.every((f) => fs.existsSync(f));
  let bufs = null, built = false, fd = null;
  try { fs.mkdirSync(DIR, { recursive: true }); } catch { }
  if (!have()) {
    // one process builds, the others wait for its files (a lock older than 3 min is stale)
    const LOCK = `${DIR}/${KEY}.lock`;
    try { fd = fs.openSync(LOCK, 'wx'); } catch { fd = null; }
    if (fd === null) {
      let stale = false; try { stale = Date.now() - fs.statSync(LOCK).mtimeMs > 180000; } catch { stale = true; }
      for (let i = 0; !stale && i < 480 && !have(); i++) await new Promise((r) => setTimeout(r, 250));
    }
    if (!have()) {
      try {
        const b1 = renderLevel(1.2, 'main'), b2 = renderLevel(2.4, 'main'), b3 = renderLevel(3.6, 'main');
        const cv = { b1, n1: nightOf(b1), b2, n2: nightOf(b2), g2: renderLevel(2.4, 'glass'), t2: renderLevel(2.4, 'tv'), b3, n3: nightOf(b3) };
        bufs = await Promise.all(names.map((k) => cv[k].encode('png'))); built = true;
        names.forEach((k, i) => { const tmp = `${files[i]}.${process.pid}.tmp`; fs.writeFileSync(tmp, bufs[i]); fs.renameSync(tmp, files[i]); });
      } catch (e) { if (!bufs) throw e; }
      finally { if (fd !== null) { try { fs.closeSync(fd); fs.unlinkSync(LOCK); } catch { } } }
    }
  }
  if (!bufs) bufs = files.map((f) => fs.readFileSync(f));
  const ims = await Promise.all(bufs.map(async (b) => { const im = new Image(); im.src = b; await im.decode(); return im; }));
  if (ims.some((im) => !(im.width > 0))) return;
  const I = Object.fromEntries(names.map((k, i) => [k, ims[i]]));
  Object.assign(CACHE, I, { ok: true, ms: Date.now() - t0, built, key: KEY });
}
// the cached town for the current view: 1.2 px/unit up to z 1.2, crossfades to 2.4 (z 1.2–1.4) and to 3.6 (z 2.6–2.9), 3.6 up to ZV
function drawRaster(ctx, z, n) {
  const vx0 = Math.max(RB[0], VB[0]), vy0 = Math.max(RB[1], VB[1]), vx1 = Math.min(RB[2], VB[2]), vy1 = Math.min(RB[3], VB[3]); if (vx1 <= vx0 || vy1 <= vy0) return;
  const one = (b, nn, s, a) => {
    // dusk image then night image, alphas chosen so the result is exactly a·mix(dusk, night, n) over what is below
    const sx = (vx0 - RB[0]) * s, sy = (vy0 - RB[1]) * s, sw = (vx1 - vx0) * s, sh = (vy1 - vy0) * s, an = a * n, a1 = an >= .999 ? 0 : a * (1 - n) / (1 - an);
    if (a1 > .002) { ctx.globalAlpha = a1; ctx.drawImage(b, sx, sy, sw, sh, vx0, vy0, vx1 - vx0, vy1 - vy0); }
    if (an > .002) { ctx.globalAlpha = an; ctx.drawImage(nn, sx, sy, sw, sh, vx0, vy0, vx1 - vx0, vy1 - vy0); }
  };
  const u12 = clamp((z - 1.2) / .2), u23 = clamp((z - 2.6) / .3);
  if (u23 > 0) one(CACHE.b3, CACHE.n3, 3.6, 1);
  if (u12 > 0 && u23 < 1) one(CACHE.b2, CACHE.n2, 2.4, u23 > 0 ? 1 - u23 : 1);
  if (u12 < 1) one(CACHE.b1, CACHE.n1, 1.2, 1 - u12);
  ctx.globalAlpha = 1;
}
// lit windows from the masks (occlusion is baked in: a roof or a tree in front of a window stays in front)
function rasterWindows(ctx) {
  const s = 2.4;
  for (let lv = 0; lv < 5; lv++) for (const w of WINDOWS[lv]) {
    if (!inVB(w.x, w.y, w.x + w.w, w.y + w.h)) continue;
    if (ST.inside && ST.inside.level === lv && ST.inside.id === w.id) continue;
    const st = winState(w); if (st.on < .002 && st.tv < .002) continue;
    if (w.named) { namedGlow(ctx, w, st); continue; }
    if (cutHidden(w.house)) continue;
    const sx = (w.x - RB[0]) * s, sy = (w.y - RB[1]) * s, sw = w.w * s, sh = w.h * s;
    const a = st.on * st.b * (1 - st.tv);
    if (a > .002) { ctx.globalAlpha = a; ctx.drawImage(CACHE.g2, sx, sy, sw, sh, w.x, w.y, w.w, w.h); }
    if (st.tv > .002) { ctx.globalAlpha = st.tv * st.f; ctx.drawImage(CACHE.t2, sx, sy, sw, sh, w.x, w.y, w.w, w.h); }
  }
  ctx.globalAlpha = 1;
}
function namedGlow(ctx, w, s) {
  if (s.on < .002 && s.tv < .002) return;
  ctx.save(); winPath(ctx, w.x, w.y, w.w, w.h, 0, 0); ctx.clip();
  if (s.on > .002) { ctx.globalAlpha = s.on * (1 - s.tv) * .92; const g = ctx.createLinearGradient(0, w.y, 0, w.y + w.h); g.addColorStop(0, '#ffd28e'); g.addColorStop(1, '#e8913c'); ctx.fillStyle = g; ctx.fillRect(w.x, w.y, w.w, w.h); }
  if (s.tv > .002) { ctx.globalAlpha = s.tv * s.f; const g = ctx.createLinearGradient(0, w.y, 0, w.y + w.h); g.addColorStop(0, '#2c5f88'); g.addColorStop(1, '#8fe6ff'); ctx.fillStyle = g; ctx.fillRect(w.x, w.y, w.w, w.h); }
  ctx.restore();
}

// ---------------------------------------------------------------- sky and water
// sky layers move with their own parallax camera (a layer k times farther away than the hill moves and zooms less)
function parCam(cam, k) { return { x: 960 + (cam.x - 960) / k, y: 520 + (cam.y - 520) / k, z: k / (k - 1 + 1 / cam.z) }; }
let STARB = null;
const STARS = (() => { const r = prng(7), s = []; for (let i = 0; i < 760; i++) { const m = r(); s.push([r() * 2600 - 340, r() * 860 - 160, m < .88 ? .45 + r() * .65 : 1 + r() * 1.2, r() * TAU, .25 + r() * .9, m]); } return s; })();
const MILKY = (() => { const r = prng(91), out = []; for (let i = 0; i < 2600; i++) { const u = (r() * 2 - 1) * 1300, g = (r() + r() + r() - 1.5) / 1.5, rift = Math.abs(g * 120 + 18 * Math.sin(u * .006) - 14) < 9 && r() < .75; if (rift) continue; out.push([u, g * 150 * (1 - .35 * Math.abs(u) / 1300), .5 + r() * .7, Math.floor(r() * r() * 4)]); } return out; })();
function skyCols(n) { return [mixH('#262458', '#04050f', n), mixH('#4e447e', '#0a0e28', n), mixH('#9a6c94', '#171742', n), mixH('#e8a89c', '#24224c', n)]; }
const CLOUDS = [[330, 250, 620, 22, 0], [600, 128, 460, 14, 1], [1290, 92, 560, 16, 2], [150, 430, 330, 12, 3], [1660, 196, 300, 10, 4], [1830, 380, 260, 9, 5]];
const RIDGES = [[9, '#8a7aa8', '#1c1c46', 1, 46], [4.5, '#6a5c8a', '#14143a', 2, 30]];
function sky(ctx, t, cam, n, st) {
  const p6 = parCam(cam, 6), [, hy] = toScreen(p6, 0, HZ), [s0, s1, s2, s3] = skyCols(n), span = 900 * p6.z;
  const g = ctx.createLinearGradient(0, hy - span, 0, hy);
  g.addColorStop(0, s0); g.addColorStop(.55, s1); g.addColorStop(.85, s2); g.addColorStop(1, s3);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // the last light low in the west (left), gone at night
  {
    const [gx, gy] = toScreen(p6, 470, HZ), r = 980 * p6.z, a = .42 * (1 - .75 * n), c = mixH('#ffc29a', '#3a3470', n);
    const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, r); rg.addColorStop(0, rgba(c, a)); rg.addColorStop(.45, rgba(c, a * .35)); rg.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, Math.min(H, hy + 10));
  }
  // stars (they come out as the night deepens, each at its own threshold; a slow twinkle)
  const sa = n; if (sa > .05) {
    const p40 = parCam(cam, 40), NB = 12;
    if (!STARB) STARB = Array.from({ length: NB }, () => []);
    for (const b of STARB) b.length = 0;
    for (const st of STARS) {
      const [x, y, s, ph, f, m] = st, th = s > 1 ? .1 + .1 * hash(m * 91) : .22 + .5 * hash(m * 57), on = sm(clamp((sa - th) / .16)); if (on <= .01) continue;
      const X = (x - p40.x) * p40.z + W / 2, Y = (y - p40.y) * p40.z + H / 2; if (X < -4 || X > W + 4 || Y < -4 || Y > hy - 20) continue;
      const a = on * (.5 + .5 * (.5 + .5 * Math.sin(t * f + ph))) * clamp((hy - 40 - Y) / 220) * (s > 1 ? .95 : .7); if (a <= .02) continue;
      STARB[Math.min(NB - 1, Math.floor(a * NB))].push(X, Y, s);
    }
    for (let bk = 0; bk < NB; bk++) {
      const B = STARB[bk]; if (!B.length) continue;
      ctx.fillStyle = rgba('#f3efe2', (bk + .5) / NB); ctx.beginPath();
      for (let i = 0; i < B.length; i += 3) {
        const X = B[i], Y = B[i + 1], s = B[i + 2];
        if (s > 1) { ctx.rect(X - s * 1.6, Y - .35, s * 3.2, .7); ctx.rect(X - .35, Y - s * 1.6, .7, s * 3.2); ctx.rect(X - s * .45, Y - s * .45, s * .9, s * .9); }
        else ctx.rect(X - s / 2, Y - s / 2, s, s);
      }
      ctx.fill();
    }
  }
  // the Milky Way (deep night): a faint glow and its dust, rising to the upper right behind the summit
  const mw = sm(clamp((n - .55) / .35));
  if (mw > .01) {
    const p40 = parCam(cam, 40), [mx, my] = toScreen(p40, 960, 330), ang = -.5, zz = p40.z;
    ctx.save(); ctx.translate(mx, my); ctx.rotate(ang); ctx.scale(1, .15);
    for (const [r0, a0] of [[1250, .075], [620, .06]]) { const g2 = ctx.createRadialGradient(0, 0, 0, 0, 0, r0 * zz); g2.addColorStop(0, rgba('#c4cbf0', a0 * mw)); g2.addColorStop(.6, rgba('#a8b0e0', a0 * .45 * mw)); g2.addColorStop(1, rgba('#a8b0e0', 0)); ctx.fillStyle = g2; ctx.fillRect(-r0 * zz, -r0 * zz, r0 * 2 * zz, r0 * 2 * zz); }
    ctx.restore();
    const ca = Math.cos(ang), sa2 = Math.sin(ang);
    for (let bkt = 0; bkt < 4; bkt++) {
      ctx.fillStyle = rgba('#e8ecff', (.16 + bkt * .12) * mw); ctx.beginPath();
      for (const [u, v, s, b] of MILKY) { if (b !== bkt) continue; const X = mx + (u * ca - v * sa2) * zz, Y = my + (u * sa2 + v * ca) * zz; if (X < 0 || X > W || Y < 0 || Y > hy - 30) continue; ctx.rect(X, Y, s, s); }
      ctx.fill();
    }
  }
  // clouds: long thin strata, engraved, their undersides lit by the last light (dusk) or faintly by the town (night)
  {
    const p10 = parCam(cam, 10), top = mixH('#3e3474', '#0b0f2c', n), low = mixH('#d8a0a6', '#1c1f4c', n);
    for (const [cx0, cy, w, h, sd] of CLOUDS) {
      const cx = cx0 + t * 1.4, [X0, Y0] = toScreen(p10, cx - w / 2, cy - h), [X1, Y1] = toScreen(p10, cx + w / 2, cy + h * .4);
      if (X1 < 0 || X0 > W || Y1 < 0 || Y0 > hy) continue;
      ctx.beginPath(); const N = 28;
      for (let i = 0; i <= N; i++) { const u = i / N, e = Math.pow(Math.sin(Math.PI * u), .6), y = cy - h * e * (.55 + .45 * (.5 + .5 * noise(sd * 5 + u * 7.3))); const [X, Y] = toScreen(p10, cx - w / 2 + w * u, y); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      for (let i = N; i >= 0; i--) { const u = i / N, e = Math.pow(Math.sin(Math.PI * u), .8), y = cy + h * .22 * e * (.6 + .4 * noise(sd * 3 + u * 5.1)); const [X, Y] = toScreen(p10, cx - w / 2 + w * u, y); ctx.lineTo(X, Y); }
      ctx.closePath();
      const g = ctx.createLinearGradient(0, Y0, 0, Y1); g.addColorStop(0, rgba(top, .0)); g.addColorStop(.35, rgba(top, .85)); g.addColorStop(.8, rgba(mixH(top, low, .6), .9)); g.addColorStop(1, rgba(low, .9));
      ctx.fillStyle = g; ctx.fill();
      ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(INK, .28); ctx.lineWidth = .8; ctx.beginPath();
      const dy = Math.max(2.4, 3.2 * p10.z); for (let y = Y0 + (sd % 3); y < Y1; y += dy) { let x = X0 + hash(sd * 7 + y) * 30; while (x < X1) { const L = 18 + 70 * hash(x * .13 + y + sd); ctx.moveTo(x, y); ctx.lineTo(x + L, y); x += L + 4 + 10 * hash(x + y * .7); } }
      ctx.stroke(); ctx.restore();
    }
  }
  // far ridges on the horizon (two layers), a mist at their feet
  for (const [k, cd, cn, sd, amp] of RIDGES) {
    const pc = parCam(cam, k), col = mixH(cd, cn, n);
    ctx.beginPath(); let first = true;
    for (let x = -700; x <= 2620; x += 14) {
      const e = Math.abs(x - 960) / 960, hgt = amp * (.35 + .65 * clamp(e * 1.2)) * (.55 + .45 * fbm(x * .0042 + sd * 9)) + 10 * fbm(x * .021 + sd * 4);
      const [X, Y] = toScreen(pc, x, HZ - Math.max(4, hgt)); if (first) { ctx.moveTo(X, Y); first = false; } else ctx.lineTo(X, Y);
    }
    const [Xe, Ye] = toScreen(pc, 2620, HZ + 300), [Xs] = toScreen(pc, -700, HZ + 300); ctx.lineTo(Xe, Ye); ctx.lineTo(Xs, Ye); ctx.closePath();
    ctx.fillStyle = col; ctx.fill();
    // engraved horizontal shading on the ridge, a pale rim
    ctx.save(); ctx.clip();
    const [, ry0] = toScreen(pc, 0, HZ - amp - 14), [, ry1] = toScreen(pc, 0, HZ + 2), dy = Math.max(2.2, 3 * pc.z);
    ctx.strokeStyle = rgba(INK, .22); ctx.lineWidth = .8; ctx.beginPath(); for (let y = ry0; y < ry1; y += dy) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke();
    const [, fy0] = toScreen(pc, 0, HZ - 50), [, fy1] = toScreen(pc, 0, HZ + 4), fc = mixH('#d8aec0', '#2a2c5c', n);
    const fg = ctx.createLinearGradient(0, fy0, 0, fy1); fg.addColorStop(0, rgba(fc, 0)); fg.addColorStop(1, rgba(fc, k > 5 ? .6 : .45)); ctx.fillStyle = fg; ctx.fillRect(0, fy0, W, fy1 - fy0);
    ctx.restore();
  }
}
// the water below the horizon line (screen space): it holds the sky's glow near the horizon, dark toward us
function waterBase(ctx, cam, n) {
  const [, hy] = toScreen(cam, 0, HZ); if (hy >= H) return;
  const y0 = Math.max(hy, -10), g = ctx.createLinearGradient(0, hy, 0, hy + 300 * cam.z);
  g.addColorStop(0, mixH('#5e5082', '#141440', n)); g.addColorStop(.12, mixH('#433a70', '#0e0e32', n)); g.addColorStop(.45, mixH('#2a2454', '#090a24', n)); g.addColorStop(1, mixH('#1a1638', '#05060f', n));
  ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0);
}
// the ripple bands of the reflection: world-anchored (they never crawl when the camera moves), thinner near the horizon
const BANDS = (() => { const out = []; let d = 0, k = 0; while (d < 700) { const h = .7 + d * .045; out.push([d, h, k]); d += h; k++; } return out; })();
const bandDX = (k, d, t) => (.35 + d * .028) * (noise(k * .61 + t * .55) * .8 + noise(k * 1.73 - t * .9 + 4) * .45);
const l0lamps = (st) => (st.lit || [])[0] ?? 0;
// the hill and its lights mirrored in the water (world transform)
function waterWorld(ctx, t, cam, n, st) {
  const y1 = Math.min(VB[3], HZ + 700); if (y1 <= HZ) return;
  const vx0 = Math.max(RB[0], VB[0]), vx1 = Math.min(RB[2], VB[2]);
  if (CACHE.ok && vx1 > vx0) {
    const hi = Z > 1.3, img = hi ? CACHE.b2 : CACHE.b1, imgN = hi ? CACHE.n2 : CACHE.n1, s = hi ? 2.4 : 1.2;
    ctx.save(); ctx.translate(0, 2 * HZ); ctx.scale(1, -1);
    for (const [d, h, k] of BANDS) {
      if (HZ + d > y1) break;
      if (HZ + d + h < VB[1]) continue;
      const ys1 = HZ - d, ys0 = ys1 - h * .8;   // the mirrored source rows (a thin dark gap between bands)
      if (ys0 < RB[1]) break;
      const dx = bandDX(k, d, t), a = clamp(.62 - d * .0016) * (.78 + .22 * hash(k * 2.3));
      const a1 = a * (1 - n) / (1 - a * n), a2 = a * n;
      const sx = (vx0 - RB[0]) * s, sy = (ys0 - RB[1]) * s, sw = (vx1 - vx0) * s, sh = (ys1 - ys0) * s;
      if (a1 > .003) { ctx.globalAlpha = a1; ctx.drawImage(img, sx, sy, sw, sh, vx0 + dx, ys0, vx1 - vx0, ys1 - ys0); }
      if (a2 > .003) { ctx.globalAlpha = a2; ctx.drawImage(imgN, sx, sy, sw, sh, vx0 + dx, ys0, vx1 - vx0, ys1 - ys0); }
    }
    ctx.restore(); ctx.globalAlpha = 1;
  } else {
    ctx.save(); ctx.translate(0, 2 * HZ); ctx.scale(1, -1); polyP(ctx, OUTLINE); ctx.fillStyle = K('#2a2444', .55); ctx.fill(); ctx.restore();
  }
  // the lights in the water: each lit window drops a broken column of dashes (stretched, rocking with the ripples)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let lv = 0; lv < 3; lv++) for (const w of WINDOWS[lv]) {
    const top = 2 * HZ - w.y - w.h; if (top > y1 || top + w.h * 2.2 < VB[1] || w.x > VB[2] + 8 || w.x + w.w < VB[0] - 8) continue;
    if (ST.inside && ST.inside.level === lv && ST.inside.id === w.id) continue;
    const s = winState(w), am = s.on * (1 - s.tv) * s.b, tv = s.tv * s.f; if (am < .02 && tv < .02) continue;
    const dTop = top - HZ, len = w.h * (1.3 + 1.5 * w.k), fade = clamp(1 - dTop / 280);
    ctx.beginPath();
    for (const [d, h, k] of BANDS) {
      if (d + h < dTop) continue; if (d > dTop + len) break;
      const u = (d - dTop) / len, hk = hash(k * 1.9 + w.ph); if (hk < .14) continue;
      const wv = w.w * (1.15 - .55 * u) * (.6 + .7 * hk), x = w.x + w.w / 2 + bandDX(k, d, t) * 1.3 + (hash(k * 7.1 + w.ph) - .5) * w.w * .6 * u;
      ctx.rect(x - wv / 2, HZ + d + h * .4 * hash(k * 3.7 + w.ph * 2), wv, Math.min(h * .5, .45 + 2.4 / Z));
    }
    if (am >= .02) { ctx.fillStyle = `rgba(255,${Math.round(170 + 30 * (1 - w.warm))},${Math.round(90 + 40 * (1 - w.warm))},${(am * .5 * fade).toFixed(3)})`; ctx.fill(); }
    if (tv >= .02) { ctx.fillStyle = `rgba(143,230,255,${(tv * .45 * fade).toFixed(3)})`; ctx.fill(); }
  }
  // the lamps: long columns of light
  if (l0lamps(st) > 0) for (const L of LAMPS) {
    const on = sm(clamp((l0lamps(st) * 1.07 - L.th) / .05)); if (on <= .01 || L.x < VB[0] - 10 || L.x > VB[2] + 10) continue;
    ctx.beginPath();
    for (const [d, h, k] of BANDS) { if (d > 70) break; if (HZ + d > y1) break; const hk = hash(k * 2.9 + L.x); if (hk < .1) continue; const wv = (2.6 - d * .02) * (.6 + .8 * hk); ctx.rect(L.x + bandDX(k, d, t) * 1.4 - wv / 2, HZ + d + h * .3 * hk, wv, h * .55); }
    ctx.fillStyle = `rgba(255,186,104,${(.55 * on).toFixed(3)})`; ctx.fill();
  }
  ctx.restore();
  // engraved water lines: pale glints near the horizon (the sky in the water), dark lines toward us; world-anchored rows (an octave
  // lattice, so zooming never re-deals them), dashes drifting slowly along the row
  {
    const [dd, f] = oct(2.4, 3.4), hd = dd / 2, pale = mixH('#d2b4cc', '#4a5490', n), x0 = VB[0], x1 = VB[2];
    const k0 = Math.max(1, Math.ceil((Math.max(VB[1], HZ) - HZ) / hd)), k1 = Math.floor((y1 - HZ) / hd);
    ctx.lineWidth = lw(.7); ctx.lineCap = 'butt';
    for (let pass = 0; pass < 2; pass++) {
      const al = pass ? f : 1; if (al < .02) continue;
      for (const pal of [true, false]) {
        ctx.strokeStyle = pal ? rgba(pale, .2 * al * (1 - .4 * n)) : rgba(INK, .3 * al); ctx.beginPath();
        for (let k = k0; k <= k1; k++) {
          if ((k & 1) !== pass) continue;
          const d = k * hd, yy = HZ + d; if (pal && d > 70) continue;
          const key = Math.round(d * 64), sp = 22 + d * .4, drift = t * (1 + hash(key * .013) * 1.4);
          for (let i = Math.floor((x0 - drift) / sp) - 1; ; i++) {
            const xs = i * sp + drift; if (xs > x1) break;
            const hh = hash(key * .37 + i * 1.7); if (pal ? hh > .42 : hh < .42) continue;
            ctx.moveTo(xs, yy); ctx.lineTo(xs + sp * (.3 + .5 * hash(key * .11 + i * 3.1)), yy);
          }
        }
        ctx.stroke();
      }
    }
  }
  // the boats' reflections
  ctx.save(); ctx.globalAlpha = .5; for (const b of BOATS) { if (!inVB(b[0] - 16, HZ, b[0] + 16, HZ + 30)) continue; boat(ctx, b, t, n, true); } ctx.restore();
}

// ---------------------------------------------------------------- drawing a frame
export function drawHill(ctx, t, cam, st = {}) {
  T = t; ST = st;
  const n = clamp(st.night ?? .5), z = cam.z;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.imageSmoothingEnabled = true;
  sky(ctx, t, cam, n, st);
  waterBase(ctx, cam, n);
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cam.x, -cam.y);
  const [vx0, vy0] = toWorld(cam, -40, -40), [vx1, vy1] = toWorld(cam, W + 40, H + 40);
  VB = [vx0, vy0, vx1, vy1]; Z = z; setN(n); setTint(CX, HZ);
  waterWorld(ctx, t, cam, n, st);
  if (CACHE.ok && z <= ZV) { drawRaster(ctx, z, n); rasterWindows(ctx); }
  else { PASS = 'vector'; for (const it of STATIC) { if (it.b[2] < vx0 || it.b[0] > vx1 || it.b[3] < vy0 || it.b[1] > vy1) continue; tintOf(it); it.f(ctx); } PASS = 'main'; }
  setTint(CX, HZ);
  live(ctx, t, cam, n, st);
  ctx.restore();
  labels(ctx, t, cam, st);
  VB = [-1e9, -1e9, 1e9, 1e9];
}
const cutU = (hs) => (hs.workshop == null ? 0 : clamp((ST.cutaway ?? 0) * 1.45 - hs.workshop * .09));
const cutHidden = (hs) => cutU(hs) > 0;
// everything that changes: doors, workshops opening, the frame on the square, glows, people, boats, fog, the hill building itself
function live(ctx, t, cam, n, st) {
  // open doors on the quay (light spills out)
  const dO = st.doors ?? 0;
  if (dO > 0) for (const d of DOORS) {
    if (d.lv !== 0 || d.house.row !== 0 || !inVB(d.x - 6, d.y - 2, d.x + d.w + 6, d.y + d.h + 4)) continue;
    const u = sm(clamp((dO * 1.15 - d.k * .5) / .2)); if (u <= 0) continue;
    const g = ctx.createLinearGradient(0, d.y, 0, d.y + d.h); g.addColorStop(0, '#ffcf86'); g.addColorStop(1, '#f0a050');
    ctx.save(); winPath(ctx, d.x, d.y, d.w, d.h, d.arch, 0); ctx.clip(); ctx.fillStyle = g; ctx.globalAlpha = u; ctx.fillRect(d.x, d.y, d.w, d.h);
    ctx.globalAlpha = 1; ctx.fillStyle = K('#3a2a2c'); ctx.fillRect(d.x, d.y, d.w * mix(1, .16, u), d.h); ctx.restore();
  }
  // the esteem workshops: fronts lift away, rooms behind
  if ((st.cutaway ?? 0) > 0) for (const hs of HOUSES[2]) { if (hs.workshop == null || !inVB(hs.x - 4, hs.yb - hs.h - 80, hs.x + hs.w + 4, hs.yb + 2)) continue; cutaway(ctx, hs, t, n, st); }
  // the frame on the square
  frameLive(ctx, t, n, st);
  // the garden: the builder may draw it (grandmother)
  if (st.garden && st.garden.draw) { const g = SPECIAL.garden, m = ctx.getTransform(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const sx = m.a * g.x + m.e, sy = m.d * g.y + m.f; ctx.beginPath(); ctx.rect(sx, sy, m.a * g.w, m.d * (g.ground - g.y)); ctx.clip(); st.garden.draw(ctx, sx, sy, m.a * g.w, m.d * (g.ground - g.y), t); ctx.restore(); }
  // halos round lit windows and open doors
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const ga = (.07 + .12 * n) * (1 - .85 * sm(clamp((Z - 1.6) / 4)));
  if (ga > .004) for (let lv = 0; lv < 5; lv++) for (const w of WINDOWS[lv]) {
    if (!inVB(w.x - 10, w.y - 10, w.x + w.w + 10, w.y + w.h + 10)) continue;
    if (ST.inside && ST.inside.level === lv && ST.inside.id === w.id) continue;
    const s = winState(w), aa = s.on * (1 - s.tv) * s.b * ga, at = s.tv * s.f * .8 * ga; if (aa < .006 && at < .006) continue;
    const cx = w.x + w.w / 2, cy = w.y + w.h * .55, rr = Math.max(w.w, w.h) * .95 + 2.5;
    if (aa >= .006) { ctx.globalAlpha = aa; ctx.fillStyle = GC(w, 'hA', ctx, () => { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr); g.addColorStop(0, 'rgba(255,179,92,1)'); g.addColorStop(.45, 'rgba(255,179,92,.35)'); g.addColorStop(1, 'rgba(255,179,92,0)'); return g; }); ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); }
    if (at >= .006) { ctx.globalAlpha = at; ctx.fillStyle = GC(w, 'hT', ctx, () => { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr); g.addColorStop(0, 'rgba(143,230,255,1)'); g.addColorStop(.45, 'rgba(143,230,255,.35)'); g.addColorStop(1, 'rgba(143,230,255,0)'); return g; }); ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); }
  }
  ctx.globalAlpha = 1;
  if (dO > 0) for (const d of DOORS) { if (d.lv !== 0 || d.house.row !== 0) continue; const u = sm(clamp((dO * 1.15 - d.k * .5) / .2)); if (u <= 0 || !inVB(d.x - 14, d.y - 4, d.x + d.w + 14, d.y + d.h + 8)) continue; const cx = d.x + d.w / 2, cy = d.y + d.h, rr = 14; const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr); g.addColorStop(0, `rgba(255,190,110,${(.35 * u).toFixed(3)})`); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); }
  ctx.restore();
  // the quay lamps come on with the first level's lights
  const l0 = (st.lit || [])[0] ?? 0;
  if (l0 > 0) {
    ctx.save();
    for (const L of LAMPS) {
      const on = sm(clamp((l0 * 1.07 - L.th) / .05)); if (on <= .01 || !inVB(L.x - 16, L.y - 16, L.x + 16, 786)) continue;
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = on; ctx.fillStyle = '#fff1d6'; ctx.fillRect(L.x - .75, L.y + .1, 1.5, 1.8);
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1;
      const g = ctx.createRadialGradient(L.x, L.y + 1, 0, L.x, L.y + 1, 13); g.addColorStop(0, `rgba(255,190,110,${(.42 * on).toFixed(3)})`); g.addColorStop(.25, `rgba(255,179,92,${(.16 * on).toFixed(3)})`); g.addColorStop(1, 'rgba(255,179,92,0)');
      ctx.fillStyle = g; ctx.fillRect(L.x - 13, L.y - 12, 26, 26);
      const p = ctx.createRadialGradient(L.x, 784, 0, L.x, 784, 9); p.addColorStop(0, `rgba(255,190,110,${(.22 * on).toFixed(3)})`); p.addColorStop(1, 'rgba(255,190,110,0)');
      ctx.fillStyle = p; ctx.beginPath(); ctx.ellipse(L.x, 784, 9, 1.6, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  // people (standing, sitting, perched; nobody walks)
  const pp = st.people ?? 0;
  if (pp > 0) for (const p of PEOPLE) {
    if (p.door ? !(dO > .3 && pp >= p.th) : pp < p.th + .02) continue;
    if (!inVB(p.x - 12, p.y - 14, p.x + 14, p.y + 3)) continue;
    person(ctx, p, t, n);
  }
  if ((st.summitFigs ?? 0) > 0) SUMMIT_FIGS.forEach((f, i) => { if (st.summitFigs * 3 > i + .02) person(ctx, { ...f, y: HILL.standY, s: .046, hair: 'short', acc: i === 1 ? '#7a5a7a' : null, part: 'coat' }, t, n); });
  // boats on the water
  for (const b of BOATS) { if (!inVB(b[0] - 16, HZ - 30, b[0] + 16, HZ + 12)) continue; boat(ctx, b, t, n, false); }
  // fog creeping up from the water (st.fog), plus the evening haze at the hill's foot
  fogLive(ctx, t, n, st);
  // the inside of a window (push-ins)
  if (st.inside) { const w = WINDOWS[st.inside.level] && WINDOWS[st.inside.level][st.inside.id]; if (w) insideWindow(ctx, t, w, st.inside); }
  // the hill builds itself (c09 → H2): an amber outline, then the terraces rise out of the dark from the bottom up
  if ((st.build ?? 1) < 1) buildLive(ctx, t, n, clamp(st.build));
}
function insideWindow(ctx, t, w, ins) {
  const m = ctx.getTransform(), sx = m.a * w.x + m.e, sy = m.d * w.y + m.f, sw = m.a * w.w, sh = m.d * w.h;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip(); ins.draw(ctx, sx, sy, sw, sh, t); ctx.restore();
}
// rooms of the esteem workshops (hillRooms(2)): the ground floor is the workshop, the floor above a room
for (const hs of HOUSES[2]) {
  if (hs.workshop == null) continue;
  const sH = LVP[2].sH, fl = hs.storeys || 2;
  for (let j = 0; j < fl; j++) ROOMS[2].push({ id: ROOMS[2].length, house: hs, floor: j, x: hs.x + 1.2 * hs.cs, y: hs.yb - (j + 1) * sH + (j ? .8 : 1.2), w: hs.w - 2.4 * hs.cs, h: sH - (j ? 1.8 : 1.6) });
}
function cutaway(ctx, hs, t, n, st) {
  const u = cutU(hs); if (u <= 0) return;
  const top = hs.yb - hs.h, lift = sm(u) * (hs.h + 70);
  // the rooms behind the front: warm plaster, beams, a lamp; the builder can draw each room (st.room)
  for (const rm of ROOMS[2]) {
    if (rm.house !== hs) continue;
    const { x, y, w, h } = rm;
    ctx.fillStyle = vgrad(ctx, y, y + h, [[0, '#6a4a3a'], [1, '#3a2a28']]); ctx.fillRect(x - .2, y - .2, w + .4, h + .4);
    ctx.fillStyle = 'rgba(255,190,120,.35)'; ctx.fillRect(x + w * .12, y + h * .12, w * .76, h * .7);
    const g = ctx.createRadialGradient(x + w / 2, y + h * .3, 0, x + w / 2, y + h * .3, w * .7); g.addColorStop(0, 'rgba(255,214,150,.6)'); g.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = K('#2a1e1e', .8); for (let i = 0; i < 5; i++) ctx.fillRect(x + w * (i + .5) / 5 - .3, y, .6, 1.1);
    ctx.fillStyle = K('#2a1e1e', .6); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * .12, y + h * .12); ctx.lineTo(x + w * .12, y + h * .82); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w * .88, y + h * .12); ctx.lineTo(x + w * .88, y + h * .82); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = K('#4a3430'); ctx.fillRect(x, y + h * .82, w, h * .18);
    if (st.room) { const m = ctx.getTransform(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const sx = m.a * x + m.e, sy = m.d * y + m.f; ctx.beginPath(); ctx.rect(sx, sy, m.a * w, m.d * h); ctx.clip(); st.room(ctx, rm, sx, sy, m.a * w, m.d * h, t); ctx.restore(); }
  }
  // the walls between the rooms (floor slabs) stay
  ctx.fillStyle = K(shadeH(hs.col, -.2)); for (let j = 1; j < (hs.storeys || 2); j++) ctx.fillRect(hs.x, hs.yb - j * LVP[2].sH - .4, hs.w, 1.2);
  ctx.fillRect(hs.x - .2, top, 1.2 * hs.cs, hs.h); ctx.fillRect(hs.x + hs.w - 1.2 * hs.cs + .2, top, 1.2 * hs.cs, hs.h);
  // the front, lifting away
  if (u < 1) { const pv = PASS; PASS = 'vector'; ctx.save(); ctx.translate(0, -lift); ctx.beginPath(); ctx.rect(hs.x - 3, top - 2, hs.w + 6, hs.h + 2.2); ctx.clip(); houseBody(ctx, hs); for (const w of hs.wins) { winBack(ctx, w, hs); glassUnlit(ctx, w); } strokeLouvres(ctx); for (const w of hs.wins) winFront(ctx, w, hs); for (const d of hs.doors) drawDoor(ctx, d, hs); ctx.restore(); PASS = pv; }
  // the balustrade in front stays
  parapet(ctx, 2, hs.x - .5, hs.x + hs.w + .5, 'balustrade');
}
function frameLive(ctx, t, n, st) {
  const F = SPECIAL.frame; if (!inVB(F.x - 4, F.y - 6, F.x + F.w + 4, F.y + F.h + 4)) return;
  const fr = st.frame || {}, lit = clamp(fr.lit ?? 0);
  if (fr.draw) { const m = ctx.getTransform(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const sx = m.a * F.x + m.e, sy = m.d * F.y + m.f; ctx.beginPath(); ctx.rect(sx, sy, m.a * F.w, m.d * F.h); ctx.clip(); fr.draw(ctx, sx, sy, m.a * F.w, m.d * F.h, t); ctx.restore(); }
  else if (lit > 0) { // a lit poster: warm paper, engraved lines
    ctx.save(); ctx.globalAlpha = lit; const g = ctx.createLinearGradient(0, F.y, 0, F.y + F.h); g.addColorStop(0, '#fff1d6'); g.addColorStop(1, '#f2c88a'); ctx.fillStyle = g; ctx.fillRect(F.x, F.y, F.w, F.h);
    ctx.strokeStyle = 'rgba(122,59,23,.35)'; ctx.lineWidth = lw(.6); ctx.beginPath(); for (let i = 0; i < 12; i++) { const yy = F.y + 3 + i * 1.5; ctx.moveTo(F.x + 1.5, yy); ctx.lineTo(F.x + F.w - 1.5 - (i % 3) * 2, yy); } ctx.stroke(); ctx.restore();
  }
  if (lit > 0 || fr.draw) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cx = F.x + F.w / 2, cy = F.y + F.h / 2, rr = F.h; const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr); g.addColorStop(0, `rgba(255,190,120,${(.12 * Math.max(lit, fr.draw ? .6 : 0)).toFixed(3)})`); g.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = g; ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); ctx.restore(); }
}
function fogLive(ctx, t, n, st) {
  const f = clamp(st.fog ?? 0), col = mixH('#c8a8c0', '#6a88b0', n);
  // ambient haze over the water at the foot of the hill (always)
  const hz = ctx.createLinearGradient(0, HZ - 26, 0, HZ + 6); hz.addColorStop(0, rgba(col, 0)); hz.addColorStop(1, rgba(col, .16 + .1 * (1 - n))); ctx.fillStyle = hz; ctx.fillRect(VB[0], HZ - 26, VB[2] - VB[0], 32);
  if (f <= 0) return;
  for (let k = 0; k < 6; k++) {
    const yb = HZ + 8 - k * 14 * f, hgt = 18 + 10 * f, a = (.34 - k * .04) * f; if (a <= 0) continue;
    const g = ctx.createLinearGradient(0, yb - hgt, 0, yb); g.addColorStop(0, rgba(col, 0)); g.addColorStop(.6, rgba(col, a)); g.addColorStop(1, rgba(col, a * .6));
    ctx.fillStyle = g;
    for (let i = 0; i < 9; i++) { const cx = 150 + i * 200 + 60 * Math.sin(t * .07 + k + i * 1.3) + t * (3 + k), w = 160 + 60 * hash(i + k * 7); ctx.beginPath(); ctx.ellipse(((cx - 100) % 1900 + 1900) % 1900 + 60, yb - hgt * .4, w, hgt * .6, 0, 0, TAU); ctx.fill(); }
  }
}
function buildLive(ctx, t, n, b) {
  // the reveal front rises from the quay to the summit; above it the hill is still dark (opaque ink, not transparent)
  const ue = clamp((b - .35) / .65), yf = mix(812, 186, ue), soft = 46;
  ctx.save(); polyP(ctx, OUTLINE); ctx.clip();
  const g = ctx.createLinearGradient(0, yf - soft, 0, yf + soft * .2); g.addColorStop(0, 'rgba(7,8,24,1)'); g.addColorStop(1, 'rgba(7,8,24,0)');
  ctx.fillStyle = 'rgb(7,8,24)'; ctx.fillRect(VB[0], VB[1], VB[2] - VB[0], yf - soft - VB[1]);
  ctx.fillStyle = g; ctx.fillRect(VB[0], yf - soft, VB[2] - VB[0], soft * 1.2);
  ctx.restore();
  // its reflection: dark water where the hill is still dark (the mirrored front moves down from the water line)
  if (VB[3] > HZ) {
    ctx.save(); ctx.beginPath(); ctx.rect(VB[0], HZ, VB[2] - VB[0], VB[3] - HZ + 10); ctx.clip();
    ctx.translate(0, 2 * HZ); ctx.scale(1, -1); polyP(ctx, OUTLINE); ctx.clip();
    const gm = ctx.createLinearGradient(0, yf - soft, 0, yf + soft * .2); gm.addColorStop(0, 'rgba(8,9,26,.94)'); gm.addColorStop(1, 'rgba(8,9,26,0)');
    ctx.fillStyle = 'rgba(8,9,26,.94)'; ctx.fillRect(VB[0], -4000, VB[2] - VB[0], yf - soft + 4000);
    ctx.fillStyle = gm; ctx.fillRect(VB[0], yf - soft, VB[2] - VB[0], soft * 1.2);
    ctx.restore();
  }
  // the amber line: draws itself along the silhouette, then cools into the hill's rim as the terraces fill
  const uo = clamp(b / .35), N = Math.max(2, Math.floor(OUTLINE.length * uo)), cool = clamp((b - .5) / .5);
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const [wd, al] of [[10, .08], [4.5, .2], [1.8, .9]]) {
    ctx.strokeStyle = rgba(mixH('#ffb35c', '#8a7aa8', cool), al * (1 - cool * .85)); ctx.lineWidth = wd / Z * (wd > 2 ? 1 : 1.4);
    ctx.beginPath(); for (let i = 0; i < N; i++) i ? ctx.lineTo(OUTLINE[i][0], OUTLINE[i][1]) : ctx.moveTo(OUTLINE[i][0], OUTLINE[i][1]); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- labels and title (screen space)
function labels(ctx, t, cam, st) {
  const la = st.labels ?? 0, z = cam.z;
  if (la > 0) {
    const zf = 1 - sm(lin(2.2, 3.2, z)), foc = Array.isArray(st.focus) ? st.focus : [st.focus ?? -1];
    const swl = st.sweep ? (Array.isArray(st.sweep.level) ? st.sweep.level : [st.sweep.level]) : [];
    const items = [];
    for (let lv = 0; lv < 5; lv++) {
      const L = LV[lv], isF = foc.includes(lv), size = isF ? mix(34, 58, sm(clamp(st.focusU ?? 0))) : 34;
      let ax, ay, ly;
      if (lv === 0) { [ax, ay] = toScreen(cam, 1586, 776); ly = toScreen(cam, 0, 838)[1]; }
      else { const ym = mix(L.y0, L.y1, .45); [ax, ay] = toScreen(cam, CX + hwAt(lv, ym) - 22, ym); ly = ay + size * .3; }
      // a label belongs to its terrace: when the terrace leaves the frame its label un-writes
      const vis = sm(clamp((ay - 30) / 70)) * sm(clamp((1000 - ay) / 90)) * sm(clamp((1880 - ax) / 80)) * sm(clamp((ax + 40) / 80));
      // while the hill builds itself (st.build) a label waits for its terrace to come out of the dark
      const bu = st.build ?? 1, yf = bu < 1 ? mix(812, 186, clamp((bu - .35) / .65)) : -1e9, rv = clamp((L.y0 - yf) / (L.y0 - L.y1));
      items.push({ lv, L, isF, size, ax, ay, ly, u: clamp(la * 1.25 - lv * .06) * (isF ? 1 : zf) * vis * rv });
    }
    // stacked bottom-up inside [70 + size·.7, 905], at least a line apart (the gap shrinks with the lower label, so nothing jumps)
    let prev = null;
    for (const it of items) {
      it.ly = clamp(it.ly, 70 + it.size * .7, 905);
      if (prev) it.ly = Math.min(it.ly, prev.ly - (prev.size * .9 + 8) * clamp(prev.u * 4));
      it.ly = Math.max(it.ly, 70 + it.size * .7); prev = it;
    }
    for (const it of items) {
      const { lv, L, isF, size, ax, ay, ly, u } = it; if (u <= .01) continue;
      ctx.save(); ctx.font = `400 ${size}px "Instrument Serif"`; const tw = ctx.measureText(L.label).width;
      const lx = Math.min(HILL.labelX, 1840 - tw);
      const on = Math.max((st.lit || [])[lv] ?? 0, swl.includes(lv) ? st.sweep.u : 0) > .5, amber = isF && (st.focusU ?? 0) > 0;
      // the leader runs from the terrace to the near end of the label (never through the text)
      const ex = ax > lx + tw * .5 ? lx + tw + 12 : lx - 14, ey = ly - size * .3, lu = clamp(u / .35), tu = clamp((u - .25) / .75);
      ctx.strokeStyle = rgba(amber ? '#ffb35c' : on ? '#e8dcc0' : '#a49fc4', .7); ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(mix(ax, ex, lu), mix(ay, ey, lu)); ctx.stroke();
      ctx.fillStyle = rgba(amber ? '#ffb35c' : on ? '#f3efe2' : '#a49fc4', .9 * lu); ctx.beginPath(); ctx.arc(ax, ay, 2.4, 0, TAU); ctx.fill();
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

// ---------------------------------------------------------------- build (or load) the cache when this process will draw the hill
{
  const env = process.env, secs = (env.SECS || '').split(',').filter(Boolean).map((s) => (/^\d+$/.test(s) ? 'c' + s.padStart(2, '0') : s));
  const HILLSECS = ['c05', 'c06', 'c09', 'c10', 'c11', 'c12', 'c14', 'c15'];
  const want = env.HILL_CACHE != null && env.HILL_CACHE !== '' ? env.HILL_CACHE === '1' : (!secs.length || secs.some((s) => HILLSECS.includes(s)));
  if (want) { try { await buildCache(); } catch (e) { CACHE.ok = false; console.error('[hill] cache failed, drawing vectors:', e && e.message); } }
}
export const __DBG = { STATIC, HOUSES, WINDOWS, CACHE, set: (o) => { if ('Z' in o) Z = o.Z; if ('VB' in o) VB = o.VB; if ('PASS' in o) PASS = o.PASS; if ('ST' in o) ST = o.ST; if ('n' in o) setN(o.n); } };
