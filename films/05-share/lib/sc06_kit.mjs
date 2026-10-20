// C6's own helpers (not shared): a single-stroke handwriting for the pen (PLANT · GROW · HARVEST on the napkin), the rooftop
// lap close-up set for 3.14–3.17, soft city bokeh, a dotted "idea" card and a plant label card for 4.10/4.11.
import { W, H, rgba, clamp, mix, lin, sm, eout, eio, prng, canvas, text } from '../engine.mjs';
import { stipple, vnoise, fbm, roughPath, hatch as aHatch } from './art.mjs';
import { rooftop } from './rooftop.mjs';
import { ghostLine } from './ghost.mjs';
import { gBorder, rosette } from './certificate.mjs';

const TAU = Math.PI * 2;
const CACHE = new Map(); export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };

// ---------------- handwriting: single-stroke capitals (box 0..w × 0..1, y down) ----------------
const GL = {
  P: { w: .62, s: [[[0, 1], [0, .5], [0, 0], [.4, 0], [.62, .1], [.64, .28], [.48, .46], [.02, .5]]] },
  L: { w: .56, s: [[[0, 0], [0, .55], [0, 1], [.56, 1]]] },
  A: { w: .76, s: [[[0, 1], [.2, .48], [.38, 0], [.57, .5], [.76, 1]], [[.14, .64], [.62, .62]]] },
  N: { w: .7, s: [[[0, 1], [0, .45], [0, 0], [.35, .5], [.7, 1], [.7, .5], [.7, 0]]] },
  T: { w: .72, s: [[[0, .02], [.36, 0], [.72, .01]], [[.36, 0], [.36, .5], [.36, 1]]] },
  G: { w: .74, s: [[[.72, .2], [.55, .02], [.3, .02], [.08, .2], [.02, .52], [.14, .86], [.42, 1], [.68, .9], [.74, .64], [.44, .62]]] },
  R: { w: .66, s: [[[0, 1], [0, .5], [0, 0], [.4, 0], [.62, .1], [.62, .3], [.46, .46], [.04, .5], [.36, .72], [.66, 1]]] },
  O: { w: .78, s: [[[.42, 0], [.12, .1], [0, .48], [.1, .86], [.4, 1], [.7, .88], [.78, .5], [.68, .12], [.42, 0], [.3, .04]]] },
  W: { w: .9, s: [[[0, 0], [.2, 1], [.44, .28], [.66, 1], [.9, 0]]] },
  H: { w: .7, s: [[[0, 0], [0, .5], [0, 1]], [[.7, 0], [.7, .5], [.7, 1]], [[0, .52], [.35, .5], [.7, .5]]] },
  V: { w: .74, s: [[[0, 0], [.18, .5], [.37, 1], [.56, .5], [.74, 0]]] },
  E: { w: .6, s: [[[.6, 0], [.3, 0], [0, 0], [0, .5], [0, 1], [.3, 1], [.62, 1]], [[0, .5], [.48, .5]]] },
  S: { w: .66, s: [[[.64, .14], [.46, 0], [.18, .02], [.04, .2], [.14, .42], [.5, .55], [.66, .76], [.56, .96], [.28, 1], [.02, .86]]] },
};
// Catmull-Rom through the control points → dense polyline
function crs(P, n = 8) {
  const out = []; for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < n; k++) { const u = k / n, u2 = u * u, u3 = u2 * u;
      out.push([.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * u + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3),
        .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3)]); }
  }
  out.push(P[P.length - 1]); return out;
}
// a word as strokes in local px (baseline at y = 0, cap height = size), with a slight hand: slant, wobble, uneven sizes
export function wordStrokes(word, size, seed = 1) {
  return once('ws' + word + size + '|' + seed, () => {
    const r = prng(seed * 7 + 3), n = vnoise(seed), strokes = []; let x = 0;
    for (const ch of word) {
      const g = GL[ch]; if (!g) { x += size * .5; continue; }
      const sc = size * (.94 + r() * .12), dy = (r() - .5) * size * .06, slant = .14 + (r() - .5) * .05;
      for (const st of g.s) {
        const P = st.map(([px, py]) => { const yy = (py - 1) * sc + dy; return [x + px * sc - yy * slant, yy]; });
        const dense = crs(P, 6).map(([px, py], k) => [px + (n(px * .05, k * .3) - .5) * size * .05, py + (n(k * .3, px * .05 + 9) - .5) * size * .05]);
        strokes.push(dense);
      }
      x += g.w * sc + size * (.2 + r() * .06);
    }
    const len = (s) => { let L = 0; for (let i = 1; i < s.length; i++) L += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]); return L; };
    const lens = strokes.map(len), air = strokes.map((s, i) => (i ? Math.hypot(s[0][0] - strokes[i - 1].at(-1)[0], s[0][1] - strokes[i - 1].at(-1)[1]) * .45 : 0));
    const total = lens.reduce((a, b) => a + b, 0) + air.reduce((a, b) => a + b, 0);
    return { strokes, lens, air, total, width: x - size * .2 };
  });
}
// draw a word written by a pen up to u (0..1); returns the pen tip [x, y] and whether the nib is down
export function penWrite(ctx, word, x, y, size, u, o = {}) {
  const WS = wordStrokes(word, size, o.seed ?? 1), ink = o.ink || '#1b2350', lw = o.w ?? Math.max(1.6, size * .085), rot = o.rot ?? 0;
  let left = clamp(u) * WS.total, tip = null, down = false;
  const c = Math.cos(rot), sn = Math.sin(rot), S = (px, py) => [x + px * c - py * sn, y + px * sn + py * c];
  ctx.save(); ctx.strokeStyle = ink; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = o.a ?? 1;
  for (let i = 0; i < WS.strokes.length; i++) {
    const st = WS.strokes[i];
    if (WS.air[i] > 0) { if (left < WS.air[i]) { const q = left / WS.air[i], a0 = WS.strokes[i - 1].at(-1), b0 = st[0]; tip = S(mix(a0[0], b0[0], q), mix(a0[1], b0[1], q) - Math.sin(q * Math.PI) * size * .25); down = false; left = -1; break; } left -= WS.air[i]; }
    if (left <= 0) break;
    ctx.beginPath(); let acc = 0, p = S(...st[0]); ctx.moveTo(p[0], p[1]);
    for (let k = 1; k < st.length; k++) {
      const d = Math.hypot(st[k][0] - st[k - 1][0], st[k][1] - st[k - 1][1]);
      if (acc + d >= left) { const q = (left - acc) / (d || 1); p = S(mix(st[k - 1][0], st[k][0], q), mix(st[k - 1][1], st[k][1], q)); ctx.lineTo(p[0], p[1]); tip = p; down = true; acc = left + 1; break; }
      acc += d; p = S(...st[k]); ctx.lineTo(p[0], p[1]);
    }
    ctx.lineWidth = lw; ctx.stroke();
    // a touch of ink pooling at the stroke start
    const s0 = S(...st[0]); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(s0[0], s0[1], lw * .62, 0, TAU); ctx.fill();
    if (acc > left) break;
    left -= WS.lens[i]; tip = S(...st.at(-1)); down = true;
  }
  ctx.restore();
  if (!tip) tip = S(...WS.strokes[0][0]);
  return { tip, down, width: WS.width };
}

