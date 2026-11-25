// Film 69 · builder B2 (c06–c08) · own helpers (BRIEF §5: "an optional lib/bN_*.mjs of your own"). Imports the lead's kit, never edits it.
// THE ENERGY · ONE LAB · THE MINDS: data centre + cables, the coast-line light map (coast lines only: no borders, no flags), chips, the lab,
// the CERN ring, the web, the town of warm windows, the HUD ↔ big disc carrier, the inner B2 plate (c07 → c08), walkers.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f69_kit.mjs';
import * as X from './f69_explain.mjs';
import * as S from './f69_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, prng } = E;
const { GOLD, COOL, CREAM, CREAM2, LAMP, PAPER } = F;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ geometry
export function polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
export function along(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= l || i === pts.length - 1) { const f = clamp(d / Math.max(1e-6, l)); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; }
    d -= l;
  }
  return pts[pts.length - 1];
}
export const lerpPt = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
// a quadratic arc from a to b that bulges by h (perpendicular, up for h > 0)
export function arcPt(a, b, h, k) { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - h; const u = 1 - k; return [u * u * a[0] + 2 * u * k * mx + k * k * b[0], u * u * a[1] + 2 * u * k * my + k * k * b[1]]; }

// ------------------------------------------------------------------------------------------------ the HUD ↔ the big disc (the carrier)
// k 0 = the small HUD (top right, exactly F.kitHud), 1 = the disc big at to = { x, y, r } (screen). The HUD texts sink behind their mask as
// the disc lifts off; the disc itself flies (sineIO) and grows. Hidden in clip windows by kitParts (S.on).
function hudText(ctx, t, T, u) {
  const St = F.kitParts(T, t); if (St.on <= 0 || u <= 0) return;
  const xr = F.HUD.x + F.HUD.r + 10, y0 = F.HUD.y + F.HUD.r + 44;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= St.on;
  if (St.cur >= 0 && St.name > 0) {
    const p = F.KIT.parts[St.cur], st = St.parts[St.cur], n = St.name * u;
    F.goldText(ctx, [[`PART ${St.cur + 1} OF 5`, .9]], xr, y0, 22, F.rise(n), { serif: false, weight: 700, spacing: .06, align: 'right' });
    F.goldText(ctx, [[p.name, 0]], xr, y0 + 32, 22, F.rise(span(n, .2, 1)), { serif: false, weight: 600, spacing: .05, align: 'right', col: CREAM });
    if (st.kind !== 'blank') F.goldText(ctx, [[p.verdict, st.kind === 'half' ? 1 : 0]], xr, y0 + 64, 22, F.rise(clamp(st.u * 1.4) * u), { serif: false, weight: 700, spacing: .1, align: 'right', col: st.kind === 'half' ? GOLD.text : CREAM });
  }
  ctx.restore();
}
export function hudDisc(ctx, t, T, k, to, o = {}) {
  if (k <= 0) { F.kitHud(ctx, t, T, o.parts ? { parts: o.parts } : {}); return null; }
  const St = F.kitParts(T, t), e = sineIO(k), a = St.on; if (a <= 0) return null;
  const x = lerp(F.HUD.x, to.x, e), y = lerp(F.HUD.y, to.y, e), r = lerp(F.HUD.r, to.r, e);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  F.kitDisc(ctx, t, x, y, r, o.parts ?? St.parts, { glow: lerp(.35, o.glow ?? .8, e), stars: 0, loose: { x: x + r * lerp(1.3, 1.32, e), y: y + r * lerp(1.1, 1.06, e), rot: .35 } });
  ctx.restore();
  hudText(ctx, t, T, 1 - span(k, 0, .35));
  return { x, y, r };
}

