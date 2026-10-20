// c13 (Film 4 v2) · TAKE 1 · THE ROAD (H.b 371.89 → the cut into the kitchen light ~380.2). Owner: c13.
// The amber line of the c12>c13 plate is the reflector edge of a barrier boom on a hill road at dawn. The camera pulls back 5.5× out
// of the line (the plate's dark ground lifts off the world from the line outward), the latch drops on "catch", the boom rises on
// "nothing", the camera glides down the road past the toll gate ("money": its arm lifts by itself, the coin basket stays empty) and the
// permit booth ("permission": the shutter rolls up, nobody inside, the form blank). The sun rises behind you: the ridge's shadow runs
// up the road toward the camera and your long shadow lies on the empty road ("you"); then the camera flies into the one lit window of
// the house at the bend, whose light fills the frame (lightFill, shared with the kitchen take).
//   roadTake(ctx, t, K)   K = { b0, catch, nothing, money, permission, you2, sun0, push0, cut }
//   lightFill(ctx, t, o)  the warm light that fills the frame between the road and the kitchen ({ cx, cy, R }); opaque inside .85 R
//   warmRoad()            builds the cached layers (call once before ready())
import { W, H, rgba, clamp, mix, prng, canvas, text } from '../engine.mjs';
import { pin, once, onceRaw, toImg, best, polyPath, lineGround, lineStroke, pal, mixHex, eoX, eiX, qio, cio, smo, smr, bump, mono, scratchLayer, planeXY, stip, projSprite, hatchPoly, TAU } from './v2_c13_kit.mjs';
import { vnoise, fbm } from './art.mjs';

const P0 = -.113, F0 = 1150, SLOPE = .1;
export const gY = (Z) => -SLOPE * Z;                               // the hill road falls 10 % toward the valley
const roadX = (Z) => (Z < 70 ? 0 : (Z - 70) ** 2 * .04);           // straight, then it bends right and drops over the edge
const RW = 2.8;                                                    // half width of the tarmac
const EDGE = [[23, -4], [19.6, 18], [16.6, 38], [13.6, 58], [10.8, 76], [8.8, 88], [5.5, 96], [1, 100], [-7, 103], [-20, 106], [-45, 109], [-90, 113]];
const LEFT = -90, FARZ = 113;
// props (metres): barrier at Z 9, toll gate at Z 21, permit booth at Z 33, the house at the bend at Z 78
const BZ = 9, PIV = [-3.6, 1.0], BLEN = 7.4;
const TOLL = { x0: 4.2, x1: 6.4, z0: 21, z1: 22.8, h: 2.5, armX: 3.7, armZ: 20.7, armLen: 6.5, basX: 3.05, basZ: 19.6 };
const PERM = { x0: -5.0, x1: -3.4, z0: 33, z1: 34.6, h: 2.4, peak: 3.15, win: [-4.78, -3.62, 1.02, 1.7] };
const HOUSE = { x0: -7.4, x1: -1.7, z0: 78, z1: 84, y: gY(78), h: 3.0, peak: 5.3 };
export const WIN = { x: -4.0, y: HOUSE.y + 1.5, z: HOUSE.z0, hw: .5, hh: .48 };   // the lit kitchen pane (centre, half sizes)
const SUN = '#ffbf80';
const INK = 'rgba(6,6,18,.62)';

// ---------------------------------------------------------------- light over time
// D: night → dawn → sunrise (sky, ground, mist); the ridge behind you holds the near road in shadow until the sun clears it
const dawnOf = (t, K) => clamp(1 - Math.pow(1 - smr(K.b0 - 1.2, K.you2 + .2, t), 1.35));
const ZR = 40 - 250, HR = 18, YR = gY(ZR) + HR;                   // the ridge behind the camera: 250 m behind the stop, 18 m over its foot
// the plateau falls 10 % away from the sun, so everything is solved on the slope: tan e puts the ridge-shadow front at Zf
const tanAt = (Zf) => (YR + SLOPE * Zf) / (Zf - ZR);
function tanE(t, K) {                                              // tan(sun elevation): rises steadily, slows once the front has reached you
  const a = tanAt(420), b = tanAt(40), u = (t - K.sun0) / (K.you2 - K.sun0);
  return u <= 1 ? mix(a, b, Math.max(0, u)) : b + (b - a) * (1 - Math.exp(-(u - 1) * 4)) / 4;
}
const frontZ = (t, K) => { if (t < K.sun0) return 1e6; const te = tanE(t, K); return (YR + te * ZR) / (te - SLOPE); };
const litAt = (t, K, Z, h) => { if (t < K.sun0 - .4) return 0; const te = tanE(t, K); return smo((Z - (YR + te * ZR - h) / (te - SLOPE)) / 3 + .5); };
const SAZ = .2;                                                    // shadows run down the road and a little to the right
const shadowLen = (t, K, h) => h / (tanE(t, K) - SLOPE * Math.cos(SAZ));   // horizontal length of a shadow on the falling ground

// ---------------------------------------------------------------- the camera
let _K = null, CZ, CX, YAW, EYE;
function paths(K) {
  if (_K === K) return; _K = K;
  CZ = mono([[K.b0 + 1.5, 0], [K.nothing + .45, .8], [K.money - .1, 9.6], [K.permission - .05, 20.6], [K.permission + .7, 25.2], [K.you2 + .04, 40]]);
  CX = mono([[K.nothing + .5, 0], [K.money, .35], [K.permission - .45, -1.2], [K.permission + .45, -1.9], [K.you2, -.5]]);
  YAW = mono([[K.permission - .8, 0], [K.permission - .05, -.11], [K.permission + .6, -.11], [K.you2 - .1, 0]]);
  EYE = mono([[K.nothing + .5, 1.95], [K.permission + .2, 1.65]]);
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
  if (t > K.push0) {                                               // the fly into the lit window: exponential approach on a low arc, aim settles on the pane
    const u = clamp((t - K.push0) / (K.cut - K.push0)), E = qio(u);
    const dx = WIN.x - c.x, dy = WIN.y - c.y, dz = WIN.z - c.z, d0 = Math.hypot(dx, dy, dz), d1 = .3, d = d0 * Math.pow(d1 / d0, E), k = 1 - d / d0;
    const x = c.x + dx * k, z = c.z + dz * k, y = c.y + dy * k + 1.5 * 4 * k * (1 - k) * Math.sqrt(1 - k);
    const ay = Math.atan2(WIN.x - x, WIN.z - z), ap = Math.atan2(WIN.y - y, Math.hypot(WIN.x - x, WIN.z - z)), w = smo(clamp(E * 1.7));
    return { x, y, z, yaw: mix(c.yaw, ay, w), pitch: mix(c.pitch, ap, w), f: F0, _d: d };
  }
  return c;
}

// ---------------------------------------------------------------- projection helpers
const camOf = (o) => { const cy = Math.cos(o.yaw || 0), sy = Math.sin(o.yaw || 0), cp = Math.cos(o.pitch || 0), sp = Math.sin(o.pitch || 0);
  return ([X, Y, Z]) => { const dx = X - o.x, dy = Y - o.y, dz = Z - o.z, xc = dx * cy - dz * sy, zc0 = dx * sy + dz * cy; return [xc, dy * cp - zc0 * sp, dy * sp + zc0 * cp]; }; };
function projPoly(P, pts, zn = .35) {          // world polygon → screen, clipped at the near plane (Sutherland–Hodgman on z = zn)
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
const inkPoly = (ctx, pts, lw = 1.1, col = INK) => { if (pts.length < 3) return; polyPath(ctx, pts); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); };
const id = (ctx) => ctx.setTransform(1, 0, 0, 1, 0, 0);
function edgeAt(Z) { for (let i = 1; i < EDGE.length; i++) if (Z <= EDGE[i][1]) { const [x0, z0] = EDGE[i - 1], [x1, z1] = EDGE[i]; return mix(x0, x1, clamp((Z - z0) / (z1 - z0))); } return EDGE[EDGE.length - 1][0]; }
function plateau(Zn) {                         // the plateau surface from depth Zn on (world polygon on the sloping plane)
  const pts = [[LEFT, gY(Zn), Zn], [edgeAt(Zn), gY(Zn), Zn]];
  for (const [x, z] of EDGE) if (z > Zn) pts.push([x, gY(z), z]);
  pts.push([LEFT, gY(FARZ), FARZ]); return pts;
}
function roadPoly(Zn, Z1 = 92) {
  const L = [], R = [], zs = [Zn]; if (Zn < 70) zs.push(70);
  for (let z = Math.max(70, Math.ceil(Zn)) + 1.5; z <= Z1; z += 1.5) zs.push(z);
  for (const z of zs) { const c = roadX(z), sl = z > 70 ? Math.atan(2 * .04 * (z - 70)) : 0, w = RW / Math.cos(sl); L.push([c - w, gY(z), z]); R.push([c + w, gY(z), z]); }
  return [...L, ...R.reverse()];
}

