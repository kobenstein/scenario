// "Yann LeCun, one of the people behind modern AI, says safety is 'just another engineering problem,'
//  like making jet engines safe."
// A hangar at night. A huge jet engine on its stand, its casing cut away: fan blades turning slowly, compressor stages
// shimmering, the combustor glowing. Two engineers inspect it with amber lamps; one checks a tablet on the gantry.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, label } = L;
const { gf, rr, cap, cached, quote, tiny } = require('./s_k9_kit');

const T0 = 554.8, T1 = 564.25;
const AX = 520, AY = 545;          // engine axis: intake at x = IX, exhaust at ~1700
const IX = 560, IR = 250, ISQ = 0.34;

function hangarArt(c) {
  gf(c, cc => cc.rect(-300, -300, W + 600, 1100), lin(c, 0, -300, 0, 800, [[0, '#070818'], [0.6, '#121434'], [1, '#1a1a44']]), 0.55);
  // big hangar doors: tall panels with a strip of night between them
  for (let k = 0; k < 9; k++) { const x = -200 + k * 270;
    gf(c, cc => cc.rect(x, 40, 250, 740), lin(c, x, 0, x + 250, 0, [[0, '#15163a'], [1, '#0d0e28']]), 0.5);
    c.fillStyle = 'rgba(164,159,196,0.07)'; c.fillRect(x, 40, 4, 740); for (let y = 120; y < 780; y += 120) c.fillRect(x, y, 250, 3); }
  // roof truss
  c.strokeStyle = 'rgba(20,20,50,0.95)'; c.lineWidth = 10; c.beginPath(); c.moveTo(-300, 40); c.lineTo(W + 300, 40); c.stroke();
  c.lineWidth = 4; for (let x = -300; x < W + 300; x += 120) { c.beginPath(); c.moveTo(x, -60); c.lineTo(x + 60, 40); c.lineTo(x + 120, -60); c.stroke(); }
  // floor
  gf(c, cc => cc.rect(-300, 780, W + 600, 600), lin(c, 0, 780, 0, 1300, [[0, '#24224e'], [1, '#0a0a1e']]), 0.6);
  c.fillStyle = 'rgba(255,179,92,0.28)'; c.fillRect(-300, 880, W + 600, 6);
  for (let x = -300; x < W + 300; x += 90) { c.fillStyle = 'rgba(255,179,92,0.22)'; c.save(); c.translate(x, 940); c.transform(1, 0, -0.6, 1, 0, 0); c.fillRect(0, 0, 40, 12); c.restore(); }
  // tool cart and crates
  gf(c, cc => { rr(cc, 1640, 700, 160, 100, 6); }, lin(c, 0, 700, 0, 800, [[0, '#3a2a6a'], [1, '#1a1440']]), 0.5);
  c.fillStyle = 'rgba(255,179,92,0.3)'; for (let k = 0; k < 3; k++) c.fillRect(1652, 716 + k * 26, 136, 3);
  gf(c, cc => { cc.rect(-120, 660, 170, 130); cc.rect(60, 720, 110, 70); }, lin(c, 0, 660, 0, 790, [[0, '#2a2258'], [1, '#141032']]), 0.5);
}

// stand under the engine
function standArt(c) {
  gf(c, cc => { cc.moveTo(720, 760); cc.lineTo(780, 690); cc.lineTo(1420, 690); cc.lineTo(1480, 760); cc.lineTo(1500, 800); cc.lineTo(700, 800); cc.closePath(); }, lin(c, 0, 690, 0, 800, [[0, '#2e2a62'], [1, '#121030']]), 0.5);
  for (const x of [760, 1440]) gf(c, cc => cc.ellipse(x, 806, 22, 22, 0, 0, 7), '#0b0a1c', 0);
  c.fillStyle = 'rgba(255,179,92,0.45)'; for (let x = 790; x < 1410; x += 60) { c.save(); c.translate(x, 742); c.transform(1, 0, -0.7, 1, 0, 0); c.fillRect(0, 0, 26, 10); c.restore(); }
}

