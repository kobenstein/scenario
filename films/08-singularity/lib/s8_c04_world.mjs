// Film 8 · c04 worlds (owner B1): the house on the night headland (time-lapse round its one steady window), the trainer plane (3D, any angle)
// and its cockpit seen from behind, the station hall with the split-flap board, the pre-dawn beach with the mirror pane and the kite.
//
//   lightIn(ctx, t, poly | null, o)      the 'light' plate (screen-fixed) seen through a screen polygon (a window that is a light); o.tone 'lamp'
//   lightDisc(ctx, t, x, y, R, o)        the same light in a soft disc (a light swelling to fill the frame / shrinking back into a lamp)
//   HL, WIN, winPoly(C)                  the headland house (ground point of the front wall) and its lit window (house coords)
//   headland(ctx, t, C, o)               the whole night headland: o { lapse (time-lapse clock, hours), build 0..1 (the new rooms rise stone by
//                                        stone), dusk 0..1 (blue hour) } → { win: screen poly of the lit window }
//   plane(ctx, t, C, P, o)               the trainer, P { pos [x,y,z], head, pitch, roll }; o { dark 0..1 (night), glow 0..1 (panel glow in the
//                                        canopy), inside(ctx, rect) (paints the cockpit seen through the rear window) } → { rear (screen poly),
//                                        nose, tail, centre } ; planeL(P, a, b, c) → world point (a right, b up, c forward)
//   cockpit(ctx, t, o)                   the cockpit from behind, in FRAME SPACE (1920 × 1080 at zoom 1): o { night 0..1, point 0..1 (the
//                                        instructor's hand to the heading dial), hdg (rad), bank } → { screen: [x0, y0, x1, y1] the windscreen }
//   hall(ctx, t, C, o)                   the station hall: o { flip 1 (board running), door 1, out (walker leaves), crowd [...] } → { globe }
//   beach(ctx, t, C, o)                  the pre-dawn beach east of the hall: o { dawn, mirror 1, walker {x,z,face,phase,run}, kite {…}, prints }
import { rgba, clamp, prng, canvas } from '../engine.mjs';
import { TAU, projPoly, fillPoly, projRuns, mixHex, hash, nz, eoX, sio, u01 } from './s8_kit.mjs';
import { drawSky, skyDir } from './s8_sky.mjs';
import { drawSea } from './s8_sea.mjs';
import { plate } from './handoff4.mjs';
import { crowd } from './s8_crowd.mjs';
import { crowdWalker } from './s8_people.mjs';

const W = 1920, H = 1080;
const path = (ctx, P) => { ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], norm = (a) => { const m = Math.hypot(...a) || 1; return [a[0] / m, a[1] / m, a[2] / m]; };

// ================================================================ the light seen through a window / swelling in a disc
const [LPc, LPg] = canvas(W, H); let LPt = null;
const lightPlate = (t, tone) => { const key = t + tone; if (LPt !== key) { LPg.setTransform(1, 0, 0, 1, 0, 0); LPg.globalAlpha = 1; LPg.globalCompositeOperation = 'source-over'; plate(LPg, t, 'light', { tone }); LPt = key; } return LPc; };
export function lightIn(ctx, t, poly, o = {}) {
  const img = lightPlate(t, o.tone || 'lamp');
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (poly) { if (poly.length < 3) { ctx.restore(); return; } path(ctx, poly); ctx.clip(); } ctx.drawImage(img, 0, 0); ctx.restore();
}
const [LDc, LDg] = canvas(W, H);
export function lightDisc(ctx, t, x, y, R, o = {}) {
  if (R <= 1) return;
  const img = lightPlate(t, o.tone || 'lamp');
  LDg.setTransform(1, 0, 0, 1, 0, 0); LDg.globalCompositeOperation = 'source-over'; LDg.clearRect(0, 0, W, H); LDg.drawImage(img, 0, 0);
  if (R < 4200) { LDg.globalCompositeOperation = 'destination-in'; const g = LDg.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.55, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); LDg.fillStyle = g; LDg.fillRect(0, 0, W, H); LDg.globalCompositeOperation = 'source-over'; }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(LDc, 0, 0); ctx.restore();
}

