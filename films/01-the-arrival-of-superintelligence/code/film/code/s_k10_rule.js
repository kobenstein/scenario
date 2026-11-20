// "One person said no, and a rule changed."
// One small amber figure stands before a huge board of rules, rows of cold engraved plates. On "no" he raises his
// hand; a warm pulse climbs from his hand into the board, and on "rule changed" one row flips over like a split-flap
// sign and comes up warm. Small person, big rule.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const K = require('./s_k10_kit');
const { gf, rr, camera, glowStroke, dust, figure } = K;

const T0 = 648.8, T1 = 652.35;
const BX0 = 330, BX1 = 1590, BY0 = 60, ROWS = 12, RH = 52, GAP = 10, TARGET = 7;
const T_NO = 650.0, T_FLIP = 650.82, T_DONE = 651.25;
const R = rng(648);
const ROWD = Array.from({ length: ROWS }, () => { const segs = []; let x = 30; while (x < BX1 - BX0 - 120) { const w = Math.min(40 + R() * 160, BX1 - BX0 - 40 - x); segs.push([x, w]); x += w + 14 + R() * 20; } return segs; });
const ROWNEW = (() => { const segs = []; let x = 30; while (x < BX1 - BX0 - 120) { const w = Math.min(50 + R() * 140, BX1 - BX0 - 40 - x); segs.push([x, w]); x += w + 18; } return segs; })();

function plate(ctx, y, segs, warm, k) {
  const w = BX1 - BX0;
  gf(ctx, c => rr(c, BX0, y, w, RH, 6), warm ? lin(ctx, 0, y, 0, y + RH, [[0, '#ffcf8a'], [1, '#c9702e']]) : lin(ctx, 0, y, 0, y + RH, [[0, '#3a3a78'], [1, '#22224e']]), 0.4);
  ctx.fillStyle = warm ? 'rgba(90,40,14,0.75)' : rgba('#8fb8d8', 0.45);
  for (const [x, sw] of segs) ctx.fillRect(BX0 + x, y + RH / 2 - 5, sw, 10);
  ctx.fillStyle = warm ? 'rgba(255,240,210,0.6)' : 'rgba(170,190,255,0.12)'; ctx.fillRect(BX0 + 6, y + 2, w - 12, 2);
}

