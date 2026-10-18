// "Even Anthropic says AI improving itself 'is not inevitable.'"
// A cyan ring: a bright pulse races round it, lap after lap, and every lap the ring grows a little brighter
// (AI improving itself). On "not inevitable" the ring opens: a gap appears, the pulse slips out through it and
// slows to a drift. Below, the quote card: serif quote, Anthropic as the source.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, clamp } = L;
const { grainFill, motes } = require('./s_k2_studio');

const T0 = 128.15, T1 = 133.45;
const T_SRC = 128.68, T_Q = 131.28, T_NOT = 131.6, T_INEV = 131.84;
const R = { x: 960, y: 350, r: 210 };
const DUST = (() => { const r = rng(4242); return Array.from({ length: 70 }, () => [r(), r(), r()]); })();

// angle of the pulse: accelerating laps until "not", then it leaves along the tangent
function pulseAng(t) { const u = Math.max(0, t - T0); return -Math.PI / 2 + u * 2.2 + u * u * 0.32; }

function draw(ctx, t) {
  const z = lerp(1.0, 1.05, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 9) * 5, dy = drift(t, 1, 10) * 4;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H / 2 + dy);
  grainFill(ctx, c => c.rect(-200, -200, W + 400, H + 400), rad(ctx, R.x, R.y + 80, 60, 1300, [[0, '#1c1a4a'], [0.45, '#100f30'], [1, '#05061a']]), 0.5);
  const open = ramp(t, T_NOT - 0.05, T_INEV + 0.5);
  const laps = Math.max(0, (pulseAng(Math.min(t, T_NOT)) + Math.PI / 2) / (Math.PI * 2));
  const bright = clamp(0.6 + laps * 0.08, 0, 1) * (1 - 0.35 * open);
  light(ctx, R.x, R.y, 520, C.cyanD, 0.35 * bright);

  // the ring, drawn as arcs so a gap can open at the lower right
  const gapC = 0.55, gap = 0.75 * ease(open);                     // gap centre (rad) and half-width
  const segs = gap > 0.001 ? [[gapC + gap, gapC + Math.PI * 2 - gap]] : [[0, Math.PI * 2]];
  // the two loose ends ease outward a little as the ring opens
  for (const [a0, a1] of segs) {
    for (const [wid, col, al] of [[44, C.cyan, 0.10], [18, C.cyan, 0.28], [7, C.cyanW, 1.0]]) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(col, al * bright); ctx.lineWidth = wid; ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) { const a = lerp(a0, a1, i / 120), d = Math.min(Math.abs(a - a0), Math.abs(a1 - a)), lift = open * 26 * Math.exp(-d * 2.2);
        const rr = R.r + lift + 3 * Math.sin(a * 5 + t * 2); const x = R.x + Math.cos(a) * rr, y = R.y + Math.sin(a) * rr; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.restore();
    }
  }
  // inner faint rings: earlier versions, each lap leaves one
  for (let k = 1; k <= Math.min(5, Math.floor(laps)); k++) {
    ctx.strokeStyle = rgba(C.cyan, 0.08 * (1 - open * 0.5)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(R.x, R.y, R.r - 18 * k, 0, Math.PI * 2); ctx.stroke();
  }
  // the pulse: on the ring until "not", then out through the gap on a tangent, slowing
  let px, py, trail = [];
  if (t < T_NOT) {
    const a = pulseAng(t); px = R.x + Math.cos(a) * R.r; py = R.y + Math.sin(a) * R.r;
    for (let i = 1; i <= 14; i++) { const b = pulseAng(t - i * 0.02); trail.push([R.x + Math.cos(b) * R.r, R.y + Math.sin(b) * R.r]); }
  } else {
    // it leaves through the gap, outward and up, slowing to a drift
    const a = gapC, ex = R.x + Math.cos(a) * R.r, ey = R.y + Math.sin(a) * R.r;
    const at = tt => { const u = Math.max(0, tt - T_NOT), d = 640 * (1 - Math.exp(-u * 1.4)); return [ex + Math.cos(a) * d * 0.95 + Math.sin(tt * 1.3) * 5 * Math.min(1, u), ey + Math.sin(a) * d * 0.4 - d * d * 0.0009]; };
    [px, py] = at(t);
    for (let i = 1; i <= 14; i++) trail.push(at(t - i * 0.025));
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  let prev = [px, py]; trail.forEach((p, i) => { ctx.strokeStyle = rgba(C.cyanW, 0.5 * (1 - i / 14)); ctx.lineWidth = 9 * (1 - i / 14) + 1; ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); prev = p; });
  ctx.restore();
  light(ctx, px, py, 90, C.cyanW, 0.8); light(ctx, px, py, 26, '#ffffff', 0.9);
  motes(ctx, t, DUST, 120, 0, 1680, 1000, C.cyanW, 0.3);

  // the quote card
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 24;
  const words = [['“is', T_Q], ['not', T_NOT], ['inevitable.”', T_INEV]];
  ctx.font = '124px "Instrument Serif"';
  const widths = words.map(([w]) => ctx.measureText(w + ' ').width), total = widths.reduce((a, b) => a + b, 0) - ctx.measureText(' ').width;
  let x = W / 2 - total / 2; ctx.textAlign = 'left';
  words.forEach(([w, tw], i) => {
    const a = ramp(t, tw - 0.08, tw + 0.35), rise = (1 - out((t - tw + 0.08) / 0.6)) * 22;
    ctx.globalAlpha = a; ctx.fillStyle = i === 1 ? '#ffffff' : C.cream; ctx.fillText(w, x, 770 + rise); x += widths[i];
  });
  // the source, shown first so we know whose words are coming
  const sa = ramp(t, T_SRC, T_SRC + 0.6), sr = (1 - out((t - T_SRC) / 0.9)) * 12;
  ctx.globalAlpha = sa; ctx.textAlign = 'center';
  ctx.strokeStyle = C.amber; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 28, 820 + sr); ctx.lineTo(W / 2 + 28, 820 + sr); ctx.stroke();
  ctx.font = '28px "Inter SemiBold"'; ctx.letterSpacing = '8px'; ctx.fillStyle = C.lav; ctx.fillText('ANTHROPIC', W / 2 + 4, 868 + sr);
  ctx.letterSpacing = '0px'; ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  ctx.restore();
}

module.exports = { T0, T1, draw };
