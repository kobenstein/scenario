// c09 · the invitation card on the sill of window L, and the engraved free-time chart printed inside it.
// Closed it shows its front (deckle edge, guilloche border, "Invitation" in engraved script, scribbled calligraphy, an amber foil
// seal); it opens like a book (the cover swings left round the spine) and the inside spread (28 × 19 cm) becomes the chart:
// x HOURS OF FREE TIME PER DAY (0 · 2 · 5 · 7), y WELL-BEING; ink curve up to ~2 h, level to 5 h, dipping after; the amber curve
// (with people · something that matters) stays level. Source: Sharif, Mogilner & Hershfield (2021), JPSP. Schematic.
import { W, H, rgba, clamp, mix, lin, sm, prng, canvas, text } from '../engine.mjs';
import { gBorder, seal, rosette, microtext, INK, FOIL, PAPER } from './certificate.mjs';
import { scribble } from './paper.mjs';
import { figure, POSES } from './figure.mjs';
import { once, P3, plane, TAU, eoX, qio, burin } from './v2_c09_kit.mjs';
import { XL, SILL_L, LANTERN } from './v2_c09_court.mjs';

// geometry (metres): the spine, the card plane, the page size
export const CARD = { xs: XL - .05, y0: SILL_L, z: -.03, pw: .14, ph: .19 };
export const SPREAD = { x0: CARD.xs - CARD.pw, x1: CARD.xs + CARD.pw, y0: CARD.y0, y1: CARD.y0 + CARD.ph };
// spread space: u, v in cm from the spread's top-left (v down) → world
export const sw = (u, v) => [SPREAD.x0 + u / 100, SPREAD.y1 - v / 100];
const RES = 90;                  // texture px per cm
const PW = 14, PH = 19;          // page size in cm

