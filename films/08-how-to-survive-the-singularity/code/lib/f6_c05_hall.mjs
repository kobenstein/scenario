// Film 6 · c05 · the hall of the mirror: a dim space at first light (the same morning as c04: the sitter of c04 on a bench, his candle),
// the floor line, dust motes, thought clouds, and the old map sheet (3.06) that falls to the floor and loses its lines as smoke.
// World coordinates (1920×1080 at camera z 1; the hall extends beyond). Pure functions of t; deterministic prng; cached layers.
// Copied from other files (never imported, so a change there cannot break this chunk): bezier() from lib/f6_c04_mind.mjs; the bench and the
// sitter's pose/dress from lib/f6_c04_room.mjs (continuity: the same person); diagram()/devaScript() from lib/f6_c03_world.mjs (the oldest map),
// here drawn with lib/ghost.mjs ghostLine so the lines can lift off as dots.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, canvas, text } from '../engine.mjs';
import { stipple } from './art.mjs';
import { fibreFill } from './print.mjs';
import { figure, POSES } from './figure.mjs';
import { layer, once, F6, ember, witness, clouds } from './f6_kit.mjs';
import { paperSheet } from './paper.mjs';
import { ghostLine } from './ghost.mjs';

const TAU = Math.PI * 2;
// ---------------------------------------------------------------- easing (MOTION.md): quart in-out for moves, expo-out for landings, expo-in for exits
export function bezier(x1, y1, x2, y2) {
  const A = (a1, a2) => 1 - 3 * a2 + 3 * a1, B = (a1, a2) => 3 * a2 - 6 * a1, C = (a1) => 3 * a1;
  const calc = (u, a1, a2) => ((A(a1, a2) * u + B(a1, a2)) * u + C(a1)) * u, slope = (u, a1, a2) => 3 * A(a1, a2) * u * u + 2 * B(a1, a2) * u + C(a1);
  return (x) => { x = clamp(x); if (x <= 0) return 0; if (x >= 1) return 1; let u = x; for (let i = 0; i < 8; i++) { const s = slope(u, x1, x2); if (Math.abs(s) < 1e-6) break; u -= (calc(u, x1, x2) - x) / s; } return calc(clamp(u), y1, y2); };
}
export const QUART = bezier(.76, 0, .24, 1), EXPO_OUT = bezier(.16, 1, .3, 1), EXPO_IN = bezier(.7, 0, .84, 0);

export const FLOOR_Y = 900;                                      // where the wall meets the floor
export const FIG = { x: 415, y: 745, s: 2.0, seed: 4 };          // the sitter: hip on the bench top
export const BENCH = { x0: 290, x1: 620, y: 745, legY: 925 };
export const CANDLE = { x: 760, y: 935, s: .75 };
export const FLAME = [CANDLE.x, CANDLE.y - 118 * CANDLE.s];
export const HEAD = [FIG.x + 4, FIG.y - 118 * FIG.s];             // where the witness point stands (above and behind the head)

