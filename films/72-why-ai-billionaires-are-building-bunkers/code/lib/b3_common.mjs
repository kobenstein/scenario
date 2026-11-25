// Film 72 · B3 shared helpers (c09–c13; builder B3 owns this file). Everything the five chunk files share: the view helpers, small drawing
// pieces (seated people behind a table, the tag, the cream ✗, a quote card whose spoken words turn gold, a paper card, a bunker in section
// that can turn into paper), and the FOUR INNER SEAM PLATES of the group: each is one draw function that BOTH neighbouring chunks call for
// ±S.SEAM_HALF round the boundary phrase (with S.creep), so the frames match (tools/seam.mjs proves it).
//   p910  'This channel exists'     the hatch in section under THE GROUND LINE, lantern rows on both sides, the question card in the sky
//   p1011 'One country has built'   two walls on the line (a thick one, a thin one), calm lanterns before the thin one
//   p1112 'So a world nobody wants' a bunker in section, its door shut, one figure left outside on the line
//   p1213 'So go back to that door' the big blank sheet, the two cards small in its corner, LAWMAKERS · COMPANIES · VOTERS
// Strings: F.SOURCES; the few that are not there are in LOCAL below (named in the report).
import * as E from './f10_editorial.mjs';
import * as F from './f72_kit.mjs';
import * as S from './f72_world.mjs';
import * as X from './f72_stage.mjs';
export { E, F, S, X };
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng } = E;
const { GOLD, COOL, CREAM, PAPER, CONCRETE, SOURCES: SRC } = F;
export const LY = X.LINE_Y, TAU = Math.PI * 2;
// strings that F.SOURCES does not have (yet): the deciders are commented out behind KB4 in the kit; the rest are shot-list words
export const LOCAL = { deciders: ['LAWMAKERS', 'COMPANIES', 'VOTERS'], promise: 'A PROMISE', againstBombs: 'BUILT AGAINST BOMBS', open: 'OPEN' };

// a label's life: rises from its mask at a, sinks back at b
export const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));
// the view through keys + the global breath (so a chunk's view meets a plate's view exactly)
export const view = (t, K) => { const v = X.viewPath(t, K), b = S.breathe(t); return { x: v.x + b.dx, y: v.y + b.dy, s: v.s }; };
export const plateView = (t, V, k = 1) => { const b = S.breathe(t); return { x: V.x + b.dx, y: V.y + b.dy, s: V.s * k }; };
// the two keys a receiving chunk starts its view path with (continues the plate's 4 %/s creep, the earlier key only shapes the tangent)
export const seamKeys = (T, phrase, V) => { const g = T.G(phrase); return [[g - S.SEAM_HALF, { ...V }], [g + S.SEAM_HALF, { ...V, s: V.s * (1 + S.CREEP * 2 * S.SEAM_HALF) }]]; };
// keyed scalar: [[t, value], …] with sineIO between keys
export function keyed(t, K) { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) return lerp(K[i - 1][1], K[i][1], sineIO(span(t, K[i - 1][0], K[i][0]))); return K[K.length - 1][1]; }
// draw fn clipped to the space ABOVE the line (things that rise out of it / sink into it)
export function above(ctx, fn, y = LY) { ctx.save(); ctx.beginPath(); ctx.rect(-6000, -6000, 14000, 6000 + y); ctx.clip(); fn(); ctx.restore(); }
export function below(ctx, fn, y = LY) { ctx.save(); ctx.beginPath(); ctx.rect(-6000, y, 14000, 8000); ctx.clip(); fn(); ctx.restore(); }

