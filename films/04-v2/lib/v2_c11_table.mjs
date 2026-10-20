// c11 (Film 4 v2) · the long table: a terrace street at night (houses with warm windows on one side, a parapet over the dark valley on
// the other), lantern strings across, one long table with people on both benches, you at the head of the table. One pinhole camera
// (metres, y up) carries the whole take from the night sky (the c10>c11 sky plate) down onto the table, to eye level, over your shoulder
// down to your business card. Everything is a pure function of t.
//   tableWorld(ctx, t, C, S)   draws the world for camera C (kit camera()) and state S (see tableState)
//   tableState(t, A)            what everyone does at t (anchors A from the scene: VO words)
//   TB, CARD                    the geometry other parts need (the card stands on the table in front of your plate)
import {
  W, H, rgba, clamp, mix, lin, sm, prng, text, TAU, keys, qio, eoX, eiX, cio, qo, u01, putGlow, mixHex, shadeHex, hash, once, canvas,
} from './v2_c11_kit.mjs';
import { person, kid, POSES } from './v2_c11_people.mjs';
import { youSeat } from './v2_c11_you.mjs';

// ---------------------------------------------------------------- geometry (metres; X along the street, the table's head at +X)
export const TB = { x0: .55, x1: -15.6, hw: .45, top: .76, benchZ: .8, benchY: .45, seat: .47 };
export const ST = { houseZ: -3.3, parapetZ: 2.7, parapetH: .95, xEnd: -64 };
export const YOU = { x: .93, z: 0, seatY: .46 };
// the business card stands in a little brass holder in front of your plate, facing you (+X), leaning back a little
export const CARD = { x: .06, y: .8, z: -.02, w: .085, h: .055, tilt: .1 };
const NIGHT = '#141532', INK = '#0b0b1e';

// houses on the right side (Z = houseZ, facades facing +Z), deterministic
const HOUSES = (() => {
  const r = prng(1101), out = []; let x = 4.2;
  const cols = ['#2c2a4f', '#33294a', '#272c4c', '#2f2c45', '#2a2543', '#352d4d'];
  while (x > ST.xEnd + 2) {
    const w = 4.4 + r() * 3.4, fl = r() < .5 ? 2 : 1, h = 3.4 + fl * 2.9 + .3;   // two or three storeys (the opening frame, all sky, sees none)
    const nwin = Math.max(2, Math.round(w / 1.85)), lit = [], bal = [];
    for (let f = 0; f <= fl; f++) for (let i = 0; i < nwin; i++) { lit.push(r() < (f ? .58 : .5)); bal.push(f === 1 && r() < .35); }
    out.push({ x0: x, x1: x - w, fl, h, nwin, lit, bal, col: cols[Math.floor(r() * cols.length)], seed: Math.floor(r() * 1e5), door: Math.floor(r() * nwin), cafe: r() < .3 });
    x -= w + .04;
  }
  return out;
})();
// lantern strings: zigzag between house anchors and poles on the parapet. One string crosses right over the head of the table, and
// its middle lantern (bigger) hangs just in front of you: the hero light of 11.01–11.02.
const POLES = Array.from({ length: 12 }, (_, j) => 5.9 - 6 * j);
const STRINGS = (() => {
  const out = [];
  for (let j = 0; j < POLES.length; j++) {
    const px = POLES[j];
    out.push({ a: [px + 1.6, 4.55, ST.houseZ + .05], b: [px, 3.95, ST.parapetZ - .05], sag: .55, n: 6, seed: j * 2 });
    out.push({ a: [px, 3.95, ST.parapetZ - .05], b: [px - 1.5, 4.5, ST.houseZ + .05], sag: .6, n: 6, seed: j * 2 + 1 });
  }
  return out;
})();
const catenary = (S, u) => [mix(S.a[0], S.b[0], u), mix(S.a[1], S.b[1], u) - S.sag * 4 * u * (1 - u), mix(S.a[2], S.b[2], u)];
const LANTERNS = (() => {
  const out = [];
  for (const S of STRINGS) for (let i = 0; i < S.n; i++) {
    const u = (i + .5 + (hash(S.seed * 13 + i) - .5) * .3) / S.n, p = catenary(S, u);
    out.push({ p, r: .15 + hash(S.seed * 7 + i) * .07, drop: .18 + hash(S.seed + i * 3) * .16, col: hash(S.seed * 3 + i * 5) < .78 ? 0 : 1, ph: hash(i + S.seed * 9) * TAU, head: false });
  }
  // the head lantern: the one nearest the air just in front of you, over the table
  let hb = null, bd = 1e9; for (const L of out) { const d = Math.hypot(L.p[0] - (YOU.x - .3), L.p[2]); if (d < bd) { bd = d; hb = L; } }
  if (hb) { hb.head = true; hb.r = .24; hb.drop = .3; hb.col = 0; }
  return out;
})();
// the chunk clears the lanterns its camera flies through (samples of the camera path, metres)
export function clearLanterns(path, r = .9) {
  for (const L of LANTERNS) { const c = [L.p[0], L.p[1] - L.drop, L.p[2]]; if (path.some((q) => Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2]) < r)) L.off = true; }
}
// people on the benches: side +1 = the valley-side bench (Z = +benchZ, facing -Z), -1 = the house-side bench (facing +Z)
const COATS = ['#2c3450', '#3a2f4a', '#46324a', '#2b3a3f', '#4a3a2c', '#33374f', '#5a3a36', '#2f2a3e', '#3d4a5a', '#5b4a3a'];
const SHIRTS = ['#c9b9a0', '#9fb6cf', '#d8a48a', '#b7c25a', '#e8d7b0', '#a07a9a'];
const HAIRC = ['#1c1420', '#2a1a14', '#4a3222', '#14100e', '#6a4a32', '#b8b0a8', '#2a2024'];
const HAIRS = ['short', 'long', 'bun', 'curly', 'short', 'long', 'grey', 'bald', 'short', 'curly'];
const ACTS = ['talk', 'listen', 'drink', 'laugh', 'eat', 'listen', 'talk', 'lean'];
const PEOPLE = (() => {
  const r = prng(4711), out = [];
  for (const side of [1, -1]) {
    for (let i = 0; i < 25; i++) {
      const x = -.45 - (side < 0 ? .1 : 0) - i * .63 + (r() - .5) * .08;
      if (x < TB.x1 + .3) break;
      if (i > 2 && r() < .12) continue;   // an empty place now and then
      const hair = HAIRS[Math.floor(r() * HAIRS.length)], fem = hair === 'long' || hair === 'bun' || r() < .3;
      const kidP = i > 3 && r() < .1;
      out.push({ x, side, i, seed: 10 + out.length * 7, kid: kidP, hair: kidP ? 'short' : hair, fem, act: ACTS[Math.floor(r() * ACTS.length)], ph: r() * TAU, per: 2.6 + r() * 2.4,
        dress: { coat: COATS[Math.floor(r() * COATS.length)], pants: '#16152a', skin: ['#e9c3a0', '#d9b08e', '#b98762', '#8d5f40', '#6a4430', '#f0d2b4'][Math.floor(r() * 6)], hair: hair === 'grey' ? '#b8b0a8' : HAIRC[Math.floor(r() * 6)], shirt: SHIRTS[Math.floor(r() * SHIRTS.length)], scarf: '#c8843a' } });
    }
  }
  return out;
})();
export const ASKER = PEOPLE.find((p) => p.side < 0 && p.i === 0);
if (ASKER) { ASKER.act = 'ask'; ASKER.hair = 'curly'; ASKER.fem = true; ASKER.dress = { ...ASKER.dress, coat: '#5a3a36', skin: '#b98762', hair: '#2a1a14' }; }
// table items per place + shared ones on the middle line
const ITEMS = (() => {
  const r = prng(77), out = [];
  for (const p of PEOPLE) {
    const z = -p.side * .02 + p.side * .24;
    out.push({ k: 'plate', x: p.x, z, r: .125 }, { k: 'glass', x: p.x + .17, z: p.side * .3, red: r() < .65, fill: .35 + r() * .4 });
    if (r() < .5) out.push({ k: 'fork', x: p.x - .17, z });
  }
  for (let x = .1; x > TB.x1 + .4; x -= 1.15) {
    out.push({ k: 'candle', x: x - .3, z: (r() - .5) * .08, h: .09 + r() * .05, ph: r() * TAU });
    const q = r();
    out.push(q < .3 ? { k: 'bread', x: x - .75, z: (r() - .5) * .1 } : q < .55 ? { k: 'bottle', x: x - .7, z: (r() - .5) * .14, green: r() < .6 } : q < .8 ? { k: 'bowl', x: x - .78, z: (r() - .5) * .1, col: ['#c4512e', '#b7c25a', '#e9c46a'][Math.floor(r() * 3)] } : { k: 'flowers', x: x - .72, z: 0 });
  }
  // your place at the head: plate, glass, the card in its holder
  out.push({ k: 'plate', x: .33, z: 0, r: .13, you: true }, { k: 'glass', x: .29, z: .21, red: true, fill: .45, you: true });
  return out;
})();

