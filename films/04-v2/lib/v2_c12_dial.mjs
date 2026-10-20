// c12 · 12.03–12.05 the tailor's thread, the circle, the 24-hour dial (moments of flow), the star the plates are born from.
// Native units = the roadside's (lib/v2_c12_road.mjs); the dial hangs in the sky above the tailor's kiosk. Owner: c12.
//   DIAL                         { x, y, R } the circle (centre, radius), native units
//   threadAt(t, K)               the thread's state: { pts (drawn polyline), end [x, y] (the free end), tail } for the take
//   drawThread(ctx, t, K, light) the amber thread (the hero light) from the spool into the circle; light: 0 day … 1 night (glow)
//   drawDial(ctx, t, K, o)       the dial: paper face cut by a burin spiral, hour ticks, numerals, flow marks struck by the hand,
//                                the evening sofa, the glint on "alive"; o: { hour, night, scale (12.05 tightening), alpha }
//   hourAt(t, K)                 the hand's hour (8 → 24 over the sentence), drives sky and ground
//   K = { start, close, tailA, tailB, faceA, faceB, sweepA, sweepB, alive, work, couch }  (film seconds, from the scene)
import { rgba, clamp, mix, prng, sm, eout, eio, lin, canvas, text } from '../engine.mjs';
import { once, memo, glowSpr, glowAt, TAU, mixC, eiq } from './v2_c12_kit.mjs';
import { SPOOL } from './v2_c12_road.mjs';

export const DIAL = { x: 1080, y: 60, R: 340 };
const B = [DIAL.x, DIAL.y + DIAL.R];
const INK = '#2a1a10', AMB = '#ffb35c', AMBD = '#d8862a';
export const theta = (h) => Math.PI / 2 + h / 24 * TAU;          // 24 at the bottom, 6 left, 12 top, 18 right (clockwise)

// ---------------------------------------------------------------- the path the free end runs (spool → up in front of the stall → round)
const cub = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
const PATH = memo('c12threadpath', () => {
  const S = [SPOOL.x, SPOOL.y], pts = [];
  for (let i = 0; i <= 60; i++) pts.push(cub(S, [S[0] - 50, S[1] + 14], [968, 610], [972, 520], i / 60));
  for (let i = 1; i <= 60; i++) pts.push(cub([972, 520], [976, 430], [1018, 400], B, i / 60));
  const La = (() => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; })();
  const nA = pts.length;
  for (let i = 1; i <= 240; i++) { const f = i / 240 * TAU, a = Math.PI / 2 - f; pts.push([DIAL.x + Math.cos(a) * DIAL.R, DIAL.y + Math.sin(a) * DIAL.R]); }
  const acc = [0]; for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, acc, La, nA, L: acc[acc.length - 1] };
});
// the point at arc length s, with the index for slicing
function atS(s) {
  const P = PATH, a = P.acc; s = clamp(s, 0, P.L); let lo = 0, hi = a.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (a[m] < s) lo = m; else hi = m; }
  const u = (s - a[lo]) / ((a[hi] - a[lo]) || 1); return { i: lo, p: [mix(P.pts[lo][0], P.pts[hi][0], u), mix(P.pts[lo][1], P.pts[hi][1], u)] };
}
// the free end's arc length: eased so it leaves the spool gently, runs round fast and arrives at the bottom exactly on "sounds"
const endS = (t, K) => PATH.L * (() => { const u = clamp((t - K.start) / (K.close - K.start)); return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; })();
export function threadAt(t, K) {
  const P = PATH, se = endS(t, K), dt = t - K.close;
  const wob = t < K.close ? 1 : Math.exp(-dt * 7) * Math.cos(dt * 34), wave = t < K.close ? 1 : Math.exp(-dt * 6);
  const pt = (s) => {
    const { p } = atS(s);
    if (s > P.La) { const f = (s - P.La) / DIAL.R, a = Math.PI / 2 - f, rr = DIAL.R * (1 + .028 * wob * Math.sin(3 * f + 1.3 + t * 2) * Math.sin(f / 2)); return [DIAL.x + Math.cos(a) * rr, DIAL.y + Math.sin(a) * rr]; }
    const w = 7 * Math.sin(s * .045 - t * 9) * clamp((se - s) / 160) * clamp(s / 40) * wave, q = atS(s + 1).p, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
    return [p[0] - dy / L * w, p[1] + dx / L * w];
  };
  const pts = [], tail = [];
  if (t < K.tailA) { for (let s = 0; s < se; s += 6) pts.push(pt(s)); if (se > 0) pts.push(pt(se)); }
  else {
    for (let s = P.La; s < P.L; s += 6) pts.push(pt(s)); pts.push(pt(P.L));
    const te = P.La * (1 - eio(lin(K.tailA, K.tailB, t)));       // the tail is wound back onto the spool from its circle end
    if (te > 1) { for (let s = 0; s < te; s += 6) tail.push(pt(s)); tail.push(pt(te)); }
  }
  return { pts, end: pt(se), se, closed: t >= K.close, tail };
}
function strokeThread(ctx, pts, light, w = 1) {
  if (pts.length < 2) return;
  const path = () => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'lighter';
  path(); ctx.strokeStyle = rgba(AMB, (.05 + .12 * light) * w); ctx.lineWidth = 16; ctx.stroke();
  path(); ctx.strokeStyle = rgba(AMB, (.12 + .25 * light) * w); ctx.lineWidth = 6; ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  path(); ctx.strokeStyle = mixC('#c0661a', '#ffc070', light); ctx.lineWidth = 3.8 * Math.max(.6, w); ctx.stroke();
  path(); ctx.strokeStyle = rgba('#fff1d6', .5 + .4 * light); ctx.lineWidth = 1.2; ctx.stroke();
  ctx.restore();
}
export function drawThread(ctx, t, K, light = 0) {
  if (t < K.start) return;
  const th = threadAt(t, K);
  strokeThread(ctx, th.pts, light);
  if (th.tail.length > 1) strokeThread(ctx, th.tail, light, .8);
  // the free end: a small bright spark while it runs
  if (!th.closed) glowAt(ctx, th.end[0], th.end[1], 46, .75, AMB);
  // the knot at the bottom flashes as the circle closes
  const k = Math.exp(-Math.max(0, t - K.close) * 4) * (t >= K.close ? 1 : 0); if (k > .01) glowAt(ctx, B[0], B[1], 90 * (1 + (1 - k)), .9 * k, '#ffcf8a');
  return th;
}

