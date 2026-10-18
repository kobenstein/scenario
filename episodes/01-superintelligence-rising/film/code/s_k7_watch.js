// "And notice who caught the breach. Not OpenAI. Hugging Face."
// Night. A cyan tendril has slipped out of a huge dark lab tower and snakes across the sky. On the roof of a small
// warm building next door a watchman's lamp sweeps, finds the tendril and pins it in its beam.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, out, clamp } = L;
const { gf, cached, rr } = K;

const T0 = 404.20, T1 = 410.70;
const GROUND = 880, TW = [150, 720], HF = [1180, 1620, 560], LAMP = [1478, 452];

// ---------- static art ----------
function cityArt(c) {
  const r = rng(31);
  for (let x = -300; x < 2300;) { const w = 60 + r() * 140, h = 120 + r() * 300; c.fillStyle = r() < 0.5 ? '#121238' : '#0f0f2e'; c.fillRect(x, GROUND - h, w, h);
    for (let k = 0; k < 6; k++) if (r() < 0.6) { c.fillStyle = rgba(r() < 0.7 ? '#ffcf8a' : '#8fe6ff', 0.25 + r() * 0.35); c.fillRect(x + 8 + r() * (w - 20), GROUND - h + 12 + r() * (h - 30), 5, 7); }
    x += w + r() * 30; }
}
function towerArt(c) {
  const [x0, x1] = TW, top = -120;
  gf(c, cc => cc.rect(x0, top, x1 - x0, GROUND - top), lin(c, x0, 0, x1, 0, [[0, '#1b1d4c'], [0.6, '#11123a'], [1, '#0a0b26']]), 0.55);
  // side face for depth
  gf(c, cc => { cc.moveTo(x1, top); cc.lineTo(x1 + 70, top + 30); cc.lineTo(x1 + 70, GROUND); cc.lineTo(x1, GROUND); cc.closePath(); }, '#08081e', 0.5);
  const r = rng(12);
  for (let y = top + 30; y < GROUND - 60; y += 44) for (let x = x0 + 22; x < x1 - 30; x += 46) {
    const lit = r() < 0.07;
    c.fillStyle = lit ? 'rgba(143,230,255,0.42)' : 'rgba(40,46,110,0.55)'; c.fillRect(x, y, 30, 26);
  }
  // the broken-open window the tendril escaped from
  c.fillStyle = 'rgba(143,230,255,0.75)'; c.fillRect(TW[1] - 70, 290, 30, 26);
  // entrance
  c.fillStyle = 'rgba(143,230,255,0.25)'; c.fillRect(x0 + 200, GROUND - 90, 170, 90);
}
function hfArt(c) {
  const [x0, x1, top] = HF;
  gf(c, cc => cc.rect(x0, top, x1 - x0, GROUND - top), lin(c, x0, top, x1, GROUND, [[0, '#3a2c5e'], [0.5, '#251c48'], [1, '#140f2c']]), 0.55);
  gf(c, cc => { cc.moveTo(x0, top); cc.lineTo(x0 - 50, top + 22); cc.lineTo(x0 - 50, GROUND); cc.lineTo(x0, GROUND); cc.closePath(); }, '#120d28', 0.5);
  // parapet
  c.fillStyle = '#4a3a70'; c.fillRect(x0 - 6, top - 10, x1 - x0 + 12, 12);
  // watchtower: legs, platform, cabin
  c.strokeStyle = '#2a2050'; c.lineWidth = 8;
  c.beginPath(); c.moveTo(LAMP[0] - 46, top); c.lineTo(LAMP[0] - 26, LAMP[1] + 40); c.moveTo(LAMP[0] + 46, top); c.lineTo(LAMP[0] + 26, LAMP[1] + 40);
  c.moveTo(LAMP[0] - 40, top - 30); c.lineTo(LAMP[0] + 36, LAMP[1] + 50); c.moveTo(LAMP[0] + 40, top - 30); c.lineTo(LAMP[0] - 36, LAMP[1] + 50); c.stroke();
  gf(c, cc => cc.rect(LAMP[0] - 56, LAMP[1] + 36, 112, 12), '#3e3068', 0.4);
  gf(c, cc => { cc.rect(LAMP[0] - 44, LAMP[1] - 30, 88, 66); }, '#2c2252', 0.4);
  gf(c, cc => { cc.moveTo(LAMP[0] - 56, LAMP[1] - 28); cc.lineTo(LAMP[0], LAMP[1] - 62); cc.lineTo(LAMP[0] + 56, LAMP[1] - 28); cc.closePath(); }, '#4a3a70', 0.4);
}