// ---------------------------------------------------------------- what everyone does
// S = { t, youTurn, askLift (0..1 the asker's glass up), askLook, hideYou }
export function tableState(t, A) {
  // you: at "enough" you turn your head to the dark (left); when the glass comes up you turn back toward the asker (right)
  const away = eoX(u01(t, A.enough - .05, A.enough + .55)) * (1 - qio(u01(t, A.asks - .05, A.asks + .55)));
  const back = qio(u01(t, A.asks - .05, A.asks + .55));
  const youTurn = -1 * away + .5 * back + .04 * Math.sin(t * .7);
  const askLift = eoX(u01(t, A.asks - .25, A.asks + .45)) * (1 - qio(u01(t, A.and + 1.6, A.and + 2.6)));
  return { t, youTurn, askLift };
}

// ---------------------------------------------------------------- sky + valley (screen space, follows the camera's pitch)
const SKYSTARS = (() => { const r = prng(808), s = []; for (let i = 0; i < 700; i++) s.push([(r() - .5) * 2.2, Math.pow(r(), 1.6) * .42, .4 + r() * 1.1, r() * TAU, .5 + r() * 1.5]); return s; })();
const VALLEY = (() => { const r = prng(909), s = []; for (let i = 0; i < 520; i++) { const cl = r() < .7; const X = cl ? -380 + (r() - .5) * 260 + (r() - .5) * 120 : (r() - .5) * 2200, Z = cl ? 420 + r() * 300 : 80 + Math.pow(r(), .6) * 2400; s.push([X, -110 - r() * 30, Z, r(), r() * TAU]); } return s; })();
const RIDGE = (() => { const pts = []; for (let i = 0; i <= 90; i++) { const a = -1.3 + i * (2.9 / 90); pts.push([a, 60 + 70 * Math.sin(a * 3.1 + 1) * Math.sin(a * 1.3 + .4) + 30 * Math.sin(a * 9 + 2)]); } return pts; })();
function skyAndValley(ctx, t, C) {
  const o = C.o, F = C.F, p = o.pitch, yh = H / 2 + F * Math.tan(p);           // the horizon line on screen (camera without roll)
  const el = (y) => p + Math.atan((H / 2 - y) / F);                            // elevation of a screen row
  const rowOf = (e) => H / 2 - F * Math.tan(e - p);
  // sky gradient by elevation (matches the plate: s2 at 14.4°, s1 at ~30°, s0 at 56°), a faint glow of the town at the horizon
  const g = ctx.createLinearGradient(0, rowOf(1.0), 0, Math.max(rowOf(1.0) + 1, yh));
  const stops = [[1.0, '#060818'], [.53, '#0d1236'], [.252, '#1d1a4a'], [.08, '#2a2353'], [0, '#3a2c58']];
  const y0 = rowOf(1.0), y1 = yh; for (const [e, c] of stops) g.addColorStop(clamp((rowOf(e) - y0) / Math.max(1, y1 - y0)), c);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, Math.min(H, yh + 1));
  // stars in directions (azimuth a around the view, elevation e) — fewer and dimmer toward the horizon haze
  for (const [a, e, s, ph, f] of SKYSTARS) {
    if (e < .015) continue; const y = rowOf(e); if (y < -4 || y > Math.min(H, yh - 6)) continue;
    const x = W / 2 + F * Math.tan(a) / Math.cos(e - p) * .8; if (x < -4 || x > W + 4) continue;
    const tw = .55 + .45 * Math.sin(t * f + ph), haze = clamp(e / .2);
    ctx.fillStyle = `rgba(243,239,226,${(.3 + .6 * tw) * haze})`; ctx.fillRect(x, y, s, s);
  }
  if (yh >= H) return yh;
  // below the horizon: the valley in the dark. A haze band at the horizon, two ridges, the valley floor with a river and the
  // lights of villages, then the slope of our own hill falling away under the parapet with the roofs of the terrace below.
  const gv = ctx.createLinearGradient(0, yh, 0, H + 400); gv.addColorStop(0, '#221d40'); gv.addColorStop(.05, '#141230'); gv.addColorStop(.3, '#0b0b1f'); gv.addColorStop(1, '#06060f');
  ctx.fillStyle = gv; ctx.fillRect(0, Math.max(0, yh), W, H - Math.max(0, yh));
  // far ridge (directions), lit faintly from the sky, and a nearer, darker one
  for (const [R, dh, col, rim] of [[3200, -40, '#1a1734', 'rgba(120,110,190,.22)'], [1500, -92, '#100f25', 'rgba(110,100,180,.14)']]) {
    const pts = []; for (const [a, hm] of RIDGE) { const P = C.P(o.x - Math.cos(a) * R, (R < 2000 ? hm * .45 + 18 * Math.sin(a * 5.3) : hm) + dh, o.z + Math.sin(a) * R); pts.push(P); }
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-10, H + 10); for (const P of pts) ctx.lineTo(P[0], P[1]); ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rim; ctx.lineWidth = 1; ctx.beginPath(); pts.forEach((P, i) => (i ? ctx.lineTo(P[0], P[1]) : ctx.moveTo(P[0], P[1]))); ctx.stroke();
  }
  // the river on the valley floor, catching the sky
  ctx.strokeStyle = 'rgba(92,86,150,.55)'; ctx.lineCap = 'round';
  for (let i = 0; i < RIVER.length - 1; i++) {
    const a = C.P(...RIVER[i]), b = C.P(...RIVER[i + 1]); if (a[2] < 5 || b[2] < 5) continue;
    ctx.lineWidth = Math.max(.8, 26 * C.F / a[2] * clamp((o.y - RIVER[i][1]) / a[2], 0, 1)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  for (const [X, Y, Z, k, ph] of VALLEY) {
    const P = C.P(X, Y, Z); if (P[2] < 1 || P[0] < -10 || P[0] > W + 10 || P[1] < yh - 2 || P[1] > H + 10) continue;
    const a = (.45 + .55 * k) * (.75 + .25 * Math.sin(t * (.6 + k) + ph)), s = 1 + 1.6 * k * clamp(500 / P[2]);
    ctx.fillStyle = rgba(k < .82 ? '#ffcf8a' : '#cfe6ff', a); ctx.fillRect(P[0], P[1], s, s);
  }
  lowerTerrace(ctx, t, C);
  return yh;
}
// the river (valley floor, metres) and the terrace below the parapet: the backs of its roofs, chimneys, a lit skylight here and there
const RIVER = (() => { const pts = []; for (let i = 0; i <= 40; i++) { const x = 900 - i * 110; pts.push([x, -128, 760 + 260 * Math.sin(i * .37 + .6) + 90 * Math.sin(i * 1.1)]); } return pts; })();
const ROOFS = (() => {
  const r = prng(2024), out = []; let x = 9;
  while (x > ST.xEnd) { const w = 5 + r() * 4, y0 = -3.4 - r() * .8, rh = 2.1 + r() * .8; out.push({ x0: x, x1: x - w, y0, rh, z0: 4.3 + r() * .4, d: 5.4, col: ['#2e2234', '#33243a', '#2a2236', '#36283a'][Math.floor(r() * 4)], ch: r() < .6 ? .2 + r() * .6 : -1, sky: r() < .45 ? .25 + r() * .5 : -1, lit: r() < .7, ph: r() * TAU }); x -= w + .1 + (r() < .2 ? 1.5 : 0); }
  return out;
})();
function lowerTerrace(ctx, t, C) {
  const o = C.o; if (o.y < 1.2) return;   // hidden behind the parapet from eye level
  // the slope below (dark, a little lighter near the wall where the lanterns reach)
  const S = C.poly(ctx, [[Math.min(o.x + 20, 30), -2.5, 3.3], [ST.xEnd, -2.5, 3.3], [ST.xEnd, -60, 80], [Math.min(o.x + 20, 30), -60, 80]]);
  if (S) { ctx.fillStyle = '#0c0b1d'; ctx.fill(); }
  for (const R of ROOFS) {
    if (R.x1 > o.x + 6) continue;
    const zr = R.z0 + R.d / 2, yr = R.y0 + R.rh;
    // back slope (faces up toward the street), then the gable end facing +X when it is visible
    const q = [[R.x0, R.y0, R.z0], [R.x1, R.y0, R.z0], [R.x1, yr, zr], [R.x0, yr, zr]];
    const Sq = C.S(q); if (!Sq || !onScreenPts(Sq)) continue;
    ctx.fillStyle = R.col; C.poly(ctx, q); ctx.fill();
    ctx.strokeStyle = 'rgba(8,6,16,.55)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let k = 1; k < 7; k++) { const u = k / 7; C.seg(ctx, [R.x0, mix(R.y0, yr, u), mix(R.z0, zr, u)], [R.x1, mix(R.y0, yr, u), mix(R.z0, zr, u)]); }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(150,130,190,.18)'; ctx.beginPath(); C.seg(ctx, [R.x0, yr, zr], [R.x1, yr, zr]); ctx.stroke();   // the ridge catches the sky
    if (R.sky > 0) {   // a skylight, lit from the room below
      const xs = mix(R.x0, R.x1, R.sky), u0 = .3, u1 = .62, P = [[xs + .35, mix(R.y0, yr, u0), mix(R.z0, zr, u0)], [xs - .35, mix(R.y0, yr, u0), mix(R.z0, zr, u0)], [xs - .35, mix(R.y0, yr, u1), mix(R.z0, zr, u1)], [xs + .35, mix(R.y0, yr, u1), mix(R.z0, zr, u1)]];
      ctx.fillStyle = R.lit ? mixHex('#c46a2e', '#ffcf8a', .6 + .2 * Math.sin(t * .8 + R.ph)) : '#121026'; if (C.poly(ctx, P)) ctx.fill();
    }
    if (R.ch > 0) {   // a chimney on the ridge
      const xc = mix(R.x0, R.x1, R.ch);
      ctx.fillStyle = '#1e1626'; if (C.poly(ctx, [[xc + .25, yr - .3, zr - .25], [xc - .25, yr - .3, zr - .25], [xc - .25, yr + .7, zr - .25], [xc + .25, yr + .7, zr - .25]])) ctx.fill();
      ctx.fillStyle = '#2c2234'; if (C.poly(ctx, [[xc + .25, yr + .7, zr - .25], [xc - .25, yr + .7, zr - .25], [xc - .25, yr + .7, zr + .25], [xc + .25, yr + .7, zr + .25]])) ctx.fill();
    }
  }
}
const onScreenPts = (S) => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of S) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } return x1 > -20 && x0 < W + 20 && y1 > -20 && y0 < H + 20; };

