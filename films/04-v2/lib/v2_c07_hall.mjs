// c07 · the world of have-to (shots 7.01–7.03): one huge engraved station hall seen through one pinhole camera.
//   hallTake(ctx, t, K) → { C, P, st, hero }   the take from the c06>c07 line plate (H.b) until the hall has gone up in smoke (7.03)
//   hallInit(K)                                once per build (the crowd is placed around the hero), awaits nothing
//   hallCam(t, K)                              the camera (lib/v2_c07_void.mjs continues from it)
// 7.01 The plate line is the lit strip under the near handrail of E0: at H.b the camera is rolled (.2036 rad) and 17 m from it, so the
//      30° rail lies exactly on the plate's line; the camera pulls back and levels while the hall's bays switch on from the rail outward,
//      each rising out of the plate's dark ground as one solid picture (kit.solid). On "have-to" every clock clicks to 8:00 with a pulse.
// 7.02 The camera follows the hero up E0 to the top; one step off into the pale morning light that falls through the vault; the hall's
//      escalators stop on "ends" (steps, riders, second hands).
// 7.03 The bays go dark again from the far end toward the hero; their engraved lines stay a moment as dotted ghost lines and drift off as
//      smoke; E0 is eaten from its foot up to the fragment (its last steps, the comb, the landing) where the hero stands with the phone.
// The end wall carries the giant time-card rack of 1.01 (cardTex copied from lib/sc01_m1_open.mjs as cardCanvas) under the giant clock.
import { W, H, rgba, clamp, mix, prng, canvas, drift } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { figureFlat, walk } from './figure.mjs';
import { stipple, vnoise, fbm } from './art.mjs';
import { scribble } from './paper.mjs';
import { ghostLine } from './ghost.mjs';
import { once, memo, TAU, qio, cio, sstep, mixHex, proj, planeT, setT, pline, linePlateBG, linePlateLine, glowAt, PLATE_Y, solid, path2, bgAt } from './v2_c07_kit.mjs';
import { T30, F, HW, STRIP, HALL, COL, ESC, E0, BR0, geo, runDist, heroPath, worldInit, BAYS, onTime, secLight, disTime, goneAt, e0Gone, KEEP, morningAt, fogK, fogC, e0On, e0Hall, e0Frag, stripOn } from './v2_c07_world.mjs';
import { drawEsc, escStrip, drawRiders, drawBridge, drawHero, litCol } from './v2_c07_esc.mjs';
import { clockAt, clockGlow, warmClocks } from './v2_c07_clock.mjs';

