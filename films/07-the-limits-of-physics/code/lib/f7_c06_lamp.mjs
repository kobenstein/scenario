// Film 7 · c06 · the price of light (6.03–6.05): one long sill in the dark, three lights in a row, each lit from the one before.
// Builder: c06. Pure functions of t, deterministic. World units = px at zoom 1; the sill's front edge is y = 0.
//   lampPrepare()                  builds the wall/sill ink layer (multiply texture) and the Babylon window view as Images (await once)
//   LAMP / CANDLE / BULB / TABLET / SLATE / WIN   positions (world)
//   lampWorld(ctx, t, cam, st)     draws everything; cam = { x, y, z }; st = {
//       candle 0..1 (its flame grown), bulb 0..1 (lit), bead: null|{ p: [x, y], trail: [[x, y]…] }, marks 0..40 (wedges pressed),
//       slate 0..1 (the single scratch), ghost 0..1 (dotted modern bulb above the lamp), drops 0..1, dropGlow 0..1,
//       pool: [lamp, candle, bulb] light radii factors, bloom 0..1 (the bulb's light floods the wall) }
//   → { m (camera map: X, Y, k), flame: { lamp, candle, bulb } screen points }
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { glowAt, ease, n1 } from './f7_kit.mjs';
import { ghostLine } from './ghost.mjs';

const TAU = Math.PI * 2;
export const LAMP = { x: 0, flame: [104, -50] }, TABLET = { x: -300, w: 176, h: 226 }, CANDLE = { x: 620, flame: [620, -204] }, BULB = { x: 1240, c: [1240, -292], flame: [1240, -296] }, SLATE = { x: 1500 };
export const WIN = { x0: -700, x1: -330, y0: -760, y1: -250 };
const X0 = -1500, X1 = 3300, Y0 = -1500, Y1 = 700, SC = .75;   // ink layer extent (world) and its pixel scale
const IM = {};
export const lampMap = (cam) => { const k = cam.z, cx = cam.x, cy = cam.y; return { k, X: (x) => W / 2 + (x - cx) * k, Y: (y) => H / 2 + (y - cy) * k, set: (ctx) => ctx.setTransform(k, 0, 0, k, W / 2 - cx * k, H / 2 - cy * k) }; };
const MB = [330, 950];   // material borders: mud brick | timber | plaster   // 0 mud brick, 1 timber, 2 plaster/stone

