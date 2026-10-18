// "This October, outside auditors got real access. Six people from METR now have the same access as Anthropic's own
//  staff, and Anthropic says it can't stop them publishing."
// Night, a lab seen in cutaway. Six people with amber visitor badges wait at a closed door. It slides open, cyan light
// pours out, they walk in among the staff, and their badges turn the same cyan as the staff's. Then pages lift off
// their desks and sail out of the open door into the night: what they find, they can publish.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, cone, out, clamp } = L;
const { gf, cached, rr } = K;

const T0 = 428.00, T1 = 441.10;
const FLOOR = 900, DOOR0 = 690, DOOR1 = 800, DTOP = 470, WALL0 = 640, WALL1 = 860;
const OPEN = 430.58, SAME = 435.37, PUB = 439.3;
const V = 190, S = 0.92;
const AUD = Array.from({ length: 6 }, (_, i) => ({ q: 600 - i * 108, x0: 600 - i * 108 - 330, go: OPEN + 0.25 + i * 0.42, to: [1010, 1150, 1290, 1430, 1570, 1710][5 - i],
  coat: [['#ffb35c', '#a2521f'], ['#e8964e', '#7a3b17'], ['#ffc27c', '#b0602a'], ['#d9843e', '#6a3010'], ['#f0a25a', '#8a451c'], ['#ffcf8a', '#b8622a']][i], hs: i % 2, bag: i === 2 || i === 5 }));
function posX(a, t) {
  if (t < a.go) return Math.min(a.q, a.x0 + V * (t - T0));
  const xs = Math.min(a.q, a.x0 + V * (a.go - T0));
  return Math.min(a.to, xs + V * 1.15 * (t - a.go));
}

function outsideArt(c) {
  const r = rng(5);
  for (let x = -200; x < WALL0;) { const w = 80 + r() * 120, h = 160 + r() * 260; c.fillStyle = '#100f30'; c.fillRect(x, FLOOR - 40 - h, w, h); x += w + 20; }
  gf(c, cc => cc.rect(-300, FLOOR - 40, WALL0 + 300, 400), lin(c, 0, FLOOR - 40, 0, 1200, [[0, '#1d1a44'], [1, '#08081a']]), 0.5);
}
function labArt(c) {
  // interior: cyan-lit back wall, racks, desks with screens
  gf(c, cc => cc.rect(WALL1, 240, 1300, FLOOR - 240), lin(c, 0, 240, 0, FLOOR, [[0, '#0d4a66'], [0.7, '#1a7e9e'], [1, '#0f5a78']]), 0.4);
  const r = rng(17);
  for (let i = 0; i < 7; i++) { const x = 920 + i * 150; gf(c, cc => cc.rect(x, 330, 100, 330), lin(c, x, 0, x + 100, 0, [[0, '#0a3550'], [1, '#0c4560']]), 0.35);
    for (let y = 345; y < 650; y += 13) for (let k = 0; k < 3; k++) if (r() < 0.5) { c.fillStyle = rgba(r() < 0.9 ? '#d8f7ff' : '#ffb35c', 0.5 + r() * 0.4); c.fillRect(x + 14 + k * 28, y, 7, 3); } }
  // ceiling lights
  for (let x = 950; x < 2100; x += 220) { c.fillStyle = '#e8fbff'; c.fillRect(x, 262, 120, 6); }
  gf(c, cc => cc.rect(WALL1, FLOOR, 1300, 300), lin(c, 0, FLOOR, 0, 1180, [[0, '#145a74'], [1, '#062436']]), 0.4);
  // desks along the back
  for (const x of [960, 1240, 1520, 1800]) { gf(c, cc => cc.rect(x, 720, 200, 14), '#08283c', 0.3); c.fillStyle = '#08283c'; c.fillRect(x + 10, 734, 8, 120); c.fillRect(x + 182, 734, 8, 120);
    c.fillStyle = '#061c2c'; c.fillRect(x + 60, 660, 90, 58); c.fillStyle = 'rgba(216,247,255,0.6)'; c.fillRect(x + 65, 665, 80, 48); }
}
function facadeArt(c) {
  // building shell: roof slab, the wall around the door
  gf(c, cc => cc.rect(WALL0 - 40, 200, 2400, 60), lin(c, 0, 200, 0, 260, [[0, '#2a2458'], [1, '#141030']]), 0.5);
  gf(c, cc => { cc.rect(WALL0, 240, WALL1 - WALL0, FLOOR - 240); cc.moveTo(DOOR0, DTOP); cc.lineTo(DOOR0, FLOOR); cc.lineTo(DOOR1, FLOOR); cc.lineTo(DOOR1, DTOP); cc.closePath(); }, lin(c, WALL0, 0, WALL1, 0, [[0, '#231e4e'], [1, '#141030']]), 0.5);
  c.fillStyle = '#0a0a1e'; c.fillRect(DOOR0 - 6, DTOP - 8, DOOR1 - DOOR0 + 12, 8);
}

