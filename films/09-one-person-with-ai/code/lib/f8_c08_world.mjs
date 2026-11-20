// Film 8 · B2 world for c08 (07a scale → 08a instruments for all). Owner: B2. Other builders may import, never edit.
// Builds on lib/f8_c07_world.mjs (one perspective camera over one ground plane, warm paper at dusk).
//   ribbon(ctx, t, cam, pts, o)        a stream of light on the ground: pts [[X,Z]…], o { w (world), col, core, a, flow (speed), u 0..1 drawn length }
//   groundQuad(ctx, cam, X, Z, w, h, rot, fn)   draw fn(ctx) in local units (0..w, 0..h) on the ground (affine; exact top-down)
//   learnRoom(ctx, lw, o)              the open learning room (local units, ~220 wide): bright back wall, practice stations
//   companyHall(ctx, lw, t, o)         a larger firm (local units, ~300 wide, ~170 tall): two storeys of lit windows, sawtooth roof, the open door (o.door 0..1 glow)
//   weirWall(ctx, lw, t, o)            an engraved weir across the stream with a sluice wheel and the board on top (local units, ~260 wide)
//   fieldRows(ctx, t, cam, o)          a farm field: furrows + plants in farm green, on the ground
import { W, H, rgba, clamp, mix, sm, prng } from '../engine.mjs';
import { offsetPath, DAY, glow } from './f8_c07_world.mjs';

const TAU = Math.PI * 2;

// a stream of light lying on the ground
export function ribbon(ctx, t, cam, pts, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0 || pts.length < 2) return;
  // cut the polyline to the drawn length
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const end = L[L.length - 1] * u, P = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (L[i] <= end) P.push(pts[i]); else { const k = (end - L[i - 1]) / (L[i] - L[i - 1]); P.push([mix(pts[i - 1][0], pts[i][0], k), mix(pts[i - 1][1], pts[i][1], k)]); break; } }
  if (P.length < 2) return;
  const w = typeof o.w === 'function' ? o.w : () => o.w ?? 40, A = o.a ?? 1;
  // the band as a polygon (both edges), near-plane culled per vertex
  const left = [], right = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], tx = b[0] - a[0], tz = b[1] - a[1], l = Math.hypot(tx, tz) || 1, ww = w(i / (P.length - 1)) / 2;
    const p1 = cam.P(P[i][0] + tz / l * ww, 0, P[i][1] - tx / l * ww), p2 = cam.P(P[i][0] - tz / l * ww, 0, P[i][1] + tx / l * ww);
    if (p1 && p2) { left.push(p1); right.push(p2); }
  }
  if (left.length < 2) return;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(left[0][0], left[0][1]); for (const p of left.slice(1)) ctx.lineTo(p[0], p[1]); for (const p of right.reverse()) ctx.lineTo(p[0], p[1]); ctx.closePath();
  ctx.fillStyle = rgba(o.col || '#f0c063', .82 * A); ctx.fill();
  ctx.strokeStyle = rgba(o.edge || '#a8742c', .7 * A); ctx.lineWidth = 1.2; ctx.stroke();
  ctx.clip();
  // the flow: bright streaks travelling along the centre line
  const C = []; for (const q of P) { const p = cam.P(q[0], 0, q[1]); if (p) C.push(p); }
  ctx.lineCap = 'round'; ctx.strokeStyle = rgba(o.core || '#fff4d2', .85 * A); ctx.lineWidth = Math.max(1.5, (o.coreW ?? 3));
  ctx.setLineDash([26, 34]); ctx.lineDashOffset = -t * (o.flow ?? 90);
  ctx.beginPath(); ctx.moveTo(C[0][0], C[0][1]); for (const p of C.slice(1)) ctx.lineTo(p[0], p[1]); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
  return C;
}

