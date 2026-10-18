// "For the first time in human history, a tool is helping to make its own successor."
// A long museum shelf of human tools. Spotlights switch on one by one as the camera travels along it;
// at the far end a cyan chip draws a second chip next to itself out of lines of light.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, hash, rng, grainFill, lin, rad, rgba, light, cone, createCanvas } = L;

const T0 = 15.3, T1 = 21.45;
const SHELF = 700;
const WARM = '#ffa448';                  // spotlight amber, a touch deeper than C.amber so it stays warm over the violet wall                       // world y of the shelf top
// world x of each exhibit and the moment its spotlight ignites
const X = { axe: 380, hammer: 880, press: 1420, engine: 1990, computer: 2540, chip: 3060, clone: 3330 };
const LAMPS = [
  { x: X.axe, t: 15.6, col: WARM }, { x: X.hammer, t: 16.25, col: WARM }, { x: X.press, t: 16.9, col: WARM },
  { x: X.engine, t: 17.5, col: WARM }, { x: X.computer, t: 18.15, col: WARM }, { x: X.chip, t: 18.9, col: C.cyan },
  { x: X.clone, t: 21.0, col: C.cyan },   // the successor gets its own spotlight
];
const CHIP_Y = 560, CS = 112;            // chip centre height and size


// spotlight intensity: ignition flicker (a few stuttering frames), then a steady breathing light
function ign(t, t0) {
  if (t < t0) return 0;
  const u = t - t0;
  if (u < 0.42) { const on = hash('fl', Math.floor(t * 30), t0) > 0.42 || u > 0.34; return (on ? 1 : 0.12) * (0.45 + 0.55 * u / 0.42); }
  return 0.96 + 0.04 * Math.sin(t * 2.3 + t0 * 7);
}

function roundRect(ctx, x, y, w, h, r) { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function poly(pts) { return c => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); }; }

// small museum stand under each object
function stand(ctx, w) {
  grainFill(ctx, c => { c.moveTo(-w / 2, 0); c.lineTo(w / 2, 0); c.lineTo(w / 2 - 8, -22); c.lineTo(-w / 2 + 8, -22); c.closePath(); },
    lin(ctx, 0, -22, 0, 0, [[0, '#3a2f5c'], [1, '#14112c']]), 0.5);
  ctx.fillStyle = 'rgba(255,200,140,0.18)'; ctx.fillRect(-w / 2 + 8, -22, w - 16, 2);
}

// ---------- the exhibits (local origin = centre of the stand's foot on the shelf) ----------
function axeOnly(ctx, t) {
  ctx.fillStyle = '#2a2140'; ctx.fillRect(-3, -60, 6, 40);
  ctx.save(); ctx.translate(0, -60); ctx.rotate(0.03 * Math.sin(t * 0.6));
  const sil = [[0, -190], [24, -160], [46, -112], [56, -64], [48, -22], [24, 0], [-10, 2], [-40, -16], [-56, -58], [-50, -110], [-30, -158]];
  grainFill(ctx, poly(sil), lin(ctx, -50, -190, 50, 0, [[0, '#d9a874'], [0.45, '#a26a40'], [1, '#4d2a18']]), 0.32);
  // knapped facets
  const facets = [
    [[0, -190], [24, -160], [6, -128], [-14, -150]], [[24, -160], [46, -112], [18, -96], [6, -128]],
    [[-30, -158], [-14, -150], [-20, -104], [-50, -110]], [[46, -112], [56, -64], [26, -58], [18, -96]],
    [[-50, -110], [-20, -104], [-28, -50], [-56, -58]], [[56, -64], [48, -22], [16, -26], [26, -58]],
    [[-56, -58], [-28, -50], [-12, -14], [-40, -16]], [[6, -128], [18, -96], [-2, -78], [-20, -104]],
  ];
  facets.forEach((f, i) => grainFill(ctx, poly(f), i % 2 ? 'rgba(60,28,12,0.32)' : 'rgba(255,214,160,0.16)', 0));
  ctx.strokeStyle = 'rgba(50,22,10,0.45)'; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
  facets.forEach(f => { ctx.beginPath(); poly(f)(ctx); ctx.stroke(); });
  ctx.restore();
}

