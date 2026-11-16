// "You wouldn't be alone."
// A person leans on a balcony rail over a city before dawn, one lit window behind them.
// On "You" windows across the whole city begin to light, one by one, spreading out from them to the horizon.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out } = L;
const { gf, curve, glowE, camera, mix, pat } = require('./s_k11_poll');
const { figure } = require('./s_timeline');

const T0 = 675.15, T1 = 677.65;
const T_ON = 675.54;

// three bands of buildings; every window gets a light time from its distance to the balcony
const BLD = (() => {
  const r = rng(676), list = [];
  const bands = [{ y: 560, h: [60, 170], w: [40, 90], win: 7, col: '#1a1a44', k: 0 }, { y: 640, h: [90, 260], w: [70, 150], win: 10, col: '#151538', k: 1 }, { y: 760, h: [140, 380], w: [110, 220], win: 14, col: '#10102c', k: 2 }];
  for (const b of bands) {
    let x = -140 + r() * 40;
    while (x < W + 140) {
      const w = lerp(b.w[0], b.w[1], r()), h = lerp(b.h[0], b.h[1], r()), wins = [];
      const cols = Math.max(2, Math.floor(w / (b.win * 1.9))), rows = Math.floor(h / (b.win * 2.2));
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
        if (r() < 0.25) continue;
        const wx = x + (j + 0.5) * w / cols - b.win * 0.35, wy = b.y - h + 12 + i * b.win * 2.2;
        const d = Math.hypot(wx - 360, (wy - 700) * 1.3);
        wins.push({ x: wx, y: wy, lit0: r() < 0.06, tl: T_ON + 0.05 + d / 1500 + r() * 0.7, ph: r() * 6, warm: r() });
      }
      list.push({ x, w, h, y: b.y, col: b.col, k: b.k, wins, roof: r() });
      x += w + (r() < 0.3 ? r() * 40 : 2);
    }
  }
  return list;
})();