// ---------------------------------------------------------------- houses
function houses(ctx, t, C) {
  const Z = ST.houseZ, o = C.o;
  // far to near (the camera looks toward -X, so smaller X is further)
  const list = HOUSES.filter((h) => h.x1 < o.x + 6).sort((a, b) => a.x1 - b.x1);
  for (let hi = 0; hi < list.length; hi++) {
    const h = list[hi];
    // roof (slopes back from the eaves) and the facade
    const ridge = Z - 3.6, rh = h.h + 1.7;
    ctx.fillStyle = '#2a1d2c'; if (C.poly(ctx, [[h.x0, h.h, Z], [h.x1, h.h, Z], [h.x1, rh, ridge], [h.x0, rh, ridge]])) ctx.fill();
    ctx.strokeStyle = 'rgba(10,8,20,.5)'; ctx.lineWidth = 1; ctx.beginPath(); for (let q = 1; q < 6; q++) { const u = q / 6; C.seg(ctx, [h.x0, mix(h.h, rh, u), mix(Z, ridge, u)], [h.x1, mix(h.h, rh, u), mix(Z, ridge, u)]); } ctx.stroke();
    const S = C.S([[h.x0, 0, Z], [h.x1, 0, Z], [h.x1, h.h, Z], [h.x0, h.h, Z]]); if (!S) continue;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of S) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    if (x1 < 0 || x0 > W || y1 < 0 || y0 > H) continue;
    const gF = ctx.createLinearGradient(0, y1, 0, y0); gF.addColorStop(0, shadeHex(h.col, .1)); gF.addColorStop(.5, h.col); gF.addColorStop(1, shadeHex(h.col, -.25));
    ctx.fillStyle = gF; C.poly(ctx, [[h.x0, 0, Z], [h.x1, 0, Z], [h.x1, h.h, Z], [h.x0, h.h, Z]]); ctx.fill();
    // the side wall above a lower neighbour toward +X (faces the camera)
    const nb = list[hi + 1]; if (nb && nb.h < h.h - .2) { ctx.fillStyle = shadeHex(h.col, -.35); if (C.poly(ctx, [[h.x0, nb.h, Z], [h.x0, h.h, Z], [h.x0, rh, ridge], [h.x0, nb.h + 1.7 * (h.h - nb.h) / 3, ridge]])) ctx.fill(); }
    // cornice + storey lines (engraved)
    ctx.strokeStyle = 'rgba(12,10,26,.55)'; ctx.lineWidth = Math.max(1, C.k(S[0][2] ?? 10) * .03); ctx.beginPath();
    C.seg(ctx, [h.x0, h.h - .15, Z + .02], [h.x1, h.h - .15, Z + .02]); C.seg(ctx, [h.x0, 3.35, Z + .02], [h.x1, 3.35, Z + .02]); ctx.stroke();
    // engraved plaster: broken diagonal hatching, denser low on the wall (stable in world space), and a darker plinth
    const dist = Math.hypot(o.x - (h.x0 + h.x1) / 2, o.z - Z);
    if (dist < 26) {
      ctx.strokeStyle = rgba(shadeHex(h.col, -.45), .32 * clamp((26 - dist) / 8)); ctx.lineWidth = 1; ctx.beginPath();
      for (let q = 0; q < 70; q++) {
        const xs = h.x0 + h.h * .55 - q * .32; if (xs < h.x1) break;
        let y = .55 + hash(h.seed + q) * .6;
        while (y < h.h - .3) { const L = .5 + 1.1 * hash(q * 7.1 + y * 3.3 + h.seed), xa = xs - y * .55, xb = xa - L * .55; if (xa <= h.x0 - .05 && xb >= h.x1 + .05 && y + L < h.h - .2) C.seg(ctx, [xa, y, Z + .02], [xb, y + L, Z + .02]); y += L + .35 + .9 * hash(q * 3.7 + y); }
      }
      ctx.stroke();
    }
    ctx.fillStyle = shadeHex(h.col, -.3); if (C.poly(ctx, [[h.x0, 0, Z + .03], [h.x1, 0, Z + .03], [h.x1, .45, Z + .03], [h.x0, .45, Z + .03]])) ctx.fill();
    // windows
    const ww = 1.0, wh = 1.45, step = (h.x0 - h.x1) / h.nwin;
    for (let f = 0; f <= h.fl; f++) for (let i = 0; i < h.nwin; i++) {
      const cx = h.x0 - step * (i + .5), base = f === 0 ? 0 : 3.4 + (f - 1) * 2.9 + .85, k = f * h.nwin + i;
      if (f === 0) {   // ground floor: a door (arched top) or a shop window
        const door = i === h.door, dw = door ? 1.1 : 1.5, dh = door ? 2.35 : 1.7, by = door ? 0 : .7, lit = h.lit[k] || door && h.cafe;
        const R = [[cx + dw / 2, by, Z + .01], [cx - dw / 2, by, Z + .01], [cx - dw / 2, by + dh, Z + .01], [cx + dw / 2, by + dh, Z + .01]];
        ctx.fillStyle = lit ? '#ffb768' : '#141228'; if (C.poly(ctx, R)) ctx.fill();
        if (lit) { ctx.fillStyle = 'rgba(120,52,20,.35)'; if (C.poly(ctx, [[cx + dw / 2, by, Z + .015], [cx - dw / 2, by, Z + .015], [cx - dw / 2, by + dh * .45, Z + .015], [cx + dw / 2, by + dh * .45, Z + .015]])) ctx.fill(); }
        ctx.strokeStyle = '#100e1e'; ctx.lineWidth = Math.max(1, C.k(10) * .006); if (C.poly(ctx, R)) ctx.stroke();
        if (h.cafe && door) {   // a small striped awning over the café door (muted: it must not shout from above)
          for (let q = 0; q < 8; q++) {
            const xa = cx + 1.0 - q * .25, xb = xa - .25;
            ctx.fillStyle = q % 2 ? '#3e2c3c' : '#6b5a5a'; if (C.poly(ctx, [[xa, 2.65, Z], [xb, 2.65, Z], [xb, 2.3, Z + .75], [xa, 2.3, Z + .75]])) ctx.fill();
          }
          ctx.fillStyle = '#2a1e2c'; if (C.poly(ctx, [[cx + 1.0, 2.3, Z + .75], [cx - 1.0, 2.3, Z + .75], [cx - 1.0, 2.18, Z + .75], [cx + 1.0, 2.18, Z + .75]])) ctx.fill();
        }
        continue;
      }
      const lit = h.lit[k], R = [[cx + ww / 2, base, Z + .01], [cx - ww / 2, base, Z + .01], [cx - ww / 2, base + wh, Z + .01], [cx + ww / 2, base + wh, Z + .01]];
      const Sw = C.poly(ctx, R); if (!Sw) continue;
      if (lit) {
        const fl = .9 + .1 * Math.sin(t * (1.1 + (k % 5) * .2) + k);
        ctx.fillStyle = mixHex('#c46a2e', '#ffcf8a', fl * (.55 + .45 * hash(h.seed + k))); ctx.fill();
        // curtains (two soft vertical bands) and the frame cross
        ctx.fillStyle = 'rgba(150,62,40,.28)'; if (C.poly(ctx, [[cx + ww / 2, base, Z + .015], [cx + ww * .18, base, Z + .015], [cx + ww * .26, base + wh, Z + .015], [cx + ww / 2, base + wh, Z + .015]])) ctx.fill();
        if (C.poly(ctx, [[cx - ww * .2, base, Z + .015], [cx - ww / 2, base, Z + .015], [cx - ww / 2, base + wh, Z + .015], [cx - ww * .28, base + wh, Z + .015]])) ctx.fill();
      } else { ctx.fillStyle = '#121026'; ctx.fill(); }
      ctx.strokeStyle = lit ? 'rgba(40,20,20,.7)' : 'rgba(60,58,96,.5)'; ctx.lineWidth = Math.max(1, C.k(10) * .004); ctx.beginPath();
      C.seg(ctx, [cx, base, Z + .02], [cx, base + wh, Z + .02]); C.seg(ctx, [cx - ww / 2, base + wh * .62, Z + .02], [cx + ww / 2, base + wh * .62, Z + .02]); ctx.stroke();
      // shutters, the stone sill (catches the lantern light) and the lintel
      ctx.fillStyle = shadeHex(h.col, -.3); for (const sd of [-1, 1]) if (C.poly(ctx, [[cx + sd * ww / 2, base, Z + .03], [cx + sd * ww * .95, base, Z + .03], [cx + sd * ww * .95, base + wh, Z + .03], [cx + sd * ww / 2, base + wh, Z + .03]])) ctx.fill();
      ctx.fillStyle = shadeHex(h.col, .28); if (C.poly(ctx, [[cx + ww * .62, base - .1, Z + .09], [cx - ww * .62, base - .1, Z + .09], [cx - ww * .62, base, Z + .09], [cx + ww * .62, base, Z + .09]])) ctx.fill();
      ctx.fillStyle = shadeHex(h.col, -.18); if (C.poly(ctx, [[cx + ww * .58, base + wh, Z + .04], [cx - ww * .58, base + wh, Z + .04], [cx - ww * .58, base + wh + .16, Z + .04], [cx + ww * .58, base + wh + .16, Z + .04]])) ctx.fill();
      if (!h.bal[k] && hash(h.seed + k * 3.3) < .3) {   // a flower box under the window
        ctx.fillStyle = '#3a2a24'; if (C.poly(ctx, [[cx + ww * .5, base - .3, Z + .2], [cx - ww * .5, base - .3, Z + .2], [cx - ww * .5, base - .1, Z + .2], [cx + ww * .5, base - .1, Z + .2]])) ctx.fill();
        for (let q = 0; q < 6; q++) { const P = C.P(cx - ww * .42 + q * ww * .17, base + .02 + .05 * hash(k + q), Z + .2); if (P[2] < .3) continue; const rr = Math.max(.8, C.k(P[2]) * .055); ctx.fillStyle = q % 2 ? '#3f5a34' : ['#e8a3a0', '#e9c46a', '#f3efe2'][(k + q) % 3]; ctx.beginPath(); ctx.arc(P[0], P[1], rr, 0, TAU); ctx.fill(); }
      }
      // a balcony with a railing and pots
      if (h.bal[k]) {
        const by = base - .1; ctx.fillStyle = '#1c1a30'; if (C.poly(ctx, [[cx + .8, by, Z], [cx - .8, by, Z], [cx - .8, by, Z + .55], [cx + .8, by, Z + .55]])) ctx.fill();
        ctx.strokeStyle = 'rgba(14,12,26,.9)'; ctx.lineWidth = Math.max(1, C.k(10) * .004); ctx.beginPath(); C.seg(ctx, [cx + .8, by + .95, Z + .55], [cx - .8, by + .95, Z + .55]);
        for (let q = 0; q <= 8; q++) { const xx = cx + .8 - q * .2; C.seg(ctx, [xx, by, Z + .55], [xx, by + .95, Z + .55]); } ctx.stroke();
        for (let q = 0; q < 3; q++) { const P = C.P(cx + .5 - q * .5, by + .25, Z + .45); if (P[2] < .3) continue; const rr = C.k(P[2]) * .17; ctx.fillStyle = ['#2f4a2c', '#3a5230', '#6a2a3a'][q]; ctx.beginPath(); ctx.ellipse(P[0], P[1] - rr * .4, rr * 1.2, rr, 0, 0, TAU); ctx.fill(); }
      }
    }
    // warm wash from the lanterns on the lower facade
    const g2 = ctx.createLinearGradient(0, S[0][1], 0, Math.min(S[2][1], S[3][1])); g2.addColorStop(0, 'rgba(255,170,90,.14)'); g2.addColorStop(.45, 'rgba(255,170,90,.04)'); g2.addColorStop(1, 'rgba(255,170,90,0)');
    ctx.fillStyle = g2; C.poly(ctx, [[h.x0, 0, Z + .04], [h.x1, 0, Z + .04], [h.x1, h.h, Z + .04], [h.x0, h.h, Z + .04]]); ctx.fill();
  }
  // the house that closes the street far away (faces +X), its windows lit
  const ex = ST.xEnd, S2 = C.poly(ctx, [[ex, 0, ST.houseZ - 1], [ex, 0, ST.parapetZ + 3], [ex, 9.5, ST.parapetZ + 3], [ex, 9.5, ST.houseZ - 1]]);
  if (S2) { ctx.fillStyle = '#2a2648'; ctx.fill(); for (let f = 0; f < 3; f++) for (let i = 0; i < 4; i++) { const z0 = ST.houseZ + .2 + i * 1.6, y0 = 1 + f * 2.9; ctx.fillStyle = (i + f) % 3 ? '#ffc070' : '#151330'; if (C.poly(ctx, [[ex + .01, y0, z0], [ex + .01, y0, z0 + .9], [ex + .01, y0 + 1.3, z0 + .9], [ex + .01, y0 + 1.3, z0]])) ctx.fill(); } }
}