function draw(ctx, t) {
  const layer = camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.1, cx: 960, cy: 520, seed: 25 });
  const no = ease((t - (T_NO - 0.2)) / 0.4);
  const flip = clamp((t - T_FLIP) / (T_DONE - T_FLIP)), done = t >= T_DONE ? 1 : 0, flash = Math.exp(-Math.max(0, t - T_DONE) * 3) * done;
  const tY = BY0 + TARGET * (RH + GAP);
  layer(0.3, () => {
    // the hall
    gf(ctx, c => c.rect(-200, -200, W + 400, 1000), lin(ctx, 0, 0, 0, 820, [[0, '#0e0f2c'], [1, '#1c1a44']]), 0.55);
    for (const x of [140, 1780]) gf(ctx, c => c.rect(x - 50, -100, 100, 940), lin(ctx, x - 50, 0, x + 50, 0, [[0, '#26245a'], [1, '#121232']]), 0.5);
    // board frame
    gf(ctx, c => rr(c, BX0 - 30, BY0 - 30, BX1 - BX0 + 60, ROWS * (RH + GAP) + 50, 10), lin(ctx, 0, BY0, 0, BY0 + 800, [[0, '#17163c'], [1, '#0c0b22']]), 0.5);
    for (let i = 0; i < ROWS; i++) {
      const y = BY0 + i * (RH + GAP);
      if (i !== TARGET) { plate(ctx, y, ROWD[i], false); continue; }
      // the flipping row: scaleY = cos of the flip angle, face changes at half-way
      const a = flip * Math.PI, cs = Math.cos(a), warm = a > Math.PI / 2;
      ctx.save(); ctx.translate(0, y + RH / 2); ctx.scale(1, Math.max(0.02, Math.abs(cs))); ctx.translate(0, -(y + RH / 2));
      plate(ctx, y, warm ? ROWNEW : ROWD[i], warm);
      ctx.restore();
      if (flip > 0 && flip < 1) { ctx.fillStyle = 'rgba(4,4,16,0.5)'; ctx.fillRect(BX0, y + RH / 2 - 1, BX1 - BX0, 2); }
    }
    // the warm row glows
    if (done) { light(ctx, 960, tY + RH / 2, 700, C.amber, 0.22 + 0.4 * flash); glowStroke(ctx, c => rr(c, BX0 - 6, tY - 6, BX1 - BX0 + 12, RH + 12, 9), '#ffe0b0', 2, 0.25 + 0.6 * flash); }
    // the pulse that climbs from his hand to the row
    const pk = clamp((t - T_NO) / (T_FLIP - T_NO));
    if (pk > 0 && pk < 1) { const y = lerp(820, tY + RH / 2, ease(pk)); light(ctx, 960, y, 90, C.amber, 0.7 * Math.sin(pk * Math.PI)); light(ctx, 960, y, 24, '#fff0d0', 0.8 * Math.sin(pk * Math.PI)); }
    // cold top light over the board
    cone(ctx, 960, -100, 600, 1500, 900, '#6a7ad8', 0.05);
  });
  layer(0.7, () => {
    // floor with a soft reflection of the board
    gf(ctx, c => c.rect(-200, 820, W + 400, 400), lin(ctx, 0, 820, 0, H, [[0, '#24224e'], [1, '#0c0b22']]), 0.55);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#6a7ad8', 0.05); ctx.fillRect(BX0, 830, BX1 - BX0, 60);
    if (done) { ctx.fillStyle = rgba(C.amber, 0.12 * (0.6 + flash)); ctx.fillRect(BX0, 880, BX1 - BX0, 14); }
    ctx.restore();
    // a warm pool around the person
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(960, 960); ctx.scale(1, 0.22); ctx.fillStyle = rad(ctx, 0, 0, 0, 260, [[0, rgba(C.amber, 0.35)], [1, rgba(C.amber, 0)]]); ctx.fillRect(-260, -260, 520, 520); ctx.restore();
    dust(ctx, t, 300, 100, 1300, 760, '#c8c4ff', 0.25);
  });
  layer(0.9, () => {
    const s = 0.78, br = Math.sin(t * 1.6);
    const hipY = 960 - 150 * s;
    ctx.fillStyle = 'rgba(4,4,16,0.45)'; ctx.beginPath(); ctx.ellipse(960, 962, 60, 9, 0, 0, 7); ctx.fill();
    // right arm rises on "no": straight up, palm out
    const arm = no;
    const res = figure(ctx, { x: 960, y: hipY + br, s, facing: 'back', br, lean: -0.02 * arm, turn: 0.05 * Math.sin(t * 0.6), tilt: lerp(0.05, -0.2, ease((t - 650.5) / 0.6)), lx: 1,
      rim: '#ffe0b0', rimA: 0.45, rimDx: 0, rimDy: -2.5, pal: ['#ffb35c', '#c9702e', '#5a2a12'],
      legs: [{ a1: Math.PI / 2 + 0.1, a2: Math.PI / 2 + 0.06 }, { a1: Math.PI / 2 - 0.1, a2: Math.PI / 2 - 0.06 }],
      arms: [{ a1: Math.PI / 2 + 0.18, a2: Math.PI / 2 + 0.1 }, { a1: lerp(Math.PI / 2 - 0.2, -Math.PI / 2 + 0.25, arm), a2: lerp(Math.PI / 2 - 0.1, -Math.PI / 2 + 0.1, arm) }] });
    if (arm > 0.5) { const h = res.hands[1]; light(ctx, h[0], h[1], 70, C.amber, 0.5 * Math.exp(-Math.max(0, t - T_NO) * 1.2)); }
  });
}

module.exports = { T0, T1, draw };