// ---------------------------------------------------------------- the ink layer (white = no change; multiplied over the light)
function buildInk() {
  const w = Math.ceil((X1 - X0) * SC), h = Math.ceil((Y1 - Y0) * SC), [c, g] = canvas(w, h), r = prng(612), n = vnoise(61);
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
  g.setTransform(SC, 0, 0, SC, -X0 * SC, -Y0 * SC);
  const SILL = -40;
  // --- the wall
  // mud brick (x < 450): rows of rough bricks, straw specks, the lower edges hatched
  for (let row = 0; ; row++) {
    const yb = SILL - row * 46, yt = yb - 46; if (yt < Y0) break;
    let x = X0 - (row % 2) * 60 - r() * 20;
    while (x < MB[0] + 20) {
      const bw = 104 + r() * 30, tone = r();
      const pts = []; const jit = () => (r() - .5) * 3.2;
      pts.push([x + 3 + jit(), yt + 3 + jit()], [x + bw - 3 + jit(), yt + 3 + jit()], [x + bw - 3 + jit(), yb - 3 + jit()], [x + 3 + jit(), yb - 3 + jit()]);
      g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.closePath();
      g.fillStyle = `rgb(${Math.round(226 + 18 * tone)},${Math.round(200 + 16 * tone)},${Math.round(166 + 14 * tone)})`; g.fill();
      g.strokeStyle = 'rgba(120,88,58,.55)'; g.lineWidth = 1.6; g.stroke();
      // the shadowed lower edge, engraved
      g.strokeStyle = 'rgba(110,80,50,.35)'; g.lineWidth = 1;
      for (let k = 0; k < 9; k++) { const hx = x + 8 + k * (bw - 16) / 8; g.beginPath(); g.moveTo(hx, yb - 4); g.lineTo(hx + 6, yb - 12); g.stroke(); }
      for (let k = 0; k < 7; k++) { const sx = x + 6 + r() * (bw - 12), sy = yt + 6 + r() * 34, a0 = r() * TAU, L = 4 + r() * 7; g.strokeStyle = `rgba(150,112,70,${.25 + .25 * r()})`; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a0) * L, sy + Math.sin(a0) * L); g.stroke(); }
      x += bw;
    }
  }
  // the mortar between rows (a deeper line)
  // timber (450 … 1350): vertical boards with grain
  for (let x = MB[0]; x < MB[1]; x += 92) {
    const tone = r(); g.fillStyle = `rgb(${Math.round(214 + 18 * tone)},${Math.round(190 + 16 * tone)},${Math.round(160 + 12 * tone)})`; g.fillRect(x + 2, Y0, 88, SILL - Y0);
    g.strokeStyle = 'rgba(96,70,44,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 1, Y0); g.lineTo(x + 1, SILL); g.stroke();
    g.lineWidth = .9;
    for (let k = 0; k < 9; k++) { const gx = x + 8 + k * 9 + r() * 3; g.strokeStyle = `rgba(110,82,54,${.18 + .2 * r()})`; g.beginPath(); for (let y = Y0; y <= SILL; y += 20) { const xx = gx + 3 * Math.sin(y * .011 + k + x) + 2 * n1(y * .03 + k * 7 + x); y === Y0 ? g.moveTo(xx, y) : g.lineTo(xx, y); } g.stroke(); }
    for (let k = 0; k < 2; k++) { const ky = Y0 + r() * (SILL - Y0), kx = x + 20 + r() * 50; g.strokeStyle = 'rgba(100,72,46,.35)'; g.beginPath(); g.ellipse(kx, ky, 6, 14, 0, 0, TAU); g.stroke(); g.beginPath(); g.ellipse(kx, ky, 11, 24, 0, 0, TAU); g.stroke(); }
  }
  // plaster (≥ 1350): smooth, a dado rail, fine stipple and a few hairline cracks
  { g.fillStyle = '#ece4d6'; g.fillRect(MB[1], Y0, X1 - MB[1], SILL - Y0);
    for (let i = 0; i < 9000; i++) { const x = MB[1] + r() * (X1 - MB[1]), y = Y0 + r() * (SILL - Y0); g.fillStyle = `rgba(140,120,96,${.08 + .12 * r()})`; g.fillRect(x, y, 1.6, 1.6); }
    g.strokeStyle = 'rgba(110,92,70,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(MB[1], -150); g.lineTo(X1, -150); g.stroke(); g.lineWidth = 1; g.beginPath(); g.moveTo(MB[1], -138); g.lineTo(X1, -138); g.stroke();
    for (let k = 0; k < 4; k++) { let x = MB[1] + 150 + r() * 1600, y = -900 + r() * 400; g.strokeStyle = 'rgba(110,90,70,.3)'; g.lineWidth = .8; g.beginPath(); g.moveTo(x, y); for (let q = 0; q < 12; q++) { x += (r() - .5) * 26; y += 10 + r() * 14; g.lineTo(x, y); } g.stroke(); } }
  // seams between the materials
  g.fillStyle = 'rgba(60,44,30,.7)'; g.fillRect(MB[0] - 3, Y0, 5, SILL - Y0); g.fillRect(MB[1] - 3, Y0, 5, SILL - Y0);
  // --- the sill: top surface (y -40 … 0, lit), front face (0 … 62), and the wall below it
  g.fillStyle = '#f4e8d2'; g.fillRect(X0, SILL, MB[0] + 2 - X0, 40); g.fillStyle = '#ead8b8'; g.fillRect(MB[0] + 2, SILL, MB[1] - MB[0], 40); g.fillStyle = '#f1ece2'; g.fillRect(MB[1] + 2, SILL, X1 - MB[1] - 2, 40);
  // brick sill: brick joints on top; timber: grain along; stone: a slab with a chamfer
  g.strokeStyle = 'rgba(120,88,58,.45)'; g.lineWidth = 1.4; for (let x = X0 + 30; x < MB[0]; x += 118) { g.beginPath(); g.moveTo(x, SILL + 2); g.lineTo(x + 8, -2); g.stroke(); }
  g.strokeStyle = 'rgba(110,82,54,.3)'; g.lineWidth = .9; for (let k = 0; k < 6; k++) { g.beginPath(); for (let x = MB[0] + 2; x <= MB[1] + 2; x += 20) { const y = SILL + 6 + k * 6 + 1.5 * Math.sin(x * .013 + k); x === MB[0] + 2 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  g.fillStyle = 'rgba(120,100,80,.25)'; g.fillRect(MB[1] + 2, -4, X1 - MB[1] - 2, 4);
  // front face (in shade: darker ink)
  g.fillStyle = '#b89a78'; g.fillRect(X0, 0, MB[0] + 2 - X0, 62); g.fillStyle = '#a88a66'; g.fillRect(MB[0] + 2, 0, MB[1] - MB[0], 62); g.fillStyle = '#bdb2a2'; g.fillRect(MB[1] + 2, 0, X1 - MB[1] - 2, 62);
  g.strokeStyle = 'rgba(80,58,40,.5)'; g.lineWidth = 1.2; for (let x = X0 + 30; x < MB[0]; x += 118) { g.beginPath(); g.moveTo(x + 8, 0); g.lineTo(x + 8, 62); g.stroke(); }
  // hatching on the front face (intaglio shadow)
  g.strokeStyle = 'rgba(70,50,34,.28)'; g.lineWidth = 1; for (let x = X0; x < X1; x += 7) { g.beginPath(); g.moveTo(x, 4); g.lineTo(x + 10, 58); g.stroke(); }
  g.fillStyle = 'rgba(40,28,20,.8)'; g.fillRect(X0, 0, X1 - X0, 2.5);
  // below the sill: the wall in deep shadow (dense hatch)
  g.fillStyle = '#8a7660'; g.fillRect(X0, 62, X1 - X0, Y1 - 62);
  g.strokeStyle = 'rgba(50,36,26,.35)'; for (let x = X0; x < X1; x += 6) { g.beginPath(); g.moveTo(x, 64); g.lineTo(x - 40, Y1); g.stroke(); }
  g.setTransform(1, 0, 0, 1, 0, 0);
  return c;
}
// the Babylon night through the window: indigo sky, stars, the ziggurat and palms as silhouettes on the horizon (window-local, 1 px = 1 unit)
function buildView() {
  const w = WIN.x1 - WIN.x0 + 40, h = WIN.y1 - WIN.y0 + 40, [c, g] = canvas(w * 2, h * 2), r = prng(77);
  g.scale(2, 2);
  const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, '#070a22'); sk.addColorStop(.6, '#12163a'); sk.addColorStop(.86, '#2a2350'); sk.addColorStop(1, '#3a2c5a');
  g.fillStyle = sk; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) { const x = r() * w, y = r() * h * .8, s = .5 + r() * 1.2; g.fillStyle = `rgba(240,236,224,${.25 + .6 * r()})`; g.fillRect(x, y, s, s); }
  // the ziggurat: three stepped terraces, a ramp, the shrine on top; palms
  const base = h - 26, zx = w * .58;
  g.fillStyle = '#0a0a1c';
  const tiers = [[260, 48], [190, 40], [124, 34], [56, 30]]; let y = base;
  for (const [tw, th] of tiers) { g.fillRect(zx - tw / 2, y - th, tw, th); y -= th; }
  g.beginPath(); g.moveTo(zx - 6, base); g.lineTo(zx + 6, base); g.lineTo(zx + 4, base - 120); g.lineTo(zx - 4, base - 120); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(180,160,230,.35)'; g.lineWidth = 1; y = base; for (const [tw, th] of tiers) { g.beginPath(); g.moveTo(zx + tw / 2, y); g.lineTo(zx + tw / 2, y - th); g.lineTo(zx - tw / 2, y - th); g.stroke(); y -= th; }
  const palm = (px, ph) => { g.strokeStyle = '#0a0a1c'; g.lineWidth = 4; g.beginPath(); g.moveTo(px, base); g.quadraticCurveTo(px + 8, base - ph * .5, px + 4, base - ph); g.stroke(); g.lineWidth = 2.4; for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .45; g.beginPath(); g.moveTo(px + 4, base - ph); g.quadraticCurveTo(px + 4 + Math.cos(a) * 26, base - ph + Math.sin(a) * 18 - 6, px + 4 + Math.cos(a) * 42, base - ph + Math.sin(a) * 30 + 14); g.stroke(); } };
  palm(w * .16, 110); palm(w * .24, 86); palm(w * .9, 96);
  g.fillStyle = '#0a0a1c'; g.fillRect(0, base, w, 40);
  // a far wall line of the city with two tiny lit windows
  g.fillRect(0, base - 18, w * .3, 18); g.fillRect(w * .78, base - 14, w * .22, 14); g.fillStyle = 'rgba(255,190,110,.7)'; g.fillRect(w * .1, base - 11, 3, 3); g.fillRect(w * .86, base - 8, 3, 3);
  return c;
}
export async function lampPrepare() {
  if (IM.ink) return;
  IM.ink = await loadImage(buildInk().toBuffer('image/png'));
  IM.view = await loadImage(buildView().toBuffer('image/png'));
}

