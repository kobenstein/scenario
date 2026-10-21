// c15 · the sets along the near strip of the panorama (layer k .45, physical units: a person ≈ 18.9 units, 1 m ≈ 11 units):
// the wheat field with the gleaners · the landlord's lit window (ledger, coins) · the factory gate (time cards, punch clock) ·
// the low cottage (the sleeper) · the old town and its tower (the scholar at the telescope; ★ every window lights) ·
// Lagos at dusk (the cook, the pot, the steam) · the Andes terraces (the farmer on his hoe, the alpaca).
import { W, H, clamp, mix, prng } from '../engine.mjs';
import { figure, POSES, reachArm } from './figure.mjs';
import { LC, toS, toW, setL, viewB, HZ, hash, noise, fbm, rgba, mixH, shadeH, hatchL, poly, line, vg, hg, rg, glowAt, smt, span, eoX } from './v2_c15_kit.mjs';
import { ghost, workPose, POSE, mixPose } from './v2_c15_ghost.mjs';

const TAU = Math.PI * 2, INK = '#130f24', CREAM = '#f3efe2', AMB = '#ffb35c', AMBH = '#fff1d6';
export const SK = .45, PU = 18.9;                 // the strip's depth and a person's height in its units
const PERU0 = 2890;
export const G = (x) => HZ - 30 + 2.2 * Math.sin(x * .031) + (x > PERU0 ? -7 * Math.min(8, Math.floor((x - PERU0) / 15)) : 0);
// screen ↔ strip helpers for the take: the camera that shows strip point (X, Y) at screen (sx, sy) with zoom z
export function frameOn(X, Y, sx, sy, z, ty = 0) { const s = SK * (1 - 1 / z), px = X - (sx - 960) / z, py = Y - (sy - 540 - ty) / z; return { x: 960 + SK * (px - 960), y: 520 + SK * (py - 520), s, ty }; }

// ---------------------------------------------------------------- places on the strip (x, y in strip units)
export const P = {
  glean: [2372, 2398, 2421], house: [2440, 2477], win: { x: 2450, y: 0, w: 14, h: 14 }, gate: [2480, 2507], wall: [2507, 2531],
  rack: { x: 2510, w: 9.5, h: 13 }, clock: { x: 2522, w: 6.4, h: 9 }, cot: [2537, 2569], town: [2582, 2735], tower: 2648,
  lagos: [2760, 2872], cook: 2806, peru: [2890, 3010], farmer: 2936, alpaca: 2952,
};
P.win.y = G(P.win.x) - 25;

// ---------------------------------------------------------------- the ground of the strip (fields, a path) and its back edge
function ground(ctx, L, x0, x1, n) {
  const step = Math.max(.4, 6 / L.z), pts = [];
  for (let x = x0; x <= x1 + step; x += step) pts.push([x, G(x)]);
  const [, by] = toW(L, 0, H + 40);
  ctx.beginPath(); ctx.moveTo(x0, by); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(x1 + step, by); ctx.closePath();
  ctx.fillStyle = vg(ctx, G(x0) - 4, by, [[0, mixH('#6a5240', '#2a2440', n)], [.15, mixH('#4a3a34', '#1c1a34', n)], [1, '#0e0c20']]); ctx.fill();
  ctx.save(); ctx.clip(); hatchL(ctx, [x0, G(x0) - 80, x1, by], L.z, { ang: .05, gap: 1.4, a: .25, seed: 21 }); ctx.restore();
  ctx.strokeStyle = rgba('#d8c8b8', .18); ctx.lineWidth = 1 / L.z; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
}

// ---------------------------------------------------------------- the wheat field and the gleaners (harvest)
function stalks(ctx, t, L, x0, x1, gy, hgt, col, ear, seed, sway) {
  const sp = .55; ctx.lineWidth = Math.max(.12, .9 / L.z); ctx.strokeStyle = col; ctx.beginPath();
  const E = [];
  for (let x = x0; x < x1; x += sp) {
    const r = hash(x * 3.7 + seed), h = hgt * (.82 + .3 * r), w = sway * (Math.sin(t * 1.3 + x * .35) * .6 + noise(x * .2 + t * .7) * .4), bx = x + (r - .5) * .4;
    const tx = bx + w + (r - .5) * 1.2, ty = gy - h; ctx.moveTo(bx, gy); ctx.quadraticCurveTo(bx + w * .3, gy - h * .5, tx, ty); E.push([tx, ty, w * .15 + (r - .5) * .5]);
  }
  ctx.stroke();
  ctx.fillStyle = ear; ctx.beginPath();
  for (const [x, y, a] of E) { ctx.moveTo(x + .3, y); ctx.ellipse(x, y - .8, .38, 1.15, a, 0, TAU); }
  ctx.fill();
}
function wheatSet(ctx, t, L, o) {
  const gl = o.glow ?? 0, n = o.night ?? 1, x0 = 2335, x1 = 2440, gy = G(2400);
  const lit = mixH('#7a6448', '#e2b46a', gl), dark = mixH('#3a3040', '#8a6438', gl);
  // stooks in the back
  for (const sx of [2342, 2356, 2430]) { const sy = G(sx) - 1.5; ctx.fillStyle = mixH('#4a3c38', '#b48a50', gl * .8); ctx.beginPath(); ctx.moveTo(sx - 3.4, sy); ctx.lineTo(sx - .6, sy - 11); ctx.lineTo(sx + .6, sy - 11); ctx.lineTo(sx + 3.4, sy); ctx.closePath(); ctx.fill(); ctx.strokeStyle = rgba(INK, .4); ctx.lineWidth = .7 / L.z; ctx.beginPath(); for (let i = -3; i <= 3; i++) { ctx.moveTo(sx + i * .45, sy); ctx.lineTo(sx + i * .12, sy - 10.5); } ctx.stroke(); ctx.fillStyle = mixH('#2a2232', '#6a4a30', gl); ctx.fillRect(sx - 2.2, sy - 7.2, 4.4, .9); }
  stalks(ctx, t, L, x0, x1, gy - 1.2, 9.5, dark, dark, 1, .25);
  // the gleaners: bent, sickles moving, the last light of the day on their backs
  const sc = L.z * PU / 100, warm = o.warm;
  P.glean.forEach((gx, i) => {
    const [X, Y] = toS(L, gx, G(gx) - .6), ph = t * (.78 + .09 * i) + i * .37;
    ghost(ctx, X, Y, sc, { ...workPose(i === 1 ? 'glean' : 'sickle', ph, { robe: i === 1 ? 'ankle' : 'knee' }), hat: ['brim', 'scarf', 'cap'][i] }, { t, seed: 40 + i, dir: i === 2 ? -1 : 1, props: i === 1 ? [] : [{ kind: 'sickle' }], a: .95, fill: .09, warm, r: Math.max(.9, sc * .55), pitch: Math.max(3, sc * 3) });
  });
  // the front rows (in front of the gleaners' legs)
  stalks(ctx, t, L, x0, x1, gy + 1.5, 8.5, lit, mixH('#9a7a50', '#ffd890', gl), 2, .3);
  stalks(ctx, t, L, x0 - 4, x1 + 2, gy + 4.5, 7.5, mixH('#5a4838', '#c8964e', gl), mixH('#806040', '#f0c070', gl), 3, .35);
}

