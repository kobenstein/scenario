// c07 · the world of have-to (shots 7.01–7.03): one huge engraved station hall, seen through one pinhole camera.
//   hallTake(ctx, t, K) → { C, st }   the take from the c06>c07 line plate (H.b) until the hall has gone up in smoke (7.03)
//   hallInit(K)                        call once per build (the hero's place in the crowd depends on the anchors)
//   HERO, heroPath(t, K), E0, geo(e)    where "you" ride and step off (lib/v2_c07_void.mjs continues from there)
// World: metres, x right, y up, z toward the camera. A barrel-vaulted iron-and-glass station 116 m wide, ribs every 16 m, galleries
// at 12 / 24 / 36 m, the end wall (z = -88) carries the giant time-card rack of 1.01 (the minute's card, copied from
// lib/sc01_m1_open.mjs) under a giant station clock in the lunette. Escalators run along x in planes z = const, so every escalator,
// every rib and the end wall is an affine picture of the camera (planeT); floors, walls and the vault are projected point by point.
// The plate line is the lit strip under the near handrail of the hero escalator E0: at H.b the camera is rolled (.2036 rad) and 17 m
// away, so the 30° rail lies exactly on the plate's line (through 960/590 at -.32 rad); then the camera pulls back and levels while the
// station's lamps switch on section by section, from the rail outward: each section rises out of the plate's dark ground as one picture.
// 7.03: the sections go dark again from the far end, their engraved lines turn into dotted ghost lines and drift off as smoke.
import { W, H, rgba, clamp, mix, prng, canvas, drift } from '../engine.mjs';
import { figure, figureFlat, walk } from './figure.mjs';
import { stipple, vnoise, fbm } from './art.mjs';
import { rosette } from './certificate.mjs';
import { scribble } from './paper.mjs';
import { smokeDots } from './ghost.mjs';
import { once, memo, TAU, eoX, qio, cio, sstep, mixHex, proj, planeT, setT, poly, pline, linePlateBG, linePlateLine, glowAt, PLATE_Y } from './v2_c07_kit.mjs';

const T30 = Math.tan(Math.PI / 6), C30 = Math.cos(Math.PI / 6), RAILH = .95, SKIRT = .14, TRUSS = 1.3, A = 1.6, F = 1300, HW = .78;
const STRIP = RAILH - .1;
export const HALL = { X: 58, spring: 44, crown: 74, ribs: [56, 40, 24, 8, -8, -24, -40, -56, -72], end: -88, levels: [12, 24, 36], gx: 52 };
export const COL = { void: '#0a0c22', amber: '#ffb35c', core: '#fff1d6', lamp: '#e8f0ff', haze: '#3c4c7a', rim: '#a9bde6' };

// ---------------------------------------------------------------- escalators (z = centre plane; d = +1 rises toward +x; mv = +1 runs up)
export const ESC = [
  { id: 'E0', z: 1.4, xb: -31.18, yb: 0, R: 36, d: 1, mv: 1, seed: 11, n: 30 },
  { id: 'E0b', z: -1.4, xb: -31.18, yb: 0, R: 36, d: 1, mv: -1, seed: 12, n: 26 },
  { id: 'E0c', z: -4.2, xb: -31.18, yb: 0, R: 36, d: 1, mv: 1, seed: 17, n: 26 },
  { id: 'E1', z: -29.2, xb: 31.18, yb: 0, R: 36, d: -1, mv: 1, seed: 13, n: 26 },
  { id: 'E1b', z: -32, xb: 31.18, yb: 0, R: 36, d: -1, mv: -1, seed: 14, n: 22 },
  { id: 'E2', z: -61.2, xb: -46, yb: 12, R: 24, d: 1, mv: 1, seed: 15, n: 18 },
  { id: 'E2b', z: -64, xb: -46, yb: 12, R: 24, d: 1, mv: -1, seed: 16, n: 16 },
  { id: 'E3', z: -61.2, xb: 46, yb: 12, R: 24, d: -1, mv: 1, seed: 18, n: 16 },
];
const GEO = new Map();
export function geo(e) {
  if (GEO.has(e)) return GEO.get(e);
  const run = e.R / T30;
  const yN = (s) => (s < -A ? 0 : s < A ? T30 * (s + A) ** 2 / (4 * A) : s < run - A ? T30 * s : s < run + A ? e.R - T30 * (run + A - s) ** 2 / (4 * A) : e.R);
  const g = { run, yN, X: (s) => e.xb + e.d * s, Y: (s) => e.yb + yN(s), s0: -A - 1.4, s1: run + A + 1.4, top: run + A, bot: -A };
  GEO.set(e, g); return g;
}
export const E0 = ESC[0];

// ---------------------------------------------------------------- time: the machine starts with the light, stops on "ends"
const VMAX = .75;
function intS(t, a, d) { if (t <= a) return 0; const u = (t - a) / d; return u >= 1 ? d / 2 + (t - a - d) : d * (u ** 3 - u ** 4 / 2); }
export function runDist(t, K) { return VMAX * C30 * (intS(t, K.hb + .2, 1.1) - intS(t, K.stop, .8)); }   // horizontal metres carried

// ---------------------------------------------------------------- the hero ("you"): rides E0 to the top, two steps off, stands
export const HERO = { s0: 0, seed: 7, dress: { coat: '#3b4763', pants: '#1a1b2e', shoes: '#0c0c16', skin: '#d9b08e', hair: '#2a1d1a' }, scarf: '#c8843a' };
export function heroPath(t, K) {
  const g = geo(E0), sTop = g.top + .35;
  const s = sTop + (runDist(t, K) - runDist(K.top, K));
  if (t <= K.top) return { s, x: g.X(s), y: g.Y(s), step: 0, carried: true };
  const u = clamp((t - K.top) / 1.05), st = sTop + 1.6 * (u < 1 ? u - Math.sin(u * TAU) / TAU * .55 : 1);
  return { s: st, x: g.X(st), y: E0.R, step: u, carried: false };
}
export function hallInit(K) { HERO.s0 = geo(E0).top + .35 - runDist(K.top, K); RIDERS.clear(); }

// ---------------------------------------------------------------- light: sections switch on from the rail outward (7.01), go dark from the far end (7.03)
const BAYS = [[56, 70], [40, 56], [24, 40], [8, 24], [-8, 8], [-24, -8], [-40, -24], [-56, -40], [-72, -56], [-88, -72]];
const rankOf = (z) => { if (z <= HALL.end + .5) return 6; for (const [z0, z1] of BAYS) if (z >= z0 && z < z1) return Math.round(Math.abs((z0 + z1) / 2) / 16); return 4; };
export function onTime(z, K) { return K.hb + .32 + .33 * rankOf(z); }
// light of the hall section at depth z: 0 dark .. 1 lit (the reveal times the dissolve)
export function secLight(z, t, K) {
  const on = onTime(z, K), rev = sstep(on, on + .24, t);
  return rev * (1 - goneAt(z, t, K));
}
// 7.03: the dissolve front runs from the far end toward the hero (0 = still there, 1 = gone)
export function disTime(z, K) { return K.dis0 + 2.4 * Math.pow(clamp(1 - Math.abs(z - E0.z) / 92), .9); }
export function goneAt(z, t, K) { if (!K.dis0) return 0; const d = disTime(z, K); return sstep(d, d + .5, t); }

