// Film 8 · c09 local places (B3). World geometry in metres through the s8 camera (+Y up), engraved and opaque, one warm light per place.
//   ministry(ctx, t, C, o)    a ministry at night on the shore (facade at Z = 0 facing −Z, steps down to Z = −7): columns, pediment, dim windows,
//                             a tall door (o.door 0..1 open) full of warm light (light plate 'lamp' inside it), men with briefcases and thick
//                             bound reports walking up the steps (o.walk: time base). → { door: [4 screen points] }
//   taiwan(ctx, t, C, o)      Taiwan from high above at night (1 unit = 1 km, sea level Y = 0): dark land, the mountain spine engraved, coast
//                             lights (cities), and the pings: o.ping 0..1 (how many have arrived), o.hot index of the ping we dive into
//                             → { ping(i) world point, hot: world point }
//   PINGS                     the ping list (world km)
//   laptopRoom(ctx, t, C, o)  a lamp-lit room (X right, Z forward, floor Y = 0): a person at a desk from behind, a laptop facing them, a lamp,
//                             a window with the city at night. o.screen(g, t) paints the laptop screen in screen-rect space (1920 × 1080).
//                             → { screen: affine of the screen (1920 × 1080 px → screen) | null }
//   SCREEN                    the laptop screen rect in the world { c: [x, y, z] centre, w (m), tilt (rad back) }
//   bay(ctx, t, C, o)         Ostrom's bay: a moonlit hillside with terraced fields sharing one silver water channel, a farmhouse window, the
//                             shared fishing ground lit in lanes; boats are drawn by the caller. o: { moon 1, lanes 0..1, chan 0..1, win 1 }
//                             → { win: world point of the farmhouse window }
//   moon(ctx, t, C, az, el, a) the moon (a disc with a soft halo, engraved maria) at a sky direction
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projRuns, projPoly, fillPoly, mixHex, hash, eoX, eiX, sio, u01, spline } from './s8_kit.mjs';
import { skyDir } from './s8_sky.mjs';
import { walkerBack } from './s8_people.mjs';
import { figureBack } from './figure.mjs';
import { plate } from './handoff4.mjs';

const line = (ctx, C, pts, col, a, lw) => { for (const run of projRuns(C, pts, .2)) { ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } };

