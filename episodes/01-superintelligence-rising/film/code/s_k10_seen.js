// "If superintelligence comes, it comes into a world that can see what it's doing."
// A huge calm cyan ring rises over the city like a second sun. It is transparent: its inner rings, spokes and
// moving signals are all visible. Thousands of warm windows and people on the rooftops watch; on "see" faint
// lines of sight run from every watcher to the ring and its inner workings light up, readable.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const K = require('./s_k10_kit');
const { gf, rr, camera, glowStroke, ring, dawnSky, cached, figure } = K;

const T0 = 630.9, T1 = 636.3;
const RCX = 960, RR = 300;
const ringY = t => lerp(820, 370, ease((t - 630.95) / 2.9));
const T_SEE = 634.4;

const R = rng(631);
function skyline(seed, y0, hmin, hmax, wmin, wmax) {
  const r = rng(seed), a = []; let x = -150;
  while (x < W + 150) { const w = wmin + r() * (wmax - wmin), h = hmin + r() * (hmax - hmin); a.push({ x, w, h, y: y0, top: r() < 0.25 ? 'spire' : r() < 0.4 ? 'step' : 'flat', s: r() }); x += w + 4 + r() * 10; }
  return a;
}
const FAR = skyline(3, 720, 60, 200, 50, 120), MID = skyline(5, 830, 90, 250, 70, 150), NEAR = skyline(8, 975, 90, 200, 120, 220);
// windows: thousands of tiny lights; each lights at its own moment as the city wakes
const WINS = [];
for (const [layer, list, sz] of [[0, FAR, 4], [1, MID, 6], [2, NEAR, 9]]) for (const b of list) {
  for (let y = b.y - b.h + 14; y < b.y - 10; y += sz * 2.2) for (let x = b.x + 6; x < b.x + b.w - 6; x += sz * 1.9) if (R() < 0.42) WINS.push({ layer, x, y, sz, on: R() < 0.55 ? 0 : 631 + R() * 4, ph: R() * 6 });
}
// rooftop watchers (on NEAR roofs)
const WATCH = (() => { const a = [], r = rng(77); NEAR.forEach((b, i) => { if (i % 2 || b.x < 120 || b.x > 1780) return; const n = 1 + Math.floor(r() * 2);
  for (let k = 0; k < n; k++) a.push({ x: b.x + 30 + r() * (b.w - 60), y: b.y - b.h, s: 0.24 + r() * 0.06, pal: a.length % 4 === 3 ? 1 : 0, ph: r() * 6, point: r() < 0.3 }); }); return a; })();

function building(c, b, cols) {
  const path = cc => { cc.moveTo(b.x, b.y + 200); cc.lineTo(b.x, b.y - b.h);
    if (b.top === 'spire') { cc.lineTo(b.x + b.w * 0.4, b.y - b.h); cc.lineTo(b.x + b.w * 0.5, b.y - b.h - 60); cc.lineTo(b.x + b.w * 0.6, b.y - b.h); }
    if (b.top === 'step') { cc.lineTo(b.x + b.w * 0.2, b.y - b.h); cc.lineTo(b.x + b.w * 0.2, b.y - b.h - 30); cc.lineTo(b.x + b.w * 0.8, b.y - b.h - 30); cc.lineTo(b.x + b.w * 0.8, b.y - b.h); }
    cc.lineTo(b.x + b.w, b.y - b.h); cc.lineTo(b.x + b.w, b.y + 200); cc.closePath(); };
  gf(c, path, lin(c, b.x, 0, b.x + b.w, 0, cols), 0.45);
}
function cityArt(layer) {
  return c => {
    const list = [FAR, MID, NEAR][layer];
    const cols = [[[0, '#9a6a92'], [1, '#7a5488']], [[0, '#7a5486'], [0.2, '#56407a'], [1, '#3e3068']], [[0, '#4a3670'], [0.15, '#2e2552'], [1, '#1c1838']]][layer];
    for (const b of list) building(c, b, cols);
    // unlit windows
    for (const w of WINS) if (w.layer === layer) { c.fillStyle = layer === 2 ? 'rgba(20,14,40,0.6)' : 'rgba(40,30,70,0.35)'; c.fillRect(w.x, w.y, w.sz, w.sz * 1.3); }
  };
}
function windows(ctx, t, layer) {
  for (const w of WINS) { if (w.layer !== layer) continue; const k = w.on ? ramp(t, w.on, w.on + 0.15) : 1; if (k <= 0) continue;
    ctx.fillStyle = rgba(layer === 2 ? '#ffc070' : '#ffcf8a', (0.55 + 0.3 * Math.sin(t * 0.8 + w.ph)) * k); ctx.fillRect(w.x, w.y, w.sz, w.sz * 1.3); }
}

