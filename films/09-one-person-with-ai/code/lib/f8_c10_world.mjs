// Film 8 · chunk c10 · the world of 09a (owner B3; others may import, never edit).
//
// ONE street at morning gold, in street units (ground line G = 800; buildings stand on it), seen by an orthographic camera
// cam = { x, y, k } (screen = W/2 + (x − cam.x)·k). Far city and sky have their own parallax. From left to right:
//   the civic end (three places −1830…−1050, portico −1000…−540, lectern −300: lib/f8_c10_civic.mjs) · vault (x 40…660: the company
//   brain behind bars, the deed with the wax seal on its gate) · the two pieces on the street (x 676…946) · the bakery street
//   (x 820…3180, 8 bakeries) under the canopy rect · the supermarket halls (x 3560…5920) under their own network.
// And a nested world N (the inside of the two pieces): the Apertus frame (N 600…1320) and the Read-Coop page (N 2700…3300).
//   street(ctx, t, cam, S)    draws the street world; S = state functions of t (see sc10.mjs)
//   nWorld(ctx, t, cam, S)    draws N (cam in N units)
//   PORT1 / PORT2             the two portals: N → street affine maps (scale s, N anchor, street anchor)
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift } from '../engine.mjs';
import { F8, weave, firefly, swarm, stitch, eoutX, einX, qio } from './f8_kit.mjs';
import { figure, figureBack, walk } from './figure.mjs';
import { vnoise, fbm } from './art.mjs';
import { inkText } from './f8_chart.mjs';
import { crate, glow, sine, hatchIn } from './f8_c09_world.mjs';
import { deed, DEED, waxSeal } from './f8_c09_plate.mjs';

const TAU = Math.PI * 2;
export const G = 800;
const STONE = '#4c4f68', STONE_D = '#33354a', WARM = '#ffcf96', AMBER = '#ffb35c', GOLD = '#f3d9a0';
// ---------------------------------------------------------------- camera helpers
export const proj = (cam) => { const k = cam.k, X = (x) => W / 2 + (x - cam.x) * k, Y = (y) => H / 2 + (y - cam.y) * k; return { k, X, Y, M: [k, 0, 0, k, W / 2 - cam.x * k, H / 2 - cam.y * k] }; };
const visX = (P, x0, x1, m = 80) => P.X(x1) > -m && P.X(x0) < W + m;
function hatchBox(ctx, box, gap, ang, a, lw, col = '#000000') {
  const [x, y, w, h] = box; ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw; ctx.beginPath();
  const c = Math.cos(ang), s = Math.sin(ang), R = Math.hypot(w, h) / 2 + 2, cx = x + w / 2, cy = y + h / 2;
  for (let d = -R; d <= R; d += gap) { ctx.moveTo(cx - s * d - c * R, cy + c * d - s * R); ctx.lineTo(cx - s * d + c * R, cy + c * d + s * R); }
  ctx.stroke(); ctx.restore();
}
const lit = (L, dark, warm) => { const a = parseInt(dark.slice(1), 16), b = parseInt(warm.slice(1), 16), m = (s) => Math.round(mix((a >> s) & 255, (b >> s) & 255, L)); return `rgb(${m(16)},${m(8)},${m(0)})`; };

