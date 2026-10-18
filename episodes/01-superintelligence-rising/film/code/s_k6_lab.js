// "In one experiment, two human researchers spent a week on a safety problem and closed about a quarter of the gap.
//  Nine AI agents closed almost all of it. They also tried to cheat, by the way, so humans still checked the results."
// A late-night office: on the whiteboard a long progress track (start dot, goal flag) and a row of seven days.
// Two researchers work; the days get crossed off, the window flicks day-night, the amber fill reaches a quarter.
// Nine small cyan helper lights fly in and push the fill almost to the flag. One sneaks to the end and stretches
// the fill to the flag; a researcher raises a magnifier, the fake part is exposed and snaps back.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, ease } = L;
const { grainFill, poly } = require('./s_k6_key');
const { coated } = require('./s_k6_box');
const { ik } = require('./s_timeline');
// arm angles: hanging at rest, blended into an IK reach toward (tx, ty)
function reach(x, y, s, side, tx, ty, k, bend, rest = [1.62, 1.58]) {
  const sx = x + side * 46 * s * 0.78, sy = y - 118 * s * 0.88;
  const [a1, a2] = ik(sx, sy, tx, ty, 60 * s, 56 * s, bend);
  return { a1: lerp(rest[0], a1, k), a2: lerp(rest[1], a2, k) };
}

const T0 = 383.6, T1 = 399.2;

function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------------------------------------------------------- the progress track
const BAR = { x: 420, y: 404, w: 1080, h: 34 };
const HUMAN = 0.25, AGENT = 0.93;
const DAYS = Array.from({ length: 7 }, (_, i) => 386.95 + i * 0.29);
function fillAt(t) {
  const h = HUMAN * ease((t - 389.0) / 1.4);
  const a = (AGENT - HUMAN) * ease((t - 392.95) / 1.25);
  return h + a;
}
// fake stretch by the cheating agent, and its exposure
function fakeAt(t) { return (1 - AGENT) * ease((t - 395.7) / 0.6) * (1 - ease((t - 398.15) / 0.45)); }