// ---------------------------------------------------------------- the wall and the floor (one cached layer, 2600×1400 around the world)
export const WX = -340, WY = -160, WW = 2600, WH = 1400;
function hallBase() {
  return layer('c05hall', WW, WH, (g, c) => {
    const fy = FLOOR_Y - WY;
    const bg = g.createLinearGradient(0, 0, 0, fy); bg.addColorStop(0, '#1c1922'); bg.addColorStop(.6, '#1a1820'); bg.addColorStop(1, '#15131a'); g.fillStyle = bg; g.fillRect(0, 0, WW, fy);
    const fl = g.createLinearGradient(0, fy, 0, WH); fl.addColorStop(0, '#1c171d'); fl.addColorStop(.5, '#120f14'); fl.addColorStop(1, '#0b090d'); g.fillStyle = fl; g.fillRect(0, fy, WW, WH - fy);
    // plaster flecks, fibre
    const r = prng(21); g.fillStyle = 'rgba(255,240,220,.05)'; for (let i = 0; i < 9000; i++) g.fillRect(r() * WW, r() * WH, 1.5, 1.5);
    g.beginPath(); g.rect(0, 0, WW, WH); fibreFill(g, .07);
    // the first light of morning: grey-gold from the high left (a window out of frame), a shaft falling across the wall behind the sitter
    const a = g.createRadialGradient(60 - WX, 140 - WY, 0, 60 - WX, 140 - WY, 1500); a.addColorStop(0, 'rgba(241,217,168,.30)'); a.addColorStop(.45, 'rgba(241,217,168,.10)'); a.addColorStop(1, 'rgba(241,217,168,0)'); g.fillStyle = a; g.fillRect(0, 0, WW, WH);
    g.save(); g.translate(-WX, -WY); g.beginPath(); g.moveTo(-340, -180); g.lineTo(520, -180); g.lineTo(1300, FLOOR_Y); g.lineTo(300, FLOOR_Y); g.closePath();
    const sh = g.createLinearGradient(100, -200, 1000, FLOOR_Y); sh.addColorStop(0, 'rgba(241,217,168,.14)'); sh.addColorStop(.6, 'rgba(241,217,168,.05)'); sh.addColorStop(1, 'rgba(241,217,168,0)'); g.fillStyle = sh; g.fill(); g.restore();
    // the floor gives a little of that light back, and a haze lies along the wall's foot
    const fg = g.createRadialGradient(400 - WX, fy + 60, 0, 400 - WX, fy + 60, 900); fg.addColorStop(0, 'rgba(241,217,168,.10)'); fg.addColorStop(1, 'rgba(241,217,168,0)'); g.fillStyle = fg; g.fillRect(0, fy, WW, WH - fy);
    const hz = g.createLinearGradient(0, fy - 90, 0, fy + 40); hz.addColorStop(0, 'rgba(120,110,120,0)'); hz.addColorStop(.7, 'rgba(120,110,120,.07)'); hz.addColorStop(1, 'rgba(120,110,120,0)'); g.fillStyle = hz; g.fillRect(0, fy - 90, WW, 130);
    g.fillStyle = 'rgba(241,217,168,.12)'; g.fillRect(0, fy - 1, WW, 2);
    stipple(c, { k: .25, g: 1, seed: 6, mid: false, boost: 1 });
  });
}
export function hall(ctx) { ctx.drawImage(hallBase(), WX, WY); }

