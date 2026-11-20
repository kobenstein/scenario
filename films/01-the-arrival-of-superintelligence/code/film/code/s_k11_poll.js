// "In polls this year, most Americans, up to seventy-seven percent, wanted it slowed or paused until its safety can be checked."
// A crowd of a hundred small people stands on a plain before dawn. On "seventy-seven" 77 of them light up amber in a wave
// from the middle outward; together their light warms the horizon while the camera pushes in.
// (This file also exports the small helpers the other k11 scenes share.)
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, stamp, out } = L;

const T0 = 666.80, T1 = 675.45;
const T_77 = 670.12;

// ---------------------------------------------------------------- shared helpers
// grainFill whose speckle pass only covers the path's bounding box (copied from s_hook)
const BB = { b: null, p(x, y) { const b = this.b; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; },
  moveTo(x, y) { this.p(x, y); }, lineTo(x, y) { this.p(x, y); }, quadraticCurveTo(a, b, x, y) { this.p(a, b); this.p(x, y); },
  bezierCurveTo(a, b, c, d, x, y) { this.p(a, b); this.p(c, d); this.p(x, y); }, rect(x, y, w, h) { this.p(x, y); this.p(x + w, y + h); },
  arc(x, y, r) { this.p(x - r, y - r); this.p(x + r, y + r); }, ellipse(x, y, rx, ry) { const r = Math.max(rx, ry); this.p(x - r, y - r); this.p(x + r, y + r); },
  arcTo(a, b, x, y) { this.p(a, b); this.p(x, y); }, closePath() {}, beginPath() {}, roundRect(x, y, w, h) { this.p(x, y); this.p(x + w, y + h); } };
const PAT = new WeakMap();
function pat(ctx) { let p = PAT.get(ctx); if (!p) { p = ctx.createPattern(L.tex().dark, 'repeat'); PAT.set(ctx, p); } return p; }
function gf(ctx, pathFn, fill, grain = 0.5, offscreen = false) {   // offscreen: grain the whole path (for cached layers)
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    BB.b = [1e9, 1e9, -1e9, -1e9]; pathFn(BB); const b = BB.b;
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = pat(ctx);
    const m = ctx.getTransform().invertSelf(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [px, py] of [[0, 0], [W, 0], [0, H], [W, H]]) { const x = m.a * px + m.c * py + m.e, y = m.b * px + m.d * py + m.f; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    if (offscreen || ctx.offscreen) { x0 = -1e5; y0 = -1e5; x1 = 1e5; y1 = 1e5; }
    x0 = Math.max(x0, b[0] - 2); y0 = Math.max(y0, b[1] - 2); x1 = Math.min(x1, b[2] + 2); y1 = Math.min(y1, b[3] + 2);
    if (x1 > x0 && y1 > y0) ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  ctx.restore();
}
// smooth curve through points (midpoint quadratic)
function curve(c, pts, move = true) {
  if (move) c.moveTo(pts[0][0], pts[0][1]); else c.lineTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) { const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]; c.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]); }
  const e = pts[pts.length - 1]; c.lineTo(e[0], e[1]);
}
function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// elliptical soft glow (normal blending)
function glowE(ctx, x, y, rx, ry, stops, add = false) {
  ctx.save(); if (add) ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(rx / ry, 1);
  ctx.fillStyle = rad(ctx, 0, 0, 0, ry, stops); ctx.fillRect(-ry, -ry, 2 * ry, 2 * ry); ctx.restore();
}
// camera: push z around (cx, cy) with parallax drift
function camera(ctx, t, cx, cy, z, seed) {
  const dx = drift(t, 1, seed) * 7, dy = drift(t, 1, seed + 1) * 4;
  return (par, fn) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx + dx * par, -cy + dy * par); fn(); ctx.restore(); };
}