// ------------------------------------------------------------------------------------------------ small pieces
// a cream ✗ drawn by hand (two strokes, the second follows)
export function xmark(ctx, x, y, r, u, o = {}) {
  if (u <= 0) return; const s = o.s ?? 1, c = o.col ?? rgba(CREAM, .95);
  X.drawPath(ctx, [[x - r, y - r], [x + r, y + r]], span(u, 0, .55), { col: c, w: (o.w ?? 3.2) / s });
  X.drawPath(ctx, [[x + r, y - r], [x - r, y + r]], span(u, .45, 1), { col: c, w: (o.w ?? 3.2) / s });
}
// the SUBSCRIBE tag (a cream hairline pill with caps, never a button): rises out of a mask at its baseline, ul draws an underline beneath it
export function tag(ctx, txt, x, y, u, ul = 0, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const size = o.size ?? 30; ctx.save(); ctx.font = `700 ${size}px Inter`; ctx.letterSpacing = '0.16em'; const tw = ctx.measureText(txt).width; ctx.restore();
  const w = tw + size * 1.8, h = size * 1.9, k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - h * 2, w * 2, h * 2 + h / 2 + 2); ctx.clip(); ctx.translate(x, y + (1 - k) * h * 1.3);
  ctx.fillStyle = rgba(P.night0, .8); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.stroke();
  E.glowText(ctx, txt, 0, size * .36, { size, weight: 700, align: 'center', col: CREAM, glow: true, spacing: .16 });
  ctx.restore();
  if (ul > 0) F.goldSpan(ctx, [[x - w / 2 + h / 2, y + h * .9], [x + w / 2 - h / 2, y + h * .9]], 0, sineIO(ul), { w: 1.6, spark: ul < 1 });
}
// a paper card (cream, dark ink) centred at (x, y), w × h; o.rot, o.lit (gold edge), o.open 0..1 (the face opens into a frame: the paper
// stays only as a border, the inside turns night), o.a, o.lines [[text, size, { serif, gold, y }]] (y = baseline from the top), o.u (rises)
export function card(ctx, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0 || w < 2 || h < 2) return;
  const k = expoOut(u), op = clamp(o.open ?? 0), lit = clamp(o.lit ?? 0), s = o.s ?? 1;
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - k) * 30); ctx.rotate(o.rot ?? 0);
  if (op < 1) { ctx.fillStyle = rgba(P.night0, .38 * (1 - op)); ctx.fillRect(-w / 2 + 7 / s, -h / 2 + 10 / s, w, h); }
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(PAPER.lit, o.tint ?? PAPER.lit, .0)], [1, PAPER.body]]);
  if (op > 0) { const b = lerp(Math.min(w, h) / 2, 6, sineIO(op));   // the border that stays when the card opens into a frame
    ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.rect(-w / 2 + b, -h / 2 + b, w - 2 * b, h - 2 * b); ctx.fill('evenodd'); }
  else { ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 6 / s); ctx.fill(); }
  ctx.strokeStyle = lit > 0 ? rgba(mixHex(PAPER.edge, GOLD.mid, lit), .9) : rgba(PAPER.edge, .9); ctx.lineWidth = (2 + 2 * lit) / s; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 6 / s); ctx.stroke();
  if (op < .5) for (const [txt, size, q = {}] of o.lines ?? []) {
    const tu = clamp(q.u ?? 1); if (tu <= 0) continue; const serif = q.serif ?? false;
    const col = mixHex(PAPER.ink, GOLD.deep, q.gold ?? 0), ty = -h / 2 + (q.y ?? size * 1.4);
    F.maskLine(ctx, [[txt, 0]], q.align === 'left' ? -w / 2 + (q.x ?? 36) : 0, ty, size, F.rise(tu) * (1 - op * 2), { serif, weight: q.weight ?? 700, col, glow: false, align: q.align ?? 'center' });
  }
  ctx.restore();
}
// a quote card (paper) whose words turn from faint ink to gold-dark ink as they are spoken: o.hi = [[wordIndex, time], …] (only those words
// get the gold; the rest stand in ink), o.text, o.credit, o.u, o.y, o.w, o.size. Returns { x, y, w, h }.
export function quote(ctx, t, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const size = o.size ?? 52, w = o.w ?? 1120, pad = 54, words = o.text.split(/\s+/), lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), size, true) > w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const h = 24 + lines.length * size * 1.22 + 92, x = o.x ?? (W - w) / 2, y = o.y ?? 160, hi = new Map(o.hi ?? []);
  const k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - k) * 40); ctx.rotate(o.rot ?? -.006);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(6, 10, w, h, 10); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, 6); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  let n = 0;
  lines.forEach((ln, li) => { let xx = pad; const yy = 24 + (li + 1) * size * 1.22;
    for (const wd of ln) { const ht = hi.get(n), g = ht == null ? 0 : clamp((t - ht + .05) / .3);
      F.maskLine(ctx, [[wd + ' ', 0]], xx, yy, size, F.rise(span(u, .3 + li * .08, .9 + li * .08)), { serif: true, col: mixHex(PAPER.ink, GOLD.deep, g * .9), glow: false });
      xx += F.measure(wd, size, true) + size * .26; n++; } });
  if (o.credit) F.maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 34, 22, F.rise(span(u, .55, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  ctx.restore();
  return { x, y, w, h };
}
// a figure seen at a table: drawn standing, lowered by `sit` (0..1) behind the table top, which hides the lower body
export function atTable(ctx, x, y, h, o = {}) {
  const sit = clamp(o.sit ?? 1), dy = sit * h * .24;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.beginPath(); ctx.rect(x - h, y - h * 1.6, h * 2, h * 1.6 + 2); ctx.clip();
  F.person(ctx, x, y + dy, h, { pose: o.pose ?? 'stand', dir: o.dir ?? 1, walk: o.walk, light: o.light ?? -1, rim: o.rim ?? GOLD.line, look: o.look });
  ctx.restore();
}
// the table of the five (side view): a long table on the line, a hanging lamp over it, people behind it. o.n, o.guards (0..1 seated), o.u
// (rises out of the line), o.lamp (pool width), o.roll 0..1 (the eye-roll: the heads tip back once), o.k (scale). Returns the lamp's light point.
export function tableScene(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null; const k = o.k ?? 1, s = o.s ?? 1, e = expoOut(u);
  const tw = 300 * k * (o.wide ?? 1), th = 36 * k, hh = 128 * k, lampY = y - 250 * k;
  above(ctx, () => {
    ctx.save(); ctx.translate(0, (1 - e) * 290 * k);
    // the lamp: cord, shade, its warm cone onto the table (LAMP light = the one shared lamp)
    const pw = (o.lamp ?? 1) * tw * .62;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, lampY, 0, y - th, [[0, rgba(GOLD.halo, .1 * u)], [1, rgba(GOLD.halo, .035 * u)]]);
    ctx.beginPath(); ctx.moveTo(x - 16 * k, lampY + 10 * k); ctx.lineTo(x - pw, y - th); ctx.lineTo(x + pw, y - th); ctx.lineTo(x + 16 * k, lampY + 10 * k); ctx.fill(); ctx.restore();
    ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 1.5 / s; ctx.beginPath(); ctx.moveTo(x, lampY - 220 * k); ctx.lineTo(x, lampY - 8 * k); ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, CONCRETE.shade, .5); ctx.beginPath(); ctx.moveTo(x - 30 * k, lampY + 12 * k); ctx.lineTo(x + 30 * k, lampY + 12 * k); ctx.lineTo(x + 11 * k, lampY - 10 * k); ctx.lineTo(x - 11 * k, lampY - 10 * k); ctx.fill();
    F.glowDot(ctx, x, lampY + 12 * k, 70 * k, .9, 'gold');
    // the five (behind the table), the guards (o.guards: [{ x, sit, walk, a }])
    const seats = o.seats ?? [-.4, -.2, 0, .2, .4];
    seats.forEach((f, i) => atTable(ctx, x + f * 300 * k * 1.05, y, hh * (i % 2 ? .95 : 1), { sit: 1, dir: f < 0 ? 1 : -1, look: (o.roll ?? 0) * (i % 2 ? .9 : 1), rim: GOLD.line }));
    for (const g of o.guards ?? []) atTable(ctx, x + g.dx * k, y, hh * 1.04, { sit: g.sit, walk: g.walk, dir: g.dir ?? -1, a: g.a, rim: GOLD.line });
    // the table: top + front, one leg each side
    const ink = mixHex(P.night1, P.ind2, .55);
    ctx.fillStyle = ink; ctx.fillRect(x - tw / 2, y - th, tw, th); ctx.fillStyle = mixHex(ink, GOLD.shade, .35); ctx.fillRect(x - tw / 2 - 6 * k, y - th - 6 * k, tw + 12 * k, 7 * k);
    ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 1.6 / s; ctx.strokeRect(x - tw / 2, y - th, tw, th);
    halo(ctx, x, y - th - 10 * k, tw * .55, .28 * u * (o.lamp ?? 1), GOLD.halo, GOLD.core);
    ctx.restore();
  });
  return [x, lampY];
}
// ------------------------------------------------------------------------------------------------ a bunker in section that can turn into paper
// secBunker(ctx, t, x, y, o): x = the shaft's centre, y = the line. o.depth, o.room { x0, x1, h }, o.wall, o.sw (shaft width), o.light 0..1,
// o.door 0..1 (the concrete slab slides shut across the shaft), o.paper 0..1 (concrete → plain paper, the inside too), o.people [{ x, h, dir,
// walk, a, gold }], o.s, o.a. Returns { outline: 8 points (the L-shape, for the morph into a sheet), room }.
export function bunkerOutline(x, y, o = {}) {
  const wall = o.wall ?? 28, sw = o.sw ?? 64, depth = o.depth ?? 130, R = o.room, ry0 = y + depth, ry1 = ry0 + R.h;
  return [[x - sw / 2 - wall, y], [x + sw / 2 + wall, y], [x + sw / 2 + wall, ry0 - wall], [R.x1 + wall, ry0 - wall], [R.x1 + wall, ry1 + wall], [R.x0 - wall, ry1 + wall], [R.x0 - wall, ry0 - wall], [x - sw / 2 - wall, ry0 - wall]];
}
export function secBunker(ctx, t, x, y, o = {}) {
  const s = o.s ?? 1, wall = o.wall ?? 28, sw = o.sw ?? 64, depth = o.depth ?? 130, R = o.room, ry0 = y + depth, ry1 = ry0 + R.h;
  const pp = clamp(o.paper ?? 0), light = clamp(o.light ?? 1) * (1 - pp), out = bunkerOutline(x, y, o);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  // the concrete body = the outline filled; the stipple fades as it turns to paper
  ctx.fillStyle = lin(ctx, R.x0, y, R.x1, ry1, [[0, mixHex(CONCRETE.body, PAPER.lit, pp)], [1, mixHex(CONCRETE.shade, PAPER.body, pp)]]);
  ctx.beginPath(); out.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath(); ctx.fill();
  if (pp < 1) { ctx.save(); ctx.beginPath(); out.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath(); ctx.clip();
    F.stipple(ctx, R.x0 - wall, y, R.x1 - R.x0 + 2 * wall, ry1 + wall - y, { seed: 7301, a: .5 * (1 - pp) }); ctx.restore(); }
  // the inside (shaft + room): dark, warm when lit → paper
  const inside = () => { ctx.beginPath(); ctx.rect(x - sw / 2, y, sw, depth); ctx.rect(R.x0, ry0, R.x1 - R.x0, R.h); };
  ctx.fillStyle = lin(ctx, 0, ry0, 0, ry1, [[0, mixHex(mixHex(P.night0, GOLD.shade, .55 * light), PAPER.lit, pp)], [1, mixHex(mixHex(P.night0, GOLD.deep, .45 * light), PAPER.body, pp)]]);
  inside(); ctx.fill();
  if (light > 0) { ctx.save(); inside(); ctx.clip(); halo(ctx, (R.x0 + R.x1) / 2, ry0 + 20, (R.x1 - R.x0) * .55, .35 * light, GOLD.halo, GOLD.core); ctx.restore(); }
  // ladder, people
  ctx.save(); ctx.globalAlpha *= 1 - pp;
  ctx.strokeStyle = rgba(mixHex(CREAM, GOLD.line, .4), .7); ctx.lineWidth = 2 / s; ctx.beginPath(); const lx0 = x - sw * .22, lx1 = x + sw * .22;
  ctx.moveTo(lx0, y - 8); ctx.lineTo(lx0, ry1); ctx.moveTo(lx1, y - 8); ctx.lineTo(lx1, ry1); for (let yy = y + 8; yy < ry1 - 4; yy += 22) { ctx.moveTo(lx0, yy); ctx.lineTo(lx1, yy); } ctx.stroke();
  ctx.save(); inside(); ctx.clip();
  for (const p of o.people ?? []) { if ((p.a ?? 1) <= 0) continue; ctx.save(); ctx.globalAlpha *= p.a ?? 1;
    if (p.gold) halo(ctx, p.x, ry1 - p.h * .5, p.h * .9, .22 * p.gold, GOLD.halo, GOLD.core);
    F.person(ctx, p.x, (p.y ?? ry1) - 2, p.h, { pose: p.pose ?? 'stand', dir: p.dir ?? 1, walk: p.walk, light: -1, rim: GOLD.line }); ctx.restore(); }
  ctx.restore();
  ctx.restore();
  // the outline (cream → paper edge)
  const lc = rgba(mixHex(CREAM, PAPER.edge, pp), .85);
  X.drawPath(ctx, [...out, out[0]], 1, { col: lc, w: 2 / s });
  if (pp < 1) { ctx.save(); ctx.globalAlpha *= 1 - pp; X.drawPath(ctx, [[x - sw / 2, y], [x - sw / 2, ry0], [R.x0, ry0], [R.x0, ry1], [R.x1, ry1], [R.x1, ry0], [x + sw / 2, ry0], [x + sw / 2, y]], 1, { col: rgba(CREAM, .7), w: 1.6 / s }); ctx.restore(); }
  // the door (a thick concrete slab across the shaft under the collar)
  if (o.door != null && pp < 1) { const dk = sineIO(clamp(o.door)), dw = sw + wall * 1.2, dx = lerp(x + sw / 2 + wall + 4, x - sw / 2 - wall * .6, dk);
    ctx.save(); ctx.globalAlpha *= 1 - pp; ctx.beginPath(); ctx.rect(x - sw / 2 - wall - 2, y, sw + wall * 2 + 4 + dw * (1 - dk), 120); ctx.clip();
    F.slab(ctx, dx, y + 30, dw, 44, { s, seed: 77, stip: .8, line: .95 }); ctx.restore(); }
  ctx.restore();
  return { outline: out, room: { x0: R.x0, x1: R.x1, y0: ry0, y1: ry1 } };
}
// morph a polygon (same point count) into another, both arrays of [x, y]
export const morphPts = (A, B, u) => A.map(([x, y], i) => [lerp(x, B[i][0], u), lerp(y, B[i][1], u)]);
export const rectPts = (x0, y0, x1, y1) => [[x0, y0], [lerp(x0, x1, .35), y0], [lerp(x0, x1, .35), y0], [x1, y0], [x1, y1], [x0, y1], [x0, lerp(y0, y1, .5)], [x0, y0]];

