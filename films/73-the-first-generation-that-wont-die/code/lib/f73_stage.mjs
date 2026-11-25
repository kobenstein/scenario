// Film 73 · THE LIFELINE — the explainer stage (owned by the lead; builders import as X, never edit — wishes go in the report).
//
// The idea: the dash on the headstone ("1985 –") is a life. Pulled out of the stone it becomes THE LIFELINE: one line of gold light on
// the night ground. Everything the film explains is built on it, out of it, or hangs from it: years are ticks on it (2032 near, 2459 at
// the far end), an end tick is a death, a grey-violet fading end is old age, an open end (no tick, the light runs on) is "no end date",
// a marriage is two rings joined by a stretch of line, careers are segments, an inheritance is a hand-off between two lines, power is a
// line that steps up into a ledge and stays there, a survey is a field of dots that hang from it. THE ANSWER (F.answer) is a short
// piece of the same line with NO and YES at its ends.
// The line is a CARRIER, never a road: it bends, splits, loops, steps up, lifts off; the view follows it to push in or pull back.
// It never becomes a left → right ride with stations (that was film 66 / 65); a new place comes by a morph, not by travelling.
//
// Coordinates: "sheet units" = screen px at view { x: 960, y: 540, s: 1 } (V0). The default line sits at y LINE_Y (700).
//   viewPath(t, [[t, { x, y, s }], …])  monotone cubic through keys (log scale), like film 69's plan sheet
//   inView(ctx, v, fn)  draw in sheet units · toScreen(v, x, y) · layerView(v, d) the view for a parallax layer at depth d (0 far, 1 focus)
//   ground(ctx, t, v, o)  the night ground: gradient + sparse faint stars (parallax .06) + a soft indigo light pool at o.lx/o.ly (sheet)
//   lifeline(ctx, t, x0, x1, y, o)  the gold line (see below) · tick, yearTag, label, big, dateTag, lightLine, drawPath, bar, arrow
// Colour code: lib/f73_kit.mjs header. Nothing important below screen y 880 (subtitles).
import * as E from './f10_editorial.mjs';
import * as F from './f73_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, rad, lin } = E;
const { GOLD, CREAM, COOL } = F;
export const AGE = F.AGE;   // grey-violet: decline, old age (never red)
export const LINE_Y = 700;
export const V0 = { x: W / 2, y: H / 2, s: 1 };

// ------------------------------------------------------------------------------------------------ the view
export function viewPath(t, K) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, v]) => [v.x, v.y, Math.log(v.s)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return { x: out[0], y: out[1], s: Math.exp(out[2]) };
}
export function inView(ctx, v, fn) { ctx.save(); ctx.setTransform(v.s, 0, 0, v.s, W / 2 - v.x * v.s, H / 2 - v.y * v.s); fn(v.s); ctx.restore(); }
export const toScreen = (v, x, y) => [W / 2 + (x - v.x) * v.s, H / 2 + (y - v.y) * v.s];
export const toSheet = (v, sx, sy) => [v.x + (sx - W / 2) / v.s, v.y + (sy - H / 2) / v.s];
// parallax: a layer at depth d (1 = the focus plane, < 1 farther) moves and zooms less
export const layerView = (v, d) => ({ x: W / 2 + (v.x - W / 2) * d, y: H / 2 + (v.y - H / 2) * d, s: Math.pow(v.s, d) });

