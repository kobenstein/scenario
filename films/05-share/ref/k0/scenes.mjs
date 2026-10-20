// K0 art-test scenes for Film 5 (reference implementations for the builders, like Film 4's ref/kunst/*.mjs).
// Each export is a pure draw(ctx, t, o) for a full 1920×1080 frame; expensive static layers are cached on first use.
//   hookHand(ctx, t, o)                H.01–H.03: your hand holds the phone in the dark, the buzz ripples out as guilloche rings,
//                                      bill and paycheck cards get wiped, the amber share card locks in with a foil glint
//   hookRooftop(ctx, t, o)             H.04: pull back: you on a rooftop at blue hour, the rings rise as a vast rosette of light
//   certFrame(ctx, t)                  the certificate language: "YOUR SHARE", guilloche, seal, foil glint
//   unwindFrame(ctx, t, { u })         transition: one guilloche line unwinds into Alaska's coastline on the paper map
//   mapNight(ctx, t, { utc })          6.22: the paper map at night, Manila at dawn, Ohio at dusk, two phones buzz at once
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, eout, eio, sm, prng, drift, canvas, addGlow, text } from '../../engine.mjs';
import { vnoise, fbm, stipple, roughPath, hatch as artHatch, pool, bloom, cone, fog } from '../../lib/art.mjs';
import { phone } from '../../lib/phone.mjs';
import { shareLight } from '../../lib/share.mjs';
import { worldMap, ll, project, region, country, outlineLocal, fitTo, coastRuns } from '../../lib/map.mjs';
import { certificate, rosette, guilloche, unwind, peel, ripple, ring, gBorder, microtext, resample } from '../../lib/certificate.mjs';
import { heldPhone, lockScreen } from '../../lib/phone.mjs';
import { figureBack } from '../../lib/figure.mjs';
import { cityLayer, skyGradient } from '../../lib/city.mjs';
import { fibreFill } from '../../lib/print.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };

// ============ H.01 · the kitchen table at first light (top-down, turned 18°) ============
const TW = 2600, TH = 1800; // table layer, larger than the frame so the camera can drift and turn
function tableLayer() {
  return once('table', () => {
    const [c, g] = canvas(TW, TH), n = vnoise(7), r = prng(3);
    const planks = 6, ph = TH / planks;
    for (let i = 0; i < planks; i++) {
      const y0 = i * ph, base = ['#3b2a22', '#33241d', '#3f2d24', '#36271f', '#3a2921', '#31231c'][i];
      g.fillStyle = base; g.fillRect(0, y0, TW, ph);
      // grain: long warped lines, each plank its own flow
      g.lineCap = 'round';
      for (let k = 0; k < 150; k++) {
        const yy = y0 + r() * ph, light = r() < .45; g.strokeStyle = light ? `rgba(150,105,72,${.06 + r() * .12})` : `rgba(18,10,8,${.1 + r() * .18})`; g.lineWidth = .6 + r() * 1.6;
        g.beginPath(); for (let x = -20; x <= TW + 20; x += 24) { const yv = yy + (fbm(n, x * .0016 + i * 7, yy * .01, 3) - .5) * 70; x < 0 ? g.moveTo(x, yv) : g.lineTo(x, yv); } g.stroke();
      }
      // a knot or two with rings bending the grain
      for (let q = 0; q < 2; q++) { const kx = r() * TW, ky = y0 + ph * (.3 + r() * .4); for (let rr = 4; rr < 46; rr += 5) { g.strokeStyle = `rgba(20,12,8,${.25 - rr * .004})`; g.lineWidth = 1.2; g.beginPath(); g.ellipse(kx, ky, rr * 2.6, rr, 0, 0, 7); g.stroke(); } }
      // seam between planks
      g.fillStyle = 'rgba(8,5,4,.85)'; g.fillRect(0, y0 + ph - 3, TW, 3); g.fillStyle = 'rgba(160,120,90,.12)'; g.fillRect(0, y0 + ph, TW, 1.5);
    }
    stipple(c, { k: .18, g: 1, seed: 4, mid: false, boost: 1 });
    return c;
  });
}
// ============ H.01–H.03 · your hand holds the phone in the dark; the buzz ripples out as guilloche rings ============
// Beats (seconds are local to this reference; in the film anchor them to "buzzes", "bill", "paycheck", "A share"):
// three buzzes, two grey cards slide in and get wiped, the amber share card locks in with a foil glint.
export const HOOK = {
  buzz: [.3, 1.05, 1.8],
  lock: { time: '6:12', day: 'Monday', cards: [{ title: 'Electricity bill', sub: 'Payment due Friday', t0: .35, t1: 1.0 }, { title: 'Paycheck', sub: 'Deposit received', t0: 1.1, t1: 1.75 }], share: { t0: 1.85, title: 'Your share', sub: 'of the largest fortune ever made' } },
};
function hookBg() {
  return once('hookbg', () => {
    const [c, g] = canvas(W, H), r = prng(11);
    const bg = g.createRadialGradient(820, 470, 0, 900, 560, 1300); bg.addColorStop(0, '#111a36'); bg.addColorStop(.45, '#080c1d'); bg.addColorStop(1, '#020309'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // far below: the city out of focus (soft discs), only a hint in the dark
    for (let i = 0; i < 70; i++) {
      const x = r() * W, y = H * (.62 + r() * .42), rr = 10 + r() * 34, warm = r() < .55, a = .035 + r() * .07;
      const dg = g.createRadialGradient(x, y, 0, x, y, rr); dg.addColorStop(0, warm ? `rgba(255,170,90,${a})` : `rgba(170,200,255,${a})`); dg.addColorStop(.8, warm ? `rgba(255,170,90,${a * .8})` : `rgba(170,200,255,${a * .8})`); dg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = dg; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill();
    }
    stipple(c, { k: .35, g: 1, seed: 6, mid: false, boost: 1 });
    return c;
  });
}
function hookFog() { return once('hookfog', () => { const [c, g] = canvas(W, H); fog(g, { y0: 120, y1: 980, col: '#3a4f7a', a: .22, seed: 4, sx: .0024, sy: .006, cover: .55, soft: .35, k: .6 }); return c; }); }
function screenBloom() { return once('scrbloom', () => { const R = 760, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,190,120,.55)'); rg.addColorStop(.18, 'rgba(255,160,90,.24)'); rg.addColorStop(.5, 'rgba(255,140,70,.06)'); rg.addColorStop(1, 'rgba(255,140,70,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .9, g: 1.2, seed: 15 }); return c; }); }
function motes(ctx, t, cx, cy, a) {
  const r = prng(23); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 110; i++) { const ang = r() * 6.283, d = 140 + r() * 520, sp = .2 + r() * .5, x = cx + Math.cos(ang) * d + Math.sin(t * sp + i) * 24, y = cy + Math.sin(ang) * d * .8 + Math.cos(t * sp * .8 + i * 1.7) * 18 - t * 6; const f = Math.max(0, 1 - d / 680); ctx.fillStyle = `rgba(255,214,170,${(.12 + .45 * r()) * f * a})`; const z = r() < .8 ? 1.4 : 2.4; ctx.fillRect(x, y, z, z); }
  ctx.restore();
}
export function hookHand(ctx, t, o = {}) {
  const buzz = o.buzz ?? HOOK.buzz, s = o.s ?? 2.3, ang = -.12 + .01 * Math.sin(t * .4);
  const cx = (o.x ?? 720) + drift(t, 5, 1), cy = (o.y ?? 480) + drift(t, 4, 2);
  ctx.drawImage(hookBg(), 0, 0);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8; ctx.drawImage(hookFog(), drift(t, 20, 3) - t * 3, 0); ctx.restore();
  const lit = Math.max(...buzz.map((b) => sm(lin(b, b + .25, t))));
  // the buzz: engraved rings, behind the phone and the hand
  ripple(ctx, cx, cy, t, buzz, { w0: 75 * s, h0: 150 * s, rot: ang, speed: 470, life: 2.6, lines: 9, band: 24, wave: 38, col: "#fff1d6", glow: "#ffb35c", a: 1, lw: 1.1 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .9 * lit; const B = screenBloom(); ctx.drawImage(B, cx - B.width / 2, cy - B.height / 2); ctx.restore();
  const P = heldPhone(ctx, cx, cy, s, { t, buzz, ang, lit, lock: o.lock ?? HOOK.lock, skin: o.skin ?? '#b98261' });
  motes(ctx, t, cx, cy, lit);
  const vg = ctx.createRadialGradient(cx, cy, 300, cx, cy, 1250); vg.addColorStop(0, 'rgba(2,3,9,0)'); vg.addColorStop(1, 'rgba(2,3,9,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  return P;
}

// ============ H.04 · pull back: you on a rooftop at blue hour, the rings rise as a vast engraved rosette (a second dawn) ============
const ROS = { x: 1265, y: 650, R: 400 };
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
function coreBloom() { return once('corebloom', () => { const R = 520, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,214,160,.5)'); rg.addColorStop(.22, 'rgba(255,180,110,.2)'); rg.addColorStop(.6, 'rgba(255,170,100,.05)'); rg.addColorStop(1, 'rgba(255,170,100,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .8, g: 1.2, seed: 44 }); return c; }); }
function roofFog(key, y0, y1, col, a, seed) { return once(key, () => { const [c, g] = canvas(W + 200, H); fog(g, { y0, y1, col, a, seed, sx: .0022, sy: .012, cover: .6, soft: .35, k: .55, x1: W + 200 }); return c; }); }
function nearTowers() {
  return once('neartowers', () => {
    const [c, g] = canvas(W, H), r = prng(5);
    const tower = (x0, x1, top, col, side) => {
      g.fillStyle = col; g.fillRect(x0, top, x1 - x0, H - top);
      g.save(); g.beginPath(); g.rect(x0, top, x1 - x0, H - top); g.clip();
      for (let y = top + 22; y < H; y += 26) for (let x = x0 + 12; x < x1 - 14; x += 22) { const on = r() < .16; g.fillStyle = on ? (r() < .7 ? `rgba(255,200,140,${.5 + r() * .4})` : `rgba(200,220,255,${.4 + r() * .3})`) : 'rgba(8,10,22,.6)'; g.fillRect(x, y, 9, 13); }
      g.strokeStyle = 'rgba(3,4,12,.35)'; g.lineWidth = .8; g.beginPath(); for (let x = x0; x < x1; x += 3.2) { g.moveTo(x, top); g.lineTo(x + (r() - .5) * 2, H); } g.stroke();
      const lg = g.createLinearGradient(0, top, 0, H); lg.addColorStop(0, 'rgba(255,226,190,.0)'); lg.addColorStop(1, 'rgba(5,7,18,.55)'); g.fillStyle = lg; g.fillRect(x0, top, x1 - x0, H - top);
      g.restore();
      // rim toward the rosette
      const ex = side > 0 ? x1 : x0, rg = g.createLinearGradient(0, top, 0, top + 500); rg.addColorStop(0, 'rgba(255,222,180,.75)'); rg.addColorStop(1, 'rgba(255,222,180,0)'); g.fillStyle = rg; g.fillRect(ex - (side > 0 ? 2 : 0), top, 2, 500); g.fillStyle = 'rgba(255,226,190,.5)'; g.fillRect(x0, top, x1 - x0, 1.5);
    };
    tower(-20, 96, 120, '#121a35', 1); g.fillStyle = '#121a35'; g.fillRect(96, 300, 44, H - 300); tower(1760, 1960, 430, '#151e3c', -1);
    // a water tank on the right roof
    g.fillStyle = '#0e1530'; g.fillRect(1800, 368, 4, 62); g.fillRect(1852, 368, 4, 62); g.fillRect(1792, 312, 72, 60); g.beginPath(); g.moveTo(1788, 312); g.lineTo(1828, 284); g.lineTo(1868, 312); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,226,190,.35)'; g.fillRect(1792, 312, 2, 60);
    stipple(c, { k: .3, g: 1, seed: 7, mid: false, boost: 1 }); return c;
  });
}
function roofDeck() {
  return once('roofdeck', () => {
    const [c, g] = canvas(W, H), r = prng(8);
    // low parapet (its inner face toward us, in shadow), top surface catching the dawn, railing above it
    g.fillStyle = '#0b1024'; g.fillRect(0, 812, W, 96);
    g.fillStyle = '#4a5677'; g.fillRect(0, 804, W, 9); g.fillStyle = 'rgba(255,226,190,.55)'; g.fillRect(0, 804, W, 2);
    g.strokeStyle = 'rgba(2,3,10,.4)'; g.lineWidth = .8; g.beginPath(); for (let x = 0; x < W; x += 3) { g.moveTo(x, 813); g.lineTo(x + 1, 908); } g.stroke();
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.2; g.beginPath(); for (let x = 60; x < W; x += 190) { g.moveTo(x, 813); g.lineTo(x, 908); } g.stroke();
    // railing: posts and two rails, rimmed on top
    g.fillStyle = '#0d1328'; for (let x = 30; x < W; x += 240) g.fillRect(x, 700, 5, 106);
    for (const y of [700, 752]) { g.fillStyle = '#0d1328'; g.fillRect(0, y, W, 5); g.fillStyle = 'rgba(255,226,190,.45)'; g.fillRect(0, y, W, 1.4); }
    // roof deck: dark tiles receding, gravel tooth
    const fg = g.createLinearGradient(0, 908, 0, H); fg.addColorStop(0, '#141a30'); fg.addColorStop(1, '#070a16'); g.fillStyle = fg; g.fillRect(0, 908, W, H - 908);
    g.strokeStyle = 'rgba(120,140,190,.08)'; g.lineWidth = 1; g.beginPath(); for (let i = -12; i < 24; i++) { g.moveTo(960 + i * 30, 908); g.lineTo(960 + i * 150, H); } for (const y of [930, 962, 1006, 1066]) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
    for (let i = 0; i < 2600; i++) { const x = r() * W, y = 908 + Math.pow(r(), .7) * (H - 908); g.fillStyle = r() < .5 ? 'rgba(160,170,210,.08)' : 'rgba(0,0,0,.25)'; g.fillRect(x, y, 1.4, 1.4); }
    // last night's rain: a sheen toward the light and a puddle that holds the rosette
    const sh = g.createRadialGradient(ROS.x, 908, 0, ROS.x, 908, 900); sh.addColorStop(0, 'rgba(255,214,170,.16)'); sh.addColorStop(1, 'rgba(255,214,170,0)'); g.save(); g.translate(0, 908); g.scale(1, .22); g.translate(0, -908); g.fillStyle = sh; g.fillRect(0, 0, W, H * 6); g.restore();
    g.save(); g.translate(1150, 985); g.scale(1, .1); const pg = g.createRadialGradient(0, 0, 0, 0, 0, 340); pg.addColorStop(0, 'rgba(255,214,170,.16)'); pg.addColorStop(.7, 'rgba(160,170,210,.07)'); pg.addColorStop(1, 'rgba(160,170,210,0)'); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, 340, 0, 7); g.fill(); g.restore();
    g.strokeStyle = 'rgba(255,230,200,.07)'; g.lineWidth = 1; for (let k = 0; k < 7; k++) { g.beginPath(); g.ellipse(1150 + (k - 3) * 11, 985, 260 - k * 26, 5 + k * 2.4, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); }
    stipple(c, { k: .3, g: 1, seed: 9, mid: false, boost: 1 }); return c;
  });
}
export function hookRooftop(ctx, t, o = {}) {
  const cam = { x: drift(t, 6, 1) - t * 2.5, y: drift(t, 3, 2) };
  const P = (k) => [cam.x * k, cam.y * k];
  // sky and the rising rosette (behind everything but the sky)
  { const [dx, dy] = P(.1); ctx.drawImage(roofSky(), -100 + dx, dy); }
  const [rdx, rdy] = P(.15), rx = ROS.x + rdx, ry = ROS.y + rdy, rise = o.rise ?? 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = rise; ctx.drawImage(roofRays(), rdx, rdy); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  rosette(ctx, rx, ry, { R: 300, A: 30, B: 14, n: 48, m: 13, lines: 60, col: '#fff1d6', w: .55, a: .085 * rise, rot: t * .02, cache: true });
  rosette(ctx, rx, ry, { R: 196, A: 26, B: 10, n: 30, m: 11, lines: 48, col: '#ffc887', w: .5, a: .1 * rise, rot: -t * .035, cache: true });
  rosette(ctx, rx, ry, { R: 92, A: 16, B: 7, n: 16, m: 7, lines: 36, col: '#ffe0b0', w: .5, a: .13 * rise, rot: t * .05, cache: true });
  { const B = coreBloom(); ctx.globalAlpha = rise; ctx.drawImage(B, rx - B.width / 2, ry - B.height / 2); ctx.globalAlpha = 1; }
  ring(ctx, rx, ry, ROS.R, ROS.R, { lines: 9, band: 20, wave: 26, col: '#fff1d6', glow: '#ffb35c', glowA: .08, a: .5 * rise, lw: .6, ph: t * .3 });
  ring(ctx, rx, ry, ROS.R * .8, ROS.R * .8, { lines: 5, band: 10, wave: 22, col: '#ffe2b8', glow: null, a: .35 * rise, lw: .5, ph: -t * .2 });
  ctx.restore();
  // the city in three depths with haze between them
  { const [dx, dy] = P(.2); ctx.drawImage(cityLayer({ key: 'roof-far', seed: 21, ground: 700, hMin: 26, hMax: 120, wMin: 16, wMax: 54, col: '#3d5584', col2: '#364d7c', haze: '#8aa2c8', hazeH: 90, hazeA: .8, win: { p: .08, size: [1.6, 2], gap: [4, 5], a: .65 }, rim: { x: ROS.x + 200, y: ROS.y, col: '#ffe6c4', a: .6, reach: 520 }, antennas: .12, tanks: .04 }), -200 + dx, dy); }
  { const [dx, dy] = P(.3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(roofFog('rooffog1', 560, 760, '#a8bcd8', .3, 3), -100 + dx, dy); ctx.restore(); }
  { const [dx, dy] = P(.45); ctx.drawImage(cityLayer({ key: 'roof-mid', seed: 33, ground: 830, hMin: 50, hMax: 210, wMin: 34, wMax: 110, col: '#1f2d54', col2: '#27375f', haze: '#56709e', hazeH: 120, win: { p: .13, size: [2.4, 3.2], gap: [6, 8] }, rim: { x: ROS.x + 240, y: ROS.y, col: '#ffd9a8', a: .65, reach: 900 }, hatch: .5, tanks: .14, antennas: .12 }), -200 + dx, dy); }
  { const [dx, dy] = P(.6); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(roofFog('rooffog2', 700, 860, '#6f88b8', .22, 6), -100 + dx, dy); ctx.restore(); }
  { const [dx, dy] = P(.9); ctx.drawImage(nearTowers(), dx, dy); }
  // the buzz keeps rising from the phone and flows into the rosette
  const fx = 600 + P(1.3)[0], fy = 1012 + P(1.3)[1], fs = 2.45, ph = [fx + 9 * fs, fy - 124 * fs];
  const beats = []; for (let k = 0; k < 6; k++) beats.push(Math.floor(t / .75) * .75 - k * .75);
  ctx.drawImage(roofDeck(), P(1.1)[0], P(1.1)[1]);
  ripple(ctx, ph[0], ph[1], t, beats, { w0: 40, h0: 50, rings: 1, speed: 200, life: 4.4, lines: 5, band: 12, wave: 26, col: '#fff1d6', coolCol: '#ffe2b8', glow: '#ffb35c', glowA: .07, lineA: .7, a: .8, lw: .75, to: [rx, ry], toR: ROS.R, spread: .3 });
  // long shadow of the figure toward us (back light), the phone's glow around the chest, the figure
  ctx.save(); ctx.translate(fx, fy); ctx.rotate(.35); const sg = ctx.createLinearGradient(0, 0, 0, 260); sg.addColorStop(0, 'rgba(2,3,8,.6)'); sg.addColorStop(1, 'rgba(2,3,8,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(0, 120, 40, 140, 0, 0, 7); ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const B = screenBloom(); ctx.globalAlpha = .55; ctx.drawImage(B, ph[0] - B.width / 2 * .45, ph[1] - B.height / 2 * .45, B.width * .45, B.height * .45); ctx.restore();
  figureBack(ctx, fx, fy, fs, { t, light: { x: rx, y: ry - 120, col: '#ffe4bc', a: .95 }, glow: { col: '#ffb35c', a: .95 }, accent: '#c8843a', rimFloor: (fy - 806 - P(1.1)[1]) / fs });
  motes(ctx, t, rx, ry, .5);
  const vg = ctx.createRadialGradient(W * .55, H * .5, 420, W * .55, H * .5, 1250); vg.addColorStop(0, 'rgba(3,4,12,0)'); vg.addColorStop(1, 'rgba(3,4,12,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ============ certificate: "YOUR SHARE" ============
export function certFrame(ctx, t, o = {}) {
  ctx.fillStyle = '#16100e'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(.18); ctx.globalAlpha = .9; ctx.drawImage(tableLayer(), -TW / 2, -TH / 2); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#5a5470'; ctx.fillRect(0, 0, W, H); ctx.restore();
  const z = 1.06 + .02 * Math.sin(t * .2), x = 1040 + drift(t, 10, 1) - t * 4, y = 610 + drift(t, 6, 2);
  certificate(ctx, t, { x, y, s: .92 * z, rot: -.07 + .004 * Math.sin(t * .3) });
  // raking warm light from the upper left, falling off across the sheet
  const L = once('certlight', () => { const [c, g] = canvas(W, H); const lg = g.createRadialGradient(260, 120, 0, 420, 260, 1500); lg.addColorStop(0, 'rgba(255,200,140,.55)'); lg.addColorStop(.45, 'rgba(255,170,100,.16)'); lg.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); stipple(c, { k: .7, g: 1.2, seed: 21 }); return c; });
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.drawImage(L, 0, 0); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35; ctx.drawImage(L, 0, 0); ctx.restore();
  const vg = ctx.createRadialGradient(900, 520, 300, 900, 520, 1350); vg.addColorStop(0, 'rgba(8,6,12,0)'); vg.addColorStop(1, 'rgba(8,6,12,.7)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ============ transition: a guilloche line unwinds into Alaska's coastline ============
// Four planes with parallax (.3 / .55 / 1 / 1.7): a far engraved plate (huge rosette + chart grid, out of focus), drifting fog
// that warms near the light, the main plane (the rosette spool, the thread, the coast), and out-of-focus guilloche arcs + motes
// in front. The thread leaves the rosette (peel) and is laid along the coast; behind the laying point the engraving follows:
// waterlines on the sea side, intaglio shading on the land side, the islands' coasts, revealed by a tapering mask along the laid
// coast (the engraving itself is static and cached; per frame only the mask is stroked).
const COAST = { x: 860, y: 150, w: 940, h: 800 };
function alaska() {
  return once('alaska', () => {
    const o = outlineLocal('Alaska', { detail: '50m', n: 30 }), r0 = o.rings[0];
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of r0) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const rings = fitTo(o.rings, [x0, y0, x1 - x0, y1 - y0], COAST.x, COAST.y, COAST.w, COAST.h);
    const pts = resample(rings[0], 1400), path = new Path2D(), coastPath = new Path2D();
    for (const r of rings) { r.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y))); path.closePath(); }
    rings.forEach((r, k) => { for (const run of coastRuns(r, o.coast[k])) run.forEach(([x, y], i) => (i ? coastPath.lineTo(x, y) : coastPath.moveTo(x, y))); });   // no waterlines on the land border
    return { pts, rings, path, coastPath };
  });
}
// static engraving of the coast: [water, land] layers in main-plane coordinates (W×H)
function coastEngraving() {
  return once('coastengr', () => {
    const A = alaska(), [lm, lg] = canvas(W, H); lg.fillStyle = '#fff'; lg.fill(A.path);              // land mask
    const band = (d, w) => {                                                                             // pixels at distance d ± w/2 from the coast
      const [a, ag] = canvas(W, H), [b, bg] = canvas(W, H); ag.lineJoin = bg.lineJoin = 'round'; ag.lineCap = bg.lineCap = 'butt'; ag.strokeStyle = bg.strokeStyle = '#fff';
      ag.lineWidth = 2 * d + w; ag.stroke(A.coastPath); bg.lineWidth = Math.max(.1, 2 * d - w); bg.stroke(A.coastPath);
      ag.globalCompositeOperation = 'destination-out'; ag.drawImage(b, 0, 0); return a;
    };
    // sea: waterlines, closer together near the shore, fading outward
    const [wc, wg] = canvas(W, H);
    [5, 10.5, 16.5, 23, 30.5, 39, 48.5, 59, 71].forEach((d, k) => { wg.globalAlpha = .58 * Math.pow(.83, k); wg.drawImage(band(d, .9), 0, 0); });
    wg.globalAlpha = 1; wg.globalCompositeOperation = 'destination-out'; wg.drawImage(lm, 0, 0);
    wg.globalCompositeOperation = 'source-in'; const sg = wg.createLinearGradient(0, COAST.y, 0, COAST.y + COAST.h); sg.addColorStop(0, '#c9d6f2'); sg.addColorStop(1, '#e9e2d0'); wg.fillStyle = sg; wg.fillRect(0, 0, W, H);
    // land: intaglio hatching that is densest at the shore and fades inland (falloff = blurred wide stroke), an inner contour, island coasts
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
// draw `layer` only near the laid part of the coast (0..end), with a tapered front
function revealAlong(ctx, layer, P, end, front, width) {
  if (end < 2) return; const [c, g] = revealCanvas(); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
  g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#fff';
  const full = Math.max(0, end - front); if (full > 2) { g.lineWidth = width; g.beginPath(); for (let i = 0; i <= full; i += 3) i ? g.lineTo(P[i][0], P[i][1]) : g.moveTo(P[i][0], P[i][1]); g.lineTo(P[full][0], P[full][1]); g.stroke(); }
  for (let s = 0; s < 6; s++) {                                                                          // taper: narrower and fainter toward the light
    const a = Math.round(mix(full, end, s / 6)), b = Math.round(mix(full, end, (s + 1) / 6)); if (b <= a) continue;
    g.globalAlpha = 1 - s / 6 * .85; g.lineWidth = width * (1 - s / 6 * .75); g.beginPath(); for (let i = a; i <= b; i++) i === a ? g.moveTo(P[i][0], P[i][1]) : g.lineTo(P[i][0], P[i][1]); g.stroke();
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-in'; g.drawImage(layer, 0, 0);
  ctx.drawImage(c, 0, 0);
}
function unwindBack() {
  return once('unwindback', () => {
    const [c, g] = canvas(W + 200, H + 100);
    const rg = g.createRadialGradient(620, 500, 0, 820, 560, 1400); rg.addColorStop(0, '#202c60'); rg.addColorStop(.5, '#10173c'); rg.addColorStop(1, '#070a1f'); g.fillStyle = rg; g.fillRect(0, 0, c.width, c.height);
    // the far plate, out of focus: a huge engraved rosette and a chart grid
    const [p, pg] = canvas(W + 200, H + 100);
    rosette(pg, 1180, 560, { R: 660, A: 54, B: 26, n: 44, m: 13, lines: 70, col: '#b4bfe8', w: .6, a: .05 });
    pg.strokeStyle = 'rgba(200,210,255,.09)'; pg.lineWidth = 1; pg.setLineDash([2, 6]);
    for (let i = -2; i < 13; i++) { pg.beginPath(); pg.moveTo(760 + i * 110, 0); pg.lineTo(700 + i * 118, c.height); pg.stroke(); }
    for (let j = 0; j < 11; j++) { pg.beginPath(); pg.moveTo(560, 60 + j * 104); pg.lineTo(c.width, 40 + j * 110); pg.stroke(); }
    pg.setLineDash([]);
    g.filter = 'blur(2.5px)'; g.drawImage(p, 0, 0); g.filter = 'none';
    stipple(c, { k: .5, g: 1, seed: 41, mid: false, boost: 1 });
    return c;
  });
}
function unwindFog() { return once('unwindfog', () => { const [c, g] = canvas(W + 300, H); fog(g, { y0: 80, y1: 1040, col: '#3a5a92', a: .3, seed: 17, sx: .0018, sy: .004, cover: .5, soft: .4, k: .6, x1: W + 300 }); return c; }); }
function dofArcs() {
  return once('dofarcs', () => { const [c, g] = canvas(W, H); g.filter = 'blur(7px)'; ring(g, -260, 1180, 820, 820, { lines: 6, band: 46, wave: 60, col: '#f3efe2', glow: '#ffb35c', glowA: .1, a: .5, lw: 2.2, op: 'source-over' }); ring(g, 2180, -160, 560, 560, { lines: 5, band: 36, wave: 54, col: '#f3efe2', glow: null, a: .32, lw: 2, op: 'source-over' }); g.filter = 'none'; return c; });
}
// motes in the air between us and the plate: a few large soft discs (out of focus) and fine sharp specks
function frontMotes() {
  return once('frontmotes', () => {
    const [c, g] = canvas(W + 200, H + 100), r = prng(71);
    g.filter = 'blur(5px)'; for (let i = 0; i < 26; i++) { const x = r() * c.width, y = r() * c.height, rr = 6 + r() * 26; g.fillStyle = `rgba(255,${200 + r() * 40 | 0},160,${.035 + r() * .06})`; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill(); }
    g.filter = 'none'; for (let i = 0; i < 90; i++) { const x = r() * c.width, y = r() * c.height; g.fillStyle = `rgba(255,236,205,${.12 + r() * .3})`; g.fillRect(x, y, 1 + r() * 1.2, 1 + r() * 1.2); }
    return c;
  });
}
function tipBloom() { return once('tipbloom', () => { const R = 260, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,240,210,1)'); rg.addColorStop(.06, 'rgba(255,214,150,.75)'); rg.addColorStop(.2, 'rgba(255,180,100,.28)'); rg.addColorStop(.55, 'rgba(255,160,90,.07)'); rg.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .7, g: 1.15, seed: 47, boost: 2 }); return c; }); }
const FOGW = []; function fogScratch() { if (!FOGW.length) FOGW.push(canvas(1000, 1000)); return FOGW[0]; }
const TAU = Math.PI * 2;
const polyStroke = (ctx, P, i0, i1) => { ctx.beginPath(); for (let i = i0; i <= i1; i++) i === i0 ? ctx.moveTo(P[i][0], P[i][1]) : ctx.lineTo(P[i][0], P[i][1]); ctx.stroke(); };
export function unwindFrame(ctx, t, o = {}) {
  const u = clamp(o.u ?? .6), cam = { x: drift(t, 10, 1) - u * 40, y: drift(t, 6, 2) };
  const L = (k) => [cam.x * k, cam.y * k];
  const A = alaska(), N = A.pts.length, z = .06, f = u * (1 + z), laid = Math.max(0, Math.min(N - 1, Math.floor((f - z) * (N - 1))));
  const [mx, my] = L(1), rx = 470, ry = 560, G = { R: 236, A: 30, B: 13, n: 22, m: 9 };
  const line = guilloche({ ...G, lines: 44, steps: 900 }).line(11).map(([x, y]) => { const a = t * .05, c = Math.cos(a), s = Math.sin(a); return [rx + x * c - y * s, ry + x * s + y * c]; });
  const pts = peel(line, A.pts, u, { n: N, zone: z }), tip = pts[laid], tipS = [tip[0] + mx, tip[1] + my];
  // far plate
  { const [dx, dy] = L(.3); ctx.drawImage(unwindBack(), -100 + dx, -50 + dy); }
  // fog: cool everywhere, warm where the laying light touches it
  { const [dx, dy] = L(.55), F = unwindFog(), fx = -150 + dx - t * 6; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .9; ctx.drawImage(F, fx, dy); ctx.restore();
    const [c, g] = fogScratch(), ox = tipS[0] - 500, oy = tipS[1] - 500; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, 1000, 1000); g.drawImage(F, fx - ox, dy - oy);
    g.globalCompositeOperation = 'source-in'; const wg = g.createRadialGradient(500, 500, 0, 500, 500, 500); wg.addColorStop(0, 'rgba(255,170,90,.9)'); wg.addColorStop(.45, 'rgba(255,160,90,.3)'); wg.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = wg; g.fillRect(0, 0, 1000, 1000);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(c, ox, oy); ctx.restore(); }
  ctx.save(); ctx.translate(mx, my);
  const mapA = sm(lin(.86, 1, u)), [WL, LL] = coastEngraving();
  // a warm pool on the plate around the light (the engraving catches it)
  { const pg = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 420); pg.addColorStop(0, 'rgba(255,170,100,.16)'); pg.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = pg; ctx.fillRect(tip[0] - 420, tip[1] - 420, 840, 840); }
  // where it will land: the rest of the coast as a dotted ghost
  ctx.save(); ctx.setLineDash([1.4, 5.5]); ctx.strokeStyle = `rgba(243,239,226,${.42 * (1 - mapA)})`; ctx.lineWidth = 1.2; polyStroke(ctx, A.pts, Math.max(0, laid - 2), N - 1); ctx.restore();
  // the engraving follows the thread: waterlines (sea), intaglio shading + islands (land), just behind the light
  if (mapA > 0) { ctx.save(); ctx.fillStyle = rgba('#e9dfc6', .9 * mapA); ctx.fill(A.path); ctx.clip(A.path); artHatch(ctx, [COAST.x, COAST.y, COAST.w, COAST.h], { angle: -.6, gap: 5, w: .7, col: '#2a3150', a: .3 * mapA, seed: 4 }); ctx.restore(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  revealAlong(ctx, WL, A.pts, laid, Math.round(N * .05), 190);
  revealAlong(ctx, LL, A.pts, Math.max(0, laid - Math.round(N * .015)), Math.round(N * .06), 150);
  ctx.restore();
  // the rosette the thread comes from: fine engraved lace on the left, back-lit, turning slowly
  { const bg = ctx.createRadialGradient(rx, ry, 0, rx, ry, 330); bg.addColorStop(0, 'rgba(255,190,120,.10)'); bg.addColorStop(.7, 'rgba(255,170,100,.05)'); bg.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = bg; ctx.fillRect(rx - 330, ry - 330, 660, 660); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; rosette(ctx, rx, ry, { ...G, lines: 34, rot: t * .05, col: '#f3efe2', w: .5, a: .5 * (1 - .4 * u), cache: true }); ctx.restore();
  // the thread: one rosette line, peeled off and laid along the coast. The laid coast settles into a crisp cream line;
  // the free span and the rest still on the spool glow amber.
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
  const hot = Math.max(0, laid - Math.round(N * .04));
  for (const [w, a] of [[16, .05], [6, .15]]) { ctx.strokeStyle = rgba('#ffb35c', a); ctx.lineWidth = w; polyStroke(ctx, pts, hot, N - 1); }
  ctx.strokeStyle = rgba('#ffb35c', .1); ctx.lineWidth = 4.5; polyStroke(ctx, pts, 0, Math.max(0, hot));
  ctx.strokeStyle = rgba('#fff1d6', .95); ctx.lineWidth = 1.7; polyStroke(ctx, pts, hot, N - 1);
  ctx.strokeStyle = rgba('#f3efe2', .82); ctx.lineWidth = 1.25; polyStroke(ctx, pts, 0, Math.min(N - 1, hot + 2));
  ctx.restore();
  // the laying point: stippled light and a few sparks thrown off the line
  { const B = tipBloom(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(B, tip[0] - B.width / 2, tip[1] - B.height / 2); ctx.restore(); }
  { const r = prng(5); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 46; i++) { const a = r() * TAU, life = (t * (.6 + r() * .8) + r()) % 1, d = 6 + life * (40 + r() * 70), x = tip[0] + Math.cos(a) * d, y = tip[1] + Math.sin(a) * d - life * 18; ctx.fillStyle = `rgba(255,${200 + r() * 40 | 0},150,${.75 * (1 - life) * (.3 + .7 * r())})`; const sz = 1 + r() * 1.3; ctx.fillRect(x, y, sz, sz); } ctx.restore(); }
  ctx.restore();
  // in front: out-of-focus arcs and motes, the fastest planes
  { const [dx, dy] = L(1.7); ctx.drawImage(dofArcs(), dx, dy); }
  { const [dx, dy] = L(2.1); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(frontMotes(), -100 + dx - t * 9, -50 + dy - t * 3); ctx.restore(); }
  if (o.labels !== false) { const la = sm(lin(.3, .55, u)); text(ctx, 'ALASKA', 1430 + mx * .9, 246 + my * .9, { size: 64, font: 'Instrument Serif', color: rgba('#f3efe2', .92 * la), spacing: 6 }); text(ctx, 'THE RULE CAME FIRST · 1976', 1434 + mx * .9, 284 + my * .9, { size: 16, weight: 600, color: rgba('#ffd59a', .85 * la), spacing: 5 }); }
  const vg = ctx.createRadialGradient(W * .55, H * .5, 380, W * .55, H * .5, 1250); vg.addColorStop(0, 'rgba(4,5,16,0)'); vg.addColorStop(1, 'rgba(4,5,16,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ============ 6.22 · the map at night: Manila at dawn, Ohio at dusk ============
const MANILA = [120.98, 14.6], OHIO = [-82.99, 39.96];
export function mapNight(ctx, t, o = {}) {
  const utc = o.utc ?? 22.6, buzzT = o.buzz ?? 1.0;
  ctx.fillStyle = '#07080f'; ctx.fillRect(0, 0, W, H);
  // the table in a dark room, one warm lamp pool to the right
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.06); ctx.globalAlpha = .55; ctx.drawImage(tableLayer(), -TW / 2, -TH / 2); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#3a4060'; ctx.fillRect(0, 0, W, H); ctx.restore();
  // Pacific-centred view would cut the Americas; centre between Ohio and Manila across the Atlantic/Africa instead
  const cam = { cx: .05, cy: .26, z: 1.02 + .012 * t, rot: -.07 + .003 * Math.sin(t * .2), tilt: .5, x: W * .5 + drift(t, 8, 1), y: H * .56 + drift(t, 5, 2), f: 1500 };
  const M = worldMap(ctx, cam, { t, terminator: { utc, decl: -10.5 }, paper: '#e6dcc4', land: '#cbb68c', light: [W * .78, H * .2] });
  // city lights on the night side: tiny amber specks on land, only where the sun is down
  const lights = once('citylights', () => { const r = prng(51), pts = []; const D = []; for (let i = 0; i < 900; i++) { const lon = -180 + r() * 360, lat = -50 + Math.pow(r(), .8) * 110; pts.push([lon, lat, r()]); } return pts; });
  // two phones: Manila (dawn) and Ohio (dusk) buzz in the same frame; rings run toward each other along the twilight line
  const pM = project(cam, ...MANILA), pO = project(cam, ...OHIO);
  for (const [p, label, sub] of [[pM, 'MANILA', 'DAWN · 6:36 AM'], [pO, 'OHIO', 'DUSK · 6:36 PM']]) {
    const age = t - buzzT;
    for (let k = 0; k < 3; k++) { const a = age - k * .45; if (a < 0 || a > 2.6) continue; const rr = 10 + a * 120; ctx.strokeStyle = `rgba(255,179,92,${.7 * (1 - a / 2.6)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(p[0], p[1], rr, rr * .62, -.07, 0, 7); ctx.stroke(); }
    addGlow(ctx, p[0], p[1], 90, .55, '#ffb35c', '#fff1d6');
    shareLight(ctx, p[0], p[1], 9, t, { born: buzzT - .2 });
    const lx = p[0] + (label === 'OHIO' ? -230 : 40), ly = p[1] - 70;
    ctx.strokeStyle = 'rgba(255,241,214,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p[0], p[1] - 12); ctx.lineTo(lx + (label === 'OHIO' ? 190 : 0), ly + 10); ctx.stroke();
    ctx.fillStyle = 'rgba(7,9,24,.55)'; ctx.fillRect(lx - 10, ly - 30, 200, 52);
    text(ctx, label, lx, ly - 6, { size: 22, weight: 600, color: '#fff1d6', spacing: 5 });
    text(ctx, sub, lx, ly + 14, { size: 14, weight: 500, color: '#f3d9b0', spacing: 3 });
  }
  // lamp pool from the right and cold room light from the left
  const L = once('maplamp', () => { const [c, g] = canvas(W, H); const lg = g.createRadialGradient(W * .86, H * .1, 0, W * .8, H * .2, 1200); lg.addColorStop(0, 'rgba(255,190,120,.5)'); lg.addColorStop(.5, 'rgba(255,160,90,.12)'); lg.addColorStop(1, 'rgba(255,150,80,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); stipple(c, { k: .7, g: 1.2, seed: 33 }); return c; });
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.drawImage(L, 0, 0); ctx.restore();
  const vg = ctx.createRadialGradient(W * .5, H * .55, 380, W * .5, H * .55, 1250); vg.addColorStop(0, 'rgba(6,6,14,0)'); vg.addColorStop(1, 'rgba(6,6,14,.75)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}
