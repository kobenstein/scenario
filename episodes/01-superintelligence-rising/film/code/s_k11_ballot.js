// "We do. It's a small one each, but it's real, and it's now."
// A glass ballot box in the dark. On "We do" one hand reaches in and drops a small glowing card through the slot;
// then more hands from every side, faster and faster. Each card is small, but the light pooling inside the box rises
// with every one, until on "now" it is the brightest thing in the room.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { gf, rr, glowE, camera, mix } = require('./s_k11_poll');

const T0 = 683.45, T1 = 688.95;
const SLOT = [960, 498];
// box geometry (front face + top face in a gentle 3/4 view)
const BX = { l: 700, r: 1220, top: 520, bot: 860, dx: 70, dy: -70 };

// the drops: time the card leaves the hand, angle the arm comes from, sleeve colour
const DROPS = (() => {
  const r = rng(684), times = [683.86, 684.62, 685.30, 685.78, 686.28, 686.64, 686.95, 687.18, 687.38, 687.52, 687.62, 687.68, 687.70, 687.74];
  const sleeves = [['#ffb35c', '#7a3b17'], ['#5a4a8a', '#1e1840'], ['#2a7a8c', '#0c2a38'], ['#c86a6a', '#4a1a24'], ['#e8c890', '#6a4a2a'], ['#8a5ab0', '#2a1640']];
  const angs = [-1.57, -2.35, -0.75, -2.9, -0.2, -1.95, -1.15, -2.6, -0.45, -1.4, -3.1, -0.05, -2.1, -0.95];
  return times.map((td, i) => ({ td, ang: angs[i] + (r() - 0.5) * 0.12, sl: sleeves[i % sleeves.length], off: (r() - 0.5) * 120, skin: ['#e8964c', '#c9702e', '#a8521e', '#f0b070', '#7a3b17'][Math.floor(r() * 5)], cardRot: (r() - 0.5) * 0.5 }));
})();
const SPARKS = (() => { const r = rng(685); return Array.from({ length: 40 }, () => ({ x: BX.l + 30 + r() * (BX.r - BX.l - 60), ph: r(), sp: 0.3 + r() * 0.6 })); })();

