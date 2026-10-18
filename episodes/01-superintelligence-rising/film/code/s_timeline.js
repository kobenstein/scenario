// "Then he and four colleagues wrote out the next few years, month by month, with two endings."
// Five people work late around a table. On the wall a red string runs from month to month, then splits:
// one strand drops into a cold cyan dark, one climbs into warm gold. One of them stands and points at the split.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, stamp, out } = L;

const T0 = 44.5, T1 = 51.05;

// grainFill with a bounded speckle rect (much faster than the library's 8000px pass); box = [x, y, w, h]
let PAT = null;
function grainFill(ctx, pathFn, fill, grain = 0.5, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat');
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-2400, -1600, 6800, 4400);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- figure rig (shared with s_table.js)
// A faceless person built from joints. f: { x, y (hip centre), s (scale), lean (rad), len (torso factor),
// w (width factor), facing 'front'|'back', turn (-1..1 head turn), tilt (rad), br (breath -1..1),
// arms: [{tx,ty,bend} | {a1,a2}] (0 = screen-left arm), legs: same, lx (-1 key light from left, 1 from right),
// rim: hex|null, rimA, pal: [light, mid, dark] }
function ik(sx, sy, tx, ty, l1, l2, bend = 1) {
  const dx = tx - sx, dy = ty - sy, d = clamp(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1, (l1 + l2) * 0.999);
  const a = Math.atan2(dy, dx), A = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const a1 = a - bend * A, ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(ty - ey, tx - ex)];
}
function capsule(c, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  c.arc(x1, y1, r1, a + Math.PI / 2, a + Math.PI * 1.5);
  c.arc(x2, y2, r2, a - Math.PI / 2, a + Math.PI / 2);
  c.closePath();
}
const PAL = ['#f0a25a', '#b8622a', '#4a1e0c'];
function figure(ctx, f) {
  const s = f.s, lean = f.lean || 0, len = 118 * s * (f.len ?? 1), wf = f.w ?? 1, br = f.br || 0;
  const sw = 46 * s * wf * (1 + br * 0.012), hw = 31 * s * wf, Lx = f.lx ?? -1, pal = f.pal || PAL;
  const cs = Math.cos(lean), sn = Math.sin(lean);
  const P = (x, y) => [f.x + x * cs - y * sn, f.y + x * sn + y * cs];
  const parts = [];
  const bodyFill = lin(ctx, f.x + Lx * sw * 1.2, f.y - len * 1.1, f.x - Lx * sw, f.y, [[0, pal[0]], [0.45, pal[1]], [1, pal[2]]]);
  const limbFill = (x0, y0, x1, y1, dark) => lin(ctx, x0, y0, x1, y1, dark ? [[0, pal[1]], [1, pal[2]]] : [[0, pal[0]], [0.6, pal[1]], [1, pal[2]]]);
  const ua = 60 * s, fa = 56 * s, th = 78 * s, sh = 76 * s;
  const SH = [P(-sw * 0.78, -len * 0.88), P(sw * 0.78, -len * 0.88)];
  const HP = [P(-hw * 0.55, -8 * s), P(hw * 0.55, -8 * s)];
  const limb = (o, spec, l1, l2, r0, r1, r2, isLeg) => {
    if (!spec) return null;
    const [a1, a2] = spec.tx !== undefined ? ik(o[0], o[1], spec.tx, spec.ty, l1, l2, spec.bend ?? 1) : [spec.a1, spec.a2];
    const e = [o[0] + Math.cos(a1) * l1, o[1] + Math.sin(a1) * l1], h = [e[0] + Math.cos(a2) * l2, e[1] + Math.sin(a2) * l2];
    return { o, e, h, a2, r0, r1, r2, isLeg, behind: spec.behind, dark: spec.dark ?? spec.behind };
  };
  const arms = (f.arms || []).map((a, i) => limb(SH[i], a, ua, fa, 13.5 * s * wf, 11 * s, 9 * s, false));
  const legs = (f.legs || []).map((a, i) => limb(HP[i], a, th, sh, 17 * s, 13 * s, 10 * s, true));
  const pushLimb = L => {
    if (!L) return;
    const fill = limbFill(L.o[0], L.o[1], L.h[0], L.h[1], L.dark), arm = !L.isLeg;
    parts.push([c => { capsule(c, L.o[0], L.o[1], L.r0, L.e[0], L.e[1], L.r1); }, fill, undefined, arm]);
    parts.push([c => { capsule(c, L.e[0], L.e[1], L.r1, L.h[0], L.h[1], L.r2); }, fill, undefined, arm]);
    if (L.isLeg) parts.push([c => c.ellipse(L.h[0] + Math.cos(L.a2 - Math.PI / 2) * -9 * s, L.h[1] + 4 * s, 15 * s, 7 * s, 0, 0, Math.PI * 2), L.dark ? '#3a1a0c' : pal[2]]);
    else parts.push([c => c.ellipse(L.h[0] + Math.cos(L.a2) * 4 * s, L.h[1] + Math.sin(L.a2) * 4 * s, 9.5 * s, 8 * s, L.a2, 0, Math.PI * 2), L.dark ? pal[2] : pal[1], undefined, true]);
  };
  legs.filter(l => l && l.behind).forEach(pushLimb);
  arms.filter(l => l && l.behind).forEach(pushLimb);
  legs.filter(l => l && !l.behind).forEach(pushLimb);
  // torso: hips to rounded shoulders
  parts.push([c => {
    const q = (x, y) => P(x, y);
    let p = q(-hw, 0); c.moveTo(p[0], p[1]);
    let a = q(-hw * 1.06, -len * 0.45), b = q(-sw * 1.04, -len * 0.62), d = q(-sw, -len * 0.84); c.bezierCurveTo(a[0], a[1], b[0], b[1], d[0], d[1]);
    a = q(-sw * 0.96, -len * 0.97); b = q(-sw * 0.62, -len * 0.99); c.quadraticCurveTo(a[0], a[1], b[0], b[1]);
    a = q(-sw * 0.38, -len * 1.0); b = q(-sw * 0.22, -len * 1.06); c.quadraticCurveTo(a[0], a[1], b[0], b[1]);
    p = q(sw * 0.22, -len * 1.06); c.lineTo(p[0], p[1]);
    a = q(sw * 0.38, -len * 1.0); b = q(sw * 0.62, -len * 0.99); c.quadraticCurveTo(a[0], a[1], b[0], b[1]);
    a = q(sw * 0.96, -len * 0.97); b = q(sw, -len * 0.84); c.quadraticCurveTo(a[0], a[1], b[0], b[1]);
    a = q(sw * 1.04, -len * 0.62); b = q(hw * 1.06, -len * 0.45); d = q(hw, 0); c.bezierCurveTo(a[0], a[1], b[0], b[1], d[0], d[1]);
    c.closePath();
  }, bodyFill]);
  parts.push([c => { const a = P(-Lx * sw * 0.25, -len * 0.98), b = P(-Lx * sw * 0.05, -len * 0.5), d = P(-Lx * hw * 0.2, 0), e = P(-Lx * hw * 1.0, 0), g = P(-Lx * sw * 1.0, -len * 0.6), k = P(-Lx * sw * 0.95, -len * 0.95);
    c.moveTo(a[0], a[1]); c.quadraticCurveTo(b[0], b[1], d[0], d[1]); c.lineTo(e[0], e[1]); c.quadraticCurveTo(g[0], g[1], k[0], k[1]); c.closePath(); }, rgba('#3a1608', 0.28)]);
  // neck and head
  const hr = 23 * s, hy = -len * 1.04 - 30 * s, tilt = (f.tilt || 0) + lean * 0.4, turn = f.turn || 0;
  const HC = P(turn * 4 * s, hy);
  parts.push([c => { const a = P(-8 * s, -len * 0.98), b = P(8 * s, -len * 0.98), d = P(9 * s + turn * 3 * s, hy + 8 * s), e = P(-9 * s + turn * 3 * s, hy + 8 * s);
    c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.closePath(); }, pal[2]]);
  const headPath = c => c.ellipse(HC[0], HC[1], hr * 0.92, hr * 1.12, lean + tilt, 0, Math.PI * 2);
  const skin = f.skin || ['#ffd29a', '#e0904a', '#7a3b17'];
  const hairFill = lin(ctx, HC[0] + Lx * hr, HC[1] - hr, HC[0] - Lx * hr, HC[1] + hr, [[0, f.hair0 || '#5a2a12'], [1, '#1c0a05']]);
  // collar
  parts.push([c => { const a = P(-sw * 0.42, -len * 1.04), b = P(sw * 0.42, -len * 1.04), m = P(0, -len * (f.facing === 'back' ? 0.97 : 0.86));
    c.moveTo(a[0], a[1]); c.quadraticCurveTo(m[0], m[1] + 6 * s, b[0], b[1]); c.lineTo(a[0], a[1]); c.closePath(); }, f.facing === 'back' ? pal[2] : skin[1], 0]);
  parts.push([headPath, lin(ctx, HC[0] + Lx * hr, HC[1] - hr, HC[0] - Lx * hr * 0.6, HC[1] + hr, [[0, skin[0]], [0.55, skin[1]], [1, skin[2]]])]);
  if (f.facing === 'back') {
    // hair covers the back of the head; the ear shows on the side the head turns to
    const side = turn >= 0 ? -1 : 1;
    if (Math.abs(turn) > 0.05) parts.push([c => c.ellipse(HC[0] + side * hr * (0.92 - 0.2 * Math.abs(turn)), HC[1] + hr * 0.12, 4.5 * s, 8 * s, lean, 0, Math.PI * 2), skin[1]]);
    parts.push([c => { const r = lean + tilt; c.ellipse(HC[0] - turn * hr * 0.1, HC[1] - hr * 0.04, hr * 0.95, hr * 1.1, r, Math.PI * 0.62, Math.PI * 2.38); c.quadraticCurveTo(HC[0], HC[1] + hr * 0.9, HC[0] - hr * 0.95 * Math.cos(Math.PI * 0.38), HC[1] + hr * 1.0); c.closePath(); }, hairFill]);
  } else {
    parts.push([c => { c.ellipse(HC[0] + turn * hr * 0.12, HC[1] - hr * 0.3, hr * 0.98, hr * 0.88, lean + tilt, Math.PI * 1.0, Math.PI * 2.0); c.quadraticCurveTo(HC[0] + turn * hr * 0.4, HC[1] - hr * 0.62, HC[0] - hr * 0.98, HC[1] - hr * 0.3); c.closePath(); }, hairFill]);
    // the side of the face turned away falls into shadow
    parts.push([c => c.ellipse(HC[0] - turn * hr * 0.55, HC[1] + hr * 0.15, hr * 0.5, hr * 0.85, lean + tilt, 0, Math.PI * 2), rgba('#3a1608', 0.12 + 0.22 * Math.abs(turn))]);
  }
  arms.filter(l => l && !l.behind).forEach(pushLimb);
  if (f.only === 'arms') { parts.length = 0; arms.forEach(pushLimb); }
  else if (f.noArms) { const keep = parts.filter(pp => !pp[3]); parts.length = 0; parts.push(...keep); }
  if (f.rim) { ctx.save(); ctx.translate(f.rimDx ?? -3 * Lx, f.rimDy ?? -2); for (const [p] of parts) grainFill(ctx, p, rgba(f.rim, f.rimA ?? 0.9), 0); ctx.restore(); }
  const box = [f.x - 340 * s, f.y - 420 * s, 680 * s, 700 * s];
  for (const [p, fill, g] of parts) grainFill(ctx, p, fill, g ?? f.grain ?? 0.42, box);
  return { head: HC, shoulders: SH, hands: arms.map(a => a && a.h) };
}

