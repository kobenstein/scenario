// Film 8 · c11 local pieces (B3). World = metres through the s8 camera (+Y up); screen = 1920 × 1080.
//   beach(ctx, t, C, o)          a night beach: sand from the waterline (Z = o.shore 3.2) toward −Z, the wash running up and back (o.wash 0..1
//                                extra run-up), the fire's light on the sand (o.fire [X, Y, Z]) → { waterZ(x) }
//   STONES / stoneRing(ctx, t, C, o)   Mau's star compass of stones round o.c [X, Z] (R 2.3 m): 32 stones; o.gone(i) → 0..1 how far stone i has
//                                been pulled to the sea, o.add 0..1 the stone set back into the gap; lit by o.fire
//   beachFire(ctx, t, C, X, Z, k)  driftwood logs, flames, sparks → screen point of the fire core
//   coasts(ctx, t, C, s, o)      the world voyage: coast silhouettes on the horizon (ice floes, Table Mountain, a skyline with the Statue of
//                                Liberty, a palm atoll), scrolled by s (0..1 across all four); each brings its own sky tint
//   standFig(ctx, t, C, P, o)    a standing figure at world point P (feet) with arm 0 reaching for a screen target o.reach, o.size, dress, light
//   cliff(ctx, t, C, o)          the shore under your house: a dark cliff (front face at Z = o.z0) up to Y = o.top, the house wall with the
//                                window opening cut out (room origin o.O): → { win: [4 screen points] | null }
//   plan(ctx, t, C, o)           the rolled plan on your table (room coordinates), o.burn 0..1 (the ember edge eats it), and its flakes lifting
//                                past the window (o.flakes: s since the burn began; drawn by flakes()) ; flakes(ctx, t, C, u) after the window
//   sun(ctx, t, C, el, a)        the rising sun at az 0 (a warm disc with a halo), el in rad above the horizon
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projPoly, projRuns, fillPoly, mixHex, hash, eoX, sio, u01 } from './s8_kit.mjs';
import { flames } from './s8_canoe.mjs';
import { figure, reachArm } from './figure.mjs';
import { skyDir } from './s8_sky.mjs';

