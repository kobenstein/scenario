// "Much of it came true."
// Top-down on the open 2021 notebook under a warm lamp: one glowing amber check after another is drawn next to the predictions.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, grainFill, lin, rad, rgba, light, out, clamp } = L;

const T0 = 30.15, T1 = 32.05;

// static artwork is painted once into an offscreen canvas (at 1.3x for crisp camera push), then placed each frame
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn) {
  const S = 1.3;
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
function roundRect(ctx, x, y, w, h, r) { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

// ---------- pre-generated handwriting (abstract looped strokes, not letters) ----------
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
// rows: [page side, y, has check, item width]
const PAGE_W = 520, PAGE_H = 700;
const ROWS = [];
{
  const ys = [-270, -185, -100, -15, 70, 160, 250];
  ys.forEach((y, i) => ROWS.push({ x: -PAGE_W + 92, y, words: makeRow(10 + i, -PAGE_W + 92, y, 380), check: i !== 3 && i !== 6 }));
  // sub-notes (no check): short indented scribbles
  [-145, 30, 205, 292].forEach((y, i) => ROWS.push({ x: -PAGE_W + 120, y, words: makeRow(40 + i, -PAGE_W + 120, y, 200), check: false, small: true }));
  const yr = [-275, -190, 40, 245];
  yr.forEach((y, i) => ROWS.push({ x: 92, y, words: makeRow(60 + i, 92, y, i === 2 ? 170 : 360), check: true }));
}
// check order and timing: left page top to bottom, then right page; 30.3 .. 31.6
const CHECKS = ROWS.filter(r => r.check).sort((a, b) => (a.x > 0) - (b.x > 0) || a.y - b.y);
CHECKS.forEach((c, i) => { c.t = 30.3 + i * (1.3 / (CHECKS.length - 1)); c.rot = (rng(90 + i)() - 0.5) * 0.3; c.s = 1.0 + rng(70 + i)() * 0.15; });

// desk wood planks
const PLANKS = (() => { const r = rng(4), a = []; for (let i = 0; i < 26; i++) a.push({ y: -300 + i * 70 + r() * 20, w: 1 + r() * 2, k: r() }); return a; })();
const DUST = (() => { const r = rng(17), a = []; for (let i = 0; i < 46; i++) a.push({ x: r() * W, y: r() * H, s: 1 + r() * 2.4, p: r() * 6, v: 6 + r() * 14 }); return a; })();

function stroke(ctx, pts, k = 1) {
  const n = Math.max(2, Math.floor(pts.length * k)); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
}
function wob(pts, seed, a = 1.6) { const r = rng(seed); return pts.map(([x, y]) => [x + (r() - 0.5) * a, y + (r() - 0.5) * a]); }
function polyline(x0, y0, x1, y1, n = 8, seed = 1) { const p = []; for (let i = 0; i <= n; i++) p.push([lerp(x0, x1, i / n), lerp(y0, y1, i / n)]); return wob(p, seed, 2); }

// ---------- the notebook, in its own frame (spine at x=0) ----------
function notebook(ctx) {
  // shadow under the book
  ctx.save(); ctx.fillStyle = 'rgba(4,3,12,0.14)';
  for (let k = 0; k < 4; k++) { ctx.beginPath(); roundRect(ctx, -PAGE_W - 10 - k * 9, -PAGE_H / 2 + 30 - k * 7, PAGE_W * 2 + 60 + k * 18, PAGE_H + 40 + k * 16, 30 + k * 8); ctx.fill(); }
  ctx.restore();
  // cover edge and page block thickness
  grainFill(ctx, c => roundRect(c, -PAGE_W - 22, -PAGE_H / 2 - 16, PAGE_W * 2 + 44, PAGE_H + 40, 14), lin(ctx, 0, -PAGE_H / 2, 0, PAGE_H / 2, [[0, '#5a2a14'], [1, '#2a120a']]), 0.5);
  for (let k = 3; k >= 1; k--) {
    grainFill(ctx, c => roundRect(c, -PAGE_W - 6 + k, -PAGE_H / 2 - 2 + k * 3, PAGE_W * 2 + 12 - 2 * k, PAGE_H + 4, 6), k === 1 ? '#b99872' : '#8a6a4c', 0.35);
  }
  // pages: the lamp sits upper left, so the paper is warmest there
  const paper = lin(ctx, -PAGE_W, -PAGE_H / 2, PAGE_W, PAGE_H / 2, [[0, '#e6cc9f'], [0.45, '#b8986c'], [1, '#5e4636']]);
  const pageL = c => { c.moveTo(0, -PAGE_H / 2 + 8); c.bezierCurveTo(-170, -PAGE_H / 2 - 14, -360, -PAGE_H / 2 - 6, -PAGE_W, -PAGE_H / 2); c.lineTo(-PAGE_W, PAGE_H / 2); c.bezierCurveTo(-360, PAGE_H / 2 + 6, -170, PAGE_H / 2 - 4, 0, PAGE_H / 2 + 10); c.closePath(); };
  const pageR = c => { c.moveTo(0, -PAGE_H / 2 + 8); c.bezierCurveTo(170, -PAGE_H / 2 - 14, 360, -PAGE_H / 2 - 6, PAGE_W, -PAGE_H / 2); c.lineTo(PAGE_W, PAGE_H / 2); c.bezierCurveTo(360, PAGE_H / 2 + 6, 170, PAGE_H / 2 - 4, 0, PAGE_H / 2 + 10); c.closePath(); };
  grainFill(ctx, pageL, paper, 0.32); grainFill(ctx, pageR, paper, 0.32);
  // gutter shade
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = lin(ctx, -70, 0, 70, 0, [[0, 'rgba(255,255,255,1)'], [0.42, 'rgba(150,110,80,1)'], [0.5, 'rgba(90,60,40,1)'], [0.58, 'rgba(150,110,80,1)'], [1, 'rgba(255,255,255,1)']]);
  ctx.fillRect(-70, -PAGE_H / 2 - 12, 140, PAGE_H + 24); ctx.restore();
  // faint ruled lines
  ctx.strokeStyle = 'rgba(80,60,110,0.13)'; ctx.lineWidth = 1.5;
  for (let y = -300; y <= 320; y += 42.5) { ctx.beginPath(); ctx.moveTo(-PAGE_W + 40, y + 10); ctx.lineTo(-40, y + 10); ctx.moveTo(40, y + 10); ctx.lineTo(PAGE_W - 40, y + 10); ctx.stroke(); }
  // margin line
  ctx.strokeStyle = 'rgba(160,70,50,0.18)'; ctx.beginPath(); ctx.moveTo(-PAGE_W + 70, -PAGE_H / 2 + 20); ctx.lineTo(-PAGE_W + 70, PAGE_H / 2 - 10); ctx.stroke();

  // handwriting
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const row of ROWS) {
    ctx.strokeStyle = row.small ? 'rgba(52,34,40,0.55)' : 'rgba(40,24,30,0.82)'; ctx.lineWidth = row.small ? 2 : 2.6;
    for (const w of row.words) stroke(ctx, row.small ? w.map(([x, y]) => [x, y]) : w);
    // empty tick box in front of each prediction
    if (!row.small) { ctx.strokeStyle = 'rgba(40,24,30,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(row.x - 52, row.y - 14, 26, 26); ctx.stroke(); }
  }
  // tiny hand-drawn charts on the right page
  ctx.strokeStyle = 'rgba(40,24,30,0.8)'; ctx.lineWidth = 2.4;
  // rising line chart
  ctx.save(); ctx.translate(110, -120);
  stroke(ctx, polyline(0, 0, 0, 120, 6, 2)); stroke(ctx, polyline(0, 120, 210, 120, 8, 3));
  stroke(ctx, wob([[8, 110], [30, 100], [48, 104], [70, 86], [92, 90], [112, 68], [136, 62], [158, 34], [182, 20], [200, 0]], 5, 3));
  stroke(ctx, [[186, -2], [202, -2], [200, 14]]);
  ctx.restore();
  // bar chart
  ctx.save(); ctx.translate(360, -120);
  stroke(ctx, polyline(0, 120, 120, 120, 6, 6));
  [[10, 30], [38, 52], [66, 76], [94, 108]].forEach(([x, h], i) => { stroke(ctx, wob([[x, 120], [x, 120 - h], [x + 18, 120 - h], [x + 18, 120]], 20 + i, 2)); });
  ctx.restore();
  // a circle diagram and an arrow
  ctx.save(); ctx.translate(380, 130);
  const circ = []; for (let a = 0; a <= 6.5; a += 0.2) circ.push([Math.cos(a) * 44, Math.sin(a) * 42]); stroke(ctx, wob(circ, 9, 2.4));
  stroke(ctx, [[0, 0], [0, -42]]); stroke(ctx, [[0, 0], [38, 20]]);
  ctx.restore();
  ctx.save(); ctx.translate(250, 120); stroke(ctx, wob([[0, 0], [30, 14], [70, 16], [96, 8]], 31, 2)); stroke(ctx, [[84, -2], [98, 8], [86, 18]]); ctx.restore();
  // date at the top of the left page
  ctx.save(); ctx.strokeStyle = 'rgba(40,24,30,0.7)'; ctx.lineWidth = 2.4;
  for (const w of makeRow(99, -PAGE_W + 92, -322, 120)) stroke(ctx, w);
  ctx.restore();
}

// one check mark, drawn stroke by stroke with a glow pop when it lands
function check(ctx, c, t, pulse) {
  const k = clamp((t - c.t) / 0.24); if (k <= 0) return;
  const cx = c.x - 38, cy = c.y - 14;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(c.rot - 0.08);
  const pop = 1 + 0.25 * Math.sin(Math.PI * clamp((t - c.t - 0.16) / 0.3)); ctx.scale(c.s * pop, c.s * pop);
  // path: short down-stroke, then the long flick up to the right
  const P = [[-20, -2], [-13, 6], [-6, 16], [-1, 20], [6, 6], [14, -10], [24, -26], [32, -38]];
  const n = (P.length - 1) * out(k); const i = Math.floor(n), f = n - i;
  ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
  for (let j = 1; j <= i; j++) ctx.lineTo(P[j][0], P[j][1]);
  if (i < P.length - 1) ctx.lineTo(lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f));
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(255,140,30,0.35)'; ctx.lineWidth = 22; ctx.stroke();
  ctx.strokeStyle = rgba('#7a3b17', 0.7); ctx.lineWidth = 12; ctx.stroke();
  ctx.strokeStyle = '#ff9f3a'; ctx.lineWidth = 9; ctx.stroke();
  ctx.strokeStyle = '#ffe3a6'; ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
  const land = Math.exp(-Math.max(0, t - c.t - 0.2) * 4) * ramp(t, c.t + 0.05, c.t + 0.22);
  ctx.save(); ctx.fillStyle = rad(ctx, cx + 6, cy - 8, 0, 90, [[0, `rgba(255,140,40,${0.35 + 0.25 * land})`], [1, 'rgba(255,140,40,0)']]); ctx.fillRect(cx - 90, cy - 100, 190, 190); ctx.restore();
  light(ctx, cx + 6, cy - 8, 60 + 70 * land, '#ff9f3a', (0.16 + 0.55 * land) * pulse);
}

// the writer's hand with the pen, resting at the right edge (pen points up-left at the page)
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}
function hand(ctx, t) {
  const br = Math.sin(t * 1.9);
  ctx.save(); ctx.translate(1560 + drift(t, 2, 5) * 8, 800 + br * 3 + drift(t, 2, 8) * 5); ctx.rotate(0.42 + 0.03 * Math.sin(t * 1.3) + 0.02 * Math.sin(t * 3.1));
  cached(ctx, 'hand', -340, -160, 720, 260, handArt);
  ctx.restore();
}
function handArt(ctx) {
  ctx.save(); ctx.fillStyle = 'rgba(4,3,12,0.13)'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(40, 56, 200 + k * 14, 90 + k * 12, 0, 0, 7); ctx.fill(); } ctx.restore();
  // sleeve
  grainFill(ctx, c => { c.moveTo(150, -100); c.bezierCurveTo(300, -130, 520, -110, 700, -80); c.lineTo(700, 200); c.bezierCurveTo(520, 170, 320, 140, 170, 100); c.bezierCurveTo(130, 50, 120, -50, 150, -100); c.closePath(); },
    lin(ctx, 150, -100, 500, 200, [[0, '#2f2866'], [1, '#0d0b22']]), 0.55);
  // cuff
  grainFill(ctx, c => { c.moveTo(118, -92); c.bezierCurveTo(150, -104, 175, -100, 190, -92); c.bezierCurveTo(160, -20, 165, 50, 196, 104); c.bezierCurveTo(170, 112, 148, 110, 128, 98); c.bezierCurveTo(92, 40, 90, -40, 118, -92); c.closePath(); },
    lin(ctx, 120, -100, 200, 110, [[0, '#f3e3c4'], [1, '#8b7a6a']]), 0.35);
  const skin = lin(ctx, -160, -80, 140, 90, [[0, '#ffc98e'], [0.5, '#e08a42'], [1, '#8a451c']]);
  // curled middle/ring/little fingers tucked under, seen as rounded lumps on the lower side
  [[-62, 52, 30], [-20, 70, 30], [26, 76, 27]].forEach(([x, y, r], i) => grainFill(ctx, c => c.ellipse(x, y, r * 1.25, r, 0.3, 0, 7), lin(ctx, x - r, y - r, x + r, y + r, [[0, '#e8954e'], [1, '#7a3b17']]), 0.4));
  // back of the hand
  grainFill(ctx, c => { c.moveTo(130, -78); c.bezierCurveTo(80, -100, 0, -96, -50, -66); c.bezierCurveTo(-92, -40, -100, 10, -82, 40);
    c.bezierCurveTo(-50, 70, 40, 72, 110, 64); c.bezierCurveTo(140, 40, 150, -40, 130, -78); c.closePath(); }, skin, 0.42);
  // tendons / knuckle shading
  ctx.strokeStyle = 'rgba(122,59,23,0.45)'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  [[100, -40, -40, -30], [104, -8, -50, 8], [104, 24, -40, 40]].forEach(([a, b, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c2) / 2, (b + d) / 2 - 8, c2, d); ctx.stroke(); });
  // pen, tip toward the page, held between thumb and index finger
  ctx.save(); ctx.translate(-110, -6);
  grainFill(ctx, c => roundRect(c, -150, -10, 360, 20, 9), lin(ctx, 0, -10, 0, 10, [[0, '#5a4ea0'], [1, '#141032']]), 0.4);
  ctx.fillStyle = '#d99a52'; ctx.fillRect(60, -10, 12, 20); ctx.fillRect(196, -10, 6, 20);
  grainFill(ctx, c => { c.moveTo(-150, -9); c.lineTo(-196, 0); c.lineTo(-150, 9); c.closePath(); }, lin(ctx, -196, 0, -150, 0, [[0, '#ffd28c'], [1, '#a8682e']]), 0.2);
  ctx.restore();
  // index finger lying along the pen
  grainFill(ctx, c => cap(c, -30, -46, -190, -22, 26, 17), lin(ctx, -190, -40, -30, -20, [[0, '#ffcf98'], [1, '#d07a36']]), 0.4);
  ctx.strokeStyle = 'rgba(122,59,23,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-110, -50); ctx.quadraticCurveTo(-104, -36, -112, -18); ctx.stroke();
  // fingernail
  grainFill(ctx, c => c.ellipse(-188, -24, 11, 8, 0.15, 0, 7), '#ffe0b8', 0.2);
  // thumb on the near side of the pen
  grainFill(ctx, c => cap(c, -20, 30, -150, 18, 24, 17), lin(ctx, -150, 0, -20, 40, [[0, '#f0a462'], [1, '#9a4c1c']]), 0.4);
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.07, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 6) * 4;
  const lamp = 0.94 + 0.04 * Math.sin(t * 7.1) * Math.sin(t * 2.3) + 0.02 * Math.sin(t * 1.1);
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  // desk
  layer(0.8, () => {
    cached(ctx, 'desk', -120, -100, W + 120, H + 100, deskArt);
    // a warm glint wanders on the coffee
    ctx.strokeStyle = rgba('#ffc488', 0.22); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(170, 880, 60 + 4 * Math.sin(t * 2), 3.6, 4.6); ctx.stroke();
  });
  // the notebook
  layer(1.0, () => {
    ctx.save(); ctx.translate(900, 520); ctx.rotate(-0.07); ctx.scale(0.98, 0.98);
    cached(ctx, 'book', -600, -420, 640, 470, notebook);
    const pulse = 0.9 + 0.1 * Math.sin(t * 5);
    for (const c of CHECKS) check(ctx, c, t, pulse);
    ctx.restore();
  });
  // warm lamp: shade at the top-left edge and its pool of light
  layer(1.25, () => {
    light(ctx, 330, 160, 1300, '#ffb35c', 0.26 * lamp);
    light(ctx, 220, 60, 520, '#ffe2a8', 0.30 * lamp);
    cached(ctx, 'lamp', -220, -320, 460, 280, lampArt);
  });
  // the hand with the pen
  layer(1.4, () => hand(ctx, t));
  // dust in the lamp light
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
}

