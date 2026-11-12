// Film 54 · "AI Just Gave Disease a 10-Year Deadline" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, the 2.5D card stage cam3/card/aim/camAt/camDrift, finish)
// + lib/f16_kit.mjs (rise, maskLine, measure, quote, stamp). World: docs/MOTION.md §2. Shots: docs/shots.md. Seams + hall: lib/f54_seams.mjs.
//
//   THE HALL OF RELICS (the guiding image = thumbnail A, an ANCHOR world): a museum at night in the grandkids' future. Four glass vitrines
//   stand reserved for CANCER · HEART DISEASE · MENTAL ILLNESS · ALZHEIMER'S, their specimens still glowing mint (not yet relics). The hall
//   is drawn by S.hallWorld; the pieces live here (vitrine, specimen, plaque, diorama, kiosk, audioPost, lectern, plagueMask).
//   THE TWO DATES (the core sentence as an object): the museum label of a cure has two rows, FOUND and PROVEN. FOUND gets a mint stamp
//   fast; PROVEN waits. The WAIT TRACK under them is the body's answer time (weeks … decades). twoDates() is THE recurring explainer.
//   THE DEADLINE BOARD (screen space, top left, from "Less than a decade: that's by twenty thirty-six" (vo-v3)): DEADLINE: 2036, four rows,
//   ANSWERS IN …, a verdict per row (✓ ½ ? ✗) that lands on its spoken verdict phrase (BOARD). Never a clock, never a countdown.
//   THE WALL TEXT (quote cards C1 / C1b, read by the narrator): big serif words that light up with the voice + the credit line.
//   CLIPS: clipPlate (C3, C2: video, grows from the kiosk screen) · audioPlate (C5: audio only, grows from the audio-guide post).
//   EXPLAINERS (60–70 %): made of museum things and light — labels, plaques, mint lines, dots, slabs, serif numbers, small cards.
//
// API (design px = screen px at the home camera; t in seconds; u = 0..1 growth):
//   colours: MINT (cure / science / the hero light) · COOL (the machine: fast cool sparks) · INK (night forms) · LAMP (people's practical
//            light, cream) · RELIC (old, faded) · PRINT54 (finish) · bump(t, t0, d)
//   mintTrail(ctx, pts, u, o) · mintSpan(ctx, pts, u0, u1, o) · mintText(ctx, segs, x, y, size, u, o)  (maskLine with mint words)
//   cell(ctx, t, x, y, r, o { a, breath, seed, relic 0..1, ghost 0..1, split 0..1 })   the mint cancer cell of thumbnail A
//   specimen(ctx, t, kind 'cell'|'heart'|'mind'|'brain', x, y, s, o { a, ghost, relic, glow })
//   vitrine(ctx, t, x, y, w, h, o { glow, inside(ctx, w, h) (local, clipped to the glass), plinth, depth, a, front }) → glass rect
//   plaque(ctx, t, x, y, s, o { name, sub, q (the ? after the name, 0..1), a, glow })  the small museum label on a plinth / under a diorama
//   twoDates(ctx, t, x, y, s, o { name, found 0..1, proven 0..1, blink 0..1, wait 0..1, waitTag, foundTag, provenTag, a, split, fast, slow })
//   stampMark(ctx, t, x, y, w, h, u, o)  the mint date stamp that presses into a slot (calendar glyph, no fake date)
//   BOARD · boardRow(T, k, t) → { on, ans, verdict } · board(ctx, t, T, o { a, big 0..1 (to the centre), from { x, y, s } (grows from) })
//   verdictMark(ctx, kind 'yes'|'half'|'open'|'no', x, y, s, u)
//   wallText(ctx, t, T, o { id 'C1'|'C1b', x, y, w, size, a, hi: [[phrase, t0]] (mint), dim (words not yet read), credit 0..1 })
//   QUOTES (the exact card wording) · CREDIT
//   kiosk(ctx, t, x, y, s, o { glow, screen(ctx, w, h) }) → screen rect · audioPost(ctx, t, x, y, s, o { lit }) → speaker rect
//   lectern(ctx, t, x, y, s, o { lamp, book(ctx) }) · essay(ctx, t, x, y, s, o { open, lens { x, y, r, u, text }, a })
//   diorama(ctx, t, x, y, w, h, o { inside(ctx, w, h), lit, glass }) → glass rect · plagueMask(ctx, t, x, y, s, o)
//   wordCard(ctx, t, x, y, s, word, o { rot, a, old 0..1, flat 0..1 (lying on a desk) })
//   molecule(ctx, t, x, y, s, seed, o { a, col }) · spark(ctx, t, x, y, r, o) (the machine) · bloodTube(ctx, t, x, y, s, o { fill, glow })
//   scan(ctx, t, x, y, s, o { tumor 0..1, label }) · pipeline(ctx, t, o { x, y, w, neck, flow, jam, labels })
//   camPath(t, K) · tag · questionMark · dotField · ruler · slab / slabBars · bracket · label · source · SOURCES
//   CLIP_RECT, CLIPS, clipWin, prepareClipFrames, clipPlate(ctx, t, T, id, o { from, morph, dark }) · audioPlate(ctx, t, T, id, o { from, morph })
//   thesis(ctx, t, x, y, u, o { lines, size, out })  the thumbnail line (Inter 600 caps, cream glow)
//   QR: the quiet corner (screen x ≥ 1330, y ≤ 580) during qrWindows(T) — nothing important may live there; qrQuiet(T, t) → 0..1
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D, loadImage } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, quote, rule, maskLine, measure, stamp } = K16;
export const { du, person, cam3, card, camAt, camDrift, aim, project, F0, glowText, withOuter, lightFlood, catmull, trail, dust } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
const TAU = Math.PI * 2;

