// "And tell the people who represent you that outside testing should be the law."
// A town-hall chamber in morning light. A citizen at the microphone, seen from behind, speaks up to the
// representatives at the long desk; they turn to listen. On "outside testing" a bill appears on the screen behind
// them with the outside-check symbol (a lens with a checkmark); on "law" an amber seal stamps it.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const K = require('./s_k10_kit');
const { gf, rr, camera, glowStroke, dust, figure, check, cached } = K;

const T0 = 662.4, T1 = 667.1;
const T_TELL = 662.9, T_TEST = 664.85, T_LAW = 666.42;
const DESK_Y = 560;
const REPS = [[560, 0.95], [760, 1.0], [960, 1.05], [1160, 1.0], [1360, 0.95]];
const RPAL = [['#c88a5a', '#8a4a2a', '#3a1a0c'], ['#e8a0a0', '#a85a6a', '#4a2030'], ['#ffb35c', '#c9702e', '#5a2a12'], ['#d9b07a', '#9a6a3a', '#3e2410'], ['#a0b0d8', '#5a6a9a', '#262e50']];

function chamber(c) {
  gf(c, cc => cc.rect(-200, -200, W + 400, 1000), lin(c, 0, 0, 0, 760, [[0, '#2a2252'], [1, '#3e3068']]), 0.55);
  // tall windows either side, morning light
  for (const x of [80, 1640]) { c.fillStyle = lin(c, 0, 80, 0, 640, [[0, '#7a5088'], [0.6, '#e08a78'], [1, '#ffc088']]); rr(c, x, 80, 200, 560, 100); c.fill();
    c.fillStyle = '#221c46'; for (const mx of [64, 132]) c.fillRect(x + mx - 3, 80, 6, 560); for (const my of [200, 330, 460]) c.fillRect(x, my, 200, 6); c.strokeStyle = '#221c46'; c.lineWidth = 12; c.beginPath(); rr(c, x, 80, 200, 560, 100); c.stroke(); }
  // wall panels and pilasters
  for (const x of [380, 1500]) gf(c, cc => cc.rect(x - 20, 0, 40, 760), lin(c, x - 20, 0, x + 20, 0, [[0, '#4a3a78'], [1, '#2a2252']]), 0.5);
  // the long desk (dais)
  gf(c, cc => { cc.moveTo(380, DESK_Y); cc.quadraticCurveTo(960, DESK_Y - 40, 1540, DESK_Y); cc.lineTo(1580, DESK_Y + 150); cc.quadraticCurveTo(960, DESK_Y + 110, 340, DESK_Y + 150); cc.closePath(); },
    lin(c, 0, DESK_Y, 0, DESK_Y + 150, [[0, '#7a5a8a'], [0.1, '#5a4278'], [1, '#2e2656']]), 0.5);
  c.strokeStyle = 'rgba(255,210,170,0.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(380, DESK_Y); c.quadraticCurveTo(960, DESK_Y - 40, 1540, DESK_Y); c.stroke();
  // floor
  gf(c, cc => cc.rect(-200, 700, W + 400, 600), lin(c, 0, 700, 0, H, [[0, '#3a2e62'], [1, '#161232']]), 0.5);
}

