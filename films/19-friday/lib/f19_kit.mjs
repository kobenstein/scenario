// Film 19 · "The Singularity Was Predicted for This Friday" · shared kit (owned by the lead; builders import, never edit — wishes go in
// the report). Base: lib/f10_editorial.mjs (2.5D stage: card, cam3, camAt, aim, camDrift, F0, du, person, prng …) + lib/f16_kit.mjs
// (rise, maskLine, measure, trailSpan, along, blink). This file adds THE SHEET and its objects (docs/MOTION.md §2–3).
//
//   BASE = THE CHANNEL'S EDITORIAL NIGHT (Jakob 24.10.2026: indigo night, gold light, the tiny you in the yellow raincoat, grain,
//   much empty dark). THE SHEET: one giant map of 1960 graph paper drawn in blue light on indigo, lying in the night under ONE gold lamp.
//   It is the page of Science where the line was printed. EXPLAINERS are light ON the sheet (gold ink = people, the first line; cream
//   type = print; cool cyan light = the machine, the second line). SCENES are cut layers LIFTED OFF the sheet (indigo silhouettes,
//   gold-lit holes and edges, you in yellow), casting soft shadows onto it. The signature move is the LIFT-OFF (a drawing rises as a cut
//   layer) and its reverse, the
//   LAY-DOWN (a scene folds flat and its outlines become the diagram).
//
// Coordinates: the sheet is a card at depth ZS (= F0 = 1700): at the home camera cam3() one design px = one screen px. Lifted layers sit
// at ZS − lift·LIFT (nearer: real parallax when the camera moves). Cameras: aim(ZS, u, v, s, sx, sy) frames design point (u, v) at
// screen (sx, sy) with s× magnification; camAt(t, K, ZS) interpolates keys on words.
//
//   PAL                       the palette (paper, desk, grid, red ink, graphite, cool light, lamp, coat, cut paper)   PRINT19 = finish
//   sheet(ctx, c, t, o)       the sheet card: lamp-lit paper, foxing, the 1/5/10 mm grid (only what is visible), o.edge shows the desk
//                             o: { lamp: [u, v] (design), lampR, cool: [u, v, r, a] (cool spill of the light line), dim 0..1 }
//   onSheet(ctx, c, fn)       draw fn() in sheet design coordinates (ink, graphite, light on the paper)
//   lifted(ctx, c, lift, fn, o)  a cut-paper layer lifted off the sheet by lift 0..1 (depth + paper shadow); fn draws in design coords
//   paperCut(ctx, path, col, o)  fill a Path2D as cut paper (flat colour, lamp-side light edge); use inside lifted()
//   ink(ctx, pts, u, o)       a red ink line drawn by a nib up to arc length u (0..1); returns the head [x, y] · o: { w, col, head, dash }
//   lightLine(ctx, pts, u, o) THE MACHINE LINE: cool light on paper up to u; returns the head · o: { w, a, spill }
//   CH / yearX / popY / fPop / realPop / curvePts   the 1960 chart on the sheet (formula vs. reality), KNEE (the bend, mid-1990s)
//   AI / aiPts                the field of the light line (2019 →) right of the 1960 chart
//   chart1960(ctx, c, t, st)  THE 1960 PAGE as one state-driven picture (masthead, axes, formula, reality, slip, ∞, the light line):
//                             c01, the seam plate and every later callback draw it with this one function (see the header of it)
//   people(ctx, t, pts, u, o) tiny ink people standing along a polyline (no stick limbs: filled silhouettes)
//   slip(ctx, t, x, y, w, o)  THE CALENDAR SLIP (tear-off block on a pin): FRI · 13 · NOV 2026, or o.q '?'; o.tear 0..1 (top page off)
//   qcard(ctx, t, x, y, w, o) THE QUESTION CARD (index card on a red pin): o.lines, o.answer (red handwriting), o.u, o.au, o.flip
//   loopWheel(ctx, t, x, y, r, o)  THE LOOP: PEOPLE → INVENTORS → PROGRESS; o: { arrows 0..3, bead (laps), cool, broken 0..1, u }
//   stopwatch / hourglass / wheel   the stopwatch (o.run, o.wedge), the hourglass ONE WORKING DAY (o.sand), the steering wheel (o.turn)
//   screen(ctx, t, T, id, x, y, w, h, o) + lowerThird(ctx, t, T, id)   the clip frame (ORIGINAL FOOTAGE) and its lower third
//   clipSlot(T, id)           {start, end} of a clip from timing.json (or the provisional slot)
//   you(ctx, x, y, h, o)      "du" on paper (yellow raincoat; paper shadow) · other(ctx, x, y, h, o) everyone else (indigo silhouettes)
//   label(ctx, s, x, y, size, u, o)  type on paper rising from its baseline (Inter caps / Instrument Serif), graphite by default
// Rules as everywhere: no canvas, pattern or image cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import { clipFrame } from './kit.mjs';
const { W, H, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, prng, drift, F0, card, cardM } = E;
export const { rise, blink, maskLine, measure, trailSpan, along } = K16;

