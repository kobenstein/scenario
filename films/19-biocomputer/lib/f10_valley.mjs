// Film 10 kit, the ONE world: the valley (MOTION.md §2). Everything in metres (x right/east→west in screen terms, y up, z north into the
// valley). The atlas of MOTION.md §2.2 is a panorama seen from the road; VAL below is the same map in metres (see VAL.atlas for the link).
//   valley(ctx, t, V, L, o) draws sky, sun, ridges, the far hill, slope, floor, fields, river, roads, mist and all upright things
//   (trees, hall, house, workshops, vineyard, datacenter, tower, barriers, bunting, signpost, crowd, o.items) sorted by depth.
import { W, H, rgba, clamp, lin, mix, prng, PAL, mixHex, shadeHex, noise1, sprite, expoOut, sineS, toWorldFn, toLocalFn, heroLight } from './f10_core.mjs';
import { createCanvas, loadImage } from '@napi-rs/canvas';

// ---------------------------------------------------------------- the map (metres)
const RX = (x) => 300 + 8 * Math.sin(x / 80) + 14 * Math.sin(x / 230 + 1.3);       // river centre line z(x)
const ROADZ = (x) => 95 + 5 * Math.sin(x / 120);                                     // main road centre z(x) on the valley floor
export const VAL = {
  roadW: 7, startX: -130, forkX: 40,
  river: { z: RX, w: 16 },
  hall: { x0: -14, x1: 14, z0: 214, z1: 274, eave: 9, ridge: 13.2, teeth: 4, rot: .62, piv: [0, 0, 214] },  // LOCAL coords (turned by rot about piv): the gable front at z0 faces the road, the long axis is the depth
  house: { x0: 144, x1: 157, z0: 341, z1: 350 },   // on the hall's axis, up the slope behind it (one line of sight from the road)
  shed: { x0: 160, x1: 165, z0: 342, z1: 347 },
  garden: { x0: 137, x1: 165, z0: 328, z1: 341, gate: [151, 328] },
  houseTree: [134, 335],
  workshops: [[190, 238, 26, 16], [222, 240, 18, 22], [246, 236, 30, 18], [284, 242, 22, 14], [314, 236, 26, 20], [348, 244, 20, 16]],   // [x, z, w, d]
  vineyard: { x0: 300, x1: 700, z0: 440, z1: 820 },
  datacenter: { x: 720, z: 520, w: 110, d: 46 },
  farHill: { x: 1900, z: 2600, w: 700, h: 250 },
  tower: { x: 1500, z: 4200, h: 165 },
  signpost: [47, 101.5],
  crowdSpot: [-40, 160],
  // MOTION.md atlas (px, 7680 × 2160) ↔ metres: a reference camera at (0, 36 m, 0) looking north, focal 2000 atlas px, horizon y 900
  atlas: (ax, ay) => { const z = 2000 * 36 / Math.max(1, ay - 900); return [(ax - 3840) * z / 2000, 0, z]; },
};
VAL.roadZ = ROADZ;
VAL.hallWorld = toWorldFn(VAL.hall.rot, VAL.hall.piv); VAL.hallLocal = toLocalFn(VAL.hall.rot, VAL.hall.piv);
{ const g = VAL.hallWorld([0, 0, 207]); VAL.hallGate = [g[0], g[2]]; }
// main road: along the valley floor from far east, past the start line and the fork, then north up the slope and over the crest
VAL.road = (() => { const p = []; for (let x = -1400; x <= 400; x += 10) p.push([x, ROADZ(x)]); for (const q of [[425, 108], [450, 128], [470, 160], [488, 205], [500, 260], [510, 300], [522, 345], [545, 420], [575, 520], [610, 640], [650, 780], [700, 950], [760, 1150], [830, 1380], [900, 1600], [960, 1800]]) p.push(q); return p; })();
VAL.branchHall = [[VAL.forkX, ROADZ(VAL.forkX) + 2], [30, 130], [14, 165], [mix(8, VAL.hallGate[0], .5), mix(190, VAL.hallGate[1], .5)], VAL.hallGate];
VAL.branchHouse = [[VAL.forkX, ROADZ(VAL.forkX) + 2], [58, 135], [76, 180], [88, 230], [104, 270], [128, 300], [151, 328]];
// terrain height: flat floor to z 300, the north slope up to the crest (z ≈ 1600, ~95 m), a gentle bank on the camera side
export function hgt(x, z) {
  let y = 0;
  if (z > 310) { const u = clamp((z - 310) / 1290); y = 95 * (u * u * (3 - 2 * u)) * (1 + .18 * noise1(x / 260, 3)) + 6 * noise1(x / 90 + z / 140, 5) * clamp((z - 330) / 200); }
  if (z < 30) y += Math.min(14, (30 - z) * .12) * (1 + .3 * noise1(x / 200, 9));
  return y;
}
VAL.hgt = hgt;
VAL.ground = (x, z) => [x, hgt(x, z), z];