function bill(ctx, t) {
  const a = ramp(t, T_TEST - 0.1, T_TEST + 0.35); if (a <= 0) return;
  const x = 960, y = 245, s = 0.88 * lerp(0.85, 1, out(a));
  ctx.save(); ctx.translate(x, y + (1 - a) * 20); ctx.scale(s, s); ctx.globalAlpha = a;
  light(ctx, 0, 0, 380, '#ffe0b0', 0.18);
  ctx.fillStyle = 'rgba(20,10,30,0.35)'; ctx.fillRect(-176, -186, 360, 380);
  gf(ctx, c => c.rect(-180, -190, 360, 380), lin(ctx, 0, -190, 0, 190, [[0, '#f6f1e4'], [1, '#d8cfc4']]), 0.25);
  ctx.fillStyle = 'rgba(21,26,68,0.85)'; ctx.fillRect(-140, -160, 200, 16);
  ctx.fillStyle = 'rgba(21,26,68,0.4)'; ctx.fillRect(-140, -132, 130, 7);
  // the outside-check symbol: a lens with a checkmark in it
  ctx.strokeStyle = '#0a6f8c'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(-40, -30, 54, 0, 7); ctx.stroke();
  ctx.lineCap = 'round'; ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(-2, 8); ctx.lineTo(36, 46); ctx.stroke();
  check(ctx, -40, -28, 70 * clamp((t - T_TEST - 0.15) / 0.5 + 0.0001), clamp((t - T_TEST - 0.15) / 0.5), '#d2702e', 9);
  ctx.fillStyle = 'rgba(40,38,90,0.4)'; for (let i = 0; i < 5; i++) ctx.fillRect(-140, 72 + i * 18, (i % 2 ? 200 : 280), 6);
  // the seal on "law"
  const st = ramp(t, T_LAW - 0.08, T_LAW);
  if (st > 0) {
    const sc = lerp(1.8, 1, out(st));
    ctx.save(); ctx.translate(100, 120); ctx.rotate(-0.15); ctx.scale(sc, sc); ctx.globalAlpha = a * st;
    ctx.fillStyle = '#d2702e'; ctx.beginPath(); for (let i = 0; i < 24; i++) { const r = i % 2 ? 46 : 52, an = i / 24 * Math.PI * 2; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,230,190,0.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 34, 0, 7); ctx.stroke();
    ctx.fillStyle = 'rgba(255,236,200,0.95)'; ctx.font = '40px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('§', 0, 2);
    ctx.restore();
  }
  ctx.restore();
  const fl = Math.exp(-Math.max(0, t - T_LAW) * 3) * (t > T_LAW ? 1 : 0);
  if (fl > 0.01) { light(ctx, x + 100, y + 120, 260, C.amber, 0.7 * fl); glowStroke(ctx, c => c.arc(x + 100, y + 120, 60 + (1 - fl) * 160, 0, 7), '#ffe0b0', 2, 0.6 * fl); }
}

