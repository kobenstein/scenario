// Film 19 · "How to Survive the AI Crash" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (stage, palette P, du/person, light, type, finish) + lib/f18_kit.mjs (tag, coin, evap, bump, stand …)
// + lib/f16_kit.mjs (quote, rule, stamp, rise, blink, maskLine, trailSpan, measure, along) + lib/f13_kit.mjs (hourglass).
// docs/MOTION.md §8 is the plan; this header is the API.
//
//   GROUND / PALETTE
//     PRINT19                     the finish for every entry: { grain 14, floor 4, vig .5 }
//     RED                         the ONLY red (accent for losses: lines, shards, red numbers, the button, the ticker). Never a light.
//     GROUND                      'night' (binding, Jakob 7 Nov: no crisis-red ground). Env F19_GROUND=oxblood is kept only as a switch.
//     COOL                        the machine's light (data centers, the bubble film, debt), from Film 18
//     nightGround(ctx, t, o)      sky + ground in screen space: o { hy (horizon y, 640), hills 0..1, stars 0..1, warm 0..1 (dawn, c12), seed }
//     hills(ctx, hy, o)           the two flat thumbnail hills behind the horizon (o.dx parallax, o.a)
//     titleText(ctx, s, x, y, size, o)  heavy condensed caps like thumbnail A (Inter Black ×0.82 wide): o { a, align, col, glow, cond }
//
//   THE UMBRELLA (your protection; the five gores = the five protections)
//     umbrella(ctx, t, x, y, r, o) (x, y) = middle of the rim line; r = half the rim width open. o { open 0..1, lit [5] 0..1 per gore,
//                                 outline 0..1 (empty gores drawn as gold outlines), stick (shaft length below the rim in r, 1.22), glow 0..1 (light under it), wide5 0..1 (gore 5 widens,
//                                 its rim reaches over the others: "you can't build it alone"), flare [{ x: −1..1 along the rim, t0 }]
//                                 (impact flashes ≤ 3 frames, then a short warm ring), tilt (rad), a, shaft (true), hand (false) }
//                                 returns { apex, rim: [[x,y]×6], gore(i) → centre [x, y], handle [x, y] }
//     hudUmbrella(ctx, t, T, o)   top-left HUD (x 60–180, y 50–170), lit from goresAt(t, T) unless o.lit; o { a, lit, x, y, r }
//     HUD_UMB                     { x 120, y 128, r 52 } its geometry; hudGoreCenter(i) → screen point of gore i in the HUD
//     goreIcon(ctx, i, x, y, s, o) the five glyphs: 0 pause ‖ (phone face down) · 1 magnifier · 2 envelope · 3 price tag · 4 net; o { a, lit }
//     GORE_TEXT                   the five on-screen lines (`1 · CALM IN THE LOUDEST WEEK` …)
//     goreFlight(T, i)            { t0, t1 } of protection i's flight (anchored on its key word, shots 4.08 6.06 7.04 9.11 11.18)
//     flyToGore(t, T, i, from, o) position on the arc from `from` [x, y] into HUD gore i: { x, y, s (1 → .26), u, landed }
//     goresAt(t, T)               [5] lit state of the HUD gores at t (0 → 1 over .4 s after each landing). Same in every chunk.
//
//   THE CLOCK (the exits clock 48 / 282 / 517 / 929 days is the film's through-line)
//     flap(ctx, t, x, y, h, o)    split-flap digits, (x, y) top-left, h digit height. o { value (float: the fraction flips the flap),
//                                 digits (3; 4 adds the comma "1,000"), a, glow, label ('DAY' left of the digits, null = none), align }
//                                 returns { w, h } (the drawn size, label included)
//     dayAt(t, T)                 the HUD value at t from ONE shared phrase table (holds, rolls, snaps). Never write your own day numbers.
//     hudDay(ctx, t, T, o)        top-right HUD (x 1620–1860, y 50–150). o { a, value (override only where shots.md says so) }
//
//   THE ROAD (anchor only: you walk, signs come to you; no flights along it)
//     roadCam(o)                  { hy 560, vx 960, f 1700, h 300, z 0, x 0 }: horizon y, vanishing x, focal, eye height, position along/across
//     rpt(rc, X, Z)               road point (Y on the ground) → screen [x, y, s]; null behind the camera. Design size at Z − rc.z = rc.f
//     rStand(ctx, rc, X, Z, fn)   draw fn(s) in design units standing on the road plane at (X, Z) (origin = foot point, y up = −)
//     road(ctx, t, rc, o)         sky + hills + plain + the road into the mist. o { w (half width 260), mist .55, warm 0..1, dash .32,
//                                 stars 1, hills 1, lit (0..1 glow along the road surface), seed }
//     exitSign(ctx, t, rc, X, Z, o)  the exit sign on two posts. o { day, name, year, glyph, lit 0..1, a } → { panel: screen rect }
//     goalSign(ctx, t, rc, X, Z, o)  the DAY 1,000 sign (gold face). o { text, sub, lit, a } → { panel }
//     underRoad(ctx, t, o)        the view under the road: deck underside along the top (o.deckY), cold light. o { deckY 150, a, warm }
//     pillar(ctx, t, x, y0, y1, w, o)  a column under the road; o { label, sub, lit, a } (name plate at the top)
//     netSpan(ctx, t, p0, p1, o)  a safety net between two points. o { sag 120, rows 4, lit 0..1, a, catch: { u, depth }, knots 0..1,
//                                 half 0..1 (only the left part knotted: 11.18), seed }
//
//   THE ROUTE MAP (2.03 on; called back in c05, c08, c09, c12)
//     ROUTE                       { x0 210, x1 1710, y 560 } DAY 0 … DAY 1,000 at true scale; ROUTE.X(day) → x
//     EXITS                       [{ day, name, year, glyph, key }] the four named exits
//     routeMap(ctx, t, o)         o { u (line drawn 0..1), stops [4] 0..1 (grow), names [4] 0..1, dot (today's day, null = none),
//                                 run (gold run from 0 to this day), end 0..1 (the DAY 1,000 tick), a, y, today 0..1 (DAY 30 label) }
//                                 returns { X(day), y, stop(i) → [x, y] }
//     glyph(ctx, kind, x, y, s, o)  'container' · 'dial' · 'bank' (with a crack) · 'www' · 'umbrella' · 'chip' · 'house'; o { a, lit, col }
//
//   THE LOSS LINE (exit windows; endpoints exact from the fact sheet, the way between is shape only)
//     SPX                         { tariff, rate, gfc, dotcom, covid }: { name, year, rec, low, days, pct, back? }
//     lossLine(ctx, t, rect, key, u, o)  rect {x, y, w, h}; the drop from the record (top-left) to the low. o { scale (pct = full h, 60),
//                                 gold 0..1 (the bottom point turns gold: an exit is gold), back 0..1 (dotted creep back to the record line),
//                                 backW (share of rect.w for it, .35), a, w (line width 5) } → { tip, low, rec }
//     redArrow(ctx, t, pts, u, o) the thumbnail's zigzag arrow (thick red band, head at the tip). o { w 46, a } → tip [x, y]
//     shards(ctx, t, x, y, t0, o) red shards breaking off at (x, y) from t0, falling slowly. o { n 16, seed, dir (rad), spread, speed, a }
//
//   WINDOWS (stations open as windows; clips sit in framed windows)
//     vWindow(ctx, t, rect, open, draw, o)  a gold-rimmed window opening from o.from (a rect, e.g. a sign panel; default: a line at the
//                                 centre) to rect. draw(ctx, r, open) paints the inside (clipped). o { mat 0..1 (night around), rim, radius }
//     clipWindow(ctx, t, T, id, rect, o)   vWindow + the clip's frames (cover) + lower third (name · role · date · ORIGINAL FOOTAGE);
//                                 opens over .6 s before the slot and closes .6 s after it, from/into o.from. Quote card (official wording,
//                                 cue by cue) while frames are missing. o { from, label (true), mat }. Frames: tools/clip_frames19.sh.
//     prepareClips19(T, t)        async frame loader (film.prepare calls it; nothing to do in scenes)
//     CLIP_RECT                   the default window { x 330, y 110, w 1260, h 709 }
//
//   THE BUBBLE
//     bubble(ctx, t, x, y, r, o)  thin-film sphere over whatever you drew inside it. o { tremble 0..1, pop 0..1 (the skin tears and
//                                 rolls back, droplets), a, seed } → Path2D of the skin
//     skinFlood(ctx, t, a)        the film filling the frame (the flight through the skin: 2.07 → plateBubble → 3.01)
//
//   POINTS
//     dots100(ctx, t, o)          100 points (or o.n). o { x, y, cols 10, gap 34, r 8, lit: (i) => 0..1, a: (i) => 0..1, pos: (i) => [x, y] }
//                                 lit = warm gold (people / calm), 0 = cool (machine / cost); use f18 `coin(…, { pie })` for the 100-cell coin.
//
// Rules: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import fs from 'node:fs';
import { Path2D, GlobalFonts, loadImage } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, glowFill, halo, rad, lin, prng, drift } = E;

