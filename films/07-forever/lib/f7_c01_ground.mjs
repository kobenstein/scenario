// Film 7 · c01 · the GROUND world (1.03–1.07): a night plain under the Milky Way; the amber curve's foot runs along the ground from a town
// of light, feeds a field of chip wafers, a power plant, a row of small robot silhouettes, the homes on the hills, and rises behind a vast
// dark stage whose screen says SUSTAINABLE ABUNDANCE (and becomes the window onto the clip C1).
//   groundPrepare()                       builds the cached layers (far ridges, mid hills with homes, the plain) as Images
//   ground(ctx, t, T, cam {x, y, z, tilt}, st)   draws the whole world for one frame; st = the scene's beat times and switches:
//      { chips, plant, robots, step, homes, stage, speak, clipOn (0..1 screen opening), words 0..1, sky {ox, oy}, curveW, curveBr, sparks, burst }
//   → { screen: {x, y, w, h} (screen rect in px), curveTop: [x, y] (screen), skyO }
// World units: at cam.z = 1 one unit = one px; horizon y 560; layer parallax p: far .22, ridge .38, hills .58, plain 1.
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas, text } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { figure, figureBack, POSES } from './figure.mjs';
import { clipFrame } from './kit.mjs';
import { F7, sky, curve, ease, glowAt, n1, mod } from './f7_kit.mjs';