// the people of F.lanternRow (same seeded positions), so a row can be taken over person by person
export function rowPeople(x0, x1, n, h0, seed, dir) {
  const r = prng(seed), out = [];
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, (i + .5 + (r() - .5) * .5) / n), h = h0 * (.82 + r() * .3), ph = r() * 6.3, d = dir ?? (r() < .5 ? -1 : 1); out.push({ x, h, ph, dir: d }); }
  return out;
}
// a city block on the line (Helsinki): plain blocks with a few lit windows, rising out of the line with u
export function skyline(ctx, t, x0, x1, u, seed = 7351, s = 1) {
  if (u <= 0) return; const r = prng(seed); let x = x0;
  above(ctx, () => { while (x < x1) { const w = 90 + r() * 90, h = 120 + r() * 200, k = expoOut(clamp(u * 1.6 - (x - x0) / (x1 - x0) * .6)), y = LY - h * k;
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5 + r() * .2); ctx.fillRect(x, y, w, h + 2);
    ctx.strokeStyle = rgba(CREAM, .22); ctx.lineWidth = 1.2 / s; ctx.strokeRect(x, y, w, h + 2);
    for (let i = 0; i < 6; i++) { const lit = r() < .4, wx = x + 14 + r() * (w - 34), wy = y + 16 + r() * (h - 40); if (lit) { ctx.fillStyle = rgba(F.LAMP.body, .55); ctx.fillRect(wx, wy, 12, 16); } }
    x += w + 8 + r() * 30; } });
}
// ======================================================================================================================== SEAM PLATES
// --------------------------------------------------------------------- p910 'This channel exists' (c09 → c10)
export const P910 = { V: { x: 960, y: 560, s: 1 }, hx: 960, cut: { x0: 690, x1: 1230, depth: 380 }, room: { x0: 780, x1: 1170, h: 130 }, depth: 120,
  rowL: [70, 640], rowR: [1280, 1850], card: { x: 960, y: 250, w: 1080, h: 128 }, pool: [960, 400, .85] };
