// "Let's start with what he got right. When someone went back and graded the first three years of his story,
//  more than half of it had come true."
// The same 2021 notebook from s_check, top-down under the lamp. A grader's hand with a red-amber pen marks each
// prediction: tick or cross. Pages 2022, 2023, 2024 flip over. A gauge on the left fills with every tick and
// climbs past the halfway line on "half".
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, grainFill, lin, rad, rgba, light, out, clamp, stamp } = L;

const T0 = 61.06, T1 = 70.0;

const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn) {
  const S = 1.3;
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
function roundRect(ctx, x, y, w, h, r) { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

// ---------- handwriting (same generator as s_check) ----------
function scribble(r, x0, y0, len) {
  const pts = [], f = 0.42 + r() * 0.12, amp = 5 + r() * 2.5, ph = r() * 6;
  const spikes = []; for (let k = 0; k < len / 26; k++) spikes.push({ u: r() * len, h: (r() < 0.5 ? -1 : 0.7) * (8 + r() * 9) });
  for (let u = 0; u <= len; u += 1.6) {
    let y = -amp * Math.cos(u * f + ph);
    for (const s of spikes) y += s.h * Math.exp(-((u - s.u) ** 2) / 10);
    pts.push([x0 + u - 5.2 * Math.sin(u * f + ph), y0 + y + Math.sin(u * 0.05) * 1.5]);
  }
  return pts;
}
function makeRow(seed, x, y, maxW) {
  const r = rng(seed), words = []; let cx = x;
  const end = x + maxW * (0.55 + r() * 0.45);
  while (cx < end - 30) { const w = 24 + r() * 80; words.push(scribble(r, cx, y + (r() - 0.5) * 3, Math.min(w, end - cx))); cx += w + 16 + r() * 10; }
  return words;
}
function stroke(ctx, pts, k = 1) {
  const n = Math.max(2, Math.floor(pts.length * k)); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
}
function wob(pts, seed, a = 1.6) { const r = rng(seed); return pts.map(([x, y]) => [x + (r() - 0.5) * a, y + (r() - 0.5) * a]); }

const PAGE_W = 520, PAGE_H = 700;
// three spreads: the years he wrote about. verdict 1 = came true (tick), 0 = did not (cross)
const VERD = [[1, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1]];
const MT = [[65.16, 65.38, 65.6, 65.82], [66.52, 66.7, 66.88, 67.06, 67.24], [67.8, 67.98, 68.16, 68.38, 68.6]];
const FLIPS = [[65.95, 66.42], [67.33, 67.74]];
const SPREADS = VERD.map((v, si) => {
  const r = rng(300 + si), rows = [], subs = [];
  const nL = Math.min(3, v.length) + (si === 0 ? 1 : 0), ysL = [-205, -100, 5, 110], ysR = [-250, 40, 150, 250];
  v.forEach((g, i) => {
    const left = i < nL, y = left ? ysL[i] + (r() - 0.5) * 16 : ysR[i - nL] + (r() - 0.5) * 16, x = left ? -PAGE_W + 92 : 92;
    rows.push({ x, y, words: makeRow(500 + si * 20 + i, x, y, left ? 380 : 360), v: g, t: MT[si][i], rot: (r() - 0.5) * 0.3, s: 1 + r() * 0.12 });
    if (r() < 0.7) subs.push({ x: x + 28, y: y + 42, words: makeRow(600 + si * 20 + i, x + 28, y + 42, 200) });
  });
  return { year: String(2022 + si), rows, subs, chart: si };
});
const ALL = SPREADS.flatMap(s => s.rows);
const TICK_T = ALL.filter(r => r.v).map(r => r.t);
const NMARK = ALL.length;

const PLANKS = (() => { const r = rng(4), a = []; for (let i = 0; i < 26; i++) a.push({ y: -300 + i * 70 + r() * 20, w: 1 + r() * 2, k: r() }); return a; })();
const DUST = (() => { const r = rng(17), a = []; for (let i = 0; i < 46; i++) a.push({ x: r() * W, y: r() * H, s: 1 + r() * 2.4, p: r() * 6, v: 6 + r() * 14 }); return a; })();

const pageL = c => { c.moveTo(0, -PAGE_H / 2 + 8); c.bezierCurveTo(-170, -PAGE_H / 2 - 14, -360, -PAGE_H / 2 - 6, -PAGE_W, -PAGE_H / 2); c.lineTo(-PAGE_W, PAGE_H / 2); c.bezierCurveTo(-360, PAGE_H / 2 + 6, -170, PAGE_H / 2 - 4, 0, PAGE_H / 2 + 10); c.closePath(); };
const pageR = c => { c.moveTo(0, -PAGE_H / 2 + 8); c.bezierCurveTo(170, -PAGE_H / 2 - 14, 360, -PAGE_H / 2 - 6, PAGE_W, -PAGE_H / 2); c.lineTo(PAGE_W, PAGE_H / 2); c.bezierCurveTo(360, PAGE_H / 2 + 6, 170, PAGE_H / 2 - 4, 0, PAGE_H / 2 + 10); c.closePath(); };

// the book block under the pages (cover, page edges, shadow)
function bookBase(ctx) {
  ctx.save(); ctx.fillStyle = 'rgba(4,3,12,0.14)';
  for (let k = 0; k < 4; k++) { ctx.beginPath(); roundRect(ctx, -PAGE_W - 10 - k * 9, -PAGE_H / 2 + 30 - k * 7, PAGE_W * 2 + 60 + k * 18, PAGE_H + 40 + k * 16, 30 + k * 8); ctx.fill(); }
  ctx.restore();
  grainFill(ctx, c => roundRect(c, -PAGE_W - 22, -PAGE_H / 2 - 16, PAGE_W * 2 + 44, PAGE_H + 40, 14), lin(ctx, 0, -PAGE_H / 2, 0, PAGE_H / 2, [[0, '#5a2a14'], [1, '#2a120a']]), 0.5);
  for (let k = 3; k >= 1; k--) grainFill(ctx, c => roundRect(c, -PAGE_W - 6 + k, -PAGE_H / 2 - 2 + k * 3, PAGE_W * 2 + 12 - 2 * k, PAGE_H + 4, 6), k === 1 ? '#b99872' : '#8a6a4c', 0.35);
}
// one page of one spread, in book coordinates (spine at x = 0)
function pageArt(ctx, si, side) {
  const sp = SPREADS[si], L0 = side < 0;
  const paper = lin(ctx, -PAGE_W, -PAGE_H / 2, PAGE_W, PAGE_H / 2, [[0, '#e6cc9f'], [0.45, '#b8986c'], [1, '#5e4636']]);
  grainFill(ctx, L0 ? pageL : pageR, paper, 0.32);
  ctx.save(); ctx.beginPath(); (L0 ? pageL : pageR)(ctx); ctx.clip();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = lin(ctx, -70, 0, 70, 0, [[0, 'rgba(255,255,255,1)'], [0.42, 'rgba(150,110,80,1)'], [0.5, 'rgba(90,60,40,1)'], [0.58, 'rgba(150,110,80,1)'], [1, 'rgba(255,255,255,1)']]);
  ctx.fillRect(-70, -PAGE_H / 2 - 12, 140, PAGE_H + 24);
  ctx.restore();
  ctx.strokeStyle = 'rgba(80,60,110,0.13)'; ctx.lineWidth = 1.5;
  for (let y = -300; y <= 320; y += 42.5) { ctx.beginPath(); if (L0) { ctx.moveTo(-PAGE_W + 40, y + 10); ctx.lineTo(-40, y + 10); } else { ctx.moveTo(40, y + 10); ctx.lineTo(PAGE_W - 40, y + 10); } ctx.stroke(); }
  if (L0) { ctx.strokeStyle = 'rgba(160,70,50,0.18)'; ctx.beginPath(); ctx.moveTo(-PAGE_W + 70, -PAGE_H / 2 + 20); ctx.lineTo(-PAGE_W + 70, PAGE_H / 2 - 10); ctx.stroke(); }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // the year, underlined, at the head of the left page
  if (L0) {
    ctx.save(); ctx.translate(-PAGE_W + 92, -300); ctx.rotate(-0.03);
    ctx.fillStyle = 'rgba(40,24,30,0.86)'; ctx.font = '62px "Instrument Serif"'; ctx.textBaseline = 'middle'; ctx.fillText(sp.year, 0, 0);
    ctx.strokeStyle = 'rgba(40,24,30,0.7)'; ctx.lineWidth = 2.4; stroke(ctx, wob([[0, 30], [60, 32], [118, 29]], 77 + si, 2));
    ctx.restore();
  }
  for (const row of sp.rows) if ((row.x < 0) === L0) {
    ctx.strokeStyle = 'rgba(40,24,30,0.82)'; ctx.lineWidth = 2.6;
    for (const w of row.words) stroke(ctx, w);
    ctx.strokeStyle = 'rgba(40,24,30,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(row.x - 52, row.y - 14, 26, 26); ctx.stroke();
  }
  for (const row of sp.subs) if ((row.x < 0) === L0) { ctx.strokeStyle = 'rgba(52,34,40,0.55)'; ctx.lineWidth = 2; for (const w of row.words) stroke(ctx, w); }
  // a small hand-drawn chart on the right page, different each year
  if (!L0) {
    ctx.strokeStyle = 'rgba(40,24,30,0.8)'; ctx.lineWidth = 2.4;
    ctx.save(); ctx.translate(140, -175);
    stroke(ctx, wob([[0, 0], [0, 120], [230, 120]], 3 + si, 2));
    if (si === 0) stroke(ctx, wob([[8, 110], [40, 102], [80, 96], [120, 80], [160, 66], [200, 40], [226, 12]], 5, 3));
    if (si === 1) [[14, 30], [52, 50], [90, 74], [128, 92], [166, 112]].forEach(([x, h], i) => stroke(ctx, wob([[x, 120], [x, 120 - h], [x + 22, 120 - h], [x + 22, 120]], 20 + i, 2)));
    if (si === 2) { const c2 = []; for (let a = 0; a <= 6.5; a += 0.2) c2.push([110 + Math.cos(a) * 52, 60 + Math.sin(a) * 50]); stroke(ctx, wob(c2, 9, 2.4)); stroke(ctx, [[110, 60], [110, 10]]); stroke(ctx, [[110, 60], [156, 82]]); }
    ctx.restore();
  }
}

// the grader's marks: a glowing red-amber tick, or a quieter cross
const TICKP = [[-20, -2], [-13, 6], [-6, 16], [-1, 20], [6, 6], [14, -10], [24, -26], [32, -38]];
const CROSSP = [[[-14, -12], [14, 14]], [[14, -12], [-14, 14]]];
function markOrigin(m) { return [m.x - 38, m.y - 14]; }
function partial(P, k) { const n = (P.length - 1) * clamp(k), i = Math.floor(n), f = n - i; const o = P.slice(0, i + 1); if (i < P.length - 1) o.push([lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)]); return o; }
function mark(ctx, m, t, pulse) {
  const k = clamp((t - m.t) / 0.17); if (k <= 0) return;
  const [cx, cy] = markOrigin(m);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(m.rot - 0.08);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (m.v) {
    const pop = 1 + 0.25 * Math.sin(Math.PI * clamp((t - m.t - 0.12) / 0.3)); ctx.scale(m.s * pop, m.s * pop);
    const P = partial(TICKP, out(k));
    ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (const p of P) ctx.lineTo(p[0], p[1]);
    ctx.strokeStyle = 'rgba(255,100,40,0.32)'; ctx.lineWidth = 22; ctx.stroke();
    ctx.strokeStyle = rgba('#6a2010', 0.7); ctx.lineWidth = 12; ctx.stroke();
    ctx.strokeStyle = '#ff6e3a'; ctx.lineWidth = 9; ctx.stroke();
    ctx.strokeStyle = '#ffd7a8'; ctx.lineWidth = 3; ctx.stroke();
  } else {
    ctx.scale(m.s, m.s); ctx.strokeStyle = 'rgba(120,36,26,0.78)'; ctx.lineWidth = 5;
    CROSSP.forEach((seg, j) => { const kk = clamp(k * 2 - j); if (kk <= 0) return; ctx.beginPath(); ctx.moveTo(seg[0][0], seg[0][1]); ctx.lineTo(lerp(seg[0][0], seg[1][0], kk), lerp(seg[0][1], seg[1][1], kk)); ctx.stroke(); });
  }
  ctx.restore();
  if (m.v) {
    const land = Math.exp(-Math.max(0, t - m.t - 0.15) * 4) * ramp(t, m.t + 0.03, m.t + 0.18);
    ctx.save(); ctx.fillStyle = rad(ctx, cx + 6, cy - 8, 0, 90, [[0, `rgba(255,110,40,${0.3 + 0.25 * land})`], [1, 'rgba(255,110,40,0)']]); ctx.fillRect(cx - 90, cy - 100, 190, 190); ctx.restore();
    light(ctx, cx + 6, cy - 8, 60 + 70 * land, '#ff7a3a', (0.14 + 0.5 * land) * pulse);
  }
}
// where the pen tip is when drawing a mark at progress k
function markTip(m, k) {
  const [cx, cy] = markOrigin(m), a = m.rot - 0.08, P = m.v ? partial(TICKP, out(k)) : partial([CROSSP[0][0], CROSSP[0][1], CROSSP[1][0], CROSSP[1][1]], k);
  const [px, py] = P[P.length - 1], s = m.s;
  return [cx + (px * Math.cos(a) - py * Math.sin(a)) * s, cy + (px * Math.sin(a) + py * Math.cos(a)) * s];
}
const REST = [760, 330], HOVER = [380, -40];
function penTip(t) {
  if (t < 63.7) return { p: [REST[0] + 120, REST[1] + 120], lift: 1 };
  const first = ALL[0];
  if (t < first.t) { const k = ease2((t - 63.7) / (first.t - 63.75)); const tgt = markTip(first, 0); return { p: [lerp(REST[0], tgt[0], k), lerp(REST[1], tgt[1] - 18, k) + Math.sin(k * Math.PI) * -40 + 18 * k], lift: 1 - ramp(t, first.t - 0.1, first.t) }; }
  for (let i = 0; i < ALL.length; i++) {
    const m = ALL[i], nx = ALL[i + 1];
    if (t < m.t + 0.17) { const k = (t - m.t) / 0.17; return { p: markTip(m, k), lift: 0 }; }
    if (!nx) { const k = ease2((t - m.t - 0.17) / 0.7); const a = markTip(m, 1); return { p: [lerp(a[0], REST[0], k), lerp(a[1], REST[1], k)], lift: ramp(t, m.t + 0.17, m.t + 0.3) }; }
    if (t < nx.t) {
      const a = markTip(m, 1), b = markTip(nx, 0), flip = FLIPS.find(f => f[0] > m.t && f[0] < nx.t);
      if (flip) {   // the hand leaves the page while it turns
        if (t < flip[0] + 0.15) { const k = ease2((t - m.t - 0.17) / (flip[0] + 0.15 - m.t - 0.17)); return { p: [lerp(a[0], HOVER[0], k), lerp(a[1], HOVER[1], k)], lift: ramp(t, m.t + 0.17, m.t + 0.27) }; }
        const k = ease2((t - flip[0] - 0.15) / (nx.t - flip[0] - 0.15)); return { p: [lerp(HOVER[0], b[0], k), lerp(HOVER[1], b[1], k)], lift: 1 - ramp(t, nx.t - 0.08, nx.t) };
      }
      const k = ease2((t - m.t - 0.17) / (nx.t - m.t - 0.17));
      return { p: [lerp(a[0], b[0], k), lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * 10], lift: Math.sin(clamp(k) * Math.PI) };
    }
  }
  return { p: REST, lift: 1 };
}
function ease2(x) { return L.ease(clamp(x)); }

// ---------- grader's hand (adapted from s_check: different sleeve, red-amber pen) ----------
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}
const HROT = 0.42, TIPL = [-306, -6];
function hand(ctx, t) {
  const { p, lift } = penTip(t), br = Math.sin(t * 1.9);
  const tx = TIPL[0] * Math.cos(HROT) - TIPL[1] * Math.sin(HROT), ty = TIPL[0] * Math.sin(HROT) + TIPL[1] * Math.cos(HROT);
  const lx = 8 * lift, ly = -14 * lift, sc = 1 + 0.03 * lift;
  ctx.save(); ctx.translate(p[0] - tx * sc + lx + br * 1.5, p[1] - ty * sc + ly + br * 2); ctx.rotate(HROT + 0.02 * Math.sin(t * 1.3)); ctx.scale(sc, sc);
  // shadow grows when the pen lifts
  ctx.save(); ctx.translate(14 + 18 * lift, 20 + 24 * lift); ctx.fillStyle = 'rgba(4,3,12,0.16)';
  for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(40, 40, 230 + k * 18, 100 + k * 14, 0, 0, 7); ctx.fill(); }
  ctx.restore();
  cached(ctx, 'ghand', -340, -160, 720, 260, handArt);
  ctx.restore();
}
function handArt(ctx) {
  grainFill(ctx, c => { c.moveTo(150, -100); c.bezierCurveTo(300, -130, 520, -110, 700, -80); c.lineTo(700, 200); c.bezierCurveTo(520, 170, 320, 140, 170, 100); c.bezierCurveTo(130, 50, 120, -50, 150, -100); c.closePath(); },
    lin(ctx, 150, -100, 500, 200, [[0, '#1d5a6c'], [1, '#081a26']]), 0.55);
  grainFill(ctx, c => { c.moveTo(118, -92); c.bezierCurveTo(150, -104, 175, -100, 190, -92); c.bezierCurveTo(160, -20, 165, 50, 196, 104); c.bezierCurveTo(170, 112, 148, 110, 128, 98); c.bezierCurveTo(92, 40, 90, -40, 118, -92); c.closePath(); },
    lin(ctx, 120, -100, 200, 110, [[0, '#2a7088'], [1, '#0c2a38']]), 0.35);
  const skin = lin(ctx, -160, -80, 140, 90, [[0, '#f2b47a'], [0.5, '#c8763a'], [1, '#6e3416']]);
  [[-62, 52, 30], [-20, 70, 30], [26, 76, 27]].forEach(([x, y, r]) => grainFill(ctx, c => c.ellipse(x, y, r * 1.25, r, 0.3, 0, 7), lin(ctx, x - r, y - r, x + r, y + r, [[0, '#d88748'], [1, '#6e3416']]), 0.4));
  grainFill(ctx, c => { c.moveTo(130, -78); c.bezierCurveTo(80, -100, 0, -96, -50, -66); c.bezierCurveTo(-92, -40, -100, 10, -82, 40);
    c.bezierCurveTo(-50, 70, 40, 72, 110, 64); c.bezierCurveTo(140, 40, 150, -40, 130, -78); c.closePath(); }, skin, 0.42);
  ctx.strokeStyle = 'rgba(110,52,22,0.45)'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  [[100, -40, -40, -30], [104, -8, -50, 8], [104, 24, -40, 40]].forEach(([a, b, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c2) / 2, (b + d) / 2 - 8, c2, d); ctx.stroke(); });
  // the grading pen: red-amber barrel
  ctx.save(); ctx.translate(-110, -6);
  grainFill(ctx, c => roundRect(c, -150, -10, 360, 20, 9), lin(ctx, 0, -10, 0, 10, [[0, '#ff7a48'], [1, '#7a2410']]), 0.35);
  ctx.fillStyle = '#2a0e08'; ctx.fillRect(60, -10, 12, 20); ctx.fillRect(196, -10, 6, 20);
  grainFill(ctx, c => { c.moveTo(-150, -9); c.lineTo(-196, 0); c.lineTo(-150, 9); c.closePath(); }, lin(ctx, -196, 0, -150, 0, [[0, '#ffd2a0'], [1, '#a8482e']]), 0.2);
  ctx.restore();
  grainFill(ctx, c => cap(c, -30, -46, -190, -22, 26, 17), lin(ctx, -190, -40, -30, -20, [[0, '#f8c08a'], [1, '#c06c30']]), 0.4);
  ctx.strokeStyle = 'rgba(110,52,22,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-110, -50); ctx.quadraticCurveTo(-104, -36, -112, -18); ctx.stroke();
  grainFill(ctx, c => c.ellipse(-188, -24, 11, 8, 0.15, 0, 7), '#ffdcb6', 0.2);
  grainFill(ctx, c => cap(c, -20, 30, -150, 18, 24, 17), lin(ctx, -150, 0, -20, 40, [[0, '#e49a5a'], [1, '#8a4018']]), 0.4);
}

