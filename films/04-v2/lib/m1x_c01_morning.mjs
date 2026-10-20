// C01 (Film 4 minute 1) · 1.04–1.06 the morning take: ONE continuous shot from the dawn light (J1 = 11.50) to the gold light (J2 = 15.65).
// Owner c01.
//   The row's far light (it covers the frame at J1) shrinks into the dawn sun over the city: you on the roof ("So what do you do?").
//   Across the street stands an apartment house (plane .86); the camera pushes over to its top-floor window and lands on "Sleep":
//   the blind lowers. The blind is a cloth printed with the paper map; on "Travel." the dotted route burins across it, the little
//   engraved plane flies, and the camera pushes into the cloth to the landing on the coast. Its glow becomes the gold light that
//   covers the frame at J2; lib/m1x_c01_lake.mjs shrinks that same light into the low sun over the lake.
//   morningTake(ctx, t, K)   K = { J1, doE, sleep, sleepE, J2, map: { t0, arrive } (the route on the cloth) }
//   rowToRoof(ctx, t, K, lp) the row side of J1 (drawn over openTake): the far light lp grows into the same light
// The camera is ONE transform of the building's set (scale k, offset): phase A (dawn, a slow creep), B (the push to the window, quart
// in-out, lands on "Sleep"), C (a creep while the blind lowers), D (the push into the cloth, quart in-out, lands at J2 with the
// landing point exactly on the lake's sun point). The rooftop set gets the matching camera (lib/rooftop.mjs's parallax model).
import { W, H, rgba, clamp, mix, sm, prng, drift, lin } from '../engine.mjs';
import { rooftop, ROOF } from './rooftop.mjs';
import { youFree } from './sc01_m1_you.mjs';
import { mapSheet, mapPaint, routePts } from './sc01_m1_world.mjs';
import { toView } from './sc09_map.mjs';
import { eoX, qio } from './sc01_m1_open.mjs';
import { lightAt } from './m1x_bridge.mjs';
import { passR, passBloom, mixHex } from './m1x_c01_kit.mjs';
import { LAKE_SUN0 } from './m1x_c01_lake.mjs';

const TAU = Math.PI * 2;
const PB = .86, KB = .35 + .65 * PB, FX = 1290, FY = 520;          // the building's parallax plane; rooftop zoom pivot
const WIN = { x0: 1572, y0: 348, w: 256, h: 144 }, WC = [1572 + 128, 348 + 72];
const BLD = { x0: 1395, top: 236, x1: 3100, y1: 1700 };
const VIEW0 = { z: 1, dx: 0, dy: 0 }, MS = 256 / W;                // the map frame printed on the cloth (frame px → set px)
const KA = 1.045, KW = 3.3, KC = 3.55, KD = 15, SW = [960, 548];
const R_SUN = 26;
export const ROOF_SUN_J1 = [1290, 430];                             // the sun on screen at J1 (camera at rest there)
export const J1R = 1700, J1D = .7, J1SEED = 41;                     // the dawn light pass at J1 (both sides draw it)
export const J2R = 1750, J2D = .45;                                 // the gold light at J2 (the lake side uses its own D)

let LP = null;
function landPt() {   // the landing point on the coast, in set px (blind fully down)
  if (!LP) { const S = mapSheet(), R = routePts(S), e = R[R.length - 1], p = toView(S, VIEW0, e[0], e[1]); LP = [WIN.x0 + p[0] * MS, WIN.y0 + p[1] * MS]; }
  return LP;
}
const climbOf = (t, K) => sm(lin(K.J1 + .2, K.sleepE, t));
function sunSet(t, K) { const c = climbOf(t, K); return [ROOF_SUN_J1[0] + 30 * c, mix(ROOF_SUN_J1[1], 300, c)]; }

