// Film 28 · B3 module 2: No. 1 flash floods (c13). Owned by builder B3; imports the shared kit, never edits it.
//   valleyWorld(ctx, c, t, st)   the valley seen from above at night (a map that is also a place): the big river, the flash-flood creek
//                                through a small town, tributaries from the hills, three gauges, the report dots, the forecast band, panels
//   newsPage · panel(kind) · alertUI (the phone screen = the ALERT panel: one drawing, so the dive into the panel can become the phone)
//   streetWorld(ctx, c, t, st)   the same town from the street, in the rain: you (yellow coat) with the phone, the water rising
//   envelope (the sealed methane letter, cool)
import { createCanvas, Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, lin, prng } = E;
const TAU = Math.PI * 2;
const COOL = F.COOL, WARM = F.WARM, INK = F.INK;
const WATER = mixHex(P.night1, COOL.deep, .55), WATER_RIM = mixHex(COOL.deep, COOL.body, .3);

// ================================================================================================================= POLYLINES
export function poly(pts, n = 8) {
  const q = E.catmull(pts, n).map((p) => [p[0], p[1]]), L = [0];
  for (let i = 1; i < q.length; i++) L.push(L[i - 1] + Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]));
  const path = new Path2D(); q.forEach((p, i) => (i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1])));
  return { pts: q, L, len: L[L.length - 1], path };
}
export function polyAt(R, s) {
  s = Math.min(R.len, Math.max(0, s)); let lo = 0, hi = R.L.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (R.L[m] <= s) lo = m; else hi = m; }
  const a = R.pts[lo], b = R.pts[hi], u = (s - R.L[lo]) / ((R.L[hi] - R.L[lo]) || 1);
  return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2(b[1] - a[1], b[0] - a[0])];
}
function pathRange(ctx, R, s0, s1) {
  const p0 = polyAt(R, s0), p1 = polyAt(R, s1); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]);
  for (let i = 0; i < R.pts.length; i++) if (R.L[i] > s0 && R.L[i] < s1) ctx.lineTo(R.pts[i][0], R.pts[i][1]);
  ctx.lineTo(p1[0], p1[1]);
}
const nearestS = (R, x, y) => { let best = 1e9, bs = 0; for (let i = 0; i < R.pts.length; i++) { const d = Math.hypot(R.pts[i][0] - x, R.pts[i][1] - y); if (d < best) { best = d; bs = R.L[i]; } } return bs; };
const distTo = (R, x, y) => { let best = 1e9; for (const p of R.pts) best = Math.min(best, Math.hypot(p[0] - x, p[1] - y)); return best; };
const pxScale = (ctx) => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b) || 1; };   // screen px per design px (for screen-constant strokes)

