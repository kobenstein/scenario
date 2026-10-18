// Motion-design symbol scenes. Each export returns draw(ctx, t, shot); shot.k holds beat times (seconds, film time).
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, back, drift, prng, sky, fog, glow, addGlow, text, label, glowLine, samples } from '../engine.mjs';

const K = (s, name, d) => (s.k && s.k[name] !== undefined ? s.k[name] : s.a + d);

// faint chart grid on the night sky
function grid(ctx, x0, y0, x1, y1, nx, ny, a, col = C.muted) {
  ctx.save(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 1;
  for (let i = 0; i <= nx; i++) { const x = mix(x0, x1, i / nx); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
  for (let j = 0; j <= ny; j++) { const y = mix(y0, y1, j / ny); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
  ctx.restore();
}
const fmt = (n) => Math.round(n).toLocaleString('en-US');

// ============ H2: Moore's graph paper, seen from above under the lamp ============
// k: dots (first dot), line (pencil line), ext (extrapolate), glow (line turns into light)
export const graphPaper = () => (ctx, t, s) => {
  const tD = K(s, 'dots', .6), tL = K(s, 'line', 4), tE = K(s, 'ext', 6), tG = K(s, 'glow', s.b - 2.2);
  const z = mix(1.0, 1.18, sine(lin(s.a, s.b, t))) + drift(t, .006), rot = -0.05 + drift(t, .006, 3);
  ctx.fillStyle = '#120d22'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2 + drift(t, 8, 1), H / 2 + drift(t, 6, 2)); ctx.rotate(rot); ctx.scale(z, z);
  const PW = 1500, PH = 1060; // paper
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-PW / 2 + 18, -PH / 2 + 22, PW, PH);
  const pg = ctx.createRadialGradient(-180, -160, 60, -180, -160, 1250); pg.addColorStop(0, '#f6e7c8'); pg.addColorStop(.55, '#e2c99c'); pg.addColorStop(1, '#8d7457');
  ctx.fillStyle = pg; ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
  // log-paper grid: decades with 9 sub-lines
  ctx.lineWidth = 1;
  for (let i = 0; i <= 30; i++) { const x = -PW / 2 + 90 + i * 44; ctx.strokeStyle = `rgba(70,120,140,${i % 5 ? .16 : .32})`; ctx.beginPath(); ctx.moveTo(x, -PH / 2 + 50); ctx.lineTo(x, PH / 2 - 70); ctx.stroke(); }
  for (let d = 0; d < 6; d++) for (let m = 1; m <= 9; m++) { const y = PH / 2 - 70 - (d + Math.log10(m)) * 160; if (y < -PH / 2 + 50) continue; ctx.strokeStyle = `rgba(70,120,140,${m === 1 ? .34 : .13})`; ctx.beginPath(); ctx.moveTo(-PW / 2 + 90, y); ctx.lineTo(PW / 2 - 60, y); ctx.stroke(); }
  // data: years 1959..1965 (x) vs components (log2 ~ year-1959)
  const X = (yr) => -PW / 2 + 90 + (yr - 1959) * 88, Y = (log2) => PH / 2 - 70 - log2 * Math.log10(2) * 160;
  const pts = [[1959, 0], [1962, 3], [1963, 4], [1964, 5], [1965, 6]];
  const ink = (a) => `rgba(42,34,48,${a})`;
  pts.forEach(([yr, l], i) => {
    const a = eout(lin(tD + i * .45, tD + i * .45 + .35, t)); if (a <= 0) return;
    ctx.fillStyle = ink(.9 * a); ctx.beginPath(); ctx.arc(X(yr), Y(l), 9 * back(a), 0, 7); ctx.fill();
    text(ctx, String(yr), X(yr), PH / 2 - 30, { size: 26, font: 'Instrument Serif', color: '#3a2f3a', align: 'center', alpha: a * .85 });
  });
  // doubling axis: each labelled step up is ×2, which is why doubling draws a straight line here
  const axA = lin(tD - .4, tD + .4, t);
  for (let l = 0; l <= 16; l++) { const y = Y(l); if (y < -PH / 2 + 60) continue; text(ctx, fmt(Math.pow(2, l)), -PW / 2 + 78, y + 8, { size: 22, font: 'Instrument Serif', color: '#3a2f3a', align: 'right', alpha: axA * .85 }); }
  text(ctx, 'each mark up = double', -PW / 2 + 110, -PH / 2 + 40, { size: 34, font: 'Instrument Serif Italic', color: '#3a2f3a', alpha: axA * .9 });
  // pencil line through the dots
  const u = eio(lin(tL, tL + 1.6, t));
  if (u > 0) { ctx.strokeStyle = ink(.85); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X(1958.6), Y(-.4)); ctx.lineTo(mix(X(1958.6), X(1965.4), u), mix(Y(-.4), Y(6.4), u)); ctx.stroke(); }
  // dashed extrapolation to 1975
  const e = eio(lin(tE, tE + 2.2, t));
  if (e > 0) {
    ctx.save(); ctx.setLineDash([18, 14]); ctx.strokeStyle = ink(.75); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X(1965.4), Y(6.4)); ctx.lineTo(mix(X(1965.4), X(1975), e), mix(Y(6.4), Y(16), e)); ctx.stroke(); ctx.restore();
    const la = lin(tE + 1.8, tE + 2.4, t);
    text(ctx, '1975', X(1975), PH / 2 - 30, { size: 26, font: 'Instrument Serif', color: '#3a2f3a', align: 'center', alpha: la });
    text(ctx, '65,000?', X(1975) - 30, Y(16) + 8, { size: 46, font: 'Instrument Serif Italic', color: '#3a2f3a', align: 'right', alpha: la });
  }
  // the line becomes light
  const g = lin(tG, tG + 1.4, t);
  if (g > 0) {
    const P = samples((v) => [mix(X(1958.6), X(1975), v), mix(Y(-.4), Y(16), v)], 0, 1, 60);
    glowLine(ctx, P, 1, { alpha: sm(g), width: 4, glowW: 26 });
    ctx.fillStyle = `rgba(10,8,30,${.35 * sm(g)})`; ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
    glowLine(ctx, P, 1, { alpha: sm(g), width: 5, glowW: 30 });
  }
  ctx.restore();
  // lamp light and the dark room around
  const lg = ctx.createRadialGradient(W * .38, H * .3, 100, W * .45, H * .45, 1300); lg.addColorStop(0, 'rgba(255,179,92,.10)'); lg.addColorStop(.6, 'rgba(18,13,34,0)'); lg.addColorStop(1, 'rgba(8,6,20,.75)');
  ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
};

