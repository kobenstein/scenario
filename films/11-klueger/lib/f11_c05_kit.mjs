// Film 11 · props + camera for c05 / c06 / c09 (builder of c05, c06, c09). Same style as lib/f11_kit.mjs: brass, wood, paper, warm light,
// contact shadows, pure functions of t. Used by scenes/sc05.mjs, sc06.mjs, sc09.mjs.
//
//   glide(t, K, o)          the calm camera: a monotone cubic (Fritsch–Butland) through timed keys [[t, cam], …]: velocity continuous through
//                           every key (no dead stops), no overshoot; a "hold" is two keys a few cm apart (a slow drift), a "move" is two keys far
//                           apart over 4–7 s (peak ≈ 1.5 × mean speed). o.drift = metres of an extra slow breathing drift (default .04).
//   machine2(ctx, t, o)     K.machine (copied) + o.coreFill(ctx, cx, cy, R) draws the glass itself (a plate for a push into / out of the core),
//                           o.ring (ring turning speed factor: 1 = normal, .2 = listening), o.flip handled by the caller (ctx.scale(-k, k)).
//   rollingBoard(ctx, V, c, o)  a free-standing school blackboard on castors (2.6 × 1.3 m slate, facing −z), o.content(ctx, B) in board cm
//                           (B = { w: 260, h: 130 }), returns the slate's screen quad. c = [x, 0, z] centre on the floor.
//   box3(ctx, V, x0, x1, z0, z1, h, o)  a wooden box (plyo step / crate) standing on the floor, o.label(ctx, w, h) drawn on its −z face (cm),
//                           o.slats (crate) ; o.y0 base height (carried boxes).
//   rail(ctx, V, pts, u)    a brass guardrail along a floor polyline: posts rise, then the top rail runs along (u 0…1).
//   cardOn(ctx, V, q, o)    a pinned paper card: q = 4 world corners (tl, tr, br, bl); o.fill(ctx, S) draws the paper (clipped), o.text(ctx, w, h)
//                           in card cm (affine at the card), o.u unrolls it from the top (mask), pins.
//   lectern(ctx, V, p, o)   a wooden lectern with an open papyrus scroll on its slanted top; o.fill(ctx, S) draws the papyrus (clipped) → S.
//   lampGlobe(V, x, z)      screen circle of a pendant lamp globe (as hall() draws it) → { x, y, r, z }.
//   coatDress, DOC_SEAT …   people: doctors in white coats, teachers.
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng } from '../engine.mjs';
import * as K from './f11_kit.mjs';
import * as Wd from './f11_c02_world.mjs';

const TAU = Math.PI * 2;
const { PAL } = K;

