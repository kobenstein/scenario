// "Weeks earlier, another crew had nearly done the same, and nobody outside their airline heard."
// Same ridge, weeks before. Another jet comes in low, dips toward the trees and pulls up just in time; an amber dotted
// line keeps its path. The camera tilts down to the ground: the near-miss folds into a single note that drops into one
// airline's office. Its door shuts. The other airports along the horizon stay dark: nobody else hears.
const L = require('./lib');
const K = require('./s_k7_kit');
const J = require('./s_k7_jet');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, out, clamp, ease } = L;
const { gf, cached, rr } = K;

const T0 = 473.45, T1 = 479.90;
const PULL = 475.76, TILT = [476.7, 477.9], NOTE = [477.4, 478.35], SHUT = 478.55;
// path of the second jet: in low, dips, pulls up over the crest
function path(tau) {
  const u = (tau - 473.6) / 4.2;
  const x = -360 + 1900 * u;
  const dip = 470 + 90 * sm((tau - 473.6) / 2.0) - 260 * Math.pow(clamp((tau - PULL + 0.15) / 1.6), 1.4);
  return [x, dip];
}
const BLD = [800, 1680];
const PORTS = [[260, 1338, 0.8], [1180, 1330, 1], [1520, 1322, 0.7], [1820, 1340, 0.9], [2100, 1330, 0.6]];

const OFFS = [[-60, 1600, 0.95], [330, 1620, 1.05], [1260, 1620, 1.05], [1660, 1600, 0.95], [2020, 1580, 0.85]];
function office(c, x, y, s, hangar) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (hangar) gf(c, cc => { cc.moveTo(-250, 0); cc.lineTo(-250, -110); cc.quadraticCurveTo(-140, -200, -30, -110); cc.lineTo(-30, 0); cc.closePath(); }, lin(c, 0, -200, 0, 0, [[0, '#342c66'], [1, '#141030']]), 0.5);
  if (hangar) { c.fillStyle = '#0a0a20'; c.fillRect(-215, -90, 150, 90); }
  gf(c, cc => cc.rect(-30, -170, 240, 170), lin(c, 0, -170, 0, 0, [[0, '#3a3270'], [1, '#17133a']]), 0.5);
  c.fillStyle = '#4a4090'; c.fillRect(-36, -178, 252, 10);
  c.fillStyle = '#0a0a20'; c.fillRect(140, -130, 50, 130);
  c.restore();
}
function groundArt(c) {
  gf(c, cc => cc.rect(-300, 960, 2600, 380), lin(c, 0, 960, 0, 1330, [[0, 'rgba(8,8,28,0)'], [0.35, '#08081c'], [1, '#141236']]), 0.4);
  gf(c, cc => cc.rect(-300, 1330, 2600, 700), lin(c, 0, 1330, 0, 1950, [[0, '#2a2458'], [1, '#0c0b22']]), 0.55);
  c.fillStyle = 'rgba(164,159,196,0.18)'; c.fillRect(-300, 1329, 2600, 2);
  // runway edge lights running to the horizon
  for (let i = 0; i < 16; i++) { const k = i / 15, y = lerp(1345, 1520, k * k); for (const xx of [lerp(900, 640, k * k), lerp(1000, 1300, k * k)]) { c.fillStyle = 'rgba(255,226,170,0.5)'; c.fillRect(xx, y, 2 + 3 * k, 2 + 3 * k); } }
  // a row of airline offices along the apron; one of them is ours
  for (const [x, y, sc] of OFFS) office(c, x, y, sc, false);
  office(c, BLD[0], BLD[1], 1.25, true);
}
// window of each office in world coords
const win = (x, y, s) => [x + 20 * s, y - 140 * s, 100 * s, 50 * s];

