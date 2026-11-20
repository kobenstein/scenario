// "Most of the time, the only one checking a lab is the lab."
// A researcher in a lab coat stands at a mirror with a clipboard, inspecting... the reflection. Each box gets a tick,
// and the reflection ticks its own clipboard in step. On "is the lab" a big approving check: grader and graded are one.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, cone, out, clamp } = L;
const { gf, cached, rr } = K;

const T0 = 410.40, T1 = 414.80;
const CHECKS = [412.52, 412.92, 413.32], BIG = 413.75;
const MX = 1000, MY0 = 110, MY1 = 990, MX1 = 1640, FLOOR = 985, PX = 640, S = 2.15;

function roomArt(c) {
  gf(c, cc => cc.rect(-200, -200, 2320, FLOOR + 200), lin(c, 0, 0, 0, FLOOR, [[0, '#0e0c28'], [1, '#231b4c']]), 0.55);
  // wainscot panels
  c.strokeStyle = 'rgba(80,64,140,0.25)'; c.lineWidth = 3;
  for (let x = -160; x < 1000; x += 220) c.strokeRect(x, 620, 180, 300);
  gf(c, cc => cc.rect(-200, FLOOR, 2320, 300), lin(c, 0, FLOOR, 0, 1180, [[0, '#2a2252'], [1, '#0a0a1c']]), 0.5);
  // the mirror's heavy frame
  gf(c, cc => { cc.rect(MX - 36, MY0 - 36, MX1 - MX + 72, MY1 - MY0 + 36); cc.rect(MX, MY0, MX1 - MX, MY1 - MY0); }, lin(c, MX, MY0, MX1, MY1, [[0, '#4a3a70'], [0.5, '#2a2050'], [1, '#141030']]), 0.5);
  c.strokeStyle = 'rgba(255,179,92,0.25)'; c.lineWidth = 2; c.strokeRect(MX - 30, MY0 - 30, MX1 - MX + 60, MY1 - MY0 + 30);
}
function mirrorRoomArt(c) {
  // the room as seen in the glass: same wall, cooler and darker
  gf(c, cc => cc.rect(MX, MY0, MX1 - MX, MY1 - MY0), lin(c, 0, MY0, 0, MY1, [[0, '#0b1a3a'], [0.7, '#14305a'], [1, '#0d2244']]), 0.5);
  c.strokeStyle = 'rgba(143,230,255,0.12)'; c.lineWidth = 3;
  for (let x = MX + 40; x < MX1; x += 220) c.strokeRect(x, 620, 180, 300);
  gf(c, cc => cc.rect(MX, FLOOR - 40, MX1 - MX, MY1 - FLOOR + 40), '#0a1630', 0.4);
}

// clipboard contents in clipboard-local coords (sheet spans x 0..32, y -42..8)
function clip(ctx, t) {
  const rows = [-28, -16, -4];
  rows.forEach((y, i) => {
    ctx.strokeStyle = '#4a3a70'; ctx.lineWidth = 1; ctx.strokeRect(3, y - 3, 5, 5);
    ctx.fillStyle = 'rgba(74,58,112,0.5)'; ctx.fillRect(11, y - 1, 12 + 4 * (i % 2), 2);
    K.check(ctx, 5.5, y - 1, 9, clamp((t - CHECKS[i]) / 0.25), '#c9702e', 1.8);
  });
  K.check(ctx, 22, -34, 14, clamp((t - BIG) / 0.3), '#c9702e', 2.4);
}
// where the pen is, in figure-local coords: hovering, then a tick per row, then the big one
function penAt(t) {
  const base = [76, -272];
  let x = base[0] + 2 * Math.sin(t * 2.2), y = base[1] + 2 * Math.sin(t * 1.7);
  for (let i = 0; i < 3; i++) { const k = clamp((t - CHECKS[i] + 0.1) / 0.4); if (k > 0 && k < 1) { x += Math.sin(k * Math.PI * 2) * 5; y += -4 + i * 6 - Math.sin(k * Math.PI) * 6; } else if (t > CHECKS[i] + 0.3) y += 0; }
  const kb = clamp((t - BIG + 0.1) / 0.4); if (kb > 0) { x += 6 * Math.sin(kb * Math.PI); y -= 10 * kb; }
  return [x, y];
}