// ================================================================================================================= THE VALLEY (top-down)
// Design px on the F0 card. The town sits on the creek at TOWN; the creek runs into the big river (MAIN) at the bottom.
export const TOWN = [960, 540];
export const RIV = {
  main: poly([[-2900, 1540], [-1700, 1330], [-800, 1460], [100, 1270], [1000, 1400], [1900, 1210], [2800, 1330], [3700, 1170], [4900, 1280]]),
  stream: poly([[1580, -1700], [1430, -820], [1180, -160], [1010, 280], [960, 540], [905, 820], [975, 1130], [1000, 1395]]),
  tribs: [
    [[-1500, -1500], [-1250, -500], [-1500, 350], [-1700, 1335]],
    [[-450, -1600], [-250, -700], [-520, 200], [-800, 1455]],
    [[2450, -1600], [2520, -600], [2150, 350], [1900, 1212]],
    [[3600, -1200], [3260, -150], [3400, 650], [2800, 1330]],
    [[260, -1400], [480, -560], [760, -60], [1010, 282]],
    [[2050, -1000], [1700, -330], [1180, -160]],
    [[-2600, -700], [-2150, 450], [-1700, 1335]],
    [[-1000, -300], [-700, 400], [-520, 200]],
  ].map((p) => poly(p)),
};
const S_TOWN = nearestS(RIV.stream, TOWN[0], TOWN[1]);
const ALL_RIV = [RIV.main, RIV.stream, ...RIV.tribs];
// the three gauges (the only places anyone measures)
export const GAUGES = [polyAt(RIV.main, RIV.main.len * .27), polyAt(RIV.main, RIV.main.len * .76), polyAt(RIV.tribs[2], RIV.tribs[2].len * .42)];
// the town: streets (the alley = the east half of the middle street), houses, street lights
const STREETS = [[[600, 430], [1300, 430]], [[600, 540], [1340, 540]], [[640, 650], [1280, 650]], [[760, 360], [760, 730]], [[1170, 350], [1170, 730]]];
const TOWNSET = (() => {
  const r = prng(1301), houses = [], lights = [];
  for (const [[x0, y0], [x1, y1]] of STREETS) {
    const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, horiz = Math.abs(ux) > .5;
    for (let s = 30; s < L - 20; s += 56 + r() * 10) for (const side of [-1, 1]) {
      const cx = x0 + ux * s - uy * side * 34, cy = y0 + uy * s + ux * side * 34;
      if (distTo(RIV.stream, cx, cy) < 56) continue;
      if (horiz && (Math.abs(cx - 760) < 40 || Math.abs(cx - 1170) < 40)) continue;
      if (!horiz && [430, 540, 650].some((yy) => Math.abs(cy - yy) < 40)) continue;
      houses.push({ x: cx, y: cy, w: (horiz ? 40 : 30) + r() * 8, h: (horiz ? 30 : 40) + r() * 6, rot: (r() - .5) * .08, win: r() < .45, k: r() });
    }
    for (let s = 60; s < L; s += 130) { const x = x0 + ux * s, y = y0 + uy * s; if (distTo(RIV.stream, x, y) < 30) continue; lights.push({ x: x + uy * 14, y: y - ux * 14, alley: y0 === 540 && x > 960, k: r() }); }
  }
  return { houses, lights };
})();
// report dots: sampled along the rivers (creeks and tributaries dense, the big river sparse), each with its distance from the page burst
export const DOT_C = [945, 180];
const DOTS = (() => {
  const r = prng(2606), out = [];
  const g = () => { let s = 0; for (let i = 0; i < 4; i++) s += r(); return (s - 2) / 2; };
  const add = (R, dens) => { const n = Math.round(R.len * dens); for (let i = 0; i < n; i++) { const p = polyAt(R, r() * R.len), off = g() * 46; out.push([p[0] - Math.sin(p[2]) * off, p[1] + Math.cos(p[2]) * off, r()]); } };
  add(RIV.stream, .2); RIV.tribs.forEach((R) => add(R, .12)); add(RIV.main, .05);
  for (let i = 0; i < 120; i++) out.push([-2400 + r() * 6400, -1400 + r() * 3000, r()]);
  for (const d of out) d.push(Math.hypot(d[0] - DOT_C[0], d[1] - DOT_C[1]));
  return out;
})();
export const DOT_MAX = Math.max(...DOTS.map((d) => d[3]));
export const HOT = [[TOWN[0], TOWN[1] - 40, 1], [-1290, -380, .7], [2380, -250, .6], [520, -420, .8]];
// the forecast band on the big river: from the creek's mouth downstream; a riverside place at its end (where the panels rise)
export const BAND = { s0: nearestS(RIV.main, 1000, 1400), s1: nearestS(RIV.main, 3300, 1240) };
export const PLACE = (() => { const p = polyAt(RIV.main, BAND.s1); return [p[0] + 30, p[1] - 90]; })();
export const PANELS = { search: [3050, 830], maps: [3300, 830], alert: [3550, 830], w: 160 };   // centres (design px), width; height = w × PANEL_AR
export const PANEL_AR = 1.8;
const CONTOURS = (() => { const r = prng(77), out = []; for (const [cx, cy, n] of [[-700, -600, 7], [2300, -800, 7], [500, -1100, 5], [3800, 300, 5]]) for (let k = 1; k <= n; k++) { const R = 180 * k + r() * 40, ph = r() * TAU, pts = []; for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU, rr = R * (1 + .08 * Math.sin(a * 3 + ph) + .05 * Math.sin(a * 5 + ph * 2)); pts.push([cx + Math.cos(a) * rr * 1.25, cy + Math.sin(a) * rr]); } out.push(pts); } return out; })();
const RINGS = (() => { const r = prng(808), a = []; for (let i = 0; i < 90; i++) a.push([r(), r(), r()]); return a; })();

