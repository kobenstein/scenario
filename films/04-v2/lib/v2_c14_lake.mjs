// c14 (Film 4 v2) · the vignette in the banknote's empty oval (14.04) and the flight into it (14.05): someone rowing an old man across
// the lake at sunset, the hill town beyond the water (lib/maslow4.mjs). The picture IS drawHill at the view VV (1920×1080 "picture
// px") plus the setting sun and the boat; the oval shows its central part (semi-axes 421 × 520 picture px).
//   - print: the picture rendered once and engraved (horizontal ruling, cross-hatching in the darks, contours) in the note's ink;
//     it draws itself: contour lines cut by two burins, then the ruling spreads line by line outward from the boat
//   - flood: colour runs out of the sun over the print (the live picture under it), the boat comes alive
//   - flight: the note camera sinks into the oval; at σ = 1 (picture px = screen px) the drawing switches from the scaled live
//     picture to drawHill with the camera itself (identical frame), which then zooms and rises to VIEW H4 (exact by H.a − 1/30)
//   drawOval(ctx, t, A, M)   inside the note (M = note px → screen affine); drawRise(ctx, t, A) the full frame after the oval
//   lakeTimes(A) adds the schedule to A; riseCam(t, A), hillState(t, A)
import { clamp, mix, rgba, canvas as canvasOf } from '../engine.mjs';
import { drawHill, VIEWS, HILL, hillOutline } from './maslow4.mjs';
import { figure, reachArm } from './figure.mjs';
import { ghostLine } from './ghost.mjs';
import { onceRaw, smo, smoother, sio, TAU } from './v2_c14_util.mjs';
import { OV, G1, ovalFrame } from './v2_c14_note.mjs';

export const VV = { x: 900, y: 792, z: .5 };
export const RHO = OV.b / 520;                         // note px per picture px
const OA = OV.a / RHO, OB = OV.b / RHO;                  // the oval in picture px (centred on 960, 540)
const PB = { x0: 538, y0: 19, w: 844, h: 1042 };          // the print box (picture px)
const SUN = { X: 150, R: 48 };                            // world x at the horizon, radius (world units)
const H4 = VIEWS.H4;

// ---------------------------------------------------------------- the schedule (from the words)
export function lakeTimes(A) {
  A.burin0 = A.what + .05; A.burin1 = A.giveE + .15;
  A.flood0 = A.but - .05; A.flood1 = A.flood0 + .7;
  A.fly0 = A.flood0; A.flyT = 1.45; A.lnSb = Math.log(.05654 / .07); A.lnSe = Math.log(2.75);
  const D = A.lnSe - A.lnSb, u1 = Math.cbrt(-A.lnSb / D);
  A.s1 = A.fly0 + u1 * A.flyT;                                   // σ = 1: the switch to the live camera
  A.m1 = D * 3 * u1 * u1 / A.flyT;                               // d ln σ / dt there
  A.tK = .5; A.T1 = A.ha - 1 / 30;
  A.E1 = A.m1 * A.tK * (1 - Math.exp(-(A.T1 - A.s1) / A.tK)); A.R1 = Math.log(H4.cam.z / VV.z) - A.E1;
  A.alive0 = A.flood0 + .22;                                     // the flood reaches the boat: it comes alive
  return A;
}
export const lnSigma = (t, A) => A.lnSb + (A.lnSe - A.lnSb) * Math.pow(clamp((t - A.fly0) / A.flyT), 3);

