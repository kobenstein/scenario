// Film 7 · c02 · the world of "the part that feeds the machines" (01a). Builder: c02. Pure functions of t, deterministic.
// A night plain (layers copied from f7_c01_ground.mjs with their own seeds, so c02 is another place of the same world). The amber line from
// the c01>c02 plate lies on the plain as a long engraved TIMELINE (world x = year: YX(year)); at 2025 a long low data center sits behind it,
// fed by a branch of the line on three pylons; its own curve climbs steeply from the roof. Left on the line: 1865, a steam engine on its coal.
//   c2Prepare()                                    builds the cached layers as Images (call once, await)
//   gmap(cam, p)                                   horizon-anchored parallax camera (c01's): { k, X, Y, Xi, Yi, set(ctx) }
//   world(ctx, t, cam, st)                         draws sky, ridges, hills (homes), plain (towns), fore rise, line, ticks, DC, engine, sparks …
//       st = { skyFn (ctx, t) alt sky | null, lights 0..1 (wave from the DC outward), feedW, climbU, climbW, climbBr, feedU, hall2 0..1, dcOn 0..1,
//              lineW, ticksA, ticksR (years ≤ 2000 labels), person {x, y (fore coords), s, sparks:[{t0, dur, r0, r1, ts}]}, stream 0..1,
//              streamTiny 0..1, burst, bracket 0..1, engine 1, sheets: fn(ctx, t, m) }
//   sheetTex(ctx, M) / SHEET helpers                the paper of the quote card and the plan pages: base + fibres in paper units relative to a
//       focus point, so two sheets seen at the same focus/zoom are the identical picture (the fly-through match).
//   skyP(ctx, t, oy)                               a copy of handoff4's night sky plate with a vertical offset: oy = 0 → identical to the plate.
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas, text, rough, poly } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { figure, figureBack, POSES } from './figure.mjs';
import { F7, sky, curve, ease, glowAt, n1, mod } from './f7_kit.mjs';

const TAU = Math.PI * 2;
export const HZ = 560, LY = 650;
export const YX = (y) => (y - 2025) * 6;            // timeline: world x of a year (2025 → 0, 2425 → 2400, 1865 → -960)
export const DC = { x0: 40, x1: 330, base: 600, h: 44, dx: 30, dy: -26 }, DC2 = { x0: 380, x1: 670, base: 600, h: 44, dx: 30, dy: -26 };
export const ENG = { x: -965, base: 632 };            // the 1865 engine (firebox x), rails at base
// ---------------------------------------------------------------- camera (c01's gmap + inverses)
export function gmap(cam, p = 1) {
  const z = cam.z ?? 1, k = 1 + (z - 1) * p, cx = W / 2 + ((cam.x ?? W / 2) - W / 2) * p, Yh = H / 2 + (HZ - (cam.y ?? H / 2)) * z + (cam.tilt ?? 0);
  return { k, cx, Yh, X: (x) => W / 2 + (x - cx) * k, Y: (y) => Yh + (y - HZ) * k, Xi: (sx) => cx + (sx - W / 2) / k, Yi: (sy) => HZ + (sy - Yh) / k, set: (ctx) => ctx.setTransform(k, 0, 0, k, W / 2 - cx * k, Yh - HZ * k) };
}
// frame a world point (plain, p = 1) at a screen point with zoom z → cam
export const frameAt = (x, y, sx, sy, z) => ({ x: x - (sx - W / 2) / z, y: y - (sy - H / 2) / z, z });

