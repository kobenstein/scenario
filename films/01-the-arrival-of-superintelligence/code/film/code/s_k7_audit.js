// "Anthropic tested how much that matters. They hid a secret goal inside a model and gave it to four teams of auditors.
//  Three found it. The one team that wasn't allowed to see the training data missed it."
// A dark hall. A cyan orb (the model) on a plinth; a small amber glyph (the hidden goal) sinks into it and goes dim.
// Threads run out to four tables of auditors, and from a pile of training data to three of them. Three tables' search
// beams find the glyph and light up; the fourth, walled off from the data, sweeps around it and misses.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const { gf, cached, rr, figure } = K;

const T0 = 414.50, T1 = 428.30;
const O = [960, 360], OR = 118;                // the model
const D = [470, 455];                          // the pile of training data
const TABLES = [
  { x: 330, y: 720, give: 420.75, find: 422.87 },
  { x: 760, y: 830, give: 420.95, find: 423.15 },
  { x: 1180, y: 830, give: 421.15, find: 423.42 },
  { x: 1590, y: 720, give: 421.35, find: null },
];
const DROP = 417.93, SEAL = 419.14, WALL = 424.6;

// the hidden goal: a small four-point star
function glyph(ctx, x, y, s, a, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a; ctx.fillStyle = '#ffd28c';
  ctx.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? s * 0.32 : s, an = i * Math.PI / 4; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.closePath(); ctx.fill(); ctx.restore();
}
function glyphPos(t) {
  if (t < SEAL) { const k = ease(clamp((t - DROP) / (SEAL - DROP))); return [O[0] + 10 * Math.sin(k * 3), lerp(-80, O[1] + 20, k)]; }
  return [O[0] + 34 * Math.sin((t - SEAL) * 0.9), O[1] + 24 + 18 * Math.cos((t - SEAL) * 0.7)];
}

function hallArt(c) {
  gf(c, cc => cc.rect(-300, -300, 2520, 1700), lin(c, 0, -300, 0, 1300, [[0, '#07081c'], [0.45, '#141238'], [1, '#0a0a1e']]), 0.55);
  // floor plane
  gf(c, cc => { cc.moveTo(-300, 520); cc.lineTo(2220, 520); cc.lineTo(2220, 1400); cc.lineTo(-300, 1400); cc.closePath(); }, lin(c, 0, 520, 0, 1300, [[0, '#1d1844'], [1, '#0c0b22']]), 0.5);
  c.strokeStyle = 'rgba(120,110,200,0.08)'; c.lineWidth = 2;
  for (let i = -12; i <= 12; i++) { c.beginPath(); c.moveTo(960 + i * 60, 520); c.lineTo(960 + i * 260, 1400); c.stroke(); }
  for (let y = 560, k = 1; y < 1400; k *= 1.25, y += 40 * k) { c.beginPath(); c.moveTo(-300, y); c.lineTo(2220, y); c.stroke(); }
  // tall dark pillars
  for (const x of [80, 600, 1320, 1840]) gf(c, cc => cc.rect(x - 40, -300, 80, 830), lin(c, x - 40, 0, x + 40, 0, [[0, '#1a1840'], [1, '#0a0a20']]), 0.5);
}
function dataArt(c) {
  // a pile of training data: stacked sheets and drives, cyan-cream
  const r = rng(8);
  gf(c, cc => { cc.ellipse(D[0], D[1] + 40, 120, 26, 0, 0, 7); }, '#0c0b24', 0);
  for (let i = 0; i < 14; i++) {
    const w = 150 - i * 5 + r() * 10, x = D[0] - w / 2 + (r() - 0.5) * 14, y = D[1] + 30 - i * 11;
    gf(c, cc => rr(cc, x, y, w, 10, 2), i % 3 ? lin(c, x, 0, x + w, 0, [[0, '#cfe8ee'], [1, '#7fa8b8']]) : lin(c, x, 0, x + w, 0, [[0, '#8fe6ff'], [1, '#0a6f8c']]), 0.3, [x - 2, y - 2, w + 4, 14]);
  }
}

