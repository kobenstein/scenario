// c13 (Film 4 v2) · TAKE 3 · THE VALLEY (out of the river's ink at the pivot ~385.45 → the dusk sky = plate c13>c14 by 411.50). Owner: c13.
// One valley, one continuous camera, every beat anchored to VO words (K, see the plan table in scenes/sc13.mjs):
//   S1 the river below the town, the rope swing hangs empty on the near bank; three slow summers dull the water and choke it with reeds;
//      on "paid" the old swimming sign sinks into the silt, the empty swing turns in the wind; the summer's last sun goes down.
//   S2 crane up and pan down the road while the morning light comes up over the valley (dusk → blue night → dawn, continuous colour).
//   S3 push to the town hall: she speaks from its steps to a small crowd (seen from behind), her poster a faceless silhouette;
//      the bell swings on "time".   S4 truck right to the barn: on "opens" he hangs the painted paw sign on its hook (it swings),
//      walks to the dog, kneels; the tail wags harder on "wanted"; a donkey over the fence, a three-legged cat on the end post.
//   S5 crane down to the river: you in the rowing boat lift the net with the rubbish on "river", lay it down, row two strokes;
//      the sun's one slow arc over you; on "help" the sensors along the far bank turn from cyan to amber, the water clears (years).
//   S6 pan to the swing (the S1 framing): a kid mid-swing lets go, tucks, and drops into clear water: the splash on "reason";
//      the droplets fly up, the camera tilts with them into the dusk sky, which is the c13>c14 plate at full strength by H.a - 1/30.
//   valleyTake(ctx, t, K)   warmValley(K)
import { W, H, rgba, clamp, mix, prng } from '../engine.mjs';
import { pin, polyPath, mixHex, hex2rgb, smo, smr, eoX, mono, projPoly, projLine, plane3, hatchPoly, skyPlateAt, TAU } from './v2_c13_kit.mjs';
import { figure, figureKid, figureBack, reachArm, walk } from './figure.mjs';
import { scribble } from './paper.mjs';
import { pivotCol } from './v2_c13_kitchen.mjs';

const DEG = Math.PI / 180, FU = 1.75 / 185, INK = 'rgba(10,8,22,.55)';
const id = (ctx) => ctx.setTransform(1, 0, 0, 1, 0, 0);
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const cio = (x) => { x = clamp(x); return x < .5 ? 4 * x ** 3 : 1 - Math.pow(-2 * x + 2, 3) / 2; };

// ---------------------------------------------------------------- the valley (metres: +x downstream, +z across the river to the town, +y up)
const zr = (x) => 9 + .8 * Math.sin(x * .05 + .3), HW = 4.5, zN = (x) => zr(x) - HW, zF = (x) => zr(x) + HW, TER = 4;
const bumpS = (x, a, b) => (x <= a || x >= b ? 0 : Math.sin(Math.PI * (x - a) / (b - a)) ** 2);
const lipH = (x) => .8 + .9 * bumpS(x, 20, 29.5);                    // the near bank's lip (high at the swing tree's roots)
function gN(x, z) { const d = zN(x) - z; if (d <= 0) return 0; if (d < 1) return lipH(x) * d; if (d < 8) return lipH(x) + .3 * (d - 1) / 7; return lipH(x) + .3 + (2.4 - lipH(x) - .3) * clamp((d - 8) / (zN(x) + 45 - 8)); }
function gF(x, z) { const e = zF(x), d = z - e; if (d <= 0) return 0; if (d < 3.2) return 1.1 * d / 3.2; if (z < 27) return 1.1 + (TER - 1.1) * (d - 3.2) / (27 - e - 3.2); return TER + .4 * clamp((z - 27) / 19); }
const SWP = [24, 5.3, 7.4], ROPE = 4, OM = Math.sqrt(9.81 / ROPE), A0 = 40 * DEG, TH_R = 30 * DEG;   // the rope swing
const seatAt = (th) => [SWP[0], SWP[1] - ROPE * Math.cos(th), SWP[2] + ROPE * Math.sin(th)];

// ---------------------------------------------------------------- timing (all from VO words) and the camera
function vt(K) {
  const V = { K, piv: K.piv, up1: K.river1 + .4, s1e: K.saveE - .3, sum0: K.river1 - .06, sum1: K.saveE - .2, sign: K.paid, saveE: K.saveE,
    dawn0: K.nobody2 - .34, dawn1: K.beE + .4, s2: K.beE, s3: K.council + .1, s3e: K.time1E, bell: K.time1E - .35, s4: K.shelter + .02, hook: K.opens,
    kneel: K.animals - .3, wag: K.wanted, s4e: K.and1 - .1, s5m: K.start + .13, s5: K.river2 + .14, net: K.river2 - .2, row0: K.time2 - .3,
    yrs0: K.time2E + .04, yrs1: K.help2E + .1, s5e: K.help2E - .38, s6: K.best - .38, splash: K.reason, tilt0: K.reason + .12, tilt1: K.HO.a - .13, sun1: K.reason + .07 };
  // the jump: released at 30° on the way out, the feet meet the water exactly on "reason"
  const thd = A0 * OM * Math.sqrt(1 - (TH_R / A0) ** 2), v = [0, ROPE * thd * Math.sin(TH_R), ROPE * thd * Math.cos(TH_R)], s0 = seatAt(TH_R), h0 = [s0[0], s0[1] + .06, s0[2]];
  const tau = (v[1] + Math.sqrt(v[1] * v[1] + 4 * 4.905 * (h0[1] - .32))) / (2 * 4.905);
  V.sw = { v, h0, tau, rel: V.splash - tau, spl: [h0[0], 0, h0[2] + v[2] * tau] };
  V.sw.t0 = V.sw.rel - Math.asin(TH_R / A0) / OM; V.sw.launch = V.sw.t0 - Math.PI / 2 / OM;
  V.pk = [[K.piv - .05, 'summer'], [K.paid - .06, 'summer'], [K.saveE + .03, 'dusk'], [K.now2 + .05, 'night'], [K.nobody2 + .16, 'dawn'], [K.beE + .3, 'morning'],
    [K.and1 + .5, 'morning'], [K.time2 + .26, 'noon'], [K.best + .02, 'dusk'], [K.HO.a + 2, 'dusk']];
  const CK = [[V.piv, [12, 1.2, 7], 90, -89.99, 1250], [V.up1, [13.35, 2.2, -.06], [24, 2.6, 8.6], 1250], [V.s1e, [14.5, 2.2, .8], [24, 2.6, 8.6], 1250],
    [V.s2, [7, 11, -7], [2, 6, 34], 1250], [V.s3, [1, 5.6, 18.5], [1, 8.6, 34], 1250], [V.s3e, [1.3, 5.5, 19.4], [1.3, 8.5, 34], 1250],
    [V.s4, [16.6, 5.4, 21.5], [16.9, 5.2, 31], 1250], [V.s4e, [16.9, 5.3, 21.1], [17.2, 5.1, 31], 1250], [V.s5m, [17.4, 4.4, 12.5], [17.8, 3.0, 25], 1160],
    [V.s5, [16.2, 1.6, 3.4], [15.4, 1.04, 14], 1100], [V.s5e, [16.4, 1.6, 3.5], [15.6, 1.04, 14], 1100], [V.s6, [13.35, 2.2, -.06], [24, 2.6, 8.6], 1500],
    [V.tilt0, [13.3, 2.2, -.1], [24, 2.6, 8.6], 1500], [V.tilt1, [13.0, 6.2, -.4], 46, 62, 1250]]
    .map((k) => { if (Array.isArray(k[2])) { const p = k[1], q = k[2], dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return [k[0], p, Math.atan2(dx, dz) / DEG, Math.atan2(dy, Math.hypot(dx, dz)) / DEG, k[3]]; } return k; });
  const ch = (f) => mono(CK.map((k) => [k[0], f(k)]));
  V.cam = { x: ch((k) => k[1][0]), y: ch((k) => k[1][1]), z: ch((k) => k[1][2]), yaw: ch((k) => k[2]), pitch: ch((k) => k[3]), f: ch((k) => k[4]) };
  return V;
}
let _V = null;
const vOf = (K) => (_V && _V.K === K ? _V : (_V = vt(K)));
export function valleyCam(t, K) { const C = vOf(K).cam; return { x: C.x(t), y: C.y(t), z: C.z(t), yaw: C.yaw(t) * DEG, pitch: C.pitch(t) * DEG, f: C.f(t), zmin: .02 }; }

// ---------------------------------------------------------------- light: palettes by time (smooth between keys), the sun, the river's health
const PALS = {
  summer: { sky: ['#efd2a6', '#c8b8a8', '#7a88b8', '#3e4c8e', '#1c2860'], amb: '#7a7cae', sun: '#ffdcaa', k: .9 },
  dusk: { sky: ['#f2ac78', '#e2928a', '#c77a8a', '#3b2f6e', '#0b0f2a'], amb: '#5c4c80', sun: '#ffa868', k: .5 },
  night: { sky: ['#3a3466', '#2a2a5a', '#1a1e48', '#121638', '#0a0e28'], amb: '#3c3c70', sun: '#ffa868', k: 0 },
  dawn: { sky: ['#f2a874', '#b07a8a', '#4a4a86', '#262a66', '#121842'], amb: '#5a5488', sun: '#ffb070', k: .55 },
  morning: { sky: ['#f2d6ac', '#c8bcb4', '#7a8cbc', '#44549a', '#202c66'], amb: '#7678a8', sun: '#ffd8a8', k: .85 },
  noon: { sky: ['#e6dcc4', '#b8c0cc', '#7c90c4', '#4a5ca4', '#26346e'], amb: '#8a8eb6', sun: '#fff0d8', k: 1 },
};
function sunAt(t, V) {   // the key light (deg); visible as a disc only where it is in front (S5's arc, S6's sunset)
  if (t < V.dawn0) return { az: -150, el: mix(14, 9, smr(V.sum0, V.sign, t)) - 15 * smr(V.sign - .05, V.saveE + .2, t) };
  if (t < V.s4e) return { az: -150, el: -6 + 11 * smr(V.dawn0, V.dawn1, t) + 2 * smr(V.dawn1, V.s4e, t) };
  if (t < V.s5) { const u = smr(V.s4e, V.s5, t); return { az: mix(-150, -38, u), el: mix(7, 3, u) }; }
  const s = clamp((t - V.s5) / (V.sun1 - V.s5));
  return { az: mix(-38, 40, s), el: 3 * (1 - s) + 18 * Math.sin(Math.PI * s) - 4.5 * s - 1.5 * smr(V.sun1, V.tilt1, t) };
}
function lightAt(t, V) {
  const P = V.pk; let i = 0; while (i < P.length - 2 && t >= P[i + 1][0]) i++;
  const u = smo((t - P[i][0]) / (P[i + 1][0] - P[i][0])), A = PALS[P[i][1]], B = PALS[P[i + 1][1]];
  const sky = A.sky.map((c, j) => mixHex(c, B.sky[j], u));
  let amb = mixHex(A.amb, B.amb, u), sun = mixHex(A.sun, B.sun, u), k = mix(A.k, B.k, u);
  // three slow summers: the warm haze swells and ebbs three times (≈ 2 s each), a breath of light, never a flash
  const sw = t > V.sum0 && t < V.sum1 ? (1 - Math.cos(TAU * 3 * (t - V.sum0) / (V.sum1 - V.sum0))) / 2 : 0;
  if (sw > 0) { sky[0] = mixHex(sky[0], '#ffc88a', .3 * sw); sky[1] = mixHex(sky[1], '#f0b494', .22 * sw); sun = mixHex(sun, '#ffc070', .3 * sw); amb = mixHex(amb, '#8a7aa0', .2 * sw); k += .08 * sw; }
  const s = sunAt(t, V), el = s.el * DEG, az = s.az * DEG;
  return { sky, amb, sun, k: k * smr(-3, 6, s.el), el: s.el, az: s.az, dir: [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)], glow: smr(-5.5, 2, s.el),
    dull: smr(V.sum0 + .4, V.sum1 - .2, t) * (1 - smr(V.yrs0, V.yrs1, t)), reed: smr(V.sum0 + .3, V.sum1, t) * (1 - smr(V.yrs0 + .1, V.yrs1, t)) };
}
let LA = [122, 124, 174], LS = [255, 220, 170], LK = 1, FOG = [200, 184, 168], DIR = [0, 1, 0];
const rgbS = (a, al = 1) => (al >= 1 ? `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})` : `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${Math.max(0, al).toFixed(3)})`);
const shA = (hex, k) => { const b = hex2rgb(hex), u = clamp(k) * LK; return [0, 1, 2].map((i) => Math.min(255, b[i] * mix(LA[i], LS[i], u) / 255)); };
const fogA = (a, f) => (f > 0 ? a.map((v, i) => mix(v, FOG[i], clamp(f))) : a);
const col = (hex, k, f = 0, al = 1) => rgbS(fogA(shA(hex, k), f), al);
const kN = (n) => clamp(.12 + 1.15 * (n[0] * DIR[0] + n[1] * DIR[1] + n[2] * DIR[2]));
const fogD = (d) => clamp((d - 30) / 260) * .78;
function fc(ctx, P, pts, n, c, fg, hat, ink = true) {   // a lit face: fill by its normal, hatch when in shade, ink edge
  const s = projPoly(P, pts, .3); if (s.length < 3) return s;
  polyPath(ctx, s); const k = kN(n); ctx.fillStyle = col(c, k, fg); ctx.fill();
  if (hat && k < .55) hatchPoly(ctx, s, 1.1, 5, `rgba(10,8,24,${(.1 + .16 * (1 - k)).toFixed(3)})`);
  if (ink) { polyPath(ctx, s); ctx.lineWidth = 1; ctx.strokeStyle = INK; ctx.stroke(); }
  return s;
}