// ---------------------------------------------------------------- the dial
// the face (paper, engraved: guilloche rings, the hour ring, ticks, numerals), cached at 2x
const FR = 2;
function face() {
  return once('c12dialface', () => {
    const R = DIAL.R, S = Math.ceil((R + 8) * 2 * FR), [c, g] = canvas(S, S); g.translate(S / 2, S / 2); g.scale(FR, FR);
    // paper
    const pg = g.createRadialGradient(-R * .3, -R * .35, 0, 0, 0, R); pg.addColorStop(0, '#f7ecd2'); pg.addColorStop(.7, '#eedcb8'); pg.addColorStop(1, '#dcc394');
    g.fillStyle = pg; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
    // fibres
    const r = prng(1207); g.lineCap = 'round';
    for (let i = 0; i < 260; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R * .97, x = Math.cos(a) * d, y = Math.sin(a) * d, q = (r() - .5) * 2.4, L = 4 + r() * 14; g.strokeStyle = rgba(r() < .5 ? '#8a7350' : '#fffaf0', .08 + .06 * r()); g.lineWidth = .6 + r() * .5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(q) * L, y + Math.sin(q) * L); g.stroke(); }
    // guilloche rings (the lathe's engraving): fine wavy circles in the centre field
    g.strokeStyle = rgba(INK, .14); g.lineWidth = .7;
    for (let k = 0; k < 9; k++) { const r0 = R * (.1 + k * .032); g.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * TAU, rr = r0 + 3 * Math.sin(a * 18 + k * .7); i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.stroke(); }
    // the hour ring band: two rules, quarter-hour ticks, hour ticks, major ticks at 6/12/18/24
    g.strokeStyle = rgba(INK, .75); g.lineWidth = 1.6; for (const q of [.965, .86]) { g.beginPath(); g.arc(0, 0, R * q, 0, TAU); g.stroke(); }
    g.lineWidth = 1; g.strokeStyle = rgba(INK, .5); g.beginPath(); g.arc(0, 0, R * .74, 0, TAU); g.stroke();
    for (let i = 0; i < 96; i++) { const h = i / 4, a = theta(h), major = i % 24 === 0, hour = i % 4 === 0; const r0 = R * (major ? .84 : hour ? .885 : .93), r1 = R * .965;
      g.strokeStyle = rgba(INK, major ? .95 : hour ? .8 : .45); g.lineWidth = major ? 3.6 : hour ? 2 : 1; g.beginPath(); g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); g.stroke(); }
    // numerals 6 · 12 · 18 · 24 (Instrument Serif), small hour numerals in between
    for (const [h, s] of [[6, 46], [12, 46], [18, 46], [24, 46], [3, 24], [9, 24], [15, 24], [21, 24]]) {
      const a = theta(h), rr = R * (s > 30 ? .76 : .79); text(g, String(h), Math.cos(a) * rr, Math.sin(a) * rr + s * .34, { size: s, font: 'Instrument Serif', color: INK, alpha: s > 30 ? .92 : .7, align: 'center' });
    }
    // the shading of a lit disc (light from the upper left) and a fine edge
    const sh = g.createLinearGradient(-R, -R, R, R); sh.addColorStop(0, 'rgba(255,250,236,.12)'); sh.addColorStop(1, 'rgba(70,45,20,.16)'); g.fillStyle = sh; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
    return c;
  });
}
// flow marks: dense in the working day, sparse in the evening (illustrative, no numbers: Csikszentmihalyi & LeFevre 1989)
const FLOW = memo('c12flow', () => {
  const r = prng(1208), out = [], per = { 8: 4, 9: 6, 10: 6, 11: 5, 12: 4, 13: 6, 14: 6, 15: 5, 16: 5, 17: 2, 18: 1, 19: 1, 20: 0, 21: 1, 22: 0, 23: 0 };
  for (const [h, n] of Object.entries(per)) for (let i = 0; i < n; i++) out.push({ h: Number(h) + (i + .2 + r() * .6) / n, rr: .5 + r() * .2, s: .8 + r() * .45, ph: r() * TAU });
  return out;
});
export const hourAt = (t, K) => t < K.sweepA ? 8 : mix(8, 24, clamp((t - K.sweepA) / (K.sweepB - K.sweepA)));
function sofa(g, x, y, s, a) {
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = a;
  g.fillStyle = '#5a3a2a'; g.beginPath(); g.roundRect(-30, -18, 60, 14, 4); g.fill();                 // backrest
  g.fillStyle = '#7a4e36'; g.beginPath(); g.roundRect(-30, -6, 60, 10, 3); g.fill();                  // seat cushion
  g.fillStyle = '#4a2e20'; g.beginPath(); g.roundRect(-36, -12, 9, 18, 3); g.fill(); g.beginPath(); g.roundRect(27, -12, 9, 18, 3); g.fill();   // arms
  g.fillRect(-30, 6, 3, 5); g.fillRect(27, 6, 3, 5);                                                 // legs
  g.strokeStyle = 'rgba(255,240,220,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-26, -15); g.lineTo(26, -15); g.stroke();
  g.restore();
}
export function drawDial(ctx, t, K, o = {}) {
  const fc = eio(lin(K.faceA, K.faceB, t)); if (fc <= 0) return;
  const R = DIAL.R, sc = o.scale ?? 1, night = clamp(o.night ?? 0), hour = o.hour ?? 8;
  ctx.save(); ctx.translate(DIAL.x + (o.dx || 0), DIAL.y + (o.dy || 0)); ctx.scale(sc, sc);
  // the face, cut by a burin spiralling outward from the centre (a lathe): it is there where the burin has passed
  const rf = R * fc;
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, rf, 0, TAU); ctx.clip();
  ctx.drawImage(face(), -(R + 8), -(R + 8), (R + 8) * 2, (R + 8) * 2);
  // the evening light on the paper: darker, warmer toward the rim (lit by the thread ring)
  if (night > 0) { ctx.fillStyle = rgba('#2a2240', .38 * night); ctx.fillRect(-R, -R, 2 * R, 2 * R); const g = ctx.createRadialGradient(0, 0, R * .5, 0, 0, R); g.addColorStop(0, rgba(AMB, 0)); g.addColorStop(1, rgba(AMB, .22 * night)); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(-R, -R, 2 * R, 2 * R); ctx.globalCompositeOperation = 'source-over'; }
  // labels in the field: AT WORK above the centre (the day), the sofa in the evening quarter
  const la = clamp((t - K.faceB) / .35);
  if (la > 0) {
    const wk = Math.exp(-Math.pow((t - K.work - .1) / .35, 2));
    text(ctx, 'AT WORK', 0, -R * .2, { size: 17, weight: 600, spacing: 5, color: INK, alpha: .75 * la, align: 'center' });
    if (wk > .02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; text(ctx, 'AT WORK', 0, -R * .2, { size: 17, weight: 600, spacing: 5, color: AMB, alpha: .7 * wk, align: 'center' }); ctx.restore(); }
    const sa = theta(19.6), cu = Math.exp(-Math.pow((t - K.couch - .15) / .45, 2)), sxy = [Math.cos(sa) * R * .6, Math.sin(sa) * R * .6];
    if (cu > .02) glowAt(ctx, sxy[0], sxy[1], 80, .6 * cu, '#ffcf8a');
    sofa(ctx, sxy[0], sxy[1], 1.05 * (1 + .12 * cu), la);
    // the legend and the source, printed on the face below the hub (the instrument's own imprint)
    ctx.save(); ctx.translate(-104, R * .215); ctx.fillStyle = rgba(AMBD, la); ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(0, -4.5); ctx.lineTo(9, 0); ctx.lineTo(0, 4.5); ctx.closePath(); ctx.fill(); ctx.restore();
    text(ctx, 'MOMENTS OF FLOW', 10, R * .215 + 5, { size: 14.5, weight: 600, spacing: 3, color: INK, alpha: .85 * la, align: 'center' });
    text(ctx, 'CSIKSZENTMIHALYI & LEFEVRE 1989', 0, R * .33 + 4, { size: 12.5, weight: 600, spacing: 1.6, color: INK, alpha: .72 * la, align: 'center' });
    text(ctx, 'J. OF PERSONALITY AND SOCIAL PSYCHOLOGY', 0, R * .4 + 4, { size: 12.5, weight: 600, spacing: 1.2, color: INK, alpha: .72 * la, align: 'center' });
  }
  ctx.restore();
  // the burin spark at the cutting front
  if (fc < 1) { const a = -fc * 5.5 * TAU; glowAt(ctx, Math.cos(a) * rf, Math.sin(a) * rf, 60, .9, AMB); }
  // flow marks: struck as the hand passes their hour (they grow out of the hand's contact, flare, settle); glint on "alive"
  if (fc >= 1) {
    const gl = (h) => { const ga = theta(mix(8, 17, clamp((t - K.alive + .05) / .55))); const d = Math.abs(((theta(h) - ga) % TAU + TAU + Math.PI) % TAU - Math.PI); return (t > K.alive - .05 && t < K.alive + .9) ? Math.exp(-d * d * 30) : 0; };
    for (const m of FLOW) {
      if (m.h > hour) continue;
      const age = (hour - m.h) * (K.sweepB - K.sweepA) / 16, a = theta(m.h), rr = R * m.rr, x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      const grow = eout(clamp(age / .18)), flare = Math.exp(-age * 5), glint = gl(m.h), br = .82 + .18 * Math.sin(t * 2.2 + m.ph);
      ctx.save(); ctx.translate(x, y); ctx.rotate(a); const L = 15 * m.s * grow, w = 5 * m.s * grow;
      ctx.fillStyle = AMBD; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(0, -w); ctx.lineTo(L, 0); ctx.lineTo(0, w); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba('#fff1d6', .6 * br); ctx.beginPath(); ctx.moveTo(-L * .5, 0); ctx.lineTo(0, -w * .4); ctx.lineTo(L * .5, 0); ctx.lineTo(0, w * .4); ctx.closePath(); ctx.fill();
      ctx.restore();
      const gA = (.22 + .3 * night) * br * grow + .7 * flare + .75 * glint; if (gA > .02) glowAt(ctx, x, y, 22 + 18 * (flare + glint), clamp(gA), AMB);
    }
    // the hand: an engraved needle with a lozenge, the tip a small amber striker
    const ha = theta(hour), hl = eout(clamp((t - K.faceB) / .3));
    ctx.save(); ctx.rotate(ha); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(-R * .12, -3); ctx.lineTo(R * .86 * hl, -1.2); ctx.lineTo(R * .86 * hl, 1.2); ctx.lineTo(-R * .12, 3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(R * .5 * hl, 0); ctx.lineTo(R * .56 * hl, -9); ctx.lineTo(R * .62 * hl, 0); ctx.lineTo(R * .56 * hl, 9); ctx.closePath(); ctx.fill();
    ctx.restore();
    glowAt(ctx, Math.cos(ha) * R * .86 * hl, Math.sin(ha) * R * .86 * hl, 30, .8, AMB);
    ctx.fillStyle = '#b8892e'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a3a14'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
