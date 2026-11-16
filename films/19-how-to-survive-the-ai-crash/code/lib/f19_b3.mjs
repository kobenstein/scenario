// Film 19 · B3 (c11, c12 + end screen) · own helpers and props (builder B3; the kit stays untouched).
//   2D world camera for the view under the road (c11): vcam / vset / layer parallax; under-road world (deck, pillars, nets) drawn
//   in world coordinates so that the identity camera equals plateNet exactly; props: brake gauge + lever, March calendar, shake table,
//   bank models, fund towers, the SEPARATE COMPANY box, indigo hands, the 1987 trading floor, the Hyperion site, the studio, the street.
//   The road in c12: zoomRc (an exact screen zoom of the road camera around an anchor point), the goal sign with the flap counter,
//   and the counter stage shared by c11 (send → the HUD counter grows) and c12 (it lands on DAY 1,000 and becomes the sign).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
import * as PR from './f19_props.mjs';
import { NET_PLATE } from './f19_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, glowFill, lin, rad, prng, drift } = E;
const { RED, COOL } = F;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, glowFill, lin, rad, prng, drift };

// ============================================================================================== world camera (c11)
// V = { x, y, s }: the world point shown at the frame centre and the scale. Identity = { 960, 540, 1 } (= the plate).
export const V0 = { x: 960, y: 540, s: 1 };
// calm: a move between two keys takes at most MOVE_MAX s and ends ON the later key (its word); before it the camera holds (the
// engine's float keeps it alive). Long, always-moving glides read as restless (calm.py mafd). A key may give its own duration as [3].
export const MOVE_MAX = 1.7;
const mstart = (K, i) => Math.max(K[i][0], K[i + 1][0] - (K[i + 1][3] ?? MOVE_MAX));
export function vcam(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  const L = K[K.length - 1]; if (t >= L[0]) return { ...L[1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = K[i][1], b = K[i + 1][1], ez = { s: sineIO, q: quartIO, o: expoOut, i: expoIn }[K[i + 1][2] || 's'];
  const u = ez(clamp((t - mstart(K, i)) / (K[i + 1][0] - mstart(K, i))));
  return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)) };
}
// parallax layer: par 1 = the main plane, < 1 farther, > 1 nearer. Identity stays identity for every par.
export const layer = (V, par = 1) => ({ x: 960 + (V.x - 960) * par, y: 540 + (V.y - 540) * par, s: V.s ** par });
export function vset(ctx, V) { ctx.setTransform(V.s, 0, 0, V.s, W / 2 - V.x * V.s, H / 2 - V.y * V.s); }
export const w2s = (V, x, y) => [W / 2 + (x - V.x) * V.s, H / 2 + (y - V.y) * V.s];
export const r2s = (V, r) => { const [x, y] = w2s(V, r.x, r.y); return { x, y, w: r.w * V.s, h: r.h * V.s }; };