// ---------------------------------------------------------------- textures
// ---- the time card of 1.01 (copied from lib/sc01_m1_open.mjs cardTex): manila stock, number, rows of punched times in amber ink
const CARD = { w: 180, h: 342, row0: 92, rowH: 17.2, rows: 14, cols: [8, 30, 67, 104, 141, 172] };
const DAYS = 'MTWTFSSMTWTFSS', INK = '#2a3346', AMB_INK = '#b8621f';
function cardCanvas(res, o = {}) {
  const { w, h } = CARD, [c, g] = canvas(Math.ceil(w * res), Math.ceil(h * res)), r = prng(o.seed ?? 1);
  g.scale(res, res);
  g.beginPath(); g.roundRect(0, 0, w, h, 5);
  const pg = g.createLinearGradient(0, 0, w * .4, h); pg.addColorStop(0, '#efe2bf'); pg.addColorStop(.6, '#e6d6ad'); pg.addColorStop(1, '#d4c193'); g.fillStyle = pg; g.fill();
  g.save(); g.clip();
  g.fillStyle = '#8e2f2a'; g.font = '15px "Instrument Serif"'; g.fillText('Nº', 10, 24); g.font = '600 13px "Inter"'; g.fillText(String(o.num ?? 417).padStart(4, '0'), 30, 24);
  g.strokeStyle = rgba(INK, .55); g.lineWidth = .6; g.beginPath(); g.moveTo(8, 32); g.lineTo(w - 8, 32); g.stroke();
  scribble(g, 34, 46, 120, 7, { seed: (o.seed ?? 1) * 7 + 1, ink: '#1f1a2e', lw: 1.1 });
  g.lineWidth = 1.1; g.strokeStyle = rgba(INK, .75); g.beginPath(); g.moveTo(6, 78); g.lineTo(w - 6, 78); g.moveTo(6, 81); g.lineTo(w - 6, 81); g.stroke();
  const { row0, rowH, rows, cols } = CARD;
  for (let i = 0; i < rows; i++) {
    const y = row0 + i * rowH;
    if (i === 7) { g.fillStyle = rgba(INK, .14); g.fillRect(6, y - 1, w - 12, 2); }
    g.fillStyle = rgba(INK, .75); g.font = '600 6px "Inter"'; g.fillText(DAYS[i], 13, y + 11.5);
    g.strokeStyle = rgba(INK, .45); g.lineWidth = .45; g.beginPath(); g.moveTo(6, y + rowH); g.lineTo(w - 6, y + rowH); for (const cx of cols.slice(1, -1)) { g.moveTo(cx, y); g.lineTo(cx, y + rowH); } g.stroke();
    if (i < (o.past ?? 0) && DAYS[i] !== 'S') {
      g.font = '600 8.4px "Inter"'; g.textAlign = 'center';
      for (let k = 0; k < 4; k++) { const s = ['8:5' + Math.floor(r() * 9), '12:0' + Math.floor(r() * 9), '12:3' + Math.floor(r() * 9), '17:0' + Math.floor(r() * 9)][k]; g.fillStyle = rgba(AMB_INK, .72 + r() * .25); g.fillText(s, (cols[k + 1] + cols[k + 2]) / 2 + (r() - .5) * 2, y + 12.2); }
      g.textAlign = 'left';
    }
  }
  g.restore();
  g.strokeStyle = 'rgba(90,70,40,.45)'; g.lineWidth = .8; g.beginPath(); g.roundRect(0, 0, w, h, 5); g.stroke();
  return c;
}
// ---- the end wall: masonry, the rack of time cards under a cornice, the lunette with a fan of glass round the giant clock
export const RACK = { x0: -47, x1: 47, y0: 2.2, rows: 12, pitchY: 3.0, pitchX: 1.52, cw: 1.12, ch: 2.13 };
const WALLRES = 20;
function wallCanvas() {
  const res = WALLRES, w = 116, h = 74, [c, g] = canvas(Math.ceil(w * res), Math.ceil(h * res)), r = prng(31), n = vnoise(8);
  const TX = (x) => (x + 58) * res, TY = (y) => (h - y) * res;
  g.save(); g.beginPath(); g.moveTo(TX(-58), TY(0)); g.lineTo(TX(-58), TY(44)); for (let i = 0; i <= 64; i++) { const th = Math.PI - i / 64 * Math.PI; g.lineTo(TX(58 * Math.cos(th)), TY(44 + 30 * Math.sin(th))); } g.lineTo(TX(58), TY(0)); g.closePath(); g.clip();
  const bg = g.createLinearGradient(0, 0, 0, h * res); bg.addColorStop(0, '#1b2440'); bg.addColorStop(.55, '#161d36'); bg.addColorStop(1, '#0e1326'); g.fillStyle = bg; g.fillRect(0, 0, w * res, h * res);
  // lunette: a fan of glass panes (pre-dawn sky), iron mullions radiating from the clock
  const cx = TX(0), cy = TY(57);
  g.save(); g.beginPath(); for (let i = 0; i <= 64; i++) { const th = i / 64 * Math.PI; const px = TX(54 * Math.cos(th)), py = TY(45.5 + 26.5 * Math.sin(th)); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); g.clip();
  const sg = g.createRadialGradient(cx, cy, 0, cx, cy, 52 * res); sg.addColorStop(0, '#6d81ad'); sg.addColorStop(.5, '#3d4f7c'); sg.addColorStop(1, '#253259'); g.fillStyle = sg; g.fillRect(0, 0, w * res, h * res);
  g.strokeStyle = '#0d1326'; g.lineWidth = .3 * res; g.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI; g.moveTo(cx + Math.cos(a) * 14 * res, cy - Math.sin(a) * 14 * res); g.lineTo(cx + Math.cos(a) * 70 * res, cy - Math.sin(a) * 70 * res); } g.stroke();
  g.lineWidth = .2 * res; for (const rr of [20, 27, 35, 44]) { g.beginPath(); g.ellipse(cx, cy + 11.5 * res, rr * res * 1.15, rr * res, 0, Math.PI, TAU); g.stroke(); }
  g.restore();
  // wall below the lunette: ashlar courses, engraved hatch, plaster mottling
  g.fillStyle = '#121a31'; g.fillRect(0, TY(45.5), w * res, 45.5 * res);
  g.strokeStyle = 'rgba(0,0,0,.32)'; g.lineWidth = 1; g.beginPath(); for (let x = -h * res; x < w * res; x += 5 + r() * 3) { g.moveTo(x, TY(45.5)); g.lineTo(x + 45.5 * res * .45, TY(0)); } g.stroke();
  g.strokeStyle = 'rgba(150,170,220,.09)'; g.lineWidth = 1.2; g.beginPath(); for (let y = 1.5; y < 45; y += 1.5) { g.moveTo(0, TY(y)); g.lineTo(w * res, TY(y)); } g.stroke();
  for (let i = 0; i < 1400; i++) { const x = r() * w * res, y = TY(r() * 45), a = .03 + .05 * fbm(n, x * .01, y * .01, 3); g.fillStyle = `rgba(150,170,220,${a})`; g.fillRect(x, y, 3, 3); }
  // cornice and pilasters framing the rack
  g.fillStyle = '#26314f'; g.fillRect(0, TY(45.6), w * res, 1.6 * res); g.fillStyle = 'rgba(200,215,255,.35)'; g.fillRect(0, TY(45.6), w * res, .18 * res);
  g.fillStyle = '#26314f'; g.fillRect(TX(-50), TY(40.6), 100 * res, 1.4 * res); g.fillStyle = 'rgba(200,215,255,.3)'; g.fillRect(TX(-50), TY(40.6), 100 * res, .15 * res);
  for (const px of [-52.5, -49.4, 49.4, 52.5]) { g.fillStyle = '#1f2943'; g.fillRect(TX(px) - .9 * res, TY(44), 1.8 * res, 44 * res); g.fillStyle = 'rgba(200,215,255,.16)'; g.fillRect(TX(px) - .9 * res, TY(44), .15 * res, 44 * res); }
  // the rack: back panel, cards in their pockets (a few empty), ledges with number tags and dividers (1.01 at the scale of the hall)
  const RK = RACK, cols = Math.floor((RK.x1 - RK.x0) / RK.pitchX);
  g.fillStyle = '#10162a'; g.fillRect(TX(RK.x0 - 1.2), TY(RK.y0 + RK.rows * RK.pitchY + .6), (RK.x1 - RK.x0 + 2.4) * res, (RK.rows * RK.pitchY + 1) * res);
  const cards = [0, 1, 2, 3, 4, 5].map((v) => cardCanvas(.3, { seed: 11 + v * 5, past: 3 + (v % 5) * 2, num: 300 + v * 37 }));
  for (let j = 0; j < RK.rows; j++) {
    const yb = RK.y0 + j * RK.pitchY;
    for (let i = 0; i <= cols; i++) {
      if (r() < .07) continue;
      const x = RK.x0 + i * RK.pitchX, lift = (r() - .5) * .25;
      g.drawImage(cards[Math.floor(r() * 6)], TX(x - RK.cw / 2), TY(yb + .55 + RK.ch + lift), RK.cw * res, RK.ch * res);
    }
    g.fillStyle = '#28324f'; g.fillRect(TX(RK.x0 - .6), TY(yb + 1.25), (RK.x1 - RK.x0 + 1.2) * res, 1.05 * res);
    g.fillStyle = 'rgba(205,218,255,.42)'; g.fillRect(TX(RK.x0 - .6), TY(yb + 1.25), (RK.x1 - RK.x0 + 1.2) * res, .09 * res);
    g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(TX(RK.x0 - .6), TY(yb + .2), (RK.x1 - RK.x0 + 1.2) * res, .25 * res);
    for (let i = 0; i <= cols; i++) { const x = RK.x0 + i * RK.pitchX; g.fillStyle = 'rgba(214,206,186,.6)'; g.fillRect(TX(x - .22), TY(yb + 1.02), .44 * res, .26 * res); g.fillStyle = 'rgba(5,6,12,.55)'; g.fillRect(TX(x + RK.pitchX / 2) - 1, TY(yb + 1.25), 2, 1.05 * res); }
  }
  g.restore();
  stipple(c, { k: .18, g: 1, seed: 6, mid: false, boost: 1 });
  return c;
}
const WALLC = memo('c07wallc', () => ({ c: null }));
function wallTex(level) { return once('c07wall' + level, () => { if (!WALLC.c) WALLC.c = wallCanvas(); if (level === 0) return WALLC.c; const f = level === 1 ? .5 : .25, [c, g] = canvas(Math.ceil(WALLC.c.width * f), Math.ceil(WALLC.c.height * f)); g.imageSmoothingQuality = 'high'; g.drawImage(WALLC.c, 0, 0, c.width, c.height); return c; }); }
// ---- a station clock dial (backlit amber-cream), bars instead of numerals; the giant one has Roman numerals and a guilloche heart
function dialCanvas(S, giant) {
  const [c, g] = canvas(S, S), cx = S / 2, R = S / 2 - 2;
  const bz = g.createLinearGradient(0, 0, S, S); bz.addColorStop(0, '#b4bed2'); bz.addColorStop(.45, '#454e64'); bz.addColorStop(1, '#141924'); g.fillStyle = bz; g.beginPath(); g.arc(cx, cx, R, 0, TAU); g.fill();
  g.fillStyle = '#0d111c'; g.beginPath(); g.arc(cx, cx, R * .9, 0, TAU); g.fill();
  const fg = g.createRadialGradient(cx - R * .2, cx - R * .25, R * .05, cx, cx, R * .87); fg.addColorStop(0, '#fff4df'); fg.addColorStop(.6, '#ffdcaa'); fg.addColorStop(1, '#e8a868'); g.fillStyle = fg; g.beginPath(); g.arc(cx, cx, R * .87, 0, TAU); g.fill();
  g.strokeStyle = '#1b1f2c';
  for (let k = 0; k < 60; k++) { const a = k / 60 * TAU, big = k % 5 === 0, r0 = R * .83, r1 = R * (big ? (giant ? .7 : .62) : .77); g.lineWidth = big ? R * (giant ? .035 : .06) : R * .014; g.beginPath(); g.moveTo(cx + Math.sin(a) * r0, cx - Math.cos(a) * r0); g.lineTo(cx + Math.sin(a) * r1, cx - Math.cos(a) * r1); g.stroke(); }
  if (giant) {
    g.fillStyle = '#1b1f2c'; g.font = `${Math.round(R * .15)}px "Instrument Serif"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const RN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.fillText(RN[k], cx + Math.sin(a) * R * .56, cx - Math.cos(a) * R * .56); }
    rosette(g, cx, cx, { R: R * .2, A: R * .05, B: R * .02, n: 12, m: 5, lines: 16, col: '#8a5a24', w: Math.max(.6, R * .004), a: .55 });
    g.textBaseline = 'alphabetic';
  }
  const sh = g.createLinearGradient(cx - R, cx - R, cx + R * .3, cx + R * .4); sh.addColorStop(0, 'rgba(255,255,255,.2)'); sh.addColorStop(.5, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.beginPath(); g.arc(cx, cx, R * .87, 0, TAU); g.fill();
  stipple(c, { k: .2, g: 1, seed: giant ? 9 : 4, mid: false, boost: 1 });
  return c;
}
const dialTex = () => once('c07dial', () => dialCanvas(192, false));
const giantTex = () => once('c07giant', () => dialCanvas(768, true));
// ---- a pendant globe lamp (cold white) and a soft lamp glow sprite
const lampTex = () => once('c07lamp', () => { const S = 128, [c, g] = canvas(S, S), rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.12, 'rgba(236,243,255,.9)'); rg.addColorStop(.3, 'rgba(190,210,250,.32)'); rg.addColorStop(.62, 'rgba(150,175,235,.08)'); rg.addColorStop(1, 'rgba(150,175,235,0)'); g.fillStyle = rg; g.fillRect(0, 0, S, S); return c; });

// ---------------------------------------------------------------- the camera of the take
// a camera is given by the point it looks after (T), where that point sits on screen (px, py), its distance (d), roll and the
// principal point (ox, oy = the vanishing point of the hall): C follows, so the target stays pinned while the camera dollies and levels
function aim(T, px, py, d, roll, ox = W / 2, oy = H / 2) {
  const cr = Math.cos(roll), sr = Math.sin(roll), dx = px - W / 2, dy = py - H / 2, u = dx * cr + dy * sr, v = -dx * sr + dy * cr;
  return { x: T[0] - (u - (ox - W / 2)) * d / F, y: T[1] + (v - (oy - H / 2)) * d / F, z: T[2] + d, f: F, roll, ox, oy };
}
export const RAIL0 = [0, E0.yb + T30 * 31.18 + STRIP, E0.z + HW];   // the strip point that sits on the plate line's centre at H.b
export const D0 = 17, ROLL0 = -.32 + Math.PI / 6;
const WIDE = { p: [1010, 640], d: 40, ox: 760, oy: 640 };
export function hallCam(t, K) {
  const u1 = qio(clamp((t - K.hb - .04) / (K.wideAt - K.hb - .04)));
  const bob = 2 * Math.sin(t * .9) * (1 - sstep(0, .35, u1));
  let T = RAIL0, px = mix(W / 2, WIDE.p[0], u1), py = mix(PLATE_Y + bob, WIDE.p[1], u1), d = D0 * Math.pow(WIDE.d / D0, u1), roll = ROLL0 * (1 - u1);
  let ox = mix(W / 2, WIDE.ox, u1), oy = mix(H / 2, WIDE.oy, u1);
  const dr = sstep(K.wideAt - .8, K.wideAt + .6, t);
  px += drift(t, 10, 1) * dr; py += drift(t, 6, 4) * dr; d *= 1 - .03 * sstep(K.wideAt - .5, K.follow + .3, t);
  if (t > K.follow) {
    // 7.02: follow one figure upward to the top landing
    const h = heroPath(t, K), Th = [h.x, h.y + 1.05, E0.z];
    const u2 = cio(clamp((t - K.follow) / (K.arrive - K.follow)));
    const C0 = aim(T, px, py, d, roll, ox, oy), q = proj(C0)(Th[0], Th[1], Th[2]);
    const pf = [1010 + 10 * Math.sin(t * .5), 600];
    T = Th; px = mix(q[0], pf[0], u2); py = mix(q[1], pf[1], u2); d = q[2] * Math.pow(9.4 / q[2], u2);
    ox = mix(ox, 900, u2); oy = mix(oy, 560, u2);
    const u3 = sstep(K.arrive, K.dis0 + 3.5, t); d *= 1 - .08 * u3; px -= 40 * u3;
  }
  return aim(T, px, py, d, roll, ox, oy);
}

// ---------------------------------------------------------------- drawing helpers
const haze = (ctx, a) => { if (a > .003) { ctx.fillStyle = rgba(COL.haze, a); ctx.fillRect(0, 0, W, H); } };
const shadeCol = (c, k) => (k > .001 ? mixHex(c, COL.void, clamp(k)) : c);
// blend two poses (angles and offsets)
export function blendPose(a, b, k) {
  const o = { ...a, ...b }, m = (x, y) => mix(x ?? 0, y ?? 0, k), m2 = (x, y) => [m(x?.[0], y?.[0]), m(x?.[1], y?.[1])];
  for (const key of ['sh', 'el', 'hip', 'kn', 'ft']) if (a[key] || b[key]) o[key] = m2(a[key] || [0, 0], b[key] || [0, 0]);
  for (const key of ['lean', 'head', 'dy']) o[key] = m(a[key], b[key]);
  if (k < 1) o._walk = a._walk; else delete o._walk;
  return o;
}
// ghost lines of a section going (screen-space polylines): solid → dotted → smoke
function ghost(ctx, lines, z, t, K, o = {}) {
  if (!K.dis0 || !lines.length) return;
  const d = disTime(z, K), g = sstep(d - .1, d + .45, t), sm = sstep(d + .45, d + 1.9, t);
  if (g <= 0 || sm >= 1) return;
  const col = o.col || '#e9dcc0', a = (o.a ?? .55);
  ctx.save(); ctx.lineCap = 'round';
  if (sm <= 0) {
    const P = 6, on = mix(P, .01, g); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = o.w ?? 1.2; ctx.setLineDash([on, P - on]);
    ctx.beginPath(); for (const L of lines) pline(ctx, L); ctx.stroke(); ctx.setLineDash([]);
  } else for (let i = 0; i < lines.length; i++) smokeDots(ctx, lines[i], sm, { col, a, w: o.w ?? 1.2, dot: 6, t, seed: (o.seed ?? 3) + i, wind: [.25, -1] });
  ctx.restore();
}

// ---------------------------------------------------------------- the end wall, ribs, vault, side walls, floor
function drawEndWall(ctx, C, t, K, st) {
  const L = secLight(HALL.end, t, K); if (L <= 0) return;
  const q = C.f / (C.z - HALL.end), lev = q > 16 ? 0 : q > 8 ? 1 : 2, img = wallTex(lev);
  ctx.save(); setT(ctx, planeT(C, HALL.end)); ctx.scale(1, -1); ctx.globalAlpha = L; ctx.drawImage(img, -58, -74, 116, 74); ctx.restore();
  // the giant clock lights on "have-to"
  const on = sstep(K.haveTo - .1, K.haveTo + .12, t) * (1 - goneAt(HALL.end, t, K));
  clockAt(ctx, C, 0, 57, HALL.end + .3, 12.5, t, K, on, true, st, L);
  if (st.ghosts) { const P = proj(C), z = HALL.end, Lx = []; const R = RACK;
    for (let j = 0; j <= R.rows; j++) { const a = P(R.x0, R.y0 + j * R.pitchY + 1.25, z), b = P(R.x1, R.y0 + j * R.pitchY + 1.25, z); Lx.push([a, b]); }
    const cl = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU; const p = P(13.6 * Math.cos(a), 57 + 13.6 * Math.sin(a), z); cl.push(p); } Lx.push(cl);
    const ar = []; for (let i = 0; i <= 40; i++) { const th = i / 40 * Math.PI; ar.push(P(54 * Math.cos(th), 45.5 + 26.5 * Math.sin(th), z)); } Lx.push(ar);
    st.ghosts.push([Lx, z]); }
}
function clockAt(ctx, C, x, y, z, r, t, K, on, giant = false, st = null, alpha = 1) {
  const T = planeT(C, z), q = T[6], rp = r * q; if (rp < 1.2 || C.z - z < 1 || alpha <= 0) return;
  if (st && st.clocks) st.clocks.push([x, y, z, r, on, giant]);
  ctx.save(); setT(ctx, T); ctx.scale(1, -1); ctx.globalAlpha = alpha;
  ctx.drawImage(giant ? giantTex() : dialTex(), x - r, -y - r, 2 * r, 2 * r);
  if (rp > 3) {   // hands: 7:59 → 8:00 on "have-to"; the second hand sweeps; everything stops on "ends"
    const tc = Math.min(t, K.stop + .05), jump = eoX(clamp((t - K.haveTo) / .12));
    const mm = 59 + jump, hh = 7 + mm / 60, sec = ((tc - K.hb) * 6 + 41) % 60;
    const hand = (ang, L, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x - Math.sin(ang) * L * .18, -y + Math.cos(ang) * L * .18); ctx.lineTo(x + Math.sin(ang) * L, -y - Math.cos(ang) * L); ctx.stroke(); };
    ctx.lineCap = 'butt';
    hand(hh / 12 * TAU, r * .5, r * .085, '#14161f'); hand(mm / 60 * TAU, r * .74, r * .06, '#14161f');
    if (rp > 10) hand(sec / 60 * TAU, r * .76, r * .016, '#8e2f2a');
    ctx.fillStyle = '#14161f'; ctx.beginPath(); ctx.arc(x, -y, r * .05, 0, TAU); ctx.fill();
  }
  if (on < 1) { ctx.fillStyle = `rgba(8,10,24,${(.88 * (1 - on)).toFixed(3)})`; ctx.beginPath(); ctx.arc(x, -y, r * .9, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function clockGlow(ctx, C, x, y, z, r, on, giant, a = 1) {
  if (on <= 0 || C.z - z < 1) return; const q = C.f / (C.z - z), p = proj(C)(x, y, z);
  glowAt(ctx, p[0], p[1], r * q * (giant ? 2.3 : 3.6), COL.amber, (giant ? .24 : .3) * on * a, COL.core);
}
function ribPts(n, rx, ry, y0) { const out = []; for (let i = 0; i <= n; i++) { const th = i / n * Math.PI; out.push([rx * Math.cos(th), y0 + ry * Math.sin(th)]); } return out; }
const RIB = memo('c07rib', () => ({ out: ribPts(64, 58, 30, 44), inn: ribPts(64, 55.6, 27.6, 44) }));
const LAMPX = [-41, 41];
function drawRib(ctx, C, z, t, K, st, L) {
  const T = planeT(C, z), q = T[6]; if (C.z - z < 2 || L <= 0) return;
  ctx.save(); setT(ctx, T); ctx.globalAlpha = L;
  const px = 1 / q;
  ctx.beginPath(); pline(ctx, RIB.out); for (let i = RIB.inn.length - 1; i >= 0; i--) ctx.lineTo(RIB.inn[i][0], RIB.inn[i][1]); ctx.closePath();
  ctx.fillStyle = '#10162a'; ctx.fill();
  ctx.strokeStyle = rgba('#7d8fb8', .5); ctx.lineWidth = Math.max(px * .8, .09); ctx.beginPath();
  for (let i = 0; i < 64; i++) { const a = i % 2 ? RIB.out[i] : RIB.inn[i], b = i % 2 ? RIB.inn[i + 1] : RIB.out[i + 1]; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();
  ctx.strokeStyle = rgba('#b9c8ea', .45); ctx.lineWidth = Math.max(px * 1.2, .12); ctx.beginPath(); pline(ctx, RIB.inn); ctx.stroke();
  ctx.strokeStyle = rgba('#05070f', .9); ctx.lineWidth = Math.max(px * 1.2, .14); ctx.beginPath(); pline(ctx, RIB.out); ctx.stroke();
  for (const s of [-1, 1]) {
    const xi = s * 55.4, xa = Math.min(s * 58, xi);
    ctx.fillStyle = '#131a2f'; ctx.fillRect(xa, 0, 2.6, 44);
    ctx.fillStyle = rgba('#b9c8ea', .3); ctx.fillRect(s > 0 ? xi : xi - .14, 0, .14, 44);
    ctx.fillStyle = '#1f2840'; ctx.fillRect(xa - .5, 42.6, 3.6, 1.6); ctx.fillRect(xa - .5, 0, 3.6, 1.2);
    ctx.strokeStyle = rgba('#000000', .35); ctx.lineWidth = Math.max(px, .05); ctx.beginPath(); for (let y = 1.4; y < 42.4; y += .6) { ctx.moveTo(xa, y); ctx.lineTo(xa + 2.6, y + .3); } ctx.stroke();
    // lamp rod
    ctx.strokeStyle = '#0a0d18'; ctx.lineWidth = Math.max(px, .08); ctx.beginPath(); ctx.moveTo(LAMPX[s > 0 ? 1 : 0], 62.6); ctx.lineTo(LAMPX[s > 0 ? 1 : 0], 51.6); ctx.stroke();
    // clock bracket on the pier
    ctx.lineWidth = Math.max(px, .1); ctx.beginPath(); ctx.moveTo(xi, 30); ctx.lineTo(s * 52.4, 30); ctx.stroke();
  }
  ctx.restore();
  // pier clocks (both sides), lamps (record for the light pass)
  const on = L;
  for (const s of [-1, 1]) clockAt(ctx, C, s * 51.7, 28.6, z, 1.15, t, K, on, false, st, L);
  for (const x of LAMPX) st.lamps.push([x, 51, z, onTime(z, K), L]);
  if (st.ghosts && q > .5) { const P = proj(C); const o = RIB.out.map(([x, y]) => P(x, y, z)), i = RIB.inn.map(([x, y]) => P(x, y, z)); st.ghosts.push([[o, i, [P(-58, 0, z), P(-58, 44, z)], [P(58, 0, z), P(58, 44, z)], [P(-55.4, 0, z), P(-55.4, 44, z)], [P(55.4, 0, z), P(55.4, 44, z)]], z]); }
}
function drawVault(ctx, P, za, zb, L, sky) {
  if (L <= 0) return;
  const N = 20, pts = (z) => { const o = []; for (let i = 0; i <= N; i++) { const th = i / N * Math.PI; o.push(P(57.6 * Math.cos(th), 44 + 29.6 * Math.sin(th), z)); } return o; };
  const A = pts(za), B = pts(zb);
  ctx.save(); ctx.globalAlpha = L;
  for (let i = 0; i < N; i++) {
    const q = [A[i], A[i + 1], B[i + 1], B[i]]; if (q.some((p) => p[2] < .5)) continue;
    const k = Math.sin((i + .5) / N * Math.PI);
    ctx.fillStyle = mixHex(mixHex('#1e2a4c', '#7f93bf', sky), mixHex('#33467a', '#c3d2ee', sky), .2 + .7 * k); poly(ctx, q); ctx.fill();
  }
  ctx.strokeStyle = 'rgba(8,11,24,.9)'; ctx.lineWidth = 1.3; ctx.beginPath();
  for (let i = 1; i < N; i++) { if (A[i][2] < .5 || B[i][2] < .5) continue; ctx.moveTo(A[i][0], A[i][1]); ctx.lineTo(B[i][0], B[i][1]); }
  for (let z = za - 4; z > zb + .1; z -= 4) { const C = pts(z); if (C[N >> 1][2] < .5) continue; ctx.moveTo(C[0][0], C[0][1]); for (const p of C) ctx.lineTo(p[0], p[1]); }
  ctx.stroke(); ctx.restore();
}
function drawSide(ctx, C, P, s, za, zb, t, K, st, L) {
  if (L <= 0) return;
  const X = s * 58, gx = s * HALL.gx, zm = (za + zb) / 2;
  const wq = [P(X, 0, za), P(X, 44, za), P(X, 44, zb), P(X, 0, zb)]; if (wq.some((p) => p[2] < .5)) return;
  ctx.save(); ctx.globalAlpha = L;
  ctx.fillStyle = '#18213d'; poly(ctx, wq); ctx.fill();
  // masonry courses
  ctx.strokeStyle = 'rgba(150,170,220,.08)'; ctx.lineWidth = 1; ctx.beginPath(); for (let y = 2; y < 44; y += 2) { const a = P(X, y, za), b = P(X, y, zb); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } ctx.stroke();
  const gl = [];
  for (const [y0, y1] of [[1.5, 10.2], [13.5, 22.2], [25.5, 34.2], [37.4, 43]]) {
    const hw = 5, pts = [], rv = [];
    pts.push(P(X, y0, zm + hw)); for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI, zz = zm + hw * Math.cos(a), yy = y1 - hw * .8 + hw * .8 * Math.sin(a); pts.push(P(X, yy, zz)); } pts.push(P(X, y0, zm - hw));
    for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI, zz = zm + hw * Math.cos(a), yy = y1 - hw * .8 + hw * .8 * Math.sin(a); rv.push(P(X + s * 1.4, yy, zz)); }
    ctx.fillStyle = '#0a0e1d'; poly(ctx, pts); ctx.fill();
    // the reveal (thickness of the wall) catches a little light on one side
    ctx.strokeStyle = 'rgba(170,190,235,.3)'; ctx.lineWidth = 1; ctx.beginPath(); pline(ctx, pts.slice(1, -1)); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,140,190,.18)'; ctx.beginPath(); pline(ctx, rv); ctx.stroke();
    gl.push(pts.slice(1, -1));
  }
  for (const Lv of HALL.levels) {
    const f = [P(gx, Lv, za), P(gx, Lv, zb), P(gx, Lv - .9, zb), P(gx, Lv - .9, za)];
    if (C.y < Lv - .9) { ctx.fillStyle = '#0d1326'; poly(ctx, [P(gx, Lv - .9, za), P(gx, Lv - .9, zb), P(X, Lv - .9, zb), P(X, Lv - .9, za)]); ctx.fill(); }
    else if (C.y > Lv) { ctx.fillStyle = '#2b3656'; poly(ctx, [P(gx, Lv, za), P(gx, Lv, zb), P(X, Lv, zb), P(X, Lv, za)]); ctx.fill(); }
    ctx.fillStyle = '#212b47'; poly(ctx, f); ctx.fill();
    ctx.strokeStyle = 'rgba(190,206,245,.42)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(f[0][0], f[0][1]); ctx.lineTo(f[1][0], f[1][1]); ctx.stroke();
    const r0 = P(gx, Lv + 1.1, za), r1 = P(gx, Lv + 1.1, zb); ctx.strokeStyle = 'rgba(160,178,220,.5)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(r0[0], r0[1]); ctx.lineTo(r1[0], r1[1]);
    for (let z = za; z >= zb - .01; z -= 1.6) { const a = P(gx, Lv, z), b = P(gx, Lv + 1.1, z); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    ctx.stroke();
    gl.push([r0, r1], [f[0], f[1]]);
  }
  ctx.restore();
  // people at the railings, looking into the hall
  galleryPeople(ctx, C, P, s, za, zb, t, K, L);
  if (st.ghosts) st.ghosts.push([gl, zm]);
}
const GP = memo('c07gp', () => { const r = prng(404), o = []; for (const s of [-1, 1]) for (const Lv of [0, 12, 24, 36]) for (let z = 66; z > -86; z -= 2.2 + r() * 4) if (r() < .55) o.push({ s, Lv, z, x: s * (Lv ? 53.2 + r() * 1.8 : 47 + r() * 6), seed: Math.floor(r() * 1000), col: ['#1b2036', '#232a45', '#171b2e', '#262d47'][Math.floor(r() * 4)], hair: ['short', 'long', 'bun', 'grey'][Math.floor(r() * 4)], coat: r() < .5, lean: r() < .4 }); return o; });
function galleryPeople(ctx, C, P, s, za, zb, t, K, L) {
  for (const g of GP) {
    if (g.s !== s || g.z > za || g.z <= zb) continue;
    const p = P(g.x, g.Lv + .87, g.z); if (p[2] < 2) continue;
    const sc = p[3] * 1.75 / 185; if (sc < .03 || p[0] < -40 || p[0] > W + 40) continue;
    const pose = g.lean ? { lean: .1, sh: [.55, .4], el: [.5, .55], head: .12, coat: g.coat, hair: g.hair } : { coat: g.coat, hair: g.hair };
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(C.roll || 0);
    figureFlat(ctx, 0, 0, sc, pose, { fast: true, col: shadeCol(g.col, 1 - L), rim: sc > .08 && L > .5 ? rgba(COL.rim, .45 * L) : null, rimSide: -s, flip: s > 0, t, seed: g.seed, shadow: false });
    ctx.restore();
  }
}
function drawFloor(ctx, C, P, za, zb, t, K, L) {
  if (L <= 0) return;
  const q = [P(-58, 0, za), P(58, 0, za), P(58, 0, zb), P(-58, 0, zb)]; if (q.some((p) => p[2] < .5)) return;
  ctx.save(); ctx.globalAlpha = L;
  const g = ctx.createLinearGradient(0, q[2][1], 0, q[0][1]); g.addColorStop(0, '#26304e'); g.addColorStop(1, '#161d38'); ctx.fillStyle = g; poly(ctx, q); ctx.fill();
  ctx.strokeStyle = 'rgba(150,170,220,.14)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = -56; x <= 56; x += 4) { const a = P(x, 0, za), b = P(x, 0, zb); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  for (let z = Math.floor(za / 4) * 4; z > zb; z -= 4) { const a = P(-58, 0, z), b = P(58, 0, z); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();
  // pools of lamplight on the floor under the lamp rows
  for (const x of LAMPX) for (const zr of HALL.ribs) {
    if (zr > za + 8 || zr < zb - 8) continue;
    const c = P(x, 0, zr); if (c[2] < 2) continue;
    const rx = 9 * c[3], ry = Math.max(2, rx * Math.abs((C.y) / Math.max(1, c[2])) * 1.0);
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, 'rgba(200,215,250,.16)'); rg.addColorStop(1, 'rgba(200,215,250,0)');
    ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(1, ry / rx); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rg; ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx); ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- escalators
function escBody(ctx, C, e, t, K, st, part, L, sCut = null) {
  const g = geo(e), zN = e.z + HW, zF = e.z - HW;
  const zz = part === 'far' ? zF : zN, T = planeT(C, zz), q = T[6]; if (C.z - zz < .8 || L <= 0) return;
  const px = 1 / q, s0 = g.s0, s1 = sCut ?? g.s1, n = 90, S = (i) => s0 + (s1 - s0) * i / n, X = g.X, Y = g.Y;
  ctx.save(); setT(ctx, T); ctx.globalAlpha = L;
  if (part === 'far') {
    ctx.beginPath(); for (let i = 0; i <= n; i++) { const s = S(i); i ? ctx.lineTo(X(s), Y(s) + SKIRT) : ctx.moveTo(X(s), Y(s) + SKIRT); } for (let i = n; i >= 0; i--) { const s = S(i); ctx.lineTo(X(s), Y(s) + RAILH - .06); } ctx.closePath();
    ctx.fillStyle = 'rgba(120,150,205,.10)'; ctx.fill();
    ctx.strokeStyle = '#0b0d18'; ctx.lineWidth = Math.max(.08, 1.4 * px); ctx.beginPath(); for (let i = 0; i <= n; i++) { const s = S(i); i ? ctx.lineTo(X(s), Y(s) + RAILH) : ctx.moveTo(X(s), Y(s) + RAILH); } ctx.stroke();
    ctx.restore(); return;
  }
  const bot = (s) => Math.max(e.yb - (e.yb > 0 ? 1.4 : 0), Y(s) - TRUSS - (s > g.top - .5 || s < g.bot + .5 ? .5 : 0));
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const s = S(i); i ? ctx.lineTo(X(s), Y(s) + SKIRT) : ctx.moveTo(X(s), Y(s) + SKIRT); } for (let i = n; i >= 0; i--) { const s = S(i); ctx.lineTo(X(s), bot(s)); } ctx.closePath();
  const cg = ctx.createLinearGradient(0, e.yb + e.R + 1, 0, e.yb - 1); cg.addColorStop(0, '#3a4766'); cg.addColorStop(1, '#212a44'); ctx.fillStyle = cg; ctx.fill();
  ctx.save(); ctx.clip();
  const hs = Math.max(.14, 3 * px);
  ctx.strokeStyle = rgba('#05070f', .32); ctx.lineWidth = Math.max(px * .8, .02); ctx.beginPath();
  for (let s = s0; s < s1; s += hs) { ctx.moveTo(X(s), Y(s) + SKIRT); ctx.lineTo(X(s) + e.d * .6, Y(s) - TRUSS - .4); }
  ctx.stroke();
  ctx.strokeStyle = rgba('#c2d0f0', .25); ctx.lineWidth = Math.max(px, .03); ctx.beginPath(); for (let s = s0 + 1; s < s1; s += 2.4) { ctx.moveTo(X(s), Y(s) + SKIRT); ctx.lineTo(X(s), Y(s) - TRUSS); } ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = rgba('#d5e0ff', .5); ctx.lineWidth = Math.max(px * 1.1, .03); ctx.beginPath(); for (let i = 0; i <= n; i++) { const s = S(i); i ? ctx.lineTo(X(s), Y(s) + SKIRT) : ctx.moveTo(X(s), Y(s) + SKIRT); } ctx.stroke();
  if (e.R > 30) for (const f of [.36, .68]) { const s = g.run * f; if (s > s1) continue; const x = X(s), y = Y(s) - TRUSS; ctx.fillStyle = '#151c32'; ctx.fillRect(x - .32, 0, .64, y); ctx.fillStyle = rgba('#b9c8ea', .28); ctx.fillRect(x - .32, 0, .08, y); }
  ctx.restore();
  if (st.ghosts) { const P = proj(C), Lx = [[], [], []]; for (let i = 0; i <= 24; i++) { const s = mix(s0, s1, i / 24); Lx[0].push(P(X(s), Y(s) + SKIRT, zN)); Lx[1].push(P(X(s), bot(s), zN)); Lx[2].push(P(X(s), Y(s) + RAILH, zN)); } st.ghosts.push([Lx, e.z]); }
}
function escRail(ctx, C, e, t, K, st, L, sCut = null) {
  const g = geo(e), zN = e.z + HW, T = planeT(C, zN), q = T[6]; if (C.z - zN < .8 || L <= 0) return;
  const px = 1 / q, n = 90, s0 = g.s0, s1 = sCut ?? g.s1, S = (i) => s0 + (s1 - s0) * i / n, X = g.X, Y = g.Y;
  ctx.save(); setT(ctx, T); ctx.globalAlpha = L;
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const s = S(i); i ? ctx.lineTo(X(s), Y(s) + SKIRT) : ctx.moveTo(X(s), Y(s) + SKIRT); } for (let i = n; i >= 0; i--) { const s = S(i); ctx.lineTo(X(s), Y(s) + RAILH - .06); } ctx.closePath();
  ctx.fillStyle = 'rgba(150,180,235,.12)'; ctx.fill();
  ctx.strokeStyle = rgba('#cfe0ff', .22); ctx.lineWidth = Math.max(px * .8, .02); ctx.beginPath(); for (let s = s0 + .8; s < s1; s += 1.6) { ctx.moveTo(X(s), Y(s) + SKIRT); ctx.lineTo(X(s), Y(s) + RAILH - .06); } ctx.stroke();
  const rail = []; for (let i = 0; i <= n; i++) { const s = S(i); rail.push([X(s), Y(s) + RAILH]); }
  const ends = (k) => { const s = k ? g.s1 : g.s0, x = X(s), y = Y(s) + RAILH, dir = (k ? 1 : -1) * e.d, o = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i / 10 * Math.PI; o.push([x + dir * Math.cos(a) * .42, y - .42 - Math.sin(a) * .42]); } return o; };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#090b14'; ctx.lineWidth = Math.max(.1, 1.6 * px); ctx.beginPath(); pline(ctx, rail); ctx.stroke();
  for (const k of sCut == null ? [0, 1] : [0]) { ctx.beginPath(); pline(ctx, ends(k)); ctx.stroke(); }
  ctx.strokeStyle = rgba('#aab8d8', .5); ctx.lineWidth = Math.max(.025, .8 * px); ctx.beginPath(); for (const [x, y] of rail) ctx.lineTo(x, y + .035); ctx.stroke();
  ctx.restore();
}
// the lit strip under the near handrail: the straight incline is drawn exactly like the plate line, the bends as polylines
function escStrip(ctx, C, e, t, K, st, a) {
  if (a <= 0) return;
  const g = geo(e), zN = e.z + HW; if (C.z - zN < .8) return;
  const P = proj(C), q = F / (C.z - zN), k = q / (F / D0), shift = runDist(t, K) / C30 * e.mv * q;
  const pa = P(g.X(A + .02), g.Y(A + .02) + STRIP, zN), pb = P(g.X(g.run - A - .02), g.Y(g.run - A - .02) + STRIP, zN);
  const pm = P((g.X(A + .02) + g.X(g.run - A - .02)) / 2, (g.Y(A + .02) + g.Y(g.run - A - .02)) / 2 + STRIP, zN);
  const ang = Math.atan2(pb[1] - pa[1], pb[0] - pa[0]), len = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
  ctx.save(); ctx.globalAlpha = a;
  linePlateLine(ctx, t, { cx: pm[0], cy: pm[1], ang, L: 1400, x0: -len / 2, x1: len / 2, k: Math.min(1, k), ks: k, shift, glow: st.stripGlow ?? 1, tick: clamp((k * 9 - 3) / 4) });
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [s0, s1] of [[g.s0 + .3, A + .02], [g.run - A - .02, g.s1 - .3]]) {
    const pts = []; for (let i = 0; i <= 16; i++) { const s = mix(s0, s1, i / 16); pts.push(P(g.X(s), g.Y(s) + STRIP, zN)); }
    for (const [w, al] of [[10 * Math.min(1, k), .14], [Math.max(1.4, 3.2 * Math.min(1, k)), .5], [Math.max(.9, 1.4 * Math.min(1, k)), .9]]) { ctx.strokeStyle = rgba(al > .6 ? '#fffaf0' : '#e9dcc0', al); ctx.lineWidth = w; ctx.beginPath(); pline(ctx, pts); ctx.stroke(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- riders: they stand on the steps; at the ends they walk on and off
const RIDERS = new Map();
function riders(e) {
  if (RIDERS.has(e)) return RIDERS.get(e);
  const g = geo(e), r = prng(e.seed * 97), out = [], len = g.top - g.bot;
  for (let i = 0; i < e.n; i++) {
    const s0 = g.bot + (i + .3 + r() * .5) / e.n * len;
    const o = { s0, seed: e.seed * 31 + i, col: ['#1b2036', '#232a45', '#171b2e', '#262d47', '#1d2238'][Math.floor(r() * 5)], arm: .42 + r() * .25, coat: r() < .5, hair: ['short', 'long', 'bun', 'short', 'grey', 'curly'][Math.floor(r() * 6)], bulk: .9 + r() * .2, stop: 2 + r() * 8 };
    if (e === E0 && Math.abs(s0 - HERO.s0) < 1.3) continue;
    out.push(o);
  }
  for (let i = 0; i < 6; i++) out.push({ s0: e.mv > 0 ? g.bot - 1.5 - i * 2.4 - r() : g.top + 1.5 + i * 2.4 + r(), walker: true, seed: e.seed * 31 + 50 + i, col: '#1e243c', arm: .5, coat: r() < .5, hair: 'short', bulk: 1, stop: 3 + r() * 8 });
  RIDERS.set(e, out); return out;
}
function riderAt(rd, e, t, K) {
  const g = geo(e), dist = runDist(t, K) * e.mv, t0 = K.hb;
  if (rd.walker) {
    const sB = e.mv > 0 ? g.bot - .3 : g.top + .3, toGo = Math.abs(sB - rd.s0), tB = t0 + toGo / 1.2;
    if (t < tB) { const s = rd.s0 + Math.sign(sB - rd.s0) * 1.2 * (t - t0); return { s, mode: 'walk', ph: Math.abs(s) / 1.45 * TAU }; }
    return { s: sB + (dist - runDist(tB, K) * e.mv), mode: 'ride' };
  }
  const s = rd.s0 + dist, off = e.mv > 0 ? g.top + .2 : g.bot - .2;
  if ((e.mv > 0 && s > off) || (e.mv < 0 && s < off)) {
    let lo = t0, hi = t; for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if ((rd.s0 + runDist(m, K) * e.mv - off) * e.mv > 0) hi = m; else lo = m; }
    const wd = Math.min(rd.stop, 1.2 * (t - hi)), sw = off + e.mv * wd;
    return { s: sw, mode: wd >= rd.stop - 1e-3 ? 'stand' : 'walk', ph: wd / 1.45 * TAU };
  }
  return { s, mode: 'ride' };
}
function drawRiders(ctx, C, e, t, K, st, L, sCut = null) {
  const g = geo(e), P = proj(C); if (C.z - e.z < 1 || L <= 0) return;
  const s = F / (C.z - e.z) * 1.75 / 185; if (s < .02) return;
  const faceRight = e.d * e.mv > 0, ride = { sh: [.5, .14], el: [.42, .3] };
  for (const rd of riders(e)) {
    const R = riderAt(rd, e, t, K);
    if (R.s < g.s0 - 14 || R.s > g.s1 + 14) continue;
    if (sCut != null && R.s > sCut) continue;
    const onFlat = R.s < g.bot || R.s > g.top, y = onFlat ? (R.s < g.bot ? e.yb : e.yb + e.R) : g.Y(R.s);
    const p = P(g.X(R.s), y + .87, e.z);
    if (p[0] < -60 || p[0] > W + 60 || p[1] < -100 || p[1] > H + 140) continue;
    const pose = R.mode === 'walk' ? { ...walk(R.ph), coat: rd.coat, hair: rd.hair, bulk: rd.bulk } : { ...ride, coat: rd.coat, hair: rd.hair, bulk: rd.bulk, sh: [rd.arm, .12] };
    const flip = R.mode === 'ride' ? !faceRight : (e.mv > 0 ? e.d < 0 : e.d > 0);
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(C.roll || 0);
    figureFlat(ctx, 0, 0, s, pose, { fast: true, col: shadeCol(rd.col, (1 - L) * .9 + st.dim), rim: s > .07 && L > .3 ? rgba(COL.rim, .55 * L) : null, rimSide: -1, flip, t, seed: rd.seed, shadow: false });
    ctx.restore();
  }
}

// ---------------------------------------------------------------- the hero on E0 (7.02): rides, steps off, stands bowed
function drawHero(ctx, C, t, K, st, L) {
  const h = heroPath(t, K), P = proj(C); if (C.z - E0.z < 1) return null;
  const s = F / (C.z - E0.z) * 1.75 / 185;
  let pose;
  if (!h.carried && h.step > 0 && h.step < 1) { const w = walk(h.step * TAU * .98 + .15), k = sstep(.75, 1, h.step); pose = k > 0 ? blendPose(w, { sh: [.3, .1], el: [.3, .22], hip: [.05, -.05], kn: [0, 0] }, k) : { ...w }; }
  else pose = { sh: [.46, .12], el: [.4, .3] };
  const bow = sstep(K.top + .5, K.stop + .4, t);
  pose = { ...pose, head: (pose.head || 0) + .3 * bow, lean: (pose.lean || 0) + .06 * bow, coat: 1, hair: 'short' };
  if (!h.carried && h.step >= 1) { pose.sh = [mix(.3, .12, bow), .06]; pose.el = [mix(.3, .2, bow), .18]; }
  const y = h.carried ? E0.yb + geo(E0).yN(h.s) : E0.R, p = P(h.x, y + .87, E0.z);
  ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(C.roll || 0);
  if (L < 1) ctx.globalAlpha = 1;
  figure(ctx, 0, 0, s, pose, { t, seed: HERO.seed, dress: L < 1 ? Object.fromEntries(Object.entries(HERO.dress).map(([k, v]) => [k, shadeCol(v, 1 - L)])) : HERO.dress, accent: shadeCol(HERO.scarf, 1 - L), accentPart: 'scarf', rim: L > .5 ? '#cfdcff' : null, rimSide: 1, light: st.heroLight || null, shadow: false, hatch: s > .6 });
  ctx.restore();
  return { x: p[0], y: p[1], s, pose };
}

// ---------------------------------------------------------------- landings (bridges to the galleries)
function bridge(ctx, C, x0, x1, y, z0, z1, st, part, L) {
  if (L <= 0) return;
  const P = proj(C); const f = [P(x0, y, z1), P(x1, y, z1), P(x1, y - 1.1, z1), P(x0, y - 1.1, z1)]; if (f.some((p) => p[2] < .5)) return;
  ctx.save(); ctx.globalAlpha = L;
  if (part === 'back') {
    if (C.y > y) { const tp = [P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)]; const gg = ctx.createLinearGradient(0, tp[0][1], 0, tp[3][1]); gg.addColorStop(0, '#26304f'); gg.addColorStop(1, '#34405f'); ctx.fillStyle = gg; poly(ctx, tp); ctx.fill(); }
    else if (C.y < y - 1.1) { const up = [P(x0, y - 1.1, z0), P(x1, y - 1.1, z0), P(x1, y - 1.1, z1), P(x0, y - 1.1, z1)]; ctx.fillStyle = '#0f1528'; poly(ctx, up); ctx.fill(); }
    ctx.restore(); return;
  }
  ctx.fillStyle = '#1b2440'; poly(ctx, f); ctx.fill();
  ctx.strokeStyle = 'rgba(200,214,250,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(f[0][0], f[0][1]); ctx.lineTo(f[1][0], f[1][1]); ctx.stroke();
  const r0 = P(x0, y + 1.05, z1), r1 = P(x1, y + 1.05, z1); ctx.strokeStyle = 'rgba(170,186,228,.45)'; ctx.lineWidth = Math.max(.7, F / Math.max(4, r0[2]) * .05); ctx.beginPath(); ctx.moveTo(r0[0], r0[1]); ctx.lineTo(r1[0], r1[1]);
  for (let x = x0; x <= x1 + .01; x += 2.2) { const a = P(x, y, z1), b = P(x, y + 1.05, z1); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke(); ctx.restore();
  if (st.ghosts) st.ghosts.push([[[f[0], f[1]], [r0, r1], [f[3], f[2]]], z1]);
}

// ---------------------------------------------------------------- the take
export function hallTake(ctx, t, K, o = {}) {
  if (t <= K.hb + 1e-4) { linePlateBG(ctx, t); linePlateLine(ctx, t); return null; }   // exactly the plate
  const C = hallCam(t, K), P = proj(C);
  const sky = sstep(K.follow, K.arrive, t) * (1 - sstep(K.dis0 || 1e9, (K.dis0 || 1e9) + 1.5, t));   // morning in the vault glass
  const st = { dim: 0, stripGlow: 1, clocks: [], lamps: [], ghosts: K.dis0 && t > K.dis0 - .2 ? [] : null, heroLight: null };
  linePlateBG(ctx, t);   // the plate's dark ground: everything rises out of it (and goes back into it)
  drawEndWall(ctx, C, t, K, st);
  const items = ESC.map((e) => ({ z: e.z, e })).sort((a, b) => a.z - b.z);
  let k = 0;
  for (let b = BAYS.length - 1; b >= 0; b--) {
    const [zb, za] = BAYS[b], z1 = Math.min(za, C.z - 1); if (z1 <= zb) { while (k < items.length && items[k].z < za) k++; continue; }
    const L = secLight((zb + za) / 2, t, K);
    haze(ctx, .05 * L);
    drawFloor(ctx, C, P, z1, zb, t, K, L); drawVault(ctx, P, z1, zb, L, sky);
    drawSide(ctx, C, P, -1, z1, zb, t, K, st, L); drawSide(ctx, C, P, 1, z1, zb, t, K, st, L);
    while (k < items.length && items[k].z < za) { drawEsc(ctx, C, items[k].e, t, K, st); k++; }
    if (HALL.ribs.includes(za) && za < C.z - 2) drawRib(ctx, C, za, t, K, st, secLight(za - .1, t, K));
  }
  while (k < items.length) { drawEsc(ctx, C, items[k].e, t, K, st); k++; }
  // the light pass: lamps, clock faces, the strips under the handrails
  const lt = lampTex();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, z, on, L] of st.lamps) {
    const p = P(x, y, z); if (p[2] < 2) continue; const a = sstep(on, on + .12, t) * (1 - goneAt(z, t, K)); if (a <= 0) continue;
    const r = Math.max(10, 7 * p[3]); ctx.globalAlpha = a; ctx.drawImage(lt, p[0] - r, p[1] - r, 2 * r, 2 * r);
    const r2 = Math.max(3, 1.1 * p[3]); ctx.drawImage(lt, p[0] - r2, p[1] - r2, 2 * r2, 2 * r2);
  }
  ctx.restore();
  for (const [x, y, z, r, on, giant] of st.clocks) clockGlow(ctx, C, x, y, z, r, on, giant);
  for (const e of ESC) escStrip(ctx, C, e, t, K, st, e === E0 ? 1 - goneAt(e.z, t, K) * (o.keepStrip ? 0 : 1) : secLight(e.z, t, K));
  if (st.ghosts) for (const [lines, z] of st.ghosts) ghost(ctx, lines, z, t, K);
  return { C, st, P };
}
function drawEsc(ctx, C, e, t, K, st) {
  const g = geo(e), L = secLight(e.z, t, K), xt = g.X(g.top), xb = g.X(g.bot), br = [];
  if (e.mv > 0 && e.id !== 'E0c') {
    br.push([Math.min(xt, e.d * 52), Math.max(xt, e.d * 52), e.yb + e.R, e.z - (e.id === 'E0' ? 7 : 4.2), e.z + 1.5]);
    if (e.yb > 0) br.push([Math.min(xb, -e.d * 52), Math.max(xb, -e.d * 52), e.yb, e.z - 4.2, e.z + 1.5]);
  }
  const LE = e === E0 ? Math.max(L, sstep(K.hb + .25, K.hb + .75, t) * (1 - goneAt(e.z, t, K))) : L;
  for (const b of br) bridge(ctx, C, ...b, st, 'back', LE);
  escBody(ctx, C, e, t, K, st, 'far', LE);
  drawRiders(ctx, C, e, t, K, st, LE);
  if (e === E0) st.hero = drawHero(ctx, C, t, K, st, LE);
  escBody(ctx, C, e, t, K, st, 'near', LE);
  escRail(ctx, C, e, t, K, st, LE);
  for (const b of br) bridge(ctx, C, ...b, st, 'front', LE);
}