function roundRect(ctx, x, y, w, h, r) { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

// ---------------------------------------------------------------- the wall timeline
const MONTHS = 13, SX0 = 300, SX1 = 1320, SY = 262;
const R0 = rng(44);
const SHEETS = Array.from({ length: MONTHS }, (_, i) => ({
  x: lerp(SX0, SX1, i / (MONTHS - 1)) + (R0() - 0.5) * 8, y: SY + (R0() - 0.5) * 14, rot: (R0() - 0.5) * 0.09,
  lines: Array.from({ length: 4 + Math.floor(R0() * 3) }, () => 0.35 + R0() * 0.6), chart: R0() < 0.4, chartK: R0(),
}));
const PINS = SHEETS.map(s => [s.x, s.y + 8]);
const PIN_T = PINS.map((_, i) => 45.3 + i * (4.3 / (MONTHS - 1)));
const SPLIT = PINS[MONTHS - 1];
const UP = [[1470, 222], [1610, 178], [1750, 138]];   // the good ending: up into gold
const DN = [[1470, 336], [1610, 410], [1750, 482]];   // the bad ending: down into the cold
const BR_T = [49.7, 49.82, 49.94];                   // the branch pins land on "two endings"

function sagPath(pts, sag, wob) { // sample a sagging string through the pins
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    for (let k = 0; k < 16; k++) { const u = k / 16; out.push([lerp(x0, x1, u), lerp(y0, y1, u) + Math.sin(u * Math.PI) * (sag + wob * Math.sin(i * 1.7))]); }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
function drawString(ctx, pts, prog, col, wid) { // prog in pin units (0..n-1)
  if (prog <= 0) return null;
  const n = Math.min(pts.length - 1, Math.floor(prog * 16)), fr = prog * 16 - n;
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= n; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  let tip = pts[n];
  if (n < pts.length - 1) { tip = [lerp(pts[n][0], pts[n + 1][0], fr), lerp(pts[n][1], pts[n + 1][1], fr)]; ctx.lineTo(tip[0], tip[1]); }
  ctx.strokeStyle = 'rgba(20,6,10,0.5)'; ctx.lineWidth = wid + 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.save(); ctx.translate(2, 4); ctx.stroke(); ctx.restore();       // soft shadow on the wall
  ctx.strokeStyle = col; ctx.lineWidth = wid; ctx.stroke();
  return tip;
}
const progAt = (t, times) => { // pin index the string has reached, with a little settle at each pin
  if (t <= times[0]) return 0;
  for (let i = 0; i < times.length - 1; i++) if (t < times[i + 1]) return i + sm((t - times[i]) / (times[i + 1] - times[i]));
  return times.length - 1;
};

function sheet(ctx, x, y, rot, w, h, paper, ink, s, t, jig) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot + jig);
  ctx.fillStyle = 'rgba(4,4,16,0.35)'; ctx.fillRect(-w / 2 + 4, 5, w, h);
  grainFill(ctx, c => c.rect(-w / 2, 0, w, h), paper, 0.3, [-w, -10, 2 * w, h + 20]);
  ctx.fillStyle = ink;
  if (s) {
    s.lines.forEach((l, k) => { ctx.fillRect(-w / 2 + 8, 16 + k * 9, (w - 16) * l, 3); });
    if (s.chart) { ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k < 6; k++) ctx.lineTo(-w / 2 + 9 + k * (w - 18) / 5, h - 10 - k * k * (2 + 4 * s.chartK) * 0.5); ctx.stroke(); }
    else ctx.fillRect(-w / 2 + 8, h - 18, w * 0.35, 9);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- scene
function draw(ctx, t) {
  const z = lerp(1.0, 1.075, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 5) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  const split = ramp(t, 49.65, 50.15), zones = ramp(t, 49.7, 50.6);
  const look = ramp(t, 49.95, 50.5);                     // everyone turns toward the split
  const flick = 0.92 + 0.08 * Math.sin(t * 11) * Math.sin(t * 2.7);

  // wall, window, the timeline
  layer(0.35, () => {
    grainFill(ctx, c => c.rect(-200, -200, W + 400, 860), lin(ctx, 0, 0, 0, 640, [[0, '#0d1030'], [0.55, '#1a1844'], [1, '#22204e']]), 0.6, [-200, -200, W + 400, 860]);
    ctx.fillStyle = 'rgba(4,4,16,0.22)'; for (const x of [420, 760, 1100, 1440]) ctx.fillRect(x, 0, 3, 640);
    ctx.fillStyle = 'rgba(143,160,255,0.035)'; for (const x of [423, 763, 1103, 1443]) ctx.fillRect(x, 0, 2, 640);
    // warm wash from the work lamp on the table below
    light(ctx, 640, 560, 800, C.amber, 0.14);
    // window on the left: night city
    ctx.save(); ctx.translate(40, 250);
    ctx.fillStyle = '#05060f'; ctx.fillRect(-12, -12, 214, 364);
    grainFill(ctx, c => c.rect(0, 0, 190, 340), lin(ctx, 0, 0, 0, 340, [[0, '#121a46'], [1, '#2c3a7a']]), 0.5);
    const rr = rng(7); let bx = 0;
    while (bx < 190) { const bw = 18 + rr() * 34, bh = 80 + rr() * 180; ctx.fillStyle = '#0b0f2c'; ctx.fillRect(bx, 340 - bh, bw, bh);
      for (let k = 0; k < 6; k++) if (rr() < 0.5) { ctx.fillStyle = rgba(rr() < 0.7 ? C.cyan : C.amber, 0.35 + 0.25 * Math.sin(t * (0.5 + rr()) + k)); ctx.fillRect(bx + 4 + rr() * (bw - 8), 340 - bh + 10 + rr() * (bh - 20), 3, 4); }
      bx += bw + 3; }
    ctx.fillStyle = '#05060f'; ctx.fillRect(92, 0, 6, 340); ctx.fillRect(0, 168, 190, 6);
    ctx.restore();
    // the two ending zones, behind the paper
    if (zones > 0) {
      ctx.save(); ctx.globalAlpha = zones;
      ctx.fillStyle = rad(ctx, 1700, 470, 20, 330, [[0, 'rgba(6,40,58,0.85)'], [0.6, 'rgba(6,30,48,0.45)'], [1, 'rgba(6,30,48,0)']]);
      ctx.fillRect(1300, 140, 700, 700);
      ctx.restore();
      light(ctx, 1700, 470, 300, C.cyanD, 0.35 * zones * flick);
      light(ctx, 1720, 150, 380, C.amber, 0.42 * zones * (0.95 + 0.05 * Math.sin(t * 2)));
      light(ctx, 1720, 150, 160, '#ffe2b0', 0.25 * zones);
      // drifting motes: cold falling, warm rising
      const rm = rng(91);
      for (let k = 0; k < 26; k++) {
        const cold = k % 2 === 0, ph = (rm() + t * (0.08 + rm() * 0.06)) % 1, x0 = 1500 + rm() * 360;
        const y = cold ? 360 + ph * 260 : 260 - ph * 220, x = x0 + Math.sin(t * 0.9 + k) * 12;
        ctx.fillStyle = rgba(cold ? C.cyan : '#ffd79a', zones * 0.55 * Math.sin(ph * Math.PI));
        ctx.beginPath(); ctx.arc(x, y, 1.6 + rm() * 1.6, 0, Math.PI * 2); ctx.fill();
      }
    }
    // month sheets
    const prog = progAt(t, PIN_T);
    SHEETS.forEach((s, i) => {
      const hit = t - PIN_T[i], jig = hit > 0 ? Math.exp(-hit * 7) * Math.sin(hit * 40) * 0.06 : 0;
      sheet(ctx, s.x, s.y, s.rot + drift(t, 0.6, i) * 0.006, 66, 88, lin(ctx, 0, 0, 0, 88, [[0, '#e9e3d2'], [1, '#b9b2a6']]), 'rgba(40,36,70,0.55)', s, t, jig);
    });
    // branch sheets: gold above, cold below; they arrive with the strings
    const bw = c => c;
    UP.forEach(([x, y], i) => { const a = ramp(t, BR_T[i] - 0.05, BR_T[i] + 0.25); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
      sheet(ctx, x, y - 8 - (1 - a) * 10, 0.04 * (i - 1) + drift(t, 0.6, 20 + i) * 0.006, 62, 80, lin(ctx, 0, 0, 0, 80, [[0, '#ffe7b8'], [1, '#e0a55a']]), 'rgba(122,59,23,0.6)', SHEETS[i + 2], t, 0); ctx.restore(); });
    DN.forEach(([x, y], i) => { const a = ramp(t, BR_T[i] - 0.05, BR_T[i] + 0.25); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
      sheet(ctx, x, y - 8 + (1 - a) * 10, -0.05 * (i - 1) + drift(t, 0.6, 30 + i) * 0.006, 62, 80, lin(ctx, 0, 0, 0, 80, [[0, '#4a7f93'], [1, '#183a52']]), 'rgba(216,247,255,0.45)', SHEETS[i + 6], t, 0); ctx.restore(); });
    // the red string, pin to pin
    const wob = drift(t, 0.8, 1) * 1.5;
    const main = sagPath(PINS, 9, wob);
    const red = '#ff5b4a';
    const tip = drawString(ctx, main, prog, red, 3.2);
    if (split > 0) {
      drawString(ctx, sagPath([SPLIT, ...UP], 7, wob), progAt(t, [49.62, ...BR_T]), '#ff8a52', 3.2);
      drawString(ctx, sagPath([SPLIT, ...DN], 5, wob), progAt(t, [49.62, ...BR_T]), '#e8484a', 3.2);
    }
    // the running tip glows while it travels
    if (tip && t < 49.7) light(ctx, tip[0], tip[1], 40, '#ff6a50', 0.5);
    // pins: a small tick as each lands
    const pin = (x, y, ht, col) => {
      const k = ht > 0 ? 1 + 0.9 * Math.exp(-ht * 9) : 0; if (k <= 0) return;
      if (ht < 0.5) light(ctx, x, y, 34, '#ff8a6a', 0.7 * Math.exp(-ht * 6));
      ctx.fillStyle = 'rgba(4,4,16,0.5)'; ctx.beginPath(); ctx.arc(x + 2, y + 3, 5 * k, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 5 * k, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(x - 1.5, y - 1.5, 1.6 * k, 0, Math.PI * 2); ctx.fill();
    };
    PINS.forEach(([x, y], i) => pin(x, y, t - PIN_T[i], '#e8443a'));
    UP.forEach(([x, y], i) => pin(x, y, t - BR_T[i], '#ff9a52'));
    DN.forEach(([x, y], i) => pin(x, y, t - BR_T[i], '#c83a48'));
    // the split itself flares when it happens
    light(ctx, SPLIT[0], SPLIT[1], 90, '#ff7a5a', 0.55 * Math.exp(-Math.max(0, t - 49.7) * 3) * (t > 49.65 ? 1 : 0));
  });

  // people behind the table (they face us)
  const bre = k => Math.sin(t * 1.6 + k * 1.3);
  layer(0.75, () => {
    // P2: standing, leaning over the table on both hands, glances to the wall
    {
      const b = bre(2), y = 640 + b * 1.5;
      figure(ctx, { x: 690, y, s: 1.0, pal: ['#ffc27c', '#cf7a36', '#5a2a12'], len: 0.86, facing: 'front', br: b, lean: 0.06 * Math.sin(t * 0.5), turn: lerp(-0.2 + 0.15 * Math.sin(t * 0.7), 0.7, look), tilt: lerp(0.1, -0.12, look), lx: 1,
        arms: [{ tx: 620, ty: 700 + b, bend: -1 }, { tx: 770, ty: 702, bend: 1 }] });
    }
    // P3: seated behind the laptop, typing
    {
      const b = bre(3);
      figure(ctx, { x: 960, y: 662 + b, s: 0.95, pal: ['#d9824a', '#9a4a22', '#3a160a'], facing: 'front', br: b, lean: -0.02, turn: lerp(0.1 * Math.sin(t * 0.4), 0.55, look), tilt: lerp(0.18, 0, look), lx: 1,
        arms: [{ tx: 915 + Math.sin(t * 14) * 3, ty: 680 + Math.abs(Math.sin(t * 9)) * 3, bend: -1 }, { tx: 1005 + Math.sin(t * 12 + 1) * 3, ty: 680 + Math.abs(Math.sin(t * 11)) * 3, bend: 1 }] });
      light(ctx, 960, 590, 120, C.cyan, 0.16 * flick);
    }
    // P4: stands up on "two endings" and points at the split
    {
      const st = ramp(t, 49.45, 50.0), b = bre(4) * (1 - st * 0.5);
      const hx = 1215 + st * 10, hy = lerp(668, 572, st) + b;
      const ptx = SPLIT[0] + 20 + Math.sin(t * 3) * 3, pty = SPLIT[1] + 30;
      const arm = ramp(t, 49.65, 50.05);
      const rest = { tx: 1268, ty: 690, bend: 1 }, aim = { tx: lerp(1268, ptx, out(arm)), ty: lerp(690, pty, out(arm)) - Math.sin(arm * Math.PI) * 60, bend: 1 };
      const legs = st > 0 ? [{ a1: lerp(-0.2, 1.62, st), a2: 1.62, behind: true }, { a1: lerp(-0.1, 1.55, st), a2: 1.58, behind: true }] : null;
      figure(ctx, { x: hx, y: hy, s: 1.0, facing: 'front', br: b, lean: lerp(0.05, -0.04, st) + lerp(0, 0.14, sm((st - 0.0) * 2) * (1 - st)) , turn: lerp(-0.1 + 0.1 * Math.sin(t * 0.6), 0.85, ramp(t, 49.6, 50.0)), tilt: lerp(0.15, -0.2, st), lx: 1,
        arms: [{ tx: 1170, ty: 700 - st * 30, bend: -1 }, arm > 0 ? aim : rest], legs });
    }
  });

  // the table
  layer(0.9, () => {
    // floor
    grainFill(ctx, c => c.rect(-200, 620, W + 400, 700), lin(ctx, 0, 620, 0, H, [[0, '#14123a'], [1, '#07071a']]), 0.6, [-200, 620, W + 400, 700]);
    // top
    const top = c => { c.moveTo(470, 616); c.lineTo(1450, 616); c.lineTo(1740, 960); c.lineTo(180, 960); c.closePath(); };
    grainFill(ctx, top, lin(ctx, 0, 616, 0, 960, [[0, '#2a2560'], [1, '#1a1640']]), 0.55, [170, 610, 1580, 360]);
    ctx.save(); ctx.beginPath(); top(ctx); ctx.clip();
    light(ctx, 780, 760, 640, C.amber, 0.42 * flick);       // the lamp's warm pool
    light(ctx, 760, 740, 260, '#ffd9a0', 0.16 * flick);
    light(ctx, 1640, 640, 380, C.amber, 0.12 * zones);
    ctx.restore();
    grainFill(ctx, c => { c.moveTo(180, 960); c.lineTo(1740, 960); c.lineTo(1740, 990); c.lineTo(180, 990); c.closePath(); }, '#0d0b26', 0.5);
    // papers scattered on the table
    const rp = rng(12);
    for (let k = 0; k < 8; k++) {
      const px = 420 + rp() * 900, py = 660 + rp() * 250, r = (rp() - 0.5) * 0.7, w = 60 + rp() * 30;
      if ((Math.abs(px - 960) < 100 && py < 720) || (px > 1330)) continue;
      ctx.save(); ctx.translate(px, py); ctx.rotate(r); ctx.transform(1, 0, 0, 0.62, 0, 0);
      ctx.fillStyle = 'rgba(4,4,16,0.35)'; ctx.fillRect(-w / 2 + 3, -w * 0.65 + 4, w, w * 1.3);
      grainFill(ctx, c => c.rect(-w / 2, -w * 0.65, w, w * 1.3), lin(ctx, 0, -w, 0, w, [[0, '#e6dfcb'], [1, '#a9a196']]), 0.3, [-w, -w, 2 * w, 2 * w]);
      ctx.fillStyle = 'rgba(40,36,70,0.5)'; for (let j = 0; j < 5; j++) ctx.fillRect(-w / 2 + 7, -w * 0.5 + j * 11, (w - 14) * (0.4 + rp() * 0.6), 3);
      ctx.restore();
    }
    // centre laptop (back of the lid)
    grainFill(ctx, c => { c.moveTo(888, 606); c.lineTo(1032, 606); c.lineTo(1040, 700); c.lineTo(880, 700); c.closePath(); }, lin(ctx, 0, 606, 0, 700, [[0, '#2e2d5c'], [1, '#14143a']]), 0.4);
    ctx.strokeStyle = rgba(C.cyan, 0.5 * flick); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(888, 606); ctx.lineTo(1032, 606); ctx.stroke();
    ctx.fillStyle = rgba(C.cyanW, 0.5); ctx.beginPath(); ctx.arc(960, 650, 5, 0, Math.PI * 2); ctx.fill();
    // laptop facing the right front person: open screen glowing
    ctx.save(); ctx.translate(1500, 750); ctx.scale(0.9, 0.9);
    grainFill(ctx, c => { c.moveTo(-90, 70); c.lineTo(90, 70); c.lineTo(110, 110); c.lineTo(-110, 110); c.closePath(); }, '#15153a', 0.4);
    grainFill(ctx, c => { c.moveTo(-86, -40); c.lineTo(86, -40); c.lineTo(92, 70); c.lineTo(-92, 70); c.closePath(); }, lin(ctx, 0, -40, 0, 70, [[0, '#1a86a8'], [1, '#0a3e58']]), 0.3);
    ctx.fillStyle = rgba(C.cyanW, 0.6);
    for (let k = 0; k < 6; k++) { const w = 40 + 80 * hash(k, Math.floor(t * 2 + k * 0.3) % 7); ctx.fillRect(-70, -26 + k * 15, w, 4); }
    ctx.restore();
    light(ctx, 1500, 740, 260, C.cyan, 0.24 * flick);
    // desk lamp on the back-left corner: the hero light
    {
      const nod = Math.sin(t * 0.7) * 0.02, bx = 500, by = 668, ex = 560, ey = 540, hx = 640, hy = 560;
      grainFill(ctx, c => c.ellipse(bx, by, 40, 10, 0, 0, Math.PI * 2), '#0e0c24', 0.4);
      ctx.strokeStyle = '#1a1638'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by - 4); ctx.lineTo(ex, ey); ctx.lineTo(hx - 20, hy - 14); ctx.stroke();
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(0.55 + nod);
      cone(ctx, 0, 26, 64, 520, 300, C.amber, 0.09 * flick);
      grainFill(ctx, c => { c.moveTo(-14, -26); c.lineTo(14, -26); c.lineTo(36, 22); c.lineTo(-36, 22); c.closePath(); }, lin(ctx, -36, 0, 36, 0, [[0, '#3c3270'], [1, '#120e2a']]), 0.5);
      ctx.fillStyle = '#ffe6b8'; ctx.beginPath(); ctx.ellipse(0, 22, 36, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      light(ctx, hx + 8, hy + 22, 110, C.amber, 0.6 * flick);
    }
    // a mug and a glass
    grainFill(ctx, c => { c.moveTo(560, 700); c.lineTo(600, 700); c.lineTo(596, 744); c.lineTo(564, 744); c.closePath(); }, lin(ctx, 560, 0, 600, 0, [[0, '#4a4f92'], [1, '#1c1d48']]), 0.4);
    ctx.strokeStyle = '#25285a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(604, 718, 11, -1.2, 1.2); ctx.stroke();
    for (let k = 0; k < 2; k++) { const ph = (t * 0.35 + k / 2) % 1; ctx.strokeStyle = rgba(C.cream, 0.14 * Math.sin(ph * Math.PI)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(574 + k * 12, 694);
      for (let s = 1; s <= 8; s++) ctx.lineTo(574 + k * 12 + Math.sin(s * 0.7 + t * 2 + k) * 6, 694 - s * 7 - ph * 22); ctx.stroke(); }
  });

  // people in front of the table, seen from behind (closest, most parallax)
  layer(1.3, () => {
    // P1: writing
    {
      const b = bre(1), wr = Math.sin(t * 9) * 5 + Math.sin(t * 2.3) * 8, wy = Math.abs(Math.sin(t * 13)) * 3;
      figure(ctx, { x: 450, y: 1085 + b * 2, s: 1.9, pal: ['#e8964e', '#a85424', '#401a0a'], len: 0.9, facing: 'back', br: b, lean: 0.08, turn: lerp(-0.2, -0.75, look), tilt: lerp(0.15, -0.05, look), lx: 1,
        rim: C.amber, rimA: 0.45, rimDx: 3, rimDy: -2,
        arms: [{ a1: 2.45, a2: -0.3, behind: true }, { a1: 0.75 + wr * 0.004, a2: -2.75 + wr * 0.012 + wy * 0.01, behind: true }] });
    }
    // P5: typing, then turns to look at the split
    {
      const b = bre(5);
      figure(ctx, { x: 1520, y: 1085 + b * 2, s: 1.9, len: 0.92, facing: 'back', br: b, lean: -0.04 + 0.04 * look, turn: lerp(0.12 + 0.1 * Math.sin(t * 0.5), 0.8, look), tilt: lerp(0.12, -0.15, look), lx: -1,
        rim: C.cyan, rimA: 0.6, rimDx: -4, rimDy: -3,
        arms: [{ a1: 2.4, a2: -0.4 + Math.sin(t * 13) * 0.05, behind: true }, { a1: 0.72, a2: -2.75 + Math.sin(t * 11) * 0.05, behind: true }] });
    }
  });

  stamp(ctx, t, 45.0, 50.9, 'AI 2027', 'Kokotajlo + four colleagues · April 2025', { size: 84 });
}

module.exports = { T0, T1, draw, figure, ik, capsule, roundRect };