function hammerOnly(ctx, t) {
  ctx.save(); ctx.translate(0, -22); ctx.rotate(-0.06);
  // ash handle
  grainFill(ctx, c => { c.moveTo(-8, 0); c.lineTo(8, 0); c.lineTo(6, -196); c.lineTo(-6, -196); c.closePath(); },
    lin(ctx, -8, 0, 8, 0, [[0, '#c98a52'], [0.5, '#8f5428'], [1, '#4a2410']]), 0.3);
  ctx.strokeStyle = 'rgba(60,24,8,0.4)'; ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-3 + i * 2, -10 - i * 30); ctx.lineTo(-2 + i * 2, -150 + i * 20); ctx.stroke(); }
  // bronze head: square striking face on the right, tapering peen on the left, a collar round the eye
  const head = c => { c.moveTo(-70, -214); c.lineTo(-20, -228); c.lineTo(28, -232); c.lineTo(30, -238); c.lineTo(64, -238); c.lineTo(66, -232);
    c.lineTo(66, -196); c.lineTo(64, -190); c.lineTo(30, -190); c.lineTo(28, -196); c.lineTo(-20, -200); c.lineTo(-70, -208); c.closePath(); };
  grainFill(ctx, head, lin(ctx, 0, -238, 0, -190, [[0, '#ffcf86'], [0.3, '#d9913f'], [0.75, '#8a4a1a'], [1, '#4a2208']]), 0.28);
  ctx.fillStyle = 'rgba(255,236,190,0.55)'; ctx.fillRect(-60, -219, 86, 2); ctx.fillRect(32, -234, 30, 3);
  ctx.fillStyle = 'rgba(70,32,10,0.55)'; ctx.fillRect(28, -232, 3, 38);
  grainFill(ctx, c => roundRect(c, -12, -234, 24, 48, 3), lin(ctx, -12, 0, 12, 0, [[0, '#b06a28'], [1, '#5a2a0c']]), 0.25);
  ctx.restore();
}

function press(ctx, t) {
  const wood = (x0, x1) => lin(ctx, x0, 0, x1, 0, [[0, '#b77442'], [0.5, '#8a4c24'], [1, '#43200e']]);
  // feet and bed
  grainFill(ctx, c => roundRect(c, -128, -16, 256, 16, 3), '#2b1a14', 0.32);
  // uprights
  for (const s of [-1, 1]) grainFill(ctx, c => c.rect(s * 92 - 12, -262, 24, 250), wood(s * 92 - 12, s * 92 + 12), 0.32);
  // crossbeams
  grainFill(ctx, c => roundRect(c, -124, -286, 248, 30, 4), lin(ctx, 0, -286, 0, -256, [[0, '#c4824c'], [1, '#5a2c12']]), 0.32);
  grainFill(ctx, c => c.rect(-92, -196, 184, 20), lin(ctx, 0, -196, 0, -176, [[0, '#b2703e'], [1, '#4f2610']]), 0.32);
  // screw with threads, turning very slowly
  const turn = t * 0.9;
  grainFill(ctx, c => c.rect(-11, -256, 22, 128), lin(ctx, -11, 0, 11, 0, [[0, '#e0b070'], [0.5, '#a06a30'], [1, '#4a2a10']]), 0.4);
  ctx.save(); ctx.beginPath(); ctx.rect(-11, -256, 22, 128); ctx.clip();
  ctx.strokeStyle = 'rgba(50,24,8,0.6)'; ctx.lineWidth = 2;
  for (let i = -2; i < 14; i++) { const y = -256 + ((i * 10 + turn * 10) % 140); ctx.beginPath(); ctx.moveTo(-12, y); ctx.lineTo(12, y - 6); ctx.stroke(); }
  ctx.restore();
  // bar handle swinging in a slow arc (foreshortened)
  const sw = Math.sin(t * 0.7) * 0.9;
  ctx.strokeStyle = '#3a1c0c'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(118 * Math.cos(sw), -150 + 16 * Math.sin(sw)); ctx.stroke();
  ctx.fillStyle = '#c4824c'; ctx.beginPath(); ctx.arc(118 * Math.cos(sw), -150 + 16 * Math.sin(sw), 7, 0, 7); ctx.fill();
  // platen and the sheet on the bed
  grainFill(ctx, c => c.rect(-62, -128, 124, 18), lin(ctx, 0, -128, 0, -110, [[0, '#d39a5a'], [1, '#6a3816']]), 0.4);
  grainFill(ctx, c => c.rect(-112, -62, 250, 16), lin(ctx, 0, -62, 0, -46, [[0, '#9c5e30'], [1, '#3e1e0c']]), 0.4);
  grainFill(ctx, c => { c.moveTo(-60, -62); c.lineTo(58, -62); c.lineTo(52, -70); c.lineTo(-54, -70); c.closePath(); }, '#f3e3c2', 0.25);
  ctx.strokeStyle = 'rgba(40,20,10,0.45)'; ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-44 + i * 6, -66); ctx.lineTo(40 - i * 4, -66); ctx.stroke(); }
}

