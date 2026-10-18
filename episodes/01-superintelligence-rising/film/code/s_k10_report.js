// "Within days the report was public, and every lab learned from it."
// A report writes itself (with the odd double loop drawn on it); on "public" an amber stamp lands on it, the sheet
// lifts off and flies out over a dawn valley full of lab campuses, splits into copies on "every lab", and each lab
// warms to amber as its copy arrives ("learned").
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const K = require('./s_k10_kit');
const { gf, rr, camera, glowStroke, ring, dawnSky, cached } = K;

const T0 = 626.55, T1 = 631.2;
const HZ = 470;                                // horizon
const T_STAMP = 628.12, T_FLY = 628.35, T_SPLIT = 628.95;

const R = rng(626);
const LABS = (() => {
  const spots = [[150, 760, 1.5], [430, 600, 0.95], [690, 700, 1.25], [880, 540, 0.7], [1090, 610, 0.95], [1300, 540, 0.68], [1490, 690, 1.25], [1730, 580, 0.9], [1800, 850, 1.7],
    [280, 520, 0.55], [700, 505, 0.45], [1160, 505, 0.45], [1600, 515, 0.55], [500, 900, 1.8], [1150, 880, 1.6]];
  return spots.map(([x, y, s], i) => ({ x, y, s, arr: T_SPLIT + 0.2 + (Math.abs(x - 960) / 960) * 0.6 + R() * 0.15, w: 120 + R() * 80, h: 60 + R() * 50, dome: R() < 0.5, seed: i }));
})().sort((a, b) => a.y - b.y);

