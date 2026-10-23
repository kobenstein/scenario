// Film 7 · c10 · card III turned: the watchman. Drawing pieces for scenes/sc10.mjs. Pure functions of t, deterministic (prng only). Builder: c10.
//
// THE WORLD is c07's / c11's: the dark table on the empty stage, the dusk sky above it as ONE picture at infinity (the S plane, lib/f7_c10_fork.mjs
// = c07's fork lib), and the ONE Earth hanging in it at SP.C with the ring c06 laid down and the cool line climbing from the hero city (as c11
// draws it). All world pieces below take m = camO(localCam(lens, SP.C)) (Earth-local world units, R = 3000).
//   watchmanAt(g, ang)                 card III's engraving (lib/f7_c09_cards.mjs watchmanImg) with the beam at angle ang (−.12 = the printed one)
//   PATCHES / patches(ctx, t, m, o)    ~44 protected areas (30 by 30): green #5f8f6a engraved blobs on land (solid edge) and sea (dashed edge);
//                                      o.land / o.sea 0..1 (each blob grows out of its spot, staggered), o.a
//   SATS / sats(ctx, t, m, o)          12 small satellites on three tilted orbits; o.t0 (first emerges from behind the Earth), o.eyes 0..1
//                                      (view cones down to the surface), o.side 'back'|'front' (draw the back half before the Earth)
//   beamAt(t, o) / beam(ctx, t, m, o)  the watchman's lighthouse beam from the hero city CURVE.S; tiles(ctx, t, m, o): the satellite image
//                                      tiles it reads (each flashes when the beam passes and stays faintly outlined: read)
//   coolLine / ringOn                  c11's cool line and ring around this Earth (identical calls)
//   insetPrepare() / inset(ctx, t, o)  a satellite image framed on screen, grown out of its tile on the globe: kind 'forest' (scan refresh
//                                      week 1 → week 2 reveals a cleared patch, a soft marker) or 'sea' (a dashed protected zone, a fishing
//                                      fleet steaming into it, a marker)
//   FOREST_TILE / SEA_TILE             world points of the two tiles
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas, text } from '../engine.mjs';
import { F7, EARTH, CURVE, onSphere, curve, ring as kitRing, ease, n1, mod } from './f7_kit.mjs';
import { vnoise, fbm } from './art.mjs';
import { RING_R } from './f7_c10_fork.mjs';

const TAU = Math.PI * 2, R = EARTH.R;
const INK = '#2a2420';
const GREEN = '#5f8f6a', GREEN_L = '#9cc7a4', COOL = '#bfe3ff';

// ================================================================ the kit's land value (copied from lib/f7_kit.mjs, internal there)
const RC = Math.cos(EARTH.tilt), RS = Math.sin(EARTH.tilt);
const latlon = (nx, ny, nz) => [Math.atan2(nx, ny * RS + nz * RC), Math.asin(clamp(ny * RC - nz * RS, -1, 1))];
const gauss = (x, y, cx, cy, r) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r));
const NL = vnoise(101);
export function landAt(x, y) {
  const v = onSphere(x, y); if (!v) return -1;
  const [lon, lat] = latlon(...v);
  let f = fbm(NL, lon * 2.1 + 7.3, lat * 3.0 + 2.2, 5) - .5;
  f += .32 * gauss(x, y, CURVE.S[0], CURVE.S[1], 520) + .12 * gauss(x, y, -600, -2950, 500) - .3 * gauss(x, y, 780, -2860, 420) - .18 * gauss(x, y, 1250, -2700, 380);
  return f;
}
// a small circle on the sphere seen from the front: the radial component shrinks with the surface normal's z
function onDisc(x, y, dx, dy) {
  const v = onSphere(x, y); const z = v ? Math.max(.08, v[2]) : .08, L = Math.hypot(x, y) || 1, ux = x / L, uy = y / L, a = dx * ux + dy * uy;
  return [x + dx + (z - 1) * a * ux, y + dy + (z - 1) * a * uy];
}

