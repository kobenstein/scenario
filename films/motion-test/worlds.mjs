// Motion test (2026-10-20): the same three scenes, built once as depth layers, so seven "directors" can move through them differently.
// The art is Film 5's (ref/k0/scenes.mjs: hookRooftop, certFrame, unwindFrame), split into planes. Every plane is authored in screen
// coordinates as seen from the rest camera; `z` is its distance (main plane = 1, larger = farther). Only the motion differs per version.
//   A rooftop: you on a roof at blue hour, the phone buzzes, the rings rise into a rosette of light over the city
//   B certificate: "YOUR SHARE", guilloche, foil seal on a dark table
//   C coast: one guilloche line peels off its rosette and is laid along Alaska's coastline
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, drift, canvas, text } from '../05-share/engine.mjs';
import { vnoise, fbm, stipple, hatch as artHatch, fog } from '../05-share/lib/art.mjs';
import { outlineLocal, fitTo, coastRuns } from '../05-share/lib/map.mjs';
import { certificate, rosette, guilloche, peel, ripple, ring, resample } from '../05-share/lib/certificate.mjs';
import { figureBack } from '../05-share/lib/figure.mjs';
import { cityLayer, skyGradient } from '../05-share/lib/city.mjs';

const CACHE = new Map(); export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;

// ---------- camera: a true multiplane camera ----------
// cam = { x, y (lateral shift in main-plane px), dz (forward travel: 0 rest, .5 = halfway to the main plane), zoom (lens, no parallax),
//         r (roll), sx, sy (screen shift) }. Plane at distance z: scale k = z / (z - dz) · zoom, lateral shift x / z.
export function applyCam(ctx, cam, z) {
  const d = z - (cam.dz || 0); if (d < .04) return 0;
  const k = z / d * (cam.zoom || 1);
  ctx.translate(W / 2 + (cam.sx || 0), H / 2 + (cam.sy || 0)); if (cam.r) ctx.rotate(cam.r); ctx.scale(k, k);
  ctx.translate(-W / 2 - (cam.x || 0) / z, -H / 2 - (cam.y || 0) / z);
  return k;
}
// where a main-plane point lands on screen (z = its plane)
export function toScreen(cam, x, y, z = 1) {
  const d = z - (cam.dz || 0), k = z / d * (cam.zoom || 1), c = Math.cos(cam.r || 0), s = Math.sin(cam.r || 0);
  const px = (x - W / 2 - (cam.x || 0) / z) * k, py = (y - H / 2 - (cam.y || 0) / z) * k;
  return [W / 2 + (cam.sx || 0) + px * c - py * s, H / 2 + (cam.sy || 0) + px * s + py * c, k];
}
// cam that puts main-plane point (x, y) in the middle of the frame
export const camAt = (x, y, o = {}) => ({ x: x - W / 2, y: y - H / 2, ...o });

// draw a world: o.only = [indices], o.skip, o.layer(ctx, L, i) hook after the camera transform (fold, blur, lift …), o.alpha(L, i)
export function drawWorld(ctx, world, t, cam, o = {}) {
  const P = world.params(t, o.p || {});
  world.layers.forEach((L, i) => {
    if (o.only && !o.only.includes(L.id)) return; if (o.skip && o.skip.includes(L.id)) return;
    const a = o.alpha ? o.alpha(L, i) : 1; if (a <= .002) return;
    ctx.save(); ctx.globalAlpha = a;
    if (!L.screen) { const k = applyCam(ctx, L.camOf ? L.camOf(cam) : cam, L.z); if (!k) { ctx.restore(); return; } }
    if (o.layer) o.layer(ctx, L, i);
    L.draw(ctx, t, P, cam);
    ctx.restore();
  });
}
const vignette = (ctx, x, y, r0, r1, col, a) => { const vg = ctx.createRadialGradient(x, y, r0, x, y, r1); vg.addColorStop(0, rgba(col, 0)); vg.addColorStop(1, rgba(col, a)); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); };

