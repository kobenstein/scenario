// "After that, pilots got a way to report close calls without getting in trouble. It's one of several reasons
//  flying is now about forty times safer than it was in the seventies."
// The same row of airline offices. Two pilots walk up to a glowing report box and drop in their close calls; light
// runs from the box to every office and they all light up. Then the camera rises into the night sky, where two
// columns stand: the fatal-accident rate of the 1970s, tall and pale, and today's, a sliver of amber. About 40x.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const { gf, cached, rr } = K;

const T0 = 479.60, T1 = 491.00;
const GROUND = 900, BOX = [960, GROUND];
const DROP = [481.9, 482.45], SPREAD = 482.7;
const OFFICES = [[110, 700, 0.8], [430, 690, 0.85], [760, 700, 0.8], [1180, 700, 0.8], [1500, 690, 0.85], [1820, 700, 0.8]];
const RISE = [484.9, 486.1], COL70 = [486.0, 487.0], COLNOW = [487.4, 487.9], CB = -170;

function office(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  gf(c, cc => cc.rect(-120, -170, 240, 170), lin(c, 0, -170, 0, 0, [[0, '#3a3270'], [1, '#17133a']]), 0.5);
  c.fillStyle = '#4a4090'; c.fillRect(-126, -178, 252, 10);
  c.fillStyle = '#0a0a20'; c.fillRect(50, -130, 50, 130);
  c.restore();
}
function groundArt(c) {
  gf(c, cc => cc.rect(-300, 520, 2600, 400), lin(c, 0, 520, 0, 920, [[0, '#2a2458'], [1, '#16123a']]), 0.5);
  c.fillStyle = 'rgba(164,159,196,0.18)'; c.fillRect(-300, 519, 2600, 2);
  for (const [x, y, s] of OFFICES) office(c, x, y, s);
  gf(c, cc => cc.rect(-300, GROUND - 20, 2600, 600), lin(c, 0, GROUND - 20, 0, 1400, [[0, '#221c4c'], [1, '#08081c']]), 0.5);
}
const win = (x, y, s) => [x - 100 * s, y - 140 * s, 110 * s, 50 * s];