// ============ H3: the line climbs through six decades ============
// camera rises with the head of the line; years pass on the left; a counter rides the head
export const climb = ({ from = 1965, to = 2026, n0 = 64, n1 = 336e9 } = {}) => (ctx, t, s) => {
  const u = sine(lin(s.a + .3, s.b - 1.2, t)), off = u * 2600;
  sky(ctx, t, { offY: off * .5, top: '#05061a', bottom: '#1d1850' });
  const year = mix(from, to, u);
  // the line: from bottom-left, steep; fixed in world space, we move up
  const pts = samples((v) => { const wy = v * 3200; return [mix(380, 1150, Math.pow(v, .5)) + 40 * Math.sin(v * 3), H + 200 - wy + off]; }, 0, Math.min(1, (off + 900) / 3200), 120);
  glowLine(ctx, pts, 1, { width: 5, glowW: 30 });
  // year ticks drifting down
  for (let y = 1970; y <= 2030; y += 5) {
    const v = (y - from) / (to - from), wy = H + 200 - v * 2600 * 1.0 - 300 + off;
    if (wy < -60 || wy > H + 60) continue;
    const a = clamp(1 - Math.abs(wy - H * .55) / 520);
    ctx.fillStyle = rgba(C.muted, .5 * a); ctx.fillRect(140, wy, 60, 2);
    text(ctx, String(y), 220, wy + 12, { size: 36, font: 'Instrument Serif', color: C.muted, alpha: a });
  }
  const head = pts[pts.length - 1];
  const n = Math.exp(mix(Math.log(n0 * 1000), Math.log(n1), u));
  const ca = lin(s.a + .4, s.a + 1.2, t);
  text(ctx, fmt(n), head[0] + 60, head[1] + 16, { size: 64, font: 'Instrument Serif', color: C.cream, alpha: ca });
  text(ctx, 'COMPONENTS ON ONE CHIP', head[0] + 64, head[1] + 56, { size: 18, weight: 600, color: C.muted, alpha: ca * .9, spacing: 5 });
  text(ctx, String(Math.round(year)), W - 120, 140, { size: 96, font: 'Instrument Serif', align: 'right', alpha: ca });
};

