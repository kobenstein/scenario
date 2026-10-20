// c13 (Film 4 v2) · TAKE 1 · THE ROAD (H.b 371.89 → the cut into the kitchen light ~380.2). Owner: c13.
// The amber line of the c12>c13 plate is the reflector edge of a barrier boom on a hill road at dawn. The camera pulls back 5.5× out
// of the line (the world rises out of the dark from the line outward), the latch drops on "catch", the boom rises on "nothing",
// the camera glides down the road past the toll gate ("money": its arm lifts by itself, the coin basket stays empty) and the permit
// booth ("permission": the shutter rolls up, nobody inside, the form blank), the sun rises behind you: the ridge's shadow runs up the
// road toward the camera and your long shadow lies on the empty road ("you"); then the camera flies into the one lit window of the
// house at the bend, whose light fills the frame (lightFill, shared with the kitchen take).
//   roadTake(ctx, t, K)   K = { b0, catch, nothing, money, permission, you2, sun0, push0, cut }
//   lightFill(ctx, t, o)  the warm light that fills the frame between the road and the kitchen ({ cx, cy, R })
//   warmRoad()            builds the cached layers (call once before ready())
import { W, H, rgba, clamp, mix, prng, canvas, text } from '../engine.mjs';
import { pin, once, onceRaw, toImg, best, quadSprite, polyPath, lineGround, lineStroke, pal, mixHex, eoX, eiX, qio, cio, smo, smr, bump, mono, scratchLayer, planeXY, stip, TAU } from './v2_c13_kit.mjs';
import { vnoise, fbm } from './art.mjs';

const P0 = -.113, F0 = 1150, SLOPE = .1;
export const gY = (Z) => -SLOPE * Z;                               // the hill road falls 10 % toward the valley
const roadX = (Z) => (Z < 72 ? 0 : (Z - 72) ** 2 * .035);          // straight, then it bends right and drops over the edge
const RW = 2.8;                                                    // half width of the tarmac
const EDGE = [[24, -4], [20.2, 18], [17.4, 38], [14.6, 58], [11.8, 78], [9.6, 92], [6.5, 100], [2, 104], [-6, 107], [-20, 110], [-45, 113], [-90, 117]];
const LEFT = -90;
// props (metres): barrier at Z 12, toll gate at Z 25, permit booth at Z 38, the house at the bend at Z 82
const BZ = 12, PIV = [-3.6, 1.0], BLEN = 7.4;
const TOLL = { x0: 4.2, x1: 6.4, z0: 25, z1: 26.8, h: 2.5, armX: 3.7, armZ: 24.7, armLen: 6.5, basX: 3.15, basZ: 23.6 };
const PERM = { x0: -5.0, x1: -3.4, z0: 38, z1: 39.6, h: 2.4, peak: 3.15, win: [-4.78, -3.62, 1.02, 1.7] };
const HOUSE = { x0: -7.5, x1: -1.8, z0: 82, z1: 88, y: gY(82), h: 3.0, peak: 5.3 };
export const WIN = { x: -4.0, y: HOUSE.y + 1.5, z: HOUSE.z0, hw: .5, hh: .48 };   // the lit kitchen pane (centre, half sizes)
const SUN = '#ffc98e', SUNHOT = '#ffe2b8';

// ---------------------------------------------------------------- light over time
// D: night → dawn → sunrise (sky, ground, mist), the ridge behind you holds the near road in shadow until the sun clears it
const dawnOf = (t, K) => clamp(1 - Math.pow(1 - smr(K.b0 - 1.2, K.you2 + .2, t), 1.35));
const ZR = 44 - 250, HR = 18;                                      // the ridge behind the camera: at Z = -206, 18 m high
function sunE(t, K) {                                              // sun elevation (rad): rises steadily, slows after it clears the ridge
  const e0 = Math.atan(HR / (440 - ZR)), e1 = Math.atan(HR / (44 - ZR)), u = (t - K.sun0) / (K.you2 - K.sun0);
  const g = u <= 1 ? u : 1 + (1 - Math.exp(-(u - 1) * 4)) / 4;
  return e0 + (e1 - e0) * g;
}
const frontZ = (t, K) => (t < K.sun0 ? 1e6 : ZR + HR / Math.tan(sunE(t, K)));          // the ridge shadow's edge on the ground
const litAt = (t, K, Z, h) => (t < K.sun0 - .4 ? 0 : smo(((Z - (ZR + (HR - h) / Math.tan(sunE(t, K))))) / 3 + .5));  // a point at Z, height h
const SAZ = .12;                                                   // shadows run down the road and a little to the right

// ---------------------------------------------------------------- the camera
let _K = null, CZ, CX, YAW, EYE;
function paths(K) {
  if (_K === K) return; _K = K;
  CZ = mono([[K.b0 + 1.5, 0], [K.nothing + .45, 1.0], [K.money - .1, 12.5], [K.permission - .05, 24.5], [K.permission + .65, 29.5], [K.you2 + .04, 44]]);
  CX = mono([[K.nothing + .5, 0], [K.money, .3], [K.permission - .3, -1.0], [K.permission + .5, -1.5], [K.you2, -.45]]);
  YAW = mono([[K.permission - .75, 0], [K.permission - .02, -.25], [K.permission + .6, -.25], [K.you2 - .1, 0]]);
  EYE = mono([[K.nothing + .5, 2.2], [K.permission + .2, 1.7]]);
}
function baseCam(t, K) {
  paths(K);
  const z = CZ(t), x = CX(t);
  return { x, y: gY(z) + EYE(t), z, yaw: YAW(t), pitch: P0, f: F0 };
}
export function roadCam(t, K) {
  const c = baseCam(Math.min(t, K.push0), K);
  if (t < K.b0 + 1.6) {                                            // the pull-back out of the line: 5.5× → 1× about the boom's top edge
    const u = qio((t - K.b0 - .06) / 1.42), P = pin(c), [, by] = P(0, gY(BZ) + 1.06, BZ), z = Math.exp(Math.log(5.5) * (1 - u));
    const ay = mix(600, by, u);
    return { ...c, f: c.f * z, ox: W / 2, oy: ay + (H / 2 - by) * z, _ay: ay, _z: z };
  }
  if (t > K.push0) {                                               // the fly into the lit window: exponential approach, aim settles on the pane
    const u = clamp((t - K.push0) / (K.cut - K.push0)), E = qio(u);
    const dx = WIN.x - c.x, dy = WIN.y - c.y, dz = WIN.z - c.z, d0 = Math.hypot(dx, dy, dz), d1 = .3, d = d0 * Math.pow(d1 / d0, E), k = 1 - d / d0;
    const ay = Math.atan2(dx, dz), ap = Math.atan2(dy, Math.hypot(dx, dz)), w = smo(clamp(E * 1.7));
    return { x: c.x + dx * k, y: c.y + dy * k, z: c.z + dz * k, yaw: mix(c.yaw, ay, w), pitch: mix(c.pitch, ap, w), f: F0, _d: d };
  }
  return c;
}

// ---------------------------------------------------------------- projection helpers
const camOf = (o) => { const cy = Math.cos(o.yaw || 0), sy = Math.sin(o.yaw || 0), cp = Math.cos(o.pitch || 0), sp = Math.sin(o.pitch || 0);
  return ([X, Y, Z]) => { const dx = X - o.x, dy = Y - o.y, dz = Z - o.z, xc = dx * cy - dz * sy, zc0 = dx * sy + dz * cy; return [xc, dy * cp - zc0 * sp, dy * sp + zc0 * cp]; }; };
// project a world polygon, clipped at the near plane (Sutherland–Hodgman on z = zn)
function projPoly(P, pts, zn = .35) {
  const o = P.o, cam = camOf(o), C = pts.map(cam), out = [], F = P.F, ox = o.ox ?? W / 2, oy = o.oy ?? H / 2;
  for (let i = 0; i < C.length; i++) {
    const a = C[i], b = C[(i + 1) % C.length], ia = a[2] >= zn, ib = b[2] >= zn;
    if (ia) out.push(a);
    if (ia !== ib) { const k = (zn - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, zn]); }
  }
  return out.map(([x, y, z]) => [ox + x * F / z, oy - y * F / z]);
}
function projSeg(P, A, B, zn = .35) {
  const o = P.o, cam = camOf(o), a = cam(A), b = cam(B), F = P.F, ox = o.ox ?? W / 2, oy = o.oy ?? H / 2;
  if (a[2] < zn && b[2] < zn) return null;
  const cl = (p, q) => { if (p[2] >= zn) return p; const k = (zn - p[2]) / (q[2] - p[2]); return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, zn]; };
  const a2 = cl(a, b), b2 = cl(b, a);
  return [[ox + a2[0] * F / a2[2], oy - a2[1] * F / a2[2]], [ox + b2[0] * F / b2[2], oy - b2[1] * F / b2[2]]];
}
const fillPoly = (ctx, pts, fill) => { if (pts.length < 3) return; polyPath(ctx, pts); ctx.fillStyle = fill; ctx.fill(); };
const id = (ctx) => ctx.setTransform(1, 0, 0, 1, 0, 0);
// edge X of the plateau at depth Z (interpolated along EDGE)
function edgeAt(Z) { for (let i = 1; i < EDGE.length; i++) if (Z <= EDGE[i][1]) { const [x0, z0] = EDGE[i - 1], [x1, z1] = EDGE[i]; return mix(x0, x1, clamp((Z - z0) / (z1 - z0))); } return EDGE[EDGE.length - 1][0]; }
// the plateau surface from depth Zn on (world polygon on the sloping plane)
function plateau(Zn) {
  const pts = [[LEFT, gY(Zn), Zn], [edgeAt(Zn), gY(Zn), Zn]];
  for (const [x, z] of EDGE) if (z > Zn) pts.push([x, gY(z), z]);
  pts.push([LEFT, gY(117), 117]); return pts;
}
function roadPoly(Zn, Z1 = 92) {
  const L = [], R = [], zs = [Zn]; for (let z = Math.max(72, Math.ceil(Zn)); z <= Z1; z += 2) if (z > Zn) zs.push(z);
  if (Zn < 72) zs.splice(1, 0, 72);
  zs.sort((a, b) => a - b);
  for (const z of zs) { const c = roadX(z), sl = z > 72 ? Math.atan(2 * .035 * (z - 72)) : 0, w = RW / Math.cos(sl); L.push([c - w, gY(z), z]); R.push([c + w, gY(z), z]); }
  return [...L, ...R.reverse()];
}

