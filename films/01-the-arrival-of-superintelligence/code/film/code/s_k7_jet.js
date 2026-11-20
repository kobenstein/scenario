// "Aviation went through the same thing. In 1974, a jet crashed into a mountain near Washington."
// Night over cloud. A 1970s trijet, cabin windows warm, beacon blinking, descends through the murk toward a dark
// ridge. It slips into a cloud bank in front of the ridge and its lights fade. Nothing more is shown.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, out, clamp, ease } = L;
const { gf, cached, rr, cap } = K;

const T0 = 466.40, T1 = 473.75;
const jx = t => -330 + 230 * (t - T0), jy = t => 330 + 170 * sm((t - T0) / (T1 - T0)) + 6 * Math.sin(t * 1.3);
const INTO = 470.6;

function jet(ctx, t, a) {
  // Boeing-727-like silhouette, side view facing right
  ctx.save(); ctx.globalAlpha = a; ctx.rotate(0.06);
  const body = c => { c.moveTo(-190, -10); c.lineTo(150, -16); c.bezierCurveTo(190, -16, 214, -6, 220, 6); c.bezierCurveTo(206, 16, 180, 18, 150, 18); c.lineTo(-170, 16); c.quadraticCurveTo(-200, 12, -205, 0); c.closePath(); };
  gf(ctx, body, lin(ctx, 0, -18, 0, 18, [[0, '#3a3a6e'], [0.5, '#22224e'], [1, '#0e0e2a']]), 0.4, [-220, -30, 450, 60]);
  // T-tail and fin
  gf(ctx, c => { c.moveTo(-150, -12); c.lineTo(-205, -92); c.lineTo(-178, -94); c.lineTo(-110, -14); c.closePath(); }, '#1e1e48', 0.4, [-220, -100, 120, 90]);
  gf(ctx, c => { c.moveTo(-222, -92); c.lineTo(-160, -98); c.lineTo(-170, -88); c.closePath(); }, '#2a2a5a', 0, null);
  // rear engines
  gf(ctx, c => rr(c, -170, -26, 64, 18, 8), '#2a2a5a', 0.3, [-175, -30, 75, 25]);
  // wing (swept, seen slightly from below)
  gf(ctx, c => { c.moveTo(10, 8); c.lineTo(-70, 40); c.lineTo(-50, 42); c.lineTo(40, 12); c.closePath(); }, '#141438', 0.3, [-80, 0, 130, 50]);
  // cabin windows: warm, people aboard
  for (let i = 0; i < 26; i++) { ctx.fillStyle = rgba('#ffd28c', 0.75 + 0.2 * Math.sin(i * 3)); ctx.fillRect(-150 + i * 11.5, -4, 4, 5); }
  ctx.fillStyle = 'rgba(255,226,170,0.8)'; ctx.fillRect(182, -6, 14, 5);
  ctx.restore();
  // lights: blinking beacon, white strobe at the tail
  const bk = Math.sin(t * 6) > 0.6 ? 1 : 0.15, st = (t * 1.1) % 1 < 0.06 ? 1 : 0;
  light(ctx, 0, -20, 50, '#ffb35c', 0.8 * bk * a);
  light(ctx, -210, -96, 40, '#ffffff', 0.9 * st * a);
  light(ctx, 30, 0, 260, '#ffd28c', 0.12 * a);
}
// soft stratus: a stretched radial gradient, never a hard edge
function band(ctx, x, y, w, h, col, a) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, h / w);
  ctx.fillStyle = rad(ctx, 0, 0, 0, w, [[0, rgba(col, a)], [0.5, rgba(col, a * 0.6)], [1, rgba(col, 0)]]); ctx.fillRect(-w, -w, 2 * w, 2 * w); ctx.restore();
}
const BANDS = (() => { const r = rng(14), a = []; for (let i = 0; i < 16; i++) a.push({ x: r() * 2600 - 300, y: 180 + r() * 520, w: 400 + r() * 700, h: 30 + r() * 50, v: 6 + r() * 16, a: 0.10 + r() * 0.16, c: r() < 0.5 ? '#6a5a9a' : '#4a3e80' }); return a; })();
const MIST = (() => { const r = rng(15), a = []; for (let i = 0; i < 9; i++) a.push({ x: 820 + r() * 800, y: 500 + r() * 160, w: 220 + r() * 300, h: 40 + r() * 60, v: 4 + r() * 8, a: 0.22 + r() * 0.2 }); return a; })();
function mountainArt(c) {
  // far range, lighter
  gf(c, cc => { cc.moveTo(-200, 1100); cc.lineTo(-200, 760); for (let x = -200; x <= 2200; x += 60) cc.lineTo(x, 740 - 70 * Math.sin(x * 0.004) - 30 * Math.sin(x * 0.013)); cc.lineTo(2200, 1100); cc.closePath(); }, lin(c, 0, 650, 0, 1100, [[0, '#2a2458'], [1, '#100e2a']]), 0.5);
  // the mountain
  c.save(); c.translate(-330, 0);
  gf(c, cc => { cc.moveTo(700, 1100); cc.lineTo(900, 900); cc.quadraticCurveTo(1150, 640, 1380, 470); cc.lineTo(1480, 410); cc.quadraticCurveTo(1560, 370, 1640, 400); cc.lineTo(1800, 450); cc.quadraticCurveTo(1950, 500, 2200, 520); cc.lineTo(2600, 560); cc.lineTo(2600, 1100); cc.closePath(); },
    lin(c, 1300, 380, 1700, 1000, [[0, '#1a1840'], [1, '#05051a']]), 0.6);
  c.fillStyle = '#04041a'; const r = rng(4);
  for (let x = 960; x < 2500; x += 12 + r() * 22) { const y = x < 1480 ? lerp(840, 410, (x - 960) / 520) : x < 1640 ? 400 + (x - 1560) * (x > 1560 ? 0.1 : -0.3) : lerp(400, 510, (x - 1640) / 510); const h = 18 + r() * 22; c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + 7, y + 6); c.lineTo(x - 7, y + 6); c.fill(); }
  c.restore();
}