// ---------------------------------------------------------------- the ministry
const MEN = [[-2.6, 0], [.9, 1.6], [-.6, 3.1], [2.4, 4.4]];   // x (m), start delay (s)
export function ministry(ctx, t, C, o = {}) {
  const door = clamp(o.door ?? 1), Wd = 15, Hf = 13.5;
  ctx.save(); ctx.lineJoin = 'round';
  // ground: a dark square in front, the steps (8 risers from Z = −7 to −1)
  fillPoly(ctx, projPoly(C, [[-40, 0, -40], [40, 0, -40], [40, 0, 0], [-40, 0, 0]]), '#0b0a14');
  const lampAt = [0, 2.6, .2], lp = C.P(...lampAt);
  for (let i = 7; i >= 0; i--) {
    const z = -7 + i * .75, y = (i + 1) * .3;
    const top = projPoly(C, [[-9, y, z], [9, y, z], [9, y, z + .75], [-9, y, z + .75]]), rise = projPoly(C, [[-9, y - .3, z], [9, y - .3, z], [9, y, z], [-9, y, z]]);
    if (fillPoly(ctx, rise, mixHex('#1a1622', '#4a3020', .25 + .06 * i))) { ctx.strokeStyle = rgba('#ffb066', .12 + .03 * i); ctx.lineWidth = 1; ctx.stroke(); }
    if (fillPoly(ctx, top, mixHex('#24202c', '#7a5a3a', .2 + .07 * i))) {
      if (lp) { ctx.save(); fillPoly(ctx, top); ctx.clip(); const g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], lp[2] * 9); g.addColorStop(0, rgba('#ffb35c', .5 * door)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }
    }
  }
  // the facade: a stone front lit from below by the door, a pediment, columns
  const fac = projPoly(C, [[-Wd, 2.4, 0], [Wd, 2.4, 0], [Wd, Hf, 0], [-Wd, Hf, 0]]);
  if (fillPoly(ctx, fac, '#15131f')) {
    ctx.save(); fillPoly(ctx, fac); ctx.clip();
    if (lp) { const g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], lp[2] * 12); g.addColorStop(0, rgba('#c08050', .45 * door)); g.addColorStop(1, rgba('#30202a', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    ctx.strokeStyle = rgba('#05040a', .45); ctx.lineWidth = 1; for (let y = 3; y < Hf; y += .7) line(ctx, C, [[-Wd, y, -.01], [Wd, y, -.01]], '#05040a', .35, 1);
    ctx.restore();
  }
  const ped = projPoly(C, [[-Wd - .6, Hf, -.3], [Wd + .6, Hf, -.3], [0, Hf + 4.2, -.3]]); fillPoly(ctx, ped, '#110f19'); ctx.strokeStyle = rgba('#9aa6d8', .35); ctx.lineWidth = 1.2; ctx.stroke();
  line(ctx, C, [[-Wd - .6, Hf, -.35], [Wd + .6, Hf, -.35]], '#9aa6d8', .4, 1.4);
  // windows (high, dim, a few lit cold)
  for (let i = 0; i < 8; i++) { if (i === 3 || i === 4) continue; const x = -Wd + 2 + i * 3.7, w = projPoly(C, [[x - .7, 7, -.02], [x + .7, 7, -.02], [x + .7, 10.8, -.02], [x - .7, 10.8, -.02]]); fillPoly(ctx, w, hash(i * 3.1) > .7 ? '#3a4458' : '#08070e'); }
  // the door: warm light inside (the 'lamp' light plate, so a push into it ends on the plate)
  const dw = 1.5, dh = 4.6, DP = projPoly(C, [[-dw, 2.4, -.03], [dw, 2.4, -.03], [dw, 2.4 + dh, -.03], [-dw, 2.4 + dh, -.03]]);
  if (fillPoly(ctx, DP, '#0a0608')) {
    ctx.save(); fillPoly(ctx, DP); ctx.clip(); plate(ctx, t, 'light', { tone: 'lamp' }); ctx.restore();
    // the two door leaves, opened inward by `door`
    for (const s of [-1, 1]) { const hx = s * dw, open = door * 1.25, lf = projPoly(C, [[hx, 2.4, -.04], [hx - s * dw * Math.cos(open), 2.4, -.04 + dw * Math.sin(open)], [hx - s * dw * Math.cos(open), 2.4 + dh, -.04 + dw * Math.sin(open)], [hx, 2.4 + dh, -.04]]); fillPoly(ctx, lf, '#1a0e0a'); }
  }
  // columns in front of the facade (8), lit on the door side
  for (let i = 0; i < 8; i++) {
    const x = -Wd + 1.4 + i * (2 * Wd - 2.8) / 7; if (Math.abs(x) < 2) continue;
    const r = .55, P = projPoly(C, [[x - r, 2.4, -1.2], [x + r, 2.4, -1.2], [x + r, Hf, -1.2], [x - r, Hf, -1.2]]);
    if (!fillPoly(ctx, P, '#100e18')) continue;
    ctx.save(); fillPoly(ctx, P); ctx.clip(); const a = C.P(x - r, 6, -1.2), b = C.P(x + r, 6, -1.2);
    if (a && b) { const g = ctx.createLinearGradient(a[0], 0, b[0], 0), lit = clamp(1 - Math.abs(x) / Wd); const near = x < 0 ? 1 : 0; g.addColorStop(near, rgba('#d89a5a', .5 * lit * door)); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1 - near, rgba('#7e8ab8', .18)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    ctx.restore();
  }
  // the men with briefcases and thick reports, walking up the steps toward the light (seen from behind)
  const DL = C.P(0, 4.5, 0);
  const men = MEN.map(([x, d]) => { const tt = (o.walk != null ? t - o.walk : 0) - d, zz = -11 + clamp(tt, 0, 99) * 1.1, z = Math.min(-.6, zz), y = clamp((z + 7) / 6, 0, 1) * 2.4; return { x: x * (1 - .5 * clamp((z + 7) / 6)), y, z, ph: tt * 3.4 }; }).sort((a, b) => C.depth(b.x, 0, b.z) - C.depth(a.x, 0, a.z));
  for (const m of men) {
    if (m.z > -.8) continue;
    const p = C.P(m.x, m.y, m.z); if (!p) continue; const h = p[2] * 1.8; if (h > 1000) continue;
    const r = walkerBack(ctx, t, p[0], p[1], h, m.ph, { light: DL ? { x: DL[0], y: DL[1], col: '#ffb35c', a: .9 * door } : null, dress: { coat: '#16151f', pants: '#0d0c14', skin: '#3a2a26', hair: '#0c0a12', bag: '#16151f' } });
    // a briefcase in the right hand and a thick bound report under the left arm
    ctx.fillStyle = '#0a0806'; ctx.fillRect(p[0] + h * .1, p[1] - h * .48, h * .13, h * .1); ctx.strokeStyle = rgba('#ffb066', .4 * door); ctx.lineWidth = 1; ctx.strokeRect(p[0] + h * .1, p[1] - h * .48, h * .13, h * .1);
    ctx.fillStyle = '#e2cfa4'; ctx.fillRect(p[0] - h * .17, p[1] - h * .68, h * .07, h * .12); ctx.fillStyle = '#5a2a20'; ctx.fillRect(p[0] - h * .175, p[1] - h * .68, h * .02, h * .12);
  }
  ctx.restore();
  return { door: DP };
}

// ---------------------------------------------------------------- Taiwan from above (1 unit = 1 km)
const LL = (lon, lat) => [(lon - 121) * 101, (lat - 23.7) * 111];
const ISLAND = [[121.55, 25.3], [121.75, 25.15], [121.95, 25.02], [121.85, 24.6], [121.78, 24.25], [121.6, 24.0], [121.52, 23.5], [121.38, 23.05], [121.2, 22.78], [120.92, 22.35], [120.85, 21.92], [120.72, 22.1], [120.62, 22.45], [120.3, 22.58], [120.16, 22.95], [120.1, 23.3], [120.18, 23.75], [120.32, 24.15], [120.55, 24.5], [120.75, 24.78], [121.02, 25.05], [121.3, 25.22]].map(([a, b]) => LL(a, b));
const CITIES = [[121.52, 25.05, 1], [121.3, 24.99, .6], [120.97, 24.8, .45], [120.68, 24.15, .8], [120.54, 24.08, .35], [120.45, 23.48, .35], [120.2, 23.0, .6], [120.3, 22.63, .85], [121.6, 23.98, .3], [121.14, 22.76, .25], [121.75, 24.75, .25], [120.7, 23.7, .2]].map(([a, b, w]) => [...LL(a, b), w]);
const SPINE = [[121.45, 24.75], [121.3, 24.4], [121.18, 24.0], [121.05, 23.55], [120.95, 23.1], [120.88, 22.65], [120.84, 22.2]].map(([a, b]) => LL(a, b));
const inside = (x, z) => { let c = false; for (let i = 0, j = ISLAND.length - 1; i < ISLAND.length; j = i++) { const [xi, zi] = ISLAND[i], [xj, zj] = ISLAND[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
const CITYDOTS = (() => { const r = prng(2424), a = []; for (const [x, z, w] of CITIES) for (let i = 0; i < 260 * w; i++) { const rr = Math.pow(r(), 1.6) * 14 * Math.sqrt(w), th = r() * TAU, px = x + Math.cos(th) * rr, pz = z + Math.sin(th) * rr * .8; if (inside(px, pz)) a.push([px, pz, .4 + r() * .6]); } for (let i = 0; i < 900; i++) { const px = -110 + r() * 220, pz = -200 + r() * 400; if (inside(px, pz) && r() < .5) a.push([px, pz, .2 + r() * .3]); } return a; })();
export const PINGS = (() => { const r = prng(4747), a = []; while (a.length < 447) { const c = CITIES[Math.floor(r() * CITIES.length)], rr = Math.pow(r(), .8) * 40, th = r() * TAU, px = c[0] + Math.cos(th) * rr, pz = c[1] + Math.sin(th) * rr; if (inside(px, pz)) a.push({ x: px, z: pz, d: r() }); } return a; })();
const RIDGES = (() => { const r = prng(77), a = []; for (let i = 0; i < 160; i++) { const v = r(), k = Math.min(SPINE.length - 2, Math.floor(v * (SPINE.length - 1))), f = v * (SPINE.length - 1) - k, cx = SPINE[k][0] + (SPINE[k + 1][0] - SPINE[k][0]) * f, cz = SPINE[k][1] + (SPINE[k + 1][1] - SPINE[k][1]) * f, side = r() < .5 ? -1 : 1, L = 6 + r() * 22, off = (r() - .2) * 14 * side; a.push([cx + off, cz + (r() - .5) * 6, side, L, r()]); } return a; })();
export function taiwan(ctx, t, C, o = {}) {
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // the island (dark, with a starlit rim on the coast)
  const P = projPoly(C, ISLAND.map(([x, z]) => [x, 0, z]), .5);
  if (fillPoly(ctx, P, '#0e0d1d')) {
    ctx.save(); fillPoly(ctx, P); ctx.clip();
    // relief: the spine lighter (moonlight on the high ground), ridges as engraved strokes falling to both coasts
    for (const [x, z, s, L, k] of RIDGES) { const a = C.P(x, 0, z, .5), b = C.P(x + s * L, 0, z - L * .25, .5); if (!a || !b) continue; ctx.strokeStyle = rgba(k > .5 ? '#3a3a62' : '#05040c', .5); ctx.lineWidth = Math.max(.8, a[2] * .8); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + b[0]) / 2 + (k - .5) * 20, (a[1] + b[1]) / 2, b[0], b[1]); ctx.stroke(); }
    const sp = SPINE.map(([x, z]) => C.P(x, 0, z, .5)).filter(Boolean);
    if (sp.length > 1) { ctx.strokeStyle = rgba('#6a70a0', .35); ctx.lineWidth = Math.max(1.5, sp[0][2] * 3); ctx.beginPath(); spline(ctx, sp.map((p) => [p[0], p[1]]), false); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = rgba('#a4b0dc', .45); ctx.lineWidth = 1.4; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
  }
  // the coast lights (warm, small, the cities)
  ctx.globalCompositeOperation = 'lighter';
  for (const [x, z, b] of CITYDOTS) { const p = C.P(x, 0, z, .5); if (!p || p[0] < -5 || p[0] > 1925 || p[1] < -5 || p[1] > 1085) continue; const tw = .8 + .2 * Math.sin(t * 3 + x * 7 + z); ctx.fillStyle = rgba('#ffb35c', .55 * b * tw); const s = Math.max(1, Math.min(3, p[2] * .9)); ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s); }
  // the pings: cool points that flick on at random, each with a ring that opens and fades… (a ring line, never a fill)
  const pu = clamp(o.ping ?? 0);
  PINGS.forEach((q, i) => {
    const t0 = q.d; if (pu < t0) return;
    const age = (pu - t0) * (o.span ?? 2.4), p = C.P(q.x, 0, q.z, .5); if (!p) return;
    const hot = i === o.hot;
    ctx.fillStyle = rgba('#d8f7ff', .95); ctx.beginPath(); ctx.arc(p[0], p[1], hot ? 2.6 : 1.8, 0, TAU); ctx.fill();
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 9); g.addColorStop(0, rgba('#8fe6ff', .5)); g.addColorStop(1, rgba('#8fe6ff', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, TAU); ctx.fill();
    if (age < .5) { const rr = 4 + 26 * eoX(age / .5); ctx.strokeStyle = rgba('#d8f7ff', .8 * (1 - age / .5)); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, TAU); ctx.stroke(); }
  });
  ctx.restore();
  return { ping: (i) => [PINGS[i].x, 0, PINGS[i].z] };
}

// ---------------------------------------------------------------- the laptop room (a stranger's home, one of the 447)
export const SCREEN = { c: [0, 1.0, .42], w: .34, tilt: .3 };
export function screenCorners() {
  const { c, w, tilt } = SCREEN, h = w * 9 / 16, ct = Math.cos(tilt), st = Math.sin(tilt);
  const up = [0, ct, st], rt = [1, 0, 0];   // the lid leans back: its up vector tilts toward +Z
  const P = (u, v) => [c[0] + rt[0] * u + up[0] * v, c[1] + rt[1] * u + up[1] * v, c[2] + rt[2] * u + up[2] * v];
  return [P(-w / 2, h / 2), P(w / 2, h / 2), P(w / 2, -h / 2), P(-w / 2, -h / 2)];
}
export function laptopRoom(ctx, t, C, o = {}) {
  const lamp = [-.55, 1.05, .55], lp = C.P(...lamp);
  ctx.save(); ctx.lineJoin = 'round';
  const lit = (P, base, a = .5, r = 900) => { if (!fillPoly(ctx, P, base)) return; if (!lp) return; ctx.save(); fillPoly(ctx, P); ctx.clip(); const g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], r * lp[2] / 400); g.addColorStop(0, rgba('#b8784a', a)); g.addColorStop(.4, rgba('#5a3424', a * .5)); g.addColorStop(1, 'rgba(10,8,14,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); };
  // the back wall with a window (the city at night), floor, side wall
  lit(projPoly(C, [[-3, 0, 1.1], [3, 0, 1.1], [3, 2.6, 1.1], [-3, 2.6, 1.1]]), '#0e0b12', .3);
  lit(projPoly(C, [[-3, 0, -3], [3, 0, -3], [3, 0, 1.1], [-3, 0, 1.1]]), '#0d0a0e', .25);
  const win = projPoly(C, [[.25, 1.05, 1.09], [1.45, 1.05, 1.09], [1.45, 2.2, 1.09], [.25, 2.2, 1.09]]);
  if (fillPoly(ctx, win, '#0b1230')) {
    ctx.save(); fillPoly(ctx, win); ctx.clip();
    const a = C.P(.25, 1.05, 1.09), b = C.P(1.45, 2.2, 1.09);
    if (a && b) { const g = ctx.createLinearGradient(0, b[1], 0, a[1]); g.addColorStop(0, '#0a0d26'); g.addColorStop(1, '#1f1c47'); ctx.fillStyle = g; ctx.fillRect(a[0], b[1], b[0] - a[0], a[1] - b[1]); for (let i = 0; i < 60; i++) { const x = a[0] + hash(i) * (b[0] - a[0]), y = a[1] - (b[1] - a[1]) * -1 * (.05 + .45 * hash(i * 2.3)); const tw = .6 + .4 * Math.sin(t * 2 + i); ctx.fillStyle = rgba(hash(i * 5) > .3 ? '#ffb35c' : '#cfe8ff', .7 * tw); ctx.fillRect(x, y, 2, 2); } }
    ctx.restore();
    ctx.strokeStyle = '#05040a'; ctx.lineWidth = 3; ctx.beginPath(); win.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
    const m0 = C.P(.85, 1.05, 1.08), m1 = C.P(.85, 2.2, 1.08); if (m0 && m1) { ctx.beginPath(); ctx.moveTo(m0[0], m0[1]); ctx.lineTo(m1[0], m1[1]); ctx.stroke(); }
  }
  // the desk
  lit(projPoly(C, [[-.9, .74, -.05], [.9, .74, -.05], [.9, .74, .8], [-.9, .74, .8]]), '#2a1a12', .7);
  lit(projPoly(C, [[-.9, .7, -.05], [.9, .7, -.05], [.9, .74, -.05], [-.9, .74, -.05]]), '#1a100c', .5);
  // the laptop: base on the desk, the lid with the screen
  const base = projPoly(C, [[-.17, .745, .22], [.17, .745, .22], [.17, .745, .45], [-.17, .745, .45]]); fillPoly(ctx, base, '#2a2c34');
  const S = screenCorners(), SP = S.map((p) => C.P(...p));
  const lidBack = projPoly(C, S.map((p) => [p[0] * 1.04, p[1], p[2] + .006])); fillPoly(ctx, lidBack, '#1a1c22');
  let aff = null;
  if (SP.every(Boolean)) {
    // affine of the screen rect (1920 × 1080 px → screen) from three corners
    const [p0, p1, , p3] = SP; aff = [(p1[0] - p0[0]) / 1920, (p1[1] - p0[1]) / 1920, (p3[0] - p0[0]) / 1080, (p3[1] - p0[1]) / 1080, p0[0], p0[1]];
    ctx.save(); ctx.beginPath(); SP.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.clip();
    ctx.transform(...aff); if (o.screen) o.screen(ctx, t); ctx.restore();
    // the screen's cool spill on the desk and the person
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const c = SP.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]), R = Math.hypot(SP[1][0] - SP[0][0], SP[1][1] - SP[0][1]) * 1.6; const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); g.addColorStop(0, rgba('#8fb8ff', .12)); g.addColorStop(1, rgba('#8fb8ff', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, TAU); ctx.fill(); ctx.restore();
  }
  // the lamp (a small shaded desk lamp) on the left
  if (lp) {
    const b = C.P(-.55, .745, .55); if (b) { ctx.strokeStyle = '#120c0a'; ctx.lineWidth = Math.max(2, b[2] * .02); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(lp[0], lp[1] + lp[2] * .05); ctx.stroke(); }
    ctx.fillStyle = '#3a2416'; ctx.beginPath(); ctx.moveTo(lp[0] - lp[2] * .12, lp[1] + lp[2] * .04); ctx.lineTo(lp[0] + lp[2] * .12, lp[1] + lp[2] * .04); ctx.lineTo(lp[0] + lp[2] * .07, lp[1] - lp[2] * .1); ctx.lineTo(lp[0] - lp[2] * .07, lp[1] - lp[2] * .1); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(lp[0], lp[1] + lp[2] * .06, 0, lp[0], lp[1] + lp[2] * .06, lp[2] * 1.1); g.addColorStop(0, rgba('#fff1d6', .8)); g.addColorStop(.2, rgba('#ffb35c', .3)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lp[0], lp[1] + lp[2] * .06, lp[2] * 1.1, 0, TAU); ctx.fill(); ctx.restore();
  }
  // the person, seated, from behind (head and shoulders above the chair back)
  if (o.person !== false) {
    const p = C.P(.02, .45, -.32);
    if (p && p[2] * 1.75 / 185 < 5) { const s = p[2] * 1.75 / 185 * 1.0; figureBack(ctx, p[0], p[1] + 0 * s, s, { t, seed: 5, hold: 'none', headTilt: .12, dress: { coat: '#2a3450', pants: '#131427', skin: '#7a4f33', hair: '#1c1420' }, accent: '#2a3450', light: lp ? { x: lp[0], y: lp[1], col: '#ffb066', a: .8 } : undefined, glow: { col: '#8fb8ff', a: .35 } }); }
    const cb = projPoly(C, [[-.24, .45, -.2], [.26, .45, -.2], [.26, .95, -.2], [-.24, .95, -.2]]); fillPoly(ctx, cb, '#0c0810');
  }
  ctx.restore();
  return { screen: aff, corners: SP };
}