// ---------------------------------------------------------------- the far valley (one cached backdrop in tangent space: a = X/Z, b = Y/Z)
const FI = { F: 1600, AL: -1.45, AR: 1.25, BB: -.21, BT: .125 };
FI.W = Math.round((FI.AR - FI.AL) * FI.F); FI.H = Math.round((FI.BT - FI.BB) * FI.F);
const fu = (a) => (a - FI.AL) * FI.F, fv = (b) => (FI.BT - b) * FI.F;
function ridge(seed, base, amp, fr, peaks = []) {
  const n = vnoise(seed);
  return (a) => { let b = base + amp * (fbm(n, a * fr + seed * .37, .7, 5) - .45); for (const [pa, pw, ph] of peaks) b += ph * Math.exp(-(((a - pa) / pw) ** 2)); return b; };
}
const R1 = ridge(11, .036, .05, 2.4, [[-.42, .22, .03], [.62, .3, .018]]);
const R2 = ridge(23, .014, .034, 4.1, [[.95, .25, .03], [-1.1, .3, .04]]);
// valley floor plane 108 m below the road's start: b = -108 / Zd ; the river and the town
const VFY = -108;
const riverX = (Zd) => -260 + 210 * Math.sin(Zd / 520 + .6) + 90 * Math.sin(Zd / 190 + 2.1) + .05 * Zd;
function farLayers() {
  return once('c13road_far', () => {
    const [c, g] = canvas(FI.W, FI.H), r = prng(808), n = vnoise(5);
    const ridgeFill = (Rf, col, colLo, seed) => {
      g.beginPath(); g.moveTo(0, FI.H);
      for (let x = 0; x <= FI.W; x += 4) g.lineTo(x, fv(Rf(FI.AL + x / FI.F)));
      g.lineTo(FI.W, FI.H); g.closePath();
      const lg = g.createLinearGradient(0, fv(.08), 0, fv(-.06)); lg.addColorStop(0, col); lg.addColorStop(1, colLo); g.fillStyle = lg; g.fill();
      // engraved slope hatching (strokes running down the fall line), denser in the shade
      g.save(); g.clip(); g.strokeStyle = 'rgba(20,22,52,.32)'; g.lineWidth = 1.1; g.beginPath();
      const rr = prng(seed);
      for (let x = 0; x < FI.W; x += 5 + rr() * 4) { const a = FI.AL + x / FI.F, b0 = Rf(a), b1 = Rf(a + .004), sl = (b1 - b0) / .004, y0 = fv(b0) + 3 + rr() * 6, L = 14 + rr() * 40;
        if (sl > -.05) { g.moveTo(x, y0); g.lineTo(x - 4 - sl * 30, y0 + L); } }
      g.stroke(); g.restore();
    };
    ridgeFill(R1, '#7a7fa8', '#5e638e', 3);
    ridgeFill(R2, '#5a6190', '#454c7a', 4);
    // the valley floor: a band of fields under haze, the river, the town (with its hall tower), hedges
    const fy = (Zd) => fv(VFY / Zd), fx = (X, Zd) => fu(X / Zd);
    g.save(); g.beginPath(); g.moveTo(0, FI.H); for (let x = 0; x <= FI.W; x += 4) g.lineTo(x, fv(R2(FI.AL + x / FI.F)) + 2); g.lineTo(FI.W, FI.H); g.closePath(); g.clip();
    { const lg = g.createLinearGradient(0, fy(4000), 0, FI.H); lg.addColorStop(0, '#5c6492'); lg.addColorStop(.35, '#465080'); lg.addColorStop(1, '#2a3060'); g.fillStyle = lg; g.fillRect(0, fy(6000), FI.W, FI.H); }
    // field patches: rows of hatch in perspective (each patch a quad on the valley floor)
    for (let Zd = 700; Zd < 5200; Zd *= 1.13) {
      const z2 = Zd * 1.13, y0 = fy(Zd), y1 = fy(z2);
      for (let X = -4200; X < 4200;) {
        const w = 120 + r() * 260, a = (X < riverX(Zd) ? 1 : -1);
        const q = [[fx(X, Zd), y0], [fx(X + w, Zd), y0], [fx(X + w, z2), y1], [fx(X, z2), y1]];
        const tone = r(); g.fillStyle = tone < .33 ? 'rgba(96,108,140,.35)' : tone < .66 ? 'rgba(60,70,110,.35)' : 'rgba(120,128,150,.25)'; polyPath(g, q); g.fill();
        if (r() < .7) { g.save(); polyPath(g, q); g.clip(); g.strokeStyle = 'rgba(25,28,60,.28)'; g.lineWidth = .9; g.beginPath(); const k = 4 + Math.floor(r() * 5), sl = (r() - .5) * 1.6;
          for (let j = 0; j < 30; j++) { const xx = mix(q[0][0], q[1][0], j / 30); g.moveTo(xx, y0 + 1); g.lineTo(xx + sl * (y0 - y1) + (fx(X + w * j / 30, z2) - fx(X + w * j / 30, Zd)), y1); } g.stroke(); g.restore(); }
        // hedge line along the patch edge
        g.strokeStyle = 'rgba(22,26,52,.55)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(q[0][0], q[0][1]); g.lineTo(q[3][0], q[3][1]); g.stroke();
        X += w + 10 + r() * 30; if (a) { /* keep */ }
      }
    }
    // the river: a pale ribbon with bright glints, wider near
    { const pts = []; for (let Zd = 620; Zd < 9000; Zd *= 1.02) pts.push([fx(riverX(Zd), Zd), fy(Zd), 26 / Zd * FI.F]);
      for (const [col, k] of [['rgba(40,48,90,.8)', 1.6], ['#8fa0c8', 1.0], ['#c7d2e8', .45]]) { g.strokeStyle = col; g.lineCap = 'round';
        for (let i = 1; i < pts.length; i++) { g.lineWidth = Math.max(.8, pts[i][2] * k); g.beginPath(); g.moveTo(pts[i - 1][0], pts[i - 1][1]); g.lineTo(pts[i][0], pts[i][1]); g.stroke(); } } }
    // the town on the far terrace right of the river: roofs, gables, one hall tower with a clock; lamp-lit windows
    const town = [];
    for (let i = 0; i < 70; i++) { const Zd = 1150 + r() * 650, X = 160 + r() * 520 + (Zd - 1150) * .2; town.push([X, Zd]); }
    town.sort((p, q) => q[1] - p[1]);
    for (const [X, Zd] of town) {
      const x = fx(X, Zd), y = fy(Zd), s = FI.F / Zd, w = (9 + r() * 7) * s, h = (6 + r() * 4) * s, rh = (4 + r() * 3) * s;
      g.fillStyle = r() < .5 ? '#6e7598' : '#5d6488'; g.fillRect(x - w / 2, y - h, w, h);
      g.fillStyle = r() < .5 ? '#3a3f66' : '#4a3f5e'; g.beginPath(); g.moveTo(x - w / 2 - 1, y - h); g.lineTo(x, y - h - rh); g.lineTo(x + w / 2 + 1, y - h); g.closePath(); g.fill();
      if (r() < .3) { g.fillStyle = 'rgba(255,190,110,.75)'; g.fillRect(x - w * .2, y - h * .6, Math.max(1, w * .14), Math.max(1, h * .2)); }
    }
    { const Zd = 1420, X = 420, x = fx(X, Zd), y = fy(Zd), s = FI.F / Zd;      // the town hall tower
      g.fillStyle = '#767c9e'; g.fillRect(x - 4 * s, y - 34 * s, 8 * s, 34 * s); g.fillStyle = '#3a3f66'; g.beginPath(); g.moveTo(x - 5 * s, y - 34 * s); g.lineTo(x, y - 44 * s); g.lineTo(x + 5 * s, y - 34 * s); g.closePath(); g.fill();
      g.fillStyle = '#d9d4c4'; g.beginPath(); g.arc(x, y - 28 * s, 2.2 * s, 0, TAU); g.fill(); }
    g.restore();
    // mist lying in the valley: soft pale bands, stippled
    { const [mc, mg] = canvas(FI.W, FI.H);
      for (let k = 0; k < 9; k++) { const Zd = 900 + k * 420, y = fy(Zd), hh = 9 + 16 * r(), lg = mg.createLinearGradient(0, y - hh * 2, 0, y + hh * 2.4);
        lg.addColorStop(0, 'rgba(176,186,214,0)'); lg.addColorStop(.45, `rgba(176,186,214,${.28 + .2 * r()})`); lg.addColorStop(1, 'rgba(176,186,214,0)');
        mg.fillStyle = lg; mg.fillRect(0, y - hh * 2, FI.W, hh * 4.4); }
      for (let x = 0; x < FI.W; x += 2) { const v = fbm(n, x * .004, .3, 3); if (v < .45) { mg.globalCompositeOperation = 'destination-out'; mg.fillStyle = `rgba(0,0,0,${(.45 - v) * 2.2})`; mg.fillRect(x, 0, 2, FI.H); mg.globalCompositeOperation = 'source-over'; } }
      stip(mc, .7, 9); g.drawImage(mc, 0, 0); }
    return c;
  });
}
// the same backdrop as one dark silhouette (night: drawn over it with alpha = how dark it still is: rising out of the dark)
function farDark() {
  return once('c13road_fardark', () => { const src = farLayers(), [c, g] = canvas(FI.W, FI.H); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#080a1e'; g.fillRect(0, 0, FI.W, FI.H); return c; });
}
// the alpenglow: the far ridges and the town catch the sun before you do (drawn 'lighter', alpha = how much sun reaches them)
function farLit() {
  return once('c13road_farlit', () => {
    const [c, g] = canvas(FI.W, FI.H);
    for (const [Rf, a, d] of [[R1, .55, 34], [R2, .4, 26]]) {
      g.beginPath(); g.moveTo(0, FI.H); for (let x = 0; x <= FI.W; x += 4) g.lineTo(x, fv(Rf(FI.AL + x / FI.F))); g.lineTo(FI.W, FI.H); g.closePath();
      g.save(); g.clip();
      for (let x = 0; x < FI.W; x += 3) { const y = fv(Rf(FI.AL + x / FI.F)), lg = g.createLinearGradient(0, y, 0, y + d); lg.addColorStop(0, `rgba(255,190,140,${a})`); lg.addColorStop(1, 'rgba(255,190,140,0)'); g.fillStyle = lg; g.fillRect(x, y, 3, d); }
      g.restore();
      g.strokeStyle = 'rgba(255,214,170,.8)'; g.lineWidth = 1.3; g.beginPath(); for (let x = 0; x <= FI.W; x += 4) { const y = fv(Rf(FI.AL + x / FI.F)); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    }
    stip(c, .6, 12);
    return c;
  });
}
// ---------------------------------------------------------------- sky
const STARS = (() => { const r = prng(77), s = []; for (let i = 0; i < 160; i++) s.push([(r() - .5) * 2.6, .05 + Math.pow(r(), .7) * .7, .5 + r() * 1.2, r() * TAU]); return s; })();
function drawSky(ctx, P, t, D) {
  const o = P.o, F = P.F, oy = o.oy ?? H / 2, ys = (e) => oy - F * Math.tan(e - o.pitch);
  const C = {
    hz: pal(D, [[0, '#2b2d58'], [.45, '#5d5d8a'], [.8, '#a497ae'], [1, '#d4bdb4']]),
    es: pal(D, [[0, '#24285a'], [.45, '#4d5684'], [.8, '#7f86aa'], [1, '#a9a8bf']]),
    bv: pal(D, [[0, '#1f2352'], [.45, '#76668f'], [.8, '#c19aa6'], [1, '#d9b9b0']]),
    m: pal(D, [[0, '#171b46'], [.45, '#3c4980'], [.8, '#7a8cb8'], [1, '#99abcc']]),
    hi: pal(D, [[0, '#0f1338'], [.45, '#283468'], [.8, '#516c9f'], [1, '#6b88b6']]),
    top: pal(D, [[0, '#0b0e2c'], [.45, '#1b2452'], [.8, '#384f83'], [1, '#4b6598']]),
  };
  const y0 = ys(.75), y1 = ys(0), L = y1 - y0, st = (e) => clamp((ys(e) - y0) / L);
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, C.top); g.addColorStop(st(.34), C.hi); g.addColorStop(st(.15), C.m); g.addColorStop(st(.065), C.bv); g.addColorStop(st(.025), C.es); g.addColorStop(1, C.hz);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const sa = clamp(1 - D * 1.5); if (sa > 0) {
    for (const [a, e, s, ph] of STARS) { const x = (o.ox ?? W / 2) + F * Math.tan(a - (o.yaw || 0)), y = ys(e); if (x < -5 || x > W + 5 || y < -5 || y > H) continue;
      ctx.fillStyle = `rgba(243,239,226,${sa * (.45 + .4 * Math.sin(t * 1.3 + ph))})`; ctx.beginPath(); ctx.arc(x, y, s * Math.min(2, F / F0) ** .3, 0, TAU); ctx.fill(); }
  }
  // thin stratus streaks, their undersides catching the dawn
  const cl = clouds();
  for (const [a, e, w, k] of [[-.55, .2, .5, 0], [.2, .27, .62, 1], [.7, .14, .42, 2], [-.15, .1, .36, 1]]) {
    const x = (o.ox ?? W / 2) + F * Math.tan(a + t * .0016 - (o.yaw || 0)), y = ys(e), ww = F * w, hh = ww * .1;
    if (x + ww < 0 || x - ww > W || y < -hh || y > H + hh) continue;
    ctx.save(); ctx.globalAlpha = .55 + .2 * D; ctx.drawImage(cl[k], x - ww / 2, y - hh / 2, ww, hh); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(D * 1.2 - .15) * .6; ctx.drawImage(cl[3 + k], x - ww / 2, y - hh / 2, ww, hh); ctx.restore();
  }
}
function clouds() {
  return onceRaw('c13road_clouds', () => {
    const out = [];
    for (let k = 0; k < 6; k++) {
      const [c, g] = canvas(900, 90), r = prng(31 + (k % 3) * 7), n = vnoise(40 + (k % 3));
      for (let i = 0; i < 26; i++) { const x = 60 + r() * 780, y = 38 + (r() - .5) * 30, w = 120 + r() * 260, h = 6 + r() * 12;
        const lg = g.createLinearGradient(0, y - h, 0, y + h); if (k < 3) { lg.addColorStop(0, 'rgba(120,124,170,0)'); lg.addColorStop(.4, 'rgba(120,124,170,.35)'); lg.addColorStop(1, 'rgba(70,74,120,0)'); }
        else { lg.addColorStop(0, 'rgba(255,170,150,0)'); lg.addColorStop(.6, 'rgba(255,170,150,.0)'); lg.addColorStop(.85, 'rgba(255,190,160,.55)'); lg.addColorStop(1, 'rgba(255,190,160,0)'); }
        g.fillStyle = lg; g.beginPath(); g.ellipse(x, y, w / 2, h, 0, 0, TAU); g.fill(); }
      const d = g.getImageData(0, 0, 900, 90), p = d.data; for (let y = 0; y < 90; y++) for (let x = 0; x < 900; x++) { const i = (y * 900 + x) * 4 + 3, f = fbm(n, x * .012, y * .05, 3); p[i] *= clamp((f - .3) * 2.4) * clamp(Math.min(x, 900 - x) / 140); }
      g.putImageData(d, 0, 0); stip(c, .6, k + 3); out.push(c);
    }
    return out.map(toImg);
  }).map(best);
}

// ---------------------------------------------------------------- trees (cached engraved sprites; base at the bottom centre)
function treeSprite(k) {
  return once('c13road_tree' + k, () => {
    const Wt = 300, Ht = 380, [c, g] = canvas(Wt, Ht), r = prng(91 + k * 13), n = vnoise(60 + k);
    // trunk
    g.fillStyle = '#2b2630'; g.beginPath(); g.moveTo(Wt / 2 - 9, Ht); g.quadraticCurveTo(Wt / 2 - 6, Ht - 90, Wt / 2 - 3 + (r() - .5) * 10, Ht - 170); g.lineTo(Wt / 2 + 5, Ht - 170); g.quadraticCurveTo(Wt / 2 + 6, Ht - 90, Wt / 2 + 10, Ht); g.closePath(); g.fill();
    // crown: overlapping lobes, dark below, lighter on top (sky light), engraved hatch inside
    const lobes = []; for (let i = 0; i < 16; i++) { const a = r() * TAU, d = r() * 70; lobes.push([Wt / 2 + Math.cos(a) * d * 1.3, Ht - 230 + Math.sin(a) * d * .9, 40 + r() * 40]); }
    lobes.sort((p, q) => p[1] - q[1]);
    for (const [x, y, rr] of lobes) { const lg = g.createLinearGradient(0, y - rr, 0, y + rr); lg.addColorStop(0, '#3e5168'); lg.addColorStop(.5, '#253447'); lg.addColorStop(1, '#151d2c'); g.fillStyle = lg; g.beginPath();
      for (let j = 0; j <= 24; j++) { const a = j / 24 * TAU, rad = rr * (.86 + .22 * fbm(n, Math.cos(a) * 2 + x * .01, Math.sin(a) * 2 + y * .01, 3)); const px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad * .9; j ? g.lineTo(px, py) : g.moveTo(px, py); }
      g.closePath(); g.fill(); }
    g.globalCompositeOperation = 'source-atop'; g.strokeStyle = 'rgba(8,10,22,.45)'; g.lineWidth = 1.2; g.beginPath();
    for (let x = -Ht; x < Wt + Ht; x += 4.5) { g.moveTo(x, Ht - 120); g.lineTo(x + 120, Ht - 330); } g.stroke();
    g.fillStyle = 'rgba(150,170,200,.18)'; for (let i = 0; i < 140; i++) { const x = Wt / 2 + (r() - .5) * 200, y = Ht - 300 + r() * 90; g.beginPath(); g.arc(x, y, 1.5 + r() * 2.5, 0, TAU); g.fill(); }
    g.globalCompositeOperation = 'source-over'; stip(c, .5, k + 1);
    return c;
  });
}
function treeLit(k) {   // the sunlit side (the sun is behind the camera: the whole visible crown warms, strongest on the upper left)
  return once('c13road_treelit' + k, () => {
    const src = treeSprite(k), [c, g] = canvas(src.width, src.height); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in';
    const lg = g.createLinearGradient(0, 0, src.width, src.height); lg.addColorStop(0, 'rgba(255,200,140,.55)'); lg.addColorStop(.6, 'rgba(255,190,130,.22)'); lg.addColorStop(1, 'rgba(255,190,130,.05)'); g.fillStyle = lg; g.fillRect(0, 0, src.width, src.height);
    return c;
  });
}
const TREES = [[-11, 30, 7.5, 0], [-17, 52, 9, 1], [-9.5, 72, 6, 2], [-12.5, 90, 8, 0], [-26, 100, 9, 1], [-38, 104, 10, 2], [-55, 108, 11, 0], [16, 46, 6.5, 2], [-30, 16, 9, 1]];

// ---------------------------------------------------------------- the props
// the barrier at Z 12: pivot post (left), the red-and-white boom with its reflector edge, counterweight, a no-entry disc, the fork
// post (right) with the latch that drops on "catch"
function barrier(ctx, P, t, K, D, lit) {
  const q = planeXY(ctx, P, 0, gY(BZ), BZ); if (!q) return;
  const px = (v) => v / q;   // screen px → metres
  const th = 1.36 * smo(clamp((t - K.nothing) / .95)) ** 1.15 * (1 + .03 * bump(t, K.nothing + .8, K.nothing + 1.3)), ink = '#14121f';
  // latch: open (up) until it drops on "catch" (gravity: expo-in, lands on the word), opens again just before the boom rises
  const tl = K.catch - .2, psi = t < tl ? 1.45 : t < K.catch ? 1.45 * (1 - eiX((t - tl) / .2)) : t < K.nothing - .12 ? -.06 * Math.exp(-(t - K.catch) * 9) * Math.sin((t - K.catch) * 30) : 1.45 * eoX((t - K.nothing + .12) / .3);
  const ivory = mixHex('#7d7a86', '#ebe4d2', .25 + .75 * D), red = mixHex('#4a1c22', '#b8352a', .3 + .7 * D), iron = mixHex('#1a1a26', '#3a3a4a', D);
  // posts
  const post = (x0, x1, h, col) => { ctx.fillStyle = col; ctx.fillRect(x0, -h, x1 - x0, h); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x0 + (x1 - x0) * .62, -h, (x1 - x0) * .38, h); ctx.fillStyle = 'rgba(200,210,240,.18)'; ctx.fillRect(x0, -h, px(1.4), h); };
  post(-3.82, -3.38, .98, iron); ctx.fillStyle = iron; ctx.fillRect(-3.95, -.12, .7, .12);                               // pivot pedestal + plinth
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = px(1); ctx.beginPath(); for (let v = .1; v < .95; v += .09) { ctx.moveTo(-3.8, -v); ctx.lineTo(-3.4, -v); } ctx.stroke();
  post(3.55, 3.66, .9, iron);                                                                                              // fork post
  ctx.fillStyle = iron; ctx.fillRect(3.46, -.93, .29, .04); ctx.fillRect(3.46, -1.13, .045, .24); ctx.fillRect(3.705, -1.13, .045, .24);
  // the boom (rotates about the pivot)
  ctx.save(); ctx.translate(PIV[0], -PIV[1]); ctx.rotate(-th);
  const L = BLEN, hw = .06;
  ctx.fillStyle = iron; ctx.fillRect(-.85, -hw, 1.0, hw * 2);                                                              // the short iron end
  ctx.fillStyle = iron; ctx.fillRect(-.9, -.14, .42, .27); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(-.9, -.14, .42, px(1.5));   // counterweight
  for (let i = 0; ; i++) { const a = .15 + i * .62, b = Math.min(L, a + .62); if (a >= L) break; ctx.fillStyle = (Math.floor((L - a) / .62 + .001) % 2 === 0) ? red : ivory; ctx.fillRect(a, -hw, b - a, hw * 2); }
  { const lg = ctx.createLinearGradient(0, -hw, 0, hw); lg.addColorStop(0, 'rgba(255,255,255,.18)'); lg.addColorStop(.35, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(8,8,24,.5)'); ctx.fillStyle = lg; ctx.fillRect(.15, -hw, L - .15, hw * 2); }
  ctx.strokeStyle = 'rgba(10,10,26,.35)'; ctx.lineWidth = px(.9); ctx.beginPath(); for (let k = 1; k < 4; k++) { const y = hw * (.1 + k * .22); ctx.moveTo(.2, y); ctx.lineTo(L, y); } ctx.stroke();
  // the no-entry disc hanging under the boom on two rings
  const sx = 4.1; ctx.strokeStyle = iron; ctx.lineWidth = px(1.6); ctx.beginPath(); ctx.arc(sx - .08, hw + .025, .022, 0, TAU); ctx.moveTo(sx + .1, hw + .025); ctx.arc(sx + .08, hw + .025, .022, 0, TAU); ctx.stroke();
  ctx.fillStyle = mixHex('#3a1418', '#c23a2c', .3 + .7 * D); ctx.beginPath(); ctx.arc(sx, hw + .25, .2, 0, TAU); ctx.fill();
  ctx.strokeStyle = ivory; ctx.lineWidth = .022; ctx.beginPath(); ctx.arc(sx, hw + .25, .185, 0, TAU); ctx.stroke(); ctx.fillStyle = ivory; ctx.fillRect(sx - .13, hw + .22, .26, .06);
  if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(SUN, .16 * lit); ctx.fillRect(-.9, -.14, L + .9, .5); ctx.globalCompositeOperation = 'source-over'; }
  ctx.restore();
  // hinge drum
  ctx.fillStyle = iron; ctx.beginPath(); ctx.arc(PIV[0], -PIV[1], .13, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(210,220,250,.35)'; ctx.beginPath(); ctx.arc(PIV[0] - .02, -PIV[1] - .02, .035, 0, TAU); ctx.fill();
  // latch on the fork (hinged on the right prong) + the padlock dangling from its end
  ctx.save(); ctx.translate(3.73, -1.13); ctx.rotate(psi); ctx.fillStyle = iron; ctx.fillRect(-.36, -.02, .38, .04); ctx.fillStyle = 'rgba(220,226,255,.3)'; ctx.fillRect(-.36, -.02, .38, px(1.2));
  const lx = -.32; ctx.translate(lx, .02); ctx.rotate(-psi + .25 * Math.exp(-Math.max(0, t - K.catch) * 2.5) * Math.sin(Math.max(0, t - K.catch) * 8) * (t > K.catch ? 1 : 0));
  ctx.strokeStyle = '#8a8270'; ctx.lineWidth = .012; ctx.beginPath(); ctx.arc(0, .035, .028, Math.PI, 0); ctx.stroke(); ctx.fillStyle = mixHex('#4a3a1a', '#b08a3a', D); ctx.fillRect(-.035, .035, .07, .06);
  ctx.restore();
  if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(SUN, .14 * lit); ctx.fillRect(-3.95, -1.15, 7.8, 1.15); ctx.globalCompositeOperation = 'source-over'; }
  id(ctx);
  // the reflector edge along the boom's top (screen px strokes, the same as the plate's line core)
  return { th, q };
}
// reflector stroke along the boom top from the pivot side to the tip, in screen px (identical to lineStroke's core when flat)
function boomEdge(ctx, P, t, th, a) {
  if (a <= 0) return;
  const c = Math.cos(th), s = Math.sin(th), at = (u) => { const X = PIV[0] + u * c - .06 * -s, Y = gY(BZ) + PIV[1] + u * s + .06 * c; return P(X, Y, BZ); };
  const A = at(.2), B = at(BLEN), br = .9 + .1 * Math.sin(t * 2.1);
  ctx.save(); id(ctx); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  ctx.strokeStyle = rgba('#ffb35c', .55 * br * a); ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  ctx.strokeStyle = rgba('#fff1d6', .95 * a); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  ctx.restore();
}
// a box's visible faces (back-face culled), each painted by the callback with its projected polygon
function box(ctx, P, cam, b, paint) {
  const { x0, x1, y0, y1, z0, z1 } = b, F = [];
  if (cam.z < z0) F.push(['front', [[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]]]);
  if (cam.x < x0) F.push(['left', [[x0, y1, z1], [x0, y1, z0], [x0, y0, z0], [x0, y0, z1]]]);
  if (cam.x > x1) F.push(['right', [[x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [x1, y0, z0]]]);
  if (cam.y > y1) F.push(['top', [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]]]);
  else if (cam.y < y0) F.push(['bottom', [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]]);
  for (const [k, pts] of F) { const s = projPoly(P, pts); if (s.length >= 3) paint(k, s, pts); }
}
const planks = (ctx, P, a, b, n, col, lw = 1) => {   // n engraved lines across a world quad (a = [p0, p1] bottom edge, b = top edge)
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  for (let i = 1; i < n; i++) { const k = i / n, A = a[0].map((v, j) => mix(v, b[0][j], k)), B = a[1].map((v, j) => mix(v, b[1][j], k)), s = projSeg(P, A, B); if (s) { ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); } }
  ctx.stroke();
};
// the toll gate at Z 25: booth with a canopy ("TOLL"), the striped arm on its motor post, the coin basket on a pole (empty)
function tollGate(ctx, P, cam, t, K, D, lit) {
  const T = TOLL, gy = gY(T.z0), wall = mixHex('#545266', '#d8cfb4', .2 + .8 * D), wallS = mixHex('#2c2b3c', '#8e8a8c', .2 + .8 * D), dark = '#141320';
  const up = 1.3 * qio((t - K.money) / .5) ** .9;
  // booth + canopy
  box(ctx, P, cam, { x0: T.x0, x1: T.x1, y0: gy, y1: gy + T.h, z0: T.z0, z1: T.z1 }, (k, s, w) => {
    fillPoly(ctx, s, k === 'front' ? wall : k === 'top' ? '#2a2836' : wallS);
    if (k === 'front' || k === 'left') planks(ctx, P, [w[3], w[2]], [w[0], w[1]], 12, 'rgba(20,18,36,.22)');
  });
  { const q = planeXY(ctx, P, T.x0, gy, T.z0); if (q) {   // front window
    ctx.fillStyle = dark; ctx.fillRect(.45, -1.95, 1.3, .85); ctx.fillStyle = 'rgba(150,170,210,.18)'; ctx.beginPath(); ctx.moveTo(.45, -1.95); ctx.lineTo(.95, -1.95); ctx.lineTo(.6, -1.1); ctx.lineTo(.45, -1.1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = wall; ctx.lineWidth = .05; ctx.strokeRect(.45, -1.95, 1.3, .85); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(.4, -1.08, 1.4, .05); } id(ctx); }
  // service window on the road face
  { const s = projPoly(P, [[T.x0, gy + 1.85, T.z0 + .35], [T.x0, gy + 1.85, T.z0 + 1.35], [T.x0, gy + 1.0, T.z0 + 1.35], [T.x0, gy + 1.0, T.z0 + .35]]); if (cam.x < T.x0 && s.length > 2) { fillPoly(ctx, s, dark); ctx.strokeStyle = wall; ctx.lineWidth = 2; polyPath(ctx, s); ctx.stroke(); } }
  box(ctx, P, cam, { x0: 3.3, x1: 6.8, y0: gy + T.h, y1: gy + T.h + .3, z0: 24.4, z1: 27.3 }, (k, s) => fillPoly(ctx, s, k === 'front' ? mixHex('#3a3a50', '#e9e2d0', .25 + .75 * D) : k === 'bottom' ? '#1b1a28' : '#2e2d40'));
  { const q = planeXY(ctx, P, 3.3, gy + T.h, 24.4); if (q) { ctx.fillStyle = mixHex('#38384c', '#c23a2c', .3 + .7 * D); ctx.fillRect(0, -.3, 3.5, .05); ctx.fillRect(0, -.05, 3.5, .05);
    ctx.save(); ctx.translate(1.75, -.085); ctx.scale(.01, .01); text(ctx, 'TOLL', 0, 0, { size: 17, font: 'Inter', weight: 600, color: '#1d1b2a', align: 'center', spacing: 5 }); ctx.restore(); } id(ctx); }
  if (lit > 0) { const s = projPoly(P, [[3.3, gy + T.h + .3, 24.4], [6.8, gy + T.h + .3, 24.4], [6.8, gy, 24.4], [3.3, gy, 24.4]]); ctx.save(); ctx.globalCompositeOperation = 'lighter'; fillPoly(ctx, s, rgba(SUN, .12 * lit)); ctx.restore(); }
  // the arm on its motor post (Z 24.7) — it lifts on "money" by itself
  { const az = T.armZ, ay = gY(az), q = planeXY(ctx, P, 0, ay, az); if (q) {
    const px = (v) => v / q, yel = mixHex('#4a4430', '#e0b83c', .3 + .7 * D);
    ctx.fillStyle = '#1c1b28'; ctx.fillRect(3.57, -1.0, .26, 1.0); ctx.fillStyle = yel; for (let v = .05; v < 1; v += .2) ctx.fillRect(3.57, -v - .1, .26, .1);
    ctx.fillStyle = '#26253a'; ctx.fillRect(3.48, -1.25, .44, .32); ctx.fillStyle = 'rgba(220,230,255,.2)'; ctx.fillRect(3.48, -1.25, .44, px(1.4));
    ctx.save(); ctx.translate(3.7, -1.1); ctx.rotate(up);
    for (let i = 0; i < 13; i++) { const a = -.12 - i * .5; ctx.fillStyle = i % 2 ? '#191826' : yel; ctx.fillRect(a - .5, -.045, .5, .09); }
    ctx.fillStyle = mixHex('#5a1a1a', '#e04a32', D); ctx.fillRect(-6.62, -.06, .12, .12);
    { const lg = ctx.createLinearGradient(0, -.045, 0, .045); lg.addColorStop(0, 'rgba(255,255,255,.2)'); lg.addColorStop(1, 'rgba(0,0,10,.45)'); ctx.fillStyle = lg; ctx.fillRect(-6.62, -.045, 6.5, .09); }
    ctx.restore();
    ctx.fillStyle = '#26253a'; ctx.beginPath(); ctx.arc(3.7, -1.1, .07, 0, TAU); ctx.fill();
  } id(ctx); }
  // coin basket on its pole (Z 23.6): a wire funnel, empty; a small plate with a coin under it
  { const bz = T.basZ, by = gY(bz), q = planeXY(ctx, P, T.basX, by, bz); if (q) {
    const px = (v) => v / q, metal = mixHex('#3a3a4c', '#a9a9b4', .2 + .8 * D);
    ctx.fillStyle = '#22212f'; ctx.fillRect(-.025, -.98, .05, .98);
    ctx.fillStyle = mixHex('#2a2a3a', '#e7e0cc', .25 + .75 * D); ctx.fillRect(-.16, -.8, .32, .22);
    ctx.strokeStyle = '#22212f'; ctx.lineWidth = px(1.2); ctx.strokeRect(-.16, -.8, .32, .22);
    ctx.fillStyle = mixHex('#4a3a1a', '#c8963c', .3 + .7 * D); ctx.beginPath(); ctx.arc(0, -.69, .07, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(40,24,6,.7)'; ctx.lineWidth = px(1.1); ctx.beginPath(); ctx.arc(0, -.69, .05, 0, TAU); ctx.stroke();
    // funnel
    ctx.fillStyle = 'rgba(16,16,28,.55)'; ctx.beginPath(); ctx.moveTo(-.26, -1.22); ctx.lineTo(.26, -1.22); ctx.lineTo(.085, -.96); ctx.lineTo(-.085, -.96); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = metal; ctx.lineWidth = px(1); ctx.beginPath(); for (let k = -10; k <= 10; k++) { ctx.moveTo(k * .028, -1.22); ctx.lineTo(k * .009, -.96); } for (let v = 0; v < 6; v++) { const y = -1.22 + v * .05, w = mix(.26, .085, v / 5.2); ctx.moveTo(-w, y); ctx.lineTo(w, y); } ctx.stroke(); ctx.restore();
    ctx.strokeStyle = metal; ctx.lineWidth = Math.max(px(2), .02); ctx.beginPath(); ctx.ellipse(0, -1.22, .26, .025, 0, 0, TAU); ctx.stroke();
    ctx.fillStyle = metal; ctx.fillRect(-.09, -.97, .18, .03);
  } id(ctx); }
}
// the permit booth at Z 38: a sentry box with a gable, "PERMITS" over the window, a roller shutter that rolls up on "permission":
// nobody inside, an empty chair, a blank form pinned to the inside of the window, the stamp unused on the ledge
function permitBooth(ctx, P, cam, t, K, D, lit) {
  const B = PERM, gy = gY(B.z0), paint = mixHex('#28303a', '#55706a', .25 + .75 * D), trim = mixHex('#4a4858', '#e6dfcc', .25 + .75 * D), dark = '#16151f';
  const open = eoX(clamp((t - K.permission - .02) / .5)) * (1 - .04 * bump(t, K.permission + .42, K.permission + .62));
  box(ctx, P, cam, { x0: B.x0, x1: B.x1, y0: gy, y1: gy + B.h, z0: B.z0, z1: B.z1 }, (k, s, w) => {
    fillPoly(ctx, s, k === 'front' ? paint : k === 'top' ? '#20202c' : mixHex(paint, '#0c0c16', .35));
    if (k !== 'top') planks(ctx, P, [w[3], w[2]], [w[0], w[1]], 11, 'rgba(10,12,20,.25)');
  });
  // gable roof (ridge along Z): the front triangle and the two slopes
  const pk = gy + B.peak, eave = gy + B.h, xm = (B.x0 + B.x1) / 2, o = .14;
  const roofL = projPoly(P, [[B.x0 - o, eave - .05, B.z0 - o], [xm, pk, B.z0 - o], [xm, pk, B.z1 + o], [B.x0 - o, eave - .05, B.z1 + o]]);
  const roofR = projPoly(P, [[xm, pk, B.z0 - o], [B.x1 + o, eave - .05, B.z0 - o], [B.x1 + o, eave - .05, B.z1 + o], [xm, pk, B.z1 + o]]);
  if (cam.x > xm) { fillPoly(ctx, roofL, '#2b2633'); fillPoly(ctx, roofR, mixHex('#3a3040', '#6a4a44', D)); } else { fillPoly(ctx, roofR, '#2b2633'); fillPoly(ctx, roofL, mixHex('#3a3040', '#6a4a44', D)); }
  const q = planeXY(ctx, P, xm, gy, B.z0); if (!q) return;
  const px = (v) => v / q, wx0 = B.win[0] - xm, wx1 = B.win[1] - xm, wy0 = B.win[2], wy1 = B.win[3];
  ctx.fillStyle = paint; ctx.beginPath(); ctx.moveTo(-.8 - o, -B.h + .05); ctx.lineTo(0, -B.peak); ctx.lineTo(.8 + o, -B.h + .05); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = trim; ctx.lineWidth = .05; ctx.beginPath(); ctx.moveTo(-.8 - o, -B.h + .03); ctx.lineTo(0, -B.peak - .02); ctx.lineTo(.8 + o, -B.h + .03); ctx.stroke();
  ctx.fillStyle = trim; ctx.fillRect(-.8, -.2, 1.6, .06); ctx.fillRect(-.8, -B.h, .05, B.h); ctx.fillRect(.75, -B.h, .05, B.h);
  // sign
  ctx.fillStyle = trim; ctx.fillRect(-.62, -2.2, 1.24, .26); ctx.strokeStyle = 'rgba(20,20,30,.6)'; ctx.lineWidth = px(1.2); ctx.strokeRect(-.62, -2.2, 1.24, .26);
  ctx.save(); ctx.translate(0, -2.015); ctx.scale(.01, .01); text(ctx, 'PERMITS', 0, 0, { size: 14.5, font: 'Inter', weight: 600, color: '#1d1b2a', align: 'center', spacing: 4 }); ctx.restore();
  // the opening: interior (back wall, chair back, the blank form on the glass), the ledge with the stamp
  ctx.fillStyle = dark; ctx.fillRect(wx0, -wy1, wx1 - wx0, wy1 - wy0);
  ctx.fillStyle = 'rgba(60,70,100,.35)'; ctx.fillRect(wx0, -wy1, wx1 - wx0, .18);
  ctx.fillStyle = '#24222e'; ctx.fillRect(wx0 + .62, -wy0 - .38, .05, .38); ctx.fillRect(wx0 + .9, -wy0 - .38, .05, .38); ctx.fillRect(wx0 + .6, -wy0 - .4, .37, .06);   // chair back
  { const fx = wx0 + .1, fy = -wy1 + .1, fw = .34, fh = .46; ctx.fillStyle = mixHex('#55546a', '#efe8d6', .3 + .7 * D); ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = mixHex('#3a3a50', '#8a6a3a', D); ctx.lineWidth = px(1.1); ctx.strokeRect(fx + .02, fy + .02, fw - .04, fh - .04); ctx.strokeRect(fx + .03, fy + .03, fw - .06, fh - .06);
    ctx.strokeStyle = 'rgba(40,40,60,.45)'; ctx.lineWidth = px(.9); ctx.beginPath(); for (let k = 0; k < 6; k++) { const y = fy + .12 + k * .052; ctx.moveTo(fx + .06, y); ctx.lineTo(fx + fw - .06, y); } ctx.stroke();
    ctx.fillStyle = 'rgba(40,40,60,.5)'; ctx.fillRect(fx + .09, fy + .06, .16, .025); }
  ctx.fillStyle = trim; ctx.fillRect(wx0 - .05, -wy0, wx1 - wx0 + .1, .05);
  ctx.fillStyle = '#5a3a2a'; ctx.fillRect(wx1 - .25, -wy0 - .07, .05, .07); ctx.fillStyle = '#22202c'; ctx.fillRect(wx1 - .29, -wy0 - .015, .13, .015);
  // shutter box + slats (rolled up by `open`)
  const sh = (wy1 - wy0) * (1 - open);
  ctx.fillStyle = mixHex('#3a3c4a', '#9a9ca6', .2 + .8 * D); ctx.fillRect(wx0 - .03, -wy1, wx1 - wx0 + .06, sh);
  ctx.strokeStyle = 'rgba(16,16,26,.55)'; ctx.lineWidth = px(1); ctx.beginPath(); for (let y = -wy1 + sh - .001; y > -wy1; y -= .045) { ctx.moveTo(wx0 - .03, y); ctx.lineTo(wx1 + .03, y); } ctx.stroke();
  if (sh > .02) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(wx0 - .03, -wy1 + sh - .02, wx1 - wx0 + .06, .02); ctx.fillStyle = '#26252f'; ctx.fillRect(-.05, -wy1 + sh - .045, .1, .03); }
  ctx.fillStyle = mixHex('#2a2b38', '#7e808c', .2 + .8 * D); ctx.beginPath(); ctx.roundRect(wx0 - .07, -wy1 - .17, wx1 - wx0 + .14, .17, .05); ctx.fill();
  if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(SUN, .15 * lit); ctx.fillRect(-1, -B.peak, 2, B.peak); ctx.globalCompositeOperation = 'source-over'; }
  id(ctx);
}
// the house at the bend: gable to the road, the one lit window (the hero light), chimney smoke
function house(ctx, P, cam, t, K, D, lit) {
  const B = HOUSE, gy = B.y, wall = mixHex('#2f3044', '#a49c98', .2 + .8 * D), wallS = mixHex('#1c1c2c', '#6c6676', .2 + .8 * D), roof = mixHex('#1a1622', '#4a3436', D);
  box(ctx, P, cam, { x0: B.x0, x1: B.x1, y0: gy - .3, y1: gy + B.h, z0: B.z0, z1: B.z1 }, (k, s, w) => { if (k === 'front') return; fillPoly(ctx, s, k === 'top' ? roof : wallS); if (k === 'right' || k === 'left') planks(ctx, P, [w[3], w[2]], [w[0], w[1]], 9, 'rgba(10,10,20,.25)'); });
  const xm = (B.x0 + B.x1) / 2, pk = gy + B.peak, eave = gy + B.h, o = .3;
  const rR = projPoly(P, [[xm, pk, B.z0 - o], [B.x1 + o, eave - .25, B.z0 - o], [B.x1 + o, eave - .25, B.z1 + o], [xm, pk, B.z1 + o]]);
  if (cam.x > xm) { fillPoly(ctx, rR, roof); planks(ctx, P, [[B.x1 + o, eave - .25, B.z0 - o], [B.x1 + o, eave - .25, B.z1 + o]], [[xm, pk, B.z0 - o], [xm, pk, B.z1 + o]], 10, 'rgba(0,0,0,.3)'); }
  // chimney + smoke
  { const s = projPoly(P, [[-3.4, pk + .9, 85], [-2.8, pk + .9, 85], [-2.8, pk - .5, 85], [-3.4, pk - .5, 85]]); fillPoly(ctx, s, wallS); }
  const q = planeXY(ctx, P, WIN.x, gy, B.z0); if (!q) return;
  const px = (v) => v / q, x0 = B.x0 - WIN.x, x1 = B.x1 - WIN.x, xc = xm - WIN.x;
  ctx.fillStyle = wall; ctx.beginPath(); ctx.moveTo(x0, .3); ctx.lineTo(x0, -B.h); ctx.lineTo(xc, -B.peak); ctx.lineTo(x1, -B.h); ctx.lineTo(x1, .3); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(14,14,26,.18)'; ctx.lineWidth = Math.max(px(.9), .006); ctx.beginPath(); for (let y = .3; y > -B.peak; y -= .085) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); } ctx.stroke();
  const lg = ctx.createLinearGradient(x0, 0, x1, 0); lg.addColorStop(0, 'rgba(0,0,10,.25)'); lg.addColorStop(.6, 'rgba(0,0,10,0)'); ctx.fillStyle = lg; ctx.fillRect(x0, -B.peak, x1 - x0, B.peak + .3); ctx.restore();
  ctx.strokeStyle = roof; ctx.lineWidth = .22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0 - o, -B.h + .25); ctx.lineTo(xc, -B.peak - .1); ctx.lineTo(x1 + o, -B.h + .25); ctx.stroke();
  ctx.fillStyle = '#1b1a28'; ctx.fillRect(xc - .3, -4.3, .6, .55); ctx.strokeStyle = wall; ctx.lineWidth = .05; ctx.strokeRect(xc - .3, -4.3, .6, .55);   // attic window (dark)
  // the kitchen window: frame, sill, curtains; the pane itself is drawn by the caller (light)
  ctx.fillStyle = mixHex('#3a3846', '#e8e0cc', .25 + .75 * D); ctx.fillRect(-WIN.hw - .09, -1.5 - WIN.hh - .09, WIN.hw * 2 + .18, WIN.hh * 2 + .18); ctx.fillRect(-WIN.hw - .16, -1.5 + WIN.hh + .06, WIN.hw * 2 + .32, .07);
  id(ctx);
  return q;
}
// the lit pane: lightFill clipped to the projected pane, curtains at its sides
function pane(ctx, P, t, K, glowR) {
  const s = projPoly(P, [[WIN.x - WIN.hw, WIN.y + WIN.hh, WIN.z], [WIN.x + WIN.hw, WIN.y + WIN.hh, WIN.z], [WIN.x + WIN.hw, WIN.y - WIN.hh, WIN.z], [WIN.x - WIN.hw, WIN.y - WIN.hh, WIN.z]], .02);
  if (s.length < 3) return null;
  const c = P(WIN.x, WIN.y, WIN.z), hwPx = Math.abs(s[1][0] - s[0][0]) / 2;
  ctx.save(); id(ctx); polyPath(ctx, s); ctx.clip();
  lightFill(ctx, t, { cx: c[0], cy: c[1], R: glowR(hwPx) });
  ctx.restore();
  // curtains (in the pane's plane, slightly inside)
  const q = planeXY(ctx, P, WIN.x, WIN.y, WIN.z + .02);
  if (q) { const cur = (x0, x1, side) => { ctx.fillStyle = 'rgba(120,70,40,.55)'; ctx.beginPath(); ctx.moveTo(x0, -WIN.hh); ctx.lineTo(x1, -WIN.hh); ctx.quadraticCurveTo(x1 - side * .05, 0, x1 - side * .02, WIN.hh); ctx.lineTo(x0, WIN.hh); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(70,36,20,.5)'; ctx.lineWidth = .008; ctx.beginPath(); for (let k = 1; k < 5; k++) { const x = mix(x0, x1, k / 5); ctx.moveTo(x, -WIN.hh); ctx.quadraticCurveTo(x + side * .01, 0, x - side * .01, WIN.hh); } ctx.stroke(); };
    cur(-WIN.hw, -WIN.hw + .14, -1); cur(WIN.hw, WIN.hw - .14, 1); }
  id(ctx);
  return { s, c, hwPx };
}

// ---------------------------------------------------------------- the light that fills the frame (window → kitchen lamp): opaque inside .85 R
export function lightFill(ctx, t, o = {}) {
  const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, R = o.R ?? 1500, br = 1 + .025 * Math.sin(t * 2.3) + .015 * Math.sin(t * 5.1);
  ctx.save(); id(ctx); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * br);
  g.addColorStop(0, '#fffaf0'); g.addColorStop(.16, '#fff1d2'); g.addColorStop(.4, '#ffdc9e'); g.addColorStop(.66, '#f7b86c'); g.addColorStop(.85, '#ec9c50'); g.addColorStop(1, 'rgba(236,156,80,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * br, 0, TAU); ctx.fill();
  // a stippled print ring and drifting dust motes in the light
  const sp = fillSprite(); ctx.globalAlpha = .5; ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(sp, cx - R * .9, cy - R * .9, R * 1.8, R * 1.8);
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1; const r = prng(5);
  for (let i = 0; i < 46; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R * .75, x = cx + Math.cos(a + t * .05) * d + Math.sin(t * .7 + i) * 8, y = cy + Math.sin(a + t * .05) * d * .7 - ((t * 9 + i * 13) % 60), s = .8 + r() * 1.6;
    ctx.fillStyle = `rgba(255,248,230,${.25 + .25 * Math.sin(t * 3 + i)})`; ctx.beginPath(); ctx.arc(x, y, s * Math.max(.4, R / 1500), 0, TAU); ctx.fill(); }
  ctx.restore();
}
function fillSprite() {
  return once('c13_fillsprite', () => {
    const S = 512, [c, g] = canvas(S, S), rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.45, 'rgba(250,236,214,1)'); rg.addColorStop(.75, 'rgba(232,200,170,1)'); rg.addColorStop(1, 'rgba(255,255,255,1)');
    g.fillStyle = rg; g.fillRect(0, 0, S, S);
    const d = g.getImageData(0, 0, S, S), p = d.data, r = prng(3);
    for (let i = 0; i < p.length; i += 4) { if (r() < .06) { p[i] *= .9; p[i + 1] *= .88; p[i + 2] *= .86; } }
    g.putImageData(d, 0, 0); return c;
  });
}

