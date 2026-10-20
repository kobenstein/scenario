// c09 · the invitation card on the sill of window L, and the engraved free-time chart printed inside it.
// Closed it shows its front (deckle edge, guilloche border, "Invitation" in engraved script, scribbled calligraphy, an amber foil
// seal); it opens like a book (the cover swings left round the spine) and the inside spread (28 × 19 cm) becomes the chart:
// x HOURS OF FREE TIME PER DAY (0 · 2 · 5 · 7), y WELL-BEING; ink curve up to ~2 h, level to 5 h, dipping after; the amber curve
// (with people · something that matters) stays level. Source: Sharif, Mogilner & Hershfield (2021), JPSP. Schematic.
import { W, H, rgba, clamp, mix, lin, sm, prng, canvas, text } from '../engine.mjs';
import { gBorder, seal, rosette, microtext, INK, FOIL, PAPER } from './certificate.mjs';
import { burinTip } from './ghost.mjs';
import { scribble } from './paper.mjs';
import { figure, POSES } from './figure.mjs';
import { once, P3, plane, TAU, eoX, qio } from './v2_c09_kit.mjs';
import { XL, SILL_L } from './v2_c09_court.mjs';

// geometry (metres): the spine, the card plane, the page size
export const CARD = { xs: XL - .05, y0: SILL_L, z: -.03, pw: .14, ph: .19 };
export const SPREAD = { x0: CARD.xs - CARD.pw, x1: CARD.xs + CARD.pw, y0: CARD.y0, y1: CARD.y0 + CARD.ph };
// spread space: u, v in cm from the spread's top-left (v down) → world
export const sw = (u, v) => [SPREAD.x0 + u / 100, SPREAD.y1 - v / 100];
const RES = 90;                  // texture px per cm
const PW = 14, PH = 19;          // page size in cm

