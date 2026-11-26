// Film 72 · B2 (c06–c08) · own helpers (builder B2 only; the shared kit stays untouched: lib/f72_*.mjs).
// Small drawing parts for THE CHAOS (c06), the Rushkoff story (c07) and the floor plans (c08), plus the inner seam plate c07 → c08
// (plateSplit: INVESTORS | AI BUILDERS, the dividing line between them). Everything is drawn from t only (no state, no randomness
// outside the seeded prng), caches are built once at module level.
//
// LOCAL strings (not in F.SOURCES; the lead may move them into the kit): see LOCAL below.
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as F from './f72_kit.mjs';
import * as X from './f72_stage.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const { GOLD, COOL, CREAM, PAPER, CONCRETE, LAMP } = F;
const TAU = Math.PI * 2, LY = X.LINE_Y;

// strings the kit does not have (named in the report)
export const LOCAL = {
  groundStop: 'GROUND STOP', fewYears: 'A FEW YEARS', incident: 'A MAJOR AI INCIDENT', noAI: 'NO AI INVOLVED', passed: 'IT PASSED', killer: 'KILLER ROBOTS',
  rushkoff: 'DOUGLAS RUSHKOFF', fiveInv: 'FIVE INVESTORS', event5: ['COLLAPSE', 'UNREST', 'NUCLEAR', 'VIRUS', 'HACK'],
  planned: 'PLANNED TODAY', disaster: 'AI DISASTER', dayAfter: 'THE DAY AFTER', notPeople: 'NOT PEOPLE',
};
// the investors' question = the words of clip C3 (ROOT clips-geprueft.json, "wording"), from "how do I" on; never retyped here
export const C3Q = (() => {
  try { const j = JSON.parse(fs.readFileSync(ROOT + 'clips-geprueft.json', 'utf8')); const c = (Array.isArray(j) ? j : j.clips).find((q) => q.id === 'C3');
    const i = c.wording.toLowerCase().indexOf('how do i'); if (i >= 0) { const s = c.wording.slice(i); return '“' + s[0].toUpperCase() + s.slice(1) + '”'; } } catch { /* fall through */ }
  return null;
})();

// ------------------------------------------------------------------------------------------------ time helpers
export const lab = (t, a, b, i = .7, o = .45) => span(t, a, a + i) * (1 - span(t, b - o, b + .1));
// piecewise sineIO through keys [[t, [v…]], …]
export function seq(t, K) { let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++; const [t0, a] = K[i], [t1, b] = K[i + 1], u = sineIO(span(t, t0, t1)); return a.map((x, j) => lerp(x, b[j], u)); }
// a thing that rises out of the line (clip above y, translate down by its height while u < 1)
export function riseFrom(ctx, y, hgt, u, fn) {
  u = clamp(u); if (u <= 0) return; const k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 1e5 + y); ctx.clip(); ctx.translate(0, (1 - k) * (hgt + 10)); fn(); ctx.restore();
}
// rise u, sink back (into the line) with the same mask: out = 0..1
export const riseSink = (u, out) => clamp(u) * (1 - sineIO(clamp(out)));
// turn a flat silhouette round (f 0 = facing dir, 1 = facing -dir): scale x through 0
export function turned(ctx, x, f, fn) { const c = Math.cos(Math.PI * clamp(f)); ctx.save(); ctx.translate(x, 0); ctx.scale(Math.sign(c || 1) * Math.max(.05, Math.abs(c)), 1); ctx.translate(-x, 0); fn(); ctx.restore(); }
// wrap words to a width (Inter caps) → lines
export function wrap(txt, size, maxW, serif = false) { const ws = txt.split(' '), out = []; let cur = ''; for (const w of ws) { const n = cur ? cur + ' ' + w : w; if (cur && F.measure(n, size, serif, 700) + n.length * size * .06 > maxW) { out.push(cur); cur = w; } else cur = n; } if (cur) out.push(cur); return out; }