// ---------------------------------------------------------------- ground, road, verges, fences, poles
function drawGround(ctx, P, t, K, D, cam) {
  const Zn = cam.z + .6, gp = projPoly(P, plateau(Zn));
  if (gp.length < 3) return gp;
  const far = P(0, gY(110), 110), yf = far[1];
  const g = ctx.createLinearGradient(0, yf, 0, H);
  g.addColorStop(0, pal(D, [[0, '#1b2043'], [.5, '#3f4a73'], [1, '#6b7499']])); g.addColorStop(.25, pal(D, [[0, '#151a38'], [.5, '#2d375d'], [1, '#4d5880']])); g.addColorStop(1, pal(D, [[0, '#0d1028'], [.5, '#1a2040'], [1, '#2a3354']]));
  ctx.fillStyle = g; polyPath(ctx, gp); ctx.fill();
  ctx.save(); polyPath(ctx, gp); ctx.clip();
  // furrows in the left field (converging), grass strokes on the right
  ctx.strokeStyle = 'rgba(6,8,22,.4)'; ctx.lineWidth = 1.3; ctx.beginPath();
  for (let k = 0; k < 46; k++) { const X = -6.2 - k * 1.15, s = projSeg(P, [X, gY(Zn), Zn], [X, gY(96), 96]); if (s) { ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); } }
  ctx.stroke();
  ctx.strokeStyle = rgba(pal(D, [[0, '#2c3460'], [1, '#9aa2c0']]), .35); ctx.lineWidth = 1; ctx.beginPath();
  for (let k = 0; k < 46; k++) { const X = -6.6 - k * 1.15, s = projSeg(P, [X, gY(Zn), Zn], [X, gY(70), 70]); if (s) { ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); } }
  ctx.stroke();
  // a hedge line along the field's far side and the verge ditch (left)
  { const s = projSeg(P, [-5.4, gY(Zn) + .02, Zn], [-5.4, gY(80) + .02, 80]); if (s) { ctx.strokeStyle = 'rgba(4,6,18,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); ctx.stroke(); } }
  // tufts (meadow right, verges both sides): fixed world points, short strokes scaled by distance
  const r = prng(4321), o = P.o;
  ctx.strokeStyle = rgba(pal(D, [[0, '#1a2040'], [1, '#3c4668']]), .9); ctx.lineWidth = 1.1; ctx.beginPath();
  for (let i = 0; i < 900; i++) {
    const side = r() < .5, X = side ? 3.4 + r() * 14 : -3.4 - r() * 2.2, Z = r() * 80, h = .18 + r() * .25;
    if (Z < cam.z + 1.5 || (side && X > edgeAt(Z) - .4)) continue;
    const a = P(X, gY(Z), Z); if (a[2] < 1 || a[0] < -20 || a[0] > W + 20 || a[1] > H + 10) continue;
    const hp = h * a[3]; if (hp < 1.2) continue;
    for (let j = -1; j <= 1; j++) { ctx.moveTo(a[0] + j * hp * .25, a[1]); ctx.lineTo(a[0] + j * hp * .45 + hp * .1 * Math.sin(t * 1.3 + i), a[1] - hp * (1 - Math.abs(j) * .25)); }
  }
  ctx.stroke();
  ctx.restore();
  // the plateau edge: a darker lip with bushes, against the valley
  ctx.strokeStyle = 'rgba(6,8,20,.6)'; ctx.lineWidth = 2.5; ctx.beginPath(); let f = true;
  for (let i = 0; i < EDGE.length; i++) { const [x, z] = EDGE[i]; if (z < Zn) continue; const a = P(x, gY(z), z); f ? ctx.moveTo(a[0], a[1]) : ctx.lineTo(a[0], a[1]); f = false; }
  ctx.stroke();
  return gp;
}
function drawRoad(ctx, P, t, K, D, cam, gp) {
  const Zn = cam.z + .6, rp = projPoly(P, roadPoly(Zn));
  if (rp.length < 3) return;
  ctx.save(); polyPath(ctx, gp); ctx.clip();
  const far = P(0, gY(90), 90), g = ctx.createLinearGradient(0, far[1], 0, H);
  g.addColorStop(0, pal(D, [[0, '#262a48'], [.5, '#4e5578'], [1, '#7c809c']])); g.addColorStop(.3, pal(D, [[0, '#1b1e38'], [.5, '#33395a'], [1, '#4f5674']])); g.addColorStop(1, pal(D, [[0, '#111327'], [.5, '#1f2238'], [1, '#2c3048']]));
  ctx.fillStyle = g; polyPath(ctx, rp); ctx.fill();
  ctx.save(); polyPath(ctx, rp); ctx.clip();
  // gravel shoulders, the worn centre dashes, tyre-polished tracks, engraved cross hatching
  for (const sd of [-1, 1]) { const s = projPoly(P, [[sd * (RW - .4), gY(Zn), Zn], [sd * RW, gY(Zn), Zn], [sd * RW, gY(72), 72], [sd * (RW - .4), gY(72), 72]]); fillPoly(ctx, s, rgba(pal(D, [[0, '#3a3e5c'], [1, '#9a9cb0']]), .3)); }
  const dash = rgba(pal(D, [[0, '#6a6a80'], [1, '#e9e2d0']]), .55);
  for (let z0 = Math.ceil(Zn / 9) * 9; z0 < 72; z0 += 9) { const s = projPoly(P, [[-.07, gY(z0), z0], [.07, gY(z0), z0], [.07, gY(z0 + 3), z0 + 3], [-.07, gY(z0 + 3), z0 + 3]]); fillPoly(ctx, s, dash); }
  for (const X of [-1.5, 1.5]) { const s = projPoly(P, [[X - .35, gY(Zn), Zn], [X + .35, gY(Zn), Zn], [X + .35, gY(72), 72], [X - .35, gY(72), 72]]); fillPoly(ctx, s, rgba(pal(D, [[0, '#2c3050'], [1, '#8d93ad']]), .22)); }
  ctx.strokeStyle = 'rgba(6,7,18,.32)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let z = Math.ceil(Zn / .55) * .55; z < Zn + 26; z += .55) { const s = projSeg(P, [-RW, gY(z), z], [RW, gY(z), z]); if (s && Math.abs(s[0][1] - s[1][1]) < 40) { ctx.moveTo(s[0][0], s[0][1] + Math.sin(z * 7) * .6); ctx.lineTo(s[1][0], s[1][1]); } }
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}
// fence (left, X -5.8) and telegraph poles (right, X 8.5): posts are depth-sorted props, wires are drawn first
const FENCE_X = -5.8, POLE_X = 8.6, POLES = [6, 34, 62, 90];
function wires(ctx, P, t, D, cam) {
  ctx.save(); id(ctx);
  const col = rgba(pal(D, [[0, '#454a70'], [1, '#c9c6cf']]), .7);
  ctx.strokeStyle = col; ctx.lineWidth = 1;
  for (const h of [.55, .98]) { const s = projSeg(P, [FENCE_X, gY(cam.z) + h, Math.max(2, cam.z)], [FENCE_X, gY(78) + h, 78]); if (s) { ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); ctx.stroke(); } }
  ctx.strokeStyle = rgba(pal(D, [[0, '#3a3e64'], [1, '#d8d2d8']]), .8); ctx.lineWidth = 1.2;
  for (let i = 0; i < POLES.length - 1; i++) for (const dx of [-.8, 0, .8]) {
    const z0 = POLES[i], z1 = POLES[i + 1], A = [POLE_X + dx, gY(z0) + 7.15, z0], B = [POLE_X + dx, gY(z1) + 7.15, z1], M = [POLE_X + dx, (A[1] + B[1]) / 2 - .45, (z0 + z1) / 2];
    const a = P(...A), b = P(...B), m = P(...M); if (a[2] < .5 || b[2] < .5 || m[2] < .5) continue;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(2 * m[0] - (a[0] + b[0]) / 2, 2 * m[1] - (a[1] + b[1]) / 2, b[0], b[1]); ctx.stroke();
  }
  ctx.restore();
}
function fencePost(ctx, P, Z, D) {
  const a = P(FENCE_X, gY(Z), Z), b = P(FENCE_X, gY(Z) + 1.1, Z); if (a[2] < .6) return;
  const w = Math.max(1.2, .1 * a[3]); ctx.fillStyle = pal(D, [[0, '#14142a'], [1, '#3a3446']]); ctx.fillRect(b[0] - w / 2, b[1], w, a[1] - b[1]);
  ctx.fillStyle = rgba(pal(D, [[0, '#3c4068'], [1, '#c8c0c0']]), .5); ctx.fillRect(b[0] - w / 2, b[1], Math.max(.8, w * .3), a[1] - b[1]);
}
function telePole(ctx, P, Z, D, lit) {
  const a = P(POLE_X, gY(Z), Z), b = P(POLE_X, gY(Z) + 7.6, Z); if (a[2] < .8) return;
  const w = Math.max(1.5, .24 * a[3]), col = pal(D, [[0, '#15142a'], [1, '#3b3036']]);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(a[0] - w / 2, a[1]); ctx.lineTo(b[0] - w * .35, b[1]); ctx.lineTo(b[0] + w * .35, b[1]); ctx.lineTo(a[0] + w / 2, a[1]); ctx.closePath(); ctx.fill();
  const c1 = P(POLE_X - 1, gY(Z) + 7.1, Z), c2 = P(POLE_X + 1, gY(Z) + 7.1, Z); ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.4, .12 * a[3]); ctx.beginPath(); ctx.moveTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]); ctx.stroke();
  ctx.fillStyle = pal(D, [[0, '#4a5070'], [1, '#d9d4cc']]); for (const dx of [-.8, 0, .8]) { const p = P(POLE_X + dx, gY(Z) + 7.18, Z), s = Math.max(1, .07 * p[3]); ctx.fillRect(p[0] - s / 2, p[1] - s * 1.6, s, s * 1.6); }
  if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(SUN, .2 * lit); ctx.fillRect(a[0] - w / 2, b[1], w * .5, a[1] - b[1]); ctx.restore(); }
}
function treeAt(ctx, P, X, Z, hgt, k, t, lit) {
  const a = P(X, gY(Z), Z); if (a[2] < 1.5) return;
  const sp = treeSprite(k), s = hgt * a[3] / sp.height; if (sp.width * s < 2 || a[0] + sp.width * s < 0 || a[0] - sp.width * s > W) return;
  const sw = Math.sin(t * .8 + X) * .01;
  ctx.save(); ctx.translate(a[0], a[1]); ctx.transform(1, 0, sw, 1, 0, 0); ctx.drawImage(sp, -sp.width * s / 2, -sp.height * s, sp.width * s, sp.height * s);
  if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = lit; ctx.drawImage(treeLit(k), -sp.width * s / 2, -sp.height * s, sp.width * s, sp.height * s); }
  ctx.restore();
}