// ---------------------------------------------------------------- cached layers
const IM = {};
const L = { far: { p: .22, x0: -2600, y0: 220, w: 6400, h: 420, k: 1 }, ridge: { p: .38, x0: -2600, y0: 300, w: 6800, h: 380, k: 1 }, hills: { p: .58, x0: -2600, y0: 330, w: 7400, h: 410, k: 1.2 }, plain: { p: 1, x0: -2800, y0: HZ - 30, w: 6800, h: 1000, k: 1.05 } };
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
// lit windows: hills homes (layer hills) and plain towns (layer plain); each { x, y, w, h, d (distance from the DC, 0..1 → wave delay), dark }
export const HOMES = [], TOWNS = [], PHONES = [];
const dcX = (DC.x0 + DC.x1) / 2;
function house(g, r, x, gy, s, list, wd) {
  const w = (16 + r() * 12) * s, h = (11 + r() * 7) * s, roof = (7 + r() * 6) * s;
  g.fillStyle = '#0d0d26'; g.beginPath(); g.moveTo(x - w / 2, gy); g.lineTo(x - w / 2, gy - h); g.lineTo(x - w * .1, gy - h - roof); g.lineTo(x + w / 2, gy - h); g.lineTo(x + w / 2, gy); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(120,110,200,.35)'; g.lineWidth = .7; g.beginPath(); g.moveTo(x - w / 2, gy - h); g.lineTo(x - w * .1, gy - h - roof); g.lineTo(x + w / 2, gy - h); g.stroke();
  const nw = 1 + Math.floor(r() * 2.5); for (let q = 0; q < nw; q++) list.push({ x: x - w / 2 + w * (q + .5) / nw - 1.6 * s, y: gy - h * .62, w: 3.4 * s, h: 4 * s, d: clamp(Math.abs(x - dcX) / wd) * .8 + r() * .2, dark: r() < .08 });
  if (r() < .3) { g.fillStyle = '#0d0d26'; g.fillRect(x + w * .2, gy - h - roof * .9, 3 * s, roof * .7); }
}
const CLUSTERS = [[-520, 700, 7], [-300, 760, 9], [-120, 690, 6], [520, 690, 8], [760, 740, 11], [980, 680, 7], [1180, 790, 12], [1420, 700, 8], [1650, 760, 10], [-40, 820, 9], [430, 830, 10], [1900, 690, 7], [2200, 740, 9], [-700, 830, 8], [860, 900, 11]];
function buildLayer(name) {
  const D = L[name], [c, g] = canvas(Math.ceil(D.w * D.k), Math.ceil(D.h * D.k)); g.setTransform(D.k, 0, 0, D.k, -D.x0 * D.k, -D.y0 * D.k);
  const bot = D.y0 + D.h;
  if (name === 'far') {
    const p1 = ridgeLine(41, D.x0, D.w, 470, 120, .0016); fillRidge(g, p1, bot, '#26245a', '#8478d0', .45); hatchIn(g, p1, bot, '#5a50a8', .12, 7, -2.3, 3);
    const p2 = ridgeLine(42, D.x0, D.w, 525, 70, .0024); fillRidge(g, p2, bot, '#1f1d4c', '#7064c0', .35);
    const mg = g.createLinearGradient(0, 480, 0, 600); mg.addColorStop(0, 'rgba(70,60,140,0)'); mg.addColorStop(1, 'rgba(70,60,140,.35)'); g.fillStyle = mg; g.fillRect(D.x0, 480, D.w, 160);
  } else if (name === 'ridge') {
    const p1 = ridgeLine(51, D.x0, D.w, 540, 80, .0022); fillRidge(g, p1, bot, '#19183f', '#6a5cb8', .35); hatchIn(g, p1, bot, '#3c3680', .16, 6, -2.2, 5);
  } else if (name === 'hills') {
    const n = vnoise(61), pts = []; for (let x = D.x0; x <= D.x0 + D.w; x += 5) pts.push([x, 538 - 40 * (fbm(n, x * .0018, 3, 3) - .3) - 16 * Math.sin(x * .004)]);
    fillRidge(g, pts, bot, '#141436', '#5a50a8', .4); hatchIn(g, pts, bot, '#2e2a66', .2, 5, -2.5, 7);
    const r = prng(97);
    for (let x = D.x0 + 60; x < D.x0 + D.w - 60; x += 18 + r() * 46) {
      if (r() < .2) continue;
      const j = Math.min(pts.length - 1, Math.max(0, Math.round((x - D.x0) / 5))), gy = Math.min(553, pts[j][1] + 5 + r() * 16), s = .7 + r() * .45;
      house(g, r, x, gy, s, HOMES, 2600);
    }
    for (let i = 0; i < 200; i++) { const x = D.x0 + r() * D.w, j = Math.round((x - D.x0) / 5), y = pts[Math.min(pts.length - 1, j)][1] + 2, h = 10 + r() * 16; g.fillStyle = '#101030'; g.beginPath(); g.moveTo(x - h * .25, y); g.lineTo(x, y - h); g.lineTo(x + h * .25, y); g.closePath(); g.fill(); }
  } else if (name === 'plain') {
    const gr = g.createLinearGradient(0, HZ, 0, D.y0 + D.h); gr.addColorStop(0, '#24224e'); gr.addColorStop(.06, '#191838'); gr.addColorStop(.35, '#100f28'); gr.addColorStop(1, '#08081a');
    g.fillStyle = gr; g.fillRect(D.x0, HZ - 4, D.w, D.h);
    const r = prng(191), n = vnoise(193);
    for (let i = 0; i < 260; i++) {
      const d = Math.pow(i / 260, 2.1), y = HZ + 4 + d * (D.y0 + D.h - HZ), al = (.04 + .07 * (1 - d * .5)) * clamp(d * 14) * (i % 3 === 0 ? 1 : .55);
      g.strokeStyle = rgba('#6d64c0', al); g.lineWidth = .5 + d * .8; g.beginPath(); let on = false;
      for (let x = D.x0; x < D.x0 + D.w; x += 14) { const v = fbm(n, x * .004, y * .02, 2); if (v < .42) { on = false; continue; } const yy = y + (v - .5) * 6 * (1 + d * 4); on ? g.lineTo(x, yy) : g.moveTo(x, yy); on = true; }
      g.stroke();
    }
    for (let i = 0; i < 2600; i++) { const x = D.x0 + r() * D.w, d = r(), y = HZ + 20 + d * d * (D.h - 60), s = 1 + d * 7; g.strokeStyle = rgba('#3a3678', .25 + .2 * r()); g.lineWidth = .6 + d; g.beginPath(); for (let q = 0; q < 3; q++) { g.moveTo(x + q * s * .4, y); g.lineTo(x + q * s * .4 + (r() - .5) * s, y - s * (1 + r())); } g.stroke(); }
    // towns on the plain (dark now; their windows light up on "doesn't"); a few people with phones among them
    for (const [cx, cy, nh] of CLUSTERS) {
      for (let i = 0; i < nh; i++) { const x = cx + (r() - .5) * 26 * nh, y = cy + (r() - .5) * 22, s = .55 + (y - 600) / 300 * .7; house(g, r, x, y, s, TOWNS, 2400); }
      for (let i = 0; i < nh * 2; i++) PHONES.push({ x: cx + (r() - .5) * 30 * nh, y: cy + 6 + (r() - .5) * 26, d: clamp(Math.abs(cx - dcX) / 2400) * .8 + r() * .2 });
    }
  }
  return c;
}
// the near rise for the person (fore layer, p = FP), built in fore units around the person's feet (fx, fy) given by the scene
export const FP = 1.6;
let FORE = null;
function buildFore(fx, fy) {
  const x0 = fx - 900, x1 = fx + 700, y0 = fy - 60, y1 = fy + 420, k = 1.3, [c, g] = canvas(Math.ceil((x1 - x0) * k), Math.ceil((y1 - y0) * k));
  g.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
  const n = vnoise(303), pts = [];
  for (let x = x0; x <= x1; x += 6) { const q = (x - fx) / 420, crest = Math.exp(-q * q * (q > 0 ? 2.2 : .8)); pts.push([x, fy + 8 + 520 * (1 - crest) - 10 * (fbm(n, x * .01, 1, 3) - .5)]); }
  fillRidge(g, pts, y1, '#0b0b20', '#6a5cb8', .5); hatchIn(g, pts, y1, '#1e1c48', .4, 4, -2.3, 13);
  // grass on the crest
  const r = prng(55); g.lineWidth = 1;
  for (let i = 0; i < 420; i++) { const x = x0 + r() * (x1 - x0), j = Math.min(pts.length - 1, Math.round((x - x0) / 6)), y = pts[j][1] + 1, h = 4 + r() * 9; g.strokeStyle = rgba('#1a1840', .9); g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .5) * 5, y - h); g.stroke(); }
  return { c, x0, y0, w: x1 - x0, h: y1 - y0, pts };
}
let READY = false;
export async function c2Prepare(fore) {
  if (READY) return; READY = true;
  for (const k of Object.keys(L)) IM[k] = await loadImage(buildLayer(k).toBuffer('image/png'));
  const F = buildFore(fore.x, fore.y); FORE = { ...F, img: await loadImage(F.c.toBuffer('image/png')) }; delete FORE.c;
  await sheetPrepare();
}
function drawLayer(ctx, cam, name) { const D = L[name], m = gmap(cam, D.p); ctx.save(); m.set(ctx); ctx.drawImage(IM[name], D.x0, D.y0, D.w, D.h); ctx.restore(); return m; }
export const foreY = (x) => { if (!FORE) return 0; const j = clamp(Math.round((x - FORE.x0) / 6), 0, FORE.pts.length - 1); return FORE.pts[j][1]; };