// ============================================================================================== under the road (world coordinates)
const DAWN = { top: '#1a2a5e', mid: '#46507e', low: '#c9a77a' };
export const DECK = NET_PLATE.deckY;      // 130
export const PIL = { p33: 330, p87: 960, p08: 1590, dc: 2560 };
// background (screen space, identical to underRoad) + the deck in world space
export function underBack(ctx, t, warm = 0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, DAWN.top, warm)], [.5, mixHex(P.night1, DAWN.mid, warm * .7)], [1, mixHex(mixHex(P.ind0, P.blue1, .25), DAWN.low, warm * .5)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
export function deckW(ctx, t, V, warm = 0) {
  ctx.save(); vset(ctx, V);
  const x0 = V.x - W / 2 / V.s - 200, x1 = V.x + W / 2 / V.s + 200, dy = DECK;
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(x0, -3000, x1 - x0, 3000 + dy);
  ctx.strokeStyle = rgba(P.blue2, .55); ctx.lineWidth = 2;
  for (let x = 40 + Math.floor((x0 - 40) / 160) * 160; x < x1; x += 160) { ctx.beginPath(); ctx.moveTo(x, -3000); ctx.lineTo(x, dy); ctx.stroke(); }
  ctx.fillStyle = rgba(COOL.mid, .35 + warm * .2); ctx.fillRect(x0, dy - 3, x1 - x0, 3);
  ctx.fillStyle = lin(ctx, 0, dy, 0, dy + 120, [[0, rgba(COOL.edge, .18)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(x0, dy, x1 - x0, 120);
  ctx.restore();
}
// the three pillars of the plate + the data-center pillar (only beyond the frame at the plate)
export function pillarsW(ctx, t, V, o = {}) {
  ctx.save(); vset(ctx, V);
  const lit = o.lit || [.4, 1, .4];
  NET_PLATE.pillars.forEach(([x, l, s], i) => pillar(ctx, t, x, DECK, 3000, x === 960 ? 150 : 110, { label: l, sub: s, lit: lit[i], plateY: 80, size: x === 960 ? 22 : 17, warm: o.warm }));
  if (o.dc !== false) {
    // the DATA CENTER DEBT pillar: cool, no net on its side
    pillar(ctx, t, PIL.dc, DECK, 3000, 110, { label: null, lit: 0, plateY: 80, size: 17, cool: 1 });
  }
  // the end post of the 1933 net (off-frame at the plate)
  ctx.restore();
}
function pillar(ctx, t, x, y0, y1, w, o) {
  if (!o.cool && !o.warm) return F.pillar(ctx, t, x, y0, y1, w, o);
  ctx.save();
  const c = o.cool ? 1 : 0, wm = clamp(o.warm ?? 0);
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(mixHex(P.ind1, P.blue1, .35), DAWN.low, wm * .35)], [.35, P.ind1], [1, P.night1]]); ctx.fillRect(x - w / 2, y0, w, y1 - y0);
  ctx.fillStyle = rgba(c ? COOL.core : P.halo1, c ? .3 : .3 * wm); ctx.fillRect(x - w / 2, y0, 2, y1 - y0);
  const py = y0 + (o.plateY ?? 60), lit = clamp(o.lit ?? 0);
  if (!o.label) { ctx.restore(); return; }
  const pl = new Path2D(); pl.roundRect(x - w * .46, py, w * .92, o.sub ? 70 : 46, 6);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.fill(pl); ctx.strokeStyle = rgba(c ? COOL.mid : P.halo0, .35 + .5 * lit); ctx.lineWidth = 2; ctx.stroke(pl);
  E.glowText(ctx, o.label, x, py + 31, { size: o.size ?? 20, align: 'center', spacing: .08, col: c ? COOL.core : (lit > .5 ? P.cream : mixHex(P.cream, P.blue2, .3)), glow: !c });
  if (o.sub) E.glowText(ctx, o.sub, x, py + 58, { size: 17, weight: 500, align: 'center', col: P.halo2, glow: false, spacing: .1 });
  ctx.restore();
}
// the plate's pillar plate rect (world) of pillar i (0 1933, 1 1987, 2 2008)
export const plateRect = (i) => { const [x] = NET_PLATE.pillars[i], w = (x === 960 ? 150 : 110) * .92; return { x: x - w / 2, y: DECK + 80, w, h: 70 }; };
// the two upper nets (left = Black Monday's circuit-breaker net, right = the stress-test net) and the 1933 net close in front
export function netsW(ctx, t, V, o = {}) {
  const L = o.lit || [.25, .25, .55];
  ctx.save(); vset(ctx, V);
  F.netSpan(ctx, t, [330, 520], [960, 520], { sag: 70, rows: 3, lit: L[0], a: .7, catch: o.catch0 });
  F.netSpan(ctx, t, [960, 520], [1590, 520], { sag: 70, rows: 3, lit: L[1], a: .7, catch: o.catch1 });
  ctx.restore();
  ctx.save(); vset(ctx, layer(V, o.fg ?? 1));
  F.netSpan(ctx, t, [-80, NET_PLATE.netY], [2000, NET_PLATE.netY], { sag: 90, rows: 4, lit: L[2], depth: 34 });
  // its end post (a short iron post, off-frame at the plate)
  ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.fillRect(1994, 760, 14, 900); ctx.fillStyle = rgba(COOL.mid, .25); ctx.fillRect(1994, 760, 2, 900);
  ctx.restore();
}
// a light that runs along a net (u 0..1 from p0 to p1): a moving glow on the rope, then the net is lit
export function netRun(ctx, V, p0, p1, sag, u, a = 1) {
  if (u <= 0 || u >= 1 || a <= 0) return;
  ctx.save(); vset(ctx, V);
  const x = lerp(p0[0], p1[0], u), y = lerp(p0[1], p1[1], u) + 4 * sag * u * (1 - u) + 20;
  halo(ctx, x, y, 90, .7 * a); ctx.restore();
}

// ============================================================================================== the brake (11.02–11.05)
// gauge: a small chart of one trading day at the 1987 pillar: 0 % at the top, marks −7 / −13 / −20; the red line falls; the lever
export const GAUGE = { x: 1200, y: 262, w: 230, pct: 8 };   // pct = world px per %
export const gy = (p) => GAUGE.y + p * GAUGE.pct;            // p in % (positive = loss)
export function gauge(ctx, t, V, o) {
  ctx.save(); vset(ctx, V); ctx.globalAlpha *= o.a ?? 1;
  const { x, w } = GAUGE, top = GAUGE.y, mk = o.marks ?? 1;
  // the zero line (record of the day) and three marks, drawn left → right
  ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x + w * clamp(o.zero ?? 1), top); ctx.stroke();
  [7, 13, 20].forEach((p, i) => {
    const u = clamp(mk * 3 - i); if (u <= 0) return;
    const hot = o.hot?.[i] ?? 0;
    ctx.setLineDash([3, 9]); ctx.strokeStyle = rgba(mixHex(P.halo1, P.core0, hot), .5 + .45 * hot); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x, gy(p)); ctx.lineTo(x + w * expoOut(u), gy(p)); ctx.stroke(); ctx.setLineDash([]);
    E.glowText(ctx, `−${p} %`, x + w * expoOut(u) + 14, gy(p) + 7, { size: 20, a: smooth(span(u, .4, 1)), col: hot > .5 ? P.cream : P.halo2, glow: hot > .5 });
  });
  // the day's red line
  if (o.line) {
    const { u, to, a: la = 1, x0 = 0 } = o.line;
    if (u > 0 && la > 0) {
      ctx.globalAlpha *= la; const pts = 26, path = new Path2D(); let tip = null;
      for (let i = 0; i <= pts * u; i++) { const s = i / pts, xx = x + w * (x0 + (1 - x0) * s) * .86, yy = gy(to * Math.min(1, s ** 1.3 + .04 * Math.sin(s * 23) * (1 - s))); i ? path.lineTo(xx, yy) : path.moveTo(xx, yy); tip = [xx, yy]; }
      ctx.shadowColor = rgba(RED.deep, .9); ctx.shadowBlur = 10; ctx.strokeStyle = RED.line; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke(path); ctx.shadowBlur = 0;
      if (tip) { ctx.fillStyle = RED.hot; ctx.beginPath(); ctx.arc(tip[0], tip[1], 5, 0, 7); ctx.fill(); }
      if (o.line.label && tip) E.glowText(ctx, o.line.label, tip[0] - 8, tip[1] + 30, { size: 24, col: RED.hot, glow: false, align: 'right', a: o.line.labelA ?? 1 });
    }
  }
  ctx.restore();
}
// the emergency-brake lever on the 1987 pillar's right face: o.out 0..1 (swings out of the pillar), o.pull 0..1 (yanked down)
export const LEVER = { x: 1036, y: 345, L: 108 };
export function lever(ctx, t, V, o) {
  const out = clamp(o.out ?? 0); if (out <= 0) return null;
  ctx.save(); vset(ctx, V);
  const { x, y, L } = LEVER, pull = clamp(o.pull ?? 0);
  // quadrant plate
  const q = new Path2D(); q.moveTo(x, y); q.arc(x, y, 64 * expoOut(out), -Math.PI * .5, Math.PI * .25); q.closePath();
  ctx.fillStyle = mixHex(P.ind1, P.night1, .3); ctx.fill(q); ctx.strokeStyle = rgba(P.halo0, .45); ctx.lineWidth = 2; ctx.stroke(q);
  // arm: folded flat against the pillar (pointing up, −90°) → upright-out (−55°) → pulled (+30°)
  const ang = lerp(lerp(-Math.PI * .5, -Math.PI * .2, expoOut(out)), Math.PI * .2, pull) + (o.tremble ?? 0) * Math.sin(t * 40) * .015;
  const hx = x + Math.cos(ang) * L * expoOut(out), hy = y + Math.sin(ang) * L * expoOut(out), gs = expoOut(out);
  ctx.strokeStyle = mixHex(P.shade0, P.ind1, .35); ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(hx, hy); ctx.stroke();
  // the red grip (a brake handle: red = the loss it reacts to, never a light)
  ctx.fillStyle = mixHex(RED.line, P.shade0, o.calm ?? 0); ctx.beginPath(); ctx.ellipse(hx, hy, 18 * gs, 24 * gs, ang + Math.PI / 2, 0, 7); ctx.fill();
  ctx.fillStyle = mixHex(P.shade0, P.ind1, .2); ctx.beginPath(); ctx.arc(x, y, 12 * gs, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba(P.halo0, .6); ctx.lineWidth = 2; ctx.stroke();
  if (o.flash > 0) halo(ctx, x, y, 140, .55 * o.flash);
  ctx.restore();
  return [hx, hy];
}
// March 2020 calendar (hangs from the deck on two cords; drops in from behind the deck edge)
export const CAL = { x: 440, y: 200, cell: 44 };
export function calendar(ctx, t, V, o) {
  const drop = clamp(o.drop ?? 0); if (drop <= 0) return;
  ctx.save(); vset(ctx, V);
  if (o.flip != null) { const fx = CAL.x + CAL.cell * 3.5 + 12, fy = CAL.y; ctx.translate(fx, fy); ctx.scale(1, Math.max(.02, o.flip)); ctx.translate(-fx, -fy); }
  const dy = (1 - expoOut(drop)) * -330 + (o.sway ?? 0) * Math.sin(t * 1.3) * 2, cw = CAL.cell, w = cw * 7 + 24, h = 64 + cw * 5 + 18;
  const x = CAL.x, y = CAL.y + dy;
  ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 30, DECK - 4); ctx.lineTo(x + 30, y); ctx.moveTo(x + w - 30, DECK - 4); ctx.lineTo(x + w - 30, y); ctx.stroke();
  const p = new Path2D(); p.roundRect(x, y, w, h, 8);
  glowFill(ctx, p, 22, .3, P.blue0);
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(P.ind1, P.blue1, .3)], [1, P.ind1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.halo0, .45); ctx.lineWidth = 2; ctx.stroke(p);
  if (o.page === 'nov') {
    E.glowText(ctx, 'NOV 5, 2026', x + w / 2, y + 44, { size: 26, align: 'center', spacing: .06 });
    E.glowText(ctx, '5', x + w / 2, y + 64 + cw * 3.6, { size: 150, serif: true, align: 'center' });
  } else {
    E.glowText(ctx, 'MARCH 2020', x + w / 2, y + 44, { size: 24, align: 'center', spacing: .1 });
    for (let d = 1; d <= 31; d++) {
      const c = (d - 1) % 7, r = Math.floor((d - 1) / 7), cx = x + 12 + c * cw + cw / 2, cy = y + 64 + r * cw + cw / 2, L = o.lit?.[d] ?? 0;
      if (L > 0) { halo(ctx, cx, cy, 44, .55 * L); ctx.fillStyle = rgba(P.core1, L); ctx.beginPath(); ctx.arc(cx, cy, 16 * expoOut(L), 0, 7); ctx.fill(); }
      E.glowText(ctx, String(d), cx, cy + 7, { size: 18, weight: L > .5 ? 600 : 500, align: 'center', col: L > .5 ? P.night1 : rgba(P.cream, .55), glow: false });
    }
  }
  ctx.restore();
}
// shake table + bank models (stress tests) at the 2008 pillar's left face; o.ext 0..1 stretches the table into the gap (11.16)
export const TABLE = { x0: 1240, x1: 1530, y: 470 };
export function shakeTable(ctx, t, V, o) {
  const out = clamp(o.out ?? 0); if (out <= 0) return { dx: 0 };
  ctx.save(); vset(ctx, V);
  const sh = o.shake ?? 0, dx = sh * (Math.sin(t * 31) * 7 + Math.sin(t * 19.7) * 4);
  const x1 = TABLE.x1, x0 = lerp(x1, TABLE.x0, expoOut(out)), y = TABLE.y;
  // springs under the top
  ctx.strokeStyle = rgba(P.halo2, .5); ctx.lineWidth = 2;
  for (let k = 0; k < 5; k++) { const xx = lerp(x0 + 20, x1 - 20, k / 4); ctx.beginPath(); for (let j = 0; j <= 8; j++) ctx.lineTo(xx + (j % 2 ? 6 : -6), y + 10 + j * 3); ctx.stroke(); }
  ctx.fillStyle = mixHex(P.ind1, P.night1, .3); ctx.fillRect(x0, y + 36, x1 - x0, 10);
  const top = new Path2D(); top.roundRect(x0 + dx, y - 4, x1 - x0, 14, 4);
  ctx.fillStyle = mixHex(P.shade0, P.ind1, .5); ctx.fill(top); ctx.strokeStyle = rgba(P.halo0, .5); ctx.lineWidth = 1.5; ctx.stroke(top);
  ctx.restore();
  return { dx, x0 };
}
export function bankModel(ctx, t, x, y, h, o = {}) {   // a small bank building of light standing on (x, y); o.rise 0..1 (from the table), o.wob (rad), o.lit
  const r = clamp(o.rise ?? 1); if (r <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x - h, y - h * 1.6, h * 2, h * 1.6); ctx.clip();
  ctx.translate(x, y + h * (1 - expoOut(r))); ctx.rotate(o.wob ?? 0);
  const w = h * .95, L = clamp(o.lit ?? .5), body = new Path2D();
  body.moveTo(-w / 2, 0); body.lineTo(-w / 2, -h * .62); body.lineTo(-w * .58, -h * .66); body.lineTo(0, -h); body.lineTo(w * .58, -h * .66); body.lineTo(w / 2, -h * .62); body.lineTo(w / 2, 0); body.closePath();
  glowFill(ctx, body, h * .25, .35 * L, P.halo0);
  ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, mixHex(P.core1, P.halo1, .3)], [1, mixHex(P.halo1, P.shade0, .5)]]); ctx.fill(body);
  ctx.fillStyle = rgba(P.shade1, .75); for (let k = -1.5; k <= 1.5; k++) ctx.fillRect(k * w * .22 - w * .045, -h * .56, w * .09, h * .5);
  ctx.restore();
}
// windowless fund towers (private credit): rise from below; o.rise 0..1
export const TOWERS = [[1930, 520, 96], [2090, 450, 110], [2250, 540, 92]];
export function towers(ctx, t, V, o) {
  ctx.save(); vset(ctx, V);
  TOWERS.forEach(([x, top, w], i) => {
    const r = expoOut(clamp((o.rise ?? 0) * 1.4 - i * .2)) * (1 - expoIn(clamp((o.sink ?? 0) * 1.3 - i * .15))); if (r <= 0) return;
    const y0 = lerp(1500, top, r), p = new Path2D(); p.rect(x - w / 2, y0, w, 1600);
    ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.ind0, COOL.deep, .45)], [.4, mixHex(P.night1, P.ind0, .6)], [1, P.night0]]); ctx.fill(p);
    ctx.fillStyle = rgba(COOL.mid, .35); ctx.fillRect(x - w / 2, y0, 2, 1600); ctx.fillRect(x - w / 2, y0, w, 3);
    // the inflow slit on the roof (where the money goes in)
    ctx.fillStyle = rgba(COOL.core, .6 * (o.slit ?? 1)); ctx.fillRect(x - w * .3, y0 - 2, w * .6, 4);
  });
  ctx.restore();
}
// the money stream: cool coin dots along a curve (pts in world), flowing (phase), u = how far the head got
export function stream(ctx, t, V, pts, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); vset(ctx, V);
  const n = o.n ?? 26, sp = o.speed ?? .32, a = o.a ?? 1;
  for (let i = 0; i < n; i++) {
    const s = ((i / n + t * sp) % 1); if (s > u) continue;
    const q = bez(pts, s), fade = smooth(span(s, 0, .06)) * (1 - smooth(span(s, .94, 1)));
    ctx.fillStyle = rgba(i % 5 ? COOL.mid : COOL.core, .85 * a * fade); ctx.beginPath(); ctx.arc(q[0], q[1], i % 5 ? 6 : 8, 0, 7); ctx.fill();
  }
  ctx.restore();
}
export function bez(p, s) { const m = 1 - s; return [m * m * m * p[0][0] + 3 * m * m * s * p[1][0] + 3 * m * s * s * p[2][0] + s * s * s * p[3][0], m * m * m * p[0][1] + 3 * m * m * s * p[1][1] + 3 * m * s * s * p[2][1] + s * s * s * p[3][1]]; }
// the SEPARATE COMPANY box (hangs from the deck on two cables): world rect, debt slabs inside (u), transparency (see)
export const BOX = { x: 1880, y: 230, w: 360, h: 240 };
export function debtBox(ctx, t, V, o) {
  const op = clamp(o.open ?? 1); if (op <= 0) return;
  ctx.save(); vset(ctx, V);
  const b = BOX, dx = o.dx ?? 0, wob = o.wob ?? 0, x = b.x + dx;
  ctx.translate(x + b.w / 2, b.y + b.h); ctx.rotate(wob); ctx.translate(-(x + b.w / 2), -(b.y + b.h));
  if (o.cables !== false) { ctx.strokeStyle = rgba(COOL.mid, .35 * (o.cables ?? 1)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 40, DECK); ctx.lineTo(x + 40, b.y); ctx.moveTo(x + b.w - 40, DECK); ctx.lineTo(x + b.w - 40, b.y); ctx.stroke(); }
  const p = new Path2D(), see = clamp(o.see ?? 0); p.roundRect(x, b.y, b.w, b.h, 8);
  glowFill(ctx, p, 30, .3, COOL.edge);
  ctx.fillStyle = lin(ctx, 0, b.y, 0, b.y + b.h, [[0, mixHex(mixHex(P.ind0, COOL.deep, .3), P.night1, see * .6)], [1, mixHex(P.night0, P.night1, see)]]); ctx.fill(p);
  // debt slabs: a stack of cool bars (bonds) from the bottom
  const u = clamp(o.stack ?? 0), n = 9;
  for (let k = 0; k < n; k++) {
    const e = expoOut(clamp(u * n - k)); if (e <= 0) continue;
    const yy = b.y + b.h - 18 - (k + 1) * 20 + (1 - e) * -60, ww = b.w * .48;
    const lit = clamp(o.lit ?? 0), q = new Path2D(); q.roundRect(x + 24, yy, ww, 15, 3);
    ctx.globalAlpha = e;
    ctx.fillStyle = mixHex(mixHex(COOL.edge, COOL.mid, k % 2 ? .3 : .6), P.halo1, lit * .6); ctx.fill(q);
    ctx.globalAlpha = 1;
  }
  // the outline: dashed while the inside is hidden, solid gold once it is seen
  ctx.setLineDash(see > .5 ? [] : [10, 8]); ctx.strokeStyle = rgba(mixHex(COOL.mid, P.halo0, see), .8); ctx.lineWidth = 3; ctx.stroke(p); ctx.setLineDash([]);
  if (o.label > 0) E.glowText(ctx, 'SEPARATE COMPANY', x + b.w / 2, b.y - 16 + (1 - expoOut(o.label)) * 14, { size: 22, align: 'center', spacing: .1, a: o.label, col: COOL.core });
  if (o.bonds > 0) {
    const pz = 1 + .12 * Math.sin(Math.PI * clamp(o.measure ?? 0));
    ctx.save(); ctx.translate(x + b.w * .76, b.y + b.h * .52); ctx.scale(pz, pz);
    E.glowText(ctx, '≈ $27B', 0, (1 - expoOut(o.bonds)) * 14, { size: 36, align: 'center', a: o.bonds });
    ctx.restore();
    E.glowText(ctx, 'BONDS', x + b.w * .76, b.y + b.h * .52 + 34 + (1 - expoOut(o.bonds)) * 14, { size: 17, align: 'center', spacing: .14, col: P.halo2, glow: false, a: o.bonds });
  }
  // ownership bar under the box: one bar that splits 80 / 20
  const sp = clamp(o.split ?? 0), bar = clamp(o.bar ?? 0);
  if (bar > 0) {
    const by = b.y + b.h + 26, bw = b.w * expoOut(bar), gap = 10 * expoOut(sp);
    ctx.fillStyle = mixHex(COOL.mid, P.halo1, .2); ctx.fillRect(x, by, bw * .8 - gap / 2, 12);
    ctx.fillStyle = mixHex(P.halo1, P.core1, .3); ctx.fillRect(x + bw * .8 + gap / 2, by, bw * .2 - gap / 2, 12);
    if (sp > 0) {
      E.glowText(ctx, '80 % BLUE OWL', x, by + 44 + (1 - expoOut(sp)) * 10, { size: 21, spacing: .06, a: sp });
      E.glowText(ctx, '20 % META', x + b.w, by + 44 + (1 - expoOut(sp)) * 10, { size: 21, spacing: .06, align: 'right', a: smooth(span(sp, .25, 1)) });
    }
  }
  ctx.restore();
}
// big indigo hands (others): reaching from below, like PR.hand but indigo sleeves and a cool rim
export function ihand(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.ang ?? 0); ctx.scale(s, s);
  const sk = o.skin ?? mixHex(P.blue1, P.ind2, .25), sl = o.sleeve ?? [mixHex(P.ind2, P.blue1, .4), P.ind1];
  ctx.fillStyle = lin(ctx, -40, 0, 40, 0, [[0, sl[0]], [1, sl[1]]]); ctx.beginPath(); ctx.roundRect(-40, 30, 80, 520, 22); ctx.fill();
  ctx.fillStyle = rgba(o.rim ?? P.blue0, .6); ctx.fillRect(-40, 34, 4, 516);
  ctx.fillStyle = mixHex(sl[1], P.night1, .3); ctx.fillRect(-40, 30, 80, 16);
  const g = clamp(o.grip ?? 0);
  ctx.fillStyle = sk;
  ctx.beginPath(); ctx.roundRect(-34, -40, 68, 78, 22); ctx.fill();                         // palm
  [[-26, 1], [-9, 1.12], [8, 1.06], [24, .9]].forEach(([fx, L]) => {                          // fingers (curl with grip)
    const len = 58 * L * (1 - .45 * g);
    ctx.save(); ctx.translate(fx, -34); ctx.rotate((fx / 60) * .25); ctx.beginPath(); ctx.roundRect(-7.5, -len, 15, len + 8, 7.5); ctx.fill(); ctx.restore();
  });
  ctx.save(); ctx.translate(-32, 0); ctx.rotate(-.9 + g * .5); ctx.beginPath(); ctx.roundRect(-8, -46, 16, 50, 8); ctx.fill(); ctx.restore();   // thumb
  ctx.restore();
}

