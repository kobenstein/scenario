// c07 · the workshop (7.09 "Most of them kept working"): the camera pulls back out of the amber of the winner's dot, which is the bulb of
// a pendant lamp (kit.amberFill, the same disc at the same size as the dive's last frame); a lit workshop: a winner planes a board at the
// bench (a real hand plane: iron body, wooden tote and knob), shavings curl out of the mouth on "working"; through the window a snowy street
// of falu-red wooden houses at dusk, snow falling. Then one shaving flies up at the lens, uncurls and fills the frame with its pale wood:
// lib/v2_c07_chart.mjs turns that wood into the chart's paper (woodSurface is drawn by both, under the same transform at K.chart0).
//   shopTake(ctx, t, K)
import { W, H, rgba, clamp, mix, prng, drift } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { figure, reachArm } from './figure.mjs';
import { TAU, sstep, cio, mixHex, glowAt, amberFill, path2 } from './v2_c07_kit.mjs';
import { legIK } from './v2_c07_void.mjs';
import { woodSurface, chartM0, WMID } from './v2_c07_chart.mjs';

const B = [760, 306], RB = 20, FLOOR = 905, S = 2.5;   // the bulb (zoom-1 px), the floor line, the winner's figure scale
const DRESS = { coat: '#4b3a2a', pants: '#25242c', shoes: '#17120e', skin: '#d6a982', hair: '#8b8682' };

// ---------------------------------------------------------------- the camera: zoom out of the bulb, then a slow push
function shopCam(t, K) {
  const u = clamp((t - K.shop0) / 1.0), e = u >= 1 ? 1 : 1 - Math.pow(2, -10 * u), Z0 = K.bulbR / RB;
  const Z = Math.exp(Math.log(Z0) * (1 - e)) * (1 + .035 * sstep(K.shop0 + .9, K.fly0, t)), c = cio(clamp(u / .8));
  const sb = [mix(W / 2, B[0], c) + 4 * drift(t, 1, 3) * c, mix(H / 2, B[1], c) + 3 * drift(t, 1, 5) * c];
  return { Z, M: [Z, 0, 0, Z, sb[0] - B[0] * Z, sb[1] - B[1] * Z] };
}
const at = (M, x, y) => [M[0] * x + M[4], M[3] * y + M[5]];

// ---------------------------------------------------------------- planing: two strokes, the second on "working"
function strokeAt(t, K) {
  const [a1, b1, a2, b2] = K.strokes;
  if (t < a1) return { p: 0, n: 0 };
  if (t < b1) return { p: cio((t - a1) / (b1 - a1)), n: 1 };
  if (t < a2) return { p: 1 - cio((t - b1) / (a2 - b1)), n: 1, back: true };
  if (t < b2) return { p: cio((t - a2) / (b2 - a2)), n: 2 };
  return { p: 1, n: 2 };
}
const planeX = (p) => 556 + 190 * p;