// ---------------------------------------------------------------- the camera (one transform of the building's set)
function camAt(t, K) {
  const tB0 = K.doE - .35, tB1 = K.sleep, tC1 = K.sleep + .55;
  const kA = (tt) => 1 + (KA - 1) * eoX(lin(K.J1, K.J1 + 1.6, tt));
  let k, P, A = WC;
  if (t < tB0) { k = kA(t); P = [WC[0], WC[1]]; }
  else if (t < tB1) { const e = qio(lin(tB0, tB1, t)); k = Math.exp(mix(Math.log(kA(tB0)), Math.log(KW), e)); P = [mix(WC[0], SW[0], e), mix(WC[1], SW[1], e)]; }
  else if (t < tC1) { k = mix(KW, KC, sm(lin(tB1, tC1, t))); P = [SW[0], SW[1]]; }
  else { const e = qio(lin(tC1, K.J2, t)), L = landPt(), P0 = [SW[0] + KC * (L[0] - WC[0]), SW[1] + KC * (L[1] - WC[1])]; k = Math.exp(mix(Math.log(KC), Math.log(KD), e)); P = [mix(P0[0], LAKE_SUN0[0], e), mix(P0[1], LAKE_SUN0[1], e)]; A = L; }
  const da = sm(lin(K.J1, K.J1 + 1.2, t)) * (1 - sm(lin(K.J2 - 1, K.J2, t)));   // a hand-held breath, zero at both junctions
  P[0] += drift(t, 5, 1) * da; P[1] += drift(t, 3, 2) * da;
  return { k, ox: P[0] - k * A[0], oy: P[1] - k * A[1] };
}