// stage910(ctx, t, v, o): the hatch in section under the line, lantern rows on both sides, the question card in the sky. o: cut (0..1),
// card (0..1 rises), fold (0..1 the card folds down onto its bottom edge), rows (0..1), sinkRows (0..1), light (room 0..1), warm (0..1 the warm
// light along the line), above (gold above the hatch 0..1), hatchOpen, hatchSink (0..1), people (in the room), top(ctx, s) (extra, in view)
export function stage910(ctx, t, v, o = {}) {
  const Q = P910, cu = clamp(o.cut ?? 1);
  const [lx, ly, pl] = o.pool ?? Q.pool;
  X.ground(ctx, t, v, { lx, ly, pool: pl, cut: cu > 0 ? { ...Q.cut, u: cu } : null });
  X.inView(ctx, v, (s) => {
    // the warm light along the line (M.01): spreads from the hatch both ways
    const wm = clamp(o.warm ?? 0);
    if (wm > 0) { const L = 1100 * sineIO(wm); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, LY - 90, 0, LY + 60, [[0, rgba(GOLD.halo, 0)], [.6, rgba(GOLD.halo, .13 * wm)], [1, rgba(GOLD.halo, 0)]]);
      ctx.beginPath(); ctx.ellipse(Q.hx, LY - 10, L, 80, 0, 0, TAU); ctx.fill(); ctx.restore();
      F.goldSpan(ctx, [[Q.hx - L, LY], [Q.hx + L, LY]], 0, 1, { w: 1.6, a: .8 * wm, spark: false }); }
    if (cu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(Q.cut.x0, LY, Q.cut.x1 - Q.cut.x0, Q.cut.depth * sineIO(cu)); ctx.clip();
      F.bunker(ctx, t, Q.hx, LY, { s, depth: Q.depth, room: Q.room, light: o.light ?? .45, door: o.door ?? 1, shelves: undefined, people: o.people ?? [], draw: span(cu, .1, .8), fill: span(cu, .3, 1) });
      ctx.restore(); }
    const ab = clamp(o.above ?? 0); if (ab > 0) halo(ctx, Q.hx, LY - 60, 360, .32 * ab, GOLD.halo, GOLD.core);
    const hs = sineIO(clamp(o.hatchSink ?? 0));
    if (hs < 1) above(ctx, () => { ctx.save(); ctx.translate(0, hs * 60); F.hatch(ctx, t, Q.hx, LY, 170, { tilt: .075, open: o.hatchOpen ?? 0, glow: .35 + .4 * ab, s }); ctx.restore(); });
    const ru = clamp(o.rows ?? 1) * (1 - clamp(o.sinkRows ?? 0));
    if (ru > 0) { F.lanternRow(ctx, t, Q.rowL[0], Q.rowL[1], LY, 6, { h: 90, u: ru, seed: 7311 }); F.lanternRow(ctx, t, Q.rowR[0], Q.rowR[1], LY, 6, { h: 90, u: ru, seed: 7312 }); }
    if (o.top) o.top(ctx, s);
  });
  // the question card (screen space, its own plane in the sky)
  const cu2 = clamp(o.card ?? 0), fo = sineIO(clamp(o.fold ?? 0));
  if (cu2 > 0 && fo < 1) { const [sx, sy] = X.toScreen(v, Q.card.x, o.cardY ?? Q.card.y), ss = v.s, cy = sy + Q.card.h / 2 * ss;
    ctx.save(); ctx.translate(0, cy); ctx.scale(1, Math.max(.001, 1 - fo)); ctx.translate(0, -cy);
    card(ctx, sx, sy, Q.card.w * ss, Q.card.h * ss, { u: cu2, rot: -.008, lines: [[SRC.unnecessary, 40 * ss, { y: 80 * ss, u: span(cu2, .3, 1) }]] });
    ctx.restore(); }
}
export const PL910 = { cut: 1, card: 1, rows: 1, light: .45 };
export function p910(ctx, t, T) { stage910(ctx, t, plateView(t, P910.V, S.creep(t, T, 'This channel exists')), PL910); }