export function hillState(t, A) {
  if (t >= A.T1 - 1e-6) return H4.st;
  const L = (a) => smo((t - a) / .9);
  return { wide: true, night: smo((t - (A.flood1 - .1)) / 3.3), lit: [L(A.run - .45), L(A.run + .15), L(A.question + .2), L(A.project + .1), 0],
    labels: smo((t - (A.run - .1)) / .9), title: 0, focus: 4, focusU: smo((t - A.answer) / 1.1), people: .3 * smo((t - (A.question - .3)) / 1.6), summitFigs: 0 };
}
export function riseCam(t, A) {
  if (t >= A.T1 - 1e-6) return H4.cam;
  if (t <= A.s1) return VV;
  const u = clamp((t - A.s1) / (A.T1 - A.s1)), e = smoother(u);
  const lk = A.m1 * A.tK * (1 - Math.exp(-(t - A.s1) / A.tK)) + A.R1 * e;
  return { x: mix(VV.x, H4.cam.x, e), y: mix(VV.y, H4.cam.y, e), z: VV.z * Math.exp(lk) };
}
// the boat is nearer than the town: once we are inside the picture it gets its own (faster) parallax
function boatCam(t, A, cam) {
  if (t <= A.s1) return cam;
  const k = mix(1, .55, smo((t - A.s1) / .6)), den = k - 1 + VV.z / cam.z;
  if (den < .03) return null;
  return { x: VV.x + (cam.x - VV.x) / k, y: VV.y + (cam.y - VV.y) / k, z: VV.z * k / den };
}

