// "Jared Kaplan, Anthropic's chief scientist, thinks that somewhere in that second we'll have to decide whether to let
//  AI train its own successors. He's called it maybe the biggest decision yet."
// Inside the last second (we stand on its glowing edge): the AI, a cyan ring, pours streams of light toward an amber
// gate. A person stands at the gate with a hand on its lever. Beyond the gate, faint dashed rings sketch themselves in,
// each one bigger: the successors it would build if the gate opened. The hand stays on the lever.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, rng, lin, rad, rgba, light, clamp, label } = L;
const { grainFill, roundRect, glowStroke, stars, sky } = require('./s_k3_clock');
const { figure } = require('./s_timeline');

const T0 = 162.0, T1 = 175.1;
const FLOOR = 822;
const R1 = { x: 470, y: 490, rx: 88, ry: 136 };
const GATE = { x: 1190, y0: 250, y1: FLOOR, w: 34 };
const GHOST = [{ x: 1400, y: 480, rx: 100, ry: 156, t: 169.75 }, { x: 1590, y: 462, rx: 122, ry: 190, t: 170.15 }, { x: 1790, y: 440, rx: 148, ry: 230, t: 170.55 }];
const LEVER = { px: 1112, py: FLOOR - 26 };

const STREAMS = (() => { const r = rng(17), a = []; for (let i = 0; i < 46; i++) a.push({ y: (r() - 0.5) * 2, bow: (r() - 0.5) * 70, sp: 0.35 + r() * 0.35, ph: r(), len: 0.05 + r() * 0.08, w: 1 + r() * 1.6 }); return a; })();

function ell(R, k, a) { return [R.x + Math.cos(a) * R.rx * k, R.y + Math.sin(a) * R.ry * k]; }

function ring1(ctx, t) {
  const p = 0.5 + 0.5 * Math.sin(t * 6.2), think = 0.7 + 0.3 * ramp(t, 165.5, 166.5);
  light(ctx, R1.x, R1.y, 260, C.cyan, 0.20 + 0.10 * p * think);
  glowStroke(ctx, c => c.ellipse(R1.x, R1.y, R1.rx, R1.ry, 0, 0, 7), C.cyan, 6 + 1.5 * p, 0.8 + 0.2 * p);
  glowStroke(ctx, c => c.ellipse(R1.x, R1.y, R1.rx - 4, R1.ry - 5, 0, 0, 7), C.cyanW, 1.6, 0.6 + 0.4 * p);
  for (let k = 0; k < 3; k++) { const ph = (t * 0.9 + k / 3) % 1;
    glowStroke(ctx, c => c.ellipse(R1.x, R1.y, R1.rx * (0.25 + 0.7 * ph), R1.ry * (0.25 + 0.7 * ph), 0, 0, 7), C.cyan, 1.1, 0.4 * think * Math.sin(ph * Math.PI)); }
  for (let i = 0; i < 12; i++) { const a = t * (1.6 + i * 0.13) + i * 0.63, q = ell(R1, 1 + 0.06 * Math.sin(t * 3 + i), a); light(ctx, q[0], q[1], 8, C.cyanW, 0.6 * (0.5 + 0.5 * Math.sin(t * 9 + i))); }
}

// streams from the ring to the gate, where they are held
function streams(ctx, t, amt, push) {
  if (amt <= 0) return;
  const x0 = R1.x + R1.rx * 0.9, x1 = GATE.x - 6;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const s of STREAMS) {
    const sp = s.sp * (1 + 0.8 * push);
    const ph = (t * sp + s.ph) % 1, a = ph, b = Math.min(1, ph + s.len * (1 + push));
    if (a > amt) continue;
    const y0 = R1.y + s.y * R1.ry * 0.7, y1 = 480 + s.y * 140;
    const P = k => [lerp(x0, x1, k), lerp(y0, y1, k) + Math.sin(k * Math.PI) * s.bow];
    const pa = P(a), pb = P(b);
    ctx.strokeStyle = rgba(s.w > 2 ? C.cyanW : C.cyan, 0.55 * Math.sin(Math.PI * Math.min(1, ph * 1.2 + 0.05)) * amt); ctx.lineWidth = s.w;
    ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
  }
  ctx.restore();
}