// ---------------------------------------------------------------- the crowd
// a small faceless person seen from the front-ish, feet at (0,0), 100 units tall, built for a crowd
function mini(ctx, f, t, litK, grainPath) {
  const br = Math.sin(t * 1.6 + f.ph), look = 0.25 * Math.sin(t * 0.5 + f.ph * 3) + f.turn;
  const lit = litK;
  const coatA = lit > 0 ? mix(f.cool[0], f.warm[0], lit) : f.cool[0], coatB = lit > 0 ? mix(f.cool[1], f.warm[1], lit) : f.cool[1];
  ctx.save(); ctx.translate(f.x, f.y); ctx.scale(f.s, f.s);
  const wd = f.wd, hem = f.hem;
  // legs and shoes
  const lc = mix('#0c0b20', '#4a200c', lit);
  ctx.fillStyle = lc; ctx.beginPath(); rr(ctx, -6.5 * wd, -34, 5.2, 33, 2); rr(ctx, 1.3 * wd, -34, 5.2, 33, 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-4.5 * wd, -1, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.ellipse(4.5 * wd, -1, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();
  // arms hang from the outer shoulder, swinging a touch (drawn after the coat, see below)
  const sy = -78 + br * 0.5, sw = Math.sin(t * 0.9 + f.ph) * 0.04;
  const armCol = lin(ctx, 0, sy, 0, -36, [[0, coatA], [1, coatB]]);
  // coat: sloped shoulders, a waist, a flared hem
  const coat = c => { c.moveTo(-11 * wd - hem, -28 + f.len); c.bezierCurveTo(-10 * wd, -44, -9.5 * wd, -56, -11 * wd, sy + 8); c.quadraticCurveTo(-12 * wd, sy, -6, sy - 2.5);
    c.lineTo(6, sy - 2.5); c.quadraticCurveTo(12 * wd, sy, 11 * wd, sy + 8); c.bezierCurveTo(9.5 * wd, -56, 10 * wd, -44, 11 * wd + hem, -28 + f.len); c.quadraticCurveTo(0, -26 + f.len, -11 * wd - hem, -28 + f.len); c.closePath(); };
  ctx.fillStyle = lin(ctx, -10, sy, 12, -26, [[0, coatA], [1, coatB]]); ctx.beginPath(); coat(ctx); ctx.fill();
  // sleeves: rounded shoulder cap at the coat's outer edge, tapering to the wrist, a small hand; a thin shade line sets them off the coat
  for (const sg of [-1, 1]) { ctx.save(); ctx.translate(sg * 11 * wd, sy + 5.5); ctx.rotate(-sg * 0.05 + sw);
    const sleeve = () => { ctx.beginPath(); ctx.moveTo(-4.3, 0); ctx.arc(0, 0, 4.3, Math.PI, 0); ctx.lineTo(3.1, 33); ctx.arc(0, 33, 3.1, 0, Math.PI); ctx.closePath(); };
    ctx.fillStyle = 'rgba(10,6,20,0.28)'; ctx.save(); ctx.translate(-sg * 1.1, 0.4); sleeve(); ctx.fill(); ctx.restore();
    ctx.fillStyle = armCol; sleeve(); ctx.fill();
    ctx.fillStyle = mix('#1d1a40', '#c9702e', lit); ctx.beginPath(); ctx.ellipse(0, 36.6, 2.9, 3.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  // collar and a fold down the front
  ctx.strokeStyle = mix('#0a0a1c', '#7a3b17', lit); ctx.lineWidth = 1.3; ctx.beginPath(); if (!f.back) { ctx.moveTo(-4, sy - 2); ctx.lineTo(0, sy + 7); ctx.lineTo(4, sy - 2); } ctx.moveTo(0, sy + 7); ctx.lineTo(0.5, -30 + f.len); ctx.stroke();
  if (f.bag) { ctx.strokeStyle = mix('#0b0a1e', '#5a2a12', lit); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-8 * wd, sy); ctx.lineTo(13 * wd, -48); ctx.stroke(); ctx.fillStyle = mix('#0b0a1e', '#5a2a12', lit); ctx.fillRect(11 * wd, -50, 9, 11); }
  // head and hair
  ctx.save(); ctx.translate(look * 2, sy - 12.5); ctx.rotate(look * 0.1);
  ctx.fillStyle = f.back ? mix('#0c0a1e', '#3a1a0b', lit) : mix('#1d1a40', '#e8964c', lit); ctx.beginPath(); ctx.ellipse(0, 0, 8, 9.5, 0, 0, Math.PI * 2); ctx.fill();
  if (f.back) { ctx.fillStyle = mix('#1d1a40', '#c9702e', lit); ctx.beginPath(); ctx.ellipse(look > 0 ? 7.6 : -7.6, 1, 1.8, 3, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = mix('#0c0a1e', '#3a1a0b', lit); ctx.beginPath();
  if (f.hair === 0) { ctx.ellipse(0, -3, 8.6, 7, 0, Math.PI, Math.PI * 2); }
  else if (f.hair === 1) { ctx.ellipse(0, -3, 8.8, 7, 0, Math.PI, Math.PI * 2); ctx.moveTo(-8.8, -3); ctx.lineTo(-9.5, 12); ctx.lineTo(-5, 10); ctx.lineTo(-6, -3); ctx.moveTo(8.8, -3); ctx.lineTo(9.5, 12); ctx.lineTo(5, 10); ctx.lineTo(6, -3); }
  else if (f.hair === 2) { ctx.ellipse(0, -3, 8.6, 7, 0, Math.PI, Math.PI * 2); ctx.moveTo(4, -12); ctx.arc(2, -12, 4.5, 0, Math.PI * 2); }
  else { ctx.ellipse(0, -4, 9.2, 7.5, 0, Math.PI, Math.PI * 2); ctx.rect(-11, -5, 22, 2.6); }
  ctx.fill(); ctx.restore();
  ctx.restore();
}
const _mx = {};
function mix(a, b, k) {
  if (k <= 0) return a; if (k >= 1) return b;
  const pa = _mx[a] || (_mx[a] = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)]);
  const pb = _mx[b] || (_mx[b] = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)]);
  return `rgb(${Math.round(lerp(pa[0], pb[0], k))},${Math.round(lerp(pa[1], pb[1], k))},${Math.round(lerp(pa[2], pb[2], k))})`;
}

const CROWD = (() => {
  const r = rng(1177), list = [];
  const ROWS = 10;
  for (let row = 0; row < ROWS; row++) {
    const d = row / (ROWS - 1), y = lerp(560, 905, Math.pow(d, 1.25)), s = lerp(0.62, 1.55, Math.pow(d, 1.1)), span = lerp(1180, 2100, d);
    for (let k = 0; k < 10; k++) {
      const x = W / 2 - span / 2 + (k + 0.5) * span / 10 + (r() - 0.5) * span / 14 + (row % 2) * span / 40;
      const warmPal = [['#ffb35c', '#9a4a1c'], ['#ffa24a', '#7a3412'], ['#ffc27a', '#a8521e'], ['#f29a5a', '#7a2e16']][Math.floor(r() * 4)];
      const coolPal = [['#2a2558', '#100f2c'], ['#262a5c', '#0e1030'], ['#30285e', '#120e2e']][Math.floor(r() * 3)];
      list.push({ x, y: y + (r() - 0.5) * 8, s: s * (0.88 + r() * 0.2), wd: 0.85 + r() * 0.35, hem: r() * 4, len: r() < 0.4 ? 10 : r() * 4, hair: Math.floor(r() * 4), bag: r() < 0.2,
        ph: r() * 6, turn: (r() - 0.5) * 0.6, warm: warmPal, cool: coolPal, base: [0], row });
    }
  }
  // 77 light up: a wave from the centre outward, with jitter
  const order = list.map((f, i) => ({ i, d: Math.hypot((f.x - W / 2) / 1.6, (f.y - 760)) + r() * 260 })).sort((a, b) => a.d - b.d);
  const skip = new Set(); const r2 = rng(5);
  // pick 23 to stay dark, scattered evenly
  const idx = list.map((_, i) => i).sort(() => r2() - 0.5).slice(0, 23); idx.forEach(i => skip.add(i));
  let n = 0;
  order.forEach(o => { if (skip.has(o.i)) { list[o.i].tl = null; } else { list[o.i].tl = T_77 + 0.06 + n * 0.0115; n++; } });
  // draw back to front
  return list.sort((a, b) => a.y - b.y);
})();
const STARS = (() => { const r = rng(91); return Array.from({ length: 90 }, () => [r() * W, r() * 420, r()]); })();

function draw(ctx, t) {
  const z = lerp(1.0, 1.12, ease2((t - T0) / (T1 - T0)));
  const layer = camera(ctx, t, W / 2, 640, z, 3);
  const warm = ramp(t, T_77 + 0.3, 674.8);      // the dawn warms as the lights come on
  const chk = ramp(t, 674.6, 675.1);             // "checked": a calm line of light along the horizon
  // sky
  layer(0.2, () => {
    ctx.fillStyle = lin(ctx, 0, -100, 0, 640, [[0, '#070818'], [0.5, '#141640'], [0.85, mix('#2d2560', '#5a3a6a', warm)], [1, mix('#3a2f6a', '#9a5a5a', warm)]]);
    ctx.fillRect(-300, -300, W + 600, 1000);
    for (const [x, y, k] of STARS) { const a = (0.2 + 0.3 * Math.sin(t * (1 + 2 * k) + k * 9)) * (1 - y / 460) * (1 - 0.6 * warm); if (a > 0) { ctx.fillStyle = rgba(C.cream, a); ctx.fillRect(x, y, 2, 2); } }
    glowE(ctx, W / 2, 560, 1300, 300, [[0, rgba('#ff9a5a', 0.10 + 0.32 * warm)], [0.6, rgba('#b0506a', 0.06 + 0.12 * warm)], [1, 'rgba(120,60,90,0)']]);
  });
  // land: far hills then the plain
  layer(0.4, () => {
    gf(ctx, c => { curve(c, [[-300, 552], [200, 530], [520, 548], [900, 526], [1300, 546], [1700, 528], [2200, 548]]); c.lineTo(2200, 700); c.lineTo(-300, 700); c.closePath(); },
      lin(ctx, 0, 520, 0, 640, [[0, mix('#221f4e', '#4a2e52', warm)], [1, '#141433']]), 0.45);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffc27c', 0.04 + 0.25 * warm + 0.3 * chk * (1 - ramp(t, 675.1, 675.45) * 0.3)); ctx.lineWidth = 2;
    ctx.beginPath(); curve(ctx, [[-300, 552], [200, 530], [520, 548], [900, 526], [1300, 546], [1700, 528], [2200, 548]]); ctx.stroke(); ctx.restore();
    gf(ctx, c => { c.moveTo(-300, 560); c.bezierCurveTo(400, 556, 1500, 552, 2200, 562); c.lineTo(2200, 1300); c.lineTo(-300, 1300); c.closePath(); },
      lin(ctx, 0, 556, 0, H, [[0, '#1b1a44'], [0.5, '#121232'], [1, '#08081c']]), 0.5);
    // low mist drifting across the plain
    for (let k = 0; k < 6; k++) { const x = ((k * 420 + t * (12 + k * 3)) % 2600) - 340; glowE(ctx, x, 610 + k * 18, 420, 30, [[0, rgba('#8a86c8', 0.07)], [1, 'rgba(138,134,200,0)']]); }
  });
  // the crowd: one shared grain pass over all bodies
  layer(0.75, () => {
    const glows = [];
    for (const f of CROWD) {
      const lk = f.tl == null ? 0 : out((t - f.tl) / 0.35);
      // the light arrives with a small flash
      const flash = f.tl == null ? 0 : Math.exp(-Math.max(0, t - f.tl) * 5) * (t >= f.tl ? 1 : 0);
      // a shadow pool at the feet
      ctx.fillStyle = 'rgba(4,4,16,0.35)'; ctx.beginPath(); ctx.ellipse(f.x, f.y + 1, 14 * f.s, 3 * f.s, 0, 0, Math.PI * 2); ctx.fill();
      mini(ctx, f, t, lk, null);
      if (lk > 0) glows.push([f, lk, flash]);
    }
    for (const [f, lk, flash] of glows) {
      const b = 0.92 + 0.08 * Math.sin(t * 2.2 + f.ph);
      light(ctx, f.x, f.y - 55 * f.s, 60 * f.s, C.amber, (0.16 * lk + 0.5 * flash) * b);
      // warm pool of light on the ground around each lit person
      glowE(ctx, f.x, f.y + 2, 46 * f.s, 9 * f.s, [[0, rgba(C.amber, 0.22 * lk)], [1, rgba(C.amber, 0)]], true);
    }
    // speckle over the whole crowd band in one pass (keeps the riso texture without 100 clips)
    ctx.save(); ctx.globalAlpha = 0.18; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = pat(ctx); ctx.fillRect(-100, 480, W + 200, 460); ctx.restore();
  });
  // the number lands on "seventy-seven", counting up as the wave spreads
  const pct = Math.round(77 * out((t - T_77) / 1.0));
  stamp(ctx, t, T_77, T1 - 0.1, `${pct}%`, 'of Americans: slow or pause it until proven safe', { size: 150, x: 96, y: 92 });
}
function ease2(x) { x = clamp(x); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }

module.exports = { T0, T1, draw, gf, curve, rr, glowE, camera, mix, pat, mini };
