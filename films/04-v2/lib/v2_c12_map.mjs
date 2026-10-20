// c12 · 12.01 the engraved map of Kenya on the warm paper of the c11>c12 plate (Natural Earth via lib/map.mjs). Owner: c12.
// SHEET units = the plate's screen pixels: the plate frame [0, 1920] × [0, 1080] is open Indian Ocean south-east of Kenya's coast,
// so at the identity camera the sheet IS the paper plate (the plate's watermark rosette is the map's compass rose). Everything else
// (Kenya, its neighbours, lakes, rivers, villages, the inset vignette) lies outside that frame and comes into view as the camera pulls back.
//   MAP                               geometry in sheet units (kenya path, coast, villages, medallion, rose …)
//   drawMap(ctx, t, o)                the engraving (live vector, crisp at any zoom); o: { k (sheet→screen scale, for culling), clipPlate }
//   drawRose(ctx, t, glow)            the payment source: the watermark rosette catches foil light, a small foil seal grows at its centre
//   drawVillages(ctx, t, lit(i), o)   village markers; lit(i) 0..1 = that village has its light (amber, alive)
//   payment(i, wave) / drawPayments(ctx, t, P)  the foil lights flying from the rose to the villages (arcs, shadow on the paper)
//   drawMedallion(ctx, t, inner)      the round inset vignette (a village roadside); inner(ctx) draws the roadside in medallion units
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, prng, sm, eout } from '../engine.mjs';
import { outlineLocal, country, coastRuns } from './map.mjs';
import { microRing, guilloche, FOIL } from './certificate.mjs';
import { once, memo, glowSpr, TAU, label } from './v2_c12_kit.mjs';
import { canvas } from '../engine.mjs';