function engine(ctx, t) {
  const ang = 1.3 * Math.max(0, t - 17.6) + 0.4 * Math.max(0, Math.min(t, 17.6) - 17.3); // wheel starts turning once lit
  grainFill(ctx, c => roundRect(c, -140, -26, 290, 26, 3), lin(ctx, 0, -26, 0, 0, [[0, '#4a3a5a'], [1, '#1a1428']]), 0.32);
  // chimney
  grainFill(ctx, c => c.rect(-104, -236, 26, 120), lin(ctx, -104, 0, -78, 0, [[0, '#8a6a5a'], [1, '#2a1a18']]), 0.32);
  grainFill(ctx, c => roundRect(c, -112, -248, 42, 14, 3), '#c98a48', 0.4);
  // boiler: a horizontal drum with brass bands and rivets
  const boiler = c => roundRect(c, -128, -132, 160, 100, 46);
  grainFill(ctx, boiler, lin(ctx, 0, -132, 0, -32, [[0, '#b08060'], [0.35, '#7a5040'], [1, '#2c1814']]), 0.32);
  for (const bx of [-92, -38, 12]) {
    grainFill(ctx, c => c.rect(bx, -132, 9, 100), lin(ctx, 0, -132, 0, -32, [[0, '#ffd08a'], [1, '#6a3a14']]), 0.3);
    ctx.fillStyle = 'rgba(255,220,170,0.55)'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(bx + 4.5, -118 + k * 24, 2, 0, 7); ctx.fill(); }
  }
  // piston cylinder, rod, crank
  const wx = 92, wy = -110, R = 76, cr = 26;
  const px = wx + cr * Math.cos(ang), py = wy + cr * Math.sin(ang);
  grainFill(ctx, c => roundRect(c, 30, -100, 34, 34, 4), lin(ctx, 0, -100, 0, -66, [[0, '#e0a860'], [1, '#5a3010']]), 0.35);
  const slide = 64 + 14 + cr * Math.cos(ang);
  ctx.strokeStyle = '#e8c890'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(64, -83); ctx.lineTo(slide - 10, -83); ctx.lineTo(px, py); ctx.stroke();
  // flywheel with spokes
  ctx.save(); ctx.translate(wx, wy);
  ctx.strokeStyle = '#2a1c1a'; ctx.lineWidth = 15; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,190,120,0.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, R + 6, -2.6, -0.6); ctx.stroke();
  ctx.strokeStyle = '#3a2620'; ctx.lineWidth = 6;
  for (let k = 0; k < 6; k++) { const a = ang + k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (R - 4), Math.sin(a) * (R - 4)); ctx.stroke(); }
  grainFill(ctx, c => c.arc(0, 0, 14, 0, 7), '#d8a058', 0.3);
  ctx.restore();
  ctx.fillStyle = '#ffe0a8'; ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill();
  // a thread of steam from the chimney once it runs
  const run = ramp(t, 17.6, 18.4);
  for (let k = 0; k < 3; k++) {
    const ph = (t * 0.4 + k / 3) % 1;
    ctx.strokeStyle = rgba(C.cream, 0.14 * run * Math.sin(ph * Math.PI)); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-91, -250);
    for (let s = 1; s <= 10; s++) ctx.lineTo(-91 + Math.sin(s * 0.6 + t * 1.6 + k) * 7 + s * 2, -250 - s * 9 - ph * 34);
    ctx.stroke();
  }
}