// ---------------------------------------------------------------- the boat (boat metres: u along the keel (+ bow, right), v across (+ away), w up)
const S = 172, EL = .26, CE = Math.cos(EL), SE = Math.sin(EL);          // world units per metre (boat layer), view elevation
const BOAT = { X: 790, Y: 1352 };                                         // the boat's mid-ship waterline point (boat layer world)
const WL = .15;
const un = (u) => (u + 2.2) / 4.4;
const bg = (u) => .66 * Math.pow(Math.max(0, Math.sin(Math.PI * mix(.18, 1, clamp(un(u))))), .7);
const wg = (u) => .58 + .72 * (un(u) - .45) ** 2;
const bw = (u) => bg(u) * .8;
const ramp = (x, a = .6) => (x <= 0 ? 0 : x < a ? x * x / (2 * a) : x - a / 2);
function boatState(t, A) {
  const alive = smo((t - A.alive0) / .6), x = t - A.alive0;
  return { alive, travel: .5 * ramp(x), ph: .2 + ramp(x) / 2.7, t };
}
function oarAt(ph) {
  const f = ph - Math.floor(ph); let th;
  if (f < .38) th = mix(.72, -.5, sio(f / .38)); else th = mix(-.5, .72, sio((f - .38) / .62));
  const lift = smo((f - .38) / .05) * (1 - smo((f - .93) / .06));
  return { th, lift, lean: mix(-.2, .3, (th + .5) / 1.22) };
}
function oarGeom(side, th, lift) {     // side −1 near, +1 far → { L: oarlock, Hd: handle, B: blade centre } in boat metres
  const OL = [-.3, side * .62, .64], hb = WL - .05 + .2 * lift, sb = clamp((OL[2] - hb) / 1.55, -.9, .9), cb = Math.sqrt(1 - sb * sb);
  const out = [cb * Math.sin(th), side * cb * Math.cos(th), -sb];
  return { L: OL, Hd: [OL[0] - .62 * out[0], OL[1] - .62 * out[1], OL[2] - .62 * out[2]], B: [OL[0] + 1.55 * out[0], OL[1] + 1.55 * out[1], OL[2] + 1.55 * out[2]], out };
}
function drawBoat(ctx, t, A, cam, st) {
  const bx = BOAT.X + st.travel * S;
  const P = (u, v, w) => [bx + u * S, BOAT.Y - (w * CE + v * SE) * S];
  ctx.save(); ctx.setTransform(cam.z, 0, 0, cam.z, 960 - cam.x * cam.z, 540 - cam.y * cam.z);
  const poly = (pts) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); };
  const lw = (px) => px / cam.z;
  const oar = oarAt(st.ph), near = oarGeom(-1, oar.th, oar.lift), far = oarGeom(1, oar.th, oar.lift);
  const U = []; for (let i = 0; i <= 40; i++) U.push(-2.2 + 4.4 * i / 40);
  // the water it lies in: a soft dark reflection of the hull, the wake behind (left) and the stroke puddles
  {
    const refl = [...U.map((u) => P(u, -bg(u), 2 * WL - wg(u))), ...U.slice().reverse().map((u) => P(u, -bw(u), WL))];
    poly(refl); ctx.fillStyle = 'rgba(26,22,44,.42)'; ctx.fill();
    ctx.strokeStyle = 'rgba(230,214,220,.22)'; ctx.lineWidth = lw(1.1); ctx.beginPath();
    for (let k = 1; k < 7; k++) { const [x0, y0] = P(-.6 + .04 * k, -bw(0) - .05, WL); ctx.moveTo(x0 - S * (.2 + .25 * k), y0 + S * (.025 * k)); ctx.lineTo(x0 + S * (.25 + .25 * k), y0 + S * (.025 * k)); }
    ctx.stroke();
    if (st.alive > .01) {
      ctx.strokeStyle = `rgba(232,220,226,${.35 * st.alive})`; ctx.lineWidth = lw(1); ctx.beginPath();
      const [sx, sy] = P(-2.2, 0, WL);
      for (const sd of [-1, 1]) for (let k = 1; k <= 5; k++) { const d = k * .55 * S, y = sy + sd * k * .06 * S * .5; ctx.moveTo(sx - d, y); ctx.lineTo(sx - d - .4 * S, y + sd * .02 * S); }
      ctx.stroke();
      // the puddles left by the last strokes (they stay where the water was pushed; the boat moves on)
      const per = 2.7, now = ramp(t - A.alive0) / 2.7 * per;
      for (let k = 0; k < 4; k++) {
        const age = now - (Math.floor(now / per) - k) * per - .38 * per; if (age < 0 || age > 4) continue;
        const tx = .5 * ramp(t - A.alive0 - age), [px, py] = [BOAT.X + tx * S + (-.3 - 1.0) * S, BOAT.Y - (WL * CE - 1.5 * SE) * S];
        const r = (.12 + .18 * age) * S, al = .4 * (1 - age / 4) * st.alive;
        ctx.strokeStyle = `rgba(236,224,230,${al})`; ctx.lineWidth = lw(1); ctx.beginPath(); ctx.ellipse(px, py, r, r * .22, 0, 0, TAU); ctx.stroke();
      }
    }
  }
  // the far oar (behind the boat): shaft and blade
  const oarLine = (g, col, wpx) => {
    const a = P(...g.Hd), b = P(...g.B); ctx.strokeStyle = col; ctx.lineWidth = lw(wpx); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    const c = P(g.B[0] - g.out[0] * .45, g.B[1] - g.out[1] * .45, g.B[2] - g.out[2] * .45), d = P(g.B[0] + g.out[0] * .05, g.B[1] + g.out[1] * .05, g.B[2] + g.out[2] * .05);
    ctx.lineWidth = lw(wpx * 2.6); ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
  };
  oarLine(far, '#7a5a3e', 3.2);
  // inside of the boat (far side, floor), thwarts
  const inner = [...U.map((u) => P(u, bg(u), wg(u))), ...U.slice().reverse().map((u) => P(u, -bg(u), wg(u)))];
  poly(inner); { const g = ctx.createLinearGradient(0, P(0, .66, .58)[1], 0, P(0, -.66, .58)[1]); g.addColorStop(0, '#b47c4c'); g.addColorStop(.6, '#7a4c2e'); g.addColorStop(1, '#4a2c1c'); ctx.fillStyle = g; ctx.fill(); }
  ctx.strokeStyle = 'rgba(40,20,10,.35)'; ctx.lineWidth = lw(1); ctx.beginPath(); for (let k = 1; k < 4; k++) { ctx.moveTo(...P(-2.0, bg(-2.0) * (1 - k * .22), wg(-2.0) - k * .1)); for (const u of U) if (u > -2.0 && u < 2.0) ctx.lineTo(...P(u, bg(u) * (1 - k * .22), wg(u) - k * .1)); } ctx.stroke();
  const thwart = (u0, u1, w) => { const v0 = Math.min(bg(u0), bg(u1)) * .95; poly([P(u0, -v0, w), P(u1, -v0, w), P(u1, v0, w), P(u0, v0, w)]); ctx.fillStyle = '#c08a58'; ctx.fill(); poly([P(u0, -v0, w), P(u1, -v0, w), P(u1, -v0, w - .04), P(u0, -v0, w - .04)]); ctx.fillStyle = '#6a4228'; ctx.fill(); };
  thwart(-.12, .14, .42); thwart(-1.95, -1.0, .40); thwart(1.15, 1.38, .44);
  // the people
  const fs = S / 105.7, light = { x: bx - 2600, y: BOAT.Y - 500, col: '#ffc48a', a: .45 };
  { // the old man in the stern, facing the rower, both hands on his cane
    const hp = P(-1.45, 0, .5), top = P(-1.07, -.12, .8), bot = P(-.92, -.12, .1);
    const pose = { hip: [1.38, 1.44], kn: [1.24, 1.3], sh: [.6, .5], el: [.9, .9], lean: .2, head: -.06, hair: 'short', lock: [true, true] };
    const o = { t, seed: 23, flip: false, dress: { coat: '#4c4a58', pants: '#2a2832', shoes: '#141218', skin: '#e2b896', hair: '#dcd6ce' }, rim: '#ffd2a0', rimSide: -1, light };
    for (const i of [0, 1]) { const r = reachArm(hp[0], hp[1], fs, pose, i, false, o, [top[0] + (i ? -2 : 1), top[1] + (i ? 5 : 1)]); pose.sh[i] = r.sh; pose.el[i] = r.el; }
    figure(ctx, hp[0], hp[1], fs, pose, o);
    ctx.strokeStyle = '#2a1c16'; ctx.lineWidth = lw(3.2); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bot[0], bot[1]); ctx.lineTo(top[0], top[1]); ctx.quadraticCurveTo(top[0] + 6, top[1] - 7, top[0] + 13, top[1] - 2); ctx.stroke();
  }
  { // the rower on the middle thwart, facing the stern, hands on the oar handles
    const hp = P(0, 0, .52), hN = P(...near.Hd), hF = P(...far.Hd);
    const pose = { hip: [1.32, 1.36], kn: [1.0, 1.06], sh: [1, .9], el: [.3, .3], lean: oar.lean, head: -.04, hair: 'short', lock: [true, true] };
    const o = { t, seed: 61, flip: true, dress: { coat: '#7a3e2c', pants: '#2c2a3a', shoes: '#141218', skin: '#c8946e', hair: '#3a2418' }, rim: '#ffd2a0', rimSide: -1, light };
    const rN = reachArm(hp[0], hp[1], fs, pose, 0, true, o, hN), rF = reachArm(hp[0], hp[1], fs, pose, 1, true, o, hF);
    pose.sh = [rN.sh, rF.sh]; pose.el = [rN.el, rF.el];
    figure(ctx, hp[0], hp[1], fs, pose, o);
  }
  // the near side of the hull (outside), its top strake and the waterline stripe
  const side = [...U.map((u) => P(u, -bg(u), wg(u))), ...U.slice().reverse().map((u) => P(u, -bw(u), WL))];
  poly(side); { const g = ctx.createLinearGradient(P(-2.2, 0, .5)[0], 0, P(2.2, 0, .5)[0], 0); g.addColorStop(0, '#f2e6d0'); g.addColorStop(.5, '#d8cebc'); g.addColorStop(1, '#a8a092'); ctx.fillStyle = g; ctx.fill(); }
  const strake = [...U.map((u) => P(u, -bg(u), wg(u))), ...U.slice().reverse().map((u) => P(u, -bg(u) * .97, wg(u) - .07))];
  poly(strake); ctx.fillStyle = '#2e4656'; ctx.fill();
  const stripe = [...U.map((u) => P(u, -bw(u) * 1.02, WL + .06)), ...U.slice().reverse().map((u) => P(u, -bw(u), WL))];
  poly(stripe); ctx.fillStyle = '#7e3a2c'; ctx.fill();
  ctx.strokeStyle = 'rgba(40,30,30,.3)'; ctx.lineWidth = lw(1); ctx.beginPath(); for (let k = 1; k < 4; k++) { const ww = (u) => mix(wg(u) - .07, WL + .06, k / 4); ctx.moveTo(...P(-2.2, -bg(-2.2) * .95, ww(-2.2))); for (const u of U) ctx.lineTo(...P(u, -mix(bg(u) * .97, bw(u), k / 4), ww(u))); } ctx.stroke();
  // the near oar (in front of the hull), the oarlocks
  oarLine(near, '#a07448', 3.4);
  ctx.fillStyle = '#1e1a1c'; for (const g of [near, far]) { const p = P(...g.L); ctx.fillRect(p[0] - lw(2), p[1] - lw(4), lw(4), lw(5)); }
  // splashes where the blades are in the water
  if (oar.lift < .2) for (const g of [near, far]) { const p = P(g.B[0], g.B[1], WL); ctx.strokeStyle = `rgba(240,232,236,${.5 * (1 - oar.lift * 5)})`; ctx.lineWidth = lw(1.2); ctx.beginPath(); ctx.ellipse(p[0], p[1], .2 * S, .04 * S, 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- the sun, its glitter, the near water lines
function sunAt(t, A) {
  const set = smo((t - (A.flood1 - .3)) / 1.9);
  return { y: HILL.horizon + SUN.R * (.35 + 1.9 * set), a: 1 - set };
}
function drawSun(ctx, t, A, cam) {
  const s = sunAt(t, A), z = cam.z, hx = (SUN.X - cam.x) * z + 960, hy = (HILL.horizon - cam.y) * z + 540, sy = (s.y - cam.y) * z + 540, R = SUN.R * z;
  if (hx < -900 || hx > 2800) return;
  const n = hillState(t, A).night, ga = (1 - n) * .9;
  if (ga > .01) {   // the glow (additive), over the horizon
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 9); g.addColorStop(0, rgba('#ffd9a0', .55 * ga)); g.addColorStop(.18, rgba('#ff9e60', .2 * ga)); g.addColorStop(1, rgba('#ff8050', 0));
    ctx.fillStyle = g; ctx.fillRect(hx - R * 9, hy - R * 9, R * 18, R * 18); ctx.restore();
  }
  if (s.a > .01 && sy - R < hy) {   // the disc, cut by the horizon
    ctx.save(); ctx.beginPath(); ctx.rect(hx - R * 2, hy - R * 3, R * 4, R * 3); ctx.clip();
    const g = ctx.createRadialGradient(hx, sy, 0, hx, sy, R); g.addColorStop(0, '#fff3d8'); g.addColorStop(.7, '#ffd08a'); g.addColorStop(1, '#ff9a5a');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, sy, R, 0, TAU); ctx.fill(); ctx.restore();
  }
  if (ga > .01) {   // the glitter on the water below it
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffc890', .55 * ga); ctx.beginPath();
    for (let k = 0; k < 46; k++) {
      const d = 3 + k * k * .55, y = hy + d * z * .5; if (y > 1090) break;
      const w = (R * (.5 + d * .012)) * (.4 + .6 * Math.abs(Math.sin(k * 7.13 + t * 2.1 + Math.sin(k * 1.7)))), x = hx + Math.sin(k * 3.7 + t * .9) * R * .25;
      ctx.rect(x - w / 2, y, w, Math.max(.8, z * (.8 + k * .05)));
    }
    ctx.fill(); ctx.restore();
  }
}