// ------------------------------------------------------------------------------------------------ c06: the clock band, signs, the board, the router, a plane, the city
// the supply band on the clock axis (x, y, w = the axis): solid gold up to `solid`, a claimed part to `full` (fills while hollow = 0, turns into
// a dashed outline with hollow = 1), consumed (shade) up to `head`; the head marker; o.a
export function supplyBand(ctx, x, y, w, o = {}) {
  const s = o.s ?? 1, bw = 22, yb = y - 18 - bw, head = clamp(o.head ?? 0), solid = clamp(o.solid ?? 0), full = Math.max(solid, clamp(o.full ?? 0)), hol = clamp(o.hollow ?? 0);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (solid > 0) { const xh = x + w * Math.min(head, solid), xe = x + w * solid;
    ctx.fillStyle = rgba(GOLD.body, .85); ctx.beginPath(); ctx.roundRect(xh, yb, Math.max(0, xe - xh), bw, full > solid ? 0 : [0, 4, 4, 0]); ctx.fill();
    if (xh > x) { ctx.fillStyle = rgba(GOLD.shade, .35); ctx.fillRect(x, yb, xh - x, bw); } }
  if (full > solid) { const x0 = x + w * solid, x1 = x + w * full;
    ctx.fillStyle = rgba(GOLD.body, .85 * (1 - hol)); ctx.beginPath(); ctx.roundRect(x0, yb, x1 - x0, bw, [0, 4, 4, 0]); ctx.fill();
    if (hol > 0) X.drawPath(ctx, [[x0, yb], [x1, yb], [x1, yb + bw], [x0, yb + bw]], hol, { col: rgba(GOLD.line, .9), w: 2 / s, dash: [8 / s, 6 / s], cap: 'butt' }); }
  if (o.headOn > 0) { const xh = x + w * head; ctx.globalAlpha *= clamp(o.headOn); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(xh, y - 6); ctx.lineTo(xh - 9, y - 19); ctx.lineTo(xh + 9, y - 19); ctx.fill(); halo(ctx, xh, y - 12, 34, .45, GOLD.halo, GOLD.core); }
  ctx.restore();
}
// a sign on a post (x = centre, y = the line): a lit panel with one word that goes dark (dark 0..1, with a short flicker before)
export function sign(ctx, t, x, y, txt, u, dark, o = {}) {
  if (u <= 0) return; const s = o.s ?? 1, w = o.w ?? 250, h = o.h ?? 116, top = y - (o.post ?? 120) - h;
  riseFrom(ctx, y, (o.post ?? 120) + h, u, () => {
    ctx.fillStyle = mixHex(P.night0, CONCRETE.shade, .6); ctx.fillRect(x - 5, top + h, 10, y - top - h);
    const fl = dark > 0 && dark < .35 ? (Math.sin(t * 61) > 0 ? .5 : 0) : 0, lit = clamp(1 - sineIO(span(dark, .3, 1)) - fl);
    if (lit > 0) halo(ctx, x, top + h / 2, w * .85, .22 * lit, LAMP.body, LAMP.core);
    ctx.fillStyle = lin(ctx, 0, top, 0, top + h, [[0, mixHex(mixHex(P.night1, P.ind2, .6), PAPER.lit, lit)], [1, mixHex(mixHex(P.night0, P.ind2, .5), PAPER.body, lit)]]);
    ctx.beginPath(); ctx.roundRect(x - w / 2, top, w, h, 6); ctx.fill(); ctx.strokeStyle = rgba(lit > .5 ? PAPER.edge : CREAM, .7); ctx.lineWidth = 2 / s; ctx.stroke();
    E.glowText(ctx, txt, x, top + h / 2 + 12, { size: o.size ?? 34, weight: 700, align: 'center', spacing: .08, glow: false, col: mixHex(mixHex(CREAM, P.halo2, .5), PAPER.ink, lit) });
  });
  return { top, h, w };
}
// the departure board: x0..x0+w, y0..y0+h (sheet); rows: per row the flip state f (0 = flying: a gold dot, 1 = GROUND STOP); the bar u
export function board(ctx, t, x0, y0, w, h, o = {}) {
  const s = o.s ?? 1, n = 5, rowH = (h - 90) / n;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  halo(ctx, x0 + w / 2, y0 + h / 2, w * .7, .18, LAMP.body, LAMP.core);
  ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + h, [[0, mixHex(P.night0, CONCRETE.deep, .7)], [1, P.night0]]); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 8); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2 / s; ctx.stroke();
  const rows = o.rows ?? [];
  for (let i = 0; i < n; i++) {
    const ry = y0 + 34 + rowH * (i + .5), f = clamp(rows[i] ?? 0), flip = Math.abs(Math.cos(Math.PI * f)), state = f >= .5;
    ctx.save(); ctx.translate(0, ry); ctx.scale(1, Math.max(.04, flip)); ctx.translate(0, -ry);
    const r = prng(400 + i);
    ctx.fillStyle = rgba(CREAM, .55); ctx.beginPath(); ctx.roundRect(x0 + 34, ry - 7, 70 + r() * 30, 14, 3); ctx.roundRect(x0 + 140, ry - 7, 60 + r() * 70, 14, 3); ctx.fill();
    if (!state) { ctx.fillStyle = rgba(CREAM, .35); ctx.beginPath(); ctx.roundRect(x0 + w - 230, ry - 7, 60, 14, 3); ctx.fill(); F.glowDot(ctx, x0 + w - 60, ry, 26, .8, 'gold'); ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.arc(x0 + w - 60, ry, 7, 0, TAU); ctx.fill(); }
    else E.glowText(ctx, LOCAL.groundStop, x0 + w - 34, ry + 9, { size: 26, weight: 700, align: 'right', spacing: .1, glow: false, col: CREAM });
    ctx.restore();
  }
  // the bar: MORE THAN 4 HOURS
  const bu = clamp(o.bar ?? 0);
  if (bu > 0) { const by = y0 + h - 30, bx = x0 + 34, bw = (w - 68);
    ctx.fillStyle = rgba(CREAM, .18); ctx.fillRect(bx, by - 2, bw, 4);
    X.bar(ctx, bx, by, 16, bw * .86, bu, { col: 'cream', horizontal: true });
    X.label(ctx, F.SOURCES.faaHours, bx + bw * .86 * expoOut(bu), by - 22, span(bu, .3, 1), { size: 26, align: 'right' }); }
  ctx.restore();
}
// a small router box on the line: two antennas, one cream light that blinks (never red)
export function router(ctx, t, x, y, u, o = {}) {
  if (u <= 0) return; const s = o.s ?? 1;
  riseFrom(ctx, y, 110, u, () => {
    ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(x - 24, y - 34); ctx.lineTo(x - 34, y - 86); ctx.moveTo(x + 24, y - 34); ctx.lineTo(x + 34, y - 86); ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, CONCRETE.shade, .7); ctx.beginPath(); ctx.roundRect(x - 52, y - 36, 104, 36, 6); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .8); ctx.lineWidth = 2 / s; ctx.stroke();
    const bl = o.blink ?? 0; for (let i = 0; i < 4; i++) { const on = i === 1 ? bl : .35; ctx.fillStyle = rgba(CREAM, .3 + .7 * on); ctx.beginPath(); ctx.arc(x - 30 + i * 20, y - 18, 4, 0, TAU); ctx.fill(); }
    if (bl > .5) F.glowDot(ctx, x - 10, y - 18, 22, .7 * bl, 'cream');
  });
}
// a plane silhouette (side view, nose to the right), pale so it reads on the night; ang = climb angle
export function plane(ctx, x, y, L, ang, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(-ang); ctx.scale(L, L);
  ctx.fillStyle = mixHex(P.blue1, CREAM, .45); ctx.beginPath(); ctx.moveTo(-.5, -.02); ctx.quadraticCurveTo(-.45, -.07, -.3, -.06); ctx.lineTo(.38, -.05); ctx.quadraticCurveTo(.52, -.03, .5, .0); ctx.quadraticCurveTo(.48, .04, .36, .04); ctx.lineTo(-.42, .03); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(.06, -.01); ctx.lineTo(-.16, .22); ctx.lineTo(-.06, .22); ctx.lineTo(.2, .0); ctx.fill();   // wing
  ctx.beginPath(); ctx.moveTo(-.36, -.05); ctx.lineTo(-.47, -.22); ctx.lineTo(-.4, -.22); ctx.lineTo(-.26, -.05); ctx.fill();   // fin
  ctx.restore(); F.glowDot(ctx, x + Math.cos(ang) * L * .45, y - Math.sin(ang) * L * .45, L * .18, .6 * a, 'cream');
}
// the city on the line: buildings with lit windows; out(i, n) = 0..1 dark for the i-th window in switch-off order. Returns the sheet
// position + size of the window that goes out last.
const CITY = (() => {
  const r = prng(7606), b = [], wins = []; let x = 0;
  const HS = [150, 210, 120, 240, 170, 130, 200, 110];
  for (let i = 0; i < HS.length; i++) { const w = 92 + Math.round(r() * 40), h = HS[i]; b.push({ x, w, h });
    for (let yy = 22; yy < h - 22; yy += 30) for (let xx = 14; xx < w - 22; xx += 24) if (r() < .72) wins.push({ x: x + xx, y: -h + yy, k: r() });
    x += w + 10 + Math.round(r() * 16); }
  const width = x; wins.sort((p, q) => p.k - q.k);
  // the last window: a big one, upper right of the fourth building (the rhyme with the resort window in c07)
  const lb = b[3], last = { x: lb.x + lb.w - 40, y: -lb.h + 40, w: 22, h: 16 };
  return { b, wins: wins.filter((q) => !(Math.abs(q.x - last.x) < 24 && Math.abs(q.y - last.y) < 30)), width, last };
})();
export const CITY_W = CITY.width;
export function city(ctx, t, x0, y, u, off, o = {}) {
  if (u <= 0) return null; const s = o.s ?? 1, n = CITY.wins.length;
  riseFrom(ctx, y, 260, u, () => {
    for (const q of CITY.b) { ctx.fillStyle = lin(ctx, 0, y - q.h, 0, y, [[0, mixHex(P.night1, P.ind2, .7)], [1, mixHex(P.night0, P.ind1, .4)]]); ctx.fillRect(x0 + q.x, y - q.h, q.w, q.h);
      ctx.strokeStyle = rgba(CREAM, .22); ctx.lineWidth = 1.2 / s; ctx.strokeRect(x0 + q.x, y - q.h, q.w, q.h); }
    CITY.wins.forEach((q, i) => { const d = clamp(off(i, n)); if (d >= 1) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind1, .4), 1); ctx.fillRect(x0 + q.x, y + q.y, 12, 14); return; }
      ctx.fillStyle = mixHex(mixHex(LAMP.body, GOLD.body, .25), mixHex(P.night0, P.ind1, .4), d); ctx.fillRect(x0 + q.x, y + q.y, 12, 14); });
    const L = CITY.last; F.glowDot(ctx, x0 + L.x + L.w / 2, y + L.y + L.h / 2, 46, .55 * (o.lastGlow ?? 1), 'gold');
    ctx.fillStyle = mixHex(LAMP.body, GOLD.body, .4); ctx.fillRect(x0 + L.x, y + L.y, L.w, L.h);
  });
  const L = CITY.last; return { x: x0 + L.x + L.w / 2, y: y + L.y + L.h / 2, w: L.w, h: L.h };
}
// a worker (calm silhouette, work clothes: a short jacket, a cap) — F.person with a gold rim
export const worker = (ctx, x, y, h, o = {}) => F.person(ctx, x, y, h, { pose: o.pose ?? 'stand', dir: o.dir ?? 1, walk: o.walk, light: -1, rim: GOLD.line, lean: o.lean });