// ---------------------------------------------------------------- textures (cached once)
function deckle(g, w, h, seed, edges) {   // paper with ragged (deckle) edges on the given sides
  const r = prng(seed), pts = [], j = (a) => (r() - .5) * a, step = 9;
  const E = (on) => (on ? 1 : 0);
  for (let x = 0; x <= w; x += step) pts.push([x, 3 + E(edges.t) * (6 + j(9))]);
  for (let y = 0; y <= h; y += step) pts.push([w - 3 - E(edges.r) * (6 + j(9)), y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h - 3 - E(edges.b) * (6 + j(9))]);
  for (let y = h; y >= 0; y -= step) pts.push([3 + E(edges.l) * (6 + j(9)), y]);
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
}
function paperFill(g, w, h, seed, tone = PAPER) {
  g.fillStyle = tone; g.fill();
  g.save(); g.clip();
  const r = prng(seed);
  // fibres and tooth
  for (let i = 0; i < 2600; i++) { const x = r() * w, y = r() * h, l = 4 + r() * 18, a = r() * TAU; g.strokeStyle = `rgba(${r() < .5 ? '120,100,70' : '255,250,235'},${.05 + r() * .07})`; g.lineWidth = .8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  // warm vignette at the edges (handled card)
  const vg = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .3, w / 2, h / 2, Math.max(w, h) * .75); vg.addColorStop(0, 'rgba(120,80,40,0)'); vg.addColorStop(1, 'rgba(120,80,40,.16)');
  g.fillStyle = vg; g.fillRect(0, 0, w, h);
  g.restore();
}
export function coverTex() {
  return once('c09cover', () => {
    const w = PW * RES, h = PH * RES, [c, g] = canvas(w, h);
    deckle(g, w, h, 41, { t: 1, r: 1, b: 1, l: 0 }); paperFill(g, w, h, 42);
    gBorder(g, 70, 70, w - 140, h - 140, { band: 64, lines: 9, waves: 90, col: '#5a4a3a', w: 1.6, a: .85 });
    gBorder(g, 150, 150, w - 300, h - 300, { band: 18, lines: 3, waves: 120, col: '#7a3b17', w: 1.2, a: .6 });
    // corner rosettes
    for (const [x, y] of [[150, 150], [w - 150, 150], [150, h - 150], [w - 150, h - 150]]) rosette(g, x, y, { R: 30, A: 8, B: 4, lines: 10, n: 9, m: 5, col: '#7a3b17', w: 1.1, a: .8 });
    // the word, in engraved script
    text(g, 'Invitation', w / 2, h * .36, { size: 210, font: 'Instrument Serif Italic', color: '#2a2230', align: 'center' });
    g.strokeStyle = 'rgba(42,34,48,.7)'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(w * .26, h * .41); g.bezierCurveTo(w * .4, h * .395, w * .6, h * .425, w * .74, h * .41); g.stroke();
    // scribbled calligraphy (illegible): who, when, where
    scribble(g, w * .2, h * .47, w * .6, 34, { seed: 7, u: 1, ink: '#3a3040', lw: 3.2 });
    scribble(g, w * .27, h * .52, w * .46, 30, { seed: 8, u: 1, ink: '#3a3040', lw: 3 });
    scribble(g, w * .33, h * .57, w * .34, 26, { seed: 9, u: 1, ink: '#3a3040', lw: 2.6 });
    // the foil seal
    seal(g, w / 2, h * .75, 150, 0, { foil: true, label: 'YOU ARE INVITED', emblem: 'sun' });
    return c;
  });
}
export function insideTex(side) {   // side 'L' (back of the cover, spine on the right) or 'R' (inner right page, spine on the left)
  return once('c09in' + side, () => {
    const w = PW * RES, h = PH * RES, [c, g] = canvas(w, h);
    deckle(g, w, h, side === 'L' ? 51 : 52, side === 'L' ? { t: 1, r: 0, b: 1, l: 1 } : { t: 1, r: 1, b: 1, l: 0 });
    paperFill(g, w, h, side === 'L' ? 53 : 54, '#f1e8d2');
    // a fine engraved frame running across the spread (each half has its part)
    g.strokeStyle = 'rgba(90,74,58,.55)'; g.lineWidth = 2;
    const m = 55, x0 = side === 'L' ? m : -10, x1 = side === 'L' ? w + 10 : w - m;
    g.strokeRect(x0, m, x1 - x0, h - 2 * m); g.lineWidth = 1; g.strokeRect(x0 + 12, m + 12, x1 - x0 - 24, h - 2 * m - 24);
    // the crease shadow at the spine
    const sx = side === 'L' ? w : 0, sg = g.createLinearGradient(sx, 0, side === 'L' ? w - 60 : 60, 0); sg.addColorStop(0, 'rgba(90,60,30,.22)'); sg.addColorStop(1, 'rgba(90,60,30,0)');
    g.fillStyle = sg; g.fillRect(side === 'L' ? w - 60 : 0, 0, 60, h);
    return c;
  });
}

// ---------------------------------------------------------------- drawing a texture on a projected quad (vertical strips)
function quadImg(ctx, img, q, n = 12) {
  const [A, B, C, D] = q, iw = img.width, ih = img.height;
  ctx.save();
  for (let i = 0; i < n; i++) {
    const u0 = i / n, u1 = (i + 1) / n;
    const t0 = [mix(A[0], B[0], u0), mix(A[1], B[1], u0)], t1 = [mix(A[0], B[0], u1), mix(A[1], B[1], u1)], b0 = [mix(D[0], C[0], u0), mix(D[1], C[1], u0)];
    const sw0 = iw * (u1 - u0), aa = (t1[0] - t0[0]) / sw0, bb = (t1[1] - t0[1]) / sw0, cc = (b0[0] - t0[0]) / ih, dd = (b0[1] - t0[1]) / ih;
    ctx.save(); ctx.beginPath();
    const b1 = [mix(D[0], C[0], u1), mix(D[1], C[1], u1)], ex = i < n - 1 ? .6 : 0;
    ctx.moveTo(t0[0], t0[1]); ctx.lineTo(t1[0] + ex * Math.sign(t1[0] - t0[0] || 1), t1[1]); ctx.lineTo(b1[0] + ex * Math.sign(t1[0] - t0[0] || 1), b1[1]); ctx.lineTo(b0[0], b0[1]); ctx.closePath(); ctx.clip();
    ctx.setTransform(aa, bb, cc, dd, t0[0] - aa * iw * u0, t0[1] - bb * iw * u0);
    ctx.drawImage(img, 0, 0); ctx.restore();
  }
  ctx.restore();
}
// perspective-correct parameter along a projected segment (so the strips foreshorten like paper turning away)
function quadPersp(cam, pts3) { return pts3.map((p) => P3(cam, ...p)); }