function draw(ctx, t) {
  const rk = ease(clamp((t - RISE[0]) / (RISE[1] - RISE[0])));
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.06, cx: 960, cy: 540, py: () => -980 * rk, seed: 111 });
  K.sky(ctx, [[0, '#06081c'], [0.6, '#17153f'], [1, '#2a2458']]);
  layer(0.35, () => { K.stars(ctx, t, 0.9, 700); ctx.save(); ctx.translate(0, -700); K.stars(ctx, t + 2, 1, 700); ctx.restore(); });
  layer(1, () => {
    cached(ctx, 'k7rground', -300, 500, 2300, 1400, groundArt, 0.6);
    // offices light up as the reports reach them
    for (const [x, y, s] of OFFICES) {
      const d = Math.abs(x - BOX[0]), on = ramp(t, SPREAD + d / 900, SPREAD + 0.3 + d / 900);
      ctx.fillStyle = on > 0 ? rgba('#ffb35c', 0.2 + 0.7 * on) : rgba(C.lav, 0.18); ctx.fillRect(...win(x, y, s));
      if (on > 0) light(ctx, x - 45 * s, y - 115 * s, 160, '#ffb35c', 0.3 * on);
    }
    // lines of light from the box to every office
    for (const [x, y, s] of OFFICES) {
      const d = Math.abs(x - BOX[0]), k = out(clamp((t - SPREAD - d / 1600) / (0.25 + d / 1600)));
      if (k <= 0) continue;
      const [wx, wy, ww, wh] = win(x, y, s), ex = wx + ww / 2, ey = wy + wh / 2, cxp = (BOX[0] + ex) / 2, cyp = Math.min(BOX[1] - 200, ey) - 140;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb35c', 0.55); ctx.lineWidth = 3; ctx.beginPath();
      const n = 30; for (let i = 0; i <= n * k; i++) { const u = i / n, m = 1 - u, px = m * m * BOX[0] + 2 * m * u * cxp + u * u * ex, py = m * m * (BOX[1] - 150) + 2 * m * u * cyp + u * u * ey; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke(); ctx.restore();
    }
    // the report box: a lit post box on a pedestal
    const glow = 0.7 + 0.15 * Math.sin(t * 2.4) + 0.5 * (ramp(t, DROP[0], DROP[0] + 0.15) * (1 - ramp(t, DROP[0] + 0.3, DROP[0] + 0.9)) + ramp(t, DROP[1], DROP[1] + 0.15) * (1 - ramp(t, DROP[1] + 0.3, DROP[1] + 0.9)));
    gf(ctx, c => c.rect(BOX[0] - 16, BOX[1] - 110, 32, 110), '#1a1438', 0.4, [BOX[0] - 20, BOX[1] - 120, 40, 130]);
    gf(ctx, c => rr(c, BOX[0] - 60, BOX[1] - 230, 120, 130, 14), lin(ctx, 0, BOX[1] - 230, 0, BOX[1] - 100, [[0, '#ffcf8a'], [1, '#c9702e']]), 0.35, [BOX[0] - 70, BOX[1] - 240, 140, 150]);
    ctx.fillStyle = '#3a1608'; ctx.fillRect(BOX[0] - 34, BOX[1] - 196, 68, 8);
    light(ctx, BOX[0], BOX[1] - 170, 260, '#ffb35c', 0.4 * glow);
    light(ctx, BOX[0], BOX[1] - 192, 60, '#fff1cf', 0.5 * glow);
    // two pilots walk up and post their reports
    const pil = [
      { x0: 160, x1: 830, a: T0, b: 481.6, dir: 1, drop: DROP[0] },
      { x0: 1780, x1: 1090, a: T0 + 0.2, b: 482.15, dir: -1, drop: DROP[1] },
    ];
    for (const p of pil) {
      const k = clamp((t - p.a) / (p.b - p.a)), x = lerp(p.x0, p.x1, k), moving = k > 0 && k < 1;
      const ph = Math.abs(x - p.x0) / 122 * Math.PI;
      const leave = ramp(t, 483.4, 485.0), xx = x - p.dir * 240 * leave * 0;
      K.walker(ctx, xx, GROUND, 0.95, ph, { coat: ['#2c3a78', '#141a40'], pants: ['#1a1e48', '#0e1030'], capHat: '#0e1030', hair: '#2a120a', stride: moving ? 1 : 0.05, legsBehind: !moving, papers: t < p.drop ? true : false, rimCol: '#ffb35c', rimA: 0.55, rimDx: p.dir * 4, skin: '#e08a42' }, p.dir);
      // the card flies from hand into the slot
      const ck = clamp((t - p.drop + 0.3) / 0.35);
      if (ck > 0 && ck < 1) { const sx = xx + p.dir * 40, sy = GROUND - 250, ex = BOX[0], ey = BOX[1] - 192; const u = ease(ck);
        ctx.save(); ctx.translate(lerp(sx, ex, u), lerp(sy, ey, u) - Math.sin(u * Math.PI) * 50); ctx.rotate(u * 1.5 * p.dir); ctx.fillStyle = '#f3efe2'; ctx.fillRect(-14, -10, 28, 20); ctx.restore(); }
    }
    // up in the sky: two columns, the fatal-accident rate then and now
    const base = CB, H70 = 640, HNOW = H70 / 40;
    const c70 = ease(clamp((t - COL70[0]) / (COL70[1] - COL70[0]))), cnow = ease(clamp((t - COLNOW[0]) / (COLNOW[1] - COLNOW[0])));
    if (c70 > 0) {
      const x = 700, w = 170, h = H70 * c70;
      gf(ctx, c => c.rect(x - w / 2, base - h, w, h), lin(ctx, 0, base - H70, 0, base, [[0, '#8a7ab8'], [1, '#3a3070']]), 0.4, [x - w / 2 - 5, base - H70 - 5, w + 10, H70 + 10]);
      ctx.strokeStyle = rgba(C.cream, 0.4); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - w / 2 - 40, base); ctx.lineTo(1400, base); ctx.stroke();
      ctx.save(); ctx.globalAlpha = c70; ctx.font = '44px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.fillStyle = C.cream; ctx.fillText('1970s', x, base + 50); ctx.restore();
    }
    if (cnow > 0) {
      const x = 1220, w = 170, h = Math.max(4, HNOW * cnow);
      gf(ctx, c => c.rect(x - w / 2, base - h, w, h), '#ffb35c', 0, null);
      light(ctx, x, base - h / 2, 160, '#ffb35c', 0.55 * cnow);
      ctx.save(); ctx.globalAlpha = cnow; ctx.font = '44px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.fillStyle = C.cream; ctx.fillText('today', x, base + 50); ctx.restore();
    }
  });
  L.stamp(ctx, t, 480.3, 484.7, '1976', 'pilots report close calls, no penalty', { size: 110 });
  L.label(ctx, t, 486.0, T1, 'Fatal accidents per flight', 'one of several reasons', 96, 60);
  L.stamp(ctx, t, 487.7, T1 + 0.5, '~40x safer', null, { size: 120, x: 1080, y: 200, color: '#ffd28c' });
}

module.exports = { T0, T1, draw };