function seated(ctx, t, x, y, s, k, look, slump, raise) {
  const b = Math.sin(t * 1.6 + k * 1.7);
  const o = { x, y: y + b * s, s, facing: 'back', br: b, lean: 0.03 * Math.sin(t * 0.6 + k) + slump * 0.12, turn: look, tilt: 0.1 + slump * 0.35, lx: x < 960 ? 1 : -1,
    pal: [['#f0a25a', '#b8622a', '#4a1e0c'], ['#e8964e', '#a85424', '#401a0a'], ['#ffc27c', '#cf7a36', '#5a2a12']][k % 3], grain: 0.3,
    arms: [{ a1: 2.3, a2: -0.5, behind: true }, raise > 0 ? { tx: x + 30 * s, ty: y - lerp(110, 330, out(raise)) * s, bend: 1 } : { a1: 0.85, a2: -2.6, behind: true }],
    rim: C.cyan, rimA: 0.3, rimDx: 0, rimDy: -2 };
  figure(ctx, o);
  // chair back
  const cw = 54 * s, cy = y + 8 * s;
  gf(ctx, c => { c.moveTo(x - cw, cy + 90 * s); c.lineTo(x - cw * 0.95, cy - 30 * s); c.quadraticCurveTo(x, cy - 46 * s, x + cw * 0.95, cy - 30 * s); c.lineTo(x + cw, cy + 90 * s); c.closePath(); },
    lin(ctx, 0, cy - 40 * s, 0, cy + 90 * s, [[0, '#2a2458'], [1, '#07071a']]), 0.4, [x - 70 * s, cy - 60 * s, 140 * s, 160 * s]);
}