// ================================================================ card III's engraving with a moving beam (= watchmanImg at ang −.12)
function hatchRows(g, x0, x1, y0, y1, gap, a, lw = 1.4) { g.strokeStyle = rgba(INK, a); g.lineWidth = lw; g.beginPath(); for (let y = y0; y < y1; y += gap) { g.moveTo(x0, y); g.lineTo(x1, y); } g.stroke(); }
export function watchmanAt(g, ang = -.12) {
  g.fillStyle = '#efe6cf'; g.fillRect(0, 0, W, H);
  hatchRows(g, 0, W, 0, 720, 9, .3, 2.2);
  const bx = 640, by = 330;
  g.save(); g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(ang - .1) * 2000, by + Math.sin(ang - .1) * 2000); g.lineTo(bx + Math.cos(ang + .1) * 2000, by + Math.sin(ang + .1) * 2000); g.closePath();
  g.fillStyle = '#f3ecda'; g.fill(); g.restore();
  const r = prng(77); g.fillStyle = '#f6efdc'; for (let i = 0; i < 60; i++) { const x = r() * W, y = r() * 560; if (Math.abs(Math.atan2(y - by, x - bx) - ang) < .12 && x > bx) continue; g.beginPath(); g.arc(x, y, 2 + r() * 3, 0, TAU); g.fill(); }
  g.fillStyle = '#e6dbbf'; g.fillRect(0, 720, W, 360); g.strokeStyle = rgba(INK, .55); g.lineWidth = 2.4; g.beginPath();
  for (let y = 740; y < 1080; y += 18 + (y - 720) * .05) for (let x = (y * 7) % 90; x < W; x += 70 + (y % 40)) { g.moveTo(x, y); g.quadraticCurveTo(x + 18, y - 6, x + 36, y); } g.stroke();
  g.fillStyle = rgba(INK, .85); g.beginPath(); g.moveTo(1050, 722); for (let x = 1050; x <= 1920; x += 22) g.lineTo(x, 690 - 30 * Math.sin(x * .004) - (x % 44 ? 0 : 26)); g.lineTo(1920, 722); g.closePath(); g.fill();
  g.fillStyle = '#d9cdb0'; g.beginPath(); g.moveTo(330, 1080); g.lineTo(420, 820); g.lineTo(560, 760); g.lineTo(760, 790); g.lineTo(900, 1080); g.closePath(); g.fill(); g.strokeStyle = rgba(INK, .9); g.lineWidth = 4; g.stroke();
  g.save(); g.clip(); g.strokeStyle = rgba(INK, .4); g.lineWidth = 2; g.beginPath(); for (let x = 200; x < 1000; x += 18) { g.moveTo(x, 760); g.lineTo(x - 200, 1080); } g.stroke(); g.restore();
  g.fillStyle = '#efe6cf'; g.beginPath(); g.moveTo(600, 780); g.lineTo(612, 400); g.lineTo(668, 400); g.lineTo(680, 780); g.closePath(); g.fill(); g.strokeStyle = rgba(INK, .95); g.lineWidth = 4; g.stroke();
  g.strokeStyle = rgba(INK, .5); g.lineWidth = 2; g.beginPath(); for (let y = 420; y < 780; y += 14) { g.moveTo(668 - (y - 400) * -.03, y); g.lineTo(680 - (780 - y) * .03 - 2, y); } g.stroke();
  g.fillStyle = rgba(INK, .95); g.fillRect(596, 388, 88, 14); g.fillRect(616, 300, 48, 10);
  g.fillStyle = '#fff6dc'; g.fillRect(620, 310, 40, 78); g.strokeStyle = rgba(INK, .95); g.lineWidth = 3; g.strokeRect(620, 310, 40, 78);
  g.fillStyle = rgba(INK, .95); g.beginPath(); g.moveTo(610, 300); g.lineTo(640, 262); g.lineTo(670, 300); g.closePath(); g.fill();
}