// ---------------------------------------------------------------- the landlord's lit window: the open ledger, a coin laid on the stack (rent)
function stoneWall(ctx, L, x0, x1, y0, y1, col, n) {
  ctx.fillStyle = vg(ctx, y0, y1, [[0, shadeH(col, .08)], [1, shadeH(col, -.25)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  ctx.strokeStyle = rgba(INK, .45); ctx.lineWidth = .8 / L.z; ctx.beginPath();
  let row = 0; for (let y = y1; y > y0; y -= 2.1, row++) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); for (let x = x0 + (row % 2) * 1.7 + hash(row) * 1.2; x < x1; x += 3.4 + hash(row * 3 + x) * 1.2) { ctx.moveTo(x, y); ctx.lineTo(x, y - 2.1); } }
  ctx.stroke(); hatchL(ctx, [x0, y0, x1, y1], L.z, { ang: .95, gap: 1.1, a: .16, seed: 31 }); ctx.restore();
}
function houseSet(ctx, t, L, A, o) {
  const [x0, x1] = P.house, gy = G((x0 + x1) / 2), top = gy - 36, n = o.night ?? 1, w = P.win;
  stoneWall(ctx, L, x0, x1, top, gy + 1, mixH('#8a7468', '#3a3048', n), n);
  // roof
  ctx.fillStyle = mixH('#5a3a34', '#241c30', n); ctx.beginPath(); ctx.moveTo(x0 - 2.5, top + .5); ctx.lineTo((x0 + x1) / 2, top - 12); ctx.lineTo(x1 + 2.5, top + .5); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(INK, .5); ctx.lineWidth = .7 / L.z; ctx.beginPath(); for (let y = top; y > top - 13; y -= 1.3) { ctx.moveTo(x0 - 3, y); ctx.lineTo(x1 + 3, y); } ctx.stroke(); ctx.restore();
  // the window: deep reveal, warm lamplight inside, the ledger on the desk, coins
  const { x, y, w: ww, h: wh } = w;
  ctx.fillStyle = '#1a1018'; ctx.fillRect(x - 1.2, y - 1.2, ww + 2.4, wh + 2.6);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, ww, wh); ctx.clip();
  ctx.fillStyle = vg(ctx, y, y + wh, [[0, '#7a4a2a'], [.55, '#c47a3a'], [1, '#5a3420']]); ctx.fillRect(x, y, ww, wh);
  const lx = x + 3.2, ly = y + 6.2; glowAt(ctx, lx, ly, 9, '#ffcf86', .55);
  // shelf with books on the back wall
  ctx.fillStyle = '#4a2a1a'; ctx.fillRect(x + 6, y + 2.6, 7.4, .5); for (let i = 0; i < 9; i++) { ctx.fillStyle = ['#6a2a22', '#3a4a5a', '#5a4a2a', '#2a3a2a'][i % 4]; ctx.fillRect(x + 6.3 + i * .78, y + 2.6 - 1.8 - (i % 3) * .15, .62, 1.8 + (i % 3) * .15); }
  // desk top (seen from a little above) and the open ledger
  const dy = y + 9.2; ctx.fillStyle = '#3a2216'; ctx.beginPath(); ctx.moveTo(x - 1, dy); ctx.lineTo(x + ww + 1, dy); ctx.lineTo(x + ww + 1, y + wh); ctx.lineTo(x - 1, y + wh); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5a3420'; ctx.beginPath(); ctx.moveTo(x - 1, dy); ctx.lineTo(x + ww + 1, dy); ctx.lineTo(x + ww + 1, dy + 1.4); ctx.lineTo(x - 1, dy + 1.4); ctx.fill();
  const bx = x + 4.2, bw = 7.6, by = dy - .9, bh = 3.6;   // ledger: two pages in perspective
  ctx.fillStyle = '#e8d8b8'; ctx.beginPath(); ctx.moveTo(bx + .6, by); ctx.lineTo(bx + bw / 2, by + .35); ctx.lineTo(bx + bw - .6, by); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw / 2, by + bh + .3); ctx.lineTo(bx, by + bh); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#8a6a4a', .8); ctx.lineWidth = .5 / L.z; ctx.beginPath(); ctx.moveTo(bx + bw / 2, by + .35); ctx.lineTo(bx + bw / 2, by + bh + .3); ctx.stroke();
  ctx.strokeStyle = rgba('#5a4a6a', .7); ctx.lineWidth = .35 / L.z; ctx.beginPath();
  for (let i = 1; i < 7; i++) { const q = i / 7, yy = by + .3 + q * (bh - .4); ctx.moveTo(bx + .5 + q * -.4, yy); ctx.lineTo(bx + bw / 2 - .3, yy + .06); ctx.moveTo(bx + bw / 2 + .3, yy + .06); ctx.lineTo(bx + bw - .5 + q * .4, yy); }
  ctx.stroke();
  // scribbled entries (unreadable) + a red rule
  ctx.strokeStyle = rgba('#3a2a4a', .75); ctx.lineWidth = .28 / L.z; ctx.beginPath();
  for (let i = 1; i < 7; i++) { const yy = by + .3 + i / 7 * (bh - .4) - .2; for (const [a0, a1] of [[bx + .6, bx + 2.4], [bx + 2.8, bx + 3.4], [bx + bw / 2 + .5, bx + bw / 2 + 2.2], [bx + bw - 1.4, bx + bw - .7]]) { let xx = a0; ctx.moveTo(xx, yy); while (xx < a1) { xx += .22; ctx.lineTo(xx, yy - .12 * Math.abs(Math.sin(xx * 9 + i))); } } }
  ctx.stroke(); ctx.strokeStyle = rgba('#a03a2a', .7); ctx.beginPath(); ctx.moveTo(bx + bw - 1.7, by + .2); ctx.lineTo(bx + bw - 1.6, by + bh - .1); ctx.stroke();
  // inkwell and quill
  ctx.fillStyle = '#141018'; ctx.fillRect(x + 1.2, dy - 1.4, 1.4, 1.3); ctx.strokeStyle = '#e8e0d0'; ctx.lineWidth = .3 / L.z; ctx.beginPath(); ctx.moveTo(x + 1.9, dy - 1.2); ctx.quadraticCurveTo(x + 1.2, dy - 4.2, x + .4, dy - 5); ctx.stroke();
  // oil lamp
  ctx.fillStyle = '#8a6a3a'; ctx.fillRect(lx - .6, dy - 1.6, 1.2, 1.6); ctx.fillStyle = rgba('#fff4dc', .9); ctx.beginPath(); ctx.ellipse(lx, dy - 2.6, .45, .9 + .08 * Math.sin(t * 9), 0, 0, TAU); ctx.fill(); glowAt(ctx, lx, dy - 2.6, 3, '#ffd28a', .7);
  // the coins: a stack on the right page; on "rent" one more is laid on it, then another
  const cx = bx + bw * .72, cyb = by + bh * .62, drops = [A.rent + .02, A.rent + .4];
  let nC = 5; const fly = [];
  for (const d of drops) { const u = span(t, d - .22, d); if (t >= d) nC++; else if (u > 0) fly.push(u); }
  for (let i = 0; i < nC; i++) coin(ctx, cx, cyb - i * .34, L, i === nC - 1 && t < drops[1] + .3 && t > drops[0] ? clamp(1 - (t - (t > drops[1] ? drops[1] : drops[0])) / .25) : 0);
  for (const u of fly) coin(ctx, cx + (1 - u) * 1.2, cyb - nC * .34 - (1 - u * u) * 4.5, L, 0);
  // a second short stack
  for (let i = 0; i < 3; i++) coin(ctx, cx - 1.9, cyb + .5 - i * .34, L, 0);
  ctx.restore();
  // window frame: mullion, transom, sill
  ctx.fillStyle = '#2a1c22'; ctx.fillRect(x + ww / 2 - .25, y, .5, wh * .62); ctx.fillRect(x, y + wh * .31, ww, .45); ctx.fillStyle = mixH('#9a8478', '#4a4058', n); ctx.fillRect(x - 1.8, y + wh + .1, ww + 3.6, 1.2);
  glowAt(ctx, x + ww / 2, y + wh / 2, 22, AMB, .18);
}
function coin(ctx, x, y, L, flash) {
  ctx.fillStyle = '#7a5a1a'; ctx.beginPath(); ctx.ellipse(x, y + .12, 1.05, .42, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = flash > 0 ? mixH('#e8b84a', '#fff4c8', flash) : '#e0ae44'; ctx.beginPath(); ctx.ellipse(x, y, 1.05, .4, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba('#7a5a1a', .9); ctx.lineWidth = .18 / L.z; ctx.beginPath(); ctx.ellipse(x, y, .72, .26, 0, 0, TAU); ctx.stroke();
  if (flash > 0) glowAt(ctx, x, y, 2.4, '#fff1d6', .5 * flash);
}

// ---------------------------------------------------------------- the factory gate: the time-card rack, the punch clock (the next shift)
function brick(ctx, L, x0, x1, y0, y1, n) {
  ctx.fillStyle = vg(ctx, y0, y1, [[0, mixH('#8a4a3a', '#3a2232', n)], [1, mixH('#5a2e26', '#22162a', n)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); ctx.strokeStyle = rgba('#120a14', .55); ctx.lineWidth = .6 / L.z; ctx.beginPath();
  let r = 0; for (let y = y1; y > y0; y -= .9, r++) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); for (let x = x0 + (r % 2) * 1.1; x < x1; x += 2.2) { ctx.moveTo(x, y); ctx.lineTo(x, y - .9); } }
  ctx.stroke(); hatchL(ctx, [x0, y0, x1, y1], L.z, { ang: 1.0, gap: 1, a: .12, seed: 7 }); ctx.restore();
}
function gateSet(ctx, t, L, A, o) {
  const n = o.night ?? 1, [g0, g1] = P.gate, [w0, w1] = P.wall, gy = G(2505), top = gy - 40;
  brick(ctx, L, w0, w1, gy - 30, gy + 1, n);
  ctx.fillStyle = mixH('#5a3a32', '#20162a', n); ctx.fillRect(w0 - .5, gy - 31.5, w1 - w0 + 1, 1.6);
  // pillars and the iron gate (closed): bars, a cross rail, an arch with a blank sign
  for (const px of [g0, g1 - 4]) { brick(ctx, L, px, px + 4, top, gy + 1, n); ctx.fillStyle = mixH('#9a8a80', '#40384a', n); ctx.fillRect(px - .6, top - 1.4, 5.2, 1.6); }
  ctx.strokeStyle = '#0e0a14'; ctx.lineWidth = .55; ctx.beginPath();
  for (let x = g0 + 5; x < g1 - 4.5; x += 1.3) { ctx.moveTo(x, gy); ctx.lineTo(x, gy - 27 - 3 * Math.sin(Math.PI * (x - g0 - 4) / (g1 - g0 - 8))); }
  ctx.moveTo(g0 + 4, gy - 13); ctx.lineTo(g1 - 4, gy - 13); ctx.moveTo(g0 + 4, gy - 24); ctx.lineTo(g1 - 4, gy - 24); ctx.stroke();
  ctx.strokeStyle = '#0e0a14'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(g0 + 4, top + 2); ctx.quadraticCurveTo((g0 + g1) / 2, top - 6, g1 - 4, top + 2); ctx.stroke();
  ctx.fillStyle = mixH('#4a4048', '#1e1a28', n); ctx.fillRect((g0 + g1) / 2 - 7, top - 4.8, 14, 3); ctx.strokeStyle = rgba(CREAM, .3); ctx.lineWidth = .35 / L.z; ctx.beginPath(); for (let i = 0; i < 5; i++) { const xx = (g0 + g1) / 2 - 5.5 + i * 2.4; ctx.moveTo(xx, top - 3.3); ctx.lineTo(xx + 1.6, top - 3.3); } ctx.stroke();
  // the lamp on a bracket over the clock: the hero light of the shot
  const lx = w0 + 12, ly = gy - 28.5; ctx.strokeStyle = '#1a1420'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(w0 + 9, gy - 30); ctx.lineTo(lx, ly - 1.4); ctx.stroke();
  ctx.fillStyle = '#2a2230'; ctx.beginPath(); ctx.moveTo(lx - 1.4, ly - 1.4); ctx.lineTo(lx + 1.4, ly - 1.4); ctx.lineTo(lx + 1, ly + 1); ctx.lineTo(lx - 1, ly + 1); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff1d6'; ctx.fillRect(lx - .7, ly - .9, 1.4, 1.5);
  glowAt(ctx, lx, ly, 26, AMB, .32); glowAt(ctx, lx, ly, 6, AMBH, .5);
  // the rack: two columns of slots, a card in each (number + ruled lines), seen from the front
  const R = P.rack, ry = gy - 25, rk = R.x;
  ctx.fillStyle = '#3a2c24'; ctx.fillRect(rk - .4, ry - .4, R.w + .8, R.h + .8); ctx.fillStyle = '#5a4434'; ctx.fillRect(rk, ry, R.w, R.h);
  const pick = { col: 1, row: 2 };
  for (let c = 0; c < 2; c++) for (let r = 0; r < 4; r++) {
    const sx = rk + .5 + c * 4.6, sy = ry + .6 + r * 3.1;
    if (!(c === pick.col && r === pick.row && t > A.shift - .55 && t < A.shiftE + .35)) card(ctx, L, sx + .3, sy - 1.6, 3.4, 4.2, r * 2 + c, 0);
    ctx.fillStyle = '#2a1e18'; ctx.fillRect(sx, sy + 1.6, 4.2, .9);
  }
  // the punch clock: a wooden case, a round dial, the slot on top; the needle jumps on the punch
  const K = P.clock, kx = K.x, ky = gy - 26;
  ctx.fillStyle = '#4a3222'; ctx.fillRect(kx, ky, K.w, K.h); ctx.fillStyle = '#6a4a30'; ctx.fillRect(kx + .3, ky + .3, K.w - .6, K.h - .6);
  ctx.fillStyle = '#e8dcc4'; ctx.beginPath(); ctx.arc(kx + K.w / 2, ky + 3.1, 2.3, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2a2018'; ctx.lineWidth = .25; ctx.stroke();
  ctx.lineWidth = .15; ctx.beginPath(); for (let i = 0; i < 12; i++) { const q = i / 12 * TAU; ctx.moveTo(kx + K.w / 2 + Math.cos(q) * 1.9, ky + 3.1 + Math.sin(q) * 1.9); ctx.lineTo(kx + K.w / 2 + Math.cos(q) * 2.15, ky + 3.1 + Math.sin(q) * 2.15); } ctx.stroke();
  const punch = A.shift + .12, jolt = t > punch ? Math.exp(-(t - punch) * 18) * Math.sin((t - punch) * 70) : 0;
  const hand = -Math.PI / 2 + (t > punch ? .52 : 0) + .1 * Math.sin(t * .3);
  ctx.strokeStyle = '#1a1018'; ctx.lineWidth = .28; ctx.beginPath(); ctx.moveTo(kx + K.w / 2, ky + 3.1); ctx.lineTo(kx + K.w / 2 + Math.cos(hand) * 1.7, ky + 3.1 + Math.sin(hand) * 1.7); ctx.moveTo(kx + K.w / 2, ky + 3.1); ctx.lineTo(kx + K.w / 2 + Math.cos(hand * 12) * 1.2, ky + 3.1 + Math.sin(hand * 12) * 1.2); ctx.stroke();
  ctx.fillStyle = '#1a1018'; ctx.fillRect(kx + 1.2, ky - .35, K.w - 2.4, .6);
  ctx.fillStyle = '#2a1e18'; ctx.fillRect(kx + 1.6, ky + 6.4, K.w - 3.2, 1.5);   // the punch lever housing
  // the card on its way: out of the rack, into the slot, punched (clack), back up with the stamp
  const sx0 = rk + .5 + pick.col * 4.6 + .3, sy0 = ry + .6 + pick.row * 3.1 - 1.6, slx = kx + K.w / 2 - 1.7, sly = ky - 4.6;
  const a1 = span(t, A.shift - .55, A.shift - .12), a2 = span(t, A.shift - .12, punch), a3 = span(t, punch + .14, punch + .45), a4 = span(t, punch + .5, A.shiftE + .3);
  if (t > A.shift - .55 && t < A.shiftE + .35) {
    let cx, cy;
    const e1 = smt(a1); cx = mix(sx0, slx, e1); cy = mix(sy0, sly, e1) - Math.sin(Math.PI * e1) * 3;
    if (a2 > 0) cy = sly + 3.6 * smt(a2);
    if (a3 > 0) cy = sly + 3.6 - 3.6 * smt(a3);
    if (a4 > 0) { const e4 = smt(a4); cx = mix(slx, sx0, e4); cy = mix(sly, sy0, e4) - Math.sin(Math.PI * e4) * 3; }
    ctx.save(); if (a2 > 0 && a3 < 1) { ctx.beginPath(); ctx.rect(cx - 2, ky - 30, 8, 30 - .35 + 30); ctx.rect(cx - 2, ky - 30, 8, 29.65); ctx.clip(); }
    card(ctx, L, cx, cy + jolt * .15, 3.4, 4.2, 5, t > punch ? 1 : 0); ctx.restore();
  }
  // the ghost of the worker at the clock (half in the lamplight)
  const [GX, GY] = toS(L, kx + K.w + 4.2, gy - .3), sc = L.z * PU / 100;
  const pose = { ...POSE.stand, lean: .06, head: .15 + .1 * span(t, A.shift - .4, A.shift), sh: [mix(.25, 1.0, smt(span(t, A.shift - .7, A.shift - .2)) * (1 - smt(span(t, A.shiftE, A.shiftE + .4)))), -.04], el: [mix(.3, 1.2, smt(span(t, A.shift - .7, A.shift - .2)) * (1 - smt(span(t, A.shiftE, A.shiftE + .4)))), .2], hat: 'cap' };
  ghost(ctx, GX, GY, sc, pose, { t, seed: 77, dir: -1, a: .85, fill: .07, props: [{ kind: 'pail' }] });
}
function card(ctx, L, x, y, w, h, num, stamp) {
  ctx.fillStyle = '#d8ccb0'; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#c4b490'; ctx.fillRect(x, y, w, .7);
  ctx.strokeStyle = rgba('#6a5a7a', .7); ctx.lineWidth = .14; ctx.beginPath(); for (let i = 1; i < 6; i++) { ctx.moveTo(x + .3, y + .7 + i * .58); ctx.lineTo(x + w - .3, y + .7 + i * .58); } ctx.moveTo(x + w * .45, y + .7); ctx.lineTo(x + w * .45, y + h - .2); ctx.stroke();
  ctx.fillStyle = '#2a2030'; ctx.font = `600 ${.55}px Inter`; ctx.fillText(String(1040 + num * 7), x + .3, y + .55);
  if (stamp) { ctx.fillStyle = rgba('#b23a2a', .85); ctx.fillRect(x + .4, y + .7 + 3 * .58 - .38, w * .38, .32); ctx.fillRect(x + w * .52, y + .7 + 3 * .58 - .38, w * .36, .32); }
}

// ---------------------------------------------------------------- the low cottage, cut open: the sleeper with his head on his arms (wonder)
function cottageSet(ctx, t, L, A, o) {
  const n = o.night ?? 1, [x0, x1] = P.cot, gy = G((x0 + x1) / 2), wt = gy - 19, rt = gy - 33, cx = (x0 + x1) / 2;
  // back wall (inside), warm with candlelight
  const tx = x0 + 15, tyTop = gy - 8.2;
  ctx.fillStyle = vg(ctx, wt, gy, [[0, '#4a2e22'], [.6, '#7a4a2a'], [1, '#3a2218']]); ctx.fillRect(x0 + 1.2, wt, x1 - x0 - 2.4, gy - wt);
  ctx.save(); ctx.beginPath(); ctx.rect(x0 + 1.2, wt, x1 - x0 - 2.4, gy - wt); ctx.clip();
  hatchL(ctx, [x0, wt, x1, gy], L.z, { ang: .9, gap: .9, a: .2, seed: 4 });
  // a small dark window in the back wall, a shelf with a pot
  ctx.fillStyle = '#121022'; ctx.fillRect(x0 + 21, wt + 3.5, 4.5, 4.5); ctx.strokeStyle = '#3a2418'; ctx.lineWidth = .5; ctx.strokeRect(x0 + 21, wt + 3.5, 4.5, 4.5);
  ctx.fillStyle = '#3a2218'; ctx.fillRect(x0 + 4, wt + 5, 7, .45); ctx.fillStyle = '#5a3a2a'; ctx.beginPath(); ctx.ellipse(x0 + 6, wt + 4.1, 1.2, 1, 0, 0, TAU); ctx.fill();
  // floor
  ctx.fillStyle = '#2a1a16'; ctx.fillRect(x0, gy - 1.4, x1 - x0, 2);
  // the table and the stool
  ctx.fillStyle = '#4a2c1c'; ctx.fillRect(tx - 1, tyTop, 11, 1); ctx.fillRect(tx, tyTop + 1, .8, gy - tyTop - 1.2); ctx.fillRect(tx + 8.4, tyTop + 1, .8, gy - tyTop - 1.2);
  ctx.fillStyle = '#3a2216'; ctx.fillRect(tx - 6.2, gy - 5, 4, .8); ctx.fillRect(tx - 5.8, gy - 4.2, .6, 3.2); ctx.fillRect(tx - 3, gy - 4.2, .6, 3.2);
  // the candle: the hero light (small, flickering)
  const kx = tx + 7.2, ky = tyTop; ctx.fillStyle = '#e8dcc4'; ctx.fillRect(kx - .35, ky - 2.2, .7, 2.2); const fl = 1 + .12 * Math.sin(t * 11) + .06 * Math.sin(t * 23);
  ctx.fillStyle = '#fff4dc'; ctx.beginPath(); ctx.ellipse(kx, ky - 2.9, .32, .7 * fl, 0, 0, TAU); ctx.fill();
  glowAt(ctx, kx, ky - 2.9, 16 * fl, '#ffb35c', .42); glowAt(ctx, kx, ky - 2.9, 3, AMBH, .6);
  // the sleeper: sitting on the stool, folded over the table, head on his arms; he breathes slowly
  const sc = L.z * PU / 100, br = Math.sin(t * TAU / 4.6) * .02;
  const pose = { lean: 1.02 + br, head: .62, sh: [1.62, 1.5], el: [3.0, 2.9], hip: [1.45, 1.4], kn: [1.5, 1.45], ft: [0, 0], seat: true, hat: 0 };
  const [SX, SY] = toS(L, tx - 4.3, gy - 5.1);
  ghost(ctx, SX, SY, sc, pose, { t, seed: 88, dir: 1, a: .95, fill: .1, warm: { ...toSxy(L, kx, ky - 3), col: '#ffcf86', a: .9 }, r: Math.max(.9, sc * .55), pitch: Math.max(3, sc * 3) });
  ctx.restore();
  // walls (cut): the side walls and the cut edge of the front, thick stone
  ctx.fillStyle = mixH('#7a6a64', '#2c2640', n); ctx.fillRect(x0 - .6, wt - .5, 1.9, gy - wt + 1.5); ctx.fillRect(x1 - 1.3, wt - .5, 1.9, gy - wt + 1.5);
  ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = .6 / L.z; ctx.setLineDash([.6, .5]); ctx.beginPath(); ctx.moveTo(x0 + 1.3, gy); ctx.lineTo(x0 + 1.3, wt); ctx.lineTo(x1 - 1.3, wt); ctx.lineTo(x1 - 1.3, gy); ctx.stroke(); ctx.setLineDash([]);
  // the low thatched roof
  ctx.fillStyle = mixH('#7a6038', '#2e2630', n); ctx.beginPath(); ctx.moveTo(x0 - 3.5, wt + 1); ctx.quadraticCurveTo(x0 + 2, rt + 2, cx, rt); ctx.quadraticCurveTo(x1 - 2, rt + 2, x1 + 3.5, wt + 1); ctx.lineTo(x1 + 2.5, wt + 2.2); ctx.lineTo(x0 - 2.5, wt + 2.2); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(INK, .45); ctx.lineWidth = .5 / L.z; ctx.beginPath(); for (let x = x0 - 4; x < x1 + 4; x += .7) { ctx.moveTo(x, wt + 2.2); ctx.lineTo(x + (x - cx) * .08, rt - 1); } ctx.stroke(); ctx.restore();
  ctx.strokeStyle = rgba('#e8dcc8', .25); ctx.lineWidth = .7 / L.z; ctx.beginPath(); ctx.moveTo(x0 - 3.5, wt + 1); ctx.quadraticCurveTo(x0 + 2, rt + 2, cx, rt); ctx.quadraticCurveTo(x1 - 2, rt + 2, x1 + 3.5, wt + 1); ctx.stroke();
  glowAt(ctx, kx, ky - 2, 30, AMB, .1);
}
const toSxy = (L, x, y) => { const [X, Y] = toS(L, x, y); return { x: X, y: Y }; };

// ---------------------------------------------------------------- the old town and the tower window (the few); ★ every window lights
const TOWN = (() => {
  const r = prng(2718), hs = [];
  for (let x = P.town[0]; x < P.town[1];) {
    const w = 9 + r() * 9, h = 16 + r() * 22, kind = r() < .25 ? 'flat' : 'gable';
    if (Math.abs(x + w / 2 - P.tower) < 11) { x += 4; continue; }
    const wins = []; for (let fy = 0; fy < Math.floor(h / 8); fy++) for (let wx = 0; wx < Math.floor(w / 4.2); wx++) if (r() < .85) wins.push({ x: x + 1.8 + wx * 4.2, y: fy, d: r() });
    hs.push({ x, w, h, kind, wins, c: r(), dx: r() * 6 }); x += w + .6 + r() * 1.5;
  }
  return hs;
})();
function townSet(ctx, t, L, A, o) {
  const n = o.night ?? 1, star = o.star ?? 0, gy0 = G(P.tower), tx = P.tower;
  // the wave: every window lights from the tower outward (each over .35 s, smooth), bright at first then a steady warm glow
  const lightAt = (x, y, d) => { const dist = Math.hypot(x - tx, (y - (gy0 - 80)) * .5); return smt(clamp((star * 2.2 - dist / 70 - d * .25) / .5)); };
  // city wall in front, houses behind it
  for (const hs of TOWN) {
    const gy = G(hs.x + hs.w / 2) - 2, top = gy - hs.h;
    ctx.fillStyle = mixH('#5a4a50', '#1a1834', n * (.92 + .08 * hs.c)); ctx.fillRect(hs.x, top, hs.w, hs.h + 2);
    if (hs.kind === 'gable') { ctx.fillStyle = mixH('#4a3030', '#151228', n); ctx.beginPath(); ctx.moveTo(hs.x - .8, top + .3); ctx.lineTo(hs.x + hs.w / 2, top - hs.w * .45); ctx.lineTo(hs.x + hs.w + .8, top + .3); ctx.closePath(); ctx.fill(); }
    else { ctx.fillStyle = mixH('#4a3a40', '#16142a', n); ctx.fillRect(hs.x - .4, top - 1, hs.w + .8, 1.2); }
    ctx.strokeStyle = rgba(INK, .4); ctx.lineWidth = .5 / L.z; ctx.beginPath(); for (let y = gy; y > top; y -= 1.6) { ctx.moveTo(hs.x, y); ctx.lineTo(hs.x + hs.w, y); } ctx.stroke();
    for (const w of hs.wins) {
      const wy = gy - 5.5 - w.y * 8, u = lightAt(w.x, wy, w.d);
      ctx.fillStyle = u > .01 ? mixH('#0e0c1c', '#ffc070', u) : '#0e0c1c'; ctx.fillRect(w.x, wy, 2, 3.2);
      if (u > .02) glowAt(ctx, w.x + 1, wy + 1.6, 4.5, AMB, .45 * u);
    }
  }
  // the town wall with crenellations
  const wy0 = G(2600) - 9;
  ctx.fillStyle = mixH('#6a5a58', '#1e1c38', n); ctx.fillRect(P.town[0] - 2, wy0, P.town[1] - P.town[0] + 4, 12);
  ctx.beginPath(); for (let x = P.town[0] - 2; x < P.town[1] + 2; x += 3) ctx.rect(x, wy0 - 1.8, 1.6, 1.9); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(P.town[0] - 2, wy0, P.town[1] - P.town[0] + 4, 12); ctx.clip(); ctx.strokeStyle = rgba(INK, .45); ctx.lineWidth = .5 / L.z; ctx.beginPath(); let rr = 0; for (let y = wy0 + 12; y > wy0; y -= 1.5, rr++) { ctx.moveTo(P.town[0] - 2, y); ctx.lineTo(P.town[1] + 2, y); for (let x = P.town[0] + (rr % 2) * 1.4; x < P.town[1]; x += 2.8) { ctx.moveTo(x, y); ctx.lineTo(x, y - 1.5); } } ctx.stroke(); ctx.restore();
  // the tower: tall, a pointed roof, the one lit window high up (the scholar at the telescope)
  const tw = 14, tt = gy0 - 100, wx = tx - 5.5, wyy = gy0 - 88, ww = 11, wh = 12;
  ctx.fillStyle = vg(ctx, tt, gy0, [[0, mixH('#7a6a68', '#262446', n)], [1, mixH('#5a4a50', '#18162e', n)]]); ctx.fillRect(tx - tw / 2, tt, tw, gy0 - tt);
  ctx.save(); ctx.beginPath(); ctx.rect(tx - tw / 2, tt, tw, gy0 - tt); ctx.clip(); ctx.strokeStyle = rgba(INK, .45); ctx.lineWidth = .55 / L.z; ctx.beginPath(); let r2 = 0; for (let y = gy0; y > tt; y -= 1.7, r2++) { ctx.moveTo(tx - tw, y); ctx.lineTo(tx + tw, y); for (let x = tx - tw / 2 + (r2 % 2) * 1.5; x < tx + tw / 2; x += 3) { ctx.moveTo(x, y); ctx.lineTo(x, y - 1.7); } } ctx.stroke(); hatchL(ctx, [tx - tw, tt, tx + tw, gy0], L.z, { ang: 1.1, gap: 1, a: .2, seed: 9 }); ctx.restore();
  ctx.fillStyle = mixH('#4a3030', '#151228', n); ctx.beginPath(); ctx.moveTo(tx - tw / 2 - 1.4, tt + .4); ctx.lineTo(tx, tt - 22); ctx.lineTo(tx + tw / 2 + 1.4, tt + .4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixH('#9a8a80', '#3a3450', n); ctx.fillRect(tx - tw / 2 - 1.2, tt - .2, tw + 2.4, 1.3);
  ctx.fillRect(tx - tw / 2 - .8, wyy + wh + .3, tw + 1.6, 1);
  // the room behind the window
  ctx.fillStyle = '#140c14'; ctx.fillRect(wx - .9, wyy - .9, ww + 1.8, wh + 1.6);
  ctx.save(); ctx.beginPath(); ctx.moveTo(wx, wyy + wh); ctx.lineTo(wx, wyy + 3); ctx.quadraticCurveTo(wx + ww / 2, wyy - 1.5, wx + ww, wyy + 3); ctx.lineTo(wx + ww, wyy + wh); ctx.closePath(); ctx.clip();
  ctx.fillStyle = vg(ctx, wyy, wyy + wh, [[0, '#6a3a20'], [.6, '#b86e34'], [1, '#4a2818']]); ctx.fillRect(wx, wyy - 2, ww, wh + 2);
  // books on shelves behind
  for (let s2 = 0; s2 < 2; s2++) { const sy = wyy + 4 + s2 * 3.4; ctx.fillStyle = '#3a2014'; ctx.fillRect(wx, sy + 1.6, ww, .35); for (let i = 0; i < 14; i++) { ctx.fillStyle = ['#6a2a22', '#3a4a5a', '#7a5a2a', '#2a3a2a', '#5a3a4a'][(i + s2) % 5]; const hgt = 1.2 + .4 * hash(i + s2 * 9); ctx.fillRect(wx + .2 + i * .78, sy + 1.6 - hgt, .62, hgt); } }
  // the telescope on its tripod, aimed up and out to the stars; the scholar's ghost bent to the eyepiece
  const ex = wx + 6.4, ey = wyy + 6.2, ang = -2.45, len = 9.5, ox = ex + Math.cos(ang) * len, oy = ey + Math.sin(ang) * len;
  ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = .32; ctx.beginPath(); const mx = ex + Math.cos(ang) * 3.2, my = ey + Math.sin(ang) * 3.2; for (const d of [-2.2, 0, 2.2]) { ctx.moveTo(mx, my); ctx.lineTo(mx + d, wyy + wh + 1); } ctx.stroke();
  const sc = L.z * PU / 100, [SX, SY] = toS(L, ex + 3.9, wyy + wh + 6.6);
  ghost(ctx, SX, SY, sc, { lean: .35, head: .2, sh: [1.2, 1.05], el: [.55, .9], hip: [.05, -.05], kn: [.04, .02], ft: [0, 0], robe: 'ankle', hat: 'bun' }, { t, seed: 61, dir: -1, a: .95, fill: .12, warm: { x: SX - 400, y: SY - 600, col: '#ffd48a', a: .6 }, r: Math.max(.9, sc * .55), pitch: Math.max(3, sc * 3) });
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#3a2410'; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ox, oy); ctx.stroke();
  ctx.strokeStyle = '#c8943a'; ctx.lineWidth = 1.0; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ox, oy); ctx.stroke();
  ctx.strokeStyle = '#ffe2a0'; ctx.lineWidth = .25; ctx.beginPath(); ctx.moveTo(ex + .2, ey - .35); ctx.lineTo(ox + .2, oy - .35); ctx.stroke();
  ctx.strokeStyle = '#8a6020'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ox + Math.cos(ang) * -.3, oy + Math.sin(ang) * -.3); ctx.lineTo(ox, oy); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.restore();
  // mullion-less arch frame
  ctx.strokeStyle = mixH('#9a8a80', '#3a3450', n); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(wx, wyy + wh); ctx.lineTo(wx, wyy + 3); ctx.quadraticCurveTo(wx + ww / 2, wyy - 1.5, wx + ww, wyy + 3); ctx.lineTo(wx + ww, wyy + wh); ctx.stroke();
  glowAt(ctx, wx + ww / 2, wyy + wh / 2, 26, AMB, .2);
}

// ---------------------------------------------------------------- Lagos at dusk: the street, the danfo, the palms, the cook at her pot
function palm(ctx, L, x, gy, h, t, seed) {
  ctx.strokeStyle = '#1a1420'; ctx.lineWidth = 1.1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, gy); ctx.quadraticCurveTo(x + h * .12, gy - h * .55, x + h * .06, gy - h); ctx.stroke();
  ctx.strokeStyle = rgba('#3a2a30', .8); ctx.lineWidth = .4; ctx.beginPath(); for (let y = gy - 2; y > gy - h; y -= 1.4) { const q = (gy - y) / h, xx = x + h * .12 * 2 * q * (1 - q) + h * .06 * q * q; ctx.moveTo(xx - .5, y); ctx.lineTo(xx + .5, y - .3); } ctx.stroke();
  const cx = x + h * .06, cy = gy - h;
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * .42 + .05 * Math.sin(t * 1.1 + i + seed), Lf = h * (.42 + .1 * hash(i + seed)), ex = cx + Math.cos(a) * Lf, ey = cy + Math.sin(a) * Lf * .55 + Lf * .35 * Math.abs(Math.cos(a));
    ctx.strokeStyle = '#121018'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo((cx + ex) / 2, Math.min(cy, ey) - Lf * .25, ex, ey); ctx.stroke();
    ctx.lineWidth = .28; ctx.beginPath(); for (let k = 1; k < 12; k++) { const q = k / 12, px = mix(cx, ex, q), py = mix(cy, ey, q) - Lf * .25 * 4 * q * (1 - q) * .5; ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a + 1.3) * 2.2 * (1 - q * .6), py + 2 * (1 - q * .5)); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a - 1.3) * 2.2 * (1 - q * .6), py + 1.8 * (1 - q * .5)); } ctx.stroke();
  }
  ctx.lineCap = 'butt';
}
function lagosSet(ctx, t, L, A, o) {
  const [x0, x1] = P.lagos, gy = G(2810), n = o.night ?? 1;
  // dusk glow on the horizon behind Lagos (the sky there is still orange)
  // low buildings: two floors, flat roofs, signboards, shutters, a balcony
  const bs = [[x0 + 2, 16, 21], [x0 + 19, 14, 26], [x0 + 34, 18, 19], [x0 + 70, 15, 24], [x0 + 86, 20, 22]];
  for (const [bx, bw, bh] of bs) {
    const top = gy - bh; ctx.fillStyle = vg(ctx, top, gy, [[0, '#8a5a48'], [1, '#4a2e30']]); ctx.fillRect(bx, top, bw, bh);
    ctx.fillStyle = '#3a2428'; ctx.fillRect(bx - .5, top - .8, bw + 1, 1);
    ctx.fillStyle = '#d8b878'; ctx.fillRect(bx + 1.5, top + 2, bw - 3, 2.6); ctx.strokeStyle = rgba('#5a3a2a', .7); ctx.lineWidth = .3; ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(bx + 2.5 + i * (bw - 5) / 4, top + 3.3); ctx.lineTo(bx + 2.5 + i * (bw - 5) / 4 + 1.8, top + 3.3); } ctx.stroke();
    for (let wx = bx + 1.6; wx < bx + bw - 2.5; wx += 4) { ctx.fillStyle = hash(wx) < .5 ? '#ffc070' : '#2a1a20'; ctx.fillRect(wx, top + 6.5, 2.2, 3); if (hash(wx) < .5) glowAt(ctx, wx + 1.1, top + 8, 4, AMB, .25); }
    ctx.fillStyle = '#2a1a1e'; ctx.fillRect(bx + 1.5, gy - 8.5, bw - 3, 8.5); ctx.strokeStyle = rgba('#6a4a3a', .6); ctx.lineWidth = .3; ctx.beginPath(); for (let y = gy - 8; y < gy; y += .8) { ctx.moveTo(bx + 1.5, y); ctx.lineTo(bx + bw - 1.5, y); } ctx.stroke();
  }
  // awnings (corrugated) over the stalls
  for (const [ax, aw, c] of [[x0 + 18, 16, '#b84a32'], [x0 + 50, 18, '#3a6a8a'], [x0 + 88, 14, '#c88a2a']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(ax, gy - 12); ctx.lineTo(ax + aw, gy - 12); ctx.lineTo(ax + aw + 1.5, gy - 9.5); ctx.lineTo(ax - 1.5, gy - 9.5); ctx.closePath(); ctx.fill(); ctx.strokeStyle = rgba('#1a0e0e', .4); ctx.lineWidth = .25; ctx.beginPath(); for (let x = ax; x < ax + aw; x += .7) { ctx.moveTo(x, gy - 12); ctx.lineTo(x - .3, gy - 9.5); } ctx.stroke(); ctx.fillStyle = '#2a1a14'; ctx.fillRect(ax - 1, gy - 9.5, .4, 9.5); ctx.fillRect(ax + aw + .6, gy - 9.5, .4, 9.5); }
  // stalls: crates with tomatoes, peppers, a stack of baskets
  for (const [sx, c] of [[x0 + 52, '#c43a2a'], [x0 + 58, '#3a8a3a'], [x0 + 90, '#e0a020'], [x0 + 95, '#c43a2a']]) { ctx.fillStyle = '#5a3a24'; ctx.fillRect(sx, gy - 4.5, 4.5, 4.5); ctx.fillStyle = c; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(sx + .7 + (i % 3) * 1.5, gy - 4.6 - Math.floor(i / 3) * .9, .62, 0, TAU); ctx.fill(); } }
  // the danfo: yellow minibus with black stripes, parked on the right, lights on
  danfo(ctx, L, x0 + 66, gy, t);
  // palms
  palm(ctx, L, x0 + 12, gy, 42, t, 1); palm(ctx, L, x0 + 108, gy, 36, t, 5);
  // the cook's stall: a charcoal stove, the big pot, the steam, the cook stirring
  const cx = P.cook, px = cx + 7, py = gy - 6.4;
  ctx.fillStyle = '#2a1e1a'; ctx.beginPath(); ctx.moveTo(px - 4, gy); ctx.lineTo(px - 3, gy - 4.2); ctx.lineTo(px + 3, gy - 4.2); ctx.lineTo(px + 4, gy); ctx.closePath(); ctx.fill();
  glowAt(ctx, px, gy - 3.5, 7, '#ff8a3a', .55 + .1 * Math.sin(t * 7)); ctx.fillStyle = rgba('#ffb35c', .9); ctx.fillRect(px - 2.2, gy - 4.4, 4.4, .5);
  ctx.fillStyle = '#3a3438'; ctx.beginPath(); ctx.moveTo(px - 4.4, py - 3.6); ctx.lineTo(px + 4.4, py - 3.6); ctx.quadraticCurveTo(px + 4.7, py + 2.3, px, py + 2.2); ctx.quadraticCurveTo(px - 4.7, py + 2.3, px - 4.4, py - 3.6); ctx.fill();
  ctx.fillStyle = '#6a6470'; ctx.fillRect(px - 4.8, py - 4.1, 9.6, .7); ctx.strokeStyle = rgba('#c8c0c8', .5); ctx.lineWidth = .3; ctx.beginPath(); ctx.moveTo(px - 3.6, py - 3); ctx.quadraticCurveTo(px - 3.9, py + .8, px - 2, py + 1.6); ctx.stroke();
  // steam: soft wisps rising and curling (alive)
  for (let i = 0; i < 9; i++) { const ph = (t * .55 + i / 9) % 1, sx = px - 2.5 + 5 * hash(i * 3.1) + Math.sin(t * 1.3 + i) * 1.2 * ph, sy = py - 4.4 - ph * 16, r = 1.4 + ph * 3.2; ctx.fillStyle = rgba('#e8e0e8', .2 * Math.sin(Math.PI * ph)); ctx.beginPath(); ctx.ellipse(sx, sy, r, r * .75, 0, 0, TAU); ctx.fill(); }
  // the cook: stirring, then she pauses and looks up (lagos)
  const s = L.z * PU / 185, stop = smt(span(t, A.lagos - .05, A.lagos + .35)), lookU = smt(span(t, A.lagos + .15, A.lagos + .6));
  const ang = t * 3.2 * (1 - stop * .9), tip = [px + Math.cos(ang) * 1.6, py - 1.2 + Math.sin(ang) * .5];   // ladle tip circling in the pot
  const [HX, HY] = toS(L, cx, gy - PU * .5), hand = toS(L, tip[0] - 2.4, tip[1] - 6.2 + stop * 1.6);
  const pose = { ...POSES.stand, lean: .08 - .06 * lookU, head: .25 - .75 * lookU, sh: [.9, .3], el: [.6, .5] };
  const arm = reachArm(HX, HY, s, pose, 0, false, { t, seed: 3 }, hand);
  pose.sh = [arm.sh, .25]; pose.el = [arm.el, .55]; pose.lock = [true, false];
  const fig = figure(ctx, HX, HY, s, pose, { t, seed: 3, dress: { coat: '#c8642a', pants: '#3a2a4a', skin: '#6a4430', hair: '#14101a' }, accent: '#2a8a6a', accentPart: 'scarf', light: { x: toS(L, px, gy - 3)[0], y: toS(L, px, gy - 3)[1], col: '#ffb35c', a: .8 }, rim: '#ffb066', rimSide: 1 });
  // the ladle from her hand into the pot
  const hp = fig && fig.hand ? fig.hand(0) : hand; const [tX, tY] = toS(L, tip[0], tip[1]);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = '#6a4a30'; ctx.lineWidth = Math.max(1.2, L.z * .35); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hp[0], hp[1]); ctx.lineTo(tX, tY); ctx.stroke(); ctx.restore();
  // the pot's rim drawn again in front of the ladle
  setL(ctx, L); ctx.fillStyle = '#6a6470'; ctx.fillRect(px - 4.8, py - 4.1, 9.6, .7);
}
function danfo(ctx, L, x, gy, t) {
  const w = 22, h = 9.5, y = gy - 1.6;
  ctx.fillStyle = '#0c0a10'; for (const wx of [x + 4.5, x + w - 4.5]) { ctx.beginPath(); ctx.arc(wx, gy - 1.7, 1.8, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#e8b42a'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h + 2); ctx.quadraticCurveTo(x, y - h, x + 2, y - h); ctx.lineTo(x + w - 3.5, y - h); ctx.quadraticCurveTo(x + w - .5, y - h + .2, x + w, y - h + 4); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#141018'; ctx.fillRect(x, y - 3.6, w, .9); ctx.fillRect(x, y - 5.2, w, .45);
  ctx.fillStyle = '#2a3440'; for (let i = 0; i < 4; i++) ctx.fillRect(x + 1.4 + i * 4.3, y - h + 1.3, 3.5, 2.8); ctx.fillRect(x + w - 3.4, y - h + 1.3, 2.6, 3);
  ctx.fillStyle = rgba('#ffe8b0', .9); ctx.fillRect(x + w - .6, y - 2.5, .6, 1); glowAt(ctx, x + w + 1, y - 2, 6, '#ffd890', .4);
  ctx.strokeStyle = rgba('#5a4010', .6); ctx.lineWidth = .25; ctx.beginPath(); ctx.moveTo(x + 9.5, y - h + .5); ctx.lineTo(x + 9.5, y - .5); ctx.stroke();
}

// ---------------------------------------------------------------- Peru: terraces in the Andes, the farmer leaning on his hoe, an alpaca
function peruSet(ctx, t, L, A, o) {
  const [x0, x1] = P.peru;
  // terrace walls and fields (cold blue-green night light)
  for (let i = 0; i < 9; i++) {
    const sx = PERU0 + i * 15, gy = G(sx + 1);
    ctx.fillStyle = vg(ctx, gy - 7, gy + 1, [[0, '#4a6a5a'], [1, '#2a3a3e']]); ctx.fillRect(sx, gy - .2, 15.2, 7.4);
    ctx.fillStyle = '#5a6a6a'; ctx.fillRect(sx - .4, gy - .2, .9, 7.4);
    ctx.save(); ctx.beginPath(); ctx.rect(sx - .4, gy, 15.6, 7.2); ctx.clip(); ctx.strokeStyle = rgba('#0a1418', .55); ctx.lineWidth = .4 / L.z; ctx.beginPath(); let r = 0; for (let y = gy + 7.2; y > gy; y -= 1.4, r++) { ctx.moveTo(sx - .4, y); ctx.lineTo(sx + 15.2, y); for (let x = sx + (r % 2) * 1.2; x < sx + 15; x += 2.4 + hash(x + r) * .8) { ctx.moveTo(x, y); ctx.lineTo(x, y - 1.4); } } ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#5e8a6a'; ctx.fillRect(sx, gy - .9, 15.2, 1); ctx.strokeStyle = rgba('#a8d0b0', .35); ctx.lineWidth = .4 / L.z; ctx.beginPath(); for (let x = sx + .5; x < sx + 15; x += .9) { ctx.moveTo(x, gy - .9); ctx.lineTo(x + .2, gy - 2.2 - hash(x) * .8); } ctx.stroke();
  }
  // the alpaca: woolly body, long neck, banana ears, standing on the farmer's terrace
  const ax = P.alpaca, agy = G(ax) - .9, sw = Math.sin(t * 1.4) * .15;
  ctx.fillStyle = '#d8ccb4'; ctx.beginPath(); ctx.ellipse(ax, agy - 8.2, 4.6, 2.9, 0, 0, TAU); ctx.fill();
  for (const lx of [ax - 3, ax - 1.8, ax + 2, ax + 3.1]) { ctx.fillStyle = '#b8a888'; ctx.fillRect(lx - .45, agy - 6.5, .9, 6.5); ctx.fillStyle = '#3a3030'; ctx.fillRect(lx - .5, agy - .6, 1, .6); }
  ctx.fillStyle = '#d8ccb4'; ctx.beginPath(); ctx.moveTo(ax + 2.8, agy - 9.2); ctx.quadraticCurveTo(ax + 4.2, agy - 13, ax + 4.4 + sw, agy - 15.6); ctx.lineTo(ax + 6.2 + sw, agy - 15.4); ctx.quadraticCurveTo(ax + 5.2, agy - 11.5, ax + 4.9, agy - 8); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(ax + 5.6 + sw, agy - 16, 1.5, 1.05, -.2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(ax + 6.9 + sw, agy - 15.6, .9, .6, .2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#c8bca4'; for (const ex of [ax + 5 + sw, ax + 5.9 + sw]) { ctx.beginPath(); ctx.ellipse(ex, agy - 17.5, .32, .95, -.15 + (ex - ax - 5) * .3, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#1a1418'; ctx.beginPath(); ctx.arc(ax + 6.2 + sw, agy - 16.2, .2, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.ellipse(ax, agy - 8.2, 4.6, 2.9, 0, 0, TAU); ctx.clip(); ctx.strokeStyle = rgba('#8a7a60', .5); ctx.lineWidth = .3 / L.z; ctx.beginPath(); for (let i = 0; i < 40; i++) { const q = hash(i * 1.7), r2 = hash(i * 2.9); ctx.moveTo(ax - 4.6 + q * 9.2, agy - 11 + r2 * 5.6); ctx.arc(ax - 4.6 + q * 9.2, agy - 11 + r2 * 5.6, .45, 0, Math.PI); } ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#c84a3a'; ctx.beginPath(); ctx.ellipse(ax + 5.4 + sw * .5, agy - 14.6, .25, .5, 0, 0, TAU); ctx.fill();
  // the farmer: poncho and hat, both hands stacked on the hoe's handle, its blade on the terrace in front; he looks up (peru)
  const fx = P.farmer, fgy = G(fx) - .9, s = L.z * PU / 185, lookU = smt(span(t, A.peru + .1, A.peru + .65));
  const [HX, HY] = toS(L, fx, fgy - PU * .5);
  const bladeX = fx + 6.4, bladeY = fgy, topX = fx + 4.6, topY = fgy - 11.8;
  const pose = { ...POSES.stand, lean: .1 - .1 * lookU, head: .12 - .7 * lookU, sh: [.9, .7], el: [.8, .9] };
  const hT = toS(L, topX - .25, topY + .5), hT2 = toS(L, topX - .35, topY + 1.6);
  const a0 = reachArm(HX, HY, s, pose, 0, false, { t, seed: 8 }, hT), a1 = reachArm(HX, HY, s, pose, 1, false, { t, seed: 8 }, hT2);
  pose.sh = [a0.sh, a1.sh]; pose.el = [a0.el, a1.el]; pose.lock = [true, true]; pose.coat = true;
  // the hoe: the long handle, the iron blade at a right angle on the ground (drawn behind the near arm)
  ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = .55; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(topX, topY); ctx.lineTo(bladeX, bladeY - .9); ctx.stroke();
  ctx.fillStyle = '#5a5a62'; ctx.beginPath(); ctx.moveTo(bladeX - .3, bladeY - 1.3); ctx.lineTo(bladeX + 3.3, bladeY - .9); ctx.lineTo(bladeX + 3.4, bladeY); ctx.lineTo(bladeX - .1, bladeY); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#9a9aa8'; ctx.fillRect(bladeX + .2, bladeY - 1.2, 3, .25); ctx.lineCap = 'butt';
  figure(ctx, HX, HY, s, pose, { t, seed: 8, dress: { coat: '#a8342a', pants: '#2a2a3a', skin: '#8d5f40', hair: '#14101a' }, accent: '#e8b84a', accentPart: 'scarf', light: { x: HX - 600, y: HY - 500, col: '#9fd8c8', a: .5 }, rim: '#9fd0d8', rimSide: -1 });
  // the hat (chullo-style brimmed hat)
  const hd = toS(L, fx + .5, fgy - PU * .965 + 1.1 * lookU);
  setL(ctx, L);
}

// ---------------------------------------------------------------- draw all sets that are in view
export function drawSets(ctx, t, C, A, o = {}) {
  const L = LC(C, SK); if (L.z <= 0 || L.z > 140) return;
  const [vx0, , vx1] = viewB(L, 80);
  ctx.save(); setL(ctx, L);
  ground(ctx, L, Math.max(2280, vx0), Math.min(3020, vx1), o.night ?? 1);
  const inV = (a, b) => b > vx0 && a < vx1;
  if (inV(2330, 2445)) wheatSet(ctx, t, L, o);
  if (inV(...P.house)) houseSet(ctx, t, L, A, o);
  if (inV(P.gate[0], P.wall[1] + 12)) gateSet(ctx, t, L, A, o);
  if (inV(P.cot[0] - 6, P.cot[1] + 6)) cottageSet(ctx, t, L, A, o);
  if (inV(P.town[0] - 4, P.town[1] + 4)) townSet(ctx, t, L, A, o);
  setL(ctx, L);
  if (inV(P.lagos[0] - 25, P.lagos[1] + 30)) lagosSet(ctx, t, L, A, o);
  setL(ctx, L);
  if (inV(P.peru[0] - 10, P.peru[1] + 10)) peruSet(ctx, t, L, A, o);
  ctx.restore();
}