// ---------------------------------------------------------------- camera
export function glide(t, Kk, o = {}) {
  const n = Kk.length;
  const out = {};
  if (t <= Kk[0][0] || t >= Kk[n - 1][0]) Object.assign(out, t <= Kk[0][0] ? Kk[0][1] : Kk[n - 1][1]);
  else {
    let i = 0; while (t > Kk[i + 1][0]) i++;
    const h = Kk[i + 1][0] - Kk[i][0], u = (t - Kk[i][0]) / h;
    for (const j of Object.keys(Kk[i][1])) {
      const v = (k) => Kk[k][1][j] ?? Kk[i][1][j];
      const d = (k) => (v(k + 1) - v(k)) / (Kk[k + 1][0] - Kk[k][0]);
      const m = (k) => {
        if (k <= 0 || k >= n - 1) return 0;
        const a = d(k - 1), b = d(k); if (a * b <= 0) return 0;
        const ha = Kk[k][0] - Kk[k - 1][0], hb = Kk[k + 1][0] - Kk[k][0];
        return 3 * (ha + hb) / ((2 * hb + ha) / a + (hb + 2 * ha) / b);   // Fritsch–Butland weighted harmonic mean
      };
      const p0 = v(i), p1 = v(i + 1), m0 = m(i) * h, m1 = m(i + 1) * h, u2 = u * u, u3 = u2 * u;
      out[j] = (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1;
    }
  }
  const A = o.drift ?? .04;
  if (A) { out.x += A * Math.sin(t * .23 + 1.1); out.y += A * .6 * Math.sin(t * .17 + 2.3); out.z += A * Math.sin(t * .19 + .4); out.yaw += A * .05 * Math.sin(t * .13 + .9); }
  return out;
}

// ---------------------------------------------------------------- the machine (copy of K.machine with a plate core + ring speed)
const brassGrad = (ctx, x0, y0, x1, y1, lit = 1) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, PAL.brassDark); g.addColorStop(.35, PAL.brass); g.addColorStop(.55, lit > .5 ? PAL.brassLit : PAL.brass); g.addColorStop(1, PAL.brassDark); return g; };
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
const mixc = (a, b, u) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return `rgb(${m(16)},${m(8)},${m(0)})`; };
export { brassGrad };
export function machine2(ctx, t, o = {}) {
  const core = o.core ?? 1, br = 1 + .035 * Math.sin(t * TAU / 4.8) + .015 * Math.sin(t * 2.3);
  const fy = -mix(16, 150, clamp(o.fork ?? 0)), fo = clamp(o.forkOut ?? 1), armOut = clamp(o.armOut ?? (o.reach ? 1 : 0));
  const out = {};
  ctx.fillStyle = 'rgba(60,36,20,.3)'; ctx.beginPath(); ctx.ellipse(4, 1, 62, 7, 0, 0, TAU); ctx.fill();
  for (const wx of [-34, 0, 34]) { ctx.fillStyle = '#4a3420'; ctx.beginPath(); ctx.arc(wx, -6, 6, 0, TAU); ctx.fill(); ctx.fillStyle = PAL.brassLit; ctx.beginPath(); ctx.arc(wx, -6, 1.8, 0, TAU); ctx.fill(); }
  ctx.fillStyle = brassGrad(ctx, -46, 0, 46, 0); ctx.beginPath(); ctx.ellipse(0, -14, 46, 9, 0, 0, Math.PI); ctx.lineTo(-46, -24); ctx.ellipse(0, -24, 46, 9, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAL.brassLit; ctx.beginPath(); ctx.ellipse(0, -24, 46, 9, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = brassGrad(ctx, -46, -30, 46, -18); ctx.beginPath(); ctx.ellipse(0, -24, 42, 7.4, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(PAL.brassDark, .7); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, -24, 30, 5, 0, 0, TAU); ctx.stroke();
  ctx.fillStyle = brassGrad(ctx, -5, 0, 5, 0); ctx.fillRect(-4.5, -204, 9, 182);
  for (const y of [-34, -76, -184]) { ctx.fillStyle = brassGrad(ctx, -8, 0, 8, 0); rr(ctx, -8, y - 3, 16, 6, 3); ctx.fill(); }
  ctx.fillStyle = brassGrad(ctx, -7, -220, 7, -205); ctx.beginPath(); ctx.arc(0, -210, 7, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-2, -216); ctx.lineTo(0, -232); ctx.lineTo(2, -216); ctx.closePath(); ctx.fill();
  const cx = 0, cy = -128, R = 23;
  out.core = [cx, cy]; out.R = R;
  const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 5.2 * br); gl.addColorStop(0, rgba(PAL.core, .4 * core)); gl.addColorStop(1, rgba(PAL.core, 0));
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, R * 5.2 * br, 0, TAU); ctx.fill(); ctx.restore();
  const ph = (o.ringPh ?? t * .35) + (o.seed || 0);   // o.ringPh: the rings' phase (pass an integral when the speed changes)
  const ring = (rx, ry, rot, front) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.strokeStyle = brassGrad(ctx, -rx, 0, rx, 0); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.ellipse(0, 0, rx, Math.max(.5, ry), 0, front ? 0 : Math.PI, front ? Math.PI : TAU); ctx.stroke(); ctx.restore(); };
  const ry1 = (R + 7) * Math.abs(Math.sin(ph)), ry2 = (R + 4) * Math.abs(Math.cos(ph * .8));
  ring(R + 7, ry1, .35, false); ring(R + 4, ry2, Math.PI / 2 - .2, false);
  if (o.coreFill) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip(); o.coreFill(ctx, cx, cy, R); ctx.restore(); }
  else {
    const gg = ctx.createRadialGradient(cx - 6, cy - 7, 1, cx, cy, R); gg.addColorStop(0, mixc(PAL.coreHot, '#8a9aa0', 1 - core)); gg.addColorStop(.55, mixc(PAL.core, '#7d8a8e', 1 - core)); gg.addColorStop(1, mixc(PAL.coreCool, '#56615f', 1 - core));
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba('#8aa6b4', .5); ctx.fillRect(-2.5, cy - R, 5, 2 * R);
    ctx.strokeStyle = rgba(PAL.coreHot, .55 * core); ctx.lineWidth = 1; ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.moveTo(cx - R * .75, cy - 9 + k * 9); ctx.quadraticCurveTo(cx, cy - 13 + k * 9 + 5 * Math.sin(t * 1.1 + k * 2), cx + R * .75, cy - 9 + k * 9); } ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(cx - 8, cy - 9, 5, 2.6, -.6, 0, TAU); ctx.fill();
  }
  ring(R + 7, ry1, .35, true); ring(R + 4, ry2, Math.PI / 2 - .2, true);
  ctx.fillStyle = brassGrad(ctx, 0, fy - 22, 0, fy + 4); rr(ctx, 3, fy - 22, 13, 26, 3); ctx.fill();
  const tl = 88, ta = -Math.PI / 2 * (1 - eio(fo));
  ctx.save(); ctx.translate(15, fy); ctx.rotate(ta);
  ctx.fillStyle = rgba(PAL.brassDark, .9); ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(tl, -2.5); ctx.lineTo(tl + 3, 0); ctx.lineTo(0, 1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = brassGrad(ctx, 0, -4, 0, 3); ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(tl, -.5); ctx.lineTo(tl + 4, 2); ctx.lineTo(0, 3.5); ctx.closePath(); ctx.fill();
  ctx.restore();
  out.fork = [15 + Math.cos(ta) * tl * .6, fy + Math.sin(ta) * tl * .6 - 3];
  if (o.load) o.load(ctx, out.fork[0], out.fork[1]);
  const sx = 7, sy = -98, a = 56, b = 52;
  const fold = o.fold || [sx + 33, sy + 48];
  const tgt = o.reach ? [mix(fold[0], o.reach[0], eio(armOut)), mix(fold[1], o.reach[1], eio(armOut))] : fold;
  const J = K.ik2(sx, sy, a, b, tgt[0], tgt[1], o.bend ?? 1);
  ctx.lineCap = 'round';
  ctx.strokeStyle = PAL.brassDark; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(J.ex, J.ey); ctx.lineTo(J.hx, J.hy); ctx.stroke();
  ctx.strokeStyle = PAL.brass; ctx.lineWidth = 5.2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(J.ex, J.ey); ctx.lineTo(J.hx, J.hy); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,240,200,.55)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(sx, sy - 1.8); ctx.lineTo(J.ex, J.ey - 1.8); ctx.lineTo(J.hx, J.hy - 1.8); ctx.stroke();
  for (const [x, y, r] of [[sx, sy, 6.5], [J.ex, J.ey, 5.5]]) { ctx.fillStyle = brassGrad(ctx, x - r, y - r, x + r, y + r); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  const ang = Math.atan2(J.hy - J.ey, J.hx - J.ex);
  out.hand = [J.hx, J.hy]; out.handAng = ang; out.handO = { a: core * (.5 + .5 * armOut), open: o.open ?? armOut, s: 1.05 };
  if (!o.noHand) K.lightHand(ctx, t, J.hx, J.hy, ang, out.handO);
  return out;
}
// place machine2 at a world point (metres); flip = faces −x. Returns local→screen helpers and the out handle.
export function machineAt(ctx, t, V, p, o = {}) {
  const M = K.sprite(V, p); if (!M.vis) return null;
  const km = M.k / 100, sg = o.flip ? -1 : 1;
  if (o.shadow !== false) safeShadow(ctx, V, p, .6, .3, .26);
  ctx.save(); ctx.translate(M.x, M.y); ctx.scale(sg * km, km);
  const mo = machine2(ctx, t, o);
  ctx.restore();
  const toS = (q) => [M.x + sg * q[0] * km, M.y + q[1] * km], toL = (q) => [sg * (q[0] - M.x) / km, (q[1] - M.y) / km];
  return { ...mo, M, km, sg, toS, toL, coreS: toS(mo.core), coreR: mo.R * km };
}
// the hand of light of a placed machine (draw after the figure it touches)
export function handOf(ctx, t, mm, o = {}) {
  if (!mm) return; const hp = mm.toS(mm.hand);
  K.lightHand(ctx, t, hp[0], hp[1], mm.sg < 0 ? Math.PI - mm.handAng : mm.handAng, { ...mm.handO, ...o, s: (o.s ?? mm.handO.s) * mm.km });
}