// ---------- shared light textures ----------
function screenBloom() { return once('scrbloom', () => { const R = 760, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,190,120,.55)'); rg.addColorStop(.18, 'rgba(255,160,90,.24)'); rg.addColorStop(.5, 'rgba(255,140,70,.06)'); rg.addColorStop(1, 'rgba(255,140,70,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .9, g: 1.2, seed: 15 }); return c; }); }
function coreBloom() { return once('corebloom', () => { const R = 520, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,214,160,.5)'); rg.addColorStop(.22, 'rgba(255,180,110,.2)'); rg.addColorStop(.6, 'rgba(255,170,100,.05)'); rg.addColorStop(1, 'rgba(255,170,100,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .8, g: 1.2, seed: 44 }); return c; }); }
export function tipBloom() { return once('tipbloom', () => { const R = 260, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,240,210,1)'); rg.addColorStop(.06, 'rgba(255,214,150,.75)'); rg.addColorStop(.2, 'rgba(255,180,100,.28)'); rg.addColorStop(.55, 'rgba(255,160,90,.07)'); rg.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .7, g: 1.15, seed: 47, boost: 2 }); return c; }); }
export function motes(ctx, t, cx, cy, a, seed = 23) {
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 110; i++) { const ang = r() * 6.283, d = 140 + r() * 520, sp = .2 + r() * .5, x = cx + Math.cos(ang) * d + Math.sin(t * sp + i) * 24, y = cy + Math.sin(ang) * d * .8 + Math.cos(t * sp * .8 + i * 1.7) * 18 - t * 6; const f = Math.max(0, 1 - d / 680); ctx.fillStyle = `rgba(255,214,170,${(.12 + .45 * r()) * f * a})`; const z = r() < .8 ? 1.4 : 2.4; ctx.fillRect(x, y, z, z); }
  ctx.restore();
}

// =====================================================================================================================
// A · ROOFTOP (H.04)
// =====================================================================================================================
export const ROS = { x: 1265, y: 650, R: 400 };
const FIG = { x: 600, y: 1012, s: 2.45 };
export const PHONE = { x: FIG.x + 9 * FIG.s, y: FIG.y - 124 * FIG.s };
function roofSky() { return skyGradient({ key: 'roofsky', w: W + 200, top: '#0a1134', mid: '#1b2b5c', low: '#58739f', horizon: 640, warm: { x: ROS.x + 100, y: 640, r: 1000, col: '#f2cfa6', a: .55 }, stars: 70, seed: 12, strands: 0 }); }
function roofRays() {
  return once('roofrays', () => {
    const [c, g] = canvas(W, H), r = prng(31);
    g.filter = 'blur(10px)';
    for (let i = 0; i < 9; i++) { const a = -Math.PI * (.1 + .8 * (i + r() * .7) / 9), sp = .03 + r() * .04, L = 1300; const lg = g.createRadialGradient(ROS.x, ROS.y, ROS.R * .6, ROS.x, ROS.y, L); lg.addColorStop(0, 'rgba(255,236,206,.06)'); lg.addColorStop(1, 'rgba(255,236,206,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(ROS.x, ROS.y); g.lineTo(ROS.x + Math.cos(a - sp) * L, ROS.y + Math.sin(a - sp) * L); g.lineTo(ROS.x + Math.cos(a + sp) * L, ROS.y + Math.sin(a + sp) * L); g.closePath(); g.fill(); }
    g.filter = 'none';
    const bg = g.createRadialGradient(ROS.x, ROS.y, 0, ROS.x, ROS.y, 900); bg.addColorStop(0, 'rgba(255,226,186,.42)'); bg.addColorStop(.25, 'rgba(255,200,150,.16)'); bg.addColorStop(.6, 'rgba(255,190,140,.04)'); bg.addColorStop(1, 'rgba(255,190,140,0)'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    stipple(c, { k: .85, g: 1.2, seed: 32 }); return c;
  });
}
function roofFog(key, y0, y1, col, a, seed) { return once(key, () => { const [c, g] = canvas(W + 600, H); fog(g, { y0, y1, col, a, seed, sx: .0022, sy: .012, cover: .6, soft: .35, k: .55, x1: W + 600 }); return c; }); }
function nearTowers() {
  return once('neartowers', () => {
    const [c, g] = canvas(W + 400, H + 200), r = prng(5); g.translate(200, 0);
    const tower = (x0, x1, top, col, side) => {
      g.fillStyle = col; g.fillRect(x0, top, x1 - x0, H + 200 - top);
      g.save(); g.beginPath(); g.rect(x0, top, x1 - x0, H + 200 - top); g.clip();
      for (let y = top + 22; y < H + 200; y += 26) for (let x = x0 + 12; x < x1 - 14; x += 22) { const on = r() < .16; g.fillStyle = on ? (r() < .7 ? `rgba(255,200,140,${.5 + r() * .4})` : `rgba(200,220,255,${.4 + r() * .3})`) : 'rgba(8,10,22,.6)'; g.fillRect(x, y, 9, 13); }
      g.strokeStyle = 'rgba(3,4,12,.35)'; g.lineWidth = .8; g.beginPath(); for (let x = x0; x < x1; x += 3.2) { g.moveTo(x, top); g.lineTo(x + (r() - .5) * 2, H + 200); } g.stroke();
      const lg = g.createLinearGradient(0, top, 0, H); lg.addColorStop(0, 'rgba(255,226,190,.0)'); lg.addColorStop(1, 'rgba(5,7,18,.55)'); g.fillStyle = lg; g.fillRect(x0, top, x1 - x0, H + 200 - top);
      g.restore();
      const ex = side > 0 ? x1 : x0, rg = g.createLinearGradient(0, top, 0, top + 500); rg.addColorStop(0, 'rgba(255,222,180,.75)'); rg.addColorStop(1, 'rgba(255,222,180,0)'); g.fillStyle = rg; g.fillRect(ex - (side > 0 ? 2 : 0), top, 2, 500); g.fillStyle = 'rgba(255,226,190,.5)'; g.fillRect(x0, top, x1 - x0, 1.5);
    };
    tower(-200, 96, 120, '#121a35', 1); g.fillStyle = '#121a35'; g.fillRect(96, 300, 44, H + 200 - 300); tower(1760, 2160, 430, '#151e3c', -1);
    g.fillStyle = '#0e1530'; g.fillRect(1800, 368, 4, 62); g.fillRect(1852, 368, 4, 62); g.fillRect(1792, 312, 72, 60); g.beginPath(); g.moveTo(1788, 312); g.lineTo(1828, 284); g.lineTo(1868, 312); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,226,190,.35)'; g.fillRect(1792, 312, 2, 60);
    stipple(c, { k: .3, g: 1, seed: 7, mid: false, boost: 1 }); return c;
  });
}
function roofDeck() {
  return once('roofdeck', () => {
    const PX = 300, PY = 300, [c, g] = canvas(W + 2 * PX, H + PY), r = prng(8); g.translate(PX, 0);
    const X0 = -PX, XW = W + 2 * PX, HB = H + PY;
    g.fillStyle = '#0b1024'; g.fillRect(X0, 812, XW, 96);
    g.fillStyle = '#4a5677'; g.fillRect(X0, 804, XW, 9); g.fillStyle = 'rgba(255,226,190,.55)'; g.fillRect(X0, 804, XW, 2);
    g.strokeStyle = 'rgba(2,3,10,.4)'; g.lineWidth = .8; g.beginPath(); for (let x = X0; x < W + PX; x += 3) { g.moveTo(x, 813); g.lineTo(x + 1, 908); } g.stroke();
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.2; g.beginPath(); for (let x = X0 + 60; x < W + PX; x += 190) { g.moveTo(x, 813); g.lineTo(x, 908); } g.stroke();
    g.fillStyle = '#0d1328'; for (let x = X0 + 30; x < W + PX; x += 240) g.fillRect(x, 700, 5, 106);
    for (const y of [700, 752]) { g.fillStyle = '#0d1328'; g.fillRect(X0, y, XW, 5); g.fillStyle = 'rgba(255,226,190,.45)'; g.fillRect(X0, y, XW, 1.4); }
    const fg = g.createLinearGradient(0, 908, 0, HB); fg.addColorStop(0, '#141a30'); fg.addColorStop(1, '#070a16'); g.fillStyle = fg; g.fillRect(X0, 908, XW, HB - 908);
    g.strokeStyle = 'rgba(120,140,190,.08)'; g.lineWidth = 1; g.beginPath(); for (let i = -20; i < 32; i++) { g.moveTo(960 + i * 30, 908); g.lineTo(960 + i * 150 * HB / H, HB); } for (const y of [930, 962, 1006, 1066, 1150, 1260]) { g.moveTo(X0, y); g.lineTo(W + PX, y); } g.stroke();
    for (let i = 0; i < 4000; i++) { const x = X0 + r() * XW, y = 908 + Math.pow(r(), .7) * (HB - 908); g.fillStyle = r() < .5 ? 'rgba(160,170,210,.08)' : 'rgba(0,0,0,.25)'; g.fillRect(x, y, 1.4, 1.4); }
    const sh = g.createRadialGradient(ROS.x, 908, 0, ROS.x, 908, 900); sh.addColorStop(0, 'rgba(255,214,170,.16)'); sh.addColorStop(1, 'rgba(255,214,170,0)'); g.save(); g.translate(0, 908); g.scale(1, .22); g.translate(0, -908); g.fillStyle = sh; g.fillRect(X0, 0, XW, H * 6); g.restore();
    g.save(); g.translate(1150, 985); g.scale(1, .1); const pg = g.createRadialGradient(0, 0, 0, 0, 0, 340); pg.addColorStop(0, 'rgba(255,214,170,.16)'); pg.addColorStop(.7, 'rgba(160,170,210,.07)'); pg.addColorStop(1, 'rgba(160,170,210,0)'); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, 340, 0, 7); g.fill(); g.restore();
    g.strokeStyle = 'rgba(255,230,200,.07)'; g.lineWidth = 1; for (let k = 0; k < 7; k++) { g.beginPath(); g.ellipse(1150 + (k - 3) * 11, 985, 260 - k * 26, 5 + k * 2.4, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); }
    stipple(c, { k: .3, g: 1, seed: 9, mid: false, boost: 1 }); c.px = PX; return c;
  });
}
export const BUZZ = [.3, 1.05, 1.8];
export const roofBeats = (t) => { const b = [...BUZZ]; for (let k = 2.55; k < t; k += .75) b.push(k); return b; };
export const ROOF = {
  id: 'A',
  params: (t, p) => ({ rise: p.rise ?? sm(lin(.1, 2.6, t)) * .85 + .15, beats: p.beats ?? roofBeats(t), ...p }),
  layers: [
    { id: 'sky', z: 12, draw: (ctx) => ctx.drawImage(roofSky(), -460, -260, W + 920, H + 520) },
    { id: 'rosette', z: 8, draw: (ctx, t, P) => {
      const rx = ROS.x, ry = ROS.y, rise = P.rise;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= rise; ctx.drawImage(roofRays(), 0, 0); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const a0 = ctx.globalAlpha;
      rosette(ctx, rx, ry, { R: 300, A: 30, B: 14, n: 48, m: 13, lines: 60, col: '#fff1d6', w: .55, a: .085 * rise * a0, rot: t * .02, cache: true });
      rosette(ctx, rx, ry, { R: 196, A: 26, B: 10, n: 30, m: 11, lines: 48, col: '#ffc887', w: .5, a: .1 * rise * a0, rot: -t * .035, cache: true });
      rosette(ctx, rx, ry, { R: 92, A: 16, B: 7, n: 16, m: 7, lines: 36, col: '#ffe0b0', w: .5, a: .13 * rise * a0, rot: t * .05, cache: true });
      { const B = coreBloom(); ctx.globalAlpha = rise * a0; ctx.drawImage(B, rx - B.width / 2, ry - B.height / 2); ctx.globalAlpha = a0; }
      ring(ctx, rx, ry, ROS.R, ROS.R, { lines: 9, band: 20, wave: 26, col: '#fff1d6', glow: '#ffb35c', glowA: .08, a: .5 * rise * a0, lw: .6, ph: t * .3 });
      ring(ctx, rx, ry, ROS.R * .8, ROS.R * .8, { lines: 5, band: 10, wave: 22, col: '#ffe2b8', glow: null, a: .35 * rise * a0, lw: .5, ph: -t * .2 });
      ctx.restore();
    } },
    { id: 'cityFar', z: 5, draw: (ctx) => { const L = cityLayer({ key: 'roof-far', seed: 21, ground: 700, hMin: 26, hMax: 120, wMin: 16, wMax: 54, col: '#3d5584', col2: '#364d7c', haze: '#8aa2c8', hazeH: 90, hazeA: .8, win: { p: .08, size: [1.6, 2], gap: [4, 5], a: .65 }, rim: { x: ROS.x + 200, y: ROS.y, col: '#ffe6c4', a: .6, reach: 520 }, antennas: .12, tanks: .04 }); ctx.drawImage(L, -200, 0); } },
    { id: 'fog1', z: 4, draw: (ctx, t) => { ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(roofFog('rooffog1', 560, 760, '#a8bcd8', .3, 3), -300 - t * 4, 0); } },
    { id: 'cityMid', z: 3, draw: (ctx) => { const L = cityLayer({ key: 'roof-mid', seed: 33, ground: 830, hMin: 50, hMax: 210, wMin: 34, wMax: 110, col: '#1f2d54', col2: '#27375f', haze: '#56709e', hazeH: 120, win: { p: .13, size: [2.4, 3.2], gap: [6, 8] }, rim: { x: ROS.x + 240, y: ROS.y, col: '#ffd9a8', a: .65, reach: 900 }, hatch: .5, tanks: .14, antennas: .12 }); ctx.drawImage(L, -200, 0); } },
    { id: 'fog2', z: 2.3, draw: (ctx, t) => { ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(roofFog('rooffog2', 700, 860, '#6f88b8', .22, 6), -300 - t * 7, 0); } },
    { id: 'towers', z: 1.6, draw: (ctx) => ctx.drawImage(nearTowers(), -200, 0) },
    { id: 'deck', z: 1.12, draw: (ctx) => { const D = roofDeck(); ctx.drawImage(D, -D.px, 0); } },
    { id: 'you', z: 1, draw: (ctx, t, P) => {
      const fx = FIG.x, fy = FIG.y, fs = FIG.s, ph = [PHONE.x, PHONE.y];
      ripple(ctx, ph[0], ph[1], t, P.beats, { w0: 40, h0: 50, rings: 1, speed: 200, life: 4.4, lines: 5, band: 12, wave: 26, col: '#fff1d6', coolCol: '#ffe2b8', glow: '#ffb35c', glowA: .07, lineA: .7, a: .8 * ctx.globalAlpha, lw: .75, to: [ROS.x, ROS.y - 40], toR: ROS.R, spread: .3 });
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(.35); const sg = ctx.createLinearGradient(0, 0, 0, 260); sg.addColorStop(0, 'rgba(2,3,8,.6)'); sg.addColorStop(1, 'rgba(2,3,8,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(0, 120, 40, 140, 0, 0, 7); ctx.fill(); ctx.restore();
      const lit = Math.max(.4, ...P.beats.map((b) => t > b ? Math.exp(-(t - b) * 2.5) : 0));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const B = screenBloom(); ctx.globalAlpha *= .35 + .4 * lit; ctx.drawImage(B, ph[0] - B.width / 2 * .45, ph[1] - B.height / 2 * .45, B.width * .45, B.height * .45); ctx.restore();
      figureBack(ctx, fx, fy, fs, { t, light: { x: ROS.x, y: ROS.y - 120, col: '#ffe4bc', a: .95 }, glow: { col: '#ffb35c', a: .95 }, accent: '#c8843a', rimFloor: (fy - 806) / fs });
      motes(ctx, t, ROS.x, ROS.y, .5);
    } },
    { id: 'vig', screen: true, draw: (ctx) => vignette(ctx, W * .55, H * .5, 420, 1250, '#03040c', .55) },
  ],
  keys: { rosette: [ROS.x, ROS.y, 8], phone: [PHONE.x, PHONE.y, 1], head: [FIG.x, FIG.y - 190 * FIG.s, 1] },
};

// =====================================================================================================================
// B · CERTIFICATE "YOUR SHARE"
// =====================================================================================================================
export const CERT = { x: 1000, y: 560, s: .92, rot: -.07, w: 1500, h: 980 };
// certificate-local point → main-plane px
export const certPt = (lx, ly, c = CERT) => { const s = c.s, a = c.rot; return [c.x + (lx * Math.cos(a) - ly * Math.sin(a)) * s, c.y + (lx * Math.sin(a) + ly * Math.cos(a)) * s]; };
export const CERT_SEAL = [1500 / 2 - 230, 980 / 2 - 215];      // local
export const CERT_CORNERS = [[-600, -340], [600, -340], [-600, 340], [600, 340]];
const TW = 2600, TH = 1800;
function tableLayer() {
  return once('table', () => {
    const PAD = 500, [c, g] = canvas(TW + PAD * 2, TH + PAD * 2), n = vnoise(7), r = prng(3);
    g.fillStyle = '#16100e'; g.fillRect(0, 0, c.width, c.height); g.translate(PAD, PAD);
    const planks = 8, ph = (TH + PAD * 2) / planks;
    for (let i = 0; i < planks; i++) {
      const y0 = -PAD + i * ph, base = ['#3b2a22', '#33241d', '#3f2d24', '#36271f', '#3a2921', '#31231c'][i % 6];
      g.fillStyle = base; g.fillRect(-PAD, y0, TW + PAD * 2, ph);
      g.lineCap = 'round';
      for (let k = 0; k < 170; k++) {
        const yy = y0 + r() * ph, light = r() < .45; g.strokeStyle = light ? `rgba(150,105,72,${.06 + r() * .12})` : `rgba(18,10,8,${.1 + r() * .18})`; g.lineWidth = .6 + r() * 1.6;
        g.beginPath(); for (let x = -PAD - 20; x <= TW + PAD + 20; x += 24) { const yv = yy + (fbm(n, x * .0016 + i * 7, yy * .01, 3) - .5) * 70; x < -PAD ? g.moveTo(x, yv) : g.lineTo(x, yv); } g.stroke();
      }
      for (let q = 0; q < 2; q++) { const kx = r() * TW, ky = y0 + ph * (.3 + r() * .4); for (let rr = 4; rr < 46; rr += 5) { g.strokeStyle = `rgba(20,12,8,${.25 - rr * .004})`; g.lineWidth = 1.2; g.beginPath(); g.ellipse(kx, ky, rr * 2.6, rr, 0, 0, 7); g.stroke(); } }
      g.fillStyle = 'rgba(8,5,4,.85)'; g.fillRect(-PAD, y0 + ph - 3, TW + PAD * 2, 3); g.fillStyle = 'rgba(160,120,90,.12)'; g.fillRect(-PAD, y0 + ph, TW + PAD * 2, 1.5);
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'multiply'; g.fillStyle = '#5a5470'; g.fillRect(0, 0, c.width, c.height); g.globalCompositeOperation = 'source-over';
    stipple(c, { k: .18, g: 1, seed: 4, mid: false, boost: 1 });
    return c;
  });
}
function certLight() { return once('certlight', () => { const [c, g] = canvas(W + 1200, H + 900); g.translate(600, 450); const lg = g.createRadialGradient(260, 120, 0, 420, 260, 1500); lg.addColorStop(0, 'rgba(255,200,140,.55)'); lg.addColorStop(.45, 'rgba(255,170,100,.16)'); lg.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = lg; g.fillRect(-600, -450, W + 1200, H + 900); stipple(c, { k: .7, g: 1.2, seed: 21 }); return c; }); }
export const CERTW = {
  id: 'B',
  params: (t, p) => ({ ...p }),
  layers: [
    { id: 'table', z: 1.5, draw: (ctx) => { const T = tableLayer(); ctx.translate(W / 2, H / 2); ctx.rotate(.18); ctx.globalAlpha *= .95; ctx.drawImage(T, -T.width / 2, -T.height / 2); } },
    { id: 'cert', z: 1, draw: (ctx, t, P) => {
      const c = P.cert || CERT, z = 1.02 + .015 * Math.sin(t * .2);
      certificate(ctx, t, { x: c.x, y: c.y, s: c.s * z, rot: c.rot + .004 * Math.sin(t * .3), ghost: P.ghost, burin: P.burin, seq: P.seq, smoke: P.smoke });
    } },
    { id: 'light', z: 1, draw: (ctx) => { const L = certLight(); const a = ctx.globalAlpha; ctx.globalCompositeOperation = 'soft-light'; ctx.drawImage(L, -600, -450); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35 * a; ctx.drawImage(L, -600, -450); } },
    { id: 'motes', z: .8, draw: (ctx, t) => motes(ctx, t * .6, 520, 260, .45, 61) },
    { id: 'vig', screen: true, draw: (ctx) => vignette(ctx, 900, 520, 300, 1350, '#08060c', .7) },
  ],
};

// =====================================================================================================================
// C · A GUILLOCHE LINE IS LAID ALONG ALASKA'S COAST
// =====================================================================================================================
const COAST = { x: 860, y: 150, w: 940, h: 800 };
export const SPOOL = { x: 470, y: 560, G: { R: 236, A: 30, B: 13, n: 22, m: 9 } };
export function alaska() {
  return once('alaska', () => {
    const o = outlineLocal('Alaska', { detail: '50m', n: 30 }), r0 = o.rings[0];
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of r0) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const rings = fitTo(o.rings, [x0, y0, x1 - x0, y1 - y0], COAST.x, COAST.y, COAST.w, COAST.h);
    const pts = resample(rings[0], 1400), path = new Path2D(), coastPath = new Path2D();
    for (const r of rings) { r.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y))); path.closePath(); }
    rings.forEach((r, k) => { for (const run of coastRuns(r, o.coast[k])) run.forEach(([x, y], i) => (i ? coastPath.lineTo(x, y) : coastPath.moveTo(x, y))); });
    return { pts, rings, path, coastPath };
  });
}
function coastEngraving() {
  return once('coastengr', () => {
    const A = alaska(), [lm, lg] = canvas(W, H); lg.fillStyle = '#fff'; lg.fill(A.path);
    const band = (d, w) => {
      const [a, ag] = canvas(W, H), [b, bg] = canvas(W, H); ag.lineJoin = bg.lineJoin = 'round'; ag.lineCap = bg.lineCap = 'butt'; ag.strokeStyle = bg.strokeStyle = '#fff';
      ag.lineWidth = 2 * d + w; ag.stroke(A.coastPath); bg.lineWidth = Math.max(.1, 2 * d - w); bg.stroke(A.coastPath);
      ag.globalCompositeOperation = 'destination-out'; ag.drawImage(b, 0, 0); return a;
    };
    const [wc, wg] = canvas(W, H);
    [5, 10.5, 16.5, 23, 30.5, 39, 48.5, 59, 71].forEach((d, k) => { wg.globalAlpha = .58 * Math.pow(.83, k); wg.drawImage(band(d, .9), 0, 0); });
    wg.globalAlpha = 1; wg.globalCompositeOperation = 'destination-out'; wg.drawImage(lm, 0, 0);
    wg.globalCompositeOperation = 'source-in'; const sg = wg.createLinearGradient(0, COAST.y, 0, COAST.y + COAST.h); sg.addColorStop(0, '#c9d6f2'); sg.addColorStop(1, '#e9e2d0'); wg.fillStyle = sg; wg.fillRect(0, 0, W, H);
    const [hc, hg] = canvas(W, H);
    hg.save(); artHatch(hg, [COAST.x - 120, COAST.y - 80, COAST.w + 240, COAST.h + 200], { angle: -.75, gap: 3.6, w: .65, col: '#ffd9a0', a: .8, wobble: .5, seed: 9, broken: .12 }); hg.restore();
    const [fc, fg] = canvas(W, H); fg.filter = 'blur(16px)'; fg.strokeStyle = '#fff'; fg.lineJoin = 'round'; fg.lineWidth = 64; fg.stroke(A.coastPath); fg.filter = 'none';
    hg.globalCompositeOperation = 'destination-in'; hg.drawImage(fc, 0, 0); hg.drawImage(lm, 0, 0);
    hg.globalCompositeOperation = 'source-over'; hg.globalAlpha = .4; hg.drawImage(band(4.5, .8), 0, 0); hg.globalAlpha = 1;
    hg.globalCompositeOperation = 'destination-in'; hg.drawImage(lm, 0, 0); hg.globalCompositeOperation = 'source-over';
    hg.strokeStyle = 'rgba(243,239,226,.85)'; hg.lineWidth = 1.1; hg.lineJoin = 'round';
    for (const r of A.rings.slice(1)) { hg.beginPath(); r.forEach(([x, y], i) => (i ? hg.lineTo(x, y) : hg.moveTo(x, y))); hg.closePath(); hg.stroke(); }
    return [wc, hc];
  });
}
const RV = []; function revealCanvas() { if (!RV.length) RV.push(canvas(W, H)); return RV[0]; }
function revealAlong(ctx, layer, P, end, front, width) {
  if (end < 2) return; const [c, g] = revealCanvas(); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
  g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#fff';
  const full = Math.max(0, end - front); if (full > 2) { g.lineWidth = width; g.beginPath(); for (let i = 0; i <= full; i += 3) i ? g.lineTo(P[i][0], P[i][1]) : g.moveTo(P[i][0], P[i][1]); g.lineTo(P[full][0], P[full][1]); g.stroke(); }
  for (let s = 0; s < 6; s++) {
    const a = Math.round(mix(full, end, s / 6)), b = Math.round(mix(full, end, (s + 1) / 6)); if (b <= a) continue;
    g.globalAlpha = 1 - s / 6 * .85; g.lineWidth = width * (1 - s / 6 * .75); g.beginPath(); for (let i = a; i <= b; i++) i === a ? g.moveTo(P[i][0], P[i][1]) : g.lineTo(P[i][0], P[i][1]); g.stroke();
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-in'; g.drawImage(layer, 0, 0);
  ctx.drawImage(c, 0, 0);
}
function unwindBack() {
  return once('unwindback', () => {
    const PX = 500, PY = 350, [c, g] = canvas(W + PX * 2, H + PY * 2);
    const rg = g.createRadialGradient(620 + PX, 500 + PY, 0, 820 + PX, 560 + PY, 1700); rg.addColorStop(0, '#202c60'); rg.addColorStop(.5, '#10173c'); rg.addColorStop(1, '#070a1f'); g.fillStyle = rg; g.fillRect(0, 0, c.width, c.height);
    const [p, pg] = canvas(c.width, c.height); pg.translate(PX, PY);
    rosette(pg, 1180, 560, { R: 660, A: 54, B: 26, n: 44, m: 13, lines: 70, col: '#b4bfe8', w: .6, a: .05 });
    pg.strokeStyle = 'rgba(200,210,255,.09)'; pg.lineWidth = 1; pg.setLineDash([2, 6]);
    for (let i = -8; i < 18; i++) { pg.beginPath(); pg.moveTo(760 + i * 110, -PY); pg.lineTo(700 + i * 118, H + PY); pg.stroke(); }
    for (let j = -4; j < 15; j++) { pg.beginPath(); pg.moveTo(-PX, 60 + j * 104); pg.lineTo(W + PX, 40 + j * 110); pg.stroke(); }
    pg.setLineDash([]);
    g.filter = 'blur(2.5px)'; g.drawImage(p, 0, 0); g.filter = 'none';
    stipple(c, { k: .5, g: 1, seed: 41, mid: false, boost: 1 }); c.px = PX; c.py = PY;
    return c;
  });
}
function unwindFog() { return once('unwindfog', () => { const [c, g] = canvas(W + 800, H + 200); fog(g, { y0: 80, y1: 1140, col: '#3a5a92', a: .3, seed: 17, sx: .0018, sy: .004, cover: .5, soft: .4, k: .6, x1: W + 800 }); return c; }); }
function dofArcs() { return once('dofarcs', () => { const [c, g] = canvas(W, H); g.filter = 'blur(7px)'; ring(g, -260, 1180, 820, 820, { lines: 6, band: 46, wave: 60, col: '#f3efe2', glow: '#ffb35c', glowA: .1, a: .5, lw: 2.2, op: 'source-over' }); ring(g, 2180, -160, 560, 560, { lines: 5, band: 36, wave: 54, col: '#f3efe2', glow: null, a: .32, lw: 2, op: 'source-over' }); g.filter = 'none'; return c; }); }
function frontMotes() {
  return once('frontmotes', () => {
    const [c, g] = canvas(W + 400, H + 200), r = prng(71);
    g.filter = 'blur(5px)'; for (let i = 0; i < 30; i++) { const x = r() * c.width, y = r() * c.height, rr = 6 + r() * 26; g.fillStyle = `rgba(255,${200 + r() * 40 | 0},160,${.035 + r() * .06})`; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill(); }
    g.filter = 'none'; for (let i = 0; i < 110; i++) { const x = r() * c.width, y = r() * c.height; g.fillStyle = `rgba(255,236,205,${.12 + r() * .3})`; g.fillRect(x, y, 1 + r() * 1.2, 1 + r() * 1.2); }
    return c;
  });
}
const polyStroke = (ctx, P, i0, i1) => { ctx.beginPath(); for (let i = i0; i <= i1; i++) i === i0 ? ctx.moveTo(P[i][0], P[i][1]) : ctx.lineTo(P[i][0], P[i][1]); ctx.stroke(); };
// the spool's thread as a polyline in main-plane px (turning slowly)
export function spoolLine(t, x = SPOOL.x, y = SPOOL.y, s = 1) {
  return guilloche({ ...SPOOL.G, lines: 44, steps: 900 }).line(11).map(([px, py]) => { const a = t * .05, c = Math.cos(a), sn = Math.sin(a); return [x + (px * c - py * sn) * s, y + (px * sn + py * c) * s]; });
}
export const COASTW = {
  id: 'C',
  params: (t, p) => ({ u: p.u ?? 0, labels: p.labels ?? sm(lin(.3, .55, p.u ?? 0)), spool: p.spool ?? 1, ...p }),
  layers: [
    { id: 'plate', z: 3, draw: (ctx) => { const B = unwindBack(); ctx.drawImage(B, -B.px - 100, -B.py - 50); } },
    { id: 'fog', z: 2, draw: (ctx, t) => { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= .9; ctx.drawImage(unwindFog(), -400 - t * 6, -100); } },
    { id: 'main', z: 1, draw: (ctx, t, P) => {
      const u = clamp(P.u), A = alaska(), N = A.pts.length, z = .06, f = u * (1 + z), laid = Math.max(0, Math.min(N - 1, Math.floor((f - z) * (N - 1))));
      const rx = SPOOL.x, ry = SPOOL.y, line = P.line || spoolLine(t);
      const pts = peel(line, A.pts, u, { n: N, zone: z }), tip = pts[laid];
      const mapA = sm(lin(.86, 1, u)), [WL, LL] = coastEngraving(), a0 = ctx.globalAlpha;
      { const pg = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 520); pg.addColorStop(0, 'rgba(255,170,100,.2)'); pg.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = pg; ctx.fillRect(tip[0] - 520, tip[1] - 520, 1040, 1040); }
      if (P.ghostCoast !== false) { ctx.save(); ctx.setLineDash([1.4, 5.5]); ctx.strokeStyle = `rgba(243,239,226,${.42 * (1 - mapA) * (P.ghostA ?? 1)})`; ctx.lineWidth = 1.2; polyStroke(ctx, A.pts, Math.max(0, laid - 2), N - 1); ctx.restore(); }
      if (mapA > 0) { ctx.save(); ctx.fillStyle = rgba('#e9dfc6', .55 * mapA); ctx.fill(A.path); ctx.clip(A.path); artHatch(ctx, [COAST.x, COAST.y, COAST.w, COAST.h], { angle: -.6, gap: 5, w: .7, col: '#2a3150', a: .3 * mapA, seed: 4 }); ctx.restore(); }
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      revealAlong(ctx, WL, A.pts, laid, Math.round(N * .05), 190);
      revealAlong(ctx, LL, A.pts, Math.max(0, laid - Math.round(N * .015)), Math.round(N * .06), 150);
      ctx.restore();
      if (P.spool > 0) {
        { const bg = ctx.createRadialGradient(rx, ry, 0, rx, ry, 330); bg.addColorStop(0, 'rgba(255,190,120,.10)'); bg.addColorStop(.7, 'rgba(255,170,100,.05)'); bg.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = bg; ctx.fillRect(rx - 330, ry - 330, 660, 660); }
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; rosette(ctx, rx, ry, { ...SPOOL.G, lines: 34, rot: t * .05, col: '#f3efe2', w: .5, a: .5 * (1 - .4 * u) * P.spool * a0, cache: true }); ctx.restore();
      }
      if (P.thread !== false) {
        ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
        const hot = Math.max(0, laid - Math.round(N * .04));
        for (const [w, a] of [[16, .05], [6, .15]]) { ctx.strokeStyle = rgba('#ffb35c', a * a0); ctx.lineWidth = w; polyStroke(ctx, pts, hot, N - 1); }
        ctx.strokeStyle = rgba('#ffb35c', .1 * a0); ctx.lineWidth = 4.5; polyStroke(ctx, pts, 0, Math.max(0, hot));
        ctx.strokeStyle = rgba('#fff1d6', .95 * a0); ctx.lineWidth = 1.7; polyStroke(ctx, pts, hot, N - 1);
        ctx.strokeStyle = rgba('#f3efe2', .82 * a0); ctx.lineWidth = 1.25; polyStroke(ctx, pts, 0, Math.min(N - 1, hot + 2));
        ctx.restore();
        if (u > .002) {
          const B = tipBloom(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(B, tip[0] - B.width / 2, tip[1] - B.height / 2); ctx.restore();
          const r = prng(5); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 46; i++) { const a = r() * TAU, life = (t * (.6 + r() * .8) + r()) % 1, d = 6 + life * (40 + r() * 70), x = tip[0] + Math.cos(a) * d, y = tip[1] + Math.sin(a) * d - life * 18; ctx.fillStyle = `rgba(255,${200 + r() * 40 | 0},150,${.75 * (1 - life) * (.3 + .7 * r()) * a0})`; const sz = 1 + r() * 1.3; ctx.fillRect(x, y, sz, sz); } ctx.restore();
        }
      }
      if (P.labels > 0) { const la = P.labels * a0; text(ctx, 'ALASKA', 1430, 246, { size: 64, font: 'Instrument Serif', color: rgba('#f3efe2', .92 * la), spacing: 6 }); text(ctx, 'THE RULE CAME FIRST · 1976', 1434, 284, { size: 16, weight: 600, color: rgba('#ffd59a', .85 * la), spacing: 5 }); }
      P._tip = tip;
    } },
    { id: 'arcs', z: .7, draw: (ctx) => ctx.drawImage(dofArcs(), 0, 0) },
    { id: 'motes', z: .55, draw: (ctx, t) => { ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(frontMotes(), -200 - t * 9, -100 - t * 3); } },
    { id: 'vig', screen: true, draw: (ctx) => vignette(ctx, W * .55, H * .5, 380, 1250, '#040510', .6) },
  ],
};
// the coast's tip position for a given u (main-plane px)
export function coastTip(u, t) { const A = alaska(), N = A.pts.length, z = .06, f = clamp(u) * (1 + z), laid = Math.max(0, Math.min(N - 1, Math.floor((f - z) * (N - 1)))); return A.pts[laid]; }

// ---------- the shared content clock (identical in every version) ----------
// A 0–3.4 s · B 3.4–6.7 s · C 6.7–10 s; directors decide how the scenes hand over around 3.4 and 6.7
export const DUR = 10;
export const uOf = (t, t0 = 6.9, t1 = 9.5) => { const x = clamp((t - t0) / (t1 - t0)); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
export { drift };
