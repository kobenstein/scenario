// "In 2025, Anthropic wrote: 'we don't understand how models do most of the things they do.'"
// A huge glowing cyan orb, milky and opaque. A small person shines a torch at it: the beam stops at the surface.
// The quote writes itself word by word on the left. Exports orb() for the machine in the two endings.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out } = L;
const { grainFill, blob, pat } = require('./s_k4_gap');
const { figure } = require('./s_timeline');

const T0 = 215.30, T1 = 223.00;

// ---------------------------------------------------------------- the orb (the model)
// o: { clarity 0..1 (milky -> you can see the structure inside), crack 0..1, patch 0..1, seam 0..1 (warm mend), lamp 0..1 }
const RN = rng(77);
const NODES = Array.from({ length: 46 }, () => { const u = RN() * 2 - 1, a = RN() * Math.PI * 2, rr = Math.cbrt(RN()) * 0.82; return [Math.sqrt(1 - u * u) * Math.cos(a) * rr, u * rr, Math.sqrt(1 - u * u) * Math.sin(a) * rr, RN()]; });
const EDGES = [];
for (let i = 0; i < NODES.length; i++) for (let j = i + 1; j < NODES.length; j++) { const d = Math.hypot(NODES[i][0] - NODES[j][0], NODES[i][1] - NODES[j][1], NODES[i][2] - NODES[j][2]); if (d < 0.42) EDGES.push([i, j, d]); }
const BANDS = Array.from({ length: 9 }, () => [RN() * Math.PI, 0.1 + RN() * 0.35, (RN() - 0.5) * 0.5, 8 + RN() * 26, RN()]);
// the crack: a jagged line across the lower right of the shell (unit coordinates)
const CRACK = [[0.02, -0.62], [0.14, -0.52], [0.20, -0.56], [0.30, -0.42], [0.38, -0.45], [0.47, -0.30], [0.55, -0.32], [0.66, -0.16]];
const BRANCH = [[0.30, -0.42], [0.36, -0.30], [0.33, -0.20]];