// ---------------------------------------------------------------- a rolling blackboard (free-standing, on castors)
export const RB_W = 2.6, RB_H = 1.3, RB_Y0 = .82;
export function rbQuad(c) { const [x, , z] = c, y0 = RB_Y0, y1 = RB_Y0 + RB_H; return [[x - RB_W / 2, y1, z], [x + RB_W / 2, y1, z], [x + RB_W / 2, y0, z], [x - RB_W / 2, y0, z]]; }
// affine frame of a vertical −z-facing plane at its centre (accurate around the centre): local units per metre upm, origin top-left (x0, y1)
function planeFrame(V, x0, y1, z, upm, xc, yc) {
  const o = V.P([xc, yc, z]), ux = V.P([xc + .5, yc, z]), vy = V.P([xc, yc - .5, z]);
  if (!(o.z > .1 && ux.z > .1 && vy.z > .1)) return null;
  const a = (ux.x - o.x) * 2 / upm, b = (ux.y - o.y) * 2 / upm, c = (vy.x - o.x) * 2 / upm, d = (vy.y - o.y) * 2 / upm;
  const lu = (xc - x0) * upm, lv = (y1 - yc) * upm;   // the centre in local units
  return { a, b, c, d, e: o.x - a * lu - c * lv, f: o.y - b * lu - d * lv };
}
export { planeFrame };
// the kit's near-plane bugs (truss struts, lamps, floor sprites, long walls): wrap the view with the lead's Wd.safeView (read-only
// import from f11_c02_world.mjs). keepLamp [x, z]: the one pendant lamp we fly into keeps the raw projection (safeView culls lamps
// nearer than 3 m, which would drop its shade while we approach the globe).
export function safeV(V, keepLamp, keepPts = []) {
  const S = Wd.safeView(V);
  if (!keepLamp && !keepPts.length) return S;
  const raw = (p) => (keepLamp && p[1] === 6.4 && Math.abs(p[0] - keepLamp[0]) < .6 && Math.abs(p[2] - keepLamp[1]) < .6) || keepPts.some((k) => Math.abs(p[0] - k[0]) < .01 && Math.abs(p[2] - k[2]) < .01);
  const P = (p) => (raw(p) ? V.P(p) : S.P(p));
  return { ...S, P };
}
export function hall(ctx, t, V, o) { return K.hall(ctx, t, V, o); }
// K.floorShadow, but skipped when its ellipse would be projected from points at or behind the camera plane (a huge dark disc pops in)
export function safeShadow(ctx, V, p, rx = .35, rz = .25, a = .28, col) {
  const c = V.P([p[0], .002, p[2]]), ex = V.P([p[0] + rx, .002, p[2]]), ez = V.P([p[0], .002, p[2] + rz]);
  if (!(c.z > .4 && ex.z > .4 && ez.z > .4)) return;
  if (Math.abs(ex.x - c.x) > 1500 || Math.abs(ez.y - c.y) > 1500) return;
  if (col) K.floorShadow(ctx, V, p, rx, rz, a, col); else K.floorShadow(ctx, V, p, rx, rz, a);
}
export function rollingBoard(ctx, t, V, c, o = {}) {
  const [x, , z] = c, x0 = x - RB_W / 2, x1 = x + RB_W / 2, y0 = RB_Y0, y1 = RB_Y0 + RB_H, fr = .07;
  safeShadow(ctx, V, [x, 0, z], RB_W * .62, .35, .22);
  // the two A-frame legs (wood) with castors, a cross bar low
  const k = V.P([x, 1, z]).k; if (!(k > 0)) return null;
  for (const lx of [x0 - .02, x1 + .02]) {
    ctx.strokeStyle = '#7a5236'; ctx.lineWidth = Math.max(1.5, k * .06); ctx.lineCap = 'round'; ctx.beginPath();
    V.seg(ctx, [lx, .1, z - .32], [lx, y1 + fr + .06, z]); V.seg(ctx, [lx, .1, z + .32], [lx, y1 + fr + .06, z]); ctx.stroke();
    ctx.strokeStyle = '#8a6040'; ctx.lineWidth = Math.max(1, k * .05); ctx.beginPath(); V.seg(ctx, [lx, .1, z - .34], [lx, .1, z + .34]); ctx.stroke();
    for (const dz of [-.32, .32]) { const w = V.P([lx, .05, z + dz]); if (w.z > .1) { ctx.fillStyle = '#3e2c1c'; ctx.beginPath(); ctx.arc(w.x, w.y, Math.max(1.5, w.k * .05), 0, TAU); ctx.fill(); ctx.fillStyle = PAL.brassLit; ctx.beginPath(); ctx.arc(w.x, w.y, Math.max(.6, w.k * .015), 0, TAU); ctx.fill(); } }
  }
  ctx.strokeStyle = '#7a5236'; ctx.lineWidth = Math.max(1, k * .045); ctx.beginPath(); V.seg(ctx, [x0, .4, z], [x1, .4, z]); ctx.stroke();
  // frame + slate
  if (V.poly(ctx, [[x0 - fr, y1 + fr, z + .01], [x1 + fr, y1 + fr, z + .01], [x1 + fr, y0 - fr, z + .01], [x0 - fr, y0 - fr, z + .01]])) { ctx.fillStyle = PAL.frame; ctx.fill(); }
  const q = [[x0, y1, z], [x1, y1, z], [x1, y0, z], [x0, y0, z]];
  const S = V.poly(ctx, q); if (!S) return null;
  let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9; for (const s of S) { bx0 = Math.min(bx0, s.x); bx1 = Math.max(bx1, s.x); by0 = Math.min(by0, s.y); by1 = Math.max(by1, s.y); }
  const g = ctx.createLinearGradient(bx0, by0, bx1, by1); g.addColorStop(0, '#3c4a43'); g.addColorStop(.6, PAL.slate); g.addColorStop(1, PAL.slateDark); ctx.fillStyle = g; ctx.fill();
  const F = planeFrame(V, x0, y1, z, 100, x, (y0 + y1) / 2);
  if (F) {
    ctx.save(); V.poly(ctx, q); ctx.clip(); ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f);
    const r = prng(o.seed || 33); ctx.strokeStyle = rgba(PAL.chalk, .05); ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) { const xx = r() * 260, yy = r() * 130, L = 30 + r() * 90; ctx.lineWidth = 6 + r() * 14; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.quadraticCurveTo(xx + L * .5, yy + (r() - .5) * 20, xx + L, yy + (r() - .5) * 14); ctx.stroke(); }
    if (o.content) o.content(ctx, { w: 260, h: 130 }, t);
    ctx.restore();
  }
  // chalk tray
  if (V.poly(ctx, [[x0, y0 - .03, z - .01], [x1, y0 - .03, z - .01], [x1, y0 - .03, z - .12], [x0, y0 - .03, z - .12]])) { ctx.fillStyle = '#a57650'; ctx.fill(); }
  if (V.poly(ctx, [[x0, y0 - .03, z - .12], [x1, y0 - .03, z - .12], [x1, y0 - .08, z - .12], [x0, y0 - .08, z - .12]])) { ctx.fillStyle = '#7a5236'; ctx.fill(); }
  const ch = V.P([x0 + .4, y0 - .01, z - .07]); if (ch.z > .1) { ctx.fillStyle = PAL.chalk; ctx.fillRect(ch.x, ch.y - ch.k * .015, ch.k * .09, Math.max(1, ch.k * .015)); }
  return S;
}

