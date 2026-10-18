// "Last spring, a model did something its makers didn't expect."
// A lab in morning light. The model, a calm cyan ring, turns steadily above its plinth while two researchers watch.
// On "did something" it stops, splits into two counter-twisting loops and throws a strand of light off its orbit;
// the monitor graph spikes. On "didn't expect" the researchers lean back and turn to each other.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const K = require('./s_k10_kit');
const { gf, rr, camera, glowStroke, ring, figure, dust } = K;

const T0 = 622.45, T1 = 626.85;
const RX = 960, RY = 400;

function room(ctx, t) {
  // back wall and a wide window onto a pink morning
  gf(ctx, c => c.rect(-200, -200, W + 400, 900), lin(ctx, 0, 0, 0, 700, [[0, '#1e1a46'], [1, '#2c2558']]), 0.55);
  ctx.save(); ctx.beginPath(); ctx.rect(240, 70, 1440, 520); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, 70, 0, 590, [[0, '#4a3a7a'], [0.5, '#b0687e'], [1, '#ffb47a']]); ctx.fillRect(240, 70, 1440, 520);
  light(ctx, 1500, 600, 700, '#ffc890', 0.35);
  const r = rng(62); let x = 240;
  while (x < 1680) { const w = 40 + r() * 90, h = 60 + r() * 200; ctx.fillStyle = rgba('#5a3f72', 0.85); ctx.fillRect(x, 590 - h, w, h);
    for (let k = 0; k < 5; k++) if (r() < 0.5) { ctx.fillStyle = rgba('#ffd59a', 0.5); ctx.fillRect(x + 6 + r() * (w - 14), 600 - h + r() * (h - 20), 5, 7); }
    x += w + 6; }
  ctx.restore();
  ctx.fillStyle = '#141032'; for (const mx of [240, 600, 960, 1320, 1680]) ctx.fillRect(mx - 7, 64, 14, 534); ctx.fillRect(232, 60, 1456, 14); ctx.fillRect(232, 586, 1456, 16);
  // floor
  gf(ctx, c => c.rect(-200, 640, W + 400, 600), lin(ctx, 0, 640, 0, H, [[0, '#3a3068'], [1, '#141232']]), 0.55);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(RX, 760); ctx.scale(1, 0.2); ctx.fillStyle = rad(ctx, 0, 0, 0, 700, [[0, rgba(C.cyan, 0.2)], [1, rgba(C.cyan, 0)]]); ctx.fillRect(-700, -700, 1400, 1400); ctx.restore();
  // window light falling on the floor in warm slabs
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const x0 of [280, 640, 1000, 1360]) { ctx.fillStyle = rgba('#ffb38a', 0.07); ctx.beginPath(); ctx.moveTo(x0, 640); ctx.lineTo(x0 + 330, 640); ctx.lineTo(x0 + 250, 1080); ctx.lineTo(x0 - 160, 1080); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  // plinth under the ring
  gf(ctx, c => { c.moveTo(RX - 120, 700); c.lineTo(RX + 120, 700); c.lineTo(RX + 90, 640); c.lineTo(RX - 90, 640); c.closePath(); }, lin(ctx, 0, 640, 0, 700, [[0, '#4a4a8a'], [1, '#1e1c46']]), 0.4);
  gf(ctx, c => c.ellipse(RX, 640, 90, 14, 0, 0, 7), lin(ctx, RX - 90, 0, RX + 90, 0, [[0, '#5a6ab8'], [1, '#2a2a5e']]), 0.3);
}

function desk(ctx, t, x, y, w, spike) {
  gf(ctx, c => { c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w + 40, y + 70); c.lineTo(x - 40, y + 70); c.closePath(); }, lin(ctx, 0, y, 0, y + 70, [[0, '#3a3270'], [1, '#1c1840']]), 0.5);
  gf(ctx, c => c.rect(x - 40, y + 70, w + 80, 260), lin(ctx, 0, y + 70, 0, y + 330, [[0, '#1a1638'], [1, '#0c0b20']]), 0.5);
  // monitor with a live graph
  const mx = x + w * 0.5 - 130, my = y - 200;
  ctx.fillStyle = '#0a0a1c'; ctx.fillRect(mx + 120, my + 160, 20, 42); rr(ctx, mx - 10, my - 10, 280, 180, 8); ctx.fill();
  gf(ctx, c => c.rect(mx, my, 260, 160), lin(ctx, 0, my, 0, my + 160, [[0, '#14608a'], [1, '#0a3450']]), 0.25);
  ctx.strokeStyle = rgba(C.cyanW, 0.85); ctx.lineWidth = 2.5; ctx.beginPath();
  for (let i = 0; i <= 60; i++) { const u = i / 60, tt = t - (1 - u) * 2.2; const sp = Math.exp(-((tt - 624.15) ** 2) / 0.02) * spike;
    const yv = my + 110 - 18 * Math.sin(tt * 5 + i * 0.2) * 0.5 - sp * 85; i ? ctx.lineTo(mx + 10 + u * 240, yv) : ctx.moveTo(mx + 10 + u * 240, yv); }
  ctx.stroke();
  ctx.fillStyle = rgba(C.cyanW, 0.4); for (let k = 0; k < 3; k++) ctx.fillRect(mx + 12, my + 12 + k * 10, 60 + k * 20, 4);
  light(ctx, mx + 130, my + 80, 220, C.cyan, 0.12);
}