// ---------------------------------------------------------------- the room (zoom-1 coordinates, drawn under the camera transform)
const SNOW = (() => { const r = prng(91), o = []; for (let i = 0; i < 160; i++) o.push([r(), r(), .5 + r() * 1.6, r() * TAU, r()]); return o; })();
function windowView(ctx, t) {
  const x0 = 1105, y0 = 155, x1 = 1575, y1 = 565;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  const sk = ctx.createLinearGradient(0, y0, 0, 470); sk.addColorStop(0, '#1b2a52'); sk.addColorStop(1, '#5d77ab'); ctx.fillStyle = sk; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  // the far side of the street: falu-red wooden houses with white corners and window frames, snow on the roofs, warm windows
  const houses = [[1085, 300, 150, 175], [1240, 330, 120, 140], [1365, 285, 170, 190], [1540, 320, 130, 150]];
  for (const [hx, hy, hw, hh] of houses) {
    const base = 470;
    ctx.fillStyle = '#7d2419'; ctx.fillRect(hx, hy, hw, base - hy);
    ctx.strokeStyle = 'rgba(30,8,6,.35)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = hx + 6; x < hx + hw; x += 7) { ctx.moveTo(x, hy); ctx.lineTo(x, base); } ctx.stroke();
    ctx.fillStyle = '#e9e4d8'; ctx.fillRect(hx, hy, 6, base - hy); ctx.fillRect(hx + hw - 6, hy, 6, base - hy);
    // roof with snow
    ctx.fillStyle = '#1c1c24'; ctx.beginPath(); ctx.moveTo(hx - 12, hy + 2); ctx.lineTo(hx + hw / 2, hy - hh * .32); ctx.lineTo(hx + hw + 12, hy + 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#eef2fb'; ctx.beginPath(); ctx.moveTo(hx - 14, hy + 1); ctx.lineTo(hx + hw / 2, hy - hh * .32 - 5); ctx.lineTo(hx + hw + 14, hy + 1); ctx.lineTo(hx + hw + 4, hy - 6); ctx.lineTo(hx + hw / 2, hy - hh * .32 + 4); ctx.lineTo(hx - 4, hy - 6); ctx.closePath(); ctx.fill();
    for (let k = 0; k < 2; k++) { const wx = hx + hw * (.22 + .4 * k), wy = hy + 26; ctx.fillStyle = '#e9e4d8'; ctx.fillRect(wx - 3, wy - 3, 34, 40); ctx.fillStyle = (k + hx) % 3 ? '#ffcf8a' : '#3a4a72'; ctx.fillRect(wx, wy, 28, 34); ctx.fillStyle = '#e9e4d8'; ctx.fillRect(wx + 12.5, wy, 3, 34); ctx.fillRect(wx, wy + 15.5, 28, 3); }
  }
  ctx.fillStyle = '#cfd8ee'; ctx.fillRect(x0, 466, x1 - x0, y1 - 466);
  ctx.strokeStyle = 'rgba(120,140,190,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, 500); ctx.lineTo(x1, 492); ctx.stroke();
  // a street lamp and its glow in the falling snow
  ctx.fillStyle = '#14161e'; ctx.fillRect(1318, 300, 5, 170); glowAt(ctx, 1320, 300, 60, '#ffcf8a', .35, '#fff1d6');
  ctx.fillStyle = 'rgba(245,248,255,.9)';
  for (const [a, b, s, ph, k] of SNOW) { const x = x0 + ((a * 520 + Math.sin(t * .8 + ph) * 10 + t * 12) % 520), y = y0 + ((b * 420 + t * (26 + 30 * k)) % 420); ctx.globalAlpha = .45 + .45 * k; ctx.fillRect(x, y, s, s); }
  ctx.globalAlpha = 1; ctx.restore();
  // the window frame: deep reveal, mullions, sill
  ctx.fillStyle = '#3b2a1c'; ctx.fillRect(1080, 130, 520, 25); ctx.fillRect(1080, 565, 520, 25); ctx.fillRect(1080, 130, 25, 460); ctx.fillRect(1575, 130, 25, 460);
  ctx.fillStyle = '#e8dcc4'; ctx.fillRect(1336, 155, 9, 410); ctx.fillRect(1105, 287, 470, 8); ctx.fillRect(1105, 427, 470, 8);
  ctx.fillStyle = '#5a412b'; ctx.fillRect(1060, 588, 560, 18); ctx.fillStyle = 'rgba(255,220,170,.25)'; ctx.fillRect(1060, 588, 560, 3);
}
function tools(ctx) {
  ctx.fillStyle = '#3e2b1d'; ctx.fillRect(150, 175, 560, 330); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2; ctx.strokeRect(150, 175, 560, 330);
  const pegs = (x, y) => { ctx.fillStyle = '#1b130c'; ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); };
  // handsaw: tapered blade with teeth, wooden handle with its grip hole
  ctx.fillStyle = '#9aa3b4'; ctx.beginPath(); ctx.moveTo(200, 215); ctx.lineTo(420, 228); ctx.lineTo(420, 262); ctx.lineTo(200, 300); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#6c7487'; ctx.beginPath(); for (let x = 200; x < 420; x += 9) { const y = 300 - (x - 200) / 220 * 38; ctx.moveTo(x, y); ctx.lineTo(x + 4.5, y + 6); ctx.lineTo(x + 9, y - 1.6); } ctx.fill();
  ctx.fillStyle = '#8a4a22'; ctx.beginPath(); ctx.roundRect(410, 214, 70, 58, 14); ctx.fill(); ctx.fillStyle = '#3e2b1d'; ctx.beginPath(); ctx.ellipse(447, 240, 18, 10, 0, 0, TAU); ctx.fill(); pegs(445, 222);
  // try square
  ctx.fillStyle = '#7a4b25'; ctx.fillRect(520, 210, 26, 120); ctx.fillStyle = '#b8c0cf'; ctx.fillRect(546, 214, 130, 14); pegs(560, 222);
  // chisels
  for (let i = 0; i < 4; i++) { const x = 230 + i * 42; ctx.fillStyle = '#8a4a22'; ctx.beginPath(); ctx.roundRect(x - 8, 350, 16, 62, 6); ctx.fill(); ctx.fillStyle = '#aab3c4'; ctx.fillRect(x - 4 + i * .5, 412, 8 - i, 60 + i * 6); pegs(x, 345); }
  // hammer and mallet
  ctx.fillStyle = '#8a4a22'; ctx.fillRect(420, 360, 14, 120); ctx.fillStyle = '#4a505e'; ctx.fillRect(398, 344, 58, 22); pegs(427, 340);
  ctx.fillStyle = '#8a4a22'; ctx.fillRect(560, 380, 12, 100); ctx.fillStyle = '#a0683a'; ctx.beginPath(); ctx.roundRect(536, 350, 60, 36, 6); ctx.fill(); pegs(566, 345);
}
function room(ctx, t) {
  const wall = ctx.createLinearGradient(0, 0, 0, FLOOR); wall.addColorStop(0, '#1c130d'); wall.addColorStop(1, '#3a281b'); ctx.fillStyle = wall; ctx.fillRect(-200, -200, W + 400, FLOOR + 200);
  ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = -180; x < W + 200; x += 46) { ctx.moveTo(x, -200); ctx.lineTo(x, FLOOR); } ctx.stroke();
  ctx.strokeStyle = 'rgba(255,214,160,.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = -178; x < W + 200; x += 46) { ctx.moveTo(x, -200); ctx.lineTo(x, FLOOR); } ctx.stroke();
  const fl = ctx.createLinearGradient(0, FLOOR, 0, H + 200); fl.addColorStop(0, '#4a3220'); fl.addColorStop(1, '#22160e'); ctx.fillStyle = fl; ctx.fillRect(-200, FLOOR, W + 400, 400);
  ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1.5; ctx.beginPath(); for (let k = -12; k < 30; k++) { ctx.moveTo(960 + k * 40, FLOOR); ctx.lineTo(960 + k * 150, H + 200); } ctx.stroke();
  windowView(ctx, t); tools(ctx);
  // the window's cold light on the floor
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(110,140,210,.08)'; ctx.beginPath(); ctx.moveTo(1105, 590); ctx.lineTo(1575, 590); ctx.lineTo(1700, H + 100); ctx.lineTo(980, H + 100); ctx.closePath(); ctx.fill(); ctx.restore();
}
function bench(ctx) {
  ctx.fillStyle = '#5c3d22'; ctx.fillRect(500, 690, 60, 215); ctx.fillRect(1410, 690, 60, 215); ctx.fillRect(520, 818, 930, 26);
  ctx.fillStyle = '#7a5230'; ctx.fillRect(480, 668, 1010, 34);
  const top = ctx.createLinearGradient(0, 628, 0, 668); top.addColorStop(0, '#c99a62'); top.addColorStop(1, '#8e6238'); ctx.fillStyle = top; ctx.fillRect(470, 628, 1030, 40);
  ctx.strokeStyle = 'rgba(60,30,10,.4)'; ctx.lineWidth = 1; ctx.beginPath(); for (let y = 636; y < 668; y += 7) { ctx.moveTo(470, y); ctx.lineTo(1500, y + 1); } ctx.stroke();
  // the vice at the right end: jaw, screw, tommy bar
  ctx.fillStyle = '#6a4626'; ctx.fillRect(1500, 626, 30, 78); ctx.fillStyle = '#2a2d36'; ctx.fillRect(1530, 655, 26, 12); ctx.fillStyle = '#9aa3b4'; ctx.fillRect(1552, 620, 6, 84);
  // the board on the bench (pine), the planed stretch paler
  ctx.fillStyle = '#d9b27a'; ctx.fillRect(600, 606, 660, 22); ctx.fillStyle = 'rgba(255,240,210,.35)'; ctx.fillRect(600, 606, 660, 4);
  ctx.strokeStyle = 'rgba(120,70,30,.35)'; ctx.lineWidth = 1; ctx.beginPath(); for (let y = 612; y < 628; y += 4) { ctx.moveTo(600, y); ctx.bezierCurveTo(800, y + 2, 1000, y - 2, 1260, y + 1); } ctx.stroke();
  ctx.fillStyle = '#8e6238'; ctx.fillRect(1262, 600, 12, 28);   // the bench stop
}
// a curled shaving: a ribbon along a spiral from (x, y), growing to length len (px), curling up and back over itself
function curl(ctx, x, y, len, rot = 0, w = 8) {
  if (len < 2) return;
  const pts = []; let a = -Math.PI / 2 - .5 + rot, px = x, py = y; for (let s = 0; s <= len; s += 3) { pts.push([px, py]); const k = 1 / (10 + 26 * Math.exp(-s / 70)); a -= 3 * k; px += Math.cos(a) * 3; py += Math.sin(a) * 3; }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#a8763e'; ctx.lineWidth = w + 2; ctx.beginPath(); pts.forEach(([a1, b1], i) => (i ? ctx.lineTo(a1, b1) : ctx.moveTo(a1, b1))); ctx.stroke();
  ctx.strokeStyle = '#f0d3a0'; ctx.lineWidth = w; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,248,230,.6)'; ctx.lineWidth = 1.4; ctx.beginPath(); pts.forEach(([a1, b1], i) => (i ? ctx.lineTo(a1 - 1.5, b1 - 1.5) : ctx.moveTo(a1 - 1.5, b1 - 1.5))); ctx.stroke();
}
function pile(ctx) { const r = prng(33); for (let i = 0; i < 14; i++) curl(ctx, 620 + r() * 560, 606 - r() * 2, 30 + r() * 40, r() * 2, 6); for (let i = 0; i < 18; i++) curl(ctx, 360 + r() * 300, FLOOR + 10 + r() * 30, 26 + r() * 40, r() * 3, 6); }
// the hand plane: iron body, blade and lever cap, wooden tote (rear) and knob (front); xp = its back end, sole on the board
function plane(ctx, xp) {
  const y = 606;
  ctx.fillStyle = '#262a34'; ctx.beginPath(); ctx.moveTo(xp, y); ctx.lineTo(xp + 125, y); ctx.lineTo(xp + 125, y - 12); ctx.lineTo(xp + 117, y - 19); ctx.lineTo(xp + 8, y - 19); ctx.lineTo(xp, y - 12); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(160,175,205,.55)'; ctx.fillRect(xp + 6, y - 19, 112, 2.2); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(xp, y - 3, 125, 3);
  ctx.fillStyle = '#4c5363'; ctx.beginPath(); ctx.moveTo(xp + 50, y - 19); ctx.lineTo(xp + 40, y - 52); ctx.lineTo(xp + 60, y - 56); ctx.lineTo(xp + 68, y - 19); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(200,210,230,.5)'; ctx.fillRect(xp + 44, y - 50, 3, 28);
  ctx.fillStyle = '#7b3f1d'; const tote = new Path2D(); tote.moveTo(xp + 6, y - 19); tote.bezierCurveTo(xp + 2, y - 36, xp + 12, y - 54, xp + 26, y - 60); tote.lineTo(xp + 35, y - 58); tote.bezierCurveTo(xp + 29, y - 48, xp + 27, y - 34, xp + 32, y - 19); tote.closePath(); ctx.fill(tote);
  ctx.fillStyle = 'rgba(255,200,150,.25)'; ctx.fillRect(xp + 24, y - 58, 8, 3);
  ctx.fillStyle = '#7b3f1d'; ctx.beginPath(); ctx.ellipse(xp + 104, y - 31, 9, 12, 0, 0, TAU); ctx.fill(); ctx.fillRect(xp + 100, y - 22, 8, 4);
  ctx.fillStyle = 'rgba(255,200,150,.3)'; ctx.beginPath(); ctx.ellipse(xp + 101, y - 36, 3, 5, 0, 0, TAU); ctx.fill();
}
function lamp(ctx, Z) {
  ctx.strokeStyle = '#0d0a08'; ctx.lineWidth = Math.max(2, 3); ctx.beginPath(); ctx.moveTo(B[0], -300); ctx.lineTo(B[0], 252); ctx.stroke();
  ctx.fillStyle = '#1f3a2c'; ctx.beginPath(); ctx.moveTo(B[0] - 14, 250); ctx.lineTo(B[0] + 14, 250); ctx.lineTo(B[0] + 62, 300); ctx.lineTo(B[0] - 62, 300); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(160,200,170,.35)'; ctx.beginPath(); ctx.moveTo(B[0] - 10, 252); ctx.lineTo(B[0] - 4, 252); ctx.lineTo(B[0] - 40, 296); ctx.lineTo(B[0] - 50, 296); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#efe6d4'; ctx.fillRect(B[0] - 63, 297, 126, 4);
}

