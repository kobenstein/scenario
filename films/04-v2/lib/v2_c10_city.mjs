// Film 4 v2 · c10 · World 2, the city of small flats (10.08–10.12), in the town's metres: beyond the stone bridge's arch (X 25.7) a
// concrete canal runs straight to a wide road (X 94–110) at the foot of one huge slab block (facade X 116, 14 floors, 100 m wide).
// Night, cold: the sky is the night plate of the boundary c10>c11 (drawn here with the same code, shifted by the camera's turn, so
// the last frames ARE the plate). One tiny lit window on "flats"; a crawl of headlights on the road on "commutes"; the camera pushes
// into the stair core (lib/v2_c10_stairs.mjs); after the tribe the road is one long table of lanterns (lib/v2_c10_street.mjs).
//   city(ctx, C, t, K, o)    everything of World 2 seen from camera C (o.clipStair: the core window shows the stairwell)
//   skyW2(ctx, t, C)         the night sky, = handoff4's sky plate (tone night) when C looks along SKY_F
import { W, H, rgba, clamp, mix, prng, mixHex, shade, TAU, poly3, fill3, seg3, at3, box3, radial, glowImg, glowAt, sm2, hash, trace, proj3 } from './v2_c10_kit.mjs';
import { WY, boats, boat } from './v2_c10_harbour.mjs';
import { street } from './v2_c10_street.mjs';

export const SY = WY + 2.2;
export const CAN = { x0: 25.7, x1: 92, z0: 12.3, z1: 20.3 };
export const ROAD = { x0: 94, x1: 110, e: 116 };
export const BLK = { x0: 116, x1: 130, z0: -40, z1: 72, fl: 14, fh: 3 };
BLK.top = SY + BLK.fl * BLK.fh + .9;
export const CORE = { z: 16.3, w: 1.0 };
export const LITWIN = { fl: 5, z: 6.7 };
export const SKY_F = { yaw: -.55, pitch: 1.1 };

// ---------------------------------------------------------------- the night sky (copied from lib/handoff4.mjs skyPlate, tone night)
const SKYC = ['#060818', '#0d1236', '#1d1a4a'];
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
export function skyOffset(C) { return [-C.f * (C.yaw - SKY_F.yaw), C.f * (C.pitch - SKY_F.pitch)]; }
export function skyW2(ctx, t, C, glow = '#3a2f5c') {
  const [ox, oy] = skyOffset(C), [s0, s1, s2] = SKYC;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0, oy, 0, oy + H); g.addColorStop(0, s0); g.addColorStop(.62, s1); g.addColorStop(1, s2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // below the plate: down to the horizon the sky takes the city's glow
  const hy = C.oy + C.f * Math.tan(C.pitch);
  if (hy > oy + H && oy + H < H) { const gg = ctx.createLinearGradient(0, oy + H, 0, hy); gg.addColorStop(0, s2); gg.addColorStop(1, glow); ctx.fillStyle = gg; ctx.fillRect(0, Math.max(0, oy + H), W, Math.min(H, hy) - Math.max(0, oy + H) + 2); if (hy < H) { ctx.fillStyle = glow; ctx.fillRect(0, hy, W, H - hy); } }
  ctx.save(); ctx.translate(W / 2 + ox, H / 2 + oy); ctx.rotate(-.42); const r = prng(55);
  for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); ctx.fillStyle = `rgba(216,230,255,${a})`; ctx.fillRect(x + t * 1.5, y, 1.3, 1.3); }
  ctx.restore();
  const dx = t * 2.2 + ox, dy = t * .6 + oy;
  for (const [x, y, s, ph, f] of STARS) {
    const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx) % W + W) % W, Y = ((y + dy) % H + H) % H;
    ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
    if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- facades as window grids (rows interpolated: exact for a camera looking along ±X)