export { E0, geo };

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
// ---- the end wall: dark ashlar, a lit rack of time cards under a cornice with its lamps, the lunette (a fan of pre-dawn glass) round
// the giant clock
export const RACK = { x0: -47, x1: 47, y0: 2.2, rows: 12, pitchY: 3.0, pitchX: 1.52, cw: 1.12, ch: 2.13 };
const WALLRES = 20;
function wallCanvas() {
  const res = WALLRES, w = 116, h = 74, [c, g] = canvas(Math.ceil(w * res), Math.ceil(h * res)), r = prng(31), n = vnoise(8);
  const TX = (x) => (x + 58) * res, TY = (y) => (h - y) * res;
  g.save(); g.beginPath(); g.moveTo(TX(-58), TY(0)); g.lineTo(TX(-58), TY(44)); for (let i = 0; i <= 64; i++) { const th = Math.PI - i / 64 * Math.PI; g.lineTo(TX(58 * Math.cos(th)), TY(44 + 30 * Math.sin(th))); } g.lineTo(TX(58), TY(0)); g.closePath(); g.clip();
  const bg = g.createLinearGradient(0, 0, 0, h * res); bg.addColorStop(0, '#141b33'); bg.addColorStop(.55, '#10162b'); bg.addColorStop(1, '#0b1022'); g.fillStyle = bg; g.fillRect(0, 0, w * res, h * res);
  // lunette: a fan of glass panes (the pre-dawn sky, brightest low in the middle), iron mullions radiating from the clock
  const cx = TX(0), cy = TY(57);
  g.save(); g.beginPath(); for (let i = 0; i <= 64; i++) { const th = i / 64 * Math.PI; const px = TX(54 * Math.cos(th)), py = TY(45.5 + 26.5 * Math.sin(th)); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); g.clip();
  const sg = g.createRadialGradient(cx, TY(46), 0, cx, TY(46), 60 * res); sg.addColorStop(0, '#8ea2cf'); sg.addColorStop(.35, '#5a6fa3'); sg.addColorStop(.75, '#33467a'); sg.addColorStop(1, '#25325c'); g.fillStyle = sg; g.fillRect(0, 0, w * res, h * res);
  g.strokeStyle = '#0b1122'; g.lineWidth = .32 * res; g.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI; g.moveTo(cx + Math.cos(a) * 14 * res, cy - Math.sin(a) * 14 * res); g.lineTo(cx + Math.cos(a) * 70 * res, cy - Math.sin(a) * 70 * res); } g.stroke();
  g.lineWidth = .22 * res; for (const rr of [20, 27, 35, 44]) { g.beginPath(); g.ellipse(cx, cy + 11.5 * res, rr * res * 1.15, rr * res, 0, Math.PI, TAU); g.stroke(); }
  g.strokeStyle = 'rgba(220,232,255,.18)'; g.lineWidth = .08 * res; g.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI + .004; g.moveTo(cx + Math.cos(a) * 14 * res, cy - Math.sin(a) * 14 * res); g.lineTo(cx + Math.cos(a) * 70 * res, cy - Math.sin(a) * 70 * res); } g.stroke();
  g.restore();
  // wall below the lunette: ashlar courses, engraved hatch, mottling
  g.fillStyle = '#0f1528'; g.fillRect(0, TY(45.5), w * res, 45.5 * res);
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1; g.beginPath(); for (let x = -h * res; x < w * res; x += 5 + r() * 3) { g.moveTo(x, TY(45.5)); g.lineTo(x + 45.5 * res * .45, TY(0)); } g.stroke();
  g.strokeStyle = 'rgba(150,170,220,.08)'; g.lineWidth = 1.2; g.beginPath(); for (let y = 1.5; y < 45; y += 1.5) { g.moveTo(0, TY(y)); g.lineTo(w * res, TY(y)); } g.stroke();
  for (let i = 0; i < 1400; i++) { const x = r() * w * res, y = TY(r() * 45), a = .03 + .05 * fbm(n, x * .01, y * .01, 3); g.fillStyle = `rgba(150,170,220,${a})`; g.fillRect(x, y, 3, 3); }
  // cornice and pilasters framing the rack
  g.fillStyle = '#222c49'; g.fillRect(0, TY(45.6), w * res, 1.6 * res); g.fillStyle = 'rgba(200,215,255,.35)'; g.fillRect(0, TY(45.6), w * res, .18 * res);
  g.fillStyle = '#222c49'; g.fillRect(TX(-50), TY(40.6), 100 * res, 1.4 * res); g.fillStyle = 'rgba(200,215,255,.3)'; g.fillRect(TX(-50), TY(40.6), 100 * res, .15 * res);
  for (const px of [-52.5, -49.4, 49.4, 52.5]) { g.fillStyle = '#1b2440'; g.fillRect(TX(px) - .9 * res, TY(44), 1.8 * res, 44 * res); g.fillStyle = 'rgba(200,215,255,.16)'; g.fillRect(TX(px) - .9 * res, TY(44), .15 * res, 44 * res); }
  // the rack: back panel lit from the cornice lamps (brighter at the top), cards in their pockets (a few empty), ledges with tags
  const RK = RACK, cols = Math.floor((RK.x1 - RK.x0) / RK.pitchX);
  const rg = g.createLinearGradient(0, TY(RK.y0 + RK.rows * RK.pitchY), 0, TY(RK.y0)); rg.addColorStop(0, '#1d2747'); rg.addColorStop(1, '#0d1226');
  g.fillStyle = rg; g.fillRect(TX(RK.x0 - 1.2), TY(RK.y0 + RK.rows * RK.pitchY + .6), (RK.x1 - RK.x0 + 2.4) * res, (RK.rows * RK.pitchY + 1) * res);
  const cards = [0, 1, 2, 3, 4, 5].map((v) => cardCanvas(.3, { seed: 11 + v * 5, past: 3 + (v % 5) * 2, num: 300 + v * 37 }));
  for (let j = 0; j < RK.rows; j++) {
    const yb = RK.y0 + j * RK.pitchY, shade = .38 * (1 - j / (RK.rows - 1));
    for (let i = 0; i <= cols; i++) {
      if (r() < .07) continue;
      const x = RK.x0 + i * RK.pitchX, lift = (r() - .5) * .25;
      g.drawImage(cards[Math.floor(r() * 6)], TX(x - RK.cw / 2), TY(yb + .55 + RK.ch + lift), RK.cw * res, RK.ch * res);
    }
    g.fillStyle = `rgba(8,10,24,${shade.toFixed(3)})`; g.fillRect(TX(RK.x0 - .6), TY(yb + RK.pitchY), (RK.x1 - RK.x0 + 1.2) * res, RK.pitchY * res);
    g.fillStyle = '#26304d'; g.fillRect(TX(RK.x0 - .6), TY(yb + 1.25), (RK.x1 - RK.x0 + 1.2) * res, 1.05 * res);
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
// ---- a lamp's light in the air (cold white)
const lampTex = () => once('c07lamp', () => { const S = 128, [c, g] = canvas(S, S), rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.1, 'rgba(236,243,255,.85)'); rg.addColorStop(.25, 'rgba(190,210,250,.28)'); rg.addColorStop(.55, 'rgba(150,175,235,.07)'); rg.addColorStop(1, 'rgba(150,175,235,0)'); g.fillStyle = rg; g.fillRect(0, 0, S, S); return c; });
export function hallWarm() { wallTex(0); wallTex(1); wallTex(2); lampTex(); warmClocks(); }

// ---------------------------------------------------------------- the camera of the take
// a camera given by the point it looks after (T), where that point sits on screen (px, py), its distance (d), roll and the principal
// point (ox, oy = the vanishing point of the hall): the target stays pinned while the camera dollies and levels
function aim(T, px, py, d, roll, ox = W / 2, oy = H / 2) {
  const cr = Math.cos(roll), sr = Math.sin(roll), dx = px - W / 2, dy = py - H / 2, u = dx * cr + dy * sr, v = -dx * sr + dy * cr;
  return { x: T[0] - (u - (ox - W / 2)) * d / F, y: T[1] + (v - (oy - H / 2)) * d / F, z: T[2] + d, f: F, roll, ox, oy };
}
export const RAIL0 = [0, E0.yb + T30 * 31.18 + STRIP, E0.z + HW];   // the strip point that sits on the plate line's centre at H.b
export const D0 = 17, ROLL0 = -.32 + Math.PI / 6;
export const WIDE = { p: [1010, 640], d: 40, ox: 760, oy: 640 };
export function hallCam(t, K) {
  const u1 = qio(clamp((t - K.hb - .04) / (K.wideAt - K.hb - .04)));
  const bob = 2 * Math.sin(t * .9) * (1 - sstep(0, .35, u1));
  let T = RAIL0, px = mix(W / 2, WIDE.p[0], u1), py = mix(PLATE_Y + bob, WIDE.p[1], u1), d = D0 * Math.pow(WIDE.d / D0, u1), roll = ROLL0 * (1 - u1);
  let ox = mix(W / 2, WIDE.ox, u1), oy = mix(H / 2, WIDE.oy, u1);
  const dr = sstep(K.wideAt - .8, K.wideAt + .6, t);
  px += drift(t, 10, 1) * dr; py += drift(t, 6, 4) * dr; d *= 1 - .03 * sstep(K.wideAt - .5, K.follow + .3, t);
  if (t > K.follow) {
    // 7.02: follow the hero up to the top landing
    const h = heroPath(t, K), Th = [h.x, h.y + 1.05, E0.z];
    const u2 = cio(clamp((t - K.follow) / (K.arrive - K.follow)));
    const C0 = aim(T, px, py, d, roll, ox, oy), q = proj(C0)(Th[0], Th[1], Th[2]);
    const pf = [1010 + 10 * Math.sin(t * .5), 600];
    T = Th; px = mix(q[0], pf[0], u2); py = mix(q[1], pf[1], u2); d = q[2] * Math.pow(9.4 / q[2], u2);
    ox = mix(ox, 900, u2); oy = mix(oy, 560, u2);
    const u3 = sstep(K.arrive, K.dis0 + 3.6, t); d *= 1 - .1 * u3; px -= 50 * u3;
  }
  return aim(T, px, py, d, roll, ox, oy);
}