// ---------------------------------------------------------------- the card itself
// open: 0 (closed) … 1 (flat open); light: the lantern's warmth on the paper 0..1
export function cardClosedOrOpening(ctx, t, cam, open, light) {
  const { xs, y0, z, pw, ph } = CARD, y1 = y0 + ph;
  const th = Math.PI * open;
  // the inner right page (under the cover)
  const R = quadPersp(cam, [[xs, y1, z], [xs + pw, y1, z], [xs + pw, y0, z], [xs, y0, z]]);
  if (open > 0) { quadImg(ctx, insideTex('R'), R, 2); }
  // cover: hinge at xs, outer edge swings toward the camera and to the left
  const ox = xs + pw * Math.cos(th), oz = z + pw * Math.sin(th) + .002;
  const Q = quadPersp(cam, [[xs, y1, z + .002], [ox, y1, oz], [ox, y0, oz], [xs, y0, z + .002]]);
  const front = Q[1][0] > Q[0][0];
  // the cover's shadow on the inner page while it turns
  if (open > 0 && open < 1) {
    const sh = Math.sin(th) * .5;
    ctx.save(); ctx.beginPath(); ctx.moveTo(R[0][0], R[0][1]); ctx.lineTo(R[1][0], R[1][1]); ctx.lineTo(R[2][0], R[2][1]); ctx.lineTo(R[3][0], R[3][1]); ctx.closePath(); ctx.clip();
    const g = ctx.createLinearGradient(R[0][0], 0, R[1][0], 0); g.addColorStop(0, `rgba(40,24,10,${.45 * sh})`); g.addColorStop(1, 'rgba(40,24,10,0)');
    ctx.fillStyle = g; ctx.fillRect(R[0][0], R[0][1] - 10, R[1][0] - R[0][0], R[3][1] - R[0][1] + 20); ctx.restore();
  }
  if (front) quadImg(ctx, coverTex(), [Q[0], Q[1], Q[2], Q[3]], 14);
  else quadImg(ctx, insideTex('L'), [Q[1], Q[0], Q[3], Q[2]], 14);
  // turning paper catches the light differently: darken as it faces away from the lantern
  const shade = open > 0 && open < 1 ? (front ? .35 * Math.sin(th) : .3 * Math.sin(th)) : 0;
  if (shade > .01) {
    ctx.save(); ctx.beginPath(); Q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = `rgba(30,18,8,${shade})`; ctx.fill(); ctx.restore();
  }
  return { front, Q, R };
}
// the open spread as one flat sheet (both inner pages) with the live chart
export function spread(ctx, t, cam, CH) {
  const A = P3(cam, SPREAD.x0, SPREAD.y1, CARD.z), B = P3(cam, SPREAD.x1, SPREAD.y0, CARD.z), sc = (B[0] - A[0]) / 28;   // px per cm
  const L = insideTex('L'), Rt = insideTex('R');
  ctx.save(); ctx.setTransform(sc / RES, 0, 0, (B[1] - A[1]) / 19 / RES, A[0], A[1]); ctx.drawImage(L, 0, 0); ctx.drawImage(Rt, PW * RES, 0); ctx.restore();
  chart(ctx, t, A[0], A[1], sc, CH);
  return { A, B, sc };
}