export const KS = 300, LX0 = 4.0, LY0 = 2.8;                          // sheet = (local - (LX0, LY0)) * KS
const INK = '#3a2616', INKB = '#2a1a0e', EARTH = '#c9763c';
let G = null;
function geo() {
  if (G) return G;
  const K = outlineLocal('Kenya', { detail: '50m' }), cl = Math.cos(K.lat0 * Math.PI / 180);
  const toS = ([x, y]) => [(x - LX0) * KS, (y - LY0) * KS];
  const LL = (lon, lat) => toS([(lon - K.lon0) * cl, -(lat - K.lat0)]);
  const kenya = K.rings.map((r) => r.map(toS));
  const coast = coastRuns(K.rings[0], K.coast[0]).map((r) => r.map(toS));
  const nb = [];
  for (const id of ['800', '834', '706', '231', '728']) { const c = country(id, '50m'); if (!c) continue; for (const p of c.polys) { const r = p[0]; if (r.length < 30) continue; nb.push({ id, pts: r.map(([lon, lat]) => LL(lon, lat)) }); } }
  const path = (rings) => { const p = new Path2D(); for (const r of rings) { r.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); p.closePath(); } return p; };
  // Lake Victoria and Lake Turkana (not cut out of the Natural Earth countries): hand-traced from an atlas, lon/lat
  const VIC = [[32.0, .32], [32.45, .08], [32.85, .25], [33.2, .45], [33.55, .32], [33.9, .26], [34.12, .08], [34.2, -.08], [34.5, -.07], [34.76, -.1], [34.68, -.26], [34.45, -.33], [34.28, -.45], [34.35, -.62], [34.2, -.8], [34.1, -1.05], [33.92, -1.42], [33.72, -1.78], [33.45, -2.15], [33.12, -2.45], [32.85, -2.55], [32.5, -2.65], [32.15, -2.5], [31.92, -2.2], [31.8, -1.8], [31.78, -1.35], [31.72, -.95], [31.68, -.5], [31.72, -.1], [31.82, .15]].map(([a, b]) => LL(a, b));
  const TUR = [[36.02, 4.58], [36.25, 4.35], [36.38, 4.0], [36.48, 3.6], [36.55, 3.2], [36.66, 2.85], [36.74, 2.55], [36.62, 2.4], [36.48, 2.55], [36.34, 2.9], [36.18, 3.3], [36.02, 3.75], [35.9, 4.15], [35.92, 4.45]].map(([a, b]) => LL(a, b));
  const TANA = [[37.05, -.55], [37.5, -.72], [38.0, -.62], [38.5, -.48], [39.0, -.5], [39.35, -.85], [39.7, -1.3], [39.95, -1.75], [40.08, -2.2], [40.2, -2.55]].map(([a, b]) => LL(a, b));
  const GALANA = [[36.95, -1.42], [37.35, -1.9], [37.85, -2.4], [38.4, -2.85], [38.95, -3.0], [39.5, -3.05], [40.1, -3.2]].map(([a, b]) => LL(a, b));
  // villages of the trial (rural western Kenya, near Lake Victoria): two clusters, deterministic jitter, none in the lake
  const r = prng(1203), vil = [];
  const inLake = (x, y) => { let c = false; for (let i = 0, j = VIC.length - 1; i < VIC.length; j = i++) { const [xi, yi] = VIC[i], [xj, yj] = VIC[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const add = (lon, lat, sx, sy, n) => { let k = 0, guard = 0; while (k < n && guard++ < 400) { const [x, y] = LL(lon + (r() - .5) * sx, lat + (r() - .5) * sy); if (inLake(x, y) || vil.some((v) => Math.hypot(v.x - x, v.y - y) < 46)) continue; vil.push({ x, y, ph: r() * TAU, k: r() }); k++; } };
  add(34.35, .12, .65, .55, 24); add(35.3, -.78, .55, .5, 16);
  vil.sort((a, b) => a.x - b.x);
  const MED = (() => { const [x, y] = LL(32.4, 2.2); return { x, y, r: 470 }; })();
  const rose = { x: W * .72, y: H * .56 };
  G = { K, LL, kenya, kpath: path(kenya), coast, nb, nbPaths: nb.map((n) => ({ id: n.id, p: path([n.pts]) })), VIC, TUR, vicPath: path([VIC]), turPath: path([TUR]), TANA, GALANA, vil, MED, rose,
    nairobi: LL(36.82, -1.29), mombasa: LL(39.67, -4.04), kisumu: LL(34.76, -.09), mtKenya: LL(37.31, -.15), kili: LL(37.35, -3.07) };
  return G;
}
export const MAP = new Proxy({}, { get: (_, k) => geo()[k] });

// ---------------------------------------------------------------- the engraving
const strokePts = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
function offsetRun(pts, d) {
  // offset a polyline by d along its (smoothed) left normal; the coast runs with the sea on the left for Kenya's ring order
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 2)], b = pts[Math.min(pts.length - 1, i + 2)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    out.push([pts[i][0] + dy / L * d, pts[i][1] - dx / L * d]);
  }
  return out;
}
// hachures along a ridge (pts), short strokes down the slope on one side
function hachure(ctx, pts, len, gap, side = 1) {
  ctx.beginPath(); let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L * side, ny = (x1 - x0) / L * side;
    for (let s = acc; s < L; s += gap) { const q = s / L, x = mix(x0, x1, q), y = mix(y0, y1, q), l = len * (.6 + .4 * Math.sin(x * .05 + y * .03)); ctx.moveTo(x, y); ctx.lineTo(x + nx * l, y + ny * l); }
    acc = ((acc - L) % gap + gap) % gap;
  }
  ctx.stroke();
}
const ROSE_HOLE = (ctx) => { ctx.beginPath(); ctx.rect(-9000, -9000, 18000, 18000); ctx.rect(-4, -4, W + 8, H + 8); ctx.clip('evenodd'); };
export function drawMap(ctx, t, o = {}) {
  const g = geo();
  ctx.save();
  ROSE_HOLE(ctx);               // nothing of the map is printed inside the plate's frame (the open ocean of the first frame)
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // neighbours: hairline borders only, a faint stipple tone
  ctx.strokeStyle = rgba(INK, .32); ctx.lineWidth = 2.4;
  for (const n of g.nbPaths) ctx.stroke(n.p);
  // Kenya: red-earth wash, engraved ruling, a bold outline with an inner hairline
  ctx.save(); ctx.clip(g.kpath);
  ctx.fillStyle = rgba(EARTH, .26); ctx.fill(g.kpath);
  const kb = memo('kbox', () => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const r of g.kenya) for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } return [x0, y0, x1, y1]; });
  ctx.strokeStyle = rgba(INK, .16); ctx.lineWidth = 2.2; ctx.beginPath();
  for (let s = kb[0] - (kb[3] - kb[1]); s < kb[2]; s += 15) { ctx.moveTo(s, kb[1]); ctx.lineTo(s + (kb[3] - kb[1]) * .9, kb[3]); }
  ctx.stroke();
  // a darker inner band along the border (the atlas "colour edge")
  ctx.strokeStyle = rgba(EARTH, .35); ctx.lineWidth = 46; ctx.stroke(g.kpath);
  // relief: the Rift Valley escarpments, Mount Kenya, the highlands
  ctx.strokeStyle = rgba(INKB, .42); ctx.lineWidth = 2.6;
  const rift = memo('rift', () => [[[35.75, 1.9], [35.62, 1.2], [35.7, .5], [35.85, -.2], [36.05, -.9], [36.2, -1.6], [36.1, -2.3]].map(([a, b]) => g.LL(a, b)), [[36.55, 1.7], [36.45, 1.0], [36.5, .3], [36.6, -.4], [36.75, -1.1], [36.85, -1.8], [36.7, -2.5]].map(([a, b]) => g.LL(a, b))]);
  hachure(ctx, rift[0], 70, 13, -1); hachure(ctx, rift[1], 70, 13, 1);
  for (const [mx, my, R] of [[g.mtKenya[0], g.mtKenya[1], 120], [g.kili[0], g.kili[1], 100]]) {
    ctx.beginPath(); for (let k = 0; k < 44; k++) { const a = k / 44 * TAU, r0 = R * .18, r1 = R * (.75 + .25 * Math.sin(k * 2.7)); ctx.moveTo(mx + Math.cos(a) * r0, my + Math.sin(a) * r0); ctx.lineTo(mx + Math.cos(a) * r1, my + Math.sin(a) * r1); } ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = rgba(INKB, .85); ctx.lineWidth = 5.5; ctx.stroke(g.kpath);
  ctx.strokeStyle = rgba(INKB, .45); ctx.lineWidth = 1.6; ctx.setLineDash([16, 10]); ctx.stroke(g.kpath); ctx.setLineDash([]);
  // waterlines along the coast (the classic engraved sea): 7 lines, getting fainter seaward
  for (let k = 1; k <= 7; k++) { ctx.strokeStyle = rgba(INK, .42 * (1 - k / 9)); ctx.lineWidth = 2.2 - k * .16; for (const run of g.coast) strokePts(ctx, offsetRun(run, -(10 + k * k * 2.6))); }
  // lakes: water tone + waterlines inside
  for (const [P, pts] of [[g.vicPath, g.VIC], [g.turPath, g.TUR]]) {
    ctx.fillStyle = rgba('#e7dcc3', .92); ctx.fill(P);
    ctx.save(); ctx.clip(P); for (let k = 1; k <= 5; k++) { ctx.strokeStyle = rgba(INK, .34 * (1 - k / 7)); ctx.lineWidth = 2 - k * .2; ctx.beginPath(); offsetRun(pts.concat([pts[0]]), 12 + k * k * 3.2).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke(); } ctx.restore();
    ctx.strokeStyle = rgba(INKB, .75); ctx.lineWidth = 3.4; ctx.stroke(P);
  }
  // rivers
  ctx.strokeStyle = rgba(INK, .6); for (const [R, w] of [[g.TANA, 3.2], [g.GALANA, 2.6]]) { ctx.lineWidth = w; ctx.beginPath(); R.forEach(([x, y], i) => { const wob = Math.sin(i * 2.3) * 9; i ? ctx.lineTo(x + wob, y - wob * .5) : ctx.moveTo(x, y); }); ctx.stroke(); }
  // cities: Nairobi (capital: a ring with a dot), Mombasa, Kisumu
  for (const [p, cap] of [[g.nairobi, true], [g.mombasa, false], [g.kisumu, false]]) { ctx.fillStyle = rgba(INKB, .9); ctx.beginPath(); ctx.arc(p[0], p[1], cap ? 13 : 10, 0, TAU); ctx.fill(); if (cap) { ctx.strokeStyle = rgba(INKB, .9); ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(p[0], p[1], 25, 0, TAU); ctx.stroke(); } }
  // labels (sheet units: ~62 = 16 px on screen at the map view)
  const k = o.k ?? .26, la = o.labels ?? 1;
  const L = (s, x, y, size, opt = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(1 / k, 1 / k); label(ctx, s, 0, 0, la, { size: size, col: opt.col || '#3a2616', shadow: 'rgba(246,231,201,.9)', blur: 6, spacing: opt.spacing ?? 3, font: opt.font, weight: opt.weight, align: opt.align || 'center', alpha: opt.alpha ?? .9 }); ctx.restore(); };
  ctx.restore();
  return { L, g };
}
// map labels, drawn at a constant screen size (they are the atlas lettering; sizes in screen px at the map view)
export function drawMapLabels(ctx, k, a = 1) {
  if (a <= 0) return; const g = geo();
  const L = (s, [x, y], size, opt = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(1 / k, 1 / k); label(ctx, s, 0, 0, a, { size, col: opt.col || '#3a2616', shadow: 'rgba(246,231,201,.0)', blur: 0, spacing: opt.spacing ?? 3, font: opt.font, weight: opt.weight ?? 600, align: opt.align || 'center', alpha: opt.alpha ?? .85 }); ctx.restore(); };
  const s = 1 / .26 * k;   // keep sizes in sheet proportion: they scale with the sheet (printed), sized for the map view
  const S = (px) => px * s;
  L('K E N Y A', g.LL(38.6, 1.4), S(64), { font: 'Instrument Serif', weight: 400, spacing: S(14), alpha: .82 });
  L('Nairobi', [g.nairobi[0] + 40, g.nairobi[1] - 30], S(19), { font: 'Instrument Serif', weight: 400, spacing: 0, align: 'left', alpha: .9 });
  L('Mombasa', [g.mombasa[0] - 36, g.mombasa[1] + 22], S(16), { font: 'Instrument Serif', weight: 400, spacing: 0, align: 'right', alpha: .8 });
  L('Lake Victoria', g.LL(33.0, -1.25), S(19), { font: 'Instrument Serif', weight: 400, spacing: 1, alpha: .75 });
  L('I N D I A N   O C E A N', [g.rose.x - 120, g.rose.y - 520], S(20), { font: 'Instrument Serif', weight: 400, spacing: S(4), alpha: .7 });
  for (const [s2, p] of [['UGANDA', g.LL(33.1, 3.3)], ['TANZANIA', g.LL(35.3, -4.6)], ['SOMALIA', g.LL(43.3, 3.0)], ['ETHIOPIA', g.LL(38.9, 5.6)]]) L(s2, p, S(13), { spacing: S(5), alpha: .5 });
}