const SPARK = (() => { const r = rng(9), a = []; for (let i = 0; i < 28; i++) a.push({ d: r() * 0.35, a: r() * 0.5 - 0.25, s: 1 + r() * 2 }); return a; })();

function model(ctx, t) {
  const odd = ramp(t, 624.0, 624.45) * (1 - ramp(t, 625.7, 626.6) * 0.8);
  const spin = t * 0.5, bob = Math.sin(t * 1.2) * 6;
  const jit = odd * (Math.exp(-Math.max(0, t - 624.05) * 5) * Math.sin(t * 60) * 6);
  const x = RX + jit, y = RY + bob;
  // floor and room take a little cyan from it
  light(ctx, x, y, 600, C.cyan, 0.10 + 0.08 * odd);
  if (odd < 0.02) { ring(ctx, t, x, y, 150 * (0.75 + 0.25 * Math.cos(spin)), 210, 0.15 * Math.sin(spin), 1.1, 1); return; }
  // the unexpected move: the ring splits into two loops that twist against each other
  const tw = odd * 0.95, sep = odd * 70;
  ring(ctx, t, x - sep, y, 150 * (0.75 + 0.25 * Math.cos(spin)) * (1 - 0.35 * odd), 210 * (1 - 0.15 * odd), 0.15 * Math.sin(spin) + tw, 1.1 - 0.3 * odd, 1);
  ring(ctx, t + 3, x + sep, y, 150 * (0.75 + 0.25 * Math.cos(spin + 1)) * (1 - 0.35 * odd), 210 * (1 - 0.15 * odd), 0.15 * Math.sin(spin) - tw, 0.85 * odd, 1);
  // a strand thrown off its orbit, curling out and back
  const k = clamp((t - 624.1) / 1.6);
  if (k > 0 && k < 1) {
    const path = c => { for (let i = 0; i <= 40; i++) { const u = i / 40 * k, a = -0.6 + u * 5.2, rr0 = 230 + 220 * Math.sin(u * Math.PI);
      const px = x + Math.cos(a) * rr0 * 0.9, py = y + Math.sin(a) * rr0 * 0.55 - u * 60; i ? c.lineTo(px, py) : c.moveTo(px, py); } };
    glowStroke(ctx, path, C.cyanW, 2.5, 0.8 * Math.sin(k * Math.PI));
  }
  const fl = Math.exp(-Math.max(0, t - 624.08) * 3) * (t > 624.05 ? 1 : 0);
  light(ctx, x, y, 260, C.cyanW, 0.45 * fl);
  for (const s of SPARK) { const u = (t - 624.08) * (1.2 + s.d * 3); if (u < 0 || u > 1.3) continue; const a = s.a * 6.28 + s.d * 20, rr0 = 120 + u * 420;
    light(ctx, x + Math.cos(a) * rr0, y + Math.sin(a) * rr0 * 0.7, 8 * s.s, C.cyanW, 0.8 * (1 - u / 1.3)); }
}

function draw(ctx, t) {
  const layer = camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.08, cx: RX, cy: 480, seed: 11 });
  const react = ease((t - 625.15) / 0.6);
  layer(0.3, () => room(ctx, t));
  layer(0.6, () => { model(ctx, t); dust(ctx, t, 500, 120, 900, 560, C.cyanW, 0.35); });
  layer(1.0, () => {
    desk(ctx, t, 160, 820, 520, 1);
    desk(ctx, t, 1240, 820, 520, 1);
  });
  // two researchers, seen from behind at their desks
  layer(1.25, () => {
    const b1 = Math.sin(t * 1.6), b2 = Math.sin(t * 1.5 + 1.3);
    // left: leans back on "didn't expect", turns to her colleague
    figure(ctx, { x: 470, y: 1075 + b1 * 2, s: 1.85, facing: 'back', br: b1, lean: lerp(0.08, -0.1, react), len: 0.92,
      turn: lerp(-0.1 + 0.08 * Math.sin(t * 0.7), 0.85, react), tilt: lerp(0.12, -0.05, react), lx: 1, rim: C.cyan, rimA: 0.5, rimDx: 3, rimDy: -2,
      hair0: '#2a1208', pal: ['#ffb35c', '#c9702e', '#5a2a12'],
      arms: [{ a1: 2.4, a2: -0.35, behind: true }, { a1: lerp(0.75, 0.4, react), a2: lerp(-2.7, -2.1, react), behind: true }] });
    // right: was typing; on "didn't expect" sits up and raises a hand toward the ring
    const hand = ease((t - 625.3) / 0.55);
    figure(ctx, { x: 1460, y: 1075 + b2 * 2, s: 1.9, facing: 'back', br: b2, lean: lerp(0.06, -0.06, react), len: 0.9,
      turn: lerp(0.12 * Math.sin(t * 0.5), -0.7, react), tilt: lerp(0.1, -0.15, react), lx: -1, rim: C.cyan, rimA: 0.55, rimDx: -3, rimDy: -2,
      pal: ['#7ec8d4', '#3e8494', '#163c48'],
      arms: [{ a1: lerp(2.4, 3.6, hand), a2: lerp(-0.4 + Math.sin(t * 13) * 0.05 * (1 - react), 3.9, hand), behind: hand < 0.5 }, { a1: 0.72, a2: -2.75 + Math.sin(t * 11) * 0.05 * (1 - react), behind: true }] });
  });
}

module.exports = { T0, T1, draw };
