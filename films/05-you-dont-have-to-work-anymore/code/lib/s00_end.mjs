// s00_end.mjs · chapter 08 "The open question": the dawn sky with the "if", the empty bedroom at dawn, the harbour
// with the dark next bay, the dawn sea world (curving coastline with towns, the sun, the unbuilt pier), the many
// bedrooms, and the end card. Uses the shared world in s00_world.mjs.
// Copied (not imported) from lib/s01_kit.mjs so chapter 01 can change freely: spot() glow sprites, the figure sprite
// cache fig()/lerpPose(), and the light-thread "if" (IF + drawIf → drawIfThread), so 8.01 draws the same "if" as G1.
import { createCanvas } from '@napi-rs/canvas';
import {
  W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, prng, drift, addGlow, layer, stipple, roughPath, roughPoly, hatch, strokes, fog, vnoise, fbm,
  mixHex, shade, person, K, quart, bell, hash, once, scratch, camApply, toScreen, lay, bake, breathe, fin, stripeQuad, motes, skyFill, starField, strata,
  harbour, drawHarbour, WIN, bedroom, curtain, stip, text,
} from './s00_world.mjs';

// ================================================================= copied from s01_kit.mjs (glow sprites, figure cache, the "if")
const GS = new Map();
function glowSprite(col, core) {
  const k = col + core; if (GS.has(k)) return GS.get(k);
  const c = createCanvas(128, 128), g = c.getContext('2d'), rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(.16, rgba(col, .62)); rg.addColorStop(.45, rgba(col, .18)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.fillRect(0, 0, 128, 128); GS.set(k, c); return c;
}
function grainSprite(col, core, seed = 1) {
  const k = 'g' + col + core + seed; if (GS.has(k)) return GS.get(k);
  const [c, g] = layer(256, 256), rg = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(.12, rgba(col, .7)); rg.addColorStop(.4, rgba(col, .22)); rg.addColorStop(1, rgba(col, 0));
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256); stipple(c, { k: .7, g: 1.2, seed }); GS.set(k, c); return c;
}
export function spot(ctx, x, y, r, a, col = K.amber, core = '#fff1d6', { grain = false, sy = 1 } = {}) {
  if (r <= 0 || a <= 0.003 || r > 4000 || x < -r || x > W + r || y < -r * sy || y > H + r * sy) return;
  const s = grain ? grainSprite(col, core) : glowSprite(col, core);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a);
  ctx.drawImage(s, x - r, y - r * sy, 2 * r, 2 * r * sy); ctx.restore();
}
const FIG = new Map(); let FIGB = 0; const FIGMAX = 120e6;
const qz = (v, s = .02) => Math.round(v / s) * s;
export function fig(ctx, x, y, s, pose, o = {}) {
  const P = {}; for (const [k, v] of Object.entries(pose)) P[k] = Array.isArray(v) ? v.map((u) => qz(u)) : typeof v === 'number' ? qz(v) : v;
  const sq = Math.pow(2, Math.round(Math.log2(s) * 8) / 8), ld = o.light ? Math.round(Math.atan2(o.light.y - y, o.light.x - x) * 4) / 4 : 0;
  const key = JSON.stringify([P, sq, o.key || '', ld, !!o.flip]);
  let e = FIG.get(key);
  if (!e) {
    const pad = Math.ceil(220 * sq) + 6, c = createCanvas(pad * 2, pad * 2), g = c.getContext('2d');
    const oo = { ...o }; if (o.light) oo.light = { ...o.light, x: pad + Math.cos(ld) * 500, y: pad + Math.sin(ld) * 500 };
    const r = person(g, pad, pad, sq, P, oo);
    e = { c, pad, hands: [r.hand(0), r.hand(1)].map(([hx, hy]) => [hx - pad, hy - pad]) };
    e.b = c.width * c.height * 4; FIG.set(key, e); FIGB += e.b;
    while (FIGB > FIGMAX && FIG.size > 1) { const k0 = FIG.keys().next().value; FIGB -= FIG.get(k0).b; FIG.delete(k0); }
  } else { FIG.delete(key); FIG.set(key, e); }
  const k = s / sq;
  if (o.alpha !== undefined) { ctx.save(); ctx.globalAlpha = o.alpha; }
  ctx.drawImage(e.c, x - e.pad * k, y - e.pad * k, e.c.width * k, e.c.height * k);
  if (o.alpha !== undefined) ctx.restore();
  return { hand: (i) => [x + e.hands[i][0] * k, y + e.hands[i][1] * k], feetY: y + 88 * s };
}
export const lerpPose = (A, B, u) => { const o = { ...A }; for (const k of Object.keys(B)) { const a = A[k] ?? B[k], b = B[k]; o[k] = Array.isArray(b) ? b.map((v, i) => mix(a[i], v, u)) : typeof b === 'number' ? mix(a, b, u) : (u < .5 ? a : b); } return o; };
function bez(p0, p1, p2, p3, n = 24) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return o; }
const cat = (...a) => a.reduce((o, s) => o.concat(o.length ? s.slice(1) : s), []);
const IF = (() => {
  const i = cat(bez([-.52, -.16], [-.47, -.24], [-.42, -.3], [-.38, -.32]), bez([-.38, -.32], [-.42, -.12], [-.5, .1], [-.5, .2]), bez([-.5, .2], [-.5, .3], [-.41, .29], [-.33, .2]));
  const f = cat(bez([.5, -.6], [.54, -.86], [.3, -1.0], [.14, -.78]), bez([.13, -.76], [.07, -.56], [.03, -.26], [-.03, .08]), bez([-.03, .08], [-.09, .42], [-.15, .64], [-.28, .66]), bez([-.28, .66], [-.39, .66], [-.39, .55], [-.31, .51]));
  const bar = bez([-.15, -.3], [-.02, -.33], [.16, -.34], [.32, -.31], 12);
  const segs = [i, f, bar], len = segs.map((s) => { let L = 0; for (let k = 1; k < s.length; k++) L += Math.hypot(s[k][0] - s[k - 1][0], s[k][1] - s[k - 1][1]); return L; });
  return { segs, len, total: len.reduce((a, b) => a + b), dot: [-.33, -.52] };
})();
export function drawIfThread(ctx, cx, cy, sc, u, a = 1, { t = 0, dotA = 1, width = 1, hot = 1, glowK = 1 } = {}) {
  if (a <= 0) return;
  let left = u * IF.total; const n0 = vnoise(4);
  const lw = Math.max(1.5, sc * .011) * width;
  const pts = [];
  for (let s = 0; s < IF.segs.length; s++) {
    const seg = IF.segs[s], L = IF.len[s]; if (left <= 0) break;
    const frac = Math.min(1, left / L); left -= L;
    const n = Math.max(2, Math.ceil(seg.length * frac)); const P = seg.slice(0, n).map(([x, y], k) => [cx + x * sc + (n0(k * .3 + s * 9, t * .7) - .5) * sc * .004, cy + y * sc + (n0(k * .3 + s * 9 + 40, t * .7) - .5) * sc * .004]);
    pts.push(P);
  }
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = (P) => { ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (const p of P) ctx.lineTo(p[0], p[1]); };
  ctx.globalCompositeOperation = 'lighter';
  for (const [w, al] of [[lw * 9, .05], [lw * 4.5, .12], [lw * 2.2, .22]]) { ctx.strokeStyle = rgba(K.amber, al * a * glowK); ctx.lineWidth = w; for (const P of pts) path(P), ctx.stroke(); }
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = rgba('#fff3dc', a); ctx.lineWidth = lw; for (const P of pts) path(P), ctx.stroke();
  ctx.restore();
  if (u > 0 && u < 1 && pts.length) { const P = pts[pts.length - 1], p = P[P.length - 1]; spot(ctx, p[0], p[1], sc * .09, .9 * a * hot, K.amber, '#fff6e2'); }
  if (dotA > 0) { const [dx, dy] = [cx + IF.dot[0] * sc, cy + IF.dot[1] * sc]; spot(ctx, dx, dy, sc * .16, .7 * a * dotA, K.amber, '#fff6e2', { grain: true }); ctx.fillStyle = rgba('#fff6e2', a * dotA); ctx.beginPath(); ctx.arc(dx, dy, lw * 1.9, 0, 7); ctx.fill(); }
}