// --------------------------------------------------------------------- p1011 'One country has built' (c10 → c11)
export const P1011 = { V: { x: 1000, y: 530, s: 1 }, thick: { x: 700, w: 170 }, thin: { x: 1240, w: 22 }, top: LY - 290, row: [1020, 1460], pool: [1080, 420, .85] };
// two walls standing on the line (concrete, in section), lantern people before the thin one. o: thickW (width of the left wall), walls (0..1
// rise), thickSink, thinA, row (0..1), label1 (A THICKER DOOR), label2 (A WORLD NOBODY WANTS TO STORM), top(ctx, s)
export function stage1011(ctx, t, v, o = {}) {
  const Q = P1011, [lx, ly, pl] = o.pool ?? Q.pool;
  X.ground(ctx, t, v, { lx, ly, pool: pl });
  X.inView(ctx, v, (s) => {
    const wu = expoOut(clamp(o.walls ?? 1)), hh = LY - Q.top;
    above(ctx, () => {
      const tk = sineIO(clamp(o.thickSink ?? 0)), tw = o.thickW ?? Q.thick.w;
      if (tk < 1) F.slab(ctx, Q.thick.x - tw / 2, Q.top + (1 - wu) * hh + tk * hh, tw, hh, { s, seed: 7321, stip: .55 });
      if ((o.thinA ?? 1) > 0) { ctx.save(); ctx.globalAlpha *= o.thinA ?? 1; F.slab(ctx, Q.thin.x - Q.thin.w / 2, Q.top + (1 - wu) * hh + (o.thinDrop ?? 0), Q.thin.w, hh, { s, seed: 7322, stip: .55 }); ctx.restore(); }
    });
    const ru = clamp(o.row ?? 0); if (ru > 0) F.lanternRow(ctx, t, Q.row[0], Q.row[1], LY, 5, { h: 96, u: ru, seed: 7323, dir: -1 });
    X.label(ctx, SRC.thickerDoor, Q.thick.x, Q.top - 34, o.label1 ?? 0, { size: 30, spacing: .14 });
    X.label(ctx, SRC.nobodyStorm, Q.thin.x + 40, Q.top - 34, o.label2 ?? 0, { size: 30, spacing: .14, gold: .5 });
    if (o.top) o.top(ctx, s);
  });
}
export const PL1011 = { walls: 1, row: 1, label1: 0, label2: 1 };
export function p1011(ctx, t, T) { stage1011(ctx, t, plateView(t, P1011.V, S.creep(t, T, 'One country has built')), PL1011); }