const TAU = Math.PI * 2;
const HZ = 560;
// ---------------------------------------------------------------- camera
export function gmap(cam, p = 1) {
  // horizon-anchored: every layer puts the horizon at the same screen height (the p = 1 one); parallax acts on x and on zoom only
  const z = cam.z ?? 1, k = 1 + (z - 1) * p, cx = W / 2 + ((cam.x ?? W / 2) - W / 2) * p, Yh = H / 2 + (HZ - (cam.y ?? H / 2)) * z + (cam.tilt ?? 0);
  return { k, X: (x) => W / 2 + (x - cx) * k, Y: (y) => Yh + (y - HZ) * k, set: (ctx) => ctx.setTransform(k, 0, 0, k, W / 2 - cx * k, Yh - HZ * k) };
}
// ---------------------------------------------------------------- the curve in the ground world (foot on the plain → knee behind the stage → up)
export const NODE = [0, 800], STAGE = { x: 4200, y: 600, sx: 4200, sy: 400, sw: 440, sh: 248 }, RISE_X = 4485;
const FOOT = [[-900, 812], [-450, 806], [0, 800], [600, 812], [1300, 800], [2000, 772], [2700, 738], [3300, 700], [3800, 652], [4150, 616], [4380, 598]];
function catmull(P, n = 10) { const out = []; for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]; for (let j = 0; j < n; j++) { const t = j / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map((d) => .5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3))); } } out.push(P[P.length - 1]); return out; }
export const GCURVE = (() => {
  const foot = catmull(FOOT, 14), knee = FOOT[FOOT.length - 1], out = foot.map(([x, y]) => [x, y, clamp((y - HZ) / 230, .32, 1.15)]);
  // the rise: from the knee bending up (exponential feel), behind the stage, on and on
  for (let i = 1; i <= 160; i++) { const s = i / 160, y = knee[1] - (Math.pow(s, 1.6)) * 4800, x = knee[0] + (RISE_X - knee[0]) * (1 - Math.exp(-s * 18)) + 6 * s; out.push([x, y, .62]); }
  return out;
})();
// ---------------------------------------------------------------- cached layers
const IM = {};
const L = { far: { p: .22, x0: -700, y0: 220, w: 4400, h: 420, k: 1 }, ridge: { p: .38, x0: -700, y0: 300, w: 5200, h: 380, k: 1 }, hills: { p: .58, x0: -700, y0: 330, w: 6000, h: 410, k: 1.3 }, plain: { p: 1, x0: -1400, y0: HZ - 30, w: 7400, h: 1100, k: 1.05 } };
function ridgeLine(seed, x0, w, base, amp, f) { const n = vnoise(seed), pts = []; for (let x = x0; x <= x0 + w; x += 6) pts.push([x, base - amp * (fbm(n, x * f, seed * .1, 4) * 1.3 - .15) - amp * .35 * Math.sin(x * f * .37 + seed)]); return pts; }
function fillRidge(g, pts, bottom, col, rim, rimA) {
  g.beginPath(); g.moveTo(pts[0][0], bottom); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(pts[pts.length - 1][0], bottom); g.closePath(); g.fillStyle = col; g.fill();
  if (rim) { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.strokeStyle = rgba(rim, rimA); g.lineWidth = 1.4; g.stroke(); }
}
function hatchIn(g, pts, bottom, col, a, gap, ang = -.9, seed = 1) {
  g.save(); g.beginPath(); g.moveTo(pts[0][0], bottom); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(pts[pts.length - 1][0], bottom); g.closePath(); g.clip();
  const x0 = pts[0][0], x1 = pts[pts.length - 1][0], r = prng(seed); g.strokeStyle = rgba(col, a); g.lineWidth = .8; g.beginPath();
  for (let x = x0 - 400; x < x1 + 400; x += gap * (.8 + .4 * r())) { g.moveTo(x, bottom); g.lineTo(x + Math.cos(ang) * 500, bottom + Math.sin(ang) * 500); }
  g.stroke(); g.restore();
}
export const HOMES = [];
function buildLayer(name) {
  const D = L[name], [c, g] = canvas(Math.ceil(D.w * D.k), Math.ceil(D.h * D.k)); g.setTransform(D.k, 0, 0, D.k, -D.x0 * D.k, -D.y0 * D.k);
  const bot = D.y0 + D.h;
  if (name === 'far') {
    const p1 = ridgeLine(11, D.x0, D.w, 470, 120, .0016); fillRidge(g, p1, bot, '#26245a', '#8478d0', .45); hatchIn(g, p1, bot, '#5a50a8', .12, 7, -2.3, 3);
    const p2 = ridgeLine(12, D.x0, D.w, 525, 70, .0024); fillRidge(g, p2, bot, '#1f1d4c', '#7064c0', .35);
    const mg = g.createLinearGradient(0, 480, 0, 600); mg.addColorStop(0, 'rgba(70,60,140,0)'); mg.addColorStop(1, 'rgba(70,60,140,.35)'); g.fillStyle = mg; g.fillRect(D.x0, 480, D.w, 160);
  } else if (name === 'ridge') {
    const p1 = ridgeLine(21, D.x0, D.w, 540, 80, .0022); fillRidge(g, p1, bot, '#19183f', '#6a5cb8', .35); hatchIn(g, p1, bot, '#3c3680', .16, 6, -2.2, 5);
  } else if (name === 'hills') {
    const n = vnoise(31), pts = []; for (let x = D.x0; x <= D.x0 + D.w; x += 5) pts.push([x, 538 - 40 * (fbm(n, x * .0018, 3, 3) - .3) - 16 * Math.sin(x * .004)]);
    fillRidge(g, pts, bot, '#141436', '#5a50a8', .4); hatchIn(g, pts, bot, '#2e2a66', .2, 5, -2.5, 7);
    // homes on the hills (dark now; their windows light up per frame on "everyone")
    const r = prng(77);
    for (let x = D.x0 + 60; x < D.x0 + D.w - 60; x += 26 + r() * 70) {
      if (r() < .25) continue;
      const j = Math.min(pts.length - 1, Math.max(0, Math.round((x - D.x0) / 5))), gy = Math.min(553, pts[j][1] + 5 + r() * 16), s = .75 + r() * .5, w = (16 + r() * 12) * s, h = (11 + r() * 7) * s, roof = (7 + r() * 6) * s;
      g.fillStyle = '#0d0d26'; g.beginPath(); g.moveTo(x - w / 2, gy); g.lineTo(x - w / 2, gy - h); g.lineTo(x - w * .1, gy - h - roof); g.lineTo(x + w / 2, gy - h); g.lineTo(x + w / 2, gy); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(120,110,200,.35)'; g.lineWidth = .7; g.beginPath(); g.moveTo(x - w / 2, gy - h); g.lineTo(x - w * .1, gy - h - roof); g.lineTo(x + w / 2, gy - h); g.stroke();
      const nw = 1 + Math.floor(r() * 2.5); for (let q = 0; q < nw; q++) HOMES.push({ x: x - w / 2 + w * (q + .5) / nw - 1.6 * s, y: gy - h * .62, w: 3.4 * s, h: 4 * s, t: r(), dark: r() < .1 });
      if (r() < .3) { g.fillStyle = '#0d0d26'; g.fillRect(x + w * .2, gy - h - roof * .9, 3 * s, roof * .7); }
    }
    // a line of trees here and there on the crest
    for (let i = 0; i < 160; i++) { const x = D.x0 + r() * D.w, j = Math.round((x - D.x0) / 5), y = pts[Math.min(pts.length - 1, j)][1] + 2, h = 10 + r() * 16; g.fillStyle = '#101030'; g.beginPath(); g.moveTo(x - h * .25, y); g.lineTo(x, y - h); g.lineTo(x + h * .25, y); g.closePath(); g.fill(); }
  } else if (name === 'plain') {
    const gr = g.createLinearGradient(0, HZ, 0, D.y0 + D.h); gr.addColorStop(0, '#24224e'); gr.addColorStop(.06, '#191838'); gr.addColorStop(.35, '#100f28'); gr.addColorStop(1, '#08081a');
    g.fillStyle = gr; g.fillRect(D.x0, HZ - 4, D.w, D.h);
    // engraved furrows: horizontal lines in perspective, broken, wobbling
    const r = prng(91), n = vnoise(93);
    for (let i = 0; i < 260; i++) {
      const d = Math.pow(i / 260, 2.1), y = HZ + 4 + d * (D.y0 + D.h - HZ), al = (.04 + .07 * (1 - d * .5)) * clamp(d * 14) * (i % 3 === 0 ? 1 : .55);
      g.strokeStyle = rgba('#6d64c0', al); g.lineWidth = .5 + d * .8; g.beginPath(); let on = false;
      for (let x = D.x0; x < D.x0 + D.w; x += 14) { const v = fbm(n, x * .004, y * .02, 2); if (v < .42) { on = false; continue; } const yy = y + (v - .5) * 6 * (1 + d * 4); on ? g.lineTo(x, yy) : g.moveTo(x, yy); on = true; }
      g.stroke();
    }
    // grass tufts and stones in the near plain
    for (let i = 0; i < 2600; i++) { const x = D.x0 + r() * D.w, d = r(), y = HZ + 20 + d * d * (D.h - 60), s = 1 + d * 7; g.strokeStyle = rgba('#3a3678', .25 + .2 * r()); g.lineWidth = .6 + d; g.beginPath(); for (let q = 0; q < 3; q++) { g.moveTo(x + q * s * .4, y); g.lineTo(x + q * s * .4 + (r() - .5) * s, y - s * (1 + r())); } g.stroke(); }
    // the low rise where the people stand (in front of the stage, left)
    const hill = []; for (let x = 2860; x <= 3700; x += 10) { const q = (x - 2860) / 840; hill.push([x, 690 - 52 * Math.sin(Math.PI * q) ** .9 + 3 * n1(x * .05)]); }
    g.beginPath(); g.moveTo(2860, 700); hill.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(3700, 700); g.closePath(); g.fillStyle = '#121232'; g.fill();
    g.strokeStyle = 'rgba(150,130,230,.4)'; g.lineWidth = 1.2; g.beginPath(); hill.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    hatchIn(g, hill.concat([[3700, 700], [2860, 700]]), 760, '#2c2a64', .25, 5, -2.4, 9);
  }
  return c;
}
let READY = false;
export async function groundPrepare() {
  if (READY) return; READY = true;
  for (const k of Object.keys(L)) IM[k] = await loadImage(buildLayer(k).toBuffer('image/png'));
}
function drawLayer(ctx, cam, name) { const D = L[name], m = gmap(cam, D.p); ctx.save(); m.set(ctx); ctx.drawImage(IM[name] || (IM[name] = buildLayer(name)), D.x0, D.y0, D.w, D.h); ctx.restore(); return m; }