// ------------------------------------------------------------------------------------------------ the inner B2 plate (c07 → c08)
// THE PLAN big (like S.plateEnergy / plateFour): the disc at PLATE_DISC, piece 4 just turned paper, the minds slot lights. Both sides draw it
// for ±S.SEAM_HALF with the same creep. Phrase: 'And a lab is an empty' (c08 starts there).
export const LAB_PHRASE = 'And a lab is an empty';
export function plateLab(ctx, t, T) {
  const k = S.creep(t, T, LAB_PHRASE), v = { x: W / 2, y: H / 2, s: k }, D = S.PLATE_DISC;
  X.sheet(ctx, t, v, { lx: D.x, ly: D.y });
  X.inView(ctx, v, () => F.kitDisc(ctx, t, D.x, D.y, D.r, S.momentParts(T, t), { glow: .8, stars: 0, loose: { x: D.x + D.r * 1.32, y: D.y + D.r * 1.06, rot: .35 } }));
}

// ------------------------------------------------------------------------------------------------ energy objects
// an AI data centre (flat, side view): x, y = middle of its base, w; long low hall, cooling units on the roof, rows of server lights.
// o.lit 0..1 (servers on), o.rise 0..1 (rises out of its ground line), o.a, o.dashed (an empty slot: only a dashed outline)
export function dataCentre(ctx, t, x, y, w, o = {}) {
  const h = w * .34, a = o.a ?? 1; if (a <= 0 || w <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (o.dashed) {
    const u = clamp(o.u ?? 1);
    ctx.setLineDash([w * .06, w * .045]); ctx.lineDashOffset = -t * w * .03; ctx.strokeStyle = rgba(CREAM, .75 * u); ctx.lineWidth = Math.max(1.2, w * .025);
    ctx.strokeRect(x - w / 2 * u, y - h * u, w * u, h * u); ctx.setLineDash([]); ctx.restore(); return;
  }
  const r = o.rise ?? 1;
  if (r < 1) { ctx.beginPath(); ctx.rect(x - w, y - h * 3, w * 2, h * 3); ctx.clip(); ctx.translate(0, (1 - expoOut(r)) * h * 1.6); }
  const lit = clamp(o.lit ?? 1);
  if (lit > 0) halo(ctx, x, y - h * .5, w * .9, .28 * lit, COOL.halo, COOL.core);
  ctx.fillStyle = mixHex(P.blue1, P.night1, .35);
  for (let k = 0; k < 4; k++) { const ux = x - w * .36 + k * w * .21; ctx.fillRect(ux, y - h - w * .06, w * .13, w * .06); }
  ctx.fillStyle = lin(ctx, x, y - h, x, y, [[0, mixHex(P.blue2, P.night1, .15)], [1, mixHex(P.night1, P.ind1, .45)]]); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.fillStyle = rgba(mixHex(GOLD.line, P.blue1, .5), .45); ctx.fillRect(x - w / 2, y - h, w, Math.max(1, w * .008));
  const cols = 16, rows = 3, cw = w * .9 / cols;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const fl = .75 + .25 * Math.sin(t * (2.1 + (i * 7 + j * 3) % 5 * .4) + i * 1.7 + j);
    ctx.fillStyle = rgba(COOL.body, (.08 + .8 * lit * fl) * (.6 + .4 * ((i + j) % 3 === 0)));
    ctx.fillRect(x - w * .45 + i * cw + cw * .2, y - h * .82 + j * h * .26, cw * .6, h * .12);
  }
  ctx.restore();
}
// a thick power cable (a light line) with gold pulses running along it towards its end; o.w, o.flow 0..1, o.speed
export function cable(ctx, t, pts, u, o = {}) {
  if (u <= 0) return;
  X.lightLine(ctx, pts, u, { col: rgba(mixHex(CREAM, GOLD.line, .4), o.a ?? .8), w: o.w ?? 8, blur: o.blur ?? 12 });
  const fl = o.flow ?? 1; if (fl <= 0) return;
  const L = polyLen(pts) * clamp(u), gap = o.gap ?? 90, sp = o.speed ?? 160;
  for (let d = (t * sp) % gap; d < L; d += gap) { const [px, py] = along(pts, d); halo(ctx, px, py, (o.w ?? 8) * 2.6, .55 * fl, GOLD.halo, GOLD.core); }
}