// ============ M1: ramp vs doubling, and the 1975 guesses ============
// k: curve (doubling shows), guess (bars)
export const rampVsCurve = () => (ctx, t, s) => {
  const tC = K(s, 'curve', 3), tG = K(s, 'guess', 7.5);
  sky(ctx, t, { stars: .5 });
  const x0 = 260, x1 = 1660, y0 = 880, y1 = 200;
  const shift = eio(lin(tG, tG + 1.2, t));
  ctx.save(); ctx.translate(-shift * 420, 0); ctx.globalAlpha = 1 - .55 * shift;
  grid(ctx, x0, y1, x1, y0, 14, 7, .07);
  const ramp = samples((v) => [mix(x0, x1, v), mix(y0, y0 - 300, v)], 0, 1, 80);
  glowLine(ctx, ramp, eio(lin(s.a + .4, s.a + 2.4, t)), { color: C.amber, width: 4, glowW: 16 });
  const curve = samples((v) => [mix(x0, x1, v), y0 - (Math.pow(2, v * 10) - 1) / 1023 * 900], 0, 1, 160);
  glowLine(ctx, curve, eio(lin(tC, tC + 2.6, t)), { width: 4, glowW: 22 });
  label(ctx, t, s.a + 1.6, x1 - 10, y0 - 320, 'what we picture', '', { align: 'right' });
  label(ctx, t, tC + 2.2, x1 - 60, y1 - 20, 'what doubling does', '', { align: 'right' });
  ctx.restore();
  // guesses vs reality (Wagenaar & Sagaria 1975)
  if (t > tG) {
    const a = eout(lin(tG + .4, tG + 1.2, t)), bx = 1180, by = 900;
    const gh = 70 * eout(lin(tG + .8, tG + 1.6, t)), rh = 760 * eio(lin(tG + 1.8, tG + 3.6, t));
    ctx.fillStyle = rgba(C.amber, .85 * a); ctx.fillRect(bx, by - gh, 150, gh);
    ctx.fillStyle = rgba(C.cyan, .75 * a); ctx.fillRect(bx + 230, by - rh, 150, rh); addGlow(ctx, bx + 305, by - rh, 160, .5 * a);
    ctx.fillStyle = rgba(C.muted, .5 * a); ctx.fillRect(bx - 40, by, 610, 2);
    text(ctx, 'THE GUESS', bx + 75, by + 44, { size: 20, weight: 600, color: C.muted, align: 'center', alpha: a, spacing: 5 });
    text(ctx, 'THE ANSWER', bx + 305, by + 44, { size: 20, weight: 600, color: C.muted, align: 'center', alpha: a, spacing: 5 });
    label(ctx, t, tG + 3.4, bx + 75, by - 240, '2 in 3 people', 'under 10 %', { align: 'center' });
    text(ctx, 'Wagenaar & Sagaria, 1975', W - 80, H - 60, { size: 20, color: C.muted, align: 'right', alpha: a * .8 });
  }
};