// ---------------------------------------------------------------- the picture (any camera): hill + sun + boat
function drawPicture(ctx, t, A, cam, frozen) {
  const st = hillState(t, A);
  drawHill(ctx, t, cam, st);
  if (cam.z > 1.6 && t > A.T1 - .6) return;    // sun and boat are long gone
  drawSun(ctx, t, A, cam);
  const bc = boatCam(t, A, cam); if (!bc) return;
  const bs = frozen ? { alive: 0, travel: 0, ph: .2, t } : boatState(t, A);
  const top = (BOAT.Y - 1.6 * S - bc.y) * bc.z + 540; if (top > 1100) return;
  drawBoat(ctx, t, A, bc, bs);
}

// ---------------------------------------------------------------- the engraved print (built once)
const PW = PB.w, PH = PB.h, NPX = PW * PH;
function buildPrint(A) {
  const tP = A.give;
  const [c, g] = canvasOf(1920, 1080);
  drawPicture(g, tP, A, VV, true);
  const src = g.getImageData(PB.x0, PB.y0, PW, PH).data;
  const L = new Float32Array(NPX);
  for (let i = 0; i < NPX; i++) L[i] = (.299 * src[i * 4] + .587 * src[i * 4 + 1] + .114 * src[i * 4 + 2]) / 255;
  // a light blur for the contours
  const B = new Float32Array(NPX), B2 = new Float32Array(NPX);
  for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) { let s = 0, n = 0; for (let k = -1; k <= 1; k++) { const xx = x + k; if (xx < 0 || xx >= PW) continue; s += L[y * PW + xx]; n++; } B2[y * PW + x] = s / n; }
  for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) { let s = 0, n = 0; for (let k = -1; k <= 1; k++) { const yy = y + k; if (yy < 0 || yy >= PH) continue; s += B2[yy * PW + x]; n++; } B[y * PW + x] = s / n; }
  const cov = new Uint8Array(NPX), con = new Uint8Array(NPX), Rh = new Float32Array(NPX), Rc = new Float32Array(NPX), DS = new Float32Array(NPX);
  const bx = 905 - PB.x0, by = 800 - PB.y0, sx = (SUN.X - VV.x) * VV.z + 960 - PB.x0, sy = 540 - PB.y0, P1 = 4.3, P2 = 5.2, ca = Math.cos(.62), sa = Math.sin(.62);
  const hsh = (k) => { const v = Math.sin(k * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const band = (d, hw) => clamp(hw + .5 - d);
  for (let y = 0; y < PH; y++) {
    const j = Math.floor((y + .5) / P1), yj = (j + .5) * P1, tj = .1 * hsh(j);
    for (let x = 0; x < PW; x++) {
      const i = y * PW + x, T = .34 + .66 * Math.pow(clamp((L[i] - .06) / .42), .75), ck = 1 - T;
      const d1 = Math.abs(((y + .5) / P1) % 1 - .5) * P1, h1 = Math.min(ck, .62) / .62 * P1 * .46;
      let k = h1 > .05 ? band(d1, h1) : 0;
      if (ck > .5) { const q = (x * sa + y * ca) / P2, d2 = Math.abs((q % 1 + 1) % 1 - .5) * P2; k = Math.max(k, band(d2, (ck - .5) / .16 * P2 * .3)); }
      cov[i] = Math.round(255 * clamp(k));
      // contours from the luminance gradient (Sobel on the blurred image)
      if (x > 0 && y > 0 && x < PW - 1 && y < PH - 1) {
        const a = B[i - PW - 1], b = B[i - PW], cc = B[i - PW + 1], d = B[i - 1], f = B[i + 1], gg = B[i + PW - 1], h = B[i + PW], ii = B[i + PW + 1];
        const gx = (cc + 2 * f + ii) - (a + 2 * d + gg), gy = (gg + 2 * h + ii) - (a + 2 * b + cc), m = Math.hypot(gx, gy);
        con[i] = Math.round(255 * clamp((m - .07) / .12));
      }
      const db = Math.hypot(x - bx, (yj - by) * 1.1), front = A.burin0 + .18 + .92 * Math.pow(db / 1000, .85);
      Rc[i] = front - .14 + .04 * hsh(i * .013);
      Rh[i] = front + tj;
      DS[i] = Math.hypot(x - sx, y - sy) + 46 * (Math.sin(x * .021 + y * .013) + Math.sin(x * .007 - y * .019 + 2) + .6 * Math.sin((x + y) * .043));
    }
  }
  return { cov, con, Rh, Rc, DS, dMax: Math.hypot(PW, PH) + 260 };
}
const PRINT = (A) => onceRaw('c14-print', () => buildPrint(A));
const PRC = () => onceRaw('c14-printc', () => canvasOf(PW, PH));
const MSK = () => onceRaw('c14-maskc', () => canvasOf(PW, PH));
const LIVE = () => onceRaw('c14-livec', () => canvasOf(1920, 1080));
export function warmLake(A) { PRINT(A); PRC(); MSK(); LIVE(); }

// one frame of the print (ink alpha) and the flood mask (colour alpha) → the two canvases
function composePrint(t, A) {
  const Pq = PRINT(A), [pc, pg] = PRC(), [mc, mg] = MSK();
  const im = pg.createImageData(PW, PH), D = im.data, flood = t > A.flood0;
  const mim = flood ? mg.createImageData(PW, PH) : null, MD = mim ? mim.data : null;
  const rf = flood ? mix(-80, Pq.dMax, sio((t - A.flood0) / (A.flood1 - A.flood0))) : -1e9;
  const r = 0x2b, gq = 0x46, b = 0x3c;
  for (let i = 0; i < NPX; i++) {
    let a = 0;
    const ch = Pq.cov[i], cc = Pq.con[i];
    if (ch) { const v = (t - Pq.Rh[i]) / .05; if (v > 0) a = ch * (v > 1 ? 1 : v); }
    if (cc) { const v = (t - Pq.Rc[i]) / .05; if (v > 0) { const q = cc * (v > 1 ? 1 : v); if (q > a) a = q; } }
    let F = 0;
    if (flood) { const v = (rf - Pq.DS[i]) / 70; F = v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v); MD[i * 4 + 3] = 255 * F; }
    const o = i * 4; D[o] = r; D[o + 1] = gq; D[o + 2] = b; D[o + 3] = a * (1 - F);
  }
  pg.setTransform(1, 0, 0, 1, 0, 0); pg.putImageData(im, 0, 0);
  if (flood) { mg.setTransform(1, 0, 0, 1, 0, 0); mg.putImageData(mim, 0, 0); }
  return { pc, mc };
}