function staff(ctx, t, x, k) {
  // the lab's own people at their desks: cooler palette, cyan badges
  K.walker(ctx, x, FLOOR, S * 0.95, 1.1 + 0.05 * Math.sin(t * 0.8 + k), { coat: ['#2a6e8a', '#0d3a50'], pants: ['#0d2c40', '#081c2c'], hair: '#08141e', hairStyle: k % 2, stride: 0.04, badge: C.cyan, badgeGlow: 0.3, grain: 0.3, legsBehind: true, skin: '#5a8aa0' }, k % 2 ? -1 : 1);
}

function draw(ctx, t) {
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.08, cx: 900, cy: 600, px: t => -60 + 260 * ramp(t, 431.5, 436.5) - 160 * ramp(t, 438.6, 440.6), seed: 41 });
  const open = L.ease(clamp((t - OPEN) / 0.9));
  K.sky(ctx, [[0, '#06081c'], [0.6, '#16163e'], [1, '#2a2258']]);
  layer(0.2, () => { K.stars(ctx, t, 0.9, 500); });
  layer(1, () => {
    cached(ctx, 'k7out', -300, 200, WALL0, 1200, outsideArt);
    cached(ctx, 'k7labin', WALL1, 240, 2160, 1180, labArt);
    const hum = 0.95 + 0.05 * Math.sin(t * 8) * Math.sin(t * 3);
    light(ctx, 1400, 520, 800, C.cyanW, 0.12 * hum);
    staff(ctx, t, 1060, 0); staff(ctx, t, 1380, 1); staff(ctx, t, 1860, 2);
    // the doorway: dark until the door slides, then cyan light pours over the threshold
    ctx.fillStyle = '#0b1a30'; ctx.fillRect(DOOR0, DTOP, DOOR1 - DOOR0, FLOOR - DTOP);
    ctx.save(); ctx.beginPath(); ctx.rect(DOOR0, DTOP, DOOR1 - DOOR0, FLOOR - DTOP); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, DTOP, 0, FLOOR, [[0, '#7fd8f0'], [1, '#2a9cc0']]); ctx.globalAlpha = open; ctx.fillRect(DOOR0, DTOP, DOOR1 - DOOR0, FLOOR - DTOP); ctx.globalAlpha = 1;
    ctx.restore();
    cached(ctx, 'k7fac', WALL0 - 40, 200, 2400, FLOOR, facadeArt);
    // the door panel slides into the wall
    const dx = (DOOR1 - DOOR0 - 4) * open;
    ctx.save(); ctx.beginPath(); ctx.rect(DOOR0, DTOP, DOOR1 - DOOR0, FLOOR - DTOP); ctx.clip();
    gf(ctx, c => c.rect(DOOR0 + dx, DTOP, DOOR1 - DOOR0, FLOOR - DTOP), lin(ctx, 0, DTOP, 0, FLOOR, [[0, '#3a4a8a'], [1, '#1a1e48']]), 0.4, [DOOR0, DTOP, 300, FLOOR - DTOP]);
    ctx.fillStyle = '#cfefff'; ctx.fillRect(DOOR0 + dx + 14, 660, 6, 70);
    ctx.restore();
    // spill on the pavement
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, DOOR0, 0, DOOR0 - 520, 0, [[0, rgba(C.cyan, 0.38 * open)], [1, rgba(C.cyan, 0)]]);
    ctx.beginPath(); ctx.moveTo(DOOR0, FLOOR - 4); ctx.lineTo(DOOR1, FLOOR - 4); ctx.lineTo(DOOR0 - 420, FLOOR + 140); ctx.lineTo(DOOR0 - 620, FLOOR + 140); ctx.closePath(); ctx.fill(); ctx.restore();
    light(ctx, (DOOR0 + DOOR1) / 2, 700, 420, C.cyan, 0.3 * open);
    // the six auditors: amber visitor badges until they get the same access as the staff
    const same = ramp(t, SAME, SAME + 0.4);
    for (let i = AUD.length - 1; i >= 0; i--) {
      const a = AUD[i], x = posX(a, t), xp = posX(a, t - 0.2), mv = clamp(Math.abs(x - xp) / (V * 0.2 * 0.8));
      const inside = x > DOOR1 - 20, p = x / 122 * Math.PI;
      const badge = same > 0.5 ? C.cyan : '#ffb35c', flash = ramp(t, SAME + i * 0.08, SAME + 0.2 + i * 0.08) * (1 - ramp(t, SAME + 0.6, SAME + 1.4));
      const look = i === 0 ? ramp(t, 429.6, 430.2) * (1 - ramp(t, 430.6, 431.0)) * 0 : 0;
      K.walker(ctx, x, FLOOR, S, p, { coat: a.coat, hair: '#3a1a0c', hairStyle: a.hs, stride: lerp(0.06, 1, mv), bag: a.bag, badge, badgeGlow: 0.35 + 1.2 * flash, grain: 0.4, legsBehind: mv < 0.3, papers: i === 1 ? true : false,
        rimCol: inside ? C.cyanW : (open > 0 ? C.cyan : null), rimA: inside ? 0.55 : 0.6 * open, rimDx: inside ? -4 : 4, look });
    }
    // what they find can go out: pages lift and sail out of the door into the night
    ctx.save();
    for (let k = 0; k < 14; k++) {
      const st = PUB + k * 0.13, u = clamp((t - st) / 1.9); if (u <= 0) continue;
      const sx = 1150 + (k % 4) * 140, sy = 700;
      const ex = 420 - (k % 6) * 70, ey = 160 + (k % 5) * 60, cx = 760, cy = 640, m = 1 - u, uu = out(u) * 0.3 + u * 0.7;
      const x = (1 - uu) ** 2 * sx + 2 * (1 - uu) * uu * cx + uu * uu * ex + Math.sin(u * 9 + k) * 14, y = (1 - uu) ** 2 * sy + 2 * (1 - uu) * uu * cy + uu * uu * ey;
      const rot = Math.sin(t * 4 + k) * 0.8, sq = Math.cos(t * 5 + k * 2);
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1.5, 1.5 * (0.4 + 0.6 * Math.abs(sq)));
      ctx.globalAlpha = ramp(u, 0, 0.1) * (1 - ramp(u, 0.85, 1));
      ctx.fillStyle = sq > 0 ? '#f3efe2' : '#cfc6ad'; ctx.fillRect(-14, -18, 28, 36);
      ctx.fillStyle = 'rgba(74,58,112,0.5)'; for (let j = 0; j < 4; j++) ctx.fillRect(-9, -11 + j * 7, 18 - (j % 2) * 6, 2);
      ctx.restore();
      if (u < 0.8) light(ctx, x, y, 40, '#fff1cf', 0.12);
    }
    ctx.restore();
  });
  L.stamp(ctx, t, 428.5, 433.4, 'October 2026', 'outside auditors get access', { size: 96 });
  L.label(ctx, t, 433.3, 437.6, 'METR', 'six auditors inside Anthropic', 96, 70);
  L.label(ctx, t, 435.4, 437.6, 'same access as staff', null, 96, 190, { color: C.cyan });
  L.label(ctx, t, 439.4, T1, 'free to publish', null, 96, 70);
}

module.exports = { T0, T1, draw };