// ---------------------------------------------------------------- the data center (engraved, seen a little from above)
// hall(ctx, t, g, u 0..1 (built panel by panel out of the ground), on 0..1 (lights, fans), heat 0..1)
function hall(ctx, t, G, u, on, seed = 1) {
  const { x0, x1, base, h, dx, dy } = G, np = Math.round((x1 - x0) / 24), pw = (x1 - x0) / np;
  // contact shadow
  if (u > 0) { const g = ctx.createLinearGradient(0, base - 2, 0, base + 14); g.addColorStop(0, 'rgba(4,4,14,.55)'); g.addColorStop(1, 'rgba(4,4,14,0)'); ctx.fillStyle = g; ctx.fillRect(x0 - 6, base - 2, (x1 - x0) * clamp(u * 1.2) + dx + 10, 16); }
  for (let i = 0; i < np; i++) {
    const r = ease.out(clamp(u * (np + 3) / 4 - i * .25)); if (r <= 0) continue;
    const a = x0 + i * pw, b = a + pw, top = base - h * r;
    // roof slice (once the panel is up)
    if (r > .97) {
      ctx.fillStyle = '#1a1940'; ctx.beginPath(); ctx.moveTo(a, top); ctx.lineTo(b, top); ctx.lineTo(b + dx, top + dy); ctx.lineTo(a + dx, top + dy); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(150,140,230,.22)'; ctx.lineWidth = .5; ctx.beginPath(); for (let q = 1; q < 4; q++) { ctx.moveTo(a + dx * q / 4, top + dy * q / 4); ctx.lineTo(b + dx * q / 4, top + dy * q / 4); } ctx.stroke();
    }
    // front panel: dark cladding, engraved ribs
    const g = ctx.createLinearGradient(0, top, 0, base); g.addColorStop(0, '#16153a'); g.addColorStop(1, '#0c0b22'); ctx.fillStyle = g; ctx.fillRect(a, top, pw + .4, base - top);
    ctx.strokeStyle = 'rgba(110,100,200,.2)'; ctx.lineWidth = .45; ctx.beginPath(); for (let y = top + 3; y < base - 1; y += 3) { ctx.moveTo(a, y); ctx.lineTo(b, y); } ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(b, top); ctx.lineTo(b, base); ctx.stroke();
    if (r < 1) { ctx.strokeStyle = rgba('#ffb35c', .7 * (1 - r)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a, top); ctx.lineTo(b, top); ctx.stroke(); }
    // vents: a row of slits that glow cool when the machines run
    if (r > .6) for (let k = 0; k < 3; k++) for (let row = 0; row < 2; row++) { const vx = a + pw * (.14 + k * .28), vy = base - h * (.7 - row * .2); ctx.fillStyle = on > 0 ? rgba('#cfe4ff', .12 + .4 * on * (.8 + .2 * Math.sin(t * 2.3 + i * 1.7 + k * 2.1 + row))) : '#0a0a1c'; ctx.fillRect(vx, vy, pw * .16, 1.6); }
    if (r > .6 && i % 4 === 0) { ctx.strokeStyle = 'rgba(160,150,235,.28)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(a + .5, top + 2); ctx.lineTo(a + .5, base); ctx.stroke(); }
    if (r > .6 && i % 3 === 1) { ctx.fillStyle = rgba('#ffb35c', on * (.5 + .5 * Math.sin(t * 5.1 + i))); ctx.fillRect(a + pw * .5, base - h * .25, 1.3, 1.3); }
  }
  if (u >= 1) {
    // right side face
    ctx.fillStyle = '#0a0a1e'; ctx.beginPath(); ctx.moveTo(x1, base); ctx.lineTo(x1, base - h); ctx.lineTo(x1 + dx, base - h + dy); ctx.lineTo(x1 + dx, base + dy); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(160,150,235,.4)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(x0, base - h); ctx.lineTo(x1, base - h); ctx.lineTo(x1 + dx, base - h + dy); ctx.lineTo(x0 + dx, base - h + dy); ctx.closePath(); ctx.stroke();
    // roof fans: housings with turning blades (spin up with the machines)
    const nf = Math.floor((x1 - x0) / 34), sp = .5 + 7 * on;
    for (let i = 0; i < nf; i++) {
      const fx = x0 + 17 + i * ((x1 - x0 - 34) / (nf - 1)) + dx * .5, fy = base - h + dy * .5, rx = 12, ry = 6.5;
      ctx.fillStyle = '#0b0a1e'; ctx.fillRect(fx - rx, fy - 3, rx * 2, 3); ctx.beginPath(); ctx.ellipse(fx, fy + .5, rx, ry, 0, 0, Math.PI); ctx.fill(); ctx.beginPath(); ctx.ellipse(fx, fy - 3, rx, ry, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba('#a8a0e8', .55); ctx.lineWidth = .7; ctx.stroke();
      const ang = t * sp + i * 1.3 + seed;
      ctx.strokeStyle = rgba('#8c86d0', .7); ctx.lineWidth = 1.1; ctx.beginPath();
      for (let q = 0; q < 4; q++) { const a = ang + q * TAU / 4; ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.cos(a) * rx * .85, fy + Math.sin(a) * ry * .85); }
      ctx.stroke();
      if (on > 0) { ctx.strokeStyle = rgba('#ffb35c', .35 * on); ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(fx, fy, rx, ry, 0, .1, Math.PI - .1); ctx.stroke(); }
    }
    // waste heat: fine shimmering lines rising from the fans
    if (on > 0) {
      ctx.lineCap = 'round';
      for (let i = 0; i < nf; i++) {
        const fx = x0 + 17 + i * ((x1 - x0 - 34) / (nf - 1)) + dx * .5, fy = base - h + dy * .5;
        for (let k = 0; k < 2; k++) {
          const ph = mod(t / 2.2 + i * .37 + k * .5, 1), y0 = fy - 4 - ph * 46, al = on * .22 * Math.sin(Math.PI * ph);
          ctx.strokeStyle = rgba('#ffcf96', al); ctx.lineWidth = .7; ctx.beginPath();
          for (let q = 0; q <= 8; q++) ctx[q ? 'lineTo' : 'moveTo'](fx + Math.sin(q * 1.1 + t * 5 + i + k * 2) * 2.2 + (k - .5) * 6, y0 - q * 2.4);
          ctx.stroke();
        }
      }
    }
  }
}
// a lattice pylon (x = foot centre, base, height h)
function pylon(ctx, x, base, h) {
  const w = h * .26, top = base - h;
  ctx.strokeStyle = '#141236'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x - w, base); ctx.lineTo(x - w * .18, top + h * .18); ctx.lineTo(x, top); ctx.lineTo(x + w * .18, top + h * .18); ctx.lineTo(x + w, base); ctx.stroke();
  ctx.lineWidth = .7; ctx.strokeStyle = 'rgba(150,140,230,.5)'; ctx.beginPath();
  for (let q = 0; q < 5; q++) { const y1 = base - h * .82 * q / 5, y2 = base - h * .82 * (q + 1) / 5, a1 = mix(w, w * .18, (base - y1) / (h * .82)), a2 = mix(w, w * .18, (base - y2) / (h * .82)); ctx.moveTo(x - a1, y1); ctx.lineTo(x + a2, y2); ctx.moveTo(x + a1, y1); ctx.lineTo(x - a2, y2); }
  ctx.stroke();
  ctx.strokeStyle = '#141236'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - w * .9, top + h * .2); ctx.lineTo(x + w * .9, top + h * .2); ctx.stroke();
  ctx.strokeStyle = 'rgba(207,224,240,.45)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(x - w * .9, top + h * .2 - .8); ctx.lineTo(x + w * .9, top + h * .2 - .8); ctx.moveTo(x - w * .18, top + h * .18); ctx.lineTo(x, top); ctx.stroke();
}
export const PYL = [[-176, 644, 74], [-84, 628, 64], [-6, 614, 56]];
const sag = (a, b, d, n = 14) => { const o = []; for (let i = 0; i <= n; i++) { const q = i / n; o.push([mix(a[0], b[0], q), mix(a[1], b[1], q) + Math.sin(Math.PI * q) * d]); } return o; };
// the branch of the line that feeds the DC: from the line up over the three pylons into the wall (world, [x, y, w])
export const FEED = (() => {
  const tops = PYL.map(([x, b, h]) => [x, b - h + h * .2 - 1]), a = [-250, LY], wall = [DC.x0 + 2, DC.base - 20];
  const P = [...sag(a, tops[0], 3, 10), ...sag(tops[0], tops[1], 10).slice(1), ...sag(tops[1], tops[2], 8).slice(1), ...sag(tops[2], wall, 5, 8).slice(1)];
  return P.map(([x, y]) => [x, y, .36]);
})();
// the DC's own curve: from the roof, a short run along it, then exponential up into the sky
export const CLIMB = (() => { const o = []; const n = 220, x0 = 180, y0 = DC.base - DC.h + DC.dy * .5 - 2; for (let i = 0; i <= n; i++) { const s = i / n; o.push([x0 + 250 * (1 - Math.exp(-s * 7)) + 36 * s, y0 - 3400 * (Math.exp(4 * s) - 1) / (Math.exp(4) - 1), .55 + .5 * s]); } return o; })();
// the link from hall 1 to hall 2 (the doubled power line)
const LINK = [[DC.x1 + 4, DC.base - 10, .45], [DC.x1 + 14, DC.base - 5, .45], [DC2.x0 - 10, DC2.base - 5, .45], [DC2.x0 + 1, DC2.base - 10, .45]];
// the timeline: one line along the plain; thin at 1865 (the first coal fire), full at 2025 and after
export const LINEP = (() => { const o = []; for (let x = ENG.x - 10; x <= 3600; x += 12) { const w = x < 0 ? mix(.16, .62, Math.pow(sm(clamp((x - ENG.x) / (-ENG.x))), .8)) : .62; o.push([x, LY, w]); } return o; })();

