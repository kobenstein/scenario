// "Then, at one point, the people in charge find warning signs that their AI isn't doing quite what they think."
// A dim control room seen from behind three people at a console. On the big centre screen a dashed cream line
// (what they expect) and a cyan line (what the AI actually does) run together; on "warning signs" the cyan line
// flickers into an odd jagged pattern and an amber lamp starts to pulse; on "what they think" the two lines part.
// The middle person leans in, the others turn to look.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out } = L;
const { grainFill, roundRect, blob, pat } = require('./s_k4_gap');
const { figure } = require('./s_timeline');

const T0 = 239.70, T1 = 247.00;
const T_GL = 242.37, T_WARN = 242.71, T_DIV = 244.6;

const PANEL = { x: 560, y: 120, w: 800, h: 380 };
const SIDE = [{ x: 150, y: 170, w: 370, h: 300, kind: 'bars', sk: 0.06 }, { x: 1400, y: 170, w: 370, h: 300, kind: 'dots', sk: -0.06 }];
const R = rng(240);
const BARS = Array.from({ length: 14 }, () => [R(), R() * 6]);
const DOTS = Array.from({ length: 96 }, () => [R(), R() * 6]);

const expected = x => 0.5 + 0.18 * Math.sin(x * 0.9) + 0.08 * Math.sin(x * 2.3 + 1) + 0.04 * Math.sin(x * 5.1);
function glitch(x, t) {
  // odd behaviour appears in the newest part of the trace: sharp irregular spikes, then a slow drift away
  const g = ramp(t, T_GL, T_GL + 0.5), d = ramp(t, T_DIV, T_DIV + 1.2);
  const age = (x - (t - 0.0) * 1.2);                // x scrolls; newest data at the right edge
  const recent = clamp((age + 3.2) / 2.0);
  let v = 0;
  if (g > 0) { const n = Math.sin(x * 17.3) * Math.sin(x * 7.1 + 2) * Math.sin(x * 3.3); v += g * recent * 0.07 * (Math.abs(n) > 0.4 ? Math.sign(n) : 0) + g * recent * 0.015 * Math.sin(x * 40); }
  v += d * recent * recent * 0.13;
  return v;
}

