// "Kokotajlo wrote two endings. Which one we get isn't up to him. Or only up to the labs."
// The month-by-month wall from earlier, now in daylight: the red string splits into a warm branch and a cold one.
// He stands at the split and pins both endings ("two endings"), then steps back and the camera pulls out
// ("isn't up to him"); three people from the labs walk in ("or only up to the labs"), and then a whole crowd
// rises into the foreground, all of them looking at the fork. It is up to many people.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const K = require('./s_k10_kit');
const { gf, rr, camera, glowStroke, dust, figure, caption } = K;

const T0 = 652.05, T1 = 659.0;
const MONTHS = 12, SX0 = 220, SX1 = 1180, SY = 300;
const R = rng(652);
const SHEETS = Array.from({ length: MONTHS }, (_, i) => ({ x: lerp(SX0, SX1, i / (MONTHS - 1)) + (R() - 0.5) * 8, y: SY + (R() - 0.5) * 14, rot: (R() - 0.5) * 0.09, lines: Array.from({ length: 5 }, () => 0.35 + R() * 0.6) }));
const PINS = SHEETS.map(s => [s.x, s.y + 8]);
const SPLIT = PINS[MONTHS - 1];
const UP = [[1330, 250], [1480, 200], [1630, 150]], DN = [[1330, 370], [1480, 440], [1630, 510]];
const BR_T = [653.3, 653.45, 653.62];
const CROWD = (() => { const r = rng(9), a = []; for (let i = 0; i < 15; i++) a.push({ x: 60 + i * 128 + (r() - 0.5) * 50, s: 1.15 + r() * 0.45, t: 657.55 + r() * 0.9, pal: r(), ph: r() * 6, hair: r() }); return a.sort((p, q) => p.s - q.s); })();
const PALS = [['#ffb35c', '#c9702e', '#5a2a12'], ['#e8a0a0', '#a85a6a', '#4a2030'], ['#d9b07a', '#9a6a3a', '#3e2410'], ['#c88a5a', '#8a4a2a', '#3a1a0c'], ['#ffc27c', '#cf7a36', '#5a2a12']];

function sag(pts, s) { const o = []; for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 12; k++) { const u = k / 12; o.push([lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u) + Math.sin(u * Math.PI) * s]); } o.push(pts[pts.length - 1]); return o; }
function string(ctx, pts, prog, col) {
  if (prog <= 0) return; const n = Math.min(pts.length - 1, Math.floor(prog * 12)), fr = prog * 12 - n;
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i <= n; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (n < pts.length - 1) ctx.lineTo(lerp(pts[n][0], pts[n + 1][0], fr), lerp(pts[n][1], pts[n + 1][1], fr));
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.save(); ctx.translate(2, 4); ctx.strokeStyle = 'rgba(40,20,40,0.35)'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
  ctx.strokeStyle = col; ctx.lineWidth = 3.4; ctx.stroke();
}
function sheet(ctx, x, y, rot, w, h, paper, ink, lines) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = 'rgba(40,20,40,0.3)'; ctx.fillRect(-w / 2 + 4, 5, w, h);
  gf(ctx, c => c.rect(-w / 2, 0, w, h), paper, 0.3);
  ctx.fillStyle = ink; lines.forEach((l, k) => ctx.fillRect(-w / 2 + 8, 16 + k * 10, (w - 16) * l, 3));
  ctx.restore();
}
function pin(ctx, x, y, col) { ctx.fillStyle = 'rgba(40,20,40,0.4)'; ctx.beginPath(); ctx.arc(x + 2, y + 3, 5.5, 0, 7); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 5.5, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(x - 1.5, y - 1.5, 1.8, 0, 7); ctx.fill(); }
const legW = (sw, sg) => ({ a1: Math.PI / 2 + sg * sw * 0.3, a2: Math.PI / 2 + sg * sw * 0.3 + Math.max(0, -sg * sw) * 0.5 });
const legS = [{ a1: Math.PI / 2 + 0.1, a2: Math.PI / 2 + 0.06 }, { a1: Math.PI / 2 - 0.1, a2: Math.PI / 2 - 0.06 }];