// the transparent ring: outer rim plus everything inside it, visible
const NODES = (() => { const r = rng(12), a = []; for (let i = 0; i < 16; i++) { const an = r() * 6.28, d = 0.2 + r() * 0.65; a.push([an, d, r()]); } return a; })();
function bigRing(ctx, t, y, see) {
  const rot = t * 0.12, rx = RR, ry = RR * 0.96;
  light(ctx, RCX, y, RR * 2.6, C.cyan, 0.22);
  light(ctx, RCX, y, RR * 1.1, C.cyanD, 0.25);
  ring(ctx, t, RCX, y, rx, ry, 0, 1.2, 0.8);
  // inner orbits, dashed and turning
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [k, dash, sp] of [[0.78, [24, 14], 1], [0.6, [6, 10], -1.4], [0.42, [40, 20], 0.8], [0.25, [4, 8], -2]]) {
    ctx.setLineDash(dash); ctx.lineDashOffset = t * 30 * sp; ctx.strokeStyle = rgba(C.cyan, 0.35 + 0.4 * see); ctx.lineWidth = 2 + 1.5 * see;
    ctx.beginPath(); ctx.ellipse(RCX, y, rx * k, ry * k, rot * sp, 0, 7); ctx.stroke(); }
  ctx.setLineDash([]);
  // spokes
  ctx.strokeStyle = rgba(C.cyanW, 0.12 + 0.3 * see); ctx.lineWidth = 1.5;
  for (let i = 0; i < 12; i++) { const a = rot + i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(RCX + Math.cos(a) * rx * 0.25, y + Math.sin(a) * ry * 0.25); ctx.lineTo(RCX + Math.cos(a) * rx * 0.94, y + Math.sin(a) * ry * 0.94); ctx.stroke(); }
  // nodes and the links between them: its workings, in plain view
  const P = NODES.map(([a, d]) => [RCX + Math.cos(a + rot * 0.6) * rx * d, y + Math.sin(a + rot * 0.6) * ry * d]);
  ctx.strokeStyle = rgba(C.cyanW, 0.15 + 0.45 * see); ctx.lineWidth = 1.6;
  for (let i = 0; i < P.length; i++) { const j = (i * 5 + 3) % P.length; ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); ctx.lineTo(P[j][0], P[j][1]); ctx.stroke();
    // a signal travelling along each link
    const u = (t * 0.7 + NODES[i][2]) % 1; light(ctx, lerp(P[i][0], P[j][0], u), lerp(P[i][1], P[j][1], u), 10, C.cyanW, 0.5 + 0.4 * see); }
  ctx.restore();
  for (const p of P) light(ctx, p[0], p[1], 14 + 6 * see, C.cyanW, 0.5 + 0.4 * see);
  light(ctx, RCX, y, 60, C.cyanW, 0.35 + 0.3 * see);
}