// ---------------------------------------------------------------- the bench, the sitter, the candle, the motes (copied look of c04's room)
export function bench(ctx, B = BENCH, k = 1) {
  const { x0, x1, y, legY } = B, th = 16 * k, lw = 14 * k;
  ctx.fillStyle = 'rgba(4,4,10,.45)'; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, legY + 4 * k, (x1 - x0) * .55, 10 * k, 0, 0, TAU); ctx.fill();
  const wg = ctx.createLinearGradient(0, y, 0, y + th); wg.addColorStop(0, '#4a3828'); wg.addColorStop(1, '#2a1f16'); ctx.fillStyle = wg; ctx.fillRect(x0, y, x1 - x0, th);
  ctx.fillStyle = 'rgba(241,217,168,.35)'; ctx.fillRect(x0, y, x1 - x0, 2 * k);
  for (const lx of [x0 + 26 * k, x1 - 40 * k]) { ctx.fillStyle = '#241a14'; ctx.fillRect(lx, y + th, lw, legY - y - th); ctx.fillStyle = '#2e2419'; ctx.fillRect(lx + 2 * k, y + th, 3 * k, legY - y - th); }
  ctx.fillStyle = '#1c1410'; ctx.fillRect(x0 + 26 * k, y + 60 * k, x1 - x0 - 52 * k, 6 * k);
}
export function sitter(ctx, t, o = {}) {
  const x = o.x ?? FIG.x, y = o.y ?? FIG.y, s = o.s ?? FIG.s, L = o.light || { x: FLAME[0], y: FLAME[1] };
  figure(ctx, x, y, s, { ...POSES.sit, head: .08, sh: [.5, .42], el: [.95, 1] },
    { t, seed: FIG.seed, accent: '#8a5a3a', dress: { pants: '#2a2128' }, light: { x: L.x, y: L.y, col: o.lightCol || F6.amberCore, a: o.lightA ?? .6 }, rim: o.rim || rgba(F6.amber, .8), rimSide: o.rimSide ?? 1, flip: !!o.flip, shadow: false });
}
export function candle(ctx, t, o = {}) { return ember(ctx, t, { x: o.x ?? CANDLE.x, y: o.y ?? CANDLE.y, kind: 'candle', s: o.s ?? CANDLE.s, r: o.r ?? 190, a: o.a ?? 1 }); }
const MOTES = once('c05motes', () => { const r = prng(505); return Array.from({ length: 26 }, () => ({ x: 480 + r() * 560, y: 500 + r() * 500, s: .8 + r() * 1.4, ph: r() * TAU, v: 4 + r() * 7 })); });
export function motes(ctx, t) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const m of MOTES) {
    const y = m.y - ((t * m.v + m.ph * 40) % 500), x = m.x + 14 * Math.sin(t * .5 + m.ph) + 6 * Math.sin(t * 1.3 + m.ph * 2), d = Math.hypot(x - FLAME[0], y - FLAME[1]);
    const a = clamp(1 - d / 420) * (.35 + .35 * Math.sin(t * 2 + m.ph)); if (a <= .02) continue;
    ctx.fillStyle = rgba(F6.amberCore, a * .55); ctx.beginPath(); ctx.arc(x, y, m.s, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// the thoughts above the sitter, drifting right toward the mirror (the kit's clouds)
export function hallClouds(ctx, t, a = .5) { return clouds(ctx, t, { x: 100, y: 100, w: 840, h: 230, n: 3, seed: 2, speed: 14, s: .85, a }); }

// ---------------------------------------------------------------- the reflected hall (drawn into the glass by greatMirror; world coords, pre-mirror:
// the glass flips x, so what should appear LEFT in the mirror is drawn RIGHT of MX here; the morning light stays on the left in the image)
export function hallReflection(g, t, o) {
  const { MX, MY, w, h, witnessA = 0, cloudsA = .5 } = o, fy = 809;   // the reflected floor line (the hall's depth)
  const x0 = MX - w / 2 - 20, x1 = MX + w / 2 + 20, y0 = MY - h / 2 - 20, y1 = MY + h / 2 + 20;
  const bg = g.createLinearGradient(0, y0, 0, fy); bg.addColorStop(0, '#2a2622'); bg.addColorStop(.75, '#1c181d'); bg.addColorStop(1, '#17141a'); g.fillStyle = bg; g.fillRect(x0, y0, x1 - x0, fy - y0);
  const fl = g.createLinearGradient(0, fy, 0, y1); fl.addColorStop(0, '#17141a'); fl.addColorStop(1, '#0d0b10'); g.fillStyle = fl; g.fillRect(x0, fy, x1 - x0, y1 - fy);
  const wl = g.createRadialGradient(MX + 300, MY - 200, 0, MX + 300, MY - 200, 760); wl.addColorStop(0, 'rgba(241,217,168,.5)'); wl.addColorStop(1, 'rgba(241,217,168,0)'); g.fillStyle = wl; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  g.fillStyle = 'rgba(241,217,168,.14)'; g.fillRect(x0, fy - 1, x1 - x0, 2);
  // the thoughts crossing the glass (drawn with t reversed so they drift the same way as in the hall once the glass flips them)
  clouds(g, 1000 - t, { x: MX - 560, y: MY - 420 - (MY - 491) * 0 + 0, w: 1120, h: 170, n: 3, seed: 5, speed: 95, s: .7, a: cloudsA, col: '#e4ecf6' });
  // the sitter, farther, lit from the left of the image (= the right here), his candle beside him, the witness above
  const sx = MX + RSIT.dx, sy = RSIT.y, ss = RSIT.s, k = ss / FIG.s;
  bench(g, { x0: sx - (FIG.x - BENCH.x0) * k, x1: sx + (BENCH.x1 - FIG.x) * k, y: sy, legY: sy + (BENCH.legY - BENCH.y) * k }, k);
  sitter(g, t, { x: sx, y: sy, s: ss, light: { x: MX - 150, y: 740 }, lightA: .5, rim: rgba('#f1d9a8', .75), rimSide: -1 });
  candle(g, t, { x: MX - 150, y: fy + 20, s: .45, r: 120, a: .8 });
  if (witnessA > 0) witness(g, t, { x: sx + 2, y: sy - 118 * ss, r: 4, halo: 80, a: witnessA });
}

// ---------------------------------------------------------------- the old map (3.06): the sheet, its diagram, the fall, the lift-off
// the reflected sitter (pre-mirror world coords: the glass flips x around MX, so his witness point shows at MX - dx - 2)
export const RSIT = { dx: 60, y: 691, s: 1.35 };
export const reflHead = (MX) => [MX - RSIT.dx - 2, RSIT.y - 118 * RSIT.s];

export const SHEET = { w: 360, h: 240, x: 1150, y: 985, rot: -.06, sy: .58 };
function sheetLayer() {
  return layer('c05sheet', SHEET.w + 60, SHEET.h + 60, (g, c) => {
    paperSheet(g, 20, 16, SHEET.w, SHEET.h, { seed: 9, tone: '#dfcba3', light: [40, -60], shadow: true, content: (q, w, h) => {
      const r = prng(31); for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * h, rr = 8 + r() * 22, al = .04 + .08 * r(); const sg = q.createRadialGradient(x, y, 0, x, y, rr); sg.addColorStop(0, rgba('#7a5a2c', al)); sg.addColorStop(1, rgba('#7a5a2c', 0)); q.fillStyle = sg; q.beginPath(); q.ellipse(x, y, rr, rr * .7, r() * 3, 0, TAU); q.fill(); }
      const rim = q.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .3, w / 2, h / 2, Math.max(w, h) * .62); rim.addColorStop(0, 'rgba(90,60,20,0)'); rim.addColorStop(1, 'rgba(90,60,20,.28)'); q.fillStyle = rim; q.fillRect(0, 0, w, h);
    } });
    stipple(c, { k: .2, g: 1, seed: 3, mid: false, boost: 1 });
  });
}
// the diagram's strokes in sheet units (w × h): the line, the two sides of the flame, the inner tongue (polylines for ghostLine)
const DIAG = once('c05diag', () => {
  const w = SHEET.w, h = SHEET.h, sy = 1.15, y0 = h * .6, x0 = w * .14, x1 = w * .86;
  const line = Array.from({ length: 48 }, (_, i) => [mix(x0, x1, i / 47), y0 + Math.sin(i * .9) * .25 * h * .004]);
  const fx = w * .5, base = y0 - h * .01, fh = h * .34 * sy, fw = w * .07;
  const side = (sg) => Array.from({ length: 30 }, (_, i) => { const q = i / 29, yy = base - fh * q, ww = fw * Math.sin(Math.PI * Math.min(1, q * 1.15)) * (1 - q * .15); return [fx + sg * ww * (1 + .25 * Math.sin(q * 5)), yy]; });
  const tongue = Array.from({ length: 14 }, (_, i) => { const q = i / 13; return [fx + fw * .35 * Math.sin(Math.PI * q) * (q < .5 ? -1 : 1) * .6, base - fh * .55 * q]; });
  return { line, left: side(-1), right: side(1), tongue, notes: [[w * .16, h * .74, w * .2, h * .05 * sy, 11], [w * .6, y0 - fh * .7, w * .15, h * .045 * sy, 12], [w * .62, h * .74, w * .17, h * .05 * sy, 13]] };
});
// unreadable Sanskrit-like writing (copy of c03's devaScript): a head bar, strokes hanging from it; u draws it left to right (negative = un-writing)
function devaScript(g, x, y, w, size, u, o = {}) {
  u = clamp(u); if (u <= 0) return; const r = prng(o.seed ?? 3), ink = o.ink || '#3a2814';
  g.save(); g.strokeStyle = ink; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = Math.max(.6, size * .09) * .9;
  const n = 4 + Math.floor(r() * 4), parts = []; let cx = x;
  for (let i = 0; i < n; i++) { const gw = size * (.5 + r() * .5); parts.push([cx, gw, r(), r(), r()]); cx += gw + size * .18; if (r() < .3) cx += size * .35; }
  const total = cx - x, lim = x + total * u;
  g.beginPath(); g.moveTo(x, y); g.lineTo(Math.min(lim, x + total), y); g.stroke();
  for (const [gx, gw, k1, k2, k3] of parts) {
    if (gx > lim) break; const e = Math.min(gw, lim - gx) / gw; g.beginPath();
    g.moveTo(gx + gw * .3, y); g.lineTo(gx + gw * .3, y + size * (.6 + .4 * k1) * e);
    if (k2 < .5) { g.moveTo(gx + gw * .3, y + size * .45 * e); g.quadraticCurveTo(gx + gw * .95, y + size * .5, gx + gw * .8, y + size * .95 * e); }
    else { g.moveTo(gx + gw * .05, y + size * .5); g.lineTo(gx + gw * .3, y + size * .5); }
    if (k3 < .35) { g.moveTo(gx + gw * .4, y - size * .15); g.lineTo(gx + gw * .7, y - size * .32); }
    g.stroke();
  }
  g.restore();
}
// the sheet's pose at time t: falls from above (rocking like a leaf) from t0 to t1, then lies on the floor in perspective
export function sheetPose(t, t0, t1) {
  const u = lin(t0, t1, t), land = sm(lin(.82, 1, u)), ph = u * TAU * 1.5;
  const yy = mix(-260, SHEET.y, 1 - Math.pow(1 - u, 1.35));   // a sheet falls at a near-constant speed and settles
  const rock = .32 * Math.sin(ph), sway = 90 * Math.sin(ph + 1.2), tilt = .58 + .42 * Math.abs(Math.cos(ph + .4));
  return { x: SHEET.x + sway * (1 - land), y: yy, rot: mix(rock, SHEET.rot, land), sy: mix(tilt, SHEET.sy, land), flying: u < 1 };
}
// draw the sheet: pose {x, y, rot, sy}; ink: { u (notes 0..1), ghost 0..1, smoke 0..1 }; t for the smoke drift
export function mapSheet(ctx, t, pose, ink = {}) {
  const { x, y, rot, sy } = pose, c = Math.cos(rot), s = Math.sin(rot), w = SHEET.w, h = SHEET.h;
  const P = (px, py) => { const lx = px - w / 2, ly = (py - h / 2) * sy; return [x + lx * c - ly * s, y + lx * s + ly * c]; };
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, sy); ctx.drawImage(sheetLayer(), -w / 2 - 20, -h / 2 - 16);
  // the notes (ink on the paper, in sheet units; they un-write when u goes down)
  const D = DIAG, nu = ink.u ?? 1;
  ctx.translate(-w / 2, -h / 2);
  D.notes.forEach(([nx, ny, nw, ns, seed], i) => devaScript(ctx, nx, ny, nw, ns, clamp(nu * 3 - (2 - i)), { seed }));
  ctx.restore();
  // the engraved line and the flame: in world space (so the dots lift off the paper as round dots and the smoke rises upward)
  const ghost = clamp(ink.ghost ?? 0), smoke = clamp(ink.smoke ?? 0);
  for (const [pts, seed, lw] of [[D.line, 4, 2.2], [D.left, 5, 1.9], [D.right, 6, 1.9], [D.tongue, 7, 1.5]]) {
    const wp = pts.map(([px, py]) => P(px, py));
    ghostLine(ctx, wp, { ghost, smoke, col: '#3a2814', w: lw, dot: 5, seed, t, a: 1 });
  }
}