// the gate: dark posts with an amber membrane of light; arriving streams ripple on it
function gate(ctx, t, press, hold) {
  const { x, y0, y1, w } = GATE;
  // membrane
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const flick = 0.9 + 0.1 * Math.sin(t * 5.3);
  ctx.fillStyle = lin(ctx, x - w, 0, x + w, 0, [[0, rgba(C.amber, 0)], [0.45, rgba(C.amber, (0.28 + 0.18 * hold) * flick)], [0.55, rgba('#ffe2a8', (0.35 + 0.2 * hold) * flick)], [1, rgba(C.amber, 0)]]);
  ctx.fillRect(x - w, y0 + 10, 2 * w, y1 - y0 - 10);
  // ripples where the streams hit
  for (let k = 0; k < 5; k++) { const ph = (t * (0.7 + 0.5 * press) + k / 5) % 1, yc = 480 + Math.sin(k * 2.3 + Math.floor(t * 0.7 + k / 5) * 1.7) * 120;
    ctx.strokeStyle = rgba('#ffe2a8', 0.5 * (1 - ph) * press); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, yc, 6 + ph * 14, 20 + ph * 80, 0, 0, 7); ctx.stroke(); }
  ctx.restore();
  light(ctx, x, 480, 300, C.amber, 0.16 + 0.08 * press + 0.08 * hold);
  // crossbars: the gate is shut
  for (const yy of [330, 470, 610]) { grainFill(ctx, c => roundRect(c, x - w - 4, yy, 2 * w + 8, 9, 4), '#2a2252', 0.3); ctx.fillStyle = rgba('#ffe2a8', 0.55); ctx.fillRect(x - w - 4, yy, 2 * w + 8, 2); }
  // posts and lintel
  for (const px of [x - w - 6, x + w - 6]) grainFill(ctx, c => c.rect(px, y0, 12, y1 - y0), lin(ctx, px, 0, px + 12, 0, [[0, '#2a2252'], [1, '#0a0920']]), 0.4);
  grainFill(ctx, c => roundRect(c, x - w - 16, y0 - 12, 2 * w + 32, 16, 4), '#1a1640', 0.4);
  ctx.fillStyle = rgba(C.amber, 0.5); ctx.fillRect(x - w - 16, y0 - 12, 2 * w + 32, 2);
}

function lever(ctx, t, grip) {
  const wob = grip * (0.02 * Math.sin(t * 2.3) + 0.012 * Math.sin(t * 5.1));
  const a = -1.42 - 0.12 + wob, len = 230;
  const hx = LEVER.px + Math.cos(a) * len, hy = LEVER.py + Math.sin(a) * len;
  // rod to the gate
  grainFill(ctx, c => c.rect(LEVER.px, FLOOR - 40, GATE.x - GATE.w - LEVER.px, 9), '#16123a', 0.3);
  // base
  grainFill(ctx, c => roundRect(c, LEVER.px - 46, FLOOR - 52, 92, 52, 8), lin(ctx, 0, FLOOR - 52, 0, FLOOR, [[0, '#2c2758'], [1, '#121034']]), 0.5);
  ctx.fillStyle = rgba(C.amber, 0.35); ctx.fillRect(LEVER.px - 46, FLOOR - 52, 92, 2);
  // the arm
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#2a2252'; ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(LEVER.px, LEVER.py); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.strokeStyle = 'rgba(164,159,196,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LEVER.px - 4, LEVER.py); ctx.lineTo(hx - 4, hy); ctx.stroke(); ctx.restore();
  grainFill(ctx, c => c.arc(LEVER.px, LEVER.py, 15, 0, 7), '#3b2f6e', 0.4);
  // handle glows warm once it is held
  grainFill(ctx, c => c.ellipse(hx, hy, 15, 21, a + Math.PI / 2, 0, 7), lin(ctx, hx - 15, hy - 20, hx + 15, hy + 20, [[0, '#ffd29a'], [1, '#a2521f']]), 0.3);
  light(ctx, hx, hy, 70, C.amber, 0.2 + 0.35 * grip);
  return [hx, hy];
}

function ghosts(ctx, t, hold) {
  GHOST.forEach((g, i) => {
    const k = out((t - g.t) / 0.9); if (k <= 0) return;
    const br = 0.55 + 0.45 * Math.sin(t * 2.2 + i * 1.3), al = (0.95 - i * 0.2) * k;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    ctx.setLineDash([10, 12]); ctx.lineDashOffset = -t * 18;
    for (const [lw, la] of [[10, 0.12], [3.5, 1]]) { ctx.strokeStyle = rgba(C.cyan, la * al * (0.7 + 0.3 * br)); ctx.lineWidth = lw;
      ctx.beginPath(); if (k > 0.999) ctx.ellipse(g.x, g.y, g.rx, g.ry, 0, 0, 7); else ctx.ellipse(g.x, g.y, g.rx, g.ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k); ctx.stroke(); }
    ctx.setLineDash([3, 9]); ctx.strokeStyle = rgba(C.cyan, al * 0.5); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(g.x, g.y, g.rx * 1.14, g.ry * 1.14, 0, 0, k > 0.999 ? 7 : Math.PI * 2 * k); ctx.stroke();
    // the faint link it would have to the previous one
    const prev = i === 0 ? { x: GATE.x + GATE.w, y: 480, rx: 0 } : GHOST[i - 1];
    ctx.setLineDash([2, 10]); ctx.strokeStyle = rgba(C.cyan, al * 0.45); ctx.lineWidth = 2;
    for (const o of [-0.4, 0, 0.4]) { ctx.beginPath(); ctx.moveTo(prev.x + prev.rx, prev.y + o * 80); ctx.lineTo(g.x - g.rx, g.y + o * g.ry * 0.6); ctx.stroke(); }
    ctx.restore();
    light(ctx, g.x, g.y, g.rx * 2.2, C.cyan, 0.12 * k * br);
    if (k < 1) { const a = -Math.PI / 2 + Math.PI * 2 * k, q = [g.x + Math.cos(a) * g.rx, g.y + Math.sin(a) * g.ry]; light(ctx, q[0], q[1], 30, C.cyanW, 0.8); }
  });
}