function computer(ctx, t, k) {
  // keyboard
  grainFill(ctx, c => { c.moveTo(-104, 0); c.lineTo(104, 0); c.lineTo(92, -22); c.lineTo(-92, -22); c.closePath(); },
    lin(ctx, 0, -22, 0, 0, [[0, '#d9c49a'], [1, '#7e6a48']]), 0.4);
  ctx.fillStyle = 'rgba(70,52,30,0.35)'; for (let i = 0; i < 12; i++) ctx.fillRect(-84 + i * 14, -17, 10, 4);
  // the beige case
  const body = c => roundRect(c, -78, -248, 156, 220, 10);
  grainFill(ctx, body, lin(ctx, -78, -248, 78, -28, [[0, '#f0dcb0'], [0.55, '#c8ae80'], [1, '#6e5a3c']]), 0.3);
  grainFill(ctx, c => roundRect(c, -78, -60, 156, 32, 6), 'rgba(90,70,40,0.25)', 0);
  // disk slot and badge
  ctx.fillStyle = '#3a2e1e'; ctx.fillRect(14, -84, 48, 5); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(-60, -82, 10, 8);
  // screen: deep glass with a few lines of phosphor text and a cursor
  grainFill(ctx, c => roundRect(c, -60, -230, 120, 104, 8), '#2a2418', 0.3);
  grainFill(ctx, c => roundRect(c, -52, -222, 104, 88, 6), lin(ctx, 0, -222, 0, -134, [[0, '#2c3a30'], [1, '#141c18']]), 0.3);
  const on = ramp(t, 18.25, 18.55);
  ctx.fillStyle = rgba('#d8f0c8', 0.75 * on);
  const n = Math.min(5, Math.floor(Math.max(0, t - 18.4) * 4));
  for (let i = 0; i < n; i++) ctx.fillRect(-42, -212 + i * 13, 22 + hash('cl', i) * 56, 4);
  if (on > 0.5 && Math.floor(t * 2.5) % 2 === 0) ctx.fillRect(-42 + (n < 5 ? 0 : 0), -212 + n * 13, 7, 8);
  light(ctx, 0, -178, 80, '#c8f0c0', 0.12 * on);
}

// the chip, front on, with pins, traces and a bright die. a = how far it has been "built" (1 = solid)
function chip(ctx, t, glow, a = 1) {
  const s = CS / 2;
  ctx.save(); ctx.globalAlpha *= a;
  grainFill(ctx, c => roundRect(c, -s, -s, CS, CS, 8), lin(ctx, -s, -s, s, s, [[0, '#1c7c98'], [0.6, '#0c4258'], [1, '#062436']]), 0.35);
  ctx.strokeStyle = rgba(C.cyanW, 0.35); ctx.lineWidth = 1.2;
  const r = rng(77);
  for (let i = 0; i < 9; i++) { const y = -s + 12 + i * 11; const xa = -s + 8 + r() * 10, xb = -s + 26 + r() * 20; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.lineTo(xb + 6, y + 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s - 8 - r() * 10, y); ctx.lineTo(s - 26 - r() * 20, y); ctx.stroke(); }
  // die
  grainFill(ctx, c => roundRect(c, -22, -22, 44, 44, 4), lin(ctx, -22, -22, 22, 22, [[0, C.cyanW], [1, C.cyan]]), 0.15);
  ctx.strokeStyle = rgba('#063448', 0.5); ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-22 + i * 11, -22); ctx.lineTo(-22 + i * 11, 22); ctx.moveTo(-22, -22 + i * 11); ctx.lineTo(22, -22 + i * 11); ctx.stroke(); }
  ctx.restore();
  pins(ctx, a);
  light(ctx, 0, 0, 120, C.cyan, 0.35 * glow * a);
  light(ctx, 0, 0, 40, C.cyanW, 0.5 * glow * a);
}
function pins(ctx, a) {
  const s = CS / 2; ctx.fillStyle = rgba(C.cyanW, 0.85 * a);
  for (let i = 0; i < 7; i++) { const o = -s + 14 + i * 14;
    ctx.fillRect(o - 2, -s - 10, 4, 10); ctx.fillRect(o - 2, s, 4, 10); ctx.fillRect(-s - 10, o - 2, 10, 4); ctx.fillRect(s, o - 2, 10, 4); }
}
function glassBlock(ctx, a) {
  ctx.save(); ctx.globalAlpha *= a;
  grainFill(ctx, c => { c.moveTo(-70, 0); c.lineTo(70, 0); c.lineTo(62, -64); c.lineTo(-62, -64); c.closePath(); },
    lin(ctx, 0, -64, 0, 0, [[0, 'rgba(143,230,255,0.30)'], [1, 'rgba(10,111,140,0.18)']]), 0.2);
  ctx.strokeStyle = rgba(C.cyanW, 0.6); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-62, -64); ctx.lineTo(62, -64); ctx.lineTo(70, 0); ctx.stroke();
  ctx.fillStyle = rgba(C.cyanW, 0.12); ctx.fillRect(-50, -58, 8, 52);
  ctx.restore();
}

