// Film 72 · THE GROUND LINE — the explainer stage (owned by the lead; builders import as X, never edit — wishes go in the report).
//
// The idea: the Leitbild's slope (thumbnail A2) flattens into ONE cream line across the night: THE GROUND LINE. Above it is "out here"
// (the night sky, people, lanterns, the glass room, the vignettes of your life); below it is "down there" (the night earth, and wherever the
// film needs it, the ground is CUT OPEN into a section: strata, the shaft, the rooms, the concrete door). Everything the film explains is
// built on the line, under it, or in the sky above it: THE LIST floats in the sky, the bunker clock lies under a section, floor plans are
// drawings on the night, the evidence board hangs over the line. The film's two halves are literally the two sides of that line
// (the end: "Out here. Not down there." · "On both sides of that door").
// The line is a CARRIER, never a road: it lifts back into the slope (the anchors), opens into a section, folds into a plan's wall; the view
// follows it to push in, tilt down into the earth or up into the sky. It is never a left → right ride with stations (films 65 / 66).
//
// Coordinates: "sheet units" = screen px at view { x: 960, y: 540, s: 1 } (V0). The ground line sits at y LINE_Y (600).
//   viewPath(t, [[t, { x, y, s }], …])  monotone cubic through keys (log scale) · inView(ctx, v, fn) · toScreen · toSheet · layerView (parallax)
//   ground(ctx, t, v, o)   the night sky + stars + pool of light, the earth below the line (o.earth 0..1), the cut (o.cut) and the line (o.line)
//   section(ctx, t, x0, x1, y, depth, u, o)   the cut-open earth face (strata draw in with u) · groundLine(ctx, x0, x1, y, s, o)
//   drawPath, lightLine, label, big, dateTag, bar, arrow (as film 73)
// Colour code: lib/f72_kit.mjs header. Nothing important below screen y 880 (subtitles).
import * as E from './f10_editorial.mjs';
import * as F from './f72_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, rad, lin, prng } = E;
const { GOLD, CREAM, COOL, SOIL } = F;
export const LINE_Y = 600;
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
// ground(ctx, t, v, o): the night sky (the same gradient as the Leitbild's sky, so world and stage meet without a seam), sparse faint stars with
// a tiny parallax, a soft indigo pool of light where the eye should be (o.lx, o.ly sheet units; o.pool 0..1); then the EARTH below the line
// (o.earth 0..1, default 1; o.lineY, default LINE_Y) with faint strata, the CUT (o.cut = { x0, x1, depth, u }) and the cream LINE (o.line 0..1).
export function ground(ctx, t, v, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, mixHex(P.night1, P.ind0, .55)]]); ctx.fillRect(0, 0, W, H);
  const sv = layerView(v, .06), [sx, sy] = toScreen(sv, 0, 0);
  ctx.translate(((sx % W) + W) % W - W, ((sy % H) + H) % H - H);
  for (const dx of [0, W]) for (const dy of [0, H]) E.stars(ctx, 721, 70, t, [dx, dy, W, H], .45 * (o.stars ?? 1));
  ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const [lx, ly] = toScreen(v, o.lx ?? v.x, o.ly ?? v.y - 40);
  ctx.fillStyle = rad(ctx, lx, ly, 980, [[0, rgba(P.ind1, .6 * (o.pool ?? 1))], [1, rgba(P.ind1, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const ea = clamp(o.earth ?? 1), ly0 = o.lineY ?? LINE_Y;
  if (ea > 0) inView(ctx, v, (s) => {
    const [x0] = toSheet(v, -40, 0), [x1] = toSheet(v, W + 40, 0), [, yb] = toSheet(v, 0, H + 40);
    if (yb <= ly0) return;
    ctx.save(); ctx.globalAlpha *= ea; earth(ctx, t, x0, x1, ly0, yb, s); ctx.restore();
    if (o.cut) section(ctx, t, o.cut.x0, o.cut.x1, ly0, o.cut.depth ?? 420, o.cut.u ?? 1, { s, a: ea, ...o.cut });
  });
  if ((o.line ?? 1) > 0) inView(ctx, v, (s) => { const [x0] = toSheet(v, -40, 0), [x1] = toSheet(v, W + 40, 0); groundLine(ctx, x0, x1, ly0, s, { a: o.line ?? 1, cut: o.cut }); });
}
// the night earth below the line: a dark body, a slightly lighter top band, faint strata hairlines (world-fixed, so they parallax with the view)
export function earth(ctx, t, x0, x1, y, yb, s = 1) {
  ctx.fillStyle = lin(ctx, 0, y, 0, y + 520, [[0, SOIL.top], [.18, SOIL.body], [1, SOIL.deep]]); ctx.fillRect(x0, y, x1 - x0, yb - y);
  ctx.strokeStyle = rgba(SOIL.strata, .22); ctx.lineWidth = 1.2 / s; ctx.beginPath();
  for (let k = 1; k < 7; k++) { const yy = y + k * k * 14 + 22; if (yy > yb) break; const a0 = Math.floor(x0 / 160) * 160;
    for (let x = a0; x <= x1 + 160; x += 160) { const y1 = yy + Math.sin(x * .004 + k) * (5 + 2 * k) + Math.sin(x * .011 + k * 2) * 3, y2 = yy + Math.sin((x + 160) * .004 + k) * (5 + 2 * k) + Math.sin((x + 160) * .011 + k * 2) * 3; if (x === a0) ctx.moveTo(x, y1); ctx.lineTo(x + 160, y2); } }
  ctx.stroke();
}
// section(ctx, t, x0, x1, y, depth, u, o): the ground CUT OPEN between x0 and x1, down to y + depth: the cut face is lighter (we look into the
// earth), strata bands draw in from the line downwards with u, specks of stone; a cream outline (the cut edges) draws with u. o.s, o.a
export function section(ctx, t, x0, x1, y, depth, u, o = {}) {
  u = clamp(u); if (u <= 0) return; const s = o.s ?? 1, k = sineIO(u), d = depth * k;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = lin(ctx, 0, y, 0, y + depth, [[0, mixHex(SOIL.face, SOIL.strata, .35)], [1, SOIL.face]]); ctx.fillRect(x0, y, x1 - x0, d);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y, x1 - x0, d); ctx.clip();
  const r = prng(o.seed ?? 7211);
  for (let i = 0; i < 6; i++) { const yy = y + depth * (i + 1) / 7 + (r() - .5) * 18;
    ctx.fillStyle = rgba(i % 2 ? SOIL.strata : SOIL.body, .35); ctx.beginPath(); ctx.moveTo(x0, yy);
    for (let x = x0; x <= x1 + 40; x += 40) ctx.lineTo(x, yy + Math.sin(x * .006 + i * 1.7) * 7); ctx.lineTo(x1, yy + 30); ctx.lineTo(x0, yy + 30); ctx.fill(); }
  ctx.fillStyle = rgba(SOIL.speck, .5); ctx.beginPath(); const n = Math.min(400, Math.round((x1 - x0) * depth / 900));
  for (let i = 0; i < n; i++) { const px = x0 + r() * (x1 - x0), py = y + r() * depth, rr = 1 + r() * 2.2; ctx.moveTo(px + rr, py); ctx.arc(px, py, rr, 0, Math.PI * 2); } ctx.fill();
  ctx.restore();
  drawPath(ctx, [[x0, y], [x0, y + d], [x1, y + d], [x1, y]], k, { col: rgba(CREAM, .6), w: 1.6 / s, dash: [8 / s, 6 / s] });
  ctx.restore();
}
// THE GROUND LINE: a cream line with a faint warm glow; o.cut leaves the line intact (the section hangs under it), o.u draws it from o.from
export function groundLine(ctx, x0, x1, y, s = 1, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return;
  const m = o.from ?? (x0 + x1) / 2, xa = lerp(m, x0, u), xb = lerp(m, x1, u);
  drawPath(ctx, [[xa, y], [xb, y]], 1, { col: rgba(CREAM, .78 * a), w: 2.4 / s, glow: 6 / s, glowCol: GOLD.line });
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
// a bar (dataviz: thin, 4 px rounded data end, anchored to the baseline y; grows to h over u). o.col 'gold' | 'cool' | 'concrete' | 'cream'
export function bar(ctx, x, y, w, h, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const hh = h * expoOut(u), c = { gold: GOLD.body, cool: COOL.body, concrete: F.CONCRETE.lit, cream: CREAM }[o.col ?? 'gold'];
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