// ------------------------------------------------------------------------------------------------ the ground
// night gradient (the same as the Leitbild sky, so the stone world and the stage meet without a seam), sparse faint stars that drift
// with a tiny parallax, a soft indigo pool of light where the eye should be (o.lx, o.ly in sheet units; o.pool 0..1)
export function ground(ctx, t, v, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, mixHex(P.night1, P.ind0, .55)]]); ctx.fillRect(0, 0, W, H);
  const sv = layerView(v, .06), [sx, sy] = toScreen(sv, 0, 0);
  ctx.translate(((sx % W) + W) % W - W, ((sy % H) + H) % H - H);
  for (const dx of [0, W]) for (const dy of [0, H]) E.stars(ctx, 731, 70, t, [dx, dy, W, H], .45 * (o.stars ?? 1));
  ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const [lx, ly] = toScreen(v, o.lx ?? v.x, o.ly ?? v.y - 40);
  ctx.fillStyle = rad(ctx, lx, ly, 980, [[0, rgba(P.ind1, .6 * (o.pool ?? 1))], [1, rgba(P.ind1, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ lines
// a partial polyline: the first u (0..1, by length) of pts; returns the head point. o: col, w, a, dash, glow (blur px, 0 = none), cap
export function drawPath(ctx, pts, u, o = {}) {
  if (u <= 0 || pts.length < 2) return null;
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let rem = tot * clamp(u), hx = pts[0][0], hy = pts[0][1];
  ctx.save(); ctx.strokeStyle = o.col ?? CREAM; ctx.globalAlpha *= o.a ?? 1; ctx.lineWidth = o.w ?? 2; ctx.lineCap = o.cap ?? 'round'; ctx.lineJoin = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  if (o.glow > .5) {   // a tiny shadowBlur makes Skia draw a hard, alpha-ignoring shadow copy: no glow below .5 px
    ctx.shadowColor = rgba(o.glowCol ?? GOLD.halo, .7); ctx.shadowBlur = o.glow; }
  ctx.beginPath(); ctx.moveTo(hx, hy);
  for (let i = 1; i < pts.length && rem > 1e-6; i++) { const f = Math.min(1, rem / Math.max(1e-6, L[i - 1])); hx = lerp(pts[i - 1][0], pts[i][0], f); hy = lerp(pts[i - 1][1], pts[i][1], f); ctx.lineTo(hx, hy); rem -= L[i - 1]; }
  ctx.stroke(); ctx.restore(); ctx.beginPath();   // the path is not part of save/restore: leave none behind for a later stroke()
  return [hx, hy];
}
// the light line of film 69 (cream with a warm glow), kept for builders
export const lightLine = (ctx, pts, u, o = {}) => drawPath(ctx, pts, u, { col: o.col ?? rgba(CREAM, o.a ?? .85), w: o.w ?? 3, dash: o.dash, glow: o.glow === false ? 0 : (o.blur ?? 10), glowCol: o.glowCol });

// THE LIFELINE from x0 to x1 at y (sheet units; s = the view scale, so the line keeps a constant screen width).
// o: u 0..1 drawn from x0 (or from o.from: 'centre' | an x: grows both ways from there) · w screen px (default 4) · a alpha
//    age = x where old age starts: from there the gold cools into AGE grey-violet and thins (o.ageU 0..1 how much of it is grey;
//          0 = all gold again: "no more aging") · end 0..1 the end tick at x1 (a cream vertical bar; o.lift 0..1 lifts it off and away)
//    open 0..1: the line runs on past x1 to o.openTo (no end date), fading softly at the far end · spark (the bright head while drawing)
//    col: 'gold' | 'cool' (the copy) | 'cream' · glow 0..1
export function lifeline(ctx, t, x0, x1, y, s = 1, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const w = (o.w ?? 5.5) / s, a = o.a ?? 1, cool = o.col === 'cool', cream = o.col === 'cream';
  const body = cool ? COOL.body : cream ? CREAM : GOLD.body, core = cool ? COOL.core : GOLD.core, hl = cool ? COOL.halo : GOLD.halo;
  const open = clamp(o.open ?? 0), xEnd = lerp(x1, o.openTo ?? x1 + 1400, sineIO(open));
  let xa = x0, xb = lerp(x0, xEnd, u);
  if (o.from === 'centre' || typeof o.from === 'number') { const m = typeof o.from === 'number' ? o.from : (x0 + xEnd) / 2; xa = lerp(m, x0, u); xb = lerp(m, xEnd, u); }
  const ageX = o.age ?? 1e9, ageU = clamp(o.ageU ?? 1);
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  // glow under the line
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(hl, .26 * (o.glow ?? 1)); ctx.lineWidth = w * 5; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(Math.min(xb, ageX + (xb - ageX) * (1 - ageU)), y); ctx.stroke(); ctx.restore();
  const g = ctx.createLinearGradient(xa, 0, Math.max(xa + 1, xb), 0);
  const fadeTo = open > 0 ? xEnd : 1e9;
  const stop = (x) => clamp((x - xa) / Math.max(1, xb - xa));
  g.addColorStop(0, body);
  if (ageX < xb && ageU > 0) { g.addColorStop(stop(ageX), body); g.addColorStop(stop(lerp(ageX, xb, .55)), mixHex(body, AGE.line, ageU)); g.addColorStop(1, mixHex(body, AGE.deep, ageU)); }
  else if (open > 0 && xb > x1) { g.addColorStop(stop(x1 + (xEnd - x1) * .55), body); g.addColorStop(1, rgba(body, 0)); }
  else g.addColorStop(1, body);
  ctx.strokeStyle = g; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.stroke();
  // the thinning of old age: a darker overlay that narrows the line's end
  if (ageX < xb && ageU > 0) { ctx.strokeStyle = rgba(P.night1, .55 * ageU); ctx.lineWidth = w * .45; ctx.beginPath(); ctx.moveTo(lerp(ageX, xb, .35), y - w * .42); ctx.lineTo(xb, y - w * .42); ctx.moveTo(lerp(ageX, xb, .35), y + w * .42); ctx.lineTo(xb, y + w * .42); ctx.stroke(); }
  ctx.strokeStyle = rgba(core, .9); ctx.lineWidth = w * .4; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(Math.min(xb, ageX), y); ctx.stroke();
  if (u < 1 && o.spark !== false) halo(ctx, xb, y, 40 / s, .7 * a, hl, core);
  // the end tick (a death) at x1; lift: it rises, tilts and thins away (never a cross, never red)
  const end = clamp(o.end ?? 0), lift = clamp(o.lift ?? 0);
  if (end > 0 && xb >= x1 - 1 && lift < 1) {
    const th = 34 / s, ly = -expoIn(lift) * 160 / s, k = 1 - lift;
    ctx.save(); ctx.translate(x1, y + ly); ctx.rotate(lift * .5); ctx.globalAlpha *= end * k;
    ctx.fillStyle = mixHex(CREAM, AGE.text, ageU * .5); ctx.fillRect(-w * .7, -th * expoOut(end), w * 1.4, th * expoOut(end) * 2); ctx.restore();
  }
  ctx.restore();
  return { xa, xb };
}
// a year tick on a line: a short cream tick + the year in serif above (o.size, o.gold 0..1, o.below puts it under the line)
export function yearTag(ctx, txt, x, y, u, s = 1, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), th = 16 / s, size = (o.size ?? 44) / s;
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1);
  ctx.fillStyle = mixHex(CREAM, GOLD.body, o.gold ?? 0); ctx.fillRect(x - 1.5 / s, y - th * k, 3 / s, th * k * 2);
  ctx.restore();
  F.goldText(ctx, [[txt, o.gold ?? 0]], x, o.below ? y + th + size * 1.05 : y - th - size * .25, size, F.rise(u), { serif: true, align: 'center', glow: (o.gold ?? 0) > .5 });
}
// label (Inter caps, ≥ 22 px on screen) that wipes up from its mask · big (Instrument Serif statement with a warm glow)
export function label(ctx, txt, x, y, u, o = {}) {
  F.goldText(ctx, [[txt, o.gold ?? 0]], x, y, o.size ?? 26, F.rise(clamp(u)), { serif: false, weight: o.weight ?? 700, spacing: o.spacing ?? .12, align: o.align ?? 'center', col: o.col ?? CREAM });
}
export function big(ctx, txt, x, y, size, u, o = {}) {
  F.goldText(ctx, [[txt, o.gold ?? .8]], x, y, size, F.rise(clamp(u)), { serif: true, align: o.align ?? 'center', glow: o.glow ?? true, col: o.col });
}
// a small date tag: a cream hairline pill, text 22 px (film 69)
export function dateTag(ctx, txt, x, y, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.font = '600 22px Inter'; const w = ctx.measureText(txt).width * 1.08 + 44, k = expoOut(clamp(u)), h = 40;
  ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y + (1 - k) * 14);
  ctx.fillStyle = rgba(P.night0, .75); ctx.strokeStyle = rgba(o.gold ? GOLD.line : CREAM, .8); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  E.glowText(ctx, txt, 0, 8, { size: 22, weight: 600, align: 'center', col: o.gold ? GOLD.text : CREAM, glow: false, spacing: .08 });
  ctx.restore();
}
// a bar (dataviz: thin, 4 px rounded data end, anchored to the baseline y; grows to h over u). o.col 'gold' | 'cool' | 'age' | 'cream'
export function bar(ctx, x, y, w, h, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const hh = h * expoOut(u), c = { gold: GOLD.body, cool: COOL.body, age: AGE.line, cream: CREAM }[o.col ?? 'gold'];
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = c;
  if (o.horizontal) { ctx.beginPath(); ctx.roundRect(x, y - w / 2, hh, w, [0, 4, 4, 0]); ctx.fill(); }
  else { ctx.beginPath(); ctx.roundRect(x - w / 2, y - hh, w, hh, [4, 4, 0, 0]); ctx.fill(); }
  ctx.restore();
}
// a thin arrow of light along pts (u draws it), with a small open head
export function arrow(ctx, pts, u, o = {}) {
  const hd = drawPath(ctx, pts, u, { col: o.col ?? CREAM, w: o.w ?? 2, a: o.a, glow: o.glow ?? 6 }); if (!hd || u < .15) return;
  const [ax, ay] = pts[pts.length - 2] ?? pts[0], ang = Math.atan2(hd[1] - ay, hd[0] - ax), L = o.head ?? 14;
  drawPath(ctx, [[hd[0] - Math.cos(ang - .5) * L, hd[1] - Math.sin(ang - .5) * L], hd, [hd[0] - Math.cos(ang + .5) * L, hd[1] - Math.sin(ang + .5) * L]], 1, { col: o.col ?? CREAM, w: o.w ?? 2, a: o.a });
}