// ================================================================ the night headland, the house and its window
export const HL = { x: 0, y: 14, z: 0 };
const HS = { x0: -3, x1: 3, zf: -2.6, zb: 2.4, h: 2.9, ridge: 4.5 };
export const WIN = { x0: -.5, x1: .5, y0: 1.0, y1: 1.9 };   // on the front wall (z = HS.zf), house coords
const hw = (x, y, z) => [HL.x + x, HL.y + y, HL.z + z];
export const winCentre = () => hw(0, (WIN.y0 + WIN.y1) / 2, HS.zf);
export const winPoly = (C) => projPoly(C, [hw(WIN.x0, WIN.y1, HS.zf - .01), hw(WIN.x1, WIN.y1, HS.zf - .01), hw(WIN.x1, WIN.y0, HS.zf - .01), hw(WIN.x0, WIN.y0, HS.zf - .01)]);
const RIM = (() => { const p = []; for (let i = 0; i < 48; i++) { const a = i / 48 * TAU, r = 24 + 5 * nz(i * .41, 7) + 3 * Math.sin(a * 3); p.push([HL.x + Math.sin(a) * r * 1.2, HL.z + Math.cos(a) * r]); } return p; })();
const BOATS = (() => { const r = prng(404), b = []; for (let i = 0; i < 22; i++) b.push({ z: 70 + r() * 520, x0: r() * 2400, v: (r() < .5 ? 1 : -1) * (180 + r() * 420), col: r() < .5 ? '#ff6a5a' : '#7affb0', ph: r() }); return b; })();
const TOWN = (() => { const r = prng(405), L = []; for (let i = 0; i < 340; i++) { const x = -300 + r() * 1100, z = 760 + r() * 200; L.push({ x, z, y: 2 + r() * 22 * Math.exp(-Math.abs(x - 250) / 380), k: r(), warm: r() < .7 }); } return L; })();
const CRANES = [[110, 760, 0], [290, 780, 1.7], [430, 770, 3.1]];
// a stone wall face: fill + courses + staggered joints (lit by the window side light, cool from the sky)
function stoneFace(ctx, C, quad, rows, seed, col) {
  const P = projPoly(C, quad); if (!fillPoly(ctx, P, col)) return;
  ctx.save(); path(ctx, P); ctx.clip(); ctx.strokeStyle = rgba('#a8b4d8', .1); ctx.lineWidth = 1;
  const [A, B, Cc, D] = quad, L = (u, v) => [A[0] + (B[0] - A[0]) * u + (D[0] - A[0]) * v, A[1] + (B[1] - A[1]) * u + (D[1] - A[1]) * v, A[2] + (B[2] - A[2]) * u + (D[2] - A[2]) * v];
  for (let i = 1; i < rows; i++) { const v = i / rows; for (const run of projRuns(C, [L(0, v), L(1, v)])) { ctx.beginPath(); ctx.moveTo(run[0][0], run[0][1]); ctx.lineTo(run[run.length - 1][0], run[run.length - 1][1]); ctx.stroke(); } }
  const r = prng(seed); ctx.beginPath();
  for (let i = 0; i < rows; i++) { const v0 = i / rows, v1 = (i + 1) / rows; let u = (i % 2) * .07 + r() * .05; while (u < 1) { const a = C.P(...L(u, v0)), b = C.P(...L(u, v1)); if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } u += .1 + r() * .08; } }
  ctx.stroke(); ctx.restore();
}
// one new room beside the house, rising course by course (u 0..1); the last course is laid stone by stone
function newRoom(ctx, t, C, x0, x1, u, seed) {
  if (u <= 0) return;
  const z0 = -2.1, z1 = 2.0, h = 2.4, n = 8, done = Math.floor(u * n * 1.0001), part = u * n - done, hh = Math.min(h, done / n * h);
  const face = (zz) => [hw(x0, 0, zz), hw(x1, 0, zz), hw(x1, hh, zz), hw(x0, hh, zz)];
  const side = C.depth(...hw(x0, 1, 0)) > C.depth(...hw(x1, 1, 0)) ? x0 : x1;
  if (hh > 0) {
    stoneFace(ctx, C, [hw(side, 0, z1), hw(side, 0, z0), hw(side, hh, z0), hw(side, hh, z1)], Math.max(1, done), seed + 1, '#120f1c');
    stoneFace(ctx, C, face(z0), Math.max(1, done), seed, '#16121f');
  }
  // the course being laid: stones appear one by one along the front
  if (done < n && part > 0) {
    const y0 = hh, y1 = hh + h / n, ns = 9;
    for (let i = 0; i < ns; i++) { if (i / ns > part) break; const a = x0 + (x1 - x0) * i / ns, b = x0 + (x1 - x0) * (i + .92) / ns; fillPoly(ctx, projPoly(C, [hw(a, y0, z0), hw(b, y0, z0), hw(b, y1 * .98 + y0 * .02, z0), hw(a, y1 * .98 + y0 * .02, z0)]), i === Math.floor(part * ns) ? '#2a2234' : '#18141f'); }
  }
  // the roof once the walls stand; a small dark window in the new wall
  if (u >= .97) {
    const ru = clamp((u - .97) / .03);
    fillPoly(ctx, projPoly(C, [hw(x0 - .2, h, z0 - .2), hw(x1 + .2, h, z0 - .2), hw(x1 + .2, h + .9 * ru, (z0 + z1) / 2), hw(x0 - .2, h + .9 * ru, (z0 + z1) / 2)]), '#0b0914');
    const wx = (x0 + x1) / 2; fillPoly(ctx, projPoly(C, [hw(wx - .3, 1.0, z0 - .01), hw(wx + .3, 1.0, z0 - .01), hw(wx + .3, 1.6, z0 - .01), hw(wx - .3, 1.6, z0 - .01)]), '#07060c');
  }
}
export function headland(ctx, t, C, o = {}) {
  const lapse = o.lapse ?? 0, dusk = o.dusk ?? 0, out = {};
  // the sky wheels with the lapse (the sky turns about the camera), the town and the cranes on the far coast, the bay, the boats
  drawSky(ctx, t, o.skyCam ? o.skyCam(lapse) : C, { mw: .7 * (1 - dusk), dawn: dusk * .55, dawnAz: -1.2 });
  // the far coast: a low dark band of hills, the town's lights, cranes
  const coast = []; for (let i = 0; i <= 40; i++) { const x = -2600 + i * 130; coast.push([x, 14 + 22 * Math.max(0, nz(i * .37, 31)) + 18 * Math.exp(-((x - 250) ** 2) / 4e5), 1000 + 50 * Math.sin(i * .7)]); }
  fillPoly(ctx, projPoly(C, [...coast, [2600, -2, 1060], [-2600, -2, 1060]]), mixHex('#0a0a1c', '#1a1a34', dusk));
  { const g = C.P(250, 10, 850); if (g) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = Math.max(40, g[2] * 260), gr = ctx.createRadialGradient(g[0], g[1], 0, g[0], g[1], R); gr.addColorStop(0, rgba('#ffb070', .16 * (.3 + .7 * dusk))); gr.addColorStop(1, rgba('#ffb070', 0)); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(g[0], g[1], R, R * .35, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
  const grow = .5 + .5 * Math.sin(lapse * .55 - 1.2);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const L of TOWN) {
    const on = L.k < .25 + .7 * grow && nz(L.k * 40 + lapse * 1.3, 3) > -.6; if (!on) continue;
    const p = C.P(L.x, L.y, L.z); if (!p || p[0] < -10 || p[0] > W + 10) continue;
    const r = Math.max(1.6, p[2] * 2.6); ctx.fillStyle = rgba(L.warm ? '#ffcf8a' : '#cfe4ff', .65 + .35 * L.k); ctx.fillRect(p[0] - r / 2, p[1] - r / 2, r, r);
  }
  ctx.restore();
  for (const [cx, cz, ph] of CRANES) {
    const hgt = 25 + 60 * clamp(.5 + .5 * Math.sin(lapse * .4 + ph)), jib = lapse * 1.7 + ph, base = C.P(cx, 0, cz), top = C.P(cx, hgt, cz); if (!base || !top) continue;
    const j1 = C.P(cx + Math.sin(jib) * 40, hgt, cz + Math.cos(jib) * 40), j2 = C.P(cx - Math.sin(jib) * 12, hgt, cz - Math.cos(jib) * 12);
    ctx.save(); ctx.strokeStyle = '#2a2a48'; ctx.lineWidth = Math.max(1.5, top[2] * 1.6); ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.lineTo(top[0], top[1]); if (j1 && j2) { ctx.moveTo(j2[0], j2[1]); ctx.lineTo(j1[0], j1[1]); } ctx.stroke();
    if (j1) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ff4a3a', .5 + .5 * (Math.sin(lapse * 9 + ph) > 0)); ctx.beginPath(); ctx.arc(j1[0], j1[1], 3.2, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  drawSea(ctx, t, C, { dawn: dusk * .5 });
  // boats on the bay: time-lapse streaks of their lights
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const b of BOATS) {
    const x = ((b.x0 + b.v * lapse) % 2400 + 2400) % 2400 - 1200, x2 = x - b.v * .22, p = C.P(x, .5, b.z), q = C.P(x2, .5, b.z); if (!p || !q) continue;
    ctx.strokeStyle = rgba('#fff1d6', .5); ctx.lineWidth = Math.max(1, p[2] * .6); ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
    ctx.fillStyle = rgba(b.col, .9); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(1.2, p[2] * .5), 0, TAU); ctx.fill();
  }
  ctx.restore();
  // the headland: cliff faces from the rim down to the tide, the top, the tide's foam racing up and down the rocks
  const tide = 1.4 * Math.sin(lapse * TAU / 12.4);
  const rim3 = RIM.map(([x, z]) => [x, HL.y - .2, z]), foot = RIM.map(([x, z]) => [HL.x + (x - HL.x) * 1.25, -1, HL.z + (z - HL.z) * 1.25]);
  const faces = []; for (let i = 0; i < RIM.length; i++) { const j = (i + 1) % RIM.length, q = [rim3[i], rim3[j], foot[j], foot[i]]; faces.push([C.depth(...q.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4, a[2] + p[2] / 4], [0, 0, 0])), q, i]); }
  faces.sort((a, b) => b[0] - a[0]);
  for (const [, q, i] of faces) { const P = projPoly(C, q); if (P.length < 3) continue; const lit = .5 + .5 * Math.sin(i * .9); fillPoly(ctx, P, mixHex('#0a0916', '#141226', lit)); ctx.strokeStyle = rgba('#a4b0dc', .06); ctx.lineWidth = 1; ctx.stroke(); }
  for (const run of projRuns(C, [...foot.map(([x, , z]) => [x, Math.max(.1, tide + .3), z]), [foot[0][0], Math.max(.1, tide + .3), foot[0][2]]], 4)) { ctx.save(); ctx.strokeStyle = rgba('#d8e4f8', .35); ctx.lineWidth = clamp(run[0][2] * .5, 1, 3); ctx.setLineDash([5, 7]); ctx.lineDashOffset = -lapse * 40; ctx.beginPath(); run.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
  const top = projPoly(C, rim3.map(([x, , z]) => [x, HL.y, z]));
  if (fillPoly(ctx, top, mixHex('#0c1214', '#141a22', dusk))) { ctx.strokeStyle = rgba('#a4b0dc', .12); ctx.lineWidth = 1; ctx.stroke(); }
  // a path of worn grass to the door, a few stones on the plateau
  const r = prng(77); for (let i = 0; i < 26; i++) { const a = r() * TAU, d = 6 + r() * 14, p = C.P(HL.x + Math.sin(a) * d * 1.1, HL.y + .05, HL.z + Math.cos(a) * d); if (!p) continue; const s = Math.max(1, p[2] * (.25 + .3 * r())); ctx.fillStyle = '#16141f'; ctx.beginPath(); ctx.ellipse(p[0], p[1], s, s * .45, 0, 0, TAU); ctx.fill(); }
  // the house: the new rooms first (they are beside it), then its walls, roof, chimney, the window
  const build = o.build ?? 0;
  const rooms = [[-7.2, -3.0, build * 1.6, 11], [3.0, 7.2, build * 1.6 - .6, 13]].sort((a, b) => C.depth(...hw((b[0] + b[1]) / 2, 1, 0)) - C.depth(...hw((a[0] + a[1]) / 2, 1, 0)));
  const houseD = C.depth(...hw(0, 1.5, 0));
  for (const [x0, x1, u, s] of rooms) if (C.depth(...hw((x0 + x1) / 2, 1, 0)) > houseD) newRoom(ctx, t, C, x0, x1, clamp(u), s);
  const { x0, x1, zf, zb, h, ridge } = HS;
  const side = C.depth(...hw(x0, 1, 0)) < C.depth(...hw(x1, 1, 0)) ? x0 : x1;
  stoneFace(ctx, C, [hw(side, 0, zb), hw(side, 0, zf), hw(side, h, zf), hw(side, h, zb)], 9, 21, '#110e1b');
  fillPoly(ctx, projPoly(C, [hw(side, h, zb), hw(side, h, zf), hw(side, ridge, (zf + zb) / 2)]), '#0f0d19');
  stoneFace(ctx, C, [hw(x0, 0, zf), hw(x1, 0, zf), hw(x1, h, zf), hw(x0, h, zf)], 9, 22, '#17131f');
  fillPoly(ctx, projPoly(C, [hw(x0 - .35, h - .05, zf - .35), hw(x1 + .35, h - .05, zf - .35), hw(x1 + .35, ridge + .05, (zf + zb) / 2), hw(x0 - .35, ridge + .05, (zf + zb) / 2)]), '#0a0812');
  fillPoly(ctx, projPoly(C, [hw(1.6, 3.4, .2), hw(2.2, 3.4, .2), hw(2.2, 5.2, .2), hw(1.6, 5.2, .2)]), '#0d0b16');
  // the door (dark) and the window: the light seen through it is the light of the whole film (the steady one)
  fillPoly(ctx, projPoly(C, [hw(-2.2, 0, zf - .01), hw(-1.3, 0, zf - .01), hw(-1.3, 2.0, zf - .01), hw(-2.2, 2.0, zf - .01)]), '#0a080f');
  const WP = winPoly(C); out.win = WP;
  if (WP.length > 2) {
    lightIn(ctx, t, WP, { tone: 'lamp' });
    // mullion cross and sill (thin, dark), the warm spill on the ground and the stones round it
    const m = (a, b) => { const p = C.P(...a), q = C.P(...b); if (p && q) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } };
    const k = C.P(...winCentre())?.[2] ?? 30;
    ctx.save(); ctx.strokeStyle = '#0a0710'; ctx.lineWidth = Math.max(1, k * .08); ctx.beginPath(); m(hw(WIN.x0 - .04, WIN.y0 - .04, zf - .02), hw(WIN.x1 + .04, WIN.y0 - .04, zf - .02)); m(hw(WIN.x1 + .04, WIN.y0 - .04, zf - .02), hw(WIN.x1 + .04, WIN.y1 + .04, zf - .02)); m(hw(WIN.x1 + .04, WIN.y1 + .04, zf - .02), hw(WIN.x0 - .04, WIN.y1 + .04, zf - .02)); m(hw(WIN.x0 - .04, WIN.y1 + .04, zf - .02), hw(WIN.x0 - .04, WIN.y0 - .04, zf - .02)); ctx.stroke(); ctx.restore();
    const c = C.P(...hw(0, 0, zf - 1.2));
    if (c) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = 3.2 * c[2], g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g.addColorStop(0, rgba('#ffb35c', .22)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(c[0], c[1], R, R * .35, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  }
  for (const [x0r, x1r, u, s] of rooms) if (C.depth(...hw((x0r + x1r) / 2, 1, 0)) <= houseD) newRoom(ctx, t, C, x0r, x1r, clamp(u), s);
  return out;
}

// ================================================================ the trainer plane (low wing, fixed gear), built from faces
export function planeL(P, a, b, c) {
  const h = P.head, p = P.pitch || 0, ro = P.roll || 0;
  const f = [Math.sin(h) * Math.cos(p), Math.sin(p), Math.cos(h) * Math.cos(p)], r0 = [Math.cos(h), 0, -Math.sin(h)], u0 = cross(f, r0);
  const r = [r0[0] * Math.cos(ro) - u0[0] * Math.sin(ro), r0[1] * Math.cos(ro) - u0[1] * Math.sin(ro), r0[2] * Math.cos(ro) - u0[2] * Math.sin(ro)];
  const u = [u0[0] * Math.cos(ro) + r0[0] * Math.sin(ro), u0[1] * Math.cos(ro) + r0[1] * Math.sin(ro), u0[2] * Math.cos(ro) + r0[2] * Math.sin(ro)];
  return [P.pos[0] + r[0] * a + u[0] * b + f[0] * c, P.pos[1] + r[1] * a + u[1] * b + f[1] * c, P.pos[2] + r[2] * a + u[2] * b + f[2] * c];
}
const FUS = [[3.25, .04, .04, .1], [2.95, .28, .28, .1], [2.35, .46, .44, .12], [1.4, .54, .54, .15], [.4, .55, .56, .15], [-.6, .5, .5, .18], [-1.4, .4, .4, .22], [-2.6, .25, .28, .28], [-3.6, .14, .2, .32], [-4.3, .06, .12, .36]];
const NSEG = 12;
// canopy: [c, half width at the sill, top height]; the sill is at b = .5
const CAN = [[1.5, .5, .55], [1.0, .47, 1.02], [.3, .45, 1.12], [-.4, .4, 1.04], [-.95, .32, .62]];
export const REAR = [[-.36, .58, -.9], [.36, .58, -.9], [.39, 1.0, -.42], [-.39, 1.0, -.42]];   // the rear window (plane coords: a, b, c)
function planeFaces(P) {
  const L = (a, b, c) => planeL(P, a, b, c), F = [];
  // fuselage
  for (let i = 0; i < FUS.length - 1; i++) {
    const [c0, w0, h0, m0] = FUS[i], [c1, w1, h1, m1] = FUS[i + 1];
    for (let j = 0; j < NSEG; j++) { const a0 = j / NSEG * TAU, a1 = (j + 1) / NSEG * TAU; F.push({ pts: [L(w0 * Math.cos(a0), m0 + h0 * Math.sin(a0), c0), L(w1 * Math.cos(a0), m1 + h1 * Math.sin(a0), c1), L(w1 * Math.cos(a1), m1 + h1 * Math.sin(a1), c1), L(w0 * Math.cos(a1), m0 + h0 * Math.sin(a1), c0)], col: i < 2 ? '#20243a' : '#1a1e30', k: 'body' }); }
  }
  // wings (low, dihedral), tapered, with thickness; h-stab; fin
  for (const s of [-1, 1]) {
    const root = [.5, -.28, 1.15, -.55, .2], tip = [5.0, .08, .85, -.3, .08];   // [a, b, LE c, TE c, thickness]
    const pt = (q, top, edge) => L(s * q[0], q[1] + (top ? q[4] * .6 : -q[4] * .4), edge === 'le' ? q[2] : edge === 'mid' ? q[2] - (q[2] - q[3]) * .3 : q[3]);
    F.push({ pts: [pt(root, 1, 'le'), pt(tip, 1, 'le'), pt(tip, 1, 'mid'), pt(root, 1, 'mid')], col: '#22273c', k: 'wing' });
    F.push({ pts: [pt(root, 1, 'mid'), pt(tip, 1, 'mid'), pt(tip, 1, 'te'), pt(root, 1, 'te')], col: '#1f2438', k: 'wing' });
    F.push({ pts: [pt(root, 0, 'le'), pt(tip, 0, 'le'), pt(tip, 0, 'te'), pt(root, 0, 'te')], col: '#111424', k: 'wing' });
    F.push({ pts: [pt(root, 1, 'le'), pt(tip, 1, 'le'), pt(tip, 0, 'le'), pt(root, 0, 'le')], col: '#1a1d2e', k: 'wing' });
    F.push({ pts: [pt(root, 1, 'te'), pt(tip, 1, 'te'), pt(tip, 0, 'te'), pt(root, 0, 'te')], col: '#151827', k: 'wing' });
    F.push({ pts: [pt(tip, 1, 'le'), pt(tip, 1, 'te'), pt(tip, 0, 'te'), pt(tip, 0, 'le')], col: '#191c2c', k: 'wing' });
    const sr = [.12, .3, -3.45, -4.15, .07], st = [1.75, .32, -3.7, -4.1, .04];
    F.push({ pts: [pt(sr, 1, 'le'), pt(st, 1, 'le'), pt(st, 1, 'te'), pt(sr, 1, 'te')], col: '#20243a', k: 'stab' });
    F.push({ pts: [pt(sr, 0, 'le'), pt(st, 0, 'le'), pt(st, 0, 'te'), pt(sr, 0, 'te')], col: '#111424', k: 'stab' });
    F.push({ pts: [L(s * .035, .4, -3.3), L(s * .035, 1.58, -3.88), L(s * .025, 1.58, -4.25), L(s * .035, .4, -4.32)], col: '#1c2034', k: 'fin' });
    // gear: strut and a wheel pant
    F.push({ pts: [L(s * 1.45, -.3, .62), L(s * 1.5, -1.05, .5), L(s * 1.5, -1.05, .38), L(s * 1.45, -.3, .44)], col: '#121524', k: 'gear' });
    const wp = []; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; wp.push(L(s * 1.5, -1.12 + .2 * Math.sin(a), .45 + .38 * Math.cos(a))); } F.push({ pts: wp, col: '#0e1020', k: 'gear' });
  }
  // the canopy glass (sides, top, windscreen) and the rear window
  for (let i = 0; i < CAN.length - 1; i++) {
    const [c0, w0, t0] = CAN[i], [c1, w1, t1] = CAN[i + 1];
    for (const s of [-1, 1]) { const q = [L(s * w0, .5, c0), L(s * w1, .5, c1), L(s * w1 * .62, t1, c1), L(s * w0 * .62, t0, c0)]; F.push({ pts: s > 0 ? q : q.reverse(), col: '#0d1526', k: 'glass' }); }
    F.push({ pts: [L(-w0 * .62, t0, c0), L(w0 * .62, t0, c0), L(w1 * .62, t1, c1), L(-w1 * .62, t1, c1)], col: '#0f182a', k: 'glass' });
  }
  F.push({ pts: REAR.map(([a, b, c]) => L(a, b, c)).reverse(), col: '#0d1526', k: 'rear' });
  return F;
}
export function plane(ctx, t, C, P, o = {}) {
  const out = {}, F = planeFaces(P), cam = [C.x, C.y, C.z], dark = o.dark ?? 0;
  const key = norm(o.key || [-.5, .6, -.3]), rimCol = o.rimCol || '#9fb0e0';
  const list = [];
  for (const f of F) {
    const c = f.pts.reduce((a, p) => [a[0] + p[0] / f.pts.length, a[1] + p[1] / f.pts.length, a[2] + p[2] / f.pts.length], [0, 0, 0]);
    let n = norm(cross(sub(f.pts[1], f.pts[0]), sub(f.pts[f.pts.length - 1], f.pts[0])));
    if (dot(n, sub(cam, c)) < 0) { if (f.k === 'body' || f.k === 'glass' || f.k === 'rear') continue; n = [-n[0], -n[1], -n[2]]; }
    list.push({ ...f, c, n, d: C.depth(...c) - (f.k === 'rear' ? 1 : 0) });   // seen from behind nothing but the fin can cover the rear window
  }
  list.sort((a, b) => b.d - a.d);
  for (const f of list) {
    const S = projPoly(C, f.pts); if (S.length < 3) continue;
    const lam = Math.max(0, dot(f.n, key)), col = mixHex(f.col, rimCol, (.2 * lam) * (1 - .6 * dark));
    if (f.k === 'rear' && o.inside) {
      // the rear window: the cockpit seen through it, then the glass (a cool sheen along its top edge)
      ctx.save(); path(ctx, S); ctx.clip(); ctx.fillStyle = '#05060c'; ctx.fillRect(0, 0, W, H); o.inside(ctx, S); ctx.restore();
      out.rear = S;
      ctx.save(); path(ctx, S); ctx.clip(); const y0 = Math.min(...S.map((p) => p[1])), y1 = Math.max(...S.map((p) => p[1])); const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, rgba('#c8d8ff', .16)); g.addColorStop(.3, rgba('#c8d8ff', .03)); g.addColorStop(1, rgba('#c8d8ff', 0)); ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0); ctx.restore();
      ctx.strokeStyle = rgba('#0a0c16', .9); ctx.lineWidth = Math.max(1, (C.P(...f.c)?.[2] ?? 10) * .03); path(ctx, S); ctx.stroke();
      continue;
    }
    fillPoly(ctx, S, col);
    if (f.k === 'glass' || f.k === 'rear') {
      // dark glass: the panel's amber glow inside, a cool reflection of the sky
      const gl = o.glow ?? .6; ctx.save(); path(ctx, S); ctx.clip(); const cp = C.P(...planeL(P, 0, .7, .9)); if (cp && gl > 0) { ctx.globalCompositeOperation = 'lighter'; const R = clamp(cp[2] * 1.1, 6, 220), g = ctx.createRadialGradient(cp[0], cp[1], 0, cp[0], cp[1], R); g.addColorStop(0, rgba('#ffb35c', .5 * gl)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(cp[0] - R, cp[1] - R, 2 * R, 2 * R); } ctx.restore();
      ctx.strokeStyle = rgba('#c8d8ff', .12); ctx.lineWidth = 1; ctx.stroke();
      if (f.k === 'rear') out.rear = S;
    } else if (lam > .2) { ctx.strokeStyle = rgba(rimCol, .12 * lam); ctx.lineWidth = 1; ctx.stroke(); }
  }
  // the propeller: two blades seen as they are at this instant, the spinner
  const ang = t * 41.3, sp = C.P(...planeL(P, 0, .1, 3.3));
  if (sp) { ctx.save(); ctx.strokeStyle = rgba('#3a3e52', .9); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, sp[2] * .1); ctx.beginPath(); for (const s of [-1, 1]) { const q = C.P(...planeL(P, s * .95 * Math.cos(ang), .1 + s * .95 * Math.sin(ang), 3.28)); if (q) { ctx.moveTo(sp[0], sp[1]); ctx.lineTo(q[0], q[1]); } } ctx.stroke(); ctx.restore(); }
  // lights: red left tip, green right tip, white tail, the red beacon on the fin, the strobes
  const glowAt = (p, col, R, a) => { if (!p || a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = Math.max(4, R), g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); g.addColorStop(0, rgba('#ffffff', .9 * a)); g.addColorStop(.15, rgba(col, .7 * a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r); ctx.restore(); };
  const lp = (a, b, c) => C.P(...planeL(P, a, b, c)), kk = (p) => (p ? p[2] : 0);
  const pl = lp(-5.02, .1, .7), pr = lp(5.02, .1, .7), pt = lp(0, .36, -4.38), pb = lp(0, 1.62, -4.05);
  glowAt(pl, '#ff3a2a', 14 + kk(pl) * .5, .9); glowAt(pr, '#3aff8a', 14 + kk(pr) * .5, .9); glowAt(pt, '#f3efe2', 10 + kk(pt) * .4, .7);
  glowAt(pb, '#ff2a1a', 18 + kk(pb) * .6, (t % 1) < .12 ? 1 : 0);
  const st = (t % 1.3); if (st < .05 || (st > .12 && st < .17)) { glowAt(pl, '#ffffff', 30 + kk(pl) * 1.2, 1); glowAt(pr, '#ffffff', 30 + kk(pr) * 1.2, 1); }
  out.nose = lp(0, .1, 3.3); out.tail = lp(0, .3, -4.3); out.centre = lp(0, .3, 0);
  return out;
}