// a person from behind, forearms on the rail, leaning a little forward; breathes and turns their head to the city
function leaner(ctx, t, x, y, k) {
  const br = Math.sin(t * 1.6), look = lerp(-0.15, 0.5, ramp(t, 675.75, 676.7)) + 0.05 * Math.sin(t * 0.7);
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const pal = lin(ctx, -120, -230, 90, 120, [[0, '#ffb35c'], [0.45, '#c9702e'], [1, '#4a1e0c']]);
  // legs behind the balusters
  gf(ctx, c => { c.moveTo(-58, 40); c.lineTo(-52, 258); c.lineTo(-14, 258); c.lineTo(-6, 60); c.lineTo(6, 60); c.lineTo(16, 258); c.lineTo(52, 258); c.lineTo(58, 40); c.closePath(); }, lin(ctx, 0, 40, 0, 258, [[0, '#4a2412'], [1, '#1c0c08']]), 0.5);
  gf(ctx, c => { c.ellipse(-36, 258, 26, 9, 0, 0, Math.PI * 2); c.ellipse(34, 258, 26, 9, 0, 0, Math.PI * 2); }, '#140806', 0.3);
  ctx.translate(0, br * 1.2);
  // coat: shoulders hunched forward onto the rail, hem flaring
  const coat = c => { c.moveTo(-82, 110); c.bezierCurveTo(-78, 40, -86, -40, -92, -110); c.quadraticCurveTo(-86, -154, -50, -160); c.quadraticCurveTo(0, -172, 50, -160);
    c.quadraticCurveTo(86, -154, 90, -110); c.bezierCurveTo(86, -40, 78, 40, 82, 110); c.quadraticCurveTo(0, 120, -82, 110); c.closePath(); };
  ctx.save(); ctx.translate(-4, -3); gf(ctx, coat, rgba('#ffd59a', 0.9), 0); ctx.restore();
  gf(ctx, coat, pal, 0.4);
  // upper arms out to the elbows resting on the rail
  // (rounded shoulder cap at the coat's outer top edge; a shade line where the sleeve lies over the back)
  for (const sg of [-1, 1]) {
    gf(ctx, c => { c.moveTo(sg * 54, -150); c.bezierCurveTo(sg * 68, -170, sg * 104, -160, sg * 113, -118); c.quadraticCurveTo(sg * 126, -70, sg * 128, -10); c.lineTo(sg * 92, -2);
      c.quadraticCurveTo(sg * 88, -70, sg * 70, -110); c.quadraticCurveTo(sg * 60, -128, sg * 54, -150); c.closePath(); },
      lin(ctx, sg * 60, -160, sg * 120, 0, [[0, sg < 0 ? '#ffb35c' : '#d27a34'], [0.35, sg < 0 ? '#e8924a' : '#c06628'], [1, '#5a2a12']]), 0.4);
    ctx.strokeStyle = 'rgba(74,30,12,0.45)'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sg * 92, -6); ctx.quadraticCurveTo(sg * 88, -70, sg * 70, -110); ctx.quadraticCurveTo(sg * 62, -126, sg * 57, -142); ctx.stroke();
  }
  // seam and back fold
  ctx.strokeStyle = 'rgba(74,30,12,0.6)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(2, -150); ctx.bezierCurveTo(-4, -60, 6, 20, 0, 110); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-60, -40); ctx.quadraticCurveTo(-10, -20, 40, -46); ctx.stroke();
  // scarf
  gf(ctx, c => { c.moveTo(-46, -158); c.quadraticCurveTo(0, -140, 46, -158); c.quadraticCurveTo(40, -188, 0, -190); c.quadraticCurveTo(-40, -188, -46, -158); c.closePath(); },
    lin(ctx, -40, -190, 40, -150, [[0, '#2a2a5a'], [1, '#141238']]), 0.4);
  // head from behind: hair, ear on the side it turns to
  ctx.save(); ctx.translate(look * 12, -222); ctx.rotate(look * 0.12);
  const side = look > 0 ? 1 : -1;
  gf(ctx, c => c.ellipse(side * 33, 6, 7, 13, 0, 0, Math.PI * 2), '#c36a2b', 0.3);
  const head = c => c.ellipse(0, 0, 36, 42, 0, 0, Math.PI * 2);
  ctx.save(); ctx.translate(-4, -3); gf(ctx, head, rgba('#ffd59a', 0.8), 0); ctx.restore();
  gf(ctx, head, lin(ctx, -36, -40, 36, 40, [[0, '#5a2c14'], [0.5, '#2e140a'], [1, '#160806']]), 0.55);
  gf(ctx, c => { c.moveTo(-26, 28); c.quadraticCurveTo(0, 46, 26, 28); c.lineTo(20, 40); c.quadraticCurveTo(0, 50, -20, 40); c.closePath(); }, '#7a3b17', 0.3);
  ctx.restore();
  ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.04, 1.0, sm((t - T0) / (T1 - T0)));   // a slow pull back to reveal more of the city
  const layer = camera(ctx, t, 700, 600, z, 11);
  const n = ramp(t, T_ON, 677.2);
  layer(0.2, () => {
    ctx.fillStyle = lin(ctx, 0, 0, 0, 600, [[0, '#090a22'], [0.6, '#1d1a4a'], [1, '#4a3366']]); ctx.fillRect(-200, -200, W + 400, 900);
    glowE(ctx, 1300, 560, 1100, 220, [[0, rgba('#ff9a5a', 0.10 + 0.16 * n)], [1, 'rgba(255,154,90,0)']]);
  });
  for (const k of [0, 1, 2]) layer(0.3 + k * 0.25, () => {
    for (const b of BLD) {
      if (b.k !== k) continue;
      const shape = c => { c.rect(b.x, b.y - b.h, b.w, b.h + 1150 - b.y); if (b.roof < 0.2) { c.moveTo(b.x + b.w * 0.4, b.y - b.h); c.lineTo(b.x + b.w * 0.5, b.y - b.h - 30); c.lineTo(b.x + b.w * 0.6, b.y - b.h); } };
      gf(ctx, shape, lin(ctx, b.x, b.y - b.h, b.x + b.w, b.y, [[0, mix(b.col, '#3a2d5c', 0.5)], [1, b.col]]), 0);
      const ws = [6, 8, 11][k], hs = [7, 10, 14][k];
      ctx.fillStyle = 'rgba(42,42,90,0.6)'; ctx.beginPath();
      for (const w of b.wins) if (!w.lit0 && t < w.tl) ctx.rect(w.x, w.y, ws, hs);
      ctx.fill();
      for (const w of b.wins) {
        const on = w.lit0 ? 1 : out((t - w.tl) / 0.12);
        if (on <= 0) continue;
        ctx.globalAlpha = (0.3 + 0.7 * on) * (0.9 + 0.1 * Math.sin(t * 5 + w.ph));
        ctx.fillStyle = w.warm < 0.8 ? '#ffc070' : '#ffe0a8'; ctx.fillRect(w.x, w.y, ws, hs);
      }
      ctx.globalAlpha = 1;
    }
    // one speckle pass for the whole band
    ctx.save(); ctx.beginPath(); for (const b of BLD) if (b.k === k) ctx.rect(b.x, b.y - b.h - 30, b.w, b.h + 1180 - b.y); ctx.clip();
    ctx.globalAlpha = 0.45; ctx.fillStyle = pat(ctx); ctx.fillRect(-200, 100, W + 400, 1000); ctx.restore();
    // the city's combined glow rises as the windows come on
    glowE(ctx, 1000, [560, 640, 760][k] - 80, 1200, 200, [[0, rgba(C.amber, (0.03 + 0.10 * n) * (k + 1) / 2)], [1, 'rgba(255,179,92,0)']], true);
  });
  // the balcony: a wall with a lit window behind the figure, the rail in front
  layer(1.1, () => {
    gf(ctx, c => c.rect(-200, 180, 640, 1000), lin(ctx, 0, 180, 440, 1000, [[0, '#1c1840'], [1, '#0a0a1e']]), 0.55);
    // their window, warm
    gf(ctx, c => c.rect(70, 320, 230, 400), lin(ctx, 70, 320, 300, 720, [[0, '#ffd59a'], [1, '#d07a38']]), 0.3);
    ctx.fillStyle = '#1a1030'; ctx.fillRect(180, 320, 10, 400); ctx.fillRect(70, 510, 230, 10);
    light(ctx, 185, 520, 420, C.amber, 0.30);
    // floor
    gf(ctx, c => { c.moveTo(-200, 860); c.lineTo(1100, 860); c.lineTo(1100, 1200); c.lineTo(-200, 1200); c.closePath(); }, lin(ctx, 0, 860, 0, H, [[0, '#2a1f48'], [1, '#0a0a1e']]), 0.5);
  });
  layer(1.25, () => {
    leaner(ctx, t, 600, 652, 1.0);
    // the rail
    gf(ctx, c => { c.rect(-200, 650, 1310, 16); }, lin(ctx, 0, 650, 0, 666, [[0, '#4a3a68'], [1, '#141030']]), 0.4);
    ctx.fillStyle = '#100c26'; for (let x = -180; x < 1100; x += 58) ctx.fillRect(x, 666, 7, 200);
    gf(ctx, c => c.rect(-200, 840, 1310, 20), '#120e2a', 0.4);
    gf(ctx, c => c.rect(1092, 640, 18, 230), lin(ctx, 1092, 0, 1110, 0, [[0, '#3a2d5c'], [1, '#120e2a']]), 0.4);
  });
}

module.exports = { T0, T1, draw };