// ======================================================================================================================== palette
export const PAL = {   // EDITORIAL NIGHT (channel rule 24.10.2026, /mnt/project-files/scenario/stil/STIL-editorial-nacht.md): indigo night, gold light, you in yellow
  paper0: '#22336b', paper1: '#1a2a5e', paper2: '#132050', paper3: '#0d1840', paper4: '#0a1334',   // THE SHEET = a light map in the night: lamp-lit indigo → edge
  desk0: '#05071a', desk1: '#080b27', desk2: '#0e112c',                                              // the night around the sheet
  grid0: '#33497a', grid1: '#4a64a8',                                                                // the 1960 graph grid, drawn in blue light
  red0: '#ead295', red1: '#9e7d54', red2: '#fefde2',                                                 // the FIRST LINE = people: warm gold ink (body, shadow, core). Names kept for the builders.
  gold0: '#fefde2', gold1: '#fef4bf', gold2: '#ead295', gold3: '#9e7d54',                            // gold light (core → shadow)
  ink0: '#fefcde', ink1: '#a6b0d4', ink2: '#6f7aa6',                                                 // type and marks ON THE SHEET: cream, blue-grey, faint
  cool0: '#f0fcff', cool1: '#9ae3ff', cool2: '#3bb2e4', cool3: '#12669a',                            // cool light = the machine, the SECOND LINE (cool3 only on cards)
  lamp: '#fef4bf', flame: '#ffc56a',                                                                 // the lamp (gold), the candle
  coat: '#f2b632',                                                                                   // you, only you
  cut0: '#0a184a', cut1: '#151f4b', cut2: '#1f2b5e', cutLit: '#394773',                              // lifted silhouettes (indigo), blue-lit edge
  card: '#fefcde', cardShade: '#d9cfb3', cardLine: '#9fb7c9', cInk0: '#151f4b', cInk1: '#394773', cAccent: '#a5671f',   // cards/slips: lit cream paper, indigo type, amber hand
};
export const PRINT19 = { grain: 14, floor: 4, vig: .55, vcol: '#05071a' };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== the sheet
export const ZS = F0;                                       // the sheet's depth (design px = screen px at the home camera)
export const LIFT = 240;                                    // a fully lifted layer stands this much nearer the camera
export const SHEET = { x0: -2600, y0: -2200, x1: 4800, y1: 2700 };
const FOX = (() => { const r = prng(1913), o = []; for (let i = 0; i < 70; i++) o.push([lerp(SHEET.x0, SHEET.x1, r()), lerp(SHEET.y0, SHEET.y1, r()), 20 + r() * 140, .025 + r() * .05, r()]); return o; })();
// the visible design rect of the sheet for camera c (with margin)
function view(c, m = 40) { const M = cardM(c, ZS); if (!M) return null; return [(-m - M.e) / M.k, (-m - M.f) / M.k, (W + m - M.e) / M.k, (H + m - M.f) / M.k, M.k]; }
export function onSheet(ctx, c, fn) { return card(ctx, c, ZS, fn); }
export function sheet(ctx, c, t, o = {}) {
  // the night around the sheet (screen space)
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = PAL.desk1; ctx.fillRect(0, 0, W, H); ctx.restore();
  const v = view(c); if (!v) return;
  const [vx0, vy0, vx1, vy1, k] = v;
  const lamp = o.lamp ?? [960, 540], R = (o.lampR ?? 1500) * (1 + .012 * Math.sin(t * .7)), dim = o.dim ?? 0;
  card(ctx, c, ZS, () => {
    const x0 = Math.max(SHEET.x0, vx0), y0 = Math.max(SHEET.y0, vy0), x1 = Math.min(SHEET.x1, vx1), y1 = Math.min(SHEET.y1, vy1);
    if (x1 <= x0 || y1 <= y0) return;
    // paper under the lamp: a warm pool falling off to the edge tone
    ctx.fillStyle = rad(ctx, lamp[0], lamp[1], R, [[0, mixHex(PAL.paper0, PAL.paper2, dim * .6)], [.38, mixHex(PAL.paper1, PAL.paper3, dim * .5)], [.75, mixHex(PAL.paper2, PAL.paper4, .35 + dim * .3)], [1, PAL.paper4]]);
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.fillStyle = rad(ctx, lamp[0], lamp[1], R * .7, [[0, rgba(PAL.gold2, .09 * (1 - dim))], [1, rgba(PAL.gold2, 0)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);   // gold light on the map
    if (o.edge) { ctx.strokeStyle = rgba(PAL.desk0, .5); ctx.lineWidth = 3 / k; ctx.strokeRect(SHEET.x0, SHEET.y0, SHEET.x1 - SHEET.x0, SHEET.y1 - SHEET.y0); }
    // foxing: a few faint age spots (static on the paper)
    for (const [fx, fy, fr, fa] of FOX) { if (fx + fr < x0 || fx - fr > x1 || fy + fr < y0 || fy - fr > y1) continue; ctx.fillStyle = rad(ctx, fx, fy, fr, [[0, rgba(PAL.paper3, fa)], [1, rgba(PAL.paper3, 0)]]); ctx.fillRect(fx - fr, fy - fr, fr * 2, fr * 2); }
    // the grid: 1 mm (12.8), 5 mm (64) and 1 cm (128) at the 1960 scale of this sheet; fine lines fade out when they get dense on screen
    const g = [[12.8, .16, .7, PAL.grid0], [64, .28, 1, PAL.grid0], [128, .42, 1.5, PAL.grid1]];
    for (const [step, a0, w, col] of g) {
      const a = a0 * clamp((step * k - 5) / 9) * (1 - .45 * dim); if (a <= .01) continue;
      ctx.strokeStyle = rgba(col, a); ctx.lineWidth = Math.max(.6 / k, w * .9);
      ctx.beginPath();
      for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) { ctx.moveTo(x, y0); ctx.lineTo(x, y1); }
      for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); }
      ctx.stroke();
    }
    // the cool spill of the light line on the paper (the machine's light)
    if (o.cool && o.cool[3] > 0) { const [cx, cy, cr, ca] = o.cool; ctx.fillStyle = rad(ctx, cx, cy, cr, [[0, rgba(PAL.cool1, .34 * ca)], [.4, rgba(PAL.cool2, .14 * ca)], [1, rgba(PAL.cool2, 0)]]); ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2); }
  });
}

// ======================================================================================================================== lifted paper
// A cut-paper layer lifted off the sheet: drawn at depth ZS − lift·LIFT in design coords (so it shows parallax when the camera moves)
// with a soft paper shadow thrown away from the lamp onto the sheet. lift 0 = flat on the paper (no shadow): the lift-off starts there.
// o.light = [dx, dy] direction FROM the lamp (shadow direction, screen), default down-right.
export function lifted(ctx, c, lift, fn, o = {}) {
  const Z = ZS - clamp(lift) * (o.depth ?? LIFT);
  return card(ctx, c, Z, (k) => {
    const g = ZS / Z; ctx.translate(W / 2, H / 2); ctx.scale(g, g); ctx.translate(-W / 2, -H / 2);   // same world point and size as on the sheet: it rises straight up toward you
    const L = o.light ?? [.55, .8], d = (3 + 22 * clamp(lift)) * k * g;
    ctx.shadowColor = rgba(PAL.desk0, (.18 + .22 * clamp(lift)) * (o.shadow ?? 1)); ctx.shadowBlur = (4 + 26 * clamp(lift)) * k; ctx.shadowOffsetX = L[0] * d; ctx.shadowOffsetY = L[1] * d;
    fn(k * g);
  });
}
// fill a Path2D as cut paper: flat colour with the lamp-side edge lit (paper thickness). Inside lifted() it also casts the shadow.
export function paperCut(ctx, path, col, o = {}) {
  ctx.fillStyle = o.grad ?? col; ctx.fill(path);
  if (o.edge !== false) {
    ctx.save(); ctx.shadowColor = 'transparent'; ctx.clip(path);
    ctx.strokeStyle = rgba(o.edgeCol ?? PAL.cutLit, o.edgeA ?? .55); ctx.lineWidth = o.edgeW ?? 3;
    ctx.translate(o.ex ?? 1.5, o.ey ?? 1.5); ctx.stroke(path); ctx.restore();
  }
}