// ---------------------------------------------------------------- the beach
export function beach(ctx, t, C, o = {}) {
  const sh = o.shore ?? 3.2, wash = clamp(o.wash ?? 0);
  const wz = (x) => sh + .35 * Math.sin(x * .7 + 1) + .5 * Math.sin(t * .9 + x * .2) * .5 - 2.2 * wash;   // the wet edge (the sea runs up to here)
  const xs = []; for (let i = 0; i <= 60; i++) xs.push(-60 + i * 2);
  const sand = [...xs.map((x) => [x, 0, wz(x)]), [60, 0, -80], [-60, 0, -80]];
  const P = projPoly(C, sand, .2);
  if (fillPoly(ctx, P, '#1a1620')) {
    ctx.save(); fillPoly(ctx, P); ctx.clip();
    const fp = o.fire ? C.P(...o.fire) : null;
    if (fp) { const R = Math.max(500, fp[2] * 9), g = ctx.createRadialGradient(fp[0], fp[1], 0, fp[0], fp[1], R); g.addColorStop(0, rgba('#d08850', .75)); g.addColorStop(.35, rgba('#7a4a30', .4)); g.addColorStop(1, rgba('#1a1620', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    // grain: little ripples in the sand (engraved, parallel to the shore)
    ctx.strokeStyle = 'rgba(8,6,12,.35)'; ctx.lineWidth = 1;
    for (let k = 0; k < 40; k++) { const z = sh - .4 - k * .45, pts = []; for (let x = -14; x <= 14; x += .5) pts.push([x, .003, z + .08 * Math.sin(x * 2.1 + k)]); for (const run of projRuns(C, pts, .2)) { ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
    ctx.restore();
  }
  // the wash: a wet dark band and the foam line at its edge
  const wet = projPoly(C, [...xs.map((x) => [x, .002, wz(x)]), ...xs.slice().reverse().map((x) => [x, .002, wz(x) - .9 - .4 * wash])], .2);
  if (wet.length > 2) { ctx.save(); fillPoly(ctx, wet, 'rgba(10,14,32,.55)'); ctx.restore(); }
  for (const [off, a, lw] of [[0, .75, 2.2], [.25, .3, 1.2]]) { const pts = xs.map((x) => [x, .01, wz(x) + off]); for (const run of projRuns(C, pts, .2)) { ctx.strokeStyle = rgba('#d8e4ff', a); ctx.lineWidth = lw; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  return { waterZ: wz };
}
export const STONES = Array.from({ length: 32 }, (_, i) => ({ th: i / 32 * TAU, s: (i % 8 === 0 ? 1.35 : i % 4 === 0 ? 1.1 : .85) * (.9 + .2 * hash(i * 3.1)), ph: hash(i * 7.7) }));
export function stoneRing(ctx, t, C, o = {}) {
  const [cx, cz] = o.c || [0, 0], R = o.R ?? 2.3, fp = o.fire ? C.P(...o.fire) : null, out = [];
  const list = STONES.map((S, i) => { const g = o.gone ? clamp(o.gone(i)) : 0; const x = cx + Math.sin(S.th) * R + g * (1.5 * Math.sin(S.th + 2 * S.ph)), z = cz + Math.cos(S.th) * R + g * 4.5; return { S, i, x, z, g }; });
  list.sort((a, b) => C.depth(b.x, 0, b.z) - C.depth(a.x, 0, a.z));
  for (const { S, i, x, z, g } of list) {
    if (o.skip && o.skip(i)) continue;
    const p = C.P(x, .05, z); if (!p) continue;
    const r = S.s * .09 * p[2]; if (r < .6 || r > 400) continue;
    ctx.fillStyle = 'rgba(4,3,8,.5)'; ctx.beginPath(); ctx.ellipse(p[0], p[1] + r * .25, r * 1.2, r * .4, 0, 0, TAU); ctx.fill();
    const lit = fp ? clamp(1 - Math.hypot(fp[0] - p[0], fp[1] - p[1]) / 1400) : .2, dx = fp ? Math.sign(fp[0] - p[0]) : 1;
    ctx.fillStyle = mixHex('#1a1820', '#3a3440', .5 * (1 - g)); ctx.beginPath(); ctx.ellipse(p[0], p[1] - r * .25, r, r * .62, .2 * (S.ph - .5), 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba('#ffb066', .25 + .55 * lit); ctx.lineWidth = Math.max(1, r * .14); ctx.beginPath(); ctx.ellipse(p[0], p[1] - r * .25, r, r * .62, .2 * (S.ph - .5), dx > 0 ? -1.3 : 1.8, dx > 0 ? .6 : 3.7); ctx.stroke();
    out[i] = [p[0], p[1] - r * .3, r];
  }
  return out;
}
export function beachFire(ctx, t, C, X, Z, k = 1) {
  const p = C.P(X, .05, Z); if (!p) return null;
  const s = p[2] * k;
  if (s > 6000) return [p[0], p[1] - s * .25];
  ctx.save(); ctx.lineCap = 'round';
  // the warm pool on the sand
  ctx.globalCompositeOperation = 'lighter';
  { const R = s * 2.4, g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, rgba('#ff9a4a', .35)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, .35); ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.restore(); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
  // logs (a small tepee of driftwood), the embers
  for (const [a, b] of [[[-.35, 0, -.1], [.08, .32, 0]], [[.35, 0, -.05], [-.06, .34, .02]], [[0, 0, .35], [.02, .3, -.05]], [[-.2, 0, .3], [.4, .02, -.25]]]) {
    const A = C.P(X + a[0], a[1], Z + a[2]), B = C.P(X + b[0], b[1], Z + b[2]); if (!A || !B) continue;
    ctx.strokeStyle = '#1a0e08'; ctx.lineWidth = Math.max(2, s * .07); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
    ctx.strokeStyle = rgba('#ff8a3a', .6); ctx.lineWidth = Math.max(1, s * .02); ctx.stroke();
  }
  ctx.restore();
  const c = C.P(X, .12, Z);
  flames(ctx, t, c[0], c[1], s * .95);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const R = s * 1.6 * (1 + .05 * Math.sin(t * 7.3) + .03 * Math.sin(t * 13.1)), g = ctx.createRadialGradient(c[0], c[1] - s * .3, 0, c[0], c[1] - s * .3, R); g.addColorStop(0, rgba('#fff1d6', .55)); g.addColorStop(.25, rgba('#ffb35c', .3)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1] - s * .3, R, 0, TAU); ctx.fill();
  // sparks
  for (let n = Math.floor(t / .09) - 25; n <= Math.floor(t / .09); n++) { const a = t - n * .09, life = 1.2 + hash(n) * 1; if (a < 0 || a > life || hash(n * 3.3) > .5) continue; const q = C.P(X + (hash(n * 1.7) - .5) * .3 + a * .15 * Math.sin(n), .4 + a * (.8 + .5 * hash(n * 2.3)), Z + (hash(n * 5.1) - .5) * .3); if (!q) continue; ctx.fillStyle = rgba('#ffd9a0', .9 * (1 - a / life)); ctx.fillRect(q[0], q[1], 2, 2); }
  ctx.restore();
  return [c[0], c[1] - s * .3];
}

// ---------------------------------------------------------------- the world voyage: coasts on the horizon
const COAST = ['ice', 'mountain', 'city', 'atoll'];
const TINT = { ice: ['#16303c', .5], mountain: ['#4a2a3a', .45], city: ['#3a2a4e', .4], atoll: ['#1e3a5a', .45] };
function shapeAt(ctx, kind, x, hy, s, t) {
  ctx.save(); ctx.fillStyle = '#07060e'; ctx.strokeStyle = rgba('#a4b0dc', .45); ctx.lineWidth = 1.4;
  if (kind === 'ice') {
    for (let i = 0; i < 7; i++) { const w = (60 + 120 * hash(i * 3.3)) * s, xx = x + (i - 3) * 190 * s, h = (8 + 22 * hash(i * 7.1)) * s, yy = hy + (2 + 10 * hash(i)) * s; ctx.fillStyle = mixHex('#c8d8e8', '#6a7a9a', .4 + .3 * hash(i * 5)); ctx.beginPath(); ctx.moveTo(xx - w / 2, yy); ctx.lineTo(xx - w * .4, yy - h); ctx.lineTo(xx + w * .2, yy - h * 1.1); ctx.lineTo(xx + w / 2, yy - h * .3); ctx.lineTo(xx + w / 2, yy); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.stroke(); }
    ctx.restore(); return;
  }
  ctx.beginPath(); ctx.moveTo(x - 700 * s, hy + 1);
  if (kind === 'mountain') { const P = [[-700, 0], [-520, -30], [-380, -55], [-300, -150], [-250, -168], [180, -172], [230, -150], [300, -120], [360, -90], [440, -110], [520, -60], [700, 0]]; for (const [a, b] of P) ctx.lineTo(x + a * s, hy + b * s + (b ? 2 * Math.sin(a) : 0)); }
  else if (kind === 'city') {
    const r = prng(808); let xx = -560; ctx.lineTo(x + xx * s, hy - 10 * s);
    while (xx < 280) { const w = 18 + r() * 34, h = 30 + r() * (xx > -200 && xx < 60 ? 210 : 110); ctx.lineTo(x + xx * s, hy - h * s); ctx.lineTo(x + (xx + w) * s, hy - h * s); xx += w + r() * 6; }
    ctx.lineTo(x + 300 * s, hy - 6 * s); ctx.lineTo(x + 700 * s, hy - 4 * s);
  } else { ctx.lineTo(x - 300 * s, hy - 5 * s); ctx.quadraticCurveTo(x, hy - 16 * s, x + 300 * s, hy - 5 * s); ctx.lineTo(x + 700 * s, hy); }
  ctx.lineTo(x + 700 * s, hy + 1); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (kind === 'city') {   // the Statue of Liberty on its island, out in front (right of the skyline)
    const sx = x + 470 * s, b = hy;
    ctx.beginPath(); ctx.moveTo(sx - 26 * s, b); ctx.lineTo(sx - 18 * s, b - 34 * s); ctx.lineTo(sx + 18 * s, b - 34 * s); ctx.lineTo(sx + 26 * s, b); ctx.fill();   // pedestal
    ctx.beginPath(); ctx.moveTo(sx - 9 * s, b - 34 * s); ctx.lineTo(sx - 7 * s, b - 70 * s); ctx.lineTo(sx - 4 * s, b - 82 * s); ctx.lineTo(sx + 4 * s, b - 82 * s); ctx.lineTo(sx + 7 * s, b - 70 * s); ctx.lineTo(sx + 9 * s, b - 34 * s); ctx.fill();   // robe
    ctx.beginPath(); ctx.arc(sx, b - 86 * s, 4.5 * s, 0, TAU); ctx.fill();   // head
    ctx.lineWidth = 3.2 * s; ctx.strokeStyle = '#07060e'; ctx.beginPath(); ctx.moveTo(sx + 5 * s, b - 76 * s); ctx.lineTo(sx + 9 * s, b - 104 * s); ctx.stroke();   // the raised arm
    ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx + 9 * s, b - 108 * s, 0, sx + 9 * s, b - 108 * s, 14 * s); g.addColorStop(0, 'rgba(255,220,150,.9)'); g.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx + 9 * s, b - 108 * s, 14 * s, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // city windows
    ctx.globalCompositeOperation = 'lighter'; const r2 = prng(909); for (let i = 0; i < 180; i++) { const wx = x + (-540 + 820 * r2()) * s, wy = hy - (8 + 190 * r2() * r2()) * s; ctx.fillStyle = rgba(r2() > .3 ? '#ffd59a' : '#cfe8ff', .5 + .4 * Math.sin(t * 2 + i)); ctx.fillRect(wx, wy, 2, 2); } ctx.globalCompositeOperation = 'source-over';
  }
  if (kind === 'atoll') {   // palms on the low island
    for (const [px, h, lean] of [[-180, 48, -.2], [-120, 56, .15], [-40, 62, -.1], [60, 52, .25], [150, 44, -.15]]) {
      const bx = x + px * s, by = hy - 8 * s, tx = bx + lean * h * s, ty = by - h * s;
      ctx.strokeStyle = '#07060e'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + lean * h * s * .2, by - h * s * .6, tx, ty); ctx.stroke();
      ctx.lineWidth = 2.4 * s; for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .55 + .1 * Math.sin(t * 1.3 + k + px); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * 14 * s, ty + Math.sin(a) * 14 * s - 4 * s, tx + Math.cos(a) * 26 * s, ty + Math.sin(a) * 22 * s + 8 * s); ctx.stroke(); }
    }
  }
  ctx.restore();
}
export function coasts(ctx, t, C, s, o = {}) {
  const hy = C.hy, span = 2300, sc = o.scale ?? 1.4, base = 1920 + 600 - s * (span * 4 + 900);
  // which coast sits in the frame: its sky tint (a lighting change of the sky band)
  let best = null, bd = 1e9; COAST.forEach((k, i) => { const x = base + i * span; const dd = Math.abs(x - 960); if (dd < bd) { bd = dd; best = [k, x]; } });
  if (best && hy > 0) { const [k, x] = best, [col, a] = TINT[k], w = clamp(1 - bd / 1500); const g = ctx.createLinearGradient(0, hy - 520, 0, hy); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a * w)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, hy - 520, 1920, 520); ctx.restore(); }
  COAST.forEach((k, i) => { const x = base + i * span; if (x < -1400 || x > 3300) return; shapeAt(ctx, k, x, hy, sc, t); });
}

// ---------------------------------------------------------------- figures
export function standFig(ctx, t, C, P, o = {}) {
  const p = C.P(...P); if (!p) return null;
  const s = p[2] * (o.h ?? 1.75) / 184; if (s > 5 || s < .02) return null;
  const x = p[0], y = p[1] - 90 * s, pose = { head: o.head ?? -.05, lean: o.lean ?? 0, ...(o.pose || {}) };
  const fo = { t, seed: o.seed ?? 7, flip: !!o.flip, rim: o.rim || '#ffc890', light: o.light, dress: o.dress, shadow: false };
  if (o.reach) { const a = reachArm(x, y, s, pose, 0, !!o.flip, fo, o.reach); pose.sh = [a.sh, (pose.sh || [0, .15])[1]]; pose.el = [a.el, (pose.el || [0, .3])[1]]; }
  if (o.reach2) { const a = reachArm(x, y, s, pose, 1, !!o.flip, fo, o.reach2); pose.sh = [pose.sh ? pose.sh[0] : .2, a.sh]; pose.el = [pose.el ? pose.el[0] : .3, a.el]; }
  return figure(ctx, x, y, s, pose, fo);
}

// ---------------------------------------------------------------- the cliff and your house (seen from the sea)
export function cliff(ctx, t, C, o) {
  const O = o.O, z0 = o.z0, top = O[1];
  ctx.save(); ctx.lineJoin = 'round';
  const front = []; for (let i = 0; i <= 40; i++) { const x = -160 + i * 8; front.push([x, top + .6 * Math.sin(x * .3) - (Math.abs(x) > 30 ? (Math.abs(x) - 30) * .05 : 0), z0 + 2 * Math.sin(x * .11)]); }
  const F = projPoly(C, [...front, [160, 0, z0 + 4], [-160, 0, z0 + 4]], .3);
  if (fillPoly(ctx, F, '#0b0a14')) { for (const run of projRuns(C, front, .3)) { ctx.strokeStyle = rgba('#7e8ab8', .35); ctx.lineWidth = 1.3; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  fillPoly(ctx, projPoly(C, [[-160, top, z0], [160, top, z0], [160, top, z0 - 300], [-160, top, z0 - 300]], .3), '#0a0912');
  // the house: the wall facing the sea (z = O.z + .62) with the window opening, a pitched roof
  const wz = O[2] + .62, X = (x) => O[0] + x, Y = (y) => O[1] + y, win = [[X(-.55), Y(1.98), wz], [X(.55), Y(1.98), wz], [X(.55), Y(.98), wz], [X(-.55), Y(.98), wz]];
  const wall = [[X(-3.4), Y(0), wz], [X(3.4), Y(0), wz], [X(3.4), Y(2.9), wz], [X(-3.4), Y(2.9), wz]];
  const WP = projPoly(C, win), WL = projPoly(C, wall);
  if (WL.length > 2 && WP.length === 4) {
    ctx.save(); ctx.beginPath(); WL.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    WP.slice().reverse().forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    ctx.fillStyle = '#16121c'; ctx.fill('evenodd'); ctx.restore();
    // the lamp's light spills out of the window onto the wall
    const c = WP.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]), R = Math.hypot(WP[1][0] - WP[0][0], WP[1][1] - WP[0][1]) * 2.2;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g.addColorStop(0, rgba('#ffb35c', .22)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, TAU); ctx.fill(); ctx.restore();
    const roof = projPoly(C, [[X(-3.8), Y(2.9), wz + .4], [X(3.8), Y(2.9), wz + .4], [X(3.8), Y(4.6), wz - 2.2], [X(-3.8), Y(4.6), wz - 2.2]]); fillPoly(ctx, roof, '#0d0b14'); ctx.strokeStyle = rgba('#7e8ab8', .3); ctx.lineWidth = 1.2; ctx.stroke();
  }
  ctx.restore();
  return { win: WP.length === 4 ? WP : null };
}

// ---------------------------------------------------------------- the rolled plan and its flakes (room coordinates)
const PLAN = { x: .2, z: .18, L: .46, r: .035 };
export function plan(ctx, t, C, o = {}) {
  const b = clamp(o.burn ?? 0), x0 = PLAN.x - PLAN.L / 2, x1 = PLAN.x + PLAN.L / 2 - b * PLAN.L * .95, y = .76 + PLAN.r, z = PLAN.z;
  if (x1 - x0 < .01) return null;
  const A = C.P(x0, y, z), B = C.P(x1, y, z); if (!A || !B) return null;
  const rr = PLAN.r * A[2];
  ctx.save(); ctx.lineCap = 'butt';
  ctx.strokeStyle = '#d8c49a'; ctx.lineWidth = rr * 2; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  ctx.strokeStyle = 'rgba(90,60,30,.45)'; ctx.lineWidth = rr * .9; ctx.beginPath(); ctx.moveTo(A[0], A[1] + rr * .5); ctx.lineTo(B[0], B[1] + rr * .5); ctx.stroke();
  ctx.fillStyle = '#b89a6a'; ctx.beginPath(); ctx.ellipse(A[0], A[1], rr * .45, rr, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(80,50,20,.6)'; ctx.lineWidth = 1; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.ellipse(A[0], A[1], rr * .45 * k / 4, rr * k / 4, 0, 0, TAU); ctx.stroke(); }
  if (b > 0) {   // the ember edge: charred, glowing, small flames
    ctx.fillStyle = '#1a0e08'; ctx.beginPath(); ctx.ellipse(B[0], B[1], rr * .5, rr * 1.05, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ff8a3a', .9); ctx.lineWidth = Math.max(1.5, rr * .25); ctx.beginPath(); ctx.ellipse(B[0], B[1], rr * .5, rr * 1.05, 0, 0, TAU); ctx.stroke();
    flames(ctx, t, B[0], B[1] + rr * .4, rr * 4);
  }
  ctx.restore();
  return [B[0], B[1]];
}
const FLK = Array.from({ length: 70 }, (_, i) => ({ d: hash(i * 1.3) * 2.6, vx: (hash(i * 2.7) - .5) * .25, vz: .35 + .4 * hash(i * 3.9), vy: .35 + .3 * hash(i * 5.1), sp: 3 + 6 * hash(i * 6.3), s: .008 + .01 * hash(i * 8.1) }));
export function flakes(ctx, t, C, u, o = {}) {
  ctx.save();
  for (const f of FLK) {
    const a = u - f.d; if (a <= 0 || a > 3) continue;
    const bx = PLAN.x + PLAN.L / 2 - Math.min(1, f.d / 2.6) * PLAN.L * .95;
    const P = [bx + f.vx * a + .04 * Math.sin(a * 3 + f.sp), .8 + f.vy * a + .02 * Math.sin(a * f.sp), PLAN.z + f.vz * a * a * .6];
    if (o.side === 'in' && P[2] > .62) continue; if (o.side === 'out' && P[2] <= .62) continue;
    const p = C.P(...P); if (!p) continue;
    const r = f.s * p[2]; if (r < .5 || r > 300) continue;
    const ang = a * f.sp, cs = Math.cos(ang);
    // a charred scrap (grey-brown, catching the lamp) with an ember glowing along one torn edge only
    const ry = Math.max(.5, r * Math.abs(cs) * .7), rot = ang * .3;
    ctx.fillStyle = mixHex('#2a1e18', '#6a5444', .5 + .5 * Math.sin(ang)); ctx.beginPath(); ctx.ellipse(p[0], p[1], r, ry, rot, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba('#ff9a4a', .85 * clamp(1 - a / 2.4)); ctx.lineWidth = Math.max(.8, r * .2); ctx.beginPath(); ctx.ellipse(p[0], p[1], r, ry, rot, .2 + f.sp, 1.4 + f.sp); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the rising sun
export function sun(ctx, t, C, el, a = 1) {
  const p = C.D(...skyDir(0, el)); if (!p || a <= 0) return null;
  const R = 22 * C.F / 1400;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(p[0], p[1], R * .6, p[0], p[1], R * 14); g.addColorStop(0, rgba('#ffd59a', .55 * a)); g.addColorStop(.3, rgba('#ff9a5a', .18 * a)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], R * 14, 0, TAU); ctx.fill();
  ctx.restore();
  // the disc, cut by the horizon (the sea in front hides its lower part)
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1920, Math.max(0, C.hy)); ctx.clip(); ctx.fillStyle = rgba('#fff1d6', a); ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.fill(); ctx.restore();
  return p;
}