// ================================================================= 8.01 the dawn sky over the harbour, the "if" breathes
export const EXT = 3400;
const UPPER = () => once('e:upper', () => bake(-400, -1700, W + 800 + EXT, 1360, (g, c) => {
  skyFill(g, [[0, '#060824'], [.55, '#141848'], [1, '#2a2c6a']], -400, -1700, W + 800 + EXT, 1360);
  starField(g, -400, -1700, W + 800 + EXT, 1200, 1500, 11, .9);
  strata(g, [[-700, -200, 1200, 10], [-560, 900, 2600, 14], [-420, 200, 1500, 9]], { fill: '#3a2f6e', fa: .45, line: '#8a6aa8', la: .3, seed: 6 });
  stip(c, { k: .45, g: 1.1, seed: 13 });
}, .5));
const IFW = [960, -260];
export const A_TILT = [720, 400];
export function skyIf(tm) { // { t0, ifW, b }  b = shot end (s.b)
  return (ctx, t, s) => {
    const u = lin(tm.t0 - .2, s.b, t), tilt = mix(A_TILT[0], A_TILT[1], eio(u));
    const cam = { x: 960 + drift(t, 8, 3), y: 540, z: 1, sx: 960, sy: 540 + tilt };
    ctx.fillStyle = '#060824'; ctx.fillRect(0, 0, W, H);
    lay(ctx, UPPER(), cam, .04);
    drawHarbour(ctx, t, cam, 'dawn', { ext: EXT });
    // the night of chapter 07 lifts: dawn rises from the bottom edge
    const nv = 1 - sm(lin(tm.t0 - .4, tm.t0 + 3.2, t));
    if (nv > 0) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgba('#01020c', .92 * nv)); g.addColorStop(.6, rgba('#060930', .8 * nv)); g.addColorStop(.88, rgba('#121850', .45 * nv)); g.addColorStop(1, rgba('#1a1c4a', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    const [ix, iy] = toScreen(cam, .04, IFW[0], IFW[1]);
    const br = bell(t, tm.ifW + .25, .4);
    drawIfThread(ctx, ix, iy, 250 * (1 + .05 * br), eio(lin(tm.ifW - .9, tm.ifW + .3, t)), .55 + .4 * br, { t, dotA: .25 + .6 * sm(lin(tm.ifW, tm.ifW + .6, t)), glowK: 1 + 1.6 * br, hot: .8 });
    fin(ctx, { vig: .32 });
  };
}

// ================================================================= 8.02 the bedroom at dawn, the bed empty, the window open; push through
const WC = [WIN.x + WIN.w / 2, WIN.y + WIN.h / 2];
export const OUT = { x: WC[0], y: WC[1], depth: W / WIN.w };
export function roomDawn(tm) { // { t0, push0, push1, ifEnd }
  return (ctx, t, s) => {
    const B = bedroom('dawn'), b = breathe(t, .7, 2);
    const zs = 1 + .14 * eio(lin(tm.t0 - .3, tm.push0 + .2, t));
    const e = quart(lin(tm.push0, tm.push1, t));
    const zv0 = zs / OUT.depth, zv = mix(zv0, 1, e);
    const rz = zs * Math.pow(zv / zv0, 1.5);
    const sx = mix(WC[0], W / 2, e) + b.dx * (1 - e), sy = mix(WC[1], H / 2, e) + b.dy * (1 - e);
    // the view out of the window: the same sky + harbour as 8.01, scaled into the window
    const hsy = sy + A_TILT[1] * zv * (1 - e);
    const hcam = { x: 960, y: 540, z: zv, sx, sy: hsy };
    ctx.fillStyle = '#060824'; ctx.fillRect(0, 0, W, H);
    lay(ctx, UPPER(), hcam, 1); lay(ctx, harbour('dawn', EXT).sky, hcam, 1);
    drawHarbour(ctx, t, hcam, 'dawn', { ext: EXT, noSky: true });
    const ia = sm(lin(tm.t0 + .1, tm.t0 + .45, t)) * (1 - sm(lin(tm.t0 + .6, tm.ifEnd, t)));
    if (ia > 0) drawIfThread(ctx, sx, hsy + (IFW[1] - 540) * zv, 250 * zv, 1, .55 * ia, { t, dotA: .85 * ia, glowK: 1, width: 1 });
    // the room
    const rcam = { x: WC[0], y: WC[1], z: rz, sx, sy };
    const roomA = 1 - sm(lin(.84, .97, e));
    if (roomA > 0) {
      ctx.save(); ctx.globalAlpha = roomA;
      lay(ctx, B.room, rcam, 1); lay(ctx, B.patch, rcam, 1, { op: 'lighter', a: .75 + .15 * Math.sin(t * .7) });
      ctx.save(); camApply(ctx, rcam, 1);
      curtain(ctx, t, { a: .2, col: '#ffe6cc' });
      // the morning stripe across the empty bed
      stripeQuad(ctx, [1030, 640], [180, 830], [1080, 700], .32 * (1 + .08 * Math.sin(t * .9)));
      motes(ctx, t, 110, [300, 300, 1400, 700], { seed: 21, col: '#ffe0c0', a: .7, inFn: (x, y) => clamp(1 - Math.abs(y - mix(500, 820, (1400 - x) / 1100)) / 220) });
      ctx.restore(); ctx.restore();
    }
    const sp = quart(lin(tm.push0, tm.push1, t + 1 / 60)) - quart(lin(tm.push0, tm.push1, t - 1 / 60));
    if (sp > .015) { const [c2, g2] = scratch('smear'); g2.drawImage(ctx.canvas, 0, 0); ctx.save(); ctx.globalAlpha = Math.min(.4, sp * 5); ctx.translate(sx, sy); ctx.scale(1.035, 1.035); ctx.translate(-sx, -sy); ctx.drawImage(c2, 0, 0); ctx.restore(); }
    fin(ctx, { vig: .3 });
  };
}

// ================================================================= 8.03 the harbour front lit; truck along the coast to the dark next bay
export function harbourTruck(tm) { // { t0, shared, b }
  return (ctx, t, s) => {
    const b = breathe(t, .6, 5);
    const k1 = eio(lin(tm.t0 + .15, tm.shared + .15, t)), k2 = ein(lin(tm.shared + .3, s.b, t));
    const cam = { x: mix(960, 5800, k1) + 1500 * k2 + b.dx, y: 540 + b.dy, z: 1 + .05 * k1, sx: 960, sy: 540 };
    ctx.fillStyle = '#060824'; ctx.fillRect(0, 0, W, H);
    lay(ctx, UPPER(), cam, .04);
    drawHarbour(ctx, t, cam, 'dawn', { ext: EXT });
    // speed smear on the fast exit
    const v = k2 * k2;
    if (v > .05) { const [c2, g2] = scratch('smear'); g2.drawImage(ctx.canvas, 0, 0); ctx.save(); for (let i = 1; i <= 3; i++) { ctx.globalAlpha = .22 * v; ctx.drawImage(c2, -i * 26 * v, 0); } ctx.restore(); }
    fin(ctx, { vig: .3 });
  };
}

// ================================================================= THE DAWN SEA WORLD (8.04 – END)
// World units ≈ cm. Sea plane Y = 0, the pier runs along +Z from our shore toward the sun (azimuth 0).
// cam = { x, y, z, yaw, pitch, f }
export function proj(c, X, Y, Z) {
  const dx = X - c.x, dy = Y - c.y, dz = Z - c.z, cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
  const x1 = dx * cy - dz * sy, z1 = dx * sy + dz * cy, cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  const y2 = dy * cp - z1 * sp, z2 = dy * sp + z1 * cp;
  return [W / 2 + x1 * c.f / z2, H / 2 - y2 * c.f / z2, z2];
}
const projDir = (c, az, el) => proj({ ...c, x: 0, y: 0, z: 0 }, Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
const horizonY = (c) => H / 2 + c.f * Math.tan(c.pitch);
// unproject a screen point onto the plane X = x0
function unprojX(c, sx, sy, x0) {
  const cy = Math.cos(c.yaw), syw = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  const x1 = (sx - W / 2) / c.f, y2 = -(sy - H / 2) / c.f, z2 = 1;
  const dy = y2 * cp + z2 * sp, z1 = -y2 * sp + z2 * cp;
  const dx = x1 * cy + z1 * syw, dz = -x1 * syw + z1 * cy;
  const k = (x0 - c.x) / (dx || 1e-6); return [x0, c.y + dy * k, c.z + dz * k];
}
// the long curving coastline (to the right, curving out to the horizon)
export const coast = (s) => [1800 + 74000 * Math.sin(1.25 * s) + 2600 * Math.sin(s * 40) * (1 - .7 * s), -1500 + 390000 * Math.pow(s, 1.7)];
const ridgeH = (() => { const n = vnoise(77); return (s) => 900 + 5200 * fbm(n, s * 9, 3.1, 3) * (.4 + s * .9); })();
const inland = (s) => 9000 + 60000 * s;
// far coast on the left horizon (headlands and islands)
const FARL = [[-300000, 300000, 2600], [-215000, 360000, 3800], [-120000, 420000, 2400], [-60000, 440000, 1500]];
// towns: s along the coast (or far-left index), type, lit share of windows (most towns stay dark: "some lit, many dark")
const TOWNS = [
  { s: .012, type: 'harbour', lit: .9, ours: 1 }, { s: .05, type: 'stilts', lit: 0 }, { s: .095, type: 'domes', lit: .35 }, { s: .15, type: 'towers', lit: 0 },
  { s: .21, type: 'cluster', lit: 0 }, { s: .28, type: 'flat', lit: .4 }, { s: .36, type: 'cluster', lit: 0, few: 1 }, { s: .45, type: 'towers', lit: .3 },
  { s: .54, type: 'domes', lit: 0 }, { s: .64, type: 'flat', lit: 0 }, { s: .75, type: 'cluster', lit: .35 }, { s: .87, type: 'stilts', lit: 0 }, { s: .97, type: 'towers', lit: 0 },
  { far: 0, type: 'flat', lit: 0 }, { far: 1, type: 'cluster', lit: .3 }, { far: 2, type: 'domes', lit: 0 }, { far: 3, type: 'towers', lit: 0 },
];
const townGeo = (T, i) => once('town' + i, () => {
  const r = prng(100 + i), houses = [];
  let ax, az, tx, tz, nx, nz;
  if (T.far != null) { const F = FARL[T.far]; ax = F[0] + 9000; az = F[1] - 9000; tx = 1; tz = 0; nx = 0; nz = 1; }
  else { const [x0, z0] = coast(T.s - .004), [x1, z1] = coast(T.s + .004), L = Math.hypot(x1 - x0, z1 - z0); tx = (x1 - x0) / L; tz = (z1 - z0) / L; nx = tz; nz = -tx; if (nx < 0) { nx = -nx; nz = -nz; } [ax, az] = coast(T.s); }
  const n = T.ours ? 34 : 18 + Math.floor(r() * 14), spread = T.ours ? 7000 : 3000 + r() * 2500;
  for (let k = 0; k < n; k++) {
    const along = (r() - .5) * 2 * spread * (T.type === 'towers' ? .6 : 1), up = Math.pow(r(), 1.4);
    const x = ax + tx * along + nx * (300 + up * 4000), z = az + tz * along + nz * (300 + up * 4000), y = T.type === 'stilts' ? 120 : up * 1600;
    let w = 700 + r() * 700, h = 500 + r() * 600, roof = 'pitch';
    if (T.type === 'towers' && r() < .7) { w = 900 + r() * 600; h = 1800 + r() * 3200; roof = 'flat'; }
    if (T.type === 'flat') { roof = 'flat'; h = 450 + r() * 500; w = 800 + r() * 900; }
    if (T.type === 'domes' && r() < .45) roof = 'dome';
    if (T.type === 'stilts') { h = 380 + r() * 300; roof = r() < .5 ? 'pitch' : 'flat'; }
    const wins = []; const nw = Math.max(1, Math.round(w / 300)), nh = Math.max(1, Math.round(h / 330));
    for (let a = 0; a < nw; a++) for (let b = 0; b < nh; b++) wins.push({ u: (a + .5) / nw, v: (b + .45) / nh, lit: r() < T.lit * 1.25, ph: r() });
    houses.push({ x, y, z, w, h, roof, wins, col: r() });
  }
  houses.sort((p, q) => q.z - p.z);
  return { houses, anchor: [ax + nx * 1500, az + nz * 1500] };
});
// sky + sea textures (baked once; per frame only placed by the horizon and the yaw)
const SKYT = () => once('e:skyT', () => {
  const w = 4400, h = 2600, hr = 2000, [c, g] = layer(w / 2, h / 2); g.scale(.5, .5);
  const lg = g.createLinearGradient(0, 0, 0, hr); lg.addColorStop(0, '#141640'); lg.addColorStop(.35, '#3a3270'); lg.addColorStop(.6, '#7a5490'); lg.addColorStop(.78, '#d4889a'); lg.addColorStop(.9, '#f6ae8c'); lg.addColorStop(.97, '#ffd29c'); lg.addColorStop(1, '#ffe2b4');
  g.fillStyle = lg; g.fillRect(0, 0, w, hr); g.fillStyle = '#ffe2b4'; g.fillRect(0, hr, w, h - hr);
  // the warm dome around the sun (azimuth 0 = texture centre)
  const rg = g.createRadialGradient(w / 2, hr, 0, w / 2, hr, 1500); rg.addColorStop(0, rgba('#fff0cc', .85)); rg.addColorStop(.2, rgba(K.gold, .45)); rg.addColorStop(.55, rgba(K.coral, .16)); rg.addColorStop(1, rgba(K.coral, 0)); g.fillStyle = rg; g.fillRect(0, 0, w, h);
  starField(g, 0, 0, w, 900, 700, 17, .8);
  strata(g, [[hr - 300, 300, 1900, 18], [hr - 230, 2300, 4100, 24], [hr - 160, 900, 2200, 12], [hr - 120, 2700, 3700, 10], [hr - 470, 1400, 3200, 10], [hr - 380, 0, 1100, 12]], { fill: '#f09a8c', fa: .5, line: '#ffe2c4', la: .5, seed: 8 });
  stip(c, { k: .5, g: 1.15, seed: 19 });
  return { c, w, h, hr };
});
const SEAT = () => once('e:seaT', () => {
  const w = 4400, h = 1600, [c, g] = layer(w / 2, h / 2); g.scale(.5, .5);
  const lg = g.createLinearGradient(0, 0, 0, h); lg.addColorStop(0, '#f2b89c'); lg.addColorStop(.03, '#d89a9c'); lg.addColorStop(.12, '#9a6e9a'); lg.addColorStop(.35, '#4e3c7a'); lg.addColorStop(.7, '#2a2460'); lg.addColorStop(1, '#1a1844');
  g.fillStyle = lg; g.fillRect(0, 0, w, h);
  // the sky's warm reflection under the sun
  const rg = g.createRadialGradient(w / 2, 0, 0, w / 2, 0, 900); rg.addColorStop(0, rgba('#ffd8a8', .55)); rg.addColorStop(1, rgba('#ffd8a8', 0)); g.save(); g.scale(1, .5); g.fillStyle = rg; g.fillRect(0, 0, w, 2 * h); g.restore();
  // ripple lines, denser near the horizon
  const r = prng(23); g.lineWidth = 1.2;
  for (let i = 0; i < 900; i++) { const v = Math.pow(r(), 2.2), y = 4 + v * h, x = r() * w, len = 20 + v * 260; g.strokeStyle = rgba(r() < .5 ? '#1a1640' : '#ffd8c0', (.1 + .2 * r()) * (1 - v * .4)); g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y + (r() - .5) * 2); g.stroke(); }
  stip(c, { k: .55, g: 1.15, seed: 29 });
  return { c, w, h };
});
const HAZE = () => once('e:haze', () => { const [c, g] = layer(1100, 200); const rg = g.createRadialGradient(550, 100, 0, 550, 100, 550); rg.addColorStop(0, rgba('#ffd6c0', .5)); rg.addColorStop(1, rgba('#ffd6c0', 0)); g.save(); g.scale(1, 200 / 1100); g.fillStyle = rg; g.fillRect(0, 0, 1100, 1100); g.restore(); stip(c, { k: .6, seed: 4 }); return c; });

// draw a quad from 4 projected points (skip if any point is behind the camera)
function quad(ctx, P, fill) { for (const p of P) if (p[2] < 20) return false; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } return true; }
// a plank / box across the pier: x0..x1, y0..y1, z0..z1
function box(ctx, c, x0, x1, y0, y1, z0, z1, top, front, side) {
  const p = (x, y, z) => proj(c, x, y, z);
  quad(ctx, [p(x0, y1, z0), p(x1, y1, z0), p(x1, y1, z1), p(x0, y1, z1)], top);
  quad(ctx, [p(x0, y0, z0), p(x1, y0, z0), p(x1, y1, z0), p(x0, y1, z0)], front);
  if (side) { const xs = c.x > x1 ? x1 : c.x < x0 ? x0 : null; if (xs != null) quad(ctx, [p(xs, y0, z0), p(xs, y0, z1), p(xs, y1, z1), p(xs, y1, z0)], side); }
}
export const PIER = { deck: 60, half: 110, plank: 30, gap: 4, start: -4000, step: 300, posts: 46000 };