// ================================================================ 30 by 30: the protected areas
export const PATCHES = (() => {
  const r = prng(3030), land = [], sea = [];
  for (let i = 0; i < 6000 && (land.length < 20 || sea.length < 11); i++) {
    const x = (r() * 2 - 1) * R * .86, y = (r() * 2 - 1) * R * .86, v = onSphere(x, y); if (!v || v[2] < .3) continue;
    if (Math.hypot(x - CURVE.S[0], y - CURVE.S[1]) < 420) continue;   // not over the hero city
    const f = landAt(x, y), list = f > .035 ? land : f < -.06 ? sea : null; if (!list || list.length >= (list === land ? 20 : 11)) continue;
    const rr = list === land ? 170 + r() * 260 : 200 + r() * 260;
    if ([...land, ...sea].some((p) => Math.hypot(p.x - x, p.y - y) < (p.r + rr) * .9)) continue;
    list.push({ x, y, r: rr, seed: r() * 100, sea: list === sea });
  }
  // stagger: land from left to right, sea after
  land.sort((a, b) => a.x - b.x); sea.sort((a, b) => a.x - b.x);
  land.forEach((p, i) => { p.u = i / land.length; }); sea.forEach((p, i) => { p.u = i / sea.length; });
  return [...land, ...sea];
})();
function blob(p, k, sc = 1) {
  const pts = [];
  for (let j = 0; j < 26; j++) { const q = j / 26 * TAU, rad = p.r * sc * k * (1 + .42 * n1(p.seed + j * .5) + .2 * Math.sin(q * 2 + p.seed) + .1 * Math.sin(q * 5 + p.seed * 2)); pts.push(onDisc(p.x, p.y, Math.cos(q) * rad, Math.sin(q) * rad)); }
  return pts;
}
const grow = (u, s) => ease.out(clamp(u * 1.6 - s * .6));   // staggered growth: element s in 0..1
export function patches(ctx, t, m, o = {}) {
  const L = o.land ?? 1, S = o.sea ?? 1, A = o.a ?? 1; if ((L <= 0 && S <= 0) || A <= 0) return;
  const lw = Math.max(.7, m.k * 9);
  ctx.save(); ctx.lineJoin = 'round';
  for (const p of PATCHES) {
    const k = grow(p.sea ? S : L, p.u); if (k <= .01) continue;
    const P = blob(p, k).map(([x, y]) => [m.X(x), m.Y(y)]);
    if (P.every(([x, y]) => x < -20 || x > W + 20 || y < -20 || y > H + 20)) continue;
    ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    ctx.fillStyle = rgba(GREEN, (p.sea ? .42 : .6) * A); ctx.fill();
    ctx.strokeStyle = rgba(GREEN_L, .85 * A); ctx.lineWidth = lw; if (p.sea) ctx.setLineDash([lw * 3, lw * 2.4]); ctx.stroke(); ctx.setLineDash([]);
    // an inner contour (engraved)
    if (k > .5) { const Q = blob(p, k, .58).map(([x, y]) => [m.X(x), m.Y(y)]); ctx.beginPath(); Q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.strokeStyle = rgba(GREEN_L, .32 * A); ctx.lineWidth = lw * .7; ctx.stroke(); }
  }
  ctx.restore();
}