// one arm reaching to the slot with a card, letting go, pulling back
function arm(ctx, d, t) {
  const reach0 = d.td - 0.55, back1 = d.td + 0.7;
  if (t < reach0 || t > back1) return;
  const k = t < d.td ? ease((t - reach0) / 0.55) : 1 - ease((t - d.td - 0.1) / 0.6);
  const tx = SLOT[0] + d.off * 0.6 + Math.cos(d.ang) * 70, ty = SLOT[1] - 70 + Math.sin(d.ang) * 30;     // the hand stops above the slot
  const far = 1300, sx = tx + Math.cos(d.ang) * far, sy = ty + Math.sin(d.ang) * far;
  const hx = lerp(sx, tx, k), hy = lerp(sy, ty, k);
  const a = d.ang;                 // forearm runs from the hand back toward the edge
  const ex = hx + Math.cos(a) * 1000, ey = hy + Math.sin(a) * 1000;
  // sleeve
  const nx = -Math.sin(a), ny = Math.cos(a);
  gf(ctx, c => { c.moveTo(hx + Math.cos(a) * 70 + nx * 34, hy + Math.sin(a) * 70 + ny * 34); c.lineTo(ex + nx * 60, ey + ny * 60); c.lineTo(ex - nx * 60, ey - ny * 60); c.lineTo(hx + Math.cos(a) * 70 - nx * 34, hy + Math.sin(a) * 70 - ny * 34); c.closePath(); },
    lin(ctx, hx, hy, hx + Math.cos(a) * 400, hy + Math.sin(a) * 400, [[0, d.sl[0]], [1, d.sl[1]]]), 0.45);
  // sleeve folds near the cuff
  ctx.strokeStyle = rgba(d.sl[1], 0.7); ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (const [u, w] of [[120, 0.7], [190, 0.5], [260, 0.8]]) { const px = hx + Math.cos(a) * u, py = hy + Math.sin(a) * u, ww = 36 + u * 0.03;
    ctx.beginPath(); ctx.moveTo(px + nx * ww * w, py + ny * ww * w); ctx.quadraticCurveTo(px + Math.cos(a) * 14, py + Math.sin(a) * 14, px - nx * ww * 0.3, py - ny * ww * 0.3); ctx.stroke(); }
  // wrist and hand (back of the hand toward camera, fingers pinching the card)
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(a + Math.PI);
  gf(ctx, c => { c.moveTo(-74, -24); c.lineTo(-30, -26); c.bezierCurveTo(-6, -30, 18, -22, 30, -10); c.quadraticCurveTo(40, 0, 30, 10); c.bezierCurveTo(18, 22, -6, 28, -30, 24); c.lineTo(-74, 22); c.closePath(); },
    lin(ctx, -60, -26, 30, 26, [[0, mix(d.skin, '#ffd29a', 0.35)], [1, mix(d.skin, '#3a1608', 0.45)]]), 0.35);
  // knuckles and thumb
  ctx.strokeStyle = rgba('#3a1608', 0.4); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  for (const y of [-14, -4, 6]) { ctx.beginPath(); ctx.moveTo(4, y); ctx.lineTo(22, y * 0.8); ctx.stroke(); }
  gf(ctx, c => { c.moveTo(-20, 20); c.quadraticCurveTo(10, 36, 32, 22); c.quadraticCurveTo(14, 18, -6, 12); c.closePath(); }, mix(d.skin, '#3a1608', 0.25), 0.3);
  // cuff
  gf(ctx, c => rr(c, -84, -32, 22, 64, 6), d.sl[1], 0.4);
  ctx.restore();
}
// a card: in the fingers until d.td, then falls into the slot
function card(ctx, d, t, lit) {
  const reach0 = d.td - 0.55; if (t < reach0) return;
  const fall = (t - d.td) / 0.28; if (fall > 1) return;
  let x, y, rot = d.cardRot, s = 1;
  const k = t < d.td ? ease((t - reach0) / 0.55) : 1;
  const tx = SLOT[0] + d.off * 0.6 + Math.cos(d.ang) * 70, ty = SLOT[1] - 70 + Math.sin(d.ang) * 30;
  const hx = lerp(tx + Math.cos(d.ang) * 1300, tx, k), hy = lerp(ty + Math.sin(d.ang) * 1300, ty, k);
  if (fall < 0) { x = hx - Math.cos(d.ang) * 30; y = hy - Math.sin(d.ang) * 30 + 18; }
  else { const f = fall * fall; x = lerp(tx - Math.cos(d.ang) * 30, SLOT[0], sm(fall)); y = lerp(ty - Math.sin(d.ang) * 30 + 18, SLOT[1] + 6, f); rot = lerp(rot, 0, sm(fall)); s = 1 - 0.35 * f; }
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#fff1d0'; ctx.beginPath(); rr(ctx, -26, -17, 52, 34, 4); ctx.fill();
  ctx.strokeStyle = rgba('#c9702e', 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-16, -6); ctx.lineTo(10, -6); ctx.moveTo(-16, 3); ctx.lineTo(4, 3); ctx.stroke();
  ctx.strokeStyle = '#c9702e'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.rect(12, 0, 8, 8); ctx.stroke();
  ctx.restore();
  light(ctx, x, y, 70, C.amber, 0.5);
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.1, sm((t - T0) / (T1 - T0)));
  const layer = camera(ctx, t, 960, 600, z, 31);
  // the pool: rises with every card that lands, swells on "now"
  let n = 0; for (const d of DROPS) n += ramp(t, d.td + 0.2, d.td + 0.55);
  const lvl = n / DROPS.length, now = ramp(t, 687.68, 688.2), pulse = 0.94 + 0.06 * Math.sin(t * 3);
  const land = DROPS.reduce((m, d) => Math.max(m, Math.exp(-Math.max(0, t - d.td - 0.28) * 6) * (t > d.td + 0.28 ? 1 : 0)), 0);
  // room
  layer(0.25, () => {
    gf(ctx, c => c.rect(-300, -300, W + 600, H + 600), rad(ctx, 960, 640, 100, 1300, [[0, mix('#1c1a44', '#4a2e40', lvl)], [1, '#06061a']]), 0.55);
    glowE(ctx, 960, 900, 900, 160, [[0, rgba(C.amber, 0.06 + 0.22 * lvl + 0.1 * now)], [1, rgba(C.amber, 0)]], true);
  });
  // table
  layer(0.5, () => {
    gf(ctx, c => { c.moveTo(-300, 820); c.lineTo(W + 300, 820); c.lineTo(W + 300, H + 300); c.lineTo(-300, H + 300); c.closePath(); }, lin(ctx, 0, 820, 0, H, [[0, mix('#24204a', '#5a3a3a', lvl)], [1, '#0a0a1e']]), 0.5);
    glowE(ctx, 990, 870, 520 + 180 * lvl, 70, [[0, rgba(C.amber, 0.12 + 0.4 * lvl)], [1, rgba(C.amber, 0)]], true);
  });
  layer(0.7, () => {
    const { l, r, top, bot, dx, dy } = BX;
    // back of the box seen through the glass
    gf(ctx, c => { c.moveTo(l + dx, top + dy); c.lineTo(r + dx, top + dy); c.lineTo(r + dx, bot + dy); c.lineTo(l + dx, bot + dy); c.closePath(); }, rgba('#0e0c26', 0.85), 0.4);
    // the pool of light inside: a level that rises, with a bright surface line
    const ph = 8 + (bot - top - 40) * lvl, sy = bot - ph;
    ctx.save(); ctx.beginPath(); ctx.moveTo(l, top); ctx.lineTo(l + dx, top + dy); ctx.lineTo(r + dx, top + dy); ctx.lineTo(r + dx, bot + dy); ctx.lineTo(r, bot); ctx.lineTo(l, bot); ctx.closePath(); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, sy, 0, bot, [[0, rgba('#ffe0a0', 0.95)], [0.25, rgba('#ffb35c', 0.85)], [1, rgba('#c9702e', 0.8)]]);
    ctx.beginPath(); ctx.moveTo(l, sy); for (let x = l; x <= r + dx; x += 20) ctx.lineTo(x, sy + dy * (x - l) / (r + dx - l) * 0.5 + Math.sin(x * 0.03 + t * 3) * 3 * (1 + 3 * land)); ctx.lineTo(r + dx, bot + dy); ctx.lineTo(r, bot); ctx.lineTo(l, bot); ctx.closePath(); ctx.fill();
    // cards inside, piled in the light
    for (const sp of SPARKS) { const y = bot - ((sp.ph + (t - T0) * sp.sp * 0.05) % 1) * ph; ctx.fillStyle = rgba('#fff4dc', 0.35 * Math.min(1, lvl * 3)); ctx.fillRect(sp.x, y, 10, 6); }
    ctx.restore();
    light(ctx, 960, sy + 40, 500 + 200 * lvl, C.amber, (0.12 + 0.5 * lvl + 0.25 * now + 0.25 * land) * pulse);
    // the glass box: frame, top with the slot
    ctx.strokeStyle = rgba('#d8c8ff', 0.25); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(l + dx, top + dy); ctx.lineTo(l + dx, bot + dy); ctx.lineTo(r + dx, bot + dy); ctx.stroke();
    gf(ctx, c => { c.moveTo(l, top); c.lineTo(l + dx, top + dy); c.lineTo(r + dx, top + dy); c.lineTo(r, top); c.closePath(); }, lin(ctx, 0, top + dy, 0, top, [[0, '#3a3270'], [1, '#221c48']]), 0.5);
    // slot, glowing from below
    ctx.save(); ctx.translate(SLOT[0], SLOT[1] + 8); ctx.transform(1, 0, -0.9, 1, 0, 0);
    ctx.fillStyle = mix('#0a0818', '#ffd08a', clamp(lvl * 1.2 + land * 0.5)); ctx.beginPath(); rr(ctx, -70, -6, 140, 12, 5); ctx.fill(); ctx.restore();
    light(ctx, SLOT[0], SLOT[1] + 8, 120, '#ffd9a0', 0.2 * lvl + 0.5 * land);
    // front glass with a sheen and a dark frame
    ctx.fillStyle = lin(ctx, l, top, r, bot, [[0, 'rgba(216,200,255,0.10)'], [0.4, 'rgba(216,200,255,0.02)'], [0.6, 'rgba(216,200,255,0.06)'], [1, 'rgba(216,200,255,0.01)']]);
    ctx.fillRect(l, top, r - l, bot - top);
    ctx.strokeStyle = '#141030'; ctx.lineWidth = 10; ctx.strokeRect(l, top, r - l, bot - top);
    ctx.beginPath(); ctx.moveTo(r, top); ctx.lineTo(r + dx, top + dy); ctx.lineTo(r + dx, bot + dy); ctx.lineTo(r, bot); ctx.stroke();
    ctx.strokeStyle = rgba('#ffd08a', 0.25 + 0.4 * lvl); ctx.lineWidth = 2; ctx.strokeRect(l + 5, top + 5, r - l - 10, bot - top - 10);
  });
  // cards and hands
  layer(0.9, () => {
    for (const d of DROPS) card(ctx, d, t, lvl);
    for (const d of DROPS) arm(ctx, d, t);
  });
}

module.exports = { T0, T1, draw };
