// "People still check the work."
// Under the same airliner at night: the engine overhead, the main landing gear with two big wheels.
// Two ground engineers in high-vis vests walk the gear with flashlights; the beams sweep over the tyres and
// strut, one of them ticks a box on a clipboard on "check".
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, clamp } = L;
const { grainFill, roundRect, poly, cap, cached, motes } = require('./s_k2_studio');
const { figure } = require('./s_timeline');

const T0 = 138.8, T1 = 140.95;
const T_CHECK = 139.68;
const GY = 905;                                 // ground line (feet)
const WH = [{ x: 1000, y: 750, r: 155 }, { x: 1250, y: 750, r: 155 }];

function wheelArt(c, w, far) {
  grainFill(c, k => k.arc(w.x, w.y, w.r, 0, Math.PI * 2), rad(c, w.x - 40, w.y - 50, 20, w.r, [[0, far ? '#1c1a3a' : '#2a2850'], [1, '#08081a']]), 0.55);
  c.strokeStyle = 'rgba(80,76,140,0.35)'; c.lineWidth = 3; for (const rr of [w.r - 14, w.r - 30]) { c.beginPath(); c.arc(w.x, w.y, rr, 0, Math.PI * 2); c.stroke(); }
  grainFill(c, k => k.arc(w.x, w.y, w.r * 0.52, 0, Math.PI * 2), lin(c, w.x - 60, w.y - 60, w.x + 60, w.y + 60, [[0, '#6a6aa0'], [1, '#22204a']]), 0.45);
  c.fillStyle = '#0c0c22'; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; c.beginPath(); c.arc(w.x + Math.cos(a) * w.r * 0.36, w.y + Math.sin(a) * w.r * 0.36, 7, 0, Math.PI * 2); c.fill(); }
  grainFill(c, k => k.arc(w.x, w.y, w.r * 0.16, 0, Math.PI * 2), '#3a3870', 0.3);
}
function sceneArt(c) {
  // night apron, far lights
  grainFill(c, k => k.rect(-200, -200, W + 400, GY + 200), lin(c, 0, -200, 0, GY, [[0, '#05061a'], [0.7, '#141238'], [1, '#221c48']]), 0.5);
  const r = rng(55); for (let i = 0; i < 26; i++) { const x = r() * W, y = 610 + r() * 40; c.fillStyle = rgba(r() < 0.6 ? C.amber : C.cyan, 0.5); c.fillRect(x, y, 3, 3); }
  grainFill(c, k => k.rect(-200, GY - 10, W + 400, 500), lin(c, 0, GY - 10, 0, H + 100, [[0, '#2a2452'], [0.3, '#181638'], [1, '#08081c']]), 0.55);
  c.fillStyle = 'rgba(255,210,150,0.35)'; for (let x = -100; x < W + 200; x += 260) c.fillRect(x, GY + 60, 140, 5);
  // belly of the airliner across the top
  grainFill(c, k => { k.moveTo(-200, -200); k.lineTo(W + 200, -200); k.lineTo(W + 200, 150); k.bezierCurveTo(1300, 230, 600, 240, -200, 200); k.closePath(); }, lin(c, 0, 0, 0, 240, [[0, '#0c0c26'], [1, '#2a2860']]), 0.55);
  c.strokeStyle = 'rgba(160,160,230,0.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-200, 196); c.bezierCurveTo(600, 236, 1300, 226, W + 200, 146); c.stroke();
  // engine on its pylon, upper left
  grainFill(c, poly([[420, 180], [700, 180], [640, 290], [470, 290]]), '#16143a', 0.5);
  grainFill(c, k => roundRect(k, 40, 250, 720, 250, 120), lin(c, 0, 250, 0, 500, [[0, '#4a4888'], [0.5, '#262458'], [1, '#0c0c26']]), 0.5);
  grainFill(c, k => k.ellipse(60, 375, 60, 122, 0, 0, Math.PI * 2), '#07071a', 0.3);
  c.fillStyle = 'rgba(255,179,92,0.25)'; c.fillRect(120, 254, 600, 3);
  // main gear: strut, torque link, axle beam
  grainFill(c, k => k.rect(1108, 180, 34, 540), lin(c, 1108, 0, 1142, 0, [[0, '#4a4a88'], [1, '#14143a']]), 0.4);
  grainFill(c, k => k.rect(1100, 200, 50, 200), '#1e1c48', 0.4);
  c.strokeStyle = '#0c0c22'; c.lineWidth = 12; c.beginPath(); c.moveTo(1110, 420); c.lineTo(1070, 520); c.lineTo(1112, 620); c.stroke();
  c.fillStyle = 'rgba(216,247,255,0.35)'; c.fillRect(1110, 190, 3, 520);
  wheelArt(c, WH[1], true);
  wheelArt(c, WH[0], false);
}