// ---------------------------------------------------------------- objects
const flameShape = (ctx, x, y, h, wv, sway) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x - wv, y - h * .25, x - wv * .7, y - h * .7, x + sway, y - h); ctx.bezierCurveTo(x + wv * .7, y - h * .7, x + wv, y - h * .25, x, y); ctx.closePath(); };
// a living flame (world coords), u 0..1 grows it out of the wick; returns the light centre
function flame(ctx, t, x, y, s, u, seed) {
  if (u <= 0) return null;
  const n = (k) => n1(t * k + seed * 13.1), br = 1 + .03 * Math.sin(t * 1.7 + seed) + .02 * n(5.3);
  const h = 52 * s * br * ease.out(u), wv = 11 * s * Math.sqrt(ease.out(u)), sway = 4 * s * n(1.3) + 2 * s * n(3.1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const fg = ctx.createRadialGradient(x + sway * .3, y - h * .32, 0, x + sway * .3, y - h * .32, h * .9); fg.addColorStop(0, rgba('#fff6e2', .95)); fg.addColorStop(.35, rgba('#ffcf8a', .85)); fg.addColorStop(1, rgba('#e0782e', 0));
  ctx.fillStyle = fg; flameShape(ctx, x, y + 2 * s, h, wv, sway); ctx.fill();
  ctx.fillStyle = rgba('#ffffff', .8); flameShape(ctx, x + sway * .1, y - h * .05, h * .52, wv * .42, sway * .45); ctx.fill();
  ctx.fillStyle = rgba('#7aa0ff', .22); ctx.beginPath(); ctx.ellipse(x, y - 2 * s, wv * .55, 4 * s, 0, 0, TAU); ctx.fill();   // the blue root
  ctx.restore();
  return [x + sway * .3, y - h * .38];
}
function lampBody(ctx, t, x) {
  // a Babylonian clay oil lamp ("slipper" lamp): an oval body, a filling hole, a long nozzle pointing right, a small handle at the back
  ctx.save(); ctx.translate(x, 0);
  ctx.fillStyle = 'rgba(8,5,6,.55)'; ctx.beginPath(); ctx.ellipse(-4, -6, 104, 12, 0, 0, TAU); ctx.fill();   // contact shadow on the sill
  const body = () => { ctx.beginPath(); ctx.moveTo(-96, -30); ctx.bezierCurveTo(-98, -58, -40, -66, 10, -60); ctx.bezierCurveTo(46, -56, 70, -54, 100, -50); ctx.bezierCurveTo(104, -44, 98, -38, 86, -36); ctx.bezierCurveTo(70, -30, 50, -14, 20, -8); ctx.bezierCurveTo(-30, -2, -92, -6, -96, -30); ctx.closePath(); };
  const gb = ctx.createLinearGradient(-90, -60, 80, -10); gb.addColorStop(0, '#1e120c'); gb.addColorStop(.55, '#5a3622'); gb.addColorStop(1, '#9a6038');
  ctx.fillStyle = gb; body(); ctx.fill();
  // lit from the flame at the nozzle: warm light on the top right, intaglio hatch in the shade on the left
  ctx.save(); body(); ctx.clip();
  const gl = ctx.createRadialGradient(100, -54, 0, 100, -54, 170); gl.addColorStop(0, 'rgba(255,200,140,.55)'); gl.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = gl; ctx.fillRect(-110, -80, 230, 90);
  ctx.strokeStyle = 'rgba(20,10,8,.45)'; ctx.lineWidth = 1.1; for (let k = -100; k < 20; k += 6) { ctx.beginPath(); ctx.moveTo(k, -70); ctx.lineTo(k - 22, 0); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(255,214,170,.18)'; ctx.lineWidth = .9; for (let k = -60; k < 90; k += 9) { ctx.beginPath(); ctx.moveTo(k, -64); ctx.quadraticCurveTo(k + 14, -40, k + 4, -6); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,214,170,.55)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-40, -63); ctx.bezierCurveTo(0, -62, 60, -56, 99, -51); ctx.stroke();
  // the filling hole with a glint of oil, a ridge round it
  ctx.fillStyle = '#140c08'; ctx.beginPath(); ctx.ellipse(-28, -58, 26, 6.5, -.04, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,210,160,.4)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(-28, -58.5, 30, 8, -.04, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  ctx.fillStyle = rgba('#ffcf8a', .35 + .1 * Math.sin(t * 1.7)); ctx.beginPath(); ctx.ellipse(-20, -58.5, 9, 1.8, 0, 0, TAU); ctx.fill();
  // the handle (a small tab at the back)
  ctx.fillStyle = '#24160f'; ctx.beginPath(); ctx.moveTo(-94, -40); ctx.quadraticCurveTo(-122, -52, -116, -30); ctx.quadraticCurveTo(-110, -22, -95, -26); ctx.closePath(); ctx.fill();
  // the wick in the nozzle
  ctx.strokeStyle = '#1a0e08'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(92, -46); ctx.lineTo(104, -50); ctx.stroke();
  ctx.restore();
}
function tablet(ctx, t, marks, light) {
  const { x, w, h } = TABLET;
  ctx.save(); ctx.translate(x, 0); ctx.rotate(-.035);
  ctx.fillStyle = 'rgba(6,4,6,.55)'; ctx.beginPath(); ctx.ellipse(10, -4, w * .56, 10, 0, 0, TAU); ctx.fill();
  const shape = () => { ctx.beginPath(); ctx.roundRect(-w / 2, -h, w, h, 18); };
  const g = ctx.createLinearGradient(-w / 2, -h, w / 2, 0); g.addColorStop(0, '#24140c'); g.addColorStop(.6, '#5a3620'); g.addColorStop(1, '#7a4a2c');
  ctx.fillStyle = g; shape(); ctx.fill();
  ctx.save(); shape(); ctx.clip();
  const gl = ctx.createRadialGradient(w * .9, -h * .2, 0, w * .9, -h * .2, w * 1.4); gl.addColorStop(0, rgba('#ffc890', .32 * light)); gl.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = gl; ctx.fillRect(-w / 2, -h, w, h);
  ctx.strokeStyle = 'rgba(20,12,8,.3)'; ctx.lineWidth = 1; for (let k = -w; k < w; k += 6) { ctx.beginPath(); ctx.moveTo(k, -h); ctx.lineTo(k - 60, 0); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,214,170,.35)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.roundRect(-w / 2 + 1, -h + 1, w - 2, h - 2, 17); ctx.stroke();
  // the wedges: 5 rows (days) of 8 (hours), pressed one by one; each: a triangular head and a thin tail, dark inside, a lit lower lip
  const n = Math.floor(marks), fr = marks - n;
  for (let i = 0; i < Math.min(40, Math.ceil(marks)); i++) {
    const row = Math.floor(i / 8), col = i % 8, mx = -w / 2 + 22 + col * 18.5, my = -h + 40 + row * 38, u = i < n ? 1 : fr, sc = ease.out(u);
    ctx.save(); ctx.translate(mx, my); ctx.scale(sc, sc);
    ctx.fillStyle = 'rgba(18,10,6,.85)'; ctx.beginPath(); ctx.moveTo(-5, -7); ctx.lineTo(5, 0); ctx.lineTo(-5, 7); ctx.closePath(); ctx.fill();
    ctx.fillRect(-1, 2, 2.2, 18);
    ctx.strokeStyle = rgba('#ffd9a8', .45); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5, 7.5); ctx.lineTo(5.5, .5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1.6, 3); ctx.lineTo(1.6, 20); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
function candle(ctx, t, x, lit) {
  ctx.save(); ctx.translate(x, 0);
  ctx.fillStyle = 'rgba(6,4,6,.5)'; ctx.beginPath(); ctx.ellipse(4, -4, 66, 10, 0, 0, TAU); ctx.fill();
  // a pewter dish candlestick with a ring handle
  const dg = ctx.createLinearGradient(-60, 0, 60, 0); dg.addColorStop(0, '#2a2a30'); dg.addColorStop(.6, '#6a6a72'); dg.addColorStop(1, '#3a3a42');
  ctx.fillStyle = dg; ctx.beginPath(); ctx.ellipse(0, -10, 58, 12, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(220,220,230,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(0, -12, 54, 9, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  ctx.strokeStyle = '#4a4a52'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(66, -14, 13, 10, 0, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#3a3a42'; ctx.fillRect(-18, -30, 36, 20);
  // the candle (tallow cream), a drip, the wick
  const wg = ctx.createLinearGradient(-17, 0, 17, 0); wg.addColorStop(0, '#7a6a52'); wg.addColorStop(.45, '#e9dcbf'); wg.addColorStop(1, '#a8977a');
  ctx.fillStyle = wg; ctx.beginPath(); ctx.roundRect(-17, -176, 34, 150, [3, 3, 0, 0]); ctx.fill();
  ctx.fillStyle = '#f6ecd4'; ctx.beginPath(); ctx.ellipse(0, -176, 17, 4.5, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e4d6b6'; ctx.beginPath(); ctx.moveTo(10, -174); ctx.quadraticCurveTo(16, -150, 12, -128); ctx.quadraticCurveTo(7, -140, 7, -170); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(80,64,44,.3)'; ctx.lineWidth = .9; for (let k = -14; k < 16; k += 5) { ctx.beginPath(); ctx.moveTo(k, -170); ctx.lineTo(k, -30); ctx.stroke(); }
  if (lit > 0) { const gl = ctx.createRadialGradient(0, -200, 0, 0, -200, 140); gl.addColorStop(0, rgba('#ffd9a0', .35 * lit)); gl.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = gl; ctx.globalCompositeOperation = 'lighter'; ctx.fillRect(-20, -200, 40, 180); ctx.globalCompositeOperation = 'source-over'; }
  ctx.strokeStyle = '#1a1210'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -178); ctx.quadraticCurveTo(1, -184, 2, -190); ctx.stroke();
  ctx.restore();
}
function bulb(ctx, t, x, on) {
  const [bx, by] = BULB.c, R = 46;
  ctx.save();
  // the cloth cord from above, a black socket
  ctx.strokeStyle = '#1a1820'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx, Y0); ctx.lineTo(bx, by - 98); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,190,170,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx + 1, Y0); ctx.lineTo(bx + 1, by - 98); ctx.stroke();
  const sg = ctx.createLinearGradient(bx - 16, 0, bx + 16, 0); sg.addColorStop(0, '#121016'); sg.addColorStop(.6, '#3a3640'); sg.addColorStop(1, '#16141a');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(bx - 17, by - 100, 34, 40, 4); ctx.fill();
  ctx.fillStyle = '#6a5a3c'; ctx.fillRect(bx - 13, by - 62, 26, 14); ctx.strokeStyle = 'rgba(30,24,14,.6)'; ctx.lineWidth = 1; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(bx - 13, by - 60 + k * 3.5); ctx.lineTo(bx + 13, by - 58 + k * 3.5); ctx.stroke(); }
  // the glass: a pear shape
  const glass = () => { ctx.beginPath(); ctx.moveTo(bx - 12, by - 48); ctx.bezierCurveTo(bx - 14, by - 30, bx - R, by - 22, bx - R, by + 4); ctx.bezierCurveTo(bx - R, by + 34, bx - 22, by + R + 2, bx, by + R + 2); ctx.bezierCurveTo(bx + 22, by + R + 2, bx + R, by + 34, bx + R, by + 4); ctx.bezierCurveTo(bx + R, by - 22, bx + 14, by - 30, bx + 12, by - 48); ctx.closePath(); };
  const og = ctx.createRadialGradient(bx, by + 4, 0, bx, by + 4, R * 1.2);
  og.addColorStop(0, `rgba(${Math.round(mix(40, 255, on))},${Math.round(mix(44, 236, on))},${Math.round(mix(60, 200, on))},${mix(.5, .95, on)})`); og.addColorStop(.7, `rgba(${Math.round(mix(30, 255, on))},${Math.round(mix(34, 190, on))},${Math.round(mix(48, 110, on))},${mix(.45, .8, on)})`); og.addColorStop(1, `rgba(${Math.round(mix(20, 230, on))},${Math.round(mix(24, 140, on))},${Math.round(mix(36, 70, on))},${mix(.5, .55, on)})`);
  ctx.fillStyle = og; glass(); ctx.fill();
  ctx.strokeStyle = rgba(on > .3 ? '#fff1d6' : '#c8d0e8', .45); ctx.lineWidth = 1.2; glass(); ctx.stroke();
  // the filament: support wires and a zigzag coil
  ctx.strokeStyle = rgba('#3a3028', 1 - on * .7); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(bx - 5, by - 48); ctx.lineTo(bx - 12, by - 4); ctx.moveTo(bx + 5, by - 48); ctx.lineTo(bx + 12, by - 4); ctx.stroke();
  const fil = () => { ctx.beginPath(); ctx.moveTo(bx - 12, by - 4); for (let k = 1; k <= 8; k++) ctx.lineTo(bx - 12 + k * 3, by - 4 + (k % 2 ? -5 : 0)); };
  ctx.strokeStyle = on > 0 ? `rgba(255,${Math.round(mix(120, 250, on))},${Math.round(mix(40, 220, on))},${clamp(.4 + on)})` : 'rgba(60,50,40,.9)'; ctx.lineWidth = 1.6; fil(); ctx.stroke();
  // a highlight on the glass (left)
  ctx.strokeStyle = rgba('#ffffff', .25 + .2 * on); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(bx, by + 4, R - 9, Math.PI * .95, Math.PI * 1.3); ctx.stroke();
  ctx.restore();
}
function slate(ctx, t, s) {
  ctx.save(); ctx.translate(SLATE.x, 0); ctx.rotate(.03);
  ctx.fillStyle = 'rgba(6,4,6,.5)'; ctx.beginPath(); ctx.ellipse(6, -4, 70, 9, 0, 0, TAU); ctx.fill();
  const w = 124, h = 92, g = ctx.createLinearGradient(-w / 2, -h, w / 2, 0); g.addColorStop(0, '#1a1c24'); g.addColorStop(1, '#3a3e4a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-w / 2, -h, w, h, 6); ctx.fill();
  ctx.strokeStyle = 'rgba(220,226,240,.25)'; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1; for (let k = -w; k < w; k += 5) { ctx.beginPath(); ctx.moveTo(k, -h); ctx.lineTo(k - 40, 0); ctx.stroke(); }
  if (s > 0) { // ONE tiny wedge: the work of less than a second
    const u = ease.out(s); ctx.fillStyle = rgba('#f3ecda', .95); ctx.save(); ctx.translate(-20, -54); ctx.scale(u * 1.6, u * 1.6); ctx.beginPath(); ctx.moveTo(-4, -5); ctx.lineTo(4, 0); ctx.lineTo(-4, 5); ctx.closePath(); ctx.fill(); ctx.fillRect(-.7, 1.5, 1.4, 12); ctx.restore(); }
  ctx.restore();
}
function drop(ctx, x, y, s, a, glow) {
  if (a <= 0) return;
  // one drop of fuel, engraved in amber on the sill's face
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const sh = () => { ctx.beginPath(); ctx.moveTo(0, -24); ctx.bezierCurveTo(6, -12, 15, -2, 15, 8); ctx.bezierCurveTo(15, 18, 8, 24, 0, 24); ctx.bezierCurveTo(-8, 24, -15, 18, -15, 8); ctx.bezierCurveTo(-15, -2, -6, -12, 0, -24); ctx.closePath(); };
  ctx.save(); sh(); ctx.clip(); const u = ease.out(a); ctx.fillStyle = rgba('#ffb35c', .55 + .35 * glow); ctx.fillRect(-16, 24 - 50 * u, 32, 50 * u); ctx.restore();
  ctx.strokeStyle = rgba('#fff1d6', .85 * clamp(a * 2)); ctx.lineWidth = 1.6; sh(); ctx.stroke();
  ctx.strokeStyle = rgba('#fff1d6', .5 * clamp(a * 2)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-7, 6); ctx.quadraticCurveTo(-8, 14, -3, 18); ctx.stroke();
  ctx.restore();
  if (glow > 0) glowAt(ctx, x, y + 8 * s, 40 * s, .45 * glow * a, '#ffb35c', '#fff1d6');
}
// a dotted engraved outline of a modern bulb (it does not exist yet)
const GBULB = (() => { const o = [], R = 50; const P = (x, y) => o.push([x, y]); for (let i = 0; i <= 60; i++) { const q = Math.PI * .72 + i / 60 * Math.PI * 1.56; P(R * Math.cos(q), R * Math.sin(q)); } P(14, -62); P(14, -84); P(-14, -84); P(-14, -62); P(R * Math.cos(Math.PI * .72), R * Math.sin(Math.PI * .72)); return o; })();

// ---------------------------------------------------------------- the world
export function lampWorld(ctx, t, cam, st = {}) {
  const m = lampMap(cam), k = m.k;
  const candleU = st.candle ?? 0, bulbU = st.bulb ?? 0, pool = st.pool || [1, 1, 1], bloom = st.bloom ?? 0;
  // 1 · the dark
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#100d16'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); m.set(ctx);
  // 2 · the light on the wall and the sill (additive), one pool per light
  const lights = [];
  const brL = 1 + .03 * Math.sin(t * 1.7) + .02 * n1(t * 5.3);
  lights.push([LAMP.flame[0], LAMP.flame[1] - 24, 820 * pool[0] * brL, .8]);
  if (candleU > 0) lights.push([CANDLE.flame[0], CANDLE.flame[1] - 20, 860 * pool[1] * (1 + .03 * Math.sin(t * 1.9 + 1)), .72 * ease.out(candleU)]);
  if (bulbU > 0) lights.push([BULB.c[0], BULB.c[1], mix(1100, 2600, ease.io(bloom)) * pool[2], mix(.8, .95, bloom) * ease.out(bulbU)]);
  ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, R, I] of lights) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, rgba('#ffd9a0', I)); g.addColorStop(.2, rgba('#ffb066', .62 * I)); g.addColorStop(.5, rgba('#c0682e', .3 * I)); g.addColorStop(.8, rgba('#7a3a1c', .1 * I)); g.addColorStop(1, rgba('#6a3018', 0));
    ctx.fillStyle = g; ctx.fillRect(x - R, y - R, 2 * R, 2 * R);
  }
  // 3 · the engraving of wall and sill, multiplied (shows only where light falls)
  ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(IM.ink, X0, Y0, (X1 - X0), (Y1 - Y0));
  ctx.globalCompositeOperation = 'source-over';
  // 4 · the window onto the Babylon night (an arched opening in the mud wall; its reveal lit by the lamp)
  const winA = () => { const { x0, x1, y0, y1 } = WIN, rx = (x1 - x0) / 2; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0 + rx); ctx.arc(x0 + rx, y0 + rx, rx, Math.PI, 0); ctx.lineTo(x1, y1); ctx.closePath(); };
  if (m.X(WIN.x1) > -20 && m.X(WIN.x0) < W + 20) {
    ctx.save(); winA(); ctx.clip(); const vx = WIN.x0 - 20 + (cam.x - 0) * .06, vy = WIN.y0 - 20 + (cam.y + 200) * .04; ctx.drawImage(IM.view, vx, vy, WIN.x1 - WIN.x0 + 40, WIN.y1 - WIN.y0 + 40);
    // the stars twinkle a little
    ctx.globalCompositeOperation = 'lighter'; const r = prng(5); for (let i = 0; i < 14; i++) { const sx = WIN.x0 + 20 + r() * 330, sy = WIN.y0 + 30 + r() * 280, tw = .5 + .5 * Math.sin(t * (1 + r() * 2) + i * 2); ctx.fillStyle = rgba('#fff6e0', .5 * tw); ctx.fillRect(sx, sy, 2, 2); }
    ctx.restore();
    ctx.save(); winA(); ctx.strokeStyle = 'rgba(20,12,8,.9)'; ctx.lineWidth = 10; ctx.stroke(); ctx.strokeStyle = rgba('#ffcf96', .3); ctx.lineWidth = 2; ctx.translate(5, 3); winA(); ctx.stroke(); ctx.restore();
    // the reveal: the thickness of the wall on the right side, lit
    ctx.fillStyle = 'rgba(150,100,60,.55)'; ctx.beginPath(); ctx.moveTo(WIN.x1, WIN.y1); ctx.lineTo(WIN.x1 - 22, WIN.y1 - 10); ctx.lineTo(WIN.x1 - 22, WIN.y0 + (WIN.x1 - WIN.x0) / 2 + 10); ctx.lineTo(WIN.x1, WIN.y0 + (WIN.x1 - WIN.x0) / 2); ctx.closePath(); ctx.fill();
  }
  // 5 · the objects
  tablet(ctx, t, st.marks ?? 0, 1);
  lampBody(ctx, t, LAMP.x);
  candle(ctx, t, CANDLE.x, candleU);
  bulb(ctx, t, BULB.x, ease.out(bulbU));
  slate(ctx, t, st.slate ?? 0);
  // the dotted modern bulb above the lamp ("as bright as a modern bulb")
  const gh = st.ghost ?? 0;
  if (gh > 0) { ctx.save(); ctx.translate(LAMP.flame[0] + 2, -86); ctx.scale(1.7, 1.7); ghostLine(ctx, GBULB, { ghost: 1, u: ease.out(gh), col: '#fff1d6', w: 2 / k, a: .95 * Math.min(1, gh * 2), dot: 7 / k, t, glow: '#ffb35c' }); ctx.restore(); }
  // fuel drops on the sill's face, the same for every light
  const dA = st.drops ?? 0, dG = st.dropGlow ?? 0;
  if (dA > 0) for (const [x, i] of [[LAMP.flame[0] - 40, 0], [CANDLE.x, 1], [BULB.x, 2]]) { const a = clamp((dA - i * .12) / .76); drop(ctx, x, 30, 1, a, dG); }
  // 6 · the flames and their blooms
  const fl = flame(ctx, t, LAMP.flame[0], LAMP.flame[1], 1, 1, 1);
  const fc = flame(ctx, t, CANDLE.flame[0], CANDLE.flame[1] + 14, .92, candleU, 2);
  ctx.globalCompositeOperation = 'lighter';
  if (fl) { glowAt(ctx, fl[0], fl[1], 120 * brL, .55, '#ffb35c', '#fff1d6'); glowAt(ctx, fl[0], fl[1], 300, .14, '#ffb35c', '#ffd9a0'); }
  if (fc) { glowAt(ctx, fc[0], fc[1], 120, .55 * candleU, '#ffb35c', '#fff1d6'); glowAt(ctx, fc[0], fc[1], 320, .15 * candleU, '#ffb35c', '#ffd9a0'); }
  if (bulbU > 0) { const b = ease.out(bulbU); glowAt(ctx, BULB.c[0], BULB.c[1], 150, .7 * b, '#ffd08e', '#ffffff'); glowAt(ctx, BULB.c[0], BULB.c[1], mix(420, 1500, ease.io(bloom)), mix(.2, .42, bloom) * b, '#ffb35c', '#ffe2a8'); }
  // the bead of fire that hands the flame on
  if (st.bead) {
    const { p, trail } = st.bead;
    if (trail && trail.length > 1) { ctx.lineCap = 'round'; for (let i = 1; i < trail.length; i++) { const q = i / trail.length; ctx.strokeStyle = rgba('#ffcf8a', .7 * q); ctx.lineWidth = (1 + 3 * q) / Math.sqrt(k); ctx.beginPath(); ctx.moveTo(trail[i - 1][0], trail[i - 1][1]); ctx.lineTo(trail[i][0], trail[i][1]); ctx.stroke(); } }
    glowAt(ctx, p[0], p[1], 46, .9, '#ffb35c', '#ffffff'); glowAt(ctx, p[0], p[1], 140, .25, '#ffb35c', '#fff1d6');
  }
  ctx.restore();
  return { m, flame: { lamp: [m.X(LAMP.flame[0]), m.Y(LAMP.flame[1] - 20)], candle: [m.X(CANDLE.flame[0]), m.Y(CANDLE.flame[1] - 10)], bulb: [m.X(BULB.c[0]), m.Y(BULB.c[1])] } };
}
// the bead's path: lamp flame → candle wick → bulb filament (two arcs); s 0..2
export function beadAt(s) {
  const arc = (a, b, h, q) => [mix(a[0], b[0], q), mix(a[1], b[1], q) - h * Math.sin(Math.PI * q)];
  if (s <= 1) return arc([LAMP.flame[0], LAMP.flame[1] - 24], [CANDLE.x + 2, -190], 160, clamp(s));
  return arc([CANDLE.x + 2, -214], [BULB.c[0], BULB.c[1] - 4], 150, clamp(s - 1));
}
