// "So put yourself there. You run the lab. Your rivals are months behind you."
// Point of view: a big empty chair at a desk high above the city at night. The camera glides over the chair
// into the seat and two warm hands (yours) settle on the desk. Below, the lab building lights up floor by floor
// and its cyan ring ignites (you run the lab). Then, one by one, other labs on the horizon light their own,
// smaller rings, close behind.
// Exports scene() so s_k5_odd.js can reuse the same office.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, out, ease } = L;
const { grainFill, roundRect, cap, curve, glowStroke, cached, handArt } = require('./s_k5_race');

const T0 = 275.1, T1 = 281.5;

const HZ = 470;                                         // horizon
const LAB = { x: 960, y0: 392, y1: 640, w: 560 };       // your lab building
const RING = { x: 960, y: 290, rx: 170, ry: 46 };
const RIVALS = [[300, 318, 62, 279.55], [1650, 300, 70, 279.95], [590, 346, 52, 280.35], [1370, 336, 56, 280.75]];
const R = rng(275);
const CITY = []; { let x = -300; while (x < W + 300) { const w = 50 + R() * 110, h = 50 + R() * 170; if (Math.abs(x + w / 2 - LAB.x) > LAB.w / 2 + 30 || h < 90) CITY.push([x, w, h, R()]); x += w + 6 + R() * 20; } }
const CARS = Array.from({ length: 26 }, () => ({ lane: Math.floor(R() * 3), x: R(), sp: 0.02 + R() * 0.04, dir: R() < 0.5 ? 1 : -1, col: R() < 0.5 ? '#ffd29a' : '#ff9a6a' }));
const STARS = Array.from({ length: 90 }, () => [R() * W, R() * 300, R()]);

function cityArt(c) {
  c.fillStyle = lin(c, 0, 0, 0, 700, [[0, '#06071a'], [0.55, '#141640'], [0.68, '#2a2456'], [1, '#141236']]); c.fillRect(-100, -100, W + 200, 860);
  // far skyline on the horizon
  const r = rng(9); let x = -100;
  while (x < W + 100) { const w = 30 + r() * 70, h = 10 + r() * 60; c.fillStyle = '#16163c'; c.fillRect(x, HZ - h, w, h + 4); x += w + 2; }
  grainFill(c, cc => cc.rect(-100, HZ, W + 200, 400), lin(c, 0, HZ, 0, 760, [[0, '#1a1840'], [1, '#0c0b24']]), 0.5);
  // city blocks below, around the lab
  for (const [bx, w, h, k] of CITY) {
    const by = 540 + k * 120, top = by - h;
    grainFill(c, cc => cc.rect(bx, top, w, h + 200), lin(c, bx, 0, bx + w, 0, [[0, k < 0.5 ? '#1b1a44' : '#15143a'], [1, '#0d0c26']]), 0.5);
    c.fillStyle = 'rgba(80,90,170,0.25)'; c.fillRect(bx, top, w, 2);
    for (let wy = top + 10; wy < by + 80; wy += 14) for (let wx = bx + 6; wx < bx + w - 6; wx += 11) { const q = r(); if (q < 0.10) { c.fillStyle = rgba(q < 0.06 ? '#ffb35c' : C.cyan, 0.25 + r() * 0.4); c.fillRect(wx, wy, 4, 6); } }
  }
}