// ---------------------------------------------------------------- the far valley (one cached backdrop in tangent space: a = X/Z, b = Y/Z)
const FI = { F: 1500, AL: -1.25, AR: 1.15, BB: -.22, BT: .125 };
FI.W = Math.round((FI.AR - FI.AL) * FI.F); FI.H = Math.round((FI.BT - FI.BB) * FI.F);
const fu = (a) => (a - FI.AL) * FI.F, fv = (b) => (FI.BT - b) * FI.F;
function ridge(seed, base, amp, fr, peaks = []) {
  const n = vnoise(seed);
  return (a) => { let b = base + amp * (fbm(n, a * fr + seed * .37, .7, 5) - .45); for (const [pa, pw, ph] of peaks) b += ph * Math.exp(-(((a - pa) / pw) ** 2)); return b; };
}
const R1 = ridge(11, .04, .05, 2.2, [[-.42, .22, .03], [.62, .3, .02]]);
const R2 = ridge(23, .012, .03, 3.6, [[.95, .25, .028], [-1.0, .3, .035]]);
const VFY = -100;                                                  // the valley floor, 100 m below the road's start
const riverX = (Zd) => -240 + 200 * Math.sin(Zd / 520 + .6) + 80 * Math.sin(Zd / 190 + 2.1) + .05 * Zd;
function fogBand(g, y, hh, col, a, seed, x0 = 0, x1 = FI.W) {     // a soft band of fog with a slow noise along it (cached use only)
  const n = vnoise(seed);
  for (let x = x0; x < x1; x += 6) {
    const k = clamp((fbm(n, x * .0025, seed * .1, 4) - .28) * 2.2), yy = y + (fbm(n, x * .004, 3.1, 3) - .5) * hh * .8, h2 = hh * (.6 + .8 * k);
    const lg = g.createLinearGradient(0, yy - h2, 0, yy + h2); lg.addColorStop(0, rgba(col, 0)); lg.addColorStop(.5, rgba(col, a * k)); lg.addColorStop(1, rgba(col, 0));
    g.fillStyle = lg; g.fillRect(x, yy - h2, 7, h2 * 2);
  }
}
function contours(g, Rf, col, gap, depth, seed) {                 // engraved lines that follow a ridge's shape down its slopes
  const r = prng(seed); g.strokeStyle = col; g.lineWidth = .9;
  for (let k = 1; k * gap < depth; k++) { g.beginPath(); const off = k * gap, br = r(); let on = false;
    for (let x = 0; x <= FI.W; x += 6) { const y = fv(Rf(FI.AL + x / FI.F)) + off + Math.sin(x * .013 + k) * 1.5; const vis = Math.sin(x * .004 + k * 1.7 + br * 6) > -.35;
      if (vis) { on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; } else on = false; }
    g.stroke(); }
}
function farLayers() {
  return once('c13road_far', () => {
    const [c, g] = canvas(FI.W, FI.H), r = prng(808);
    const fillRidge = (Rf, top, bot) => { g.beginPath(); g.moveTo(0, FI.H); for (let x = 0; x <= FI.W; x += 4) g.lineTo(x, fv(Rf(FI.AL + x / FI.F))); g.lineTo(FI.W, FI.H); g.closePath();
      const lg = g.createLinearGradient(0, fv(.09), 0, fv(-.04)); lg.addColorStop(0, top); lg.addColorStop(1, bot); g.fillStyle = lg; g.fill(); };
    fillRidge(R1, '#4c5383', '#353c6a');
    g.save(); g.beginPath(); g.moveTo(0, FI.H); for (let x = 0; x <= FI.W; x += 4) g.lineTo(x, fv(R1(FI.AL + x / FI.F))); g.lineTo(FI.W, FI.H); g.closePath(); g.clip();
    contours(g, R1, 'rgba(150,158,200,.16)', 7, 60, 3); g.restore();
    fogBand(g, fv(.004), 26, '#7d84ad', .5, 4);
    fillRidge(R2, '#30376a', '#232a58');
    g.save(); g.beginPath(); g.moveTo(0, FI.H); for (let x = 0; x <= FI.W; x += 4) g.lineTo(x, fv(R2(FI.AL + x / FI.F))); g.lineTo(FI.W, FI.H); g.closePath(); g.clip();
    contours(g, R2, 'rgba(130,140,190,.14)', 6, 70, 5);
    const fy = (Zd) => fv(VFY / Zd), fx = (X, Zd) => fu(X / Zd);
    { const lg = g.createLinearGradient(0, fy(5000), 0, FI.H); lg.addColorStop(0, '#2c3362'); lg.addColorStop(1, '#171c40'); g.fillStyle = lg; g.fillRect(0, fy(4200), FI.W, FI.H); }
    for (let Zd = 560; Zd < 4200; Zd *= 1.12) {
      const z2 = Zd * 1.12, y0 = fy(Zd), y1 = fy(z2);
      for (let X = -3600; X < 3600;) { const w = 130 + r() * 240, q = [[fx(X, Zd), y0], [fx(X + w, Zd), y0], [fx(X + w, z2), y1], [fx(X, z2), y1]];
        g.fillStyle = r() < .5 ? 'rgba(70,80,120,.22)' : 'rgba(20,24,52,.25)'; polyPath(g, q); g.fill();
        g.strokeStyle = 'rgba(10,12,30,.4)'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(q[0][0], q[0][1]); g.lineTo(q[3][0], q[3][1]); g.stroke();
        X += w + 8 + r() * 20; }
    }
    { const pts = []; for (let Zd = 600; Zd < 9000; Zd *= 1.015) pts.push([fx(riverX(Zd), Zd), fy(Zd), 22 / Zd * FI.F]);
      g.lineCap = 'round';
      for (const [col, k] of [['rgba(12,14,34,.6)', 1.35], ['#3e4a78', 1.0], ['rgba(140,154,196,.42)', .26]]) { g.strokeStyle = col;
        for (let i = 1; i < pts.length; i++) { g.lineWidth = Math.max(.7, pts[i][2] * k); g.beginPath(); g.moveTo(pts[i - 1][0], pts[i - 1][1]); g.lineTo(pts[i][0], pts[i][1]); g.stroke(); } } }
    const town = [];
    for (let i = 0; i < 80; i++) { const Zd = 1050 + r() * 600, X = 170 + r() * 480 + (Zd - 1050) * .2; town.push([X, Zd]); }
    town.sort((p, q) => q[1] - p[1]);
    for (const [X, Zd] of town) {
      const x = fx(X, Zd), y = fy(Zd), s = FI.F / Zd, w = (9 + r() * 7) * s, h = (6 + r() * 4) * s, rh = (4 + r() * 3) * s;
      g.fillStyle = r() < .5 ? '#3c4472' : '#333a66'; g.fillRect(x - w / 2, y - h, w, h);
      g.fillStyle = r() < .5 ? '#1f2448' : '#2a2446'; g.beginPath(); g.moveTo(x - w / 2 - 1, y - h); g.lineTo(x, y - h - rh); g.lineTo(x + w / 2 + 1, y - h); g.closePath(); g.fill();
      if (r() < .32) { g.fillStyle = 'rgba(255,180,100,.85)'; g.fillRect(x - w * .2, y - h * .62, Math.max(1.2, w * .14), Math.max(1.2, h * .22)); }
    }
    { const Zd = 1320, X = 400, x = fx(X, Zd), y = fy(Zd), s = FI.F / Zd;
      g.fillStyle = '#434b7a'; g.fillRect(x - 4 * s, y - 34 * s, 8 * s, 34 * s); g.fillStyle = '#20244a'; g.beginPath(); g.moveTo(x - 5.4 * s, y - 34 * s); g.lineTo(x, y - 45 * s); g.lineTo(x + 5.4 * s, y - 34 * s); g.closePath(); g.fill();
      g.fillStyle = '#d9d4c4'; g.beginPath(); g.arc(x, y - 28 * s, 2.3 * s, 0, TAU); g.fill(); g.strokeStyle = '#20244a'; g.lineWidth = .8; g.beginPath(); g.moveTo(x, y - 28 * s); g.lineTo(x, y - 29.8 * s); g.moveTo(x, y - 28 * s); g.lineTo(x + 1.2 * s, y - 28 * s); g.stroke(); }
    g.restore();
    fogBand(g, fy(1500), 18, '#8d94bb', .55, 7); fogBand(g, fy(900), 26, '#7880a8', .42, 9); fogBand(g, fy(650), 30, '#6a729c', .35, 13);
    stip(c, .35, 9);
    return c;
  });
}
function farDark() {   // the backdrop as one dark silhouette: drawn over it with alpha = how much night is left (rising out of the dark)
  return once('c13road_fardark', () => { const src = farLayers(), [c, g] = canvas(FI.W, FI.H); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#080a1e'; g.fillRect(0, 0, FI.W, FI.H); return c; });
}
function farLit() {    // the alpenglow: the far ridges and the town catch the sun before you do (drawn 'lighter'); smooth, no stipple on the rim
  return once('c13road_farlit', () => {
    const [c, g] = canvas(FI.W, FI.H);
    for (const [Rf, a, d] of [[R1, .34, 46], [R2, .2, 30]]) {
      g.save(); g.beginPath(); g.moveTo(0, FI.H); for (let x = 0; x <= FI.W; x += 4) g.lineTo(x, fv(Rf(FI.AL + x / FI.F))); g.lineTo(FI.W, FI.H); g.closePath(); g.clip();
      for (let x = 0; x < FI.W; x += 3) { const y = fv(Rf(FI.AL + x / FI.F)), lg = g.createLinearGradient(0, y, 0, y + d); lg.addColorStop(0, `rgba(255,170,124,${a})`); lg.addColorStop(.35, `rgba(255,160,120,${a * .45})`); lg.addColorStop(1, 'rgba(255,150,120,0)'); g.fillStyle = lg; g.fillRect(x, y - 1, 3, d + 1); }
      g.restore();
    }
    { const fy = (Zd) => fv(VFY / Zd); const lg = g.createLinearGradient(0, fy(2400), 0, fy(800)); lg.addColorStop(0, 'rgba(255,170,120,.14)'); lg.addColorStop(1, 'rgba(255,170,120,0)'); g.fillStyle = lg; g.fillRect(0, fy(2400), FI.W, fy(800) - fy(2400)); }
    for (const [Rf, a] of [[R1, .34], [R2, .2]]) { g.strokeStyle = `rgba(255,196,150,${a})`; g.lineWidth = 1; g.beginPath(); for (let x = 0; x <= FI.W; x += 4) { const y = fv(Rf(FI.AL + x / FI.F)) + .5; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    return c;
  });
}
function drawFar(ctx, P, t, K, D) {
  const o = P.o, Db = 4000, pr = (u, v) => P(o.x + (FI.AL + u / FI.F) * Db, o.y + (FI.BT - v / FI.F) * Db, o.z + Db);
  const n = Math.abs(o.yaw || 0) > .01 ? 28 : 1;
  ctx.save(); id(ctx);
  projSprite(ctx, farLayers(), pr, n, 1);
  const fl = smr(K.permission - .4, K.you2 + .3, t); if (fl > 0) { ctx.globalCompositeOperation = 'lighter'; projSprite(ctx, farLit(), pr, n, fl); ctx.globalCompositeOperation = 'source-over'; }
  const dk = (1 - D) * .55; if (dk > .004) projSprite(ctx, farDark(), pr, n, dk);
  ctx.restore();
}

// ---------------------------------------------------------------- sky
const STARS = (() => { const r = prng(77), s = []; for (let i = 0; i < 170; i++) s.push([(r() - .5) * 2.4, .06 + Math.pow(r(), .7) * .7, .5 + r() * 1.1, r() * TAU]); return s; })();
function skyCols(D, S) {
  const c = {
    top: pal(D, [[0, '#0a0d2a'], [.5, '#141c46'], [1, '#202d5a']]),
    hi: pal(D, [[0, '#0e1236'], [.5, '#1e285a'], [1, '#33437a']]),
    m: pal(D, [[0, '#141842'], [.5, '#2c376c'], [1, '#4a5a8e']]),
    bv: pal(D, [[0, '#1a1e4c'], [.5, '#4c4c7c'], [1, '#86769a']]),
    es: pal(D, [[0, '#1e2250'], [.5, '#3e4676'], [1, '#666c96']]),
    hz: pal(D, [[0, '#23274f'], [.5, '#55577e'], [1, '#a6909e']]),
  };
  if (S > 0) { c.hz = mixHex(c.hz, '#d6a894', S * .7); c.bv = mixHex(c.bv, '#b48ea0', S * .5); c.es = mixHex(c.es, '#8a86a6', S * .4); }
  return c;
}
function drawSky(ctx, P, t, K, D) {
  const o = P.o, F = P.F, oy = o.oy ?? H / 2, ys = (e) => oy - F * Math.tan(e - o.pitch), S = smr(K.sun0, K.you2 + .4, t), C = skyCols(D, S);
  const y0 = ys(.75), y1 = ys(0), L = y1 - y0, st = (e) => clamp((ys(e) - y0) / L);
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, C.top); g.addColorStop(st(.34), C.hi); g.addColorStop(st(.15), C.m); g.addColorStop(st(.065), C.bv); g.addColorStop(st(.025), C.es); g.addColorStop(1, C.hz);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const sa = clamp(1 - D * 1.6); if (sa > 0) {
    for (const [a, e, s, ph] of STARS) { const x = (o.ox ?? W / 2) + F * Math.tan(a - (o.yaw || 0)), y = ys(e); if (x < -5 || x > W + 5 || y < -5 || y > H) continue;
      ctx.fillStyle = `rgba(243,239,226,${sa * (.45 + .4 * Math.sin(t * 1.3 + ph))})`; ctx.beginPath(); ctx.arc(x, y, s * Math.min(2, F / F0) ** .3, 0, TAU); ctx.fill(); }
  }
  const cl = clouds();
  for (const [a, e, w, k] of [[-.55, .21, .5, 0], [.22, .28, .62, 1], [.7, .15, .42, 2], [-.12, .11, .36, 1]]) {
    const x = (o.ox ?? W / 2) + F * Math.tan(a + t * .0016 - (o.yaw || 0)), y = ys(e), ww = F * w, hh = ww * .1;
    if (x + ww < 0 || x - ww > W || y < -hh || y > H + hh) continue;
    ctx.save(); ctx.globalAlpha = .5 + .2 * D; ctx.drawImage(cl[k], x - ww / 2, y - hh / 2, ww, hh); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(clamp(D * 1.2 - .2) * .55 + S * .3); ctx.drawImage(cl[3 + k], x - ww / 2, y - hh / 2, ww, hh); ctx.restore();
  }
}
function clouds() {
  return onceRaw('c13road_clouds', () => {
    const out = [];
    for (let k = 0; k < 6; k++) {
      const [c, g] = canvas(900, 90), r = prng(31 + (k % 3) * 7), n = vnoise(40 + (k % 3));
      for (let i = 0; i < 26; i++) { const x = 60 + r() * 780, y = 38 + (r() - .5) * 30, w = 120 + r() * 260, h = 6 + r() * 12;
        const lg = g.createLinearGradient(0, y - h, 0, y + h); if (k < 3) { lg.addColorStop(0, 'rgba(110,114,160,0)'); lg.addColorStop(.4, 'rgba(110,114,160,.35)'); lg.addColorStop(1, 'rgba(60,64,110,0)'); }
        else { lg.addColorStop(0, 'rgba(255,170,150,0)'); lg.addColorStop(.6, 'rgba(255,170,150,0)'); lg.addColorStop(.85, 'rgba(255,186,160,.55)'); lg.addColorStop(1, 'rgba(255,186,160,0)'); }
        g.fillStyle = lg; g.beginPath(); g.ellipse(x, y, w / 2, h, 0, 0, TAU); g.fill(); }
      const d = g.getImageData(0, 0, 900, 90), p = d.data; for (let y = 0; y < 90; y++) for (let x = 0; x < 900; x++) { const i = (y * 900 + x) * 4 + 3, f = fbm(n, x * .012, y * .05, 3); p[i] *= clamp((f - .3) * 2.4) * clamp(Math.min(x, 900 - x) / 140); }
      g.putImageData(d, 0, 0); stip(c, .6, k + 3); out.push(toImg(c));
    }
    return out;
  }).map(best);
}

// ---------------------------------------------------------------- trees (cached engraved sprites; base at the bottom centre)
function treeDraw(k, litV) {      // one engraved tree; litV = the same tree front-lit by the low sun behind the camera (identical geometry)
  const Wt = 300, Ht = 380, [c, g] = canvas(Wt, Ht), r = prng(91 + k * 13), n = vnoise(60 + k);
  g.fillStyle = litV ? '#4a3a34' : '#1e1a26'; g.beginPath(); g.moveTo(Wt / 2 - 9, Ht); g.quadraticCurveTo(Wt / 2 - 6, Ht - 90, Wt / 2 - 3 + (r() - .5) * 10, Ht - 170); g.lineTo(Wt / 2 + 5, Ht - 170); g.quadraticCurveTo(Wt / 2 + 6, Ht - 90, Wt / 2 + 10, Ht); g.closePath(); g.fill();
  const lobes = []; for (let i = 0; i < 16; i++) { const a = r() * TAU, d = r() * 70; lobes.push([Wt / 2 + Math.cos(a) * d * 1.3, Ht - 230 + Math.sin(a) * d * .9, 40 + r() * 40]); }
  lobes.sort((p, q) => p[1] - q[1]);
  const cols = litV ? ['#7c6e56', '#4a4a48', '#262838'] : ['#2c3a56', '#1a2440', '#0f1428'];
  for (const [x, y, rr] of lobes) { const lg = g.createLinearGradient(0, y - rr, 0, y + rr); lg.addColorStop(0, cols[0]); lg.addColorStop(.5, cols[1]); lg.addColorStop(1, cols[2]); g.fillStyle = lg; g.beginPath();
    for (let j = 0; j <= 24; j++) { const a = j / 24 * TAU, rad = rr * (.86 + .22 * fbm(n, Math.cos(a) * 2 + x * .01, Math.sin(a) * 2 + y * .01, 3)); const px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad * .9; j ? g.lineTo(px, py) : g.moveTo(px, py); }
    g.closePath(); g.fill(); }
  g.globalCompositeOperation = 'source-atop'; g.strokeStyle = litV ? 'rgba(20,14,24,.42)' : 'rgba(4,6,16,.5)'; g.lineWidth = 1.1; g.beginPath();
  for (let x = -Ht; x < Wt + Ht; x += 4) { g.moveTo(x, Ht - 120); g.lineTo(x + 120, Ht - 330); } g.stroke();
  g.fillStyle = litV ? 'rgba(255,214,160,.12)' : 'rgba(140,160,200,.1)'; for (let i = 0; i < 140; i++) { const x = Wt / 2 + (r() - .5) * 200, y = Ht - 300 + r() * 90; g.beginPath(); g.arc(x, y, 1.2 + r() * 2, 0, TAU); g.fill(); }
  g.globalCompositeOperation = 'source-over'; stip(c, .5, k + 1);
  return c;
}
function treeSprite(k) { return once('c13road_tree' + k, () => treeDraw(k, false)); }
function treeLit(k) { return once('c13road_treelit' + k, () => treeDraw(k, true)); }
const TREES = [[-11, 27, 7.5, 0], [-17, 48, 9, 1], [-10.5, 66, 6, 2], [-11.5, 86, 8, 0], [-26, 96, 9, 1], [-38, 100, 10, 2], [-55, 104, 11, 0], [15, 42, 6.5, 2], [-30, 14, 9, 1], [11.5, 64, 5.5, 1]];

// ---------------------------------------------------------------- the props
// the barrier at Z 9: pivot post (left), the red-and-white boom with its reflector edge, counterweight, a no-entry disc under it, the
// fork post (right) with the latch that drops on "catch" and a padlock dangling from it
function barrier(ctx, P, t, K, D, lit) {
  const q = planeXY(ctx, P, 0, gY(BZ), BZ); if (!q) return null;
  const px = (v) => v / q;
  const th = 1.36 * smo(clamp((t - K.nothing) / .95)) ** 1.15 * (1 + .03 * bump(t, K.nothing + .8, K.nothing + 1.3));
  const tl = K.catch - .2, psi = t < tl ? 1.45 : t < K.catch ? 1.45 * (1 - eiX((t - tl) / .2)) : t < K.nothing - .12 ? -.06 * Math.exp(-(t - K.catch) * 9) * Math.sin((t - K.catch) * 30) : 1.45 * eoX((t - K.nothing + .12) / .3);
  const ivory = mixHex('#5a5866', '#d9d1bd', .2 + .8 * D), red = mixHex('#3a161c', '#a52f26', .25 + .75 * D), iron = mixHex('#121220', '#2c2c3c', D), ironL = mixHex('#2a2a3c', '#5a5a6e', D);
  const post = (x0, x1, h) => { ctx.fillStyle = iron; ctx.fillRect(x0, -h, x1 - x0, h); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x0 + (x1 - x0) * .62, -h, (x1 - x0) * .38, h); ctx.fillStyle = rgba(ironL, .7); ctx.fillRect(x0, -h, px(1.6), h);
    ctx.strokeStyle = INK; ctx.lineWidth = px(1.1); ctx.strokeRect(x0, -h, x1 - x0, h); };
  post(-3.82, -3.38, .98); ctx.fillStyle = iron; ctx.fillRect(-3.98, -.13, .76, .13); ctx.strokeStyle = INK; ctx.lineWidth = px(1); ctx.strokeRect(-3.98, -.13, .76, .13);
  ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = px(1); ctx.beginPath(); for (let v = .16; v < .95; v += .07) { ctx.moveTo(-3.8, -v); ctx.lineTo(-3.4, -v - .05); } ctx.stroke();
  post(3.55, 3.66, .9);
  ctx.fillStyle = iron; ctx.fillRect(3.46, -.93, .29, .04); ctx.fillRect(3.46, -1.13, .045, .24); ctx.fillRect(3.705, -1.13, .045, .24);
  ctx.save(); ctx.translate(PIV[0], -PIV[1]); ctx.rotate(-th);
  const L = BLEN, hw = .06;
  ctx.fillStyle = iron; ctx.fillRect(-.85, -hw, 1.0, hw * 2);
  ctx.fillStyle = iron; ctx.fillRect(-.92, -.15, .44, .29); ctx.fillStyle = rgba(ironL, .6); ctx.fillRect(-.92, -.15, .44, px(1.6)); ctx.strokeStyle = INK; ctx.lineWidth = px(1); ctx.strokeRect(-.92, -.15, .44, .29);
  for (let i = 0; ; i++) { const a = .15 + i * .62, b = Math.min(L, a + .62); if (a >= L) break; ctx.fillStyle = (Math.floor((L - a) / .62 + .001) % 2 === 0) ? red : ivory; ctx.fillRect(a, -hw, b - a, hw * 2); }
  { const lg = ctx.createLinearGradient(0, -hw, 0, hw); lg.addColorStop(0, 'rgba(255,255,255,.16)'); lg.addColorStop(.35, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(6,6,20,.55)'); ctx.fillStyle = lg; ctx.fillRect(.15, -hw, L - .15, hw * 2); }
  ctx.strokeStyle = 'rgba(8,8,22,.4)'; ctx.lineWidth = px(.9); ctx.beginPath(); for (let k = 1; k < 4; k++) { const y = hw * (.1 + k * .22); ctx.moveTo(.2, y); ctx.lineTo(L, y); } ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = px(1.2); ctx.strokeRect(-.85, -hw, L + .85, hw * 2);
  const sx = 4.1; ctx.strokeStyle = iron; ctx.lineWidth = px(1.8); ctx.beginPath(); ctx.arc(sx - .08, hw + .025, .022, 0, TAU); ctx.moveTo(sx + .1, hw + .025); ctx.arc(sx + .08, hw + .025, .022, 0, TAU); ctx.stroke();
  ctx.fillStyle = mixHex('#30121a', '#b5352a', .25 + .75 * D); ctx.beginPath(); ctx.arc(sx, hw + .25, .2, 0, TAU); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = px(1.2); ctx.stroke();
  ctx.strokeStyle = ivory; ctx.lineWidth = .02; ctx.beginPath(); ctx.arc(sx, hw + .25, .182, 0, TAU); ctx.stroke(); ctx.fillStyle = ivory; ctx.fillRect(sx - .13, hw + .22, .26, .06);
  if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(SUN, .16 * lit); ctx.fillRect(-.92, -.15, L + .92, .52); ctx.globalCompositeOperation = 'source-over'; }
  ctx.restore();
  ctx.fillStyle = iron; ctx.beginPath(); ctx.arc(PIV[0], -PIV[1], .13, 0, TAU); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = px(1.1); ctx.stroke(); ctx.fillStyle = rgba(ironL, .9); ctx.beginPath(); ctx.arc(PIV[0] - .02, -PIV[1] - .02, .035, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(3.73, -1.13); ctx.rotate(psi); ctx.fillStyle = iron; ctx.fillRect(-.36, -.022, .38, .044); ctx.fillStyle = rgba(ironL, .9); ctx.fillRect(-.36, -.022, .38, px(1.3));
  ctx.translate(-.32, .022); const lk = t > K.catch ? .25 * Math.exp(-(t - K.catch) * 2.5) * Math.sin((t - K.catch) * 8) : 0; ctx.rotate(-psi + lk);
  ctx.strokeStyle = mixHex('#4a463c', '#9a927c', D); ctx.lineWidth = .013; ctx.beginPath(); ctx.arc(0, .036, .029, Math.PI, 0); ctx.stroke(); ctx.fillStyle = mixHex('#3a2c14', '#a07c34', D); ctx.fillRect(-.037, .036, .074, .064); ctx.strokeStyle = INK; ctx.lineWidth = px(1); ctx.strokeRect(-.037, .036, .074, .064);
  ctx.restore();
  if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(SUN, .14 * lit); ctx.fillRect(-3.98, -1.15, 7.8, 1.15); ctx.globalCompositeOperation = 'source-over'; }
  id(ctx);
  return { th, q };
}
// reflector stroke along the boom top, in screen px (identical to lineStroke's core when the boom is flat)
function boomEdge(ctx, P, t, th, a) {
  if (a <= 0) return;
  const c = Math.cos(th), s = Math.sin(th), at = (u) => P(PIV[0] + u * c + .06 * s, gY(BZ) + PIV[1] + u * s + .06 * c, BZ);
  const A = at(.2), B = at(BLEN), br = .9 + .1 * Math.sin(t * 2.1);
  ctx.save(); id(ctx); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  ctx.strokeStyle = rgba('#ffb35c', .55 * br * a); ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  ctx.strokeStyle = rgba('#fff1d6', .95 * a); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  ctx.restore();
}
function box(ctx, P, cam, b, paint) {           // a box's visible faces (back-face culled), each painted with its projected polygon
  const { x0, x1, y0, y1, z0, z1 } = b, F = [];
  if (cam.z < z0) F.push(['front', [[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]]]);
  if (cam.x < x0) F.push(['left', [[x0, y1, z1], [x0, y1, z0], [x0, y0, z0], [x0, y0, z1]]]);
  if (cam.x > x1) F.push(['right', [[x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [x1, y0, z0]]]);
  if (cam.y > y1) F.push(['top', [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]]]);
  else if (cam.y < y0) F.push(['bottom', [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]]);
  for (const [k, pts] of F) { const s = projPoly(P, pts); if (s.length >= 3) paint(k, s, pts); }
}
const planks = (ctx, P, a, b, n, col, lw = 1) => {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  for (let i = 1; i < n; i++) { const k = i / n, A = a[0].map((v, j) => mix(v, b[0][j], k)), B = a[1].map((v, j) => mix(v, b[1][j], k)), s = projSeg(P, A, B); if (s) { ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); } }
  ctx.stroke();
};
// the toll gate: booth with a canopy ("TOLL"), the striped arm on its motor post, the coin basket on a pole (empty)
function tollGate(ctx, P, cam, t, K, D, lit) {
  const T = TOLL, gy = gY(T.z0), wall = mixHex('#3c3a50', '#bdb49c', .2 + .8 * D), wallS = mixHex('#1e1d2e', '#6e6a74', .2 + .8 * D), dark = '#0e0d18';
  const up = 1.3 * qio((t - K.money) / .5) ** .9;
  box(ctx, P, cam, { x0: T.x0, x1: T.x1, y0: gy, y1: gy + T.h, z0: T.z0, z1: T.z1 }, (k, s, w) => {
    fillPoly(ctx, s, k === 'front' ? wall : k === 'top' ? '#1e1d2a' : wallS);
    if (k === 'front' || k === 'left') planks(ctx, P, [w[3], w[2]], [w[0], w[1]], 12, 'rgba(14,12,28,.28)');
    if (k === 'left') hatchPoly(ctx, s, -1.05, 4, 'rgba(6,6,18,.22)', 1);
    inkPoly(ctx, s);
  });
  { const q = planeXY(ctx, P, T.x0, gy, T.z0); if (q) {
    ctx.fillStyle = dark; ctx.fillRect(.45, -1.95, 1.3, .85); ctx.fillStyle = 'rgba(140,160,210,.16)'; ctx.beginPath(); ctx.moveTo(.45, -1.95); ctx.lineTo(.95, -1.95); ctx.lineTo(.6, -1.1); ctx.lineTo(.45, -1.1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = wall; ctx.lineWidth = .05; ctx.strokeRect(.45, -1.95, 1.3, .85); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(.4, -1.08, 1.4, .05); } id(ctx); }
  { const s = projPoly(P, [[T.x0, gy + 1.85, T.z0 + .35], [T.x0, gy + 1.85, T.z0 + 1.35], [T.x0, gy + 1.0, T.z0 + 1.35], [T.x0, gy + 1.0, T.z0 + .35]]); if (cam.x < T.x0 && s.length > 2) { fillPoly(ctx, s, dark); ctx.strokeStyle = wall; ctx.lineWidth = 2; polyPath(ctx, s); ctx.stroke(); } }
  box(ctx, P, cam, { x0: 3.3, x1: 6.8, y0: gy + T.h, y1: gy + T.h + .3, z0: T.z0 - .6, z1: T.z1 + .5 }, (k, s) => { fillPoly(ctx, s, k === 'front' ? mixHex('#2e2e44', '#dcd5c2', .2 + .8 * D) : k === 'bottom' ? '#12111c' : '#22212f'); inkPoly(ctx, s); });
  { const q = planeXY(ctx, P, 3.3, gy + T.h, T.z0 - .6); if (q) { ctx.fillStyle = mixHex('#2a1c28', '#a8342a', .25 + .75 * D); ctx.fillRect(0, -.3, 3.5, .05); ctx.fillRect(0, -.05, 3.5, .05);
    ctx.save(); ctx.translate(1.75, -.085); ctx.scale(.01, .01); text(ctx, 'TOLL', 0, 0, { size: 17, font: 'Inter', weight: 600, color: '#15131f', align: 'center', spacing: 5 }); ctx.restore(); } id(ctx); }
  if (lit > 0) { const s = projPoly(P, [[3.3, gy + T.h + .3, T.z0 - .6], [6.8, gy + T.h + .3, T.z0 - .6], [6.8, gy, T.z0 - .6], [3.3, gy, T.z0 - .6]]); ctx.save(); ctx.globalCompositeOperation = 'lighter'; fillPoly(ctx, s, rgba(SUN, .12 * lit)); ctx.restore(); }
  { const az = T.armZ, ay = gY(az), q = planeXY(ctx, P, 0, ay, az); if (q) {
    const px = (v) => v / q, yel = mixHex('#3a3424', '#d2a838', .25 + .75 * D);
    ctx.fillStyle = '#14131e'; ctx.fillRect(3.57, -1.0, .26, 1.0); ctx.fillStyle = yel; for (let v = .05; v < 1; v += .2) ctx.fillRect(3.57, -v - .1, .26, .1); ctx.strokeStyle = INK; ctx.lineWidth = px(1); ctx.strokeRect(3.57, -1.0, .26, 1.0);
    ctx.fillStyle = '#1c1b2c'; ctx.fillRect(3.48, -1.25, .44, .32); ctx.fillStyle = 'rgba(200,210,250,.2)'; ctx.fillRect(3.48, -1.25, .44, px(1.4)); ctx.strokeRect(3.48, -1.25, .44, .32);
    ctx.save(); ctx.translate(3.7, -1.1); ctx.rotate(up);
    for (let i = 0; i < 13; i++) { const a = -.12 - i * .5; ctx.fillStyle = i % 2 ? '#13121e' : yel; ctx.fillRect(a - .5, -.045, .5, .09); }
    ctx.fillStyle = mixHex('#4a1616', '#d0402c', D); ctx.fillRect(-6.62, -.06, .12, .12);
    { const lg = ctx.createLinearGradient(0, -.045, 0, .045); lg.addColorStop(0, 'rgba(255,255,255,.18)'); lg.addColorStop(1, 'rgba(0,0,10,.5)'); ctx.fillStyle = lg; ctx.fillRect(-6.62, -.045, 6.5, .09); }
    ctx.strokeStyle = INK; ctx.lineWidth = px(1.1); ctx.strokeRect(-6.62, -.045, 6.5, .09);
    ctx.restore();
    ctx.fillStyle = '#1c1b2c'; ctx.beginPath(); ctx.arc(3.7, -1.1, .07, 0, TAU); ctx.fill();
  } id(ctx); }
  { const bz = T.basZ, by = gY(bz), q = planeXY(ctx, P, T.basX, by, bz); if (q) {
    const px = (v) => v / q, metal = mixHex('#3a3a4c', '#b4b2b8', .2 + .8 * D), plate = mixHex('#26263a', '#dcd5c2', .2 + .8 * D);
    ctx.fillStyle = '#191826'; ctx.fillRect(-.03, -1.05, .06, 1.05); ctx.fillStyle = rgba(metal, .5); ctx.fillRect(-.03, -1.05, px(1.2), 1.05);
    ctx.fillStyle = plate; ctx.fillRect(-.2, -.86, .4, .27); ctx.strokeStyle = INK; ctx.lineWidth = px(1.2); ctx.strokeRect(-.2, -.86, .4, .27);
    ctx.fillStyle = mixHex('#3a2c14', '#c8963c', .25 + .75 * D); ctx.beginPath(); ctx.arc(0, -.725, .085, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(40,24,6,.75)'; ctx.lineWidth = px(1.2); ctx.beginPath(); ctx.arc(0, -.725, .062, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(12,12,24,.6)'; ctx.beginPath(); ctx.moveTo(-.36, -1.36); ctx.lineTo(.36, -1.36); ctx.lineTo(.1, -1.03); ctx.lineTo(-.1, -1.03); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = metal; ctx.lineWidth = px(1.1); ctx.beginPath(); for (let k = -12; k <= 12; k++) { ctx.moveTo(k * .03, -1.36); ctx.lineTo(k * .0083, -1.03); } for (let v = 0; v < 7; v++) { const y = -1.36 + v * .05, w = mix(.36, .1, v / 6.6); ctx.moveTo(-w, y); ctx.lineTo(w, y); } ctx.stroke(); ctx.restore();
    ctx.strokeStyle = metal; ctx.lineWidth = Math.max(px(2.2), .022); ctx.beginPath(); ctx.ellipse(0, -1.36, .36, .03, 0, 0, TAU); ctx.stroke();
    ctx.fillStyle = metal; ctx.fillRect(-.11, -1.045, .22, .035);
  } id(ctx); }
}
// the permit booth: a sentry box with a gable, "PERMITS" over the window, a roller shutter that rolls up on "permission":
// nobody inside, an empty chair, a blank form pinned up inside the glass, the stamp unused on the ledge
function permitBooth(ctx, P, cam, t, K, D, lit) {
  const B = PERM, gy = gY(B.z0), paint = mixHex('#1c2430', '#46605c', .2 + .8 * D), trim = mixHex('#3a3848', '#d8d0bc', .2 + .8 * D), dark = '#0e0d16';
  const open = eoX(clamp((t - K.permission - .02) / .5)) * (1 - .04 * bump(t, K.permission + .42, K.permission + .62));
  box(ctx, P, cam, { x0: B.x0, x1: B.x1, y0: gy, y1: gy + B.h, z0: B.z0, z1: B.z1 }, (k, s, w) => {
    fillPoly(ctx, s, k === 'front' ? paint : k === 'top' ? '#14141e' : mixHex(paint, '#06060e', .4));
    if (k !== 'top') planks(ctx, P, [w[3], w[2]], [w[0], w[1]], 11, 'rgba(6,8,16,.3)');
    if (k === 'right' || k === 'left') hatchPoly(ctx, s, -1.05, 4, 'rgba(4,4,12,.22)', 1);
    inkPoly(ctx, s);
  });
  const pk = gy + B.peak, eave = gy + B.h, xm = (B.x0 + B.x1) / 2, o = .14;
  const roofL = projPoly(P, [[B.x0 - o, eave - .05, B.z0 - o], [xm, pk, B.z0 - o], [xm, pk, B.z1 + o], [B.x0 - o, eave - .05, B.z1 + o]]);
  const roofR = projPoly(P, [[xm, pk, B.z0 - o], [B.x1 + o, eave - .05, B.z0 - o], [B.x1 + o, eave - .05, B.z1 + o], [xm, pk, B.z1 + o]]);
  const rlit = mixHex('#2a2232', '#5e3c3a', D), rdark = '#1a1622';
  if (cam.x > xm) { fillPoly(ctx, roofL, rdark); fillPoly(ctx, roofR, rlit); inkPoly(ctx, roofR); } else { fillPoly(ctx, roofR, rdark); fillPoly(ctx, roofL, rlit); inkPoly(ctx, roofL); }
  const q = planeXY(ctx, P, xm, gy, B.z0); if (!q) return;
  const px = (v) => v / q, wx0 = B.win[0] - xm, wx1 = B.win[1] - xm, wy0 = B.win[2], wy1 = B.win[3];
  ctx.fillStyle = paint; ctx.beginPath(); ctx.moveTo(-.8 - o, -B.h + .05); ctx.lineTo(0, -B.peak); ctx.lineTo(.8 + o, -B.h + .05); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = trim; ctx.lineWidth = .05; ctx.beginPath(); ctx.moveTo(-.8 - o, -B.h + .03); ctx.lineTo(0, -B.peak - .02); ctx.lineTo(.8 + o, -B.h + .03); ctx.stroke();
  ctx.fillStyle = trim; ctx.fillRect(-.8, -.2, 1.6, .06); ctx.fillRect(-.8, -B.h, .05, B.h); ctx.fillRect(.75, -B.h, .05, B.h);
  ctx.fillStyle = trim; ctx.fillRect(-.62, -2.2, 1.24, .26); ctx.strokeStyle = INK; ctx.lineWidth = px(1.2); ctx.strokeRect(-.62, -2.2, 1.24, .26);
  ctx.save(); ctx.translate(0, -2.015); ctx.scale(.01, .01); text(ctx, 'PERMITS', 0, 0, { size: 14.5, font: 'Inter', weight: 600, color: '#15131f', align: 'center', spacing: 4 }); ctx.restore();
  ctx.fillStyle = dark; ctx.fillRect(wx0, -wy1, wx1 - wx0, wy1 - wy0);
  ctx.fillStyle = 'rgba(50,60,96,.4)'; ctx.fillRect(wx0, -wy1, wx1 - wx0, .16);
  ctx.fillStyle = '#1c1a26'; ctx.fillRect(wx0 + .62, -wy0 - .38, .05, .38); ctx.fillRect(wx0 + .9, -wy0 - .38, .05, .38); ctx.fillRect(wx0 + .6, -wy0 - .4, .37, .06);
  { const fx = wx0 + .1, fy = -wy1 + .1, fw = .34, fh = .46; ctx.fillStyle = mixHex('#46465a', '#e6decb', .25 + .75 * D); ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = mixHex('#30304a', '#8a6a3a', D); ctx.lineWidth = px(1.1); ctx.strokeRect(fx + .02, fy + .02, fw - .04, fh - .04); ctx.strokeRect(fx + .03, fy + .03, fw - .06, fh - .06);
    ctx.strokeStyle = 'rgba(30,30,50,.45)'; ctx.lineWidth = px(.9); ctx.beginPath(); for (let k = 0; k < 6; k++) { const y = fy + .12 + k * .052; ctx.moveTo(fx + .06, y); ctx.lineTo(fx + fw - .06, y); } ctx.stroke();
    ctx.fillStyle = 'rgba(30,30,50,.5)'; ctx.fillRect(fx + .09, fy + .06, .16, .025); }
  ctx.fillStyle = trim; ctx.fillRect(wx0 - .05, -wy0, wx1 - wx0 + .1, .05);
  ctx.fillStyle = '#4a3024'; ctx.fillRect(wx1 - .25, -wy0 - .07, .05, .07); ctx.fillStyle = '#1a1824'; ctx.fillRect(wx1 - .29, -wy0 - .015, .13, .015);
  const sh = (wy1 - wy0) * (1 - open);
  ctx.fillStyle = mixHex('#2c2e3c', '#8a8c96', .2 + .8 * D); ctx.fillRect(wx0 - .03, -wy1, wx1 - wx0 + .06, sh);
  ctx.strokeStyle = 'rgba(10,10,20,.6)'; ctx.lineWidth = px(1); ctx.beginPath(); for (let y = -wy1 + sh - .001; y > -wy1; y -= .045) { ctx.moveTo(wx0 - .03, y); ctx.lineTo(wx1 + .03, y); } ctx.stroke();
  if (sh > .02) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(wx0 - .03, -wy1 + sh - .02, wx1 - wx0 + .06, .02); ctx.fillStyle = '#1e1d27'; ctx.fillRect(-.05, -wy1 + sh - .045, .1, .03); }
  ctx.fillStyle = mixHex('#24253a', '#727480', .2 + .8 * D); ctx.beginPath(); ctx.roundRect(wx0 - .07, -wy1 - .17, wx1 - wx0 + .14, .17, .05); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = px(1); ctx.stroke();
  if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(SUN, .15 * lit); ctx.fillRect(-1, -B.peak, 2, B.peak); ctx.globalCompositeOperation = 'source-over'; }
  id(ctx);
}
// the house at the bend: gable to the road, the one lit window (the hero light), chimney with smoke
function house(ctx, P, cam, t, K, D, lit) {
  const B = HOUSE, gy = B.y, wall = mixHex('#24263a', '#8c8486', .2 + .8 * D), wallS = mixHex('#141526', '#565062', .2 + .8 * D), roof = mixHex('#130f1a', '#3e2a2e', D);
  box(ctx, P, cam, { x0: B.x0, x1: B.x1, y0: gy - .3, y1: gy + B.h, z0: B.z0, z1: B.z1 }, (k, s, w) => { if (k === 'front') return; fillPoly(ctx, s, k === 'top' ? roof : wallS); if (k === 'right' || k === 'left') { planks(ctx, P, [w[3], w[2]], [w[0], w[1]], 9, 'rgba(6,6,16,.3)'); hatchPoly(ctx, s, -1.05, 4, 'rgba(4,4,12,.2)'); } inkPoly(ctx, s); });
  const xm = (B.x0 + B.x1) / 2, pk = gy + B.peak, eave = gy + B.h, o = .3;
  const rR = projPoly(P, [[xm, pk, B.z0 - o], [B.x1 + o, eave - .25, B.z0 - o], [B.x1 + o, eave - .25, B.z1 + o], [xm, pk, B.z1 + o]]);
  if (cam.x > xm) { fillPoly(ctx, rR, roof); planks(ctx, P, [[B.x1 + o, eave - .25, B.z0 - o], [B.x1 + o, eave - .25, B.z1 + o]], [[xm, pk, B.z0 - o], [xm, pk, B.z1 + o]], 12, 'rgba(0,0,0,.35)'); inkPoly(ctx, rR); }
  { const s = projPoly(P, [[-3.3, pk + .9, B.z0 + 3], [-2.7, pk + .9, B.z0 + 3], [-2.7, pk - .5, B.z0 + 3], [-3.3, pk - .5, B.z0 + 3]]); fillPoly(ctx, s, wallS); inkPoly(ctx, s); smoke(ctx, P, t, -3.0, pk + 1.0, B.z0 + 3, D); }
  const q = planeXY(ctx, P, WIN.x, gy, B.z0); if (!q) return;
  const px = (v) => v / q, x0 = B.x0 - WIN.x, x1 = B.x1 - WIN.x, xc = xm - WIN.x;
  ctx.fillStyle = wall; ctx.beginPath(); ctx.moveTo(x0, .3); ctx.lineTo(x0, -B.h); ctx.lineTo(xc, -B.peak); ctx.lineTo(x1, -B.h); ctx.lineTo(x1, .3); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(10,10,22,.22)'; ctx.lineWidth = Math.max(px(.9), .006); ctx.beginPath();
  for (let y = .3, row = 0; y > -B.peak; y -= .16, row++) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); for (let x = x0 + (row % 2) * .2; x < x1; x += .4) { ctx.moveTo(x, y); ctx.lineTo(x, y - .16); } }
  ctx.stroke();
  const lg = ctx.createLinearGradient(x0, 0, x1, 0); lg.addColorStop(0, 'rgba(0,0,10,.3)'); lg.addColorStop(.6, 'rgba(0,0,10,0)'); ctx.fillStyle = lg; ctx.fillRect(x0, -B.peak, x1 - x0, B.peak + .3);
  const wg = ctx.createRadialGradient(0, -1.5, .3, 0, -1.5, 2.2); wg.addColorStop(0, 'rgba(255,170,90,.35)'); wg.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = wg; ctx.fillRect(x0, -B.peak, x1 - x0, B.peak + .3);
  ctx.restore();
  ctx.strokeStyle = roof; ctx.lineWidth = .24; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0 - o, -B.h + .25); ctx.lineTo(xc, -B.peak - .1); ctx.lineTo(x1 + o, -B.h + .25); ctx.stroke();
  ctx.fillStyle = '#12111e'; ctx.fillRect(xc - .3, -4.3, .6, .55); ctx.strokeStyle = wall; ctx.lineWidth = .05; ctx.strokeRect(xc - .3, -4.3, .6, .55);
  const fr = mixHex('#2c2a38', '#ddd4c0', .2 + .8 * D);
  ctx.fillStyle = fr; ctx.fillRect(-WIN.hw - .09, -1.5 - WIN.hh - .09, WIN.hw * 2 + .18, WIN.hh * 2 + .18); ctx.fillRect(-WIN.hw - .17, -1.5 + WIN.hh + .07, WIN.hw * 2 + .34, .08);
  ctx.strokeStyle = INK; ctx.lineWidth = px(1.1); ctx.strokeRect(-WIN.hw - .09, -1.5 - WIN.hh - .09, WIN.hw * 2 + .18, WIN.hh * 2 + .18);
  for (const sd of [-1, 1]) { const sx0 = sd < 0 ? -WIN.hw - .58 : WIN.hw + .14; ctx.fillStyle = mixHex('#1c2a2a', '#3e5a54', D); ctx.fillRect(sx0, -1.5 - WIN.hh - .06, .44, WIN.hh * 2 + .12);
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = px(1); ctx.beginPath(); for (let v = -1.5 - WIN.hh; v < -1.5 + WIN.hh; v += .07) { ctx.moveTo(sx0 + .04, v); ctx.lineTo(sx0 + .4, v); } ctx.stroke(); ctx.strokeStyle = INK; ctx.strokeRect(sx0, -1.5 - WIN.hh - .06, .44, WIN.hh * 2 + .12); }
  id(ctx);
  return q;
}
function smoke(ctx, P, t, X, Y, Z, D) {
  ctx.save(); id(ctx);
  for (let i = 0; i < 7; i++) { const age = ((t * .25 + i / 7) % 1), p = P(X + age * 2.2 + Math.sin(t * .6 + i) * .2, Y + age * 4, Z); if (p[2] < .5) continue;
    const r = (.3 + age * 1.1) * p[3]; ctx.fillStyle = `rgba(${mix(90, 170, D) | 0},${mix(96, 168, D) | 0},${mix(130, 190, D) | 0},${.16 * (1 - age)})`; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// the lit pane: lightFill clipped to the projected pane, curtains at its sides
function pane(ctx, P, t, K, glowR) {
  const s = projPoly(P, [[WIN.x - WIN.hw, WIN.y + WIN.hh, WIN.z], [WIN.x + WIN.hw, WIN.y + WIN.hh, WIN.z], [WIN.x + WIN.hw, WIN.y - WIN.hh, WIN.z], [WIN.x - WIN.hw, WIN.y - WIN.hh, WIN.z]], .02);
  if (s.length < 3) return null;
  const c = P(WIN.x, WIN.y, WIN.z), hwPx = Math.abs(s[1][0] - s[0][0]) / 2;
  ctx.save(); id(ctx); polyPath(ctx, s); ctx.clip();
  lightFill(ctx, t, { cx: c[0], cy: c[1], R: glowR(hwPx) });
  ctx.restore();
  const q = planeXY(ctx, P, WIN.x, WIN.y, WIN.z + .02);
  if (q) { const cur = (x0, x1, side) => { ctx.fillStyle = 'rgba(150,84,44,.5)'; ctx.beginPath(); ctx.moveTo(x0, -WIN.hh); ctx.lineTo(x1, -WIN.hh); ctx.quadraticCurveTo(x1 - side * .05, 0, x1 - side * .02, WIN.hh); ctx.lineTo(x0, WIN.hh); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(80,40,20,.5)'; ctx.lineWidth = .008; ctx.beginPath(); for (let k = 1; k < 5; k++) { const x = mix(x0, x1, k / 5); ctx.moveTo(x, -WIN.hh); ctx.quadraticCurveTo(x + side * .01, 0, x - side * .01, WIN.hh); } ctx.stroke(); };
    cur(-WIN.hw, -WIN.hw + .14, -1); cur(WIN.hw, WIN.hw - .14, 1); }
  id(ctx);
  return { s, c, hwPx };
}

// ---------------------------------------------------------------- the light that fills the frame (window → kitchen lamp): opaque inside .85 R
export function lightFill(ctx, t, o = {}) {   // o.k (0..1, default 1 = the shared fill): below 1 the same light relaxes into a bulb's glare (outer stops first: no disc edge)
  const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, R = o.R ?? 1500, br = 1 + .025 * Math.sin(t * 2.3) + .015 * Math.sin(t * 5.1), k = clamp(o.k ?? 1);
  const st = (hex, q, r) => { if (k >= 1) return hex; const n = parseInt(hex.slice(1), 16), u = 1 - Math.pow(k, 1 + 4 * r); return `rgba(${Math.round(mix(n >> 16, q[0], u))},${Math.round(mix((n >> 8) & 255, q[1], u))},${Math.round(mix(n & 255, q[2], u))},${mix(1, q[3], u)})`; };
  ctx.save(); id(ctx); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * br);
  g.addColorStop(0, '#fff8ea'); g.addColorStop(.16, st('#ffeccb', [255, 246, 230, 1], .16)); g.addColorStop(.4, st('#ffd796', [255, 226, 180, .62], .4)); g.addColorStop(.66, st('#f5b267', [255, 194, 128, .2], .66)); g.addColorStop(.85, st('#e8964c', [255, 172, 100, .06], .85)); g.addColorStop(1, 'rgba(232,150,76,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * br, 0, TAU); ctx.fill();
  if (k > 0) { const sp = fillSprite(); ctx.globalAlpha = .5 * k; ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(sp, cx - R * .9, cy - R * .9, R * 1.8, R * 1.8);
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1; const r = prng(5);
    for (let i = 0; i < 46; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R * .75, x = cx + Math.cos(a + t * .05) * d + Math.sin(t * .7 + i) * 8, y = cy + Math.sin(a + t * .05) * d * .7 - ((t * 9 + i * 13) % 60), s = .8 + r() * 1.6;
      ctx.fillStyle = `rgba(255,248,230,${(.25 + .25 * Math.sin(t * 3 + i)) * k})`; ctx.beginPath(); ctx.arc(x, y, s * Math.max(.4, R / 1500), 0, TAU); ctx.fill(); } }
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
  const far = P(0, gY(100), 100), yf = far[1];
  const g = ctx.createLinearGradient(0, yf, 0, H);
  g.addColorStop(0, pal(D, [[0, '#161b3c'], [.5, '#2a3460'], [1, '#424c78']])); g.addColorStop(.3, pal(D, [[0, '#11152f'], [.5, '#1e2648'], [1, '#2e3860']])); g.addColorStop(1, pal(D, [[0, '#0a0d22'], [.5, '#121834'], [1, '#1c2442']]));
  ctx.fillStyle = g; polyPath(ctx, gp); ctx.fill();
  ctx.save(); polyPath(ctx, gp); ctx.clip();
  const lc = pal(D, [[0, '#262d58'], [1, '#56618e']]);
  for (let k = 0, Z = Zn + .4; Z < FARZ; k++, Z *= 1.045) {
    const a = clamp(1.1 - (Z - Zn) / 70) * .55; if (a <= .02) break;
    ctx.strokeStyle = rgba(lc, a); ctx.lineWidth = 1; ctx.beginPath(); let on = false;
    for (let X = LEFT; X <= 26; X += 1.5) { const zz = Z + .18 * Math.sin(X * .45 + k * 1.3), p = P(X, gY(zz), zz); if (p[2] < .4) { on = false; continue; } on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; }
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(4,6,18,.45)'; ctx.lineWidth = 1.4; ctx.beginPath();
  for (const X of [-14, -27, -43]) { const s = projSeg(P, [X, gY(Zn), Zn], [X, gY(FARZ - 4), FARZ - 4]); if (s) { ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); } }
  for (const Z of [26, 52, 80]) { const s = projSeg(P, [-6, gY(Z), Z], [LEFT, gY(Z), Z]); if (s) { ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); } }
  ctx.stroke();
  const r = prng(4321);
  ctx.strokeStyle = rgba(pal(D, [[0, '#0c1028'], [1, '#232a4c']]), .85); ctx.lineWidth = 1.1; ctx.beginPath();
  for (let i = 0; i < 1100; i++) {
    const side = r() < .55, X = side ? 3.3 + r() * 13 : -3.3 - r() * 2.4, Z = r() * 78, h = .16 + r() * .26;
    if (Z < cam.z + 1.5 || (side && X > edgeAt(Z) - .4)) continue;
    const a = P(X, gY(Z), Z); if (a[2] < 1 || a[0] < -20 || a[0] > W + 20 || a[1] > H + 10) continue;
    const hp = h * a[3]; if (hp < 1.2) continue;
    for (let j = -1; j <= 1; j++) { ctx.moveTo(a[0] + j * hp * .25, a[1]); ctx.lineTo(a[0] + j * hp * .45 + hp * .1 * Math.sin(t * 1.3 + i), a[1] - hp * (1 - Math.abs(j) * .25)); }
  }
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = 'rgba(4,6,16,.7)'; ctx.lineWidth = 2.2; ctx.beginPath(); let f = true;
  for (let i = 0; i < EDGE.length; i++) { const [x, z] = EDGE[i]; if (z < Zn) continue; const a = P(x, gY(z), z); f ? ctx.moveTo(a[0], a[1]) : ctx.lineTo(a[0], a[1]); f = false; }
  ctx.stroke();
  return gp;
}
function drawRoad(ctx, P, t, K, D, cam, gp) {
  const Zn = cam.z + .6, rp = projPoly(P, roadPoly(Zn));
  if (rp.length < 3) return;
  ctx.save(); polyPath(ctx, gp); ctx.clip();
  const far = P(0, gY(88), 88), g = ctx.createLinearGradient(0, far[1], 0, H);
  g.addColorStop(0, pal(D, [[0, '#1e2242'], [.5, '#363c62'], [1, '#545a7c']])); g.addColorStop(.3, pal(D, [[0, '#14172e'], [.5, '#22263f'], [1, '#30354e']])); g.addColorStop(1, pal(D, [[0, '#0b0d1e'], [.5, '#13162a'], [1, '#1b1f34']]));
  ctx.fillStyle = g; polyPath(ctx, rp); ctx.fill();
  ctx.save(); polyPath(ctx, rp); ctx.clip();
  { const a = P(0, gY(Zn + 2), Zn + 2), b = P(0, gY(70), 70), lg = ctx.createLinearGradient(0, b[1], 0, a[1]); lg.addColorStop(0, rgba(pal(D, [[0, '#3a3e66'], [1, '#9a9cb8']]), .35)); lg.addColorStop(1, rgba(pal(D, [[0, '#3a3e66'], [1, '#9a9cb8']]), 0));
    const s = projPoly(P, [[-1.6, gY(Zn), Zn], [1.6, gY(Zn), Zn], [.5, gY(70), 70], [-.5, gY(70), 70]]); if (s.length > 2) { ctx.fillStyle = lg; polyPath(ctx, s); ctx.fill(); } }
  const dash = rgba(pal(D, [[0, '#5a5a70'], [1, '#d9d2c0']]), .5);
  for (let z0 = Math.ceil(Zn / 9) * 9; z0 < 70; z0 += 9) { const s = projPoly(P, [[-.07, gY(z0), z0], [.07, gY(z0), z0], [.07, gY(z0 + 3), z0 + 3], [-.07, gY(z0 + 3), z0 + 3]]); fillPoly(ctx, s, dash); }
  ctx.strokeStyle = 'rgba(4,5,14,.35)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let z = Math.ceil(Zn / .4) * .4; z < Zn + 30; z += .4) { const s = projSeg(P, [-RW, gY(z), z], [RW, gY(z), z]); if (s && Math.abs(s[0][1] - s[1][1]) < 40) { const w = s[1][0] - s[0][0], o = (Math.sin(z * 13.1) * .5 + .5) * w * .3; ctx.moveTo(s[0][0] + o, s[0][1]); ctx.lineTo(s[1][0] - o * .5, s[1][1]); } }
  ctx.stroke();
  ctx.strokeStyle = rgba(pal(D, [[0, '#30345a'], [1, '#8e90a8']]), .5); ctx.lineWidth = 1.2; ctx.beginPath();
  for (const sd of [-1, 1]) { let on = false; for (let z = Zn; z < 70; z += .7) { const p = P(sd * (RW - .08 - .05 * Math.abs(Math.sin(z * 3.7))), gY(z), z); if (p[2] < .4) continue; on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; } }
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}
const FENCE_X = -5.8, POLE_X = 8.6, POLES = [4, 30, 56, 82];
function wires(ctx, P, t, D, cam) {
  ctx.save(); id(ctx);
  ctx.strokeStyle = rgba(pal(D, [[0, '#3a3e64'], [1, '#a9a6b8']]), .6); ctx.lineWidth = 1;
  for (const h of [.55, .98]) { const s = projSeg(P, [FENCE_X, gY(Math.max(2, cam.z)) + h, Math.max(2, cam.z)], [FENCE_X, gY(76) + h, 76]); if (s) { ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); ctx.stroke(); } }
  ctx.strokeStyle = rgba(pal(D, [[0, '#30345a'], [1, '#c6c0cc']]), .75); ctx.lineWidth = 1.1;
  for (let i = 0; i < POLES.length - 1; i++) for (const dx of [-.8, 0, .8]) {
    const z0 = POLES[i], z1 = POLES[i + 1], A = [POLE_X + dx, gY(z0) + 7.15, z0], B = [POLE_X + dx, gY(z1) + 7.15, z1], M = [POLE_X + dx, (A[1] + B[1]) / 2 - .45, (z0 + z1) / 2];
    const a = P(...A), b = P(...B), m = P(...M); if (a[2] < .5 || b[2] < .5 || m[2] < .5) continue;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(2 * m[0] - (a[0] + b[0]) / 2, 2 * m[1] - (a[1] + b[1]) / 2, b[0], b[1]); ctx.stroke();
  }
  ctx.restore();
}
function fencePost(ctx, P, Z, D) {
  const a = P(FENCE_X, gY(Z), Z), b = P(FENCE_X, gY(Z) + 1.1, Z); if (a[2] < .6) return;
  const w = Math.max(1.2, .1 * a[3]); ctx.fillStyle = pal(D, [[0, '#0e0e20'], [1, '#2a2634']]); ctx.fillRect(b[0] - w / 2, b[1], w, a[1] - b[1]);
  ctx.fillStyle = rgba(pal(D, [[0, '#30345a'], [1, '#a8a0a4']]), .5); ctx.fillRect(b[0] - w / 2, b[1], Math.max(.8, w * .3), a[1] - b[1]);
}
function telePole(ctx, P, Z, D, lit) {
  const a = P(POLE_X, gY(Z), Z), b = P(POLE_X, gY(Z) + 7.6, Z); if (a[2] < .8) return;
  const w = Math.max(1.5, .24 * a[3]), col = pal(D, [[0, '#0e0e20'], [1, '#2e2630']]);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(a[0] - w / 2, a[1]); ctx.lineTo(b[0] - w * .35, b[1]); ctx.lineTo(b[0] + w * .35, b[1]); ctx.lineTo(a[0] + w / 2, a[1]); ctx.closePath(); ctx.fill();
  const c1 = P(POLE_X - 1, gY(Z) + 7.1, Z), c2 = P(POLE_X + 1, gY(Z) + 7.1, Z); ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.4, .12 * a[3]); ctx.beginPath(); ctx.moveTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]); ctx.stroke();
  ctx.fillStyle = pal(D, [[0, '#3a4064'], [1, '#c9c4bc']]); for (const dx of [-.8, 0, .8]) { const p = P(POLE_X + dx, gY(Z) + 7.18, Z), s = Math.max(1, .07 * p[3]); ctx.fillRect(p[0] - s / 2, p[1] - s * 1.6, s, s * 1.6); }
  if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(SUN, .2 * lit); ctx.beginPath(); ctx.moveTo(a[0] - w / 2, a[1]); ctx.lineTo(b[0] - w * .35, b[1]); ctx.lineTo(b[0] + w * .05, b[1]); ctx.lineTo(a[0] + w * .1, a[1]); ctx.closePath(); ctx.fill(); ctx.restore(); }
}
function treeAt(ctx, P, X, Z, hgt, k, t, lit) {
  const a = P(X, gY(Z), Z); if (a[2] < 1.5) return;
  const sp = treeSprite(k), s = hgt * a[3] / sp.height; if (sp.width * s < 2 || a[0] + sp.width * s < 0 || a[0] - sp.width * s > W) return;
  const sw = Math.sin(t * .8 + X) * .01;
  ctx.save(); ctx.translate(a[0], a[1]); ctx.transform(1, 0, sw, 1, 0, 0); ctx.drawImage(sp, -sp.width * s / 2, -sp.height * s, sp.width * s, sp.height * s);
  if (lit > 0) { ctx.globalAlpha = lit; ctx.drawImage(treeLit(k), -sp.width * s / 2, -sp.height * s, sp.width * s, sp.height * s); }
  ctx.restore();
}

