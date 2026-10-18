// "Officials said this one didn't meet the bar, and OpenAI itself asked lawmakers to tighten it."
// In a hearing room a recorder draws a trace across a lit strip. An amber dashed line marks the reporting threshold.
// The incident spike climbs and stops just under it; two officials watch, one shakes his head. Then a hand reaches
// in, takes the threshold's slider and pulls the line down below the spike, which now flares: it would count.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, out, clamp, ease } = L;
const { gf, cached, rr, cap, figure } = K;

const T0 = 459.90, T1 = 466.70;
const PX0 = 250, PX1 = 1660, PY0 = 190, PY1 = 690, NX = 1450, V = 70, BASE = 560;
const SPIKE = 461.75, LOWER = [465.3, 466.1];
const THR0 = 318, THR1 = 430, PEAK = 336;

const R = rng(3), NOISE = Array.from({ length: 400 }, () => R() - 0.5);
function val(tau) {
  const i = Math.floor((tau - 440) * 6), f = (tau - 440) * 6 - i, n = lerp(NOISE[(i % 400 + 400) % 400], NOISE[((i + 1) % 400 + 400) % 400], f);
  const g = Math.exp(-Math.pow((tau - SPIKE) / 0.22, 2)), g2 = Math.exp(-Math.pow((tau - SPIKE - 0.45) / 0.2, 2)) * 0.35;
  return BASE + n * 26 + Math.sin(tau * 9) * 6 - (BASE - PEAK) * g + (BASE - PEAK) * 0.25 * g2 * Math.sin(tau * 30);
}
function roomArt(c) {
  gf(c, cc => cc.rect(-200, -200, 2320, 1500), lin(c, 0, 0, 0, 1080, [[0, '#0d0b28'], [1, '#1f1a48']]), 0.55);
  // wood panelling
  c.strokeStyle = 'rgba(80,64,140,0.22)'; c.lineWidth = 3; for (let x = -120; x < 2000; x += 160) c.strokeRect(x, 760, 130, 260);
  // the recorder's housing
  gf(c, cc => rr(cc, PX0 - 40, PY0 - 40, PX1 - PX0 + 80, PY1 - PY0 + 80, 18), lin(c, 0, PY0, 0, PY1, [[0, '#2c2660'], [1, '#141030']]), 0.5);
}