function draw(ctx, t) {
  const layer = camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.07, cx: 960, cy: 560, seed: 17 });
  const see = ramp(t, T_SEE - 0.1, T_SEE + 0.4) * (1 - 0.4 * ramp(t, 635.4, 636.3));
  const y = ringY(t);
  layer(0.15, () => dawnSky(ctx, t, -100, 760, 960, 760, { glow: 0.3, sunR: 1000, seed: 9, clouds: 6, stops: [[0, '#1f1c4c'], [0.4, '#45387a'], [0.7, '#9a5a82'], [0.9, '#e08a72'], [1, '#ffc283']] }));
  layer(0.25, () => { bigRing(ctx, t, y, see); });
  layer(0.35, () => { cached(ctx, 'k10far', -150, 380, W + 200, 900, cityArt(0)); windows(ctx, t, 0);
    // haze between the layers
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, 620, 0, 800, [[0, 'rgba(255,170,150,0)'], [1, 'rgba(255,170,150,0.14)']]); ctx.fillRect(-200, 620, W + 400, 200); ctx.restore(); });
  layer(0.5, () => { cached(ctx, 'k10mid', -150, 400, W + 200, 1000, cityArt(1)); windows(ctx, t, 1); });
  // lines of sight from every watcher and many windows, on "see"
  if (see > 0.01) layer(0.5, () => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.2;
    const rs = rng(5);
    for (let i = 0; i < 130; i++) { const w = WINS[Math.floor(rs() * WINS.length)], d = rs();
      const k = clamp((t - T_SEE - d * 0.4) / 0.5); if (k <= 0) continue;
      const tx = RCX + (rs() - 0.5) * RR * 0.8, ty = y + (rs() - 0.5) * RR * 0.8;
      ctx.strokeStyle = rgba('#ffd59a', 0.3 * see); ctx.beginPath(); ctx.moveTo(w.x, w.y); ctx.lineTo(lerp(w.x, tx, ease(k)), lerp(w.y, ty, ease(k))); ctx.stroke(); }
    ctx.restore();
  });
  layer(0.75, () => { ctx.fillStyle = '#1a1634'; ctx.fillRect(-300, 900, W + 600, 400); cached(ctx, 'k10near', -150, 500, W + 200, 1140, cityArt(2)); windows(ctx, t, 2);
    // watchers on the rooftops, faces turned up to the ring
    for (const p of WATCH) {
      const br = Math.sin(t * 1.6 + p.ph), up = 0.6 + 0.2 * ramp(t, T_SEE - 0.3, T_SEE + 0.3);
      const hipY = p.y - 150 * p.s;
      const res = figure(ctx, { x: p.x, y: hipY + br, s: p.s, facing: 'back', br, turn: (RCX - p.x) / 1400, tilt: -0.3 * up, lx: p.x < RCX ? 1 : -1, grain: 0.25,
        rim: C.cyan, rimA: 0.45, rimDx: (RCX - p.x) > 0 ? 1.2 : -1.2, rimDy: -1, pal: p.pal ? ['#7ec8d4', '#3e8494', '#163c48'] : ['#ffb35c', '#c9702e', '#5a2a12'],
        legs: [{ a1: Math.PI / 2 + 0.1, a2: Math.PI / 2 + 0.08 }, { a1: Math.PI / 2 - 0.1, a2: Math.PI / 2 - 0.08 }],
        arms: [{ a1: Math.PI / 2 + 0.2, a2: Math.PI / 2 + 0.1 }, p.point ? { a1: p.x < RCX ? -0.8 : -2.34, a2: p.x < RCX ? -0.75 : -2.4 } : { a1: Math.PI / 2 - 0.2, a2: Math.PI / 2 - 0.1 }] });
      if (see > 0.01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const k = ease(clamp((t - T_SEE - p.ph * 0.04) / 0.5));
        ctx.strokeStyle = rgba('#ffd59a', 0.6 * see); ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.lineDashOffset = -t * 30;
        ctx.beginPath(); ctx.moveTo(res.head[0], res.head[1]); ctx.lineTo(lerp(res.head[0], RCX, k), lerp(res.head[1], y, k)); ctx.stroke(); ctx.restore(); }
    }
  });
  // two people on a terrace in the foreground, close to us, looking up
  layer(1.1, () => {
    gf(ctx, c => c.rect(-200, 960, 900, 300), lin(ctx, 0, 960, 0, H, [[0, '#2a2048'], [1, '#120f26']]), 0.5);
    ctx.fillStyle = '#1a1434'; ctx.fillRect(-200, 900, 900, 8); for (let x = -180; x < 700; x += 46) ctx.fillRect(x, 900, 6, 62);
    ctx.fillStyle = rgba('#8fe6ff', 0.25); ctx.fillRect(-200, 900, 900, 2);
    for (const [x, s, pal, k] of [[260, 0.95, ['#ffb35c', '#c9702e', '#5a2a12'], 0], [440, 0.88, ['#e8a0a0', '#a85a6a', '#4a2030'], 1]]) {
      const br = Math.sin(t * 1.5 + k * 2);
      figure(ctx, { x, y: 1000 + br, s, facing: 'back', br, turn: 0.25 - k * 0.1, tilt: -0.35 * (0.7 + 0.3 * ramp(t, T_SEE - 0.3, T_SEE + 0.3)), lx: 1, rim: C.cyan, rimA: 0.7, rimDx: 2.5, rimDy: -2, pal,
        arms: k ? [{ a1: Math.PI / 2 + 0.3, a2: Math.PI / 2 + 0.2 }, { a1: Math.PI / 2 - 0.15, a2: -0.6 }] : [{ a1: Math.PI / 2 + 0.2, a2: Math.PI / 2 + 0.6 }, { a1: Math.PI / 2 - 0.25, a2: Math.PI / 2 - 0.2 }] });
    }
  });
}

module.exports = { T0, T1, draw };