// ============ S2: the forecasts fan (IEA vs. reality) ============
// k: fan (first forecast), year by year after that
export const forecastFan = () => (ctx, t, s) => {
  const tF = K(s, 'fan', 2), dur = s.b - tF - 1.5;
  sky(ctx, t, { stars: .35 });
  const x0 = 220, x1 = 1700, y0 = 900, y1 = 160, Y0 = 2006, Y1 = 2030;
  const X = (y) => mix(x0, x1, (y - Y0) / (Y1 - Y0));
  const actual = (y) => 1.4 * Math.pow(1.36, y - Y0); // GW/yr shape (illustrative)
  const top = actual(2024) * 1.15, Y = (v) => y0 - v / top * (y0 - y1);
  grid(ctx, x0, y1, x1, y0, 12, 6, .06);
  for (let y = 2010; y <= 2030; y += 5) text(ctx, String(y), X(y), y0 + 46, { size: 30, font: 'Instrument Serif', color: C.muted, align: 'center', alpha: .8 });
  const now = mix(2007, 2024.3, eio(lin(tF, tF + dur, t)));
  // forecasts: each spawned at its year, from the actual value, rising a little then flat
  for (let fy = 2007; fy <= 2024; fy += 1) {
    if (now < fy) break;
    const a = eout(lin(fy, fy + .6, now)) * (fy === Math.floor(now) ? 1 : .55);
    const v0 = actual(fy), pts = samples((v) => { const yy = fy + v * (Y1 - fy); return [X(yy), Y(v0 * (1 + .35 * (1 - Math.exp(-v * 4))))]; }, 0, 1, 40);
    glowLine(ctx, pts, eout(lin(fy, fy + .8, now)), { color: C.amber, width: 2.2, glowW: 8, alpha: a, head: false, dash: [10, 9] });
  }
  const pts = samples((yy) => [X(yy), Y(actual(yy))], 2006, now, 120);
  glowLine(ctx, pts, 1, { width: 5, glowW: 26 });
  label(ctx, t, tF + 1.5, X(2014), Y(actual(2016)) - 70, 'forecasts', 'flat, every year', {});
  label(ctx, t, tF + dur * .8, X(2021) - 40, Y(actual(2024)) + 10, 'what got built', '', { align: 'right' });
  text(ctx, 'IEA World Energy Outlooks vs. installed solar · shape after A. Hoekstra', W - 80, H - 50, { size: 18, color: C.muted, align: 'right', alpha: .7 * lin(tF, tF + 1, t) });
};