// a facade plane at X = x facing −X (dir −1) or a facade at Z = z facing ±Z: drawn as one wall + rows of windows
function gridX(ctx, C, x, z0, z1, yb, fl, fh, o) {
  // wall
  const wall = [[x, yb, z1], [x, yb, z0], [x, yb + fl * fh + (o.parapet ?? .9), z0], [x, yb + fl * fh + (o.parapet ?? .9), z1]];
  if (!fill3(ctx, C, wall, o.wall)) return;
  // panel joints: one line per floor, verticals every 2 bays
  ctx.strokeStyle = o.joint; ctx.lineWidth = 1; ctx.beginPath();
  for (let f = 1; f <= fl; f++) seg3(ctx, C, [x - .01, yb + f * fh, z0], [x - .01, yb + f * fh, z1]);
  const nb = Math.round((z1 - z0) / o.bay);
  for (let i = 0; i <= nb; i += 2) { const z = mix(z0, z1, i / nb); seg3(ctx, C, [x - .01, yb, z], [x - .01, yb + fl * fh, z]); }
  ctx.stroke();
  // windows: per floor row, the two ends projected, the bays interpolated
  for (let f = o.f0 ?? 0; f < fl; f++) {
    const y0 = yb + f * fh + o.sill, y1 = y0 + o.wh;
    const A0 = C.p(x - .02, y0, z0), A1 = C.p(x - .02, y0, z1), B0 = C.p(x - .02, y1, z0), B1 = C.p(x - .02, y1, z1); if (!A0 || !A1 || !B0 || !B1) continue;
    for (let i = 0; i < nb; i++) {
      const zc = mix(z0, z1, (i + .5) / nb), ua = (zc - o.ww / 2 - z0) / (z1 - z0), ub = (zc + o.ww / 2 - z0) / (z1 - z0);
      const p0x = mix(A0[0], A1[0], ua), p1x = mix(A0[0], A1[0], ub), p0y = mix(A0[1], A1[1], ua), p1y = mix(A0[1], A1[1], ub), q0y = mix(B0[1], B1[1], ua), q1y = mix(B0[1], B1[1], ub), q0x = mix(B0[0], B1[0], ua), q1x = mix(B0[0], B1[0], ub);
      if (Math.max(p0x, p1x) < -4 || Math.min(p0x, p1x) > W + 4 || Math.max(p0y, q0y) < -4 || Math.min(p0y, q0y) > H + 4) continue;
      const col = o.win(f, i, zc); if (!col) continue;
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(p0x, p0y); ctx.lineTo(p1x, p1y); ctx.lineTo(q1x, q1y); ctx.lineTo(q0x, q0y); ctx.closePath(); ctx.fill();
    }
  }
}
function gridZ(ctx, C, z, x0, x1, yb, fl, fh, o) {
  const top = yb + fl * fh + (o.parapet ?? .6), wall = [[x0, yb, z], [x1, yb, z], [x1, top, z], [x0, top, z]];
  if (!fill3(ctx, C, wall, o.wall)) return;
  const nb = Math.max(1, Math.round((x1 - x0) / o.bay)), sz = o.face > 0 ? .02 : -.02;
  for (let f = 0; f < fl; f++) for (let i = 0; i < nb; i++) {
    const xc = mix(x0, x1, (i + .5) / nb), y0 = yb + f * fh + o.sill, col = o.win(f, i, xc); if (!col) continue;
    fill3(ctx, C, [[xc - o.ww / 2, y0, z + sz], [xc + o.ww / 2, y0, z + sz], [xc + o.ww / 2, y0 + o.wh, z + sz], [xc - o.ww / 2, y0 + o.wh, z + sz]], col);
  }
}
// ---------------------------------------------------------------- buildings: plain boxes with a window grid on one face
// b: { x0, x1, z0, z1, fl, face: 'x0'|'x1'|'z0'|'z1', col, seed }; windows dark, a few cold-lit; after the tribe more warm-lit
function bldg(ctx, C, t, K, b, party) {
  const top = SY + b.fl * 3 + .6, wall = b.col, side = shade(b.col, -.25);
  box3(ctx, C, b.x0, SY, b.z0, b.x1, top, b.z1, (f) => (f === 'y1' ? '#1e2032' : f === b.face ? wall : side));
  const f = b.face, out = f === 'x0' ? C.x < b.x0 : f === 'x1' ? C.x > b.x1 : f === 'z0' ? C.z < b.z0 : C.z > b.z1; if (!out) return;
  const along = f[0] === 'x' ? [b.z0, b.z1] : [b.x0, b.x1], pl = f === 'x0' ? b.x0 - .02 : f === 'x1' ? b.x1 + .02 : f === 'z0' ? b.z0 - .02 : b.z1 + .02;
  const n = Math.max(1, Math.round((along[1] - along[0]) / 2.8));
  const c0 = at3(C, f[0] === 'x' ? pl : (b.x0 + b.x1) / 2, SY + 3, f[0] === 'x' ? (b.z0 + b.z1) / 2 : pl); if (!c0 || c0.k < 1.2) return;
  for (let fl = 0; fl < b.fl; fl++) for (let i = 0; i < n; i++) {
    const u = mix(along[0], along[1], (i + .5) / n), y0 = SY + fl * 3 + .9, h = hash(b.seed + fl * 31 + i, 7);
    const warm = party ? sm2((t - K.now - .3 - h * 2.2) / .25) * (h < .42 ? 1 : 0) : 0, cold = h > .965;
    const col = warm > 0 ? mixHex('#161a2c', '#ffcf8a', warm) : cold ? '#a8b8d8' : '#161a2c';
    const q = f[0] === 'x' ? [[pl, y0, u - .55], [pl, y0, u + .55], [pl, y0 + 1.3, u + .55], [pl, y0 + 1.3, u - .55]] : [[u - .55, y0, pl], [u + .55, y0, pl], [u + .55, y0 + 1.3, pl], [u - .55, y0 + 1.3, pl]];
    fill3(ctx, C, q, col);
  }
}
// low warehouses along the canal; the town along the street (west side fronts at X 92, east side beyond the block)
const BANKS = (() => { const r = prng(5150), o = []; for (const side of [1, -1]) { let x = 30; while (x < 88) { const w = 8 + r() * 9, fl = 2 + Math.floor(r() * 2); o.push({ x0: x, x1: Math.min(90.5, x + w), z0: side > 0 ? CAN.z1 + 7 : CAN.z0 - 17, z1: side > 0 ? CAN.z1 + 17 : CAN.z0 - 7, fl, face: side > 0 ? 'z0' : 'z1', seed: Math.floor(r() * 1e5), col: ['#2e3044', '#33354a', '#2c3340', '#383348'][o.length % 4] }); x += w + 2 + r() * 4; } } return o; })();
const TOWN = (() => { const r = prng(6161), o = [], cols = ['#3a3448', '#433a50', '#34384c', '#3e3446'];
  for (const [xa, xb, face, za, zb] of [[78, 92, 'x1', 28, 420], [78, 92, 'x1', -170, 4], [116, 130, 'x0', 74, 420], [116, 130, 'x0', -170, -42]]) { let z = za; while (z < zb) { const w = 9 + r() * 12; o.push({ x0: xa, x1: xb, z0: z, z1: Math.min(zb, z + w), fl: 3 + Math.floor(r() * 4), face, seed: Math.floor(r() * 1e5), col: cols[o.length % 4] }); z += w + .8 + r() * 2; } }
  return o; })();