// ---------------------------------------------------------------- a wooden box on the floor (plyo step, crate)
export function box3(ctx, V, x0, x1, z0, z1, h, o = {}) {
  if (h <= .002) return null;
  const y0 = o.y0 || 0, y1 = y0 + h, cam = V.cam, top = o.top || '#d9a970', front = o.front || '#b98250', side = o.side || '#a06e42';
  if (!o.noShadow && y0 < .01) safeShadow(ctx, V, [(x0 + x1) / 2, 0, (z0 + z1) / 2], (x1 - x0) * .7, (z1 - z0) * .6, .26);
  const k = V.P([(x0 + x1) / 2, y1, (z0 + z1) / 2]).k || 1;
  const face = (pts, col, lines) => {
    const S = V.poly(ctx, pts); if (!S) return null; ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = rgba('#5a3a22', .5); ctx.lineWidth = Math.max(.8, k * .008); ctx.stroke();
    return S;
  };
  // side faces facing the camera
  if (cam.x < x0) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], side);
  if (cam.x > x1) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], side);
  if (cam.z > z1) face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], side);
  let FS = null;
  if (cam.z < z0) FS = face([[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]], front);
  if (cam.y > y1) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], top);
  // slats / plank lines on the front face, a light top edge
  if (FS && o.slats) {
    ctx.strokeStyle = rgba('#5a3a22', .45); ctx.lineWidth = Math.max(.8, k * .01); ctx.beginPath();
    for (let i = 1; i < o.slats; i++) { const y = y0 + h * i / o.slats; V.seg(ctx, [x0, y, z0 - .002], [x1, y, z0 - .002]); }
    ctx.stroke();
  }
  if (FS && o.hand) {   // a hand hole (plyo box)
    const cx = (x0 + x1) / 2, cy = y0 + h * .78, w = Math.min(.12, (x1 - x0) * .25), hh = Math.min(.035, h * .12);
    if (V.poly(ctx, [[cx - w, cy + hh, z0 - .002], [cx + w, cy + hh, z0 - .002], [cx + w, cy - hh, z0 - .002], [cx - w, cy - hh, z0 - .002]])) { ctx.fillStyle = rgba('#3a2414', .55); ctx.fill(); }
  }
  ctx.strokeStyle = rgba('#ffe7c0', .55); ctx.lineWidth = Math.max(.8, k * .01); ctx.beginPath(); V.seg(ctx, [x0, y1, z0], [x1, y1, z0]); ctx.stroke();
  if (FS && o.label) {
    const upm = 100, F = planeFrame(V, x0, y1, z0 - .003, upm, (x0 + x1) / 2, (y0 + y1) / 2);
    if (F) { ctx.save(); V.poly(ctx, [[x0, y1, z0 - .003], [x1, y1, z0 - .003], [x1, y0, z0 - .003], [x0, y0, z0 - .003]]); ctx.clip(); ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f); o.label(ctx, (x1 - x0) * 100, h * 100); ctx.restore(); }
  }
  return FS;
}