function land(ctx, t) {
  dawnSky(ctx, t, -100, HZ + 40, 1480, HZ + 10, { glow: 0.42, sunR: 1000, seed: 6, clouds: 8 });
  ctx.fillStyle = rgba('#fff2cf', 0.95); ctx.beginPath(); ctx.arc(1480, HZ + 8, 36, Math.PI, 0); ctx.fill();
  light(ctx, 1480, HZ, 160, '#ffe0a8', 0.5);
  // far hills
  gf(ctx, c => { c.moveTo(-200, HZ); c.bezierCurveTo(200, HZ - 40, 500, HZ - 10, 800, HZ - 30); c.bezierCurveTo(1100, HZ - 50, 1400, HZ - 5, 1700, HZ - 25); c.lineTo(2200, HZ - 10); c.lineTo(2200, HZ + 20); c.lineTo(-200, HZ + 20); c.closePath(); }, '#7a5080', 0.4);
  // the valley floor
  gf(ctx, c => c.rect(-200, HZ, W + 400, H - HZ + 300), lin(ctx, 0, HZ, 0, H, [[0, '#a8708a'], [0.25, '#6a4a7c'], [1, '#2a2350']]), 0.5);
  // roads converging to the horizon
  ctx.strokeStyle = 'rgba(255,200,170,0.22)'; ctx.lineWidth = 3;
  for (const [x0, x1] of [[-300, 900], [700, 980], [2300, 1100], [1300, 1020]]) { ctx.beginPath(); ctx.moveTo(x0, H + 40); ctx.quadraticCurveTo((x0 + x1) / 2 + 80, (H + HZ) / 2 + 60, x1, HZ + 6); ctx.stroke(); }
  // fields
  const r = rng(4);
  for (let i = 0; i < 26; i++) { const y = HZ + 14 + r() * 500, s = (y - HZ) / 500, x = r() * W, w = 80 + 260 * s;
    ctx.fillStyle = rgba(r() < 0.5 ? '#8a5a86' : '#4a3a70', 0.25); ctx.beginPath(); ctx.ellipse(x, y, w, 6 + 30 * s, 0, 0, 7); ctx.fill(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(1480, HZ); ctx.scale(3, 0.5); ctx.fillStyle = rad(ctx, 0, 0, 0, 300, [[0, 'rgba(255,190,140,0.25)'], [1, 'rgba(255,190,140,0)']]); ctx.fillRect(-300, -300, 600, 600); ctx.restore();
}

function lab(ctx, t, b) {
  const k = ramp(t, b.arr, b.arr + 0.35), fl = Math.exp(-Math.max(0, t - b.arr) * 3) * (t > b.arr ? 1 : 0);
  ctx.save(); ctx.translate(b.x, b.y); ctx.scale(b.s, b.s);
  ctx.fillStyle = 'rgba(30,16,40,0.35)'; ctx.beginPath(); ctx.ellipse(30, 2, b.w * 0.7, 10, 0, 0, 7); ctx.fill();
  gf(ctx, c => c.rect(-b.w / 2, -b.h, b.w, b.h), lin(ctx, -b.w / 2, 0, b.w / 2, 0, [[0, '#d8a0a0'], [0.2, '#7a5a8e'], [1, '#3e3266']]), 0.4);
  gf(ctx, c => c.rect(-b.w / 2 + b.w * 0.55, -b.h - 30, b.w * 0.35, 30), lin(ctx, 0, -b.h - 30, 0, -b.h, [[0, '#6a5088'], [1, '#4a3a70']]), 0.4);
  // windows: cold at first, warm once the report lands
  for (let r = 0; r < 3; r++) for (let q = 0; q < Math.floor(b.w / 22); q++) {
    const x = -b.w / 2 + 8 + q * 22, y = -b.h + 10 + r * (b.h - 16) / 3, on = (q + r + b.seed) % 3 !== 0;
    ctx.fillStyle = on ? (k > 0 ? rgba('#ffcf8a', 0.25 + 0.7 * k) : rgba('#4a7a9a', 0.55)) : 'rgba(40,30,70,0.6)'; ctx.fillRect(x, y, 12, (b.h - 16) / 3 - 8);
  }
  // the lab's own small ring on the roof
  ctx.restore();
  const rx = b.x + b.w * 0.18 * b.s, ry = b.y - (b.h + 60) * b.s;
  ring(ctx, t + b.seed, rx, ry, 16 * b.s, 22 * b.s, 0.2, 0.7, 0.4);
  if (k > 0) { glowStroke(ctx, c => c.ellipse(rx, ry, 24 * b.s, 30 * b.s, 0.2, 0, 7), C.amber, 2 * b.s, 0.8 * k); }
  light(ctx, b.x, b.y - b.h * b.s * 0.5, (90 + 80 * fl) * b.s * 1.6, C.amber, 0.18 * k + 0.5 * fl);
}

function sheetArt(c) {
  gf(c, cc => cc.rect(-200, -260, 400, 520), lin(c, -200, -260, 200, 260, [[0, '#f6f1e4'], [0.7, '#dcd3cc'], [1, '#b8adb8']]), 0.3);
}
function sheet(ctx, t, x, y, s, rot, a, writing) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(30,14,40,0.35)'; ctx.fillRect(-188, -244, 400, 520);
  cached(ctx, 'k10sheet', -200, -260, 200, 260, sheetArt, 1);
  ctx.fillStyle = 'rgba(21,26,68,0.85)'; ctx.fillRect(-150, -220, 220 * clamp(writing * 6), 20);
  ctx.fillStyle = 'rgba(21,26,68,0.45)'; ctx.fillRect(-150, -188, 140 * clamp(writing * 6 - 0.4), 8);
  // the incident diagram: the double loop
  const dg = clamp(writing * 3 - 0.3);
  if (dg > 0) { ctx.save(); ctx.strokeStyle = 'rgba(10,111,140,0.85)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(-60, -80, 60, 36, 0.6, 0, 6.3 * dg); ctx.stroke(); ctx.beginPath(); ctx.ellipse(-20, -80, 60, 36, -0.6, 0, 6.3 * dg); ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = 'rgba(40,38,90,0.42)';
  for (let i = 0; i < 9; i++) { const k = clamp(writing * 10 - 1 - i * 0.8); if (k <= 0) break; ctx.fillRect(-150, -10 + i * 24, (i % 3 === 2 ? 180 : 300) * k, 7); }
  ctx.fillStyle = 'rgba(40,38,90,0.42)'; for (let i = 0; i < 4; i++) { const k = clamp(writing * 10 - 2 - i); if (k > 0) ctx.fillRect(60, -140 + i * 22, 90 * k, 6); }
  // the PUBLIC stamp
  const st = ramp(t, T_STAMP - 0.08, T_STAMP);
  if (st > 0) {
    const sc = lerp(1.6, 1, out(st));
    ctx.save(); ctx.translate(40, 170); ctx.rotate(-0.12); ctx.scale(sc, sc); ctx.globalAlpha = a * st;
    ctx.strokeStyle = '#d2702e'; ctx.lineWidth = 6; rr(ctx, -110, -36, 220, 72, 8); ctx.stroke();
    ctx.fillStyle = '#d2702e'; ctx.font = '50px "Inter SemiBold"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '8px'; ctx.fillText('PUBLIC', 4, 2);
    ctx.restore();
  }
  ctx.restore();
}

function draw(ctx, t) {
  const layer = camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.06, cx: 960, cy: 520, seed: 13 });
  layer(0.3, () => land(ctx, t));
  layer(0.6, () => { for (const b of LABS) lab(ctx, t, b); });
  // the sheet: written in front of us, stamped, then flies to the middle of the valley
  const writing = clamp((t - 626.65) / 1.0);
  const fly = ease((t - T_FLY) / (T_SPLIT - T_FLY));
  const lift = ease((t - 627.5) / 0.5) * (1 - fly);
  const sx = lerp(960, 960, fly), sy = lerp(640 - lift * 40, 400, fly) - Math.sin(fly * Math.PI) * 120, ss = lerp(1.0 + 0.04 * lift, 0.07, fly);
  const tilt = Math.sin(t * 1.3) * 0.02 + fly * 0.4;
  const stampHit = Math.exp(-Math.max(0, t - T_STAMP) * 8) * (t > T_STAMP ? 1 : 0);
  layer(1.0, () => {
    if (t < T_SPLIT + 0.05) {
      ctx.save(); ctx.translate(stampHit * 3 * Math.sin(t * 80), 0);
      sheet(ctx, t, sx, sy, ss, tilt, 1, writing);
      ctx.restore();
      light(ctx, sx, sy, 600 * ss + 40, '#fff0d0', 0.15 + 0.4 * fly);
    }
    // copies arc out to every lab
    if (t > T_SPLIT - 0.02) {
      const burst = Math.exp(-Math.max(0, t - T_SPLIT) * 4);
      light(ctx, 960, 400, 160, '#ffe6c0', 0.8 * burst);
      for (const b of LABS) {
        const k = clamp((t - T_SPLIT) / (b.arr - T_SPLIT)); if (k >= 1) continue;
        const e = ease(k), x = lerp(960, b.x, e), y = lerp(400, b.y - b.h * b.s, e) - Math.sin(e * Math.PI) * (120 + 80 * b.s);
        sheet(ctx, t, x, y, 0.05 + 0.05 * b.s, Math.sin(t * 6 + b.seed) * 0.3, 1, 1);
        light(ctx, x, y, 40, '#ffe0b0', 0.5);
      }
    }
  });
}

module.exports = { T0, T1, draw };