// ---------- the traces that build the second chip ----------
function polyLen(p) { let s = 0; for (let i = 1; i < p.length; i++) s += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return s; }
function partial(ctx, p, f) {   // stroke the first f (0..1) of polyline p; returns the tip
  const tot = polyLen(p) * f; let acc = 0; ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); let tip = p[0];
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (acc + d >= tot) { const k = (tot - acc) / d; tip = [lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]; ctx.lineTo(tip[0], tip[1]); break; }
    ctx.lineTo(p[i][0], p[i][1]); acc += d; tip = p[i];
  }
  ctx.stroke(); return tip;
}
const TRACES = (() => {
  const s = CS / 2, A = X.chip, B = X.clone, out = [], r = rng(31), gap = B - A;
  // right pins of the chip run across to the left pins of the clone, each with a small 45-degree step
  for (let i = 0; i < 7; i++) {
    const y0 = -s + 14 + i * 14, st = (i - 3) * 4, mx = gap * 0.42 + (i - 3) * 6;
    out.push({ p: [[A + s + 10, y0], [A + mx - 6, y0], [A + mx + 6 + Math.abs(st), y0 + st], [B - s - 40 - Math.abs(st), y0 + st], [B - s - 28, y0], [B - s - 10, y0]].map(([x, y]) => [x, CHIP_Y + y]) });
  }
  // top and bottom pins loop over/under to the clone's top and bottom pins
  for (let i = 1; i < 7; i += 2) for (const sg of [-1, 1]) {
    const o = -s + 14 + i * 14, h = s + 26 + i * 6;
    out.push({ p: [[A + o, sg * (s + 10)], [A + o, sg * h], [B + o, sg * h], [B + o, sg * (s + 10)]].map(([x, y]) => [x, CHIP_Y + y]) });
  }
  out.forEach((tr, i) => { tr.t0 = 19.86 + i * 0.045 + hash('tr', i) * 0.06; tr.d = 0.38 + polyLen(tr.p) / 1800; });
  return out;
})();
const OUTLINE = (() => { const s = CS / 2, B = X.clone; return [[B - s, CHIP_Y - s], [B + s, CHIP_Y - s], [B + s, CHIP_Y + s], [B - s, CHIP_Y + s], [B - s, CHIP_Y - s]]; })();
const DIE = (() => { const B = X.clone; return [[B - 22, CHIP_Y - 22], [B + 22, CHIP_Y - 22], [B + 22, CHIP_Y + 22], [B - 22, CHIP_Y + 22], [B - 22, CHIP_Y - 22]]; })();
const BLOCK = (() => { const B = X.clone; return [[B - 70, SHELF], [B - 62, SHELF - 64], [B + 62, SHELF - 64], [B + 70, SHELF]]; })();

function buildClone(ctx, t) {
  if (t < 19.8) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // traces: a bright head runs along each one, leaving a fine glowing line behind
  for (const tr of TRACES) {
    const f = out((t - tr.t0) / tr.d); if (f <= 0) continue;
    const fade = 1 - 0.55 * ramp(t, 20.9, 21.4);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(C.cyan, 0.25 * fade); ctx.lineWidth = 6; partial(ctx, tr.p, f);
    ctx.strokeStyle = rgba(C.cyanW, 0.9 * fade); ctx.lineWidth = 1.8; const tip = partial(ctx, tr.p, f);
    if (f < 0.999) light(ctx, tip[0], tip[1], 26, C.cyanW, 0.9);
    ctx.globalCompositeOperation = 'source-over';
  }
  // the clone's outline, die and glass block, each traced in turn
  const seq = [[OUTLINE, 20.25, 0.5], [DIE, 20.55, 0.35], [BLOCK, 20.7, 0.4]];
  ctx.globalCompositeOperation = 'lighter';
  for (const [p, a, d] of seq) {
    const f = out((t - a) / d); if (f <= 0) continue;
    ctx.strokeStyle = rgba(C.cyanW, 0.95); ctx.lineWidth = 2.2; const tip = partial(ctx, p, f);
    if (f < 0.999) light(ctx, tip[0], tip[1], 30, C.cyanW, 1);
  }
  ctx.restore();
  // pins tick in, then the body fills
  const pinA = ramp(t, 20.45, 20.75), fill = ramp(t, 20.75, 21.2);
  ctx.save(); ctx.translate(X.clone, CHIP_Y);
  if (pinA > 0 && fill < 1) pins(ctx, pinA * (1 - fill));
  if (fill > 0) chip(ctx, t, (0.75 + 0.25 * Math.sin(t * 3)) * fill, fill);
  ctx.restore();
  ctx.save(); ctx.translate(X.clone, SHELF); glassBlock(ctx, ramp(t, 20.9, 21.3)); ctx.restore();
}