// o: { sunEl, run (0..1 sunlight along the coast), bridge (0..1), fewLit, litK (window lights 0..1), built (deck end Z),
//      carry: { x, y, z, rot, a } (a plank in flight), pile (n planks at Z), fig: (ctx, cam) => {} }
export function seaWorld(ctx, t, c, o = {}) {
  const hy = horizonY(c), sunEl = o.sunEl ?? .02;
  // ---- sky
  const S = SKYT(); { const ox = W / 2 - S.w / 2 - c.yaw * c.f, oy = hy - S.hr; ctx.drawImage(S.c, ox, oy, S.w, S.h); if (oy > 0) { ctx.fillStyle = '#141640'; ctx.fillRect(0, 0, W, oy + 1); } }
  // ---- the sun (disc clipped by the sea which is drawn after it)
  const [sx, sy] = projDir(c, 0, sunEl), sr = c.f * .0105 * (1 + .1 * clamp(-sunEl * 30));
  const up = clamp((sunEl + .012) / .03);
  spot(ctx, sx, Math.min(sy, hy), 900 * (c.f / 1400), .32 + .3 * up, K.coral, '#ffe6c0', { grain: true, sy: .55 });
  spot(ctx, sx, Math.min(sy, hy), 320 * (c.f / 1400), .45 + .4 * up, K.gold, '#fff6e2', { grain: true });
  ctx.save(); ctx.fillStyle = '#fff6e2'; ctx.globalAlpha = .95; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 7); ctx.fill(); ctx.restore();
  addGlow(ctx, sx, sy, sr * 2.2, .7 * (.4 + .6 * up), K.gold, '#fff6e2');
  // ---- sea
  const Q = SEAT(); { const ox = W / 2 - Q.w / 2 - ((c.yaw * c.f) % 400); ctx.drawImage(Q.c, ox, hy, Q.w, Q.h); }
  // ---- far left coast (headlands on the horizon)
  ctx.save();
  for (const [fx, fz, fh] of FARL) {
    const a = proj(c, fx - 30000, 0, fz), b = proj(c, fx + 30000, 0, fz), top = proj(c, fx, fh, fz); if (a[2] < 20) continue;
    ctx.fillStyle = '#9a6e96'; ctx.beginPath(); ctx.moveTo(a[0], a[1] + 1); ctx.quadraticCurveTo(mix(a[0], top[0], .6), top[1] - (a[1] - top[1]) * .3, top[0], top[1]); ctx.quadraticCurveTo(mix(top[0], b[0], .4), top[1] - (a[1] - top[1]) * .2, b[0], b[1] + 1); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(K.gold, .25 * up); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
  // ---- the long coast: land chunks far → near with aerial perspective, ridge, sunlit run
  const N = 90, run = o.run ?? 0;
  const CP = []; for (let i = 0; i <= N; i++) { const s = i / N, [x, z] = coast(s), L = inland(s), [x2, z2] = coast(Math.min(1, s + .002)), d = Math.hypot(x2 - x, z2 - z) || 1, nx = Math.abs((z2 - z) / d), nz = -(x2 - x) / d * Math.sign((z2 - z) / d || 1); CP.push({ s, x, z, rx: x + nx * L * .35, rz: z + nz * L * .35, bx: x + nx * L, bz: z + nz * L, h: ridgeH(s) }); }
  for (let i = N - 1; i >= 0; i--) {
    const A = CP[i], B = CP[i + 1];
    const pa = proj(c, A.x, 0, A.z), pb = proj(c, B.x, 0, B.z), ra = proj(c, A.rx, A.h, A.rz), rb = proj(c, B.rx, B.h, B.rz), ba = proj(c, A.bx, A.h * .6, A.bz), bb = proj(c, B.bx, B.h * .6, B.bz);
    if (pa[2] < 30 || pb[2] < 30 || ra[2] < 30 || rb[2] < 30 || ba[2] < 30 || bb[2] < 30) continue;
    const fog = clamp(Math.pow(A.s, .6) * 1.05), col = mixHex('#2c2350', '#b07c98', fog);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(pa[0], pa[1] + 1); ctx.lineTo(pb[0] + (pb[0] > pa[0] ? 1 : -1), pb[1] + 1); ctx.lineTo(rb[0], rb[1]); ctx.lineTo(bb[0], Math.min(bb[1], rb[1])); ctx.lineTo(ba[0], Math.min(ba[1], ra[1])); ctx.lineTo(ra[0], ra[1]); ctx.closePath(); ctx.fill();
    // the dawn reaching this stretch of coast: a gold wash on the seaward slope + a rim on the crest
    const lit = clamp((run - A.s) * 8) * (A.s < .02 ? 0 : 1);
    if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .28 * lit * (1 - fog * .5); ctx.fillStyle = K.peach; ctx.fill(); ctx.globalAlpha = .7 * lit; ctx.strokeStyle = K.gold; ctx.lineWidth = Math.max(1, 3 * (1 - fog)); ctx.beginPath(); ctx.moveTo(ra[0], ra[1]); ctx.lineTo(rb[0], rb[1]); ctx.stroke(); ctx.restore(); }
    if (i % 3 === 0) { ctx.fillStyle = rgba('#ffe0c8', .25 * (1 - fog)); ctx.fillRect(Math.min(pa[0], pb[0]), pa[1], Math.abs(pb[0] - pa[0]) + 1, 1.2); }
    if (run > 0 && Math.abs(run - A.s) < .03) spot(ctx, ra[0], ra[1], 80 * (1 - fog * .6), .5 * (1 - Math.abs(run - A.s) / .03), K.gold, '#fff0cc');
  }
  // haze where coast meets sea, toward the horizon
  { const H2 = HAZE(), p0 = proj(c, coast(.5)[0], 0, coast(.5)[1]); if (p0[2] > 30) { ctx.save(); ctx.globalAlpha = .7; ctx.drawImage(H2, p0[0] - 900, p0[1] - 120, 1800, 200); ctx.restore(); } }
  // ---- towns
  const litK = o.litK ?? 1;
  TOWNS.forEach((T, i) => {
    const G = townGeo(T, i), [ax, az] = G.anchor, pa = proj(c, ax, 0, az); if (pa[2] < 200) return;
    if (pa[0] < -400 || pa[0] > W + 400) return;
    const fogk = T.far != null ? .8 : clamp(Math.pow(T.s, .6) * 1.05);
    const sunlit = T.far != null ? up : clamp((run - (T.s ?? 1)) * 8);
    let litA = T.ours ? 1 : T.few ? (o.fewLit ?? 0) : T.lit > 0 ? litK : 0;
    const share = T.few ? .8 : T.lit;
    for (const hs of G.houses) {
      const b = proj(c, hs.x, hs.y, hs.z); if (b[2] < 50) continue;
      const k = c.f / b[2], w = hs.w * k, h = hs.h * k; if (w < .6) continue;
      const base = mixHex(['#2a2048', '#33264e', '#3a2a50', '#2e2a54'][Math.floor(hs.col * 4)], '#a87c98', fogk);
      ctx.fillStyle = base;
      if (hs.roof === 'dome') { ctx.beginPath(); ctx.rect(b[0] - w / 2, b[1] - h, w, h); ctx.ellipse(b[0], b[1] - h, w / 2, w * .4, 0, Math.PI, 0); ctx.fill(); }
      else if (hs.roof === 'pitch') { ctx.beginPath(); ctx.moveTo(b[0] - w / 2, b[1]); ctx.lineTo(b[0] - w / 2, b[1] - h); ctx.lineTo(b[0], b[1] - h - w * .38); ctx.lineTo(b[0] + w / 2, b[1] - h); ctx.lineTo(b[0] + w / 2, b[1]); ctx.fill(); }
      else ctx.fillRect(b[0] - w / 2, b[1] - h, w, h);
      if (sunlit > 0 && w > 1.5) { ctx.fillStyle = rgba(K.peach, .45 * sunlit * (1 - fogk * .5)); ctx.fillRect(b[0] - w / 2, b[1] - h, Math.max(1, w * .18), h); }
      if (litA > 0) for (const wn of hs.wins) {
        if (!(wn.lit || (T.few && wn.ph < share))) continue;
        const a = litA * clamp((litA * 1.3 - wn.ph * .3) * 2);
        if (a <= 0) continue;
        const ws = Math.max(1, w * .16), wx = b[0] - w / 2 + wn.u * w - ws / 2, wy = b[1] - h + wn.v * h;
        ctx.fillStyle = rgba(wn.ph > .7 ? '#fff0c8' : K.hot, a * (.75 + .25 * Math.sin(t * .7 + wn.ph * 9))); ctx.fillRect(wx, wy, ws, Math.max(1, ws * 1.2));
      }
    }
    if (litA > 0 && share > 0) { const r = (T.ours ? 9000 : 5000) * c.f / pa[2] + 12; spot(ctx, pa[0], pa[1] - r * .2, r, .45 * litA, K.amber, K.hot, { grain: true, sy: .5 });
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(K.amber, .3 * litA); for (let k = 0; k < 6; k++) ctx.fillRect(pa[0] - r * .5 + k * r * .19 + Math.sin(t * 2 + k) * 2, pa[1] + 3 + k * r * .07, r * .08, 1.5); ctx.restore(); }
  });
  // ---- the sun path on the water (glints)
  { const r = prng(41); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gl = .35 + .65 * up;
    for (let i = 0; i < 520; i++) { const v = Math.pow(r(), 1.8), y = hy + 2 + v * (H - hy + 40), dd = y - hy, sp = 30 + dd * .95, x = sx + (r() - .5) * 2 * sp + Math.sin(t * .8 + i) * (2 + dd * .02), w = (4 + r() * 26) * (.4 + dd / 260); const fall = 1 - Math.abs(x - sx) / sp; if (fall <= 0) continue; ctx.fillStyle = rgba(r() < .5 ? K.hot : '#fff1d8', (.2 + .6 * r()) * fall * gl * (.6 + .4 * Math.sin(t * (2 + r() * 3) + i))); ctx.fillRect(x - w / 2, y, w, 1.3 + dd * .004); }
    ctx.restore(); }
  // ---- the bridge of light to one far bay ("It could come for a few")
  if (o.bridge > 0) {
    const T = TOWNS.find((q) => q.few), Gf = townGeo(T, TOWNS.indexOf(T)), [tx, tz] = Gf.anchor, n = 70, pts = [];
    for (let i = 0; i <= n; i++) { const q = i / n; if (q > o.bridge) break; const x = (1 - q) * (1 - q) * 600 + 2 * (1 - q) * q * 9000 + q * q * (tx - 2500), z = (1 - q) * (1 - q) * 1200 + 2 * (1 - q) * q * 40000 + q * q * tz; const p = proj(c, x, 0, z); if (p[2] > 20) pts.push(p); }
    if (pts.length > 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const [wk, a] of [[7, .12], [3, .3], [1.2, .9]]) { ctx.strokeStyle = rgba(a > .5 ? '#fff0cc' : K.amber, a * (o.bridgeA ?? 1)); ctx.lineWidth = wk; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.stroke(); }
      const e = pts[pts.length - 1]; if (o.bridge < 1) spot(ctx, e[0], e[1], 26, .9, K.amber, '#fff6e2');
      ctx.restore(); }
  }
  // ---- the pier: posts far → near, then the deck
  const P = PIER, built = o.built ?? 400;
  const postsFrom = Math.ceil((built + 20) / P.step) * P.step;
  ctx.save();
  for (let z = P.posts; z >= postsFrom; z -= P.step) postPair(ctx, c, z, t);
  ctx.restore();
  // deck: stringers + planks
  const zNear = Math.max(P.start, c.z + 30);
  for (const sx2 of [-P.half + 14, P.half - 14]) { quad(ctx, [proj(c, sx2 - 8, P.deck - 30, zNear), proj(c, sx2 + 8, P.deck - 30, zNear), proj(c, sx2 + 8, P.deck - 30, built), proj(c, sx2 - 8, P.deck - 30, built)], '#140f30'); }
  for (let z = built - P.plank; z >= P.start; z -= P.plank + P.gap) {
    if (z + P.plank < c.z + 30) break;
    const hz = hash(z * .013), top = mixHex('#6a4a64', '#8a5e6c', hz);
    box(ctx, c, -P.half - (hz - .5) * 10, P.half + (hash(z * .03) - .5) * 10, P.deck - 7, P.deck, z, z + P.plank, top, '#1e1636', '#2a1e40');
  }
  // the near posts of the built part
  for (let z = Math.floor(built / P.step) * P.step; z >= Math.max(P.start, c.z + 200); z -= P.step) postPair(ctx, c, z, t, true);
  // sun glaze on the deck (warm sheen toward the sun)
  { const a = proj(c, -P.half, P.deck, built), b = proj(c, P.half, P.deck, built); if (a[2] > 20) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(K.hot, .7); ctx.lineWidth = Math.max(1, 3 * c.f / a[2]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); } }
  // plank pile and the plank in flight
  if (o.pile) for (let k = 0; k < o.pile.n; k++) box(ctx, c, -80 + k * 3, 80 + k * 3, P.deck + k * 6, P.deck + 6 + k * 6, o.pile.z - k * 2, o.pile.z + P.plank - k * 2, mixHex('#7a5468', '#a0727a', k / 4), '#24183a', '#30223e');
  if (o.fig) o.fig(ctx, c);
  const q = typeof o.carry === 'function' ? o.carry(c) : o.carry;
  if (q && q.a > 0) { box(ctx, c, q.x - P.half, q.x + P.half, q.y - 4, q.y + 3, q.z - P.plank / 2, q.z + P.plank / 2, '#b07c80', '#2a1c3e', '#3a2848'); if (q.glow > 0) { const p = proj(c, q.x, q.y, q.z); spot(ctx, p[0], p[1], 220 * c.f / p[2], .6 * q.glow, K.amber, '#fff0cc', { grain: true, sy: .35 }); } }
  return { hy, sun: [sx, sy], up };
}
function postPair(ctx, c, z, t, near = false) {
  const P = PIER;
  for (const side of [-1, 1]) {
    const x = side * (P.half + 6), a = proj(c, x - 8, -30, z), b = proj(c, x + 8, P.deck + 18, z);
    if (a[2] < 20) continue;
    const w = Math.max(.8, b[0] - a[0]), h = a[1] - b[1]; if (h < .5) continue;
    ctx.fillStyle = near ? '#1a1236' : '#22183e'; ctx.fillRect(a[0], b[1], w, h);
    ctx.fillStyle = rgba(K.hot, .75); ctx.fillRect(a[0], b[1], w, Math.max(.8, w * .35));
    if (w > 2.5) { ctx.fillStyle = rgba('#ffb08a', .45); ctx.fillRect(side > 0 ? a[0] : a[0] + w * .72, b[1], w * .28, h * .8); }
    // reflection
    const wl = proj(c, x, 0, z); ctx.fillStyle = rgba('#140f30', .35); ctx.fillRect(a[0] + Math.sin(t * 1.5 + z) * w * .2, wl[1] + 1, w, h * .7);
  }
}