// ======================================================================================================================== lines
const plen = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
// the polyline up to arc fraction u, plus its head point
export function partial(pts, u) {
  const L = plen(pts), T = L[L.length - 1], d = clamp(u) * T, out = [pts[0]];
  let i = 1; for (; i < pts.length && L[i] <= d; i++) out.push(pts[i]);
  if (i < pts.length) { const f = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]); }
  return out;
}
const stroke = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); };
// red ink drawn by a nib: a darker rim, a flat body, a wet head (blot + glint) while it is drawing
export function ink(ctx, pts, u = 1, o = {}) {
  if (u <= 0) return pts[0];
  const p = partial(pts, u), w = o.w ?? 6, col = o.col ?? PAL.red0, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.dash) ctx.setLineDash(o.dash.map((d) => d * w));
  if (o.glow ?? true) { ctx.strokeStyle = rgba(col, .16); ctx.lineWidth = w * 3.6; stroke(ctx, p); ctx.strokeStyle = rgba(col, .22); ctx.lineWidth = w * 1.9; stroke(ctx, p); }   // warm light around the ink
  ctx.strokeStyle = mixHex(col, PAL.red1, .45); ctx.lineWidth = w; stroke(ctx, p);
  ctx.strokeStyle = col; ctx.lineWidth = w * .62; stroke(ctx, p);
  ctx.setLineDash([]);
  const hd = p[p.length - 1];
  if ((o.head ?? true) && u < 1) {
    ctx.fillStyle = mixHex(col, PAL.red1, .5); ctx.beginPath(); ctx.arc(hd[0], hd[1], w * .95, 0, 6.29); ctx.fill();
    ctx.fillStyle = rgba(PAL.red2, .9); ctx.beginPath(); ctx.arc(hd[0] - w * .25, hd[1] - w * .3, w * .28, 0, 6.29); ctx.fill();
  }
  ctx.restore();
  return hd;
}
// the machine line: cool light on the paper. Halo strokes (tint the paper cool), a saturated body, a white core; spill at the head.
export function lightLine(ctx, pts, u = 1, o = {}) {
  if (u <= 0) return pts[0];
  const p = partial(pts, u), w = o.w ?? 6, a = o.a ?? 1;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha *= a;
  for (const [ww, col, al] of [[w * 9, PAL.cool2, .07], [w * 4.5, PAL.cool2, .13], [w * 2.2, PAL.cool1, .45]]) { ctx.strokeStyle = rgba(col, al); ctx.lineWidth = ww; stroke(ctx, p); }
  ctx.strokeStyle = PAL.cool2; ctx.lineWidth = w * 1.15; stroke(ctx, p);
  ctx.strokeStyle = PAL.cool0; ctx.lineWidth = w * .5; stroke(ctx, p);
  const hd = p[p.length - 1], sp = o.spill ?? 1;
  if (sp > 0) { ctx.fillStyle = rad(ctx, hd[0], hd[1], w * 22, [[0, rgba(PAL.cool0, .7 * sp)], [.25, rgba(PAL.cool1, .3 * sp)], [1, rgba(PAL.cool2, 0)]]); ctx.fillRect(hd[0] - w * 22, hd[1] - w * 22, w * 44, w * 44); }
  ctx.restore();
  return hd;
}

// ======================================================================================================================== the 1960 chart
// On the sheet: x = years 1800 → 2026.87 (the asymptote t0), y = people (billions). Formula (von Foerster, Mora, Amiot 1960):
// N(t) = 1.79e11 / (2026.87 − t)^0.99 (faktenzettel #4, constants [prüfen]); reality: UN / OWID world population (rounded).
export const CH = { x0: 160, y0: 960, pxYear: 6.52, pxBn: 58, t0: 2026.87, top: -760 };
export const yearX = (yr) => CH.x0 + (yr - 1800) * CH.pxYear;
export const popY = (bn) => CH.y0 - bn * CH.pxBn;
export const fPop = (yr) => 1.79e11 / Math.pow(Math.max(.01, CH.t0 - yr), .99) / 1e9;
const REAL = [[1800, .98], [1850, 1.26], [1900, 1.65], [1920, 1.86], [1930, 2.07], [1940, 2.3], [1950, 2.5], [1955, 2.77], [1960, 3.0], [1965, 3.34], [1970, 3.7], [1975, 4.07],
  [1980, 4.44], [1985, 4.86], [1990, 5.33], [1995, 5.74], [2000, 6.15], [2005, 6.54], [2010, 6.96], [2015, 7.38], [2020, 7.84], [2026, 8.3]];
export function realPop(yr) {   // Catmull-Rom (Hermite) through the data: no kinks at the data years
  let i = 1; while (i < REAL.length - 1 && REAL[i][0] < yr) i++;
  const P0 = REAL[Math.max(0, i - 2)], P1 = REAL[i - 1], P2 = REAL[i], P3 = REAL[Math.min(REAL.length - 1, i + 1)];
  const h = P2[0] - P1[0], s = clamp((yr - P1[0]) / h), m1 = (P2[1] - P0[1]) / (P2[0] - P0[0]) * h, m2 = (P3[1] - P1[1]) / (P3[0] - P1[0]) * h;
  const s2 = s * s, s3 = s2 * s; return (2 * s3 - 3 * s2 + 1) * P1[1] + (s3 - 2 * s2 + s) * m1 + (-2 * s3 + 3 * s2) * P2[1] + (s3 - s2) * m2;
}
// polyline of the formula from y0 to y1 (years), clipped at the chart top; and of reality
export function curvePts(y0, y1, n = 160, f = fPop) {
  const out = [];
  for (let i = 0; i <= n; i++) { const yr = lerp(y0, y1, i / n), y = popY(f(yr)); out.push([yearX(yr), Math.max(CH.top, y)]); if (y < CH.top) break; }
  return out;
}
export const formulaPts = curvePts(1800, CH.t0 - .001, 420);
export const realPts = (y1 = 2026) => curvePts(1800, y1, 180, realPop);
export const KNEE = { yr: 1997, get x() { return yearX(1997); }, get y() { return popY(realPop(1997)); } };
// the axes of the chart in graphite (ticks every 50 years + 1960, 2026); u reveals
export function axes(ctx, t, o = {}) {
  const u = o.u ?? 1, a = o.a ?? 1; if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = PAL.ink1; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  const xr = yearX(lerp(1800, 2040, u));
  ctx.beginPath(); ctx.moveTo(CH.x0, CH.y0); ctx.lineTo(xr, CH.y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CH.x0, CH.y0); ctx.lineTo(CH.x0, lerp(CH.y0, popY(15.2), u)); ctx.stroke();
  for (const yr of [1800, 1850, 1900, 1950, 2000]) { const x = yearX(yr); if (x > xr) continue; ctx.beginPath(); ctx.moveTo(x, CH.y0); ctx.lineTo(x, CH.y0 + 14); ctx.stroke(); label(ctx, String(yr), x, CH.y0 + 48, 24, 1, { align: 'center', col: PAL.ink1 }); }
  for (const bn of [2, 4, 6, 8, 10, 12, 14]) { const y = popY(bn); if (y < lerp(CH.y0, popY(15.2), u)) continue; ctx.beginPath(); ctx.moveTo(CH.x0 - 14, y); ctx.lineTo(CH.x0, y); ctx.stroke(); label(ctx, String(bn), CH.x0 - 24, y + 8, 22, 1, { align: 'right', col: PAL.ink1 }); }
  ctx.restore();
}
// the field of the machine line (right of the 1960 chart): its own baseline, years 2019 → 2027; the line rises slow, then shoots up
export const AI = { x0: 1960, x1: 2700, y0: 960 };
export const aiPts = (() => { const out = []; for (let i = 0; i <= 160; i++) { const s = i / 160, x = lerp(AI.x0, AI.x1 - 80, Math.pow(s, .8)), y = AI.y0 - 2500 * (Math.exp(5.6 * s) - 1) / (Math.exp(5.6) - 1); out.push([x, y]); } return out; })();