export const PRINT54 = { grain: 14, floor: 4, vig: .5 };
// colour code (docs/MOTION.md §5): MINT = the cure, science, the hero light · COOL = the machine (fast sparks) · INK = night forms ·
// LAMP = people's practical light (cream, never gold) · RELIC = old, faded things (the plague, the past) · the yellow coat = only you
export const MINT = { core: '#effff8', body: '#8fe8c6', line: '#b8f3dc', deep: '#2c8a74', halo: '#5fd6b0', text: '#c9f7e6', ink: '#7fe3bf' };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
export const INK = { far: mixHex(P.ind0, P.blue0, .35), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, rim: mixHex(MINT.line, P.blue1, .55), glass: mixHex(P.blue1, MINT.line, .35) };
export const LAMP = { core: P.cream, body: mixHex(P.cream, P.halo2, .35), deep: mixHex(P.halo2, P.night1, .55) };
export const RELIC = { body: mixHex(P.halo2, P.blue1, .55), deep: mixHex(P.shade1, P.night1, .6), text: mixHex(P.cream, P.blue1, .45) };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== MINT LIGHT
// the mint light line (E.trail is gold): three passes (glow, body, core) and a spark at the head. pts [[x, y, w?]…]
export function mintSpan(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(u0 * L), [ex, ey, i1] = at(u1 * L), sub = [[sx, sy]];
  for (let i = i0; i < i1; i++) sub.push([pts[i][0], pts[i][1]]);
  sub.push([ex, ey]);
  const w = o.w ?? 3, a = o.a ?? 1, col = o.col ?? MINT;
  for (const [k, al, c, op] of [[4.5, .22, col.halo, 'lighter'], [2.1, .8, col.body, 'source-over'], [.9, 1, col.core, 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = c; ctx.globalAlpha = al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  }
  if (o.spark !== false && u1 < 1) halo(ctx, ex, ey, w * 11, .7 * a, col.halo, col.core);
  return [ex, ey];
}
export const mintTrail = (ctx, pts, u = 1, o = {}) => mintSpan(ctx, pts, 0, u, o);
// maskLine with mint words: segs [[text, mint 0..1]…] (mint 1 = the word is mint). Same reveal as maskLine.
export function mintText(ctx, segs, x, y, size, u, o = {}) {
  const serif = o.serif ?? true, k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15;
  const mw = (txt) => measure(txt, size, serif, o.weight) + (o.spacing ? txt.length * size * o.spacing : 0);   // letter spacing widens the run (and its clip)
  const total = segs.reduce((s, [txt]) => s + mw(txt), 0);
  let xx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x; const xs = [];
  ctx.save(); ctx.beginPath(); ctx.rect(xx - size, y - size * 1.25, total + size * 2, size * 1.25 + size * .32); ctx.clip();
  for (const [txt, m] of segs) {
    xs.push(xx);
    const col = mixHex(o.col ?? P.cream, MINT.ink, clamp(m));
    E.glowText(ctx, txt, xx, y + dy, { size, serif, col, weight: o.weight, glow: o.glow ?? false, spacing: o.spacing });
    if (m > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glowText(ctx, txt, xx, y + dy, { size, serif, col: rgba(MINT.halo, .3), a: clamp(m), weight: o.weight, glow: false, spacing: o.spacing }); ctx.restore(); }
    xx += mw(txt);
  }
  ctx.restore();
  return { w: total, xs, x0: xs[0] };
}

// ======================================================================================================================== SPECIMENS
// THE CELL (thumbnail A): a lumpy mint sphere, its rim brighter, blebs on the surface, a dark nucleus; it breathes. (x, y) = centre, r = radius.
// o { a, breath (amp, default .02), seed, relic 0..1 (faded, cream-grey: a thing of the past), ghost 0..1 (only an outline, reserved), split 0..1 }
const CELLS = new Map();
function cellShape(seed) {
  if (CELLS.has(seed)) return CELLS.get(seed);
  const r = prng(seed), lobes = [], blebs = [];
  for (let k = 0; k < 7; k++) lobes.push([3 + Math.floor(r() * 9), r() * TAU, .02 + r() * .045]);
  for (let k = 0; k < 16; k++) { const a = r() * TAU, d = .25 + r() * .62; blebs.push([Math.cos(a) * d, Math.sin(a) * d, .06 + r() * .1, r() * 6]); }
  const s = { lobes, blebs }; CELLS.set(seed, s); return s;
}
function cellPath(seed, x, y, R, t, br) {
  const { lobes } = cellShape(seed), p = new Path2D(), n = 120;
  for (let i = 0; i <= n; i++) {
    const a = i / n * TAU; let rr = 1;
    for (const [f, ph, amp] of lobes) rr += amp * Math.sin(a * f + ph + t * .15 * (f % 3 - 1));
    rr *= R * (1 + br);
    i ? p.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : p.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  p.closePath(); return p;
}
export function cell(ctx, t, x, y, R, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || R < 1) return;
  const seed = o.seed ?? 54, br = (o.breath ?? .03) * Math.sin(t * .9 + seed), relic = clamp(o.relic ?? 0), ghost = clamp(o.ghost ?? 0);
  const C = { core: mixHex(MINT.core, RELIC.body, relic), body: mixHex(MINT.body, RELIC.body, relic), deep: mixHex(MINT.deep, RELIC.deep, relic), halo: mixHex(MINT.halo, P.blue1, relic) };
  const path = cellPath(seed, x, y, R, t, br);
  halo(ctx, x, y, R * 2.1, .32 * a * (1 - .7 * relic), C.halo, C.body);
  ctx.save(); ctx.globalAlpha *= a;
  if (ghost < 1) {
    ctx.save(); ctx.globalAlpha *= 1 - ghost;
    ctx.fillStyle = rad(ctx, x - R * .18, y - R * .22, R * 1.15, [[0, rgba(C.body, .55)], [.62, rgba(C.body, .8)], [.9, rgba(C.core, .95)], [1, rgba(C.core, 1)]]); ctx.fill(path);
    ctx.save(); ctx.clip(path);
    const { blebs } = cellShape(seed);
    for (const [u, v, s, ph] of blebs) { const bx = x + u * R + 2 * Math.sin(t * .5 + ph), by = y + v * R + 2 * Math.cos(t * .4 + ph);
      ctx.fillStyle = rad(ctx, bx - s * R * .3, by - s * R * .3, s * R, [[0, rgba(C.deep, .35)], [.7, rgba(C.deep, .22)], [1, rgba(C.core, .25)]]); ctx.beginPath(); ctx.arc(bx, by, s * R, 0, TAU); ctx.fill(); }
    // the nucleus: a dark disc with a bright rim, off centre
    const nx = x + R * .06, ny = y + R * .04, nr = R * .4 * (1 + br * .5);
    ctx.fillStyle = rad(ctx, nx, ny, nr, [[0, rgba(mixHex(C.deep, P.night0, .55), .95)], [.8, rgba(mixHex(C.deep, P.night0, .3), .9)], [1, rgba(C.body, .9)]]); ctx.beginPath(); ctx.arc(nx, ny, nr, 0, TAU); ctx.fill();
    ctx.restore();
    E.dust(ctx, seed + 7, 160, x, y, R * .55, R * .55, t, .5 * (1 - relic), C.core);
    ctx.restore();
  }
  ctx.strokeStyle = rgba(C.core, .55 + .4 * ghost); ctx.lineWidth = Math.max(1, R * .012); ctx.stroke(path);
  ctx.restore();
}
// a stylised heart (with the aorta stub) and the liver beside it; a mind (a quiet ring of faint sound); a brain (gyri as mint lines)
const SPEC = new Map();
function heartPath() { if (SPEC.has('heart')) return SPEC.get('heart'); const p = new Path2D();
  p.moveTo(0, .95); p.bezierCurveTo(-.55, .55, -.95, .2, -.85, -.25); p.bezierCurveTo(-.78, -.62, -.35, -.8, -.08, -.52); p.bezierCurveTo(.05, -.4, .1, -.4, .2, -.55);
  p.bezierCurveTo(.5, -.85, .95, -.6, .9, -.15); p.bezierCurveTo(.86, .25, .45, .6, 0, .95); p.closePath(); SPEC.set('heart', p); return p; }
function brainPts() { if (SPEC.has('brain')) return SPEC.get('brain'); const r = prng(908), out = [];
  const outline = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU; const rr = 1 + .06 * Math.sin(a * 7) + .04 * Math.sin(a * 13 + 1); outline.push([Math.cos(a) * 1.18 * rr, Math.sin(a) * .82 * rr - (Math.sin(a) > 0 ? .1 * Math.sin(a) : 0)]); }
  out.push(outline);
  for (let k = 0; k < 11; k++) { const y0 = -.6 + k * .12 + (r() - .5) * .05, pts = []; for (let i = 0; i <= 10; i++) { const u = i / 10, xx = -1 + 2 * u; const lim = Math.sqrt(Math.max(0, 1 - (y0 / .82) ** 2)) * 1.05; if (Math.abs(xx) > lim) continue; pts.push([xx, y0 + .06 * Math.sin(u * 9 + k * 1.7)]); } if (pts.length > 2) out.push(pts); }
  out.push([[0, -.78], [.02, -.3], [-.02, .2], [0, .7]]);
  SPEC.set('brain', out); return out; }
export function specimen(ctx, t, kind, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const ghost = clamp(o.ghost ?? 0), relic = clamp(o.relic ?? 0), g = o.glow ?? 1;
  const body = mixHex(MINT.body, RELIC.body, relic), core = mixHex(MINT.core, RELIC.body, relic);
  if (kind === 'cell') return cell(ctx, t, x, y, s, { ...o });
  halo(ctx, x, y, s * 2, .26 * a * g * (1 - .6 * relic), mixHex(MINT.halo, P.blue1, relic), body);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  if (kind === 'heart') {
    const br = 1 + .035 * Math.max(0, Math.sin(t * 2.4)) ** 6;   // a slow beat
    ctx.save(); ctx.scale(s * br, s * br);
    const hp = heartPath();
    if (ghost < 1) { ctx.globalAlpha *= 1 - ghost; ctx.fillStyle = rad(ctx, -.25, -.3, 1.3, [[0, rgba(core, .9)], [.6, rgba(body, .75)], [1, rgba(MINT.deep, .6)]]); ctx.fill(hp); ctx.globalAlpha /= 1 - ghost || 1; }
    ctx.strokeStyle = rgba(core, .7); ctx.lineWidth = .02; ctx.stroke(hp);
    ctx.lineCap = 'round'; ctx.strokeStyle = rgba(body, .8); ctx.lineWidth = .09; ctx.beginPath(); ctx.moveTo(.08, -.5); ctx.bezierCurveTo(.1, -.95, .5, -1.05, .62, -.8); ctx.stroke();
    ctx.restore();
  } else if (kind === 'mind') {
    for (let k = 0; k < 4; k++) { const u = ((t * .12 + k / 4) % 1); ctx.strokeStyle = rgba(body, .5 * (1 - u) * (1 - ghost * .6)); ctx.lineWidth = Math.max(1, s * .02); ctx.beginPath();
      for (let i = 0; i <= 80; i++) { const aa = i / 80 * TAU, rr = s * (.25 + .8 * u) * (1 + .05 * Math.sin(aa * 6 + t + k)); i ? ctx.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr * .8) : ctx.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr * .8); } ctx.closePath(); ctx.stroke(); }
    ctx.fillStyle = rgba(core, .9); ctx.beginPath(); ctx.arc(0, 0, s * .07, 0, TAU); ctx.fill();
  } else if (kind === 'brain') {
    const L = brainPts();
    L.forEach((pts, i) => { const q = catmull(pts.map((p) => [p[0] * s, p[1] * s]), 6); ctx.strokeStyle = rgba(i ? body : core, i ? .55 * (1 - .5 * ghost) : .8); ctx.lineWidth = Math.max(1, s * (i ? .016 : .022)); ctx.lineJoin = 'round'; ctx.beginPath(); q.forEach((p, j) => (j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); if (!i) ctx.closePath(); ctx.stroke(); });
  }
  ctx.restore();
}

