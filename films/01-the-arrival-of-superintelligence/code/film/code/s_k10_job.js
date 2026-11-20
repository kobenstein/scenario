// "If AI shows up in your job, ask who's checking it."
// A morning office. On "AI shows up" a small cyan ring appears on a worker's screen and starts writing a document by
// itself. At the bottom of the page sits an empty "checked by" line. On "ask who's checking it" the worker turns to
// a colleague, points at the empty line, and it lights up amber with a question mark.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const K = require('./s_k10_kit');
const { gf, rr, camera, glowStroke, ring, dust, figure, cached } = K;

const T0 = 658.7, T1 = 662.7;
const SX = 700, SY = 150, SW = 720, SH = 470;            // screen
const T_AI = 659.4, T_ASK = 661.15, T_CHK = 661.74;
const R = rng(659);
const DOC = Array.from({ length: 13 }, (_, i) => ({ w: i % 4 === 3 ? 0.4 + R() * 0.2 : 0.7 + R() * 0.28, h: i === 0 ? 14 : 7 }));

function room(c) {
  gf(c, cc => cc.rect(-200, -200, W + 400, 1000), lin(c, 0, 0, 0, 760, [[0, '#2a2454'], [1, '#3a2f64']]), 0.55);
  // window wall at the back right, morning
  c.fillStyle = lin(c, 0, 60, 0, 520, [[0, '#6a4a86'], [0.6, '#d8807a'], [1, '#ffbe86']]); c.fillRect(1480, 60, 520, 460);
  c.fillStyle = '#1e1a40'; for (const x of [1480, 1650, 1820]) c.fillRect(x - 6, 54, 12, 472); c.fillRect(1474, 54, 560, 12); c.fillRect(1474, 516, 560, 14);
  // shelf with binders and a plant
  c.fillStyle = '#1a163a'; c.fillRect(80, 250, 420, 12);
  const r = rng(3); let x = 100; while (x < 440) { const w = 18 + r() * 20, h = 60 + r() * 40; c.fillStyle = r() < 0.3 ? '#5a3f78' : '#3a2f64'; c.fillRect(x, 250 - h, w, h); x += w + 4; }
  gf(c, cc => { cc.moveTo(400, 250); cc.lineTo(450, 250); cc.lineTo(444, 200); cc.lineTo(406, 200); cc.closePath(); }, '#c9702e', 0.3);
  for (let k = 0; k < 7; k++) gf(c, cc => cc.ellipse(425 + Math.cos(k) * 22, 180 - k * 6, 10, 26, Math.cos(k) * 0.8, 0, 7), '#3a6a5a', 0.3);
  // floor + desk
  gf(c, cc => cc.rect(-200, 760, W + 400, 500), lin(c, 0, 760, 0, H, [[0, '#2a2250'], [1, '#141230']]), 0.5);
}