// --------------------------------------------------------------------- p1112 'So a world nobody wants' (c11 → c12)
export const P1112 = { V: { x: 1080, y: 640, s: .92 }, hx: 1160, depth: 120, room: { x0: 1110, x1: 1760, h: 150 }, cut: { x0: 980, x1: 1900, depth: 380 }, out: 990, pool: [1200, 560, .85] };
// the bunker against people: door shut, people inside, the guards inside by the shaft, ONE figure left outside on the line. o: paper (0..1),
// cut, door, room (override), people, queue [{ x, a, sink }], hatchSink, label, top(ctx, s), under(ctx, s)
export const ROOM_PEOPLE = (R, n, t0 = -1) => Array.from({ length: n }, (_, i) => ({ x: R.x0 + 120 + i * ((R.x1 - R.x0 - 170) / Math.max(1, n - 1)), h: 74 + (i * 7) % 12, dir: i % 2 ? -1 : 1, gold: .7 }));
export function stage1112(ctx, t, v, o = {}) {
  const Q = P1112, [lx, ly, pl] = o.pool ?? Q.pool, room = o.room ?? Q.room, cu = clamp(o.cut ?? 1), C = o.cutR ?? Q.cut;
  X.ground(ctx, t, v, { lx, ly, pool: pl, cut: cu > 0 ? { ...C, u: cu } : null });
  let res = null;
  X.inView(ctx, v, (s) => {
    if (o.under) o.under(ctx, s);
    if (cu > 0 && (o.reveal ?? 1) > 0) { ctx.save(); ctx.beginPath(); ctx.rect(C.x0 - 60, LY - 10, C.x1 - C.x0 + 120, (C.depth * sineIO(cu) + 10) * sineIO(clamp(o.reveal ?? 1))); ctx.clip();
      res = secBunker(ctx, t, Q.hx, LY, { s, depth: Q.depth, room, light: o.light ?? .9, door: o.door ?? 1, paper: o.paper ?? 0, people: o.people ?? ROOM_PEOPLE(room, 6), a: o.bunkerA ?? 1 });
      ctx.restore(); }
    const hs = sineIO(clamp(o.hatchSink ?? 0));
    if (hs < 1) above(ctx, () => { ctx.save(); ctx.translate(0, hs * 60); F.hatch(ctx, t, Q.hx, LY, 150, { tilt: .075, open: o.hatchOpen ?? 0, glow: .25, s }); ctx.restore(); });
    for (const q of o.queue ?? []) { if ((q.a ?? 1) <= 0) continue; const sk = sineIO(clamp(q.sink ?? 0));
      above(ctx, () => F.lanternPerson(ctx, t, q.x, LY + sk * 110, q.h ?? 92, { dir: q.dir ?? 1, ph: q.ph ?? 0, a: q.a ?? 1, lamp: q.lamp ?? 1 })); }
    const ou = clamp(o.outside ?? 1); if (ou > 0) above(ctx, () => F.lanternPerson(ctx, t, o.outX ?? Q.out, LY + (1 - expoOut(ou)) * 110, 96, { dir: 1, ph: 2.1 }));
    X.label(ctx, SRC.staysOutside, (o.outX ?? Q.out) - 20, LY - 170, o.label ?? 0, { size: 30, spacing: .14, gold: .45 });
    if (o.top) o.top(ctx, s);
  });
  return res;
}
export const PL1112 = { cut: 1, door: 1, light: .9, outside: 1, label: 1 };
export function p1112(ctx, t, T) { stage1112(ctx, t, plateView(t, P1112.V, S.creep(t, T, 'So a world nobody wants')), PL1112); }