// draw on the ground plane in local units (x 0..w right, y 0..h toward −Z, i.e. "up" the ground): affine from three projected corners
export function groundQuad(ctx, cam, X, Z, w, h, rot, fn, o = {}) {
  const c = Math.cos(rot), s = Math.sin(rot), at = (lx, ly) => [X + lx * c + ly * s, Z - (-lx * s + ly * c)], Y = o.Y ?? 0;
  // local (0,0) = top-left corner = far-left; y grows toward the camera (−Z); o.Y lifts the quad (a falling sheet)
  const o0 = at(0, 0), ox = at(w, 0), oy = at(0, h);
  const P0 = cam.P(o0[0], Y, o0[1]), PX = cam.P(ox[0], Y, ox[1]), PY = cam.P(oy[0], Y, oy[1]); if (!P0 || !PX || !PY) return null;
  if (Math.min(P0[2], PX[2], PY[2]) < .25 * Math.max(P0[2], PX[2], PY[2])) return null;
  ctx.save(); ctx.transform((PX[0] - P0[0]) / w, (PX[1] - P0[1]) / w, (PY[0] - P0[0]) / h, (PY[1] - P0[1]) / h, P0[0], P0[1]); fn(ctx); ctx.restore();
  return { P0, PX, PY };
}

// the learning room: an open hall, its back wall bright (local units, ground y 0, ~220 wide, ~150 tall)
export function learnRoom(ctx, lw, o = {}) {
  const ink = DAY.ink; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (o.part !== 'front') learnBack(ctx, lw);
  if (o.part !== 'back') learnFront(ctx, lw);
}
function learnBack(ctx, lw) {
  const ink = DAY.ink;
  const g = ctx.createLinearGradient(0, -100, 0, 0); g.addColorStop(0, '#fff2d0'); g.addColorStop(1, '#ffe0a0'); ctx.fillStyle = g; ctx.fillRect(-100, -100, 200, 100);
  ctx.strokeStyle = rgba(ink, .14); ctx.lineWidth = lw * .5; ctx.beginPath(); for (let x = -100; x < 100; x += 5) { ctx.moveTo(x, -100); ctx.lineTo(x, 0); } ctx.stroke();
  // a slate on the back wall with chalk marks (practice), a long table
  ctx.fillStyle = '#857f70'; ctx.fillRect(-60, -84, 120, 34); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.strokeRect(-60, -84, 120, 34);
  ctx.strokeStyle = 'rgba(240,235,220,.7)'; ctx.lineWidth = lw * .8; ctx.beginPath(); for (let k = 0; k < 5; k++) { const x = -50 + k * 24; ctx.moveTo(x, -62); ctx.quadraticCurveTo(x + 6, -76, x + 14, -66); } ctx.stroke();
}
function learnFront(ctx, lw) {
  const ink = DAY.ink;
  // front frame: posts, a low gable with a round window
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.fillStyle = '#efdfbd'; ctx.beginPath(); ctx.moveTo(-112, -100); ctx.lineTo(0, -140); ctx.lineTo(112, -100); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(ink, .32); ctx.lineWidth = lw * .6; ctx.beginPath(); for (let x = -120; x < 120; x += 5) { ctx.moveTo(x, -100); ctx.lineTo(x + 16, -142); } ctx.stroke(); ctx.restore();
  ctx.beginPath(); ctx.arc(0, -116, 9, 0, TAU); ctx.fillStyle = '#ffe3a6'; ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e9d6ae'; for (const x of [-112, 102]) { ctx.fillRect(x, -100, 10, 100); ctx.strokeRect(x, -100, 10, 100); }
  ctx.fillRect(-112, -104, 224, 6); ctx.strokeRect(-112, -104, 224, 6);
  ctx.strokeStyle = rgba(ink, .4); ctx.lineWidth = lw * .7; ctx.beginPath(); for (let x = -114; x < 116; x += 6) { ctx.moveTo(x, 2); ctx.lineTo(x - 5, 7); } ctx.stroke();
}