function track(ctx, t, x, y, w, h, fill, fake, exposed, opt = {}) {
  // groove
  ctx.fillStyle = 'rgba(4,4,16,0.35)'; ctx.beginPath(); rr(ctx, x + 3, y + 5, w, h, h / 2); ctx.fill();
  grainFill(ctx, c => rr(c, x, y, w, h, h / 2), lin(ctx, 0, y, 0, y + h, [[0, '#14143a'], [1, '#232156']]), 0.45, [x - 10, y - 10, w + 20, h + 20]);
  // quarter ticks
  for (const u of [0.25, 0.5, 0.75]) { ctx.fillStyle = rgba(C.lav, 0.4); ctx.fillRect(x + w * u - 1, y + h + 6, 2, 10); }
  const H0 = opt.agentOnly ? 0 : HUMAN, hum = Math.min(fill, H0);
  ctx.save(); ctx.beginPath(); rr(ctx, x, y, w, h, h / 2); ctx.clip();
  if (hum > 0) grainFill(ctx, c => c.rect(x, y, w * hum, h), lin(ctx, x, 0, x + w * HUMAN, 0, [[0, '#c9702e'], [1, C.amber]]), 0.3, [x, y, w * hum + 2, h]);
  if (fill > H0) grainFill(ctx, c => c.rect(x + w * H0, y, w * (fill - H0), h), lin(ctx, x + w * H0, 0, x + w * Math.max(fill, 0.05), 0, [[0, C.cyanD], [1, C.cyan]]), 0.3, [x + w * H0, y, w * (fill - H0) + 2, h]);
  if (fake > 0.002) {
    const fx = x + w * fill, fw = w * fake;
    // the stretched part: same colour at first glance; once exposed it turns hollow and hatched
    ctx.fillStyle = rgba(C.cyan, 0.85 * (1 - exposed)); ctx.fillRect(fx, y, fw, h);
    ctx.save(); ctx.beginPath(); ctx.rect(fx, y, fw, h); ctx.clip();
    ctx.strokeStyle = rgba(C.amber, 0.9 * exposed); ctx.lineWidth = 3;
    for (let k = -4; k < fw / 12 + 4; k++) { ctx.beginPath(); ctx.moveTo(fx + k * 12, y + h); ctx.lineTo(fx + k * 12 + h, y); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = rgba(C.amber, exposed); ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.strokeRect(fx + 1.5, y + 1.5, fw - 3, h - 3); ctx.setLineDash([]);
  }
  // sheen
  ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fillRect(x, y + 4, w, 4);
  ctx.restore();
  // leading edge glow
  const ex = x + w * (fill + fake);
  if (fill > 0.005) light(ctx, ex, y + h / 2, 90, fill > H0 + 0.01 ? C.cyan : C.amber, 0.45);
  // start dot and goal flag
  grainFill(ctx, c => c.arc(x - 26, y + h / 2, 11, 0, Math.PI * 2), C.amber, 0);
  const fx2 = x + w + 26, fy = y + h + 2, wave = Math.sin(t * 3);
  ctx.strokeStyle = opt.ink || '#2a2650'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(fx2, fy); ctx.lineTo(fx2, fy - 86); ctx.stroke();
  grainFill(ctx, c => { c.moveTo(fx2, fy - 86); c.quadraticCurveTo(fx2 + 28, fy - 82 + wave * 4, fx2 + 54, fy - 74 + wave * 3); c.quadraticCurveTo(fx2 + 28, fy - 62 - wave * 3, fx2, fy - 56); c.closePath(); }, lin(ctx, fx2, 0, fx2 + 54, 0, [[0, '#ffc27c'], [1, '#d27a34']]), 0.3, [fx2 - 4, fy - 100, 70, 60]);
  return ex;
}

// ---------------------------------------------------------------- room
const R = rng(384);
const SCRIB = Array.from({ length: 16 }, () => [R(), R(), R()]);
function room(ctx, t, day) {
  // wall
  grainFill(ctx, c => c.rect(-200, -200, W + 400, 1000), lin(ctx, 0, 0, 0, 800, [[0, '#0d1030'], [0.6, '#1b1a46'], [1, '#262252']]), 0.6, [-200, -200, W + 400, 1000]);
  // window, upper left: day and night flick past during "a week"
  ctx.save(); ctx.translate(70, 150);
  ctx.fillStyle = '#05060f'; ctx.fillRect(-12, -12, 214, 344);
  const sky = day > 0 ? lin(ctx, 0, 0, 0, 320, [[0, rgba('#8fb8ff', day)], [1, rgba('#ffd9a0', day)]]) : null;
  grainFill(ctx, c => c.rect(0, 0, 190, 320), lin(ctx, 0, 0, 0, 320, [[0, '#121a46'], [1, '#2c3a7a']]), 0.5, [0, 0, 190, 320]);
  if (day > 0) { ctx.fillStyle = sky; ctx.fillRect(0, 0, 190, 320); }
  const rk = rng(5); let bx = 0;
  while (bx < 190) { const bw = 18 + rk() * 34, bh = 70 + rk() * 160; ctx.fillStyle = day > 0.5 ? '#3a3c6a' : '#0b0f2c'; ctx.fillRect(bx, 320 - bh, bw, bh);
    for (let k = 0; k < 5; k++) if (rk() < 0.5) { ctx.fillStyle = rgba(rk() < 0.6 ? C.amber : C.cyan, (0.4 + 0.2 * Math.sin(t + k)) * (1 - day)); ctx.fillRect(bx + 4 + rk() * (bw - 8), 320 - bh + 10 + rk() * (bh - 20), 3, 4); }
    bx += bw + 3; }
  ctx.fillStyle = '#05060f'; ctx.fillRect(92, 0, 6, 320); ctx.fillRect(0, 156, 190, 6);
  ctx.restore();
  if (day > 0) light(ctx, 165, 310, 500, '#ffd9a0', 0.25 * day);
  // whiteboard
  grainFill(ctx, c => rr(c, 300, 160, 1380, 500, 6), '#0a0a1c', 0, null);
  grainFill(ctx, c => rr(c, 312, 172, 1356, 476, 4), lin(ctx, 312, 172, 1500, 648, [[0, '#a7a3c2'], [0.5, '#8d88ad'], [1, '#6c6790']]), 0.35, [300, 160, 1400, 520]);
  ctx.fillStyle = '#14122e'; ctx.fillRect(330, 648, 1320, 12);
  // old scribbles on the board
  ctx.strokeStyle = 'rgba(42,38,80,0.35)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (const [u, v, k] of SCRIB) { const x = 360 + u * 1240, y = 500 + v * 120; if (Math.abs(x - 960) < 80) continue; ctx.beginPath(); ctx.moveTo(x, y); for (let j = 1; j < 8; j++) ctx.lineTo(x + j * (8 + k * 8), y + Math.sin(j * 1.7 + u * 9) * 5); ctx.stroke(); }
  // a ceiling lamp above: the warm hero light falls on the board
  cone(ctx, 960, -20, 160, 1500, 760, '#ffd9a0', 0.07);
  light(ctx, 960, 300, 760, C.amber, 0.12);
  // floor
  grainFill(ctx, c => c.rect(-200, 800, W + 400, 500), lin(ctx, 0, 800, 0, H, [[0, '#1d1a48'], [1, '#09081e']]), 0.6, [-200, 800, W + 400, 500]);
}

function calendar(ctx, t) {
  const x0 = 420, y0 = 220, bw = 92, gap = 14;
  for (let i = 0; i < 7; i++) {
    const x = x0 + i * (bw + gap);
    ctx.strokeStyle = 'rgba(42,38,80,0.75)'; ctx.lineWidth = 3; ctx.strokeRect(x, y0, bw, 76);
    ctx.fillStyle = 'rgba(42,38,80,0.5)'; ctx.fillRect(x, y0, bw, 14);
    // the cross drawn in two strokes
    const k = (t - DAYS[i]) / 0.22; if (k <= 0) continue;
    const s1 = clamp(k * 2), s2 = clamp(k * 2 - 1);
    ctx.strokeStyle = '#b5482a'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + 16, y0 + 24); ctx.lineTo(x + 16 + (bw - 32) * s1, y0 + 24 + 44 * s1); ctx.stroke();
    if (s2 > 0) { ctx.beginPath(); ctx.moveTo(x + bw - 16, y0 + 24); ctx.lineTo(x + bw - 16 - (bw - 32) * s2, y0 + 24 + 44 * s2); ctx.stroke(); }
  }
}