function draw(ctx, t) {
  const layer = camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.08, cx: 960, cy: 420, seed: 37 });
  const listen = ease((t - (T_TELL + 0.2)) / 0.7), law = ramp(t, T_LAW, T_LAW + 0.4);
  layer(0.35, () => { cached(ctx, 'k10chamber', -200, -200, W + 200, H + 200, chamber);
    light(ctx, 180, 380, 500, '#ff9a6a', 0.18); light(ctx, 1740, 380, 500, '#ff9a6a', 0.18);
    // the screen behind the dais
    ctx.fillStyle = '#141032'; rr(ctx, 700, 50, 520, 380, 10); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, 60, 0, 420, [[0, '#2a3a6a'], [1, '#1a2450']]); rr(ctx, 712, 62, 496, 356, 6); ctx.fill();
    bill(ctx, t);
    if (law > 0) light(ctx, 960, 500, 900, C.amber, 0.12 * law);
  });
  // the representatives behind the desk turn to listen, and nod on "law"
  layer(0.45, () => {
    REPS.forEach(([x, s], i) => {
      const b = Math.sin(t * 1.5 + i * 1.3), nod = Math.sin(clamp((t - T_LAW - i * 0.06) / 0.5) * Math.PI) * 0.12;
      const y = DESK_Y + 10 - Math.abs(x - 960) * 0.02;
      figure(ctx, { x, y: y + b, s: s * 0.95, facing: 'front', br: b, lean: 0.02 * Math.sin(t * 0.4 + i), turn: lerp(0.3 * Math.sin(i * 2.1), (960 - x) / 900 * 0.6 + 0.0, listen), tilt: lerp(0.05, 0.12, listen) + nod, lx: x < 960 ? -1 : 1,
        pal: RPAL[i], rim: '#ffd0a8', rimA: 0.35, rimDx: x < 960 ? -2 : 2, rimDy: -2, hair0: i % 2 ? '#1c0a05' : '#5a2a12',
        arms: [{ a1: 1.9, a2: 0.2 }, { a1: 1.25, a2: 2.9 }] });
    });
    // the desk front again over their laps, with nameplates and microphones
    gf(ctx, c => { c.moveTo(380, DESK_Y + 30); c.quadraticCurveTo(960, DESK_Y - 10, 1540, DESK_Y + 30); c.lineTo(1580, DESK_Y + 150); c.quadraticCurveTo(960, DESK_Y + 110, 340, DESK_Y + 150); c.closePath(); },
      lin(ctx, 0, DESK_Y, 0, DESK_Y + 150, [[0, '#6a4e86'], [0.15, '#4a3a72'], [1, '#2a2252']]), 0.5);
    ctx.strokeStyle = 'rgba(255,210,170,0.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(380, DESK_Y + 30); ctx.quadraticCurveTo(960, DESK_Y - 10, 1540, DESK_Y + 30); ctx.stroke();
    REPS.forEach(([x]) => { const y = DESK_Y + 32 - Math.abs(x - 960) * 0.05; ctx.fillStyle = '#e6dccc'; ctx.fillRect(x - 34, y, 68, 16); ctx.fillStyle = 'rgba(40,38,90,0.5)'; ctx.fillRect(x - 24, y + 6, 48, 4); });
    // the desk seal
    ctx.save(); ctx.translate(960, DESK_Y + 80); gf(ctx, c => c.arc(0, 0, 34, 0, 7), lin(ctx, 0, -34, 0, 34, [[0, '#ffd28c'], [1, '#a2521f']]), 0.3); ctx.strokeStyle = 'rgba(90,40,14,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 24, 0, 7); ctx.stroke(); ctx.restore();
    dust(ctx, t, 100, 60, 1700, 700, '#ffe0c4', 0.3);
  });
  // the citizen at the microphone, seen from behind, and the audience
  layer(1.0, () => {
    // microphone stand
    ctx.strokeStyle = '#141032'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1090, 1080); ctx.lineTo(1090, 760); ctx.lineTo(1050, 720); ctx.stroke();
    ctx.fillStyle = '#1e1a40'; ctx.beginPath(); ctx.ellipse(1046, 716, 10, 16, -0.7, 0, 7); ctx.fill();
    const b = Math.sin(t * 1.7), talk = t > T_TELL ? 1 : 0, g = Math.sin(t * 3.1) * 0.5 + Math.sin(t * 1.3) * 0.5;
    const gest = ease((t - T_TELL) / 0.4) * (1 - 0.6 * ramp(t, T_LAW + 0.2, T_LAW + 0.7));
    figure(ctx, { x: 960, y: 1010 + b, s: 1.25, facing: 'back', br: b, lean: 0.03, turn: 0.15 + 0.05 * g * talk, tilt: -0.05, lx: 1,
      rim: '#ffd0a8', rimA: 0.45, rimDx: 0, rimDy: -3, pal: ['#ffb35c', '#c9702e', '#5a2a12'], hair0: '#2a1208',
      legs: [{ a1: Math.PI / 2 + 0.08, a2: Math.PI / 2 + 0.05 }, { a1: Math.PI / 2 - 0.08, a2: Math.PI / 2 - 0.05 }],
      arms: [{ a1: Math.PI / 2 + 0.2, a2: Math.PI / 2 + 0.1 }, { a1: lerp(Math.PI / 2 - 0.2, 0.2 + 0.15 * g, gest), a2: lerp(Math.PI / 2 - 0.1, -0.9 + 0.3 * g, gest) }] });
    // audience heads in the first row
    const ra = rng(12);
    for (let i = 0; i < 9; i++) { const x = 60 + i * 225 + ra() * 40; if (Math.abs(x - 960) < 170) continue; const s = 1.4 + ra() * 0.3, bb = Math.sin(t * 1.4 + i);
      figure(ctx, { x, y: 1190 + bb, s, facing: 'back', br: bb, turn: (960 - x) / 1600, tilt: -0.1, lx: 1, rim: '#ffd0a8', rimA: 0.3, rimDx: 0, rimDy: -3, grain: 0.35,
        pal: RPAL[i % 5], hair0: ra() < 0.5 ? '#1c0a05' : '#5a2a12', arms: [{ a1: Math.PI / 2 + 0.2, a2: Math.PI / 2 + 0.1 }, { a1: Math.PI / 2 - 0.2, a2: Math.PI / 2 - 0.1 }] }); }
  });
}

module.exports = { T0, T1, draw };