function orb(ctx, x, y, r, t, o = {}) {
  const cl = o.clarity ?? 0, crack = o.crack ?? 0, seam = o.seam ?? 0, lamp = o.lamp ?? 0, dim = o.dim ?? 1;
  const br = 0.92 + 0.08 * Math.sin(t * 1.9) + 0.03 * Math.sin(t * 5.1);
  const wm0 = o.warm ?? 0;
  light(ctx, x, y, r * 2.6, C.cyan, 0.30 * br * dim * (1 - wm0));
  light(ctx, x, y, r * 2.6, C.amber, 0.45 * br * dim * wm0);
  light(ctx, x, y, r * 1.5, C.cyanW, 0.16 * br * dim);
  const body = c => c.arc(x, y, r, 0, Math.PI * 2);
  grainFill(ctx, body, rad(ctx, x - r * 0.3, y - r * 0.35, r * 0.05, r * 1.15, [[0, '#effcff'], [0.28, '#7fdcf5'], [0.68, '#178fb6'], [1, '#08405e']]), 0.45);
  ctx.save(); ctx.beginPath(); body(ctx); ctx.clip(); light(ctx, x + r * 0.1, y + r * 0.1, r * 0.9, C.cyanW, 0.22 * br * dim); ctx.restore();
  ctx.save(); ctx.beginPath(); body(ctx); ctx.clip();
  // milky currents inside: slow, layered, you cannot read them
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [a0, ry, w, lw, k] of BANDS) {
    const a = a0 + t * w;
    ctx.save(); ctx.translate(x + Math.sin(t * 0.3 + k * 9) * r * 0.08, y + Math.cos(t * 0.27 + k * 5) * r * 0.08); ctx.rotate(a);
    ctx.strokeStyle = rgba(C.cyanW, (0.05 + 0.06 * k) * (1 - 0.6 * cl)); ctx.lineWidth = lw * r / 300;
    ctx.beginPath(); ctx.ellipse(0, 0, r * (0.55 + 0.35 * k), r * ry, 0, 0, Math.PI * 1.4 + k); ctx.stroke(); ctx.restore();
  }
  // the structure inside: a slowly turning lattice, only readable when it is lit
  const rot = t * 0.18, cs = Math.cos(rot), sn = Math.sin(rot);
  const P = NODES.map(([a, b, c, k]) => { const xx = a * cs + c * sn, zz = -a * sn + c * cs; return [x + xx * r, y + b * r, zz, k]; });
  const ea = 0.05 + 0.75 * cl;
  ctx.lineWidth = 1.5 + 2.5 * cl;
  for (const [i, j, d] of EDGES) { const zz = (P[i][2] + P[j][2]) / 2; ctx.strokeStyle = rgba(cl > 0.3 ? '#ffe2b0' : C.cyanW, ea * (0.45 + 0.35 * zz) * (1 - d)); ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); ctx.lineTo(P[j][0], P[j][1]); ctx.stroke(); }
  for (const [px, py, zz, k] of P) { const a = ea * (0.6 + 0.4 * zz) * (0.7 + 0.3 * Math.sin(t * 3 + k * 20)); ctx.fillStyle = rgba(cl > 0.3 ? '#ffd9a0' : C.cyanW, a); ctx.beginPath(); ctx.arc(px, py, (2 + 4 * cl) * (1 + 0.3 * zz), 0, Math.PI * 2); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
  // frost: the milky skin that hides it all
  ctx.fillStyle = rad(ctx, x, y, r * 0.2, r, [[0, rgba('#bfefff', 0.22 * (1 - cl))], [0.8, rgba('#7fd4ee', 0.16 * (1 - cl))], [1, rgba('#d8f7ff', 0.40 * (1 - cl))]]);
  ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  const wm = o.warm ?? 0;
  if (wm > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, y, 0, r, [[0, rgba('#ffe2b0', 0.6 * wm)], [0.6, rgba('#ffb35c', 0.32 * wm)], [1, rgba('#ff9a4a', 0.2 * wm)]]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.globalCompositeOperation = 'source-over'; }
  if (lamp > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x - r * 0.2, y - r * 0.5, 0, r * 1.2, [[0, rgba('#ffcf8a', 0.35 * lamp)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.globalCompositeOperation = 'source-over'; }
  // terminator shadow lower right
  ctx.fillStyle = rad(ctx, x - r * 0.45, y - r * 0.45, r * 0.6, r * 1.9, [[0, 'rgba(4,8,30,0)'], [1, 'rgba(4,8,30,0.55)']]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  ctx.restore();
  // rim and specular
  ctx.save(); ctx.strokeStyle = rgba(C.cyanW, 0.45 * dim); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r - 1, Math.PI * 0.95, Math.PI * 1.75); ctx.stroke();
  ctx.translate(x - r * 0.42, y - r * 0.5); ctx.rotate(-0.6); ctx.fillStyle = rad(ctx, 0, 0, 0, r * 0.22, [[0, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]); ctx.scale(1.8, 0.8);
  ctx.beginPath(); ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2); ctx.restore(); ctx.save(); ctx.translate(x - r * 0.42, y - r * 0.5); ctx.rotate(-0.6); ctx.scale(1.8, 0.7); ctx.fillStyle = rad(ctx, 0, 0, 0, r * 0.2, [[0, 'rgba(255,255,255,0.5)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(-r * 0.2, -r * 0.2, r * 0.4, r * 0.4); ctx.restore();
  // the crack and the mend
  if (crack > 0 || seam > 0) {
    const pts = CRACK.map(([a, b]) => [x + a * r, y + b * r]), bp = BRANCH.map(([a, b]) => [x + a * r, y + b * r]);
    const n = Math.max(2, Math.ceil(pts.length * clamp(crack + seam)));
    const pl = (arr, m) => { ctx.beginPath(); arr.slice(0, m).forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); };
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const leak = crack * (1 - seam);
    if (leak > 0) {
      ctx.globalCompositeOperation = 'lighter';
      pl(pts, n); ctx.strokeStyle = rgba(C.cyanW, 0.22 * leak); ctx.lineWidth = 34; ctx.stroke(); pl(pts, n); ctx.strokeStyle = rgba('#ffffff', 0.5 * leak); ctx.lineWidth = 10; ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      pl(pts, n); ctx.strokeStyle = rgba('#03101e', 0.9 * leak); ctx.lineWidth = 4; ctx.stroke();
      if (crack > 0.6) { pl(bp, 3); ctx.lineWidth = 3; ctx.stroke(); }
      const mid = pts[3]; light(ctx, mid[0], mid[1], r * 0.5, C.cyanW, (0.35 + 0.25 * Math.sin(t * 9) * Math.sin(t * 3.7)) * leak * (o.patch ? 1 - 0.6 * o.patch : 1));
    }
    if (seam > 0) {
      const m = Math.max(2, Math.ceil(pts.length * seam));
      ctx.globalCompositeOperation = 'lighter'; pl(pts, m); ctx.strokeStyle = rgba(C.amber, 0.45 * seam); ctx.lineWidth = 18; ctx.stroke();
      ctx.globalCompositeOperation = 'source-over'; pl(pts, m); ctx.strokeStyle = rgba('#ffd9a0', seam); ctx.lineWidth = 6; ctx.stroke();
      if (seam > 0.7) { pl(bp, 3); ctx.strokeStyle = rgba('#ffd9a0', (seam - 0.7) / 0.3); ctx.lineWidth = 5; ctx.stroke(); }
      const tip = pts[m - 1]; light(ctx, tip[0], tip[1], 90, '#ffd9a0', 0.8 * seam * (seam < 1 ? 1 : 0.5));
    }
    ctx.restore();
  }
}

// ---------------------------------------------------------------- the scene
const OX = 1360, OY = 450, ORR = 330;
const WORDS = [['“We', 218.12], ['don’t', 218.90], ['understand', 219.12], ['|', 0], ['how', 219.78], ['models', 219.98], ['do', 220.42], ['most', 220.72], ['|', 0], ['of', 221.00], ['the', 221.10], ['things', 221.22], ['they', 221.54], ['do.”', 221.74]];
const R = rng(215);
const DUST = Array.from({ length: 70 }, () => [R() * W, R() * H, R(), R()]);

function draw(ctx, t) {
  const z = lerp(1.0, 1.08, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 0.8, 5) * 6, dy = drift(t, 0.8, 6) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(OX - 200, OY); ctx.scale(z, z); ctx.translate(-OX + 200 + dx * par, -OY + dy * par); fn(); ctx.restore(); };
  // room: dark, with the orb's cyan spilling over a floor
  layer(0.3, () => {
    ctx.fillStyle = lin(ctx, 0, -100, 0, 1200, [[0, '#070920'], [0.55, '#11143a'], [1, '#0a0a1e']]); ctx.fillRect(-300, -300, W + 600, H + 600);
    blob(ctx, OX, OY + 40, 1100, 620, '#0a6f8c', 0.38);
    ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = pat(ctx); ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
  });
  // floor plane with the orb's reflection
  layer(0.6, () => {
    grainFill(ctx, c => { c.moveTo(-300, 860); c.lineTo(W + 300, 860); c.lineTo(W + 300, H + 300); c.lineTo(-300, H + 300); c.closePath(); }, lin(ctx, 0, 860, 0, H, [[0, '#1a2252'], [1, '#090a1e']]), 0.55);
    blob(ctx, OX, 880, 520, 60, C.cyan, 0.30, true);
    ctx.strokeStyle = rgba(C.cyan, 0.18); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-300, 860); ctx.lineTo(W + 300, 860); ctx.stroke();
  });
  // the orb hovers, breathing
  const bob = Math.sin(t * 0.9) * 8;
  layer(0.8, () => {
    // shadow on the floor
    blob(ctx, OX, 885, 380 - bob, 40, C.cyan, 0.22, true);
    orb(ctx, OX, OY + bob, ORR, t, {});
    // where the torch hits, the light spreads over the skin and goes no further
    const hit = ramp(t, 216.0, 216.8);
    const hx = OX - ORR * 0.86, hy = OY + bob + ORR * 0.42;
    light(ctx, hx, hy, 140, '#ffe6b8', 0.45 * hit * (0.9 + 0.1 * Math.sin(t * 11)));
    ctx.save(); ctx.beginPath(); ctx.arc(OX, OY + bob, ORR, 0, Math.PI * 2); ctx.clip();
    blob(ctx, hx + 20, hy - 10, 120, 160, '#ffd9a0', 0.32 * hit, true); ctx.restore();
  });
  // the small person with a torch, lower middle: scale against the orb
  layer(1.0, () => {
    const fx = 900, fy = 862, s = 0.5, b = Math.sin(t * 1.7);
    const reach = ramp(t, 215.6, 216.4);
    const hipY = fy - 152 * s;
    ctx.save(); ctx.fillStyle = 'rgba(3,4,14,0.5)'; ctx.beginPath(); ctx.ellipse(fx - 30, fy + 4, 60, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    const tx = lerp(fx + 40 * s, fx + 120 * s, reach) + Math.sin(t * 1.3) * 2, ty = lerp(hipY - 20 * s, hipY - 150 * s, reach) + Math.sin(t * 1.1) * 2;
    const res = figure(ctx, { x: fx, y: hipY + b * 0.8, s, facing: 'back', br: b, lean: -0.03, turn: 0.55 + 0.08 * Math.sin(t * 0.6), tilt: -0.12, lx: 1, grain: 0.35,
      rim: C.cyan, rimA: 0.55, rimDx: 2, rimDy: -1, pal: ['#ffb35c', '#c9702e', '#5a2a12'],
      legs: [{ a1: Math.PI / 2 + 0.1, a2: Math.PI / 2 + 0.06 }, { a1: Math.PI / 2 - 0.08, a2: Math.PI / 2 - 0.03 }],
      arms: [{ a1: Math.PI / 2 + 0.12, a2: Math.PI / 2 + 0.02 }, { tx, ty, bend: -1 }] });
    // the torch and its beam: a cone that ends at the orb's skin
    const hd = res.hands[1], hit = ramp(t, 216.0, 216.8);
    const hx = OX - ORR * 0.86, hy = OY + Math.sin(t * 0.9) * 8 + ORR * 0.42;
    const ang = Math.atan2(hy - hd[1], hx - hd[0]), len = Math.hypot(hx - hd[0], hy - hd[1]) * hit;
    ctx.save(); ctx.translate(hd[0], hd[1]); ctx.rotate(ang);
    ctx.fillStyle = '#1a0d06'; ctx.fillRect(-4, -4, 16, 8);
    ctx.globalCompositeOperation = 'lighter';
    for (const [wd, a] of [[1, 0.07], [0.7, 0.08], [0.45, 0.10], [0.22, 0.12]]) {
      ctx.fillStyle = lin(ctx, 0, 0, len, 0, [[0, rgba('#ffe6b8', a * 2.4)], [0.8, rgba('#ffd9a0', a)], [1, rgba('#ffd9a0', a * 1.4)]]);
      ctx.beginPath(); ctx.moveTo(12, -3 * wd); ctx.lineTo(len, -80 * hit * wd); ctx.quadraticCurveTo(len + 12 * wd, 0, len, 80 * hit * wd); ctx.lineTo(12, 3 * wd); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    light(ctx, hd[0], hd[1], 40, '#ffe6b8', 0.6 * hit);
  });
  // dust in the air, catching the light
  for (const [x, y, k, s] of DUST) { const xx = (x + (t - T0) * (6 + 10 * s)) % W, yy = y + Math.sin(t * 0.4 + k * 7) * 20, d = Math.hypot(xx - OX, yy - OY) / 900; const a = (0.1 + 0.25 * Math.sin(t * (0.7 + k) + k * 9)) * clamp(1.2 - d); if (a > 0) { ctx.fillStyle = rgba(C.cyanW, a); ctx.fillRect(xx, yy, 2, 2); } }

  // the quote, left: year, words landing on the VO, attribution
  L.stamp(ctx, t, 215.96, T1 + 1, '2025', null, { x: 110, y: 120, size: 110, color: C.cream });
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.font = '74px "Instrument Serif"'; ctx.shadowColor = 'rgba(4,4,16,0.85)'; ctx.shadowBlur = 22;
  let x = 112, y = 400;
  for (const [w, tw] of WORDS) {
    if (w === '|') { x = 112; y += 92; continue; }
    const a = ramp(t, tw - 0.06, tw + 0.3), wd = ctx.measureText(w).width;
    if (a > 0) { ctx.globalAlpha = a; ctx.fillStyle = C.cream; ctx.fillText(w, x, y + (1 - out((t - tw + 0.06) / 0.5)) * 14); }
    x += wd + 18;
  }
  ctx.restore();
  const aa = ramp(t, 217.26, 217.9);
  if (aa > 0) { ctx.save(); ctx.globalAlpha = aa; ctx.strokeStyle = C.cyan; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(114, 652); ctx.lineTo(114 + 56 * out((t - 217.26) / 0.8), 652); ctx.stroke();
    ctx.font = '26px "Inter Medium"'; ctx.letterSpacing = '6px'; ctx.fillStyle = C.lav; ctx.textBaseline = 'top'; ctx.fillText('ANTHROPIC', 186, 638); ctx.restore(); }
}

module.exports = { T0, T1, draw, orb };