// a flashlight beam from a hand to a target, with a soft hot spot where it lands
function beam(ctx, hx, hy, tx, ty, wid, a) {
  const ang = Math.atan2(ty - hy, tx - hx), d = Math.hypot(tx - hx, ty - hy), nx = -Math.sin(ang), ny = Math.cos(ang);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, hx, hy, tx, ty, [[0, `rgba(255,236,200,${0.45 * a})`], [1, `rgba(255,220,170,${0.08 * a})`]]);
  ctx.beginPath(); ctx.moveTo(hx + nx * 5, hy + ny * 5); ctx.lineTo(tx + nx * wid, ty + ny * wid); ctx.lineTo(tx - nx * wid, ty - ny * wid); ctx.lineTo(hx - nx * 5, hy - ny * 5); ctx.closePath(); ctx.fill();
  ctx.restore();
  light(ctx, tx, ty, wid * 1.8, '#ffe2b8', 0.55 * a); light(ctx, hx, hy, 26, '#fff4e0', 0.9 * a);
}
function vest(ctx, x, y, s, lean, back) {
  // an amber high-vis vest over dark coveralls, with reflective bands
  const len = 118 * s, sw = 46 * s, hw = 31 * s;
  ctx.save(); ctx.translate(x, y); ctx.rotate(lean);
  grainFill(ctx, c => { c.moveTo(-sw * 0.9, -len * 0.9); c.lineTo(-sw * 0.42, -len * 1.0);
    if (back) c.lineTo(sw * 0.42, -len * 1.0); else { c.lineTo(0, -len * 0.7); c.lineTo(sw * 0.42, -len * 1.0); }
    c.lineTo(sw * 0.9, -len * 0.9); c.bezierCurveTo(sw * 1.0, -len * 0.6, hw * 1.1, -len * 0.4, hw * 1.08, -len * 0.12); c.lineTo(-hw * 1.08, -len * 0.12);
    c.bezierCurveTo(-hw * 1.1, -len * 0.4, -sw * 1.0, -len * 0.6, -sw * 0.9, -len * 0.9); c.closePath(); },
    lin(ctx, -sw, -len, sw, 0, [[0, '#ffc77a'], [0.5, '#f0a050'], [1, '#a2521f']]), 0.4);
  ctx.fillStyle = 'rgba(255,246,222,0.9)';
  for (const yy of [0.5, 0.33]) ctx.fillRect(-hw * 1.12, -len * yy, hw * 2.24, 5 * s);
  if (back) { ctx.fillRect(-sw * 0.36, -len * 0.98, 5 * s, len * 0.48); ctx.fillRect(sw * 0.36 - 5 * s, -len * 0.98, 5 * s, len * 0.48); }
  else { ctx.fillRect(-sw * 0.5, -len * 0.92, 5 * s, len * 0.42); ctx.fillRect(sw * 0.5 - 5 * s, -len * 0.92, 5 * s, len * 0.42); }
  ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.04, 1.0, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 15) * 6 - 20 * sm((t - T0) / (T1 - T0)), dy = drift(t, 1, 16) * 4;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H / 2 + dy);
  cached(ctx, 'k2crew', -200, -200, W + 200, H + 100, sceneArt, 1);
  // wheels turn a hair as the aircraft settles on its gear
  light(ctx, 1120, 760, 600, C.cyanD, 0.1);

  // engineer 1 (left, seen from behind): sweeps the beam along the wheel and up the strut
  const b1 = Math.sin(t * 1.6), sweep = Math.sin((t - T0) * 1.3);
  const tg1 = [lerp(940, 1120, 0.5 + 0.5 * sweep), lerp(700, 500, 0.5 + 0.5 * sweep)];
  const e1 = figure(ctx, { x: 640, y: GY - 150 * 1.5 + b1 * 1.5, s: 1.5, pal: ['#5a5a9a', '#2e2c66', '#121232'], facing: 'back', br: b1, lean: -0.03, turn: 0.55, tilt: -0.15, lx: 1,
    rim: C.amber, rimA: 0.4, legs: [{ tx: 615, ty: GY, bend: -1 }, { tx: 668, ty: GY, bend: -1 }],
    arms: [{ a1: 1.95, a2: 1.45, behind: true }, { tx: 640 + 150, ty: GY - 150 * 1.5 - 150 + 10 * sweep, bend: 1 }], noArms: true });
  vest(ctx, 640, GY - 150 * 1.5 + b1 * 1.5, 1.5, -0.03, true);
  figure(ctx, { x: 640, y: GY - 150 * 1.5 + b1 * 1.5, s: 1.5, pal: ['#5a5a9a', '#2e2c66', '#121232'], facing: 'back', br: b1, lean: -0.03, lx: 1, only: 'arms',
    arms: [{ a1: 1.95, a2: 1.45, behind: true }, { tx: 640 + 150, ty: GY - 150 * 1.5 - 150 + 10 * sweep, bend: 1 }] });
  
  const h1 = e1.hands[1];
  ctx.strokeStyle = '#1a1838'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(h1[0] - 8, h1[1] + 4); ctx.lineTo(h1[0] + 22, h1[1] - 6); ctx.stroke();
  beam(ctx, h1[0] + 24, h1[1] - 7, tg1[0], tg1[1], 70, 1);

  // engineer 2 (right, facing us): clipboard in one hand, torch in the other, ticks on "check"
  const b2 = Math.sin(t * 1.5 + 1), tick = ramp(t, T_CHECK - 0.1, T_CHECK + 0.15) * (1 - ramp(t, T_CHECK + 0.35, T_CHECK + 0.7));
  const x2 = 1560, y2 = GY - 150 * 1.45 + b2 * 1.5;
  const tg2 = [lerp(1300, 1200, 0.5 + 0.5 * Math.sin((t - T0) * 1.1 + 1)), 720];
  const e2 = figure(ctx, { x: x2, y: y2, s: 1.45, pal: ['#5a5a9a', '#2e2c66', '#121232'], facing: 'front', br: b2, lean: 0.02, turn: -0.6 + 0.3 * tick, tilt: 0.2 + 0.1 * tick, lx: -1,
    legs: [{ tx: x2 - 30, ty: GY, bend: 1 }, { tx: x2 + 26, ty: GY, bend: 1 }],
    arms: [{ tx: x2 - 150, ty: y2 - 130, bend: 1 }, { tx: x2 + 28 - 14 * tick, ty: y2 - 62 + 6 * tick, bend: -1 }], noArms: true });
  vest(ctx, x2, y2, 1.45, 0.02, false);
  
  // clipboard held at the chest and the tick mark
  ctx.save(); ctx.translate(x2 + 18, y2 - 70); ctx.rotate(-0.15);
  grainFill(ctx, c => roundRect(c, -34, -46, 68, 92, 5), '#5a3a22', 0.4); grainFill(ctx, c => c.rect(-28, -38, 56, 78), '#efe6cf', 0.25);
  ctx.fillStyle = 'rgba(40,30,50,0.55)'; for (let j = 0; j < 4; j++) ctx.fillRect(-6, -28 + j * 18, 28, 3);
  ctx.strokeStyle = 'rgba(40,30,50,0.6)'; ctx.lineWidth = 2; for (let j = 0; j < 4; j++) ctx.strokeRect(-22, -32 + j * 18, 10, 10);
  const tk = ramp(t, T_CHECK, T_CHECK + 0.3); ctx.strokeStyle = '#0a6f8c'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  for (let j = 0; j < 3; j++) { const tj = j < 2 ? 1 : tk; if (tj <= 0) continue; ctx.beginPath(); ctx.moveTo(-21, -27 + j * 18); ctx.lineTo(-17, -23 + j * 18); if (tj > 0.4) ctx.lineTo(-17 + 10 * (tj - 0.4) / 0.6, -33 + j * 18 + 10 * (1 - (tj - 0.4) / 0.6) * 0); ctx.stroke(); }
  ctx.restore();
  figure(ctx, { x: x2, y: y2, s: 1.45, pal: ['#5a5a9a', '#2e2c66', '#121232'], facing: 'front', br: b2, lean: 0.02, lx: -1, only: 'arms',
    arms: [{ tx: x2 - 150, ty: y2 - 130, bend: 1 }, { tx: x2 + 28 - 14 * tick, ty: y2 - 62 + 6 * tick, bend: -1 }] });
  const h2 = e2.hands[0];
  ctx.strokeStyle = '#1a1838'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(h2[0] + 6, h2[1] + 2); ctx.lineTo(h2[0] - 18, h2[1] - 6); ctx.stroke();
  beam(ctx, h2[0] - 20, h2[1] - 7, tg2[0], tg2[1], 60, 0.9);
  motes(ctx, t, MOTES, 300, 200, 1400, 700, '#ffe2b8', 0.25);
  ctx.restore();
}
const MOTES = (() => { const r = rng(1313); return Array.from({ length: 30 }, () => [r(), r(), r()]); })();

module.exports = { T0, T1, draw, WH, wheelArt };