// ---------------------------------------------------------------- sky, far city, street ground
function sky(ctx, t, cam, P) {
  const yH = P.Y(G - 30), g = ctx.createLinearGradient(0, yH - 1500 * Math.min(1.4, P.k), 0, yH);
  g.addColorStop(0, '#1e1838'); g.addColorStop(.45, '#4a3560'); g.addColorStop(.75, '#b8766c'); g.addColorStop(.92, '#e9b07e'); g.addColorStop(1, '#f6d9a6');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, Math.max(0, Math.min(H, yH + 4)));
  // the sun, low, to the right of the vault (behind the bakery street)
  const kf = 1 / (1 / P.k + 6), sx = W / 2 + (2600 - cam.x) * kf, sy = P.Y(G - 30) - 150 * Math.min(1.5, kf * 6);   // the sun keeps its height over the horizon
  glow(ctx, sx, sy, 900 * Math.min(1.5, kf * 6), '#ffb070', .45, '#ffe7c0'); glow(ctx, sx, sy, 240 * Math.min(1.5, kf * 6), '#ffd090', .5, '#fff4dc');
}
const FAR = (() => { const r = prng(808), b = []; let x = -3000; while (x < 14000) { const w = 60 + r() * 140, h = 60 + r() * 200, k = r(); b.push({ x, w, h, k }); x += w + r() * 20; } return b; })();
function farCity(ctx, t, cam, P) {
  const kf = 1 / (1 / P.k + 2.2), X = (x) => W / 2 + (x - cam.x) * kf, Y = (y) => H / 2 + (y - cam.y) * kf + (G - cam.y) * (P.k - kf) * .0;
  const base = H / 2 + (G - 20 - cam.y) * P.k;   // the far city stands on the visible horizon (the street's far edge)
  ctx.save(); ctx.beginPath(); ctx.moveTo(-10, base + 2);
  for (const b of FAR) { const x0 = X(b.x), x1 = X(b.x + b.w); if (x1 < -20 || x0 > W + 20) continue; const h = b.h * kf;
    if (b.k < .1) { ctx.lineTo(x0, base - h * .6); ctx.quadraticCurveTo((x0 + x1) / 2, base - h * 1.1, x1, base - h * .6); }
    else if (b.k < .18) { ctx.lineTo(x0, base - h * .7); ctx.lineTo((x0 + x1) / 2, base - h * 1.5); ctx.lineTo(x1, base - h * .7); }
    else if (b.k < .5) { ctx.lineTo(x0, base - h * .7); ctx.lineTo((x0 + x1) / 2, base - h); ctx.lineTo(x1, base - h * .7); }
    else { ctx.lineTo(x0, base - h); ctx.lineTo(x1, base - h); } }
  ctx.lineTo(W + 10, base + 2); ctx.closePath(); ctx.fillStyle = '#7a5670'; ctx.fill();
  ctx.strokeStyle = rgba(WARM, .35); ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
}
function ground(ctx, t, P) {
  const y0 = P.Y(G); if (y0 > H) return;
  const g = ctx.createLinearGradient(0, y0, 0, y0 + 500 * P.k); g.addColorStop(0, '#3a2a36'); g.addColorStop(1, '#1e1622'); ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0 + 2);
  // cobbles: rows of short arcs, denser toward the far side; the curb line
  ctx.save(); ctx.strokeStyle = rgba('#000000', .28); ctx.lineWidth = Math.max(.8, .9 * P.k); ctx.beginPath();
  for (let j = 0; j < 22; j++) { const yy = G + 46 + j * (12 + j * 1.6), sy = P.Y(yy); if (sy > H + 10) break; if (sy < -10) continue; const step = (36 + j * 3) * P.k, off = (j % 2) * step / 2 + ((P.X(0) % step) + step) % step;
    for (let x = off - step; x < W + step; x += step) { ctx.moveTo(x + step * .1, sy); ctx.quadraticCurveTo(x + step * .5, sy - 4 * P.k, x + step * .9, sy); } }
  ctx.stroke(); ctx.strokeStyle = rgba(WARM, .25); ctx.lineWidth = Math.max(1, 1.4 * P.k); ctx.beginPath(); ctx.moveTo(0, P.Y(G + 36)); ctx.lineTo(W, P.Y(G + 36)); ctx.stroke(); ctx.restore();
}