// --------------------------------------------------------------------- p1213 'So go back to that door' (c12 → c13)
export const P1213 = { V: { x: 960, y: 540, s: 1 }, sheet: { x: 960, y: 300, w: 1240, h: 400 }, figs: [620, 960, 1300], pool: [960, 380, .9] };
// the two cards (c12): card 1 the bill, card 2 the promise. o: u, bill (0..1 the bill's text), pass (NOT PASSED badge), vol (VOLUNTARY), open
export function card1(ctx, t, x, y, w, h, o = {}) {
  const k = w / 520, [num, act] = SRC.bill.split(' · ');
  card(ctx, x, y, w, h, { u: o.u ?? 1, open: o.open, rot: o.rot ?? -.01, lit: o.lit, lines: [
    [LOCAL.open, 44 * k, { y: h / 2 + 16 * k, u: (o.blank ?? 0), weight: 700 }],
    [num, 56 * k, { y: 76 * k, serif: true, u: o.bill ?? 0 }], [act, 22 * k, { y: 112 * k, u: span(o.bill ?? 0, .2, 1), weight: 600 }],
    [SRC.billCard[0], 36 * k, { y: 184 * k, u: o.l1 ?? 0, gold: .6 }], [SRC.billCard[1], 30 * k, { y: 232 * k, u: o.l2 ?? 0 }]] });
  if ((o.pass ?? 0) > 0) F.badge(ctx, t, x + w * .18, y + h / 2 - 4 * k, SRC.notPassed, o.pass, { size: 24 * k });
}
export function card2(ctx, t, x, y, w, h, o = {}) {
  const k = w / 520, ms = SRC.microsoft.split(':')[0];
  card(ctx, x, y, w, h, { u: o.u ?? 1, open: o.open, rot: o.rot ?? .012, lit: o.lit, lines: [
    [LOCAL.open, 44 * k, { y: h / 2 + 16 * k, u: (o.blank ?? 0), weight: 700 }],
    [LOCAL.promise, 50 * k, { y: 82 * k, serif: true, u: o.prom ?? 0 }], [ms, 24 * k, { y: 130 * k, u: o.ms ?? 0, weight: 600 }]] });
  if ((o.vol ?? 0) > 0) F.badge(ctx, t, x + w * .18, y + h / 2 - 4 * k, SRC.voluntary, o.vol, { size: 24 * k });
}
// stage1213: the large blank sheet with the two cards small in its top-left corner and three figures under it on the line
export function stage1213(ctx, t, v, o = {}) {
  const Q = P1213, [lx, ly, pl] = o.pool ?? Q.pool;
  X.ground(ctx, t, v, { lx, ly, pool: pl });
  X.inView(ctx, v, (s) => {
    const sh = o.sheet ?? Q.sheet, su = clamp(o.sheetU ?? 1);
    if (su > 0) { const w = lerp(o.sheet0?.w ?? sh.w, sh.w, sineIO(su)), h = lerp(o.sheet0?.h ?? sh.h, sh.h, sineIO(su)), x = lerp(o.sheet0?.x ?? sh.x, sh.x, sineIO(su)), y = lerp(o.sheet0?.y ?? sh.y, sh.y, sineIO(su));
      card(ctx, x, y, w, h, { u: 1, rot: -.004, s, a: o.sheetA ?? 1 });
      if (o.cards !== false) { const cw = (o.cw ?? 230), chh = cw * .6, cx0 = x - w / 2 + 40 + cw / 2, cy0 = y - h / 2 + 34 + chh / 2;
        card1(ctx, t, cx0, cy0, cw, chh, { bill: 1, l1: 1, l2: 1, pass: 1, rot: -.02 });
        card2(ctx, t, cx0 + cw + 22, cy0 + 6, cw, chh, { prom: 1, ms: 1, vol: 1, rot: .02 }); } }
    const figs = o.figs ?? [1, 1, 1];
    Q.figs.forEach((fx, i) => { const u = clamp(figs[i]); if (u <= 0) return;
      above(ctx, () => { const yy = LY + (1 - expoOut(u)) * 160;
        if (i === 2) { ctx.fillStyle = PAPER.lit; ctx.save(); ctx.translate(fx + 42, yy - 118); ctx.rotate(-.12); ctx.fillRect(-14, -18, 28, 36); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.5; ctx.strokeRect(-14, -18, 28, 36); ctx.restore(); }
        halo(ctx, fx, yy - 90, 120, .3 * u, GOLD.halo, GOLD.core);
        F.person(ctx, fx, yy, 168, { pose: i === 2 ? 'hold' : i === 0 ? 'point' : 'stand', dir: i === 0 ? 1 : -1, light: -1, rim: GOLD.line }); });
      X.label(ctx, LOCAL.deciders[i], fx, LY + 56, (o.labels ?? figs)[i], { size: 30, spacing: .14 }); });
    if (o.top) o.top(ctx, s);
  });
}
export const PL1213 = {};
export function p1213(ctx, t, T) { stage1213(ctx, t, plateView(t, P1213.V, S.creep(t, T, 'So go back to that door')), PL1213); }