function draw(ctx, t) {
  // camera: push to the orb as the goal is hidden, back out for the teams, then over to team four
  const k1 = ramp(t, 415.0, 418.6), k2 = ramp(t, 419.7, 421.0), k3 = ramp(t, 424.1, 425.7), k4 = ramp(t, 427.3, T1);
  let fx = lerp(lerp(lerp(960, 960, k1), 960, k2), 1360, k3), fy = lerp(lerp(lerp(560, 400, k1), 580, k2), 560, k3);
  let z = lerp(lerp(lerp(1.0, 1.32, k1), 1.0, k2), 1.32, k3) * (1 + 0.02 * k4);
  fx += L.drift(t, 1, 31) * 5; fy += L.drift(t, 1, 36) * 3;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-fx, -fy);
  cached(ctx, 'k7hall', -300, -300, 2220, 1400, hallArt, 0.8);
  const pulse = 0.9 + 0.1 * Math.sin(t * 2.1);
  light(ctx, O[0], O[1] + 60, 700, C.cyan, 0.13 * pulse);
  // training data pile, lit cool from within
  cached(ctx, 'k7data', D[0] - 140, D[1] - 160, D[0] + 140, D[1] + 80, dataArt);
  light(ctx, D[0], D[1] - 20, 200, C.cyanW, 0.12);
  L.label(ctx, t, 421.6, T1, 'training data', null, D[0] - 110, D[1] + 80, { color: C.cyan });
  // plinth
  gf(ctx, c => { c.moveTo(O[0] - 110, O[1] + 120); c.lineTo(O[0] + 110, O[1] + 120); c.lineTo(O[0] + 150, O[1] + 230); c.lineTo(O[0] - 150, O[1] + 230); c.closePath(); }, lin(ctx, 0, O[1] + 120, 0, O[1] + 230, [[0, '#2c2860'], [1, '#121030']]), 0.5, [O[0] - 160, O[1] + 110, 320, 130]);
  gf(ctx, c => c.ellipse(O[0], O[1] + 120, 110, 22, 0, 0, 7), '#3a3478', 0.4, [O[0] - 120, O[1] + 95, 240, 50]);
  // the model
  const seal = ramp(t, SEAL - 0.1, SEAL + 0.4), rip = (t > SEAL) ? Math.exp(-(t - SEAL) * 3) : 0;
  gf(ctx, c => c.arc(O[0], O[1], OR * (1 + 0.04 * rip * Math.sin((t - SEAL) * 20)), 0, 7), rad(ctx, O[0] - 40, O[1] - 50, 10, OR * 1.2, [[0, '#d8f7ff'], [0.35, '#5cc8e8'], [0.8, '#0a6f8c'], [1, '#063a52']]), 0.35, [O[0] - 140, O[1] - 140, 280, 280]);
  // inner swirl
  ctx.save(); ctx.beginPath(); ctx.arc(O[0], O[1], OR - 4, 0, 7); ctx.clip();
  ctx.strokeStyle = rgba(C.cyanW, 0.25); ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(O[0], O[1], OR * (0.3 + i * 0.12), OR * 0.18, t * 0.3 + i, 0, 7); ctx.stroke(); }
  // the glyph inside: bright as it sinks in, then dim and hard to see, until a beam finds it
  const found = TABLES.slice(0, 3).reduce((m, T) => Math.max(m, ramp(t, T.find, T.find + 0.25)), 0);
  const [gx, gy] = glyphPos(t);
  if (t > DROP) { const a = t < SEAL ? 1 : lerp(1, 0.3, ramp(t, SEAL, SEAL + 0.6)); glyph(ctx, gx, gy, 16 + 6 * found, Math.max(a, found), t * 0.5); }
  ctx.restore();
  // outside the orb while it falls
  if (t > DROP - 0.1 && t < SEAL) { glyph(ctx, gx, gy, 16, ramp(t, DROP - 0.1, DROP + 0.2), t * 0.5); light(ctx, gx, gy, 60, '#ffb35c', 0.5); }
  if (rip > 0.02) { ctx.strokeStyle = rgba(C.cyanW, 0.6 * rip); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(O[0], O[1], OR + (1 - rip) * 90, 0, 7); ctx.stroke(); }
  light(ctx, O[0], O[1], 260, C.cyan, 0.28 * pulse);
  if (found > 0) light(ctx, gx, gy, 110, '#ffb35c', 0.6 * found);
  // threads out to the tables (copies of the model) and from the data pile to three of them
  TABLES.forEach((T, i) => {
    const k = out(clamp((t - T.give) / 0.5)); if (k <= 0) return;
    const sx = O[0] + (T.x - O[0]) * 0.12, sy = O[1] + 100, ex = lerp(sx, T.x, k), ey = lerp(sy, T.y - 40, k);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.cyan, 0.45); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + ex) / 2, Math.max(sy, ey) + 30, ex, ey); ctx.stroke();
    // the data thread (dotted)
    const kd = out(clamp((t - T.give - 0.25) / 0.6)), wallX = 1440;
    let dx1 = lerp(D[0], T.x, kd), dy1 = lerp(D[1] + 20, T.y - 30, kd);
    if (i === 3) { const blocked = ramp(t, WALL, WALL + 0.5); const stop = lerp(T.x, wallX - 40, blocked); if (dx1 > stop) { const u = (stop - D[0]) / (T.x - D[0]); dx1 = stop; dy1 = lerp(D[1] + 20, T.y - 30, u); } }
    ctx.setLineDash([4, 10]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = rgba(C.cyanW, 0.5); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(D[0], D[1] + 20); ctx.quadraticCurveTo((D[0] + dx1) / 2, Math.max(D[1], dy1) + 60, dx1, dy1); ctx.stroke(); ctx.restore();
  });
  // tables, back row first
  for (const i of [0, 3, 1, 2]) {
    const T = TABLES[i], on = ramp(t, T.give + 0.3, T.give + 0.7);
    const got = T.find ? ramp(t, T.find, T.find + 0.3) : 0, miss = i === 3 ? ramp(t, 427.1, 427.7) : 0;
    const lampA = (0.35 + 0.65 * on) * (1 + 0.8 * got) * (1 - 0.7 * miss);
    // table top
    gf(ctx, c => c.ellipse(T.x, T.y, 170, 46, 0, 0, 7), lin(ctx, 0, T.y - 46, 0, T.y + 46, [[0, '#3a3270'], [1, '#1c1840']]), 0.45, [T.x - 180, T.y - 50, 360, 100]);
    gf(ctx, c => { c.moveTo(T.x - 170, T.y); c.lineTo(T.x - 170, T.y + 16); c.ellipse(T.x, T.y + 16, 170, 46, 0, Math.PI, 0, true); c.lineTo(T.x + 170, T.y); c.ellipse(T.x, T.y, 170, 46, 0, 0, Math.PI); c.closePath(); }, '#14112e', 0.3, [T.x - 180, T.y - 10, 360, 80]);
    // papers and a laptop
    ctx.fillStyle = rgba(C.cream, 0.8); ctx.save(); ctx.translate(T.x - 80, T.y - 8); ctx.rotate(-0.2); ctx.fillRect(0, 0, 34, 22); ctx.restore();
    ctx.fillStyle = '#0c0b24'; ctx.fillRect(T.x + 40, T.y - 30, 60, 30); ctx.fillStyle = rgba(C.cyan, 0.5 * on); ctx.fillRect(T.x + 44, T.y - 27, 52, 22);
    // lamp
    ctx.strokeStyle = '#0c0b24'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(T.x - 10, T.y - 6); ctx.lineTo(T.x - 6, T.y - 70); ctx.stroke();
    gf(ctx, c => { c.moveTo(T.x - 28, T.y - 62); c.quadraticCurveTo(T.x - 6, T.y - 96, T.x + 16, T.y - 62); c.closePath(); }, '#2a2252', 0, null);
    light(ctx, T.x - 6, T.y - 60, 140, '#ffb35c', 0.35 * lampA);
    light(ctx, T.x, T.y, 260, '#ffb35c', 0.12 * lampA);
    // the auditors, backs to us
    const look = (o) => clamp((O[0] - T.x - o) / 900, -0.7, 0.7);
    [-95, 0, 95].forEach((o, j) => seated(ctx, t, T.x + o, T.y + 92 + (j === 1 ? 10 : 0), 0.62, i * 3 + j, look(o) * (0.6 + 0.4 * on), miss * (j === 1 ? 1 : 0.6), j === 2 ? got * (1 - ramp(t, (T.find || 0) + 1.6, (T.find || 0) + 2.4)) : 0));
    // the team number
    ctx.save(); ctx.globalAlpha = on; ctx.font = '44px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.fillStyle = got > 0.5 ? '#ffb35c' : (miss > 0.5 ? C.lav : C.cream);
    ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 12; ctx.fillText(String(i + 1), T.x + 150, T.y - 70); ctx.restore();
  }
  // the wall that keeps team four from the data
  const wk = out(clamp((t - WALL) / 0.6));
  if (wk > 0) {
    const wx = 1440, wy = 760, wh = 300 * wk;
    // a frosted screen standing between team four and the data
    const q = c => { c.moveTo(wx - 40, wy + 30); c.lineTo(wx + 40, wy - 30); c.lineTo(wx + 40, wy - 30 - wh); c.lineTo(wx - 40, wy + 30 - wh); c.closePath(); };
    gf(ctx, q, lin(ctx, 0, wy - 300, 0, wy, [[0, 'rgba(164,159,196,0.55)'], [1, 'rgba(60,52,120,0.75)']]), 0.35, [wx - 50, wy - 340, 100, 380]);
    ctx.strokeStyle = rgba(C.cream, 0.5); ctx.lineWidth = 3; ctx.beginPath(); q(ctx); ctx.stroke();
    if (wk > 0.9) { ctx.save(); ctx.translate(wx + 4, wy - 120); ctx.transform(1, -0.75, 0, 1, 0, 0); ctx.rotate(-Math.PI / 2); ctx.font = '22px "Inter SemiBold"'; ctx.letterSpacing = '3px'; ctx.textAlign = 'center'; ctx.fillStyle = rgba(C.cream, 0.85 * ramp(t, 425.3, 425.8)); ctx.fillText('NO DATA', 0, 8); ctx.restore(); }
  }
  // search beams: three find the glyph; the fourth sweeps around it and misses
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  TABLES.forEach((T, i) => {
    const sx = T.x - 6, sy = T.y - 64;
    if (T.find) {
      const k = out(clamp((t - T.find + 0.35) / 0.35)); if (k <= 0) return;
      const ex = lerp(sx, gx, k), ey = lerp(sy, gy, k);
      ctx.strokeStyle = rgba('#ffb35c', 0.55); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = rgba('#ffb35c', 0.12); ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    } else {
      const k = out(clamp((t - 425.9) / 0.5)), fade = 1 - ramp(t, 427.2, 427.9); if (k <= 0 || fade <= 0) return;
      const a = (t - 425.9) * 2.2, ex = O[0] + Math.cos(a) * 80 + 30, ey = O[1] - 60 + Math.sin(a * 1.3) * 40;
      ctx.strokeStyle = rgba('#ffb35c', 0.4 * fade); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(lerp(sx, ex, k), lerp(sy, ey, k)); ctx.stroke();
      light(ctx, lerp(sx, ex, k), lerp(sy, ey, k), 40, '#ffb35c', 0.3 * fade);
    }
  });
  ctx.restore();
  K.dust(ctx, t, 600, 150, 760, 500, C.cyanW, 0.25);
  ctx.restore();
  // type, in screen space
  L.label(ctx, t, 414.95, 420.2, 'Anthropic', 'hidden-goal test · 2025', 96, 90, { color: C.cyan });
  L.label(ctx, t, 421.0, 424.0, 'Four teams of auditors', null, 96, 90);
  L.label(ctx, t, 425.5, T1, 'no training data', 'team 4', 1400, 110, { color: C.lav });
}

module.exports = { T0, T1, draw };