// ---------------------------------------------------------------- the hall's parts (each lit to L; at L 0 a solid dark silhouette when
// something lit is behind it, nothing otherwise)
const ribPts = (n, rx, ry, y0) => { const out = []; for (let i = 0; i <= n; i++) { const th = i / n * Math.PI; out.push([rx * Math.cos(th), y0 + ry * Math.sin(th)]); } return out; };
const RIB = memo('c07rib', () => {
  const out = ribPts(64, 58, 30, 44), inn = ribPts(64, 55.6, 27.6, 44);
  const band = new Path2D(); band.moveTo(out[0][0], out[0][1]); for (const p of out) band.lineTo(p[0], p[1]); for (let i = inn.length - 1; i >= 0; i--) band.lineTo(inn[i][0], inn[i][1]); band.closePath();
  const piers = new Path2D(); piers.rect(55.4, 0, 2.6, 44); piers.rect(-58, 0, 2.6, 44);
  const wall = new Path2D(); wall.moveTo(-58, 0); wall.lineTo(-58, 44); for (let i = 0; i <= 64; i++) { const th = Math.PI - i / 64 * Math.PI; wall.lineTo(58 * Math.cos(th), 44 + 30 * Math.sin(th)); } wall.lineTo(58, 0); wall.closePath();
  return { out, inn, band, piers, wall };
});
export const LAMPX = [-41, 41];
function drawEndWall(ctx, C, P, t, K, st) {
  const z = HALL.end, L = secLight(z, t, K); if (L <= .002 || C.z - z < 2) return;
  const T = planeT(C, z), q = T[6], depth = C.z - z, lev = q > 16 ? 0 : q > 8 ? 1 : 2;
  ctx.save(); setT(ctx, T); ctx.globalAlpha = L; ctx.scale(1, -1); ctx.drawImage(wallTex(lev), -58, -74, 116, 74); ctx.restore();
  ctx.save(); setT(ctx, T); ctx.globalAlpha = L * fogK(depth) * .4; ctx.fillStyle = COL.haze; ctx.fill(RIB.wall); ctx.restore();
  // the giant clock in the lunette
  if (clockAt(ctx, C, 0, 57, z + .3, 12.5, t, K, { L, giant: true })) st.clocks.push([0, 57, z + .3, 12.5, L, true]);
  st.behind = true;
}
function drawRib(ctx, C, P, z, t, K, st, L) {
  const T = planeT(C, z), q = T[6]; if (C.z - z < 2) return;
  if (L <= .002 && !st.behind) return;
  const depth = C.z - z, fz = (c, k = 1) => fogC(c, depth, k), px = 1 / q;
  solid(ctx, RIB.band, T, fz(COL.iron), L, t, true); solid(ctx, RIB.piers, T, fz('#121a30'), L, t, true);
  if (L > .002) {
    ctx.save(); setT(ctx, T); ctx.globalAlpha = L;
    ctx.strokeStyle = rgba(fz('#7d8fb8'), .5); ctx.lineWidth = Math.max(px * .8, .09); ctx.beginPath();
    for (let i = 0; i < 64; i++) { const a = i % 2 ? RIB.out[i] : RIB.inn[i], b = i % 2 ? RIB.inn[i + 1] : RIB.out[i + 1]; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    ctx.stroke();
    ctx.strokeStyle = rgba(fz('#b9c8ea'), .45); ctx.lineWidth = Math.max(px * 1.2, .12); ctx.beginPath(); pline(ctx, RIB.inn); ctx.stroke();
    ctx.strokeStyle = rgba('#05070f', .9); ctx.lineWidth = Math.max(px * 1.2, .14); ctx.beginPath(); pline(ctx, RIB.out); ctx.stroke();
    for (const s of [-1, 1]) {
      const xi = s * 55.4, xa = Math.min(s * 58, xi);
      ctx.fillStyle = rgba(fz('#b9c8ea'), .3); ctx.fillRect(s > 0 ? xi : xi - .14, 0, .14, 44);
      ctx.fillStyle = fz('#1c2540'); ctx.fillRect(xa - .5, 42.6, 3.6, 1.6); ctx.fillRect(xa - .5, 0, 3.6, 1.2);
      ctx.strokeStyle = rgba('#000000', .35); ctx.lineWidth = Math.max(px, .05); ctx.beginPath(); for (let y = 1.4; y < 42.4; y += .6) { ctx.moveTo(xa, y); ctx.lineTo(xa + 2.6, y + .3); } ctx.stroke();
      // pendant lamp: rod, cast-iron shade
      const lx = LAMPX[s > 0 ? 1 : 0];
      ctx.strokeStyle = fz('#0a0d18'); ctx.lineWidth = Math.max(px, .08); ctx.beginPath(); ctx.moveTo(lx, 62.6); ctx.lineTo(lx, 52.1); ctx.stroke();
      ctx.fillStyle = fz('#0c1020'); ctx.beginPath(); ctx.moveTo(lx - .25, 52.3); ctx.quadraticCurveTo(lx - 1.05, 51.9, lx - 1.1, 51.25); ctx.lineTo(lx + 1.1, 51.25); ctx.quadraticCurveTo(lx + 1.05, 51.9, lx + .25, 52.3); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(fz('#c9d6f4'), .5); ctx.lineWidth = Math.max(px * .8, .04); ctx.beginPath(); ctx.moveTo(lx - 1.1, 51.25); ctx.lineTo(lx + 1.1, 51.25); ctx.stroke();
      ctx.lineWidth = Math.max(px, .1); ctx.strokeStyle = fz('#0a0d18'); ctx.beginPath(); ctx.moveTo(xi, 30); ctx.lineTo(s * 52.2, 30); ctx.stroke();
    }
    ctx.restore();
  }
  for (const s of [-1, 1]) if (clockAt(ctx, C, s * 51.6, 28.4, z + .05, 1.5, t, K, { L, dark: st.behind })) st.clocks.push([s * 51.6, 28.4, z + .05, 1.5, L, false]);
  for (const x of LAMPX) st.lamps.push([x, 50.9, z, L]);
  if (L > .002) st.behind = true;
}
function vaultPts(P, z, N) { const o = []; for (let i = 0; i <= N; i++) { const th = i / N * Math.PI; o.push(P(57.6 * Math.cos(th), 44 + 29.6 * Math.sin(th), z)); } return o; }
function drawVault(ctx, C, P, za, zb, t, K, st, L, sky) {
  if (L <= .002 && !st.behind) return;
  const N = 20, Aa = vaultPts(P, za, N), B = vaultPts(P, zb, N); if (Aa.some((p) => p[2] < .5) || B.some((p) => p[2] < .5)) return;
  const depth = (Aa[N >> 1][2] + B[N >> 1][2]) / 2;
  solid(ctx, path2(Aa.concat(B.slice().reverse())), null, '#000', 0, t, L < .998 && st.behind);
  if (L <= .002) return;
  ctx.save(); ctx.globalAlpha = L;
  for (let i = 0; i < N; i++) {
    const qd = [Aa[i], Aa[i + 1], B[i + 1], B[i]], k = Math.sin((i + .5) / N * Math.PI), east = clamp((N / 2 - i) / (N / 2));
    const night = mixHex('#121b3c', '#1f2c5a', .25 + .75 * k), morn = mixHex('#40568a', '#8ea5d2', .25 + .75 * k);
    ctx.fillStyle = fogC(mixHex('#080c1c', mixHex(night, morn, sky * (.55 + .45 * east)), .35 + .65 * clamp(depth / 110)), depth); ctx.beginPath(); pline(ctx, qd); ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle = rgba('#05070f', .85); ctx.lineWidth = 1.2; ctx.beginPath();
  for (let i = 1; i < N; i++) { ctx.moveTo(Aa[i][0], Aa[i][1]); ctx.lineTo(B[i][0], B[i][1]); }
  for (let z = za - 4; z > zb + .1; z -= 4) { const Cz = vaultPts(P, z, N); if (Cz[N >> 1][2] < .5) continue; ctx.moveTo(Cz[0][0], Cz[0][1]); for (const p of Cz) ctx.lineTo(p[0], p[1]); }
  ctx.stroke(); ctx.restore();
  st.behind = true;
}
const GP = memo('c07gp', () => { const r = prng(404), o = []; for (const s of [-1, 1]) for (const Lv of [0, 12, 24, 36]) for (let z = 66; z > -86; z -= 2.2 + r() * 4) if (r() < .55) o.push({ s, Lv, z, x: s * (Lv ? 53.2 + r() * 1.8 : 47 + r() * 6), seed: Math.floor(r() * 1000), col: ['#1b2036', '#232a45', '#171b2e', '#262d47'][Math.floor(r() * 4)], hair: ['short', 'long', 'bun', 'grey'][Math.floor(r() * 4)], coat: r() < .5, lean: r() < .4 }); return o; });
function drawSide(ctx, C, P, s, za, zb, t, K, st, L, morn) {
  if (L <= .002 && !st.behind) return;
  const X = s * 58, gx = s * HALL.gx, zm = (za + zb) / 2;
  const wq = [P(X, 0, za), P(X, 44, za), P(X, 44, zb), P(X, 0, zb)]; if (wq.some((p) => p[2] < .5)) return;
  const depth = (wq[0][2] + wq[2][2]) / 2, fz = (c, k = 1) => fogC(c, depth, k);
  solid(ctx, path2(wq), null, fz(COL.stone), L, t, true);
  const gl = [];
  const arch = (y0, y1) => { const hw = 5, pts = []; pts.push(P(X, y0, zm + hw)); for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI, zz = zm + hw * Math.cos(a), yy = y1 - hw * .8 + hw * .8 * Math.sin(a); pts.push(P(X, yy, zz)); } pts.push(P(X, y0, zm - hw)); return pts; };
  const levels = [[1.5, 10.2], [13.5, 22.2], [25.5, 34.2], [37.4, 43]];
  if (L > .002) {
    ctx.save(); ctx.globalAlpha = L;
    ctx.strokeStyle = rgba(fz('#96aadc'), .08); ctx.lineWidth = 1; ctx.beginPath(); for (let y = 2; y < 44; y += 2) { const a = P(X, y, za), b = P(X, y, zb); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } ctx.stroke();
    for (const [k, [y0, y1]] of levels.entries()) {
      const pts = arch(y0, y1), top = k === 3, east = s > 0;
      const win = top ? mixHex('#141d3e', east ? '#c9d4ea' : '#4a5f92', morn) : '#06080f';
      ctx.fillStyle = fz(win, top ? .6 : 1); ctx.beginPath(); pline(ctx, pts); ctx.closePath(); ctx.fill();
      if (top) { ctx.strokeStyle = rgba('#05070f', .8); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 1; i < 4; i++) { const zz = zm - 5 + i * 2.5, a = P(X, y0, zz), b = P(X, y1 - .4, zz); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } const a = P(X, (y0 + y1) / 2, zm - 5), b = P(X, (y0 + y1) / 2, zm + 5); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      ctx.strokeStyle = rgba(fz('#aabeea'), .3); ctx.lineWidth = 1; ctx.beginPath(); pline(ctx, pts.slice(1, -1)); ctx.stroke();
      gl.push(pts.slice(1, -1));
    }
    ctx.restore();
  }
  for (const Lv of HALL.levels) {
    const f = [P(gx, Lv, za), P(gx, Lv, zb), P(gx, Lv - .9, zb), P(gx, Lv - .9, za)];
    if (C.y < Lv - .9) solid(ctx, path2([P(gx, Lv - .9, za), P(gx, Lv - .9, zb), P(X, Lv - .9, zb), P(X, Lv - .9, za)]), null, fz('#0b1022'), L, t, true);
    else if (C.y > Lv) solid(ctx, path2([P(gx, Lv, za), P(gx, Lv, zb), P(X, Lv, zb), P(X, Lv, za)]), null, fz('#242e4c'), L, t, true);
    solid(ctx, path2(f), null, fz('#1c2541'), L, t, true);
    if (L > .002) {
      ctx.save(); ctx.globalAlpha = L;
      ctx.strokeStyle = rgba(fz('#bed0f5'), .42); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(f[0][0], f[0][1]); ctx.lineTo(f[1][0], f[1][1]); ctx.stroke();
      const r0 = P(gx, Lv + 1.1, za), r1 = P(gx, Lv + 1.1, zb); ctx.strokeStyle = litCol(fz('#0a0d1a'), 1, r0); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(r0[0], r0[1]); ctx.lineTo(r1[0], r1[1]);
      for (let z = za; z >= zb - .01; z -= 1.6) { const a = P(gx, Lv, z), b = P(gx, Lv + 1.1, z); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
      ctx.stroke(); ctx.strokeStyle = rgba(fz('#aabeea'), .4); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(r0[0], r0[1] - 1); ctx.lineTo(r1[0], r1[1] - 1); ctx.stroke();
      ctx.restore();
      gl.push([r0, r1], [f[0], f[1]]);
    }
  }
  galleryPeople(ctx, C, P, s, za, zb, t, K, st, L);
  if (L > .002) st.behind = true;
}
function galleryPeople(ctx, C, P, s, za, zb, t, K, st, L) {
  if (L <= .002 && !st.behind) return;
  for (const g of GP) {
    if (g.s !== s || g.z > za || g.z <= zb) continue;
    const p = P(g.x, g.Lv + .87, g.z); if (p[2] < 2) continue;
    const sc = p[3] * 1.75 / 185; if (sc < .03 || p[0] < -40 || p[0] > W + 40 || p[1] < -60 || p[1] > H + 120) continue;
    const pose = g.lean ? { lean: .1, sh: [.55, .4], el: [.5, .55], head: .12, coat: g.coat, hair: g.hair } : { coat: g.coat, hair: g.hair };
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(C.roll || 0);
    figureFlat(ctx, 0, 0, sc, pose, { fast: true, col: litCol(fogC(g.col, p[2]), L, p), rim: sc > .08 && L > .5 ? rgba(fogC(COL.rim, p[2], .5), .45 * L) : null, rimSide: -s, flip: s > 0, t, seed: g.seed, shadow: false });
    ctx.restore();
  }
}
const WALKERS = memo('c07walkers', () => { const r = prng(808), o = [];
  for (const zm of [0, -16, -32, -48, -64, -80]) for (let i = 0; i < 12; i++) { const dir = r() < .5 ? -1 : 1; o.push({ zm, z: zm + (r() - .5) * 7, dir, v: 1.15 + r() * .4, x0: r() * 116, seed: 900 + o.length, col: ['#1b2036', '#232a45', '#171b2e', '#262d47'][Math.floor(r() * 4)], coat: r() < .5, hair: ['short', 'long', 'bun', 'grey', 'curly'][Math.floor(r() * 5)], bulk: .9 + r() * .2 }); }
  // a queue standing at the foot of E1
  for (let i = 0; i < 14; i++) o.push({ stand: true, z: -29.2 + (r() - .5) * 1.4, x: 33.4 + i * .62 + r() * .3, seed: 960 + i, col: ['#1b2036', '#232a45', '#171b2e'][Math.floor(r() * 3)], coat: r() < .5, hair: ['short', 'long', 'bun'][Math.floor(r() * 3)], bulk: .9 + r() * .2 });
  return o; });
function drawWalkers(ctx, C, P, za, zb, t, K, st, L) {
  if (L <= .002) return;
  for (const w of WALKERS) {
    if (w.z > za || w.z <= zb) continue;
    let x, pose, flip;
    if (w.stand) { x = w.x; pose = { coat: w.coat, hair: w.hair, bulk: w.bulk, sh: [.2, .1], el: [.3, .25] }; flip = true; }
    else { const run = w.v * (t - K.hb) * (t < K.stop ? 1 : 1), u = ((w.x0 + w.dir * run) % 116 + 116) % 116; x = u - 58; pose = { ...walk(Math.abs(run) / 1.45 * TAU + w.seed), coat: w.coat, hair: w.hair, bulk: w.bulk }; flip = w.dir < 0; }
    const p = P(x, .87, w.z); if (p[2] < 2) continue;
    const s = p[3] * 1.75 / 185; if (s < .02 || p[0] < -40 || p[0] > W + 40 || p[1] < -40 || p[1] > H + 120) continue;
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(C.roll || 0);
    figureFlat(ctx, 0, 0, s, pose, { fast: true, col: litCol(fogC(w.col, p[2]), L, p), rim: s > .07 && L > .3 ? rgba(fogC(COL.rim, p[2], .5), .45 * L) : null, rimSide: 1, flip, t, seed: w.seed, shadow: false });
    ctx.restore();
  }
}
function drawFloor(ctx, C, P, za, zb, t, K, st, L) {
  if (L <= .002 && !st.behind) return;
  const qd = [P(-58, 0, za), P(58, 0, za), P(58, 0, zb), P(-58, 0, zb)]; if (qd.some((p) => p[2] < .5)) return;
  const depth = (qd[0][2] + qd[2][2]) / 2, fz = (c, k = 1) => fogC(c, depth, k);
  solid(ctx, path2(qd), null, fz(COL.floor), L, t, true);
  if (L <= .002) return;
  ctx.save(); ctx.globalAlpha = L;
  ctx.strokeStyle = rgba(fz('#96aadc'), .12); ctx.lineWidth = 1; ctx.beginPath();
  for (let x = -56; x <= 56; x += 4) { const a = P(x, 0, za), b = P(x, 0, zb); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  for (let z = Math.floor(za / 4) * 4; z > zb; z -= 4) { const a = P(-58, 0, z), b = P(58, 0, z); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();
  // pools of lamplight under the lamp rows
  ctx.globalCompositeOperation = 'lighter';
  for (const x of LAMPX) for (const zr of HALL.ribs) {
    if (zr > za + 8 || zr < zb - 8) continue;
    const c = P(x, 0, zr); if (c[2] < 2) continue;
    const rx = 11 * c[3], ry = Math.max(2, rx * Math.abs(C.y / Math.max(1, c[2])));
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, 'rgba(190,206,245,.13)'); rg.addColorStop(1, 'rgba(190,206,245,0)');
    ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(1, ry / rx); ctx.fillStyle = rg; ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx); ctx.restore();
  }
  ctx.restore();
  st.behind = true;
}
// the landing bridges (deck at 36 m; E2 and E3 also start from the 12 m galleries)
const BRIDGES = [
  { id: 'B0', x0: BR0.x0 + .6, x1: HALL.gx, y: 36, z0: -5.0, z1: E0.z + HW, railFrom: geo(E0).X(geo(E0).s1) + .25, girderFrom: geo(E0).X(geo(E0).s1), clock: 37.6, bay: 0 },
  { id: 'B1', x0: -HALL.gx, x1: geo(ESC[3]).X(geo(ESC[3]).top) - .55, y: 36, z0: -32.8, z1: ESC[3].z + HW, railTo: geo(ESC[3]).X(geo(ESC[3]).s1) - .25, girderTo: geo(ESC[3]).X(geo(ESC[3]).s1) },
  { id: 'B2', x0: -HALL.gx, x1: HALL.gx, y: 36, z0: -64.8, z1: ESC[5].z + HW },
  { id: 'B3', x0: -HALL.gx, x1: geo(ESC[5]).X(geo(ESC[5]).s0) + .2, y: 12, z0: -64.8, z1: ESC[5].z + HW },
  { id: 'B4', x0: geo(ESC[7]).X(geo(ESC[7]).s0) - .2, x1: HALL.gx, y: 12, z0: -62, z1: ESC[7].z + HW },
];

// ---------------------------------------------------------------- dissolve: the engraved lines of a bay going dark stay a moment as dotted
// ghost lines, then lift off as smoke (ghost.mjs)
function drawGhost(ctx, lines, d, t, seed) {
  const a = sstep(d - .05, d + .3, t), sm = sstep(d + .5, d + 2.1, t);
  if (a <= 0 || sm >= 1) return;
  for (let i = 0; i < lines.length; i++) {
    const Lp = lines[i]; if (!Lp || Lp.length < 2 || Lp.some((p) => p[2] < .5)) continue;
    if (!Lp.some((p) => p[0] > -60 && p[0] < W + 60 && p[1] > -60 && p[1] < H + 60)) continue;
    ghostLine(ctx, Lp, { ghost: sstep(d, d + .45, t), smoke: sm, col: '#efe4cc', w: 1.7, a: .85 * a, dot: 7, seed: seed + i * 13, t });
  }
}
const zLine = (P, x, y, za, zb, n = 6) => { const o = []; for (let i = 0; i <= n; i++) o.push(P(x, y, mix(za, zb, i / n))); return o; };
function escLines(P, e, s0, s1) {
  const g = geo(e), zN = e.z + HW, n = Math.max(6, Math.round((s1 - s0) / 3)), L = [[], [], []];
  for (let i = 0; i <= n; i++) { const s = mix(s0, s1, i / n), x = g.X(s), y = g.Y(s); L[0].push(P(x, y + .95, zN)); L[1].push(P(x, y + .14, zN)); L[2].push(P(x, Math.max(e.yb - (e.yb > 0 ? 1.4 : 0), y - 1.3), zN)); }
  return L;
}
function bayGhosts(ctx, C, P, za, zb, t, K, st) {
  const zm = (za + zb) / 2, d = disTime(zm, K); if (t < d - .05 || t > d + 2.2) return;
  const z1 = Math.min(za, C.z - 1), Lx = [];
  if (HALL.ribs.includes(za) && za < C.z - 2) { Lx.push(RIB.out.map(([x, y]) => P(x, y, za)), RIB.inn.map(([x, y]) => P(x, y, za))); for (const x of [-58, -55.4, 55.4, 58]) Lx.push([P(x, 0, za), P(x, 44, za)]); }
  for (let i = 2; i < 20; i += 3) { const th = i / 20 * Math.PI; Lx.push(zLine(P, 57.6 * Math.cos(th), 44 + 29.6 * Math.sin(th), z1, zb, 3)); }
  for (const s of [-1, 1]) {
    Lx.push(zLine(P, s * 58, 44, z1, zb, 3));
    for (const Lv of HALL.levels) { Lx.push(zLine(P, s * HALL.gx, Lv, z1, zb, 3), zLine(P, s * HALL.gx, Lv + 1.1, z1, zb, 3)); }
    for (const [y0, y1] of [[1.5, 10.2], [13.5, 22.2], [25.5, 34.2], [37.4, 43]]) { if (zm + 5 > z1) continue; const pts = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI; pts.push(P(s * 58, y1 - 4 + 4 * Math.sin(a), zm + 5 * Math.cos(a))); } Lx.push(pts); }
  }
  for (const x of [-30, 0, 30]) Lx.push(zLine(P, x, 0, z1, zb, 3));
  for (const e of ESC) if (e !== E0 && e.z < za && e.z >= zb) Lx.push(...escLines(P, e, geo(e).s0, geo(e).s1));
  for (const br of BRIDGES) if (br.z1 < za && br.z1 >= zb && br.id !== 'B0') Lx.push([P(br.x0, br.y, br.z1), P(br.x1, br.y, br.z1)], [P(br.x0, br.y - 1.25, br.z1), P(br.x1, br.y - 1.25, br.z1)], [P(br.x0, br.y + 1.04, br.z1), P(br.x1, br.y + 1.04, br.z1)]);
  drawGhost(ctx, Lx, d, t, Math.round(Math.abs(za) * 7) + 3);
}
function endGhosts(ctx, C, P, t, K) {
  const z = HALL.end, d = disTime(z, K); if (t < d - .05 || t > d + 2.2) return;
  const R = RACK, Lx = [];
  for (let j = 0; j <= R.rows; j += 2) Lx.push([P(R.x0, R.y0 + j * R.pitchY + 1.25, z), P(0, R.y0 + j * R.pitchY + 1.25, z), P(R.x1, R.y0 + j * R.pitchY + 1.25, z)]);
  const cl = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU; cl.push(P(13.6 * Math.cos(a), 57 + 13.6 * Math.sin(a), z)); } Lx.push(cl);
  const ar = []; for (let i = 0; i <= 40; i++) { const th = i / 40 * Math.PI; ar.push(P(54 * Math.cos(th), 45.5 + 26.5 * Math.sin(th), z)); } Lx.push(ar);
  for (let k = 0; k <= 24; k += 3) { const a = k / 24 * Math.PI; Lx.push([P(Math.cos(a) * 14, 57 + Math.sin(a) * 14, z), P(Math.cos(a) * 54, 57 + Math.sin(a) * 15, z)]); }
  drawGhost(ctx, Lx, d, t, 991);
}
// the far piece of E0's landing bridge and its post clock
function b0Ghosts(ctx, P, t, K) {
  const br = B0B, d = disTime(E0.z, K), y = br.y, z = br.z1, Lx = [[P(br.x0, y, z), P(br.x1, y, z)], [P(br.x0, y - 1.25, z), P(br.x1, y - 1.25, z)], [P(br.railFrom, y + 1.04, z), P(br.x1, y + 1.04, z)]];
  for (let x = br.x0; x < br.x1 - .5; x += 2.5) Lx.push([P(x, y, z), P(x + 1.25, y - 1.25, z), P(x + 2.5, y, z)]);
  const cx = br.clock, zc = z - .35, cl = []; for (let i = 0; i <= 28; i++) { const a = i / 28 * TAU; cl.push(P(cx + .5 * Math.cos(a), y + 3.58 + .5 * Math.sin(a), zc)); } Lx.push(cl, [P(cx, y, zc), P(cx, y + 3.08, zc)]);
  drawGhost(ctx, Lx, d, t, 77);
}
// E0 eaten from its foot: each 3 m piece turns into ghost lines as it goes
function e0Ghosts(ctx, P, t, K) {
  if (!K.dis0 || t < K.dis0 + .8) return;
  const g = geo(E0), sK = KEEP.s();
  for (let s = g.s0; s < sK - .01; s += 3) {
    const s1 = Math.min(sK, s + 3), d = K.dis0 + .9 + 1.5 * clamp((s + 1.5 - g.s0) / (sK - g.s0));
    drawGhost(ctx, escLines(P, E0, s, s1), d, t, 500 + Math.round(s * 3));
  }
}