// pre-generated dust in each beam
const DUST = LAMPS.map((_, i) => { const r = rng(100 + i); return Array.from({ length: 34 }, () => ({ u: r(), v: r(), sp: 0.02 + r() * 0.04, ph: r() * 6, s: 1 + r() * 1.8 })); });
const MQ = 4, mask = createCanvas(W / MQ, H / MQ), mctx = mask.getContext('2d');   // the darkness is soft, so a quarter-size mask is plenty

// the static room (wall, ceiling, shelf, stands, lamp housings) is painted once into a large world-space sprite
// It is cut into narrow tiles, because this canvas build copies a whole source canvas on every drawImage.
const BX0 = -100, BY0 = 20, BW = 4400, BH = 890, BS = 1.4, TW = 400;
let BG = null, TILES = null;
function buildBG() {
  BG = createCanvas(Math.ceil(BW * BS), Math.ceil(BH * BS)); const ctx = BG.getContext('2d');
  ctx.scale(BS, BS); ctx.translate(-BX0, -BY0);
  const x0 = BX0, x1 = BX0 + BW;
  grainFill(ctx, c => c.rect(x0, BY0, BW, BH), lin(ctx, 0, 100, 0, SHELF, [[0, '#14143a'], [0.7, '#262256'], [1, '#2e2862']]), 0.55);
  // wall panel seams and a dado line
  for (let x = -60; x < x1; x += 545) { ctx.fillStyle = 'rgba(8,8,24,0.4)'; ctx.fillRect(x, 124, 3, SHELF - 124); ctx.fillStyle = 'rgba(160,150,255,0.05)'; ctx.fillRect(x + 3, 124, 2, SHELF - 124); }
  // ceiling slab with a lit front edge
  grainFill(ctx, c => c.rect(x0, BY0, BW, 120 - BY0), lin(ctx, 0, BY0, 0, 120, [[0, '#05051a'], [1, '#111133']]), 0.5);
  grainFill(ctx, c => c.rect(x0, 96, BW, 28), lin(ctx, 0, 96, 0, 124, [[0, '#2c2858'], [1, '#18173e']]), 0.5);
  ctx.fillStyle = 'rgba(4,4,16,0.5)'; ctx.fillRect(x0, 124, BW, 10);
  // shelf: top surface, lip, front face, and darkness beneath
  grainFill(ctx, c => c.rect(x0, SHELF - 6, BW, 34), lin(ctx, 0, SHELF - 6, 0, SHELF + 28, [[0, '#4c4386'], [1, '#2a2458']]), 0.5);
  ctx.fillStyle = 'rgba(190,180,255,0.16)'; ctx.fillRect(x0, SHELF + 26, BW, 2);
  grainFill(ctx, c => c.rect(x0, SHELF + 28, BW, 70), lin(ctx, 0, SHELF + 28, 0, SHELF + 98, [[0, '#1e1a44'], [1, '#0c0b22']]), 0.55);
  grainFill(ctx, c => c.rect(x0, SHELF + 98, BW, BY0 + BH - SHELF - 98), lin(ctx, 0, SHELF + 98, 0, SHELF + 400, [[0, '#0a0920'], [1, '#05050f']]), 0.5);
  for (const l of LAMPS) {
    grainFill(ctx, c => { c.moveTo(l.x - 6, 124); c.lineTo(l.x + 6, 124); c.lineTo(l.x + 6, 140); c.lineTo(l.x + 34, 172); c.lineTo(l.x - 34, 172); c.lineTo(l.x - 6, 140); c.closePath(); },
      lin(ctx, 0, 124, 0, 172, [[0, '#2e2a5c'], [1, '#0e0d26']]), 0.5);
    ctx.fillStyle = 'rgba(200,190,255,0.18)'; ctx.fillRect(l.x - 33, 170, 66, 2);
  }
  for (const [k, w] of [['axe', 96], ['hammer', 90]]) { ctx.save(); ctx.translate(X[k], SHELF + 6); stand(ctx, w); ctx.restore(); }
  TILES = [];
  for (let x = 0; x < BW; x += TW) {
    const tc = createCanvas(Math.ceil(TW * BS), BG.height); tc.getContext('2d').drawImage(BG, -x * BS, 0);
    TILES.push({ x: BX0 + x, c: tc });
  }
  BG = true;
}

