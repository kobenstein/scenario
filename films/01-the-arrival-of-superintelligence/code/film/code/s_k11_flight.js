// "Flying got about forty times safer, partly by learning from every close call."
// From high above: a calm airliner crosses a night map laced with lit routes between airports.
// "forty times safer": 40x. "every close call": here and there two lights pass too close, a rose ring flags it,
// it turns amber and feeds the network, which grows a little brighter each time. Learning, made visible.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease, stamp } = L;
const { gf, curve, glowE, camera } = require('./s_k11_poll');

const T0 = 696.65, T1 = 702.45;
const T_40 = 698.12;
const CALLS = [700.30, 700.68, 700.94, 701.26, 701.62];

const NET = (() => {
  const r = rng(698), nodes = [];
  for (let i = 0; i < 30; i++) nodes.push([-100 + r() * (W + 200), -60 + r() * (H + 120), 0.5 + r() * 0.8]);
  const edges = [];
  nodes.forEach((a, i) => {
    const near = nodes.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1])]).filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 3);
    for (const [j] of near) if (!edges.some(e => (e.a === i && e.b === j) || (e.a === j && e.b === i))) edges.push({ a: i, b: j, bend: (r() - 0.5) * 0.3, sp: 0.04 + r() * 0.05, ph: r() });
  });
  // the close calls: on given edges, at given times
  // pick edges for the close calls: spread over the frame, clear of the number (top left) and the airliner's path
  const mid = e => { const a = nodes[e.a], b = nodes[e.b]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
  const ok = edges.filter(e => { const [x, y] = mid(e); return x > 120 && x < W - 120 && y > 120 && y < 880 && !(x < 760 && y < 440) && Math.abs((y - 820) - (x - 600) * (-490 / 700)) > 160; });
  const calls = []; for (const tc of CALLS) { let best = null, bd = -1;
    for (const e of ok) { if (calls.some(c => c.e === e)) continue; const m = mid(e); const d = Math.min(...calls.map(c => Math.hypot(mid(c.e)[0] - m[0], mid(c.e)[1] - m[1])), 9999) + r() * 80; if (d > bd) { bd = d; best = e; } }
    calls.push({ tc, e: best }); }
  return { nodes, edges, calls };
})();
const COAST = [[[-200, 820], [160, 760], [380, 800], [600, 700], [760, 720], [880, 600], [1100, 560], [1240, 640], [1420, 600], [1600, 680], [1760, 640], [2100, 700]],
  [[-200, 300], [100, 260], [240, 330], [420, 280], [500, 160], [700, 120], [820, 40], [900, -100]]];

function edgePt(e, u) {
  const a = NET.nodes[e.a], b = NET.nodes[e.b], mx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * e.bend, my = (a[1] + b[1]) / 2 + (b[0] - a[0]) * e.bend;
  const v = 1 - u; return [v * v * a[0] + 2 * v * u * mx + u * u * b[0], v * v * a[1] + 2 * v * u * my + u * u * b[1]];
}