// ---------------- soft city bokeh behind the lap (night, sodium + a few cool lights) ----------------
export function bokehLayer() {
  return once('bokeh', () => {
    const [c, g] = canvas(W + 300, H), r = prng(61);
    g.filter = 'blur(3px)';
    for (let i = 0; i < 120; i++) {
      const x = r() * (W + 300), y = H * (.05 + Math.pow(r(), .8) * .6), rr = 8 + r() * 46, warm = r() < .78, a = .05 + r() * .12;
      const col = warm ? (r() < .7 ? '255,154,60' : '255,200,130') : '160,190,255';
      const gg = g.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, `rgba(${col},${a * .9})`); gg.addColorStop(.75, `rgba(${col},${a})`); gg.addColorStop(.92, `rgba(${col},${a * 1.4})`); gg.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gg; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
    }
    g.filter = 'none';
    stipple(c, { k: .5, g: 1, seed: 62, mid: true, boost: 1.6 });
    return c;
  });
}
// the rooftop helper (C1, night state) rendered small and scaled up: an out-of-focus plate behind the close-up
const RT = []; function rtCanvas() { if (!RT.length) RT.push(canvas(480, 270)); return RT[0]; }
export function roofBlur(ctx, t, o = {}) {
  const [c, g] = rtCanvas(); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 480, 270); g.save(); g.scale(.25, .25);
  try { rooftop(g, t, { state: 'night', cam: { x: o.camX ?? 0, y: o.camY ?? 140, z: o.z ?? 1.25 }, seats: 2 }); } catch { g.fillStyle = '#10142e'; g.fillRect(0, 0, W, H); }
  g.restore();
  ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.globalAlpha = o.a ?? 1; ctx.drawImage(c, -20, -20 + (o.dy ?? 0), W + 40, H + 40); ctx.restore();
}