const S0 = 1.27, CY = 463;
const camX = t => lerp(900, 3235, ease((t - T0) / (19.9 - T0))) + 18 * Math.max(0, t - 19.9);

function draw(ctx, t) {
  if (!BG) buildBG();
  const z = S0 * lerp(1.0, 1.07, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 3) * 5, dy = drift(t, 1, 5) * 3, cx = camX(t);
  const cam = (c, par) => { c.translate(W / 2 + dx * par, H / 2 + dy * par); c.scale(z, z); c.translate(-(cx * par + (1 - par) * 1800), -CY); };
  const layer = (par, fn) => { ctx.save(); cam(ctx, par); fn(); ctx.restore(); };
  const K = LAMPS.map(l => ign(t, l.t));
  const vis = x => Math.abs(x - cx) < W / 2 / z + 260;

  layer(1, () => {
    for (const tl of TILES) if (tl.x + TW > cx - W / 2 / z - 40 && tl.x < cx + W / 2 / z + 40) ctx.drawImage(tl.c, tl.x, BY0, TW + 0.5, BH);
    const at = (x, fn, ...a) => { if (!vis(x)) return; ctx.save(); ctx.translate(x, SHELF + 6); fn(ctx, t, ...a); ctx.restore(); };
    at(X.axe, (c, tt) => { c.translate(0, -22); c.translate(0, 22); axeOnly(c, tt); });
    at(X.hammer, hammerOnly); at(X.press, press); at(X.engine, engine); at(X.computer, computer, K[4]);
    at(X.chip, (c) => glassBlock(c, 1));
  });

  // darkness, with holes where the spotlights fall
  mctx.setTransform(1, 0, 0, 1, 0, 0); mctx.globalCompositeOperation = 'source-over'; mctx.clearRect(0, 0, W / MQ, H / MQ);
  mctx.fillStyle = 'rgba(5,5,18,0.72)'; mctx.fillRect(0, 0, W / MQ, H / MQ);
  // (drawn in screen coordinates: destination-out ignores transformed coordinates beyond the canvas in this canvas build)
  mctx.globalCompositeOperation = 'destination-out';
  const sx = wx => ((wx - cx) * z + W / 2 + dx) / MQ, sy = wy => ((wy - CY) * z + H / 2 + dy) / MQ;
  LAMPS.forEach((l, i) => {
    const k = K[i]; if (k <= 0 || !vis(l.x)) return;
    mctx.fillStyle = lin(mctx, 0, sy(170), 0, sy(SHELF), [[0, `rgba(0,0,0,${0.55 * k})`], [1, `rgba(0,0,0,${0.8 * k})`]]);
    mctx.beginPath(); mctx.moveTo(sx(l.x - 32), sy(170)); mctx.lineTo(sx(l.x + 32), sy(170)); mctx.lineTo(sx(l.x + 175), sy(SHELF + 12)); mctx.lineTo(sx(l.x - 175), sy(SHELF + 12)); mctx.closePath(); mctx.fill();
    const px = sx(l.x), py = sy(SHELF - 110), R = 290 * z / MQ;
    mctx.fillStyle = rad(mctx, px, py, 0, R, [[0, `rgba(0,0,0,${0.95 * k})`], [0.6, `rgba(0,0,0,${0.55 * k})`], [1, 'rgba(0,0,0,0)']]);
    mctx.fillRect(Math.max(0, px - R), Math.max(0, py - R), 2 * R, 2 * R);
  });
  ctx.drawImage(mask, 0, 0, W, H);

  // the light itself: beams, pools, bulbs, dust
  layer(1, () => {
    LAMPS.forEach((l, i) => {
      const k = K[i]; if (k <= 0 || !vis(l.x)) return;
      const cy = l.col === C.cyan, a = cy ? 1.3 : 1;
      // tint what the beam falls on (wall, shelf, object) toward the lamp colour
      ctx.save(); ctx.globalCompositeOperation = 'soft-light';
      const tk = k * (cy ? 0.55 : 0.85);
      ctx.fillStyle = rad(ctx, l.x, SHELF - 140, 0, 300, [[0, rgba(l.col, tk)], [1, rgba(l.col, 0)]]); ctx.fillRect(l.x - 300, SHELF - 440, 600, 600);
      ctx.beginPath(); ctx.moveTo(l.x - 32, 170); ctx.lineTo(l.x + 32, 170); ctx.lineTo(l.x + 175, SHELF + 12); ctx.lineTo(l.x - 175, SHELF + 12); ctx.closePath();
      ctx.fillStyle = lin(ctx, 0, 170, 0, SHELF, [[0, rgba(l.col, 0.1 * tk)], [1, rgba(l.col, 0.35 * tk)]]); ctx.fill(); ctx.restore();
      cone(ctx, l.x, 170, 60, 350, SHELF - 164, l.col, 0.17 * k * a);
      light(ctx, l.x, SHELF + 8, 230, l.col, 0.30 * k * a);
      light(ctx, l.x, SHELF - 170, 280, l.col, 0.10 * k * a);
      light(ctx, l.x, 172, 80, cy ? C.cyanW : '#ffd9a0', 0.8 * k);
      ctx.fillStyle = rgba(cy ? C.cyanW : '#fff0d0', 0.95 * k); ctx.beginPath(); ctx.ellipse(l.x, 171, 27, 3.2, 0, 0, 7); ctx.fill();
      // a lit stripe along the shelf lip
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, l.x - 220, 0, l.x + 220, 0, [[0, rgba(l.col, 0)], [0.5, rgba(l.col, 0.35 * k)], [1, rgba(l.col, 0)]]); ctx.fillRect(l.x - 220, SHELF + 25, 440, 4);
      // dust drifting in the beam
      for (const d of DUST[i]) {
        const v = (d.v - t * d.sp) % 1, vv = v < 0 ? v + 1 : v, y = 180 + vv * (SHELF - 200), half = lerp(30, 170, (y - 170) / (SHELF - 170));
        const x = l.x + (d.u * 2 - 1) * half * 0.9 + Math.sin(t * 0.7 + d.ph) * 8;
        ctx.fillStyle = rgba(cy ? C.cyanW : '#ffe2b0', 0.4 * k * Math.sin(vv * Math.PI)); ctx.fillRect(x, y, d.s, d.s);
      }
      ctx.restore();
    });
    // the chip: self-lit, faint before its lamp, flaring on "successor"
    const flare = out((t - 19.8) / 0.18) * (1 - ramp(t, 19.95, 20.9));
    const glow = 0.4 + 0.5 * K[5] + 0.1 * Math.sin(t * 3) + 1.2 * flare;
    if (vis(X.chip)) { ctx.save(); ctx.translate(X.chip, CHIP_Y + Math.sin(t * 1.4) * 3); chip(ctx, t, glow); ctx.restore(); }
    if (flare > 0) light(ctx, X.chip, CHIP_Y, 420, C.cyan, 0.32 * flare);
    buildClone(ctx, t);
  });

  // foreground: museum stanchions and a sagging rope, very dark, strongest parallax
  layer(1.4, () => {
    const c0 = cx * 1.4 + (1 - 1.4) * 1800;
    for (let x = -200; x < 5200; x += 900) {
      if (Math.abs(x + 450 - c0) > W / z + 500) continue;
      const ry = 815;
      ctx.strokeStyle = '#1c0c1e'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, ry); ctx.quadraticCurveTo(x + 450, ry + 70 + Math.sin(t * 0.9 + x) * 4, x + 900, ry); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,170,120,0.10)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, ry - 3); ctx.quadraticCurveTo(x + 450, ry + 67 + Math.sin(t * 0.9 + x) * 4, x + 900, ry - 3); ctx.stroke();
      ctx.fillStyle = '#0c0a1e'; ctx.fillRect(x - 7, ry - 6, 14, 300);
      ctx.fillStyle = '#2a2450'; ctx.beginPath(); ctx.ellipse(x, ry - 8, 12, 8, 0, 0, 7); ctx.fill();
    }
  });
}

module.exports = { T0, T1, draw };