const STAGES = (() => { const a = []; // compressor (many, shrinking), combustor, turbine (few, growing)
  for (let i = 0; i < 9; i++) a.push({ x: 760 + i * 40, r: 168 - i * 9, n: 22, kind: 'c' });
  a.push({ x: 1160, r: 104, kind: 'b' });
  for (let i = 0; i < 4; i++) a.push({ x: 1290 + i * 44, r: 112 + i * 14, n: 16, kind: 't' });
  return a; })();

function engine(ctx, t) {
  const spin = t * 2.4 + 0.6 * Math.sin(t * 0.3);          // fan: slow, windmilling
  const fast = t * 17;
  // shadow on the floor
  ctx.fillStyle = 'rgba(4,4,16,0.45)'; ctx.beginPath(); ctx.ellipse(1120, 806, 640, 30, 0, 0, 7); ctx.fill();
  // outer casing, lower half (the upper half is cut away)
  const top = AY, bot = AY + IR;
  const shell = c => { c.moveTo(IX, AY); c.lineTo(IX, AY); c.ellipse(IX, AY, IR * ISQ, IR, 0, 0, Math.PI / 2); c.lineTo(1260, AY + 232); c.bezierCurveTo(1420, AY + 220, 1560, AY + 160, 1620, AY + 120); c.lineTo(1620, AY); c.closePath(); };
  gf(ctx, shell, lin(ctx, 0, AY, 0, AY + IR, [[0, '#6a6fae'], [0.35, '#3d3f80'], [1, '#17183c']]), 0.45, [IX - 100, AY - 10, 1200, IR + 20]);
  // interior visible above the axis: dark cavity behind the cut
  gf(ctx, c => { c.moveTo(IX, AY); c.ellipse(IX, AY, IR * ISQ, IR, 0, -Math.PI / 2, 0); c.lineTo(1620, AY); c.lineTo(1620, AY - 120); c.bezierCurveTo(1560, AY - 160, 1420, AY - 220, 1260, AY - 232); c.lineTo(IX, AY - IR); c.closePath(); },
    lin(ctx, 0, AY - IR, 0, AY, [[0, '#090a1e'], [1, '#141638']]), 0.4, [IX - 100, AY - IR - 10, 1200, IR + 20]);
  // core casing (spool)
  gf(ctx, c => { c.moveTo(720, AY - 120); c.lineTo(1150, AY - 92); c.lineTo(1500, AY - 110); c.lineTo(1500, AY + 4); c.lineTo(720, AY + 4); c.closePath(); }, lin(ctx, 0, AY - 120, 0, AY, [[0, '#2c3070'], [1, '#141638']]), 0.4, [700, AY - 130, 820, 140]);
  // shaft
  ctx.fillStyle = lin(ctx, 0, AY - 26, 0, AY, [[0, '#8f94c8'], [1, '#3b3f7a']]); ctx.fillRect(640, AY - 22, 1000, 22);
  // stages: blade rows seen edge-on, their blades sweeping past as they spin
  for (const s of STAGES) {
    if (s.kind === 'b') {
      // combustor: a warm glowing band
      const g = 0.75 + 0.15 * Math.sin(t * 5.3) + 0.1 * Math.sin(t * 11.7);
      gf(ctx, c => rr(c, s.x - 60, AY - s.r, 120, s.r - 20, 16), lin(ctx, s.x - 60, 0, s.x + 60, 0, [[0, '#7a3b17'], [0.5, '#ffb35c'], [1, '#7a3b17']]), 0.3);
      for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba('#fff1cf', 0.5 * g); ctx.beginPath(); ctx.ellipse(s.x - 40 + k * 16, AY - s.r * 0.55 + Math.sin(t * 6 + k) * 4, 4, 12, 0, 0, 7); ctx.fill(); }
      light(ctx, s.x, AY - s.r * 0.5, 160, C.amber, 0.35 * g);
      continue;
    }
    const col = s.kind === 'c' ? '#b9c6ff' : '#e0a070';
    ctx.fillStyle = lin(ctx, s.x - 12, 0, s.x + 12, 0, [[0, '#0c0d26'], [0.5, s.kind === 'c' ? '#2a3a7a' : '#5a3020'], [1, '#0c0d26']]); ctx.beginPath(); ctx.ellipse(s.x, AY, 12, s.r, 0, Math.PI, 2 * Math.PI); ctx.fill();
    for (let k = 0; k < s.n; k++) {
      const a = (k / s.n) * Math.PI * 2 + fast * (s.kind === 'c' ? 1 : -1) * 0.13;
      const y = Math.cos(a), z = Math.sin(a); if (y < -0.02) continue;      // only the upper half is open to us
      const yy = AY - y * s.r, br = 0.35 + 0.65 * (z * 0.5 + 0.5);
      ctx.strokeStyle = rgba(col, 0.25 + 0.5 * br); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(s.x - 9, yy + 5); ctx.lineTo(s.x + 9, yy - 5); ctx.stroke();
    }
    ctx.fillStyle = rgba(col, 0.2); ctx.fillRect(s.x - 1, AY - s.r, 2, s.r);
  }
  // exhaust cone
  gf(ctx, c => { c.moveTo(1500, AY - 100); c.bezierCurveTo(1600, AY - 80, 1690, AY - 30, 1720, AY); c.lineTo(1500, AY); c.closePath(); }, lin(ctx, 1500, AY - 100, 1720, AY, [[0, '#4a4e90'], [1, '#1e2050']]), 0.4);
  // cut edge of the casing: a clean bright line
  ctx.strokeStyle = rgba(C.cyanW, 0.55); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(IX + 4, AY); ctx.lineTo(1260, AY); ctx.stroke();
  ctx.strokeStyle = rgba(C.cyanW, 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(IX, AY - IR); ctx.lineTo(1260, AY - 232); ctx.bezierCurveTo(1420, AY - 220, 1560, AY - 160, 1620, AY - 120); ctx.stroke();
  // ribs of the cut casing (ghost of the removed half)
  for (let x = 700; x < 1600; x += 110) { const r = x < 1260 ? IR - (x - IX) * 0.026 : lerp(232, 120, (x - 1260) / 360);
    ctx.strokeStyle = rgba(C.cyanW, 0.10); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, AY, r * 0.12, r, 0, -Math.PI / 2, Math.PI / 2, true); ctx.stroke(); }
  // intake lip and the fan, seen at an angle
  gf(ctx, c => c.ellipse(IX, AY, IR * ISQ + 22, IR + 22, 0, 0, 7), lin(ctx, 0, AY - IR, 0, AY + IR, [[0, '#b8bdf0'], [0.5, '#5a5fa2'], [1, '#1e2050']]), 0.4);
  gf(ctx, c => c.ellipse(IX, AY, IR * ISQ, IR, 0, 0, 7), rad(ctx, IX, AY, 20, IR, [[0, '#1c2050'], [1, '#07081a']]), 0.3);
  ctx.save(); ctx.beginPath(); ctx.ellipse(IX, AY, IR * ISQ, IR, 0, 0, 7); ctx.clip();
  ctx.translate(IX, AY); ctx.scale(ISQ, 1);
  for (let k = 0; k < 18; k++) {
    const a = spin + k * Math.PI * 2 / 18;
    ctx.save(); ctx.rotate(a);
    const sh = 0.5 + 0.5 * Math.cos(a - 0.8);
    ctx.fillStyle = lin(ctx, 0, 30, 0, IR, [[0, rgba('#c8cff8', 0.35 + 0.5 * sh)], [1, rgba('#6a70b0', 0.4 + 0.4 * sh)]]);
    ctx.beginPath(); ctx.moveTo(-10, 40); ctx.bezierCurveTo(30, 100, 60, 170, 46, IR); ctx.lineTo(10, IR); ctx.bezierCurveTo(14, 170, 0, 100, -24, 44); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // spinner with its painted spiral (shows the spin)
  ctx.fillStyle = rad(ctx, -10, -10, 4, 60, [[0, '#e8ecff'], [1, '#5a5fa2']]); ctx.beginPath(); ctx.arc(0, 0, 54, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(20,22,60,0.9)'; ctx.lineWidth = 6; ctx.beginPath();
  for (let s = 0; s <= 20; s++) { const r = s * 2.5, a = spin * 1 + s * 0.28; s ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(0, 0); } ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = rgba(C.cyanW, 0.45); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(IX, AY, IR * ISQ + 22, IR + 22, 0, -1.9, -0.6); ctx.stroke();
}

function engineers(ctx, t) {
  // one at the intake with a hand lamp, crouched a little, sweeping it over the fan
  const sweep = Math.sin(t * 0.6) * 0.25;
  const ex = 330, ey = 860;
  const eng = tiny(ctx, ex, ey, 1.12, { facing: 'back', pal: ['#ffb35c', '#c36a2b', '#5a2a12'], arm: 0.62, br: Math.sin(t * 1.6) * 1.2, coat: true, hair: '#3a1a0c', lean: 0.04 });
  const [lx, ly] = eng.handR;
  const ang = -0.28 + sweep, len = 520;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, lx, ly, lx + Math.cos(ang) * len, ly + Math.sin(ang) * len, [[0, rgba(C.amber, 0.35)], [1, rgba(C.amber, 0)]]);
  ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + Math.cos(ang - 0.16) * len, ly + Math.sin(ang - 0.16) * len); ctx.lineTo(lx + Math.cos(ang + 0.16) * len, ly + Math.sin(ang + 0.16) * len); ctx.closePath(); ctx.fill(); ctx.restore();
  light(ctx, lx, ly, 40, '#fff1cf', 0.8);
  light(ctx, lx + Math.cos(ang) * 260, ly + Math.sin(ang) * 260, 120, C.amber, 0.25);
  // gantry above the cut, a second engineer looking down into the core with a tablet
  gf(ctx, c => { c.rect(680, 250, 420, 14); c.rect(690, 264, 8, 530); c.rect(1080, 264, 8, 530); }, '#14123a', 0.3);
  ctx.strokeStyle = 'rgba(30,28,70,0.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(680, 210); ctx.lineTo(1100, 210); ctx.stroke();
  for (let x = 700; x < 1100; x += 50) { ctx.beginPath(); ctx.moveTo(x, 210); ctx.lineTo(x, 250); ctx.stroke(); }
  const look = 0.06 + 0.04 * Math.sin(t * 0.8);
  const gan = tiny(ctx, 900, 252, 1.0, { facing: 'front', pal: ['#ffc27c', '#cf7a36', '#5a2a12'], arm: 0.25, br: Math.sin(t * 1.4 + 1), hair: '#1c0a05', lean: look });
  ctx.save(); ctx.translate(gan.handR[0], gan.handR[1] - 6); ctx.rotate(-0.4); ctx.fillStyle = '#1a1a40'; ctx.fillRect(-14, -10, 28, 20); ctx.fillStyle = rgba(C.amber, 0.85); ctx.fillRect(-11, -7, 22, 14); ctx.restore();
  light(ctx, gan.handR[0], gan.handR[1] - 6, 60, C.amber, 0.4);
  cone(ctx, 910, 270, 30, 300, 240, C.amber, 0.10);
}