// =================================================================================================================== palette, ground
export const PRINT19 = { grain: 14, floor: 4, vig: .5 };
export const RED = { hot: '#ff6a4d', line: '#e5432f', deep: '#8e1f22', ink: '#3a0b12' };
export const COOL = { core: '#eef3ff', mid: '#b4c8ee', edge: '#6a8cd2', deep: '#2b4a96' };
export const GROUND = (process.env.F19_GROUND || 'night').toLowerCase();
const OX = { night0: '#14040a', night1: '#2a0a10', ind0: '#3d0d16' };   // only if F19_GROUND=oxblood (not used: Jakob, 7 Nov)
const G0 = GROUND === 'oxblood' ? OX.night0 : P.night0, G1 = GROUND === 'oxblood' ? OX.night1 : P.night1, G2 = GROUND === 'oxblood' ? OX.ind0 : P.ind0;
const DAWN = { top: '#1a2a5e', mid: '#46507e', low: '#c9a77a' };

export function hills(ctx, hy, o = {}) {
  const a = o.a ?? 1, dx = o.dx ?? 0; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  // far ridge (left, broad) and near hill (right), flat colour fields as in thumbnail A
  ctx.fillStyle = mixHex(P.ind0, P.blue0, .2 + (o.warm ?? 0) * .2);
  ctx.beginPath(); ctx.moveTo(-40 + dx * .4, hy + 2); ctx.lineTo(-40 + dx * .4, hy - 250); ctx.lineTo(380 + dx * .4, hy - 520); ctx.lineTo(900 + dx * .4, hy - 120); ctx.lineTo(1240 + dx * .4, hy + 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.ind1, P.blue0, .3 + (o.warm ?? 0) * .2);
  ctx.beginPath(); ctx.moveTo(700 + dx * .6, hy + 2); ctx.lineTo(1180 + dx * .6, hy - 300); ctx.lineTo(1480 + dx * .6, hy - 360); ctx.lineTo(1960 + dx * .6, hy - 520); ctx.lineTo(1960 + dx * .6, hy + 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .55);
  ctx.beginPath(); ctx.moveTo(-40 + dx, hy + 2); ctx.lineTo(-40 + dx, hy - 110); ctx.lineTo(260 + dx, hy - 40); ctx.lineTo(520 + dx, hy + 2); ctx.closePath(); ctx.fill();
  ctx.restore();
}
export function nightGround(ctx, t, o = {}) {
  const hy = o.hy ?? 640, warm = clamp(o.warm ?? 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, hy, [[0, mixHex(G0, DAWN.top, warm)], [.6, mixHex(G1, DAWN.mid, warm)], [1, mixHex(mixHex(G2, P.blue1, .35), DAWN.low, warm * .8)]]);
  ctx.fillRect(0, 0, W, hy + 2);
  if ((o.stars ?? 1) > 0) E.stars(ctx, o.seed ?? 1919, 110, t, [0, 0, W, hy * .8], (o.stars ?? 1) * (1 - warm * .8));
  if ((o.hills ?? 1) > 0) hills(ctx, hy, { a: o.hills ?? 1, dx: o.dx ?? 0, warm });
  ctx.fillStyle = lin(ctx, 0, hy, 0, H, [[0, mixHex(mixHex(P.ind0, P.night1, .4), DAWN.mid, warm * .5)], [1, mixHex(P.night0, P.night1, .3)]]);
  ctx.fillRect(0, hy, W, H - hy);
  ctx.restore();
}
try { GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'Inter Black'); } catch { /* optional */ }
export function titleText(ctx, s, x, y, size, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const cond = o.cond ?? .82;
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `${size}px "Inter Black"`; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(s).width * cond, al = o.align ?? 'left', x0 = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x;
  ctx.translate(x0, y); ctx.scale(cond, 1); ctx.textAlign = 'left';
  if (o.glow !== false) { ctx.shadowColor = rgba(P.halo0, .7); ctx.shadowBlur = size * .22; }
  ctx.fillStyle = o.col ?? P.cream; ctx.fillText(s, 0, 0); ctx.shadowBlur = 0; ctx.fillText(s, 0, 0);
  ctx.restore();
  return w;
}

// =================================================================================================================== the umbrella
function umbGeo(x, y, r, open, wide5, tilt, stick = 1.22) {
  const R = r * lerp(.13, 1, open), hh = r * lerp(1.05, .56, open);
  const rot = (px, py) => { const c = Math.cos(tilt), s = Math.sin(tilt), dx = px - x, dy = py - y; return [x + dx * c - dy * s, y + dx * s + dy * c]; };
  const apex = rot(x, y - hh), rim = [];
  // five visible gores across the rim; gore 5 (index 4) widens with wide5 (the others make room)
  const wts = [1, 1, 1, 1, 1 + wide5 * 1.6], tot = wts.reduce((p, q) => p + q, 0);
  let acc = 0; rim.push(rot(x - R, y));
  for (let i = 0; i < 5; i++) { acc += wts[i]; rim.push(rot(x - R + 2 * R * acc / tot, y)); }
  return { R, hh, apex, rim, rot, tip: rot(x, y - hh - r * .1), handle: rot(x, y + r * stick) };
}
function gorePath(g, i, x, y, r, open) {
  const p = new Path2D(), A = g.apex, a = g.rim[i], b = g.rim[i + 1];
  const bulge = (q) => { const u = (q[0] - x) / Math.max(1, g.R); return g.rot(lerp(x, q[0], .98) + u * r * .06, lerp(y - g.hh, y, .45) - Math.abs(u) * r * .02); };
  const ca = bulge(a), cb = bulge(b);
  p.moveTo(A[0], A[1]); p.quadraticCurveTo(ca[0], ca[1], a[0], a[1]);
  // scalloped rim between two rib ends (the cloth hangs up a little between the ribs)
  const mid = g.rot((a[0] + b[0]) / 2, y - r * .07 * open);
  p.quadraticCurveTo(mid[0], mid[1], b[0], b[1]);
  p.quadraticCurveTo(cb[0], cb[1], A[0], A[1]); p.closePath();
  return p;
}
export function umbrella(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1, open = clamp(o.open ?? 1), lit = o.lit ?? [1, 1, 1, 1, 1], outline = clamp(o.outline ?? 0), wide5 = clamp(o.wide5 ?? 0), tilt = o.tilt ?? 0;
  const g = umbGeo(x, y, r, open, wide5, tilt, o.stick ?? 1.22);
  const out = { apex: g.apex, rim: g.rim, handle: g.handle, gore: (i) => { const A = g.apex, a2 = g.rim[i], b2 = g.rim[i + 1]; return [lerp(A[0], (a2[0] + b2[0]) / 2, .62), lerp(A[1], (a2[1] + b2[1]) / 2, .62)]; } };
  if (a <= 0) return out;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const glow = o.glow ?? 1, litSum = lit.reduce((p, q) => p + clamp(q), 0) / 5;
  if (glow > 0 && litSum > 0) halo(ctx, x, y + r * .25, r * 2.1, .3 * glow * litSum);
  // shaft + handle (behind the canopy)
  if (o.shaft !== false) {
    ctx.strokeStyle = mixHex(P.shade0, P.night1, .35); ctx.lineWidth = Math.max(1.5, r * .035);
    ctx.beginPath(); ctx.moveTo(g.tip[0], g.tip[1]); ctx.lineTo(g.handle[0], g.handle[1]);
    const hx = g.handle[0], hy = g.handle[1], k = r * .09;
    ctx.arc(hx - k, hy, k, 0, Math.PI * .95); ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    const path = gorePath(g, i, x, y, r, open), L = clamp(lit[i] ?? 0), alt = i % 2 ? .1 : 0;
    // unlit: a dim blue cloth; lit: gold light (alternate gores a shade darker, as in thumbnail A)
    if (L < 1) { ctx.fillStyle = rgba(mixHex(P.blue2, P.ind2, .5 + alt), .92); ctx.fill(path); }
    if (L > 0) {
      const top = g.apex, bot = [(g.rim[i][0] + g.rim[i + 1][0]) / 2, y];
      ctx.save(); ctx.globalAlpha *= L;
      if (glow > 0) glowFill(ctx, path, r * .22, .45 * glow, P.halo0);
      ctx.fillStyle = lin(ctx, top[0], top[1], bot[0], bot[1] + r * .05, [[0, mixHex(P.core1, P.halo0, .2 + alt * 2)], [.5, mixHex(P.halo0, P.coat, .35 + alt * 1.5)], [1, mixHex(P.coat, P.shade0, .3 + alt)]]);
      ctx.fill(path); ctx.restore();
    }
    if (outline > 0) { ctx.strokeStyle = rgba(P.halo0, .85 * outline); ctx.lineWidth = Math.max(1.2, r * .022); ctx.stroke(path); }
    else { ctx.strokeStyle = rgba(L > .5 ? P.shade0 : P.night1, .55); ctx.lineWidth = Math.max(1, r * .012); ctx.stroke(path); }
  }
  // tip
  ctx.fillStyle = L0(lit) > .5 ? P.halo1 : P.blue2; ctx.beginPath(); ctx.arc(g.tip[0], g.tip[1] + r * .04, Math.max(1.5, r * .028), 0, 7); ctx.fill();
  // impact flares: a white-gold flash at the hit point (≤ 3 frames), then a warm ring along the rim for .6 s
  for (const f of o.flare || []) {
    const dt = t - f.t0; if (dt < 0 || dt > .7) continue;
    const px = lerp(g.rim[0][0], g.rim[5][0], (f.x + 1) / 2), py = y - r * .25 * (1 - Math.abs(f.x));
    if (dt < .1) halo(ctx, px, py, r * .7, .9, P.halo0, P.core0);
    else halo(ctx, px, py, r * .5 * (1 + dt), .45 * (1 - dt / .7));
  }
  if (o.hand) { ctx.fillStyle = P.coat; ctx.beginPath(); ctx.ellipse(g.handle[0], g.handle[1] - r * .25, r * .05, r * .07, 0, 0, 7); ctx.fill(); }
  ctx.restore();
  return out;
}
const L0 = (lit) => lit.reduce((p, q) => p + clamp(q), 0) / 5;