// ---------------------------------------------------------------- shadows: the ridge's shadow, the props' long shadows, your own
function castPolys(t, K, cam) {
  const e = sunE(t, K), L = (h) => h / Math.tan(e), dx = Math.sin(SAZ), dz = Math.cos(SAZ), out = [];
  const boxShadow = (x0, x1, z0, z1, h) => { const l = L(h); out.push([[x0, z0], [x1, z0], [x1 + dx * l, z0 + dz * l], [x0 + dx * l, z0 + dz * l]], [[x0, z1], [x1, z1], [x1 + dx * l, z1 + dz * l], [x0 + dx * l, z1 + dz * l]], [[x0, z0], [x0, z1], [x0 + dx * l, z1 + dz * l], [x0 + dx * l, z0 + dz * l]], [[x1, z0], [x1, z1], [x1 + dx * l, z1 + dz * l], [x1 + dx * l, z0 + dz * l]]); };
  boxShadow(TOLL.x0, TOLL.x1, TOLL.z0, TOLL.z1, 2.8);
  boxShadow(PERM.x0, PERM.x1, PERM.z0, PERM.z1, 2.8);
  boxShadow(HOUSE.x0, HOUSE.x1, HOUSE.z0, HOUSE.z1, 4.2);
  for (let Z = 2; Z < 78; Z += 2.6) boxShadow(FENCE_X - .05, FENCE_X + .05, Z - .05, Z + .05, 1.1);
  for (const Z of POLES) boxShadow(POLE_X - .12, POLE_X + .12, Z - .12, Z + .12, 7.6);
  boxShadow(-3.8, -3.4, BZ - .1, BZ + .1, 1.0); boxShadow(3.55, 3.65, BZ - .05, BZ + .05, 1.0);
  boxShadow(3.57, 3.83, TOLL.armZ - .1, TOLL.armZ + .1, 1.2); boxShadow(TOLL.basX - .03, TOLL.basX + .03, TOLL.basZ - .03, TOLL.basZ + .03, 1.2);
  for (const [X, Z, h] of TREES) { const l = L(h * .75), r = h * .28; out.push([[X - r * .2, Z], [X + r * .2, Z], [X + dx * l + r, Z + dz * l], [X + dx * l - r, Z + dz * l]]); }
  return out;
}
// your shadow: a standing figure (feet at the camera's foot point), legs slightly apart, arms at the sides, head; on the ground plane
function youShadow(t, K, cam0) {
  const e = sunE(t, K), L = 1.72 / Math.tan(e), dx = Math.sin(SAZ), dz = Math.cos(SAZ), px = -dz, pz = dx;   // along / across
  const fx = cam0.x, fz = cam0.z, pt = (u, v) => [fx + dx * u * L + px * v, fz + dz * u * L + pz * v];
  const b = .012 * Math.sin(t * 1.5);
  const leg = (s) => [pt(0, s * .08), pt(0, s * .18), pt(.47, s * .1), pt(.47, s * .005)];
  const body = [pt(.45, -.17), pt(.45, .17), pt(.6, .2), pt(.79, .23 + b), pt(.82, .2), pt(.83, -.2), pt(.79, -.23 - b), pt(.6, -.2)];
  const arm = (s) => [pt(.79, s * .2), pt(.79, s * .27), pt(.5, s * .27 + s * b), pt(.47, s * .21)];
  const head = []; for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; head.push(pt(.915 + Math.cos(a) * .065, Math.sin(a) * .11)); }
  const neck = [pt(.82, -.06), pt(.82, .06), pt(.87, .05), pt(.87, -.05)];
  return [leg(-1), leg(1), body, arm(-1), arm(1), neck, head];
}
function drawShadows(ctx, P, t, K, D, cam, gp) {
  if (t < K.sun0 - .05) return;
  const Zf = frontZ(t, K), Zl = Math.max(cam.z + .6, Zf), lp = projPoly(P, plateau(Zl));
  if (lp.length < 3) return;
  ctx.save(); id(ctx); polyPath(ctx, gp); ctx.clip(); polyPath(ctx, lp); ctx.clip();
  // sunlight on the ground beyond the ridge's shadow
  const far = P(0, gY(110), 110), g = ctx.createLinearGradient(0, far[1], 0, H);
  g.addColorStop(0, 'rgba(255,196,140,.32)'); g.addColorStop(.4, 'rgba(255,188,128,.24)'); g.addColorStop(1, 'rgba(255,180,120,.2)');
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
  // the long shadows (cool), merging with the ridge's shadow at the front
  ctx.fillStyle = 'rgba(22,26,64,.5)';
  for (const q of castPolys(t, K, cam)) { const s = projPoly(P, q.map(([x, z]) => [x, gY(z) + .01, z])); if (s.length > 2) { polyPath(ctx, s); ctx.fill(); } }
  if (t >= K.you2 - .2) { const yc = K._you0 || (K._you0 = baseCam(K.you2 + .05, K));
    ctx.fillStyle = 'rgba(20,22,58,.6)'; for (const q of youShadow(t, K, yc)) { const s = projPoly(P, q.map(([x, z]) => [x, gY(z) + .012, z])); if (s.length > 2) { polyPath(ctx, s); ctx.fill(); } }
    ctx.strokeStyle = 'rgba(20,22,58,.25)'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; for (const q of youShadow(t, K, yc)) { const s = projPoly(P, q.map(([x, z]) => [x, gY(z) + .012, z])); if (s.length > 2) { polyPath(ctx, s); ctx.stroke(); } } }
  ctx.restore();
  // the front itself: a soft warm rim where the light meets the shadow
  const a = projSeg(P, [LEFT, gY(Zf), Zf], [edgeAt(Zf), gY(Zf), Zf]);
  if (a && Zf > cam.z + .7) { ctx.save(); polyPath(ctx, gp); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,190,130,.18)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a[0][0], a[0][1]); ctx.lineTo(a[1][0], a[1][1]); ctx.stroke(); ctx.restore(); }
}

