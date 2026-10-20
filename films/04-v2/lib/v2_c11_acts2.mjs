// c11 (Film 4 v2) · the other acts of the cut-away esteem street (11.06–11.11), see lib/v2_c11_acts.mjs for the potter and the dancer.
//   violin   · a person of forty plays; engraved staff lines leave the violin and drift out through the window (from st.busy.violin)
//   joiner   · an old man guides a child's hands on a hand plane at the bench; a shaving curls out of the mouth on every stroke
//   office   · paper stacks, empty desks, a cold tube light; from st.busy.office a front runs across it: behind the front every line turns
//              into dotted ghost lines that rise and thin out like smoke, room and all (no alpha fade: the dots get sparse and small)
//   passage  · what the office leaves: a covered passage through the house, arches at the back onto a lit stair, a notice board at its
//              mouth with two notices (money · a river being cleaned and a school roof going up); people stand at the second, heads
//              turning (st.busy.gather); a woman pins a new blank notice (st.busy.pin) whose paper IS the next chunk's plate (st.plate)
//   VIGN     · small life in every other room (a family at the table, a child at the piano, a sewing table, a model plane, washing,
//              a reader under a floor lamp, a cook, a painter at the easel)
// Geometry: hill units (1 ≈ 0.23 m), V.P(x, y, d) → [sx, sy, px per unit]; people via lib/v2_c11_people.mjs (hip joint, s ≈ px/m / 105.7).
import { W, H, rgba, clamp, mix, lin, sm, prng, TAU, eoX, eiX, qio, qo, u01, putGlow, mixHex, shadeHex, hash } from './v2_c11_kit.mjs';
import { person, kid, reachArm, walk } from './v2_c11_people.mjs';
import { box, pot } from './v2_c11_acts.mjs';