function screen(ctx, t) {
  ctx.fillStyle = '#0a0a1c'; rr(ctx, SX - 16, SY - 16, SW + 32, SH + 32, 10); ctx.fill(); ctx.fillRect(SX + SW / 2 - 18, SY + SH + 10, 36, 90); ctx.fillRect(SX + SW / 2 - 90, SY + SH + 96, 180, 12);
  gf(ctx, c => rr(c, SX, SY, SW, SH, 4), lin(ctx, SX, SY, SX + SW * 0.4, SY + SH, [[0, '#1a5a7a'], [1, '#0a2c44']]), 0.25);
  // the page
  const px = SX + 150, py = SY + 30, pw = SW - 300, ph = SH - 60;
  gf(ctx, c => c.rect(px, py, pw, ph), lin(ctx, 0, py, 0, py + ph, [[0, '#f3efe2'], [1, '#d8d2c8']]), 0.2);
  // the AI arrives and writes
  const ai = ramp(t, T_AI - 0.1, T_AI + 0.3);
  if (ai > 0) { ring(ctx, t, SX + 75, SY + 85, 38 * ai, 50 * ai, 0.2, ai * 1.2, 0.6); }
  const budget = Math.max(0, t - T_AI - 0.2) * 9;   // rows per second
  let y = py + 26;
  DOC.forEach((d, i) => { const k = clamp(budget - i); if (k > 0) { ctx.fillStyle = i === 0 ? 'rgba(21,26,68,0.85)' : 'rgba(40,38,90,0.45)'; ctx.fillRect(px + 28, y, (pw - 56) * d.w * k, d.h); if (k < 1) { ctx.fillStyle = C.cyanD; ctx.fillRect(px + 28 + (pw - 56) * d.w * k + 3, y - 3, 3, d.h + 6); } }
    y += i === 0 ? 30 : 18; });
  // a glow of cyan on the page while it writes
  if (ai > 0) light(ctx, px + pw / 2, py + ph * 0.4, 260, C.cyan, 0.12 * ai);
  // the "checked by" line
  const fy = py + ph - 52, ask = ramp(t, T_ASK, T_ASK + 0.3), chk = Math.exp(-Math.max(0, t - T_CHK) * 3) * (t > T_CHK ? 1 : 0);
  ctx.save(); ctx.font = '24px "Inter SemiBold"'; ctx.letterSpacing = '3px'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(40,38,90,0.75)'; ctx.fillText('CHECKED BY', px + 28, fy + 14); ctx.restore();
  ctx.strokeStyle = 'rgba(40,38,90,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px + 220, fy + 26); ctx.lineTo(px + pw - 30, fy + 26); ctx.stroke();
  if (Math.floor(t * 2.5) % 2 === 0 && ask < 0.5) { ctx.fillStyle = 'rgba(40,38,90,0.8)'; ctx.fillRect(px + 200, fy + 2, 3, 22); }
  if (ask > 0) {
    ctx.strokeStyle = rgba('#d2702e', ask); ctx.lineWidth = 3; ctx.strokeRect(px + 16, fy - 8, pw - 32, 44);
    ctx.fillStyle = rgba('#d2702e', 0.12 * ask); ctx.fillRect(px + 16, fy - 8, pw - 32, 44);
    ctx.save(); ctx.globalAlpha = ask; ctx.fillStyle = '#d2702e'; ctx.font = `${Math.round(40 + 10 * chk)}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', px + (196 + pw - 30) / 2, fy + 12); ctx.restore();
    light(ctx, px + pw / 2, fy + 14, 200, C.amber, 0.2 * ask + 0.4 * chk);
  }
  ctx.fillStyle = 'rgba(216,247,255,0.06)'; ctx.fillRect(SX, SY, SW, SH * 0.4);
  light(ctx, SX + SW / 2, SY + SH / 2, 700, C.cyan, 0.1);
}

function draw(ctx, t) {
  const layer = camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.07, cx: 1000, cy: 480, seed: 33 });
  const turn = ease((t - (T_ASK - 0.1)) / 0.5);
  layer(0.4, () => { cached(ctx, 'k10office', -200, -200, W + 200, H + 200, room); light(ctx, 1740, 300, 600, '#ff9a6a', 0.22); });
  // the colleague by the window, holding a mug; she turns when asked
  layer(0.55, () => {
    const b = Math.sin(t * 1.5 + 1), look = ease((t - 661.45) / 0.5);
    figure(ctx, { x: 1660, y: 610 + b, s: 1.3, facing: 'front', br: b, lean: -0.02, turn: lerp(0.6, -0.55, look), tilt: lerp(0.05, -0.05, look), lx: 1,
      rim: '#ffd0a8', rimA: 0.6, rimDx: 3, rimDy: -2, pal: ['#e8a0a0', '#a85a6a', '#4a2030'], hair0: '#1c0a05',
      legs: [{ a1: Math.PI / 2 + 0.08, a2: Math.PI / 2 + 0.05 }, { a1: Math.PI / 2 - 0.08, a2: Math.PI / 2 - 0.05 }],
      arms: [{ a1: 1.9, a2: -0.2 + 0.05 * Math.sin(t) }, { a1: Math.PI / 2 - 0.15, a2: Math.PI / 2 - 0.1 }] });
    
  });
  layer(0.7, () => {
    // desk
    gf(ctx, c => { c.moveTo(120, 700); c.lineTo(1900, 700); c.lineTo(2100, 860); c.lineTo(-80, 860); c.closePath(); }, lin(ctx, 0, 700, 0, 860, [[0, '#4a3a72'], [1, '#2a2250']]), 0.5);
    gf(ctx, c => c.rect(-80, 860, 2200, 300), lin(ctx, 0, 860, 0, H, [[0, '#1c1838'], [1, '#0c0b20']]), 0.5);
    screen(ctx, t);
    // keyboard and a mug
    ctx.save(); ctx.translate(820, 760); ctx.transform(1, 0, -0.3, 1, 0, 0); gf(ctx, c => rr(c, 0, 0, 420, 70, 8), '#1e1a40', 0.4); ctx.restore();
    gf(ctx, c => { c.moveTo(1440, 700); c.lineTo(1500, 700); c.lineTo(1494, 770); c.lineTo(1446, 770); c.closePath(); }, lin(ctx, 1440, 0, 1500, 0, [[0, '#ffb35c'], [1, '#a2521f']]), 0.4);
  });
  // the worker in the foreground: hands on the keyboard, then turns and points at the empty line
  layer(1.2, () => {
    const b = Math.sin(t * 1.6), point = ease((t - T_ASK) / 0.45);
    figure(ctx, { x: 470, y: 1110 + b * 2, s: 2.1, facing: 'back', br: b, lean: lerp(0.08, 0.02, turn), len: 0.92, turn: lerp(0.35 + 0.08 * Math.sin(t * 0.6), 0.95, turn), tilt: lerp(0.12, -0.05, turn), lx: -1,
      rim: C.cyan, rimA: 0.45, rimDx: 3, rimDy: -2, pal: ['#ffb35c', '#c9702e', '#5a2a12'], hair0: '#3a1a0b',
      arms: [{ a1: 2.4, a2: -0.35, behind: true }, point > 0.02 ? { tx: lerp(620, 1060, point), ty: lerp(820, 600, point), bend: 1 } : { a1: 0.6, a2: -2.6 + Math.sin(t * 12) * 0.06, behind: true }] });
  });
}

module.exports = { T0, T1, draw };