// ============================================================================================== vignettes (inside vWindow)
// the 1987 trading floor: indigo traders at desks, a board of red arrows, paper flying from the "single day" on
export function tradingFloor(ctx, t, r, o) {
  const fy = r.y + r.h * .66;
  ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + r.h, [[0, mixHex(P.ind0, P.blue1, .25)], [.66, mixHex(P.ind1, P.shade1, .15)], [.661, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]); ctx.fillRect(r.x, r.y, r.w, r.h);
  // the quote board (rows of small screens, numbers falling = red ticks)
  const bx = r.x + r.w * .08, bw = r.w * .84, by = r.y + r.h * .13, bh = r.h * .3;
  ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.fillRect(bx, by, bw, bh);
  const rr = prng(87);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 14; j++) {
    const cx = bx + 14 + j * (bw - 28) / 14, cy = by + 14 + i * (bh - 20) / 6, red = rr() < .55 + .4 * (o.panic ?? 0);
    ctx.fillStyle = red ? rgba(RED.line, .55 + .35 * Math.sin(t * 3 + i + j)) : rgba(COOL.mid, .35); ctx.fillRect(cx, cy, (bw - 28) / 14 - 10, (bh - 20) / 6 - 9);
  }
  // the ticker band under the board
  const ty = by + bh + r.h * .045, th = r.h * .085;
  ctx.fillStyle = mixHex(P.night0, RED.ink, .6); ctx.fillRect(r.x, ty, r.w, th);
  if ((o.tick ?? 0) > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(r.x, ty, r.w * expoOut(o.tick), th); ctx.clip();
    const sz = Math.round(th * .5);
    E.glowText(ctx, 'BLACK MONDAY · OCT 19, 1987 · DOW', r.x + r.w * .06, ty + th * .68, { size: sz, col: P.cream, glow: false, spacing: .06 });
    ctx.font = `600 ${sz}px Inter`; ctx.letterSpacing = '0.06em'; const w0 = ctx.measureText('BLACK MONDAY · OCT 19, 1987 · DOW ').width; ctx.letterSpacing = '0px';
    E.glowText(ctx, '−22.6 %', r.x + r.w * .06 + w0 + 8, ty + th * .68 + (1 - expoOut(o.num ?? 0)) * th, { size: sz, col: RED.hot, glow: false, a: o.num ?? 0, spacing: .06 });
    ctx.restore();
  }
  // desks and traders (indigo, alive: weight shifts, arms up in the panic)
  const rows = [[.74, .5, 6], [.88, .66, 5]];
  for (const [yy, sc, n] of rows) {
    const py = r.y + r.h * yy, ph = r.h * .3 * sc;
    for (let k = 0; k < n; k++) {
      const px = r.x + r.w * (.1 + k * .8 / (n - 1)) + (yy > .8 ? r.w * .06 : 0), ex = Math.sin(t * 2.1 + k * 1.7);
      const up = (o.panic ?? 0) * (k % 2 ? 1 : .6);
      E.person(ctx, px, py, ph, { dir: k % 2 ? 1 : -1, lean: .03 * ex, armR: [lerp(.3, 2.7, up) + .1 * ex, lerp(.2, 2.9, up)], armL: [-.3 - .2 * up, -.2], look: .3 + .3 * up });
    }
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(r.x, py - ph * .3, r.w, ph * .1);
  }
  // paper flying (falls slowly, turns)
  const pf = o.paper ?? 0;
  if (pf > 0) {
    const pr = prng(1987);
    for (let i = 0; i < 34; i++) {
      const x0 = r.x + pr() * r.w, sp = .25 + pr() * .35, ph = pr() * 6, life = (pf * (1 + pr() * .5)), y0 = r.y + r.h * (.35 + pr() * .3);
      const px = x0 + Math.sin(t * 1.3 + ph) * 30 + life * 60 * (pr() - .5), py = y0 - Math.sin(clamp(life * 1.5) * Math.PI) * r.h * .25 + life * r.h * sp * .6;
      ctx.save(); ctx.translate(px, py); ctx.rotate(t * (1 + pr()) + ph); ctx.scale(1, Math.cos(t * 2.4 + ph));
      ctx.fillStyle = rgba(P.cream, .85 * clamp(pf * 4)); ctx.fillRect(-11, -8, 22, 16); ctx.restore();
    }
  }
}
// the Hyperion site: flat land to the horizon, long low halls, cranes turning
export function hyperion(ctx, t, r, o = {}) {
  const hy = r.y + r.h * .58;
  ctx.fillStyle = lin(ctx, 0, r.y, 0, hy, [[0, mixHex(P.night0, P.ind0, .4)], [1, mixHex(P.blue1, P.ind1, .5)]]); ctx.fillRect(r.x, r.y, r.w, hy - r.y);
  ctx.fillStyle = lin(ctx, 0, hy, 0, r.y + r.h, [[0, mixHex(P.ind1, P.blue0, .2)], [1, P.night0]]); ctx.fillRect(r.x, hy, r.w, r.y + r.h - hy);
  // halls: long cool blocks receding (low on the horizon), lit edges
  const blocks = [[.08, .5, .045], [.3, .74, .06], [.55, .95, .04], [.12, .44, .09]];
  blocks.forEach(([a, b, h], i) => {
    const y1 = hy + (i === 3 ? r.h * .12 : 0), x0 = r.x + r.w * a, x1 = r.x + r.w * b, hh = r.h * h;
    ctx.fillStyle = mixHex(P.ind0, COOL.deep, .5); ctx.fillRect(x0, y1 - hh, x1 - x0, hh);
    ctx.fillStyle = rgba(COOL.mid, .5); ctx.fillRect(x0, y1 - hh, x1 - x0, 2);
    for (let x = x0 + 10; x < x1 - 10; x += 26) { ctx.fillStyle = rgba(COOL.core, .25 + .2 * Math.sin(t * 1.4 + x)); ctx.fillRect(x, y1 - hh * .55, 12, hh * .2); }
  });
  // cranes to the horizon (mast + slowly turning jib)
  const cr = [[.2, .34], [.38, .28], [.62, .3], [.8, .24], [.92, .18], [.48, .2]];
  cr.forEach(([u, hh], i) => {
    const x = r.x + r.w * u, top = hy - r.h * hh, jl = r.h * hh * .8, ang = Math.sin(t * .25 + i * 1.9) * .9;
    ctx.strokeStyle = mixHex(P.halo1, P.ind2, .35); ctx.lineWidth = Math.max(1.5, r.w * .003);
    ctx.beginPath(); ctx.moveTo(x, hy + (i === 0 ? r.h * .12 : 0)); ctx.lineTo(x, top); ctx.stroke();
    const c = Math.cos(ang); ctx.beginPath(); ctx.moveTo(x - jl * .3 * c, top); ctx.lineTo(x + jl * c, top); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + jl * c * .8, top); ctx.lineTo(x + jl * c * .8, top + r.h * .06); ctx.stroke();
    halo(ctx, x, top - 4, 16, .5, P.halo0);
  });
  E.glowText(ctx, 'HYPERION DATA CENTER · LOUISIANA', r.x + 36, r.y + r.h - 40, { size: Math.round(r.h * .052), a: o.label ?? 1, spacing: .06 });
}
// the interview studio (drawn): two chairs, a lamp of the studio, two indigo silhouettes in profile
export function studio(ctx, t, r, o = {}) {
  ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + r.h, [[0, mixHex(P.ind0, P.blue1, .35)], [1, P.night0]]); ctx.fillRect(r.x, r.y, r.w, r.h);
  halo(ctx, r.x + r.w * .5, r.y + r.h * .35, r.w * .45, .3);
  const fy = r.y + r.h * .86, ph = r.h * .62;
  E.person(ctx, r.x + r.w * .3, fy, ph, { dir: 1, look: .2, lean: .03 * Math.sin(t * .9) });
  E.person(ctx, r.x + r.w * .7, fy, ph * 1.02, { dir: -1, armR: [1.2 + .15 * Math.sin(t * 1.7), 1.6], lean: -.02 });
  ctx.fillStyle = mixHex(P.night1, P.ind1, .3); ctx.fillRect(r.x, fy - 4, r.w, r.y + r.h - fy + 4);
  E.glowText(ctx, 'DEC 16, 2025', r.x + 28, r.y + 46, { size: Math.round(r.h * .06), a: o.label ?? 1, spacing: .08 });
}