function labArt(c, lit) {
  const { x, y0, y1, w } = LAB, x0 = x - w / 2;
  grainFill(c, cc => cc.rect(x0, y0, w, y1 - y0 + 100), lin(c, x0, 0, x0 + w, 0, [[0, '#141a44'], [1, '#0b0e2a']]), 0.5);
  if (lit) {
    for (let f = 0; f < 9; f++) { const fy = y0 + 12 + f * 26;
      c.fillStyle = lin(c, x0, 0, x0 + w, 0, [[0, '#3aa8c8'], [0.5, '#8fe6ff'], [1, '#2a88a8']]); c.fillRect(x0 + 8, fy, w - 16, 18);
      const rr = rng(40 + f); for (let k = 0; k < 7; k++) { const px = x0 + 20 + rr() * (w - 40); c.fillStyle = 'rgba(6,30,50,0.75)'; if (rr() < 0.5) { c.fillRect(px - 2, fy + 8, 5, 10); c.beginPath(); c.arc(px + 0.5, fy + 5, 2.6, 0, 7); c.fill(); } else c.fillRect(px - 8, fy + 11, 16, 7); }
      c.fillStyle = 'rgba(5,10,30,0.55)'; for (let m = 0; m <= 8; m++) c.fillRect(x0 + 8 + m * (w - 16) / 8, fy, 2, 18); c.fillStyle = 'rgba(216,247,255,0.5)'; c.fillRect(x0 + 8, fy, w - 16, 2); }
  } else {
    for (let f = 0; f < 9; f++) { c.fillStyle = 'rgba(40,50,100,0.35)'; c.fillRect(x0 + 8, y0 + 12 + f * 26, w - 16, 18); }
  }
  // roof and the ring's mast
  c.fillStyle = '#090b22'; c.fillRect(x0 - 10, y0 - 12, w + 20, 14); c.fillRect(x - 4, RING.y + 30, 8, y0 - RING.y - 30);
}

// a ring of light: the AI. o.k (0..1) brightness. Optional fold (0..1) used by s_k5_odd.
function ring(ctx, t, x, y, rx, ry, k, fold = 0, twist = 0) {
  if (k <= 0) return;
  const p = 0.5 + 0.5 * Math.sin(t * 3.1);
  light(ctx, x, y, rx * 2.2, C.cyan, (0.16 + 0.08 * p) * k);
  const pt = a => { const f = fold, X = Math.cos(a), Y = Math.sin(a);
    // folding: the ring pinches through itself into a figure eight, then the crossing rolls (twist)
    const yy = lerp(Y, Math.sin(2 * a + twist) * 1.6, f), xx = lerp(X, Math.cos(a) * (1 - 0.15 * f * Math.cos(2 * a + twist)), f);
    return [x + xx * rx, y + yy * ry]; };
  const path = c => { for (let i = 0; i <= 120; i++) { const q = pt(i / 120 * Math.PI * 2); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); } };
  glowStroke(ctx, path, C.cyan, 5 + 1.5 * p, 0.8 * k);
  glowStroke(ctx, path, C.cyanW, 1.6, 0.7 * k);
  for (let i = 0; i < 9; i++) { const q = pt(t * (0.8 + i * 0.05) + i * 0.7); light(ctx, q[0], q[1], 8, C.cyanW, 0.7 * k * (0.5 + 0.5 * Math.sin(t * 7 + i))); }
}

function chairBack(ctx, t, slide) {
  if (slide >= 1) return;
  const s = 1 + 0.9 * slide, y = 1080 - 560 * (1 - slide) * (1 - 0.1 * slide) + 300 * slide;
  ctx.save(); ctx.translate(960, y); ctx.scale(s, s);
  const back = c => { c.moveTo(-200, 640); c.bezierCurveTo(-232, 420, -262, 200, -250, 70); c.bezierCurveTo(-244, 0, -200, -30, -120, -36); c.lineTo(120, -36);
    c.bezierCurveTo(200, -30, 244, 0, 250, 70); c.bezierCurveTo(262, 200, 232, 420, 200, 640); c.closePath(); };
  // armrests either side
  for (const sx of [-1, 1]) grainFill(ctx, c => roundRect(c, sx > 0 ? 210 : -330, 330, 120, 46, 20), lin(ctx, 0, 330, 0, 376, [[0, '#2a2458'], [1, '#0a0a1e']]), 0.5);
  ctx.save(); ctx.translate(0, -5); grainFill(ctx, back, rgba(C.cyan, 0.5), 0); ctx.restore();
  grainFill(ctx, back, lin(ctx, -250, 0, 250, 500, [[0, '#2c245e'], [0.55, '#151232'], [1, '#07071a']]), 0.6);
  // headrest and tufted leather panels
  grainFill(ctx, c => roundRect(c, -150, -6, 300, 110, 46), lin(ctx, 0, -6, 0, 104, [[0, '#2e2862'], [1, '#141232']]), 0.5);
  ctx.strokeStyle = 'rgba(4,4,16,0.55)'; ctx.lineWidth = 4;
  for (let k = 0; k < 4; k++) { const yy = 150 + k * 100; ctx.beginPath(); ctx.moveTo(-215 + k * 6, yy); ctx.quadraticCurveTo(0, yy + 14, 215 - k * 6, yy); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0, 120); ctx.lineTo(0, 640); ctx.stroke();
  ctx.restore();
}

