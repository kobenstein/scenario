// C7 helper: the pedestrian crossing in the rain under sodium light (5.13, 5.14, 5.06, 5.15).
//   street(ctx, t, o)        the whole background plate (cached): opposite facades, the huge self-lit board, far curb with the
//                            pedestrian signal, wet asphalt with the zebra crossing, near curb. o: { cam: { x, y, z } (px drift,
//                            zoom around 960/540), board (0..1 how bright the board burns), ped 'red'|'green', warm (0..1 amber
//                            light that reaches the people, 5.14 "raise"), words (true: the headline on the board) }  → { L(x, y) light at a screen point (for rain), curbY }
//   rain(ctx, t, o)          falling rain streaks lit only where light is (o.L(x, y) → 0..1), o: { n, a, speed, seed, near (big
//                            out-of-focus drops in front), col, warm }
//   ripples(ctx, t, o)       rings on the wet street in the lit pool (o: { box: [x, y, w, h], n, a, col })
//   backFig(ctx, x, y, s, o) a waiting person seen from behind (copied from figure.mjs figureBack and extended by C7):
//                            o: { t, seed, dress, accent, shUp (0..1 shoulders pulled up), fist (0..1 right fist rises), nudge
//                            (0..1 elbow nudges to the left), relax (0..1), light: { x, y, col, a } rim, glow: { col, a } phone light,
//                            headTilt, shade, screen: { col, a } (a small lit display peeking past the right shoulder) }
//                            → { phone: [x, y], head: [x, y], shoulder: [x, y] }
import { W, H, rgba, clamp, mix, prng, canvas, lin, eout, eio, addGlow, hatch } from '../engine.mjs';
import { fog as artFog, stipple, vnoise } from './art.mjs';

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