// ======================================================================================================================== type on paper
// Inter caps (labels, sources) or Instrument Serif (numbers, titles), graphite by default, rising from an invisible baseline (u 0..1)
export function label(ctx, s, x, y, size, u = 1, o = {}) {
  if (u <= 0) return 0;
  const serif = !!o.serif, k = expoOut(clamp(u)), font = serif ? `${o.italic ? 'italic ' : ''}${size}px "Instrument Serif${o.italic ? ' Italic' : ''}"` : `${o.weight ?? 600} ${size}px Inter`;
  ctx.save(); ctx.font = font; ctx.textAlign = o.align ?? 'left'; if (o.spacing ?? (!serif ? .12 : 0)) ctx.letterSpacing = `${o.spacing ?? .12}em`;
  const w = ctx.measureText(s).width, xl = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.beginPath(); ctx.rect(xl - size, y - size * 1.2, w + size * 2, size * 1.5); ctx.clip();
  ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.col ?? PAL.ink0; ctx.fillText(s, x, y + (1 - k) * size * 1.15);
  ctx.restore();
  return w;
}
// the infinity sign written in red ink (a lemniscate, drawn by the nib; the fonts have no good ∞)
export function infinity(ctx, x, y, r, u, o = {}) {
  if (u <= 0) return; const pts = []; for (let i = 0; i <= 90; i++) { const a = Math.PI / 2 + i / 90 * Math.PI * 2, d = 1 + Math.sin(a) ** 2; pts.push([x + r * Math.cos(a) / d * 1.25, y + r * Math.sin(a) * Math.cos(a) / d * 1.25]); }
  ink(ctx, pts, u, { w: o.w ?? r * .11, head: u < 1, col: o.col });
}
// a hand-drawn strike (red) through a word of width w at (x, y); u draws it
export function strike(ctx, x, y, w, u, o = {}) { if (u <= 0) return; ink(ctx, [[x - 8, y + 4], [x + w * .5, y - 2], [x + w + 8, y - 6]], u, { w: o.w ?? 5, head: false }); }
// a hand-drawn ring (red) around (x, y); u draws it (starts top-left, overshoots a little)
export function ring(ctx, x, y, rx, ry, u, o = {}) {
  if (u <= 0) return; const pts = []; for (let i = 0; i <= 60; i++) { const a = -2.4 + i / 60 * 6.75, wob = 1 + .04 * Math.sin(i * .7); pts.push([x + Math.cos(a) * rx * wob, y + Math.sin(a) * ry * wob]); }
  ink(ctx, pts, u, { w: o.w ?? 4.5, head: false });
}

