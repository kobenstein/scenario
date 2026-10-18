// "Hugging Face spotted it. OpenAI went public."
// Close on the warm building. A lamp on its roof swings its beam across the ground and, on "spotted", locks onto
// the cyan tendril at the foot of the building: it stops dead, ringed in amber light. On "OpenAI", a sheet of
// paper unfolds in front of everything: a public report with a little drawing of the box and the line that got out.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, label, out, ease } = L;
const { grainFill, roundRect, glowStroke, cam } = require('./s_k5_race');
const { world, tendril, ROUTES, HF } = require('./s_k5_escape');

const T0 = 304.8, T1 = 309.1;
const LAMP = [HF.x + HF.w / 2, HF.y - HF.h - 96];

function paper(ctx, t) {
  const u = ease((t - 307.35) / 0.8); if (u <= 0) return;
  const cx = 1060, cy = 470, PW = 640, PH = 600;
  ctx.save(); ctx.translate(cx, cy + (1 - u) * 80); ctx.rotate(-0.04 + 0.01 * Math.sin(t * 0.8));
  // shadow
  ctx.fillStyle = `rgba(4,4,16,${0.45 * u})`; ctx.beginPath(); roundRect(ctx, -PW / 2 + 18, -PH / 2 + 26, PW, PH, 6); ctx.fill();
  // three folded panels open like a letter: middle first, then the outer two swing open
  const panels = [[-1, ease((t - 307.55) / 0.55)], [0, 1], [1, ease((t - 307.7) / 0.55)]];
  const pw = PW / 3;
  for (const [k, o] of panels) {
    const sx = k === 0 ? u : o, x0 = k === 0 ? -pw / 2 : k < 0 ? -pw / 2 - pw * sx : pw / 2;
    if (sx <= 0.01) continue;
    const shade = k === 0 ? 0 : (1 - sx) * 0.4;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -PH / 2, pw * sx, PH); ctx.clip();
    grainFill(ctx, c => c.rect(x0, -PH / 2, pw * sx, PH), lin(ctx, 0, -PH / 2, 0, PH / 2, [[0, '#f8f4e8'], [1, '#d9d2c2']]), 0.25);
    // content, compressed with the fold
    ctx.translate(x0, 0); ctx.scale(sx, 1); ctx.translate(-(k === 0 ? -pw / 2 : k < 0 ? -pw * 1.5 : pw / 2), 0);
    ctx.fillStyle = '#1a1830';
    if (k === -1) { ctx.font = '44px "Instrument Serif"'; ctx.textBaseline = 'top'; ctx.fillText('OpenAI', -PW / 2 + 40, -PH / 2 + 40); }
    const rr = rng(9 + k);
    for (let i = 0; i < 12; i++) { const y = -PH / 2 + 130 + i * 32, w = pw - 50 - rr() * 60; if (k === 0 && i > 1 && i < 8) continue; ctx.fillStyle = 'rgba(26,24,48,0.55)'; ctx.fillRect(x0Of(k, pw) + 22, y, w, 8); }
    if (k === 0) {
      // the figure: a box, and a line that left it
      ctx.strokeStyle = '#0a6f8c'; ctx.lineWidth = 3; ctx.strokeRect(-70, -110, 110, 90); ctx.beginPath(); ctx.moveTo(-30, -110); ctx.lineTo(-10, -130); ctx.lineTo(100, -130); ctx.lineTo(80, -110); ctx.moveTo(40, -110); ctx.lineTo(100, -130); ctx.moveTo(40, -20); ctx.lineTo(100, -40); ctx.lineTo(100, -130); ctx.stroke();
      ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(40, -60); ctx.bezierCurveTo(120, -50, 110, 20, 100 + 0, 40); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#c9702e'; ctx.beginPath(); ctx.arc(100, 40, 7, 0, 7); ctx.fill();
    }
    ctx.restore();
    if (shade > 0) { ctx.fillStyle = `rgba(40,30,60,${shade})`; ctx.fillRect(x0, -PH / 2, pw * sx, PH); }
  }
  // the fold creases
  ctx.strokeStyle = 'rgba(120,110,140,0.35)'; ctx.lineWidth = 1.5; for (const x of [-pw / 2, pw / 2]) { ctx.beginPath(); ctx.moveTo(x, -PH / 2); ctx.lineTo(x, PH / 2); ctx.stroke(); }
  ctx.restore();
  light(ctx, cx, cy, 520, '#fff2dc', 0.10 * u);
}
const x0Of = (k, pw) => k === 0 ? -pw / 2 : k < 0 ? -pw * 1.5 : pw / 2;