// ---------- the book with page turns ----------
function spreadAt(t) { return t < FLIPS[0][0] ? 0 : t < FLIPS[1][0] ? 1 : 2; }
function drawPage(ctx, si, side) { if (side < 0) cached(ctx, 'L' + si, -PAGE_W - 10, -PAGE_H / 2 - 30, 10, PAGE_H / 2 + 30, c => pageArt(c, si, -1)); else cached(ctx, 'R' + si, -10, -PAGE_H / 2 - 30, PAGE_W + 10, PAGE_H / 2 + 30, c => pageArt(c, si, 1)); }
function book(ctx, t) {
  cached(ctx, 'base', -PAGE_W - 120, -PAGE_H / 2 - 100, PAGE_W + 140, PAGE_H / 2 + 120, bookBase);
  const fi = FLIPS.findIndex(f => t >= f[0] && t < f[1]);
  const pulse = 0.9 + 0.1 * Math.sin(t * 5);
  if (fi < 0) {
    const si = spreadAt(t);
    drawPage(ctx, si, -1); drawPage(ctx, si, 1);
    for (const m of SPREADS[si].rows) mark(ctx, m, t, pulse);
    return;
  }
  const [a, b] = FLIPS[fi], k = L.ease((t - a) / (b - a)), th = k * Math.PI, cs = Math.cos(th);
  // underneath: the old left page with its marks, the new right page
  drawPage(ctx, fi, -1); for (const m of SPREADS[fi].rows) if (m.x < 0) mark(ctx, m, t, pulse);
  drawPage(ctx, fi + 1, 1);
  // shadow the turning sheet throws onto the page it is uncovering / covering
  const sh = Math.sin(th);
  ctx.save(); ctx.globalAlpha = 0.45 * sh; ctx.fillStyle = lin(ctx, 0, 0, cs > 0 ? PAGE_W : -PAGE_W, 0, [[0, 'rgba(20,8,6,0.7)'], [Math.max(0.05, Math.abs(cs)), 'rgba(20,8,6,0.35)'], [1, 'rgba(20,8,6,0)']]);
  ctx.beginPath(); (cs > 0 ? pageR : pageL)(ctx); ctx.fill(); ctx.restore();
  // the sheet itself: front (old right page) then back (new left page), foreshortened about the spine, lifted
  ctx.save(); ctx.transform(Math.abs(cs), -0.10 * sh * Math.sign(cs || 1), 0, 1, 0, 0);
  ctx.save(); ctx.translate(0, -18 * sh);
  if (cs > 0) { drawPage(ctx, fi, 1); for (const m of SPREADS[fi].rows) if (m.x > 0) mark(ctx, m, t, pulse); }
  else drawPage(ctx, fi + 1, -1);
  // light falls off as the sheet stands up
  ctx.globalAlpha = 0.5 * sh * (cs > 0 ? 1 : 0.6); ctx.fillStyle = cs > 0 ? 'rgba(30,14,10,1)' : 'rgba(60,30,14,1)';
  ctx.beginPath(); (cs > 0 ? pageR : pageL)(ctx); ctx.fill();
  ctx.restore(); ctx.restore();
}