// ---------------------------------------------------------------- the chart (drawn live in screen space; spread cm → px)
export const PLOT = { u0: 3.6, u1: 25.0, vAxis: 11.2, vTop: 3.4 };
// well-being (0..1) against hours: steep rise to ~2 h, level to 5 h, then the dip (ink); the amber curve stays level
export function fInk(h) { if (h <= 2) return .16 + .72 * (1 - (1 - h / 2) ** 2); if (h <= 5) return .88 + .006 * Math.sin((h - 2) * 2.1); return .88 + .006 * Math.sin(6.3) - .36 * ((h - 5) / 2) ** 1.5; }
export function fAmber(h) { if (h <= 2) return .19 + .72 * (1 - (1 - h / 2) ** 2); return .91 + .004 * Math.sin((h - 2) * 1.7); }
export const hu = (h) => mix(PLOT.u0, PLOT.u1, h / 7), fv = (f) => mix(PLOT.vAxis, PLOT.vTop, f);
function curvePts(f, h0, h1, n = 90) { const p = []; for (let i = 0; i <= n; i++) { const h = mix(h0, h1, i / n); p.push([hu(h), fv(f(h))]); } return p; }
const INKC = '#2a2432', AMB = '#b8661f', AMBL = '#e08a30';

// a hard-edged wipe left → right over a box (text and labels are printed, not faded)
function wipe(ctx, x, y, w, h, u, draw) { if (u <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * clamp(u), h); ctx.clip(); draw(); ctx.restore(); }
function capsText(ctx, s, x, y, size, o = {}) { text(ctx, s, x, y, { size, weight: o.weight ?? 600, color: o.color ?? INKC, spacing: o.spacing ?? size * .18, align: o.align ?? 'left' }); }
function measure(ctx, s, size, spacing, font = 'Inter', weight = 600) { ctx.save(); ctx.font = `${font.startsWith('Instrument') ? '' : weight + ' '}${size}px "${font}"`; try { ctx.letterSpacing = spacing + 'px'; } catch { } const w = ctx.measureText(s).width; ctx.restore(); return w; }
function stroke(ctx, pts, col, w) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
function sub(pts, u) {   // the first u (0..1, by arc length) of a polyline
  if (u >= 1) return pts; if (u <= 0) return [pts[0]];
  const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = d[d.length - 1] * u, out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (d[i] <= L) out.push(pts[i]); else { const q = (L - d[i - 1]) / (d[i] - d[i - 1]); out.push([mix(pts[i - 1][0], pts[i][0], q), mix(pts[i - 1][1], pts[i][1], q)]); break; } }
  return out;
}
export { sub as subPoly };