// the weir: a stone wall across the stream, a sluice gate, a big hand wheel on top and the board standing at it (local units)
export function weirWall(ctx, lw, t, o = {}) {
  const ink = DAY.ink, wa = o.wheel ?? 0; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // wall with engraved courses
  ctx.fillStyle = '#e6d3ab'; ctx.fillRect(-130, -46, 260, 46); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.strokeRect(-130, -46, 260, 46);
  ctx.strokeStyle = rgba(ink, .45); ctx.lineWidth = lw * .7; ctx.beginPath();
  for (let r = 0; r < 4; r++) { const y = -46 + r * 11.5; ctx.moveTo(-130, y); ctx.lineTo(130, y); for (let x = -130 + (r % 2) * 9; x < 130; x += 18) { ctx.moveTo(x, y); ctx.lineTo(x, y + 11.5); } }
  ctx.stroke();
  // the sluice opening and its gate (gate slides with o.gate 0..1)
  const gx = mix(-60, 20, clamp(o.gate ?? 0));
  ctx.fillStyle = '#3a3128'; ctx.fillRect(-70, -26, 100, 26); ctx.fillStyle = '#ffd98a'; ctx.fillRect(gx + 40 > 30 ? -70 : gx + 40, -24, 0, 0);
  ctx.fillStyle = '#c9b48a'; ctx.fillRect(gx, -30, 40, 30); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.strokeRect(gx, -30, 40, 30);
  ctx.beginPath(); for (let y = -26; y < 0; y += 5) { ctx.moveTo(gx + 3, y); ctx.lineTo(gx + 37, y); } ctx.strokeStyle = rgba(ink, .5); ctx.stroke();
  // the hand wheel on a post (turns by wa radians)
  ctx.strokeStyle = ink; ctx.lineWidth = lw * 1.3; ctx.beginPath(); ctx.moveTo(60, -46); ctx.lineTo(60, -62); ctx.stroke();
  ctx.save(); ctx.translate(60, -78); ctx.rotate(wa); ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.lineWidth = lw * 2; ctx.stroke(); ctx.lineWidth = lw;
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 16); ctx.moveTo(Math.cos(a) * 16, Math.sin(a) * 16); ctx.lineTo(Math.cos(a) * 21, Math.sin(a) * 21); }
  ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 3, 0, TAU); ctx.fillStyle = ink; ctx.fill(); ctx.restore();
}

// a farm field: furrows in perspective, plant tufts in farm green
export function fieldRows(ctx, t, cam, o = {}) {
  const X0 = o.X0, X1 = o.X1, Z0 = o.Z0, Z1 = o.Z1, n = o.rows ?? 9, green = '#5f8f6a';
  // ground tint
  const q = [[X0, Z0], [X1, Z0], [X1, Z1], [X0, Z1]].map(([x, z]) => cam.P(x, 0, z)); if (q.some((p) => !p)) return;
  ctx.save(); ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); for (const p of q.slice(1)) ctx.lineTo(p[0], p[1]); ctx.closePath(); ctx.fillStyle = rgba('#c8b07a', .55); ctx.fill(); ctx.clip();
  const r = prng(77);
  for (let i = 0; i < n; i++) {
    const X = mix(X0, X1, (i + .5) / n), a = cam.P(X, 0, Z0), b = cam.P(X, 0, Z1); if (!a || !b) continue;
    ctx.strokeStyle = rgba(DAY.ink, .45); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    for (let z = Z0 + 6; z < Z1; z += 9) {
      const p = cam.P(X + (r() - .5) * 2, 0, z); if (!p) continue; const s = cam.F * 4.2 / p[2]; if (s < .8) continue;
      ctx.fillStyle = green; ctx.strokeStyle = rgba(DAY.ink, .7); ctx.lineWidth = Math.max(.6, s * .12);
      ctx.beginPath(); for (let k = 0; k < 3; k++) { const an = -Math.PI / 2 + (k - 1) * .5 + .08 * Math.sin(t * 1.4 + z); ctx.ellipse(p[0] + Math.cos(an) * s * .5, p[1] + Math.sin(an) * s * .5, s * .55, s * .2, an, 0, TAU); } ctx.fill(); ctx.stroke();
    }
  }
  ctx.restore();
}