// ======================================================================================================================== people
// tiny ink people standing along a polyline (filled silhouettes, never stick figures). u: how far along the line they have stood up;
// density grows with o.dense(f) (f = 0..1 along the line). Deterministic per index.
export function people(ctx, t, pts, u, o = {}) {
  if (u <= 0) return; const L = plen(pts), T = L[L.length - 1], h0 = o.h ?? 26, r = prng(o.seed ?? 77), col = o.col ?? PAL.ink0;
  const n = o.n ?? 220;
  ctx.save(); ctx.fillStyle = col; ctx.globalAlpha *= o.a ?? 1;
  for (let i = 0; i < n; i++) {
    const f = Math.pow(i / n, o.pow ?? .55), d = f * T, rr = r(), rh = r(); if (f > u) continue;
    let j = 1; while (j < pts.length - 1 && L[j] < d) j++;
    const g = (d - L[j - 1]) / Math.max(1e-6, L[j] - L[j - 1]), x = lerp(pts[j - 1][0], pts[j][0], g) + (rr - .5) * 6, y = lerp(pts[j - 1][1], pts[j][1], g);
    const up = smooth(clamp((u - f) * 14)), h = h0 * (.8 + .4 * rh) * up; if (h < 1) continue;
    const sway = Math.sin(t * 1.3 + i) * .02 * h;
    ctx.beginPath(); ctx.arc(x + sway, y - h * .84, h * .13, 0, 6.29); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - h * .17, y - 2); ctx.quadraticCurveTo(x - h * .2, y - h * .66, x + sway, y - h * .68); ctx.quadraticCurveTo(x + h * .2, y - h * .66, x + h * .17, y - 2); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ======================================================================================================================== calendar slip
// A tear-off calendar block (lifted paper) hanging on a red pin at (x, y) = the pin; w = block width (h = 1.18 w).
// o: { day 'FRI', num '13', mon 'NOV 2026', q (show '?' instead of the number), cool (cool ink for '?'), tear 0..1 (the top page tears
// off and flutters away up-right, revealing the page below: o.under = face of the page below), ring 0..1 (gold ring round the number) }
export function slip(ctx, t, x, y, w, o = {}) {
  const h = w * 1.18, sw = o.swing ?? .012 * Math.sin(t * 1.1);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.globalAlpha *= o.a ?? 1;
  const face = (f, ox = 0, oy = 0, rot = 0, al = 1) => {
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(rot); ctx.globalAlpha *= al;
    const p = new Path2D(); p.roundRect(-w / 2, w * .06, w, h, w * .03);
    ctx.fillStyle = lin(ctx, 0, w * .06, 0, h, [[0, PAL.card], [1, PAL.cardShade]]); ctx.fill(p);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = PAL.cInk0; ctx.fillRect(-w / 2, w * .06, w, h * .2);
    ctx.font = `600 ${w * .1}px Inter`; ctx.textAlign = 'center'; ctx.letterSpacing = '0.16em'; ctx.fillStyle = PAL.card; ctx.fillText(f.mon ?? 'NOV 2026', 0, w * .06 + h * .135);
    ctx.font = `600 ${w * .11}px Inter`; ctx.fillStyle = PAL.cInk1; ctx.fillText(f.day ?? 'FRI', 0, w * .06 + h * .33);
    ctx.letterSpacing = '0em'; ctx.font = `${w * .52}px "Instrument Serif"`; ctx.fillStyle = f.q ? (f.cool ? PAL.cool3 : PAL.cInk0) : PAL.cInk0;
    ctx.fillText(f.q ? '?' : (f.num ?? '13'), 0, w * .06 + h * .78);
    ctx.restore();
  };
  // the stack (pages below) and the shadow
  ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = w * .12; ctx.shadowOffsetX = w * .04; ctx.shadowOffsetY = w * .06;
  ctx.fillStyle = mixHex(PAL.cardShade, PAL.desk2, .25); ctx.beginPath(); ctx.roundRect(-w / 2 + 2, w * .06 + 6, w - 4, h, w * .03); ctx.fill();
  ctx.shadowColor = 'transparent';
  const tear = clamp(o.tear ?? 0);
  if (tear > 0) face(o.under ?? { day: 'FRI', num: '13', mon: 'NOV 2026' });
  if (tear < 1) { const e = expoIn(tear); face(o, e * w * 1.6, -e * w * 1.2 - Math.sin(tear * 3) * w * .1, e * .9, 1 - smooth(span(tear, .6, 1))); }
  const shown = tear > 0 ? (o.under ?? {}) : o;
  if ((o.ring ?? 0) > 0 && !shown.q) ring(ctx, 0, w * .06 + h * .6, w * .3, w * .26, o.ring, { w: w * .025 });
  // the pin
  ctx.fillStyle = PAL.red1; ctx.beginPath(); ctx.arc(0, 0, w * .055, 0, 6.29); ctx.fill();
  ctx.fillStyle = rgba(PAL.red2, .9); ctx.beginPath(); ctx.arc(-w * .015, -w * .018, w * .02, 0, 6.29); ctx.fill();
  ctx.restore();
  return { center: [x, y + w * .06 + h / 2], bottom: [x, y + w * .06 + h], h: h + w * .06 };
}

// ======================================================================================================================== question card
// The index card on a red pin (pin at (x, y)): ruled lines, the question in graphite caps, the answer in red "handwriting" (serif italic).
// o: { lines: ['WHAT BENT', 'THE FIRST LINE?'], u (question rises), answer: 'MORE CHOICES', au 0..1, flip 0..1 (turns over on its pin to
// o.back lines), drop 0..1 (lowers on its pin from above: 0 = above the frame by o.dropH) }
export function qcard(ctx, t, x, y, w, o = {}) {
  const h = w * .6, drop = o.drop ?? 1, dy = (1 - expoOut(drop)) * -(o.dropH ?? 500), sw = (o.swing ?? 0) + .015 * Math.sin(t * .9) + (1 - drop) * .05 * Math.sin(t * 6);
  const fl = clamp(o.flip ?? 0), sx = Math.cos(fl * Math.PI), back = fl > .5;
  ctx.save(); ctx.translate(x, y + dy); ctx.rotate(sw); ctx.globalAlpha *= o.a ?? 1;
  ctx.save(); ctx.scale(Math.max(.02, Math.abs(sx)), 1);
  ctx.shadowColor = rgba(PAL.desk0, .3); ctx.shadowBlur = w * .06; ctx.shadowOffsetX = w * .025; ctx.shadowOffsetY = w * .035;
  const p = new Path2D(); p.rect(-w / 2, w * .04, w, h); ctx.fillStyle = PAL.card; ctx.fill(p); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = rgba(PAL.red0, .55); ctx.lineWidth = w * .005; ctx.beginPath(); ctx.moveTo(-w / 2, w * .04 + h * .2); ctx.lineTo(w / 2, w * .04 + h * .2); ctx.stroke();
  ctx.strokeStyle = rgba(PAL.cardLine, .55); for (let i = 1; i < 5; i++) { const yy = w * .04 + h * .2 + i * h * .16; ctx.beginPath(); ctx.moveTo(-w / 2, yy); ctx.lineTo(w / 2, yy); ctx.stroke(); }
  const lines = back ? (o.back ?? []) : (o.lines ?? []), lu = back ? 1 : (o.u ?? 1), sz = w * .085;
  lines.forEach((s, i) => label(ctx, s, 0, w * .04 + h * .2 + (i + 1) * h * .16 - h * .03, sz, lu, { align: 'center', col: PAL.cInk0, spacing: .08 }));
  if (o.answer && (o.au ?? 0) > 0 && !back) {
    ctx.save(); ctx.rotate(-.06);
    const aw = measure(o.answer, w * .14, true);
    ctx.beginPath(); ctx.rect(-aw / 2 - 10, h * .35, (aw + 20) * clamp(o.au), h * .6); ctx.clip();
    ctx.font = `italic ${w * .14}px "Instrument Serif Italic"`; ctx.textAlign = 'center'; ctx.fillStyle = PAL.cAccent; ctx.fillText(o.answer, 0, h * .78);
    ctx.restore();
  }
  ctx.restore();
  ctx.fillStyle = PAL.red1; ctx.beginPath(); ctx.arc(0, 0, w * .028, 0, 6.29); ctx.fill();
  ctx.fillStyle = rgba(PAL.red2, .9); ctx.beginPath(); ctx.arc(-w * .008, -w * .009, w * .01, 0, 6.29); ctx.fill();
  ctx.restore();
  return { rect: [x - w / 2, y + dy + w * .04, w, h] };
}

// ======================================================================================================================== the loop
// THE LOOP (c02, c03, cloned cool at the light line): a circle of ink with three stations PEOPLE (top), INVENTORS (lower right),
// PROGRESS (lower left), arrows drawn between them. o: { u (circle drawn 0..1), arrows 0..3 (fractional = drawing), bead (laps, its
// position = frac(bead)), cool 0..1 (redrawn in cool light, stations become light blocks), broken 0..1 (PROGRESS → PEOPLE tears), icons 0..1 }
export function loopWheel(ctx, t, x, y, r, o = {}) {
  const cool = o.cool ?? 0, col = cool > .5 ? PAL.cool2 : PAL.red0, u = o.u ?? 1;
  const st = [[-Math.PI / 2, 'PEOPLE'], [Math.PI / 6, 'INVENTORS'], [Math.PI * 5 / 6, 'PROGRESS']];
  const arc = (a0, a1, n = 40) => { const out = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); out.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } return out; };
  const drawSeg = (pts, uu) => (cool > .5 ? lightLine(ctx, pts, uu, { w: r * .022, spill: 0 }) : ink(ctx, pts, uu, { w: r * .03, head: uu < 1 }));
  // the circle (faint guide) and the three arrows between the stations (each leaves a gap round the stations)
  ctx.save(); ctx.strokeStyle = rgba(cool > .5 ? PAL.cool2 : PAL.ink2, .35 * clamp(u * 3)); ctx.lineWidth = r * .008; ctx.setLineDash([r * .03, r * .03]);
  ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + u * Math.PI * 2); ctx.stroke(); ctx.restore();
  const ar = o.arrows ?? 3;
  for (let i = 0; i < 3; i++) {
    const a0 = st[i][0] + .32, a1 = st[(i + 1) % 3][0] + (i === 2 ? Math.PI * 2 : 0) - .32, uu = clamp(ar - i); if (uu <= 0) continue;
    const brk = i === 2 ? clamp(o.broken ?? 0) : 0;
    if (brk > 0) { const am = lerp(a0, a1, .5), gap = .16 * brk; drawSeg(arc(a0, am - gap), clamp(uu * 2)); if (uu > .5) drawSeg(arc(am + gap + .04 * brk, a1), clamp(uu * 2 - 1)); }
    else drawSeg(arc(a0, a1), uu);
    if (uu >= 1 && brk < .5) { const hp = arc(a1 - .12, a1, 2); const [p0, p1] = [hp[0], hp[2]]; const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
      ctx.save(); ctx.translate(p1[0], p1[1]); ctx.rotate(ang); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(r * .05, 0); ctx.lineTo(-r * .05, -r * .04); ctx.lineTo(-r * .05, r * .04); ctx.closePath(); ctx.fill(); ctx.restore(); }
  }
  // the stations: small icons + label
  const ic = o.icons ?? 1;
  st.forEach(([a, name], i) => {
    const sx = x + Math.cos(a) * r, sy = y + Math.sin(a) * r, s = r * .12 * smooth(clamp(ic * 3 - i));
    if (s <= .5) return;
    ctx.save(); ctx.translate(sx, sy);
    ctx.fillStyle = cool > .5 ? PAL.card : PAL.card; ctx.beginPath(); ctx.arc(0, 0, s * 1.6, 0, 6.29); ctx.fill();
    ctx.strokeStyle = cool > .5 ? PAL.cool2 : PAL.cInk1; ctx.lineWidth = r * .01; ctx.stroke();
    ctx.fillStyle = cool > .5 ? PAL.cool3 : PAL.cInk0;
    if (cool > .5) { const b = s * (.5 + .12 * i); ctx.fillRect(-b, -b, b * 2, b * 2); ctx.fillStyle = PAL.cool1; ctx.fillRect(-b * .5, -b * .5, b, b); }
    else if (i === 0) { for (const dx of [-.55, 0, .55]) { ctx.beginPath(); ctx.arc(dx * s, -s * .35, s * .2, 0, 6.29); ctx.fill(); ctx.beginPath(); ctx.ellipse(dx * s, s * .3, s * .24, s * .42, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(dx * s - s * .24, s * .3, s * .48, s * .25); } }
    else if (i === 1) { ctx.beginPath(); ctx.arc(-s * .3, -s * .4, s * .2, 0, 6.29); ctx.fill(); ctx.beginPath(); ctx.ellipse(-s * .3, s * .25, s * .26, s * .45, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-s * .56, s * .25, s * .52, s * .3); ctx.save(); ctx.translate(s * .35, s * .05); ctx.rotate(-.5); ctx.fillRect(-s * .5, -s * .04, s * .9, s * .08); ctx.restore(); ctx.beginPath(); ctx.arc(s * .55, -s * .45, s * .16, 0, 6.29); ctx.strokeStyle = PAL.ink0; ctx.lineWidth = s * .08; ctx.stroke(); }
    else { ctx.fillRect(-s * .55, -s * .6, s * .08, s * 1.2); for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(-s * .51 + (k % 2 ? .12 : -.12) * s, -s * .5 + k * s * .22, s * .12, s * .06, k % 2 ? .6 : -.6, 0, 6.29); ctx.fill(); } ctx.fillRect(s * .05, -s * .2, s * .5, s * .75); ctx.fillRect(s * .17, -s * .4, s * .26, s * .22); ctx.fillStyle = PAL.paper0; ctx.fillRect(s * .26, 0, s * .08, s * .32); ctx.fillRect(s * .14, s * .12, s * .32, s * .08); }
    ctx.restore();
    label(ctx, name, sx, sy + (i === 0 ? -s * 2.3 : s * 3.2), Math.max(16, r * .07), clamp(ic * 3 - i), { align: 'center', col: cool > .5 ? PAL.cool1 : PAL.ink1 });
  });
  // the bead running the loop
  if (o.bead != null && o.bead > 0) {
    const f = o.bead % 1, a = -Math.PI / 2 + f * Math.PI * 2, bx = x + Math.cos(a) * r, by = y + Math.sin(a) * r;
    if (cool > .5) E.halo(ctx, bx, by, r * .12, .7, PAL.cool1, PAL.cool0);
    ctx.fillStyle = cool > .5 ? PAL.cool0 : PAL.red1; ctx.beginPath(); ctx.arc(bx, by, r * .035, 0, 6.29); ctx.fill();
  }
}