// ---------- the waiting person from behind (copied from figure.mjs figureBack by C7, extended: shoulders, fist, nudge) ----------
function capsule(ctx, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1))));
  ctx.beginPath(); ctx.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); ctx.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); ctx.closePath(); ctx.fill();
}
function shadeHex(hex, d) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(clamp(v * (1 + d), 0, 255)); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }
const BACKC = new Map();
export function backFig(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, sd = o.seed || 0, br = Math.sin(t * TAU / 4.2 + sd) * .8, w8 = (Math.sin(t * TAU / 9 + sd * 1.7) * .7 + Math.sin(t * TAU / 3.7 + sd) * .3) * 1.4;
  const D = Object.assign({ coat: '#26304a', pants: '#131427', shoes: '#0a0a12', skin: '#8d5f40', hair: '#16111a' }, o.dress || {});
  const scarf = o.accent ?? '#c8843a', tilt = o.headTilt ?? .22, up = clamp(o.shUp ?? 0) * (1 - clamp(o.relax ?? 0)) * 7, fist = eio(clamp(o.fist ?? 0)), nud = clamp(o.nudge ?? 0);
  const U = { w: 150, h: 240, ox: 75, oy: 228 }, cw = Math.ceil(U.w * s), ch = Math.ceil(U.h * s);
  const key = cw + 'x' + ch; if (!BACKC.has(key)) BACKC.set(key, [canvas(cw, ch), canvas(cw, ch), canvas(cw, ch)]);
  const [[c, g], [mc, mg], [rc, rg]] = BACKC.get(key);
  for (const q of [g, mg, rg]) { q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-over'; q.globalAlpha = 1; q.clearRect(0, 0, cw, ch); }
  const lean = nud * -.07;
  const paint = (q, mono) => {
    q.setTransform(s, 0, 0, s, U.ox * s, U.oy * s); q.rotate(lean);
    const col = (k) => mono || D[k], sh = (k, dd) => mono || shadeHex(D[k], dd);
    const sy = -br - up, hx = w8;
    q.fillStyle = col('pants'); capsule(q, -8 + hx, -92, 9, -8.8, -50, 6.9); capsule(q, -8.8, -50, 6.7, -8.4, -9, 5.2);
    q.fillStyle = sh('pants', .03); capsule(q, 8 + hx, -92, 9, 10.4, -52, 6.9); capsule(q, 10.4, -52, 6.6, 9.6, -10, 5.2);
    q.fillStyle = col('shoes'); q.beginPath(); q.ellipse(-8.6, -4.6, 6.2, 4.6, 0, 0, 7); q.fill(); q.beginPath(); q.ellipse(9.8, -5.2, 6.2, 4.4, .1, 0, 7); q.fill();
    // left arm: at the side, or the elbow nudges out to the left (toward the neighbour)
    q.fillStyle = sh('coat', -.04); const ex = -24 - nud * 13, ey = -113 + nud * 4; capsule(q, -19, -142 + sy, 6.9, ex, ey, 5.9); capsule(q, ex, ey, 5.7, -22 + nud * 6, -87 + nud * 4, 4.7);
    q.fillStyle = col('skin'); q.beginPath(); q.ellipse(-21.4 + nud * 6, -81.5 + nud * 4, 3.9, 5.2, .15, 0, 7); q.fill();
    // coat with round shoulders (pulled up when tense)
    q.fillStyle = col('coat'); q.beginPath();
    q.moveTo(-18.5, -77); q.bezierCurveTo(-19.5, -92, -16.2, -106, -16.4, -120); q.bezierCurveTo(-16.8, -134, -23, -140 + sy, -18.5, -147 + sy); q.bezierCurveTo(-13, -152 + sy, -6, -151.5 + sy + up * .5, 0, -151.5 + sy + up * .6);
    q.bezierCurveTo(6, -151.5 + sy + up * .5, 13, -152 + sy, 18.5, -147 + sy); q.bezierCurveTo(23, -140 + sy, 16.8, -134, 16.4, -120); q.bezierCurveTo(16.2, -106, 19.5, -92 + hx * .2, 18.5, -77);
    q.quadraticCurveTo(0, -73.5, -18.5, -77); q.closePath(); q.fill();
    // right arm: holds the phone in front of the chest; the fist rises beside the head
    if (fist > 0) {
      const ex2 = mix(27.5, 30, fist), ey2 = mix(-117, -160, fist), hx2 = mix(26, 27, fist), hy2 = mix(-112, -196, fist);
      q.fillStyle = col('coat'); capsule(q, 17.5, -142 + sy, 7, ex2, ey2, 6.3); capsule(q, ex2, ey2, 6.1, hx2, hy2 + 6, 5);
      q.fillStyle = col('skin'); q.beginPath(); q.ellipse(hx2, hy2, 5.6, 6.6, .1, 0, 7); q.fill();
      if (!mono) { q.strokeStyle = 'rgba(30,14,6,.45)'; q.lineWidth = .6; for (let i = 0; i < 3; i++) { q.beginPath(); q.moveTo(hx2 - 4.5, hy2 - 3 + i * 2.6); q.lineTo(hx2 + 4.5, hy2 - 3.4 + i * 2.6); q.stroke(); } }
    } else { q.fillStyle = col('coat'); capsule(q, 17.5, -142 + sy, 7, 27.5, -117, 6.3); q.beginPath(); q.ellipse(27, -115.5, 6.6, 6.2, .5, 0, 7); q.fill(); }
    // collar, neck, head (lower when the shoulders are up), hair
    q.fillStyle = sh('coat', .08); q.beginPath(); q.moveTo(-9.5, -148 + sy); q.quadraticCurveTo(0, -146 + sy, 9.5, -148 + sy); q.lineTo(8.5, -154 + sy); q.quadraticCurveTo(0, -152.5 + sy, -8.5, -154 + sy); q.closePath(); q.fill();
    q.fillStyle = sh('skin', -.18); capsule(q, 0, -151 + sy, 4.6, 0, -158 + sy + tilt * 3 + up * .6, 4.3);
    q.save(); q.translate(0, -166.5 + sy + tilt * 5 + up * .9);
    q.fillStyle = col('hair'); q.beginPath(); q.ellipse(0, 0, 9.3, 11.4 - tilt * 2, 0, 0, 7); q.fill();
    q.beginPath(); q.moveTo(-8.6, 3); q.quadraticCurveTo(0, 12.5 - tilt * 3, 8.6, 3); q.lineTo(7.8, 6.5); q.quadraticCurveTo(0, 11, -7.8, 6.5); q.closePath(); q.fill();
    q.restore();
    q.fillStyle = mono || scarf; q.beginPath(); q.ellipse(0, -149.5 + sy, 10.4, 4.2, 0, 0, 7); q.fill();
    q.beginPath(); q.moveTo(-8, -150 + sy); q.quadraticCurveTo(-11.5, -139, -9.5, -128); q.lineTo(-4.2, -129); q.quadraticCurveTo(-5.4, -139, -2.8, -149 + sy); q.closePath(); q.fill();
  };
  paint(g, null);
  g.setTransform(s, 0, 0, s, U.ox * s, U.oy * s); g.globalCompositeOperation = 'source-atop';
  const fg = g.createLinearGradient(0, -200, 0, 0); fg.addColorStop(0, 'rgba(120,150,200,.14)'); fg.addColorStop(.35, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(3,4,10,.5)'); g.fillStyle = fg; g.fillRect(-75, -230, 150, 240);
  if (o.shade) { g.fillStyle = `rgba(8,11,24,${o.shade})`; g.fillRect(-75, -230, 150, 240); }
  g.setTransform(1, 0, 0, 1, 0, 0); hatch(g, null, -1.1, 3.2 * Math.max(1, s * .9), .2, { box: [0, 0, cw, ch], col: '#05060c', w: Math.max(.6, s * .35), wobble: .5 });
  g.globalCompositeOperation = 'source-over';
  paint(mg, '#fff'); mg.setTransform(1, 0, 0, 1, 0, 0);
  const rim = (Lx, Ly, colr, a) => {
    const dx = Lx - x, dy = Ly - (y - 120 * s), m = Math.hypot(dx, dy) || 1, rw = Math.max(1.2, s * 1.3);
    rg.globalCompositeOperation = 'source-over'; rg.setTransform(1, 0, 0, 1, 0, 0); rg.clearRect(0, 0, cw, ch); rg.drawImage(mc, 0, 0); rg.globalCompositeOperation = 'destination-out'; rg.drawImage(mc, -dx / m * rw, -dy / m * rw);
    rg.globalCompositeOperation = 'source-in'; rg.fillStyle = colr; rg.fillRect(0, 0, cw, ch); g.globalAlpha = a; g.drawImage(rc, 0, 0); g.globalAlpha = 1;
  };
  const L = o.light || { x: x + 600, y: y - 500, col: '#ffe2b8', a: .9 }; rim(L.x, L.y, L.col || '#ffe2b8', L.a ?? .9);
  if (o.light2) rim(o.light2.x, o.light2.y, o.light2.col, o.light2.a ?? .5);
  if (o.glow !== null && !fist) {
    const G = o.glow || { col: '#ffb35c', a: .9 }, rw = Math.max(1.2, s * 1.3);
    rg.globalCompositeOperation = 'source-over'; rg.clearRect(0, 0, cw, ch); rg.drawImage(mc, 0, 0); rg.globalCompositeOperation = 'destination-out'; rg.drawImage(mc, -rw * 1.6, rw * .3);
    rg.globalCompositeOperation = 'destination-in'; const px = (U.ox + 10) * s, py = (U.oy - 124) * s, gg = rg.createRadialGradient(px, py, 0, px, py, 34 * s); gg.addColorStop(0, '#fff'); gg.addColorStop(1, 'rgba(255,255,255,0)'); rg.fillStyle = gg; rg.fillRect(0, 0, cw, ch);
    rg.globalCompositeOperation = 'source-in'; rg.fillStyle = G.col; rg.fillRect(0, 0, cw, ch);
    g.globalCompositeOperation = 'lighter'; g.globalAlpha = G.a ?? .9; g.drawImage(rc, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  ctx.drawImage(c, x - U.ox * s, y - U.oy * s);
  return { phone: [x + 9 * s, y - 124 * s], head: [x, y - (167 - up) * s], shoulder: [x + 18 * s, y - (147 + up) * s] };
}