// ---------- the gauge: share of predictions that came true ----------
const GX = 230, GY0 = 870, GY1 = 330;
function gauge(ctx, t) {
  const a = ramp(t, 64.2, 65.0); if (a <= 0) return;
  let n = 0; for (const tt of TICK_T) n += out((t - tt - 0.08) / 0.35);
  const f = n / NMARK, y = lerp(GY0, GY1, f), half = (GY0 + GY1) / 2, over = ramp(t, 68.16, 68.5), tru = Math.exp(-Math.max(0, t - 69.12) * 2.5) * (t > 69.1 ? 1 : 0);
  ctx.save(); ctx.globalAlpha = a;
  // tube
  grainFill(ctx, c => roundRect(c, GX - 34, GY1 - 30, 68, GY0 - GY1 + 60, 34), lin(ctx, GX - 34, 0, GX + 34, 0, [[0, '#1b1840'], [1, '#0b0a20']]), 0.5);
  ctx.strokeStyle = rgba(C.lav, 0.35); ctx.lineWidth = 2; ctx.beginPath(); roundRect(ctx, GX - 34, GY1 - 30, 68, GY0 - GY1 + 60, 34); ctx.stroke();
  // fill
  if (n > 0.001) {
    ctx.save(); ctx.beginPath(); roundRect(ctx, GX - 24, GY1 - 20, 48, GY0 - GY1 + 40, 24); ctx.clip();
    const wave = 4 * Math.sin(t * 3);
    grainFill(ctx, c => { c.moveTo(GX - 30, y + wave); c.quadraticCurveTo(GX, y - wave * 2, GX + 30, y - wave); c.lineTo(GX + 30, GY0 + 30); c.lineTo(GX - 30, GY0 + 30); c.closePath(); },
      lin(ctx, 0, y, 0, GY0 + 30, [[0, '#ffd09a'], [0.15, '#ff8a48'], [1, '#8a3412']]), 0.35);
    ctx.restore();
    light(ctx, GX, y + 10, 120 + 60 * tru, '#ff8a48', 0.32 + 0.4 * tru + 0.1 * Math.sin(t * 4));
  }
  // scale: quarter ticks and the halfway line
  ctx.strokeStyle = rgba(C.cream, 0.4); ctx.lineWidth = 2;
  for (const q of [0.25, 0.75]) { const yy = lerp(GY0, GY1, q); ctx.beginPath(); ctx.moveTo(GX + 40, yy); ctx.lineTo(GX + 54, yy); ctx.stroke(); }
  ctx.strokeStyle = rgba(over > 0 ? '#ffd09a' : C.cream, 0.75 + 0.25 * over); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(GX - 52, half); ctx.lineTo(GX + 62, half); ctx.stroke();
  ctx.fillStyle = C.cream; ctx.font = '26px "Inter SemiBold"'; ctx.textBaseline = 'middle'; ctx.fillText('1/2', GX + 72, half + 1);
  ctx.font = '20px "Inter Medium"'; ctx.letterSpacing = '4px'; ctx.fillStyle = C.lav; ctx.textAlign = 'center';
  ctx.fillText('CAME TRUE', GX, GY0 + 64);
  ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.1, 1.0, L.ease((t - T0) / 3.2)) * lerp(1, 1.04, sm((t - 64) / 6));
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 6) * 4;
  const lamp = 0.94 + 0.04 * Math.sin(t * 7.1) * Math.sin(t * 2.3) + 0.02 * Math.sin(t * 1.1);
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  layer(0.8, () => cached(ctx, 'desk', -120, -100, W + 120, H + 100, deskArt));
  layer(1.0, () => {
    ctx.save(); ctx.translate(1000, 560); ctx.rotate(-0.05); ctx.scale(0.86, 0.86);
    book(ctx, t);
    hand(ctx, t);
    ctx.restore();
  });
  layer(1.25, () => {
    light(ctx, 330, 160, 1300, '#ffb35c', 0.24 * lamp);
    light(ctx, 220, 60, 520, '#ffe2a8', 0.28 * lamp);
    cached(ctx, 'lamp', -220, -320, 460, 280, lampArt);
  });
  layer(0.9, () => gauge(ctx, t));
  layer(1.6, () => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const d of DUST) {
      const x = (d.x + t * d.v + Math.sin(t * 0.7 + d.p) * 20) % W, y = (d.y - t * d.v * 0.5 + H) % H;
      const near = Math.max(0, 1 - Math.hypot(x - 330, y - 160) / 900);
      ctx.fillStyle = rgba('#ffd9a0', 0.5 * near * (0.6 + 0.4 * Math.sin(t * 2 + d.p)));
      ctx.beginPath(); ctx.arc(x, y, d.s, 0, 7); ctx.fill();
    }
    ctx.restore();
  });
  stamp(ctx, t, 68.0, T1 + 1, 'More than half', 'of the first three years came true', { size: 92, x: 1010, y: 34 });
}