// ======================================================================================================================== props
// the stopwatch (lit card object): cream face, indigo ticks, a cool hand. o: { run (seconds the hand has run), wedge 0..1 (lit sector), a }
export function stopwatch(ctx, t, x, y, r, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = PAL.cInk1; ctx.fillRect(-r * .1, -r * 1.28, r * .2, r * .22); ctx.beginPath(); ctx.arc(0, -r * 1.32, r * .1, 0, 6.29); ctx.fill();
  const c = new Path2D(); c.arc(0, 0, r, 0, 6.29); ctx.fillStyle = PAL.cInk0; ctx.fill(c);
  ctx.fillStyle = PAL.card; ctx.beginPath(); ctx.arc(0, 0, r * .88, 0, 6.29); ctx.fill();
  if ((o.wedge ?? 0) > 0) { ctx.fillStyle = rgba(PAL.cool1, .55); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * .82, -Math.PI / 2, -Math.PI / 2 + o.wedge * Math.PI * 2); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = PAL.cInk1; for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, l = i % 5 ? .06 : .13; ctx.lineWidth = r * (i % 5 ? .008 : .018); ctx.beginPath(); ctx.moveTo(Math.sin(a) * r * .84, -Math.cos(a) * r * .84); ctx.lineTo(Math.sin(a) * r * (.84 - l), -Math.cos(a) * r * (.84 - l)); ctx.stroke(); }
  const a = (o.run ?? 0) / 60 * Math.PI * 2;
  ctx.strokeStyle = PAL.cool3; ctx.lineWidth = r * .03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-Math.sin(a) * r * .15, Math.cos(a) * r * .15); ctx.lineTo(Math.sin(a) * r * .76, -Math.cos(a) * r * .76); ctx.stroke();
  ctx.fillStyle = PAL.cool3; ctx.beginPath(); ctx.arc(0, 0, r * .05, 0, 6.29); ctx.fill();
  ctx.restore();
}
// the hourglass ONE WORKING DAY (paper cut, sand = warm). o: { sand 0..1 (top → bottom), label, a, tip (rad) }
export function hourglass(ctx, t, x, y, h, o = {}) {
  const w = h * .56, s = clamp(o.sand ?? 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tip ?? 0); ctx.globalAlpha *= o.a ?? 1;
  const glass = new Path2D(); glass.moveTo(-w * .42, -h * .44); glass.bezierCurveTo(-w * .42, -h * .12, -w * .06, -h * .06, -w * .05, 0); glass.bezierCurveTo(-w * .06, h * .06, -w * .42, h * .12, -w * .42, h * .44);
  glass.lineTo(w * .42, h * .44); glass.bezierCurveTo(w * .42, h * .12, w * .06, h * .06, w * .05, 0); glass.bezierCurveTo(w * .06, -h * .06, w * .42, -h * .12, w * .42, -h * .44); glass.closePath();
  ctx.fillStyle = rgba(PAL.card, .8); ctx.fill(glass);
  ctx.save(); ctx.clip(glass); ctx.fillStyle = PAL.flame;
  const top = h * .44 * (1 - s); ctx.fillRect(-w / 2, -top, w, top);
  const bot = h * .44 * s; ctx.beginPath(); ctx.moveTo(-w / 2, h * .44); ctx.lineTo(-w / 2, h * .44 - bot * .7); ctx.quadraticCurveTo(0, h * .44 - bot * 1.3, w / 2, h * .44 - bot * .7); ctx.lineTo(w / 2, h * .44); ctx.closePath(); ctx.fill();
  if (s > 0 && s < 1) ctx.fillRect(-1.5, 0, 3, h * .44);
  ctx.restore();
  ctx.strokeStyle = PAL.cInk1; ctx.lineWidth = h * .012; ctx.stroke(glass);
  ctx.fillStyle = PAL.cut1; ctx.fillRect(-w * .55, -h * .52, w * 1.1, h * .08); ctx.fillRect(-w * .55, h * .44, w * 1.1, h * .08);
  ctx.restore();
  if (o.label !== false) label(ctx, o.label ?? 'ONE WORKING DAY', x, y + h * .52 + h * .14, Math.max(18, h * .07), o.lu ?? 1, { align: 'center' });
}
// the steering wheel (cut paper, umber with a cream rim). o: { turn (rad), a, hands: [[angle, scale]] (graphite hands on the rim) }
export function wheel(ctx, t, x, y, r, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.turn ?? 0); ctx.globalAlpha *= o.a ?? 1;
  const p = new Path2D(); p.arc(0, 0, r, 0, Math.PI * 2); p.closePath(); p.moveTo(r * .84, 0); p.arc(0, 0, r * .84, 0, Math.PI * 2, true); p.closePath();
  for (const a of [Math.PI / 2, Math.PI * 7 / 6, -Math.PI / 6]) { const ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca, w0 = r * .16, w1 = r * .07;
    p.moveTo(-nx * w0, -ny * w0); p.lineTo(ca * r * .86 - nx * w1, sa * r * .86 - ny * w1); p.lineTo(ca * r * .86 + nx * w1, sa * r * .86 + ny * w1); p.lineTo(nx * w0, ny * w0); p.closePath(); }   // same winding as ring + hub (nonzero)
  p.moveTo(r * .22, 0); p.arc(0, 0, r * .22, 0, Math.PI * 2); p.closePath();
  ctx.fillStyle = PAL.cut0; ctx.fill(p, 'nonzero');
  ctx.save(); ctx.shadowColor = 'transparent'; ctx.strokeStyle = rgba(PAL.gold1, .85); ctx.lineWidth = r * .02; ctx.beginPath(); ctx.arc(-r * .01, -r * .015, r * .995, Math.PI * 1.05, Math.PI * 1.85); ctx.stroke(); ctx.restore();
  for (const [ang, sc] of o.hands ?? []) { const hx = Math.cos(ang) * r * .92, hy = Math.sin(ang) * r * .92; ctx.save(); ctx.shadowColor = 'transparent'; ctx.translate(hx, hy); ctx.rotate(ang + Math.PI / 2); ctx.fillStyle = PAL.cut2; ctx.beginPath(); ctx.ellipse(0, 0, r * .1 * sc, r * .07 * sc, 0, 0, 6.29); ctx.fill(); ctx.fillRect(-r * .05 * sc, 0, r * .1 * sc, r * .45 * sc); ctx.restore(); }
  ctx.restore();
}

