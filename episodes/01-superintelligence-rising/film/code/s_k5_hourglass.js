// "The other half is using the time."
// A tall hourglass whose falling sand glows amber like a lamp. In its light, two people work at a bench:
// one adjusts a small cyan ring in a test stand with a tool, the other writes and checks. The sand keeps running.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, out, ease } = L;
const { grainFill, roundRect, cap, glowStroke, cached, cam } = require('./s_k5_race');
const { figure } = require('./s_timeline');

const T0 = 331.1, T1 = 334.0;
const HG = { x: 640, y: 470, h: 300, w: 170 };          // centre, half height, half width

function bulb(c, up) {
  const { x, y, h, w } = HG, s = up ? -1 : 1;
  c.moveTo(x - 10, y); c.bezierCurveTo(x - 30, y + s * 40, x - w, y + s * 110, x - w, y + s * (h - 60));
  c.quadraticCurveTo(x - w, y + s * (h - 10), x - w + 40, y + s * (h - 6)); c.lineTo(x + w - 40, y + s * (h - 6));
  c.quadraticCurveTo(x + w, y + s * (h - 10), x + w, y + s * (h - 60)); c.bezierCurveTo(x + w, y + s * 110, x + 30, y + s * 40, x + 10, y); c.closePath();
}
function roomArt(c) {
  c.fillStyle = lin(c, 0, 0, 0, H, [[0, '#0a0a22'], [0.65, '#18163e'], [1, '#0c0b22']]); c.fillRect(-200, -200, W + 400, H + 400);
  // a board on the wall behind the bench, with sketches
  grainFill(c, cc => cc.rect(1080, 180, 640, 330), lin(c, 0, 180, 0, 510, [[0, '#1d2448'], [1, '#141a38']]), 0.5);
  c.strokeStyle = 'rgba(243,239,226,0.35)'; c.lineWidth = 3;
  c.beginPath(); c.ellipse(1220, 330, 70, 26, 0, 0, 7); c.stroke(); c.beginPath(); c.moveTo(1300, 330); c.lineTo(1400, 300); c.lineTo(1470, 330); c.stroke();
  for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(243,239,226,0.22)'; c.fillRect(1500, 230 + i * 34, 160 - (i % 3) * 30, 6); }
  c.strokeStyle = 'rgba(255,179,92,0.5)'; c.beginPath(); c.moveTo(1130, 450); for (let i = 0; i < 10; i++) c.lineTo(1130 + i * 30, 450 - i * i * 1.6); c.stroke();
  // floor and bench
  grainFill(c, cc => cc.rect(-200, 780, W + 400, 500), lin(c, 0, 780, 0, H, [[0, '#221e4c'], [1, '#09091c']]), 0.55);
}

