// Film 6 · c04 · the mind's furniture: easing, thought clouds that carry things, the brass clockwork (buddhi), the moving-tick line.
// Pure functions of t; deterministic prng; cached layers via the kit's layer(). Owned by c04 (builder of scenes/sc04.mjs).
// cloudImg() is a copy of the kit's private cloudImg (lib/f6_kit.mjs) with the tint baked into the layer, so no per-frame scratch copy.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, text } from '../engine.mjs';
import { stipple } from './art.mjs';
import { layer, once, F6, coolLine, reveal } from './f6_kit.mjs';
import { paperSheet, scribble } from './paper.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- easing (MOTION.md): quart in-out for moves, expo-out for landings, expo-in for exits
export function bezier(x1, y1, x2, y2) {
  const A = (a1, a2) => 1 - 3 * a2 + 3 * a1, B = (a1, a2) => 3 * a2 - 6 * a1, C = (a1) => 3 * a1;
  const calc = (u, a1, a2) => ((A(a1, a2) * u + B(a1, a2)) * u + C(a1)) * u, slope = (u, a1, a2) => 3 * A(a1, a2) * u * u + 2 * B(a1, a2) * u + C(a1);
  return (x) => { x = clamp(x); if (x <= 0) return 0; if (x >= 1) return 1; let u = x; for (let i = 0; i < 8; i++) { const s = slope(u, x1, x2); if (Math.abs(s) < 1e-6) break; u -= (calc(u, x1, x2) - x) / s; } return calc(clamp(u), y1, y2); };
}
export const QUART = bezier(.76, 0, .24, 1), EXPO_OUT = bezier(.16, 1, .3, 1), EXPO_IN = bezier(.7, 0, .84, 0);
// a smooth bell: 1 at q = 0, 0 at |q| >= 1
export const bell = (q) => (Math.abs(q) >= 1 ? 0 : Math.pow(Math.cos(q * Math.PI / 2), 2));

// ---------------------------------------------------------------- clouds (copied from the kit's cloudImg, tint baked in)
function cloudImg(v, col) {
  const R = 150; return layer(`c04cloud${v}:${col}`, R * 2, R * 2, (g, c) => {
    const r = prng(100 + v), puff = (px, py, pr, a) => { const rg = g.createRadialGradient(px, py - pr * .1, 0, px, py, pr); rg.addColorStop(0, `rgba(255,255,255,${a})`); rg.addColorStop(.62, `rgba(255,255,255,${a * .85})`); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.beginPath(); g.arc(px, py, pr, 0, TAU); g.fill(); };
    const base = R * 1.12, n = 4 + Math.floor(r() * 2);
    for (let i = 0; i < n; i++) { const px = R + (i / (n - 1) - .5) * R * 1.3, pr = R * (.3 + r() * .14); puff(px, base - pr * .55, pr, .92); }
    const m = 3 + Math.floor(r() * 3);
    for (let i = 0; i < m; i++) { const px = R + (r() - .5) * R * 1.0, pr = R * (.2 + r() * .18); puff(px, base - R * .45 - r() * R * .3, pr, .9); }
    puff(R, base - R * .25, R * .55, .8);
    const fl = g.createLinearGradient(0, base - 6, 0, base + 10); fl.addColorStop(0, 'rgba(0,0,0,0)'); fl.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = fl; g.fillRect(0, base - 6, R * 2, R); g.globalCompositeOperation = 'source-over';
    stipple(c, { k: .45, g: 1.4, seed: 9 + v, boost: 2 });
    g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, R * 2, R * 2); g.globalCompositeOperation = 'source-over';
  });
}
// one cloud at (cx, cy) of radius r (centre of the cloud body), alpha a, drawn in the current transform
export function cloud(ctx, cx, cy, r, a, v = 0, col = '#dfe7f2') {
  const img = cloudImg(v % 3, col); ctx.save(); ctx.globalAlpha = a; ctx.drawImage(img, cx - r, cy - r * .7, r * 2, r * 1.4); ctx.restore();
}