// ---------------------------------------------------------------- mist (near ground, alive) and birds
function mistSprite() { return once('c13road_mist', () => { const [c, g] = canvas(1024, 128), n = vnoise(17); const d = g.createImageData(1024, 128), p = d.data;
  for (let y = 0; y < 128; y++) for (let x = 0; x < 1024; x++) { const i = (y * 1024 + x) * 4, f = fbm(n, x * .006, y * .03, 4), v = Math.sin(Math.PI * y / 128) ** 2 * clamp(Math.min(x, 1024 - x) / 200), a = clamp((f - .35) * 2.2) * v;
    p[i] = 196; p[i + 1] = 204; p[i + 2] = 228; p[i + 3] = a * 255; }
  g.putImageData(d, 0, 0); stip(c, .7, 4); return c; }); }
const MISTS = [[-30, 70, 60, 0], [20, 96, 70, 1], [-10, 104, 90, 2], [30, 60, 40, 3]];
function drawMist(ctx, P, t, D, cam, only) {
  const sp = mistSprite();
  for (const [X, Z, w, ph] of only ? [only] : MISTS) {
    if (Z < cam.z + 3) continue;
    const a = P(X + Math.sin(t * .05 + ph) * 3 + t * .4 % 1, gY(Z) + .5, Z); if (a[2] < 2) continue;
    const ww = w * a[3], hh = ww * .07; ctx.globalAlpha = (.28 + .1 * Math.sin(t * .3 + ph)) * (.6 + .4 * D); ctx.drawImage(sp, a[0] - ww / 2, a[1] - hh * .7, ww, hh); ctx.globalAlpha = 1;
  }
}
function drawBirds(ctx, P, t, K) {
  const o = P.o, F = P.F, ys = (e) => (o.oy ?? H / 2) - F * Math.tan(e - o.pitch);
  ctx.strokeStyle = 'rgba(22,22,44,.75)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    const tt = t - K.b0 - 1.2 - i * .18; if (tt < 0 || tt > 9) continue;
    const az = -.75 + tt * .09 + i * .025, el = .17 + tt * .006 + Math.sin(i * 2.3) * .02, x = (o.ox ?? W / 2) + F * Math.tan(az - (o.yaw || 0)), y = ys(el), s = 6 * F / F0, fl = Math.sin(tt * 9 + i * 1.7);
    ctx.beginPath(); ctx.moveTo(x - s, y - fl * s * .5); ctx.quadraticCurveTo(x - s * .4, y - s * .2, x, y); ctx.quadraticCurveTo(x + s * .4, y - s * .2, x + s, y - fl * s * .5); ctx.stroke();
  }
}