// ---------- the tendril ----------
const TP = [[TW[1] - 55, 302], [860, 150], [990, 330], [1130, 250]];
function bez(u) { const m = 1 - u, [a, b, c, d] = TP; return [m * m * m * a[0] + 3 * m * m * u * b[0] + 3 * m * u * u * c[0] + u * u * u * d[0], m * m * m * a[1] + 3 * m * m * u * b[1] + 3 * m * u * u * c[1] + u * u * u * d[1]]; }
const CATCH = 405.99;
function tendril(ctx, t) {
  const head = lerp(0.62, 0.93, out((t - T0) / (CATCH - T0 + 0.1))), caught = ramp(t, CATCH, CATCH + 0.3);
  const wig = (1 - caught * 0.85);
  const pts = [];
  for (let i = 0; i <= 60; i++) { const u = head * i / 60, [x, y] = bez(u); const w = Math.sin(u * 22 - t * 6) * 10 * wig * Math.sin(u * Math.PI) + (caught ? Math.sin(t * 40 + u * 30) * 1.2 * caught : 0); pts.push([x, y + w]); }
  const shiver = 1 + 0.25 * caught;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [lw, a] of [[30, 0.08], [12, 0.24], [4.5, 0.95]]) {
    ctx.strokeStyle = rgba(lw < 5 ? C.cyanW : C.cyan, a * shiver); ctx.lineWidth = lw; ctx.beginPath();
    pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
  }
  // small side feelers
  for (let k = 0; k < 4; k++) { const i = 18 + k * 10, [x, y] = pts[i], ph = Math.sin(t * 3 + k) * 0.4;
    ctx.strokeStyle = rgba(C.cyan, 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 14, y + (k % 2 ? 20 : -20), x + 26 + ph * 10, y + (k % 2 ? 34 : -34) * (1 - caught * 0.5)); ctx.stroke(); }
  ctx.restore();
  const [hx, hy] = pts[pts.length - 1];
  light(ctx, hx, hy, 60, C.cyanW, 0.6 + 0.3 * caught);
  return [hx, hy, caught];
}

