// C7 helper: the pedestrian crossing in the rain under sodium light (5.13, 5.14, 5.06, 5.15).
//   street(ctx, t, o)        the whole background plate (cached): opposite facades, the huge self-lit board, far curb with the
//                            pedestrian signal, wet asphalt with the zebra crossing, near curb. o: { cam: { x, y, z } (px drift,
//                            zoom around 960/540), board (0..1 how bright the board burns), ped 'red'|'green', warm (0..1 amber
//                            light that reaches the people, 5.14 "raise"), words (true: the headline on the board) }  → { L(x, y) light at a screen point (for rain), curbY }
//   rain(ctx, t, o)          falling rain streaks lit only where light is (o.L(x, y) → 0..1), o: { n, a, speed, seed, near (big
//                            out-of-focus drops in front), col, warm }
//   ripples(ctx, t, o)       rings on the wet street in the lit pool (o: { box: [x, y, w, h], n, a, col })
//   backFig(ctx, x, y, s, o) a waiting person seen from behind, drawn as a real person (redrawn by C7 after the review of 20.10.):
//                            natural proportions, round shoulders, neck, collar or hood, ears, textured hair, coat seams and folds,
//                            wet sheen, rims only where a light falls, the display's glow on the face edges and hands, continuous life
//                            (breath, weight shift, head, thumb flicks, scarf and strands in the wind, rain landing on the shoulders).
//                            o: { t, seed, look: LOOKS.coat|hood|pack|bun, hold: { side, at: 'face'|'chest'|'ext' }, free, pitch, shUp,
//                            relax, fist, nudge, nudgeSide, scroll, shade, light, light2, glow, screen(g, 100, 200) } (full list at the
//                            function) → { phone: [x, y] (display centre), head, shoulder, glowAt }
//   phoneAt(x, y, s, look, hold) the resting display centre of a look's phone (for transitions that land on it)
//   sleeve(ctx, E, Wr, o)    a coat sleeve from an elbow to a cuff in screen space (the near person's arm up to heldPhone's hand)
import { W, H, rgba, clamp, mix, prng, canvas, lin, eout, eio, addGlow, hatch } from '../engine.mjs';
import { fog as artFog, stipple, vnoise } from './art.mjs';
import { Path2D } from '@napi-rs/canvas';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;
export const SODIUM = '#ff9a3c', NIGHT = '#0d1530', BOARD = '#e9f0ff';
const M = 140; // plate margin for camera drift
// geometry of the plate (screen coordinates at cam 0)
export const ST = { far: 600, near: 868, boardX: 1010, boardY: 92, boardW: 760, boardH: 380, pedX: 560, pedY: 360, lampX: 250, lampY: 70 };