export const HUD_UMB = { x: 120, y: 132, r: 54 };
export const hudGoreCenter = (i) => { const g = umbGeo(HUD_UMB.x, HUD_UMB.y, HUD_UMB.r, 1, 0, 0), A = g.apex, a = g.rim[i], b = g.rim[i + 1]; return [lerp(A[0], (a[0] + b[0]) / 2, .62), lerp(A[1], (a[1] + b[1]) / 2, .62)]; };
export const GORE_TEXT = ['1 · CALM IN THE LOUDEST WEEK', '2 · KNOW WHAT YOU OWN', '3 · A BUFFER', '4 · USE WHAT GOT CHEAP', '5 · SAFETY NETS · BUILT TOGETHER'];
// the five landing words (shots 4.08, 6.06, 7.04, 9.11, 11.18): [fence phrase, key word]
const GORE_KEYS = [['So the first protection', 'pause'], ['So the second protection', 'know what you own'], ['So the third protection', 'buffer'], ['So the fourth protection', 'cheap'], ["That's the fifth protection", 'alone']];
const FLIGHT = 1.1;
const memo = new WeakMap();
const memoT = (T, k, f) => { let m = memo.get(T); if (!m) memo.set(T, m = {}); return m[k] ?? (m[k] = f()); };
export function goreFlight(T, i) {
  return memoT(T, 'gf' + i, () => { const [fence, key] = GORE_KEYS[i]; const t0 = T.G(key, 0, T.G(fence)); return { t0, t1: t0 + FLIGHT }; });
}
export function flyToGore(t, T, i, from, o = {}) {
  const { t0 } = goreFlight(T, i), d = o.d ?? FLIGHT, u = span(t, t0, t0 + d), e = quartIO(u), to = hudGoreCenter(i);
  const cx = (from[0] + to[0]) / 2, cy = Math.min(from[1], to[1]) - (o.lift ?? 180);
  const x = (1 - e) ** 2 * from[0] + 2 * (1 - e) * e * cx + e * e * to[0], y = (1 - e) ** 2 * from[1] + 2 * (1 - e) * e * cy + e * e * to[1];
  return { x, y, s: lerp(o.s0 ?? 1, .26, e), u, landed: u >= 1 };
}
export function goresAt(t, T) { return [0, 1, 2, 3, 4].map((i) => smooth(span(t, goreFlight(T, i).t1, goreFlight(T, i).t1 + .4))); }
export function hudUmbrella(ctx, t, T, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const lit = o.lit ?? goresAt(t, T), U = { ...HUD_UMB, ...(o.at || {}) };
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // a breath of light under it; a landing flashes its gore once
  umbrella(ctx, t, U.x, U.y, U.r, { open: 1, lit, outline: .55, glow: .7, a });
  if (T) for (let i = 0; i < 5; i++) { const { t1 } = goreFlight(T, i), dt = t - t1; if (dt > 0 && dt < .8) { const [gx, gy] = hudGoreCenter(i); halo(ctx, gx, gy, 40 + dt * 40, .55 * a * (1 - dt / .8)); } }
  ctx.restore();
}
export function goreIcon(ctx, i, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = P.core1; ctx.fillStyle = P.core1; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = rgba(P.halo0, .9); ctx.shadowBlur = 26 * (o.lit ?? 1);
  const p = new Path2D();
  if (i === 0) { p.roundRect(-30, -40, 20, 80, 6); p.roundRect(10, -40, 20, 80, 6); ctx.fill(p); }
  else if (i === 1) { p.arc(-10, -10, 32, 0, 7); p.moveTo(13, 13); p.lineTo(44, 44); ctx.stroke(p); }
  else if (i === 2) { p.roundRect(-48, -32, 96, 64, 6); p.moveTo(-46, -28); p.lineTo(0, 6); p.lineTo(46, -28); ctx.stroke(p); }
  else if (i === 3) { p.moveTo(-40, -14); p.lineTo(-6, -46); p.lineTo(42, -46); p.lineTo(42, 30); p.lineTo(-6, 30); p.closePath(); ctx.stroke(p); ctx.beginPath(); ctx.arc(26, -30, 6, 0, 7); ctx.fill(); }
  else { // net: a sagging mesh between two posts
    p.moveTo(-50, -30); p.lineTo(-50, 34); p.moveTo(50, -30); p.lineTo(50, 34);
    for (let k = 0; k < 3; k++) { p.moveTo(-50, -22 + k * 18); p.quadraticCurveTo(0, 6 + k * 18, 50, -22 + k * 18); }
    for (let k = -2; k <= 2; k++) { p.moveTo(k * 20, -14 + Math.abs(k) * -2); p.lineTo(k * 20 + 6, 34 - Math.abs(k) * 6); }
    ctx.lineWidth = 5; ctx.stroke(p);
  }
  ctx.restore();
}