function draw(ctx, t) {
  const tk = ease(clamp((t - TILT[0]) / (TILT[1] - TILT[0])));
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.06, cx: 960, cy: 540, py: () => 860 * tk - 0, px: () => -60 + 120 * sm((t - T0) / (T1 - T0)), seed: 101 });
  K.sky(ctx, [[0, '#05061a'], [0.5, '#16143e'], [0.75, '#3a2c66'], [1, '#1a1640']]);
  // memory tint: the past is a touch cooler and paler
  layer(0.15, () => { K.stars(ctx, t, 0.6, 380); light(ctx, 1250, 330, 900, '#8a6ab0', 0.26); J.band(ctx, 1200, 420, 1300, 90, '#9a86c8', 0.22); });
  layer(1, () => {
    cached(ctx, 'k7mtn', -200, 360, 2200, 1100, J.mountainArt, 0.6);
    cached(ctx, 'k7ground', -300, 960, 2300, 1960, groundArt, 0.6);
    // far airports on the horizon: lights that never hear about it
    for (const [x, y, sc] of OFFS) { const [wx, wy, ww, wh] = win(x, y, sc); ctx.fillStyle = rgba(C.lav, 0.16 + 0.04 * Math.sin(t + x)); ctx.fillRect(wx, wy, ww, wh); }
    // the dotted path of the near miss
    const tt = Math.min(t, 478.0);
    ctx.save(); ctx.setLineDash([6, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba('#ffb35c', 0.75 * (1 - ramp(t, NOTE[0], NOTE[0] + 0.5))); ctx.lineWidth = 4; ctx.beginPath();
    for (let tau = 473.6; tau <= tt; tau += 0.05) { const [x, y] = path(tau); const nx = x, ny = y; tau === 473.6 ? ctx.moveTo(nx, ny) : ctx.lineTo(nx, ny); }
    ctx.stroke(); ctx.restore();
    // the closest point, marked
    const close = ramp(t, PULL, PULL + 0.3) * (1 - ramp(t, NOTE[0], NOTE[0] + 0.4));
    if (close > 0) { const [x, y] = path(PULL + 0.25); ctx.strokeStyle = rgba('#ffb35c', 0.8 * close); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 30 + 4 * Math.sin(t * 5), 0, 7); ctx.stroke(); }
    // the second jet
    if (t < 478.3) {
      const [x, y] = path(t), [x2, y2] = path(t + 0.05), ang = Math.atan2(y2 - y, x2 - x);
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang - 0.06); ctx.scale(1.3, 1.3); J.jet(ctx, t, 1); ctx.restore();
    }
    // mist on the flank
    J.band(ctx, 1000 + Math.sin(t * 0.3) * 40, 560, 520, 70, '#7a6aaa', 0.3);
    J.band(ctx, 1350 + Math.sin(t * 0.25) * 30, 620, 420, 60, '#7a6aaa', 0.25);
    // the near miss becomes one note, dropping into one airline's office
    const nk = clamp((t - NOTE[0]) / (NOTE[1] - NOTE[0]));
    const winA = ramp(t, NOTE[1] - 0.1, NOTE[1] + 0.2) * (1 - 0.7 * ramp(t, SHUT + 0.3, SHUT + 1.0));
    ctx.fillStyle = rgba('#ffb35c', 0.3 + 0.6 * winA); ctx.fillRect(...win(BLD[0], BLD[1], 1.25));
    light(ctx, BLD[0] + 87, BLD[1] - 144, 300, '#ffb35c', 0.35 * winA + 0.08);
    if (nk > 0 && nk < 1) {
      const u = ease(nk), [px, py] = path(PULL + 0.25), sx = px, sy = py;
      const x = lerp(sx, BLD[0] + 87, u), y = lerp(sy, BLD[1] - 144, u) - Math.sin(u * Math.PI) * 120;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(u * 8) * 0.3); const sc = lerp(1.6, 0.7, u); ctx.scale(sc, sc);
      ctx.fillStyle = '#f3efe2'; ctx.fillRect(-22, -16, 44, 32); ctx.fillStyle = 'rgba(74,58,112,0.5)'; for (let j = 0; j < 3; j++) ctx.fillRect(-15, -9 + j * 8, 30 - j * 6, 2);
      ctx.restore(); light(ctx, x, y, 70, '#fff1cf', 0.3);
    }
    // the door shuts
    const dk = ease(clamp((t - SHUT) / 0.35));
    ctx.fillStyle = lin(ctx, 0, BLD[1] - 90, 0, BLD[1], [[0, '#4a4090'], [1, '#221c4c']]); ctx.fillRect(BLD[0] + 175, BLD[1] - 162, 62 * dk, 162);
    if (t < SHUT + 0.2) { ctx.fillStyle = rgba('#ffb35c', 0.5 * (1 - dk)); ctx.fillRect(BLD[0] + 175 + 62 * dk, BLD[1] - 162, 62 * (1 - dk), 162); }
    // the word doesn't travel: rings from the lit window fade out long before the neighbours
    for (let k = 0; k < 3; k++) { const ph = (t - 478.7 - k * 0.35) / 1.1; if (ph <= 0 || ph >= 1) continue;
      ctx.strokeStyle = rgba('#ffb35c', 0.45 * (1 - ph)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(BLD[0] + 87, BLD[1] - 144, 60 + ph * 230, 0, 7); ctx.stroke(); }
  });
  K.caption(ctx, t, 473.9, 477.0, 'weeks earlier', 100, 80, { font: '64px "Instrument Serif"', color: C.cream });
  K.caption(ctx, t, 477.3, T1, 'one airline knew', 100, 80, { font: '64px "Instrument Serif"', color: C.cream });
}

module.exports = { T0, T1, draw };