// ================================================================= 8.07 many bedrooms in many countries, the same stripe on each floor
export const PANEL = { w: 400, h: 860, gap: 26, y: 110 };
const ROOMS = [
  { wall: ['#1c1f4e', '#141436'], win: 'grid', out: 'towers', sky: ['#3a3a7a', '#e89a8e'], bed: 1 },
  { wall: ['#2a1e3e', '#1a1230'], win: 'arch', out: 'domes', sky: ['#4a3a78', '#f2b08a'], bed: 0 },
  { wall: ['#1e2444', '#121630'], win: 'shoji', out: 'pine', sky: ['#3a4078', '#e8a4a0'], bed: 1 },
  { wall: ['#2a2040', '#18142e'], win: 'shutter', out: 'palms', sky: ['#40367a', '#f6b48a'], bed: 0 },
  { wall: ['#1a1c40', '#101232'], win: 'small', out: 'snow', sky: ['#36407e', '#e6a0a0'], bed: 1 },
  { wall: ['#262046', '#161230'], win: 'grid', out: 'flat', sky: ['#4a3a7a', '#f2a88a'], bed: 0 },
  { wall: ['#1e1c48', '#121232'], win: 'arch', out: 'hills', sky: ['#3c3a7c', '#eea490'], bed: 1 },
];
const roomWin = (R) => ({ grid: [70, 120, 260, 300], arch: [90, 110, 220, 330], shoji: [50, 140, 300, 280], shutter: [100, 130, 200, 300], small: [130, 170, 150, 170], flat: [70, 120, 260, 300], hills: [90, 110, 220, 330] }[R.win]);
const roomPanel = (i) => once('room' + i, () => {
  const R = ROOMS[i % ROOMS.length], { w, h } = PANEL, [c, g] = layer(w, h), r = prng(300 + i);
  const [wx, wy, ww, wh] = roomWin(R);
  // outside: the dawn and a silhouette that says "elsewhere"
  skyFill(g, [[0, R.sky[0]], [.75, R.sky[1]], [1, '#ffd8a8']], wx, wy, ww, wh);
  g.save(); g.beginPath(); g.rect(wx, wy, ww, wh); g.clip();
  const gy = wy + wh * .78, sil = '#2a2050';
  g.fillStyle = sil;
  if (R.out === 'towers') for (let k = 0; k < 7; k++) { const tw = 24 + r() * 30, th = 60 + r() * 160; g.fillRect(wx + k * 40 + r() * 10, gy - th, tw, th + 100); }
  if (R.out === 'domes') for (let k = 0; k < 5; k++) { const x = wx + 20 + k * 50, bw = 40 + r() * 20; g.fillRect(x, gy - 40, bw, 140); if (k % 2 === 0) { g.beginPath(); g.ellipse(x + bw / 2, gy - 40, bw * .4, bw * .45, 0, Math.PI, 0); g.fill(); } }
  if (R.out === 'pine') { g.beginPath(); g.moveTo(wx, gy + 20); for (let x = 0; x <= ww; x += 10) g.lineTo(wx + x, gy - 30 - 40 * Math.sin(x * .012) - r() * 10); g.lineTo(wx + ww, wy + wh); g.lineTo(wx, wy + wh); g.fill(); }
  if (R.out === 'palms') { g.fillRect(wx, gy, ww, 200); for (let k = 0; k < 2; k++) { const x = wx + 50 + k * 110; g.fillRect(x, gy - 150, 5, 150); for (let f = 0; f < 6; f++) { const a = -2.8 + f * .55; g.beginPath(); g.moveTo(x + 2, gy - 150); g.quadraticCurveTo(x + Math.cos(a) * 40, gy - 170 + Math.sin(a) * 30, x + Math.cos(a) * 70, gy - 140 + Math.sin(a) * 40 + 20); g.lineTo(x + 2, gy - 146); g.fill(); } } }
  if (R.out === 'snow') { g.fillStyle = '#dccde0'; g.fillRect(wx, gy, ww, 200); g.fillStyle = sil; g.beginPath(); g.moveTo(wx + 10, gy); g.lineTo(wx + 60, gy - 50); g.lineTo(wx + 110, gy); g.fill(); g.fillStyle = '#e8dcec'; g.beginPath(); g.moveTo(wx + 22, gy - 6); g.lineTo(wx + 60, gy - 50); g.lineTo(wx + 98, gy - 6); g.lineTo(wx + 60, gy - 30); g.fill(); }
  if (R.out === 'flat') for (let k = 0; k < 6; k++) { const bw = 40 + r() * 30, bh = 30 + r() * 60; g.fillRect(wx + k * 45, gy - bh, bw, bh + 100); if (r() < .5) g.fillRect(wx + k * 45 + 8, gy - bh - 14, 14, 14); }
  if (R.out === 'hills') { g.beginPath(); g.moveTo(wx, gy + 10); for (let x = 0; x <= ww; x += 8) g.lineTo(wx + x, gy - 50 * Math.sin(x * .014 + 1) - 10); g.lineTo(wx + ww, wy + wh); g.lineTo(wx, wy + wh); g.fill(); g.strokeStyle = rgba('#5a4a80', .6); for (let k = 1; k < 5; k++) { g.beginPath(); for (let x = 0; x <= ww; x += 8) g.lineTo(wx + x, gy - 50 * Math.sin(x * .014 + 1) - 10 + k * 14); g.stroke(); } }
  g.restore();
  // wall with the window cut out
  g.save(); g.beginPath(); g.rect(0, 0, w, h);
  if (R.win === 'arch' || R.win === 'hills') { g.moveTo(wx, wy + wh); g.lineTo(wx, wy + ww / 2); g.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0); g.lineTo(wx + ww, wy + wh); g.closePath(); } else g.rect(wx, wy, ww, wh);
  const lg = g.createLinearGradient(0, 0, 0, h); lg.addColorStop(0, R.wall[0]); lg.addColorStop(1, R.wall[1]); g.fillStyle = lg; g.fill('evenodd'); g.clip('evenodd');
  hatch(g, [0, 0, w, h], { angle: -1.1, gap: 7, w: 1, col: '#05061a', a: .28, seed: 300 + i, broken: .35 });
  g.restore();
  // window frame by type
  g.strokeStyle = '#0a0a22'; g.fillStyle = '#0a0a22';
  if (R.win === 'grid' || R.win === 'flat') { g.lineWidth = 8; g.strokeRect(wx, wy, ww, wh); g.lineWidth = 5; for (let k = 1; k < 3; k++) { g.beginPath(); g.moveTo(wx + ww * k / 3, wy); g.lineTo(wx + ww * k / 3, wy + wh); g.stroke(); } g.beginPath(); g.moveTo(wx, wy + wh * .5); g.lineTo(wx + ww, wy + wh * .5); g.stroke(); }
  if (R.win === 'shoji') { g.lineWidth = 3; for (let k = 1; k < 6; k++) { g.beginPath(); g.moveTo(wx + ww * k / 6, wy); g.lineTo(wx + ww * k / 6, wy + wh); g.stroke(); } for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(wx, wy + wh * k / 5); g.lineTo(wx + ww, wy + wh * k / 5); g.stroke(); } g.fillStyle = rgba('#ffe8d0', .18); g.fillRect(wx + ww * .5, wy, ww * .5, wh); g.lineWidth = 8; g.strokeRect(wx, wy, ww, wh); }
  if (R.win === 'shutter') { for (const sd of [-1, 1]) { const x0 = sd < 0 ? wx - 70 : wx + ww; g.fillStyle = '#1a1838'; g.fillRect(x0, wy, 70, wh); g.strokeStyle = rgba('#3a3060', .8); g.lineWidth = 2; for (let y = wy + 8; y < wy + wh; y += 10) { g.beginPath(); g.moveTo(x0 + 4, y); g.lineTo(x0 + 66, y + 3); g.stroke(); } } g.strokeStyle = '#0a0a22'; g.lineWidth = 7; g.strokeRect(wx, wy, ww, wh); }
  if (R.win === 'small') { g.lineWidth = 16; g.strokeRect(wx, wy, ww, wh); g.lineWidth = 5; g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh / 2); g.lineTo(wx + ww, wy + wh / 2); g.stroke(); }
  if (R.win === 'arch' || R.win === 'hills') { g.lineWidth = 8; g.beginPath(); g.moveTo(wx, wy + wh); g.lineTo(wx, wy + ww / 2); g.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0); g.lineTo(wx + ww, wy + wh); g.closePath(); g.stroke(); g.lineWidth = 4; g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.stroke(); }
  g.fillStyle = '#121030'; g.fillRect(wx - 16, wy + wh, ww + 32, 12);
  // floor
  const fy = 640; const fl = g.createLinearGradient(0, fy, 0, h); fl.addColorStop(0, shade(R.wall[1], .02)); fl.addColorStop(1, '#07071a'); g.fillStyle = fl; g.fillRect(0, fy, w, h - fy);
  g.strokeStyle = rgba('#000000', .4); g.lineWidth = 1; for (let k = -6; k < 12; k++) { g.beginPath(); g.moveTo(w / 2 + k * 30, fy); g.lineTo(w / 2 + k * 90, h); g.stroke(); }
  // bed with a sleeper (duvet mass, a head of hair on the pillow), and a low bedside table
  const bl = R.bed ? 10 : w - 300, bw = 290, by = 600;
  g.fillStyle = '#0c0b24'; g.fillRect(bl, by + 40, bw, 60);
  g.fillStyle = mixHex(R.wall[0], '#6a5a9a', .35); g.beginPath(); g.moveTo(bl, by + 50); g.bezierCurveTo(bl + 60, by - 10, bl + 200, by + 10, bl + bw, by + 30); g.lineTo(bl + bw, by + 70); g.lineTo(bl, by + 70); g.closePath(); g.fill();
  strokes(g, 8, (k, q) => [bl + q * bw, by + 22 + k * 5 + Math.sin(q * 7 + k) * 4], { w: 1, col: '#0a0a24', a: .4, seed: 310 + i });
  const px = R.bed ? bl + 40 : bl + bw - 40; g.fillStyle = mixHex(R.wall[0], '#8a7ab0', .4); g.beginPath(); g.ellipse(px, by + 26, 34, 12, 0, 0, 7); g.fill();
  g.fillStyle = '#120c1c'; g.beginPath(); g.ellipse(px + (R.bed ? 6 : -6), by + 16, 13, 11, 0, 0, 7); g.fill();
  const tx = R.bed ? bl + bw + 20 : bl - 70; g.fillStyle = '#0a0a22'; g.fillRect(tx, by + 20, 50, 8); g.fillRect(tx + 6, by + 28, 6, 70); g.fillRect(tx + 38, by + 28, 6, 70);
  stip(c, { k: .45, g: 1.1, seed: 320 + i });
  return { c, phone: [tx + 25, by + 16], win: [wx, wy, ww, wh], bed: R.bed, px, by };
});
export function drawRooms(ctx, t, camX, ign, o = {}) {
  const { w, h, gap, y } = PANEL;
  ctx.fillStyle = '#05061a'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < ROOMS.length; i++) {
    const x = 40 + i * (w + gap) - camX; if (x > W + 10 || x + w < -10) continue;
    const P = roomPanel(i), lift = (o.lift ?? 0) * Math.sin(i * 1.3) * 10;
    ctx.save(); ctx.translate(x, y + lift); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
    ctx.drawImage(P.c, 0, 0);
    // breathing duvet
    ctx.fillStyle = rgba('#05061a', .15); ctx.fillRect(P.bed ? 10 : w - 300, P.by + 20 + Math.sin(t * 1.6 + i) * 1.5, 290, 3);
    // the stripe from the window down across the floor (faint before, ignites together on "message")
    const [wx, wy, ww, wh] = P.win, k = .16 + .84 * ign;
    const p0 = [wx + ww * .1, wy + wh], p1 = [wx + ww * .1 - 260 + (i % 2) * 120, 860], p3 = [wx + ww * .8, wy + wh];
    stripeQuad(ctx, [p0[0], 642], [p1[0], 860], [p0[0] + ww * .7, 642], .9 * k);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(0, wy, 0, wy + wh); lg.addColorStop(0, rgba(K.gold, 0)); lg.addColorStop(1, rgba(K.gold, .25 * ign)); ctx.fillStyle = lg; ctx.fillRect(wx, wy, ww, wh); ctx.restore();
    if (ign > 0) spot(ctx, wx + ww * .45, 700, 260, .35 * ign, K.amber, K.hot, { grain: true, sy: .4 });
    // the message light on each bedside table
    const pa = .25 + .75 * ign; spot(ctx, P.phone[0], P.phone[1], 30 + 30 * bell(ign, 1, .4), .7 * pa, K.cyan, K.cyanW);
    ctx.restore();
  }
}