function hourglass(ctx, t) {
  const { x, y, h, w } = HG, u = clamp(0.35 + (t - T0) * 0.04);
  // frame: caps and posts
  for (const s of [-1, 1]) grainFill(ctx, c => roundRect(c, x - w - 40, y + s * h - (s < 0 ? 30 : 0), 2 * w + 80, 30, 8), lin(ctx, 0, y + s * h - 30, 0, y + s * h + 30, [[0, '#b0602a'], [1, '#4a1e0c']]), 0.45);
  for (const s of [-1, 1]) grainFill(ctx, c => cap(c, x + s * (w + 22), y - h + 4, x + s * (w + 22), y + h - 4, 9, 9), lin(ctx, x + s * (w + 22) - 9, 0, x + s * (w + 22) + 9, 0, [[0, '#c9702e'], [1, '#5a2a12']]), 0.4);
  // glass
  for (const up of [true, false]) { ctx.fillStyle = 'rgba(160,190,255,0.08)'; ctx.beginPath(); bulb(ctx, up); ctx.fill(); }
  // sand: upper level sinks (funnel shape), lower pile grows
  ctx.save(); ctx.beginPath(); bulb(ctx, true); ctx.clip();
  const top = lerp(y - h + 80, y - 40, u);
  grainFill(ctx, c => { c.moveTo(x - w, top); c.quadraticCurveTo(x, top + 50, x + w, top); c.lineTo(x + w, y); c.lineTo(x - w, y); c.closePath(); }, lin(ctx, 0, top, 0, y, [[0, '#ffcf8a'], [1, '#e08a42']]), 0.4);
  ctx.restore();
  ctx.save(); ctx.beginPath(); bulb(ctx, false); ctx.clip();
  const pk = lerp(y + h - 40, y + 120, u);
  grainFill(ctx, c => { c.moveTo(x - w - 10, y + h); c.quadraticCurveTo(x - w * 0.5, y + h - 30, x, pk); c.quadraticCurveTo(x + w * 0.5, y + h - 30, x + w + 10, y + h); c.closePath(); }, lin(ctx, 0, pk, 0, y + h, [[0, '#ffd8a0'], [1, '#c9702e']]), 0.4);
  ctx.restore();
  // the falling stream of glowing grains
  glowStroke(ctx, c => { c.moveTo(x, y - 6); c.lineTo(x, pk); }, '#ffcf8a', 2.2, 0.9);
  for (let i = 0; i < 18; i++) { const ph = (t * 1.6 + i / 18) % 1, gy = lerp(y, pk, ph); ctx.fillStyle = rgba('#fff0d0', 0.9); ctx.fillRect(x - 1.5 + Math.sin(i * 7 + t * 9) * 1.5, gy, 3, 3); }
  light(ctx, x, pk, 160, '#ffcf8a', 0.6);
  light(ctx, x, y + 60, 520, C.amber, 0.3);
  // glass outline and highlights
  for (const up of [true, false]) { ctx.strokeStyle = 'rgba(216,230,255,0.45)'; ctx.lineWidth = 3; ctx.beginPath(); bulb(ctx, up); ctx.stroke(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - w + 30, y - h + 60); ctx.quadraticCurveTo(x - w + 20, y - 140, x - 40, y - 50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - w + 30, y + h - 60); ctx.quadraticCurveTo(x - w + 20, y + 140, x - 40, y + 50); ctx.stroke(); ctx.restore();
}

function benchArt(c) {
  grainFill(c, cc => { cc.moveTo(1040, 700); cc.lineTo(1800, 700); cc.lineTo(1830, 740); cc.lineTo(1010, 740); cc.closePath(); }, lin(c, 0, 700, 0, 740, [[0, '#7a3b17'], [1, '#3a1a0c']]), 0.45);
  c.fillStyle = '#1a0d06'; c.fillRect(1050, 740, 22, 200); c.fillRect(1770, 740, 22, 200);
  grainFill(c, cc => cc.rect(1010, 740, 820, 120), lin(c, 0, 740, 0, 860, [[0, '#2a1408'], [1, '#120806']]), 0.5);
}

function workers(ctx, t) {
  const rx = 1370, ry = 628;
  // the person adjusting it: the hand turns a small tool against the ring, back and forth
  const tw = Math.sin(t * 4.2) * 0.5 + 0.5, br = Math.sin(t * 1.7);
  figure(ctx, { x: 1200, y: 690, s: 0.85, facing: 'front', br, lean: 0.12, turn: 0.35, tilt: 0.35, lx: -1, grain: 0.35, rim: C.cyan, rimA: 0.4, rimDx: 2, rimDy: -2,
    pal: ['#ffc27c', '#cf7a36', '#5a2a12'], legs: [{ a1: Math.PI / 2, a2: Math.PI / 2 }, { a1: Math.PI / 2, a2: Math.PI / 2 }],
    arms: [{ tx: 1196, ty: 690, bend: -1 }, { tx: rx - 46 + 6 * tw, ty: ry + 10 - 10 * tw, bend: 1 }] });
  // the other writes in a notebook, glances up at the ring now and then
  const look = ramp(Math.sin(t * 1.1), 0.6, 0.9), wr = Math.sin(t * 9) * (1 - look);
  figure(ctx, { x: 1590, y: 690, s: 0.85, facing: 'front', br: Math.sin(t * 1.5 + 1), lean: 0.1, turn: lerp(-0.1, -0.7, look), tilt: lerp(0.45, 0.1, look), lx: -1, grain: 0.35,
    pal: ['#ffb35c', '#c9702e', '#5a2a12'], legs: [{ a1: Math.PI / 2, a2: Math.PI / 2 }, { a1: Math.PI / 2, a2: Math.PI / 2 }],
    arms: [{ tx: 1545 + wr * 6, ty: 694, bend: -1 }, { tx: 1622, ty: 694, bend: 1 }] });
  cached(ctx, 'k5hg_bench', 990, 690, 1850, 960, benchArt, 1);
  grainFill(ctx, c => { c.moveTo(1520, 700); c.lineTo(1640, 700); c.lineTo(1650, 712); c.lineTo(1512, 712); c.closePath(); }, '#f3efe2', 0.2);
  // test stand with a small cyan ring on the bench
  ctx.fillStyle = '#2a2458'; ctx.fillRect(rx - 6, ry + 40, 12, 52); ctx.fillRect(rx - 50, 690, 100, 12);
  light(ctx, rx, ry, 110, C.cyan, 0.4);
  glowStroke(ctx, c => c.ellipse(rx, ry, 52, 52, 0, 0, 7), C.cyan, 4, 0.9);
  glowStroke(ctx, c => c.ellipse(rx, ry, 52, 14 + 10 * Math.sin(t * 0.8), 0.3, 0, 7), C.cyanW, 1.5, 0.6);
  // the tool in the first person's hand, against the ring
  const tx = rx - 46 + 6 * tw, ty = ry + 10 - 10 * tw;
  ctx.strokeStyle = '#d8d4e8'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + 18, ty - 12 - 6 * tw); ctx.stroke();
}

function draw(ctx, t) {
  const layer = cam(ctx, t, T0, T1, 1.0, 1.07, 960, 520, 81);
  layer(0.4, () => cached(ctx, 'k5hg_room', -200, -200, W + 200, H + 200, roomArt, 1));
  layer(0.8, () => { workers(ctx, t); });
  layer(1.0, () => { hourglass(ctx, t); });
}

module.exports = { T0, T1, draw };
