// "If that holds, the takeoff in their story lands between late 2027 and mid 2029.
//  Their more careful model says closer to 2030."
// A timeline laid out like a road into the night, 2026 to 2031. A small person stands at 2026 and looks ahead.
// A takeoff curve draws itself: flat, then steeply up. Its knee slides from late 2027 to mid 2029, leaving a fan
// of curves and a warm band on the ground. Then a softer dashed curve settles at 2030.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, label, out, ease } = L;
const { grainFill, curve, glowStroke, cached, cam, tag } = require('./s_k5_race');
const { figure } = require('./s_timeline');

const T0 = 264.1, T1 = 275.4;
const GY = 720, YX = y => 250 + (y - 2026) * 300;
const KA = YX(2027.83), KB = YX(2029.5), KC = YX(2030);

// takeoff curve with its knee at xK, drawn from 2026 up to pen position u (0..1 of its length)
function tcurve(xK, steep = 1) {
  const pts = [];
  for (let x = 250; x < 2100; x += 8) { const y = GY - 6 - (x - 250) * 0.035 - 16 * Math.exp((x - xK) / (64 / steep)); pts.push([x, y]); if (y < 40) break; }
  return pts;
}
function drawCurve(ctx, pts, u, col, w, a, dash) {
  const n = Math.max(2, Math.floor(pts.length * clamp(u)));
  const p = pts.slice(0, n);
  if (dash) ctx.setLineDash(dash);
  glowStroke(ctx, c => { c.moveTo(p[0][0], p[0][1]); for (const q of p) c.lineTo(q[0], q[1]); }, col, w, a);
  ctx.setLineDash([]);
  return p[n - 1];
}

const R = rng(264);
const STARS = Array.from({ length: 140 }, () => [R() * (W + 400) - 200, R() * 640, R()]);
function skyArt(c) {
  c.fillStyle = lin(c, 0, -200, 0, 900, [[0, '#05061a'], [0.6, '#11143a'], [1, '#231d4e']]); c.fillRect(-200, -200, W + 400, 1100);
  // the far plain the timeline runs across
  grainFill(c, cc => { cc.moveTo(-200, GY - 40); cc.quadraticCurveTo(W / 2, GY - 70, W + 200, GY - 40); cc.lineTo(W + 200, 1300); cc.lineTo(-200, 1300); cc.closePath(); },
    lin(c, 0, GY - 60, 0, H, [[0, '#1f1c4a'], [0.4, '#141336'], [1, '#08081c']]), 0.55);
  // faint graph paper on the plain, receding
  c.strokeStyle = 'rgba(164,159,196,0.07)'; c.lineWidth = 1.5;
  for (let k = 0; k < 9; k++) { const y = GY + 20 + k * k * 6; c.beginPath(); c.moveTo(-200, y); c.lineTo(W + 200, y); c.stroke(); }
  for (let x = -600; x < W + 600; x += 150) { c.beginPath(); c.moveTo(W / 2 + (x - W / 2) * 0.55, GY - 30); c.lineTo(x, H + 200); c.stroke(); }
}