function draw(ctx, t) {
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.08, cx: 1200, cy: 500, px: t => 120 * sm((t - T0) / (T1 - T0)), seed: 91 });
  K.sky(ctx, [[0, '#05061a'], [0.5, '#16143e'], [0.75, '#3a2c66'], [1, '#1a1640']]);
  layer(0.15, () => { K.stars(ctx, t, 0.6, 380); light(ctx, 1250, 330, 900, '#8a6ab0', 0.26); band(ctx, 1200, 420, 1300, 90, '#9a86c8', 0.22); });
  layer(0.5, () => { for (const b of BANDS) { if (b.y > 450) continue; band(ctx, ((b.x + t * b.v) % 2800) - 300, b.y, b.w, b.h, b.c, b.a); } });
  layer(1, () => {
    cached(ctx, 'k7mtn', -200, 360, 2200, 1100, mountainArt, 0.6);
    const a = 1 - ramp(t, INTO, INTO + 1.0);
    const x = jx(t), y = jy(t);
    if (a > 0) {
      // landing lights reach ahead through the murk: the brightest thing on screen
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x + 280, y + 22); ctx.rotate(0.12);
      for (const [sp, al] of [[0.06, 0.22], [0.12, 0.14], [0.2, 0.08]]) {
        ctx.fillStyle = lin(ctx, 0, 0, 640, 0, [[0, rgba('#ffe2a8', al * a)], [1, rgba('#ffe2a8', 0)]]);
        ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(640, -640 * sp); ctx.lineTo(640, 640 * sp); ctx.lineTo(0, 4); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.translate(x, y); ctx.scale(1.3, 1.3); jet(ctx, t, a); ctx.restore();
      light(ctx, x + 280, y + 20, 60, '#ffffff', 0.7 * a);
    }
    // mist hugging the mountain's flank; the jet goes into it
    for (const m of MIST) band(ctx, m.x + Math.sin(t * 0.2 + m.v) * 40 + t * m.v - 470 * m.v, m.y, m.w, m.h, '#7a6aaa', m.a);
    const inside = ramp(t, INTO - 0.2, INTO + 0.4) * (1 - ramp(t, INTO + 0.8, INTO + 1.8));
    light(ctx, jx(Math.min(t, INTO + 0.8)) + 200, jy(Math.min(t, INTO + 0.8)), 220, '#ffd28c', 0.16 * inside);
    for (const b of BANDS) { if (b.y <= 450) continue; band(ctx, ((b.x + t * b.v * 1.4) % 2800) - 300, b.y + 120, b.w, b.h, b.c, b.a * 1.3); }
  });
  L.stamp(ctx, t, 469.3, T1, '1974', 'a jet flies into a mountain', { size: 130 });
  K.caption(ctx, t, 472.6, T1, 'near Washington, D.C.', 100, 270, { font: '28px "Inter Medium"', color: C.lav, ls: '2px' });
}

module.exports = { T0, T1, draw, jet, band, mountainArt };