// =================================================================================================================== the clock
const digitAt = (n, k) => Math.floor(Math.max(0, n) / 10 ** k) % 10;
export function flap(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1, v = Math.max(0, o.value ?? 0), n = o.digits ?? (v >= 999.5 ? 4 : 3);
  const cw = h * .7, gap = h * .09, comma = n >= 4 ? h * .22 : 0, lab = o.label === undefined ? 'DAY' : o.label;
  ctx.save(); ctx.font = `600 ${Math.round(h * .3)}px Inter`; ctx.letterSpacing = '0.12em';
  const lw = lab ? ctx.measureText(lab).width + h * .22 : 0;
  const totalW = lw + n * cw + (n - 1) * gap + comma;
  if (a <= 0) { ctx.restore(); return { w: totalW, h }; }
  const x0 = o.align === 'right' ? x - totalW : o.align === 'center' ? x - totalW / 2 : x;
  ctx.globalAlpha *= a;
  if (lab) { ctx.fillStyle = P.halo0; ctx.textBaseline = 'middle'; ctx.shadowColor = rgba(P.halo0, .6); ctx.shadowBlur = h * .2; ctx.fillText(lab, x0, y + h * .52); ctx.shadowBlur = 0; }
  ctx.letterSpacing = '0px';
  const base = Math.floor(v + 1e-6), f = v - base, glow = o.glow ?? 1;
  ctx.font = `600 ${Math.round(h * .8)}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let cx = x0 + lw;
  for (let j = 0; j < n; j++) {
    const k = n - 1 - j, dA = digitAt(base, k), dB = digitAt(base + 1, k), flipping = dA !== dB && f > 0;
    const cell = new Path2D(); cell.roundRect(cx, y, cw, h, h * .1);
    if (glow > 0) glowFill(ctx, cell, h * .35, .32 * glow, P.blue0);
    ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(P.ind1, P.blue1, .3)], [.5, P.ind1], [.5, P.night2], [1, mixHex(P.night2, P.ind0, .5)]]); ctx.fill(cell);
    ctx.strokeStyle = rgba(P.halo1, .45); ctx.lineWidth = Math.max(1, h * .025); ctx.stroke(cell);
    const half = (d, top, sy = 1) => {
      ctx.save(); ctx.beginPath(); ctx.rect(cx, top ? y : y + h / 2, cw, h / 2); ctx.clip();
      ctx.translate(0, y + h / 2); ctx.scale(1, sy); ctx.translate(0, -(y + h / 2));
      if (sy < 1) { ctx.fillStyle = top ? mixHex(P.ind1, P.blue1, .3) : P.night2; ctx.fillRect(cx, top ? y : y + h / 2, cw, h / 2); }
      ctx.fillStyle = P.cream; ctx.shadowColor = rgba(P.halo0, .75 * glow); ctx.shadowBlur = h * .22 * glow; ctx.fillText(String(d), cx + cw / 2, y + h * .54);
      ctx.restore();
    };
    if (!flipping) { half(dA, true); half(dA, false); }
    else {
      half(dB, true); half(dA, false);                          // behind: new top, old bottom
      if (f < .5) half(dA, true, 1 - 2 * f); else half(dB, false, 2 * f - 1);   // the falling leaf
    }
    ctx.fillStyle = rgba(P.night0, .85); ctx.fillRect(cx, y + h / 2 - Math.max(1, h * .012), cw, Math.max(2, h * .024));   // split line
    cx += cw + gap;
    if (n >= 4 && j === 0) { ctx.fillStyle = P.cream; ctx.font = `600 ${Math.round(h * .6)}px Inter`; ctx.fillText(',', cx + comma / 2 - gap / 2, y + h * .82); ctx.font = `600 ${Math.round(h * .8)}px Inter`; cx += comma; }
  }
  ctx.restore();
  return { w: totalW, h };
}
// ONE table for the whole film: [t0, t1, from, to] rolls (t1 = t0 → snap). Holds between them.
function dayTable(T) {
  return memoT(T, 'days', () => {
    const G = (p, n = 0, af = -1) => T.G(p, n, af), GE = (p, n = 0, af = -1) => T.GE(p, n, af);
    const rec = G('last record high'), oct = G('October sixth');
    const K = [
      [rec, rec + .9, 30, 0],                                                     // the clock rewinds to the record high
      [oct, GE('October sixth') + .8, 0, 30],                                     // and runs to today
      [G('Day thirty-one'), G('Day thirty-one'), 30, 31],
      [G('Day forty-eight') - .2, GE('Day forty-eight'), 31, 48],
      [G('time to think'), GE('Day two hundred eighty-two'), 48, 282],            // 7.10: the counter runs fast (hourglass)
      [G('Day five hundred seventeen') - .3, GE('Day five hundred seventeen'), 282, 517],
      [G('Day nine hundred twenty-nine') - .3, GE('Day nine hundred twenty-nine'), 517, 929],
      [G('Day one thousand') - 1.6, GE('Day one thousand'), 929, 1000],           // 12.01: the flaps land on 1,000
      [G('On day thirty'), GE('On day thirty') + .5, 1000, 30],                   // back to the day of the drop
      [G('barely started') - .4, GE('barely started'), 30, 32],                   // the upload day (Sat 7 Nov 2026; 6 Oct = day 0)
    ];
    return K;
  });
}
export function dayAt(t, T) {
  let v = 30;
  for (const [t0, t1, a, b] of dayTable(T)) {
    if (t < t0) break;
    v = t1 <= t0 || t >= t1 ? b : lerp(a, b, sineIO((t - t0) / (t1 - t0)));
  }
  return v;
}
export const HUD_DAY = { x: 1858, y: 76, h: 50 };
export function hudDay(ctx, t, T, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  flap(ctx, t, HUD_DAY.x, HUD_DAY.y, HUD_DAY.h, { value: o.value ?? dayAt(t, T), a, align: 'right', glow: .8 });
  ctx.restore();
}

// =================================================================================================================== the road
export const roadCam = (o = {}) => ({ hy: 560, vx: 960, f: 1700, h: 300, z: 0, x: 0, ...o });
export function rpt(rc, X, Z) { const dz = Z - rc.z; if (dz < 20) return null; const s = rc.f / dz; return [rc.vx + (X - rc.x) * s, rc.hy + rc.h * s, s]; }
export function rStand(ctx, rc, X, Z, fn) { const p = rpt(rc, X, Z); if (!p) return null; ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(p[2], p[2]); fn(p[2]); ctx.restore(); return p; }
export function road(ctx, t, rc, o = {}) {
  const w = o.w ?? 260, warm = clamp(o.warm ?? 0), far = rc.z + 90000;
  nightGround(ctx, t, { hy: rc.hy, hills: o.hills ?? 1, stars: o.stars ?? 1, warm, dx: -rc.x * .02, seed: o.seed });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const near = rc.z + 40, A = rpt(rc, -w, near), B = rpt(rc, w, near), C = rpt(rc, w, far), D = rpt(rc, -w, far);
  const surf = new Path2D(); surf.moveTo(A[0], A[1]); surf.lineTo(B[0], B[1]); surf.lineTo(C[0], C[1]); surf.lineTo(D[0], D[1]); surf.closePath();
  ctx.fillStyle = lin(ctx, 0, rc.hy, 0, H, [[0, mixHex(P.blue2, P.ind1, .35)], [.25, mixHex(P.ind2, P.blue2, .4)], [1, mixHex(P.night2, P.ind2, .6)]]); ctx.fill(surf);
  if ((o.lit ?? 0) > 0) { ctx.save(); ctx.clip(surf); ctx.fillStyle = lin(ctx, 0, rc.hy, 0, H, [[0, rgba(P.halo0, .0)], [.3, rgba(P.halo1, .18 * o.lit)], [1, rgba(P.halo0, .05 * o.lit)]]); ctx.fillRect(0, rc.hy, W, H - rc.hy); ctx.restore(); }
  // verges
  ctx.strokeStyle = rgba(P.cream, .22); ctx.lineWidth = 1.6;
  for (const sx of [-1, 1]) { const p = rpt(rc, sx * w * .96, near), q = rpt(rc, sx * w * .96, far); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
  // centre dashes (they come towards you as rc.z grows)
  const dash = o.dash ?? .32, per = 900, len = 380;
  if (dash > 0) {
    ctx.fillStyle = rgba(P.halo0, dash);
    for (let z0 = Math.floor(rc.z / per) * per; z0 < rc.z + 30000; z0 += per) {
      const p0 = rpt(rc, -6, Math.max(z0, near)), p1 = rpt(rc, 6, Math.max(z0, near)), q0 = rpt(rc, -6, z0 + len), q1 = rpt(rc, 6, z0 + len);
      if (!p0 || !q0 || z0 + len < near) continue;
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(q1[0], q1[1]); ctx.lineTo(q0[0], q0[1]); ctx.closePath(); ctx.fill();
    }
  }
  // mist on the horizon (the road ends in it)
  const m = o.mist ?? .55;
  if (m > 0) { ctx.fillStyle = lin(ctx, 0, rc.hy - 90, 0, rc.hy + 110, [[0, rgba(P.blue2, 0)], [.45, rgba(mixHex(P.blue2, DAWN.low, warm * .6), .55 * m)], [1, rgba(P.blue2, 0)]]); ctx.fillRect(0, rc.hy - 90, W, 200); }
  ctx.restore();
}
function signPanel(ctx, w, h, lit, gold) {
  const p = new Path2D(); p.roundRect(-w / 2, -h, w, h, 10);
  glowFill(ctx, p, 30, .35 + .25 * lit, P.blue0);
  ctx.fillStyle = gold ? lin(ctx, 0, -h, 0, 0, [[0, mixHex(P.core0, P.halo0, .3)], [1, P.halo1]]) : lin(ctx, 0, -h, 0, 0, [[0, mixHex(P.ind1, P.blue1, .35)], [1, P.ind1]]);
  ctx.fill(p);
  if (lit > 0 && !gold) { ctx.save(); ctx.globalAlpha *= lit; glowFill(ctx, p, 22, .4, P.halo0); ctx.restore(); }
  ctx.strokeStyle = rgba(gold ? P.shade0 : P.halo0, .55 + .4 * lit); ctx.lineWidth = 3; ctx.stroke(p);
}
function posts(ctx, w, top) { ctx.fillStyle = mixHex(P.night1, P.blue2, .3); for (const sx of [-1, 1]) ctx.fillRect(sx * w * .3 - 5, -top, 10, top); }
export function exitSign(ctx, t, rc, X, Z, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 0), pw = 470, ph = 230, top = 330;
  let panel = null;
  const p = rStand(ctx, rc, X, Z, () => {
    ctx.globalAlpha *= a; posts(ctx, pw, top);
    ctx.save(); ctx.translate(0, -top); signPanel(ctx, pw, ph, lit, false);
    E.glowText(ctx, `EXIT · DAY ${o.day ?? ''}`, -pw / 2 + 28, -ph + 50, { size: 26, col: P.halo0, spacing: .08 });
    E.glowText(ctx, o.name ?? '', -pw / 2 + 28, -ph + 118, { size: o.name && o.name.length > 17 ? 31 : 36, spacing: .02 });
    E.glowText(ctx, String(o.year ?? ''), -pw / 2 + 28, -ph + 168, { size: 24, weight: 500, col: P.halo2, glow: false });
    if (o.glyph) glyph(ctx, o.glyph, pw / 2 - 64, -ph + 58, .62, { lit: .5 + lit * .5 });
    ctx.restore();
  });
  if (p) panel = { x: p[0] - pw / 2 * p[2], y: p[1] - (top + ph) * p[2], w: pw * p[2], h: ph * p[2] };
  return { panel };
}
export function goalSign(ctx, t, rc, X, Z, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 1), pw = 420, ph = 190, top = 360;
  let panel = null;
  const p = rStand(ctx, rc, X, Z, () => {
    ctx.globalAlpha *= a; posts(ctx, pw, top);
    ctx.save(); ctx.translate(0, -top); signPanel(ctx, pw, ph, lit, true);
    ctx.fillStyle = P.night1; ctx.font = '600 70px Inter'; ctx.textAlign = 'center'; ctx.fillText(o.text ?? 'DAY 1,000', 0, -ph / 2 + 18);
    if (o.sub) { ctx.font = '600 22px Inter'; ctx.letterSpacing = '0.1em'; ctx.fillText(o.sub, 0, -26); }
    ctx.restore();
    if (lit > 0) halo(ctx, 0, -top - ph / 2, 360, .25 * lit);
  });
  if (p) panel = { x: p[0] - pw / 2 * p[2], y: p[1] - (top + ph) * p[2], w: pw * p[2], h: ph * p[2] };
  return { panel };
}
export function underRoad(ctx, t, o = {}) {
  const dy = o.deckY ?? 150, a = o.a ?? 1, warm = clamp(o.warm ?? 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, DAWN.top, warm)], [.5, mixHex(P.night1, DAWN.mid, warm * .7)], [1, mixHex(mixHex(P.ind0, P.blue1, .25), DAWN.low, warm * .5)]]); ctx.fillRect(0, 0, W, H);
  // the deck: a dark slab with ribs, a thin cold seam of road light along its lower edge
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(0, 0, W, dy);
  ctx.strokeStyle = rgba(P.blue2, .55); ctx.lineWidth = 2;
  for (let x = 40; x < W; x += 160) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, dy); ctx.stroke(); }
  ctx.fillStyle = rgba(COOL.mid, .35 + warm * .2); ctx.fillRect(0, dy - 3, W, 3);
  ctx.fillStyle = lin(ctx, 0, dy, 0, dy + 120, [[0, rgba(COOL.edge, .18)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(0, dy, W, 120);
  ctx.restore();
}
export function pillar(ctx, t, x, y0, y1, w, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 0); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.ind1, P.blue1, .35)], [.35, P.ind1], [1, P.night1]]); ctx.fillRect(x - w / 2, y0, w, y1 - y0);
  ctx.fillStyle = rgba(COOL.mid, .25); ctx.fillRect(x - w / 2, y0, 2, y1 - y0);
  if (o.label) {
    const py = y0 + (o.plateY ?? 60);
    const pl = new Path2D(); pl.roundRect(x - w * .46, py, w * .92, o.sub ? 70 : 46, 6);
    ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.fill(pl); ctx.strokeStyle = rgba(P.halo0, .35 + .5 * lit); ctx.lineWidth = 2; ctx.stroke(pl);
    E.glowText(ctx, o.label, x, py + 31, { size: o.size ?? 20, align: 'center', spacing: .08, col: lit > .5 ? P.cream : mixHex(P.cream, P.blue2, .3) });
    if (o.sub) E.glowText(ctx, o.sub, x, py + 58, { size: 17, weight: 500, align: 'center', col: P.halo2, glow: false, spacing: .1 });
  }
  ctx.restore();
}
export function netSpan(ctx, t, p0, p1, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 0), rows = o.rows ?? 4, sag = o.sag ?? 120, half = o.half ?? 1, kn = o.knots ?? 1;
  if (a <= 0) return;
  const [x0, y0] = p0, [x1, y1] = p1, L = Math.hypot(x1 - x0, y1 - y0), cols = Math.max(4, Math.round(L / 70)), depth = o.depth ?? 26;
  const c = o.catch;
  const pt = (u, r) => {   // u along, r row 0..rows-1 (row 0 = top rope); breathing sway, a caught weight pulls it down
    let y = lerp(y0, y1, u) + r * depth + 4 * sag * u * (1 - u) * (1 + r * .06) + Math.sin(t * .9 + u * 6) * 2;
    if (c) y += c.depth * Math.exp(-(((u - c.u) / .16) ** 2));
    return [lerp(x0, x1, u), y];
  };
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  const col = mixHex(COOL.mid, P.halo0, lit), w = 2.2;
  ctx.strokeStyle = rgba(col, .55 + .35 * lit); ctx.lineWidth = w;
  if (lit > 0) { ctx.shadowColor = rgba(P.halo0, .7 * lit); ctx.shadowBlur = 12; }
  const umax = half;
  for (let r = 0; r < rows; r++) { ctx.beginPath(); for (let k = 0; k <= 40; k++) { const u = k / 40 * umax, q = pt(u, r); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); }
  // diagonal mesh between rows
  ctx.lineWidth = 1.4;
  for (let j = 0; j < cols; j++) for (let r = 0; r < rows - 1; r++) {
    const u0 = j / cols, u1 = (j + 1) / cols; if (u1 > umax + 1e-6) continue;
    const A = pt(u0, r), B = pt(u1, r + 1), C = pt(u1, r), D = pt(u0, r + 1);
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.moveTo(C[0], C[1]); ctx.lineTo(D[0], D[1]); ctx.stroke();
  }
  ctx.shadowBlur = 0;
  if (kn > 0) { ctx.fillStyle = rgba(mixHex(COOL.core, P.core1, lit), .8 * kn); for (let j = 0; j <= cols; j++) for (let r = 0; r < rows; r++) { const u = j / cols; if (u > umax + 1e-6) continue; const q = pt(u, r); ctx.beginPath(); ctx.arc(q[0], q[1], 2.6, 0, 7); ctx.fill(); } }
  ctx.restore();
}

// =================================================================================================================== route map + glyphs
export const ROUTE = { x0: 210, x1: 1710, y: 560, X: (d) => lerp(210, 1710, d / 1000) };
export const EXITS = [
  { day: 48, name: 'THE TARIFF CRASH', year: 2025, glyph: 'container', key: 'tariff' },
  { day: 282, name: 'THE RATE SHOCK', year: 2022, glyph: 'dial', key: 'rate' },
  { day: 517, name: 'THE FINANCIAL CRISIS', year: 2008, glyph: 'bank', key: 'gfc' },
  { day: 929, name: 'THE DOT-COM BUBBLE', year: 2000, glyph: 'www', key: 'dotcom' },
];
export function routeMap(ctx, t, o = {}) {
  const a = o.a ?? 1, y = o.y ?? ROUTE.y, X = (d) => lerp(o.x0 ?? ROUTE.x0, o.x1 ?? ROUTE.x1, d / 1000), u = clamp(o.u ?? 1);
  const out = { X, y, stop: (i) => [X(EXITS[i].day), y] };
  if (a <= 0) return out;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  const xa = X(0), xb = lerp(xa, X(1000), u);
  ctx.strokeStyle = rgba(P.cream, .38); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.stroke();
  if (o.run != null && o.run > 0) { const xr = Math.min(xb, X(o.run)); ctx.strokeStyle = P.halo0; ctx.lineWidth = 5; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xr, y); ctx.stroke(); ctx.shadowBlur = 0; }
  // DAY 0 tick + label (below), DAY 1,000 end tick
  ctx.fillStyle = P.cream; ctx.fillRect(xa - 1.5, y - 16, 3, 32);
  E.glowText(ctx, 'DAY 0', xa - 18, y + 7, { size: 20, align: 'right', col: P.halo2, glow: false, spacing: .1, a: clamp(u * 4) });
  const end = clamp(o.end ?? 0);
  if (end > 0) { ctx.fillStyle = rgba(P.cream, end); ctx.fillRect(X(1000) - 1.5, y - 16, 3, 32); E.glowText(ctx, 'DAY 1,000', X(1000) + 18, y + 8, { size: 22, a: end, spacing: .08 }); }
  // the stops
  EXITS.forEach((ex, i) => {
    const g = clamp(o.stops?.[i] ?? 0), nm = clamp(o.names?.[i] ?? 0), x = X(ex.day); if (g <= 0 || x > xb + 1) return;
    const e = expoOut(g);
    ctx.fillStyle = P.night1; ctx.strokeStyle = P.halo0; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 15 * e, 0, 7); ctx.fill(); ctx.stroke();
    if ((o.lit?.[i] ?? 0) > 0) halo(ctx, x, y, 70, .5 * o.lit[i]);
    glyph(ctx, ex.glyph, x, y - 128 + (1 - e) * 30, .92 * e, { a: e, lit: .6 + .4 * (o.lit?.[i] ?? 0) });
    E.glowText(ctx, `DAY ${ex.day}`, x, y - 46 + (1 - e) * 12, { size: 29, align: 'center', col: P.halo0, a: e, spacing: .06 });
    if (nm > 0) {
      E.glowText(ctx, ex.name, x, y + 60 + (1 - nm) * 14, { size: 29, align: 'center', a: nm, spacing: .02 });
      E.glowText(ctx, String(ex.year), x, y + 94 + (1 - nm) * 14, { size: 22, weight: 500, align: 'center', a: nm, col: P.halo2, glow: false, spacing: .1 });
    }
  });
  // today's dot
  if (o.dot != null) {
    const x = X(o.dot), td = clamp(o.today ?? 1);
    halo(ctx, x, y, 60, .55 * td); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.fill();
    if (o.dotLabel) E.glowText(ctx, o.dotLabel, x - 20, y - 22, { size: 20, align: 'right', a: td, spacing: .08 });
  }
  ctx.restore();
  return out;
}
export function glyph(ctx, kind, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = o.col ?? P.core1; ctx.fillStyle = o.col ?? P.core1; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = rgba(P.halo0, .85); ctx.shadowBlur = 20 * (o.lit ?? 1);
  const p = new Path2D();
  if (kind === 'container') { p.rect(-56, -34, 112, 68); for (let k = -40; k <= 40; k += 16) { p.moveTo(k, -26); p.lineTo(k, 26); } ctx.stroke(p); }
  else if (kind === 'dial') { p.arc(0, 18, 52, Math.PI, 0); p.moveTo(-52, 18); p.lineTo(52, 18); for (let k = 0; k <= 4; k++) { const an = Math.PI + k * Math.PI / 4; p.moveTo(Math.cos(an) * 42, 18 + Math.sin(an) * 42); p.lineTo(Math.cos(an) * 52, 18 + Math.sin(an) * 52); } p.moveTo(0, 18); p.lineTo(34, -18); ctx.stroke(p); }
  else if (kind === 'bank') { p.moveTo(-58, -18); p.lineTo(0, -48); p.lineTo(58, -18); p.closePath(); for (const k of [-40, -14, 14, 40]) { p.moveTo(k, -10); p.lineTo(k, 34); } p.moveTo(-62, 40); p.lineTo(62, 40); ctx.stroke(p); ctx.strokeStyle = RED.line; ctx.shadowBlur = 0; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(6, -46); ctx.lineTo(-4, -26); ctx.lineTo(8, -10); ctx.lineTo(-2, 14); ctx.stroke(); }
  else if (kind === 'www') { p.ellipse(0, -4, 62, 40, 0, 0, 7); ctx.stroke(p); ctx.font = '600 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('www', 0, -3); }
  else if (kind === 'umbrella') { p.moveTo(-56, 0); p.quadraticCurveTo(0, -70, 56, 0); for (const k of [-34, -10, 10, 34]) { p.moveTo(-56 + (k + 56) * 1, 0); } p.moveTo(-56, 0); p.lineTo(56, 0); p.moveTo(0, -36); p.lineTo(0, 40); p.arc(-8, 40, 8, 0, Math.PI); ctx.stroke(p); }
  else if (kind === 'chip') { p.roundRect(-36, -36, 72, 72, 8); for (let k = -24; k <= 24; k += 16) { p.moveTo(k, -36); p.lineTo(k, -50); p.moveTo(k, 36); p.lineTo(k, 50); p.moveTo(-36, k); p.lineTo(-50, k); p.moveTo(36, k); p.lineTo(50, k); } ctx.stroke(p); }
  else if (kind === 'house') { p.moveTo(-48, -6); p.lineTo(0, -48); p.lineTo(48, -6); p.moveTo(-38, -14); p.lineTo(-38, 40); p.lineTo(38, 40); p.lineTo(38, -14); ctx.stroke(p); }
  ctx.restore();
}

// =================================================================================================================== loss line, arrow, shards
export const SPX = {
  tariff: { name: 'THE TARIFF CRASH', year: 2025, rec: 'FEB 19, 2025', low: 'APR 8, 2025', days: 48, pct: -19 },
  rate: { name: 'THE RATE SHOCK', year: 2022, rec: 'JAN 3, 2022', low: 'OCT 12, 2022', days: 282, pct: -25 },
  gfc: { name: 'THE FINANCIAL CRISIS', year: 2008, rec: 'OCT 9, 2007', low: 'MAR 9, 2009', days: 517, pct: -57 },
  dotcom: { name: 'THE DOT-COM BUBBLE', year: 2000, rec: 'MAR 24, 2000', low: 'OCT 9, 2002', days: 929, pct: -49, back: 'MAY 30, 2007' },
  covid: { name: 'THE COVID CRASH', year: 2020, rec: 'FEB 19, 2020', low: 'MAR 23, 2020', days: 33, pct: -34 },
};
// shape only (0 = record, 1 = the low); seeded wiggle, the low is reached only at the end
const SHAPE = {
  tariff: (x) => x < .62 ? .22 * x / .62 + .05 * Math.sin(x * 30) : .22 + .78 * ((x - .62) / .38) ** 1.4,
  rate: (x) => x * .92 + .1 * Math.sin(x * 19) * x,
  gfc: (x) => x < .55 ? .3 * x / .55 + .05 * Math.sin(x * 26) : x < .8 ? .3 + .5 * (x - .55) / .25 : .8 + .2 * ((x - .8) / .2) + .06 * Math.sin((x - .8) * 30),
  dotcom: (x) => x * .95 + .09 * Math.sin(x * 22) + .04 * Math.sin(x * 51),
  covid: (x) => x ** 2.2 + .03 * Math.sin(x * 25) * x,
};
const LOSS_PTS = {};
function lossPts(key) {
  if (LOSS_PTS[key]) return LOSS_PTS[key];
  const r = prng(key.length * 977 + 13), n = 72, pts = [];
  for (let i = 0; i <= n; i++) { const x = i / n; let y = SHAPE[key](x) + (r() - .5) * .035; if (i === 0) y = 0; if (i === n) y = 1; pts.push([x, clamp(y, 0, i === n ? 1 : .975)]); }
  return (LOSS_PTS[key] = pts);
}
export function lossLine(ctx, t, rect, key, u, o = {}) {
  const S = SPX[key], pts = lossPts(key), sc = o.scale ?? 60, dep = -S.pct / sc, bw = o.back ? (o.backW ?? .35) : 0;
  const wMain = rect.w * (1 - (o.backW ?? .35) * (o.back != null ? 1 : 0));
  const P2 = (q) => [rect.x + q[0] * wMain, rect.y + q[1] * dep * rect.h];
  const out = { rec: [rect.x, rect.y], low: P2([1, 1]), tip: null };
  const a = o.a ?? 1; if (a <= 0 || u <= 0) return out;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const k = u * (pts.length - 1), n = Math.floor(k), f = k - n, path = new Path2D();
  for (let i = 0; i <= n; i++) { const q = P2(pts[i]); i ? path.lineTo(q[0], q[1]) : path.moveTo(q[0], q[1]); }
  let tip = P2(pts[n]);
  if (n < pts.length - 1) { const q0 = P2(pts[n]), q1 = P2(pts[n + 1]); tip = [lerp(q0[0], q1[0], f), lerp(q0[1], q1[1], f)]; path.lineTo(tip[0], tip[1]); }
  ctx.shadowColor = rgba(RED.deep, .9); ctx.shadowBlur = 14; ctx.strokeStyle = RED.line; ctx.lineWidth = o.w ?? 5; ctx.stroke(path); ctx.shadowBlur = 0;
  if (u < 1) { ctx.fillStyle = RED.hot; ctx.beginPath(); ctx.arc(tip[0], tip[1], (o.w ?? 5) * 1.1, 0, 7); ctx.fill(); }
  const gold = clamp(o.gold ?? 0);
  if (gold > 0) { const L = out.low; halo(ctx, L[0], L[1], 90, .6 * gold); ctx.fillStyle = rgba(P.core0, gold); ctx.beginPath(); ctx.arc(L[0], L[1], 11 * expoOut(gold), 0, 7); ctx.fill(); }
  const back = clamp(o.back ?? 0);
  if (back > 0) {   // dotted creep back to the record line
    const L = out.low, R = [rect.x + rect.w, rect.y];
    ctx.setLineDash([2, 12]); ctx.strokeStyle = rgba(P.halo0, .85); ctx.lineWidth = 4; ctx.beginPath();
    for (let i = 0; i <= 40 * back; i++) { const s = i / 40, x = lerp(L[0], R[0], s), y = lerp(L[1], R[1], s ** 1.15) + Math.sin(s * 14) * 6 * (1 - s); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.restore();
  out.tip = tip; return out;
}
export function redArrow(ctx, t, pts, u, o = {}) {
  const a = o.a ?? 1, w = o.w ?? 46; if (a <= 0 || u <= 0) return pts[0];
  // length-parametrised partial polyline
  const seg = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let left = clamp(u) * tot; const vis = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (left >= seg[i - 1]) { vis.push(pts[i]); left -= seg[i - 1]; } else { const f = left / seg[i - 1]; vis.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]); break; } }
  const tip = vis[vis.length - 1], prev = vis[vis.length - 2] || pts[0], ang = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
  const hl = w * 1.5, base = [tip[0] - Math.cos(ang) * hl * .8, tip[1] - Math.sin(ang) * hl * .8];
  ctx.save(); ctx.globalAlpha *= a; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
  ctx.strokeStyle = RED.line; ctx.lineWidth = w; ctx.shadowColor = rgba(RED.deep, .8); ctx.shadowBlur = 24;
  ctx.beginPath(); vis.slice(0, -1).forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.lineTo(base[0], base[1]); ctx.stroke();
  ctx.fillStyle = RED.line; ctx.beginPath(); ctx.moveTo(tip[0] + Math.cos(ang) * hl * .25, tip[1] + Math.sin(ang) * hl * .25);
  ctx.lineTo(base[0] + Math.cos(ang + Math.PI / 2) * w * 1.05, base[1] + Math.sin(ang + Math.PI / 2) * w * 1.05);
  ctx.lineTo(base[0] - Math.cos(ang + Math.PI / 2) * w * 1.05, base[1] - Math.sin(ang + Math.PI / 2) * w * 1.05); ctx.closePath(); ctx.fill();
  ctx.restore();
  return tip;
}
export function shards(ctx, t, x, y, t0, o = {}) {
  const dt = t - t0, a = o.a ?? 1; if (dt < 0 || a <= 0) return;
  const r = prng(o.seed ?? 77), n = o.n ?? 16, dir = o.dir ?? -Math.PI / 4, spr = o.spread ?? 1.6, sp = o.speed ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < n; i++) {
    const an = dir + (r() - .5) * spr * 2, v = (120 + r() * 260) * sp, size = 8 + r() * 34, spin = (r() - .5) * 3, pts = [r(), r(), r()];
    const life = 1.6 + r() * 1.6, k = dt / life; if (k > 1) continue;
    const dd = (1 - Math.exp(-dt * 1.6)) / 1.6;     // air drag: quick break, slow drift
    const px = x + Math.cos(an) * v * dd, py = y + Math.sin(an) * v * dd + 60 * dt * dt * sp;
    ctx.save(); ctx.translate(px, py); ctx.rotate(spin * dt + an);
    ctx.fillStyle = mixHex(i % 3 ? RED.line : RED.hot, RED.deep, smooth(k)); ctx.globalAlpha *= 1 - smooth(span(k, .7, 1));
    ctx.beginPath(); ctx.moveTo(-size * .5, -size * .3 * pts[0]); ctx.lineTo(size * .6, -size * .2); ctx.lineTo(size * (pts[1] - .3), size * (.3 + pts[2] * .4)); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// =================================================================================================================== windows + clips
const lerpRect = (A, B, e) => ({ x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e), w: lerp(A.w, B.w, e), h: lerp(A.h, B.h, e) });
export function vWindow(ctx, t, rect, open, draw, o = {}) {
  const u = clamp(open); if (u <= 0) return null;
  const from = o.from ?? { x: rect.x + rect.w * .45, y: rect.y + rect.h / 2 - 2, w: rect.w * .1, h: 4 };
  const r = lerpRect(from, rect, quartIO(u)), rr = o.radius ?? 10;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if ((o.mat ?? 0) > 0) { ctx.fillStyle = rgba(P.night0, .55 * o.mat * u); ctx.fillRect(0, 0, W, H); }
  const p = new Path2D(); p.roundRect(r.x, r.y, r.w, r.h, rr);
  glowFill(ctx, p, 40, .5, P.halo0);
  ctx.save(); ctx.clip(p); ctx.fillStyle = P.night0; ctx.fillRect(r.x, r.y, r.w, r.h); draw(ctx, r, u); ctx.restore();
  ctx.strokeStyle = P.halo0; ctx.lineWidth = o.rim ?? 4; ctx.shadowColor = rgba(P.halo0, .9); ctx.shadowBlur = 18; ctx.stroke(p);
  ctx.restore();
  return r;
}
export const CLIP_RECT = { x: 330, y: 110, w: 1260, h: 709 };
const CLIPMETA = (() => { try { const d = JSON.parse(fs.readFileSync(ROOT + 'audio/clips.json', 'utf8')); return Object.fromEntries((d.clips || d).map((c) => [c.id, c])); } catch { return {}; } })();
const FRAMEDIR = (process.env.F19CLIPS || new URL('../clips/frames/', import.meta.url).pathname).replace(/\/?$/, '/');
const FRAMES = {}, FCACHE = new Map();
const nFrames = (id) => FRAMES[id] ?? (FRAMES[id] = fs.existsSync(FRAMEDIR + id) ? fs.readdirSync(FRAMEDIR + id).filter((f) => f.endsWith('.jpg')).length : 0);
const fidx = (c, t, id) => Math.max(1, Math.min(nFrames(id), Math.floor((t - c.start) * 30) + 1));
const fpath = (id, k) => `${FRAMEDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
export async function prepareClips19(T, t) {
  for (const c of Object.values(T.clips)) {
    if (t < c.start - 1 || t > c.end + 1 || !nFrames(c.id)) continue;
    const f = fpath(c.id, fidx(c, t, c.id));
    if (FCACHE.has(f)) continue;
    if (FCACHE.size > 24) FCACHE.delete(FCACHE.keys().next().value);
    FCACHE.set(f, await loadImage(f));
  }
}
const CLIP_WHO = { C1: ['JEROME POWELL', 'FED CHAIR', 'OCT 29, 2025'], C1b: ['KEVIN WARSH', 'FED CHAIR', 'OCT 28, 2026'], C3: ['DEMIS HASSABIS', 'GOOGLE DEEPMIND', 'DEC 16, 2025'] };
export function clipWindow(ctx, t, T, id, rect = CLIP_RECT, o = {}) {
  const c = T.clip(id); if (!c) return null;
  const open = smooth(span(t, c.start - .6, c.start)) * (1 - smooth(span(t, c.end, c.end + .6)));
  if (open <= 0) return null;
  const meta = CLIPMETA[id] || {}, who = o.who ?? CLIP_WHO[id] ?? [c.name ?? id, c.role ?? '', meta.date ?? ''];
  return vWindow(ctx, t, rect, open, (cx, r) => {
    const fr = nFrames(id) ? FCACHE.get(fpath(id, fidx(c, t, id))) : null;
    if (fr) { const s = Math.max(r.w / fr.width, r.h / fr.height), dw = fr.width * s, dh = fr.height * s; cx.drawImage(fr, r.x + (r.w - dw) / 2, r.y + (r.h - dh) / 2, dw, dh); }
    else quoteInside(cx, t, c, meta, r, who);
    if (o.label !== false) {   // lower third inside the window (stays above the subtitle zone)
      const la = smooth(span(t, c.start + .2, c.start + .9)) * (1 - smooth(span(t, c.end - .5, c.end)));
      cx.fillStyle = lin(cx, 0, r.y + r.h - 150, 0, r.y + r.h, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .7 * la)]]); cx.fillRect(r.x, r.y + r.h - 150, r.w, 150);
      cx.fillStyle = rgba(P.halo0, la); cx.fillRect(r.x + 36, r.y + r.h - 96, 4, 64);
      E.glowText(cx, who[0], r.x + 56, r.y + r.h - 62, { size: 30, a: la, spacing: .04 });
      E.glowText(cx, `${who[1]} · ${who[2]} · ORIGINAL FOOTAGE`, r.x + 56, r.y + r.h - 32, { size: 17, weight: 600, col: P.halo2, glow: false, a: la, spacing: .12 });
    }
  }, { from: o.from, mat: o.mat ?? 0 });
}
function quoteInside(ctx, t, c, meta, r, who) {
  ctx.fillStyle = rad(ctx, r.x + r.w * .5, r.y + r.h * .4, r.w * .8, [[0, mixHex(P.ind1, P.blue1, .3)], [1, P.night0]]); ctx.fillRect(r.x, r.y, r.w, r.h);
  const txt = meta.transcript_clips_json || meta.transcript || c.text || '', cues = meta.cues || [];
  const words = txt.split(/\s+/), n = words.length, dt = t - c.start;
  let shown = clamp(dt / Math.max(1, c.end - c.start - 1.2)) * n;
  if (cues.length) { let k = 0; cues.forEach(([s, chunk], i) => { if (dt >= s) k = cues.slice(0, i + 1).reduce((p, q) => p + q[1].split(/\s+/).length, 0); }); shown = Math.min(n, k); }
  const size = Math.round(r.h * .072), lh = size * 1.3, maxW = r.w * .78;
  ctx.font = `${size}px "Instrument Serif"`;
  const lines = []; let cur = [];
  words.forEach((w, i) => { const nx = [...cur, [w, i]]; if (cur.length && ctx.measureText(nx.map((q) => q[0]).join(' ')).width > maxW) { lines.push(cur); cur = [[w, i]]; } else cur = nx; });
  if (cur.length) lines.push(cur);
  const y0 = r.y + r.h * .42 - (lines.length - 1) * lh / 2;
  E.glowText(ctx, '“', r.x + r.w * .11 - size * .5, y0 - lh * .1, { size: size * 2, serif: true, col: P.halo0 });
  lines.forEach((ln, li) => { let xx = r.x + r.w * .11; for (const [w, i] of ln) { const a = clamp(shown - i + 1); E.glowText(ctx, w, xx, y0 + li * lh + (1 - a) * 8, { size, serif: true, a, glow: false }); ctx.font = `${size}px "Instrument Serif"`; xx += ctx.measureText(w + ' ').width; } });
}