function plate() {
  return once('plate', () => {
    const [c, g] = canvas(W + 2 * M, H + 2 * M); g.translate(M, M); const r = prng(41), n = vnoise(5);
    // night sky behind the roofs
    const sg = g.createLinearGradient(0, -M, 0, ST.far); sg.addColorStop(0, '#070b1c'); sg.addColorStop(.6, '#101a36'); sg.addColorStop(1, '#1a2444');
    g.fillStyle = sg; g.fillRect(-M, -M, W + 2 * M, ST.far + M);
    // opposite facades: dark blocks with a few windows (warm and cool), engraved horizontal lines
    let x = -M; while (x < W + M) {
      const w = 150 + r() * 260, top = -M + r() * 160 + (x > 900 && x < 1800 ? -40 : 60);
      const fg = g.createLinearGradient(0, top, 0, ST.far); fg.addColorStop(0, '#121a33'); fg.addColorStop(1, '#0b1022'); g.fillStyle = fg; g.fillRect(x, top, w + 2, ST.far - top);
      g.strokeStyle = 'rgba(160,180,220,.05)'; g.lineWidth = 1; for (let yy = top + 8; yy < ST.far; yy += 5) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); }
      for (let wy = top + 30; wy < ST.far - 90; wy += 46) for (let wx = x + 18; wx < x + w - 30; wx += 38) { if (r() < .2) { const warm = r() < .6; g.fillStyle = warm ? rgba('#ffb878', .35 + r() * .35) : rgba('#9fb6cf', .2 + r() * .2); g.fillRect(wx, wy, 16, 22); } }
      x += w;
    }
    // shopfront band at street level, an awning, dark
    g.fillStyle = '#0a0e1c'; g.fillRect(-M, ST.far - 110, W + 2 * M, 110);
    for (let i = 0; i < 9; i++) { const sx = -M + i * 260 + r() * 60; g.fillStyle = rgba(r() < .5 ? '#ffb878' : '#9fb6cf', .1 + r() * .12); g.fillRect(sx, ST.far - 92, 140 + r() * 60, 70); }
    // the board's frame and struts (its face is drawn live)
    g.fillStyle = '#05070f'; g.fillRect(ST.boardX - 16, ST.boardY - 16, ST.boardW + 32, ST.boardH + 32);
    g.fillRect(ST.boardX + 120, ST.boardY + ST.boardH, 22, 120); g.fillRect(ST.boardX + ST.boardW - 140, ST.boardY + ST.boardH, 22, 120);
    // far sidewalk
    const fw = g.createLinearGradient(0, ST.far - 22, 0, ST.far + 6); fw.addColorStop(0, '#1b2238'); fw.addColorStop(1, '#262c42'); g.fillStyle = fw; g.fillRect(-M, ST.far - 22, W + 2 * M, 28);
    // the street: wet asphalt, darker toward us, grain
    const ag = g.createLinearGradient(0, ST.far, 0, ST.near); ag.addColorStop(0, '#1a2034'); ag.addColorStop(1, '#0a0d18'); g.fillStyle = ag; g.fillRect(-M, ST.far + 6, W + 2 * M, ST.near - ST.far);
    for (let i = 0; i < 9000; i++) { const px = -M + r() * (W + 2 * M), py = ST.far + 6 + r() * (ST.near - ST.far); g.fillStyle = r() < .5 ? 'rgba(170,180,210,.05)' : 'rgba(0,0,0,.18)'; g.fillRect(px, py, 1.5, 1); }
    // zebra crossing: bars parallel to the curb, receding toward the far side (true perspective)
    const VX = 1060, F = 900, h0 = 1.6; const Y = (Z) => 452 + h0 * F / Z; // ground plane (Z metres from camera)
    for (let k = 0; k < 9; k++) {
      const z0 = 4.2 + k * 1.1, z1 = z0 + .55, y0 = Y(z1), y1 = Y(z0); if (y1 < ST.far + 4 || y0 > ST.near) continue;
      const half = (z) => 3.2 * F / z, xl0 = VX - half(z1) - 260, xr0 = VX + half(z1) - 260, xl1 = VX - half(z0) - 260, xr1 = VX + half(z0) - 260;
      g.beginPath(); g.moveTo(xl0, Math.max(y0, ST.far + 6)); g.lineTo(xr0, Math.max(y0, ST.far + 6)); g.lineTo(xr1, Math.min(y1, ST.near)); g.lineTo(xl1, Math.min(y1, ST.near)); g.closePath();
      const bg = g.createLinearGradient(0, y0, 0, y1); bg.addColorStop(0, 'rgba(205,210,220,.30)'); bg.addColorStop(1, 'rgba(205,210,220,.44)'); g.fillStyle = bg; g.fill();
      g.save(); g.clip(); for (let i = 0; i < 260; i++) { g.fillStyle = 'rgba(10,12,22,.35)'; g.fillRect(xl1 + r() * (xr1 - xl1), y0 + r() * (y1 - y0), 2 + r() * 6, 1.2); } g.restore();
    }
    // near curb + sidewalk
    g.fillStyle = '#2a3046'; g.fillRect(-M, ST.near, W + 2 * M, 10); g.fillStyle = 'rgba(255,170,90,.25)'; g.fillRect(-M, ST.near, W + 2 * M, 1.5);
    const nw = g.createLinearGradient(0, ST.near + 10, 0, H + M); nw.addColorStop(0, '#141826'); nw.addColorStop(1, '#07090f'); g.fillStyle = nw; g.fillRect(-M, ST.near + 10, W + 2 * M, H + M - ST.near);
    for (let yy = ST.near + 40; yy < H + M; yy += 60 + (yy - ST.near) * .3) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-M, yy, W + 2 * M, 2); }
    // the lamp post (left) and the signal pole (far curb)
    g.fillStyle = '#05070d'; g.fillRect(ST.lampX - 70, ST.lampY + 10, 12, H); g.beginPath(); g.moveTo(ST.lampX - 64, ST.lampY + 14); g.quadraticCurveTo(ST.lampX - 60, ST.lampY - 20, ST.lampX + 10, ST.lampY - 4); g.lineWidth = 9; g.strokeStyle = '#05070d'; g.stroke();
    g.beginPath(); g.ellipse(ST.lampX + 26, ST.lampY + 2, 46, 13, .08, 0, TAU); g.fillStyle = '#0a0b12'; g.fill();
    g.fillStyle = '#05070d'; g.fillRect(ST.pedX - 4, ST.pedY + 40, 8, ST.far - ST.pedY - 30);
    // haze in front of the facades
    artFog(g, { y0: ST.far - 260, y1: ST.far + 40, col: '#3a4670', a: .35, seed: 4, cover: .5 });
    return c;
  });
}
// the light map (screen space, cam 0): sodium cone + pool, the board's own glow (but not the people)
const sodium = (x, y) => { const dx = (x - (ST.lampX + 40 + (y - ST.lampY) * .55)) / (60 + (y - ST.lampY) * .62), q = clamp(1 - dx * dx); return y > ST.lampY ? q * clamp((y - ST.lampY) / 120) * clamp(1 - (y - ST.near) / 120) : 0; };
const boardL = (x, y) => { const cx = ST.boardX + ST.boardW / 2, cy = ST.boardY + ST.boardH / 2, dx = (x - cx) / (ST.boardW * .75), dy = (y - cy) / (ST.boardH * 1.1); return clamp(1 - dx * dx - dy * dy) * .8; };
function boardFace(ctx, x, y, w, h, t, b, words = true) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#f4f7ff'); g.addColorStop(1, '#cfdaf0');
  ctx.save(); ctx.globalAlpha = .35 + .65 * b; ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // the same headline, huge, and a line chart that shoots up
  if (words) { ctx.fillStyle = '#0d1530'; ctx.font = `${Math.round(h * .17)}px "Instrument Serif"`; ctx.textBaseline = 'alphabetic'; ctx.fillText('AI company', x + w * .06, y + h * .3); ctx.fillText('doubles its value', x + w * .06, y + h * .5); }
  ctx.strokeStyle = '#c4512e'; ctx.lineWidth = h * .022; ctx.lineJoin = 'round'; ctx.beginPath(); const pts = [[.06, .9], [.25, .86], [.4, .82], [.55, .8], [.68, .72], [.8, .5], [.92, .22]];
  pts.forEach(([u, v], i) => (i ? ctx.lineTo(x + w * u, y + h * v) : ctx.moveTo(x + w * u, y + h * v))); ctx.stroke();
  ctx.fillStyle = '#c4512e'; ctx.beginPath(); ctx.moveTo(x + w * .92, y + h * .14); ctx.lineTo(x + w * .955, y + h * .26); ctx.lineTo(x + w * .885, y + h * .25); ctx.closePath(); ctx.fill();
  ctx.restore();
}
export function street(ctx, t, o = {}) {
  const cam = o.cam || {}, cx = cam.x || 0, cy = cam.y || 0, z = cam.z || 1, b = o.board ?? 1;
  ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960 - cx, -540 - cy);
  ctx.drawImage(plate(), -M, -M);
  boardFace(ctx, ST.boardX, ST.boardY, ST.boardW, ST.boardH, t, b, o.words !== false);
  // the board lights itself: halo on its own frame and wall, and a cold reflection on the wet street, broken by ripples
  addGlow(ctx, ST.boardX + ST.boardW / 2, ST.boardY + ST.boardH / 2, ST.boardW * .62, .28 * b, '#bcd0ff', '#ffffff');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = prng(8);
  for (let i = 0; i < 46; i++) { const yy = ST.far + 12 + Math.pow(r(), 1.3) * 150, ww = (ST.boardW * .7) * (1 - (yy - ST.far) / 260) * (.4 + r() * .6), xx = ST.boardX + ST.boardW * .15 + r() * ST.boardW * .5 + Math.sin(t * 2 + i) * 6;
    ctx.fillStyle = rgba('#cfdcff', (.05 + r() * .09) * b); ctx.fillRect(xx, yy, ww, 1.6 + r() * 2); }
  // sodium pool on the crossing + its reflection
  const px = ST.lampX + 300, py = ST.near - 120; const pg = ctx.createRadialGradient(px, py, 0, px, py, 420); pg.addColorStop(0, rgba(SODIUM, .34)); pg.addColorStop(1, rgba(SODIUM, 0));
  ctx.save(); ctx.translate(px, py); ctx.scale(1, .28); ctx.translate(-px, -py); ctx.fillStyle = pg; ctx.fillRect(px - 420, py - 420, 840, 840); ctx.restore();
  for (let i = 0; i < 26; i++) { const yy = ST.far + 40 + r() * 200, xx = ST.lampX + 120 + r() * 200 + Math.sin(t * 1.7 + i * 2) * 5; ctx.fillStyle = rgba(SODIUM, .06 + r() * .1); ctx.fillRect(xx, yy, 40 + r() * 120, 1.5 + r() * 1.5); }
  // the sodium cone itself (soft, through the rain)
  const cg = ctx.createLinearGradient(ST.lampX + 30, ST.lampY, ST.lampX + 260, ST.near); cg.addColorStop(0, rgba(SODIUM, .22)); cg.addColorStop(1, rgba(SODIUM, .02));
  ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(ST.lampX - 6, ST.lampY + 8); ctx.lineTo(ST.lampX + 62, ST.lampY + 8); ctx.lineTo(ST.lampX + 640, ST.near); ctx.lineTo(ST.lampX - 110, ST.near); ctx.closePath(); ctx.fill();
  addGlow(ctx, ST.lampX + 26, ST.lampY + 10, 120, .55, SODIUM, '#ffe2b0');
  // pedestrian signal: red standing figure (or green walking), halo and reflection
  const red = (o.ped || 'red') === 'red', sc = red ? '#ff4a3a' : '#5fe0a8';
  ctx.fillStyle = '#05070d'; ctx.fillRect(ST.pedX - 26, ST.pedY - 40, 52, 86); ctx.fillStyle = '#0b0d16'; ctx.fillRect(ST.pedX - 21, ST.pedY - 35, 42, 76);
  addGlow(ctx, ST.pedX, ST.pedY, 70, .5, sc, '#ffd8d0');
  ctx.fillStyle = sc; ctx.beginPath(); ctx.arc(ST.pedX, ST.pedY - 22, 4.5, 0, TAU); ctx.fill(); ctx.fillRect(ST.pedX - 6, ST.pedY - 16, 12, 20); ctx.fillRect(ST.pedX - 5, ST.pedY + 4, 4, 16); ctx.fillRect(ST.pedX + 1, ST.pedY + 4, 4, 16);
  for (let i = 0; i < 10; i++) { ctx.fillStyle = rgba(sc, .12 - i * .01); ctx.fillRect(ST.pedX - 12 + Math.sin(t * 2.3 + i) * 3, ST.far + 30 + i * 13, 24, 2); }
  ctx.restore();
  // warm light reaching the people (5.14)
  const warm = o.warm ?? 0;
  if (warm > 0) { ctx.globalCompositeOperation = 'lighter'; const wg = ctx.createRadialGradient(960, 900, 0, 960, 900, 1100); wg.addColorStop(0, rgba('#ffb35c', .3 * warm)); wg.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = wg; ctx.fillRect(-M, 300, W + 2 * M, H); }
  ctx.restore();
  const L = (x, y) => { const X = (x - 960) / z + 960 + cx, Y = (y - 540) / z + 540 + cy; return clamp(sodium(X, Y) + boardL(X, Y) * b + warm * clamp(1 - Math.hypot(X - 960, Y - 820) / 900) * .8); };
  return { L, curbY: (ST.near - 540 - cy) * z + 540 };
}
export function rain(ctx, t, o = {}) {
  const n = o.n ?? 520, sp = o.speed ?? 1, L = o.L || (() => .3), a = o.a ?? 1, col = o.col || '#cfdcff', warm = o.warm ?? 0;
  const R = once('rain' + (o.seed ?? 1) + n, () => { const r = prng(o.seed ?? 1); return Array.from({ length: n }, () => ({ x: r() * (W + 200) - 100, y: r() * H, z: .35 + r() * .65, v: 1500 + r() * 700, ph: r() })); });
  ctx.save(); ctx.lineCap = 'round';
  const slope = .12;
  for (const d of R) {
    const len = 26 + 46 * d.z, yy = ((d.y + t * d.v * sp) % (H + 120)) - 60, xx = d.x + yy * slope;
    const l = L(xx, yy); if (l < .03) continue;
    ctx.strokeStyle = rgba(warm > 0 ? '#ffd29a' : (l > .5 && xx < 900 ? '#ffc68a' : col), Math.min(.75, l * (.25 + .5 * d.z)) * a);
    ctx.lineWidth = .8 + d.z * 1.4; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + len * slope, yy + len); ctx.stroke();
  }
  // near: a few big out-of-focus drops in front of the lens
  if (o.near) { const r = prng(9); for (let i = 0; i < 14; i++) { const x = r() * W, y = ((r() * H + t * (300 + r() * 200)) % (H + 200)) - 100, rr = 6 + r() * 14; const g = ctx.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, rgba('#ffd9a8', .12 * o.near)); g.addColorStop(1, rgba('#ffd9a8', 0)); ctx.fillStyle = g; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2); } }
  ctx.restore();
}
export function ripples(ctx, t, o = {}) {
  const [bx, by, bw, bh] = o.box || [300, 640, 900, 200], n = o.n ?? 26, col = o.col || SODIUM, r = prng(o.seed ?? 3);
  ctx.save(); ctx.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    const per = .7 + r() * .6, ph = r() * per, x = bx + r() * bw, y = by + r() * bh, k = ((t + ph) % per) / per, rad = 4 + k * 26 * (y - by + 60) / (bh + 60);
    ctx.strokeStyle = rgba(col, .35 * (1 - k) * (o.a ?? 1)); ctx.beginPath(); ctx.ellipse(x, y, rad, rad * .28, 0, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

// ---------- the people waiting in the rain, seen from behind (C7, redrawn after the review of 20.10.) ----------
// Figure units: feet at 0, up is negative, every look is authored as an adult of 180 units and scaled by look.h / 180, so
// the head is about 1/7.5 of the body. Everything is a vector path drawn straight into ctx each frame (no per-frame offscreen
// canvases); only the engraved hatch (per pixel scale) and the hair strands (per look) are cached.
function shadeHex(hex, d) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(clamp(v * (1 + d), 0, 255)); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }
const fract = (v) => v - Math.floor(v), hash = (i, j = 0) => fract(Math.sin(i * 127.1 + j * 311.7) * 43758.5453);
// cubic Bézier sampled into a point list (skips the start point when the list already ends there)
const cub = (o, a, b, c, d, n = 8) => { for (let i = o.length ? 1 : 0; i <= n; i++) { const u = i / n, v = 1 - u; o.push([v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]); } return o; };
// a run of cubic segments [[c1, c2, end], …] from p0
const run = (p0, segs, n = 8, o = [p0]) => { let p = p0; for (const [b, c, d] of segs) { cub(o, p, b, c, d, n); p = d; } return o; };
// right half (top centre → bottom centre, clockwise) + its mirror = a closed symmetric outline
const sym = (half, dx = 0) => { const o = half.map(([x, y]) => [x + dx, y]); for (let i = half.length - 2; i > 0; i--) o.push([-half[i][0] + dx, half[i][1]]); return o; };
const area = (p) => { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } return a / 2; };
const cw = (p) => (area(p) < 0 ? p.reverse() : p);
const trace = (ctx, p) => { ctx.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]); ctx.closePath(); };
const line = (ctx, p) => { ctx.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]); };
const xf = (p, m) => p.map(([x, y]) => [m[0] + x * m[2] - y * m[3], m[1] + x * m[3] + y * m[2]]);   // m = [tx, ty, cos, sin]
// a soft limb (sleeve, trouser leg) along nodes [[x, y, r], …]: Catmull-Rom centre line, offset both sides, round ends
function tube(nodes, n = 6, open = false) {
  const C = [], cr = (a, b, c, d, u) => { const u2 = u * u, u3 = u2 * u; return [0, 1, 2].map((i) => .5 * (2 * b[i] + (-a[i] + c[i]) * u + (2 * a[i] - 5 * b[i] + 4 * c[i] - d[i]) * u2 + (-a[i] + 3 * b[i] - 3 * c[i] + d[i]) * u3)); };
  for (let i = 0; i < nodes.length - 1; i++) { const a = nodes[Math.max(0, i - 1)], b = nodes[i], c = nodes[i + 1], d = nodes[Math.min(nodes.length - 1, i + 2)]; for (let k = i ? 1 : 0; k <= n; k++) C.push(cr(a, b, c, d, k / n)); }
  const Lp = [], Rp = [];
  for (let i = 0; i < C.length; i++) { const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
    Lp.push([C[i][0] - dy / m * C[i][2], C[i][1] + dx / m * C[i][2]]); Rp.push([C[i][0] + dy / m * C[i][2], C[i][1] - dx / m * C[i][2]]); }
  const clean = (sd2) => { const o = [sd2[0]]; for (let i = 1; i < sd2.length; i++) { const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], q = o[o.length - 1]; if ((sd2[i][0] - q[0]) * (b[0] - a[0]) + (sd2[i][1] - q[1]) * (b[1] - a[1]) > 0 || i === sd2.length - 1) o.push(sd2[i]); } return o; };
  const Lc = clean(Lp), Rc = clean(Rp);
  const capAt = (c, from, out) => { const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]); for (let k = 1; k < 7; k++) { const a = a0 - Math.PI * k / 7; out.push([c[0] + Math.cos(a) * c[2], c[1] + Math.sin(a) * c[2]]); } };
  const o = [...Lc]; if (!open) capAt(C[C.length - 1], Lc[Lc.length - 1], o); for (let i = Rc.length - 1; i >= 0; i--) o.push(Rc[i]); capAt(C[0], Rc[0], o);
  return { pts: cw(o), C };
}
// rim light on a closed outline: each edge whose outward normal faces the light gets a stroke; 3 alpha levels batched in 3 paths.
// L = { d: [dx, dy] (direction to a far light) | p: [x, y], r (a point light), col, a, w (stroke width in figure units), fall(y) }
function rimOn(ctx, pts, L) {
  if (!L || !(L.a > 0)) return;
  const lv = [[], [], []];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length], dx = q[0] - p[0], dy = q[1] - p[1], m = Math.hypot(dx, dy); if (m < 1e-6) continue;
    const nx = dy / m, ny = -dx / m, mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    let w;
    if (L.p) { const lx = L.p[0] - mx, ly = L.p[1] - my, d = Math.hypot(lx, ly) || 1; w = Math.max(0, (nx * lx + ny * ly) / d + .25) / 1.25 * Math.exp(-(d * d) / (L.r * L.r)); }
    else w = Math.pow(Math.max(0, nx * L.d[0] + ny * L.d[1]), 1.4);
    if (L.fall) w *= L.fall(my);
    const k = Math.round(w * 3); if (k > 0) lv[k - 1].push(p, q);
  }
  ctx.lineWidth = L.w; ctx.lineCap = 'round';
  for (let k = 0; k < 3; k++) { if (!lv[k].length) continue; ctx.beginPath(); for (let i = 0; i < lv[k].length; i += 2) { ctx.moveTo(lv[k][i][0], lv[k][i][1]); ctx.lineTo(lv[k][i + 1][0], lv[k][i + 1][1]); } ctx.strokeStyle = rgba(L.col, L.a * (k + 1) / 3); ctx.stroke(); }
}
// thumb scroll twitches: a quick flick (.07 s) and a slow settle (.3 s) every 1.1–2.6 s, a different rhythm per person
function flicks(t, sd) {
  let v = 0; const P = 1.55 + (sd % 3) * .2, off = sd * .61, k0 = Math.floor((t + off) / P);
  for (let k = k0 - 1; k <= k0; k++) { const h = hash(k, sd * 7.3); if (h < .22) continue; const dt = t - (k * P - off + h * P * .45); if (dt >= 0 && dt < .38) v += dt < .07 ? eout(dt / .07) : 1 - eio((dt - .07) / .31); }
  return v;
}
// the looks of the four waiting people (distinct heights, silhouettes, coats and hair; the accent sits on one garment each)
export const LOOKS = {
  coat: { h: 183, sw: 1.05, hw: 1, coat: '#232b40', kind: 'wool', len: 'knee', hair: 'short', hairCol: '#15100e', skin: '#a8734f', scarf: '#c8843a', pants: '#121422', seed: 11 },
  hood: { h: 165, sw: .9, hw: 1.06, coat: '#2a3d43', kind: 'puffer', len: 'thigh', hood: true, hair: 'none', hairCol: '#2a1c16', skin: '#c99a78', pants: '#15151f', seed: 12 },
  pack: { h: 178, sw: 1.02, hw: .97, coat: '#262b38', kind: 'shell', len: 'hip', hat: '#b9807c', hair: 'short', hairCol: '#0e0b0b', skin: '#7a5238', bag: '#191c25', pants: '#1b2233', seed: 13 },
  bun: { h: 166, sw: .9, hw: 1.04, coat: '#3a2f45', kind: 'trench', len: 'knee', belt: true, hair: 'bun', hairCol: '#3b2418', skin: '#d2a07c', scarf: '#e9c46a', pants: '#141322', seed: 14 },
};
// hair strands per look (head-local units, head centre at 0,0), cached as two Path2Ds: the strands and the lighter strands
const HAIRC = new Map();
function hairStrands(L) {
  const key = L.hair + L.seed; if (HAIRC.has(key)) return HAIRC.get(key);
  const r = prng(L.seed * 31 + 7), dark = new Path2D(), lite = new Path2D(), bun = L.hair === 'bun', W0 = [1.4, -9.4], B = [.6, -12.2];
  const inside = (x, y) => (x * x) / (9.1 * 9.1) + ((y + 1.6) * (y + 1.6)) / (11.3 * 11.3) < 1 && y < 7.6 - Math.abs(x) * .35;
  for (let i = 0; i < (bun ? 300 : 340); i++) {
    let x, y, n = 0; do { x = (r() * 2 - 1) * 9.2; y = -12.8 + r() * 21; n++; } while (!inside(x, y) && n < 30);
    let dx, dy, len;
    if (bun) { dx = B[0] - x; dy = B[1] - y; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m; len = Math.min(m * .8, 2.2 + r() * 2.6); }
    else { dx = x - W0[0]; dy = y - W0[1]; const m = Math.hypot(dx, dy) || 1, sw = .55 * Math.exp(-m / 4); dx /= m; dy /= m; [dx, dy] = [dx * Math.cos(sw) - dy * Math.sin(sw), dx * Math.sin(sw) + dy * Math.cos(sw)]; dy += .35 + m * .03; const mm = Math.hypot(dx, dy); dx /= mm; dy /= mm; len = 1.4 + r() * 2.4; }
    const bend = (r() - .5) * .9, ex = x + dx * len, ey = y + dy * len, cx = (x + ex) / 2 - dy * bend, cy = (y + ey) / 2 + dx * bend;
    const P = r() < .34 ? lite : dark; P.moveTo(x, y); P.quadraticCurveTo(cx, cy, ex, ey);
  }
  if (bun) for (let i = 0; i < 26; i++) { const a0 = r() * TAU, rr = 1 + r() * 3.4, sweep = 1.2 + r() * 1.8, P = r() < .4 ? lite : dark; P.moveTo(B[0] + .1 + Math.cos(a0) * rr, -14 + Math.sin(a0) * rr * .9); P.ellipse(B[0] + .1, -14, rr, rr * .9, 0, a0, a0 + sweep); }
  const out = { dark, lite }; HAIRC.set(key, out); return out;
}
// the engraved hatch over the lower body, cached per pixel scale: diagonal lines, fading in from the chest down
const HATCH = new Map();
function hatchImg(S) {
  const key = Math.round(S * 10); if (HATCH.has(key)) return HATCH.get(key);
  const x0 = -40, y0 = -190, wu = 80, hu = 200, [c, g] = canvas(Math.ceil(wu * S), Math.ceil(hu * S));
  hatch(g, null, -1.12, 3.4, .5, { box: [0, 0, c.width, c.height], col: '#04050b', w: .75, wobble: .6 });
  hatch(g, null, .5, 4.6, .28, { box: [0, Math.round((-95 - y0) * S), c.width, c.height], col: '#04050b', w: .6, wobble: .6 });
  g.globalCompositeOperation = 'destination-in'; const fg = g.createLinearGradient(0, (-150 - y0) * S, 0, (-60 - y0) * S); fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(.45, 'rgba(0,0,0,.55)'); fg.addColorStop(1, 'rgba(0,0,0,1)');
  g.fillStyle = fg; g.fillRect(0, 0, c.width, c.height);
  const out = { c, x0, y0 }; HATCH.set(key, out); return out;
}
// where a look holds its phone (figure units → screen), for transitions that must land on a display
export function phoneAt(x, y, s, look, hold) { const k = (look || LOOKS.coat).h / 180, sx = hold?.side ?? 1, P = hold?.at === 'chest' ? [sx * 5.5, -127] : [sx * 11.4, -158.6]; return [x + P[0] * s * k, y + P[1] * s * k]; }
// A sleeve from an elbow to a cuff in screen space (the near person's forearm up to the hand that holds heldPhone):
//   sleeve(ctx, [ex, ey], [wx, wy], { r0, r1 (half widths px), col, rim: { col, a }, rim2, glow: { col, a, p: [x, y] }, shade })
export function sleeve(ctx, E, Wr, o = {}) {
  const r0 = o.r0 ?? 50, r1 = o.r1 ?? 40, col = o.col || '#232b40', dx = Wr[0] - E[0], dy = Wr[1] - E[1], m = Math.hypot(dx, dy) || 1;
  const mid = [E[0] + dx * .55 - dy / m * r0 * .12, E[1] + dy * .55 + dx / m * r0 * .12, (r0 + r1) / 2 * 1.02];
  const T = tube([[E[0], E[1], r0], mid, [Wr[0], Wr[1], r1]], 8, true), P = T.pts;
  ctx.save(); ctx.beginPath(); trace(ctx, P); ctx.fillStyle = shadeHex(col, -.22); ctx.fill(); ctx.clip();
  const g = ctx.createLinearGradient(E[0], E[1], Wr[0], Wr[1]); g.addColorStop(0, 'rgba(3,4,10,.6)'); g.addColorStop(.7, 'rgba(3,4,10,.2)'); g.addColorStop(1, 'rgba(120,140,190,.06)'); ctx.fillStyle = g; ctx.fillRect(Math.min(E[0], Wr[0]) - r0 * 2, Math.min(E[1], Wr[1]) - r0 * 2, Math.abs(dx) + r0 * 4, Math.abs(dy) + r0 * 4);
  // cuff band and two compression folds where the forearm bends
  const ux = dx / m, uy = dy / m, nx = -uy, ny = ux, at = (u, v) => [E[0] + dx * u + nx * v, E[1] + dy * u + ny * v];
  ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(2,3,8,.7)'; ctx.lineWidth = Math.max(1.2, r1 * .05);
  for (const [u, a] of [[.88, 1], [.42, .7], [.3, .55]]) { ctx.globalAlpha = a; ctx.beginPath(); const p0 = at(u, -r1 * 1.05), p1 = at(u + .03, 0), p2 = at(u, r1 * 1.05); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]); ctx.stroke(); }
  ctx.globalAlpha = 1; if (o.shade) { ctx.fillStyle = `rgba(8,11,24,${o.shade})`; ctx.fillRect(Math.min(E[0], Wr[0]) - r0 * 2, Math.min(E[1], Wr[1]) - r0 * 2, Math.abs(dx) + r0 * 4, Math.abs(dy) + r0 * 4); }
  const rw = Math.max(1.6, r1 * .05), cutoff = (yy) => (yy < Wr[1] + r1 * .35 ? 0 : 1);
  if (o.rim) rimOn(ctx, P, { d: o.rim.d || [.6, -.8], col: o.rim.col, a: o.rim.a, w: rw * 2, fall: cutoff });
  if (o.rim2) rimOn(ctx, P, { d: o.rim2.d || [-.8, -.6], col: o.rim2.col, a: o.rim2.a, w: rw * 2, fall: cutoff });
  if (o.glow) rimOn(ctx, P, { p: o.glow.p, r: o.glow.r || r1 * 3, col: o.glow.col, a: o.glow.a, w: rw * 2.4 });
  ctx.restore();
  // the open cuff: its dark inside where the wrist goes in, a lit lip on the side toward the display
  ctx.save(); ctx.translate(Wr[0], Wr[1]); ctx.rotate(Math.atan2(dy, dx) + Math.PI / 2);
  ctx.fillStyle = 'rgba(2,2,6,.85)'; ctx.beginPath(); ctx.ellipse(0, r1 * .05, r1 * .94, r1 * .22, 0, 0, TAU); ctx.fill();
  if (o.glow) { ctx.strokeStyle = rgba(o.glow.col, .45 * o.glow.a); ctx.lineWidth = rw; ctx.beginPath(); ctx.ellipse(0, r1 * .05, r1 * .94, r1 * .22, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
  ctx.restore();
}
// backFig(ctx, x, y, s, o): one waiting person seen from behind; x, y = between the feet on screen, s = px per unit for a 180 adult.
//   o: { t, seed, look (LOOKS.*), hold: { side: 1 right | -1 left, at: 'face' (phone up beside the head, its display peeks past it)
//        | 'chest' (both hands, hidden; glow only) | 'ext' (the arm is drawn by the scene, e.g. heldPhone + sleeve) },
//        free: 'pocket' | 'hang' (the other arm), pitch (0..1 head bowed to the phone), shUp (0..1 shoulders pulled up), relax (0..1
//        shoulders drop, head lifts), fist (0..1 the free arm rises to a quiet fist beside the head), nudge (0..1 the elbow on
//        nudgeSide jabs out), nudgeSide (-1 left), scroll (0..1 extra thumb flick, e.g. the swipe), shade (0..1 in shadow),
//        light: { x, y, col, a } (the board, cool), light2 (the sodium lamp, warm), glow: { col, a } (the display's light on the face
//        edges, ears, hands and the rain), screen(g, w, h) (draws the display content, 100 × 200 units), wind (0..1) }
//   → { phone: [x, y] (display centre on screen), head: [x, y], shoulder: [x, y], glowAt: [x, y] }
export function backFig(ctx, x, y, s, o = {}) {
  const L = o.look || LOOKS.coat, t = o.t ?? 0, sd = (o.seed ?? 1) + L.seed, S = s * L.h / 180, px = 1 / S, W = L.sw, HW = L.hw;
  const D = { coat: L.coat, skin: L.skin, hair: L.hairCol, pants: L.pants || '#131427' };
  // ---- life: breath, weight shift, head, thumb flicks; every person has its own periods and phases (never in unison)
  const ph = sd * 1.37, br = Math.sin(t * TAU / (3.5 + hash(sd, 1) * 1.3) + ph), sway = Math.sin(t * TAU / (6.8 + hash(sd, 2) * 3.2) + ph * 1.7) * .75 + Math.sin(t * TAU / (2.7 + hash(sd, 3) * .9) + ph * .6) * .25;
  const relax = clamp(o.relax ?? 0), up = clamp(o.shUp ?? 0) * (1 - relax), nud = clamp(o.nudge ?? 0), nsd = o.nudgeSide ?? -1, fist = eio(clamp(o.fist ?? 0));
  const hold = o.hold || null, hs = hold?.side ?? 1, fr = o.free || 'pocket', fsd = -hs, wind = o.wind ?? 1;
  const fl = flicks(t, sd) + (o.scroll ?? 0) * 1.8;
  const U = up * 4.8 - relax * .9 + br * .38;                       // shoulder lift
  const bx = sway * .9 + nud * nsd * 2.2, hipX = -sway * .45;        // upper body / hip shift
  const lean = sway * .006 + nud * nsd * .045;
  const pitch = clamp((o.pitch ?? (hold?.at === 'chest' ? .85 : .55)) + .07 * Math.sin(t * 1.13 + ph * 2) - relax * .5 + up * .15);
  const roll = .035 * Math.sin(t * .71 + ph * 2.3) + (hold && hold.at !== 'ext' ? hs * .06 : hold ? hs * .03 : 0) * (1 - relax * .6) + nud * nsd * .05;
  const ys = -147.4 - U, yc = -151.2 - U * .78;                     // shoulder point, collar base
  const lit = o.light ? [o.light.x - x, o.light.y - (y - 140 * S)] : [.6, -1], lit2 = o.light2 ? [o.light2.x - x, o.light2.y - (y - 140 * S)] : [-1, -1];
  const nrm = (v) => { const m = Math.hypot(v[0], v[1]) || 1; return [v[0] / m, v[1] / m]; };
  const dA = nrm(lit), dB = nrm(lit2), topFall = (yy) => clamp(1 - (yy + 150) / 70, .15, 1);
  const rimA = o.light ? { d: dA, col: o.light.col || '#cfdcff', a: o.light.a ?? .7, w: Math.max(1.3, S * .16) * px * 2, fall: topFall } : null;
  const rimB = o.light2 ? { d: dB, col: o.light2.col || SODIUM, a: o.light2.a ?? .5, w: Math.max(1.2, S * .14) * px * 2, fall: topFall } : null;
  const shade = o.shade || 0, G = o.glow || null, gcol = G?.col || '#cfe0ff', ga = G ? (G.a ?? .8) : 0;
  // ---- the head transform (pitch bows it toward the phone, roll tilts it to the phone side)
  const hc = [bx * 1.15 + roll * 6, -167.6 - U * .62 + pitch * 1.5 + (L.h < 172 ? .4 : 0)], sq = 1 - .05 * pitch;
  const HM = [hc[0], hc[1], Math.cos(roll), Math.sin(roll)], hp = (p) => xf(p.map(([a, b]) => [a, b * sq]), HM);
  // ---- the phone (in front of the face or the chest), where its light comes from
  const flX = fl * .35 * hs, flY = -fl * .8;
  const P = hold?.at === 'face' ? [hs * 11.4 + bx * .9 + flX, -158.6 - U * .7 + flY + br * .15] : hold?.at === 'chest' ? [hs * 5.5 + bx, -127 - U * .5 + flY * .6] : null;
  const glowP = P || (o.glowAt ? [(o.glowAt[0] - x) / S, (o.glowAt[1] - y) / S] : hold?.at === 'ext' ? [hs * 30, -158 - U * .6] : null);
  const rimG = G && glowP ? { p: glowP, r: hold?.at === 'chest' ? 30 : hold?.at === 'ext' ? 24 : 17, col: gcol, a: ga, w: Math.max(1.4, S * .2) * px * 2 } : null;

  ctx.save(); ctx.translate(x, y); ctx.scale(S, S); ctx.rotate(lean);
  const all = [];                                                   // every part outline, for the shared hatch / shade
  // fill a part, shade it toward the light, run its details, rim it (later parts cover the rims of earlier ones)
  const part = (pts, fill, detail, rims = [rimA, rimB, rimG], form = true) => {
    cw(pts); all.push(pts);
    ctx.save(); ctx.beginPath(); trace(ctx, pts); ctx.fillStyle = fill; ctx.fill(); ctx.clip();
    if (form) { const fg = ctx.createLinearGradient(-30, 0, 30, 0); fg.addColorStop(0, rgba('#ffb070', .1 * (o.light2?.a ?? .5))); fg.addColorStop(.45, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(2,3,9,.32)'); ctx.fillStyle = fg; ctx.fillRect(-45, -200, 90, 205); }
    if (detail) detail();
    for (const R of rims) if (R) rimOn(ctx, pts, R);
    ctx.restore();
  };
  const ink = (a = .6) => rgba('#03040a', a), fold = (pts, w = .55, a = .55, lightA = .1) => { ctx.lineCap = 'round'; ctx.strokeStyle = ink(a); ctx.lineWidth = w; ctx.beginPath(); line(ctx, pts); ctx.stroke(); if (lightA > 0) { ctx.strokeStyle = rgba('#b9c8ea', lightA); ctx.lineWidth = w * .7; ctx.beginPath(); line(ctx, pts.map(([a, b]) => [a - .55, b - .25])); ctx.stroke(); } };

  // ---- 1. behind the body: the phone in front of the face (its display peeks past the head), the hand around it, its halo
  if (P && G) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gr = ctx.createRadialGradient(P[0], P[1], 0, P[0], P[1], hold.at === 'chest' ? 34 : 22); gr.addColorStop(0, rgba(gcol, .3 * ga)); gr.addColorStop(1, rgba(gcol, 0)); ctx.fillStyle = gr; ctx.fillRect(P[0] - 40, P[1] - 40, 80, 80); ctx.restore(); }
  let scr = null;
  if (P && hold.at === 'face') {
    const rr = hs * .16 + fl * .04 * hs + roll * .5, pw = 6.4, phh = 12.6;
    ctx.save(); ctx.translate(P[0], P[1]); ctx.rotate(rr);
    ctx.fillStyle = '#07080d'; ctx.beginPath(); ctx.roundRect(-pw / 2 - .35, -phh / 2 - .35, pw + .7, phh + .7, 1.3); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.roundRect(-pw / 2, -phh / 2, pw, phh, 1); ctx.clip(); ctx.translate(-pw / 2, -phh / 2); ctx.scale(pw / 100, phh / 200);
    if (o.screen) o.screen(ctx, 100, 200); else { ctx.fillStyle = '#dfe6f2'; ctx.fillRect(0, 0, 100, 200); }
    ctx.restore();
    // fingertips around the outer edge, the thumb on the glass (the hand itself is behind the phone)
    ctx.fillStyle = shadeHex(D.skin, -.35); const ex = -hs * (pw / 2 + .1);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(ex - hs * .25, 1.2 + i * 1.75, .95, .8, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = shadeHex(D.skin, -.2); ctx.beginPath(); ctx.ellipse(hs * (pw / 2 - .9) - hs * fl * .5, 3.6 - fl * 1.2, .95, 1.9, hs * .5, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(gcol, .55 * ga); ctx.lineWidth = .25; ctx.beginPath(); ctx.ellipse(hs * (pw / 2 - .9) - hs * fl * .5, 3.6 - fl * 1.2, .95, 1.9, hs * .5, Math.PI, TAU); ctx.stroke();
    ctx.restore();
    scr = P;
    // the forearm rising to it (mostly hidden by the shoulder that is drawn next)
    const e = [hs * (26.5 * W) + bx * .6, -124.5 - U], wr = [P[0] + hs * 1.2, P[1] + 7.2];
    part(tube([[e[0], e[1], 4.4], [mix(e[0], wr[0], .5) + hs * 1.6, mix(e[1], wr[1], .5), 4.1], [wr[0], wr[1], 3.3]], 5).pts, shadeHex(D.coat, -.12), null, [rimG]);
  }
  // ---- 2. legs (trousers) under the coat, the relaxed knee changes with the weight shift
  const hem = L.len === 'knee' ? -50 : L.len === 'thigh' ? -72 : -91, kneeIn = sway * .8;
  for (const sx of [-1, 1]) { const bend = sx === 1 ? Math.max(0, sway) : Math.max(0, -sway);
    part(tube([[sx * 8.6 * HW + hipX, -94, 7.4], [sx * (8.2 - bend * 1.2) + hipX * .5 - kneeIn * .3, -51, 5.6], [sx * 7.9, -9, 3.9]], 5).pts, shadeHex(D.pants, sx * .04), () => {
      fold([[sx * 8 + hipX, -88], [sx * 8.4, -70], [sx * 8.1, -54]], .35, .4, .06); }, [rimA, rimB], false); }
  // ---- 3. the coat body
  const sh = W * 23.2, ar = W * 21.2, wa = W * 19.2 * (L.kind === 'trench' ? .94 : 1), hipW = 20.6 * HW, hw = (L.len === 'knee' ? 23.8 : L.len === 'thigh' ? 22.4 : 20.6) * HW, bb = 1 + br * .006;
  const hemY = hem + (L.kind === 'shell' ? 1.5 : 0), swing = Math.sin(t * TAU / 2.6 + ph) * .5 * wind + sway * .5;
  const torsoHalf = (sx) => run([0, yc], [
    [[sx * 4, yc], [sx * 7.6, yc + .2], [sx * 10, yc + .9]],
    [[sx * 14.5, ys - 1.4], [sx * (sh - 6), ys - .3], [sx * (sh - 3), ys + .5]],
    [[sx * (sh - .6), ys + 1.3], [sx * (sh + .2) * bb, ys + 3.8], [sx * sh * bb, ys + 7.2]],
    [[sx * (sh - .2) * bb, -136], [sx * (ar + .3), -131], [sx * ar * bb, -126]],
    [[sx * (ar - .4), -119], [sx * wa, -115], [sx * wa, -109]],
    [[sx * wa, -102], [sx * hipW, -98], [sx * hipW + hipX * .4, -91]],
    ...(hemY < -91 ? [] : [[[sx * (hipW + .4) + hipX * .4, -80], [sx * (hw - .6) + swing * .4, hemY - 10], [sx * hw + swing, hemY]]]),
  ], 7);
  const R = torsoHalf(1), Lh = torsoHalf(-1), hemPts = [];
  cub(hemPts, R[R.length - 1], [R[R.length - 1][0] * .4, hemY + 1.4], [Lh[Lh.length - 1][0] * .4, hemY + 1.4], Lh[Lh.length - 1], 10);
  const body = [...R.map(([a, b]) => [a + bx * clamp((b - hemY) / (yc - hemY)), b]), ...hemPts.slice(1, -1), ...Lh.slice().reverse().map(([a, b]) => [a + bx * clamp((b - hemY) / (yc - hemY)), b])];
  const by = (yy) => bx * clamp((yy - hemY) / (yc - hemY));          // body shift at a height (hips stay, shoulders sway)
  const spine = (y0, y1, n = 12) => Array.from({ length: n + 1 }, (_, i) => { const yy = mix(y0, y1, i / n); return [by(yy) + Math.sin(yy * .09) * .25, yy]; });
  part(body, D.coat, () => {
    const armsFwd = !!hold;
    if (L.kind === 'puffer') {   // quilted baffles: a seam every 7.5 units, the bulge below it catches the light
      for (let yy = ys + 6.5; yy < hemY - 2; yy += 7.4) { const sag = 1.1 + (yy + 150) * .012, row = [];
        for (let i = 0; i <= 16; i++) { const u = i / 16 * 2 - 1, xx = u * 30; row.push([xx + by(yy), yy + sag * (1 - u * u)]); }
        fold(row, .6, .7, 0); ctx.strokeStyle = rgba('#bcd2e8', .09); ctx.lineWidth = 1.6; ctx.beginPath(); line(ctx, row.map(([a, b]) => [a, b + 1.6])); ctx.stroke(); }
      fold(spine(yc + 2, hemY), .45, .45, 0);
    } else {
      fold(spine(yc + 1, hemY), .45, .5, .07);                              // centre back seam
      for (const sx of [-1, 1]) fold(run([sx * 12.5 + by(ys), ys - .5], [[[sx * 17 + by(ys), ys + 1], [sx * (ar - 2.6), -136], [sx * (ar - 1.2), -128]]], 6), .45, .45, .08);   // armhole seams
    }
    if (L.kind === 'wool' || L.kind === 'trench') {   // the vent at the back hem
      const v0 = L.belt ? -104 : -78; fold([[by(v0) + .3, v0], [.6 + swing * .2, hemY + .5]], .55, .65, .1); fold([[by(v0) + .3, v0], [by(v0) + 1.4, v0 + 3]], .4, .5, 0); }
    if (L.kind === 'trench') {   // the storm flap (back yoke) and the belt with its loops, gathered folds under the belt
      const yoke = run([-(sh - 3) + by(ys), ys + 1.5], [[[-14 + by(-140), -136], [-7 + by(-133), -131.5], [by(-131), -131]], [[7 + by(-133), -131.5], [14 + by(-140), -136], [(sh - 3) + by(ys), ys + 1.5]]], 8);
      ctx.fillStyle = 'rgba(255,255,255,.035)'; ctx.beginPath(); trace(ctx, [...yoke, [(sh - 3) + by(ys), ys - 3], [-(sh - 3) + by(ys), ys - 3]]); ctx.fill(); fold(yoke, .6, .7, .1);
      const bY = -110; ctx.fillStyle = shadeHex(D.coat, -.18); ctx.fillRect(-wa - 1, bY - 1.7, wa * 2 + 2, 3.6); fold([[-wa, bY - 1.8], [wa, bY - 1.8]], .35, .55, .14); fold([[-wa, bY + 1.9], [wa, bY + 1.9]], .35, .6, 0);
      for (const lx of [-12, 12]) fold([[lx, bY - 2.4], [lx, bY + 2.6]], .5, .55, .08);
      for (const fx of [-15, -9, -4, 4, 9.5, 15.5]) fold([[fx, bY + 3], [fx * 1.08 + swing * .3, bY + 16 + Math.abs(fx) * .4]], .45, .4, .06);
    }
    if (L.kind === 'shell') { fold(run([-(ar - 1) + by(-138), -138.5], [[[-10, -136.8], [10, -136.8], [(ar - 1) + by(-138), -138.5]]], 10), .5, .55, .1);   // yoke seam
      ctx.fillStyle = shadeHex(D.coat, -.15); ctx.fillRect(-hipW - 1, hemY - 3.5, hipW * 2 + 2, 3.5); fold([[-hipW, hemY - 3.5], [hipW, hemY - 3.5]], .4, .5, .08); }
    // tension folds: arms forward pull diagonals from the shoulder blades toward the elbows; otherwise soft drape folds hang down
    if (armsFwd) for (const sx of [-1, 1]) { if (hold.at !== 'chest' && sx !== hs && hold.at !== 'ext') continue; for (let i = 0; i < 2; i++) fold(run([sx * (4 + i * 3) + by(-140), -141 + i * 4], [[[sx * (10 + i * 3), -137 + i * 3], [sx * (15 + i * 2), -130 + i * 3], [sx * (ar - 1.5), -122 + i * 3]]], 6), .5, .42, .1); }
    for (const sx of [-1, 1]) for (let i = 0; i < 2; i++) { const fx = sx * (8 + i * 6.5); if (hemY > -60) fold([[fx * .9 + by(-98), -98], [fx + swing * .35, hemY + .8]], .45, .38, .07); }
    // wet coat: soft sheen on the shoulder tops (warm from the lamp on the left, cool from the board on the right)
    for (const sx of [-1, 1]) { const Lc = sx < 0 ? o.light2 : o.light; if (!Lc) continue; const sw2 = run([sx * 9 + by(ys), yc + 2.2], [[[sx * 14 + by(ys), ys + 1.4], [sx * (sh - 6), ys + 2.1], [sx * (sh - 2.2), ys + 4.4]]], 8);
      ctx.strokeStyle = rgba(Lc.col || '#cfdcff', .16 * (Lc.a ?? .6) * (1 - shade * .6)); ctx.lineWidth = 2.2; ctx.beginPath(); line(ctx, sw2); ctx.stroke(); ctx.strokeStyle = rgba(Lc.col || '#cfdcff', .3 * (Lc.a ?? .6) * (1 - shade * .6)); ctx.lineWidth = .45; ctx.beginPath(); line(ctx, sw2); ctx.stroke(); }
  });
  // ---- 4. the arms: upper arm sleeves at the sides; the phone arm bends forward, the free arm in a pocket or hanging, or the fist
  const J = (sx) => [sx * (sh - 4.4) + by(ys), ys + 7.4];
  const sleeveRims = [rimA, rimB, rimG].map((R0) => R0 && { ...R0, fall: (yy) => (yy < ys + 7.5 ? 0 : R0.fall ? R0.fall(yy) : 1) });
  const arm = (sx, kind) => {
    const j = J(sx); let nodes, cuff = null, hand = null;
    if (kind === 'face') nodes = [[j[0], j[1], 5.2], [sx * (sh + 1.3) + by(-133), -133 - U * .8, 5], [sx * (sh + 2.5) + bx * .6, -124.5 - U, 4.6]];
    else if (kind === 'chest') nodes = [[j[0], j[1], 5.2], [sx * (sh + .3) + by(-131), -131 - U * .7, 5], [sx * (sh - .4) + bx * .5 - flX * .4, -120 - U * .8 + flY * .3, 4.7]];
    else if (kind === 'ext') nodes = [[j[0], j[1], 5.3], [sx * (sh + 1.1), -130 - U * .7, 5.2], [sx * (sh + 1.6), -112, 5]];
    else if (kind === 'fist') { const f = fist, pump = f > .95 ? Math.sin((t - (o.fistT ?? 0)) * 9) * .7 : 0;
      const e = [sx * mix(sh + .5, sh + 7, f) + by(-120), mix(-117, -139, f) - U * .6], w = [sx * mix(sh - .7, sh + 3.6, f), mix(-111.5, -163, f) + pump];
      nodes = [[j[0], j[1], 5.2], [mix(sx * (sh + .4), sx * (sh + 3), f), mix(-130, -146, f), 5], [e[0], e[1], 4.6], [w[0], w[1], 3.6]]; cuff = w; if (f > .3) hand = [w[0] - sx * .3, w[1] - 6.2]; }
    else if (kind === 'hang') { nodes = [[j[0], j[1], 5.4], [sx * (sh + .3) + by(-124), -124, 5], [sx * (24.4 * W) + by(-112), -112, 4.6], [sx * (23.6 * W), -92, 3.9]]; cuff = [sx * 23.6 * W, -92]; hand = [sx * 23.2 * W, -86.5]; }
    else { const e = [sx * (sh + .5) + by(-117), -117 - U * .6]; nodes = [[j[0], j[1], 5.2], [sx * (sh + .3) + by(-129), -129 - U * .7, 5], [e[0], e[1], 4.6], [e[0] - sx * 1.2, -111.5 - U * .5, 4.3]]; }
    if (kind === 'nudge') { const e = [sx * (sh + .5 + nud * 6.5) + by(-118), -118 - nud * 3 - U * .6]; nodes = [[j[0], j[1], 5.2], [sx * (sh + .3 + nud * 3), -129 - nud * 1.5, 5], [e[0], e[1], 4.6], [e[0] - sx * 1.4, -111.5 - nud * 2, 4.3]]; }
    const T = tube(nodes, 6);
    if (hand) {   // the hand: the back of a fist (knuckles up) or a relaxed hand with curled fingers
      const hx = hand[0], hy = hand[1]; ctx.save(); ctx.translate(hx, hy);
      const hp2 = kind === 'fist' ? run([-3.3, -.6], [[[-3.4, -3.6], [-1.6, -4.4], [0, -4.3]], [[1.8, -4.4], [3.6, -3.6], [3.4, -.4]], [[3.3, 2.6], [2, 4.4], [0, 4.4]], [[-2, 4.4], [-3.3, 2.6], [-3.3, -.6]]], 5)
        : run([-2.4, -3.6], [[[-1, -4.4], [1.6, -4.2], [2.6, -2.6]], [[3.2, .4], [2.8, 4.2], [.6, 5.2]], [[-1.4, 5.6], [-2.8, 3.6], [-2.9, .8]], [[-3, -1.2], [-3, -2.8], [-2.4, -3.6]]], 5);
      part(hp2, shadeHex(D.skin, -.3), () => { ctx.strokeStyle = 'rgba(30,14,8,.55)'; ctx.lineWidth = .3; for (let i = 0; i < 3; i++) { ctx.beginPath(); const yy = kind === 'fist' ? -2.6 + i * 1.6 : 1 + i * 1.3; ctx.moveTo(-2.6, yy); ctx.quadraticCurveTo(0, yy - .5, 2.6, yy); ctx.stroke(); }
        if (kind === 'fist') { ctx.fillStyle = 'rgba(255,220,190,.12)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-2.4 + i * 1.6, -3.7, .7, 0, TAU); ctx.fill(); } } },
        [rimA ? { ...rimA, fall: null } : null, rimB ? { ...rimB, fall: null } : null, rimG ? { ...rimG, p: [rimG.p[0] - hx, rimG.p[1] - hy] } : null]);
      all.pop(); all.push(hp2.map(([a, b]) => [a + hx, b + hy])); ctx.restore();
    }
    part(T.pts, shadeHex(D.coat, sx * .03 - .02), () => {
      const n = T.C.length, ei = Math.round(n * (kind === 'hang' ? .55 : kind === 'fist' ? .66 : .75));   // creases where the elbow bends
      for (let i = 0; i < 3; i++) { const c = T.C[Math.min(n - 1, ei - 2 + i * 2)]; if (!c) continue; fold([[c[0] - sx * c[2] * .8, c[1] - 1.2 + i * .3], [c[0] - sx * c[2] * .1, c[1] + .4], [c[0] + sx * c[2] * .5, c[1] - .5]], .45, .5, .08); }
      if (cuff) fold([[cuff[0] - 3.8, cuff[1] - 1.6], [cuff[0] + 3.8, cuff[1] - 1.6]], .5, .6, .1);
    }, sleeveRims);
  };
  const freeKind = fist > 0.001 ? 'fist' : fr, nudgeKind = (sx) => (nud > 0 && sx === nsd ? 'nudge' : null);
  for (const sx of [-1, 1]) { if (hold?.at === 'face' && sx === hs) arm(sx, 'face'); else if (hold?.at === 'ext' && sx === hs) arm(sx, 'ext'); else if (hold?.at === 'chest') arm(sx, nudgeKind(sx) || 'chest'); else arm(sx, nudgeKind(sx) || (sx === fsd ? freeKind : fr)); }
  // ---- 5. the backpack (on the back, closest to us)
  if (L.bag) { const bt = ys + 3.2, bb2 = -101 - U * .3, bw = 13.2 * W, cx0 = by(-125);
    for (const sx of [-1, 1]) part(run([sx * 9.5 + cx0, bt + 1], [[[sx * 12 + cx0, ys - 1.2], [sx * 15.5 + by(ys), ys - 1.1], [sx * 17.5 + by(ys), ys + .9]], [[sx * 15.5, ys + 2.6], [sx * 13, bt + 2.5], [sx * 11 + cx0, bt + 4]]], 5), shadeHex(L.bag, -.1), null, [rimA, rimB]);
    const bag = run([cx0, bt - 1.2], [[[cx0 + bw * .55, bt - 1.6], [cx0 + bw, bt + 1], [cx0 + bw, bt + 6]], [[cx0 + bw + .3, bt + 18], [cx0 + bw + .4, bb2 - 6], [cx0 + bw - 2.5, bb2]], [[cx0 + 5, bb2 + 1.4], [cx0 - 5, bb2 + 1.4], [cx0 - bw + 2.5, bb2]], [[cx0 - bw - .4, bb2 - 6], [cx0 - bw - .3, bt + 18], [cx0 - bw, bt + 6]], [[cx0 - bw, bt + 1], [cx0 - bw * .55, bt - 1.6], [cx0, bt - 1.2]]], 7);
    part(bag, L.bag, () => {
      const g2 = ctx.createLinearGradient(0, bt, 0, bb2); g2.addColorStop(0, 'rgba(170,190,225,.16)'); g2.addColorStop(.3, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,.4)'); ctx.fillStyle = g2; ctx.fillRect(cx0 - 20, bt - 3, 40, bb2 - bt + 6);
      fold(run([cx0 - bw + 1.6, bt + 9], [[[cx0 - bw + 2, bt + 2], [cx0 + bw - 2, bt + 2], [cx0 + bw - 1.6, bt + 9]]], 10), .45, .7, .16);   // zip round the top
      const pk = [cx0 - bw * .7, -124 - U * .3, bw * 1.4, 18]; ctx.fillStyle = shadeHex(L.bag, .06); ctx.beginPath(); ctx.roundRect(pk[0], pk[1], pk[2], pk[3], 3.4); ctx.fill(); fold([[pk[0] + 2, pk[1] + 3.2], [pk[0] + pk[2] - 2, pk[1] + 3.2]], .4, .6, .14);
      ctx.strokeStyle = rgba('#d8e4ff', .22); ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(pk[0] + 3, pk[1] + .6); ctx.lineTo(pk[0] + pk[2] - 3, pk[1] + .6); ctx.stroke();
      ctx.fillStyle = 'rgba(200,215,240,.5)'; ctx.fillRect(cx0 + bw * .45, pk[1] + 2.4, .9, 1.8);   // zip pull
    });
    part(run([cx0 - 2.6, bt - .8], [[[cx0 - 2.6, bt - 4.2], [cx0 + 2.6, bt - 4.2], [cx0 + 2.6, bt - .8]], [[cx0 + 1.6, bt - 2.7], [cx0 - 1.6, bt - 2.7], [cx0 - 2.6, bt - .8]]], 5), shadeHex(L.bag, -.05), null, [rimA]);   // grab handle
  }
  // ---- 6. collar, scarf or hood, the neck
  const neck = cw([[hc[0] - 5.3, hc[1] + 7], [hc[0] + 5.3, hc[1] + 7], [6.6 + by(yc), yc + 1.4], [-6.6 + by(yc), yc + 1.4]]);
  part(neck, shadeHex(D.skin, -.32), () => { const g2 = ctx.createLinearGradient(0, hc[1] + 7, 0, yc); g2.addColorStop(0, 'rgba(10,5,4,.55)'); g2.addColorStop(1, 'rgba(10,5,4,.05)'); ctx.fillStyle = g2; ctx.fillRect(-9, hc[1] + 6, 18, yc - hc[1]); fold([[hc[0] * .7, hc[1] + 9], [by(yc) * .9, yc - .5]], .35, .25, 0); }, [rimB, rimG]);
  if (!L.hood) {
    if (L.kind === 'wool' || L.kind === 'trench') { const cl = run([-8.3 + by(yc), yc + 1.2], [[[-8.1 + by(yc), yc - 2], [-7.9 + hc[0] * .3, yc - 4.6], [-7.4 + hc[0] * .4, yc - 6.6]], [[-3, yc - 5.6], [3, yc - 5.6], [7.4 + hc[0] * .4, yc - 6.6]], [[7.9 + hc[0] * .3, yc - 4.6], [8.1 + by(yc), yc - 2], [8.3 + by(yc), yc + 1.2]], [[3, yc + 2.2], [-3, yc + 2.2], [-8.3 + by(yc), yc + 1.2]]], 6);
      part(cl, shadeHex(D.coat, .04), () => fold(run([-7.2 + hc[0] * .4, yc - 5.4], [[[-3, yc - 4.6], [3, yc - 4.6], [7.2 + hc[0] * .4, yc - 5.4]]], 8), .35, .5, .12)); }
    if (L.kind === 'shell') part(run([-10.5 + by(yc), yc + 2.2], [[[-11 + by(yc), yc - 2.5], [-6, yc - 4.5], [0, yc - 4.4]], [[6, yc - 4.5], [11 + by(yc), yc - 2.5], [10.5 + by(yc), yc + 2.2]], [[6, yc + 3.6], [-6, yc + 3.6], [-10.5 + by(yc), yc + 2.2]]], 6), shadeHex(D.coat, .03), () => fold([[-7, yc - 1.2], [0, yc - .4], [7, yc - 1.2]], .5, .55, .1));   // the stowed hood rolled at the collar
    if (L.scarf) { const sw2 = Math.sin(t * TAU / 2.3 + ph) * .6 * wind, sc = run([-9.6 + by(yc), yc + .6], [[[-10.2 + by(yc), yc - 3.6], [-8.6 + hc[0] * .5, yc - 7.4], [-6.6 + hc[0] * .6, yc - 8.6]], [[-3, yc - 7.4], [3, yc - 7.4], [6.6 + hc[0] * .6, yc - 8.6]], [[8.6 + hc[0] * .5, yc - 7.4], [10.2 + by(yc), yc - 3.6], [9.6 + by(yc), yc + .6]], [[4, yc + 2.2], [-4, yc + 2.2], [-9.6 + by(yc), yc + .6]]], 6);
      part(sc, L.scarf, () => { ctx.strokeStyle = rgba('#2a1406', .32); ctx.lineWidth = .45; for (let i = -9; i <= 9; i += 1.5) { ctx.beginPath(); ctx.moveTo(i + hc[0] * .5, yc - 7.6); ctx.quadraticCurveTo(i * 1.06 - .8, yc - 3, i * 1.08, yc + 2); ctx.stroke(); }
        fold([[-9, yc - 3.4], [0, yc - 2.4], [9, yc - 3.4]], .5, .45, .14); const g2 = ctx.createLinearGradient(0, yc - 9, 0, yc + 2); g2.addColorStop(0, 'rgba(255,240,220,.1)'); g2.addColorStop(1, 'rgba(20,8,0,.45)'); ctx.fillStyle = g2; ctx.fillRect(-12, yc - 10, 24, 13); });
      if (L.hair === 'bun') {   // one end thrown over the left shoulder, it hangs down the back and moves in the wind
        const tail = run([-6.8 + by(yc), yc], [[[-9 + sw2 * .3 + by(-140), yc + 6], [-10.5 + sw2 + by(-130), -132], [-10 + sw2 * 1.4 + by(-122), -122]], [[-6.8 + sw2 * 1.4, -121.6], [-6.4 + sw2, -126], [-5.6 + sw2 * .4 + by(-138), -138]], [[-4.6 + by(yc), yc + 4], [-4.2 + by(yc), yc + 1], [-6.8 + by(yc), yc]]], 6);
        part(tail, shadeHex(L.scarf, -.08), () => { ctx.strokeStyle = rgba('#2a1406', .4); ctx.lineWidth = .4; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(-10.6 + sw2 * 1.4 + i * .7, -121.8); ctx.lineTo(-10.4 + sw2 * 1.4 + i * .7, -120); ctx.stroke(); } });
      }
    }
  }
  // ---- 7. the head: hood, or hair (+ beanie) and ears; the display's light catches the face edges, the ears glow through
  const earR = run([8.45, -3.4], [[[10.5, -4.3], [11.2, -1.6], [10.6, 1.4]], [[10.2, 3.4], [9.5, 4.6], [8.6, 4.5]], [[8.9, 2.2], [8.9, -.8], [8.45, -3.4]]], 5);
  const earL = earR.map(([a, b]) => [-a, b]);
  const rimGh = rimG ? { ...rimG, r: rimG.r * 1.25, a: Math.min(1, ga * 1.15), w: rimG.w * 1.2 } : null;
  if (L.hood) {
    const hd = hp(run([0, -17.6], [[[7.8, -17.9], [13.6, -13.2], [14.2, -5.4]], [[14.7, .8], [14, 6.6], [12.6, 10.6]], [[11.8, 13], [12.4, 15.2], [14.2, 16.8]], [[7, 18.4], [-7, 18.4], [-14.2, 16.8]], [[-12.4, 15.2], [-11.8, 13], [-12.6, 10.6]], [[-14, 6.6], [-14.7, .8], [-14.2, -5.4]], [[-13.6, -13.2], [-7.8, -17.9], [0, -17.6]]], 7));
    part(hd, shadeHex(D.coat, .02), () => {
      for (const yy of [-9.5, -1.5, 6.5]) { const row = hp(Array.from({ length: 13 }, (_, i) => { const u = i / 12 * 2 - 1; return [u * 14.5, yy + (1 - u * u) * 1.5]; })); fold(row, .55, .65, 0); ctx.strokeStyle = rgba('#bcd2e8', .1); ctx.lineWidth = 1.5; ctx.beginPath(); line(ctx, row.map(([a, b]) => [a, b + 1.5])); ctx.stroke(); }
      fold(hp([[0, -17.4], [0, -8], [0, 0], [0, 9], [0, 17]]), .5, .55, .08);
      const g2 = ctx.createRadialGradient(...hp([[-2, -12]])[0], 1, ...hp([[-2, -12]])[0], 16); g2.addColorStop(0, 'rgba(190,210,240,.13)'); g2.addColorStop(1, 'rgba(0,0,0,.22)'); ctx.fillStyle = g2; ctx.fillRect(hc[0] - 16, hc[1] - 20, 32, 40);
    }, [rimA, rimB, rimGh]);
    // the phone light leaks round the hood's front edge
    if (G) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; for (const sx of [-1, 1]) { const e2 = hp(run([sx * 13.6, -6], [[[sx * 14.2, -1], [sx * 13.9, 4.4], [sx * 12.5, 10]]], 6)); ctx.strokeStyle = rgba(gcol, .3 * ga); ctx.lineWidth = .9; ctx.beginPath(); line(ctx, e2); ctx.stroke(); } ctx.restore(); }
  } else {
    const skin = hp(sym(run([0, -12], [[[4.6, -12], [8, -9.6], [8.7, -5.2]], [[9.1, -2.4], [9, 1.2], [8.6, 3.4]], [[8.3, 5.4], [7.6, 7.6], [6.6, 9.2]], [[5.9, 10.2], [5.5, 11], [5.2, 12.6]], [[3, 12.9], [1.2, 13], [0, 13]]], 6)));
    part(skin, shadeHex(D.skin, -.3), null, [rimB, rimGh]);
    const nape = -2.4 * pitch, bun = L.hair === 'bun', r = prng(L.seed * 17);
    const hairHalf = run([0, -12.9], [[[4.9, -13], [8.7, -10.3], [9.35, -5.6]], [[9.75, -2.8], [9.65, .2], [9.15, 2.4]], [[8.6, 4.2], [7.4, 5.6], [6.1, 6.6 + nape * .4]], [[4.6, 7.5 + nape], [3.4, 7.9 + nape], [1.8, 8.3 + nape]], [[1, 8.6 + nape], [.4, 8.5 + nape], [0, 8.4 + nape]]], 7);
    const hairPts = sym(hairHalf.map(([a, b], i) => { const j = (r() - .5) * (b > 4 ? .7 : .35); return [a + j * Math.sign(a || 1), b + (b > 4 ? Math.abs(j) : 0)]; }));
    if (bun) { // the knot on top changes the silhouette
      const k0 = hp(run([.7, -18.6], [[[3.6, -18.7], [5.3, -16.4], [5.1, -14.2]], [[4.9, -11.4], [2.6, -10.6], [.6, -10.7]], [[-1.6, -10.6], [-3.9, -11.6], [-3.9, -14.3]], [[-3.9, -16.6], [-2.2, -18.5], [.7, -18.6]]], 6));
      part(k0, shadeHex(D.hair, .02), null, [rimA, rimB]);
    }
    const hairS = hp(hairPts);
    part(hairS, D.hair, () => {
      ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(roll); ctx.scale(1, sq);
      const HS = hairStrands(L); ctx.lineCap = 'round'; ctx.lineWidth = Math.min(1.5, Math.max(.6, S * .13)) / S;
      ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.stroke(HS.dark);
      ctx.strokeStyle = rgba(L.hairLite || '#7a6a62', .3); ctx.stroke(HS.lite);
      // sheen on the wet hair from the board (right/top) and the lamp (left)
      const sg = ctx.createLinearGradient(-9, -12, 9, 4); sg.addColorStop(0, rgba(o.light2?.col || SODIUM, .16 * (o.light2?.a ?? .5))); sg.addColorStop(.45, 'rgba(0,0,0,0)'); sg.addColorStop(.75, rgba(o.light?.col || '#cfdcff', .12 * (o.light?.a ?? .6))); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.fillRect(-11, -16, 22, 26);
      ctx.restore();
    }, [rimA, rimB, rimGh]);
    // ears (after the hair): the back of the ear, its rim; the phone light glows through the ear on the phone side
    for (const [ep, sx] of [[earL, -1], [earR, 1]]) { const E = hp(ep);
      part(E, shadeHex(D.skin, -.22), () => { ctx.strokeStyle = 'rgba(40,14,8,.55)'; ctx.lineWidth = .3; ctx.beginPath(); line(ctx, hp([[sx * 9.9, -2.4], [sx * 10.1, 0], [sx * 9.4, 2.9]])); ctx.stroke(); }, [rimA, rimB]);
      if (G && glowP) { const gp = Math.exp(-((glowP[0] - E[3][0]) ** 2 + (glowP[1] - E[3][1]) ** 2) / 420); if (gp > .02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ff8a66', .55 * gp * ga); ctx.lineWidth = .7; ctx.beginPath(); line(ctx, E.slice(2, 14)); ctx.stroke(); ctx.strokeStyle = rgba(gcol, .5 * gp * ga); ctx.lineWidth = .3; ctx.stroke(); ctx.restore(); } }
    }
    if (G && glowP) { ctx.save(); ctx.beginPath(); trace(ctx, skin); trace(ctx, hairS); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const r0 = 9.5, gg = ctx.createRadialGradient(glowP[0], glowP[1], 0, glowP[0], glowP[1], Math.hypot(glowP[0] - hc[0], glowP[1] - hc[1]) + r0 * .2);
      gg.addColorStop(0, rgba(gcol, .3 * ga)); gg.addColorStop(.55, rgba(gcol, .12 * ga)); gg.addColorStop(1, rgba(gcol, 0)); ctx.fillStyle = gg; ctx.fillRect(hc[0] - 14, hc[1] - 16, 28, 32); ctx.restore(); }
    // loose strands at the nape (bun) moving in the wind
      if (bun) { ctx.strokeStyle = rgba(L.hairLite ? L.hairCol : '#2a1a12', .9); ctx.lineWidth = Math.max(.6, S * .1) / S; for (let i = 0; i < 5; i++) { const sx = i < 3 ? 1 : -1, b0 = hp([[sx * (2 + i * 1.1), 6.8 + nape]])[0], wv = Math.sin(t * (2.1 + i * .3) + i) * .9 * wind; ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.quadraticCurveTo(b0[0] + sx * .8 + wv, b0[1] + 2.4, b0[0] + sx * .3 + wv * 1.6, b0[1] + 4.6 + i * .3); ctx.stroke(); } }
    if (L.hat) {   // the beanie: knit dome, rib lines, a turned-up cuff
        const hb = hp(run([0, -14.3], [[[5.7, -14.6], [9.8, -10.7], [10.1, -5]], [[10.2, -3.2], [10.2, -1.9], [10.1, -.9]], [[6, -.1], [-6, -.1], [-10.1, -.9]], [[-10.2, -1.9], [-10.2, -3.2], [-10.1, -5]], [[-9.8, -10.7], [-5.7, -14.6], [0, -14.3]]], 7));
        ctx.save(); ctx.beginPath(); trace(ctx, hb); ctx.fillStyle = L.hat; ctx.fill(); ctx.clip();
        const g3 = ctx.createLinearGradient(hc[0] - 10, hc[1] - 14, hc[0] + 10, hc[1]); g3.addColorStop(0, 'rgba(255,200,160,.12)'); g3.addColorStop(1, 'rgba(10,4,8,.5)'); ctx.fillStyle = g3; ctx.fillRect(hc[0] - 12, hc[1] - 16, 24, 17);
        ctx.strokeStyle = 'rgba(40,10,14,.42)'; ctx.lineWidth = .32; for (let i = -9; i <= 9; i += 1.1) { const a = hp([[i, -4.6], [i * .8, -9], [i * .35, -13.6]]); ctx.beginPath(); line(ctx, a); ctx.stroke(); }
        const cuffTop = hp(Array.from({ length: 11 }, (_, i) => { const u = i / 10 * 2 - 1; return [u * 10.1, -4.6 + (1 - u * u) * .6]; })); fold(cuffTop, .55, .6, .12);
        ctx.strokeStyle = 'rgba(40,10,14,.35)'; ctx.lineWidth = .28; for (let i = -9.6; i <= 9.6; i += .75) { const a = hp([[i, -4.2], [i, -1]]); ctx.beginPath(); line(ctx, a); ctx.stroke(); }
        ctx.restore(); all.push(cw(hb));
        ctx.save(); ctx.beginPath(); trace(ctx, hb); ctx.clip(); for (const Rr of [rimA, rimB]) if (Rr) rimOn(ctx, hb, Rr); ctx.restore();
      }
  }
  // ---- 8. engraved hatch toward the hem, the shade of "left behind", over the union of all parts
  ctx.save(); ctx.beginPath(); for (const p of all) trace(ctx, p); ctx.clip();
  const HI = hatchImg(S); ctx.save(); ctx.scale(px, px); ctx.drawImage(HI.c, HI.x0 * S, HI.y0 * S); ctx.restore();
  const vg = ctx.createLinearGradient(0, -150, 0, -40); vg.addColorStop(0, 'rgba(3,4,10,0)'); vg.addColorStop(1, 'rgba(3,4,10,.5)'); ctx.fillStyle = vg; ctx.fillRect(-45, -150, 90, 155);
  if (shade > 0) { ctx.fillStyle = `rgba(8,11,24,${shade})`; ctx.fillRect(-45, -200, 90, 205); }
  ctx.restore();
  // ---- 9. life on top: rain landing on the shoulders (tiny crowns), the display's light on the hand and in the rain round it
  { const rate = 5.5, j0 = Math.floor(t * rate + sd * 3.3), Lc = o.light?.col || '#cfdcff';
    for (let j = j0 - 1; j <= j0; j++) { const u = hash(j, sd), dt = t - (j - sd * 3.3) / rate - hash(j, sd + 1) * .12; if (dt < 0 || dt > .16) continue;
      const sx = u < .5 ? -1 : 1, q = (u % .5) * 2, xx = sx * mix(9, sh - 2, q) + bx, yy = ys + 1 + q * q * 4.5 - (1 - q) * 1.2, k = dt / .16, a = (1 - k) * .75 * (1 - shade * .5);
      ctx.fillStyle = rgba(Lc, a); ctx.beginPath(); ctx.arc(xx, yy, .45 * (1 - k * .5), 0, TAU); ctx.fill();
      for (const dd of [-1, 1]) { ctx.beginPath(); ctx.arc(xx + dd * k * 2.4, yy - Math.sin(k * Math.PI) * 2.2, .28, 0, TAU); ctx.fill(); } } }
  if (G && glowP) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r0 = hold?.at === 'chest' ? 26 : 13, gg = ctx.createRadialGradient(glowP[0], glowP[1], 0, glowP[0], glowP[1], r0);
    gg.addColorStop(0, rgba(gcol, .16 * ga)); gg.addColorStop(1, rgba(gcol, 0)); ctx.fillStyle = gg; ctx.fillRect(glowP[0] - r0, glowP[1] - r0, r0 * 2, r0 * 2);
    // rain caught in the display's light in front of the person
    const rr2 = prng(sd * 5 + 3); ctx.strokeStyle = rgba(gcol, .5 * ga); ctx.lineWidth = Math.max(.8, S * .09) / S; ctx.beginPath();
    for (let i = 0; i < 9; i++) { const ox = (rr2() - .5) * r0 * 1.8, v = 34 + rr2() * 20, yy = ((rr2() * 60 + t * v) % 48) - 24, x0 = glowP[0] + ox + yy * .12, y0 = glowP[1] + yy; ctx.moveTo(x0, y0); ctx.lineTo(x0 + .5, y0 + 3.4); } ctx.stroke(); ctx.restore(); }
  ctx.restore();
  const T2 = (p) => [x + p[0] * S, y + p[1] * S];
  return { phone: T2(scr || P || hc), head: T2(hc), shoulder: T2([sh + bx, ys]), glowAt: T2(glowP || hc), S };
}
// splashes(ctx, t, o): rain hitting the wet ground, tiny crowns (a ring opening, two droplets jumping) at random places in a band,
//   brighter where the light map is lit. o: { box: [x, y, w, h], n (splashes per second), col, a, L(x, y), seed }
export function splashes(ctx, t, o = {}) {
  const [bx, by, bw, bh] = o.box || [0, 880, W, 200], rate = o.n ?? 30, L = o.L || (() => .4), col = o.col || '#cfdcff', a = o.a ?? .5, sd = o.seed ?? 5, life = .24;
  ctx.save(); ctx.lineWidth = 1; const j0 = Math.floor(t * rate);
  for (let j = j0 - Math.ceil(rate * life); j <= j0; j++) { const dt = t - j / rate; if (dt < 0 || dt > life) continue;
    const x = bx + hash(j, sd) * bw, yv = hash(j, sd + 1), y = by + yv * bh, k = dt / life, sc = .6 + yv * 1.2, al = a * Math.max(.25, L(x, y)) * (1 - k);
    ctx.strokeStyle = rgba(col, al); ctx.beginPath(); ctx.ellipse(x, y, (2 + k * 9) * sc, (.6 + k * 2.4) * sc, 0, 0, TAU); ctx.stroke();
    if (k < .6) { ctx.fillStyle = rgba(col, Math.min(1, al * 1.3)); for (const d of [-1, 1]) { ctx.beginPath(); ctx.arc(x + d * k * 7 * sc, y - Math.sin(k / .6 * Math.PI) * 6 * sc, .9 * sc, 0, TAU); ctx.fill(); } } }
  ctx.restore();
}