// ============================================================================================== the road (c12)
// exact screen zoom of a road camera: the point (px, py) of the k = 1 picture goes to (tx, ty), everything scales by k around it
export function zoomRc(rc, k, px, py, tx = W / 2, ty = H / 2) { return { ...rc, f: rc.f * k, vx: tx - k * (px - rc.vx), hy: ty - k * (py - rc.hy) }; }
// the goal sign with the flap counter on its face (kit wish: goalSign with a flap face). Returns the face centre + flap height.
export function goalFlap(ctx, t, rc, X, Z, o = {}) {
  const p = F.rpt(rc, X, Z); if (!p) return null;
  const s = p[2], pw = 420, ph = 190, top = 360, panel = o.panel ?? 1;
  const cx = p[0], cy = p[1] - (top + ph / 2) * s;
  ctx.save();
  if (panel > 0) {
    ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(s, s);
    ctx.globalAlpha *= panel;
    ctx.fillStyle = mixHex(P.night1, P.blue2, .3); for (const sx of [-1, 1]) ctx.fillRect(sx * pw * .3 - 6, -top, 12, top);
    ctx.restore();
  }
  ctx.restore();
  return { cx, cy, s, pw: pw * s, ph: ph * s, flapH: 92 * s };
}
// the sign face drawn around the flap (grows out of the counter: pad 0 → 1)
export function signFace(ctx, cx, cy, w, h, pad, lit = 1) {
  if (pad <= 0) return;
  const pw = lerp(w * .9, w, pad), ph = lerp(h * .55, h, pad), p = new Path2D(); p.roundRect(cx - pw / 2, cy - ph / 2, pw, ph, ph * .08);
  ctx.save(); ctx.globalAlpha *= clamp(pad * 1.5);
  glowFill(ctx, p, ph * .25, .4 * lit * smooth(clamp(pad * 1.5)), P.halo0);   // (the glow ignores globalAlpha)
  ctx.fillStyle = lin(ctx, 0, cy - ph / 2, 0, cy + ph / 2, [[0, mixHex(P.ind1, P.blue1, .35)], [1, P.ind1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.halo0, .85); ctx.lineWidth = Math.max(2, ph * .025); ctx.stroke(p);
  ctx.restore();
}
// the flap counter centred at (cx, cy) with digit height h (value from dayAt)
export function flapC(ctx, t, cx, cy, h, value, a = 1) {
  // laid out on the 4-digit width and right-aligned, so the digits stay put when the leading "1," cell arrives on day 1,000
  const m = F.flap(ctx, t, 0, 0, h, { value, a: 0 }), m4 = F.flap(ctx, t, 0, 0, h, { value: 1000, a: 0 });
  F.flap(ctx, t, cx + m4.w / 2 - m.w, cy - h / 2, h, { value, a, glow: 1 });
  return m;
}
// the town/street window scenes (12.08, inside a vWindow): a slow truck along a morning street of lit windows
export function street(ctx, t, r, u) {
  ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + r.h, [[0, '#2a3a72'], [.7, '#5a5f86'], [1, '#c9a77a']]); ctx.fillRect(r.x, r.y, r.w, r.h);
  const s = r.h / 560, gy = r.y + r.h * .9, off = -u * 900 * s;
  const scenes = ['clinic', 'class', 'shop', 'kitchen', 'clinic2'];
  ctx.save(); ctx.translate(r.x + 60 * s + off, 0);
  scenes.forEach((kind, i) => {
    const x = i * 470 * s, bw = 430 * s, bh = (360 + (i % 2) * 50) * s, top = gy - bh;
    ctx.fillStyle = mixHex(P.ind1, '#46507e', .35 + (i % 2) * .1); ctx.fillRect(x, top, bw, bh);
    ctx.fillStyle = rgba('#e9c79a', .35); ctx.fillRect(x, top, bw, 3);
    const wx = x + 40 * s, wy = top + 60 * s, ww = bw - 80 * s, wh = bh - 120 * s;
    const p = new Path2D(); p.rect(wx, wy, ww, wh);
    glowFill(ctx, p, 30 * s, .45, P.halo0);
    ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(P.core1, P.halo1, .2)], [1, mixHex(P.halo1, P.shade0, .35)]]); ctx.fill(p);
    ctx.save(); ctx.clip(p); windowScene(ctx, t, kind, wx, wy, ww, wh, i); ctx.restore();
    ctx.strokeStyle = mixHex(P.ind1, P.night1, .4); ctx.lineWidth = 6 * s; ctx.strokeRect(wx, wy, ww, wh);
  });
  ctx.restore();
  ctx.fillStyle = mixHex(P.ind1, P.night1, .5); ctx.fillRect(r.x, gy, r.w, r.y + r.h - gy);
}
function windowScene(ctx, t, kind, x, y, w, h, i) {
  const fy = y + h, ph = h * .62, sw = (k) => Math.sin(t * 1.6 + k + i);
  const chip = (cx, cy) => { halo(ctx, cx, cy, h * .16, .5, COOL.mid, COOL.core); ctx.fillStyle = rgba(COOL.core, .9); ctx.fillRect(cx - h * .03, cy - h * .03, h * .06, h * .06); };
  if (kind === 'clinic' || kind === 'clinic2') {
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(x + w * .1, fy - h * .28, w * .5, h * .08);   // the bed
    chip(x + w * .78, y + h * .3);
    E.person(ctx, x + w * .72, fy, ph, { dir: -1, lean: .04 * sw(0), armR: [1.5, 1.2] });
  } else if (kind === 'class') {
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(x + w * .55, y + h * .15, w * .38, h * .3);   // the board
    chip(x + w * .74, y + h * .3);
    for (let k = 0; k < 3; k++) E.person(ctx, x + w * (.12 + k * .16), fy, ph * .62, { dir: 1, look: .4 + .1 * sw(k), lean: .02 * sw(k) });
    E.person(ctx, x + w * .62, fy, ph, { dir: -1, armR: [2.2 + .1 * sw(2), 2.3] });
  } else if (kind === 'shop') {
    ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.fillRect(x + w * .1, fy - h * .3, w * .8, h * .06);   // the bench
    chip(x + w * .5, fy - h * .38);
    E.person(ctx, x + w * .3, fy, ph, { dir: 1, armR: [1.6 + .12 * sw(0), 1.4], lean: .05 });
  } else {
    ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.fillRect(x + w * .2, fy - h * .3, w * .6, h * .05);   // the kitchen table
    chip(x + w * .5, fy - h * .36);
    E.person(ctx, x + w * .25, fy, ph * .9, { dir: 1, armR: [1.4, 1.3 + .1 * sw(0)] });
    E.person(ctx, x + w * .75, fy, ph * .85, { dir: -1, look: .2 + .1 * sw(1) });
  }
}