// ------------------------------------------------------------------------------------------------ the Earth at night, scalable (c13)
// A copy of S.earthNight (same seeded lights) whose halo, rim and light sizes stay sane when r ≫ H (the ground line bending into the
// planet). At r ≤ 230 (S.END_EARTH) it draws exactly what S.earthNight draws, so the hand-over to S.endScreen is seamless.
let LIGHTS2 = null;
export function earthCurve(ctx, t, o = {}) {
  if (!LIGHTS2) { const r = prng(7260), cl = []; for (let i = 0; i < 34; i++) cl.push([r() * TAU, (r() - .35) * 1.6 * .8, .05 + r() * .22, 20 + Math.floor(r() * 70)]);
    LIGHTS2 = []; for (const [lon, lat, sp, n] of cl) for (let j = 0; j < n; j++) { const g = () => (r() + r() + r() - 1.5) * sp; LIGHTS2.push([lon + g() * 1.6, clamp(lat + g(), -1.3, 1.3), .4 + r() * .6, r() * 6.3]); } }
  const cx = o.cx ?? 960, cy = o.cy ?? 420, R = o.r ?? 280, rot = o.rot ?? t * .01, li = clamp(o.lights ?? 1), dawn = clamp(o.dawn ?? 0), Rc = Math.min(R, 230), big2 = Math.min(1, 230 / R);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  halo(ctx, cx, cy, R * 1.35, .18 * big2, COOL.halo, COOL.core);
  ctx.fillStyle = rad(ctx, cx - R * .3, cy - R * .3, R * 1.3, [[0, mixHex(P.ind1, P.blue0, .4)], [.7, P.ind0], [1, P.night0]]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
  const big = [];
  ctx.fillStyle = mixHex(GOLD.body, GOLD.core, .4); ctx.beginPath();
  for (const [lon, lat, b, ph] of LIGHTS2) {
    const x3 = Math.cos(lat) * Math.sin(lon + rot), z3 = Math.cos(lat) * Math.cos(lon + rot), y3 = Math.sin(lat); if (z3 <= 0) continue;
    const px = cx + x3 * R, py = cy - y3 * R; if (px < -40 || px > W + 40 || py < -40 || py > H + 40) continue;
    const rr = Math.max(.6, Rc * .006 * b * (.5 + .5 * z3)); ctx.moveTo(px + rr, py); ctx.arc(px, py, rr, 0, TAU);
    if (b > .75 && z3 > .25) big.push([px, py, rr, b, ph, z3]);
  }
  ctx.globalAlpha *= li; ctx.fill();
  for (const [px, py, rr, b, ph, z3] of big) F.glowDot(ctx, px, py, rr * 7, li * .5 * b * z3 * (.85 + .15 * Math.sin(t * 2 + ph)), 'gold');
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba(COOL.halo, .35); ctx.lineWidth = Rc * .02; ctx.beginPath(); ctx.arc(cx, cy, R + Rc * .004, 0, TAU); ctx.stroke();
  if (dawn > 0) { ctx.strokeStyle = rgba(GOLD.line, .55 * dawn); ctx.lineWidth = Rc * .03; ctx.beginPath(); ctx.arc(cx, cy, R + Rc * .006, -1.2, .9); ctx.stroke();
    halo(ctx, cx + R * .95, cy - R * .1, R * .7, .3 * dawn * big2, GOLD.halo, GOLD.core); }
  ctx.restore();
  ctx.restore();
}