// ---------------------------------------------------------------- street floor, parapet, light pools
function ground(ctx, t, C) {
  const o = C.o, xN = Math.min(o.x + 3, 6), xF = ST.xEnd;
  ctx.fillStyle = '#1b1830'; if (C.poly(ctx, [[xN, 0, ST.houseZ], [xF, 0, ST.houseZ], [xF, 0, ST.parapetZ], [xN, 0, ST.parapetZ]])) ctx.fill();
  // pools of lantern light on the cobbles and around the table (additive, warm)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const L of LANTERNS) { if (L.off || L.p[0] > o.x + 2) continue; pool(ctx, C, L.p[0], L.p[2] * .7, L.head ? 2.6 : 1.7, L.head ? .2 : .1); }
  pool(ctx, C, -3, 0, 7.5, .1); pool(ctx, C, -10, 0, 7.5, .08);
  ctx.restore();
  // cobbles: rows along the street + joints near the camera (engraved lines)
  ctx.strokeStyle = 'rgba(8,8,20,.55)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let z = ST.houseZ + .16; z < ST.parapetZ; z += .16) C.seg(ctx, [xN, 0, z], [Math.max(xF, o.x - 34), 0, z]);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(8,8,20,.4)'; ctx.beginPath();
  const xa = Math.min(xN, o.x + 1), xb = Math.max(xF, o.x - 16);
  let row = 0; for (let z = ST.houseZ; z < ST.parapetZ - .1; z += .16, row++) { const off = (row % 2) * .11; for (let x = xa - off; x > xb; x -= .22) C.seg(ctx, [x, 0, z], [x, 0, z + .16]); }
  ctx.stroke();
  // the parapet (inner face + top) with its lantern poles
  const PZ = ST.parapetZ, PH = ST.parapetH;
  ctx.fillStyle = '#26223e'; if (C.poly(ctx, [[xN, 0, PZ], [xF, 0, PZ], [xF, PH, PZ], [xN, PH, PZ]])) ctx.fill();
  ctx.fillStyle = '#3a3358'; if (C.poly(ctx, [[xN, PH, PZ], [xF, PH, PZ], [xF, PH, PZ + .42], [xN, PH, PZ + .42]])) ctx.fill();
  ctx.strokeStyle = 'rgba(10,8,22,.45)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = xN; x > Math.max(xF, o.x - 30); x -= .55) C.seg(ctx, [x, 0, PZ - .005], [x, PH, PZ - .005]); C.seg(ctx, [xN, PH * .5, PZ - .005], [xF, PH * .5, PZ - .005]); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gP = ctx.createLinearGradient(0, 0, W, 0); gP.addColorStop(0, 'rgba(255,170,90,0)'); ctx.restore();
  for (const px of POLES) {
    if (px > o.x + 1) continue; ctx.strokeStyle = '#0d0b18'; ctx.lineWidth = Math.max(1, C.k(Math.abs(o.x - px) + 1) * .06); ctx.beginPath(); C.seg(ctx, [px, PH, PZ + .2], [px, 4.0, PZ - .05]); ctx.stroke();
  }
}
function pool(ctx, C, x, z, R, a) {
  const P = C.P(x, 0, z); if (P[2] < .2) return;
  const Px = C.P(x + R, 0, z), Pz = C.P(x, 0, z + R);
  const ax = [Px[0] - P[0], Px[1] - P[1]], az = [Pz[0] - P[0], Pz[1] - P[1]];
  if (Math.hypot(...ax) > 6000 || Math.hypot(...az) > 6000) return;
  ctx.save(); ctx.transform(ax[0], ax[1], az[0], az[1], P[0], P[1]);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, rgba('#ff9a4a', a)); g.addColorStop(.5, rgba('#ff9a4a', a * .35)); g.addColorStop(1, 'rgba(255,154,74,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill(); ctx.restore();
}