// ---------------------------------------------------------------- a brass guardrail along a floor polyline
export function rail(ctx, V, pts, u, o = {}) {
  if (u <= 0) return;
  const H = o.h ?? .95, posts = [];
  let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
  const step = o.step ?? 1.2;
  for (let i = 0; i < seg.length; i++) { const n = Math.max(1, Math.round(seg[i] / step)); for (let k = 0; k < n; k++) { const q = k / n; posts.push([mix(pts[i][0], pts[i + 1][0], q), mix(pts[i][1], pts[i + 1][1], q), (seg.slice(0, i).reduce((s, v) => s + v, 0) + seg[i] * q) / L]); } }
  posts.push([pts[pts.length - 1][0], pts[pts.length - 1][1], 1]);
  // posts rise in a wave along the line (first half of u), the rail runs along (second half)
  const up = clamp(u / .55), run = clamp((u - .45) / .55);
  const drawPost = (x, z, hh) => {
    const a = V.P([x, 0, z]), b = V.P([x, hh, z]); if (!(a.z > .2 && b.z > .2)) return;
    const w = Math.max(1.2, a.k * .035);
    ctx.lineCap = 'round'; ctx.strokeStyle = PAL.brassDark; ctx.lineWidth = w * 1.3; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.strokeStyle = PAL.brass; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.strokeStyle = rgba(PAL.brassLit, .8); ctx.lineWidth = Math.max(.6, w * .3); ctx.beginPath(); ctx.moveTo(a.x - w * .2, a.y); ctx.lineTo(b.x - w * .2, b.y); ctx.stroke();
    ctx.fillStyle = PAL.brassLit; ctx.beginPath(); ctx.arc(b.x, b.y, w * .9, 0, TAU); ctx.fill();
    ctx.fillStyle = PAL.brassDark; ctx.beginPath(); ctx.ellipse(a.x, a.y, w * 1.6, w * .5, 0, 0, TAU); ctx.fill();
  };
  // rail first (behind the post tops), then posts, far to near
  if (run > 0) {
    let rem = L * eio(run); const P = [[pts[0][0], H, pts[0][1]]];
    for (let i = 1; i < pts.length && rem > 1e-6; i++) { const q = Math.min(1, rem / seg[i - 1]); P.push([mix(pts[i - 1][0], pts[i][0], q), H, mix(pts[i - 1][1], pts[i][1], q)]); rem -= seg[i - 1]; }
    // piecewise (each piece its own width: the rail is thick near the camera, thin far away)
    const pieces = [];
    for (let i = 0; i + 1 < P.length; i++) { const n = Math.max(1, Math.ceil(Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][2] - P[i][2]) / .4)); for (let k = 0; k < n; k++) pieces.push([P[i].map((v, j) => mix(v, P[i + 1][j], k / n)), P[i].map((v, j) => mix(v, P[i + 1][j], (k + 1) / n))]); }
    ctx.lineCap = 'round';
    for (const [hh, ws] of [[H, [[.05, PAL.brassDark], [.035, PAL.brass], [.01, PAL.brassLit]]], [H * .5, [[.022, PAL.brass]]]]) for (const [w, c] of ws) {
      ctx.strokeStyle = c;
      for (const [a, b] of pieces) { const m = V.P([(a[0] + b[0]) / 2, hh, (a[2] + b[2]) / 2]); if (!(m.z > .2)) continue; ctx.lineWidth = Math.max(1, m.k * w); ctx.beginPath(); if (V.seg(ctx, [a[0], hh, a[2]], [b[0], hh, b[2]])) ctx.stroke(); }
    }
  }
  const list = posts.map((p) => ({ p, d: V.toCam([p[0], 0, p[1]])[2] })).sort((a, b) => b.d - a.d);
  for (const { p } of list) { const hh = H * eout(clamp((up * 1.3 - p[2] * .3) / 1)); if (hh > .01) drawPost(p[0], p[1], Math.min(H, hh)); }
}