// ---------------------------------------------------------------- the vault (9.01, 9.10)
export const VAULT = { x0: 40, x1: 660, top: 60, win: { x: 200, y: 120, w: 300, h: 280 }, gate: { x: 230, y: 440, w: 240, h: 360 } };
export const DEED_ST = { x: 262, y: 590, w: 150 };   // the deed's paper rect on the gate (street units; 16:9)
DEED_ST.h = DEED_ST.w * 9 / 16; DEED_ST.ds = DEED_ST.w / W;
export const SEAL_ST = [DEED_ST.x + DEED.seal.x * DEED_ST.ds, DEED_ST.y + DEED.seal.y * DEED_ST.ds, DEED.seal.r * DEED_ST.ds];
function vault(ctx, t, P, S) {
  const V = VAULT, lw = 1.3 / P.k, k = P.k;
  ctx.save(); ctx.setTransform(...P.M);
  // body, pediment, plinth
  ctx.beginPath(); ctx.rect(V.x0, V.top, V.x1 - V.x0, G - V.top); ctx.fillStyle = STONE; ctx.fill();
  const lg = ctx.createLinearGradient(V.x0, 0, V.x1, 0); lg.addColorStop(0, 'rgba(10,8,20,.35)'); lg.addColorStop(.7, 'rgba(10,8,20,0)'); lg.addColorStop(1, 'rgba(255,200,150,.12)'); ctx.fillStyle = lg; ctx.fill();
  ctx.beginPath(); ctx.rect(V.x0, V.top, V.x1 - V.x0, G - V.top); hatchBox(ctx, [V.x0, V.top, V.x1 - V.x0, G - V.top], Math.max(7, 4 / k), -1.05, .22, lw * .8);
  ctx.strokeStyle = rgba('#000000', .3); ctx.lineWidth = lw; ctx.beginPath(); for (let y = V.top + 40; y < G; y += 40) { ctx.moveTo(V.x0, y); ctx.lineTo(V.x1, y); for (let x = V.x0 + ((y / 40) % 2) * 40; x < V.x1; x += 80) { ctx.moveTo(x, y); ctx.lineTo(x, y - 40); } } ctx.stroke();
  ctx.beginPath(); ctx.moveTo(V.x0 - 30, V.top); ctx.lineTo((V.x0 + V.x1) / 2, V.top - 150); ctx.lineTo(V.x1 + 30, V.top); ctx.closePath(); ctx.fillStyle = STONE_D; ctx.fill(); ctx.strokeStyle = rgba(WARM, .5); ctx.lineWidth = 2 * lw; ctx.stroke();
  ctx.fillStyle = STONE_D; ctx.fillRect(V.x0 - 30, V.top - 6, V.x1 - V.x0 + 60, 26); ctx.fillRect(V.x0 - 20, G - 40, V.x1 - V.x0 + 40, 40); ctx.fillRect(V.x0 - 40, G - 16, V.x1 - V.x0 + 80, 16);
  // pilasters
  for (const px of [V.x0 + 20, V.x0 + 120, V.x1 - 150, V.x1 - 50]) { ctx.fillStyle = '#5a5e7a'; ctx.fillRect(px, V.top + 20, 30, G - V.top - 60); ctx.strokeStyle = rgba('#000000', .4); ctx.lineWidth = lw; ctx.strokeRect(px, V.top + 20, 30, G - V.top - 60); ctx.strokeStyle = rgba(WARM, .3); ctx.beginPath(); ctx.moveTo(px + 30, V.top + 20); ctx.lineTo(px + 30, G - 40); ctx.stroke(); }
  // the arched window with bars: the brain locked inside (drawn in screen coords afterwards), dark glass first
  const Wn = V.win, arch = () => { ctx.beginPath(); ctx.moveTo(Wn.x, Wn.y + Wn.h); ctx.lineTo(Wn.x, Wn.y + Wn.w / 2); ctx.arc(Wn.x + Wn.w / 2, Wn.y + Wn.w / 2, Wn.w / 2, Math.PI, 0); ctx.lineTo(Wn.x + Wn.w, Wn.y + Wn.h); ctx.closePath(); };
  arch(); ctx.fillStyle = '#120d1a'; ctx.fill();
  ctx.restore();
  // the weave inside (screen coords, never under a scaling transform)
  ctx.save(); ctx.setTransform(...P.M); arch(); ctx.restore(); ctx.save(); ctx.clip();
  const wr = { x: P.X(Wn.x + 10), y: P.Y(Wn.y + 30), w: (Wn.w - 20) * k, h: (Wn.h - 40) * k };
  const gl = ctx.createRadialGradient(wr.x + wr.w / 2, wr.y + wr.h / 2, 0, wr.x + wr.w / 2, wr.y + wr.h / 2, wr.w * .7); gl.addColorStop(0, 'rgba(120,80,30,.55)'); gl.addColorStop(1, 'rgba(40,20,10,0)'); ctx.fillStyle = gl; ctx.fillRect(wr.x - wr.w, wr.y - wr.h, wr.w * 3, wr.h * 3);
  if (wr.w > 6) weave(ctx, t, { ...wr, depth: 2, cols: 22, rows: 14, a: 1.2 * (S.vaultA ?? 1), seed: 31, thick: 1.6, old: .5, persp: .1, shape: 'brain', shimmer: 1 });
  ctx.restore();
  ctx.save(); ctx.setTransform(...P.M);
  ctx.strokeStyle = '#2a2236'; ctx.lineWidth = 7; ctx.beginPath(); for (let x = Wn.x + 30; x < Wn.x + Wn.w; x += 30) { ctx.moveTo(x, Wn.y + 4); ctx.lineTo(x, Wn.y + Wn.h); } ctx.moveTo(Wn.x, Wn.y + 150); ctx.lineTo(Wn.x + Wn.w, Wn.y + 150); ctx.moveTo(Wn.x, Wn.y + 230); ctx.lineTo(Wn.x + Wn.w, Wn.y + 230); ctx.stroke();
  ctx.strokeStyle = rgba(WARM, .3); ctx.lineWidth = 1.6 * lw; ctx.beginPath(); for (let x = Wn.x + 30; x < Wn.x + Wn.w; x += 30) { ctx.moveTo(x + 3, Wn.y + 4); ctx.lineTo(x + 3, Wn.y + Wn.h); } ctx.stroke();
  arch(); ctx.strokeStyle = STONE_D; ctx.lineWidth = 14; ctx.stroke();
  // the gate: two bronze leaves, rivets, an arch
  const Gt = V.gate, gate = () => { ctx.beginPath(); ctx.moveTo(Gt.x, G); ctx.lineTo(Gt.x, Gt.y + Gt.w / 2); ctx.arc(Gt.x + Gt.w / 2, Gt.y + Gt.w / 2, Gt.w / 2, Math.PI, 0); ctx.lineTo(Gt.x + Gt.w, G); ctx.closePath(); };
  gate(); ctx.fillStyle = '#3e3028'; ctx.fill(); hatchBox(ctx, [Gt.x, Gt.y, Gt.w, Gt.h], Math.max(5, 3 / k), -.2, .25, lw * .8);
  gate(); ctx.strokeStyle = '#21181a'; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = rgba(WARM, .35); ctx.lineWidth = 2 * lw; ctx.stroke();
  ctx.strokeStyle = '#21181a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(Gt.x + Gt.w / 2, Gt.y); ctx.lineTo(Gt.x + Gt.w / 2, G); ctx.stroke();
  ctx.fillStyle = '#7a6040'; for (let y = Gt.y + 140; y < G - 10; y += 34) for (const x of [Gt.x + 16, Gt.x + Gt.w / 2 - 16, Gt.x + Gt.w / 2 + 16, Gt.x + Gt.w - 16]) { ctx.beginPath(); ctx.arc(x, y, 3.2, 0, TAU); ctx.fill(); }
  // the thread: from the window sill down the gate to the deed (gold, behind the deed)
  ctx.restore();
  const th = S.thread ?? 1;
  if (th > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.strokeStyle = rgba(GOLD, .5 * th); ctx.lineWidth = Math.max(1.5, 3 * k); ctx.beginPath(); ctx.moveTo(P.X(352), P.Y(Wn.y + Wn.h - 6)); ctx.bezierCurveTo(P.X(352), P.Y(500), P.X(300), P.Y(540), P.X(300), P.Y(DEED_ST.y + 10)); ctx.stroke(); ctx.strokeStyle = rgba(F8.goldCore, .9 * th); ctx.lineWidth = Math.max(.8, .9 * k); ctx.stroke(); ctx.restore(); }
  // the deed with its seal (the seal can leave: S.sealOff → it is drawn by the caller as a falling object)
  ctx.save(); ctx.setTransform(P.k * DEED_ST.ds, 0, 0, P.k * DEED_ST.ds, P.X(DEED_ST.x), P.Y(DEED_ST.y));
  deed(ctx, t, { rise: 1, seal: S.press ?? 0, glint: S.glint ?? 0, thread: [[W, H * .57], [W + 240, H * .6]], noSeal: S.sealOff });
  ctx.restore();
}