const MPU = .23, FOC = 1400;
const figS = (V, d) => FOC / Math.max(.05, V.D + d) / MPU / 105.7;
const U = (m) => m / MPU;
function quad(ctx, V, pts) { ctx.beginPath(); pts.forEach(([x, y, d], i) => { const [sx, sy] = V.P(x, y, d); i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); }); ctx.closePath(); }
const seg3 = (ctx, V, a, b) => { const p = V.P(a[0], a[1], a[2]), q = V.P(b[0], b[1], b[2]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
const lightOf = (V, L) => { const P = V.P(L.x, L.y + .4, L.d); return { x: P[0], y: P[1], col: '#ffcf8a', a: .6 }; };
const fo = (t, seed, dress, V, L, extra = {}) => ({ t, seed, dress, light: lightOf(V, L), rim: '#ffcf8a', rimW: 1.1, shadow: false, ...extra });
// a standing person whose feet are on the floor at (x, fl, d)
function standAt(V, x, fl, d) { const s = figS(V, d), P = V.P(x, fl, d); return { s, hx: P[0], hy: P[1] - 88 * s }; }
// 2-link IK for a child's arm (kid() rig: armU 17, armL 15.5, shoulder ±2.9, −31.8 from the hip, child units × s)
function kidArm(px, py, s, lean, flip, i, tx, ty, elbow = 1) {
  const f = flip ? -1 : 1; let ux = (tx - px) / (s * f), uy = (ty - py) / s; const c = Math.cos(-lean), sn = Math.sin(-lean); [ux, uy] = [ux * c - uy * sn, ux * sn + uy * c];
  const A = 17, B = 15.5, sx = i ? -2.9 : 2.9, sy = -31.8, dx = ux - sx, dy = uy - sy, d = clamp(Math.hypot(dx, dy), Math.abs(A - B) + .5, A + B - .05);
  const inner = Math.acos(clamp((A * A + B * B - d * d) / (2 * A * B), -1, 1)), alpha = Math.acos(clamp((A * A + d * d - B * B) / (2 * A * d), -1, 1)), base = Math.atan2(dx, dy);
  return elbow > 0 ? { sh: base - alpha, el: Math.PI - inner } : { sh: base + alpha, el: inner - Math.PI };
}

// ================================================================ 11.07 the violin at forty
export function VIOLIN(ctx, t, V, S, R, st, L) {
  const fl = R.y1, w = R.x1 - R.x0, xv = R.x0 + w * .52, dv = 7.5, flip = true, f = -1;
  const { s, hx, hy } = standAt(V, xv, fl, dv);
  const F = (fx, fy) => [hx + fx * s * f, hy + fy * s];                    // figure units (facing right) → screen
  // the violin along its axis from the chin, forward and a little up; the bow crosses the strings near the bridge
  const ax = [.984, -.179], A0 = [9, -75], VP = (k, n = 0) => F(A0[0] + ax[0] * k - ax[1] * n, A0[1] + ax[1] * k + ax[0] * n);
  const bowU = .5 - .5 * Math.cos(TAU * (t - 300) / 1.7), cK = 12, C = VP(cK, -2.2), ub = [-.36 * f, .93], fr = 8 + 40 * bowU, BL = 58;
  const frog = [C[0] + ub[0] * fr * s, C[1] + ub[1] * fr * s], tip = [C[0] - ub[0] * (BL - fr) * s, C[1] - ub[1] * (BL - fr) * s];
  const dress = { coat: '#4a5a6e', pants: '#2a2632', shoes: '#1c1414', skin: '#d4a684', hair: '#4a3a30', shirt: '#d8ccb4' };
  const pose = { head: .2, lean: .02, sh: [.8, .9], el: [1, 1], hair: 'short', hands: ['grip', 'grip'] };
  const oo = fo(t, 27, dress, V, L, { flip });
  const a0 = reachArm(hx, hy, s, pose, 0, flip, oo, [frog[0] + 1.5 * s * f, frog[1] + .5 * s], -1);
  const nk = VP(37, 1.2), a1 = reachArm(hx, hy, s, pose, 1, flip, oo, nk, 1);
  pose.sh = [a0.sh, a1.sh]; pose.el = [a0.el, a1.el];
  person(ctx, hx, hy, s, pose, { ...oo, part: 'body' });
  // the violin: varnished body (a figure of eight along the axis), neck, scroll, strings
  const prof = [[0, 2.6], [5, 4.2], [11, 3.6], [15, 2.4], [20, 3.2], [26, 3.7], [31, 2.0], [32, 1.1], [49, .9], [50, 1.5]];
  ctx.beginPath(); prof.forEach(([k, n], i) => { const p = VP(k, -n); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); for (let i = prof.length - 1; i >= 0; i--) { const p = VP(prof[i][0], prof[i][1]); ctx.lineTo(p[0], p[1]); } ctx.closePath();
  const g = ctx.createLinearGradient(VP(0)[0], VP(0, -4)[1], VP(0)[0], VP(0, 4)[1]); g.addColorStop(0, '#d0782e'); g.addColorStop(.5, '#8a3a16'); g.addColorStop(1, '#4a1a0a');
  ctx.fillStyle = g; ctx.fill();
  const sc = VP(51.5, 0); ctx.fillStyle = '#5a240e'; ctx.beginPath(); ctx.arc(sc[0], sc[1], 1.7 * s, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(240,226,200,.8)'; ctx.lineWidth = Math.max(.6, .35 * s); ctx.beginPath(); const s0 = VP(3, -.5), s1 = VP(50, -.3); ctx.moveTo(s0[0], s0[1]); ctx.lineTo(s1[0], s1[1]); ctx.stroke();
  const br = VP(10, -2.8); ctx.fillStyle = '#e8d2a8'; ctx.fillRect(br[0] - .6 * s, br[1] - .3 * s, 1.2 * s, 2.4 * s);
  // the bow: stick and hair, moving along its length
  ctx.lineCap = 'round'; ctx.strokeStyle = '#3a2214'; ctx.lineWidth = Math.max(1, .9 * s); ctx.beginPath(); ctx.moveTo(frog[0], frog[1]); ctx.lineTo(tip[0] - .8 * s, tip[1]); ctx.stroke();
  ctx.strokeStyle = 'rgba(244,236,220,.85)'; ctx.lineWidth = Math.max(.6, .45 * s); ctx.beginPath(); ctx.moveTo(frog[0] + 1 * s, frog[1] + .3 * s); ctx.lineTo(tip[0] + .4 * s, tip[1] + .2 * s); ctx.stroke();
  ctx.fillStyle = '#1a1010'; ctx.beginPath(); ctx.arc(frog[0], frog[1], 1.3 * s, 0, TAU); ctx.fill();
  person(ctx, hx, hy, s, pose, { ...oo, part: 'front', rim: null });
  // staff lines: they leave the violin, swing through the room and out through the window (the part beyond it is seen through it)
  const t0 = st.busy?.violin ?? 1e9, grow = eoX(u01(t, t0 - .1, t0 + 1.8)); if (grow <= 0) return;
  const wx0 = R.x0 + 6, wx1 = R.x0 + 12, wy0 = R.y0 + 2.5, wy1 = R.y1 - 5, P0 = [xv - 3.2, fl - 7.9, dv - .2], P1 = [(wx0 + wx1) / 2 - 1, (wy0 + wy1) / 2 - .5, R.d1 + 7];
  const N = 46, pts = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N * grow, e = u * u * (3 - 2 * u), x = mix(P0[0], P1[0], u) + Math.sin(u * 5 + .6) * 2.2 * (1 - u), d = mix(P0[2], P1[2], e);
    const y = mix(P0[1], P1[1], u) - Math.sin(u * Math.PI) * 2.6 + Math.sin(u * 9 - (t - t0) * 2.4) * .45 * Math.min(1, u * 4);
    pts.push([x, y, d, u]);
  }
  const winQ = [V.P(wx0, wy0, R.d1 - .02), V.P(wx1, wy0, R.d1 - .02), V.P(wx1, wy1, R.d1 - .02), V.P(wx0, wy1, R.d1 - .02)];
  for (const pass of [0, 1]) {   // 0: inside the room (d < back wall), 1: beyond, clipped to the window
    ctx.save();
    if (pass) { ctx.beginPath(); winQ.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip(); }
    for (let k = -2; k <= 2; k++) {
      ctx.strokeStyle = rgba('#f6e6c4', .82); ctx.lineWidth = Math.max(.7, V.P(P0[0], P0[1], dv)[2] * .045); ctx.beginPath(); let on = false;
      for (const [x, y, d] of pts) { const inside = d < R.d1; if (inside === !!pass) { on = false; continue; } const p = V.P(x, y + k * .32, d); on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; }
      ctx.stroke();
    }
    // note heads riding on the staff
    for (let m = 0; m < 6; m++) {
      const u = ((m / 6 + (t - t0) * .16) % 1) * grow, i = Math.min(N, Math.round(u / Math.max(.001, grow) * N)), p3 = pts[i]; if (!p3) continue;
      if ((p3[2] < R.d1) === !!pass) continue;
      const lv = [-1.5, .5, -.5, 1, 0, -1][m] * .32, p = V.P(p3[0], p3[1] + lv, p3[2]), q = p[2];
      ctx.fillStyle = rgba('#f6e6c4', .92); ctx.beginPath(); ctx.ellipse(p[0], p[1], q * .2, q * .14, -.4, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba('#f6e6c4', .92); ctx.lineWidth = Math.max(.6, q * .04); ctx.beginPath(); ctx.moveTo(p[0] + q * .18, p[1]); ctx.lineTo(p[0] + q * .18, p[1] - q * .75); ctx.stroke();
    }
    ctx.restore();
  }
}

// ================================================================ 11.08 the craft your grandfather knew
export function JOINER(ctx, t, V, S, R, st, L) {
  const fl = R.y1, w = R.x1 - R.x0, bx0 = R.x0 + w * .3, bx1 = bx0 + 8.5, bt = fl - 3.75, bd0 = 6.0, bd1 = 8.6;
  // the stroke: forward with the cut (0 … .62), back lifted (.62 … 1)
  const Tp = 1.9, ph = (((t - 300) / Tp) % 1 + 1) % 1, fwd = ph < .62, k = fwd ? qio(ph / .62) : 1 - qio((ph - .62) / .38), lift = fwd ? 0 : Math.sin(Math.PI * (ph - .62) / .38) * .22;
  const px = mix(bx0 + 3.5, bx0 + 4.4, k), pd = 7.3, ptop = bt - .2, ph0 = .38;
  const lt = lightOf(V, L), sAd = figS(V, 9.9), sKid = figS(V, 9.1) * 1.15;
  // the grandfather (behind the child), leaning over him; his hands come over the child's on the plane
  const G = standAt(V, bx0 + 1.5, fl, 9.9), gDress = { coat: '#5a4a3c', pants: '#2c2824', shoes: '#1a1410', skin: '#d0a07c', hair: '#d8d4cc', shirt: '#cfc6b0' };
  const knob = V.P(px + .5, ptop - lift - ph0 - .15, pd), tote = V.P(px - .3, ptop - lift - ph0 - .3, pd);
  const gPose = { lean: .44, head: .3, sh: [1, 1], el: [.6, .6], hair: 'short', bulk: 1.02, hands: ['open', 'open'] }, gO = fo(t, 63, gDress, V, L, { smile: .5 });
  const g0 = reachArm(G.hx, G.hy, sAd, gPose, 0, false, gO, [knob[0] + .3 * sAd, knob[1] - 4 * sAd], 1), g1 = reachArm(G.hx, G.hy, sAd, gPose, 1, false, gO, [tote[0], tote[1] - 4 * sAd], 1);
  gPose.sh = [g0.sh, g1.sh]; gPose.el = [g0.el, g1.el];
  person(ctx, G.hx, G.hy, sAd, gPose, { ...gO, part: 'body' });
  // the bench: top, front apron, legs, a vice; shavings on the floor in front of it
  for (const [x, d] of [[bx0 + .3, bd1 - .3], [bx1 - .7, bd1 - .3]]) box(ctx, V, x, bt + .45, d - .45, x + .45, fl, d, '#4a3424');
  for (const [x, d] of [[bx0 + .3, bd0 + .15], [bx1 - .7, bd0 + .15]]) box(ctx, V, x, bt + .45, d, x + .45, fl, d + .45, '#5a3e2a');
  box(ctx, V, bx0 + .3, fl - 1.1, bd0 + .3, bx1 - .3, fl - .8, bd0 + .55, '#4a3424');
  box(ctx, V, bx0, bt, bd0, bx1, bt + .45, bd1, '#9a7048', { top: '#c49a68', line: 'rgba(40,24,12,.4)' });
  box(ctx, V, bx1 - 1.1, bt + .1, bd0 - .35, bx1 - .2, bt + 1.2, bd0, '#6a4a30');
  // the plank on the bench
  box(ctx, V, bx0 + 1.0, bt - .2, 6.9, bx0 + 7.4, bt, 7.7, '#d8b07a', { top: '#e8c890' });
  const rs = prng(R.seed + 4);
  const curl = (cx, cy, r, a0, turns, q, col = '#ecd2a0') => { ctx.strokeStyle = col; ctx.lineWidth = Math.max(.8, q * .07); ctx.beginPath(); for (let i = 0; i <= 28; i++) { const u = i / 28, a = a0 + u * turns * TAU, rr = r * (1 - .7 * u); const x = cx + Math.cos(a) * rr * q, y = cy + Math.sin(a) * rr * q; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); };
  for (let i = 0; i < 9; i++) { const P = V.P(bx0 - 1 + rs() * 11, fl - .1, 3.5 + rs() * 3); curl(P[0], P[1] - P[2] * .12, .18 + rs() * .1, rs() * TAU, 1.4, P[2]); }
  for (let i = 0; i < 4; i++) { const P = V.P(bx0 + 7.6 + rs() * .8, bt - .15, 6.6 + rs() * 1.6); curl(P[0], P[1] - P[2] * .1, .16 + rs() * .08, rs() * TAU, 1.3, P[2]); }
  // the plane: sole, body, the iron, the tote at the back, the knob in front
  const pq = V.P(px, ptop, pd)[2], P0 = V.P(px - .55, ptop - lift, pd), P1 = V.P(px + .6, ptop - lift - ph0, pd);
  ctx.fillStyle = '#7a5230'; ctx.beginPath(); ctx.moveTo(P0[0], P0[1]); ctx.lineTo(P1[0] + pq * .02, P0[1]); ctx.lineTo(P1[0] - pq * .08, P1[1]); ctx.lineTo(P0[0] + pq * .1, P1[1]); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a07048'; ctx.fillRect(P0[0] + pq * .1, P1[1], P1[0] - P0[0] - pq * .2, pq * .08);
  const T0 = V.P(px - .35, ptop - lift - ph0, pd); ctx.fillStyle = '#5a3820'; ctx.beginPath(); ctx.moveTo(T0[0] - pq * .12, T0[1]); ctx.quadraticCurveTo(T0[0] - pq * .3, T0[1] - pq * .5, T0[0] + pq * .05, T0[1] - pq * .55); ctx.lineTo(T0[0] + pq * .22, T0[1] - pq * .5); ctx.quadraticCurveTo(T0[0] + pq * .05, T0[1] - pq * .25, T0[0] + pq * .18, T0[1]); ctx.closePath(); ctx.fill();
  const K0 = V.P(px + .45, ptop - lift - ph0, pd); ctx.fillStyle = '#5a3820'; ctx.beginPath(); ctx.ellipse(K0[0], K0[1] - pq * .14, pq * .12, pq * .16, 0, 0, TAU); ctx.fill();
  const I0 = V.P(px + .05, ptop - lift - ph0, pd); ctx.strokeStyle = '#b8bcc4'; ctx.lineWidth = Math.max(1, pq * .07); ctx.beginPath(); ctx.moveTo(I0[0] - pq * .12, I0[1] - pq * .35); ctx.lineTo(I0[0] + pq * .1, I0[1] + pq * .3); ctx.stroke();
  // the shaving: it curls up out of the mouth during the cut, then drops behind the plane onto the bench
  const M = V.P(px + .12, ptop - lift - ph0 + .05, pd);
  if (fwd) curl(M[0] - pq * .05, M[1] - pq * (.18 + .2 * k), .12 + .2 * k, -1.2 + k * 2.2, .6 + 1.1 * k, pq, '#f2dcae');
  else { const u = (ph - .62) / .38, D0 = V.P(bx0 + 4.4 + .12 + .9 * u, bt - .2 - .52 + .45 * u * u, pd); curl(D0[0], D0[1], .32, 1 + u * 2.5, 1.7, pq, '#f2dcae'); }
  // the child on a box behind the bench (clipped to above the bench top), his hands on the tote and the knob; leaning into the stroke
  const C = standAt(V, bx0 + 3.0, fl - U(.34), 9.1), kh = C.hy + (88 * figS(V, 9.1) - 49 * sKid), lean = mix(.12, .4, k);
  const k0 = kidArm(C.hx, kh, sKid, lean, false, 0, knob[0] - .4 * sKid, knob[1] - 1 * sKid, -1), k1 = kidArm(C.hx, kh, sKid, lean, false, 1, tote[0], tote[1] - 1.5 * sKid, -1);
  const farEdge = V.P(bx0, bt, bd1)[1];
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, farEdge + 1); ctx.clip();
  kid(ctx, C.hx, kh, sKid, { lean, head: .28, sh: [k0.sh, k1.sh], el: [k0.el, k1.el] }, { t, seed: 5, age: 'child', dress: { top: '#c46a3a', pants: '#2a3048', skin: '#e2b48e', hair: '#5a3a24' }, light: lt, rim: '#ffcf8a' });
  ctx.restore();
  person(ctx, G.hx, G.hy, sAd, gPose, { ...gO, part: 'front', rim: null });
}

// ================================================================ the office (11.09) and the passage it leaves (11.10, 11.11)
function officeBoxes(R) {
  const r = prng(R.seed + 13), fl = R.y1, B = [], w = R.x1 - R.x0;
  // filing cabinets along the back wall, a wall clock is drawn apart
  for (let i = 0; i < 4; i++) B.push([R.x0 + 2 + i * 3.1, fl - 5.8, R.d1 - 1.6, R.x0 + 4.8 + i * 3.1, fl, R.d1 - .1, '#6e7680']);
  for (let i = 0; i < 4; i++) {
    const x0 = R.x0 + 4 + i * w * .23, dd = 7.2;
    B.push([x0, fl - 3.25, dd, x0 + 5.4, fl - 2.95, dd + 3, '#8a929c']);                                       // desk top
    B.push([x0 + .2, fl - 2.95, dd + .2, x0 + .6, fl, dd + 2.8, '#5e666e']); B.push([x0 + 4.8, fl - 2.95, dd + .2, x0 + 5.2, fl, dd + 2.8, '#5e666e']);
    for (let k = 0; k < 3; k++) { const h = .8 + r() * 2.4, sx = x0 + .5 + k * 1.6 + r() * .3; B.push([sx, fl - 3.25 - h, dd + .6 + r() * .6, sx + 1.25, fl - 3.25, dd + 1.6 + r() * .5, '#e4e6e2']); }
    const cx = x0 + 2.6; B.push([cx - .9, fl - 2.0, dd + 3.6, cx + .9, fl - 1.8, dd + 5.2, '#4a525a']); B.push([cx - .9, fl - 4.4, dd + 5.0, cx + .9, fl - 2.0, dd + 5.3, '#4a525a']); B.push([cx - .12, fl - 1.8, dd + 4.3, cx + .12, fl - .3, dd + 4.5, '#3a4048']);
  }
  return B;
}
const OB = new Map();
const obx = (R) => { if (!OB.has(R.seed)) OB.set(R.seed, officeBoxes(R)); return OB.get(R.seed); };
// the dissolve front (screen x) and when it passed a given screen x
const front = (V, R, dis) => { const a = V.P(R.x0 - 2, R.y1, 0)[0], b = V.P(R.x1 + 2, R.y1, 0)[0]; return mix(a, b, dis); };
export const OFFICE = {
  props(ctx, t, V, S, R, st) {
    for (const b of obx(R)) box(ctx, V, b[0], b[1], b[2], b[3], b[4], b[5], b[6], { line: 'rgba(30,36,44,.35)' });
    const c = V.P(R.x0 + R.x1 - R.x0 - 10, R.y0 + 3.2, R.d1 - .05); ctx.fillStyle = '#d8dce0'; ctx.beginPath(); ctx.arc(c[0], c[1], c[2] * 1.1, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#2a3038'; ctx.lineWidth = Math.max(.7, c[2] * .12); ctx.stroke(); ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0], c[1] - c[2] * .8); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + c[2] * .55, c[1] + c[2] * .2); ctx.stroke();
  },
  people() {},
};
export function officeClip(ctx, t, V, R, dis) {
  const xf = front(V, R, dis); ctx.beginPath(); ctx.moveTo(xf, -10); for (let y = -10; y <= H + 10; y += 30) ctx.lineTo(xf + Math.sin(y * .021 + t * 3) * 14, y); ctx.lineTo(W + 10, H + 10); ctx.lineTo(W + 10, -10); ctx.closePath(); ctx.clip();
}
export function officeSmoke(ctx, t, V, R, dis) {
  const t0 = t - dis * 1.25, xa = V.P(R.x0 - 2, R.y1, 0)[0], xb = V.P(R.x1 + 2, R.y1, 0)[0];
  const passT = (sx) => t0 + clamp((sx - xa) / (xb - xa)) * 1.25;
  const ghost = (pts3, cx, k) => {   // a dotted outline that rises and thins out after the front passed cx
    const a = (t - passT(cx)) / .95; if (a < 0 || a >= 1) return;
    const up = a * a * 7 + a * 1.5, sw = Math.sin(a * 3 + k) * a * 1.2, q = V.P(cx, R.y1, 6)[2];
    ctx.setLineDash([Math.max(1, q * .07 * (1 - a * .6)), q * (.12 + .7 * a)]); ctx.lineWidth = Math.max(.8, q * .06 * (1 - a * .5));
    ctx.beginPath(); for (const [p, r] of pts3) { const A = V.P(p[0] + sw, p[1] - up, p[2]), B = V.P(r[0] + sw, r[1] - up, r[2]); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); } ctx.stroke();
  };
  ctx.save(); ctx.strokeStyle = '#d6e2f2'; ctx.lineCap = 'round';
  const edges = (x0, y0, d0, x1, y1, d1) => [[[x0, y0, d0], [x1, y0, d0]], [[x1, y0, d0], [x1, y1, d0]], [[x1, y1, d0], [x0, y1, d0]], [[x0, y1, d0], [x0, y0, d0]], [[x0, y0, d0], [x0, y0, d1]], [[x1, y0, d0], [x1, y0, d1]], [[x0, y0, d1], [x1, y0, d1]]];
  obx(R).forEach((b, k) => ghost(edges(b[0], b[1], b[2], b[3], b[4], b[5]), V.P((b[0] + b[3]) / 2, b[4], 0)[0] * 0 + V.P((b[0] + b[3]) / 2, b[4], b[2])[0], k));
  // the room itself: back wall, the corners, floor and ceiling lines, in strips so they go with the front
  for (let i = 0; i < 8; i++) {
    const x0 = mix(R.x0, R.x1, i / 8), x1 = mix(R.x0, R.x1, (i + 1) / 8), cx = V.P((x0 + x1) / 2, R.y1, R.d1)[0];
    ghost([[[x0, R.y0, R.d1], [x1, R.y0, R.d1]], [[x0, R.y1, R.d1], [x1, R.y1, R.d1]], [[x0, R.y1, 0], [x1, R.y1, 0]], [[x0, R.y0, 0], [x1, R.y0, 0]], [[x0, R.y1 - 4, R.d1], [x1, R.y1 - 4, R.d1]]], cx, i + 20);
  }
  ghost([[[R.x0, R.y0, 0], [R.x0, R.y0, R.d1]], [[R.x0, R.y1, 0], [R.x0, R.y1, R.d1]], [[R.x0, R.y0, R.d1], [R.x0, R.y1, R.d1]]], V.P(R.x0, R.y1, 0)[0] + 1, 40);
  ghost([[[R.x1, R.y0, 0], [R.x1, R.y0, R.d1]], [[R.x1, R.y1, 0], [R.x1, R.y1, R.d1]], [[R.x1, R.y0, R.d1], [R.x1, R.y1, R.d1]]], V.P(R.x1, R.y1, 0)[0] - 1, 41);
  ctx.setLineDash([]);
  // the edge of the front: sparks of dots
  if (dis < 1) { const xf = front(V, R, dis), r = prng(Math.floor(t * 30)); ctx.fillStyle = '#e6eefa'; for (let i = 0; i < 40; i++) { const y = V.P(0, mix(R.y0, R.y1, r()), 0)[1]; ctx.beginPath(); ctx.arc(xf + Math.sin(y * .021 + t * 3) * 14 + (r() - .5) * 16, y, 1 + r() * 2, 0, TAU); ctx.fill(); } }
  ctx.restore();
}

// ---------------------------------------------------------------- the passage, the board, the people at it
export function boardGeo(S) {
  const R = S.rooms[0], xb = (R.x0 + R.x1) / 2, fl = R.y1, cy = fl - 6.0;
  const slot = (dx) => ({ x0: xb + dx - 1.3, x1: xb + dx + 1.3, y0: cy - .92, y1: cy + .92, d: 1.42 });
  return { R, xb, fl, d: 1.5, x0: xb - 4.6, x1: xb + 4.6, y0: fl - 7.6, y1: fl - 4.4, B: slot(-3), C: slot(0), A: slot(3) };
}
export function passage(ctx, t, V, S, st) {
  const G = boardGeo(S), R = G.R, fl = R.y1, near = -V.D + .25;
  if (V.D > 3) {
    // beyond the arches: a little court with a stair climbing to the next terrace, a lantern on its wall
    ctx.fillStyle = '#1c1830'; quad(ctx, V, [[R.x0, R.y0 - 6, 30], [R.x1, R.y0 - 6, 30], [R.x1, fl, 30], [R.x0, fl, 30]]); ctx.fill();
    for (let i = 0; i < 9; i++) { const d = 19 + i * 1.2, y = fl - i * .75; ctx.fillStyle = i % 2 ? '#3a3248' : '#463c56'; quad(ctx, V, [[R.x0 + 4, y - .75, d], [R.x1 - 4, y - .75, d], [R.x1 - 4, y, d], [R.x0 + 4, y, d]]); ctx.fill(); ctx.fillStyle = '#2c263a'; quad(ctx, V, [[R.x0 + 4, y - .75, d], [R.x1 - 4, y - .75, d], [R.x1 - 4, y - .75, d + 1.2], [R.x0 + 4, y - .75, d + 1.2]]); ctx.fill(); }
    const Lc = V.P(G.xb + 9, fl - 9, 29.8); putGlow(ctx, Lc[0], Lc[1], Lc[2] * 9, .45, '#ffb35c'); ctx.fillStyle = '#ffe2b0'; ctx.beginPath(); ctx.arc(Lc[0], Lc[1], Lc[2] * .45, 0, TAU); ctx.fill();
    // the back wall with three arches (an even-odd path)
    ctx.fillStyle = '#2a2232'; ctx.beginPath(); const Q = (x, y) => V.P(x, y, R.d1);
    { const a = Q(R.x0, R.y0), b = Q(R.x1, fl); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); }
    const aw = (R.x1 - R.x0) / 3; for (let i = 0; i < 3; i++) { const cx = R.x0 + aw * (i + .5), hw = aw * .36, top = fl - 8.6; const p0 = Q(cx - hw, fl), p1 = Q(cx - hw, top), c = Q(cx, top), p3 = Q(cx + hw, fl); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.arc(c[0], c[1], hw * c[2], Math.PI, 0); ctx.lineTo(p3[0], p3[1]); ctx.closePath(); }
    ctx.fill('evenodd');
    // side walls, the ceiling with its beams, the floor (the street's paving runs in)
    ctx.fillStyle = '#251e2a'; quad(ctx, V, [[R.x0, R.y0, 0], [R.x0, R.y0, R.d1], [R.x0, fl, R.d1], [R.x0, fl, 0]]); ctx.fill(); quad(ctx, V, [[R.x1, R.y0, 0], [R.x1, R.y0, R.d1], [R.x1, fl, R.d1], [R.x1, fl, 0]]); ctx.fill();
    ctx.fillStyle = '#1c1620'; quad(ctx, V, [[R.x0, R.y0, 0], [R.x1, R.y0, 0], [R.x1, R.y0, R.d1], [R.x0, R.y0, R.d1]]); ctx.fill();
    ctx.fillStyle = '#2a2026'; for (let d = 2; d < R.d1; d += 3.2) { quad(ctx, V, [[R.x0, R.y0, d], [R.x1, R.y0, d], [R.x1, R.y0 + .5, d + .02], [R.x0, R.y0 + .5, d + .02]]); ctx.fill(); }
    ctx.fillStyle = '#3a3240'; quad(ctx, V, [[R.x0, fl, 0], [R.x1, fl, 0], [R.x1, fl, R.d1], [R.x0, fl, R.d1]]); ctx.fill();
    ctx.strokeStyle = 'rgba(16,12,22,.5)'; ctx.lineWidth = Math.max(.6, V.P(G.xb, fl, 6)[2] * .04); ctx.beginPath();
    for (let d = .9; d < R.d1; d += .9) seg3(ctx, V, [R.x0, fl, d], [R.x1, fl, d]); for (let x = R.x0 + 1; x < R.x1; x += 1.6) seg3(ctx, V, [x, fl, 0], [x, fl, R.d1]); ctx.stroke();
  } else { ctx.fillStyle = '#2a2232'; ctx.fillRect(0, 0, W, H); }
  // the board's lantern (warm pool on the floor and on the board)
  const lx = G.xb + .4, ly = R.y0 + 2.4, ld = 3.2, Lp = V.P(lx, ly, ld);
  if (ld > near) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const Pf = V.P(lx, fl, ld); ctx.save(); ctx.translate(Pf[0], Pf[1]); ctx.scale(1, .3); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Pf[2] * 9); g.addColorStop(0, 'rgba(255,170,96,.3)'); g.addColorStop(1, 'rgba(255,170,96,0)'); ctx.fillStyle = g; ctx.fillRect(-Pf[2] * 9, -Pf[2] * 9, Pf[2] * 18, Pf[2] * 18); ctx.restore();
    const Pb = V.P(G.xb, G.y0 + 1.6, G.d), g2 = ctx.createRadialGradient(Pb[0], Pb[1], 0, Pb[0], Pb[1], Pb[2] * 8); g2.addColorStop(0, 'rgba(255,176,104,.24)'); g2.addColorStop(1, 'rgba(255,176,104,0)'); ctx.fillStyle = g2; ctx.fillRect(Pb[0] - Pb[2] * 8, Pb[1] - Pb[2] * 8, Pb[2] * 16, Pb[2] * 16);
    ctx.restore();
  }
  board(ctx, t, V, G, st, near);
  crowd(ctx, t, V, G, st, near, { x: Lp[0], y: Lp[1], col: '#ffcf8a', a: .7 });
  if (ld > near) {   // the lantern itself: a small iron lantern on a rod from the ceiling
    const top = V.P(lx, R.y0, ld), q = Lp[2]; ctx.strokeStyle = '#120c10'; ctx.lineWidth = Math.max(.8, q * .08); ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(Lp[0], Lp[1] - q * .7); ctx.stroke();
    putGlow(ctx, Lp[0], Lp[1], q * 6, .4, '#ffb35c');
    ctx.fillStyle = '#1a1214'; ctx.beginPath(); ctx.moveTo(Lp[0] - q * .5, Lp[1] - q * .55); ctx.lineTo(Lp[0] + q * .5, Lp[1] - q * .55); ctx.lineTo(Lp[0], Lp[1] - q * .95); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffe6b8'; ctx.fillRect(Lp[0] - q * .36, Lp[1] - q * .55, q * .72, q * .95); ctx.strokeStyle = '#1a1214'; ctx.lineWidth = Math.max(.7, q * .07); ctx.strokeRect(Lp[0] - q * .36, Lp[1] - q * .55, q * .72, q * .95);
  }
}
// screen quad of a notice slot (at the board's face); u0 > 0 lifts it off a hand: the carried sheet
const slotQ = (V, s) => [V.P(s.x0, s.y0, s.d), V.P(s.x1, s.y0, s.d), V.P(s.x1, s.y1, s.d), V.P(s.x0, s.y1, s.d)];
function pathQ(ctx, Q) { ctx.beginPath(); Q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
function board(ctx, t, V, G, st, near) {
  if (G.d - .3 > near) {
    // posts, the board (cork in a wooden frame), a little roof
    for (const x of [G.x0 + .25, G.x1 - .75]) box(ctx, V, x, G.y0 - .6, G.d + .1, x + .5, G.fl, G.d + .6, '#4a3424');
    box(ctx, V, G.x0, G.y0, G.d, G.x1, G.y1, G.d + .3, '#6a4a30');
    ctx.fillStyle = '#8a6a48'; quad(ctx, V, [[G.x0 + .3, G.y0 + .3, G.d - .01], [G.x1 - .3, G.y0 + .3, G.d - .01], [G.x1 - .3, G.y1 - .3, G.d - .01], [G.x0 + .3, G.y1 - .3, G.d - .01]]); ctx.fill();
    ctx.fillStyle = 'rgba(60,40,24,.35)'; const r = prng(77); for (let i = 0; i < 90; i++) { const p = V.P(mix(G.x0 + .4, G.x1 - .4, r()), mix(G.y0 + .4, G.y1 - .4, r()), G.d - .02); ctx.fillRect(p[0], p[1], Math.max(1, p[2] * .06), Math.max(1, p[2] * .06)); }
    ctx.fillStyle = '#3a2a22'; quad(ctx, V, [[G.x0 - .5, G.y0 - .4, G.d - .6], [G.x1 + .5, G.y0 - .4, G.d - .6], [G.x1 + .2, G.y0 - 1.3, G.d + .4], [G.x0 - .2, G.y0 - 1.3, G.d + .4]]); ctx.fill();
  }
  // C: money (a big currency sign over stacks of coins, no number) · A: a river being cleaned and a school roof going up
  notice(ctx, V, G.C, (Q, q) => {
    const c = [(Q[0][0] + Q[2][0]) / 2, (Q[0][1] + Q[2][1]) / 2], h = Q[2][1] - Q[0][1];
    ctx.fillStyle = '#2a2420'; ctx.font = `400 ${(h * .62).toFixed(1)}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText('$', c[0] - h * .45, c[1] + h * .2); ctx.textAlign = 'left';
    for (let k = 0; k < 3; k++) { const n = [5, 8, 3][k], x = c[0] + h * (.05 + k * .28); for (let i = 0; i < n; i++) { const y = c[1] + h * .32 - i * h * .055; ctx.fillStyle = i % 2 ? '#8a6a2a' : '#a8843a'; ctx.beginPath(); ctx.ellipse(x, y, h * .11, h * .035, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(40,30,10,.6)'; ctx.lineWidth = Math.max(.5, h * .006); ctx.stroke(); } }
  });
  notice(ctx, V, G.A, (Q) => {
    const x0 = Q[0][0], y0 = Q[0][1], w = Q[1][0] - Q[0][0], h = Q[2][1] - Q[0][1], ink = '#2a2420';
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = Math.max(.6, h * .012); ctx.lineCap = 'round';
    // the school: walls, door, windows, a bell gable; the roof half built (rafters, a few rows of tiles, a figure on it)
    const sx = x0 + w * .52, sy = y0 + h * .5, sw = w * .38, sh = h * .2;
    ctx.strokeRect(sx, sy - sh, sw, sh); ctx.fillRect(sx + sw * .44, sy - sh * .62, sw * .12, sh * .62);
    for (const k of [.15, .7]) ctx.strokeRect(sx + sw * k, sy - sh * .75, sw * .14, sh * .35);
    ctx.beginPath(); ctx.moveTo(sx - sw * .05, sy - sh); ctx.lineTo(sx + sw * .5, sy - sh * 2.1); ctx.lineTo(sx + sw * 1.05, sy - sh); ctx.stroke();
    ctx.beginPath(); for (let i = 1; i < 7; i++) { const u = i / 7; ctx.moveTo(sx + sw * u, sy - sh); ctx.lineTo(sx + sw * .5, sy - sh * 2.1); } ctx.stroke();
    ctx.beginPath(); for (let i = 0; i < 3; i++) { const yy = sy - sh * (1.12 + i * .16), ww = sw * (1 - (i * .16 + .12)) * .5; ctx.moveTo(sx + sw * .5 - ww, yy); ctx.lineTo(sx + sw * .5 - ww * .1, yy); } ctx.stroke();
    ctx.beginPath(); ctx.arc(sx + sw * .66, sy - sh * 1.85, h * .025, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(sx + sw * .66, sy - sh * 1.8); ctx.lineTo(sx + sw * .7, sy - sh * 1.55); ctx.moveTo(sx + sw * .66, sy - sh * 1.72); ctx.lineTo(sx + sw * .58, sy - sh * 1.62); ctx.stroke();
    // the river: waves, a boat with two people pulling a net of rubbish out, a clean stretch downstream
    const ry = y0 + h * .72; ctx.beginPath(); for (let i = 0; i < 4; i++) { const yy = ry + i * h * .055; for (let x = x0 + w * .06; x < x0 + w * .94; x += w * .05) { ctx.moveTo(x, yy); ctx.quadraticCurveTo(x + w * .0125, yy - h * .015, x + w * .025, yy); } } ctx.stroke();
    const bx = x0 + w * .22; ctx.beginPath(); ctx.moveTo(bx - w * .1, ry - h * .02); ctx.quadraticCurveTo(bx, ry + h * .06, bx + w * .1, ry - h * .02); ctx.closePath(); ctx.fill();
    for (const k of [-.04, .05]) { ctx.beginPath(); ctx.arc(bx + w * k, ry - h * .1, h * .022, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(bx + w * k, ry - h * .08); ctx.lineTo(bx + w * k, ry - h * .02); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(bx + w * .05, ry - h * .07); ctx.lineTo(bx + w * .2, ry + h * .05); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(bx + w * .22, ry + h * .06, w * .045, h * .035, 0, 0, TAU); ctx.stroke();
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(bx + w * (.2 + i * .015), ry + h * (.05 + (i % 2) * .02), h * .008, 0, TAU); ctx.fill(); }
  });
  // B: the blank notice, pinned at st.busy.pin by the woman left of the board; its paper is the next chunk's plate
  const tp = st.busy?.pin ?? 1e9; if (t >= tp + .45) notice(ctx, V, G.B, null, st.plate, t);
}
function notice(ctx, V, s, art, plate, t) {
  const Q = slotQ(V, s); if (Q.some((p) => !isFinite(p[0]))) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (plate) { pathQ(ctx, Q); ctx.clip(); plate(ctx, t); ctx.restore(); return pins(ctx, Q); }
  const g = ctx.createLinearGradient(Q[0][0], Q[0][1], Q[2][0], Q[2][1]); g.addColorStop(0, '#f2e6cc'); g.addColorStop(1, '#d8c6a2');
  pathQ(ctx, Q); ctx.fillStyle = g; ctx.fill(); ctx.clip(); if (art) art(Q, Q[0][2]);
  ctx.restore(); pins(ctx, Q);
}
function pins(ctx, Q) { const q = Q[0][2]; for (const [x, y] of [Q[0], Q[1]]) { ctx.fillStyle = '#b8402a'; ctx.beginPath(); ctx.arc(x + (x < Q[1][0] - 1 ? 1 : -1) * q * .12, y + q * .1, Math.max(1.2, q * .06), 0, TAU); ctx.fill(); } }
// the people at the board: three adults and a child at the right notice (A), the woman with the new sheet left of the board
function crowd(ctx, t, V, G, st, near, lt) {
  const tg = st.busy?.gather ?? 1e9, tp = st.busy?.pin ?? 1e9, gu = qio(u01(t, tg, tg + .9));
  const ppl = [
    { x: G.xb + 6.4, d: 1.1, seed: 71, flip: true, dress: { coat: '#6a4a5a', pants: '#2a2430', skin: '#c08a68', hair: '#2a1c18' }, hair: 'bun', head0: .05, head1: -.18 },
    { x: G.xb + 5.2, d: .5, seed: 72, flip: true, dress: { coat: '#3e5a5a', pants: '#24282e', skin: '#8d5f40', hair: '#1a1210' }, head0: -.05, head1: -.24 },
    { x: G.xb + 7.5, d: 1.6, seed: 73, flip: true, dress: { coat: '#5a5040', pants: '#2c2a26', skin: '#e0b896', hair: '#b8b0a4' }, head0: .12, head1: -.12 },
  ];
  for (const p of ppl.sort((a, b) => b.d - a.d)) {
    if (p.d < near + .4) continue;
    const { s, hx, hy } = standAt(V, p.x, G.fl, p.d), pose = { head: mix(p.head0, p.head1, gu), lean: mix(0, .05, gu), sh: [.15, .05], el: [.35, .3], hair: p.hair || 'short' };
    person(ctx, hx + mix(0, -.5, gu) * V.P(0, 0, p.d)[2] * 0, hy, s, pose, { t, seed: p.seed, dress: p.dress, flip: p.flip, light: lt, rim: '#ffcf8a', rimW: 1.1, shadow: false, turn: mix(-.3, .5, gu) });
  }
  // the child in front of A, looking up at it
  if (.4 > near + .3) { const C = standAt(V, G.xb + 3.6, G.fl, .4), sk = figS(V, .4) * 1.1; kid(ctx, C.hx, C.hy + 88 * C.s - 49 * sk, sk, { head: mix(.0, -.35, gu), sh: [.2, .1], el: [.3, .2] }, { t, seed: 9, age: 'child', flip: true, dress: { top: '#d8a040', pants: '#2a3048', skin: '#c99a76', hair: '#3a2418' }, light: lt, rim: '#ffcf8a' }); }
  // the woman with the blank sheet (left of the board, facing it): she lifts it onto the board and pins it
  const pd = .9; if (pd < near + .4) return;
  const P = standAt(V, G.B.x0 - 1.9, G.fl, pd), s = P.s, pu = qio(u01(t, tp - .25, tp + .45)), back = qio(u01(t, tp + .55, tp + 1.1));
  const dress = { coat: '#7a3a34', pants: '#2a2228', skin: '#d8ae8c', hair: '#3a2420' };
  const pose = { head: mix(.1, -.12, pu), lean: .03, sh: [.4, .3], el: [.9, .9], hair: 'bun' }, oo = { t, seed: 75, dress, light: lt, rim: '#ffcf8a', rimW: 1.1, shadow: false };
  const Bq = slotQ(V, G.B), held = [P.hx + 16 * s, P.hy + 2 * s], onB = [Bq[0][0] + (Bq[1][0] - Bq[0][0]) * .2, (Bq[0][1] + Bq[2][1]) / 2], rest = [P.hx + 12 * s, P.hy + 18 * s];
  const tgt = pu < 1 ? [mix(held[0], onB[0], pu), mix(held[1], onB[1], pu)] : [mix(onB[0], rest[0], back), mix(onB[1], rest[1], back)];
  const a0 = reachArm(P.hx, P.hy, s, pose, 0, false, oo, tgt, -1), a1 = reachArm(P.hx, P.hy, s, pose, 1, false, oo, pu < 1 ? [tgt[0] - 3 * s, tgt[1] + 6 * s] : [P.hx + 6 * s, P.hy + 16 * s], -1);
  pose.sh = [a0.sh, a1.sh]; pose.el = [a0.el, a1.el];
  person(ctx, P.hx, P.hy, s, pose, { ...oo, part: 'body' });
  // the carried sheet: from her hands up onto the slot (the same paper as the notice)
  if (t < tp + .45) {
    const k = pu, sw = (Bq[1][0] - Bq[0][0]), sh = (Bq[2][1] - Bq[0][1]), cx = mix(held[0] + sw * .3, (Bq[0][0] + Bq[1][0]) / 2, k), cy = mix(held[1] - sh * .1, (Bq[0][1] + Bq[2][1]) / 2, k), sc = mix(.82, 1, k), rot = mix(-.5, 0, k);
    const Q = [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]].map(([u, v]) => [cx + (u * sw * Math.cos(rot) - v * sh * Math.sin(rot)) * sc, cy + (u * sw * Math.sin(rot) + v * sh * Math.cos(rot)) * sc]);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); pathQ(ctx, Q); ctx.clip(); if (st.plate) st.plate(ctx, t); else { ctx.fillStyle = '#efe4cc'; ctx.fillRect(0, 0, W, H); } ctx.restore();
  }
  person(ctx, P.hx, P.hy, s, pose, { ...oo, part: 'front', rim: null });
}

// ================================================================ small life in every other room (one lamp, one or two people, one prop)
const VDRESS = [
  { coat: '#5a4a6a', pants: '#2a2632', skin: '#d8ae8c', hair: '#2a1c18' }, { coat: '#4a6a5a', pants: '#26282e', skin: '#8d5f40', hair: '#1a1210' },
  { coat: '#8a5a3a', pants: '#2c2824', skin: '#e0b896', hair: '#5a3a24' }, { coat: '#3a4a6a', pants: '#24242c', skin: '#c08a68', hair: '#3a2a20' },
];
function chair(ctx, V, x, fl, d, flip) { const f = flip ? -1 : 1; box(ctx, V, x - .9, fl - 2.0, d - .8, x + .9, fl - 1.8, d + .8, '#5a3e28'); box(ctx, V, x - .9 * f - .15, fl - 4.3, d - .8, x - .9 * f + .15, fl - 1.8, d + .8, '#4a3220'); for (const dx of [-.75, .65]) box(ctx, V, x + dx, fl - 1.8, d - .1, x + dx + .12, fl, d + .1, '#3a2618'); }
function sitter(ctx, t, V, x, fl, d, flip, seed, L, o = {}) {
  const s = figS(V, d), P = V.P(x, fl - U(.47), d), pose = { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: o.sh || [.7, .5], el: o.el || [1.0, .9], lean: o.lean ?? .1, head: o.head ?? .15, hair: o.hair };
  return person(ctx, P[0], P[1] - 2 * s, s, pose, fo(t, seed, VDRESS[seed % 4], V, L, { flip, smile: o.smile ?? .4 }));
}
function stander(ctx, t, V, x, fl, d, flip, seed, L, o = {}) { const { s, hx, hy } = standAt(V, x, fl, d); return person(ctx, hx, hy, s, { head: o.head ?? .1, lean: o.lean ?? .02, sh: o.sh || [.3, .1], el: o.el || [.6, .4], hair: o.hair }, fo(t, seed, VDRESS[seed % 4], V, L, { flip })); }
function table(ctx, V, x0, x1, fl, d0, d1, col = '#7a5a3a') { for (const x of [x0 + .2, x1 - .5]) box(ctx, V, x, fl - 3.2, d0 + .2, x + .3, fl, d0 + .5, shadeHex(col, -.3)); box(ctx, V, x0, fl - 3.35, d0, x1, fl - 3.1, d1, col, { top: shadeHex(col, .15) }); }
export const VIGN = {
  // a family at the table: two adults and a child, a bowl and bread, the lamp low over the table
  flat(ctx, t, V, S, R, st, L) {
    const fl = R.y1, cx = L.x, d = 7.5; chair(ctx, V, cx - 4.2, fl, d + .4, false); table(ctx, V, cx - 3, cx + 3, fl, d - 1.2, d + 1.2);
    pot(ctx, V, cx - .3, fl - 3.35, d, [[.4, 0], [.9, .5], [1, .8]], '#d8c8a8'); pot(ctx, V, cx + 1.6, fl - 3.35, d - .3, [[.5, 0], [.7, .4], [.5, .6]], '#c49a5a', { open: false });
    sitter(ctx, t, V, cx - 4.0, fl, d + .4, false, 1, L, { sh: [1.2, 1.0], el: [.6, .7], head: .1 });
    stander(ctx, t, V, cx + 4.6, fl, d + .6, true, 2, L, { sh: [.9, .4], el: [.5, .6], lean: .14, head: .2 });
    const K = standAt(V, cx + 2.6, fl, d - 1.6), sk = figS(V, d - 1.6); kid(ctx, K.hx, K.hy + 88 * K.s - 49 * sk, sk, { sh: [.9, .5], el: [.6, .5] }, { t, seed: 3, age: 'child', flip: true, dress: { top: '#d8824a', pants: '#2a3048', skin: '#e2b48e' }, light: lightOf(V, L), rim: '#ffcf8a' });
  },
  kitchen(ctx, t, V, S, R, st, L) {   // a cook stirring a pot on the stove, steam rising
    const fl = R.y1, x = L.x, d = 8; box(ctx, V, x - 1.5, fl - 3.6, d - 1.2, x + 3.2, fl, d + 1.2, '#3a3a40', { top: '#4a4a52' });
    const st2 = Math.sin(t * 2.2); pot(ctx, V, x + 1, fl - 3.6, d, [[1, 0], [1.05, 1.4], [1, 1.5]], '#6a6a72', { open: true, inside: '#2a1a14' });
    ctx.strokeStyle = 'rgba(230,226,220,.45)'; ctx.lineWidth = Math.max(.8, V.P(x, fl, d)[2] * .12); ctx.beginPath(); for (let k = 0; k < 3; k++) { const p = V.P(x + .6 + k * .5, fl - 5.3, d); ctx.moveTo(p[0], p[1]); for (let i = 1; i < 8; i++) { const q = V.P(x + .6 + k * .5 + Math.sin(t * 1.5 + i * .9 + k) * .4, fl - 5.3 - i * .6 - (t * .8 % .6), d); ctx.lineTo(q[0], q[1]); } } ctx.stroke();
    const pr = standAt(V, x - 2.6, fl, d + .3), sp = V.P(x + 1 + st2 * .4, fl - 5.4, d); const pose = { sh: [1, .5], el: [.5, .7], lean: .1, head: .25 }, oo = fo(t, 6, VDRESS[2], V, L);
    const a = reachArm(pr.hx, pr.hy, pr.s, pose, 0, false, oo, [sp[0], sp[1]], -1); pose.sh = [a.sh, .5]; pose.el = [a.el, .7];
    person(ctx, pr.hx, pr.hy, pr.s, pose, oo); ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = Math.max(1, pr.s * 2); ctx.beginPath(); ctx.moveTo(sp[0], sp[1]); ctx.lineTo(sp[0] + pr.s * 6, sp[1] + pr.s * 30); ctx.stroke();
  },
  piano(ctx, t, V, S, R, st, L) {   // a child at an upright piano, a parent beside
    const fl = R.y1, x = L.x - 2, d = 12; box(ctx, V, x - 3.5, fl - 5.6, d, x + 3.5, fl, d + 2.4, '#2a1a14', { top: '#3a2418' }); box(ctx, V, x - 3.4, fl - 3.4, d - 1.1, x + 3.4, fl - 3.0, d, '#2a1a14', { top: '#efe8d8' });
    const K = standAt(V, x - .6, fl - U(.42), d - 3), sk = figS(V, d - 3); box(ctx, V, x - 1.8, fl - 1.85, d - 3.8, x + .6, fl - 1.6, d - 2.2, '#3a2418');
    const fing = Math.sin(t * 7) * .3, k0 = kidArm(K.hx, K.hy + 88 * K.s - 40 * sk, sk, .1, false, 0, V.P(x + fing, fl - 3.55, d - .8)[0], V.P(x, fl - 3.55, d - .8)[1], -1);
    kid(ctx, K.hx, K.hy + 88 * K.s - 40 * sk, sk, { hip: [1.45, 1.5], kn: [1.45, 1.5], lean: .1, sh: [k0.sh, k0.sh - .1], el: [k0.el, k0.el] }, { t, seed: 8, age: 'child', dress: { top: '#4a7ab0', pants: '#2a2f52', skin: '#d9b08e' }, light: lightOf(V, L), rim: '#ffcf8a' });
    stander(ctx, t, V, x - 4.6, fl, d - 2, false, 3, L, { head: .3, sh: [.5, .2], el: [1.2, .8] });
  },
  sewing(ctx, t, V, S, R, st, L) {  // a sewing machine on a table, a length of cloth
    const fl = R.y1, x = L.x, d = 8; table(ctx, V, x - 2, x + 3, fl, d - 1, d + 1, '#6a4a30');
    const m = V.P(x + .6, fl - 3.35, d), q = m[2]; ctx.fillStyle = '#1e1a1e'; ctx.beginPath(); ctx.moveTo(m[0] - q * 1.6, m[1]); ctx.lineTo(m[0] - q * 1.6, m[1] - q * 1.5); ctx.quadraticCurveTo(m[0] - q * 1.4, m[1] - q * 2, m[0] + q * 1.2, m[1] - q * 1.9); ctx.lineTo(m[0] + q * 1.4, m[1] - q * 1.2); ctx.lineTo(m[0] + q * 1.1, m[1] - q * 1.2); ctx.lineTo(m[0] + q * 1.1, m[1] - q * .3); ctx.lineTo(m[0] - q * 1.1, m[1] - q * .3); ctx.lineTo(m[0] - q * 1.1, m[1]); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#c44a3a'; quad(ctx, V, [[x - 1.6, fl - 3.4, d - .8], [x + 3.4, fl - 3.4, d - .8], [x + 3.8, fl - 1.2, d - 1.1], [x - 1.2, fl - 1.0, d - 1.1]]); ctx.fill();
    chair(ctx, V, x - 3.4, fl, d + .2, false); sitter(ctx, t, V, x - 3.2, fl, d + .2, false, 0, L, { sh: [1.3, 1.1], el: [.5, .6], lean: .25, head: .35, hair: 'bun' });
  },
  models(ctx, t, V, S, R, st, L) {  // a child holds up a model plane at a desk; an adult looks on
    const fl = R.y1, x = L.x, d = 8; table(ctx, V, x - 2.5, x + 2.5, fl, d - 1, d + 1, '#7a5a3a');
    const K = standAt(V, x - 3.4, fl, d - .5), sk = figS(V, d - .5), ky = K.hy + 88 * K.s - 49 * sk, pl = V.P(x - .8 + Math.sin(t * .9) * .5, fl - 6.4 + Math.sin(t * 1.3) * .3, d - .5);
    const a = kidArm(K.hx, ky, sk, .02, false, 0, pl[0] - 2 * sk, pl[1] + 2 * sk, -1);
    kid(ctx, K.hx, ky, sk, { head: -.25, sh: [a.sh, .3], el: [a.el, .4] }, { t, seed: 4, age: 'child', dress: { top: '#6aa05a', pants: '#2a2f52', skin: '#c99a76' }, light: lightOf(V, L), rim: '#ffcf8a' });
    const q = pl[2]; ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.moveTo(pl[0] - q * 1.2, pl[1]); ctx.lineTo(pl[0] + q * 1.3, pl[1] - q * .15); ctx.lineTo(pl[0] + q * 1.3, pl[1] + q * .1); ctx.lineTo(pl[0] - q * 1.2, pl[1] + q * .15); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(pl[0] - q * .1, pl[1]); ctx.lineTo(pl[0] + q * .3, pl[1] - q * .05); ctx.lineTo(pl[0] - q * .3, pl[1] + q * .9); ctx.lineTo(pl[0] - q * .6, pl[1] + q * .9); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(pl[0] - q * 1.1, pl[1]); ctx.lineTo(pl[0] - q * 1.2, pl[1] - q * .5); ctx.lineTo(pl[0] - q * .9, pl[1]); ctx.closePath(); ctx.fill();
    stander(ctx, t, V, x + 4, fl, d + .4, true, 1, L, { head: .15, sh: [.2, .4], el: [1.4, 1.2] });
  },
  drying(ctx, t, V, S, R, st, L) {  // washing on a line across the room, someone pegging a sheet
    const fl = R.y1, x = L.x, d = 9, ly = R.y0 + 2.2; ctx.strokeStyle = '#d8d0c0'; ctx.lineWidth = Math.max(.7, V.P(x, ly, d)[2] * .05); ctx.beginPath(); seg3(ctx, V, [R.x0 + 2, ly, d], [R.x1 - 2, ly, d]); ctx.stroke();
    const r = prng(R.seed + 2); for (let i = 0; i < 5; i++) { const xx = R.x0 + 4 + i * (R.x1 - R.x0 - 8) / 5, w = 2 + r() * 1.5, h = 2 + r() * 3, sw = Math.sin(t * 1.1 + i) * .2; ctx.fillStyle = ['#e8e2d4', '#8aa6c4', '#d8a080', '#e8e2d4', '#a8b890'][i]; quad(ctx, V, [[xx, ly, d], [xx + w, ly, d], [xx + w + sw, ly + h, d], [xx + sw, ly + h, d]]); ctx.fill(); }
    const pr = standAt(V, x + 3, fl, d + .6), pose = { sh: [2.6, 2.4], el: [.3, .4], head: -.25 }; stander(ctx, t, V, x + 3, fl, d + .6, true, 2, L, { sh: [2.5, 2.3], el: [.35, .45], head: -.25 });
  },
  attic(ctx, t, V, S, R, st, L) {   // a reader in an armchair under a floor lamp
    const fl = R.y1, x = L.x - 1, d = 8; box(ctx, V, x - 2, fl - 2.2, d - 1.2, x + 2, fl - 1.4, d + 1.2, '#3a5a4e'); box(ctx, V, x - 2.2, fl - 5.2, d + .6, x - 1.6, fl - 1.4, d + 1.2, '#2e4a40'); box(ctx, V, x - 2.2, fl - 1.4, d - 1.2, x + 2.2, fl - .3, d + 1.2, '#2a4038');
    const rd = sitter(ctx, t, V, x - .6, fl - .3, d, false, 3, L, { sh: [1.1, 1.0], el: [1.3, 1.4], head: .4, lean: .02 });
    const h = rd.hand ? rd.hand(0) : null; if (h) { const q = figS(V, d) * 9; ctx.fillStyle = '#efe6d2'; ctx.fillRect(h[0] - q * .2, h[1] - q * 1.1, q * 1.4, q * 1.0); ctx.strokeStyle = 'rgba(60,40,30,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(h[0] + q * .5, h[1] - q * 1.1); ctx.lineTo(h[0] + q * .5, h[1] - q * .1); ctx.stroke(); }
  },
  painter(ctx, t, V, S, R, st, L) { // a painter at an easel, brush moving
    const fl = R.y1, x = L.x + 1, d = 8, e0 = V.P(x, fl, d); ctx.strokeStyle = '#4a3020'; ctx.lineWidth = Math.max(1, e0[2] * .2); ctx.beginPath(); seg3(ctx, V, [x - 1.6, fl, d], [x, fl - 8, d]); seg3(ctx, V, [x + 1.6, fl, d], [x, fl - 8, d]); seg3(ctx, V, [x, fl, d + 1.5], [x, fl - 8, d]); ctx.stroke();
    ctx.fillStyle = '#f0e6d0'; quad(ctx, V, [[x - 2.2, fl - 7.6, d - .2], [x + 2.2, fl - 7.6, d - .2], [x + 2.2, fl - 4.2, d - .2], [x - 2.2, fl - 4.2, d - .2]]); ctx.fill();
    const r = prng(5); for (let i = 0; i < 7; i++) { ctx.fillStyle = ['#c4512e', '#4f6a7a', '#e9c46a', '#3a5a3a'][i % 4]; const p = V.P(x - 1.8 + r() * 3.4, fl - 7.2 + r() * 2.6, d - .25); ctx.beginPath(); ctx.ellipse(p[0], p[1], p[2] * (.3 + r() * .4), p[2] * (.15 + r() * .3), r() * 3, 0, TAU); ctx.fill(); }
    const pr = standAt(V, x - 3.4, fl, d + .4), bp = V.P(x - 1 + Math.sin(t * 1.7) * .8, fl - 6 + Math.cos(t * 1.3) * .6, d - .3), pose = { sh: [1, .4], el: [.5, .8], head: .1 }, oo = fo(t, 7, VDRESS[1], V, L);
    const a = reachArm(pr.hx, pr.hy, pr.s, pose, 0, false, oo, [bp[0], bp[1]], -1); pose.sh = [a.sh, .5]; pose.el = [a.el, 1.1]; person(ctx, pr.hx, pr.hy, pr.s, pose, oo);
  },
};
VIGN.drying2 = VIGN.drying;