// ---------------------------------------------------------------- the 1865 engine (engraved locomotive on its coal), world units
function engine(ctx, t, m, a = 1) {
  const x = ENG.x, b = ENG.base;
  ctx.save(); m.set(ctx);
  // rails and sleepers
  ctx.strokeStyle = '#121030'; ctx.lineWidth = 2; for (let k = 0; k < 9; k++) { const sx = x - 150 + k * 30; ctx.beginPath(); ctx.moveTo(sx, b + 4); ctx.lineTo(sx + 9, b + 1); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(190,180,240,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 170, b); ctx.lineTo(x + 150, b); ctx.moveTo(x - 166, b + 3); ctx.lineTo(x + 154, b + 3); ctx.stroke();
  const ink = '#0e0c24', rimC = 'rgba(200,196,250,.55)', fire = (k) => rgba('#ffb35c', k);
  const fill = (f) => { ctx.fillStyle = ink; ctx.beginPath(); f(); ctx.fill(); };
  const hat = (f, ang = -1.1, gap = 2.6, al = .28) => { ctx.save(); ctx.beginPath(); f(); ctx.clip(); ctx.strokeStyle = rgba('#5a52a8', al); ctx.lineWidth = .5; ctx.beginPath(); for (let k = -80; k < 80; k++) { const sx = x + k * gap; ctx.moveTo(sx - 120, b + 10); ctx.lineTo(sx - 120 + Math.cos(ang) * 260, b + 10 + Math.sin(ang) * 260); } ctx.stroke(); ctx.restore(); };
  // tender with its coal heap (left)
  const tender = () => { ctx.rect(x - 122, b - 34, 74, 26); };
  fill(tender); hat(tender);
  const heap = () => { ctx.moveTo(x - 124, b - 34); ctx.quadraticCurveTo(x - 104, b - 58, x - 86, b - 56); ctx.quadraticCurveTo(x - 64, b - 54, x - 46, b - 34); ctx.closePath(); };
  fill(heap);
  { const r = prng(9); for (let i = 0; i < 46; i++) { const px = x - 118 + r() * 68, top = b - 34 - (1 - Math.pow((px - (x - 86)) / 36, 2)) * 22 * r(), s = 1.6 + r() * 2.6; ctx.fillStyle = '#100e26'; ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px + s, top - s * .7); ctx.lineTo(px + s * 1.8, top + s * .2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = r() < .5 ? fire(.35 + .25 * Math.sin(t * 1.3 + i)) : 'rgba(190,190,240,.35)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px + s, top - s * .7); ctx.stroke(); } }
  for (const wx of [x - 110, x - 85, x - 60]) { ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(wx, b - 7, 7, 0, TAU); ctx.fill(); ctx.strokeStyle = rimC; ctx.lineWidth = .6; ctx.stroke(); }
  // cab
  const cab = () => { ctx.moveTo(x - 42, b - 12); ctx.lineTo(x - 42, b - 56); ctx.lineTo(x - 46, b - 58); ctx.lineTo(x - 2, b - 60); ctx.lineTo(x - 6, b - 56); ctx.lineTo(x - 6, b - 12); ctx.closePath(); };
  fill(cab); hat(cab, -1.2);
  ctx.fillStyle = fire(.75 + .2 * Math.sin(t * 2.3) * Math.sin(t * 3.7)); ctx.fillRect(x - 34, b - 50, 12, 12);
  // boiler, bands, dome, safety valve
  const boiler = () => { ctx.moveTo(x - 6, b - 46); ctx.lineTo(x + 92, b - 46); ctx.quadraticCurveTo(x + 97, b - 34, x + 92, b - 22); ctx.lineTo(x - 6, b - 22); ctx.closePath(); };
  fill(boiler); hat(boiler, -1.45, 2.2, .3);
  ctx.strokeStyle = rimC; ctx.lineWidth = .7; ctx.beginPath(); for (const bx of [x + 14, x + 40, x + 66]) { ctx.moveTo(bx, b - 46); ctx.lineTo(bx, b - 22); } ctx.stroke();
  ctx.strokeStyle = 'rgba(210,206,255,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 6, b - 46.5); ctx.lineTo(x + 92, b - 46.5); ctx.stroke();
  fill(() => { ctx.moveTo(x + 30, b - 46); ctx.quadraticCurveTo(x + 31, b - 58, x + 38, b - 58); ctx.quadraticCurveTo(x + 45, b - 58, x + 46, b - 46); ctx.closePath(); });
  ctx.strokeStyle = rimC; ctx.beginPath(); ctx.moveTo(x + 31, b - 52); ctx.quadraticCurveTo(x + 33, b - 58, x + 38, b - 58); ctx.stroke();
  // smokebox and the tall flared chimney
  fill(() => { ctx.rect(x + 88, b - 50, 16, 30); });
  const chim = () => { ctx.moveTo(x + 92, b - 50); ctx.lineTo(x + 93, b - 82); ctx.lineTo(x + 88, b - 92); ctx.lineTo(x + 108, b - 92); ctx.lineTo(x + 103, b - 82); ctx.lineTo(x + 100, b - 50); ctx.closePath(); };
  fill(chim); hat(chim, -1.5, 2, .3);
  ctx.strokeStyle = fire(.55); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 88, b - 92); ctx.lineTo(x + 108, b - 92); ctx.stroke();
  // frame, buffers, wheels (two big drivers with spokes, one leading)
  fill(() => { ctx.rect(x - 8, b - 22, 116, 8); }); fill(() => { ctx.rect(x + 104, b - 24, 8, 4); });
  for (const [wx, R] of [[x + 14, 16], [x + 50, 16], [x + 88, 9]]) {
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(wx, b - R, R, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(190,186,245,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(wx, b - R, R - 1, 0, TAU); ctx.stroke();
    ctx.lineWidth = .6; ctx.beginPath(); for (let q = 0; q < 10; q++) { const a = q * TAU / 10 + .2; ctx.moveTo(wx, b - R); ctx.lineTo(wx + Math.cos(a) * (R - 2), b - R + Math.sin(a) * (R - 2)); } ctx.stroke();
    ctx.strokeStyle = fire(.4); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(wx, b - R, R - 1, Math.PI * .65, Math.PI * 1.05); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(190,186,245,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 14 + 6, b - 16); ctx.lineTo(x + 50 + 6, b - 16); ctx.stroke();
  ctx.restore();
  // the fire: glow under the cab and from the firebox door; it lights the ground where the line begins
  const fl = 1 + .06 * Math.sin(t * 2.3) * Math.sin(t * 3.7) + .03 * Math.sin(t * 7.1);
  glowAt(ctx, m.X(x - 26), m.Y(b - 40), 46 * m.k * fl, .5 * a, F7.amber, F7.amberCore);
  glowAt(ctx, m.X(x - 20), m.Y(b - 4), 90 * m.k * fl, .3 * a, '#ff9a40', '#ffd9a0');
  // smoke from the chimney: puffs rising and drifting left, lit warm from below, engraved contour
  ctx.save(); m.set(ctx);
  for (let i = 0; i < 16; i++) {
    const life = 5.2, age = mod(t - i * life / 16, life), u = age / life, px = x + 98 - age * 22 - age * age * 2 + n1(i * 3.1 + age * .4) * 5, py = b - 96 - age * 26 + age * age * 1.2, rad = 7 + age * 9;
    const g = ctx.createRadialGradient(px, py + rad * .2, 0, px, py, rad); g.addColorStop(0, rgba('#d8d0f0', .16 * (1 - u))); g.addColorStop(.6, rgba('#9890c8', .1 * (1 - u))); g.addColorStop(1, 'rgba(150,140,210,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, rad, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba('#cfc8f0', .18 * (1 - u) * clamp(u * 6)); ctx.lineWidth = .5; ctx.beginPath(); ctx.arc(px, py, rad * .72, Math.PI * 1.05, Math.PI * 1.9); ctx.stroke();
    ctx.strokeStyle = rgba('#ffb35c', .12 * (1 - u)); ctx.beginPath(); ctx.arc(px, py, rad * .72, Math.PI * .2, Math.PI * .8); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- sparks: the questions flying from people to the DC
function arcPt(a, b, h, q) { const cx = (a[0] + b[0]) / 2, cy = Math.min(a[1], b[1]) - h; const u = 1 - q; return [u * u * a[0] + 2 * u * q * cx + q * q * b[0], u * u * a[1] + 2 * u * q * cy + q * q * b[1]]; }
const STREAM = (() => { const r = prng(2024), o = []; for (let i = 0; i < 1400; i++) o.push({ i, src: r(), ph: r(), dur: 1.1 + r() * 1.3, h: .3 + r() * .5, k: r(), side: r() }); return o; })();

// ---------------------------------------------------------------- the world frame
export function world(ctx, t, cam, st = {}) {
  const m = gmap(cam, 1);
  const skyO = { ox: -(cam.x ?? 0) * .05 + 600, oy: -((cam.y ?? 540) - 540) * .06 - 260, ang: -.62 };
  if (st.skyFn) st.skyFn(ctx, t, cam); else sky(ctx, t, { ...skyO, horizon: gmap(cam, .22).Y(HZ - 40) });
  drawLayer(ctx, cam, 'far'); drawLayer(ctx, cam, 'ridge');
  const mh = drawLayer(ctx, cam, 'hills');
  const lights = st.lights ?? 0, era = (x) => sm(clamp((x / 6 + 2025 - 1890) / 70));
  const lit = (list, mm, al, rad, ga) => {
    ctx.save(); mm.set(ctx); ctx.globalCompositeOperation = 'lighter';
    for (const hm of list) { let u = clamp((lights * 1.25 - hm.d) / .25); if (u <= 0 || hm.dark) continue; u *= era(m.Xi(mm.X(hm.x))); if (u <= 0) continue; ctx.fillStyle = rgba('#ffc878', al * u * (.85 + .15 * Math.sin(t * 1.7 + hm.x))); ctx.fillRect(hm.x, hm.y, hm.w, hm.h); const R = hm.w * rad, g = ctx.createRadialGradient(hm.x + hm.w / 2, hm.y + hm.h / 2, 0, hm.x + hm.w / 2, hm.y + hm.h / 2, R); g.addColorStop(0, rgba('#ffb35c', ga * u)); g.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = g; ctx.fillRect(hm.x + hm.w / 2 - R, hm.y + hm.h / 2 - R, 2 * R, 2 * R); }
    ctx.restore();
  };
  if (lights > 0) lit(HOMES, mh, .85, 6, .22);
  { const y = mh.Y(548), g = ctx.createLinearGradient(0, y - 60 * mh.k, 0, y + 50 * mh.k); g.addColorStop(0, 'rgba(90,80,170,0)'); g.addColorStop(.6, 'rgba(90,80,170,.16)'); g.addColorStop(1, 'rgba(60,50,120,0)'); ctx.fillStyle = g; ctx.fillRect(0, y - 60 * mh.k, W, 110 * mh.k); }
  drawLayer(ctx, cam, 'plain');
  if (lights > 0) {
    lit(TOWNS, m, .9, 3.5, .1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const p of PHONES) { const u = clamp((lights * 1.25 - p.d) / .25) * era(p.x); if (u <= 0) continue; const X = m.X(p.x), Y = m.Y(p.y); if (X < -10 || X > W + 10 || Y < -10 || Y > H + 10) continue; ctx.fillStyle = rgba('#e6f0ff', .8 * u); ctx.fillRect(X - .9, Y - .9, 1.8, 1.8); }
    ctx.restore();
  }
  // the engine (1865) on the far left of the line
  if ((st.engine ?? 1) > 0 && m.X(ENG.x + 160) > -50 && m.X(ENG.x - 200) < W + 50) engine(ctx, t, m, st.engine ?? 1);
  // the data center halls behind the line, the pylons and the feed
  const on = st.dcOn ?? 0;
  if (m.X(DC2.x1 + 40) > -50 && m.X(-200) < W + 60) {
    ctx.save(); m.set(ctx);
    if (on > 0) { const g = ctx.createRadialGradient(dcX, DC.base + 4, 0, dcX, DC.base + 4, 260); g.addColorStop(0, rgba('#9fb8d6', .18 * on)); g.addColorStop(1, 'rgba(159,184,214,0)'); ctx.save(); ctx.translate(dcX, DC.base + 4); ctx.scale(1, .22); ctx.translate(-dcX, -DC.base - 4); ctx.fillStyle = g; ctx.fillRect(dcX - 300, DC.base - 300, 900, 600); ctx.restore(); }
    hall(ctx, t, DC2, st.hall2 ?? 0, on * clamp((st.hall2 ?? 0) * 3 - 2), 4);
    hall(ctx, t, DC, 1, on, 1);
    for (const [x, b, h] of PYL) pylon(ctx, x, b, h);
    // the substation at the wall: transformers with insulators, a fence
    for (const [x, w, h] of [[8, 12, 12], [22, 10, 10]]) { const b = DC.base + 2; ctx.fillStyle = '#100f28'; ctx.fillRect(x, b - h, w, h); ctx.strokeStyle = 'rgba(160,150,235,.45)'; ctx.lineWidth = .6; ctx.strokeRect(x, b - h, w, h); ctx.beginPath(); for (let q = 0; q < 3; q++) { ctx.moveTo(x + 2 + q * (w - 4) / 2, b - h); ctx.lineTo(x + 2 + q * (w - 4) / 2, b - h - 5); } ctx.stroke(); }
    ctx.strokeStyle = 'rgba(150,140,230,.3)'; ctx.lineWidth = .5; ctx.beginPath(); for (let x = 2; x <= 38; x += 3) { ctx.moveTo(x, DC.base + 6); ctx.lineTo(x, DC.base + 1); } ctx.moveTo(2, DC.base + 2); ctx.lineTo(38, DC.base + 2); ctx.stroke();
    ctx.restore();
  }
  // the warm pool of the line on the ground, then the timeline itself
  const lw = st.lineW ?? 1;
  { ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const x0 = Math.max(ENG.x, m.Xi(-80)), x1 = m.Xi(W + 80);
    if (x1 > x0) for (const [w, al] of [[160, .012], [90, .016], [44, .022]]) { const g = ctx.createLinearGradient(m.X(ENG.x), 0, m.X(0), 0); g.addColorStop(0, rgba('#ff9a40', al * .25)); g.addColorStop(1, rgba('#ff9a40', al)); ctx.strokeStyle = g; ctx.lineWidth = w * m.k * .6 * lw; ctx.beginPath(); ctx.moveTo(m.X(x0), m.Y(LY + 5)); ctx.lineTo(m.X(x1), m.Y(LY + 5)); ctx.stroke(); }
    ctx.restore(); }
  const lineS = LINEP.filter(([x], i) => { const X = m.X(x); return X > -400 && X < W + 400; });
  if (lineS.length > 1) curve(ctx, t, lineS.map(([x, y, w]) => [m.X(x), m.Y(y), w * clamp(m.k, .95, 2.2) * lw]), { tip: false, sparks: 0, br: st.lineBr ?? 1, seed: 5, a: st.lineA ?? 1 });
  if ((st.ticksA ?? 0) > 0 || (st.ticksR ?? 0) > 0) ticks(ctx, t, m, st);
  // the feed (the branch over the pylons into the hall) and the link to hall 2
  const fu = st.feedU ?? 0, fw = st.feedW ?? 1;
  if (fu > 0) {
    curve(ctx, t, FEED.map(([x, y, w]) => [m.X(x), m.Y(y), w * clamp(m.k, .7, 2.2)]), { u: fu, w: fw, br: st.feedBr ?? 1, tip: fu < 1, sparks: 0, seed: 8, shimmer: .25 });
    const l2 = clamp((st.hall2 ?? 0) * 3 - 2);
    if (l2 > 0) curve(ctx, t, LINK.map(([x, y, w]) => [m.X(x), m.Y(y), w * clamp(m.k, .7, 2.2)]), { u: l2, w: fw, br: st.feedBr ?? 1, tip: l2 < 1, sparks: 0, seed: 9, shimmer: .4 });
  }
  // the DC's curve: climbs steeply from the roof
  let cv = null;
  const cu = st.climbU ?? 0;
  if (cu > 0) cv = curve(ctx, t, CLIMB.map(([x, y, w]) => [m.X(x), m.Y(y), w]), { u: cu, w: (st.climbW ?? 1) * clamp(.6 + .25 * m.k, .7, 1.4), br: st.climbBr ?? 1, sparks: st.climbSparks ?? 3, burst: st.burst ?? null, seed: 2 });
  // the people's questions (sparks) streaming into the DC
  const inlet = [m.X(dcX + 20), m.Y(DC.base - DC.h - 4)];
  if ((st.stream ?? 0) > 0) stream(ctx, t, m, mh, inlet, st, era);
  // the fore rise and the person with the phone
  if (FORE && st.person) {
    const mf = gmap(cam, FP), X0 = mf.X(FORE.x0);
    if (X0 < W && mf.X(FORE.x0 + FORE.w) > 0) {
      ctx.save(); mf.set(ctx); ctx.drawImage(FORE.img, FORE.x0, FORE.y0, FORE.w, FORE.h); ctx.restore();
      const P = st.person, X = mf.X(P.x), Y = mf.Y(P.y), s = P.s * mf.k;
      if (X > -200 && X < W + 200) {
        const dcS = [m.X(dcX), m.Y(DC.base - 20)];
        // drawn at one fixed scale and scaled by the transform (figureBack caches canvases per pixel size: a zoom would allocate every frame)
        const s0 = 1.4, f = s / s0;
        ctx.save(); ctx.translate(X, Y); ctx.scale(f, f);
        const r0 = figureBack(ctx, 0, 0, s0, { t, seed: 6, hold: 'phone', dress: { coat: '#2a3150', pants: '#141426' }, accent: '#c8843a', headTilt: .26, light: { x: (dcS[0] - X) / f, y: (dcS[1] - 300 - Y) / f, col: F7.amber, a: .8 }, glow: { col: '#d8e6ff', a: .7 } });
        ctx.restore();
        const r = { phone: [X + r0.phone[0] * f, Y + r0.phone[1] * f] };
        glowAt(ctx, r.phone[0], r.phone[1], 26 * s, .35, '#cfe0f0', '#ffffff');
        for (const sp of P.sparks || []) personSpark(ctx, t, r.phone, inlet, sp);
      }
    }
  }
  return { m, inlet, climb: cv, skyO };
}
// one question leaving the phone as a spark on an arc into the DC; r shrinks from r0 to r1 at ts (thirty-fold)
function personSpark(ctx, t, a, b, sp) {
  const q = (t - sp.t0) / sp.dur; if (q <= 0 || q >= 1) return;
  const hh = Math.abs(b[0] - a[0]) * .22 + 60, e = ease.io(q) * .8 + q * .2, [x, y] = arcPt(a, b, hh, e);
  const r = sp.ts != null ? mix(sp.r0, sp.r1, ease.out(lin(sp.ts, sp.ts + .45, t))) : sp.r0, al = clamp(q * 8) * clamp((1 - q) * 6);
  for (let k = 1; k <= 6; k++) { const [tx, ty] = arcPt(a, b, hh, Math.max(0, e - k * .011)); glowAt(ctx, tx, ty, Math.max(1, r * (1 - k / 7)), .5 * al * (1 - k / 7), F7.amber, '#fff1d6'); }
  glowAt(ctx, x, y, r * 4, .75 * al, F7.amber, F7.amberCore);
  glowAt(ctx, x, y, Math.max(1.2, r), 1 * al, '#fff1d6', '#ffffff');
}
function stream(ctx, t, m, mh, inlet, st, era) {
  const dens = st.stream, tiny = st.streamTiny ?? 0, n = Math.floor(STREAM.length * dens);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const srcs = [TOWNS, HOMES, PHONES];
  for (let j = 0; j < n; j++) {
    const s = STREAM[j], list = srcs[s.k < .45 ? 0 : s.k < .75 ? 1 : 2], src = list[Math.floor(s.src * list.length)];
    const mm = list === HOMES ? mh : m, a = [mm.X(src.x), mm.Y(src.y)];
    if (a[0] < -60 || a[0] > W + 60 || a[1] < -40 || a[1] > H + 40) continue;
    const dur = s.dur * mix(1, .8, tiny), q = mod((t - (st.streamT0 ?? 0)) / dur + s.ph, 1);
    const age = (t - (st.streamT0 ?? 0)) - (q - s.ph) * dur; if (age < 0 && q > .98) continue;
    const h = Math.abs(inlet[0] - a[0]) * (.12 + .2 * s.h) + 24, e = ease.io(q) * .6 + q * .4, [x, y] = arcPt(a, inlet, h, e), [px, py] = arcPt(a, inlet, h, Math.max(0, e - .018));
    const al = clamp(q * 12) * clamp((1 - q) * 10) * era(m.Xi(a[0])), r = mix(2.8, 1.7, tiny); if (al <= .01) continue;
    ctx.fillStyle = rgba(s.side < .5 ? '#fff1d6' : '#ffc070', .95 * al); ctx.fillRect(x - r / 2, y - r / 2, r, r);
    ctx.fillStyle = rgba('#ff9a40', .2 * al); ctx.fillRect(x - r * 1.8, y - r * 1.8, r * 3.6, r * 3.6);
  }
  ctx.restore();
}
// the timeline's ticks and years (screen-constant size, at world positions; labels written on / wiped off by mask)
const YEARS_F = [2025, 2125, 2225, 2325, 2425], YEARS_P = [2000, 1950, 1900, 1865];
function ticks(ctx, t, m, st) {
  const y0 = m.Y(LY), A = st.ticksA ?? 0, R = st.ticksR ?? 0;
  ctx.save(); ctx.lineCap = 'round';
  // small ticks every 25 years
  for (let yr = 1850; yr <= 2450; yr += 25) {
    const X = m.X(YX(yr)); if (X < -20 || X > W + 20) continue;
    const fut = yr >= 2025, a = fut ? A : yr >= 1865 ? R : 0; if (a <= 0) continue;
    const big = (yr - 2025) % 100 === 0 || yr === 1865, h = big ? 15 : 7;
    ctx.strokeStyle = rgba('#fff1d6', (big ? .85 : .5) * a); ctx.lineWidth = big ? 1.6 : 1; ctx.beginPath(); ctx.moveTo(X, y0 + 6); ctx.lineTo(X, y0 + 6 + h); ctx.stroke();
  }
  const label = (yr, a, big) => {
    if (a <= 0) return; const X = m.X(YX(yr)); if (X < -80 || X > W + 80) return;
    ctx.save(); ctx.font = `600 ${big ? 22 : 19}px Inter`; const tw = ctx.measureText(String(yr)).width + 16; ctx.beginPath(); ctx.rect(X - tw / 2, y0 + 20, tw * a, 40); ctx.clip();
    text(ctx, String(yr), X, y0 + 46, { size: big ? 22 : 19, weight: 600, color: rgba('#efe6d2', .9), align: 'center', spacing: 2 });
    ctx.restore();
  };
  YEARS_F.forEach((yr, i) => label(yr, clamp(A * 5 - i * .9), yr === 2425));
  YEARS_P.forEach((yr, i) => label(yr, clamp(R * 4 - i * .7), yr === 1865));
  // the dimension bracket over 2025 … 2425: "400 YEARS"
  const bu = st.bracket ?? 0;
  if (bu > 0) {
    const xa = m.X(YX(2025)), xb = m.X(YX(2425)), yb = y0 - 74, xe = mix(xa, xb, ease.io(clamp(bu * 1.6)));
    ctx.strokeStyle = rgba('#efe6d2', .7); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(xa, yb + 10); ctx.lineTo(xa, yb - 6); ctx.moveTo(xa, yb); ctx.lineTo(xe, yb); if (bu > .62) { ctx.moveTo(xb, yb + 10); ctx.lineTo(xb, yb - 6); } ctx.stroke();
    const la = clamp((bu - .55) * 3);
    if (la > 0) { ctx.save(); ctx.font = '600 20px Inter'; const s = '400 YEARS', tw = ctx.measureText(s).width + s.length * 5 + 20, cx = (xa + xb) / 2; ctx.fillStyle = '#0d0e2a'; ctx.fillRect(cx - tw / 2 - 6, yb - 14, (tw + 12) * la, 28); ctx.beginPath(); ctx.rect(cx - tw / 2, yb - 20, tw * la, 40); ctx.clip(); text(ctx, s, cx, yb + 7, { size: 20, weight: 600, color: rgba('#efe6d2', .92), align: 'center', spacing: 5 }); ctx.restore(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- figures at small scale (Jevons at his engine)
export function watcher(ctx, t, m) {
  const X = m.X(ENG.x + 148), feet = m.Y(ENG.base + 12), s = .19 * m.k;
  figure(ctx, X, feet - 90 * s, s, { ...POSES.hold, head: .12 }, { t, seed: 3, flip: true, dress: { coat: '#24223e', pants: '#12112a', hair: '#2a2024' }, rim: '#ffb35c', rimSide: -1, shadow: true });
}

// ---------------------------------------------------------------- paper: one texture for the quote card and the plan pages
// M = { cx, cy (screen point of the sheet's focus), k (screen px per paper unit), rot }; the caller clips to the sheet.
const FIBRES = (() => { const r = prng(707), o = []; for (let i = 0; i < 9000; i++) o.push([(r() - .5) * 2800, (r() - .5) * 3200, r() * TAU, 3 + r() * 11, r(), (r() - .5) * .8]); return o; })();
export function sheetTex(ctx, M, o = {}) {
  ctx.save(); ctx.translate(M.cx, M.cy); ctx.rotate(M.rot || 0); ctx.scale(M.k, M.k);
  const g = ctx.createRadialGradient(-420, -380, 0, -420, -380, 1700); g.addColorStop(0, '#f7f0de'); g.addColorStop(.55, '#efe5cc'); g.addColorStop(1, '#ddcfae');
  ctx.fillStyle = g; ctx.fillRect(-1500, -1700, 3000, 3400);
  if (M.k > .25 && o.fibres !== false) {
    // only the fibres in view
    const R = Math.hypot(W, H) / M.k * .5 + 20, vx = (W / 2 - M.cx), vy = (H / 2 - M.cy), c = Math.cos(-(M.rot || 0)), s = Math.sin(-(M.rot || 0)), lx = (vx * c - vy * s) / M.k, ly = (vx * s + vy * c) / M.k;
    ctx.lineCap = 'round';
    for (const [x, y, a, L, k, bend] of FIBRES) {
      if (Math.abs(x - lx) > R || Math.abs(y - ly) > R) continue;
      ctx.strokeStyle = k < .5 ? `rgba(138,115,80,${.1 + .1 * k})` : `rgba(255,250,240,${.16 + .1 * k})`; ctx.lineWidth = .5 + k * .6;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a) * L * .5, y + Math.sin(a) * L * .5, x + Math.cos(a + bend) * L, y + Math.sin(a + bend) * L); ctx.stroke();
    }
  }
  ctx.restore();
}
// a sheet in screen space: corners of a rect in paper units [0..w]×[0..h] with focus (fx, fy) mapped by M; draws edge, paper, content
export function sheet(ctx, t, M, o) {
  const { w, h, fx, fy, seed = 5 } = o, P = rough([[0, 0], [w, 0], [w, h], [0, h]], 5, seed, { step: 22 });
  const tr = (c) => { c.translate(M.cx, M.cy); c.rotate(M.rot || 0); c.scale(M.k, M.k); c.translate(-fx, -fy); };
  if (o.shadow !== false) { ctx.save(); tr(ctx); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = Math.min(60, 22 * M.k); ctx.shadowOffsetX = 10 * M.k; ctx.shadowOffsetY = (o.lift ?? 16) * M.k; ctx.fillStyle = 'rgba(0,0,0,.45)'; poly(ctx, P); ctx.fill(); ctx.restore(); }
  ctx.save(); tr(ctx); poly(ctx, P); ctx.restore();
  ctx.save(); ctx.clip(); sheetTex(ctx, { cx: M.cx, cy: M.cy, k: M.k, rot: M.rot }, o);
  if (o.light) { ctx.globalCompositeOperation = 'source-atop'; o.light(ctx); ctx.globalCompositeOperation = 'source-over'; }
  ctx.save(); tr(ctx); if (o.content) o.content(ctx, w, h); ctx.restore();
  ctx.restore();
  ctx.save(); tr(ctx); ctx.strokeStyle = 'rgba(90,70,50,.4)'; ctx.lineWidth = 1.4; poly(ctx, P); ctx.stroke(); ctx.restore();
  return { P, tr };
}
// the plan page (portrait 1040 × 1420): an unreadable heading, an engraved chart whose curve runs off the top of the page, notes
export const PAGE = { w: 1040, h: 1420, fx: 820, fy: 1220 };
function scrib(g, x, y, w, seed, lw = 2.2, col = 'rgba(42,36,32,.75)') {
  const r = prng(seed); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); let px = x; g.moveTo(px, y);
  while (px < x + w) { const s = 6 + r() * 12; g.quadraticCurveTo(px + s * .3, y - 7 - r() * 7, px + s * .55, y + (r() - .5) * 3); g.quadraticCurveTo(px + s * .8, y + 6 + r() * 4, px + s, y + (r() - .5) * 2); px += s; if (r() < .14) { px += 12; g.moveTo(px, y); } }
  g.stroke();
}
export function pageContent(g, w, h, seed = 1) {
  const ink = '#2a2420', r = prng(seed * 13 + 1);
  g.strokeStyle = ink; g.lineWidth = 5; g.strokeRect(54, 54, w - 108, h - 108); g.lineWidth = 1.6; g.strokeRect(70, 70, w - 140, h - 140);
  scrib(g, 120, 172, 520, seed * 7 + 2, 4.2, 'rgba(42,36,32,.85)'); scrib(g, 120, 226, 300, seed * 7 + 3, 2.4);
  g.fillStyle = 'rgba(178,58,42,.85)'; g.beginPath(); g.arc(w - 160, 196, 34, 0, TAU); g.fill(); g.strokeStyle = 'rgba(243,236,218,.9)'; g.lineWidth = 3; g.beginPath(); g.moveTo(w - 176, 206); g.lineTo(w - 160, 182); g.lineTo(w - 144, 206); g.stroke();
  // the chart
  const cx0 = 130, cy0 = 330, cw = w - 260, ch = 560;
  g.strokeStyle = 'rgba(42,36,32,.18)'; g.lineWidth = 1.2; g.beginPath(); for (let i = 1; i < 6; i++) { g.moveTo(cx0, cy0 + ch * i / 6); g.lineTo(cx0 + cw, cy0 + ch * i / 6); g.moveTo(cx0 + cw * i / 6, cy0); g.lineTo(cx0 + cw * i / 6, cy0 + ch); } g.stroke();
  g.strokeStyle = ink; g.lineWidth = 2.6; g.beginPath(); g.moveTo(cx0, cy0 - 20); g.lineTo(cx0, cy0 + ch); g.lineTo(cx0 + cw + 20, cy0 + ch); g.stroke();
  // engraved hatch under the curve, the curve in copper ink, running off the top edge of the chart and the page
  const k = 3.4 + r() * .8, pts = []; for (let i = 0; i <= 80; i++) { const s = i / 80, x = cx0 + 10 + (cw - 40) * s, y = cy0 + ch - 20 - (ch + 480) * (Math.exp(k * s) - 1) / (Math.exp(k) - 1); pts.push([x, y]); }
  g.save(); g.beginPath(); g.rect(cx0, cy0, cw, ch); g.clip(); g.beginPath(); g.moveTo(pts[0][0], cy0 + ch); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(pts[pts.length - 1][0], cy0 + ch); g.closePath(); g.clip();
  g.strokeStyle = 'rgba(160,90,40,.28)'; g.lineWidth = 1.4; g.beginPath(); for (let x = cx0 - 600; x < cx0 + cw; x += 11) { g.moveTo(x, cy0 + ch); g.lineTo(x + 600, cy0 + ch - 600); } g.stroke(); g.restore();
  g.save(); g.beginPath(); g.rect(0, 0, w, h); g.clip();
  g.strokeStyle = '#a4521f'; g.lineWidth = 7; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
  g.restore();
  // notes and three small engraved icons (a chip, a cooling tower, a robot)
  for (let i = 0; i < 5; i++) scrib(g, 130, 980 + i * 46, 560 - (i % 3) * 90 - (i === 4 ? 200 : 0), seed * 31 + i, 2.2);
  g.strokeStyle = ink; g.lineWidth = 2.4;
  const ix = 150, iy = 1250;
  g.strokeRect(ix, iy - 30, 60, 60); g.beginPath(); for (let q = 0; q < 4; q++) { g.moveTo(ix - 10, iy - 22 + q * 15); g.lineTo(ix, iy - 22 + q * 15); g.moveTo(ix + 60, iy - 22 + q * 15); g.lineTo(ix + 70, iy - 22 + q * 15); } g.stroke();
  g.beginPath(); g.moveTo(ix + 140, iy + 30); g.quadraticCurveTo(ix + 152, iy, ix + 146, iy - 32); g.lineTo(ix + 186, iy - 32); g.quadraticCurveTo(ix + 180, iy, ix + 192, iy + 30); g.closePath(); g.stroke();
  g.beginPath(); g.arc(ix + 290, iy - 24, 11, 0, TAU); g.moveTo(ix + 276, iy - 8); g.lineTo(ix + 304, iy - 8); g.lineTo(ix + 300, iy + 18); g.lineTo(ix + 280, iy + 18); g.closePath(); g.moveTo(ix + 284, iy + 18); g.lineTo(ix + 282, iy + 32); g.moveTo(ix + 296, iy + 18); g.lineTo(ix + 298, iy + 32); g.stroke();
}
// cached faces of the plan pages (for pages smaller than ~420 px on screen)
const PAGEIMG = new Map();
async function sheetPrepare() {
  for (let s = 1; s <= 4; s++) {
    const k = .5, [c, g] = canvas(Math.ceil(PAGE.w * k), Math.ceil(PAGE.h * k)); g.scale(k, k);
    g.save(); g.translate(PAGE.fx, PAGE.fy); sheetTexRaw(g); g.restore(); pageContent(g, PAGE.w, PAGE.h, s);
    PAGEIMG.set(s, await loadImage(c.toBuffer('image/png')));
  }
}
function sheetTexRaw(g) { const gr = g.createRadialGradient(-420, -380, 0, -420, -380, 1700); gr.addColorStop(0, '#f7f0de'); gr.addColorStop(.55, '#efe5cc'); gr.addColorStop(1, '#ddcfae'); g.fillStyle = gr; g.fillRect(-1500, -1700, 3000, 3400); g.lineCap = 'round'; for (const [x, y, a, L, k, bend] of FIBRES) { g.strokeStyle = k < .5 ? `rgba(138,115,80,${.1 + .1 * k})` : `rgba(255,250,240,${.16 + .1 * k})`; g.lineWidth = .5 + k * .6; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * L * .5, y + Math.sin(a) * L * .5, x + Math.cos(a + bend) * L, y + Math.sin(a + bend) * L); g.stroke(); } }
export const pageImg = (s) => PAGEIMG.get(((s - 1) % 4) + 1);

// ---------------------------------------------------------------- the night sky plate (copy of handoff4.skyPlate 'night', with a vertical offset)
const PSTARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
export function skyP(ctx, t, oy = 0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060818'); g.addColorStop(.62, '#0d1236'); g.addColorStop(1, '#1d1a4a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2 + oy); ctx.rotate(-.42); const r = prng(55);
  for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); ctx.fillStyle = `rgba(216,230,255,${a})`; ctx.fillRect(x + t * 1.5, y, 1.3, 1.3); }
  ctx.restore();
  const dx = t * 2.2, dy = t * .6 + oy;
  for (const [x, y, s, ph, f] of PSTARS) {
    const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx) % W + W) % W, Y = ((y + dy) % H + H) % H;
    ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
    if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}