// the contour lines cut by the burins (picture px polylines, with their cutting times)
function contourLines(A) {
  return onceRaw('c14-contours', () => {
    const toP = (x, y) => [(x - VV.x) * VV.z + 960, (y - VV.y) * VV.z + 540];
    const inO = (p) => ((p[0] - 960) / (OA - 6)) ** 2 + ((p[1] - 540) / (OB - 6)) ** 2 < 1;
    const hill = hillOutline().map((p) => toP(p[0], p[1])).filter(inO);
    const sunP = toP(SUN.X, HILL.horizon), rr = SUN.R * VV.z * 1.06, cy0 = sunP[1] + SUN.R * .35 * VV.z, arc = [];
    for (let k = 0; k <= 24; k++) { const a = Math.PI + k / 24 * Math.PI, y = cy0 + Math.sin(a) * rr; if (y <= sunP[1]) arc.push([sunP[0] + Math.cos(a) * rr, y]); }
    const hz = [[960 - OA + 8, 540], [toP(HILL.levels[0].hw0 * -1 + 960, 0)[0], 540]];
    // the boat (print pose): near gunwale and waterline as one outline
    const bx = BOAT.X, P = (u, v, w) => toP(bx + u * S, BOAT.Y - (w * CE + v * SE) * S), U = []; for (let i = 0; i <= 30; i++) U.push(-2.2 + 4.4 * i / 30);
    const hullL = [...U.map((u) => P(u, -bg(u), wg(u))), ...U.slice().reverse().map((u) => P(u, -bw(u), WL))]; hullL.push(hullL[0]);
    const o = oarAt(.2), nO = oarGeom(-1, o.th, o.lift), fO = oarGeom(1, o.th, o.lift);
    const oarL = (g) => [P(...g.Hd), P(...g.L), P(...g.B)];
    const b0 = A.burin0;
    return [
      { pts: hullL, t0: b0, t1: b0 + .42, w: 1.6 },
      { pts: oarL(nO), t0: b0 + .3, t1: b0 + .5, w: 1.5 },
      { pts: oarL(fO), t0: b0 + .42, t1: b0 + .6, w: 1.3 },
      { pts: arc, t0: b0 + .5, t1: b0 + .7, w: 1.3 },
      { pts: hz, t0: b0 + .6, t1: b0 + .72, w: 1.2 },
      { pts: hill, t0: b0 + .62, t1: b0 + 1.12, w: 1.4 },
    ];
  });
}
function drawContours(ctx, t, A) {
  // ctx in picture px (transform set by the caller)
  for (const L of contourLines(A)) {
    const p = clamp((t - L.t0) / (L.t1 - L.t0)); if (p <= 0) continue;
    const fade = 1 - smo((t - (A.flood0 + .15)) / .5); if (fade <= 0) continue;
    if (p >= 1) ghostLine(ctx, L.pts, { u: 1, ghost: 0, col: G1, w: L.w, a: .9 * fade });
    else ghostLine(ctx, L.pts, { u: p, burin: .999, col: G1, w: L.w, a: .9, t, tipSize: 13, seed: Math.round(L.t0 * 10) });
  }
}