// ---------------------------------------------------------------- the frame
export function shopTake(ctx, t, K) {
  const { Z, M } = shopCam(t, K), st = strokeAt(t, K), xp = planeX(st.p);
  ctx.save(); ctx.setTransform(M[0], 0, 0, M[3], M[4], M[5]);
  room(ctx, t); bench(ctx); pile(ctx); plane(ctx, xp);
  // the shavings of the two strokes: the first drops onto the bench, the second curls on "working" and then flies
  const [a1, b1, a2, b2] = K.strokes;
  if (t > a1) { const g1 = clamp((t - a1) / (b1 - a1)), dr = sstep(b1, b1 + .3, t); curl(ctx, planeX(Math.min(1, g1 > 0 ? cio(g1) : 0)) + 64 - dr * 40, 588 + 16 * dr, 70 * g1, dr * 1.2, 7); }
  const g2 = clamp((t - a2) / (b2 - a2));
  if (t > a2 && t < K.fly0) curl(ctx, xp + 64, 588, 150 * g2, 0, 8);
  lamp(ctx, Z);
  ctx.restore();
  // the winner (figure in screen space at scale S·Z): hips ride with the plane, feet planted, both hands on the plane
  if (Z < 3.5) {
    const hipW = [420 + 50 * st.p, 690 + 26 * st.p], hp = at(M, hipW[0], hipW[1]), s = S * Z, o = { t, seed: 31 };
    const ankY = (FLOOR - 4.8 * S - hipW[1]) / S, legs = [[490, 0], [375, 1]].map(([ax, i]) => legIK(i ? -4 : 4, 0, (ax - hipW[0]) / S, ankY));
    const pose = { hip: [legs[0].a, legs[1].a], kn: [legs[0].k, legs[1].k], ft: [0, legs[1].a < -.25 ? .25 : 0], lean: .3 + .2 * st.p, head: .3, hair: 'grey', coat: false, thigh: undefined };
    for (const k of Object.keys(pose)) if (pose[k] === undefined) delete pose[k];
    const tote = at(M, xp + 22, 572), knob = at(M, xp + 104, 580), base = { ...pose, sh: [0, 0], el: [0, 0] };
    const a0 = reachArm(hp[0], hp[1], s, base, 0, false, o, tote), a1r = reachArm(hp[0], hp[1], s, base, 1, false, o, knob);
    pose.sh = [a0.sh, a1r.sh]; pose.el = [a0.el, a1r.el]; pose.lock = [true, true];
    const lampS = at(M, B[0], B[1]);
    figure(ctx, hp[0], hp[1], s, pose, { t, seed: 31, dress: DRESS, accent: '#6b7a4a', accentPart: 'coat', light: { x: lampS[0] - hp[0], y: lampS[1] - hp[1], col: '#ffcf8a', a: .5 }, rim: rgba('#9fb6e8', .55), rimSide: 1, shadow: true, hatch: s > .6 });
  }
  // the lamp's light in the air and on the bench, then the bulb itself (opaque: at the start it IS the dot's amber, filling the frame)
  const bs = at(M, B[0], B[1]);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const pool = at(M, 820, 640); glowAt(ctx, pool[0], pool[1], 520 * Z, '#ffcf8a', .16, '#ffe2b0');
  glowAt(ctx, bs[0], bs[1], 260 * Z, '#ffcf8a', .32, '#fff1d6');
  ctx.restore();
  amberFill(ctx, bs[0], bs[1], RB * Z);
  // 182.6: one shaving flies up at the lens, uncurls and lies flat across the frame: its wood fills the frame (→ the chart)
  if (t >= K.fly0) flyShaving(ctx, t, K, at(M, planeX(1) + 64, 588));
}
function flyShaving(ctx, t, K, mouth) {
  const u = clamp((t - K.fly0) / (K.chart0 - K.fly0)), e = (Math.pow(2, 6 * u) - 1) / 63, M0 = chartM0();
  const g = mix(.045, 1, e), c = [mix(mouth[0], W / 2, cio(u)), mix(mouth[1], H / 2, cio(u))], rot = mix(-1.1, 0, cio(u));
  // G: screen-space similarity applied after M0 (sheet → screen at chart0); G(1) = identity
  const cr = Math.cos(rot) * g, sr = Math.sin(rot) * g, G = [cr, sr, -sr, cr, c[0] - (cr * W / 2 - sr * H / 2), c[1] - (sr * W / 2 + cr * H / 2)];
  const Mf = [G[0] * M0[0] + G[2] * M0[1], G[1] * M0[0] + G[3] * M0[1], G[0] * M0[2] + G[2] * M0[3], G[1] * M0[2] + G[3] * M0[3], G[0] * M0[4] + G[2] * M0[5] + G[4], G[1] * M0[4] + G[3] * M0[5] + G[5]];
  // the ribbon in sheet coordinates round WMID: it uncurls (the tangent turns less and less) and widens
  const Lr = 1125, kap = 1 - sstep(.05, .72, u), wr = mix(60, 427, sstep(.1, 1, u)), n = 80, cl = [];
  let a = 0, x = 0, y = 0; const raw = [];
  for (let i = 0; i <= n; i++) { raw.push([x, y]); const s = i / n; a += kap * 2.6 * TAU / n * s * s * 3; x += Math.cos(a) * Lr / n; y -= Math.sin(a) * Lr / n; }
  const mid = raw[n >> 1]; for (const [px, py] of raw) cl.push([WMID[0] - Lr / 2 + px - (mid[0] - Lr / 2) + 0, WMID[1] + py - mid[1]]);
  const L = [], R = []; for (let i = 0; i <= n; i++) { const p0 = cl[Math.max(0, i - 1)], p1 = cl[Math.min(n, i + 1)], dx = p1[0] - p0[0], dy = p1[1] - p0[1], m = Math.hypot(dx, dy) || 1, taper = Math.min(1, Math.sin(Math.PI * (i / n)) * 3 + .15), hw = wr / 2 * taper; L.push([cl[i][0] - dy / m * hw, cl[i][1] + dx / m * hw]); R.push([cl[i][0] + dy / m * hw, cl[i][1] - dx / m * hw]); }
  const rib = path2(L.concat(R.reverse()));
  ctx.save(); ctx.setTransform(Mf[0], Mf[1], Mf[2], Mf[3], Mf[4], Mf[5]);
  ctx.fillStyle = '#e9c995'; ctx.fill(rib); ctx.strokeStyle = '#a8763e'; ctx.lineWidth = 6 / g; ctx.stroke(rib);
  ctx.clip(rib); ctx.setTransform(1, 0, 0, 1, 0, 0);
  woodSurface(ctx, Mf, t, 0);
  ctx.restore();
}