function draw(ctx, t) {
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.07, cx: 960, cy: 470, seed: 81 });
  const lowerK = ease(clamp((t - LOWER[0]) / (LOWER[1] - LOWER[0])));
  const thr = lerp(THR0, THR1, lowerK);
  layer(1, () => {
    cached(ctx, 'k7broom', -200, -200, 2120, 1300, roomArt);
    // the lit strip of paper
    gf(ctx, c => c.rect(PX0, PY0, PX1 - PX0, PY1 - PY0), lin(ctx, 0, PY0, 0, PY1, [[0, '#f3efe2'], [1, '#d8cdb2']]), 0.22, [PX0, PY0, PX1 - PX0, PY1 - PY0]);
    // grid scrolling with the paper
    ctx.save(); ctx.beginPath(); ctx.rect(PX0, PY0, PX1 - PX0, PY1 - PY0); ctx.clip();
    ctx.strokeStyle = 'rgba(90,74,138,0.16)'; ctx.lineWidth = 1.5;
    const off = (t * V) % 60;
    for (let x = PX1 - off; x > PX0; x -= 60) { ctx.beginPath(); ctx.moveTo(x, PY0); ctx.lineTo(x, PY1); ctx.stroke(); }
    for (let y = PY0 + 30; y < PY1; y += 50) { ctx.beginPath(); ctx.moveTo(PX0, y); ctx.lineTo(PX1, y); ctx.stroke(); }
    // the trace
    const crossed = lowerK > 0.55;
    ctx.lineWidth = 3.5; ctx.lineJoin = 'round'; ctx.strokeStyle = C.cyanD; ctx.beginPath();
    for (let x = PX0; x <= NX; x += 3) { const tau = t - (NX - x) / V; const y = val(tau); x === PX0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
    // the spike's tip, marked
    const sx = NX - (t - SPIKE) * V;
    if (t > SPIKE) {
      const fl = crossed ? ramp(t, LOWER[0] + 0.5, LOWER[0] + 0.7) : 0;
      ctx.fillStyle = crossed ? '#c9702e' : C.cyanD; ctx.beginPath(); ctx.arc(sx, PEAK, 8, 0, 7); ctx.fill();
      ctx.strokeStyle = rgba(crossed ? '#c9702e' : '#0a6f8c', 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, PEAK, 16 + 6 * Math.sin(t * 4), 0, 7); ctx.stroke();
      if (fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#ffb35c', 0.35 * fl); ctx.fillRect(sx - 60, PY0, 120, PY1 - PY0); ctx.restore(); }
      // gap between the tip and the bar, called out before it moves
      const ga = ramp(t, 462.0, 462.4) * (1 - ramp(t, LOWER[0], LOWER[0] + 0.3));
      if (ga > 0) { ctx.strokeStyle = rgba('#5a4a8a', 0.8 * ga); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx + 26, PEAK); ctx.lineTo(sx + 26, thr); ctx.moveTo(sx + 18, PEAK); ctx.lineTo(sx + 34, PEAK); ctx.moveTo(sx + 18, thr); ctx.lineTo(sx + 34, thr); ctx.stroke(); }
    }
    // the threshold: a dashed amber bar
    ctx.setLineDash([22, 12]); ctx.lineDashOffset = 0; ctx.strokeStyle = '#c9702e'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(PX0, thr); ctx.lineTo(PX1, thr); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(122,59,23,0.9)'; ctx.font = '22px "Inter SemiBold"'; ctx.letterSpacing = '3px'; ctx.fillText('REPORTING THRESHOLD', PX0 + 20, thr - 14); ctx.letterSpacing = '0px';
    ctx.restore();
    // the needle
    const ny = val(t);
    ctx.strokeStyle = '#1a1438'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(NX + 150, ny - 60); ctx.lineTo(NX, ny); ctx.stroke();
    ctx.fillStyle = '#1a1438'; ctx.beginPath(); ctx.arc(NX + 150, ny - 60, 12, 0, 7); ctx.fill();
    // the slider on the right rail
    ctx.fillStyle = '#0c0a22'; ctx.fillRect(PX1 + 14, PY0, 10, PY1 - PY0);
    gf(ctx, c => rr(c, PX1 + 2, thr - 18, 36, 36, 6), lin(ctx, 0, thr - 18, 0, thr + 18, [[0, '#ffcf8a'], [1, '#a2521f']]), 0.3, [PX1, thr - 20, 40, 40]);
    // light from the strip
    light(ctx, 950, 440, 800, '#fff1cf', 0.10);
    // the hand comes down from the top right and drags the slider down
    const reach = ease(clamp((t - 464.4) / 0.8)) * (1 - ease(clamp((t - 466.25) / 0.4)));
    if (reach > 0) {
      const hx = PX1 + 20, hy = lerp(-120, thr, reach);
      gf(ctx, c => cap(c, 2050, -200, hx + 60, hy - 50, 56, 40), lin(ctx, hx, 0, 2050, 0, [[0, '#ffb35c'], [1, '#7a3b17']]), 0.4, [hx, -300, 2100 - hx, hy + 300]);
      ctx.save(); ctx.translate(hx + 20, hy - 20); ctx.rotate(0.5);
      gf(ctx, c => rr(c, -30, -40, 84, 80, 34), lin(ctx, -30, -40, 50, 40, [[0, '#ffcf8a'], [1, '#c36a2b']]), 0.35, [-40, -50, 110, 100]);
      ctx.strokeStyle = 'rgba(122,59,23,0.6)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-14, -16 + i * 20); ctx.quadraticCurveTo(-28, -10 + i * 20, -30, 0 + i * 20); ctx.stroke(); }
      ctx.restore();
    }
    // two officials in the foreground, backs to us
    const shake = Math.sin((t - 462.0) * 14) * 0.35 * ramp(t, 462.0, 462.2) * (1 - ramp(t, 463.0, 463.4));
    const look2 = ramp(t, 463.3, 464.0) * 0.6;
    for (const [x, k] of [[330, 0], [600, 1]]) {
      const b = Math.sin(t * 1.4 + k);
      figure(ctx, { x, y: 1085 + b, s: 1.75, facing: 'back', br: b, lean: k ? -0.05 : 0.05, turn: k ? shake + 0.25 : -0.1 + look2, tilt: 0.1, lx: -1, grain: 0.3, w: k ? 1.1 : 1,
        pal: k ? ['#e8964e', '#a85424', '#401a0a'] : ['#d9843e', '#8a451c', '#3a160a'], arms: [{ a1: 1.9, a2: 1.7, behind: true }, { a1: 1.25, a2: 1.4, behind: true }], rim: '#fff1cf', rimA: 0.3, rimDx: 0, rimDy: -3 });
    }
  });
  L.label(ctx, t, 460.4, 463.2, 'Officials', 'did not meet the bar', 96, 50);
  L.label(ctx, t, 463.3, T1, 'OpenAI', 'asks lawmakers to tighten it', 96, 50, { color: C.cyan });
}

module.exports = { T0, T1, draw };