function trace(ctx, t, flick) {
  const { x, y, w, h } = PANEL;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#03050e'; ctx.beginPath(); roundRect(ctx, -12, -12, w + 24, h + 24, 10); ctx.fill();
  grainFill(ctx, c => c.rect(0, 0, w, h), lin(ctx, 0, 0, w * 0.3, h, [[0, '#0f5a78'], [0.6, '#0a3c58'], [1, '#062638']]), 0.3);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
  // grid
  ctx.strokeStyle = rgba(C.cyan, 0.10); ctx.lineWidth = 1;
  const gx = ((t * 1.2) % 1) * (w / 8);
  for (let i = 0; i <= 9; i++) { const xx = i * w / 8 - gx; ctx.beginPath(); ctx.moveTo(xx, 0); ctx.lineTo(xx, h); ctx.stroke(); }
  for (let j = 1; j < 5; j++) { ctx.beginPath(); ctx.moveTo(0, j * h / 5); ctx.lineTo(w, j * h / 5); ctx.stroke(); }
  // the two traces: data scrolls left, newest at the right
  const N = 160, X0 = t * 1.2 - 8;
  const yOf = v => h * (1 - v);
  const path = (f) => { ctx.beginPath(); for (let i = 0; i <= N; i++) { const u = i / N, xx = X0 + u * 8; const yy = yOf(f(xx)); i ? ctx.lineTo(u * (w - 40), yy) : ctx.moveTo(0, yy); } };
  const fl = t > T_GL && t < T_GL + 0.9 ? (Math.sin(t * 61) > 0 ? 1 : 0.35) : 1;
  ctx.globalCompositeOperation = 'lighter';
  path(xx => expected(xx) + glitch(xx, t)); ctx.strokeStyle = rgba(C.cyan, 0.25 * fl); ctx.lineWidth = 12; ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  path(xx => expected(xx) + glitch(xx, t)); ctx.strokeStyle = rgba(C.cyan, fl); ctx.lineWidth = 4.5; ctx.stroke();
  ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 40; path(expected); ctx.strokeStyle = 'rgba(3,6,16,0.6)'; ctx.lineWidth = 7; ctx.stroke(); ctx.strokeStyle = rgba(C.cream, 0.95); ctx.lineWidth = 3.5; ctx.stroke(); ctx.setLineDash([]);
  // the live point
  const ex = X0 + 8, ly = yOf(expected(ex) + glitch(ex, t)), ey = yOf(expected(ex));
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(w - 40, ly, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(w - 40, ey, 4, 0, Math.PI * 2); ctx.fill();
  // the gap between expected and actual, marked once they part
  const d = ramp(t, T_DIV + 0.3, T_DIV + 1.0);
  if (d > 0) { ctx.strokeStyle = rgba(C.amber, 0.9 * d); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(w - 22, ey); ctx.lineTo(w - 16, ey); ctx.lineTo(w - 16, ly); ctx.lineTo(w - 22, ly); ctx.stroke(); }
  // amber warning tint on the panel
  const warn = ramp(t, T_WARN, T_WARN + 0.3), pulse = warn * (0.5 + 0.5 * Math.sin((t - T_WARN) * Math.PI * 2 * 1.1 - Math.PI / 2));
  ctx.fillStyle = rgba(C.amber, 0.08 * pulse); ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = rgba(C.amber, 0.7 * pulse); ctx.lineWidth = 6; ctx.strokeRect(3, 3, w - 6, h - 6);
  // sheen
  ctx.fillStyle = lin(ctx, 0, 0, w, h, [[0, 'rgba(216,247,255,0.08)'], [0.5, 'rgba(216,247,255,0)'], [1, 'rgba(216,247,255,0.03)']]); ctx.fillRect(0, 0, w, h);
  ctx.restore(); ctx.restore();
  light(ctx, x + w / 2, y + h / 2, w * 0.8, C.cyan, 0.18 * flick);
  return pulse;
}

function side(ctx, p, t, flick) {
  ctx.save(); ctx.translate(p.x, p.y); ctx.transform(1, p.sk, 0, 1, 0, 0);
  ctx.fillStyle = '#03050e'; ctx.beginPath(); roundRect(ctx, -10, -10, p.w + 20, p.h + 20, 8); ctx.fill();
  grainFill(ctx, c => c.rect(0, 0, p.w, p.h), lin(ctx, 0, 0, p.w * 0.4, p.h, [[0, '#0e4f6c'], [1, '#05202f']]), 0.3);
  if (p.kind === 'bars') {
    BARS.forEach(([k, ph], i) => { const v = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * (0.8 + k) + ph)); const bw = p.w / 14 - 8; ctx.fillStyle = rgba(i % 5 === 3 ? C.amber : C.cyan, 0.75); ctx.fillRect(8 + i * (p.w / 14), p.h - 16 - v * (p.h - 40), bw, v * (p.h - 40)); });
  } else {
    DOTS.forEach(([k, ph], i) => { const cx = 22 + (i % 12) * ((p.w - 40) / 11), cy = 24 + Math.floor(i / 12) * ((p.h - 44) / 7); const a = 0.2 + 0.7 * (0.5 + 0.5 * Math.sin(t * (1 + k * 2) + ph)); ctx.fillStyle = rgba(C.cyanW, a); ctx.beginPath(); ctx.arc(cx, cy, 5 + 3 * k, 0, Math.PI * 2); ctx.fill(); });
  }
  ctx.restore();
  light(ctx, p.x + p.w / 2, p.y + p.h / 2, p.w, C.cyan, 0.10 * flick);
}