// ------------------------------------------------------------------------------------------------ the light map (coast lines only)
// lon/lat polylines, simplified by hand (no borders, no flags, no country shapes: only where land meets sea)
const COAST = [
  // Atlantic from Gibraltar round Iberia, France, the Low Countries, Jutland, the Baltic, Finland, Sweden, Norway to the North Cape
  [[-5.6, 36.0], [-6.3, 36.8], [-7.4, 37.2], [-8.9, 37.0], [-8.8, 38.7], [-9.4, 39.4], [-8.7, 41.2], [-8.9, 42.9], [-9.3, 43.0], [-8.0, 43.7], [-5.8, 43.6], [-3.8, 43.5],
    [-1.8, 43.4], [-1.2, 44.6], [-1.2, 46.0], [-2.2, 47.1], [-4.5, 47.8], [-4.7, 48.4], [-3.0, 48.8], [-1.6, 48.6], [-1.9, 49.7], [0.1, 49.4], [1.6, 50.2], [2.5, 51.1],
    [3.8, 51.4], [4.4, 52.2], [4.8, 53.0], [6.9, 53.4], [8.6, 53.9], [8.6, 55.5], [8.2, 56.8], [10.6, 57.7], [10.3, 56.5], [10.9, 56.3], [10.0, 55.0], [11.0, 54.4],
    [12.5, 54.3], [14.2, 53.9], [16.5, 54.5], [18.6, 54.7], [21.0, 55.3], [21.1, 56.5], [21.6, 57.5], [24.1, 57.0], [23.5, 58.3], [24.0, 59.3], [28.0, 59.5], [29.9, 60.0]],
  [[29.6, 60.4], [25.0, 60.2], [22.0, 60.0], [21.4, 61.5], [21.6, 63.2], [25.4, 65.0], [24.1, 65.8], [22.0, 65.6], [21.0, 64.6], [19.0, 63.5], [17.3, 62.4], [17.3, 60.7],
    [18.6, 60.0], [18.9, 59.3], [16.7, 57.9], [16.4, 56.6], [14.3, 55.5], [12.9, 55.4], [12.6, 56.2], [11.9, 57.7], [11.2, 58.9], [10.5, 59.5], [9.6, 59.0], [7.0, 58.0],
    [5.6, 58.9], [5.0, 60.4], [5.0, 61.9], [6.4, 62.6], [8.5, 63.6], [11.3, 64.8], [13.5, 66.6], [15.0, 68.3], [18.9, 69.7], [23.6, 70.7], [25.8, 71.1], [28.5, 70.9], [31.0, 70.3]],
  // the Mediterranean from Gibraltar east to the Aegean
  [[-5.6, 36.0], [-4.4, 36.7], [-2.1, 36.8], [-0.5, 38.3], [0.2, 38.8], [-0.3, 39.5], [0.9, 41.0], [2.2, 41.4], [3.2, 42.0], [3.1, 43.0], [4.0, 43.5], [5.4, 43.2],
    [7.3, 43.7], [8.9, 44.4], [10.3, 43.5], [11.1, 42.4], [12.3, 41.7], [13.6, 41.2], [14.3, 40.8], [15.6, 40.0], [15.7, 38.0], [16.6, 38.4], [17.1, 39.0], [16.6, 39.8],
    [17.2, 40.4], [18.5, 40.1], [18.0, 40.6], [16.9, 41.1], [15.9, 41.9], [14.2, 42.4], [13.6, 43.6], [12.3, 44.5], [12.3, 45.4], [13.7, 45.6], [13.6, 45.0], [14.5, 45.3],
    [15.9, 43.6], [17.4, 43.0], [18.6, 42.4], [19.4, 41.8], [19.5, 40.5], [20.0, 39.6], [21.1, 38.3], [21.7, 36.8], [22.5, 36.4], [23.0, 36.5], [22.8, 37.6], [23.7, 37.9],
    [24.0, 38.2], [22.9, 39.3], [22.6, 40.5], [23.9, 40.7], [25.9, 40.9], [26.4, 40.9]],
  // islands
  [[-5.7, 50.1], [-3.5, 50.4], [-1.0, 50.8], [1.4, 51.2], [1.7, 52.6], [0.2, 53.5], [-0.1, 54.5], [-1.6, 55.6], [-2.8, 56.4], [-1.8, 57.5], [-3.3, 58.6], [-5.0, 58.6],
    [-5.6, 57.5], [-5.8, 56.3], [-5.1, 55.5], [-4.9, 54.8], [-3.3, 54.9], [-3.0, 53.8], [-4.6, 53.3], [-4.2, 52.5], [-5.2, 51.8], [-3.0, 51.4], [-4.5, 51.0], [-5.7, 50.1]],
  [[-6.0, 52.2], [-6.1, 53.3], [-5.6, 54.6], [-6.2, 55.3], [-7.3, 55.4], [-8.5, 54.9], [-10.0, 54.2], [-9.9, 53.4], [-9.3, 52.6], [-10.4, 52.1], [-9.7, 51.5], [-8.2, 51.8], [-6.0, 52.2]],
  [[12.4, 37.8], [13.4, 38.2], [15.6, 38.3], [15.1, 37.3], [15.1, 36.7], [14.3, 37.0], [12.4, 37.8]],
  [[8.4, 39.0], [8.6, 40.9], [9.5, 41.2], [9.8, 40.1], [9.6, 39.2], [8.9, 38.9], [8.4, 39.0]],
  [[9.4, 43.0], [9.5, 42.2], [9.2, 41.4], [8.6, 41.9], [8.6, 42.6], [9.4, 43.0]],
];
const COS = Math.cos(52 * Math.PI / 180);
// map M = { x, y, k } (screen centre at 10°E 52°N, px per degree of latitude) → screen point
export const geo = (M, lon, lat) => [M.x + (lon - 10) * COS * M.k, M.y - (lat - 52) * M.k];
export function coast(ctx, M, u, o = {}) {
  if (u <= 0) return;
  COAST.forEach((line, i) => { const pts = line.map(([lo, la]) => geo(M, lo, la)); X.lightLine(ctx, pts, clamp(u * 1.4 - i * .05), { col: rgba(CREAM, o.a ?? .55), w: o.w ?? 2, blur: 6 }); });
}
// a hydro dam between two hills (tiny glyph), x, y = foot middle, s size
export function damGlyph(ctx, t, x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night1, P.blue1, .45); ctx.beginPath(); ctx.moveTo(x - s * 1.4, y); ctx.quadraticCurveTo(x - s * .9, y - s * 1.1, x - s * .35, y - s * .7); ctx.lineTo(x - s * .35, y); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + s * 1.4, y); ctx.quadraticCurveTo(x + s * .9, y - s * 1.1, x + s * .35, y - s * .7); ctx.lineTo(x + s * .35, y); ctx.fill();
  ctx.fillStyle = mixHex(CREAM, P.blue1, .35); ctx.beginPath(); ctx.moveTo(x - s * .4, y - s * .72); ctx.quadraticCurveTo(x, y - s * .58, x + s * .4, y - s * .72); ctx.lineTo(x + s * .32, y); ctx.lineTo(x - s * .32, y); ctx.fill();
  ctx.fillStyle = rgba(COOL.body, .6 + .2 * Math.sin(t * 3)); for (let k = 0; k < 3; k++) ctx.fillRect(x - s * .2 + k * s * .16, y - s * .45 + ((t * s * 1.2 + k * s * .3) % (s * .4)), s * .06, s * .12);
  ctx.restore();
}
// two cooling towers with a little steam
export function reactorGlyph(ctx, t, x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  for (const dx of [-s * .55, s * .5]) {
    ctx.fillStyle = mixHex(CREAM, P.blue1, .4); ctx.beginPath(); ctx.moveTo(dx - s * .42, y); ctx.quadraticCurveTo(dx - s * .2, y - s * .5, dx - s * .28, y - s); ctx.lineTo(dx + s * .28, y - s);
    ctx.quadraticCurveTo(dx + s * .2, y - s * .5, dx + s * .42, y); ctx.closePath(); ctx.translate(x, 0); ctx.fill(); ctx.translate(-x, 0);
    for (let k = 0; k < 3; k++) { const q = ((t * .35 + k / 3) % 1); ctx.fillStyle = rgba(CREAM, .35 * (1 - q)); ctx.beginPath(); ctx.arc(x + dx + q * s * .5, y - s - q * s * 1.2, s * (.18 + q * .3), 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ chips, rings, lab, web
// an advanced chip (top view): a dark square with a cool die and pins; x, y centre, s side
export function chip(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = mixHex(COOL.line, P.night1, .35); for (let k = 0; k < 5; k++) { const p = -s * .36 + k * s * .18; ctx.fillRect(p - s * .03, -s * .62, s * .06, s * 1.24); ctx.fillRect(-s * .62, p - s * .03, s * 1.24, s * .06); }
  ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * .1); ctx.fill();
  ctx.fillStyle = rgba(COOL.body, .75 + .2 * Math.sin(t * 2 + (o.seed ?? 0))); ctx.beginPath(); ctx.roundRect(-s * .26, -s * .26, s * .52, s * .52, s * .06); ctx.fill();
  ctx.restore();
}
// an ellipse ring lying in the ground (the CERN ring seen at a low angle): x, y centre, rx; o.ry, u draws it on, o.col, o.dash, o.w, o.run (beads)
export function ringPts(x, y, rx, ry, n = 72, a0 = Math.PI / 2) { const out = []; for (let i = 0; i <= n; i++) { const q = a0 + i / n * TAU; out.push([x + Math.cos(q) * rx, y + Math.sin(q) * ry]); } return out; }
export function ring(ctx, t, x, y, rx, u, o = {}) {
  if (u <= 0 || rx <= 0) return;
  const ry = o.ry ?? rx * .3, pts = ringPts(x, y, rx, ry);
  if (o.glow) halo(ctx, x, y, rx * 1.25, .3 * o.glow * clamp(u), o.haloCol ?? GOLD.halo, GOLD.core);
  X.lightLine(ctx, pts, u, { col: o.col ?? rgba(GOLD.line, .9), w: o.w ?? 4, dash: o.dash, blur: 10 });
  if (o.run && u >= 1) { const L = polyLen(pts); for (let k = 0; k < 6; k++) { const [px, py] = along(pts, ((t * (o.speed ?? .22) + k / 6) % 1) * L); halo(ctx, px, py, (o.w ?? 4) * 4, .7 * o.run, GOLD.halo, GOLD.core); } }
}
// the shared lab (a research building, flat side view): x, y = middle of its base, w; o.lit 0..1 (windows warm = minds inside), o.rise, o.a,
// o.outline 0..1 (only a dashed outline of it: the promise)
export function labBuilding(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || w <= 0) return;
  const h = w * .28, hh = w * .46, cx = x + w * .12;
  ctx.save(); ctx.globalAlpha *= a;
  const r = o.rise ?? 1;
  if (r < 1) { ctx.beginPath(); ctx.rect(x - w, y - hh * 2, w * 2, hh * 2); ctx.clip(); ctx.translate(0, (1 - expoOut(r)) * hh * 1.3); }
  const path = new Path2D();
  path.moveTo(x - w / 2, y); path.lineTo(x - w / 2, y - h); path.lineTo(cx - w * .16, y - h); path.lineTo(cx - w * .16, y - hh + w * .1);
  path.arc(cx, y - hh + w * .1, w * .16, Math.PI, 0); path.lineTo(cx + w * .16, y - h); path.lineTo(x + w / 2, y - h); path.lineTo(x + w / 2, y); path.closePath();
  const lit = clamp(o.lit ?? 0);
  ctx.fillStyle = lin(ctx, x, y - hh, x, y, [[0, mixHex(P.blue2, P.night1, .25)], [1, mixHex(P.night1, P.ind1, .4)]]); ctx.fill(path);
  ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = Math.max(1, w * .004); ctx.stroke(path);
  // the round window of the hall (the machine as a circle: it stays cool and dark until the lab has minds)
  ctx.strokeStyle = rgba(CREAM, .35); ctx.beginPath(); ctx.arc(cx, y - hh + w * .1, w * .09, 0, TAU); ctx.stroke();
  const cols = 9;
  for (let j = 0; j < 2; j++) for (let i = 0; i < cols; i++) {
    const wx = x - w * .46 + i * w * .105 + (i > 3 ? w * .02 : 0); if (Math.abs(wx + w * .02 - cx) < w * .17) continue;
    const on = lit * (.7 + .3 * Math.sin(t * .9 + i * 2.3 + j)) * (((i * 5 + j * 3) % 7) < 6 ? 1 : .5);
    ctx.fillStyle = on > .02 ? mixHex(mixHex(P.night1, P.blue1, .3), LAMP.body, on) : rgba(P.night0, .55);
    ctx.fillRect(wx, y - h * .82 + j * h * .4, w * .05, h * .24);
  }
  if (lit > 0) halo(ctx, cx, y - h * .6, w * .7, .25 * lit, LAMP.deep, LAMP.core);
  ctx.restore();
}
// the World Wide Web: a growing graph out of (x, y), seeded; u 0..1 spreads it over the frame (outward from the origin)
const WEB = (() => {
  const r = prng(4711), nodes = [[0, 0, 0, -1]];
  for (let i = 1; i < 190; i++) {
    const q = r() * TAU, d = 120 + Math.pow(r(), .7) * 1150, x = Math.cos(q) * d * 1.25, y = Math.sin(q) * d * .62;
    let best = 0, bd = 1e9; for (let j = 0; j < nodes.length; j++) { const n = nodes[j], dd = Math.hypot(n[0] - x, n[1] - y) + (n[2] > d ? 1e6 : 0); if (dd < bd) { bd = dd; best = j; } }
    nodes.push([x, y, d, best]);
  }
  nodes.sort((p, q) => p[2] - q[2]);
  // parent = the nearest node closer to the origin (so every line grows outward from a node that is already there)
  return nodes.map((n, i) => { if (!i) return [...n, 0]; let best = 0, bd = 1e9; for (let j = 0; j < i; j++) { const m = nodes[j], dd = Math.hypot(m[0] - n[0], m[1] - n[1]); if (dd < bd) { bd = dd; best = j; } } return [n[0], n[1], n[2], best]; });
})();
export function web(ctx, t, x, y, u, o = {}) {
  if (u <= 0) return;
  const R = 1400 * u, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 1; i < WEB.length; i++) {
    const [nx, ny, d, p] = WEB[i]; if (d > R) continue;
    const par = WEB[p], k = clamp((R - d) / 140), ex = lerp(par[0], nx, k), ey = lerp(par[1], ny, k);
    ctx.strokeStyle = rgba(mixHex(CREAM, COOL.line, .4), .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + par[0], y + par[1]); ctx.lineTo(x + ex, y + ey); ctx.stroke();
    if (k >= 1) { ctx.fillStyle = rgba(CREAM, .8); ctx.beginPath(); ctx.arc(x + nx, y + ny, 3.2 + 1.2 * Math.sin(t * 2 + i), 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ people
// a walker on a ground line: x, y foot, h, dir (1 = right, away; -1 = left, coming back), phase; o.rim, o.lamp (a warm rim = coming back)
export function walker(ctx, t, x, y, h, dir, ph, o = {}) {
  E.person(ctx, x, y, h, { dir, light: .7, walk: t * 8.5 + ph, rim: o.rim ?? mixHex(GOLD.line, P.blue1, .35), long: o.long });
}