function draw(ctx, t) {
  const layer = cam(ctx, t, T0, T1, 1.0, 1.1, 1100, 560, 11);
  const lineIn = out((t - 264.25) / 1.1);                      // the timeline draws on "If that holds"
  const pen = ease((t - 265.6) / 1.45);                        // first curve: "takeoff ... lands"
  const slide = ease((t - 268.25) / 1.95);                     // knee slides from late 2027 to mid 2029
  const careful = ease((t - 271.8) / 1.6), land = ramp(t, 273.9, 274.2), pulse = Math.exp(-Math.max(0, t - 274.0) * 2.5) * (t > 274.0);
  const flick = 0.92 + 0.08 * Math.sin(t * 5.3) * Math.sin(t * 1.7);
  layer(0.25, () => {
    cached(ctx, 'k5years_sky', -200, -200, W + 200, H + 200, skyArt, 1);
    for (const [x, y, k] of STARS) { const a = 0.15 + 0.3 * Math.sin(t * (0.8 + k * 2) + k * 30); if (a > 0) { ctx.fillStyle = rgba(C.cream, a * (1 - y / 700)); ctx.fillRect(x, y, 2, 2); } }
  });
  layer(0.6, () => {
    // the timeline itself
    const xe = lerp(150, 1950, lineIn);
    ctx.strokeStyle = rgba(C.cream, 0.7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(150, GY); ctx.lineTo(xe, GY); ctx.stroke();
    for (let y = 2026; y <= 2031; y++) { const x = YX(y), a = ramp(t, 264.4 + (y - 2026) * 0.13, 264.8 + (y - 2026) * 0.13);
      if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = rgba(C.cream, 0.8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, GY - 10); ctx.lineTo(x, GY + 10); ctx.stroke();
      for (let q = 1; q < 4; q++) { ctx.lineWidth = 1.5; ctx.strokeStyle = rgba(C.cream, 0.35); ctx.beginPath(); ctx.moveTo(x + q * 75, GY - 5); ctx.lineTo(x + q * 75, GY + 5); ctx.stroke(); }
      const hot = (y === 2027 && t > 267.7 && t < 270.9) || (y === 2029 && t > 270.1 && t < 271.6) || (y === 2030 && t > 273.9);
      ctx.font = '44px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = hot ? C.amber : C.cream; ctx.fillText(String(y), x, GY + 22 + (1 - a) * 10);
      ctx.restore(); }
    // the band where their takeoff lands, glowing on the ground
    const bw = (lerp(KA, KB, slide) - KA) * ramp(t, 267.0, 267.3);
    if (t > 267.0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      if (bw > 4) { ctx.translate(KA + bw / 2, GY); ctx.scale((bw / 2 + 60) / 260, 1); ctx.fillStyle = rad(ctx, 0, 0, 0, 260, [[0, rgba(C.amber, 0.2 * flick)], [0.5, rgba(C.amber, 0.07 * flick)], [1, rgba(C.amber, 0)]]); ctx.fillRect(-260, -260, 520, 262); }
      ctx.restore();
      grainFill(ctx, c => { c.moveTo(KA, GY - 6); c.lineTo(KA + bw, GY - 6); c.lineTo(KA + bw + 30, GY + 8); c.lineTo(KA - 30, GY + 8); c.closePath(); }, lin(ctx, KA, 0, KA + bw + 1, 0, [[0, rgba('#ffb35c', 0.9)], [1, rgba('#ffd28c', 0.9)]]), 0.3);
      light(ctx, KA + bw / 2, GY, 160 + bw * 0.5, C.amber, 0.35 * flick);
      for (const [x, a] of [[KA, 1], [KA + bw, ramp(t, 268.3, 268.6)]]) { ctx.strokeStyle = rgba(C.amber, 0.9 * a); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, GY - 26); ctx.lineTo(x, GY + 14); ctx.stroke(); }
    }
    // fan of takeoff curves left behind as the knee slides
    if (t > 268.25) for (let k = 0; k <= 8; k++) { const f = k / 8; if (f > slide + 0.001) break; const pts = tcurve(lerp(KA, KB, f)); drawCurve(ctx, pts, 1, k % 4 === 0 ? C.amber : '#ffcf98', 1.6, 0.22 + 0.1 * (k % 4 === 0)); }
    // the main curve: drawn by a pen, then its knee slides right
    if (pen > 0) {
      const xk = lerp(KA, KB, slide), pts = tcurve(xk), tip = drawCurve(ctx, pts, pen, C.amber, 3.4, 0.95);
      if (pen < 1) { light(ctx, tip[0], tip[1], 26, '#ffe6b8', 0.9); light(ctx, tip[0], tip[1], 90, C.amber, 0.4); }
      // the knee: where it takes off
      const ki = pts.findIndex(p => p[1] < GY - 70); if (ki > 0 && pen > 0.6) light(ctx, pts[ki][0], pts[ki][1], 60, C.amber, 0.5 * flick * ramp(t, 266.6, 267.1));
    }
    // their more careful model: a softer dashed curve that settles at 2030
    if (careful > 0) {
      const pts = tcurve(KC, 0.8);
      ctx.lineDashOffset = -t * 30;
      const tip = drawCurve(ctx, pts, careful, C.cyan, 2.6, 0.8, [14, 10]);
      if (careful < 1) light(ctx, tip[0], tip[1], 60, C.cyan, 0.5);
      // marker on the ground at 2030
      const my = GY - 90 * (1 - out((t - 273.6) / 0.5));
      if (t > 273.6) { ctx.save(); ctx.globalAlpha = ramp(t, 273.6, 273.8); grainFill(ctx, c => { c.moveTo(KC, my + 4); c.lineTo(KC - 16, my - 26); c.quadraticCurveTo(KC, my - 50, KC + 16, my - 26); c.closePath(); }, lin(ctx, KC, my - 50, KC, my, [[0, C.cyanW], [1, C.cyanD]]), 0.25); ctx.restore();
        light(ctx, KC, GY, 120 + 200 * pulse, C.cyan, 0.3 + 0.6 * pulse);
        if (pulse > 0.02) glowStroke(ctx, c => c.ellipse(KC, GY, 40 + 260 * (1 - pulse), 8 + 50 * (1 - pulse), 0, 0, 7), C.cyan, 2, pulse); }
    }
  });
  // the person standing at "now", looking down the line
  layer(0.8, () => {
    const br = Math.sin(t * 1.7), look = ramp(t, 266.4, 267.6) * 0.4 + ramp(t, 272.4, 273.8) * 0.3;
    const x = 238, s = 0.62;
    ctx.fillStyle = 'rgba(4,4,16,0.5)'; ctx.beginPath(); ctx.ellipse(x + 30, GY + 2, 50, 6, 0, 0, 7); ctx.fill();
    light(ctx, x, GY - 60, 160, C.amber, 0.18);
    figure(ctx, { x, y: GY - 150 * s, s, facing: 'back', br, turn: 0.45 + look, tilt: -0.05 - 0.1 * ramp(t, 266.0, 267.0) + 0.06 * Math.sin(t * 0.6), lx: 1, grain: 0.35,
      rim: C.cyan, rimA: 0.5, pal: ['#ffb35c', '#c9702e', '#5a2a12'],
      legs: [{ a1: Math.PI / 2 + 0.06, a2: Math.PI / 2 + 0.04 }, { a1: Math.PI / 2 - 0.06, a2: Math.PI / 2 - 0.03 }],
      arms: [{ a1: Math.PI / 2 + 0.12, a2: Math.PI / 2 + 0.05 + 0.03 * br }, { a1: Math.PI / 2 - 0.12, a2: Math.PI / 2 - 0.05 }] });
    tag(ctx, 'NOW', x, GY + 104, ramp(t, 264.9, 265.4), { size: 20, color: C.lav });
  });
  label(ctx, t, 268.4, T1 + 0.5, 'Late 2027 to mid 2029', 'takeoff in their story', 640, 806);
  label(ctx, t, 272.3, T1 + 0.5, 'Closer to 2030', 'their more careful model', 1420, 806, { color: C.cyan });
}

module.exports = { T0, T1, draw };