// ---------------------------------------------------------------- shadows: the ridge's shadow, the props' long shadows, your own
function castPolys(t, K) {
  const L = (h) => shadowLen(t, K, h), dx = Math.sin(SAZ), dz = Math.cos(SAZ), out = [];
  const boxShadow = (x0, x1, z0, z1, h) => { const l = L(h); out.push([[x0, z0], [x1, z0], [x1 + dx * l, z0 + dz * l], [x0 + dx * l, z0 + dz * l]], [[x0, z1], [x1, z1], [x1 + dx * l, z1 + dz * l], [x0 + dx * l, z1 + dz * l]], [[x0, z0], [x0, z1], [x0 + dx * l, z1 + dz * l], [x0 + dx * l, z0 + dz * l]], [[x1, z0], [x1, z1], [x1 + dx * l, z1 + dz * l], [x1 + dx * l, z0 + dz * l]]); };
  boxShadow(TOLL.x0, TOLL.x1, TOLL.z0, TOLL.z1, 2.8);
  boxShadow(PERM.x0, PERM.x1, PERM.z0, PERM.z1, 2.8);
  boxShadow(HOUSE.x0, HOUSE.x1, HOUSE.z0, HOUSE.z1, 4.2);
  for (let Z = 2; Z < 76; Z += 2.6) boxShadow(FENCE_X - .05, FENCE_X + .05, Z - .05, Z + .05, 1.1);
  for (const Z of POLES) boxShadow(POLE_X - .12, POLE_X + .12, Z - .12, Z + .12, 7.6);
  boxShadow(-3.8, -3.4, BZ - .1, BZ + .1, 1.0); boxShadow(3.55, 3.65, BZ - .05, BZ + .05, 1.0);
  boxShadow(3.57, 3.83, TOLL.armZ - .1, TOLL.armZ + .1, 1.2); boxShadow(TOLL.basX - .03, TOLL.basX + .03, TOLL.basZ - .03, TOLL.basZ + .03, 1.3);
  for (const [X, Z, h] of TREES) { const l = L(h * .75), r = h * .28; out.push([[X - r * .2, Z], [X + r * .2, Z], [X + dx * l + r, Z + dz * l], [X + dx * l - r, Z + dz * l]]); }
  return out;
}
function youShadow(t, K, cam0) {                // a standing figure's shadow on the ground (feet at the camera's foot point)
  const L = shadowLen(t, K, 1.72), dx = Math.sin(SAZ), dz = Math.cos(SAZ), px = -dz, pz = dx;
  const fx = cam0.x, fz = cam0.z, pt = (u, v) => [fx + dx * u * L + px * v, fz + dz * u * L + pz * v];
  const b = .012 * Math.sin(t * 1.5);
  const leg = (s) => [pt(0, s * .07), pt(0, s * .17), pt(.47, s * .1), pt(.47, s * .005)];
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
  const far = P(0, gY(100), 100), g = ctx.createLinearGradient(0, far[1], 0, H);
  g.addColorStop(0, 'rgba(255,172,104,.3)'); g.addColorStop(.35, 'rgba(255,160,92,.22)'); g.addColorStop(1, 'rgba(255,150,86,.16)');
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // every cast shadow (props, trees, your own) goes into a third-size layer, is softened (the sun's penumbra) and multiplied onto the lit ground
  const [sc, sg] = scratchLayer('c13shadow', 640, 360); sg.save(); sg.setTransform(1 / 3, 0, 0, 1 / 3, 0, 0);
  polyPath(sg, gp); sg.clip(); polyPath(sg, lp); sg.clip();
  sg.fillStyle = 'rgb(118,124,178)';
  for (const q of castPolys(t, K)) { const s = projPoly(P, q.map(([x, z]) => [x, gY(z) + .01, z])); if (s.length > 2) { polyPath(sg, s); sg.fill(); } }
  if (t >= K.you2 - .2) { const parts = youShadow(t, K, K._you0 || (K._you0 = baseCam(K.you2 + .05, K))).map((q) => projPoly(P, q.map(([x, z]) => [x, gY(z) + .012, z])));
    sg.fillStyle = 'rgb(96,100,160)'; for (const s of parts) if (s.length > 2) { polyPath(sg, s); sg.fill(); } }
  sg.restore();
  const [bc, bg] = scratchLayer('c13shadowB', 640, 360); bg.filter = 'blur(1.4px)'; bg.drawImage(sc, 0, 0); bg.filter = 'none';
  ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(bc, 0, 0, W, H);
  ctx.restore();
  const a = projSeg(P, [LEFT, gY(Zf), Zf], [edgeAt(Zf), gY(Zf), Zf]);
  if (a && Zf > cam.z + .7) { ctx.save(); polyPath(ctx, gp); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,180,110,.16)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a[0][0], a[0][1]); ctx.lineTo(a[1][0], a[1][1]); ctx.stroke(); ctx.restore(); }
}