// ---------------------------------------------------------------- lanterns (the hero light)
function wire(ctx, t, C, S) {
  ctx.strokeStyle = 'rgba(12,10,20,.85)'; ctx.lineCap = 'round';
  ctx.lineWidth = 1.2; ctx.beginPath(); let prev = null;
  for (let i = 0; i <= 16; i++) { const p = catenary(S, i / 16); if (prev) C.seg(ctx, prev, p); prev = p; }
  ctx.stroke();
  // little bulbs along the wire
  for (let i = 1; i < 22; i++) { const p = catenary(S, i / 22), P = C.P(p[0], p[1] - .03, p[2]); if (P[2] < .3 || P[0] < -20 || P[0] > W + 20 || P[1] < -20 || P[1] > H + 20) continue; const k = C.k(P[2]); putGlow(ctx, P[0], P[1], k * .09, .5, '#ffcf8a'); ctx.fillStyle = '#fff1d6'; ctx.fillRect(P[0] - k * .006, P[1] - k * .006, Math.max(1, k * .012), Math.max(1, k * .012)); }
}
function lantern(ctx, t, C, L) {
  const sw = Math.sin(t * (1.6 + L.ph * .05) + L.ph) * .05, top = L.p, cx = top[0] + Math.sin(sw) * L.drop * .3, cy = top[1] - L.drop, cz = top[2] + Math.sin(sw) * L.drop;
  const P = C.P(cx, cy, cz); if (P[2] < .15) return;
  const k = C.k(P[2]), r = L.r * k; if (P[0] < -r * 4 || P[0] > W + r * 4 || P[1] < -r * 4 || P[1] > H + r * 4) return;
  // cord
  const T = C.P(top[0], top[1], top[2]); ctx.strokeStyle = 'rgba(10,8,18,.9)'; ctx.lineWidth = Math.max(1, k * .006); ctx.beginPath(); ctx.moveTo(T[0], T[1]); ctx.lineTo(P[0], P[1] - r); ctx.stroke();
  const br = .9 + .1 * Math.sin(t * 2.3 + L.ph) * Math.sin(t * 3.7 + L.ph * 2);
  putGlow(ctx, P[0], P[1], r * 6, .5 * br, '#ffb35c');
  const [c0, c1, c2] = L.col ? ['#fffaf0', '#f3e2c0', '#c8a878'] : ['#fff1d6', '#ffbf6a', '#c46a2e'];
  const g = ctx.createRadialGradient(P[0] - r * .25, P[1] - r * .2, 0, P[0], P[1], r); g.addColorStop(0, c0); g.addColorStop(.55, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(P[0], P[1], r, r * .92, 0, 0, TAU); ctx.fill();
  if (r > 4) {   // the paper ribs and the dark caps
    ctx.strokeStyle = rgba('#8a3a18', .35); ctx.lineWidth = Math.max(.6, r * .035); ctx.beginPath();
    for (let q = -2; q <= 2; q++) { const yy = P[1] + q * r * .32, hw = r * Math.sqrt(Math.max(0, 1 - (q * .34) ** 2)); ctx.moveTo(P[0] - hw, yy); ctx.quadraticCurveTo(P[0], yy + r * .12, P[0] + hw, yy); }
    ctx.stroke();
    ctx.fillStyle = '#2a1a14'; ctx.beginPath(); ctx.ellipse(P[0], P[1] - r * .9, r * .3, r * .1, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(P[0], P[1] + r * .9, r * .26, r * .08, 0, 0, TAU); ctx.fill();
  }
  putGlow(ctx, P[0], P[1], r * 1.6, .55 * br, '#fff1d6');
}

// ---------------------------------------------------------------- the table, benches and what is on it
function tableSlice(ctx, C, xa, xb) {
  const T = TB.top, hw = TB.hw;
  // legs (trestles) under the slice
  ctx.fillStyle = '#16101a';
  for (let x = Math.ceil(xb / 2.5) * 2.5; x <= xa; x += 2.5) for (const z of [-hw + .08, hw - .08]) if (C.poly(ctx, [[x + .04, 0, z], [x - .04, 0, z], [x - .04, T, z], [x + .04, T, z]])) ctx.fill();
  // cloth hanging down on both sides + the end
  const xc = xa >= TB.x0 - 1e-6 ? xa : xa + .02;
  ctx.fillStyle = '#b9ab92'; for (const sd of [-1, 1]) if (C.poly(ctx, [[xc, T, sd * hw], [xb, T, sd * hw], [xb, T - .2, sd * (hw + .01)], [xc, T - .2, sd * (hw + .01)]])) ctx.fill();
  if (xa >= TB.x0 - 1e-6) { ctx.fillStyle = '#a89a80'; if (C.poly(ctx, [[xa, T, -hw], [xa, T, hw], [xa, T - .2, hw], [xa, T - .2, -hw]])) ctx.fill(); }
  // top: linen, warm in the lantern light
  const xo = xa >= TB.x0 - 1e-6 ? xa : xa + .02;
  const S = C.S([[xo, T, -hw], [xb, T, -hw], [xb, T, hw], [xo, T, hw]]); if (!S) return;
  ctx.fillStyle = '#e3d6bc'; C.poly(ctx, [[xo, T, -hw], [xb, T, -hw], [xb, T, hw], [xo, T, hw]]); ctx.fill();
  ctx.fillStyle = 'rgba(160,130,90,.18)'; if (C.poly(ctx, [[xa, T + .001, -.1], [xb, T + .001, -.1], [xb, T + .001, .1], [xa, T + .001, .1]])) ctx.fill();
  ctx.strokeStyle = 'rgba(120,96,70,.25)'; ctx.lineWidth = 1; ctx.beginPath(); C.seg(ctx, [xa, T + .001, -.1], [xb, T + .001, -.1]); C.seg(ctx, [xa, T + .001, .1], [xb, T + .001, .1]); ctx.stroke();
}
// a horizontal disc (projected, so it is right from any angle)
function disc(ctx, C, x, y, z, r) { const pts = []; for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; pts.push([x + Math.cos(a) * r, y, z + Math.sin(a) * r]); } return C.poly(ctx, pts); }
function bench(ctx, C, xa, xb, side) {
  const z = side * TB.benchZ, Y = TB.benchY;
  ctx.fillStyle = '#2a1e1c'; if (C.poly(ctx, [[xa, Y, z - .16], [xb, Y, z - .16], [xb, Y, z + .16], [xa, Y, z + .16]])) ctx.fill();
  ctx.fillStyle = '#1a1214'; if (C.poly(ctx, [[xa, Y, z + side * .16], [xb, Y, z + side * .16], [xb, Y - .06, z + side * .16], [xa, Y - .06, z + side * .16]])) ctx.fill();
}
function item(ctx, t, C, it) {
  const T = TB.top, P = C.P(it.x, T, it.z); if (P[2] < .08) return;
  const k = C.k(P[2]); if (P[0] < -k * .4 || P[0] > W + k * .4 || P[1] < -k * .6 || P[1] > H + k * .4) return;
  if (it.k === 'plate' || it.k === 'bowl' || it.k === 'bread') {
    const R = it.r || (it.k === 'bowl' ? .11 : .14), pts = [];
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; pts.push([it.x + Math.cos(a) * R * (it.k === 'bread' ? 1.6 : 1), T + .004, it.z + Math.sin(a) * R * (it.k === 'bread' ? .7 : 1)]); }
    const S = C.S(pts); if (!S) return;
    ctx.fillStyle = it.k === 'plate' ? '#f1ead8' : it.k === 'bowl' ? '#d9cdb4' : '#9a5a2a'; ctx.beginPath(); S.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
    if (it.k === 'plate') { ctx.strokeStyle = 'rgba(120,100,80,.3)'; ctx.lineWidth = Math.max(.6, k * .003); ctx.stroke();
      // food on the plate
      ctx.fillStyle = it.you ? '#b8a07a' : ['#c4512e', '#8fae5a', '#e9c46a', '#a0603a'][Math.floor(hash(it.x * 13) * 4)]; disc(ctx, C, it.x + .02, T + .01, it.z, .055); ctx.fill(); }
    if (it.k === 'bowl') { ctx.fillStyle = it.col; disc(ctx, C, it.x, T + .02, it.z, .085); ctx.fill(); }
    if (it.k === 'bread') { ctx.strokeStyle = 'rgba(60,30,10,.5)'; ctx.lineWidth = Math.max(.6, k * .004); ctx.beginPath(); for (let q = -2; q <= 2; q++) C.seg(ctx, [it.x + q * .05 - .02, T + .03, it.z - .05], [it.x + q * .05 + .02, T + .03, it.z + .05]); ctx.stroke(); }
    return;
  }
  if (it.k === 'fork') { ctx.strokeStyle = 'rgba(200,190,170,.7)'; ctx.lineWidth = Math.max(.6, k * .006); ctx.beginPath(); C.seg(ctx, [it.x - .08, T + .003, it.z], [it.x + .08, T + .003, it.z]); ctx.stroke(); return; }
  // upright things: drawn as small billboards standing on the table
  const up = C.P(it.x, T + .1, it.z), hv = (P[1] - up[1]) / .1;   // screen pixels per metre upward
  ctx.save(); ctx.translate(P[0], P[1]);
  if (it.k === 'glass') {
    const s = k, h = .17 * hv, bw = .035 * s;
    ctx.strokeStyle = 'rgba(230,236,255,.55)'; ctx.lineWidth = Math.max(.7, s * .003); ctx.beginPath(); ctx.moveTo(-bw * .9, 0); ctx.lineTo(bw * .9, 0); ctx.moveTo(0, 0); ctx.lineTo(0, -h * .45); ctx.stroke();
    ctx.fillStyle = 'rgba(200,215,255,.16)'; ctx.beginPath(); ctx.moveTo(-bw, -h); ctx.quadraticCurveTo(-bw * 1.1, -h * .5, 0, -h * .45); ctx.quadraticCurveTo(bw * 1.1, -h * .5, bw, -h); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = it.red ? 'rgba(110,22,36,.85)' : 'rgba(230,200,120,.6)'; ctx.beginPath(); const fy = -h * (.5 + .4 * it.fill); ctx.moveTo(-bw * .9, fy); ctx.quadraticCurveTo(-bw, -h * .5, 0, -h * .46); ctx.quadraticCurveTo(bw, -h * .5, bw * .9, fy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,241,214,.7)'; ctx.fillRect(-bw * .6, -h * .92, Math.max(.8, s * .003), h * .3);
  } else if (it.k === 'bottle') {
    const h = .3 * hv, bw = .04 * k; ctx.fillStyle = it.green ? '#1d3424' : '#3a1a20';
    ctx.beginPath(); ctx.moveTo(-bw, 0); ctx.lineTo(-bw, -h * .6); ctx.quadraticCurveTo(-bw, -h * .72, -bw * .35, -h * .78); ctx.lineTo(-bw * .35, -h); ctx.lineTo(bw * .35, -h); ctx.lineTo(bw * .35, -h * .78); ctx.quadraticCurveTo(bw, -h * .72, bw, -h * .6); ctx.lineTo(bw, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,207,138,.45)'; ctx.fillRect(-bw * .6, -h * .58, Math.max(.8, bw * .25), h * .5); ctx.fillStyle = '#e8d7b0'; ctx.fillRect(-bw * .95, -h * .45, bw * 1.9, h * .18);
  } else if (it.k === 'candle') {
    const h = it.h * hv, bw = .04 * k, fl = 1 + .12 * Math.sin(t * 9 + it.ph) * Math.sin(t * 13.7 + it.ph * 2);
    ctx.fillStyle = 'rgba(200,190,230,.18)'; ctx.fillRect(-bw, -h, bw * 2, h); ctx.fillStyle = '#efe4cc'; ctx.fillRect(-bw * .55, -h * .62, bw * 1.1, h * .62);
    ctx.restore(); putGlow(ctx, P[0], P[1] - h * .7, k * .32 * fl, .6, '#ffb35c'); putGlow(ctx, P[0], P[1] - h * .72, k * .05 * fl, .9, '#fff1d6'); return;
  } else if (it.k === 'flowers') {
    const h = .26 * hv, bw = .03 * k; ctx.fillStyle = 'rgba(190,210,255,.25)'; ctx.fillRect(-bw, -h * .4, bw * 2, h * .4);
    for (let q = 0; q < 7; q++) { const a = -1.2 + q * .4, L = h * (.75 + .25 * hash(q + it.x)); ctx.strokeStyle = '#2f4a2c'; ctx.lineWidth = Math.max(.6, k * .004); ctx.beginPath(); ctx.moveTo(0, -h * .38); ctx.lineTo(Math.sin(a) * L * .45, -L); ctx.stroke(); ctx.fillStyle = ['#e9c46a', '#e8a3a0', '#f3efe2'][q % 3]; ctx.beginPath(); ctx.arc(Math.sin(a) * L * .45, -L, Math.max(1, k * .02), 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- people
// gesture of one person at t (pose + glass up)
function poseOf(p, t, S) {
  const base = p.kid ? { hip: [1.45, 1.5], kn: [1.45, 1.5], sh: [.5, .42], el: [.8, .9], lean: .05 } : { ...POSES.sit, sh: [.55, .4], el: [.95, 1.0], lean: .08 };
  const ph = p.ph, w = (a, b) => .5 + .5 * Math.sin(t * TAU / p.per * a + ph + b);
  let lift = 0, smile = 0;
  if (p.act === 'talk') { base.sh = [.6 + .5 * Math.pow(w(1, 0), 3), .4]; base.el = [.9 - .5 * Math.pow(w(1, 0), 2), 1]; base.head = .02 * Math.sin(t * 2.4 + ph); smile = .4; }
  else if (p.act === 'drink') { const c = Math.pow(w(.5, 0), 6); lift = c; base.head = -.12 * c; }
  else if (p.act === 'laugh') { const c = Math.pow(w(.7, 1), 4); base.lean = .08 - .1 * c; base.head = -.18 * c + .03 * Math.sin(t * 9) * c; smile = .5 + .5 * c; }
  else if (p.act === 'eat') { const c = Math.pow(w(1.2, 2), 5); base.sh = [.55 + .5 * c, .4]; base.el = [1 + .9 * c, 1]; base.head = .1 - .06 * c; }
  else if (p.act === 'lean') { base.lean = .2; base.sh = [.75, .7]; base.el = [1.05, 1.1]; smile = .3; }
  else if (p.act === 'ask') {   // the glass comes up to face height, held out toward you (not a cheer over the head)
    const u = S.askLift; base.sh = [mix(.6, 1.18, u), .45]; base.el = [mix(.95, .98, u), 1]; base.head = mix(.04, -.04, u); base.lean = mix(.08, .13, u); smile = .35 + .3 * u; lift = u;
  }
  else smile = .2;
  return { pose: base, lift, smile };
}
function wineProp(lift, red = true) {
  return (g, fa) => {
    if (lift <= .02) return;
    g.save(); g.translate(fa.hx, fa.hy); g.rotate(-fa.ang * .0); g.scale(1, 1);
    // stem in the fingers, bowl above (glass held upright)
    g.strokeStyle = 'rgba(230,236,255,.75)'; g.lineWidth = .7; g.beginPath(); g.moveTo(0, 2); g.lineTo(0, -6); g.moveTo(-3.2, 2.2); g.lineTo(3.2, 2.2); g.stroke();
    g.fillStyle = 'rgba(205,220,255,.22)'; g.beginPath(); g.moveTo(-4.4, -17); g.quadraticCurveTo(-5, -8, 0, -6); g.quadraticCurveTo(5, -8, 4.4, -17); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = red ? 'rgba(120,24,40,.9)' : 'rgba(230,200,120,.7)'; g.beginPath(); g.moveTo(-4.2, -12); g.quadraticCurveTo(-4.6, -8, 0, -6.6); g.quadraticCurveTo(4.6, -8, 4.2, -12); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,241,214,.85)'; g.fillRect(-3, -16, .7, 5);
    g.restore();
  };
}
function drawPerson(ctx, t, C, p, S, part, light) {
  const z = p.side * TB.benchZ, P = C.P(p.x, TB.seat, z); if (P[2] < .25) return null;
  const k = C.k(P[2]), s = k / 105.7; if (P[0] < -k * 1.2 || P[0] > W + k * 1.2 || P[1] < -k * .4 || P[1] > H + k * 1.6) return null;
  const el = Math.atan2(C.o.y - 1, Math.hypot(C.o.x - p.x, C.o.z - z)), sq = mix(1, Math.cos(el), .55);
  const { pose, lift, smile } = poseOf(p, t, S), fog = clamp((P[2] - 6) / 22) * .55;
  const o = { t, seed: p.seed, flip: p.side < 0, dress: p.dress, rim: '#ffcf8a', rimSide: 0, rimW: Math.max(1, 1.4 * s), part, smile, fog: fog > 0 ? { col: NIGHT, a: fog } : null,
    light: { x: light[0], y: light[1], col: '#ffcf8a', a: .5 * (1 - fog) }, shadow: false };
  pose.hair = p.hair; pose.skirt = false; if (p.fem) pose.bulk = .92;
  if (lift > 0 || p.act === 'drink') o.prop = wineProp(lift);
  ctx.save(); ctx.translate(P[0], P[1]); ctx.scale(1, sq); ctx.translate(-P[0], -P[1]);
  if (p.kid) kid(ctx, P[0], P[1] + 6 * s, s * 1.0, pose, { ...o, age: 'child', accent: p.dress.shirt });
  else person(ctx, P[0], P[1], s, pose, o);
  ctx.restore();
  return P;
}

// ---------------------------------------------------------------- the world
// S: tableState(); opts: { card (draw fn for the card, gets C), hideYouNear }
export function tableWorld(ctx, t, C, S, opts = {}) {
  const o = C.o;
  ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  const yh = skyAndValley(ctx, t, C);
  if (opts.plate) opts.plate(ctx, t, C);                 // the c10>c11 sky plate (translated with the tilt), drawn over the sky
  if (yh < -H * 2.5) { /* looking far down: no horizon content */ }
  houses(ctx, t, C);
  ground(ctx, t, C);
  // far-away lanterns (beyond the table's far end) before the table
  const headL = LANTERNS.find((L) => L.head), hp = headL ? C.P(headL.p[0], headL.p[1] - headL.drop, headL.p[2]) : [W / 2, 0, 1];
  // depth slices along the table, far → near: bench, people (body), table slice, items, people (front arm)
  const xs = []; for (let x = TB.x1; x < TB.x0; x += .63) xs.push(x); xs.push(TB.x0);
  const nearLantern = (x) => { let best = null, bd = 1e9; for (const L of LANTERNS) { if (L.off || L.p[2] < -2.6 || L.p[2] > 2.6) continue; const d = Math.abs(L.p[0] - x); if (d < bd) { bd = d; best = L; } } return best; };
  for (let i = 0; i < xs.length - 1; i++) {
    const xb = xs[i], xa = xs[i + 1];
    const cxm = (xa + xb) / 2; if (cxm > o.x + .3 && o.pitch > -1.2) continue;
    bench(ctx, C, xa, xb, 1); bench(ctx, C, xa, xb, -1);
    const L = nearLantern(cxm), LP = L ? C.P(L.p[0], L.p[1] - L.drop, L.p[2]) : hp;
    const here = PEOPLE.filter((p) => p.x <= xa && p.x > xb);
    for (const p of here) drawPerson(ctx, t, C, p, S, 'body', LP);
    tableSlice(ctx, C, xa, xb);
    for (const it of ITEMS) if (it.x <= xa && it.x > xb) item(ctx, t, C, it);
    for (const p of here) drawPerson(ctx, t, C, p, S, 'front', LP);
  }
  // the near things in depth order (far → near): lanterns, the wires, the card in its holder, you at the head of the table
  const items = [];
  for (const L of LANTERNS) { if (L.off) continue; const d = C.P(L.p[0], L.p[1] - L.drop, L.p[2])[2]; if (d > .15) items.push([d, () => lantern(ctx, t, C, L)]); }
  for (const Sg of STRINGS) { if (Math.min(Sg.a[0], Sg.b[0]) > o.x + 1) continue; const m = catenary(Sg, .5), d = C.P(m[0], m[1], m[2])[2]; items.push([d, () => wire(ctx, t, C, Sg)]); }
  if (opts.card) items.push([C.P(CARD.x, CARD.y, CARD.z)[2], () => opts.card(ctx, t, C)]);
  const YP = C.P(YOU.x, YOU.seatY + .45, YOU.z);
  if (YP[2] > .35 && !opts.noYou) items.push([YP[2], () => {
    const Y0 = C.P(YOU.x, YOU.seatY, YOU.z), k = C.k(Y0[2]), elv = clamp(Math.atan2(o.y - 1, Math.hypot(o.x - YOU.x, o.z - YOU.z)) / (Math.PI / 2) * 1.25);
    youSeat(ctx, Y0[0], Y0[1], k / 1000, { t, turn: S.youTurn, elev: elv, light: { x: hp[0], y: hp[1], col: '#ffcf8a', a: .9 } });
  }]);
  items.sort((p, q) => q[0] - p[0]);
  for (const [, f] of items) f();
}