// ================================================================ the satellites
const ORB = [{ rx: 1.32, ry: .27, rot: -.3, dir: 1 }, { rx: 1.2, ry: .44, rot: .48, dir: -1 }, { rx: 1.46, ry: .19, rot: .07, dir: 1 }];
export const SATS = (() => { const r = prng(808), o = []; for (let i = 0; i < 12; i++) o.push({ orb: ORB[i % 3], d: ((Math.floor(i / 3) + .5) / 4) * TAU * (.92 + .1 * r()), delay: i * .1 + r() * .05, ph: r() * TAU, w: .16 + .04 * r() }); return o; })();
function satPos(s, t, t0) {
  const ts = t0 + s.delay; if (t < ts) return null;
  const O = s.orb, phi = -Math.PI / 2 + O.dir * (s.d * ease.out(lin(ts, ts + 2.2, t)) + s.w * (t - ts));
  const x0 = O.rx * R * Math.cos(phi), y0 = O.ry * R * Math.sin(phi), c = Math.cos(O.rot), si = Math.sin(O.rot);
  return { x: x0 * c - y0 * si, y: x0 * si + y0 * c, front: Math.sin(phi) > 0, phi };
}
function satSprite(ctx, t, X, Y, s, a, ph, ang) {
  ctx.save(); ctx.translate(X, Y); ctx.rotate(ang); ctx.globalAlpha = a;
  ctx.fillStyle = '#5d7ea6'; ctx.fillRect(-s * 3.2, -s * .55, s * 2.2, s * 1.1); ctx.fillRect(s * 1, -s * .55, s * 2.2, s * 1.1);
  ctx.strokeStyle = 'rgba(200,226,255,.8)'; ctx.lineWidth = Math.max(.6, s * .18); ctx.strokeRect(-s * 3.2, -s * .55, s * 2.2, s * 1.1); ctx.strokeRect(s * 1, -s * .55, s * 2.2, s * 1.1);
  ctx.beginPath(); for (let k = 1; k < 3; k++) { ctx.moveTo(-s * 3.2 + k * s * .73, -s * .55); ctx.lineTo(-s * 3.2 + k * s * .73, s * .55); ctx.moveTo(s + k * s * .73, -s * .55); ctx.lineTo(s + k * s * .73, s * .55); } ctx.stroke();
  ctx.fillStyle = '#f3ecda'; ctx.fillRect(-s * .8, -s * .8, s * 1.6, s * 1.6);
  ctx.globalCompositeOperation = 'lighter'; const tw = .5 + .5 * Math.sin(t * 3.1 + ph);
  ctx.fillStyle = rgba('#eef8ff', .55 * tw); ctx.fillRect(-s * 3.4 * tw, -.5, s * 6.8 * tw, 1); ctx.fillRect(-.5, -s * 2 * tw, 1, s * 4 * tw);
  ctx.restore();
}
export function sats(ctx, t, m, o = {}) {
  const t0 = o.t0 ?? 0, side = o.side ?? 'front', eyes = clamp(o.eyes ?? 0); if (t < t0) return;
  const s = clamp(m.k * 55, 2.2, 8);
  ctx.save();
  for (const st of SATS) {
    const p = satPos(st, t, t0); if (!p || (side === 'front') !== p.front) continue;
    const X = m.X(p.x), Y = m.Y(p.y); if (X < -60 || X > W + 60 || Y < -60 || Y > H + 60) continue;
    // a short trail behind it along the orbit (cool, thin)
    ctx.strokeStyle = rgba(COOL, p.front ? .3 : .16); ctx.lineWidth = 1; ctx.beginPath();
    for (let k = 0; k <= 10; k++) { const q = { ...st, d: 0, w: 0 }, O = st.orb, ph = p.phi - O.dir * k * .028, x0 = O.rx * R * Math.cos(ph), y0 = O.ry * R * Math.sin(ph), c = Math.cos(O.rot), si = Math.sin(O.rot), xx = m.X(x0 * c - y0 * si), yy = m.Y(x0 * si + y0 * c); k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke();
    // eyes: a narrow cone of cool light down to the surface (front satellites only), grown out of the satellite
    if (eyes > 0 && p.front) {
      const L = Math.hypot(p.x, p.y) || 1, tgt = L > R * .92 ? R * .9 / L : .97, qx = mix(p.x, p.x * tgt, ease.out(eyes)), qy = mix(p.y, p.y * tgt, ease.out(eyes));
      const nx = -p.y / L, ny = p.x / L, wd = 140 * ease.out(eyes);
      const a0 = [m.X(qx + nx * wd), m.Y(qy + ny * wd)], a1 = [m.X(qx - nx * wd), m.Y(qy - ny * wd)];
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(X, Y, (a0[0] + a1[0]) / 2, (a0[1] + a1[1]) / 2); g.addColorStop(0, rgba(COOL, .5)); g.addColorStop(1, rgba(COOL, .2));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba('#eef8ff', .75); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
      ctx.restore();
    }
    satSprite(ctx, t, X, Y, s, p.front ? 1 : .62, st.ph, st.orb.rot + .2 * Math.sin(p.phi));
  }
  ctx.restore();
}

// ================================================================ the watchman's beam (a lighthouse at the foot of the cool line) and the tiles it reads
// beam angle (screen/world angle, y down, clockwise) θ(t) = θ0 + ω (t − tw); one turn = P s; the disc lies below S (θ ≈ 0.05π … 0.95π)
export const BEAM = { th0: -Math.PI * .62, P: 2.3, half: .1, L: 2.35 * R };
const omega = TAU / BEAM.P;
export const beamTh = (t, tw) => BEAM.th0 + omega * (t - tw);
export const TILES = (() => {
  const o = [], st = 175, S = CURVE.S;
  for (let y = -R + st / 2; y < R; y += st) for (let x = -R + st / 2; x < R; x += st) {
    const v = onSphere(x, y); if (!v || v[2] < .12) continue;
    const d = Math.hypot(x - S[0], y - S[1]); if (d < 120 || d > BEAM.L * .97) continue;
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => onDisc(x, y, a * st * .42, b * st * .42));
    o.push({ x, y, phi: Math.atan2(y - S[1], x - S[0]), corners });
  }
  return o;
})();
export function beam(ctx, t, m, o = {}) {
  const tw = o.tw ?? 0, len = clamp(o.len ?? 1), br = o.br ?? 1; if (t < tw || len <= 0 || br <= 0) return;
  const S = CURVE.S, sx = m.X(S[0]), sy = m.Y(S[1]), th = beamTh(t, tw), Lp = BEAM.L * m.k * len, hw = BEAM.half;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, Lp);
  g.addColorStop(0, rgba('#eef8ff', .5 * br)); g.addColorStop(.12, rgba(COOL, .3 * br)); g.addColorStop(.5, rgba(COOL, .14 * br)); g.addColorStop(1, rgba(COOL, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.arc(sx, sy, Lp, th - hw, th + hw); ctx.closePath(); ctx.fill();
  const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, Lp); g2.addColorStop(0, rgba('#ffffff', .7 * br)); g2.addColorStop(.6, rgba('#eef8ff', .2 * br)); g2.addColorStop(1, rgba('#eef8ff', 0));
  ctx.strokeStyle = g2; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(th) * Lp, sy + Math.sin(th) * Lp); ctx.stroke();
  // the lamp: a small cool star at the hero city
  const lg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 26); lg.addColorStop(0, rgba('#ffffff', .9 * br * len)); lg.addColorStop(.3, rgba(COOL, .4 * br * len)); lg.addColorStop(1, rgba(COOL, 0));
  ctx.fillStyle = lg; ctx.fillRect(sx - 26, sy - 26, 52, 52);
  ctx.restore();
}
// the tiles: flash when the beam passes, then stay outlined (read). Quantised alpha buckets keep the style changes few.
export function tiles(ctx, t, m, o = {}) {
  const tw = o.tw ?? 0, A = o.a ?? 1; if (t < tw || A <= 0) return;
  const buckets = Array.from({ length: 8 }, () => []);
  for (const q of TILES) {
    const phn = BEAM.th0 + mod(q.phi - BEAM.th0, TAU), tp1 = tw + (phn - BEAM.th0) / omega; if (t < tp1) continue;
    const tp = tp1 + Math.floor((t - tp1) / BEAM.P) * BEAM.P, f = Math.exp(-(t - tp) / .45), a = .1 + .9 * f;
    buckets[Math.min(7, Math.floor(a * 8))].push(q);
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = Math.max(.6, m.k * 6);
  buckets.forEach((L, b) => {
    if (!L.length) return; const a = (b + .5) / 8 * A;
    ctx.beginPath();
    for (const q of L) { q.corners.forEach(([x, y], i) => (i ? ctx.lineTo(m.X(x), m.Y(y)) : ctx.moveTo(m.X(x), m.Y(y)))); ctx.closePath(); }
    if (a > .3) { ctx.fillStyle = rgba(COOL, (a - .3) * .22); ctx.fill(); }
    ctx.strokeStyle = rgba(COOL, a * .55); ctx.stroke();
  });
  ctx.restore();
}

// ================================================================ c11's ring and cool line around this Earth (identical calls, so the Earth is one)
const CL = []; for (let i = 0; i <= 90; i++) { const q = i / 90; CL.push([CURVE.S[0] - 420 * Math.pow(q, 1.6), CURVE.S[1] - 5200 * q, .6 + .4 * Math.min(1, q * 4)]); }
export function ringOn(ctx, t, m) { const w = 46 * m.k + 9; kitRing(ctx, t, { cx: m.X(0), cy: m.Y(0), r: RING_R * m.k - w * .35, w, a: .6, line: 1, seed: 6 }); }
export function coolLine(ctx, t, m, br = .75) { curve(ctx, t, CL.map(([x, y, w]) => [m.X(x), m.Y(y), w]), { tone: 'cool', w: .9, br, glint: 1, seed: 4, tip: false }); }

// ================================================================ the satellite images (insets)
export const IW = 500, IH = 360, DS = 1.26;   // design px; shown at DS (630 × 454)
const pickTile = (fn, x0, x1, y0, y1) => { let best = null; for (const q of TILES) if (q.x > x0 && q.x < x1 && q.y > y0 && q.y < y1 && fn(q) && (!best || fn(q) > fn(best))) best = q; return best; };
export const FOREST_TILE = pickTile((q) => Math.max(0, landAt(q.x, q.y) - .03) * (onSphere(q.x, q.y)[2]), -2300, -700, -1300, 700);
export const SEA_TILE = pickTile((q) => Math.max(0, -landAt(q.x, q.y) - .05) * (onSphere(q.x, q.y)[2]), -2400, -500, -600, 1700);
const IMG = {};
const CLEAR = { x: 290, y: 120, w: 150, h: 104 };
function forestPic(g, cleared) {
  g.fillStyle = '#26402f'; g.fillRect(0, 0, IW, IH);
  const r = prng(515);
  // the crowns, top-down (shadow, crown, light)
  for (let i = 0; i < 3200; i++) {
    const x = r() * IW, y = r() * IH, s = 5 + r() * 6;
    if (cleared && x > CLEAR.x - 4 + 10 * n1(y * .05) && x < CLEAR.x + CLEAR.w + 6 * n1(y * .07 + 3) && y > CLEAR.y - 4 && y < CLEAR.y + CLEAR.h + 4) continue;
    g.fillStyle = 'rgba(14,26,18,.55)'; g.beginPath(); g.arc(x + s * .35, y + s * .45, s, 0, TAU); g.fill();
    g.fillStyle = r() < .5 ? '#3f6b4a' : '#36603f'; g.beginPath(); g.arc(x, y, s, 0, TAU); g.fill();
    g.fillStyle = 'rgba(150,196,150,.35)'; g.beginPath(); g.arc(x - s * .3, y - s * .35, s * .45, 0, TAU); g.fill();
  }
  // the river (teal, with light banks)
  const riv = []; for (let i = 0; i <= 40; i++) { const u = i / 40; riv.push([IW * (1.05 - u * 1.1), IH * (.98 - .5 * u) + 26 * Math.sin(u * 7)]); }
  for (const [lw, c] of [[20, '#b9d6cf'], [14, '#2f6f74']]) { g.strokeStyle = c; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); riv.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
  // the logging road from the left edge
  g.strokeStyle = '#a88d62'; g.lineWidth = 4; g.setLineDash([]); g.beginPath(); g.moveTo(-5, 205); g.bezierCurveTo(90, 190, 180, 215, cleared ? CLEAR.x + 20 : 238, cleared ? 190 : 200); g.stroke();
  if (cleared) {
    // the clearing: bare ochre ground, stumps, tracks, piled logs
    g.fillStyle = '#b39565'; g.beginPath();
    for (let j = 0; j <= 24; j++) { const q = j / 24, side = Math.floor(q * 4), f = (q * 4) % 1, cx = [CLEAR.x + CLEAR.w * f, CLEAR.x + CLEAR.w, CLEAR.x + CLEAR.w * (1 - f), CLEAR.x][side], cy = [CLEAR.y, CLEAR.y + CLEAR.h * f, CLEAR.y + CLEAR.h, CLEAR.y + CLEAR.h * (1 - f)][side]; const x = cx + 6 * n1(j * 1.3), y = cy + 6 * n1(j * 1.7 + 5); j ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.closePath(); g.fill();
    const rr = prng(99); g.fillStyle = '#6b4c2e'; for (let i = 0; i < 70; i++) { g.beginPath(); g.arc(CLEAR.x + 8 + rr() * (CLEAR.w - 16), CLEAR.y + 8 + rr() * (CLEAR.h - 16), 1.6 + rr() * 1.2, 0, TAU); g.fill(); }
    g.strokeStyle = 'rgba(110,80,50,.7)'; g.lineWidth = 1.5; g.beginPath(); for (let k = 0; k < 5; k++) { g.moveTo(CLEAR.x + 12, CLEAR.y + 20 + k * 17); g.bezierCurveTo(CLEAR.x + 60, CLEAR.y + 10 + k * 19, CLEAR.x + 100, CLEAR.y + 30 + k * 15, CLEAR.x + CLEAR.w - 10, CLEAR.y + 18 + k * 18); } g.stroke();
    g.strokeStyle = '#7a5636'; g.lineWidth = 3; g.beginPath(); for (let k = 0; k < 6; k++) { g.moveTo(CLEAR.x + 18, CLEAR.y + CLEAR.h - 14 - k * 4); g.lineTo(CLEAR.x + 58, CLEAR.y + CLEAR.h - 18 - k * 4); } g.stroke();
  }
  // the print: fine diagonal engraving over everything
  g.strokeStyle = 'rgba(0,0,0,.09)'; g.lineWidth = 1; g.beginPath(); for (let k = -IH; k < IW; k += 5) { g.moveTo(k, 0); g.lineTo(k + IH, IH); } g.stroke();
}
const ZONE = [[150, 70], [330, 50], [430, 120], [450, 260], [320, 320], [170, 300], [110, 190]];
function seaPic(g) {
  const gr = g.createLinearGradient(0, 0, IW, IH); gr.addColorStop(0, '#1f5560'); gr.addColorStop(1, '#163c48'); g.fillStyle = gr; g.fillRect(0, 0, IW, IH);
  const r = prng(616); g.strokeStyle = 'rgba(190,226,230,.2)'; g.lineWidth = 1.2; g.beginPath();
  for (let i = 0; i < 520; i++) { const x = r() * IW, y = r() * IH, L = 6 + r() * 10; g.moveTo(x, y); g.quadraticCurveTo(x + L / 2, y - 2, x + L, y); } g.stroke();
  // a coast in the top left corner
  g.fillStyle = '#3f6b4a'; g.beginPath(); g.moveTo(0, 0); g.lineTo(120, 0); for (let i = 0; i <= 20; i++) { const u = i / 20; g.lineTo(120 - 120 * u + 14 * n1(u * 6), 0 + 95 * Math.sin(u * Math.PI / 2) + 10 * n1(u * 5 + 2)); } g.lineTo(0, 0); g.closePath(); g.fill();
  g.strokeStyle = '#d7e6d2'; g.lineWidth = 1.5; g.stroke();
  // the protected zone: a dashed green boundary, a faint green wash
  g.beginPath(); ZONE.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fillStyle = rgba(GREEN, .28); g.fill();
  g.strokeStyle = GREEN_L; g.lineWidth = 2.2; g.setLineDash([9, 6]); g.stroke(); g.setLineDash([]);
  text(g, 'PROTECTED', 196, 104, { size: 13, weight: 600, color: rgba('#dff0e2', .9), spacing: 3 });
  g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 1; g.beginPath(); for (let k = -IH; k < IW; k += 5) { g.moveTo(k, 0); g.lineTo(k + IH, IH); } g.stroke();
}
export async function insetPrepare() {
  const mk = async (fn) => { const [c, g] = canvas(IW * 2, IH * 2); g.scale(2, 2); fn(g); return loadImage(c.toBuffer('image/png')); };
  IMG.f1 = await mk((g) => forestPic(g, false)); IMG.f2 = await mk((g) => forestPic(g, true)); IMG.sea = await mk(seaPic);
}
// the fleet: 7 hulls steaming into the zone from the right
const FLEET = (() => { const r = prng(717), o = []; for (let i = 0; i < 7; i++) o.push({ x0: 520 + r() * 90, y0: 150 + r() * 120, x1: 300 + r() * 70, y1: 175 + r() * 80, ph: r() * TAU }); return o; })();
// inset(ctx, t, { kind, tile [sx, sy] screen, open 0..1, refresh 0..1 (forest scan), mark 0..1, fleet 0..1, x, y (inset top left), label })
export function inset(ctx, t, o) {
  const op = clamp(o.open ?? 0); if (op <= 0) return;
  const [tx, ty] = o.tile, x1 = o.x, y1 = o.y, s = mix(.03, 1, op) * DS, cx = mix(tx, x1 + IW * DS / 2, op), cy = mix(ty, y1 + IH * DS / 2, op);
  const w = IW * s, h = IH * s, x = cx - w / 2, y = cy - h / 2;
  ctx.save();
  // the callout: two thin cool lines from the tile on the globe to the frame's corners, and the tile itself outlined
  ctx.strokeStyle = rgba(COOL, .55); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x + w, y); ctx.moveTo(tx, ty); ctx.lineTo(x + w, y + h); ctx.stroke();
  ctx.strokeStyle = rgba('#eef8ff', .9); ctx.lineWidth = 1.6; ctx.strokeRect(tx - 7, ty - 5, 14, 10);
  // the frame (cream mount) and the picture
  ctx.fillStyle = 'rgba(4,6,16,.5)'; ctx.fillRect(x + 6 * s, y + 10 * s, w, h);
  ctx.fillStyle = '#f3ecda'; ctx.fillRect(x - 7 * s, y - 7 * s, w + 14 * s, h + 14 * s);
  if (o.kind === 'forest') {
    const sy = IH * clamp(o.refresh ?? 0), k = h / IH;
    if (sy > 0) ctx.drawImage(IMG.f2, 0, 0, IW * 2, sy * 2, x, y, w, sy * k);
    if (sy < IH) ctx.drawImage(IMG.f1, 0, sy * 2, IW * 2, (IH - sy) * 2, x, y + sy * k, w, (IH - sy) * k);
    if (sy > 0 && sy < IH) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const yy = y + sy * k; const g = ctx.createLinearGradient(0, yy - 16 * k, 0, yy + 3); g.addColorStop(0, rgba(COOL, 0)); g.addColorStop(1, rgba(COOL, .5)); ctx.fillStyle = g; ctx.fillRect(x, yy - 16 * k, w, 16 * k + 3); ctx.fillStyle = rgba('#eef8ff', .9); ctx.fillRect(x, yy - 1, w, 2); ctx.restore(); }
  } else {
    ctx.drawImage(IMG.sea, x, y, w, h);
    const fu = clamp(o.fleet ?? 0), k = w / IW;
    for (const b of FLEET) {
      const u = ease.io(fu), bx = mix(b.x0, b.x1, u) + 3 * Math.sin(t * .9 + b.ph), by = mix(b.y0, b.y1, u) + 2 * Math.sin(t * .7 + b.ph), ang = Math.atan2(b.y1 - b.y0, b.x1 - b.x0);
      if (bx > IW - 4) continue;
      const X = x + bx * k, Y = y + by * k;
      ctx.save(); ctx.translate(X, Y); ctx.rotate(ang);
      ctx.strokeStyle = 'rgba(230,244,244,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-26 * k, -7 * k); ctx.lineTo(-4 * k, 0); ctx.lineTo(-26 * k, 7 * k); ctx.stroke();
      ctx.fillStyle = '#ffb35c'; ctx.beginPath(); ctx.ellipse(0, 0, 7 * k, 2.6 * k, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff1d6'; ctx.fillRect(-1.5 * k, -1 * k, 3 * k, 2 * k);
      ctx.restore();
    }
  }
  ctx.strokeStyle = rgba(INK, .55); ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
  // the soft marker (draw-on ring, then a slow breath)
  const mk = clamp(o.mark ?? 0);
  if (mk > 0) {
    const [mx, my, mr] = o.kind === 'forest' ? [CLEAR.x + CLEAR.w / 2, CLEAR.y + CLEAR.h / 2, 112] : [355, 215, 100];
    const k = w / IW, X = x + mx * k, Y = y + my * k, rr = mr * k * (1 + .035 * Math.sin(t * 2.4)), e = ease.out(mk);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const [lw, al] of [[10, .12], [4, .3], [1.6, .95]]) { ctx.strokeStyle = rgba(lw < 2 ? '#eef8ff' : COOL, al); ctx.lineWidth = lw * k; ctx.beginPath(); ctx.arc(X, Y, rr, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(e, .9995)); ctx.stroke(); }
    ctx.restore();
  }
  // the tag (week / zone): Inter caps on a dark chip, top left inside the frame
  if (o.label && op > .9) {   // mask reveal (left to right) once the frame has landed
    const e = ease.out(clamp((op - .9) * 10)); ctx.font = '600 16px "Inter"'; const tw = ctx.measureText(o.label).width + o.label.length * 2.5 + 18;
    ctx.save(); ctx.beginPath(); ctx.rect(x + 10, y + 10, tw * e, 30); ctx.clip();
    ctx.fillStyle = 'rgba(10,14,28,.72)'; ctx.fillRect(x + 10, y + 10, tw, 30); text(ctx, o.label, x + 19, y + 31, { size: 16, weight: 600, color: rgba('#eef2ff', .95), spacing: 2.5 }); ctx.restore(); }
  ctx.restore();
}