// ---------------------------------------------------------------- inside the oval (M: note px → screen affine)
export function drawOval(ctx, t, A, M) {
  if (t < A.burin0) return;
  const sc = Math.hypot(M[0], M[1]), sigma = sc * RHO;
  const clipO = () => { ctx.beginPath(); ctx.ellipse(OV.x, OV.y, OV.a, OV.b, 0, 0, TAU); ctx.clip(); };
  if (t < A.s1) {
    ctx.save(); ctx.setTransform(...M); clipO();
    ctx.transform(RHO, 0, 0, RHO, OV.x - 960 * RHO, OV.y - 540 * RHO);           // → picture px
    const { pc, mc } = t < A.flood1 + .05 ? composePrint(t, A) : { pc: null, mc: null };
    if (t > A.flood0) {
      const [lc, lg] = LIVE(); lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalCompositeOperation = 'source-over'; lg.globalAlpha = 1;
      drawPicture(lg, t, A, VV, false);
      if (mc && t < A.flood1) { lg.globalCompositeOperation = 'destination-in'; lg.drawImage(mc, PB.x0, PB.y0); lg.globalCompositeOperation = 'source-over'; }
      ctx.drawImage(lc, 0, 0);
    }
    if (pc) ctx.drawImage(pc, PB.x0, PB.y0);
    drawContours(ctx, t, A);
    ctx.restore();
    return;
  }
  // inside the picture: the camera itself (clipped to the oval), the oval's frame around it in vectors
  ctx.save(); ctx.setTransform(...M); ovalFrame(ctx); clipO(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawPicture(ctx, t, A, riseCam(t, A), false);
  ctx.restore();
  void sigma;
}
// the oval covers the whole frame (test in note px)
export function ovalCovers(M) {
  const det = M[0] * M[3] - M[1] * M[2];
  for (const [x, y] of [[0, 0], [1920, 0], [0, 1080], [1920, 1080]]) {
    const dx = x - M[4], dy = y - M[5], u = (M[3] * dx - M[2] * dy) / det, v = (-M[1] * dx + M[0] * dy) / det;
    if (((u - OV.x) / OV.a) ** 2 + ((v - OV.y) / OV.b) ** 2 > .985) return false;
  }
  return true;
}
export function drawRise(ctx, t, A) { drawPicture(ctx, t, A, riseCam(t, A), false); }
