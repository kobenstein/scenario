// "OpenAI says it'll match that. But a favor can be withdrawn."
// A second lab door, close. A hand puts a key in the lock and turns it: the door eases open, cyan light falls out.
// Then the same hand turns the key back, the light narrows to a line, and the key is pulled out and taken away.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, out, clamp, ease } = L;
const { gf, cached, rr, cap } = K;

const T0 = 440.80, T1 = 445.80;
const DX0 = 520, DX1 = 1320, DY0 = 40, FLOOR = 1000, KH = [1210, 560];

function wallArt(c) {
  gf(c, cc => cc.rect(-200, -200, 2320, FLOOR + 200), lin(c, 0, 0, 0, FLOOR, [[0, '#0c0b26'], [1, '#1e1946']]), 0.55);
  // frame
  gf(c, cc => { cc.rect(DX0 - 50, DY0 - 50, DX1 - DX0 + 100, FLOOR - DY0 + 50); cc.moveTo(DX0, DY0); cc.lineTo(DX0, FLOOR); cc.lineTo(DX1, FLOOR); cc.lineTo(DX1, DY0); cc.closePath(); }, lin(c, DX0, 0, DX1, 0, [[0, '#2c2660'], [1, '#17133a']]), 0.5);
  gf(c, cc => cc.rect(-200, FLOOR, 2320, 300), lin(c, 0, FLOOR, 0, 1200, [[0, '#251f50'], [1, '#0a0a1c']]), 0.5);
}
function doorArt(c) {
  gf(c, cc => cc.rect(DX0, DY0, DX1 - DX0, FLOOR - DY0), lin(c, DX0, DY0, DX1, FLOOR, [[0, '#3a3270'], [0.5, '#2a2458'], [1, '#18143a']]), 0.5);
  // panels
  c.strokeStyle = 'rgba(10,10,30,0.5)'; c.lineWidth = 6;
  c.strokeRect(DX0 + 70, DY0 + 70, DX1 - DX0 - 140, 380); c.strokeRect(DX0 + 70, 560, DX1 - DX0 - 140, 360);
  c.strokeStyle = 'rgba(164,159,196,0.12)'; c.lineWidth = 2; c.strokeRect(DX0 + 76, DY0 + 76, DX1 - DX0 - 152, 368);
  // lock plate
  gf(c, cc => rr(cc, KH[0] - 34, KH[1] - 70, 68, 140, 12), lin(c, KH[0] - 34, 0, KH[0] + 34, 0, [[0, '#ffcf8a'], [1, '#a2521f']]), 0.35);
  c.fillStyle = '#1a0c06'; c.beginPath(); c.arc(KH[0], KH[1] - 8, 9, 0, 7); c.fill(); c.fillRect(KH[0] - 4, KH[1] - 8, 8, 26);
}