// ================================================================= END CARD: the question writes in over the dawn sea
const CARD = ['If you never had to work again,', 'what would you do with your four thousand weeks?'];
const cardLine = (i) => once('card' + i, () => {
  const size = 64, [m] = layer(10, 10); const g0 = m.getContext('2d'); g0.font = `${size}px "Instrument Serif"`; const wd = Math.ceil(g0.measureText(CARD[i]).width) + 40;
  const [c, g] = layer(wd, 110); g.font = `${size}px "Instrument Serif"`; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff1dc';
  if (i === 1) { // "four thousand weeks" in italic
    const a = 'what would you do with your ', b = 'four thousand weeks', cq = '?';
    g.fillText(a, 20, 78); let x = 20 + g.measureText(a).width; g.font = `${size}px "Instrument Serif Italic"`; g.fillStyle = '#ffe2b0'; g.fillText(b, x, 78); x += g.measureText(b).width; g.font = `${size}px "Instrument Serif"`; g.fillStyle = '#fff1dc'; g.fillText(cq, x, 78);
  } else g.fillText(CARD[i], 20, 78);
  return { c, w: wd, h: 110 };
});
export function endCard(ctx, t, t0) {
  const spans = [[t0, t0 + 1.9], [t0 + 2.2, t0 + 4.8]];
  { const k = sm(clamp((t - t0 + .4) / 1.5)); if (k > 0) { ctx.save(); ctx.globalAlpha = .55 * k; const rg = ctx.createRadialGradient(W / 2, 800, 0, W / 2, 800, 760); rg.addColorStop(0, 'rgba(18,14,48,.75)'); rg.addColorStop(1, 'rgba(18,14,48,0)'); ctx.translate(0, 800); ctx.scale(1, .3); ctx.translate(0, -800); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, 2000); ctx.restore(); } }
  spans.forEach(([a, b], i) => {
    const L = cardLine(i), u = clamp((t - a) / (b - a)); if (u <= 0) return;
    const x = W / 2 - L.w / 2, y = 812 + i * 78 - 60, rise = (1 - eout(clamp((t - a) / 1.2))) * 16;
    const rv = L.w * eio(u);
    // soft reveal edge: draw the revealed part, then a fading strip at the pen front
    ctx.save(); ctx.globalAlpha = .95;
    ctx.drawImage(L.c, 0, 0, Math.max(1, rv - 30), L.h, x, y + rise, Math.max(1, rv - 30), L.h);
    for (let k = 0; k < 6; k++) { const sx0 = rv - 30 + k * 5; if (sx0 < 0 || sx0 >= L.w) continue; ctx.globalAlpha = .95 * (1 - k / 6); ctx.drawImage(L.c, sx0, 0, 5, L.h, x + sx0, y + rise, 5, L.h); }
    ctx.restore();
    if (u < 1) spot(ctx, x + rv, y + 60 + rise, 26, .6, K.amber, '#fff6e2');
  });
}