// ---------------------------------------------------------------- the take
export function morningTake(ctx, t, K) {
  const C = camAt(t, K), k = C.k, z = 1 + (k - 1) / KB, cx = ((FX - C.ox) / k - FX) / PB, cy = ((FY - C.oy) / k - FY) / PB;
  const kz = (p) => 1 + (z - 1) * (.35 + .65 * p), map = (p) => (X, Y) => { const q = kz(p); return [FX + (X - cx * p - FX) * q, FY + (Y - cy * p - FY) * q]; };
  const climb = climbOf(t, K), [ssx, ssy] = sunSet(t, K), SUN = map(.12)(ssx, ssy), rs = R_SUN * kz(.12);
  const parY = map(1)(0, ROOF.parapetY)[1];
  const covered = C.ox + k * BLD.x0 <= -2 && C.oy + k * (BLD.top - 18) <= -2 && parY >= H + 2;
  if (!covered) {
    rooftop(ctx, t, {
      state: 'dawn', dawn: mix(.6, 1, sm(lin(K.J1, K.J1 + 1.2, t))), cam: { x: cx, y: cy, z, fx: FX, fy: FY }, glowA: 1.1,
      onSky: (g) => {
        g.save(); g.globalCompositeOperation = 'lighter'; const R = 340 * kz(.12), gg = g.createRadialGradient(SUN[0], SUN[1], rs * .8, SUN[0], SUN[1], R);
        gg.addColorStop(0, 'rgba(255,214,160,.55)'); gg.addColorStop(.3, 'rgba(255,170,110,.16)'); gg.addColorStop(1, 'rgba(255,150,90,0)'); g.fillStyle = gg; g.fillRect(SUN[0] - R, SUN[1] - R, 2 * R, 2 * R); g.restore();
        lightAt(g, t, SUN[0], SUN[1], rs, { tone: 'dawn', seed: J1SEED, bloom: 0 });
      },
    });
  } else { ctx.fillStyle = '#1e1c30'; ctx.fillRect(0, 0, W, H); }
  // the apartment house across the street (plane .86), clipped above your roof's parapet
  ctx.save(); ctx.beginPath(); ctx.rect(-10, -10, W + 20, Math.min(H + 10, parY) + 10); ctx.clip();
  ctx.translate(C.ox, C.oy); ctx.scale(k, k);
  building(ctx, t, K, climb, k);
  ctx.restore();
  // you on the roof (plane 1), your long shadow toward us (the sun is behind you)
  const k1 = kz(1), [fx, fy] = map(1)(560, 1460);
  if (fx + 420 * k1 > 0) {
    ctx.save(); ctx.translate(fx + 40 * k1, fy - 30 * k1); ctx.rotate(.18); const sg = ctx.createLinearGradient(0, -40, 0, 300); sg.addColorStop(0, 'rgba(4,3,10,.55)'); sg.addColorStop(1, 'rgba(4,3,10,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(0, 120, 150 * k1, 260 * k1, 0, 0, TAU); ctx.fill(); ctx.restore();
    const look = .75 + .25 * sm(lin(K.J1 + .3, K.J1 + 1.5, t));
    ctx.save(); ctx.translate(fx, fy); ctx.scale(k1, k1);
    youFree(ctx, 0, 0, 1.2, { t, look, lit: 0, light: { x: (SUN[0] - fx) / k1, y: (SUN[1] - fy) / k1, col: '#ffe0b0', a: .95 }, wind: 1.2, accent: '#c8843a' });
    ctx.restore();
  }
  const vg = ctx.createRadialGradient(W * .55, H * .48, 420, W * .5, H * .5, 1250); vg.addColorStop(0, 'rgba(3,4,12,0)'); vg.addColorStop(1, 'rgba(3,4,12,.45)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  // J1: the dawn light shrinks into the sun;  J2: the landing glow grows into the gold light
  if (t < K.J1 + J1D) { const r = passR(t, K.J1, J1R, J1D); if (r > rs) lightAt(ctx, t, SUN[0], SUN[1], r, { tone: 'dawn', seed: J1SEED, bloom: passBloom(r, rs) }); }
  if (t > K.J2 - J2D) { const L = landPt(), r = passR(t, K.J2, J2R, J2D); lightAt(ctx, t, C.ox + k * L[0], C.oy + k * L[1], r, { tone: 'gold', seed: 67, bloom: passBloom(r, 0) }); }
  return { sun: SUN, k };
}

// the row side of J1: openTake's far light grows into the light that covers the frame at J1, its centre moving to the roof's sun
export function rowToRoof(ctx, t, K, lp) {
  if (t <= K.J1 - J1D || t >= K.J1) return;
  const r = passR(t, K.J1, J1R, J1D), w = sm(lin(K.J1 - J1D, K.J1, t));
  lightAt(ctx, t, mix(lp[0], ROOF_SUN_J1[0], w), mix(lp[1], ROOF_SUN_J1[1], w), r, { tone: 'dawn', seed: J1SEED, bloom: passBloom(r, 0) });
}

// ---------------------------------------------------------------- the house (set px, drawn under the camera transform)
const FRAME_D = '#7c7488', FRAME_L = '#e6dcc6';
function building(ctx, t, K, climb, k) {
  const { x0, top, x1, y1 } = BLD, px = 1 / k;   // px: one screen pixel in set px
  const body = ctx.createLinearGradient(x0, 0, x0 + 1100, 0); body.addColorStop(0, mixHex('#4c4058', '#8a6c62', climb)); body.addColorStop(.22, mixHex('#2f2c46', '#54485c', climb)); body.addColorStop(1, mixHex('#24233a', '#3c3850', climb));
  ctx.fillStyle = body; ctx.fillRect(x0, top, x1 - x0, y1 - top);
  // engraved stone courses and staggered joints (screen-thin lines)
  ctx.strokeStyle = 'rgba(8,6,18,.32)'; ctx.lineWidth = 1.1 * px; ctx.beginPath();
  for (let y = top + 22, i = 0; y < y1; y += 17, i++) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); for (let x = x0 + (i % 2 ? 24 : 0) + 30; x < x1; x += 52) { ctx.moveTo(x, y); ctx.lineTo(x, y + 17); } }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,220,190,.06)'; ctx.beginPath(); for (let y = top + 23, i = 0; y < y1; y += 17, i++) { ctx.moveTo(x0, y + px); ctx.lineTo(x1, y + px); } ctx.stroke();
  // cornice: a projecting ledge, its top lit by the low sun, a soft shadow under it
  ctx.fillStyle = mixHex('#4a4460', '#6c5c66', climb); ctx.fillRect(x0 - 12, top - 18, x1 - x0 + 12, 20);
  ctx.fillStyle = rgba('#ffcf9a', .35 + .25 * climb); ctx.fillRect(x0 - 12, top - 18, x1 - x0 + 12, 2.2);
  { const g = ctx.createLinearGradient(0, top + 2, 0, top + 26); g.addColorStop(0, 'rgba(4,3,12,.45)'); g.addColorStop(1, 'rgba(4,3,12,0)'); ctx.fillStyle = g; ctx.fillRect(x0, top + 2, x1 - x0, 24); }
  // the warm rim on the sun side
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(x0, 0, x0 + 70, 0); g.addColorStop(0, rgba('#ffb070', .38 * (.6 + .4 * climb))); g.addColorStop(1, 'rgba(255,176,112,0)'); ctx.fillStyle = g; ctx.fillRect(x0, top - 18, 70, y1 - top); ctx.restore(); }
  // the other windows (dark glass, the sky in it, one or two lamps still on)
  const r = prng(31);
  for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) {
    const wx = WIN.x0 + i * 330, wy = WIN.y0 + j * 240, lit = r() < .22, rf = r(); if (i === 0 && j === 0) continue; if (wx > x1 - 60 || wy > y1 - 60) continue;
    plainWindow(ctx, wx, wy, WIN.w, WIN.h, lit, rf, climb);
  }
  heroWindow(ctx, t, K, climb, k);
}
function plainWindow(ctx, x, y, w, h, lit, rf, climb) {
  ctx.fillStyle = '#0b0c18'; ctx.fillRect(x - 9, y - 9, w + 18, h + 13);
  const g = ctx.createLinearGradient(x, y, x + w * .4, y + h); g.addColorStop(0, mixHex('#2a3358', '#5a6c98', .3 + .4 * climb)); g.addColorStop(1, '#10142a'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  if (lit) { const rg = ctx.createRadialGradient(x + w * (.2 + .6 * rf), y + h * .6, 0, x + w * (.2 + .6 * rf), y + h * .6, 140); rg.addColorStop(0, 'rgba(255,190,120,.5)'); rg.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = rg; ctx.fillRect(x, y, w, h); }
  ctx.fillStyle = 'rgba(220,200,180,.10)'; ctx.beginPath(); ctx.moveTo(x + w * (.55 + .3 * rf), y); ctx.lineTo(x + w * (.75 + .3 * rf), y); ctx.lineTo(x + w * (.35 + .3 * rf), y + h); ctx.lineTo(x + w * (.15 + .3 * rf), y + h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = mixHex(FRAME_D, FRAME_L, .25 + .3 * climb); ctx.lineWidth = 6; ctx.strokeRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = mixHex('#55506a', '#8a7c80', climb); ctx.fillRect(x - 16, y + h + 3, w + 32, 9); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x - 16, y + h + 12, w + 32, 5);
}
// the hero window: the room (a lamp left on), the blind = the map cloth (it lowers on "Sleep"; the route draws on it)
function heroWindow(ctx, t, K, climb, k) {
  const { x0, y0, w, h } = WIN, px = 1 / k;
  ctx.fillStyle = '#0b0c18'; ctx.fillRect(x0 - 10, y0 - 10, w + 20, h + 15);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
  ctx.fillStyle = '#161a30'; ctx.fillRect(x0, y0, w, h);
  { const lx = x0 + w * .24, ly = y0 + h * .6, rg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 120); rg.addColorStop(0, 'rgba(255,190,120,.55)'); rg.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = rg; ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = 'rgba(8,8,16,.6)'; ctx.fillRect(x0 + w * .38, y0 + h * .64, w * .62, h * .36); ctx.fillStyle = 'rgba(255,200,140,.8)'; ctx.beginPath(); ctx.arc(lx, ly - 6, 4, 0, TAU); ctx.fill(); }
  // the blind: expo-out on "Sleep", a 3 % settle; the map is printed on the cloth and travels down with it
  const bu = clamp((t - (K.sleep - .05)) / .65), drop = bu <= 0 ? 0 : eoX(bu) + .03 * Math.sin(clamp((t - K.sleep - .4) / .5) * Math.PI) * (t > K.sleep + .4);
  const bh = mix(.14, 1, clamp(drop, 0, 1.03)) * h, my = y0 + bh - h;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, bh); ctx.clip();
  ctx.fillStyle = '#eadcc0'; ctx.fillRect(x0, y0, w, bh);
  ctx.save(); ctx.translate(x0, my); ctx.scale(MS, MS); mapPaint(ctx, t, K.map, VIEW0); ctx.restore();
  // the cloth: a fine weave over the print, the lamp shining through it, a soft fold shade at the roller
  ctx.strokeStyle = 'rgba(70,52,30,.07)'; ctx.lineWidth = Math.max(.12, .9 * px); ctx.beginPath();
  for (let x = x0 + .6; x < x0 + w; x += 1.4) { ctx.moveTo(x, y0); ctx.lineTo(x, y0 + bh); } for (let y = my + .6; y < y0 + bh; y += 1.4) { if (y < y0) continue; ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); } ctx.stroke();
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lx = x0 + w * .24, ly = y0 + h * .6, rg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 150); rg.addColorStop(0, `rgba(255,190,120,${.22 * clamp(bh / h)})`); rg.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = rg; ctx.fillRect(x0, y0, w, bh); ctx.restore(); }
  { const g = ctx.createLinearGradient(0, y0, 0, y0 + 14); g.addColorStop(0, 'rgba(30,20,10,.35)'); g.addColorStop(1, 'rgba(30,20,10,0)'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, 14); }
  ctx.restore();
  // the hem bar and its cord
  { const yb = y0 + bh; ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x0 - 1, yb - 2.5, w + 2, 5); ctx.fillStyle = 'rgba(255,210,160,.35)'; ctx.fillRect(x0 - 1, yb - 2.5, w + 2, .9);
    const sw = Math.sin(t * 2.1) * 1.6 + 2.5 * Math.exp(-Math.max(0, t - K.sleep - .5) * 3) * Math.sin((t - K.sleep) * 9) * (t > K.sleep);
    ctx.strokeStyle = '#5a3c22'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 + w / 2, yb + 2.5); ctx.lineTo(x0 + w / 2 + sw, yb + 20); ctx.stroke(); ctx.beginPath(); ctx.arc(x0 + w / 2 + sw, yb + 23, 3, 0, TAU); ctx.stroke(); }
  // the glass: a faint sheen of the morning sky (it fades as we come close)
  { const a = .16 * (1 - clamp((k - 2) / 2.5)); if (a > .005) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sx = x0 + w * (1.1 - .5 * climb), g = ctx.createLinearGradient(sx, y0, sx - w * .7, y0 + h); g.addColorStop(0, 'rgba(255,220,180,0)'); g.addColorStop(.45, `rgba(255,230,200,${a})`); g.addColorStop(.6, `rgba(255,230,200,${a * .25})`); g.addColorStop(1, 'rgba(255,220,180,0)'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h); ctx.restore(); } }
  ctx.restore();
  // roller box, frame, sill, a flower box on the sill
  ctx.fillStyle = '#d6c8aa'; ctx.fillRect(x0, y0, w, 6); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(x0, y0 + 6, w, 1.5);
  ctx.strokeStyle = mixHex(FRAME_D, FRAME_L, .35 + .35 * climb); ctx.lineWidth = 6; ctx.strokeRect(x0 - 3, y0 - 3, w + 6, h + 6);
  ctx.fillStyle = mixHex('#5c566e', '#948684', climb); ctx.fillRect(x0 - 18, y0 + h + 3, w + 36, 10); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(x0 - 18, y0 + h + 13, w + 36, 5);
  { const bx = x0 + 18, by = y0 + h + 13, bw = w - 36; ctx.fillStyle = '#4a3020'; ctx.fillRect(bx, by, bw, 16); ctx.fillStyle = 'rgba(255,200,140,.22)'; ctx.fillRect(bx, by, bw, 1.5);
    const r = prng(5); for (let i = 0; i < 30; i++) { const lx = bx + 5 + r() * (bw - 10), L = 9 + r() * 12, a = -Math.PI / 2 + (r() - .5) * 1.4 + Math.sin(t * 1.6 + i) * .08; ctx.fillStyle = r() < .3 ? '#b4482a' : mixHex('#24452e', '#557a48', r()); ctx.save(); ctx.translate(lx, by + 1); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(L / 2, 0, L / 2, 2.2 + r() * 1.6, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
}