// ================================================================ the cockpit from behind (frame space)
const WS = { x0: 300, x1: 1620, y0: 110, y1: 470 };   // the windscreen's bounds (frame space)
export const WSRECT = [WS.x0, WS.y0, WS.x1 - WS.x0, WS.y1 - WS.y0];
const GAUGES = [[690, 690], [960, 690], [1230, 690], [690, 870], [960, 870], [1230, 870]];
export function cockpit(ctx, t, o = {}) {
  const night = o.night ?? 0, bank = (o.bank ?? 0) + .015 * Math.sin(t * .7), hdg = o.hdg ?? 0;
  ctx.save();
  // through the windscreen: the sky (blue hour → night), the horizon tilting a little, far lights
  ctx.save(); ctx.beginPath(); ctx.moveTo(WS.x0 + 60, WS.y0); ctx.quadraticCurveTo(960, WS.y0 - 40, WS.x1 - 60, WS.y0); ctx.lineTo(WS.x1, WS.y1); ctx.quadraticCurveTo(960, WS.y1 + 30, WS.x0, WS.y1); ctx.closePath(); ctx.clip();
  const hy = 380 + 30 * Math.sin(t * .3);
  const g = ctx.createLinearGradient(0, WS.y0 - 40, 0, hy); g.addColorStop(0, mixHex('#1a2a5a', '#070a1e', night)); g.addColorStop(.7, mixHex('#3a4e8a', '#121540', night)); g.addColorStop(1, mixHex('#c08a8a', '#1f1c47', night)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, hy + 2);
  ctx.save(); ctx.translate(960, hy); ctx.rotate(bank);
  ctx.fillStyle = mixHex('#141a34', '#06060f', night); ctx.fillRect(-1600, 0, 3200, 800);
  const r = prng(9); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 70; i++) { const x = (r() - .5) * 2200 - ((t * 14) % 2200) * 0, y = 4 + r() * 60; ctx.fillStyle = rgba(r() < .7 ? '#ffcf8a' : '#cfe4ff', .3 + .5 * r()); ctx.fillRect(x, y, 2, 2); }
  for (let i = 0; i < 160 * night; i++) { const x = (r() - .5) * 2000, y = -20 - r() * 420; ctx.fillStyle = rgba('#f3efe2', (.25 + .6 * r()) * night); ctx.fillRect(x, y, 1.6, 1.6); }
  ctx.restore();
  ctx.restore();
  // the cabin: frame, glareshield, panel
  ctx.fillStyle = '#07070d'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.moveTo(WS.x0 + 60, WS.y0); ctx.quadraticCurveTo(960, WS.y0 - 40, WS.x1 - 60, WS.y0); ctx.lineTo(WS.x1, WS.y1); ctx.quadraticCurveTo(960, WS.y1 + 30, WS.x0, WS.y1); ctx.closePath(); ctx.fill('evenodd');
  ctx.strokeStyle = '#141420'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(WS.x0 + 60, WS.y0); ctx.quadraticCurveTo(960, WS.y0 - 40, WS.x1 - 60, WS.y0); ctx.lineTo(WS.x1, WS.y1); ctx.quadraticCurveTo(960, WS.y1 + 30, WS.x0, WS.y1); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#100f18'; ctx.beginPath(); ctx.moveTo(120, 560); ctx.quadraticCurveTo(960, 470, 1800, 560); ctx.lineTo(1800, 600); ctx.quadraticCurveTo(960, 520, 120, 600); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#16141f'; ctx.beginPath(); ctx.moveTo(140, 595); ctx.quadraticCurveTo(960, 518, 1780, 595); ctx.lineTo(1880, H); ctx.lineTo(40, H); ctx.closePath(); ctx.fill();
  // the six gauges (dim cool faces), the heading dial glows amber
  GAUGES.forEach(([x, y], i) => {
    const hd = i === 4, R = 74;
    ctx.fillStyle = '#05050a'; ctx.beginPath(); ctx.arc(x, y, R + 8, 0, TAU); ctx.fill();
    if (hd) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(x, y, 0, x, y, R * 3.2); gg.addColorStop(0, rgba('#ffb35c', .5)); gg.addColorStop(.35, rgba('#ff8a3a', .14)); gg.addColorStop(1, rgba('#ff8a3a', 0)); ctx.fillStyle = gg; ctx.fillRect(x - R * 3.2, y - R * 3.2, R * 6.4, R * 6.4); ctx.restore(); }
    ctx.fillStyle = hd ? '#1a0e06' : '#0b0d14'; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(x, y); if (hd) ctx.rotate(-hdg);
    ctx.strokeStyle = hd ? rgba('#ffcf8a', .95) : rgba('#9fb8c8', .35); ctx.lineWidth = hd ? 2.2 : 1.4; ctx.beginPath();
    for (let k = 0; k < (hd ? 36 : 24); k++) { const a = k / (hd ? 36 : 24) * TAU, L = hd ? (k % 9 === 0 ? 22 : k % 3 === 0 ? 14 : 8) : 8; ctx.moveTo(Math.cos(a) * (R - 6), Math.sin(a) * (R - 6)); ctx.lineTo(Math.cos(a) * (R - 6 - L), Math.sin(a) * (R - 6 - L)); }
    ctx.stroke();
    if (hd) { ctx.fillStyle = rgba('#ffcf8a', .95); for (let k = 0; k < 4; k++) { const a = k / 4 * TAU - Math.PI / 2; ctx.beginPath(); ctx.arc(Math.cos(a) * (R - 40), Math.sin(a) * (R - 40), k === 0 ? 5 : 3, 0, TAU); ctx.fill(); } }
    ctx.restore();
    if (hd) { ctx.fillStyle = rgba('#fff1d6', .95); ctx.beginPath(); ctx.moveTo(x, y - R + 4); ctx.lineTo(x - 9, y - R + 22); ctx.lineTo(x + 9, y - R + 22); ctx.closePath(); ctx.fill(); ctx.strokeStyle = rgba('#fff1d6', .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y - 18); ctx.lineTo(x, y + 18); ctx.moveTo(x - 26, y + 6); ctx.lineTo(x + 26, y + 6); ctx.stroke(); }
    else { const a = (i * 1.7 + .2 * Math.sin(t * .8 + i)) % TAU; ctx.strokeStyle = rgba('#c8e0e8', .5); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * (R - 16), y + Math.sin(a) * (R - 16)); ctx.stroke(); }
  });
  // the two of them from behind: heads with headsets, shoulders, seat backs; rim from the panel and the dial
  const fig = (x, y, s, ph) => {
    const b = 2 * Math.sin(t * 1.4 + ph);
    ctx.fillStyle = '#0a090f'; ctx.beginPath(); ctx.moveTo(x - 300 * s, H + 10); ctx.lineTo(x - 270 * s, y + 230 * s); ctx.quadraticCurveTo(x, y + 130 * s, x + 270 * s, y + 230 * s); ctx.lineTo(x + 300 * s, H + 10); ctx.closePath(); ctx.fill();   // seat back
    ctx.fillStyle = '#0e0c14'; ctx.beginPath(); ctx.moveTo(x - 250 * s, H + 10); ctx.quadraticCurveTo(x - 240 * s, y + 160 * s + b, x - 70 * s, y + 140 * s + b); ctx.lineTo(x + 70 * s, y + 140 * s + b); ctx.quadraticCurveTo(x + 240 * s, y + 160 * s + b, x + 250 * s, H + 10); ctx.closePath(); ctx.fill();   // shoulders
    ctx.fillRect(x - 46 * s, y + 70 * s + b, 92 * s, 90 * s);   // neck
    ctx.beginPath(); ctx.ellipse(x, y + b, 92 * s, 108 * s, 0, 0, TAU); ctx.fill();   // head
    ctx.strokeStyle = '#1a1822'; ctx.lineWidth = 16 * s; ctx.beginPath(); ctx.arc(x, y + b + 10 * s, 100 * s, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();   // headset band
    ctx.fillStyle = '#16141e'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + sd * 96 * s, y + b + 20 * s, 26 * s, 44 * s, 0, 0, TAU); ctx.fill(); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb35c', .35); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.ellipse(x, y + b, 92 * s, 108 * s, 0, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.strokeStyle = rgba('#9fb0e0', .25); ctx.beginPath(); ctx.moveTo(x - 248 * s, y + 200 * s + b); ctx.quadraticCurveTo(x - 238 * s, y + 160 * s + b, x - 70 * s, y + 142 * s + b); ctx.stroke(); ctx.restore();
  };
  fig(600, 520, 1, 0);
  // the instructor (right): his arm reaches over to the heading dial and points
  const pu = clamp(o.point ?? 0), sx = 1240, sy = 760, tip = [960 + 30, 870 - 6], hx = sx + (tip[0] - 40 - sx) * eoX(pu), hy2 = sy + (tip[1] + 20 - sy) * eoX(pu) - 90 * Math.sin(Math.PI * pu);
  fig(1320, 510, 1, 1.3);
  if (pu > 0) {
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#1e1622'; ctx.lineWidth = 52; ctx.beginPath(); ctx.moveTo(sx + 60, sy + 20); ctx.quadraticCurveTo((sx + hx) / 2 + 30, Math.max(sy, hy2) + 60, hx + 20, hy2 + 8); ctx.stroke();
    // the hand: a fist with the index finger out toward the dial
    ctx.fillStyle = '#2a1a14'; ctx.beginPath(); ctx.ellipse(hx + 6, hy2 + 4, 34, 26, -.3, 0, TAU); ctx.fill();
    const fx = hx - 10 + (tip[0] - hx) * .9 * pu, fy = hy2 + (tip[1] - hy2) * .9 * pu; ctx.lineWidth = 15; ctx.strokeStyle = '#2a1a14'; ctx.beginPath(); ctx.moveTo(hx - 14, hy2); ctx.lineTo(fx, fy); ctx.stroke();
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb35c', .8 * pu); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx - 14, hy2 + 7); ctx.lineTo(fx, fy + 6); ctx.stroke(); ctx.beginPath(); ctx.ellipse(hx + 6, hy2 + 4, 34, 26, -.3, Math.PI * .4, Math.PI * 1.1); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  return { screen: WSRECT };
}