// ---------------------------------------------------------------- a pinned paper card on a vertical plane facing −z
// q = { x0, x1, y0, y1, z }; o.fill(ctx) draws the paper in screen space (clipped), o.text(ctx, w, h) in card cm; o.u unrolls from the top.
export function cardOn(ctx, t, V, q, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const yb = mix(q.y1, q.y0, eout(u)), z = q.z - (o.dz ?? .012);
  // shadow on the board
  if (V.poly(ctx, [[q.x0 + .03, q.y1 - .03, z + .006], [q.x1 + .04, q.y1 - .03, z + .006], [q.x1 + .04, yb - .04, z + .006], [q.x0 + .03, yb - .04, z + .006]])) { ctx.fillStyle = rgba('#1a120c', .25); ctx.fill(); }
  const pts = [[q.x0, q.y1, z], [q.x1, q.y1, z], [q.x1, yb, z], [q.x0, yb, z]];
  const S = V.poly(ctx, pts); if (!S) return null;
  ctx.save(); ctx.clip();
  if (o.fill) o.fill(ctx, S); else { ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H); }
  const F = planeFrame(V, q.x0, q.y1, z, 100, (q.x0 + q.x1) / 2, (q.y0 + q.y1) / 2);
  if (F && o.text) { ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f); o.text(ctx, (q.x1 - q.x0) * 100, (q.y1 - q.y0) * 100); }
  ctx.restore();
  // the rolled edge while unrolling, pins at the top
  if (u < 1) { const a = V.P([q.x0, yb, z - .01]), b = V.P([q.x1, yb, z - .01]); if (a.z > .1) { ctx.strokeStyle = '#e8dcc0'; ctx.lineWidth = Math.max(2, a.k * .035); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
  for (const px of [q.x0 + .07, q.x1 - .07]) { const p = V.P([px, q.y1 - .06, z - .01]); if (p.z > .1) { ctx.fillStyle = '#b23a2a'; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.5, p.k * .016), 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(p.x - p.k * .005, p.y - p.k * .005, Math.max(.5, p.k * .005), 0, TAU); ctx.fill(); } }
  return S;
}
// quote text helper (Instrument Serif, wrapped lines given) + source line (Inter caps)
export function quoteText(ctx, w, h, lines, src, o = {}) {
  const size = o.size ?? 11, x = o.x ?? 10, y0 = o.y ?? 18;
  ctx.fillStyle = PAL.ink; ctx.font = `${o.italic === false ? '' : 'italic '}${size}px "Instrument Serif"`; ctx.textBaseline = 'alphabetic';
  lines.forEach((s, i) => ctx.fillText(s, x, y0 + i * size * 1.18));
  if (src) { ctx.font = `600 ${size * .34}px Inter`; ctx.fillStyle = PAL.inkSoft; let xx = x; const sp = size * .07; for (const ch of src) { ctx.fillText(ch, xx, y0 + lines.length * size * 1.18 + size * .2); xx += ctx.measureText(ch).width + sp; } }
}