// =================================================================================================================== the bubble
export function bubble(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1, tr = clamp(o.tremble ?? 0), pop = clamp(o.pop ?? 0), N = 96, path = new Path2D();
  const R = (th) => r * (1 + .006 * Math.sin(th * 3 + t * 1.1) + tr * (.012 * Math.sin(th * 5 + t * 13) + .008 * Math.sin(th * 9 - t * 17)));
  for (let i = 0; i <= N; i++) { const th = i / N * Math.PI * 2, rr = R(th); i ? path.lineTo(x + Math.cos(th) * rr, y + Math.sin(th) * rr) : path.moveTo(x + Math.cos(th) * rr, y + Math.sin(th) * rr); }
  if (a <= 0 || pop >= 1) return path;
  ctx.save(); ctx.globalAlpha *= a;
  if (pop <= 0) {
    // the film: a clear middle, cool bands toward the rim, a gold sheen up left, one thin red thread on the rim
    ctx.fillStyle = rad(ctx, x, y, r, [[0, rgba(COOL.edge, .04)], [.72, rgba(COOL.mid, .07)], [.9, rgba(COOL.mid, .2)], [.97, rgba(COOL.core, .42)], [1, rgba(COOL.core, .0)]]); ctx.fill(path);
    ctx.save(); ctx.clip(path);
    for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba(k === 1 ? P.halo0 : COOL.mid, .12); ctx.lineWidth = r * .03; ctx.beginPath(); ctx.ellipse(x, y, r * (.86 + k * .045), r * (.84 + k * .045), t * .05 + k, 0, 7); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = rgba(COOL.core, .55); ctx.lineWidth = Math.max(1.5, r * .006); ctx.stroke(path);
    ctx.save(); ctx.filter = `blur(${Math.max(2, r * .02)}px)`; ctx.fillStyle = rgba(P.core1, .5); ctx.beginPath(); ctx.ellipse(x - r * .42, y - r * .5, r * .2, r * .09, -.65, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = rgba(RED.line, .75); ctx.lineWidth = Math.max(1.2, r * .006); ctx.beginPath(); ctx.arc(x, y, r * .985, .25, 1.15); ctx.stroke();
  } else {
    // pop: the skin tears from the red thread and rolls back to both sides; droplets fly a little and fall
    const gap = Math.PI * 2 * smooth(pop), c0 = .7;
    ctx.strokeStyle = rgba(COOL.core, .6 * (1 - pop)); ctx.lineWidth = Math.max(1.5, r * .01);
    ctx.beginPath(); ctx.arc(x, y, r * (1 + pop * .05), c0 + gap / 2, c0 - gap / 2 + Math.PI * 2); ctx.stroke();
    const rn = prng(o.seed ?? 5);
    for (let i = 0; i < 40; i++) { const th = rn() * Math.PI * 2, d = r * (1 + pop * (.15 + rn() * .35)), dy = 140 * pop * pop; ctx.fillStyle = rgba(i % 6 ? COOL.mid : P.halo0, .7 * (1 - pop)); ctx.beginPath(); ctx.arc(x + Math.cos(th) * d, y + Math.sin(th) * d + dy, 2 + rn() * 3, 0, 7); ctx.fill(); }
  }
  ctx.restore();
  return path;
}
export function skinFlood(ctx, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= clamp(a);
  ctx.fillStyle = rgba(COOL.deep, .35); ctx.fillRect(0, 0, W, H);
  for (let k = 0; k < 7; k++) {   // broad slow iridescent bands across the frame
    const y0 = -200 + k * 230 + Math.sin(t * .4 + k) * 40;
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + 260, [[0, rgba(COOL.mid, 0)], [.5, rgba(k % 3 === 1 ? P.halo0 : COOL.mid, k % 3 === 1 ? .14 : .2)], [1, rgba(COOL.mid, 0)]]);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.18); ctx.translate(-W / 2, -H / 2); ctx.fillRect(-300, y0, W + 600, 260); ctx.restore();
  }
  ctx.restore();
}