// ================================================================ the station hall (floor y = HALL.y; x −14..14, z 0..44)
export const HALL = { y: 1.2, x0: -14, x1: 14, z0: 0, z1: 44, h: 14 };
export const GLOBES = [[0, 8.2, 10], [0, 8.2, 20], [0, 8.2, 30]];
export const EWIN = { z0: 17, z1: 22, y0: 4, y1: 11.5 };   // the open east window the kite leaves by
const hp = (x, y, z) => [x, HALL.y + y, z];
// the board: rows × cols of flaps, each flipping on its own clock while the board runs
function board(ctx, t, C, o) {
  const x0 = -8.5, x1 = 8.5, y0 = 6.2, y1 = 11.2, z = HALL.z1 - .05, rows = 9, cols = 26, run = o.flip ?? 1;
  fillPoly(ctx, projPoly(C, [hp(x0 - .4, y0 - .4, z), hp(x1 + .4, y0 - .4, z), hp(x1 + .4, y1 + .4, z), hp(x0 - .4, y1 + .4, z)]), '#06060b');
  const cw = (x1 - x0) / cols, rh = (y1 - y0) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (c % 9 === 8) continue;   // gaps between the columns of a row
    const a = hp(x0 + c * cw + cw * .08, y1 - r * rh - rh * .1, z), b = hp(x0 + (c + 1) * cw - cw * .08, y1 - (r + 1) * rh + rh * .1, z);
    const pa = C.P(...a), pb = C.P(...b); if (!pa || !pb) continue;
    const X = pa[0], Y = pa[1], w = pb[0] - pa[0], h = pb[1] - pa[1]; if (w < 1) continue;
    const seed = r * 31 + c, per = .09 + .05 * hash(seed), ph = (t / per + hash(seed * 3) * 10) * run, n = Math.floor(ph), f = ph - n;
    ctx.fillStyle = '#161720'; ctx.fillRect(X, Y, w, h);
    // the glyph (unreadable: a few strokes from the flap's current state), the top half folding down while it flips
    const g = hash(seed * 7 + n * 13);
    ctx.strokeStyle = rgba('#f3efe2', .82); ctx.lineWidth = Math.max(.6, w * .09); ctx.beginPath();
    const gx = (u) => X + w * (.25 + .5 * u), gy = (v) => Y + h * (.2 + .6 * v);
    if (g < .3) { ctx.moveTo(gx(0), gy(1)); ctx.lineTo(gx(.5), gy(0)); ctx.lineTo(gx(1), gy(1)); } else if (g < .55) { ctx.moveTo(gx(0), gy(0)); ctx.lineTo(gx(0), gy(1)); ctx.lineTo(gx(1), gy(1)); } else if (g < .8) { ctx.moveTo(gx(1), gy(0)); ctx.lineTo(gx(0), gy(.5)); ctx.lineTo(gx(1), gy(1)); } else { ctx.moveTo(gx(0), gy(0)); ctx.lineTo(gx(1), gy(0)); ctx.moveTo(gx(.5), gy(0)); ctx.lineTo(gx(.5), gy(1)); }
    ctx.stroke();
    if (run > 0 && f < .5) { const k = Math.cos(f / .5 * Math.PI); ctx.fillStyle = '#1c1d28'; ctx.fillRect(X, Y + h * .5 - h * .5 * Math.abs(k), w, h * .5 * Math.abs(k)); }
    ctx.fillStyle = '#04040a'; ctx.fillRect(X, Y + h * .49, w, Math.max(.6, h * .02));
  }
  // its light on the hall: a cool wash under it
  const c = C.P(...hp(0, y0 - 1, z - 1)); if (c) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = 14 * c[2], g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g.addColorStop(0, rgba('#cfe4ff', .12)); g.addColorStop(1, rgba('#cfe4ff', 0)); ctx.fillStyle = g; ctx.fillRect(c[0] - R, c[1] - R, 2 * R, 2 * R); ctx.restore(); }
}
export function hall(ctx, t, C, o = {}) {
  const out = {}, { x0, x1, z0, z1, h } = HALL;
  // outside first (seen through the east windows and once the camera has left): the beach world
  if (o.outside) o.outside(ctx, t, C);
  // walls as faces with window holes (even-odd), painter order: far → near
  const winds = []; for (let i = 0; i < 6; i++) { const za = 3 + i * 7, zb = za + 5; winds.push([za, zb]); }
  const faces = [
    { q: [hp(x0, 0, z1), hp(x1, 0, z1), hp(x1, h, z1), hp(x0, h, z1)], col: '#141220', holes: [] },
    { q: [hp(x0, 0, z0), hp(x0, 0, z1), hp(x0, h, z1), hp(x0, h, z0)], col: '#110f1c', holes: winds.map(([a, b]) => [hp(x0, 4, a), hp(x0, 4, b), hp(x0, 11.5, b), hp(x0, 11.5, a)]) },
    { q: [hp(x1, 0, z0), hp(x1, 0, z1), hp(x1, h, z1), hp(x1, h, z0)], col: '#120f1d', holes: winds.map(([a, b]) => [hp(x1, 4, a), hp(x1, 4, b), hp(x1, 11.5, b), hp(x1, 11.5, a)]) },
    { q: [hp(x0, h, z0), hp(x1, h, z0), hp(x1, h, z1), hp(x0, h, z1)], col: '#0a0912', holes: [] },
    { q: [hp(x0, 0, z0), hp(x1, 0, z0), hp(x1, 0, z1), hp(x0, 0, z1)], col: '#16131c', holes: [], floor: true },
  ];
  if (C.x < x1 - .05) {
    for (const f of faces) {
      const P = projPoly(C, f.q); if (P.length < 3) continue;
      ctx.save(); ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
      for (const hq of f.holes) { const Hq = projPoly(C, hq); if (Hq.length > 2) { Hq.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); } }
      ctx.fillStyle = f.col; ctx.fill('evenodd');
      if (f.floor) { ctx.clip(); ctx.strokeStyle = rgba('#a4b0dc', .07); ctx.lineWidth = 1; for (let z = z0; z <= z1; z += 2) for (const run of projRuns(C, [hp(x0, .01, z), hp(x1, .01, z)])) { ctx.beginPath(); ctx.moveTo(run[0][0], run[0][1]); ctx.lineTo(run[run.length - 1][0], run[run.length - 1][1]); ctx.stroke(); } for (let x = x0; x <= x1; x += 2) for (const run of projRuns(C, [hp(x, .01, z0), hp(x, .01, z1)])) { ctx.beginPath(); ctx.moveTo(run[0][0], run[0][1]); ctx.lineTo(run[run.length - 1][0], run[run.length - 1][1]); ctx.stroke(); } }
      ctx.restore();
    }
    // iron trusses under the roof
    ctx.save(); ctx.strokeStyle = '#1c1a28'; for (let z = 4; z < z1; z += 6) { for (const run of projRuns(C, [hp(x0, h - 3, z), hp(-4, h - .3, z), hp(4, h - .3, z), hp(x1, h - 3, z)])) { ctx.lineWidth = Math.max(1, run[0][2] * .25); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } } ctx.restore();
    // the window mullions (east and west)
    ctx.save(); ctx.strokeStyle = '#0b0a12'; for (const xx of [x0, x1]) for (const [a, b] of winds) { for (const run of projRuns(C, [hp(xx, 4, (a + b) / 2), hp(xx, 11.5, (a + b) / 2)])) { ctx.lineWidth = Math.max(1, run[0][2] * .12); ctx.beginPath(); ctx.moveTo(run[0][0], run[0][1]); ctx.lineTo(run[run.length - 1][0], run[run.length - 1][1]); ctx.stroke(); } } ctx.restore();
    board(ctx, t, C, o);
    // the one lit door under the board: cold white light, its spill on the floor
    const D = projPoly(C, [hp(-1.3, 0, z1 - .06), hp(1.3, 0, z1 - .06), hp(1.3, 3.4, z1 - .06), hp(-1.3, 3.4, z1 - .06)]);
    if (D.length > 2) { const da = o.door ?? 1; fillPoly(ctx, D, mixHex('#2a3040', '#eef4ff', da)); const c = C.P(...hp(0, 0, z1 - 3)); if (c) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = 8 * c[2], g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g.addColorStop(0, rgba('#dfeaff', .3 * da)); g.addColorStop(1, rgba('#dfeaff', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(c[0], c[1], R, R * .3, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
    // the people (walkers and those standing)
    if (o.crowd) crowd(ctx, t, C, o.crowd, { y: HALL.y, light: hp(0, 3, z1), lightCol: '#cfe4ff' });
    if (o.after) o.after(ctx, t, C);
    // the pendant globes (warm), drawn last
    for (const g of GLOBES) {
      const p = C.P(...g); if (!p) continue; const R = .45 * p[2];
      const top = C.P(g[0], g[1] + 6, g[2]); if (top) { ctx.strokeStyle = '#0c0b12'; ctx.lineWidth = Math.max(1, p[2] * .03); ctx.beginPath(); ctx.moveTo(p[0], p[1] - R); ctx.lineTo(top[0], top[1]); ctx.stroke(); }
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R * 6); gg.addColorStop(0, rgba('#ffcf8a', .35)); gg.addColorStop(1, rgba('#ffcf8a', 0)); ctx.fillStyle = gg; ctx.fillRect(p[0] - R * 6, p[1] - R * 6, R * 12, R * 12); ctx.restore();
      ctx.fillStyle = '#ffe2b0'; ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba('#fff6e2', .9); ctx.beginPath(); ctx.arc(p[0] - R * .2, p[1] - R * .2, R * .55, 0, TAU); ctx.fill();
      if (g === GLOBES[0]) out.globe = [p[0], p[1], R];
    }
  } else if (o.after) o.after(ctx, t, C);
  return out;
}

// ================================================================ the pre-dawn beach east of the hall (sand y falls from 1.2 at the hall to 0 at the water)
export const BEACH = { xw: 72 };                     // the waterline
export const sandY = (x) => 1.2 * clamp((BEACH.xw - x) / (BEACH.xw - HALL.x1));
export const MIRROR = { x: 64, z: 34, w: 1.3, h: 2.7, n: [.55, -.83] };   // n = the pane's facing (toward the sea and the south-east)
const mpt = (u, v) => { const t = [-MIRROR.n[1], MIRROR.n[0]]; return [MIRROR.x + t[0] * u, sandY(MIRROR.x) + .35 + v, MIRROR.z + t[1] * u]; };
export function mirrorQuad() { const w = MIRROR.w / 2; return [mpt(-w, MIRROR.h), mpt(w, MIRROR.h), mpt(w, 0), mpt(-w, 0)]; }
// the reflected camera across the pane's plane
function mirrorCam(C) {
  const n = [MIRROR.n[0], 0, MIRROR.n[1]], p0 = [MIRROR.x, 0, MIRROR.z], d = dot(sub([C.x, C.y, C.z], p0), n);
  const pos = [C.x - 2 * d * n[0], C.y, C.z - 2 * d * n[2]], fwd = skyDir(C.yaw, -C.pitch), fd = dot(fwd, n), rf = [fwd[0] - 2 * fd * n[0], fwd[1], fwd[2] - 2 * fd * n[2]];
  return { pos, yaw: Math.atan2(rf[0], rf[2]), pitch: C.pitch };
}
export function beachGround(ctx, t, C, o = {}) {
  // the sand: a plane from the hall to the water (and far along it), shaded darker inland; the wet band and the foam
  const z0 = -400, z1 = 900;
  fillPoly(ctx, projPoly(C, [[HALL.x1, HALL.y, z0], [BEACH.xw, 0, z0], [BEACH.xw, 0, z1], [HALL.x1, HALL.y, z1]]), mixHex('#14121c', '#2a2230', o.dawn ?? 0));
  fillPoly(ctx, projPoly(C, [[-400, HALL.y, z0], [HALL.x1, HALL.y, z0], [HALL.x1, HALL.y, z1], [-400, HALL.y, z1]]), '#0e0d16');
  const wet = projPoly(C, [[BEACH.xw - 3, .05, z0], [BEACH.xw + .5, .01, z0], [BEACH.xw + .5, .01, z1], [BEACH.xw - 3, .05, z1]]); fillPoly(ctx, wet, mixHex('#1a1a2c', '#4a3a52', o.dawn ?? 0));
  for (const k of [0, 1]) { const xx = BEACH.xw + .3 - k * 1.6 + .8 * Math.sin(t * .6 + k * 2); const fl = []; for (let z = z0; z <= z1; z += 10) fl.push([xx, .03, z]); for (const run of projRuns(C, fl, 2)) { ctx.save(); ctx.strokeStyle = rgba('#e8eef8', .35 - k * .12); ctx.lineWidth = clamp(run[run.length >> 1][2] * .05, 1, 2.5); ctx.setLineDash([12, 9]); ctx.lineDashOffset = t * 8; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); } }
}
// footprints along a path (world points), the newest last
export function prints(ctx, C, pts, a = 1) {
  ctx.save(); ctx.fillStyle = rgba('#05040a', .55 * a);
  pts.forEach((p, i) => { const s = i % 2 ? .14 : -.14, q = C.P(p[0] + s * p[3], sandY(p[0]) + .01, p[2] - s * p[4]); if (!q) return; const r = Math.max(.8, q[2] * .1); ctx.beginPath(); ctx.ellipse(q[0], q[1], r, r * .45, 0, 0, TAU); ctx.fill(); });
  ctx.restore();
}
// the mirror: a tall dark pane on a low base; it shows only what lies behind (the land, the dark, the footprints), never the dawn
export function mirror(ctx, t, C, o = {}) {
  const Q = mirrorQuad(), P = projPoly(C, Q); if (P.length < 3) return null;
  const front = dot(sub([C.x, C.y, C.z], [MIRROR.x, 0, MIRROR.z]), [MIRROR.n[0], 0, MIRROR.n[1]]) > 0;
  // base and frame
  const b = [mpt(-MIRROR.w / 2 - .1, .02), mpt(MIRROR.w / 2 + .1, .02), mpt(MIRROR.w / 2 + .1, -.35), mpt(-MIRROR.w / 2 - .1, -.35)]; fillPoly(ctx, projPoly(C, b), '#09080e');
  fillPoly(ctx, P, '#06060b');
  if (front) {
    const M = mirrorCam(C);
    ctx.save(); path(ctx, P); ctx.clip();
    const Cm = o.camera({ x: M.pos[0], y: M.pos[1], z: M.pos[2], yaw: M.yaw, pitch: M.pitch, F: C.F });
    ctx.translate(W, 0); ctx.scale(-1, 1);
    drawSky(ctx, t, Cm, { mw: .25, dawn: 0, stars: .6 });
    beachGround(ctx, t, Cm, { dawn: 0 });
    if (o.reflect) o.reflect(ctx, t, Cm);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgba(4,4,10,.45)'; ctx.fillRect(0, 0, W, H);
    const yy = P.map((p) => p[1]), g = ctx.createLinearGradient(0, Math.min(...yy), 0, Math.max(...yy)); g.addColorStop(0, rgba('#c8d8ff', .1)); g.addColorStop(.5, rgba('#c8d8ff', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  ctx.save(); ctx.strokeStyle = rgba('#a4b0dc', .3); ctx.lineWidth = Math.max(1.2, (C.P(...mpt(0, 1))?.[2] ?? 10) * .05); path(ctx, P); ctx.stroke(); ctx.restore();
  return P;
}
// the walker in profile (a silhouette with a dawn rim) at a world point, heading `dir` (+1 = screen right); returns the hand
export function walker(ctx, t, C, x, z, o = {}) {
  const p = C.P(x, sandY(x), z); if (!p) return null;
  const h = 1.75 * p[2], dir = o.dir ?? 1, ph = o.phase ?? 0;
  if (o.rim) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; crowdWalker(ctx, t, p[0] + o.rim * 1.5, p[1], h, ph, { dir, lamp: 0, col: rgba('#ffb36a', .35) }); ctx.restore(); }
  crowdWalker(ctx, t, p[0], p[1], h, ph, { dir, lamp: 0, col: '#09080e' });
  const k = h / 180, bob = Math.abs(Math.cos(ph)) * 2;
  return [p[0] + 30 * k * dir, p[1] + (-100 + bob) * k];
}
// a paper kite: a diamond with a spine and spar, a tail of bows; its string from the hand (screen points)
export function kite(ctx, t, C, K, o = {}) {
  const p = C.P(...K); if (!p) return null;
  const s = Math.max(6, p[2] * .9), a = .25 * Math.sin(t * 2.3) + (o.tilt ?? 0), lit = o.lit ?? 0;
  ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(a);
  ctx.fillStyle = mixHex('#2a2230', '#f3e2c0', .35 + .65 * lit); ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * .62, -s * .25); ctx.lineTo(0, s * .9); ctx.lineTo(-s * .62, -s * .25); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#1a1018', .8); ctx.lineWidth = Math.max(1, s * .05); ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s * .9); ctx.moveTo(-s * .62, -s * .25); ctx.lineTo(s * .62, -s * .25); ctx.stroke();
  if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffd9a0', .5 * lit); ctx.lineWidth = Math.max(1, s * .06); ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * .62, -s * .25); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; }
  // the tail: bows on a thread swinging behind
  ctx.strokeStyle = rgba('#2a1a14', .8); ctx.lineWidth = Math.max(.8, s * .03); ctx.beginPath(); const tl = []; for (let i = 0; i <= 8; i++) tl.push([s * .5 * Math.sin(t * 4 - i * .7) * i / 8, s * .9 + i * s * .32]); tl.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
  ctx.fillStyle = mixHex('#3a2030', '#e8892e', .4 + .6 * lit); for (let i = 2; i <= 8; i += 2) { const [x, y] = tl[i]; ctx.beginPath(); ctx.moveTo(x - s * .12, y - s * .06); ctx.lineTo(x + s * .12, y + s * .06); ctx.lineTo(x + s * .12, y - s * .06); ctx.lineTo(x - s * .12, y + s * .06); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  return [p[0] + Math.sin(a) * -s * .9 * 0, p[1] + s * .9];
}
// the string: a glowing amber line along screen points
export function glowLine(ctx, pts, o = {}) {
  if (pts.length < 2) return;
  const cols = o.cols || [['#ffb35c', 22, .06], ['#ffb35c', 7, .2], ['#fff1d6', 2, .95]], a = o.a ?? 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [c, w, al] of cols) { ctx.strokeStyle = rgba(c, al * a); ctx.lineWidth = w * (o.wk ?? 1); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
}