// ---------------------------------------------------------------- the rose: payment source
export function drawRose(ctx, t, glow) {
  if (glow <= 0) return; const g = geo(), { x, y } = g.rose;
  // the watermark's lines (exactly the plate's rosette geometry) catch foil light
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb35c', .32 * glow); ctx.lineWidth = 2.4; const R0 = 300, rot = t * .02;
  for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let i = 0; i <= 360; i++) { const q = i / 360 * TAU, rr = R0 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); const X = x + rr * Math.cos(q + rot), Y = y + rr * Math.sin(q + rot) * .92; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
  ctx.restore();
  // a foil seal grows at its centre (the income slip's foil)
  const s = eout(clamp(glow * 1.25)), r = 120 * s;
  if (r > 1) { ctx.save(); ctx.translate(x, y); ctx.rotate(-.3 + t * .05); ctx.drawImage(foilSeal(), -r * 1.3, -r * 1.3, r * 2.6, r * 2.6); ctx.restore(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55 * glow * (.85 + .15 * Math.sin(t * 2.3)); ctx.drawImage(glowSpr('#ffb35c', 64), x - 330, y - 330, 660, 660); ctx.restore();
}
// a foil seal sprite (radius 100 in a 260 box): foil gradient, scallops, rings, microtext ring, a small guilloche
export function foilSeal() {
  return once('foilseal', () => {
    const S = 260, R = 100, [c, g] = canvas(S, S); g.translate(S / 2, S / 2);
    const edge = (rr) => { g.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * TAU, q = rr * (1 + .035 * Math.cos(36 * a)); i ? g.lineTo(Math.cos(a) * q, Math.sin(a) * q) : g.moveTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); };
    g.save(); g.translate(3.5, 4); edge(R); g.fillStyle = 'rgba(70,30,8,.55)'; g.fill(); g.restore();
    edge(R); const gr = g.createLinearGradient(-R, -R, R, R); FOIL.forEach((c2, i) => gr.addColorStop(i / (FOIL.length - 1), c2)); g.fillStyle = gr; g.fill();
    g.strokeStyle = 'rgba(90,40,10,.75)'; g.lineWidth = 1.4; for (const q of [.9, .72, .7]) { g.beginPath(); g.arc(0, 0, R * q, 0, TAU); g.stroke(); }
    microRing(g, 0, 0, R * .81, 'TAKEN CARE OF · EVERY MONTH', { size: 8.5, col: '#5a2a08', a: .8 });
    const Gl = guilloche({ R: R * .42, A: R * .12, B: R * .05, n: 12, m: 5, lines: 18 }); g.lineWidth = .8; for (let k = 0; k < Gl.lines; k++) { const P = Gl.line(k); g.beginPath(); P.forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.stroke(); }
    return c;
  });
}