// ---------------------------------------------------------------- the take
export function hallInit(K) { worldInit(K); }
export function hallTake(ctx, t, K, o = {}) {
  if (t <= K.hb + 1e-4) { linePlateBG(ctx, t); linePlateLine(ctx, t); return null; }   // exactly the plate
  const C = hallCam(t, K), P = proj(C), mo = morningAt(t, K);
  const sky = sstep(K.top - 1.5, K.top + 1.5, t) * (1 - sstep(K.dis0 + .8, K.dis0 + 2.2, t));
  const st = { behind: false, clocks: [], lamps: [], hero: null };
  const ghosts = !!(K.dis0 && t > K.dis0 - .2);
  linePlateBG(ctx, t);   // the plate's dark ground: everything rises out of it (and goes back into it)
  drawEndWall(ctx, C, P, t, K, st);
  if (ghosts) endGhosts(ctx, C, P, t, K);
  const items = ESC.map((e) => ({ z: e.z, e })).sort((a, b) => a.z - b.z);
  let k = 0;
  for (let b = BAYS.length - 1; b >= 0; b--) {
    const [zb, za] = BAYS[b], z1 = Math.min(za, C.z - 1);
    if (z1 <= zb) { while (k < items.length && items[k].z < za) k++; continue; }
    const L = secLight((zb + za) / 2, t, K);
    drawFloor(ctx, C, P, z1, zb, t, K, st, L); drawWalkers(ctx, C, P, z1, zb, t, K, st, L); drawVault(ctx, C, P, z1, zb, t, K, st, L, sky);
    drawSide(ctx, C, P, -1, z1, zb, t, K, st, L, mo); drawSide(ctx, C, P, 1, z1, zb, t, K, st, L, mo);
    const brs = bridgesIn(zb, za, t, K, L);
    const dk = (z) => st.behind && goneAt(z, t, K) <= 0;
    for (const [br, Lb] of brs) drawBridge(ctx, P, C, br, t, K, 'back', { L: Lb, dark: dk(br.z1) && br.id !== 'B0a', st, morning: br.id.startsWith('B0') ? mo : 0 });
    while (k < items.length && items[k].z < za) { drawOneEsc(ctx, C, P, items[k].e, t, K, st, mo); k++; }
    for (const [br, Lb] of brs) drawBridge(ctx, P, C, br, t, K, 'front', { L: Lb, dark: dk(br.z1) && br.id !== 'B0a', st, morning: br.id.startsWith('B0') ? mo : 0 });
    if (HALL.ribs.includes(za) && za < C.z - 2) drawRib(ctx, C, P, za, t, K, st, secLight(za - .1, t, K));
    if (ghosts) { bayGhosts(ctx, C, P, za, zb, t, K, st); if (E0.z < za && E0.z >= zb) { e0Ghosts(ctx, P, t, K); b0Ghosts(ctx, P, t, K); } }
  }
  while (k < items.length) { drawOneEsc(ctx, C, P, items[k].e, t, K, st, mo); k++; }
  lightPass(ctx, C, P, t, K, st, mo);
  return { C, P, st, hero: st.hero };
}
// E0's landing bridge in two pieces: the landing by the newel stays with the fragment, the rest goes with the hall
export const B0A = { ...BRIDGES[0], id: 'B0a', x1: KEEP.x1(), railFrom: null, clock: null, noRail: true };
const B0B = { ...BRIDGES[0], id: 'B0b', x0: KEEP.x1() };
function bridgesIn(zb, za, t, K, L) {
  const out = [];
  for (const br of BRIDGES) {
    if (!(br.z1 >= zb && br.z1 < za)) continue;
    if (br.id === 'B0') { out.push([B0A, e0Frag(t, K)], [B0B, e0Hall(t, K)]); } else out.push([br, L]);
  }
  return out;
}
// where E0 still begins (the dissolve eats it from the foot up to the fragment)
export function e0SA(t, K) { const g = geo(E0); let sA = g.s0; if (K.dis0 && t > K.dis0 + .8) { for (let s = g.s0; s < KEEP.s(); s += .25) if (e0Gone(s, t, K) >= 1) sA = s + .25; } return sA; }
function drawOneEsc(ctx, C, P, e, t, K, st, mo) {
  if (e === E0) {
    const sA = e0SA(t, K);
    const Lf = e0Frag(t, K), Lr = e0Hall(t, K);
    const dk = st.behind && goneAt(E0.z, t, K) <= 0, o = { L: Lf, dark: dk, morning: mo, st, sA };
    o.mid = () => { drawRiders(ctx, P, C, e, t, K, { L: Lr, dark: dk, morning: mo, sA }); st.hero = drawHero(ctx, P, C, t, K, { L: e0On(t, K), lit: heroLit(t, K), morning: mo, cyan: heroCyan(t, K) }); };
    drawEsc(ctx, P, C, e, t, K, o);
    if (Lf > .002) st.behind = true;
    return;
  }
  const L = secLight(e.z, t, K), o = { L, dark: st.behind && goneAt(e.z, t, K) <= 0, morning: e.z > -6 ? mo : 0, st };
  o.mid = () => drawRiders(ctx, P, C, e, t, K, o);
  drawEsc(ctx, P, C, e, t, K, o);
  if (L > .002) st.behind = true;
}
// how much the hall's light still falls on the hero (the phone takes over in 7.03), and the phone's cyan
export const heroLit = (t, K) => 1 - .82 * sstep(K.dis0 + 1.4, K.dis0 + 2.8, t);
export const heroCyan = (t, K) => (K.phone0 ? sstep(K.phone0 + .45, K.phone0 + .85, t) : 0);
function lightPass(ctx, C, P, t, K, st, mo) {
  const lt = lampTex();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // the lunette: the pre-dawn window glows into the haze round the giant clock
  const Lw = secLight(HALL.end, t, K);
  if (Lw > .002) { const c = P(0, 50, HALL.end + 1); if (c[2] > 2) { ctx.globalAlpha = Lw * .55; const r = 70 * c[3]; ctx.drawImage(lt, c[0] - r, c[1] - r * .75, 2 * r, 1.5 * r); } }
  for (const [x, y, z, L] of st.lamps) {
    const p = P(x, y, z); if (p[2] < 2 || L <= .002) continue;
    const r0 = Math.max(30, 13 * p[3]); ctx.globalAlpha = L * .22; ctx.drawImage(lt, p[0] - r0, p[1] - r0, 2 * r0, 2 * r0);
    const r = Math.max(9, 3.6 * p[3]); ctx.globalAlpha = L * .85; ctx.drawImage(lt, p[0] - r, p[1] - r, 2 * r, 2 * r);
    const r2 = Math.max(2.5, .75 * p[3]); ctx.globalAlpha = L; ctx.drawImage(lt, p[0] - r2, p[1] - r2, 2 * r2, 2 * r2);
  }
  ctx.restore();
  for (const [x, y, z, r, L, giant] of st.clocks) clockGlow(ctx, C, x, y, z, r, t, K, { on: L, giant });
  // the strips under the handrails; E0's is the plate's line and is there from the first frame
  for (const e of ESC) {
    if (e === E0) { const g = geo(E0); let sA = g.s0; if (K.dis0) for (let s = g.s0; s < KEEP.s(); s += .25) if (e0Gone(s, t, K) >= .5) sA = s + .25; escStrip(ctx, P, C, e, t, K, stripOn(t, K), { sA }); }
    else escStrip(ctx, P, C, e, t, K, secLight(e.z, t, K));
  }
  if (mo > .01) morningShaft(ctx, C, P, t, K, mo);
}
// pale morning light through the vault glass, slanting down onto E0's landing; dust drifts in it
function morningShaft(ctx, C, P, t, K, mo) {
  const z0 = E0.z - 2.5, z1 = E0.z + .6;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const shafts = [[49, 58, 33.2, 1.3, .1], [52, 61, 36.5, 1.1, .08], [46, 55.5, 30.5, .8, .06], [55, 63, 40.5, 1.2, .07]];
  for (const [xw, yw, xl, w, a] of shafts) {
    const p0 = P(xw - w, yw, z0), p1 = P(xw + w, yw, z0), p2 = P(xl + w * 1.6, 36, z1), p3 = P(xl - w * 1.6, 36, z1);
    if ([p0, p1, p2, p3].some((p) => p[2] < .5)) continue;
    const gr = ctx.createLinearGradient((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2);
    gr.addColorStop(0, rgba(COL.morning, 0)); gr.addColorStop(.25, rgba(COL.morning, a * mo)); gr.addColorStop(1, rgba(COL.morning, a * .55 * mo));
    ctx.fillStyle = gr; ctx.beginPath(); pline(ctx, [p0, p1, p2, p3]); ctx.closePath(); ctx.fill();
  }
  // the pool of light on the landing round the hero, and dust in the beams
  const c = P(34.6, 36, E0.z + .2); if (c[2] > .5) { const rx = 4.2 * c[3], ry = Math.max(3, rx * Math.abs((C.y - 36) / Math.max(1, c[2])) * 1.4); const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, rgba(COL.morning, .22 * mo)); rg.addColorStop(1, rgba(COL.morning, 0)); ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(1, ry / rx); ctx.fillStyle = rg; ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx); ctx.restore(); }
  const r = prng(77);
  for (let i = 0; i < 70; i++) {
    const u = r(), v = r(), sp = .08 + r() * .12, ph = r() * 100;
    const x = mix(33, 54, u) + Math.sin(t * sp + ph) * .6, y = mix(36.3, 58, v) - ((t * sp * .7 + ph) % 3), z = mix(z0, z1, r());
    const xs = mix(30, 56, (y - 36) / 24) ; if (Math.abs(x - xs - 3) > 6) continue;
    const p = P(x, y, z); if (p[2] < .5) continue;
    const tw = .5 + .5 * Math.sin(t * (1.3 + r()) + ph); ctx.fillStyle = rgba(COL.morning, .5 * mo * tw); const s = Math.max(1, .025 * p[3]); ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s);
  }
  ctx.restore();
}