function draw(ctx, t) {
  const pull = ease((t - 654.75) / 1.8);
  const layer = camera(ctx, t, T0, T1, { k: () => pull, z0: 1.32, z1: 0.94, cx: t => lerp(1280, 960, pull), cy: t => lerp(330, 470, pull), seed: 29 });
  const split = ramp(t, 653.2, 653.75), gold = ramp(t, 657.8, 658.6);
  layer(0.35, () => {
    // a bright wall in morning light, a long window to the left
    gf(ctx, c => c.rect(-400, -300, W + 800, 1100), lin(ctx, 0, -200, 0, 800, [[0, '#4a3a72'], [0.6, '#6a4a7e'], [1, '#7a5484']]), 0.5);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const x0 of [-380, -120]) { ctx.fillStyle = rgba('#ffb38a', 0.12); ctx.beginPath(); ctx.moveTo(x0, -300); ctx.lineTo(x0 + 160, -300); ctx.lineTo(x0 + 900, 800); ctx.lineTo(x0 + 520, 800); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    // ending zones
    light(ctx, 1640, 160, 380, C.amber, 0.25 + 0.35 * split + 0.3 * gold);
    light(ctx, 1640, 160, 140, '#ffe2b0', 0.2 + 0.3 * gold);
    light(ctx, 1640, 520, 300, C.cyanD, 0.35 * split);
    light(ctx, 1640, 520, 120, C.cyan, 0.2 * split);
    // month sheets and the main red string
    SHEETS.forEach((s, i) => sheet(ctx, s.x, s.y, s.rot + drift(t, 0.6, i) * 0.006, 66, 86, lin(ctx, 0, 0, 0, 86, [[0, '#f3ece0'], [1, '#c9bfb6']]), 'rgba(40,36,70,0.5)', s.lines));
    UP.forEach(([x, y], i) => { const a = ramp(t, BR_T[i] - 0.05, BR_T[i] + 0.25); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; sheet(ctx, x, y - 8, 0.04 * (i - 1), 62, 80, lin(ctx, 0, 0, 0, 80, [[0, '#ffe7b8'], [1, '#e0a55a']]), 'rgba(122,59,23,0.6)', SHEETS[i].lines); ctx.restore(); });
    DN.forEach(([x, y], i) => { const a = ramp(t, BR_T[i] - 0.05, BR_T[i] + 0.25); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; sheet(ctx, x, y - 8, -0.05 * (i - 1), 62, 80, lin(ctx, 0, 0, 0, 80, [[0, '#4a7f93'], [1, '#183a52']]), 'rgba(216,247,255,0.45)', SHEETS[i + 4].lines); ctx.restore(); });
    string(ctx, sag(PINS, 9), MONTHS - 1, '#ff5b4a');
    const bp = clamp((t - 653.15) / 0.5) * 3;
    string(ctx, sag([SPLIT, ...UP], 7), bp, '#ff8a52');
    string(ctx, sag([SPLIT, ...DN], 5), bp, '#e8484a');
    PINS.forEach(([x, y]) => pin(ctx, x, y, '#e8443a'));
    UP.forEach(([x, y], i) => { if (t > BR_T[i]) pin(ctx, x, y, '#ff9a52'); });
    DN.forEach(([x, y], i) => { if (t > BR_T[i]) pin(ctx, x, y, '#c83a48'); });
    light(ctx, SPLIT[0], SPLIT[1], 90, '#ff7a5a', 0.6 * Math.exp(-Math.max(0, t - 653.62) * 3) * (t > 653.6 ? 1 : 0));
    if (gold > 0) glowStroke(ctx, c => { const p = sag([SPLIT, ...UP], 7); c.moveTo(p[0][0], p[0][1]); for (const q of p) c.lineTo(q[0], q[1]); }, '#ffd59a', 2, 0.5 * gold);
    // floor
    gf(ctx, c => c.rect(-400, 760, W + 800, 700), lin(ctx, 0, 760, 0, 1300, [[0, '#4e3a6e'], [1, '#1e1838']]), 0.5);
    ctx.fillStyle = 'rgba(255,200,170,0.18)'; ctx.fillRect(-400, 758, W + 800, 3);
  });
  layer(0.6, () => {
    // him: at the split, pinning; then he steps back and lowers his arm
    const back = ease((t - 654.65) / 0.9), br = Math.sin(t * 1.6);
    const x = lerp(1240, 1010, back), s = lerp(0.95, 1.0, back), feet = lerp(860, 880, back), hipY = feet - 150 * s;
    const ph = (t - 654.65) * 2 * Math.PI * 1.1, sw = back > 0 && back < 1 ? Math.sin(ph) : 0;
    const reach = (1 - ease((t - 654.55) / 0.5)) * ramp(t, T0, T0 + 0.3);
    const tgt = t < 653.0 ? SPLIT : t < BR_T[0] ? UP[0] : t < 654 ? DN[0] : SPLIT;
    const pinMove = Math.sin(t * 3) * 6;
    figure(ctx, { x, y: hipY + br, s, facing: 'back', br, lean: -0.03, turn: lerp(0.5, -0.4, back) + 0.1 * Math.sin(t * 0.7), tilt: lerp(-0.2, 0.05, back), lx: 1,
      rim: '#ffe0b0', rimA: 0.4, rimDx: -2, rimDy: -2, pal: ['#ffb35c', '#c9702e', '#5a2a12'],
      legs: sw ? [legW(sw, 1), legW(sw, -1)] : legS,
      arms: [{ a1: Math.PI / 2 + 0.2, a2: Math.PI / 2 + 0.1 }, reach > 0.05 ? { tx: lerp(x + 40, tgt[0] - 10, reach), ty: lerp(hipY, tgt[1] + 10 + pinMove, reach), bend: -1 } : { a1: Math.PI / 2 - 0.2 + sw * 0.2, a2: Math.PI / 2 - 0.1 + sw * 0.2 }] });
    // the lab people walk in on "the labs"
    for (let k = 0; k < 3; k++) {
      const w = ease((t - 656.85 - k * 0.12) / 0.9), lx = lerp(2150 + k * 120, 1420 + k * 130, w), b2 = Math.sin(t * 1.5 + k), sk = 0.9 - k * 0.03;
      if (w <= 0) continue;
      const ph2 = (t - 656.85) * 2 * Math.PI * 1.2 + k, sw2 = w < 1 ? Math.sin(ph2) : 0;
      figure(ctx, { x: lx, y: 870 - 150 * sk + b2, s: sk, facing: 'back', br: b2, turn: -0.3 + k * 0.1, tilt: -0.15, lx: -1, rim: C.cyan, rimA: 0.6, rimDx: -2, rimDy: -2,
        pal: ['#e8f4f6', '#9ab8c4', '#3e5a6a'], hair0: k === 1 ? '#c9a070' : '#2a1208',
        legs: sw2 ? [legW(sw2, 1), legW(sw2, -1)] : legS, arms: [{ a1: Math.PI / 2 + 0.15 - sw2 * 0.2, a2: Math.PI / 2 + 0.05 }, { a1: Math.PI / 2 - 0.15 + sw2 * 0.2, a2: Math.PI / 2 - 0.05 }] });
    }
    dust(ctx, t, -100, 0, 2000, 760, '#ffe2c4', 0.3);
  });
  // and then everyone else: a crowd rises into the foreground
  layer(1.1, () => {
    for (const p of CROWD) {
      const k = ease((t - p.t) / 0.7); if (k <= 0) continue;
      const br = Math.sin(t * 1.4 + p.ph), y = 1180 + (1 - k) * 380 + br * 2;
      figure(ctx, { x: p.x, y: y - 40 * p.s, s: p.s, facing: 'back', br, turn: clamp((1300 - p.x) / 2000, -0.6, 0.6), tilt: -0.2, lx: p.x < 960 ? 1 : -1, grain: 0.35,
        rim: '#ffd59a', rimA: 0.35 + 0.3 * gold, rimDx: 0, rimDy: -3, pal: PALS[Math.floor(p.pal * PALS.length)], hair0: p.hair < 0.3 ? '#1c0a05' : p.hair < 0.6 ? '#5a2a12' : '#8a5a2a',
        arms: [{ a1: Math.PI / 2 + 0.2, a2: Math.PI / 2 + 0.1 }, { a1: Math.PI / 2 - 0.2, a2: Math.PI / 2 - 0.1 }] });
    }
  });
}

module.exports = { T0, T1, draw };