// ---------------------------------------------------------------- the moon
export function moon(ctx, t, C, az, el, a = 1) {
  const p = C.D(...skyDir(az, el)); if (!p) return null;
  const R = 26 * C.F / 1400;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(p[0], p[1], R * .8, p[0], p[1], R * 9); g.addColorStop(0, rgba('#c8d4ff', .22 * a)); g.addColorStop(1, rgba('#8090c0', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], R * 9, 0, TAU); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = rgba('#e8ecf4', a); ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba('#a8b0c4', .5 * a); for (const [dx, dy, r] of [[-.3, -.2, .28], [.25, .1, .2], [-.05, .35, .16], [.35, -.35, .12]]) { ctx.beginPath(); ctx.arc(p[0] + dx * R, p[1] + dy * R, r * R, 0, TAU); ctx.fill(); }
  ctx.restore();
  return p;
}

// ---------------------------------------------------------------- Ostrom's bay: terraces sharing one silver channel above a shared fishing ground
// The hillside rises from the shore at Z = SH.z0 (sea toward −Z) to its crest; terraces are contour steps, the channel zigzags down them.
export const SH = { x0: -120, x1: 120, z0: 60 };
const hillY = (x, z) => { const d = z - SH.z0; return d <= 0 ? 0 : Math.min(60, d * .55 + 6 * Math.sin(x * .03) * clamp(d / 30)) * (1 - .25 * Math.pow(Math.abs(x) / 140, 2)); };
export function bay(ctx, t, C, o = {}) {
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const mo = o.moonP;   // screen point of the moon (light from there)
  // the hill as layered terraces (far → near): each terrace a band between two contours, lit silver on its riser
  const TER = 16;
  for (let k = TER; k >= 0; k--) {
    const z = SH.z0 + 4 + k * 7, z2 = z + 7, top = [], bot = [];
    for (let i = 0; i <= 48; i++) { const x = SH.x0 + (SH.x1 - SH.x0) * i / 48, w = 1.2 * Math.sin(x * .05 + k); top.push([x, hillY(x, z2 + w), z2 + w]); bot.push([x, hillY(x, z + w * .8), z + w * .8]); }
    const P = projPoly(C, [...bot, ...top.reverse()], .5);
    fillPoly(ctx, P, mixHex('#12142a', '#2a2e52', .3 + .4 * (k % 2)));
    // the riser edge catches the moon (a thin silver line), the field rows hatch
    for (const run of projRuns(C, bot.map(([x, y, z]) => [x, y + .3, z]), .5)) { ctx.strokeStyle = rgba('#c8d4f8', .5); ctx.lineWidth = 1.4; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  }
  // the crest against the sky
  { const crest = []; for (let i = 0; i <= 60; i++) { const x = SH.x0 - 60 + (SH.x1 - SH.x0 + 120) * i / 60; crest.push([x, 60 + 8 * Math.sin(x * .04) + 4 * Math.sin(x * .13), SH.z0 + 140]); } const P = projPoly(C, [...crest, [SH.x1 + 60, 0, SH.z0 + 140], [SH.x0 - 60, 0, SH.z0 + 140]], .5); fillPoly(ctx, P, '#0a0a18'); for (const run of projRuns(C, crest, .5)) { ctx.strokeStyle = rgba('#a4b0dc', .35); ctx.lineWidth = 1.2; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  // the one silver channel: zigzags down the terraces, feeding each in turn (drawn on progressively with o.chan), moon glints run down it
  const ch = clamp(o.chan ?? 1);
  if (ch > 0) {
    const pts = []; for (let k = TER; k >= 0; k--) { const z = SH.z0 + 4 + k * 7, x = (k % 2 ? -14 : 14) + 3 * Math.sin(k); pts.push([x, hillY(x, z + 3.5) + .4, z + 3.5]); pts.push([-x * .2, hillY(-x * .2, z + .6) + .3, z + .6]); }
    const n = Math.max(2, Math.round(pts.length * ch)), P = pts.slice(0, n);
    ctx.globalCompositeOperation = 'lighter';
    for (const run of projRuns(C, P, .5)) for (const [lw, al, col] of [[7, .1, '#a8c0ff'], [2.2, .7, '#e8f0ff']]) { ctx.strokeStyle = rgba(col, al); ctx.lineWidth = lw; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    for (let i = 0; i < 14; i++) { const v = ((t * .25 + i / 14) % 1) * (n - 1), j = Math.floor(v), f = v - j; if (j + 1 >= n) continue; const a = P[j], b = P[j + 1], p = C.P(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, .5); if (p) { ctx.fillStyle = rgba('#ffffff', .8); ctx.beginPath(); ctx.arc(p[0], p[1], 1.6, 0, TAU); ctx.fill(); } }
    ctx.globalCompositeOperation = 'source-over';
  }
  // a farmhouse on the third terrace with one lit window (your way home)
  const fh = [22, hillY(22, SH.z0 + 25), SH.z0 + 25];
  { const F = (u, v, w) => [fh[0] + u, fh[1] + v, fh[2] + w]; fillPoly(ctx, projPoly(C, [F(-3, 0, 0), F(3, 0, 0), F(3, 3.2, 0), F(0, 5, 0), F(-3, 3.2, 0)]), '#0e0c16'); const W = projPoly(C, [F(-.6, 1.2, -.02), F(.6, 1.2, -.02), F(.6, 2.3, -.02), F(-.6, 2.3, -.02)]); if (fillPoly(ctx, W, '#3a2010')) { ctx.save(); fillPoly(ctx, W); ctx.clip(); plate(ctx, t, 'light', { tone: 'lamp' }); ctx.restore(); const wp = C.P(...F(0, 1.75, -.05)); if (wp) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(wp[0], wp[1], 0, wp[0], wp[1], wp[2] * 4); g.addColorStop(0, rgba('#ffb35c', .35 * (o.win ?? 1))); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(wp[0], wp[1], wp[2] * 4, 0, TAU); ctx.fill(); ctx.restore(); } } }
  // the shared fishing ground: lit lanes on the water, side by side (each a band of lamp light), one boat per lane at a time
  const ln = clamp(o.lanes ?? 1);
  if (ln > 0) { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = -30 + i * 12, pts = []; for (let k = 0; k <= 20; k++) pts.push([x, .04, SH.z0 - 6 - k * 3.2 * ln]); for (const run of projRuns(C, pts, .5)) { ctx.strokeStyle = rgba('#ffb35c', .12); ctx.lineWidth = Math.max(2, run[0][2] * 2.2); ctx.beginPath(); run.forEach((p, j) => (j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.strokeStyle = rgba('#ffd9a0', .3); ctx.lineWidth = 1; ctx.setLineDash([3, 9]); ctx.stroke(); ctx.setLineDash([]); } } ctx.globalCompositeOperation = 'source-over'; }
  ctx.restore();
  return { win: [fh[0], fh[1] + 1.75, fh[2] - .05] };
}