function seated(ctx, t, x, y, s, o) {
  const b = Math.sin(t * 1.6 + o.ph);
  const opts = { x, y: y + b * 1.2 * s, s, w: 1.05, br: b, facing: 'back', lean: o.lean, turn: o.turn, tilt: o.tilt || 0, lx: o.lx ?? 1, pal: o.pal, hair0: o.hair, grain: 0.38,
    rim: C.cyan, rimA: 0.45, rimDx: 0, rimDy: -3,
    arms: o.arms };
  figure(ctx, opts);
  // chair back between us and them
  const cw = 60 * s, cy = y + 6 * s;
  grainFill(ctx, c => { c.moveTo(x - cw, cy + 120 * s); c.lineTo(x - cw * 0.95, cy - 40 * s); c.quadraticCurveTo(x, cy - 58 * s, x + cw * 0.95, cy - 40 * s); c.lineTo(x + cw, cy + 120 * s); c.closePath(); },
    lin(ctx, 0, cy - 50 * s, 0, cy + 90 * s, [[0, '#2a2458'], [0.25, '#16133a'], [1, '#07071a']]), 0.5);
  ctx.strokeStyle = rgba(C.cyan, 0.25); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - cw * 0.95, cy - 40 * s); ctx.quadraticCurveTo(x, cy - 58 * s, x + cw * 0.95, cy - 40 * s); ctx.stroke();
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.10, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 0.9, 31) * 6, dy = drift(t, 0.9, 32) * 4;
  const flick = 0.9 + 0.1 * Math.sin(t * 13) * Math.sin(t * 3.1);
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, 330); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -330 + dy * par); fn(); ctx.restore(); };
  let pulse = 0;
  layer(0.4, () => {
    grainFill(ctx, c => c.rect(-300, -300, W + 600, H + 600), lin(ctx, 0, 0, 0, H, [[0, '#090b24'], [0.5, '#141640'], [1, '#08081a']]), 0.55);
    // wall frame and the warning lamp above the big screen
    ctx.fillStyle = '#05060f'; ctx.fillRect(-300, 540, W + 600, 30);
    side(ctx, SIDE[0], t, flick); side(ctx, SIDE[1], t, flick);
    pulse = trace(ctx, t, flick);
    const lx = PANEL.x + PANEL.w / 2, ly = 78;
    ctx.fillStyle = '#120a08'; ctx.beginPath(); roundRect(ctx, lx - 26, ly - 6, 52, 30, 6); ctx.fill();
    ctx.fillStyle = pulse > 0.02 ? rgba('#ffcf8a', 0.35 + 0.65 * pulse) : '#3a2214'; ctx.beginPath(); ctx.arc(lx, ly - 4, 16, Math.PI, 0); ctx.fill();
    light(ctx, lx, ly - 6, 260, C.amber, 0.75 * pulse);
    light(ctx, lx, ly - 6, 60, '#ffe6b8', 0.6 * pulse);
  });
  // amber wash over the room as the lamp pulses
  if (pulse > 0) blob(ctx, W / 2, 200, 1300, 700, C.amber, 0.10 * pulse, true);
  // the console desk with small screens
  layer(0.75, () => {
    grainFill(ctx, c => { c.moveTo(-300, 690); c.quadraticCurveTo(W / 2, 640, W + 300, 690); c.lineTo(W + 300, H + 300); c.lineTo(-300, H + 300); c.closePath(); }, lin(ctx, 0, 650, 0, H, [[0, '#2a2860'], [0.2, '#16163c'], [1, '#08081a']]), 0.55);
    ctx.strokeStyle = rgba(C.cyan, 0.3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-300, 690); ctx.quadraticCurveTo(W / 2, 640, W + 300, 690); ctx.stroke();
    for (const [x, w, sk] of [[150, 230, 0.05], [700, 200, 0], [1080, 200, 0], [1560, 230, -0.05]]) {
      ctx.save(); ctx.translate(x, 560); ctx.transform(1, sk, 0, 1, 0, 0);
      ctx.fillStyle = '#04050d'; ctx.beginPath(); roundRect(ctx, -6, -6, w + 12, 112, 6); ctx.fill();
      ctx.fillStyle = lin(ctx, 0, 0, 0, 100, [[0, '#0f5a78'], [1, '#07304a']]); ctx.fillRect(0, 0, w, 100);
      for (let r = 0; r < 4; r++) { ctx.fillStyle = rgba(C.cyanW, 0.5); ctx.fillRect(12, 14 + r * 21, (0.3 + 0.6 * Math.abs(Math.sin(r * 3.1 + x + t * 0.5))) * (w - 24), 7); }
      ctx.restore();
      cone(ctx, x + w / 2, 660, w, w * 1.6, 200, C.cyan, 0.06 * flick);
    }
  });
  // three people at the console, from behind
  layer(1.1, () => {
    const lean = ramp(t, 241.6, 242.9), look = ramp(t, 243.2, 244.0), look2 = ramp(t, 243.5, 244.4);
    // left: turns toward the middle one
    seated(ctx, t, 420, 1010, 1.6, { ph: 0, lean: -0.04, turn: lerp(0.15 * Math.sin(t * 0.4), 0.7, look2), tilt: 0.04, lx: 1, pal: ['#f0a25a', '#b8622a', '#4a1e0c'], hair: '#3a1a0c',
      arms: [{ a1: 1.85, a2: -0.5, behind: true }, { a1: 1.29, a2: -2.64, behind: true }] });
    // right: hand to the chin, then turns to the big screen
    seated(ctx, t, 1500, 1010, 1.6, { ph: 2, lean: 0.03, turn: lerp(-0.3 + 0.1 * Math.sin(t * 0.5), -0.75, look), tilt: -0.05, lx: -1, pal: ['#ffbe6e', '#d0783a', '#5a2a12'], hair: '#2a1208',
      arms: [{ a1: 1.85, a2: -0.5, behind: true }, { a1: 1.29, a2: -2.64, behind: true }] });
    // middle: leans in toward the screen
    seated(ctx, t, 960, 1040 - 60 * lean, lerp(1.7, 1.55, lean), { ph: 1, lean: 0, turn: 0.08 * Math.sin(t * 0.6) * (1 - lean), tilt: lerp(0.0, -0.12, lean), lx: 1, pal: ['#ffb35c', '#c9702e', '#5a2a12'], hair: '#4a200c',
      arms: [{ a1: lerp(1.85, 2.05, lean), a2: lerp(-0.5, -0.4, lean), behind: true }, { a1: lerp(1.29, 1.09, lean), a2: lerp(-2.64, -2.74, lean), behind: true }] });
  });
}
const cone = L.cone;

module.exports = { T0, T1, draw };