// =================================================================================================================== points
export function dots100(ctx, t, o = {}) {
  const n = o.n ?? 100, cols = o.cols ?? 10, gap = o.gap ?? 34, r = o.r ?? 8, x = o.x ?? W / 2 - (cols - 1) * gap / 2, y = o.y ?? H / 2 - (Math.ceil(n / cols) - 1) * gap / 2;
  ctx.save();
  for (let i = 0; i < n; i++) {
    const a = o.a ? clamp(o.a(i)) : 1; if (a <= 0) continue;
    const [px, py] = o.pos ? o.pos(i) : [x + (i % cols) * gap, y + Math.floor(i / cols) * gap], L = o.lit ? clamp(o.lit(i)) : 1;
    if (L > .02) halo(ctx, px, py, r * 3.2, .35 * L * a);
    ctx.fillStyle = rgba(mixHex(COOL.mid, P.core1, L), a * (.6 + .4 * L)); ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill();
  }
  ctx.restore();
}

// =================================================================================================================== the shared road set
// The road is the same place in every chunk: same camera height and horizon, you on the right of the centre line, signs on the right
// verge, the goal sign on the left. Walking = rc.z grows (≈ 260 units/s with walk: t * 5.5); keep you at Z = rc.z + ROADSET.you.dz.
export const ROADSET = { hy: 560, h: 300, f: 1700, you: { X: 90, dz: 1500, h: 230 }, signX: 640, goalX: -760, mist: .55 };
export const roadSetCam = (z = 0, o = {}) => roadCam({ hy: ROADSET.hy, h: ROADSET.h, f: ROADSET.f, z, ...o });
