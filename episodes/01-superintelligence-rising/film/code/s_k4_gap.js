// "The real problem is a gap between two lines. On one side, what AI can do. On METR's measure, that's been
// doubling every few months. On the other, how well we understand what's going on inside it."
// A large chart: a cyan line (what AI can do) climbs in doubling steps, an amber line (how well we understand it)
// crawls along the bottom; the widening space between them fills with a soft hatched shade.
// Also exports the chunk's shared helpers (fast grainFill, roundRect, italic font).
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out } = L;
const { GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
GlobalFonts.registerFromPath(path.resolve(__dirname, '..', '..', 'fonts', 'InstrumentSerif-Italic.ttf'), 'Instrument Serif Italic');

const T0 = 200.30, T1 = 215.60;

// ---------------------------------------------------------------- shared helpers
// grainFill whose speckle covers only the path's bounding box (much cheaper than a full-frame pass)
const BB = { b: null, p(x, y) { const b = this.b; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; },
  moveTo(x, y) { this.p(x, y); }, lineTo(x, y) { this.p(x, y); }, quadraticCurveTo(a, b, x, y) { this.p(a, b); this.p(x, y); },
  bezierCurveTo(a, b, c, d, x, y) { this.p(a, b); this.p(c, d); this.p(x, y); }, rect(x, y, w, h) { this.p(x, y); this.p(x + w, y + h); },
  arc(x, y, r) { this.p(x - r, y - r); this.p(x + r, y + r); }, ellipse(x, y, rx, ry) { const r = Math.max(rx, ry); this.p(x - r, y - r); this.p(x + r, y + r); },
  arcTo(a, b, x, y) { this.p(a, b); this.p(x, y); }, closePath() {}, beginPath() {} };
const PAT = new WeakMap();
function pat(ctx) { let p = PAT.get(ctx); if (!p) { p = ctx.createPattern(L.tex().dark, 'repeat'); PAT.set(ctx, p); } return p; }
function grainFill(ctx, pathFn, fill, grain = 0.5) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    BB.b = [1e9, 1e9, -1e9, -1e9]; pathFn(BB); const b = BB.b;
    ctx.clip(); ctx.globalAlpha *= grain; ctx.fillStyle = pat(ctx);
    const m = ctx.getTransform().invertSelf(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [px, py] of [[0, 0], [W, 0], [0, H], [W, H]]) { const x = m.a * px + m.c * py + m.e, y = m.b * px + m.d * py + m.f; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    x0 = Math.max(x0, b[0] - 2); y0 = Math.max(y0, b[1] - 2); x1 = Math.min(x1, b[2] + 2); y1 = Math.min(y1, b[3] + 2);
    if (x1 > x0 && y1 > y0) ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  ctx.restore();
}
function roundRect(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// soft elliptical glow (normal blending)
function blob(ctx, x, y, rx, ry, col, a, add = false) {
  if (a <= 0) return;
  ctx.save(); if (add) ctx.globalCompositeOperation = 'lighter';
  ctx.translate(x, y); ctx.scale(rx / ry, 1);
  ctx.fillStyle = rad(ctx, 0, 0, 0, ry, [[0, rgba(col, a)], [0.55, rgba(col, a * 0.4)], [1, rgba(col, 0)]]);
  ctx.fillRect(-ry, -ry, 2 * ry, 2 * ry); ctx.restore();
}

// ---------------------------------------------------------------- the chart
const X0 = 190, X1 = 1330, Y0 = 790, YT = 150;
const NDBL = 6;
const capY = u => Y0 - (Y0 - YT) * (Math.pow(2, NDBL * u) - 1) / (Math.pow(2, NDBL) - 1);
const undY = u => Y0 - 92 * Math.pow(u, 1.15) - 7 * Math.sin(u * 9) * u;
const px = u => lerp(X0, X1, u);
const T_AXES = 200.45, T_CAP = [205.45, 210.95], T_DBL = 209.5, T_UND = [212.3, 215.0], T_GAP = 213.0;
const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const R = rng(2004);
const MOTES = Array.from({ length: 60 }, () => [R() * W, R() * H, R(), R()]);

function strokeCurve(ctx, f, u1, col, w, glow) {
  if (u1 <= 0) return;
  const N = Math.max(2, Math.ceil(u1 * 160));
  const p = c => { c.beginPath(); for (let i = 0; i <= N; i++) { const u = (i / N) * u1; i ? c.lineTo(px(u), f(u)) : c.moveTo(px(u), f(u)); } };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'lighter';
  p(ctx); ctx.strokeStyle = rgba(col, 0.10 * glow); ctx.lineWidth = w * 7; ctx.stroke();
  p(ctx); ctx.strokeStyle = rgba(col, 0.22 * glow); ctx.lineWidth = w * 2.8; ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  p(ctx); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
  ctx.restore();
  light(ctx, px(u1), f(u1), 70, col, 0.5 * glow);
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(px(u1), f(u1), w * 0.9, 0, Math.PI * 2); ctx.fill();
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.07, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 0.8, 3) * 7, dy = drift(t, 0.8, 4) * 5;
  // background paper: deep indigo with a cyan bloom high right and a warm one low left
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, '#0a0c26'], [0.6, '#141441'], [1, '#0b0a20']]); ctx.fillRect(0, 0, W, H);
  blob(ctx, 1500 + dx, 180, 900, 520, '#0a6f8c', 0.30);
  blob(ctx, 420 + dx, 900, 900, 380, '#7a3b17', 0.22);
  ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = pat(ctx); ctx.fillRect(0, 0, W, H); ctx.restore();
  // dust motes drifting up
  for (const [x, y, k, s] of MOTES) { const yy = (y - (t - T0) * (8 + 14 * s)) % H, a = 0.12 + 0.18 * Math.sin(t * (0.8 + k) + k * 9); ctx.fillStyle = rgba(C.cream, Math.max(0, a)); ctx.fillRect(x + Math.sin(t * 0.3 + k * 6) * 10, (yy + H) % H, 2, 2); }

  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H / 2 + dy);

  // axes and grid draw themselves in
  const ax = out((t - T_AXES) / 1.2);
  ctx.save(); ctx.lineCap = 'round';
  for (let k = 1; k <= 5; k++) { const y = lerp(Y0, YT, k / 5); ctx.strokeStyle = rgba(C.lav, 0.07 * ax); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X0, y); ctx.lineTo(lerp(X0, X1 + 40, ax), y); ctx.stroke(); }
  ctx.strokeStyle = rgba(C.lav, 0.55); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(lerp(X0, X1 + 60, ax), Y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(X0, lerp(Y0, YT - 50, ax)); ctx.stroke();
  // year ticks
  ctx.font = '22px "Inter Medium"'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.letterSpacing = '3px';
  YEARS.forEach((yr, i) => { const u = i / (YEARS.length - 1), a = ramp(t, T_AXES + 0.3 + u * 0.9, T_AXES + 0.7 + u * 0.9);
    ctx.strokeStyle = rgba(C.lav, 0.5 * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px(u), Y0); ctx.lineTo(px(u), Y0 + 10); ctx.stroke();
    ctx.fillStyle = rgba(C.lav, 0.75 * a); ctx.fillText(yr, px(u), Y0 + 20); });
  ctx.restore();

  // the two starting points glow on "two lines"
  const two = ramp(t, 202.9, 203.5), pulse = Math.exp(-Math.max(0, t - 203.3) * 2.5) * (t > 203.3 ? 1 : 0);
  const capU = ease3((t - T_CAP[0]) / (T_CAP[1] - T_CAP[0]));
  const undU = ease3((t - T_UND[0]) / (T_UND[1] - T_UND[0]));

  // the gap: hatched, softly shaded, growing as the understanding line is drawn
  const gapU = Math.min(capU, undU), gapA = ramp(t, T_GAP, T_GAP + 1.2);
  if (gapU > 0.01 && gapA > 0) {
    const N = 120, reg = c => { for (let i = 0; i <= N; i++) { const u = gapU * i / N; i ? c.lineTo(px(u), capY(u)) : c.moveTo(px(u), capY(u)); } for (let i = N; i >= 0; i--) { const u = gapU * i / N; c.lineTo(px(u), undY(u)); } c.closePath(); };
    ctx.save(); ctx.beginPath(); reg(ctx); ctx.clip();
    ctx.globalAlpha = gapA;
    ctx.fillStyle = lin(ctx, 0, YT, 0, Y0, [[0, rgba('#3b6fa0', 0.30)], [1, rgba('#7a5a8a', 0.12)]]); ctx.fillRect(X0, YT - 20, X1 - X0 + 20, Y0 - YT + 20);
    ctx.strokeStyle = rgba(C.lav, 0.28); ctx.lineWidth = 2;
    const off = (t * 14) % 22;
    ctx.beginPath(); for (let x = X0 - 700 + off; x < X1 + 40; x += 22) { ctx.moveTo(x, Y0 + 10); ctx.lineTo(x + 700, YT - 690 + Y0 - YT); } ctx.stroke();
    ctx.restore();
    // "the gap" word sitting in the widest part
    const ga = ramp(t, 214.3, 215.0);
    if (ga > 0) { ctx.save(); ctx.globalAlpha = ga; ctx.font = '64px "Instrument Serif Italic"'; ctx.fillStyle = C.cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(4,4,16,0.9)'; ctx.shadowBlur = 20; ctx.fillText('the gap', px(0.9) - 30, lerp(capY(0.97), undY(0.97), 0.55) - 8 * (1 - out((t - 214.3) / 0.8))); ctx.restore(); }
    // a vertical bracket at the leading edge showing the distance
    const bx = px(gapU) + 26;
    ctx.save(); ctx.globalAlpha = gapA * 0.8; ctx.strokeStyle = C.cream; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(bx - 8, capY(gapU)); ctx.lineTo(bx, capY(gapU)); ctx.lineTo(bx, undY(gapU)); ctx.lineTo(bx - 8, undY(gapU)); ctx.stroke(); ctx.restore();
  }

  // doubling steps: a short dashed riser and "2x" at each doubling the cyan line passes
  for (let k = 1; k <= NDBL; k++) {
    const u = k / NDBL; if (k < 3) continue;
    const tp = Math.max(T_DBL + (k - 3) * 0.12, T_CAP[0] + (T_CAP[1] - T_CAP[0]) * invEase3(u));
    const a = ramp(t, tp, tp + 0.35); if (a <= 0) continue;
    const up = capY((k - 1) / NDBL), yy = capY(u), x = px(u);
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = rgba(C.cyanW, 0.55); ctx.lineWidth = 1.5; ctx.setLineDash([5, 6]);
    ctx.beginPath(); ctx.moveTo(px((k - 1) / NDBL), up); ctx.lineTo(x, up); ctx.lineTo(x, lerp(up, yy, out((t - tp) / 0.4))); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.cyanW; ctx.font = '30px "Inter SemiBold"'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(4,4,16,0.9)'; ctx.shadowBlur = 12;
    ctx.fillText('2×', x - 14, (up + yy) / 2 + 4 * (1 - out((t - tp) / 0.5)));
    ctx.restore();
    light(ctx, x, yy, 60, C.cyan, 0.5 * Math.exp(-Math.max(0, t - tp) * 3));
  }

  // start points
  if (two > 0) {
    for (const [col, y] of [[C.cyan, capY(0)], [C.amber, undY(0)]]) light(ctx, X0, y, 50 + 60 * pulse, col, 0.6 * two);
    ctx.fillStyle = rgba('#ffffff', two); ctx.beginPath(); ctx.arc(X0, Y0, 5, 0, Math.PI * 2); ctx.fill();
  }
  // the two lines
  const breath = 0.85 + 0.15 * Math.sin(t * 2.1);
  strokeCurve(ctx, undY, undU, C.amber, 6, breath);
  strokeCurve(ctx, capY, capU, C.cyan, 6, breath);
  endLabel(ctx, t, 205.62, 'What AI can do', C.cyan, px(1) + 80, capY(1) + 10, ['METR \u00b7 length of tasks', 'AI can finish on its own'], 207.76);
  endLabel(ctx, t, 212.5, 'How well we', C.amber, px(1) + 80, undY(1) - 40, null, 0, 'understand it');

  ctx.restore();

}
// a label at the end of a line: short rule, title (one or two lines), optional small source lines
function endLabel(ctx, t, t0, text, col, x, y, src, ts, text2) {
  const a = ramp(t, t0, t0 + 0.6); if (a <= 0) return;
  const rise = (1 - out((t - t0) / 0.9)) * 12, wipe = out((t - t0) / 0.8);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 30, y + 2 + rise); ctx.lineTo(x - 30 + 50 * wipe, y + 2 + rise); ctx.stroke();
  ctx.shadowColor = 'rgba(4,4,16,0.85)'; ctx.shadowBlur = 18; ctx.textBaseline = 'top';
  ctx.fillStyle = C.cream; ctx.font = '44px "Inter SemiBold"'; ctx.fillText(text, x - 30, y + 18 + rise);
  if (text2) ctx.fillText(text2, x - 30, y + 70 + rise);
  ctx.restore();
  if (src) { const b = ramp(t, ts, ts + 0.6); if (b > 0) { ctx.save(); ctx.globalAlpha = b; ctx.font = '22px "Inter Medium"'; ctx.letterSpacing = '4px'; ctx.fillStyle = C.lav; ctx.textBaseline = 'top';
    src.forEach((l, i) => ctx.fillText(l.toUpperCase(), x - 28, y + 82 + i * 32 + (1 - out((t - ts) / 0.8)) * 8)); ctx.restore(); } }
}
function ease3(x) { x = clamp(x); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
function invEase3(y) { return y < 0.5 ? Math.sqrt(y / 2) : 1 - Math.sqrt((1 - y) * 2) / 2; }

module.exports = { T0, T1, draw, grainFill, roundRect, blob, pat };