// ============ S3: the learning loop + price fall ============
export const learningLoop = () => (ctx, t, s) => {
  const tP = K(s, 'price', s.b - 5);
  sky(ctx, t, { stars: .4 });
  const out = eio(lin(tP, tP + 1, t)), cx = W / 2 - out * 470, cy = H / 2, R = 260;
  const words = ['more panels', 'cheaper', 'more buyers'];
  const rot = t * 0.55;
  ctx.save(); ctx.globalAlpha = 1 - .35 * out;
  ctx.strokeStyle = rgba(C.cyan, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + i * 2.094, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, ap = eout(lin(s.a + .5 + i * .7, s.a + 1.2 + i * .7, t));
    ctx.fillStyle = rgba(C.indigo, ap); ctx.beginPath(); ctx.arc(x, y, 16, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(C.cyanWhite, ap); ctx.lineWidth = 3; ctx.stroke();
    text(ctx, words[i], x + (i === 0 ? 0 : i === 1 ? 40 : -40), y + (i === 0 ? -40 : 60), { size: 40, font: 'Instrument Serif', align: i === 0 ? 'center' : i === 1 ? 'left' : 'right', alpha: ap });
  }
  for (let j = 0; j < 3; j++) { const a = rot * 2 + j * 2.094; addGlow(ctx, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 46, .85); }
  label(ctx, t, s.a + 3.2, cx, cy + 10, 'each doubling', '−20 % price', { align: 'center' });
  ctx.restore();
  if (out > 0) { // price per watt since 1976, log-ish fall
    const x0 = 1020, x1 = 1780, y0 = 860, y1 = 260;
    grid(ctx, x0, y1, x1, y0, 8, 6, .06 * out);
    const pts = samples((v) => [mix(x0, x1, v), mix(y1, y0, 1 - Math.pow(1 - v, 2.8)) ], 0, 1, 80);
    glowLine(ctx, pts, eio(lin(tP + .5, tP + 3.2, t)), { color: C.amber, width: 4, glowW: 18 });
    text(ctx, '1976', x0, y0 + 44, { size: 30, font: 'Instrument Serif', color: C.muted, align: 'center', alpha: out });
    text(ctx, 'today', x1, y0 + 44, { size: 30, font: 'Instrument Serif', color: C.muted, align: 'center', alpha: out });
    label(ctx, t, tP + 2.8, x1, y1 + 80, 'solar panel price', '−99 %', { align: 'right' });
  }
};

// ============ A2: stacked loops of AI ============
export const stackedLoops = () => (ctx, t, s) => {
  const tk = [K(s, 'l1', 1), K(s, 'l2', 5), K(s, 'l3', 10), K(s, 'l4', 14)];
  sky(ctx, t, { stars: .5 });
  const cx = W * .36, cy = H / 2;
  const rings = [
    { r: 400, sp: .16, top: 'training compute', bot: '× 4–5 every year' },
    { r: 290, sp: .27, top: 'same answer, cost', bot: '÷ 40 in a year' },
    { r: 185, sp: .45, top: 'task length', bot: '× 2 every ~7 months' },
    { r: 85, sp: .9, top: 'AI writes code', bot: 'for the next AI' },
  ];
  rings.forEach((R, i) => {
    const a = eout(lin(tk[i], tk[i] + 1, t)); if (a <= 0) return;
    const col = i === 3 ? C.amber : C.cyan;
    ctx.strokeStyle = rgba(col, .3 * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R.r * back(a), 0, 7); ctx.stroke();
    const ang = t * R.sp * (i % 2 ? -1 : 1) + i;
    for (let j = 0; j < (i === 3 ? 1 : 2); j++) { const q = ang + j * Math.PI; addGlow(ctx, cx + Math.cos(q) * R.r, cy + Math.sin(q) * R.r, 40, .8 * a, col, i === 3 ? '#fff0d8' : C.cyanWhite); }
    const ly = 230 + i * 170;
    ctx.strokeStyle = rgba(C.muted, .3 * a); ctx.beginPath(); ctx.moveTo(cx + R.r * .72, cy - R.r * .7 + (i === 3 ? 0 : 0)); ctx.lineTo(1180, ly - 12); ctx.stroke();
    label(ctx, t, tk[i] + .3, 1200, ly, R.top, R.bot, { color: i === 3 ? C.amber : C.cream });
  });
};

// ============ K1: there is no knee (self-similar exponential) ============
// k: cut (start shifting the window back), log (switch to log scale)
export const noKnee = () => (ctx, t, s) => {
  const tCut = K(s, 'cut', 6), tLog = K(s, 'log', s.b - 9);
  sky(ctx, t, { stars: .3 });
  const x0 = 260, x1 = 1600, y0 = 880, y1 = 170, L = 20; // window length in years
  // end year slides back in steps of 5 years, each step eased
  const steps = Math.max(0, (t - tCut) / 2.6), whole = Math.floor(steps), frac = eio(clamp((steps - whole) / .55));
  const end = 2026 - 5 * (whole + frac) * (t > tCut ? 1 : 0);
  const lg = eio(lin(tLog, tLog + 2.2, t));
  const T = 2; // doubling time in years (illustrative)
  const f = (yr) => { const v = Math.pow(2, (yr - end) / T); const vl = 1 + (yr - end) / (L * 1.0); return mix(v, clamp(vl), lg); };
  const pts = samples((yr) => [mix(x0, x1, (yr - (end - L)) / L), y0 - f(yr) * (y0 - y1)], end - L, end, 200);
  grid(ctx, x0, y1, x1, y0, 10, 6, .06);
  const draw = eio(lin(s.a + .3, s.a + 2.6, t));
  glowLine(ctx, pts, draw, { width: 5, glowW: 26 });
  for (let y = Math.ceil((end - L) / 5) * 5; y <= end; y += 5) {
    const x = mix(x0, x1, (y - (end - L)) / L); text(ctx, String(y), x, y0 + 46, { size: 30, font: 'Instrument Serif', color: C.muted, align: 'center', alpha: .85 * draw });
  }
  // "now" marker always at the bend (right end)
  const na = lin(s.a + 2.2, s.a + 3, t);
  ctx.strokeStyle = rgba(C.amber, .7 * na); ctx.setLineDash([6, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, y0); ctx.lineTo(x1, y1 - 30); ctx.stroke(); ctx.setLineDash([]);
  text(ctx, 'NOW?', x1, y1 - 50, { size: 22, weight: 600, color: C.amber, align: 'center', alpha: na, spacing: 6 });
  text(ctx, 'every point on an exponential looks like this', W / 2, H - 50, { size: 22, color: C.muted, align: 'center', alpha: lin(tCut + 2, tCut + 3, t) * (1 - lg) });
  if (lg > 0) label(ctx, t, tLog + 1.6, x0 + 30, y1 + 20, 'same curve, log scale', 'no bend anywhere', {});
};

// ============ St1: the S-curve ============
export const sCurve = () => (ctx, t, s) => {
  const tS = K(s, 's', 4);
  sky(ctx, t, { stars: .4 });
  const x0 = 260, x1 = 1660, y0 = 880, y1 = 200;
  const bend = eio(lin(tS, tS + 2.5, t));
  const f = (v) => { const e = (Math.pow(2, v * 9) - 1) / 511; const lgs = 1 / (1 + Math.exp(-(v - .62) * 12)); return mix(e, lgs, bend); };
  const pts = samples((v) => [mix(x0, x1, v), y0 - f(v) * (y0 - y1)], 0, 1, 160);
  grid(ctx, x0, y1, x1, y0, 14, 7, .06);
  glowLine(ctx, pts, eio(lin(s.a + .3, s.a + 2.6, t)), { width: 5, glowW: 24 });
  // the top hides in fog: nobody knows where it flattens
  fog(ctx, t, { y0: .1, y1: .35, amt: 2.4 * bend, hex: '#9ad0e6' });
  label(ctx, t, tS + 2.2, x1, y1 - 40, 'where is the top?', '', { align: 'right' });
};

// ============ F1: doubling lights over the city map (on top of the p10 plate) ============
export function doublingLights(ctx, t, t0, step, { cx = W / 2, cy = H / 2, seed = 3, n = 11 } = {}) {
  const r = prng(seed), P = [];
  for (let i = 0; i < 1100; i++) { const a = r() * 7, d = Math.pow(r(), .7) * 900; P.push([cx + Math.cos(a) * d * 1.3, cy + Math.sin(a) * d * .75]); }
  const k = Math.max(0, (t - t0) / step), lit = Math.min(P.length, Math.round(Math.pow(2, k)) - 1);
  for (let i = 0; i < P.length; i++) {
    if (i >= lit) break;
    const born = t0 + Math.log2(i + 1) * step, a = eout(lin(born, born + .4, t));
    addGlow(ctx, P[i][0], P[i][1], 16, .75 * a, C.amber, '#fff3dd');
  }
  return lit;
}

// ============ E4/H2: tripwire ============
export const tripwire = () => (ctx, t, s) => {
  const tX = K(s, 'cross', s.a + 5);
  sky(ctx, t, { stars: .4 });
  const x0 = 260, x1 = 1660, y0 = 900, y1 = 180, lineY = 430;
  const u = eio(lin(s.a + .3, tX + .3, t)) * .86 + .14 * eio(lin(tX + .3, s.b, t));
  const pts = samples((v) => [mix(x0, x1, v), y0 - (Math.pow(2, v * 8) - 1) / 255 * (y0 - y1)], 0, 1, 160);
  ctx.save(); ctx.setLineDash([16, 12]); ctx.strokeStyle = rgba(C.amber, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 - 40, lineY); ctx.lineTo(x1 + 60, lineY); ctx.stroke(); ctx.restore();
  text(ctx, 'DANGER LINE, SET IN ADVANCE', x0 - 40, lineY - 22, { size: 20, weight: 600, color: C.amber, spacing: 5 });
  glowLine(ctx, pts, u, { width: 5, glowW: 24 });
  const fire = lin(tX, tX + .2, t);
  if (fire > 0) {
    const head = pts[Math.max(1, Math.floor(pts.length * u) - 1)];
    const e = eout(lin(tX, tX + 1.4, t));
    ctx.strokeStyle = rgba(C.amber, .9 * (1 - .5 * e)); ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(head[0], head[1], 40 + i * 26 + e * 30, 0, 7); ctx.stroke(); }
    addGlow(ctx, head[0], head[1], 260, .5 * Math.exp(-(t - tX) * 1.5) + .2, C.amber, '#fff3dd');
    label(ctx, t, tX + .6, head[0] - 60, head[1] + 120, 'safeguards', 'on first', { align: 'right', color: C.amber });
  }
};

// ============ P3: protein folds, then the world lights up ============
export const proteinMap = () => (ctx, t, s) => {
  const tF = K(s, 'fold', 2), tW = K(s, 'world', s.b - 7);
  sky(ctx, t, { stars: .35 });
  const N = 120, r = prng(21), f = eio(lin(tF, tF + 4, t)), rot = t * .35, wo = eio(lin(tW, tW + 1.2, t));
  const cx = W / 2 - wo * 500, cy = H / 2;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const v = i / N, sx = mix(-800, 800, v), sy = 40 * Math.sin(v * 9);
    const a = v * 22, hx = 150 * Math.cos(a) + 60 * Math.sin(v * 7), hy = mix(-260, 260, v) + 30 * Math.sin(a * .5), hz = 150 * Math.sin(a);
    const x = mix(sx, hx, f), y = mix(sy, hy, f), z = mix(0, hz, f);
    const X = x * Math.cos(rot) - z * Math.sin(rot), Z = x * Math.sin(rot) + z * Math.cos(rot);
    pts.push([cx + X, cy + y, Z]);
  }
  for (let i = 1; i < N; i++) { const d = (pts[i][2] + 200) / 400; ctx.strokeStyle = rgba(i % 17 < 9 ? C.cyan : C.amber, .35 + .5 * clamp(d)); ctx.lineWidth = 6 + 6 * clamp(d); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
  label(ctx, t, tF + 3, cx, cy + 360, 'one protein', 'years of lab work, once', { align: 'center' });
  if (wo > 0) { // a dotted world, researchers lighting up
    const gx = W * .72, gy = H / 2, R = 330, rr = prng(4);
    ctx.strokeStyle = rgba(C.cyan, .25 * wo); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(gx, gy, R, 0, 7); ctx.stroke();
    for (let i = 0; i < 520; i++) {
      const lat = Math.asin(rr() * 2 - 1), lon = rr() * 7 + t * .15, x = Math.cos(lat) * Math.sin(lon), z = Math.cos(lat) * Math.cos(lon);
      if (z < 0) continue; const born = tW + .5 + rr() * 4.5;
      addGlow(ctx, gx + x * R, gy - Math.sin(lat) * R, 10, .8 * lin(born, born + .4, t) * (.4 + .6 * z), C.amber, '#fff3dd');
    }
    label(ctx, t, tW + 2.5, gx, gy + R + 70, '2 million+ researchers', '190 countries', { align: 'center' });
  }
};

// ============ Share: Pakistan imports bars (overlay on a plate) ============
export function importBars(ctx, t, t0) {
  const a = eout(lin(t0, t0 + .8, t)); if (a <= 0) return;
  const bx = 1250, by = 860, h1 = 210 * eout(lin(t0 + .4, t0 + 1.4, t)), h2 = 420 * eout(lin(t0 + 1.2, t0 + 2.4, t));
  ctx.fillStyle = `rgba(7,9,24,${.55 * a})`; ctx.fillRect(bx - 70, by - 560, 560, 680);
  ctx.fillStyle = rgba(C.muted, .7 * a); ctx.fillRect(bx, by - h1, 150, h1);
  ctx.fillStyle = rgba(C.amber, .9 * a); ctx.fillRect(bx + 230, by - h2, 150, h2); addGlow(ctx, bx + 305, by - h2, 140, .4 * a, C.amber, '#fff3dd');
  text(ctx, '2023', bx + 75, by + 44, { size: 30, font: 'Instrument Serif', color: C.muted, align: 'center', alpha: a });
  text(ctx, '2024', bx + 305, by + 44, { size: 30, font: 'Instrument Serif', color: C.cream, align: 'center', alpha: a });
  label(ctx, t, t0 + 2.2, bx + 305, by - h2 - 80, 'solar panels imported', '17 GW', { align: 'center', color: C.amber });
  text(ctx, 'Ember, 2025', bx + 420, by + 100, { size: 18, color: C.muted, align: 'right', alpha: a * .8 });
}

// ============ title card ============
export const title = (main = 'The Curve', sub = 'you can’t see') => (ctx, t, s) => {
  sky(ctx, t, { stars: .7 });
  const a = eout(lin(s.a + .2, s.a + 1.4, t)) * (1 - lin(s.b - 1, s.b, t));
  const pts = samples((v) => [mix(360, 1560, v), 760 - (Math.pow(2, v * 7) - 1) / 127 * 520], 0, 1, 120);
  glowLine(ctx, pts, eio(lin(s.a, s.a + 2.4, t)), { width: 3, glowW: 18, alpha: .8 });
  text(ctx, main, W / 2, H / 2 + 40, { size: 150, font: 'Instrument Serif', align: 'center', alpha: a });
  text(ctx, sub.toUpperCase(), W / 2, H / 2 + 110, { size: 24, weight: 600, color: C.muted, align: 'center', alpha: a, spacing: 10 });
};

// ============ two rates: how fast is it doubling, how fast are we ============
export const twoRates = () => (ctx, t, s) => {
  const tU = K(s, 'us', 2.5);
  sky(ctx, t, { stars: .4 });
  const x0 = 300, x1 = 1620, y0 = 860, y1 = 200;
  const it = samples((v) => [mix(x0, x1, v), y0 - (Math.pow(2, v * 8) - 1) / 255 * (y0 - y1)], 0, 1, 140);
  const us = samples((v) => [mix(x0, x1, v), y0 - (Math.pow(2, v * 3) - 1) / 7 * (y0 - y1) * .35], 0, 1, 140);
  glowLine(ctx, it, eio(lin(s.a + .2, s.a + 2.2, t)), { width: 5, glowW: 24 });
  glowLine(ctx, us, eio(lin(tU, tU + 2.2, t)), { color: C.amber, width: 5, glowW: 20 });
  label(ctx, t, s.a + 1.8, x1 - 30, y1 + 30, 'how fast it doubles', '', { align: 'right' });
  label(ctx, t, tU + 1.8, x1, y0 - 300, 'how fast we do', '', { align: 'right', color: C.amber });
};