// ---------------------------------------------------------------- bakeries (9.03, 9.11, 9.16)
export const BAKERIES = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ x: 960 + i * 300, i, seed: 11 + i * 7, wall: ['#5a4250', '#4e3a52', '#5e4648', '#4a3e56', '#584050', '#52404e', '#5c4452', '#4c3c50'][i] }));
function bakery(ctx, t, B, P, o = {}) {
  const x = B.x, k = P.k, lw = 1.3 / k, r = prng(B.seed), L = o.lit ?? 1, br = .92 + .08 * Math.sin(t * 1.7 + B.i);
  ctx.save(); ctx.setTransform(...P.M);
  // window light on the street
  const pool = ctx.createRadialGradient(x - 35, G + 30, 0, x - 35, G + 30, 170); pool.addColorStop(0, rgba(AMBER, .32 * L)); pool.addColorStop(1, rgba(AMBER, 0)); ctx.save(); ctx.translate(0, G + 30); ctx.scale(1, .3); ctx.translate(0, -(G + 30)); ctx.fillStyle = pool; ctx.fillRect(x - 220, G - 200, 400, 460); ctx.restore();
  // walls + gable roof + chimney
  ctx.beginPath(); ctx.rect(x - 115, G - 200, 230, 200); ctx.fillStyle = B.wall; ctx.fill(); hatchBox(ctx, [x - 115, G - 200, 230, 200], Math.max(6, 3.5 / k), -1.0, .2, lw * .8);
  ctx.strokeStyle = rgba('#000000', .45); ctx.lineWidth = lw; ctx.strokeRect(x - 115, G - 200, 230, 200);
  ctx.beginPath(); ctx.moveTo(x - 132, G - 196); ctx.lineTo(x, G - 290); ctx.lineTo(x + 132, G - 196); ctx.closePath(); ctx.fillStyle = '#2e2236'; ctx.fill(); hatchBox(ctx, [x - 132, G - 292, 264, 98], Math.max(5, 3 / k), -.4, .3, lw * .8);
  ctx.beginPath(); ctx.moveTo(x - 132, G - 196); ctx.lineTo(x, G - 290); ctx.lineTo(x + 132, G - 196); ctx.strokeStyle = rgba(WARM, .55); ctx.lineWidth = 1.6 * lw; ctx.stroke();
  ctx.fillStyle = '#3a2a36'; ctx.fillRect(x + 50, G - 300, 26, 70); ctx.strokeStyle = rgba(WARM, .4); ctx.lineWidth = lw; ctx.strokeRect(x + 50, G - 300, 26, 70);
  // upper windows (two small lit ones) and the arched shop window with loaves; the door; the hanging sign with a pretzel
  for (const wx of [x - 70, x - 10]) { ctx.fillStyle = lit(L * .8 * br, '#1a1220', '#ffcf8a'); ctx.fillRect(wx, G - 186, 30, 36); ctx.strokeStyle = rgba('#000000', .6); ctx.lineWidth = lw; ctx.strokeRect(wx, G - 186, 30, 36); }
  const sw = () => { ctx.beginPath(); ctx.moveTo(x - 95, G - 30); ctx.lineTo(x - 95, G - 110); ctx.arc(x - 40, G - 110, 55, Math.PI, 0); ctx.lineTo(x + 15, G - 30); ctx.closePath(); };
  sw(); const wg = ctx.createLinearGradient(0, G - 165, 0, G - 30); wg.addColorStop(0, lit(L * br, '#1a1220', '#ffe2b0')); wg.addColorStop(1, lit(L * br, '#1a1220', '#ffb35c')); ctx.fillStyle = wg; ctx.fill();
  ctx.save(); sw(); ctx.clip(); ctx.fillStyle = rgba('#5a3418', .85 * L); for (let s2 = 0; s2 < 2; s2++) { const sy = G - 92 + s2 * 38; ctx.fillRect(x - 95, sy + 10, 110, 4); for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.ellipse(x - 80 + j * 26 + (s2 ? 10 : 0), sy + 4, 11, 6, 0, 0, TAU); ctx.fill(); } } ctx.restore();
  sw(); ctx.strokeStyle = '#21181a'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = lit(L * .9, '#140e18', '#ffd89a'); ctx.fillRect(x + 32, G - 120, 46, 120); ctx.strokeStyle = '#21181a'; ctx.lineWidth = 4; ctx.strokeRect(x + 32, G - 120, 46, 120);
  ctx.strokeStyle = '#21181a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 115, G - 170); ctx.lineTo(x + 150, G - 170); ctx.stroke();
  ctx.save(); ctx.translate(x + 140, G - 166); ctx.rotate(.04 * Math.sin(t * 1.4 + B.i)); ctx.fillStyle = '#6a4a2c'; ctx.fillRect(-18, 0, 36, 30); ctx.strokeStyle = '#21181a'; ctx.lineWidth = 2; ctx.strokeRect(-18, 0, 36, 30);
  ctx.strokeStyle = '#e8c890'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(-5, 15, 7, Math.PI * .3, Math.PI * 1.9); ctx.arc(5, 15, 7, Math.PI * 1.1, Math.PI * .7); ctx.stroke(); ctx.restore();
  ctx.restore();
  // chimney smoke: soft puffs rising and drifting (screen space)
  for (let j = 0; j < 5; j++) { const q = ((t * .25 + j / 5 + B.i * .13) % 1), px = P.X(x + 63 + q * 60 + 10 * Math.sin(t + j)), py = P.Y(G - 305 - q * 160), rr = (14 + q * 40) * k; ctx.fillStyle = rgba('#d8c0c8', .14 * (1 - q)); ctx.beginPath(); ctx.arc(px, py, rr, 0, TAU); ctx.fill(); }
  // window glow
  if (L > 0) glow(ctx, P.X(x - 40), P.Y(G - 90), 160 * k, AMBER, .2 * L * br);
  return { win: [x - 40, G - 165], chimney: [x + 63, G - 300], door: [x + 55, G - 60] };
}
// the threads from windows and chimneys up into the canopy (u 0..1 growth per bakery), with signals running up
function bakeryThreads(ctx, t, P, B, u, topY) {
  if (u <= 0) return; const pts = [[B.x - 40, G - 165], [B.x + 63, G - 300]];
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [j, [x0, y0]] of pts.entries()) {
    const x1 = x0 + 30 * Math.sin(B.i * 2 + j), y1 = topY + 20, e = eout(clamp(u * 1.15 - j * .15)); if (e <= 0) continue;
    const yy = mix(y0, y1, e), cx = mix(x0, x1, e * .5) + 14 * Math.sin(t * .8 + j + B.i);
    ctx.strokeStyle = rgba(GOLD, .3); ctx.lineWidth = Math.max(2, 4 * P.k); ctx.beginPath(); ctx.moveTo(P.X(x0), P.Y(y0)); ctx.quadraticCurveTo(P.X(cx), P.Y((y0 + yy) / 2), P.X(mix(x0, x1, e)), P.Y(yy)); ctx.stroke();
    ctx.strokeStyle = rgba(F8.goldCore, .85); ctx.lineWidth = Math.max(.8, 1.1 * P.k); ctx.stroke();
    if (e < 1) glow(ctx, P.X(mix(x0, x1, e)), P.Y(yy), 16 * Math.max(1, P.k), GOLD, .8, F8.goldCore);
    else for (let s = 0; s < 2; s++) { const q = ((t * .6 + s * .5 + j * .3 + B.i * .17) % 1); glow(ctx, P.X(mix(x0, x1, q)), P.Y(mix(y0, y1, q)) + 0, 9 * Math.max(1, P.k), GOLD, .7 * Math.sin(Math.PI * q), F8.goldCore); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the canopy (one shared network over the street) and the supermarket's own
export const CANOPY = { x: 820, y: 110, w: 2360, h: 320 };
export const MARKET_NET = { x: 3560, y: 110, w: 2360, h: 320 };
// clipRects: [[x0, y0, x1, y1] …] in street units (the parts that exist now); ghost 0..1 (dotted: does not exist yet)
export function net(ctx, t, P, R, o = {}) {
  const rx = P.X(R.x), ry = P.Y(R.y), rw = R.w * P.k, rh = R.h * P.k; if (rx > W + 40 || rx + rw < -40) return;
  ctx.save();
  if (o.clips) { ctx.beginPath(); for (const [x0, y0, x1, y1] of o.clips) ctx.rect(P.X(x0), P.Y(y0), (x1 - x0) * P.k, (y1 - y0) * P.k); ctx.clip(); }
  weave(ctx, t, { x: rx, y: ry, w: rw, h: rh, depth: 2, cols: 34, rows: 12, a: o.a ?? 1, seed: o.seed ?? 51, thick: 1.4, old: .55, persp: .12, shape: 'cloud', ghost: o.ghost ?? 0, shimmer: o.shimmer ?? 1, stitches: o.stitches, pulse: o.pulse });
  ctx.restore();
}

// ---------------------------------------------------------------- supermarket halls (9.04)
function hall(ctx, t, x0, w, P) {
  const k = P.k, lw = 1.3 / k, h = 330, y0 = G - h;
  ctx.save(); ctx.setTransform(...P.M);
  ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.fillStyle = '#3c4058'; ctx.fill(); hatchBox(ctx, [x0, y0, w, h], Math.max(7, 4 / k), -1.1, .18, lw * .8);
  ctx.strokeStyle = rgba('#000000', .45); ctx.lineWidth = lw; ctx.strokeRect(x0, y0, w, h);
  ctx.fillStyle = '#2c3046'; ctx.fillRect(x0 - 10, y0 - 24, w + 20, 30); ctx.strokeStyle = rgba(WARM, .4); ctx.beginPath(); ctx.moveTo(x0 - 10, y0 - 24); ctx.lineTo(x0 + w + 10, y0 - 24); ctx.stroke();
  // the blank sign band (stripes, no logo) and the long cold-lit glass front
  ctx.fillStyle = '#5a6078'; ctx.fillRect(x0 + 40, y0 + 22, w - 80, 46); ctx.strokeStyle = rgba('#cfe3f0', .35); ctx.lineWidth = 3 * lw; ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.moveTo(x0 + 60, y0 + 34 + i * 11); ctx.lineTo(x0 + w - 60, y0 + 34 + i * 11); } ctx.stroke();
  for (let x = x0 + 30; x < x0 + w - 60; x += 64) { ctx.fillStyle = 'rgba(200,226,240,.55)'; ctx.fillRect(x, y0 + 110, 52, 150); ctx.strokeStyle = '#1c2034'; ctx.lineWidth = 3; ctx.strokeRect(x, y0 + 110, 52, 150); }
  ctx.fillStyle = '#20243a'; ctx.fillRect(x0 + w / 2 - 70, G - 120, 140, 120);
  ctx.restore();
  glow(ctx, P.X(x0 + w / 2), P.Y(G - 160), 600 * k, '#bfe3ff', .12);
}

// ---------------------------------------------------------------- the two pieces on the street (9.06): portals into N
export const PIECE1 = { x: 676, y: 826, w: 112 };   // the window of the open frame piece (16:9)
PIECE1.h = PIECE1.w * 9 / 16;
export const PIECE2 = { x: 896, y: 872, r: 36, R: 50 };   // the co-op seal medallion: window radius r, ring R
export const PORT1 = { s: PIECE1.w / W, N: [0, 0], St: [PIECE1.x, PIECE1.y] };                     // N (0,0) → street (PIECE1.x, PIECE1.y)
export const PORT2 = { s: PIECE2.r / 1101.4, N: [3000, 540], St: [PIECE2.x, PIECE2.y] };           // N (3000,540) → the medallion centre
export const toSt = (Pt, [x, y]) => [Pt.St[0] + (x - Pt.N[0]) * Pt.s, Pt.St[1] + (y - Pt.N[1]) * Pt.s];
export const toN = (Pt, [x, y]) => [Pt.N[0] + (x - Pt.St[0]) / Pt.s, Pt.N[1] + (y - Pt.St[1]) / Pt.s];
function pieces(ctx, t, P, o) {
  const k = P.k, gl = .5 + .5 * Math.exp(-Math.pow((t - (o.glimmer ?? -9)) / .35, 2));
  // glows on the ground
  glow(ctx, P.X(PIECE1.x + PIECE1.w / 2), P.Y(PIECE1.y + PIECE1.h / 2), 60 * k, GOLD, .35 * gl); glow(ctx, P.X(PIECE2.x), P.Y(PIECE2.y), 50 * k, '#ffd0a0', .3 * gl);
  // piece 1: a small open frame (wooden posts, no glass) whose window shows N
  ctx.save(); ctx.setTransform(...P.M); const F1 = PIECE1;
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(F1.x + F1.w / 2, F1.y + F1.h + 14, F1.w * .7, 8, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(P.X(F1.x), P.Y(F1.y), F1.w * k, F1.h * k); ctx.clip(); o.nIn1(ctx); ctx.restore();
  ctx.save(); ctx.setTransform(...P.M); ctx.strokeStyle = '#6a4a2c'; ctx.lineWidth = 6; ctx.strokeRect(F1.x - 3, F1.y - 3, F1.w + 6, F1.h + 6); ctx.beginPath(); ctx.moveTo(F1.x + 8, F1.y + F1.h + 3); ctx.lineTo(F1.x, F1.y + F1.h + 16); ctx.moveTo(F1.x + F1.w - 8, F1.y + F1.h + 3); ctx.lineTo(F1.x + F1.w, F1.y + F1.h + 16); ctx.stroke();
  ctx.strokeStyle = rgba(WARM, .6); ctx.lineWidth = 1.2; ctx.strokeRect(F1.x - 6, F1.y - 6, F1.w + 12, F1.h + 12); ctx.restore();
  // piece 2: the engraved co-op seal: a bronze ring with radial marks; its round window shows N (the page)
  const c = [P.X(PIECE2.x), P.Y(PIECE2.y)];
  ctx.save(); ctx.fillStyle = '#7a5a34'; ctx.beginPath(); ctx.arc(c[0], c[1], PIECE2.R * k, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba('#2a1a10', .8); ctx.lineWidth = Math.max(1, 1.2 * k); ctx.stroke();
  ctx.strokeStyle = rgba('#f0d8a8', .7); ctx.lineWidth = Math.max(.6, .6 * k); ctx.beginPath(); for (let i = 0; i < 36; i++) { const a = i / 36 * TAU; ctx.moveTo(c[0] + Math.cos(a) * (PIECE2.r + 1.5) * k, c[1] + Math.sin(a) * (PIECE2.r + 1.5) * k); ctx.lineTo(c[0] + Math.cos(a) * (PIECE2.R - 2) * k, c[1] + Math.sin(a) * (PIECE2.R - 2) * k); } ctx.stroke(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(c[0], c[1], PIECE2.r * k, 0, TAU); ctx.clip(); o.nIn2(ctx); ctx.restore();
  ctx.save(); ctx.strokeStyle = rgba('#2a1a10', .9); ctx.lineWidth = Math.max(1, 1.4 * k); ctx.beginPath(); ctx.arc(c[0], c[1], PIECE2.r * k, 0, TAU); ctx.stroke(); ctx.restore();
}

// ---------------------------------------------------------------- the street world
// S: { press, glint, sealOff, thread, vaultA, canopy: { clips, ghost, a }, threadsU(i), market (bool), pieces, glimmer, nIn1(ctx), nIn2(ctx),
//      people(ctx, P), civic(ctx, P), lane(ctx, P), after(ctx, P) }
export function street(ctx, t, cam, S) {
  const P = proj(cam);
  sky(ctx, t, cam, P); farCity(ctx, t, cam, P); ground(ctx, t, P);
  if (visX(P, VAULT.x0 - 60, VAULT.x1 + 60)) vault(ctx, t, P, S);
  if (S.canopy) for (const c of [].concat(S.canopy)) net(ctx, t, P, CANOPY, c);
  if (visX(P, MARKET_NET.x, MARKET_NET.x + MARKET_NET.w)) net(ctx, t, P, MARKET_NET, { seed: 77, a: S.marketA ?? 1 });
  for (const B of BAKERIES) { if (!visX(P, B.x - 160, B.x + 160)) continue; if (S.threadsU) bakeryThreads(ctx, t, P, B, S.threadsU(B.i), CANOPY.y + CANOPY.h * .7); bakery(ctx, t, B, P, { lit: 1 }); }
  if (visX(P, 3560, 5920)) { hall(ctx, t, 3600, 1080, P); hall(ctx, t, 4800, 1080, P); }
  if (S.civic) S.civic(ctx, P);
  if (S.lane) S.lane(ctx, P);
  if (S.people) S.people(ctx, P);
  if (visX(P, 640, 960)) pieces(ctx, t, P, S);
  if (S.after) S.after(ctx, P);
  return P;
}

// ================================================================ N · inside the pieces (Apertus, Read-Coop)
const NG = 830;
const SCRIPT = (() => { const r = prng(2024), L = []; for (let i = 0; i < 12; i++) { const y = 170 + i * 52, pts = []; let x = 2770; const x1 = 3230 - (i === 11 ? 160 : r() * 40);
  while (x < x1) { const tall = r() < .18 ? -18 - r() * 10 : r() < .12 ? 16 : 0; for (let q = 0; q < 6; q++) { const a = q / 6 * TAU; pts.push([x + q * 2.4 + Math.cos(a) * 3, y - 6 - Math.sin(a) * (6 + (q === 2 ? -tall * .5 : 0)) + (q === 3 && tall > 0 ? tall : 0)]); } x += 14 + r() * 6; if (r() < .14) { pts.push(null); x += 12; } }
  L.push({ y, pts, x0: 2770, x1 }); } return L; })();
// S: { panels (i → 0..1 lifted), figs: [{ x, y, flip, pose, walk }], takeU, strand (fn t → pts in N), read (0..12), fly, label }
export function nWorld(ctx, t, cam, S) {
  const P = proj(cam), k = P.k, lw = 1.3 / k;
  // sky + ground of N (a dawn clearing, warm)
  const yH = P.Y(NG), g = ctx.createLinearGradient(0, yH - 1100 * k, 0, yH); g.addColorStop(0, '#2a2040'); g.addColorStop(.6, '#7a5266'); g.addColorStop(1, '#e8b88a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const gg = ctx.createLinearGradient(0, yH, 0, yH + 400 * k); gg.addColorStop(0, '#4a3640'); gg.addColorStop(1, '#241a26'); ctx.fillStyle = gg; ctx.fillRect(0, Math.max(0, yH), W, H);
  ctx.save(); ctx.setTransform(...P.M);
  ctx.strokeStyle = rgba('#000000', .25); ctx.lineWidth = lw; ctx.beginPath(); for (let j = 0; j < 14; j++) { const y = NG + 20 + j * j * 4; ctx.moveTo(-2000, y); ctx.lineTo(6000, y); } ctx.stroke();
  // soft hills
  ctx.fillStyle = '#5e4256'; ctx.beginPath(); ctx.moveTo(-2000, NG); for (let x = -2000; x <= 6000; x += 100) ctx.lineTo(x, NG - 60 - 50 * Math.sin(x * .0016) - 30 * Math.sin(x * .0041 + 1)); ctx.lineTo(6000, NG); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(WARM, .35); ctx.lineWidth = 1.4 * lw; ctx.stroke();
  ctx.restore();
  // ---- the Apertus frame: posts, beams, the network inside, the plates lifting off
  if (P.X(1400) > -50 && P.X(500) < W + 50) {
    const fx = 600, fy = 300, fw = 720, fh = 500;
    glow(ctx, P.X(960), P.Y(560), 700 * k, GOLD, .25);
    ctx.save(); ctx.setTransform(...P.M); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(960, NG + 6, 420, 18, 0, 0, TAU); ctx.fill(); ctx.restore();
    weave(ctx, t, { x: P.X(fx + 30), y: P.Y(fy + 30), w: (fw - 60) * k, h: (fh - 60) * k, depth: 2, cols: 26, rows: 16, a: 1.3, seed: 61, thick: 1.6, old: .5, persp: .12, shape: 'brain', shimmer: 1 });
    ctx.save(); ctx.setTransform(...P.M);
    ctx.fillStyle = '#5a3e2a'; for (const px of [fx - 18, fx + fw]) ctx.fillRect(px, fy - 18, 18, NG - fy + 18); ctx.fillRect(fx - 30, fy - 30, fw + 60, 20); ctx.fillRect(fx - 18, fy + fh, fw + 36, 16);
    ctx.strokeStyle = rgba(WARM, .5); ctx.lineWidth = 1.5 * lw; ctx.strokeRect(fx - 18, fy - 18, fw + 36, NG - fy + 18); ctx.strokeRect(fx - 30, fy - 30, fw + 60, 20);
    // the plates (frosted panels) in front; each lifts off like a paper layer and floats away
    for (let i = 0; i < 4; i++) {
      const u = clamp(S.panels ? S.panels(i) : 0), e = qio(u); if (e >= 1) continue;
      const px = fx + i * fw / 4, dir = i < 2 ? -1 : 1;
      ctx.save(); ctx.translate(px + fw / 8 + dir * 260 * e, fy + fh / 2 - 520 * e); ctx.rotate(dir * .25 * e);
      ctx.fillStyle = 'rgba(40,30,44,.78)'; ctx.fillRect(-fw / 8, -fh / 2, fw / 4, fh); hatchBox(ctx, [-fw / 8, -fh / 2, fw / 4, fh], Math.max(7, 4 / k), -.9, .3, lw * .8);
      ctx.beginPath(); ctx.rect(-fw / 8, -fh / 2, fw / 4, fh); ctx.strokeStyle = rgba('#e9dcb8', .45 + .3 * e); ctx.lineWidth = 1.4 * lw; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }
  // ---- the Read-Coop page on its easel, the script, the threads out of the read lines
  if (P.X(3500) > -50 && P.X(2500) < W + 50) {
    ctx.save(); ctx.setTransform(...P.M);
    ctx.strokeStyle = '#4a3020'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(2800, 900); ctx.lineTo(2900, 40); ctx.moveTo(3200, 900); ctx.lineTo(3100, 40); ctx.moveTo(3000, 920); ctx.lineTo(3000, 860); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(2716, 104, 600, 780);
    const pg = ctx.createLinearGradient(2700, 90, 3300, 870); pg.addColorStop(0, '#efe0bc'); pg.addColorStop(1, '#d9c294'); ctx.fillStyle = pg; ctx.fillRect(2700, 90, 600, 780);
    ctx.strokeStyle = 'rgba(120,90,50,.35)'; ctx.lineWidth = 2; ctx.strokeRect(2716, 106, 568, 748);
    ctx.fillStyle = '#4a3020'; ctx.fillRect(2690, 860, 620, 16);
    // the script lines (unreadable Kurrent as an engraving); read lines take a gold tint
    const rd = S.read ?? 0;
    for (const [i, L] of SCRIPT.entries()) {
      const q = clamp(rd - i); ctx.strokeStyle = q > 0 ? `rgb(${Math.round(mix(74, 176, q))},${Math.round(mix(48, 122, q))},${Math.round(mix(32, 46, q))})` : '#4a3020'; ctx.lineWidth = 2.2; ctx.beginPath();
      let pen = false; for (const p of L.pts) { if (!p) { pen = false; continue; } if (pen) ctx.lineTo(p[0], p[1]); else { ctx.moveTo(p[0], p[1]); pen = true; } } ctx.stroke();
    }
    ctx.restore();
    // a thread pulls out of every read line and rises to the right (into the co-op's own little network above)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const [i, L] of SCRIPT.entries()) { const q = clamp((rd - i - .9) / .8); if (q <= 0) continue; const e = eout(q), x0 = L.x1 + 6, y0 = L.y - 6, x1 = 3420 + i * 12, y1 = 60 + i * 8, pts = [];
      for (let j = 0; j <= 16; j++) { const s = j / 16 * e; pts.push([mix(x0, x1, s) + 40 * Math.sin(s * Math.PI), mix(y0, y1, s * s)]); }
      ctx.strokeStyle = rgba(GOLD, .35); ctx.lineWidth = Math.max(2, 3.5 * k); ctx.beginPath(); pts.forEach(([x, y], j) => (j ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y)))); ctx.stroke(); ctx.strokeStyle = rgba(F8.goldCore, .9); ctx.lineWidth = Math.max(.8, 1.1 * k); ctx.stroke(); }
    ctx.restore();
    // the last line lights on "handwriting"
    if (S.last > 0) { const L = SCRIPT[11]; glow(ctx, P.X((L.x0 + L.x1) / 2), P.Y(L.y - 6), 260 * k, GOLD, .5 * S.last, F8.goldCore); }
  }
  // ---- the people (members, visitors) and the strand
  if (S.figs) S.figs(ctx, P);
  if (S.strand) { const pts = S.strand(t); if (pts && pts.length > 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.strokeStyle = rgba(GOLD, .4); ctx.lineWidth = Math.max(2, 4 * k); ctx.beginPath(); pts.forEach(([x, y], j) => (j ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y)))); ctx.stroke(); ctx.strokeStyle = rgba(F8.goldCore, .95); ctx.lineWidth = Math.max(.8, 1.3 * k); ctx.stroke(); const [hx, hy] = pts[pts.length - 1]; glow(ctx, P.X(hx), P.Y(hy), 20 * Math.max(1, k), GOLD, .9, F8.goldCore); ctx.restore(); } }
  if (S.reader) S.reader(ctx, P);
  return P;
}
export { SCRIPT, NG };