function draw(ctx, t) {
  const k = sm((t - T0) / (T1 - T0));
  const caught = ramp(t, 306.25, 306.45), dimPaper = ramp(t, 307.3, 307.9);
  const r = ROUTES[4];
  // the beam: sweeps left and right, then swings down onto the tendril on "spotted"
  const target = r.pts[2];                                   // the tendril sits on the cable near the building
  const sweep = -0.9 + 0.55 * Math.sin((t - 304.8) * 1.6);
  const aim = Math.atan2(target[1] - LAMP[1], target[0] - LAMP[0]);
  const ang = lerp(Math.PI / 2 + sweep, aim, ease((t - 305.75) / 0.6));
  world(ctx, t, { camX: lerp(2350, 2420, k), z: lerp(1.2, 1.28, k), fy: 600, hfGlow: 1 - caught, dim: 1,
    tend: c => {
      // the other tendrils, quiet now
      ROUTES.slice(0, 4).forEach((q, i) => tendril(c, q.pts, 1, t, i, 0.45));
      // the one at Hugging Face: pulled back to the foot of the building, then held in the light
      const u = lerp(1, 0.78, ramp(t, 304.8, 305.8));
      const hp = tendril(c, r.pts, u, t, 4, 1, caught);
      if (caught > 0 && hp) { const pulse = Math.exp(-(t - 306.3) * 2) * (t > 306.3);
        glowStroke(c, cc => cc.ellipse(hp[0], hp[1], 60 + 50 * pulse, 30 + 25 * pulse, 0, 0, 7), C.amber, 2.5, caught * (0.7 + 0.3 * pulse)); light(c, hp[0], hp[1], 120, C.amber, 0.4 * caught); }
    },
    over: (c) => {
      // the lamp housing on the roof and its beam
      c.fillStyle = '#1a0d06'; c.fillRect(LAMP[0] - 10, LAMP[1], 20, 50);
      grainFill(c, cc => roundRect(cc, LAMP[0] - 22, LAMP[1] - 26, 44, 30, 8), '#2a1a12', 0.4);
      const len = 900, half = 0.11;
      c.save(); c.globalCompositeOperation = 'lighter';
      c.fillStyle = rad(c, LAMP[0], LAMP[1], 0, len, [[0, rgba('#ffe6b8', 0.5)], [0.6, rgba('#ffb35c', 0.16)], [1, 'rgba(255,179,92,0)']]);
      c.beginPath(); c.moveTo(LAMP[0], LAMP[1] - 10); c.lineTo(LAMP[0] + Math.cos(ang - half) * len, LAMP[1] - 10 + Math.sin(ang - half) * len); c.lineTo(LAMP[0] + Math.cos(ang + half) * len, LAMP[1] - 10 + Math.sin(ang + half) * len); c.closePath(); c.fill();
      c.restore();
      light(c, LAMP[0], LAMP[1] - 10, 90, '#fff2dc', 0.9);
    } });
  // the world dims behind the report
  if (dimPaper > 0) { ctx.fillStyle = `rgba(6,6,20,${0.5 * dimPaper})`; ctx.fillRect(0, 0, W, H); }
  paper(ctx, t);
  label(ctx, t, 307.9, T1 + 0.5, 'Public disclosure', 'OpenAI went public', 110, 600);
}

module.exports = { T0, T1, draw };