// ============================================================================================== c11 → c12: DAY 1,000 (shared)
// the road set of c12 (camera z 0 looking down the road), the goal sign on the left verge, you beside it
export const GOAL = { X: -760, Z: 2600 }, YOU = { X: -380, Z: 2500, h: 230 }, KMAX = 6;
const RC0 = F.roadSetCam(0);
const gp0 = F.rpt(RC0, GOAL.X, GOAL.Z);
export const PANEL0 = [gp0[0], gp0[1] - (360 + 95) * gp0[2]];            // the face centre at k = 1
export const FH = 92 * gp0[2] * KMAX;                                    // flap digit height at the counter zoom
export const ZSTAGE = { k: KMAX, px: PANEL0[0], py: PANEL0[1] };
export const ZID = { k: 1, px: W / 2, py: H / 2 };
export function zkeys(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  const L = K[K.length - 1]; if (t >= L[0]) return { ...L[1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = K[i][1], b = K[i + 1][1], u = ({ s: sineIO, q: quartIO, i: expoIn, o: expoOut })[K[i + 1][2] || 's'](clamp((t - mstart(K, i)) / (K[i + 1][0] - mstart(K, i))));
  // the anchor moves in the zoomed picture's space so the pan and the zoom stay one move
  const k = Math.exp(lerp(Math.log(a.k), Math.log(b.k), u));
  // w runs with 1/k: the anchor's screen pan then keeps pace with the log zoom (no whip at high zoom, smooth.py)
  const w = (a.k === b.k) ? u : (1 / k - 1 / a.k) / (1 / b.k - 1 / a.k);
  return { k, px: lerp(a.px, b.px, w), py: lerp(a.py, b.py, w) };
}
// the send of the question and the counter clone (c11)
export const SEND = (T) => { const t0 = T.GE('checking it') + .45; return { t0, t1: t0 + .9, x: 1480, y: 700 }; };
export const C1000 = (T) => ({ t0: SEND(T).t1, t1: T.G('Day one thousand') });
export function counterClone(ctx, t, T) {
  const c = C1000(T); if (t < c.t0 || t >= c.t1) return;
  const e = sineIO(span(t, c.t0, c.t1)), h = Math.exp(lerp(Math.log(F.HUD_DAY.h), Math.log(FH), e)), v = F.dayAt(t, T);
  const m = F.flap(ctx, t, 0, 0, h, { value: v, a: 0 }), m4 = F.flap(ctx, t, 0, 0, h, { value: 1000, a: 0 });
  const xR = lerp(F.HUD_DAY.x, W / 2 + m4.w / 2, e), y = lerp(F.HUD_DAY.y, H / 2 - h / 2, e);   // lands right-aligned like flapC
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  halo(ctx, xR - m.w / 2, y + h / 2, m.w * .6, .25 * e);
  F.flap(ctx, t, xR - m.w, y, h, { value: v, glow: 1 });
  ctx.restore();
}
// the whole road picture of c12 (and the background of c11's last seconds). o: { z (walk), warm, glitter, dawn, you: {...du opts, walk},
// umb: { open, lit[5], wide5, r }, pad (sign face), counter (draw the flap on the sign), hall, exits, crowd, end }
export function road12(ctx, t, T, Z, o = {}) {
  const z = o.z ?? 0, rc0 = F.roadSetCam(z, { h: o.h ?? 300, hy: o.hy ?? 560 }), rc = zoomRc(rc0, Z.k, Z.px, Z.py, Z.tx ?? W / 2, Z.ty ?? H / 2), warm = clamp(o.warm ?? 0);
  F.road(ctx, t, rc, { mist: .55 + .15 * warm, warm, lit: .3 * warm });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the dawn at the end of the road (the hero light of the morning)
  if ((o.dawn ?? 0) > 0) {
    const d = o.dawn, kk = Z.k ** .8;
    // a warm band along the horizon, the sun's rim just above the mist
    ctx.fillStyle = lin(ctx, 0, rc.hy - 260 * kk, 0, rc.hy + 60 * kk, [[0, rgba('#e9b27a', 0)], [.7, rgba('#f2c48e', .32 * d)], [1, rgba('#f6d6a6', .0)]]); ctx.fillRect(0, rc.hy - 260 * kk, W, 320 * kk);
    ctx.save(); ctx.translate(rc.vx, rc.hy); ctx.scale(2.6, 1); halo(ctx, 0, 0, 260 * kk, .45 * d, '#f2c48e', '#fff1d6'); ctx.restore();
    const sr = 46 * kk * (.6 + .4 * d);
    ctx.save(); ctx.globalAlpha *= clamp(o.sun ?? 1); ctx.beginPath(); ctx.rect(0, 0, W, rc.hy + 4); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, rc.hy - sr, 0, rc.hy, [[0, rgba('#fff4dc', d)], [1, rgba('#f7c98d', d)]]); ctx.beginPath(); ctx.arc(rc.vx, rc.hy + sr * (1 - .55 * d), sr, 0, 7); ctx.fill();
    ctx.restore();
  }
  // the data-center hall from c03, far on the left horizon (it still stands; cool windows)
  let hallWin = null;
  if ((o.hall ?? 1) > 0) {
    const a = F.rpt(rc, 3200, 22000), b = F.rpt(rc, 15000, 22000), s = a[2], hh = 1900 * s;
    ctx.fillStyle = mixHex(mixHex(P.ind0, COOL.deep, .3), '#46507e', warm * .4); ctx.fillRect(a[0], a[1] - hh, b[0] - a[0], hh + 2);
    ctx.fillStyle = rgba(COOL.mid, .45); ctx.fillRect(a[0], a[1] - hh, b[0] - a[0], Math.max(1, 1.5 * Z.k ** .5));
    for (let r = 0; r < 3; r++) for (let x = 3600, k = 0; x < 14700; x += 520, k++) {
      const q = F.rpt(rc, x, 22000), ww = 300 * s, wh = 170 * s, wy = q[1] - hh + (330 + r * 480) * s;
      ctx.fillStyle = rgba(COOL.core, (.45 + .25 * Math.sin(t * 1.3 + k * 1.7 + r)) * (o.hall ?? 1)); ctx.fillRect(q[0], wy, ww, wh);
      if (r === 1 && k === 9) hallWin = { x: q[0], y: wy, w: ww, h: wh };
    }
  }
  // glitter where the bubble was (it is gone)
  if ((o.glitter ?? 0) > 0) {
    const r = prng(1000);
    for (let i = 0; i < 70; i++) {
      const u0 = r(), v0 = r(), sp = .015 + r() * .03, ph = r() * 6.3;
      const x = rc.vx + (u0 - .65) * 1500 * Z.k ** .5 + Math.sin(t * .6 + ph) * 12, y = ((v0 + t * sp) % 1) * (rc.hy - 40);
      ctx.fillStyle = rgba(i % 3 ? COOL.core : P.halo0, (.35 + .45 * Math.sin(t * 3 + ph) ** 2) * o.glitter); ctx.beginPath(); ctx.arc(x, y, 1.4 + (i % 4) * .5, 0, 7); ctx.fill();
    }
  }
  ctx.restore();
  // the four exits, far on the road (behind you on the way)
  if ((o.exits ?? 1) > 0) [[5200, 3], [8000, 2], [12500, 1], [20000, 0]].forEach(([Zs, i]) => { if (Zs - rc0.z > 300) F.exitSign(ctx, t, rc, F.ROADSET.signX, Zs, { ...F.EXITS[i], lit: .35, a: o.exits ?? 1 }); });
  // the crowd: side roads join yours, people with small lit umbrellas walk in on them
  if ((o.crowd ?? 0) > 0) crowd(ctx, t, rc, o.crowd);
  // the goal sign: posts, the face growing out of the counter, the flap on it
  const gp = F.rpt(rc, GOAL.X, GOAL.Z);
  let panel = null;
  if (gp) {
    const s = gp[2], cx = gp[0], cy = gp[1] - (360 + 95) * s;
    ctx.save(); ctx.fillStyle = mixHex(P.night1, P.blue2, .3); for (const sx of [-1, 1]) ctx.fillRect(cx + sx * 420 * .3 * s - 6 * s, cy + 95 * s, 12 * s, 360 * s); ctx.restore();
    signFace(ctx, cx, cy, 420 * s, 190 * s, o.pad ?? 1, 1);
    if (o.counter !== false) flapC(ctx, t, cx, cy, 92 * s, o.value ?? F.dayAt(t, T));
    panel = { cx, cy, s };
  }
  // you (and your umbrella)
  let you = null;
  if (o.you !== false) {
    const Y = o.youAt || YOU, Zy = Y.Z + (o.youDz ?? 0) + z;
    const p = F.rpt(rc, Y.X, Zy);
    if (p) {
      const s = p[2], h = Y.h * s, yo = o.you || {};
      ctx.save();
      let sx = Math.cos(Math.PI * (yo.turn ?? 0)); if (Math.abs(sx) < .06) sx = .06 * Math.sign(sx || 1);
      ctx.translate(p[0], 0); ctx.scale(sx, 1); ctx.translate(-p[0], 0);
      const hands = E.du(ctx, p[0], p[1], h, { dir: yo.dir ?? 1, look: yo.look ?? .2, walk: yo.walk, armR: yo.armR, back: yo.back ?? .2 });
      ctx.restore();
      for (const k of ['R', 'L']) if (hands[k]) hands[k] = [p[0] + (hands[k][0] - p[0]) * sx, hands[k][1]];
      you = { x: p[0], y: p[1], h, hands };
      const U = o.umb;
      if (U && (U.open ?? 0) > 0) {
        const r = (U.r ?? 120) * s, hx = hands.R[0], hy = hands.R[1];
        you.umb = F.umbrella(ctx, t, hx + r * .02, hy - r * .62, r, { stick: .62, open: U.open, lit: U.lit, wide5: U.wide5 ?? 0, glow: U.glow ?? 1, outline: U.outline ?? .5 });
        you.umbR = r;
      }
    }
  }
  return { rc, hallWin, panel, you };
}
// side roads joining yours, people walking in with small lit umbrellas (12.11)
function crowd(ctx, t, rc, a) {
  ctx.save(); ctx.globalAlpha *= clamp(a);
  const roads = [[-9000, 2600, -320, 9000], [9000, 2600, 320, 9000], [-14000, 6000, -280, 12000], [14000, 6000, 280, 12000]];
  for (const [x0, z0, x1, z1] of roads) {
    const n = 18, pts = [];
    for (let i = 0; i <= n; i++) { const u = i / n; pts.push([lerp(x0, x1, u), lerp(z0, z1, u)]); }
    const L = [], Rr = [];
    for (const [X, Zz] of pts) { const l = F.rpt(rc, X - 200, Zz), r = F.rpt(rc, X + 200, Zz); if (l && r) { L.push(l); Rr.push(r); } }
    if (L.length < 2) continue;
    ctx.fillStyle = lin(ctx, 0, rc.hy, 0, H, [[0, mixHex(P.blue2, P.ind1, .35)], [1, mixHex(P.night2, P.ind2, .6)]]);
    ctx.beginPath(); L.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); for (let i = Rr.length - 1; i >= 0; i--) ctx.lineTo(Rr[i][0], Rr[i][1]); ctx.closePath(); ctx.fill();
    // walkers on it (towards the junction)
    for (let k = 0; k < 4; k++) {
      const u = ((k / 4 + t * .03) % 1) * .9, X = lerp(x0, x1, u), Zz = lerp(z0, z1, u), p = F.rpt(rc, X, Zz); if (!p) continue;
      const h = 210 * p[2];
      const hd = E.person(ctx, p[0], p[1], h, { dir: x0 < 0 ? 1 : -1, walk: t * 5.5 + k * 2, armR: [2.75, 3.0] });
      F.umbrella(ctx, t, hd.R[0], hd.R[1] - h * .55 * .62, h * .55, { stick: .62, open: 1, lit: [1, 1, 1, 1, 1], glow: .6, outline: 0 });
    }
  }
  ctx.restore();
}
export function stage1000Back(ctx, t, T) { return road12(ctx, t, T, ZSTAGE, { pad: 0, counter: false }); }

// text that rises from its baseline (u 0..1) and sinks back into it (out 0..1): a mask, never a fade
export function rtext(ctx, str, x, y, o, u, out = 0) {
  if (u <= 0 || out >= 1) return;
  const size = o.size ?? 24;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 3000, y - size * 1.25, 6000, size * 1.5); ctx.clip();
  E.glowText(ctx, str, x, y + (1 - expoOut(u)) * size * 1.25 + expoIn(out) * size * 1.25, o);
  ctx.restore();
}