// the generator (FUEL) and the air filter (FILTERS) in the bunker
export function generator(ctx, t, x, y, on, o = {}) {
  const s = o.s ?? 1; ctx.save();
  if (on > 0) halo(ctx, x, y - 30, 110, .45 * on, GOLD.halo, GOLD.core);
  ctx.fillStyle = mixHex(CONCRETE.deep, CONCRETE.shade, .4); ctx.beginPath(); ctx.roundRect(x - 54, y - 56, 108, 56, 6); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .6 + .3 * on); ctx.lineWidth = 2 / s; ctx.stroke();
  ctx.strokeStyle = rgba(CREAM, .3 + .4 * on); ctx.lineWidth = 1.4 / s; ctx.beginPath(); for (let i = 0; i < 5; i++) { ctx.moveTo(x - 40 + i * 12, y - 44); ctx.lineTo(x - 40 + i * 12, y - 12); } ctx.stroke();
  ctx.fillStyle = mixHex(rgba(CREAM, .2), GOLD.body, on); ctx.beginPath(); ctx.arc(x + 30, y - 28, 9, 0, TAU); ctx.fill();
  if (on > 0) F.glowDot(ctx, x + 30, y - 28, 26 * (1 + .08 * Math.sin(t * 9)), .7 * on, 'gold');
  ctx.restore();
}
export function filter(ctx, t, x, y, on, o = {}) {
  const s = o.s ?? 1; ctx.save();
  if (on > 0) halo(ctx, x, y, 60, .35 * on, GOLD.halo, GOLD.core);
  ctx.fillStyle = mixHex(CONCRETE.deep, CONCRETE.shade, .5); ctx.fillRect(x - 18, y - 22, 36, 44); ctx.strokeStyle = rgba(CREAM, .6 + .3 * on); ctx.lineWidth = 1.6 / s; ctx.strokeRect(x - 18, y - 22, 36, 44);
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * 5 * on); ctx.strokeStyle = rgba(mixHex(CREAM, GOLD.line, on), .5 + .4 * on); ctx.beginPath(); for (let i = 0; i < 3; i++) { const a = i * TAU / 3; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 13, Math.sin(a) * 13); } ctx.stroke(); ctx.restore();
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ c07: the resort, the car, palms, the room
export function palm(ctx, x, y, h, ph, t) {
  const sw = Math.sin(t * .7 + ph) * .03, ink = mixHex(P.ind1, P.blue1, .35);
  ctx.save(); ctx.strokeStyle = ink; ctx.lineCap = 'round'; ctx.lineWidth = h * .045; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * .08, y - h * .5, x + h * .04 + sw * h, y - h); ctx.stroke();
  ctx.fillStyle = ink; const tx = x + h * .04 + sw * h, ty = y - h;
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .48 + sw * 2, L = h * (.36 + (i % 2) * .08);
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * L * .6, ty + Math.sin(a) * L * .6 - h * .06, tx + Math.cos(a) * L, ty + Math.sin(a) * L + h * .12); ctx.quadraticCurveTo(tx + Math.cos(a) * L * .5, ty + Math.sin(a) * L * .5 + h * .02, tx, ty); ctx.fill(); }
  ctx.restore();
}
// the low resort on the line: x0 (left), y (the line), w; windows lit; returns the rect of the big lit window (the rhyme)
// the big window sits at the same height above the line as the city's last window (c06 → c07 W cut: same screen spot, same line)
export const RESORT_WIN = { dx: .64, w: 70, h: 52, dy: -(CITY.last.y + CITY.last.h / 2) + 26 };
export function resort(ctx, t, x0, y, w, o = {}) {
  const s = o.s ?? 1, h = Math.max(118, RESORT_WIN.dy + 44);   // the right wing rises to two storeys; the left wing stays low
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  halo(ctx, x0 + w * .6, y - 50, w * .6, .16, LAMP.body, LAMP.core);
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, mixHex(P.night1, P.ind2, .8)], [1, mixHex(P.night0, P.ind1, .4)]]);
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0, y - 88); ctx.lineTo(x0 + w * .4, y - 88); ctx.lineTo(x0 + w * .4, y - h); ctx.lineTo(x0 + w, y - h); ctx.lineTo(x0 + w, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 1.4 / s; ctx.stroke();
  ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(x0 - 10, y - 92, w * .4 + 10, 4); ctx.fillRect(x0 + w * .4, y - 104, w * .6 + 8, 3); ctx.fillRect(x0 + w * .4 - 6, y - h - 4, w * .6 + 16, 4);   // flat roofs
  for (let i = 0; i < 4; i++) { ctx.fillStyle = mixHex(LAMP.body, GOLD.body, .3); ctx.globalAlpha *= .8; ctx.fillRect(x0 + 24 + i * 46, y - 56, 26, 30); ctx.globalAlpha /= .8; }
  const R = RESORT_WIN, wx = x0 + w * R.dx, wy = y - R.dy;
  F.glowDot(ctx, wx + R.w / 2, wy + R.h / 2, 110, .5 + .07 * Math.sin(t * 5.3) + .05 * Math.sin(t * 8.7 + 1), 'gold');   // a living window (fire-lit)
  ctx.fillStyle = mixHex(LAMP.body, GOLD.body, .4); ctx.fillRect(wx, wy, R.w, R.h);
  ctx.strokeStyle = rgba(mixHex(P.night0, P.ind2, .5), .9); ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(wx + R.w / 2, wy); ctx.lineTo(wx + R.w / 2, wy + R.h); ctx.stroke();
  ctx.restore();
  return { x: wx, y: wy, w: R.w, h: R.h };
}
// a car (side view, driving right), two headlight beams along the road
export function car(ctx, t, x, y, a = 1, o = {}) {
  if (a <= 0) return; const s = o.s ?? 1;
  ctx.save(); ctx.globalAlpha *= a; ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, x + 40, 0, x + 340, 0, [[0, rgba(LAMP.body, .3)], [1, rgba(LAMP.body, 0)]]);
  ctx.beginPath(); ctx.moveTo(x + 44, y - 16); ctx.lineTo(x + 340, y - 40); ctx.lineTo(x + 340, y + 6); ctx.lineTo(x + 44, y - 8); ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = mixHex(P.night0, P.ind2, .6);
  ctx.beginPath(); ctx.moveTo(x - 46, y - 6); ctx.lineTo(x - 44, y - 22); ctx.lineTo(x - 22, y - 26); ctx.lineTo(x - 8, y - 40); ctx.lineTo(x + 18, y - 40); ctx.lineTo(x + 32, y - 26); ctx.lineTo(x + 46, y - 22); ctx.lineTo(x + 48, y - 6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 1.2 / s; ctx.stroke();
  for (const wx of [-26, 28]) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(x + wx, y - 6, 8, 0, TAU); ctx.fill(); }
  ctx.restore();
  F.glowDot(ctx, x + 44, y - 16, 30, .9 * a, 'cream'); F.glowDot(ctx, x + 36, y - 15, 22, .6 * a, 'cream');
}
// the room (screen px): back wall, floor at FLOOR, rows of empty chairs left, a lectern, a small round table right with the lamp above.
// The five: seated silhouettes round the table (two from behind in front, three behind the table). o.lean 0..1 (they lean back: the eye roll)
export const ROOM = { floor: 760, table: { x: 1350, y: 700, rx: 170 }, lampY: 250, chairs: { x0: 170, x1: 760 } };
function chair(ctx, x, y, h, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - h * .22, y - h, h * .44, h * .55, h * .05); ctx.fill(); ctx.fillRect(x - h * .24, y - h * .47, h * .48, h * .08); ctx.fillRect(x - h * .2, y - h * .4, h * .05, h * .4); ctx.fillRect(x + h * .15, y - h * .4, h * .05, h * .4); }
export function seated(ctx, x, y, h, o = {}) {   // from behind (o.front: behind the table, facing us: just a dark shape, no face)
  const lean = (o.lean ?? 0) * .12, ink = o.ink ?? mixHex(P.night1, P.ind2, .55);
  ctx.save(); ctx.translate(x, y - h * .22); ctx.rotate(lean * (o.side ?? 1)); ctx.translate(-x, -(y - h * .22));
  ctx.fillStyle = rgba(mixHex(GOLD.line, CREAM, .3), .35 * (o.rim ?? 1)); ctx.beginPath(); ctx.ellipse(x + 1.5, y - h * .9 - 1.5, h * .1, h * .11, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(x - h * .24, y - h * .22); ctx.quadraticCurveTo(x - h * .24, y - h * .7, x, y - h * .72); ctx.quadraticCurveTo(x + h * .24, y - h * .7, x + h * .24, y - h * .22); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y - h * .88, h * .1, h * .11, 0, 0, TAU); ctx.fill();
  ctx.restore();
  if (!o.front) { ctx.fillStyle = mixHex(P.night0, CONCRETE.deep, .45); ctx.beginPath(); ctx.roundRect(x - h * .28, y - h * .42, h * .56, h * .42, h * .04); ctx.fill(); }
}
export function room(ctx, t, o = {}) {
  const F0 = ROOM.floor, tb = ROOM.table, lit = o.lamp ?? 1;
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, GOLD.deep, .12)], [.7, mixHex(P.night1, GOLD.deep, .22)], [1, mixHex(P.night0, GOLD.deep, .18)]]); ctx.fillRect(-50, -50, W + 100, H + 100);
  // the wall: two tall dark windows (night outside) and a faint panel line
  ctx.strokeStyle = rgba(CREAM, .12); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, F0 - 300); ctx.lineTo(W, F0 - 300); ctx.stroke();
  halo(ctx, tb.x, tb.y - 160, 520, .3 * lit, LAMP.body, LAMP.core);
  // floor
  ctx.fillStyle = mixHex(P.night0, GOLD.deep, .2); ctx.fillRect(-50, F0, W + 100, H - F0 + 50);
  X.drawPath(ctx, [[-20, F0], [W + 20, F0]], 1, { col: rgba(CREAM, .5), w: 2 });
  // rows of empty chairs facing a lectern
  const ch = mixHex(P.night0, P.ind2, .6);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) chair(ctx, ROOM.chairs.x0 + i * 100 + r * 22, F0 - r * 6, 92 - r * 8, mixHex(ch, P.night0, r * .25));
  ctx.fillStyle = mixHex(P.night0, CONCRETE.deep, .5); ctx.beginPath(); ctx.moveTo(990, F0); ctx.lineTo(1002, F0 - 120); ctx.lineTo(1062, F0 - 120); ctx.lineTo(1074, F0); ctx.fill();   // the lectern, empty
  ctx.strokeStyle = rgba(CREAM, .3); ctx.lineWidth = 1.5; ctx.stroke();
  // the table, the lamp (F.lamp returns the pool rect: the clip plate's source)
  const pool = F.lamp(ctx, t, tb.x, ROOM.lampY - 140, { floor: tb.y - 18, len: 140, r: 36, poolR: 150, u: 1 });
  const five = o.five ?? 1, lean = o.lean ?? 0;
  // three behind the table (front: dark shapes), then the table, then two from behind in front
  if (five > 0) { ctx.save(); ctx.globalAlpha *= five; for (const [dx, h, sd] of [[-120, 120, -1], [0, 126, 1], [120, 118, 1]]) seated(ctx, tb.x + dx, tb.y - 8, h, { front: true, lean, side: sd, ink: mixHex(P.night1, P.ind2, .35) }); ctx.restore(); }
  ctx.fillStyle = mixHex(P.night0, GOLD.deep, .35); ctx.beginPath(); ctx.ellipse(tb.x, tb.y - 6, tb.rx, 22, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, tb.y - 26, 0, tb.y, [[0, mixHex(PAPER.shade, GOLD.mid, .3)], [1, mixHex(P.night0, GOLD.shade, .5)]]); ctx.beginPath(); ctx.ellipse(tb.x, tb.y - 14, tb.rx, 20, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, GOLD.deep, .3); ctx.fillRect(tb.x - 8, tb.y, 16, F0 - tb.y); ctx.fillRect(tb.x - 60, F0 - 6, 120, 6);
  if (o.onTable) o.onTable(ctx);
  if (five > 0) { ctx.save(); ctx.globalAlpha *= five; seated(ctx, tb.x - 190, F0, 150, { lean, side: -1 }); seated(ctx, tb.x + 190, F0, 146, { lean, side: 1 }); ctx.restore(); }
  if (o.extra) o.extra(ctx);
  return pool;
}
// a banknote (cream outline on dark paper): print 0..1 (its pattern), thin 0..1 (goes thin and weightless), back 0..1 (turned over: THE EVENT)
export function banknote(ctx, t, cx, cy, w, h, o = {}) {
  const fl = o.flip ?? 0, sx = Math.cos(Math.PI * fl), back = fl > .5, print = clamp(o.print ?? 1);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.rot ?? 0); ctx.scale(Math.sign(sx || 1) * Math.max(.03, Math.abs(sx)), 1 - .06 * clamp(o.thin ?? 0));
  ctx.fillStyle = o.fill ?? mixHex(P.night1, P.ind2, .4); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 14); ctx.fill();
  ctx.strokeStyle = CREAM; ctx.lineWidth = o.lw ?? 3; ctx.stroke();
  if (!back) {
    ctx.strokeStyle = rgba(CREAM, .6 * print); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32, 8); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, h * .3, h * .3, 0, 0, TAU); ctx.stroke();
    for (const sx2 of [-1, 1]) { ctx.beginPath(); for (let i = 0; i < 6; i++) { const xx = sx2 * (w * .22 + i * 12); ctx.moveTo(xx, -h * .26); ctx.lineTo(xx, h * .26); } ctx.stroke(); }
    for (const [px, py] of [[-1, -1], [1, 1]]) { ctx.beginPath(); ctx.arc(px * (w / 2 - 46), py * (h / 2 - 42), 16, 0, TAU); ctx.stroke(); }
  } else if (o.backText) {
    ctx.scale(-1, 1);   // the back reads the right way round
    E.glowText(ctx, o.backText, 0, h * .14, { size: o.backSize ?? 80, serif: true, align: 'center', col: mixHex(CREAM, GOLD.text, .3), glow: true });
  }
  ctx.restore();
}
// a sketch card (paper, on the table / on the wall): a drawing + a caption (quote, wrapped); lit 0..1
export function sketchCard(ctx, t, x, y, w, h, u, cap, draw, o = {}) {
  u = clamp(u); if (u <= 0) return; const k = expoOut(u), lit = clamp(o.lit ?? 0);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y + (1 - k) * 60); ctx.rotate((o.rot ?? 0) + (1 - k) * .05);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = lit > 0 ? rgba(GOLD.mid, .4 + .6 * lit) : rgba(PAPER.edge, .9); ctx.lineWidth = 2 + 2 * lit; ctx.strokeRect(-w / 2, -h / 2, w, h);
  if (draw) draw(ctx, span(u, .3, 1));
  const L = wrap(cap, 22, w - 40); L.forEach((ln, i) => F.maskLine(ctx, [[ln, 0]], -w / 2 + 20, h / 2 - 22 - (L.length - 1 - i) * 28, 22, F.rise(span(u, .45 + i * .1, 1)), { serif: false, weight: 700, col: PAPER.ink, glow: false }));
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ c07 → c08: the split (INVESTORS | AI BUILDERS)
// The inner seam plate (both chunks draw it ±S.SEAM_HALF round 'But look at what gets planned'): the view of THE GROUND LINE stage
// { 960, 500, 1 } (line at screen y 640); left the room box (the five at their table, seen through a frame) with INVESTORS under it, right the
// glass room (AI BUILDERS), between them a cream dividing line rising from the ground line. c08 continues this picture (o.out etc.).
export const SPLIT = { view: { x: 960, y: 500, s: 1 }, box: { x: 150, y: 150, w: 720, h: 420 }, div: 980, glass: { x: 1140, w: 520, h: 260 } };
export const splitView = (t, T, phrase, k = 1) => { const b = { dx: E.drift(t, 4, 3), dy: E.drift(t, 2.5, 7) }, V = SPLIT.view; return { x: V.x + b.dx, y: V.y + b.dy, s: V.s * k }; };
// the room drawn into a box (screen px) by scaling the full-frame room into it
export function roomBox(ctx, t, box, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(box.x, box.y, box.w, box.h, o.r ?? 10); ctx.clip();
  const sc = Math.max(box.w / W, box.h / H) * (o.zoom ?? 1), fx = o.fx ?? ROOM.table.x - 260, fy = o.fy ?? ROOM.floor - 240;
  ctx.translate(box.x + box.w / 2, box.y + box.h / 2); ctx.scale(sc, sc); ctx.translate(-lerp(W / 2, fx, o.focus ?? 0), -lerp(H / 2, fy, o.focus ?? 0));
  const cx = lerp(W / 2, fx, o.focus ?? 0), cy = lerp(H / 2, fy, o.focus ?? 0);
  const pool = room(ctx, t, o);
  ctx.restore();
  const map = (x, y) => [box.x + box.w / 2 + (x - cx) * sc, box.y + box.h / 2 + (y - cy) * sc];
  if ((o.frame ?? 1) > 0) { ctx.save(); ctx.strokeStyle = rgba(CREAM, .85 * (o.frame ?? 1)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(box.x, box.y, box.w, box.h, o.r ?? 10); ctx.stroke(); ctx.restore(); }
  return { pool, map, sc };
}
// the split picture in sheet units (v); o: box (screen rect of the room box), glass 0..1, div 0..1, labels 0..1, five, lean, cards (name cards u)
export function drawSplit(ctx, t, v, o = {}) {
  X.ground(ctx, t, v, { lx: o.lx ?? 980, ly: o.ly ?? 420, pool: o.pool ?? .85, earth: 1 });
  const S0 = SPLIT;
  X.inView(ctx, v, (s) => {
    const g = clamp(o.glass ?? 1);
    if (g > 0) F.glassRoom(ctx, t, S0.glass.x, LY, S0.glass.w, S0.glass.h, { u: g, s, n: 4 });
    const d = clamp(o.div ?? 1);
    if (d > 0) X.drawPath(ctx, [[S0.div, LY], [S0.div, LY - 460]], d, { col: rgba(CREAM, .8), w: 2.4 / s, dash: [12 / s, 9 / s] });
    X.label(ctx, F.SOURCES.builders, S0.glass.x + S0.glass.w / 2, LY + 60, o.labels ?? 1, { size: 30, spacing: .16, col: COOL.text });
  });
  const box = o.box ?? (() => { const [x0, y0] = X.toScreen(v, S0.box.x, S0.box.y); return { x: x0, y: y0, w: S0.box.w * v.s, h: S0.box.h * v.s }; })();
  if ((o.boxU ?? 1) > 0) roomBox(ctx, t, box, { lamp: 1, five: 1, lean: o.lean ?? 0, focus: o.focus ?? 1, zoom: o.zoom ?? 1.9, onTable: o.onTable, extra: o.extra, frame: o.frame ?? 1 });
  X.inView(ctx, v, () => X.label(ctx, F.SOURCES.investors, S0.box.x + S0.box.w / 2, LY + 60, o.labels ?? 1, { size: 30, spacing: .16, gold: .6 }));
  return box;
}
export function plateSplit(ctx, t, T, phrase) {
  const k = 1 + .04 * Math.max(0, t - (T.G(phrase) - .5));
  drawSplit(ctx, t, splitView(t, T, phrase, k), { onTable: nameCards(1) });
}
// five blank name cards on the table (the men were never named)
export const nameCards = (u) => (ctx) => { const tb = ROOM.table; if (u <= 0) return;
  [-120, -50, 20, 90, 150].forEach((dx, i) => { const k = expoOut(span(u, i * .08, .5 + i * .08)); if (k <= 0) return; const x = tb.x + dx - 8, y = tb.y - 22;
    ctx.save(); ctx.globalAlpha *= clamp(k * 3); ctx.translate(x, y + (1 - k) * 14);
    ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-14, -20); ctx.lineTo(14, -20); ctx.lineTo(18, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore(); }); };

// c06 → c07 (the W cut): the city's last lit window at the end of c06 and the resort window at the start of c07 sit on the same screen spot
export const W_PUSH = .025;   // scale per second across the c06 → c07 W cut
export const C06_END = { view: { x: 1070, y: 772, s: 1.02 }, cityX0: 760 };
export function lastWindowScreen() { const v = C06_END.view; const L = CITY.last; return X.toScreen(v, C06_END.cityX0 + L.x + L.w / 2, LY + L.y + L.h / 2); }