// ================================================================= shot functions on the sea world
const lerpCam = (A, B, e) => ({ x: mix(A.x, B.x, e), y: Math.exp(mix(Math.log(A.y), Math.log(B.y), e)), z: mix(A.z, B.z, e), yaw: mix(A.yaw, B.yaw, e), pitch: mix(A.pitch, B.pitch, e), f: mix(A.f, B.f, e) });
export const sunElAt = (t, every) => mix(-.02, .012, eout(lin(every - .4, every + 1.3, t))) + .012 * clamp((t - every - 1.3) / 25);
const C_HIGH = { x: -3000, y: 9000, z: -9000, yaw: .3, pitch: -.15, f: 1400 };
const C_WIDE = { x: -7000, y: 17000, z: -24000, yaw: .2, pitch: -.12, f: 1400 };
const C_PIER = { x: 0, y: 215, z: -300, yaw: 0, pitch: -.1, f: 1400 };
// 8.04 – 8.06: the coast from high (bridge of light on "few"), wider as the sun crests on "every", then down the sun path onto the pier
export function seaCoast(tm) { // { t0, It, few, Or, every, That, open, b }
  return (ctx, t, s) => {
    const enter = eout(lin(tm.t0 - .3, tm.t0 + 1.1, t));
    let c = { ...C_HIGH, yaw: mix(-.3, C_HIGH.yaw, enter) };
    c = lerpCam(c, C_WIDE, eio(lin(tm.Or - .2, tm.every + 1.0, t)));
    const dn = quart(lin(tm.every + 1.05, tm.That + .55, t));
    c = lerpCam(c, C_PIER, dn);
    // the slow push on "open" and on toward the posts
    const pu = eio(lin(tm.That + .4, s.b, t)); c.z += 420 * pu; c.y -= 10 * pu; c.pitch += .02 * pu;
    const b = breathe(t, .5, 7); c.yaw += b.dx * .0004; c.pitch += b.dy * .0003;
    ctx.fillStyle = '#141640'; ctx.fillRect(0, 0, W, H);
    seaWorld(ctx, t, c, {
      sunEl: sunElAt(t, tm.every), run: eio(lin(tm.every - .15, tm.every + 1.7, t)), bridge: eio(lin(tm.It - .15, tm.few + .02, t)), bridgeA: 1 - .65 * sm(lin(tm.Or, tm.every + .5, t)),
      fewLit: sm(lin(tm.few - .05, tm.few + .35, t)) * (1 + .5 * bell(t, tm.few + .15, .15)), litK: sm(lin(tm.every + .2, tm.every + 2, t)), built: 400,
    });
    // speed smear while the camera dives
    const v = quart(lin(tm.every + 1.05, tm.That + .55, t + 1 / 30)) - quart(lin(tm.every + 1.05, tm.That + .55, t - 1 / 30));
    if (v > .02) { const [c2, g2] = scratch('smear'); g2.drawImage(ctx.canvas, 0, 0); ctx.save(); ctx.globalAlpha = Math.min(.45, v * 4); ctx.translate(W / 2, H * .45); ctx.scale(1.04, 1.04); ctx.translate(-W / 2, -H * .45); ctx.drawImage(c2, 0, 0); ctx.restore(); }
    fin(ctx, { vig: .3 });
  };
}
// 8.07: many bedrooms; the stripes ignite together on "message"; the stripe runs on right
export function rooms(tm) { // { t0, message, b }
  return (ctx, t, s) => {
    const camX = mix(-60, 760, eio(lin(tm.t0 - .4, tm.message + .3, t))) + 1500 * ein(lin(tm.message + .3, s.b, t));
    const ign = sm(lin(tm.message - .1, tm.message + .2, t));
    drawRooms(ctx, t, camX, ign);
    const fl = bell(t, tm.message + .04, .1); if (fl > .02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(K.gold, .16 * fl); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    const v = ein(lin(tm.message + .3, s.b, t)); if (v > .05) { const [c2, g2] = scratch('smear'); g2.drawImage(ctx.canvas, 0, 0); ctx.save(); for (let i = 1; i <= 3; i++) { ctx.globalAlpha = .2 * v; ctx.drawImage(c2, -i * 30 * v, 0); } ctx.restore(); }
    fin(ctx, { vig: .3 });
  };
}
// 8.08 – END: you on the pier; you pick up the next plank and lay it ("want"); the camera rises wide and high; the end card
const DRESS8 = { coat: '#2a2048', pants: '#141228', shoes: '#0b0a18', skin: '#c89a80', hair: '#140e1c' };
const STAND = { lean: .02, head: -.12, sh: [.15, -.1], el: [.25, .2], hip: [.04, -.04], kn: [0, 0], hair: 'bun', coat: .5 };
const BEND = { lean: .78, head: .3, sh: [.3, .2], el: [.12, .1], hip: [.3, .14], kn: [.6, .36] };
const CARRY = { lean: .1, head: -.02, sh: [.95, .85], el: [.55, .55], hip: [.06, -.02], kn: [.06, 0] };
const PLACE = { lean: .88, head: .38, sh: [.85, .75], el: [.2, .2], hip: [.32, .14], kn: [.62, .4] };
const C_SIDE = (built) => ({ x: 520, y: 190, z: built - 520, yaw: -.5, pitch: -.05, f: 1400 });
const C_TOP = (built) => ({ x: -9000, y: 6000, z: built - 9000, yaw: .34, pitch: -.2, f: 1400 });
// orbit the camera from A to B around a moving focus (keeps the subject in frame while rising)
function orbit(A, B, FA, FB, e) {
  const sph = (C, F) => { const dx = C.x - F[0], dy = C.y - F[1], dz = C.z - F[2], d = Math.hypot(dx, dy, dz); const ly = Math.atan2(F[0] - C.x, F[2] - C.z), lp = Math.atan2(F[1] - C.y, Math.hypot(F[0] - C.x, F[2] - C.z)); return { d, E: Math.asin(dy / d), A: Math.atan2(dx, -dz), oy: C.yaw - ly, op: C.pitch - lp }; };
  const a = sph(A, FA), b = sph(B, FB), F = [mix(FA[0], FB[0], e), mix(FA[1], FB[1], e), mix(FA[2], FB[2], e)];
  const d = Math.exp(mix(Math.log(a.d), Math.log(b.d), e)), E = mix(a.E, b.E, e), Az = mix(a.A, b.A, e);
  const C = { x: F[0] + d * Math.sin(Az) * Math.cos(E), y: F[1] + d * Math.sin(E), z: F[2] - d * Math.cos(Az) * Math.cos(E), f: mix(A.f, B.f, e) };
  C.yaw = Math.atan2(F[0] - C.x, F[2] - C.z) + mix(a.oy, b.oy, e); C.pitch = Math.atan2(F[1] - C.y, Math.hypot(F[0] - C.x, F[2] - C.z)) + mix(a.op, b.op, e);
  return C;
}
export function pierYou(tm) { // { t0, every, bend0, lift, want, rise0, rise1, card }
  const B0 = 400, PL = PIER.plank + PIER.gap;
  return (ctx, t, s) => {
    let c = C_SIDE(B0);
    // the truck right from the bedrooms carries on, easing out (c)
    const en = 1 - eout(lin(tm.t0 - .25, tm.t0 + 1.1, t)); c.x -= 700 * en * .88; c.z -= 700 * en * -.48;
    const b = breathe(t, .6, 4); c.yaw += b.dx * .0003; c.pitch += b.dy * .0003 - 3e-3 * bell(t, tm.want + .05, .08);
    const rise = eio(lin(tm.rise0, tm.rise1, t)); if (rise > 0) c = orbit(c, C_TOP(B0), [0, 60, B0 - 100], [0, 0, 9000], rise);
    const hold = Math.max(0, t - tm.rise1); c.y += 30 * hold; c.z -= 60 * hold; c.pitch -= .0012 * hold;
    const landed = t >= tm.want, built = landed ? B0 + PL : B0, zf = B0 - 95;
    // pose timeline
    let pose = STAND, k;
    if (t > tm.bend0) pose = lerpPose(STAND, BEND, eio(lin(tm.bend0, tm.bend0 + .55, t)));
    if (t > tm.lift) pose = lerpPose(BEND, CARRY, eio(lin(tm.lift, tm.lift + .45, t)));
    if (t > tm.want - .5) pose = lerpPose(CARRY, PLACE, eio(lin(tm.want - .5, tm.want, t)));
    if (t > tm.want + .3) pose = lerpPose(PLACE, STAND, eio(lin(tm.want + .3, tm.want + 1.2, t)));
    pose = { ...STAND, ...pose, lean: pose.lean + Math.sin(t * 1.9) * .008, head: pose.head + (t > tm.want + 1 ? -.05 : 0) };
    let hands = null;
    const figFn = (ctx2, cc) => {
      const [fx, fy, fz] = proj(cc, 0, PIER.deck, zf); if (fz < 30) return; const sc = cc.f / fz; if (sc > 4 || fx < -300 || fx > W + 300) return;
      const [sx, sy] = proj(cc, 0, 0, 1e7);
      ctx2.save(); ctx2.fillStyle = rgba('#0a0820', .35); ctx2.beginPath(); ctx2.ellipse(fx - 30 * sc, fy + 2, 60 * sc, 7 * sc, 0, 0, 7); ctx2.fill(); ctx2.restore();
      const r = fig(ctx2, fx, fy - 88 * sc, sc, pose, { dress: DRESS8, light: { x: sx, y: sy, col: K.hot, a: .5 }, rim: '#ffd8aa', rimSide: 1, rimW: Math.max(1, 2 * sc / 2), key: 'pier8' });
      hands = [r.hand(0), r.hand(1)];
    };
    const carry = (cc) => {
      if (t < tm.bend0 + .3 || t > tm.want + 2.5) return null;
      const pileP = [0, PIER.deck + 4 * 6 + 3, B0 - 30 + 15];
      const landP = [0, PIER.deck - 3.5, B0 + PIER.gap + PIER.plank / 2];
      let p = pileP;
      if (hands && t > tm.lift) { const hx = (hands[0][0] + hands[1][0]) / 2, hy = (hands[0][1] + hands[1][1]) / 2; const hp = unprojX(cc, hx, hy, 0); p = [0, mix(pileP[1], hp[1] - 4, sm(lin(tm.lift, tm.lift + .2, t))), mix(pileP[2], hp[2] + 22, sm(lin(tm.lift, tm.lift + .2, t)))]; }
      if (t > tm.want - .12) p = [0, mix(p[1], landP[1], sm(lin(tm.want - .12, tm.want, t))), mix(p[2], landP[2], sm(lin(tm.want - .12, tm.want, t)))];
      if (landed) return null;
      return { x: 0, y: p[1], z: p[2], a: 1, glow: 0 };
    };
    ctx.fillStyle = '#141640'; ctx.fillRect(0, 0, W, H);
    const R = seaWorld(ctx, t, c, { sunEl: sunElAt(t, tm.every), run: 1, litK: 1, built, pile: { n: t > tm.lift ? 3 : 4, z: B0 - 30 }, fig: figFn, carry, fewLit: 1 });
    // the landing: the new plank catches the sun, a puff of dust
    if (landed) { const g = bell(t, tm.want + .1, .25), p = proj(c, 0, PIER.deck, B0 + PL / 2); if (p[2] > 20) { spot(ctx, p[0], p[1], 260 * c.f / p[2], .7 * g + .12, K.amber, '#fff0cc', { grain: true, sy: .3 }); motes(ctx, t, 40, [p[0] - 120, p[1] - 70, 240, 80], { seed: 5, a: .8 * g, col: '#ffe8c8' }); } }
    if (tm.card && t > tm.card - .5) endCard(ctx, t, tm.card);
    fin(ctx, { vig: .28 });
  };
}