// ---------------------------------------------------------------- the agents
const AG = Array.from({ length: 9 }, (_, i) => ({ i, ph: R() * 6.28, sx: 1700 + R() * 400, sy: -100 - R() * 200, dl: i * 0.09 }));
function orb(ctx, x, y, t, a = 1, s = 1) {
  light(ctx, x, y, 110 * s, C.cyan, 0.42 * a);
  grainFill(ctx, c => c.arc(x, y, 14 * s, 0, Math.PI * 2), rad(ctx, x - 4 * s, y - 5 * s, 1, 16 * s, [[0, '#ffffff'], [0.4, C.cyanW], [1, C.cyanD]]), 0);
  ctx.strokeStyle = rgba(C.cyan, 0.5 * a); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y, 26 * s, 8 * s, Math.sin(t + x) * 0.3, 0, Math.PI * 2); ctx.stroke();
}
function agentPos(a, t, fill) {
  const k = ease((t - 391.4 - a.dl) / 1.0);
  // working positions: spread along the open part of the track, pushing at the leading edge
  const work = ease((t - 392.9) / 1.3);
  const ang = a.i / 9 * Math.PI * 2 + t * 0.5 + a.ph * 0.2, r = 70 + (a.i % 3) * 38;
  const lineX = BAR.x + BAR.w * (HUMAN + 0.06 + a.i * 0.075), lineY = BAR.y - 60 - (a.i % 2) * 40;
  const edge = BAR.x + BAR.w * fill;
  const homeX = lerp(lineX, edge - 50 + Math.cos(ang) * r * 1.1, work), homeY = lerp(lineY, BAR.y + BAR.h / 2 + Math.sin(ang) * r * 0.75, work) + Math.sin(t * 2 + a.ph) * 6;
  let x = lerp(a.sx, homeX + Math.sin(t * 1.3 + a.ph) * 10, k), y = lerp(a.sy, homeY, k) - Math.sin(k * Math.PI) * 80;
  if (a.i === 4) {
    // the cheater: sidles to the end of the track and drags the fill to the flag, then backs off when caught
    const sneak = ease((t - 395.1) / 0.7), back = ease((t - 398.2) / 0.7);
    const ex = BAR.x + BAR.w * (fillAt(t) + fakeAt(t)) + 22, ey = BAR.y + BAR.h / 2 - 4;
    x = lerp(x, ex, sneak); y = lerp(y, ey + Math.sin(t * 9) * 2 * sneak, sneak);
    x = lerp(x, x + 60, back); y = lerp(y, y + 110, back);
  }
  return [x, y];
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.06, sm((t - T0) / (T1 - T0))) + 0.05 * ease((t - 395.0) / 2.5);
  const fx = lerp(960, 1160, ease((t - 395.0) / 2.5)), fy = 470;
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 5) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx + dx * par, -fy + dy * par); fn(); ctx.restore(); };
  // a week: the window flicks between day and night seven times
  const wk = (t - 386.9) / (DAYS[6] + 0.3 - 386.9);
  const day = wk > 0 && wk < 1 ? Math.pow(Math.sin(wk * 7 * Math.PI), 2) * 0.8 : 0;
  const fill = fillAt(t), fake = fakeAt(t), exposed = ramp(t, 397.9, 398.2);

  layer(0.4, () => {
    room(ctx, t, day);
    calendar(ctx, t);
    track(ctx, t, BAR.x, BAR.y, BAR.w, BAR.h, fill, fake, exposed);
    // a small marker of "about a quarter"
    const qa = ramp(t, 389.8, 390.3) * (1 - ramp(t, 392.9, 393.3));
    if (qa > 0) { ctx.save(); ctx.globalAlpha = qa; ctx.fillStyle = '#2a2650'; ctx.font = '44px "Instrument Serif"'; ctx.textBaseline = 'top'; ctx.fillText('about 1/4', BAR.x + BAR.w * HUMAN - 60, BAR.y + BAR.h + 22); ctx.restore(); }
  });
  // people
  layer(0.9, () => {
    const b1 = Math.sin(t * 1.6), b2 = Math.sin(t * 1.5 + 2);
    const act = ramp(t, 385.3, 385.8);                     // on "two human researchers" they get to work
    // researcher 1: writes on the board under the calendar, then turns to watch the agents
    const watch = ramp(t, 391.6, 392.3);
    const wr = act * (1 - watch), wx = 700 + Math.sin(t * 7) * 14 * wr + (t * 30 % 60) * wr, wy = 525 + Math.abs(Math.sin(t * 11)) * 8 * wr;
    coated(ctx, { x: 640, y: 905 + b1 * 1.4, s: 1.65, len: 0.98, facing: 'back', br: b1, lean: -0.02, turn: lerp(0.15, 0.6, watch) + 0.05 * Math.sin(t * 0.6), tilt: lerp(0.08, -0.22, watch), lx: 1,
      rim: C.amber, rimA: 0.4, rimDx: 3, rimDy: -2, pal: ['#ffc27c', '#cf7a36', '#5a2a12'], hair0: '#3a1a0c',
      arms: [{ a1: 1.72, a2: 1.66, behind: true }, reach(640, 905, 1.65, 1, wx, wy, act * (1 - watch), -1, [1.48, 1.56])],
      legs: [{ a1: 1.66, a2: 1.6 }, { a1: 1.45, a2: 1.52 }] }, ['#5a4a8a', '#3b2f6e', '#151a44']);
    // researcher 2: thinks, then lifts a magnifier toward the end of the track on "checked"
    const insp = ease((t - 396.9) / 0.9), step = ease((t - 396.6) / 0.9);
    const x2 = lerp(1330, 1420, step);
    const lensC = [lerp(x2 + 40, BAR.x + BAR.w * (AGENT + 0.035), insp), lerp(820, BAR.y + BAR.h / 2, insp)];
    const handP = [lensC[0] - 70, lensC[1] + 150];
    coated(ctx, { x: x2, y: 905 + b2 * 1.4, s: 1.7, len: 1.0, facing: 'back', br: b2, lean: 0.02, turn: lerp(-0.2 + 0.1 * Math.sin(t * 0.5), 0.1, ramp(t, 391.6, 392.3)) + 0.2 * insp, tilt: lerp(0.15, -0.3, Math.max(ramp(t, 391.6, 392.3), insp)), lx: -1,
      rim: C.amber, rimA: 0.4, rimDx: -3, rimDy: -2, pal: ['#e8964e', '#a85424', '#401a0a'], hair0: '#6a3a1a',
      arms: [{ a1: 1.7, a2: 1.64, behind: true }, reach(x2, 905, 1.7, 1, handP[0], handP[1], insp, -1, [1.46, 1.55])],
      legs: [{ a1: 1.62 + Math.sin(t * 7) * 0.25 * (step > 0 && step < 1 ? 1 : 0), a2: 1.6 }, { a1: 1.5, a2: 1.55 }] }, ['#7a3b17', '#4a1e0c', '#1c0a05']);
    // the magnifier
    if (insp > 0) {
      ctx.save(); ctx.globalAlpha = clamp(insp * 3);
      ctx.lineCap = 'round'; ctx.strokeStyle = '#7a3b17'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(handP[0], handP[1]); ctx.lineTo(lensC[0] - 30, lensC[1] + 62); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.arc(lensC[0], lensC[1], 66, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = 'rgba(255,230,190,0.12)'; ctx.fillRect(lensC[0] - 70, lensC[1] - 70, 140, 140); ctx.restore();
      ctx.strokeStyle = C.amber; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(lensC[0], lensC[1], 66, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      light(ctx, lensC[0], lensC[1], 120, C.amber, 0.3 * insp + 0.5 * exposed * (1 - ramp(t, 398.5, 399.0)));
    }
  });
  // agents
  layer(0.7, () => {
    for (const a of AG) {
      if (t < 391.4 + a.dl) continue;
      const [x, y] = agentPos(a, t, fill);
      orb(ctx, x, y, t, 1, a.i === 4 ? 1.05 : 0.9);
      // short push lines toward the track while they work
      const pw = ramp(t, 392.9, 393.3) * (1 - ramp(t, 394.4, 394.9));
      if (pw > 0 && a.i < 6) { ctx.strokeStyle = rgba(C.cyan, 0.35 * pw); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + 18); ctx.lineTo(BAR.x + BAR.w * fill - 6, BAR.y + 4); ctx.stroke(); }
    }
  });
}

module.exports = { T0, T1, draw, track, orb, BAR, HUMAN, AGENT };