// st: { flood 0..1 (the creek swells, the alley fills), trace 0..1 (the machine's look runs out along the rivers from the town),
//   gauge 0..1, dots(t) → time each dot lands (null = none), dotA, hot 0..1, band 0..1, bandA, panels: { search, maps, alert } 0..1,
//   front(ctx) (drawn last on F0) }
export function valleyWorld(ctx, c, t, st = {}) {
  E.card(ctx, c, 30000, () => { ctx.fillStyle = P.night0; ctx.fillRect(-9e4, -9e4, 2e5, 2e5); });
  E.card(ctx, c, E.F0, () => {
    const ps = pxScale(ctx);
    // the land: dark, a faint lift toward the hills, contour lines
    ctx.fillStyle = lin(ctx, 0, -1800, 0, 1900, [[0, mixHex(P.night1, P.ind0, .35)], [.6, P.night1], [1, mixHex(P.night0, P.night1, .5)]]); ctx.fillRect(-9000, -6000, 20000, 12000);
    ctx.strokeStyle = rgba(INK.rim, .07); ctx.lineWidth = 2.2;
    for (const pts of CONTOURS) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    // rivers
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const river = (R, w) => { ctx.strokeStyle = rgba(COOL.deep, .3); ctx.lineWidth = w + 12; ctx.stroke(R.path); ctx.strokeStyle = WATER; ctx.lineWidth = w; ctx.stroke(R.path); ctx.strokeStyle = rgba(WATER_RIM, .45); ctx.lineWidth = Math.max(1.2, w * .14); ctx.stroke(R.path); };
    for (const R of RIV.tribs) river(R, 9);
    river(RIV.stream, 13); river(RIV.main, 66);
    // the flood: the creek swells through the town, water runs into the alley and the cross streets
    const fl = clamp(st.flood ?? 0);
    if (fl > 0) {
      const sw = 13 + 58 * fl;
      ctx.strokeStyle = rgba(COOL.deep, .3); ctx.lineWidth = sw + 16; pathRange(ctx, RIV.stream, S_TOWN - 520, S_TOWN + 560); ctx.stroke();
      ctx.strokeStyle = WATER; ctx.lineWidth = sw; ctx.stroke();
      const fa = smooth(span(fl, .25, 1)), seg = (x0, y0, x1, y1, w) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = rgba(COOL.deep, .3); ctx.lineWidth = w + 12; ctx.stroke(); ctx.strokeStyle = WATER; ctx.lineWidth = w; ctx.stroke(); ctx.strokeStyle = rgba(WATER_RIM, .5); ctx.lineWidth = 2; ctx.stroke(); };
      if (fa > 0) { seg(960, 540, 960 + 380 * fa, 540, 20 + 6 * fa); seg(960, 540, 960 - 170 * fa, 540, 16); seg(1000, 430, 1000 + 150 * fa, 430, 12); seg(930, 650, 930 - 140 * fa, 650, 12); }
    }
    // the town (roofs, streets, lights): the street lights in the alley go out when the water reaches them
    ctx.strokeStyle = mixHex(P.night1, P.ind1, .7); ctx.lineWidth = 16; ctx.lineCap = 'butt';
    for (const [[x0, y0], [x1, y1]] of STREETS) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
    if (fl > 0) { const fa = smooth(span(fl, .25, 1)); ctx.lineCap = 'round'; ctx.strokeStyle = WATER; ctx.lineWidth = 18 + 6 * fa; if (fa > 0) { ctx.beginPath(); ctx.moveTo(960, 540); ctx.lineTo(960 + 380 * fa, 540); ctx.stroke(); } }
    ctx.lineCap = 'round';
    const wx = 960 + 380 * smooth(span(fl, .25, 1));
    for (const L of TOWNSET.lights) {
      const out = L.alley ? smooth(span(wx - L.x, -6, 26)) : 0, a = (1 - out) * (.85 + .15 * Math.sin(t * 2.3 + L.k * 9));
      if (a <= .01) continue; halo(ctx, L.x, L.y, 42, .5 * a, P.halo0, P.core1); ctx.fillStyle = rgba(P.core1, a); ctx.beginPath(); ctx.arc(L.x, L.y, 3.4, 0, TAU); ctx.fill();
    }
    for (const h of TOWNSET.houses) {
      ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(h.rot);
      ctx.fillStyle = lin(ctx, -h.w / 2, 0, h.w / 2, 0, [[0, mixHex(INK.mid, P.ind1, .4)], [.5, mixHex(INK.mid, P.ind1, .4)], [.5, INK.near], [1, mixHex(INK.near, P.night0, .4)]]);
      ctx.fillRect(-h.w / 2, -h.h / 2, h.w, h.h);
      ctx.strokeStyle = rgba(INK.rim, .35); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -h.h / 2); ctx.lineTo(0, h.h / 2); ctx.stroke();
      if (h.win) { ctx.fillStyle = rgba(P.core1, .75); ctx.fillRect(-h.w * .32, -h.h * .18, h.w * .16, h.h * .3); }
      ctx.restore();
    }
    // rain rings on the swollen water near the town (and on the big river, fewer)
    if (fl > 0) for (let i = 0; i < 60; i++) {
      const [u, v, k] = RINGS[i], ph = (t * (.9 + .5 * k) + k * 7) % 1, inAlley = i % 3 === 0, fa = smooth(span(fl, .25, 1));
      const p = inAlley ? [960 + 380 * fa * u, 540 + (v - .5) * 14] : polyAt(RIV.stream, S_TOWN - 500 + u * 1050);
      const off = inAlley ? 0 : (v - .5) * (10 + 50 * fl);
      ctx.strokeStyle = rgba(COOL.line, .45 * (1 - ph) * fl); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(p[0] - Math.sin(p[2] ?? 0) * off, p[1] + Math.cos(p[2] ?? 0) * off, 3 + 12 * ph, 3 + 12 * ph, 0, 0, TAU); ctx.stroke();
    }
    // the machine's look: a thin cool line runs out along every river from the town; the three gauges are the only lights it finds
    const tr = clamp(st.trace ?? 0), ta = st.traceA ?? 1;
    if (tr > 0 && ta > 0) {
      const R0 = 3600 * tr; ctx.save(); ctx.globalAlpha *= ta; ctx.strokeStyle = rgba(COOL.body, .5); ctx.lineWidth = 2.4 / ps;
      for (const R of ALL_RIV) { ctx.beginPath(); let on = false; for (const p of R.pts) { const d = Math.hypot(p[0] - TOWN[0], p[1] - TOWN[1]); if (d < R0) { on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; } else on = false; } ctx.stroke(); }
      ctx.restore();
    }
    const ga = clamp(st.gauge ?? 0);
    for (const g of GAUGES) {
      const d = Math.hypot(g[0] - TOWN[0], g[1] - TOWN[1]), on = tr > 0 ? smooth(span(3600 * tr - d, 0, 260)) : 0, a = Math.max(on, ga * .0) * (st.gaugeA ?? 1); if (a <= 0) continue;
      const ping = span(3600 * tr - d, 0, 900), r = 9 / ps * (1 + .1 * Math.sin(t * 3));
      halo(ctx, g[0], g[1], 90 / ps, .7 * a, COOL.halo, COOL.body);
      ctx.fillStyle = rgba(COOL.core, a); ctx.fillRect(g[0] - r, g[1] - r, 2 * r, 2 * r);
      if (ping < 1) { ctx.strokeStyle = rgba(COOL.line, .8 * (1 - ping) * a); ctx.lineWidth = 2 / ps; ctx.beginPath(); ctx.arc(g[0], g[1], (12 + 70 * expoOut(ping)) / ps, 0, TAU); ctx.stroke(); }
    }
    // report dots (one per old news report): they drop onto the rivers in a wave from the page burst; hot places glow when the A.I. learns
    if (st.dots) {
      const hot = clamp(st.hot ?? 0), da = st.dotA ?? 1;
      if (hot > 0) for (const [x, y, k] of HOT) halo(ctx, x, y, 420 * k * (.6 + .4 * hot), .55 * hot * k * (.85 + .15 * Math.sin(t * 2 + x)), COOL.halo, COOL.body);
      for (const d of DOTS) {
        const t0 = st.dots(d); if (t0 == null || t < t0) continue;
        const u = span(t, t0, t0 + .35), heat = hot > 0 ? Math.max(...HOT.map(([x, y, k]) => k * clamp(1 - Math.hypot(d[0] - x, d[1] - y) / 420))) : 0;
        const a = da * F.rise(u) * lerp(1, .35 + 1.1 * heat, hot), r = (3.4 / ps) * (1 + .8 * (1 - u)) * (1 + .5 * heat * hot);
        ctx.fillStyle = rgba(mixHex(COOL.body, COOL.core, heat * hot), Math.min(1, a)); ctx.beginPath(); ctx.arc(d[0], d[1] - 30 * (1 - expoOut(u)), r, 0, TAU); ctx.fill();
      }
    }
    // the forecast band: a cool stripe runs downstream from the creek's mouth, a tick for each day (7)
    const bd = clamp(st.band ?? 0), ba = st.bandA ?? 1;
    if (bd > 0 && ba > 0) {
      ctx.save(); ctx.globalAlpha *= ba; const s1 = lerp(BAND.s0, BAND.s1, bd);
      pathRange(ctx, RIV.main, BAND.s0, s1); ctx.strokeStyle = rgba(COOL.body, .24); ctx.lineWidth = 118; ctx.stroke(); ctx.strokeStyle = rgba(COOL.line, .55); ctx.lineWidth = 3 / ps; ctx.stroke();
      const hd = polyAt(RIV.main, s1); halo(ctx, hd[0], hd[1], 130, .55, COOL.halo, COOL.core);
      for (let k = 0; k <= 7; k++) {
        const sk = lerp(BAND.s0, BAND.s1, k / 7); if (sk > s1 + 1) break; const p = polyAt(RIV.main, sk), nx = -Math.sin(p[2]), ny = Math.cos(p[2]), u = F.rise(span(s1 - sk, 0, 120));
        ctx.strokeStyle = rgba(k === 7 ? P.cream : COOL.line, .9 * u); ctx.lineWidth = (k === 7 ? 4 : 2.5) / ps; ctx.beginPath(); ctx.moveTo(p[0] - nx * 74, p[1] - ny * 74); ctx.lineTo(p[0] + nx * 74, p[1] + ny * 74); ctx.stroke();
      }
      ctx.restore();
    }
    // the riverside place at the band's end (warm: people), the panels rise out of it
    { const r = prng(31); for (let i = 0; i < 14; i++) { const x = PLACE[0] + (r() - .5) * 220, y = PLACE[1] + (r() - .5) * 90; halo(ctx, x, y, 34, .45, P.halo0, P.core1); ctx.fillStyle = rgba(P.core1, .9); ctx.fillRect(x - 3, y - 3, 6, 6); } }
    if (st.panels) for (const kind of ['search', 'maps', 'alert']) {
      const u = clamp(st.panels[kind] ?? 0); if (u <= 0) continue;
      const [px, py] = PANELS[kind], e = expoOut(u), x = lerp(PLACE[0], px, e), y = lerp(PLACE[1], py, e), w = PANELS.w * lerp(.15, 1, e), h = w * PANEL_AR;
      const pa = kind === 'alert' ? 1 : st.panelsA ?? 1; if (pa <= 0) continue;   // the dive into ALERT: the other two step back
      ctx.save(); ctx.globalAlpha *= pa; panel(ctx, t, kind, x - w / 2, y - h / 2, w, h, { a: F.rise(u * 1.6) });
      if (u > .4) F.maskLine(ctx, [[kind.toUpperCase(), 0]], x, y + h / 2 + 46, 26, F.rise(span(u, .4, 1)), { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
      ctx.restore();
    }
    if (st.front) st.front(ctx);
  });
}
// where a dot lands: the page burst's wave (radius R world px at time t) passes it
export const waveR = (t, t0, t1) => 140 + (DOT_MAX + 200) * sineIO(span(t, t0, t1)) ** .9;
export function dotTime(d, t0, t1) {
  // invert waveR: the time when the wave reaches distance d[3] (+ a little seeded jitter)
  const x = clamp((d[3] - 140) / (DOT_MAX + 200)), u = Math.acos(1 - 2 * Math.pow(x, 1 / .9)) / Math.PI;
  return t0 + (t1 - t0) * u + d[2] * .25;
}