// ---------------- the lap: a thigh and knee in petrol trousers under the napkin (close-up from above) ----------------
export function lapLayer() {
  return once('lap', () => {
    const [c, g] = canvas(W + 200, H + 200), n = vnoise(23), ox = 100, oy = 100;
    g.translate(ox, oy);
    // parapet ledge behind the knee (concrete top, its outer edge rimmed by the sodium glow from below)
    g.beginPath(); g.moveTo(-100, 168); g.lineTo(W + 100, 98); g.lineTo(W + 100, 232); g.lineTo(-100, 316); g.closePath();
    const pg = g.createLinearGradient(0, 100, 0, 320); pg.addColorStop(0, '#3a3440'); pg.addColorStop(1, '#17151f'); g.fillStyle = pg; g.fill();
    g.save(); g.clip(); aHatch(g, [-100, 90, W + 200, 240], { angle: -.04, gap: 4, w: .7, col: '#05040a', a: .35, seed: 4, broken: .3 }); g.restore();
    g.strokeStyle = 'rgba(255,170,90,.75)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(-100, 168); g.lineTo(W + 100, 98); g.stroke();
    g.strokeStyle = 'rgba(255,200,140,.25)'; g.lineWidth = 7; g.beginPath(); g.moveTo(-100, 170); g.lineTo(W + 100, 100); g.stroke();
    // the thigh: a broad rounded form from the lower left (hip, near) to the knee (upper right)
    const th = new (globalThis.Path2D || Object)();
    g.beginPath(); g.moveTo(-100, 1180); g.bezierCurveTo(-60, 720, 240, 430, 760, 330); g.bezierCurveTo(1150, 255, 1560, 250, 1760, 320);
    g.bezierCurveTo(1960, 390, 1990, 560, 1880, 700); g.bezierCurveTo(1700, 900, 1500, 1080, 1420, 1190); g.closePath();
    const tg = g.createLinearGradient(400, 250, 900, 1100); tg.addColorStop(0, '#2f5a63'); tg.addColorStop(.45, '#1f4650'); tg.addColorStop(1, '#0d2128'); g.fillStyle = tg; g.fill();
    g.save(); g.clip();
    // fabric folds: soft dark creases + light ridges running along the thigh
    for (let k = 0; k < 9; k++) { const y0 = 380 + k * 80, r = prng(k + 3); g.strokeStyle = `rgba(4,12,16,${.18 + r() * .2})`; g.lineWidth = 10 + r() * 22; g.beginPath(); g.moveTo(-50, y0 + 500); g.bezierCurveTo(500, y0 + 80 - k * 10, 1100, y0 - 140, 1900, y0 - 60 + r() * 80); g.stroke();
      g.strokeStyle = `rgba(150,210,215,${.04 + r() * .05})`; g.lineWidth = 3 + r() * 6; g.beginPath(); g.moveTo(-50, y0 + 470); g.bezierCurveTo(500, y0 + 50 - k * 10, 1100, y0 - 170, 1900, y0 - 90 + r() * 80); g.stroke(); }
    // warm rim on the knee's far edge (the city glow below the parapet), cool fill falling into shadow toward us
    const rg = g.createRadialGradient(1500, 160, 0, 1500, 220, 900); rg.addColorStop(0, 'rgba(255,160,80,.38)'); rg.addColorStop(.5, 'rgba(255,140,70,.08)'); rg.addColorStop(1, 'rgba(255,140,70,0)'); g.fillStyle = rg; g.fillRect(-100, 0, W + 200, H + 200);
    aHatch(g, [-100, 500, W + 200, 800], { angle: -.9, gap: 4.6, w: .8, col: '#020608', a: .3, seed: 7, broken: .35 });
    const dg = g.createLinearGradient(0, 600, 0, H + 200); dg.addColorStop(0, 'rgba(2,6,8,0)'); dg.addColorStop(1, 'rgba(2,6,8,.6)'); g.fillStyle = dg; g.fillRect(-100, 0, W + 200, H + 300);
    g.restore();
    g.strokeStyle = 'rgba(255,170,100,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(760, 330); g.bezierCurveTo(1150, 255, 1560, 250, 1760, 320); g.bezierCurveTo(1960, 390, 1990, 560, 1880, 700); g.stroke();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .3, g: 1, seed: 24, mid: false, boost: 1 });
    return c;
  });
}