// ======================================================================================================================== THE MUSEUM PIECES
// A glass vitrine on a plinth (thumbnail A). (x, y) = the bottom centre of the glass (= top of the plinth), w × h = the glass front.
// o { glow 0..1 (mint light inside), inside(ctx, w, h) (local px, origin top-left of the glass, clipped), plinth (height, default .14 h),
//     depth (the top face, default .09 w), a, front (draw the glass sheen over the inside, default true), relic (cream-grey light instead of mint) }
export function vitrine(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1, g = clamp(o.glow ?? 1), d = o.depth ?? w * .09, ph = o.plinth ?? h * .14, gx = x - w / 2, gy = y - h;
  const L = o.relic ? { core: RELIC.body, body: RELIC.body, halo: P.blue1, line: RELIC.text } : MINT;
  ctx.save(); ctx.globalAlpha *= a;
  // floor light in front and the soft reflection under the plinth
  ctx.save(); ctx.translate(x, y + ph + 8); ctx.scale(1, .16); ctx.fillStyle = rad(ctx, 0, 0, w * 1.05, [[0, rgba(L.body, .26 * g)], [.5, rgba(L.halo, .08 * g)], [1, rgba(L.halo, 0)]]); ctx.beginPath(); ctx.arc(0, 0, w * 1.05, 0, TAU); ctx.fill(); ctx.restore();
  // the plinth: a dark block, lit top edge, a faint side face
  ctx.fillStyle = lin(ctx, 0, y, 0, y + ph, [[0, mixHex(P.ind2, P.blue1, .25)], [1, P.night0]]); ctx.fillRect(gx - w * .04, y, w * 1.08, ph);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.beginPath(); ctx.moveTo(gx + w * 1.04, y); ctx.lineTo(gx + w * 1.04 + d * .8, y - d * .6); ctx.lineTo(gx + w * 1.04 + d * .8, y + ph - d * .6); ctx.lineTo(gx + w * 1.04, y + ph); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(L.line, .35 * g + .1); ctx.fillRect(gx - w * .04, y, w * 1.08, 2);
  // the light inside: a mint column falling from the top (a hidden lamp) onto the plinth
  ctx.save(); ctx.beginPath(); ctx.rect(gx, gy, w, h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, gy, 0, y, [[0, rgba(mixHex(P.night1, L.halo, .25), .55 + .25 * g)], [.55, rgba(mixHex(P.night1, L.halo, .12), .45)], [1, rgba(mixHex(P.night1, L.body, .35 * g), .65)]]); ctx.fillRect(gx, gy, w, h);
  if (o.inside) { ctx.save(); ctx.translate(gx, gy); o.inside(ctx, w, h); ctx.restore(); }
  ctx.restore();
  // the glass: top face, back edges, front sheen, front edges
  ctx.strokeStyle = rgba(L.line, .22 + .3 * g); ctx.lineWidth = Math.max(1, w * .003);
  ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + d * .8, gy - d * .6); ctx.lineTo(gx + w + d * .8, gy - d * .6); ctx.lineTo(gx + w, gy); ctx.moveTo(gx + w + d * .8, gy - d * .6); ctx.lineTo(gx + w + d * .8, y - d * .6); ctx.stroke();
  ctx.fillStyle = rgba(L.halo, .06 + .06 * g); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + d * .8, gy - d * .6); ctx.lineTo(gx + w + d * .8, gy - d * .6); ctx.lineTo(gx + w, gy); ctx.closePath(); ctx.fill();
  if (o.front !== false) {
    ctx.save(); ctx.beginPath(); ctx.rect(gx, gy, w, h); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    const sx = gx + w * (.12 + .02 * Math.sin(t * .2));
    ctx.fillStyle = lin(ctx, sx, gy, sx + w * .35, gy + h * .3, [[0, rgba(L.line, 0)], [.45, rgba(L.line, .07)], [.55, rgba(L.line, .1)], [1, rgba(L.line, 0)]]);
    ctx.beginPath(); ctx.moveTo(sx, gy); ctx.lineTo(sx + w * .22, gy); ctx.lineTo(sx + w * .02, y); ctx.lineTo(sx - w * .2, y); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  ctx.strokeStyle = rgba(L.line, .35 + .45 * g); ctx.lineWidth = Math.max(1.2, w * .004); ctx.strokeRect(gx, gy, w, h);
  ctx.restore();
  return { x: gx, y: gy, w, h };
}
// the small museum label (a dark plaque with a cream border): (x, y) = its centre, s = width. o { name, sub, q 0..1 (a mint ? after the name), a, glow }
export function plaque(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < 4) return;
  const h = s * .36; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(P.night1, P.ind2, .5)], [1, P.night0]]); ctx.beginPath(); ctx.roundRect(-s / 2, -h / 2, s, h, s * .02); ctx.fill();
  ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = Math.max(.8, s * .006); ctx.stroke();
  const fs1 = s * .1, nm = o.name ?? '';
  if (nm) { const nw = measure(nm, fs1, false, 600) + nm.length * fs1 * .22, qx = nw / 2 + fs1 * .45;
    E.glowText(ctx, nm, -(o.q ? fs1 * .25 : 0), (o.sub ? -h * .04 : h * .1), { size: fs1, align: 'center', spacing: .22, glow: false, col: P.cream });
    if (o.q > 0) { ctx.globalAlpha *= clamp(o.q); E.glowText(ctx, '?', qx - fs1 * .1, (o.sub ? -h * .04 : h * .1) + fs1 * .05, { size: fs1 * 1.5, serif: true, glow: false, col: MINT.ink }); ctx.globalAlpha /= clamp(o.q) || 1; } }
  if (o.sub) E.glowText(ctx, o.sub, 0, h * .3, { size: s * .06, align: 'center', spacing: .2, glow: false, col: rgba(P.halo2, .85) });
  ctx.restore();
}
// a period room behind glass (a diorama): (x, y) = bottom centre of the glass, w × h. o { inside(ctx, w, h) (local, clipped), lit 0..1, glass 0..1, a }
export function diorama(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 1), gx = x - w / 2, gy = y - h;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night0, P.ind2, .3); ctx.fillRect(gx - 18, gy - 18, w + 36, h + 36 + 70);   // the dark frame and base
  ctx.fillStyle = lin(ctx, 0, y + 18, 0, y + 88, [[0, mixHex(P.ind2, P.blue1, .2)], [1, P.night0]]); ctx.fillRect(gx - 18, y + 18, w + 36, 70);
  ctx.save(); ctx.translate(x, y + 150); ctx.scale(1, .14); ctx.fillStyle = rad(ctx, 0, 0, w * .8, [[0, rgba(LAMP.body, .16 * lit)], [1, rgba(LAMP.body, 0)]]); ctx.beginPath(); ctx.arc(0, 0, w * .8, 0, TAU); ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(gx, gy, w, h); ctx.clip();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(gx, gy, w, h);
  if (o.inside) { ctx.save(); ctx.translate(gx, gy); o.inside(ctx, w, h); ctx.restore(); }
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= clamp(o.glass ?? 1);
  ctx.fillStyle = lin(ctx, gx, gy, gx + w * .5, gy + h, [[0, rgba(P.blue0, 0)], [.42, rgba(P.cream, .05)], [.5, rgba(P.cream, .08)], [.58, rgba(P.cream, .04)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(gx, gy, w, h);
  ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = 2; ctx.strokeRect(gx, gy, w, h);
  ctx.restore();
  return { x: gx, y: gy, w, h };
}
// the plague doctor's beaked mask on a stand (a relic of the past): (x, y) = the stand's foot, s = mask height
export function plagueMask(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(-s * .03, -s * 1.1, s * .06, s * 1.1); ctx.fillRect(-s * .22, -s * .04, s * .44, s * .04);
  ctx.translate(0, -s * 1.15);
  const body = RELIC.deep, lit = mixHex(RELIC.body, P.night1, .35);
  const hood = new Path2D(); hood.moveTo(-s * .3, s * .5); hood.bezierCurveTo(-s * .36, s * .05, -s * .26, -s * .42, 0, -s * .44); hood.bezierCurveTo(s * .24, -s * .42, s * .3, -s * .1, s * .22, s * .5); hood.closePath();
  ctx.fillStyle = lin(ctx, -s * .3, 0, s * .3, 0, [[0, body], [1, lit]]); ctx.fill(hood);
  // the wide-brimmed hat
  ctx.fillStyle = lin(ctx, -s * .4, 0, s * .4, 0, [[0, body], [1, mixHex(lit, body, .4)]]); ctx.beginPath(); ctx.moveTo(-s * .2, -s * .4); ctx.lineTo(-s * .17, -s * .74); ctx.quadraticCurveTo(0, -s * .8, s * .17, -s * .74); ctx.lineTo(s * .2, -s * .4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(body, lit, .3); ctx.beginPath(); ctx.ellipse(0, -s * .4, s * .46, s * .075, -.04, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(RELIC.text, .35); ctx.fillRect(-s * .19, -s * .5, s * .38, s * .035);
  const beak = new Path2D(); beak.moveTo(s * .14, -s * .08); beak.bezierCurveTo(s * .45, -s * .02, s * .75, s * .18, s * .92, s * .42); beak.bezierCurveTo(s * .7, s * .34, s * .4, s * .3, s * .14, s * .22); beak.closePath();
  ctx.fillStyle = lin(ctx, s * .14, 0, s * .9, s * .4, [[0, lit], [1, body]]); ctx.fill(beak);
  ctx.fillStyle = mixHex(RELIC.body, P.cream, .2); ctx.globalAlpha *= .8; ctx.beginPath(); ctx.arc(s * .08, -s * .1, s * .07, 0, TAU); ctx.fill();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(s * .08, -s * .1, s * .045, 0, TAU); ctx.fill();
  ctx.restore();
}
// a word card (the doctor's word): cream paper, dark serif caps. (x, y) = centre, s = width. o { rot, a, old 0..1 (yellowed, faded), flat 0..1 (lies on a desk: squashed) }
export function wordCard(ctx, t, x, y, s, word, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < 3) return;
  const old = clamp(o.old ?? 0), flat = clamp(o.flat ?? 0), h = s * .42;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(1, 1 - .55 * flat);
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-s / 2 + s * .03, -h / 2 + s * .04, s, h, s * .03); ctx.fill();
  ctx.fillStyle = mixHex(mixHex(P.cream, '#e9e2c6', .5), RELIC.body, old * .7); ctx.beginPath(); ctx.roundRect(-s / 2, -h / 2, s, h, s * .03); ctx.fill();
  let fs = s * .2; const mw = measure(word, fs, true); if (mw > s * .84) fs *= s * .84 / mw;
  E.glowText(ctx, word, 0, fs * .34, { size: fs, serif: true, align: 'center', glow: false, col: mixHex(P.night1, RELIC.deep, old * .6) });
  ctx.restore();
}
// THE MEDIA KIOSK (the podcast screen of C3 and C2): a screen on a slim stand with a bench in front. (x, y) = foot of the stand, s = screen width.
// o { glow 0..1, screen(ctx, w, h) (local px), a, bench (default true) } → the screen rect (design px)
export function kiosk(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1, g = clamp(o.glow ?? .6), sh = s * .5625, sx = x - s / 2, sy = y - s * .55 - sh;
  ctx.save(); ctx.globalAlpha *= a;
  if (o.bench !== false) { const bw = s * .7, by = y - s * .07; ctx.fillStyle = mixHex(P.night0, P.ind2, .55); ctx.fillRect(x - bw / 2, by + s * .2, bw, s * .045); ctx.fillRect(x - bw / 2 + s * .03, by + s * .245, s * .03, s * .08); ctx.fillRect(x + bw / 2 - s * .06, by + s * .245, s * .03, s * .08); }
  halo(ctx, x, sy + sh / 2, s * .9, .22 * g, COOL.halo, COOL.body);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .45); ctx.fillRect(x - s * .02, sy + sh, s * .04, y - sy - sh); ctx.fillRect(x - s * .16, y - s * .015, s * .32, s * .015);
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(sx - s * .025, sy - s * .025, s * 1.05, sh + s * .05, s * .02); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, s, sh); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, sy, 0, sy + sh, [[0, mixHex(P.ind1, COOL.deep, .5 * g)], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(sx, sy, s, sh);
  if (o.screen) { ctx.save(); ctx.translate(sx, sy); o.screen(ctx, s, sh); ctx.restore(); }
  else { ctx.fillStyle = rgba(P.cream, .5 * g); ctx.beginPath(); ctx.moveTo(x - s * .05, sy + sh * .38); ctx.lineTo(x + s * .07, sy + sh * .5); ctx.lineTo(x - s * .05, sy + sh * .62); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = rgba(COOL.line, .35 + .3 * g); ctx.lineWidth = Math.max(1, s * .004); ctx.strokeRect(sx, sy, s, sh);
  ctx.restore();
  return { x: sx, y: sy, w: s, h: sh };
}
// THE AUDIO-GUIDE POST (C5, audio only): a slim stand with a round speaker grille and a small mint light. (x, y) = foot, s = height.
// o { lit 0..1, a } → the speaker disc { x, y, r } (design px)
export function audioPost(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 0), cy = y - s * .82, r = s * .11;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.roundRect(x - s * .035, cy, s * .07, y - cy, s * .02); ctx.fill(); ctx.fillRect(x - s * .12, y - s * .02, s * .24, s * .02);
  ctx.beginPath(); ctx.roundRect(x - s * .15, cy - s * .16, s * .3, s * .32, s * .05); ctx.fill();
  if (lit > 0) halo(ctx, x, cy, s * .45, .35 * lit, MINT.halo, MINT.body);
  ctx.fillStyle = mixHex(P.night1, P.blue1, .3); ctx.beginPath(); ctx.arc(x, cy, r, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .8); for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j <= 5) { ctx.beginPath(); ctx.arc(x + i * r * .32, cy + j * r * .32, r * .08, 0, TAU); ctx.fill(); }
  ctx.fillStyle = mixHex(P.night1, MINT.body, .3 + .7 * lit); ctx.beginPath(); ctx.arc(x, cy + s * .13, s * .012, 0, TAU); ctx.fill();
  ctx.restore();
  return { x, y: cy, r };
}
// a reading lectern with a small cream lamp (the essay lies on it): (x, y) = foot, s = height. o { lamp 0..1, book(ctx, x, y, w) (top surface), a }
export function lectern(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1, lamp = clamp(o.lamp ?? 1), ty = y - s * .78, tw = s * .62;
  ctx.save(); ctx.globalAlpha *= a;
  if (lamp > 0) { halo(ctx, x, ty - s * .05, s * .9, .28 * lamp, LAMP.body, LAMP.core); ctx.save(); ctx.translate(x, y + 8); ctx.scale(1, .16); ctx.fillStyle = rad(ctx, 0, 0, s * .8, [[0, rgba(LAMP.body, .2 * lamp)], [1, rgba(LAMP.body, 0)]]); ctx.beginPath(); ctx.arc(0, 0, s * .8, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.moveTo(x - s * .05, y); ctx.lineTo(x - s * .035, ty + s * .04); ctx.lineTo(x + s * .035, ty + s * .04); ctx.lineTo(x + s * .05, y); ctx.closePath(); ctx.fill(); ctx.fillRect(x - s * .16, y - s * .02, s * .32, s * .02);
  ctx.fillStyle = lin(ctx, 0, ty - s * .05, 0, ty + s * .05, [[0, mixHex(P.ind2, LAMP.deep, .35 * lamp)], [1, P.night0]]); ctx.beginPath(); ctx.moveTo(x - tw / 2, ty + s * .05); ctx.lineTo(x + tw / 2, ty + s * .05); ctx.lineTo(x + tw / 2 - s * .03, ty - s * .05); ctx.lineTo(x - tw / 2 + s * .03, ty - s * .05); ctx.closePath(); ctx.fill();
  if (o.book) o.book(ctx, x, ty - s * .05, tw * .8);
  // the lamp on a gooseneck
  ctx.strokeStyle = mixHex(P.night0, P.ind2, .6); ctx.lineWidth = s * .012; ctx.beginPath(); ctx.moveTo(x + tw * .42, ty); ctx.quadraticCurveTo(x + tw * .5, ty - s * .3, x + tw * .25, ty - s * .32); ctx.stroke();
  ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.beginPath(); ctx.ellipse(x + tw * .22, ty - s * .31, s * .06, s * .025, -.3, 0, TAU); ctx.fill();
  if (lamp > 0) { ctx.fillStyle = rgba(LAMP.core, .9 * lamp); ctx.beginPath(); ctx.ellipse(x + tw * .21, ty - s * .29, s * .035, s * .01, -.3, 0, TAU); ctx.fill(); }
  ctx.restore();
  return { x, y: ty - s * .05, w: tw };
}
// THE ESSAY (Machines of Loving Grace, Oct 2024): an open booklet, small print as faint lines; the magnifier makes one line readable.
// (x, y) = centre, s = width of the open spread. o { open 0..1 (0 = closed cover), title 0..1, lens { x, y (local -.5..5 of the spread), r (× s), u 0..1, text, hi (mint words) }, a }
export const ESSAY = { title: 'MACHINES OF LOVING GRACE', sub: 'DARIO AMODEI · OCT 2024' };
export function essay(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const op = sineIO(clamp(o.open ?? 1)), h = s * .62;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(0, h * .52, s * .55, h * .06, 0, 0, TAU); ctx.fill();
  const pw = s / 2, paper = mixHex(P.cream, '#e3dcc0', .5), shade = mixHex(paper, P.night1, .25);
  // right page (always), left page swings open from the right (a cover while closed)
  ctx.fillStyle = lin(ctx, 0, 0, pw, 0, [[0, shade], [.12, paper], [1, paper]]); ctx.fillRect(0, -h / 2, pw, h);
  const lw = pw * (op * 2 - 1);
  if (op < .5) { ctx.fillStyle = lin(ctx, 0, 0, pw, 0, [[0, mixHex(P.ind1, P.night1, .3)], [1, mixHex(P.ind2, P.blue1, .3)]]); ctx.fillRect(0, -h / 2, -lw, h);
    if ((o.title ?? 1) > 0 && -lw > pw * .6) { E.glowText(ctx, 'MACHINES OF', -lw / 2, -h * .12, { size: pw * .075, align: 'center', glow: false, spacing: .14, col: P.cream }); E.glowText(ctx, 'LOVING GRACE', -lw / 2, -h * .02, { size: pw * .075, align: 'center', glow: false, spacing: .14, col: P.cream }); } }
  else { ctx.fillStyle = lin(ctx, -pw, 0, 0, 0, [[0, paper], [.88, paper], [1, shade]]); ctx.fillRect(-lw, -h / 2, lw, h); }
  // small print: faint lines on the open pages; the title block on the left page
  if (op > .5) {
    const k = span(op, .6, 1);
    ctx.globalAlpha *= k;
    E.glowText(ctx, ESSAY.title, -pw / 2, -h * .36, { size: pw * .062, align: 'center', glow: false, spacing: .12, col: P.night1 });
    E.glowText(ctx, ESSAY.sub, -pw / 2, -h * .29, { size: pw * .036, align: 'center', glow: false, spacing: .16, col: mixHex(P.night1, paper, .4) });
    const r = prng(77);
    for (const [x0, x1, y0] of [[-pw * .88, -pw * .12, -h * .2], [pw * .1, pw * .9, -h * .4]]) for (let k2 = 0; k2 < 13; k2++) { const yy = y0 + k2 * h * .055; if (yy > h * .42) break; ctx.fillStyle = rgba(P.night1, .28); ctx.fillRect(x0, yy, (x1 - x0) * (.7 + .3 * r()), Math.max(1, h * .012)); }
    ctx.globalAlpha /= k || 1;
  }
  ctx.restore();
  // the magnifier: a lens circle that enlarges one readable line (cream on dark inside the lens? no: dark serif on the page, sharp)
  const L = o.lens; if (L && L.u > 0 && op > .5) {
    const lx = x + L.x * s, ly = y + L.y * s, lr = (L.r ?? .16) * s * expoOut(clamp(L.u));
    ctx.save(); ctx.globalAlpha *= a;
    ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, lr, 0, TAU); ctx.clip();
    ctx.fillStyle = mixHex(paper, P.cream, .4); ctx.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
    if (L.text) { const fs = lr * .26 * (L.size ?? 1), lines = Array.isArray(L.text) ? L.text : [L.text]; const ru = clamp(L.read ?? 1);
      lines.forEach((ln, i) => { const segs = (L.hi ? ln.split(/(\s+)/).map((w) => [w, L.hi.some((h2) => w.toLowerCase().replace(/[^a-z']/g, '') === h2) ? 1 : 0]) : [[ln, 0]]);
        ctx.globalAlpha *= ru; mintText(ctx, segs, lx, ly + (i - (lines.length - 1) / 2) * fs * 1.25 + fs * .35, fs, 1, { align: 'center', col: P.night1 }); ctx.globalAlpha /= ru || 1; }); }
    ctx.restore();
    ctx.strokeStyle = mixHex(P.night0, P.ind2, .6); ctx.lineWidth = lr * .09; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, TAU); ctx.stroke();
    ctx.lineCap = 'round'; ctx.lineWidth = lr * .16; ctx.beginPath(); ctx.moveTo(lx + lr * .74, ly + lr * .74); ctx.lineTo(lx + lr * 1.45, ly + lr * 1.45); ctx.stroke();
    ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = lr * .02; ctx.beginPath(); ctx.arc(lx, ly, lr * .93, -2.6, -1.4); ctx.stroke();
    ctx.restore();
  }
}

// ======================================================================================================================== THE TWO DATES
// THE recurring explainer: a museum label of a cure with two rows. (x, y) = top-left, s = scale (card 560 × 330 at s = 1).
// o { name ('' hides the name row; '?' shows a mint ?), found 0..1 (the mint stamp presses in), proven 0..1, blink 0..1 (the empty PROVEN slot
//     blinks), wait 0..1 (the wait track runs from FOUND toward PROVEN), waitTag (e.g. 'WEEKS'), foundTag / provenTag (text inside the stamps,
//     default: a calendar glyph), a, glow, col (frame colour), split 0..1 (H.07: the two rows open into two columns: fast | slow) }
// → { found: [x, y], proven: [x, y], track: [x0, x1, y], w, h } in the caller's space
export const DATES = { w: 560, h: 330 };
export function twoDates(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1, w = DATES.w * s, h = DATES.h * s; if (a <= 0 || s <= .02) return null;
  const nameRow = o.name != null && o.name !== '';
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, mixHex(P.night1, P.ind2, .55)], [1, mixHex(P.night0, P.night1, .5)]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, 8 * s); ctx.fill();
  ctx.strokeStyle = rgba(o.col ?? P.cream, .55); ctx.lineWidth = Math.max(1, 2 * s); ctx.stroke();
  if (nameRow) {
    if (o.name === '?') E.glowText(ctx, '?', x + 40 * s, y + 62 * s, { size: 46 * s, serif: true, glow: false, col: MINT.ink });
    else E.glowText(ctx, o.name, x + 40 * s, y + 56 * s, { size: 26 * s, spacing: .28, glow: false, col: P.cream });
    ctx.fillStyle = rgba(P.cream, .25); ctx.fillRect(x + 40 * s, y + 82 * s, w - 80 * s, Math.max(1, 1.5 * s));
  }
  const r1 = y + (nameRow ? 148 : 112) * s, r2 = y + (nameRow ? 228 : 196) * s, sx = x + 205 * s, sw = w - 245 * s, sh = 54 * s;
  for (const [ry, word] of [[r1, 'FOUND'], [r2, 'PROVEN']]) E.glowText(ctx, word, x + 40 * s, ry + 9 * s, { size: 24 * s, spacing: .22, glow: false, col: rgba(P.cream, .85) });
  // the slots: a dashed outline (empty) · PROVEN blinks while it waits
  const blink = clamp(o.blink ?? 0), bl = blink * (.5 + .5 * Math.sin(t * 4.2));
  for (const [ry, k] of [[r1, 0], [r2, 1]]) {
    ctx.save(); ctx.setLineDash([8 * s, 7 * s]); ctx.lineDashOffset = -t * 6 * s * (k ? 1 : 0);
    ctx.strokeStyle = rgba(k && bl > 0 ? mixHex(P.cream, MINT.line, bl) : P.cream, .35 + (k ? .45 * bl : 0)); ctx.lineWidth = Math.max(1, 1.6 * s); ctx.beginPath(); ctx.roundRect(sx, ry - sh / 2, sw, sh, 6 * s); ctx.stroke(); ctx.restore();
  }
  stampMark(ctx, t, sx, r1 - sh / 2, sw, sh, o.found ?? 0, { text: o.foundTag });
  stampMark(ctx, t, sx, r2 - sh / 2, sw, sh, o.proven ?? 0, { text: o.provenTag });
  // the wait track: from the FOUND stamp down the card's right edge to the PROVEN slot (the body's answer time)
  const tx0 = x + 40 * s, tx1 = x + w - 40 * s, ty = y + h - 30 * s, wu = clamp(o.wait ?? 0);
  if (o.wait != null) {
    ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = Math.max(1, 2 * s); ctx.beginPath(); ctx.moveTo(tx0, ty); ctx.lineTo(tx1, ty); ctx.stroke();
    if (wu > 0) mintTrail(ctx, [[tx0, ty], [tx1, ty]], wu, { w: 3.2 * s, spark: wu < 1 });
    if (o.waitTag) E.glowText(ctx, o.waitTag, tx1, ty - 12 * s, { size: 20 * s, align: 'right', spacing: .2, glow: false, col: MINT.text, a: o.waitTagA ?? 1 });
  }
  ctx.restore();
  return { found: [sx + sw / 2, r1], proven: [sx + sw / 2, r2], track: [tx0, tx1, ty], w, h, slot: { x: sx, w: sw, h: sh, r1, r2 } };
}
// the mint date stamp pressing into a slot (x, y, w, h): drops from 1.15× (expo-in), hits, settles. No fake date: a calendar glyph, or o.text.
export function stampMark(ctx, t, x, y, w, h, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const drop = expoIn(clamp(u / .45)), k = 1.15 - .15 * drop, settle = span(u, .45, 1);
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.globalAlpha *= .3 + .7 * drop;
  ctx.fillStyle = rgba(MINT.deep, .55); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h * .12); ctx.fill();
  ctx.strokeStyle = MINT.ink; ctx.lineWidth = Math.max(1, h * .05); ctx.stroke();
  if (o.text) E.glowText(ctx, o.text, 0, h * .17, { size: h * .42, align: 'center', spacing: .16, weight: 600, glow: false, col: MINT.core });
  else {   // a calendar leaf: two rings, a ruled body, one filled day
    const cw = h * .78, ch = h * .66; ctx.strokeStyle = MINT.core; ctx.lineWidth = Math.max(1, h * .045);
    ctx.beginPath(); ctx.roundRect(-cw / 2, -ch / 2 + h * .04, cw, ch, h * .06); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-cw / 2, -ch / 2 + h * .2); ctx.lineTo(cw / 2, -ch / 2 + h * .2); ctx.stroke();
    for (const dx of [-cw * .25, cw * .25]) { ctx.beginPath(); ctx.moveTo(dx, -ch / 2 - h * .03); ctx.lineTo(dx, -ch / 2 + h * .1); ctx.stroke(); }
    ctx.fillStyle = MINT.core; ctx.fillRect(-cw * .12, h * .02, cw * .24, ch * .26);
  }
  ctx.restore();
  if (settle > 0 && settle < 1) halo(ctx, x + w / 2, y + h / 2, w * .5 * (.6 + settle), .35 * (1 - settle), MINT.halo, MINT.core);
}

// ======================================================================================================================== THE DEADLINE BOARD
// Screen space, top left (the QR corner top right stays free). Rows light on their phrase (on), get their ANSWERS IN text (ans), and their
// verdict mark on the spoken verdict (verdict). Phrases are looked up in order (each after the previous); the fact-checked vo-v3 must keep them.
// Wording: text-v2 "Die Uhr: die Frist-Tafel". ✓ is mint, ½ half mint, ? cream serif, ✗ cream (no red, REGELN §9.3).
export const BOARD = {
  x: 70, y: 52, w: 420, title: 'DEADLINE: 2036', foot: 'OUR CONVERSION OF “LESS THAN A DECADE” (NOV 2026)', appear: 'twenty thirty-six', vanish: 'Maybe your grandkids will hear',
  rows: [
    { name: 'CANCER', on: 'The fastest clear answer', ans: 'within weeks, it shrinks', ansText: 'WEEKS', verdict: 'So cancer, by the deadline', kind: 'yes', vText: 'MANY KINDS' },
    { name: 'HEART', on: 'But is a fast answer', ans: 'At the highest dose', ansText: 'WEEKS · YEARS', verdict: 'So heart disease, by the deadline', kind: 'half', vText: '' },
    { name: 'MIND', on: 'The third disease answers fast', ans: 'A trial runs for weeks', ansText: 'WEEKS, BUT FAINT', verdict: 'So mental illness, by the deadline', kind: 'open', vText: '' },
    { name: "ALZHEIMER'S", on: 'And then the fourth disease', ans: 'start around twenty years', ansText: 'DECADES', verdict: "So Alzheimer's, by the deadline", kind: 'no', vText: '' },
  ],
};
const BOARDT = new WeakMap();
function boardTimes(T) {
  if (BOARDT.has(T)) return BOARDT.get(T);
  const a0 = T.G(BOARD.appear), out = { appear: a0, vanish: T.G(BOARD.vanish), rows: [] };
  let after = a0;
  for (const r of BOARD.rows) { const on = T.G(r.on, 0, after), ans = T.G(r.ans, 0, on - 1), vEnd = T.GE(r.verdict, 0, ans); out.rows.push({ on, ans, verdict: vEnd + .05 }); after = on; }
  BOARDT.set(T, out); return out;
}
export function boardRow(T, k, t) { const r = boardTimes(T).rows[k]; return { on: smooth(span(t, r.on, r.on + .8)), ans: rise(span(t, r.ans + .2, r.ans + .9)), verdict: span(t, r.verdict, r.verdict + .6) }; }
export const boardTimesOf = (T) => boardTimes(T);
// verdict marks as paths (no font glyphs): (x, y) = centre, s = size, u = 0..1 (drawn / landed)
export function verdictMark(ctx, kind, x, y, s, u) {
  u = clamp(u); if (u <= 0) return;
  ctx.save(); ctx.translate(x, y); const k = 1.25 - .25 * expoOut(u); ctx.scale(k, k); ctx.globalAlpha *= Math.min(1, u * 2.5); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (kind === 'yes') { ctx.strokeStyle = MINT.ink; ctx.lineWidth = s * .16; ctx.beginPath(); ctx.moveTo(-s * .4, 0); ctx.lineTo(-s * .1, s * .3); ctx.lineTo(s * .45, -s * .35); ctx.stroke(); halo(ctx, 0, 0, s * 1.2, .3 * u, MINT.halo, MINT.body); }
  else if (kind === 'half') { ctx.strokeStyle = MINT.line; ctx.lineWidth = s * .09; ctx.beginPath(); ctx.arc(0, 0, s * .42, 0, TAU); ctx.stroke(); ctx.fillStyle = MINT.ink; ctx.beginPath(); ctx.arc(0, 0, s * .42, Math.PI / 2, Math.PI * 1.5); ctx.closePath(); ctx.fill(); }
  else if (kind === 'open') E.glowText(ctx, '?', 0, s * .38, { size: s * 1.15, serif: true, align: 'center', glow: false, col: P.cream });
  else { ctx.strokeStyle = P.cream; ctx.lineWidth = s * .13; ctx.beginPath(); ctx.moveTo(-s * .34, -s * .34); ctx.lineTo(s * .34, s * .34); ctx.moveTo(s * .34, -s * .34); ctx.lineTo(-s * .34, s * .34); ctx.stroke(); }
  ctx.restore();
}
// the board. o { a (master, default by the appear/vanish phrases), big 0..1 (glides to the centre, 2.2× — the big answer 9:12), from { x, y, s }
// (screen point it grows out of while appearing: the mint subtitle line of C3), rows: override per row { on, ans, verdict } }
export function board(ctx, t, T, o = {}) {
  const bt = boardTimes(T), grow = expoOut(span(t, bt.appear, bt.appear + 1.4)), gone = expoIn(span(t, bt.vanish - .6, bt.vanish + .2));
  const a = (o.a ?? 1) * (grow > 0 ? 1 : 0) * (1 - gone); if (a <= 0) return;
  const big = sineIO(clamp(o.big ?? 0)), B = BOARD, rows = B.rows.length;
  const sc0 = 1, sc1 = 2.15, sc = lerp(sc0, sc1, big), bw = B.w, bh = 96 + rows * 52;
  let x = lerp(B.x, W / 2 - bw * sc1 / 2, big), y = lerp(B.y, H * .44 - bh * sc1 / 2, big);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  if (o.from && grow < 1) { const f = o.from; x = lerp(f.x, x, grow); y = lerp(f.y, y, grow); }
  ctx.translate(x, y); ctx.scale(sc * (o.from ? lerp(f0s(o), 1, grow) : 1), sc * (o.from ? lerp(f0s(o), 1, grow) : 1));
  ctx.fillStyle = rgba(P.night0, .62); ctx.beginPath(); ctx.roundRect(-14, -12, bw + 28, bh + 22, 10); ctx.fill();
  ctx.strokeStyle = rgba(P.cream, .28); ctx.lineWidth = 1.2; ctx.stroke();
  E.glowText(ctx, B.title, 0, 30, { size: 30, weight: 600, spacing: .14, glow: false, col: P.cream });
  E.glowText(ctx, B.foot, 0, 54, { size: 11.5, weight: 600, spacing: .1, glow: false, col: rgba(P.halo2, .8) });
  ctx.fillStyle = rgba(P.cream, .22); ctx.fillRect(0, 68, bw, 1.2);
  B.rows.forEach((r, k) => {
    const st = { ...boardRow(T, k, t), ...((o.rows || [])[k] || {}) }, ry = 104 + k * 52;
    const on = .35 + .65 * st.on;
    E.glowText(ctx, r.name, 0, ry, { size: 20, weight: 600, spacing: .14, glow: false, col: rgba(P.cream, on) });
    if (st.ans > 0) mintText(ctx, [[r.ansText, .6]], 168, ry, 15, st.ans, { serif: false, weight: 600, spacing: .12 });
    if (st.on > 0 && st.verdict <= 0) { ctx.strokeStyle = rgba(MINT.line, .5 * st.on); ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.arc(bw - 20, ry - 7, 14, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
    verdictMark(ctx, r.kind, bw - 20, ry - 7, 30, st.verdict);
    if (r.vText && st.verdict > 0) E.glowText(ctx, r.vText, bw - 46, ry - 2, { size: 11, weight: 600, spacing: .12, align: 'right', glow: false, col: MINT.text, a: rise(st.verdict) });
  });
  ctx.restore();
}
const f0s = (o) => (o.from && o.from.s != null ? o.from.s : .2);

// ======================================================================================================================== THE WALL TEXT (quote cards)
// C1 / C1b are READ by the narrator (no footage, no photo): the wall text shows the exact wording; each word lights up as it is spoken
// (timing words inside the card slot T.clip(id)); words not yet read stay dim (o.dim, default .38). o.hi: [[phrase, t0]] turns words mint.
export const QUOTES = {
  C1: { text: 'Cancer, Alzheimer’s, heart disease, mental illness, these will be relics of the past in, I think, less than a decade.' },
  C1b: { text: 'I think if we do this right, we can create an age of miracles…' },
};
export const CREDIT = { name: 'Dario Amodei', line: 'ANTHROPIC IPO ROADSHOW VIDEO · NOV 10, 2026' };
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export function wallText(ctx, t, T, o = {}) {
  const id = o.id ?? 'C1', q = QUOTES[id], size = o.size ?? 64, wmax = o.w ?? 1240, lead = size * 1.24, a = o.a ?? 1; if (a <= 0) return null;
  const slot = T.clip(id), spoken = slot ? T.words.filter((w) => w.s >= slot.start - .05 && w.s <= slot.end + .05) : [];
  const words = `“${q.text}”`.split(/\s+/), lines = []; let cur = [];
  for (const w of words) { const nx = [...cur, w]; if (cur.length && measure(nx.join(' '), size) > wmax) { lines.push(cur); cur = [w]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  // word k ↔ spoken word k (same text, the narrator reads the card); fallback: spread over the slot
  const flat = lines.flat(), tOf = flat.map((w, k) => (spoken[k] && nz(spoken[k].w) === nz(w) ? spoken[k].s : slot ? lerp(slot.start, slot.end, k / flat.length) : 0));
  const hiAt = flat.map(() => null);
  for (const [ph, tg] of o.hi || []) { const p = ph.split(/\s+/).map(nz); for (let i = 0; i + p.length <= flat.length; i++) if (p.every((x, j) => nz(flat[i + j]) === x)) { for (let j = 0; j < p.length; j++) hiAt[i + j] = tg; break; } }
  ctx.save(); ctx.globalAlpha *= a;
  const x = o.x ?? 300, y = o.y ?? 330, dim = o.dim ?? .38;
  let wi = 0;
  lines.forEach((ln, li) => {
    let xx = x; const yy = y + li * lead;
    ln.forEach((w, j) => {
      const k = wi++, txt = w + (j < ln.length - 1 ? ' ' : ''), lit = o.read === false ? 1 : smooth(span(t, tOf[k] - .08, tOf[k] + .3)), m = hiAt[k] != null ? smooth(span(t, hiAt[k], hiAt[k] + .5)) : 0;
      ctx.save(); ctx.globalAlpha *= dim + (1 - dim) * lit;
      mintText(ctx, [[txt, m]], xx, yy, size, 1, { glow: lit > .5 && m === 0 });
      ctx.restore();
      xx += measure(txt, size, true);
    });
  });
  const by = y + (lines.length - 1) * lead + size * .5 + 34, cu = rise(clamp(o.credit ?? 1));
  if (cu > 0) { ctx.fillStyle = rgba(MINT.line, .7 * cu); ctx.fillRect(x, by - 6, 64 * cu, 2);
    maskLine(ctx, [[CREDIT.name, 0]], x, by + 44, 40, cu, { glow: false });
    maskLine(ctx, [[CREDIT.line, 0]], x + measure(CREDIT.name, 40) + 22, by + 41, 19, cu, { serif: false, weight: 600, col: P.halo2, glow: false }); }
  ctx.restore();
  return { x, y, bottom: by + 50, lines: lines.length, lead };
}

// ======================================================================================================================== SMALL EXPLAINER THINGS
// a molecule glyph (hexagon rings + side chains), the machine's fast finds. (x, y) = centre, s = size, seed varies the shape. o { a, col MINT|COOL }
export function molecule(ctx, t, x, y, s, seed = 1, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < 1) return; const r = prng(seed * 97 + 3), col = o.col ?? COOL, n = 2 + Math.floor(r() * 2);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.strokeStyle = col.body; ctx.lineWidth = Math.max(1, s * .07); ctx.lineJoin = 'round';
  let cx = -s * .35 * (n - 1) / 2, cy = 0;
  for (let i = 0; i < n; i++) { ctx.beginPath(); for (let k = 0; k <= 6; k++) { const aa = k / 6 * TAU + Math.PI / 6; const px = cx + Math.cos(aa) * s * .2, py = cy + Math.sin(aa) * s * .2; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
    if (r() > .4) { const aa = (r() > .5 ? -1 : 1) * Math.PI / 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(aa) * s * .2, cy + Math.sin(aa) * s * .2); ctx.lineTo(cx + Math.cos(aa) * s * .38, cy + Math.sin(aa) * s * .38); ctx.stroke(); ctx.fillStyle = col.core; ctx.beginPath(); ctx.arc(cx + Math.cos(aa) * s * .42, cy + Math.sin(aa) * s * .42, s * .05, 0, TAU); ctx.fill(); }
    cx += s * .35; cy += (r() - .5) * s * .2; }
  ctx.restore();
}
// the machine as a fast cool spark (never a robot, never a brain): a small bright point with a short tail. (x, y), r. o { a, dir [dx, dy] }
export function spark(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= .2) return; const [dx, dy] = o.dir ?? [0, 0];
  if (dx || dy) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = lin(ctx, x - dx, y - dy, x, y, [[0, rgba(COOL.halo, 0)], [1, rgba(COOL.body, .7 * a)]]); ctx.lineWidth = r * 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - dx, y - dy); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); }
  halo(ctx, x, y, r * 7, .5 * a, COOL.halo, COOL.core);
  ctx.fillStyle = rgba(COOL.core, a); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}
// a blood tube (the Alzheimer's blood test, the study clinic): (x, y) = bottom, s = height. o { fill 0..1, glow 0..1 (mint: the test finds traces), a }
export function bloodTube(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const w = s * .2, f = clamp(o.fill ?? .7), g = clamp(o.glow ?? 0);
  ctx.save(); ctx.globalAlpha *= a;
  if (g > 0) halo(ctx, x, y - s * .4, s * .9, .4 * g, MINT.halo, MINT.body);
  ctx.fillStyle = mixHex(P.night1, mixHex(MINT.deep, P.shade0, .5), .6 + .3 * (1 - g)); ctx.beginPath(); ctx.roundRect(x - w / 2, y - s * .82 * f, w, s * .82 * f, [0, 0, w / 2, w / 2]); ctx.fill();
  if (g > 0) { ctx.fillStyle = rgba(MINT.ink, .8 * g); ctx.beginPath(); ctx.roundRect(x - w / 2, y - s * .82 * f, w, s * .82 * f, [0, 0, w / 2, w / 2]); ctx.fill(); }
  ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = Math.max(1, s * .015); ctx.beginPath(); ctx.roundRect(x - w / 2, y - s * .86, w, s * .86, [0, 0, w / 2, w / 2]); ctx.stroke();
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.fillRect(x - w * .62, y - s, w * 1.24, s * .14);
  ctx.restore();
}
// a scan frame (the tumor answers in weeks): a rounded dark frame with a body slice outline and a tumor that shrinks. (x, y) = centre, s = width.
// o { tumor 0..1 (size), label (top-left, e.g. 'WEEK 0'), a }
export function scan(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const h = s * .8;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.roundRect(-s / 2, -h / 2, s, h, s * .03); ctx.fill(); ctx.strokeStyle = rgba(P.cream, .4); ctx.lineWidth = Math.max(1, s * .006); ctx.stroke();
  ctx.strokeStyle = rgba(COOL.line, .45); ctx.lineWidth = Math.max(1, s * .01); ctx.beginPath(); ctx.ellipse(0, s * .03, s * .36, h * .36, 0, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-s * .14, s * .02, s * .1, h * .2, .2, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(s * .14, s * .02, s * .1, h * .2, -.2, 0, TAU); ctx.stroke();
  const tr = s * .085 * clamp(o.tumor ?? 1); if (tr > .5) { halo(ctx, s * .1, -h * .06, tr * 3, .35, MINT.halo, MINT.body); ctx.fillStyle = MINT.body; ctx.beginPath(); ctx.arc(s * .1, -h * .06, tr, 0, TAU); ctx.fill(); }
  if (o.label) E.glowText(ctx, o.label, -s / 2 + s * .05, -h / 2 + s * .09, { size: s * .055, weight: 600, spacing: .18, glow: false, col: P.halo2 });
  ctx.restore();
}
// THE GLASS PIPELINE (6.04 the testing, not the finding · 6.12 discovery speeds up, proof jams): a glass tube left → right that narrows at
// the TESTING neck. Molecules flow in fast on the left (FINDING) and queue before the neck. o { x, y, w, h, neck 0..1 (x of the neck),
// flow 0..1 (how much streams in), jam 0..1 (how many pile up), labels 0..1, u (the glass draws), seed, a }
export function pipeline(ctx, t, o) {
  const a = o.a ?? 1, u = expoOut(clamp(o.u ?? 1)); if (a <= 0 || u <= 0) return;
  const { x, y, w } = o, h = o.h ?? 150, nx = x + w * (o.neck ?? .62), nh = h * .2, jam = clamp(o.jam ?? 0), flow = clamp(o.flow ?? 1);
  const top = (px) => { const d = (px - nx) / (w * .08); return y - lerp(h / 2, nh / 2, Math.exp(-d * d)); };
  ctx.save(); ctx.globalAlpha *= a;
  const X1 = x + w * u, path = new Path2D(); for (let i = 0; i <= 80; i++) { const px = lerp(x, X1, i / 80); i ? path.lineTo(px, top(px)) : path.moveTo(px, top(px)); }
  for (let i = 80; i >= 0; i--) { const px = lerp(x, X1, i / 80); path.lineTo(px, 2 * y - top(px)); } path.closePath();
  ctx.fillStyle = rgba(INK.glass, .12); ctx.fill(path); ctx.strokeStyle = rgba(MINT.line, .55); ctx.lineWidth = 2; ctx.stroke(path);
  ctx.save(); ctx.clip(path);
  const r = prng(o.seed ?? 31), N = 46;
  for (let k = 0; k < N; k++) {
    const ph = r(), sp = .16 + r() * .06, lane = (r() - .5) * .7, sd = Math.floor(r() * 50);
    let px = x + ((t * sp + ph) % 1) * (nx - x) * 1.02;
    const qx = nx - w * .04 - (k % 14) * h * .2 * (.7 + .3 * r()), qy = y + ((k * 37) % 7 - 3) * h * .1;   // the jam: a queue before the neck
    const inQueue = k / N < jam; if (inQueue) { px = lerp(px, qx, jam); }
    if (px > nx - w * .02 && !inQueue) continue;
    if (k / N > flow && !inQueue) continue;
    molecule(ctx, t, px, inQueue ? lerp(y + lane * h * .5, qy, jam) : y + lane * h * .6, h * .28, sd, { a: .9, col: COOL });
  }
  // through the neck: one molecule at a time, slowly (mint: it is being proven)
  const thr = ((t * .05) % 1); if (u >= .95) { molecule(ctx, t, lerp(nx - w * .03, x + w, thr), y, h * .28, 7, { col: MINT, a: .95 }); }
  ctx.restore();
  const lu = clamp(o.labels ?? 1);
  if (lu > 0) { maskLine(ctx, [['FINDING', 0]], x + (nx - x) * .4, y - h / 2 - 26, 22, lu, { serif: false, weight: 600, align: 'center', col: COOL.text, glow: false });
    maskLine(ctx, [['TESTING', 0]], nx, y - nh / 2 - 60, 22, lu, { serif: false, weight: 600, align: 'center', col: MINT.text, glow: false });
    ctx.strokeStyle = rgba(MINT.line, .6 * lu); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(nx, y - nh / 2 - 50); ctx.lineTo(nx, y - nh / 2 - 10); ctx.stroke(); }
  ctx.restore();
}

// ======================================================================================================================== GENERIC EXPLAINER BLOCKS (from Film 28, mint)
// a small paper tag on a string: (x, y) = where the string hangs; u grows it (it swings in)
export function tag(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const size = o.size ?? 17, tw = measure(text, size, false, 600) + size * text.length * .1, w = tw + size * 1.6, h = size * 1.9, len = o.len ?? 22;
  const sw = (o.swing ?? 0) + (1 - expoOut(u)) * .5 + .02 * Math.sin(t * 1.1 + x * .01);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.globalAlpha *= rise(u);
  ctx.strokeStyle = rgba(P.halo2, .7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len); ctx.stroke();
  const y0 = len, p = new Path2D(); p.moveTo(-w / 2 + h * .35, y0); p.lineTo(w / 2, y0); p.lineTo(w / 2, y0 + h); p.lineTo(-w / 2 + h * .35, y0 + h); p.lineTo(-w / 2, y0 + h / 2); p.closePath();
  ctx.fillStyle = o.col === 'mint' ? mixHex(MINT.body, P.cream, .3) : mixHex(P.cream, '#e3dcc0', .4); ctx.fill(p);
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(-w / 2 + h * .42, y0 + h / 2, size * .14, 0, TAU); ctx.fill();
  E.glowText(ctx, text, -w / 2 + h * .7, y0 + h * .66, { size, weight: 600, spacing: .1, col: P.night1, glow: false });
  ctx.restore();
}
// a big serif question mark that rises (mint by default)
export function questionMark(ctx, t, x, y, s, u, o = {}) {
  if (u <= 0) return; ctx.save(); if (o.screen !== false) ctx.setTransform(1, 0, 0, 1, 0, 0);
  mintText(ctx, [['?', o.mint ?? 1]], x, y, s, rise(u), { align: 'center' }); ctx.restore();
}
// a field of dots (patients, trials, people): o { x, y, w, h, n, layout 'grid'|'scatter', cols, r, seed, u (grow, staggered), on(k) → 0..1 (lit mint), a }
const FIELD = new Map();
export function dotField(ctx, t, o) {
  const n = o.n, key = `${o.seed ?? 1}:${n}:${o.layout}`, a = o.a ?? 1; if (a <= 0) return;
  if (!FIELD.has(key)) { const r = prng(o.seed ?? 1), pts = []; for (let k = 0; k < n; k++) pts.push([r(), r(), r()]); FIELD.set(key, pts); }
  const pts = FIELD.get(key), cols = o.cols ?? Math.ceil(Math.sqrt(n * o.w / o.h)), rows = Math.ceil(n / cols), rr = o.r ?? 3;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < n; k++) {
    const p = pts[k], e = rise(span(o.u ?? 1, p[2] * .7, p[2] * .7 + .3)); if (e <= 0) continue;
    const x = o.layout === 'grid' ? o.x + (k % cols + .5) * o.w / cols : o.x + p[0] * o.w, y = o.layout === 'grid' ? o.y + (Math.floor(k / cols) + .5) * o.h / rows : o.y + p[1] * o.h;
    const on = o.on ? clamp(o.on(k)) : 0;
    ctx.fillStyle = rgba(mixHex(P.blue1, MINT.body, on), (.45 + .55 * on) * e); ctx.beginPath(); ctx.arc(x, y, rr * (.6 + .4 * e) * (.85 + .25 * on), 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// a ruler of light (weeks, years): o { x, y, w, u (the line grows), fill 0..1 (mint), ticks: [[v 0..1, label]], minor (count), label, a }
export function ruler(ctx, t, o) {
  const u = expoOut(clamp(o.u ?? 1)), a = o.a ?? 1; if (u <= 0 || a <= 0) return;
  const { x, y, w } = o, f = Math.min(clamp(o.fill ?? 0), u);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * u, y); ctx.stroke();
  const mn = o.minor ?? 30; for (let k = 0; k <= mn; k++) { const v = k / mn; if (v > u) break; ctx.strokeStyle = rgba(P.blue1, .7); ctx.beginPath(); ctx.moveTo(x + w * v, y - 6); ctx.lineTo(x + w * v, y + 6); ctx.stroke(); }
  for (const [v, s] of o.ticks || []) { if (v > u + 1e-6) continue; ctx.strokeStyle = rgba(P.cream, .6); ctx.beginPath(); ctx.moveTo(x + w * v, y - 12); ctx.lineTo(x + w * v, y + 12); ctx.stroke(); E.glowText(ctx, s, x + w * v, y + 44, { size: 24, align: 'center', glow: false, col: MINT.text, spacing: .1 }); }
  if (f > 0) mintTrail(ctx, [[x, y], [x + w * f, y]], 1, { w: 5, spark: f < 1 });
  if (o.label) E.glowText(ctx, o.label, x, y - 30, { size: 24, glow: false, spacing: .12, col: MINT.text, a: rise(span(u, .3, 1)) });
  ctx.restore();
}
// a slab of light as a bar: (x, y) = left end, centre line y. o { col 'mint'|'cool'|'stone', u, a, label (left), value (right) }
export function slab(ctx, t, x, y, len, th, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)), L = Math.max(2, len * u), a = o.a ?? 1; if (a <= 0) return;
  const col = o.col ?? 'stone', C = col === 'mint' ? [MINT.core, MINT.body, MINT.deep] : col === 'cool' ? [mixHex(COOL.body, P.cream, .5), COOL.body, COOL.deep] : [mixHex(P.blue1, P.blue0, .3), INK.mid, P.night0];
  ctx.save(); ctx.globalAlpha *= a; const d = th * .5;
  if (col === 'mint') halo(ctx, x + L * .5, y, Math.max(L * .6, th * 2), .16, MINT.halo, MINT.body);
  ctx.fillStyle = C[0]; ctx.beginPath(); ctx.moveTo(x, y - th / 2); ctx.lineTo(x + L, y - th / 2); ctx.lineTo(x + L + d * .6, y - th / 2 - d * .5); ctx.lineTo(x + d * .6, y - th / 2 - d * .5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C[2]; ctx.beginPath(); ctx.moveTo(x + L, y - th / 2); ctx.lineTo(x + L + d * .6, y - th / 2 - d * .5); ctx.lineTo(x + L + d * .6, y + th / 2 - d * .5); ctx.lineTo(x + L, y + th / 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, y - th / 2, 0, y + th / 2, [[0, C[1]], [1, C[2]]]); ctx.fillRect(x, y - th / 2, L, th);
  ctx.restore();
  if (o.label) E.glowText(ctx, o.label, x - 22, y + 9, { size: o.size ?? 24, align: 'right', spacing: .08, glow: false, col: col === 'mint' ? MINT.text : P.cream, a: a * rise(span(o.u ?? 1, 0, .4)) });
  if (o.value) E.glowText(ctx, o.value, x + L + d + 16, y + 10, { size: o.vsize ?? 28, serif: true, col: P.cream, glow: false, a: a * rise(span(o.u ?? 1, .6, 1)) });
}
export function slabBars(ctx, t, o) {
  o.rows.forEach((r, k) => slab(ctx, t, o.x, o.y + k * (o.pitch ?? 64), (o.w ?? 800) * r.v, o.th ?? 30, { col: r.col, label: r.label, value: r.value, u: span(o.u ?? 1, k * (o.stagger ?? .08), k * (o.stagger ?? .08) + .6), a: r.a ?? 1, size: o.size }));
}
// a thin bracket over a span with a label (the honest caveats: one calm line, never a red warning). u grows it from the middle
export function bracket(ctx, x0, x1, y, u, text, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const m = (x0 + x1) / 2, hw = (x1 - x0) / 2 * expoOut(u), col = o.col === 'mint' ? MINT.line : P.halo2;
  ctx.save(); ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(m - hw, y + 16); ctx.lineTo(m - hw, y); ctx.lineTo(m + hw, y); ctx.lineTo(m + hw, y + 16); ctx.stroke(); ctx.restore();
  if (text) maskLine(ctx, [[text, 0]], m, y - 18, o.size ?? 28, rise(span(u, .3, 1)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
}
// a pinned label: a line from the anchor up-right, then TEXT / sub (wipe in from below). u 0..1
export function label(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 50, dy = o.dy ?? -50, x1 = x + dx, y1 = y + dy;
  mintSpan(ctx, [[x, y], [x1, y1]], 0, smooth(clamp(u * 1.6)), { w: 1.6, spark: false });
  maskLine(ctx, [[l1, 0]], x1 + (dx < 0 ? -measure(l1, o.size ?? 26, false) - 6 : 6), y1 - 10, o.size ?? 26, u, { serif: false, weight: 600, col: P.cream, glow: false });
  if (l2) maskLine(ctx, [[l2, 0]], x1 + (dx < 0 ? -measure(l2, (o.size ?? 26) * .72, false) - 6 : 6), y1 + 24, (o.size ?? 26) * .72, rise(span(u, .2, 1)), { serif: false, weight: 600, col: MINT.text, glow: false });
}
// a small source line (left, above the subtitles: y ≤ 880), rises and sinks
export function source(ctx, t, t0, t1, s, o = {}) {
  const u = rise(span(t, t0, t0 + .7)) * (1 - expoIn(span(t, t1 - .5, t1))); if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [[s.toUpperCase(), 0]], o.x ?? 110, o.y ?? 870, o.size ?? 19, u, { serif: false, weight: 600, col: P.halo2, glow: false }); ctx.restore();
}
// source lines (F.source), in film order. text-v2 Einblendungen; the fact sheet (faktenzettel.md) and vo-v3 override.
export const SOURCES = {
  hook: '“…RELICS OF THE PAST IN, I THINK, LESS THAN A DECADE.” · DARIO AMODEI, NOV 10, 2026',
  essay: 'DARIO AMODEI, “MACHINES OF LOVING GRACE”, OCT 2024',
  cart: 'GENERATE BIOMEDICINES / ANTHROPIC, OCT 2026 · LAB TESTS ONLY',   // faktencheck MB1: the 70 % was a design length, never time
  larotrectinib: 'FDA, NOV 2018 · LAROTRECTINIB',
  nci: 'NATIONAL CANCER INSTITUTE',
  ctx310: 'NEJM, NOV 2025 · CTX310',
  fdaGene: 'FDA GUIDANCE 2020 · GENOME EDITING',
  fourier: 'FOURIER TRIAL · NEJM 2017',
  turner: 'TURNER ET AL., NEJM 2008 · FDA REVIEWS',
  alzAssoc: "ALZHEIMER'S ASSOCIATION",
  a4: 'A4 STUDY (SOLANEZUMAB)',
  lumipulse: 'FDA, MAY 2025 · FOR PEOPLE WITH SYMPTOMS, 55+',
  topol: 'ERIC TOPOL, CARDIOLOGIST, ON X',
  amodeiX: 'DARIO AMODEI ON X, AUG 2026',
  mithril: 'ANTHROPIC, OCT 2026',
  procova: 'EMA QUALIFICATION, SEPT 2022 · ~35 %: COMPANY FIGURE',
  elsa: 'FDA, JUNE 2025 · NATIONAL PRIORITY VOUCHER',
};
// the thumbnail line: Inter 600 caps, cream with a soft glow, slightly condensed. u rises, o.out sinks (0..1).
export function thesis(ctx, t, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 110, lines = o.lines ?? ['AI GAVE DISEASE', 'A DEADLINE'];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(.9, 1.08);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)) * (o.out != null ? 1 - expoIn(clamp(o.out * (1 + .12 * (lines.length - 1)) - i * .12)) : 1);
    if (ui > 0) maskLine(ctx, [[ln, 0]], 0, i * size * .98, size, ui, { serif: false, weight: 600, col: P.core0, glow: true });
  });
  ctx.restore();
}