// CH: { axes, ticks, xlab, ylab, src, ink (hours drawn 0..7), inkTip (0..1 tip visible), guide2, guide5,
//       amber (hours drawn), amberTip, amberLab, vig, vigLight, aloneLab, t }
export function chart(ctx, t, ox, oy, sc, CH) {
  const S = (u, v) => [ox + u * sc, oy + v * sc], lw = Math.max(1, sc * .045);
  const { u0, u1, vAxis, vTop } = PLOT;
  ctx.save();
  // axes: engraved, drawn by a fine point
  const ax = clamp(CH.axes ?? 0);
  if (ax > 0) {
    const xa = sub([S(u0, vAxis), S(u1 + .9, vAxis)], clamp(ax * 1.25)), ya = sub([S(u0, vAxis), S(u0, vTop - .9)], clamp(ax * 1.25 - .25));
    stroke(ctx, xa, INKC, lw * 1.1); if (ya.length > 1) stroke(ctx, ya, INKC, lw * 1.1);
    if (ax >= 1) {   // arrow heads
      const [px, py] = S(u1 + .9, vAxis), [qx, qy] = S(u0, vTop - .9), a = .22 * sc;
      ctx.fillStyle = INKC; ctx.beginPath(); ctx.moveTo(px + a * .4, py); ctx.lineTo(px - a, py - a * .45); ctx.lineTo(px - a, py + a * .45); ctx.fill();
      ctx.beginPath(); ctx.moveTo(qx, qy - a * .4); ctx.lineTo(qx - a * .45, qy + a); ctx.lineTo(qx + a * .45, qy + a); ctx.fill();
    }
    // faint engraved grid (hour lines)
    ctx.strokeStyle = rgba('#5a4a3a', .16 * ax); ctx.lineWidth = Math.max(.6, sc * .015); ctx.beginPath();
    for (let h = 1; h <= 7; h++) { const [x, y] = S(hu(h), vAxis), [, y2] = S(0, vTop); ctx.moveTo(x, y); ctx.lineTo(x, y2); } ctx.stroke();
  }
  // ticks + numbers 0 · 2 · 5 · 7
  const tk = CH.ticks || [0, 0, 0, 0];
  [0, 2, 5, 7].forEach((h, i) => {
    const u = clamp(tk[i]); if (u <= 0) return;
    const [x, y] = S(hu(h), vAxis), tl = .3 * sc;
    stroke(ctx, [[x, y], [x, y + tl * Math.min(1, u * 2)]], INKC, lw);
    const size = .66 * sc; wipe(ctx, x - size, y + .35 * sc, size * 2, size * 1.3, u * 1.2 - .2, () => text(ctx, String(h), x, y + .35 * sc + size * .95, { size, font: 'Instrument Serif', color: INKC, align: 'center' }));
  });
  for (let h = 1; h < 7; h++) if (![2, 5].includes(h) && (CH.ticks?.[3] ?? 0) > 0) { const [x, y] = S(hu(h), vAxis); stroke(ctx, [[x, y], [x, y + .16 * sc]], INKC, lw * .8); }
  // axis titles
  const ls = .34 * sc;
  if ((CH.xlab ?? 0) > 0) { const s = 'HOURS OF FREE TIME PER DAY', w = measure(ctx, s, ls, ls * .2), [x, y] = S((u0 + u1) / 2, vAxis + 2.05); wipe(ctx, x - w / 2 - 4, y - ls * 1.2, w + 12, ls * 1.6, CH.xlab, () => capsText(ctx, s, x - w / 2, y, ls)); }
  if ((CH.ylab ?? 0) > 0) { const s = 'WELL-BEING', w = measure(ctx, s, ls, ls * .2), [x, y] = S(u0 + .45, vTop - .55); wipe(ctx, x - 4, y - ls * 1.2, w + 12, ls * 1.6, CH.ylab, () => capsText(ctx, s, x, y, ls)); }
  if ((CH.src ?? 0) > 0) {
    const ss = .27 * sc, s = 'SCHEMATIC · SHARIF, MOGILNER & HERSHFIELD (2021) · JOURNAL OF PERSONALITY AND SOCIAL PSYCHOLOGY', w = measure(ctx, s, ss, ss * .14, 'Inter', 500), [x, y] = S(14, vAxis + 3.0);
    wipe(ctx, x - w / 2 - 4, y - ss * 1.2, w + 12, ss * 1.6, CH.src, () => text(ctx, s, x - w / 2, y, { size: ss, weight: 500, color: '#5a4c44', spacing: ss * .14 }));
  }
  // dotted guides at 2 h ("up to a point") and 5 h ("after that")
  for (const [h, u] of [[2, CH.guide2 ?? 0], [5, CH.guide5 ?? 0]]) {
    if (u <= 0) continue;
    const [x, yA] = S(hu(h), vAxis), [, yC] = S(hu(h), fv(fInk(h)) + .25);
    ctx.save(); ctx.setLineDash([.08 * sc, .16 * sc]); stroke(ctx, [[x, yC], [x, mix(yC, yA, clamp(u))]], rgba('#5a4a3a', .75), lw * .8); ctx.restore();
  }
  // the vignette under the dip (drawn before the curves so the line stays on top)
  if ((CH.vig ?? 0) > 0) vignette(ctx, t, S, sc, CH);
  // the ink curve: engraved by the burin
  const inkH = clamp(CH.ink ?? 0, 0, 7);
  if (inkH > 0) {
    const pts = curvePts(fInk, 0, inkH, Math.max(2, Math.round(inkH * 24))).map(([u, v]) => S(u, v));
    stroke(ctx, pts, INKC, lw * 1.9);
    if ((CH.inkTip ?? 0) > 0) { const n = pts.length, a = Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0]); burinTip(ctx, pts[n - 1][0], pts[n - 1][1], a, t, { size: .45 * sc * CH.inkTip, foil: '#c9a27a', a: CH.inkTip, seed: 3 }); }
  }
  // the burin waiting at the origin (carried in from the left edge)
  if ((CH.burinIn ?? 0) > 0 && inkH <= 0) { const [x, y] = S(hu(0), fv(fInk(0))), k = CH.burinIn, dx = (1 - k) * -9 * sc; burinTip(ctx, x + dx, y, -.3, t, { size: .45 * sc, foil: '#c9a27a', a: 1, seed: 3 }); }
  // the amber curve (with people · something that matters)
  const amH = clamp(CH.amber ?? 0, 0, 7);
  if (amH > 0) {
    const pts = curvePts(fAmber, 0, amH, Math.max(2, Math.round(amH * 24))).map(([u, v]) => S(u, v));
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; stroke(ctx, pts, rgba('#e8a050', .35), lw * 6); ctx.restore();
    stroke(ctx, pts, AMB, lw * 2.3); stroke(ctx, pts, rgba('#ffd9a0', .55), lw * .8);
    if ((CH.amberTip ?? 0) > 0) { const n = pts.length, a = Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0]); burinTip(ctx, pts[n - 1][0], pts[n - 1][1], a, t, { size: .5 * sc * CH.amberTip, foil: '#ffb35c', a: CH.amberTip, seed: 5 }); }
  }
  // labels on the curves
  const ls2 = .33 * sc;
  if ((CH.amberLab ?? 0) > 0) { const s = 'WITH PEOPLE · SOMETHING THAT MATTERS', w = measure(ctx, s, ls2, ls2 * .16), [x, y] = S(hu(7) - .1, fv(fAmber(7)) - .55); wipe(ctx, x - w - 6, y - ls2 * 1.2, w + 12, ls2 * 1.6, CH.amberLab, () => text(ctx, s, x - w, y, { size: ls2, weight: 600, color: '#9a4e12', spacing: ls2 * .16 })); }
  if ((CH.aloneLab ?? 0) > 0) { const s = 'ALONE · NOTHING THAT MATTERS', w = measure(ctx, s, ls2, ls2 * .16), [x, y] = S(VIG.u, VIG.v + VIG.ry + .62); wipe(ctx, x - w / 2 - 6, y - ls2 * 1.2, w + 12, ls2 * 1.6, CH.aloneLab, () => text(ctx, s, x - w / 2, y, { size: ls2, weight: 600, color: INKC, spacing: ls2 * .16 })); }
  ctx.restore();
}
// the vignette: an engraved oval under the dip; inside, someone alone on a sofa in the cyan glow of a screen
export const VIG = { u: hu(6.05), v: 8.15, rx: 2.15, ry: 1.38 };
function vignette(ctx, t, S, sc, CH) {
  const [cx, cy] = S(VIG.u, VIG.v), rx = VIG.rx * sc, ry = VIG.ry * sc, k = clamp(CH.vig), L = clamp(CH.vigLight ?? 0);
  // the ink ground floods out from the centre (a hard-edged growing oval)
  ctx.save();
  ctx.beginPath(); ctx.ellipse(cx, cy, rx * eoX(k), ry * eoX(k), 0, 0, TAU); ctx.clip();
  const g = ctx.createRadialGradient(cx + rx * .35, cy, 0, cx, cy, rx * 1.1); g.addColorStop(0, '#16233a'); g.addColorStop(1, '#0a0d1c');
  ctx.fillStyle = g; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
  // the room drawn offscreen-free: dark shapes first, then the screen light rises (darkness over them recedes)
  const fy = cy + ry * .42, s = sc * .0105;       // floor line, figure scale
  const tvx = cx + rx * .58, tvy = cy - ry * .02, tw = rx * .3, th = ry * .32;
  // floor + rug
  ctx.fillStyle = '#0d1222'; ctx.fillRect(cx - rx, fy, rx * 2, ry);
  // the sofa (side view, facing right): base, seat cushion, backrest on the left, armrest
  const sx = cx - rx * .42, sw2 = rx * .62, seatY = fy - ry * .3;
  ctx.fillStyle = '#1e2638';
  ctx.beginPath(); ctx.roundRect(sx - sw2 * .5, seatY, sw2, fy - seatY - ry * .06, ry * .05); ctx.fill();               // base
  ctx.beginPath(); ctx.roundRect(sx - sw2 * .55, seatY - ry * .5, sw2 * .18, ry * .58, ry * .06); ctx.fill();         // backrest
  ctx.beginPath(); ctx.roundRect(sx + sw2 * .38, seatY - ry * .16, sw2 * .14, ry * .26, ry * .05); ctx.fill();        // armrest
  ctx.fillStyle = '#26304a'; ctx.beginPath(); ctx.roundRect(sx - sw2 * .4, seatY - ry * .06, sw2 * .8, ry * .1, ry * .04); ctx.fill();   // cushion
  ctx.fillStyle = '#0a0d18'; ctx.fillRect(sx - sw2 * .45, fy - ry * .06, sw2 * .05, ry * .06); ctx.fillRect(sx + sw2 * .38, fy - ry * .06, sw2 * .05, ry * .06);   // feet
  // the person, sitting alone, slumped a little, facing the screen (figure.mjs: breathes, blinks, glances on their own rhythm)
  const L2 = { x: tvx, y: tvy, col: '#8fe6ff', a: .55 * L };
  figure(ctx, sx + sw2 * .02, seatY - ry * .02, s, { ...POSES.sit, lean: -.12, head: .06, sh: [.62, .5], el: [.9, 1.0] }, { t, seed: 11, dress: { coat: '#3a4560', pants: '#1d2333', shoes: '#0c0d14', hair: '#1a1418' }, light: L2, rim: '#8fe6ff', rimSide: 1, shadow: false });
  // the low table and the screen on its stand
  ctx.fillStyle = '#121828'; ctx.fillRect(tvx - tw * .55, fy - ry * .26, tw * 1.1, ry * .26);
  ctx.fillStyle = '#05070e'; ctx.fillRect(tvx - tw * .5 - 2, tvy - th * .5 - 2, tw + 4, th + 4);
  const fl = .75 + .25 * Math.sin(t * 9.1) * Math.sin(t * 3.7 + 1);
  ctx.fillStyle = L > 0 ? rgba('#8fe6ff', (.5 + .45 * fl) * L) : '#0b1220'; ctx.fillRect(tvx - tw * .5, tvy - th * .5, tw, th);
  // the screen's cold light into the room (additive), rising with L
  if (L > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gl = ctx.createRadialGradient(tvx, tvy, 0, tvx, tvy, rx * 1.1); gl.addColorStop(0, rgba('#8fe6ff', .32 * L * fl)); gl.addColorStop(.35, rgba('#3aa8c8', .12 * L)); gl.addColorStop(1, 'rgba(10,60,90,0)');
    ctx.fillStyle = gl; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2); ctx.restore();
  }
  // darkness over the room recedes as the screen light rises (the room rises out of the dark; no transparency of the drawing itself)
  if (L < 1) { ctx.fillStyle = `rgba(8,10,22,${.94 * (1 - sm(L))})`; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2); }
  // engraved hatching over the whole room (it is a print)
  ctx.strokeStyle = 'rgba(6,8,16,.35)'; ctx.lineWidth = Math.max(.6, sc * .012); ctx.beginPath();
  for (let x = cx - rx - ry; x < cx + rx; x += sc * .085) { ctx.moveTo(x, cy + ry); ctx.lineTo(x + ry * 1.6, cy - ry); } ctx.stroke();
  ctx.restore();
  // the oval frame: a double engraved line
  ctx.strokeStyle = INKC; ctx.lineWidth = Math.max(1, sc * .05);
  const e = eoX(k); ctx.beginPath(); ctx.ellipse(cx, cy, rx * e, ry * e, 0, 0, TAU); ctx.stroke();
  ctx.lineWidth = Math.max(.7, sc * .02); ctx.beginPath(); ctx.ellipse(cx, cy, rx * e + .12 * sc, ry * e + .12 * sc, 0, 0, TAU); ctx.stroke();
}