// ---------------------------------------------------------------- textures (cached once)
function deckle(g, w, h, seed, edges) {   // paper with ragged (deckle) edges on the given sides; the other sides bleed 1 px (no gap at the fold)
  const r = prng(seed), pts = [], j = (a) => (r() - .5) * a, step = 9;
  const I = (on) => (on ? 9 + j(9) : -1);
  for (let x = 0; x <= w; x += step) pts.push([x, I(edges.t)]);
  for (let y = 0; y <= h; y += step) pts.push([w - I(edges.r), y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h - I(edges.b)]);
  for (let y = h; y >= 0; y -= step) pts.push([I(edges.l), y]);
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
    // the fold: a soft valley (shade falling into the crease) and a fine pressed line
    const sx = side === 'L' ? w : 0, sg = g.createLinearGradient(sx, 0, side === 'L' ? w - 80 : 80, 0); sg.addColorStop(0, 'rgba(90,60,30,.16)'); sg.addColorStop(.35, 'rgba(90,60,30,.05)'); sg.addColorStop(1, 'rgba(90,60,30,0)');
    g.fillStyle = sg; g.fillRect(side === 'L' ? w - 80 : 0, 0, 80, h);
    g.strokeStyle = 'rgba(80,58,36,.22)'; g.lineWidth = 2; g.beginPath(); g.moveTo(side === 'L' ? w - 1 : 1, 0); g.lineTo(side === 'L' ? w - 1 : 1, h); g.stroke();
    if (side === 'R') { g.strokeStyle = 'rgba(255,250,236,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(5, 0); g.lineTo(5, h); g.stroke(); }
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
function mixHex(a, b, u) { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(u)))).join(',')})`; }
// the lantern's light on the paper (multiply): warm and bright beside the lantern, falling off across the card; before the lamp
// burns, the paper lies in the cold moonlight
const PL = [[0, '#fffaf0'], [.35, '#fbefd9'], [.7, '#ead2b0'], [1, '#d8bb96']], MOONP = '#6a74a8';
export function paperLight(ctx, cam, build, light) {
  const f = P3(cam, LANTERN.x, LANTERN.y + .1, LANTERN.z), e = P3(cam, LANTERN.x + .5, LANTERN.y + .1, LANTERN.z), R = Math.max(4, Math.abs(e[0] - f[0]));
  ctx.save(); ctx.beginPath(); build(); ctx.clip(); ctx.globalCompositeOperation = 'multiply';
  const g = ctx.createRadialGradient(f[0], f[1], 0, f[0], f[1], R); for (const [o, c] of PL) g.addColorStop(o, mixHex(MOONP, c, light));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
const quadPath = (ctx, Q) => () => { Q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };

// ---------------------------------------------------------------- the card itself
// open: 0 (closed) … 1 (flat open); light: the lantern's warmth on the paper 0..1
export function cardClosedOrOpening(ctx, t, cam, open, light) {
  const { xs, y0, z, pw, ph } = CARD, y1 = y0 + ph;
  const th = Math.PI * open;
  // the inner right page (under the cover)
  const R = quadPersp(cam, [[xs, y1, z], [xs + pw, y1, z], [xs + pw, y0, z], [xs, y0, z]]);
  if (open > 0) { quadImg(ctx, insideTex('R'), R, 2); paperLight(ctx, cam, quadPath(ctx, R), light); }
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
  paperLight(ctx, cam, quadPath(ctx, Q), light);
  // turning paper catches the light differently: darken as it faces away from the lantern
  const shade = open > 0 && open < 1 ? (front ? .35 * Math.sin(th) : .3 * Math.sin(th)) : 0;
  if (shade > .01) {
    ctx.save(); ctx.beginPath(); Q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = `rgba(30,18,8,${shade})`; ctx.fill(); ctx.restore();
  }
  return { front, Q, R };
}
// the open spread as one flat sheet (both inner pages) with the live chart
export function spread(ctx, t, cam, CH, light = 1) {
  const A = P3(cam, SPREAD.x0, SPREAD.y1, CARD.z), B = P3(cam, SPREAD.x1, SPREAD.y0, CARD.z), sc = (B[0] - A[0]) / 28;   // px per cm
  const L = insideTex('L'), Rt = insideTex('R');
  ctx.save(); ctx.setTransform(sc / RES, 0, 0, (B[1] - A[1]) / 19 / RES, A[0], A[1]); ctx.drawImage(L, 0, 0); ctx.drawImage(Rt, PW * RES, 0); ctx.restore();
  chart(ctx, t, A[0], A[1], sc, CH);
  paperLight(ctx, cam, () => ctx.rect(A[0] - 2, A[1] - 2, B[0] - A[0] + 4, B[1] - A[1] + 4), light);
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
export const PB = { glow: .32, glowR: 1.25, dust: .7, paper: true };   // the burin on lit paper: a small glint, no white bloom

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
const ang0 = (S, f) => { const [x0, y0] = S(hu(0), fv(f(0))), [x1, y1] = S(hu(.06), fv(f(.06))); return Math.atan2(y1 - y0, x1 - x0); };

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
    const out = clamp(CH.inkOut ?? 0);
    if (out < 1) { const n = pts.length, a = Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0]), e = out * out * (3 - 2 * out) * .35 + out ** 3 * .65; burin(ctx, pts[n - 1][0] + e * 9 * sc, pts[n - 1][1] - e * 4 * sc, a - e * .5, t, { ...PB, size: .45 * sc * (1 + .15 * e), foil: '#c9a27a', seed: 3 }); }
  }
  // the burin waiting at the origin (carried in from the left edge)
  if ((CH.burinIn ?? 0) > 0 && inkH <= 0) { const [x, y] = S(hu(0), fv(fInk(0))), k = CH.burinIn, dx = (1 - k) * -9 * sc; burin(ctx, x + dx, y - (1 - k) * 2 * sc, ang0(S, fInk) - (1 - k) * .4, t, { ...PB, size: .45 * sc, foil: '#c9a27a', seed: 3 }); }
  // the amber curve (with people · something that matters)
  const amH = clamp(CH.amber ?? 0, 0, 7);
  if (amH > 0) {
    const pts = curvePts(fAmber, 0, amH, Math.max(2, Math.round(amH * 24))).map(([u, v]) => S(u, v));
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; stroke(ctx, pts, rgba('#e8a050', .35), lw * 6); ctx.restore();
    stroke(ctx, pts, AMB, lw * 2.3); stroke(ctx, pts, rgba('#ffd9a0', .55), lw * .8);
    if ((CH.amberTip ?? 0) > 0) { const n = pts.length, a = Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0]); burin(ctx, pts[n - 1][0], pts[n - 1][1], a, t, { ...PB, size: .5 * sc, foil: '#ffb35c', seed: 5 }); }
  }
  // the amber burin is carried in from the left to the origin before it cuts
  if ((CH.amberIn ?? 0) > 0 && amH <= 0) { const [x, y] = S(hu(0), fv(fAmber(0))), k = CH.amberIn, dx = (1 - k) * -9 * sc; burin(ctx, x + dx, y - (1 - k) * 2 * sc, ang0(S, fAmber) - (1 - k) * .4, t, { ...PB, size: .5 * sc, foil: '#ffb35c', seed: 5 }); }
  // labels on the curves
  const ls2 = .33 * sc;
  if ((CH.amberLab ?? 0) > 0) { const s = 'WITH PEOPLE · SOMETHING THAT MATTERS', w = measure(ctx, s, ls2, ls2 * .16), [x, y] = S(hu(7) - .1, fv(fAmber(7)) - .55); wipe(ctx, x - w - 6, y - ls2 * 1.2, w + 12, ls2 * 1.6, CH.amberLab, () => text(ctx, s, x - w, y, { size: ls2, weight: 600, color: '#9a4e12', spacing: ls2 * .16 })); }
  if ((CH.aloneLab ?? 0) > 0) {   // two prints: ALONE (with "spent alone"), then · NOTHING THAT MATTERS (with "on nothing that matters")
    const s = 'ALONE · NOTHING THAT MATTERS', w = measure(ctx, s, ls2, ls2 * .16), wA = measure(ctx, 'ALONE ', ls2, ls2 * .16), [x, y] = S(VIG.u, VIG.v + VIG.ry + .55), x0 = x - w / 2;
    const draw = () => text(ctx, s, x0, y, { size: ls2, weight: 600, color: INKC, spacing: ls2 * .16 });
    wipe(ctx, x0 - 6, y - ls2 * 1.2, wA + 6, ls2 * 1.6, CH.aloneLab, draw);
    if ((CH.aloneLab2 ?? 0) > 0) wipe(ctx, x0 + wA, y - ls2 * 1.2, w - wA + 8, ls2 * 1.6, CH.aloneLab2, draw);
  }
  ctx.restore();
}
// the vignette: an engraved oval under the dip; inside, someone alone on a sofa at night in the cyan glow of a screen
export const VIG = { u: hu(6.05), v: 8.5, rx: 2.45, ry: 1.68 };
function vignette(ctx, t, S, sc, CH) {
  const [cx, cy] = S(VIG.u, VIG.v), rx = VIG.rx * sc, ry = VIG.ry * sc, k = clamp(CH.vig), L = clamp(CH.vigLight ?? 0), e = eoX(k);
  const u = sc * .0128;                                  // figure scale (1 → ~185 px standing); everything below in figure units u
  const hx = cx - rx * .3, hy = cy + ry * .02;           // the sitter's hip joint
  const fy = hy + 56 * u, seat = hy + 9 * u;             // floor line, seat top
  const fl = .78 + .22 * Math.sin(t * 9.1) * Math.sin(t * 3.7 + 1);
  const scr = { x: hx + 112 * u, y: fy - 52 * u };      // the screen's centre
  ctx.save();
  // the oval grows out of its centre (hard edge), the room inside it
  ctx.beginPath(); ctx.ellipse(cx, cy, rx * e, ry * e, 0, 0, TAU); ctx.clip();
  const wall = ctx.createLinearGradient(0, cy - ry, 0, fy); wall.addColorStop(0, '#0d1324'); wall.addColorStop(1, '#152036');
  ctx.fillStyle = wall; ctx.fillRect(cx - rx, cy - ry, rx * 2, fy - cy + ry);
  ctx.fillStyle = '#0a0e1a'; ctx.fillRect(cx - rx, fy, rx * 2, cy + ry - fy);
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(.6, u * 1.1); ctx.beginPath();
  for (let i = 1; i < 5; i++) { const y = fy + (cy + ry - fy) * (i / 5) ** 1.4; ctx.moveTo(cx - rx, y); ctx.lineTo(cx + rx, y); } ctx.stroke();      // floor boards
  // the night window behind the sofa: a tall dark pane, a thin sash, the moon's cold line on its frame
  const wx = hx - 62 * u, wy = fy - 150 * u, ww = 46 * u, wh = 92 * u;
  ctx.fillStyle = '#060a16'; ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = '#1b2440'; ctx.fillRect(wx - 3 * u, wy - 3 * u, ww + 6 * u, 3 * u); ctx.fillRect(wx - 3 * u, wy + wh, ww + 6 * u, 4 * u); ctx.fillRect(wx - 3 * u, wy, 3 * u, wh); ctx.fillRect(wx + ww, wy, 3 * u, wh); ctx.fillRect(wx + ww / 2 - 1.2 * u, wy, 2.4 * u, wh); ctx.fillRect(wx, wy + wh * .45, ww, 2.4 * u);
  ctx.fillStyle = 'rgba(150,170,230,.5)'; ctx.fillRect(wx + ww * .62, wy + wh * .12, 1.2 * u, 1.2 * u); ctx.fillRect(wx + ww * .2, wy + wh * .3, u, u);
  // a floor lamp, switched off, beside the sofa
  ctx.fillStyle = '#121a2c'; ctx.fillRect(hx - 50 * u, fy - 112 * u, 2.4 * u, 112 * u); ctx.beginPath(); ctx.moveTo(hx - 61 * u, fy - 108 * u); ctx.lineTo(hx - 38 * u, fy - 108 * u); ctx.lineTo(hx - 43 * u, fy - 126 * u); ctx.lineTo(hx - 56 * u, fy - 126 * u); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx - 49 * u, fy, 8 * u, 2 * u, 0, 0, TAU); ctx.fill();
  // the sofa in profile (facing right): a backrest leaning back, the seat cushion, the base on short legs
  const sofa = '#1f2a44', sofaD = '#141c30';
  ctx.fillStyle = sofaD; ctx.beginPath(); ctx.roundRect(hx - 36 * u, seat + 8 * u, 84 * u, fy - seat - 14 * u, 4 * u); ctx.fill();                       // base
  ctx.fillStyle = '#0a0e18'; ctx.fillRect(hx - 32 * u, fy - 6 * u, 4 * u, 6 * u); ctx.fillRect(hx + 40 * u, fy - 6 * u, 4 * u, 6 * u);              // legs
  ctx.fillStyle = sofa; ctx.beginPath(); ctx.moveTo(hx - 38 * u, seat + 10 * u); ctx.lineTo(hx - 47 * u, hy - 46 * u); ctx.quadraticCurveTo(hx - 44 * u, hy - 56 * u, hx - 33 * u, hy - 54 * u); ctx.lineTo(hx - 21 * u, hy - 50 * u); ctx.lineTo(hx - 16 * u, seat + 10 * u); ctx.closePath(); ctx.fill();   // backrest
  ctx.fillStyle = '#26324f'; ctx.beginPath(); ctx.roundRect(hx - 30 * u, seat - 1 * u, 80 * u, 11 * u, 5 * u); ctx.fill();                               // seat cushion
  // the sitter: slumped back, forearms resting on the thighs, head a little forward toward the screen (alive: breath, blink, glances)
  const LT = { x: scr.x, y: scr.y, col: '#8fe6ff', a: .65 * L };
  figure(ctx, hx, hy, u, { ...POSES.sit, lean: -.1, head: .14, sh: [.16, .08], el: [.74, .8], hands: ['relaxed', 'relaxed'] }, { t, seed: 11, dress: { coat: '#3b4a6a', pants: '#1c2336', shoes: '#0c0d14', hair: '#17121a' }, light: LT, rim: '#8fe6ff', rimSide: 1, shadow: false });
  // the low cabinet, the screen on its foot, turned three-quarters toward the sitter
  ctx.fillStyle = '#121a2c'; ctx.fillRect(scr.x - 22 * u, fy - 26 * u, 46 * u, 26 * u); ctx.fillStyle = mixHex('#1a2440', '#6fc8e0', .55 * L * fl); ctx.fillRect(scr.x - 22 * u, fy - 26 * u, 46 * u, 2.4 * u);
  ctx.strokeStyle = 'rgba(4,6,14,.6)'; ctx.lineWidth = Math.max(.6, u); ctx.strokeRect(scr.x - 22 * u, fy - 26 * u, 46 * u, 26 * u); ctx.beginPath(); ctx.moveTo(scr.x + 1, fy - 24 * u); ctx.lineTo(scr.x + 1, fy - 2 * u); ctx.stroke();
  ctx.fillStyle = '#0a0e18'; ctx.fillRect(scr.x - 1.5 * u, fy - 34 * u, 3 * u, 8 * u); ctx.fillRect(scr.x - 8 * u, fy - 27.5 * u, 16 * u, 1.6 * u);
  const sw2 = 30 * u, sh2 = 19 * u, q = [[scr.x - sw2 * .5, scr.y - sh2 * .55], [scr.x + sw2 * .5, scr.y - sh2 * .45], [scr.x + sw2 * .5, scr.y + sh2 * .45], [scr.x - sw2 * .5, scr.y + sh2 * .55]];
  ctx.fillStyle = '#05070e'; ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x + (i === 1 || i === 2 ? 3 * u : -1.4 * u), y + (i < 2 ? -1.4 * u : 1.4 * u)) : ctx.moveTo(x - 1.4 * u, y - 1.4 * u))); ctx.closePath(); ctx.fill();
  ctx.fillStyle = L > 0 ? mixHex('#0b1220', '#9aeaff', (.55 + .45 * fl) * L) : '#0b1220'; ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
  // the screen's cold light into the room (additive), a pool on the floor
  if (L > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gl = ctx.createRadialGradient(scr.x - 6 * u, scr.y, 0, scr.x - 6 * u, scr.y, rx * 1.15); gl.addColorStop(0, rgba('#8fe6ff', .3 * L * fl)); gl.addColorStop(.3, rgba('#3aa8c8', .12 * L * fl)); gl.addColorStop(1, 'rgba(10,60,90,0)');
    ctx.fillStyle = gl; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
    ctx.save(); ctx.translate(scr.x - 40 * u, fy + 4 * u); ctx.scale(1, .18); const gp = ctx.createRadialGradient(0, 0, 0, 0, 0, 70 * u); gp.addColorStop(0, rgba('#8fe6ff', .22 * L * fl)); gp.addColorStop(1, 'rgba(60,160,200,0)'); ctx.fillStyle = gp; ctx.beginPath(); ctx.arc(0, 0, 70 * u, 0, TAU); ctx.fill(); ctx.restore();
    ctx.restore();
  }
  // darkness over the room recedes as the screen light rises (the room rises out of the dark)
  if (L < 1) { ctx.fillStyle = `rgba(8,10,22,${.94 * (1 - sm(L))})`; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2); }
  // engraved hatching over the whole room (it is a print): diagonal, denser in the corners away from the screen
  ctx.strokeStyle = 'rgba(6,8,16,.32)'; ctx.lineWidth = Math.max(.6, sc * .012); ctx.beginPath();
  for (let x = cx - rx - ry * 1.6; x < cx + rx; x += sc * .085) { ctx.moveTo(x, cy + ry); ctx.lineTo(x + ry * 1.6, cy - ry); } ctx.stroke();
  ctx.strokeStyle = 'rgba(6,8,16,.28)'; ctx.beginPath();
  for (let x = cx - rx; x < cx - rx * .2; x += sc * .085) { ctx.moveTo(x, cy - ry); ctx.lineTo(x + ry * .9, cy + ry); } ctx.stroke();
  ctx.restore();
  // the oval frame: a double engraved line, growing with the oval
  ctx.strokeStyle = INKC; ctx.lineWidth = Math.max(1, sc * .05);
  ctx.beginPath(); ctx.ellipse(cx, cy, rx * e, ry * e, 0, 0, TAU); ctx.stroke();
  ctx.lineWidth = Math.max(.7, sc * .02); ctx.beginPath(); ctx.ellipse(cx, cy, rx * e + .12 * sc, ry * e + .12 * sc, 0, 0, TAU); ctx.stroke();
}