function person(ctx, t, x, dir, glass) {
  const sway = Math.sin(t * 0.9) * 0.08;
  const nod = 0.06 + 0.05 * Math.sin(t * 1.3) + 0.08 * ramp(t, BIG, BIG + 0.25) * (1 - ramp(t, BIG + 0.5, BIG + 0.9));
  const o = { coat: ['#ffe2bc', '#b8743e'], pants: ['#3a2a5a', '#221838'], hair: '#3a1a0c', hairStyle: 1, stride: 0.05, grain: 0.45, legsBehind: true, papers: 'clip', clipFn: c => clip(c, t),
    writeAt: penAt(t), badge: C.cyan, badgeGlow: 0.35 + 0.6 * ramp(t, BIG, BIG + 0.2) * (1 - ramp(t, BIG + 0.6, BIG + 1.1)), nod: nod + 0.1 };
  if (glass) { o.rimCol = null; }
  return K.walker(ctx, x, FLOOR, S, 1.2 + sway, o, dir);
}

function draw(ctx, t) {
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.1, cx: 980, cy: 520, seed: 21 });
  const f = 0.95 + 0.05 * Math.sin(t * 7) * Math.sin(t * 2.3);
  layer(1, () => {
    cached(ctx, 'k7room2', -200, -200, 2120, 1180, roomArt);
    // inside the mirror: the reflected room and the reflected researcher, facing back
    ctx.save(); ctx.beginPath(); ctx.rect(MX, MY0, MX1 - MX, MY1 - MY0); ctx.clip();
    cached(ctx, 'k7mroom', MX, MY0, MX1, MY1, mirrorRoomArt);
    light(ctx, 2 * MX - PX + 40, 220, 520, '#ffb35c', 0.10 * f);
    ctx.globalAlpha = 0.86; person(ctx, t, 2 * MX - PX, -1, true); ctx.globalAlpha = 1;
    // glass: cool tint and diagonal sheen
    ctx.fillStyle = 'rgba(80,170,220,0.10)'; ctx.fillRect(MX, MY0, MX1 - MX, MY1 - MY0);
    ctx.fillStyle = 'rgba(216,247,255,0.06)';
    for (const sx of [MX + 120, MX + 420]) { ctx.beginPath(); ctx.moveTo(sx, MY0); ctx.lineTo(sx + 110, MY0); ctx.lineTo(sx - 80, MY1); ctx.lineTo(sx - 190, MY1); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    // the lamp above the researcher: the one warm light
    ctx.strokeStyle = '#08081a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(PX + 60, -60); ctx.lineTo(PX + 60, 70); ctx.stroke();
    gf(ctx, c => { c.moveTo(PX + 10, 110); c.quadraticCurveTo(PX + 60, 40, PX + 110, 110); c.closePath(); }, lin(ctx, 0, 60, 0, 110, [[0, '#3a2c5e'], [1, '#1a1438']]), 0.4, [PX, 30, 130, 90]);
    cone(ctx, PX + 60, 110, 90, 760, 880, '#ffb35c', 0.13 * f);
    light(ctx, PX + 60, 112, 70, '#ffe2a8', 0.6 * f);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(PX + 60, FLOOR + 10); ctx.scale(1, 0.15);
    ctx.fillStyle = rad(ctx, 0, 0, 0, 420, [[0, rgba('#ffb35c', 0.35 * f)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(-420, -420, 840, 840); ctx.restore();
    person(ctx, t, PX, 1, false);
    // the big tick lands: its warm flash on both clipboards
    const flash = ramp(t, BIG, BIG + 0.15) * (1 - ramp(t, BIG + 0.4, BIG + 1.0));
    light(ctx, PX + 150, FLOOR - 620, 180, '#ffb35c', 0.4 * flash);
    light(ctx, 2 * MX - PX - 150, FLOOR - 620, 180, '#ffb35c', 0.3 * flash);
    K.dust(ctx, t, PX - 260, 140, 640, 760, '#ffe2a8', 0.3);
  });
}

module.exports = { T0, T1, draw };