// a long coat over the figure's back: collar, flared hem, centre vent, belt
function coat(ctx, x, y, b, t) {
  const sway = Math.sin(t * 1.3) * 2, sw = 47, top = y - 106;
  const path = c => { c.moveTo(x - 20, top - 6); c.quadraticCurveTo(x - sw, top - 2, x - sw - 2, top + 18);
    c.bezierCurveTo(x - sw - 4, top + 70, x - 40, y - 10, x - 46 + sway, y + 74); c.quadraticCurveTo(x, y + 80, x + 46 + sway, y + 72);
    c.bezierCurveTo(x + 40, y - 10, x + sw + 4, top + 70, x + sw + 2, top + 18); c.quadraticCurveTo(x + sw, top - 2, x + 20, top - 6); c.closePath(); };
  ctx.save(); ctx.translate(-3, -2); grainFill(ctx, path, rgba(C.cyan, 0.5), 0); ctx.restore();
  grainFill(ctx, path, lin(ctx, x - sw, top, x + sw, y + 70, [[0, '#ffb35c'], [0.45, '#c9702e'], [1, '#5a2a12']]), 0.45);
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(74,34,16,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 2, top + 30); ctx.quadraticCurveTo(x + 4, y + 10, x + 4 + sway * 0.5, y + 76); ctx.stroke();
  ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(90,42,18,0.85)'; ctx.beginPath(); ctx.moveTo(x - 40, y - 26); ctx.quadraticCurveTo(x, y - 20, x + 40, y - 26); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(74,34,16,0.45)'; ctx.beginPath(); ctx.moveTo(x - 30, top + 20); ctx.quadraticCurveTo(x - 24, top + 60, x - 30, y - 30); ctx.stroke();
  ctx.restore();
  // turned-up collar
  grainFill(ctx, c => { c.moveTo(x - 26, top - 4); c.quadraticCurveTo(x, top - 22, x + 26, top - 4); c.lineTo(x + 22, top + 10); c.quadraticCurveTo(x, top + 2, x - 22, top + 10); c.closePath(); }, '#a2521f', 0.4);
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.1, sm((t - T0) / (T1 - T0))), dx = drift(t, 1, 2) * 6, dy = drift(t, 1, 6) * 4;
  const cx = 1000, cy = 520;
  const layer = (par, fn) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(lerp(1, z, par), lerp(1, z, par)); ctx.translate(-cx + dx * par, -cy + dy * par);
    ctx.translate(900, FLOOR); ctx.scale(1.2, 1.2); ctx.translate(-900, -FLOOR); fn(); ctx.restore(); };
  sky(ctx, '#05061a', '#0b0f30', '#141a46');
  layer(0.2, () => stars(ctx, t, 0, 0, 1, 0.8));
  const flow = ramp(t, 162.3, 165.9), push = ramp(t, 169.4, 170.2), grip = ramp(t, 167.7, 168.5);
  layer(0.8, () => {
    // the edge of the last second: a glowing floor line
    ctx.fillStyle = lin(ctx, 0, FLOOR, 0, H, [[0, rgba(C.cyanD, 0.55)], [0.35, 'rgba(10,40,70,0.35)'], [1, 'rgba(7,9,24,0)']]); ctx.fillRect(-200, FLOOR, W + 400, H - FLOOR + 200);
    glowStroke(ctx, c => { c.moveTo(-200, FLOOR); c.lineTo(W + 200, FLOOR); }, C.cyanW, 2.4, 0.7);
    ctx.strokeStyle = rgba(C.cyan, 0.4); ctx.lineWidth = 1.5;
    for (let x = -120; x < W + 200; x += 86) { ctx.beginPath(); ctx.moveTo(x, FLOOR + 6); ctx.lineTo(x, FLOOR + (Math.round((x + 120) / 86) % 5 === 0 ? 30 : 16)); ctx.stroke(); }
    light(ctx, R1.x, FLOOR, 400, C.cyan, 0.10);
    ghosts(ctx, t, grip);
    streams(ctx, t, flow, push);
    ring1(ctx, t);
    gate(ctx, t, flow * (0.5 + 0.5 * push), grip);
    // reflections of the lights on the floor
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(0, FLOOR); ctx.scale(1, 0.12);
    ctx.fillStyle = rad(ctx, R1.x, 0, 0, 260, [[0, rgba(C.cyan, 0.35)], [1, rgba(C.cyan, 0)]]); ctx.fillRect(R1.x - 260, -260, 520, 520);
    ctx.fillStyle = rad(ctx, GATE.x, 0, 0, 200, [[0, rgba(C.amber, 0.4)], [1, rgba(C.amber, 0)]]); ctx.fillRect(GATE.x - 200, -200, 400, 400); ctx.restore();
  });
  layer(1.0, () => {
    const handle = lever(ctx, t, grip);
    // the person at the lever: seen from behind, looks at the ring, reaches for the lever on "decide",
    // then looks past the gate at what it would let through
    const b = Math.sin(t * 1.7), hipX = 1010, hipY = FLOOR - 150;
    const s = 1.0, sh = [hipX + 46 * s * 0.78, hipY - 118 * s * 0.88];
    const rest = [sh[0] + 10, sh[1] + 112 + b];
    const hand = [lerp(rest[0], handle[0] - 4, ease(grip)), lerp(rest[1], handle[1] + 6, ease(grip))];
    const look = ramp(t, 170.0, 171.0);
    const turn = lerp(-0.55 + 0.08 * Math.sin(t * 0.6), 0.6, look) * (1 - 0.6 * ramp(t, 167.6, 168.3) * (1 - look));
    ctx.fillStyle = 'rgba(4,4,16,0.5)'; ctx.beginPath(); ctx.ellipse(hipX, FLOOR + 2, 70, 9, 0, 0, 7); ctx.fill();
    const F = { x: hipX, y: hipY + b * 1.5, s, facing: 'back', br: b, lean: 0.02 + 0.03 * grip, turn, tilt: lerp(-0.12, -0.05, look), lx: 1, grain: 0.35,
      pal: ['#f0a25a', '#b0602a', '#45200c'], rim: C.cyan, rimA: 0.5, rimDx: -3, rimDy: -2,
      arms: [{ a1: Math.PI / 2 + 0.12, a2: Math.PI / 2 + 0.05, behind: false }, { tx: hand[0], ty: hand[1], bend: -1 }],
      legs: [{ a1: Math.PI / 2 + 0.07, a2: Math.PI / 2 + 0.02 }, { a1: Math.PI / 2 - 0.08, a2: Math.PI / 2 - 0.02 }] };
    figure(ctx, Object.assign({}, F, { noArms: true, pal: ['#6a5a9a', '#3b2f6e', '#15122e'] }));
    coat(ctx, hipX, hipY + b * 1.5, b, t);
    figure(ctx, Object.assign({}, F, { only: 'arms' }));
    light(ctx, hand[0], hand[1], 50, C.amber, 0.25 * grip);
  });
  // words
  label(ctx, t, 162.55, 168.6, 'Jared Kaplan', 'chief scientist, Anthropic', 96, 96, { color: C.cyan });
  quote(ctx, t, 171.9, T1, 'maybe the biggest decision yet', 'Jared Kaplan, paraphrased');
}

function quote(ctx, t, t0, t1, text, who) {
  const a = ramp(t, t0, t0 + 0.6) * (1 - ramp(t, t1 - 0.45, t1)); if (a <= 0) return;
  const rise = (1 - out((t - t0) / 0.9)) * 16, x = 96, y = 84 + rise;
  ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 22; ctx.textBaseline = 'top';
  ctx.fillStyle = C.amber; ctx.font = '120px "Instrument Serif"'; // paraphrase, not a direct quote: no quote marks
  ctx.fillStyle = C.cream; ctx.font = '78px "Instrument Serif"'; ctx.fillText(text, x + 44, y);
  ctx.strokeStyle = C.amber; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 46, y + 108); ctx.lineTo(x + 46 + 56 * out((t - t0) / 0.8), y + 108); ctx.stroke();
  ctx.font = '24px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.fillStyle = C.lav; ctx.fillText(who.toUpperCase(), x + 46, y + 124);
  ctx.restore();
}

module.exports = { T0, T1, draw };