// ---------------------------------------------------------------- fog on the plateau (alive), birds
function fogSprite() { return once('c13road_fog', () => { const [c, g] = canvas(1024, 160), n = vnoise(17); const d = g.createImageData(1024, 160), p = d.data;
  for (let y = 0; y < 160; y++) for (let x = 0; x < 1024; x++) { const i = (y * 1024 + x) * 4, f = fbm(n, x * .005, y * .025, 4), v = Math.sin(Math.PI * y / 160) ** 1.6 * clamp(Math.min(x, 1024 - x) / 260), a = clamp((f - .3) * 1.8) * v;
    p[i] = 150; p[i + 1] = 158; p[i + 2] = 196; p[i + 3] = a * 255; }
  g.putImageData(d, 0, 0); return c; }); }
const FOGS = [[-34, 64, 70, 0, 1.6], [24, 92, 80, 1, 2.2], [-12, 102, 110, 2, 2.6], [32, 50, 46, 3, 1.4], [-60, 86, 80, 4, 2]];
function drawFog(ctx, P, t, D, cam, f) {
  const [X, Z, w, ph, hgt] = f; if (Z < cam.z + 3) return;
  const a = P(X + Math.sin(t * .05 + ph) * 3, gY(Z) + hgt * .45, Z); if (a[2] < 2) return;
  const ww = w * a[3], hh = Math.max(hgt * a[3], ww * .05); ctx.globalAlpha = (.5 + .12 * Math.sin(t * .3 + ph)) * (.55 + .45 * D); ctx.drawImage(fogSprite(), a[0] - ww / 2 + Math.sin(t * .11 + ph) * ww * .02, a[1] - hh * .6, ww, hh); ctx.globalAlpha = 1;
}
function drawBirds(ctx, P, t, K) {
  const o = P.o, F = P.F, ys = (e) => (o.oy ?? H / 2) - F * Math.tan(e - o.pitch);
  ctx.strokeStyle = 'rgba(16,16,36,.75)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
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
  drawSky(ctx, P, t, K, D);
  drawBirds(ctx, P, t, K);
  drawFar(ctx, P, t, K, D);
  id(ctx);
  const gp = drawGround(ctx, P, t, K, D, cam);
  drawRoad(ctx, P, t, K, D, cam, gp);
  drawShadows(ctx, P, t, K, D, cam, gp);
  wires(ctx, P, t, D, cam);
  const items = [], dz = (X, Z) => { const o = P.o; return (X - o.x) * Math.sin(o.yaw || 0) + (Z - o.z) * Math.cos(o.yaw || 0); };
  const lit = (Z, h) => litAt(t, K, Z, h);
  for (let Z = 2; Z < 76; Z += 2.6) items.push([dz(FENCE_X, Z), () => fencePost(ctx, P, Z, D)]);
  for (const Z of POLES) items.push([dz(POLE_X, Z), () => telePole(ctx, P, Z, D, lit(Z, 5))]);
  for (const [X, Z, h, k] of TREES) items.push([dz(X, Z), () => treeAt(ctx, P, X, Z, h, k, t, lit(Z, h * .6))]);
  for (const f of FOGS) items.push([dz(f[0], f[1]), () => drawFog(ctx, P, t, D, cam, f)]);
  items.push([Math.max(.06, dz(-4, HOUSE.z0)), () => { house(ctx, P, cam, t, K, D, lit(HOUSE.z0, 2)); houseGlow(ctx, P, t, K, D); }]);
  items.push([dz(-4.2, PERM.z0), () => permitBooth(ctx, P, cam, t, K, D, lit(PERM.z0, 1.5))]);
  items.push([dz(5, TOLL.z0), () => tollGate(ctx, P, cam, t, K, D, lit(TOLL.z0, 1.5))]);
  let bar = null; items.push([dz(0, BZ), () => { bar = barrier(ctx, P, t, K, D, lit(BZ, .8)); }]);
  items.sort((a, b) => b[0] - a[0]);
  for (const [z, f] of items) if (z > .05) { ctx.save(); f(); ctx.restore(); id(ctx); }
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
function houseGlow(ctx, P, t, K, D) {
  const c = P(WIN.x, WIN.y, WIN.z); if (c[2] < .05) return;
  const R = Math.max(6, 2.8 * c[3]) * (1 + .03 * Math.sin(t * 2.7));
  ctx.save(); id(ctx); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g.addColorStop(0, 'rgba(255,186,104,.5)'); g.addColorStop(.3, 'rgba(255,166,86,.18)'); g.addColorStop(1, 'rgba(255,156,76,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, TAU); ctx.fill();
  const gq = projPoly(P, [[WIN.x - 1.2, HOUSE.y + .01, WIN.z - .2], [WIN.x + 1.2, HOUSE.y + .01, WIN.z - .2], [WIN.x + 1.8, HOUSE.y + .01, WIN.z - 3.2], [WIN.x - 1.8, HOUSE.y + .01, WIN.z - 3.2]]);
  if (gq.length > 2) fillPoly(ctx, gq, `rgba(255,166,86,${.16 * (1 - D * .5)})`);
  ctx.restore();
  pane(ctx, P, t, K, (hw) => Math.min(1500, Math.max(hw * 2.4, 4)));
}
export function warmRoad() { farLayers(); farLit(); farDark(); clouds(); for (let k = 0; k < 3; k++) { treeSprite(k); treeLit(k); } fogSprite(); fillSprite(); }