function lampArt(ctx) {
  ctx.save(); ctx.translate(120, -40); ctx.rotate(0.5);
  grainFill(ctx, c => c.ellipse(0, 0, 260, 170, 0, 0, 7), lin(ctx, -260, -170, 200, 170, [[0, '#3a2a5c'], [1, '#0e0b22']]), 0.5);
  grainFill(ctx, c => c.ellipse(40, 46, 200, 118, 0, 0, 7), rad(ctx, 40, 46, 10, 200, [[0, '#fff3d6'], [0.5, '#ffd08a'], [1, '#e08a42']]), 0.15);
  ctx.strokeStyle = '#1a1438'; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(40, 46, 200, 118, 0, 0, 7); ctx.stroke();
  ctx.restore();
}
function deskArt(ctx) {
  grainFill(ctx, c => c.rect(-200, -200, W + 400, H + 400), lin(ctx, 0, 0, W, H, [[0, '#2a1f40'], [0.5, '#17143a'], [1, '#0a0a1e']]), 0.6);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.12);
  for (const p of PLANKS) { ctx.strokeStyle = rgba('#05040f', 0.35 + 0.3 * p.k); ctx.lineWidth = p.w; ctx.beginPath(); ctx.moveTo(-1300, p.y - 540); ctx.bezierCurveTo(-400, p.y - 530 + p.k * 10, 400, p.y - 550, 1300, p.y - 540); ctx.stroke(); }
  ctx.restore();
  // a printed grading sheet beside the book, bottom right
  ctx.save(); ctx.translate(1700, 930); ctx.rotate(-0.2);
  grainFill(ctx, c => c.rect(-170, -220, 340, 440), lin(ctx, -170, -220, 170, 220, [[0, '#8a7ca8'], [1, '#332b5c']]), 0.45);
  ctx.strokeStyle = 'rgba(20,16,40,0.4)'; ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-120, -170 + i * 34); ctx.lineTo(50 + (i % 3) * 30, -170 + i * 34); ctx.stroke(); }
  ctx.restore();
}

module.exports = { T0, T1, draw };