// ================================================================================================================= THE NEWS PAGE
// an old newspaper page (yellowed paper, a headline bar, two columns of lines, a small picture): centre (x, y), width s, rot
export function newsPage(ctx, x, y, s, rot = 0, a = 1) {
  if (a <= 0 || s < 1) return; const w = s, h = s * 1.3;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  halo(ctx, 0, 0, s * 1.1, .18, P.halo1, P.halo2);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(P.cream, P.halo2, .35)], [1, mixHex(P.halo2, P.shade0, .25)]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = rgba(P.night1, .8); ctx.fillRect(-w * .4, -h * .42, w * .8, h * .08);
  ctx.fillStyle = rgba(P.night1, .35); ctx.fillRect(-w * .4, -h * .28, w * .37, h * .22);
  for (let i = 0; i < 7; i++) { const yy = -h * .02 + i * h * .06; ctx.fillRect(-w * .4, yy, w * .37, Math.max(.6, h * .018)); }
  for (let i = 0; i < 11; i++) { const yy = -h * .28 + i * h * .06; ctx.fillRect(w * .03, yy, w * .37 * (i === 10 ? .6 : 1), Math.max(.6, h * .018)); }
  ctx.restore();
}

// ================================================================================================================= PANELS + THE PHONE SCREEN
// one panel: (x, y) top left, w × h (h = w × PANEL_AR). kind 'search' | 'maps' | 'alert'. Every size is relative to w, so the ALERT panel and
// the phone screen draw the same pixels at the same screen rect (the dive into the panel becomes the phone).
export function panel(ctx, t, kind, x, y, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || w < 2) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (o.glow !== false) halo(ctx, x + w / 2, y + h / 2, w * 1.1, .3, COOL.halo, COOL.body);
  if (kind === 'alert') { alertUI(ctx, t, x, y, w, h); ctx.restore(); return; }
  screenBase(ctx, x, y, w, h);
  if (kind === 'search') {
    ctx.fillStyle = rgba(COOL.body, .9); ctx.beginPath(); ctx.roundRect(x + w * .08, y + h * .1, w * .84, w * .14, w * .07); ctx.fill();
    ctx.strokeStyle = P.night1; ctx.lineWidth = w * .02; ctx.beginPath(); ctx.arc(x + w * .17, y + h * .1 + w * .07, w * .03, 0, TAU); ctx.stroke();
    ctx.fillStyle = rgba(P.night1, .7); ctx.fillRect(x + w * .25, y + h * .1 + w * .06, w * .4, w * .02);
    ctx.fillStyle = rgba(mixHex(COOL.deep, P.night1, .3), .95); ctx.beginPath(); ctx.roundRect(x + w * .08, y + h * .25, w * .84, h * .28, w * .05); ctx.fill();
    ctx.strokeStyle = COOL.body; ctx.lineWidth = w * .025; ctx.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20, xx = x + w * (.16 + .68 * u), yy = y + h * .36 + Math.sin(u * TAU * 1.5 + t * 2) * w * .04; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
    ctx.fillStyle = rgba(COOL.line, .55); ctx.fillRect(x + w * .16, y + h * .46, w * .5, w * .025);
    for (let i = 0; i < 4; i++) { ctx.fillStyle = rgba(COOL.line, .25); ctx.fillRect(x + w * .1, y + h * (.6 + i * .08), w * (.75 - .1 * (i % 2)), w * .025); }
  } else if (kind === 'maps') {
    ctx.save(); ctx.beginPath(); ctx.roundRect(x + w * .06, y + h * .08, w * .88, h * .84, w * .05); ctx.clip();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = rgba(INK.rim, .35); ctx.lineWidth = w * .015; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x, y + h * (.1 + i * .17)); ctx.lineTo(x + w, y + h * (.18 + i * .15)); ctx.stroke(); }
    const fx = x + w * .5, fy = y + h * .52;
    ctx.fillStyle = rgba(COOL.body, .38 + .08 * Math.sin(t * 2.4)); ctx.beginPath(); ctx.ellipse(fx, fy, w * .38, h * .2, -.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = COOL.body; ctx.lineWidth = w * .05; ctx.beginPath(); ctx.moveTo(x - w * .1, y + h * .2); ctx.bezierCurveTo(x + w * .4, y + h * .35, x + w * .55, y + h * .65, x + w * 1.1, y + h * .82); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
function screenBase(ctx, x, y, w, h) {
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(P.night1, COOL.deep, .45)], [1, mixHex(P.night0, COOL.deep, .25)]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, w * .09); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .85); ctx.lineWidth = w * .02; ctx.stroke();
}
// the phone screen with a flood alert (the notification card sits at the vertical centre, so a full-frame dive lands on it)
export function alertUI(ctx, t, x, y, w, h) {
  screenBase(ctx, x, y, w, h);
  ctx.fillStyle = rgba(COOL.line, .4); ctx.fillRect(x + w * .1, y + h * .05, w * .2, w * .03); ctx.fillRect(x + w * .72, y + h * .05, w * .18, w * .03);
  const cx = x + w * .07, cw = w * .86, ch = w * .5, cy = y + h * .5 - ch / 2, pu = .5 + .5 * Math.sin(t * 3.2);
  halo(ctx, x + w / 2, y + h / 2, w * .7, .25 + .1 * pu, COOL.halo, COOL.core);
  ctx.fillStyle = lin(ctx, 0, cy, 0, cy + ch, [[0, mixHex(COOL.body, COOL.deep, .25)], [1, mixHex(COOL.body, COOL.deep, .45)]]); ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, w * .06); ctx.fill();
  // warning triangle + FLOOD WARNING + two lines
  const tx = cx + cw * .14, ty = cy + ch * .36, ts = cw * .13;
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.moveTo(tx, ty - ts * .55); ctx.lineTo(tx + ts * .6, ty + ts * .5); ctx.lineTo(tx - ts * .6, ty + ts * .5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = COOL.body; ctx.fillRect(tx - ts * .06, ty - ts * .2, ts * .12, ts * .38); ctx.fillRect(tx - ts * .06, ty + ts * .26, ts * .12, ts * .1);
  const fs = cw * .066;
  if (fs * pxScale(ctx) > 5) {   // drawn in screen px (same glyphs whichever world draws this screen: the ALERT panel and the phone match at the switch)
    const m = ctx.getTransform(), k = pxScale(ctx), X = m.a * (cx + cw * .27) + m.c * (ty + fs * .38) + m.e, Y = m.b * (cx + cw * .27) + m.d * (ty + fs * .38) + m.f;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); E.glowText(ctx, 'FLOOD WARNING', X, Y, { size: fs * k, weight: 700, col: P.night1, glow: false }); ctx.restore();
  }
  else { ctx.fillStyle = rgba(P.night1, .8); ctx.fillRect(cx + cw * .27, ty - fs * .3, cw * .62, fs * .6); }
  ctx.fillStyle = rgba(P.night1, .55); ctx.fillRect(cx + cw * .08, cy + ch * .66, cw * .78, ch * .07); ctx.fillRect(cx + cw * .08, cy + ch * .82, cw * .5, ch * .07);
}