function desk(ctx, t, opt) {
  // desk top, glossy, reflecting the window
  grainFill(ctx, c => { c.moveTo(-200, 690); c.lineTo(W + 200, 690); c.lineTo(W + 200, H + 300); c.lineTo(-200, H + 300); c.closePath(); },
    lin(ctx, 0, 690, 0, H, [[0, '#2a2458'], [0.12, '#1a1640'], [1, '#08081a']]), 0.55);
  ctx.fillStyle = 'rgba(143,230,255,0.10)'; ctx.fillRect(-200, 690, W + 400, 3);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(LAB.x, 760); ctx.scale(3, 0.35); ctx.fillStyle = rad(ctx, 0, 0, 0, 200, [[0, rgba(C.cyan, 0.10 * opt.labOn)], [1, rgba(C.cyan, 0)]]); ctx.fillRect(-200, -200, 400, 400); ctx.restore();
  // a tablet with a graph, left
  ctx.save(); ctx.translate(330, 800); ctx.transform(1, 0, -0.28, 0.62, 0, 0);
  grainFill(ctx, c => roundRect(c, -150, -110, 300, 210, 12), '#0b0c22', 0.4);
  grainFill(ctx, c => roundRect(c, -138, -98, 276, 186, 6), lin(ctx, -138, -98, 138, 88, [[0, '#0e5878'], [1, '#08344e']]), 0.25);
  ctx.strokeStyle = rgba(C.cyanW, 0.8); ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i <= 30; i++) { const xx = -120 + i * 8, yy = 60 - Math.pow(i / 30, 3) * 130 + Math.sin(i * 1.3 + t * 2) * 3; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
  ctx.restore();
  light(ctx, 300, 790, 200, C.cyan, 0.10);
  // the guarded switch, right: a hint of what comes
  ctx.save(); ctx.translate(1590, 790); ctx.transform(1, 0, 0.2, 0.62, 0, 0);
  grainFill(ctx, c => roundRect(c, -90, -70, 180, 140, 14), lin(ctx, 0, -70, 0, 70, [[0, '#2a2552'], [1, '#100e28']]), 0.5);
  grainFill(ctx, c => c.ellipse(0, 0, 44, 44, 0, 0, 7), lin(ctx, -40, -40, 40, 40, [[0, '#ffc488'], [1, '#a2521f']]), 0.4);
  ctx.restore();
  light(ctx, 1590, 790, 90, C.amber, 0.14);
}

function hands(ctx, t, enter, br) {
  if (enter <= 0) return;
  const dy = (1 - enter) * 520;
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(960 + side * 300 + side * 4 * Math.sin(t * 0.7), 900 + dy + br * 3);
    ctx.scale(side * 0.9, 0.5); ctx.rotate(-Math.PI / 2 - 0.38);
    ctx.scale(1.05, 1.05);
    ctx.save(); ctx.translate(18, 30); ctx.globalAlpha = 0.3; ctx.filter = 'brightness(0)'; cached(ctx, 'k5_hand', -770, -160, 200, 200, handArt, 1); ctx.restore();
    cached(ctx, 'k5_hand', -770, -160, 200, 200, handArt, 1);
    ctx.restore();
  }
}