// ======================================================================================================================== clips
// ORIGINAL FOOTAGE (docs/shots.md §5): the clip plays in a frame the animation leads into and out of. Meta until audio/clips.json exists.
export const CLIPS19 = {   // real clips (clips/clips.json, cut 6.11.); lower third = name · role · year · ORIGINAL FOOTAGE
  C1: { name: 'Heinz von Foerster', role: 'Cybernetician', year: '', src: 'High Tech Heroes #10 (atwaterpub)' },   // broadcast year unknown -> no year
  C2: { name: 'David Rein', role: 'Researcher, METR', year: '2026', src: 'Machine Learning Street Talk' },
  C3: { name: 'Beren Millidge', role: 'CTO, Zyphra', year: '2026', src: 'Dwarkesh Patel' },
};
// the clip's slot: timing.json clips[] (real VO) — the provisional timing has the same entries (tools/provisional_timing.py)
export function clipSlot(T, id) { const c = T.clip(id); return c ? { start: c.start, end: c.end } : null; }
// the frame: a 16:9 window with a cream mat, cut into the paper (x, y = top-left of the picture area, design or screen coords).
// Inside: the real frames (ROOT/clips/<id>/f00001.jpg …, via kit.clipFrame) or a placeholder card (never a generated person).
export function screen(ctx, t, T, id, x, y, w, h, o = {}) {
  const sl = clipSlot(T, id), mat = o.mat ?? w * .035;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = w * .02; ctx.shadowOffsetX = w * .006; ctx.shadowOffsetY = w * .01;
  ctx.fillStyle = PAL.card; ctx.fillRect(x - mat, y - mat, w + mat * 2, h + mat * 2); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#0d0b0a'; ctx.fillRect(x, y, w, h);
  const k = sl ? Math.floor(clamp(t - sl.start, 0, sl.end - sl.start) * 30) + 1 : 1, fr = sl ? clipFrame(id, k) : null;
  if (fr) { const s = Math.max(w / fr.width, h / fr.height); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(fr, x + (w - fr.width * s) / 2, y + (h - fr.height * s) / 2, fr.width * s, fr.height * s); ctx.restore(); }
  else {
    ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, '#2a241f'], [1, '#141110']]); ctx.fillRect(x, y, w, h);
    const m = CLIPS19[id] || {}; ctx.textAlign = 'center';
    ctx.font = `600 ${h * .045}px Inter`; ctx.letterSpacing = '0.3em'; ctx.fillStyle = rgba(PAL.ink1, .8); ctx.fillText(`CLIP ${id} · ORIGINAL FOOTAGE · PLACEHOLDER`, x + w / 2, y + h * .44);
    ctx.font = `${h * .09}px "Instrument Serif"`; ctx.letterSpacing = '0em'; ctx.fillStyle = PAL.ink0; ctx.fillText(m.name ?? id, x + w / 2, y + h * .58);
    const u = sl ? clamp((t - sl.start) / (sl.end - sl.start)) : 0; ctx.fillStyle = rgba(PAL.ink1, .6); ctx.fillRect(x + w * .3, y + h * .66, w * .4 * u, 3);
  }
  ctx.restore();
}
// the lower third (screen space, bottom left, above the subtitle band): NAME · ROLE, YEAR · ORIGINAL FOOTAGE; rises in, sinks out
export function lowerThird(ctx, t, T, id, o = {}) {
  const sl = clipSlot(T, id); if (!sl) return; const m = CLIPS19[id] || {};
  const u = smooth(span(t, sl.start + .3, sl.start + 1.1)) * (1 - smooth(span(t, sl.end - .7, sl.end - .1))); if (u <= 0) return;
  const x = o.x ?? 130, y = o.y ?? 860;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = rgba(PAL.card, .94 * u); ctx.fillRect(x - 24, y - 64, 24 + Math.max(560, measure(m.name ?? '', 46) + 80) * expoOut(u), 112);
  ctx.fillStyle = PAL.red0; ctx.fillRect(x - 24, y - 64, 8, 112 * expoOut(u));
  label(ctx, m.name ?? id, x, y - 12, 46, u, { serif: true, col: PAL.cInk0 });
  label(ctx, `${(m.role ?? '').toUpperCase()}${m.year ? ' · ' + m.year.toUpperCase() : ''}`, x, y + 22, 19, u, { col: PAL.cInk1 });
  label(ctx, 'ORIGINAL FOOTAGE', x, y + 46, 15, u, { col: PAL.cAccent, spacing: .3 });
  ctx.restore();
}

// ======================================================================================================================== figures
// you: E.du on paper (yellow raincoat, hood) with a warm paper shadow instead of the night shadow
export function you(ctx, x, y, h, o = {}) { return E.du(ctx, x, y, h, { shadowCol: rgba(PAL.desk0, .28), rim: o.rim, ...o }); }
// everyone else: the same skeleton in umber cut paper (no yellow, no face)
export function other(ctx, x, y, h, o = {}) { return E.person(ctx, x, y, h, { pal: { base: PAL.cut1, lit: PAL.cut2, shade: PAL.cut0, deep: PAL.desk1 }, rim: o.rim ?? PAL.cutLit, shadowCol: rgba(PAL.desk0, .25), ...o }); }