function draw(ctx, t) {
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.02, z1: 1.12, cx: 1100, cy: 560, seed: 51 });
  // key: in at 441.4, turn open at 442.5, turn back at 443.9, out by 444.8
  const ins = ease(clamp((t - 441.0) / 0.5)), turnA = ease(clamp((t - 442.3) / 0.45)), turnB = ease(clamp((t - 443.8) / 0.45)), pull = ease(clamp((t - 444.65) / 0.6));
  const ang = (turnA - turnB) * Math.PI / 2;
  const open = ease(clamp((t - 442.6) / 0.9)) * (1 - ease(clamp((t - 444.0) / 0.7)));
  const gap = 140 * open;
  layer(1, () => {
    cached(ctx, 'k7fwall', -200, -200, 2120, 1200, wallArt);
    // the doorway behind the door: lit lab, seen through the gap
    ctx.fillStyle = lin(ctx, 0, DY0, 0, FLOOR, [[0, '#8fe6ff'], [1, '#2a9cc0']]); ctx.fillRect(DX0, DY0, DX1 - DX0, FLOOR - DY0);
    // the door swings inward on its left hinge: its right edge moves left, revealing the light
    ctx.save(); ctx.translate(DX0, 0); ctx.scale(1 - gap / (DX1 - DX0), 1); ctx.translate(-DX0, 0);
    cached(ctx, 'k7door', DX0, DY0, DX1, FLOOR, doorArt);
    ctx.restore();
    // light out of the gap onto the floor and wall
    if (open > 0.01) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, FLOOR, 0, 1200, [[0, rgba(C.cyan, 0.45 * open)], [1, rgba(C.cyan, 0)]]);
      ctx.beginPath(); ctx.moveTo(DX1 - gap, FLOOR); ctx.lineTo(DX1, FLOOR); ctx.lineTo(DX1 + 300, 1200); ctx.lineTo(DX1 - gap - 160, 1200); ctx.closePath(); ctx.fill(); ctx.restore();
      light(ctx, DX1 - gap / 2, 520, 600, C.cyan, 0.35 * open);
    }
    // the hand with the key; its key turns in the lock, door and plate move with the door scale
    const kx = DX0 + (KH[0] - DX0) * (1 - gap / (DX1 - DX0)), ky = KH[1] - 8;
    const away = pull * 520 + (1 - ins) * 420;
    const hx = kx + 40 + away, hy = ky + 30 + pull * 120 + (1 - ins) * 60;
    // forearm from off-screen right
    gf(ctx, c => cap(c, 2200, 860, hx + 80, hy + 20, 54, 38), lin(ctx, hx, 0, 2200, 0, [[0, '#ffb35c'], [1, '#7a3b17']]), 0.4, [hx - 40, hy - 120, 2300 - hx, 1000]);
    // cuff
    gf(ctx, c => { c.save(); c.translate(hx + 100, hy + 22); c.rotate(-0.28); c.rect(-14, -44, 30, 88); c.restore(); }, '#5a2a12', 0.3, [hx, hy - 100, 220, 220]);
    // key bow and shaft (the shaft goes into the lock, we see the bow turning)
    ctx.save(); ctx.translate(kx + away, ky + pull * 120 + (1 - ins) * 60); ctx.rotate(ang);
    if (ins < 1 || pull > 0) { ctx.fillStyle = '#d9b27a'; ctx.fillRect(-6, -6, 70 * (pull > 0 ? 1 : 1 - ins), 12); }
    gf(ctx, c => { c.ellipse(0, 0, 12, 44, 0, 0, 7); }, lin(ctx, -12, -40, 12, 40, [[0, '#fff1cf'], [1, '#c9902e']]), 0.2, [-20, -50, 40, 100]);
    ctx.fillStyle = '#1a0c06'; ctx.beginPath(); ctx.ellipse(0, -22, 4, 9, 0, 0, 7); ctx.fill();
    ctx.restore();
    // fist round the bow: fingers curl, it rotates with the key
    ctx.save(); ctx.translate(hx - 4, hy - 10); ctx.rotate(ang * 0.8 - 0.1);
    gf(ctx, c => { rr(c, -10, -46, 96, 96, 40); }, lin(ctx, -10, -46, 80, 50, [[0, '#ffcf8a'], [1, '#c36a2b']]), 0.35, [-20, -60, 120, 120]);
    ctx.strokeStyle = 'rgba(122,59,23,0.6)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(4, -20 + i * 24); ctx.quadraticCurveTo(24, -26 + i * 24, 40, -18 + i * 24); ctx.stroke(); }
    gf(ctx, c => { c.ellipse(-4, -40, 30, 15, -0.5, 0, 7); }, '#ffc488', 0.3, [-40, -60, 70, 40]);
    ctx.restore();
    light(ctx, kx, ky, 120, '#ffb35c', 0.18 * (1 - pull));
    K.dust(ctx, t, DX1 - 300, 200, 600, 700, C.cyanW, 0.25 * open);
  });
  L.label(ctx, t, 441.3, 443.6, 'OpenAI', 'says it will match', 96, 90, { color: C.cyan });
  L.label(ctx, t, 443.9, T1, 'a favor', 'can be withdrawn', 96, 90);
}

module.exports = { T0, T1, draw };