// the whole office; o: { slide, enter, labOn, rivals[], ringK, fold, twist, z, fx, fy, after(ctx) }
function scene(ctx, t, o) {
  const dx = drift(t, 1, 21) * 6, dy = drift(t, 1, 22) * 4;
  const layer = (par, fn) => { const zz = 1 + (o.z - 1) * (0.55 + par * 0.45); ctx.save(); ctx.translate(o.fx, o.fy); ctx.scale(zz, zz); ctx.translate(-o.fx + dx * par, -o.fy + dy * par); fn(); ctx.restore(); };
  layer(0.3, () => {
    cached(ctx, 'k5_city', -100, -100, W + 100, 760, cityArt, 1.4);
    for (const [x, y, k] of STARS) { const a = 0.2 + 0.25 * Math.sin(t * (1 + k) + k * 20); if (a > 0) { ctx.fillStyle = rgba(C.cream, a); ctx.fillRect(x, y, 2, 2); } }
    // rival labs on the horizon, each lighting its own smaller ring
    for (const [x, top, w, t0] of o.rivals) {
      const on = ramp(t, t0, t0 + 0.35);
      grainFill(ctx, c => c.rect(x - w / 2, top, w, HZ - top + 30), lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, '#1e2250'], [1, '#12143a']]), 0.5);
      for (let f = 0; f < 8; f++) { ctx.fillStyle = rgba(C.cyan, 0.08 + 0.55 * on * (0.85 + 0.15 * Math.sin(t * 3 + f + x))); ctx.fillRect(x - w / 2 + 5, top + 8 + f * ((HZ - top) / 8), w - 10, (HZ - top) / 8 - 6); }
      ctx.fillStyle = '#0a0b22'; ctx.fillRect(x - 2, top - 34, 4, 34);
      ring(ctx, t + x, x, top - 44, w * 0.55, w * 0.16, 0.85 * on);
      if (on > 0 && on < 1) light(ctx, x, top - 44, 160, C.cyanW, 0.5 * Math.sin(on * Math.PI));
    }
    // your lab
    cached(ctx, 'k5_lab0', LAB.x - LAB.w / 2 - 20, RING.y + 20, LAB.x + LAB.w / 2 + 20, 760, c => labArt(c, false), 1.4);
    if (o.labOn > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, LAB.y1 + 10 - (LAB.y1 - LAB.y0 + 20) * o.labOn, W, 2000); ctx.clip();
      cached(ctx, 'k5_lab1', LAB.x - LAB.w / 2 - 20, RING.y + 20, LAB.x + LAB.w / 2 + 20, 760, c => labArt(c, true), 1.4); ctx.restore();
      light(ctx, LAB.x, (LAB.y0 + LAB.y1) / 2, 520, C.cyan, 0.16 * o.labOn); }
    // traffic on the streets below
    for (const cr of CARS) { const y = 668 + cr.lane * 16, x = ((cr.x + t * cr.sp * cr.dir) % 1 + 1) % 1 * (W + 200) - 100;
      ctx.fillStyle = rgba(cr.col, 0.8); ctx.fillRect(x, y, 5, 2.5); light(ctx, x, y, 12, cr.col, 0.3); }
    ring(ctx, t, RING.x, RING.y, RING.rx, RING.ry, o.ringK, o.fold || 0, o.twist || 0);
    if (o.after) o.after(ctx);
  });
  // the window: mullions and reflections
  layer(0.55, () => {
    ctx.fillStyle = '#05061a';
    for (const x of [-20, 440, 1480, 1940]) ctx.fillRect(x - 14, -200, 28, 900);
    ctx.fillRect(-200, 60, W + 400, 16);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, 0, W, 700, [[0, 'rgba(160,170,255,0.05)'], [0.3, 'rgba(160,170,255,0)'], [0.55, 'rgba(160,170,255,0.035)'], [0.6, 'rgba(160,170,255,0)']]); ctx.fillRect(-200, -200, W + 400, 900);
    ctx.restore();
    // the frame's sill
    grainFill(ctx, c => c.rect(-200, 650, W + 400, 44), lin(ctx, 0, 650, 0, 694, [[0, '#14123a'], [1, '#07071a']]), 0.5);
  });
  layer(1.0, () => { desk(ctx, t, o); hands(ctx, t, o.enter, Math.sin(t * 1.6)); });
  layer(1.4, () => chairBack(ctx, t, o.slide));
}

function draw(ctx, t) {
  const slide = ease((t - 275.75) / 1.25), enter = out((t - 276.45) / 0.85);
  const labOn = ease((t - 278.0) / 0.7);
  scene(ctx, t, { slide, enter, labOn, rivals: RIVALS, ringK: 0.1 + 0.9 * ramp(t, 278.35, 278.7), z: lerp(1.0, 1.1, sm((t - T0) / (T1 - T0))), fx: 960, fy: 380 });
}

module.exports = { T0, T1, draw, scene, RIVALS, RING, LAB };