// ======================================================================================================================== the 1960 page
// THE 1960 PAGE on the sheet as ONE state-driven picture (c01 builds it up; plateLines and every callback draw the same function):
// st: { mast 0..1 (masthead rises), axes 0..1, fu 0..1 (formula drawn, arc fraction), dash 0..1 (formula → dashed: the schedule),
//       cap 0..1 (caption THE FORMULA …), ppl 0..1 (people stand up along it), ru: year the real line has reached (null = none),
//       ahead 0..1 (bracket AHEAD), slip {…} (calendar slip state, see slip()), inf 0..1 (∞ written), now 0..1, r60 0..1 (ring 1960),
//       pulse 0..1 (an ink bead runs up the dashes), ai 0..1 (the light line drawn), aiLab 0..1, glint 0..1 (cool glint on the curve),
//       sub 0..1 (the paper's subtitle '… APPROACH INFINITY / IF IT GROWS AS …', needs mast), ifR 0..1 (gold ring round IF) }
export const MAST = { x: 160, y: -770 };
export const SLIP = { x: 1640, y: -1000, w: 190 };
export function chart1960(ctx, c, t, st = {}) {
  onSheet(ctx, c, () => {
    const mu = st.mast ?? 0;
    if (mu > 0) {
      label(ctx, 'SCIENCE', MAST.x, MAST.y, 210, mu, { serif: true, col: PAL.ink0, spacing: .02 });
      ctx.fillStyle = rgba(PAL.ink0, .85 * smooth(mu)); ctx.fillRect(MAST.x, MAST.y + 34, 1180 * expoOut(mu), 5);
      label(ctx, '4 NOVEMBER 1960 · VOL. 132, NO. 3436', MAST.x, MAST.y + 92, 30, span(mu, .15, 1), { col: PAL.ink1 });
      label(ctx, 'Doomsday: Friday, 13 November, A.D. 2026', MAST.x, MAST.y + 196, 78, span(mu, .3, 1), { serif: true, italic: true, col: PAL.ink0 });
      label(ctx, 'HEINZ VON FOERSTER · PATRICIA M. MORA · LAWRENCE W. AMIOT', MAST.x, MAST.y + 252, 24, span(mu, .45, 1), { col: PAL.ink1 });
      // the paper's own subtitle (faktencheck M1, verbatim): the IF is the whole point (6.03 rings it: st.sub, st.ifR)
      if ((st.sub ?? 0) > 0) {
        label(ctx, 'AT THIS DATE HUMAN POPULATION WILL APPROACH INFINITY', MAST.x, MAST.y + 316, 30, st.sub, { col: PAL.ink0 });
        const wIf = label(ctx, 'IF', MAST.x + 6, MAST.y + 362, 30, span(st.sub, .2, 1), { col: PAL.gold2, weight: 800 });
        label(ctx, 'IT GROWS AS IT HAS GROWN IN THE LAST TWO MILLENNIA', MAST.x + wIf + 44, MAST.y + 362, 30, span(st.sub, .3, 1), { col: PAL.ink0 });
        if ((st.ifR ?? 0) > 0) ring(ctx, MAST.x + 6 + wIf * .45, MAST.y + 352, wIf * .5 + 22, 27, st.ifR, { w: 4 });
      }
    }
    axes(ctx, t, { u: st.axes ?? 0 });
    if ((st.axes ?? 0) > .5) label(ctx, 'PEOPLE ON EARTH · BILLIONS', CH.x0 + 24, popY(14) - 30, 34, st.pplLab ?? 0, { col: PAL.ink1 });
    if ((st.r60 ?? 0) > 0) { label(ctx, '1960', yearX(1960), CH.y0 + 52, 32, clamp(st.r60 * 2.5), { align: 'center', col: PAL.red0 }); ring(ctx, yearX(1960), CH.y0 + 40, 66, 34, st.r60); }
    if ((st.now ?? 0) > 0) { ctx.fillStyle = PAL.ink0; const x = yearX(2026); ctx.beginPath(); ctx.moveTo(x, CH.y0 + 6); ctx.lineTo(x - 10, CH.y0 + 26); ctx.lineTo(x + 10, CH.y0 + 26); ctx.closePath(); ctx.globalAlpha = smooth(st.now); ctx.fill(); ctx.globalAlpha = 1; label(ctx, 'NOW', x, CH.y0 + 62, 32, st.now, { align: 'center' }); }
    // the formula (red ink; dashed = the schedule)
    const fu = st.fu ?? 0, dash = clamp(st.dash ?? 0);
    if (fu > 0) {
      if (dash > 0) ink(ctx, formulaPts, fu, { w: 6, dash: [3.2, 2.6 * dash], head: false, a: 1 - .25 * dash });
      else ink(ctx, formulaPts, fu, { w: 6, head: st.head ?? true });
    }
    if ((st.glint ?? 0) > 0) { const g = st.glint, p = partial(formulaPts, lerp(.55, 1, g)); const hd = p[p.length - 1]; E.halo(ctx, hd[0], hd[1], 70, .8 * Math.sin(Math.PI * g), PAL.cool1, PAL.cool0); }
    if ((st.cap ?? 0) > 0) label(ctx, 'THE FORMULA · FIT TO 24 ESTIMATES', yearX(1830), popY(6), 40, st.cap, { col: PAL.ink1 });
    if ((st.ppl ?? 0) > 0) people(ctx, t, formulaPts.filter((p) => p[1] > 380), st.ppl, { n: 70, h: 48, pow: .9, seed: 1960, col: PAL.ink1, a: st.pplA ?? 1 });
    if ((st.pulse ?? 0) > 0 && st.pulse < 1) { const p = partial(formulaPts.filter((q) => q[0] >= KNEE.x), st.pulse); const hd = p[p.length - 1]; ctx.fillStyle = PAL.red2; ctx.beginPath(); ctx.arc(hd[0], hd[1], 9, 0, 6.29); ctx.fill(); }
    // reality (solid red ink) up to year st.ru
    if (st.ru != null && st.ru > 1800) { const rp = curvePts(st.ru0 ?? 1800, Math.min(2026, st.ru), 220, realPop); ink(ctx, rp, 1, { w: 7, head: st.ru < 2026 }); st._realHead = rp[rp.length - 1]; }
    if ((st.ahead ?? 0) > 0) { const x = yearX(1972), y1 = popY(realPop(1972)), y2 = popY(fPop(1972)); ctx.strokeStyle = rgba(PAL.ink0, .8 * smooth(st.ahead)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - 10, y1); ctx.lineTo(x - 22, y1); ctx.lineTo(x - 22, y2); ctx.lineTo(x - 10, y2); ctx.stroke(); label(ctx, 'AHEAD', x - 34, (y1 + y2) / 2 + 8, 22, st.ahead, { align: 'right' }); }
    if ((st.inf ?? 0) > 0) infinity(ctx, SLIP.x + SLIP.w * 1.15, SLIP.y + 120, 80, st.inf);
    if (st.slip) slip(ctx, t, SLIP.x, SLIP.y, SLIP.w, st.slip);
    // the light line (the machine) in its own field
    if ((st.ai ?? 0) > 0) { lightLine(ctx, aiPts, st.ai, { w: 7, spill: st.aiSpill ?? 1 }); }
    if ((st.aiLab ?? 0) > 0) label(ctx, 'ARTIFICIAL INTELLIGENCE', 2700, 40, 40, st.aiLab, { col: PAL.cool1 });
  });
}