// ---------------------------------------------------------------- a lectern with an open papyrus scroll
// p = floor point (metres); the slanted top faces −z (toward the camera side), 0.75 × 0.5 m, front edge at 1.0 m, back edge at 1.25 m.
export function lectern(ctx, t, V, p, o = {}) {
  const [x, , z] = p, hw = .38, d = .25, yf = 1.02, yb = 1.26;
  safeShadow(ctx, V, p, .45, .3, .25);
  const k = V.P([x, .6, z]).k; if (!(k > 0)) return null;
  // foot + post
  if (V.poly(ctx, [[x - .3, .04, z - .22], [x + .3, .04, z - .22], [x + .3, .04, z + .22], [x - .3, .04, z + .22]])) { ctx.fillStyle = '#7a5236'; ctx.fill(); }
  if (V.poly(ctx, [[x - .3, 0, z - .22], [x + .3, 0, z - .22], [x + .3, .04, z - .22], [x - .3, .04, z - .22]])) { ctx.fillStyle = '#6a4630'; ctx.fill(); }
  if (V.poly(ctx, [[x - .07, .04, z - .05], [x + .07, .04, z - .05], [x + .07, yf - .02, z - .05], [x - .07, yf - .02, z - .05]])) { const g = ctx.createLinearGradient(V.P([x - .07, .5, z]).x, 0, V.P([x + .07, .5, z]).x, 0); g.addColorStop(0, '#9a6a44'); g.addColorStop(1, '#6e4a30'); ctx.fillStyle = g; ctx.fill(); }
  // the slanted top (a board) with a lip
  const top = [[x - hw, yb, z + d], [x + hw, yb, z + d], [x + hw, yf, z - d], [x - hw, yf, z - d]];
  if (V.poly(ctx, [[x - hw, yf - .04, z - d], [x + hw, yf - .04, z - d], [x + hw, yf, z - d], [x - hw, yf, z - d]])) { ctx.fillStyle = '#6e4a30'; ctx.fill(); }
  if (V.poly(ctx, top)) { ctx.fillStyle = '#a87448'; ctx.fill(); }
  // the papyrus: a sheet on the top with a roll at each side
  const pu = (a, b) => [x + a, mix(yf, yb, b) + .006, mix(z - d, z + d, b)];   // a: metres across, b: 0 front … 1 back
  const sheet = [pu(-.3, .92), pu(.3, .92), pu(.3, .12), pu(-.3, .12)];
  const S = V.poly(ctx, sheet);
  if (S) { ctx.save(); ctx.clip(); if (o.fill) o.fill(ctx, S); else { ctx.fillStyle = '#e8d6aa'; ctx.fillRect(0, 0, W, H); } ctx.restore(); }
  for (const a of [-.31, .31]) {
    const A = V.P(pu(a, .06)), B = V.P(pu(a, .98)); if (!(A.z > .1)) continue;
    ctx.lineCap = 'round'; ctx.strokeStyle = '#b8955c'; ctx.lineWidth = Math.max(2, A.k * .05); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    ctx.strokeStyle = '#e2c890'; ctx.lineWidth = Math.max(1, A.k * .025); ctx.beginPath(); ctx.moveTo(A.x - 1, A.y - 1); ctx.lineTo(B.x - 1, B.y - 1); ctx.stroke();
    ctx.fillStyle = '#5a3a22'; for (const P of [A, B]) { ctx.beginPath(); ctx.arc(P.x, P.y, Math.max(1, A.k * .02), 0, TAU); ctx.fill(); }
  }
  return { sheet, S, pu };
}