// ---------------------------------------------------------------- sky, hills, land
function sky(ctx, P, F) {
  const { cam, L, t, V } = F, f = cam.f, p = cam.pitch, yE = (e) => H / 2 - f * Math.tan(clamp(e * DEG - p, -1.53, 1.53)), y0 = yE(90), y1 = yE(-4);
  if (y1 - y0 > 2) { const g = ctx.createLinearGradient(0, y0, 0, y1); let o = 0;
    for (const [e, j] of [[90, 4], [85.37, 4], [56.08, 3], [38.63, 2], [10, 1], [0, 0], [-4, 0]]) { o = Math.max(o, clamp((yE(e) - y0) / (y1 - y0))); g.addColorStop(o, L.sky[j]); }
    ctx.fillStyle = g; } else ctx.fillStyle = L.sky[0];
  ctx.fillRect(0, 0, W, H);
  const sa = smr(V.tilt0 + .45, V.tilt1 - .1, t);   // the plate's own stars, slid by the tilt (exact at its end)
  if (sa > 0) skyPlateAt(ctx, t, { dy: -f * (62 * DEG - p), stars: sa, noGrad: true });
  if (L.glow > 0) { const s = P(cam.x + DIR[0] * 4000, cam.y + DIR[1] * 4000, cam.z + DIR[2] * 4000);
    if (s[2] > 1) { const R = 620, c = hex2rgb(L.sun), g = ctx.createRadialGradient(s[0], s[1], 0, s[0], s[1], R);
      g.addColorStop(0, rgbS(c, .5 * L.glow)); g.addColorStop(.2, rgbS(c, .2 * L.glow)); g.addColorStop(1, rgbS(c, 0)); ctx.fillStyle = g; ctx.fillRect(s[0] - R, s[1] - R, 2 * R, 2 * R);
      if (L.el > -2.5) { ctx.fillStyle = '#fff3d6'; ctx.beginPath(); ctx.arc(s[0], s[1], 20, 0, TAU); ctx.fill(); ctx.strokeStyle = rgbS(c, .75); ctx.lineWidth = 3; ctx.stroke(); } } }
}
const RID = [[-175, 16, 24, 7, '#2c3060', .72], [178, 20, 28, 3, '#282c5c', .68], [-108, 7, 13, 5, '#323a64', .48], [118, 9, 15, 1, '#2e3662', .48]];
const ridgeY = (x, r) => r[1] + r[2] * (.55 * Math.sin(x * .021 + r[3]) + .3 * Math.sin(x * .047 + r[3] * 2.1) + .15 * Math.sin(x * .11 + r[3] * 3.3));
function hills(ctx, P, F) {
  for (const r of RID) {
    const pts = []; for (let x = -340; x <= 440; x += 8) pts.push([x, ridgeY(x, r), r[0]]);
    const s = projPoly(P, [...pts, [440, -30, r[0]], [-340, -30, r[0]]], .5); if (s.length < 3) continue;
    polyPath(ctx, s); ctx.fillStyle = col(r[4], .45, r[5]); ctx.fill(); hatchPoly(ctx, s, -1.05, 7, 'rgba(8,6,30,.12)');
    if (F.L.glow > .02) { ctx.strokeStyle = rgba(F.L.sun, .3 * F.L.glow); ctx.lineWidth = 1.3; ctx.beginPath(); projLine(ctx, P, pts, .5); ctx.stroke(); }
  }
}
const XS = []; for (let x = -280; x <= 340; x += 5) XS.push(x);
const lineAt = (fy, fz) => XS.map((x) => [x, fy(x), fz(x)]);
const LN = { f4: lineAt((x) => 9.5 + 3 * Math.sin(x * .03), () => 100), f3: lineAt(() => TER + .4, () => 46), f2: lineAt(() => TER, () => 27), f1: lineAt(() => 1.1, (x) => zF(x) + 3.2), f0: lineAt(() => 0, zF),
  n0: lineAt(() => 0, zN), n1: lineAt(lipH, (x) => zN(x) - 1), n2: lineAt((x) => lipH(x) + .3, (x) => zN(x) - 8), n3: lineAt(() => 2.4, () => -45), n4: lineAt((x) => 6 + 3 * Math.sin(x * .025), () => -100) };
function band(ctx, P, A, B, c, n, fg, hat) {
  const s = projPoly(P, [...A, ...B.slice().reverse()], .25); if (s.length < 3) return;
  polyPath(ctx, s); ctx.fillStyle = col(c, kN(n), fg); ctx.fill(); if (hat) hatchPoly(ctx, s, hat[0], hat[1], hat[2]);
}
const dFar = (cam, z) => Math.abs(z - cam.z) + Math.max(0, cam.y - 2) * .5;