function draw(ctx, t) {
  const k = sm((t - T0) / (T1 - T0)), z = lerp(1.0, 1.1, k);
  const dx = drift(t, 1, 8) * 6 - 60 * k, dy = drift(t, 1, 9) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(1000, 520); ctx.scale(z, z); ctx.translate(-1000 + dx * par, -520 + dy * par); fn(); ctx.restore(); };
  layer(0.35, () => {
    cached(ctx, 'k9hangar', -300, -300, W + 300, 1300, hangarArt);
    // overhead work light: the hero
    cone(ctx, 950, -20, 160, 1500, 860, '#e8ecff', 0.10);
    light(ctx, 950, 0, 260, '#ffffff', 0.35);
  });
  layer(0.7, () => {
    cached(ctx, 'k9stand', 680, 680, 1520, 840, standArt);
    engine(ctx, t);
    light(ctx, 1000, AY - 120, 520, C.cyan, 0.12);
    engineers(ctx, t);
  });
  label(ctx, t, 555.27, 559.95, 'Yann LeCun', 'Turing Award winner · AI pioneer', 96, 90);
  quote(ctx, t, 560.07, T1 - 0.05, ['just another', 'engineering problem'], 'Yann LeCun', 1300, 84, { size: 66 });
}

module.exports = { T0, T1, draw };