// ---------------------------------------------------------------- villages and payment lights
export function drawVillages(ctx, t, lit, o = {}) {
  const g = geo(), k = o.k ?? .26, sp = glowSpr('#ffb35c', 64);
  for (let i = 0; i < g.vil.length; i++) {
    const v = g.vil[i], L = clamp(lit(i));
    ctx.fillStyle = rgba(INKB, .85); ctx.beginPath(); ctx.arc(v.x, v.y, 15, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba('#f6e7c9', .9); ctx.beginPath(); ctx.arc(v.x, v.y, 8.5, 0, TAU); ctx.fill();
    if (L > 0) {
      const br = L * (.82 + .18 * Math.sin(t * (2.1 + v.k) + v.ph));   // alive: each village breathes on its own rhythm
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(.75 * br); const R = 70 + 20 * v.k; ctx.drawImage(sp, v.x - R, v.y - R, R * 2, R * 2); ctx.restore();
      ctx.fillStyle = rgba('#ffcf8a', clamp(br * 1.2)); ctx.beginPath(); ctx.arc(v.x, v.y, 9.5, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba('#fff1d6', clamp(br)); ctx.beginPath(); ctx.arc(v.x, v.y, 5, 0, TAU); ctx.fill();
    }
  }
}
// payment i of wave w: departs the rose, arcs over the map, lands on village i (sheet units). Returns null when not in flight.
export function payment(i, w, t, t0) {
  const g = geo(), v = g.vil[i], r = prng(500 + i * 13 + w * 977);
  const dep = t0 + r() * .55 + (i / g.vil.length) * .25, dur = 1.05 + r() * .25, u = (t - dep) / dur;
  return { v, dep, dur, u, lift: 360 + r() * 260, bend: (r() - .5) * 700, ph: r() * TAU };
}
export function drawPayments(ctx, t, waves, o = {}) {
  const g = geo(), sp = glowSpr('#ffb35c', 64), core = glowSpr('#fff1d6', 32);
  const { x: sx, y: sy } = g.rose;
  for (let w = 0; w < waves.length; w++) for (let i = 0; i < g.vil.length; i++) {
    const p = payment(i, w, t, waves[w]); if (p.u <= 0 || p.u >= 1) continue;
    const e = sm(p.u), ex = p.v.x, ey = p.v.y, cx = mix(sx, ex, .5) + p.bend, cy = mix(sy, ey, .5) - p.lift;
    const x = (1 - e) ** 2 * sx + 2 * (1 - e) * e * cx + e * e * ex, y = (1 - e) ** 2 * sy + 2 * (1 - e) * e * cy + e * e * ey;
    const h = Math.sin(Math.PI * e), s = 1 + .7 * h;                       // height above the paper: bigger, shadow further off
    // the shadow on the paper
    ctx.fillStyle = rgba('#3a2010', .18 * (1 - .5 * h)); ctx.beginPath(); ctx.ellipse(x + 40 * h, y + 70 * h, 16 * s, 9 * s, 0, 0, TAU); ctx.fill();
    // a short trail
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let q = 1; q <= 5; q++) { const e2 = sm(clamp(p.u - q * .018)), X = (1 - e2) ** 2 * sx + 2 * (1 - e2) * e2 * cx + e2 * e2 * ex, Y = (1 - e2) ** 2 * sy + 2 * (1 - e2) * e2 * cy + e2 * e2 * ey; ctx.globalAlpha = .22 * (1 - q / 6); ctx.drawImage(sp, X - 30 * s, Y - 30 * s, 60 * s, 60 * s); }
    ctx.globalAlpha = .9; ctx.drawImage(sp, x - 62 * s, y - 62 * s, 124 * s, 124 * s);
    ctx.restore();
    // the foil chip itself (a tiny seal), turning
    ctx.save(); ctx.translate(x, y); ctx.rotate(p.ph + t * 2.2); const r0 = 26 * s; ctx.scale(1, .55 + .45 * Math.abs(Math.cos(t * 3 + p.ph))); ctx.drawImage(foilSeal(), -r0 * 1.3, -r0 * 1.3, r0 * 2.6, r0 * 2.6); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8; ctx.drawImage(core, x - 14 * s, y - 14 * s, 28 * s, 28 * s); ctx.restore();
  }
}
// landing ripples (a thin ring that opens on the paper where a light lands)
export function drawLandings(ctx, t, waves) {
  const g = geo();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let w = 0; w < waves.length; w++) for (let i = 0; i < g.vil.length; i++) {
    const p = payment(i, w, t, waves[w]), d = t - (p.dep + p.dur); if (d < 0 || d > .7) continue;
    const q = d / .7; ctx.strokeStyle = rgba('#ffcf8a', .55 * (1 - q)); ctx.lineWidth = 6 * (1 - q) + 1.5; ctx.beginPath(); ctx.arc(p.v.x, p.v.y, 20 + 90 * eout(q), 0, TAU); ctx.stroke();
  }
  ctx.restore();
}
// when village i first receives a light (for lit(i))
export const landT = (i, w, t0) => { const p = payment(i, w, 0, t0); return p.dep + p.dur; };

// ---------------------------------------------------------------- the inset vignette
export function drawMedallion(ctx, t, inner, o = {}) {
  const g = geo(), { x, y, r } = g.MED;
  // the leader line from the village cluster to the inset
  const c = g.vil[Math.floor(g.vil.length * .3)];
  ctx.strokeStyle = rgba(INKB, .55); ctx.lineWidth = 2.6; ctx.setLineDash([10, 9]);
  const a = Math.atan2(c.y - y, c.x - x); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (r + 30), y + Math.sin(a) * (r + 30)); ctx.lineTo(c.x - Math.cos(a) * 40, c.y - Math.sin(a) * 40); ctx.stroke(); ctx.setLineDash([]);
  // shadow, the picture, the engraved double ring with microtext
  ctx.fillStyle = 'rgba(60,35,15,.18)'; ctx.beginPath(); ctx.arc(x + 10, y + 14, r + 26, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip(); inner(ctx, x, y, r); ctx.restore();
  ctx.strokeStyle = rgba(INKB, .9); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, r + 24, 0, TAU); ctx.stroke();
  microRing(ctx, x, y, r + 12, 'A VILLAGE ROADSIDE · WESTERN KENYA', { size: 13, col: INKB, a: .75 });
}