// ---------------- 4.10 / 4.11 cards: a garden label card (two faces) and the dotted idea card ----------------
// labelCard(ctx, x, y, s, t, { flip 0..1 (turns like a coin around its vertical axis: front 'subsidies' → back 'stake'), rot, front, back,
//   sink 0..1 (pushed into the soil: the lower part disappears below groundY), groundY })
export function labelCard(ctx, x, y, s, t, o = {}) {
  const w = 150, h = 210, f = clamp(o.flip ?? 0), ang = f * Math.PI, sx = Math.cos(ang), face = sx >= 0 ? 0 : 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s * Math.max(.03, Math.abs(sx)), s);
  // a stake card: rounded top, pointed foot
  const path = () => { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 18); ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + 18, -h / 2); ctx.lineTo(w / 2 - 18, -h / 2); ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + 18); ctx.lineTo(w / 2, h / 2 - 40); ctx.lineTo(0, h / 2 + 22); ctx.lineTo(-w / 2, h / 2 - 40); ctx.closePath(); };
  ctx.save(); ctx.shadowColor = 'rgba(20,10,5,.4)'; ctx.shadowBlur = 14; ctx.shadowOffsetX = 8; ctx.shadowOffsetY = 10; path(); ctx.fillStyle = '#efe4cc'; ctx.fill(); ctx.restore();
  path(); const pg = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); pg.addColorStop(0, face ? '#fff4dc' : '#f4ead4'); pg.addColorStop(1, face ? '#e8c890' : '#d6c6a4'); ctx.fillStyle = pg; ctx.fill();
  ctx.save(); path(); ctx.clip();
  if (face) { // the stake side: foil-edged, engraved
    ctx.strokeStyle = rgba('#c87a2c', .9); ctx.lineWidth = 3; path(); ctx.stroke();
    rosette(ctx, 0, -28, { R: 30, A: 9, B: 4, n: 12, m: 5, lines: 18, col: '#8a5a24', w: .5, a: .9 });
    text(ctx, (o.back || 'stake').toUpperCase(), 0, 52, { size: 30, font: 'Instrument Serif', color: '#3a2410', align: 'center', spacing: 3 });
  } else {
    ctx.strokeStyle = 'rgba(80,70,60,.4)'; ctx.lineWidth = 1.2; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 64, 10); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, (o.front || 'subsidies').toUpperCase(), 0, -6, { size: 19, weight: 600, color: '#5a5048', align: 'center', spacing: 2.5 });
    ctx.strokeStyle = 'rgba(90,80,70,.5)'; ctx.lineWidth = 1; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-44, 20 + k * 12); ctx.lineTo(44 - k * 18, 20 + k * 12); ctx.stroke(); }
  }
  // the side facing away darkens as it turns
  ctx.fillStyle = `rgba(20,12,6,${.35 * (1 - Math.abs(sx))})`; ctx.fillRect(-w, -h, 2 * w, 2 * h);
  ctx.restore();
  ctx.strokeStyle = 'rgba(90,70,50,.45)'; ctx.lineWidth = 1.2; path(); ctx.stroke();
  ctx.restore();
}
// the dotted idea card: only a ghost engraving (border, a small building outline, a ring of tiny figures), it floats and glows
export function ideaCard(ctx, x, y, s, t, o = {}) {
  const w = 230, h = 150, a = o.a ?? 1, lit = clamp(o.lit ?? 0), ring = clamp(o.ring ?? 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s); ctx.globalAlpha = a;
  // faint paper (barely there: an idea)
  ctx.fillStyle = `rgba(243,239,226,${.08 + .06 * lit})`; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 10); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, w * .8); gg.addColorStop(0, rgba('#ffb35c', .16 + .2 * lit)); gg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = gg; ctx.fillRect(-w, -h, 2 * w, 2 * h); ctx.restore();
  const col = '#fff1d6', dot = 5.5 / s;
  const rect = (x0, y0, ww, hh, rr) => { const P = []; const k = 12; const add = (cx, cy, a0) => { for (let i = 0; i <= k; i++) { const aa = a0 + i / k * Math.PI / 2; P.push([cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr]); } };
    add(x0 + ww - rr, y0 + rr, -Math.PI / 2); add(x0 + ww - rr, y0 + hh - rr, 0); add(x0 + rr, y0 + hh - rr, Math.PI / 2); add(x0 + rr, y0 + rr, Math.PI); P.push(P[0]); return P; };
  ghostLine(ctx, rect(-w / 2, -h / 2, w, h, 10), { ghost: 1, col, w: 1.6 / s, dot, a: .95 });
  ghostLine(ctx, rect(-w / 2 + 9, -h / 2 + 9, w - 18, h - 18, 6), { ghost: 1, col, w: 1 / s, dot: dot * .8, a: .6 });
  // a small company building (outline) and the people around it who own part of it
  const B = [[-26, 22], [-26, -30], [-6, -42], [26, -30], [26, 22]];
  ghostLine(ctx, [...B, [-26, 22]], { ghost: 1, col, w: 1.3 / s, dot, a: .9 });
  for (let k = 0; k < 3; k++) ghostLine(ctx, [[-16, -18 + k * 13], [16, -18 + k * 13]], { ghost: 1, col, w: 1 / s, dot: dot * .8, a: .7 });
  const n = 14;
  for (let k = 0; k < n; k++) {
    const aa = Math.PI * (.08 + .84 * k / (n - 1)), px = Math.cos(aa) * 82, py = 34 - Math.sin(aa) * 6 + (k % 2) * 4, on = clamp(ring * 1.6 - k / n * .6);
    ctx.fillStyle = rgba(on > .1 ? '#ffd59a' : col, .55 + .45 * on); ctx.beginPath(); ctx.arc(px, py - 13, 3.2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.roundRect(px - 3.6, py - 9, 7.2, 12, 3.4); ctx.fill();
    if (on > .1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g2 = ctx.createRadialGradient(px, py - 8, 0, px, py - 8, 16); g2.addColorStop(0, rgba('#ffb35c', .45 * on)); g2.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = g2; ctx.fillRect(px - 16, py - 24, 32, 32); ctx.restore(); }
  }
  // dotted lines from the people to the building: "partly owned by all its citizens"
  if (ring > 0) for (let k = 0; k < n; k += 2) { const aa = Math.PI * (.08 + .84 * k / (n - 1)), px = Math.cos(aa) * 82, py = 34 - Math.sin(aa) * 6 - 14; ghostLine(ctx, [[px, py], [px * .3, mix(py, 0, .7)]], { ghost: 1, col: '#ffd59a', w: .9 / s, dot: dot * .7, a: .7 * ring, u: clamp(ring * 1.4 - k / n * .4) }); }
  ctx.restore();
}