// ---------------------------------------------------------------- the three thoughts (4.03): a list sheet, a knot of thread, three notes
// drawn with the origin at the cloud's top centre; `rise` 0..1 lifts them out of the cloud (mask reveal from the cloud's top line)
function sheetLayer() {
  return layer('c04sheet', 140, 170, (g) => {
    paperSheet(g, 14, 10, 110, 146, { rot: -.06, seed: 11, shadow: false, light: [40, 0], content: (q, w, h) => {
      q.strokeStyle = 'rgba(80,90,130,.22)'; q.lineWidth = 1; for (let i = 0; i < 5; i++) { q.beginPath(); q.moveTo(w * .12, h * .22 + i * h * .15); q.lineTo(w * .9, h * .22 + i * h * .15); q.stroke(); }
      for (let i = 0; i < 5; i++) { const y = h * .22 + i * h * .15 - 6; q.strokeStyle = rgba(F6.ink, .7); q.lineWidth = 1.2; q.strokeRect(w * .12, y - 8, 10, 10); if (i < 2) { q.beginPath(); q.moveTo(w * .12 + 2, y - 3); q.lineTo(w * .12 + 5, y); q.lineTo(w * .12 + 11, y - 9); q.stroke(); } scribble(q, w * .3, y, w * .55, 7, { seed: 20 + i, ink: rgba(F6.ink, .8), lw: 1.3 }); }
      text(q, 'PLAN', w * .12, h * .12, { size: 9, weight: 600, color: rgba('#8e2f2a', .8), spacing: 3 });
    } });
  });
}
function knotLayer() {
  return layer('c04knot', 170, 150, (g, c) => {
    const pts = []; for (let i = 0; i <= 260; i++) { const u = i / 260 * TAU * 2.5; pts.push([85 + 44 * Math.sin(u * 1.0 + .4) + 19 * Math.sin(u * 2.3 + 1.1), 68 + 30 * Math.cos(u * 1.3) + 13 * Math.sin(u * 3.1 + .5)]); }
    const tail = []; for (let i = 0; i <= 30; i++) { const q = i / 30; tail.push([pts[pts.length - 1][0] + q * 60, pts[pts.length - 1][1] + 20 * q + 14 * Math.sin(q * 3)]); }
    const all = pts.concat(tail);
    for (const [w, col] of [[7, 'rgba(6,5,12,.5)'], [4.2, '#3a4158'], [1.6, '#9fb0cc']]) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); all.forEach(([x, y], i) => (i ? g.lineTo(x, y + (w > 6 ? 3 : 0)) : g.moveTo(x, y + (w > 6 ? 3 : 0)))); g.stroke(); }
    stipple(c, { k: .15, g: 1, seed: 4, mid: false, boost: 1 });
  });
}
function note(g, x, y, s, flag = true) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#1d1826'; g.strokeStyle = 'rgba(243,236,218,.75)'; g.lineWidth = 1.2;
  g.beginPath(); g.ellipse(0, 0, 9, 6, -.5, 0, TAU); g.fill(); g.stroke();
  g.lineWidth = 3; g.strokeStyle = '#1d1826'; g.beginPath(); g.moveTo(8, -2); g.lineTo(8, -34); g.stroke();
  g.lineWidth = 1; g.strokeStyle = 'rgba(243,236,218,.6)'; g.beginPath(); g.moveTo(9.6, -2); g.lineTo(9.6, -34); g.stroke();
  if (flag) { g.fillStyle = '#1d1826'; g.beginPath(); g.moveTo(8, -34); g.quadraticCurveTo(22, -26, 16, -10); g.quadraticCurveTo(18, -22, 8, -26); g.closePath(); g.fill(); }
  g.restore();
}
// kind 'plan'|'worry'|'song'; origin = the cloud's top centre; rise 0..1; t for the notes' loop (t0 = when the notes start to wander)
export function thought(ctx, kind, rise, t, t0) {
  const e = EXPO_OUT(rise); if (rise <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(-260, -400, 520, 408); ctx.clip();   // nothing below the cloud's top line (it rises out of the cloud)
  if (kind === 'plan') { const L = sheetLayer(), lift = 130 * (1 - e); ctx.drawImage(L, -58, -132 + lift, 116, 141); }
  else if (kind === 'worry') { const L = knotLayer(), lift = 110 * (1 - e); ctx.drawImage(L, -82, -108 + lift, 146, 129); }
  else {
    // three notes: they drift ahead of the cloud and are pulled back every 1.7 s (the song you can't shake)
    const lift = 90 * (1 - e), ph = ((Math.max(0, t - t0)) / 1.7) % 1, away = ph < .55 ? eout(ph / .55) : 1 - sm((ph - .55) / .45), ox = away * 92, oy = -away * 26;
    note(ctx, -40 + ox * .6, -26 + lift + oy * .6, 1.25, true); note(ctx, 6 + ox * .85, -44 + lift + oy * .85, 1.4, true); note(ctx, 50 + ox, -20 + lift + oy, 1.2, false);
    ctx.strokeStyle = 'rgba(243,236,218,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-30 + ox * .6, -68 + lift + oy * .6); ctx.quadraticCurveTo(12 + ox * .8, -100 + lift + oy * .8, 60 + ox, -60 + lift + oy); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the brass clockwork (4.06): engraved gears, meshing, constant speed
// a gear layer: brass body, N teeth, rim ring, spokes (big ones), hub; engraved concentric lines; verdigris in the recesses; stippled edge
function gearLayer(key, r, N, spokes, seed) {
  const th = Math.max(7, r * .085), S = Math.ceil((r + th) * 2 + 10);
  return layer('c04gear:' + key, S, S, (g, c) => {
    const cx = S / 2, cy = S / 2, rr = prng(seed);
    const brass = g.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r + th); brass.addColorStop(0, '#d9b36e'); brass.addColorStop(.45, '#b8894a'); brass.addColorStop(1, '#6e4a22');
    // teeth + body as one path
    g.beginPath();
    for (let i = 0; i < N; i++) { const a0 = i / N * TAU, da = TAU / N; const p = (a, rad) => [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]; const [x1, y1] = p(a0 - da * .18, r), [x2, y2] = p(a0 - da * .1, r + th), [x3, y3] = p(a0 + da * .1, r + th), [x4, y4] = p(a0 + da * .18, r); if (!i) g.moveTo(x1, y1); else g.lineTo(x1, y1); g.lineTo(x2, y2); g.lineTo(x3, y3); g.lineTo(x4, y4); const [x5, y5] = p(a0 + da * .5, r); g.lineTo(x5, y5); }
    g.closePath(); g.fillStyle = brass; g.fill();
    g.strokeStyle = 'rgba(40,24,8,.55)'; g.lineWidth = 1.2; g.stroke();
    // the rim ring and the recessed face
    g.strokeStyle = 'rgba(255,230,170,.35)'; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, r - 3, 0, TAU); g.stroke();
    g.fillStyle = 'rgba(60,40,14,.55)'; g.beginPath(); g.arc(cx, cy, r * .8, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(95,143,122,.35)'; g.lineWidth = 2.5; g.beginPath(); g.arc(cx, cy, r * .8 - 2, 0, TAU); g.stroke();   // verdigris in the groove
    if (spokes) {
      // spokes: the face is cut out between them (we see the dark behind), each spoke an engraved bar
      for (let i = 0; i < spokes; i++) { const a = i / spokes * TAU; g.save(); g.translate(cx, cy); g.rotate(a); const sg = g.createLinearGradient(0, -r * .07, 0, r * .07); sg.addColorStop(0, '#d9b36e'); sg.addColorStop(.5, '#a87a3c'); sg.addColorStop(1, '#5e3e1a'); g.fillStyle = sg; g.beginPath(); g.roundRect(r * .2, -r * .07, r * .62, r * .14, 3); g.fill(); g.strokeStyle = 'rgba(30,18,6,.5)'; g.lineWidth = 1; g.stroke(); g.restore(); }
      const hub = g.createRadialGradient(cx - r * .05, cy - r * .05, 0, cx, cy, r * .26); hub.addColorStop(0, '#e3c07a'); hub.addColorStop(.7, '#a87a3c'); hub.addColorStop(1, '#5e3e1a'); g.fillStyle = hub; g.beginPath(); g.arc(cx, cy, r * .26, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(30,18,6,.55)'; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, r * .26, 0, TAU); g.stroke();
    } else {
      const face = g.createRadialGradient(cx - r * .2, cy - r * .2, 0, cx, cy, r * .8); face.addColorStop(0, '#cfa660'); face.addColorStop(1, '#7e5628'); g.fillStyle = face; g.beginPath(); g.arc(cx, cy, r * .8 - 4, 0, TAU); g.fill();
    }
    // engraved concentric lines and a few radial engraving marks
    g.strokeStyle = 'rgba(40,24,8,.35)'; g.lineWidth = .8; for (const k of [.9, .86]) { g.beginPath(); g.arc(cx, cy, r * k, 0, TAU); g.stroke(); }
    g.strokeStyle = 'rgba(255,235,190,.18)'; g.beginPath(); for (let i = 0; i < N * 2; i++) { const a = i / (N * 2) * TAU + .05; g.moveTo(cx + Math.cos(a) * r * .82, cy + Math.sin(a) * r * .82); g.lineTo(cx + Math.cos(a) * r * .96, cy + Math.sin(a) * r * .96); } g.stroke();
    // the arbor pin
    g.fillStyle = '#2a1e10'; g.beginPath(); g.arc(cx, cy, Math.max(3, r * .05), 0, TAU); g.fill(); g.fillStyle = 'rgba(255,240,210,.5)'; g.beginPath(); g.arc(cx - 1, cy - 1, Math.max(1.2, r * .018), 0, TAU); g.fill();
    // verdigris speckle in the recesses
    g.fillStyle = 'rgba(95,143,122,.28)'; for (let i = 0; i < r * .6; i++) { const a = rr() * TAU, d = r * (.78 + rr() * .2); g.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.4, 1.4); }
    stipple(c, { k: .25, g: 1, seed, mid: false, boost: 1 });
  });
}
// the train: A big (5 spokes), B mid (4 spokes), C small, D pinion. Positions in world space; ratios from the teeth; meshing phases.
export const GEARS = [
  { id: 'A', x: 650, y: 560, r: 150, N: 30, spokes: 5, dir: 1 },
  { id: 'B', x: 858, y: 680, r: 90, N: 18, spokes: 4, dir: -1, mesh: 0 },
  { id: 'C', x: 834, y: 406, r: 70, N: 14, spokes: 0, dir: -1, mesh: 0 },
  { id: 'D', x: 889, y: 311, r: 40, N: 8, spokes: 0, dir: 1, mesh: 2 },
];
const OMEGA = .3;   // rad/s of the big gear (constant, mechanical)
export const RIM_SPEED = OMEGA * GEARS[0].r;   // px/s at the big gear's rim
function gearAngle(i, t) {
  const g = GEARS[i]; if (g.mesh == null) return OMEGA * t;
  const m = GEARS[g.mesh], am = gearAngle(g.mesh, t), phi = Math.atan2(g.y - m.y, g.x - m.x);
  return -(am - phi) * m.N / g.N + phi + Math.PI / g.N;   // the teeth of g interleave with m's along the line of centres
}
// clockwork(ctx, t, { rise: [u per gear 0..1] (position lead + darkness handled by the caller's riseFromDark), light: {x, y} (the candle: the lit side) })
// only draws the gears whose rise > 0; each with a static shading overlay (the brass is lit from the candle's side)
export function clockwork(ctx, t, o = {}) {
  const rise = o.rise || [1, 1, 1, 1];
  GEARS.forEach((g, i) => {
    const u = rise[i]; if (u <= 0) return;
    const L = gearLayer(g.id, g.r, g.N, g.spokes, 70 + i), lead = 40 * (1 - EXPO_OUT(u)), a = gearAngle(i, t);
    ctx.save(); ctx.translate(g.x, g.y + lead);
    // a soft shadow behind it on the wall
    ctx.fillStyle = 'rgba(4,3,8,.35)'; ctx.beginPath(); ctx.arc(8, 10, g.r + 6, 0, TAU); ctx.fill();
    ctx.save(); ctx.rotate(a); ctx.drawImage(L, -L.width / 2, -L.height / 2); ctx.restore();
    // static shading: lit from the lower left (the candle), darker on the upper right; a cool edge from the line above
    const lx = o.light ? o.light.x - g.x : -200, ly = o.light ? o.light.y - g.y - lead : 150, n = Math.hypot(lx, ly) || 1;
    const sh = ctx.createLinearGradient(lx / n * g.r, ly / n * g.r, -lx / n * g.r, -ly / n * g.r); sh.addColorStop(0, 'rgba(255,220,160,.12)'); sh.addColorStop(.5, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(5,4,10,.42)');
    ctx.beginPath(); ctx.arc(0, 0, g.r + 14, 0, TAU); ctx.fillStyle = sh; ctx.fill();
    ctx.restore();
  });
}
// the straight cool line that sags onto the big gear and then runs with it (ticks move at the rim speed)
export function beltLine(ctx, t, { x0, x1, y, u, sag, slide, a = 1 }) {
  const A = GEARS[0], top = A.y - A.r - 12, pts = [];
  for (let x = x0; x <= x1 + .5; x += 8) pts.push([x, y + sag * (top - y) * bell((x - A.x) / 240)]);
  coolLine(ctx, t, { pts, u, w: 1.6, ticks: false, head: u < 1, a });
  if (u <= 0) return;
  // the engraving ticks: fixed while the line is straight, sliding at the rim's speed once it rests on the gear
  const d = [0]; for (let i = 1; i < pts.length; i++) d[i] = d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const L = d[d.length - 1] * clamp(u), off = ((slide % 9) + 9) % 9;
  ctx.save(); ctx.strokeStyle = rgba(F6.coolCore, .32 * a); ctx.lineWidth = .8; ctx.beginPath();
  for (let s = off; s < L; s += 9) { let j = 1; while (j < pts.length - 1 && d[j] < s) j++; const q = (s - d[j - 1]) / ((d[j] - d[j - 1]) || 1), px = mix(pts[j - 1][0], pts[j][0], q), py = mix(pts[j - 1][1], pts[j][1], q), nx = -(pts[j][1] - pts[j - 1][1]), ny = pts[j][0] - pts[j - 1][0], nl = Math.hypot(nx, ny) || 1, h = 1.6 + 1.2 * Math.sin(s * .07 + t); ctx.moveTo(px - nx / nl * h, py - ny / nl * h); ctx.lineTo(px + nx / nl * h + 2, py + ny / nl * h); }
  ctx.stroke(); ctx.restore();
}
// the label under the clockwork, pressed in brass-coloured caps, mask-revealed
export function buddhiLabel(ctx, u, x, y) {
  if (u <= 0) return;
  reveal(ctx, x - 320, y - 22, 640, 32, u, (g) => text(g, 'BUDDHI  ·  INTELLECT', x, y, { size: 17, weight: 600, color: rgba('#e3c07a', .9), align: 'center', spacing: 6 }));
}