function plane(ctx, x, y, ang, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const body = c => {
    c.moveTo(130, 0); c.bezierCurveTo(130, -9, 118, -13, 100, -13); c.lineTo(20, -13);
    c.lineTo(-20, -120); c.lineTo(-42, -120); c.lineTo(-22, -13); c.lineTo(-92, -12);
    c.lineTo(-118, -52); c.lineTo(-130, -52); c.lineTo(-118, -9); c.lineTo(-126, -4); c.lineTo(-126, 4); c.lineTo(-118, 9);
    c.lineTo(-130, 52); c.lineTo(-118, 52); c.lineTo(-92, 12); c.lineTo(-22, 13); c.lineTo(-42, 120); c.lineTo(-20, 120); c.lineTo(20, 13);
    c.lineTo(100, 13); c.bezierCurveTo(118, 13, 130, 9, 130, 0); c.closePath(); };
  gf(ctx, body, lin(ctx, 0, -120, 0, 120, [[0, '#f3efe2'], [0.5, '#c8c0dc'], [1, '#6a6488']]), 0.35);
  // engines under the wings
  for (const sg of [-1, 1]) gf(ctx, c => { c.moveTo(-4, sg * 46); c.lineTo(26, sg * 46); c.quadraticCurveTo(32, sg * 52, 26, sg * 58); c.lineTo(-4, sg * 58); c.closePath(); }, '#8a84a8', 0.3);
  // windscreen and a spine highlight
  ctx.fillStyle = '#2a2a5a'; ctx.beginPath(); ctx.ellipse(112, 0, 8, 6, 0, -1.2, 1.2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(100, -5); ctx.lineTo(-90, -5); ctx.stroke();
  ctx.restore();
  // navigation lights: steady wingtips, blinking beacon
  const c = Math.cos(ang), sn = Math.sin(ang), P = (px, py) => [x + (px * c - py * sn) * s, y + (px * sn + py * c) * s];
  const lw = P(-36, -118), rw = P(-36, 118), bc = P(-10, 0);
  light(ctx, lw[0], lw[1], 26, '#ff8a8a', 0.8); light(ctx, rw[0], rw[1], 26, '#8affc0', 0.6);
  const blink = (t * 1.1) % 1 < 0.12 ? 1 : 0;
  light(ctx, bc[0], bc[1], 60, '#ffffff', 0.9 * blink);
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.08, sm((t - T0) / (T1 - T0)));
  const layer = camera(ctx, t, W / 2, H / 2, z, 51);
  let learn = 0; for (const c of NET.calls) learn += ramp(t, c.tc + 0.35, c.tc + 0.8);
  learn /= NET.calls.length;
  const safe = ramp(t, T_40, T_40 + 0.8);
  layer(0.3, () => {
    // the map: dark sea and land, coastlines faint
    ctx.fillStyle = lin(ctx, 0, 0, W, H, [[0, '#0b1030'], [1, '#141238']]); ctx.fillRect(-300, -300, W + 600, H + 600);
    gf(ctx, c => { curve(c, COAST[0]); c.lineTo(2100, 1400); c.lineTo(-200, 1400); c.closePath(); }, lin(ctx, 0, 560, 0, H, [[0, '#1d1a46'], [1, '#121032']]), 0.5);
    gf(ctx, c => { curve(c, COAST[1]); c.lineTo(-200, -200); c.closePath(); }, lin(ctx, 0, 0, 0, 330, [[0, '#121032'], [1, '#1d1a46']]), 0.5);
    gf(ctx, c => { curve(c, [[1300, 140], [1460, 90], [1640, 150], [1700, 300], [1560, 380], [1380, 330], [1300, 140]]); c.closePath(); }, '#1b1844', 0.5);
    ctx.strokeStyle = rgba('#a49fc4', 0.18); ctx.lineWidth = 2; for (const cst of COAST) { ctx.beginPath(); curve(ctx, cst); ctx.stroke(); }
    // dawn creeping in from the right
    glowE(ctx, W + 200, 300, 1100, 700, [[0, rgba('#ff9a5a', 0.16)], [1, 'rgba(255,154,90,0)']], true);
    // routes
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const e of NET.edges) {
      ctx.strokeStyle = rgba(C.amber, 0.10 + 0.12 * safe + 0.25 * learn); ctx.lineWidth = 1.5 + 1.0 * learn;
      ctx.beginPath(); for (let u = 0; u <= 1.001; u += 0.1) { const p = edgePt(e, u); if (u === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); } ctx.stroke();
      // planes moving along the routes as tiny lights
      for (const off of [0, 0.5]) { const u = (e.ph + off + t * e.sp) % 1, p = edgePt(e, u); ctx.fillStyle = rgba('#ffe0a8', 0.75); ctx.fillRect(p[0] - 1.5, p[1] - 1.5, 3, 3); }
    }
    ctx.restore();
    for (const [x, y, s] of NET.nodes) { light(ctx, x, y, 40 * s, C.amber, 0.25 + 0.2 * learn + 0.1 * safe); ctx.fillStyle = rgba('#ffe0a8', 0.9); ctx.beginPath(); ctx.arc(x, y, 3.5 * s, 0, Math.PI * 2); ctx.fill(); }
    // close calls: two lights converge, a rose ring flags it, then it turns amber and flows into the network
    for (const c of NET.calls) {
      const d = t - c.tc; if (d < -0.5 || d > 1.4) continue;
      const p = edgePt(c.e, 0.5), conv = ease(clamp((d + 0.5) / 0.5));
      for (const sg of [-1, 1]) { const q = [p[0] + sg * lerp(60, 8, conv), p[1] - sg * lerp(30, 4, conv)]; ctx.fillStyle = rgba('#ffe0a8', 1 - ramp(d, -0.05, 0.1)); ctx.beginPath(); ctx.arc(q[0], q[1], 3.5, 0, Math.PI * 2); ctx.fill(); }
      if (d > 0) {
        const k = out(d / 0.6), warm = ramp(d, 0.25, 0.6), fade = 1 - ramp(d, 0.9, 1.4);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = warm < 0.5 ? rgba('#ff6a8a', 0.9 * fade) : rgba('#ffb35c', 0.9 * fade);
        ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p[0], p[1], 14 + 46 * k, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        light(ctx, p[0], p[1], 120, warm < 0.5 ? '#ff6a8a' : C.amber, 0.5 * fade);
      }
    }
  });
  // the airliner, high above the map: its shadow far below shows the height
  const u = (t - T0) / (T1 - T0), px = lerp(560, 1340, u), py = lerp(760, 420, u) + Math.sin(u * 3) * 20, ang = Math.atan2(420 - 760, 1340 - 560) + 0.04 * Math.sin(t * 0.7);
  layer(0.45, () => { ctx.save(); ctx.globalAlpha = 0.35; ctx.translate(140, 120); ctx.filter = 'blur(6px)';
    ctx.fillStyle = '#04040f'; ctx.beginPath(); ctx.translate(px, py); ctx.rotate(ang); ctx.scale(0.62, 0.62); ctx.moveTo(130, 0); ctx.lineTo(20, -13); ctx.lineTo(-20, -120); ctx.lineTo(-42, -120); ctx.lineTo(-92, -12); ctx.lineTo(-130, -52); ctx.lineTo(-126, 0); ctx.lineTo(-130, 52); ctx.lineTo(-92, 12); ctx.lineTo(-42, 120); ctx.lineTo(-20, 120); ctx.lineTo(20, 13); ctx.closePath(); ctx.fill(); ctx.restore(); });
  layer(1.2, () => {
    // contrail: two soft streams behind the engines
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const sg of [-1, 1]) { ctx.strokeStyle = lin(ctx, px, py, px - Math.cos(ang) * 500, py - Math.sin(ang) * 500, [[0, rgba(C.cream, 0.0)], [0.15, rgba(C.cream, 0.18)], [1, rgba(C.cream, 0)]]); ctx.lineWidth = 6;
      const ox = -Math.sin(ang) * sg * 52 * 0.85, oy = Math.cos(ang) * sg * 52 * 0.85; ctx.beginPath(); ctx.moveTo(px + ox, py + oy); ctx.lineTo(px + ox - Math.cos(ang) * 520, py + oy - Math.sin(ang) * 520); ctx.stroke(); }
    ctx.restore();
    plane(ctx, px, py, ang, 0.85, t);
    light(ctx, px, py, 260, '#ffd9a0', 0.18);
  });
  stamp(ctx, t, T_40, T1 - 0.1, '40×', 'safer to fly', { size: 170 });
}

module.exports = { T0, T1, draw };