// ---------------------------------------------------------------- trees (meadow, behind the terrace, near land) and the swing tree
const TREES = (() => {
  const r = prng(41), a = [], ok = (x, z) => !(x > 10 && x < 24 && z < 27) && !(x > -6 && x < 8 && z > 13 && z < 34);
  for (let i = 0; a.length < 22 && i < 600; i++) { const x = -40 + r() * 100, z0 = zF(x) + 1.6, z = z0 + r() * (25.5 - z0); if (ok(x, z)) a.push({ x, z, h: 5 + r() * 4, y: gF(x, z), kind: 'm' }); }
  for (let i = 0; i < 16; i++) { const x = -45 + r() * 110, z = 43 + r() * 16; a.push({ x, z, h: 7 + r() * 4, y: TER + .4, kind: 'b' }); }
  for (let i = 0, n = 0; n < 14 && i < 600; i++) { const x = -40 + r() * 110, z = zN(x) - 4 - r() * 26; if (x > -4 && x < 31 && z > -18) continue; a.push({ x, z, h: 5.5 + r() * 4.5, y: gN(x, z), kind: 'n' }); n++; }
  return a;
})();
function blob(ctx, F, c, R, fg, dark = '#2a3a26', lit = '#56724a') {   // a crown blob: shade, then the side the light reaches
  ctx.fillStyle = col(dark, .15, fg); ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, TAU); ctx.fill();
  const lr = R * clamp(.5 + .5 * F.front, .3, 1);
  ctx.save(); ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, TAU); ctx.clip();
  ctx.fillStyle = col(lit, .95, fg); ctx.globalAlpha = .25 + .75 * F.L.k; ctx.beginPath(); ctx.arc(c[0] + F.ls[0] * (R - lr * .8), c[1] + F.ls[1] * (R - lr * .8), lr, 0, TAU); ctx.fill();
  ctx.restore();
}
function tree(ctx, P, F, T) {
  const b = P(T.x, T.y, T.z); if (b[2] < 1) return; const fg = fogD(b[2]), top = P(T.x, T.y + T.h * .6, T.z);
  ctx.strokeStyle = col('#2e241e', .3, fg); ctx.lineWidth = Math.max(1, .028 * T.h * b[3]); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(top[0], top[1]); ctx.stroke();
  for (const [ox, oy, rr] of [[0, .7, .3], [-.18, .58, .24], [.2, .6, .23], [.04, .88, .2]]) { const c = P(T.x + ox * T.h, T.y + oy * T.h, T.z), R = rr * T.h * c[3]; if (R > .7) blob(ctx, F, c, R, fg); }
}
function treesOf(ctx, P, F, kind) { const L = TREES.filter((T) => T.kind === kind).map((T) => ({ T, d: P(T.x, T.y, T.z)[2] })).filter((o) => o.d > 1).sort((a, b) => b.d - a.d); for (const o of L) tree(ctx, P, F, o.T); }
function limb(ctx, P, F, pts, rads, base, fg) {   // a tapered branch through 3D points, its lit edge toward the light
  const sp = pts.map((p) => P(...p)); if (sp.some((p) => p[2] < .3)) return;
  const L = [], R = []; let nx = 0, ny = 0;
  for (let i = 0; i < sp.length; i++) { const a = sp[Math.max(0, i - 1)], b = sp[Math.min(sp.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = Math.max(.8, rads[i] * sp[i][3]);
    nx = -dy / l; ny = dx / l; L.push([sp[i][0] + nx * w, sp[i][1] + ny * w]); R.push([sp[i][0] - nx * w, sp[i][1] - ny * w]); }
  polyPath(ctx, [...L, ...R.slice().reverse()]); ctx.fillStyle = col(base, .3, fg); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
  const E = nx * F.ls[0] + ny * F.ls[1] > 0 ? L : R; ctx.strokeStyle = col('#a88a6a', .95, fg, .4 + .5 * F.L.k); ctx.lineWidth = Math.max(1, rads[1] * sp[1][3] * .45);
  ctx.beginPath(); E.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
}
const TRK = [[[24.6, 1.6, 3.3], [24.5, 2.8, 3.8], [24.38, 4.2, 4.5], [24.25, 5.6, 5.2]], [.36, .3, .25, .2]];
const LIMB = [[[24.28, 5.5, 5.0], [24.15, 5.45, 6.4], [24.05, 5.33, 7.8], [23.98, 5.2, 9.0]], [.17, .14, .1, .06]];
const UPB = [[[[24.25, 5.6, 5.2], [24.4, 7.0, 4.9], [24.6, 8.6, 4.3]], [.18, .13, .08]], [[[24.4, 4.4, 4.4], [25.2, 5.8, 3.4], [26.0, 7.2, 2.6]], [.15, .11, .07]]];
const CROWN = [[24.6, 9.0, 4.4, 2.3], [25.8, 7.8, 2.7, 2.0], [25.0, 10.2, 3.5, 1.6], [23.4, 7.9, 6.2, 1.8], [24.0, 7.3, 8.0, 1.3]];
function swingTree(ctx, P, F) {
  const d = P(24.4, 4, 4.5)[2]; if (d < .5) return; const fg = fogD(d);
  for (const [x, y, z, r] of CROWN.slice(0, 3)) { const c = P(x, y, z); if (c[2] > .5) blob(ctx, F, c, r * c[3], fg, '#283826', '#5a7a46'); }
  for (const [pts, rads] of UPB) limb(ctx, P, F, pts, rads, '#3a2c24', fg);
  limb(ctx, P, F, TRK[0], TRK[1], '#3a2c24', fg);
  limb(ctx, P, F, LIMB[0], LIMB[1], '#3a2c24', fg);
  for (const [x, y, z, r] of CROWN.slice(3)) { const c = P(x, y, z); if (c[2] > .5) blob(ctx, F, c, r * c[3], fg, '#283826', '#5a7a46'); }
  // roots over the lip
  ctx.strokeStyle = col('#3a2c24', .3, fg); ctx.lineWidth = Math.max(1, .07 * P(24.6, 1.6, 3.3)[3]); ctx.beginPath();
  for (const [dx, dz] of [[-.7, .9], [.6, 1.1], [-.2, 1.5]]) projLine(ctx, P, [[24.6, 1.65, 3.4], [24.6 + dx * .6, 1.6, 3.4 + dz * .6], [24.6 + dx, 1.2, 3.4 + dz]], .3); ctx.stroke();
}

// ---------------------------------------------------------------- the rope swing, the kids
function ropeState(t, V) {   // θ (out over the water +), ψ (the stick turning about the rope)
  const S = V.sw;
  if (t < V.s4e) return { th: .05 * Math.sin(OM * t) + .025 * Math.sin(.61 * t), ps: .4 * Math.sin(.75 * t + .3) + .25 * Math.sin(.31 * t) + 1.5 * smo((t - V.sign) / 1.6) + .5 * Math.sin(1.1 * t) * smr(V.sign, V.sign + .8, t) };
  if (t < S.launch) return { th: -A0, ps: 0 };   // held at the bank, out of view, by the kid about to jump
  const th = A0 * Math.sin(OM * (t - S.t0)); return { th: t < S.rel ? th : th * Math.exp(-(t - S.rel) / 3), ps: t < S.rel ? 0 : .3 * Math.sin(2 * (t - S.rel)) * smr(S.rel, S.rel + .5, t) };
}
function rope(ctx, P, F, upto) {
  const { th } = ropeState(F.t, F.V), s = seatAt(th), a = P(...SWP), b = P(...(upto || s)); if (a[2] < .5 || b[2] < .5) return;
  const fg = fogD(a[2]);
  ctx.strokeStyle = col('#c8b48a', .8, fg); ctx.lineWidth = Math.max(1.2, .028 * b[3]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  ctx.strokeStyle = col('#3a2c24', .3, fg); ctx.lineWidth = Math.max(1.5, .06 * a[3]); ctx.beginPath(); ctx.moveTo(a[0], a[1] - .05 * a[3]); ctx.lineTo(a[0], a[1] + .1 * a[3]); ctx.stroke();   // the wrap round the limb
  // the seat: a wooden disc on a knot (reads from every side, unlike a stick seen end-on)
  const cr = [Math.cos(F.cam.yaw) * .16, 0, -Math.sin(F.cam.yaw) * .16], p1 = P(s[0] - cr[0], s[1], s[2] - cr[2]), p2 = P(s[0] + cr[0], s[1], s[2] + cr[2]);
  const rx = Math.max(2.5, Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 2), ry = Math.max(1.4, rx * .34), cx = (p1[0] + p2[0]) / 2, cy = (p1[1] + p2[1]) / 2, an = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]), dk = Math.max(1.2, .045 * b[3]);
  ctx.fillStyle = col('#4a3020', .5, fg); ctx.beginPath(); ctx.ellipse(cx, cy + dk, rx, ry, an, 0, TAU); ctx.fill(); ctx.fillRect(cx - rx, cy, rx * 2, dk);
  ctx.fillStyle = col('#9a7048', .75, fg); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, an, 0, TAU); ctx.fill();
  ctx.fillStyle = col('#3a2c24', .3, fg); ctx.beginPath(); ctx.ellipse(cx, cy - ry * .2, Math.max(1.2, rx * .2), Math.max(1.2, rx * .26), 0, 0, TAU); ctx.fill();
}
const KSIT = { hip: [1.3, 1.4], kn: [1.25, 1.35], sh: [2.75, 2.55], el: [.35, .5], lean: -.05, head: -.12 };
const KFLY = { hip: [1.95, 1.8], kn: [2.25, 2.1], sh: [2.95, 2.6], el: [.15, .25], lean: .1, head: -.05 };
const blendP = (a, b, u) => { const o = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = a[k] ?? b[k], y = b[k] ?? a[k]; o[k] = Array.isArray(x) ? x.map((v, i) => mix(v, y[i], u)) : typeof x === 'number' ? mix(x, y, u) : (u < .5 ? x : y); } return o; };
const KIDD1 = { top: '#e0705a', pants: '#e0705a', shoes: '#d9a882', skin: '#d9a882', hair: '#4a2a1a' }, KIDD2 = { top: '#c89474', pants: '#2c5a8a', shoes: '#c89474', skin: '#c89474', hair: '#1e1612' };
function swingKid(ctx, P, F) {
  const { t, V } = F, S = V.sw; if (t < S.launch) return;
  let hipW, pose, gam;
  if (t < S.rel) {
    const { th } = ropeState(t, V), s = seatAt(th), a = P(...s), b = P(...SWP); hipW = [s[0], s[1] + .06, s[2]]; gam = Math.atan2(b[0] - a[0], a[1] - b[1]); pose = KSIT; F.gamRel = gam;
  } else {
    const u = t - S.rel; hipW = [S.h0[0], S.h0[1] + S.v[1] * u - 4.905 * u * u, S.h0[2] + S.v[2] * u];
    if (t > V.splash) hipW[1] = .32 + S.v[1] - 9.81 * S.tau - 2.6 * (t - V.splash) + (S.h0[1] + S.v[1] * S.tau - 4.905 * S.tau ** 2 - .32 - S.v[1] + 9.81 * S.tau);
    gam = mix(F.gamRel ?? 0, -.25, smo(u / .55)); pose = blendP(KSIT, KFLY, smo(u / .16));
  }
  const h = P(...hipW); if (h[2] < .5) return; const s = h[3] * 1.3 / 113;
  ctx.save();
  if (t > V.splash - .02) { const wl = P(S.spl[0], 0, S.spl[2]); ctx.beginPath(); ctx.rect(0, -10, W, wl[1] + 10); ctx.clip(); }   // under the surface: gone
  const sq = kidS(s), k = s / sq; ctx.translate(h[0], h[1]); ctx.rotate(gam); ctx.scale(k, k);
  figureKid(ctx, 0, 0, sq, pose, { t, seed: 3, flip: true, dress: KIDD1, light: { x: (F.lp[0] - h[0]) / k, y: (F.lp[1] - h[1]) / k, col: F.L.sun, a: .7 }, rim: F.L.sun, rimSide: F.rs });
  ctx.restore();
}
// figureKid keeps one canvas pair per pixel size: draw at a size from a fixed ladder (1.15^n) and scale down the rest
const kidS = (s) => Math.pow(1.15, Math.ceil(Math.log(Math.max(s, .05)) / Math.log(1.15)));
function bankKid(ctx, P, F) {
  const { t, V } = F; if (t < V.s4e) return;   // years later only (out of view until the pan)
  const x = 24.95, z = 4.45, g = lipH(x), cheer = smr(V.splash - .1, V.splash + .15, t), hop = cheer * .1 * Math.abs(Math.sin(TAU * 1.6 * (t - V.splash)));
  const h = P(x, g + 53 * 1.25 / 113 + hop, z); if (h[2] < .5) return; const s = h[3] * 1.25 / 113;
  const pose = blendP({ sh: [.9 + .15 * Math.sin(t * 2.2), .35], el: [1.2, .5], head: -.08, lean: .04 }, { sh: [2.5, 2.35], el: [.12, .2], head: -.2, lean: -.04 }, cheer);
  const sq = kidS(s), k = s / sq; ctx.save(); ctx.translate(h[0], h[1]); ctx.scale(k, k);
  figureKid(ctx, 0, 0, sq, pose, { t, seed: 9, flip: true, dress: KIDD2, light: { x: (F.lp[0] - h[0]) / k, y: (F.lp[1] - h[1]) / k, col: F.L.sun, a: .7 }, rim: F.L.sun, rimSide: F.rs });
  ctx.restore();
}