function lampArt(ctx) {
    ctx.save(); ctx.translate(120, -40); ctx.rotate(0.5);
    grainFill(ctx, c => c.ellipse(0, 0, 260, 170, 0, 0, 7), lin(ctx, -260, -170, 200, 170, [[0, '#3a2a5c'], [1, '#0e0b22']]), 0.5);
    grainFill(ctx, c => c.ellipse(40, 46, 200, 118, 0, 0, 7), rad(ctx, 40, 46, 10, 200, [[0, '#fff3d6'], [0.5, '#ffd08a'], [1, '#e08a42']]), 0.15);
    ctx.strokeStyle = '#1a1438'; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(40, 46, 200, 118, 0, 0, 7); ctx.stroke();
    ctx.restore();
}

function deskArt(ctx) {
  {
    grainFill(ctx, c => c.rect(-200, -200, W + 400, H + 400), lin(ctx, 0, 0, W, H, [[0, '#2a1f40'], [0.5, '#17143a'], [1, '#0a0a1e']]), 0.6);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.12);
    for (const p of PLANKS) { ctx.strokeStyle = rgba('#05040f', 0.35 + 0.3 * p.k); ctx.lineWidth = p.w; ctx.beginPath(); ctx.moveTo(-1300, p.y - 540); ctx.bezierCurveTo(-400, p.y - 530 + p.k * 10, 400, p.y - 550, 1300, p.y - 540); ctx.stroke(); }
    ctx.restore();
    // loose sheets under the book, top right
    ctx.save(); ctx.translate(1560, 120); ctx.rotate(0.28);
    grainFill(ctx, c => c.rect(-180, -200, 360, 460), lin(ctx, -180, -200, 180, 260, [[0, '#6f6390'], [1, '#2a2450']]), 0.45);
    ctx.rotate(-0.12); grainFill(ctx, c => c.rect(-150, -180, 330, 420), lin(ctx, -150, -180, 180, 240, [[0, '#8a7ca8'], [1, '#332b5c']]), 0.45);
    ctx.strokeStyle = 'rgba(20,16,40,0.35)'; ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-110, -130 + i * 34); ctx.lineTo(60 + (i % 3) * 30, -130 + i * 34); ctx.stroke(); }
    ctx.restore();
    // coffee mug, bottom left, seen from above
    ctx.save(); ctx.translate(170, 880);
    ctx.fillStyle = 'rgba(4,3,12,0.5)'; ctx.beginPath(); ctx.ellipse(18, 22, 108, 100, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#2b2f63'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(86, -34); ctx.bezierCurveTo(170, -50, 170, 50, 86, 34); ctx.stroke();
    grainFill(ctx, c => c.arc(0, 0, 100, 0, 7), lin(ctx, -100, -100, 100, 100, [[0, '#5a5ea8'], [1, '#1b1d44']]), 0.45);
    grainFill(ctx, c => c.arc(0, 0, 80, 0, 7), rad(ctx, -12, -12, 4, 80, [[0, '#4a2a18'], [1, '#1c0e08']]), 0.4);
    ctx.restore();
  }
}

module.exports = { T0, T1, draw };