// ---------------------------------------------------------------- props
// the town of light at the node (where the curve comes from)
function town(ctx, t, m) {
  const r = prng(5); ctx.save(); m.set(ctx);
  for (let i = 0; i < 26; i++) { const x = NODE[0] - 160 + r() * 320, y = NODE[1] - 6 + r() * 18, w = 10 + r() * 16, h = 8 + r() * 20; ctx.fillStyle = '#100e26'; ctx.fillRect(x - w / 2, y - h, w, h); ctx.fillStyle = rgba('#ffc878', .55 + .4 * Math.sin(t * 2 + i)); ctx.fillRect(x - 2, y - h * .6, 2.4, 2.6); }
  ctx.restore();
  const X = m.X(NODE[0]), Y = m.Y(NODE[1] - 4); glowAt(ctx, X, Y, 230 * m.k, .5, F7.amber, F7.amberCore); glowAt(ctx, X, Y, 60 * m.k, .7, F7.amber, '#ffffff');
}
// a field of chip wafers: engraved discs on short stems, tilted up toward the line like a harvest facing the sun; die grid, a flat notch,
// the amber light of the line on their lower edge; they grow row by row outward from the line (u 0..1); a glint sweeps the field
const CHIPS = (() => {
  const r = prng(17), list = [];
  for (let row = 0; row < 5; row++) { const y = 846 + row * 46 + row * row * 6, n = 8 - (row > 2 ? 1 : 0); for (let i = 0; i < n; i++) list.push({ x: 300 + i * 112 + (row % 2) * 56 + (r() - .5) * 26, y: y + (r() - .5) * 10, ph: r() }); }
  for (let row = 0; row < 3; row++) { const y = 770 - row * 26; for (let i = 0; i < 10; i++) list.push({ x: 320 + i * 92 + (row % 2) * 46 + (r() - .5) * 20, y: y + (r() - .5) * 6, ph: r() }); }
  for (const c of list) { const d = (c.y - HZ) / 300; c.s = .45 + d * .6; c.dl = (Math.abs(c.y - 805) / 280) * .45 + c.ph * .08; c.tilt = (c.x - 760) * .0004 + (c.ph - .5) * .12; }
  return list.sort((a, b) => a.y - b.y);
})();
function chips(ctx, t, m, u0) {
  if (u0 <= 0) return;
  ctx.save(); m.set(ctx);
  const glintX = 150 + mod(t * 300, 1500);
  for (const c of CHIPS) {
    const u = ease.out(clamp((u0 - c.dl) / .5)); if (u <= 0) continue;
    const s = c.s, stem = 30 * s * u, cx = c.x + c.tilt * 20, cy = c.y - stem, rw = 36 * s * u, rh = 19 * s * u, below = c.y > 805;
    // shadow on the ground, then the stem
    ctx.fillStyle = 'rgba(4,4,14,.45)'; ctx.beginPath(); ctx.ellipse(c.x, c.y + 1, rw * .9, rw * .18, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#141230'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.quadraticCurveTo(c.x, c.y - stem * .6, cx, cy + rh * .4); ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(c.tilt + .04 * Math.sin(t * .8 + c.ph * 6));
    // the disc's edge (thickness), then the face
    ctx.fillStyle = '#0c0b20'; ctx.beginPath(); ctx.ellipse(0, 4.5 * s, rw, rh, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba('#ff9a40', .35); ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(0, 4.5 * s, rw, rh, 0, Math.PI * .15, Math.PI * .85); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, rw, rh, 0, Math.PI * .58, Math.PI * .42, false); ctx.closePath();
    const gr = ctx.createLinearGradient(-rw, -rh, rw, rh); gr.addColorStop(0, '#6a70b8'); gr.addColorStop(.3, '#2c2c64'); gr.addColorStop(.55, '#3a5470'); gr.addColorStop(.75, '#4a2c5c'); gr.addColorStop(1, '#c0703a');
    ctx.fillStyle = gr; ctx.fill();
    ctx.save(); ctx.clip();
    // the die grid (engraved), with a few dies catching light
    ctx.strokeStyle = 'rgba(190,196,255,.28)'; ctx.lineWidth = .55; ctx.beginPath();
    for (let q = -5; q <= 5; q++) { ctx.moveTo(q * rw / 5.5, -rh); ctx.lineTo(q * rw / 5.5, rh); ctx.moveTo(-rw, q * rh / 5.5); ctx.lineTo(rw, q * rh / 5.5); }
    ctx.stroke();
    for (let q = 0; q < 3; q++) { const dx = Math.floor(n1(c.ph * 40 + q * 3) * 4) * rw / 5.5, dy = Math.floor(n1(c.ph * 70 + q * 5) * 4) * rh / 5.5; ctx.fillStyle = rgba('#d8dcff', .12 + .12 * Math.sin(t * 1.4 + q + c.ph * 9)); ctx.fillRect(dx, dy, rw / 5.5, rh / 5.5); }
    // the glint sweeping the field
    const gx = (glintX - c.x) / 70; if (Math.abs(gx) < 1.6) { ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createLinearGradient(-rw, -rh, rw, rh); const p = clamp(.5 + gx * .3); gg.addColorStop(clamp(p - .18), 'rgba(255,241,214,0)'); gg.addColorStop(p, rgba('#fff1d6', .55 * (1 - Math.abs(gx) / 1.6))); gg.addColorStop(clamp(p + .18), 'rgba(255,241,214,0)'); ctx.fillStyle = gg; ctx.fillRect(-rw, -rh, rw * 2, rh * 2); }
    ctx.restore();
    // rims: cool on top (sky), amber on the lower edge (the line's light)
    ctx.lineWidth = .9; ctx.strokeStyle = rgba('#cfd4ff', .45); ctx.beginPath(); ctx.ellipse(0, 0, rw, rh, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    ctx.lineWidth = 1.3; ctx.strokeStyle = rgba('#ffb35c', below ? .55 : .85); ctx.beginPath(); ctx.ellipse(0, 0, rw, rh, 0, Math.PI * .12, Math.PI * .4); ctx.moveTo(-rw * .3, rh * .95); ctx.ellipse(0, 0, rw, rh, 0, Math.PI * .6, Math.PI * .88); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
// a power plant: two cooling towers and a turbine hall rise out of the ground (u), their windows light, steam breathes from the towers
function plant(ctx, t, m, u0) {
  if (u0 <= 0) return;
  const base = 748, towers = [[1560, 210, 118], [1735, 176, 100]], u = ease.out(clamp(u0 / .8)), lit = clamp((u0 - .5) / .4);
  ctx.save(); m.set(ctx);
  ctx.save(); ctx.beginPath(); ctx.rect(1300, 0, 700, base + 1); ctx.clip();
  // turbine hall
  { const y = base + 70 * (1 - u); ctx.fillStyle = '#121030'; ctx.fillRect(1600, y - 52, 190, 52); ctx.strokeStyle = 'rgba(150,140,230,.35)'; ctx.lineWidth = 1; ctx.strokeRect(1600, y - 52, 190, 52);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = rgba('#ffc878', lit * (.55 + .3 * Math.sin(t * 1.3 + i * 2))); ctx.fillRect(1610 + i * 20, y - 36, 8, 10); }
    ctx.fillStyle = '#121030'; ctx.fillRect(1700, y - 120, 12, 70); }
  for (const [x, h, w] of towers) {
    const y = base + (h + 20) * (1 - u), pts = [];
    for (let i = 0; i <= 20; i++) { const q = i / 20, ww = w * (.5 - .2 * Math.sin(Math.PI * Math.pow(q, .85)) + .02 * q); pts.push([ww, y - h * q]); }
    ctx.beginPath(); pts.forEach(([ww, yy], i) => (i ? ctx.lineTo(x - ww, yy) : ctx.moveTo(x - ww, yy))); for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(x + pts[i][0], pts[i][1]); ctx.closePath();
    const gr = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); gr.addColorStop(0, '#191740'); gr.addColorStop(.6, '#100f2a'); gr.addColorStop(1, '#0b0a20'); ctx.fillStyle = gr; ctx.fill();
    // engraved vertical hatching + the warm light from the line at the foot
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(90,80,170,.28)'; ctx.lineWidth = .8; ctx.beginPath(); for (let xx = x - w; xx < x + w; xx += 4) { ctx.moveTo(xx, y); ctx.lineTo(xx + 6, y - h); } ctx.stroke();
    const wl = ctx.createLinearGradient(0, y, 0, y - h * .6); wl.addColorStop(0, rgba('#ff9a40', .45 * lit + .15)); wl.addColorStop(1, 'rgba(255,154,64,0)'); ctx.fillStyle = wl; ctx.fillRect(x - w, y - h, w * 2, h);
    ctx.restore();
    ctx.strokeStyle = rgba('#ffc890', .55); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(x, y - h, pts[20][0], 5, 0, 0, TAU); ctx.stroke();
  }
  ctx.restore();
  // steam: puffs leaving the tops, lit amber from below, drifting right, breathing
  if (lit > 0) for (const [x, h, w] of towers) {
    for (let i = 0; i < 14; i++) {
      const life = 4.2, ph = (i / 14) * life, a = mod(t - ph, life) / life, age = mod(t - ph, life);
      if (t - (u0 > 0 ? 0 : 1e9) < 0) continue;
      const px = x + age * 22 + n1(i * 3.1 + age * .5) * 8, py = base - h - 8 - age * 34, rad = (w * .32) * (1 + age * .55);
      const g = ctx.createRadialGradient(px, py, 0, px, py, rad); g.addColorStop(0, rgba('#d8d0f0', .2 * lit * (1 - a))); g.addColorStop(.6, rgba('#a69cd8', .1 * lit * (1 - a))); g.addColorStop(1, 'rgba(160,150,220,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, rad, 0, TAU); ctx.fill();
    }
    const g2 = ctx.createRadialGradient(x, base - h, 0, x, base - h, w * .6); g2.addColorStop(0, rgba('#ffb35c', .2 * lit)); g2.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x, base - h, w * .6, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// one small robot silhouette (simple engraved humanoid, no face): x,y = feet, s = height in units; step 0..1 (one step forward)
export function robot(ctx, t, x, y, s, o = {}) {
  const step = o.step ?? 0, sw = Math.sin(Math.PI * step), ph = o.seed || 0, br = Math.sin(t * 1.3 + ph) * .006;
  ctx.save(); ctx.translate(x, y); const k = s / 100; ctx.scale(k, k);
  const body = o.col || '#0c0b22', rim = o.rim || '#ffb35c', ra = o.rimA ?? .8;
  const limb = (x1, y1, x2, y2, w) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineWidth = w; ctx.stroke(); };
  ctx.lineCap = 'round'; ctx.strokeStyle = body; ctx.fillStyle = body;
  const lift = sw * 6, hip = -48 - lift * .3;
  // legs (one swings forward = toward the viewer: drawn lower, a little longer)
  limb(-6, hip, -7 - sw * 2, -2, 9); limb(6, hip, 7 + sw * 2, -2 - lift, 9);
  // torso, arms, head (a rounded helmet with a thin dark visor band, no eyes)
  ctx.beginPath(); ctx.moveTo(-14, hip); ctx.lineTo(-17, hip - 34); ctx.quadraticCurveTo(0, hip - 41, 17, hip - 34); ctx.lineTo(14, hip); ctx.closePath(); ctx.fill();
  limb(-17, hip - 30, -21 + sw * 3, hip - 6, 6.5); limb(17, hip - 30, 21 - sw * 3, hip - 6, 6.5);
  ctx.beginPath(); ctx.roundRect(-8, hip - 58 + br * 100, 16, 18, 7); ctx.fill();
  // rim light from behind/above (the line glows behind them)
  ctx.strokeStyle = rgba(rim, ra); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.roundRect(-8, hip - 58 + br * 100, 16, 18, 7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-17, hip - 33); ctx.quadraticCurveTo(0, hip - 40, 17, hip - 33); ctx.stroke();
  ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(-21, hip - 26); ctx.lineTo(-23, hip - 8); ctx.moveTo(21, hip - 26); ctx.lineTo(23, hip - 8); ctx.stroke();
  ctx.strokeStyle = rgba('#3a3670', .9); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-6, hip - 50 + br * 100); ctx.lineTo(6, hip - 50 + br * 100); ctx.stroke();
  ctx.restore();
}
function robotsRow(ctx, t, m, u0, step) {
  if (u0 <= 0) return;
  ctx.save(); m.set(ctx);
  for (let i = 0; i < 7; i++) {
    const x = 2160 + i * 68, y = 800 + Math.sin(i * 1.7) * 3 + 14 * ease.io(step), dl = Math.abs(i - 3) * .06, u = clamp((u0 - dl) / .45);
    if (u <= 0) continue;
    // rise out of the dark: the silhouette comes up out of the ground line, rim light switches on last
    ctx.save(); ctx.beginPath(); ctx.rect(x - 60, y - 140, 120, 141); ctx.clip();
    robot(ctx, t, x, y + 100 * (1 - ease.out(u)), 96, { step: clamp(step * 1.15 - i * .02), seed: i, rimA: .85 * clamp((u - .5) * 2) });
    ctx.restore();
    const g = ctx.createRadialGradient(x, y, 0, x, y, 40); g.addColorStop(0, 'rgba(4,4,12,.5)'); g.addColorStop(1, 'rgba(4,4,12,0)'); ctx.save(); ctx.translate(x, y); ctx.scale(1, .2); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 40 * u, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.restore();
}
// the stage: a wide low platform, a truss frame, side light towers, spotlights, the screen; robots at the flanks; the speaker; the audience
function stageBack(ctx, t, m, st) {
  const S = STAGE, x0 = S.sx - S.sw / 2, y0 = S.sy - S.sh / 2;
  ctx.save(); m.set(ctx);
  // truss frame and legs
  ctx.strokeStyle = '#1b1a3c'; ctx.lineWidth = 7; ctx.strokeRect(x0 - 26, y0 - 34, S.sw + 52, S.y - y0 + 34);
  ctx.strokeStyle = 'rgba(140,130,220,.4)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = x0 - 26; x < x0 + S.sw + 26; x += 12) { ctx.moveTo(x, y0 - 37); ctx.lineTo(x + 6, y0 - 31); ctx.lineTo(x + 12, y0 - 37); }
  ctx.stroke();
  // side light towers with lamps
  for (const sx of [x0 - 140, x0 + S.sw + 140]) {
    ctx.fillStyle = '#121030'; ctx.fillRect(sx - 6, y0 - 10, 12, S.y - y0 + 10);
    for (let i = 0; i < 3; i++) { const ly = y0 + 10 + i * 34; ctx.fillStyle = '#1c1a40'; ctx.beginPath(); ctx.arc(sx, ly, 9, 0, TAU); ctx.fill(); ctx.fillStyle = rgba('#e8eef6', .5 + .1 * Math.sin(t * 2 + i)); ctx.beginPath(); ctx.arc(sx, ly, 4.5, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
  for (const sx of [x0 - 140, x0 + S.sw + 140]) for (let i = 0; i < 3; i++) glowAt(ctx, m.X(sx), m.Y(y0 + 10 + i * 34), 26 * m.k, .35, '#cfe0f0', '#ffffff');
}
function stageFront(ctx, t, m, st, T) {
  const S = STAGE;
  ctx.save(); m.set(ctx);
  // the platform: top surface, front face with a fine cool edge line
  ctx.fillStyle = '#100f26'; ctx.beginPath(); ctx.moveTo(3820, 602); ctx.lineTo(4580, 602); ctx.lineTo(4640, 640); ctx.lineTo(3760, 640); ctx.closePath(); ctx.fill();
  const tg = ctx.createLinearGradient(0, 602, 0, 640); tg.addColorStop(0, rgba('#cfe0f0', .06 + .12 * st.clipOn)); tg.addColorStop(1, 'rgba(207,224,240,0)'); ctx.fillStyle = tg; ctx.fill();
  ctx.fillStyle = '#0a0a1c'; ctx.fillRect(3760, 640, 880, 22);
  ctx.strokeStyle = rgba('#cfe6ff', .55); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(3760, 640); ctx.lineTo(4640, 640); ctx.stroke();
  // robots at the flanks (small, still, a slow breath)
  for (const [x, f] of [[3880, 0], [3930, 1], [4470, 2], [4520, 3]]) robot(ctx, t, x, 606, 46, { seed: f + 9, rim: '#cfe0f0', rimA: .5 + .3 * st.clipOn });
  ctx.restore();
  // the speaker under the spotlight (figure scale), before and after the clip
  { const hx = m.X(4130), hy = m.Y(588), s = .2 * m.k;
    ctx.save(); figure(ctx, hx, hy, s, { ...POSES.stand, sh: [1.25, .12], el: [1.75, .3] }, { t, seed: 4, dress: { coat: '#15142c', pants: '#0d0c1e' }, rim: '#e8eef6', rimSide: -1, shadow: true }); ctx.restore(); }
  // spotlight cone from the truss onto the speaker
  { const ax = m.X(4060), ay = m.Y(STAGE.sy - STAGE.sh / 2 - 34), bx = m.X(4130), by = m.Y(600), k = m.k;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(ax, ay, bx, by); g.addColorStop(0, rgba('#e8eef6', .2 * st.spot)); g.addColorStop(1, rgba('#e8eef6', .04 * st.spot));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ax - 4 * k, ay); ctx.lineTo(ax + 4 * k, ay); ctx.lineTo(bx + 34 * k, by); ctx.lineTo(bx - 34 * k, by); ctx.closePath(); ctx.fill();
    const pg = ctx.createRadialGradient(bx, by, 0, bx, by, 50 * k); pg.addColorStop(0, rgba('#e8eef6', .3 * st.spot)); pg.addColorStop(1, 'rgba(232,238,246,0)'); ctx.save(); ctx.translate(bx, by); ctx.scale(1, .22); ctx.translate(-bx, -by); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(bx, by, 50 * k, 0, TAU); ctx.fill(); ctx.restore();
    // dust motes in the beam
    const r = prng(3); for (let i = 0; i < 40; i++) { const q = r(), px = mix(ax, bx, q) + (r() - .5) * 60 * k * q + Math.sin(t * .7 + i) * 5 * k, py = mix(ay, by, q) + Math.cos(t * .5 + i * 2) * 4 * k; ctx.fillStyle = rgba('#ffffff', .25 * st.spot * (.5 + .5 * Math.sin(t * 2 + i))); ctx.fillRect(px, py, 1.4, 1.4); }
    ctx.restore(); }
  // the audience: rows of heads and shoulders in front of the stage, lit at the rim by the screen
  ctx.save(); m.set(ctx);
  const r = prng(44);
  for (let row = 0; row < 5; row++) for (let i = 0; i < 26; i++) {
    const y = 668 + row * 15, x = 3780 + i * 33 + (row % 2) * 16 + (r() - .5) * 8, s = .9 + row * .12, bob = Math.sin(t * (.6 + r() * .5) + i + row) * .8;
    ctx.fillStyle = '#08081a'; ctx.beginPath(); ctx.ellipse(x, y + 8 * s, 12 * s, 9 * s, 0, Math.PI, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x, y - 3 * s + bob, 5.4 * s, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba('#cfe0f0', .22 + .35 * st.clipOn); ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(x, y - 3 * s + bob, 5.4 * s, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  }
  ctx.restore();
}
// the screen: dark glass with SUSTAINABLE ABUNDANCE in light; opens (TV line) into the clip frames while clipOn > 0
function screen(ctx, t, T, m, st) {
  const S = STAGE, x = m.X(S.sx - S.sw / 2), y = m.Y(S.sy - S.sh / 2), w = S.sw * m.k, h = S.sh * m.k, on = st.clipOn;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#141a44'); g.addColorStop(1, '#0a0c26'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // the words in light (with a soft bloom); they brighten with "sustainable abundance"
  const wa = st.words ?? 1, sz = h * .15;
  if (wa > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const bl = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, w * .5); bl.addColorStop(0, rgba('#b8c8ff', .16 * wa)); bl.addColorStop(1, 'rgba(184,200,255,0)'); ctx.fillStyle = bl; ctx.fillRect(x, y, w, h);
    ctx.restore();
    for (const [s, dy] of [['SUSTAINABLE', -.08], ['ABUNDANCE', .14]]) text(ctx, s, x + w / 2, y + h * (.5 + dy) + sz * .35, { size: sz, weight: 600, color: rgba('#eef2ff', .95 * wa), align: 'center', spacing: sz * .22 });
  }
  ctx.globalAlpha = .06; ctx.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 3 * Math.max(1, m.k)) ctx.fillRect(x, yy, w, 1.2 * Math.max(1, m.k)); ctx.globalAlpha = 1;
  // the clip: a horizontal line opens into the real footage (and closes after it)
  if (on > 0) {
    const c = T.clip('C1'), hv = Math.max(2, h * ease.out(on)), k = Math.floor(clamp(t - c.start, 0, c.end - c.start - 1 / 30) * 30) + 1, fr = clipFrame('C1', k);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y + h / 2 - hv / 2, w, hv); ctx.clip();
    if (fr) { const s2 = Math.max(w / fr.width, h / fr.height); ctx.drawImage(fr, x + (w - fr.width * s2) / 2, y + (h - fr.height * s2) / 2, fr.width * s2, fr.height * s2); }
    else { ctx.fillStyle = '#1a2250'; ctx.fillRect(x, y, w, h); }
    ctx.globalAlpha = .05; ctx.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 4) ctx.fillRect(x, yy, w, 1.5); ctx.globalAlpha = 1;
    const vg = ctx.createRadialGradient(x + w / 2, y + h / 2, Math.min(w, h) * .4, x + w / 2, y + h / 2, Math.max(w, h) * .72); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, 'rgba(5,6,15,.35)'); ctx.fillStyle = vg; ctx.fillRect(x, y, w, h);
    ctx.restore();
    if (on < .999) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const yy of [y + h / 2 - hv / 2, y + h / 2 + hv / 2]) for (const [lw, al] of [[18, .08], [6, .25], [1.6, .95]]) { ctx.strokeStyle = rgba(lw < 2 ? F7.coolCore : F7.cool, al * (1 - on * .6)); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); } ctx.restore(); }
  }
  // the glass sheen
  const sh = ctx.createLinearGradient(x, y, x + w, y + h); sh.addColorStop(0, 'rgba(216,247,255,.06)'); sh.addColorStop(.5, 'rgba(216,247,255,0)'); ctx.fillStyle = sh; ctx.fillRect(x, y, w, h);
  ctx.restore();
  ctx.strokeStyle = rgba('#cfe6ff', .35); ctx.lineWidth = Math.max(1, 1.2 * m.k); ctx.strokeRect(x, y, w, h);
  // the screen light spills into the night
  if (on > 0 || wa > 0) glowAtSoft(ctx, x + w / 2, y + h / 2, w * .95, .07 + .1 * on);
  return { x, y, w, h };
}
function glowAtSoft(ctx, x, y, r, a) { const g = ctx.createRadialGradient(x, y, r * .3, x, y, r); g.addColorStop(0, rgba('#cfe0f0', a)); g.addColorStop(1, 'rgba(207,224,240,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
// people at figure scale on the rise, seen from behind, looking up at the curve
function people(ctx, t, m, u) {
  if (u <= 0) return;
  const P = [[3180, 652, 4, '#2c3656', '#c98a3c'], [3236, 646, 7, '#3a2c44', '#e0b24a'], [3300, 645, 11, '#22304a', '#b4563a'], [3350, 648, 2, '#33364e', '#d8a050'], [3410, 653, 13, '#2a2a40', '#9a6a3a']];
  for (const [x, y, seed, coat, acc] of P) {
    const X = m.X(x), Y = m.Y(y), s = .36 * m.k;
    figureBack(ctx, X, Y, s, { t, seed, hold: 'none', dress: { coat }, accent: acc, headTilt: -.25, light: { x: m.X(RISE_X), y: m.Y(200), col: F7.amber, a: .9 } });
  }
}
// ---------------------------------------------------------------- the frame
export function ground(ctx, t, T, cam, st = {}) {
  const m1 = gmap(cam, 1), skyO = { ox: -(cam.x ?? 0) * .05 + 600, oy: (cam.tilt ?? 0) * .95 - ((cam.y ?? 540) - 540) * .06 - 260, ang: -.62 };
  sky(ctx, t, { ...skyO, horizon: gmap(cam, .22).Y(HZ - 40) });
  drawLayer(ctx, cam, 'far'); drawLayer(ctx, cam, 'ridge');
  const mh = drawLayer(ctx, cam, 'hills');
  // the homes light up (a wave from the line outward) on "everyone"
  if ((st.homes ?? 0) > 0) {
    ctx.save(); mh.set(ctx); ctx.globalCompositeOperation = 'lighter';
    for (const hm of HOMES) { const u = clamp((st.homes - hm.t * .7) / .3); if (u <= 0 || hm.dark) continue; ctx.fillStyle = rgba('#ffc878', .85 * u * (.85 + .15 * Math.sin(t * 1.7 + hm.x))); ctx.fillRect(hm.x, hm.y, hm.w, hm.h); ctx.fillStyle = rgba('#ffb35c', .1 * u); ctx.fillRect(hm.x - hm.w * 1.5, hm.y - hm.h * 1.2, hm.w * 4, hm.h * 3.4); const R = hm.w * 8, g = ctx.createRadialGradient(hm.x + hm.w / 2, hm.y + hm.h / 2, 0, hm.x + hm.w / 2, hm.y + hm.h / 2, R); g.addColorStop(0, rgba('#ffb35c', .3 * u)); g.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = g; ctx.fillRect(hm.x + hm.w / 2 - R, hm.y + hm.h / 2 - R, 2 * R, 2 * R); }
    ctx.restore();
  }
  // mist at the horizon
  { const y = mh.Y(548), g = ctx.createLinearGradient(0, y - 60 * mh.k, 0, y + 50 * mh.k); g.addColorStop(0, 'rgba(90,80,170,0)'); g.addColorStop(.6, 'rgba(90,80,170,.16)'); g.addColorStop(1, 'rgba(60,50,120,0)'); ctx.fillStyle = g; ctx.fillRect(0, y - 60 * mh.k, W, 110 * mh.k); }
  drawLayer(ctx, cam, 'plain');
  // the curve: projected, widths by depth and zoom
  const m = m1, pts = GCURVE.map(([x, y, d]) => [m.X(x), m.Y(y), clamp(d * Math.min(1.6, .55 + .45 * m.k), .25, 1.8)]);
  // warm light pool on the ground along the foot
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [lw, al] of [[300, .008], [230, .009], [170, .011], [120, .013], [80, .016], [46, .02]]) { ctx.strokeStyle = rgba('#ff9a40', al * (st.curveBr ?? 1)); ctx.lineWidth = lw * m.k * .6; ctx.beginPath(); let on = false; for (let i = 0; i < GCURVE.length; i += 3) { const [x, y] = GCURVE[i]; if (y < 590) break; on ? ctx.lineTo(m.X(x), m.Y(y + 6)) : ctx.moveTo(m.X(x), m.Y(y + 6)); on = true; } ctx.stroke(); }
    ctx.restore(); }
  town(ctx, t, m);
  // stage back (behind the rising curve? no: the curve rises BEHIND the stage) → curve first, then the stage
  const cv = curve(ctx, t, pts, { w: st.curveW ?? 1, br: st.curveBr ?? 1, sparks: st.sparks ?? 3, tip: false, seed: 7 });
  stageBack(ctx, t, m, st);
  const scr = screen(ctx, t, T, m, st);
  // the props along the line
  chips(ctx, t, m, st.chips ?? 0);
  plant(ctx, t, m, st.plant ?? 0);
  robotsRow(ctx, t, m, st.robots ?? 0, st.step ?? 0);
  stageFront(ctx, t, m, { spot: st.spot ?? 1, clipOn: st.clipOn ?? 0 }, T);
  people(ctx, t, m, st.people ?? 1);
  // ground fog drifting low over the plain
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const fx = mod(i * 900 + t * 14 * (1 + i * .2), 6000) - 1200, fy = 640 + i * 28, X = m.X(fx), Y = m.Y(fy), R = 520 * m.k; const g = ctx.createRadialGradient(X, Y, 0, X, Y, R); g.addColorStop(0, 'rgba(110,100,190,.07)'); g.addColorStop(1, 'rgba(110,100,190,0)'); ctx.save(); ctx.translate(X, Y); ctx.scale(1, .16); ctx.translate(-X, -Y); ctx.fillStyle = g; ctx.fillRect(X - R, Y - R, 2 * R, 2 * R); ctx.restore(); } ctx.restore(); }
  return { screen: scr, curve: cv, skyO, m };
}