// ---------------------------------------------------------------- lamps (the pendant globes of hall(): same formula)
export function lampGlobe(V, x, z) { const bot = V.P([x, 6.4, z]); if (!(bot.z > .2)) return null; const r = Math.max(2, bot.k * .26); return { x: bot.x, y: bot.y + r * .3, r, z: bot.z, k: bot.k }; }

// ---------------------------------------------------------------- people
export const DOC_DRESS = (v) => ({ coat: '#eef0ea', pants: ['#3a4256', '#4a3a30'][v % 2], shoes: '#2a221c', skin: PAL.skin[(v * 2 + 1) % PAL.skin.length], hair: ['#3a2a20', '#8a7a6a'][v % 2] });
export const TEACH_DRESS = (v) => ({ coat: ['#7a5a3a', '#5d6f5a', '#8a5560'][v % 3], pants: '#3a3430', shoes: '#2a221c', skin: PAL.skin[(v * 3 + 2) % PAL.skin.length], hair: ['#2a1a14', '#6a4a30', '#1c1420'][v % 3] });
// seated, leaning back, arms folded (the doctors who let the machine look)
export const LEANBACK = { hip: [1.42, 1.5], kn: [1.3, 1.4], sh: [.42, .3], el: [1.75, 1.7], lean: -.14, head: -.06, hands: ['relaxed', 'relaxed'] };
// seated, leaning in over the desk (asking why)
export const LEANIN = { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [.95, .7], el: [.9, 1.1], lean: .3, head: .22, hands: ['open', 'relaxed'] };
// figure at a world point: hip from sprite (standing: 88 units, seated: 46)
// a figure at a world point (hip from the sprite: standing 88 units, seated 46). null when it cannot be seen (off screen or under the
// camera): figures render offscreen at their screen size, so a huge one out of view costs hundreds of ms (and memory) for nothing.
export function personAt(V, p, seated) {
  const S = K.sprite(V, p); if (!S.vis || S.z < .45) return null;
  const hipY = S.y - (seated ? 46 : 88) * S.s, m = 95 * S.s;
  if (S.x + m < 0 || S.x - m > W || hipY - 120 * S.s > H || S.y + 10 * S.s < 0) return null;
  return { ...S, hipY };
}
// node --expose-gc: the canvas leak (drawImage of offscreen canvases) is freed only by a full GC; collect every n frames
let _gcN = 0;
export function gcTick(n = 12) { if (global.gc && ++_gcN % n === 0) global.gc(); }

// group B's small brass plate beside its desk machine: HINTS, NOT ANSWERS (c05 flips it up: u 0…1; it stays up afterwards)
export function nameplate(ctx, V, d, u) {
  if (u <= 0) return;
  const Sp = K.sprite(V, [d.x + .72, .74, d.z + .3]); if (!Sp.vis || Sp.z < .3) return;
  ctx.save(); ctx.translate(Sp.x, Sp.y); ctx.scale(Sp.k / 100, Sp.k / 100);
  const h = 6.2 * Math.sin(u * Math.PI / 2), x0 = 9, w = 23;
  ctx.fillStyle = 'rgba(60,36,20,.3)'; ctx.fillRect(x0 + .5, -.6, w, 1.2);
  ctx.fillStyle = brassGrad(ctx, x0, -h, x0 + w, 0); ctx.fillRect(x0, -h, w, h);
  ctx.fillStyle = PAL.brassLit; ctx.fillRect(x0, -h, w, .5);
  if (u > .6) {
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -h, w, h); ctx.clip(); ctx.translate(0, -h); ctx.scale(1, h / 6.2);
    ctx.fillStyle = '#3a2614'; ctx.font = '600 1.9px Inter'; ctx.textAlign = 'center';
    ctx.fillText('H I N T S ,', x0 + w / 2, 2.6); ctx.fillText('N O T   A N S W E R S', x0 + w / 2, 5.1);
    ctx.restore();
  }
  ctx.restore();
}
// the guardrail round group B (c05 raises it; it stays)
export const RAIL_B = [[4.42, 13.95], [4.42, 25.45], [-.15, 25.45], [-.15, 13.95], [4.42, 13.95]];