// a larger firm: two storeys, sawtooth roof, lit windows, a broad open door that glows gold (local units, ground y 0)
export function companyHall(ctx, lw, t, o = {}) {
  const ink = DAY.ink, dg = clamp(o.door ?? 1); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // wing behind (gives mass)
  ctx.fillStyle = '#eadbbb'; ctx.fillRect(-170, -120, 90, 120); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.strokeRect(-170, -120, 90, 120);
  ctx.strokeStyle = rgba(ink, .3); ctx.lineWidth = lw * .5; ctx.beginPath(); for (let x = -170; x < -80; x += 4) { ctx.moveTo(x, -120); ctx.lineTo(x + 3, 0); } ctx.stroke();
  // main block
  ctx.fillStyle = DAY.wall; ctx.fillRect(-150, -110, 300, 110); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.strokeRect(-150, -110, 300, 110);
  ctx.strokeStyle = rgba(ink, .16); ctx.lineWidth = lw * .5; ctx.beginPath(); for (let x = -150; x < 150; x += 5) { ctx.moveTo(x, -110); ctx.lineTo(x + 4, 0); } ctx.stroke();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-150, -56); ctx.lineTo(150, -56); ctx.stroke();
  // sawtooth roof (5 teeth)
  ctx.beginPath(); ctx.moveTo(-152, -110); for (let q = 0; q < 5; q++) { const x0 = -152 + q * 60.8; ctx.lineTo(x0, -150); ctx.lineTo(x0 + 60.8, -110); } ctx.closePath(); ctx.fillStyle = DAY.roof; ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(ink, .35); ctx.lineWidth = lw * .6; ctx.beginPath(); for (let x = -160; x < 160; x += 4) { ctx.moveTo(x, -110); ctx.lineTo(x + 16, -152); } ctx.stroke(); ctx.restore();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-152, -110); for (let q = 0; q < 5; q++) { const x0 = -152 + q * 60.8; ctx.lineTo(x0, -150); ctx.lineTo(x0 + 60.8, -110); } ctx.closePath(); ctx.stroke();
  // chimney
  ctx.fillStyle = '#dcc79c'; ctx.fillRect(96, -176, 14, 40); ctx.strokeRect(96, -176, 14, 40);
  // windows, two rows, lit warm
  for (const y of [-100, -46]) for (let q = 0; q < 12; q++) { const x = -140 + q * 23.5; if (y > -56 && x > -30 && x < 40) continue; ctx.fillStyle = mixHex2('#dcc9a2', '#ffc978', .85); ctx.fillRect(x, y, 13, 30); ctx.strokeStyle = ink; ctx.lineWidth = lw * .8; ctx.strokeRect(x, y, 13, 30); }
  // the broad open door (the savings flow out of it)
  ctx.fillStyle = mixHex2('#5a4a36', '#ffd98a', dg); ctx.fillRect(-26, -44, 52, 44); ctx.strokeStyle = ink; ctx.lineWidth = lw * 1.2; ctx.strokeRect(-26, -44, 52, 44);
  if (dg > 0) { const g = ctx.createRadialGradient(0, -6, 0, 0, -6, 60); g.addColorStop(0, rgba('#fff2c8', .9 * dg)); g.addColorStop(1, rgba('#ffd98a', 0)); ctx.fillStyle = g; ctx.fillRect(-60, -60, 120, 60); }
  ctx.strokeStyle = rgba(ink, .4); ctx.lineWidth = lw * .7; ctx.beginPath(); for (let x = -148; x < 152; x += 6) { ctx.moveTo(x, 2); ctx.lineTo(x - 5, 8); } ctx.stroke();
}
function mixHex2(a, b, k) { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(mix(v, B[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }

// a flat sheet anywhere in space: centre C [X,Y,Z], unit axes ex (local x) and ey (local y, "down" the sheet), size w × h world units;
// fn(ctx) draws in local units 0..w, 0..h (affine from three projected corners; small sheets only)
export function quad3(ctx, cam, C, ex, ey, w, h, fn) {
  const O = [C[0] - ex[0] * w / 2 - ey[0] * h / 2, C[1] - ex[1] * w / 2 - ey[1] * h / 2, C[2] - ex[2] * w / 2 - ey[2] * h / 2];
  const P0 = cam.P(O[0], O[1], O[2]), PX = cam.P(O[0] + ex[0] * w, O[1] + ex[1] * w, O[2] + ex[2] * w), PY = cam.P(O[0] + ey[0] * h, O[1] + ey[1] * h, O[2] + ey[2] * h);
  if (!P0 || !PX || !PY || Math.min(P0[2], PX[2], PY[2]) < .25 * Math.max(P0[2], PX[2], PY[2])) return null;
  ctx.save(); ctx.transform((PX[0] - P0[0]) / w, (PX[1] - P0[1]) / w, (PY[0] - P0[0]) / h, (PY[1] - P0[1]) / h, P0[0], P0[1]); fn(ctx); ctx.restore();
  return { P0, PX, PY };
}