// ---------------------------------------------------------------- the opening: the plate's dark ground lifts off the world from the line out
function veil(ctx, t, yl, r) {
  const [c, g] = scratchLayer('c13veil');
  lineGround(g, t, yl);
  if (r > .5) {
    g.globalCompositeOperation = 'destination-out';
    const lg = g.createLinearGradient(0, yl - r, 0, yl + r);
    lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(.25, 'rgba(0,0,0,1)'); lg.addColorStop(.75, 'rgba(0,0,0,1)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = lg; g.fillRect(0, yl - r, W, r * 2);
    g.globalCompositeOperation = 'source-over';
  }
  ctx.drawImage(c, 0, 0);
}

// ---------------------------------------------------------------- the take
export function roadTake(ctx, t, K) {
  const cam = roadCam(t, K), P = pin({ x: cam.x, y: cam.y, z: cam.z, yaw: cam.yaw, pitch: cam.pitch, f: cam.f, ox: cam.ox, oy: cam.oy });
  const D = dawnOf(t, K);
  id(ctx); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  drawSky(ctx, P, t, D);
  drawBirds(ctx, P, t, K);
  // the far valley: the backdrop, its alpenglow, a cool darkening while it is still night down there
  { const o = P.o, Db = 4000, corner = (a, b) => P(o.x + a * Db, o.y + b * Db, o.z + Db);
    const q = [corner(FI.AL, FI.BT), corner(FI.AR, FI.BT), corner(FI.AR, FI.BB), corner(FI.AL, FI.BB)].map((p) => [p[0], p[1]]);
    const n = Math.abs(o.yaw || 0) > .015 ? 12 : 1;
    quadSprite(ctx, farLayers(), q, n, 1);
    const fl = smr(K.permission - .4, K.you2 + .3, t); if (fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; quadSprite(ctx, farLit(), q, n, fl); ctx.restore(); }
    const dk = (1 - D) * .55; if (dk > .004) quadSprite(ctx, farDark(), q, n, dk);
    id(ctx); }
  const gp = drawGround(ctx, P, t, K, D, cam);
  drawRoad(ctx, P, t, K, D, cam, gp);
  drawShadows(ctx, P, t, K, D, cam, gp);
  wires(ctx, P, t, D, cam);
  // depth-sorted props
  const items = [], dz = (X, Z) => { const o = P.o; return (X - o.x) * Math.sin(o.yaw || 0) + (Z - o.z) * Math.cos(o.yaw || 0); };
  const lit = (Z, h) => litAt(t, K, Z, h);
  for (let Z = 2; Z < 78; Z += 2.6) items.push([dz(FENCE_X, Z), () => fencePost(ctx, P, Z, D)]);
  for (const Z of POLES) items.push([dz(POLE_X, Z), () => telePole(ctx, P, Z, D, lit(Z, 5))]);
  for (const [X, Z, h, k] of TREES) items.push([dz(X, Z), () => treeAt(ctx, P, X, Z, h, k, t, lit(Z, h * .6))]);
  items.push([dz(-4, HOUSE.z0), () => { house(ctx, P, cam, t, K, D, lit(HOUSE.z0, 2)); houseGlow(ctx, P, t, K, D); }]);
  items.push([dz(-4.2, PERM.z0), () => permitBooth(ctx, P, cam, t, K, D, lit(PERM.z0, 1.5))]);
  items.push([dz(5, TOLL.z0), () => tollGate(ctx, P, cam, t, K, D, lit(TOLL.z0, 1.5))]);
  for (const m of MISTS) items.push([dz(m[0], m[1]), () => drawMist(ctx, P, t, D, cam, m)]);
  let bar = null; items.push([dz(0, BZ), () => { bar = barrier(ctx, P, t, K, D, lit(BZ, .8)); }]);
  items.sort((a, b) => b[0] - a[0]);
  for (const [z, f] of items) if (z > .5) { ctx.save(); f(); ctx.restore(); id(ctx); }
  // the opening out of the plate: the line is the boom's reflector edge; the plate's dark ground lifts off from the line outward
  const tOpen = t - K.b0;
  if (tOpen < 2.4 && bar) {
    const yl = cam._ay ?? P(0, gY(BZ) + 1.06, BZ)[1];
    const r = 1450 * cio(clamp(tOpen / 1.35));
    if (r < 1440) veil(ctx, t, yl, r);
    const kL = 1 - smr(0, .7, tOpen), gl = 1 - smr(.05, 1.1, tOpen), core = mix(1, .5, smr(.2, 1.4, tOpen));
    const A = P(PIV[0] + .2, gY(BZ) + 1.06, BZ), B = P(PIV[0] + BLEN, gY(BZ) + 1.06, BZ);
    if (kL > 0 || gl > 0) { id(ctx); lineStroke(ctx, t, { k: kL, y: yl, x0: A[0], x1: B[0], glow: gl, a: core, ticks: kL }); }
    else boomEdge(ctx, P, t, bar.th, core * (1 - smr(K.nothing + .9, K.nothing + 1.5, t) * .4));
  } else if (bar) boomEdge(ctx, P, t, bar.th, .5 * (1 - smr(K.nothing + .9, K.nothing + 1.5, t) * .4));
  id(ctx);
}
// the hero light: the warm window, its glow on the wall and on the ground in front
function houseGlow(ctx, P, t, K, D) {
  const c = P(WIN.x, WIN.y, WIN.z); if (c[2] < .05) return;
  const R = Math.max(6, 2.6 * c[3]) * (1 + .03 * Math.sin(t * 2.7));
  ctx.save(); id(ctx); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g.addColorStop(0, 'rgba(255,190,110,.5)'); g.addColorStop(.3, 'rgba(255,170,90,.18)'); g.addColorStop(1, 'rgba(255,160,80,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, TAU); ctx.fill();
  const gq = projPoly(P, [[WIN.x - 1.2, HOUSE.y + .01, WIN.z - .2], [WIN.x + 1.2, HOUSE.y + .01, WIN.z - .2], [WIN.x + 1.8, HOUSE.y + .01, WIN.z - 3.2], [WIN.x - 1.8, HOUSE.y + .01, WIN.z - 3.2]]);
  if (gq.length > 2) { fillPoly(ctx, gq, `rgba(255,170,90,${.14 * (1 - D * .5)})`); }
  ctx.restore();
  // the pane (lit), its glow radius matched to the hand-over: R = 1500 once the pane covers the frame
  pane(ctx, P, t, K, (hw) => Math.min(1500, Math.max(hw * 2.4, 4)));
}
// cache warm-up
export function warmRoad() { farLayers(); farLit(); farDark(); clouds(); for (let k = 0; k < 3; k++) { treeSprite(k); treeLit(k); } mistSprite(); fillSprite(); }