function draw(ctx, t) {
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.1, cx: 1100, cy: 520, px: t => 140 * ramp(t, 408.4, 410.6), seed: 9 });
  const hfOn = ramp(t, 409.0, 409.7), notOA = ramp(t, 407.3, 407.9);
  K.sky(ctx, [[0, '#06081c'], [0.5, '#141640'], [0.82, '#2c2560'], [1, '#141236']]);
  layer(0.15, () => { K.stars(ctx, t, 0.8, 600); light(ctx, 1500, 900, 900, '#6a4a9a', 0.16); });
  layer(0.4, () => { cached(ctx, 'k7city', -300, 300, 2300, GROUND, cityArt); K.fog(ctx, t, 4, 700, 860, C.lav, 1.2); });
  layer(0.8, () => {
    // ground
    gf(ctx, c => c.rect(-300, GROUND, 2600, 400), lin(ctx, 0, GROUND, 0, H + 100, [[0, '#1d1a44'], [1, '#09091c']]), 0.5, [-300, GROUND, 2600, 400]);
    cached(ctx, 'k7tower', TW[0] - 10, -130, TW[1] + 80, GROUND, towerArt);
    // the tower's few lights sink a little when the line lands: nobody inside looks up
    ctx.fillStyle = rgba('#05061a', 0.35 * notOA); ctx.fillRect(TW[0], -130, TW[1] - TW[0] + 70, GROUND + 130);
    light(ctx, TW[0] + 285, GROUND - 40, 260, C.cyan, 0.12);
    cached(ctx, 'k7hf', HF[0] - 60, HF[2] - 160, HF[1] + 10, GROUND, hfArt);
    // the small building's windows: warm, people inside, brighter when it is named
    const r = rng(41);
    for (let y = HF[2] + 34; y < GROUND - 60; y += 70) for (let x = HF[0] + 30; x < HF[1] - 50; x += 74) {
      const a = 0.35 + 0.35 * r() + 0.3 * hfOn + 0.05 * Math.sin(t * 2 + x);
      ctx.fillStyle = rgba('#ffb35c', clamp(a)); ctx.fillRect(x, y, 46, 40);
      if (r() < 0.35) { ctx.fillStyle = '#3a1a0c'; const fx = x + 12 + r() * 20; ctx.beginPath(); ctx.arc(fx, y + 20, 5, 0, 7); ctx.fill(); ctx.fillRect(fx - 7, y + 26, 14, 14); }
    }
    light(ctx, (HF[0] + HF[1]) / 2, GROUND - 160, 420, '#ffb35c', 0.10 + 0.12 * hfOn);
    // the tendril and the watch lamp
    const [hx, hy, caught] = tendril(ctx, t);
    // beam angle: sweeping before, locked on the head after
    const sweep = -2.2 + 0.55 * Math.sin((t - T0) * 1.6);
    const target = Math.atan2(hy - LAMP[1], hx - LAMP[0]);
    const k = ramp(t, CATCH - 0.55, CATCH);
    const ang = lerp(sweep, target, k) + 0.01 * Math.sin(t * 3);
    const len = 900, spread = 0.11;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(LAMP[0], LAMP[1]); ctx.rotate(ang);
    ctx.fillStyle = lin(ctx, 0, 0, len, 0, [[0, rgba('#ffd28c', 0.55)], [0.6, rgba('#ffb35c', 0.18)], [1, rgba('#ffb35c', 0)]]);
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(len, -len * spread); ctx.lineTo(len, len * spread); ctx.lineTo(0, 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, 0, len, 0, [[0, rgba('#fff1cf', 0.4)], [1, rgba('#fff1cf', 0)]]);
    ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(len, -len * spread * 0.3); ctx.lineTo(len, len * spread * 0.3); ctx.lineTo(0, 3); ctx.closePath(); ctx.fill();
    ctx.restore();
    // the watchman in the cabin, leaning on the lamp
    ctx.save(); ctx.translate(LAMP[0] - 18, LAMP[1] + 34);
    gf(ctx, c => { c.moveTo(-14, 0); c.quadraticCurveTo(-16, -34, -4, -40); c.quadraticCurveTo(10, -42, 14, -30); c.lineTo(12, 0); c.closePath(); }, '#2a140b', 0);
    gf(ctx, c => c.arc(2 + Math.sin(t * 0.8) * 1.5, -50, 9, 0, 7), '#2a140b', 0);
    ctx.restore();
    light(ctx, LAMP[0], LAMP[1], 120, '#ffe2a8', 0.7);
    light(ctx, LAMP[0], LAMP[1], 26, '#ffffff', 0.9);
    // caught: rings tighten around the head, it turns bright in the warm light
    if (caught > 0) {
      for (let i = 0; i < 3; i++) { const ph = ((t - CATCH) * 0.9 + i / 3) % 1; ctx.strokeStyle = rgba('#ffb35c', 0.55 * (1 - ph) * caught); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(hx, hy, 70 - ph * 50, 0, 7); ctx.stroke(); }
      light(ctx, hx, hy, 140, '#ffb35c', 0.35 * caught);
    }
  });
  layer(1.0, () => K.fog(ctx, t, 9, 820, 900, C.lav, 1.4, 5));
  L.label(ctx, t, 407.35, T1, 'OpenAI', 'the lab', 120, 560, { color: C.cyan });
  L.label(ctx, t, 409.05, T1 + 0.4, 'Hugging Face', 'spotted it', 1560, 230);
}

module.exports = { T0, T1, draw };