// ================================================================================================================= THE STREET (you, the phone, the water)
// Side view, design px on F0. The street runs gently down to the left (the creek) and climbs steeply to the right (uphill = safety).
export const groundY = (x) => (x < 760 ? 919.4 + (760 - x) * .035 : x < 1560 ? 919.4 - (x - 760) * .19 : 767.4);
export const waterX = (wy) => (wy > 919.4 ? 760 - (wy - 919.4) / .035 : 760 + (919.4 - wy) / .19);
export const YOU_H = 330, LAMP_X = 560;
const PHONE = { w: .074, ar: PANEL_AR };   // phone screen width in units of your height; screen aspect = the ALERT panel's
const SCRATCH = createCanvas(4, 4).getContext('2d');
// you + where the phone screen is (world rect) for a given state: { x, pose, walk, dir, armR, lean, look }
export function youPose(s) {
  const y = groundY(s.x), o = { pose: s.pose ?? 'hold', walk: s.walk, view: s.view, dir: s.dir ?? 1, armR: s.armR, lean: s.lean, look: s.look ?? .15, light: -1, back: .25 };
  const hands = E.du(SCRATCH, s.x, y, YOU_H, o);
  const hw = YOU_H * PHONE.w, hh = hw * PHONE.ar, hp = hands.R;
  return { o, y, phone: { x: hp[0] - hw / 2, y: hp[1] - hh * .62, w: hw, h: hh } };
}
const HOUSES_L = (() => { const r = prng(515), a = []; let x = -1500; while (x < 520) { const w = 170 + r() * 90; a.push({ x, w, h: 230 + r() * 150, k: r() }); x += w + 14 + r() * 30; } return a; })();
const HOUSES_R = (() => { const r = prng(516), a = []; let x = 1240; while (x < 3200) { const w = 170 + r() * 80; a.push({ x, w, h: 200 + r() * 140, k: r() }); x += w + 20 + r() * 30; } return a; })();
function house(ctx, h, base, t, lights = 1) {
  ctx.fillStyle = lin(ctx, 0, base - h.h, 0, base, [[0, INK.near], [1, P.night0]]);
  ctx.beginPath(); ctx.moveTo(h.x, base + 40); ctx.lineTo(h.x, base - h.h); ctx.lineTo(h.x + h.w / 2, base - h.h - h.w * .32); ctx.lineTo(h.x + h.w, base - h.h); ctx.lineTo(h.x + h.w, base + 40); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(INK.rim, .3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(h.x, base - h.h); ctx.lineTo(h.x + h.w / 2, base - h.h - h.w * .32); ctx.lineTo(h.x + h.w, base - h.h); ctx.stroke();
  const r = prng(Math.floor(h.k * 1e6));
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { if (r() < .4) continue; const wx = h.x + h.w * (.2 + j * .38), wy = base - h.h * (.78 - i * .38), a = lights * (.7 + .3 * Math.sin(t * 1.3 + i + j * 2 + h.k * 9));
    halo(ctx, wx + h.w * .1, wy + 22, 60, .22 * a, P.halo0, P.core1); ctx.fillStyle = mixHex(P.shade0, P.core1, .7 * a); ctx.fillRect(wx, wy, h.w * .2, 44); }
  ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.fillRect(h.x + h.w * .62, base - 92, 40, 92);   // door
}
// st: { wy (water surface y), you: youPose state, phone: { lit 0..1, warm 0..1 }, lamp 0..1, front(ctx) (on F0, after you) } → you (youPose)
export function streetWorld(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: [900, 380, 1200], hor: 700, stars: .2 });
  E.card(ctx, c, 9000, () => F.hills(ctx, [[-2600, 700], [-1200, 640], [0, 690], [1200, 610], [2400, 650], [3800, 600]], { top: mixHex(P.ind0, P.blue0, .3), bottom: P.night1, rimA: .3 }));
  E.card(ctx, c, 4200, () => {   // the far town, uphill
    const r = prng(4201); let x = -2200;
    while (x < 4200) { const w = 120 + r() * 120, hh = 90 + r() * 120, base = 760 - Math.max(0, x - 800) * .08; ctx.fillStyle = mixHex(P.night1, P.ind1, .45); ctx.fillRect(x, base - hh, w, hh + 400);
      if (r() < .5) { const wx = x + w * (.2 + r() * .5), wy = base - hh * (.4 + r() * .4); halo(ctx, wx, wy, 26, .35, P.halo0, P.core1); ctx.fillStyle = rgba(P.core1, .8); ctx.fillRect(wx - 5, wy - 7, 10, 14); }
      x += w + 10 + r() * 40; }
  });
  E.card(ctx, c, 2600, () => {   // the middle houses
    const r = prng(2602); let x = -2000;
    while (x < 3600) { const w = 160 + r() * 110, hh = 160 + r() * 160, base = 860 - Math.max(0, x - 900) * .14; ctx.fillStyle = mixHex(P.night1, INK.mid, .5); ctx.fillRect(x, base - hh, w, hh + 600);
      ctx.fillStyle = mixHex(P.night1, INK.mid, .5); ctx.beginPath(); ctx.moveTo(x - 6, base - hh); ctx.lineTo(x + w / 2, base - hh - w * .3); ctx.lineTo(x + w + 6, base - hh); ctx.fill();
      if (r() < .55) { const wx = x + w * (.2 + r() * .5), wy = base - hh * (.35 + r() * .4); halo(ctx, wx, wy, 40, .3, P.halo0, P.core1); ctx.fillStyle = rgba(P.core1, .75); ctx.fillRect(wx - 8, wy - 11, 16, 22); }
      x += w + 16 + r() * 40; }
  });
  let you = null;
  E.card(ctx, c, E.F0, () => {
    // the street
    const gp = new Path2D(); gp.moveTo(-5000, groundY(-5000)); for (let x = -5000; x <= 6000; x += 40) gp.lineTo(x, groundY(x)); gp.lineTo(6000, 3000); gp.lineTo(-5000, 3000); gp.closePath();
    for (const h of HOUSES_L) house(ctx, h, groundY(h.x + h.w / 2) + 6, t);
    for (const h of HOUSES_R) house(ctx, h, groundY(h.x) + 10, t);
    ctx.fillStyle = lin(ctx, 0, 760, 0, 1300, [[0, mixHex(P.night1, P.ind1, .45)], [1, P.night0]]); ctx.fill(gp);
    ctx.strokeStyle = rgba(P.blue0, .4); ctx.lineWidth = 2.5; ctx.beginPath(); for (let x = -5000; x <= 6000; x += 40) x === -5000 ? ctx.moveTo(x, groundY(x)) : ctx.lineTo(x, groundY(x)); ctx.stroke();
    // the street lamp (warm: people), its pool on the wet street
    const la = clamp(st.lamp ?? 1), lx = LAMP_X, ly = groundY(lx);
    ctx.fillStyle = INK.near; ctx.fillRect(lx - 5, ly - 380, 10, 380); ctx.fillRect(lx - 5, ly - 384, 46, 8);
    if (la > 0) { halo(ctx, lx + 36, ly - 366, 260, .45 * la, P.halo0, P.core1); F.pool(ctx, lx + 30, ly + 10, 260, 30, .9 * la); }
    ctx.fillStyle = mixHex(INK.near, P.core1, .9 * la); ctx.beginPath(); ctx.ellipse(lx + 36, ly - 368, 18, 9, 0, 0, TAU); ctx.fill();
    // you
    if (st.you) {   // st.you2 + st.mix: a short blend between two poses (standing → running), the phone between both hands
      const yp = youPose(st.you), m = clamp(st.mix ?? 0), y2 = m > 0 && st.you2 ? youPose(st.you2) : null;
      if (m < 1) { ctx.save(); ctx.globalAlpha *= y2 ? 1 - m : 1; E.du(ctx, st.you.x, yp.y, YOU_H, yp.o); ctx.restore(); }
      if (y2) { ctx.save(); ctx.globalAlpha *= m; E.du(ctx, st.you2.x, y2.y, YOU_H, y2.o); ctx.restore(); }
      const pr = y2 ? { x: lerp(yp.phone.x, y2.phone.x, m), y: lerp(yp.phone.y, y2.phone.y, m), w: yp.phone.w, h: yp.phone.h } : yp.phone;
      you = { ...yp, phone: pr }; phone(ctx, t, pr, st.phone ?? {});
    }
    // the water: rises from the creek (left), the lamp's reflection, rain rings
    const wy = st.wy ?? 990, xw = waterX(wy);
    if (xw > -5000) {
      ctx.save(); ctx.beginPath(); ctx.rect(-5000, wy, xw + 5000, 1600); ctx.clip();
      ctx.fillStyle = lin(ctx, 0, wy, 0, wy + 220, [[0, mixHex(WATER, COOL.body, .12)], [1, P.night0]]); ctx.fillRect(-5000, wy, xw + 5000, 1600);
      for (let k = 0; k < 10; k++) { const yy = wy + 6 + k * 13, ww = 70 * (1 - k / 12) * (.7 + .3 * Math.sin(t * 1.1 + k * 1.7)); ctx.fillStyle = rgba(P.halo0, .5 * la * (1 - k / 10)); ctx.fillRect(lx + 36 - ww / 2 + 6 * Math.sin(t * .8 + k), yy, ww, 3); }
      ctx.strokeStyle = rgba(WATER_RIM, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-5000, wy + 1); ctx.lineTo(xw, wy + 1); ctx.stroke();
      for (let i = 0; i < 40; i++) { const [u, v, k] = RINGS[i], ph = (t * (1 + .6 * k) + k * 5) % 1, x = xw - 30 - u * 1900; if (x < -1200) continue; ctx.strokeStyle = rgba(COOL.line, .4 * (1 - ph)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, wy + 4 + v * 40, 4 + 22 * ph, (4 + 22 * ph) * .22, 0, 0, TAU); ctx.stroke(); }
      ctx.restore();
    }
    if (st.front) st.front(ctx, you);
  });
  return you;
}
// the phone in your hand: a dark body round the screen rect r; the screen is the alert (cool); warm = the light of someone acting
export function phone(ctx, t, r, o = {}) {
  const lit = clamp(o.lit ?? 1), warm = clamp(o.warm ?? 0), b = r.w * .1;
  if (lit > 0) {
    halo(ctx, r.x + r.w / 2, r.y + r.h / 2, r.w * (3.4 + 3 * warm), .4 * lit * (1 - warm * .4), COOL.halo, COOL.body);
    if (warm > 0) halo(ctx, r.x + r.w / 2, r.y + r.h / 2, r.w * (4 + 9 * warm), .6 * warm, P.halo0, P.core0);
  }
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(r.x - b, r.y - b * 1.6, r.w + 2 * b, r.h + 3.2 * b, r.w * .18); ctx.fill();
  if (lit > 0) { ctx.save(); ctx.globalAlpha *= lit; alertUI(ctx, t, r.x, r.y, r.w, r.h); ctx.restore(); }
  if (warm > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = rgba(P.core1, .8 * warm); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, r.w * .09); ctx.fill(); ctx.restore(); }
}
// the sealed methane letter (cool, glossy, shut): centre (x, y), width s
export function envelope(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < 1) return; const w = s, h = s * .62;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.tilt ?? 0);
  halo(ctx, 0, 0, s * 1.3, .28, COOL.halo, COOL.body);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(COOL.body, P.cream, .55)], [.5, COOL.body], [1, mixHex(COOL.deep, COOL.body, .5)]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, s * .04); ctx.fill();
  ctx.strokeStyle = rgba(COOL.deep, .75); ctx.lineWidth = Math.max(1, s * .03); ctx.beginPath(); ctx.moveTo(-w / 2 + s * .03, -h / 2 + s * .03); ctx.lineTo(0, h * .08); ctx.lineTo(w / 2 - s * .03, -h / 2 + s * .03); ctx.stroke();
  ctx.fillStyle = rgba(COOL.deep, .9); ctx.beginPath(); ctx.arc(0, h * .08, s * .06, 0, TAU); ctx.fill();   // the seal
  ctx.restore();
}