// ======================================================================================================================== CAMERA PATH
// camPath(t, K): a camera that glides THROUGH its keys [[t, cam], …] (monotone cubic in x, y and log distance to F0), instead of
// stopping at each key like E.camAt. The first and last keys are arrivals. Use E.camAt for the expo-in/expo-out dives into a glass.
export function camPath(t, K) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(F0 - c.z)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: F0 - Math.exp(out[2]) });
}

// ======================================================================================================================== QR CORNER
// The support QR overlay (buymeacoffee/qr-overlay, alpha box x 1360–1896, y 24–553) is laid over the master by tools/f54_clips.py assemble
// from the first word of each subscribe call ('This channel exists', 1st and 2nd) for ~27 s (the 2nd ends ≥ .6 s before the 15 s end screen).
// Keep the corner QUIET then: no text, no board, no fast motion in screen x ≥ 1330, y ≤ 580. qrQuiet(T, t) → 0..1 (1 = inside a window).
export const QR = { x: 1330, y: 0, w: 590, h: 580, len: 27, fade: .6, phrase: 'This channel exists', tail: 15 };
export function qrWindows(T) {
  const out = [];
  for (const nth of [0, 1]) { if (!T.gHas(QR.phrase, nth)) continue; const a = T.G(QR.phrase, nth); out.push([a, Math.min(a + QR.len, T.duration - QR.tail - QR.fade)]); }
  return out;
}
export const qrQuiet = (T, t) => qrWindows(T).reduce((m, [a, b]) => Math.max(m, span(t, a - 1, a) * (1 - span(t, b, b + 1))), 0);

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE / ORIGINAL AUDIO)
// The frame grows out of a thing in the scene (o.from = { x, y, w, h } rectangle: the kiosk screen, or [cx, cy, r] circle: the audio post)
// and shrinks back after the clip. Footage frames: <F54CLIPS or the scratchpad f54/clips/>/<id>/f00001.jpg… (30 fps, written by
// tools/f54_clips.py clips). C5 has NO picture (audio only): audioPlate draws name, prize and the waveform (the real envelope from
// <clips>/C5/env.json when it exists). Until the frames exist a placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
// credit lines (text-v2 [CLIP …] Einblendung, clips/schnitt.json 12.11.): name · role · date, and the source after the label
const CLIPS0 = {
  C3: { name: 'Dario Amodei', role: 'CEO, Anthropic', year: 'Feb 2026', src: 'Dwarkesh Podcast', len: 10.45 },
  C5: { name: 'Venki Ramakrishnan', role: 'Nobel Prize in Chemistry 2009', year: 'Nov 2026', src: 'Ryan Peterman podcast', len: 9.32, audio: true },
  C2: { name: 'Dario Amodei', role: 'CEO, Anthropic', year: 'Feb 2026', src: 'Dwarkesh Podcast', len: 8.72 },
};
// the label beside the name. Memory rule (Jakob 21.10.): real clips say ORIGINAL FOOTAGE. C5 is a real recording without picture:
// ORIGINAL AUDIO (one switch here if the lead decides otherwise).
export const CLIP_LABEL = { video: 'ORIGINAL FOOTAGE', audio: 'ORIGINAL AUDIO' };
const CLIPS_JSON = [process.env.F54CLIPSJSON, ROOT + 'audio/clips.json'].find((f) => f && fs.existsSync(f));
const RAWMETA = CLIPS_JSON ? JSON.parse(fs.readFileSync(CLIPS_JSON, 'utf8')) : {};
export const CLIPMETA = Array.isArray(RAWMETA.clips) ? Object.fromEntries(RAWMETA.clips.map((c) => [c.id, c])) : RAWMETA;
export const CLIPS = Object.fromEntries(Object.entries(CLIPS0).map(([id, c]) => { const m = CLIPMETA[id] || {}; return [id, { ...c, ...(m.fit ? { fit: m.fit } : {}) }]; }));
const SP_CLIPS = '/tmp/claude-0/-home-user/0669cef4-5ff5-539f-b7bb-2600687207c6/scratchpad/f54/clips/';
const CLIPDIR = (process.env.F54CLIPS || (fs.existsSync(SP_CLIPS) ? SP_CLIPS : ROOT + 'clips/')).replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; const off = (CLIPMETA[id] || {}).offset || 0; return Math.max(1, Math.min(n, Math.floor((t - win.start - off) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
const CLIP_LEAD = 7;
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    if (CLIPS[id].audio) continue;
    const win = clipWin(T, id); if (!win || t < win.start - CLIP_LEAD || t > win.end + .8) continue;
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
function clipFrameAt(id, t, win) { const k = frameAt(id, t, win); return k ? frameCache.get(framePath(id, k)) || null : null; }
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
function plateBox(o, R) {
  const m = sineIO(clamp(o.morph ?? 1)), f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(8, f.w / 2) };
  return { m, cx: lerp(fr0.cx, R.x + R.w / 2, m), cy: lerp(fr0.cy, R.y + R.h / 2, m), w: lerp(fr0.w, R.w, m), h: lerp(fr0.h, R.h, m), rr: lerp(fr0.r, 14, m) };
}
function plateCredits(ctx, t, win, info, m, o) {
  const R = CLIP_RECT, lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu <= 0) return;
  const by = R.y - 26, nw = maskLine(ctx, [[info.name, 0]], R.x, by, 40, rise(lu), { glow: true });
  maskLine(ctx, [[[info.role, info.year].filter(Boolean).join(' · ').toUpperCase(), 0]], R.x + nw.w + 22, by - 2, 20, rise(lu), { serif: false, col: P.halo2, glow: false });
  const lab = `${info.audio ? CLIP_LABEL.audio : CLIP_LABEL.video} · ${info.src.toUpperCase()}`;
  mintText(ctx, [[lab, .35]], R.x + R.w, by - 2, 20, rise(lu), { serif: false, weight: 600, align: 'right' });
}
// o: { from, morph 0..1 (0 = the source shape, 1 = CLIP_RECT), dark 0..1, credits (false = none), label 0..1 }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], dark = clamp(o.dark ?? 0);
  if (info.audio) return audioPlate(ctx, t, T, id, o);
  const { m, cx, cy, w, h, rr } = plateBox(o, R);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const fr = clipFrameAt(id, t, win);
  if (fr) { const s = (info.fit === 'contain' ? Math.min : Math.max)(R.w / fr.width, R.h / fr.height) * (w / R.w), dw = fr.width * s, dh = fr.height * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1; }
  else {   // PLACEHOLDER (no footage yet): soft light, slow scan band, the slot id and a progress line. Never ship this.
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx, cy - h * .05, w * .7, [[0, rgba(P.blue0, .5 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    const by = cy - h / 2 + ((t * .18) % 1) * h; ctx.fillStyle = rgba(P.cream, .04 * (1 - dark)); ctx.fillRect(cx - w / 2, by - 40, w, 80);
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  plateCredits(ctx, t, win, info, m, o);
  ctx.restore();
  return { cx, cy, w, h };
}
// C5 (audio only): a dark plate, the name big, NOBEL PRIZE IN CHEMISTRY 2009, a mint waveform that moves with the real sound (env.json from
// tools/f54_clips.py clips: RMS per 1/30 s), a playhead. Grows from the audio post's speaker (o.from = [cx, cy, r]). No portrait, ever.
const ENV = new Map();
function envOf(id) { if (!ENV.has(id)) { let e = null; try { e = JSON.parse(fs.readFileSync(CLIPDIR + id + '/env.json', 'utf8')); } catch {} ENV.set(id, e); } return ENV.get(id); }
export function audioPlate(ctx, t, T, id, o = {}) {
  const R = { x: 260, y: 200, w: 1400, h: 600 }, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id];
  const { m, cx, cy, w, h, rr } = plateBox(o, R), u = clamp((t - win.start) / (win.end - win.start));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save(); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr * 2, w / 2, h / 2)); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, cy - h / 2, 0, cy + h / 2, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const k = w / R.w, env = envOf(id), wy = cy + h * .12, ww = w * .86, x0 = cx - ww / 2, n = 140;
  ctx.globalAlpha = span(m, .4, 1);
  for (let i = 0; i < n; i++) {   // bars: the recorded loudness (or a seeded stand-in while env.json is missing); played part bright
    const v = i / n, fi = Math.floor(v * (env ? env.length : 1)), amp = env ? clamp(env[Math.min(env.length - 1, fi)] * (env.scale ?? 1)) : .25 + .5 * Math.abs(Math.sin(i * 1.7) * Math.sin(i * .37 + 1));
    const live = v < u ? 1 : .32, bh = Math.max(2, amp * h * .42 * (v < u && v > u - .03 ? 1.08 : 1));
    ctx.fillStyle = rgba(v < u ? MINT.body : P.blue1, live); ctx.fillRect(x0 + v * ww, wy - bh / 2, ww / n * .55, bh);
  }
  ctx.fillStyle = MINT.core; ctx.fillRect(x0 + u * ww - 1, wy - h * .26, 2, h * .52);
  ctx.globalAlpha = 1; ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = lerp(2, 3, m); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr * 2, w / 2, h / 2)); ctx.stroke();
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start - .4, win.start + .6) * (1 - span(t, win.end - .3, win.end + .3)))) * span(m, .85, 1);
  if (lu > 0) {
    maskLine(ctx, [[info.name, 0]], cx - w / 2 + 70 * k, cy - h / 2 + 130 * k, 76 * k, rise(lu), { glow: true });
    mintText(ctx, [[info.role.toUpperCase(), .5]], cx - w / 2 + 74 * k, cy - h / 2 + 182 * k, 24 * k, rise(span(lu, .2, 1)), { serif: false, weight: 600, spacing: .14 });
    mintText(ctx, [[`${CLIP_LABEL.audio} · ${info.src.toUpperCase()} · ${info.year.toUpperCase()}`, .3]], cx + w / 2 - 60 * k, cy - h / 2 + 64 * k, 18 * k, rise(lu), { serif: false, weight: 600, spacing: .12, align: 'right' });
  }
  ctx.restore();
  return { cx, cy, w, h };
}