// ---------------------------------------------------------------- caches (converted to Image once: the napi canvas leaks on drawImage(Canvas))
let MIST = null, MISTC = null;
function mistCanvas() {
  const w = 1024, h = 160, c = createCanvas(w, h), x = c.getContext('2d'), r = prng(71);
  for (let i = 0; i < 260; i++) {
    const cx = r() * w, cy = h * (.35 + .3 * r()), rx = 40 + r() * 160, ry = 10 + r() * 26, g = x.createRadialGradient(cx, cy, 0, cx, cy, rx);
    g.addColorStop(0, `rgba(255,255,255,${.06 + r() * .08})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.save(); x.translate(cx, cy); x.scale(1, ry / rx); x.translate(-cx, -cy); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, rx, 0, 7); x.fill(); x.restore();
  }
  // wrap the left/right edges so the strip tiles
  return c;
}
export async function prepareValley() {
  if (!MIST) { MISTC = mistCanvas(); MIST = await loadImage(MISTC.toBuffer('image/png')); }
}

// ---------------------------------------------------------------- deterministic world contents
const TREES = (() => {
  const r = prng(907), out = [];
  const add = (x, z, h, kind = 'round') => { if (inRoad(x, z, 6) || inHall(x, z, 6) || inHouse(x, z)) return; out.push({ x, z, h, kind, seed: Math.floor(r() * 1e6), cr: h * (kind === 'poplar' ? .2 : .36) * (.85 + .3 * r()) }); };
  for (let x = -1600; x < 1600; x += 18 + r() * 26) { const z = RX(x); add(x, z - 14 - r() * 6, 9 + r() * 7, r() < .3 ? 'poplar' : 'round'); if (r() < .7) add(x + 9 * r(), z + 13 + r() * 6, 8 + r() * 7); }
  for (let i = 0; i < 70; i++) { const x = -1400 + r() * 2900, z = 330 + r() * 900; if (x > 290 && x < 710 && z > 430 && z < 830) continue; add(x, z, 7 + r() * 8, r() < .2 ? 'poplar' : 'round'); }
  for (let i = 0; i < 14; i++) add(175 + r() * 130, 365 + r() * 60, 6 + r() * 4);           // orchard below the house
  for (let x = -1300; x < 380; x += 34 + r() * 50) { if (Math.abs(x - VAL.forkX) < 26 || Math.abs(x - VAL.startX) < 30) continue; add(x, ROADZ(x) - 9 - r() * 4, 8 + r() * 5); }   // the road's tree line (south side)
  for (let i = 0; i < 26; i++) add(-900 + r() * 1700, 130 + r() * 150, 7 + r() * 7);       // field trees between road and river
  for (let i = 0; i < 20; i++) add(-1000 + r() * 2000, 10 + r() * 60, 7 + r() * 6);          // camera-side hedges
  out.push({ x: VAL.houseTree[0], z: VAL.houseTree[1], h: 11, kind: 'round', seed: 77, cr: 4.4, houseTree: true });
  return out;
})();
function inRoad(x, z, m = 0) { if (x < 400 && Math.abs(z - ROADZ(x)) < VAL.roadW / 2 + m) return true; for (const b of [VAL.branchHall, VAL.branchHouse]) for (const p of b) if (Math.hypot(p[0] - x, p[1] - z) < 4 + m) return true; return false; }
function inHall(x, z, m = 0) { const h = VAL.hall, q = VAL.hallLocal([x, 0, z]); return q[0] > h.x0 - m && q[0] < h.x1 + m && q[2] > h.z0 - m - 8 && q[2] < h.z1 + m; }
function inHouse(x, z) { const g = VAL.garden; return x > g.x0 - 3 && x < VAL.shed.x1 + 3 && z > g.z0 - 2 && z < VAL.house.z1 + 4; }
VAL.trees = TREES;

const FIELDS = (() => {
  const r = prng(5150), out = [], cols = ['#b4c07e', '#c9c58e', '#d8c792', '#a9b878', '#c2b77c', '#dccf9c', '#b9b27a', '#9fb27a'];
  const band = (z0, z1, x0, x1) => {
    for (let x = x0; x < x1;) {
      const w = 50 + r() * 70; let z = z0;
      while (z < z1) {
        const d = Math.min(z1 - z, 30 + r() * 50), cx = x + w / 2, cz = z + d / 2;
        if (!inHall(cx, cz, 4) && !inHouse(cx, cz)) out.push({ q: [[x + 1.5, z + 1.5], [x + w - 1.5, z + 1.5], [x + w - 1.5, z + d - 1.5], [x + 1.5, z + d - 1.5]], col: cols[Math.floor(r() * cols.length)], furrow: r() < .45 ? (r() < .5 ? 0 : 1) : -1, seed: Math.floor(r() * 1e5) });
        z += d;
      }
      x += w;
    }
  };
  band(14, ROADZ(0) - 6, -1500, 1500);
  band(103, 206, -1500, 380);
  band(206, 288, -1500, -20); band(206, 288, 20, 180);
  band(330, 430, -1400, 280); band(440, 1100, -1400, 290); band(840, 1300, 290, 1500); band(330, 430, 360, 1500); band(440, 840, 720, 1500);
  return out;
})();
VAL.fields = FIELDS;

// ---------------------------------------------------------------- drawing helpers
const fillPoly = (ctx, V, pts, col) => { if (V.poly(ctx, pts)) { ctx.fillStyle = col; ctx.fill(); return true; } return false; };
// a band polygon of width w along a polyline in xz (at terrain height + lift)
export function band3(pts2, w, lift = .03, w2 = null) {
  const L = [], R = [];
  for (let i = 0; i < pts2.length; i++) {
    const a = pts2[Math.max(0, i - 1)], b = pts2[Math.min(pts2.length - 1, i + 1)], dx = b[0] - a[0], dz = b[1] - a[1], n = Math.hypot(dx, dz) || 1, ww = (w2 ? mix(w, w2, i / (pts2.length - 1)) : w) / 2;
    const nx = -dz / n * ww, nz = dx / n * ww, p = pts2[i];
    L.push([p[0] + nx, hgt(p[0] + nx, p[1] + nz) + lift, p[1] + nz]); R.push([p[0] - nx, hgt(p[0] - nx, p[1] - nz) + lift, p[1] - nz]);
  }
  return { L, R, poly: [...L, ...R.reverse()] };
}
// visible part of a long polyline: only the points within `far` m of the camera and not far behind it (keeps the clip cheap)
function nearPts(V, pts2, far = 4000) { const c = V.cam; return pts2.filter((p) => Math.hypot(p[0] - c.x, p[1] - c.z) < far); }

// ---------------------------------------------------------------- sky, sun, ridges
export function skyAndSun(ctx, t, V, L, o = {}) {
  const hy = V.horizonY();
  const g = ctx.createLinearGradient(0, hy - 1100, 0, hy + 40);
  g.addColorStop(0, L.sky[0]); g.addColorStop(.72, mixHex(L.sky[0], L.sky[1], .55)); g.addColorStop(1, L.sky[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // thin high cloud bands (stratus), slow
  const r = prng(31); ctx.save();
  for (let i = 0; i < 9; i++) {
    const az = (r() - .5) * 2.4, el = .05 + r() * .22, p = V.dirPt([Math.sin(az + t * .0006), Math.tan(el), Math.cos(az + t * .0006)]); if (!p) continue;
    const w = 260 + r() * 520, h = 7 + r() * 12;
    const cg = ctx.createLinearGradient(p.x - w, 0, p.x + w, 0); const cc = mixHex(L.sky[1], '#ffffff', .55);
    cg.addColorStop(0, rgba(cc, 0)); cg.addColorStop(.5, rgba(cc, .38)); cg.addColorStop(1, rgba(cc, 0));
    ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(p.x, p.y, w, h, 0, 0, 7); ctx.fill();
  }
  ctx.restore();
  // stars and dust at night (Stauffer: tiny, uneven, a few brighter ones), fixed to the sky so they drift with the camera
  if (L.stars > 0) {
    const rs = prng(97); ctx.save();
    for (let i = 0; i < 420; i++) {
      const az = (rs() - .5) * 3.4, el = Math.pow(rs(), .7) * .9 + .01, big = rs() < .06, tw = .75 + .25 * Math.sin(t * (.6 + rs()) + i);
      const p = V.dirPt([Math.sin(az), Math.tan(el), Math.cos(az)]); if (!p || p.y > hy - 6) continue;
      ctx.fillStyle = rgba(big ? '#fff4de' : '#cfd8f6', L.stars * tw * (big ? .95 : .55)); ctx.beginPath(); ctx.arc(p.x, p.y, big ? 1.9 : .9 + rs() * .6, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  // the sun: THE hero light near the horizon: a large flat disc with a long grained falloff (thumbnail style), brightest thing in frame
  const s = V.dirPt(L.dir);
  if (s && s.x > -1200 && s.x < W + 1200 && s.y > -1200 && s.y < H + 1200) {
    const k = clamp((L.el + 6) / 10) * (o.sunA ?? 1), R = 118;
    if (k > .05) heroLight({ x: s.x, y: s.y, r: 560, k, cone: .95, coneLen: 900, coneW: .55 });
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    let gg = ctx.createRadialGradient(s.x, s.y, R * .6, s.x, s.y, 1100);
    gg.addColorStop(0, rgba(L.sunCol, .95 * k)); gg.addColorStop(.1, rgba(L.sunCol, .6 * k)); gg.addColorStop(.3, rgba(L.sunCol, .22 * k)); gg.addColorStop(.6, rgba(L.sunCol, .06 * k)); gg.addColorStop(1, rgba(L.sunCol, 0));
    ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H);
    ctx.restore();
    if (L.el > -1.5) {
      gg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, R);
      gg.addColorStop(0, rgba('#fff3cf', k)); gg.addColorStop(.7, rgba('#ffe2a0', k)); gg.addColorStop(.92, rgba('#ffc46e', k)); gg.addColorStop(1, rgba(L.sunCol, 0));
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(s.x, s.y, R, 0, 7); ctx.fill();
    }
  }
  return { hy, sun: s };
}
const RIDGES = [
  { z: 5200, h: 430, a: 140, sc: 900, seed: 1, col: '#a9b4c6' },
  { z: 3900, h: 330, a: 120, sc: 700, seed: 2, col: '#a3b2b8' },
  { z: 3000, h: 250, a: 90, sc: 520, seed: 3, col: '#9fb2a6' },
  { z: 2250, h: 170, a: 70, sc: 420, seed: 4, col: '#9cb293' },
];
const ridgeY = (R, x) => R.h + R.a * (.6 * noise1(x / R.sc, R.seed) + .3 * noise1(x / R.sc * 2.3, R.seed + 7) + .1 * noise1(x / R.sc * 6, R.seed + 11)) + 260 * clamp((-x - 300) / 2400) * (R.z < 4000 ? 1 : .6);
function ridges(ctx, t, V, L, o) {
  const c = V.cam;
  for (const R of RIDGES) {
    const pts = []; for (let x = c.x - 9000; x <= c.x + 9000; x += 90) pts.push([x, ridgeY(R, x), R.z]);
    const poly = [...pts, [c.x + 9000, -400, R.z], [c.x - 9000, -400, R.z]];
    const d = R.z - c.z, base = L.air(L.lit(R.col, .55), d, 1.6);
    const S = V.poly(ctx, poly); if (!S) continue;
    let ys = S.map((p) => p.y).filter(isFinite), y0 = Math.min(...ys), y1 = Math.max(H, ...ys) ;
    const g = ctx.createLinearGradient(0, y0, 0, Math.min(y1, y0 + 500));
    g.addColorStop(0, base); g.addColorStop(1, mixHex(base, L.fog, .45)); ctx.fillStyle = g; ctx.fill();
    // a fine rim of light on the crest (back light) and engraved slope lines
    ctx.save(); ctx.beginPath(); V.line(ctx, pts); ctx.strokeStyle = rgba(L.rim, .35 + .25 * L.warm); ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
    if (R.z === 2250) farHill(ctx, t, V, L, o);
  }
}
// the far hill with the pale stepped scar (later the mine; o.mine 0..1 grows the steps, o.green 0..1 greens their rims)
function farHill(ctx, t, V, L, o) {
  const F = VAL.farHill, mine = o.mine ?? 0, pts = [];
  for (let i = 0; i <= 40; i++) { const u = i / 40, x = F.x - F.w + 2 * F.w * u; pts.push([x, F.h * Math.pow(Math.sin(Math.PI * u), .8) * (1 + .06 * noise1(u * 9, 4)) + 120, F.z]); }
  const d = F.z - V.cam.z;
  if (!V.poly(ctx, [...pts, [F.x + F.w, -200, F.z], [F.x - F.w, -200, F.z]])) return;
  ctx.fillStyle = L.air(L.lit('#93ad84', .6), d, 1.6); ctx.fill();
  ctx.beginPath(); V.line(ctx, pts); ctx.strokeStyle = rgba(L.rim, .4); ctx.lineWidth = 1.4; ctx.stroke();
  // the scar: terraces cut into the right flank (pale soil); c01: four thin pale steps
  const n = 4 + Math.round(4 * mine), wide = .22 + .2 * mine;
  for (let k = 0; k < n; k++) {
    const yA = 120 + F.h * (.78 - k * .1), yB = yA - F.h * .045, xa = F.x + F.w * (.05 - wide * (1 - k / n) * .5), xb = F.x + F.w * (.12 + wide * (1 - k / (n * 1.4)));
    const col = L.air(mixHex('#e2cfa6', PAL.soil, .25 + .4 * mine), d, 1.6);
    fillPoly(ctx, V, [[xa, yA, F.z - 2], [xb, yA, F.z - 2], [xb + 8, yB, F.z - 2], [xa - 8, yB, F.z - 2]], col);
    fillPoly(ctx, V, [[xa - 8, yB, F.z - 2], [xb + 8, yB, F.z - 2], [xb + 8, yB - F.h * .012, F.z - 2], [xa - 8, yB - F.h * .012, F.z - 2]], L.air(shadeHex(col, -.12), d, 1.6));
  }
}
function tower(ctx, t, V, L) {
  const T = VAL.tower, w = 14, d = T.z - V.cam.z;
  const face = [[T.x - w, 0, T.z], [T.x + w, 0, T.z], [T.x + w * .7, T.h, T.z], [T.x - w * .7, T.h, T.z]];
  if (!V.poly(ctx, face)) return;
  ctx.fillStyle = L.air('#9fb6cf', d, 1.2); ctx.fill();
  const s = V.P([T.x + w * .3, T.h * .7, T.z]); if (s.z > 0) { ctx.fillStyle = rgba(PAL.traceColdCore, .5); ctx.fillRect(s.x - .6, s.y - 8, 1.2, 16); }
}

// ---------------------------------------------------------------- terrain, fields, river, roads
function terrain(ctx, t, V, L, o) {
  const c = V.cam, x0 = c.x - 4000, x1 = c.x + 4000, step = 160;
  // the slope, back to front (z 1700 → 310) in strips
  const ZS = []; for (let z = 1700; z >= 310; z -= z > 700 ? 70 : 40) ZS.push(z);
  for (let i = 0; i + 1 < ZS.length; i++) {
    const za = ZS[i], zb = ZS[i + 1]; if (zb < c.z - 50 && za < c.z - 50) continue;
    const A = [], B = []; for (let x = x0; x <= x1; x += step) { A.push([x, hgt(x, za), za]); B.push([x, hgt(x, zb) - (i + 2 === ZS.length ? 2 : 0), zb]); }
    const d = (za + zb) / 2 - c.z, u = (za - 310) / 1390;
    const col = L.air(L.lit(mixHex('#b3c283', '#97ad78', u), .7 + .2 * (1 - u)), Math.abs(d), 1);
    fillPoly(ctx, V, [...A, ...B.reverse()], col);
  }
  // the floor (y = 0), back to front
  const FZ = [330, 290, 250, 210, 170, 130, 95, 60, 25, -20, -80, -200];
  for (let i = 0; i + 1 < FZ.length; i++) {
    const za = FZ[i], zb = FZ[i + 1], d = Math.abs((za + zb) / 2 - c.z);
    const col = L.air(L.lit(i < 3 ? '#b4c086' : '#bcc28a', .78), d, .9);
    fillPoly(ctx, V, [[x0, za < 30 ? hgt(0, za) : 0, za], [x1, za < 30 ? hgt(0, za) : 0, za], [x1, zb < 30 ? hgt(0, zb) : 0, zb], [x0, zb < 30 ? hgt(0, zb) : 0, zb]], col);
  }
}
function fields(ctx, t, V, L, o) {
  const c = V.cam;
  for (const F of FIELDS) {
    const cx = (F.q[0][0] + F.q[2][0]) / 2, cz = (F.q[0][1] + F.q[2][1]) / 2, d = Math.hypot(cx - c.x, cz - c.z);
    if (d > 4200) continue;
    const q3 = F.q.map(([x, z]) => [x, hgt(x, z) + .05, z]);
    const S = V.poly(ctx, q3); if (!S) continue;
    const col = L.air(L.lit(F.col, .8), d, .8); ctx.fillStyle = col; ctx.fill();
    // hedge line around the field (engraved)
    ctx.strokeStyle = rgba(L.air('#5f7a48', d, .8), .7); ctx.lineWidth = clamp(1.4 * 1700 / Math.max(60, d) * .25, .6, 3); ctx.stroke();
    // furrows when the field is big on screen
    if (F.furrow >= 0) {
      const xs = S.map((p) => p.x), ys = S.map((p) => p.y), sz = Math.max(...xs) - Math.min(...xs) + Math.max(...ys) - Math.min(...ys);
      if (sz > 60) {
        const n = Math.min(18, Math.floor(sz / 14)); ctx.save(); ctx.clip(); ctx.beginPath();
        for (let k = 1; k < n; k++) {
          const u = k / n;
          if (F.furrow === 0) V.seg(ctx, [mix(F.q[0][0], F.q[1][0], u), 0, F.q[0][1]].map((v, j) => (j === 1 ? hgt(mix(F.q[0][0], F.q[1][0], u), F.q[0][1]) + .06 : v)), [mix(F.q[3][0], F.q[2][0], u), hgt(mix(F.q[3][0], F.q[2][0], u), F.q[3][1]) + .06, F.q[3][1]]);
          else V.seg(ctx, [F.q[0][0], hgt(F.q[0][0], mix(F.q[0][1], F.q[3][1], u)) + .06, mix(F.q[0][1], F.q[3][1], u)], [F.q[1][0], hgt(F.q[1][0], mix(F.q[1][1], F.q[2][1], u)) + .06, mix(F.q[1][1], F.q[2][1], u)]);
        }
        ctx.strokeStyle = rgba(shadeHex(col, -.12), .5); ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
      }
    }
  }
}
function river(ctx, t, V, L, o) {
  const c = V.cam, pts = []; for (let x = c.x - 3500; x <= c.x + 3500; x += 20) pts.push([x, RX(x)]);
  const B = band3(pts, VAL.river.w, .02);
  // banks
  const B2 = band3(pts, VAL.river.w + 5, .01);
  fillPoly(ctx, V, B2.poly, L.air(L.lit('#8fa36e', .6), Math.abs(300 - c.z), 1.4));
  const S = V.poly(ctx, B.poly); if (!S) return;
  const ys = S.map((p) => p.y).filter(isFinite), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const g = ctx.createLinearGradient(0, y0, 0, y1 + 1);
  g.addColorStop(0, L.air(mixHex(L.sky[1], '#ffffff', .3), 600, 1.4)); g.addColorStop(1, mixHex(L.sky[0], PAL.water, .5)); ctx.fillStyle = g; ctx.fill();
  // glints: short bright dashes on the water towards the sun
  ctx.save(); ctx.clip(); const r = prng(13); ctx.strokeStyle = rgba('#fffaf0', .55); ctx.lineWidth = 1.4; ctx.beginPath();
  for (let i = 0; i < 160; i++) { const x = c.x - 900 + r() * 1800, z = RX(x) + (r() - .5) * VAL.river.w * .8, ph = Math.sin(t * (1 + r()) + i); if (ph < .4) continue; V.seg(ctx, [x, .05, z], [x + 2 + r() * 4, .05, z]); }
  ctx.stroke(); ctx.restore();
}
export function roads(ctx, t, V, L, o) {
  const c = V.cam, col = L.lit('#a8a39a', .85), edge = L.lit('#d8d2c4', .9);
  const draw = (pts2, w, d0 = 0) => {
    const P = nearPts(V, pts2, 5000); if (P.length < 2) return;
    const B = band3(P, w, .04);
    const S = V.poly(ctx, B.poly); if (!S) return;
    ctx.fillStyle = L.air(col, Math.hypot(P[0][0] - c.x, P[0][1] - c.z) * .5, 1.4); ctx.fill();
    ctx.beginPath(); V.line(ctx, B.L); V.line(ctx, B.R.slice().reverse()); ctx.strokeStyle = rgba(edge, .8); ctx.lineWidth = 1.2; ctx.stroke();
  };
  draw(VAL.road, VAL.roadW); draw(VAL.branchHall, 4.6); draw(VAL.branchHouse, 4.2);
  // centre line dashes (only near the camera)
  ctx.save(); ctx.strokeStyle = rgba('#f6f1e6', .85); ctx.beginPath();
  for (let x = Math.ceil((c.x - 260) / 6) * 6; x < Math.min(400, c.x + 260); x += 6) { if (Math.abs(x - VAL.forkX) < 8) continue; V.seg(ctx, [x, .05, ROADZ(x)], [x + 3, .05, ROADZ(x + 3)]); }
  ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  // the start line: a white band across the road and START painted on the asphalt
  if (o.startLine !== false) {
    const sx = VAL.startX, z = ROADZ(sx), hw = VAL.roadW / 2;
    fillPoly(ctx, V, [[sx - .25, .06, z - hw], [sx + .25, .06, z - hw], [sx + .25, .06, z + hw], [sx - .25, .06, z + hw]], rgba('#fbf8f0', .95));
    // chequer edge
    for (let k = 0; k < 14; k++) { const za = z - hw + k * VAL.roadW / 14; if (k % 2) fillPoly(ctx, V, [[sx + .25, .06, za], [sx + .55, .06, za], [sx + .55, .06, za + VAL.roadW / 14], [sx + .25, .06, za + VAL.roadW / 14]], rgba('#3a3530', .75)); }
  }
}

// ---------------------------------------------------------------- upright things
export function tree(ctx, x, y, k, T, L, d, t = 0) {
  const h = T.h * k, cr = T.cr * k; if (h < 1.2) return;
  const lean = .02 * Math.sin(t * .7 + T.seed) * (h > 60 ? 1 : 0);
  const leaf = L.air(T.kind === 'poplar' ? '#7f9a5c' : '#8aa462', d, 1.4), dark = L.air(L.lit('#5f7a48', .2), d, 1.4), lit = L.air(mixHex('#b9c97c', L.sunCol, .25), d, 1.4);
  if (h < 5) { ctx.fillStyle = leaf; ctx.fillRect(x - Math.max(.8, cr * .7), y - h * .8, Math.max(1.6, cr * 1.4), h * .8); return; }
  ctx.strokeStyle = L.air('#6b5a48', d, 1.4); ctx.lineWidth = Math.max(1, h * .035); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + lean * h, y - h * .55); ctx.stroke();
  const r = prng(T.seed), cx = x + lean * h, cy = y - h + cr * (T.kind === 'poplar' ? 2.2 : 1);
  const blobs = T.kind === 'poplar' ? 5 : 7, sx = L.dir[0] < 0 ? -1 : 1;
  for (let i = 0; i < blobs; i++) {
    const bx = cx + (r() - .5) * cr * (T.kind === 'poplar' ? .8 : 1.4), by = cy + (r() - .5) * cr * (T.kind === 'poplar' ? 3.2 : 1.1), br = cr * (.45 + r() * .4);
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(bx, by, br, br * (T.kind === 'poplar' ? 1.5 : .95), 0, 0, 7); ctx.fill();
    ctx.fillStyle = leaf; ctx.beginPath(); ctx.ellipse(bx + sx * br * .14, by - br * .12, br * .82, br * (T.kind === 'poplar' ? 1.3 : .8), 0, 0, 7); ctx.fill();
    if (h > 14) { ctx.fillStyle = rgba(lit, .85); ctx.beginPath(); ctx.ellipse(bx + sx * br * .4, by - br * .3, br * .38, br * .3, 0, 0, 7); ctx.fill(); }
  }
  if (h > 40) { ctx.strokeStyle = rgba(L.rim, .5); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx + sx * cr * .3, cy - cr * .2, cr * .9, sx > 0 ? -1.2 : Math.PI + .2, sx > 0 ? -.2 : Math.PI + 1.2); ctx.stroke(); }
}
// a metal crowd barrier (2.4 m) between ground points a, b
function barrier(ctx, V, L, a, b, d) {
  const h = 1.1, A = V.P([a[0], a[1] + h, a[2]]), B = V.P([b[0], b[1] + h, b[2]]); if (!(A.z > .1) && !(B.z > .1)) return;
  const pxLen = isFinite(A.x) && isFinite(B.x) ? Math.hypot(A.x - B.x, A.y - B.y) : 999, col = L.air('#e3e2dc', d, 1.3), sh = L.air('#8c8f93', d, 1.3);
  ctx.beginPath();
  const n = pxLen > 120 ? 14 : pxLen > 30 ? 7 : 2;
  V.seg(ctx, [a[0], a[1] + h, a[2]], [b[0], b[1] + h, b[2]]); V.seg(ctx, [a[0], a[1] + .18, a[2]], [b[0], b[1] + .18, b[2]]);
  for (let i = 0; i <= n; i++) { const u = i / n, p = [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)]; V.seg(ctx, [p[0], p[1] + .18, p[2]], [p[0], p[1] + h, p[2]]); }
  const k = isFinite(A.k) && A.k > 0 ? A.k : B.k;
  ctx.strokeStyle = sh; ctx.lineWidth = clamp(k * .05, .7, 9); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = clamp(k * .03, .5, 6); ctx.stroke();
  // feet
  if (pxLen > 30) { ctx.beginPath(); for (const p of [a, b]) V.seg(ctx, [p[0] - .3, p[1] + .02, p[2]], [p[0] + .3, p[1] + .02, p[2]]); ctx.strokeStyle = sh; ctx.lineWidth = clamp(k * .06, .8, 10); ctx.stroke(); }
}
// pennant strings over the barriers
function bunting(ctx, t, V, L, a, b, d, seed) {
  const h = 2.25, n = 9, cols = ['#c98a3a', '#3f7f7a', '#f3ecdc', '#c8714a', '#4a6a8a'];
  const pts = []; for (let i = 0; i <= n; i++) { const u = i / n; pts.push([mix(a[0], b[0], u), h - Math.sin(Math.PI * u) * .45, mix(a[2], b[2], u)]); }
  ctx.beginPath(); V.line(ctx, pts); ctx.strokeStyle = rgba(L.air('#6d655c', d, 1.3), .9); const k0 = V.P(pts[0]).k || 1; ctx.lineWidth = clamp(k0 * .015, .5, 4); ctx.stroke();
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[i + 1], sw = .12 * Math.sin(t * 2.1 + i * 1.7 + seed);
    const tip = [mix(p[0], q[0], .5) + sw * (q[2] - p[2]) * .3, mix(p[1], q[1], .5) - .42, mix(p[2], q[2], .5) + sw];
    if (V.poly(ctx, [p, [mix(p[0], q[0], .82), mix(p[1], q[1], .82), mix(p[2], q[2], .82)], tip])) { ctx.fillStyle = L.air(L.lit(cols[(((i + seed) % cols.length) + cols.length) % cols.length], .85), d, 1.3); ctx.fill(); }
  }
}
// the signpost at the fork: a wooden post with boards; boards [{ text, dir (rad in xz, 0 = +x), turn 0..1 }]
export function signpost(ctx, t, V, L, { x = VAL.signpost[0], z = VAL.signpost[1], boards = [{ text: '', dir: Math.PI * .62 }] } = {}) {
  const y0 = hgt(x, z), d = V.dist([x, y0, z]), wood = L.air(L.lit('#9a7a58', .8), d, 1.3), dark = L.air('#5e4a38', d, 1.3);
  const a = V.P([x, y0, z]), b = V.P([x, y0 + 2.7, z]); if (!(a.z > .2)) return;
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, a.k * .14); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.strokeStyle = wood; ctx.lineWidth = Math.max(.6, a.k * .09); ctx.beginPath(); ctx.moveTo(a.x - a.k * .02, a.y); ctx.lineTo(b.x - b.k * .02, b.y); ctx.stroke();
  boards.forEach((B, i) => {
    const yb = y0 + 2.25 - i * .42, dx = Math.cos(B.dir), dz = Math.sin(B.dir), L0 = 1.35, hh = .3;
    const q = [[x, yb, z], [x + dx * L0, yb, z + dz * L0], [x + dx * (L0 + .18), yb - hh / 2, z + dz * (L0 + .18)], [x + dx * L0, yb - hh, z + dz * L0], [x, yb - hh, z]];
    if (V.poly(ctx, q)) { ctx.fillStyle = wood; ctx.fill(); ctx.strokeStyle = dark; ctx.lineWidth = Math.max(.5, a.k * .02); ctx.stroke(); }
    if (B.text && a.k > 14) {
      const o = V.P([x + dx * .1, yb - hh * .72, z + dz * .1]), e = V.P([x + dx * (L0 - .05), yb - hh * .72, z + dz * (L0 - .05)]);
      if (o.z > .2 && e.z > .2) {
        ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(Math.atan2(e.y - o.y, e.x - o.x)); const len = Math.hypot(e.x - o.x, e.y - o.y);
        ctx.font = `600 ${Math.max(6, a.k * .17)}px "Inter"`; const tw = ctx.measureText(B.text).width; ctx.scale(Math.min(1, len / tw) * Math.sign(e.x - o.x || 1), 1);
        ctx.fillStyle = rgba('#2b2622', .85); ctx.fillText(B.text, Math.sign(e.x - o.x) < 0 ? -tw : 0, 0); ctx.restore();
      }
    }
  });
}
// a simple pitched-roof building: walls + roof, drawn from the side facing the camera; o: { wall, roof, win: [ {u0,u1,v0,v1} on the south face ] }
export function building(ctx, t, V, L, { x0, x1, z0, z1, eave, ridge, wall = '#e9dcc6', roof = PAL.roof, ridgeAlong = 'x', wins = [], door = null, glow = 0, sunWin = 0 }) {
  const c = V.cam, y0 = Math.min(hgt(x0, z0), hgt(x1, z0)), d = V.dist([(x0 + x1) / 2, y0, (z0 + z1) / 2]);
  const sunL = L.dir, f = (nx, nz) => clamp(.55 + .45 * (nx * sunL[0] + nz * sunL[2]) / Math.hypot(sunL[0], sunL[2]));
  const wallCol = (nx, nz) => L.air(L.lit(wall, f(nx, nz)), d, 1.3), Y = (y) => y0 + y;
  const faces = [];
  // walls (only the ones facing the camera)
  if (c.z < z0) faces.push(() => { fillPoly(ctx, V, [[x0, Y(0), z0], [x1, Y(0), z0], [x1, Y(eave), z0], ...(ridgeAlong === 'z' ? [[(x0 + x1) / 2, Y(ridge), z0]] : []), [x0, Y(eave), z0]], wallCol(0, -1)); southWins(); });
  if (c.z > z1) faces.push(() => fillPoly(ctx, V, [[x0, Y(0), z1], [x1, Y(0), z1], [x1, Y(eave), z1], ...(ridgeAlong === 'z' ? [[(x0 + x1) / 2, Y(ridge), z1]] : []), [x0, Y(eave), z1]], wallCol(0, 1)));
  if (c.x < x0) faces.push(() => fillPoly(ctx, V, [[x0, Y(0), z0], [x0, Y(0), z1], [x0, Y(eave), z1], ...(ridgeAlong === 'x' ? [[x0, Y(ridge), (z0 + z1) / 2]] : []), [x0, Y(eave), z0]], wallCol(-1, 0)));
  if (c.x > x1) faces.push(() => fillPoly(ctx, V, [[x1, Y(0), z0], [x1, Y(0), z1], [x1, Y(eave), z1], ...(ridgeAlong === 'x' ? [[x1, Y(ridge), (z0 + z1) / 2]] : []), [x1, Y(eave), z0]], wallCol(1, 0)));
  function southWins() {
    for (const w of wins) {
      const q = [[mix(x0, x1, w.u0), Y(w.v0), z0 - .02], [mix(x0, x1, w.u1), Y(w.v0), z0 - .02], [mix(x0, x1, w.u1), Y(w.v1), z0 - .02], [mix(x0, x1, w.u0), Y(w.v1), z0 - .02]];
      const S = V.poly(ctx, q); if (!S) continue;
      ctx.fillStyle = L.air(mixHex(mixHex('#55606a', L.sky[1], .35), '#fff3dc', sunWin), d, 1.3); ctx.fill();
      ctx.strokeStyle = L.air('#efe6d8', d, 1.3); ctx.lineWidth = clamp((S[0].k || 1) * .08, .5, 6); ctx.stroke();
      ctx.beginPath(); V.seg(ctx, [mix(x0, x1, (w.u0 + w.u1) / 2), Y(w.v0), z0 - .03], [mix(x0, x1, (w.u0 + w.u1) / 2), Y(w.v1), z0 - .03]); ctx.stroke();
    }
    if (door) fillPoly(ctx, V, [[mix(x0, x1, door[0]), Y(0), z0 - .02], [mix(x0, x1, door[1]), Y(0), z0 - .02], [mix(x0, x1, door[1]), Y(2.1), z0 - .02], [mix(x0, x1, door[0]), Y(2.1), z0 - .02]], L.air('#6b4f3a', d, 1.3));
  }
  // roof
  const roofCol = (s) => L.air(L.lit(roof, s), d, 1.3), o = .5;
  if (ridgeAlong === 'x') {
    const ym = (z0 + z1) / 2;
    faces.push(() => { if (c.z < ym || c.y > Y(ridge)) fillPoly(ctx, V, [[x0 - o, Y(eave) - .2, z0 - o], [x1 + o, Y(eave) - .2, z0 - o], [x1 + o, Y(ridge), ym], [x0 - o, Y(ridge), ym]], roofCol(.75)); });
    faces.unshift(() => { if (c.z > ym || c.y > Y(ridge)) fillPoly(ctx, V, [[x0 - o, Y(eave) - .2, z1 + o], [x1 + o, Y(eave) - .2, z1 + o], [x1 + o, Y(ridge), ym], [x0 - o, Y(ridge), ym]], roofCol(.5)); });
  } else {
    const xm = (x0 + x1) / 2;
    faces.push(() => { fillPoly(ctx, V, [[x0 - o, Y(eave) - .2, z0 - o], [x0 - o, Y(eave) - .2, z1 + o], [xm, Y(ridge), z1 + o], [xm, Y(ridge), z0 - o]], roofCol(L.dir[0] < 0 ? .85 : .45)); });
    faces.push(() => { fillPoly(ctx, V, [[x1 + o, Y(eave) - .2, z0 - o], [x1 + o, Y(eave) - .2, z1 + o], [xm, Y(ridge), z1 + o], [xm, Y(ridge), z0 - o]], roofCol(L.dir[0] < 0 ? .45 : .85)); });
  }
  for (const fn of faces) fn();
}
function house(ctx, t, V, L, o) {
  const Hs = VAL.house, Sh = VAL.shed, G = VAL.garden, d = V.dist([150, 5, 345]);
  // garden: a green patch with flower dots, a low fence and the gate
  const gl = (o.gardenLit ?? 0);
  if (V.poly(ctx, [[G.x0, hgt(G.x0, G.z0) + .05, G.z0], [G.x1, hgt(G.x1, G.z0) + .05, G.z0], [G.x1, hgt(G.x1, G.z1) + .05, G.z1], [G.x0, hgt(G.x0, G.z1) + .05, G.z1]])) {
    ctx.fillStyle = L.air(mixHex(L.lit('#93ad6a', .55), mixHex('#b9cf7c', L.sunCol, .2), gl), d, 1.3); ctx.fill();
    const r = prng(41); for (let i = 0; i < 70; i++) { const x = mix(G.x0, G.x1, r()), z = mix(G.z0, G.z1, r()), p = V.P([x, hgt(x, z) + .3, z]); if (p.z > .2) { ctx.fillStyle = rgba(L.air(['#e9a25a', '#f3ecdc', '#c79a9a', '#d9c45a'][i % 4], d, 1.3), .7 + .3 * gl); ctx.fillRect(p.x - 1, p.y - 1, Math.max(1.5, p.k * .25), Math.max(1.5, p.k * .25)); } }
  }
  ctx.beginPath(); const fy = (x, z) => hgt(x, z) + .9;
  for (const [a, b] of [[[G.x0, G.z0], [G.gate[0] - .8, G.z0]], [[G.gate[0] + .8, G.z0], [G.x1, G.z0]], [[G.x0, G.z0], [G.x0, G.z1]], [[G.x1, G.z0], [G.x1, G.z1]]]) V.seg(ctx, [a[0], fy(...a), a[1]], [b[0], fy(...b), b[1]]);
  for (let x = G.x0; x <= G.x1; x += 1.2) if (Math.abs(x - G.gate[0]) > .9) V.seg(ctx, [x, hgt(x, G.z0), G.z0], [x, fy(x, G.z0), G.z0]);
  ctx.strokeStyle = L.air('#8a6c50', d, 1.3); ctx.lineWidth = clamp((V.P([G.x0, 0, G.z0]).k || 1) * .05, .5, 4); ctx.stroke();
  building(ctx, t, V, L, { ...Sh, eave: 2.4, ridge: 3.4, wall: '#d9c7aa', roof: '#a86848', ridgeAlong: 'x', wins: [{ u0: .25, u1: .55, v0: 1, v1: 1.9 }] });
  building(ctx, t, V, L, { ...Hs, eave: 5, ridge: 8.6, wall: '#efe3cf', roof: PAL.roof, ridgeAlong: 'x', wins: [{ u0: .08, u1: .44, v0: .9, v1: 3.6 }, { u0: .72, u1: .9, v0: 1.4, v1: 3.6 }], door: [.53, .63], sunWin: o.sunWin ?? 0 });
  // chimney
  const cx = 154, cz = 347.5, y0 = hgt(cx, cz);
  fillPoly(ctx, V, [[cx, y0 + 6.5, cz - .5], [cx + .9, y0 + 6.5, cz - .5], [cx + .9, y0 + 8.6, cz - .5], [cx, y0 + 8.6, cz - .5]], L.air(L.lit(PAL.brick, .7), d, 1.3));
}
function workshop(ctx, t, V, L, [x, z, w, dd], i) {
  building(ctx, t, V, L, { x0: x, x1: x + w, z0: z, z1: z + dd, eave: 6 + (i % 2) * 2, ridge: 9 + (i % 3), wall: i % 2 ? '#c99a7e' : '#ddd0bb', roof: i % 2 ? '#8f9ea8' : '#a86a4c', ridgeAlong: i % 2 ? 'z' : 'x', wins: [{ u0: .15, u1: .35, v0: 2, v1: 4.5 }, { u0: .6, u1: .8, v0: 2, v1: 4.5 }] });
}
function datacenter(ctx, t, V, L) {
  const D = VAL.datacenter, d = V.dist([D.x, 0, D.z]);
  building(ctx, t, V, L, { x0: D.x, x1: D.x + D.w, z0: D.z, z1: D.z + D.d, eave: 9, ridge: 9.4, wall: '#e7e9e6', roof: '#b9c1c6', ridgeAlong: 'x' });
  // steam plumes from the coolers (slow, soft)
  const y0 = hgt(D.x, D.z) + 10;
  for (let k = 0; k < 3; k++) for (let j = 0; j < 5; j++) {
    const u = ((t * .05 + j / 5 + k * .3) % 1), p = V.P([D.x + 20 + k * 32 + u * 6, y0 + u * 30, D.z + 20]); if (!(p.z > 1)) continue;
    ctx.fillStyle = rgba(L.air('#ffffff', d * .5, 1.3), .32 * (1 - u)); ctx.beginPath(); ctx.arc(p.x, p.y, p.k * (2 + u * 7), 0, 7); ctx.fill();
  }
}
function vineyard(ctx, t, V, L) {
  const Y = VAL.vineyard, c = V.cam; ctx.beginPath();
  for (let x = Y.x0; x <= Y.x1; x += 6) { const pts = []; for (let z = Y.z0; z <= Y.z1; z += 25) pts.push([x + (z - Y.z0) * .05, hgt(x, z) + .6, z]); V.line(ctx, pts); }
  const d = Math.hypot((Y.x0 + Y.x1) / 2 - c.x, (Y.z0 + Y.z1) / 2 - c.z);
  ctx.strokeStyle = rgba(L.air(PAL.vine, d, 1.4), .8); ctx.lineWidth = clamp(1700 / d * 1.1, .6, 4); ctx.stroke();
  // two farms on a field path and the shared machine shed (CUMA)
  building(ctx, t, V, L, { x0: 610, x1: 624, z0: 430, z1: 440, eave: 4.5, ridge: 7, wall: '#efe3cf', roof: PAL.roof, ridgeAlong: 'x', wins: [{ u0: .2, u1: .4, v0: 1.2, v1: 2.8 }] });
  building(ctx, t, V, L, { x0: 668, x1: 680, z0: 470, z1: 480, eave: 4.5, ridge: 7, wall: '#e5d6bd', roof: '#b86e4c', ridgeAlong: 'x', wins: [{ u0: .55, u1: .75, v0: 1.2, v1: 2.8 }] });
  building(ctx, t, V, L, { x0: 640, x1: 662, z0: 452, z1: 466, eave: 6, ridge: 8, wall: '#c8b79a', roof: '#8f9ea8', ridgeAlong: 'x' });
}

// ---------------------------------------------------------------- mist (soft bands at river, slope foot and between the ridges)
export function mist(ctx, t, V, L, { amt = 1, bands = [[300, 3, 1], [700, 18, .8], [1500, 60, .9], [2600, 90, 1]] } = {}) {
  if (!MIST || amt <= 0) return;
  const c = V.cam;
  for (const [z, y, a] of bands) {
    if (z < c.z + 20) continue;
    const p = V.P([c.x + Math.sin(V.yaw) * (z - c.z), y, z]); if (!(p.z > 1)) continue;
    const hh = clamp(p.k * 26, 24, 520), al = clamp(a * amt * (.55 + .45 * clamp(1 - L.el / 30)), 0, 1);
    const off = ((t * 9 + z * .37) % 1024 + 1024) % 1024, sc = Math.max(1.2, hh / 80);
    ctx.save(); ctx.globalAlpha = al; ctx.globalCompositeOperation = 'source-over';
    for (let x = -off * sc; x < W; x += 1024 * sc) ctx.drawImage(MIST, x, p.y - hh * .6, 1024 * sc, hh * 1.2);
    // a flat colour wash under the band (the mist lightens what is behind it)
    const g = ctx.createLinearGradient(0, p.y - hh * .45, 0, p.y + hh * .45);
    g.addColorStop(0, rgba(L.fog, 0)); g.addColorStop(.5, rgba(L.fog, .38 * al)); g.addColorStop(1, rgba(L.fog, 0)); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, p.y - hh * .45, W, hh * .9);
    ctx.restore();
  }
}

// ---------------------------------------------------------------- the valley
// o: { items: [{ p:[x,y,z], draw(ctx) }] (figures, robots, props: sorted with the world), race: true (barriers + bunting),
//      shadowX: x of the ridge-shadow edge (null = none), mine, green, mistAmt, sunWin, gardenLit, hall: { interior(ctx, V), clipWindows },
//      crowd: fn(ctx, V, push) pushes its own items, signpost: {...}, hallFn(ctx, t, V, L) draws the hall (from f10_hall) }
export function valley(ctx, t, V, L, o = {}) {
  const c = V.cam;
  skyAndSun(ctx, t, V, L, o);
  ridges(ctx, t, V, L, o);
  tower(ctx, t, V, L);
  mist(ctx, t, V, L, { amt: (o.mistAmt ?? 1) * .8, bands: [[2600, 90, 1], [1500, 60, .9]] });
  terrain(ctx, t, V, L, o);
  fields(ctx, t, V, L, o);
  river(ctx, t, V, L, o);
  roads(ctx, t, V, L, o);
  // the ridge shadow (morning): the floor east of shadowX lies in the shade of the eastern ridge; the edge is soft (3 steps)
  if (o.shadowX != null) {
    ctx.save();
    for (let k = 0; k < 4; k++) { const xe = o.shadowX + (k - 1.5) * 26; fillPoly(ctx, V, [[xe, .1, -400], [Math.max(xe, c.x) + 6000, .1, -400], [Math.max(xe, c.x) + 6000, .1, 1800], [xe + 120, .1, 1800]], rgba(L.shade, .07 * (o.shadowA ?? 1))); }
    ctx.restore();
  }
  // upright things, far → near
  const items = [];
  const push = (p, draw) => { const q = V.toCam(p); if (q[2] > .2 && q[2] < 9000) items.push({ z: q[2], draw }); };
  for (const T of TREES) {
    const y = hgt(T.x, T.z); const q = V.toCam([T.x, y, T.z]); if (q[2] < .5 || q[2] > 6000) continue;
    const s = V.P([T.x, y, T.z]); if (s.x < -400 || s.x > W + 400) continue;
    items.push({ z: q[2], draw: () => tree(ctx, s.x, s.y, s.k, T, L, q[2], t) });
  }
  push([150, hgt(150, 345), 345], () => house(ctx, t, V, L, o));
  VAL.workshops.forEach((w, i) => push([w[0] + w[2] / 2, 0, w[1] + w[3] / 2], () => workshop(ctx, t, V, L, w, i)));
  push([VAL.datacenter.x + 50, 0, VAL.datacenter.z + 20], () => datacenter(ctx, t, V, L));
  push([500, hgt(500, 600), 600], () => vineyard(ctx, t, V, L));
  if (o.hallFn) push(VAL.hallWorld([0, 0, (VAL.hall.z0 + VAL.hall.z1) / 2]), () => o.hallFn(ctx, t, V, L));
  push([VAL.signpost[0], 0, VAL.signpost[1]], () => signpost(ctx, t, V, L, o.signpost || {}));
  if (o.race !== false) {
    // barriers along both road edges from x −190 to +30 (gap at the fork), bunting every three barriers
    for (const side of [-1, 1]) for (let x = -190; x < 30; x += 2.4) {
      if (side > 0 && Math.abs(x - VAL.forkX) < 9) continue;
      if (Math.abs(x + 1.2 - c.x) > 400) continue;
      const za = ROADZ(x) + side * (VAL.roadW / 2 + .6), zb = ROADZ(x + 2.3) + side * (VAL.roadW / 2 + .6);
      const a = [x, 0, za], b = [x + 2.3, 0, zb], dd = Math.hypot(x - c.x, za - c.z);
      push([x + 1.2, .5, (za + zb) / 2], () => barrier(ctx, V, L, a, b, dd));
      if (Math.round((x + 190) / 2.4) % 3 === 0 && x + 7.2 < 30) push([x + 3.6, 2, za + side * .01], () => bunting(ctx, t, V, L, [x, 0, za], [x + 7.2, 0, ROADZ(x + 7.2) + side * (VAL.roadW / 2 + .6)], dd, Math.round(x)));
    }
  }
  if (o.crowd) o.crowd(ctx, V, push);
  for (const it of o.items || []) push(it.p, it.draw);
  // morning mist low over the river and the slope foot: sorted with the things, so it veils only what lies behind it
  for (const b of [[700, 14, .6], [300, 3, 1]]) push([c.x + Math.sin(V.yaw) * (b[0] - c.z), b[1], b[0]], () => mist(ctx, t, V, L, { amt: (o.mistAmt ?? 1), bands: [b] }));
  items.sort((p, q) => q.z - p.z);
  for (const it of items) it.draw();
}