function canal(ctx, C, t, K, lights) {
  fill3(ctx, C, [[CAN.x0, WY, CAN.z0], [CAN.x1, WY, CAN.z0], [CAN.x1, WY, CAN.z1], [CAN.x0, WY, CAN.z1]], '#0c1026');
  ctx.strokeStyle = rgba('#3a4a7a', .35); ctx.lineWidth = 1; ctx.beginPath();
  const r = prng(77); for (let i = 0; i < 160; i++) { const x = CAN.x0 + r() * (CAN.x1 - CAN.x0), z = CAN.z0 + .3 + r() * (CAN.z1 - CAN.z0 - .6), L = .6 + r() * 1.8, sh = (t * .3 + r() * 9) % 1.5; seg3(ctx, C, [x + sh, WY + .002, z], [x + sh + L, WY + .002, z]); } ctx.stroke();
  for (const [z, s] of [[CAN.z0, 1], [CAN.z1, -1]]) {
    if ((C.z - z) * s <= 0) continue;
    const q = [[CAN.x0, WY - .3, z], [CAN.x1, WY - .3, z], [CAN.x1, SY, z], [CAN.x0, SY, z]];
    if (fill3(ctx, C, q, '#2a2e44')) { ctx.strokeStyle = rgba('#141626', .6); ctx.lineWidth = 1; ctx.beginPath(); for (let x = CAN.x0 + 2; x < CAN.x1; x += 3) seg3(ctx, C, [x, WY, z + s * .01], [x, SY, z + s * .01]); seg3(ctx, C, [CAN.x0, SY - .25, z + s * .01], [CAN.x1, SY - .25, z + s * .01]); ctx.stroke(); }
  }
  if (C.x < CAN.x1) fill3(ctx, C, [[CAN.x1, WY - .3, CAN.z0], [CAN.x1, WY - .3, CAN.z1], [CAN.x1, SY, CAN.z1], [CAN.x1, SY, CAN.z0]], '#262a40');
  // the reflections of the block's lights: the stair core's cold column and the one warm window, broken by ripples
  ctx.save(); const S = proj3(C, [[CAN.x0, WY, CAN.z0], [CAN.x1, WY, CAN.z0], [CAN.x1, WY, CAN.z1], [CAN.x0, WY, CAN.z1]]);
  if (S) { ctx.beginPath(); trace(ctx, S); ctx.clip();
    const party = t > K.now, refl = [[CORE.z, SY + 3, BLK.top - 2, party ? '#ffcf8a' : '#cfe0e0', .35]]; if (t >= K.flats + .7) refl.push([LITWIN.z, SY + LITWIN.fl * 3 + 1, SY + LITWIN.fl * 3 + 2.4, '#ffcf8a', .55]);
    for (const [z, y0, y1, col, a] of refl) { const A = C.p(BLK.x0, 2 * WY - y0, z), B = C.p(BLK.x0, 2 * WY - y1, z); if (!A || !B) continue; const w = Math.max(1.5, 1.0 * C.f / A[2]); ctx.fillStyle = rgba(col, a);
      for (let k = 0; k < 26; k++) { const u = k / 26, y = mix(A[1], B[1], u), jx = (hash(k, Math.floor(t * 6)) - .5) * w * 2.5; ctx.fillRect(A[0] + jx - w * (1 + hash(k, 3)), y, w * 2 * (1 + hash(k, 3)), Math.max(1, (B[1] - A[1]) / 26 * .55)); } }
  }
  ctx.restore();
  // the pavements on both banks, railings
  for (const [za, zb] of [[CAN.z1, CAN.z1 + 7], [CAN.z0 - 7, CAN.z0]]) fill3(ctx, C, [[CAN.x0, SY, za], [92, SY, za], [92, SY, zb], [CAN.x0, SY, zb]], '#22263a');
  ctx.strokeStyle = rgba('#8a94b8', .5); ctx.lineWidth = 1; ctx.beginPath();
  for (const z of [CAN.z0 - .15, CAN.z1 + .15]) { seg3(ctx, C, [CAN.x0, SY + 1.0, z], [CAN.x1, SY + 1.0, z]); for (let x = CAN.x0 + .5; x < CAN.x1; x += 1.6) seg3(ctx, C, [x, SY, z], [x, SY + 1.0, z]); }
  ctx.stroke();
  // streetlights along the banks (cold; warm once the street is a table)
  const party = t > K.now;
  for (let x = 30; x < 92; x += 14) for (const z of [CAN.z0 - 1, CAN.z1 + 1]) { const p = at3(C, x, SY + 5.2, z), p0 = at3(C, x, SY, z); if (!p || !p0) continue; ctx.strokeStyle = '#141626'; ctx.lineWidth = Math.max(1, .08 * p.k); ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p.x, p.y); ctx.stroke(); lights.push([p.x, p.y, p.k, party ? '#ffcf8a' : '#d8e4ff', .5]); }
}
// sort buildings far → near from the camera
const byDist = (C, L) => L.map((b) => [Math.hypot(clamp(C.x, b.x0, b.x1) - C.x, clamp(C.z, b.z0, b.z1) - C.z), b]).sort((a, b) => b[0] - a[0]).map((a) => a[1]);
// ---------------------------------------------------------------- the block
function block(ctx, C, t, K, lights, o) {
  const yb = SY, fl = BLK.fl, fh = BLK.fh, litOn = t >= K.flats + .7, party = t > K.now;
  box3(ctx, C, BLK.x0, yb, BLK.z0, BLK.x1, BLK.top, BLK.z1, (f) => (f === 'y1' ? '#2a2c3e' : f === 'z0' || f === 'z1' ? '#23263a' : '#20222f'));
  // seen from above: the skylight over the stairwell, the well below it
  if (o.stair && C.y > BLK.top) {
    const r = 3.9, q = [[119.8 - r, BLK.top + .02, 16.3 - r], [119.8 + r, BLK.top + .02, 16.3 - r], [119.8 + r, BLK.top + .02, 16.3 + r], [119.8 - r, BLK.top + .02, 16.3 + r]], S = proj3(C, q);
    if (S) { ctx.save(); ctx.beginPath(); trace(ctx, S); ctx.clip(); o.stair(ctx, C, { deep: 7, top: 14 }); ctx.restore(); ctx.strokeStyle = '#141626'; ctx.lineWidth = 2; ctx.beginPath(); trace(ctx, S); for (const u of [.25, .5, .75]) { seg3(ctx, C, [mix(q[0][0], q[1][0], u), BLK.top + .03, q[0][2]], [mix(q[0][0], q[1][0], u), BLK.top + .03, q[2][2]]); } ctx.stroke(); }
    box3(ctx, C, 119.8 - r - .3, BLK.top, 16.3 - r - .3, 119.8 - r, BLK.top + .5, 16.3 + r + .3, () => '#3a3c50'); box3(ctx, C, 119.8 + r, BLK.top, 16.3 - r - .3, 119.8 + r + .3, BLK.top + .5, 16.3 + r + .3, () => '#3a3c50');
  }
  if (C.x >= BLK.x0) return;
  // the facade: a wall lit from the street below, darker up high
  const S = proj3(C, [[BLK.x0, yb, BLK.z1], [BLK.x0, yb, BLK.z0], [BLK.x0, BLK.top, BLK.z0], [BLK.x0, BLK.top, BLK.z1]]);
  if (S) { const zc = clamp(C.z, BLK.z0, BLK.z1), a = C.p(BLK.x0, yb, zc), b = C.p(BLK.x0, BLK.top, zc); ctx.beginPath(); trace(ctx, S);
    if (a && b) { const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, '#4a5272'); g.addColorStop(.35, '#3a4060'); g.addColorStop(1, '#262a44'); ctx.fillStyle = g; } else ctx.fillStyle = '#343a58'; ctx.fill(); }
  ctx.strokeStyle = rgba('#141628', .5); ctx.lineWidth = 1; ctx.beginPath();
  for (let f = 1; f <= fl; f++) seg3(ctx, C, [BLK.x0 - .01, yb + f * fh, BLK.z0], [BLK.x0 - .01, yb + f * fh, BLK.z1]);
  for (let z = BLK.z0; z <= BLK.z1; z += 4.8) seg3(ctx, C, [BLK.x0 - .01, yb, z], [BLK.x0 - .01, BLK.top, z]);
  ctx.stroke();
  // the windows (each projected: exact from any angle); near ones get a frame and a sill
  const nb = Math.round((BLK.z1 - BLK.z0) / 2.4);
  for (let f = 1; f < fl; f++) for (let i = 0; i < nb; i++) {
    const zc = BLK.z0 + (i + .5) * 2.4; if (Math.abs(zc - CORE.z) < 1.3) continue;
    const y0 = yb + f * fh + .9, x = BLK.x0 - .02, Q = proj3(C, [[x, y0, zc - .62], [x, y0, zc + .62], [x, y0 + 1.45, zc + .62], [x, y0 + 1.45, zc - .62]]); if (!Q) continue;
    let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9; for (const [px, py] of Q) { mnx = Math.min(mnx, px); mxx = Math.max(mxx, px); mny = Math.min(mny, py); mxy = Math.max(mxy, py); } if (mxx < 0 || mnx > W || mxy < 0 || mny > H) continue;
    const h = hash(f * 131 + i, 5), lit = f === LITWIN.fl && Math.abs(zc - LITWIN.z) < 1.2;
    const warm = lit ? (litOn ? 1 : 0) : party ? sm2((t - K.now - .2 - h * 2.5) / .25) * (h < .45 ? 1 : 0) : 0;
    const tv = !party && h > .985 ? .5 + .3 * Math.sin(t * 7 + i) * Math.sin(t * 3.1 + f) : 0;
    ctx.beginPath(); trace(ctx, Q); ctx.fillStyle = warm > 0 ? mixHex(h < .5 ? '#151a2e' : '#1a2036', lit ? '#ffcf8a' : '#ffbf78', warm) : tv > 0 ? mixHex('#151a2e', '#6a8ad8', tv) : h < .5 ? '#151a2e' : '#1a2036'; ctx.fill();
    if (mxx - mnx > 14) { ctx.strokeStyle = rgba('#8a90a8', .35); ctx.lineWidth = Math.max(1, (mxx - mnx) * .05); ctx.stroke(); }
  }
  // the lit window's glow (a lamp switching on, not a fade)
  if (litOn) { const p = at3(C, BLK.x0 - .05, yb + LITWIN.fl * fh + 1.6, LITWIN.z); if (p) { radial(ctx, p.x, p.y, 2.6 * p.k, '#ffcf8a', .35, 'screen'); lights.push([p.x, p.y, p.k * .6, '#ffcf8a', .5]); } }
  // the stair core: a column of tall narrow windows lit cold (the staircase lights), warm once the doors are open
  const coreC = party ? '#ffd9a0' : '#cfe0dc';
  for (let f = 1; f < fl; f++) {
    const y0 = yb + f * fh + 1.25, q = [[BLK.x0 - .03, y0, CORE.z + CORE.w / 2], [BLK.x0 - .03, y0, CORE.z - CORE.w / 2], [BLK.x0 - .03, y0 + 1.9, CORE.z - CORE.w / 2], [BLK.x0 - .03, y0 + 1.9, CORE.z + CORE.w / 2]];
    const Q = proj3(C, q); if (!Q) continue;
    if (o.stair && f === o.stairFloor && (at3(C, BLK.x0, y0, CORE.z)?.k ?? 0) > 60) { ctx.save(); ctx.beginPath(); trace(ctx, Q); ctx.clip(); o.stair(ctx, C, { deep: 4, top: 11 }); ctx.restore(); }
    else { ctx.beginPath(); trace(ctx, Q); ctx.fillStyle = coreC; ctx.fill(); const c = at3(C, BLK.x0 - .05, y0 + .95, CORE.z); if (c) lights.push([c.x, c.y, c.k * .9, coreC, .3]); }
    ctx.strokeStyle = '#0e1020'; ctx.lineWidth = Math.max(1, (at3(C, BLK.x0, y0, CORE.z)?.k ?? 10) * .06); ctx.beginPath(); trace(ctx, Q); ctx.stroke();
  }
  // the entrances: lit doors under canopies (warm once the street is a table)
  for (const z of [-16, CORE.z, 40, 64]) { const q = [[BLK.x0 - .03, yb, z - .9], [BLK.x0 - .03, yb, z + .9], [BLK.x0 - .03, yb + 2.4, z + .9], [BLK.x0 - .03, yb + 2.4, z - .9]]; if (fill3(ctx, C, q, party ? '#ffcf8a' : '#6a7a9a')) { const e = at3(C, BLK.x0 - .05, yb + 1.2, z); if (e) lights.push([e.x, e.y, e.k * .8, party ? '#ffcf8a' : '#c8d4f0', .35]); }
    box3(ctx, C, BLK.x0 - 2.2, yb + 2.7, z - 2.4, BLK.x0, yb + 2.95, z + 2.4, (f) => (f === 'y1' ? '#2a2c3e' : '#202232')); }
}
// ---------------------------------------------------------------- the road: the evening crawl of headlights; later the long table
const TRAFFIC = [[97.5, -1, 2.3], [100.8, -1, 2.7], [104, 1, 2.0], [107.3, 1, 2.5]];
function road(ctx, C, t, K, lights) {
  const party = t > K.now;
  fill3(ctx, C, [[92, SY, -170], [ROAD.e, SY, -170], [ROAD.e, SY, 420], [92, SY, 420]], '#1c2032');
  fill3(ctx, C, [[ROAD.x0, SY + .005, -170], [ROAD.x1, SY + .005, -170], [ROAD.x1, SY + .005, 420], [ROAD.x0, SY + .005, 420]], party ? '#24222e' : '#16192a');
  ctx.strokeStyle = rgba('#c8ccd8', .3); ctx.lineWidth = 1; ctx.beginPath();
  for (const x of [99.2, 105.6]) for (let z = -160; z < 420; z += 6) seg3(ctx, C, [x, SY + .01, z], [x, SY + .01, z + 3]);
  seg3(ctx, C, [ROAD.x0, SY + .01, -170], [ROAD.x0, SY + .01, 420]); seg3(ctx, C, [ROAD.x1, SY + .01, -170], [ROAD.x1, SY + .01, 420]);
  ctx.stroke();
  // streetlights on both kerbs (cold; warm once the street is a table)
  for (let z = -150; z < 420; z += 22) for (const x of [ROAD.x0 - .6, ROAD.x1 + .6]) { const p = at3(C, x, SY + 7, z), p0 = at3(C, x, SY, z); if (!p || !p0) continue; ctx.strokeStyle = '#121424'; ctx.lineWidth = Math.max(1, .1 * p.k); ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p.x, p.y); ctx.stroke(); lights.push([p.x, p.y, p.k, party ? '#ffcf8a' : '#d8e4ff', .55]); }
  if (party) return;
  // the cars: a slow crawl in both directions; white heads, red tails with their streaks
  const heads = [];
  for (let l = 0; l < TRAFFIC.length; l++) {
    const [x, dir, v] = TRAFFIC[l], r = prng(300 + l), P = 380, n = 54;
    for (let k = 0; k < n; k++) {
      const z0 = -160 + ((k * P / n + r() * 2.5 + dir * v * (t - 270)) % P + P) % P, zf = z0 + dir * 2.1, zr = z0 - dir * 2.1;
      const b = at3(C, x, SY + .7, z0); if (!b || b.x < -200 || b.x > W + 200) continue;
      box3(ctx, C, x - .85, SY + .2, Math.min(zf, zr), x + .85, SY + 1.35, Math.max(zf, zr), (f) => (f === 'y1' ? '#2a2e40' : '#0e1020'));
      for (const s of [-.6, .6]) { const hp = at3(C, x + s, SY + .65, zf), tp = at3(C, x + s, SY + .7, zr); if (hp) heads.push([hp.x, hp.y, hp.k, '#fff6e2']); if (tp) { heads.push([tp.x, tp.y, tp.k, '#ff3a3a']); const te = at3(C, x + s, SY + .7, zr - dir * 3.2); if (te) { const g = ctx.createLinearGradient(tp.x, tp.y, te.x, te.y); g.addColorStop(0, rgba('#ff4a3a', .55)); g.addColorStop(1, rgba('#ff4a3a', 0)); ctx.strokeStyle = g; ctx.lineWidth = Math.max(1, .12 * tp.k); ctx.beginPath(); ctx.moveTo(tp.x, tp.y); ctx.lineTo(te.x, te.y); ctx.stroke(); } } }
      const be = at3(C, x, SY + .02, zf + dir * 6); const bh = at3(C, x, SY + .02, zf); if (be && bh) { const g = ctx.createLinearGradient(bh.x, bh.y, be.x, be.y); g.addColorStop(0, rgba('#fff1d6', .18)); g.addColorStop(1, rgba('#fff1d6', 0)); ctx.strokeStyle = g; ctx.lineWidth = Math.max(1, 1.4 * bh.k); ctx.beginPath(); ctx.moveTo(bh.x, bh.y); ctx.lineTo(be.x, be.y); ctx.stroke(); }
    }
  }
  for (const [x, y, k, c] of heads) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, Math.max(.8, .09 * k), 0, TAU); ctx.fill(); glowAt(ctx, glowImg(c, { R: 48, core: .5, dots: 0 }), x, y, Math.max(3, .5 * k), .8, 'screen'); }
}
// ---------------------------------------------------------------- World 2
export function city(ctx, C, t, K, o = {}) {
  const lights = [], party = t > K.now;
  skyW2(ctx, t, C);
  for (const [z0, z1, h] of [[-160, -60, 26], [90, 200, 30]]) fill3(ctx, C, [[180, SY, z0], [180, SY, z1], [180, SY + h, z1], [180, SY + h, z0]], '#1a1c30');
  const town = () => { for (const b of byDist(C, TOWN)) bldg(ctx, C, t, K, b, party); };
  const banks = () => { canal(ctx, C, t, K, lights); for (const b of byDist(C, BANKS)) bldg(ctx, C, t, K, b, party); };
  const blk = () => block(ctx, C, t, K, lights, o);
  const rd = () => { road(ctx, C, t, K, lights); if (party) street(ctx, C, t, K, lights); };
  // far → near, by where the camera is: over the canal the block is the farthest; over the street the street is the nearest;
  // over the roof the roof is
  if (C.x < ROAD.x0 - 2) { town(); blk(); rd(); banks(); }
  else if (C.x < BLK.x0) { town(); blk(); banks(); rd(); }
  else { town(); banks(); rd(); blk(); }
  // the boat that came through the bridge drifts on along the canal, its lantern the only warm light low down
  if (!party && C.x < BLK.x0) { const bs = boats(t, K); if (bs.B.x > 25.2) { o.lights = []; boat(ctx, C, bs.B, t, null, { night: 1, lamp: 1, lights: o.lights, col: '#c8963a' }); for (const [x, y, k] of o.lights) glowAt(ctx, glowImg('#ffb35c', { R: 64, core: .5, dots: 0 }), x, y, .45 * k, .9, 'screen'); } }
  for (const [x, y, k, c, a] of lights) glowAt(ctx, glowImg(c, { R: 64, core: .4, dots: 0 }), x, y, Math.max(4, 1.2 * k), a, 'screen');
}