// ---------------------------------------------------------------- the water, reeds, sensors, the splash
function water(ctx, P, F) {
  const { cam, L, t, V } = F, A = XS.map((x) => [x, 0, zN(x) - .3]), B = XS.map((x) => [x, 0, zF(x)]);
  const s = projPoly(P, [...A, ...B.slice().reverse()], .05); if (s.length < 3) return;
  const f = cam.f, p = cam.pitch, yD = (d) => H / 2 + f * Math.tan(clamp(d * DEG + p, -1.53, 1.53));
  let body = shA(mixHex('#2d6a74', '#5e5c50', L.dull), .55);
  const pv = 1 - smr(V.piv + .02, V.piv + .6, t); if (pv > 0) { const pc = hex2rgb(pivotCol()); body = body.map((v, i) => mix(v, pc[i], pv)); }
  const hor = hex2rgb(L.sky[1]).map((v) => v * .85), y0 = yD(0), y1 = yD(32);
  if (y1 - y0 > 2) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, rgbS(hor)); g.addColorStop(.2, rgbS(hor.map((v, i) => mix(v, body[i], .55)))); g.addColorStop(1, rgbS(body)); ctx.fillStyle = g; }
  else ctx.fillStyle = rgbS(body);
  polyPath(ctx, s); ctx.fill();
  const tex = smr(V.piv + .05, V.piv + .55, t); if (tex <= 0) return;
  ctx.save(); polyPath(ctx, s); ctx.clip();
  // the far bank in the water (dark), the low sun's glitter path, the current's engraved ripples
  const rf = projPoly(P, [...LN.f0, ...LN.f1.map(([x, y, z]) => [x, -y * .9, z]).reverse()], .25);
  if (rf.length > 2) { polyPath(ctx, rf); ctx.fillStyle = rgbS(shA('#2a3020', .3), .45 * tex); ctx.fill(); }
  const gk = L.k * smr(-1, 6, L.el) * (1 - smr(20, 34, L.el)) * tex;
  if (gk > .02) { const r = prng(77), az = L.az * DEG; ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 90; i++) { const d = 4 + Math.pow(r(), 1.6) * 160, w = (r() - .5) * (.4 + d * .025), X = cam.x + Math.sin(az) * d + Math.cos(az) * w, Z = cam.z + Math.cos(az) * d - Math.sin(az) * w;
      const ln = .25 + r() * .5, sp = 4 + r() * 5; if (Z < zN(X) || Z > zF(X)) continue; const q = P(X, 0, Z); if (q[2] < .5) continue;
      ctx.strokeStyle = rgba(L.sun, .55 * gk * (.5 + .5 * Math.sin(t * sp + i))); ctx.lineWidth = Math.max(1, .03 * q[3]); ctx.beginPath(); ctx.moveTo(q[0] - ln * q[3] / 2, q[1]); ctx.lineTo(q[0] + ln * q[3] / 2, q[1]); ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over'; }
  const r = prng(31); ctx.lineWidth = 1;
  for (let i = 0; i < 260; i++) { const X = -20 + (r() * 80 + t * .35) % 80, u = r(), ln = .4 + r() * 1.2, a0 = .12 + .18 * r(), Z = mix(zN(X) + .3, zF(X) - .2, u);
    const a = P(X, 0, Z), b = P(X + ln, 0, Z); if (a[2] < .3 || b[2] < .3) continue;
    ctx.strokeStyle = rgba(L.sky[1], a0 * tex); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  ctx.restore();
}
const REEDS = (() => { const r = prng(57), a = []; for (let i = 0; i < 74; i++) { const side = i < 38 ? -1 : 1, x = -15 + r() * 65, z = side < 0 ? zN(x) + r() * .9 : zF(x) - r() * .9; if (side < 0 && x > 19.5 && x < 26) continue; a.push({ x, z, side, n: 4 + (r() * 4 | 0), h: .6 + r() * .6, sd: r() * 9 }); } return a; })();
function reeds(ctx, P, F, side) {
  const { t, L } = F, g = mix(.45, 1.35, L.reed);
  for (const R of REEDS) { if (R.side !== side) continue; const b = P(R.x, 0, R.z); if (b[2] < .5) continue; const fg = fogD(b[2]);
    ctx.strokeStyle = col('#3a4626', .45, fg); ctx.lineWidth = Math.max(1, .02 * b[3]); ctx.beginPath();
    for (let j = 0; j < R.n; j++) { const dx = (j - R.n / 2) * .06, h = R.h * g * (.7 + .3 * Math.sin(j * 2.1 + R.sd)), sw = .1 * Math.sin(t * 1.3 + R.sd + j) * h;
      const a = P(R.x + dx, 0, R.z), c = P(R.x + dx + sw + .05 * (j - R.n / 2), h, R.z); if (c[2] < .5) continue; ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(a[0], (a[1] + c[1]) / 2, c[0], c[1]); }
    ctx.stroke(); }
}
const SENS = Array.from({ length: 7 }, (_, i) => { const x = 8 + i * 3.6; return [x, zF(x) - .45]; });
function sensors(ctx, P, F) {
  const { t, V } = F; if (t < V.s4e) return;   // set out once you start on the river (out of view)
  SENS.forEach(([x, z], i) => {
    const b = P(x, -.05, z), tp = P(x, .52, z); if (b[2] < .5) return; const q = b[3], ts = V.yrs0 + i * .15, k = smr(ts, ts + .3, t), c = mixHex('#8fe6ff', '#ffb35c', k);
    const u = (t - ts) / .9; if (u > 0 && u < 1) { ctx.strokeStyle = rgba(c, .5 * (1 - u)); ctx.lineWidth = 1.2; ctx.beginPath(); for (let j = 0; j <= 28; j++) { const a = j / 28 * TAU, r = .2 + 1.4 * eoX(u), p = P(x + Math.cos(a) * r, 0, z + Math.sin(a) * r); j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); }
    ctx.strokeStyle = col('#2a2a30', .4); ctx.lineWidth = Math.max(1, .035 * q); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(tp[0], tp[1]); ctx.stroke();
    ctx.fillStyle = col('#4a4a52', .6); ctx.fillRect(tp[0] - .04 * q, tp[1] - .03 * q, .08 * q, .06 * q);
    const r = Math.max(2.2, .04 * q), g = ctx.createRadialGradient(tp[0], tp[1] - .05 * q, 0, tp[0], tp[1] - .05 * q, r * 6);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; g.addColorStop(0, rgba(c, .7)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(tp[0] - r * 6, tp[1] - .05 * q - r * 6, r * 12, r * 12);
    ctx.fillStyle = mixHex(c, '#ffffff', .45); ctx.beginPath(); ctx.arc(tp[0], tp[1] - .05 * q, r, 0, TAU); ctx.fill(); ctx.restore();
  });
}
const DROPS = (() => { const r = prng(909); return Array.from({ length: 76 }, () => ({ t: r() * .1, vy: 2.4 + Math.pow(r(), 1.5) * 6, vr: .4 + r() * 1.9, a: r() * TAU, s: .6 + r() * .8 })); })();
function splash(ctx, P, F) {
  const { t, V } = F, C = V.sw.spl, tau = t - V.splash; if (tau < 0 || tau > 2.4) return;
  const c0 = P(...C); if (c0[2] < .5) return; const q = c0[3];
  for (let k = 0; k < 3; k++) { const u = tau - k * .22; if (u <= 0) continue; const r = .3 + 1.25 * u, a = .5 * Math.exp(-u / .9);
    ctx.strokeStyle = rgba('#eef2e6', a); ctx.lineWidth = Math.max(1, .03 * q); ctx.beginPath(); for (let j = 0; j <= 36; j++) { const an = j / 36 * TAU, p = P(C[0] + Math.cos(an) * r, 0, C[2] + Math.sin(an) * r); j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); }
  if (tau < .95) {   // the crown: a ring of sheets thrown up and falling back
    const r = .3 + .5 * eoX(tau / .45), hg = 1.05 * Math.sin(Math.PI * clamp(tau / .95)) ** .7;
    ctx.lineCap = 'round';
    for (let i = 0; i < 30; i++) { const an = i / 30 * TAU + .3, hh = hg * (.55 + .45 * hash(i)), b = P(C[0] + Math.cos(an) * r, 0, C[2] + Math.sin(an) * r), e = P(C[0] + Math.cos(an) * (r + .28 * hh), hh, C[2] + Math.sin(an) * (r + .28 * hh));
      ctx.strokeStyle = rgba('#e8f0ea', .85); ctx.lineWidth = Math.max(1.5, .07 * q * (1 - tau)); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
      ctx.strokeStyle = rgba(F.L.sun, .6); ctx.lineWidth = Math.max(1, .025 * q); ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(mix(e[0], b[0], .3), mix(e[1], b[1], .3)); ctx.stroke(); }
    const jh = 1.5 * Math.sin(Math.PI * clamp((tau - .12) / .7)); if (jh > .05) { const b = P(...C), e = P(C[0], jh, C[2]); ctx.strokeStyle = rgba('#f2f4ea', .9); ctx.lineWidth = Math.max(2, .12 * q); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); }
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';   // the droplets, lit by the last of the sun
  for (const D of DROPS) { const u = tau - D.t; if (u <= 0) continue; const y = D.vy * u - 4.905 * u * u; if (y < 0) continue;
    const rr = D.vr * u, X = C[0] + Math.cos(D.a) * rr, Z = C[2] + Math.sin(D.a) * rr, p = P(X, y, Z); if (p[2] < .5) continue;
    const vy = D.vy - 9.81 * u, p2 = P(X - Math.cos(D.a) * D.vr * .03, y - vy * .03, Z - Math.sin(D.a) * D.vr * .03), w = Math.max(1.2, .028 * p[3] * D.s);
    ctx.strokeStyle = rgba('#ffd9a0', .85); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p2[0], p2[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- the boat, you, the oars, the net
const bb = (u) => .68 * Math.sqrt(Math.max(0, 1 - ((u + .25) / 2.0) ** 2)), gh = (u) => .4 + .1 * (u / 1.75) ** 2;
function boatState(t, V) {
  if (t < V.s4e - .5) return { x: 9, z: zN(9) + .75, hd: 90 * DEG, moored: true };
  const u = smr(V.s5e, V.s6, t);
  return { x: 16.4 + (t - V.s4e) * .32 + 1.4 * u, z: 9.3 + .7 * u, hd: mix(90, 141, u) * DEG, moored: false };
}
function stroke(t, V) {   // the oar sweep α (+ blade toward the bow), the blade's height, your lean (+ toward the stern)
  const ph = t - V.row0, rest = { a: -.5, yb: .05, lean: .06 };
  if (ph < -.35) return rest;
  if (ph < 0) { const k = smo((ph + .35) / .35); return { a: mix(-.5, .7, k), yb: mix(.05, .2, k) - .27 * smo((ph + .08) / .08), lean: mix(.06, .38, k) }; }
  if (ph < 1.42) { const f = ph % 1; if (f < .42) { const k = cio(f / .42); return { a: mix(.7, -.2, k), yb: -.07, lean: mix(.38, -.22, k) }; }
    if (f < .52) return { a: -.2, yb: mix(-.07, .2, smo((f - .42) / .1)), lean: -.22 };
    if (f < .92) { const k = cio((f - .52) / .4); return { a: mix(-.2, .7, k), yb: .2, lean: mix(-.22, .38, k) }; }
    return { a: .7, yb: .2 - .27 * smo((f - .92) / .08), lean: .38 }; }
  const k = smo((ph - 1.42) / .6); return { a: mix(-.2, -.5, k), yb: mix(-.07, .05, k), lean: mix(-.22, .02, k) };
}
function boat(ctx, P, F) {
  const { t, V, cam } = F, B = boatState(t, V), sh = Math.sin(B.hd), ch = Math.cos(B.hd), bob = .015 * Math.sin(t * 1.7);
  const W3 = (u, w, y) => [B.x + sh * u + ch * w, y + bob, B.z + ch * u - sh * w];
  const c0 = P(B.x, .4, B.z); if (c0[2] < .8) return; const fg = fogD(c0[2]);
  const cs = Math.sign(ch * (cam.x - B.x) - sh * (cam.z - B.z)) || 1, nS = [ch * cs, 0, -sh * cs];
  const US = Array.from({ length: 19 }, (_, i) => -1.75 + 3.5 * i / 18), gun = (s) => US.map((u) => W3(u, s * bb(u), gh(u))), wl = (s) => US.map((u) => W3(u, s * bb(u) * .82, -.04));
  const fillW = (pts, c) => { const s = projPoly(P, pts, .3); if (s.length > 2) { polyPath(ctx, s); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke(); } return s; };
  // the far oar (behind everything of the boat)
  const st = stroke(t, V), netting = !B.moored && t < V.row0 - .35;
  const oar = (s) => { const O = W3(.32, s * (bb(.32) + .03), gh(.32) + .05), a = netting || B.moored ? -.5 : st.a, Dh = [sh * Math.sin(a) + ch * s * Math.cos(a), sh * 0, ch * Math.sin(a) - sh * s * Math.cos(a)];
    const E = [O[0] + Dh[0] * 1.5, (B.moored ? .45 : netting ? .05 : st.yb) + bob, O[2] + Dh[2] * 1.5], d = [E[0] - O[0], E[1] - O[1], E[2] - O[2]], l = Math.hypot(...d);
    return { O, E, Hd: [O[0] - d[0] * .85 / l, O[1] - d[1] * .85 / l, O[2] - d[2] * .85 / l] }; };
  const drawOar = (o) => { const h = P(...o.Hd), e = P(...o.E); if (h[2] < .3 || e[2] < .3) return;
    ctx.strokeStyle = col('#b08a5a', .7, fg); ctx.lineWidth = Math.max(1.5, .035 * c0[3]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
    const m = P(o.O[0] + (o.E[0] - o.O[0]) * .72, o.O[1] + (o.E[1] - o.O[1]) * .72, o.O[2] + (o.E[2] - o.O[2]) * .72); ctx.strokeStyle = col('#e0d4b8', .8, fg); ctx.lineWidth = Math.max(3, .13 * e[3]); ctx.beginPath(); ctx.moveTo(m[0], m[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); };
  const oF = oar(-cs), oN = oar(cs);
  if (!B.moored) drawOar(oF);
  fillW([...gun(-cs), ...wl(-cs).reverse()], col('#6a4a30', .3, fg));
  fillW([...US.map((u) => W3(u, bb(u) * .55, .1)), ...US.slice().reverse().map((u) => W3(u, -bb(u) * .55, .1))], col('#5a3e28', .45, fg));
  for (const u of [-1.3, .05, 1.0]) fillW([W3(u - .11, -bb(u), .33), W3(u + .11, -bb(u), .33), W3(u + .11, bb(u), .33), W3(u - .11, bb(u), .33)], col('#8a6a44', .7, fg));
  if (t > V.net + .9) for (const [u, w, c, L] of [[-.55, .1, '#6a8a6a', .26], [-.4, -.12, '#8a3a2a', .12]]) { const a = P(...W3(u, w, .14)), b = P(...W3(u + L, w + .03, .16)); ctx.strokeStyle = col(c, .7, fg); ctx.lineWidth = Math.max(2, .07 * a[3]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  // you (not while she is moored)
  let hands = null;
  if (!B.moored) {
    const hip = P(...W3(.05, 0, .41)), s = hip[3] * FU, stern = P(...W3(-1.75, 0, .4)), flip = stern[0] < hip[0];
    const net = netState(t, V, cs, W3), lean = netting ? .2 + .1 * smr(V.net, V.net + .4, t) : t > V.s5e ? mix(st.lean, -.08, smr(V.s5e, V.s5e + .6, t)) : st.lean;
    let pose = { hip: [1.25, 1.2], kn: [1.15, 1.1], lean, head: t > V.s5e ? mix(.05, -.12, smr(V.s5e, V.s6, t)) : .08, sh: [.6, .5], el: [.9, .9] };
    const o = { t, seed: 4, flip, dress: { coat: '#3a4a5a', pants: '#1e1c2c', shoes: '#120e14', skin: '#d9b08e', hair: '#2a1c18' }, light: { x: F.lp[0], y: F.lp[1], col: F.L.sun, a: .7 }, rim: F.L.sun, rimSide: F.rs, shadow: false };
    if (netting) { const g1 = P(...net.g1), g2 = P(...net.g2); const fa = reachArm(hip[0], hip[1], s, pose, 0, flip, o, [g2[0], g2[1]], 1), ba = reachArm(hip[0], hip[1], s, pose, 1, flip, o, [g1[0], g1[1]], 1); pose = { ...pose, sh: [fa.sh, ba.sh], el: [fa.el, ba.el], lock: [1, 1] }; }
    else if (t < V.s5e + .3) { const hn = P(...oN.Hd), hf = P(...oF.Hd); const fa = reachArm(hip[0], hip[1], s, pose, 0, flip, o, [hn[0], hn[1]], 1), ba = reachArm(hip[0], hip[1], s, pose, 1, flip, o, [hf[0], hf[1]], 1); pose = { ...pose, sh: [fa.sh, ba.sh], el: [fa.el, ba.el], lock: [1, 1] }; }
    figure(ctx, hip[0], hip[1], s, pose, o);
    hands = netting ? net : null;
  }
  // the near side, its gunwale stripe and planks, then the near oar and the net
  const side = fillW([...gun(cs), ...wl(cs).reverse()], col('#2e5a6a', kN(nS), fg));
  if (side.length > 2) { ctx.save(); polyPath(ctx, side); ctx.clip(); ctx.strokeStyle = 'rgba(10,20,30,.35)'; ctx.lineWidth = 1; ctx.beginPath(); for (const k of [.35, .65]) projLine(ctx, P, US.map((u) => W3(u, cs * bb(u) * mix(1, .82, k), mix(gh(u), -.04, k))), .3); ctx.stroke(); ctx.restore(); }
  ctx.strokeStyle = col('#e0d4b8', .9, fg); ctx.lineWidth = Math.max(2, .045 * c0[3]); ctx.beginPath(); projLine(ctx, P, gun(cs), .3); ctx.stroke();
  if (!B.moored) drawOar(oN); else { ctx.strokeStyle = col('#b08a5a', .6, fg); ctx.lineWidth = Math.max(1.5, .03 * c0[3]); ctx.beginPath(); projLine(ctx, P, [W3(-1.2, .2, .5), W3(1.3, .25, .48)], .3); ctx.stroke(); }
  if (hands) drawNet(ctx, P, F, hands, fg);
}
function netState(t, V, cs, W3) {   // the long-handled net: in the water → lifted on "river" → over the gunwale → tipped → laid down
  const n = t - V.net, K = [[-9, [-.9, cs * (bb(-.9) + .95), -.32], [-.15, cs * .15, .62]], [0, [-.9, cs * (bb(-.9) + .95), -.32], [-.15, cs * .15, .62]],
    [.4, [-.9, cs * (bb(-.9) + .75), 1.05], [-.05, cs * .1, .5]], [.6, [-.92, cs * (bb(-.9) + .72), 1.0], [-.05, cs * .1, .5]], [.82, [-.6, cs * .15, .9], [.15, -cs * .1, .55]],
    [.9, [-.6, cs * .12, .82], [.15, -cs * .1, .6]], [1.03, [-1.45, cs * .25, .45], [.6, cs * .3, .45]]];
  let i = 0; while (i < K.length - 2 && n >= K[i + 1][0]) i++;
  const u = cio((n - K[i][0]) / (K[i + 1][0] - K[i][0])), L = (a, b) => a.map((v, j) => mix(v, b[j], u)), hc = L(K[i][1], K[i + 1][1]), bt = L(K[i][2], K[i + 1][2]);
  const Hc = W3(...hc), Bt = W3(...bt), at = (f) => [Bt[0] + (Hc[0] - Bt[0]) * f, Bt[1] + (Hc[1] - Bt[1]) * f, Bt[2] + (Hc[2] - Bt[2]) * f];
  return { Hc, Bt, g1: at(.1), g2: at(.42), n, full: n < .86, tip: smr(.82, .9, n) };
}
function drawNet(ctx, P, F, N, fg) {
  const wl = P(N.Hc[0], 0, N.Hc[2]), b = P(...N.Bt), h = P(...N.Hc); if (h[2] < .3 || b[2] < .3) return; const q = h[3];
  ctx.save(); ctx.beginPath(); ctx.rect(0, -10, W, wl[1] + 10); ctx.clip();   // what is under the surface stays there
  ctx.strokeStyle = col('#9a7a50', .7, fg); ctx.lineWidth = Math.max(1.5, .03 * q); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(h[0], h[1]); ctx.stroke();
  const ring = []; for (let j = 0; j <= 20; j++) { const a = j / 20 * TAU, p = P(N.Hc[0] + Math.cos(a) * .23, N.Hc[1] + Math.sin(a) * .23 * N.tip, N.Hc[2] + Math.sin(a) * .23 * (1 - N.tip)); ring.push([p[0], p[1]]); }
  const bot = P(N.Hc[0], N.Hc[1] - .4 * (1 - N.tip * .6), N.Hc[2]), l = ring.reduce((m, p) => (p[0] < m[0] ? p : m)), r = ring.reduce((m, p) => (p[0] > m[0] ? p : m));
  ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.quadraticCurveTo(l[0], bot[1], bot[0], bot[1]); ctx.quadraticCurveTo(r[0], bot[1], r[0], r[1]); ctx.closePath();
  ctx.fillStyle = 'rgba(40,40,36,.35)'; ctx.fill();
  if (N.full) { ctx.save(); ctx.clip(); const m = [(l[0] + r[0]) / 2, (l[1] + bot[1]) / 2 + .05 * q];
    ctx.fillStyle = col('#6a8a6a', .7, fg); ctx.save(); ctx.translate(m[0] - .06 * q, m[1]); ctx.rotate(-.5); ctx.fillRect(-.12 * q, -.035 * q, .24 * q, .07 * q); ctx.restore();
    ctx.fillStyle = col('#8a3a2a', .7, fg); ctx.fillRect(m[0] + .02 * q, m[1] - .03 * q, .06 * q, .08 * q);
    ctx.strokeStyle = col('#4a3a24', .5, fg); ctx.lineWidth = Math.max(1, .012 * q); ctx.beginPath(); ctx.moveTo(m[0] - .15 * q, m[1] + .06 * q); ctx.quadraticCurveTo(m[0], m[1] - .08 * q, m[0] + .14 * q, m[1] + .05 * q); ctx.stroke(); ctx.restore(); }
  ctx.strokeStyle = 'rgba(30,30,26,.55)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let k = 1; k < 6; k++) { const x = mix(l[0], r[0], k / 6); ctx.moveTo(x, mix(l[1], r[1], k / 6)); ctx.lineTo(mix(x, bot[0], .8), bot[1] - 2); } ctx.stroke();
  ctx.strokeStyle = col('#c8b48a', .8, fg); ctx.lineWidth = Math.max(1.5, .02 * q); polyPath(ctx, ring); ctx.stroke();
  ctx.restore();
  if (N.n > .3 && N.n < .9) { ctx.fillStyle = 'rgba(220,236,240,.75)'; for (let i = 0; i < 6; i++) { const u = ((N.n * 1.7 + i * .17) % .5), p = P(N.Hc[0] + (i - 3) * .03, N.Hc[1] - .4 - 4.9 * u * u, N.Hc[2]); if (p[1] < wl[1]) { ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(1, .012 * q), 0, TAU); ctx.fill(); } } }
  if (N.n < .25) { const u = clamp(N.n / .25); ctx.strokeStyle = rgba('#e8eee6', .5 * (1 - u)); ctx.lineWidth = 1.2; ctx.beginPath(); for (let j = 0; j <= 24; j++) { const a = j / 24 * TAU, rr = .3 + u * .8, p = P(N.Hc[0] + Math.cos(a) * rr, 0, N.Hc[2] + Math.sin(a) * rr); j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); }
}

// ---------------------------------------------------------------- the terrace: houses, the town hall, the barn and its yard, the road
const HW4 = [[.3, 1.3, .8, 1.1], [.7, 1.3, .8, 1.1], [.3, 3.0, .8, 1.0], [.7, 3.0, .8, 1.0]];
const HOUSES = [[-30, -23, 35, 41, 5, 2.6, '#c8b89a', '#5a3a34'], [-21, -14.5, 34.5, 40, 6.2, 2.4, '#b8a888', '#4a3438'], [-12.5, -6.5, 35, 40.5, 4.8, 2.2, '#d0c0a0', '#5a3a30'],
  [7.5, 11.2, 35.5, 40, 5.4, 2.4, '#c0b090', '#4a3430'], [28, 34, 35, 41, 5, 2.4, '#bca888', '#4a3a36'], [36.5, 42, 34.5, 40, 4.5, 2.2, '#c4b494', '#54403a']];
function house(ctx, P, F, [x0, x1, z0, z1, h, rh, wall, roof]) {
  const y0 = TER, y1 = TER + h, yr = y1 + rh, zm = (z0 + z1) / 2, { cam } = F, d = P((x0 + x1) / 2, y1, z0)[2]; if (d < .5) return; const fg = fogD(d);
  if (cam.x < x0) fc(ctx, P, [[x0, y0, z1], [x0, y0, z0], [x0, y1, z0], [x0, yr, zm], [x0, y1, z1]], [-1, 0, 0], wall, fg, 1);
  if (cam.x > x1) fc(ctx, P, [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, yr, zm], [x1, y1, z0]], [1, 0, 0], wall, fg, 1);
  fc(ctx, P, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1], wall, fg, 1);
  for (const [u, v, w, hh] of HW4) { if (v + hh > h - .3) continue; const x = mix(x0, x1, u), s = projPoly(P, [[x - w / 2, y0 + v, z0 - .02], [x + w / 2, y0 + v, z0 - .02], [x + w / 2, y0 + v + hh, z0 - .02], [x - w / 2, y0 + v + hh, z0 - .02]], .3);
    if (s.length < 3) continue; polyPath(ctx, s); ctx.fillStyle = col('#1c2034', .3, fg); ctx.fill(); ctx.strokeStyle = col('#d8ccb0', .7, fg); ctx.lineWidth = 1.2; ctx.stroke(); }
  const rs = fc(ctx, P, [[x0 - .3, y1 - .15, z0 - .35], [x1 + .3, y1 - .15, z0 - .35], [x1 + .3, yr + .05, zm], [x0 - .3, yr + .05, zm]], [0, .8, -.6], roof, fg, 0); if (rs.length > 2) hatchPoly(ctx, rs, .25, 6, 'rgba(10,8,24,.22)');
}
function archWin(ctx, P, x, y, w, h, z, fg) {
  const pts = [[x - w / 2, y, z], [x + w / 2, y, z]]; for (let j = 0; j <= 8; j++) { const a = j / 8 * Math.PI; pts.push([x + Math.cos(a) * w / 2, y + h - w / 2 + Math.sin(a) * w / 2, z]); }
  const s = projPoly(P, pts, .3); if (s.length < 3) return; polyPath(ctx, s); ctx.fillStyle = col('#20263c', .35, fg); ctx.fill(); ctx.strokeStyle = col('#e6dcc4', .85, fg); ctx.lineWidth = 1.4; ctx.stroke();
  ctx.lineWidth = 1; ctx.beginPath(); projLine(ctx, P, [[x, y, z - .01], [x, y + h, z - .01]], .3); projLine(ctx, P, [[x - w / 2, y + h * .55, z - .01], [x + w / 2, y + h * .55, z - .01]], .3); ctx.stroke();
}
function column(ctx, P, F, x, z, y0, y1, r, c, fg) {
  const a = P(x - r, y0, z), b = P(x + r, y0, z), e = P(x + r, y1, z), f = P(x - r, y1, z); if (a[2] < .3) return;
  const g = ctx.createLinearGradient(a[0], 0, b[0], 0), lit = col(c, .95, fg), shd = col(c, .12, fg), ls = F.ls[0] < 0;
  g.addColorStop(0, ls ? lit : shd); g.addColorStop(.45, col(c, .6, fg)); g.addColorStop(1, ls ? shd : lit);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(e[0], e[1]); ctx.lineTo(f[0], f[1]); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = 'rgba(40,30,30,.22)'; ctx.beginPath(); for (let k = 1; k < 5; k++) { const u = k / 5; ctx.moveTo(mix(a[0], b[0], u), mix(a[1], b[1], u)); ctx.lineTo(mix(f[0], e[0], u), mix(f[1], e[1], u)); } ctx.stroke();
  fc(ctx, P, [[x - r * 1.5, y1 - .18, z - .03], [x + r * 1.5, y1 - .18, z - .03], [x + r * 1.5, y1, z - .03], [x - r * 1.5, y1, z - .03]], [0, 0, -1], c, fg, 0);
  fc(ctx, P, [[x - r * 1.4, y0, z - .03], [x + r * 1.4, y0, z - .03], [x + r * 1.4, y0 + .16, z - .03], [x - r * 1.4, y0 + .16, z - .03]], [0, 0, -1], c, fg, 0);
}
function clock(ctx, P, F, C, r, fg) {   // a guilloché dial, morning hands, the minute hand creeping
  if (!plane3(ctx, P, C, [r, 0, 0], [0, -r, 0])) { id(ctx); return; }
  ctx.fillStyle = col('#ece2c8', .85, fg); ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(70,50,36,.5)'; ctx.lineWidth = .012;
  for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let i = 0; i <= 96; i++) { const a = i / 96 * TAU, rr = .3 + k * .075 + .022 * Math.sin(a * 12 + k * 1.3); i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.stroke(); }
  ctx.strokeStyle = '#2a2020'; ctx.lineWidth = .05; ctx.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.moveTo(Math.cos(a) * .8, Math.sin(a) * .8); ctx.lineTo(Math.cos(a) * .94, Math.sin(a) * .94); } ctx.stroke();
  ctx.lineWidth = .06; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.stroke();
  const mn = 10 + (F.t - F.V.s2) * .5, hr = 8 + mn / 60, hand = (a, L, w) => { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(a) * L, -Math.cos(a) * L); ctx.stroke(); };
  hand(hr / 12 * TAU, .5, .08); hand(mn / 60 * TAU, .78, .05); id(ctx);
}
function cupola(ctx, P, F, fg) {
  const cx = 1, cz = 36.75, y0 = 12.35, y1 = 14.35, w = .85, stone = '#cfc2a4';
  fc(ctx, P, [[cx - w, y0, cz - w], [cx + w, y0, cz - w], [cx + w, y0 + .45, cz - w], [cx - w, y0 + .45, cz - w]], [0, 0, -1], stone, fg, 1);
  fc(ctx, P, [[cx - w, y0 + .45, cz - w + .03], [cx + w, y0 + .45, cz - w + .03], [cx + w, y1, cz - w + .03], [cx - w, y1, cz - w + .03]], [0, 0, -1], '#2a2632', fg, 0, false);
  const u = F.t - F.V.bell, a = u > 0 ? .5 * Math.sin(TAU * u / 1.4) * Math.exp(-u / 2.4) * smo(u / .15) : 0;   // the bell swings from "time"
  if (plane3(ctx, P, [cx, y1 - .18, cz - w + .1], [1, 0, 0], [0, -1, 0])) {
    ctx.rotate(a); const g = ctx.createLinearGradient(-.4, 0, .4, 0); g.addColorStop(0, col('#c8a060', .95, fg)); g.addColorStop(.6, col('#a07838', .5, fg)); g.addColorStop(1, col('#5a4020', .2, fg));
    ctx.fillStyle = col('#3a2a20', .3, fg); ctx.fillRect(-.06, 0, .12, .12);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-.14, .1); ctx.bezierCurveTo(-.3, .14, -.26, .5, -.4, .74); ctx.lineTo(.4, .74); ctx.bezierCurveTo(.26, .5, .3, .14, .14, .1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(30,20,10,.7)'; ctx.lineWidth = .03; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-.38, .64); ctx.lineTo(.38, .64); ctx.stroke();
    ctx.fillStyle = '#2a2018'; ctx.beginPath(); ctx.arc(-Math.sin(a) * .5 * .2, .78, .06, 0, TAU); ctx.fill(); }
  id(ctx);
  for (const x of [cx - w, cx + w]) fc(ctx, P, [[x - .14, y0 + .45, cz - w - .01], [x + .14, y0 + .45, cz - w - .01], [x + .14, y1, cz - w - .01], [x - .14, y1, cz - w - .01]], [0, 0, -1], stone, fg, 0);
  fc(ctx, P, [[cx - w - .2, y1, cz - w - .2], [cx + w + .2, y1, cz - w - .2], [cx, y1 + 1.0, cz]], [0, .7, -.7], '#5a4a4a', fg, 1);
  const fn = P(cx, y1 + 1.12, cz); ctx.fillStyle = col('#c8a050', .9, fg); ctx.beginPath(); ctx.arc(fn[0], fn[1], Math.max(1.5, .08 * fn[3]), 0, TAU); ctx.fill();
}
function townHall(ctx, P, F) {
  const d = P(1, 8, 33.5)[2]; if (d < .5) return; const fg = fogD(d), stone = '#cfc2a4', dark = '#a89878';
  fc(ctx, P, [[-4.2, TER, 33.3], [6.2, TER, 33.3], [6.2, 4.6, 33.3], [-4.2, 4.6, 33.3]], [0, 0, -1], dark, fg, 1);
  if (F.cam.x < -4) fc(ctx, P, [[-4, 4.6, 40], [-4, 4.6, 33.5], [-4, 10.4, 33.5], [-4, 12.6, 36.75], [-4, 10.4, 40]], [-1, 0, 0], stone, fg, 1);
  if (F.cam.x > 6) fc(ctx, P, [[6, 4.6, 33.5], [6, 4.6, 40], [6, 10.4, 40], [6, 12.6, 36.75], [6, 10.4, 33.5]], [1, 0, 0], stone, fg, 1);
  fc(ctx, P, [[-4, 4.6, 33.5], [6, 4.6, 33.5], [6, 10.4, 33.5], [-4, 10.4, 33.5]], [0, 0, -1], stone, fg, 1);
  for (const x of [-3.2, -2.0, 4.0, 5.2]) archWin(ctx, P, x, 5.5, .75, 2.6, 33.47, fg);
  archWin(ctx, P, 1, 5.3, 1.2, 3.3, 33.47, fg);
  const rs = fc(ctx, P, [[-4.3, 10.3, 33.2], [6.3, 10.3, 33.2], [6.3, 12.6, 36.75], [-4.3, 12.6, 36.75]], [0, .84, -.55], '#4a4a5a', fg, 0); if (rs.length > 2) hatchPoly(ctx, rs, .2, 5, 'rgba(10,8,24,.25)');
  cupola(ctx, P, F, fg);
  for (let k = 0; k < 4; k++) { const zf = 31.5 + .5 * k, yt = TER + .15 * (k + 1);
    fc(ctx, P, [[-1.9, yt, zf], [3.9, yt, zf], [3.9, yt, 33.5], [-1.9, yt, 33.5]], [0, 1, 0], stone, fg, 0, false);
    fc(ctx, P, [[-1.9, yt - .15, zf], [3.9, yt - .15, zf], [3.9, yt, zf], [-1.9, yt, zf]], [0, 0, -1], dark, fg, 0); }
  fc(ctx, P, [[-2.1, 9.55, 33.0], [4.1, 9.55, 33.0], [4.1, 10.35, 33.0], [-2.1, 10.35, 33.0]], [0, 0, -1], stone, fg, 0);
  fc(ctx, P, [[-2.25, 10.35, 32.98], [4.25, 10.35, 32.98], [1, 12.0, 32.98]], [0, 0, -1], stone, fg, 1);
  clock(ctx, P, F, [1, 11.0, 32.95], .46, fg);
  for (const x of [-1.5, .3, 1.7, 3.5]) column(ctx, P, F, x, 33.15, 4.6, 9.55, .2, stone, fg);
  speaker(ctx, P, F); poster(ctx, P, F, fg);
}
function speaker(ctx, P, F) {   // on the top step, turned to the crowd, one hand making her point
  const { t } = F, hip = P(2.6, 4.6 + .876, 33.0); if (hip[2] < .5) return; const ph = Math.sin(TAU * t / 1.7);
  figure(ctx, hip[0], hip[1], hip[3] * FU, { sh: [1.75 + .35 * ph, .45], el: [.55 - .25 * ph, .9], lean: .02, head: -.05 + .04 * Math.sin(t * 1.1), hair: 'bun', skirt: true },
    { t, seed: 11, flip: true, dress: { coat: '#7a3a48', pants: '#2a2230', shoes: '#1a1418', skin: '#c89474', hair: '#3a2420' }, light: { x: F.lp[0], y: F.lp[1], col: F.L.sun, a: .7 }, rim: F.L.sun, rimSide: F.rs, shadow: false });
}
function poster(ctx, P, F, fg) {   // her poster on an easel: a silhouette, no face; a band with a scribble
  ctx.strokeStyle = col('#5a3e2a', .6, fg); ctx.lineWidth = Math.max(1, .04 * P(4.25, 6, 32.85)[3]); ctx.beginPath();
  projLine(ctx, P, [[3.95, 4.6, 32.75], [4.15, 6.6, 32.85]], .3); projLine(ctx, P, [[4.55, 4.6, 32.75], [4.35, 6.6, 32.85]], .3); ctx.stroke();
  if (!plane3(ctx, P, [4.25, 6.0, 32.83], [.36, 0, 0], [0, -.5, 0])) { id(ctx); return; }
  ctx.fillStyle = col('#e6dac0', .9, fg); ctx.fillRect(-1, -1, 2, 2);
  ctx.fillStyle = col('#2a2236', .5, fg); ctx.beginPath(); ctx.arc(0, -.38, .26, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-.62, .32); ctx.quadraticCurveTo(-.55, -.08, 0, -.1); ctx.quadraticCurveTo(.55, -.08, .62, .32); ctx.closePath(); ctx.fill();
  ctx.fillStyle = col('#d88a3a', .9, fg); ctx.fillRect(-1, .45, 2, .3); scribble(ctx, -.7, .6, 1.4, .1, { seed: 5, ink: 'rgba(250,240,220,.9)', lw: .035 });
  ctx.strokeStyle = 'rgba(20,14,20,.6)'; ctx.lineWidth = .03; ctx.strokeRect(-1, -1, 2, 2); id(ctx);
}
const CROWD = [[-2.6, 30.5, 1, '#34405a', '#c8843a', 1.0], [-1.3, 29.7, 2, '#5a3a3a', '#d8c070', .95], [0, 30.7, 3, '#3a4a3a', '#a84a3a', 1.04], [1.2, 29.4, 4, '#4a4a5a', '#c8843a', .9],
  [2.3, 30.3, 5, '#5a4a34', '#6a8ab0', 1.02], [3.6, 29.6, 6, '#2e3a52', '#d8a050', .97], [-.4, 28.7, 7, '#4a3a4a', '#88a060', 1.0], [4.9, 30.6, 8, '#3a3a4a', '#c86a4a', .93]];
function crowd(ctx, P, F) {
  const L = CROWD.map((c) => ({ c, p: P(c[0], TER, c[1]) })).filter((o) => o.p[2] > .5).sort((a, b) => b.p[2] - a.p[2]);
  for (const { c, p } of L) figureBack(ctx, p[0], p[1], p[3] * FU * c[5], { t: F.t, seed: c[2], hold: 'none', accent: c[4], headTilt: -.06, shade: fogD(p[2]) * .5, light: { x: F.lp[0], y: F.lp[1], col: F.L.sun, a: .6 },
    dress: { coat: c[3], pants: '#1e1e2a', shoes: '#141218', skin: ['#c89474', '#8d5f40', '#e0b896'][c[2] % 3], hair: ['#2a1c18', '#4a3020', '#1a1418', '#6a5a4a'][c[2] % 4] } });
}
function barn(ctx, P, F) {
  const d = P(19, 6, 33)[2]; if (d < .5) return; const fg = fogD(d), y0 = TER, y1 = TER + 4.2, yr = y1 + 3.4, zm = 37, red = '#8a3a2c';
  if (F.cam.x < 13) fc(ctx, P, [[13, y0, 41], [13, y0, 33], [13, y1, 33], [13, yr, zm], [13, y1, 41]], [-1, 0, 0], red, fg, 1);
  const fr = fc(ctx, P, [[13, y0, 33], [25, y0, 33], [25, y1, 33], [13, y1, 33]], [0, 0, -1], red, fg, 0);
  if (fr.length > 2) { ctx.save(); polyPath(ctx, fr); ctx.clip(); ctx.strokeStyle = 'rgba(30,10,10,.32)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 13.15; x < 25; x += .3) projLine(ctx, P, [[x, y0, 33], [x, y1, 33]], .3); ctx.stroke(); ctx.restore(); }
  for (const x of [15.2, 22.8]) { const s = projPoly(P, [[x - .5, 6.0, 32.98], [x + .5, 6.0, 32.98], [x + .5, 7.0, 32.98], [x - .5, 7.0, 32.98]], .3); if (s.length < 3) continue;
    polyPath(ctx, s); ctx.fillStyle = col('#1c1a26', .3, fg); ctx.fill(); ctx.strokeStyle = col('#e6dcc8', .85, fg); ctx.lineWidth = 1.6; ctx.stroke(); ctx.beginPath(); projLine(ctx, P, [[x, 6, 32.97], [x, 7, 32.97]], .3); projLine(ctx, P, [[x - .5, 6.5, 32.97], [x + .5, 6.5, 32.97]], .3); ctx.stroke(); }
  const rs = fc(ctx, P, [[12.7, y1 - .1, 32.6], [25.3, y1 - .1, 32.6], [25.3, yr, zm], [12.7, yr, zm]], [0, .76, -.65], '#3e3438', fg, 0); if (rs.length > 2) hatchPoly(ctx, rs, 1.45, 5, 'rgba(10,8,24,.3)');
}
const POSTS = [11, 13, 15, 16.2, 17.8, 19.8, 21.8, 23.8, 25.8, 27];
function fence(ctx, P, F, fg) {
  const z = 31.2, wood = '#6a5038';
  for (let i = 0; i < POSTS.length - 1; i++) { const a = POSTS[i], b = POSTS[i + 1]; if (a === 16.2) continue;
    for (const y of [.55, 1.05]) fc(ctx, P, [[a, TER + y - .06, z], [b, TER + y - .06, z], [b, TER + y + .06, z], [a, TER + y + .06, z]], [0, 0, -1], wood, fg, 0); }
  for (const x of POSTS) { const h = x === 11 ? 1.3 : x === 16.2 ? 2.75 : 1.2, w = x === 11 ? .1 : .07;
    fc(ctx, P, [[x - w, TER, z - .02], [x + w, TER, z - .02], [x + w, TER + h, z - .02], [x - w, TER + h, z - .02]], [0, 0, -1], wood, fg, 0); }
  ctx.strokeStyle = col(wood, .5, fg); ctx.lineWidth = Math.max(1.5, .07 * P(16.6, 6.6, z)[3]); ctx.beginPath();
  projLine(ctx, P, [[16.2, TER + 2.6, z - .03], [17.1, TER + 2.6, z - .03]], .3); projLine(ctx, P, [[16.2, TER + 2.15, z - .03], [16.7, TER + 2.6, z - .03]], .3); ctx.stroke();
  const hk = P(16.95, TER + 2.56, z - .04); ctx.strokeStyle = '#2a2420'; ctx.lineWidth = Math.max(1, .015 * hk[3]); ctx.beginPath(); ctx.arc(hk[0], hk[1] + .02 * hk[3], .025 * hk[3], -Math.PI, .6); ctx.stroke();
}
function pawSign(ctx, P, F, fg) {   // carried up, hooked on "opens", it swings; the painted paw
  const { t, V } = F, hook = [16.95, TER + 2.56, 31.16], up = smr(V.hook - .75, V.hook - .08, t), on = t >= V.hook;
  let ring = on ? hook : [mix(16.75, hook[0], up), mix(TER + 1.5, hook[1] + .05, up), mix(30.95, hook[2], up)];
  if (!on && t > V.hook - .08) ring = [hook[0], hook[1] + .05 - .05 * smo((t - V.hook + .08) / .08), hook[2]];
  F.ring = ring;
  const u = t - V.hook, phi = on ? .3 * Math.exp(-u / 1.3) * Math.sin(TAU * u / .95) : 0;
  if (!plane3(ctx, P, ring, [1, 0, 0], [0, -1, 0])) { id(ctx); return; }
  ctx.rotate(-phi);
  ctx.strokeStyle = 'rgba(40,30,20,.85)'; ctx.lineWidth = .018; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-.34, .14); ctx.moveTo(0, 0); ctx.lineTo(.34, .14); ctx.stroke();
  ctx.fillStyle = col('#5a3a24', .75, fg); ctx.fillRect(-.4, .14, .8, .55); ctx.strokeStyle = col('#e8d8b0', .9, fg); ctx.lineWidth = .025; ctx.strokeRect(-.36, .18, .72, .47);
  ctx.fillStyle = col('#f0c070', 1, fg); ctx.beginPath(); ctx.ellipse(0, .5, .11, .085, 0, 0, TAU); ctx.fill();
  for (const [dx, dy, r] of [[-.12, -.05, .04], [-.045, -.1, .042], [.045, -.1, .042], [.12, -.05, .04]]) { ctx.beginPath(); ctx.ellipse(dx, .44 + dy, r * .85, r, dx * 2, 0, TAU); ctx.fill(); }
  id(ctx);
}
const STAND = { lean: 0, head: 0, hip: [.05, -.05], kn: [0, 0], sh: [.18, .08], el: [.32, .26], dy: 0 };
const KNEEL = { lean: .22, head: .25, hip: [1.5, -.05], kn: [1.5, 1.55], sh: [.4, .2], el: [.5, .4], dy: 42 };
function dogAt(F) { return [18.55, TER, 30.9]; }
function man(ctx, P, F) {   // hangs the sign, walks to the dog, kneels, strokes it
  const { t, V } = F, wk = smr(V.hook + .12, V.kneel, t), x = mix(16.45, 17.62, wk), kn = smr(V.kneel, V.kneel + .5, t);
  const hip = P(x, TER + .876, 30.7); if (hip[2] < .5) return; const s = hip[3] * FU;
  let pose = t < V.hook + .12 ? { ...STAND, head: -.3, lean: -.05 } : t < V.kneel ? walk(TAU * (x - 16.45) / 1.35) : blendP(STAND, KNEEL, kn);
  const o = { t, seed: 7, dress: { coat: '#4a5a3a', pants: '#2a2a34', shoes: '#1a1612', skin: '#b98762', hair: '#3a2a20' }, light: { x: F.lp[0], y: F.lp[1], col: F.L.sun, a: .7 }, rim: F.L.sun, rimSide: F.rs, shadow: false };
  if (t < V.hook + .1 && F.ring) { const a = P(F.ring[0] - .3, F.ring[1] - .3, F.ring[2]), b = P(F.ring[0] + .3, F.ring[1] - .3, F.ring[2]);
    const fa = reachArm(hip[0], hip[1], s, pose, 0, false, o, [b[0], b[1]], 1), ba = reachArm(hip[0], hip[1], s, pose, 1, false, o, [a[0], a[1]], 1); pose = { ...pose, sh: [fa.sh, ba.sh], el: [fa.el, ba.el], lock: [1, 1] }; }
  else if (kn > .6) { const d = dogAt(F), st = (t * 1.1) % 1, tg = P(d[0] - .12 + .22 * smo(st < .7 ? st / .7 : 1 - (st - .7) / .3), d[1] + .5 + .03 * Math.sin(st * TAU), d[2] - .05);
    const fa = reachArm(hip[0], hip[1] + KNEEL.dy * s * kn, s, pose, 0, false, o, [tg[0], tg[1] + KNEEL.dy * s * 0], 1); pose = { ...pose, sh: [fa.sh, pose.sh[1]], el: [fa.el, pose.el[1]], lock: [1, 0] }; }
  figure(ctx, hip[0], hip[1], s, pose, o);
}
function dog(ctx, P, F, fg) {   // side view, facing the man; the tail wags, harder on "wanted"
  const { t, V } = F, [x, y, z] = dogAt(F), g = P(x, y, z); if (g[2] < .5) return; const q = g[3];
  const ph = 1.6 * t + 2.4 * Math.max(0, t - V.wag - .1), amp = mix(.25, .6, smr(V.wag - .1, V.wag + .3, t)), wag = amp * Math.sin(TAU * ph);
  const look = smr(V.kneel, V.kneel + .5, t);
  ctx.save(); ctx.translate(g[0], g[1]); ctx.scale(-q, q);   // facing −x (toward him): mirrored, metres, +y down
  const coat = col('#b88a58', .75, fg), dark = col('#6a4a2c', .4, fg);
  ctx.lineCap = 'round'; ctx.strokeStyle = dark; ctx.lineWidth = .07;
  for (const [lx, ph2] of [[.2, 0], [-.2, 1]]) { ctx.beginPath(); ctx.moveTo(lx - .03, -.34); ctx.lineTo(lx - .02 + .02 * Math.sin(t * 2 + ph2), -.02); ctx.stroke(); }
  ctx.save(); ctx.translate(-.3, -.44); ctx.rotate(-1.0 - wag); ctx.strokeStyle = coat; ctx.lineWidth = .05; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-.05, -.15, .02, -.26); ctx.stroke(); ctx.restore();
  ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(0, -.4, .3, .13, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = coat; ctx.lineWidth = .075; for (const lx of [.16, -.17]) { ctx.beginPath(); ctx.moveTo(lx, -.34); ctx.lineTo(lx + .01, -.02); ctx.stroke(); }
  ctx.save(); ctx.translate(.24, -.48); ctx.rotate(-.35 - .35 * look); ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(.08, -.06, .1, .075, -.3, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(.17, -.04, .07, .045, 0, 0, TAU); ctx.fill(); ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(.03, -.06, .045, .08, .5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1a1210'; ctx.beginPath(); ctx.arc(.23, -.05, .018, 0, TAU); ctx.fill(); ctx.restore();
  ctx.restore();
}
function donkey(ctx, P, F, fg) {   // behind the fence, the head over the top rail, nodding
  const { t } = F, g = P(22.6, TER, 32.0); if (g[2] < .5) return; const q = g[3], nod = .07 * Math.sin(t * 1.3);
  ctx.save(); ctx.translate(g[0], g[1]); ctx.scale(-q, q);
  const coat = col('#7a6e66', .6, fg), pale = col('#d8ccbc', .8, fg), dark = col('#3a3230', .3, fg);
  ctx.strokeStyle = coat; ctx.lineCap = 'round'; ctx.lineWidth = .1; for (const lx of [.38, .28, -.4, -.3]) { ctx.beginPath(); ctx.moveTo(lx, -.85); ctx.lineTo(lx, -.03); ctx.stroke(); }
  ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(0, -.98, .58, .27, 0, 0, TAU); ctx.fill(); ctx.fillStyle = pale; ctx.beginPath(); ctx.ellipse(0, -.82, .4, .1, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(.45, -1.1); ctx.rotate(-.55 + nod);
  ctx.fillStyle = coat; ctx.beginPath(); ctx.moveTo(-.12, .1); ctx.lineTo(.1, .12); ctx.lineTo(.2, -.42); ctx.lineTo(-.02, -.45); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = .05; ctx.beginPath(); ctx.moveTo(-.1, .05); ctx.lineTo(-.02, -.42); ctx.stroke();
  ctx.translate(.08, -.46); ctx.rotate(1.35);
  ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(.18, 0, .27, .11, 0, 0, TAU); ctx.fill(); ctx.fillStyle = pale; ctx.beginPath(); ctx.ellipse(.38, .01, .09, .085, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1a1412'; ctx.beginPath(); ctx.arc(.08, -.04, .02, 0, TAU); ctx.fill();
  for (const [a, d2] of [[-1.9, 0], [-2.15, .04]]) { ctx.save(); ctx.translate(-.02 + d2, -.06); ctx.rotate(a + .1 * Math.sin(t * .9 + d2 * 40)); ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(.15, 0, .17, .045, 0, 0, TAU); ctx.fill(); ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(.28, 0, .05, .03, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.restore(); ctx.restore();
}
function cat(ctx, P, F, fg) {   // on the end post: hind legs, one front leg, the stump where the other was; the tail up
  const { t } = F, g = P(11, TER + 1.3, 31.18); if (g[2] < .5) return; const q = g[3];
  ctx.save(); ctx.translate(g[0], g[1]); ctx.scale(q, q);
  const coat = col('#c8823e', .8, fg), dark = col('#6a3a1c', .35, fg); ctx.lineCap = 'round';
  ctx.save(); ctx.translate(-.17, -.2); ctx.rotate(-.4 + .2 * Math.sin(t * 1.1)); ctx.strokeStyle = coat; ctx.lineWidth = .04; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-.08, -.12, .02, -.2, -.04, -.3); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = dark; ctx.lineWidth = .045; ctx.beginPath(); ctx.moveTo(-.1, -.12); ctx.lineTo(-.13, 0); ctx.stroke();
  ctx.strokeStyle = coat; ctx.beginPath(); ctx.moveTo(-.14, -.12); ctx.lineTo(-.16, 0); ctx.moveTo(.1, -.13); ctx.lineTo(.07, 0); ctx.stroke();
  ctx.lineWidth = .05; ctx.beginPath(); ctx.moveTo(.16, -.13); ctx.lineTo(.18, -.08); ctx.stroke();
  ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(0, -.17, .19, .075, -.05, 0, TAU); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = .018; ctx.beginPath(); for (const sx of [-.1, -.03, .04]) { ctx.moveTo(sx, -.235); ctx.lineTo(sx + .02, -.15); } ctx.stroke();
  ctx.fillStyle = coat; ctx.beginPath(); ctx.arc(.2, -.25, .065, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(.16, -.29); ctx.lineTo(.17, -.35); ctx.lineTo(.2, -.3); ctx.moveTo(.22, -.3); ctx.lineTo(.25, -.35); ctx.lineTo(.26, -.28); ctx.fill();
  ctx.restore();
}
function terrace(ctx, P, F) {   // the road, the square, the buildings far to near, the yard, the crowd
  const fg0 = fogD(dFar(F.cam, 30));
  { const s = projPoly(P, [[-70, TER + .005, 28.6], [90, TER + .005, 28.6], [90, TER + .005, 30.4], [-70, TER + .005, 30.4]], .3); if (s.length > 2) { polyPath(ctx, s); ctx.fillStyle = col('#7a6a50', kN([0, 1, 0]), fg0); ctx.fill(); } }
  { const s = projPoly(P, [[-4.6, TER + .008, 30.4], [6.6, TER + .008, 30.4], [6.6, TER + .008, 33.3], [-4.6, TER + .008, 33.3]], .3); if (s.length > 2) { polyPath(ctx, s); ctx.fillStyle = col('#6e6658', kN([0, 1, 0]), fg0); ctx.fill(); hatchPoly(ctx, s, .7, 6, 'rgba(20,16,20,.18)'); hatchPoly(ctx, s, -.7, 6, 'rgba(20,16,20,.18)'); } }
  treesOf(ctx, P, F, 'b');
  const B = [...HOUSES.map((h) => ({ d: P((h[0] + h[1]) / 2, TER + 2, h[2])[2], f: () => house(ctx, P, F, h) })), { d: P(1, 7, 33.5)[2], f: () => townHall(ctx, P, F) }, { d: P(19, 6, 33)[2], f: () => barn(ctx, P, F) }];
  for (const b of B.sort((a, c) => c.d - a.d)) if (b.d > .5) b.f();
  const fg = fogD(P(18, 5, 31)[2]);
  donkey(ctx, P, F, fg); fence(ctx, P, F, fg); cat(ctx, P, F, fg); pawSign(ctx, P, F, fg); dog(ctx, P, F, fg); man(ctx, P, F);
  crowd(ctx, P, F);
}
function swimSign(ctx, P, F) {   // the old swimming sign by the swing; sinks into the silt on "paid"; years later a new one stands there
  const { t, V } = F, x = 21.4, z = zN(21.4) - .85, g = gN(x, z), old = t < V.s4e;
  const sink = old ? 1.15 * smr(V.sign, V.sign + 1.6, t) : 0, tilt = old ? .38 * smr(V.sign - .1, V.sign + 1.3, t) : 0;
  const base = P(x, g, z); if (base[2] < .5) return; const q = base[3], fg = fogD(base[2]);
  const up = [0, Math.cos(tilt), Math.sin(tilt)], ux = [.66, 0, -.75], at = (k) => [x + up[0] * k, g + up[1] * k, z + up[2] * k];
  ctx.save(); ctx.beginPath(); ctx.rect(0, -10, W, base[1] + 10 + .02 * q); ctx.clip();
  const p0 = P(...at(-sink)), p1 = P(...at(1.95 - sink)); ctx.strokeStyle = col('#4a3a2c', .4, fg); ctx.lineWidth = Math.max(1.5, .07 * q); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
  if (plane3(ctx, P, at(1.55 - sink), ux.map((v) => v * .5), up.map((v) => v * -.35))) {
    ctx.fillStyle = col(old ? '#cfc6b0' : '#ece8dc', .85, fg); ctx.fillRect(-1, -1, 2, 2);
    ctx.strokeStyle = col('#2a4a7a', .8, fg); ctx.lineWidth = .09; ctx.strokeRect(-.9, -.86, 1.8, 1.72);
    ctx.fillStyle = col('#2a4a7a', .8, fg); ctx.beginPath(); ctx.arc(.42, -.36, .15, 0, TAU); ctx.fill();
    ctx.lineWidth = .14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-.55, -.02); ctx.quadraticCurveTo(-.1, -.3, .25, -.18); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-.2, -.2); ctx.quadraticCurveTo(0, -.6, .3, -.55); ctx.stroke();
    ctx.lineWidth = .08; for (const y of [.3, .55]) { ctx.beginPath(); for (let i = 0; i <= 16; i++) { const xx = -.75 + i * .095; i ? ctx.lineTo(xx, y + .07 * Math.sin(i * 1.4)) : ctx.moveTo(xx, y); } ctx.stroke(); }
    if (old) { ctx.fillStyle = 'rgba(110,60,30,.45)'; const r = prng(8); for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc(r() * 1.9 - .95, r() * 1.8 - .9, .03 + r() * .08, 0, TAU); ctx.fill(); } }
  }
  id(ctx); ctx.restore();
  if (sink > .02) { ctx.fillStyle = col('#2e2a1e', .3, fg); ctx.beginPath(); ctx.ellipse(base[0], base[1], .3 * q, .07 * q, 0, 0, TAU); ctx.fill(); }
}

// ---------------------------------------------------------------- the take
export function valleyTake(ctx, t, K) {
  const V = vOf(K);
  if (t >= V.tilt1) { skyPlateAt(ctx, t); return; }   // the camera has arrived: the frame is the c13>c14 plate
  const cam = valleyCam(t, K), P = pin(cam), L = lightAt(t, V);
  LA = hex2rgb(L.amb); LS = hex2rgb(L.sun); LK = L.k; FOG = hex2rgb(L.sky[1]); DIR = L.dir;
  const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const R = [cy, 0, -sy], U = [-sy * sp, cp, -cy * sp], Fw = [sy * cp, sp, cy * cp], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const lx = dot(DIR, R), ly = -dot(DIR, U), ln = Math.hypot(lx, ly) || 1;
  const F = { t, K, V, cam, L, ls: [lx / ln, ly / ln], lp: [W / 2 + lx * 3000, H / 2 + ly * 3000], rs: lx >= 0 ? 1 : -1, front: -dot(DIR, Fw) };
  id(ctx); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  sky(ctx, P, F);
  hills(ctx, P, F);
  band(ctx, P, LN.f4, LN.f3, '#5a6236', [0, .99, -.1], fogD(dFar(cam, 70)), [-.15, 9, 'rgba(20,24,10,.16)']);
  band(ctx, P, LN.f3, LN.f2, '#62683c', [0, 1, 0], fogD(dFar(cam, 36)));
  terrace(ctx, P, F);
  band(ctx, P, LN.f2, LN.f1, '#56663a', [0, .93, -.36], fogD(dFar(cam, 20)), [-1.2, 6, 'rgba(10,14,20,.12)']);
  band(ctx, P, LN.f1, LN.f0, '#4c5032', [0, .8, -.6], fogD(dFar(cam, 15)));
  treesOf(ctx, P, F, 'm');
  water(ctx, P, F);
  reeds(ctx, P, F, 1);
  sensors(ctx, P, F);
  splash(ctx, P, F);
  boat(ctx, P, F);
  band(ctx, P, LN.n0, LN.n1, '#4a4a30', [0, .7, .7], 0, [1.2, 5, 'rgba(10,8,20,.18)']);
  band(ctx, P, LN.n1, LN.n2, '#56643a', [0, .99, .1], 0, [-1.2, 7, 'rgba(10,14,20,.1)']);
  band(ctx, P, LN.n2, LN.n3, '#525e38', [0, .99, .05], fogD(dFar(cam, -20)));
  band(ctx, P, LN.n3, LN.n4, '#4a5434', [0, .95, .3], fogD(dFar(cam, -70)));
  treesOf(ctx, P, F, 'n');
  swingTree(ctx, P, F);
  rope(ctx, P, F);
  swingKid(ctx, P, F);
  bankKid(ctx, P, F);
  swimSign(ctx, P, F);
  reeds(ctx, P, F, -1);
  id(ctx);
}
export function warmValley(K) { vOf(K); }
